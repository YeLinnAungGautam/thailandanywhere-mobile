<template>
	<div>
		<!-- Loading -->
		<div v-if="loading" class="w-full h-[88vh] flex justify-center items-center bg-white rounded-2xl">
			<div class="text-center">
				<div
					class="w-12 h-12 border-4 border-orange-200 border-t-[#FF613c] rounded-full animate-spin mx-auto mb-4"
				></div>
				<p class="text-slate-600 text-sm">Loading property...</p>
			</div>
		</div>

		<!-- Main Content -->
		<div
			v-if="!loading"
			class="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-white/20 shadow-orange-500/10 min-h-[calc(100vh-150px)] text-start"
		>
			<!-- Header -->
			<div class="flex justify-between items-start pb-4 sm:pb-6" style="border-bottom: 1px solid #d1d5db">
				<div class="pr-2">
					<p class="text-2xl text-main font-semibold text-slate-800 truncate">Availabilities</p>
					<p class="text-base sm:text-lg font-semibold text-slate-800 truncate">
						{{ detail?.name }}
					</p>
					<div>
						<p class="text-xs text-gray-500 mt-1 truncate">{{ detail?.city?.name }}, Thailand</p>
					</div>
				</div>
				<div class="gap-x-2 flex flex-nowrap flex-shrink-0">
					<div @click="closeModal" class="cursor-pointer">
						<XMarkIcon class="w-6 h-6 text-gray-500" />
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
				<!-- Room Selection -->
				<div
					class="sm:col-span-1 sm:h-[70vh] overflow-y-auto sm:border-b-0 sm:border-r pb-4 sm:pb-20 pr-0 sm:pr-4"
					style="border-bottom: 1px solid #d1d5db"
				>
					<p class="text-sm font-semibold mb-3">Select Ticket Type</p>
					<!-- Horizontal scroll for mobile, vertical for desktop -->
					<div class="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible py-1">
						<div
							v-for="room in detail?.variations"
							:key="room.id"
							@click="selectRoom(room)"
							:style="formData.variation_id === room.id ? 'border: 1px solid #ff613c' : 'border: 1px solid #e5e7eb'"
							:class="[
								'flex-shrink-0 min-w-[180px] sm:w-auto p-3 border rounded-lg cursor-pointer transition-all',
								formData.variation_id === room.id
									? 'border-[#ff613c] bg-[#ff613c]/10'
									: 'border-gray-300 shadow-md hover:border-gray-400',
							]"
						>
							<p class="text-lg font-medium text-gray-800">{{ truncateText(room.name, 25) }}</p>
							<p class="text-xs text-gray-500 mt-1">฿{{ room.price?.toLocaleString() }}</p>
						</div>
					</div>
				</div>

				<!-- Form And Details -->
				<div class="sm:col-span-2 sm:h-[70vh] overflow-y-auto pb-32 px-0 sm:px-4">
					<!-- Success Message -->
					<div v-if="showSuccess" class="flex items-center justify-center h-full px-4">
						<div class="text-center">
							<!-- Animated icon -->
							<div class="relative inline-block mb-6">
								<div class="absolute inset-0 flex items-center justify-center">
									<div class="w-20 h-20 bg-green-500/20 rounded-full animate-ping"></div>
								</div>
								<div class="absolute inset-0 flex items-center justify-center">
									<div class="w-16 h-16 bg-green-500/30 rounded-full animate-pulse"></div>
								</div>
								<div class="relative bg-white rounded-full p-4 shadow-lg animate-scale-in">
									<CheckIcon class="w-12 h-12 text-green-500 animate-check-draw" />
								</div>
							</div>

							<div class="mb-6 animate-fade-in-up">
								<h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">All Set! 🎉</h3>
								<p class="text-sm text-gray-600">Your availability has been created successfully</p>
							</div>

							<div class="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up">
								<button
									@click="showSuccess = false"
									class="px-4 py-6 text-xs sm:text-sm font-medium text-[#ff613c] bg-white border-2 border-[#ff613c] rounded-lg hover:bg-[#ff613c] hover:text-white transition-all duration-300"
								>
									Create Another
								</button>

								<router-link
									to="/availabilities"
									class="px-4 py-6 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#ff613c] to-[#ff4d28] rounded-lg hover:shadow-lg transition-all duration-300"
								>
									<button>
										<span class="flex items-center justify-center gap-2"> View All Availabilities </span>
									</button>
								</router-link>
							</div>
						</div>
					</div>

					<!-- Prompt to select room -->
					<div
						v-if="!formData.variation_id && !showSuccess"
						class="flex items-center justify-center h-full text-gray-400 text-sm"
					>
						Select a ticket type to create availability
					</div>

					<!-- Form Inputs -->
					<div v-if="formData.variation_id && !showSuccess" class="space-y-4">
						<p
							class="text-lg sm:text-xl font-semibold text-[#FF613c] mb-2 sm:mb-3 truncate"
							:title="selectedRoom?.name || 'No ticket selected'"
						>
							{{ selectedRoom?.name }}
						</p>

						<!-- Service Date -->
						<div>
							<label class="block text-xs font-medium text-gray-700 mb-2">
								Service Date <span class="text-red-500">*</span>
							</label>
							<div class="flex flex-col sm:flex-row gap-2">
								<div class="flex items-center gap-2">
									<!-- Day Input -->
									<input
										type="number"
										v-model.number="dateFormatData.day"
										@input="updateCheckinDate"
										placeholder="DD"
										min="1"
										max="31"
										class="w-20 h-12 sm:w-20 sm:h-12 text-lg border border-main px-2 py-1 sm:px-4 sm:py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center"
									/>
									<!-- Month Input -->
									<input
										type="number"
										v-model.number="dateFormatData.month"
										@input="updateCheckinDate"
										placeholder="MM"
										min="1"
										max="12"
										class="w-20 h-12 sm:w-20 sm:h-12 text-lg border border-main px-2 py-1 sm:px-4 sm:py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center"
									/>
									<!-- Year Input -->
									<input
										type="number"
										v-model.number="dateFormatData.year"
										@input="updateCheckinDate"
										placeholder="YYYY"
										min="1900"
										max="2100"
										class="w-24 h-12 sm:w-24 sm:h-12 text-lg border border-main px-2 py-1 sm:px-4 sm:py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center"
									/>
									<div class="relative">
										<button
											type="button"
											@click="openCheckinDatePicker"
											class="w-32 sm:w-36 h-12 flex items-center justify-center bg-[#FF613c] text-white border border-main rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
										>
											<svg
												class="w-4 h-4 sm:w-5 sm:h-5 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
											<span class="text-sm sm:text-sm ml-2">Choose Date</span>
										</button>
									</div>
									<input
										ref="checkinDatePickerInput"
										type="date"
										v-model="formData.checkin_date"
										@change="updateFromCheckinDatePicker"
										class="absolute opacity-0 pointer-events-none"
									/>
								</div>
							</div>
						</div>

						<!-- Customer Name -->
						<div>
							<label class="block text-xs font-medium text-gray-700 mb-2">
								Customer Name <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								v-model="formData.customer_name"
								placeholder="Customer Name"
								class="w-full h-12 text-lg px-3 py-2 sm:px-4 sm:py-2.5 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
							/>
						</div>

						<!-- Customer Phone -->
						<div>
							<label class="block text-xs font-medium text-gray-700 mb-2">
								Customer Phone Number <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								v-model="formData.customer_phnumber"
								placeholder="Phone Number"
								class="w-full h-12 text-lg px-3 py-2 sm:px-4 sm:py-2.5 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
							/>
						</div>

						<!-- Adult Tickets -->
						<div>
							<label class="block text-xs font-medium text-gray-700 mb-2">
								Number of Adult Tickets <span class="text-red-500">*</span>
							</label>
							<input
								type="number"
								v-model.number="formData.quantity"
								min="1"
								placeholder="Number of Adult Tickets"
								class="w-full h-12 text-lg px-3 py-2 sm:px-4 sm:py-2.5 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
							/>
						</div>

						<!-- Child Tickets -->
						<div>
							<label class="block text-xs font-medium text-gray-700 mb-2"> Number of Child Tickets </label>
							<input
								type="number"
								v-model.number="formData.child_qty"
								min="0"
								placeholder="Number of Child Tickets"
								class="w-full h-12 text-lg px-3 py-2 sm:px-4 sm:py-2.5 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
							/>
						</div>

						<!-- Comment -->
						<div>
							<label class="block text-xs font-medium text-gray-700 mb-2"> Comment (Optional) </label>
							<textarea
								v-model="formData.comment"
								rows="3"
								placeholder="Add any notes or comments..."
								class="w-full h-32 text-lg px-3 py-3 sm:px-4 sm:py-3 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent resize-none"
							></textarea>
						</div>
						<button
							@click="resetForm"
							style="margin-top: 20px;"
							class="w-full sm:w-auto px-4 py-8 text-md font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 h-12"
						>
							Reset
						</button>
					</div>
				</div>
			</div>
		</div>

		<div
			v-if="!loading && formData.variation_id && !showSuccess"
			class="fixed bottom-0 left-0 right-0 bg-white border-gray-200 px-5 pb-16 z-10 shadow-lg"
		>
			<div class="container mx-auto">
				<div class="flex flex-col sm:flex-row items-center justify-end gap-3">
					<button
						@click="createAvailability"
						:disabled="!isFormValid"
						:class="[
							'w-full sm:w-auto px-4 py-8 text-md font-medium text-white rounded-lg transition-colors flex items-center justify-center gap-2 h-12',
							isFormValid ? 'bg-[#ff613c] hover:bg-[#ff4d28] cursor-pointer' : 'bg-gray-300 cursor-not-allowed',
						]"
					>
						<CheckIcon class="w-5 h-5" />
						Create Availability
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { defineProps, ref, computed, onMounted } from "vue";
import { CheckIcon, XMarkIcon } from "@heroicons/vue/24/outline";
// import { useToast } from "vue-toastification";
import { useAvailableStore } from "../../../stores/available";
import { useEntranceStore } from "../../../stores/entrance";

