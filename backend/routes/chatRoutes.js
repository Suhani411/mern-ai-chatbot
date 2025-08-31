import express from "express";
import { generateAIResponse } from "../services/geminiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    const aiResponse = await generateAIResponse(message);
    res.json({ reply: aiResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
