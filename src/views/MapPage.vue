<template>
	<div class="relative w-full h-screen">
		<!-- <NavbarVue /> -->
		<div class="fixed inset-0 w-full h-full overflow-hidden overscroll-none">
			<!--  Filter Bar  -->
			<div class="absolute top-5 left-1/2 transform -translate-x-1/2 z-[1001] w-[90%] max-w-md sm:w-auto sm:max-w-none">
				<div
					class="bg-white rounded-full shadow-lg px-4 py-3 sm:px-6 sm:py-3 flex items-center gap-2 sm:gap-3 hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
				>
					<!-- back to home -->
					<router-link to="/">
						<div class="flex-shrink-0 cursor-pointer">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-7 h-7 sm:w-8 sm:h-8"
								viewBox="0 0 24 24"
								fill="none"
								stroke="gray"
								stroke-width="2.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M15 18l-6-6 6-6" />
							</svg>
						</div>
					</router-link>

					<!-- Navigated Place-->
					<div class="text-center flex-1 min-w-0">
						<h3 class="text-xs sm:text-sm font-semibold text-gray-900 truncate">
							{{ selectPart === "hotel" ? "Hotels in map area" : "Attractions in map area" }}
						</h3>
						<p class="text-[10px] sm:text-xs text-gray-500 truncate">
							{{ selectedCity ? getCityName(selectedCity) : "All cities" }}
							{{ selectedPlace && selectPart === "hotel" ? ` · ${selectedPlace}` : "" }}
							{{ selectedCategoryName && selectPart === "attraction" ? ` · ${selectedCategoryName}` : "" }}
							{{ priceFilter ? ` · ${priceFilterLabel}` : "" }}
						</p>
					</div>

					<!-- filter button for map -->
					<div
						@click="openFilterModal"
						class="flex-shrink-0 w-9 h-9 sm:w-8 sm:h-8 bg-[#FF613c] rounded-full flex items-center justify-center"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							class="sm:w-4 sm:h-4"
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
				</div>
			</div>

			<!-- Filter Modal -->
			<Modal :isOpen="showFilterModal" :marginTop="'mt-6'" @closeModal="closeFilterModal">
				<DialogPanel
					class="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl"
				>
					<div class="space-y-6">
						<!-- Header -->
						<div class="flex items-center justify-between pb-4 border-b border-gray-200">
							<div class="flex items-center gap-3">
								<div class="p-2 bg-[#FF613c]/10 rounded-lg">
									<svg class="w-5 h-5 text-[#FF613c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</div>
								<div>
									<h2 class="text-lg font-semibold text-gray-900">Search & Filter</h2>
									<p class="text-xs text-gray-500">Choose your preferences</p>
								</div>
							</div>
							<button @click="closeFilterModal" class="text-gray-400 hover:text-gray-600 transition-colors p-1">
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<!-- Type Selection in Modal -->
						<div class="space-y-3">
							<h3 class="text-sm font-medium text-gray-700">Choose Type</h3>
							<div class="grid grid-cols-2 gap-3">
								<button
									@click="selectType('hotel')"
									:class="[
										'flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border rounded-lg cursor-pointer transition-all',
										selectPart === 'hotel'
											? 'bg-[#FF613c] text-white border-[#FF613c]'
											: 'bg-white text-gray-700 border-gray-300 hover:border-[#FF613c]',
									]"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
										/>
									</svg>
									Hotels
								</button>
								<button
									@click="selectType('attraction')"
									:class="[
										'flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border rounded-lg cursor-pointer transition-all',
										selectPart === 'attraction'
											? 'bg-[#FF613c] text-white border-[#FF613c]'
											: 'bg-white text-gray-700 border-gray-300 hover:border-[#FF613c]',
									]"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
									Attractions
								</button>
							</div>
						</div>

						<!-- City Selection -->
						<div class="space-y-3">
							<h3 class="text-sm font-medium text-gray-700">Choose City</h3>
							<div class="space-y-2 max-h-[200px] overflow-y-auto pr-2">
								<div
									v-for="city in cityList"
									:key="city.id"
									@click="selectCity(city.id)"
									:class="[
										'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all',
										selectedCity === city.id
											? 'border-[#FF613c] bg-[#FF613c]/5'
											: 'border-gray-200 hover:border-[#FF613c]',
									]"
								>
									<span
										class="text-sm"
										:class="selectedCity === city.id ? 'text-[#FF613c] font-medium' : 'text-gray-700'"
									>
										{{ city.name }}
									</span>
									<div class="flex items-center">
										<div
											:class="[
												'w-5 h-5 rounded-full border flex items-center justify-center',
												selectedCity === city.id ? 'bg-[#FF613c] border-[#FF613c]' : 'bg-white border-gray-300',
											]"
										>
											<svg
												v-if="selectedCity === city.id"
												class="w-3 h-3 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
											</svg>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Place Selection (Only for Hotels) -->
						<div v-if="selectPart === 'hotel' && selectedCity" class="space-y-3">
							<div class="flex items-center justify-between">
								<h3 class="text-sm font-medium text-gray-700">Choose Place</h3>
								<button @click="selectedPlace = ''" class="text-xs text-[#FF613c] hover:text-[#ff4d28]">Clear</button>
							</div>
							<div class="space-y-2 max-h-[150px] overflow-y-auto pr-2">
								<div
									@click="selectedPlace = ''"
									:class="[
										'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all',
										selectedPlace === '' ? 'border-[#FF613c] bg-[#FF613c]/5' : 'border-gray-200 hover:border-[#FF613c]',
									]"
								>
									<span class="text-sm" :class="selectedPlace === '' ? 'text-[#FF613c] font-medium' : 'text-gray-700'">
										All Places
									</span>
									<div class="flex items-center">
										<div
											:class="[
												'w-5 h-5 rounded-full border flex items-center justify-center',
												selectedPlace === '' ? 'bg-[#FF613c] border-[#FF613c]' : 'bg-white border-gray-300',
											]"
										>
											<svg
												v-if="selectedPlace === ''"
												class="w-3 h-3 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
											</svg>
										</div>
									</div>
								</div>
								<div
									v-for="place in getPlaceList"
									:key="place.id"
									@click="selectedPlace = place.name"
									:class="[
										'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all',
										selectedPlace === place.name
											? 'border-[#FF613c] bg-[#FF613c]/5'
											: 'border-gray-200 hover:border-[#FF613c]',
									]"
								>
									<span
										class="text-sm"
										:class="selectedPlace === place.name ? 'text-[#FF613c] font-medium' : 'text-gray-700'"
									>
										{{ place.name }}
									</span>
									<div class="flex items-center">
										<div
											:class="[
												'w-5 h-5 rounded-full border flex items-center justify-center',
												selectedPlace === place.name ? 'bg-[#FF613c] border-[#FF613c]' : 'bg-white border-gray-300',
											]"
										>
											<svg
												v-if="selectedPlace === place.name"
												class="w-3 h-3 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
											</svg>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Category Selection (Only for Attractions) -->
						<div v-if="selectPart === 'attraction' && attractionCategories.length > 0" class="space-y-3">
							<div class="flex items-center justify-between">
								<h3 class="text-sm font-medium text-gray-700">Choose Category</h3>
								<button @click="selectedCategory = ''" class="text-xs text-[#FF613c] hover:text-[#ff4d28]">
									Clear
								</button>
							</div>
							<div class="space-y-2 max-h-[150px] overflow-y-auto pr-2">
								<div
									@click="selectedCategory = ''"
									:class="[
										'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all',
										selectedCategory === ''
											? 'border-[#FF613c] bg-[#FF613c]/5'
											: 'border-gray-200 hover:border-[#FF613c]',
									]"
								>
									<span
										class="text-sm"
										:class="selectedCategory === '' ? 'text-[#FF613c] font-medium' : 'text-gray-700'"
									>
										All Categories
									</span>
									<div class="flex items-center">
										<div
											:class="[
												'w-5 h-5 rounded-full border flex items-center justify-center',
												selectedCategory === '' ? 'bg-[#FF613c] border-[#FF613c]' : 'bg-white border-gray-300',
											]"
										>
											<svg
												v-if="selectedCategory === ''"
												class="w-3 h-3 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
											</svg>
										</div>
									</div>
								</div>
								<div
									v-for="category in attractionCategories"
									:key="category.id"
									@click="selectedCategory = category.id"
									:class="[
										'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all',
										selectedCategory === category.id
											? 'border-[#FF613c] bg-[#FF613c]/5'
											: 'border-gray-200 hover:border-[#FF613c]',
									]"
								>
									<span
										class="text-sm"
										:class="selectedCategory === category.id ? 'text-[#FF613c] font-medium' : 'text-gray-700'"
									>
										{{ category.name }}
									</span>
									<div class="flex items-center">
										<div
											:class="[
												'w-5 h-5 rounded-full border flex items-center justify-center',
												selectedCategory === category.id ? 'bg-[#FF613c] border-[#FF613c]' : 'bg-white border-gray-300',
											]"
										>
											<svg
												v-if="selectedCategory === category.id"
												class="w-3 h-3 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
											</svg>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Price Range -->
						<div class="space-y-3">
							<h3 class="text-sm font-medium text-gray-700">Price Range</h3>
							<div class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
								<button
									@click="setPriceFilter('')"
									:class="[
										'flex-shrink-0 flex flex-col items-center justify-center px-4 py-5 text-sm font-medium border rounded-lg cursor-pointer transition-all min-w-[100px]',
										priceFilter === ''
											? 'bg-[#FF613c] text-white border-[#FF613c]'
											: 'bg-white text-gray-700 border-gray-300 hover:border-[#FF613c]',
									]"
								>
									<span class="font-semibold">All Prices</span>
								</button>
								<button
									@click="setPriceFilter('0-1200')"
									:class="[
										'flex-shrink-0 flex flex-col items-center justify-center px-4 py-3 text-sm font-medium border rounded-lg cursor-pointer transition-all min-w-[100px]',
										priceFilter === '0-1200'
											? 'bg-[#FF613c] text-white border-[#FF613c]'
											: 'bg-white text-gray-700 border-gray-300 hover:border-[#FF613c]',
									]"
								>
									<span class="font-semibold">Budget</span>
									<span class="text-xs mt-0.5">&lt; 1200฿</span>
								</button>
								<button
									@click="setPriceFilter('1200-1800')"
									:class="[
										'flex-shrink-0 flex flex-col items-center justify-center px-4 py-3 text-sm font-medium border rounded-lg cursor-pointer transition-all min-w-[100px]',
										priceFilter === '1200-1800'
											? 'bg-[#FF613c] text-white border-[#FF613c]'
											: 'bg-white text-gray-700 border-gray-300 hover:border-[#FF613c]',
									]"
								>
									<span class="font-semibold">Standard</span>
									<span class="text-xs mt-0.5">1200-1800฿</span>
								</button>
								<button
									@click="setPriceFilter('1800-3000')"
									:class="[
										'flex-shrink-0 flex flex-col items-center justify-center px-4 py-3 text-sm font-medium border rounded-lg cursor-pointer transition-all min-w-[100px]',
										priceFilter === '1800-3000'
											? 'bg-[#FF613c] text-white border-[#FF613c]'
											: 'bg-white text-gray-700 border-gray-300 hover:border-[#FF613c]',
									]"
								>
									<span class="font-semibold">Premium</span>
									<span class="text-xs mt-0.5">1800-3000฿</span>
								</button>
								<button
									@click="setPriceFilter('3000-100000')"
									:class="[
										'flex-shrink-0 flex flex-col items-center justify-center px-4 py-3 text-sm font-medium border rounded-lg cursor-pointer transition-all min-w-[100px]',
										priceFilter === '3000-100000'
											? 'bg-[#FF613c] text-white border-[#FF613c]'
											: 'bg-white text-gray-700 border-gray-300 hover:border-[#FF613c]',
									]"
								>
									<span class="font-semibold">Luxury</span>
									<span class="text-xs mt-0.5">3000+฿</span>
								</button>
							</div>
						</div>

						<!-- Footer Actions -->
						<div class="flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
							<button
								@click="resetAllFilters"
								class="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-1"
							>
								Reset All
							</button>
							<button
								@click="applyFilters"
								class="px-6 py-3 text-sm font-medium text-white bg-[#FF613c] rounded-lg hover:bg-[#ff4d28] transition-colors flex-1"
							>
								Apply Filters
							</button>
						</div>
					</div>
				</DialogPanel>
			</Modal>

			<!--  Destinations -->
			<Modal :isOpen="openDestinationModal" :marginTop="'mt-6'" @closeModal="openDestinationModal = false">
				<DialogPanel
					class="w-full max-w-2xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl"
				>
					<div class="space-y-4">
						<!-- Header -->
						<div class="flex items-center justify-between pb-3 border-b border-gray-200">
							<h2 class="text-lg font-semibold text-gray-900">Search Destinations</h2>
							<button @click="openDestinationModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<!-- Search Input -->
						<div class="relative">
							<input
								v-model="destinationSearchQuery"
								type="text"
								placeholder="Search destinations by name..."
								class="w-full px-4 py-3 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4299e1] focus:border-transparent"
							/>
							<svg
								class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
						</div>

						<!-- City Filter Dropdown -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2"> Filter by City </label>
							<div class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
								<button
									@click="setCity('')"
									:class="[
										selectedCity === ''
											? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
											: 'border-gray-300 bg-white text-gray-700',
										{ 'bg-gray-300 text-black/30': loading },
									]"
									class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
								>
									All Cities
								</button>
								<button
									v-for="city in cityList"
									:key="city.id"
									@click="setCity(city.id)"
									:class="[
										selectedCity === city.id
											? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
											: 'border-gray-300 bg-white text-gray-700',
										{ 'bg-gray-300 text-black/30': loading },
									]"
									class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
								>
									{{ city.name }}
								</button>
							</div>
						</div>

						<!-- Destinations List -->
						<div class="space-y-2">
							<div class="flex items-center justify-between">
								<label class="block text-sm font-medium text-gray-700">
									Available Destinations ({{ filteredDestinationsForModal.length }})
								</label>
								<button
									v-if="selectedCity || destinationSearchQuery"
									@click="clearDestinationFilters"
									class="text-xs text-[#FF613c] hover:text-[#ff4d28] font-medium"
								>
									Clear Filters
								</button>
							</div>

							<!-- Destinations -->
							<div class="max-h-[300px] overflow-y-auto scroll-container-y space-y-2 pr-2">
								<div v-if="filteredDestinationsForModal.length === 0" class="text-center py-12 text-gray-500">
									<svg
										class="w-16 h-16 mx-auto mb-4 text-gray-300"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<p class="text-sm">No destinations found</p>
									<p class="text-xs mt-1">Try adjusting your search criteria</p>
								</div>

								<div
									v-for="dest in filteredDestinationsForModal"
									:key="dest.id"
									@click="selectDestinationFromModal(dest)"
									class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#4299e1] hover:bg-[#4299e1]/5 cursor-pointer transition-all group"
									:class="selectedDestination?.id === dest.id ? 'border-[#4299e1] bg-[#4299e1]/10' : ''"
								>
									<!-- Destination Image -->
									<div class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
										<img :src="dest.feature_img" :alt="dest.name" class="w-full h-full object-cover" />
									</div>

									<!-- Destination Info -->
									<div class="flex-1 min-w-0">
										<h3
											class="font-semibold text-sm mb-1 truncate"
											:class="selectedDestination?.id === dest.id ? 'text-[#4299e1]' : 'text-gray-900'"
										>
											{{ dest.name }}
										</h3>
										<p class="text-xs text-gray-600 mb-1">
											{{ dest.city?.name || "Unknown City" }}
										</p>
										<span class="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
											{{ getNearbyHotels(dest).length }} hotels nearby
										</span>
									</div>

									<div v-if="selectedDestination?.id === dest.id" class="flex-shrink-0">
										<svg class="w-6 h-6 text-[#4299e1]" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
									</div>
								</div>
							</div>
						</div>

						<!-- Footer Actions -->
						<div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
							<button
								@click="openDestinationModal = false"
								class="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Close
							</button>
							<button
								v-if="selectedDestination"
								@click="
									clearDestination();
									openDestinationModal = false;
								"
								class="px-4 py-2 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
							>
								Clear
							</button>
							<button
								v-if="selectedDestination"
								@click="openDestinationModal = false"
								class="px-4 py-2 text-xs font-medium text-white bg-[#FF613c] rounded-lg hover:bg-[#FF613c] transition-colors"
							>
								Confirm
							</button>
						</div>
					</div>
				</DialogPanel>
			</Modal>

			<!-- Detail Modal -->
			<Modal :isOpen="hotelModalOpen" :marginTop="''" @closeModal="closeHotelModal()">
				<DialogPanel
					class="fixed inset-0 w-screen h-screen overflow-auto bg-white md:relative md:inset-auto md:w-full md:max-w-xl md:h-auto md:rounded-2xl md:shadow-xl"
				>
					<DetailComponent :hotelId="hotelDetailId" :closeModal="closeHotelModal" />
				</DialogPanel>
			</Modal>

			<Modal :isOpen="hotelAvailableModalOpen" :marginTop="'mt-4'" @closeModal="closeHotelModal()">
				<DialogPanel
					class="fixed inset-0 w-screen h-screen overflow-auto bg-white md:relative md:inset-auto md:w-full md:max-w-xl md:h-auto md:rounded-2xl md:shadow-xl"
				>
					<Availabilities :detailId="hotelDetailId" :closeModal="closeHotelModal" />
				</DialogPanel>
			</Modal>

			<!-- Detail Modal -->
			<Modal :isOpen="attractionModalOpen" :marginTop="'mt-4'" @closeModal="closeAttractionModal()">
				<DialogPanel
					class="fixed inset-0 w-screen h-screen overflow-auto bg-white md:relative md:inset-auto md:w-full md:max-w-xl md:h-auto md:rounded-2xl md:shadow-xl"
				>
					<DetailAttraction :attractionId="attractionDetailId" :closeModal="closeAttractionModal" />
				</DialogPanel>
			</Modal>

			<Modal :isOpen="attractionAvailableModalOpen" :marginTop="'mt-4'" @closeModal="closeAttractionModal()">
				<DialogPanel
					class="fixed inset-0 w-screen h-screen overflow-auto bg-white md:relative md:inset-auto md:w-full md:max-w-xl md:h-auto md:rounded-2xl md:shadow-xl"
				>
					<AvailabilityTicket :detailId="attractionDetailId" :closeModal="closeAttractionModal" />
				</DialogPanel>
			</Modal>

			<button
				@click="toggleList"
				:style="{
					bottom: showList ? `${250}px` : `${100}px`,
				}"
				:class="showList ? 'rotate-[180deg]' : ''"
				class="absolute right-3 z-[1001] w-12 h-12 bg-white border border-black/10 hover:bg-gray-50 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 sm:w-10 sm:h-10 sm:right-2"
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

			<!-- Map -->
			<div id="map" ref="mapRef" class="w-full h-full"></div>

			<transition
				enter-active-class="transition-all duration-300 ease-out"
				enter-from-class="opacity-0 translate-y-8"
				enter-to-class="opacity-100 translate-y-0"
				leave-active-class="transition-all duration-200 ease-in"
				leave-from-class="opacity-100 translate-y-0"
				leave-to-class="opacity-0 translate-y-8"
			>
				<div
					v-if="showList"
					class="absolute left-4 right-4 md:left-[100px] md:right-5 z-[999] bottom-5 tablet:bottom-[100px] ipad-pro:bottom-[120px] mobile:bottom-[140px] pointer-events-none sm:bottom-3 sm:left-2 sm:right-2"
				>
					<div
						ref="listContainer"
						class="flex gap-3 overflow-x-auto pb-2 pointer-events-auto scrollbar-hide scroll-smooth sm:gap-2"
					>
						<!-- Hotel Cards -->
						<div
							v-for="hotel in filteredHotels"
							v-show="selectPart === 'all' || selectPart === 'hotel'"
							:key="'hotel-' + hotel.id"
							:ref="(el) => setCardRef(el, 'hotel', hotel.id)"
							:data-type="'hotel'"
							:data-id="hotel.id"
							@click="scrollToItem('hotel', hotel.id)"
							:class="[
								'flex-shrink-0 rounded-xl shadow-md transition-all duration-300 cursor-pointer overflow-hidden',
								'w-72 sm:w-48',
								selectedItemId === 'hotel-' + hotel.id ? 'bg-[#FF613c]' : 'bg-white',
							]"
						>
							<div class="flex sm:flex-col sm:h-full">
								<!-- Hotel Image -->
								<div class="relative w-28 h-[145px] flex-shrink-0 sm:w-full">
									<img
										:src="hotel.images?.[0]?.image || 'https://via.placeholder.com/300x300?text=No+Image'"
										:alt="hotel.name"
										class="w-full h-full object-cover"
									/>
								</div>

								<!-- Hotel Info -->
								<div class="flex-1 py-2 px-4 flex flex-col justify-between sm:p-1.5 sm:flex-1">
									<!-- Top Section -->
									<div>
										<h3
											class="font-semibold text-xs mb-0.5 line-clamp-2 sm:text-[11px] sm:line-clamp-2"
											:class="selectedItemId === 'hotel-' + hotel.id ? 'text-white' : 'text-gray-900'"
										>
											{{ hotel.name }}
										</h3>

										<!-- Star Rating -->
										<div class="flex items-center gap-0.5 mb-0.5 sm:mb-0.25">
											<span class="text-yellow-400 text-xs sm:text-[10px]">{{ "★".repeat(hotel.rating || 0) }}</span>
										</div>
										<p
											class="text-[9px] sm:text-[8px] mb-0.5"
											:class="selectedItemId === 'hotel-' + hotel.id ? 'text-white' : 'text-gray-900'"
										>
											Starting from
										</p>
										<div class="flex items-start justify-between mt-1 sm:mt-0.5">
											<div class="text-right">
												<!-- Current Price -->
												<div
													class="text-lg font-bold sm:text-base"
													:class="selectedItemId === 'hotel-' + hotel.id ? 'text-white' : 'text-gray-900'"
												>
													{{ hotel.lowest_room_price?.toLocaleString() || "999" }}
													<span class="text-sm sm:text-xs">฿</span>
												</div>
											</div>
										</div>
										<div class="flex justify-between items-center gap-x-1.5 sm:gap-x-1 sm:mt-1.5">
											<div
												class="flex px-1.5 text-[11px] mt-1.5 rounded-full w-full shadow-sm justify-center py-1 sm:px-1 sm:py-1 sm:text-[10px]"
												@click="getViewDetail(hotel.id)"
												:class="
													selectedItemId === 'hotel-' + hotel.id
														? 'text-white bg-white/20'
														: 'text-gray-900 bg-gray-300/20'
												"
											>
												Detail
											</div>
											<div
												class="flex px-2 text-[11px] mt-1.5 rounded-full shadow-sm justify-center py-1 sm:px-1.5 sm:py-1 sm:text-[10px]"
												@click="getAvailableRooms(hotel.id)"
												:class="
													selectedItemId === 'hotel-' + hotel.id
														? 'text-white bg-white/20'
														: 'text-gray-900 bg-gray-300/20'
												"
											>
												<PaperAirplaneIcon class="w-3.5 h-3.5 sm:w-3 sm:h-3" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Attraction Cards  -->
						<div
							v-for="attraction in filteredAttractions"
							v-show="selectPart === 'all' || selectPart === 'attraction'"
							:key="'attraction-' + attraction.id"
							:ref="(el) => setCardRef(el, 'attraction', attraction.id)"
							:data-type="'attraction'"
							:data-id="attraction.id"
							@click="scrollToItem('attraction', attraction.id)"
							:class="[
								'flex-shrink-0 rounded-xl shadow-md transition-all duration-300 cursor-pointer overflow-hidden',
								'w-72 sm:w-48',
								selectedItemId === 'attraction-' + attraction.id ? 'bg-[#9333ea]' : 'bg-white',
							]"
						>
							<div class="flex sm:flex-col sm:h-full">
								<!-- Attraction Image  -->
								<div class="relative w-28 h-[140px] flex-shrink-0 sm:w-full sm:h-20">
									<img
										:src="attraction.cover_image || 'https://via.placeholder.com/300x300?text=No+Image'"
										:alt="attraction.name"
										class="w-full h-full object-cover"
									/>
								</div>

								<!-- Attraction Info -->
								<div class="flex-1 p-2 flex flex-col justify-between sm:p-1.5 sm:flex-1">
									<div>
										<h3
											class="font-semibold text-xs mb-0.5 line-clamp-2 sm:text-[11px] sm:line-clamp-2"
											:class="selectedItemId === 'attraction-' + attraction.id ? 'text-white' : 'text-gray-900'"
										>
											{{ attraction.name }}
										</h3>

										<p
											class="text-[9px] mb-1 sm:text-[8px] sm:mb-0.5"
											:class="selectedItemId === 'attraction-' + attraction.id ? 'text-white' : 'text-gray-600'"
										>
											{{ attraction.cities?.[0]?.name || "Attraction" }}
										</p>

										<p
											class="text-[9px] sm:text-[8px] mb-0.5"
											:class="selectedItemId === 'attraction-' + attraction.id ? 'text-white' : 'text-gray-900'"
										>
											Starting from
										</p>
										<div class="flex items-start justify-between mt-1 sm:mt-0.5">
											<div class="text-right">
												<div
													class="text-lg font-bold sm:text-base"
													:class="selectedItemId === 'attraction-' + attraction.id ? 'text-white' : 'text-gray-900'"
												>
													{{ attraction.lowest_variation_price?.toLocaleString() || "999" }}
													<span class="text-sm sm:text-xs">฿</span>
												</div>
											</div>
										</div>
										<div class="flex justify-between items-center gap-x-1.5 sm:gap-x-1 sm:mt-1.5">
											<div
												class="flex px-1.5 text-[11px] mt-1.5 shadow-sm w-full rounded-full justify-center py-1 sm:px-1 sm:py-1 sm:text-[10px]"
												@click.stop="viewAttractionDetail(attraction.id)"
												:class="
													selectedItemId === 'attraction-' + attraction.id
														? 'text-white bg-white/20'
														: 'text-gray-900 bg-gray-300/20'
												"
											>
												Detail
											</div>
											<div
												class="flex px-2 text-[11px] mt-1.5 shadow-sm rounded-full justify-center py-1 sm:px-1.5 sm:py-1 sm:text-[10px]"
												@click="viewAvailableTicket(attraction.id)"
												:class="
													selectedItemId === 'attraction-' + attraction.id
														? 'text-white bg-white/20'
														: 'text-gray-900 bg-gray-300/20'
												"
											>
												<PaperAirplaneIcon class="w-3.5 h-3.5 sm:w-3 sm:h-3" />
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
			<div v-if="loading" class="absolute inset-0 bg-white/80 flex items-center justify-center z-[2000]">
				<div class="w-12 h-12 border-4 border-[#FF613c]/20 border-t-[#FF613c] rounded-full animate-spin"></div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, watch, nextTick } from "vue";
