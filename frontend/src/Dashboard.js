import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Public,
  Lock,
  LockOpen,
  CalendarMonth,
  Refresh,
  Search,
  TrendingUp,
  Security,
  BarChart
} from '@mui/icons-material';

function Dashboard({ theme }) {
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState(null);

  const fetchRecentAnalyses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/recent');
      if (response.ok) {
        const data = await response.json();
        setRecentAnalyses(data);
      } else {
        setError('Failed to fetch recent analyses');
      }
    } catch (err) {
      setError('Could not connect to backend');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchRecentAnalyses();
    fetchStats();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'High Trust';
    if (score >= 60) return 'Moderate Trust';
    return 'Low Trust';
  };

  const filteredAnalyses = recentAnalyses.filter(analysis => {
    const matchesFilter = filter === 'all' || 
      (filter === 'legitimate' && analysis.is_legitimate) ||
      (filter === 'suspicious' && !analysis.is_legitimate);
    
    const matchesSearch = analysis.url.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const domainAgeCheck = (age) => {
    if (age == null) return { pass: false, text: 'Unknown' };
    if (age > 730) return { pass: true, text: `${age} days (2+ years)` };
    if (age > 365) return { pass: true, text: `${age} days (1+ year)` };
    if (age > 30) return { pass: true, text: `${age} days (1+ month)` };
    return { pass: false, text: `${age} days (new domain)` };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', mt: 4, mb: 4, px: 2 }}>
      <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700, mb: 3, textAlign: 'center' }}>
        Analysis Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.total_analyses}
                    </Typography>
                    <Typography variant="body2">Total Analyses</Typography>
                  </Box>
                                     <BarChart sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {recentAnalyses.filter(a => a.is_legitimate).length}
                    </Typography>
                    <Typography variant="body2">Legitimate URLs</Typography>
                  </Box>
                                     <CheckCircle sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {recentAnalyses.filter(a => !a.is_legitimate).length}
                    </Typography>
                    <Typography variant="body2">Suspicious URLs</Typography>
                  </Box>
                                     <Warning sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {recentAnalyses.length > 0 ? Math.round(recentAnalyses.reduce((sum, a) => sum + a.trust_score, 0) / recentAnalyses.length) : 0}
                    </Typography>
                    <Typography variant="body2">Avg Trust Score</Typography>
                  </Box>
                                     <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              label="Filter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">All Results</MenuItem>
              <MenuItem value="legitimate">Legitimate Only</MenuItem>
              <MenuItem value="suspicious">Suspicious Only</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            placeholder="Search URLs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchRecentAnalyses} color="primary">
                             <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Results List */}
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 3, background: 'primary.main', color: 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Recent Analyses ({filteredAnalyses.length})
          </Typography>
        </Box>
        
        {filteredAnalyses.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No analyses found matching your criteria.
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredAnalyses.map((analysis, index) => (
              <React.Fragment key={analysis.id}>
                <ListItem sx={{ p: 3, '&:hover': { bgcolor: 'action.hover' } }}>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {analysis.url}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={`${analysis.trust_score}/100`}
                          sx={{
                            bgcolor: getScoreColor(analysis.trust_score),
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                        <Chip
                          label={getScoreLabel(analysis.trust_score)}
                          variant="outlined"
                          color={analysis.is_legitimate ? 'success' : 'error'}
                        />
                      </Box>
                    </Box>
                    
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                     {analysis.is_accessible ? <Public color="success" /> : <Public color="error" />}
                          <Typography variant="body2">
                            {analysis.is_accessible ? 'Accessible' : 'Not Accessible'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                     {analysis.has_ssl && analysis.ssl_valid ? <Lock color="success" /> : <LockOpen color="error" />}
                          <Typography variant="body2">
                            {analysis.has_ssl && analysis.ssl_valid ? 'Valid SSL' : 'SSL Issues'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                     <CalendarMonth color={domainAgeCheck(analysis.domain_age_days).pass ? 'success' : 'error'} />
                          <Typography variant="body2">
                            {domainAgeCheck(analysis.domain_age_days).text}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                     <Security color={analysis.suspicious_patterns.length === 0 ? 'success' : 'warning'} />
                          <Typography variant="body2">
                            {analysis.suspicious_patterns.length} suspicious patterns
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    {analysis.suspicious_patterns.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600, mb: 1 }}>
                          Suspicious Patterns:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {analysis.suspicious_patterns.map((pattern, idx) => (
                            <Chip
                              key={idx}
                              label={pattern.pattern}
                              size="small"
                              color="warning"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      {analysis.analysis_summary}
                    </Typography>
                    
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Analyzed: {new Date(analysis.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </ListItem>
                {index < filteredAnalyses.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}

export default Dashboard; 