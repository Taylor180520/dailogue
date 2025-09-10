import React from 'react';
import { X, Bot, Settings } from 'lucide-react';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigurationSelect: (type: 'manual' | 'ai') => void;
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  isOpen,
  onClose,
  onConfigurationSelect,
}) => {
  if (!isOpen) return null;

  const handleAiSelect = () => {
    document.body.style.overflow = 'hidden';
    onConfigurationSelect('ai');
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-primary-color/95 rounded-xl w-full max-w-4xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
              <X className="w-5 h-5 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold">Upload Documents</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={handleAiSelect}
            className="bg-gray-800/50 rounded-2xl p-8 text-left hover:bg-gray-800/70 transition-all duration-300 group border border-gray-700/50"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Bot size={24} className="text-purple-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">AI-Assisted Form Filling</h3>
                <p className="text-gray-400">AI auto-complete fields, and refine results via chat and live preview.</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onConfigurationSelect('manual')}
            className="bg-gray-800/50 rounded-2xl p-8 text-left hover:bg-gray-800/70 transition-all duration-300 group border border-gray-700/50"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Settings size={24} className="text-purple-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Manual Form Filling</h3>
                <p className="text-gray-400">Step-by-step manual form filling with full control.</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDocumentModal;