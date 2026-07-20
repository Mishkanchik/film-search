import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Chip, Rating, Button, Avatar, Tooltip } from '@mui/material';
import { ArrowBack as ArrowBackIcon, PlayArrow as PlayArrowIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { TmdbMovieDetails, TmdbWatchProviders, TmdbVideo } from '../types';
import { useTmdbApi } from '../hooks/useTmdbApi';
import { Loader } from '../components/Loader';
import { ReviewSummaryCard } from '../components/ui/card-2';
import { translations } from '../lib/translations';

export const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchMovieDetails, fetchWatchProviders, fetchMovieVideos, TMDB_IMAGE_BASE, language } = useTmdbApi();
  const [movie, setMovie] = useState<TmdbMovieDetails | null>(null);
  const [watchProviders, setWatchProviders] = useState<TmdbWatchProviders | null>(null);
  const [videos, setVideos] = useState<TmdbVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const t = translations[language];
  const backLabel = language === 'uk' ? 'Назад' : 'Back';
  const minLabel = language === 'uk' ? 'хв' : 'min';
  const seeAllOptionsLabel = language === 'uk' ? 'Усі варіанти' : 'See All Options';

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) return;
      setLoading(true);
      const [movieData, providersData, videosData] = await Promise.all([
        fetchMovieDetails(Number(id)),
        fetchWatchProviders(Number(id)),
        fetchMovieVideos(Number(id))
      ]);
      setMovie(movieData);
      setWatchProviders(providersData);
      setVideos(videosData);
      setLoading(false);
    };
    loadMovie();
  }, [id, fetchMovieDetails, fetchWatchProviders, fetchMovieVideos, language]);

  if (loading) {
    return <Loader />;
  }

  if (!movie) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h4" sx={{ color: 'white' }}>
          {language === 'uk' ? 'Фільм не знайдено' : 'Movie not found'}
        </Typography>
      </Box>
    );
  }

  const backdropUrl = movie.backdrop_path ? `${TMDB_IMAGE_BASE}/original${movie.backdrop_path}` : '';
  const posterUrl = movie.poster_path ? `${TMDB_IMAGE_BASE}/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster';

  // Get US providers (or UA / first available)
  const availableProviders = watchProviders?.results?.UA || watchProviders?.results?.US || null;
  
  // Free streaming search link
  const freeWatchLink = `https://www.google.com/search?q=${encodeURIComponent(movie.title + ' watch free online')}`;
  
  // Find trailer
  const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Backdrop section */}
      {backdropUrl && (
        <Box
          sx={{
            position: 'relative',
            height: { xs: 300, md: 500 },
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mb: 6
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to top, #0f0f1e, rgba(0,0,0,0.5))'
            }}
          />
          <Container maxWidth="xl" sx={{ position: 'relative', pt: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: '#ff4081', color: '#ff4081' } }}
              variant="outlined"
            >
              {backLabel}
            </Button>
          </Container>
        </Box>
      )}

      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6 }}>
            {/* Poster & Rating Card */}
            <Box sx={{ flexShrink: 0, width: { xs: '100%', md: 350 }, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
              <img
                src={posterUrl}
                alt={movie.title}
                style={{ width: '100%', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
              />
              {movie.vote_average > 0 && (
                <ReviewSummaryCard
                  rating={movie.vote_average}
                  reviewCount={movie.vote_count}
                  reviewsLabel={t.reviews}
                  summaryText={`${t.audienceRating}: ${movie.vote_average.toFixed(1)} / 10 (${movie.vote_count} ${t.votes})`}
                />
              )}
            </Box>

            {/* Details */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold', mb: 2, fontSize: { xs: '1.5rem', md: '3rem' } }}>
                {movie.title}
              </Typography>

              {movie.tagline && (
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, fontStyle: 'italic' }}>
                  "{movie.tagline}"
                </Typography>
              )}

              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                {movie.release_date && (
                  <Chip label={movie.release_date.split('-')[0]} color="primary" />
                )}
                {movie.runtime > 0 && (
                  <Chip label={`${movie.runtime} ${minLabel}`} color="secondary" />
                )}
                {movie.genres.map((genre) => (
                  <Chip key={genre.id} label={genre.name} variant="outlined" />
                ))}
              </Box>

              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                {t.overview}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 6, lineHeight: 1.8 }}>
                {movie.overview}
              </Typography>

              {/* Watch Free Button */}
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                endIcon={<OpenInNewIcon />}
                href={freeWatchLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  mb: 4,
                  background: 'linear-gradient(90deg, #9c27b0, #ff4081)',
                  '&:hover': { background: 'linear-gradient(90deg, #7b1fa2, #f50057)' },
                  fontSize: '1.1rem',
                  py: 1.5,
                  px: 4
                }}
              >
                {t.watchForFree}
              </Button>

              {/* Trailer */}
              {trailer && (
                <Box sx={{ mb: 6 }}>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                    {t.trailer}
                  </Typography>
                  <Box sx={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 4 }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.key}`}
                      title={trailer.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                    />
                  </Box>
                </Box>
              )}

              {/* Where to watch */}
              {availableProviders && (
                <Box sx={{ mb: 6 }}>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                    {t.whereToWatch}
                  </Typography>

                  {availableProviders.flatrate && availableProviders.flatrate.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        {t.subscription}:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {availableProviders.flatrate.map((provider) => (
                          <Tooltip key={provider.provider_id} title={provider.provider_name}>
                            <a
                              href={availableProviders.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: 'none' }}
                            >
                              <Avatar
                                src={`${TMDB_IMAGE_BASE}/w92${provider.logo_path}`}
                                alt={provider.provider_name}
                                sx={{ width: 64, height: 64, borderRadius: 2, cursor: 'pointer', '&:hover': { transform: 'scale(1.1)', transition: 'transform 0.2s' } }}
                              />
                            </a>
                          </Tooltip>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {availableProviders.rent && availableProviders.rent.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        {t.rent}:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {availableProviders.rent.map((provider) => (
                          <Tooltip key={provider.provider_id} title={provider.provider_name}>
                            <a
                              href={availableProviders.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: 'none' }}
                            >
                              <Avatar
                                src={`${TMDB_IMAGE_BASE}/w92${provider.logo_path}`}
                                alt={provider.provider_name}
                                sx={{ width: 64, height: 64, borderRadius: 2, cursor: 'pointer', '&:hover': { transform: 'scale(1.1)', transition: 'transform 0.2s' } }}
                              />
                            </a>
                          </Tooltip>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {availableProviders.buy && availableProviders.buy.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        {t.buy}:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {availableProviders.buy.map((provider) => (
                          <Tooltip key={provider.provider_id} title={provider.provider_name}>
                            <a
                              href={availableProviders.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: 'none' }}
                            >
                              <Avatar
                                src={`${TMDB_IMAGE_BASE}/w92${provider.logo_path}`}
                                alt={provider.provider_name}
                                sx={{ width: 64, height: 64, borderRadius: 2, cursor: 'pointer', '&:hover': { transform: 'scale(1.1)', transition: 'transform 0.2s' } }}
                              />
                            </a>
                          </Tooltip>
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Button
                    variant="outlined"
                    startIcon={<PlayArrowIcon />}
                    href={availableProviders.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 2, borderColor: '#9c27b0', color: '#9c27b0', '&:hover': { borderColor: '#ff4081', color: '#ff4081' } }}
                  >
                    {seeAllOptionsLabel}
                  </Button>
                </Box>
              )}

              {/* Additional info */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 3 }}>
                {movie.status && (
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      {t.status}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {movie.status}
                    </Typography>
                  </Box>
                )}
                {movie.production_companies.length > 0 && (
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      {t.studio}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {movie.production_companies.map(c => c.name).join(', ')}
                    </Typography>
                  </Box>
                )}
                {movie.production_countries.length > 0 && (
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      {t.country}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {movie.production_countries.map(c => c.name).join(', ')}
                    </Typography>
                  </Box>
                )}
                {movie.spoken_languages.length > 0 && (
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      {t.languageLabel}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {movie.spoken_languages.map(l => l.english_name || l.name).join(', ')}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};
