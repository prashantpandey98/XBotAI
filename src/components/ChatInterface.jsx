import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Menu as MenuIcon,
} from '@mui/icons-material';
import AiImage from '../assets/AiImage.png';
import { useApp } from '../context/AppContext';
import { generateAIResponse, getSuggestedQuestions, createMessage } from '../utils/aiUtils';
import Sidebar from './Sidebar';
import MessageBubble from './MessageBubble';
import ConversationEndDialog from './ConversationEndDialog';
import TypingIndicator from './TypingIndicator';

const ChatInterface = () => {
  const { state, actions } = useApp();
  const [message, setMessage] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const suggestedQuestions = getSuggestedQuestions();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.currentConversation?.messages]);

  useEffect(() => {
    if (!state.currentConversation) {
      actions.startNewConversation();
    }
  }, [actions, state.currentConversation]);

  const handleSendMessage = (messageText = message) => {
    if (!messageText.trim() || isAITyping) return;

    const userMessage = createMessage(messageText, 'user');
    actions.addMessage(userMessage);
    setIsAITyping(true);
      try {
        const aiResponse = generateAIResponse(messageText);
        const aiMessage = createMessage(aiResponse, 'ai', 'Soul AI');
        actions.addMessage(aiMessage);
      } catch (error) {
        console.error('Error generating AI response:', error);
        const errorMessage = createMessage('Sorry, I encountered an error. Please try again.', 'ai', 'Soul AI');
        actions.addMessage(errorMessage);
      } finally {
        setIsAITyping(false);
      }

    setMessage('');
  };

  const handleSuggestedQuestion = (question) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveConversation = () => {
    if (state.currentConversation?.messages?.length > 0) {
      actions.saveConversation();
      actions.startNewConversation();
    }
  };

  const handleNewChat = () => {
    if (state.currentConversation?.messages?.length > 0) {
      actions.saveConversation();
    }
    actions.startNewConversation();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderWelcomeScreen = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        px: 2,
      }}
    >

       <Box
  component="img"
  src={AiImage}
  alt="Logo"
  sx={{
    width: 80,
    height: 80,
    borderRadius: '50%',
    mt:8
  }}
/>

      
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#333' }}>
        How Can I Help You Today?
      </Typography>

      <Grid container spacing={2} sx={{ maxWidth: 800, mb: 4 }}>
        {suggestedQuestions.map((question) => (
          <Grid item xs={12} sm={6} key={question.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
              onClick={() => handleSuggestedQuestion(question.title)}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {question.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {question.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderChatMessages = () => (
    <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }} data-testid="chat-messages">
      {state.currentConversation?.messages?.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isAITyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </Box>
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
            <Typography variant="h6" noWrap component="div" data-testid="app-header">
              Bot AI
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {!isMobile && (
        <header id="main-header" style={{ display: 'block', padding: '10px', background: '#f5f5f5' }}>
          <h1>Bot AI</h1>
        </header>
      )}


      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        onNewChat={handleNewChat}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          justifyContent: 'space-between',
          mt: isMobile ? 8 : 0,
        }}
      >
          {!state.currentConversation?.messages?.length ? (
            renderWelcomeScreen()
          ) : (
            renderChatMessages()
          )}

        <Box
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 0,
          }}
        >
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}
          >
            <input
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #ccc',
                fontSize: '16px',
                fontFamily: 'inherit',
                outline: 'none',
                backgroundColor: '#fff',
                minHeight: '56px',
                boxSizing: 'border-box',
                marginTop:'20px'
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Message Bot AI..."
              disabled={isAITyping}
              data-testid="message-input"
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!message.trim() || isAITyping}
              data-testid="ask-button"
              sx={{
                minWidth: 60,
                height: 56,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #9c88ff, #6c5ce7)',
                color: 'black',
              }}
            >
              Ask
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={handleSaveConversation}
              disabled={!state.currentConversation?.messages?.length}
              sx={{
                minWidth: 60,
                height: 56,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #9c88ff, #6c5ce7)',
                color: 'black',
              }}
            >
              Save
            </Button>
        </Box>
        </Box>
      </Box>

      <ConversationEndDialog
        open={showEndDialog}
        onClose={() => setShowEndDialog(false)}
        onComplete={() => {
          setShowEndDialog(false);
          actions.saveConversation();
          actions.startNewConversation();
        }}
      />
    </Box>
  );
};

export default ChatInterface;
