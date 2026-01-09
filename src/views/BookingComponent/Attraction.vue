<script setup>
import { ref, onMounted, watch, computed, defineEmits } from "vue";
import { MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import { MapPinIcon } from "@heroicons/vue/24/solid";
import { useEntranceStore } from "../../stores/entrance";
import { storeToRefs } from "pinia";
import debounce from "lodash/debounce";
import Modal from "../../components/Modal.vue";
import AttractionImage from "../../assets/attractions icon.svg";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";

// Mobile states
const showProductFilter = ref(false);
// const searchQuery = ref("");
const isScrolling = ref(false);
const currentPage = ref(1);
const hasMore = ref(true);

const entranceStore = useEntranceStore();
const { entrances, loading } = storeToRefs(entranceStore);
const productList = ref([]);
const search = ref("");

const emit = defineEmits(["formData"]);

const props = defineProps({
	searchQuery: {
		type: String,
		default: "",
	},
});

const formitem = ref({
	product_type: 4,
	product_id: "",
	product_name: "",
	product_image: "",
	item_name: "",
	car_id: "",
	car_list: [],
	child_info: [],
	individual_pricing: {
		adult: {
			quantity: 0,
			selling_price: 0,
			cost_price: 0,
			total_cost_price: 0,
			amount: 0,
		},
		child: {
			quantity: 0,
			selling_price: 0,
			cost_price: 0,
			total_cost_price: 0,
			amount: 0,
		},
	},
	service_date: "",
	quantity: 0,
	discount: 0,
	selling_price: "",
	comment: "",
	total_amount: "",
});

// Filtered products
const filteredProducts = computed(() => {
	let filtered = productList.value;

	if (props.searchQuery) {
		const query = props.searchQuery?.toLowerCase();
		filtered = filtered.filter(
			(product) => product.name.toLowerCase().includes(query) || product.description?.toLowerCase().includes(query)
		);
	}

	return filtered;
});

// Infinite scroll handler
const handleScroll = (event) => {
	const element = event.target;
	const isBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 100;

	if (isBottom && !loading.value && hasMore.value && !isScrolling.value) {
		isScrolling.value = true;
		currentPage.value++;
		loadMoreProducts();
	}
};

const loadMoreProducts = async () => {
	try {
		await entranceStore.getListAction({
			search: search.value,
			limit: 20,
			page: currentPage.value,
		});

		if (entrances.value?.data) {
			productList.value = [...productList.value, ...entrances.value.data];
			hasMore.value = entrances.value.meta.current_page < entrances.value.meta.last_page;
		}
	} finally {
		isScrolling.value = false;
	}
};

const getLowestPrice = (product) => {
	if (!product.variations || product.variations.length === 0) return 0;
	return Math.min(...product.variations.map((v) => v.price || 0));
};

const getDiscountPrice = (product) => {
	const basePrice = getLowestPrice(product);
	return basePrice > 500 ? basePrice * 0.9 : null; // 10% discount if price > 500 (testing)
};

const truncateText = (text, maxLength) => {
	if (!text) return "";
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + "...";
};

// Format price
const formatPrice = (price) => {
	return new Intl.NumberFormat("en-US").format(price);
};

// Add item function
const openAddItemModal = (product) => {
	formitem.value.product_id = product.id;
	formitem.value.product_name = product.name;
	formitem.value.product_image = product.cover_image;
	if (product?.variations?.length > 0) {
		formitem.value.car_list = product.variations;
	}

	showVariationModal.value = true;
};

const selectVariation = (variation) => {
	formitem.value.car_id = variation.id;
	formitem.value.item_name = variation.name;
	formitem.value.selling_price = variation.price;
	formitem.value.cost_price = variation.cost_price || 0;
	formitem.value.child_info = variation.child_info ? JSON.parse(variation.child_info) : [];
	formitem.value.comment = `Variation: ${variation.name}`;

	showVariationModal.value = false;
	showBookingInfoModal.value = true;
};

const submitBookingInfo = () => {
	const adultTotal = formitem.value.quantity * formitem.value.selling_price;
	const childTotal =
		formitem.value.individual_pricing.child.quantity * (formitem.value.individual_pricing.child.selling_price || 0);

	formitem.value.total_amount = adultTotal + childTotal - formitem.value.discount;

	emit("formData", formitem.value);

	// Reset form
	formitem.value = {
		product_type: 4,
		product_id: "",
		product_name: "",
		product_image: "",
		item_name: "",
		car_id: "",
		car_list: [],
		child_info: [],
		individual_pricing: {
			adult: {
				quantity: 0,
				selling_price: 0,
				cost_price: 0,
				total_cost_price: 0,
				amount: 0,
			},
			child: {
				quantity: 0,
				selling_price: 0,
				cost_price: 0,
				total_cost_price: 0,
				amount: 0,
			},
		},
		service_date: "",
		quantity: 0,
		discount: 0,
		selling_price: "",
		comment: "",
		total_amount: "",
	};

	showBookingInfoModal.value = false;
};

// Modals
const showVariationModal = ref(false);
const showBookingInfoModal = ref(false);
const todayVali = ref(true);

const checkDateValidity = () => {
	if (!formitem.value.service_date) {
		todayVali.value = true;
		return;
	}

	const today = new Date();
	const selectedDate = new Date(formitem.value.service_date);
	today.setHours(0, 0, 0, 0);
	selectedDate.setHours(0, 0, 0, 0);

	todayVali.value = selectedDate >= today;
};

// Watch child quantity changes
watch(
	() => formitem.value.individual_pricing.child.quantity,
	(newValue) => {
		if (formitem.value.child_info.length > 0) {
			const childInfo = formitem.value.child_info[0];
			formitem.value.individual_pricing.child.selling_price = childInfo.child_price || 0;
			formitem.value.individual_pricing.child.cost_price = childInfo.child_cost_price || 0;
			formitem.value.individual_pricing.child.total_cost_price = newValue * (childInfo.child_cost_price || 0);
			formitem.value.individual_pricing.child.amount = newValue * (childInfo.child_price || 0);
		}
	}
);

onMounted(async () => {
	await entranceStore.getListAction({
		search: search.value,
		limit: 20,
		page: 1,
	});

	if (entrances.value?.data) {
		productList.value = entrances.value.data;
		hasMore.value = entrances.value.meta.current_page < entrances.value.meta.last_page;
	}
});

watch(
	[search],
	debounce(async () => {
		currentPage.value = 1;
		productList.value = [];

		await entranceStore.getListAction({
			search: search.value,
			limit: 20,
			page: 1,
		});

		if (entrances.value?.data) {
			productList.value = entrances.value.data;
			hasMore.value = entrances.value.meta.current_page < entrances.value.meta.last_page;
		}
	}, 500)
);
</script>

<template>
	<div class="space-y-4 mt-4">
		<!-- Sticky Filter & Search Header -->
		<!-- <div class="sticky top-0 z-10 bg-white border-b border-gray-300 pb-3">
      <div class="flex items-center gap-2 mb-3">
        <div class="relative flex-1">
          <button
            @click="showProductFilter = !showProductFilter"
            class="flex items-center justify-between w-full px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none"
          >
            <span class="truncate">Attractions</span>
            <ChevronDownIcon class="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      <div class="relative">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search attractions..."
          class="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-full focus:outline-none focus:border-[#ff613c]"
        />
      </div>
    </div> -->

		<!-- Product Count -->
		<!-- <div class="px-1">
      <p class="text-xs text-gray-600">
        Showing {{ filteredProducts.length }} products
      </p>
    </div> -->

		<div
			class="grid grid-cols-2 gap-3 overflow-y-auto no-scrollbar"
			style="max-height: calc(100vh - 200px)"
			@scroll="handleScroll"
		>
			<div v-for="product in filteredProducts" :key="product.id" class="bg-white rounded-3xl overflow-hidden mb-4">
				<!-- Product Image -->
				<div class="relative h-40 rounded-3xl overflow-hidden">
					<img
						:src="product.cover_image || 'https://placehold.co/400'"
						:alt="product.name"
						class="w-full h-full object-cover"
					/>

					<!-- Floating Add Button -->
					<button
						@click.stop="openAddItemModal(product)"
						class="absolute bottom-3 right-3 w-9 h-9 bg-[#ff613c] rounded-full flex items-center justify-center shadow-lg"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-5 h-5 text-white"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
					</button>
				</div>

				<!-- Product Details -->
				<div class="pt-3 px-1">
					<!-- Product Name -->
					<h3 class="text-sm leading-snug truncate">
						{{ truncateText(product.name, 20) }}
					</h3>

					<!-- Location -->
					<div class="flex items-center gap-1 mt-1 text-[11px] text-gray-500">
						<MapPinIcon class="w-3 h-3 text-[#595959]" />
						<span class="line-clamp-1">
							{{ "Bangkok" }}
						</span>
						<svg
							class="w-4 h-4 text-[#595959]"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle cx="12" cy="12" r="8" stroke-width="2" />

							<circle cx="12" cy="4" r="1.25" fill="currentColor" />
							<circle cx="17.7" cy="6.3" r="1.25" fill="currentColor" />
							<circle cx="20" cy="12" r="1.25" fill="currentColor" />
							<circle cx="17.7" cy="17.7" r="1.25" fill="currentColor" />
							<circle cx="12" cy="20" r="1.25" fill="currentColor" />
							<circle cx="6.3" cy="17.7" r="1.25" fill="currentColor" />
							<circle cx="4" cy="12" r="1.25" fill="currentColor" />
							<circle cx="6.3" cy="6.3" r="1.25" fill="currentColor" />
							<circle cx="12" cy="11" r="2" stroke-width="2" />

							<path d="M9 20L12 13L15 20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />

							<circle cx="12" cy="20" r="1.25" fill="currentColor" />
						</svg>
						<span>Marine Park</span>
					</div>

					<!-- Price -->
					<div class="mt-2 flex items-center gap-2">
						<!-- Discount price first -->
						<span class="text-md font-semibold text-[#ff613c]">
							<span class="ps-0.5">฿</span> {{ formatPrice(getDiscountPrice(product) || getLowestPrice(product)) }}
						</span>

						<!-- Original price -->
						<span v-if="getDiscountPrice(product)" class="text-[10px] text-gray-400 line-through">
							<!-- ฿ {{ formatPrice(getLowestPrice(product)) }} -->
							฿ {{ product.lowest_variation_price }}
						</span>
					</div>
				</div>
			</div>

			<!-- Loading -->
			<div v-if="loading" class="col-span-2 py-4 text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff613c]"></div>
				<p class="text-xs text-gray-500 mt-2">Loading products...</p>
			</div>

			<!-- No Products Found -->
			<div v-if="!loading && filteredProducts.length === 0" class="col-span-2 py-8 text-center">
				<p class="text-gray-500 text-sm">No attractions found</p>
			</div>
		</div>

		<!-- Variation Selection Modal -->
		<Modal :isOpen="showVariationModal" @closeModal="showVariationModal = false">
			<DialogPanel
				class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
			>
				<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-3"> Select Ticket Type </DialogTitle>

				<div class="max-h-96 overflow-y-auto space-y-2">
					<div
						v-for="variation in formitem.car_list"
						:key="variation.id"
						@click="selectVariation(variation)"
						:class="[
							'p-3 border rounded-lg cursor-pointer transition-all',
							formitem.car_id === variation.id
								? 'border-[#ff613c] bg-[#ff613c]/5'
								: 'border-gray-200 hover:border-gray-300',
						]"
					>
						<div class="flex items-start gap-3">
							<img
								:src="variation.image_links?.[0]?.image || 'https://placehold.co/400'"
								class="w-16 h-16 object-cover rounded-lg"
								alt=""
							/>
							<div class="flex-1">
								<h4 class="text-sm font-semibold text-gray-800">{{ variation.name }}</h4>
								<p class="text-xs text-gray-600 mt-1 line-clamp-2">
									{{ variation.description || "No description" }}
								</p>
								<div class="mt-2">
									<span class="text-sm font-bold text-gray-900"> {{ formatPrice(variation.price) }} THB </span>
									<span class="text-xs text-gray-500 ml-1">per ticket</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="mt-4 flex justify-end space-x-3">
					<button
						@click="showVariationModal = false"
						class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
					>
						Cancel
					</button>
				</div>
			</DialogPanel>
		</Modal>

		<!-- Booking Information Modal -->
		<Modal :isOpen="showBookingInfoModal" @closeModal="showBookingInfoModal = false">
			<DialogPanel
				class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
			>
				<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-3"> Ticket Details </DialogTitle>

				<div class="space-y-4 max-h-96 overflow-y-auto">
					<!-- Service Date -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Visit Date * </label>
						<input
							type="date"
							v-model="formitem.service_date"
							@change="checkDateValidity"
							:class="[
								'w-full px-3 py-2 text-sm border rounded-lg focus:outline-none',
								todayVali ? 'border-gray-300' : 'border-red-500',
							]"
						/>
						<p v-if="!todayVali" class="mt-1 text-xs text-red-500">Please select a future date</p>
					</div>

					<!-- Adult Tickets -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Adult Tickets * </label>
						<div class="relative">
							<input
								type="number"
								v-model="formitem.quantity"
								min="0"
								class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff613c]"
							/>
							<div class="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
								<button
									@click="formitem.quantity++"
									class="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
								>
									+
								</button>
								<button
									@click="formitem.quantity > 0 ? formitem.quantity-- : null"
									class="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
								>
									-
								</button>
							</div>
						</div>
						<p class="text-xs text-gray-500 mt-1">Price: {{ formatPrice(formitem.selling_price) }} THB each</p>
					</div>

					<!-- Child Tickets (if available) -->
					<div v-if="formitem.child_info.length > 0">
						<label class="block text-sm font-medium text-gray-700 mb-1"> Child Tickets </label>
						<div class="relative">
							<input
								type="number"
								v-model="formitem.individual_pricing.child.quantity"
								min="0"
								class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff613c]"
							/>
							<div class="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
								<button
									@click="formitem.individual_pricing.child.quantity++"
									class="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
								>
									+
								</button>
								<button
									@click="
										formitem.individual_pricing.child.quantity > 0 ? formitem.individual_pricing.child.quantity-- : null
									"
									class="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
								>
									-
								</button>
							</div>
						</div>
						<p class="text-xs text-gray-500 mt-1">
							Price: {{ formatPrice(formitem.individual_pricing.child.selling_price) }} THB each
						</p>
						<p class="text-xs text-gray-400 mt-1">Age: {{ formitem.child_info[0]?.age_range || "Child age range" }}</p>
					</div>

					<!-- Discount -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Discount </label>
						<input
							type="number"
							v-model="formitem.discount"
							min="0"
							class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff613c]"
						/>
					</div>

					<!-- Special Request -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Special Request </label>
						<textarea
							v-model="formitem.special_request"
							rows="2"
							placeholder="Enter special requests..."
							class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff613c]"
						></textarea>
					</div>

					<!-- Total Price Display -->
					<div class="p-3 bg-gray-50 rounded-lg border border-gray-300">
						<div class="flex justify-between items-center">
							<span class="text-sm font-medium text-gray-700">Total:</span>
							<span class="text-lg font-bold text-[#ff613c]"> {{ formatPrice(formitem.total_amount) }} THB </span>
						</div>
					</div>
				</div>

				<div class="mt-4 flex justify-end space-x-3">
					<button
						@click="showBookingInfoModal = false"
						class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
					>
						Cancel
					</button>
					<button
						@click="submitBookingInfo"
						:disabled="!todayVali || !formitem.service_date || formitem.quantity === 0"
						:class="[
							'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
							todayVali && formitem.service_date && formitem.quantity > 0
								? 'bg-[#ff613c] hover:bg-[#ff5b00]'
								: 'bg-gray-300 cursor-not-allowed',
						]"
					>
						Add to Cart
					</button>
				</div>
			</DialogPanel>
		</Modal>
	</div>
</template>

<style scoped>
.no-scrollbar {
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.no-scrollbar::-webkit-scrollbar {
	display: none;
}

.line-clamp-1 {
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
}

.line-clamp-2 {
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
</style>
