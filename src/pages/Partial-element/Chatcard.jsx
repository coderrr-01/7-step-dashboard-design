import React, { useState, useEffect, useRef } from "react";
import "../../assets/styles/chat-style.css";

const ChatCard = () => {
    const [message, setMessage] = useState("");
    const [showOptions, setShowOptions] = useState(true);
    const [chatStarted, setChatStarted] = useState(false);
    const [typing, setTyping] = useState(false);

    const [messages, setMessages] = useState([
        {
            text: "Welcome back, Julian. Please select your room type to continue.",
            type: "bot"
        }
    ]);

    const chatEndRef = useRef(null);

    const options = [
        {
            title: "Single Room",
            desc: "Private Solitude",
            icon: (
                <svg
                    className="option-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                    />
                </svg>
            )
        },
        {
            title: "Executive Room",
            desc: "Executive Suite",
            icon: (
                <svg className="option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                </svg>
            )
        },
        {
            title: "Both",
            desc: "Extended Options",
            icon: (
                <svg className="option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                </svg>
            )
        }
    ];

    const selectOption = (option) => {
        setMessages(prev => [
            ...prev,
            {
                text: option.title,
                type: "user"
            }
        ]);
        setShowOptions(false);
        setChatStarted(true);
        setTyping(true);
        setTimeout(() => {
            setTyping(false);
            setMessages(prev => [
                ...prev,
                {
                    text: `Great choice! You selected ${option.title}. Our team will assist you with the next steps shortly.`,
                    type: "bot"
                }
            ]);
        }, 900);
    };

    const sendMessage = () => {
        if (!message.trim()) return;
        if (!chatStarted) {
            alert("Please select a room first");
            return;
        }
        setMessages(prev => [...prev, { text: message, type: "user" }]);
        setMessage("");
        setTyping(true);
        setTimeout(() => {
            setTyping(false);
            setMessages(prev => [
                ...prev,
                {
                    text: "Thanks for your message. We will assist you shortly.",
                    type: "bot"
                }
            ]);
        }, 900);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typing]);

    return (
        <div className="chat-card premium-chat">
            {/* HEADER */}
            <div className="premium-chat-head">
                <div className="premium-chat-agent">
                    <span className="premium-chat-avatar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4"></circle>
                            <path d="M4 20c1.2-3.4 4.2-5 8-5s6.8 1.6 8 5"></path>
                        </svg>
                        <span className="premium-chat-online"></span>
                    </span>
                    <div>
                        <h3 className="premium-chat-name">Journey Concierge</h3>
                        <p className="premium-chat-status">
                            <span className="premium-chat-live"></span>
                            Online · Replies instantly
                        </p>
                    </div>
                </div>
                <span className="premium-chat-secure">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="10" width="16" height="11" rx="2"></rect>
                        <path d="M8 10V7a4 4 0 118 0v3"></path>
                    </svg>
                    Secure Chat
                </span>
            </div>

            {/* CHAT AREA */}
            <div className="premium-chat-history">
                {messages.map((item, index) => (
                    <div key={index} className={`premium-message-row ${item.type}`}>
                        {item.type === "bot" && (
                            <span className="premium-message-avatar">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="8" r="4"></circle>
                                    <path d="M4 20c1.2-3.4 4.2-5 8-5s6.8 1.6 8 5"></path>
                                </svg>
                            </span>
                        )}
                        <div className="premium-message-bubble">{item.text}</div>
                    </div>
                ))}

                {typing && (
                    <div className="premium-message-row bot">
                        <span className="premium-message-avatar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="8" r="4"></circle>
                                <path d="M4 20c1.2-3.4 4.2-5 8-5s6.8 1.6 8 5"></path>
                            </svg>
                        </span>
                        <div className="premium-message-bubble premium-typing">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}

                {/* OPTIONS */}
                {showOptions && !chatStarted && (
                    <div className="premium-options-row">
                        {options.map((item, index) => (
                            <button
                                key={index}
                                className="premium-option-button"
                                onClick={() => selectOption(item)}
                                style={{ animationDelay: `${0.1 + index * 0.09}s` }}
                            >
                                <span className="premium-option-icon">{item.icon}</span>
                                <h4>{item.title}</h4>
                                <p>{item.desc}</p>
                            </button>
                        ))}
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* INPUT AREA */}
            <div className="premium-chat-input-area">
                <div className="premium-input-wrapper">
                    <input
                        className="premium-chat-input"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder={
                            chatStarted
                                ? "Type your message..."
                                : "Select a room type to start chatting..."
                        }
                        disabled={!chatStarted}
                    />
                    <button
                        onClick={sendMessage}
                        className="premium-send-btn"
                        disabled={!chatStarted}
                    >
                        <svg fill="currentColor" height="18" viewBox="0 0 24 24" width="18">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatCard;
