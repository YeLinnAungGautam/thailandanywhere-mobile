<template>
  <div class="py-4">
    <div class="flex justify-between items-center">
      <h1
        class="sticky top-0 bg-white z-10 py-1 text-xs font-medium text-[#ff613c]"
      >
        Tax Information
      </h1>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="space-y-2 col-span-2">
        <label for="name" class="text-gray-800 text-[10px]"
          >Transfer code <span class="text-red-800">*</span></label
        >
        <v-select
          v-model="formData.transfer_code"
          class="style-chooser text-xs"
          :options="TaxArray"
          label="name"
          :clearable="false"
          :reduce="(d) => d.name"
          placeholder=""
        ></v-select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, watch, computed } from "vue";
import { Switch } from "@headlessui/vue";

const enabled = ref(false);

import { defineEmits } from "vue";

const emit = defineEmits();

const changeGetInclusiveForm = () => {
  emit("formData", formData.value);
};

const TaxArray = [
  // Bank Transfer, International Remittance, Cash, etc
  { id: "1", name: "MMTT" },
  { id: "2", name: "TT" },
  { id: "3", name: "INTT" },
];

const formData = ref({
  transfer_code: "",
});

const props = defineProps({
  data: Object,
});

watch(
  () => [formData.value.transfer_code],
  (newVal) => {
    changeGetInclusiveForm();
  }
);

onMounted(() => {
  if (props.data) {
    formData.value.transfer_code = props.data.transfer_code;
  }
});
</script>
