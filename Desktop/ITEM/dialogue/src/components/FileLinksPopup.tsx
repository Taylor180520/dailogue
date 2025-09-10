import React, { useState } from 'react';
import { X, FileText, Link as LinkIcon, AlertTriangle, Info } from 'lucide-react';

interface FileLinksPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'files' | 'links';
  items: Array<{
    name: string;
    url?: string;
    isDeleted?: boolean;
    deletedBy?: string;
    isUpdated?: boolean;
    updatedBy?: string;
  }>;
  onRemoveDeletedFile?: (fileName: string) => void;
  onInfoViewed?: (fileName: string) => void;
}

const FileLinksPopup: React.FC<FileLinksPopupProps> = ({
  isOpen,
  onClose,
  type,
  items,
  onRemoveDeletedFile,
  onInfoViewed,
}) => {
  const [showDeletedTooltip, setShowDeletedTooltip] = useState<string | null>(null);
  const [showUpdatedTooltip, setShowUpdatedTooltip] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleItemClick = (url: string, isDeleted: boolean) => {
    if (isDeleted) return; // Don't allow clicking on deleted files
    window.open(url, '_blank');
  };

  const handleRemoveDeleted = (fileName: string) => {
    if (onRemoveDeletedFile) {
      onRemoveDeletedFile(fileName);
    }
  };

  const handleInfoIconHover = (fileName: string, isEntering: boolean) => {
    if (isEntering) {
      setShowUpdatedTooltip(fileName);
      // Mark as viewed when user hovers over the info icon
      if (onInfoViewed) {
        onInfoViewed(fileName);
      }
    } else {
      setShowUpdatedTooltip(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-primary-color rounded-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {type === 'files' ? 'Files' : 'Links'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={index}
                className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg transition-colors text-left relative ${
                  item.isDeleted 
                    ? 'bg-gray-800/50 opacity-60 cursor-not-allowed' 
                    : 'hover:bg-gray-800 cursor-pointer group'
                }`}
              >
                <div 
                  className="flex items-center gap-3 flex-1"
                  onClick={() => item.url && handleItemClick(item.url, !!item.isDeleted)}
                >
                  {type === 'files' ? (
                    <FileText className={`${item.isDeleted ? 'text-gray-500' : 'text-purple-500'}`} size={20} />
                  ) : (
                    <LinkIcon className={`${item.isDeleted ? 'text-gray-500' : 'text-blue-500'}`} size={20} />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`${item.isDeleted ? 'text-gray-500 line-through' : 'text-gray-300 group-hover:text-white'}`}>
                        {item.name}
                      </span>
                      {item.isUpdated && !item.isDeleted && (
                        <div className="relative">
                          <button
                            onMouseEnter={() => handleInfoIconHover(item.name, true)}
                            onMouseLeave={() => handleInfoIconHover(item.name, false)}
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Info size={16} />
                          </button>
                          {showUpdatedTooltip === item.name && (
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 min-w-max pointer-events-none">
                              <div className="text-sm text-gray-200">
                                File name changed by Admin.
                              </div>
                              {/* Tooltip arrow pointing left */}
                              <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-600"></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {item.isDeleted && (
                      <div className="flex items-center mt-1">
                        <AlertTriangle className="text-red-400 mr-1" size={14} />
                        <span className="text-red-400 text-xs font-medium">
                          Deleted by Admin.
                        </span>
                        <div className="relative ml-2">
                          <button
                            onMouseEnter={() => setShowDeletedTooltip(item.name)}
                            onMouseLeave={() => setShowDeletedTooltip(null)}
                            className="text-gray-400 hover:text-gray-300"
                          >
                            <AlertTriangle size={12} />
                          </button>
                          {showDeletedTooltip === item.name && (
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 min-w-max pointer-events-none">
                              <div className="text-sm text-gray-200">
                                Deleted by the Admin. Please contact the Admin for details.
                              </div>
                              {/* Tooltip arrow pointing left */}
                              <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-600"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {item.isDeleted && (
                  <button
                    onClick={() => handleRemoveDeleted(item.name)}
                    className="text-red-400 hover:text-red-300 px-3 py-1 rounded hover:bg-gray-700 transition-colors text-sm font-medium"
                    title="Remove from list"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileLinksPopup;