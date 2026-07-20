import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Pagination as MuiPagination, IconButton, CircularProgress, Button } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { MovieCard } from '../components/MovieCard';
import { MovieSlider } from '../components/MovieSlider';
import { Loader } from '../components/Loader';
import { useTmdbApi } from '../hooks/useTmdbApi';
import { translations } from '../lib/translations';

export const HomePage = () => {
  const {
    popularMovies,
    topRatedMovies,
    nowPlayingMovies,
    upcomingMovies,
    searchResults,
    genres,
    selectedGenres,
    searchQuery,
    setSearchQuery,
    initialLoading,
    searchLoading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    isSearchMode,
    TMDB_IMAGE_BASE,
    language
  } = useTmdbApi();

  const t = translations[language];

  console.log("HomePage: isSearchMode:", isSearchMode, "searchResults:", searchResults);

  const [heroIndex, setHeroIndex] = useState(0);

  const heroMovies = popularMovies;

  useEffect(() => {
    if (heroMovies.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  const nextHero = () => {
    if (heroMovies.length === 0) return;
    setHeroIndex((prev) => (prev + 1) % heroMovies.length);
  };

  const prevHero = () => {
    if (heroMovies.length === 0) return;
    setHeroIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
  };

  if (initialLoading) {
    return <Loader />;
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="xl">
        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {!isSearchMode ? (
          <>
            {/* Hero Slider Section */}
            {heroMovies.length > 0 && (
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 350, md: 500 },
                  borderRadius: 4,
                  overflow: 'hidden',
                  mb: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={heroIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.5)), url(${TMDB_IMAGE_BASE}/original${heroMovies[heroIndex].backdrop_path})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                </AnimatePresence>

                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={heroIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          color: 'white',
                          fontWeight: 'bold',
                          mb: 2,
                          fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
                          textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
                        }}
                      >
                        {heroMovies[heroIndex].title}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'rgba(255,255,255,0.9)',
                          mb: 3,
                          maxWidth: 600,
                          fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
                          textShadow: '1px 1px 4px rgba(0,0,0,0.8)'
                        }}
                      >
                        {heroMovies[heroIndex].overview}
                      </Typography>
                    </motion.div>
                  </AnimatePresence>
                </Container>

                <IconButton
                  onClick={prevHero}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                    zIndex: 2
                  }}
                >
                  <ChevronLeft />
                </IconButton>

                <IconButton
                  onClick={nextHero}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                    zIndex: 2
                  }}
                >
                  <ChevronRight />
                </IconButton>

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 1,
                    zIndex: 2
                  }}
                >
                  {heroMovies.map((_, i) => (
                    <Box
                      key={i}
                      onClick={() => setHeroIndex(i)}
                      sx={{
                        width: heroIndex === i ? 32 : 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: heroIndex === i ? '#ff4081' : 'rgba(255,255,255,0.3)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Movie Sliders */}
            <MovieSlider title={`🎬 ${t.nowPlaying}`} movies={nowPlayingMovies} imageBaseUrl={TMDB_IMAGE_BASE} />
            <MovieSlider title={`🚀 ${t.upcoming}`} movies={upcomingMovies} imageBaseUrl={TMDB_IMAGE_BASE} />
            <MovieSlider title={`🔥 ${t.popular}`} movies={popularMovies} imageBaseUrl={TMDB_IMAGE_BASE} />
            <MovieSlider title={`⭐ ${t.topRated}`} movies={topRatedMovies} imageBaseUrl={TMDB_IMAGE_BASE} />
          </>
        ) : (
          /* Search/Filter Results */
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {searchQuery
                  ? `${t.searchResults}: "${searchQuery}"`
                  : t.searchResults}
              </Typography>
              {searchLoading && <CircularProgress sx={{ color: '#ff4081' }} size={32} />}
            </Box>
            {searchLoading && searchResults.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#ff4081' }} />
              </Box>
            ) : (
              <>
                <Grid container spacing={3}>
                  {searchResults.map((movie, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <MovieCard movie={movie} imageBaseUrl={TMDB_IMAGE_BASE} />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <MuiPagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(_, page) => setCurrentPage(page)}
                      color="primary"
                      size="large"
                      sx={{
                        '& .MuiPaginationItem-root': { color: 'white' },
                        '& .Mui-selected': { backgroundColor: '#9c27b0', '&:hover': { backgroundColor: '#7b1fa2' } }
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};
