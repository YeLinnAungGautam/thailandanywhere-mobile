<template>
  <div>
    <section class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-sm font-semibold text-gray-700">{{ part }} Images</h3>
        <span class="text-xs text-gray-500"
          >{{ partImages.length }} images</span
        >
      </div>

      <div
        class="grid grid-cols-2 md:grid-cols-3 gap-4"
        v-if="partImages.length > 0"
      >
        <div
          v-for="(image, index) in partImages"
          :key="`${image.id || index}`"
          class="relative group"
        >
          <img
            :src="getImageUrl(image)"
            alt=" image"
            class="w-full h-32 object-cover rounded-lg border border-gray-200"
          />
          <div
            class="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 rounded-lg flex items-center justify-center"
          >
            <div class="opacity-0 group-hover:opacity-100 flex gap-2">
              <button
                @click="editImage(image)"
                class="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                :disabled="loading"
              >
                <PencilSquareIcon class="w-4 h-4" />
              </button>
              <button
                @click="deleteImage(image)"
                class="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                :disabled="loading"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
      >
        <BuildingOfficeIcon class="mx-auto h-12 w-12 text-gray-400" />
        <p class="mt-2 text-sm text-gray-600">No {{ part }} images</p>
        <button
          @click="openImagePicker(part)"
          class="mt-2 text-xs text-[#FF613c] hover:text-[#FF613c]/80"
          :disabled="loading"
        >
          Add {{ part }} images
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  partImages: {
    type: Array,
    required: true,
  },
  editImage: {
    type: Function,
    required: true,
  },
  deleteImage: {
    type: Function,
    required: true,
  },
  openImagePicker: {
    type: Function,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  getImageUrl: {
    type: Function,
    required: true,
  },

  part: {
    type: String,
    required: true,
  },
});
</script>
