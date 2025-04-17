import { useState, useEffect, useCallback } from 'react';

interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];
}

interface AnalysisError {
  message: string;
  timestamp: number;
}

export function useResumePaste() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<AnalysisError | null>(null);

  const handlePaste = useCallback(async (e: ClipboardEvent): Promise<ResumeData | null> => {
    const items = e.clipboardData?.items;
    if (!items) return null;

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();

        const blob = item.getAsFile();
        if (!blob) continue;

        setIsAnalyzing(true);
        setError(null);

        try {
          const formData = new FormData();
          formData.append('file', blob, 'pasted-image.png');

          const res = await fetch('https://2qqpvt74-8000.inc1.devtunnels.ms/parse-candidate/', {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) {
            throw new Error(`Analysis failed: ${res.statusText}`);
          }

          const data = await res.json();
          return data;
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image';
          setError({
            message: errorMessage,
            timestamp: Date.now(),
          });
          return null;
        } finally {
          setIsAnalyzing(false);
        }
      }
    }
    return null;
  }, []);

  return {
    isAnalyzing,
    error,
    handlePaste,
  };
}