<script setup>
import { defineProps, onMounted, ref, watch } from "vue";
import { useRoomStore } from "../../stores/room";
import { useVariationStore } from "../../stores/variations";
import {
  BanknotesIcon,
  ListBulletIcon,
  SquaresPlusIcon,
  UsersIcon,
} from "@heroicons/vue/24/outline";

const roomStore = useRoomStore();
const variationStore = useVariationStore();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const detailData = ref("");

const getData = async () => {
  if (props.type === "6") {
    const res = await roomStore.detailAction(props.id);
    console.log(res, "this is room ...");
    detailData.value = res.result;
  }
  if (props.type === "4") {
    const res = await variationStore.detailAction(props.id);
    console.log(res, "this is room ...");
    detailData.value = res.result;
  }
};

// Watch both `id` and `type` for changes
watch(
  () => props.id,
  async (newValue) => {
    if (newValue) {
      await getData();
    }
  }
);

onMounted(async () => {
  await getData();
});
</script>

<template>
  <div>
    <div v-if="detailData != ''">
      <div v-if="type == '6'">
        <div class="w-full h-[300px] overflow-hidden rounded-xl">
          <img
            :src="
              detailData?.images[0]?.image
                ? detailData?.images[0]?.image
                : 'https://placehold.co/400'
            "
            alt=""
            class="h-full w-full object-cover"
          />
        </div>
        <div class="py-3 space-y-3">
          <p class="text-sm font-medium pt-2">{{ detailData?.name }}</p>
          <p class="text-xs pb-2">{{ detailData?.description }}</p>
          <div
            class="flex justify-between items-center gap-x-2 py-2 bg-gray-100 rounded-xl px-4"
          >
            <p class="text-xs text-[#ff613c]">
              {{ detailData?.hotel?.name }}
            </p>
            <p class="text-xs">hotel info ></p>
          </div>
          <div
            class="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-xl"
          >
            <div class="flex justify-start items-center gap-x-2">
              <UsersIcon class="w-4 h-4" />
              <p class="text-xs">max person :</p>
            </div>
            <p class="text-xs font-semibold">
              {{ detailData?.max_person }} Pax
            </p>
          </div>
          <div
            class="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-xl"
          >
            <div class="flex justify-start items-center gap-x-2">
              <SquaresPlusIcon class="w-4 h-4" />
              <p class="text-xs">has breakfast :</p>
            </div>
            <p class="text-xs font-semibold">
              {{ detailData?.has_breakfast == 1 ? "yes" : "no" }}
            </p>
          </div>
          <div
            class="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-xl"
          >
            <div class="flex justify-start items-center gap-x-2">
              <SquaresPlusIcon class="w-4 h-4" />
              <p class="text-xs">is extra :</p>
            </div>
            <p class="text-xs font-semibold">
              {{ detailData?.is_extra == 1 ? "yes" : "no" }}
            </p>
          </div>
          <div
            class="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-xl"
          >
            <div class="flex justify-start items-center gap-x-2">
              <BanknotesIcon class="w-4 h-4" />
              <p class="text-xs">selling price :</p>
            </div>
            <p class="text-xs font-semibold">
              {{ detailData?.room_price }} thb
            </p>
          </div>
          <div
            class="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-xl"
          >
            <div class="flex justify-start items-center gap-x-2">
              <BanknotesIcon class="w-4 h-4" />
              <p class="text-xs">cost price :</p>
            </div>
            <p class="text-xs font-semibold">{{ detailData?.cost }} Pax</p>
          </div>
        </div>
      </div>
      <div v-if="type == '4'">
        <div class="w-full h-[300px] overflow-hidden rounded-xl">
          <img
            :src="
              detailData?.images[0]?.image
                ? detailData?.images[0]?.image
                : 'https://placehold.co/400'
            "
            alt=""
            class="h-full w-full object-cover"
          />
        </div>
        <div class="py-3 space-y-3">
          <p class="text-sm font-medium pt-2">{{ detailData?.name }}</p>
          <p class="text-xs pb-2">{{ detailData?.description }}</p>
          <div
            class="flex justify-between items-center gap-x-2 py-2 bg-gray-100 rounded-xl px-4"
          >
            <p class="text-xs text-[#ff613c]">
              {{ detailData?.entrance_ticket?.name }}
            </p>
            <p class="text-xs">attraction info ></p>
          </div>
          <div class="space-y-2 px-4 py-2 bg-gray-100 rounded-xl">
            <div class="flex justify-start items-center gap-x-2">
              <ListBulletIcon class="w-4 h-4" />
              <p class="text-xs">including services :</p>
            </div>

            <div
              class="text-[10px]"
              v-for="i in detailData?.including_services"
              :key="i"
            >
              <p
                class="bg-[#ff613c] rounded-full min-w-2 min-h-2 inline-block mr-4"
              ></p>
              {{ i }}
            </div>
          </div>
          <div
            class="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-xl"
          >
            <div class="flex justify-start items-center gap-x-2">
              <BanknotesIcon class="w-4 h-4" />
              <p class="text-xs">selling price :</p>
            </div>
            <p class="text-xs font-semibold">{{ detailData?.price }} thb</p>
          </div>
          <div
            class="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-xl"
          >
            <div class="flex justify-start items-center gap-x-2">
              <BanknotesIcon class="w-4 h-4" />
              <p class="text-xs">cost price :</p>
            </div>
            <p class="text-xs font-semibold">
              {{ detailData?.cost_price }} Pax
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="detailData == ''"
      class="w-full h-[300px] flex justify-center items-center"
    >
      loading ...
    </div>
  </div>
</template>
