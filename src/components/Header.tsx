import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { TmdbGenre } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  genres: TmdbGenre[];
  selectedGenre: number | null;
  onGenreChange: (genreId: number | null) => void;
  selectedRating: number | null;
  onRatingChange: (rating: number | null) => void;
}

export const Header = ({
  searchQuery,
  onSearchQueryChange,
  genres,
  selectedGenre,
  onGenreChange,
  selectedRating,
  onRatingChange
}: HeaderProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClear = () => {
    onSearchQueryChange('');
  };

  const handleClearAll = () => {
    onSearchQueryChange('');
    onGenreChange(null);
    onRatingChange(null);
  };

  const filterContent = (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Genre</InputLabel>
        <Select
          value={selectedGenre || ''}
          label="Genre"
          onChange={(e) => onGenreChange(e.target.value ? Number(e.target.value) : null)}
          sx={{
            color: 'white',
            borderRadius: 2,
            '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff4081', borderWidth: 2 },
            '.MuiSvgIcon-root': { color: 'white' },
            backgroundColor: 'rgba(255,255,255,0.05)'
          }}
        >
          <MenuItem value="">All Genres</MenuItem>
          {genres.map((genre) => (
            <MenuItem key={genre.id} value={genre.id}>{genre.name}</MenuItem>
          ))}
          <MenuItem value={16}>Animation</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Minimum Rating</InputLabel>
        <Select
          value={selectedRating || ''}
          label="Minimum Rating"
          onChange={(e) => onRatingChange(e.target.value ? Number(e.target.value) : null)}
          sx={{
            color: 'white',
            borderRadius: 2,
            '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff4081', borderWidth: 2 },
            '.MuiSvgIcon-root': { color: 'white' },
            backgroundColor: 'rgba(255,255,255,0.05)'
          }}
        >
          <MenuItem value="">Any Rating</MenuItem>
          <MenuItem value={9}>⭐ 9+</MenuItem>
          <MenuItem value={8}>⭐ 8+</MenuItem>
          <MenuItem value={7}>⭐ 7+</MenuItem>
          <MenuItem value={6}>⭐ 6+</MenuItem>
          <MenuItem value={5}>⭐ 5+</MenuItem>
        </Select>
      </FormControl>

      {(selectedGenre || selectedRating) && (
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleClearAll}
          sx={{
            borderColor: '#ff4081',
            color: '#ff4081',
            '&:hover': { borderColor: '#ff4081', backgroundColor: 'rgba(255,64,129,0.1)' },
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          Clear All
        </Button>
      )}
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ background: 'linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)', mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        <Toolbar sx={{ flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: "'Poppins', sans-serif", display: { xs: 'none', sm: 'block' } }}>
              🎬 CineFlix
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', fontFamily: "'Poppins', sans-serif", display: { xs: 'block', sm: 'none' } }}>
              🎬
            </Typography>
          </Box>

          {isMobile ? (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton onClick={() => setMobileSearchOpen(!mobileSearchOpen)} sx={{ color: 'white' }}>
                {mobileSearchOpen ? <CloseIcon /> : <SearchIcon />}
              </IconButton>
              <IconButton onClick={() => setMenuOpen(true)} sx={{ color: 'white' }}>
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Box sx={{ flexGrow: 1, minWidth: 200, maxWidth: 500 }}>
                <TextField
                  variant="outlined"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => {
                    console.log("DESKTOP TextField onChange:", e.target.value);
                    onSearchQueryChange(e.target.value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClear} sx={{ color: 'white' }}>
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:focus-within fieldset': { borderColor: '#ff4081', borderWidth: 2 },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 0 0 0 rgba(255, 64, 129, 0)'
                    },
                    '& .MuiOutlinedInput-root.Mui-focused': {
                      boxShadow: '0 0 20px rgba(255, 64, 129, 0.3)'
                    },
                    '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.4)' }
                  }}
                />
              </Box>

              <Button
                variant="contained"
                startIcon={filtersOpen ? <CloseIcon /> : <FilterListIcon />}
                onClick={() => setFiltersOpen(!filtersOpen)}
                sx={{
                  backgroundColor: '#9c27b0',
                  '&:hover': { backgroundColor: '#7b1fa2' },
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Filters
              </Button>
            </Box>
          )}
        </Toolbar>

        {!isMobile && filtersOpen && (
          <Toolbar sx={{ pt: 0, flexWrap: 'wrap', gap: 2 }}>
            {filterContent}
          </Toolbar>
        )}

        <AnimatePresence>
          {isMobile && mobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <Toolbar sx={{ pt: 0, pb: 2 }}>
                <TextField
                  variant="outlined"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => {
                    console.log("MOBILE TextField onChange:", e.target.value);
                    onSearchQueryChange(e.target.value);
                  }}
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClear} sx={{ color: 'white' }}>
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:focus-within fieldset': { borderColor: '#ff4081', borderWidth: 2 },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 0 20px rgba(255, 64, 129, 0.3)'
                    },
                    '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.4)' }
                  }}
                />
              </Toolbar>
            </motion.div>
          )}
        </AnimatePresence>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a2e',
            backgroundImage: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
            width: '80%',
            maxWidth: 350
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              Filters
            </Typography>
            <IconButton onClick={() => setMenuOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <FormControl sx={{ width: '100%', mb: 3 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Genre</InputLabel>
            <Select
              value={selectedGenre || ''}
              label="Genre"
              onChange={(e) => onGenreChange(e.target.value ? Number(e.target.value) : null)}
              sx={{
                color: 'white',
                borderRadius: 2,
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff4081', borderWidth: 2 },
                '.MuiSvgIcon-root': { color: 'white' },
                backgroundColor: 'rgba(255,255,255,0.05)'
              }}
            >
              <MenuItem value="">All Genres</MenuItem>
              {genres.map((genre) => (
                <MenuItem key={genre.id} value={genre.id}>{genre.name}</MenuItem>
              ))}
              <MenuItem value={16}>Animation</MenuItem>
            </Select>
            {selectedGenre && (
              <Button
                size="small"
                onClick={() => onGenreChange(null)}
                sx={{ color: '#ff4081', textTransform: 'none', mt: 1, alignSelf: 'flex-start' }}
              >
                Clear Genre
              </Button>
            )}
          </FormControl>

          <FormControl sx={{ width: '100%', mb: 3 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Minimum Rating</InputLabel>
            <Select
              value={selectedRating || ''}
              label="Minimum Rating"
              onChange={(e) => onRatingChange(e.target.value ? Number(e.target.value) : null)}
              sx={{
                color: 'white',
                borderRadius: 2,
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff4081', borderWidth: 2 },
                '.MuiSvgIcon-root': { color: 'white' },
                backgroundColor: 'rgba(255,255,255,0.05)'
              }}
            >
              <MenuItem value="">Any Rating</MenuItem>
              <MenuItem value={9}>⭐ 9+</MenuItem>
              <MenuItem value={8}>⭐ 8+</MenuItem>
              <MenuItem value={7}>⭐ 7+</MenuItem>
              <MenuItem value={6}>⭐ 6+</MenuItem>
              <MenuItem value={5}>⭐ 5+</MenuItem>
            </Select>
            {selectedRating && (
              <Button
                size="small"
                onClick={() => onRatingChange(null)}
                sx={{ color: '#ff4081', textTransform: 'none', mt: 1, alignSelf: 'flex-start' }}
              >
                Clear Rating
              </Button>
            )}
          </FormControl>

          {(selectedGenre || selectedRating) && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleClearAll}
              fullWidth
              sx={{
                borderColor: '#ff4081',
                color: '#ff4081',
                '&:hover': { borderColor: '#ff4081', backgroundColor: 'rgba(255,64,129,0.1)' },
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Clear All
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
};
