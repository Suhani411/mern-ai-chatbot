import React, { useState} from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="chat-container">
      <h2>AI Chatbot</h2>
      <button 
        onClick={clearChat} 
        className="clear-btn"
      >
        Clear Chat
      </button>
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
      </div>
      <div className="input-row">
        <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );  
}

export default App;