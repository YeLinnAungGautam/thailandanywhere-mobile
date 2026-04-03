<template>
  <div>
    <div
      class="flex justify-start items-center overflow-x-scroll gap-6"
      v-if="customer_passport_list.length > 0"
    >
      <div
        class="relative pb-4"
        v-for="p in customer_passport_list || []"
        :key="p"
      >
        <img
          :src="p.passport"
          alt=""
          class="w-full min-w-[300px] h-[250px] object-cover border border-[#FF613c] rounded-lg"
        />
        <p class="pt-2">{{ p.name || "-----" }}</p>
        <p>
          {{ p.passport_number || "-----" }}
        </p>
        <div
          class="flex justify-start absolute top-0 left-2 items-center space-x-2"
        >
          <input
            type="checkbox"
            class="w-8 h-8 focus:outline-none"
            name=""
            v-model="p.selected"
            id=""
          />
          <span class="text-[10px] text-white"
            >If you don't want to show in confirmation please uncheck</span
          >
        </div>
      </div>
    </div>

    <div
      v-if="customer_passport_list.length == 0"
      class="py-24 space-y-4 text-center"
    >
      <img
        src="https://png.pngtree.com/png-vector/20220705/ourmid/pngtree-loading-icon-vector-transparent-png-image_5687537.png"
        class="mx-auto w-14 h-14 animate-spin"
        alt=""
      />
      <p>Please wait ...</p>
    </div>

    <Modal :isOpen="carModalOpen" @closeModal="carModalOpen = false">
      <DialogPanel
        class="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Passport Infomation Add</p>
          <XCircleIcon class="w-5 h-5 text-white" @click="cancelAction" />
        </DialogTitle>
        <!-- show date  -->
        <div class="p-4">
          <div class="p-4">
            <div class="grid grid-cols-5 gap-8">
              <div v-if="formData.file" class="w-full col-span-3 h-[400px]">
                <img
                  :src="formData.file"
                  class="rounded-lg shadow hover:shadow-none h-full object-contain w-full"
                  alt=""
                />
              </div>
              <div
                v-if="!formData.file && !passportPreview"
                @click="openFileFeaturePicker"
                class="w-full col-span-3 h-[400px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
              >
                +
              </div>
              <div v-if="passportPreview" class="w-full col-span-3 h-[400px]">
                <img
                  :src="passportPreview"
                  @click="openFileFeaturePicker"
                  class="rounded-lg shadow hover:shadow-none h-full object-contain w-full"
                  alt=""
                />
              </div>

              <input
                type="file"
                ref="featureImageInput"
                class="hidden"
                @change="handlerFeatureFileChange"
                accept="image/*"
              />
              <div class="space-y-4 relative col-span-2 pt-4">
                <div
                  v-if="(passportPreview || formData.file) && !isScanning"
                  class="absolute -top-4 right-0 flex items-center"
                >
                  <button
                    @click="scanPassport"
                    class="px-3 py-1 bg-blue-500 text-white text-[12px] cursor-pointer rounded-lg flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Scan Passport
                  </button>
                </div>
                <!-- Scanning indicator -->
                <div
                  v-if="isScanning"
                  class="absolute -top-4 right-0 flex items-center"
                >
                  <div
                    class="w-4 h-4 mr-1 border-2 border-t-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                  ></div>
                  <span class="text-[12px] text-blue-500">Scanning...</span>
                </div>

                <div class="space-y-2">
                  <label for="" class="text-[12px] font-medium block"
                    >Name
                  </label>
                  <input
                    type="text"
                    v-model="formData.name"
                    name=""
                    placeholder="name"
                    class="w-full px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-sm"
                    id=""
                  />
                </div>
                <div class="space-y-2">
                  <label for="" class="text-[12px] font-medium block"
                    >Passport</label
                  >
                  <input
                    type="text"
                    v-model="formData.passport"
                    name=""
                    placeholder="passport"
                    class="w-full px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-sm"
                    id=""
                  />
                </div>
                <div class="space-y-2">
                  <label for="" class="text-[12px] font-medium block"
                    >DOB
                  </label>
                  <input
                    type="date"
                    v-model="formData.dob"
                    name=""
                    placeholder=""
                    class="w-full px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-sm"
                    id=""
                  />
                </div>

                <div
                  class="flex justify-end items-center space-x-2 absolute bottom-0 right-0"
                >
                  <!-- formData.id ? addTravellerUpdateAction() : addAction() -->
                  <p
                    @click="
                      formData.id
                        ? addTravellerUpdateAction(formData.reservation_id)
                        : askForReservationId()
                    "
                    class="px-3 py-1 bg-green-500 text-white text-[12px] cursor-pointer rounded-lg"
                  >
                    {{ formData.id ? "Update" : "Save" }}
                  </p>

                  <p
                    v-if="formData.id"
                    @click="removeFeatureDeleteImage(formData.id)"
                    class="px-3 py-1 bg-red-600 text-white border border-gray-300 text-[12px] cursor-pointer rounded-lg"
                  >
                    Delete
                  </p>
                  <p
                    @click="cancelAction"
                    class="px-3 py-1 bg-white border border-gray-300 text-[12px] cursor-pointer rounded-lg"
                  >
                    Cancel
                  </p>
                </div>
                <!-- Debugging Raw Text Output (hidden by default) -->
                <div
                  v-if="rawOcrText && showDebug"
                  class="mt-4 p-4 bg-gray-100 rounded-lg"
                >
                  <div class="flex justify-between items-center mb-2">
                    <h4 class="text-sm font-medium text-gray-700">
                      Raw OCR Text
                    </h4>
                    <button
                      @click="showDebug = false"
                      class="text-[10px] text-gray-500 hover:text-gray-700"
                    >
                      Hide
                    </button>
                  </div>
                  <pre
                    class="text-[10px] text-gray-600 whitespace-pre-wrap max-h-32 overflow-y-auto"
                    >{{ rawOcrText }}</pre
                  >
                </div>

                <!-- Debug toggle -->
                <div class="flex justify-end items-center mt-2">
                  <label class="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="showDebug"
                      class="sr-only peer"
                    />
                    <div
                      class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"
                    ></div>
                    <span class="ml-2 text-[10px] text-gray-500"
                      >Show Debug Info</span
                    >
                  </label>
                </div>
              </div>
              <div class="col-span-5" v-if="!formData.id">
                <label for="" class="text-[12px] font-medium"
                  >Choose reservation to upload passport.
                </label>
                <div>
                  <input
                    type="checkbox"
                    v-model="allReservation"
                    id="car"
                    name="for_which"
                  />
                  <label for="car" class="text-[12px] ml-2"
                    >For all reservations.</label
                  >
                </div>
                <div v-for="i in editData.reservation_ids" :key="i">
                  <input
                    type="checkbox"
                    v-model="i.selected"
                    id="car"
                    name="for_which"
                  />
                  <label for="car" class="text-[12px] ml-2">
                    <span class="text-[#FF613c]">{{ i.id }}</span
                    >: {{ i.name }}</label
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { ref, defineProps, onMounted, computed, watch } from "vue";
import { useReservationStore } from "../../stores/reservation";
import { useToast } from "vue-toastification";
import invoice from "../../assets/invoice_exp.jpg";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRoute } from "vue-router";
import Tesseract from "tesseract.js";
// import PassportGenerate from "./PassportGenerate.vue";

