<script setup>
import { storeToRefs } from "pinia";
import { ref, defineProps, defineEmits, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useCustomerStore } from "../../stores/customer";
import debounce from "lodash/debounce";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/vue/24/outline";
import { useSidebarStore } from "../../stores/sidebar";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import CustomerCreate from "../../components/CustomerCreate.vue";
import { Switch } from "@headlessui/vue";
import { useAdminStore } from "../../stores/admin";
import { useAuthStore } from "../../stores/auth";

const props = defineProps({
  data: [Object, String],
});

const router = useRouter();
const sidebar = useSidebarStore();
const adminStore = useAdminStore();
const customerStore = useCustomerStore();
const emit = defineEmits(["checked"]);
const { customer, customers, loading } = storeToRefs(customerStore);
const authStore = useAuthStore();
const { isOpenCustomerCreate } = storeToRefs(sidebar);
const { admin } = useAdminStore();

const checkValue = ref("");
const customerName = ref("");
const customerPhone = ref("");
const customerEmail = ref("");
const is_corporate = ref("");
const sold_from = ref("");
const past_user_id = ref("");
const is_past_info = ref(false);
const past_crm_id = ref("");
const showDropdown = ref(false);
const search = ref("");

const soldFrom = [
  { id: "1", name: "Facebook" },
  { id: "2", name: "Twitter" },
  { id: "3", name: "Instagram" },
  { id: "4", name: "Twitter" },
  { id: "5", name: "Viber" },
  { id: "6", name: "Phone" },
  { id: "7", name: "Office" },
];

const filteredCustomers = computed(() => {
  if (!customerName.value || customerName.value.length < 1) {
    return [];
  }
  return (
    customer?.value?.data?.filter((c) =>
      c.name.toLowerCase().includes(customerName.value.toLowerCase()),
    ) || []
  );
});

const selectCustomer = (selectedCustomer) => {
  checkValue.value = selectedCustomer.id;
  customerName.value = selectedCustomer.name;
  customerPhone.value = selectedCustomer.phone_number;
  customerEmail.value = selectedCustomer.email;
  is_corporate.value = selectedCustomer.is_corporate_customer;
  showDropdown.value = false;

  emitData();
};

const emitData = () => {
  let data = {
    id: checkValue.value,
    name: customerName.value,
    phone_number: customerPhone.value,
    email: customerEmail.value,
    is_corporate_customer: is_corporate.value,
    sold_from: sold_from.value,
    is_past_info: is_past_info.value,
    past_crm_id: past_crm_id.value,
    past_user_id: past_user_id.value,
  };
  emit("checked", data);
};

const customerOpenH = () => {
  sidebar.toggleCustomerCreate();
};

const customerClose = async () => {
  sidebar.toggleCustomerCreate();
  await customerStore.getSimpleListAction();
};

const getResponse = (message) => {
  console.log("====================================");
  console.log(message, "this is customer new response");
  console.log("====================================");

  selectCustomer(message.result);
};

watch(
  () => [
    sold_from.value,
    is_past_info.value,
    past_crm_id.value,
    past_user_id.value,
  ],
  () => {
    emitData();
  },
);

watch(
  customerName,
  debounce(async (newValue) => {
    if (newValue && newValue.length > 0) {
      await customerStore.getListAction({ search: newValue, limit: 300 });
      showDropdown.value = true;
    } else {
      showDropdown.value = false;
    }
  }, 500),
);

const getAdmin = async () => {
  await adminStore.getSimpleListAction();
  console.log("====================================");
  console.log(admin?.data);
  console.log("====================================");
};

onMounted(async () => {
  await getAdmin();
  if (customers?.value == null) {
    await customerStore.getListAction();
  }
  console.log(props?.data, "this is props data");
  checkValue.value = props.data.customer_id;
  customerName.value = props.data.customer_name;
  customerPhone.value = props.data.customer_phone;
  customerEmail.value = props.data.customer_email;
  is_corporate.value = props.data.is_corporate;
  sold_from.value = props.data.sold_from;
  is_past_info.value = props.data.is_past_info == 1 ? true : false;
  past_crm_id.value = props.data.past_crm_id;
  past_user_id.value = props.data.past_user_id;
});
</script>

<template>
  <div class="space-y-3">
    <div class="relative bg-white px-3 pb-3 border border-gray-300 rounded-lg">
      <div class="flex justify-between items-center py-2">
        <h1 class="bg-white text-xs font-medium text-[#ff613c]">
          Contact Detail
        </h1>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="space-y-2 relative">
          <label for="name" class="text-gray-800 text-[10px]"
            >Customer Name <span class="text-red-800">*</span></label
          >
          <input
            type="text"
            v-model="customerName"
            @focus="showDropdown = customerName.length > 0"
            @blur="setTimeout(() => (showDropdown = false), 200)"
            id="name"
            class="w-full text-sm px-4 py-3 text-gray-900 border-main border rounded-lg shadow-sm bg-white focus:outline-none focus:border-gray-300"
            placeholder="Type to search customer..."
          />

          <!-- Dropdown list -->
          <div
            v-if="showDropdown && filteredCustomers.length > 0"
            class="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1"
          >
            <div
              v-for="cust in filteredCustomers"
              :key="cust.id"
              @click="selectCustomer(cust)"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
            >
              <p class="font-medium">{{ cust.name }}</p>
              <p class="text-xs text-gray-500">{{ cust.phone_number }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label for="name" class="text-gray-800 text-[10px]"
            >Sold From <span class="text-red-800">*</span></label
          >

          <v-select
            :style="{ fontSize: '11px !important' }"
            v-model="sold_from"
            class="style-chooser text-xs"
            :options="soldFrom"
            label="name"
            :clearable="false"
            :reduce="(d) => d.name"
            placeholder=""
          ></v-select>
        </div>

        <div class="space-y-2">
          <label for="phone" class="text-gray-800 text-[10px]"
            >Phone Number</label
          >
          <input
            type="text"
            v-model="customerPhone"
            disabled
            id="phone"
            class="w-full text-sm px-4 py-3 text-gray-900 border-main border rounded-lg shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
        </div>

        <div class="space-y-2">
          <label for="email" class="text-gray-800 text-[10px]">Email</label>
          <input
            type="text"
            v-model="customerEmail"
            disabled
            id="email"
            class="w-full text-sm px-4 py-3 text-gray-900 border-main border rounded-lg shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
        </div>

        <div class="space-y-2">
          <label for="name" class="text-gray-800 text-[10px]"
            >Is Corporate Customer ?</label
          >
          <div>
            <Switch
              v-model="is_corporate"
              :disabled="true"
              :class="is_corporate ? ' bg-[#ff613c]/50' : 'bg-gray-200'"
              class="relative inline-flex h-[22px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              <span class="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                :class="is_corporate ? 'translate-x-7' : 'translate-x-0'"
                class="pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-[#ff613c] shadow-lg ring-0 transition duration-200 ease-in-out"
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>

    <Modal :isOpen="isOpenCustomerCreate" @closeModal="customerClose">
      <DialogPanel
        class="w-full max-w-[600px] transform overflow-hidden rounded-lg bg-white pt-4 text-left align-middle shadow-xl transition-all"
      >
        <CustomerCreate action="sales" @response="getResponse" />
      </DialogPanel>
    </Modal>
  </div>
</template>
