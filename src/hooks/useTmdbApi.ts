import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TmdbMovie, TmdbMovieDetails, TmdbWatchProviders, TmdbGenre, TmdbSearchMoviesResponse, TmdbGenresResponse, TmdbVideo, TmdbVideosResponse } from '../types';

const TMDB_API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

const useTmdbApiState = () => {
  const [popularMovies, setPopularMovies] = useState<TmdbMovie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<TmdbMovie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<TmdbMovie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<TmdbMovie[]>([]);
  const [searchResults, setSearchResults] = useState<TmdbMovie[]>([]);
  const [genres, setGenres] = useState<TmdbGenre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [initialLoading, setInitialLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Fetch genres
  const fetchGenres = useCallback(async () => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=uk-UA`);
      const data: TmdbGenresResponse = await response.json();
      setGenres(data.genres);
    } catch (err) {
      console.error('Failed to fetch genres:', err);
    }
  }, []);

  // Fetch popular movies
  const fetchPopularMovies = useCallback(async () => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=uk-UA&page=1`);
      const data: TmdbSearchMoviesResponse = await response.json();
      setPopularMovies(data.results);
    } catch (err) {
      console.error('Failed to fetch popular movies:', err);
    }
  }, []);

  // Fetch top rated movies
  const fetchTopRatedMovies = useCallback(async () => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=uk-UA&page=1`);
      const data: TmdbSearchMoviesResponse = await response.json();
      setTopRatedMovies(data.results);
    } catch (err) {
      console.error('Failed to fetch top rated movies:', err);
    }
  }, []);

  // Fetch now playing movies
  const fetchNowPlayingMovies = useCallback(async () => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=uk-UA&page=1`);
      const data: TmdbSearchMoviesResponse = await response.json();
      setNowPlayingMovies(data.results);
    } catch (err) {
      console.error('Failed to fetch now playing movies:', err);
    }
  }, []);

  // Fetch upcoming movies
  const fetchUpcomingMovies = useCallback(async () => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=uk-UA&page=1`);
      const data: TmdbSearchMoviesResponse = await response.json();
      setUpcomingMovies(data.results);
    } catch (err) {
      console.error('Failed to fetch upcoming movies:', err);
    }
  }, []);

  // Search or filter movies
  const fetchMovies = useCallback(async (query: string, genreId: number | null, rating: number | null, page: number) => {
    console.log("fetchMovies called with:", { query, genreId, rating, page });
    setSearchLoading(true);
    setError(null);
    try {
      let url = '';
      if (query) {
        url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=uk-UA&query=${encodeURIComponent(query)}&page=${page}`;
      } else {
        const params = new URLSearchParams({
          api_key: TMDB_API_KEY,
          language: 'uk-UA',
          page: page.toString()
        });
        if (genreId) params.append('with_genres', genreId.toString());
        if (rating) params.append('vote_average.gte', rating.toString());
        url = `${TMDB_BASE_URL}/discover/movie?${params.toString()}`;
      }
      console.log("Built URL:", url);
      const response = await fetch(url);
      const data: TmdbSearchMoviesResponse = await response.json();
      console.log("Response data:", data);
      setSearchResults(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError('Не вдалося завантажити фільми');
      console.error("Error fetching movies:", err);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Fetch movie details
  const fetchMovieDetails = useCallback(async (movieId: number): Promise<TmdbMovieDetails | null> => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=uk-UA`);
      const data: TmdbMovieDetails = await response.json();
      return data;
    } catch (err) {
      console.error('Failed to fetch movie details:', err);
      return null;
    }
  }, []);

  // Fetch watch providers
  const fetchWatchProviders = useCallback(async (movieId: number): Promise<TmdbWatchProviders | null> => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`);
      const data: TmdbWatchProviders = await response.json();
      return data;
    } catch (err) {
      console.error('Failed to fetch watch providers:', err);
      return null;
    }
  }, []);

  // Fetch movie videos (trailers)
  const fetchMovieVideos = useCallback(async (movieId: number): Promise<TmdbVideo[]> => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=uk-UA`);
      const data: TmdbVideosResponse = await response.json();
      return data.results;
    } catch (err) {
      console.error('Failed to fetch movie videos:', err);
      return [];
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setInitialLoading(true);
      await Promise.all([
        fetchGenres(),
        fetchPopularMovies(),
        fetchTopRatedMovies(),
        fetchNowPlayingMovies(),
        fetchUpcomingMovies()
      ]);
      setInitialLoading(false);
    };
    fetchInitialData();
  }, [fetchGenres, fetchPopularMovies, fetchTopRatedMovies, fetchNowPlayingMovies, fetchUpcomingMovies]);

  // Set isSearchMode and fetch when search parameters or page changes
  useEffect(() => {
    if (searchQuery || selectedGenre || selectedRating) {
      setIsSearchMode(true);
      fetchMovies(searchQuery, selectedGenre, selectedRating, currentPage);
    } else {
      setIsSearchMode(false);
      setSearchResults([]);
    }
  }, [searchQuery, selectedGenre, selectedRating, currentPage, fetchMovies]);

  // Reset page to 1 when search parameters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, selectedRating]);

  return {
    popularMovies,
    topRatedMovies,
    nowPlayingMovies,
    upcomingMovies,
    searchResults,
    genres,
    selectedGenre,
    setSelectedGenre,
    selectedRating,
    setSelectedRating,
    searchQuery,
    setSearchQuery,
    initialLoading,
    searchLoading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    isSearchMode,
    fetchMovieDetails,
    fetchWatchProviders,
    fetchMovieVideos,
    TMDB_IMAGE_BASE
  };
};

const TmdbApiContext = createContext<ReturnType<typeof useTmdbApiState> | null>(null);

export const TmdbApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const api = useTmdbApiState();
  return React.createElement(TmdbApiContext.Provider, { value: api }, children);
};

export const useTmdbApi = () => {
  const context = useContext(TmdbApiContext);
  if (!context) {
    throw new Error('useTmdbApi must be used within a TmdbApiProvider');
  }
  return context;
};
