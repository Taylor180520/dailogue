import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AiUploadPageProps {
  setIsSidebarVisible: (visible: boolean) => void;
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  uploadTime: string;
}

const AiUploadPage: React.FC<AiUploadPageProps> = ({ setIsSidebarVisible }) => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsSidebarVisible(false);
    return () => setIsSidebarVisible(true);
  }, [setIsSidebarVisible]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        uploadTime: new Date().toLocaleString(),
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileRemove = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && urlInput.trim()) {
      e.preventDefault();
      setUrls(prev => [...prev, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const handleUrlRemove = (index: number) => {
    setUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleStartProcessing = () => {
    if (uploadedFiles.length === 0 && urls.length === 0) {
      setValidationErrors(['At least one file or URL is required']);
      return;
    }

    // Store the uploaded files and URLs in sessionStorage to persist them
    const uploadData = {
      files: uploadedFiles,
      urls: urls,
      timestamp: Date.now()
    };
    sessionStorage.setItem('aiUploadData', JSON.stringify(uploadData));

    navigate('/ai-workspace');
  };

  return (
    <div className="flex-1 bg-black p-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="text-lg">Back</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 text-center">Upload Files and URLs</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Files <span className="text-red-500">*</span>
            </label>
            <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
              validationErrors.includes('At least one file or URL is required')
                ? 'border-red-500'
                : 'border-gray-700'
            }`}>
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                multiple
                ref={fileInputRef}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-gray-300 hover:text-white"
              >
                <span className="bg-green-500/10 text-green-500 px-4 py-2 rounded-lg text-lg">
                  Choose <strong>One</strong>/<strong>Multiple</strong> files or drag and drop them here
                </span>
              </label>
              <p className="text-sm text-gray-400 mt-2">
                Tip: Hold the Shift key to select multiple files.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Supported file types: PDF, PPT, Word, Excel, CSV, JSON, XML, TXT, Markdown, MP3, MP4
              </p>
            </div>
            {validationErrors.includes('At least one file or URL is required') && (
              <p className="text-red-500 text-sm mt-1">At least one file or URL is required</p>
            )}

            {uploadedFiles.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-2 px-4 text-gray-400">File Name</th>
                      <th className="py-2 px-4 text-gray-400">Type</th>
                      <th className="py-2 px-4 text-gray-400">Size</th>
                      <th className="py-2 px-4 text-gray-400">Upload Time</th>
                      <th className="py-2 px-4 text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedFiles.map((file, index) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="py-2 px-4 text-gray-300">{file.name}</td>
                        <td className="py-2 px-4 text-gray-300">{file.type}</td>
                        <td className="py-2 px-4 text-gray-300">{formatFileSize(file.size)}</td>
                        <td className="py-2 px-4 text-gray-300">{file.uploadTime}</td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => handleFileRemove(index)}
                            className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700 transition-colors"
                            title="Remove file"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL Links
            </label>
            <div className="relative">
              <div className="flex flex-wrap gap-2 bg-gray-800 rounded-lg p-2 min-h-[48px]">
                {urls.map((url, index) => (
                  <div key={index} className="flex items-center bg-gray-700 rounded px-2 py-1">
                    <span className="text-gray-300 text-sm truncate max-w-[200px]">{url}</span>
                    <button
                      onClick={() => handleUrlRemove(index)}
                      className="ml-2 text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-600 transition-colors"
                      title="Remove URL"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={handleUrlKeyDown}
                  className="flex-1 bg-transparent text-white min-w-[120px] focus:outline-none"
                  placeholder={urls.length === 0 ? "Press Enter after each URL to add multiple URLs" : ""}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleStartProcessing}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Start Processing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiUploadPage;