<script setup>
import { computed } from "vue";
// import { cva } from "class-variance-authority";

const props = defineProps({
  leftIcon: [Object, Function],
  rightIcon: [Object, Function],
  loading: Boolean,
  disabled: Boolean,
  as: {
    type: [String, Object],
    default: "button",
  },
  intent: {
    type: String,
    validator: (val) =>
      ["primary", "secondary", "danger", "success", "warning", "text"].includes(
        val
      ),
    default: "primary",
  },
});

const buttonClass = computed(() => {
  return cva(
    "inline-flex relative items-center justify-center  min-h-[32px] px-4 py-2 rounded-md shadow hover:shadow-lg transition duration-150",
    {
      variants: {
        intent: {
          primary: "bg-[#ff613c] text-white",
          secondary: "bg-gray-600 text-white",
          success: "bg-green-600 text-white",
          text: "bg-white text-gray-800",
          warning: "bg-yellow-600 text-white",
          danger: "bg-red-600 text-white",
        },
        disabled: {
          true: "!bg-gray-100 !text-gray-400 cursor-not-allowed",
        },
      },
    }
  )({ intent: props.intent, disabled: props.disabled });
});
</script>

<template>
  <component :is="props.as" :disabled="props.disabled" :class="buttonClass">
    <svg
      v-if="props.loading"
      class="animate-spin h-5 w-5 absolute"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <component
      :is="props.leftIcon"
      :class="['w-5 h-5 mr-2', props.loading && 'invisible']"
    />
    <span :class="[props.loading && 'invisible']">
      <slot />
    </span>
    <component
      :is="props.rightIcon"
      :class="['w-5 h-5 ml-2', props.loading && 'invisible']"
    />
  </component>
</template>
