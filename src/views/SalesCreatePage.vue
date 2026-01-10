<script setup>
import {
	XCircleIcon,
	ArrowDownTrayIcon,
	UserIcon,
	UserPlusIcon,
	MagnifyingGlassIcon,
	ChevronDownIcon,
	ShoppingCartIcon,
} from "@heroicons/vue/24/outline";
import { PlusIcon, ListBulletIcon } from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import OverView from "./BookingComponent/Vantour.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Switch } from "@headlessui/vue";
import Modal from "../components/Modal.vue";
// import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import Vantour from "./BookingComponent/Vantour.vue";
import ItemList from "./BookingComponent/ItemList.vue";
import VantourImage from "../../src/assets/road-trip.png";
import HotelImage from "../../src/assets/hotel.png";
import AttractionImage from "../../src/assets/attractions icon.svg";
import AirlineImage from "../../src/assets/flight icon.svg";
import InclusivePart from "./BookingComponent/InclusivePart.vue";
import CustomerInfo from "./BookingComponent/CustomerInfo.vue";
import PaymentDetail from "./BookingComponent/PaymentDetail.vue";
import { useBookingStore } from "../stores/booking";
import Attraction from "./BookingComponent/Attraction.vue";
import Hotel from "./BookingComponent/Hotel.vue";
import Airline from "./BookingComponent/Airline.vue";
import TaxInfo from "./BookingComponent/TaxInfo.vue";
import { useAdminStore } from "../stores/admin";
import ArchiveConfirmationModal from "./BookingComponent/ConfirmationModel.vue";
import { useAuthStore } from "../stores/auth";
// import CashImage from "./CashImageCreate/CashImage.vue";

// Mobile Layout
const isMobile = ref(false);
const checkMobile = () => {
	isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
	checkMobile();
	window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
	window.removeEventListener("resize", checkMobile);
});

// for tag
const currentTag = ref("Van Tours");
const currentSubTag = ref("items");
const addItemModal = ref(false);
const bookingStore = useBookingStore();
// const toast = useToast();
const adminStore = useAdminStore();
const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

// specific states
const showProductFilter = ref(false);
const searchQuery = ref("");
const showBottomSheet = ref(false);
const selectedProductForDetails = ref(null);
const showMobileCart = ref(false);

// For Selection Product Data
const productArray = [
	{
		id: 1,
		name: "Van Tours",
		image: VantourImage,
		type: "Van Tours",
	},
	{
		id: 2,
		name: "Attractions",
		image: AttractionImage,
		type: "Attractions",
	},
	{
		id: 3,
		name: "Hotels",
		image: HotelImage,
		type: "Hotels",
	},
	{
		id: 4,
		name: "Airlines",
		image: AirlineImage,
		type: "Airlines",
	},
];

// Map tags to corresponding components
const componentsMap = {
	"Van Tours": Vantour,
	Attractions: Attraction,
	Hotels: Hotel,
	Airlines: Airline,
};

// Compute the current component based on the tag
const currentComponent = computed(() => componentsMap[currentTag.value] || Vantour);

// data add action part
const formData = ref({
	payment_notes: "",
	transfer_code: "",
	customer_id: "",
	customer_name: "",
	customer_phone: "",
	customer_email: "",
	is_corporate: "",
	sold_from: "",
	payment_method: "",
	bank_name: "",
	payment_status: "",
	booking_date: "",
	payment_currency: "",
	items: [],
	money_exchange_rate: "",
	crm_id: "",
	discount: "0",
	comment: "",
	receipt_image: [],
	confirmation_letter: [],
	due_date: "",
	deposit: 0,
	balance_due_date: "",
	past_user_id: "",
	is_past_info: "",
	past_crm_id: "",
	is_inclusive: "",
	inclusive_name: "",
	inclusive_description: "",
	inclusive_quantity: "",
	inclusive_rate: "",
	inclusive_start_date: "",
	inclusive_end_date: "",
});

