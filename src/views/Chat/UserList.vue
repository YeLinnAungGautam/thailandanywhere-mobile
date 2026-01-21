<template>
  <!-- Modal Overlay -->
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="closeModal"
  >
    <!-- Modal Content -->
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
      <!-- Header -->
      <div
        class="px-6 py-4 bg-main rounded-t-2xl flex items-center justify-between"
      >
        <h3 class="text-lg font-semibold text-white">Start New Chat</h3>
        <button @click="closeModal" class="text-white hover:text-white/80">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Search -->
      <div class="p-4 border-b border-gray">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search admins..."
            class="w-full px-4 py-2.5 bg-gray rounded-full focus:outline-none focus:ring-2 focus:ring-main text-sm"
          />
          <svg
            class="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <!-- Admin List -->
      <div class="max-h-96 overflow-y-auto">
        <!-- Loading -->
        <div v-if="loading" class="p-8 text-center">
          <div
            class="animate-spin rounded-full h-10 w-10 border-b-2 border-main mx-auto mb-3"
          ></div>
          <p class="text-gray-600 text-sm">Loading...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredAdmins.length === 0" class="p-8 text-center">
          <div class="text-gray text-4xl mb-3">👥</div>
          <p class="text-gray-600 text-sm">No admins found</p>
        </div>

        <!-- Admins -->
        <div v-else>
          <div
            v-for="admin in filteredAdmins"
            :key="admin._id"
            @click="startChat(admin)"
            class="p-4 hover:bg-gray/30 cursor-pointer border-b border-gray transition"
          >
            <div class="flex items-center gap-3">
              <!-- Avatar with First Letter -->
              <div
                class="w-12 h-12 bg-main rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              >
                {{ getInitials(admin.name) }}
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-semibold text-black truncate">
                  {{ admin.name }}
                </h4>
                <p class="text-xs text-gray-600 truncate">{{ admin.email }}</p>
              </div>

              <!-- Online Status -->
              <div
                v-if="admin.isOnline"
                class="w-3 h-3 bg-green rounded-full flex-shrink-0"
              ></div>
              <div
                v-else
                class="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useChatStore } from "../../stores/chat";
import { useSocketStore } from "../../stores/socket";
import { chatApiService } from "../../api/chat";

const emit = defineEmits(["close"]);

const chatStore = useChatStore();
const socketStore = useSocketStore();

const searchQuery = ref("");
const loading = ref(false);
const admins = ref([]);

const filteredAdmins = computed(() => {
  if (!searchQuery.value) {
    return admins.value;
  }

  const query = searchQuery.value.toLowerCase();
  return admins.value.filter((admin) => {
    return (
      admin.name.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query)
    );
  });
});

function getInitials(name) {
  // Get first letter of first name
  return name.charAt(0).toUpperCase();
}

async function startChat(admin) {
  try {
    const conversation = await chatStore.createConversation("admin-to-admin", [
      {
        id: admin._id,
        type: "admin",
        name: admin.name,
        email: admin.email,
      },
    ]);

    // Select the conversation
    await chatStore.selectConversation(conversation._id);

    // Join the socket room immediately
    socketStore.joinConversation(conversation._id);

    closeModal();
  } catch (err) {
    console.error("Failed to create conversation:", err);
  }
}

function closeModal() {
  emit("close");
}

onMounted(async () => {
  loading.value = true;
  try {
    const response = await chatApiService.getOnlineUsers("admin");
    if (response.success) {
      admins.value = response.users;
    }
  } catch (err) {
    console.error("Failed to load admins:", err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Custom scrollbar styles */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #ff6300;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #e55800;
}
</style>
