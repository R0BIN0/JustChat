import { useEffect, useRef } from "react";
import { setEmitEvent, setSocket } from "../redux/reducers/socketReducer";
import { useDispatch, useSelector } from "react-redux";
import { IAppDispatch, IRootState } from "../redux/store";
import { ISocketEvent } from "../apis/ISocketEvent";

const useWebSocket = (url: string) => {
  const user = useSelector((s: IRootState) => s.user);
  const dispatch = useDispatch<IAppDispatch>();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket(url);
    dispatch(setSocket(socketRef.current));
    dispatch(setEmitEvent(emitEvent));
    return () => {
      if (!socketRef.current) return;
      socketRef.current.close();
    };
  }, [url]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [user]);

  const handleBeforeUnload = () => {
    emitEvent(ISocketEvent.USER_IS_DISCONNECTED, user);
  };

  const emitEvent = (type: ISocketEvent, evt: unknown) => {
    try {
      const socket = socketRef.current;
      if (!socket) throw new Error("Socket is not initialized");
      if (socket.readyState !== WebSocket.OPEN) throw new Error("Socket is closed");
      socket.send(JSON.stringify({ type, evt }));
    } catch (error) {
      console.error(error);
    }
  };
};

export default useWebSocket;
