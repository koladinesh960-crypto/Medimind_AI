'use client';

import { useState, useCallback, useRef } from 'react';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeRedFlag, setActiveRedFlag] = useState(null);
  const abortControllerRef = useRef(null);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;
    setError(null);

    const userMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build history from previous messages (exclude the current one)
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), history }),
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const aiMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        isRedFlag: data.isRedFlag,
        redFlagConditions: data.redFlagConditions || [],
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (data.isRedFlag) {
        setActiveRedFlag({
          conditions: data.redFlagConditions,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
      const errorMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: `⚠️ Sorry, I encountered an error: ${err.message}. Please try again.`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const analyzeFile = useCallback(async (file, query = '') => {
    if (isLoading) return;
    setError(null);

    const userMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: query || `📎 Uploaded: **${file.name}** — Please analyze this file.`,
      timestamp: new Date().toISOString(),
      isFileUpload: true,
      fileName: file.name,
      fileType: file.type,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (query) formData.append('query', query);

      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze file');
      }

      const aiMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        isAnalysis: true,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
      const errorMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: `⚠️ Sorry, I couldn't analyze the file: ${err.message}. Please try again.`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setActiveRedFlag(null);
    setError(null);
  }, []);

  const dismissRedFlag = useCallback(() => {
    setActiveRedFlag(null);
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    activeRedFlag,
    sendMessage,
    analyzeFile,
    clearChat,
    dismissRedFlag,
    cancelRequest,
  };
}
