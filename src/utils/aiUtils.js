import sampleData from '../aiData/sampleData.json';

export const generateAIResponse = (question) => {
  if (!question || typeof question !== 'string') {
    return "Sorry, Did not understand your query!";
  }

  const normalizedQuestion = question.toLowerCase().trim().replace(/[?!.]+$/, '');

  // Find exact matches (ignoring punctuation)
  const exactMatch = sampleData.find(item =>
    item.question.toLowerCase().replace(/[?!.]+$/, '') === normalizedQuestion
  );

  if (exactMatch) {
    return exactMatch.response;
  }

  // Return default message for any question not in the database
  return "Sorry, Did not understand your query!";
};


export const getSuggestedQuestions = () => {
  return [
    {
      id: 'weather',
      title: 'Hi, what is the weather',
      subtitle: 'Get immediate AI generated response'
    },
    {
      id: 'location',
      title: 'Hi, what is my location',
      subtitle: 'Get immediate AI generated response'
    },
    {
      id: 'temperature',
      title: 'Hi, what is the temperature',
      subtitle: 'Get immediate AI generated response'
    },
    {
      id: 'greeting',
      title: 'Hi, how are you',
      subtitle: 'Get immediate AI generated response'
    }
  ];
};


export const createMessage = (content, sender, senderName = null) => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
    content,
    sender,
    senderName: senderName || (sender === 'user' ? 'You' : 'Soul AI'),
    timestamp: new Date().toISOString(),
    feedback: null
  };
};

export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today's Chats";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday's Chats";
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
};

export const groupConversationsByDate = (conversations) => {
  const grouped = {};
  
  conversations.forEach(conversation => {
    const dateKey = formatDate(conversation.createdAt);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(conversation);
  });

  return grouped;
};

export const getConversationSummary = (conversation) => {
  if (!conversation.messages || conversation.messages.length === 0) {
    return 'Empty conversation';
  }

  const firstUserMessage = conversation.messages.find(msg => msg.sender === 'user');
  if (firstUserMessage) {
    return firstUserMessage.content.length > 50 
      ? firstUserMessage.content.substring(0, 50) + '...'
      : firstUserMessage.content;
  }

  return 'Conversation';
};

export const calculateAverageRating = (conversations) => {
  const ratedConversations = conversations.filter(conv => conv.rating !== null);
  if (ratedConversations.length === 0) return 0;
  
  const totalRating = ratedConversations.reduce((sum, conv) => sum + conv.rating, 0);
  return totalRating / ratedConversations.length;
};

export const getFeedbackStats = (conversations) => {
  let totalFeedbacks = 0;
  let positiveFeedbacks = 0;
  let negativeFeedbacks = 0;

  conversations.forEach(conversation => {
    conversation.messages?.forEach(message => {
      if (message.feedback) {
        totalFeedbacks++;
        if (message.feedback === 'like') {
          positiveFeedbacks++;
        } else if (message.feedback === 'dislike') {
          negativeFeedbacks++;
        }
      }
    });
  });

  return {
    total: totalFeedbacks,
    positive: positiveFeedbacks,
    negative: negativeFeedbacks,
    positivePercentage: totalFeedbacks > 0 ? (positiveFeedbacks / totalFeedbacks) * 100 : 0
  };
};
