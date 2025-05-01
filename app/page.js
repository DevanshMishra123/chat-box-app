"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const socket = io("https://chat-box-app-imqn.vercel.app/"); 

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  const sendMessage = () => {
    if (!message) return;
    socket.emit("send_message", message);
    setMessage("");
  };
  return (
    <div  className="w-[70vw] m-auto border border-black rounded-2xl">
      <div className="h-[65vh] bg-blue-100">
        {messages.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
      <div className="flex gap-3">
        <Input
          id="name"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}  
          placeholder="Enter your message"
          className="border p-2 rounded"  
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
