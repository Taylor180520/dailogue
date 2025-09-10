import React, { useState } from 'react';
import { X, FolderPlus, AlertCircle } from 'lucide-react';

interface CreateKnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, description: string) => void;
}

const CreateKnowledgeBaseModal: React.FC<CreateKnowledgeBaseModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { title?: string; description?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.trim().length > 50) {
      newErrors.title = 'Title must be less than 50 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (description.trim().length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCreate(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-primary-color rounded-2xl w-full max-w-lg shadow-2xl border border-gray-700">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <FolderPlus className="w-6 h-6 text-purple-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Create Knowledge Base</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) {
                    setErrors(prev => ({ ...prev, title: undefined }));
                  }
                }}
                className={`w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-colors ${
                  errors.title ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'
                }`}
                placeholder="Enter knowledge base title"
                maxLength={50}
              />
              {errors.title && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.title}
                </div>
              )}
              <div className="text-right text-xs text-gray-400 mt-1">
                {title.length}/50
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) {
                    setErrors(prev => ({ ...prev, description: undefined }));
                  }
                }}
                className={`w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-colors resize-none ${
                  errors.description ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'
                }`}
                placeholder="Describe what this knowledge base will contain"
                rows={4}
                maxLength={200}
              />
              {errors.description && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.description}
                </div>
              )}
              <div className="text-right text-xs text-gray-400 mt-1">
                {description.length}/200
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !description.trim()}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Create Knowledge Base
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateKnowledgeBaseModal;