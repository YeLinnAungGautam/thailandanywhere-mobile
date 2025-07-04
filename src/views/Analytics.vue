<script setup>
import NavbarVue from "../components/Navbar.vue";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import SalePartVue from "../components/Analytics/SalePart.vue";
import ReceiptPartVue from "../components/Analytics/ReceiptPart.vue";
import TripPartVue from "../components/Analytics/TripPart.vue";
import ExpenseVue from "../components/Analytics/Expense.vue";
import OrderPage from "../components/Analytics/OrderPage.vue";

const router = useRouter();
const route = useRoute();

const selectedTab = ref(0);

const changeTab = (index) => {
  selectedTab.value = index;
  router.push({
    name: "analytics",
    params: {
      page: index,
    },
  });
};

const changeUseRouter = () => {
  if (route.params.page) {
    changeTab(route.params.page);
  } else if (route.params.page == "page") {
    changeTab(0);
  }
};

onMounted(() => {
  changeUseRouter();
});
</script>

<template>
  <div>
    <NavbarVue />

    <div class="w-full">
      <TabGroup :selectedIndex="selectedTab">
        <div class="mb-3 mt-6 px-4">
          <p
            class="text-main text-2xl font-semibold"
            v-if="selectedTab == 0"
            @click="changeTab(0)"
          >
            sales
          </p>

          <p
            class="text-main text-2xl font-semibold"
            v-if="selectedTab == 1"
            @click="changeTab(1)"
          >
            receipts
          </p>
          <p
            class="text-main text-2xl font-semibold"
            v-if="selectedTab == 2"
            @click="changeTab(2)"
          >
            trips
          </p>
          <p
            class="text-main text-2xl font-semibold"
            v-if="selectedTab == 3"
            @click="changeTab(3)"
          >
            expense
          </p>
          <p
            class="text-main text-2xl font-semibold"
            v-if="selectedTab == 4"
            @click="changeTab(4)"
          >
            orders
          </p>
        </div>
        <TabList
          class="flex px-4 pb-4 pt-2 mb-5 space-x-2 rounded-lg shadow-sm bg-white/60 overflow-x-scroll"
        >
          <Tab as="template" v-slot="{ selected }" @click="changeTab(0)">
            <button
              :class="{
                'bg-main text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-2 px-4 bg-[#ff613c] focus:outline-none text-black shadow-custom rounded-full text-center"
            >
              Sales
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(1)">
            <button
              :class="{
                'bg-main text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-2 px-4 bg-[#ff613c] focus:outline-none text-black shadow-custom rounded-full text-center"
            >
              Receipts
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(2)">
            <button
              :class="{
                'bg-main text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-2 px-4 bg-[#ff613c] focus:outline-none text-black shadow-custom rounded-full text-center"
            >
              Trips
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(3)">
            <button
              :class="{
                'bg-main text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-2 px-4 bg-[#ff613c] focus:outline-none text-black shadow-custom rounded-full text-center"
            >
              Expense
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(4)">
            <button
              :class="{
                'bg-main text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-2 px-4 bg-[#ff613c] focus:outline-none text-black shadow-custom rounded-full text-center"
            >
              Orders
            </button>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SalePartVue />
          </TabPanel>
          <TabPanel>
            <ReceiptPartVue />
          </TabPanel>
          <TabPanel>
            <TripPartVue />
          </TabPanel>
          <TabPanel>
            <ExpenseVue />
          </TabPanel>
          <TabPanel>
            <OrderPage />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </div>
</template>
