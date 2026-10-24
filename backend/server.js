
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware: parse incoming JSON request bodies
app.use(express.json({ limit: "10kb" }));

// Health-check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    message: "AlgoMind backend is running"
  });
});

// Chat endpoint
app.post("/api/chat", (req, res) => {
  const { question } = req.body ?? {};

  // Validate the question
  if (typeof question !== "string" || !question.trim()) {
    return res.status(400).json({
      success: false,
      error: "Please provide a non-empty question."
    });
  }

  // Keep the input within a reasonable limit
  const cleanedQuestion = question.trim();

  if (cleanedQuestion.length > 2000) {
    return res.status(400).json({
      success: false,
      error: "Question must be 2000 characters or fewer."
    });
  }

  // Temporary response until AI integration is added
  return res.status(200).json({
    success: true,
    question: cleanedQuestion,
    answer:
      "Your question was received by AlgoMind. AI-powered DSA explanations will be added in a later stage."
  });
});

// Handle unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    error: "API route not found."
  });
});

// Handle malformed JSON and other errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: "Invalid JSON request body."
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      error: "Request body is too large."
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    error: "Internal server error."
  });
});

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AlgoMind backend running on port ${PORT}`);
});
