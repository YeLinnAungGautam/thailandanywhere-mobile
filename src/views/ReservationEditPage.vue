<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";
import { useReservationStore } from "../stores/reservation";
import BookingSummaryPart from "../components/reservationPart/BookingSummaryPart.vue";
import PaymentStatusPart from "../components/reservationPart/PaymentStatusPart.vue";
import CustomerInfoPart from "../components/reservationPart/CustomerInfoPart.vue";
import ProductTypePart from "../components/reservationPart/ProductTypePart.vue";
import ReceiptImagePart from "../components/reservationPart/ReceiptImagePart.vue";
import AddOtherInfo from "../components/reservationPart/AddOtherInfo.vue";
import { useToastStore } from "../stores/toast";
// import { useClipboard, usePermission } from "@vueuse/core";
import copy from "copy-to-clipboard";

// const { text, isSupported, copy } = useClipboard();
// const permissionRead = usePermission("clipboard-read");
// const permissionWrite = usePermission("clipboard-write");

const route = useRoute();
const router = useRouter();
const toastStore = useToastStore();
const reservationStore = useReservationStore();

const main = ref(null);
const getDetail = async () => {
  const res = await reservationStore.getDetailAction(route.params.id);
  console.log(res.result, "this is res");
  main.value = res.result;
};

const copyReservation = async () => {
  const res = await reservationStore.copyReservationDetail(route.params.id);
  console.log(res);
  let formattedOutput;
  if (res.result.checkin_date != undefined) {
    formattedOutput = `
💰 Total Cost: ${res.result.total_cost} THB 🏦 Bank Name: ${
      res.result.bank_name != "null" ? res.result.bank_name : "-"
    }
🔢 Bank Account Number: ${
      res.result.bank_account_number != "null"
        ? `➖${res.result.bank_account_number}`
        : "-"
    }
🧑‍💼 Account Name: ${
      res.result.account_name != "null" ? res.result.account_name : "-"
    }
#️⃣ CRM ID: ${res.result.crm_id}
#️⃣ Reservation Code: ${res.result.reservation_code}
🏨 Hotel Name: ${res.result.product_name}
🏩 Room Name : ${res.result.room_name != "null" ? res.result.room_name : "-"}
🛌 Total Rooms: ${
      res.result.total_rooms != "null" ? res.result.total_rooms : "-"
    }
🌙 Total Nights: ${
      res.result.total_nights != "null" ? res.result.total_nights : "-"
    }
💵 Sale Price: ${res.result.sale_price} THB
💵 Total Sale Amount: ${res.result.total_sale_amount} THB
💵 Balance Due: ${res.result.balance_due} THB
📝 Payment Status: ${res.result.payment_status}
📅 Sale Date: ${res.result.sale_date != "null" ? res.result.sale_date : "-"}
📅 Check-in Date: ${
      res.result.checkin_date != "null" ? res.result.checkin_date : "-"
    }
📅 Checkout Date: ${
      res.result.checkout_date != "null" ? res.result.checkout_date : "-"
    }
🤑 Score : ${res.result.score}
      `;
  } else if (res.result.entrance_ticket_variation_name) {
    formattedOutput = `
💰 Total Cost: ${res.result.total_cost} THB
🏦 Bank Name: ${res.result.bank_name != "null" ? res.result.bank_name : "-"}
🔢 Bank Account Number: ${
      res.result.bank_account_number != "null"
        ? `➖${res.result.bank_account_number}`
        : "-"
    }
🧑‍💼 Account Name: ${res.result.account_name}
#️⃣ CRM ID: ${res.result.crm_id}
#️⃣ Reservation Code: ${res.result.reservation_code}
🎫 Attraction : ${res.result.product_name}
🎫 Entrance Ticket Name : ${res.result.entrance_ticket_variation_name}
💵 Sale Price: ${res.result.sale_price} THB
💵 Total Sale Amount: ${res.result.total_sale_amount} THB
💵 Balance Due: ${res.result.balance_due} THB
📝 Payment Status: ${res.result.payment_status}
📅 Sale Date: ${res.result.sale_date != "null" ? res.result.sale_date : "-"}
🗓️ Service Date: ${
      res.result.service_date != "null" ? res.result.service_date : "-"
    }
🤑 Score : ${res.result.score}
      `;
  } else if (res.result.ticket_type) {
    formattedOutput = `
💰 Total Cost: ${res.result.total_cost} THB
#️⃣ CRM ID: ${res.result.crm_id}
#️⃣ Reservation Code: ${res.result.reservation_code}
✈️ Airline Name : ${res.result.product_name}
🎫 Ticket Type : ${res.result.ticket_type}
🎫 Total Tickets : ${res.result.total_ticket}
💵 Sale Price: ${res.result.sale_price} THB
💵 Total Sale Amount: ${res.result.total_sale_amount} THB
💵 Balance Due: ${res.result.balance_due} THB
📝 Payment Status: ${res.result.payment_status}
📅 Sale Date: ${res.result.sale_date != "null" ? res.result.sale_date : "-"}
🗓️ Service Date: ${
      res.result.service_date != "null" ? res.result.service_date : "-"
    }
🧾 Payment Status: ${res.result.payment_status}
🤑 Score : ${res.result.score}
📝 Expense Comment:
  `;
  }

  copy(formattedOutput);

  toastStore.showToast({
    icon: "success",
    title: "copy reservation is success",
  });
};

const copyText = ref("");

// const copyReservation = async () => {
//   const res = await reservationStore.copyReservationDetail(route.params.id);
//   console.log(res);

