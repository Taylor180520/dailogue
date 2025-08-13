import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ExternalLink, ChevronDown, ChevronRight, Users, ArrowLeft, UserPlus, Check, ChevronDown as ChevronDownIcon } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  permission: 'View-only' | 'Can edit' | 'Full access';
  addedAt: Date;
}

type PermissionOption = 'View-only' | 'Can edit' | 'Full access' | 'Revoke';

interface RoleGroup {
  id: string;
  name: string;
  memberCount: number;
  permission: 'View-only' | 'Can edit' | 'Full access';
  addedAt: Date;
  members: User[];
}

interface SharePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeBaseName: string;
}

const SharePermissionModal: React.FC<SharePermissionModalProps> = ({
  isOpen,
  onClose,
  knowledgeBaseName
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isInviteMode, setIsInviteMode] = useState(false);
  const [invitePermission, setInvitePermission] = useState<'View-only' | 'Can edit' | 'Full access'>('View-only');
  const [inviteTags, setInviteTags] = useState<Array<{id: string, name: string, type: 'user' | 'group', email?: string}>>([]);
  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Mock data - 在实际项目中这将从API获取
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@company.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e64f?w=32&h=32&fit=crop&crop=face',
      permission: 'Full access',
      addedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@company.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      permission: 'Can edit',
      addedAt: new Date('2024-01-10')
    },
    {
      id: '3',
      name: 'Carol Wilson',
      email: 'carol.wilson@company.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      permission: 'View-only',
      addedAt: new Date('2024-01-05')
    }
  ]);

  const [roleGroups, setRoleGroups] = useState<RoleGroup[]>([
    {
      id: '1',
      name: 'Engineering Team',
      memberCount: 12,
      permission: 'Can edit',
      addedAt: new Date('2024-01-12'),
      members: [
        {
          id: '4',
          name: 'David Chen',
          email: 'david.chen@company.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
          permission: 'Can edit',
          addedAt: new Date('2024-01-12')
        },
        {
          id: '5',
          name: 'Emily Davis',
          email: 'emily.davis@company.com',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=32&h=32&fit=crop&crop=face',
          permission: 'Can edit',
          addedAt: new Date('2024-01-12')
        }
      ]
    },
    {
      id: '2',
      name: 'Marketing Team',
      memberCount: 8,
      permission: 'View-only',
      addedAt: new Date('2024-01-08'),
      members: [
        {
          id: '6',
          name: 'Frank Miller',
          email: 'frank.miller@company.com',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
          permission: 'View-only',
          addedAt: new Date('2024-01-08')
        }
      ]
    }
  ]);

  const [searchResults, setSearchResults] = useState<(User | RoleGroup)[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handlePermissionChange = (userId: string, newPermission: PermissionOption) => {
    if (newPermission === 'Revoke') {
      setUsers((prev: User[]) => prev.filter((user: User) => user.id !== userId));
      return;
    }
    
    setUsers((prev: User[]) => 
      prev.map((user: User) => 
        user.id === userId ? { ...user, permission: newPermission as User['permission'] } : user
      )
    );
  };

  const handleGroupPermissionChange = (groupId: string, newPermission: RoleGroup['permission']) => {
    setRoleGroups((prev: RoleGroup[]) => 
      prev.map((group: RoleGroup) => 
        group.id === groupId ? { ...group, permission: newPermission } : group
      )
    );
  };

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const getPermissionStyles = (permission: string) => {
    switch (permission) {
      case 'View-only':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      case 'Can edit':
        return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300';
      case 'Full access':
        return 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  // Mock data for suggested invites - 在实际项目中这将从My Teams API获取
  const [suggestedUsers] = useState<User[]>([
    {
      id: 'suggest-1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=32&h=32&fit=crop&crop=face',
      permission: 'View-only',
      addedAt: new Date()
    },
    {
      id: 'suggest-2',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
      permission: 'View-only',
      addedAt: new Date()
    }
  ]);

  const [suggestedGroups] = useState<RoleGroup[]>([
    {
      id: 'suggest-group-1',
      name: 'Design Team',
      memberCount: 6,
      permission: 'View-only',
      addedAt: new Date(),
      members: []
    }
  ]);

  // 按最近添加时间排序
  const sortedUsers = [...users].sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
  const sortedRoleGroups = [...roleGroups].sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());

  // 筛选建议用户和组（排除已有权限的）
  const filteredSuggestedUsers = suggestedUsers.filter(suggestedUser => 
    !users.find(user => user.id === suggestedUser.id)
  );
  const filteredSuggestedGroups = suggestedGroups.filter(suggestedGroup => 
    !roleGroups.find(group => group.id === suggestedGroup.id)
  );

  // Search effect with proper dependencies
  useEffect(() => {
    if (searchQuery.trim()) {
      if (isInviteMode) {
        // In invite mode, search from suggested users and groups
        const suggestedUserResults = filteredSuggestedUsers.filter(user => 
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const suggestedGroupResults = filteredSuggestedGroups.filter(group =>
          group.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults([...suggestedUserResults, ...suggestedGroupResults]);
        setShowSearchResults(true);
      } else {
        // In share mode, search from existing users and groups
        const userResults = users.filter(user => 
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const groupResults = roleGroups.filter(group =>
          group.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults([...userResults, ...groupResults]);
        setShowSearchResults(true);
      }
    } else {
      setShowSearchResults(false);
    }
  }, [searchQuery, users, roleGroups, isInviteMode, filteredSuggestedUsers, filteredSuggestedGroups]);

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInviteClick = () => {
    setIsInviteMode(true);
    setSearchQuery('');
    setInputValue('');
    setInviteTags([]);
    setValidationError('');
    setShowSearchResults(false);
  };

  const handleBackToShare = () => {
    setIsInviteMode(false);
    setSearchQuery('');
    setInputValue('');
    setInviteTags([]);
    setValidationError('');
    setShowSearchResults(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTagFromInput();
    }
  };

  const addTagFromInput = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    // Check if it looks like an email
    if (trimmedValue.includes('@')) {
      if (!isValidEmail(trimmedValue)) {
        setValidationError('Invalid Email Address');
        return;
      }
      // Add as user with email
      const newTag = {
        id: `email-${Date.now()}`,
        name: trimmedValue,
        type: 'user' as const,
        email: trimmedValue
      };
      setInviteTags(prev => [...prev, newTag]);
    } else {
      // Add as user name
      const newTag = {
        id: `user-${Date.now()}`,
        name: trimmedValue,
        type: 'user' as const
      };
      setInviteTags(prev => [...prev, newTag]);
    }
    
    setInputValue('');
    setValidationError('');
  };

  const removeInviteTag = (tagId: string) => {
    setInviteTags(prev => prev.filter(tag => tag.id !== tagId));
  };

  const addSuggestedToTags = (item: User | RoleGroup) => {
    if ('email' in item) {
      // It's a user
      const newTag = {
        id: item.id,
        name: item.name,
        type: 'user' as const,
        email: item.email
      };
      setInviteTags(prev => [...prev, newTag]);
    } else {
      // It's a role group
      const newTag = {
        id: item.id,
        name: item.name,
        type: 'group' as const
      };
      setInviteTags(prev => [...prev, newTag]);
    }
  };

  const handleInviteSubmit = () => {
    if (inviteTags.length === 0) return;

    // Process invitations
    inviteTags.forEach(tag => {
      if (tag.type === 'user') {
        const newUser: User = {
          id: tag.id,
          name: tag.name,
          email: tag.email || `${tag.name}@company.com`, // Fallback email
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face', // Default avatar
          permission: invitePermission,
          addedAt: new Date()
        };
        setUsers(prev => [newUser, ...prev]);
      } else {
        const newGroup: RoleGroup = {
          id: tag.id,
          name: tag.name,
          memberCount: 5, // Default member count
          permission: invitePermission,
          addedAt: new Date(),
          members: []
        };
        setRoleGroups(prev => [newGroup, ...prev]);
      }
    });

    // Clear invite state and go back to share mode
    setInviteTags([]);
    setInputValue('');
    setValidationError('');
    setIsInviteMode(false);
    
    // Here you would also send email notifications
    console.log('Sending email notifications to:', inviteTags);
  };

  const handleInviteUser = (user: User) => {
    // Add user to the shared list
    setUsers(prev => [{ ...user, addedAt: new Date() }, ...prev]);
    // Optionally switch back to share mode
    setIsInviteMode(false);
  };

  const handleInviteGroup = (group: RoleGroup) => {
    // Add group to the shared list
    setRoleGroups(prev => [{ ...group, addedAt: new Date() }, ...prev]);
    // Optionally switch back to share mode
    setIsInviteMode(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl min-h-[400px] max-h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          {isInviteMode ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToShare}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Invite
              </h2>
            </div>
          ) : (
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Share "{knowledgeBaseName}"
            </h2>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search and Invite */}
        {!isInviteMode && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                <input
                  type="text"
                  placeholder="Search users or role groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={handleInviteClick}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-600 focus:outline-none text-sm cursor-pointer"
                  readOnly
                />
                
                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {searchResults.map((result) => (
                      <div 
                        key={result.id}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                      >
                        {'email' in result ? (
                          <div className="flex items-center gap-3">
                            <img src={result.avatar} alt={result.name} className="w-8 h-8 rounded-full" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{result.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{result.email}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
                              <Users size={16} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{result.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{result.memberCount} members</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={handleInviteClick}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors text-sm"
              >
                Invite
              </button>
            </div>
          </div>
        )}

        {/* Invite Mode Content */}
        {isInviteMode && (
          <div className="p-6 space-y-6">
            {/* Search Input with Tags and Invite Button */}
            <div className="flex gap-3 items-start">
              <div className="flex-1 relative">
                <div className="min-h-[60px] bg-white dark:bg-gray-700 border-2 border-blue-400 rounded-lg focus-within:border-blue-500">
                  {/* Main container with permission selector on top right */}
                  <div className="flex items-start justify-between p-3 gap-2">
                    {/* Left side: Tags and Input */}
                    <div className="flex-1 min-w-0">
                      {/* Tags */}
                      {inviteTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {inviteTags.map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                            >
                              <span className="w-6 h-6 bg-gray-300 dark:bg-gray-500 rounded-full flex items-center justify-center text-xs font-semibold">
                                {tag.type === 'group' ? <Users size={12} /> : tag.name.charAt(0).toUpperCase()}
                              </span>
                              <span>{tag.name}</span>
                              <button
                                onClick={() => removeInviteTag(tag.id)}
                                className="hover:text-red-500 dark:hover:text-red-400 flex-shrink-0"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Input */}
                      <input
                        type="text"
                        placeholder={inviteTags.length === 0 ? "Enter username, email, or group name..." : ""}
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value);
                          setSearchQuery(e.target.value);
                          setValidationError('');
                        }}
                        onKeyDown={handleInputKeyDown}
                        className="w-full py-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-sm"
                      />
                    </div>
                    
                    {/* Right side: Permission Selector (always in top-right) */}
                    <div className="relative flex-shrink-0 self-start">
                      <select
                        value={invitePermission}
                        onChange={(e) => setInvitePermission(e.target.value as typeof invitePermission)}
                        className="appearance-none px-3 py-1 pr-7 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded text-gray-700 dark:text-gray-300 focus:border-blue-500 focus:outline-none text-xs cursor-pointer"
                      >
                        <option value="View-only">View-only</option>
                        <option value="Can edit">Can edit</option>
                        <option value="Full access">Full access</option>
                      </select>
                      <ChevronDownIcon size={12} className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                {/* Validation Error */}
                {validationError && (
                  <div className="text-red-500 dark:text-red-400 text-xs mt-1">{validationError}</div>
                )}
              
                              {/* Search Results Dropdown for Invite Mode */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {searchResults.map((result) => (
                      <div 
                        key={result.id}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                        onClick={() => {
                          addSuggestedToTags(result);
                          setSearchQuery('');
                          setInputValue('');
                          setShowSearchResults(false);
                        }}
                      >
                        {'email' in result ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <img src={result.avatar} alt={result.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{result.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{result.email}</div>
                              </div>
                            </div>
                            <UserPlus size={16} className="text-purple-600 dark:text-purple-400 flex-shrink-0 ml-3" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                                <Users size={16} className="text-purple-600 dark:text-purple-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{result.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{result.memberCount} members</div>
                              </div>
                            </div>
                            <UserPlus size={16} className="text-purple-600 dark:text-purple-400 flex-shrink-0 ml-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Invite Button - on the right side of search */}
              <button 
                onClick={handleInviteSubmit}
                disabled={inviteTags.length === 0}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm flex-shrink-0"
              >
                Invite
              </button>
            </div>
            

          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {isInviteMode ? (
            // Suggested Content for Invite Mode
            <div className="p-6 pt-0">
              {(filteredSuggestedUsers.length > 0 || filteredSuggestedGroups.length > 0) ? (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Suggested</h3>
                  
                  {/* Grid layout for better space utilization */}
                  <div className="grid grid-cols-1 gap-1">
                    {/* Suggested Users */}
                    {filteredSuggestedUsers.map((user) => {
                      const isSelected = inviteTags.some(tag => tag.id === user.id);
                      return (
                        <div 
                          key={user.id} 
                          className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                          onClick={() => addSuggestedToTags(user)}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-3">
                            {isSelected ? (
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Check size={14} className="text-white" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Suggested Role Groups */}
                    {filteredSuggestedGroups.map((group) => {
                      const isSelected = inviteTags.some(tag => tag.id === group.id);
                      return (
                        <div 
                          key={group.id} 
                          className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                          onClick={() => addSuggestedToTags(group)}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users size={16} className="text-gray-600 dark:text-gray-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{group.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Group • {group.memberCount} person{group.memberCount !== 1 ? 's' : ''}</div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-3">
                            {isSelected ? (
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Check size={14} className="text-white" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 dark:text-gray-400 text-sm">No suggestions available</div>
                  <div className="text-gray-400 dark:text-gray-500 text-xs mt-1">All members from your teams already have access</div>
                </div>
              )}
            </div>
          ) : (
            // Share Mode Content
            <div className="p-6 space-y-4">
            {/* Users Section */}
            {sortedUsers.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Users</h3>
                <div className="space-y-3">
                  {sortedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                      </div>
                      <select
                        value={user.permission}
                        onChange={(e) => handlePermissionChange(user.id, e.target.value as User['permission'])}
                        className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-600 focus:outline-none"
                      >
                        <option value="View-only">View-only</option>
                        <option value="Can edit">Can edit</option>
                        <option value="Full access">Full access</option>
                        <option value="Revoke" className="text-red-600">Revoke</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Role Groups Section */}
            {sortedRoleGroups.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Role Groups</h3>
                <div className="space-y-3">
                  {sortedRoleGroups.map((group) => (
                    <div key={group.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
                            <Users size={16} className="text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{group.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{group.memberCount} members</div>
                            </div>
                            <button
                              onClick={() => toggleGroupExpansion(group.id)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-1"
                            >
                              {expandedGroups.has(group.id) ? (
                                <ChevronDown size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                        <select
                          value={group.permission}
                          onChange={(e) => handleGroupPermissionChange(group.id, e.target.value as RoleGroup['permission'])}
                          className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-600 focus:outline-none"
                        >
                          <option value="View-only">View-only</option>
                          <option value="Can edit">Can edit</option>
                          <option value="Full access">Full access</option>
                        </select>
                      </div>
                      
                      {/* Expanded Group Members */}
                      {expandedGroups.has(group.id) && (
                        <div className="ml-11 mt-2 space-y-2 border-l border-gray-200 dark:border-gray-600 pl-3">
                          {group.members.map((member) => (
                            <div key={member.id} className="flex items-center gap-3">
                              <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full" />
                              <div>
                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{member.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{member.email}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {sortedUsers.length === 0 && sortedRoleGroups.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500 dark:text-gray-400 text-sm">No permissions granted yet</div>
                <div className="text-gray-400 dark:text-gray-500 text-xs mt-1">Use the search box above to invite users or role groups</div>
              </div>
            )}
          </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={() => window.open('/my-teams?tab=knowledge-base', '_blank')}
            className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors text-sm font-medium"
          >
            <span>Manage My Teams</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePermissionModal; 