<template>
	<div v-if="detail" class="flex flex-col sm:flex-row h-[62vh] bg-white">
		<!--  Dropdown -->
		<div class="sm:hidden border-gray-200 px-4 py-3">
			<select v-model="selectedRoomMobile" @change="handleRoomSelect"
				class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent">
				<option value="hotel">Hotel: {{ detail.name }}</option>
				<option v-for="room in roomList" :key="room.id" :value="room.id">Room: {{ room.name }}</option>
			</select>
		</div>

		<div class="hidden sm:block w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
			<div class="p-4">
				<div class="flex justify-between items-center mb-4">
					<h2 class="text-base font-semibold text-[#FF613c]">Hotel</h2>
				</div>
				<div v-if="roomList.length > 0" class="space-y-2">
					<div @click="selectRoom('hotel')" :class="[
						'p-3 rounded-lg border cursor-pointer transition-all hover:border-[#FF613c]',
						selectedRoom == 'hotel' ? 'border-[#FF613c] bg-[#FF613c]/5' : 'border-gray-200 bg-white',
					]">
						<div class="flex-1">
							<h3 class="text-sm font-medium text-gray-900 truncate">
								{{ detail.name }}
							</h3>

							<div class="flex items-center mt-2 space-x-2">
								<div class="flex items-center space-x-1">
									<div :class="[
										'w-2 h-2 rounded-full',
										detail.images && detail.images.length > 0 ? 'bg-green-400' : 'bg-red-400',
									]"></div>
									<span class="text-xs text-gray-500"> {{ detail.images?.length || 0 }} images </span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="flex justify-between items-center mb-4 pt-4">
					<h2 class="text-base font-semibold text-[#FF613c]">Hotel Rooms</h2>
					<span class="text-xs text-gray-500">{{ roomList.length }} rooms type</span>
				</div>

				<!-- Loading State -->
				<div v-if="loading" class="flex justify-center py-8">
					<div class="animate-spin h-8 w-8 border-4 border-[#FF613c] border-t-transparent rounded-full"></div>
				</div>

				<!-- Room List -->
				<div v-if="roomList.length > 0" class="space-y-2">
					<div v-for="room in roomList" :key="room.id" @click="selectRoom(room)" :class="[
						'p-3 rounded-lg border cursor-pointer transition-all hover:border-[#FF613c]',
						selectedRoom?.id === room.id ? 'border-[#FF613c] bg-[#FF613c]/5' : 'border-gray-200 bg-white',
					]">
						<div class="flex items-start justify-between">
							<div class="flex-1 min-w-0">
								<h3 class="text-sm font-medium text-gray-900 truncate">
									{{ room.name }}
								</h3>
								<p class="text-xs text-gray-500 mt-1 truncate">
									Max: {{ room.max_person }} person{{ room.max_person > 1 ? "s" : "" }}
								</p>
								<div class="flex items-center mt-2 space-x-2">
									<div class="flex items-center space-x-1">
										<div :class="[
											'w-2 h-2 rounded-full',
											room.images && room.images.length > 0 ? 'bg-green-400' : 'bg-red-400',
										]"></div>
										<span class="text-xs text-gray-500"> {{ room.images?.length || 0 }} images </span>
									</div>
								</div>
							</div>
							<div v-if="selectedRoom?.id === room.id" class="ml-2 flex-shrink-0">
								<div class="w-2 h-2 bg-[#FF613c] rounded-full"></div>
							</div>
						</div>
					</div>
				</div>

				<!-- Empty State -->
				<div v-else class="text-center py-8">
					<BuildingOfficeIcon class="mx-auto h-12 w-12 text-gray-400" />
					<p class="mt-2 text-sm text-gray-600">No rooms found</p>
					<p class="text-xs text-gray-400 mt-1">This hotel has no rooms yet</p>
				</div>
			</div>
		</div>

		<!-- Room Details -->
		<div class="flex-1 overflow-y-auto">
			<div class="p-4 sm:p-6">
				<div v-if="!selectedRoom" class="flex items-center justify-center h-full">
					<div class="text-center">
						<BuildingOfficeIcon class="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300" />
						<h3 class="mt-4 text-base sm:text-lg font-medium text-gray-900">Select a Room</h3>
						<p class="mt-2 text-xs sm:text-sm text-gray-500">Choose a room from the list to view details</p>
					</div>
				</div>

				<div v-if="selectedRoom == 'hotel'">
					<div class="flex justify-between items-center gap-x-2 sm:gap-x-4">
						<p @click="partHotel = 'image'" class="w-full text-center cursor-pointer rounded-xl py-2 text-xs"
							:class="partHotel == 'image' ? 'bg-[#FF624c] text-white' : 'bg-gray-200'">
							Images
						</p>
						<p @click="partHotel = 'facility'" class="w-full text-center cursor-pointer rounded-xl py-2 text-xs"
							:class="partHotel == 'facility' ? 'bg-[#FF624c] text-white' : 'bg-gray-200'">
							Facilities
						</p>
					</div>

					<div>
						<div class="mt-4 sm:mt-6" v-if="partHotel == 'image'">
							<h3 class="text-sm font-semibold text-gray-700 mb-3">Hotel Images ({{ detail?.images?.length || 0 }})</h3>
							<div v-if="detail?.images && detail?.images.length > 0"
								class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
								<div v-for="(image, index) in detail?.images" :key="image.id" class="relative group">
									<img :src="image.image" :alt="`Room image ${index + 1}`"
										class="w-full h-24 sm:h-32 object-cover rounded-lg border border-gray-200" />
								</div>
							</div>
						</div>

						<div class="mt-4 sm:mt-6" v-if="partHotel == 'facility'">
							<h3 class="text-sm font-semibold text-gray-700 mb-3">
								Hotel Facilities ({{ detail?.facilities?.length || 0 }})
							</h3>
							<div
								class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-lg min-h-[200px] sm:min-h-[300px]">
								<div v-for="facility in detail.facilities" :key="facility.id"
									class="text-xs sm:text-sm text-gray-700 flex items-center truncate">
									<img :src="facility.image" alt="" class="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" />
									<span class="truncate">{{ facility.name }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-if="selectedRoom && selectedRoom !== 'hotel'">
					<!-- Room Header -->
					<div class="flex justify-between items-start mb-4 sm:mb-6">
						<div class="pr-2">
							<h1 class="text-lg sm:text-xl font-semibold text-gray-900 truncate">
								{{ selectedRoom?.name }}
							</h1>
							<p class="text-xs sm:text-sm text-gray-500 mt-1">Room ID: {{ selectedRoom?.id }}</p>
						</div>
						<div class="flex gap-1 sm:gap-2 flex-shrink-0">
							<button @click="openEditModal('details')" v-if="part == 'detail'"
								class="text-xs bg-[#FF613c] text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-[#FF613c]/90 whitespace-nowrap">
								<PencilSquareIcon class="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1" /> Edit
							</button>
						</div>
					</div>

					<div class="flex justify-between items-center mb-4 space-x-2 sm:space-x-4">
						<p class="text-xs font-medium text-gray-900 text-center w-full py-2 rounded-lg cursor-pointer"
							@click="part = 'detail'" :class="part === 'detail' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'">
							Detail
						</p>
						<p class="text-xs font-medium text-gray-900 text-center w-full py-2 rounded-lg cursor-pointer"
							@click="part = 'image'" :class="part === 'image' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'">
							Images
						</p>
						<p class="text-xs font-medium text-gray-900 text-center w-full py-2 rounded-lg cursor-pointer"
							@click="part = 'facility'" :class="part === 'facility' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'">
							Facilities
						</p>
					</div>

					<!-- Room Details Grid -->
					<div class="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-6">
						<!-- Basic Information -->
						<div class="bg-gray-50 p-3 sm:p-4 rounded-lg" v-if="part == 'detail'">
							<h3 class="text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Basic Information</h3>
							<div class="space-y-2 sm:space-y-3 text-xs sm:text-sm">
								<div class="flex justify-between">
									<span class="text-gray-500">Max Person:</span>
									<span class="text-gray-900">{{ selectedRoom.max_person }}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-500">Room Size:</span>
									<span class="text-gray-900 truncate">{{ selectedRoom.meta?.room_size || "Not specified" }}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-500">Room Price:</span>
									<span class="text-gray-900">{{ selectedRoom.room_price || "Not set" }}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-500">Extra Bed:</span>
									<span :class="selectedRoom.is_extra ? 'text-green-600' : 'text-gray-400'">
										{{ selectedRoom.is_extra ? "Available" : "Not available" }}
									</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-500">Breakfast:</span>
									<span :class="selectedRoom.has_breakfast ? 'text-green-600' : 'text-gray-400'">
										{{ selectedRoom.has_breakfast ? "Included" : "Not included" }}
									</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Description -->
					<div class="mt-4 sm:mt-6 bg-gray-50 p-3 sm:p-4 rounded-lg" v-if="part == 'detail'">
						<h3 class="text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Description</h3>
						<p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
							{{ selectedRoom.description || "No description available" }}
						</p>
					</div>

					<!-- Room Images -->
					<div class="mt-4 sm:mt-6" v-if="part == 'image'">
						<h3 class="text-sm font-semibold text-gray-700 mb-3">
							Room Images ({{ selectedRoom.images?.length || 0 }})
						</h3>
						<div v-if="selectedRoom.images && selectedRoom.images.length > 0"
							class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
							<div v-for="(image, index) in selectedRoom.images" :key="image.id" class="relative group">
								<img :src="image.image" :alt="`Room image ${index + 1}`"
									class="w-full h-24 sm:h-32 object-cover rounded-lg border border-gray-200" />
							</div>
						</div>
					</div>

					<!-- Facilities (Read Only) -->
					<div class="mt-4 sm:mt-6"
						v-if="selectedRoom.amenities && selectedRoom.amenities.length > 0 && part == 'facility'">
						<h3 class="text-sm font-semibold text-gray-700 mb-3">Room Amenities (View Only)</h3>
						<div class="space-y-2 sm:space-y-3">
							<div v-for="amenity in selectedRoom.amenities" :key="amenity.title"
								class="bg-gray-50 p-3 rounded-lg border border-gray-200">
								<h4 class="text-xs sm:text-sm font-medium text-gray-900 mb-2">
									{{ amenity.title }}
								</h4>
								<ul class="space-y-1">
									<li v-for="item in amenity.list" :key="item" class="flex items-center text-xs text-gray-600">
										<div class="w-1.5 h-1.5 bg-[#FF613c] rounded-full mr-2 flex-shrink-0"></div>
										<span class="truncate">{{ item }}</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { PencilSquareIcon, TrashIcon, PhotoIcon, XMarkIcon, BuildingOfficeIcon } from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle, Switch } from "@headlessui/vue";
