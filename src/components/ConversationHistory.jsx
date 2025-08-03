import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Container,
  Button,
  TextField,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ThumbUp,
  ThumbDown,
  Star,
} from '@mui/icons-material';
import AiImage from '../assets/AiImage.png';
import { useApp } from '../context/AppContext';
import { groupConversationsByDate, formatTime } from '../utils/aiUtils';
import Sidebar from './Sidebar';

const ConversationHistory = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const filteredConversations = state.conversations.filter(conv => {
    if (!conv.messages?.length) return false;

    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return conv.messages.some(msg =>
      msg.content && msg.content.toLowerCase().includes(query)
    ) || (conv.feedback && conv.feedback.toLowerCase().includes(query));
  });

  const groupedConversations = groupConversationsByDate(filteredConversations);

  const getUserAvatar = () => (
    <Avatar sx={{ width: 32, height: 32, bgcolor: '#4caf50' }}>
      👤
    </Avatar>
  );

  const getAIAvatar = () => (
             <Box
        component="img"
        src={AiImage}
        alt="Logo"
        sx={{
          width: 20,
          height: 20,
          borderRadius: '50%',
        }}
      />      
  );

  const renderConversationItem = (conversation) => {
    const messages = conversation.messages || [];

    return (
      <Paper
        key={conversation.id}
        elevation={1}
        sx={{
          mb: 2,
          p: 0,
          borderRadius: 3,
          backgroundColor: '#d4c5f9',
          border: '1px solid #c4b5f0',
          overflow: 'hidden',
        }}
      >
        {messages.map((message, index) => (
          <Box key={message.id} sx={{ p: 2, borderBottom: index < messages.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              {message.sender === 'user' ? getUserAvatar() : getAIAvatar()}
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                    {message.sender === 'user' ? 'You' : <span>Soul AI</span>}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#555' }}>
                    {formatTime(message.timestamp)}
                  </Typography>
                  {message.sender === 'ai' && message.feedback && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                      {message.feedback === 'like' ? (
                        <ThumbUp fontSize="small" sx={{ color: '#4caf50' }} />
                      ) : (
                        <ThumbDown fontSize="small" sx={{ color: '#f44336' }} />
                      )}
                    </Box>
                  )}
                  {message.sender === 'ai' && conversation.rating && index === messages.length - 1 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          fontSize="small"
                          sx={{
                            color: i < conversation.rating ? '#ffc107' : '#e0e0e0',
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
                <p style={{ color: '#333', marginBottom: '8px', fontSize: '14px', lineHeight: '1.5' }}>
                  {message.content}
                </p>

                {message.sender === 'ai' &&
                 index === messages.length - 1 &&
                 conversation.feedback && (
                  <Box sx={{ mt: 1, p: 1, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#555' }}>
                      Feedback:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', fontStyle: 'italic' }}>
                      {conversation.feedback}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Paper>
    );
  };

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
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Conversation History
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
          display: 'flex',
          flexDirection: 'column',
          mt: isMobile ? 8 : 0,
        }}
      >
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Container maxWidth="md" sx={{ py: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
              Conversation History
            </Typography>

            {Object.keys(groupedConversations).length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {searchQuery
                    ? 'Try adjusting your search terms.'
                    : 'Start a conversation to see your chat history here.'
                  }
                </Typography>
                {!searchQuery && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      actions.startNewConversation();
                      navigate('/');
                    }}
                    sx={{
                      background: 'linear-gradient(45deg, #9c88ff, #6c5ce7)',
                      borderRadius: 2,
                    }}
                  >
                    Start New Chat
                  </Button>
                )}
              </Box>
            ) : (
              Object.entries(groupedConversations).map(([dateGroup, conversations]) => (
                <Box key={dateGroup} sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                    {dateGroup}
                  </Typography>
                  {conversations.map(renderConversationItem)}
                </Box>
              ))
            )}
          </Container>
        </Box>

        <Box
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 0,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', maxWidth: 'lg', mx: 'auto' }}>
            <TextField
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                actions.startNewConversation();
                navigate('/');
              }}
              sx={{
                minWidth: 80,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #9c88ff, #6c5ce7)',
              }}
            >
              New
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ConversationHistory;
