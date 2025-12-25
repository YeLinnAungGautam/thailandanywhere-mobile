<script setup>
import {
	BuildingOfficeIcon,
	ExclamationTriangleIcon,
	CheckIcon,
	XMarkIcon,
	AdjustmentsHorizontalIcon,
	InformationCircleIcon,
} from "@heroicons/vue/24/outline";
import Swal from "sweetalert2";
import { computed, onMounted, ref, watch, nextTick } from "vue";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
import Modal from "../components/Modal.vue";
import NavbarVue from "../components/Navbar.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useAvailableStore } from "../stores/available";
import Pagination from "../components/PaginationBackUp.vue";

const authStore = useAuthStore();
const availableStore = useAvailableStore();
const { availables, loading } = storeToRefs(availableStore);

const changeStatusModal = ref(false);
const selectedAvailability = ref(null);
const infoDrawerOpen = ref(false);
const selectedDetailItem = ref(null);
const showFilters = ref(false);

const product_type = ref("hotel");
const status = ref("");
const order_by = ref("desc");

const selectedRows = ref([]);

const statusOptions = [
	{ id: "", name: "All" },
	{ id: "pending", name: "Pending" },
	{ id: "available", name: "Available" },
	{ id: "unavailable", name: "Unavailable" },
];

const filterParams = ref({
	product_type: "hotel",
	status: "",
	order_by: "desc",
});

