import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Filter, Shield, FileText, Link, Calendar, X, RotateCcw } from 'lucide-react';

interface ActivityLog {
  id: string;
  time: string;
  date: string; // Added full date for filtering
  user: string;
  action: 'Uploaded' | 'Deleted' | 'Renamed';
  objectType: 'Document' | 'Link';
  objectName: string;
  objectFrom?: string; // For renamed files
  isAdmin?: boolean;
  folder?: string; // 新增字段：文件夹
  process?: string; // 新增字段：流程
  uploader?: string; // 新增字段：上传者
  contributor?: string; // 新增字段：贡献者
}

interface ActivityLogsTableProps {
  searchQuery: string;
}

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onApply: () => void;
}

interface FilterDropdownProps {
  title: string;
  items: string[];
  selectedItems: string[];
  toggleItem: (item: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
  isOpen,
  onToggle,
  onApply,
}) => {
  const hasDateRange = startDate || endDate;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
          hasDateRange
            ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
            : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
        }`}
      >
        <Calendar size={16} />
        <span className="text-sm">
          {hasDateRange 
            ? `${startDate || 'Start'} - ${endDate || 'End'}`
            : 'Date Range'
          }
        </span>
        {hasDateRange && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="ml-1 p-1 hover:bg-purple-500/30 rounded transition-colors"
          >
            <X size={12} />
          </button>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop for click outside detection */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={onApply}
          />
          
          <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4 z-50 min-w-[520px]">
            <div className="space-y-4">
              {/* Header with Reset button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">Select Date Range</span>
                </div>
                <button
                  onClick={onClear}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors text-sm"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Start Date</label>
                  <input
                    type="date"
                    lang="en"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    max={endDate || undefined}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">End Date</label>
                  <input
                    type="date"
                    lang="en"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    min={startDate || undefined}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
                  />
                </div>
              </div>

              {/* Full-width Apply button */}
              <button
                onClick={onApply}
                className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Apply Filters
              </button>
              
              {/* Hint text */}
              <div className="text-center">
                <span className="text-xs text-gray-500">Click outside to apply filters</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  title,
  items,
  selectedItems,
  toggleItem,
  isOpen,
  onToggle,
  onClose
}) => {
  return (
    <div className="flex items-center space-x-2 relative">
      <span>{title}</span>
      <button
        onClick={onToggle}
        className="hover:bg-gray-700 p-1.5 rounded-md bg-gray-800 border border-gray-600 flex items-center justify-center"
      >
        <Filter 
          size={14} 
          className={selectedItems.length > 0 ? 'text-purple-500' : 'text-gray-400'} 
        />
      </button>
      {isOpen && (
        <>
          {/* Backdrop for click outside detection */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={onClose}
          />
          <div className="absolute z-50 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-xl" 
               style={{ 
                 top: 'calc(100% + 0.5rem)', 
                 left: '0',
                 transform: 'translateX(-25%)'
               }}>
            <div className="p-3 border-b border-gray-700 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Filter Options</span>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-300"
              >
                <X size={16} />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto py-2">
              {items.length > 0 ? (
                items.map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleItem(item)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700 text-left"
                  >
                    <span className="text-sm text-gray-300">{item}</span>
                    <div className={`w-5 h-5 rounded ${selectedItems.includes(item) ? 'bg-purple-600' : 'bg-gray-700 border border-gray-600'}`}>
                      {selectedItems.includes(item) && (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-400 text-center">
                  No items available
                </div>
              )}
            </div>
            <div className="p-3 border-t border-gray-700">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Apply Filters
              </button>
              <div className="text-center mt-2">
                <span className="text-xs text-gray-500">Click outside to apply filters</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const ActivityLogsTable: React.FC<ActivityLogsTableProps> = ({ searchQuery }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showUserFilter, setShowUserFilter] = useState(false);
  const [showFolderFilter, setShowFolderFilter] = useState(false);
  const [showProcessFilter, setShowProcessFilter] = useState(false);
  const [showUploaderFilter, setShowUploaderFilter] = useState(false);
  const [showContributorFilter, setShowContributorFilter] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);
  const [selectedUploaders, setSelectedUploaders] = useState<string[]>([]);
  const [selectedContributors, setSelectedContributors] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const filterChips = [
    'Upload',
    'Delete', 
    'Rename',
    'Others Actions Only',
    'My Actions Only'
  ];

  const mockLogs: ActivityLog[] = [
    {
      id: '1',
      time: '10:15',
      date: '2025-01-15',
      user: 'Alice Wang',
      action: 'Renamed',
      objectType: 'Document',
      objectName: 'final_report.docx',
      objectFrom: 'report_v2.docx',
      isAdmin: true,
      folder: 'Marketing/Reports',
      process: 'Annual Review',
      uploader: 'Alice Wang',
      contributor: 'Marketing Team'
    },
    {
      id: '2',
      time: '09:50',
      date: '2025-01-15',
      user: 'Bob Lee',
      action: 'Deleted',
      objectType: 'Document',
      objectName: 'draft_plan.docx',
      isAdmin: true,
      folder: 'Projects/Planning',
      process: 'Project Cleanup',
      uploader: 'Sarah Johnson',
      contributor: 'Project Team'
    },
    {
      id: '3',
      time: '09:15',
      date: '2025-01-14',
      user: 'Sarah Johnson',
      action: 'Uploaded',
      objectType: 'Link',
      objectName: 'https://example.com/marketing-strategy',
      isAdmin: false,
      folder: 'Marketing/Links',
      process: 'Strategy Development',
      uploader: 'Sarah Johnson',
      contributor: 'External Agency'
    },
    {
      id: '4',
      time: '08:45',
      date: '2025-01-14',
      user: 'Mike Brown',
      action: 'Renamed',
      objectType: 'Document',
      objectName: 'project_timeline.xlsx',
      objectFrom: 'timeline_draft.xlsx',
      isAdmin: true,
      folder: 'Projects/Timelines',
      process: 'Project Planning',
      uploader: 'Mike Brown',
      contributor: 'Development Team'
    },
    {
      id: '5',
      time: '08:30',
      date: '2025-01-13',
      user: 'Emily Davis',
      action: 'Deleted',
      objectType: 'Document',
      objectName: 'old_presentation.pptx',
      isAdmin: true,
      folder: 'Presentations/Archive',
      process: 'Content Cleanup',
      uploader: 'Bob Lee',
      contributor: 'Sales Team'
    },
    {
      id: '6',
      time: '08:00',
      date: '2025-01-12',
      user: 'Sarah Johnson',
      action: 'Uploaded',
      objectType: 'Document',
      objectName: 'employee_handbook.pdf',
      isAdmin: false,
      folder: 'HR/Policies',
      process: 'Onboarding',
      uploader: 'Sarah Johnson',
      contributor: 'HR Team'
    }
  ];

  const allUsers = Array.from(new Set(mockLogs.map(log => log.user)));
  const allFolders = Array.from(new Set(mockLogs.map(log => log.folder).filter(Boolean) as string[]));
  const allProcesses = Array.from(new Set(mockLogs.map(log => log.process).filter(Boolean) as string[]));
  const allUploaders = Array.from(new Set(mockLogs.map(log => log.uploader).filter(Boolean) as string[]));
  const allContributors = Array.from(new Set(mockLogs.map(log => log.contributor).filter(Boolean) as string[]));

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const toggleUserFilter = (user: string) => {
    setSelectedUsers(prev =>
      prev.includes(user)
        ? prev.filter(u => u !== user)
        : [...prev, user]
    );
  };

  const toggleFolderFilter = (folder: string) => {
    setSelectedFolders(prev =>
      prev.includes(folder)
        ? prev.filter(f => f !== folder)
        : [...prev, folder]
    );
  };

  const toggleProcessFilter = (process: string) => {
    setSelectedProcesses(prev =>
      prev.includes(process)
        ? prev.filter(p => p !== process)
        : [...prev, process]
    );
  };

  const toggleUploaderFilter = (uploader: string) => {
    setSelectedUploaders(prev =>
      prev.includes(uploader)
        ? prev.filter(u => u !== uploader)
        : [...prev, uploader]
    );
  };

  const toggleContributorFilter = (contributor: string) => {
    setSelectedContributors(prev =>
      prev.includes(contributor)
        ? prev.filter(c => c !== contributor)
        : [...prev, contributor]
    );
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const clearDateRange = () => {
    setStartDate('');
    setEndDate('');
  };

  const applyDateFilter = () => {
    setIsDatePickerOpen(false);
  };

  const getUserIcon = (user: string, isAdmin: boolean) => {
    if (user === 'Sarah Johnson') {
      return <span className="text-lg">👤</span>; // Bust emoji for current user
    }
    if (isAdmin) {
      return <Shield size={16} className="text-purple-400" />; // Shield icon for admin users
    }
    return <span className="text-lg">👤</span>; // Default bust emoji for other users
  };

  const getObjectIcon = (objectType: string) => {
    switch (objectType) {
      case 'Document':
        return <FileText size={16} className="text-blue-400" />;
      case 'Link':
        return <Link size={16} className="text-green-400" />;
      default:
        return <FileText size={16} className="text-gray-400" />;
    }
  };

  const formatObjectName = (objectName: string, objectType: string) => {
    if (objectType === 'Link') {
      // For links, show a shortened version if too long
      if (objectName.length > 40) {
        return objectName.substring(0, 37) + '...';
      }
    }
    return objectName;
  };

  const isDateInRange = (logDate: string) => {
    if (!startDate && !endDate) return true;
    
    const date = new Date(logDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start && end) {
      return date >= start && date <= end;
    } else if (start) {
      return date >= start;
    } else if (end) {
      return date <= end;
    }
    
    return true;
  };

  const filteredLogs = mockLogs
    .filter(log => {
      // Search filter
      const matchesSearch = 
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.objectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.folder?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (log.process?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (log.uploader?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (log.contributor?.toLowerCase() || '').includes(searchQuery.toLowerCase());

      // Action filters - only apply if there are selected filters
      let matchesActionFilter = true;
      const actionFilters = selectedFilters.filter(f => 
        ['Upload', 'Delete', 'Rename'].includes(f)
      );
      
      if (actionFilters.length > 0) {
        matchesActionFilter = actionFilters.some(filter => {
          if (filter === 'Upload') return log.action === 'Uploaded';
          if (filter === 'Delete') return log.action === 'Deleted';
          if (filter === 'Rename') return log.action === 'Renamed';
          return false;
        });
      }

      // User filters
      const matchesUserFilter = selectedUsers.length === 0 || selectedUsers.includes(log.user);

      // Folder filters
      const matchesFolderFilter = selectedFolders.length === 0 || (log.folder && selectedFolders.includes(log.folder));

      // Process filters
      const matchesProcessFilter = selectedProcesses.length === 0 || (log.process && selectedProcesses.includes(log.process));

      // Uploader filters
      const matchesUploaderFilter = selectedUploaders.length === 0 || (log.uploader && selectedUploaders.includes(log.uploader));

      // Contributor filters
      const matchesContributorFilter = selectedContributors.length === 0 || (log.contributor && selectedContributors.includes(log.contributor));

      // Date range filter
      const matchesDateRange = isDateInRange(log.date);

      // Special filters - only apply if selected
      let matchesSpecialFilter = true;
      
      if (selectedFilters.includes('Others Actions Only')) {
        // Filter for admin users only
        matchesSpecialFilter = log.isAdmin === true;
      } else if (selectedFilters.includes('My Actions Only')) {
        // Filter for current user (Sarah Johnson) only
        matchesSpecialFilter = log.user === 'Sarah Johnson';
      }

      return matchesSearch && 
             matchesActionFilter && 
             matchesUserFilter && 
             matchesFolderFilter && 
             matchesProcessFilter && 
             matchesUploaderFilter && 
             matchesContributorFilter && 
             matchesDateRange && 
             matchesSpecialFilter;
    })
    .sort((a, b) => {
      // Sort by date first, then by time
      const dateComparison = sortOrder === 'asc' 
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date);
      
      if (dateComparison !== 0) return dateComparison;
      
      return sortOrder === 'asc' 
        ? a.time.localeCompare(b.time)
        : b.time.localeCompare(a.time);
    });

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-3">
          {filterChips.map((filter) => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedFilters.includes(filter)
                  ? 'bg-purple-600 text-white border border-purple-500 shadow-lg shadow-purple-500/25 transform scale-105'
                  : 'bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/15 hover:border-purple-500/30'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Date Range Picker */}
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClear={clearDateRange}
          isOpen={isDatePickerOpen}
          onToggle={() => setIsDatePickerOpen(!isDatePickerOpen)}
          onApply={applyDateFilter}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                <button
                  onClick={toggleSort}
                  className="flex items-center space-x-1 hover:text-gray-300 transition-colors"
                >
                  <span>Time</span>
                  {sortOrder === 'asc' ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider relative">
                <FilterDropdown
                  title="Operator"
                  items={allUsers}
                  selectedItems={selectedUsers}
                  toggleItem={toggleUserFilter}
                  isOpen={showUserFilter}
                  onToggle={() => {
                    setShowUserFilter(!showUserFilter);
                    setShowFolderFilter(false);
                    setShowProcessFilter(false);
                    setShowUploaderFilter(false);
                    setShowContributorFilter(false);
                  }}
                  onClose={() => setShowUserFilter(false)}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Object</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider relative">
                <FilterDropdown
                  title="Folder"
                  items={allFolders}
                  selectedItems={selectedFolders}
                  toggleItem={toggleFolderFilter}
                  isOpen={showFolderFilter}
                  onToggle={() => {
                    setShowFolderFilter(!showFolderFilter);
                    setShowUserFilter(false);
                    setShowProcessFilter(false);
                    setShowUploaderFilter(false);
                    setShowContributorFilter(false);
                  }}
                  onClose={() => setShowFolderFilter(false)}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider relative">
                <FilterDropdown
                  title="Process"
                  items={allProcesses}
                  selectedItems={selectedProcesses}
                  toggleItem={toggleProcessFilter}
                  isOpen={showProcessFilter}
                  onToggle={() => {
                    setShowProcessFilter(!showProcessFilter);
                    setShowUserFilter(false);
                    setShowFolderFilter(false);
                    setShowUploaderFilter(false);
                    setShowContributorFilter(false);
                  }}
                  onClose={() => setShowProcessFilter(false)}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider relative">
                <FilterDropdown
                  title="Uploader"
                  items={allUploaders}
                  selectedItems={selectedUploaders}
                  toggleItem={toggleUploaderFilter}
                  isOpen={showUploaderFilter}
                  onToggle={() => {
                    setShowUploaderFilter(!showUploaderFilter);
                    setShowUserFilter(false);
                    setShowFolderFilter(false);
                    setShowProcessFilter(false);
                    setShowContributorFilter(false);
                  }}
                  onClose={() => setShowUploaderFilter(false)}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider relative">
                <FilterDropdown
                  title="Contributor"
                  items={allContributors}
                  selectedItems={selectedContributors}
                  toggleItem={toggleContributorFilter}
                  isOpen={showContributorFilter}
                  onToggle={() => {
                    setShowContributorFilter(!showContributorFilter);
                    setShowUserFilter(false);
                    setShowFolderFilter(false);
                    setShowProcessFilter(false);
                    setShowUploaderFilter(false);
                  }}
                  onClose={() => setShowContributorFilter(false)}
                />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-300">
                      <div className="text-sm">{log.time}</div>
                      <div className="text-xs text-gray-500">{log.date}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getUserIcon(log.user, log.isAdmin || false)}
                      <span className="text-gray-300">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.action === 'Uploaded' 
                        ? 'bg-green-500/10 text-green-500'
                        : log.action === 'Deleted'
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    <div className="flex items-center space-x-2">
                      {getObjectIcon(log.objectType)}
                      {log.action === 'Renamed' && log.objectFrom ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">{log.objectFrom}</span>
                          <span className="text-gray-500">→</span>
                          <span>{formatObjectName(log.objectName, log.objectType)}</span>
                        </div>
                      ) : (
                        <span title={log.objectName}>
                          {formatObjectName(log.objectName, log.objectType)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span title={log.folder || ''}>{log.folder || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span title={log.process || ''}>{log.process || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span title={log.uploader || ''}>{log.uploader || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span title={log.contributor || ''}>{log.contributor || 'N/A'}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-12 w-12 text-gray-400 mb-4">📋</div>
                    <p className="text-gray-400">No activity logs found.</p>
                    <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogsTable;