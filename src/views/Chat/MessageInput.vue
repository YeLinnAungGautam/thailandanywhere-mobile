<template>
  <div
    class="border border-black/10 mx-4 rounded-full p-4 bg-white/50 backdrop-blur-xl"
  >
    <form @submit.prevent="handleSubmit" class="flex items-center gap-2">
      <!-- Attachment Button -->
      <button
        type="button"
        class="text-main hover:text-main/80 p-2 flex-shrink-0"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      <!-- Text Input -->
      <div class="flex-1">
        <textarea
          v-model="message"
          ref="textareaRef"
          :disabled="sending"
          @input="handleInput"
          @keydown.enter.exact.prevent="handleSubmit"
          rows="1"
          placeholder="Aa"
          class="w-full px-4 py-2.5 bg-gray border-none rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-main text-sm"
          style="max-height: 120px"
        ></textarea>
      </div>

      <!-- Send Button -->
      <button
        type="submit"
        :disabled="!message.trim() || sending"
        class="bg-white hover:bg-white/90 mb-2 disabled:bg-gray disabled:cursor-not-allowed text-main rounded-full p-2.5 transition-colors shadow-sm flex-shrink-0"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.1829 8.69236L1.59354 0.112145C1.44226 0.0383546 1.27615 0 1.10784 0C0.496 0 0 0.496 0 1.10784V1.13981C0 1.28846 0.0182273 1.43656 0.0542818 1.58078L1.74153 8.32973C1.78761 8.51409 1.94347 8.65027 2.13231 8.67127L9.54827 9.49527C9.80546 9.52382 10 9.74118 10 10C10 10.2588 9.80546 10.4762 9.54827 10.5047L2.13231 11.3287C1.94347 11.3497 1.78761 11.4859 1.74153 11.6703L0.0542818 18.4192C0.0182273 18.5635 0 18.7115 0 18.8602V18.8922C0 19.504 0.496 20 1.10784 20C1.27615 20 1.44226 19.9616 1.59354 19.8878L19.1829 11.3076C19.6828 11.0638 20 10.5563 20 10C20 9.44373 19.6828 8.93618 19.1829 8.69236Z"
            :fill="!message.trim() || sending ? '#CCCCCC' : '#FF6300'"
          />
        </svg>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useChatStore } from "../../stores/chat";
import { useSocketStore } from "../../stores/socket";

const emit = defineEmits(["send"]);

const chatStore = useChatStore();
const socketStore = useSocketStore();

const message = ref("");
const textareaRef = ref(null);
const sending = ref(false);
let typingTimeout = null;

function handleInput() {
  const textarea = textareaRef.value;
  if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  // Typing indicator
  if (chatStore.currentConversation) {
    socketStore.startTyping(chatStore.currentConversation._id);

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socketStore.stopTyping(chatStore.currentConversation._id);
    }, 1000);
  }
}

function handleSubmit() {
  const text = message.value.trim();
  if (!text) return;

  sending.value = true;

  emit("send", text);
  message.value = "";

  // Reset textarea height
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
  }

  // Stop typing indicator
  if (chatStore.currentConversation) {
    socketStore.stopTyping(chatStore.currentConversation._id);
  }

  sending.value = false;
}

// Stop typing when conversation changes
watch(
  () => chatStore.currentConversation,
  () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
  },
);
</script>
