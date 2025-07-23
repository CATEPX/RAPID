// Updated App.js

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

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#a259f7' }, // purple accent
    background: { default: '#181a20', paper: '#23232e' }, // true charcoal
    secondary: { main: '#3ec6e0' }, // cyan accent
    success: { main: '#43e0a0' }, // mint
    warning: { main: '#ffb300' },
    error: { main: '#ff6f61' }, // coral
    info: { main: '#00bcd4' },
    text: { primary: '#f5f7fa', secondary: '#b3b8c5' },
    divider: '#a259f7',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#23232e',
          color: '#f5f7fa',
          boxShadow: '0 2px 8px 0 rgba(162,89,247,0.10)',
          borderBottom: '3px solid #a259f7',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#23232e',
          boxShadow: '0 4px 24px 0 rgba(162,89,247,0.12)',
          border: '1.5px solid #3ec6e0',
          borderTop: '4px solid #a259f7',
          borderRadius: 16,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          background: '#23232e',
          border: '1.5px solid #a259f7',
          borderRadius: 16,
          transition: 'border-color 0.2s',
        },
        input: {
          background: 'transparent',
          color: '#f5f7fa',
          '&:focus': {
            borderColor: '#3ec6e0',
            boxShadow: '0 0 0 2px #a259f7',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px 0 rgba(162,89,247,0.10)',
          borderRadius: 16,
          fontWeight: 700,
          background: 'linear-gradient(90deg, #a259f7 60%, #3ec6e0 100%)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(90deg, #3ec6e0 60%, #a259f7 100%)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: '#3ec6e0',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #a259f7 0%, #3ec6e0 100%)',
          opacity: 0.4,
        },
      },
    },
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    h4: { fontWeight: 700, color: '#a259f7' },
    h5: { fontWeight: 700, color: '#3ec6e0' },
    h6: { fontWeight: 600, color: '#3ec6e0' },
    body1: { fontWeight: 500 },
    body2: { fontWeight: 400 },
  },
  shape: { borderRadius: 16 },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3ec6e0' },
    background: { default: 'linear-gradient(135deg, #fafdff 0%, #e0f7fa 60%, #e1eaff 100%)', paper: 'linear-gradient(135deg, #fafdff 0%, #e0f7fa 60%, #e1eaff 100%)' },
    secondary: { main: '#a259f7' },
    success: { main: '#43a047' },
    warning: { main: '#fbc02d' },
    error: { main: '#e57373' },
    info: { main: '#00bcd4' },
    text: { primary: '#23272b', secondary: '#5a5a5a' },
    divider: '#b3d1f7',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #fafdff 60%, #e0f7fa 100%)',
          color: '#23272b',
          boxShadow: '0 2px 8px 0 rgba(62,198,224,0.08)',
          borderBottom: '3px solid #3ec6e0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #fafdff 0%, #e0f7fa 60%, #e1eaff 100%)',
          boxShadow: '0 4px 24px 0 rgba(62,198,224,0.12)',
          border: '1.5px solid #b3d1f7',
          borderTop: '4px solid #3ec6e0',
          borderRadius: 16,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #fafdff 0%, #e0f7fa 60%, #e1eaff 100%)',
          border: '1.5px solid #b3d1f7',
          borderRadius: 16,
          transition: 'border-color 0.2s',
        },
        input: {
          background: 'transparent',
          '&:focus': {
            borderColor: '#3ec6e0',
            boxShadow: '0 0 0 2px #a259f7',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px 0 rgba(62,198,224,0.10)',
          borderRadius: 16,
          fontWeight: 700,
          background: 'linear-gradient(90deg, #3ec6e0 60%, #a259f7 100%)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(90deg, #a259f7 60%, #3ec6e0 100%)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: '#b3d1f7',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #3ec6e0 0%, #a259f7 100%)',
          opacity: 0.4,
        },
      },
    },
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    h4: { fontWeight: 700, color: '#3ec6e0' },
    h5: { fontWeight: 700, color: '#a259f7' },
    h6: { fontWeight: 600, color: '#a259f7' },
    body1: { fontWeight: 500 },
    body2: { fontWeight: 400 },
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
  // This page will now correctly inherit the theme from the ThemeProvider
  return (
    <Box sx={{ width: '100%', maxWidth: 700, mx: 'auto', mt: 8, mb: 4, px:2 }}>
      <Paper elevation={8} sx={{ p: 5, borderRadius: 5, boxShadow: theme => `0 8px 32px 0 ${theme.palette.primary.main}1A` }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700, mb: 2 }}>
          How RAPID Works
        </Typography>
        <Divider sx={{ mb: 3, bgcolor: 'primary.main' }} />
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
          RAPID (Real Time AI Phishing and Detection) analyzes website URLs using a set of security heuristics to help you avoid phishing and insecure domains. Here’s what goes into your trust score:
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
        <Divider sx={{ my: 3, bgcolor: 'primary.main', opacity: 0.3 }} />
        <Typography variant="h6" sx={{ color: 'primary.main', mb: 1, fontWeight: 600 }}>
          Trust Score
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          The trust score is calculated based on the above checks. A higher score means the URL is more likely to be safe. Scores are color-coded:
        </Typography>
        <List>
          <ListItem><Chip label="High Trust (80-100)" sx={{ background: 'success.main', color: 'background.default', fontWeight: 600 }} /></ListItem>
          <ListItem><Chip label="Moderate Trust (60-79)" sx={{ background: 'warning.main', color: 'background.default', fontWeight: 600 }} /></ListItem>
          <ListItem><Chip label="Low Trust (0-59)" sx={{ background: 'error.main', color: 'background.paper', fontWeight: 600 }} /></ListItem>
        </List>
        <Divider sx={{ my: 3, bgcolor: 'primary.main', opacity: 0.3 }} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          RAPID does not guarantee absolute safety. Always use caution and look for other signs of phishing or malicious intent.
        </Typography>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'underline', fontWeight: 600, fontSize: 18 }}>
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
      const response = await fetch('http://localhost:5000/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Check failed.');
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
        <Paper elevation={8} sx={{ p: { xs: 2, sm: 5 }, borderRadius: 5, boxShadow: theme => `0 8px 32px 0 ${theme.palette.primary.main}1A` }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <TextField
              label="Enter URL"
              variant="outlined"
            value={url}
              onChange={handleChange}
              required
              fullWidth
              autoFocus
            disabled={loading}
            />
            <Button variant="contained" color="primary" type="submit" size="large" disabled={loading} sx={{ fontWeight: 600, letterSpacing: 1, py: 1.5, borderRadius: 2, fontSize: 18 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Check URL'}
            </Button>
          </form>
          <Fade in={!!result} timeout={600}>
            <Box sx={{ mt: 7 }}>
              {result && (
                <Paper elevation={6} sx={{ p: 4, borderRadius: 4, border: `2.5px solid ${getScoreColor(theme, result.trust_score)}`, boxShadow: `0 4px 24px 0 ${getScoreColor(theme, result.trust_score)}2A` }}>
                  <Typography variant="h6" align="center" sx={{ color: getScoreColor(theme, result.trust_score), fontWeight: 700, mb: 2 }}>
                    Trust Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <LinearProgress variant="determinate" value={result.trust_score} sx={{ height: 16, borderRadius: 8, width: '80%', '& .MuiLinearProgress-bar': { backgroundColor: getScoreColor(theme, result.trust_score) } }} />
                    <Typography variant="h5" sx={{ ml: 2, color: getScoreColor(theme, result.trust_score), fontWeight: 700 }}>{result.trust_score}</Typography>
                  </Box>
                  <Typography variant="body1" align="center" sx={{ color: getScoreColor(theme, result.trust_score), fontWeight: 600, mb: 2 }}>
                    {result.is_legitimate ? 'Legitimate (Safe)' : 'Suspicious (Potential Risk)'}
                  </Typography>
                  <Divider sx={{ my: 2, bgcolor: getScoreColor(theme, result.trust_score), opacity: 0.3 }} />
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        {result.checks.is_accessible ? <PublicIcon color="success" /> : <PublicIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText primary="Website Accessible" secondary={result.checks.is_accessible ? `Status: ${result.checks.status_code}` : 'Not reachable'} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {result.checks.has_ssl ? <LockIcon color="success" /> : <LockOpenIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText primary="Valid SSL Certificate" secondary={result.checks.has_ssl ? 'SSL is valid' : 'No valid SSL'} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {domainAgeCheck(result.checks.domain_age).pass ? <CalendarMonthIcon color="success" /> : <CalendarMonthIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText primary="Domain Age" secondary={domainAgeCheck(result.checks.domain_age).text} />
                    </ListItem>
                    {result.reasons.filter(r => r.startsWith('Warning:')).map((reason, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <WarningAmberIcon color="warning" />
                        </ListItemIcon>
                        <ListItemText primary={reason.replace('Warning: ', '')} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>
          </Fade>
        </Paper>
      </Box>
      <Fade in={!result && !error} timeout={600}>
        <Box sx={{ width: '100%', maxWidth: 540, mb: 4, px: 2 }}>
          <Paper elevation={0} sx={{ p: 3, background: 'transparent', textAlign: 'left' }}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2, fontWeight: 600 }}>
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
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 2 }}>
              RAPID
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 400, letterSpacing: 1, fontSize: 15, color: 'text.secondary' }}>
              Real Time AI Phishing and Detection
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton color="inherit" onClick={toggleTheme}>
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      {children}
      <Box sx={{ width: '100%', py: 2, textAlign: 'center', boxShadow: theme => `0 -2px 12px 0 ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.06)'}`, background: theme => theme.palette.background.paper }}>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
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
          <Route path="/learn-more" element={<PageWrapper isDarkMode={isDarkMode} toggleTheme={toggleTheme}><LearnMorePage /></PageWrapper>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}