import { useHotelStore } from "../stores/hotel";
import { useEntranceStore } from "../stores/entrance";
import DetailComponent from "./MapComponent/Detail.vue";
import { useCityStore } from "../stores/city";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Modal from "../components/Modal.vue";
import { DialogPanel } from "@headlessui/vue";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { useRoute, useRouter } from "vue-router";
import { useDestinationStore } from "../stores/destination";
import { storeToRefs } from "pinia";
import DetailAttraction from "./MapComponent/DetailAttraction.vue";
import { PaperAirplaneIcon } from "@heroicons/vue/24/outline";
import Availabilities from "./MapComponent/hotels/Availabilities.vue";
import NavbarVue from "../components/Navbar.vue";
import AvailabilityTicket from "./MapComponent/attractions/Availabilities.vue";

const hotelStore = useHotelStore();
const entranceStore = useEntranceStore();
const destinationStore = useDestinationStore();
const cityStore = useCityStore();
const router = useRouter();
const route = useRoute();

const loading = ref(false);
const priceRangeShow = ref(false);
const allHotels = ref([]);
const allAttractions = ref([]);
const cityList = ref([]);
const selectedCity = ref(2);
const selectedPlace = ref("");
const selectedCategory = ref("");
const priceFilter = ref("");
const showList = ref(true);
const selectedItemId = ref("");
const listContainer = ref(null);
const cardRefs = ref({});
const showDateBox = ref(false);
const safeAreaBottom = ref(0);
const loadingPlace = ref(false);
const chooseCityName = ref("");
const showCityModal = ref(false);
const showPlaceModal = ref(false);
const { dests } = storeToRefs(destinationStore);
const openDestinationModal = ref(false);

