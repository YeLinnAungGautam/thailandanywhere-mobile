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
			class="bg-white/80 backdrop-blur-xl py-7 px-5 sm:p-6 rounded-2xl border border-white/20 shadow-orange-500/10 min-h-[calc(100vh-150px)] text-start"
		>
			<!-- Header -->
			<div class="flex justify-between items-start pb-4 sm:pb-6" style="border-bottom: 1px solid #d1d5db">
				<div class="pr-2">
					<p class="text-main mb-2 text-2xl font-semibold text-slate-800 truncate">Availabilities</p>
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
					<p class="text-xs sm:text-sm font-semibold text-gray-700 mb-3">Select Room</p>
					<div class="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible py-1">
						<div
							v-for="room in detail?.rooms"
							:key="room.id"
							@click="selectRoom(room)"
							:style="formData.variation_id === room.id ? 'border: 1px solid #ff613c' : 'border: 1px solid #e5e7eb'"
							:class="[
								'flex-shrink-0 min-w-[180px] sm:w-auto p-3  rounded-lg cursor-pointer transition-all',
								formData.variation_id === room.id
									? 'border-[#ff613c] bg-[#ff613c]/10'
									: 'border-gray-300 shadow-md hover:border-gray-400',
							]"
						>
							<p class="text-lg sm:text-base font-medium text-gray-800 truncate" :title="room.name">
								{{ truncateText(room.name, 25) }}
							</p>
							<p class="text-sm text-gray-500 mt-1 truncate">฿{{ room.room_price?.toLocaleString() }}</p>
						</div>
					</div>
				</div>

				<!-- Availability Details -->
				<div class="sm:col-span-2 sm:h-[70vh] overflow-y-auto pb-20 px-0 sm:px-4">
					<div v-if="showSuccess" class="flex items-center justify-center h-full px-4">
						<div class="text-center">
							<div class="relative inline-block mb-4 sm:mb-6">
								<div class="absolute inset-0 flex items-center justify-center">
									<div class="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full animate-ping"></div>
								</div>
								<div class="absolute inset-0 flex items-center justify-center">
									<div class="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/30 rounded-full animate-pulse"></div>
								</div>

								<div class="relative bg-white rounded-full p-3 sm:p-4 shadow-lg animate-scale-in">
									<CheckIcon class="w-8 h-8 sm:w-12 sm:h-12 text-green-500 animate-check-draw" />
								</div>
							</div>

							<!-- Success Message -->
							<div class="mb-6 sm:mb-8 animate-fade-in-up" style="animation-delay: 0.2s">
								<h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">All Set! 🎉</h3>
								<p class="text-sm sm:text-sm text-gray-600">Your availability has been created successfully</p>
							</div>

							<!-- Action Buttons -->
							<div
								class="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up"
								style="animation-delay: 0.4s"
							>
								<button
									@click="showSuccess = false"
									class="px-4 py-6 text-xs sm:text-sm font-medium text-[#ff613c] bg-white border-2 border-[#ff613c] rounded-lg hover:bg-[#ff613c] hover:text-white transition-all duration-300"
								>
									<span class="flex items-center justify-center gap-2"> Create Another </span>
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
					<div v-if="!formData.variation_id && !showSuccess" class="flex items-center justify-center h-full">
						<div class="text-center text-gray-400 px-4">
							<BuildingOfficeIcon class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" />
							<p class="text-xs sm:text-sm">Select a room to create availability</p>
						</div>
					</div>

					<div v-if="formData.variation_id && !showSuccess" class="space-y-3 sm:space-y-4">
						<div>
							<p
								class="text-lg sm:text-xl font-semibold text-[#FF613c] mb-2 sm:mb-3 truncate"
								:title="selectedRoom?.name || 'No room selected'"
							>
								{{ truncateText(selectedRoom?.name || "No room selected", 40) }}
							</p>
						</div>

						<!-- Check-in Date -->
						<div>
							<label class="block text-xs font-medium text-gray-700 mb-2">
								Check-in Date <span class="text-red-500">*</span>
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

									<!-- Calendar Button -->
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

										<!-- Hidden Date Input -->
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
						</div>

						<!-- Check-out Date -->
						<div>
							<label class="block text-xs font-medium text-gray-700 mb-2">
								Check-out Date <span class="text-red-500">*</span>
							</label>
							<div class="flex flex-col sm:flex-row gap-2">
								<div class="flex items-center gap-2">
									<!-- Day Input -->
									<input
										type="number"
										v-model.number="dateFormatData.day_checkout"
										@input="updateCheckoutDate"
										placeholder="DD"
										min="1"
										max="31"
										class="w-20 h-12 sm:w-20 sm:h-12 text-lg border border-main px-2 py-1 sm:px-4 sm:py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center"
									/>

									<!-- Month Input -->
									<input
										type="number"
										v-model.number="dateFormatData.month_checkout"
										@input="updateCheckoutDate"
										placeholder="MM"
										min="1"
										max="12"
										class="w-20 h-12 sm:w-20 sm:h-12 text-lg border border-main px-2 py-1 sm:px-4 sm:py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center"
									/>

									<!-- Year Input -->
									<input
										type="number"
										v-model.number="dateFormatData.year_checkout"
										@input="updateCheckoutDate"
										placeholder="YYYY"
										min="1900"
										max="2100"
										class="w-24 h-12 sm:w-24 sm:h-12 text-lg border border-main px-2 py-1 sm:px-4 sm:py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center"
									/>

									<!-- Calendar Button -->
									<div class="relative">
										<button
											type="button"
											@click="openCheckoutDatePicker"
											class="w-32 sm:w-36 h-12 flex items-center justify-center bg-[#FF613c] text-white border border-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
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

										<!-- Hidden Date Input -->
										<input
											ref="checkoutDatePickerInput"
											type="date"
											v-model="formData.checkout_date"
											@change="updateFromCheckoutDatePicker"
											class="absolute opacity-0 pointer-events-none"
										/>
									</div>
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
								min="1"
								class="w-full h-12 text-md px-3 py-2 sm:px-4 sm:py-2.5 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:border-transparent"
								placeholder="Enter Customer Name"
							/>
						</div>

						<!-- Customer Ph Number -->
						<div>
							<label class="block text-xs font-medium text-gray-700 mb-2">
								Customer Phone Number<span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								v-model="formData.customer_phnumber"
								min="1"
								class="w-full h-12 text-md px-3 py-2 sm:px-4 sm:py-2.5 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:border-transparent"
								placeholder="Enter Customer Phone Number"
							/>
						</div>

						<!-- Quantity -->
						<div>
							<label class="block text-xs font-medium text-gray-700 mb-2">
								Number Of Rooms <span class="text-red-500">*</span>
							</label>
							<input
								type="number"
								v-model.number="formData.quantity"
								min="1"
								class="w-full h-12 text-md px-3 py-2 sm:px-4 sm:py-2.5 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:border-transparent"
								placeholder="Enter quantity"
							/>
						</div>
						<div>
							<label class="block text-xs font-medium text-gray-700 mb-2">
								Bed Type <span class="text-gray-400">(Optional)</span>
							</label>

							<div class="flex gap-2 overflow-x-auto py-1">
								<button
									v-for="bedType in bedTypes"
									:key="bedType"
									@click="selectedBedTypeAction(bedType)"
									:class="[
										'flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap rounded-lg border transition-all border-main h-12 flex items-center justify-center',
										selectedBedType === bedType
											? 'bg-[#FF613c] text-white border-[#FF613c]'
											: 'bg-white text-gray-700 border-gray-300 hover:border-[#FF613c] hover:text-[#FF613c]',
									]"
									:title="bedType"
								>
									{{ truncateText(bedType, 15) }}
								</button>
							</div>
						</div>
						<!-- Comment -->
						<div>
							<label class="block text-xs font-medium text-gray-700 mb-2"> Comment (Optional) </label>
							<textarea
								v-model="formData.comment"
								rows="3"
								class="w-full h-32 text-lg px-3 py-3 sm:px-4 sm:py-3 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:border-transparent resize-none"
								placeholder="Add any notes or comments..."
							></textarea>
						</div>
						<button
							@click="resetForm"
							class="w-full sm:w-auto px-4 py-8 text-md font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 h-12"
							style="border: 1px solid #4b5563"
						>
							<XCircleIcon class="w-4 h-4" />
							Reset
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Sticky Button -->
		<div
			v-if="!loading && formData.variation_id && !showSuccess"
			class="fixed bottom-0 left-0 right-0 bg-white border-gray-200 px-5 pb-10 z-50 shadow-lg"
		>
			<div class="container mx-auto">
				<div class="flex flex-col sm:flex-row items-center justify-end gap-3">
					<button
						@click="createAvailability"
						:disabled="!isFormValid"
						:class="[
							'w-full sm:w-auto px-4 py-6 text-sm font-medium text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2',
							isFormValid
								? 'bg-gradient-to-r from-[#ff613c] to-[#ff4d28] hover:shadow-lg hover:scale-[1.02] cursor-pointer'
								: 'bg-gray-300 cursor-not-allowed',
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
import { BuildingOfficeIcon, XCircleIcon, CheckIcon } from "@heroicons/vue/24/outline";
// import { useToast } from "vue-toastification";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { useAvailableStore } from "../../../stores/available";
import { useHotelStore } from "../../../stores/hotel";

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
const hotelStore = useHotelStore();
const loading = ref(false);

