import { KnowledgeBaseData, KnowledgeType } from '../types';
import { BookOpen, FileText, Database, BarChart3, DollarSign, Users, BookMarked, ScrollText } from 'lucide-react';

// Mock customer data
export const customers = [
  'General',
  'Acme Corporation',
  'TechCorp Solutions',
  'Global Industries',
  'Innovative Systems',
  'Digital Dynamics',
  'Future Technologies',
  'Smart Solutions',
  'Enterprise Logic',
  'Tech Innovators',
  'Strategic Systems',
  'Dynamic Solutions',
  'Quantum Computing',
  'Cloud Systems Inc',
  'Data Dynamics'
];

// Mock retailer data
export const retailers = [
  'None',
  'Amazon',
  'Walmart',
  'Best Buy',
  'Target',
  'Costco',
  'Home Depot',
  'Staples',
  'Office Depot',
  'Micro Center',
  'B&H Photo',
  'Newegg',
  'Fry\'s Electronics',
  'GameStop',
  'Apple Store'
];

export const knowledgeBaseData: KnowledgeBaseData = {
  [KnowledgeType.PERSONAL]: [
    {
      id: 'personal-1',
      title: 'Personal Notes',
      description: 'My personal notes and ideas',
      icon: BookOpen.name,
      documentCount: 5
    },
    {
      id: 'personal-2',
      title: 'Learning Resources',
      description: 'Educational materials and tutorials',
      icon: FileText.name,
      documentCount: 8
    },
    {
      id: 'personal-3',
      title: 'Reference Materials',
      description: 'Important reference documents',
      icon: ScrollText.name,
      documentCount: 6
    }
  ],
  [KnowledgeType.ENTERPRISE]: [
    {
      id: 'enterprise-1',
      title: 'Company Handbook',
      description: 'Employee guidelines and company policies',
      icon: BookMarked.name,
      documentCount: 15,
      tags: [
        { id: '1', name: 'UNIS/HR' }
      ]
    },
    {
      id: 'enterprise-2',
      title: 'Product Documentation',
      description: 'Technical specifications and user guides',
      icon: FileText.name,
      documentCount: 24,
      tags: [
        { id: '1', name: 'UNIS/Engineering/Manager' }
      ]
    },
    {
      id: 'enterprise-3',
      title: 'Research Papers',
      description: 'Academic papers and research findings',
      icon: BookOpen.name,
      documentCount: 8,
      tags: [
        { id: '1', name: 'UNIS/Marketing' }
      ]
    },
    {
      id: 'enterprise-4',
      title: 'Marketing Materials',
      description: 'Brand guidelines and marketing resources',
      icon: ScrollText.name,
      documentCount: 12,
      tags: [
        { id: '1', name: 'UNIS/Marketing' },
        { id: '2', name: 'UNIS/Product' },
        { id: '3', name: 'UNIS/Sales' },
        { id: '4', name: 'UNIS/Executive' }
      ]
    },
    {
      id: 'enterprise-5',
      title: 'Financial Reports',
      description: 'Quarterly and annual financial statements',
      icon: DollarSign.name,
      documentCount: 18,
      tags: [
        { id: '1', name: 'UNIS/Finance' }
      ]
    },
    {
      id: 'enterprise-6',
      title: 'Industry Analysis',
      description: 'Market trends and competitive analysis',
      icon: BarChart3.name,
      documentCount: 9,
      tags: [
        { id: '1', name: 'Item-industry-accounting' }
      ]
    },
    {
      id: 'enterprise-7',
      title: 'Customer Database',
      description: 'Customer profiles and interaction history',
      icon: Users.name,
      documentCount: 32,
      tags: [
        { id: '1', name: 'Customer Information' },
        { id: '2', name: 'UNIS/Sales' },
        { id: '3', name: 'UNIS/Marketing' },
        { id: '4', name: 'UNIS/Support' },
        { id: '5', name: 'UNIS/Legal' }
      ]
    }
  ]
};