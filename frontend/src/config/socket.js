import { io } from "socket.io-client";

let socketInstance = null;
let callHandlers = {};

export const initializeSocket = (projectId) => {
  if (socketInstance) {
    console.log("Closing existing socket connection before creating a new one");
    socketInstance.disconnect();
  }

  socketInstance = io(import.meta.env.VITE_API_URL, {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: {
      projectId,
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socketInstance.on("connect", () => {
    console.log("Socket connected successfully");
  });

  socketInstance.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socketInstance.on("rtc-offer", (data) => {
    console.log("Received WebRTC offer", data);
    callHandlers.handleRtcOffer?.(data);
  });

  socketInstance.on("rtc-answer", (data) => {
    console.log("Received WebRTC answer", data);
    callHandlers.handleRtcAnswer?.(data);
  });

  socketInstance.on("rtc-ice-candidate", (data) => {
    console.log("Received ICE candidate", data);
    callHandlers.handleRtcIceCandidate?.(data);
  });

  socketInstance.on("rtc-call-ended", (data) => {
    console.log("Received call ended notification", data);
    callHandlers.handleCallEnded?.(data);
  });

  return socketInstance;
};

export const registerCallHandlers = (handlers) => {
  callHandlers = handlers;
  console.log("Call handlers registered:", Object.keys(handlers));
};

export const receiveMessage = (eventName, cb) => {
  if (!socketInstance) {
    console.error("Socket is not initialized.");
    return;
  }

  socketInstance.on(eventName, cb);
  return () => {
    if (socketInstance) {
      socketInstance.off(eventName, cb);
    }
  };
};

export const sendMessage = (eventName, data) => {
  if (socketInstance?.connected) {
    console.log(`Sending ${eventName}`, data);
    socketInstance.emit(eventName, data);
  } else {
    console.error("Socket is not initialized or not connected");
    socketInstance?.connect(); // Attempt to reconnect
  }
};

export const disconnectSocket = () => {
  if (socketInstance) {
    console.log("Disconnecting socket");
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export const isSocketConnected = () => {
  return socketInstance?.connected ?? false;
};

export const testSignaling = () => {
  if (socketInstance?.connected) {
    console.log("Testing signaling - sending ping");
    socketInstance.emit("ping", { message: "Testing connection" });
  } else {
    console.error("Cannot test signaling - socket not connected");
  }
};
