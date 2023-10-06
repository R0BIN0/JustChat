import { useEffect, useRef } from "react";

const useWebSocket = (url: string) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket(url);

    socketRef.current.addEventListener("open", () => {
      console.log("connected");
    });

    socketRef.current.addEventListener("message", (event) => {
      console.log("message from server:", event.data);
    });

    return () => {
      socketRef.current?.close();
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    }
  };
  return { sendMessage };
};

export default useWebSocket;
