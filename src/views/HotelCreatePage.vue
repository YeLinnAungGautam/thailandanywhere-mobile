<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import NavbarVue from "../components/Navbar.vue";
import { useHotelStore } from "../stores/hotel";
import { useCityStore } from "../stores/city";
import { storeToRefs } from "pinia";
import { useToastStore } from "../stores/toast";
import { XCircleIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const hotelStore = useHotelStore();
const cityStore = useCityStore();
const toastStore = useToastStore();

const { cities } = storeToRefs(cityStore);
const citylist = ref([]);
const errors = ref(null);

const formData = ref({
  id: "",
  name: "",
  city_id: null,
  payment_method: "",
  bank_name: "",
  bank_account_number: "",
  account_name: "",
  place: "",
  legal_name: "",
  contract_due: "",
  contracts: [],
  images: [],
});
const bankName = [
  { id: "1", name: "K + " },
  { id: "2", name: "SCB " },
  { id: "3", name: "Bangkok Bank" },
  { id: "4", name: "Other Bank " },
  { id: "5", name: "CIMB Bank " },
  { id: "6", name: "Krungsri " },
  { id: "7", name: "Krungthai Bank " },
  { id: "8", name: "Land and Houses Bank " },
  { id: "9", name: "Standard Chartered Bank (Thai) " },
  { id: "10", name: "TMBThanachart " },
  { id: "11", name: "UOB " },
  { id: "12", name: "Government Savings Bank " },
  { id: "13", name: "Kiatnakin Phatra Bank " },
  { id: "14", name: "Citibank" },
  { id: "15", name: "Government Housing Bank " },
  { id: "16", name: "Bank for Agriculture and Agricultural Cooperatives " },
  { id: "17", name: "MHCB " },
  { id: "18", name: "Islamic Bank of Thailand " },
  { id: "19", name: "ICBC Thai" },
  { id: "20", name: "Thai Credit " },
  { id: "21", name: "SMBC " },
  { id: "22", name: "HSBC " },
  { id: "23", name: "BNPP " },
  { id: "24", name: "DEUTSCHE BANK AG " },
  { id: "25", name: "Bank of China " },
  { id: "26", name: "Indian Overseas Bank " },
];
const paymentMethod = [
  { id: "1", name: "Bank Transfer" },
  { id: "2", name: "International Remittance" },
  { id: "3", name: "Cash" },
  { id: "4", name: "Other ..." },
];
const contract_file = (e) => {
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      // formData.value.contracts.push(selectedFile[index]);
      let file = selectedFile[index];
      formData.value.contracts.push(file);
    }
    console.log(formData.value.contracts, "this is contracts");
  }
};
const imagesInput = ref(null);
const imagesPreview = ref([]);

const openFileImagePicker = () => {
  imagesInput.value.click();
};

const handlerImagesFileChange = (e) => {
  console.log(e.target.files);
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      formData.value.images.push(selectedFile[index]);
      imagesPreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
};

const removeImageSelectImage = (index) => {
  formData.value.images.splice(index, 1);
  imagesPreview.value.splice(index, 1);
};

const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("city_id", formData.value.city_id);
  frmData.append("account_name", formData.value.account_name);
  frmData.append("place", formData.value.place);
  frmData.append("payment_method", formData.value.payment_method);
  frmData.append("bank_name", formData.value.bank_name);
  frmData.append("bank_account_number", formData.value.bank_account_number);
  frmData.append("legal_name", formData.value.legal_name);
  frmData.append("contract_due", formData.value.contract_due);
  // console.log(formData.value.contracts);
  if (formData.value.contracts) {
    // frmData.append("contracts", formData.value.contracts);
    for (let i = 0; i < formData.value.contracts.length; i++) {
      let file = formData.value.contracts[i];
      frmData.append("contracts[" + i + "]", file);
    }
  }
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }

  try {
    const response = await hotelStore.addNewAction(frmData);
    formData.value = {
      name: "",
      city_id: null,
      payment_method: "",
      bank_name: "",
      account_name: "",
      bank_account_number: "",
      place: "",
      legal_name: "",
      contract_due: "",
      contracts: [],
    };
    errors.value = null;
    toastStore.showToast({
      icon: "success",
      title: response.message,
    });
    router.push({ name: "hotels" });
  } catch (error) {
    // if (error.response.data.errors) {
    //   errors.value = error.response.data.errors;
    // }
    if (error.response) {
      toastStore.showToast({
        icon: "error",
        title: error.response.data.message,
      });
    }
    // setTimeout(async () => {
    //   await hotelStore.toggleLoading();
    // }, 5000);
  }
};

const goBack = () => {
  router.go(-1);
};

onMounted(async () => {
  await cityStore.getSimpleListAction();
});
</script>

