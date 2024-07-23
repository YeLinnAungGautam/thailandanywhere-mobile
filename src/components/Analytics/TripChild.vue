<template>
  <div class="space-y-2">
    <div
      class="text-main text-base px-2 items-center"
      v-for="z in data"
      :key="z"
    >
      <div class="bg-gray-50 text-sm rounded-md">
        <div
          v-if="z.product_type == 'App\\Models\\PrivateVanTour'"
          class="cursor-pointer hover:bg-orange-100/50 bg-black/5 relative z-0 rounded-lg px-2 py-2 text-xs"
        >
          <div class="flex justify-between items-center pb-2">
            <div class="space-y-2">
              <p>{{ z.customer_info.name }}</p>
              <p
                @click="router.push('/reservation/update/' + z.id)"
                class="text-white text-[10px] inline-block bg-main py-1 px-2 rounded-md"
              >
                {{ z.crm_id }}
              </p>
            </div>
            <div class="gap-2 space-y-2">
              <!-- <p class="bg-black text-main p-1 rounded-md">
                {{ z.pickup_time }}
              </p> -->
              <div class="flex justify-end items-center gap-2">
                <p
                  class="p-1 rounded-md bg-green inline-block text-[10px] text-white"
                  v-if="z.is_driver_collect == 1"
                >
                  {{ z.reservation_car_info?.supplier_name }}
                </p>
                <p
                  class="bg-black/10 p-1 rounded-md"
                  @click="copyFunction(z.id)"
                >
                  <ClipboardDocumentCheckIcon class="w-4 h-4" />
                </p>
              </div>
              <div class="flex justify-end items-center gap-2">
                <p
                  class="p-1 rounded-md text-[8px] text-white"
                  :class="z.is_driver_collect == 1 ? 'bg-red' : 'bg-green'"
                >
                  {{ z.is_driver_collect == 1 ? "collect" : "bank" }}
                </p>
                <p
                  class="p-1 rounded-md text-[8px]"
                  :class="
                    z.booking.payment_status == 'fully_paid'
                      ? 'bg-green text-white'
                      : 'bg-red text-white'
                  "
                >
                  {{ z.booking.payment_status }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="space-y-1">
              <p>{{ z.product?.name }}</p>
            </div>
            <p class="text-sm text-black font-semibold">
              {{
                z.selling_price *
                z.quantity *
                calculateDaysBetween(z.checkin_date, z.checkout_date)
              }}
              THB
            </p>
          </div>
        </div>
        <div
          v-if="z.product_type == 'App\\Models\\Hotel'"
          @click="router.push('/reservation/update/' + z.id)"
          class="cursor-pointer hover:bg-orange-100/50 bg-black/5 rounded-lg px-2 py-2 text-xs"
        >
          <div class="flex justify-between items-start pb-2">
            <div class="space-y-2">
              <p>{{ z.customer_info.name }}</p>
              <p
                class="text-white bg-main p-1 rounded-md inline-block text-[10px]"
              >
                {{ z.crm_id }}
              </p>
            </div>
            <div class="flex justify-end items-center gap-2">
              <p
                class="p-1 rounded-md text-[10px] text-white"
                :class="z.paid_slip.length == 0 ? 'bg-red' : 'bg-green'"
              >
                {{ z.paid_slip.length == 0 ? "missing" : "received" }}
              </p>
              <p
                class="p-1 rounded-md text-[10px]"
                :class="
                  z.booking.payment_status == 'fully_paid'
                    ? 'bg-green text-white'
                    : 'bg-red text-white'
                "
              >
                {{ z.booking.payment_status }}
              </p>
              <!-- <p class="bg-black text-main p-1 rounded-md">
                {{ z.pickup_time }}
              </p> -->
              <!-- <p
                class="p-1 rounded-md bg-green text-white"
                v-if="z.is_driver_collect == 1"
              >
                {{ z.reservation_car_info.supplier_name }}
              </p> -->
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="space-y-1">
              <p>{{ z.product?.name }}</p>
            </div>
            <p class="text-sm text-black font-semibold">
              {{
                z.selling_price *
                z.quantity *
                calculateDaysBetween(z.checkin_date, z.checkout_date)
              }}
              THB
            </p>
          </div>
        </div>
        <div
          v-if="z.product_type == 'App\\Models\\EntranceTicket'"
          @click="router.push('/reservation/update/' + z.id)"
          class="cursor-pointer hover:bg-orange-100/50 bg-black/5 rounded-lg px-2 py-2 text-xs"
        >
          <div class="flex justify-between items-start pb-2">
            <div class="space-y-2">
              <p>{{ z.customer_info.name }}</p>
              <p
                class="text-white bg-main p-1 text-[10px] inline-block rounded-md"
              >
                {{ z.crm_id }}
              </p>
            </div>
            <div class="flex justify-end items-center gap-2">
              <p
                class="p-1 rounded-md text-[10px] text-white"
                :class="z.paid_slip.length == 0 ? 'bg-red' : 'bg-green'"
              >
                {{ z.paid_slip.length == 0 ? "missing" : "received" }}
              </p>
              <p
                class="p-1 rounded-md text-[10px]"
                :class="
                  z.booking.payment_status == 'fully_paid'
                    ? 'bg-green text-white'
                    : 'bg-red text-white'
                "
              >
                {{ z.booking.payment_status }}
              </p>
              <!-- <p class="bg-black text-main p-1 rounded-md">
                {{ z.pickup_time }}
              </p> -->
              <!-- <p
                class="p-1 rounded-md bg-green text-white"
                v-if="z.is_driver_collect == 1"
              >
                {{ z.reservation_car_info?.supplier_name }}
              </p> -->
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="space-y-1">
              <p>{{ z.product?.name }}</p>
            </div>
            <p class="text-sm text-black font-semibold">
              {{
                z.selling_price *
                z.quantity *
                calculateDaysBetween(z.checkin_date, z.checkout_date)
              }}
              THB
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useReservationStore } from "../../stores/reservation";
import { ClipboardDocumentCheckIcon } from "@heroicons/vue/24/outline";
import copy from "copy-to-clipboard";
import { useToastStore } from "../../stores/toast";
const router = useRouter();
const toastStore = useToastStore();
const reservationStore = useReservationStore();
const props = defineProps({
  data: Array,
});

const calculateDaysBetween = (a, b) => {
  if (a && b) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startDateTimestamp = new Date(a).getTime();
    const endDateTimestamp = new Date(b).getTime();
    let result = Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
    );
    // formitem.value.days = result;
    return result;
  } else {
    return 1;
  }
};

const copyFunction = async (id) => {
  const res = await reservationStore.getDetailAction(id);
  console.log(res, "this is res");
  let formattedOutput;
  if (res.status == "Request was successful.") {
    formattedOutput = `
CRMID: ${res.result?.crm_id}
C. Name: ${res.result?.customer_info?.name}
Contact: ${res?.result?.reservation_car_info.driver_contact}

S.Date: ${res.result?.service_date}
Pickup Time: ${res.result?.pickup_time}
Pickup Location: ${res.result?.pickup_location}

Routeplan: ${res.result?.route_plan}

Product Variation: ${res.result?.car?.name}
PaymentMethod: ${"xxxx"}
SaleAmount: ${"xxxx"}
ExtraCollect: ${"0"}

SpecialRequest: ${res.result?.special_request}
            `;
  }

  copy(formattedOutput);

  toastStore.showToast({
    icon: "success",
    title: "copy reservation is success",
  });
};

onMounted(() => {
  console.log("====================================");
  console.log(props.data, "this is data");
  console.log("====================================");
});
</script>
