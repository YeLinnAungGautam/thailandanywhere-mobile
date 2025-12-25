<script setup>
const props = defineProps({
  for: String,
  required: Boolean,
});
</script>

<template>
  <!-- <label
    :for="props.for"
    class="mb-1 inline-block text-sm font-medium text-gray-700"
    ><slot /> <span v-if="props.required" class="text-red-600">*</span>
  </label> -->
  <label
    :for="props.for"
    class="absolute left-3 bg-white -top-3 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3 px-1 peer-focus:text-gray-600 peer-focus:text-sm"
  >
    <slot />
  </label>
</template>
