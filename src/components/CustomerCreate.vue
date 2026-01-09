<script setup>
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { PlusIcon, ListBulletIcon } from "@heroicons/vue/24/outline";
import { onMounted, onUnmounted, ref, defineEmits } from "vue";
import Button from "./Button.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

// import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useCustomerStore } from "../stores/customer";
import { useSidebarStore } from "../stores/sidebar";
import { Switch } from "@headlessui/vue";

const enabled = ref(false);

// const toast = useToast();
const router = useRouter();
const route = useRoute();
const customerStore = useCustomerStore();
const sidebar = useSidebarStore();

const formData = ref({
  name: "",
  photo: "",
  email: "",
  phone_number: "",
  dob: "",
  line_id: "",
  nrc_number: "",
  company_name: "",
  is_corporate_customer: "",
});

const errors = ref(null);

const featureImageInput = ref(null);
const featureImagePreview = ref(null);

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formData.value.cover_image = e.target.files[0];
    featureImagePreview.value = URL.createObjectURL(selectedFile);
  }
};

const removeFeatureSelectImage = () => {
  formData.value.feature_image = null;
  featureImagePreview.value = null;
};

const emit = defineEmits(["response"]);

const onSubmitHandler = async () => {
  console.log(enabled.value);
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("photo", formData.value.cover_image);
  frmData.append("email", formData.value.email);
  frmData.append("phone_number", formData.value.phone_number);
  frmData.append("dob", formData.value.dob);
  frmData.append("line_id", formData.value.line_id);
  frmData.append("nrc_number", formData.value.nrc_number);
  frmData.append("company_name", formData.value.company_name);

  if (enabled.value == true) {
    formData.value.is_corporate_customer = "1";
    frmData.append(
      "is_corporate_customer",
      formData.value.is_corporate_customer
    );
  } else {
    formData.value.is_corporate_customer = "0";
    frmData.append(
      "is_corporate_customer",
      formData.value.is_corporate_customer
    );
  }

  try {
    const response = await customerStore.addNewAction(frmData);
    formData.value = {
      name: "",
      photo: "",
      email: "",
      phone_number: "",
      dob: "",
      line_id: "",
      nrc_number: "",
      company_name: "",
      is_corporate_customer: "",
    };
    enabled.value = false;
    errors.value = null;
    toast.success(response.message);
    if (props.action == "sales") {
      sidebar.toggleCustomerCreate();
      emit("response", response);
      await customerStore.getSimpleListAction();
    } else {
      router.push("/customers");
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: NewBlogView.vue:38 ~ onSubmitHandler ~ error:",
      error
    );
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message);
  }
};

const props = defineProps(["action"]);

console.log(props.action);

onMounted(async () => {});
</script>

<template>
  <div>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="font-medium text-gray-600 px-6">Create Customer</h3>
      <div class="space-x-3"></div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div class="bg-white/60 col-span-2 p-6 rounded-lg">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-8">
            <div class="">
              <p class="text-gray-800 text-xs mb-2">Name</p>
              <input
                v-model="formData.name"
                type="text"
                id="title"
                class="w-full bg-white/50 text-xs border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.name" class="mt-1 text-xs text-red-600">
                {{ errors.name[0] }}
              </p>
            </div>
            <div class="">
              <p class="text-gray-800 text-xs mb-2">Email address</p>
              <input
                v-model="formData.email"
                type="email"
                id="title"
                class="w-full bg-white/50 text-xs border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.email" class="mt-1 text-xs text-red-600">
                {{ errors.email[0] }}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-8">
            <div class="">
              <p class="text-gray-800 text-xs mb-2">Phone Number</p>
              <input
                v-model="formData.phone_number"
                type="number"
                id="title"
                class="w-full bg-white/50 text-xs border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.phone_number" class="mt-1 text-xs text-red-600">
                {{ errors.phone_number[0] }}
              </p>
            </div>
            <div class="">
              <p class="text-gray-800 text-xs mb-2">DOB</p>
              <input
                v-model="formData.dob"
                type="date"
                id="title"
                class="w-full bg-white/50 text-xs border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.dob" class="mt-1 text-xs text-red-600">
                {{ errors.dob[0] }}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-8">
            <div class="">
              <p class="text-gray-800 text-xs mb-2">Line ID</p>
              <input
                v-model="formData.line_id"
                type="text"
                id="title"
                class="w-full bg-white/50 text-xs border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.line_id" class="mt-1 text-xs text-red-600">
                {{ errors.line_id[0] }}
              </p>
            </div>
            <div class="">
              <p class="text-gray-800 text-xs mb-2">Passport Number</p>
              <input
                v-model="formData.nrc_number"
                type="text"
                id="title"
                class="w-full bg-white/50 text-xs border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.nrc_number" class="mt-1 text-xs text-red-600">
                {{ errors.nrc_number[0] }}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-8">
            <div class="">
              <p class="text-gray-800 text-xs mb-2">Company Name</p>
              <input
                v-model="formData.company_name"
                type="text"
                id="title"
                class="w-full bg-white/50 text-xs border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.company_name" class="mt-1 text-xs text-red-600">
                {{ errors.company_name[0] }}
              </p>
            </div>
            <div class="">
              <p class="text-gray-800 text-xs">Is Corporate Customer</p>
              <div class="py-3">
                <Switch
                  v-model="enabled"
                  :class="enabled ? ' bg-blue-600' : 'bg-red-500'"
                  class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                  <span class="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    :class="enabled ? 'translate-x-9' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                  />
                </Switch>
              </div>
            </div>
          </div>

          <div class="text-start">
            <Button @click.prevent="onSubmitHandler" class="text-xs">
              Create
            </Button>
          </div>
        </div>
      </div>
      <div>
        <div class="bg-white/60 p-4 rounded-lg mb-5">
          <div class="flex items-center justify-between gap-3 mb-3">
            <p class="text-xs">Passport</p>
            <input
              type="file"
              ref="featureImageInput"
              class="hidden"
              @change="handlerFeatureFileChange"
              accept="image/*"
            />
            <button
              v-if="!featureImagePreview"
              @click.prevent="openFileFeaturePicker"
              class="text-xs text-[#ff613c]"
            ></button>
            <button
              v-else
              @click.prevent="removeFeatureSelectImage"
              class="rounded-full text-xs text-red-600 items-center justify-center flex"
            >
              <XCircleIcon class="w-8 h-8 font-semibold" />
            </button>
          </div>
          <div
            v-if="!featureImagePreview"
            @click.prevent="openFileFeaturePicker"
            class="cursor-pointer w-full h-[150px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center"
          >
            <span class="text-xs"
              ><i
                class="fa-solid fa-plus text-lg font-semibold py-3 px-5 bg-[#ff613c] rounded-full shadow text-white"
              ></i
            ></span>
          </div>
          <div v-if="featureImagePreview" class="">
            <img
              class="h-auto w-full rounded"
              :src="featureImagePreview"
              alt=""
            />
          </div>
          <p v-if="errors?.image" class="mt-1 text-xs text-red-600">
            {{ errors.image[0] }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.style-chooser .vs__dropdown-toggle {
  border: 1px solid #d1d5db;
  padding: 10px 5px;
  border-radius: 8px;
}

.style-chooser .vs__dropdown-menu .vs__dropdown-option--highlight {
  background: #2563eb;
}

.style-chooser .vs__dropdown-menu .vs__dropdown-option {
  padding: 10px 18px;
}

.style-chooser .vs__dropdown-toggle .vs__selected-options .vs__selected {
  padding: 4px 10px;
  border: none;
}
</style>
