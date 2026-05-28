const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const OpenAI = require("openai");

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in backend/.env");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openai;
