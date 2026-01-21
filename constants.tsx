
import { KnowledgeItem, EmailMessage } from './types';

export const INITIAL_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: '1',
    title: 'Refund Policy',
    content: 'Nexus Corp offers a 30-day no-questions-asked refund policy for all digital software subscriptions. Hardware products must be returned in original packaging within 14 days.',
    category: 'policy',
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Technical Support Hours',
    content: 'Our support team is available Monday through Friday, 9:00 AM to 6:00 PM EST. Enterprise clients have 24/7 access through the priority hotline.',
    category: 'support',
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Cloud Storage Limits',
    content: 'Standard plans include 50GB of cloud storage. Professional plans offer 500GB, and Enterprise plans offer unlimited storage subject to fair use policy.',
    category: 'product',
    updatedAt: new Date().toISOString()
  }
];

export const MOCK_EMAILS: EmailMessage[] = [
  {
    id: 'm1',
    sender: 'alex.smith@example.com',
    subject: 'Question about my subscription refund',
    body: "Hi team, I bought the software 2 weeks ago but it doesn't fit my needs. Can I get my money back? Also, what are your support hours?",
    receivedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'm2',
    sender: 'sarah.jones@startup.io',
    subject: 'Enterprise Cloud Upgrade',
    body: 'We are reaching our storage limit on the Pro plan. What are the options for Enterprise and how much storage do we get?',
    receivedAt: new Date(Date.now() - 7200000).toISOString()
  }
];
