<template>
	<div class="w-full relative overflow-x-auto scroll-container bg-white  border-gray-200">
		<div class="flex justify-between items-center text-xs relative min-w-full px-4 py-3">
			<div ref="navItem"
				class="flex-1 text-center relative cursor-pointer hover:text-[#FF613c] transition-colors duration-200 py-2"
				@click="setPart('detail')" :class="part == 'detail' ? 'text-[#FF613c]' : 'text-gray-600'">
				<span class="text-xs font-medium whitespace-nowrap">Detail</span>
			</div>

			<div ref="navItem"
				class="flex-1 text-center relative cursor-pointer hover:text-[#FF613c] transition-colors duration-200 py-2"
				@click="setPart('rooms')" :class="part == 'rooms' ? 'text-[#FF613c]' : 'text-gray-600'">
				<span class="text-xs font-medium whitespace-nowrap">Summary</span>
			</div>
			<div ref="navItem"
				class="flex-1 text-center relative cursor-pointer hover:text-[#FF613c] transition-colors duration-200 py-2"
				@click="setPart('media')" :class="part == 'media' ? 'text-[#FF613c]' : 'text-gray-600'">
				<span class="text-xs font-medium whitespace-nowrap">Video</span>
			</div>
			<!-- <div
        ref="navItem"
        class="flex-1 text-center relative cursor-pointer hover:text-[#FF613c] transition-colors duration-200 py-2"
        @click="setPart('availabilities')"
        :class="part == 'availabilities' ? 'text-[#FF613c]' : 'text-gray-600'"
      >
        <span class="text-xs font-medium whitespace-nowrap"
          >Availabilities</span
        >
      </div> -->

			<div class="absolute bottom-0 h-0.5 bg-[#FF613c] transition-all duration-300 ease-in-out" :style="underlineStyle">
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";


const props = defineProps({
	modelValue: {
		type: String,
		default: "detail",
	},
});

const part = ref(props.modelValue);

const emit = defineEmits(["update:modelValue", "partChanged"]);

const navItems = [
	{ key: "detail", label: "Detail" },
	{ key: "rooms", label: "Rooms" },
	{ key: "media", label: "Videos" },
	// { key: "availabilities", label: "Availabilities" },
];

const navContainer = ref(null);

const underlineStyle = computed(() => {
	const activeIndex = navItems.findIndex((item) => item.key === part.value);
	const totalItems = navItems.length;

	if (activeIndex === -1) return { width: "0px", left: "0px" };

	const itemWidth = 100 / totalItems;
	const leftPosition = activeIndex * itemWidth;

	return {
		width: `${itemWidth}%`,
		left: `${leftPosition}%`,
	};
});

const setPart = (p) => {
	part.value = p;
	emit("update:modelValue", p);
	emit("partChanged", p);
};

watch(
	() => props.modelValue,
	(newValue) => {
		if (newValue !== part.value) {
			part.value = newValue;
		}
	}
);
</script>

<style scoped>
.scroll-container {
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.scroll-container::-webkit-scrollbar {
	display: none;
}
</style>
