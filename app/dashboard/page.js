"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signOut } from "next-auth/react";

const socket = io("https://chat-backend-g9v3.onrender.com");

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (!message) return;
        socket.emit("send_message", message);
        setMessages((prev) => [...prev, { message: message, type: 0 }]);
        setMessage("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, { message: data, type: 1 }]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  const sendMessage = () => {
    console.log("message sent");
    if (!message) return;
    socket.emit("send_message", message);
    setMessages((prev) => [...prev, { message: message, type: 0 }]);
    setMessage("");
  };
  return (
    <div className="bg-[url('/chat-bg.png')] bg-cover bg-center h-screen w-screen flex items-center justify-center">
      <button onClick={()=>signOut()}>sign out</button>
      <div className="w-[70vw] h-[80vh] bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`w-full flex ${
                msg.type === 0 ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-md max-w-[80%] text-white ${
                  msg.type === 0 ? "bg-blue-500" : "bg-gray-500"
                }`}
              >
                <p>{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <Input
            id="name"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            className="flex-1 text-white bg-white/10 backdrop-blur-md placeholder-white/50"
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}



