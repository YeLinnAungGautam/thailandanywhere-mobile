<template>
  <div class="flex flex-col h-full min-h-screen bg-slate-100 font-sans">
    <Navbar />
    <!-- ═══ TOP NAV BAR ═══ -->
    <div
      class="flex-shrink-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3"
    >
      <span class="text-lg">🏨</span>
      <h2 class="text-base font-bold text-slate-700 flex-1">Hotels</h2>
      <!-- Chart mode toggle -->
      <div
        class="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-1"
      >
        <button
          @click="
            chartMode = 'availability';
            buildChart();
          "
          class="text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all"
          :class="
            chartMode === 'availability'
              ? 'bg-white text-slate-700 shadow-sm border border-slate-200'
              : 'text-slate-400'
          "
        >
          📊 Avail
        </button>
        <button
          @click="
            chartMode = 'discount';
            buildChart();
          "
          class="text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all"
          :class="
            chartMode === 'discount'
              ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
              : 'text-slate-400'
          "
        >
          🏷️ Disc
        </button>
      </div>
    </div>

    <!-- ═══ HOTEL SELECTOR (dropdown trigger) ═══ -->
    <div class="flex-shrink-0 bg-white border-b border-slate-200 px-4 py-2.5">
      <button
        @click="showHotelSheet = true"
        class="w-full flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-left transition-all active:bg-slate-100"
      >
        <svg
          class="w-4 h-4 text-slate-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span
          class="flex-1 text-sm truncate"
          :class="
            selectedHotelId ? 'text-slate-700 font-semibold' : 'text-slate-400'
          "
        >
          {{ selectedHotelId ? selectedHotelName : "Select a hotel…" }}
        </span>
        <svg
          class="w-4 h-4 text-slate-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>

    <!-- ═══ MONTH PICKER + PRESETS ═══ -->
    <div
      class="flex-shrink-0 bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2"
    >
      <div
        class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 flex-1"
      >
        <svg
          class="w-3.5 h-3.5 text-slate-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <input
          type="month"
          v-model="selectedMonth"
          :min="minMonth"
          class="text-xs text-slate-600 bg-transparent outline-none cursor-pointer w-full"
        />
      </div>
      <div class="flex gap-1 flex-shrink-0">
        <button
          v-for="preset in monthPresets"
          :key="preset.label"
          @click="applyMonthPreset(preset.offset)"
          class="text-[11px] font-semibold px-2.5 py-1.5 rounded-full border transition-colors"
          :class="
            activeMonthOffset === preset.offset
              ? 'bg-orange-500 text-white border-orange-500'
              : 'bg-white text-slate-500 border-slate-200'
          "
        >
          {{ preset.offset === 0 ? "This" : "Next" }}
        </button>
      </div>
    </div>

    <!-- ═══ EMPTY STATE ═══ -->
    <div
      v-if="!selectedHotelId"
      class="flex-1 flex flex-col items-center justify-center gap-3 px-8 py-16"
    >
      <div class="text-5xl opacity-20">🏨</div>
      <h3 class="text-base font-bold text-slate-400">Select a hotel</h3>
      <p class="text-xs text-slate-400 text-center leading-relaxed">
        Tap the search bar above to choose a hotel and view room availability.
      </p>
    </div>

    <!-- ═══ HOTEL SELECTED CONTENT ═══ -->
    <template v-else>
      <!-- Hotel name + room subtitle -->
      <div class="flex-shrink-0 bg-white border-b border-slate-200 px-4 py-2.5">
        <h2
          class="text-base font-extrabold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent leading-tight"
        >
          {{ selectedHotelName }}
        </h2>
        <p class="text-[11px] text-slate-400 mt-0.5">
          {{
            selectedRoomId
              ? selectedRoomName + " · " + checkin + " – " + checkout
              : "Select a room below"
          }}
        </p>
      </div>

      <!-- ── ROOM STRIP ── -->
      <div class="flex-shrink-0 bg-white border-b border-slate-200">
        <div v-if="loadingRooms" class="flex items-center gap-2 px-4 py-3">
          <div
            class="w-4 h-4 border-2 border-slate-200 border-t-orange-500 rounded-full animate-spin"
          ></div>
          <span class="text-xs text-slate-400">Loading rooms…</span>
        </div>
        <div v-else-if="visibleRooms.length === 0" class="px-4 py-3">
          <p class="text-xs text-slate-400">
            No rooms available for this hotel.
          </p>
        </div>
        <div
          v-else
          ref="roomScrollRef"
          @scroll="updateScrollState"
          class="flex gap-2 px-4 py-3 overflow-x-auto"
          style="scrollbar-width: none; -ms-overflow-style: none"
        >
          <div
            v-for="room in visibleRooms"
            :key="room.id"
            @click="selectRoom(room)"
            class="flex-shrink-0 rounded-xl border px-3 py-2.5 cursor-pointer transition-all duration-150 w-[180px] active:scale-95"
            :class="
              selectedRoomId === room.id
                ? 'bg-orange-50 border-orange-300 shadow-sm'
                : 'bg-white border-slate-200'
            "
          >
            <p
              class="text-[13px] font-bold mb-1.5 truncate"
              :class="
                selectedRoomId === room.id
                  ? 'text-orange-600'
                  : 'text-slate-700'
              "
            >
              {{ room.name }}
            </p>
            <div class="flex gap-1 flex-wrap">
              <span
                v-if="getRoomCount(room, 'green') > 0"
                class="text-[11px] font-bold font-mono text-emerald-700"
                >🟢 {{ getRoomCount(room, "green") }}</span
              >
              <span
                v-if="getRoomCount(room, 'yellow') > 0"
                class="text-[11px] font-bold font-mono text-amber-700"
                >🟡 {{ getRoomCount(room, "yellow") }}</span
              >
              <span
                v-if="getRoomCount(room, 'red') > 0"
                class="text-[11px] font-bold font-mono text-red-700"
                >🔴 {{ getRoomCount(room, "red") }}</span
              >
              <span
                v-if="getRoomCount(room, 'overbooked') > 0"
                class="text-[11px] font-bold font-mono text-red-800"
                >⛔ {{ getRoomCount(room, "overbooked") }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- ── CHART AREA ── -->
      <div class="flex-1 flex flex-col overflow-y-auto">
        <!-- No room selected -->
        <div
          v-if="!selectedRoomId"
          class="flex-1 flex flex-col items-center justify-center gap-2 py-16"
        >
          <div class="text-3xl opacity-20">📊</div>
          <p class="text-xs text-slate-400">
            Tap a room above to view the chart
          </p>
        </div>

        <template v-else>
          <!-- Summary cards — 2×2 grid on mobile -->
          <!-- <div class="grid grid-cols-2 gap-2.5 p-4 flex-shrink-0">
            <div
              v-for="card in summaryCards"
              :key="card.label"
              class="bg-white rounded-xl border-t-4 border border-slate-100 px-3 py-3 text-center shadow-sm"
              :class="card.topBorder"
            >
              <p class="text-2xl font-black font-mono" :class="card.textColor">
                {{ card.value }}
              </p>
              <p
                class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5"
              >
                {{ card.label }}
              </p>
            </div>
          </div> -->

          <!-- Chart -->
          <div
            class="mx-4 mb-4 mt-4 bg-white rounded-xl border border-slate-200 p-3 shadow-sm"
            style="min-height: 240px"
          >
            <canvas ref="chartCanvas"></canvas>
          </div>
        </template>
      </div>
    </template>

    <!-- ═══ HOTEL BOTTOM SHEET ═══ -->
    <Teleport to="body">
      <transition name="sheet">
        <div
          v-if="showHotelSheet"
          class="fixed inset-0 z-50 flex flex-col justify-end"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-black/40"
            @click="showHotelSheet = false"
          ></div>
          <!-- Sheet -->
          <div
            class="relative bg-white rounded-t-2xl flex flex-col overflow-hidden"
            style="max-height: 75vh"
          >
            <!-- Handle -->
            <div class="flex-shrink-0 flex justify-center pt-3 pb-1">
              <div class="w-9 h-1 rounded-full bg-slate-300"></div>
            </div>
            <!-- Search -->
            <div class="flex-shrink-0 px-4 pb-3 border-b border-slate-100">
              <div class="relative">
                <svg
                  class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  v-model="hotelSearch"
                  type="text"
                  placeholder="Search hotels…"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 text-sm py-2.5 pl-8 pr-3 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition-all"
                />
              </div>
            </div>
            <!-- Hotel list -->
            <div class="flex-1 overflow-y-auto p-3 space-y-0.5">
              <div
                v-if="loadingHotels"
                class="flex flex-col items-center justify-center py-10 gap-3"
              >
                <div
                  class="w-5 h-5 border-2 border-slate-200 border-t-orange-500 rounded-full animate-spin"
                ></div>
                <span class="text-xs text-slate-400">Loading…</span>
              </div>
              <template v-else>
                <div
                  v-for="hotel in filteredHotelList"
                  :key="hotel.id"
                  @click="
                    selectHotel(hotel);
                    showHotelSheet = false;
                  "
                  class="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-150 border active:scale-95"
                  :class="
                    selectedHotelId === hotel.id
                      ? 'bg-orange-50 border-orange-200'
                      : 'border-transparent hover:bg-slate-50 hover:border-slate-200'
                  "
                >
                  <div
                    class="w-2 h-2 rounded-full flex-shrink-0"
                    :class="
                      selectedHotelId === hotel.id
                        ? 'bg-orange-500'
                        : 'bg-emerald-400'
                    "
                  ></div>
                  <span
                    class="text-sm flex-1 truncate"
                    :class="
                      selectedHotelId === hotel.id
                        ? 'font-bold text-orange-600'
                        : 'font-medium text-slate-600'
                    "
                  >
                    {{ hotel.name }}
                  </span>
                  <svg
                    v-if="selectedHotelId === hotel.id"
                    class="w-4 h-4 text-orange-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </template>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { Chart, registerables } from "chart.js";
import { useRoomStore } from "../stores/room";
import { useHotelStore } from "../stores/hotel";
import Navbar from "../components/Navbar.vue";

Chart.register(...registerables);

const roomStore = useRoomStore();
const hotelStore = useHotelStore();

// ── State ──────────────────────────────────────────────────────────────────────
const allHotels = ref([]);
const hotelSearch = ref("");
const loadingHotels = ref(false);
const selectedHotelId = ref(null);
const selectedHotelName = ref("");
const hotelRooms = ref([]);
const loadingRooms = ref(false);
const selectedRoomId = ref(null);
const selectedRoomName = ref("");
const chartCanvas = ref(null);
const roomScrollRef = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);
const checkin = ref("");
const checkout = ref("");
let chartInstance = null;
const chartMode = ref("availability");

