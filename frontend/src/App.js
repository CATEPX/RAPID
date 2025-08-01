import React, { useState, useEffect } from 'react';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, Typography, TextField, Button, Paper, CircularProgress, AppBar, Toolbar, Divider, Fade, List, ListItem, ListItemIcon, ListItemText, Chip, Tooltip, LinearProgress, IconButton } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PublicIcon from '@mui/icons-material/Public';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import Dashboard from './Dashboard';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#9263e9' },     // Softer purple
    secondary: { main: '#38bec9' },   // Softer teal
    background: {
      default: '#121218',             // Slightly lighter black for better readability
      paper: '#1e1e2d',               // Softer dark blue-gray
    },
    success: { main: '#2bb07f' },     // Softer green
    warning: { main: '#e69a42' },     // Softer orange
    error: { main: '#e05c7d' },       // Softer red
    info: { main: '#5e96f2' },        // Softer blue
    text: {
      primary: '#f2f2fa',             // Brighter white for better contrast
      secondary: '#c5c5d6',           // Lighter gray for better readability
    },
    divider: '#383846',               // Subtle divider
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1e1e2d 0%, #2e2b5d 100%)', // More subtle gradient
          color: '#f2f2fa',
          borderBottom: '2px solid #9263e9',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 4px 30px rgba(146, 99, 233, 0.12)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #1e1e2d 0%, #252536 100%)', // More subtle gradient
          border: '1px solid #383846',
          borderRadius: 24,
          backdropFilter: 'blur(15px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #9263e9 0%, #7e58d9 100%)', // Softer gradient
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(135deg, #7e58d9 0%, #6a48c8 100%)',
            transform: 'translateY(-3px)',
            boxShadow: '0 12px 25px rgba(146, 99, 233, 0.25)',
          },
          borderRadius: 18,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          fontWeight: 600,
          letterSpacing: '0.5px',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
    h4: { fontWeight: 800, color: '#fa7a94', letterSpacing: '-0.025em', lineHeight: 1.2 }, // Brighter red
    h5: { fontWeight: 700, color: '#4ad6e2', letterSpacing: '-0.015em', lineHeight: 1.3 }, // Brighter teal
    h6: { fontWeight: 600, color: '#fa7a94', letterSpacing: '-0.01em', lineHeight: 1.4 }, // Brighter red
    body1: { lineHeight: 1.7, letterSpacing: '0.01em', color: '#f2f2fa' }, // Explicit color
    body2: { lineHeight: 1.6, letterSpacing: '0.005em', color: '#c5c5d6' }, // Explicit color
  },
  shape: { borderRadius: 16 },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3887d1' },     // Changed to blue to match theme
    secondary: { main: '#2aa1b3' },   // Keeping the softer teal
    background: {
      default: '#394c5e',             // Medium blue-teal shade, distinct from dark mode
      paper: '#4a5f73',               // Lighter blue-teal shade
    },
    success: { main: '#2a9d8f' },     // Keeping the softer green
    warning: { main: '#e9a046' },     // Keeping the softer orange
    error: { main: '#d45565' },       // Keeping the softer red
    info: { main: '#4782da' },        // Keeping the softer blue
    text: {
      primary: '#f0f7ff',             // Brighter, slightly blue-tinted text
      secondary: '#c8dbf0',           // Brighter secondary text with blue tint
    },
    divider: '#5a6e80',               // Subtle divider that complements the theme
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #4a5f73 0%, #405466 100%)', // Blue-teal gradient
          color: '#f0f7ff',
          borderBottom: '2px solid #3887d1',  // Changed to blue
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #4a5f73 0%, #405466 100%)', // Blue-teal gradient
          border: '1px solid #5a6e80',
          borderRadius: 24,
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #3887d1 0%, #2a75b8 100%)', // Changed to blue gradient
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(135deg, #4a9be3 0%, #3887d1 100%)', // Changed to lighter blue gradient
            transform: 'translateY(-3px)',
            boxShadow: '0 12px 25px rgba(56, 135, 209, 0.25)', // Changed shadow color
          },
          borderRadius: 18,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          fontWeight: 600,
          letterSpacing: '0.5px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(62, 79, 96, 0.7)',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#5a6e80',
          },
          '& .MuiInputLabel-root': {
            color: '#c8dbf0',
          },
          '& .MuiOutlinedInput-input': {
            color: '#f0f7ff',
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(74, 95, 115, 0.6)',
        }
      }
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
    h4: { fontWeight: 800, color: '#ff758f', letterSpacing: '-0.025em', lineHeight: 1.2 }, // Brighter red with blue undertone
    h5: { fontWeight: 700, color: '#41d6e4', letterSpacing: '-0.015em', lineHeight: 1.3 }, // Brighter teal
    h6: { fontWeight: 600, color: '#ff758f', letterSpacing: '-0.01em', lineHeight: 1.4 }, // Brighter red with blue undertone
    body1: { lineHeight: 1.7, letterSpacing: '0.01em', color: '#f0f7ff' }, // Explicit color
    body2: { lineHeight: 1.6, letterSpacing: '0.005em', color: '#c8dbf0' }, // Explicit color
  },
  shape: { borderRadius: 16 },
});

