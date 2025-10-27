<template>
  <div class="relative w-full h-screen">
    <!-- Toggle Filter Button -->
    <button
      @click="toggleSearchPanel"
      class="absolute top-5 right-5 z-[1001] bg-white hover:bg-red hover:text-white text-gray-800 font-semibold py-3 px-5 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
    >
      <svg
        v-if="!showSearchPanel"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      <span>{{ showSearchPanel ? "Hide" : "Filter" }}</span>
    </button>

    <!-- Search Panel -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="showSearchPanel"
        class="absolute bottom-5 left-5 right-5 max-w-3xl bg-white rounded-xl shadow-lg z-[1000] p-5"
      >
        <div class="flex flex-wrap gap-4 items-end">
          <!-- City Filter -->
          <div class="flex-1 min-w-[200px]">
            <label
              for="city-select"
              class="block mb-2 text-sm font-semibold text-gray-700"
            >
              City
            </label>
            <select
              id="city-select"
              v-model="selectedCity"
              @change="onCityChange"
              class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm bg-white cursor-pointer transition-all duration-200 hover:border-red-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
            >
              <option value="">All Cities</option>
              <option v-for="city in cities" :key="city.id" :value="city.id">
                {{ city.name }}
              </option>
            </select>
          </div>

          <!-- Place Filter -->
          <div class="flex-1 min-w-[200px]">
            <label
              for="place-select"
              class="block mb-2 text-sm font-semibold text-gray-700"
            >
              Place
            </label>
            <select
              id="place-select"
              v-model="selectedPlace"
              @change="onFilterChange"
              :disabled="!selectedCity"
              class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm bg-white cursor-pointer transition-all duration-200 hover:border-red-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">All Places</option>
              <option
                v-for="place in places"
                :key="place.id"
                :value="place.name"
              >
                {{ place.name }}
              </option>
            </select>
          </div>

          <!-- Reset Button -->
          <button
            v-if="selectedCity || selectedPlace"
            @click="resetFilters"
            class="px-6 py-2.5 bg-red hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg h-[42px]"
          >
            Reset
          </button>
        </div>

        <!-- Results Count -->
        <div
          v-if="filteredHotels.length > 0"
          class="mt-3 text-sm text-gray-600 font-medium"
        >
          Showing {{ filteredHotels.length }} hotel(s)
        </div>
      </div>
    </transition>

    <!-- Map -->
    <div id="map" ref="mapRef" class="w-full h-full"></div>

    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-white/80 flex items-center justify-center z-[2000]"
    >
      <div
        class="w-12 h-12 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useHotelStore } from "../stores/hotel";
import { useCityStore } from "../stores/city";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const hotelStore = useHotelStore();
const cityStore = useCityStore();

const mapRef = ref(null);
const loading = ref(false);
const allHotels = ref([]);
const cities = ref([]);
const places = ref([]);
const selectedCity = ref("");
const selectedPlace = ref("");
const showSearchPanel = ref(false);

let map = null;
let markers = [];

// Computed filtered hotels
const filteredHotels = computed(() => {
  let filtered = allHotels.value;

  if (selectedCity.value) {
    filtered = filtered.filter((hotel) => hotel.city_id == selectedCity.value);
  }

  if (selectedPlace.value) {
    filtered = filtered.filter((hotel) => hotel.place === selectedPlace.value);
  }

  return filtered;
});

const toggleSearchPanel = () => {
  showSearchPanel.value = !showSearchPanel.value;
};

const getMapList = async () => {
  try {
    loading.value = true;
    const res = await hotelStore.getMapListAction();
    console.log(res);

    if (res?.result) {
      allHotels.value = res.result;
      initializeMap();
    }
  } catch (error) {
    console.error("Error fetching hotels:", error);
  } finally {
    loading.value = false;
  }
};

