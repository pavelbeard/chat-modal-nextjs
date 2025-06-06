import useBroadcast from "@/hooks/useBroadcast";
import React, { useCallback, useEffect, useState } from "react";

interface ChatModalProps {
  onClose: () => void;
}

export default function ChatModal({ onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const onMessage = useCallback((payload: { message: string }) => {
    console.log("New message received:", payload);

    const message = payload.message;

    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const { isConnected, channel } = useBroadcast({
    channelName: "chat",
    event: "message",
    onMessage,
  });

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isConnected) {
      console.error("Not connected to the chat channel");
      return;
    }

    const form = event.target as HTMLFormElement;
    const input = form.elements.namedItem("message") as HTMLInputElement;

    const message = input.value.trim();

    setMessages((prevMessages) => [...prevMessages, message]);

    await channel?.send({
      type: "broadcast",
      event: "message",
      payload: { message },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold text-black mb-4">Chat Modal</h2>
        <div className="mb-4">
          {messages.length === 0 ? (
            <p className="text-gray-500">Start your conversation here...</p>
          ) : (
            <ul className="space-y-2">
              {messages.map((msg, index) => (
                <li key={index} className="text-gray-700">
                  {msg}
                </li>
              ))}
            </ul>
          )}
        </div>
        <form
          className="flex items-center space-x-2"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            name="message"
            className="flex-1 text-black border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