const getDetailAction = async (id) => {
	loading.value = true;
	const res = await hotelStore.getDetailAction(id);
	if (res.status == 1) {
		detail.value = res.result;
		console.log(detail.value, "detail");
		selectRoom(detail.value.rooms[0]);
	} else {
		router.push("/");
	}
	loading.value = false;
};

// const toast = useToast();
const availableStore = useAvailableStore();

const formData = ref({
	product_type: "hotel",
	product_id: null,
	variation_id: null,
	checkin_date: null,
	checkout_date: null,
	customer_name: null,
	customer_phnumber: null,
	quantity: 1,
	comment: "",
	status: "pending",
});

const selectedBedType = ref(null);

const dateFormatData = ref({
	day: null,
	month: null,
	year: null,
	day_checkout: null,
	month_checkout: null,
	year_checkout: null,
});

// Check-in date functions
const updateFromCheckinDatePicker = () => {
	if (formData.value.checkin_date && formData.value.checkin_date.includes("-")) {
		const [y, m, d] = formData.value.checkin_date.split("-");
		dateFormatData.value.year = parseInt(y);
		dateFormatData.value.month = parseInt(m);
		dateFormatData.value.day = parseInt(d);
	}
};

const bedTypes = ref([
	"Single bed room",
	"Twin bed room",
	"Double bed room",
	"Queen bed room",
	"King bed room",
	"Super King bed room",
	"Triple bed room",
	"Quad bed room",
	"Bunk bed room",
	"Sofa bed room",
	"Murphy bed room",
	"Hollywood twin beds",
]);

const selectedBedTypeAction = (bedType) => {
	selectedBedType.value = bedType;

	let currentComment = formData.value.comment || "";

	currentComment = currentComment.replace(/^Bed Type : [^|]*\|\s*/, "");

	let newComment = `Bed Type : ${selectedBedType.value} |`;

	if (currentComment.trim()) {
		formData.value.comment = newComment + " " + currentComment;
	} else {
		formData.value.comment = newComment;
	}
};

const updateCheckinDate = () => {
	if (dateFormatData.value.day && dateFormatData.value.month && dateFormatData.value.year) {
		const paddedDay = String(dateFormatData.value.day).padStart(2, "0");
		const paddedMonth = String(dateFormatData.value.month).padStart(2, "0");
		formData.value.checkin_date = `${dateFormatData.value.year}-${paddedMonth}-${paddedDay}`;
	}
};

const checkinDatePickerInput = ref(null);
const openCheckinDatePicker = () => {
	if (checkinDatePickerInput.value) {
		checkinDatePickerInput.value.showPicker();
	}
};

const updateFromCheckoutDatePicker = () => {
	if (formData.value.checkout_date && formData.value.checkout_date.includes("-")) {
		const [y, m, d] = formData.value.checkout_date.split("-");
		dateFormatData.value.year_checkout = parseInt(y);
		dateFormatData.value.month_checkout = parseInt(m);
		dateFormatData.value.day_checkout = parseInt(d);
	}
};

const updateCheckoutDate = () => {
	if (dateFormatData.value.day_checkout && dateFormatData.value.month_checkout && dateFormatData.value.year_checkout) {
		const paddedDay = String(dateFormatData.value.day_checkout).padStart(2, "0");
		const paddedMonth = String(dateFormatData.value.month_checkout).padStart(2, "0");
		formData.value.checkout_date = `${dateFormatData.value.year_checkout}-${paddedMonth}-${paddedDay}`;
	}
};

const checkoutDatePickerInput = ref(null);
const openCheckoutDatePicker = () => {
	if (checkoutDatePickerInput.value) {
		checkoutDatePickerInput.value.showPicker();
	}
};

const selectedRoom = ref(null);

const selectRoom = (room) => {
	formData.value.variation_id = room.id;
	formData.value.product_id = room.hotel_id;
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

const isFormValid = computed(() => {
	return (
		formData.value.variation_id &&
		formData.value.checkin_date &&
		formData.value.checkout_date &&
		formData.value.quantity > 0
	);
});

const viewAllAvailabilities = () => {
	window.open("/availabilities", "_blank");
};

const resetForm = () => {
	formData.value = {
		product_type: "hotel",
		product_id: formData.value.product_id,
		variation_id: null,
		checkin_date: null,
		checkout_date: null,
		quantity: 1,
		customer_name: null,
		customer_phnumber: null,
		comment: "",
		status: "pending",
	};
	dateFormatData.value = {
		day: null,
		month: null,
		year: null,
		day_checkout: null,
		month_checkout: null,
		year_checkout: null,
	};
	selectedRoom.value = null;
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
		frmData.append("variations[0][checkin_date]", dateFormat(formData.value.checkin_date));
		frmData.append("variations[0][checkout_date]", dateFormat(formData.value.checkout_date));
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
			const currentProductId = formData.value.product_id;
			resetForm();
			formData.value.product_id = currentProductId;
		}
	} catch (error) {
		console.error("Error creating availability:", error);
		toast.error(error.response?.data?.message || "Failed to create availability");
	}
};

const truncateText = (text, maxLength) => {
	if (!text) return "";
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + "...";
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

	.truncate {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.overflow-x-auto {
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.overflow-x-auto::-webkit-scrollbar {
		display: none;
	}
}
</style>
