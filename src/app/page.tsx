"use client";

import React, { useState } from 'react';

export default function AthenaAI() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hello! I am Athena. How can I help you today?' }]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    // Yahan aap apna AI logic connect kar sakte hain
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#0070f3' }}>Athena AI Assistant</h1>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', height: '400px', overflowY: 'scroll', marginBottom: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.role === 'user' ? 'right' : 'left', margin: '10px 0' }}>
            <span style={{ background: msg.role === 'user' ? '#0070f3' : '#eee', color: msg.role === 'user' ? 'white' : 'black', padding: '8px 12px', borderRadius: '15px' }}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type a message..." 
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button onClick={handleSend} style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Send
        </button>
      </div>
    </div>
  );
}
