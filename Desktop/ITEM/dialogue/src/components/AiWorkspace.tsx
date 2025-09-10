import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, FileText, Search, X, Plus, CheckCircle, Edit, Trash2, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AiWorkspaceProps {
  setIsSidebarVisible: (visible: boolean) => void;
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  uploadTime: string;
}

interface BatchItem {
  id: string;
  userName: string;
  contributorName: string;
  companyDepartment: string;
  process: string;
  processName: string;
  description: string;
  customer: string;
  retailer: string;
  urlLinks: string[];
  files: UploadedFile[];
}

const AiWorkspace: React.FC<AiWorkspaceProps> = ({ setIsSidebarVisible }) => {
  useEffect(() => {
    setIsSidebarVisible(false);
    return () => setIsSidebarVisible(true);
  }, [setIsSidebarVisible]);

  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [batchList, setBatchList] = useState<BatchItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showFolderTooltip, setShowFolderTooltip] = useState(false);
  const [showProcessTooltip, setShowProcessTooltip] = useState(false);
  const [showProcessNameTooltip, setShowProcessNameTooltip] = useState(false);
  const [showCustomersTooltip, setShowCustomersTooltip] = useState(false);
  const [showRetailerTooltip, setShowRetailerTooltip] = useState(false);
  const [showDescriptionTooltip, setShowDescriptionTooltip] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      content: 'I have processed your files and filled out the form. Please review the details on the right and let me know if you would like to make any changes.',
    },
  ]);

  // Track initial state when modal opens and whether changes have been made
  const [initialFilesCount, setInitialFilesCount] = useState(0);
  const [initialUrlsCount, setInitialUrlsCount] = useState(0);
  const [hasChangesFromInitial, setHasChangesFromInitial] = useState(false);

  // Load uploaded data from sessionStorage when component mounts
  useEffect(() => {
    const savedUploadData = sessionStorage.getItem('aiUploadData');
    if (savedUploadData) {
      try {
        const uploadData = JSON.parse(savedUploadData);
        // Check if data is recent (within 1 hour) to avoid stale data
        const isRecent = Date.now() - uploadData.timestamp < 3600000; // 1 hour
        if (isRecent && uploadData.files && uploadData.urls) {
          setUploadedFiles(uploadData.files);
          setUrls(uploadData.urls);
        }
      } catch (error) {
        console.error('Error parsing saved upload data:', error);
      }
    }
  }, []);

  // Update sessionStorage whenever files or URLs change
  useEffect(() => {
    if (uploadedFiles.length > 0 || urls.length > 0) {
      const uploadData = {
        files: uploadedFiles,
        urls: urls,
        timestamp: Date.now()
      };
      sessionStorage.setItem('aiUploadData', JSON.stringify(uploadData));
    }
  }, [uploadedFiles, urls]);

  // Track changes from initial state when modal is opened
  useEffect(() => {
    if (isUploadModalOpen) {
      const currentFilesCount = uploadedFiles.length;
      const currentUrlsCount = urls.length;
      
      const hasChanges = currentFilesCount !== initialFilesCount || currentUrlsCount !== initialUrlsCount;
      setHasChangesFromInitial(hasChanges);
    }
  }, [uploadedFiles.length, urls.length, initialFilesCount, initialUrlsCount, isUploadModalOpen]);

  // Form state with refs for validation
  const employeeIdRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const companyDepartmentRef = useRef<HTMLSelectElement>(null);
  const processRef = useRef<HTMLSelectElement>(null);
  const processNameRef = useRef<HTMLInputElement>(null);
  const customersRef = useRef<HTMLInputElement>(null);
  const retailerRef = useRef<HTMLInputElement>(null);

  const [contributorInfo, setContributorInfo] = useState({
    employeeId: '',
    name: 'taylor zhang张',
    company: 'item',
    department: 'IT',
    position: 'BA',
    facility: '',
  });

  const [documentInfo, setDocumentInfo] = useState({
    companyDepartment: '',
    process: '',
    processName: '',
    customers: 'General',
    retailer: 'None',
    description: '',
  });

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
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && urlInput.trim()) {
      e.preventDefault();
      setUrls([...urls, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const handleUrlRemove = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const handleFileRemove = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setChatHistory(prev => [
      ...prev,
      { role: 'user' as const, content: message },
      { 
        role: 'assistant' as const, 
        content: 'I understand. I\'ll help you modify the form based on your request. Please check the preview panel for the updates.',
      },
    ]);
    setMessage('');
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    let firstErrorRef: React.RefObject<HTMLInputElement | HTMLSelectElement> | null = null;

    if (!contributorInfo.name.trim()) {
      errors.push('Name is required');
      if (!firstErrorRef) firstErrorRef = nameRef;
    }

    if (!documentInfo.companyDepartment) {
      errors.push('Folder Name is required');
      if (!firstErrorRef) firstErrorRef = companyDepartmentRef;
    }

    if (!documentInfo.process) {
      errors.push('Process is required');
      if (!firstErrorRef) firstErrorRef = processRef;
    }

    if (!documentInfo.processName.trim()) {
      errors.push('Process name is required');
      if (!firstErrorRef) firstErrorRef = processNameRef;
    }

    if (!documentInfo.customers.trim()) {
      errors.push('Customers is required');
      if (!firstErrorRef) firstErrorRef = customersRef;
    }

    if (!documentInfo.retailer.trim()) {
      errors.push('Retailer is required');
      if (!firstErrorRef) firstErrorRef = retailerRef;
    }

    if (uploadedFiles.length === 0 && urls.length === 0) {
      errors.push('At least one file or URL is required');
      if (!firstErrorRef) {
        setIsUploadModalOpen(true);
      }
    }

    setValidationErrors(errors);

    if (errors.length > 0) {
      if (firstErrorRef && firstErrorRef.current) {
        firstErrorRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        firstErrorRef.current.focus();
        
        firstErrorRef.current.classList.add('highlight-required');
        setTimeout(() => {
          firstErrorRef.current?.classList.remove('highlight-required');
        }, 3000);
      }
      return false;
    }

    return true;
  };

  const handleAddToBatch = () => {
    if (!validateForm()) {
      return;
    }

    const newBatch: BatchItem = {
      id: `batch-${Date.now()}`,
      userName: `${contributorInfo.name.toLowerCase().replace(/\s+/g, '')}@item.com`,
      contributorName: contributorInfo.name,
      companyDepartment: documentInfo.companyDepartment,
      process: documentInfo.process,
      processName: documentInfo.processName,
      description: documentInfo.description,
      customer: documentInfo.customers,
      retailer: documentInfo.retailer,
      urlLinks: urls,
      files: uploadedFiles,
    };

    setBatchList([...batchList, newBatch]);

    // Reset form fields
    setUploadedFiles([]);
    setUrls([]);
    setDocumentInfo({
      ...documentInfo,
      processName: '',
      description: '',
    });
    setValidationErrors([]);
  };

  const handleRemoveBatch = (id: string) => {
    setBatchList(batchList.filter(batch => batch.id !== id));
  };

  const validateAndSubmit = () => {
    if (batchList.length === 0) {
      // Show error that batch list is empty
      alert('Please add at least one item to the batch list before submitting.');
      return;
    }

    // All validation passed - show success popup
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      // Clear sessionStorage after successful submission
      sessionStorage.removeItem('aiUploadData');
    }, 3000);
  };

  const handleStartProcessing = () => {
    // Check if modal has no files or URLs - always show "Close" in this case
    const hasNoContent = uploadedFiles.length === 0 && urls.length === 0;
    
    if (hasNoContent || !hasChangesFromInitial) {
      // No content or no changes made, just close the modal
      setIsUploadModalOpen(false);
    } else {
      // User made changes and has content, validate and process
      if (uploadedFiles.length === 0 && urls.length === 0) {
        setValidationErrors(['At least one file or URL is required']);
        return;
      }
      setIsUploadModalOpen(false);
    }
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setValidationErrors([]);
    setHasChangesFromInitial(false);
  };

  const handleOpenUploadModal = () => {
    // Set initial state when modal opens
    setInitialFilesCount(uploadedFiles.length);
    setInitialUrlsCount(urls.length);
    setHasChangesFromInitial(false);
    setIsUploadModalOpen(true);
  };

  // Determine button text based on content and changes
  const getButtonText = () => {
    const hasNoContent = uploadedFiles.length === 0 && urls.length === 0;
    
    if (hasNoContent) {
      return 'Close';
    }
    
    return hasChangesFromInitial ? 'Start Processing' : 'Close';
  };

  return (
    <div className="flex-1 bg-black flex p-6 gap-6">
      {/* Left Panel - Chat Interface */}
      <div className="w-1/2 bg-primary-color rounded-xl flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Back</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-4`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                {msg.role === 'assistant' ? (
                  <FileText size={20} className="text-purple-500" />
                ) : (
                  <FileText size={20} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="bg-gray-750 rounded-xl p-6">
                  <p className="text-gray-200 leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Preview */}
      <div className="w-1/2 bg-primary-color rounded-xl flex flex-col relative">
        {/* Floating Upload Bubble */}
        <button
          onClick={handleOpenUploadModal}
          className="absolute top-4 right-4 w-14 h-14 bg-purple-600/90 hover:bg-purple-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-colors float-balloon z-50 group"
          title="View Uploads"
        >
          <div className="relative">
            <span className="text-2xl transition-transform group-hover:scale-110">📄</span>
            {(uploadedFiles.length > 0 || urls.length > 0) && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                {uploadedFiles.length + urls.length}
              </div>
            )}
          </div>
        </button>

        {/* Batch Submit Button */}
        <button
          onClick={validateAndSubmit}
          className="absolute bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center space-x-2"
        >
          <span>Batch Submit</span>
        </button>

        {/* Form Preview */}
        <div className="flex-1 overflow-y-auto p-6 pb-20">
          <div className="space-y-6">
            {/* Contributor Info Section */}
            <div>
              <h2 className="text-lg font-medium text-green-500 mb-4">Contributor Info</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Employee ID
                  </label>
                  <input
                    ref={employeeIdRef}
                    type="text"
                    value={contributorInfo.employeeId}
                    onChange={(e) => setContributorInfo({...contributorInfo, employeeId: e.target.value})}
                    placeholder="Enter employee ID"
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={nameRef}
                    type="text"
                    value={contributorInfo.name}
                    onChange={(e) => setContributorInfo({...contributorInfo, name: e.target.value})}
                    className={`w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
                      validationErrors.includes('Name is required') ? 'ring-red-500' : 'focus:ring-purple-500'
                    }`}
                  />
                  {validationErrors.includes('Name is required') && (
                    <p className="text-red-500 text-sm mt-1">Name is required</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={contributorInfo.company}
                      onChange={(e) => setContributorInfo({...contributorInfo, company: e.target.value})}
                      className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={contributorInfo.department}
                      onChange={(e) => setContributorInfo({...contributorInfo, department: e.target.value})}
                      className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      value={contributorInfo.position}
                      onChange={(e) => setContributorInfo({...contributorInfo, position: e.target.value})}
                      className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Facility
                  </label>
                  <input
                    type="text"
                    value={contributorInfo.facility}
                    onChange={(e) => setContributorInfo({...contributorInfo, facility: e.target.value})}
                    placeholder="Enter facility"
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Document Details Section */}
            <div>
              <h2 className="text-lg font-medium text-green-500 mb-4">Document Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <div className="flex items-center space-x-2">
                        <span>Folder Name <span className="text-red-500">*</span></span>
                        <div className="relative">
                          <button
                            onMouseEnter={() => setShowFolderTooltip(true)}
                            onMouseLeave={() => setShowFolderTooltip(false)}
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                            type="button"
                          >
                            <HelpCircle size={16} />
                          </button>
                          {showFolderTooltip && (
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 min-w-max pointer-events-none">
                              <div className="text-sm text-gray-200">
                                The folder you select should represent the company/department your documents belong to.
                              </div>
                              {/* Tooltip arrow pointing left */}
                              <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-600"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                    <div className="relative">
                      <select
                        ref={companyDepartmentRef}
                        value={documentInfo.companyDepartment}
                        onChange={(e) => setDocumentInfo({...documentInfo, companyDepartment: e.target.value})}
                        className={`w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 appearance-none ${
                          validationErrors.includes('Folder Name is required') ? 'ring-red-500' : 'focus:ring-purple-500'
                        }`}
                      >
                        <option value="">Select Folder</option>
                        <option value="ITEM Software">ITEM Software</option>
                        <option value="UNIS/HR">UNIS/HR</option>
                        <option value="UNIS/Engineering">UNIS/Engineering</option>
                      </select>
                    </div>
                    {validationErrors.includes('Folder Name is required') && (
                      <p className="text-red-500 text-sm mt-1">Folder Name is required</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <div className="flex items-center space-x-2">
                        <span>Process <span className="text-red-500">*</span></span>
                        <div className="relative">
                          <button
                            onMouseEnter={() => setShowProcessTooltip(true)}
                            onMouseLeave={() => setShowProcessTooltip(false)}
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                            type="button"
                          >
                            <HelpCircle size={16} />
                          </button>
                          {showProcessTooltip && (
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 min-w-max pointer-events-none">
                              <div className="text-sm text-gray-200">
                                Select the business process the documents are related to.
                              </div>
                              {/* Tooltip arrow pointing left */}
                              <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-600"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                    <div className="relative">
                      <select
                        ref={processRef}
                        value={documentInfo.process}
                        onChange={(e) => setDocumentInfo({...documentInfo, process: e.target.value})}
                        className={`w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 appearance-none ${
                          validationErrors.includes('Process is required') ? 'ring-red-500' : 'focus:ring-purple-500'
                        }`}
                      >
                        <option value="">Select process</option>
                        <option value="Requirement Analysis">Requirement Analysis</option>
                        <option value="Project Planning">Project Planning</option>
                      </select>
                    </div>
                    {validationErrors.includes('Process is required') && (
                      <p className="text-red-500 text-sm mt-1">Process is required</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <div className="flex items-center space-x-2">
                      <span>Name of the process <span className="text-red-500">*</span></span>
                      <div className="relative">
                        <button
                          onMouseEnter={() => setShowProcessNameTooltip(true)}
                          onMouseLeave={() => setShowProcessNameTooltip(false)}
                          className="text-gray-400 hover:text-gray-300 transition-colors"
                          type="button"
                        >
                          <HelpCircle size={16} />
                        </button>
                        {showProcessNameTooltip && (
                          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 min-w-max pointer-events-none">
                            <div className="text-sm text-gray-200">
                              Give a name that clearly reflects the main content or purpose of this process.
                            </div>
                            {/* Tooltip arrow pointing left */}
                            <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-600"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                  <input
                    ref={processNameRef}
                    type="text"
                    value={documentInfo.processName}
                    onChange={(e) => setDocumentInfo({...documentInfo, processName: e.target.value})}
                    placeholder="Enter process name you are uploading"
                    className={`w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
                      validationErrors.includes('Process name is required') ? 'ring-red-500' : 'focus:ring-purple-500'
                    }`}
                  />
                  {validationErrors.includes('Process name is required') && (
                    <p className="text-red-500 text-sm mt-1">Process name is required</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <div className="flex items-center space-x-2">
                        <span>Customers <span className="text-red-500">*</span></span>
                        <div className="relative">
                          <button
                            onMouseEnter={() => setShowCustomersTooltip(true)}
                            onMouseLeave={() => setShowCustomersTooltip(false)}
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                            type="button"
                          >
                            <HelpCircle size={16} />
                          </button>
                          {showCustomersTooltip && (
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 min-w-max pointer-events-none">
                              <div className="text-sm text-gray-200">
                                If documents are related to a specific customer, select the customer; otherwise, use General.
                              </div>
                              {/* Tooltip arrow pointing left */}
                              <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-600"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        ref={customersRef}
                        type="text"
                        value={documentInfo.customers}
                        onChange={(e) => setDocumentInfo({...documentInfo, customers: e.target.value})}
                        className={`w-full bg-gray-700 text-white rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 ${
                          validationErrors.includes('Customers is required') ? 'ring-red-500' : 'focus:ring-purple-500'
                        }`}
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                    {validationErrors.includes('Customers is required') && (
                      <p className="text-red-500 text-sm mt-1">Customers is required</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <div className="flex items-center space-x-2">
                        <span>Retailer <span className="text-red-500">*</span></span>
                        <div className="relative">
                          <button
                            onMouseEnter={() => setShowRetailerTooltip(true)}
                            onMouseLeave={() => setShowRetailerTooltip(false)}
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                            type="button"
                          >
                            <HelpCircle size={16} />
                          </button>
                          {showRetailerTooltip && (
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 min-w-max pointer-events-none">
                              <div className="text-sm text-gray-200">
                                If documents are related to a specific retailer, select the retailer; otherwise, use None.
                              </div>
                              {/* Tooltip arrow pointing left */}
                              <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-600"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        ref={retailerRef}
                        type="text"
                        value={documentInfo.retailer}
                        onChange={(e) => setDocumentInfo({...documentInfo, retailer: e.target.value})}
                        className={`w-full bg-gray-700 text-white rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 ${
                          validationErrors.includes('Retailer is required') ? 'ring-red-500' : 'focus:ring-purple-500'
                        }`}
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                    {validationErrors.includes('Retailer is required') && (
                      <p className="text-red-500 text-sm mt-1">Retailer is required</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <div className="flex items-center space-x-2">
                      <span>Description</span>
                      <div className="relative">
                        <button
                          onMouseEnter={() => setShowDescriptionTooltip(true)}
                          onMouseLeave={() => setShowDescriptionTooltip(false)}
                          className="text-gray-400 hover:text-gray-300 transition-colors"
                          type="button"
                        >
                          <HelpCircle size={16} />
                        </button>
                        {showDescriptionTooltip && (
                          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 min-w-max pointer-events-none">
                            <div className="text-sm text-gray-200">
                              Briefly summarize the document(s) for quick understanding.
                            </div>
                            {/* Tooltip arrow pointing left */}
                            <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-600"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                  <textarea
                    value={documentInfo.description}
                    onChange={(e) => setDocumentInfo({...documentInfo, description: e.target.value})}
                    placeholder="Write description"
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                  />
                </div>

                <button
                  onClick={handleAddToBatch}
                  className="w-full bg-green-600/20 hover:bg-green-600/30 text-green-500 px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Add to Batch List</span>
                </button>

                {/* Batch List Table */}
                {batchList.length > 0 && (
                  <div className="mt-8">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="py-2 px-2 text-gray-400 text-xs">No.</th>
                            <th className="py-2 px-2 text-gray-400 text-xs">User Name</th>
                            <th className="py-2 px-2 text-gray-400 text-xs">Contributor Name</th>
                            <th className="py-2 px-2 text-gray-400 text-xs">Folder Name</th>
                            <th className="py-2 px-2 text-gray-400 text-xs">Process</th>
                            <th className="py-2 px-2 text-gray-400 text-xs">Process Name</th>
                            <th className="py-2 px-2 text-gray-400 text-xs">Description</th>
                            <th className="py-2 px-2 text-gray-400 text-xs">Customer</th>
                            <th className="py-2 px-2 text-gray-400 text-xs">Retailer</th>
                            <th className="py-2 px-2 text-gray-400 text-xs">URL Links</th>
                            <th className="py-2 px-2 text-gray-400 text-xs">Files</th>
                            <th className="py-2 px-2 text-gray-400 text-xs">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {batchList.map((batch, index) => (
                            <tr key={batch.id} className="border-b border-gray-800">
                              <td className="py-2 px-2 text-gray-300">{index + 1}</td>
                              <td className="py-2 px-2 text-gray-300 truncate max-w-[120px]" title={batch.userName}>
                                {batch.userName}
                              </td>
                              <td className="py-2 px-2 text-gray-300">{batch.contributorName}</td>
                              <td className="py-2 px-2 text-gray-300 truncate max-w-[100px]" title={batch.companyDepartment}>
                                {batch.companyDepartment}
                              </td>
                              <td className="py-2 px-2 text-gray-300 truncate max-w-[100px]" title={batch.process}>
                                {batch.process}
                              </td>
                              <td className="py-2 px-2 text-gray-300 truncate max-w-[120px]" title={batch.processName}>
                                {batch.processName}
                              </td>
                              <td className="py-2 px-2 text-gray-300 truncate max-w-[100px]" title={batch.description}>
                                {batch.description || '-'}
                              </td>
                              <td className="py-2 px-2 text-gray-300">{batch.customer}</td>
                              <td className="py-2 px-2 text-gray-300">{batch.retailer}</td>
                              <td className="py-2 px-2 text-gray-300">{batch.urlLinks.length} URLs</td>
                              <td className="py-2 px-2 text-gray-300">{batch.files.length} files</td>
                              <td className="py-2 px-2">
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => handleRemoveBatch(batch.id)}
                                    className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700"
                                    title="Delete"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal - Matching Reference Design */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60]">
          <div className="bg-primary-color rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={handleCloseUploadModal}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X size={24} />
            </button>

            {/* Modal Header */}
            <div className="p-8 text-center">
              <h1 className="text-4xl font-bold text-white mb-2">Upload Files and URLs</h1>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-8">
              <div className="space-y-8">
                {/* Files Upload Section */}
                <div>
                  <label className="block text-lg font-medium text-white mb-4">
                    Files <span className="text-red-500">*</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-2xl p-12 text-center ${
                    validationErrors.includes('At least one file or URL is required')
                      ? 'border-red-500'
                      : 'border-gray-600'
                  }`}>
                    {/* Large Document Icon */}
                    <div className="mx-auto mb-6 w-20 h-20 bg-gray-600 rounded-lg flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                    </div>
                    
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload-modal"
                      multiple
                      ref={fileInputRef}
                    />
                    <label
                      htmlFor="file-upload-modal"
                      className="cursor-pointer block"
                    >
                      <div className="bg-green-600/20 text-green-400 px-8 py-4 rounded-xl text-xl font-medium inline-block mb-4 hover:bg-green-600/30 transition-colors">
                        Choose <strong>One</strong>/<strong>Multiple</strong> files or drag and drop them here
                      </div>
                    </label>
                    <p className="text-gray-400 text-lg mb-2">
                      Tip: Hold the Shift key to select multiple files.
                    </p>
                    <p className="text-gray-400 text-lg">
                      Supported file types: PDF, PPT, Word, Excel, CSV, JSON, XML, TXT, Markdown, MP3, MP4
                    </p>
                  </div>
                  {validationErrors.includes('At least one file or URL is required') && (
                    <p className="text-red-500 text-lg mt-2">At least one file or URL is required</p>
                  )}

                  {uploadedFiles.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-4 px-6 bg-gray-700 rounded-xl"
                        >
                          <div className="flex items-center space-x-4">
                            <FileText size={24} className="text-gray-400" />
                            <div>
                              <p className="text-white font-medium text-lg">{file.name}</p>
                              <p className="text-gray-400">{formatFileSize(file.size)} • {file.uploadTime}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleFileRemove(index)}
                            className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-gray-600 transition-colors"
                            title="Remove file"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* URL Links Section */}
                <div>
                  <label className="block text-lg font-medium text-white mb-4">
                    URL Links
                  </label>
                  <div className="relative">
                    <div className="flex flex-wrap gap-3 bg-gray-700 rounded-xl p-4 min-h-[60px]">
                      {urls.map((url, index) => (
                        <div key={index} className="flex items-center bg-gray-600 rounded-lg px-4 py-2">
                          <span className="text-gray-200 truncate max-w-[300px]">{url}</span>
                          <button
                            onClick={() => handleUrlRemove(index)}
                            className="ml-3 text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-500 transition-colors"
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
                        className="flex-1 bg-transparent text-white text-lg min-w-[200px] focus:outline-none placeholder-gray-400"
                        placeholder={urls.length === 0 ? "Press Enter after each URL to add multiple URLs" : ""}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 flex justify-end">
              <button
                onClick={handleStartProcessing}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-xl font-medium transition-colors"
              >
                {getButtonText()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <div className="bg-gray-900 rounded-xl p-8 shadow-lg max-w-md w-full relative border border-green-500 animate-appear">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setShowSuccessPopup(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4 py-6">
              <div className="text-green-500 animate-pulse-slow">
                <CheckCircle size={80} />
              </div>
              <h3 className="text-2xl font-bold text-white mt-4">Submitted Successfully!</h3>
              <p className="text-gray-300">Your documents have been successfully submitted to the knowledge base</p>
              <div className="mt-6 w-full">
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiWorkspace;