"use client";
import React, { useState, useRef, useEffect } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import './ChatBox.css';

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
  const MAX_LENGTH = 1000;
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

  const parseMarkdown = (text: string) => {
    // Replace **text** with <strong>text</strong>
    let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace *text* with <em>text</em>
    parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Handle code blocks
    parsed = parsed.replace(/```([\s\S]*?)```/g, (match, code) => {
      // Remove any language specification at the start of the code
      const cleanCode = code.trim().replace(/^\w+/, '').trim();
      // Escape HTML characters
      const escapedCode = cleanCode
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
      return `<pre><code>${escapedCode}</code></pre>`;
    });
    
    // Replace `code` with <code>code</code>
    parsed = parsed.replace(/`([^`]+)`/g, '<code>$1</code>');
    return parsed;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="chat-wrapper">
      <div ref={containerRef} className="chat-container">
        <div className="chat-message-container">
          {messages.map((msg, idx) => {
            const isLast = idx === messages.length - 1;
            const showLoading = isLoading && msg.role === 'assistant' && isLast && msg.content === '';
            return (
              <div key={idx} className={`chat-message ${msg.role}`}>
                {showLoading ? (
                  <span className="chat-loading">{dots}</span>
                ) : (
                  <>
                    <span className="chat-text" dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} />
                    {msg.role === 'assistant' && msg.content.length > 100 && (
                      <div className="copy-container">
                        <button 
                          onClick={() => handleCopy(msg.content)} 
                          className="copy-button"
                          title="Copy message"
                        >
                          📋 Copy
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <input
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !isLoading) handleSend(); }}
            placeholder="Type your message..."
            disabled={isLoading}
            maxLength={MAX_LENGTH}
          />
        </div>
        <div className="chat-buttons">
          <button 
            onClick={handleSend} 
            className="chat-button send"
            disabled={isLoading}
          >
            Send
          </button>
          <button 
            onClick={handleClear} 
            className="chat-button clear"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}