const scoringLegend = [
  { range: '80-100', label: 'High Trust', color: 'success' },
  { range: '60-79', label: 'Moderate Trust', color: 'warning' },
  { range: '0-59', label: 'Low Trust', color: 'error' },
];

function getScoreColor(theme, score) {
  if (score >= 80) return theme.palette.success.main;
  if (score >= 60) return theme.palette.warning.main;
  return theme.palette.error.main;
}

const Logo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="19" cy="19" r="18" stroke="currentColor" strokeWidth="2.5" />
      <path d="M19 7V19L28 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="19" cy="19" r="5" stroke="currentColor" strokeWidth="2" />
      <path d="M19 2a17 17 0 1 1 0 34a17 17 0 1 1 0-34z" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    </svg>
  </Box>
);

function LearnMorePage() {
  return (
    <Box sx={{ width: '100%', maxWidth: 700, mx: 'auto', mt: 8, mb: 4, px: 2 }}>
      <Paper elevation={8} sx={{ p: 6, borderRadius: 6, boxShadow: theme => `0 12px 40px 0 ${theme.palette.primary.main}20` }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 800, mb: 3, textAlign: 'center' }}>
          How RAPID Works
        </Typography>
        <Divider sx={{ mb: 4, bgcolor: 'primary.main', height: 2 }} />
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
          RAPID (Real Time AI Phishing and Detection) analyzes website URLs using a set of security heuristics to help you avoid phishing and insecure domains. Here's what goes into your trust score:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon><PublicIcon color="success" /></ListItemIcon>
            <ListItemText primary="Website Accessibility" secondary="Checks if the website is reachable and responds to requests." />
          </ListItem>
          <ListItem>
            <ListItemIcon><LockIcon color="success" /></ListItemIcon>
            <ListItemText primary="SSL Certificate" secondary="Checks if the website uses a valid SSL certificate (🔒)." />
          </ListItem>
          <ListItem>
            <ListItemIcon><CalendarMonthIcon color="success" /></ListItemIcon>
            <ListItemText primary="Domain Age" secondary="Older domains are generally more trustworthy. New domains are riskier." />
          </ListItem>
          <ListItem>
            <ListItemIcon><WarningAmberIcon color="warning" /></ListItemIcon>
            <ListItemText primary="Suspicious Patterns" secondary="Detects suspicious TLDs, too many subdomains, IP-like domains, URL shorteners, and non-Latin characters." />
          </ListItem>
        </List>
        <Divider sx={{ my: 4, bgcolor: 'primary.main', opacity: 0.4, height: 2 }} />
        <Typography variant="h6" sx={{ color: 'primary.main', mb: 2, fontWeight: 700, fontSize: '1.3rem' }}>
          Trust Score
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.7 }}>
          The trust score is calculated based on the above checks. A higher score means the URL is more likely to be safe. Scores are color-coded:
        </Typography>
        <List>
          <ListItem><Chip label="High Trust (80-100)" sx={{ background: theme => theme.palette.success.main + '20', color: theme => theme.palette.success.main, fontWeight: 600 }} /></ListItem>
          <ListItem><Chip label="Moderate Trust (60-79)" sx={{ background: theme => theme.palette.warning.main + '20', color: theme => theme.palette.warning.main, fontWeight: 600 }} /></ListItem>
          <ListItem><Chip label="Low Trust (0-59)" sx={{ background: theme => theme.palette.error.main + '20', color: theme => theme.palette.error.main, fontWeight: 600 }} /></ListItem>
        </List>
        <Divider sx={{ my: 4, bgcolor: 'primary.main', opacity: 0.4, height: 2 }} />
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '1rem' }}>
          RAPID does not guarantee absolute safety. Always use caution and look for other signs of phishing or malicious intent.
        </Typography>
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'underline', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.5px' }}>
            ← Back to RAPID
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}

