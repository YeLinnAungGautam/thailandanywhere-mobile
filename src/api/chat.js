import axios from "axios";

const chatApi = axios.create({
  baseURL: import.meta.env.VITE_CHAT_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Track pending requests - but only for write operations
const pendingRequests = new Map();

const addTokenInterceptor = (config) => {
  const token = localStorage.getItem("tokenApp");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Only block duplicate POST/PUT/DELETE requests, allow GET requests
  if (config.method !== "get") {
    const requestKey = `${config.method}-${config.url}`;

    if (pendingRequests.has(requestKey)) {
      console.log(`⚠️ Duplicate request blocked: ${requestKey}`);
      const controller = new AbortController();
      config.signal = controller.signal;
      controller.abort();
      return config;
    }

    pendingRequests.set(requestKey, true);
  }

  return config;
};

chatApi.interceptors.request.use(addTokenInterceptor, (error) => {
  console.error("Chat API request error:", error);
  return Promise.reject(error);
});

const errorInterceptor = (error) => {
  // Remove from pending requests
  if (error.config && error.config.method !== "get") {
    const requestKey = `${error.config.method}-${error.config.url}`;
    pendingRequests.delete(requestKey);
  }

  // Don't log canceled requests
  if (error.code === "ERR_CANCELED") {
    return Promise.reject(error);
  }

  console.error("Chat API error:", error);

  if (error.response?.status === 401) {
    console.error("❌ 401 Unauthorized - Token invalid or expired");
    localStorage.removeItem("tokenApp");
    localStorage.removeItem("user");

    // Dispatch logout event instead of hard redirect
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
  }

  if (!error.response) {
    console.error("❌ Network error - Chat server not reachable");
  }

  return Promise.reject(error);
};

chatApi.interceptors.response.use((response) => {
  // Remove from pending requests on success
  if (response.config && response.config.method !== "get") {
    const requestKey = `${response.config.method}-${response.config.url}`;
    pendingRequests.delete(requestKey);
  }
  return response;
}, errorInterceptor);

export const chatApiService = {
  async verifyToken() {
    try {
      console.log("🔐 Verifying token...");
      const response = await chatApi.post("/auth/verify");
      console.log("✅ Token verified");
      return response.data;
    } catch (error) {
      if (error.code !== "ERR_CANCELED") {
        console.error("❌ Verify token failed:", error.message);
      }
      throw error;
    }
  },

  async getConversations(type = null) {
    try {
      const params = type ? { type } : {};
      const response = await chatApi.get("/conversations", { params });
      console.log(
        `✅ Got ${response.data.conversations?.length || 0} conversations`,
      );
      return response.data;
    } catch (error) {
      if (error.code !== "ERR_CANCELED") {
        console.error("❌ Get conversations failed:", error.message);
      }
      throw error;
    }
  },

  async getConversation(id) {
    try {
      const response = await chatApi.get(`/conversations/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Get conversation failed:", error.message);
      throw error;
    }
  },

  async createConversation(data) {
    try {
      console.log("📝 Creating conversation...");
      const response = await chatApi.post("/conversations", data);
      console.log("✅ Conversation created");
      return response.data;
    } catch (error) {
      console.error("❌ Create conversation failed:", error.message);
      throw error;
    }
  },

  async getMessages(conversationId, page = 1, limit = 50) {
    try {
      const response = await chatApi.get(`/messages/${conversationId}`, {
        params: { page, limit },
      });
      console.log(`✅ Got ${response.data.messages?.length || 0} messages`);
      return response.data;
    } catch (error) {
      console.error("❌ Get messages failed:", error.message);
      throw error;
    }
  },

  async sendMessage(conversationId, message) {
    try {
      const response = await chatApi.post("/messages", {
        conversationId,
        message,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Send message failed:", error.message);
      throw error;
    }
  },

  async markAsRead(conversationId, messageIds = null) {
    try {
      const response = await chatApi.post(`/messages/${conversationId}/read`, {
        messageIds,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Mark as read failed:", error.message);
      throw error;
    }
  },

  async getOnlineUsers(type = null) {
    try {
      const params = type ? { type } : {};
      const response = await chatApi.get("/auth/online", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Get online users failed:", error.message);
      throw error;
    }
  },

  async getUnreadNotifications() {
    try {
      const response = await chatApi.get("/notifications/unread");
      console.log(`✅ Got ${response.data.count} unread notifications`);
      return response.data;
    } catch (error) {
      console.error("❌ Get unread notifications failed:", error.message);
      throw error;
    }
  },

  async getAllNotifications(page = 1, limit = 20) {
    try {
      const response = await chatApi.get("/notifications", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Get notifications failed:", error.message);
      throw error;
    }
  },

  async markNotificationAsRead(notificationId) {
    try {
      const response = await chatApi.put(
        `/notifications/${notificationId}/read`,
      );
      return response.data;
    } catch (error) {
      console.error("❌ Mark notification read failed:", error.message);
      throw error;
    }
  },

  async markAllNotificationsAsRead() {
    try {
      const response = await chatApi.put("/notifications/read-all");
      return response.data;
    } catch (error) {
      console.error("❌ Mark all read failed:", error.message);
      throw error;
    }
  },
};

export { chatApi };
