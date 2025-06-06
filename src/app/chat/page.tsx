"use client";

import ChatModal from "@/components/chat-modal";
import React, { useState } from "react";

export default function ChatPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        onClick={() => setOpen(true)}
      >
        Create chat
      </button>

      {open && <ChatModal onClose={() => setOpen(false)} />}
    </div>
  );
}