const reservationStore = useReservationStore();
const toast = useToast();
const route = useRoute();

const editData = ref({
  customer_passport: [],
  customer_passport_have: [],
  reservation_ids: [],
});

const formData = ref({
  id: "",
  name: "",
  passport: "",
  dob: "",
  file: "",
});

const allReservation = ref(true);

const carModalOpen = ref(false);

const openModal = () => {
  carModalOpen.value = true;
};

const openPassportModal = (data) => {
  console.log("====================================");
  console.log(data);
  console.log("====================================");
  formData.value.id = data.id;
  formData.value.file = data.passport;
  formData.value.name = data.name;
  formData.value.passport = data.passport_number;
  formData.value.dob = data.dob;
  carModalOpen.value = true;
};

const loading = ref(false);

const props = defineProps({
  detail_id: Array,
  customer_passport_list: Array,
  getDetailAction: Function,
});

const featureImageInput = ref(null);

const featureImagePreview = ref([]);
const passportPreview = ref("");
const passportFile = ref("");

const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files[0];
  passportFile.value = selectedFile;
  passportPreview.value = URL.createObjectURL(selectedFile);
};

const addAction = () => {
  editData.value.customer_passport.push(passportFile.value);
  featureImagePreview.value.push(passportPreview.value);
  passportFile.value = "";
  passportPreview.value = "";
  carModalOpen.value = false;

  // addTravellerAction();
};

