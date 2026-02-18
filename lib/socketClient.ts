import api from "@/api/axiosInstance";
import { getAuth } from "@/store/auth.store";
import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;
let socketToken = "";

function getSocketBaseUrl() {
  return api.defaults.baseURL?.replace('/api', '') || 'http://10.10.11.18:4000';
}

export function connectSocket(): Socket | null {
  const auth = getAuth();
  const token = auth.user?.token;
  if (!token) return null;

  if (socketInstance && socketToken === token) {
    if (!socketInstance.connected) {
      socketInstance.connect();
    }
    return socketInstance;
  }

  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }

  socketToken = token;
  socketInstance = io(getSocketBaseUrl(), {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
  });

  return socketInstance;
}

export function disconnectSocket(socket: Socket | null, force = false) {
  if (!socketInstance) return;
  if (force || socket === socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
    socketToken = "";
  }
}
