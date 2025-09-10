import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ChatInterface from './components/ChatInterface';
import UploadDocumentPage from './pages/UploadDocumentPage';
import AiUploadPage from './components/AiUploadPage';
import AiWorkspace from './components/AiWorkspace';
import ExpertDialogues from './components/ExpertDialogues';
import ExpertChatInterface from './components/ExpertChatInterface';
import VoiceCallInterface from './components/VoiceCallInterface';
import { KnowledgeType } from './types';

function AppContent() {
  const location = useLocation();
  const [activeKnowledgeType, setActiveKnowledgeType] = useState<KnowledgeType>(KnowledgeType.PERSONAL);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dialogues');

  // Check if we should switch to dialogues tab based on navigation state
  React.useEffect(() => {
    if (location.state?.activeTab === 'dialogues') {
      setActiveTab('dialogues');
    }
  }, [location.state]);

  // Update knowledge type when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'personal') {
      setActiveKnowledgeType(KnowledgeType.PERSONAL);
    } else if (tab === 'enterprise') {
      setActiveKnowledgeType(KnowledgeType.ENTERPRISE);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isSidebarVisible && (
          <Sidebar 
            activeKnowledgeType={activeKnowledgeType} 
            setActiveKnowledgeType={setActiveKnowledgeType} 
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            isCollapsed={isSidebarCollapsed}
          />
        )}
        <Routes>
          <Route 
            path="/" 
            element={
              activeTab === 'dialogues' ? (
                <ExpertDialogues />
              ) : (
                <MainContent 
                  activeKnowledgeType={activeKnowledgeType}
                />
              )
            } 
          />
          <Route 
            path="/chat/:id" 
            element={<ChatInterface setIsSidebarCollapsed={setIsSidebarCollapsed} />} 
          />
          <Route 
            path="/upload" 
            element={<UploadDocumentPage setIsSidebarVisible={setIsSidebarVisible} />} 
          />
          <Route
            path="/ai-upload"
            element={<AiUploadPage setIsSidebarVisible={setIsSidebarVisible} />}
          />
          <Route
            path="/ai-workspace"
            element={<AiWorkspace setIsSidebarVisible={setIsSidebarVisible} />}
          />
          <Route
            path="/expert/:expertId"
            element={<ExpertChatInterface setIsSidebarCollapsed={setIsSidebarCollapsed} />}
          />
          <Route
            path="/expert/:expertId/call"
            element={<VoiceCallInterface />}
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;