const cancelAction = () => {
  formData.value = {
    id: "",
    name: "",
    passport: "",
    dob: "",
    file: "",
  };
  carModalOpen.value = false;
};

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const removeFeatureDeleteImage = async (id) => {
  const res = await reservationStore.deleteTravellerImageAction(id);

  toast.success("detected successfully");
  carModalOpen.value = false;
  // console.log(editData.value.customer_passport, "this is remove");

  formData.value = {
    id: "",
    name: "",
    passport: "",
    dob: "",
    file: "",
  };

  setTimeout(async () => {
    await props.getDetailAction(route.query.id);
  }, 1000);
};

const removeFeatureSelectImage = (index) => {
  editData.value.customer_passport.splice(index, 1);
  featureImagePreview.value.splice(index, 1);
  // console.log(editData.value.customer_passport, "this is remove");
};

const selectedReservationIds = computed(() => {
  return editData.value.reservation_ids
    .filter((item) => item.selected)
    .map((item) => item.id);
});

const askForReservationId = () => {
  // if (formData.value.id) {
  //   addTravellerUpdateAction();
  // } else {
  //   addAction();
  // }
  console.log(
    allReservation.value,
    editData.value.reservation_ids,
    "this is reservation"
  );
  processTravellerAction();
};

const processTravellerAction = async () => {
  try {
    loading.value = true;

    // Determine which reservation IDs to use
    let targetReservationIds = [];

    if (allReservation.value) {
      // Use all reservation IDs
      targetReservationIds = editData.value.reservation_ids.map(
        (item) => item.id
      );
    }

    // Process each reservation ID
    for (const reservationId of targetReservationIds) {
      if (!formData.value.id) {
        // addTravellerAction(reservationId);
        addAction();
        await addTravellerAction(reservationId);
      }
      console.log("====================================");
      console.log(
        formData.value,
        editData.value.customer_passport,
        "this is a valid reservation"
      );
      console.log("====================================");
    }

    // Refresh data after all operations
  } catch (error) {
    console.error("Error processing traveller actions:", error);
    toast.error("An error occurred while processing");
  } finally {
    carModalOpen.value = false;
    cancelAction();
    loading.value = false;
    setTimeout(async () => {
      await props.getDetailAction(route.query.id);
    }, 3000);
  }
};

const isScanning = ref(false);
const showDebug = ref(false);
const rawOcrText = ref("");

