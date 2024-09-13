<script setup>
import { storeToRefs } from "pinia";
import { ref, defineProps, defineEmits, onMounted, watch } from "vue";
import { Switch } from "@headlessui/vue";
import { useAuthStore } from "../../stores/auth";
import { useAdminStore } from "../../stores/admin";

const props = defineProps({
  data: Object,
});

const authStore = useAuthStore();
const adminStore = useAdminStore();

const { admin } = storeToRefs(adminStore);

const enabled = ref(false);
const emit = defineEmits();

const showInfo = () => {
  emit("change", "changes");
};

const change = (id) => {
  checkValue.value = id;
  emit("checked", checkValue.value);
};

const formData = ref({
  is_inclusive: "",
  inclusive_name: "",
  inclusive_quantity: "",
  inclusive_rate: "",
  inclusive_start_date: "",
  inclusive_end_date: "",
});

const getFunction = () => {
  console.log(formData.value);
  if (enabled.value) {
    formData.value.is_inclusive = 1;
  } else {
    formData.value.is_inclusive = 0;
  }
  emit("formData", formData.value);
};

onMounted(async () => {
  if (props.data) {
    formData.value.inclusive_name = props.data.inclusive_name;
    formData.value.inclusive_quantity = props.data.inclusive_quantity;
    formData.value.inclusive_rate = props.data.inclusive_rate;
    formData.value.inclusive_start_date = props.data.inclusive_start_date;
    formData.value.inclusive_end_date = props.data.inclusive_end_date;
    if (props.data.is_inclusive == 1) {
      enabled.value = true;
    }
  }
  // await adminStore.getSimpleListAction();
});
</script>

<template>
  <div>
    <div class="relative">
      <div
        class="flex justify-start items-center gap-2 py-4 px-4 text-main"
        @click="showInfo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back
      </div>
      <div class="px-4 w-full space-y-2">
        <p class="text-sm text-red text-end">noted # need to fill all data</p>

        <div class="space-y-2">
          <label for="name" class="text-sm text-gray-800">Is Inclusive</label>
          <div>
            <Switch
              v-model="enabled"
              :class="enabled ? ' bg-main' : 'bg-black'"
              class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              <span class="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                :class="enabled ? 'translate-x-9' : 'translate-x-0'"
                class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
              />
            </Switch>
          </div>
        </div>
        <div class="space-y-2" v-if="enabled">
          <label for="name" class="text-sm text-gray-800">Inclusive Name</label>
          <input
            type="text"
            v-model="formData.inclusive_name"
            id="name"
            class="min-w-full block h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
        </div>
        <div class="space-y-2" v-if="enabled">
          <label for="name" class="text-sm text-gray-800"
            >Inclusive quantity</label
          >
          <input
            type="number"
            v-model="formData.inclusive_quantity"
            id="name"
            class="min-w-full block h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
        </div>
        <div class="space-y-2" v-if="enabled">
          <label for="name" class="text-sm text-gray-800">Inclusive Rate</label>
          <input
            type="number"
            v-model="formData.inclusive_rate"
            id="name"
            class="min-w-full block h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
        </div>
        <div class="space-y-2" v-if="enabled">
          <label for="name" class="text-sm text-gray-800"
            >Inclusive Start Date</label
          >
          <input
            type="date"
            v-model="formData.inclusive_start_date"
            id="name"
            class="min-w-[95%] block h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
        </div>

        <div class="space-y-2" v-if="enabled">
          <label for="name" class="text-sm text-gray-800"
            >inclusive End Date</label
          >
          <input
            type="date"
            v-model="formData.inclusive_end_date"
            id="name"
            class="min-w-[95%] block h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
        </div>

        <div class="flex justify-end items-center pt-4">
          <div
            class="space-x-4 flex justify-center items-center gap-2 px-4 py-2 rounded border-main bg-main text-white border"
            @click="getFunction"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="">Add</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