import Modal from "../../../components/Modal.vue";
import { useRoomStore } from "../../../stores/room";
// import { useToast } from "vue-toastification";

const props = defineProps({
	detail: {
		type: Object,
		required: true,
	},
});

const emit = defineEmits(["update"]);

const roomStore = useRoomStore();
// const toast = useToast();

const loading = ref(false);
const roomList = ref([]);
const selectedRoom = ref(null);
const selectedRoomMobile = ref("hotel");
const imageInput = ref(null);
const newImages = ref([]);

const editModal = ref({
	isOpen: false,
	type: null,
});

const editData = ref({
	name: "",
	description: "",
	max_person: 1,
	room_price: 0,
	room_size: "",
	is_extra: false,
	has_breakfast: false,
	is_double: false,
	is_twin: false,
	is_show_on: false,
});

watch(selectedRoom, (newValue) => {
	if (newValue === "hotel") {
		selectedRoomMobile.value = "hotel";
	} else if (newValue && newValue.id) {
		selectedRoomMobile.value = newValue.id;
	}
});


const fetchRooms = async () => {
	if (!props.detail?.id) return;

	loading.value = true;
	try {
		const response = await roomStore.getListAction({
			hotel_id: props.detail.id,
			limit: 1000,
		});

		if (response && roomStore.rooms?.data) {
			roomList.value = roomStore.rooms.data;
			if (roomList.value.length > 0 && !selectedRoom.value) {
				selectedRoom.value = "hotel";
				selectedRoomMobile.value = "hotel";
			}
		}
	} catch (error) {
		console.error("Error fetching rooms:", error);
		toast.error("Failed to load rooms");
	} finally {
		loading.value = false;
	}
};

const part = ref("image");
const partHotel = ref("image");

const handleRoomSelect = () => {
	const value = selectedRoomMobile.value;
	if (value === "hotel") {
		selectRoom("hotel");
	} else {
		const room = roomList.value.find((r) => r.id === parseInt(value));
		if (room) {
			selectRoom(room);
		}
	}
};

const selectRoom = (room) => {
	selectedRoom.value = room;
};

const openEditModal = (type) => {
	if (!selectedRoom.value || selectedRoom.value === "hotel") return;

	window.open(`/products/3?hotel=${props.detail.id}&room_id=${selectedRoom.value.id}`, "_blank");
};

const closeEditModal = () => {
	editModal.value = {
		isOpen: false,
		type: null,
	};
	newImages.value = [];
	editData.value = {
		name: "",
		description: "",
		max_person: 1,
		room_price: 0,
		room_size: "",
		is_extra: false,
		has_breakfast: false,
		is_double: false,
		is_twin: false,
		is_show_on: false,
	};
};

const saveChanges = async () => {
	if (!selectedRoom.value || selectedRoom.value === "hotel") return;

	loading.value = true;
	try {
		const formData = new FormData();

		// Basic details
		formData.append("name", editData.value.name);
		formData.append("description", editData.value.description);
		formData.append("max_person", editData.value.max_person);
		formData.append("room_price", editData.value.room_price);
		formData.append("is_extra", editData.value.is_extra ? 1 : 0);
		formData.append("has_breakfast", editData.value.has_breakfast ? 1 : 0);
		formData.append("meta[room_size]", editData.value.room_size);
		formData.append("meta[is_double]", editData.value.is_double ? 1 : 0);
		formData.append("meta[is_twin]", editData.value.is_twin ? 1 : 0);
		formData.append("meta[is_show_on]", editData.value.is_show_on ? 1 : 0);
		formData.append("hotel_id", props.detail.id);
		formData.append("_method", "PUT");

		const response = await roomStore.updateAction(formData, selectedRoom.value.id);

		toast.success(response.message || "Room updated successfully");
		closeEditModal();
		await fetchRooms();

		const updatedRoom = roomList.value.find((r) => r.id === selectedRoom.value.id);
		if (updatedRoom) {
			selectedRoom.value = updatedRoom;
			selectedRoomMobile.value = updatedRoom.id;
		}
	} catch (error) {
		console.error("Error updating room:", error);
		toast.error(error.response?.data?.message || "Failed to update room");
	} finally {
		loading.value = false;
	}
};

const openImagePicker = () => {
	imageInput.value?.click();
};

const handleImageUpload = (event) => {
	const files = Array.from(event.target.files);
	files.forEach((file) => {
		newImages.value.push({
			file,
			preview: URL.createObjectURL(file),
		});
	});
	event.target.value = "";
};

const removeNewImage = (index) => {
	const image = newImages.value[index];
	if (image.preview) {
		URL.revokeObjectURL(image.preview);
	}
	newImages.value.splice(index, 1);
};


onMounted(() => {
	fetchRooms();
});

onUnmounted(() => {
	newImages.value.forEach((image) => {
		if (image.preview) {
			URL.revokeObjectURL(image.preview);
		}
	});
});
</script>

<style scoped>
@media (max-width: 640px) {
	select {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 0.75rem center;
		background-size: 1em;
	}

	.truncate {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.min-w-0 {
		min-width: 0;
	}
}
</style>