const selectPart = ref("hotel");
const closeCity = ref(false);
const closeCategory = ref(false);

const selectedDestination = ref(null);
const destinationRadius = ref(3);

const checkin_date = ref(
	localStorage.getItem("checkin_date") ? localStorage.getItem("checkin_date").replace('"', "") : ""
);
const checkout_date = ref(
	localStorage.getItem("checkout_date") ? localStorage.getItem("checkout_date").replace('"', "") : ""
);
const room_qty = ref(localStorage.getItem("room_qty") || "");

const showFilterModal = ref(false);

// Map variables
let map = null;
let markerClusterGroup = null;

const attractionCategories = computed(() => {
	const categoriesMap = new Map();

	allAttractions.value.forEach((attraction) => {
		if (attraction.categories && Array.isArray(attraction.categories)) {
			attraction.categories.forEach((category) => {
				if (!categoriesMap.has(category.id)) {
					categoriesMap.set(category.id, category);
				}
			});
		}
	});

	return Array.from(categoriesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
});

const visibleCategories = computed(() => {
	return attractionCategories.value;
});

const visibleCities = computed(() => {
	return cityList.value;
});

const visiblePlaces = computed(() => {
	return getPlaceList.value;
});

const hasActiveFilters = computed(() => {
	return selectedCity.value || selectedPlace.value || selectedCategory.value || priceFilter.value;
});

const selectedCityName = computed(() => {
	if (!selectedCity.value) return null;
	const city = cityList.value.find((c) => c.id == selectedCity.value);
	return city ? city.name : null;
});

const selectedCategoryName = computed(() => {
	if (!selectedCategory.value) return null;
	const category = attractionCategories.value.find((c) => c.id == selectedCategory.value);
	return category ? category.name : null;
});

const priceFilterLabel = computed(() => {
	switch (priceFilter.value) {
		case "0-1200":
			return "Budget (< 1200฿)";
		case "1200-1800":
			return "Standard (1200-1800฿)";
		case "1800-3000":
			return "Premium (1800-3000฿)";
		case "3000-100000":
			return "Luxury (3000+฿)";
		default:
			return "";
	}
});

// Helper functions
const calculateDistance = (lat1, lon1, lat2, lon2) => {
	const R = 6371;
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
};

const getNearbyHotels = (destination) => {
	if (!destination.latitude || !destination.longitude) {
		return allHotels.value;
	}

	return allHotels.value.filter((hotel) => {
		if (!hotel.latitude || !hotel.longitude) return false;

		const distance = calculateDistance(
			parseFloat(destination.latitude),
			parseFloat(destination.longitude),
			parseFloat(hotel.latitude),
			parseFloat(hotel.longitude)
		);

		return distance <= destinationRadius.value;
	});
};

const openFilterModal = () => {
	showFilterModal.value = true;
};

const closeFilterModal = () => {
	showFilterModal.value = false;
};

const selectType = (type) => {
	selectPart.value = type;
	if (type !== "attraction") {
		selectedCategory.value = "";
	}
};

const selectCity = (cityId) => {
	selectedCity.value = cityId;
	selectedPlace.value = "";
	if (selectPart.value !== "attraction") {
		selectedCategory.value = "";
	}
};

const clearCity = () => {
	selectedCity.value = "";
	updateMapMarkers();
};

const clearPlace = () => {
	selectedPlace.value = "";
	updateMapMarkers();
};

const clearCategory = () => {
	selectedCategory.value = "";
	updateMapMarkers();
};

const clearPriceFilter = () => {
	priceFilter.value = "";
	updateMapMarkers();
};

const resetAllFilters = () => {
	selectedCity.value = "";
	selectedPlace.value = "";
	selectedCategory.value = "";
	priceFilter.value = "";
	clearDestination();
	updateMapMarkers();
	closeFilterModal();
};

const selectDestination = async (destination) => {
	selectedDestination.value = destination;

	await nextTick();
	updateMapMarkers();

	if (map && destination.latitude && destination.longitude) {
		const destLat = parseFloat(destination.latitude);
		const destLng = parseFloat(destination.longitude);

		map.setView([destLat, destLng], 15, {
			animate: true,
			duration: 1,
		});
	}

	showList.value = true;

	setTimeout(() => {
		highlightDestinationMarker(destination.id);
	}, 300);
};

const selectDestinationFromModal = (destination) => {
	selectDestination(destination);
	showSearchPanel.value = false;
};

const destinationSearchQuery = ref("");
const showDestinationCityDropdown = ref(false);

const filteredDestinationsForModal = computed(() => {
	let filtered = destinations.value;

	if (selectedCity.value) {
		filtered = filtered.filter((d) => d.city?.id === selectedCity.value);
	}

	if (destinationSearchQuery.value.trim()) {
		const query = destinationSearchQuery.value.toLowerCase().trim();
		filtered = filtered.filter(
			(d) => d.name.toLowerCase().includes(query) || d.city?.name.toLowerCase().includes(query)
		);
	}

	return filtered;
});

const selectDestinationCity = (cityId) => {
	selectedDestinationCity.value = cityId;
	showDestinationCityDropdown.value = false;
};

const clearDestinationFilters = () => {
	destinationSearchQuery.value = "";
	selectedDestinationCity.value = "";
};

const handleClickOutside = (event) => {
	if (!event.target.closest(".relative")) {
		showDestinationCityDropdown.value = false;
	}
};

const highlightDestinationMarker = (destinationId) => {
	const allDestMarkers = document.querySelectorAll(".destination-badge");
	allDestMarkers.forEach((marker) => {
		marker.classList.remove("active");
	});

	const activeDestMarker = document.querySelector(`.destination-badge[data-destination-id="${destinationId}"]`);
	if (activeDestMarker) {
		activeDestMarker.classList.add("active");
	}
};

const clearDestination = () => {
	selectedDestination.value = null;
	updateMapMarkers();

	setTimeout(() => {
		if (selectedCity.value || selectedPlace.value || priceFilter.value) {
			centerMapOnFilteredItems();
		}
	}, 300);
};

const closeShowDateBox = () => {
	checkin_date.value = localStorage.getItem("checkin_date") || "";
	checkout_date.value = localStorage.getItem("checkout_date") || "";
	room_qty.value = localStorage.getItem("room_qty") || "";
	showDateBox.value = false;
};

const setCity = (cityId) => {
	if (loading.value) return;
	selectedCity.value = cityId;
	selectedPlace.value = "";
	if (selectPart.value !== "attraction") {
		selectedCategory.value = "";
	}
	clearDestination();
	updateMapMarkers();
	setTimeout(() => {
		centerMapOnFilteredItems();
	}, 300);
};

const setPlace = (place) => {
	if (loading.value) return;
	selectedPlace.value = place;
	clearDestination();
	updateMapMarkers();
	setTimeout(() => {
		centerMapOnFilteredItems();
	}, 300);
};

const setCategory = (categoryId) => {
	if (loading.value) return;
	selectedCategory.value = categoryId;
	updateMapMarkers();
	setTimeout(() => {
		centerMapOnFilteredItems();
	}, 300);
};

const setPriceFilter = (filter) => {
	if (loading.value) return;
	priceFilter.value = filter;
	updateMapMarkers();
	setTimeout(() => {
		centerMapOnFilteredItems();
	}, 300);
};

const isItemInPriceRange = (item) => {
	if (!priceFilter.value) return true;

	const hotelPrice = item.lowest_room_price || 0;
	const attractionPrice = item.lowest_variation_price || 0;

	const price = hotelPrice || attractionPrice;
	const [min, max] = priceFilter.value.split("-").map(Number);
	return price >= min && price <= max;
};

const filteredHotels = computed(() => {
	let filtered = allHotels.value;

	if (selectedDestination.value) {
		filtered = getNearbyHotels(selectedDestination.value);
	}

	if (selectedCity.value) {
		filtered = filtered.filter((hotel) => hotel.city_id == selectedCity.value);
	}

	if (selectedPlace.value) {
		filtered = filtered.filter((hotel) => hotel.place === selectedPlace.value);
	}

	if (priceFilter.value) {
		filtered = filtered.filter(isItemInPriceRange);
	}

	return filtered;
});

const filteredAttractions = computed(() => {
	let filtered = allAttractions.value;

	if (selectedCity.value) {
		filtered = filtered.filter((attraction) => attraction.cities?.some((city) => city.id == selectedCity.value));
	}

	if (selectedPlace.value) {
		filtered = filtered.filter((attraction) => attraction.place === selectedPlace.value);
	}

	if (selectedCategory.value) {
		filtered = filtered.filter((attraction) =>
			attraction.categories?.some((category) => category.id === selectedCategory.value)
		);
	}

	if (priceFilter.value) {
		filtered = filtered.filter(isItemInPriceRange);
	}

	return filtered;
});

const getCities = async () => {
	const res = await cityStore.getListHotelCityAction({
		limit: 100,
	});
	cityList.value = res.data;
};

const destinations = ref([]);
const getDestinations = async () => {
	try {
		const params = {
			limit: 1000,
			mapping: true,
		};
		const response = await destinationStore.getListAction(params);
		if (response.status === 1 && response.result?.data) {
			destinations.value = response.result.data;
			updateMapMarkers();
		}
	} catch (error) {
		console.error("Error fetching destinations:", error);
	}
};

const getPlaceList = computed(() => {
	if (!selectedCity.value || !cityList.value.length) {
		return [];
	}

	const city = cityList.value.find((c) => c.id == selectedCity.value);

	if (city?.places) {
		if (typeof city.places === "object" && !Array.isArray(city.places)) {
			return Object.entries(city.places).map(([id, name]) => ({
				id,
				name,
			}));
		}
		return city.places;
	}

	return [];
});

const getCityName = (cityId) => {
	const city = cityList.value.find((c) => c.id == cityId);
	return city ? city.name : "All cities";
};

const toggleList = () => {
	showList.value = !showList.value;
};

const setCardRef = (el, type, id) => {
	if (el) {
		cardRefs.value[`${type}-${id}`] = el;
	}
};

const scrollToItem = (type, id) => {
	const itemKey = `${type}-${id}`;

	if (!showList.value) {
		showList.value = true;
	}

	selectedItemId.value = itemKey;

	const item =
		type === "hotel"
			? filteredHotels.value.find((h) => h.id === id)
			: filteredAttractions.value.find((a) => a.id === id);

	if (item && item.latitude && item.longitude && map) {
		map.setView([parseFloat(item.latitude), parseFloat(item.longitude)], 17, {
			animate: true,
			duration: 1,
		});
	}

	nextTick(() => {
		const allMarkers = document.querySelectorAll(".price-badge, .attraction-badge");
		allMarkers.forEach((marker) => {
			marker.classList.remove("active");
		});

		const activeMarker = document.querySelector(
			`.${type === "hotel" ? "price-badge" : "attraction-badge"}[data-${type}-id="${id}"]`
		);
		if (activeMarker) {
			activeMarker.classList.add("active");
		}

		setTimeout(() => {
			const card = cardRefs.value[itemKey];
			if (card && listContainer.value) {
				const containerRect = listContainer.value.getBoundingClientRect();
				const cardRect = card.getBoundingClientRect();
				const scrollLeft = card.offsetLeft - containerRect.width / 2 + cardRect.width / 2;

				listContainer.value.scrollTo({
					left: scrollLeft,
					behavior: "smooth",
				});
			}
		}, 100);
	});
};

const getMapList = async () => {
	try {
		loading.value = true;
		const res = await hotelStore.getMapListAction();

		if (res.result == 1) {
			allHotels.value = res.data;
			initializeMap();
		}
	} catch (error) {
		console.error("Error fetching hotels:", error);
	} finally {
		loading.value = false;
	}
};

const getAttractionList = async () => {
	try {
		loading.value = true;
		const res = await entranceStore.getSimpleListAction({
			have_latlong: true,
			show_only: true,
		});

		if (res.status == 1) {
			allAttractions.value = res.result.data;
		}
	} catch (error) {
		console.error("Error fetching attractions:", error);
	} finally {
		loading.value = false;
	}
};

const onFilterChange = () => {
	updateMapMarkers();
};

const applyFilters = () => {
	onFilterChange();
	closeFilterModal();
	setTimeout(() => {
		centerMapOnFilteredItems();
	}, 300);
};

const resetFilters = () => {
	selectedCity.value = "";
	selectedPlace.value = "";
	selectedCategory.value = "";
	priceFilter.value = "";
	clearDestination();
	updateMapMarkers();
};

const initializeMap = () => {
	map = L.map("map").setView([13.7563, 100.5018], 6);

	L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: "abcd",
		maxZoom: 20,
	}).addTo(map);

	markerClusterGroup = L.markerClusterGroup({
		maxClusterRadius: 80,
		spiderfyOnMaxZoom: true,
		showCoverageOnHover: false,
		zoomToBoundsOnClick: true,
		disableClusteringAtZoom: 16,

		iconCreateFunction: function (cluster) {
			const childCount = cluster.getChildCount();

			const markers = cluster.getAllChildMarkers();
			let totalPrice = 0;
			let priceCount = 0;

			markers.forEach((marker) => {
				if (marker.options.hotelData && marker.options.hotelData.lowest_room_price) {
					totalPrice += marker.options.hotelData.lowest_room_price;
					priceCount++;
				}
			});

			const avgPrice = priceCount > 0 ? Math.round(totalPrice / priceCount) : 0;
			const formattedPrice = avgPrice > 0 ? `฿${avgPrice.toLocaleString()}` : "";

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
	updateMapMarkers();
};

const updateMapMarkers = () => {
	if (markerClusterGroup) {
		markerClusterGroup.clearLayers();
	}

	const allMarkers = [];

	if (selectPart.value === "all" || selectPart.value === "hotel") {
		filteredHotels.value.forEach((hotel) => {
			if (hotel.latitude && hotel.longitude) {
				const formattedPrice = hotel.lowest_room_price ? `฿${hotel.lowest_room_price.toLocaleString()}` : "N/A";

				const priceIcon = L.divIcon({
					className: "custom-price-marker",
					html: `<div class="price-badge" data-hotel-id="${hotel.id}">${formattedPrice}</div>`,
					iconSize: [90, 40],
					iconAnchor: [45, 20],
					popupAnchor: [0, -20],
				});

				const marker = L.marker([parseFloat(hotel.latitude), parseFloat(hotel.longitude)], {
					icon: priceIcon,
					hotelData: hotel,
					type: "hotel",
				});

				marker.on("click", () => scrollToItem("hotel", hotel.id));
				allMarkers.push(marker);
			}
		});
	}

	if (selectPart.value === "attraction") {
		filteredAttractions.value.forEach((attraction) => {
			if (attraction.latitude && attraction.longitude) {
				const formattedPrice = attraction.lowest_variation_price
					? `฿${attraction.lowest_variation_price.toLocaleString()}`
					: "N/A";

				const attractionIcon = L.divIcon({
					className: "custom-attraction-marker",
					html: `<div class="attraction-badge" data-attraction-id="${attraction.id}">${formattedPrice}</div>`,
					iconSize: [90, 40],
					iconAnchor: [45, 20],
					popupAnchor: [0, -20],
				});

				const marker = L.marker([parseFloat(attraction.latitude), parseFloat(attraction.longitude)], {
					icon: attractionIcon,
					attractionData: attraction,
					type: "attraction",
				});

				marker.on("click", () => scrollToItem("attraction", attraction.id));
				allMarkers.push(marker);
			}
		});
	}

	if (selectPart.value !== "attraction") {
		destinations.value.forEach((destination) => {
			if (destination.latitude && destination.longitude) {
				const isSelected = selectedDestination.value?.id === destination.id;
				const imageUrl = destination.feature_img;

				const destinationIcon = L.divIcon({
					className: "custom-destination-marker",
					html: `
            <div class="destination-pin-container ${isSelected ? "active" : ""}" data-destination-id="${
						destination.id
					}">
              <div class="destination-pin">
                <div class="pin-image-wrapper">
                  <img src="${imageUrl}" alt="${destination.name}" class="pin-image" />
                </div>
                <div class="pin-pointer"></div>
              </div>
            </div>
          `,
					iconSize: [60, 85],
					iconAnchor: [30, 75],
					popupAnchor: [0, -75],
				});

				const marker = L.marker([parseFloat(destination.latitude), parseFloat(destination.longitude)], {
					icon: destinationIcon,
					destinationData: destination,
					type: "destination",
				});

				marker.on("click", () => {
					selectDestination(destination);
					openDestinationPopup(destination);
				});

				allMarkers.push(marker);
			}
		});
	}

	if (markerClusterGroup) {
		markerClusterGroup.addLayers(allMarkers);
	}
};

const openDestinationPopup = (destination) => {
	const nearbyCount = getNearbyHotels(destination).length;

	const popupContent = `
    <div class="destination-popup p-2">
      <div class="flex items-start gap-3">
        <div class="w-20 h-20 flex-shrink-0">
          <img src="${destination.feature_img || "https://via.placeholder.com/80x80?text=Destination"}" 
               alt="${destination.name}" 
               class="w-full h-full object-cover rounded-lg">
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-sm ">${destination.name}</h3>
          <div>
            <p class="text-xs text-gray-600 ">${destination.city?.name || ""}</p>
            <p class="text-xs text-gray-600 ">${destination?.category?.name || ""}</p>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              ${nearbyCount} hotels within 3km
            </span>
          </div>
        </div>
      </div>
    </div>
  `;

	L.popup({
		closeButton: true,
		className: "destination-popup",
	})
		.setLatLng([parseFloat(destination.latitude), parseFloat(destination.longitude)])
		.setContent(popupContent)
		.openOn(map);
};

// Search functionality
const showSearch = ref(false);
const searchQuery = ref("");
const showSearchDropdown = ref(false);
const searchInputRef = ref(null);

const searchResults = computed(() => {
	const query = searchQuery.value.toLowerCase().trim();

	if (!query) {
		return { hotels: [], attractions: [] };
	}

	const hotels =
		selectPart.value === "hotel" || selectPart.value === "all"
			? allHotels.value
					.filter((hotel) => hotel.name.toLowerCase().includes(query) || hotel.place?.toLowerCase().includes(query))
					.slice(0, 20)
			: [];

	const attractions =
		selectPart.value === "attraction" || selectPart.value === "all"
			? allAttractions.value
					.filter(
						(attraction) =>
							attraction.name.toLowerCase().includes(query) ||
							attraction.cities?.some((city) => city.name.toLowerCase().includes(query))
					)
					.slice(0, 20)
			: [];

	return { hotels, attractions };
});

const getCityNameById = (cityId) => {
	const city = cityList.value.find((c) => c.id == cityId);
	return city ? city.name : "Unknown City";
};

const openSearch = () => {
	showSearch.value = true;
	nextTick(() => {
		searchInputRef.value?.focus();
	});
};

const closeSearch = () => {
	showSearch.value = false;
	searchQuery.value = "";
	showSearchDropdown.value = false;
};

const onSearchInput = () => {
	showSearchDropdown.value = searchQuery.value.trim().length > 0;
};

const selectSearchResult = (type, item) => {
	showSearchDropdown.value = false;

	selectedCity.value = "";
	selectedPlace.value = "";
	priceFilter.value = "";
	selectedCategory.value = "";
	clearDestination();

	if (type === "hotel" && item.city_id) {
		selectedCity.value = item.city_id;
	}

	if (type === "attraction" && item.cities?.[0]?.id) {
		selectedCity.value = item.cities[0].id;
	}

	updateMapMarkers();

	setTimeout(() => {
		if (!showList.value) {
			showList.value = true;
		}

		scrollToItem(type, item.id);
		searchQuery.value = "";

		setTimeout(() => {
			showSearch.value = false;
		}, 300);
	}, 300);
};

const handleSearchClickOutside = (event) => {
	if (showSearchDropdown.value && !event.target.closest(".absolute.right-3")) {
		showSearchDropdown.value = false;
	}
};

// Watch functions
watch(selectPart, () => {
	router.push({
		query: {
			selectPart: selectPart.value,
		},
	});
	if (selectPart.value !== "attraction") {
		selectedCategory.value = "";
	}
	updateMapMarkers();
	setTimeout(() => {
		centerMapOnFilteredItems();
	}, 300);
});

watch([selectedCity, selectedPlace, priceFilter, selectedCategory], () => {
	if (selectedCity.value || selectedPlace.value || priceFilter.value || selectedCategory.value) {
		centerMapOnFilteredItems();
	}
});

const centerMapOnFilteredItems = () => {
	if (!map) return;

	let validCoordinates = [];

	if (selectPart.value === "hotel") {
		const hotelCoords = filteredHotels.value
			.filter((hotel) => hotel.latitude && hotel.longitude)
			.map((hotel) => [parseFloat(hotel.latitude), parseFloat(hotel.longitude)]);
		validCoordinates = [...validCoordinates, ...hotelCoords];
	}

	if (selectPart.value === "attraction") {
		const attractionCoords = filteredAttractions.value
			.filter((attraction) => attraction.latitude && attraction.longitude)
			.map((attraction) => [parseFloat(attraction.latitude), parseFloat(attraction.longitude)]);
		validCoordinates = [...validCoordinates, ...attractionCoords];
	}

	if (validCoordinates.length === 0) return;

	if (validCoordinates.length === 1) {
		map.setView(validCoordinates[0], 14, {
			animate: true,
			duration: 1,
		});
	} else {
		const bounds = L.latLngBounds(validCoordinates);
		map.fitBounds(bounds, {
			padding: [100, 100],
			animate: true,
			duration: 1,
		});
	}
};

// Modal functions
const hotelModalOpen = ref(false);
const hotelDetailId = ref(null);
const getViewDetail = async (hotelId) => {
	hotelDetailId.value = hotelId;
	hotelModalOpen.value = true;
};

const hotelAvailableModalOpen = ref(false);
const getAvailableRooms = async (hotelId) => {
	hotelDetailId.value = hotelId;
	hotelAvailableModalOpen.value = true;
};

const closeHotelModal = () => {
	hotelModalOpen.value = false;
	hotelAvailableModalOpen.value = false;
	hotelDetailId.value = null;
};

const attractionModalOpen = ref(false);
const attractionDetailId = ref(null);
const viewAttractionDetail = (attractionId) => {
	attractionDetailId.value = attractionId;
	attractionModalOpen.value = true;
	scrollToItem("attraction", attractionId);
};

const attractionAvailableModalOpen = ref(false);
const viewAvailableTicket = (attractionId) => {
	attractionDetailId.value = attractionId;
	attractionAvailableModalOpen.value = true;
	scrollToItem("attraction", attractionId);
};

const closeAttractionModal = () => {
	attractionModalOpen.value = false;
	attractionDetailId.value = null;
	attractionAvailableModalOpen.value = false;
};

onMounted(async () => {
	if (route.query.selectPart) {
		selectPart.value = route.query.selectPart;
	}

	document.body.style.overflow = "hidden";
	document.documentElement.style.overflow = "hidden";
	document.addEventListener("click", handleClickOutside);
	document.addEventListener("click", handleSearchClickOutside);

	await getCities();
	await getDestinations();
	await getMapList();
	await getAttractionList();

	setCity(selectedCity.value || 2);
	initializeMap();
});

onUnmounted(() => {
	document.body.style.overflow = "";
	document.documentElement.style.overflow = "";
	document.removeEventListener("click", handleClickOutside);
	document.removeEventListener("click", handleSearchClickOutside);
});
</script>

<style scoped>
:deep(.custom-destination-marker) {
	background: none;
	border: none;
}

:deep(.destination-pin-container) {
	display: flex;
	flex-direction: column;
	align-items: center;
	cursor: pointer;
	transition: all 0.3s ease;
}

:deep(.destination-pin) {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25));
	transition: all 0.3s ease;
}

