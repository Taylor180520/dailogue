import React, { useState, useEffect } from 'react';
import { X, Plus, Lock, Search, Check, AlertCircle, CheckCircle2, Mail, User, Users, Trash2, Globe, ChevronDown } from 'lucide-react';

// Mock data for available permissions
const availablePermissions = [
  "UNIS/HR",
  "UNIS/Engineering",
  "UNIS/Engineering/Manager",
  "UNIS/Marketing",
  "UNIS/Product",
  "UNIS/Legal",
  "UNIS/Finance",
  "UNIS/Sales",
  "UNIS/Executive",
  "UNIS/IT",
  "UNIS/Support",
  "Item-industry-accounting",
  "Customer Information",
];

// Mock data for Lenovo permissions
const lenovoPermissions = [
  "Lenovo/Product",
  "Lenovo/Marketing",
  "Lenovo/CRM",
  "Lenovo/Sales",
  "Lenovo/Engineering",
  "Lenovo/Support",
  "Lenovo/Legal",
  "Lenovo/Finance",
  "Lenovo/Executive",
  "Lenovo/HR",
];

// Mock data for users
const mockUsers = [
  {
    id: '1',
    name: 'taylor.zhang@item.com',
    email: 'taylor.zhang@item.com',
    avatar: 'T',
    role: 'Admin'
  },
  {
    id: '2',
    name: 'yangfei',
    email: 'yangfei@teml.net',
    avatar: 'Y',
    role: 'User'
  },
  {
    id: '3',
    name: 'liulin',
    email: 'testhrm@item.com',
    avatar: 'L',
    role: 'User'
  },
  {
    id: '4',
    name: 'peijiali',
    email: 'peijia.li@item.com',
    avatar: 'P',
    role: 'User'
  },
  {
    id: '5',
    name: 'xiaokui.cui@item.com',
    email: 'xiaokui.cui@item.com',
    avatar: 'X',
    role: 'User'
  }
];

interface ManagePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPermissions: string[];
  onPermissionsUpdate: (permissions: string[]) => void;
}

interface PublicConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onDiscard: () => void;
}

const PublicConfirmationModal: React.FC<PublicConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
      <div className="bg-gray-900 rounded-xl w-full max-w-md p-6 border border-orange-500">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold">Make Folder Public?</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 leading-relaxed">
            You are about to make this folder public. Are you sure?
          </p>
          <p className="text-gray-400 text-sm mt-2">
            This will make the folder accessible to everyone in the organization.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            Make Public
          </button>
        </div>
      </div>
    </div>
  );
};