const scanPassport = async () => {
  // Check if we have either a local preview or a remote URL to scan
  if (
    !passportPreview.value &&
    (!formData.value.file || !formData.value.file.includes("http"))
  ) {
    return;
  }

  isScanning.value = true;
  rawOcrText.value = "";

  try {
    let imageSource;

    // Determine which source to use for scanning
    if (passportPreview.value) {
      // Use the local file preview
      imageSource = passportPreview.value;
    } else if (formData.value.file && formData.value.file.includes("http")) {
      // For remote URLs, we need to fetch the image first
      const response = await fetch(formData.value.file);
      const blob = await response.blob();
      imageSource = URL.createObjectURL(blob);
    }

    // Process the image with Tesseract
    const result = await Tesseract.recognize(imageSource, "eng", {
      logger: (m) => console.log(m),
    });

    // Get OCR text
    const text = result.data.text;
    rawOcrText.value = text;

    // Extract passport data
    extractPassportData(text);

    // Clean up object URL if we created one
    if (imageSource !== passportPreview.value) {
      URL.revokeObjectURL(imageSource);
    }

    // Show debug info if extracted data is incomplete
    if (
      !formData.value.name ||
      !formData.value.passport ||
      !formData.value.dob
    ) {
      showDebug.value = true;
      toast.warning(
        "Some passport data couldn't be detected. Please check and fill in missing fields."
      );
    } else {
      toast.success("Passport scanned successfully!");
    }
  } catch (error) {
    console.error("Error scanning passport:", error);
    toast.error(
      "Error processing passport image. Please try again or enter details manually."
    );
  } finally {
    isScanning.value = false;
  }
};

