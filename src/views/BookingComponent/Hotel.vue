<script setup>
import { ref, onMounted, watch, computed, defineEmits } from "vue";
import { MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import { MapPinIcon } from "@heroicons/vue/24/solid";
import { useHotelStore } from "../../stores/hotel";
import { storeToRefs } from "pinia";
import debounce from "lodash/debounce";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";

// Mobile states
const showProductFilter = ref(false);
// const searchQuery = ref("");
const isScrolling = ref(false);
const currentPage = ref(1);
const hasMore = ref(true);

const hotelStore = useHotelStore();
const { hotels, loading } = storeToRefs(hotelStore);
const productList = ref([]);
const search = ref("");
const type = ref("direct_booking");

const emit = defineEmits(["formData"]);

const props = defineProps({
	searchQuery: {
		type: String,
		default: "",
	},
});

const formitem = ref({
	product_type: 6,
	product_id: "",
	product_name: "",
	product_image: "",
	item_name: "",
	car_id: "",
	car_list: [],
	service_date: "",
	checkin_date: "",
	checkout_date: "",
	quantity: "1",
	discount: 0,
	days: 1,
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
			(product) => product.name.toLowerCase().includes(query) || product.location?.toLowerCase().includes(query)
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
		await hotelStore.getListAction({
			search: search.value,
			type: type.value,
			limit: 20,
			page: currentPage.value,
		});

		if (hotels.value?.data) {
			productList.value = [...productList.value, ...hotels.value.data];
			hasMore.value = hotels.value.meta.current_page < hotels.value.meta.last_page;
		}
	} finally {
		isScrolling.value = false;
	}
};

// Get lowest room price
const getLowestPrice = (product) => {
	if (!product.rooms || product.rooms.length === 0) return 0;
	return Math.min(...product.rooms.map((room) => room.room_price || 0));
};

// Get discount price if available
const getDiscountPrice = (product) => {
	const basePrice = getLowestPrice(product);
	return basePrice > 2000 ? basePrice * 0.85 : null; // 15% discount if price > 2000
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

// Calculate days between dates
const calculateDays = () => {
	if (!formitem.value.checkin_date || !formitem.value.checkout_date) {
		formitem.value.days = 1;
		return;
	}

	const checkin = new Date(formitem.value.checkin_date);
	const checkout = new Date(formitem.value.checkout_date);
	const diffTime = Math.abs(checkout - checkin);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	formitem.value.days = diffDays > 0 ? diffDays : 1;
};

// Add item function
const openAddItemModal = (product) => {
	formitem.value.product_id = product.id;
	formitem.value.product_name = product.name;
	formitem.value.product_image = product.images?.[0]?.image;
	if (product?.rooms?.length > 0) {
		formitem.value.car_list = product.rooms;
	}

	showVariationModal.value = true;
};

const selectVariation = (room) => {
	formitem.value.car_id = room.id;
	formitem.value.item_name = room.name;
	formitem.value.selling_price = room.room_price;
	formitem.value.cost_price = room.cost || 0;
	formitem.value.comment = `Room: ${room.name}`;

	showVariationModal.value = false;
	showBookingInfoModal.value = true;
};

const submitBookingInfo = () => {
	formitem.value.total_amount =
		formitem.value.selling_price * formitem.value.quantity * formitem.value.days - formitem.value.discount;
	formitem.value.total_cost_price = formitem.value.quantity * formitem.value.cost_price * formitem.value.days;

	emit("formData", formitem.value);

	// Reset form
	formitem.value = {
		product_type: 6,
		product_id: "",
		product_name: "",
		product_image: "",
		item_name: "",
		car_id: "",
		car_list: [],
		service_date: "",
		checkin_date: "",
		checkout_date: "",
		quantity: "1",
		discount: 0,
		days: 1,
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
	if (!formitem.value.checkin_date) {
		todayVali.value = true;
		return;
	}

	const today = new Date();
	const selectedDate = new Date(formitem.value.checkin_date);
	today.setHours(0, 0, 0, 0);
	selectedDate.setHours(0, 0, 0, 0);

	todayVali.value = selectedDate >= today;

	if (formitem.value.checkin_date && formitem.value.checkout_date) {
		calculateDays();
	}
};

onMounted(async () => {
	await hotelStore.getListAction({
		search: search.value,
		type: type.value,
		limit: 20,
		page: 1,
	});

	if (hotels.value?.data) {
		productList.value = hotels.value.data;
		hasMore.value = hotels.value.meta.current_page < hotels.value.meta.last_page;
	}
});

watch(
	[search, type],
	debounce(async () => {
		currentPage.value = 1;
		productList.value = [];

		await hotelStore.getListAction({
			search: search.value,
			type: type.value,
			limit: 20,
			page: 1,
		});

		if (hotels.value?.data) {
			productList.value = hotels.value.data;
			hasMore.value = hotels.value.meta.current_page < hotels.value.meta.last_page;
		}
	}, 500)
);

watch(
	() => [formitem.value.checkin_date, formitem.value.checkout_date],
	() => {
		calculateDays();
	}
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
            <span class="truncate">{{ type === 'direct_booking' ? 'Direct Booking' : 'Other Booking' }}</span>
            <ChevronDownIcon class="w-4 h-4 ml-2" />
          </button>
          
          <div
            v-if="showProductFilter"
            class="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
          >
            <div
              @click="type = 'direct_booking'; showProductFilter = false"
              class="px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-100"
              :class="type === 'direct_booking' ? 'bg-[#ff613c]/10 text-[#ff613c]' : ''"
            >
              Direct Booking
            </div>
            <div
              @click="type = 'other_booking'; showProductFilter = false"
              class="px-4 py-3 text-sm hover:bg-gray-50"
              :class="type === 'other_booking' ? 'bg-[#ff613c]/10 text-[#ff613c]' : ''"
            >
              Other Booking
            </div>
          </div>
        </div>
      </div>
      <div class="relative">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search hotels..."
          class="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-full focus:outline-none focus:border-[#ff613c]"
        />
      </div>
    </div> -->

		<!-- Product Count -->
		<!-- <div class="px-1">
      <p class="text-xs text-gray-600">
        Showing {{ filteredProducts.length }} hotels
      </p>
    </div> -->

		<!-- Product Grid (2 columns) -->
		<div
			class="grid grid-cols-2 gap-3 overflow-y-auto no-scrollbar"
			style="max-height: calc(100vh - 200px)"
			@scroll="handleScroll"
		>
			<div
				v-for="product in filteredProducts"
				:key="product.id"
				class="bg-white rounded-3xl overflow-hidden transition mb-4"
			>
				<!-- Image -->
				<div class="relative h-40 rounded-3xl overflow-hidden">
					<img
						:src="product.images?.[0]?.image || 'https://placehold.co/400'"
						:alt="product.name"
						class="w-full h-full object-cover"
					/>

					<!-- Plus Button -->
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
					<!-- Title -->
					<h3 class="text-sm leading-snug truncate">
						{{ truncateText(product.name, 20) }}
					</h3>

					<!-- Location -->
					<div class="flex items-center gap-1 text-[11px] text-gray-500">
						<MapPinIcon class="w-3 h-3 text-[#595959]" />
						<span>
							{{ product.location || "Bangkok" }}
						</span>
					</div>

					<!-- Price -->
					<div class="mt-2 flex items-center gap-1">
						<span class="text-md font-semibold text-[#ff613c]">
							<!-- ฿ {{ formatPrice(getDiscountPrice(product) || getLowestPrice(product)) }} -->
							<span class="ps-0.5">฿</span> {{ product.lowest_room_price }}
						</span>

						<!-- <span
        v-if="getDiscountPrice(product)"
        class="text-[10px] text-gray-400 line-through"
      >
        ฿ {{ formatPrice(getLowestPrice(product)) }}
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
				<p class="text-gray-500 text-sm">No hotels found</p>
			</div>
		</div>

		<!-- Variation Selection Modal -->
		<Modal :isOpen="showVariationModal" @closeModal="showVariationModal = false">
			<DialogPanel
				class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
			>
				<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-3"> Select Room Type </DialogTitle>

				<div class="max-h-96 overflow-y-auto space-y-2">
					<div
						v-for="room in formitem.car_list"
						:key="room.id"
						@click="selectVariation(room)"
						:class="[
							'p-3 border rounded-lg cursor-pointer transition-all',
							formitem.car_id === room.id ? 'border-[#ff613c] bg-[#ff613c]/5' : 'border-gray-200 hover:border-gray-300',
						]"
					>
						<div class="flex items-start gap-3">
							<img
								:src="room.images?.[0]?.image || 'https://placehold.co/400'"
								class="w-16 h-16 object-cover rounded-lg"
								alt=""
							/>
							<div class="flex-1">
								<h4 class="text-sm font-semibold text-gray-800">{{ room.name }}</h4>
								<p class="text-xs text-gray-600">{{ room.max_person }} Pax</p>
								<p v-if="room.has_breakfast == 1" class="text-xs text-green-600 mt-1">Breakfast included</p>
								<div class="mt-2">
									<span class="text-sm font-bold text-gray-900"> {{ formatPrice(room.room_price) }} THB </span>
									<span class="text-xs text-gray-500 ml-1">per night</span>
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
					Hotel Booking Details
				</DialogTitle>

				<div class="space-y-4 max-h-96 overflow-y-auto">
					<!-- Check-in Date -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Check-in Date * </label>
						<input
							type="date"
							v-model="formitem.checkin_date"
							@change="checkDateValidity"
							:class="[
								'w-full px-3 py-2 text-sm border rounded-lg focus:outline-none',
								todayVali ? 'border-gray-300' : 'border-red-500',
							]"
						/>
						<p v-if="!todayVali" class="mt-1 text-xs text-red-500">Please select a future date</p>
					</div>

					<!-- Check-out Date -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Check-out Date * </label>
						<input
							type="date"
							v-model="formitem.checkout_date"
							@change="calculateDays"
							class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff613c]"
						/>
					</div>

					<!-- Number of Rooms -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Number of Rooms * </label>
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

					<!-- Stay Duration -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"> Stay Duration </label>
						<div class="p-2 bg-gray-50 rounded-lg border border-gray-300">
							<p class="text-sm text-gray-700">
								{{ formitem.days }} night{{ formitem.days > 1 ? "s" : "" }} × {{ formitem.quantity }} room{{
									formitem.quantity > 1 ? "s" : ""
								}}
							</p>
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

					<!-- Total Price Display -->
					<div class="p-3 bg-gray-50 rounded-lg border border-gray-300">
						<div class="space-y-1">
							<div class="flex justify-between items-center">
								<span class="text-sm text-gray-600">Room rate:</span>
								<span class="text-sm font-medium"> {{ formatPrice(formitem.selling_price) }} THB/night </span>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-sm text-gray-600">Duration:</span>
								<span class="text-sm font-medium"> {{ formitem.days }} night{{ formitem.days > 1 ? "s" : "" }} </span>
							</div>
							<div class="flex justify-between items-center pt-2 border-t border-gray-300">
								<span class="text-sm font-medium text-gray-700">Total:</span>
								<span class="text-lg font-bold text-[#ff613c]">
									{{ formatPrice(formitem.selling_price * formitem.quantity * formitem.days - formitem.discount) }} THB
								</span>
							</div>
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
						:disabled="!todayVali || !formitem.checkin_date || !formitem.checkout_date || formitem.days < 1"
						:class="[
							'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
							todayVali && formitem.checkin_date && formitem.checkout_date && formitem.days >= 1
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
