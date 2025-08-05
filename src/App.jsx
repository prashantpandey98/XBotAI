
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ChatInterface from './components/ChatInterface';
import PastConversations  from './components/PastConversations';
import FeedbackAnalytics from './components/FeedbackAnalytics';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        <Route path="/past-conversations" element={<PastConversations />} />
        <Route path="/analytics" element={<FeedbackAnalytics />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
