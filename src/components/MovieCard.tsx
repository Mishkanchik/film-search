import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Card, CardMedia, CardContent, Typography, Box, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TmdbMovie } from '../types';
import React from 'react';

interface MovieCardProps {
  movie: TmdbMovie;
  imageBaseUrl: string;
}

export const MovieCard = ({ movie, imageBaseUrl }: MovieCardProps) => {
  const navigate = useNavigate();

  const posterUrl = movie.poster_path
    ? `${imageBaseUrl}/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  // 3D Perspective Tilt Values
  const x = useMotionValue(150);
  const y = useMotionValue(200);

  const rotateX = useTransform(y, [0, 400], [15, -15]);
  const rotateY = useTransform(x, [0, 300], [-15, 15]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    x.set(mouseX * (300 / width));
    y.set(mouseY * (400 / height));
  }

  function handleMouseLeave() {
    x.set(150);
    y.set(200);
  }

  return (
    <div style={{ perspective: 1000, height: '100%' }}>
      <motion.div
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          cursor: 'pointer',
          height: '100%',
          transformStyle: 'preserve-3d'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        onClick={() => navigate(`/movie/${movie.id}`)}
      >
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 4,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.6) 0%, rgba(15, 15, 30, 0.8) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              borderColor: 'rgba(255, 64, 129, 0.4)',
              boxShadow: '0 0 30px rgba(156, 39, 176, 0.35)',
            }
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
    </div>
  );
};
