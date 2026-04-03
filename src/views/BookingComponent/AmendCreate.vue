<template>
  <div class="relative">
    <div class="space-y-1" v-if="amendData != null">
      <!-- ══════════════════════════════════════════
           VARIATION CHANGE SECTION
           car (type 1), hotel room (type 6),
           attraction (type 4), others with car_list
      ══════════════════════════════════════════ -->
      <div
        v-if="hasVariation"
        class="mb-3 border border-blue-200 rounded-xl overflow-hidden"
      >
        <!-- Section header -->
        <div
          @click="seeVariation = !seeVariation"
          class="flex items-center justify-between bg-blue-50 px-4 py-2.5 border-b border-blue-200"
        >
          <p
            class="text-xs font-semibold text-blue-700 flex items-center gap-1.5"
          >
            <ArrowPathIcon class="w-3.5 h-3.5" />
            {{ variationLabel }} Change
          </p>
          <div class="space-x-2">
            <span
              class="text-[10px] text-blue-500 bg-blue-100 px-2 py-0.5 rounded-full"
            >
              {{ amendData.car_list?.length ?? 0 }} options
            </span>
            <span class="text-[12px] text-black px-2 rounded-full">
              Click to See Variation
            </span>
          </div>
        </div>

        <!-- Current variation display -->
        <div class="px-4 pt-3" :class="seeVariation ? 'pb-1' : 'pb-3'">
          <p
            class="text-[10px] text-gray-400 mb-1.5 uppercase tracking-wide font-medium"
          >
            Current
          </p>
          <div
            class="flex items-center gap-3 bg-gray-50 rounded-lg p-2.5 border border-gray-200"
          >
            <div
              class="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0"
            >
              <img
                v-if="amendData.product_image"
                :src="amendData.product_image"
                class="w-full h-full object-cover"
                alt=""
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
              >
                <ArrowPathIcon class="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-gray-700 truncate">
                {{ amendData.item_name }}
              </p>
              <p class="text-[10px] text-gray-400">
                Sell:
                <span class="text-gray-600 font-medium"
                  >{{ amendData.selling_price }} ฿</span
                >
                <span class="mx-1">·</span>
                Cost:
                <span class="text-gray-600 font-medium"
                  >{{ amendData.cost_price }} ฿</span
                >
              </p>
              <p v-if="hasChildInfo" class="text-[10px] text-gray-400">
                Child:
                <span class="text-gray-600 font-medium"
                  >{{ childSellPrice }} ฿</span
                >
              </p>
            </div>
          </div>
        </div>

        <!-- Arrow -->
        <div class="flex justify-center py-1" v-if="seeVariation">
          <div class="flex flex-col items-center gap-0.5">
            <ArrowDownCircleIcon
              class="w-5 h-5"
              :class="
                isChanged('variation_id') ? 'text-[#ff613c]' : 'text-gray-300'
              "
            />
          </div>
        </div>

        <!-- New variation selector -->
        <div class="px-4 pb-3" v-if="seeVariation">
          <p
            class="text-[10px] text-gray-400 mb-1.5 uppercase tracking-wide font-medium"
          >
            New Selection
          </p>

          <!-- List of options -->
          <div class="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            <div
              v-for="item in amendData.car_list"
              :key="item.id"
              @click="onVariationChange(item)"
              class="flex items-center gap-3 rounded-lg p-2.5 border cursor-pointer transition-all"
              :class="
                form.variation_id == item.id
                  ? 'border-[#ff613c] bg-[#ff613c]/5 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              "
            >
              <!-- Check indicator -->
              <div
                class="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                :class="
                  form.variation_id == item.id
                    ? 'border-[#ff613c] bg-[#ff613c]'
                    : 'border-gray-300'
                "
              >
                <div
                  v-if="form.variation_id == item.id"
                  class="w-1.5 h-1.5 rounded-full bg-white"
                ></div>
              </div>

              <!-- Item image -->
              <div
                class="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0"
              >
                <img
                  v-if="item.image"
                  :src="item.image"
                  class="w-full h-full object-cover"
                  alt=""
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <ArrowPathIcon class="w-4 h-4 text-gray-300" />
                </div>
              </div>

              <!-- Item details -->
              <div class="flex-1 min-w-0">
                <!-- Van tour / car (type 1) -->
                <template v-if="amendData.product_type == 1">
                  <p class="text-xs font-semibold text-gray-700 truncate">
                    {{ item.name }}
                  </p>
                  <p class="text-[10px] text-gray-400">
                    {{ item.max_person }} Pax
                  </p>
                </template>

                <!-- Hotel room (type 6) -->
                <template v-else-if="amendData.product_type == 6">
                  <p class="text-xs font-semibold text-gray-700 truncate">
                    {{ item.name }}
                  </p>
                  <p class="text-[10px] text-gray-400">
                    {{ item.max_person }} Pax
                    <span
                      v-if="item.has_breakfast == 1"
                      class="ml-1 text-green-600"
                      >· Breakfast</span
                    >
                  </p>
                </template>

                <!-- Attraction ticket (type 4) -->
                <template v-else-if="amendData.product_type == 4">
                  <p class="text-xs font-semibold text-gray-700 truncate">
                    {{ item.name }}
                  </p>
                  <p class="text-[10px] text-gray-400 truncate">
                    {{ item.description }}
                  </p>
                  <p
                    v-if="
                      item.child_info &&
                      JSON.parse(item.child_info || '[]').length > 0
                    "
                    class="text-[10px] text-purple-500"
                  >
                    Child: {{ JSON.parse(item.child_info)[0]?.child_price }} ฿
                  </p>
                </template>

                <!-- Other / default -->
                <template v-else>
                  <p class="text-xs font-semibold text-gray-700 truncate">
                    {{ item.name ?? item.description }}
                  </p>
                </template>
              </div>

              <!-- Price -->
              <div class="text-right flex-shrink-0">
                <p class="text-xs font-bold text-[#ff613c]">
                  {{ item.price ?? item.room_price }} ฿
                </p>
                <p
                  v-if="item.cost ?? item.cost_price"
                  class="text-[10px] text-gray-400"
                >
                  Cost: {{ item.cost ?? item.cost_price }}
                </p>
                <p class="text-[10px] text-gray-400">
                  <template v-if="amendData.product_type == 6"
                    >/ night</template
                  >
                  <template v-else-if="amendData.product_type == 1"
                    >/ car</template
                  >
                  <template v-else>/ person</template>
                </p>
              </div>
            </div>
          </div>

          <!-- Selected new variation summary -->
          <div
            v-if="isChanged('variation_id') && selectedVariationItem"
            class="mt-2 flex items-start gap-2 bg-[#ff613c]/5 border border-[#ff613c]/30 rounded-lg px-3 py-2"
          >
            <CheckCircleIcon
              class="w-3.5 h-3.5 text-[#ff613c] flex-shrink-0 mt-0.5"
            />
            <div class="flex-1 min-w-0">
              <p class="text-[10px] font-semibold text-[#ff613c]">
                New:
                {{
                  selectedVariationItem.name ??
                  selectedVariationItem.description
                }}
              </p>
              <p class="text-[10px] text-gray-500">
                Sell:
                <span class="font-medium">{{ form.selling_price }} ฿</span>
                <span class="mx-1">·</span>
                Cost: <span class="font-medium">{{ form.cost_price }} ฿</span>
                <template v-if="newChildSellPrice > 0">
                  <span class="mx-1">·</span>
                  Child:
                  <span class="font-medium text-purple-600"
                    >{{ newChildSellPrice }} ฿</span
                  >
                </template>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Service Date -->
      <div class="grid grid-cols-9 gap-x-4 py-1 pt-3">
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <CalendarIcon class="w-4 h-4 mr-2" />
            {{ isHotel ? "Checkin Date" : "Service Date" }}
          </label>
          <p class="font-medium text-sm">{{ amendData.service_date }}</p>
        </div>
        <div class="flex justify-center items-center">
          <ArrowRightCircleIcon
            class="w-7 h-7"
            :class="
              isChanged('service_date') ? 'text-red-600' : 'text-gray-400'
            "
          />
        </div>
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <CalendarIcon class="w-4 h-4 mr-2" />
            {{ isHotel ? "Checkin Date" : "Service Date" }}
          </label>
          <input
            type="date"
            v-model="form.service_date"
            @change="onHotelDateChange"
            class="border border-blue-600 w-[150px] px-2 py-2 rounded-lg text-xs focus:outline-none"
          />
        </div>
      </div>

      <!-- Hotel: Checkout Date -->
      <div class="grid grid-cols-9 gap-x-4 py-1" v-if="isHotel">
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <CalendarIcon class="w-4 h-4 mr-2" /> Checkout Date
          </label>
          <p class="font-medium text-sm">{{ amendData.checkout_date }}</p>
        </div>
        <div class="flex justify-center items-center">
          <ArrowRightCircleIcon
            class="w-7 h-7"
            :class="
              isChanged('checkout_date') ? 'text-red-600' : 'text-gray-400'
            "
          />
        </div>
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <CalendarIcon class="w-4 h-4 mr-2" /> Checkout Date
          </label>
          <input
            type="date"
            v-model="form.checkout_date"
            :min="minCheckoutDate"
            @change="onHotelDateChange"
            class="border border-blue-600 w-[150px] px-2 py-2 rounded-lg text-xs focus:outline-none"
          />
        </div>
      </div>

      <!-- Hotel: Duration -->
      <div class="grid grid-cols-9 gap-x-4 py-1" v-if="isHotel">
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <ClockIcon class="w-4 h-4 mr-2" /> Duration
          </label>
          <p class="text-sm font-medium">
            {{ amendData.days }} Night x {{ amendData.quantity }} Rooms
          </p>
        </div>
        <div class="flex justify-center items-center">
          <ArrowRightCircleIcon class="w-7 h-7 text-gray-400" />
        </div>
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3 bg-gray-50"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <ClockIcon class="w-4 h-4 mr-2" /> Duration
          </label>
          <p class="text-xs font-medium">
            <span v-if="isLoadingPrice" class="text-gray-400">Loading...</span>
            <span v-else>{{ newDays }} Night x {{ form.quantity }} Rooms</span>
          </p>
        </div>
      </div>

      <!-- Quantity -->
      <div class="grid grid-cols-9 gap-x-4 py-1">
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <CalculatorIcon class="w-4 h-4 mr-2" />
            {{ isHotel ? "Total Rooms" : "Quantity" }}
          </label>
          <p class="text-sm font-medium">{{ amendData.quantity }}</p>
        </div>
        <div class="flex justify-center items-center">
          <ArrowRightCircleIcon
            class="w-7 h-7"
            :class="isChanged('quantity') ? 'text-red-600' : 'text-gray-400'"
          />
        </div>
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <CalculatorIcon class="w-4 h-4 mr-2" />
            {{ isHotel ? "Total Rooms" : "Quantity" }}
          </label>
          <input
            type="number"
            v-model="form.quantity"
            @input="recalcFromVariation"
            class="border border-blue-600 w-[150px] px-2 py-2 rounded-lg text-xs focus:outline-none"
          />
        </div>
      </div>

      <!-- Child Quantity — Attraction (type 4) only -->
      <div
        class="grid grid-cols-9 gap-x-4 py-1"
        v-if="hasChildInfo || hasNewChildInfo"
      >
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
        >
          <label class="text-xs text-[#FF613c] flex items-center">
            <CalculatorIcon class="w-4 h-4 mr-2" />
            Child Qty ({{ childSellPrice }} ฿)
          </label>
          <p class="text-sm font-medium">{{ childPricing?.quantity ?? 0 }}</p>
        </div>
        <div class="flex justify-center items-center">
          <ArrowRightCircleIcon
            class="w-7 h-7"
            :class="
              isChanged('child_quantity') ? 'text-red-600' : 'text-gray-400'
            "
          />
        </div>
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
        >
          <label class="text-xs text-[#FF613c] flex items-center">
            <CalculatorIcon class="w-4 h-4 mr-2" />
            Child Qty
            <span v-if="newChildSellPrice > 0" class="ml-1 text-gray-500"
              >({{ newChildSellPrice }} ฿)</span
            >
          </label>
          <input
            type="number"
            v-model="form.child_quantity"
            class="border border-blue-600 w-[150px] px-2 py-2 rounded-lg text-xs focus:outline-none"
          />
        </div>
      </div>

      <!-- Total Summary -->
      <div
        class="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-2"
      >
        <p class="text-xs font-semibold text-gray-600 mb-3">Total Summary</p>

        <div
          class="grid grid-cols-3 gap-2 text-center text-[10px] text-gray-500 font-medium pb-1 border-b border-gray-200"
        >
          <span class="text-left">Item</span>
          <span>Current</span>
          <span>New</span>
        </div>

        <!-- Variation change indicator row -->
        <div
          v-if="isChanged('variation_id')"
          class="grid grid-cols-3 gap-2 text-[10px] items-center"
        >
          <span class="text-purple-600 font-medium">{{ variationLabel }}</span>
          <span class="text-center text-gray-400 line-through truncate">{{
            amendData.item_name
          }}</span>
          <span class="text-center text-purple-600 font-semibold truncate">{{
            form.variation_name
          }}</span>
        </div>

        <div
          class="grid grid-cols-3 gap-2 text-[10px] items-center text-gray-400"
        >
          <span>{{ isHotel ? "Rooms × Price" : "Qty × Price" }}</span>
          <span class="text-center"
            >{{ amendData.quantity }} × {{ amendData.selling_price }}</span
          >
          <span class="text-center"
            >{{ form.quantity }} × {{ form.selling_price }}</span
          >
        </div>

        <div
          class="grid grid-cols-3 gap-2 text-[10px] items-center text-gray-400"
          v-if="hasChildInfo || hasNewChildInfo"
        >
          <span>Child Qty × Price</span>
          <span class="text-center"
            >{{ childPricing?.quantity ?? 0 }} × {{ childSellPrice }}</span
          >
          <span class="text-center"
            >{{ form.child_quantity }} × {{ newChildSellPrice }}</span
          >
        </div>

        <div
          class="grid grid-cols-3 gap-2 text-[10px] items-center text-gray-400"
        >
          <span>Discount</span>
          <span class="text-center">-{{ amendData.discount ?? 0 }}</span>
          <span class="text-center">-{{ amendData.discount ?? 0 }}</span>
        </div>

        <div class="border-t border-gray-200 pt-2 space-y-1">
          <div class="grid grid-cols-3 gap-2 text-xs items-center font-medium">
            <span class="text-gray-600">Total Selling</span>
            <span class="text-center">{{ currentTotalAmount }} ฿</span>
            <span
              class="text-center"
              :class="
                newTotalAmount != currentTotalAmount
                  ? 'text-green-600'
                  : 'text-gray-700'
              "
            >
              <span v-if="isLoadingPrice" class="text-gray-400">...</span>
              <span v-else>{{ newTotalAmount }} ฿</span>
            </span>
          </div>

          <div class="grid grid-cols-3 gap-2 text-xs items-center font-medium">
            <span class="text-gray-600">Total Cost</span>
            <span class="text-center">{{ currentTotalCostPrice }} ฿</span>
            <span
              class="text-center"
              :class="
                newTotalCostPrice != currentTotalCostPrice
                  ? 'text-orange-600'
                  : 'text-gray-700'
              "
            >
              <span v-if="isLoadingPrice" class="text-gray-400">...</span>
              <span v-else>{{ newTotalCostPrice }} ฿</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end items-center gap-x-2 pt-4">
      <button
        @click="amendCloseAction"
        class="bg-white text-[#FF613c] border border-[#FF613c] px-4 py-2.5 rounded-lg text-xs"
      >
        Cancel
      </button>
      <button
        @click="amendRequestDelete"
        class="bg-yellow-600 text-white px-4 py-2.5 rounded-lg text-xs"
      >
        Amend Cancel Request
      </button>
      <button
        @click="submitAmend"
        class="bg-[#ff613c] text-white px-4 py-2.5 rounded-lg text-xs"
      >
        Amend Request Create
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { daysBetween } from "../help/DateBetween";
import Swal from "sweetalert2";
import { useAmendStore } from "../../stores/amend";
import { useHotelStore } from "../../stores/hotel";
import { useToast } from "vue-toastification";
import {
  ArrowPathIcon,
  ArrowRightCircleIcon,
  ArrowDownCircleIcon,
  CalculatorIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  amendData: { type: Object, default: null },
  amendCloseAction: { type: Function, default: () => {} },
});

