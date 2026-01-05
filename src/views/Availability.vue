<script setup>
import {
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  InformationCircleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import Swal from "sweetalert2";
import { computed, onMounted, ref, watch } from "vue";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
import Modal from "../components/Modal.vue";
import NavbarVue from "../components/Navbar.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useAvailableStore } from "../stores/available";
import { useHotelStore } from "../stores/hotel";
import { useEntranceStore } from "../stores/entrance";
import { useRoomStore } from "../stores/room";
import { useVariationStore } from "../stores/variations";
import Pagination from "../components/Pagination.vue";

const authStore = useAuthStore();
const availableStore = useAvailableStore();
const hotelStore = useHotelStore();
const entranceStore = useEntranceStore();
const roomStore = useRoomStore();
const variationStore = useVariationStore();
const { availables, loading } = storeToRefs(availableStore);

const changeStatusModal = ref(false);
const selectedAvailability = ref(null);
const infoDrawerOpen = ref(false);
const selectedDetailItem = ref(null);
const searchModal = ref(false);

const product_type = ref("hotel");
const status = ref("");
const order_by = ref("desc");
const product_id = ref("");
const variation_id = ref("");
const daterange = ref("");
const date = ref("");
const created_by = ref("");

const productNameArray = ref([]);
const productVariationArray = ref([]);

const selectedRows = ref([]);
const showBookingTable = ref(false);

const statusOptions = [
	{ id: "", name: "All" },
	{ id: "pending", name: "Pending" },
	{ id: "available", name: "Available" },
	{ id: "unavailable", name: "Unavailable" },
	{ id: "other", name: "Other" },
];

const filterParams = ref({
	product_type: "hotel",
	status: "",
	order_by: "desc",
	product_id: "",
	variation_id: "",
	daterange: "",
	date: "",
	created_by: "",
});

const hasActiveFilters = computed(() => {
	return (
		status.value ||
		order_by.value !== "desc" ||
		product_type.value !== "hotel" ||
		product_id.value ||
		variation_id.value ||
		daterange.value ||
		date.value ||
		created_by.value
	);
});

const dateFormat = (inputDateString) => {
	if (inputDateString != null) {
		const inputDate = new Date(inputDateString);
		const year = inputDate.getFullYear();
		const month = String(inputDate.getMonth() + 1).padStart(2, "0");
		const day = String(inputDate.getDate()).padStart(2, "0");
		const formattedDate = `${year}-${month}-${day}`;
		return formattedDate;
	} else {
		return null;
	}
};

const loadData = async () => {
	try {
		await availableStore.getListAction(filterParams.value);
	} catch (error) {
		console.error("Error loading data:", error);
		Swal.fire({
			icon: "error",
			title: "Load Failed",
			text: "Failed to load availability data. Please try again.",
		});
	}
};

watch(
	() => product_type.value,
	async (newVal) => {
		filterParams.value.product_type = newVal;
		await loadData();
	},
	{ immediate: true }
);

watch(
	() => status.value,
	(newVal) => {
		filterParams.value.status = newVal;
		loadData();
	},
	{ immediate: true }
);

watch(
	() => order_by.value,
	(newVal) => {
		filterParams.value.order_by = newVal;
		loadData();
	},
	{ immediate: true }
);

const formatDate = (dateString) => {
	if (!dateString) return "";

	const date = new Date(dateString);
	if (isNaN(date.getTime())) return "";

	const day = String(date.getDate()).padStart(2, "0");
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const month = monthNames[date.getMonth()];
	const year = date.getFullYear();

	return `${day} ${month} ${year}`;
};

const formattedDateTime = (dateString) => {
	if (!dateString) return "";
	const date = new Date(dateString);
	if (isNaN(date.getTime())) return "";

	const day = String(date.getDate()).padStart(2, "0");
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const month = monthNames[date.getMonth()];
	const year = date.getFullYear();

	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	return `${day} ${month} ${year} ${hours}:${minutes}`;
};

const calculateTotalNights = (checkinDate, checkoutDate) => {
	if (!checkinDate || !checkoutDate) return "-";

	const checkin = new Date(checkinDate);
	const checkout = new Date(checkoutDate);
	const diffTime = Math.abs(checkout - checkin);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	return diffDays;
};

const changePage = async (url) => {
	await availableStore.getChangePage(url);
};

const openChangeStatusModal = (availability) => {
	selectedAvailability.value = { ...availability };
	changeStatusModal.value = true;
};

const closeChangeStatusModal = () => {
	changeStatusModal.value = false;
	selectedAvailability.value = null;
};

const openInfoDrawer = (item) => {
	selectedDetailItem.value = item;
	infoDrawerOpen.value = true;
};

const closeInfoDrawer = () => {
	infoDrawerOpen.value = false;
	selectedDetailItem.value = null;
};

const updateAction = async (newStatus, id, quantity, res_comment = "") => {
	try {
		const frmData = new FormData();
		frmData.append("_method", "PUT");
		frmData.append("status", newStatus);
		frmData.append("quantity", quantity);
		if (res_comment) {
			frmData.append("res_comment", res_comment);
		}

		const res = await availableStore.updateAction(frmData, id);
		closeChangeStatusModal();

		Swal.fire({
			icon: "success",
			title: "Success!",
			text: "Status updated successfully",
			timer: 1500,
			showConfirmButton: false,
		});

		await loadData();
	} catch (error) {
		console.error("Update error:", error);
		Swal.fire({
			icon: "error",
			title: "Error",
			text: error.response?.data?.message || "Failed to update status. Please try again.",
		});
	}
};

const deleteAction = async (id) => {
	Swal.fire({
		title: "Are you sure?",
		text: "You won't be able to revert this!",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#2463EB",
		cancelButtonColor: "#d33",
		confirmButtonText: "Confirm",
	})
		.then(async (result) => {
			if (result.isConfirmed) {
				const res = await availableStore.deleteAction(id);
				if (res.message == "success") {
					Swal.fire({
						icon: "success",
						title: "Deleted!",
						text: "Availability deleted successfully",
						timer: 1500,
						showConfirmButton: false,
					});
					await loadData();
				} else {
					console.error("Failed to delete availability", res.message);
					Swal.fire({
						icon: "error",
						title: "Error",
						text: "Failed to delete availability",
					});
				}
			}
		})
		.catch((error) => {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: error.response?.data?.message || "Failed to delete availability",
			});
		});
};

