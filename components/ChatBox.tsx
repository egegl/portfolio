"use client";
import React, { useState, useRef, useEffect } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

// Message type for conversation state (displayed messages)
type Message = { role: 'user' | 'assistant'; content: string };
// APIMessage includes system role for initial instructions
type APIMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export default function ChatBox() {
  // Conversation messages
  const [messages, setMessages] = useState<Message[]>([]);
  // On mount, load persisted messages (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('chat_messages');
        if (saved) setMessages(JSON.parse(saved));
      } catch {
        // ignore parse errors
      }
    }
  }, []);
  const [input, setInput] = useState('');
  // Loading state for thinking animation
  const [isLoading, setIsLoading] = useState(false);
  // Animated dots string
  const [dots, setDots] = useState('');
  // Reference to the scrollable chat container
  const containerRef = useRef<HTMLDivElement>(null);
  // Track whether we're inside a <think>…</think> block
  const isThinking = useRef(false);

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };
  // Persist messages on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    }
  }, [messages]);
  // Auto-scroll when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Remove <think> blocks and their content from the stream
  function filterThink(raw: string): string {
    let out = '';
    let rem = raw;
    while (rem) {
      if (isThinking.current) {
        const closeIdx = rem.indexOf('</think>');
        if (closeIdx === -1) {
          // still thinking, skip all
          rem = '';
        } else {
          // exit thinking mode
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

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', content: input };
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    scrollToBottom();
    let assistantMessage: Message = { role: 'assistant', content: '' };
    setMessages([...newMessages, assistantMessage]);

    // systemPrompt is passed from .env
    const apiMessages: APIMessage[] = [...newMessages];

    // Reset thinking filter and start loading animation
    isThinking.current = false;
    setIsLoading(true);

    // start dots animation
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
          // Remove think blocks, then strip leading newlines to avoid extra empty lines
          let chunk = filterThink(parsed.content);
          // strip leading newlines
          chunk = chunk.replace(/^\n+/, '');
          // remove any markdown bold markers
          chunk = chunk.replace(/\*\*(.*?)\*\*/g, '$1');
          if (chunk) {
            assistantMessage.content += chunk;
            setMessages([...newMessages, assistantMessage]);
            scrollToBottom();
          }
        } catch (e) {
          console.warn('Non-JSON SSE message', event.data);
        }
      },
      onerror(err) {
        console.error('Chat error:', err);
      }
    });

    // stop loading animation
    window.clearInterval(interval);
    setIsLoading(false);
    setDots('');
  };
  
  // Clear the chat history and reset input
  const handleClear = () => {
    setMessages([]);
    setInput('');
    isThinking.current = false;
    // Clear persisted messages
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chat_messages');
    }
    scrollToBottom();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div ref={containerRef} className="h-12c0 overflow-auto mb-4 p-2">
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