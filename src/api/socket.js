import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.connecting = false;
    this.connectionAttempts = 0;
    this.maxAttempts = 3;
  }

  connect(token) {
    // Prevent duplicate connections
    if (this.socket?.connected) {
      console.log("✅ Socket already connected");
      return this.socket;
    }

    if (this.connecting) {
      console.log("⚠️ Socket connection in progress");
      return this.socket;
    }

    // Check if we've exceeded max attempts
    if (this.connectionAttempts >= this.maxAttempts) {
      console.error("❌ Max socket connection attempts reached");
      return null;
    }

    this.connecting = true;
    this.connectionAttempts++;
    console.log(
      `🔌 Creating socket connection (attempt ${this.connectionAttempts})...`,
    );

    // Disconnect existing socket if any
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }

    this.socket = io(import.meta.env.VITE_CHAT_SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      timeout: 5000, // Reduced from 10000
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket.id);
      this.connected = true;
      this.connecting = false;
      this.connectionAttempts = 0; // Reset on success
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

      // If we've tried too many times, give up
      if (this.connectionAttempts >= this.maxAttempts) {
        console.error("❌ Giving up on socket connection");
        this.socket?.disconnect();
      }
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
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.connecting = false;
      this.connectionAttempts = 0;
    }
  }

  // Check connection before emitting
  _ensureConnected() {
    if (!this.socket || !this.connected) {
      console.warn("⚠️ Socket not connected, operation skipped");
      return false;
    }
    return true;
  }

  joinConversations() {
    if (!this._ensureConnected()) return;
    this.socket.emit("join_conversations");
  }

  joinConversation(conversationId) {
    if (!this._ensureConnected()) return;
    this.socket.emit("join_conversation", { conversationId });
  }

  leaveConversation(conversationId) {
    if (!this._ensureConnected()) return;
    this.socket.emit("leave_conversation", { conversationId });
  }

  sendMessage(conversationId, message) {
    if (!this._ensureConnected()) return;
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
    if (!this._ensureConnected()) return;
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
