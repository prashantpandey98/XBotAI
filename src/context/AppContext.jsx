import React, { createContext, useContext, useReducer, useEffect } from 'react';
import sampleData from '../aiData/sampleData.json';

const AppContext = createContext();

// Initial state
const initialState = {
  conversations: [],
  currentConversation: null,
  sampleData: sampleData,
  isLoading: false,
  error: null,
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  START_NEW_CONVERSATION: 'START_NEW_CONVERSATION',
  ADD_MESSAGE: 'ADD_MESSAGE',
  ADD_FEEDBACK: 'ADD_FEEDBACK',
  SAVE_CONVERSATION: 'SAVE_CONVERSATION',
  LOAD_CONVERSATIONS: 'LOAD_CONVERSATIONS',
  SET_CURRENT_CONVERSATION: 'SET_CURRENT_CONVERSATION',
  ADD_CONVERSATION_RATING: 'ADD_CONVERSATION_RATING',
  ADD_CONVERSATION_FEEDBACK: 'ADD_CONVERSATION_FEEDBACK',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    
    case actionTypes.START_NEW_CONVERSATION:
      const newConversation = {
        id: Date.now().toString(),
        messages: [],
        createdAt: new Date().toISOString(),
        rating: null,
        feedback: null,
        isActive: true,
      };
      return { 
        ...state, 
        currentConversation: newConversation,
        conversations: [newConversation, ...state.conversations]
      };
    
    case actionTypes.ADD_MESSAGE:
      if (!state.currentConversation) return state;
      
      const updatedConversation = {
        ...state.currentConversation,
        messages: [...state.currentConversation.messages, action.payload]
      };
      
      return {
        ...state,
        currentConversation: updatedConversation,
        conversations: state.conversations.map(conv => 
          conv.id === updatedConversation.id ? updatedConversation : conv
        )
      };
    
    case actionTypes.ADD_FEEDBACK:
      if (!state.currentConversation) return state;
      
      const conversationWithFeedback = {
        ...state.currentConversation,
        messages: state.currentConversation.messages.map(msg => 
          msg.id === action.payload.messageId 
            ? { ...msg, feedback: action.payload.feedback }
            : msg
        )
      };
      
      return {
        ...state,
        currentConversation: conversationWithFeedback,
        conversations: state.conversations.map(conv => 
          conv.id === conversationWithFeedback.id ? conversationWithFeedback : conv
        )
      };
    
    case actionTypes.SAVE_CONVERSATION:
      const savedConversation = {
        ...state.currentConversation,
        isActive: false,
        savedAt: new Date().toISOString()
      };
      
      return {
        ...state,
        currentConversation: null,
        conversations: state.conversations.map(conv => 
          conv.id === savedConversation.id ? savedConversation : conv
        )
      };
    
    case actionTypes.LOAD_CONVERSATIONS:
      return { ...state, conversations: action.payload };
    
    case actionTypes.SET_CURRENT_CONVERSATION:
      return { ...state, currentConversation: action.payload };
    
    case actionTypes.ADD_CONVERSATION_RATING:
      const ratedConversation = {
        ...state.currentConversation,
        rating: action.payload
      };
      
      return {
        ...state,
        currentConversation: ratedConversation,
        conversations: state.conversations.map(conv => 
          conv.id === ratedConversation.id ? ratedConversation : conv
        )
      };
    
    case actionTypes.ADD_CONVERSATION_FEEDBACK:
      const feedbackConversation = {
        ...state.currentConversation,
        feedback: action.payload
      };
      
      return {
        ...state,
        currentConversation: feedbackConversation,
        conversations: state.conversations.map(conv => 
          conv.id === feedbackConversation.id ? feedbackConversation : conv
        )
      };
    
    default:
      return state;
  }
};

// Context Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedConversations = localStorage.getItem('xbotai_conversations');
    if (savedConversations) {
      try {
        const conversations = JSON.parse(savedConversations);
        dispatch({ type: actionTypes.LOAD_CONVERSATIONS, payload: conversations });
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (state.conversations.length > 0) {
      localStorage.setItem('xbotai_conversations', JSON.stringify(state.conversations));
    }
  }, [state.conversations]);

  // Action creators
  const actions = {
    setLoading: (loading) => dispatch({ type: actionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: actionTypes.SET_ERROR, payload: error }),
    startNewConversation: () => dispatch({ type: actionTypes.START_NEW_CONVERSATION }),
    addMessage: (message) => dispatch({ type: actionTypes.ADD_MESSAGE, payload: message }),
    addFeedback: (messageId, feedback) => dispatch({ 
      type: actionTypes.ADD_FEEDBACK, 
      payload: { messageId, feedback } 
    }),
    saveConversation: () => dispatch({ type: actionTypes.SAVE_CONVERSATION }),
    setCurrentConversation: (conversation) => dispatch({ 
      type: actionTypes.SET_CURRENT_CONVERSATION, 
      payload: conversation 
    }),
    addConversationRating: (rating) => dispatch({ 
      type: actionTypes.ADD_CONVERSATION_RATING, 
      payload: rating 
    }),
    addConversationFeedback: (feedback) => dispatch({ 
      type: actionTypes.ADD_CONVERSATION_FEEDBACK, 
      payload: feedback 
    }),
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
