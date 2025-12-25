<template>
	<div>
		<!-- Loading -->
		<div v-if="loading" class="w-full h-[88vh] flex justify-center items-center bg-white rounded-2xl">
			<div class="text-center">
				<div class="w-12 h-12 border-4 border-orange-200 border-t-[#FF613c] rounded-full animate-spin mx-auto mb-4">
				</div>
				<p class="text-slate-600 text-sm">Loading property...</p>
			</div>
		</div>

		<!-- Main Content -->
		<div v-if="!loading"
			class="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-white/20 shadow-orange-500/10 min-h-[calc(100vh-150px)] text-start">
			<!-- Header -->
			<div class="flex justify-between items-start border-b border-gray-200 pb-4 sm:pb-6">
				<div class="pr-2">
					<p class="text-base sm:text-lg text-main font-semibold text-slate-800 truncate">Availabilities</p>
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
					class="sm:col-span-1 sm:h-[70vh] overflow-y-auto border-b sm:border-b-0 sm:border-r pb-4 sm:pb-20 pr-0 sm:pr-4">
					<p class="text-sm font-semibold mb-3">Select Ticket Type</p>
					<!-- Horizontal scroll for mobile, vertical for desktop -->
					<div class="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible py-1">
						<div v-for="room in detail?.variations" :key="room.id" @click="selectRoom(room)" :class="[
							'flex-shrink-0 min-w-[180px] sm:w-auto p-3 border rounded-lg cursor-pointer transition-all',
							formData.variation_id === room.id
								? 'border-[#ff613c] bg-[#ff613c]/10'
								: 'border-gray-300 hover:border-gray-400',
						]">
							<p class="text-xs font-medium text-gray-800">{{ room.name }}</p>
							<p class="text-xs text-gray-500 mt-1">฿{{ room.price?.toLocaleString() }}</p>
						</div>
					</div>
				</div>

				<!-- Form And Details -->
				<div class="sm:col-span-2 sm:h-[70vh] overflow-y-auto pb-20 px-0 sm:px-4">
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
								<button @click="showSuccess = false"
									class="px-4 py-2 text-xs sm:text-sm font-medium text-[#ff613c] bg-white border-2 border-[#ff613c] rounded-lg hover:bg-[#ff613c] hover:text-white transition-all duration-300">
									Create Another
								</button>
								<button @click="viewAllAvailabilities"
									class="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#ff613c] to-[#ff4d28] rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
									View All Availabilities
								</button>
							</div>
						</div>
					</div>

					<!-- Prompt to select room -->
					<div v-if="!formData.variation_id && !showSuccess"
						class="flex items-center justify-center h-full text-gray-400 text-sm">
						Select a ticket type to create availability
					</div>

					<!-- Form Inputs -->
					<div v-if="formData.variation_id && !showSuccess" class="space-y-4">
						<p class="text-sm font-semibold text-[#FF613c]">{{ selectedRoom?.name }}</p>

						<!-- Service Date -->
						<div class="flex flex-col sm:flex-row gap-2">
							<div class="flex items-center gap-2">
								<!-- Day Input -->
								<input type="number" v-model.number="dateFormatData.day" @input="updateCheckinDate" placeholder="DD"
									min="1" max="31"
									class="w-20 border border-main focus:outline-none focus:border-transparent py-1 rounded-lg text-center focus:ring-2 focus:ring-[#FF613c]" />
								<!-- Month Input -->
								<input type="number" v-model.number="dateFormatData.month" @input="updateCheckinDate" placeholder="MM"
									min="1" max="12"
									class="w-20 border border-main focus:outline-none focus:border-transparent py-1 rounded-lg text-center focus:ring-2 focus:ring-[#FF613c]" />
								<!-- Year Input -->
								<input type="number" v-model.number="dateFormatData.year" @input="updateCheckinDate" placeholder="YYYY"
									min="1900" max="2100"
									class="w-24 border border-main focus:outline-none focus:border-transparent px-2 py-1 rounded-lg text-center focus:ring-2 focus:ring-[#FF613c]" />
								<button type="button" @click="openCheckinDatePicker"
									class="w-32 h-10 bg-[#FF613c] text-white rounded-lg flex items-center justify-center gap-1">
									<span class="text-sm">Choose Date</span>
								</button>
								<input ref="checkinDatePickerInput" type="date" v-model="formData.checkin_date"
									@change="updateFromCheckinDatePicker" class="absolute opacity-0 pointer-events-none" />
							</div>
						</div>

						<!-- Customer Name -->
						<div>
							<label class="block text-xs font-medium text-gray-700 mb-2">
								Customer Name <span class="text-red-500">*</span>
							</label>
							<input type="text" v-model="formData.customer_name" placeholder="Customer Name"
								class="w-full px-3 py-2 border border-main focus:outline-none focus:border-transparent rounded-lg focus:ring-2 focus:ring-[#FF613c]" />
						</div>

						<!-- Customer Phone -->
						<div>
							<label class="block text-xs font-medium text-gray-700 mb-2">
								Customer Phone Number <span class="text-red-500">*</span>
							</label>
							<input type="text" v-model="formData.customer_phnumber" placeholder="Phone Number"
								class="w-full px-3 py-2 border border-main focus:outline-none focus:border-transparent rounded-lg focus:ring-2 focus:ring-[#FF613c]
								focus:outline-none focus:border-transparent
								" />
						</div>

						<!-- Adult Tickets -->
						<div>
							<label class="block text-xs font-medium text-gray-700 mb-2">
								Number of Adult Tickets <span class="text-red-500">*</span>
							</label>
							<input type="number" v-model.number="formData.quantity" min="1" placeholder="Number of Adult Tickets"
								class="w-full px-3 py-2 border border-main focus:outline-none focus:border-transparent rounded-lg focus:ring-2 focus:ring-[#FF613c]" />
						</div>

						<!-- Child Tickets -->
						<div>
							<label class="block text-xs font-medium text-gray-700 mb-2"> Number of Child Tickets </label>
							<input type="number" v-model.number="formData.child_qty" min="0" placeholder="Number of Child Tickets"
								class="w-full px-3 py-2 border border-main focus:outline-none focus:border-transparent rounded-lg focus:ring-2 focus:ring-[#FF613c]" />
						</div>

						<!-- Comment -->
						<div>
							<label class="block text-xs font-medium text-gray-700 mb-2"> Comment (Optional) </label>
							<textarea v-model="formData.comment" rows="3" placeholder="Add any notes or comments..."
								class="w-full px-3 py-2 border border-main focus:outline-none focus:border-transparent rounded-lg focus:ring-2 focus:ring-[#FF613c] resize-none"></textarea>
						</div>

						<!-- Action Buttons -->
						<div class="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t">
							<button @click="resetForm" class="px-4 py-2 border rounded-lg bg-gray-100">Reset</button>
							<button @click="createAvailability" :disabled="!isFormValid"
								class="px-4 py-2 rounded-lg bg-[#FF613c] text-white disabled:bg-gray-300">
								Create Availability
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { defineProps, ref, computed, onMounted, watch } from "vue";
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
