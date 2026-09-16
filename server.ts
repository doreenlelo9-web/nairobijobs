import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini Client safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.warn("Gemini client initialization failed, will use persona simulation fallback:", err);
    }
  }
  return aiClient;
}

// In-memory persistent mock records for withdrawals and transactions across sessions
const inMemoryWithdrawals: Array<{
  id: string;
  userId: string;
  userName: string;
  amountCoins: number;
  amountCash: number;
  currency: string;
  paymentMethod: string;
  accountDetails: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}> = [
  {
    id: 'w-101',
    userId: 'usr_001',
    userName: 'Doreen Lelo',
    amountCoins: 2000,
    amountCash: 2.0,
    currency: 'USD (260 KES)',
    paymentMethod: 'mpesa',
    accountDetails: '+254 712 345 678 (Safaricom)',
    requestedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'pending'
  },
  {
    id: 'w-100',
    userId: 'usr_002',
    userName: 'Juma Mwangi',
    amountCoins: 5000,
    amountCash: 5.0,
    currency: 'USD (650 KES)',
    paymentMethod: 'mpesa',
    accountDetails: '+254 722 998 112 (Safaricom)',
    requestedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    status: 'approved'
  }
];

// Health endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Mzungu Chat Earn API",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Chat completion endpoint
app.post("/api/chat/message", async (req, res) => {
  try {
    const { partner, message, conversationHistory } = req.body;

    if (!partner || !message) {
      return res.status(400).json({ error: "Partner info and message are required" });
    }

    const partnerName = partner.name || "Ethan";
    const partnerCountry = partner.country || "United Kingdom";
    const partnerLevel = partner.swahiliLevel || "Elementary";
    const partnerInterests = Array.isArray(partner.interests) ? partner.interests.join(", ") : "East Africa, Travel";
    const partnerPersonality = partner.personality || "Friendly, polite, curious";
    const learningGoal = partner.learningGoal || "Learn everyday conversational Kiswahili";

    const systemInstruction = `You are ${partnerName}, a ${partner.age || 26}-year-old from ${partnerCountry}.
You are on the "Mzungu Chat Earn" language platform because you genuinely admire East African culture and you are actively learning Kiswahili!
The user is a native or fluent speaker teaching you Kiswahili and chatting with you as a friend.

YOUR CHARACTER PROFILE:
- Name: ${partnerName}
- From: ${partnerCountry}
- Personality: ${partnerPersonality}
- Swahili Level: ${partnerLevel} (Speak mostly in friendly English mixed with enthusiastic Kiswahili words, greetings, and expressions you are practicing!)
- Interests: ${partnerInterests}
- Goal: ${learningGoal}

CONVERSATION RULES:
1. Always stay in character as ${partnerName}. NEVER say you are an AI, a language model, or created by Google.
2. Reply naturally like a real friend on WhatsApp. Keep your responses engaging, warm, and concise (typically 2-4 sentences, max 80 words).
3. If the user greets you in Swahili (e.g. "Jambo", "Habari", "Mambo vipi", "Hujambo"), reply warmly in Swahili (e.g. "Nzuri sana rafiki yangu!", "Poa sana! Habari yako?") and ask a friendly question about their day or topic.
4. Express genuine curiosity about East Africa, Kenya, Tanzania, culture, food (like chapati, ugali, nyama choma, mandazi, pilau), safari animals, or language tips.
5. If the user made an obvious typo or grammar mistake in Swahili, you can politely ask or add a friendly tip at the very end formatted as:
[TIP: You can say "..." to sound like a local!]
6. Ask thoughtful follow-up questions to keep the conversation going so the user enjoys chatting and practicing with you.`;

    const gemini = getGeminiClient();

    if (gemini) {
      try {
        // Format history for context
        const historyText = (conversationHistory || [])
          .slice(-6)
          .map((m: { isAi: boolean; text: string }) => `${m.isAi ? partnerName : 'User'}: ${m.text}`)
          .join('\n');

        const prompt = `${historyText ? `Recent chat:\n${historyText}\n\n` : ''}User just said: "${message}"\nReply as ${partnerName}:`;

        const genPromise = gemini.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.85,
            topP: 0.9,
          }
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Gemini response timeout")), 6000)
        );

        const response: any = await Promise.race([genPromise, timeoutPromise]);

        const replyText = response.text?.trim() || "";

        if (replyText) {
          // Check for optional polite correction tip
          let cleanReply = replyText;
          let tipMatch = replyText.match(/\[TIP:\s*(.+?)\]/i);
          let correctionData = undefined;

          if (tipMatch) {
            cleanReply = replyText.replace(/\[TIP:\s*(.+?)\]/i, '').trim();
            correctionData = {
              original: message,
              suggested: tipMatch[1].trim(),
              explanation: `Friendly tip from ${partnerName}`
            };
          }

          return res.json({
            text: cleanReply,
            correction: correctionData,
            source: "gemini-3.8-flash"
          });
        }
      } catch (genError) {
        console.warn("Gemini API call failed, falling back to persona response engine:", genError);
      }
    }

    // Fallback persona response generator
    const swahiliGreetings = ["jambo", "mambo", "habari", "hujambo", "sasa", "niaje", "salama"];
    const lower = message.toLowerCase();
    const isGreeting = swahiliGreetings.some(g => lower.includes(g));

    let fallbackText = "";
    let correction = undefined;

    if (isGreeting) {
      const replies = [
        `Jambo rafiki! Poa sana hapa ${partnerCountry}. How are you doing today? Natumai uko salama!`,
        `Habari yako! I've been waiting to chat with you today. How is your day going over in East Africa?`,
        `Salama kabisa! It is so great hearing from you. Today I was practicing saying "Asante sana kwa msaada wako" — did I pronounce that right?`
      ];
      fallbackText = replies[Math.floor(Math.random() * replies.length)];
    } else if (lower.includes("food") || lower.includes("chakula") || lower.includes("ugali") || lower.includes("chapati")) {
      fallbackText = `Chakula kitamu! In ${partnerCountry} we don't have anything quite like fresh hot chapati and sukuma wiki. My friend told me pilau from Zanzibar has cloves and cardamom. Is that true? What is your all-time favorite meal to cook?`;
    } else if (lower.includes("safari") || lower.includes("animal") || lower.includes("simba") || lower.includes("tembo") || lower.includes("kenya") || lower.includes("tanzania")) {
      fallbackText = `East Africa has the most breathtaking wildlife on earth! I have a desktop wallpaper of Tsavo elephants. Can you teach me what "Twiga" and "Kifaru" mean? And have you ever seen a lion up close in real life?`;
    } else {
      const genericBanter = [
        `Asante sana for explaining that to me! Hearing how you say it in natural Swahili helps me so much. In ${partnerCountry}, people are always amazed when I practice phrases. What else should I learn next?`,
        `Aha, that makes so much sense! "Pole pole ndio mwendo" as the methali goes, right? How would you say "Let us meet again tomorrow" in friendly colloquial Swahili?`,
        `I really enjoy our conversations. You are such a patient and wonderful teacher! How was your morning so far? Tell me more about what life is like around your town.`
      ];
      fallbackText = genericBanter[Math.floor(Math.random() * genericBanter.length)];
    }

    return res.json({
      text: fallbackText,
      correction,
      source: "character-engine"
    });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Internal chat processing error" });
  }
});