function MainApp({ isDarkMode }) {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleChange = (e) => {
    setUrl(e.target.value);
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.detail || 'Analysis failed.');
      }
    } catch (err) {
      setError('Could not connect to backend.');
    }
    setLoading(false);
  };

  function domainAgeCheck(age) {
    if (age == null) return { pass: false, text: 'Unknown' };
    if (age > 730) return { pass: true, text: `${age} days (2+ years)` };
    if (age > 365) return { pass: true, text: `${age} days (1+ year)` };
    if (age > 30) return { pass: true, text: `${age} days (1+ month)` };
    return { pass: false, text: `${age} days (new domain)` };
  }

  return (
    <Container maxWidth={false} disableGutters sx={{ background: theme => theme.palette.background.default, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 0 }}>
      <Box sx={{ width: '100%', maxWidth: 540, mt: 10, mb: 4, px: 2 }}>
        <Paper elevation={8} sx={{ p: { xs: 3, sm: 6 }, borderRadius: 6, boxShadow: (theme) => `0 12px 40px 0 ${theme.palette.primary.main}20` }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <TextField
              label="Example: google.com or https://google.com/"
              variant="outlined"
              value={url}
              onChange={handleChange}
              required
              fullWidth
              autoFocus
              disabled={loading}
            />
            <Button variant="contained" color="primary" type="submit" size="large" disabled={loading} sx={{ fontWeight: 700, letterSpacing: 1.2, py: 2, borderRadius: 3, fontSize: '1.1rem', minHeight: 56 }}>
              {loading ? <CircularProgress size={26} color="inherit" /> : 'Check URL'}
            </Button>
          </form>
          <Fade in={!!result} timeout={600}>
            <Box sx={{ mt: 8 }}>
              {result && (
                <Paper elevation={6} sx={{ p: 5, borderRadius: 5, border: `3px solid ${getScoreColor(theme, result.trust_score)}`, boxShadow: `0 8px 32px 0 ${getScoreColor(theme, result.trust_score)}30` }}>
                  <Typography variant="h6" align="center" sx={{ color: getScoreColor(theme, result.trust_score), fontWeight: 800, mb: 3, fontSize: '1.4rem', letterSpacing: '0.5px' }}>
                    Trust Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <LinearProgress variant="determinate" value={result.trust_score} sx={{ height: 16, borderRadius: 8, width: '80%', '& .MuiLinearProgress-bar': { backgroundColor: getScoreColor(theme, result.trust_score) } }} />
                    <Typography variant="h5" sx={{ ml: 2, color: getScoreColor(theme, result.trust_score), fontWeight: 700 }}>{result.trust_score}</Typography>
                  </Box>
                  <Typography variant="body1" align="center" sx={{ color: getScoreColor(theme, result.trust_score), fontWeight: 700, mb: 3, fontSize: '1.1rem', letterSpacing: '0.3px' }}>
                    {result.is_legitimate ? 'Legitimate (Safe)' : 'Suspicious (Potential Risk)'}
                  </Typography>
                  <Divider sx={{ my: 3, bgcolor: getScoreColor(theme, result.trust_score), opacity: 0.4, height: 2 }} />
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        {result.is_accessible ? <PublicIcon color="success" /> : <PublicIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText primary="Website Accessible" secondary={result.is_accessible ? 'Website is accessible' : 'Not reachable'} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {result.has_ssl && result.ssl_valid ? <LockIcon color="success" /> : <LockOpenIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText primary="Valid SSL Certificate" secondary={result.has_ssl && result.ssl_valid ? 'SSL is valid' : result.has_ssl ? 'SSL has issues' : 'No valid SSL'} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {domainAgeCheck(result.domain_age_days).pass ? <CalendarMonthIcon color="success" /> : <CalendarMonthIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText primary="Domain Age" secondary={domainAgeCheck(result.domain_age_days).text} />
                    </ListItem>
                    {result.suspicious_patterns && result.suspicious_patterns.map((pattern, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <WarningAmberIcon color="warning" />
                        </ListItemIcon>
                        <ListItemText primary={pattern.pattern} secondary={pattern.description} />
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 3, bgcolor: getScoreColor(theme, result.trust_score), opacity: 0.4, height: 2 }} />
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 2, fontWeight: 600, fontFamily: 'Inter, Arial, sans-serif', fontSize: '1.1rem' }}>
                    Analysis Summary
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: 'Inter, Arial, sans-serif', lineHeight: 1.7 }}>
                      {result.analysis_summary}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 3, fontFamily: 'Inter, Arial, sans-serif', opacity: 0.8 }}>
                    Analyzed at: {new Date(result.timestamp).toLocaleString()}
                  </Typography>
                </Paper>
              )}
            </Box>
          </Fade>
        </Paper>
      </Box>
      <Fade in={!result && !error} timeout={600}>
        <Box sx={{ width: '100%', maxWidth: 540, mb: 4, px: 2 }}>
          <Paper elevation={0} sx={{ p: 4, background: 'transparent', textAlign: 'left' }}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 3, fontWeight: 700, fontSize: '1.3rem', letterSpacing: '0.3px' }}>
              How does RAPID score URLs?
            </Typography>
            <List>
              {scoringLegend.map((item, idx) => (
                <ListItem key={idx}>
                  <ListItemIcon>
                    <Chip label={item.label} sx={{ bgcolor: theme.palette[item.color].main, color: theme.palette.getContrastText(theme.palette[item.color].main), fontWeight: 600 }} />
                  </ListItemIcon>
                  <ListItemText primary={`Score ${item.range}: ${item.label}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
}

function PageWrapper({ children, toggleTheme, isDarkMode }) {
  return (
    <>
      <AppBar position="static" color="primary" elevation={2} sx={{ borderBottom: theme => `1.5px solid ${theme.palette.divider}` }}>
        <Toolbar sx={{ minHeight: 72, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', px: 2 }}>
          <Logo />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 2.5, fontSize: '1.6rem' }}>
              RAPID
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 500, letterSpacing: 1.2, fontSize: 16, color: 'text.secondary', mt: 0.5 }}>
              Real Time AI Phishing and Detection
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
            <Tooltip title="Home">
              <IconButton color="inherit" component={Link} to="/">
                <HomeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Dashboard">
              <IconButton color="inherit" component={Link} to="/dashboard">
                <DashboardIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Learn More">
              <IconButton color="inherit" component={Link} to="/learn-more">
                <PublicIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton color="inherit" onClick={toggleTheme}>
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      {children}
      <Box sx={{ width: '100%', py: 3, textAlign: 'center', boxShadow: '0 -4px 20px 0 rgba(0,0,0,0.15)', background: theme => theme.palette.mode === 'dark' ? theme.palette.background.paper : '#344456' }}>
        <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary', lineHeight: 1.7, maxWidth: 800, mx: 'auto', px: 2 }}>
          About RAPID: RAPID is a real-time security tool that analyzes website URLs using advanced heuristics to help you avoid phishing and insecure domains. Stay safe online!
        </Typography>
      </Box>
    </>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<PageWrapper isDarkMode={isDarkMode} toggleTheme={toggleTheme}><MainApp isDarkMode={isDarkMode} /></PageWrapper>} />
          <Route path="/dashboard" element={<PageWrapper isDarkMode={isDarkMode} toggleTheme={toggleTheme}><Dashboard theme={currentTheme} /></PageWrapper>} />
          <Route path="/learn-more" element={<PageWrapper isDarkMode={isDarkMode} toggleTheme={toggleTheme}><LearnMorePage /></PageWrapper>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}