:deep(.pin-image-wrapper) {
	width: 50px;
	height: 50px;
	border-radius: 50%;
	overflow: hidden;
	border: 3px solid #ffffff;
	background: #ffffff;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	transition: all 0.3s ease;
}

:deep(.pin-image) {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

:deep(.pin-pointer) {
	width: 0;
	height: 0;
	border-left: 10px solid transparent;
	border-right: 10px solid transparent;
	border-top: 15px solid #ffffff;
	margin-top: -2px;
	filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
}

/* Hover effect */
:deep(.destination-pin-container:hover .destination-pin) {
	transform: translateY(-5px) scale(1.1);
}

:deep(.destination-pin-container:hover .pin-image-wrapper) {
	border-color: #4299e1;
	box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

/* Active state */
:deep(.destination-pin-container.active .destination-pin) {
	transform: translateY(-5px) scale(1.15);
}

:deep(.destination-pin-container.active .pin-image-wrapper) {
	border-color: #4299e1;
	border-width: 4px;
	box-shadow: 0 4px 16px rgba(66, 153, 225, 0.5);
}

:deep(.destination-pin-container.active .pin-pointer) {
	border-top-color: #4299e1;
}

@keyframes pinDrop {
	0% {
		transform: translateY(-100px);
		opacity: 0;
	}

	50% {
		transform: translateY(10px);
	}

	100% {
		transform: translateY(0);
		opacity: 1;
	}
}

:deep(.destination-pin-container) {
	animation: pinDrop 0.6s ease-out;
}

/* Popup styles */
:deep(.destination-popup .leaflet-popup-content-wrapper) {
	border-radius: 12px;
	padding: 0;
}

:deep(.destination-popup .leaflet-popup-content) {
	margin: 0;
	width: 250px !important;
}

:deep(.cluster-marker-new) {
	background: #ffffff;
	border-radius: 24px;
	padding: 8px 16px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	cursor: pointer;
	transition: all 0.2s ease;
	border: 2px solid #ffffff;
	white-space: nowrap;
	min-width: 100px;
	max-width: 100%;
	display: inline-block;
}

:deep(.cluster-content) {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 2px;
	color: #000000;
	font-weight: 600;
	font-size: 11px;
	line-height: 1.3;
	text-align: center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.scrollbar-hide {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
	display: none;
}

.scroll-smooth {
	scroll-behavior: smooth;
}

.line-clamp-1 {
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

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
	background: #f97316 !important;
	color: white !important;
	border-color: #f97316 !important;
	transform: scale(1.1);
	box-shadow: 0 4px 16px rgba(249, 115, 22, 0.6);
}

:deep(.custom-attraction-marker) {
	background: none;
	border: none;
}

:deep(.attraction-badge) {
	background: #ffffff;
	color: black;
	padding: 6px 12px;
	border-radius: 20px;
	font-weight: 600;
	font-size: 13px;
	white-space: nowrap;
	box-shadow: 0 2px 8px rgba(147, 51, 234, 0.4);
	cursor: pointer;
	transition: all 0.2s ease;
	border: 0.5px solid #9333ea;
}

:deep(.attraction-badge:hover) {
	background: #ffffff;
	transform: scale(1.05);
	box-shadow: 0 4px 12px rgba(147, 51, 234, 0.6);
}

:deep(.attraction-badge.active) {
	background: #9333ea !important;
	color: white !important;
	border-color: #9333ea !important;
	transform: scale(1.1);
	box-shadow: 0 4px 16px rgba(147, 51, 234, 0.6);
}

:deep(.custom-cluster-icon) {
	background: none;
	border: none;
}

:deep(.cluster-marker-new:hover) {
	transform: scale(1.05);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.scroll-container-y {
	scrollbar-width: thin;
	scrollbar-color: #e5e7eb #f9fafb;
}

.scroll-container-y::-webkit-scrollbar {
	width: 6px;
}

.scroll-container-y::-webkit-scrollbar-track {
	background: #f9fafb;
	border-radius: 10px;
}

.scroll-container-y::-webkit-scrollbar-thumb {
	background: #e5e7eb;
	border-radius: 10px;
}

.scroll-container-y::-webkit-scrollbar-thumb:hover {
	background: #d1d5db;
}

.orange-checkbox {
	border-color: #ff613c;
}

.orange-checkbox:checked {
	background-color: #ff613c;
	border-color: #ff613c;
}

@media (max-width: 640px) {
	.sm\:w-\[calc\(100\%-20px\)\] {
		width: calc(100% - 20px);
	}

	.sm\:p-3 {
		padding: 0.75rem;
	}

	.sm\:rounded-xl {
		border-radius: 0.75rem;
	}

	.sm\:text-\[11px\] {
		font-size: 11px;
	}

	.sm\:scale-90 {
		transform: scale(0.9);
	}

	.sm\:origin-right {
		transform-origin: right;
	}

	.sm\:px-2\.5 {
		padding-left: 0.625rem;
		padding-right: 0.625rem;
	}

	.sm\:py-0\.5 {
		padding-top: 0.125rem;
		padding-bottom: 0.125rem;
	}

	.sm\:text-\[10px\] {
		font-size: 10px;
	}

	.sm\:mb-2 {
		margin-bottom: 0.5rem;
	}

	.sm\:px-3 {
		padding-left: 0.75rem;
		padding-right: 0.75rem;
	}

	.sm\:py-1\.5 {
		padding-top: 0.375rem;
		padding-bottom: 0.375rem;
	}

	.sm\:text-\[9px\] {
		font-size: 9px;
	}

	.sm\:top-4 {
		top: 1rem;
	}

	.sm\:left-4 {
		left: 1rem;
	}

	.sm\:w-10 {
		width: 2.5rem;
	}

	.sm\:h-10 {
		height: 2.5rem;
	}

	.sm\:right-2 {
		right: 0.5rem;
	}

	.sm\:bottom-3 {
		bottom: 0.75rem;
	}

	.sm\:left-2 {
		left: 0.5rem;
	}

	.sm\:right-2 {
		right: 0.5rem;
	}

	.sm\:gap-2 {
		gap: 0.5rem;
	}

	.sm\:w-60 {
		width: 15rem;
	}

	.sm\:h-32 {
		height: 8rem;
	}

	.sm\:p-2 {
		padding: 0.5rem;
	}

	.sm\:text-xs {
		font-size: 0.75rem;
	}

	.sm\:mb-0\.5 {
		margin-bottom: 0.125rem;
	}

	.sm\:text-lg {
		font-size: 1.125rem;
	}

	.sm\:text-sm {
		font-size: 0.875rem;
	}

	.sm\:mt-2 {
		margin-top: 0.5rem;
	}

	.sm\:gap-x-1 {
		column-gap: 0.25rem;
	}

	.sm\:px-1\.5 {
		padding-left: 0.375rem;
		padding-right: 0.375rem;
	}

	.sm\:py-1\.5 {
		padding-top: 0.375rem;
		padding-bottom: 0.375rem;
	}

	.sm\:text-\[11px\] {
		font-size: 11px;
	}

	.sm\:px-3 {
		padding-left: 0.75rem;
		padding-right: 0.75rem;
	}

	.sm\:w-3\.5 {
		width: 0.875rem;
	}

	.sm\:h-3\.5 {
		height: 0.875rem;
	}

	.sm\:mt-1 {
		margin-top: 0.25rem;
	}
}
</style>
