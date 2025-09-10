import React from 'react';
import { Database, User, Building, MessageCircle, Bot } from 'lucide-react';
import { KnowledgeType } from '../types';

interface SidebarProps {
  activeKnowledgeType: KnowledgeType;
  setActiveKnowledgeType: (type: KnowledgeType) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeKnowledgeType, 
  setActiveKnowledgeType,
  activeTab,
  setActiveTab,
  isCollapsed = false
}) => {
  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-primary-color border-r border-gray-800 ${isCollapsed ? 'p-2' : 'p-5'} flex flex-col transition-all duration-300`}>
      <div className="mb-6">
        {/* Main Navigation */}
        <button 
          onClick={() => setActiveTab('dialogues')}
          className={`w-full flex items-center ${isCollapsed ? 'p-2 justify-center' : 'p-3'} rounded-md mb-2 transition-colors ${
            activeTab === 'dialogues' 
              ? 'bg-purple-900 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          }`}
          title={isCollapsed ? 'Dialogues' : ''}
        >
          <Bot size={18} className={isCollapsed ? '' : 'mr-3'} />
          {!isCollapsed && <span>Dialogues</span>}
        </button>
        
        <button 
          onClick={() => setActiveTab('personal')}
          className={`w-full flex items-center ${isCollapsed ? 'p-2 justify-center' : 'p-3'} rounded-md mb-2 transition-colors ${
            activeTab === 'personal' 
              ? 'bg-purple-900 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          }`}
          title={isCollapsed ? 'Personal KB' : ''}
        >
          <User size={18} className={isCollapsed ? '' : 'mr-3'} />
          {!isCollapsed && <span>Personal KB</span>}
        </button>
        
        <button 
          onClick={() => setActiveTab('enterprise')}
          className={`w-full flex items-center ${isCollapsed ? 'p-2 justify-center' : 'p-3'} rounded-md mb-2 transition-colors ${
            activeTab === 'enterprise' 
              ? 'bg-purple-900 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          }`}
          title={isCollapsed ? 'Enterprise Knowledge' : ''}
        >
          <Building size={18} className={isCollapsed ? '' : 'mr-3'} />
          {!isCollapsed && <span>Enterprise Knowledge</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;