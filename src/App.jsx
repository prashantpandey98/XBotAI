
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ChatInterface from './components/ChatInterface';
import ConversationHistory from './components/ConversationHistory';
import FeedbackAnalytics from './components/FeedbackAnalytics';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        <Route path="/history" element={<ConversationHistory />} />
        <Route path="/analytics" element={<FeedbackAnalytics />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
