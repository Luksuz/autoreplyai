
import React, { useState } from 'react';
import Layout from './components/Layout.tsx';
import InboxSection from './components/InboxSection.tsx';
import KnowledgeSection from './components/KnowledgeSection.tsx';
import { KnowledgeItem, EmailMessage } from './types.ts';
import { INITIAL_KNOWLEDGE, MOCK_EMAILS } from './constants.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'knowledge'>('inbox');
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(INITIAL_KNOWLEDGE);
  const [emails] = useState<EmailMessage[]>(MOCK_EMAILS);

  const handleAddKnowledge = (item: Omit<KnowledgeItem, 'id' | 'updatedAt'>) => {
    const newItem: KnowledgeItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      updatedAt: new Date().toISOString()
    };
    setKnowledge([newItem, ...knowledge]);
  };

  const handleDeleteKnowledge = (id: string) => {
    setKnowledge(knowledge.filter(k => k.id !== id));
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'inbox' ? (
        <InboxSection emails={emails} knowledge={knowledge} />
      ) : (
        <KnowledgeSection 
          items={knowledge} 
          onAdd={handleAddKnowledge} 
          onDelete={handleDeleteKnowledge} 
        />
      )}
    </Layout>
  );
};

export default App;
