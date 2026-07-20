import { useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => scroll('left')}
            sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
          >
            <ArrowBackIos />
          </IconButton>
          <IconButton
            onClick={() => scroll('right')}
            sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
          >
            <ArrowForwardIos />
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
