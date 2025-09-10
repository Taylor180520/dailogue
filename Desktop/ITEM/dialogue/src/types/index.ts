export enum KnowledgeType {
  PERSONAL = 'personal',
  ENTERPRISE = 'enterprise'
}

export interface KnowledgeBaseCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  documentCount: number;
  tags?: Array<{
    id: string;
    name: string;
  }>;
  isCreating?: boolean;
}

export interface KnowledgeBaseData {
  [KnowledgeType.PERSONAL]: KnowledgeBaseCard[];
  [KnowledgeType.ENTERPRISE]: KnowledgeBaseCard[];
}