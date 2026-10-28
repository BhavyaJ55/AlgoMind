
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json({ limit: "10kb" }));

// Create the Gemini client on the backend only.
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  : null;

// Check whether the backend is running.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    message: "AlgoMind backend is running",
    aiConfigured: Boolean(ai),
  });
});

// Generate a real DSA explanation.
app.post("/api/chat", async (req, res) => {
  const { question } = req.body ?? {};

  if (typeof question !== "string" || !question.trim()) {
    return res.status(400).json({
      success: false,
      error: "Please provide a non-empty question.",
    });
  }

  const cleanedQuestion = question.trim();

  if (cleanedQuestion.length > 2000) {
    return res.status(400).json({
      success: false,
      error: "Question must be 2000 characters or fewer.",
    });
  }

  if (!ai) {
    return res.status(503).json({
      success: false,
      error: "AI is not configured. Check the backend API key.",
    });
  }

  try {
    const prompt = `
You are AlgoMind, a friendly and accurate DSA tutor
for computer science students preparing for software
engineering interviews.

Help the student understand concepts instead of
just memorizing answers.

For programming and DSA questions:
1. Explain the core idea in simple language.
2. Use a small example when useful.
3. Explain the approach step by step.
4. Include Java code when code is requested or useful.
5. Explain time and space complexity when relevant.
6. Mention important edge cases.
7. If the question asks for a hint, give a hint first
   rather than immediately revealing the full solution.

If the student asks about a non-DSA topic, answer
helpfully and honestly instead of pretending it is DSA.

Use readable formatting and avoid unnecessary verbosity.
If you are uncertain, say so rather than inventing facts.

Student's question:
${cleanedQuestion}
`;

    const response = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt,
    });

    const answer = response.output_text?.trim();

    if (!answer) {
      throw new Error("The AI returned an empty response.");
    }

    return res.status(200).json({
      success: true,
      question: cleanedQuestion,
      answer,
    });
  } catch (error) {
    console.error("AlgoMind AI request failed:", error.message);

    return res.status(502).json({
      success: false,
      error:
        "AlgoMind could not generate a response. Please try again.",
    });
  }
});

// Handle unknown API routes.
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    error: "API route not found.",
  });
});

// Handle malformed JSON and unexpected server errors.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: "Invalid JSON request body.",
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      error: "Request body is too large.",
    });
  }

  console.error("Server error:", err.message);

  return res.status(500).json({
    success: false,
    error: "Internal server error.",
  });
});

app.listen(PORT, () => {
  console.log(`AlgoMind backend running on port ${PORT}`);
});
