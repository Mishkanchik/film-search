import { useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { MovieCard } from './MovieCard';
import { TmdbMovie } from '../types';

interface MovieSliderProps {
  title: string;
  movies: TmdbMovie[];
  imageBaseUrl: string;
}

export const MovieSlider = ({ title, movies, imageBaseUrl }: MovieSliderProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <IconButton
            onClick={() => scroll('left')}
            sx={{ 
              color: 'white', 
              background: 'rgba(255, 255, 255, 0.04)', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(5px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              width: 48,
              height: 48,
              '&:hover': { 
                background: 'linear-gradient(135deg, #9c27b0 0%, #ff4081 100%)',
                borderColor: 'transparent',
                boxShadow: '0 0 20px rgba(255, 64, 129, 0.55)',
                transform: 'scale(1.08)'
              }
            }}
          >
            <ChevronLeft sx={{ fontSize: 28 }} />
          </IconButton>
          <IconButton
            onClick={() => scroll('right')}
            sx={{ 
              color: 'white', 
              background: 'rgba(255, 255, 255, 0.04)', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(5px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              width: 48,
              height: 48,
              '&:hover': { 
                background: 'linear-gradient(135deg, #9c27b0 0%, #ff4081 100%)',
                borderColor: 'transparent',
                boxShadow: '0 0 20px rgba(255, 64, 129, 0.55)',
                transform: 'scale(1.08)'
              }
            }}
          >
            <ChevronRight sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
      </Box>
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          pb: 2
        }}
      >
        {movies.map((movie, index) => (
          <Box
            key={movie.id}
            sx={{ minWidth: { xs: 200, sm: 250, md: 280 } }}
          >
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MovieCard movie={movie} imageBaseUrl={imageBaseUrl} />
            </motion.div>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
