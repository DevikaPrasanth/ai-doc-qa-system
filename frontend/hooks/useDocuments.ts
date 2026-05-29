"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchDocuments } from "@/lib/documentApi";

export interface DashboardDocument {
  id: string;
  file_name: string;
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<DashboardDocument[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const refreshDocuments = useCallback(async () => {
    try {
      setLoadingDocuments(true);
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDocuments(false);
    }
  }, []);

  useEffect(() => {
    refreshDocuments();
  }, [refreshDocuments]);

  return {
    documents,
    loadingDocuments,
    refreshDocuments,
  };
};
