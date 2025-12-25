<script setup>
import Label from "./Label.vue";
import Input from "./Input.vue";
import InputErrorMessage from "./InputErrorMessage.vue";
import InputHelperMessage from "./InputHelperMessage.vue";
// import { v4 as uuid } from "uuid";
import { computed, provide } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: () => `field-${uuid()}`,
  },
  label: String,
  required: Boolean,
  error: String,
  help: String,
});

const ariaDescribedBy = computed(() => {
  return !!props.help ? `help-${uuid()}` : null;
});

provide(
  "field",
  computed(() => {
    return {
      ...props,
      invalid: !!props.error,
      ariaDescribedBy: ariaDescribedBy.value,
    };
  })
);
</script>

<template>
  <div class="relative">
    <slot v-bind="props" />
    <InputErrorMessage v-if="props.error">{{ props.error }}</InputErrorMessage>
    <InputHelperMessage :id="ariaDescribedBy" v-if="props.help">{{
      props.help
    }}</InputHelperMessage>
    <Label :for="props.id" :required="props.required" v-if="props.label">{{
      props.label
    }}</Label>
  </div>
</template>