const getStatusBadgeStyle = (statusValue) => {
	switch (statusValue) {
		case "pending":
			return {
				backgroundColor: "#FEF3C7",
				color: "#92400E",
				border: "1px solid #FDE68A",
			};
		case "available":
			return {
				backgroundColor: "#D1FAE5",
				color: "#065F46",
				border: "1px solid #A7F3D0",
			};
		case "unavailable":
			return {
				backgroundColor: "#FEE2E2",
				color: "#991B1B",
				border: "1px solid #FECACA",
			};
		case "other":
			return {
				backgroundColor: "#E9D5FF",
				color: "#6B21A8",
				border: "1px solid #D8B4FE",
			};
		default:
			return {
				backgroundColor: "#F3F4F6",
				color: "#1F2937",
				border: "1px solid #E5E7EB",
			};
	}
};

const chooseTypeAction = async () => {
	if (product_type.value == "hotel") {
		const res = await hotelStore.getSimpleListAction();
		productNameArray.value = res.result.data;
	} else if (product_type.value == "entrance_ticket") {
		const res = await entranceStore.getSimpleListAction();
		productNameArray.value = res.result.data;
	}
};

const chooseNameAction = async () => {
	if (product_id.value && product_type.value == "hotel") {
		const res = await roomStore.getSimpleListAction({
			hotel_id: product_id.value,
		});
		productVariationArray.value = res.result.data;
	} else if (product_id.value && product_type.value == "entrance_ticket") {
		const res = await variationStore.getSimpleListAction({
			entrance_ticket_id: product_id.value,
		});
		productVariationArray.value = res.result.data;
	}
};

const closeSearchAction = () => {
	product_id.value = "";
	variation_id.value = "";
	daterange.value = "";
	date.value = "";
	created_by.value = "";
	searchModal.value = false;
};

const searchActionHandler = async () => {
	searchModal.value = false;

	filterParams.value.product_id = product_id.value;
	filterParams.value.variation_id = variation_id.value;
	filterParams.value.created_by = created_by.value;

	if (daterange.value && !date.value) {
		filterParams.value.daterange = `${dateFormat(daterange.value[0])} , ${dateFormat(daterange.value[1])}`;
	}

	if (date.value && !daterange.value) {
		filterParams.value.date = dateFormat(date.value);
	}

	await loadData();
};

const openBookingTable = async () => {
	showBookingTable.value = true;
	await availableStore.getListAction({
		...filterParams.value,
		status: "available",
		product_type: "",
	});
};

const closeBookingTable = async () => {
	showBookingTable.value = false;
	selectedRows.value = [];
	await loadData();
};

