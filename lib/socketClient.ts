import api from "@/api/axiosInstance";
import { getAuth } from "@/store/auth.store";
import { io, Socket } from "socket.io-client";

export function connectSocket(): Socket | null {
  const auth = getAuth();
  if (!auth.user?.token) return null;

  return io(api.defaults.baseURL?.replace('/api', '') || 'http://10.10.11.18:4000', {
    auth: { token: auth.user.token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
  });
}

export function disconnectSocket(socket: Socket | null) {
  if (socket) {
    socket.disconnect();
  }
}
