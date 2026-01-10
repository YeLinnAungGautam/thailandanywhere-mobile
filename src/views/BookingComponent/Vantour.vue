<script setup>
import { ref, onMounted, watch, computed, defineEmits, defineProps } from "vue";
import { MagnifyingGlassIcon, BarsArrowDownIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import { MapPinIcon } from "@heroicons/vue/24/solid";
import { useVantourStore } from "../../stores/vantour";
import { storeToRefs } from "pinia";
import debounce from "lodash/debounce";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import van from "../../../public/1.png";
import saloon from "../../../public/2.png";
import deluxe from "../../../public/3.png";

// Mobile states
const showProductFilter = ref(false);
const isScrolling = ref(false);
const currentPage = ref(1);
const hasMore = ref(true);

const vantourStore = useVantourStore();
const { vantours, loading } = storeToRefs(vantourStore);
const productList = ref([]);
const type = ref("van_tour");

const emit = defineEmits(["formData"]);

const props = defineProps({
	searchQuery: {
		type: String,
		default: "",
	},
});
const search = ref("");
const formitem = ref({
	reservation_id: null,
	product_type: 1,
	product_id: "",
	product_name: "",
	product_image: "",
	item_name: "",
	car_id: "",
	car_list: [],
	service_date: "",
	quantity: "1",
	discount: 0,
	days: "",
	duration: "",
	selling_price: "",
	comment: "",
	reservation_status: "",
	payment_method: "",
	payment_status: "",
	amount: "",
	exchange_rate: "",
	cost_price: "",
	special_request: "",
	total_amount: "",
	pickup_location: "",
	pickup_time: "",
	is_driver_collect: "",
	dropoff_location: "",
	route_plan: "",
});

const filteredProducts = computed(() => {
	return productList.value;
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
		await vantourStore.getListAction({
			search: search.value, 
			type: type.value,
			limit: 20,
			page: currentPage.value,
		});

		if (vantours.value?.data) {
			productList.value = [...productList.value, ...vantours.value.data];
			hasMore.value = vantours.value.meta.current_page < vantours.value.meta.last_page;
		}
	} finally {
		isScrolling.value = false;
	}
};

const handleSearch = debounce(async () => {
	currentPage.value = 1;
	productList.value = [];

	try {
		await vantourStore.getListAction({
			search: search.value,
			type: type.value,
			limit: 20,
			page: currentPage.value,
		});

		if (vantours.value?.data) {
			productList.value = vantours.value.data;
			hasMore.value = vantours.value.meta.current_page < vantours.value.meta.last_page;
		}
	} catch (error) {
		console.error("Search error:", error);
	}
}, 500);

// Add item function
const openAddItemModal = (product) => {
	formitem.value.product_id = product.id;
	formitem.value.product_name = product.name;
	formitem.value.product_image = product.cover_image;
	if (product?.cars?.length > 0) {
		formitem.value.car_list = product.cars;
	}

	// Show variation selection modal
	showVariationModal.value = true;
};

const selectVariation = (variation) => {
	formitem.value.car_id = variation.id;
	formitem.value.item_name = variation.name;
	formitem.value.selling_price = variation.price;
	formitem.value.cost_price = variation.cost_price || 0;
	formitem.value.comment = `Car Type: ${variation.name}`;

	// Show booking info modal
	showVariationModal.value = false;
	showBookingInfoModal.value = true;
};

const submitBookingInfo = () => {
	formitem.value.total_amount = formitem.value.selling_price * formitem.value.quantity - formitem.value.discount;
	formitem.value.total_cost_price = formitem.value.quantity * formitem.value.cost_price;

	emit("formData", formitem.value);

	// Reset form
	formitem.value = {
		reservation_id: null,
		product_type: 1,
		product_id: "",
		product_name: "",
		product_image: "",
		item_name: "",
		car_id: "",
		car_list: [],
		service_date: "",
		quantity: "1",
		discount: 0,
		days: "",
		duration: "",
		selling_price: "",
		comment: "",
		reservation_status: "",
		payment_method: "",
		payment_status: "",
		amount: "",
		exchange_rate: "",
		cost_price: "",
		special_request: "",
		total_amount: "",
		pickup_location: "",
		pickup_time: "",
		is_driver_collect: "",
		dropoff_location: "",
		route_plan: "",
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

// Format price
const formatPrice = (price) => {
	return new Intl.NumberFormat("en-US").format(price);
};

// Get lowest car price
const getLowestPrice = (product) => {
	if (!product.cars || product.cars.length === 0) return 0;
	return Math.min(...product.cars.map((car) => car.price || 0));
};

const truncateText = (text, maxLength) => {
	if (!text) return "";
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + "...";
};

const getCarImage = (type) => {
	// Define the car images for each van tour type
	const carImages = {
		car1: van,
		car2: saloon,
		car3: deluxe,
	};

	switch (type) {
		case "SUV":
			return carImages["car2"];
		case "Saloon":
			return carImages["car1"];
		case "VIP Van":
			return carImages["car2"];
		default:
			return carImages["car2"];
	}
};

const getDiscountPrice = (product) => {
	const basePrice = getLowestPrice(product);
	return basePrice > 1000 ? basePrice * 0.9 : null; // 10% discount if price > 1000 (testing)
};

onMounted(async () => {
	await vantourStore.getListAction({
		search: search.value,
		type: type.value,
		limit: 20,
		page: 1,
	});

	if (vantours.value?.data) {
		productList.value = vantours.value.data;
		hasMore.value = vantours.value.meta.current_page < vantours.value.meta.last_page;
	}
});

//search 
watch(
	() => props.searchQuery,
	(newValue) => {
		search.value = newValue;
		handleSearch();
	},
	{ immediate: true }
);

watch(
	[search, type],
	debounce(async () => {
		if (search.value === "" && currentPage.value === 1) return;

		currentPage.value = 1;
		productList.value = [];

		await vantourStore.getListAction({
			search: search.value,
			type: type.value,
			limit: 20,
			page: 1,
		});

		if (vantours.value?.data) {
			productList.value = vantours.value.data;
			hasMore.value = vantours.value.meta.current_page < vantours.value.meta.last_page;
		}
	}, 500)
);
</script>

<template>
	<div class="space-y-4 mt-4">
		<div
			class="grid grid-cols-2 gap-3 overflow-y-auto no-scrollbar"
			style="max-height: calc(100vh - 200px)"
			@scroll="handleScroll"
		>
			<div v-for="product in filteredProducts" :key="product.id" class="bg-white rounded-3xl overflow-hidden mb-4">
				<!-- Image -->
				<div class="relative h-40 rounded-3xl overflow-hidden">
					<img :src="product.cover_image || 'https://placehold.co/400'" class="w-full h-full object-cover" />

					<!-- Add button -->
					<button
						@click.stop="openAddItemModal(product)"
						class="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#ff613c] flex items-center justify-center shadow-md"
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

				<!-- Content -->
				<div class="pt-3 px-1">
					<!-- Name -->
					<p class="text-sm leading-snug truncate">
						{{ truncateText(product.name, 20) }}
					</p>

					<!-- Location -->
					<div class="flex items-center gap-1 mt-1 text-[11px] text-gray-500">
						<MapPinIcon class="w-3 h-3 text-[#595959]" />
						<span>
							{{ product.cities?.[0]?.name || "Bangkok" }}
						</span>
					</div>

					<!-- Price -->
					<div class="mt-2 flex items-center gap-2">
						<span class="text-md font-semibold text-[#ff613c]">
							<span class="ps-0.5">฿</span> {{ product.lowest_car_price }}
						</span>
					</div>
				</div>
			</div>

			<!-- Loading  -->
			<div v-if="loading" class="col-span-2 py-4 text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff613c]"></div>
				<p class="text-xs text-gray-500 mt-2">Loading products...</p>
			</div>

			<div v-if="!loading && filteredProducts.length === 0" class="col-span-2 py-8 text-center">
				<p class="text-gray-500 text-sm">
					<span v-if="search">No vantours found for "{{ search }}"</span>
					<span v-else>No vantours found</span>
				</p>
			</div>
		</div>

		<!-- Variation Selection Modal -->
		<Modal :isOpen="showVariationModal" @closeModal="showVariationModal = false">
			<DialogPanel
				class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
			>
				<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-3"> Select Car Type </DialogTitle>

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
							<img :src="getCarImage(variation.name)" class="w-16 h-16 object-cover rounded-lg" alt="" />
							<div class="flex-1">
								<h4 class="text-sm font-semibold text-gray-800">{{ variation.name }}</h4>
								<p class="text-xs text-gray-600">{{ variation.max_person }} Pax</p>
								<div class="mt-2">
									<span class="text-sm font-bold text-gray-900"> {{ formatPrice(variation.price) }} THB </span>
									<span class="text-xs text-gray-500 ml-1">per car</span>
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
				<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-3"> Booking Details </DialogTitle>

				<div class="space-y-4 max-h-96 overflow-y-auto">
					<!-- Service Date -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Service Date * </label>
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

					<!-- Pickup Time -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Pickup Time * </label>
						<input
							type="time"
							v-model="formitem.pickup_time"
							class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff613c]"
						/>
					</div>

					<!-- Pickup Location -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Pickup Location * </label>
						<input
							type="text"
							v-model="formitem.pickup_location"
							placeholder="Enter pickup location"
							class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff613c]"
						/>
					</div>

					<!-- Quantity -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Quantity * </label>
						<div class="relative">
							<input
								type="number"
								v-model="formitem.quantity"
								min="1"
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
									@click="formitem.quantity > 1 ? formitem.quantity-- : null"
									class="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
								>
									-
								</button>
							</div>
						</div>
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

					<!-- Route Plan -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Route Plan * </label>
						<textarea
							v-model="formitem.route_plan"
							rows="2"
							placeholder="Enter route plan..."
							class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff613c]"
						></textarea>
					</div>

					<!-- Special Request -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Special Request * </label>
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
							<span class="text-lg font-bold text-[#ff613c]">
								{{ formatPrice(formitem.selling_price * formitem.quantity - formitem.discount) }} THB
							</span>
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
						:disabled="!todayVali || !formitem.service_date || !formitem.pickup_location"
						:class="[
							'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
							todayVali && formitem.service_date && formitem.pickup_location
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