// ── NEW: bottom sheet toggle ───────────────────────────────────────────────────
const showHotelSheet = ref(false);

// ── Dates: next 30 days ────────────────────────────────────────────────────────
const selectedMonth = ref("");

const minMonth = computed(() => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
});

const monthPresets = [
  { label: "This Month", offset: 0 },
  { label: "Next Month", offset: 1 },
];

const activeMonthOffset = computed(() => {
  if (!selectedMonth.value) return null;
  const [y, m] = selectedMonth.value.split("-").map(Number);
  const today = new Date();
  const diffMonths =
    (y - today.getFullYear()) * 12 + (m - (today.getMonth() + 1));
  return monthPresets.find((p) => p.offset === diffMonths)?.offset ?? null;
});

const applyMonthPreset = (offset) => {
  const today = new Date();
  const target = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  selectedMonth.value = `${target.getFullYear()}-${String(
    target.getMonth() + 1,
  ).padStart(2, "0")}`;
};

const dates = computed(() => {
  if (!checkin.value || !checkout.value) return [];
  const start = new Date(checkin.value);
  const end = new Date(checkout.value);
  const result = [];
  const cur = new Date(start);
  while (cur <= end) {
    result.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return result;
});

const legend = [
  { label: "Available", color: "#22c55e" },
  { label: "Booked", color: "rgba(100,116,139,0.4)" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtKey = (d) => {
  const y = d.getFullYear();
  const mon = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mon}-${day}`;
};

const getStock = (room, d) =>
  room?.room_rates?.[fmtKey(d)]?.stock ?? room?.meta?.stock ?? 0;
const getBooked = (room, d) => room?.room_rates?.[fmtKey(d)]?.booked_count ?? 0;

const classifyDay = (stock, booked) => {
  if (booked > stock) return "overbooked";
  const avail = stock - booked;
  if (avail <= Math.ceil(stock * 0.2)) return "red";
  if (avail <= Math.ceil(stock * 0.4)) return "yellow";
  return "green";
};

const getRoomCount = (room, status) =>
  dates.value.filter(
    (d) => classifyDay(getStock(room, d), getBooked(room, d)) === status,
  ).length;

// ── FIX 1: Filter rooms by meta.is_show_on === "1" ────────────────────────────
const visibleRooms = computed(() =>
  hotelRooms.value.filter(
    (r) => r.meta?.is_show_on === "1" || r.meta?.is_show_on === 1,
  ),
);

// ── Filtered hotel list ────────────────────────────────────────────────────────
const filteredHotelList = computed(() => {
  const q = hotelSearch.value.trim().toLowerCase();
  const list = allHotels.value.filter((h) => h.allowment == 1);
  return q ? list.filter((h) => h.name.toLowerCase().includes(q)) : list;
});

// ── Summary cards ──────────────────────────────────────────────────────────────
const summaryCards = computed(() => {
  const room = hotelRooms.value.find((r) => r.id === selectedRoomId.value);
  if (!room) return [];
  const c = { green: 0, yellow: 0, red: 0, overbooked: 0 };
  dates.value.forEach((d) => {
    c[classifyDay(getStock(room, d), getBooked(room, d))]++;
  });
  return [
    {
      label: "Green Days",
      value: c.green,
      textColor: "text-emerald-600",
      topBorder: "border-t-emerald-400",
    },
    {
      label: "Yellow Days",
      value: c.yellow,
      textColor: "text-amber-500",
      topBorder: "border-t-amber-400",
    },
    {
      label: "Red Days",
      value: c.red,
      textColor: "text-red-500",
      topBorder: "border-t-red-400",
    },
    {
      label: "Overbooked",
      value: c.overbooked,
      textColor: "text-red-800",
      topBorder: "border-t-red-800",
    },
  ];
});

// ── FIX 2: Scroll arrow state ──────────────────────────────────────────────────
const updateScrollState = () => {
  const el = roomScrollRef.value;
  if (!el) return;
  canScrollLeft.value = el.scrollLeft > 0;
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
};

const scrollRooms = (dir) => {
  const el = roomScrollRef.value;
  if (!el) return;
  el.scrollBy({ left: dir === "right" ? 200 : -200, behavior: "smooth" });
};

// ── FIX 3 & 4 & 5: Chart ──────────────────────────────────────────────────────
const buildChart = async () => {
  await nextTick();
  const canvas = chartCanvas.value;
  if (!canvas) return;

  const room = hotelRooms.value.find((r) => r.id === selectedRoomId.value);
  if (!room) return;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const labels = [];

  if (chartMode.value === "discount") {
    const discountData = [];

    dates.value.forEach((d) => {
      labels.push(
        d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      );
      const rate = room?.room_rates?.[fmtKey(d)];
      discountData.push(rate?.discount ?? 0);
    });

    const maxDiscount = Math.max(...discountData, 1);
    const yMax = Math.ceil(maxDiscount * 1.35);

    chartInstance = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Discount",
            data: discountData,
            backgroundColor: discountData.map((v) =>
              v > 0 ? "rgba(249,115,22,0.75)" : "rgba(203,213,225,0.35)",
            ),
            borderWidth: 0,
            barThickness: 20,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 28 } },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 9, weight: "600" },
              color: "#64748b",
              maxRotation: 45,
              minRotation: 45,
              autoSkip: true,
              maxTicksLimit: 12,
            },
            border: { display: false },
          },
          y: {
            beginAtZero: true,
            max: yMax,
            grid: { color: "rgba(148,163,184,0.1)" },
            border: { display: false },
            ticks: {
              stepSize: 5,
              callback: (v) => (v % 5 === 0 ? `${v}฿` : null),
              font: { size: 9 },
              color: "#94a3b8",
            },
            title: {
              display: true,
              text: "Discount (฿)",
              font: { size: 9 },
              color: "#94a3b8",
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(15,23,42,0.95)",
            titleColor: "#f1f5f9",
            bodyColor: "#cbd5e1",
            cornerRadius: 8,
            padding: 12,
            borderWidth: 1,
            borderColor: "rgba(148,163,184,0.15)",
            callbacks: {
              title: (ctx) => {
                const d = dates.value[ctx[0].dataIndex];
                return d.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });
              },
              label: (ctx) => {
                const d = dates.value[ctx.dataIndex];
                const rate = room?.room_rates?.[fmtKey(d)];
                const discount = rate?.discount ?? 0;
                const roomPrice = rate?.room_price ?? 0;
                const currentPrice = rate?.current_price ?? 0;
                return [
                  `Discount: ฿${discount}`,
                  roomPrice ? `Original: ฿${roomPrice.toLocaleString()}` : null,
                  currentPrice
                    ? `After discount: ฿${currentPrice.toLocaleString()}`
                    : null,
                ].filter(Boolean);
              },
            },
          },
        },
      },
      plugins: [
        {
          id: "discountLabels",
          afterDatasetsDraw(chart) {
            const ctx = chart.ctx;
            const meta = chart.getDatasetMeta(0);
            ctx.save();
            ctx.font = "600 9px system-ui, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            meta.data.forEach((bar, i) => {
              const val = discountData[i];
              if (!val) return;
              ctx.fillStyle = "#ea580c";
              ctx.fillText(`${val}฿`, bar.x, bar.y - 3);
            });
            ctx.restore();
          },
        },
      ],
    });
    return;
  }

  const availData = [];
  const bookedData = [];

  dates.value.forEach((d) => {
    labels.push(
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    );
    const stock = getStock(room, d);
    const booked = getBooked(room, d);
    const avail = Math.max(0, stock - booked);
    availData.push(stock === 0 && booked === 0 ? 0 : avail);
    bookedData.push(Math.min(booked, stock));
  });

  const maxVal = Math.max(...availData.map((a, i) => a + bookedData[i]));
  const yMax = Math.max(Math.ceil(maxVal * 1.35), 5);

  chartInstance = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Available",
          data: availData,
          backgroundColor: dates.value.map((d) => {
            const stock = getStock(room, d);
            const booked = getBooked(room, d);
            if (stock === 0 && booked === 0) return "rgba(203,213,225,0.3)";
            const status = classifyDay(stock, booked);
            return status === "overbooked"
              ? "#dc2626"
              : status === "red"
                ? "#ef4444"
                : "#22c55e";
          }),
          borderWidth: 0,
          barThickness: 20,
          stack: "s",
        },
        {
          label: "Booked",
          data: bookedData,
          backgroundColor: "rgba(100,116,139,0.35)",
          borderWidth: 0,
          barThickness: 20,
          stack: "s",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      layout: { padding: { top: 24 } },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: {
            font: { size: 9, weight: "600" },
            color: "#64748b",
            maxRotation: 45,
            minRotation: 45,
            autoSkip: true,
            maxTicksLimit: 12,
          },
          border: { display: false },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          max: yMax,
          grid: { color: "rgba(148,163,184,0.1)" },
          border: { display: false },
          ticks: {
            stepSize: 1,
            callback: (v) => (Number.isInteger(v) ? v : null),
            font: { size: 9 },
            color: "#94a3b8",
          },
          title: {
            display: true,
            text: "Rooms",
            font: { size: 9 },
            color: "#94a3b8",
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(15,23,42,0.95)",
          titleColor: "#f1f5f9",
          bodyColor: "#cbd5e1",
          footerColor: "#94a3b8",
          cornerRadius: 8,
          padding: 12,
          borderWidth: 1,
          borderColor: "rgba(148,163,184,0.15)",
          callbacks: {
            title: (ctx) => {
              const d = dates.value[ctx[0].dataIndex];
              return d.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
            },
            footer: (items) => {
              const d = dates.value[items[0].dataIndex];
              const stock = getStock(room, d);
              const booked = getBooked(room, d);
              const avail = Math.max(0, stock - booked);
              const emoji = {
                green: "🟢",
                yellow: "🟡",
                red: "🔴",
                overbooked: "⛔",
              }[classifyDay(stock, booked)];
              return [
                `Stock: ${stock}  |  Booked: ${booked}  |  Avail: ${avail}  ${emoji}`,
              ];
            },
          },
        },
      },
    },
    plugins: [
      {
        id: "topLabels",
        afterDatasetsDraw(chart) {
          const ctx = chart.ctx;
          const meta0 = chart.getDatasetMeta(0);
          const meta1 = chart.getDatasetMeta(1);
          ctx.save();
          ctx.font = "600 9px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          meta0.data.forEach((bar, i) => {
            const avail = availData[i];
            const booked = bookedData[i];
            const total = avail + booked;
            if (total === 0) return;
            const bar1 = meta1.data[i];
            const topY = bar1 ? Math.min(bar.y, bar1.y) : bar.y;
            const d = dates.value[i];
            const stock = getStock(room, d);
            const bk = getBooked(room, d);
            const status = classifyDay(stock, bk);
            ctx.fillStyle =
              status === "overbooked"
                ? "#dc2626"
                : status === "red"
                  ? "#ef4444"
                  : status === "yellow"
                    ? "#d97706"
                    : "#16a34a";
            ctx.fillText(String(avail), bar.x, topY - 3);
          });
          ctx.restore();
        },
      },
    ],
  });
};

// ── Data loading ───────────────────────────────────────────────────────────────
const loadHotels = async () => {
  loadingHotels.value = true;
  try {
    const res = await hotelStore.getListAction({ allowment: 1 });
    allHotels.value = res.result.data || [];
  } catch (e) {
    console.error(e);
  } finally {
    loadingHotels.value = false;
  }
};

const loadRoomsForHotel = async (hotelId) => {
  loadingRooms.value = true;
  hotelRooms.value = [];
  selectedRoomId.value = null;
  selectedRoomName.value = "";
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  try {
    const today = new Date();
    const next = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const [r1, r2] = await Promise.all([
      roomStore.getListAction({
        hotel_id: hotelId,
        include_rates: true,
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        limit: 100,
      }),
      roomStore.getListAction({
        hotel_id: hotelId,
        include_rates: true,
        year: next.getFullYear(),
        month: next.getMonth() + 1,
        limit: 100,
      }),
    ]);

    const rooms1 =
      r1.status === 1 ? r1.result.data.filter((r) => r.is_extra === 0) : [];
    const rooms2 =
      r2.status === 1 ? r2.result.data.filter((r) => r.is_extra === 0) : [];

    hotelRooms.value = rooms1.map((base) => {
      const extra = rooms2.find((x) => x.id === base.id);
      return {
        ...base,
        room_rates: {
          ...(base.room_rates || {}),
          ...(extra?.room_rates || {}),
        },
      };
    });

    await nextTick();
    updateScrollState();
    const first = visibleRooms.value[0];
    if (first) {
      await selectRoom(first);
    }
  } catch (e) {
    console.error(e);
    hotelRooms.value = [];
  } finally {
    loadingRooms.value = false;
  }
};

// ── Interactions ───────────────────────────────────────────────────────────────
const selectHotel = async (hotel) => {
  if (selectedHotelId.value === hotel.id) return;
  selectedHotelId.value = hotel.id;
  selectedHotelName.value = hotel.name;
  await loadRoomsForHotel(hotel.id);
};

const selectRoom = async (room) => {
  selectedRoomId.value = room.id;
  selectedRoomName.value = room.name;
  await nextTick();
  await buildChart();
};

onMounted(() => {
  const today = new Date();
  selectedMonth.value = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}`;

  loadHotels().then(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = Number(urlParams.get("id"));
    if (hotelId) {
      const hotel = allHotels.value.find((h) => h.id === hotelId);
      if (hotel) selectHotel(hotel);
    }
  });
});

watch(selectedMonth, async () => {
  if (selectedHotelId.value) {
    await loadRoomsForHotel(selectedHotelId.value);
  }
});

watch(selectedMonth, (val) => {
  if (!val) return;
  const [y, m] = val.split("-").map(Number);
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0);
  checkin.value = fmtKey(start);
  checkout.value = fmtKey(end);
});
</script>

<style scoped>
/* Hide scrollbar on room strip */
:deep([ref="roomScrollRef"])::-webkit-scrollbar,
div::-webkit-scrollbar {
  display: none;
}

/* Bottom sheet slide transition */
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.2s ease;
}
.sheet-enter-active .relative,
.sheet-leave-active .relative {
  transition: transform 0.25s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from .relative,
.sheet-leave-to .relative {
  transform: translateY(100%);
}
</style>
