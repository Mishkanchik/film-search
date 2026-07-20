import { ThemeProvider, createTheme } from '@mui/material';
import { useEffect, useRef } from 'react';
import { CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { useTmdbApi, TmdbApiProvider } from './hooks/useTmdbApi';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c27b0',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#0f0f1e',
      paper: '#1a1a2e',
    },
  },
});

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const {
    genres,
    selectedGenres,
    setSelectedGenres,
    selectedRatingRange,
    setSelectedRatingRange,
    searchQuery,
    setSearchQuery,
    language,
    setLanguage
  } = useTmdbApi();

  const navigate = useNavigate();
  const location = useLocation();
  const lastHomeSearchRef = useRef({ searchQuery, selectedGenres, selectedRatingRange });

  // Update last known homepage search parameters
  useEffect(() => {
    if (location.pathname === '/') {
      lastHomeSearchRef.current = { searchQuery, selectedGenres, selectedRatingRange };
    }
  }, [location.pathname, searchQuery, selectedGenres, selectedRatingRange]);

  // Redirect to homepage if search or filter changes while on another page
  useEffect(() => {
    if (location.pathname !== '/') {
      const changed =
        searchQuery !== lastHomeSearchRef.current.searchQuery ||
        JSON.stringify(selectedGenres) !== JSON.stringify(lastHomeSearchRef.current.selectedGenres) ||
        JSON.stringify(selectedRatingRange) !== JSON.stringify(lastHomeSearchRef.current.selectedRatingRange);
      if (changed) {
        navigate('/');
      }
    }
  }, [location.pathname, searchQuery, selectedGenres, selectedRatingRange, navigate]);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f1e 0%, #16213e 100%)' }}>
      <ScrollToTop />
      <Header
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        genres={genres}
        selectedGenres={selectedGenres}
        onGenreChange={setSelectedGenres}
        selectedRatingRange={selectedRatingRange}
        onRatingChange={setSelectedRatingRange}
        language={language}
        onLanguageChange={setLanguage}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <TmdbApiProvider>
          <AppContent />
        </TmdbApiProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
