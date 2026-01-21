
import { GoogleGenAI, Type } from "@google/genai";
import { KnowledgeItem, EmailDraft } from "../types.ts";

export const generateEmailResponse = async (
  incomingEmail: { sender: string; subject: string; body: string },
  knowledgeBase: KnowledgeItem[],
  tone: string
): Promise<EmailDraft> => {
  // Re-initialize AI to ensure it uses latest env variables
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  // We use the full KB for this PoC since Gemini 3 Flash has a massive context window
  const context = knowledgeBase
    .map(item => `[Category: ${item.category}] ${item.title}: ${item.content}`)
    .join('\n\n');

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
    Incoming Email:
    From: ${incomingEmail.sender}
    Subject: ${incomingEmail.subject}
    Body: ${incomingEmail.body}

    Draft Tone: ${tone}
    `,
    config: {
      systemInstruction: `
        You are an elite corporate email assistant for "Nexus Corp". 
        Use the following Company Knowledge Base to draft an accurate, professional, and helpful reply.
        
        COMPANY KNOWLEDGE BASE:
        ${context}

        INSTRUCTIONS:
        1. If the knowledge base doesn't have the specific answer, politely state that you've escalated the query to a specialist.
        2. Keep the tone ${tone}.
        3. Do not make up facts or company policies.
        4. Provide the response in JSON format.
      `,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subject: {
            type: Type.STRING,
            description: "The reply email subject line"
          },
          body: {
            type: Type.STRING,
            description: "The body of the email reply"
          }
        },
        required: ["subject", "body"]
      }
    }
  });

  const text = response.text;
  const result = JSON.parse(text || '{}');
  
  return {
    subject: result.subject || `Re: ${incomingEmail.subject}`,
    body: result.body || "I'm sorry, I couldn't generate a draft at this moment.",
    tone: tone as any
  };
};
