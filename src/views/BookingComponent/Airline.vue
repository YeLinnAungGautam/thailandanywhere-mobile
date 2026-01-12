<script setup>
import { ref, onMounted, watch, computed, defineEmits, defineProps } from "vue";
import { MapPinIcon } from "@heroicons/vue/24/solid";
import { useAirLineStore } from "../../stores/airline";
import { storeToRefs } from "pinia";
import debounce from "lodash/debounce";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel } from "@headlessui/vue";

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

// Modal state
const showFullModal = ref(false);
const selectedProduct = ref(null);
const showFullDescription = ref(false);
const todayVali = ref(true);

const formitem = ref({
	product_type: 7,
	product_id: "",
	product_name: "",
	product_image: "",
	item_name: "",
	car_id: "",
	car_list: [],
	service_date: "",
	quantity: 1,
	discount: 0,
	selling_price: "",
	cost_price: "",
	comment: "",
	total_amount: "",
	total_cost_price: "",
	special_request: "",
});

// Total price computed
const totalPrice = computed(() => {
	const basePrice = formitem.value.selling_price * formitem.value.quantity;
	return basePrice - formitem.value.discount;
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

const handleSearch = debounce(async () => {
	currentPage.value = 1;
	productList.value = [];

	try {
		await airlineStore.getListAction({
			search: search.value,
			limit: 20,
			page: currentPage.value,
		});

		if (airlines.value?.data) {
			productList.value = airlines.value.data;
			hasMore.value = airlines.value.meta.current_page < airlines.value.meta.last_page;
		}
	} catch (error) {
		console.error("Search error:", error);
	}
}, 500);

const getStartingPrice = (product) => {
	if (!product.tickets || product.tickets.length === 0) return product.starting_balance || 0;
	return Math.min(...product.tickets.map((ticket) => ticket.price || 0));
};

const getDiscountPrice = (product) => {
	const basePrice = getStartingPrice(product);
	return basePrice > 3000 ? basePrice * 0.88 : null; // 12% discount if price > 3000
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

// Open full modal
const openAddItemModal = (product) => {
	selectedProduct.value = product;
	formitem.value.product_id = product.id;
	formitem.value.product_name = product.name;
	formitem.value.product_image = product.cover_image;

	if (product?.tickets?.length > 0) {
		formitem.value.car_list = product.tickets;
		if (product.tickets[0]) {
			selectTicket(product.tickets[0]);
		}
	} else {
		formitem.value.car_list = [];
		formitem.value.car_id = "";
		formitem.value.item_name = "";
		formitem.value.selling_price = "";
	}

	// Reset form for new selection
	formitem.value.service_date = "";
	formitem.value.quantity = 1;
	formitem.value.discount = 0;
	formitem.value.special_request = "";
	showFullDescription.value = false;
	todayVali.value = true;

	showFullModal.value = true;
};

// Select ticket variation
const selectTicket = (ticket) => {
	formitem.value.car_id = ticket.id;
	formitem.value.item_name = ticket.description || ticket.name;
	formitem.value.selling_price = ticket.price;
	formitem.value.cost_price = ticket.cost_price || 0;
	formitem.value.comment = `Ticket: ${ticket.description || ticket.name}`;
};

// Submit booking
const submitBooking = () => {
	// if (!formitem.value.service_date) {
	// 	alert("Please select a travel date");
	// 	return;
	// }

	// if (!todayVali.value) {
	// 	alert("Travel date must be today or in the future");
	// 	return;
	// }

	if (!formitem.value.selling_price || formitem.value.selling_price <= 0) {
		alert("Please select a valid ticket price");
		return;
	}

	formitem.value.total_amount = totalPrice.value;
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
		quantity: 1,
		discount: 0,
		selling_price: "",
		cost_price: "",
		comment: "",
		total_amount: "",
		total_cost_price: "",
		special_request: "",
	};

	showFullModal.value = false;
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
	() => props.searchQuery,
	(newValue) => {
		search.value = newValue;
		handleSearch();
	},
	{ immediate: true }
);

watch(
	[search],
	debounce(async () => {
		if (search.value === "" && currentPage.value === 1) return;

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
					<!-- Airline Name -->
					<h3 class="text-sm leading-snug truncate">
						{{ truncateText(product.name, 20) }}
					</h3>

					<!-- Description -->
					<div class="flex items-center gap-1 mt-1 text-[11px] text-gray-500">
						<span class="line-clamp-2">
							{{ product.description || "Airline service" }}
						</span>
					</div>

					<!-- Price -->
					<div class="mt-2 flex items-center gap-2">
						<span class="text-md font-semibold text-[#ff613c]">
							<span class="ps-0.5">฿</span> {{ formatPrice(product.starting_balance) }}
						</span>

						<!-- Original price -->
						<span v-if="getDiscountPrice(product)" class="text-[10px] text-gray-400 line-through">
							฿ {{ formatPrice(getStartingPrice(product)) }}
						</span>
					</div>

					<!-- Starting from label -->
					<!-- <p class="text-[10px] text-gray-500 mt-0.5">starting from</p> -->
				</div>
			</div>

			<!-- Loading -->
			<div v-if="loading" class="col-span-2 py-4 text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff613c]"></div>
				<p class="text-xs text-gray-500 mt-2">Loading airlines...</p>
			</div>

			<!-- No Products Found -->
			<div v-if="!loading && filteredProducts.length === 0" class="col-span-2 py-8 text-center">
				<p class="text-gray-500 text-sm">
					<span v-if="search">No airlines found for "{{ search }}"</span>
					<span v-else>No airlines found</span>
				</p>
			</div>
		</div>

		<Modal :isOpen="showFullModal" @closeModal="showFullModal = false">
			<DialogPanel class="modal-full w-screen h-screen fixed inset-0 z-50">
				<div class="relative">
					<img :src="formitem.product_image || 'https://placehold.co/400'" class="top-image" />
					<!-- Back button -->
					<button
						@click="showFullModal = false"
						class="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center backdrop-blur-sm"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-5 h-5 text-gray-800"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
						</svg>
					</button>
				</div>

				<!-- CONTENT -->
				<div class="content px-5 py-4">
					<!-- TITLE -->
					<h3 class="text-start text-xl font-semibold mb-2 line-clamp-2">
						{{ selectedProduct?.name }}
					</h3>

					<!-- DESCRIPTION  -->
					<div v-if="selectedProduct?.description" class="description-container mb-6">
						<div :class="['description-text', showFullDescription ? 'expanded' : 'collapsed']">
							{{ selectedProduct.full_description }}
						</div>

						<div v-if="selectedProduct?.description?.length > 150" class="text-right">
							<button @click="showFullDescription = !showFullDescription" class="see-more-btn">
								{{ showFullDescription ? "See Less" : "See More" }}
							</button>
						</div>
					</div>

					<!-- CHOOSE TICKET  -->
					<p class="text-start text-xl font-semibold mt-3">Choose Ticket Type</p>

					<div class="mt-1 ms-2 space-y-3">
						<div
							v-for="ticket in formitem.car_list"
							:key="ticket.id"
							class="flex items-start my-3 gap-2"
							@click="selectTicket(ticket)"
						>
							<div class="radio mt-1 flex-shrink-0" :class="{ 'radio-selected': formitem.car_id === ticket.id }">
								<div v-if="formitem.car_id === ticket.id" class="radio-dot"></div>
							</div>

							<div class="flex-1">
								<div class="line-clamp-2 text-justify">
									<div>
										<span class="text-base text-md text-justify">{{ ticket.name ?? ticket.price }}</span>
										<!-- <div class="mt-1 text-lg">
											<p>{{ ticket.name || "Flight ticket" }}</p>
										</div> -->
									</div>
									<!-- <div class="text-right">
										<span class="text-base font-semibold text-[#ff613c]">฿{{ formatPrice(ticket.price) }}</span>
										<p class="text-xs text-gray-500">per ticket</p>
									</div> -->
								</div>
							</div>
						</div>
					</div>

					<div v-if="formitem.car_id" class="mt-6">
						<!-- <p class="text-xl font-semibold text-start mb-4">Travel Date</p>
						
						<div class="mb-4">
							<label class="block text-sm font-medium text-gray-700 mb-2">Travel Date *</label>
							<input
								type="date"
								v-model="formitem.service_date"
								@change="checkDateValidity"
								:class="[
									'w-full px-3 py-3 text-sm border rounded-lg focus:outline-none',
									todayVali ? 'border-gray-300 focus:border-[#ff613c]' : 'border-red-500',
								]"
							/>
							<p v-if="!todayVali" class="mt-1 text-xs text-red-500">Please select today or a future date</p>
						</div> -->

						<!-- TICKET QUANTITY -->

						<!-- DISCOUNT -->
						<!-- <div class="mt-6">
							<p class="text-xl font-semibold text-start mb-4">Discount (Optional)</p>
							<div class="relative">
								<span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">฿</span>
								<input
									type="number"
									v-model="formitem.discount"
									min="0"
									class="w-full pl-8 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff613c]"
									placeholder="Enter discount amount"
								/>
							</div>
						</div> -->

						<!-- SPECIAL REQUESTS -->
						<div class="mt-8">
							<p class="text-xl font-semibold text-start mb-6">Add Reserve Comment</p>
							<textarea v-model="formitem.special_request" class="comment-box" placeholder="" />
						</div>

						<div class="mt-6">
							<label class="block text-xl font-semibold text-start text-gray-700 mb-1">
								Ticket Price * ( For UI Testing )</label
							>
							<input
								type="number"
								v-model="formitem.selling_price"
								min="0"
								class="w-full px-3 py-4 text-sm border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#ff613c]"
							/>
						</div>
						<div class="mt-6">
							<!-- <p class="text-xl font-semibold text-start mb-4">Number of Tickets</p> -->
							<div class="qty-section">
								<button
									class="qty-btn"
									@click="formitem.quantity > 1 && (formitem.quantity = parseInt(formitem.quantity) - 1)"
									:disabled="formitem.quantity <= 1"
								>
									−
								</button>

								<span class="qty-value">{{ formitem.quantity }}</span>

								<button
									class="qty-btn"
									:disabled="formitem.selling_price == ''"
									@click="formitem.quantity = parseInt(formitem.quantity) + 1"
								>
									+
								</button>
							</div>
						</div>

						<!-- PRICE SUMMARY -->
						<!-- <div v-if="formitem.selling_price" class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-300">
							<p class="text-sm font-semibold text-gray-700 mb-2">Price Summary</p>
							<div class="space-y-1 text-sm">
								<div class="flex justify-between">
									<span class="text-gray-600">{{ formitem.quantity }} ticket{{ formitem.quantity > 1 ? 's' : '' }}</span>
									<span>฿{{ formatPrice(formitem.selling_price * formitem.quantity) }}</span>
								</div>
								<div v-if="formitem.discount > 0" class="flex justify-between">
									<span class="text-gray-600">Discount</span>
									<span class="text-red-500">-฿{{ formatPrice(formitem.discount) }}</span>
								</div>
								<div class="flex justify-between pt-2 border-t border-gray-300 mt-2">
									<span class="font-semibold">Total</span>
									<span class="font-bold text-[#ff613c]">฿{{ formatPrice(totalPrice) }}</span>
								</div>
							</div>
						</div> -->
					</div>
				</div>

				<!-- FOOTER -->
				<div class="footer p-4 py-5">
					<button
						class="w-full bg-[#ff613c] text-white py-5 rounded-full text-sm font-semibold shadow-lg"
						:disabled="!formitem.car_id"
						@click="submitBooking"
					>
						<!-- <template v-if="formitem.selling_price && formitem.service_date">
							Add flight to invoice - {{ formatPrice(totalPrice) }} THB
						</template> -->
						Add item to invoice - {{ formatPrice(totalPrice) }} thb
						<!-- <template v-else>
							Select ticket and date to continue
						</template> -->
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

.modal-full {
	height: 100vh;
	background: #fff;
	display: flex;
	flex-direction: column;
}

/* IMAGE */
.top-image {
	width: 100%;
	height: 200px;
	object-fit: cover;
}

/* CONTENT */
.content {
	flex: 1;
	overflow-y: auto;
}

/* DESCRIPTION STYLES */
.description-container {
	color: #6b7280;
	text-align: justify;
	font-size: 14px;
	line-height: 1.5;
}

.description-text {
	color: #6b7280;
	line-height: 2;
}

.description-text.collapsed {
	max-height: 100px;
	overflow: hidden;
	position: relative;
}

.description-text.collapsed::after {
	content: "";
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 40px;
	background: linear-gradient(to bottom, transparent, white);
}

.description-text.expanded {
	max-height: none;
	overflow: visible;
}

.see-more-btn {
	color: #ff613c;
	font-size: 14px;
	font-weight: 500;
	margin-top: 8px;
	background: none;
	border: none;
	cursor: pointer;
	display: inline-block;
}

/* RADIO LEFT - FIXED STYLING */
.radio {
	width: 20px;
	height: 20px;
	border: 2px solid #e0e0e0;
	border-radius: 50%;
	background: white;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s;
}

.radio.radio-selected {
	border-color: #ff613c;
	background: #ff613c;
}

.radio-dot {
	width: 6px;
	height: 6px;
	background: #ffffff;
	border-radius: 50%;
}

/* COMMENT */
.comment-box {
	width: 100%;
	min-height: 110px;
	border-radius: 12px;
	border: 1px solid #e0e0e0;
	padding: 10px;
	font-size: 16px;
}

/* QUANTITY */
.qty-section {
	margin-top: 18px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 50px;
}

.qty-btn {
	width: 45px;
	height: 45px;
	border-radius: 50%;
	background: #ff613c;
	color: white;
	font-size: 20px;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: background-color 0.2s;
}

.qty-btn:hover:not(:disabled) {
	background: #ff5b00;
}

.qty-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.qty-value {
	font-size: 16px;
	font-weight: 600;
	min-width: 30px;
	text-align: center;
}

/* FOOTER */
.footer {
	background: white;
	box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

input[type="date"] {
	font-family: inherit;
	font-size: 16px;
}

button:disabled {
	background-color: #e0e0e0;
	cursor: not-allowed;
	opacity: 0.6;
}

.ticket-icon {
	font-size: 24px;
}
</style>