const getCities = async () => {
  try {
    const res = await cityStore.getSimpleListAction();
    console.log(res, "this is city");
    if (res?.result) {
      cities.value = res.result.data;
    }
  } catch (error) {
    console.error("Error fetching cities:", error);
  }
};

const onCityChange = async () => {
  selectedPlace.value = ""; // Reset place when city changes

  if (selectedCity.value) {
    // Fetch places for selected city
    try {
      loading.value = true;
      const res = await cityStore.getPlaceListAction({
        city_id: selectedCity.value,
        limit: 1000,
      });

      if (res?.result) {
        places.value = res.result.data;
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      loading.value = false;
    }
  } else {
    places.value = [];
  }

  onFilterChange();
};

const onFilterChange = () => {
  // Update markers based on filtered hotels
  updateMapMarkers();
};

const resetFilters = () => {
  selectedCity.value = "";
  selectedPlace.value = "";
  places.value = [];
  updateMapMarkers();
};

const initializeMap = () => {
  // Initialize map centered on Thailand
  map = L.map("map").setView([13.7563, 100.5018], 6);

  // Add light-styled tile layer with English labels
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }
  ).addTo(map);

  // Add initial hotel markers
  updateMapMarkers();
};

const updateMapMarkers = () => {
  // Clear existing markers
  markers.forEach((marker) => marker.remove());
  markers = [];

  // Custom marker icon
  const hotelIcon = L.divIcon({
    className: "custom-hotel-marker",
    html: `<div class="marker-pin">
            <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 25 15 25s15-16.716 15-25c0-8.284-6.716-15-15-15z" fill="#FF6B6B"/>
              <circle cx="15" cy="15" r="8" fill="white"/>
            </svg>
          </div>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });

  filteredHotels.value.forEach((hotel) => {
    if (hotel.latitude && hotel.longitude) {
      const marker = L.marker(
        [parseFloat(hotel.latitude), parseFloat(hotel.longitude)],
        {
          icon: hotelIcon,
        }
      ).addTo(map);

      // Create popup content
      const popupContent = createPopupContent(hotel);
      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: "custom-popup",
      });

      markers.push(marker);
    }
  });

  // Fit map to show all markers
  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
  }
};

const createPopupContent = (hotel) => {
  const firstImage =
    hotel.images?.[0]?.image_url ||
    "https://via.placeholder.com/300x200?text=No+Image";
  const stars = "⭐".repeat(hotel.rating || 0);

  return `
    <div class="hotel-popup">
      <div class="hotel-image-wrapper">
        <img src="${firstImage}" alt="${hotel.name}" class="hotel-image" />
      </div>
      <div class="hotel-info">
        <h3 class="hotel-name">${hotel.name}</h3>
        <div class="hotel-rating">${stars}</div>
        <p class="hotel-location">📍 ${hotel.place || "Unknown"}</p>
      </div>
    </div>
  `;
};

onMounted(async () => {
  console.log("Map Page Loaded");
  await getCities();
  await getMapList();
});
</script>

<style scoped>
/* Custom marker styles */
:deep(.custom-hotel-marker) {
  background: none;
  border: none;
}

:deep(.marker-pin) {
  cursor: pointer;
  transition: transform 0.2s;
}

:deep(.marker-pin:hover) {
  transform: scale(1.1);
}

/* Custom popup styles */
:deep(.custom-popup .leaflet-popup-content-wrapper) {
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.custom-popup .leaflet-popup-content) {
  margin: 0;
  width: 280px !important;
}

:deep(.hotel-popup) {
  width: 100%;
}

:deep(.hotel-image-wrapper) {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f0f0f0;
}

:deep(.hotel-image) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.hotel-info) {
  padding: 12px 16px;
  background: white;
}

:deep(.hotel-name) {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

:deep(.hotel-rating) {
  margin-bottom: 6px;
  font-size: 14px;
}

:deep(.hotel-location) {
  margin: 0;
  font-size: 13px;
  color: #666;
}

:deep(.leaflet-popup-tip) {
  background: white;
}
</style>
