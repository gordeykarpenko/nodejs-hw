import "dotenv/config";

import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(pinoHttp());

app.get("/notes", (req, res) => {
  res.status(200).json({ message: "Retrieved all notes" });
});

app.get("/notes/:noteId", (req, res) => {
  res
    .status(200)
    .json({ message: `Retrieved note with ID: ${req.params.noteId}` });
});

app.get("/test-error", () => {
  throw new Error("Simulated server error");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
