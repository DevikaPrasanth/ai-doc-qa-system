# DocuMind AI

An AI-powered document question answering system that allows users to upload PDF documents, ask contextual questions, and receive AI-generated answers with source citations.

## Overview

DocuMind AI is a full-stack application that combines document processing, retrieval-based question answering, and generative AI to help users interact with their documents more effectively.

Users can upload PDF documents, securely store them, and ask questions about the document content through a conversational interface. The system retrieves relevant document chunks and uses Google's Gemini model to generate contextual answers.

---

## Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected routes
* User-specific document access
* Row Level Security (RLS) using Supabase

### Document Management

* Upload PDF documents
* View uploaded documents
* Delete documents
* Secure document ownership

### Document Processing

* PDF text extraction
* Automatic content chunking
* Structured storage in PostgreSQL

### AI-Powered Question Answering

* Document-specific Q&A
* Retrieval-Augmented Generation (RAG) pattern
* Context-aware responses using Gemini
* Source citations included with every answer

### Modern User Experience

* Responsive UI
* Dark-themed modern dashboard
* Loading and error states
* Clean document management workflow

---

## Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js

### Database & Storage

* Supabase PostgreSQL
* Supabase Storage
* Row Level Security (RLS)

### AI

* Google Gemini 2.5 Flash

---

## System Architecture

### Document Ingestion Flow

1. User uploads a PDF document
2. Backend stores the file in Supabase Storage
3. PDF text is extracted
4. Content is split into chunks
5. Chunks are stored in PostgreSQL

### Question Answering Flow

1. User selects a document
2. User asks a question
3. Relevant chunks are retrieved from the database
4. Retrieved context is sent to Gemini
5. Gemini generates an answer
6. Source citations are returned to the user

---

## Database Schema

### documents

| Column       | Description        |
| ------------ | ------------------ |
| id           | Document ID        |
| user_id      | Owner of document  |
| file_name    | Uploaded file name |
| storage_path | File storage path  |
| created_at   | Upload timestamp   |

### document_chunks

| Column      | Description     |
| ----------- | --------------- |
| id          | Chunk ID        |
| document_id | Parent document |
| content     | Chunk text      |
| chunk_index | Chunk order     |

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd ai-doc-qa-system
```

### Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=5000

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

GEMINI_API_KEY=your_gemini_api_key
```

Run backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend

npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run frontend:

```bash
npm run dev
```

---

## Future Improvements

* Semantic search using vector embeddings
* Multi-document querying
* Document summaries
* OCR support for scanned PDFs
* Conversation history
* Advanced citation highlighting

---

## Design Decisions

* PostgreSQL was chosen for structured document and chunk storage.
* Supabase was used for authentication, storage, and database management.
* Document content is chunked to support scalable retrieval and future semantic search enhancements.
* Gemini was selected as the LLM for contextual answer generation.

---

## Author

Devika Prasanth
