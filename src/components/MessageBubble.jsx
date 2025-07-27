import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Fade,
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  ThumbUpOutlined,
  ThumbDownOutlined,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/aiUtils';

const MessageBubble = ({ message }) => {
  const { actions } = useApp();
  const [showFeedback, setShowFeedback] = useState(false);
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';

  const handleFeedback = (feedbackType) => {
    actions.addFeedback(message.id, feedbackType);
  };

  const getUserAvatar = () => (
    <Avatar
      sx={{
        width: 40,
        height: 40,
        bgcolor: '#4caf50',
      }}
    >
      👤
    </Avatar>
  );

  const getAIAvatar = () => (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #9c88ff, #6c5ce7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
        AI
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        mb: 3,
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        alignItems: 'flex-start',
        gap: 1,
      }}
      data-testid={`message-${message.sender}`}
    >
      {isAI && getAIAvatar()}

      <Box
        sx={{
          maxWidth: '70%',
          position: 'relative',
        }}
        onMouseEnter={() => isAI && setShowFeedback(true)}
        onMouseLeave={() => setShowFeedback(false)}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 0.5,
            justifyContent: isUser ? 'flex-end' : 'flex-start',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
            {message.senderName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatTime(message.timestamp)}
          </Typography>
        </Box>

        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor: isUser ? '#9c88ff' : '#f5f5f5',
            color: isUser ? 'white' : '#333',
            position: 'relative',
          }}
        >
          {isAI && (
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              <span>Soul AI</span>
            </Typography>
          )}
          
          <p data-testid="message-content" style={{ margin: 0, fontSize: '16px', lineHeight: '1.5' }}>
            {message.content}
          </p>

          {isAI && (
            <Fade in={showFeedback || message.feedback}>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -10,
                  right: -10,
                  display: 'flex',
                  gap: 0.5,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  boxShadow: 2,
                  p: 0.5,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => handleFeedback('like')}
                  sx={{
                    color: message.feedback === 'like' ? '#4caf50' : '#666',
                    '&:hover': {
                      backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    },
                  }}
                >
                  {message.feedback === 'like' ? <ThumbUp fontSize="small" /> : <ThumbUpOutlined fontSize="small" />}
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleFeedback('dislike')}
                  sx={{
                    color: message.feedback === 'dislike' ? '#f44336' : '#666',
                    '&:hover': {
                      backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    },
                  }}
                >
                  {message.feedback === 'dislike' ? <ThumbDown fontSize="small" /> : <ThumbDownOutlined fontSize="small" />}
                </IconButton>
              </Box>
            </Fade>
          )}
        </Paper>

        {isAI && message.feedback && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            {message.feedback === 'like' ? (
              <ThumbUp fontSize="small" sx={{ color: '#4caf50' }} />
            ) : (
              <ThumbDown fontSize="small" sx={{ color: '#f44336' }} />
            )}
            <Typography variant="caption" color="text.secondary">
              {message.feedback === 'like' ? 'Liked' : 'Disliked'}
            </Typography>
          </Box>
        )}
      </Box>

      {isUser && getUserAvatar()}
    </Box>
  );
};

export default MessageBubble;
