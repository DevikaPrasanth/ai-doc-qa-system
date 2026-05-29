const axios = require("axios");

const generateEmbedding = async (text) => {
  try {
    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2",
      {
        inputs: text,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    return response.data[0];
  } catch (error) {
    console.error(
      "Embedding generation error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

module.exports = generateEmbedding;
