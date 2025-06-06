import { supabase } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";

type Channel = ReturnType<typeof supabase.channel>;

interface UseBroadcast<T = unknown> {
  channelName: string;
  event: string;
  onMessage: (payload: T) => void;
}

export default function useBroadcast<T>({
  channelName,
  event,
  onMessage,
}: UseBroadcast<T>) {
  const hasMounted = useRef(false); // Track if the component has mounted to avoid re-subscribing in StrictMode
  const channelRef = useRef<Channel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_REACT_STRICT_MODE === "true"
    ) {
      console.warn(
        "useBroadcast is being called multiple times with React.StrictMode, which may lead to unexpected behavior." +
          " Ensure this hook is only used once per component instance."
      );
      if (!hasMounted.current) {
        hasMounted.current = true;
        console.warn("useBroadcast has been mounted for the first time.");
        return; // Prevent re-subscription on re-render
      }
    }

    const channel = supabase.channel(channelName);
    channelRef.current = channel;

    channel
      .on("broadcast", { event }, (payload) => {
        onMessage(payload.payload as T);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Subscribed to chat channel");
          setIsConnected(true);
        }
      });

    return () => {
      if (channelRef.current) {
        console.log("Unsubscribed from chat channel");
        supabase.removeChannel(channelRef.current!);
        channelRef.current = null;
      }
    };
  }, [channelName, event, onMessage]); // Ensure dependencies are correct

  return {
    isConnected,
    channel: channelRef.current,
  };
}
