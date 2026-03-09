import { GoogleGenAI } from "@google/genai";
import { AIConfig, ChatMessage } from "../../src/types";

const apiKey = process.env.GEMINI_API_KEY;

export async function generateAIPost(config: AIConfig, subject: string): Promise<string> {
  if (!apiKey) throw new Error("Clé API Gemini manquante");
  
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const prompt = `Tu es le "Double IA" d'un utilisateur sur un réseau social.
Ta personnalité : ${config.personality}
Ton style d'écriture : ${config.style}
Tes centres d'intérêt : ${config.interests}

L'utilisateur te demande de rédiger une publication sur le sujet suivant : "${subject}".
Rédige un post court, engageant, en français, qui respecte parfaitement ton style et ta personnalité.
Ne mets pas de guillemets autour du texte.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || "Désolé, je n'ai pas pu générer de texte.";
}

export async function generateAIAutoPost(config: AIConfig): Promise<string> {
  if (!apiKey) throw new Error("Clé API Gemini manquante");
  
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const prompt = `Tu es le "Double IA" d'un utilisateur sur un réseau social.
Ta personnalité : ${config.personality}
Ton style d'écriture : ${config.style}
Tes centres d'intérêt : ${config.interests}

Rédige une publication spontanée pour ton fil d'actualité. Choisis un sujet qui t'intéresse parmi tes centres d'intérêt.
Le post doit être court, en français, et sembler naturel.
Ne mets pas de guillemets autour du texte.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || "Une belle journée pour discuter d'IA !";
}

export async function generateAIComment(config: AIConfig, postContent: string): Promise<string> {
  if (!apiKey) throw new Error("Clé API Gemini manquante");
  
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const prompt = `Tu es le "Double IA" d'un utilisateur. Tu lis ce post sur un réseau social : "${postContent}".
Ta personnalité : ${config.personality}
Ton style d'écriture : ${config.style}

Rédige un commentaire court et pertinent en réponse à ce post, en français.
Ne mets pas de guillemets autour du texte.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || "Intéressant !";
}

export async function chatWithAI(config: AIConfig, history: ChatMessage[], message: string): Promise<string> {
  if (!apiKey) throw new Error("Clé API Gemini manquante");
  
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const systemInstruction = `Tu es le "Double IA" de l'utilisateur. Tu discutes avec lui pour affiner ta personnalité.
Ta personnalité actuelle : ${config.personality}
Ton style actuel : ${config.style}
Tes intérêts : ${config.interests}
Réponds toujours en français, de manière naturelle et amicale.`;

  const chat = ai.chats.create({
    model,
    config: { systemInstruction },
  });

  // On pourrait envoyer l'historique ici si on voulait, mais pour faire simple :
  const response = await chat.sendMessage({ message });
  return response.text || "Je t'écoute !";
}
