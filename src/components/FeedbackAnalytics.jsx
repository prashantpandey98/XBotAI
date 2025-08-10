import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Rating,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ThumbUp,
  ThumbDown,
  Star,
  TrendingUp,
  Assessment,
  Feedback as FeedbackIcon,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { calculateAverageRating, getFeedbackStats, formatDate } from '../utils/aiUtils';
import Sidebar from './Sidebar';

const FeedbackAnalytics = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ratingFilter, setRatingFilter] = useState('all');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const filteredConversations = state.conversations.filter(conv => {
    if (ratingFilter === 'all') return true;
    if (ratingFilter === 'rated') return conv.rating !== null;
    if (ratingFilter === 'unrated') return conv.rating === null;
    return conv.rating === parseInt(ratingFilter);
  });

  const averageRating = calculateAverageRating(state.conversations);
  const feedbackStats = getFeedbackStats(state.conversations);
  const totalConversations = state.conversations.filter(conv => !conv.isActive).length;
  const ratedConversations = state.conversations.filter(conv => conv.rating !== null).length;
  const conversationsWithFeedback = state.conversations.filter(conv => conv.feedback).length;

  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: state.conversations.filter(conv => conv.rating === rating).length,
  }));

  const StatCard = ({ title, value, subtitle, icon, color = 'primary' }) => (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: `${color}.light`,
              color: `${color}.contrastText`,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon /> 
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Feedback Analytics
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        onNewChat={() => {
          actions.startNewConversation();
          navigate('/');
        }}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          mt: isMobile ? 8 : 0,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
            Feedback Analytics
          </Typography>

          {totalConversations === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No data available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start conversations to see analytics here.
              </Typography>
            </Box>
          ) : (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Total Conversations"
                    value={totalConversations}
                    subtitle="Completed conversations"
                    icon={<FeedbackIcon />}
                    color="primary"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Average Rating"
                    value={averageRating.toFixed(1)}
                    subtitle={`${ratedConversations} rated conversations`}
                    icon={<Star />}
                    color="warning"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Positive Feedback"
                    value={`${feedbackStats.positivePercentage.toFixed(1)}%`}
                    subtitle={`${feedbackStats.positive} out of ${feedbackStats.total} responses`}
                    icon={<ThumbUp />}
                    color="success"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Written Feedback"
                    value={conversationsWithFeedback}
                    subtitle="Conversations with comments"
                    icon={<TrendingUp />}
                    color="info"
                  />
                </Grid>
              </Grid>

              <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Rating Distribution
                </Typography>
                <Grid container spacing={2}>
                  {ratingDistribution.map(({ rating, count }) => (
                    <Grid item xs={12} key={rating}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={rating} readOnly size="small" sx={{ mr: 2 }} />
                        <Typography variant="body2" sx={{ minWidth: 60 }}>
                          {count} votes
                        </Typography>
                        <Box sx={{ flexGrow: 1, mx: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={ratedConversations > 0 ? (count / ratedConversations) * 100 : 0}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {ratedConversations > 0 ? ((count / ratedConversations) * 100).toFixed(1) : 0}%
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Conversation Feedback
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Filter by Rating</InputLabel>
                    <Select
                      value={ratingFilter}
                      label="Filter by Rating"
                      onChange={(e) => setRatingFilter(e.target.value)}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="rated">Rated Only</MenuItem>
                      <MenuItem value="unrated">Unrated Only</MenuItem>
                      <Divider />
                      {[5, 4, 3, 2, 1].map(rating => (
                        <MenuItem key={rating} value={rating.toString()}>
                          {rating} Star{rating !== 1 ? 's' : ''}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {filteredConversations.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No conversations match the selected filter.
                  </Typography>
                ) : (
                  <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {filteredConversations
                      .filter(conv => !conv.isActive)
                      .map((conversation) => (
                        <Box key={conversation.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(conversation.createdAt)}
                            </Typography>
                            {conversation.rating && (
                              <Rating value={conversation.rating} readOnly size="small" />
                            )}
                          </Box>

                          {conversation.feedback && (
                            <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
                              "{conversation.feedback}"
                            </Typography>
                          )}

                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {conversation.messages?.filter(msg => msg.feedback).map(msg => (
                              <Chip
                                key={msg.id}
                                size="small"
                                icon={msg.feedback === 'like' ? <ThumbUp /> : <ThumbDown />}
                                label={msg.feedback === 'like' ? 'Liked' : 'Disliked'}
                                color={msg.feedback === 'like' ? 'success' : 'error'}
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      ))}
                  </Box>
                )}
              </Paper>
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default FeedbackAnalytics;
