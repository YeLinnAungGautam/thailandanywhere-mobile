<script setup>
import { storeToRefs } from "pinia";
import { ref, defineProps, defineEmits, onMounted, watch } from "vue";
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

const search = ref("");

// past_user_id: "",
// is_past_info: "",
// past_crm_id: "",

const checkValue = ref("");
const customerName = ref("");
const customerPhone = ref("");
const customerEmail = ref("");
const is_corporate = ref("");
const sold_from = ref("");
const past_user_id = ref("");
const is_past_info = ref(false);
const past_crm_id = ref("");

const soldFrom = [
  { id: "1", name: "Facebook" },
  { id: "2", name: "Twitter" },
  { id: "3", name: "Instagram" },
  { id: "4", name: "Twitter" },
  { id: "5", name: "Viber" },
  { id: "6", name: "Phone" },
  { id: "7", name: "Office" },
];

const change = (d) => {
  console.log("====================================");
  console.log(d);
  console.log("====================================");
  if (checkValue.value != d.id) {
    checkValue.value = d.id;
    customerName.value = d.name;
    customerPhone.value = d.phone_number;
    customerEmail.value = d.email;
    is_corporate.value = d.is_corporate_customer;

    let data = {
      id: d.id,
      name: d.name,
      phone_number: d.phone_number,
      email: d.email,
      is_corporate_customer: d.is_corporate_customer,
      sold_from: sold_from.value,
      is_past_info: is_past_info.value,
      past_crm_id: past_crm_id.value,
      past_user_id: past_user_id.value,
    };
    emit("checked", data);
  } else {
    console.log("again");
  }
};

const changeSoldFrom = () => {
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

// const customerOpen = ref(false);
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

  change(message.result);
};

watch(
  () => [
    sold_from.value,
    is_past_info.value,
    past_crm_id.value,
    past_user_id.value,
  ],
  () => {
    changeSoldFrom();
  }
);

const getAdmin = async () => {
  await adminStore.getSimpleListAction();
  console.log("====================================");
  console.log(admin?.data);
  console.log("====================================");
};

onMounted(async () => {
  // await customerStore.getListAction();
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

watch(
  search,
  debounce(async (newValue) => {
    await customerStore.getListAction({ search: search.value, limit: 300 });
  }, 500)
);
</script>

<template>
  <div class="space-y-3">
    <div class="relative h-[30vh] bg-white rounded-lg overflow-y-scroll px-3">
      <div
        class="flex justify-between items-center sticky top-0 py-2 z-10 bg-white"
      >
        <h1 class="bg-white text-xs font-medium text-[#ff613c]">
          Search Customer from Database
        </h1>
        <div
          class="bg-[#ff613c] cursor-pointer px-1.5 text-white rounded-full"
          @click="customerOpenH"
        >
          +
        </div>
      </div>

      <div class="w-full space-y-2 pt-2">
        <!-- <p v-for="customer in customer?.data" :key="customer.id">
          {{ customer.name }}
        </p> -->
        <!-- <p
          class="flex justify-start items-center bg-white/80 rounded-lg px-4 py-2 text-xs"
        >
          <UserIcon class="w-4 h-4 mr-3" />
          {{ customerName }}
        </p> -->

        <div class="relative">
          <input
            type="text"
            v-model="search"
            name=""
            id=""
            class="w-full pr-4 pl-12 py-2 border border-gray-300 text-xs rounded-lg"
            placeholder="search customer"
          />
          <MagnifyingGlassIcon
            class="w-4 h-4 absolute text-[#ff613c] top-2 left-4"
          />
        </div>

        <div
          class="flex justify-start items-center gap-6 bg-white/50 px-4 py-2"
          v-for="customer in customer?.data"
          :key="customer.id"
        >
          <input
            type="checkbox"
            :name="customer.id"
            :id="customer.id"
            @change="change(customer)"
            :checked="checkValue === customer.id"
          />
          <p class="text-xs">{{ customer.name }}</p>
        </div>
      </div>
    </div>
    <div class="relative bg-white rounded-lg px-3 pb-3">
      <div class="flex justify-between items-center py-2">
        <h1 class="bg-white text-xs font-medium text-[#ff613c]">
          Contact Detail
        </h1>
        <div
          class="bg-[#ff613c] cursor-pointer px-1.5 text-white rounded-full"
          @click="customerOpenH"
        >
          +
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="space-y-2">
          <label for="name" class="text-gray-800 text-[10px]"
            >Customer Name <span class="text-red-800">*</span></label
          >
          <input
            type="text"
            v-model="customerName"
            disabled
            id="name"
            class="w-full text-xs px-4 py-1.5 text-gray-900 border-main border rounded-lg shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
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
          <label for="name" class="text-gray-800 text-[10px]"
            >Phone Number</label
          >
          <input
            type="text"
            v-model="customerPhone"
            disabled
            id="name"
            class="w-full text-xs px-4 py-1.5 text-gray-900 border-main border rounded-lg shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
        </div>
        <div class="space-y-2">
          <label for="name" class="text-gray-800 text-[10px]">Email</label>
          <input
            type="text"
            v-model="customerEmail"
            disabled
            id="name"
            class="w-full text-xs px-4 py-1.5 text-gray-900 border-main border rounded-lg shadow-sm bg-white focus:outline-none focus:border-gray-300"
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
      <div class="pt-4" v-if="authStore.isSuperAdmin">
        <div class="flex justify-between items-center py-2">
          <h1 class="bg-white text-xs font-medium text-[#ff613c]">
            Is Pass Info
          </h1>
          <div>
            <Switch
              v-model="is_past_info"
              :class="is_past_info ? ' bg-[#ff613c]/50' : 'bg-gray-200'"
              class="relative inline-flex h-[22px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              <span class="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                :class="is_past_info ? 'translate-x-7' : 'translate-x-0'"
                class="pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-[#ff613c] shadow-lg ring-0 transition duration-200 ease-in-out"
              />
            </Switch>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2" v-if="is_past_info">
          <div class="space-y-2">
            <p class="text-gray-800 text-[10px]">Past Admin ID</p>

            <v-select
              v-if="admin?.data"
              :style="{ fontSize: '11px !important' }"
              v-model="past_user_id"
              class="style-chooser text-xs"
              :options="admin?.data"
              label="name"
              :clearable="false"
              :reduce="(d) => d.id"
              placeholder=""
            ></v-select>
            <p
              class="text-[10px] bg-gray-100 py-2 text-center rounded-lg"
              @click="getAdmin()"
              v-if="!admin?.data"
            >
              reload
            </p>
          </div>
          <div class="space-y-2">
            <p class="text-gray-800 text-[10px]">Past CRM ID</p>

            <input
              type="text"
              v-model="past_crm_id"
              id="name"
              class="w-full text-xs px-4 py-2 text-gray-900 border-main border rounded-lg shadow-sm bg-white focus:outline-none focus:border-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
    <Modal :isOpen="isOpenCustomerCreate" @closeModal="customerClose">
      <DialogPanel
        class="w-full max-w-[600px] transform overflow-hidden rounded-lg bg-white pt-4 text-left align-middle shadow-xl transition-all"
      >
        <CustomerCreate action="sales" @response="getResponse" />
        <!-- <div class="flex items-center justify-end">
          <button @click="customerClose" class="text-sm">close</button>
        </div> -->
      </DialogPanel>
    </Modal>
  </div>
</template>
