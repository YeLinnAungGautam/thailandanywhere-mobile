<template>
  <div class="py-4">
    <div class="flex justify-between items-center">
      <h1
        class="sticky top-0 bg-white z-10 py-1 text-xs font-medium text-[#ff613c]"
      >
        Inclusive Detail
      </h1>
      <!-- <div
        class="bg-[#ff613c] cursor-pointer px-1.5 text-white rounded-full"
        @click="changeGetInclusiveForm"
      >
        +
      </div> -->
    </div>
    <div class="space-y-1">
      <!-- <div class="space-y-1">
        <label for="name" class="text-gray-800 text-[10px]"
          >Is Inclusive ?</label
        >
        <div>
          <Switch
            v-model="enabled"
            :class="enabled ? ' bg-[#ff613c]/50' : 'bg-gray-200'"
            class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            <span class="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              :class="enabled ? 'translate-x-9' : 'translate-x-0'"
              class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-[#ff613c] shadow-lg ring-0 transition duration-200 ease-in-out"
            />
          </Switch>
        </div>
      </div> -->

      <div class="grid grid-cols-2 gap-2">
        <div class="space-y-1" v-if="enabled">
          <label for="name" class="text-gray-800 text-[10px]"
            >Inclusive Name <span class="text-red-800">*</span></label
          >
          <input
            type="text"
            v-model="formData.inclusive_name"
            id="name"
            class="w-full text-xs px-4 py-1.5 text-gray-900 border-main border rounded-lg shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
        </div>
        <div class="space-y-1" v-if="enabled">
          <label for="name" class="text-gray-800 text-[10px]"
            >Rate per person <span class="text-red-800">*</span></label
          >
          <input
            type="number"
            v-model="formData.inclusive_rate"
            id="name"
            class="w-full text-xs px-4 py-1.5 text-gray-900 border-main border rounded-lg shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
        </div>
        <div class="space-y-1" v-if="enabled">
          <label for="name" class="text-gray-800 text-[10px]"
            >Quantity <span class="text-red-800">*</span></label
          >
          <input
            type="number"
            v-model="formData.inclusive_quantity"
            id="name"
            class="w-full text-xs px-4 py-1.5 text-gray-900 border-main border rounded-lg shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
        </div>
        <div></div>
        <div class="space-y-1" v-if="enabled">
          <label for="name" class="text-gray-800 text-[10px]"
            >Inclusive Start Date <span class="text-red-800">*</span></label
          >
          <input
            type="date"
            v-model="formData.inclusive_start_date"
            id="name"
            class="text-xs px-4 w-full py-1.5 text-gray-900 border-main border rounded-lg shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
        </div>
        <div class="space-y-1" v-if="enabled">
          <label for="name" class="text-gray-800 text-[10px]"
            >inclusive End Date <span class="text-red-800">*</span></label
          >
          <input
            type="date"
            v-model="formData.inclusive_end_date"
            id="name"
            class="text-xs px-4 py-1.5 w-full text-gray-900 border-main border rounded-lg shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
        </div>
      </div>
      <div class="space-y-1" v-if="enabled">
        <label for="name" class="text-gray-800 text-[10px]"
          >inclusive Description</label
        >
        <textarea
          name=""
          v-model="formData.inclusive_description"
          cols="10"
          class="text-xs px-4 py-1.5 w-full text-gray-900 border-main border rounded-lg shadow-sm bg-white focus:outline-none focus:border-gray-300"
          id=""
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, watch } from "vue";
import { Switch } from "@headlessui/vue";

const enabled = ref(false);

import { defineEmits } from "vue";

const emit = defineEmits();

const changeGetInclusiveForm = () => {
  // Emit the updated inclusive data
  formData.value.is_inclusive = enabled.value ? 1 : 0;
  emit("formData", formData.value);
};

const formData = ref({
  is_inclusive: "",
  inclusive_name: "",
  inclusive_quantity: "",
  inclusive_rate: "",
  inclusive_start_date: "",
  inclusive_end_date: "",
  inclusive_description: "",
});

const props = defineProps({
  data: Object,
});

watch(
  () => [
    formData.value.inclusive_name,
    formData.value.inclusive_quantity,
    formData.value.inclusive_rate,
    formData.value.inclusive_start_date,
    formData.value.inclusive_end_date,
    formData.value.inclusive_description,
  ],
  (newVal) => {
    changeGetInclusiveForm();
  }
);

watch(
  () => [props.data.is_inclusive],
  (newVal) => {
    if (props.data.is_inclusive == 1) {
      enabled.value = true;
    }
  }
);

onMounted(() => {
  if (props.data) {
    formData.value.inclusive_name = props.data.inclusive_name;
    formData.value.inclusive_quantity = props.data.inclusive_quantity;
    formData.value.inclusive_rate = props.data.inclusive_rate;
    formData.value.inclusive_start_date = props.data.inclusive_start_date;
    formData.value.inclusive_end_date = props.data.inclusive_end_date;
    formData.value.inclusive_description = props.data.inclusive_description;

    if (props.data.is_inclusive == 1) {
      enabled.value = true;
    } else {
      enabled.value = false;
    }
  }
});
</script>