// Computed properties for totals
const sub_total = computed(() => {
	if (formData.value.is_inclusive != 1) {
		let totalsub = 0;
		for (let i = 0; i < formData.value.items.length; i++) {
			totalsub = totalsub + formData.value.items[i].total_amount * 1;
		}
		return totalsub + sub_total_discount.value * 1;
	} else {
		return formData.value.inclusive_rate * formData.value.inclusive_quantity;
	}
});

const sub_total_real = computed(() => {
	if (formData.value.is_inclusive != 1) {
		let totalsub = 0;
		for (let i = 0; i < formData.value.items.length; i++) {
			if (!formData.value.items[i].is_inclusive) {
				if (formData.value.items[i].product_type) {
					totalsub = totalsub + formData.value.items[i].total_amount * 1;
				}
			}
		}
		return totalsub + sub_total_discount.value * 1;
	} else {
		return formData.value.inclusive_rate * formData.value.inclusive_quantity;
	}
});

const sub_total_discount = computed(() => {
	if (formData.value.is_inclusive != 1) {
		let totalsub = 0;
		for (let i = 0; i < formData.value.items.length; i++) {
			if (!formData.value.items[i].is_inclusive) {
				totalsub = totalsub + formData.value.items[i].discount;
			}
		}
		return totalsub;
	} else {
		return 0;
	}
});

const grand_total_real = computed(() => {
	let final = sub_total_real.value - sub_total_discount.value * 1;
	return final;
});

const balance_due_real = computed(() => {
	if (grand_total_real.value - formData.value.deposit == 0 && formData.value.items.length != 0) {
		return grand_total_real.value - formData.value.deposit;
	} else if (
		grand_total_real.value - formData.value.deposit != 0 &&
		formData.value.items.length != 0 &&
		formData.value.deposit != 0
	) {
		return grand_total_real.value - formData.value.deposit;
	} else if (formData.value.deposit == 0 && formData.value.items.length != 0) {
		return grand_total_real.value - formData.value.deposit;
	}
});

const grand_total = computed(() => {
	let final = sub_total.value - sub_total_discount.value * 1;
	return final;
});

const balance_due = computed(() => {
	if (grand_total.value - formData.value.deposit == 0 && formData.value.items.length != 0) {
		formData.value.payment_status = "fully_paid";
		return grand_total.value - formData.value.deposit;
	} else if (
		grand_total.value - formData.value.deposit != 0 &&
		formData.value.items.length != 0 &&
		formData.value.deposit != 0
	) {
		formData.value.payment_status = "partially_paid";
		return grand_total.value - formData.value.deposit;
	} else if (formData.value.deposit == 0 && formData.value.items.length != 0) {
		formData.value.payment_status = "not_paid";
		return grand_total.value - formData.value.deposit;
	}
});

const itemsCount = computed(() => {
	return formData.value.items.length;
});

const totalItemsPrice = computed(() => {
	return formData.value.items.reduce((total, item) => {
		return total + (item.total_amount || 0);
	}, 0);
});

const removeItemList = (message) => {
	if (!message || typeof message.id === "undefined" || typeof message.index === "undefined") {
		console.error("Invalid 'message' object. Must have both 'id' and 'index'.");
		return;
	}

	const items = formData.value.items;

	if (!Array.isArray(items)) {
		console.error("'formData.value.items' is not an array.");
		return;
	}

	const itemAtIndex = items[message.index];
	if (itemAtIndex && itemAtIndex.product_id == message.id) {
		items.splice(message.index, 1);
		toast.success("Item removed from cart");
	}
};

const changeGetForm = (data) => {
	formData.value.balance_due_date = data.balance_due_date;
	formData.value.booking_date = data.booking_date;
	formData.value.money_exchange_rate = data.money_exchange_rate;
	formData.value.payment_currency = data.payment_currency;
	formData.value.payment_method = data.payment_method;
	formData.value.bank_name = data.bank_name;
	formData.value.is_inclusive = data.is_inclusive;
};

const changeGetTaxForm = (data) => {
	formData.value.transfer_code = data.transfer_code;
};

