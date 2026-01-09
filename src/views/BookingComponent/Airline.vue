<script setup>
import { ref, onMounted, watch, computed, defineEmits } from "vue";
import { MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import { MapPinIcon } from "@heroicons/vue/24/solid";
import { useAirLineStore } from "../../stores/airline";
import { storeToRefs } from "pinia";
import debounce from "lodash/debounce";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";

const showProductFilter = ref(false);
const searchQuery = ref("");
const isScrolling = ref(false);
const currentPage = ref(1);
const hasMore = ref(true);

const airlineStore = useAirLineStore();
const { airlines, loading } = storeToRefs(airlineStore);
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
	product_type: 7,
	product_id: "",
	product_name: "",
	product_image: "",
	item_name: "",
	car_id: "",
	car_list: [],
	service_date: "",
	quantity: "1",
	discount: 0,
	selling_price: "",
	comment: "",
	total_amount: "",
	total_cost_price: "",
	special_request: "",
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
		await airlineStore.getListAction({
			search: search.value,
			limit: 20,
			page: currentPage.value,
		});

		if (airlines.value?.data) {
			productList.value = [...productList.value, ...airlines.value.data];
			hasMore.value = airlines.value.meta.current_page < airlines.value.meta.last_page;
		}
	} finally {
		isScrolling.value = false;
	}
};

const getStartingPrice = (product) => {
	if (!product.tickets || product.tickets.length === 0) return product.starting_balance || 0;
	return Math.min(...product.tickets.map((ticket) => ticket.price || 0));
};

const getDiscountPrice = (product) => {
	const basePrice = getStartingPrice(product);
	return basePrice > 3000 ? basePrice * 0.88 : null; // 12% discount if price > 3000 (testing)
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
	if (product?.tickets?.length > 0) {
		formitem.value.car_list = product.tickets;
	}

	showVariationModal.value = true;
};

const selectVariation = (ticket) => {
	formitem.value.car_id = ticket.id;
	formitem.value.item_name = ticket.description || ticket.name;
	formitem.value.selling_price = ticket.price;
	formitem.value.cost_price = ticket.cost_price || 0;
	formitem.value.comment = `Ticket: ${ticket.description || ticket.name}`;

	showVariationModal.value = false;
	showBookingInfoModal.value = true;
};

const submitBookingInfo = () => {
	formitem.value.total_amount = formitem.value.selling_price * formitem.value.quantity - formitem.value.discount;
	formitem.value.total_cost_price = formitem.value.quantity * formitem.value.cost_price;

	emit("formData", formitem.value);

	// Reset form
	formitem.value = {
		product_type: 7,
		product_id: "",
		product_name: "",
		product_image: "",
		item_name: "",
		car_id: "",
		car_list: [],
		service_date: "",
		quantity: "1",
		discount: 0,
		selling_price: "",
		comment: "",
		total_amount: "",
		total_cost_price: "",
		special_request: "",
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

	const extractNumber = (text) => {
		if (!text) return 0;
		const numString = text.replace(/[^0-9.]/g, "");
		return parseFloat(numString) || 0;
	};

	const today = new Date();
	const selectedDate = new Date(formitem.value.service_date);
	today.setHours(0, 0, 0, 0);
	selectedDate.setHours(0, 0, 0, 0);

	todayVali.value = selectedDate >= today;
};

onMounted(async () => {
	await airlineStore.getListAction({
		search: search.value,
		limit: 20,
		page: 1,
	});

	if (airlines.value?.data) {
		productList.value = airlines.value.data;
		hasMore.value = airlines.value.meta.current_page < airlines.value.meta.last_page;
	}
});

watch(
	[search],
	debounce(async () => {
		currentPage.value = 1;
		productList.value = [];

		await airlineStore.getListAction({
			search: search.value,
			limit: 20,
			page: 1,
		});

		if (airlines.value?.data) {
			productList.value = airlines.value.data;
			hasMore.value = airlines.value.meta.current_page < airlines.value.meta.last_page;
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
            <span class="truncate">Airlines</span>
            <ChevronDownIcon class="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      <div class="relative">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search airlines..."
          class="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-full focus:outline-none focus:border-[#ff613c]"
        />
      </div>
    </div> -->

		<!-- Product Count -->
		<!-- <div class="px-1">
      <p class="text-xs text-gray-600">
        Showing {{ filteredProducts.length }} airlines
      </p>
    </div> -->

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

					<div class="mt-1 text-[12px] text-gray-500 line-clamp-2">
						{{ product.description || "Airline service" }}
					</div>

					<!-- Price -->
					<div class="mt-2 flex items-center gap-2">
						<span class="text-md font-semibold text-[#ff613c]">
							<!-- ฿ {{ formatPrice(getDiscountPrice(product) || getStartingPrice(product)) }} -->
							<span class="ps-0.5">
								{{ product.starting_balance?.endsWith("mmk") ? "MMK" : "฿" }}
							</span>
							{{ product.starting_balance || 0 }}
						</span>

						<!-- <span
        v-if="getDiscountPrice(product)"
        class="text-[10px] text-gray-400 line-through"
      >
        ฿ {{ formatPrice(getStartingPrice(product)) }}
      </span> -->
					</div>
				</div>
			</div>

			<!-- Loading  -->
			<div v-if="loading" class="col-span-2 py-4 text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff613c]"></div>
				<p class="text-xs text-gray-500 mt-2">Loading products...</p>
			</div>

			<!-- No Products Found -->
			<div v-if="!loading && filteredProducts.length === 0" class="col-span-2 py-8 text-center">
				<p class="text-gray-500 text-sm">No airlines found</p>
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
						v-for="ticket in formitem.car_list"
						:key="ticket.id"
						@click="selectVariation(ticket)"
						:class="[
							'p-3 border rounded-lg cursor-pointer transition-all',
							formitem.car_id === ticket.id
								? 'border-[#ff613c] bg-[#ff613c]/5'
								: 'border-gray-200 hover:border-gray-300',
						]"
					>
						<div class="flex items-start gap-3">
							<div class="w-16 h-16 bg-blue-50 flex items-center justify-center rounded-lg">
								<span class="text-2xl">✈️</span>
							</div>
							<div class="flex-1">
								<h4 class="text-sm font-semibold text-gray-800">{{ ticket.name }}</h4>
								<p class="text-xs text-gray-600 mt-1 line-clamp-2">
									{{ ticket.description || "Flight ticket" }}
								</p>
								<div class="mt-2">
									<span class="text-sm font-bold text-gray-900"> {{ formatPrice(ticket.price) }} THB </span>
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
				<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-3">
					Flight Booking Details
				</DialogTitle>

				<div class="space-y-4 max-h-96 overflow-y-auto">
					<!-- Travel Date -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Travel Date * </label>
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

					<!-- Ticket Price -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Ticket Price * </label>
						<input
							type="number"
							v-model="formitem.selling_price"
							min="0"
							class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff613c]"
						/>
					</div>

					<!-- Number of Tickets -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Number of Tickets * </label>
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

					<!-- Ticket Details -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Ticket Details </label>
						<textarea
							v-model="formitem.comment"
							rows="2"
							readonly
							class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50"
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
						:disabled="!todayVali || !formitem.service_date || formitem.selling_price <= 0"
						:class="[
							'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
							todayVali && formitem.service_date && formitem.selling_price > 0
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
