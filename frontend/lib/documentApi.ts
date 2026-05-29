import axios from "axios";
import { supabase } from "@/lib/supabase";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/documents`;

const getAuthHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    Authorization: `Bearer ${session?.access_token}`,
  };
};

export const fetchDocuments = async () => {
  const response = await axios.get(`${API_BASE}/my-documents`, {
    headers: await getAuthHeaders(),
  });

  return response.data;
};

export const deleteDocument = async (id: string) => {
  await axios.delete(`${API_BASE}/${id}`, {
    headers: await getAuthHeaders(),
  });
};

export const uploadDocument = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post(`${API_BASE}/upload`, formData, {
    headers: await getAuthHeaders(),
  });

  return response.data;
};

export const askDocumentQuestion = async (
  question: string,
  documentId: string
) => {
  const response = await axios.post(
    `${API_BASE}/ask`,
    {
      question,
      documentId,
    },
    {
      headers: await getAuthHeaders(),
    }
  );

  return response.data;
};
