<script setup>
import { storeToRefs } from "pinia";
import { ref, defineProps, defineEmits, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useCustomerStore } from "../../stores/customer";
import debounce from "lodash/debounce";

const props = defineProps({
  customerId: [Number, String],
});

const router = useRouter();
const customerStore = useCustomerStore();
const emit = defineEmits();
const { customer, customers, loading } = storeToRefs(customerStore);

const showCustomer = () => {
  emit("change", "changes");
};

const search = ref("");

const checkValue = ref("");
const change = (id) => {
  if (checkValue.value != id) {
    checkValue.value = id;
    emit("checked", checkValue.value);
    showCustomer();
  } else {
    console.log("again");
  }
};

onMounted(async () => {
  // await customerStore.getListAction();
  if (customers?.value == null) {
    await customerStore.getSimpleListAction();
  }
  console.log(customer.value);
  checkValue.value = props.customerId;
});

// watch(search, async (newValue) => {
//   await customerStore.getSimpleListAction({ search: search.value });
// });
watch(
  search,
  debounce(async (newValue) => {
    await customerStore.getSimpleListAction({ search: search.value });
  }, 500)
);
</script>

<template>
  <div>
    <div class="relative">
      <div
        class="absolute top-2 right-5 z-20 h-screen"
        @click="router.push({ name: 'customer-create' })"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-10 h-10 text-white bg-main p-2 rounded-full"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </div>
      <div
        class="flex justify-start items-center gap-2 py-4 px-4 text-main"
        @click="showCustomer"
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
        <!-- <p v-for="customer in customer?.data" :key="customer.id">
          {{ customer.name }}
        </p> -->
        <div v-for="customer in customers?.data" :key="customer.id">
          <p
            v-if="customer.id == checkValue"
            class="flex justify-start items-center bg-white/80 rounded-lg px-14 border border-main py-2 text-sm text-main"
          >
            {{ customer.name }}
          </p>
        </div>
        <div class="relative">
          <input
            type="text"
            v-model="search"
            name=""
            id=""
            class="w-full pr-4 pl-14 py-2 text-sm rounded-md"
            placeholder="search customer"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 absolute top-2 left-2 text-main"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>

        <div
          class="flex justify-start items-center gap-6 bg-white/50 px-4 py-2"
          v-for="customer in customers?.data"
          :key="customer.id"
        >
          <input
            type="checkbox"
            :name="customer.id"
            :id="customer.id"
            @change="change(customer.id)"
            :checked="checkValue === customer.id"
          />
          <p class="text-sm">{{ customer.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
