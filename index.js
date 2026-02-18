import express from "express";
import cors from "cors";
import bodyParser from "body-parser";


const app = express();

app.use(cors());
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.json({ status: "API is running 🚀" });
});


app.post("/detect", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "text required" });

  const aiScore = Math.floor(Math.random() * 100);
  const humanScore = 100 - aiScore;
  const verdict = aiScore > 50 ? "Likely AI-generated" : "Likely human-written";

  res.json({ ai_score: aiScore, human_score: humanScore, verdict });
});


app.post("/humanize", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "text required" });

  const humanizedText = text + " (humanized)";
  res.json({ original: text, humanized: humanizedText });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 API running on port ${PORT}`);
});
