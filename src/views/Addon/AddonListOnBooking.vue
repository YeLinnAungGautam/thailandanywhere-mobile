<template>
  <div class="relative pt-3 border-b border-black/10 px-2 pb-2">
    <p
      @click="getList()"
      class="bg-blue-500 px-1.5 text-white rounded-lg text-[10px] py-1 absolute -top-5 right-0"
    >
      relaod
    </p>
    <p
      @click="carModalOpen = true"
      class="bg-[#ff613c] px-1.5 text-white rounded-lg text-[10px] py-1 absolute -top-5 right-12"
    >
      + add new
    </p>
    <div v-if="!loading">
      <div
        v-for="(item, index) in addOnList ?? []"
        :key="index"
        class="flex justify-between items-center text-xs py-2"
      >
        <div class="flex justify-start items-center gap-x-1.5">
          <input type="checkbox" class="w-5 h-5" v-model="item.select" />
          <p class="px-2 py-0.5 max-w-32 text-wrap">
            {{ item?.name }}
          </p>
          <p class="bg-green-400/30 px-2 py-0.5 rounded-lg">
            {{ item?.price }} ฿
          </p>
          <p class="bg-yellow-400/30 px-2 py-0.5 rounded-lg">
            {{ item?.cost_price }} ฿
          </p>
        </div>
        <div class="flex justify-end items-center gap-x-2">
          <button
            class="px-2 py-1 text-white rounded-full"
            @click="item.select ? item.quantity++ : null"
            :class="item.select ? 'bg-green-500' : 'bg-gray-300'"
            :disabled="!item.select"
          >
            +
          </button>
          <p class="px-2 py-1 rounded-full">{{ item?.quantity }}</p>
          <button
            class="px-2 py-1 text-white rounded-full"
            @click="item.select && item.quantity > 0 ? item.quantity-- : null"
            :class="item.select ? 'bg-red-500' : 'bg-gray-300'"
            :disabled="!item.select || item.quantity <= 0"
          >
            -
          </button>
        </div>
      </div>
    </div>
    <div class="text-4xl animate-bounce py-3" v-if="loading">...</div>
    <div class="text-xs text-gray-400 py-3" v-if="addons?.data?.length == 0">
      empty
    </div>

    <Modal :isOpen="carModalOpen" @closeModal="carModalOpen = false">
      <DialogPanel
        class="w-full max-w-5xl transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          Addons for type : {{ props.type }} - id : {{ props.id }}
        </DialogTitle>
        <AddonPage :id="props.id" :type="props.type" />
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import { defineProps, onMounted, watch, ref } from "vue";
import { useAddonStore } from "../../stores/addon";
import { storeToRefs } from "pinia";
import debounce from "lodash/debounce";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import Modal from "../../components/Modal.vue";
import AddonPage from "./AddonPage.vue";

const addOnStore = useAddonStore();
const { addons, loading } = storeToRefs(addOnStore);

const props = defineProps({
  id: String,
  type: String,
  addOnList: Array,
});
const emit = defineEmits(["cleanAddOnList"]);

const search = ref("");
const carModalOpen = ref(false);

const addOnListGet = () => {
  if (addons.value == null) return;

  let data = {};
  for (let i = 0; i < addons.value?.data.length; i++) {
    const a = addons.value?.data[i];
    data.select = false;
    data.id = a.id;
    data.name = a.name;
    data.price = a.price;
    data.cost_price = a.cost_price;
    data.quantity = 0;
    props.addOnList.push(data);
    data = {};
  }
};

const getList = async () => {
  emit("cleanAddOnList", "clean");
  const data = {
    product_id: props.id,
    product_type: props.type,
    limit: 1000,
  };
  if (search.value) {
    data.search = search.value;
  }
  await addOnStore.getListAction(data);
  console.log(addons.value, "this is list");
  addOnListGet();
};

onMounted(async () => {
  await getList();
});

watch(
  search,
  debounce(async (newValue) => {
    await getList();
  }, 500)
);
</script>