const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDiscard,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
      <div className="bg-primary-color rounded-xl w-full max-w-md p-6 border border-yellow-500">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold">Unsaved Changes</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 leading-relaxed">
            You have unsaved changes to the permissions. What would you like to do?
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onDiscard}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            Discard Changes
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const ManagePermissionsModal: React.FC<ManagePermissionsModalProps> = ({
  isOpen,
  onClose,
  currentPermissions,
  onPermissionsUpdate,
}) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [originalPermissions, setOriginalPermissions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'shareToUsers' | 'roleGroups' | 'invite'>('shareToUsers');
  const [companyName, setCompanyName] = useState('');
  const [isCompanyVerified, setIsCompanyVerified] = useState<boolean | null>(null);
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState(false);
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [batchEmailsInput, setBatchEmailsInput] = useState('');
  const [showBatchInput, setShowBatchInput] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [showPublicConfirmation, setShowPublicConfirmation] = useState(false);
  const [permissionToRemove, setPermissionToRemove] = useState<string | null>(null);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [showRoleGroupsTooltip, setShowRoleGroupsTooltip] = useState(false);
  
  // Share to Users tab state
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isUserSearchFocused, setIsUserSearchFocused] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPermissions(currentPermissions);
      setOriginalPermissions([...currentPermissions]);
      setIsPublic(currentPermissions.length === 0);
      resetState();
    }
  }, [isOpen, currentPermissions]);

  const resetState = () => {
    setSearchQuery('');
    setSelectedPermissions([]);
    setActiveTab('shareToUsers');
    setCompanyName('');
    setIsCompanyVerified(null);
    setHasAttemptedVerification(false);
    setCompanySearchQuery('');
    setInviteEmails([]);
    setEmailInput('');
    setBatchEmailsInput('');
    setShowBatchInput(false);
    setEmailError('');
    setShowPublicConfirmation(false);
    setPermissionToRemove(null);
    setShowUnsavedChangesModal(false);
    setShowRoleGroupsTooltip(false);
    setUserSearchQuery('');
    setIsUserSearchFocused(false);
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    if (permissions.length !== originalPermissions.length) {
      return true;
    }
    
    // Check if permissions arrays have different content
    const sortedCurrent = [...permissions].sort();
    const sortedOriginal = [...originalPermissions].sort();
    
    return !sortedCurrent.every((permission, index) => permission === sortedOriginal[index]);
  };

  const handleClose = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedChangesModal(true);
    } else {
      onClose();
    }
  };

  const handleSaveAndClose = () => {
    onPermissionsUpdate(permissions);
    setShowUnsavedChangesModal(false);
    onClose();
  };

  const handleDiscardAndClose = () => {
    setPermissions([...originalPermissions]);
    setIsPublic(originalPermissions.length === 0);
    setShowUnsavedChangesModal(false);
    onClose();
  };

  const filteredAvailablePermissions = availablePermissions.filter(
    permission => 
      permission.toLowerCase().includes(searchQuery.toLowerCase()) && 
      !permissions.includes(permission)
  );

  const filteredLenovoPermissions = lenovoPermissions.filter(
    permission => 
      permission.toLowerCase().includes(companySearchQuery.toLowerCase()) && 
      !permissions.includes(permission)
  );

  const filteredUsers = mockUsers.filter(user =>
    (user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())) &&
    !permissions.includes(user.email) // Don't show users already in permissions
  );

  const togglePermissionSelection = (permission: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permission) 
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const addSelectedPermissions = () => {
    const newPermissions = [...new Set([...permissions, ...selectedPermissions])];
    setPermissions(newPermissions);
    setSelectedPermissions([]);
    setIsPublic(newPermissions.length === 0);
  };

  const handleRemovePermission = (permission: string) => {
    // Check if this is the last permission
    if (permissions.length === 1) {
      setPermissionToRemove(permission);
      setShowPublicConfirmation(true);
    } else {
      // Remove permission directly if not the last one
      const newPermissions = permissions.filter(p => p !== permission);
      setPermissions(newPermissions);
      setIsPublic(newPermissions.length === 0);
    }
  };

  const confirmMakePublic = () => {
    if (permissionToRemove) {
      const newPermissions = permissions.filter(p => p !== permissionToRemove);
      setPermissions(newPermissions);
      setIsPublic(true);
      setShowPublicConfirmation(false);
      setPermissionToRemove(null);
    }
  };

  const cancelMakePublic = () => {
    setShowPublicConfirmation(false);
    setPermissionToRemove(null);
  };

  const verifyCompany = () => {
    setHasAttemptedVerification(true);
    setIsCompanyVerified(companyName === "Lenovo Group");
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const addEmail = () => {
    if (!emailInput.trim()) return;

    if (!validateEmail(emailInput)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (inviteEmails.includes(emailInput)) {
      setEmailError('This email has already been added');
      return;
    }

    setInviteEmails(prev => [...prev, emailInput]);
    setEmailInput('');
    setEmailError('');
  };

  const removeEmail = (email: string) => {
    setInviteEmails(prev => prev.filter(e => e !== email));
  };

  const addBatchEmails = () => {
    if (!batchEmailsInput.trim()) return;

    const emails = batchEmailsInput
      .split(/[,;\n]/)
      .map(email => email.trim())
      .filter(email => email && validateEmail(email) && !inviteEmails.includes(email));

    if (emails.length > 0) {
      setInviteEmails(prev => [...prev, ...emails]);
      setBatchEmailsInput('');
      setShowBatchInput(false);
    }
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  const handleUserSelect = (userEmail: string) => {
    // Add user email to permissions immediately
    const newPermissions = [...permissions, userEmail];
    setPermissions(newPermissions);
    setIsPublic(newPermissions.length === 0);
    
    // Clear search and hide dropdown
    setUserSearchQuery('');
    setIsUserSearchFocused(false);
  };

  const handleSave = () => {
    onPermissionsUpdate(permissions);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Manage Permissions Modal - Hidden when unsaved changes modal is shown */}
      {!showUnsavedChangesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl w-full max-w-lg">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-semibold">Manage Permissions</h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl mb-6">Current Permissions</h3>
                  {isPublic ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Globe className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <span className="text-green-500 font-semibold text-lg">Public</span>
                          <p className="text-green-400 text-sm">Accessible to everyone in the organization</p>
                        </div>
                      </div>
                    </div>
                  ) : permissions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {permissions.map((permission) => (
                        <div
                          key={permission}
                          className="bg-gray-700 text-purple-300 rounded px-3 py-1.5 flex items-center group"
                        >
                          <Lock className="w-4 h-4 mr-2 text-purple-300" />
                          <span className="font-medium">{permission}</span>
                          <button
                            onClick={() => handleRemovePermission(permission)}
                            className="ml-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all"
                            title="Remove permission"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 italic">No permissions added yet</div>
                  )}
                </div>

                <div className="flex space-x-4 border-b border-gray-800">
                  <button
                    className={`px-4 py-2 flex items-center space-x-2 ${
                      activeTab === 'shareToUsers'
                        ? 'text-purple-500 border-b-2 border-purple-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('shareToUsers')}
                  >
                    <span>Share to Users</span>
                  </button>
                  <button
                    className={`px-4 py-2 flex items-center space-x-2 ${
                      activeTab === 'roleGroups'
                        ? 'text-purple-500 border-b-2 border-purple-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('roleGroups')}
                  >
                    <span>Share to Role Groups</span>
                    <div className="relative">
                      <button
                        onMouseEnter={() => setShowRoleGroupsTooltip(true)}
                        onMouseLeave={() => setShowRoleGroupsTooltip(false)}
                        className="text-gray-400 hover:text-gray-300 transition-colors"
                        type="button"
                      >
                        <AlertCircle size={16} />
                      </button>
                      {showRoleGroupsTooltip && (
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 min-w-max pointer-events-none">
                          <div className="text-sm text-gray-200">
                            Users with these role tags can access this folder
                          </div>
                          {/* Tooltip arrow pointing left */}
                          <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-600"></div>
                        </div>
                      )}
                    </div>
                  </button>
                  <button
                    className={`px-4 py-2 ${
                      activeTab === 'invite'
                        ? 'text-purple-500 border-b-2 border-purple-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('invite')}
                  >
                    Invite
                  </button>
                </div>

                {activeTab === 'shareToUsers' ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Add Users by Email</h3>
                    
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        onFocus={() => setIsUserSearchFocused(true)}
                        onBlur={() => {
                          // Delay hiding to allow for clicks
                          setTimeout(() => setIsUserSearchFocused(false), 200);
                        }}
                        placeholder="Search email address and Select"
                        className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {/* Show user dropdown only when search is focused and has query */}
                    {isUserSearchFocused && userSearchQuery.trim() && (
                      <div className="absolute z-50 w-full mt-1 bg-gray-800 rounded-lg shadow-lg border border-gray-700 max-h-[300px] overflow-y-auto">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <div
                              key={user.id}
                              onClick={() => handleUserSelect(user.email)}
                              className="p-4 flex items-center space-x-3 hover:bg-gray-700 cursor-pointer transition-colors"
                            >
                              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.avatar}
                              </div>
                              <div>
                                <div className="text-white font-medium">{user.name}</div>
                                <div className="text-gray-400 text-sm">{user.email}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-gray-400 text-center">
                            No users found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : activeTab === 'roleGroups' ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Department/Role"
                        className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="max-h-[200px] overflow-y-auto space-y-2">
                      {filteredAvailablePermissions.map((permission) => (
                        <div
                          key={permission}
                          onClick={() => togglePermissionSelection(permission)}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center">
                            <Lock className="w-4 h-4 mr-2 text-purple-500" />
                            <span>{permission}</span>
                          </div>
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                            selectedPermissions.includes(permission)
                              ? 'bg-purple-500 border-purple-500'
                              : 'border-gray-600'
                          }`}>
                            {selectedPermissions.includes(permission) && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Invite Individual Users</h3>
                        <button
                          onClick={() => setShowBatchInput(!showBatchInput)}
                          className="text-sm text-purple-500 hover:text-purple-400"
                        >
                          {showBatchInput ? 'Single Invite' : 'Batch Invite'}
                        </button>
                      </div>

                      {!showBatchInput ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                              <input
                                type="email"
                                value={emailInput}
                                onChange={(e) => {
                                  setEmailInput(e.target.value);
                                  setEmailError('');
                                }}
                                onKeyDown={handleEmailKeyDown}
                                placeholder="Enter email address"
                                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <button
                              onClick={addEmail}
                              disabled={!emailInput.trim()}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                            >
                              Add
                            </button>
                          </div>
                          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <textarea
                            value={batchEmailsInput}
                            onChange={(e) => setBatchEmailsInput(e.target.value)}
                            placeholder="Enter multiple email addresses (separated by commas, semicolons, or new lines)"
                            className="w-full bg-gray-800 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                          />
                          <button
                            onClick={addBatchEmails}
                            disabled={!batchEmailsInput.trim()}
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                          >
                            Add All
                          </button>
                        </div>
                      )}

                      {inviteEmails.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">Users to invite ({inviteEmails.length})</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {inviteEmails.map((email) => (
                              <div
                                key={email}
                                className="bg-blue-500/20 text-blue-400 rounded-full px-3 py-1 flex items-center"
                              >
                                <User className="w-4 h-4 mr-2" />
                                <span>{email}</span>
                                <button
                                  onClick={() => removeEmail(email)}
                                  className="ml-2 text-red-400 hover:text-red-300"
                                  title="Remove email"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Cross-tenant Invite</h3>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => {
                            setCompanyName(e.target.value);
                            if (hasAttemptedVerification) {
                              setIsCompanyVerified(null);
                              setHasAttemptedVerification(false);
                            }
                          }}
                          placeholder="Enter company name"
                          className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          onClick={verifyCompany}
                          disabled={!companyName}
                          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                        >
                          Verify
                        </button>
                      </div>

                      {hasAttemptedVerification && (
                        <div className={`flex items-center ${
                          isCompanyVerified ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {isCompanyVerified ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 mr-2" />
                              <span>Successfully verified</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-5 h-5 mr-2" />
                              <span>Verification failed</span>
                            </>
                          )}
                        </div>
                      )}

                      {isCompanyVerified && (
                        <div className="space-y-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                              type="text"
                              value={companySearchQuery}
                              onChange={(e) => setCompanySearchQuery(e.target.value)}
                              placeholder="Search Lenovo permissions..."
                              className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div className="max-h-[200px] overflow-y-auto space-y-2">
                            {filteredLenovoPermissions.map((permission) => (
                              <div
                                key={permission}
                                onClick={() => togglePermissionSelection(permission)}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                              >
                                <div className="flex items-center">
                                  <Lock className="w-4 h-4 mr-2 text-purple-500" />
                                  <span>{permission}</span>
                                </div>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                                  selectedPermissions.includes(permission)
                                    ? 'bg-purple-500 border-purple-500'
                                    : 'border-gray-600'
                                }`}>
                                  {selectedPermissions.includes(permission) && (
                                    <Check className="w-4 h-4 text-white" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedPermissions.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      onClick={addSelectedPermissions}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Add Selected ({selectedPermissions.length})
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PublicConfirmationModal
        isOpen={showPublicConfirmation}
        onClose={cancelMakePublic}
        onConfirm={confirmMakePublic}
      />

      <UnsavedChangesModal
        isOpen={showUnsavedChangesModal}
        onClose={() => setShowUnsavedChangesModal(false)}
        onSave={handleSaveAndClose}
        onDiscard={handleDiscardAndClose}
      />
    </>
  );
};

export default ManagePermissionsModal;