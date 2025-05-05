"use client";
import React, { useState, useRef, useEffect } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

// Define the message structure for rendering
interface Message {
  role: 'user' | 'assistant';
  content: string;
}
// API message can include system prompt
interface APIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * ChatBox displays a chat UI powered by the /api/chat endpoint.
 * It uses localStorage to persist the user's conversation, and displays a simple typing indicator.
 * Safe for public deployment: No confidential logic or keys are present.
 */
export default function ChatBox() {
  // Maintains the local chat history
  const [messages, setMessages] = useState<Message[]>([]);

  // On mount, load any locally persisted chat history from localStorage (browser only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('chat_messages');
        if (saved) setMessages(JSON.parse(saved));
      } catch {
        // Ignore errors silently
      }
    }
  }, []);

  // Message input field
  const [input, setInput] = useState('');
  // Whether the assistant is responding (shows loading animation)
  const [isLoading, setIsLoading] = useState(false);
  // Simple animated dots for thinking
  const [dots, setDots] = useState('');
  // Reference to the chat container to auto-scroll to bottom
  const containerRef = useRef<HTMLDivElement>(null);
  // Used to skip over <think>...</think> regions in streaming output
  const isThinking = useRef(false);

  // Scroll to bottom when called
  const scrollToBottom = () => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  // Persist chat messages in localStorage whenever they change (browser only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom on message updates
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Removes <think>...</think> blocks from streamed output.
   */
  function filterThink(raw: string): string {
    let out = '';
    let rem = raw;
    while (rem) {
      if (isThinking.current) {
        const closeIdx = rem.indexOf('</think>');
        if (closeIdx === -1) {
          // Still inside <think>, skip rest
          rem = '';
        } else {
          // Found closing tag
          rem = rem.slice(closeIdx + '</think>'.length);
          isThinking.current = false;
        }
      } else {
        const openIdx = rem.indexOf('<think>');
        if (openIdx === -1) {
          out += rem;
          rem = '';
        } else {
          out += rem.slice(0, openIdx);
          rem = rem.slice(openIdx + '<think>'.length);
          isThinking.current = true;
        }
      }
    }
    return out;
  }

  /**
   * Submit the user's message and stream the assistant's response.
   */
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', content: input };
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    scrollToBottom();
    let assistantMessage: Message = { role: 'assistant', content: '' };
    setMessages([...newMessages, assistantMessage]);

    // Prepare API messages. The system prompt (if any) is made public via next.config.ts / process.env.CHAT_SYSTEM_PROMPT
    const systemPrompt: string = process.env.NEXT_PUBLIC_CHAT_SYSTEM_PROMPT || process.env.CHAT_SYSTEM_PROMPT || 'You are EgeBot.';
    // Log statement removed for privacy in public repo.
    const systemMessage: APIMessage = {
      role: 'system',
      content: systemPrompt
    };
    const apiMessages: APIMessage[] = [systemMessage, ...newMessages];

    // Reset think-block filtering and show loading animation
    isThinking.current = false;
    setIsLoading(true);

    // Start animated dots for loading UI
    const interval = window.setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);

    await fetchEventSource('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: apiMessages }),
      onmessage(event) {
        try {
          const parsed = JSON.parse(event.data);
          // Remove <think> blocks and strip leading/trailing newlines, and remove markdown bold styling
          let chunk = filterThink(parsed.content);
          chunk = chunk.replace(/^\n+/, '');
          chunk = chunk.replace(/\*\*(.*?)\*\*/g, '$1');
          if (chunk) {
            assistantMessage.content += chunk;
            setMessages([...newMessages, assistantMessage]);
            scrollToBottom();
          }
        } catch (e) {
          // Non-JSON SSE messages are ignored
        }
      },
      onerror(err) {
        // Could enhance with error state display
        console.error('Chat error:', err);
      }
    });

    // Cleanup loading animation
    window.clearInterval(interval);
    setIsLoading(false);
    setDots('');
  };

  /**
   * Clears the conversation and persisted chat history.
   */
  const handleClear = () => {
    setMessages([]);
    setInput('');
    isThinking.current = false;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chat_messages');
    }
    scrollToBottom();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Chat history */}
      <div ref={containerRef} className="h-96 overflow-auto mb-4 p-2">
        {messages.map((msg, idx) => {
          const isLast = idx === messages.length - 1;
          const showLoading = isLoading && msg.role === 'assistant' && isLast && msg.content === '';
          return (
            <div key={idx} className={msg.role === 'user' ? 'mb-2 text-right' : 'mb-2 text-left'}>
              <div className="inline-block border border-gray-400 p-2">
                {showLoading ? (
                  <span className="inline-block min-w-[3ch] text-center">{dots}</span>
                ) : (
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Input and actions */}
      <div className="flex items-center">
        <input
          type="text"
          className="flex-grow border px-2 py-1 mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !isLoading) handleSend(); }}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <div className="flex space-x-2">
          <button onClick={handleSend} className="px-2.5 py-1 border" disabled={isLoading}>
            Send
          </button>
          <button onClick={handleClear} className="px-2.5 py-1 border">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
