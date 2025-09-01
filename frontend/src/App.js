import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import { Sun, Moon } from "lucide-react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);

  const MAX_CHAR_LIMIT = 200;

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { sender: "user", text: input }]);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/chat", {
        message: input,
      });

      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
      setInput("");
    } catch (error) {
      console.error("Error communicating with backend:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Unable to reach server. Try again later." },
      ]);  
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat?")) {
      setMessages([]);
    }
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2 className="chat-title">My AI Chat</h2>
         <button onClick={clearChat} className="clear-btn" title="Clear all messages">
            Clear Chat
          </button>
      <div className="theme-toggle">
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="theme-btn"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>
      </div>
      <div className="chat-box">
        {messages.map((msg, i) => (
        <div key={i} className={`message ${msg.sender}`}>
          <span className="message-bubble">{msg.text}</span>
          </div>
        ))}
        {loading && (
          <div className="message bot">
            <span className="message-bubble">Typing...</span>
          </div>
        )}
       <div ref={endOfMessagesRef} /> 
      </div>
      <div className="input-row">
        <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type a message..."
        maxLength={MAX_CHAR_LIMIT + 1}
        />
        <button 
          onClick={sendMessage} 
          disabled={!input.trim() || input.length > MAX_CHAR_LIMIT}
        >
          Send
        </button>
      </div>
<div className={`char-counter ${input.length > MAX_CHAR_LIMIT ? "warning" : ""}`}>
  {input.length}/{MAX_CHAR_LIMIT}
  {input.length > MAX_CHAR_LIMIT && (
    <span className="warning-text"> - Limit exceeded!</span>
  )}
</div>
    </div>
  );  
}

export default App;