<template>
  <div class="bg-white">
    <NavbarVue />
    <div class="py-5 px-4 space-y-4">
      <div class="relative">
        <div
          class="flex justify-start items-center gap-2 text-main absolute top-1"
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

        <p class="text-main text-2xl font-semibold w-full text-center">
          Hotel Create
        </p>
      </div>
      <div>
        <form
          @submit.prevent="addNewHandler"
          class="mt-4 px-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2"
        >
          <div class="space-y-2">
            <label for="name" class="text-sm text-gray-800">Name</label>
            <input
              type="text"
              v-model="formData.name"
              id="name"
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
              {{ errors.name[0] }}
            </p>
          </div>
          <div class="space-y-2">
            <p class="text-sm text-gray-800">Cities</p>
            <v-select
              v-model="formData.city_id"
              class="w-full h-10 text-sm border-main border rounded bg-white focus:outline-none focus:border-none"
              :options="cities?.data ?? []"
              label="name"
              :clearable="false"
              :reduce="(city) => city.id"
              placeholder="Choose City"
            ></v-select>
          </div>
          <div class="space-y-2">
            <label for="name" class="text-sm text-gray-800">Place</label>
            <input
              type="text"
              v-model="formData.place"
              id="name"
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
              {{ errors.place[0] }}
            </p>
          </div>
          <div class="space-y-2">
            <label for="name" class="text-sm text-gray-800">Legal Name</label>
            <input
              type="text"
              v-model="formData.legal_name"
              id="name"
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.legal_name" class="mt-1 text-sm text-red-600">
              {{ errors.legal_name[0] }}
            </p>
          </div>
          <div class="space-y-2">
            <p class="text-sm text-gray-800 space-y-2">Bank Name</p>
            <v-select
              v-model="formData.bank_name"
              class="w-full h-10 text-sm border-main border rounded bg-white focus:outline-none focus:border-none"
              :options="bankName ?? []"
              label="name"
              :clearable="false"
              :reduce="(bank) => bank.name"
              placeholder="Choose Bank"
            ></v-select>
          </div>
          <div class="space-y-2">
            <p class="text-sm text-gray-800 space-y-2">Payment Method</p>
            <v-select
              v-model="formData.payment_method"
              class="w-full h-10 text-sm border-main border rounded bg-white focus:outline-none focus:border-none"
              :options="paymentMethod ?? []"
              label="name"
              :clearable="false"
              :reduce="(payment) => payment.name"
              placeholder="Choose Payment"
            ></v-select>
          </div>
          <div class="space-y-2">
            <label for="name" class="text-sm text-gray-800"
              >Bank Account Number</label
            >
            <input
              v-model="formData.bank_account_number"
              type="text"
              class="w-full h-10 px-4 py-2 text-xs text-gray-900 bg-white border border-main rounded focus:outline-none focus:border-gray-300"
            />
          </div>
          <div class="space-y-2">
            <label for="name" class="text-sm text-gray-800">
              Account Name</label
            >
            <input
              v-model="formData.account_name"
              type="text"
              class="w-full h-10 px-4 py-2 text-xs text-gray-900 bg-white border border-main rounded focus:outline-none focus:border-gray-300"
            />
          </div>
          <div class="space-y-2">
            <label for="name" class="text-sm text-gray-800"
              >Contract Due Date</label
            >
            <input
              v-model="formData.contract_due"
              type="date"
              class="w-full h-10 px-4 py-2 text-xs text-gray-900 bg-white border border-main rounded focus:outline-none focus:border-gray-300"
            />
            <!-- <p>{{ formData.contract_due }}</p> -->
          </div>
          <div class="space-y-2">
            <label for="name" class="text-sm text-gray-800">Contracts</label>
            <input
              type="file"
              multiple
              @change="contract_file"
              id="name"
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.contracts" class="mt-1 text-sm text-red-600">
              {{ errors.contracts[0] }}
            </p>
          </div>
          <!-- <div class="mb-2 space-y-2" v-if="linkContract.length != 0">
            <p v-for="(a, index) in linkContract.contacts" :key="index">
              <a :href="a.file" target="_blink" class="text-sm text-red-500"
                >link</a
              >
            </p>
          </div> -->
          <!-- <div class="text-end flex justify-end items-center">
            <Button type="submit" v-if="!loading"> Submit </Button>
            <Button type="button" class="bg-main" v-if="loading">
              Submit
            </Button>
          </div> -->
          <div class="bg-white/60 text-sm rounded-lg shadow-sm mb-5">
            <div class="flex items-center justify-start gap-3 mb-3">
              <p>Images</p>

              <input
                multiple
                type="file"
                ref="imagesInput"
                class="hidden"
                @change="handlerImagesFileChange"
                accept="image/*"
              />
            </div>
            <div
              class="grid grid-cols-3 gap-2"
              v-if="imagesPreview.length == 0"
              @click.prevent="openFileImagePicker"
            >
              <div
                class="cursor-pointer w-full h-[130px] border-2 border-dashed border-main rounded flex justify-center items-center"
              >
                <span class="text-xs">Drops</span>
              </div>
              <div
                class="cursor-pointer w-full h-[130px] border-2 border-dashed border-main rounded flex justify-center items-center"
              >
                <span class="text-xs">Drops</span>
              </div>
              <div
                class="cursor-pointer w-full h-[130px] border-2 border-dashed border-main rounded flex justify-center items-center"
              >
                <span class="text-xs">Drops</span>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div
                class="relative"
                v-for="(image, index) in imagesPreview"
                :key="index"
              >
                <button
                  @click.prevent="removeImageSelectImage(index)"
                  class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                >
                  <XCircleIcon class="w-8 h-8 font-semibold text-red" />
                </button>
                <img class="h-auto w-full rounded" :src="image" alt="" />
              </div>
              <div
                v-if="imagesPreview.length != 0"
                @click.prevent="openFileImagePicker"
                class="cursor-pointer w-full h-[130px] border-2 border-dashed border-main rounded flex justify-center items-center mt-2"
              >
                <span class="text-xs">Drops</span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            class="text-end flex justify-end items-center col-span-1 sm:col-span-2 mt-6"
          >
            <div
              class="flex justify-end items-center space-x-4 px-4 py-2 rounded border-main bg-main text-white border"
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
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p class="">Create</p>
            </div>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
