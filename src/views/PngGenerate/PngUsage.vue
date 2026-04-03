<template>
  <div class="w-full mx-auto bg-white p-5">
    <A4PaginatedRenderer :items="invoice" :itemsPerPage="itemsPerPage" />
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import A4PaginatedRenderer from "./A4PaginatorComponent.vue";
import { useRoute } from "vue-router";
import { useBookingStore } from "../../stores/booking";
import defaultImage from "../../assets/download.jpeg";

const route = useRoute();
const bookingStore = useBookingStore();

const props = defineProps({
  invoice_id: Number,
});

const itemsPerPage = ref(4); // Adjust based on your content size
const itemsArray = ref([]);

const invoice = ref({
  customer: "",
  salesDate: "",
  dueDate: "",
  invoiceNumber: "",
  invoiceId: "",
  items: [],
  subtotal: "",
  totalDiscount: "",
  total: "",
  deposit: "",
  balanceDue: "",
  paymentStatus: "",
  // ── Inclusive fields ──
  isInclusive: false,
  inclusiveName: "",
  inclusiveStartDate: "",
  inclusiveEndDate: "",
  inclusiveQty: 0,
  inclusiveRate: "",
  inclusiveDescription: "",
});

const daysBetween = (a, b) => {
  console.log(a, b);
  if (a && b) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startDateTimestamp = new Date(a).getTime();
    const endDateTimestamp = new Date(b).getTime();
    let result = Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay),
    );
    // console.log(formData.value.checkin_date, result, "this is result");
    return result;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";

  // Parse the input date string
  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "";
  }

  // Array of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the day, month name, and year
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  // Return formatted date
  return `${day} ${monthName} ${year}`;
};

const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return "";
  }

  // Convert to number if it's a string
  const number = typeof value === "string" ? parseFloat(value) : value;

  // Format with thousand separators
  return number.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const getDetailAction = async () => {
  const response = await bookingStore.getDetailAction(props.invoice_id);
  console.log(response);
  invoice.value.items = [];
  invoice.value.invoiceId = response.result.id;
  invoice.value.customer = response.result.customer.name;
  invoice.value.salesDate = formatDate(response.result.booking_date);
  invoice.value.dueDate = formatDate(response.result.balance_due_date);
  invoice.value.invoiceNumber = response.result.crm_id;
  invoice.value.subtotal = formatNumber(response.result.sub_total);
  invoice.value.totalDiscount = formatNumber(response.result.discount);
  invoice.value.total = formatNumber(response.result.grand_total);
  invoice.value.deposit = formatNumber(response.result.deposit);
  invoice.value.balanceDue = formatNumber(response.result.balance_due);
  invoice.value.paymentStatus = response.result.payment_status;
  // After setting invoice.value.paymentStatus:
  invoice.value.isInclusive = response.result.is_inclusive === 1;
  invoice.value.inclusiveName = response.result.inclusive_name ?? "";
  invoice.value.inclusiveStartDate = response.result.inclusive_start_date ?? "";
  invoice.value.inclusiveEndDate = response.result.inclusive_end_date ?? "";
  invoice.value.inclusiveQty = response.result.inclusive_quantity ?? 0;
  invoice.value.inclusiveRate = formatNumber(
    response.result.inclusive_rate ?? 0,
  );
  invoice.value.inclusiveDescription =
    response.result.inclusive_description ?? "";

  for (let i = 0; i <= response.result.items.length; i++) {
    if (response.result.items[i]?.product_type == "App\\Models\\Hotel") {
      invoice.value.items.push({
        image:
          response.result.items[i]?.product?.images[0]?.image || defaultImage,
        name: response.result.items[i]?.product?.name,
        description: response.result.items[i]?.room?.name,
        period: `In: ${formatDate(
          response.result.items[i]?.checkin_date,
        )} - Out: ${formatDate(response.result.items[i]?.checkout_date)}`,
        details: `${daysBetween(
          response.result.items[i]?.checkin_date,
          response.result.items[i]?.checkout_date,
        )} Nights x ${response.result.items[i]?.quantity} Rooms x ${
          response.result.items[i]?.selling_price
        }`,
        discount: response.result.items[i]?.discount,
        amount: formatNumber(response.result.items[i]?.amount),
      });
    }
    if (
      response.result.items[i]?.product_type == "App\\Models\\EntranceTicket"
    ) {
      let detailsText = `${response.result.items[i].quantity} Adult x ${response.result.items[i].selling_price}`;

      // Check if individual_pricing exists and if it has child data with both quantity and selling_price
      if (
        response.result.items[i]?.individual_pricing &&
        response.result.items[i]?.individual_pricing?.child &&
        response.result.items[i]?.individual_pricing?.child?.quantity != "0" &&
        response.result.items[i]?.individual_pricing?.child?.selling_price !=
          "0"
      ) {
        detailsText += ` / ${response.result.items[i]?.individual_pricing?.child?.quantity} Child x ${response.result.items[i]?.individual_pricing?.child?.selling_price}`;
      }
      invoice.value.items.push({
        image: response.result.items[i]?.product?.cover_image || defaultImage,
        name: response.result.items[i]?.product?.name,
        description: response.result.items[i]?.variation?.name,
        period: `${formatDate(response.result.items[i]?.service_date)}`,
        details: detailsText,
        discount: response.result.items[i]?.discount,
        amount: formatNumber(response.result.items[i]?.amount),
      });
    }
    if (
      response.result.items[i]?.product_type == "App\\Models\\PrivateVanTour"
    ) {
      invoice.value.items.push({
        image:
          response.result.items[i]?.product?.images[0]?.image || defaultImage,
        name: response.result.items[i]?.product?.name,
        description: response.result.items[i]?.car?.name,
        period: `${formatDate(response.result.items[i]?.service_date)}`,
        details: ` ${response.result.items[i]?.quantity} Qty x ${response.result.items[i]?.selling_price}`,
        discount: response.result.items[i]?.discount,
        amount: formatNumber(response.result.items[i]?.amount),
      });
    }
    if (response.result.items[i]?.product_type == "App\\Models\\Airline") {
      invoice.value.items.push({
        image: defaultImage,
        name: response.result.items[i]?.product?.name,
        description: response.result.items[i]?.ticket?.name,
        period: `${formatDate(response.result.items[i]?.service_date)}`,
        details: ` ${response.result.items[i]?.quantity} Qty x ${response.result.items[i]?.selling_price}`,
        discount: response.result.items[i]?.discount,
        amount: formatNumber(response.result.items[i]?.amount),
      });
    }
  }
  // invoice.value.items = sampleData;

  console.log(invoice.value);
};

onMounted(async () => {
  // Generate sample data - replace with your actual data
  await getDetailAction();
});
</script>
