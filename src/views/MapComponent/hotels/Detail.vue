<template>
	<div class="flex flex-col sm:flex-row h-full bg-white">
		<!-- Navigation Dropdown -->
		<div class="sm:hidden  border-gray-200 py-3">
			<select v-model="activeSection" @change="scrollToSection(activeSection)"
				class="w-full text-sm border border-gray-300 px-3 rounded-lg py-3 focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
				style="border: 1px solid #d1d5db">
				<option value="nearby" v-if="detail?.nearby_places && detail.nearby_places.length > 0">Nearby Places</option>
				<option value="description" v-if="detail?.description">Description</option>
				<option value="facilities" v-if="detail?.facilities && detail.facilities.length > 0">Facilities</option>
				<option value="location" v-if="detail?.location_map_title || detail?.place">Location</option>
				<option value="hours" v-if="detail?.check_in || detail?.check_out">Check-in & Check-out</option>
				<option value="policy" v-if="detail?.cancellation_policy">Cancellation Policy</option>
			</select>
		</div>


		<div class="hidden sm:block w-64 bg-gray-50">
			<div class="p-4">
				<nav>
					<ul class="space-y-1">
						<li v-if="detail?.nearby_places && detail.nearby_places.length > 0">
							<a href="#nearby" @click="setActiveSection('nearby')" :class="activeSection === 'nearby' ? 'bg-[#FF613c]/10 text-[#FF613c]' : 'text-gray-700 hover:bg-gray-100'"
								class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer">
								<span class="w-2 h-2 inline-block rounded-full mr-1"
									:class="activeSection === 'nearby' ? 'bg-[#FF613c]' : 'bg-gray-400'"></span>
								Nearby Places
							</a>
						</li>
						<li v-if="detail?.description">
							<a href="#description" @click="setActiveSection('description')" :class="activeSection === 'description' ? 'bg-[#FF613c]/10 text-[#FF613c]' : 'text-gray-700 hover:bg-gray-100'"
								class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer" style="border: 1px solid transparent">
								<span class="w-2 h-2 inline-block rounded-full mr-1"
									:class="activeSection === 'description' ? 'bg-[#FF613c]' : 'bg-gray-400'"></span>
								Description
							</a>
						</li>

						<li v-if="detail?.facilities && detail.facilities.length > 0">
							<a href="#facilities" @click="setActiveSection('facilities')" :class="activeSection === 'facilities' ? 'bg-[#FF613c]/10 text-[#FF613c]' : 'text-gray-700 hover:bg-gray-100'"
								class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer" style="border: 1px solid transparent">
								<span class="w-2 h-2 inline-block rounded-full mr-1"
									:class="activeSection === 'facilities' ? 'bg-[#FF613c]' : 'bg-gray-400'"></span>
								Facilities
							</a>
						</li>

						<li v-if="detail?.location_map_title || detail?.place">
							<a href="#location" @click="setActiveSection('location')" :class="activeSection === 'location' ? 'bg-[#FF613c]/10 text-[#FF613c]' : 'text-gray-700 hover:bg-gray-100'"
								class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer" style="border: 1px solid transparent">
								<span class="w-2 h-2 inline-block rounded-full mr-1"
									:class="activeSection === 'location' ? 'bg-[#FF613c]' : 'bg-gray-400'"></span>
								Location
							</a>
						</li>

						<li v-if="detail?.check_in || detail?.check_out">
							<a href="#hours" @click="setActiveSection('hours')" :class="activeSection === 'hours' ? 'bg-[#FF613c]/10 text-[#FF613c]' : 'text-gray-700 hover:bg-gray-100'"
								class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer" style="border: 1px solid transparent">
								<span class="w-2 h-2 inline-block rounded-full mr-1"
									:class="activeSection === 'hours' ? 'bg-[#FF613c]' : 'bg-gray-400'"></span>
								Check-in & Check-out
							</a>
						</li>

						<li v-if="detail?.cancellation_policy">
							<a href="#policy" @click="setActiveSection('policy')" :class="activeSection === 'policy' ? 'bg-[#FF613c]/10 text-[#FF613c]' : 'text-gray-700 hover:bg-gray-100'"
								class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer">
								<span class="w-2 h-2 inline-block rounded-full mr-1"
									:class="activeSection === 'policy' ? 'bg-[#FF613c]' : 'bg-gray-400'"></span>
								Cancellation Policy
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>

		<div class="flex-1">
			<div class="py-4 sm:py-6 max-w-full">
				<!-- Nearby Places Section -->
				<section id="nearby" v-if="detail?.nearby_places && detail.nearby_places.length > 0"
					class="mb-6 sm:mb-8 scroll-mt-4">
					<div class="flex justify-between items-center mb-3 sm:mb-4">
						<h2 class="text-sm sm:text-base font-semibold text-[#FF613c]">Nearby Places</h2>
						<!-- <button @click="openEditModal('nearby')"
							class="text-xs bg-[#FF613c] text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-[#FF613c]/90 whitespace-nowrap">
							<PencilSquareIcon class="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1" /> Edit
						</button> -->
					</div>
					<div class="space-y-2 sm:space-y-3 bg-gray-50 py-4 sm:py-6 rounded-lg min-h-[200px] sm:min-h-[300px]">
						<div v-for="place in detail.nearby_places" :key="place.name"
							class="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white" style="border: 1px solid #d1d5db">
							<div class="flex items-center space-x-2 sm:space-x-3">
								<MapPinIcon class="w-4 h-4 sm:w-5 sm:h-5 text-[#FF613c] flex-shrink-0" />
								<div class="min-w-0">
									<p class="text-xs sm:text-sm font-medium text-gray-700 truncate">
										{{ place.name }}
									</p>
									<p class="text-xs text-gray-500">{{ place.distance }}</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- Description Section -->
				<section id="description" v-if="detail?.description || detail?.full_description_en"
					class="mb-6 sm:mb-8 scroll-mt-4">
					<div class="flex justify-between items-center mb-3 sm:mb-4">
						<h2 class="text-sm sm:text-base font-semibold text-[#FF613c]">Description</h2>
						<!-- <button @click="openEditModal('description')"
							class="text-xs bg-[#FF613c] text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-[#FF613c]/90 whitespace-nowrap">
							<PencilSquareIcon class="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1" /> Edit
						</button> -->
					</div>
					<div class="space-y-3 text-xs sm:text-sm">
						<div v-if="detail?.full_description_en">
							<div
								class="text-gray-700 bg-gray-50 p-4 sm:p-6 rounded-lg leading-relaxed min-h-[200px] sm:min-h-[300px] overflow-x-auto"
								 v-html="detail.full_description_en"></div>
						</div>
					</div>
				</section>

				<!-- Facilities Section -->
				<section id="facilities" v-if="detail?.facilities && detail.facilities.length > 0"
					class="mb-6 sm:mb-8 scroll-mt-4">
					<div class="flex justify-between items-center mb-3 sm:mb-4">
						<h2 class="text-sm sm:text-base font-semibold text-[#FF613c]">Facilities</h2>
						<!-- <button @click="openEditModal('facilities')"
							class="text-xs bg-[#FF613c] text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-[#FF613c]/90 whitespace-nowrap">
							<PencilSquareIcon class="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1" /> Edit
						</button> -->
					</div>
					<div
						class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-lg min-h-[200px] sm:min-h-[300px]"
						>
						<div v-for="facility in detail.facilities" :key="facility.id"
							class="text-xs sm:text-sm text-gray-700 flex items-center truncate p-2 rounded">
							<img :src="facility.image" alt="" class="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" />
							<span class="truncate">{{ facility.name }}</span>
						</div>
					</div>
				</section>

				<!-- Location Section -->
				<section id="location" v-if="detail?.location_map_title || detail?.place" class="mb-6 sm:mb-8 scroll-mt-4">
					<div class="flex justify-between items-center mb-3 sm:mb-4">
						<h2 class="text-sm sm:text-base font-semibold text-[#FF613c]">Location</h2>
					</div>
					<div class="space-y-2 text-xs sm:text-sm">
						<p v-if="detail?.place" class="text-gray-700 p-4 sm:p-6 bg-gray-50 rounded-lg" style="border: 1px solid #e5e7eb">
							{{ detail.place }}
						</p>
						<p v-if="detail?.location_map_title" class="text-gray-600 px-4 sm:px-6">
							{{ detail.location_map_title }}
						</p>
						<div v-if="detail?.location_map" class="mt-3 sm:mt-4" style="border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden">
							<iframe :src="detail.location_map" class="w-full h-48 sm:h-80" style="border: 0"
								allowfullscreen="" loading="lazy"></iframe>
						</div>
					</div>
				</section>

				<!-- Check-in & Check-out Section  -->
				<section id="hours" v-if="detail?.check_in || detail?.check_out" class="mb-6 sm:mb-8 scroll-mt-4">
					<div class="flex justify-between items-center mb-3 sm:mb-4">
						<h2 class="text-sm sm:text-base font-semibold text-[#FF613c]">Check-in & Check-out</h2>
						<!-- <button @click="openEditModal('hours')"
							class="text-xs bg-[#FF613c] text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-[#FF613c]/90 whitespace-nowrap">
							<PencilSquareIcon class="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1" /> Edit
						</button> -->
					</div>
					<div class="bg-gray-50 p-4 sm:p-6 rounded-lg min-h-[200px] sm:min-h-[300px]">
						<div class="space-y-4 sm:space-y-6 text-xs sm:text-sm">
							<div v-if="detail?.check_in"
								class="flex items-center justify-between pb-3 sm:pb-4" style="border-bottom: 1px solid #e5e7eb">
								<div class="flex items-center space-x-2 sm:space-x-3">
									<div
										class="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0" style="border: 1px solid #d1fae5">
										<svg class="w-4 h-4 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor"
											viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1">
											</path>
										</svg>
									</div>
									<div>
										<span class="block text-base sm:text-lg font-semibold text-gray-700">Check-in</span>
										<span class="text-gray-500 text-xs">Arrival time</span>
									</div>
								</div>
								<span class="text-lg sm:text-xl font-bold text-[#FF613c]">{{ detail.check_in }}</span>
							</div>
							<div v-if="detail?.check_out" class="flex items-center justify-between">
								<div class="flex items-center space-x-2 sm:space-x-3">
									<div
										class="w-8 h-8 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0" style="border: 1px solid #fee2e2">
										<svg class="w-4 h-4 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor"
											viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
											</path>
										</svg>
									</div>
									<div>
										<span class="block text-base sm:text-lg font-semibold text-gray-700">Check-out</span>
										<span class="text-gray-500 text-xs">Departure time</span>
									</div>
								</div>
								<span class="text-lg sm:text-xl font-bold text-[#FF613c]">{{ detail.check_out }}</span>
							</div>
						</div>
					</div>
				</section>

				<!-- Cancellation Policy Section (Editable) -->
				<section id="policy" v-if="detail?.cancellation_policy" class="mb-6 sm:mb-8 scroll-mt-4">
					<div class="flex justify-between items-center mb-3 sm:mb-4">
						<h2 class="text-sm sm:text-base font-semibold text-[#FF613c]">Cancellation Policy</h2>
						<!-- <button @click="openEditModal('policy')"
							class="text-xs bg-[#FF613c] text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-[#FF613c]/90 whitespace-nowrap">
							<PencilSquareIcon class="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1" /> Edit
						</button> -->
					</div>
					<div class="bg-white rounded-lg min-h-[200px] sm:min-h-[300px]">
						<div class="bg-gray-50 p-4 sm:p-6 rounded-lg mb-4">
							<p class="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line overflow-x-auto">
								{{ detail.cancellation_policy }}
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { PencilSquareIcon, TrashIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import Modal from "../../../components/Modal.vue";
import { MapPinIcon } from "@heroicons/vue/24/solid";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { useHotelStore } from "../../../stores/hotel";

const hotelStore = useHotelStore();

const props = defineProps({
	detail: {
		type: Object,
		required: true,
	},
});

const emit = defineEmits(["update"]);

const activeSection = ref("description");
const loading = ref(false);
const editModal = ref({
	isOpen: false,
	type: null,
});

const editData = ref({});
const availableFacilities = ref([]);
const selectedFacilities = ref([]);

const setActiveSection = (section) => {
	activeSection.value = section;
};

const scrollToSection = (sectionId) => {
	const section = document.getElementById(sectionId);
	if (section) {
		section.scrollIntoView({ behavior: "smooth" });
	}
};

const openEditModal = async (type) => {
	window.open(`/product/hotel/edit/${props.detail.id}`, "_blank");
};

const searchFacilities = ref("");
const filteredFacilities = computed(() => {
	if (!searchFacilities.value) {
		return availableFacilities.value;
	}
	return availableFacilities.value.filter((facility) =>
		facility.name.toLowerCase().includes(searchFacilities.value.toLowerCase())
	);
});


onMounted(() => {
	const sections = document.querySelectorAll("section[id]");

	if (sections.length === 0) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
					activeSection.value = entry.target.id;
				}
			});
		},
		{
			threshold: 0.5,
			rootMargin: "-50px 0px -50px 0px",
		}
	);

	sections.forEach((section) => {
		observer.observe(section);
	});

	return () => {
		sections.forEach((section) => {
			observer.unobserve(section);
		});
	};
});
</script>

<style scoped>
@media (max-width: 640px) {
	select {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 0.75rem center;
		background-size: 1em;
	}

	.truncate {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.overflow-x-auto {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}
}
</style>