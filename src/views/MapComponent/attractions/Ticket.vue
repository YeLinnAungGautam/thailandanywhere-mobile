<template>
	<div class="flex flex-col sm:flex-row min-h-[62vh] sm:h-[62vh] bg-white">
		<!-- Ticket Selection Dropdown -->
		<div class="sm:hidden  border-gray-200 py-3 sticky top-0 z-10 bg-white">
			<select v-model="selectedVariationMobile" @change="handleVariationSelect"
				class="w-full text-sm border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent" style="border: 1px solid #d1d5db">
				<option value="ticket">Ticket: {{ detail.name }}</option>
				<option v-for="variation in variations" :key="variation.id" :value="variation.id">
					Variation: {{ variation.name }}
				</option>
			</select>
		</div>

		<!--Ticket List-->
		<div class="hidden sm:block w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
			<div class="p-4">
				<div class="flex justify-between items-center mb-4">
					<h2 class="text-base font-semibold text-[#FF613c]">Ticket</h2>
				</div>
				<div v-if="variations.length > 0" class="space-y-2">
					<div @click="selectVariation('ticket')" :class="[
						'p-3 rounded-lg border cursor-pointer transition-all hover:border-[#FF613c]',
						selectedVariation == 'ticket' ? 'border-[#FF613c] bg-[#FF613c]/5' : 'border-gray-200 bg-white',
					]">
						<div class="flex-1 min-w-0">
							<h3 class="text-sm font-medium text-gray-900 truncate">
								{{ detail.name }}
							</h3>
							<div class="flex items-center mt-2 space-x-2">
								<div class="flex items-center space-x-1">
									<div :class="[
										'w-2 h-2 rounded-full',
										detail.images && detail.images.length > 0 ? 'bg-green-400' : 'bg-red-400',
									]"></div>
									<span class="text-xs text-gray-500"> {{ detail.images?.length || 0 }} images </span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="flex justify-between items-center mb-4 mt-4">
					<h2 class="text-base font-semibold text-[#FF613c]">Ticket Variations</h2>
					<span class="text-xs text-gray-500">{{ variations.length }} types</span>
				</div>

				<!-- Loading State -->
				<div v-if="loading" class="flex justify-center py-8">
					<div class="animate-spin h-8 w-8 border-4 border-[#FF613c] border-t-transparent rounded-full"></div>
				</div>

				<!-- Ticket List -->
				<div v-else-if="variations.length > 0" class="space-y-2">
					<div v-for="variation in variations" :key="variation.id" @click="selectVariation(variation)" :class="[
						'p-3 rounded-lg border cursor-pointer transition-all hover:border-[#FF613c]',
						selectedVariation?.id === variation.id ? 'border-[#FF613c] bg-[#FF613c]/5' : 'border-gray-200 bg-white',
					]">
						<div class="flex items-start justify-between">
							<div class="flex-1 min-w-0">
								<h3 class="text-sm font-medium text-gray-900 truncate">
									{{ variation.name }}
								</h3>
								<p class="text-xs text-gray-500 mt-1 truncate">
									{{ variation.description || "No description" }}
								</p>
								<div class="flex items-center mt-2 space-x-3">
									<div class="flex items-center space-x-1">
										<span class="text-sm font-semibold text-[#FF613c] truncate">{{ variation.price }} THB</span>
									</div>
									<div v-if="variation.walk_in_price && variation.walk_in_price !== 'null'"
										class="flex items-center space-x-1">
										<span class="text-xs text-gray-500 truncate">Walk-in: {{ variation.walk_in_price }} THB</span>
									</div>
								</div>
							</div>
							<div v-if="selectedVariation?.id === variation.id" class="ml-2 flex-shrink-0">
								<div class="w-2 h-2 bg-[#FF613c] rounded-full"></div>
							</div>
						</div>
					</div>
				</div>

				<!-- Empty Section -->
				<div v-else class="text-center py-8">
					<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z">
						</path>
					</svg>
					<p class="mt-2 text-sm text-gray-600">No ticket variations found</p>
					<p class="text-xs text-gray-400 mt-1">This cruise has no ticket types yet</p>
				</div>
			</div>
		</div>

		<!-- Variation Details -->
		<div class="flex-1 overflow-y-auto">
			<div class="py-4 sm:p-6">
				<div v-if="!selectedVariation || selectedVariation === 'null'"
					class="flex items-center justify-center h-full min-h-[300px]">
					<div class="text-center">
						<svg class="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300" fill="none" stroke="currentColor"
							viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z">
							</path>
						</svg>
						<h3 class="mt-4 text-base sm:text-lg font-medium text-gray-900">Select a Ticket Type</h3>
						<p class="mt-2 text-xs sm:text-sm text-gray-500">Choose a ticket variation from the list to view details</p>
					</div>
				</div>

				<div v-if="selectedVariation == 'ticket'">
					<div class="mt-4 sm:mt-6">
						<h3 class="text-sm font-semibold text-gray-700 mb-3">Ticket Images ({{ detail?.images?.length || 0 }})</h3>
						<div v-if="detail?.images && detail?.images.length > 0"
							class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
							<div v-for="(image, index) in detail?.images" :key="image.id" class="relative group">
								<img :src="image.image" :alt="`Room image ${index + 1}`" style="border: 1px solid #d1d5db"
									class="w-full h-24 sm:h-32 object-cover rounded-lg border border-gray-200" />
							</div>
						</div>
					</div>
				</div>

				<div v-if="selectedVariation != 'ticket' && selectedVariation?.id">
					<!-- Variation Header -->
					<div class="flex justify-between items-start mb-4 sm:mb-6">
						<div class="pr-2 min-w-0">
							<h1 class="text-lg sm:text-xl font-semibold text-gray-900 truncate">
								{{ selectedVariation?.name }}
							</h1>
							<p class="text-xs sm:text-sm text-gray-500 mt-1">Ticket ID: {{ selectedVariation?.id }}</p>
						</div>
					</div>

					<!-- Pricing Information -->
					<div class="bg-gradient-to-br from-[#FF613c]/10 to-[#FF613c]/5 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
						<h3 class="text-sm font-semibold text-gray-700 mb-3 sm:mb-4">Pricing Information</h3>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
							<div class="bg-white p-3 sm:p-4 rounded-lg">
								<p class="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Online Price</p>
								<p class="text-xl sm:text-2xl font-bold text-[#FF613c] truncate">{{ selectedVariation?.price }} THB</p>
							</div>
							<div v-if="selectedVariation?.walk_in_price && selectedVariation?.walk_in_price !== 'null'"
								class="bg-white p-3 sm:p-4 rounded-lg">
								<p class="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Walk-in Price</p>
								<p class="text-xl sm:text-2xl font-bold text-gray-700 truncate">
									{{ selectedVariation?.walk_in_price }} THB
								</p>
							</div>
						</div>
					</div>

					<!-- Description -->
					<div class="bg-gray-50 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
						<h3 class="text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Description</h3>
						<p class="text-xs sm:text-sm text-gray-600 leading-relaxed overflow-x-auto">
							{{ selectedVariation?.description || "No description available" }}
						</p>
					</div>

					<!-- Additional Information -->
					<div class="bg-gray-50 p-4 sm:p-6 rounded-lg">
						<h3 class="text-sm font-semibold text-gray-700 mb-3 sm:mb-4">Additional Information</h3>
						<div class="space-y-2 sm:space-y-3 text-xs sm:text-sm">
							<div
								class="flex flex-col sm:flex-row sm:items-center justify-between pb-2 sm:pb-3" style="border-bottom: 1px solid #d1d5db">
								<span class="text-gray-500 mb-1 sm:mb-0">Variation Type</span>
								<span class="text-gray-900 font-medium truncate">{{ selectedVariation?.name }}</span>
							</div>
							<div class="flex flex-col sm:flex-row sm:items-center justify-between">
								<span class="text-gray-500 mb-1 sm:mb-0">Status</span>
								<span :class="[
									'px-2 py-1 rounded-full text-xs font-medium mt-1 sm:mt-0 flex-shrink-0',
									selectedVariation?.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700',
								]">
									{{ selectedVariation?.is_active ? "Active" : "Inactive" }}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";

const props = defineProps({
	detail: {
		type: Object,
		required: true,
	},
});

const loading = ref(false);
const selectedVariation = ref(null);
const selectedVariationMobile = ref("ticket");

const variations = computed(() => {
	return props.detail?.variations || [];
});


watch(selectedVariation, (newValue) => {
	if (newValue === "ticket") {
		selectedVariationMobile.value = "ticket";
	} else if (newValue && newValue.id) {
		selectedVariationMobile.value = newValue.id;
	}
});

const handleVariationSelect = () => {
	const value = selectedVariationMobile.value;
	if (value === "ticket") {
		selectVariation("ticket");
	} else {
		const variation = variations.value.find((v) => v.id === parseInt(value));
		if (variation) {
			selectVariation(variation);
		}
	}
};

const selectVariation = (variation) => {
	selectedVariation.value = variation;
};

onMounted(() => {
	if (variations.value.length > 0) {
		selectedVariation.value = "ticket";
		selectedVariationMobile.value = "ticket";
	}
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

	.min-w-0 {
		min-width: 0;
	}

	.overflow-x-auto {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}
}
</style>
