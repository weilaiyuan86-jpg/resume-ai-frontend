import express from "express";
import cors from "cors";
import aiRouter from "./src/routes/ai.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api", aiRouter);

app.get("/health", (req, res) => {
  res.json({ ok: true, status: "healthy" });
});

app.listen(port, () => {
  console.log(`AI backend listening on port ${port}`);
});

