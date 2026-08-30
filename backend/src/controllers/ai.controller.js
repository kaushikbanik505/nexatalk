import { sendBuddyMessage } from "../services/geminiChat.js";

const MAX_MESSAGE_LENGTH = 1000;

export async function chatWithBuddy(req, res) {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "message is required" });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ message: `message must be ${MAX_MESSAGE_LENGTH} characters or fewer` });
    }

    const reply = await sendBuddyMessage({
      message: message.trim(),
      history,
      user: {
        fullName: req.user.fullName,
        nativeLanguage: req.user.nativeLanguage,
        learningLanguage: req.user.learningLanguage,
      },
    });

    res.json({ reply });
  } catch (error) {
    console.log("Error in chatWithBuddy controller:", error);
    res.status(500).json({ message: "AI buddy is unavailable right now" });
  }
}
