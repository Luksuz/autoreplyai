
export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: 'policy' | 'product' | 'support' | 'general';
  updatedAt: string;
}

export interface EmailMessage {
  id: string;
  sender: string;
  subject: string;
  body: string;
  receivedAt: string;
}

export interface EmailDraft {
  subject: string;
  body: string;
  tone: 'professional' | 'friendly' | 'concise';
}

export interface ProcessingState {
  isRetrieving: boolean;
  isDrafting: boolean;
  error: string | null;
}
