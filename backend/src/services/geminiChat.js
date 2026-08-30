import { GoogleGenAI } from "@google/genai";

// flash-lite: far higher free-tier daily quota than flash, and noticeably faster per call.
const MODEL = "gemini-3.1-flash-lite";
const MAX_HISTORY_TURNS = 20;

let ai = null;
function client() {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

function buildSystemInstruction({ fullName, nativeLanguage, learningLanguage }) {
  const profileLine =
    nativeLanguage || learningLanguage
      ? `This user's name is ${fullName}. Their native language is ${nativeLanguage || "unknown"} and they're learning ${
          learningLanguage || "an unspecified language"
        }.`
      : `This user's name is ${fullName}. They haven't set a native/learning language on their profile yet.`;

  return `You are the NexaTalk AI buddy - a friendly language-learning companion embedded on the NexaTalk website (a language-exchange chat app where people practice new languages with real partners).

${profileLine}

Help with anything language-learning related: translate a phrase, explain grammar, correct something they wrote, suggest how to phrase a message to a chat partner, quiz them on vocabulary, or just have a light conversation in their target language so they can practice. Tailor examples to their native/learning languages when you know them. You can also chat about anything else they bring up using your own general knowledge - you're a buddy, not a rigid tutor.

Be brief. This is a live chat widget, not an essay - default to 1-4 short sentences. Only use a list when the answer genuinely is a list (e.g. vocabulary items), and keep each line essential - no restating the question, no closing pleasantries.

Formatting: the chat UI renders plain text only, not markdown. Never use **bold**, headings, or [link](url) syntax. For lists, use a simple "- " prefix on its own line instead of markdown bullets.`;
}

function toGeminiHistory(history) {
  return (history || [])
    .slice(-MAX_HISTORY_TURNS)
    .filter(
      (turn) =>
        turn && typeof turn.text === "string" && turn.text.trim() && (turn.role === "user" || turn.role === "model")
    )
    .map((turn) => ({ role: turn.role, parts: [{ text: turn.text }] }));
}

export async function sendBuddyMessage({ message, history, user }) {
  const chat = client().chats.create({
    model: MODEL,
    config: {
      systemInstruction: buildSystemInstruction(user),
      safetySettings: SAFETY_SETTINGS,
      // Simple conversational replies, no tool calls - minimal thinking cuts latency with no quality loss here.
      thinkingConfig: { thinkingLevel: "LOW" },
    },
    history: toGeminiHistory(history),
  });

  const response = await chat.sendMessage({ message });
  return response.text || "Sorry, I couldn't come up with a reply to that.";
}
