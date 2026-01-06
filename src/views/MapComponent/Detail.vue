<template>

	<div>
		<div v-if="loading" class="w-full h-[88vh] rounded-2xl bg-white flex justify-center items-center">
			<div class="text-center">
				<div class="w-12 h-12 border-4 border-orange-200 border-t-[#FF613c] rounded-full animate-spin mx-auto mb-4">
				</div>
				<p class="text-slate-600 text-sm">Loading property...</p>
			</div>
		</div>
		<div v-if="!loading"
			class="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-orange-500/10 h-[calc(100vh-80px)] text-start">
			<div class="flex justify-between items-start  border-gray-200 pb-6">
				<div>
					<p class="text-lg font-semibold text-slate-800">{{ detail?.name }}</p>
					<div>
						<p class="text-xs text-gray-500 mt-1">{{ detail?.city?.name }}, Thailand</p>
					</div>
				</div>
				<div class="gap-x-3 flex justify-end items-center flex-nowrap">
					<!-- <button @click="editAction"
						class="text-xs bg-[#FF613c] text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-[#FF613c]/90 whitespace-nowrap">
						<PencilSquareIcon class="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1" /> Edit
					</button> -->
					<div @click="closeModal" class="">
						<XMarkIcon class="w-6 h-6 text-gray-500" />
					</div>
				</div>
			</div>

			<div class="">
				<Navigation :modelValue="part" @partChanged="setPart" />
			</div>

			<div v-if="part == 'detail'" class="mt-2 h-[120vh]">
				<Detail :detail="detail" @update="handleDetailUpdate" />
			</div>

			<div v-if="part == 'rooms'" class="mt-2 h-[120vh]">
				<Room :detail="detail" @update="handleRoomUpdate" />
			</div>

			<div v-if="part == 'media'" class="mt-2 h-[120vh]">
				<Images :detail="detail" @refresh-detail="refreshHotelDetail" />
			</div>

			<!-- <div
        v-if="part == 'availabilities'"
        class="mt-2 h-[62vh] overflow-y-auto"
      >
        <Availabilities :detail="detail" />
      </div> -->
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
// import { useToast } from "vue-toastification";
import Navigation from "./hotels/Navigation.vue";
import Detail from "./hotels/Detail.vue";
import Images from "./hotels/Images.vue";
import Room from "./hotels/Room.vue";
import { useHotelStore } from "../../stores/hotel";
import Availabilities from "./hotels/Availabilities.vue";

const router = useRouter();
// const toast = useToast();

const props = defineProps({
	hotelId: {
		type: [Number, String],
		required: true,
	},
	closeModal: {
		type: Function,
		required: false,
	},
});

const hotelStore = useHotelStore();
const detail = ref(null);
const loading = ref(false);
const part = ref("rooms");

const setPart = (p) => {
	part.value = p;
};

const editAction = () => {
	window.open(`/product/hotel/edit/${props.hotelId}`, "_blank");
};

const getDetailAction = async (id) => {
	loading.value = true;
	const res = await hotelStore.getDetailAction(id);
	if (res.status == 1) {
		detail.value = res.result;
		console.log(detail.value, "detail");
	} else {
		router.push("/");
	}
	loading.value = false;
};

const handleDetailUpdate = async (updateInfo) => {
	try {
		loading.value = true;

		const formData = new FormData();

		Object.keys(updateInfo.data).forEach((key) => {
			if (updateInfo.data[key] !== null && updateInfo.data[key] !== undefined) {
				if (key === "facilities") {
					const facilities = updateInfo.data[key];

					for (let i = 0; i < facilities.length; i++) {
						let facility = facilities[i];
						formData.append(`facilities[${i}]`, facility);
					}
				} else if (key === "nearby_places") {
					const nearbyPlaces = updateInfo.data[key];

					for (let i = 0; i < nearbyPlaces.length; i++) {
						const place = nearbyPlaces[i];

						formData.append(`nearby_places[${i}][name]`, place.name || "");
						formData.append(`nearby_places[${i}][distance]`, place.distance || "");

						if (place.img) {
							formData.append(`nearby_places[${i}][image]`, place.img);
						} else if (place.image) {
							formData.append(`nearby_places[${i}][image]`, place.image);
						}
					}
				} else {
					formData.append(key, updateInfo.data[key]);
				}
			}
		});

		formData.append("_method", "PUT");

		console.log("FormData contents:");
		for (let [key, value] of formData.entries()) {
			console.log(key, value);
		}

		const response = await hotelStore.updateAction(detail.value.id, formData);

		if (response.status === 1) {
			toast.success(response.message || "Hotel updated successfully");
			await getDetailAction(detail.value.id);
		} else {
			toast.error(response.message || "Update failed");
		}
	} catch (error) {
		console.error("Update failed:", error);
		toast.error(error.response?.data?.message || "Update failed");
	} finally {
		loading.value = false;
	}
};

const refreshHotelDetail = async () => {
	await getDetailAction(detail.value.id);
};

const handleRoomUpdate = async (roomData) => {
	console.log("Room update:", roomData);
	toast.success("Room updated successfully");
};

onMounted(async () => {
	if (props.hotelId) {
		await getDetailAction(props.hotelId);
	}
});
</script>