const props = defineProps({
	detailId: {
		type: Number,
		required: true,
	},
	closeModal: {
		type: Function,
		required: true,
	},
});

const detail = ref(null);
const entranceStore = useEntranceStore();
const loading = ref(false);

const getDetailAction = async (id) => {
	loading.value = true;
	const res = await entranceStore.getDetailAction(id);
	if (res.status == 1) {
		detail.value = res.result;
		console.log(detail.value, "detail");
		if (detail.value.variations && detail.value.variations.length > 0) {
			selectRoom(detail.value.variations[0]);
		}
	} else {
		router.push("/");
	}
	loading.value = false;
};

// const toast = useToast();
const availableStore = useAvailableStore();

const dateFormatData = ref({
	day: null,
	month: null,
	year: null,
});

const formData = ref({
	product_type: "entrance_ticket",
	product_id: null,
	variation_id: null,
	checkin_date: null,
	checkout_date: null,
	customer_name: null,
	customer_phnumber: null,
	quantity: 1,
	child_qty: 0,
	comment: "",
	status: "pending",
});

const selectedRoom = ref(null);

const selectRoom = (room) => {
	formData.value.variation_id = room.id;
	formData.value.product_id = room.entrance_ticket_id;
	selectedRoom.value = room;
};

const dateFormat = (inputDateString) => {
	if (!inputDateString) return null;
	const inputDate = new Date(inputDateString);
	const year = inputDate.getFullYear();
	const month = String(inputDate.getMonth() + 1).padStart(2, "0");
	const day = String(inputDate.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const checkinDatePickerInput = ref(null);

const updateFromCheckinDatePicker = () => {
	if (!formData.value.checkin_date) return;
	const [y, m, d] = formData.value.checkin_date.split("-");
	dateFormatData.value.year = parseInt(y);
	dateFormatData.value.month = parseInt(m);
	dateFormatData.value.day = parseInt(d);
};

const updateCheckinDate = () => {
	if (dateFormatData.value.day && dateFormatData.value.month && dateFormatData.value.year) {
		formData.value.checkin_date = `${dateFormatData.value.year}-${String(dateFormatData.value.month).padStart(
			2,
			"0"
		)}-${String(dateFormatData.value.day).padStart(2, "0")}`;
	}
};

const truncateText = (text, maxLength) => {
	if (!text) return "";
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + "...";
};

const openCheckinDatePicker = () => {
	checkinDatePickerInput.value?.showPicker();
};

const isFormValid = computed(() => {
	return formData.value.variation_id && formData.value.checkin_date && formData.value.quantity > 0;
});

const resetForm = () => {
	formData.value = {
		product_type: "entrance_ticket",
		product_id: selectedRoom.value?.entrance_ticket_id || null,
		variation_id: null,
		checkin_date: null,
		checkout_date: null,
		customer_name: null,
		customer_phnumber: null,
		quantity: 1,
		child_qty: 0,
		comment: "",
		status: "pending",
	};
	selectedRoom.value = null;
	dateFormatData.value = {
		day: null,
		month: null,
		year: null,
	};
};

const showSuccess = ref(false);

const createAvailability = async () => {
	if (!isFormValid.value) {
		toast.error("Please fill in all required fields");
		return;
	}

	try {
		const frmData = new FormData();
		frmData.append("product_type", formData.value.product_type);
		frmData.append("product_id", formData.value.product_id);
		frmData.append("variations[0][variable_id]", formData.value.variation_id);
		frmData.append("variations[0][quantity]", formData.value.quantity);
		frmData.append("variations[0][child_qty]", formData.value.child_qty);
		frmData.append("variations[0][checkin_date]", dateFormat(formData.value.checkin_date));
		frmData.append("variations[0][checkout_date]", dateFormat(formData.value.checkin_date));
		frmData.append("variations[0][status]", formData.value.status);

		if (formData.value.comment) {
			frmData.append("variations[0][commands]", formData.value.comment);
		}

		if (formData.value.customer_name) {
			frmData.append("variations[0][customer_name]", formData.value.customer_name);
		}

		if (formData.value.customer_phnumber) {
			frmData.append("variations[0][customer_phnumber]", formData.value.customer_phnumber);
		}

		const res = await availableStore.addNewAction(frmData);

		if (res.result) {
			showSuccess.value = true;
			resetForm();
		}
	} catch (error) {
		console.error("Error creating availability:", error);
		toast.error(error.response?.data?.message || "Failed to create availability");
	}
};

const viewAllAvailabilities = () => {
	window.open("/availabilities", "_blank");
};

onMounted(async () => {
	console.log("Availability create component mounted with detail:", props.detailId);
	await getDetailAction(props.detailId);
});
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
	width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
	background: #888;
	border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
	background: #555;
}

.overflow-x-auto {
	-webkit-overflow-scrolling: touch;
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.overflow-x-auto::-webkit-scrollbar {
	display: none;
}

/* Animations */
@keyframes scale-in {
	0% {
		transform: scale(0);
		opacity: 0;
	}

	50% {
		transform: scale(1.1);
	}

	100% {
		transform: scale(1);
		opacity: 1;
	}
}

@keyframes fade-in-up {
	0% {
		transform: translateY(20px);
		opacity: 0;
	}

	100% {
		transform: translateY(0);
		opacity: 1;
	}
}

@keyframes check-draw {
	0% {
		transform: scale(0) rotate(-45deg);
		opacity: 0;
	}

	50% {
		transform: scale(1.2) rotate(0deg);
	}

	100% {
		transform: scale(1) rotate(0deg);
		opacity: 1;
	}
}

.animate-scale-in {
	animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-fade-in-up {
	animation: fade-in-up 0.6s ease-out forwards;
	opacity: 0;
}

.animate-check-draw {
	animation: check-draw 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards;
	opacity: 0;
}

@media (max-width: 640px) {
	.min-w-[180px] {
		min-width: 180px;
	}
}
</style>
