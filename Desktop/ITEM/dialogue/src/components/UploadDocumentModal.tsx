import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Link as LinkIcon, Plus, Search, Trash2, Edit, CheckCircle, X, HelpCircle } from 'lucide-react';
import { customers, retailers } from '../data/mockData';
import EditBatchModal from './EditBatchModal';

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

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFullPage?: boolean;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  isFullPage = false,
}) => {
  const [step, setStep] = useState(1);
  const [stepOneCompleted, setStepOneCompleted] = useState(true);
  const [stepTwoCompleted, setStepTwoCompleted] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFolderTooltip, setShowFolderTooltip] = useState(false);
  const [showProcessTooltip, setShowProcessTooltip] = useState(false);
  const [showProcessNameTooltip, setShowProcessNameTooltip] = useState(false);
  const [showCustomersTooltip, setShowCustomersTooltip] = useState(false);
  const [showRetailerTooltip, setShowRetailerTooltip] = useState(false);
  const [showDescriptionTooltip, setShowDescriptionTooltip] = useState(false);
  const [contributorInfo, setContributorInfo] = useState({
    employeeId: '',
    name: 'Taylor Zhang',
    company: 'ITEM',
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

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [batchList, setBatchList] = useState<BatchItem[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isButtonHighlighted, setIsButtonHighlighted] = useState(false);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('General');
  const [isRetailerDropdownOpen, setIsRetailerDropdownOpen] = useState(false);
  const [retailerSearchQuery, setRetailerSearchQuery] = useState('None');
  const [selectedBatch, setSelectedBatch] = useState<BatchItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const companyDepartmentRef = useRef<HTMLSelectElement>(null);
  const processRef = useRef<HTMLSelectElement>(null);
  const processNameRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<HTMLDivElement>(null);
  const customerInputRef = useRef<HTMLInputElement>(null);
  const retailerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customerInputRef.current && !customerInputRef.current.contains(event.target as Node)) {
        setIsCustomerDropdownOpen(false);
      }
      if (retailerInputRef.current && !retailerInputRef.current.contains(event.target as Node)) {
        setIsRetailerDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  const getFilteredCustomers = () => {
    const query = customerSearchQuery.toLowerCase();
    return customers.filter(customer => 
      customer.toLowerCase().includes(query)
    );
  };

  const getFilteredRetailers = () => {
    const query = retailerSearchQuery.toLowerCase();
    return retailers.filter(retailer => 
      retailer.toLowerCase().includes(query)
    );
  };

  const handleCustomerSelect = (customer: string) => {
    setDocumentInfo(prev => ({ ...prev, customers: customer }));
    setCustomerSearchQuery(customer);
    setIsCustomerDropdownOpen(false);
  };

  const handleRetailerSelect = (retailer: string) => {
    setDocumentInfo(prev => ({ ...prev, retailer }));
    setRetailerSearchQuery(retailer);
    setIsRetailerDropdownOpen(false);
  };

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

  const validateForm = (): boolean => {
    const errors: string[] = [];
    setIsButtonHighlighted(false);

    if (!documentInfo.companyDepartment) {
      errors.push('Folder Name is required');
      companyDepartmentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      companyDepartmentRef.current?.focus();
      return false;
    }

    if (!documentInfo.process) {
      errors.push('Process is required');
      processRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      processRef.current?.focus();
      return false;
    }

    if (!documentInfo.processName) {
      errors.push('Process name is required');
      processNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      processNameRef.current?.focus();
      return false;
    }

    if (uploadedFiles.length === 0 && urls.length === 0) {
      errors.push('At least one file or URL is required');
      filesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleAddToBatch = () => {
    if (!validateForm()) {
      return;
    }

    const newBatch: BatchItem = {
      id: `batch-${Date.now()}`,
      userName: `${contributorInfo.name.toLowerCase()}@item.com`,
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

  const handleEditBatch = (batch: BatchItem) => {
    setSelectedBatch(batch);
    setIsEditModalOpen(true);
  };

  const handleSaveBatch = (updatedBatch: BatchItem) => {
    setBatchList(prevList =>
      prevList.map(batch =>
        batch.id === updatedBatch.id ? updatedBatch : batch
      )
    );
  };

  const handleNext = () => {
    setStep(2);
    setStepTwoCompleted(true);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = () => {
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      onClose();
    }, 3000);
  };

  const renderCustomerField = () => (
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
      <div className="relative" ref={customerInputRef}>
        <input
          type="text"
          value={customerSearchQuery}
          onChange={(e) => {
            setCustomerSearchQuery(e.target.value);
            setIsCustomerDropdownOpen(true);
          }}
          onFocus={() => setIsCustomerDropdownOpen(true)}
          placeholder="Search customers..."
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </div>
        
        {isCustomerDropdownOpen && (
          <div className="absolute z-50 w-full mt-1 bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {getFilteredCustomers().map((customer, index) => (
              <button
                key={index}
                onClick={() => handleCustomerSelect(customer)}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
              >
                {customer}
              </button>
            ))}
            {getFilteredCustomers().length === 0 && (
              <div className="px-4 py-2 text-gray-400">No results found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderRetailerField = () => (
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
      <div className="relative" ref={retailerInputRef}>
        <input
          type="text"
          value={retailerSearchQuery}
          onChange={(e) => {
            setRetailerSearchQuery(e.target.value);
            setIsRetailerDropdownOpen(true);
          }}
          onFocus={() => setIsRetailerDropdownOpen(true)}
          placeholder="Search retailers..."
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </div>
        
        {isRetailerDropdownOpen && (
          <div className="absolute z-50 w-full mt-1 bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {getFilteredRetailers().map((retailer, index) => (
              <button
                key={index}
                onClick={() => handleRetailerSelect(retailer)}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
              >
                {retailer}
              </button>
            ))}
            {getFilteredRetailers().length === 0 && (
              <div className="px-4 py-2 text-gray-400">No results found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className={isFullPage ? "h-full" : "fixed inset-0 bg-black/50 flex items-center justify-center z-50"}>
        <div className={`bg-primary-color rounded-xl ${isFullPage ? "h-full" : "w-full max-w-4xl max-h-[90vh]"} flex flex-col`}>
          <div className="flex-none">
            <div className="p-6">
              <h2 className="text-3xl font-semibold">Upload Documents</h2>
            </div>
            
            <div className="px-6 pb-6">
              <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-700 -translate-y-1/2">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: stepOneCompleted ? (stepTwoCompleted ? '100%' : '50%') : '0%' }}
                  />
                </div>
                
                <div className="relative flex justify-between px-[15%]">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      stepOneCompleted ? 'bg-green-500' : 'bg-gray-700'
                    }`}>
                      <span className={stepOneCompleted ? 'text-white' : 'text-gray-400'}>1</span>
                    </div>
                    <span className={`text-sm font-medium ${
                      stepOneCompleted ? 'text-green-500' : 'text-gray-400'
                    }`}>Contributor Info</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      stepTwoCompleted ? 'bg-green-500' : 'bg-gray-700'
                    }`}>
                      <span className={stepTwoCompleted ? 'text-white' : 'text-gray-400'}>2</span>
                    </div>
                    <span className={`text-sm font-medium ${
                      stepTwoCompleted ? 'text-green-500' : 'text-gray-400'
                    }`}>Document Details</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-8">
              {step === 1 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        value={contributorInfo.employeeId}
                        onChange={(e) => setContributorInfo({ ...contributorInfo, employeeId: e.target.value })}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter employee ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={contributorInfo.name}
                        onChange={(e) => setContributorInfo({ ...contributorInfo, name: e.target.value })}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={contributorInfo.company}
                        onChange={(e) => setContributorInfo({ ...contributorInfo, company: e.target.value })}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        value={contributorInfo.department}
                        onChange={(e) => setContributorInfo({ ...contributorInfo, department: e.target.value })}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter department"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        value={contributorInfo.position}
                        onChange={(e) => setContributorInfo({ ...contributorInfo, position: e.target.value })}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter position"
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
                      onChange={(e) => setContributorInfo({ ...contributorInfo, facility: e.target.value })}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter facility"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div ref={filesRef}>
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

                  <div className="grid grid-cols-2 gap-6">
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
                      <select
                        ref={companyDepartmentRef}
                        value={documentInfo.companyDepartment}
                        onChange={(e) => setDocumentInfo({ ...documentInfo, companyDepartment: e.target.value })}
                        className={`w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
                          validationErrors.includes('Folder Name is required')
                            ? 'ring-2 ring-red-500'
                            : 'focus:ring-purple-500'
                        }`}
                        required
                      >
                        <option value="">Select Folder</option>
                        <option value="ITEM Software">ITEM Software</option>
                        <option value="UNIS/HR">UNIS/HR</option>
                        <option value="UNIS/Engineering">UNIS/Engineering</option>
                      </select>
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
                      <select
                        ref={processRef}
                        value={documentInfo.process}
                        onChange={(e) => setDocumentInfo({ ...documentInfo, process: e.target.value })}
                        className={`w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
                          validationErrors.includes('Process is required')
                            ? 'ring-2 ring-red-500'
                            : 'focus:ring-purple-500'
                        }`}
                        required
                      >
                        <option value="">Select process</option>
                        <option value="Requirement Analysis">Requirement Analysis</option>
                        <option value="Project Planning">Project Planning</option>
                      </select>
                      {validationErrors.includes('Process is required') && (
                        <p className="text-red-500 text-sm mt-1">Process is required</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <div className="flex items-center space-x-2">
                        <span>Name of the process<span className="text-red-500">*</span></span>
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
                      onChange={(e) => setDocumentInfo({ ...documentInfo, processName: e.target.value })}
                      className={`w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
                        validationErrors.includes('Process name is required')
                          ? 'ring-2 ring-red-500'
                          : 'focus:ring-purple-500'
                      }`}
                      placeholder="Enter process name you are uploading"
                      required
                    />
                    {validationErrors.includes('Process name is required') && (
                      <p className="text-red-500 text-sm mt-1">Process name is required</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {renderCustomerField()}
                    {renderRetailerField()}
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
                      onChange={(e) => setDocumentInfo({ ...documentInfo, description: e.target.value })}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                      placeholder="Write description"
                    />
                  </div>

                  <button
                    onClick={handleAddToBatch}
                    className={`w-full bg-green-600/20 hover:bg-green-600/30 text-green-500 px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                      isButtonHighlighted ? 'highlight-required' : ''
                    }`}
                  >
                    <Plus size={20} />
                    <span>Add to Batch List</span>
                  </button>

                  {batchList.length > 0 && (
                    <div className="mt-8">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left bg-gray-800/50 rounded-lg">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="py-2 px-4 text-gray-400">No.</th>
                              <th className="py-2 px-4 text-gray-400">User Name</th>
                              <th className="py-2 px-4 text-gray-400">Contributor Name</th>
                              <th className="py-2 px-4 text-gray-400">Folder Name</th>
                              <th className="py-2 px-4 text-gray-400">Process</th>
                              <th className="py-2 px-4 text-gray-400">Process Name</th>
                              <th className="py-2 px-4 text-gray-400">Description</th>
                              <th className="py-2 px-4 text-gray-400">Customer</th>
                              <th className="py-2 px-4 text-gray-400">Retailer</th>
                              <th className="py-2 px-4 text-gray-400">URL Links</th>
                              <th className="py-2 px-4 text-gray-400">Files</th>
                              <th className="py-2 px-4 text-gray-400">Actions</th>
                
                            </tr>
                          </thead>
                          <tbody>
                            {batchList.map((batch, index) => (
                              <tr key={batch.id} className="border-b border-gray-800">
                                <td className="py-2 px-4 text-gray-300">{index + 1}</td>
                                <td className="py-2 px-4 text-gray-300">{batch.userName}</td>
                                <td className="py-2 px-4 text-gray-300">{batch.contributorName}</td>
                                <td className="py-2 px-4 text-gray-300">{batch.companyDepartment}</td>
                                <td className="py-2 px-4 text-gray-300">{batch.process}</td>
                                <td className="py-2 px-4 text-gray-300">{batch.processName}</td>
                                <td className="py-2 px-4 text-gray-300">{batch.description}</td>
                                <td className="py-2 px-4 text-gray-300">{batch.customer}</td>
                                <td className="py-2 px-4 text-gray-300">{batch.retailer}</td>
                                <td className="py-2 px-4 text-gray-300">{batch.urlLinks.length} URLs</td>
                                <td className="py-2 px-4 text-gray-300">{batch.files.length} files</td>
                                <td className="py-2 px-4">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleEditBatch(batch)}
                                      className="text-purple-400 hover:text-purple-300 p-1 rounded hover:bg-gray-700"
                                      title="Edit"
                                    >
                                      <Edit size={18} />
                                    </button>
                                    <button
                                      onClick={() => handleRemoveBatch(batch.id)}
                                      className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700"
                                      title="Delete"
                                    >
                                      <Trash2 size={18} />
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
              )}
            </div>
          </div>

          <div className="flex-none border-t border-gray-800 p-6">
            <div className="flex justify-between">
              {step === 1 ? (
                <>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!contributorInfo.name}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </>
              ) : (
                <div className="flex justify-between w-full">
                  <button
                    onClick={handleBack}
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    Back to Previous Step
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={batchList.length === 0}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Batch Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedBatch && (
        <EditBatchModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveBatch}
          batch={selectedBatch}
        />
      )}

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg max-w-md w-full relative border border-green-500 animate-appear">
            <div className="absolute top-3 right-3">
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
              <h3 className="text-2xl font-bold text-white mt-4">Upload Successful!</h3>
              <p className="text-gray-300">Your documents have been successfully uploaded to the knowledge base</p>
              <div className="mt-6 w-full">
                <button
                  onClick={() => {
                    setShowSuccessPopup(false);
                    onClose();
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const style = document.createElement('style');
style.textContent = `
  @keyframes appear {
    0% { opacity: 0; transform: scale(0.9); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  @keyframes pulse-slow {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  .animate-appear {
    animation: appear 0.3s forwards;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 2s infinite;
  }
`;
document.head.appendChild(style);

export default UploadDocumentModal;