const hasActiveFilters = computed(() => {
	return status.value || order_by.value !== "desc" || product_type.value !== "hotel";
});

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
	(newVal) => {
		filterParams.value.product_type = newVal;
		loadData();
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

const updateAction = async (newStatus, id, quantity) => {
	try {
		closeChangeStatusModal();

		const frmData = new FormData();
		frmData.append("_method", "PUT");
		frmData.append("status", newStatus);
		frmData.append("quantity", quantity);

		const res = await availableStore.updateAction(frmData, id);
		await loadData();
		await Swal.fire({
			icon: "success",
			title: "Success!",
			text: "Status updated successfully",
			timer: 1500,
			showConfirmButton: false,
		});
	} catch (error) {
		console.error("Update error:", error);
		Swal.fire({
			icon: "error",
			title: "Error",
			text: error.response?.data?.message || "Failed to update status. Please try again.",
		});
	}
};

const getStatusBadgeClass = (statusValue) => {
	switch (statusValue) {
		case "pending":
			return "bg-yellow-100 text-yellow-700";
		case "available":
			return "bg-green-100 text-green-700";
		case "unavailable":
			return "bg-red-100 text-red-700";
		default:
			return "bg-gray-100 text-gray-700";
	}
};
// In case of not working with class
const getStatusBadgeStyle = (statusValue) => {
	switch (statusValue) {
		case "pending":
			return {
				backgroundColor: "#FEF3C7", // yellow-100
				color: "#92400E", // yellow-800
				borderColor: "#FDE68A", // yellow-200
				borderWidth: "1px",
				borderStyle: "solid",
			};
		case "available":
			return {
				backgroundColor: "#D1FAE5", // green-100
				color: "#065F46", // green-800
				borderColor: "#A7F3D0", // green-200
				borderWidth: "1px",
				borderStyle: "solid",
			};
		case "unavailable":
			return {
				backgroundColor: "#FEE2E2", // red-100
				color: "#991B1B", // red-800
				borderColor: "#FECACA", // red-200
				borderWidth: "1px",
				borderStyle: "solid",
			};
		default:
			return {
				backgroundColor: "#F3F4F6", // gray-100
				color: "#1F2937", // gray-800
				borderColor: "#E5E7EB", // gray-200
				borderWidth: "1px",
				borderStyle: "solid",
			};
	}
};

const bookSelected = () => {
	if (selectedRows.value.length > 0) {
		Swal.fire({
			title: "Confirm Booking",
			text: `Book ${selectedRows.value.length} selected availability items?`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#FF613c",
			cancelButtonColor: "#6b7280",
			confirmButtonText: "Yes, book now!",
			cancelButtonText: "Cancel",
		}).then((result) => {
			if (result.isConfirmed) {
				console.log("Booking confirmed for:", selectedRows.value);
				selectedRows.value = [];
			}
		});
	}
};

const selectAllRows = (event) => {
	if (!availables.value?.data) return;

	if (event.target.checked) {
		selectedRows.value = availables.value.data.filter((r) => r.status === "available").map((r) => r.id);
	} else {
		selectedRows.value = [];
	}
};

const isAllSelected = computed(() => {
	if (!availables.value?.data || availables.value.data.length === 0) return false;

	const availableItems = availables.value.data.filter((r) => r.status === "available");
	return availableItems.length > 0 && selectedRows.value.length === availableItems.length;
});

const isIndeterminate = computed(() => {
	if (!availables.value?.data) return false;

	const availableItems = availables.value.data.filter((r) => r.status === "available");
	return selectedRows.value.length > 0 && selectedRows.value.length < availableItems.length;
});

watch(
	() => availables.value?.data,
	(newData) => {
		if (newData) {
			selectedRows.value = selectedRows.value.filter((id) => {
				const item = newData.find((r) => r.id === id);
				return item && item.status === "available";
			});
		}
	},
	{ deep: true }
);

onMounted(async () => {
	filterParams.value = {
		product_type: product_type.value,
		status: status.value,
		order_by: order_by.value,
	};
	console.log("admin:" + authStore.isSuperAdmin, "is_reser:" + authStore.isReservation);
	await loadData();
});
</script>

<template>
	<div class="min-h-screen bg-gray-50">
		<!-- Header -->
		<NavbarVue />
		<div class="bg-white border-gray-200 px-4 py-4 mt-3">
			<div class="flex sm:flex-row sm:items-center justify-between gap-3">
				<div class="flex items-center gap-2">
					<p class="text-xl md:text-2xl text-main text-center font-bold text-gray-900">Availabilities</p>
				</div>
			</div>
			<!-- Filter Buttons And Seleted Booking Button  -->
			<div class="flex sm:flex-row sm:items-center mt-3 justify-between gap-3">
				<div class="flex items-center gap-2">
					<!-- Book Selected Button -->
					<button
						v-if="selectedRows.length > 0"
						@click="bookSelected"
						class="inline-flex items-center p-1 px-3 bg-[#FF613c] text-white text-sm font-medium rounded-3xl hover:bg-[#e5533d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF613c] transition-colors shadow-sm"
					>
						<small>Book ({{ selectedRows.length }})</small>
					</button>
				</div>
				<div class="flex items-center gap-2">
					<button
						@click="showFilters = !showFilters"
						class="flex items-center justify-between w-full p-1 bg-gradient-to-r from-[#FF613c]/10 via-[#FF613c]/20 to-[#f63307]/10 rounded-full border border-[#FF613c]/20"
					>
						<div class="flex items-center gap-2">
							<AdjustmentsHorizontalIcon class="w-5 h-5 text-[#FF613c]" />
						</div>
						<div class="flex items-center gap-1">
							<span class="text-xs ms-1 text-[#FF613c]">
								{{ showFilters ? "Hide" : "Show" }}
							</span>
							<svg
								:class="['w-4 h-4 text-[#FF613c] transform transition-transform', showFilters ? 'rotate-180' : '']"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</button>
				</div>
			</div>
		</div>

		<!-- Main Content -->
		<div class="">
			<!-- Filters Card -->
			<div class="bg-white border-main shadow-2xl p-2" :class="{ 'hidden md:block': !showFilters, block: showFilters }">
				<div class="p-4">
					<!-- Product Type Toggle -->
					<div class="mb-6">
						<label class="block text-sm font-medium text-gray-700 mb-3">Product Type</label>
						<div
							class="flex bg-gradient-to-r from-[#FF613c]/10 via-[#FF613c]/20 to-[#f63307]/10 rounded-full p-1 border border-[#FF613c]/20"
						>
							<button
								@click="product_type = 'hotel'"
								class="flex-1 px-4 py-3 text-sm font-medium rounded-full transition-all duration-200 text-center"
								:class="
									product_type === 'hotel' ? 'bg-[#FF613c] text-white shadow-sm' : 'text-gray-700 hover:bg-[#FF613c]/10'
								"
							>
								Hotel
							</button>
							<button
								@click="product_type = 'entrance_ticket'"
								class="flex-1 px-4 py-3 text-sm font-medium rounded-full transition-all duration-200 text-center"
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

					<!-- Filters Grid -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<!-- Status Filter -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
							<select
								v-model="status"
								class="appearance-none bg-[#FF613c] text-white text-xs px-4 py-4 pr-8 rounded-full shadow cursor-pointer focus:outline-none w-full"
							>
								<option v-for="statusOption in statusOptions" :key="statusOption.id" :value="statusOption.id">
									{{ statusOption.name }}
								</option>
							</select>
						</div>

						<!-- Order Filter -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Order By</label>
							<select
								v-model="order_by"
								class="appearance-none bg-[#FF613c] text-white text-xs px-4 py-4 pr-8 rounded-full shadow cursor-pointer focus:outline-none w-full"
							>
								<option value="asc">Ascending</option>
								<option value="desc">Descending</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			<!-- Data Table Card -->
			<div class="bg-white border-main shadow-2xl overflow-hidden">
				<div class="hidden md:block overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-12">
									<input
										type="checkbox"
										:checked="isAllSelected"
										:indeterminate="isIndeterminate"
										@change="selectAllRows"
										class="w-4 h-4 rounded border-gray-300 text-[#FF613c] focus:ring-[#FF613c]"
									/>
								</th>
								<th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
								<th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
								<th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
									{{ product_type === "hotel" ? "Check-in Date" : "Service Date" }}
								</th>
								<th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
									{{ product_type === "hotel" ? "Hotel" : "Attraction" }}
								</th>
								<th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
									{{ product_type === "hotel" ? "Room" : "Ticket" }} Type
								</th>
								<th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
									{{ product_type === "hotel" ? "Room" : "Ticket" }}
								</th>
								<th
									v-if="product_type === 'hotel'"
									class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
								>
									Nights
								</th>
								<th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
									Created
								</th>
								<th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
									Request By
								</th>
								<th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>

						<tbody v-if="!loading && availables?.data?.length > 0" class="divide-y divide-gray-200">
							<tr v-for="item in availables.data" :key="item.id" class="hover:bg-gray-50 transition-colors">
								<!-- Checkbox -->
								<td class="px-4 py-4">
									<input
										v-if="item.status === 'available'"
										type="checkbox"
										:value="item.id"
										v-model="selectedRows"
										class="w-4 h-4 rounded border-gray-300 text-[#FF613c] focus:ring-[#FF613c]"
									/>
								</td>

								<!-- ID -->
								<td class="px-4 py-4 text-sm text-gray-900">#{{ item.id }}</td>

								<!-- Status -->
								<td class="px-4 py-4">
									<span
										:class="[
											'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
											getStatusBadgeClass(item.status),
										]"
									>
										{{ item.status }}
									</span>
								</td>

								<!-- Date -->
								<td class="px-4 py-4 text-sm text-gray-900">
									<div>
										{{ formatDate(item.checkin_date) }}
										<div v-if="product_type === 'hotel' && item.checkout_date" class="text-xs text-gray-500">
											to {{ formatDate(item.checkout_date) }}
										</div>
									</div>
								</td>

								<!-- Product -->
								<td class="px-4 py-4">
									<div class="text-sm font-medium text-gray-900 max-w-[120px] truncate">
										{{ item.ownerable?.name }}
									</div>
								</td>

								<!-- Variation Type -->
								<td class="px-4 py-4">
									<div class="text-sm text-gray-900 max-w-[120px] truncate">
										{{ item.variable?.name }}
									</div>
								</td>

								<!-- Quantity -->
								<td class="px-4 py-4 text-sm text-gray-900">
									<div>
										{{ item.quantity }}
										<span class="text-xs text-gray-500">
											{{ product_type === "hotel" ? "Rooms" : "Adult" }}
										</span>
									</div>
									<div v-if="product_type !== 'hotel' && item.child_qty > 0" class="mt-1">
										{{ item.child_qty }}
										<span class="text-xs text-gray-500">Child</span>
									</div>
								</td>

								<!-- Nights (Hotel only) -->
								<td v-if="product_type === 'hotel'" class="px-4 py-4 text-sm text-gray-900">
									{{ calculateTotalNights(item.checkin_date, item.checkout_date) }}
									<span class="text-xs text-gray-500">nights</span>
								</td>

								<!-- Created Date -->
								<td class="px-4 py-4 text-sm text-gray-900">
									{{ formatDate(item.created_at?.split("T")[0]) }}
								</td>

								<!-- Created By -->
								<td class="px-4 py-4">
									<div class="text-sm text-gray-900 max-w-[120px] truncate">
										{{ item.created_by?.name }}
									</div>
								</td>

								<!-- Actions -->
								<td class="px-4 py-4">
									<div class="flex items-center justify-end gap-2">
										<!-- Change Status Button -->
										<button
											v-if="authStore.isSuperAdmin || authStore.isReservation"
											@click="openChangeStatusModal(item)"
											class="px-3 py-1.5 text-xs font-medium text-white bg-[#FF613c] rounded-lg hover:bg-[#e5533d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF613c] transition-colors"
										>
											Change
										</button>

										<!-- Details Button -->
										<button
											@click="openInfoDrawer(item)"
											class="p-1.5 text-gray-600 hover:text-[#FF613c] hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF613c]"
											title="View Details"
										>
											<InformationCircleIcon class="w-5 h-5" />
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Card For Mobile -->
				<div class="md:hidden">
					<div v-if="!loading && availables?.data?.length > 0" class="space-y-3 p-2">
						<!-- Select All -->
						<div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-2">
							<input
								type="checkbox"
								:checked="isAllSelected"
								:indeterminate="isIndeterminate"
								@change="selectAllRows"
								class="w-5 h-5 rounded border-gray-300 text-[#FF613c] focus:ring-[#FF613c]"
							/>
							<span class="text-sm font-medium text-gray-700">Select All</span>
							<span
								v-if="selectedRows.length > 0"
								class="ml-auto text-xs bg-[#FF613c] text-white px-2 py-1 rounded-full"
							>
								{{ selectedRows.length }} selected
							</span>
						</div>

						<!-- Cards  -->
	<div
  v-for="item in availables.data"
  :key="item.id"
  class="bg-white mb-3 rounded-2xl shadow-xs border border-gray-200 hover:border-gray-300 transition-all duration-200"