//   if (res.result.checkin_date != undefined) {
//     copyText.value = `
//       Total Coast: ${res.result.total_coast} THB
//       Bank Name: ${res.result.bank_name != "null" ? res.result.bank_name : "-"}
//       Bank Account Number: ${
//         res.result.bank_account_number != "null"
//           ? res.result.bank_account_number
//           : "-"
//       }
//       Account Name: ${
//         res.result.account_name != "null" ? res.result.account_name : "-"
//       }
//       CRM ID: ${res.result.crm_id}
//       Reservation Code: ${res.result.reservation_code}
//       Hotel Name: ${
//         res.result.hotel_name != "null" ? res.result.hotel_name : "-"
//       }
//       Total Rooms: ${
//         res.result.total_rooms != "null" ? res.result.total_rooms : "-"
//       }
//       Total Nights: ${
//         res.result.total_nights != "null" ? res.result.total_nights : "-"
//       }
//       Sale Price: ${res.result.sale_price} THB
//       Check-in Date: ${
//         res.result.checkin_date != "null" ? res.result.checkin_date : "-"
//       }
//       Checkout Date: ${
//         res.result.checkout_date != "null" ? res.result.checkout_date : "-"
//       } THB
//     `;
//   } else {
//     copyText.value = `
//       Total Coast: ${res.result.total_coast} THB
//       Bank Name: ${res.result.bank_name != "null" ? res.result.bank_name : "-"}
//       Bank Account Number: ${
//         res.result.bank_account_number != "null"
//           ? res.result.bank_account_number
//           : "-"
//       }
//       Account Name: ${res.result.account_name}
//       CRM ID: ${res.result.crm_id}
//       Reservation Code: ${res.result.reservation_code}
//       Ticket Name: ${
//         res.result.hotel_name != "null" ? res.result.hotel_name : "-"
//       }
//       Sale Price: ${res.result.sale_price} THB
//     `;
//   }

//   if (copyText.value) {
//     copy(copyText.value);
//     toastStore.showToast({
//       icon: "success",
//       title: "copy reservation is success",
//     });
//   }
// };

const printPrivateVanTour = () => {
  window.open(
    import.meta.env.VITE_API_URL +
      "/vantour-reservation/" +
      route.params.id +
      "/receipt"
  );
};
const printReservation = () => {
  window.open(
    import.meta.env.VITE_API_URL +
      "/reservations/" +
      route.params.id +
      "/receipt"
  );
};
const printHotelConfirm = () => {
  window.open(
    import.meta.env.VITE_API_URL +
      "/hotel-reservation/" +
      route.params.id +
      "/receipt"
  );
};

const goBack = () => {
  router.go(-1);
};

onMounted(async () => {
  await getDetail();
});
</script>

<template>
  <div>
    <Navbar />
    <div class="pb-2 text-sm">
      <div class="flex justify-between items-center">
        <div
          class="flex justify-start items-center gap-2 text-main my-2"
          @click="goBack"
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
        <div>
          <div
            class="py-1.5 px-4 text-xs rounded-sm bg-main text-white border-main border inline-block mt-4 mr-2 mb-3"
            @click="copyReservation"
            v-if="
              main?.product_type == 'App\\Models\\Hotel' ||
              main?.product_type == 'App\\Models\\EntranceTicket' ||
              main?.product_type == 'App\\Models\\Airline'
            "
          >
            COPY
          </div>

          <p
            class="py-1.5 px-4 text-xs rounded-sm bg-white border-main border inline-block mt-4 mr-2 mb-3"
            @click="printReservation"
            v-if="
              main?.product_type == 'App\\Models\\EntranceTicket' &&
              (main?.booking?.payment_status == 'fully_paid' ||
                main?.booking?.payment_status == 'partially_paid')
            "
          >
            Print
          </p>
          <p
            class="py-1.5 px-4 text-xs rounded-sm bg-white border-main border inline-block mt-4 mr-2 mb-3"
            @click="printPrivateVanTour"
            v-if="
              main?.product_type == 'App\\Models\\PrivateVanTour' &&
              (main?.booking?.payment_status == 'fully_paid' ||
                main?.booking?.payment_status == 'partially_paid')
            "
          >
            Print
          </p>
          <p
            class="py-1.5 px-4 text-xs rounded-sm bg-white border-main border inline-block mt-4 mr-2 mb-3"
            @click="printHotelConfirm"
            v-if="
              main?.product_type == 'App\\Models\\Hotel' &&
              (main?.booking?.payment_status == 'fully_paid' ||
                main?.booking?.payment_status == 'partially_paid')
            "
          >
            Print
          </p>
        </div>
      </div>
      <div
        class="bg-main text-white flex justify-between items-center py-2 px-2"
      >
        <div class="flex justify-start items-center gap-3 text-xs">
          <p>CODE</p>
          <p>{{ main?.crm_id }}</p>
        </div>
        <div
          class="flex justify-start items-center gap-3 text-xs"
          v-if="main?.booking?.past_crm_id != null"
        >
          <p>OLD CRM ID</p>
          <p>{{ main?.booking?.past_crm_id }}</p>
        </div>
      </div>
      <!-- booking summary -->
      <div>
        <BookingSummaryPart :main="main" />
      </div>
      <!-- payment part -->
      <div>
        <PaymentStatusPart :main="main" />
      </div>
      <!-- customer info -->
      <div>
        <CustomerInfoPart :main="main" />
      </div>
      <!-- product type -->
      <div>
        <ProductTypePart :main="main" />
      </div>
      <!-- receipt image -->
      <div>
        <ReceiptImagePart :main="main" />
      </div>
      <div
        class="bg-main text-white flex justify-between items-center py-2 px-2"
      >
        <div class="flex justify-start items-center gap-3 text-xs">
          <p>ADD MORE RESERVATION DETAIL</p>
        </div>
      </div>
      <div>
        <AddOtherInfo :main="main" />
      </div>
    </div>
  </div>
</template>
