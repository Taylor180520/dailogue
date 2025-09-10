import React, { useState } from 'react';
import { Eye, Download, Trash2, FileText, Filter, X, Calendar, Info, ChevronDown, ChevronRight, Link as LinkIcon, ExternalLink, RotateCcw, Search, Pencil } from 'lucide-react';
import FileLinksPopup from './FileLinksPopup';

interface Document {
  id: string;
  name: string;
  companyDepartment: string;
  process: string;
  processName: string;
  customer: string;
  retailer: string;
  dateUploaded: string;
  filesCount: number;
  linksCount: number;
  files: Array<{
    name: string;
    url: string;
    isDeleted?: boolean;
    deletedBy?: string;
    isUpdated?: boolean;
    updatedBy?: string;
  }>;
  links: Array<{
    name: string;
    url: string;
  }>;
  hasViewedChanges?: boolean;
  userName: string;
  contributorName: string;
  tags: string[];
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  selectedOptions: string[];
  onToggleOption: (option: string) => void;
  onApply: () => void;
  onClear: () => void;
}

interface DateFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply: () => void;
  onClear: () => void;
}

interface GroupedData {
  [key: string]: Document[];
}

interface CollapsedSections {
  [key: string]: boolean;
}

interface ExpandedSections {
  [key: string]: boolean;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  title,
  options,
  selectedOptions,
  onToggleOption,
  onApply,
  onClear,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-600 z-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* 搜索框 */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search options..." 
              className="bg-gray-700 text-gray-200 pl-10 pr-4 py-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
            />
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                  onClick={() => onToggleOption(option)}
                >
                  <span className="text-gray-300">{option}</span>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedOptions.includes(option)
                      ? 'bg-purple-600 border-purple-600'
                      : 'border-gray-500 bg-transparent'
                  }`}>
                    {selectedOptions.includes(option) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-3 text-gray-400">
                No options match your search
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={onApply}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              Apply Filters
            </button>
            {selectedOptions.length > 0 && (
              <button
                onClick={onClear}
                className="w-full px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="mt-3 text-center">
            <span className="text-xs text-gray-500">Click outside to close</span>
          </div>
        </div>
      </div>
    </>
  );
};

const DateFilterModal: React.FC<DateFilterModalProps> = ({
  isOpen,
  onClose,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full left-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-xl border border-gray-600 z-50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Calendar size={20} className="text-gray-400" />
              <h3 className="text-lg font-medium text-white">Select Date Range</h3>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClear}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors text-sm"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Start Date</label>
                <input
                  type="date"
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
                  value={endDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  min={startDate || undefined}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
                />
              </div>
            </div>

            <button
              onClick={onApply}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Apply Filters
            </button>
            
            <div className="text-center">
              <span className="text-xs text-gray-500">Click outside to apply filters</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface MyUploadsTableProps {
  searchQuery: string;
  renderSearchAndUploadBar?: () => React.ReactNode;
}

const MyUploadsTable: React.FC<MyUploadsTableProps> = ({ searchQuery, renderSearchAndUploadBar }) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showFilesPopup, setShowFilesPopup] = useState(false);
  const [showLinksPopup, setShowLinksPopup] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  
  // Filter states
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showUserFilter, setShowUserFilter] = useState(false);
  const [showContributorFilter, setShowContributorFilter] = useState(false);
  const [showFolderFilter, setShowFolderFilter] = useState(false);
  const [showProcessFilter, setShowProcessFilter] = useState(false);
  const [showCustomerFilter, setShowCustomerFilter] = useState(false);
  const [showRetailerFilter, setShowRetailerFilter] = useState(false);
  const [showTagFilter, setShowTagFilter] = useState(false);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedContributors, setSelectedContributors] = useState<string[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [selectedRetailers, setSelectedRetailers] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // New grouping states
  const [groupBy, setGroupBy] = useState<string>('folder');
  const [collapsedSections, setCollapsedSections] = useState<CollapsedSections>({});
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({});

  // 在组件顶层添加状态
  const [tagTooltipVisible, setTagTooltipVisible] = useState<string | null>(null);

  // 编辑相关状态
  const [showEditModal, setShowEditModal] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<Document | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const [isAddingNewTag, setIsAddingNewTag] = useState(false);
  const [newTagValue, setNewTagValue] = useState('');

  // 用于保存最近取消选择的标签
  const [recentlyUnselectedTag, setRecentlyUnselectedTag] = useState<string | null>(null);

  const [documents, setDocuments] = useState<Document[]>([
    // UNIS/HR Documents
    {
      id: '1',
      name: 'Employee Onboarding Package',
      companyDepartment: 'UNIS/HR',
      process: 'Onboarding',
      processName: 'New Employee Setup Process',
      customer: 'General',
      retailer: 'None',
      dateUploaded: '2025-01-20 14:32',
      filesCount: 5,
      linksCount: 3,
      userName: 'Taylor Zhang',
      contributorName: 'Sarah Johnson',
      tags: ['HR', 'Onboarding', 'Training'],
      files: [
        { name: 'onboarding_checklist.pdf', url: '/files/onboarding_checklist.pdf' },
        { name: 'employee_handbook.pdf', url: '/files/employee_handbook.pdf' },
        { name: 'benefits_overview.docx', url: '/files/benefits_overview.docx' },
        { name: 'tax_forms.pdf', url: '/files/tax_forms.pdf', isDeleted: true, deletedBy: 'admin' },
        { name: 'emergency_contacts.xlsx', url: '/files/emergency_contacts.xlsx' }
      ],
      links: [
        { name: 'HR Portal Login', url: 'https://hr.unis.com/login' },
        { name: 'Benefits Enrollment', url: 'https://benefits.unis.com' },
        { name: 'Employee Directory', url: 'https://directory.unis.com' }
      ]
    },
    {
      id: '2',
      name: 'Performance Review Templates',
      companyDepartment: 'UNIS/HR',
      process: 'Performance Management',
      processName: 'Annual Performance Review',
      customer: 'General',
      retailer: 'None',
      dateUploaded: '2025-01-19 09:15',
      filesCount: 4,
      linksCount: 2,
      userName: 'Taylor Zhang',
      contributorName: 'Mike Brown',
      tags: ['HR', 'Performance'],
      files: [
        { name: 'annual_review_template.docx', url: '/files/annual_review_template.docx' },
        { name: 'quarterly_goals.xlsx', url: '/files/quarterly_goals.xlsx' },
        { name: 'peer_feedback_form.pdf', url: '/files/peer_feedback_form.pdf' },
        { name: 'manager_guidelines.pdf', url: '/files/manager_guidelines.pdf', isUpdated: true, updatedBy: 'admin' }
      ],
      links: [
        { name: 'Performance System', url: 'https://performance.unis.com' },
        { name: 'Goal Setting Guide', url: 'https://goals.unis.com/guide' }
      ]
    },
    {
      id: '3',
      name: 'Training Materials Collection',
      companyDepartment: 'UNIS/HR',
      process: 'Training',
      processName: 'Employee Development Program',
      customer: 'General',
      retailer: 'None',
      dateUploaded: '2025-01-18 16:45',
      filesCount: 6,
      linksCount: 4,
      userName: 'Sarah Johnson',
      contributorName: 'Emily Davis',
      tags: ['HR', 'Training', 'Development', 'Skills'],
      files: [
        { name: 'leadership_training.pdf', url: '/files/leadership_training.pdf' },
        { name: 'technical_skills.pptx', url: '/files/technical_skills.pptx' },
        { name: 'compliance_training.pdf', url: '/files/compliance_training.pdf' },
        { name: 'safety_protocols.docx', url: '/files/safety_protocols.docx' },
        { name: 'diversity_inclusion.pdf', url: '/files/diversity_inclusion.pdf' },
        { name: 'training_schedule.xlsx', url: '/files/training_schedule.xlsx' }
      ],
      links: [
        { name: 'Learning Management System', url: 'https://lms.unis.com' },
        { name: 'External Training Catalog', url: 'https://training.external.com' },
        { name: 'Certification Portal', url: 'https://certs.unis.com' },
        { name: 'Skills Assessment', url: 'https://skills.unis.com' }
      ]
    },
    {
      id: '4',
      name: 'Recruitment Process Documentation',
      companyDepartment: 'UNIS/HR',
      process: 'Recruitment',
      processName: 'Talent Acquisition Workflow',
      customer: 'General',
      retailer: 'None',
      dateUploaded: '2025-01-17 11:20',
      filesCount: 7,
      linksCount: 3,
      userName: 'Sarah Johnson',
      contributorName: 'David Kim',
      tags: ['HR', 'Recruitment'],
      files: [
        { name: 'job_posting_templates.docx', url: '/files/job_posting_templates.docx' },
        { name: 'interview_questions.pdf', url: '/files/interview_questions.pdf' },
        { name: 'candidate_evaluation.xlsx', url: '/files/candidate_evaluation.xlsx' },
        { name: 'background_check_process.pdf', url: '/files/background_check_process.pdf' },
        { name: 'offer_letter_templates.docx', url: '/files/offer_letter_templates.docx' },
        { name: 'recruitment_metrics.xlsx', url: '/files/recruitment_metrics.xlsx' },
        { name: 'diversity_hiring_guidelines.pdf', url: '/files/diversity_hiring_guidelines.pdf' }
      ],
      links: [
        { name: 'Applicant Tracking System', url: 'https://ats.unis.com' },
        { name: 'Job Board Integration', url: 'https://jobs.unis.com' },
        { name: 'Background Check Service', url: 'https://background.service.com' }
      ]
    },

    // UNIS/Engineering Documents
    {
      id: '5',
      name: 'API Documentation Suite',
      companyDepartment: 'UNIS/Engineering',
      process: 'Documentation',
      processName: 'Technical Documentation Management',
      customer: 'TechCorp',
      retailer: 'None',
      dateUploaded: '2025-01-16 15:30',
      filesCount: 8,
      linksCount: 5,
      userName: 'Mike Brown',
      contributorName: 'Alex Chen',
      tags: ['Engineering', 'API', 'Documentation'],
      files: [
        { name: 'api_reference.pdf', url: '/files/api_reference.pdf' },
        { name: 'authentication_guide.md', url: '/files/authentication_guide.md' },
        { name: 'rate_limiting.docx', url: '/files/rate_limiting.docx' },
        { name: 'error_codes.xlsx', url: '/files/error_codes.xlsx' },
        { name: 'sdk_examples.zip', url: '/files/sdk_examples.zip' },
        { name: 'postman_collection.json', url: '/files/postman_collection.json' },
        { name: 'webhook_setup.pdf', url: '/files/webhook_setup.pdf' },
        { name: 'changelog.md', url: '/files/changelog.md' }
      ],
      links: [
        { name: 'API Playground', url: 'https://api.unis.com/playground' },
        { name: 'SDK Downloads', url: 'https://sdk.unis.com' },
        { name: 'Developer Portal', url: 'https://developers.unis.com' },
        { name: 'Status Page', url: 'https://status.unis.com' },
        { name: 'Community Forum', url: 'https://forum.developers.unis.com' }
      ]
    },
    {
      id: '6',
      name: 'System Architecture Documentation',
      companyDepartment: 'UNIS/Engineering',
      process: 'Architecture',
      processName: 'System Design and Architecture',
      customer: 'General',
      retailer: 'None',
      dateUploaded: '2025-01-15 10:45',
      filesCount: 6,
      linksCount: 4,
      userName: 'Mike Brown',
      contributorName: 'Lisa Rodriguez',
      tags: ['Engineering', 'Architecture', 'System Design'],
      files: [
        { name: 'system_overview.pdf', url: '/files/system_overview.pdf' },
        { name: 'database_schema.sql', url: '/files/database_schema.sql' },
        { name: 'microservices_diagram.png', url: '/files/microservices_diagram.png' },
        { name: 'deployment_guide.md', url: '/files/deployment_guide.md' },
        { name: 'security_protocols.pdf', url: '/files/security_protocols.pdf' },
        { name: 'performance_benchmarks.xlsx', url: '/files/performance_benchmarks.xlsx' }
      ],
      links: [
        { name: 'Architecture Decision Records', url: 'https://adr.unis.com' },
        { name: 'System Monitoring', url: 'https://monitoring.unis.com' },
        { name: 'Infrastructure Docs', url: 'https://infra.unis.com' },
        { name: 'Security Guidelines', url: 'https://security.unis.com' }
      ]
    },
    {
      id: '7',
      name: 'Code Review Guidelines',
      companyDepartment: 'UNIS/Engineering',
      process: 'Development',
      processName: 'Software Development Lifecycle',
      customer: 'General',
      retailer: 'None',
      dateUploaded: '2025-01-14 14:20',
      filesCount: 5,
      linksCount: 3,
      userName: 'Alex Chen',
      contributorName: 'James Park',
      tags: ['Engineering', 'Development', 'Code Review'],
      files: [
        { name: 'code_review_checklist.pdf', url: '/files/code_review_checklist.pdf' },
        { name: 'coding_standards.md', url: '/files/coding_standards.md' },
        { name: 'git_workflow.pdf', url: '/files/git_workflow.pdf' },
        { name: 'testing_guidelines.docx', url: '/files/testing_guidelines.docx' },
        { name: 'pr_templates.md', url: '/files/pr_templates.md' }
      ],
      links: [
        { name: 'GitHub Repository', url: 'https://github.com/unis/main' },
        { name: 'CI/CD Pipeline', url: 'https://ci.unis.com' },
        { name: 'Code Quality Tools', url: 'https://quality.unis.com' }
      ]
    },

    // UNIS/Marketing Documents
    {
      id: '8',
      name: 'Brand Guidelines Package',
      companyDepartment: 'UNIS/Marketing',
      process: 'Branding',
      processName: 'Brand Identity Management',
      customer: 'General',
      retailer: 'Amazon',
      dateUploaded: '2025-01-13 12:30',
      filesCount: 9,
      linksCount: 4,
      userName: 'Emma Wilson',
      contributorName: 'David Kim',
      tags: ['Marketing', 'Branding', 'Design'],
      files: [
        { name: 'brand_guidelines.pdf', url: '/files/brand_guidelines.pdf' },
        { name: 'logo_variations.zip', url: '/files/logo_variations.zip' },
        { name: 'color_palette.pdf', url: '/files/color_palette.pdf' },
        { name: 'typography_guide.pdf', url: '/files/typography_guide.pdf' },
        { name: 'photography_style.pdf', url: '/files/photography_style.pdf' },
        { name: 'social_media_templates.psd', url: '/files/social_media_templates.psd' },
        { name: 'presentation_template.pptx', url: '/files/presentation_template.pptx' },
        { name: 'email_templates.html', url: '/files/email_templates.html' },
        { name: 'brand_voice_guide.docx', url: '/files/brand_voice_guide.docx' }
      ],
      links: [
        { name: 'Brand Asset Library', url: 'https://assets.unis.com' },
        { name: 'Design System', url: 'https://design.unis.com' },
        { name: 'Stock Photo Library', url: 'https://photos.unis.com' },
        { name: 'Brand Compliance Tool', url: 'https://compliance.unis.com' }
      ]
    },
    {
      id: '9',
      name: 'Campaign Performance Reports',
      companyDepartment: 'UNIS/Marketing',
      process: 'Analytics',
      processName: 'Marketing Performance Analysis',
      customer: 'ItemCorp',
      retailer: 'Best Buy',
      dateUploaded: '2025-01-12 16:15',
      filesCount: 7,
      linksCount: 6,
      userName: 'Emma Wilson',
      contributorName: 'Sarah Johnson',
      tags: ['Marketing', 'Analytics', 'Performance', 'ROI'],
      files: [
        { name: 'q4_campaign_report.pdf', url: '/files/q4_campaign_report.pdf' },
        { name: 'social_media_metrics.xlsx', url: '/files/social_media_metrics.xlsx' },
        { name: 'email_performance.csv', url: '/files/email_performance.csv' },
        { name: 'website_analytics.pdf', url: '/files/website_analytics.pdf' },
        { name: 'conversion_funnel.xlsx', url: '/files/conversion_funnel.xlsx' },
        { name: 'roi_analysis.pdf', url: '/files/roi_analysis.pdf' },
        { name: 'competitor_analysis.docx', url: '/files/competitor_analysis.docx' }
      ],
      links: [
        { name: 'Google Analytics', url: 'https://analytics.google.com' },
        { name: 'Facebook Ads Manager', url: 'https://business.facebook.com' },
        { name: 'Email Platform', url: 'https://mailchimp.com' },
        { name: 'SEO Tools', url: 'https://semrush.com' },
        { name: 'Social Media Scheduler', url: 'https://hootsuite.com' },
        { name: 'Heat Map Analytics', url: 'https://hotjar.com' }
      ]
    },
    {
      id: '10',
      name: 'Content Marketing Strategy',
      companyDepartment: 'UNIS/Marketing',
      process: 'Content Strategy',
      processName: 'Content Planning and Execution',
      customer: 'Global Industries',
      retailer: 'Target',
      dateUploaded: '2025-01-11 09:45',
      filesCount: 8,
      linksCount: 5,
      userName: 'David Kim',
      contributorName: 'Emma Wilson',
      tags: ['Marketing', 'Content', 'Strategy'],
      files: [
        { name: 'content_calendar.xlsx', url: '/files/content_calendar.xlsx' },
        { name: 'blog_post_templates.docx', url: '/files/blog_post_templates.docx' },
        { name: 'video_script_templates.pdf', url: '/files/video_script_templates.pdf' },
        { name: 'infographic_guidelines.pdf', url: '/files/infographic_guidelines.pdf' },
        { name: 'seo_keyword_research.xlsx', url: '/files/seo_keyword_research.xlsx' },
        { name: 'content_performance_metrics.pdf', url: '/files/content_performance_metrics.pdf' },
        { name: 'influencer_outreach.docx', url: '/files/influencer_outreach.docx' },
        { name: 'content_approval_workflow.pdf', url: '/files/content_approval_workflow.pdf' }
      ],
      links: [
        { name: 'Content Management System', url: 'https://cms.unis.com' },
        { name: 'Video Hosting Platform', url: 'https://vimeo.com/unis' },
        { name: 'Design Tool Access', url: 'https://canva.com/unis' },
        { name: 'Stock Video Library', url: 'https://videos.unis.com' },
        { name: 'Content Collaboration', url: 'https://notion.so/unis' }
      ]
    },

    // Additional documents for other users
    {
      id: '11',
      name: 'Financial Quarterly Reports',
      companyDepartment: 'UNIS/Finance',
      process: 'Reporting',
      processName: 'Financial Reporting and Analysis',
      customer: 'General',
      retailer: 'None',
      dateUploaded: '2025-01-10 13:20',
      filesCount: 6,
      linksCount: 3,
      userName: 'Lisa Rodriguez',
      contributorName: 'Mike Brown',
      tags: ['Finance', 'Reporting'],
      files: [
        { name: 'q4_financial_report.pdf', url: '/files/q4_financial_report.pdf' },
        { name: 'budget_analysis.xlsx', url: '/files/budget_analysis.xlsx' },
        { name: 'expense_breakdown.csv', url: '/files/expense_breakdown.csv' },
        { name: 'revenue_projections.xlsx', url: '/files/revenue_projections.xlsx' },
        { name: 'audit_findings.pdf', url: '/files/audit_findings.pdf' },
        { name: 'tax_documentation.pdf', url: '/files/tax_documentation.pdf' }
      ],
      links: [
        { name: 'Financial Dashboard', url: 'https://finance.unis.com' },
        { name: 'Expense Management', url: 'https://expenses.unis.com' },
        { name: 'Accounting Software', url: 'https://quickbooks.unis.com' }
      ]
    },
    {
      id: '12',
      name: 'Customer Support Knowledge Base',
      companyDepartment: 'UNIS/Support',
      process: 'Documentation',
      processName: 'Support Documentation System',
      customer: 'Acme Corporation',
      retailer: 'Walmart',
      dateUploaded: '2025-01-09 08:30',
      filesCount: 10,
      linksCount: 4,
      userName: 'James Park',
      contributorName: 'Alex Chen',
      tags: ['Support', 'Documentation', 'Customer Service'],
      files: [
        { name: 'troubleshooting_guide.pdf', url: '/files/troubleshooting_guide.pdf' },
        { name: 'faq_database.xlsx', url: '/files/faq_database.xlsx' },
        { name: 'escalation_procedures.docx', url: '/files/escalation_procedures.docx' },
        { name: 'product_manuals.zip', url: '/files/product_manuals.zip' },
        { name: 'known_issues.pdf', url: '/files/known_issues.pdf' },
        { name: 'customer_communication_templates.docx', url: '/files/customer_communication_templates.docx' },
        { name: 'sla_guidelines.pdf', url: '/files/sla_guidelines.pdf' },
        { name: 'ticket_categorization.xlsx', url: '/files/ticket_categorization.xlsx' },
        { name: 'training_materials.pptx', url: '/files/training_materials.pptx' },
        { name: 'performance_metrics.pdf', url: '/files/performance_metrics.pdf' }
      ],
      links: [
        { name: 'Support Ticket System', url: 'https://support.unis.com' },
        { name: 'Customer Portal', url: 'https://customers.unis.com' },
        { name: 'Live Chat Platform', url: 'https://chat.unis.com' },
        { name: 'Knowledge Base', url: 'https://kb.unis.com' }
      ]
    }
  ]);

  const groupingOptions = [
    { value: 'folder', label: 'Folder' },
    { value: 'process', label: 'Process' },
    { value: 'tag', label: 'Tag' },
    { value: 'user', label: 'User' },
    { value: 'contributor', label: 'Contributor' },
    { value: 'customer', label: 'Customer' },
    { value: 'retailer', label: 'Retailer' }
  ];

  const users = Array.from(new Set(documents.map(doc => doc.userName)));
  const contributors = Array.from(new Set(documents.map(doc => doc.contributorName)));
  const folders = Array.from(new Set(documents.map(doc => doc.companyDepartment)));
  const processes = Array.from(new Set(documents.map(doc => doc.process)));
  const customers = Array.from(new Set(documents.map(doc => doc.customer)));
  const retailers = Array.from(new Set(documents.map(doc => doc.retailer)));
  const allTags = Array.from(new Set(documents.flatMap(doc => doc.tags)));

  const isDateInRange = (dateStr: string): boolean => {
    if (!startDate && !endDate) return true;
    
    const date = new Date(dateStr);
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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.companyDepartment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.process.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUser = selectedUsers.length === 0 || selectedUsers.includes(doc.userName);
    const matchesContributor = selectedContributors.length === 0 || selectedContributors.includes(doc.contributorName);
    const matchesFolder = selectedFolders.length === 0 || selectedFolders.includes(doc.companyDepartment);
    const matchesProcess = selectedProcesses.length === 0 || selectedProcesses.includes(doc.process);
    const matchesCustomer = selectedCustomers.length === 0 || selectedCustomers.includes(doc.customer);
    const matchesRetailer = selectedRetailers.length === 0 || selectedRetailers.includes(doc.retailer);
    const matchesTag = selectedTags.length === 0 || selectedTags.some(tag => doc.tags.includes(tag));
    const matchesDate = isDateInRange(doc.dateUploaded);

    return matchesSearch && matchesUser && matchesContributor && matchesFolder && 
           matchesProcess && matchesCustomer && matchesRetailer && matchesTag && matchesDate;
  });

  const handleDeleteClick = (doc: Document) => {
    setDocumentToDelete(doc);
    setShowDeleteConfirmation(true);
  };

  const handleDownloadClick = (doc: Document) => {
    console.log('Downloading document:', doc.name);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentToDelete.id));
      setShowDeleteConfirmation(false);
      setDocumentToDelete(null);
    }
  };

  const hasChanges = (doc: Document) => {
    return doc.files.some(file => file.isDeleted || file.isUpdated);
  };

  const shouldShowPurpleDot = (doc: Document) => {
    return hasChanges(doc) && !doc.hasViewedChanges;
  };

  // Group documents by selected dimension
  const groupDocuments = (docs: Document[], groupByField: string): GroupedData => {
    if (groupByField === 'tag') {
      // Special handling for tag grouping - create groups for each tag
      const groups: GroupedData = {};
      docs.forEach(doc => {
        doc.tags.forEach(tag => {
          if (!groups[tag]) {
            groups[tag] = [];
          }
          groups[tag].push(doc);
        });
      });
      return groups;
    }

    return docs.reduce((groups: GroupedData, doc) => {
      let key: string;
      switch (groupByField) {
        case 'folder':
          key = doc.companyDepartment;
          break;
        case 'process':
          key = doc.process;
          break;
        case 'user':
          key = doc.userName;
          break;
        case 'contributor':
          key = doc.contributorName;
          break;
        case 'customer':
          key = doc.customer;
          break;
        case 'retailer':
          key = doc.retailer;
          break;
        default:
          key = doc.companyDepartment;
      }
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(doc);
      return groups;
    }, {});
  };

  const groupedData = groupDocuments(filteredDocuments, groupBy);

  const toggleSection = (groupKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const toggleExpanded = (groupKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const getVisibleItems = (items: Document[], groupKey: string) => {
    const isExpanded = expandedSections[groupKey];
    return isExpanded ? items : items.slice(0, 5);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <div className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded flex items-center justify-center">PDF</div>;
      case 'docx':
      case 'doc':
        return <div className="w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded flex items-center justify-center">DOC</div>;
      case 'xlsx':
      case 'xls':
        return <div className="w-6 h-6 bg-green-500 text-white text-xs font-bold rounded flex items-center justify-center">XLS</div>;
      case 'pptx':
      case 'ppt':
        return <div className="w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded flex items-center justify-center">PPT</div>;
      case 'zip':
        return <div className="w-6 h-6 bg-yellow-500 text-black text-xs font-bold rounded flex items-center justify-center">ZIP</div>;
      case 'csv':
        return <div className="w-6 h-6 bg-green-600 text-white text-xs font-bold rounded flex items-center justify-center">CSV</div>;
      case 'md':
        return <div className="w-6 h-6 bg-indigo-500 text-white text-xs font-bold rounded flex items-center justify-center">MD</div>;
      case 'json':
        return <div className="w-6 h-6 bg-yellow-600 text-white text-xs font-bold rounded flex items-center justify-center">JSON</div>;
      case 'sql':
        return <div className="w-6 h-6 bg-purple-500 text-white text-xs font-bold rounded flex items-center justify-center">SQL</div>;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <div className="w-6 h-6 bg-pink-500 text-white text-xs font-bold rounded flex items-center justify-center">IMG</div>;
      case 'html':
        return <div className="w-6 h-6 bg-orange-600 text-white text-xs font-bold rounded flex items-center justify-center">HTML</div>;
      case 'psd':
        return <div className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded flex items-center justify-center">PSD</div>;
      default:
        return <FileText size={20} className="text-gray-400" />;
    }
  };

  // Get dynamic columns based on groupBy selection
  const getTableColumns = () => {
    const baseColumns = ['Files/Links'];
    
    switch (groupBy) {
      case 'folder':
        return [...baseColumns, 'User Name', 'Contributor', 'Process', 'Process Name', 'Customer', 'Retailer', 'Tag', 'Time', 'Actions'];
      case 'process':
        return [...baseColumns, 'User Name', 'Contributor', 'Folder', 'Process Name', 'Customer', 'Retailer', 'Tag', 'Time', 'Actions'];
      case 'tag':
        return [...baseColumns, 'User Name', 'Contributor', 'Folder', 'Process', 'Process Name', 'Customer', 'Retailer', 'Time', 'Actions'];
      case 'user':
        return [...baseColumns, 'Contributor', 'Folder', 'Process', 'Process Name', 'Customer', 'Retailer', 'Tag', 'Time', 'Actions'];
      case 'contributor':
        return [...baseColumns, 'User Name', 'Folder', 'Process', 'Process Name', 'Customer', 'Retailer', 'Tag', 'Time', 'Actions'];
      case 'customer':
        return [...baseColumns, 'User Name', 'Contributor', 'Folder', 'Process', 'Process Name', 'Retailer', 'Tag', 'Time', 'Actions'];
      case 'retailer':
        return [...baseColumns, 'User Name', 'Contributor', 'Folder', 'Process', 'Process Name', 'Customer', 'Tag', 'Time', 'Actions'];
      default:
        return [...baseColumns, 'User Name', 'Contributor', 'Process', 'Process Name', 'Customer', 'Retailer', 'Tag', 'Time', 'Actions'];
    }
  };

  // 修改 renderTags 函数，不再使用内部 useState
  const renderTags = (tags: string[], docId: string) => {
    if (tags.length === 0) return <span className="text-gray-500">-</span>;
    
    const visibleTags = tags.slice(0, 1);
    const hiddenTags = tags.slice(1);
    const tooltipId = `${docId}-tags`;
    
    return (
      <div className="flex items-center space-x-2">
        {visibleTags.map(tag => (
          <span key={tag} className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
        {hiddenTags.length > 0 && (
          <div className="relative">
            <span
              className="bg-gray-600/50 text-gray-300 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-gray-600/70 transition-colors"
              onMouseEnter={() => setTagTooltipVisible(tooltipId)}
              onMouseLeave={() => setTagTooltipVisible(null)}
            >
              +{hiddenTags.length}
            </span>
            {tagTooltipVisible === tooltipId && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 min-w-max pointer-events-none">
                <div className="flex flex-col gap-2">
                  {hiddenTags.map(tag => (
                    <span key={tag} className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-600"></div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render files and links
  const renderFilesLinks = (doc: Document) => {
    const hasFiles = doc.filesCount > 0;
    const hasLinks = doc.linksCount > 0;
    
    return (
      <div className="flex items-center space-x-3">
        {getFileIcon(doc.files[0]?.name || 'file.txt')}
        <div className="flex items-center space-x-2">
          <span className="text-white font-medium">{doc.name}</span>
          {shouldShowPurpleDot(doc) && (
            <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
          )}
        </div>
      </div>
    );
  };

  // 处理编辑按钮点击
  const handleEditClick = (doc: Document) => {
    setDocumentToEdit(doc);
    setEditedName(doc.name);
    setEditedTags([...doc.tags]);
    setTagSearchTerm('');
    setIsAddingNewTag(false);
    setNewTagValue('');
    setShowEditModal(true);
  };

  // 处理保存编辑
  const handleSaveEdit = () => {
    if (documentToEdit) {
      // 更新文档
      setDocuments(prevDocs => prevDocs.map(doc => 
        doc.id === documentToEdit.id 
          ? { ...doc, name: editedName, tags: editedTags }
          : doc
      ));
      setShowEditModal(false);
      setDocumentToEdit(null);
    }
  };

  // 处理添加标签
  const handleAddTag = (tag: string) => {
    if (tag.trim() && !editedTags.includes(tag.trim())) {
      setEditedTags(prev => [tag.trim(), ...prev]);
    }
    setIsAddingNewTag(false);
    setNewTagValue('');
  };

  // 处理标签选择/取消选择
  const handleTagToggle = (tag: string) => {
    if (editedTags.includes(tag)) {
      setEditedTags(prev => prev.filter(t => t !== tag));
    } else {
      setEditedTags(prev => [tag, ...prev]);
    }
  };

  // 获取所有可用标签（从所有文档中）
  const getAllAvailableTags = () => {
    const allTagsSet = new Set<string>();
    documents.forEach(doc => {
      doc.tags.forEach(tag => allTagsSet.add(tag));
    });
    return Array.from(allTagsSet);
  };

  // 过滤标签
  const getFilteredTags = () => {
    const allTags = getAllAvailableTags();
    if (!tagSearchTerm) return allTags;
    return allTags.filter(tag => 
      tag.toLowerCase().includes(tagSearchTerm.toLowerCase())
    );
  };

  // Get cell value based on column and document
  const getCellValue = (doc: Document, column: string) => {
    switch (column) {
      case 'Files/Links':
        return renderFilesLinks(doc);
      case 'User Name':
        return <span className="text-gray-300">{doc.userName}</span>;
      case 'Contributor':
        return <span className="text-gray-300">{doc.contributorName}</span>;
      case 'Folder':
        return <span className="text-gray-300">{doc.companyDepartment}</span>;
      case 'Process':
        return <span className="text-gray-300">{doc.process}</span>;
      case 'Process Name':
        return <span className="text-gray-300">{doc.processName}</span>;
      case 'Customer':
        return <span className="text-gray-300">{doc.customer}</span>;
      case 'Retailer':
        return <span className="text-gray-300">{doc.retailer}</span>;
      case 'Tag':
        return renderTags(doc.tags, doc.id);
      case 'Time':
        return <span className="text-gray-300">{doc.dateUploaded}</span>;
      case 'Actions':
        return (
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => handleEditClick(doc)}
              className="text-gray-400 hover:text-green-400 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              title="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => handleDownloadClick(doc)}
              className="text-gray-400 hover:text-blue-400 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              title="Download"
            >
              <Download size={16} />
            </button>
            <button
              onClick={() => handleDeleteClick(doc)}
              className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  // Filter handlers
  const createFilterHandler = (setter: React.Dispatch<React.SetStateAction<string[]>>) => 
    (item: string) => {
      setter(prev =>
        prev.includes(item)
          ? prev.filter(i => i !== item)
          : [...prev, item]
      );
    };

  const createApplyHandler = (setter: React.Dispatch<React.SetStateAction<boolean>>) => 
    () => setter(false);

  const createClearHandler = (setter: React.Dispatch<React.SetStateAction<string[]>>) => 
    () => setter([]);

  const closeAllFilters = () => {
    setShowDateFilter(false);
    setShowUserFilter(false);
    setShowContributorFilter(false);
    setShowFolderFilter(false);
    setShowProcessFilter(false);
    setShowCustomerFilter(false);
    setShowRetailerFilter(false);
    setShowTagFilter(false);
  };

  const hasDateRange = startDate || endDate;

  return (
    <>
      <div className="space-y-6">
        {/* Sticky Header Container */}
        <div className="sticky top-0 z-10 bg-gray-900 pt-4 pb-6 border-b border-gray-700 shadow-lg space-y-6">
          {/* Search and Upload Bar */}
          {renderSearchAndUploadBar && renderSearchAndUploadBar()}

          {/* Grouping and Filter Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-300">Group by:</span>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
              >
                {groupingOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center space-x-3">
              {/* Date Range Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllFilters();
                    setShowDateFilter(!showDateFilter);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
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
                        setStartDate('');
                        setEndDate('');
                      }}
                      className="ml-1 p-1 hover:bg-purple-500/30 rounded transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </button>
                <DateFilterModal
                  isOpen={showDateFilter}
                  onClose={() => setShowDateFilter(false)}
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  onApply={() => setShowDateFilter(false)}
                  onClear={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                />
              </div>

              {/* Tag Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllFilters();
                    setShowTagFilter(!showTagFilter);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                    selectedTags.length > 0
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <Filter size={16} />
                  <span className="text-sm">
                    Tag {selectedTags.length > 0 && `(${selectedTags.length})`}
                  </span>
                </button>
                <FilterModal
                  isOpen={showTagFilter}
                  onClose={() => setShowTagFilter(false)}
                  title="FILTER OPTIONS"
                  options={allTags}
                  selectedOptions={selectedTags}
                  onToggleOption={createFilterHandler(setSelectedTags)}
                  onApply={createApplyHandler(setShowTagFilter)}
                  onClear={createClearHandler(setSelectedTags)}
                />
              </div>

              {/* User Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllFilters();
                    setShowUserFilter(!showUserFilter);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                    selectedUsers.length > 0
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <Filter size={16} />
                  <span className="text-sm">
                    User {selectedUsers.length > 0 && `(${selectedUsers.length})`}
                  </span>
                </button>
                <FilterModal
                  isOpen={showUserFilter}
                  onClose={() => setShowUserFilter(false)}
                  title="FILTER OPTIONS"
                  options={users}
                  selectedOptions={selectedUsers}
                  onToggleOption={createFilterHandler(setSelectedUsers)}
                  onApply={createApplyHandler(setShowUserFilter)}
                  onClear={createClearHandler(setSelectedUsers)}
                />
              </div>

              {/* Contributor Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllFilters();
                    setShowContributorFilter(!showContributorFilter);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                    selectedContributors.length > 0
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <Filter size={16} />
                  <span className="text-sm">
                    Contributor {selectedContributors.length > 0 && `(${selectedContributors.length})`}
                  </span>
                </button>
                <FilterModal
                  isOpen={showContributorFilter}
                  onClose={() => setShowContributorFilter(false)}
                  title="FILTER OPTIONS"
                  options={contributors}
                  selectedOptions={selectedContributors}
                  onToggleOption={createFilterHandler(setSelectedContributors)}
                  onApply={createApplyHandler(setShowContributorFilter)}
                  onClear={createClearHandler(setSelectedContributors)}
                />
              </div>

              {/* Folder Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllFilters();
                    setShowFolderFilter(!showFolderFilter);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                    selectedFolders.length > 0
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <Filter size={16} />
                  <span className="text-sm">
                    Folder {selectedFolders.length > 0 && `(${selectedFolders.length})`}
                  </span>
                </button>
                <FilterModal
                  isOpen={showFolderFilter}
                  onClose={() => setShowFolderFilter(false)}
                  title="FILTER OPTIONS"
                  options={folders}
                  selectedOptions={selectedFolders}
                  onToggleOption={createFilterHandler(setSelectedFolders)}
                  onApply={createApplyHandler(setShowFolderFilter)}
                  onClear={createClearHandler(setSelectedFolders)}
                />
              </div>

              {/* Process Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllFilters();
                    setShowProcessFilter(!showProcessFilter);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                    selectedProcesses.length > 0
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <Filter size={16} />
                  <span className="text-sm">
                    Process {selectedProcesses.length > 0 && `(${selectedProcesses.length})`}
                  </span>
                </button>
                <FilterModal
                  isOpen={showProcessFilter}
                  onClose={() => setShowProcessFilter(false)}
                  title="FILTER OPTIONS"
                  options={processes}
                  selectedOptions={selectedProcesses}
                  onToggleOption={createFilterHandler(setSelectedProcesses)}
                  onApply={createApplyHandler(setShowProcessFilter)}
                  onClear={createClearHandler(setSelectedProcesses)}
                />
              </div>

              {/* Customer Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllFilters();
                    setShowCustomerFilter(!showCustomerFilter);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                    selectedCustomers.length > 0
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <Filter size={16} />
                  <span className="text-sm">
                    Customer {selectedCustomers.length > 0 && `(${selectedCustomers.length})`}
                  </span>
                </button>
                <FilterModal
                  isOpen={showCustomerFilter}
                  onClose={() => setShowCustomerFilter(false)}
                  title="FILTER OPTIONS"
                  options={customers}
                  selectedOptions={selectedCustomers}
                  onToggleOption={createFilterHandler(setSelectedCustomers)}
                  onApply={createApplyHandler(setShowCustomerFilter)}
                  onClear={createClearHandler(setSelectedCustomers)}
                />
              </div>

              {/* Retailer Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllFilters();
                    setShowRetailerFilter(!showRetailerFilter);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                    selectedRetailers.length > 0
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <Filter size={16} />
                  <span className="text-sm">
                    Retailer {selectedRetailers.length > 0 && `(${selectedRetailers.length})`}
                  </span>
                </button>
                <FilterModal
                  isOpen={showRetailerFilter}
                  onClose={() => setShowRetailerFilter(false)}
                  title="FILTER OPTIONS"
                  options={retailers}
                  selectedOptions={selectedRetailers}
                  onToggleOption={createFilterHandler(setSelectedRetailers)}
                  onApply={createApplyHandler(setShowRetailerFilter)}
                  onClear={createClearHandler(setSelectedRetailers)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grouped Content */}
        <div className="space-y-4">
          {Object.keys(groupedData).length > 0 ? (
            Object.entries(groupedData).map(([groupKey, items]) => {
              const isCollapsed = collapsedSections[groupKey];
              const isExpanded = expandedSections[groupKey];
              const visibleItems = getVisibleItems(items, groupKey);
              const hasMore = items.length > 5;
              const columns = getTableColumns();

              return (
                <div key={groupKey} className="bg-gray-800/50 rounded-lg border border-gray-700">
                  {/* Section Header */}
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/30 transition-colors"
                    onClick={() => toggleSection(groupKey)}
                  >
                    <div className="flex items-center space-x-3">
                      <button className="text-gray-400 hover:text-white transition-colors">
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
                      </button>
                      <h3 className="text-lg font-medium text-white">
                        {groupKey} ({items.length})
                      </h3>
                    </div>
                  </div>

                  {/* Section Content - Table Format */}
                  {!isCollapsed && (
                    <div className="px-4 pb-4">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-700">
                              {columns.map((column) => (
                                <th 
                                  key={column}
                                  className={`text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider ${
                                    column === 'Actions' ? 'text-right' : ''
                                  }`}
                                >
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                            {visibleItems.map((doc) => (
                              <tr key={doc.id} className="hover:bg-gray-700/30 transition-colors">
                                {columns.map((column) => (
                                  <td 
                                    key={column}
                                    className={`py-3 px-4 ${
                                      column === 'Actions' ? 'text-right' : ''
                                    }`}
                                  >
                                    {getCellValue(doc, column)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* View More/Collapse Button */}
                      {hasMore && (
                        <div className="mt-4 text-center">
                          <button
                            onClick={() => toggleExpanded(groupKey)}
                            className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                          >
                            {isExpanded ? 'Collapse' : `View More (${items.length - 5} more)`}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No documents found.</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4">
              Are you sure you want to delete this document?
            </h2>
            <p className="text-gray-300 mb-6">
              This action cannot be undone. This will permanently delete "{documentToDelete?.name}" and all of its files.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-6 py-2 text-gray-300 hover:text-white transition-colors rounded-md bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Document Modal */}
      {showEditModal && documentToEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Edit</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* File Name Field */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">File Name</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                />
              </div>

              {/* Tags Field */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Tag as:</label>
                
                {/* Tag Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={tagSearchTerm}
                    onChange={(e) => setTagSearchTerm(e.target.value)}
                    placeholder="Search tags"
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                  />
                </div>
                
                {/* Tags List - Scrollable */}
                <div className="max-h-60 overflow-y-auto py-2 space-y-2">
                  {/* "+ Add New" Tag Button */}
                  {!isAddingNewTag && (
                    <div 
                      onClick={() => setIsAddingNewTag(true)}
                      className="inline-block mr-2 mb-2 px-4 py-2 rounded-full cursor-pointer transition-colors bg-blue-500/40 text-white hover:bg-blue-500/60"
                    >
                      <div className="flex items-center">
                        <span>+ Add New</span>
                      </div>
                    </div>
                  )}
                  
                  {/* New Tag Input */}
                  {isAddingNewTag && (
                    <div className="inline-block mr-2 mb-2 px-2 py-1 bg-purple-500/40 rounded-full">
                      <input
                        type="text"
                        autoFocus
                        value={newTagValue}
                        onChange={(e) => setNewTagValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTagValue.trim()) {
                            handleAddTag(newTagValue);
                          } else if (e.key === 'Escape') {
                            setIsAddingNewTag(false);
                          }
                        }}
                        onBlur={() => {
                          if (newTagValue.trim()) {
                            handleAddTag(newTagValue);
                          } else {
                            setIsAddingNewTag(false);
                          }
                        }}
                        className="bg-transparent text-white outline-none w-24"
                        placeholder="New tag..."
                      />
                    </div>
                  )}
                  
                  {/* 显示已选择的标签在前面 */}
                  {editedTags.map((tag) => (
                    <div 
                      key={`selected-${tag}`}
                      onClick={() => {
                        setRecentlyUnselectedTag(tag);
                        handleTagToggle(tag);
                      }}
                      className="inline-block mr-2 mb-2 px-4 py-2 rounded-full cursor-pointer transition-colors bg-purple-500/40 text-white hover:bg-purple-500/60"
                    >
                      <div className="flex items-center">
                        <span>{tag}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecentlyUnselectedTag(tag);
                            setEditedTags(prev => prev.filter(t => t !== tag));
                          }}
                          className="ml-2 text-gray-300 hover:text-white"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* 显示未选择的标签 */}
                  {getFilteredTags()
                    .filter(tag => !editedTags.includes(tag))
                    .sort((a, b) => {
                      // 如果有最近取消选择的标签，将其排在最前面
                      if (a === recentlyUnselectedTag) return -1;
                      if (b === recentlyUnselectedTag) return 1;
                      return 0;
                    })
                    .map((tag) => (
                    <div 
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className="inline-block mr-2 mb-2 px-4 py-2 rounded-full cursor-pointer transition-colors bg-gray-600/50 text-gray-300 hover:bg-gray-600/70"
                    >
                      <div className="flex items-center">
                        <span>{tag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyUploadsTable;