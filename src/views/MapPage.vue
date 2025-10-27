<template>
  <div class="relative w-full h-screen max-h-screen">
    <!-- Centered Search Bar (Airbnb Style) -->
    <div
      class="absolute top-5 left-1/2 transform w-[95%] -translate-x-1/2 z-[1001]"
    >
      <button
        class="bg-white rounded-full w-full shadow-lg pl-5 pr-5 py-3 flex items-center justify-between gap-3 hover:shadow-xl transition-all duration-300"
      >
        <div class="flex justify-start items-center gap-x-2">
          <div @click="router.back()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </div>
          <div class="text-left pl-4" @click="toggleSearchPanel">
            <h3 class="text-sm font-semibold text-gray-900">
              Hotels in map area
            </h3>
            <p class="text-[10px] text-gray-500">
              {{ selectedCity ? getCityName(selectedCity) : "All cities" }}
              {{ selectedPlace ? ` · ${selectedPlace}` : "" }}
            </p>
          </div>
        </div>
        <div
          @click="toggleSearchPanel"
          class="w-8 h-8 bg-[#FF613c] rounded-full flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
      </button>
    </div>

    <!-- Hotel List Toggle Button -->
    <button
      @click="toggleHotelList"
      :class="showHotelList ? 'bottom-[200px] rotate-[180deg]' : 'bottom-5'"
      class="absolute right-3 z-[1001] w-12 h-12 bg-white border border-black/10 hover:bg-gray-50 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
    >
      <svg
        enable-background="new 0 0 32 32"
        height="20px"
        id="Layer_1"
        version="1.1"
        viewBox="0 0 32 32"
        width="32px"
        xml:space="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path
          d="M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0  l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z"
          fill="#515151"
        />
      </svg>
    </button>

    <!-- Search Modal -->
    <transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showSearchPanel"
        class="fixed inset-0 bg-black/50 z-[1500] flex items-start justify-center pt-20"
        @click.self="toggleSearchPanel"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
          @click.stop
        >
          <!-- Modal Header -->
          <div
            class="flex items-center justify-between px-5 py-2 border-b border-black/10"
          >
            <h2 class="text-sm font-semibold text-gray-900">Search Hotels</h2>
            <button
              @click="toggleSearchPanel"
              class="w-8 h-8 rounded-full hover:bg-gray flex items-center justify-center"
            >
              <svg
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
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-5">
            <div class="grid grid-cols-2 gap-4">
              <!-- City Selection -->
              <div>
                <h3 class="text-xs font-semibold text-[#FF613c] mb-3">
                  Choose City
                </h3>
                <div
                  class="space-y-1 h-[250px] overflow-y-auto pr-2 custom-scrollbar"
                >
                  <div
                    v-for="city in cities"
                    :key="city.id"
                    class="flex justify-between items-center px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                    :class="
                      city.id == selectedCity
                        ? 'bg-red/5 border border-red/20'
                        : ''
                    "
                    @click="onCityChangeModal(city.id)"
                  >
                    <p
                      class="text-[10px] line-clamp-1"
                      :class="
                        city.id == selectedCity
                          ? 'text-red font-medium'
                          : 'text-gray-700'
                      "
                    >
                      {{ city.name }}
                    </p>
                    <input
                      type="checkbox"
                      :checked="city.id == selectedCity"
                      class="w-4 h-4 text-red border-gray-300 rounded focus:ring-red-500"
                      readonly
                    />
                  </div>
                </div>
              </div>

              <!-- Place Selection -->
              <div>
                <h3 class="text-xs font-semibold text-[#FF613c] mb-3">
                  Choose Place
                </h3>
                <div
                  v-if="!loadingPlaces"
                  class="space-y-1 h-[250px] overflow-y-auto pr-2 custom-scrollbar"
                >
                  <div
                    class="flex justify-between items-center px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                    :class="
                      selectedPlace == '' ? 'bg-red/5 border border-red/20' : ''
                    "
                    @click="selectedPlace = ''"
                  >
                    <p
                      class="text-[10px] line-clamp-1"
                      :class="
                        selectedPlace == ''
                          ? 'text-red font-medium'
                          : 'text-gray-700'
                      "
                    >
                      All places
                    </p>
                    <input
                      type="checkbox"
                      :checked="selectedPlace == ''"
                      class="w-4 h-4 text-red border-gray-300 rounded focus:ring-red-500"
                      readonly
                    />
                  </div>
                  <div
                    v-for="place in places"
                    :key="place.id"
                    class="flex justify-between items-center px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                    :class="
                      place.name == selectedPlace
                        ? 'bg-red/5 border border-red/20'
                        : ''
                    "
                    @click="selectedPlace = place.name"
                  >
                    <p
                      class="text-[10px] line-clamp-1"
                      :class="
                        place.name == selectedPlace
                          ? 'text-red font-medium'
                          : 'text-gray-700'
                      "
                    >
                      {{ place.name }}
                    </p>
                    <input
                      type="checkbox"
                      :checked="place.name == selectedPlace"
                      class="w-4 h-4 text-red border-gray-300 rounded focus:ring-red-500"
                      readonly
                    />
                  </div>
                </div>

                <!-- Loading State for Places -->
                <div v-else class="h-[250px] flex items-center justify-center">
                  <div class="flex gap-1">
                    <div
                      class="w-2 h-2 rounded-full bg-red animate-bounce"
                    ></div>
                    <div
                      class="w-2 h-2 rounded-full bg-red animate-bounce [animation-delay:-.3s]"
                    ></div>
                    <div
                      class="w-2 h-2 rounded-full bg-red animate-bounce [animation-delay:-.5s]"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Results Count -->
            <div
              v-if="filteredHotels.length > 0"
              class="mt-4 text-[10px] text-gray-600"
            >
              Showing {{ filteredHotels.length }} hotel(s)
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-5 border-t border-black/10 flex gap-3">
            <button
              v-if="selectedCity || selectedPlace"
              @click="resetFilters"
              class="px-6 py-2 text-xs font-semibold text-gray-700 bg-white border border-black/10 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Reset
            </button>
            <button
              @click="applyFilters"
              class="flex-1 px-6 py-2 text-xs font-semibold text-white bg-[#FF613c] rounded-xl hover:bg-red-600 transition-colors shadow-lg"
            >
              Search Hotels
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Map -->
    <div id="map" ref="mapRef" class="w-full h-full"></div>

    <!-- Scrollable Hotel Cards at Bottom -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-8"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-8"
    >
      <div
        v-if="showHotelList"
        class="absolute bottom-5 left-5 right-5 z-[999] pointer-events-none"
      >
        <div
          ref="hotelListContainer"
          class="flex gap-3 overflow-x-auto pb-2 pointer-events-auto scrollbar-hide scroll-smooth"
        >
          <div
            v-for="hotel in filteredHotels"
            :key="hotel.id"
            :ref="(el) => setHotelCardRef(el, hotel.id)"
            :data-hotel-id="hotel.id"
            :class="[
              'flex-shrink-0 w-80 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden',
              selectedHotelId === hotel.id ? 'ring-8 ring-[#FF613c]/10' : '',
            ]"
          >
            <div class="flex">
              <!-- Hotel Image - Left Side -->
              <div class="relative w-32 h-40 flex-shrink-0">
                <img
                  :src="
                    hotel.images?.[0]?.image ||
                    'https://via.placeholder.com/300x300?text=No+Image'
                  "
                  :alt="hotel.name"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Hotel Info - Right Side -->
              <div class="flex-1 p-3 flex flex-col justify-between">
                <!-- Top Section -->
                <div>
                  <h3
                    class="font-semibold text-xs text-gray-900 mb-1 line-clamp-1"
                  >
                    {{ hotel.name }}
                  </h3>

                  <!-- Star Rating -->
                  <div class="flex items-center gap-1 mb-1">
                    <span class="text-yellow-400 text-sm">{{
                      "★".repeat(hotel.rating || 0)
                    }}</span>
                  </div>

                  <!-- Review Score -->
                  <div class="flex items-center gap-2 mb-1">
                    <div
                      class="bg-red text-white px-2 py-0.5 rounded font-bold text-sm"
                    >
                      {{ hotel.review_score || "8.6" }}
                    </div>
                    <div class="text-xs text-gray-600">
                      <span class="font-semibold">{{
                        hotel.review_label || "Excellent"
                      }}</span>
                      <span class="ml-1 text-[10px]"
                        >{{
                          hotel.review_count?.toLocaleString() || "7398"
                        }}
                        reviews</span
                      >
                    </div>
                  </div>
                  <div class="flex items-end justify-between mt-2">
                    <div class="text-right">
                      <!-- Discount Badge -->
                      <div
                        v-if="hotel.discount_percentage"
                        class="inline-block bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold mb-1"
                      >
                        -{{ hotel.discount_percentage }}%
                      </div>
                      <!-- Original Price (crossed out) -->
                      <div
                        v-if="hotel.original_price"
                        class="text-xs text-gray-400 line-through"
                      >
                        {{ hotel.original_price?.toLocaleString() }} ฿
                      </div>
                      <!-- Current Price -->
                      <div class="text-red-500 text-xl font-bold">
                        {{ hotel.lowest_room_price?.toLocaleString() || "999" }}
                        <span class="text-base">฿</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

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
// Import marker cluster
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { useRouter } from "vue-router";

