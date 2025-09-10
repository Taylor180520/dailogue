import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, FileText, Database, BarChart3, DollarSign, 
  Users, MoreHorizontal, FileIcon, BookMarked, ScrollText,
  FilePlus, Edit, Trash2, ClipboardList, Shield, Globe
} from 'lucide-react';
import { KnowledgeType } from '../types';
import EditKnowledgeBaseModal from './EditKnowledgeBaseModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ActivityLogsModal from './ActivityLogsModal';
import AddDocumentModal from './AddDocumentModal';
import ManagePermissionsModal from './ManagePermissionsModal';

interface KnowledgeBaseCardProps {
  title: string;
  description: string;
  icon: string;
  documentCount: number;
  type: KnowledgeType;
  id: string;
  tags?: Array<{
    id: string;
    name: string;
  }>;
  isCreating?: boolean;
}

const KnowledgeBaseCard: React.FC<KnowledgeBaseCardProps> = ({ 
  title: initialTitle, 
  description: initialDescription, 
  icon, 
  documentCount,
  type,
  id,
  tags = [],
  isCreating = false
}) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [currentTags, setCurrentTags] = useState(tags);
  const [showTooltip, setShowTooltip] = useState(false);

  const getEmoji = () => {
    switch(icon) {
      case 'BookOpen':
        return '📖';
      case 'FileText':
        return '📄';
      case 'Database':
        return '🗄️';
      case 'BarChart3':
        return '📊';
      case 'DollarSign':
        return '💰';
      case 'Users':
        return '👥';
      case 'BookMarked':
        return '📚';
      case 'ScrollText':
        return '📜';
      default:
        return '📁';
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    setIsDropdownOpen(false);
    document.removeEventListener('click', handleClickOutside);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCreating) return; // Disable dropdown during creation
    
    if (!isDropdownOpen) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCardClick = () => {
    if (isCreating) return; // Disable navigation during creation
    navigate(`/chat/${id}`);
  };

  const handleAddDocumentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    setIsAddDocumentModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleLogsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    setIsLogsModalOpen(true);
  };

  const handlePermissionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    setIsPermissionsModalOpen(true);
  };

  const handleConfigurationSelect = (type: 'manual' | 'ai') => {
    console.log(`Selected ${type} configuration`);
    setIsAddDocumentModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
  };

  const handleSave = (newTitle: string, newDescription: string) => {
    setTitle(newTitle);
    setDescription(newDescription);
  };

  const handlePermissionsUpdate = (updatedPermissions: string[]) => {
    // Check if permissions array is empty (public folder)
    if (updatedPermissions.length === 0) {
      // Set public tag
      setCurrentTags([{ id: 'public', name: 'Public' }]);
    } else {
      // Convert permissions to tags
      const updatedTags = updatedPermissions.map(permission => {
        const existingTag = currentTags.find(tag => tag.name === permission);
        return existingTag || { 
          id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
          name: permission 
        };
      });
      setCurrentTags(updatedTags);
    }
  };

  // Get current permissions from tags (excluding public status)
  const getCurrentPermissions = () => {
    // If there's a "Public" tag, return empty array (no permissions = public)
    if (currentTags.some(tag => tag.name === 'Public')) {
      return [];
    }
    // Otherwise return tag names as permissions
    return currentTags.map(tag => tag.name);
  };

  // Check if folder is public
  const isPublic = currentTags.some(tag => tag.name === 'Public');

  // Determine how many tags to show and if we need a "+X more" indicator
  const maxVisibleTags = 1; // Changed from 2 to 1
  const visibleTags = isPublic ? currentTags : currentTags.slice(0, maxVisibleTags);
  const hiddenTags = isPublic ? [] : currentTags.slice(maxVisibleTags);
  const hasMoreTags = hiddenTags.length > 0;

  // Handle tooltip mouse events
  const handleTooltipMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(true);
  };

  const handleTooltipMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(false);
  };

  return (
    <>
      <div 
        className={`bg-gray-800/50 rounded-lg p-6 transition-all duration-300 group relative ${
          isCreating 
            ? 'opacity-60 cursor-not-allowed' 
            : 'hover:shadow-lg hover:translate-y-[-4px] hover:bg-gray-800/70 cursor-pointer'
        }`}
        onClick={handleCardClick}
      >
        {/* Three dots menu in top right */}
        <div className="absolute top-3 right-3">
          <button 
            onClick={toggleDropdown}
            className={`text-gray-400 hover:text-gray-200 transition-colors focus:outline-none ${
              isCreating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isCreating}
          >
            <MoreHorizontal size={18} />
          </button>
          
          {isDropdownOpen && !isCreating && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  role="menuitem"
                  onClick={handleAddDocumentClick}
                >
                  <FilePlus size={16} className="mr-2" />
                  Add Document
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  role="menuitem"
                  onClick={handleEditClick}
                >
                  <Edit size={16} className="mr-2" />
                  Edit Info
                </button>
                
                {type === KnowledgeType.ENTERPRISE && (
                  <>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      role="menuitem"
                      onClick={handleLogsClick}
                    >
                      <ClipboardList size={16} className="mr-2" />
                      View Logs
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      role="menuitem"
                      onClick={handlePermissionsClick}
                    >
                      <Shield size={16} className="mr-2" />
                      Permissions
                    </button>
                  </>
                )}
                
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-red-400 hover:text-red-300"
                  role="menuitem"
                  onClick={handleDeleteClick}
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Enlarged emoji in top left - no background */}
        <div className="mb-8">
          <div className="w-16 h-16 flex items-center justify-center text-4xl">
            📁
          </div>
        </div>
        
        {/* Left-aligned title */}
        <div className="mb-8">
          <h3 className={`text-xl font-semibold transition-colors ${
            isCreating 
              ? 'text-gray-400' 
              : 'text-white group-hover:text-purple-300'
          }`}>
            {title}
          </h3>
          {isCreating && (
            <p className="text-orange-400 text-sm font-medium mt-1">
              Creating...
            </p>
          )}
        </div>
        
        {/* Role tags at bottom */}
        <div className="flex flex-col space-y-2">
          {currentTags && currentTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {isPublic ? (
                <span className="bg-green-500/10 border border-green-500/20 text-green-500 text-xs px-2 py-1 rounded flex items-center">
                  <Globe size={12} className="mr-1" />
                  Public
                </span>
              ) : (
                <>
                  {visibleTags.map(tag => (
                    <span 
                      key={tag.id} 
                      className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full font-medium"
                    >
                      {tag.name}
                    </span>
                  ))}
                  {hasMoreTags && (
                    <div className="relative inline-block">
                      <span 
                        className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full font-medium cursor-pointer hover:bg-purple-500/30 transition-colors"
                        onMouseEnter={handleTooltipMouseEnter}
                        onMouseLeave={handleTooltipMouseLeave}
                        onClick={(e) => e.stopPropagation()}
                      >
                        +{hiddenTags.length} more
                      </span>
                      
                      {showTooltip && (
                        <div 
                          className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 min-w-max pointer-events-auto"
                          onMouseEnter={handleTooltipMouseEnter}
                          onMouseLeave={handleTooltipMouseLeave}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-col gap-2">
                            {hiddenTags.map(tag => (
                              <span 
                                key={tag.id} 
                                className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                          {/* Tooltip arrow pointing left */}
                          <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-600"></div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <EditKnowledgeBaseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        title={title}
        description={description}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <ActivityLogsModal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
      />

      <AddDocumentModal
        isOpen={isAddDocumentModalOpen}
        onClose={() => setIsAddDocumentModalOpen(false)}
        onConfigurationSelect={handleConfigurationSelect}
      />

      <ManagePermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        currentPermissions={getCurrentPermissions()}
        onPermissionsUpdate={handlePermissionsUpdate}
      />
    </>
  );
};

export default KnowledgeBaseCard;