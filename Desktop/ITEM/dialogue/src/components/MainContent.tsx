import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Upload } from 'lucide-react';
import KnowledgeBaseGrid from './KnowledgeBaseGrid';
import MyUploadsTable from './MyUploadsTable';
import ActivityLogsTable from './ActivityLogsTable';
import CreateKnowledgeBaseModal from './CreateKnowledgeBaseModal';
import { KnowledgeType, KnowledgeBaseCard } from '../types';
import AddDocumentModal from './AddDocumentModal';

interface MainContentProps {
  activeKnowledgeType: KnowledgeType;
  activeTab?: string;
}

const MainContent: React.FC<MainContentProps> = ({ activeKnowledgeType, activeTab = 'knowledge' }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [contentTab, setContentTab] = useState<'all' | 'uploads' | 'activity'>('all');
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [isCreateKnowledgeBaseModalOpen, setIsCreateKnowledgeBaseModalOpen] = useState(false);
  const [creatingCards, setCreatingCards] = useState<KnowledgeBaseCard[]>([]);

  const handleConfigurationSelect = (type: 'manual' | 'ai') => {
    if (type === 'manual') {
      navigate('/upload');
    } else {
      navigate('/ai-upload');
    }
    setIsAddDocumentModalOpen(false);
  };

  const handleCreateKnowledgeBase = (title: string, description: string) => {
    // Generate a unique ID for the new knowledge base
    const newId = `${activeKnowledgeType}-${Date.now()}`;
    
    // Create the new knowledge base card in "creating" state
    const newCard: KnowledgeBaseCard = {
      id: newId,
      title,
      description,
      icon: 'BookOpen', // Default icon
      documentCount: 0,
      tags: []
    };

    // Add to creating cards list
    setCreatingCards(prev => [...prev, newCard]);

    // After 5 seconds, remove from creating state and add to permanent data
    setTimeout(() => {
      setCreatingCards(prev => prev.filter(card => card.id !== newId));
      
      // In a real app, you would make an API call here to persist the data
      // For now, we'll just remove it from the creating state
      // The card will disappear since it's not in the permanent data
      console.log('Knowledge base created successfully:', newCard);
    }, 5000);
  };

  const getSearchPlaceholder = () => {
    switch (contentTab) {
      case 'uploads':
        return "Search my uploads...";
      case 'activity':
        return "Search activity logs...";
      default:
        return "Search knowledge base...";
    }
  };

  // 搜索框和上传按钮组件
  const SearchAndUploadBar = () => (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <div className="relative w-full md:w-auto mb-4 md:mb-0">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={getSearchPlaceholder()} 
          className="bg-gray-800 text-gray-200 pl-10 pr-4 py-2.5 rounded-md w-full md:w-[800px] focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      
      <div className="flex space-x-4">
        {activeKnowledgeType === KnowledgeType.ENTERPRISE && (
          <button 
            onClick={() => setIsAddDocumentModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-md transition-colors flex items-center"
          >
            <Upload size={18} className="mr-2" />
            Upload Documents
          </button>
        )}
        {(activeKnowledgeType !== KnowledgeType.ENTERPRISE || contentTab === 'all') && (
          <button 
            onClick={() => setIsCreateKnowledgeBaseModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-md transition-colors flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Create Knowledge Base
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto p-6 bg-black">
      <div className="flex flex-col space-y-6">
        {activeKnowledgeType === KnowledgeType.ENTERPRISE && (
          <div className="flex space-x-8 border-b border-gray-800">
            <button
              onClick={() => setContentTab('all')}
              className={`px-4 py-2 ${
                contentTab === 'all'
                  ? 'text-purple-500 border-b-2 border-purple-500 -mb-[2px]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Knowledge Bases
            </button>
            <button
              onClick={() => setContentTab('uploads')}
              className={`px-4 py-2 ${
                contentTab === 'uploads'
                  ? 'text-purple-500 border-b-2 border-purple-500 -mb-[2px]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Manage Uploads
            </button>
            <button
              onClick={() => setContentTab('activity')}
              className={`px-4 py-2 ${
                contentTab === 'activity'
                  ? 'text-purple-500 border-b-2 border-purple-500 -mb-[2px]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Activity Logs
            </button>
          </div>
        )}

        {contentTab !== 'uploads' && <SearchAndUploadBar />}
        
        {contentTab === 'all' ? (
          <KnowledgeBaseGrid 
            knowledgeType={activeKnowledgeType} 
            searchQuery={searchQuery}
            creatingCards={creatingCards}
          />
        ) : contentTab === 'uploads' ? (
          <MyUploadsTable 
            searchQuery={searchQuery}
            renderSearchAndUploadBar={() => <SearchAndUploadBar />}
          />
        ) : (
          <ActivityLogsTable searchQuery={searchQuery} />
        )}
      </div>

      <AddDocumentModal
        isOpen={isAddDocumentModalOpen}
        onClose={() => setIsAddDocumentModalOpen(false)}
        onConfigurationSelect={handleConfigurationSelect}
      />

      <CreateKnowledgeBaseModal
        isOpen={isCreateKnowledgeBaseModalOpen}
        onClose={() => setIsCreateKnowledgeBaseModalOpen(false)}
        onCreate={handleCreateKnowledgeBase}
      />
    </div>
  );
};

export default MainContent;