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
  CLEAR_CURRENT_CONVERSATION: 'CLEAR_CURRENT_CONVERSATION',
  CLEAR_ALL_CONVERSATIONS: 'CLEAR_ALL_CONVERSATIONS',
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
    
    case actionTypes.START_NEW_CONVERSATION: {
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
        conversations: state.conversations
      };
    }

    case actionTypes.ADD_MESSAGE: {
      if (!state.currentConversation) {
        return state;
      }

      const updatedConversation = {
        ...state.currentConversation,
        messages: [...state.currentConversation.messages, action.payload],
        isActive: true,
        lastUpdated: new Date().toISOString()
      };

      const existingConvIndex = state.conversations.findIndex(conv => conv.id === updatedConversation.id);

      let newConversations;
      if (existingConvIndex >= 0) {
        newConversations = state.conversations.map(conv =>
          conv.id === updatedConversation.id ? updatedConversation : conv
        );
      } else {
        newConversations = [updatedConversation, ...state.conversations];
      }

      return {
        ...state,
        currentConversation: updatedConversation,
        conversations: newConversations
      };
    }
    
    case actionTypes.ADD_FEEDBACK: {
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
    }

    case actionTypes.SAVE_CONVERSATION: {
      if (!state.currentConversation || !state.currentConversation.messages?.length) {
        return state;
      }

      const savedConversation = {
        ...state.currentConversation,
        isActive: false,
        savedAt: new Date().toISOString()
      };

      return {
        ...state,
        currentConversation: null,
        conversations: [...state.conversations, savedConversation]
      };
    }
    
    case actionTypes.LOAD_CONVERSATIONS:
      return { ...state, conversations: action.payload };
    
    case actionTypes.SET_CURRENT_CONVERSATION:
      return { ...state, currentConversation: action.payload };

    case actionTypes.CLEAR_CURRENT_CONVERSATION: {
      // Save current conversation if it has messages before clearing
      if (state.currentConversation?.messages?.length > 0) {
        const savedConversation = {
          ...state.currentConversation,
          isActive: false,
          savedAt: new Date().toISOString()
        };

        const updatedConversations = state.conversations.map(conv =>
          conv.id === savedConversation.id ? savedConversation : conv
        );

        return {
          ...state,
          currentConversation: null,
          conversations: updatedConversations
        };
      }

      return { ...state, currentConversation: null };
    }

    case actionTypes.CLEAR_ALL_CONVERSATIONS: {
      // Explicitly clear all conversations and localStorage
      localStorage.removeItem('conversations');
      return {
        ...state,
        conversations: [],
        currentConversation: null
      };
    }

    case actionTypes.ADD_CONVERSATION_RATING: {
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
    }

    case actionTypes.ADD_CONVERSATION_FEEDBACK: {
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
    }
    
    default:
      return state;
  }
};

// Context Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      try {
        const conversations = JSON.parse(savedConversations);
        if (Array.isArray(conversations)) {
          dispatch({ type: actionTypes.LOAD_CONVERSATIONS, payload: conversations });
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        // Only remove localStorage if it's truly corrupted JSON, not just empty or malformed
        const savedData = localStorage.getItem('conversations');
        if (savedData && savedData.trim() !== '' && savedData !== '[]') {
          console.warn('Corrupted conversation data detected, clearing localStorage');
          localStorage.removeItem('conversations');
        }
      }
    }
  }, []);

  useEffect(() => {
    const conversationsToSave = state.conversations.filter(conv => conv.messages && conv.messages.length > 0);
    // Only save to localStorage if we have conversations to save
    // Don't overwrite existing data with empty arrays during initialization
    if (conversationsToSave.length > 0) {
      localStorage.setItem('conversations', JSON.stringify(conversationsToSave));
    }
  }, [state.conversations]);

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
    clearCurrentConversation: () => dispatch({ type: actionTypes.CLEAR_CURRENT_CONVERSATION }),
    clearAllConversations: () => dispatch({ type: actionTypes.CLEAR_ALL_CONVERSATIONS }),
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