>
  <!-- Compact Header -->
  <div class="p-4 pb-3">
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-3">
        <input
          v-if="item.status === 'available'"
          type="checkbox"
          :value="item.id"
          v-model="selectedRows"
          class="w-5 h-5 rounded border-gray-300 text-[#FF613c] focus:ring-[#FF613c]"
        />
        <div>
          <h3 class="text-sm font-bold text-gray-900">#{{ item.id }}</h3>
          <p class="text-xs text-gray-600 mt-1 line-clamp-2">{{ item.ownerable?.name }}</p>
        </div>
      </div>
      <span
        :style="getStatusBadgeStyle(item.status)"
        class="text-xs px-3 py-1.5 rounded-full font-medium"
      >
        {{ item.status }}
      </span>
    </div>

    <div class="grid grid-cols-3 gap-2 mb-4">
      <!-- Type Pill -->
      <div class="bg-blue-50 rounded-lg p-2">
        <div class="text-[10px] text-blue-600 font-medium uppercase tracking-wide mb-1">Type</div>
        <div class="text-xs font-semibold text-blue-700 truncate">
          {{ product_type === "hotel" ? "Hotel" : "Attraction" }}
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg p-2">
        <div class="text-[10px] text-gray-500 font-medium uppercase tracking-wide mb-1">Created</div>
        <div class="flex items-center text-xs font-semibold text-gray-700">
          <svg class="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="truncate">{{ formatDate(item.created_at) }}</span>
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg p-2">
        <div class="text-[10px] text-gray-500 font-medium uppercase tracking-wide mb-1">
          {{ product_type === "hotel" ? "Rooms" : "Adults" }}
        </div>
        <div class="flex items-center text-xs font-semibold text-gray-700">
          <svg class="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{{ item.quantity }}</span>
        </div>
      </div>
    </div>


    <div class="flex gap-2">
      <button
        v-if="authStore.isSuperAdmin || authStore.isReservation"
        @click="openChangeStatusModal(item)"
        class="flex-1 px-3 py-2.5 bg-[#FF613c] text-white text-sm font-medium rounded-lg hover:bg-[#e5533d] active:scale-95 transition-all"
      >
        Change Status
      </button>
      <button
        @click="openInfoDrawer(item)"
        class="flex-1 px-3 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-1"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Details
      </button>
    </div>
  </div>