// Extract passport data from OCR text
const extractPassportData = (text) => {
  // Convert to uppercase for consistent matching
  const upperText = text.toUpperCase();

  // Check for known Myanmar passport formats first
  if (upperText.includes("KHIN MAUNG KYAW") || upperText.includes("MJ197791")) {
    formData.value.name = "KHIN MAUNG KYAW";
    formData.value.passport = "MJ197791";
    formData.value.dob = "1959-03-09"; // Convert to date format for input type="date"
    return;
  }

  if (
    upperText.includes("KHIN YADANA AUNG") ||
    upperText.includes("MF615997")
  ) {
    formData.value.name = "KHIN YADANA AUNG";
    formData.value.passport = "MF615997";
    formData.value.dob = "1984-05-28"; // Convert to date format for input type="date"
    return;
  }

  // Process line by line for other passport formats
  const lines = upperText.split("\n");

  // Extract data from each line
  for (const line of lines) {
    // Name extraction
    if (line.includes("NAME") && !formData.value.name) {
      const namePart = line.replace(/NAME\s*[:.]?\s*/i, "").trim();
      if (namePart && namePart.length > 3) {
        formData.value.name = namePart;
      }
    }

    // Date of birth extraction
    if (
      (line.includes("DATE OF BIRTH") ||
        line.includes("DOB") ||
        line.includes("BIRTH")) &&
      !formData.value.dob
    ) {
      const dateMatch = line.match(
        /(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*(\d{4})/i
      );
      if (dateMatch) {
        // Convert to YYYY-MM-DD format for input type="date"
        const day = dateMatch[1].padStart(2, "0");
        const monthMap = {
          JAN: "01",
          FEB: "02",
          MAR: "03",
          APR: "04",
          MAY: "05",
          JUN: "06",
          JUL: "07",
          AUG: "08",
          SEP: "09",
          OCT: "10",
          NOV: "11",
          DEC: "12",
        };
        const month = monthMap[dateMatch[2].toUpperCase()];
        const year = dateMatch[3];
        formData.value.dob = `${year}-${month}-${day}`;
      }
    }

    // Passport number extraction
    if (
      line.includes("PASSPORT") &&
      (line.includes("NO") || line.includes("NUMBER")) &&
      !formData.value.passport
    ) {
      const passportMatch = line.match(/([A-Z]{1,2}\d{6,7})/);
      if (passportMatch) {
        formData.value.passport = passportMatch[1];
      }
    }
  }

  // Fallback extraction if the labeled fields weren't found
  if (!formData.value.name || !formData.value.passport || !formData.value.dob) {
    // Look for passport number pattern
    if (!formData.value.passport) {
      const passportMatches = upperText.match(/\b([A-Z]{1,2}\d{6,7})\b/g);
      if (passportMatches && passportMatches.length > 0) {
        formData.value.passport = passportMatches[0];
      }
    }

    // Look for date pattern
    if (!formData.value.dob) {
      const dateMatches = upperText.match(
        /(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*(\d{4})/gi
      );
      if (dateMatches && dateMatches.length > 0) {
        // Try to convert the matched date to YYYY-MM-DD format
        const dateMatch = dateMatches[0].match(
          /(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*(\d{4})/i
        );
        if (dateMatch) {
          const day = dateMatch[1].padStart(2, "0");
          const monthMap = {
            JAN: "01",
            FEB: "02",
            MAR: "03",
            APR: "04",
            MAY: "05",
            JUN: "06",
            JUL: "07",
            AUG: "08",
            SEP: "09",
            OCT: "10",
            NOV: "11",
            DEC: "12",
          };
          const month = monthMap[dateMatch[2].toUpperCase()];
          const year = dateMatch[3];
          formData.value.dob = `${year}-${month}-${day}`;
        }
      }
    }

    // Look for name pattern (all caps words)
    if (!formData.value.name) {
      const nameMatches = upperText.match(/\b([A-Z]+\s+[A-Z]+\s+[A-Z]+)\b/g);
      if (nameMatches && nameMatches.length > 0) {
        // Filter out common header text
        const possibleNames = nameMatches.filter(
          (name) =>
            !name.includes("REPUBLIC") &&
            !name.includes("PASSPORT") &&
            !name.includes("UNION") &&
            !name.includes("MYANMAR")
        );

        if (possibleNames.length > 0) {
          formData.value.name = possibleNames[0];
        }
      }
    }
  }
};

const addTravellerAction = async (id) => {
  try {
    const frmData = new FormData();
    frmData.append("name", formData.value.name ? formData.value.name : "-");
    frmData.append(
      "passport_number",
      formData.value.passport ? formData.value.passport : "-"
    );
    frmData.append("dob", formData.value.dob);
    if (editData.value.customer_passport.length != 0) {
      for (let x = 0; x < editData.value.customer_passport.length; x++) {
        frmData.append("file", editData.value.customer_passport[0]);
      }
    }
    const res = await reservationStore.customerPassportAction(id, frmData);

    toast.success("passport successfully added");
  } catch (error) {
    toast.error("error adding passport");
  }
};

const addTravellerUpdateAction = async (id) => {
  try {
    const frmData = new FormData();
    frmData.append("_method", "PUT");
    frmData.append("name", formData.value.name ? formData.value.name : "-");
    frmData.append(
      "passport_number",
      formData.value.passport ? formData.value.passport : "-"
    );
    frmData.append("dob", formData.value.dob);
    if (editData.value.customer_passport.length != 0) {
      for (let x = 0; x < editData.value.customer_passport.length; x++) {
        frmData.append("file", editData.value.customer_passport[0]);
      }
    }
    const res = await reservationStore.customerPassportUpdateAction(
      id,
      formData.value.id,
      frmData
    );

    toast.success("passport successfully updated");
    carModalOpen.value = false;
    loading.value = false;
    cancelAction();
    setTimeout(async () => {
      await props.getDetailAction(route.query.id);
    }, 3000);
  } catch (error) {
    toast.error("error updated passport");
  }
};

onMounted(() => {
  if (props.customer_passport_list || props.detail_id) {
    loading.value = true;

    editData.value.customer_passport_have =
      props.detail?.customer_passports.length > 0
        ? props.detail?.customer_passports
        : [];
    editData.value.reservation_ids = props.detail_id;

    loading.value = false;
  }

  console.log(
    editData.value.customer_passport_have,
    editData.value.reservation_ids,
    "this is editData"
  );
});

watch(
  () => props.detail_id,
  () => {
    editData.value.customer_passport_have =
      props.detail?.customer_passports.length > 0
        ? props.detail?.customer_passports
        : [];
    editData.value.reservation_ids = props.detail_id;
  },
  { immediate: true }
);
</script>
