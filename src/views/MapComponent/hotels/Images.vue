<template>
	<div class="flex flex-col sm:flex-row sm:h-[62vh] bg-white">
		<!--  VIDEOS -->
		<div class="w-full sm:w-[400px]  sm:border-t-0 sm:border-l border-gray-200 overflow-y-auto">
			<div class="p-4 sm:p-6">
				<div class="flex justify-between items-center mb-4">
					<h2 class="text-sm sm:text-base font-semibold text-[#FF613c]">Videos</h2>
				</div>

				<!-- VIDEO SECTION -->
				<section class="mb-6">
					<!-- English Video -->
					<div v-if="detail?.youtube_link?.[0]?.en_link" class="space-y-3">
						<div class="aspect-video bg-black rounded-lg overflow-hidden">
							<iframe :src="`https://www.youtube.com/embed/${detail.youtube_link[0].en_link}`" class="w-full h-full"
								frameborder="0" allowfullscreen></iframe>
						</div>
					</div>

					<!-- Myanmar Video -->
					<div v-else-if="detail?.youtube_link?.[0]?.mm_link" class="space-y-3">
						<div class="aspect-video bg-black rounded-lg overflow-hidden">
							<iframe :src="`https://www.youtube.com/embed/${detail.youtube_link[0].mm_link}`" class="w-full h-full"
								frameborder="0" allowfullscreen></iframe>
						</div>
					</div>

					<div v-else class="text-xs sm:text-sm text-gray-600 text-center py-6">Coming soon</div>
				</section>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { PlusIcon, PencilSquareIcon, TrashIcon, BuildingOfficeIcon, DocumentPlusIcon } from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useHotelStore } from "../../../stores/hotel";
import Swal from "sweetalert2";
import ImageCenter from "./ImageCenter.vue";

const props = defineProps({
	detail: {
		type: Object,
		required: true,
	},
});

const emit = defineEmits(["refresh-detail"]);

const hotelStore = useHotelStore();

const imageInput = ref(null);
const editImageInput = ref(null);
const selectedImageType = ref("other");
const loading = ref(false);

const buildingImages = computed(() => {
	if (!props.detail?.images) return [];
	return props.detail.images.filter((img) => img.title == "building");
});

const restaurantImages = computed(() => {
	if (!props.detail?.images) return [];
	return props.detail.images.filter((img) => img.title == "reception");
});

const facilitiesImages = computed(() => {
	if (!props.detail?.images) return [];
	return props.detail.images.filter((img) => img.title == "facilities");
});

const fitnessImages = computed(() => {
	if (!props.detail?.images) return [];
	return props.detail.images.filter((img) => img.title == "fitness");
});

const otherImages = computed(() => {
	if (!props.detail?.images) return [];
	return props.detail.images.filter((img) => img.title == "other" || !img.title || img.title == null);
});

const editModal = ref({
	isOpen: false,
	image: null,
	newImageFile: null,
	newImagePreview: null,
});

const getImageUrl = (image) => {
	if (image.preview) return image.preview;
	if (image.image) {
		return image.image.startsWith("https") ? image.image : `/storage/images/${image.image}`;
	}
	return "";
};

const closeEditModal = () => {
	if (editModal.value.newImagePreview) {
		URL.revokeObjectURL(editModal.value.newImagePreview);
	}

	editModal.value = {
		isOpen: false,
		image: null,
		newImageFile: null,
		newImagePreview: null,
	};

	if (editImageInput.value) {
		editImageInput.value.value = "";
	}
};

onMounted(() => {
});
</script>

<style scoped>
.aspect-video {
	aspect-ratio: 16 / 9;
}
</style>