const copyAction = (data) => {
	let text = "";

	if (data.ownerable_type == "App\\Models\\Hotel") {
		text = `
${data.ownerable.name}
${data.variable.name}
${data.quantity} Rooms

${calculateTotalNights(data.checkin_date, data.checkout_date)} Nights

Check In: ${data.checkin_date}
Check Out: ${data.checkout_date}
Comment: ${data.commands || ""}
    `;
	} else if (data.ownerable_type == "App\\Models\\EntranceTicket") {
		text = `
${data.ownerable.name}
${data.variable.name}

${data.quantity} Adult ${data.child_qty ? data.child_qty + " Child" : ""} 

Date: ${data.checkin_date}
Comment: ${data.commands || ""}
    `;
	}

	navigator.clipboard.writeText(text);
	Swal.fire({
		icon: "success",
		title: "Copied!",
		text: "Details copied to clipboard",
		timer: 1500,
		showConfirmButton: false,
	});
};

const clearFilters = () => {
	product_type.value = "hotel";
	status.value = "";
	order_by.value = "desc";
	product_id.value = "";
	variation_id.value = "";
	daterange.value = "";
	date.value = "";
	created_by.value = "";

	filterParams.value = {
		product_type: "hotel",
		status: "",
		order_by: "desc",
		product_id: "",
		variation_id: "",
		daterange: "",
		date: "",
		created_by: "",
	};

	loadData();
};

onMounted(async () => {
	await chooseTypeAction();
	await loadData();
});
</script>

