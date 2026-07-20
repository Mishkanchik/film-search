import { motion } from 'framer-motion';
import { Card, CardMedia, CardContent, Typography, Box, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TmdbMovie } from '../types';

interface MovieCardProps {
  movie: TmdbMovie;
  imageBaseUrl: string;
}

export const MovieCard = ({ movie, imageBaseUrl }: MovieCardProps) => {
  const navigate = useNavigate();

  const posterUrl = movie.poster_path
    ? `${imageBaseUrl}/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300 }}
      style={{ cursor: 'pointer', height: '100%' }}
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          backgroundColor: '#1a1a2e',
          '&:hover': { boxShadow: '0 16px 50px rgba(0,0,0,0.6)' }
        }}
      >
        <CardMedia
          component="img"
          image={posterUrl}
          alt={movie.title}
          sx={{ height: { xs: 280, sm: 320, md: 350 }, objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1, px: 2, py: 1.5 }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ color: 'white', fontWeight: 'bold', flexGrow: 1, fontSize: { xs: '1rem', sm: '1.1rem' } }} noWrap>
            {movie.title}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {movie.release_date?.split('-')[0] || 'N/A'}
            </Typography>
            {movie.vote_average > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Rating
                  value={movie.vote_average / 2}
                  readOnly
                  precision={0.1}
                  size="small"
                  sx={{ color: '#ffd700' }}
                />
                <Typography variant="caption" sx={{ color: '#ffd700', fontWeight: 'bold' }}>
                  {movie.vote_average.toFixed(1)}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};
