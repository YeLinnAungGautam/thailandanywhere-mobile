<template>
  <div class="flex" :class="{ 'justify-end': isOwnMessage }">
    <div
      class="flex items-end space-x-2 max-w-[75%]"
      :class="{ 'flex-row-reverse space-x-reverse': isOwnMessage }"
    >
      <!-- Avatar (only for received messages) -->
      <div
        v-if="!isOwnMessage"
        class="w-8 h-8 bg-main rounded-full flex items-center mb-4 justify-center text-white text-sm font-bold flex-shrink-0"
      >
        {{ senderInitials }}
      </div>

      <!-- Message Content -->
      <div>
        <!-- Sender Name (only for received messages) -->
        <!-- <div v-if="!isOwnMessage" class="text-xs text-gray-600 mb-1 ml-2">
          {{ message.senderName }}
        </div> -->

        <!-- Message Bubble -->
        <div
          class="px-4 py-2.5 rounded-2xl shadow-sm"
          :class="{
            'bg-main text-white rounded-br-sm': isOwnMessage,
            'bg-white text-black rounded-bl-sm': !isOwnMessage,
          }"
        >
          <p class="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {{ message.message }}
          </p>

          <!-- Link Preview -->
          <a
            v-if="message.link"
            :href="message.link"
            target="_blank"
            class="text-xs underline mt-2 block break-all hover:opacity-80"
            :class="isOwnMessage ? 'text-white' : 'text-main'"
          >
            {{ message.link }}
          </a>
        </div>

        <!-- Message Info -->
        <div
          class="flex items-center space-x-2 mt-1 px-2"
          :class="{ 'justify-end': isOwnMessage }"
        >
          <!-- Time -->
          <span class="text-[10px] text-gray-600">
            {{ formatMessageTime(message.createdAt) }}
          </span>

          <!-- Read Receipts (only for sent messages) -->
          <div
            v-if="isOwnMessage && message.readBy && message.readBy.length > 0"
            class="flex items-center text-xs text-main"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              />
            </svg>
            <svg class="w-4 h-4 -ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              />
            </svg>
          </div>

          <!-- Edited Badge -->
          <span v-if="message.isEdited" class="text-xs text-gray-600 italic">
            edited
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { formatMessageTime } from "../../utils/formatDate";

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  isOwnMessage: {
    type: Boolean,
    default: false,
  },
});

const senderInitials = computed(() => {
  // Get first letter of first name
  const name = props.message.senderName || "?";
  return name.charAt(0).toUpperCase();
});
</script>
