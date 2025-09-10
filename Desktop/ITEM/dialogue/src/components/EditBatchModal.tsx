import React, { useState, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface EditBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedBatch: any) => void;
  batch: {
    companyDepartment: string;
    process: string;
    files: Array<{
      name: string;
      type: string;
      size: number;
      uploadTime: string;
    }>;
  };
}

const EditBatchModal: React.FC<EditBatchModalProps> = ({
  isOpen,
  onClose,
  onSave,
  batch,
}) => {
  const [editedBatch, setEditedBatch] = useState(batch);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        uploadTime: new Date().toLocaleString(),
      }));
      
      setEditedBatch(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }));
    }
  };

  const handleAddFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setEditedBatch(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-primary-color rounded-xl w-full max-w-5xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Files Management</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Company/Department
                </label>
                <div className="text-white">{editedBatch.companyDepartment}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Process
                </label>
                <div className="text-white">{editedBatch.process}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Update Time
              </label>
              <div className="text-white">
                {new Date().toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-400">
                  Files
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <button 
                  onClick={handleAddFileClick}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus size={20} />
                  Add File
                </button>
              </div>
              
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="w-16 text-left py-3 px-4 text-gray-400 font-medium">NO.</th>
                      <th className="w-1/4 text-left py-3 px-4 text-gray-400 font-medium">File Name</th>
                      <th className="w-1/6 text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                      <th className="w-1/6 text-left py-3 px-4 text-gray-400 font-medium">Size</th>
                      <th className="w-1/4 text-left py-3 px-4 text-gray-400 font-medium">Upload Time</th>
                      <th className="w-24 text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editedBatch.files.map((file, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="py-3 px-4 text-white">{index + 1}</td>
                        <td className="py-3 px-4 text-white truncate" title={file.name}>{file.name}</td>
                        <td className="py-3 px-4 text-white truncate" title={file.type}>{file.type}</td>
                        <td className="py-3 px-4 text-white">{formatFileSize(file.size)}</td>
                        <td className="py-3 px-4 text-white">{file.uploadTime}</td>
                        <td className="py-3 px-4">
                          <button 
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700 transition-colors"
                            title="Remove file"
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(editedBatch);
                onClose();
              }}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBatchModal;