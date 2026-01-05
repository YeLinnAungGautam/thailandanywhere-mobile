<template>
	<div>
		<div v-if="loading" class="w-full h-[88vh] rounded-2xl bg-white flex justify-center items-center">
			<div class="text-center">
				<div
					class="w-12 h-12 border-4 border-orange-200 border-t-[#FF613c] rounded-full animate-spin mx-auto mb-4"
				></div>
				<p class="text-slate-600 text-sm">Loading property...</p>
			</div>
		</div>
		<div
			v-if="!loading"
			class="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20  shadow-orange-500/10 h-[calc(100vh-110px)] text-start"
		>
			<div class="flex justify-between items-start pb-6">
				<div>
					<p class="text-lg font-semibold text-slate-800">{{ detail?.name }}</p>
					<div>
						<p class="text-xs text-gray-500 mt-1">{{ detail?.cities[0]?.name }}, Thailand</p>
					</div>
				</div>
				<div class="gap-x-3 flex justify-end items-center flex-nowrap">
					<!-- <div @click="editAction"  class="text-xs bg-[#FF613c] text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-[#FF613c]/90 whitespace-nowrap">
								<PencilSquareIcon class="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1" />  Edit
					</div> -->
					<div @click="closeModal" class="">
						<XMarkIcon class="w-6 h-6 text-gray-500" />
					</div>
				</div>
			</div>

			<div class="">
				<Navigation :modelValue="part" @partChanged="setPart" />
			</div>

			<div v-if="part == 'detail'" class="mt-2 h-[120vh]">
				<Detail :detail="detail" />
			</div>

			<div v-if="part == 'media'" class="mt-2 h-[120vh]">
				<Image :detail="detail" @refresh-detail="refreshHotelDetail" />
			</div>

			<div v-if="part == 'tickets'" class="mt-2 h-[120vh]">
				<Ticket :detail="detail" @update="handleRoomUpdate" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useEntranceStore } from "../../stores/entrance";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
import Navigation from "./attractions/Navigation.vue";
import Detail from "./attractions/Detail.vue";
import Image from "./attractions/Image.vue";
import Ticket from "./attractions/Ticket.vue";

const entranceStore = useEntranceStore();

const props = defineProps({
	attractionId: {
		type: [Number, String],
		required: true,
	},
	closeModal: {
		type: Function,
		required: false,
	},
});

const detail = ref(null);

const part = ref("tickets");

const setPart = (value) => {
	part.value = value;
};
const loading = ref(true);
const getAttraction = async () => {
	loading.value = true;
	const res = await entranceStore.getDetailAction(props.attractionId);

	if (res.status == 1) {
		detail.value = res.result;
		console.log(detail.value, "detail");
		loading.value = false;
	}
};

const editAction = () => {
	window.open(`/products/6?edit=${props.attractionId}`, "_blank");
};

onMounted(async () => {
	await getAttraction();
});
</script>