const formatDateDb = (dateString) => {
	if (!dateString) return "";

	if (dateString.includes("T")) {
		return dateString.replace("T", " ");
	}

	const ddmmyyyyRegex = /^(\d{2})-(\d{2})-(\d{4})\s(.*)$/;
	const match = dateString.match(ddmmyyyyRegex);

	if (match) {
		return `${match[3]}-${match[2]}-${match[1]} ${match[4]}`;
	}

	return dateString;
};

const formatDate = (dateString) => {
	const date = new Date(dateString);

	if (isNaN(date.getTime())) {
		return "Invalid Date";
	}

	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	const day = String(date.getDate()).padStart(2, "0");
	const month = months[date.getMonth()];
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const changeGetInclusiveForm = (data) => {
	formData.value.inclusive_name = data.inclusive_name;
	formData.value.inclusive_quantity = data.inclusive_quantity;
	formData.value.inclusive_rate = data.inclusive_rate;
	formData.value.inclusive_start_date = data.inclusive_start_date;
	formData.value.inclusive_end_date = data.inclusive_end_date;
	formData.value.inclusive_description = data.inclusive_description;
};

const formitem = ref({});
const changeGetItem = (data) => {
	console.log(data, "this is data");
	searchQuery.value = "";
	if (formData.value.is_inclusive == 1) {
		formitem.value.is_inclusive = 1;
	} else {
		formitem.value.is_inclusive = "";
	}
	formitem.value = data;
	addNewitem();
	formitem.value = {};
	toast.success("Item added to cart");
};

const changeItemList = (data) => {
	console.log(data, "this is change item value");
	if (formData.value.is_inclusive == 1) {
		formData.value.items[data.id].is_inclusive = 1;
	} else {
		formData.value.items[data.id].is_inclusive = "";
	}
	formData.value.items[data.id] = data.data;
};

const addNewitem = () => {
	formData.value.items.push(formitem.value);
};

const customerId = (data) => {
	console.log(data);
	formData.value.customer_id = data.id;
	formData.value.customer_name = data.name;
	formData.value.customer_email = data.email;
	formData.value.customer_phone = data.phone_number;
	formData.value.is_corporate = data.is_corporate_customer;
	formData.value.sold_from = data.sold_from;
	formData.value.is_past_info = data.is_past_info;
	formData.value.past_crm_id = data.past_crm_id;
	formData.value.past_user_id = data.past_user_id;
};

// Payment form and modals
const featureImageInput = ref(null);
const featureImagePreview = ref([]);

const openFileFeaturePicker = () => {
	featureImageInput.value.click();
};

const paymentForm = ref({
	file: null,
	preview: null,
	amount: 0,
	bank_name: "",
	date: "",
	sender: "",
	reciever: "MR. THIHA@KUMAR BHUSAL",
	interact_bank: "personal",
	currency: "THB",
	is_corporate: false,
	comment: "",
});

const openShowModal = ref(false);

const closeAction = () => {
	paymentForm.value = {
		id: "",
		file: null,
		preview: null,
		amount: 0,
		date: "",
		bank_name: "",
		sender: "",
		reciever: "MR. THIHA@KUMAR BHUSAL",
		interact_bank: "personal",
		currency: "THB",
		is_corporate: false,
		comment: "",
	};
	openShowModal.value = false;
};

const handlerFeatureFileChange = (e) => {
	let selectedFile = e.target.files[0];
	paymentForm.value.file = selectedFile;
	paymentForm.value.preview = URL.createObjectURL(selectedFile);
};

const submitAddAction = () => {
	formData.value.receipt_image.push(paymentForm.value);
	featureImagePreview.value.push(paymentForm.value);
	paymentForm.value = {
		id: "",
		file: null,
		preview: null,
		amount: 0,
		date: "",
		bank_name: "",
		sender: "",
		reciever: "",
		interact_bank: "personal",
		currency: "THB",
		is_corporate: false,
		comment: "",
	};
	openShowModal.value = false;
};

const removeFeatureSelectImage = (index) => {
	formData.value.receipt_image.splice(index, 1);
	featureImagePreview.value.splice(index, 1);
};

const allowCreate = computed(() => {
	if (formData.value.items.length != 0 && formData.value.deposit != 0 && formData.value.receipt_image.length != 0) {
		return true;
	} else if (formData.value.items.length != 0 && formData.value.deposit == 0) {
		return true;
	} else {
		return false;
	}
});

const errors = ref(null);

// Validation functions
const validateItemByType = (item) => {
	switch (item.product_type) {
		case "1": // PrivateVanTour
		case "2": // GroupTour
		case "3": // AirportPickup
			if (!item.service_date) {
				toast.warning("Service date is required");
				return false;
			}
			if (!item.car_id) {
				toast.warning("Car type selection is required");
				return false;
			}
			break;
		case "4": // EntranceTicket
			if (!item.car_id) {
				toast.warning("Variation selection is required");
				return false;
			}
			if (!item.service_date) {
				toast.warning("Service date is required");
				return false;
			}
			break;
		case "5": // Inclusive
			if (!item.service_date) {
				toast.warning("Service date is required");
				return false;
			}
			break;
		case "6": // Hotel
			if (!item.car_id) {
				toast.warning("Room type selection is required");
				return false;
			}
			if (!item.checkin_date || !item.checkout_date) {
				toast.warning("Check-in and Check-out dates are required");
				return false;
			}
			break;
		case "7": // Airline
			if (!item.car_id) {
				toast.warning("Ticket type selection is required");
				return false;
			}
			if (!item.service_date) {
				toast.warning("Travel date is required");
				return false;
			}
			break;
	}

	if (!item.total_amount) {
		toast.warning("Total amount is required");
		return false;
	}

	return true;
};

const validateBasicInfo = () => {
	if (!formData.value.customer_id) {
		toast.warning("Customer selection is required");
		return false;
	}

	if (!formData.value.payment_method) {
		toast.warning("Payment method selection is required");
		return false;
	}

	if (!formData.value.booking_date) {
		toast.warning("Booking date is required");
		return false;
	}

	if (!formData.value.payment_status) {
		toast.warning("Payment status selection is required");
		return false;
	}

	if (formData.value.items.length === 0) {
		toast.warning("At least one item is required");
		return false;
	}

	return true;
};

const openModalArchive = ref(false);

const onSubmitHandler = async () => {
	if (!isNaN(sub_total_real.value) && sub_total_real.value !== null) {
		openModalArchive.value = true;
	} else {
		toast.warning("Please check again, items have issues!");
	}
};

const handleArchiveUpdate = () => {
	processSubmission();
	openModalArchive.value = false;
};

const handleNormalUpdate = () => {
	processSubmission();
	openModalArchive.value = false;
};

const closeModal = () => {
	openModalArchive.value = false;
};

const internalTransferAction = (message) => {
	console.log(message, "Internal Transfer Data");

	const internalTransferData = {
		is_internal_transfer: true,
		exchange_rate: message.data.exchange_rate,
		note: message.data.notes,
		from_files: message.data.from_images.map((img) => ({
			file: img.image,
			amount: img.amount,
			currency: img.currency,
			sender: img.sender,
			receiver: img.receiver,
			interact_bank: img.interact_bank,
			date: formatDateDb(img.date),
		})),
		to_files: message.data.to_images.map((img) => ({
			file: img.image,
			amount: img.amount,
			currency: img.currency,
			sender: img.sender,
			receiver: img.receiver,
			interact_bank: img.interact_bank,
			date: formatDateDb(img.date),
		})),
	};

	formData.value.receipt_image.push(internalTransferData);
	openShowModal.value = false;
};

const directAction = (message) => {
	console.log(message, "Direct Banking Data");

	const directReceiptData = {
		is_internal_transfer: false,
		file: message.data.image,
		amount: message.data.amount,
		currency: message.data.currency,
		sender: message.data.sender,
		reciever: message.data.receiver,
		interact_bank: message.data.interact_bank,
		date: formatDateDb(message.data.date),
		bank_name: "",
		is_corporate: false,
		note: "",
	};

	formData.value.receipt_image.push(directReceiptData);
	openShowModal.value = false;
};

const processSubmission = async () => {
	if (!isNaN(sub_total_real.value) && sub_total_real.value !== null) {
		if (!validateBasicInfo()) {
			return;
		}

		const frmData = new FormData();
		// ... (keep all your existing form data preparation logic)
		// This is the same as your original code

		try {
			const response = await bookingStore.addNewAction(frmData);
			if (response.status == 1) {
				formData.value = {
					customer_id: "",
					transfer_code: "",
					sold_from: "",
					payment_method: "",
					bank_name: "",
					payment_status: "",
					booking_date: "",
					items: [],
					receipt_image: [],
					money_exchange_rate: "",
					crm_id: "",
					discount: "",
					comment: "",
					past_user_id: "",
					is_past_info: false,
					past_crm_id: "",
				};

				errors.value = null;
				toast.success(response.message);
				featureImagePreview.value = [];
				router.push("/bookings/new-update/" + response.result.id);
			}
		} catch (error) {
			if (error.response.data.errors) {
				errors.value = error.response.data.errors;
			}
			toast.error(error.response?.data?.message);
		}
	} else {
		toast.warning("Please check again, items have issues!");
	}
};

watch(() => currentTag.value, () => {
  searchQuery.value = "";
});

onMounted(async () => {
	await adminStore.getSimpleListAction();
});
</script>

<template>
	<!-- Layout -->
	<div class="block md:hidden">
		<!--  Header -->
		<div class="sticky top-0 z-50 bg-white shadow-2xl">
			<div class="">
				<!-- Top Bar with Back, Title, and Cart -->
				<!-- <div class="flex items-center justify-between mb-3">
            <button
              @click="$router.back()"
              class="p-2 text-gray-600"
            >
              <i class="fas fa-arrow-left text-lg"></i>
            </button>
            <h1 class="text-lg font-semibold text-gray-800">New Booking</h1>
            <div class="relative">
              <button
                @click="showMobileCart = true"
                class="p-2 text-gray-600 relative"
              >
                <ShoppingCartIcon class="w-6 h-6" />
                <span
                  v-if="itemsCount > 0"
                  class="absolute -top-1 -right-1 bg-[#ff613c] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {{ itemsCount }}
                </span>
              </button>
            </div>
          </div> -->

				<!-- Product Filter Pills -->
				<!-- Header -->
				<div class="sticky top-0 z-40 bg-white px-4 pt-3 pb-4 shadow-sm">
					<!-- Title -->
					<div class="flex items-center gap-3 my-4">
						<router-link to="/sales">
							<button class="flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-6 h-6 text-black"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 19l-7-7m0 0l7-7m-7 7h18"
									/>
								</svg>
							</button>
						</router-link>
						<h1 class="text-[20px] font-semibold ms-2">Create New sales</h1>
					</div>

					<!-- Filter + Search -->
					<div class="flex gap-2">
						<!-- Select -->
						<div class="relative">
							<select
								v-model="currentTag"
								class="appearance-none text-sm px-4 pr-8 py-3 rounded-full focus:outline-none"
								style="border: 2px solid gainsboro"
							>
								<option v-for="product in productArray" :key="product.id" :value="product.name">
									{{ product.name }}
								</option>
							</select>

							<!-- arrow -->
							<svg
								class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-main"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</div>

						<!-- Search -->
						<div class="relative flex-1">
							<MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: gray" />
							<input
								v-model="searchQuery"
								type="text"
								placeholder="Search products"
								class="w-full bg-gray pl-8 pr-4 py-3 text-sm rounded-2xl focus:outline-none"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Content -->
		  <div class="flex flex-col" style="height: calc(100vh - 160px);">
    <div class="flex-1 overflow-y-auto">
		<div class="p-3 px-4">
			<!-- Search Bar -->

			<!-- Product Component -->
			<div class="mb-4">
				<transition name="fade" mode="out-in">
					<component :is="currentComponent" :key="currentTag" @formData="changeGetItem" :searchQuery="searchQuery" />
				</transition>
			</div>

			<div v-if="itemsCount > 0" class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-40">
				<div class="p-3">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-700">{{ itemsCount }} item{{ itemsCount > 1 ? "s" : "" }}</p>
							<p class="text-lg font-bold text-[#ff613c]">{{ totalItemsPrice.toLocaleString() }} THB</p>
						</div>
						<button
							@click="showMobileCart = true"
							class="px-6 py-3 text-sm font-medium text-white bg-[#ff613c] rounded-lg hover:bg-[#ff5b00] transition-colors shadow-md"
						>
							View Cart
						</button>
					</div>
				</div>
			</div>
		</div>
		</div>
		</div>

		<!-- Testing Cart Style -->
		<div v-if="showMobileCart" class="fixed inset-0 z-50 bg-black bg-opacity-50" @click="showMobileCart = false">
			<div
				class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl max-h-[85vh] overflow-y-auto"
				@click.stop
			>
				<!-- Modal Header -->
				<div class="sticky top-0 bg-white border-b border-gray-300">
					<div class="flex items-center justify-between p-4">
						<h3 class="text-lg font-semibold text-gray-800">Booking Details</h3>
						<button @click="showMobileCart = false" class="p-2 text-gray-500 hover:text-gray-700">
							<XCircleIcon class="w-6 h-6" />
						</button>
					</div>
				</div>

				<!-- Tab Navigation -->
				<div class="sticky top-[57px] bg-white border-b border-gray-300">
					<div class="flex overflow-x-auto scrollbar-hide">
						<button
							v-for="tab in ['items', 'info', 'payment', 'tax']"
							:key="tab"
							@click="currentSubTag = tab"
							:class="[
								'flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
								currentSubTag === tab
									? 'border-[#ff613c] text-[#ff613c]'
									: 'border-transparent text-gray-500 hover:text-gray-700',
							]"
						>
							{{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
						</button>
					</div>
				</div>

				<!-- Tab Content -->
				<div class="p-4">
					<!-- Items Tab -->
					<div v-if="currentSubTag === 'items'" class="space-y-4">
						<div v-if="formData.items.length === 0" class="text-center py-8">
							<p class="text-gray-500">No items in cart</p>
						</div>

						<div v-else class="space-y-3">
							<div
								v-for="(item, index) in formData.items"
								:key="index"
								class="p-4 bg-white border border-gray-300 rounded-lg"
							>
								<div class="flex justify-between items-start">
									<div class="flex-1">
										<h4 class="text-sm font-semibold text-gray-800 mb-1">
											{{ item.product_name || "Unnamed Item" }}
										</h4>
										<p class="text-xs text-gray-600 mb-2">
											{{ item.product_type || "No type specified" }}
										</p>
										<div class="flex items-center justify-between">
											<span class="text-xs text-gray-500"> Qty: {{ item.quantity || 1 }} </span>
											<span class="text-sm font-bold text-gray-800">
												{{ (item.total_amount || 0).toLocaleString() }} THB
											</span>
										</div>
									</div>
									<button
										@click="removeItemList({ id: item.product_id, index })"
										class="ml-3 text-red-500 hover:text-red-700"
									>
										<XCircleIcon class="w-5 h-5" />
									</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Customer Info Tab -->
					<div v-if="currentSubTag === 'info'" class="space-y-4">
						<CustomerInfo @checked="customerId" :data="formData" />
					</div>

					<!-- Payment Detail Tab -->
					<div v-if="currentSubTag === 'payment'" class="space-y-4">
						<PaymentDetail :data="formData" @formData="changeGetForm" />
						<div v-if="formData.is_inclusive == 1" class="mt-6">
							<InclusivePart :data="formData" @formData="changeGetInclusiveForm" />
						</div>
					</div>

					<!-- Tax Info Tab -->
					<div v-if="currentSubTag === 'tax'" class="space-y-4">
						<TaxInfo :data="formData" @formData="changeGetTaxForm" />
					</div>

					<!-- Comment Section -->
					<div v-if="currentSubTag !== 'items'" class="mt-6 pt-4 border-t border-gray-300">
						<p class="text-sm font-medium text-gray-700 mb-2">Sale Comment:</p>
						<textarea
							v-model="formData.comment"
							class="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:border-gray-300"
							rows="3"
							placeholder="Add any additional comments..."
						></textarea>
					</div>

					<!-- Summary Section -->
					<div v-if="currentSubTag === 'payment'" class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-300">
						<p class="text-sm font-semibold text-[#ff613c] mb-3">Payment Summary</p>

						<div class="space-y-2">
							<div class="flex justify-between items-center">
								<span class="text-sm text-gray-600">Sub Total:</span>
								<span class="text-sm font-medium">{{ sub_total.toLocaleString() }} THB</span>
							</div>

							<div class="flex justify-between items-center">
								<span class="text-sm text-gray-600">Discount:</span>
								<span class="text-sm font-medium text-red-600">-{{ sub_total_discount.toLocaleString() }} THB</span>
							</div>

							<div class="flex justify-between items-center">
								<span class="text-sm text-gray-600">Grand Total:</span>
								<span class="text-sm font-bold">{{ grand_total.toLocaleString() }} THB</span>
							</div>

							<div class="flex justify-between items-center pt-2 border-t border-gray-300">
								<span class="text-sm text-gray-600">Deposit:</span>
								<input
									type="number"
									v-model="formData.deposit"
									class="w-32 px-2 py-1 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-[#ff613c]"
									placeholder="0"
								/>
							</div>

							<div class="flex justify-between items-center pt-2 border-t border-gray-300">
								<span class="text-sm text-gray-600">Balance Due:</span>
								<span class="text-sm font-bold">{{ balance_due.toLocaleString() }} THB</span>
							</div>
						</div>
					</div>

					<!-- Create Button -->
					<div class="mt-6 pt-4 border-t border-gray-300">
						<button
							@click="onSubmitHandler"
							:disabled="!allowCreate"
							:class="[
								'w-full py-3 text-center text-sm font-medium rounded-lg transition-colors',
								allowCreate
									? 'bg-[#ff613c] text-white hover:bg-[#ff5b00] shadow-md'
									: 'bg-gray-300 text-gray-500 cursor-not-allowed',
							]"
						>
							Create Booking
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Archive Confirmation Modal -->
		<ArchiveConfirmationModal
			:openModalArchive="openModalArchive"
			:formData="formData"
			:sub_total_discount="sub_total_discount"
			:grand_total_real="grand_total_real"
			:sub_total_real="sub_total_real"
			@closeModal="closeModal"
			@archiveUpdate="handleArchiveUpdate"
			@normalUpdate="handleNormalUpdate"
		/>

		<!-- Payment Slip Modal -->
		<Modal :isOpen="openShowModal" @closeModal="closeAction">
			<DialogPanel
				class="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
			>
				<DialogTitle
					as="div"
					class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
				>
					<p>Payment Slip Audit</p>
					<XCircleIcon class="w-5 h-5 text-white" @click="closeAction" />
				</DialogTitle>

				<CashImage @internal-transfer-submitted="internalTransferAction" @direct-banking-submitted="directAction" />
			</DialogPanel>
		</Modal>

		<div class="sticky bottom-0 z-50 bg-white px-3 py-4">
			<button
				@click="onSubmitHandler"
				class="w-full bg-[#ff613c] text-white py-5 rounded-full text-sm font-semibold shadow-lg"
			>
				Total Cost – {{ grand_total }} thb ({{ formData.items.length }} items)
			</button>
		</div>
	</div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.scrollbar-hide::-webkit-scrollbar {
	display: none;
}

.scrollbar-hide {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.border-custom {
	border: 1px solid #e5e7eb;
}

.border-custom:focus {
	border-color: #ff613c;
	outline: none;
	box-shadow: 0 0 0 2px rgba(255, 97, 60, 0.1);
}
</style>
