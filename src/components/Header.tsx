import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  useTheme,
  Slider,
  Checkbox,
  ListItemText,
  OutlinedInput
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
import { Language, translations } from '../lib/translations';

interface HeaderProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  genres: TmdbGenre[];
  selectedGenres: number[];
  onGenreChange: (genreIds: number[]) => void;
  selectedRatingRange: number[];
  onRatingChange: (range: number[]) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header = ({
  searchQuery,
  onSearchQueryChange,
  genres,
  selectedGenres,
  onGenreChange,
  selectedRatingRange,
  onRatingChange,
  language,
  onLanguageChange
}: HeaderProps) => {
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const t = translations[language];

  const handleClear = () => {
    onSearchQueryChange('');
  };

  const handleClearAll = () => {
    onSearchQueryChange('');
    onGenreChange([]);
    onRatingChange([0, 10]);
  };

  const handleLogoClick = () => {
    handleClearAll();
    navigate('/');
  };

  const hasActiveFilters = selectedGenres.length > 0 || selectedRatingRange[0] > 0 || selectedRatingRange[1] < 10;

  const LanguageToggle = () => (
    <Box 
      onClick={() => onLanguageChange(language === 'uk' ? 'en' : 'uk')}
      sx={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '30px',
        padding: '4px',
        cursor: 'pointer',
        width: '80px',
        position: 'relative',
        userSelect: 'none',
        height: '38px',
        boxSizing: 'border-box'
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 3,
          bottom: 3,
          width: '34px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #9c27b0 0%, #ff4081 100%)',
          boxShadow: '0 0 10px rgba(255, 64, 129, 0.5)'
        }}
        animate={{
          left: language === 'uk' ? 4 : 40
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      />
      <Box sx={{ 
        width: '50%', 
        textAlign: 'center', 
        zIndex: 2, 
        fontSize: '0.85rem', 
        fontWeight: 800, 
        color: language === 'uk' ? 'white' : 'rgba(255,255,255,0.4)',
        transition: 'color 0.3s ease'
      }}>
        UA
      </Box>
      <Box sx={{ 
        width: '50%', 
        textAlign: 'center', 
        zIndex: 2, 
        fontSize: '0.85rem', 
        fontWeight: 800, 
        color: language === 'en' ? 'white' : 'rgba(255,255,255,0.4)',
        transition: 'color 0.3s ease'
      }}>
        EN
      </Box>
    </Box>
  );

  const filterContent = (
    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      {/* Genres Multi-select */}
      <FormControl sx={{ minWidth: 240, maxWidth: 300 }}>
        <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>{t.genreLabel}</InputLabel>
        <Select
          multiple
          value={selectedGenres}
          onChange={(e) => onGenreChange(e.target.value as number[])}
          input={<OutlinedInput label={t.genreLabel} />}
          renderValue={(selected) => {
            return selected
              .map((id) => genres.find((g) => g.id === id)?.name)
              .filter(Boolean)
              .join(', ');
          }}
          sx={{
            color: 'white',
            borderRadius: 3,
            '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff4081', borderWidth: 2 },
            '.MuiSvgIcon-root': { color: 'white' },
            backgroundColor: 'rgba(255,255,255,0.04)'
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: '#16162a',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.08)',
                '& .MuiMenuItem-root': {
                  color: 'rgba(255,255,255,0.8)'
                },
                '& .MuiMenuItem-root.Mui-focused': {
                  backgroundColor: 'rgba(255, 64, 129, 0.1)',
                },
                '& .MuiMenuItem-root.Mui-selected': {
                  backgroundColor: 'rgba(255, 64, 129, 0.2)',
                  color: 'white'
                },
                '& .MuiMenuItem-root.Mui-selected:hover': {
                  backgroundColor: 'rgba(255, 64, 129, 0.3)',
                }
              }
            }
          }}
        >
          {genres.map((genre) => (
            <MenuItem key={genre.id} value={genre.id}>
              <Checkbox 
                checked={selectedGenres.includes(genre.id)} 
                sx={{ 
                  color: 'rgba(255,255,255,0.3)', 
                  '&.Mui-checked': { color: '#ff4081' } 
                }} 
              />
              <ListItemText primary={genre.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Ratings Range Slider */}
      <Box sx={{ width: 280, px: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 600 }}>
          {t.ratingRangeLabel}: {selectedRatingRange[0].toFixed(1)} - {selectedRatingRange[1].toFixed(1)}
        </Typography>
        <Slider
          value={selectedRatingRange}
          onChange={(_, newValue) => onRatingChange(newValue as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={10}
          step={0.5}
          sx={{
            color: '#ff4081',
            height: 4,
            '& .MuiSlider-thumb': {
              width: 16,
              height: 16,
              backgroundColor: '#ffffff',
              border: '2px solid #ff4081',
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 0 8px rgba(255, 64, 129, 0.16)'
              }
            },
            '& .MuiSlider-track': {
              border: 'none',
              background: 'linear-gradient(90deg, #9c27b0 0%, #ff4081 100%)'
            },
            '& .MuiSlider-rail': {
              opacity: 0.2,
              backgroundColor: '#ffffff'
            }
          }}
        />
      </Box>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleClearAll}
          sx={{
            borderColor: '#ff4081',
            color: '#ff4081',
            '&:hover': { borderColor: '#ff4081', backgroundColor: 'rgba(255,64,129,0.06)' },
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            ml: 'auto'
          }}
        >
          {t.clearAll}
        </Button>
      )}
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          background: 'linear-gradient(90deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 30, 0.9) 100%)', 
          backdropFilter: 'blur(15px)',
          mb: 4, 
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
          zIndex: 1100
        }}
      >
        <Toolbar sx={{ flexWrap: 'wrap', gap: 2, justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography 
              variant="h4" 
              onClick={handleLogoClick}
              sx={{ 
                fontWeight: 800, 
                fontFamily: "'Outfit', sans-serif", 
                display: { xs: 'none', sm: 'block' },
                background: 'linear-gradient(90deg, #9c27b0 0%, #ff4081 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 15px rgba(255, 64, 129, 0.3)',
                cursor: 'pointer'
              }}
            >
              🎬 CineFlix
            </Typography>
            <Typography 
              variant="h5" 
              onClick={handleLogoClick}
              sx={{ 
                fontWeight: 'bold', 
                fontFamily: "'Outfit', sans-serif", 
                display: { xs: 'block', sm: 'none' },
                cursor: 'pointer'
              }}
            >
              🎬
            </Typography>
          </Box>

          {isMobile ? (
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <LanguageToggle />
              <IconButton onClick={() => setMobileSearchOpen(!mobileSearchOpen)} sx={{ color: 'white' }}>
                {mobileSearchOpen ? <CloseIcon /> : <SearchIcon />}
              </IconButton>
              <IconButton onClick={() => setMenuOpen(true)} sx={{ color: 'white' }}>
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Box sx={{ flexGrow: 1, minWidth: 200, maxWidth: 450 }}>
                <TextField
                  variant="outlined"
                  placeholder={t.searchPlaceholder}
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
                      borderRadius: '16px',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      '& fieldset': { border: 'none' },
                      '&:hover': {
                        border: '1px solid rgba(255, 64, 129, 0.3)',
                        backgroundColor: 'rgba(255,255,255,0.06)'
                      },
                      '&:focus-within': {
                        border: '1px solid #ff4081',
                        boxShadow: '0 0 20px rgba(255, 64, 129, 0.4)'
                      },
                      transition: 'all 0.3s ease'
                    },
                    '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.4)' }
                  }}
                />
              </Box>

              <Button
                variant="outlined"
                startIcon={filtersOpen ? <CloseIcon /> : <FilterListIcon />}
                onClick={() => setFiltersOpen(!filtersOpen)}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(5px)',
                  borderRadius: '16px',
                  px: 3,
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    border: '1px solid #ff4081',
                    backgroundColor: 'rgba(255, 64, 129, 0.05)',
                    boxShadow: '0 0 15px rgba(255, 64, 129, 0.2)'
                  }
                }}
              >
                {t.filters}
              </Button>

              <LanguageToggle />
            </Box>
          )}
        </Toolbar>

        {!isMobile && filtersOpen && (
          <Toolbar sx={{ pb: 2, pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
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
                  placeholder={t.searchPlaceholder}
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
            backgroundColor: '#0f0f1e',
            backgroundImage: 'linear-gradient(180deg, #0f0f1e 0%, #16162a 100%)',
            width: '80%',
            maxWidth: 350,
            color: 'white',
            borderLeft: '1px solid rgba(255,255,255,0.08)'
          }
        }}
      >
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', gap: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>
              {t.filters}
            </Typography>
            <IconButton onClick={() => setMenuOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Genres mobile multiselect */}
          <FormControl sx={{ width: '100%' }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>{t.genreLabel}</InputLabel>
            <Select
              multiple
              value={selectedGenres}
              onChange={(e) => onGenreChange(e.target.value as number[])}
              input={<OutlinedInput label={t.genreLabel} />}
              renderValue={(selected) => {
                return selected
                  .map((id) => genres.find((g) => g.id === id)?.name)
                  .filter(Boolean)
                  .join(', ');
              }}
              sx={{
                color: 'white',
                borderRadius: 2,
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff4081', borderWidth: 2 },
                '.MuiSvgIcon-root': { color: 'white' },
                backgroundColor: 'rgba(255,255,255,0.04)'
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#16162a',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.08)',
                    '& .MuiMenuItem-root.Mui-selected': {
                      backgroundColor: 'rgba(255, 64, 129, 0.2)',
                    }
                  }
                }
              }}
            >
              {genres.map((genre) => (
                <MenuItem key={genre.id} value={genre.id}>
                  <Checkbox 
                    checked={selectedGenres.includes(genre.id)} 
                    sx={{ 
                      color: 'rgba(255,255,255,0.3)', 
                      '&.Mui-checked': { color: '#ff4081' } 
                    }} 
                  />
                  <ListItemText primary={genre.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Rating Range mobile slider */}
          <Box sx={{ px: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 600 }}>
              {t.ratingRangeLabel}: {selectedRatingRange[0].toFixed(1)} - {selectedRatingRange[1].toFixed(1)}
            </Typography>
            <Slider
              value={selectedRatingRange}
              onChange={(_, newValue) => onRatingChange(newValue as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.5}
              sx={{
                color: '#ff4081',
                height: 4,
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  backgroundColor: '#ffffff',
                  border: '2px solid #ff4081',
                },
                '& .MuiSlider-track': {
                  background: 'linear-gradient(90deg, #9c27b0 0%, #ff4081 100%)'
                }
              }}
            />
          </Box>

          {hasActiveFilters && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleClearAll}
              fullWidth
              sx={{
                borderColor: '#ff4081',
                color: '#ff4081',
                '&:hover': { borderColor: '#ff4081', backgroundColor: 'rgba(255,64,129,0.06)' },
                borderRadius: 2,
                textTransform: 'none',
                mt: 'auto'
              }}
            >
              {t.clearAll}
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
};