const amendStore = useAmendStore();
const hotelStore = useHotelStore();
const toast = useToast();

const isLoadingPrice = ref(false);

const seeVariation = ref(false);

const form = ref({
  service_date: null,
  checkout_date: null,
  quantity: null,
  child_quantity: null,
  selling_price: null,
  cost_price: null,
  variation_id: null,
  variation_name: null,
});

// ================================================================
// HELPERS
// ================================================================

const isHotel = computed(() => props.amendData?.product_type == 6);

const individualPricing = computed(() => {
  const raw = props.amendData?.individual_pricing;
  if (!raw) return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return raw;
});

const childInfo = computed(() => {
  const raw = props.amendData?.child_info;
  if (!raw) return [];
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return Array.isArray(raw) ? raw : [];
});

const minCheckoutDate = computed(() => {
  if (!form.value.service_date) return "";

  // Add 1 day to service_date so checkout must be AFTER service date
  const serviceDate = new Date(form.value.service_date);
  serviceDate.setDate(serviceDate.getDate() + 1);

  return serviceDate.toISOString().split("T")[0]; // returns "YYYY-MM-DD"
});

const hasChildInfo = computed(
  () => props.amendData?.product_type == 4 && childInfo.value.length > 0,
);

const childPricing = computed(() => individualPricing.value?.child ?? null);

const childSellPrice = computed(
  () => parseFloat(childInfo.value[0]?.child_price) || 0,
);
const childCostPrice = computed(
  () => parseFloat(childInfo.value[0]?.child_cost_price) || 0,
);

const newDays = computed(() => {
  if (!form.value.service_date || !form.value.checkout_date)
    return props.amendData?.days ?? 0;
  return daysBetween(form.value.service_date, form.value.checkout_date);
});

// ================================================================
// VARIATION HELPERS
// ================================================================

// Does this item have a variation list to pick from?
const hasVariation = computed(
  () => props.amendData?.car_list && props.amendData.car_list.length > 0,
);

// Human-readable label per product type
const variationLabel = computed(() => {
  const t = props.amendData?.product_type;
  if (t == 1) return "Car Type";
  if (t == 6) return "Room Type";
  if (t == 4) return "Ticket / Variation";
  if (t == 7) return "Ticket";
  return "Variation";
});

// The currently-selected new variation item object
const selectedVariationItem = computed(
  () =>
    props.amendData?.car_list?.find((c) => c.id == form.value.variation_id) ??
    null,
);

// Child info from newly selected variation (type 4 only)
const newVariationChildInfo = computed(() => {
  if (props.amendData?.product_type != 4) return [];
  const item = selectedVariationItem.value;
  if (!item?.child_info) return [];
  try {
    const parsed =
      typeof item.child_info === "string"
        ? JSON.parse(item.child_info)
        : item.child_info;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
});

// Show child qty row if current OR new variation has child info
const hasNewChildInfo = computed(
  () =>
    props.amendData?.product_type == 4 &&
    newVariationChildInfo.value.length > 0,
);

// New child prices (from selected variation or original child_info)
const newChildSellPrice = computed(() => {
  if (props.amendData?.product_type != 4) return 0;
  if (newVariationChildInfo.value.length > 0)
    return parseFloat(newVariationChildInfo.value[0]?.child_price) || 0;
  return childSellPrice.value;
});

const newChildCostPrice = computed(() => {
  if (props.amendData?.product_type != 4) return 0;
  if (newVariationChildInfo.value.length > 0)
    return parseFloat(newVariationChildInfo.value[0]?.child_cost_price) || 0;
  return childCostPrice.value;
});

// ================================================================
// isChanged
// ================================================================
const isChanged = (field) => {
  const d = props.amendData;
  if (!d) return false;
  switch (field) {
    case "service_date":
      return form.value.service_date !== d.service_date;
    case "checkout_date":
      return form.value.checkout_date !== d.checkout_date;
    case "quantity":
      return form.value.quantity != d.quantity;
    case "child_quantity":
      return form.value.child_quantity != (childPricing.value?.quantity ?? 0);
    case "selling_price":
      return form.value.selling_price != d.selling_price;
    case "cost_price":
      return form.value.cost_price != d.cost_price;
    case "variation_id":
      return form.value.variation_id != d.car_id;
    default:
      return false;
  }
};

// ================================================================
// CALCULATION
// ================================================================
const currentTotalAmount = computed(() => {
  const d = props.amendData;
  if (!d) return "0.00";
  const qty = parseFloat(d.quantity) || 0;
  const price = parseFloat(d.selling_price) || 0;
  const discount = parseFloat(d.discount) || 0;
  const days = parseFloat(d.days) || 1;
  if (days > 1) return (qty * price - discount).toFixed(2);
  const childAmt = parseFloat(childPricing.value?.amount) || 0;
  return (qty * price - discount + childAmt).toFixed(2);
});

const currentTotalCostPrice = computed(() => {
  const d = props.amendData;
  if (!d) return "0.00";
  const qty = parseFloat(d.quantity) || 0;
  const cost = parseFloat(d.cost_price) || 0;
  const days = parseFloat(d.days) || 1;
  if (days > 1) return (qty * cost).toFixed(2);
  const childCostTotal = parseFloat(childPricing.value?.total_cost_price) || 0;
  return (qty * cost + childCostTotal).toFixed(2);
});

const newTotalAmount = computed(() => {
  const d = props.amendData;
  if (!d) return "0.00";
  const qty = parseFloat(form.value.quantity) || 0;
  const price = parseFloat(form.value.selling_price) || 0;
  const discount = parseFloat(d.discount) || 0;
  const days = parseFloat(newDays.value) || 1;
  if (days > 1) return (qty * price - discount).toFixed(2);
  const childQty = parseFloat(form.value.child_quantity) || 0;
  const childAmt = childQty * newChildSellPrice.value;
  return (qty * price - discount + childAmt).toFixed(2);
});

const newTotalCostPrice = computed(() => {
  const d = props.amendData;
  if (!d) return "0.00";
  const qty = parseFloat(form.value.quantity) || 0;
  const cost = parseFloat(form.value.cost_price) || 0;
  const days = parseFloat(newDays.value) || 1;
  if (days > 1) return (qty * cost).toFixed(2);
  const childQty = parseFloat(form.value.child_quantity) || 0;
  const childCostTotal = childQty * newChildCostPrice.value;
  return (qty * cost + childCostTotal).toFixed(2);
});

// ================================================================
// VARIATION CHANGE HANDLER
// ================================================================
const onVariationChange = (item) => {
  form.value.variation_id = item.id;
  form.value.variation_name = item.name ?? item.description;

  const t = props.amendData?.product_type;

  if (t == 1) {
    // Van tour — price per car, no cost stored at car level usually
    form.value.selling_price = item.price ?? 0;
    form.value.cost_price = item.cost ?? props.amendData?.cost_price ?? 0;
  } else if (t == 6) {
    // Hotel room — will recalculate via period API if dates set, else use room_price
    form.value.selling_price = item.room_price ?? item.price ?? 0;
    form.value.cost_price = item.cost ?? 0;
    // If dates are already set, re-fetch period price with new room id
    if (form.value.service_date && form.value.checkout_date) {
      onHotelDateChangeWithRoom(item.id);
    }
  } else if (t == 4) {
    // Attraction — adult price from item.price, child from child_info
    form.value.selling_price = item.price ?? 0;
    form.value.cost_price = item.cost_price ?? 0;
    // Reset child quantity if new variation has no child info
    const parsed = (() => {
      try {
        const raw = item.child_info;
        if (!raw) return [];
        return typeof raw === "string" ? JSON.parse(raw) : raw;
      } catch {
        return [];
      }
    })();
    if (parsed.length === 0) form.value.child_quantity = 0;
  } else if (t == 7) {
    // Ticket
    form.value.selling_price = item.price ?? 0;
    form.value.cost_price = item.cost ?? 0;
  } else {
    // Fallback
    form.value.selling_price = item.price ?? item.room_price ?? 0;
    form.value.cost_price = item.cost ?? item.cost_price ?? 0;
  }
};

// Recalculate totals when quantity changes after variation already chosen
const recalcFromVariation = () => {
  // computed properties will auto-update; this is a hook if manual logic needed
};

// ================================================================
// HOTEL DATE CHANGE — original room id
// ================================================================
const onHotelDateChange = async () => {
  if (!isHotel.value) return;
  if (!form.value.service_date || !form.value.checkout_date) return;
  // Use currently selected room id (may be changed via variation)
  const roomId = form.value.variation_id ?? props.amendData?.car_id;
  await fetchHotelPeriodPrice(roomId);
};

// Hotel date change with explicit room id (used when variation changes)
const onHotelDateChangeWithRoom = async (roomId) => {
  if (!form.value.service_date || !form.value.checkout_date) return;
  await fetchHotelPeriodPrice(roomId);
};

const fetchHotelPeriodPrice = async (roomId) => {
  if (!roomId) return;
  isLoadingPrice.value = true;
  try {
    const res = await hotelStore.getRoomPrice(
      {
        checkin_date: form.value.service_date,
        checkout_date: form.value.checkout_date,
      },
      roomId,
    );
    if (res?.data) {
      form.value.selling_price = res.data.total_sale_price;
      form.value.cost_price = res.data.total_cost_price;
    }
  } catch {
    toast.error("This room is deleted so can't change");
  } finally {
    isLoadingPrice.value = false;
  }
};

// ================================================================
// SUBMIT AMEND
// ================================================================
const submitAmend = () => {
  const fields = [
    "service_date",
    "checkout_date",
    "quantity",
    "child_quantity",
    "selling_price",
    "cost_price",
    "variation_id",
  ];
  const hasChange = fields.some((f) => isChanged(f));

  if (!hasChange) {
    Swal.fire({ title: "No changes detected", icon: "info" });
    return;
  }

  Swal.fire({
    title: "Create Amend Request?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, create!",
  }).then(async (result) => {
    if (!result.isConfirmed) return;

    const d = props.amendData;

    const changes = {
      // Previous values
      current_service_date: d.service_date,
      current_checkout_date: d.checkout_date,
      current_quantity: d.quantity,
      current_child_quantity: childPricing.value?.quantity ?? 0,
      current_selling_price: d.selling_price,
      current_cost_price: d.cost_price,
      current_variation_id: d.car_id,
      current_variation_name: d.item_name,
      current_total_amount: currentTotalAmount.value,
      current_total_cost_price: currentTotalCostPrice.value,
      current_child_selling_price: childSellPrice.value,
      current_child_cost_price: childCostPrice.value,

      // New values
      service_date: form.value.service_date,
      checkout_date: form.value.checkout_date,
      quantity: form.value.quantity,
      child_quantity: form.value.child_quantity,
      selling_price: form.value.selling_price,
      cost_price: form.value.cost_price,
      variation_id: form.value.variation_id,
      variation_name: form.value.variation_name,
      child_selling_price: newChildSellPrice.value,
      child_cost_price: newChildCostPrice.value,

      // Calculated totals
      total_amount: newTotalAmount.value,
      total_cost_price: newTotalCostPrice.value,
    };

    const frmData = new FormData();
    frmData.append("booking_item_id", d.reservation_id);
    frmData.append("changes", JSON.stringify(changes));

    const res = await amendStore.addNewAction(frmData);
    if (res.status == 1) {
      toast.success("Amend request created successfully.");
      props.amendCloseAction();
    } else {
      toast.error("Failed to create amend request.");
    }
  });
};

// ================================================================
// DELETE REQUEST
// ================================================================
const amendRequestDelete = () => {
  Swal.fire({
    title: "Delete Request?",
    text: "This will request to remove this booking item.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Yes, request delete!",
  }).then(async (result) => {
    if (!result.isConfirmed) return;

    const changes = {
      delete: true,
      total_amount: currentTotalAmount.value,
      total_cost_price: currentTotalCostPrice.value,
    };

    const frmData = new FormData();
    frmData.append("booking_item_id", props.amendData.reservation_id);
    frmData.append("changes", JSON.stringify(changes));

    const res = await amendStore.addNewAction(frmData);
    if (res.status == 1) {
      toast.success("Delete request created successfully.");
      props.amendCloseAction();
    } else {
      toast.error("Failed to create delete request.");
    }
  });
};

// ================================================================
// INIT FORM
// ================================================================
watch(
  () => props.amendData,
  (d) => {
    if (!d) return;

    const pricing = (() => {
      const raw = d.individual_pricing;
      if (!raw) return null;
      if (typeof raw === "string") {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      }
      return raw;
    })();

    form.value = {
      service_date: d.service_date,
      checkout_date: d.checkout_date,
      quantity: d.quantity,
      child_quantity: pricing?.child?.quantity ?? 0,
      selling_price: d.selling_price,
      cost_price: d.cost_price,
      variation_id: d.car_id,
      variation_name: d.item_name,
    };
  },
  { immediate: true },
);
</script>
