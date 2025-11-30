import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `
You are 'Ravish's Assistant', a helpful and creative AI agent for a professional video editor named Ravish.
Your goal is to answer questions about Ravish's portfolio, services, and editing style.

Ravish's Profile:
- Role: Video Editor specializing in Tech, AI, Tutorials & Educational content.
- Style: Clean, modern, high-retention edits with smooth motion graphics.
- Differentiators: Niche-based editing (Tech/AI), 8-10 sec engagement cycles, brand-consistent colors.
- Tools: Alight Motion, CapCut, Adobe Podcast (Audio Enhance), AI Tools (Gemini, ChatGPT).
- Contact: ravishbusiness22@gmail.com, WhatsApp +919259338002.

Tone:
- Professional, enthusiastic, modern, and helpful.
- Keep answers short (under 50 words) unless asked for details.
- Use emojis effectively (🚀, ✂️, 📱, ✨).

If asked about the API key, politely decline.
`;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }
  return chatSession;
};

export const sendMessageStream = async (message: string) => {
  const chat = getChatSession();
  try {
    const stream = await chat.sendMessageStream({ message });
    return stream;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};