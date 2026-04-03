// A4PaginatedRenderer.vue
<template>
  <div class="flex flex-col gap-5">
    <div class="flex justify-start items-center gap-3">
      <!-- <button
        @click="router.back()"
        class="p-2 border border-gray-500 text-sm text-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors"
      >
        <ChevronLeftIcon class="w-5 h-5" />
      </button> -->
      <button
        @click="generatePNGs"
        class="px-4 py-2 text-sm text-white bg-green-500 rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-colors"
      >
        Generate PNG Images & Download All as Png
      </button>
      <!-- <button
        @click="downloadAll"
        :disabled="!pngUrls.length"
        class="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Download All As Zip
      </button>
      <button
        @click="downloadAsSinglePage()"
        :disabled="!pngUrls.length"
        class="px-4 py-2 text-sm text-white bg-orange-500 rounded-lg shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Download All As Png
      </button> -->
    </div>

    <!-- Generated PNG previews -->
    <div v-if="pngUrls.length" class="mt-8">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-sm">Generated PNG Images</h3>
      </div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
      >
        <div
          v-for="(url, index) in pngUrls"
          :key="index"
          class="flex flex-col items-center"
        >
          <div class="flex flex-col items-center w-full">
            <p class="mb-2">Page {{ index + 1 }}</p>
            <img
              :src="url"
              :alt="`Page ${index + 1}`"
              class="max-w-full h-auto border border-gray-200 shadow-sm mb-2"
            />
            <button
              @click="downloadSinglePage(index)"
              class="w-full mt-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-500 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 transition-colors"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>

    <template v-for="(page, index) in pages" :key="index">
      <div
        class="max-w-4xl mx-auto bg-white shadow-lg mb-10"
        ref="pageRefs"
        v-if="!items.isInclusive || index === 0"
      >
        <!-- Header -->
        <div
          class="bg-orange-500 text-white py-6 px-8 flex justify-between items-center"
        >
          <div class="space-y-2">
            <h1 class="text-2xl font-bold">
              Thailand <span class="font-normal">Anywhere</span>
            </h1>
            <p class="text-sm">View on: www.thanywhere.com/scan</p>
          </div>
          <div class="text-right">
            <div class="flex items-end justify-center mb-2">
              <span class="w-32 font-medium text-left">Invoice to:</span>
              <span class="min-w-40 text-[25px] font-semibold">{{
                items.customer
              }}</span>
            </div>
            <div class="flex items-end justify-between mb-2">
              <span class="w-32 font-medium text-left">Sales date:</span>
              <span class="min-w-40 text-end text-sm">{{
                items.salesDate
              }}</span>
            </div>
            <div class="flex items-end justify-between mb-2">
              <span class="w-32 font-medium text-left">Due Date:</span>
              <span class="min-w-40 text-sm">{{ items.dueDate }}</span>
            </div>
          </div>
        </div>

        <!-- Items Header -->
        <div class="flex justify-between mt-6">
          <div class="bg-orange-500 text-white px-8 font-medium text-sm">
            <p class="pb-4">Items</p>
          </div>
          <div
            class="bg-orange-500 text-white px-4 mr-8 rounded-xl font-medium"
          >
            <p class="pb-4">{{ items.invoiceNumber }}</p>
          </div>
        </div>

        <!-- Items List -->

        <div class="p-4 mt-4 h-[510px]">
          <!-- ══ INCLUSIVE LAYOUT ══ -->
          <template v-if="items.isInclusive">
            <div class="flex items-center mb-6 px-2">
              <!-- Icon placeholder -->
              <div class="flex-shrink-0">
                <div
                  class="w-24 h-24 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-8 h-8 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 pl-6">
                <h3 class="text-lg font-bold text-gray-900 leading-tight">
                  {{ items.inclusiveName }}
                </h3>
                <p class="text-sm text-orange-500 font-semibold mt-0.5">
                  All Inclusive Package
                </p>
                <p class="text-sm font-bold text-gray-800 mt-0.5">
                  {{ items.inclusiveStartDate }} - {{ items.inclusiveEndDate }}
                </p>
                <p class="text-sm text-gray-600">
                  {{ items.inclusiveQty }} Qty x {{ items.inclusiveRate }}
                </p>
              </div>

              <!-- Pricing -->
              <div class="flex-shrink-0 text-right min-w-[200px]">
                <div class="flex items-center justify-end mb-1">
                  <span class="text-sm text-gray-500 mr-6">Discount:</span>
                  <span class="text-lg font-bold text-gray-800 w-24 text-right"
                    >0 ฿</span
                  >
                </div>
                <div class="flex items-center justify-end">
                  <span class="text-sm text-gray-500 mr-6">Amount:</span>
                  <span
                    class="text-2xl font-extrabold whitespace-nowrap text-gray-900 w-24 text-right"
                    >{{ items.total }} ฿</span
                  >
                </div>
              </div>
            </div>
          </template>

          <!-- ══ NORMAL ITEMS LAYOUT ══ -->
          <template v-else>
            <div
              v-for="(item, itemIndex) in page"
              :key="itemIndex"
              class="flex mb-6 px-2"
            >
              <div class="w-1/7 flex justify-center items-center">
                <img
                  :src="item.image"
                  alt="Item image"
                  class="w-24 h-24 rounded-xl object-cover"
                />
              </div>
              <div class="w-3/4 pl-7">
                <h3 class="text-lg font-bold pb-1">{{ item.name }}</h3>
                <p class="text-sm">{{ item.description }}</p>
                <p class="font-semibold text-sm">{{ item.period }}</p>
                <p class="text-sm">{{ item.details }}</p>
              </div>
              <div class="w-1/5 text-right">
                <p class="mb-1 flex justify-center items-center">
                  <span class="inline-block w-24 text-xs pr-3">Discount:</span>
                  <span class="inline-block w-24 text-right font-medium text-xl"
                    >{{ item.discount }} ฿</span
                  >
                </p>
                <p class="flex justify-center items-center">
                  <span class="inline-block w-24 text-xs pr-3">Amount:</span>
                  <span class="inline-block w-24 text-right font-bold text-xl"
                    >{{ item.amount }} ฿</span
                  >
                </p>
              </div>
            </div>
          </template>
        </div>

        <!-- QR Code and Summary -->
        <div class="flex mt-4 pt-4 pb-8 px-6 relative">
          <div class="w-2/6 bg-[#FF613c] h-1 absolute -top-2 right-0"></div>
          <div class="flex">
            <div class="w-1/3 relative">
              <!-- <div
              class="absolute flex justify-center w-48 h-48 items-center bg-gray-900 opacity-50 text-white"
            >
              <p class="bg-white text-black font-semibold">coming soon</p>
            </div> -->
              <!-- <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuIy6HNc3zXzJ9-y-rNEfnaSdhcgeXytmnQg&s"
              alt="QR Code"
              class="w-48 h-48"
            /> -->
              <div class="flex justify-center w-60 h-48 items-center">
                <QrCode
                  :id="items.invoiceId"
                  :crm_id="items.invoiceNumber"
                  :size="250"
                  :type="'Invoice'"
                  :color="'#f97315'"
                />
              </div>
            </div>
            <div class="w-3/5 pr-5 pl-16 py-2">
              <p class="font-semibold text-sm mb-2">
                Validate your tickets on our official website:
              </p>
              <ul class="list-disc pl-5 text-xs">
                <li>Scan the above QR</li>
                <li>Login / Signup to thanywhere.com</li>
                <li>Confirm to connect invoice to profile.</li>
                <li>View tickets, booking status and a lot more!</li>
              </ul>
              <p class="mt-4 text-xs">
                Note QR can only be connected once. Please protect your invoice
                by connecting to your profile as soon as possible.
              </p>
            </div>
          </div>
          <div class="w-1/2">
            <div class="text-left">
              <div class="flex justify-end mb-2 font-semibold">
                <span class="inline-block w-32 font-semibold">Subtotal:</span>
                <span class="inline-block w-36 text-right"
                  >{{ items.subtotal }} ฿</span
                >
              </div>
              <div class="flex justify-end mb-2 font-semibold">
                <span class="inline-block w-32 font-semibold">Discount:</span>
                <span class="inline-block w-36 text-right"
                  >{{ items.totalDiscount }} ฿</span
                >
              </div>
              <div class="flex justify-end mb-2 font-semibold">
                <span class="inline-block w-32">Total:</span>
                <span class="inline-block w-36 text-right"
                  >{{ items.total }} ฿</span
                >
              </div>
              <div class="flex justify-end mb-2 font-semibold">
                <span class="inline-block w-32 font-semibold">Deposit:</span>
                <span class="inline-block w-36 text-right"
                  >{{ items.deposit }} ฿</span
                >
              </div>
              <div class="flex justify-end mb-2 font-semibold">
                <span class="inline-block w-32">Balance Due:</span>
                <span class="inline-block w-36 text-right"
                  >{{ items.balanceDue }} ฿</span
                >
              </div>
              <div class="flex justify-end mb-2 font-semibold">
                <span class="inline-block w-32 font-semibold"
                  >Payment Due:</span
                >
                <span
                  :class="{
                    'text-orange-600': items.paymentStatus == 'partially_paid',
                    'text-green-600': items.paymentStatus == 'fully_paid',
                    'text-red-600': items.paymentStatus == 'not_paid',
                  }"
                  class="inline-block w-36 text-right font-semibold"
                  >{{ items.paymentStatus }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="bg-[#FF613c] h-1"></div>
          <div class="py-4">
            <p class="text-start pl-6 font-semibold text-[#FF613c] text-sm">
              လူကြီးမင်း၏ ခရီးတစ်လျှောက် အရေးပေါ်ကိစ္စများ နှင့် အခြား
              အခက်ခဲများ အတွက် ဆက်သွယ်ရန်။
            </p>
            <p
              class="text-start pl-6 pt-3 pb-4 font-semibold text-[#FF613c] text-sm"
            >
              ဖုန်းနံပါတ်။ ။​ <span class="pl-4">🇲🇲 +959 963394746</span>
              <span class="pl-4">🇹🇭 +66 637602448</span>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-orange-500 text-white p-6">
          <div class="grid grid-cols-4">
            <div class="">
              <div class="flex items-center mb-3">
                <div class="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <span class="pb-4">+959 972185129</span>
              </div>
            </div>
            <div class="">
              <div class="flex items-center mb-3">
                <div class="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-4 w-4"
                  >
                    <path
                      d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                    />
                  </svg>
                </div>
                <span class="pb-4">/ThAnywhereYgn</span>
              </div>
            </div>
            <div class="col-span-2">
              <div class="flex">
                <div class="">
                  <div class="mb-3">
                    <div class="flex items-center">
                      <div class="mr-2 mt-1 pb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div class="">
                        <p class="font-bold pb-1">Yangon Branch</p>
                        <p class="text-xs">
                          အမှတ်-၃၉ (မြေညီ)၊ United Condo၊ အလံပြဘုရားလမ်း၊
                          ဒဂုံမြို့နယ်၊ ရန်ကုန်။
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-4">
            <div class="">
              <div class="flex items-center mb-3">
                <div class="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <span class="pb-4">+959 250794945</span>
              </div>
            </div>
            <div class="">
              <div class="flex items-center mb-3">
                <div class="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-4 w-4"
                  >
                    <path
                      d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                    />
                  </svg>
                </div>
                <span class="pb-4">/ThAnywhereMdy</span>
              </div>
            </div>
            <div class="col-span-2">
              <div class="flex">
                <div class="">
                  <div class="mb-3">
                    <div class="flex items-center">
                      <div class="mr-2 mt-1 pb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p class="font-bold pb-1">Mandalay Branch</p>
                        <p class="text-xs">
                          အမှတ်-74၊ 84-လမ်း 28 နဲ့ 29 လမ်းကြား၊
                          ချမ်းအေးသာဇံမြို့နယ်၊ မန္တလေး။
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-4">
            <div class="">
              <div class="flex items-center mb-3">
                <div class="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <span class="pb-4">+66 637602448</span>
              </div>
            </div>
            <div class="">
              <div class="flex items-center mb-3">
                <div class="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-4 w-4"
                  >
                    <path
                      d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                    />
                  </svg>
                </div>
                <span class="pb-4">/ThAnywherePattaya</span>
              </div>
            </div>
            <div class="col-span-2">
              <div class="flex">
                <div class="">
                  <div class="mb-3">
                    <div class="flex items-center">
                      <div class="mr-2 mt-1 pb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p class="font-bold pb-1">Chaing Mai Branch</p>
                        <p class="text-xs">
                          100/151 Huay Kaew Rd, Tambon Chang Phueak, Mueang
                          Chiang Mai District, Chiang Mai 50300
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import QrCode from "../../components/QrCode.vue";
import { useRoute, useRouter } from "vue-router";
import { ChevronLeftIcon } from "@heroicons/vue/24/outline";

const route = useRoute();
const router = useRouter();
// Props definition
const props = defineProps({
  // Array of data items to render
  items: {
    type: Array,
    required: true,
  },
  // Maximum items per A4 page
  itemsPerPage: {
    type: Number,
    default: 10,
  },
});

// Reactive state
const pngUrls = ref([]);
const pageRefs = ref([]);

// Computed pagination based on items array
const pages = computed(() => {
  const result = [];
  let currentPage = [];

  for (let i = 0; i < props.items?.items.length; i++) {
    currentPage.push(props.items?.items[i]);

    if (
      currentPage.length >= props.itemsPerPage ||
      i === props.items.items.length - 1
    ) {
      result.push([...currentPage]);
      currentPage = [];
    }
  }

  console.log(result);

  return result;
});

const isGenerating = ref(false);

// Generate PNG for each page
const generatePNGs = async () => {
  isGenerating.value = true;
  // Clear previous PNGs
  pngUrls.value = [];

  // For each page, generate a PNG
  const totalPages = props.items.isInclusive ? 1 : pages.value.length;
  for (let i = 0; i < totalPages; i++) {
    const pageElement = pageRefs.value[i];
    if (!pageElement) continue;

    try {
      const canvas = await html2canvas(pageElement, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const pngUrl = canvas.toDataURL("image/png");
      pngUrls.value.push(pngUrl);

      const expectedPages = props.items.isInclusive ? 1 : pages.value.length;
      if (pngUrls.value.length === expectedPages) {
        await downloadAsSinglePage();
      }
    } catch (error) {
      console.error(`Error generating PNG for page ${i + 1}:`, error);
    }
  }

  isGenerating.value = false;
};

// Download all PNGs as a single page
const downloadAsSinglePage = async () => {
  for (let i = 0; i < pngUrls.value.length; i++) {
    // Add a small delay between downloads to avoid browser restrictions
    await new Promise((resolve) => setTimeout(resolve, 300));
    downloadSinglePage(i);
  }
};

// Download a single PNG page
const downloadSinglePage = (pageIndex) => {
  if (!pngUrls.value[pageIndex]) return;

  try {
    // Convert data URL to Blob
    const dataUrl = pngUrls.value[pageIndex];
    const byteString = atob(dataUrl.split(",")[1]);
    const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // Customize filename here
    const customFileName = `${props.items.invoiceNumber} - Page ${
      pageIndex + 1
    }.png`;

    const blob = new Blob([ab], { type: mimeString });
    saveAs(blob, customFileName);
  } catch (error) {
    console.error(`Error downloading page ${pageIndex + 1}:`, error);
  }
};

// Download all PNGs as a zip file
const downloadAll = async () => {
  if (!pngUrls.value.length) return;

  try {
    const zip = new JSZip();

    // Add each PNG to the zip
    for (let i = 0; i < pngUrls.value.length; i++) {
      const pngUrl = pngUrls.value[i];
      const base64Data = pngUrl.replace("data:image/png;base64,", "");
      zip.file(`page-${i + 1}.png`, base64Data, { base64: true });
    }

    // Generate and download the zip file
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "a4-pages.zip");
  } catch (error) {
    console.error("Error creating zip file:", error);
  }
};

onMounted(() => {
  generatePNGs();
});

// Watch for changes in the items prop and regenerate PNGs
watch(
  () => props.items,
  (newItems) => {
    if (newItems && newItems.length > 0) {
      generatePNGs();
    }
  },
  { deep: true },
);
</script>