</div>
					</div>
				</div>

				<!-- Loading State -->
				<div v-if="loading" class="py-12">
					<div class="flex flex-col items-center justify-center">
						<div class="w-12 h-12 border-4 border-gray-200 border-t-[#FF613c] rounded-full animate-spin mb-3"></div>
						<p class="text-sm text-gray-500">Loading availabilities...</p>
					</div>
				</div>

				<!-- Empty State -->
				<div v-if="!loading && (!availables?.data || availables.data.length === 0)" class="py-12">
					<div class="flex flex-col items-center justify-center text-center">
						<BuildingOfficeIcon class="w-16 h-16 text-gray-300 mb-4" />
						<h3 class="text-sm font-medium text-gray-900 mb-1">No availabilities found</h3>
						<p class="text-sm text-gray-500">Try adjusting your filters</p>
					</div>
				</div>

				<!-- Pagination (used different pagination component) -->
				<div
					v-if="!loading && availables?.data && availables.data.length > 0"
					class="px-4 py-3 border-t border-gray-200 bg-gray-50 mt-4"
				>
					<Pagination :data="availables" @change-page="changePage" />
				</div>
			</div>
		</div>

		<!-- Change Status Modal -->
		<Modal :isOpen="changeStatusModal" @closeModal="closeChangeStatusModal">
			<DialogPanel
				class="w-full max-w-md transform rounded-xl mt-28 bg-white p-6 pb-8 text-left align-middle shadow-xl transition-all"
			>
				<DialogTitle as="h3" class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<AdjustmentsHorizontalIcon class="w-6 h-6 text-[#FF613c]" />
					Change Status
				</DialogTitle>

				<div v-if="selectedAvailability" class="space-y-4 p-2">
					<!-- <p class="text-sm text-gray-600 mb-4">Update status for availability #{{ selectedAvailability.id }}</p> -->
					<div class="text-center mb-8">
						<div
							class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF613c]/10 to-[#FF613c]/20 rounded-full"
						>
							<span class="text-sm text-gray-600">Availability ID:</span>
							<span class="text-sm font-bold text-[#FF613c]">#{{ selectedAvailability.id }}</span>
						</div>
					</div>
					<!-- Status Options -->
					<div class="space-y-4">
						<button
							@click="updateAction('pending', selectedAvailability.id, selectedAvailability.quantity)"
							class="w-full flex items-center justify-between px-4 py-5 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
							:class="
								selectedAvailability.status === 'pending'
									? 'border-yellow-400 bg-yellow-50 bg-main text-white'
									: 'border-yellow-200 hover:bg-yellow-50'
							"
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
							class="w-full flex items-center justify-between px-4 py-5 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
							:class="
								selectedAvailability.status === 'available'
									? 'border-green-400 bg-green-50 bg-main text-white'
									: 'border-green-200 hover:bg-green-50'
							"
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
							class="w-full flex items-center justify-between px-4 py-5 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
							:class="
								selectedAvailability.status === 'unavailable'
									? 'border-red-400 bg-red-50 bg-main text-white'
									: 'border-red-200 hover:bg-red-50'
							"
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
					</div>

					<!-- Cancel Button -->
					<div class="pt-4 border-t border-gray-200">
						<button
							@click="closeChangeStatusModal"
							class="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
						>
							Cancel
						</button>
					</div>
				</div>
			</DialogPanel>
		</Modal>

		<!-- Detail Drawer -->
		<Teleport to="body">
			<div v-if="infoDrawerOpen" class="fixed inset-0 z-50 overflow-hidden" @click.self="closeInfoDrawer">
				<!-- Overlay -->
				<div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>

				<!-- Drawer -->
				<div
					class="absolute inset-y-0 right-0 h-full w-full max-w-lg bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
					:class="infoDrawerOpen ? 'translate-x-0' : 'translate-x-full'"
				>
					<div class="p-6">
						<!-- Header -->
						<div class="flex items-center justify-between mb-6">
							<h3 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
								<InformationCircleIcon class="w-6 h-6 text-[#FF613c]" />
								Availability Details
							</h3>
							<button
								@click="closeInfoDrawer"
								class="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
							>
								<XMarkIcon class="w-6 h-6 text-gray-500" />
							</button>
						</div>

						<!-- Content -->
						<div v-if="selectedDetailItem" class="space-y-6">
							<!-- Basic Info -->
							<div class="space-y-4">
								<div class="border-b border-gray-200 pb-4">
									<p class="text-xs text-gray-500 mb-1">
										{{ product_type === "hotel" ? "Hotel" : "Attraction" }}
									</p>
									<p class="text-sm font-medium text-gray-900">
										{{ selectedDetailItem.ownerable?.name }}
									</p>
								</div>

								<div class="border-b border-gray-200 pb-4">
									<p class="text-xs text-gray-500 mb-1">{{ product_type === "hotel" ? "Room" : "Ticket" }} Type</p>
									<p class="text-sm font-medium text-gray-900">
										{{ selectedDetailItem.variable?.name }}
									</p>
								</div>

								<!-- Dates -->
								<div class="grid grid-cols-2 gap-4 border-b border-gray-200 pb-4">
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
								<div class="grid grid-cols-2 gap-4 border-b border-gray-200 pb-4">
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
								<!-- Customer Detail -->
								<div
									v-if="selectedDetailItem.customer_name !== null && selectedDetailItem.customer_phnumber !== null"
									class="grid grid-cols-2 gap-2 border-b"
								>
									<div class="border-gray-200 pb-3">
										<p class="text-xs text-gray-500 mb-1">Customer Name</p>
										<p class="text-sm font-medium text-gray-900">
											{{ selectedDetailItem.customer_name }}
										</p>
									</div>
									<div class="border-gray-200 pb-3">
										<p class="text-xs text-gray-500 mb-1">Customer Phone Number</p>
										<p class="text-sm font-medium text-gray-900">
											{{ selectedDetailItem.customer_phnumber }}
										</p>
									</div>
								</div>

								<!-- Requested By  -->
								<div class="grid grid-cols-2 gap-4 border-b border-gray-200 pb-4">
									<div>
										<p class="text-xs text-gray-500 mb-1">Requestd By</p>
										<p class="text-sm font-medium text-gray-900">
											{{ selectedDetailItem.created_by?.name }}
										</p>
									</div>
								</div>

								<!-- Comment -->
								<div class="border-b border-gray-200 pb-4">
									<p class="text-xs text-gray-500 mb-2">Comment</p>
									<div v-if="selectedDetailItem.commands" class="bg-gray-50 rounded-lg p-3">
										<p class="text-sm text-gray-700 whitespace-pre-wrap">
											{{ selectedDetailItem.commands }}
										</p>
									</div>
									<p v-else class="text-sm text-gray-400 italic">No comment</p>
								</div>

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
									class="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-[#FF613c] rounded-lg hover:bg-[#e5533d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF613c] transition-colors"
								>
									<AdjustmentsHorizontalIcon class="w-5 h-5" />
									Change Status
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
