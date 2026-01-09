<template>
  <div
    class="flex justify-start items-center gap-x-2 overflow-x-scroll no-sidebar-container pb-2 border-r border-gray-300"
  >
    <div
      class="p-2 shadow-sm rounded-md flex justify-start items-center gap-x-2 cursor-pointer hover:bg-[#ff613c]/20 bg-white"
    >
      <img src="https://placehold.co/400" class="w-12 h-12 rounded-xl" alt="" />
      <div class="min-w-[150px] space-y-1">
        <p class="whitespace-nowrap text-[12px] font-medium">CRM ID</p>
        <p class="text-[10px] font-normal whitespace-nowrap">
          {{ data?.crm_id }}
        </p>
      </div>
    </div>
    <div
      class="p-2 shadow-sm rounded-md flex justify-start items-center gap-x-2 cursor-pointer hover:bg-[#ff613c]/20 bg-white"
    >
      <img src="https://placehold.co/400" class="w-12 h-12 rounded-xl" alt="" />
      <div class="min-w-[150px] space-y-1">
        <p class="whitespace-nowrap text-[12px] font-medium">Full Name</p>
        <p class="text-[10px] font-normal whitespace-nowrap">
          {{ data?.customer_name }}
        </p>
      </div>
    </div>
    <div
      class="p-2 shadow-sm rounded-md flex justify-start items-center gap-x-2 cursor-pointer hover:bg-[#ff613c]/20 bg-white"
    >
      <img src="https://placehold.co/400" class="w-12 h-12 rounded-xl" alt="" />
      <div class="min-w-[150px] space-y-1">
        <p class="whitespace-nowrap text-[12px] font-medium">Total Amount</p>
        <p class="text-[12px] text-[#ff613c] font-medium whitespace-nowrap">
          {{ total }} thb
        </p>
      </div>
    </div>
    <div
      class="p-2 shadow-sm rounded-md flex justify-start items-center gap-x-2 cursor-pointer hover:bg-[#ff613c]/20 bg-white"
    >
      <img src="https://placehold.co/400" class="w-12 h-12 rounded-xl" alt="" />
      <div class="min-w-[150px] space-y-1">
        <p class="whitespace-nowrap text-[12px] font-medium">Balance Due</p>
        <p class="text-[12px] text-[#ff613c] font-medium whitespace-nowrap">
          {{ balance_due }} thb
        </p>
      </div>
    </div>
    <div
      class="p-2 shadow-sm rounded-md flex justify-start items-center gap-x-2 cursor-pointer hover:bg-[#ff613c]/20 bg-white"
    >
      <img src="https://placehold.co/400" class="w-12 h-12 rounded-xl" alt="" />
      <div class="w-[150px] space-y-1">
        <p class="whitespace-nowrap text-[12px] font-medium">Exchange Rate</p>
        <p class="text-[10px] font-normal whitespace-nowrap">
          {{ data?.money_exchange_rate }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  data: Object,
  total: Number || String,
  balance_due: Number || String,
});
</script>

<style lang="stylus" scoped></style>
