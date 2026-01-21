import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.connecting = false;
  }

  connect(token) {
    // Prevent duplicate connections
    if (this.socket?.connected || this.connecting) {
      console.log("⚠️ Socket already connected/connecting");
      return this.socket;
    }

    this.connecting = true;
    console.log("🔌 Creating socket connection...");

    this.socket = io(import.meta.env.VITE_CHAT_SOCKET_URL, {
      auth: {
        token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket.id);
      this.connected = true;
      this.connecting = false;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      this.connected = false;
      this.connecting = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      this.connected = false;
      this.connecting = false;
    });

    this.socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });

    return this.socket;
  }

  listenToPersonalRoom(userId, userType, callback) {
    if (!this.socket) {
      console.error("❌ Socket not initialized");
      return;
    }

    const roomName = `user_${userId}_${userType}`;
    console.log(`👂 Listening to personal room: ${roomName}`);

    this.socket.on(roomName, (data) => {
      console.log(`📨 Received event in ${roomName}:`, data);
      callback(data);
    });
  }

  disconnect() {
    if (this.socket) {
      console.log("🔌 Disconnecting socket...");
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.connecting = false;
    }
  }

  // Check connection before emitting
  _ensureConnected() {
    if (!this.socket || !this.connected) {
      throw new Error("Socket not connected");
    }
  }

  joinConversations() {
    this._ensureConnected();
    this.socket.emit("join_conversations");
  }

  joinConversation(conversationId) {
    this._ensureConnected();
    this.socket.emit("join_conversation", { conversationId });
  }

  leaveConversation(conversationId) {
    this._ensureConnected();
    this.socket.emit("leave_conversation", { conversationId });
  }

  sendMessage(conversationId, message) {
    this._ensureConnected();
    console.log("📤 Emitting send_message event...");
    this.socket.emit("send_message", {
      conversationId,
      message,
      messageType: "text",
    });
  }

  startTyping(conversationId) {
    if (this.connected) {
      this.socket.emit("typing_start", { conversationId });
    }
  }

  stopTyping(conversationId) {
    if (this.connected) {
      this.socket.emit("typing_stop", { conversationId });
    }
  }

  markAsRead(conversationId, messageIds = null) {
    this._ensureConnected();
    this.socket.emit("mark_read", { conversationId, messageIds });
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const socketService = new SocketService();
