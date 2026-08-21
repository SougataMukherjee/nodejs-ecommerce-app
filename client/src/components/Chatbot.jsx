import { useState, useRef, useEffect } from "react";
import knowledgeBase from "../data/chatbotKnowledge.json";
import { getAvatar } from "../api/avatarApi";
import useAuth from "../hooks/useAuth";

const BOT_AVATAR = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaVyDL_6etAHe0iIc3hN3pK8S8Cdo5YfEsyAXSBIkYmZEgpn5i8mCawJw&s=10";
const DEFAULT_AVATAR = "https://img.daisyui.com/images/profile/demo/superperson@192.webp";
const FALLBACK_REPLY = "I'm sorry, I don't have an answer for that right now. Our team will connect with you shortly. You can also reach us at support@eshop.com.";

function findAnswer(userMessage) {
  const msg = userMessage.toLowerCase().trim();
  let bestMatch = null;
  let bestScore = 0;

  for (const item of knowledgeBase.qna) {
    let score = 0;
    for (const keyword of item.keywords) {
      if (msg.includes(keyword.toLowerCase())) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  return bestScore > 0 ? bestMatch.answer : FALLBACK_REPLY;
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! 👋 Welcome to eShop. Ask me anything about orders, shipping, returns, and more!" },
  ]);
  const [input, setInput] = useState("");
  const [userAvatar, setUserAvatar] = useState(DEFAULT_AVATAR);
  const messagesEndRef = useRef(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      getAvatar()
        .then((data) => setUserAvatar(data?.image || DEFAULT_AVATAR))
        .catch(() => setUserAvatar(DEFAULT_AVATAR));
    } else {
      setUserAvatar(DEFAULT_AVATAR);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { from: "user", text: trimmed };
    const botReply = { from: "bot", text: findAnswer(trimmed) };

    setMessages((prev) => [...prev, userMsg, botReply]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const suggestedQuestions = [
    "Shipping options?",
    "Track my order",
    "Payment methods?",
  ];

  const handleSuggestion = (q) => {
    const userMsg = { from: "user", text: q };
    const botReply = { from: "bot", text: findAnswer(q) };
    setMessages((prev) => [...prev, userMsg, botReply]);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${!isOpen ? "border-4 border-orange-500 rounded-[50px]" : "border-2 border-white rounded-2xl"}`} style={{ background: '#1a1a2e' }}>
      {/* Chat window */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl shadow-2xl border border-base-300 flex flex-col" style={{ height: "480px" ,background: '#1a1a2e'}}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-t-2xl" style={{ background: '#ff6600' }}>
            <div className="avatar online">
              <div className="w-10 rounded-full">
                <img src={BOT_AVATAR} alt="Bot" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-bold text-primary-content text-sm">eShop Assistant</p>
              <p className="text-xs text-primary-content/70">Online</p>
            </div>
            <button className="btn btn-ghost btn-sm btn-circle text-primary-content" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
            {messages.map((msg, i) =>
              msg.from === "bot" ? (
                <div className="chat chat-start" key={i} >
                  <div className="chat-image avatar">
                    <div className="w-8 rounded-full">
                      <img src={BOT_AVATAR} alt="Bot" />
                    </div>
                  </div>
                  <div className="chat-bubble bg-[#ff6600] p-2 text-white text-sm">{msg.text}</div>
                </div>
              ) : (
                <div className="chat chat-end" key={i}>
                  <div className="chat-image avatar">
                    <div className="w-8 rounded-full">
                      <img src={userAvatar} alt="You" />
                    </div>
                  </div>
                  <div className="chat-bubble bg-white p-2 text-[#ff6600] text-sm">{msg.text}</div>
                </div>
              )
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions (only before user sends first message) */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-1.5 px-3 pb-2">
              {suggestedQuestions.map((q) => (
                <button key={q} className="btn btn-xs btn-outline btn-primary rounded-full" onClick={() => handleSuggestion(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-base-300">
            <input
              type="text"
              className="input input-bordered border-white p-2 input-sm flex-1 bg-base-100 text-base-content"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="btn btn-primary btn-sm" onClick={handleSend} disabled={!input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        className="btn btn-primary btn-circle btn-lg shadow-lg"
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Open chat"
        style={{ display:isOpen ? 'none':'flex' }}
      >
        {isOpen ? (
          <></>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default Chatbot;