const hotelStore = useHotelStore();
const cityStore = useCityStore();
const router = useRouter();

// State
const loading = ref(false);
const allHotels = ref([]);
const cities = ref([]);
const places = ref([]);
const selectedCity = ref("");
const selectedPlace = ref("");
const showSearchPanel = ref(false);
const showHotelList = ref(false);
const selectedHotelId = ref(null);
const hotelListContainer = ref(null);
const hotelCardRefs = ref({});
const loadingPlaces = ref(false);

// Map variables
let map = null;
let markerClusterGroup = null; // Cluster group

// Computed
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

// Helper method to get city name
const getCityName = (cityId) => {
  const city = cities.value.find((c) => c.id == cityId);
  return city ? city.name : "All cities";
};

// Methods
const toggleSearchPanel = () => {
  showSearchPanel.value = !showSearchPanel.value;
};

const toggleHotelList = () => {
  showHotelList.value = !showHotelList.value;
};

// Set hotel card refs for scrolling
const setHotelCardRef = (el, hotelId) => {
  if (el) {
    hotelCardRefs.value[hotelId] = el;
  }
};

// Scroll to specific hotel in the list
const scrollToHotel = (hotelId) => {
  // Remove active class from all markers
  const allMarkers = document.querySelectorAll(".price-badge");
  allMarkers.forEach((marker) => {
    marker.classList.remove("active");
  });

  // Add active class to clicked marker
  const activeMarker = document.querySelector(
    `.price-badge[data-hotel-id="${hotelId}"]`
  );
  if (activeMarker) {
    activeMarker.classList.add("active");
  }

  // Make sure hotel list is visible
  if (!showHotelList.value) {
    showHotelList.value = true;
  }

  // Set selected hotel
  selectedHotelId.value = hotelId;

  // Wait for next tick to ensure DOM is updated
  setTimeout(() => {
    const hotelCard = hotelCardRefs.value[hotelId];
    if (hotelCard && hotelListContainer.value) {
      // Calculate scroll position to center the card
      const containerRect = hotelListContainer.value.getBoundingClientRect();
      const cardRect = hotelCard.getBoundingClientRect();
      const scrollLeft =
        hotelCard.offsetLeft - containerRect.width / 2 + cardRect.width / 2;

      // Smooth scroll to the hotel card
      hotelListContainer.value.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, 100);

  // Remove highlight after 2 seconds
  setTimeout(() => {
    selectedHotelId.value = null;
    // Also remove active class from marker
    if (activeMarker) {
      activeMarker.classList.remove("active");
    }
  }, 2000);
};

const getMapList = async () => {
  try {
    loading.value = true;
    const res = await hotelStore.getMapListAction();
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

const onCityChangeModal = async (cityId) => {
  selectedCity.value = cityId;
  selectedPlace.value = ""; // Reset place when city changes

  if (cityId) {
    // Fetch places for selected city
    try {
      loadingPlaces.value = true;
      const res = await cityStore.getPlaceListAction({
        city_id: cityId,
        limit: 1000,
      });

      if (res?.result) {
        places.value = res.result.data;
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      loadingPlaces.value = false;
    }
  } else {
    places.value = [];
  }
};

const onFilterChange = () => {
  // Update markers based on filtered hotels
  updateMapMarkers();
};

const applyFilters = () => {
  onFilterChange();
  toggleSearchPanel();
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

  // Initialize marker cluster group
  markerClusterGroup = L.markerClusterGroup({
    // Clustering options
    maxClusterRadius: 80, // Cluster radius in pixels (increase for more aggressive clustering)
    spiderfyOnMaxZoom: true, // Show all markers when zoomed to max
    showCoverageOnHover: false, // Don't show cluster coverage on hover
    zoomToBoundsOnClick: true, // Zoom to bounds when cluster clicked
    disableClusteringAtZoom: 16, // Stop clustering at zoom level 16 (individual markers)

    // Custom cluster icon
    iconCreateFunction: function (cluster) {
      const childCount = cluster.getChildCount();

      // Calculate average price for this cluster
      const markers = cluster.getAllChildMarkers();
      let totalPrice = 0;
      let priceCount = 0;

      markers.forEach((marker) => {
        if (
          marker.options.hotelData &&
          marker.options.hotelData.lowest_room_price
        ) {
          totalPrice += marker.options.hotelData.lowest_room_price;
          priceCount++;
        }
      });

      const avgPrice = priceCount > 0 ? Math.round(totalPrice / priceCount) : 0;
      const formattedPrice =
        avgPrice > 0 ? `฿${avgPrice.toLocaleString()}` : "";

      return L.divIcon({
        html: `
          <div class="cluster-marker-new">
            <div class="cluster-content">
              ${childCount} hotels
            </div>
          </div>
        `,
        className: "custom-cluster-icon",
        iconSize: L.point(100, 40),
        iconAnchor: [50, 20],
      });
    },
  });

  map.addLayer(markerClusterGroup);

  // Add initial hotel markers
  updateMapMarkers();
};

const updateMapMarkers = () => {
  // Clear existing markers from cluster group
  if (markerClusterGroup) {
    markerClusterGroup.clearLayers();
  }

  const markers = [];

  filteredHotels.value.forEach((hotel) => {
    if (hotel.latitude && hotel.longitude) {
      // Format price for display
      const formattedPrice = hotel.lowest_room_price
        ? `฿${hotel.lowest_room_price.toLocaleString()}`
        : "N/A";

      // Custom marker icon with price badge
      const priceIcon = L.divIcon({
        className: "custom-price-marker",
        html: `<div class="price-badge" data-hotel-id="${hotel.id}">${formattedPrice}</div>`,
        iconSize: [80, 32],
        iconAnchor: [40, 16],
        popupAnchor: [0, -16],
      });

      const marker = L.marker(
        [parseFloat(hotel.latitude), parseFloat(hotel.longitude)],
        {
          icon: priceIcon,
          hotelData: hotel, // Store hotel data for cluster averaging
        }
      );

      // Add click event to scroll to hotel instead of showing popup
      marker.on("click", () => {
        scrollToHotel(hotel.id);
      });

      markers.push(marker);
    }
  });

  // Add all markers to cluster group at once
  if (markerClusterGroup) {
    markerClusterGroup.addLayers(markers);
  }

  // Fit map to show all markers
  if (markers.length > 0) {
    const bounds = markerClusterGroup.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.1));
    }
  }
};

onMounted(async () => {
  console.log("Map Page Loaded");
  await getCities();
  await getMapList();
});
</script>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Smooth scrolling */
.scroll-smooth {
  scroll-behavior: smooth;
}

/* Line clamp for text overflow */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom price marker styles */
:deep(.custom-price-marker) {
  background: none;
  border: none;
}

:deep(.price-badge) {
  background: #ffffff;
  color: black;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(52, 52, 52, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 0.5px solid #7272727d;
}

:deep(.price-badge:hover) {
  background: #ffffff;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(104, 104, 104, 0.6);
}

:deep(.price-badge.active) {
  background: #f97316 !important; /* Orange 500 */
  color: white !important;
  border-color: #f97316 !important;
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.6);
}

/* Cluster marker styles - New Design */
:deep(.custom-cluster-icon) {
  background: none;
  border: none;
}

:deep(.cluster-marker-new) {
  background: #ffffff;
  border-radius: 24px;
  padding: 8px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
  white-space: nowrap;
}

:deep(.cluster-marker-new:hover) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

:deep(.cluster-content) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #000000;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
}

:deep(.cluster-hotel-count) {
  font-size: 10px;
  font-weight: 500;
  color: #666666;
}

/* Custom scrollbar for modal */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb #f9fafb;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f9fafb;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
