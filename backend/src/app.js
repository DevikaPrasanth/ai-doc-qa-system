const express = require("express");
const cors = require("cors");
require("dotenv").config();
const documentRoutes = require("./routes/documentRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ai-doc-qa-system.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use("/documents", documentRoutes);
app.use("/api/documents", documentRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);
