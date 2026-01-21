<template>
  <div class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Left: Conversation Info -->
      <div class="flex items-center space-x-4">
        <!-- Avatar -->
        <div
          class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold"
        >
          {{ conversationInitials }}
        </div>

        <!-- Name & Status -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            {{ conversationName }}
          </h2>
          <p class="text-sm text-gray-600">
            {{ participantCount }} participants
          </p>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center space-x-2">
        <!-- Conversation Type Badge -->
        <span
          class="px-3 py-1 text-xs font-medium rounded-full"
          :class="{
            'bg-orange-100 text-orange-800':
              conversation.type === 'admin-to-admin',
            'bg-green-100 text-green-800': conversation.type === 'admin-group',
            'bg-purple-100 text-purple-800':
              conversation.type === 'admin-to-user',
          }"
        >
          {{ conversationTypeLabel }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useChatStore } from "../../stores/chat";
import { useAuthStore } from "../../stores/auth";

const chatStore = useChatStore();
const authStore = useAuthStore();

const conversation = computed(() => chatStore.currentConversation);

const conversationName = computed(() => {
  if (!conversation.value) return "";

  if (conversation.value.name) {
    return conversation.value.name;
  }

  const currentUserId = authStore.user?.id;
  const otherParticipant = conversation.value.participants.find(
    (p) => p.id != currentUserId,
  );

  return otherParticipant?.name || "Unknown";
});

const conversationInitials = computed(() => {
  return conversationName.value
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const participantCount = computed(() => {
  return conversation.value?.participants?.length || 0;
});

const conversationTypeLabel = computed(() => {
  const type = conversation.value?.type;
  switch (type) {
    case "admin-to-admin":
      return "Direct Message";
    case "admin-group":
      return "Group Chat";
    case "admin-to-user":
      return "User Support";
    default:
      return "Chat";
  }
});
</script>
