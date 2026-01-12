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

// Modal state
const showFullModal = ref(false);
const selectedProduct = ref(null);
const showFullDescription = ref(false);

// Total price computed
const totalPrice = computed(() => {
	if (!formitem.value.selling_price || !formitem.value.quantity) return 0;
	return formitem.value.selling_price * parseInt(formitem.value.quantity) - formitem.value.discount;
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

const openAddItemModal = (product) => {
	selectedProduct.value = product;
	formitem.value.product_id = product.id;
	formitem.value.product_name = product.name;
	formitem.value.product_image = product.cover_image;
	if (product?.cars?.length > 0) {
		formitem.value.car_list = product.cars;
		if (product.cars[0]) {
			selectCar(product.cars[0]);
		}
	} else {
		formitem.value.car_list = [];
		formitem.value.car_id = "";
		formitem.value.item_name = "";
		formitem.value.selling_price = "";
	}

	// Reset form for new selection
	formitem.value.special_request = "";
	formitem.value.quantity = "1";
	formitem.value.discount = 0;
	showFullDescription.value = false;

	showFullModal.value = true;
};

// Select car
const selectCar = (car) => {
	formitem.value.car_id = car.id;
	formitem.value.item_name = car.name;
	formitem.value.selling_price = car.price;
	formitem.value.cost_price = car.cost_price || 0;
	formitem.value.comment = `Car Type: ${car.name}`;
	formitem.value.quantity = "1";
};

// Submit booking
const submitBooking = () => {
	formitem.value.total_amount = totalPrice.value;

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

	showFullModal.value = false;
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

					<div v-if="selectedProduct?.full_description_en" class="description-container mb-6">
						<div
							:class="['description-text', showFullDescription ? 'expanded' : 'collapsed']"
							v-html="selectedProduct.full_description_en"
						></div>

						<div v-if="selectedProduct?.full_description_en?.length > 150" class="text-right">
							<button @click="showFullDescription = !showFullDescription" class="see-more-btn">
								{{ showFullDescription ? "See Less" : "See More" }}
							</button>
						</div>
					</div>

					<!-- CHOOSE Cars -->

					<p class="text-start text-xl font-semibold mt-3">Choose Car Type</p>

					<div class="mt-1 ms-2">
						<div v-for="car in formitem.car_list" :key="car.id" class="ticket-row my-3" @click="selectCar(car)">
							<!-- RADIO LEFT -->
							<div class="radio" :class="{ 'radio-selected': formitem.car_id === car.id }">
								<div v-if="formitem.car_id === car.id" class="radio-dot"></div>
							</div>

							<!-- TEXT -->
							<span class="text-md">{{ car.name }}</span>
						</div>
					</div>

					<!-- COMMENT -->
					<div class="mt-8">
						<p class="text-xl font-semibold text-start mb-6">Add Reserve Comment</p>

						<textarea v-model="formitem.special_request" class="comment-box" />
					</div>

					<!-- QUANTITY -->
					<div class="qty-section">
						<button
							class="qty-btn"
							@click="formitem.quantity > 1 && (formitem.quantity = (parseInt(formitem.quantity) - 1).toString())"
						>
							−
						</button>

						<span class="qty-value">{{ formitem.quantity }}</span>

						<button class="qty-btn" @click="formitem.quantity = (parseInt(formitem.quantity) + 1).toString()">+</button>
					</div>
				</div>

				<!-- FOOTER -->
				<div class="footer p-4 py-5">
					<button
						class="w-full bg-[#ff613c] text-white py-5 rounded-full text-sm font-semibold shadow-lg"
						:disabled="!formitem.car_id"
						@click="submitBooking"
					>
						Add item to invoice - {{ formatPrice(totalPrice) }} thb
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

/* TITLE */
.title-text {
	font-weight: 600;
	margin-bottom: 12px;
}

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

/* TICKET ROW */
.ticket-row {
	display: flex;
	align-items: center;
	gap: 10px;
}

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
}

.qty-value {
	font-size: 16px;
}

/* FOOTER */
.footer {
	background: white;
	box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}
</style>
