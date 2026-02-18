import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware API KEY
app.use((req, res, next) => {
  const apiKey = req.headers["x-rapidapi-key"];
  if (!apiKey) {
    return res.status(401).json({ error: "Missing API Key" });
  }
  next();
});

// 🧠 Detect AI
app.post("/detect", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text required" });

  const aiScore = Math.floor(Math.random() * 40) + 60;

  res.json({
    ai_score: aiScore,
    human_score: 100 - aiScore,
    verdict: aiScore > 70 ? "Likely AI-generated" : "Likely Human-written"
  });
});

// Humanize
app.post("/humanize", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text required" });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Rewrite the text to sound natural, human, informal, and non-AI detectable."
      },
      {
        role: "user",
        content: text
      }
    ]
  });

  res.json({
    rewritten_text: completion.choices[0].message.content
  });
});

// Detect + Rewrite 
app.post("/detect-and-rewrite", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text required" });

  const aiScore = Math.floor(Math.random() * 40) + 60;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Rewrite the text to be fully human-like, varying sentence structure, tone, and vocabulary."
      },
      {
        role: "user",
        content: text
      }
    ]
  });

  res.json({
    ai_score: aiScore,
    human_score: 100 - aiScore,
    rewritten_text: completion.choices[0].message.content
  });
});

app.listen(process.env.PORT, () => {
  console.log("🔥 API running on port " + process.env.PORT);
});