<template>
	<div class="min-h-screen bg-gray-50">
		<NavbarVue />

		<div class="bg-white px-4 py-4 mt-3" style="border-bottom: 1px solid #d1d5db;">
			<div class="flex sm:flex-row items-center justify-between gap-3">
				<!-- <div class="flex justify-between"> -->
					<p class="text-xl md:text-2xl text-main text-center font-bold text-gray-900">Availabilities</p>
          <button
						v-if="selectedRows.length > 0"
						@click="openBookingTable"
						class="inline-flex items-center py-1 px-3 bg-main text-white text-sm font-medium rounded-3xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm"
					>
						<PlusIcon class="w-4 h-4 mr-1" />
						<small>Book ({{ selectedRows.length }})</small>
					</button>
				<!-- </div> -->
			</div>

			<div class="flex sm:flex-row sm:items-center mt-3 justify-between gap-3">
				<div class="flex items-center gap-2">


					<!-- Create Booking Button -->
					<!-- <button
            v-if="!authStore.isReservation"
            @click="openBookingTable"
            class="inline-flex items-center p-1 px-3 bg-main text-white text-sm font-medium rounded-3xl hover:bg-[#e5533d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF613c] transition-colors shadow-sm"
          >
            <PlusIcon class="w-4 h-4 mr-1" />
            <small>Create Booking</small>
          </button> -->
				</div>

				<div class="flex items-center gap-2">
					<!-- <button
            @click="searchModal = true"
            class="inline-flex items-center p-1 px-3 bg-main text-white text-sm font-medium rounded-3xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <small>Search</small>
          </button>

          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="inline-flex items-center p-1 px-3 bg-main text-white text-sm font-medium rounded-3xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors shadow-sm"
          >
            <small>Clear</small>
          </button> -->
				</div>
			</div>
		</div>

		<!-- Main Content -->
		<div class="">
			<div class="bg-white px-2">
				<div class="px-2 pt-5 pb-3">
					<!-- Product Type  -->
					<div class="mb-4">
						<!-- <label class="block text-xs font-medium text-gray-700 mb-2">Product Type</label> -->
						<div
							class="inline-flex bg-gradient-to-r from-[#FF613c]/10  via-[#FF613c]/20 to-[#f63307]/10 rounded-full"
							style="border: 1px solid rgba(255, 97, 60, 0.2) "
						>
							<button
								@click="product_type = 'hotel'"
								class="py-2.5 px-9 text-xs  rounded-full transition-all duration-200"
								:class="
									product_type === 'hotel' ? 'bg-[#FF613c] text-white shadow-sm' : 'text-gray-700 hover:bg-[#FF613c]/10'
								"
							>
								Hotel
							</button>
							<button
								@click="product_type = 'entrance_ticket'"
								class="px-9 py-2.5 text-xs rounded-full transition-all duration-200 text-start"
								:class="
									product_type === 'entrance_ticket'
										? 'bg-[#FF613c] text-white shadow-sm'
										: 'text-gray-700 hover:bg-[#FF613c]/10'
								"
							>
								Ticket
							</button>
						</div>
					</div>

					<!-- Filters Row -->
					<div class="flex justify-start gap-3">
						<!-- Status Filter -->
						<div>
							<!-- <label class="block text-xs font-medium text-gray-700 mb-1">Status</label> -->
							<select
								v-model="status"
								class="appearance-none bg-[#FF613c] text-white text-xs px-3 py-2.5 pr-6 rounded-full shadow cursor-pointer focus:outline-none"
							>
								<option v-for="statusOption in statusOptions" :key="statusOption.id" :value="statusOption.id">
									{{ statusOption.name }}
								</option>
							</select>
						</div>

						<!-- Order Filter -->
						<div>
							<!-- <label class="block text-xs font-medium text-gray-700 mb-1">Order By</label> -->
							<select
								v-model="order_by"
								class="appearance-none bg-[#FF613c] text-white text-xs px-3 py-2.5 pr-6 rounded-full shadow cursor-pointer focus:outline-none"
							>
								<option value="asc">Ascending</option>
								<option value="desc">Descending</option>
							</select>
						</div>
						<div class="">
							<button
								@click="loadData"
								class="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-white bg-[#FF613c] rounded-full hover:bg-[#e5533d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF613c] transition-colors"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
									/>
								</svg>
								Refresh
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Data Table -->
			<div class="bg-white overflow-hidden px-2">
				<div class="md:hidden">
					<div v-if="!loading && availables?.data?.length > 0" class="space-y-3 p-2 mb-3">
						<!-- Cards -->
						<div
							v-for="item in availables.data"
							:key="item.id"
							class="bg-white rounded-2xl shadow-md"
							style="border: 2px solid #e5e7eb"
						>
							<!-- Header -->
							<div class="p-4 pb-3">
								<div class="flex items-start justify-between mb-3">
									<div class="flex items-center gap-3 flex-1">
										<input
											v-if="item.status === 'available'"
											type="checkbox"
											:value="item.id"
											v-model="selectedRows"
											class="w-5 h-5 rounded flex-shrink-0 mt-1"
											style="border-color: #d1d5db; color: #ff613c"
										/>
										<div class="flex-1">
											<h3 class="text-md" style="font-weight: 400">{{ item.ownerable?.name }} (#{{ item.id }})</h3>
										</div>
									</div>
									<span
										:style="getStatusBadgeStyle(item.status)"
										class="text-xs px-3 py-1.5 rounded-full font-medium flex-shrink-0"
									>
										{{ item.status }}
									</span>
								</div>

								<div class="grid grid-cols-3 gap-4 mb-4">
									<div>
										<div class="text-[10px] text-gray-500 font-medium uppercase tracking-wide mb-1">
											{{ product_type === "hotel" ? "Dates" : "Service Date" }}
										</div>
										<div class="text-xs text-gray-900"  style="font-weight: 420">
											{{ formatDate(item.checkin_date) }}
										</div>
											<div v-if="product_type === 'hotel' && item.checkout_date" class="text-xs">
												to {{ formatDate(item.checkout_date) }}
											</div>
									</div>

									<!-- Quantity -->
									<div>
										<div class="text-[10px] text-gray-500 font-medium uppercase tracking-wide mb-1">
											{{ product_type === "hotel" ? "Rooms" : "Adult" }}
										</div>
										<div class="text-xs  text-gray-900" style="font-weight: 420">
											{{ item.quantity }}
											<span class="text-xs text-gray-500">
												{{ product_type === "hotel" ? "Rooms" : "Adult" }}
											</span>
										</div>
											<div v-if="product_type !== 'hotel' && item.child_qty > 0" class="mt-1">
												{{ item.child_qty }}
												<span class="text-xs text-gray-500">Child</span>
											</div>
											<div v-if="product_type === 'hotel'" class="text-xs text-gray-500 mt-1">
												{{ calculateTotalNights(item.checkin_date, item.checkout_date) }} nights
											</div>
									</div>

									<!-- Requested By -->
									<div>
										<div class="text-[10px] text-gray-500 font-medium uppercase tracking-wide mb-1">Requested By</div>
										<div class="text-xs  text-gray-900 truncate" style="font-weight: 420">
											{{ item.created_by?.name }}
										</div>
									</div>
								</div>

								<!-- Comment Row (Only if status is 'other' and commands exists) -->
								<div v-if="item.status === 'other' && item.commands" class="mb-4">
									<div class="text-[10px] text-gray-500 font-medium uppercase tracking-wide mb-1">Sale Comment</div>
									<div class="rounded-lg p-3" style="background-color: #eff6ff; border: 1px solid #93c5fd">
										<div class="flex items-center gap-2 mb-1">
											<div
												class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
												style="background-color: #2563eb"
											>
												{{ item.created_by?.name?.charAt(0) || "S" }}
											</div>
											<span class="text-xs font-semibold text-blue-700">{{ item.created_by?.name || "Sale" }}</span>
										</div>
										<p class="text-xs text-gray-700 whitespace-pre-wrap mt-2">
											{{ item.commands }}
										</p>
									</div>
								</div>

								<div v-if="item.status === 'other' && item.res_comment" class="mb-4">
									<div class="text-[10px] text-gray-500 font-medium uppercase tracking-wide mb-1">Recommendation</div>
									<div class="rounded-lg p-3" style="background-color: #ffedd5; border: 1px solid #d8b4fe">
										<div class="flex items-center gap-2 mb-1">
											<div
												class="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-semibold"
												style="background-color: #f97316"
											>
												{{ item.updated_by?.name?.charAt(0) || "R" }}
											</div>
											<span class="text-xs font-semibold text-orange-700">{{
												item.updated_by?.name || "Reservation"
											}}</span>
										</div>
										<p class="text-xs text-gray-700 whitespace-pre-wrap mt-2">
											{{ item.res_comment }}
										</p>
									</div>
								</div>

								<div class="flex gap-2">
									<button
										v-if="authStore.isSuperAdmin || authStore.isReservation"
										@click="openChangeStatusModal(item)"
										class="flex-1 px-3 py-2.5 bg-[#FF613c] text-white text-sm font-medium rounded-lg hover:bg-[#e5533d] active:scale-95 transition-all"
									>
										Change
									</button>
									<button
										@click="openInfoDrawer(item)"
										class="flex-1 px-3 py-2.5 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-1"
										style="border: 1px solid #d1d5db"
									>
										<InformationCircleIcon class="w-4 h-4" />
										Details
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Loading -->
				<div v-if="loading" class="py-12">
					<div class="flex flex-col items-center justify-center">
						<div
							class="w-12 h-12 border-4 rounded-full animate-spin mb-3"
							style="border-color: #e5e7eb; border-top-color: #ff613c"
						></div>
						<p class="text-sm text-gray-500">Loading availabilities...</p>
					</div>
				</div>

				<!-- Empty  -->
				<div v-if="!loading && (!availables?.data || availables.data.length === 0)" class="py-12">
					<div class="flex flex-col items-center justify-center text-center">
						<BuildingOfficeIcon class="w-16 h-16 text-gray-300 mb-4" />
						<h3 class="text-sm font-medium text-gray-900 mb-1">No availabilities found</h3>
						<p class="text-sm text-gray-500">Try adjusting your filters</p>
					</div>
				</div>

				<!-- Pagination -->
				<div
					v-if="!loading && availables?.data && availables.data.length > 0"
					class="p-3"
				>
					<Pagination :data="availables" @change-page="changePage" />
				</div>
			</div>
		</div>

		<!-- Advanced Search Modal ()-->
		<Modal :isOpen="searchModal" @closeModal="closeSearchAction">
			<DialogPanel
				class="w-full max-w-lg transform rounded-lg bg-white p-5 text-left align-middle shadow-xl transition-all"
			>
				<DialogTitle as="h3" class="text-lg font-medium text-gray-900 mb-4"> Advanced Filters </DialogTitle>

				<div class="space-y-3">
					<!-- Product Name -->
					<div>
						<label class="block text-xs font-medium text-gray-700 mb-1"> Product Name </label>
						<v-select
							v-model="product_id"
							class="style-chooser w-full"
							:options="productNameArray ?? []"
							@option:selected="chooseNameAction"
							label="name"
							:clearable="true"
							:reduce="(d) => d.id"
							placeholder="Select product"
						></v-select>
					</div>

					<div>
						<label class="block text-xs font-medium text-gray-700 mb-1"> Variation </label>
						<v-select
							v-model="variation_id"
							class="style-chooser w-full"
							:options="productVariationArray ?? []"
							label="name"
							:clearable="true"
							:reduce="(d) => d.id"
							placeholder="Select variation"
						></v-select>
					</div>

					<div v-if="product_type == 'hotel'">
						<label class="block text-xs font-medium text-gray-700 mb-1"> Date Range </label>
						<VueDatePicker v-model="daterange" :format="'yyyy-MM-dd'" range placeholder="Select date range" />
					</div>

					<div v-if="product_type != 'hotel'">
						<label class="block text-xs font-medium text-gray-700 mb-1"> Date </label>
						<VueDatePicker v-model="date" :format="'yyyy-MM-dd'" placeholder="Select date" />
					</div>

					<div class="flex items-center justify-end gap-2 pt-4" style="border-top: 1px solid #e5e7eb">
						<button
							@click="closeSearchAction"
							class="px-4 py-2 text-xs font-medium text-gray-700 rounded hover:bg-gray-50 transition-colors"
							style="border: 1px solid #d1d5db"
						>
							Clear & Close
						</button>
						<button
							@click="searchActionHandler"
							class="px-4 py-2 text-xs font-medium text-white bg-[#ff613c] rounded hover:bg-[#ff4d28] transition-colors"
						>
							Apply Filters
						</button>
					</div>
				</div>
			</DialogPanel>
		</Modal>

		<!-- Change Status Modal -->
		<Modal :isOpen="changeStatusModal" @closeModal="closeChangeStatusModal">
      <div class="fixed inset-0 flex items-center justify-center">
			<DialogPanel
				class="w-full max-w-md transform rounded-xl my-auto bg-white p-6 pb-8 text-left align-top shadow-xl transition-all"
			>
				<DialogTitle as="h3" class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<AdjustmentsHorizontalIcon class="w-6 h-6 text-[#FF613c]" />
					Change Status
				</DialogTitle>

				<div v-if="selectedAvailability" class="space-y-4 p-2">
					<div class="text-center mb-8">
						<div
							class="inline-flex items-center gap-2 px-8 py-4 rounded-full"
							style="background: linear-gradient(to right, rgba(255, 97, 60, 0.1), rgba(255, 97, 60, 0.2))"
						>
							<span class="text-sm text-gray-600">Availability ID:</span>
							<span class="text-sm font-bold text-[#FF613c]">#{{ selectedAvailability.id }}</span>
						</div>
					</div>

					<div class="space-y-4">
						<button
							@click="updateAction('pending', selectedAvailability.id, selectedAvailability.quantity)"
							class="w-full flex items-center justify-between px-4 py-5 rounded-lg transition-all duration-200 focus:outline-none"
							:class="selectedAvailability.status === 'pending' ? 'bg-yellow-50' : 'hover:bg-yellow-50'"
							style="border: 2px solid #fde68a"
						>
							<div class="flex items-center gap-3">
								<div class="p-2 bg-yellow-100 rounded-full">
									<ExclamationTriangleIcon class="w-5 h-5 text-yellow-600" />
								</div>
								<div class="text-left">
									<p class="text-sm font-medium text-gray-900">Pending</p>
									<p class="text-xs text-gray-500">Awaiting confirmation</p>
								</div>
							</div>
							<CheckIcon v-if="selectedAvailability.status === 'pending'" class="w-5 h-5 text-yellow-600" />
						</button>

						<button
							@click="updateAction('available', selectedAvailability.id, selectedAvailability.quantity)"
							class="w-full flex items-center justify-between px-4 py-5 rounded-lg transition-all duration-200 focus:outline-none"
							:class="selectedAvailability.status === 'available' ? 'bg-green-50' : 'hover:bg-green-50'"
							style="border: 2px solid #a7f3d0"
						>
							<div class="flex items-center gap-3">
								<div class="p-2 bg-green-100 rounded-full">
									<CheckIcon class="w-5 h-5 text-green-600" />
								</div>
								<div class="text-left">
									<p class="text-sm font-medium text-gray-900">Available</p>
									<p class="text-xs text-gray-500">Ready for booking</p>
								</div>
							</div>
							<CheckIcon v-if="selectedAvailability.status === 'available'" class="w-5 h-5 text-green-600" />
						</button>

						<button
							@click="updateAction('unavailable', selectedAvailability.id, selectedAvailability.quantity)"
							class="w-full flex items-center justify-between px-4 py-5 rounded-lg transition-all duration-200 focus:outline-none"
							:class="selectedAvailability.status === 'unavailable' ? 'bg-red-50' : 'hover:bg-red-50'"
							style="border: 2px solid #fecaca"
						>
							<div class="flex items-center gap-3">
								<div class="p-2 bg-red-100 rounded-full">
									<XMarkIcon class="w-5 h-5 text-red-600" />
								</div>
								<div class="text-left">
									<p class="text-sm font-medium text-gray-900">Unavailable</p>
									<p class="text-xs text-gray-500">Not available</p>
								</div>
							</div>
							<CheckIcon v-if="selectedAvailability.status === 'unavailable'" class="w-5 h-5 text-red-600" />
						</button>

						<button
							@click="selectedAvailability.status = 'other'"
							class="w-full flex items-center justify-between px-4 py-5 rounded-lg transition-all duration-200 focus:outline-none"
							:class="selectedAvailability.status === 'other' ? 'bg-purple-50' : 'hover:bg-purple-50'"
							style="border: 2px solid #d8b4fe"
						>
							<div class="flex items-center gap-3">
								<div class="p-2 bg-purple-100 rounded-full">
									<InformationCircleIcon class="w-5 h-5 text-purple-600" />
								</div>
								<div class="text-left">
									<p class="text-sm font-medium text-gray-900">Other</p>
									<p class="text-xs text-gray-500">Other Recommendation</p>
								</div>
							</div>
							<CheckIcon v-if="selectedAvailability.status === 'other'" class="w-5 h-5 text-purple-600" />
						</button>

						<div v-if="selectedAvailability.status === 'other'" class="space-y-3">
							<textarea
								v-model="selectedAvailability.res_comment"
								class="w-full focus:outline-none rounded-lg p-3 text-sm"
								rows="4"
								placeholder="Enter other recommendation"
								style="background-color: #faf5ff; border: 1px solid #d8b4fe"
							></textarea>
							<button
								@click="
									updateAction(
										'other',
										selectedAvailability.id,
										selectedAvailability.quantity,
										selectedAvailability.res_comment
									)
								"
								v-if="selectedAvailability.res_comment"
								class="w-full flex justify-center items-center text-sm gap-x-4 py-3 rounded-lg px-3 text-white"
								style="background-color: #7c3aed"
							>
								<CheckIcon class="w-5 h-5 text-white" />
								Save Recommendation
							</button>
						</div>
					</div>

					<div class="pt-4" style="border-top: 1px solid #e5e7eb">
						<button
							@click="closeChangeStatusModal"
							class="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
							style="border: 1px solid #d1d5db"
						>
							Cancel
						</button>
					</div>
				</div>
			</DialogPanel>
      </div>
		</Modal>

		<!-- Detail Drawer -->
		<Teleport to="body">
			<div v-if="infoDrawerOpen" class="fixed inset-0 z-50 overflow-hidden" @click.self="closeInfoDrawer">
				<div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>

				<div
					class="absolute inset-y-0 right-0 h-full w-full max-w-lg bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
					:class="infoDrawerOpen ? 'translate-x-0' : 'translate-x-full'"
				>
					<div class="p-6">
						<div class="flex items-center justify-between mb-6">
							<h3 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
								<InformationCircleIcon class="w-6 h-6 text-[#FF613c]" />
								Availability Details
							</h3>
							<button
								@click="closeInfoDrawer"
								class="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
							>
								<XMarkIcon class="w-6 h-6 text-gray-500" />
							</button>
						</div>

						<!-- Content -->
						<div v-if="selectedDetailItem" class="space-y-6">
							<div class="space-y-4">
								<div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem">
									<p class="text-xs text-gray-500 mb-1">
										{{ product_type === "hotel" ? "Hotel" : "Attraction" }}
									</p>
									<p class="text-sm font-medium text-gray-900">
										{{ selectedDetailItem.ownerable?.name }}
									</p>
								</div>

								<div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem">
									<p class="text-xs text-gray-500 mb-1">{{ product_type === "hotel" ? "Room" : "Ticket" }} Type</p>
									<p class="text-sm font-medium text-gray-900">
										{{ selectedDetailItem.variable?.name }}
									</p>
								</div>

								<!-- Dates -->
								<div class="grid grid-cols-2 gap-4" style="border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem">
									<div>
										<p class="text-xs text-gray-500 mb-1">
											{{ product_type === "hotel" ? "Check-in Date" : "Service Date" }}
										</p>
										<p class="text-sm font-medium text-gray-900">
											{{ formatDate(selectedDetailItem.checkin_date) }}
										</p>
									</div>
									<div v-if="product_type === 'hotel'">
										<p class="text-xs text-gray-500 mb-1">Check-out Date</p>
										<p class="text-sm font-medium text-gray-900">
											{{ formatDate(selectedDetailItem.checkout_date) }}
										</p>
									</div>
								</div>

								<!-- Quantities -->
								<div class="grid grid-cols-2 gap-4" style="border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem">
									<div>
										<p class="text-xs text-gray-500 mb-1">
											{{ product_type === "hotel" ? "Room Quantity" : "Adult Quantity" }}
										</p>
										<p class="text-sm font-medium text-gray-900">
											{{ selectedDetailItem.quantity }}
											{{ product_type === "hotel" ? "Rooms" : "Adult" }}
										</p>
									</div>
									<div>
										<p class="text-xs text-gray-500 mb-1">
											{{ product_type === "hotel" ? "Nights" : "Child Quantity" }}
										</p>
										<p class="text-sm font-medium text-gray-900">
											{{
												product_type === "hotel"
													? calculateTotalNights(selectedDetailItem.checkin_date, selectedDetailItem.checkout_date)
													: selectedDetailItem.child_qty
											}}
										</p>
									</div>
								</div>

								<!-- Customer Info -->
								<div
									v-if="selectedDetailItem.customer_name !== null || selectedDetailItem.customer_phnumber !== null"
									class="grid grid-cols-2 gap-2"
									style="border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem"
								>
									<div>
										<p class="text-xs text-gray-500 mb-1">Customer Name</p>
										<p class="text-sm font-medium text-gray-900">
											{{ selectedDetailItem.customer_name || "-" }}
										</p>
									</div>
									<div>
										<p class="text-xs text-gray-500 mb-1">Customer Phone Number</p>
										<p class="text-sm font-medium text-gray-900">
											{{ selectedDetailItem.customer_phnumber || "-" }}
										</p>
									</div>
								</div>

								<!-- Requested By -->
								<div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem">
									<p class="text-xs text-gray-500 mb-1">Requested By</p>
									<p class="text-sm font-medium text-gray-900">
										{{ selectedDetailItem.created_by?.name }}
									</p>
								</div>

								<!-- Sale Comment -->
								<div
									v-if="selectedDetailItem.status === 'other' && selectedDetailItem.commands"
									style="border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem"
								>
									<p class="text-xs text-gray-500 mb-2">Sale Comment</p>
									<div class="rounded-lg p-3" style="background-color: whitesmoke; border: 1px solid #e5e7eb">
										<p class="text-sm text-gray-700 whitespace-pre-wrap">
											{{ selectedDetailItem.commands }}
										</p>
									</div>
								</div>

								<!-- <div v-if="selectedDetailItem.status === 'other' && selectedDetailItem.res_comment" style="border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem">
                  <p class="text-xs text-gray-500 mb-2">Recommendation</p>
                  <div class="rounded-lg p-3" style="background-color: #FAF5FF; border: 1px solid #D8B4FE">
                    <div class="flex items-center gap-2 mb-1">
                      <div class="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-semibold">
                        {{ selectedDetailItem.updated_by?.name?.charAt(0) || 'R' }}
                      </div>
                      <span class="text-xs font-semibold text-orange-700">{{ selectedDetailItem.updated_by?.name || 'Reservation' }}</span>
                    </div>
                    <p class="text-sm text-gray-700 whitespace-pre-wrap mt-2">
                      {{ selectedDetailItem.res_comment }}
                    </p>
                  </div>
                </div> -->

								<!-- Status -->
								<div class="grid grid-cols-[1fr_auto] items-center">
									<p class="text-xs text-gray-500 mb-1">Current Status :</p>
									<span
										:style="getStatusBadgeStyle(selectedDetailItem.status)"
										class="py-1 px-4 rounded-full text-sm text-center font-medium"
									>
										{{ selectedDetailItem.status }}
									</span>
								</div>
							</div>

							<!-- Action Buttons -->
							<div class="space-y-3 pt-4">
								<button
									v-if="authStore.isSuperAdmin || authStore.isReservation"
									@click="
										openChangeStatusModal(selectedDetailItem);
										closeInfoDrawer();
									"
									class="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-[#FF613c] rounded-lg hover:bg-[#e5533d] focus:outline-none transition-colors"
								>
									<AdjustmentsHorizontalIcon class="w-5 h-5" />
									Change Status
								</button>

								<button
									@click="copyAction(selectedDetailItem)"
									class="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none transition-colors"
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
										/>
									</svg>
									Copy Details
								</button>

								<button
									v-if="authStore.isSuperAdmin || authStore.user?.id == selectedDetailItem.created_by?.id"
									@click="
										deleteAction(selectedDetailItem.id);
										closeInfoDrawer();
									"
									class="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none transition-colors"
								>
									<TrashIcon class="w-5 h-5" />
									Delete
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Teleport>
	</div>
</template>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
	height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
	background: #f9fafb;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
	background: #d1d5db;
	border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
	background: #9ca3af;
}

.overflow-y-auto::-webkit-scrollbar {
	width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
	background: #f9fafb;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
	background: #d1d5db;
	border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
	background: #9ca3af;
}

/* Mobile responsive */
@media (max-width: 640px) {
	.max-w-md {
		max-width: calc(100vw - 2rem);
	}

	table th,
	table td {
		padding: 0.75rem 0.5rem;
		font-size: 0.75rem;
	}

	table th:nth-child(5),
	table th:nth-child(6),
	table td:nth-child(5),
	table td:nth-child(6) {
		max-width: 80px;
	}
}

@media (max-width: 768px) {
	table {
		display: block;
		overflow-x: auto;
		white-space: nowrap;
	}
}
</style>
