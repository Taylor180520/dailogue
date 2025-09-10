import React, { useState } from 'react';
import { X, Search, Upload, Pencil, RotateCw, Trash2 } from 'lucide-react';

interface ActivityLog {
  id: string;
  fileName: string;
  action: 'Uploaded' | 'Modified' | 'Reprocessed' | 'Deleted';
  user: string;
  timestamp: string;
}

interface ActivityLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActivityLogsModal: React.FC<ActivityLogsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const getActionIcon = (action: string) => {
    const iconProps = { size: 20, className: "text-current" };
    switch (action) {
      case 'Uploaded':
        return <Upload {...iconProps} />;
      case 'Modified':
        return <Pencil {...iconProps} />;
      case 'Reprocessed':
        return <RotateCw {...iconProps} />;
      case 'Deleted':
        return <Trash2 {...iconProps} />;
      default:
        return null;
    }
  };

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case 'Uploaded':
        return 'bg-emerald-500/10 text-emerald-500';
      case 'Modified':
        return 'bg-orange-500/10 text-orange-500';
      case 'Reprocessed':
        return 'bg-blue-500/10 text-blue-500';
      case 'Deleted':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-800/50 text-gray-500';
    }
  };

  const mockLogs: ActivityLog[] = [
    {
      id: '1',
      fileName: 'Corporate Policy v2.0.pdf',
      action: 'Uploaded',
      user: 'John Smith',
      timestamp: 'Dec 15, 2023, 10:30 PM',
    },
    {
      id: '2',
      fileName: 'Employee Handbook.docx',
      action: 'Modified',
      user: 'Sarah Johnson',
      timestamp: 'Dec 14, 2023, 6:15 PM',
    },
    {
      id: '3',
      fileName: 'Q4 Financial Report.xlsx',
      action: 'Reprocessed',
      user: 'Michael Brown',
      timestamp: 'Dec 14, 2023, 12:45 AM',
    },
    {
      id: '4',
      fileName: 'Product Roadmap.pptx',
      action: 'Deleted',
      user: 'Emily Davis',
      timestamp: 'Dec 12, 2023, 5:20 PM',
    },
    {
      id: '5',
      fileName: 'Marketing Strategy.pdf',
      action: 'Uploaded',
      user: 'David Wilson',
      timestamp: 'Dec 11, 2023, 7:05 PM',
    },
    {
      id: '6',
      fileName: 'Employee Handbook.docx',
      action: 'Modified',
      user: 'Sarah Johnson',
      timestamp: 'Dec 10, 2023, 3:20 PM',
    },
  ];

  const filteredLogs = mockLogs.filter(log =>
    log.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-primary-color rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Activity Logs</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search document name..."
              className="w-full bg-gray-800/50 text-white rounded-2xl pl-12 pr-4 py-3 border border-gray-700 focus:outline-none focus:border-purple-500 placeholder-gray-400"
            />
          </div>

          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-gray-800/50 rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActionBadgeClass(log.action)}`}>
                    {getActionIcon(log.action)}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{log.fileName}</h3>
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-500">by</span> {log.user} • {log.timestamp}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActionBadgeClass(log.action)}`}>
                  {log.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogsModal;