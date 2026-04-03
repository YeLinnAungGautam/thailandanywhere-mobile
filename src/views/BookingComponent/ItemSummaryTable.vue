<!-- ItemSummaryTable.vue -->
<template>
  <div class="text-sm select-none">
    <div class="bg-white rounded-lg border-2 border-slate-200 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-[#FF613c] text-white">
            <!-- Drag handle col -->
            <th
              class="px-3 py-3 text-left font-semibold border-r border-white/20 w-8"
            ></th>
            <!-- Service -->
            <th
              class="px-4 py-3 text-left font-semibold border-r border-white/20 w-28"
            >
              SERVICE
            </th>
            <!-- Description -->
            <th
              class="px-4 py-3 text-left font-semibold border-r border-white/20"
            >
              DESCRIPTION
            </th>
            <!-- QTY -->
            <th
              class="px-4 py-3 text-center font-semibold border-r border-white/20 w-16"
            >
              QTY
            </th>
            <!-- COST -->
            <th
              class="px-4 py-3 text-right font-semibold border-r border-white/20 w-36"
            >
              COST
            </th>
            <!-- SELLING -->
            <th class="px-4 py-3 text-right font-semibold w-36">SELLING</th>
            <th class="px-4 py-3 text-right font-semibold w-36">EXPENSE</th>

            <th class="px-4 py-3 text-right font-semibold w-36">GENERATE</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(group, date) in groupedByDate" :key="date">
            <!-- Date header row -->
            <tr class="bg-slate-50 border-t-2 border-slate-300">
              <td colspan="8" class="px-4 py-2">
                <span class="font-bold text-black text-xs">
                  📅 {{ formatDate(date) }}
                </span>
              </td>
            </tr>

            <!-- Items for this date -->
            <template v-for="(item, idx) in group" :key="item._uid">
              <!-- Drop indicator line (before item) -->
              <tr
                v-if="dragging && dropKey === date && dropIndex === idx"
                class="pointer-events-none"
              >
                <td colspan="6" class="h-0.5 p-0 bg-[#ff613c]" />
              </tr>

              <tr
                draggable="true"
                @dragstart="onDragStart($event, date, idx)"
                @dragend="onDragEnd"
                @dragover.prevent="onDragOver($event, date, idx)"
                @drop.prevent="onDrop(date, idx)"
                class="border-b border-slate-100 transition cursor-grab active:cursor-grabbing"
                :class="
                  draggingKey === date && draggingIndex === idx
                    ? 'opacity-40 bg-blue-50'
                    : 'hover:bg-slate-50'
                "
              >
                <!-- Drag handle -->
                <td class="px-2 py-3 border-r border-slate-200 text-center">
                  <span
                    class="text-lg leading-none select-none"
                    :class="
                      item._type === 'hotel'
                        ? 'text-slate-100 cursor-default'
                        : 'text-slate-300'
                    "
                    >⠿</span
                  >
                </td>

                <!-- SERVICE badge -->
                <td class="px-4 py-3 border-r border-slate-200 align-center">
                  <span
                    class="font-medium text-xs px-2 py-0.5 rounded-full"
                    :class="serviceClass(item._type)"
                  >
                    {{ serviceLabel(item._type) }}
                  </span>
                </td>

                <!-- DESCRIPTION -->
                <td class="px-4 py-3 border-r border-slate-200 align-top">
                  <template v-if="item._type === 'van'">
                    <div class="font-medium">{{ item.vanTourName }}</div>
                    <div class="text-xs text-slate-400">{{ item.carName }}</div>
                  </template>
                  <template v-else-if="item._type === 'attraction'">
                    <div class="font-medium">{{ item.name }}</div>
                    <div class="text-xs text-slate-400">
                      <span v-if="item.children > 0"
                        >{{ item.adults }}A + {{ item.children }}C</span
                      >
                      <span v-else>{{ item.adults }} pax</span>
                    </div>
                  </template>
                  <template v-else-if="item._type === 'hotel'">
                    <div class="font-medium">{{ item.name }}</div>

                    <!-- ✅ Room types တွေကို sub-rows အနေဖြင့် ပြပါ -->
                    <template
                      v-if="item._isHotelGroup && item._roomTypes.length > 1"
                    >
                      <div
                        v-for="(room, rIdx) in item._roomTypes"
                        :key="rIdx"
                        class="mt-1 pt-1 border-t border-slate-100 text-xs text-slate-500"
                      >
                        <span class="font-medium text-slate-600">{{
                          room.roomName
                        }}</span>
                        · {{ room.rooms ?? 1 }} room{{
                          (room.rooms ?? 1) > 1 ? "s" : ""
                        }}
                        <span class="text-slate-400 ml-1">{{
                          room.crm_id
                        }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <div class="text-xs text-slate-400">
                        {{ item.roomName }} · {{ item.nights }} night{{
                          item.nights > 1 ? "s" : ""
                        }}
                        · {{ item.rooms ?? 1 }} room{{
                          (item.rooms ?? 1) > 1 ? "s" : ""
                        }}
                      </div>
                    </template>

                    <div class="text-xs text-slate-400 mt-0.5">
                      {{ item.checkIn }} → {{ item.checkOut }}
                    </div>
                  </template>
                  <template v-if="item.crm_id">
                    <span class="text-xs">{{ item.crm_id }}</span>
                  </template>
                </td>

                <!-- QTY -->
                <td
                  class="px-4 py-3 text-center border-r border-slate-200 align-center font-medium"
                >
                  <template v-if="item._type === 'van'">{{
                    item.cars
                  }}</template>
                  <template v-else-if="item._type === 'hotel'">{{
                    item.nights
                  }}</template>
                  <template v-else>{{
                    item.adults * 1 + item.children * 1
                  }}</template>
                </td>

                <!-- COST column: total on top, unit below -->
                <td
                  class="px-4 py-3 border-r border-slate-200 align-center text-right"
                >
                  <div class="font-medium text-slate-600 text-sm">
                    {{ Number(item.costPrice || 0).toLocaleString() }} ฿
                  </div>
                  <div
                    class="text-xs text-slate-400 mt-1 pt-1 border-t border-slate-200"
                  >
                    {{ unitCost(item).toLocaleString() }} ฿ /
                    {{ unitLabel(item) }}
                  </div>
                </td>

                <!-- SELLING column: total on top, unit below -->
                <td class="px-4 py-3 align-center text-right">
                  <div class="font-bold text-orange-600 text-sm">
                    {{ Number(item.sellingPrice || 0).toLocaleString() }} ฿
                  </div>
                  <div
                    class="text-xs text-slate-400 mt-1 pt-1 border-t border-slate-200"
                  >
                    {{ unitSell(item).toLocaleString() }} ฿ /
                    {{ unitLabel(item) }}
                  </div>
                </td>

                <!-- EXPENSE column -->
                <td
                  class="px-4 py-3 border-x border-slate-200 text-center align-center"
                >
                  <span
                    class="font-medium text-xs px-2 py-0.5 rounded-full"
                    :class="paymentClass(item.payment_status)"
                  >
                    {{ paymentLabel(item.payment_status) }}
                  </span>
                </td>
                <td
                  v-if="
                    (item._type == 'hotel' || item._type == 'attraction') &&
                    item.group_id
                  "
                  @click="goToPage(item)"
                  class="px-4 py-3 border-x border-slate-200 text-center align-center underline cursor-pointer"
                >
                  Generate
                </td>
              </tr>
            </template>

            <!-- Drop indicator at end of group -->
            <tr
              v-if="dragging && dropKey === date && dropIndex >= group.length"
              class="pointer-events-none"
            >
              <td colspan="6" class="h-0.5 p-0 bg-[#ff613c]" />
            </tr>

            <!-- Empty drop zone at bottom of each date group -->
            <tr
              @dragover.prevent="onDragOverEnd(date)"
              @drop.prevent="onDropEnd(date)"
              class="h-2"
            >
              <td colspan="6" />
            </tr>
          </template>
        </tbody>
      </table>

      <!-- ── Totals Footer ── -->
      <div class="bg-slate-50 border-t-2 border-slate-300 px-6 py-4">
        <div class="flex justify-end gap-6">
          <!-- Total Cost -->
          <div class="text-right">
            <div class="text-xs text-slate-400 mb-0.5">Total Cost</div>
            <div class="font-semibold text-slate-600 text-base">
              {{ grandTotalCost.toLocaleString() }} ฿
            </div>
          </div>

          <div class="w-px bg-slate-300 self-stretch"></div>

          <!-- Total Selling -->
          <div class="text-right">
            <div class="text-xs text-slate-400 mb-0.5">Total Selling</div>
            <div class="font-bold text-orange-600 text-base">
              {{ grandTotalSelling.toLocaleString() }} ฿
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-6">
          <!-- Total Cost -->
          <div class="text-right">
            <div class="text-xs text-slate-400 mb-0.5">Grand Total In Sale</div>
            <div class="font-semibold text-slate-600 text-base">
              {{ grand.toLocaleString() }} ฿
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  items: { type: Array, default: () => [] },
  grand: { type: String || Number, default: 0 },
});

const emit = defineEmits(["update:items"]);

// ── Map raw itemList → table shape ──
const mappedItems = ref(
  props.items
    .filter((i) => i?.product_type !== undefined)
    .map((i, idx) => {
      const type =
        String(i.product_type) === "1"
          ? "van"
          : String(i.product_type) === "6"
          ? "hotel"
          : "attraction";

      const base = {
        _uid: `item-${idx}`,
        _type: type,
        _order: idx,
        serviceDate: i.service_date || i.checkin_date || "No Date",
        sellingPrice: Number(i.total_amount) || 0,
        costPrice: Number(i.total_cost_price) || 0,
        item_name: i.item_name ?? "",
        payment_status: i.payment_status ? i.payment_status : "not paid",
        group_id: i.group_id ? i.group_id : "",
        crm_id: i.crm_id ? i.crm_id : "",
      };

      if (type === "van")
        return {
          ...base,
          vanTourName: i.product_name,
          carName: i.item_name,
          cars: i.quantity ?? 1,
        };

      if (type === "hotel")
        return {
          ...base,
          name: i.product_name,
          roomName: i.item_name,
          nights: i.days ?? 1,
          rooms: i.quantity ?? 1,
          checkIn: i.checkin_date ?? i.service_date ?? "",
          checkOut: i.checkout_date ?? "",
        };

      return {
        ...base,
        name: i.product_name,
        adults: i.quantity ?? 1,
        children: i.individual_pricing?.child?.quantity ?? 0,
        productType: "entrance_ticket",
      };
    }),
);

const TYPE_ORDER = { hotel: 0, attraction: 1, van: 2 };

const groupedByDate = computed(() => {
  const groups = {};

  mappedItems.value.forEach((item) => {
    if (item._type === "hotel" && item.checkIn && item.checkOut) {
      const start = new Date(item.checkIn);
      const end = new Date(item.checkOut);

      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().split("T")[0];
        if (!groups[key]) groups[key] = [];

        const groupKey =
          item.group_id || `${item.name}|${item.checkIn}|${item.checkOut}`;

        // ✅ တူညီသော hotel group ရှိပြီးသားလား စစ်ပါ
        const existingGroup = groups[key].find(
          (g) => g._isHotelGroup && g._groupKey === groupKey,
        );

        if (existingGroup) {
          // ✅ ရှိပြီးသားဆိုရင် roomTypes ထဲ ထည့်ပါ
          existingGroup._roomTypes.push(item);
          existingGroup.costPrice += item.costPrice;
          existingGroup.sellingPrice += item.sellingPrice;
        } else {
          // ✅ မရှိသေးဆိုရင် hotel group အသစ် ဖန်တီးပါ
          groups[key].push({
            ...item,
            _isHotelGroup: true,
            _groupKey: groupKey,
            _roomTypes: [item], // room types အားလုံး ဒီမှာ သိမ်းပါ
          });
        }
      }
    } else {
      const key = item.serviceDate || "No Date";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }
  });

  for (const key in groups) {
    groups[key].sort(
      (a, b) => (TYPE_ORDER[a._type] ?? 99) - (TYPE_ORDER[b._type] ?? 99),
    );
  }

  return Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)),
  );
});

// ── Grand totals ──
const grandTotalSelling = computed(() =>
  mappedItems.value.reduce((s, i) => s + Number(i.sellingPrice || 0), 0),
);
const grandTotalCost = computed(() =>
  mappedItems.value.reduce((s, i) => s + Number(i.costPrice || 0), 0),
);

// ── Unit helpers ──
const qtyOf = (item) => {
  if (item._type === "van") return item.cars || 1;
  if (item._type === "hotel") return item.nights || 1;
  return (item.adults || 0) * 1 + (item.children || 0) * 1 || 1;
};

const unitLabel = (item) => {
  if (item._type === "van") return "car";
  if (item._type === "hotel") return "night";
  return "pax";
};

const unitCost = (item) => {
  const q = qtyOf(item);
  return Math.round(Number(item.costPrice || 0) / q);
};

const unitSell = (item) => {
  const q = qtyOf(item);
  return Math.round(Number(item.sellingPrice || 0) / q);
};

// ── Drag state ──
const dragging = ref(false);
const draggingKey = ref(null);
const draggingIndex = ref(null);
const dropKey = ref(null);
const dropIndex = ref(null);

const onDragStart = (event, date, idx) => {
  dragging.value = true;
  draggingKey.value = date;
  draggingIndex.value = idx;
  event.dataTransfer.effectAllowed = "move";
};

const onDragEnd = () => {
  dragging.value = false;
  draggingKey.value = null;
  draggingIndex.value = null;
  dropKey.value = null;
  dropIndex.value = null;
};

const onDragOver = (event, date, idx) => {
  if (draggingKey.value !== date) {
    event.dataTransfer.dropEffect = "none";
    return;
  }
  dropKey.value = date;
  const rect = event.currentTarget.getBoundingClientRect();
  dropIndex.value = event.clientY < rect.top + rect.height / 2 ? idx : idx + 1;
};

const onDragOverEnd = (date) => {
  if (draggingKey.value !== date) return;
  dropKey.value = date;
  dropIndex.value = groupedByDate.value[date]?.length ?? 0;
};

const onDrop = (date) => {
  if (draggingKey.value !== date) {
    onDragEnd();
    return;
  }
  reorder(date);
};

const onDropEnd = (date) => {
  if (draggingKey.value !== date) {
    onDragEnd();
    return;
  }
  reorder(date);
};

const reorder = (date) => {
  const fromIdx = draggingIndex.value;
  let toIdx = dropIndex.value ?? 0;
  if (fromIdx === null || fromIdx === toIdx || fromIdx === toIdx - 1) {
    onDragEnd();
    return;
  }

  const all = [...mappedItems.value];
  const group = all.filter((i) => i.serviceDate === date);
  const others = all.filter((i) => i.serviceDate !== date);

  const [moved] = group.splice(fromIdx, 1);
  if (toIdx > fromIdx) toIdx--;
  group.splice(toIdx, 0, moved);
  group.forEach((item, i) => {
    item._order = i;
  });

  const dateKeys = Object.keys(groupedByDate.value);
  const dateIdx = dateKeys.indexOf(date);

  mappedItems.value = [
    ...others.filter((i) => dateKeys.indexOf(i.serviceDate) < dateIdx),
    ...group,
    ...others.filter((i) => dateKeys.indexOf(i.serviceDate) > dateIdx),
  ];

  emit("update:items", mappedItems.value);
  onDragEnd();
};

const goToPage = (item) => {
  console.log(item, "this is page");
  if (item._type == "hotel") {
    window.open(`/group-hotel?id=${item.group_id}`, "_blank");
  }
  if (item._type == "attraction") {
    window.open(`/group-attraction?id=${item.group_id}`, "_blank");
  }
};

// ── Date format ──
const formatDate = (dateStr) => {
  if (!dateStr || dateStr === "No Date") return "No Date";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const serviceLabel = (type) =>
  ({ van: "Van Tour", hotel: "Hotel", attraction: "Attraction" }[type] ?? type);

const serviceClass = (type) =>
  ({
    van: "bg-green-100 text-green-700",
    hotel: "bg-purple-100 text-purple-700",
    attraction: "bg-amber-100 text-amber-700",
  }[type] ?? "bg-gray-100 text-gray-600");

const paymentLabel = (type) =>
  ({ paid: "fully_paid", not: "not_paid", partially: "partially_paid" }[type] ??
  type);

const paymentClass = (type) =>
  ({
    fully_paid: "bg-green-100 text-green-700",
    not_paid: "bg-red-100 text-red-700",
    partially_paid: "bg-amber-100 text-amber-700",
  }[type] ?? "bg-gray-100 text-gray-600");

onMounted(() => {
  console.log(props.items, "this is props");
});
</script>
