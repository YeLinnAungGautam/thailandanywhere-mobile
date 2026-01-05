<template>
	<div class="flex flex-col sm:flex-row min-h-[62vh] sm:h-[62vh] bg-white">
		<!-- Images -->
		<div class="w-full sm:w-2/3 sm:pr-4 overflow-y-auto">
			<div class="py-4 sm:p-6">
				<div class="flex justify-between items-center mb-4">
					<h2 class="text-sm sm:text-base font-semibold text-[#FF613c]">Cruise Images</h2>
					<span class="text-xs text-gray-500">{{ detail?.images?.length || 0 }} images</span>
				</div>

				<!-- All Images With Grid Style -->
				<section class="mb-6">
					<div v-if="detail?.images && detail.images.length > 0"
						class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
						<div v-for="(image, index) in detail.images" :key="image.id || index" class="relative group">
							<img :src="getImageUrl(image)" :alt="`Cruise image ${index + 1}`"
								class="w-full h-32 sm:h-48 object-cover rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
								style="border: 1px solid #d1d5db"
								@click="openImageModal(image)" />
							<div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
								{{ index + 1 }} / {{ detail.images.length }}
							</div>
						</div>
					</div>
					<div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-12 text-center">
						<svg class="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" fill="none" stroke="currentColor"
							viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
							</path>
						</svg>
						<p class="mt-2 text-xs sm:text-sm text-gray-600">No images available</p>
					</div>
				</section>

				<!-- Cover Image Section -->
				<section class="mb-6" v-if="detail?.cover_image">
					<div class="flex justify-between items-center mb-3 sm:mb-4">
						<h3 class="text-xs sm:text-sm font-semibold text-gray-700">Cover Image</h3>
					</div>
					<div class="relative">
						<img :src="detail.cover_image" alt="Cover image"
							class="w-full h-40 sm:h-64 object-cover rounded-lg " style="border: 1px solid #d1d5db"/>
						<div class="absolute top-2 left-2 bg-[#FF613c] text-white text-xs px-2 py-1 rounded">Cover</div>
					</div>
				</section>
			</div>
		</div>

		<!-- YouTube Video -->
		<div
			class="w-full sm:w-1/3 bg-gray-50 sm:border-l border-gray-200 overflow-y-auto  sm:border-t-0 mt-4 sm:mt-0"
			style="border-top: 1px solid #d1d5db">
			<div class="p-4 sm:p-6">
				<div class="flex justify-between items-center mb-4">
					<h2 class="text-sm sm:text-base font-semibold text-[#FF613c]">Videos</h2>
				</div>

				<!-- English Video -->
				<section class="mb-4 sm:mb-6" v-if="detail?.youtube_link?.[0]?.en_link">
					<h3 class="text-xs font-medium text-gray-600 mb-2">English Video</h3>
					<div class="space-y-2 sm:space-y-3">
						<div class="aspect-video bg-black rounded-lg overflow-hidden">
							<iframe :src="`https://www.youtube.com/embed/${detail.youtube_link[0].en_link}`" class="w-full h-full"
								frameborder="0" allowfullscreen></iframe>
						</div>
						<p v-if="detail?.youtube_link?.[0]?.en_name" class="text-xs text-gray-500 truncate">
							{{ detail.youtube_link[0].en_name }}
						</p>
					</div>
				</section>

				<!-- Myanmar Video -->
				<section class="mb-4 sm:mb-6" v-if="detail?.youtube_link?.[0]?.mm_link">
					<h3 class="text-xs font-medium text-gray-600 mb-2">Myanmar Video</h3>
					<div class="space-y-2 sm:space-y-3">
						<div class="aspect-video bg-black rounded-lg overflow-hidden">
							<iframe :src="`https://www.youtube.com/embed/${detail.youtube_link[0].mm_link}`" class="w-full h-full"
								frameborder="0" allowfullscreen></iframe>
						</div>
						<p v-if="detail?.youtube_link?.[0]?.mm_name" class="text-xs text-gray-500 truncate">
							{{ detail.youtube_link[0].mm_name }}
						</p>
					</div>
				</section>

				<!-- No Videos State -->
				<div v-if="!detail?.youtube_link?.[0]?.en_link && !detail?.youtube_link?.[0]?.mm_link"
					class="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center">
					<svg class="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" stroke="currentColor"
						viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z">
						</path>
					</svg>
					<p class="mt-2 text-xs sm:text-sm text-gray-600">No videos available</p>
				</div>

				<!-- Video Statistics -->
				<div v-if="detail?.youtube_link?.[0]" class="mt-4 sm:mt-6 pt-4" style="border-top: 1px solid #d1d5db">
					<h3 class="text-xs font-medium text-gray-600 mb-2">Video Details</h3>
					<div class="space-y-2 text-xs sm:text-sm">
						<div v-if="detail?.youtube_link?.[0]?.en_link" class="flex justify-between">
							<span class="text-gray-500">English:</span>
							<a :href="`https://youtu.be/${detail.youtube_link[0].en_link}`" target="_blank"
								class="text-[#FF613c] hover:underline truncate ml-2">
								View on YouTube
							</a>
						</div>
						<div v-if="detail?.youtube_link?.[0]?.mm_link" class="flex justify-between">
							<span class="text-gray-500">Myanmar:</span>
							<a :href="`https://youtu.be/${detail.youtube_link[0].mm_link}`" target="_blank"
								class="text-[#FF613c] hover:underline truncate ml-2">
								View on YouTube
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Image Modal -->
		<div v-if="selectedImage" @click="closeImageModal"
			class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
			<div class="relative max-w-5xl max-h-[90vh]" @click.stop>
				<button @click="closeImageModal"
					class="absolute -top-8 sm:-top-10 right-0 text-white hover:text-gray-300 bg-black/50 rounded-full p-1 sm:p-0">
					<svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
				<img :src="getImageUrl(selectedImage)" alt="Full size image"
					class="max-w-full max-h-[90vh] object-contain rounded-lg" />
				<div class="absolute bottom-2 left-0 right-0 text-center">
					<button @click="closeImageModal" class="bg-black/70 text-white text-xs px-3 py-1 rounded-lg mx-auto">
						Tap to close
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
	detail: {
		type: Object,
		required: true,
	},
});

const selectedImage = ref(null);

const getImageUrl = (image) => {
	if (typeof image === "string") {
		return image;
	}
	if (image?.image) {
		return image.image.startsWith("https") ? image.image : `/storage/images/${image.image}`;
	}
	return "";
};

const openImageModal = (image) => {
	selectedImage.value = image;
};

const closeImageModal = () => {
	selectedImage.value = null;
};
</script>

<style scoped>
.aspect-video {
	aspect-ratio: 16 / 9;
}

@media (max-width: 640px) {
	.truncate {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	iframe {
		-webkit-overflow-scrolling: touch;
	}

	[class*="fixed"] {
		-webkit-tap-highlight-color: transparent;
	}
}
</style>
