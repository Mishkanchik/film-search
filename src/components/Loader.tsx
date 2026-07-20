import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export const Loader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: 3
      }}
    >
      <Box sx={{ display: 'flex', gap: 1 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.5, opacity: 0.3, y: 0 }}
            animate={{
              scale: [0.5, 1.2, 0.5],
              opacity: [0.3, 1, 0.3],
              y: [0, -20, 0]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut'
            }}
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: i % 2 === 0 ? '#9c27b0' : '#ff4081'
            }}
          />
        ))}
      </Box>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
          Loading...
        </Typography>
      </motion.div>
    </Box>
  );
};