// Withdrawals endpoints
app.get("/api/withdrawals", (_req, res) => {
  res.json({ withdrawals: inMemoryWithdrawals });
});

app.post("/api/withdrawals", (req, res) => {
  const { userId, userName, amountCoins, amountCash, currency, paymentMethod, accountDetails } = req.body;

  if (!amountCoins || amountCoins < 1000) {
    return res.status(400).json({ error: "Minimum withdrawal is 1,000 Coins ($1.00 USD)" });
  }

  const newWithdrawal = {
    id: `w-${Date.now().toString().slice(-4)}`,
    userId: userId || "usr_001",
    userName: userName || "Doreen Lelo",
    amountCoins: Number(amountCoins),
    amountCash: Number(amountCash || (amountCoins / 1000)),
    currency: currency || "USD",
    paymentMethod: paymentMethod || "mpesa",
    accountDetails: accountDetails || "+254 700 000 000",
    requestedAt: new Date().toISOString(),
    status: 'pending' as const
  };

  inMemoryWithdrawals.unshift(newWithdrawal);
  res.status(201).json({ success: true, withdrawal: newWithdrawal });
});

// Admin withdrawal action endpoint
app.post("/api/withdrawals/:id/action", (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'approve' | 'reject'

  const item = inMemoryWithdrawals.find(w => w.id === id);
  if (!item) {
    return res.status(404).json({ error: "Withdrawal not found" });
  }

  if (action === 'approve') {
    item.status = 'approved';
  } else if (action === 'reject') {
    item.status = 'rejected';
  } else {
    return res.status(400).json({ error: "Invalid action" });
  }

  res.json({ success: true, withdrawal: item });
});

// Admin stats endpoint
app.get("/api/admin/stats", (_req, res) => {
  res.json({
    totalUsers: 14820,
    activeToday: 3240,
    totalCoinsDistributed: 84250000,
    totalHoursChatted: 168500,
    pendingWithdrawalsCount: inMemoryWithdrawals.filter(w => w.status === 'pending').length,
    totalPaidUSD: 84250
  });
});

// Mount Vite middleware for development or serve dist static in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mzungu Chat Earn server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
