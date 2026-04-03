// ContentItem.vue - An example of a custom component for rendering items
<template>
  <div class="p-4 border border-gray-200 rounded-md bg-white shadow-sm mb-3">
    <div class="flex items-start">
      <!-- Optional thumbnail/image -->
      <div v-if="item.imageUrl" class="w-16 h-16 mr-4 flex-shrink-0">
        <img
          :src="item.imageUrl"
          :alt="`Item ${item.id} thumbnail`"
          class="w-full h-full object-cover rounded"
        />
      </div>

      <!-- Content -->
      <div class="flex-1">
        <h4 class="text-lg font-semibold text-gray-800">
          {{ item.title || `Item ${item.id}` }}
        </h4>

        <!-- Description -->
        <p class="text-gray-600 mt-1">{{ item.content }}</p>

        <!-- Optional metadata -->
        <div v-if="item.metadata" class="mt-2 flex flex-wrap gap-2">
          <span
            v-for="(tag, index) in item.metadata.tags"
            :key="index"
            class="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Optional details section -->
        <div v-if="item.details" class="mt-3 pt-2 border-t border-gray-100">
          <div
            v-for="(detail, key) in item.details"
            :key="key"
            class="flex text-sm"
          >
            <span class="font-medium text-gray-500 w-24">{{ key }}:</span>
            <span class="text-gray-800">{{ detail }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define props
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
