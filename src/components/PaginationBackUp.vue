<template>
  <div
    class="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3  border-gray-200 bg-gray-50"
    v-if="data"
  >
    <!-- Results Info -->
    <div class="text-sm text-gray-600">
      Showing
      <span class="font-medium text-gray-900">{{ data.meta.from }}</span>
      to
      <span class="font-medium text-gray-900">{{ data.meta.to }}</span>
      of
      <span class="font-medium text-gray-900">{{ data.meta.total }}</span>
      results
    </div>

    <!-- Pagination Controls -->
    <div class="flex items-center space-x-2">
      <!-- Previous Button -->
      <button
        @click="goToPrevPage"
        :disabled="!data.links.prev"
        class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
        :class="data.links.prev
          ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 cursor-pointer'
          : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      <!-- Page Numbers -->
      <div class="hidden sm:flex items-center space-x-1">
        <button
          v-for="(page, index) in visiblePages"
          :key="index"
          @click="changePage(page.url)"
          :disabled="!page.url"
          class="inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-colors"
          :class="page.active
            ? 'bg-[#ff613c] text-white border border-[#ff613c]'
            : page.url
              ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'"
        >
          {{ page.label }}
        </button>
      </div>

      <!-- Mobile Page Selector -->
      <div class="sm:hidden">
        <select
          v-model="currentPage"
          @change="goToPage"
          class="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:border-transparent"
        >
          <option
            v-for="(page, index) in simplePages"
            :key="index"
            :value="page.value"
            :disabled="!page.url"
          >
            Page {{ page.label }}
          </option>
        </select>
      </div>

      <!-- Next Button -->
      <button
        @click="goToNextPage"
        :disabled="!data.links.next"
        class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
        :class="data.links.next
          ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 cursor-pointer'
          : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'"
      >
        Next
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Page Size Selector (Optional) -->
    <!-- <div class="hidden md:block">
      <select
        class="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:border-transparent"
      >
        <option value="10">10 per page</option>
        <option value="25">25 per page</option>
        <option value="50">50 per page</option>
      </select>
    </div> -->
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const currentPage = ref(1);

const emit = defineEmits(["changePage"]);

const pages = computed(() => {
  if (!props.data?.meta?.links) return [];
  
  return props.data.meta.links.map((page) => {
    let label = page.label;
    if (label === "&laquo; Previous") {
      label = "«";
    }
    if (label === "Next &raquo;") {
      label = "»";
    }
    return { ...page, label: label };
  });
});

// Filter out ellipsis and navigation buttons for desktop view
const visiblePages = computed(() => {
  if (!pages.value.length) return [];
  
  // Find current page index
  const currentPageIndex = pages.value.findIndex(page => page.active);
  
  // Show max 5 pages around current page
  const start = Math.max(2, currentPageIndex - 1);
  const end = Math.min(pages.value.length - 3, currentPageIndex + 1);
  
  let visible = [];
  
  // Always show first page
  visible.push(pages.value[0]);
  
  // Show ellipsis if needed
  if (start > 2) {
    visible.push({ label: "...", url: null, active: false });
  }
  
  // Show middle pages
  for (let i = start; i <= end; i++) {
    visible.push(pages.value[i]);
  }
  
  // Show ellipsis if needed
  if (end < pages.value.length - 3) {
    visible.push({ label: "...", url: null, active: false });
  }
  
  // Always show last page
  if (pages.value.length > 1) {
    visible.push(pages.value[pages.value.length - 1]);
  }
  
  return visible;
});

// Simple pages array for mobile dropdown
const simplePages = computed(() => {
  if (!props.data?.meta) return [];
  
  const totalPages = props.data.meta.last_page;
  const pagesArray = [];
  
  for (let i = 1; i <= totalPages; i++) {
    const url = props.data.meta.links[i]?.url || null;
    pagesArray.push({
      label: i,
      value: i,
      url: url,
      active: i === props.data.meta.current_page
    });
  }
  
  return pagesArray;
});

const changePage = (url) => {
  if (url) {
    emit("changePage", url);
  }
};

const goToPrevPage = () => {
  if (props.data.links.prev) {
    emit("changePage", props.data.links.prev);
  }
};

const goToNextPage = () => {
  if (props.data.links.next) {
    emit("changePage", props.data.links.next);
  }
};

const goToPage = () => {
  const page = simplePages.value.find(p => p.value === currentPage.value);
  if (page && page.url) {
    emit("changePage", page.url);
  }
};

// Update currentPage when props change
watch(() => props.data, (newData) => {
  if (newData?.meta?.current_page) {
    currentPage.value = newData.meta.current_page;
  }
}, { immediate: true });
</script>

<style scoped>
/* Custom focus styles */
select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 97, 60, 0.1);
}

/* Disabled button styles */
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Smooth transitions */
button, select {
  transition: all 0.2s ease;
}

/* Hover effects for enabled buttons */
button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Active page button */
button.bg-\[#ff613c\] {
  box-shadow: 0 2px 4px rgba(255, 97, 60, 0.2);
}

/* Mobile responsive adjustments */
@media (max-width: 640px) {
  .flex-col {
    gap: 1rem;
  }
  
  button {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
  
  select {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>