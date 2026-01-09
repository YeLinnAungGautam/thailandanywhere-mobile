<template>
  <div class="grid grid-cols-3 gap-4">
    <div>
      <div class="space-y-2 p-4 rounded-xl shadow-md">
        <div class="space-y-1">
          <label for="name" class="text-xs text-gray-800">Name *</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            placeholder="Name required"
            class="w-full h-10 text-xs px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
          />
        </div>
        <div class="space-y-1">
          <label for="" class="text-xs text-gray-800">Price *</label>
          <input
            type="number"
            v-model="formData.price"
            placeholder="(100) number only required"
            id="price"
            class="w-full h-10 text-xs px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
          />
        </div>
        <div class="space-y-1">
          <label for="name" class="text-xs text-gray-800">Cost Price *</label>
          <input
            type="number"
            v-model="formData.cost_price"
            id="cost"
            placeholder="(80) number only required"
            class="w-full h-10 text-xs px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
          />
        </div>
        <div class="space-y-1">
          <label for="name" class="text-xs text-gray-800">Description *</label>
          <textarea
            v-model="formData.description"
            class="w-full text-xs px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
          ></textarea>
        </div>
        <div class="flex justify-start items-center space-x-2">
          <button
            @click.prevent="
              formData.id ? updateAction(formData.id) : addAction()
            "
            class="w-[80px] py-2 text-xs font-medium text-white bg-[#FF613c] rounded-md shadow-sm hover:bg-[#FF613c] focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
          >
            {{ formData.id ? "Update" : "Add" }}
          </button>
          <button
            @click.prevent="clearAction"
            class="w-[80px] py-2 text-xs font-medium text-white bg-yellow-500 rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    <div class="col-span-2">
      <div
        class="space-y-2 p-4 rounded-xl shadow-md max-h-[70vh] overflow-scroll"
      >
        <div>
          <input
            type="search"
            name=""
            v-model="search"
            placeholder="Search"
            class="w-full h-10 text-xs px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            id=""
          />
        </div>
        <div class="overflow-auto rounded-lg shadow mb-5" v-if="!loading">
          <table class="w-full">
            <thead class="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th class="p-4 text-xs font-medium tracking-wide text-left">
                  No.
                </th>
                <th class="p-4 text-xs font-medium tracking-wide text-left">
                  Name
                </th>
                <th class="p-4 text-xs font-medium tracking-wide text-left">
                  Price
                </th>
                <th class="p-4 text-xs font-medium tracking-wide text-left">
                  Cost Price
                </th>
                <th class="p-4 text-xs font-medium tracking-wide text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="a in addons?.data || []"
                :key="a.id"
                class="bg-white even:bg-gray-50 hover:bg-gray-50"
              >
                <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                  {{ a.id }}
                </td>
                <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                  {{ a.name }}
                </td>
                <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                  {{ a.price }}
                </td>
                <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                  {{ a.cost_price }}
                </td>
                <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button
                      @click.prevent="updateHandler(a)"
                      class="hover:bg-yellow-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                    <button
                      @click.prevent="deleteAction(a.id)"
                      class="hover:bg-red-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                    >
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pt-4 px-3">
            <Pagination
              v-if="!loading"
              :data="addons"
              @change-page="changePage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch } from "vue";
import { useAddonStore } from "../../stores/addon";
import { storeToRefs } from "pinia";
// import { useToast } from "vue-toastification";
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
import Pagination from "../../components/Pagination.vue";
import debounce from "lodash/debounce";

const addonStore = useAddonStore();
// const toast = useToast();
const { addons, loading } = storeToRefs(addonStore);

const props = defineProps({
  id: Number,
  type: String,
});

const search = ref("");

const formData = ref({
  id: "",
  name: "",
  price: "",
  cost_price: "",
  description: "",
});

const clearAction = () => {
  formData.value = {
    id: "",
    name: "",
    price: "",
    cost_price: "",
    description: "",
  };
};

const changePage = async (url) => {
  const data = {
    product_id: props.id,
    product_type: props.type,
  };
  if (search.value) {
    data.search = search.value;
  }
  await addonStore.getChangePage(url, data);
};

const getList = async () => {
  const data = {
    product_id: props.id,
    product_type: props.type,
  };
  if (search.value) {
    data.search = search.value;
  }
  await addonStore.getListAction(data);
  console.log(addons.value, "this is list");
};

const deleteAction = async (id) => {
  const res = await addonStore.deleteAction(id);
  console.log(res);

  if (res.message == "success") {
    toast.success("Action deleted successfully");
    await getList();
  } else {
    console.error("Failed to delete action", res.message);
  }
};

const updateHandler = (data) => {
  formData.value = {
    id: data.id,
    name: data.name,
    price: data.price,
    cost_price: data.cost_price,
    description: data.description,
  };
};

const updateAction = async (id) => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("price", formData.value.price);
  frmData.append("cost_price", formData.value.cost_price);
  frmData.append("description", formData.value.description);
  frmData.append("product_id", props.id);
  frmData.append("_method", "PUT");
  frmData.append("product_type", props.type);
  const res = await addonStore.updateAction(frmData, id);
  console.log(res);

  if (res.message == "success") {
    toast.success("Action updated successfully");

    await getList();
  } else {
    console.error("Failed to update action", res.message);
  }

  clearAction();
};

const addAction = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("price", formData.value.price);
  frmData.append("cost_price", formData.value.cost_price);
  frmData.append("description", formData.value.description);
  frmData.append("product_id", props.id);
  frmData.append("product_type", props.type);

  const res = await addonStore.addNewAction(frmData);
  console.log(res);

  if (res.message == "success") {
    // console.log("Action added successfully");
    toast.success("Action added successfully");
    await getList();
  } else {
    console.error("Failed to add action", res.message);
  }

  clearAction();
  await getList();
};

onMounted(async () => {
  await getList();
});

watch(
  search,
  debounce(async (newValue) => {
    await getList();
  }, 500)
);
</script>
