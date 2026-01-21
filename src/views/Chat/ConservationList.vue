<template>
  <div class="w-80 bg-white border-r border-gray-200 flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Conversations</h2>
    </div>

    <!-- Search -->
    <div class="p-4 border-b border-gray-200">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search conversations..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
    </div>

    <!-- Conversations List -->
    <div class="flex-1 overflow-y-auto">
      <!-- Loading -->
      <div v-if="chatStore.loading" class="p-4 text-center text-gray-600">
        Loading conversations...
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredConversations.length === 0"
        class="p-4 text-center text-gray-600"
      >
        No conversations found
      </div>

      <!-- Conversation Items -->
      <div v-else>
        <div
          v-for="conversation in filteredConversations"
          :key="conversation._id"
          @click="selectConversation(conversation)"
          class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
          :class="{
            'bg-orange-50 border-l-4 border-l-orange-600': isSelected(
              conversation._id,
            ),
          }"
        >
          <div class="flex items-start space-x-3">
            <!-- Avatar -->
            <div
              class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-gray-700 font-semibold"
            >
              {{ getConversationInitials(conversation) }}
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <!-- Name & Time -->
              <div class="flex items-center justify-between mb-1">
                <h3 class="text-sm font-semibold text-gray-900 truncate">
                  {{ getConversationName(conversation) }}
                </h3>
                <span class="text-xs text-gray-600 flex-shrink-0 ml-2">
                  {{ formatConversationTime(conversation.updatedAt) }}
                </span>
              </div>

              <!-- Last Message -->
              <p class="text-sm text-gray-600 truncate">
                {{ conversation.lastMessage?.message || "No messages yet" }}
              </p>

              <!-- Unread Badge -->
              <div v-if="conversation.unreadCount > 0" class="mt-1">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-600 text-white"
                >
                  {{ conversation.unreadCount }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useChatStore } from "../../stores/chat";
import { useSocketStore } from "../../stores/socket";
import { useAuthStore } from "../../stores/auth";
import { formatConversationTime } from "../../utils/formatDate";

const chatStore = useChatStore();
const socketStore = useSocketStore();
const authStore = useAuthStore();

const searchQuery = ref("");

const filteredConversations = computed(() => {
  if (!searchQuery.value) {
    return chatStore.sortedConversations;
  }

  const query = searchQuery.value.toLowerCase();

  return chatStore.sortedConversations.filter((conv) => {
    const name = getConversationName(conv).toLowerCase();
    const lastMessage = conv.lastMessage?.message?.toLowerCase() || "";
    return name.includes(query) || lastMessage.includes(query);
  });
});

function getConversationName(conversation) {
  if (conversation.name) {
    return conversation.name;
  }

  // Get other participant name
  const currentUserId = authStore.user?.id;
  const otherParticipant = conversation.participants.find(
    (p) => p.id != currentUserId,
  );

  return otherParticipant?.name || "Unknown";
}

function getConversationInitials(conversation) {
  const name = getConversationName(conversation);
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function isSelected(conversationId) {
  return chatStore.currentConversation?._id === conversationId;
}

async function selectConversation(conversation) {
  try {
    await chatStore.selectConversation(conversation._id);

    if (socketStore.joinConversation) {
      socketStore.joinConversation(conversation._id);
    }

    if (socketStore.markAsRead) {
      socketStore.markAsRead(conversation._id);
    }
  } catch (error) {
    console.error("❌ Error selecting conversation:", error);
  }
}
</script>
