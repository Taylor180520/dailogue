import React from 'react';
import KnowledgeBaseCard from './KnowledgeBaseCard';
import { knowledgeBaseData } from '../data/mockData';
import { KnowledgeType, KnowledgeBaseCard as KnowledgeBaseCardType } from '../types';

interface KnowledgeBaseGridProps {
  knowledgeType: KnowledgeType;
  searchQuery: string;
  creatingCards: KnowledgeBaseCardType[];
}

const KnowledgeBaseGrid: React.FC<KnowledgeBaseGridProps> = ({ 
  knowledgeType, 
  searchQuery,
  creatingCards = []
}) => {
  const cards = knowledgeBaseData[knowledgeType];
  
  const filteredCards = cards.filter(card => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      card.title.toLowerCase().includes(searchTerm) ||
      card.description.toLowerCase().includes(searchTerm)
    );
  });

  // Combine creating cards with existing cards
  const allCards = [...creatingCards, ...filteredCards];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {allCards.map(card => (
        <KnowledgeBaseCard 
          key={card.id}
          id={card.id}
          title={card.title}
          description={card.description}
          icon={card.icon}
          documentCount={card.documentCount}
          type={knowledgeType}
          tags={card.tags}
          isCreating={creatingCards.some(c => c.id === card.id)}
        />
      ))}
    </div>
  );
};

export default KnowledgeBaseGrid;