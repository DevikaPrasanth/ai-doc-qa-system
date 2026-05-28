const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const supabase = require("../config/supabaseClient");
const authMiddleware = require("../middleware/authMiddleware");
const generateEmbedding = require("../utils/generateEmbedding");
const model = require("../config/geminiClient");
const pdfParse = require("pdf-parse");

const router = express.Router();

const chunkText = (text, chunkSize = 500) => {
  const chunks = [];

  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return chunks;
};

router.post(
  "/upload",
  upload.single("file"),
  authMiddleware,
  async (req, res) => {
    console.log("UPLOAD ROUTE HIT");
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          error: "No file uploaded",
        });
      }

      const pdfData = await pdfParse(file.buffer);
      const extractedText = pdfData.text;

      console.log("EXTRACTED TEXT:");
      console.log(extractedText);

      const chunks = chunkText(
        extractedText || "No text found"
      );

      console.log("TOTAL CHUNKS:", chunks.length);

      const userId = req.user.id;

      const { v4: uuidv4 } = await import("uuid");
      const fileName = `${uuidv4()}-${file.originalname}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("documents")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        return res.status(500).json({
          error: error.message,
        });
      }

      // Insert into PostgreSQL
      const { data: insertedDocument, error: dbError } =
        await supabase
          .from("documents")
          .insert([
            {
              user_id: userId,
              file_name: file.originalname,
              storage_path: data.path,
            },
          ])
          .select()
          .single();

      if (dbError) {
        return res.status(500).json({
          error: dbError.message,
        });
      }

      console.log("DOCUMENT INSERTED");
      console.log(insertedDocument);

      const chunkRows = chunks.map(
        (chunk, index) => ({
          document_id: insertedDocument.id,
          content: chunk,
          chunk_index: index,
        })
      );

      console.log("INSERTING CHUNKS");

      const { error: chunkError } = await supabase
        .from("document_chunks")
        .insert(chunkRows);

      if (chunkError) {
        console.log("CHUNK ERROR:", chunkError);

        return res.status(500).json({
          error: chunkError.message,
        });
      }

      console.log("CHUNKS INSERTED");

      // // Save chunks
      // console.log("CHUNKS COUNT:", chunks.length);
      // const chunkRows = chunks.map(
      //   (chunk, index) => ({
      //     document_id: insertedDocument.id,
      //     content: chunk,
      //     chunk_index: index,
      //   })
      // );

      // const { error: chunkError } = await supabase
      //   .from("document_chunks")
      //   .insert(chunkRows);

      // if (chunkError) {
      //   return res.status(500).json({
      //     error: chunkError.message,
      //   });
      // }

      res.json({
        message: "File uploaded successfully",
        data,
      });
    } catch (err) {
      console.error("FULL ERROR:", err);

      res.status(500).json({
        error: err.message || err,
      });
    }
  },
);

router.get(
  "/my-documents",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        return res.status(500).json({
          error: error.message,
        });
      }

      res.json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
);

router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const documentId = req.params.id;

      // Get document first
      const { data: document, error: fetchError } =
        await supabase
          .from("documents")
          .select("*")
          .eq("id", documentId)
          .single();

      if (fetchError || !document) {
        return res.status(404).json({
          error: "Document not found",
        });
      }

      // Delete from storage
      const { error: storageError } =
        await supabase.storage
          .from("documents")
          .remove([document.storage_path]);

      if (storageError) {
        return res.status(500).json({
          error: storageError.message,
        });
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentId);

      if (dbError) {
        return res.status(500).json({
          error: dbError.message,
        });
      }

      res.json({
        message: "Document deleted successfully",
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
);

router.post(
  "/ask",
  authMiddleware,
  async (req, res) => {
    try {
      console.log("ASK ROUTE HIT");
      console.log("ASK BODY:", req.body);

      const { question, documentId } = req.body;

      if (!documentId) {
        return res.status(400).json({
          error: "Document ID required",
        });
      }

      if (!question) {
        return res.status(400).json({
          error: "Question is required",
        });
      }

      // Retrieve relevant chunks
      const { data: chunks, error } = await supabase
        .from("document_chunks")
        .select(`
          content,
          chunk_index,
          documents (
            file_name
          )
        `)
        .eq("document_id", documentId)
        .limit(10);

      console.log("RETRIEVED CHUNKS:");
      console.log(chunks);

      if (error) {
        return res.status(500).json({
          error: error.message,
        });
      }

      if (!chunks || !chunks.length) {
        return res.json({
          answer: "No relevant information found in documents.",
          citations: [],
        });
      }

      // Build context
      const context = chunks
        .map(
          (chunk) =>
            `Document: ${chunk.documents?.file_name || "Unknown"}
Chunk ${chunk.chunk_index}:
${chunk.content}`
        )
        .join("\n\n");

      const prompt = `
You are an AI document assistant.

Answer the user's question ONLY using the provided document context.

QUESTION:
${question}

CONTEXT:
${context}

Provide a concise helpful answer.
`;

      console.log("PROMPT:");
      console.log(prompt);

      const result = await model.generateContent(prompt);

      const response = await result.response;

      const answer = response.text();

      console.log(answer);

      res.json({
        answer,
        citations: [],
      });
    } catch (err) {
      console.error("ASK ROUTE ERROR:", err);
      console.error("ASK ROUTE ERROR DETAILS:", err.response?.data || err.message);

      res.status(500).json({
        error: err.message || "Internal server error",
      });
    }
  }
);

module.exports = router;
