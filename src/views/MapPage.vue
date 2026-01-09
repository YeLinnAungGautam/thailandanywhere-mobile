<template>
	<div class="relative w-full h-screen">
		<div class="fixed inset-0 w-full h-full overscroll-none">
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
							{{ selectedDestination ? ` · ${selectedDestination.name}` : "" }}
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

			<!-- Main Filter Modal -->
			<Modal :isOpen="showFilterModal" :marginTop="'mt-0'" @closeModal="closeFilterModal">
				<DialogPanel class="filter-modal-container w-screen h-screen fixed inset-0 z-50">
					<!-- Header -->
					<div class="filter-modal-header">
						<div class="filter-header-content">
							<button @click="closeFilterModal" class="filter-close-button">
								<svg class="filter-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
							<div class="">
								<h2 class="filter-title">Search & Filter</h2>
								<p class="filter-subtitle">Choose your preferences</p>
							</div>
						</div>

						<!-- Type Selection -->
						<div class="dropdown-type-container">
							<div class="dropdown-type-wrapper" @click="toggleTypeDropdown">
								<div class="dropdown-type-selected">
									<svg
										v-if="selectPart === 'hotel'"
										class="dropdown-type-icon"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
										/>
									</svg>
									<svg v-else class="dropdown-type-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
									<span>{{ selectPart === "hotel" ? "Hotels" : "Attractions" }}</span>
								</div>
								<!-- Dropdown arrow disappears when selected text is large enough (display none currently) -->
								<!-- <svg
									class="dropdown-type-arrow"
									:class="showTypeDropdown ? 'rotate-180' : ''"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg> -->
							</div>

							<div v-if="showTypeDropdown" class="dropdown-type-options">
								<button
									@click="selectType('hotel')"
									:class="[
										'flex px-4 py-2 text-sm text-start items-center w-full',
										selectPart === 'hotel' ? 'dropdown-type-option-active' : '',
									]"
								>
									<svg class="dropdown-type-option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
										/>
									</svg>
									Hotels
									<!-- <svg v-if="selectPart === 'hotel'" class="dropdown-type-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
									</svg> -->
								</button>
								<button
									@click="selectType('attraction')"
									:class="['flex px-4 py-2 text-sm text-start items-center w-full', selectPart === 'attraction' ? 'dropdown-type-option-active' : '']"
								>
									<svg class="dropdown-type-option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
									<!-- <svg v-if="selectPart === 'attraction'" class="dropdown-type-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
									</svg> -->
								</button>
							</div>
						</div>
					</div>

					<div class="filter-content">
						<!-- Price Range -->
						<div class="filter-section">
							<div class="filter-section-header">
								<h3 class="filter-section-title">Price Range</h3>
								<div class="filter-section-actions">
									<button v-if="priceFilter" @click="setPriceFilter('')" class="clear-button">Clear</button>
								</div>
							</div>

							<div class="pills-container scrollbar-hide">
								<button
									@click="setPriceFilter('')"
									:class="['pill-button', priceFilter === '' ? 'pill-button-active' : 'pill-button-inactive']"
								>
									All Prices
								</button>

								<button
									@click="setPriceFilter('0-1200')"
									:class="['pill-button', priceFilter === '0-1200' ? 'pill-button-active' : 'pill-button-inactive']"
								>
									Budget
									<span class="price-range-text">&lt; 1,200฿</span>
								</button>

								<button
									@click="setPriceFilter('1200-1800')"
									:class="['pill-button', priceFilter === '1200-1800' ? 'pill-button-active' : 'pill-button-inactive']"
								>
									Standard
									<span class="price-range-text">1,200-1,800฿</span>
								</button>

								<button
									@click="setPriceFilter('1800-3000')"
									:class="['pill-button', priceFilter === '1800-3000' ? 'pill-button-active' : 'pill-button-inactive']"
								>
									Premium
									<span class="price-range-text">1,800-3,000฿</span>
								</button>

								<button
									@click="setPriceFilter('3000-100000')"
									:class="[
										'pill-button',
										priceFilter === '3000-100000' ? 'pill-button-active' : 'pill-button-inactive',
									]"
								>
									Luxury
									<span class="price-range-text">&gt; 3,000฿</span>
								</button>
							</div>
						</div>

						<!-- City Selection -->
						<div class="filter-section">
							<div class="filter-section-header">
								<h3 class="filter-section-title">Choose City</h3>
								<div class="filter-section-actions">
									<button v-if="visibleCities.length > 3" @click="openFullScreenModal('city')" class="see-more-button">
										See more
									</button>
									<button v-if="selectedCity" @click="selectCity('')" class="clear-button">Clear</button>
								</div>
							</div>

							<div class="pills-container scrollbar-hide">
								<!-- All Cities -->
								<button
									@click="selectCity('')"
									:class="['pill-button', selectedCity === '' ? 'pill-button-active' : 'pill-button-inactive']"
								>
									All Cities
								</button>

								<!-- First 3 Cities -->
								<button
									v-for="city in visibleCities.slice(0, 3)"
									:key="city.id"
									@click="selectCity(city.id)"
									:class="['pill-button', selectedCity === city.id ? 'pill-button-active' : 'pill-button-inactive']"
								>
									{{ city.name }}
								</button>
							</div>
						</div>

						<!-- Place Selection  -->
						<div v-if="selectPart === 'hotel' && selectedCity" class="filter-section">
							<div class="filter-section-header">
								<h3 class="filter-section-title">Choose Place</h3>
								<div class="filter-section-actions">
									<button
										v-if="getPlaceListForCurrentCity.length > 3"
										@click="openFullScreenModal('place')"
										class="see-more-button"
									>
										See more
									</button>
									<button v-if="selectedPlace" @click="selectPlace('')" class="clear-button">Clear</button>
								</div>
							</div>

							<div class="pills-container scrollbar-hide">
								<!-- All Places -->
								<button
									@click="selectPlace('')"
									:class="['pill-button', selectedPlace === '' ? 'pill-button-active' : 'pill-button-inactive']"
								>
									All Places
								</button>

								<!-- First 3 Places  -->
								<button
									v-for="place in getPlaceListForCurrentCity.slice(0, 3)"
									:key="place.id"
									@click="selectPlace(place.name)"
									:class="['pill-button', selectedPlace === place.name ? 'pill-button-active' : 'pill-button-inactive']"
								>
									{{ place.name }}
								</button>
							</div>
						</div>

						<!-- Destination Selection -->
						<div v-if="selectPart === 'hotel' && visibleDestinations.length > 0" class="filter-section">
							<div class="filter-section-header">
								<h3 class="filter-section-title">Choose Destination</h3>
								<div class="filter-section-actions">
									<button
										v-if="visibleDestinations.length > 2"
										@click="openFullScreenModal('destination')"
										class="see-more-button"
									>
										See more
									</button>
									<button v-if="selectedDestination" @click="clearDestination" class="clear-button">Clear</button>
								</div>
							</div>

							<div class="pills-container scrollbar-hide">
								<!-- All Destinations -->
								<button
									@click="clearDestination"
									:class="['pill-button', !selectedDestination ? 'pill-button-active' : 'pill-button-inactive']"
								>
									All Destinations
								</button>

								<!-- First 3 Destinations -->
								<button
									v-for="destination in visibleDestinations.slice(0, 3)"
									:key="destination.id"
									@click="selectDestination(destination)"
									:class="[
										'pill-button',
										selectedDestination?.id === destination.id ? 'pill-button-active' : 'pill-button-inactive',
									]"
								>
									{{ destination.name }}
								</button>
							</div>
						</div>

						<!-- Category Selection  -->
						<div v-if="selectPart === 'attraction' && attractionCategories.length > 0" class="filter-section">
							<div class="filter-section-header">
								<h3 class="filter-section-title">Choose Category</h3>
								<div class="filter-section-actions">
									<button
										v-if="visibleCategories.length > 3"
										@click="openFullScreenModal('category')"
										class="see-more-button"
									>
										See more
									</button>
									<button v-if="selectedCategory" @click="selectCategory('')" class="clear-button">Clear</button>
								</div>
							</div>

							<div class="pills-container scrollbar-hide">
								<!-- All Categories  -->
								<button
									@click="selectCategory('')"
									:class="['pill-button', selectedCategory === '' ? 'pill-button-active' : 'pill-button-inactive']"
								>
									All Categories
								</button>

								<!-- First 3 Categories -->
								<button
									v-for="category in visibleCategories.slice(0, 3)"
									:key="category.id"
									@click="selectCategory(category.id)"
									:class="[
										'pill-button',
										selectedCategory === category.id ? 'pill-button-active' : 'pill-button-inactive',
									]"
								>
									{{ category.name }}
								</button>
							</div>
						</div>
					</div>

					<!-- Sticky Footer with Apply Filters button -->
					<div class="filter-footer">
						<div class="footer-buttons-container">
							<button @click="resetAllFilters" class="reset-all-button">Reset All</button>
							<button @click="applyFilters" class="apply-filters-button">
								<span>
									Apply Filters
									<span v-if="filteredItemsCount > 0" class="filter-count-badge">
										{{ filteredItemsCount }}
									</span>
								</span>
							</button>
						</div>
					</div>
				</DialogPanel>
			</Modal>

			<!-- Dynamic Full Screen Modal for Cities/Places/Categories/Destinations -->
			<Modal :isOpen="fullScreenModal.open" :marginTop="'mt-0'" @closeModal="closeFullScreenModal">
				<DialogPanel class="full-screen-modal-container w-full h-screen bg-white flex flex-col fixed inset-0 z-50">
					<!-- Header -->
					<div class="full-screen-modal-header">
						<div class="full-screen-header-content">
							<button @click="backToMainFilterModal" class="full-screen-back-button">
								<svg class="full-screen-back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
								</svg>
							</button>
							<div>
								<h2 class="full-screen-title">Select {{ getFullScreenTitle() }}</h2>
								<p class="full-screen-subtitle">{{ getFullScreenSubtitle() }}</p>
							</div>
						</div>

						<!-- Search Input -->
						<div class="full-screen-search-container">
							<input
								v-model="fullScreenModal.searchQuery"
								type="text"
								:placeholder="getSearchPlaceholder()"
								class="full-screen-search-input"
								@input="onFullScreenSearch"
							/>
							<svg class="full-screen-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
					</div>

					<!-- City Filter for Destinations Only -->
					<div
						v-if="fullScreenModal.type === 'destination'"
						class="px-6 py-1 pt-4"
						style="border-bottom: 1px solid rgba(229, 231, 235, 0.8)"
					>
						<div class="pills-container scrollbar-hide">
							<button
								@click="filterDestinationByCity('')"
								:class="['pill-button', destinationCityFilter === '' ? 'pill-button-active' : 'pill-button-inactive']"
							>
								All cities
							</button>
							<button
								v-for="city in cityList.slice(0, 5)"
								:key="city.id"
								@click="filterDestinationByCity(city.id)"
								:class="[
									'pill-button',
									destinationCityFilter === city.id ? 'pill-button-active' : 'pill-button-inactive',
								]"
							>
								{{ city.name }}
							</button>
						</div>
					</div>

					<!-- Main Content -->
					<div class="full-screen-content">
						<div v-if="filteredFullScreenItems.length > 0" class="full-screen-list">
							<!-- All Items Button -->
							<button
								@click="selectFullScreenItem('')"
								:class="[
									'full-screen-item-button',
									fullScreenModal.selected === '' ? 'full-screen-item-active' : 'full-screen-item-inactive',
								]"
							>
								{{ getAllOptionText() }}
								<svg
									v-if="fullScreenModal.selected === ''"
									class="full-screen-check-icon"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
								</svg>
							</button>

							<!-- Items List -->
							<button
								v-for="item in filteredFullScreenItems"
								:key="item.id"
								@click="selectFullScreenItem(item)"
								:class="[
									'full-screen-item-button',
									isFullScreenItemSelected(item) ? 'full-screen-item-active' : 'full-screen-item-inactive',
								]"
							>
								<div v-if="fullScreenModal.type === 'destination'" class="flex items-center gap-3">
									<div class="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden">
										<img
											:src="item.feature_img || 'https://via.placeholder.com/40x40?text=Dest'"
											:alt="item.name"
											class="w-full h-full object-cover"
										/>
									</div>
									<div class="text-left flex-1">
										<div class="font-medium">{{ item.name }}</div>
										<div class="text-xs text-gray-500">{{ item.city?.name || "Unknown City" }}</div>
									</div>
								</div>
								<template v-else>
									{{ item.name }}
								</template>
								<svg
									v-if="isFullScreenItemSelected(item)"
									class="full-screen-check-icon"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
								</svg>
							</button>
						</div>

						<div v-else class="full-screen-empty-state">
							<svg class="full-screen-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<p class="full-screen-empty-text">No results found</p>
							<p class="full-screen-empty-subtext">{{ getEmptyStateSubtext() }}</p>
						</div>
					</div>

					<!-- Sticky Footer for Full Screen Modal -->
					<div class="full-screen-footer">
						<button @click="applyFullScreenSelection" class="full-screen-apply-button">Apply Selection</button>
					</div>
				</DialogPanel>
			</Modal>

			<!-- Detail Modals -->
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

			<!-- Toggle List Button -->
			<button
				@click="toggleList"
				:style="{
					bottom: showList ? '250px' : '100px',
				}"
				:class="showList ? 'rotate-[180deg]' : ''"
				class="toggle-list-button"
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
				<div v-if="showList" class="cards-list-container">
					<div ref="listContainer" class="cards-list">
						<div
							v-for="hotel in filteredHotels"
							v-show="selectPart === 'all' || selectPart === 'hotel'"
							:key="'hotel-' + hotel.id"
							:ref="(el) => setCardRef(el, 'hotel', hotel.id)"
							:data-type="'hotel'"
							:data-id="hotel.id"
							@click="scrollToItem('hotel', hotel.id)"
							:class="[
								'flex-shrink-0 w-72 rounded-lg shadow-md transition-all duration-300 cursor-pointer overflow-hidden relative',
								selectedItemId === 'hotel-' + hotel.id ? 'bg-[#FF613c]' : 'bg-white',
							]"
							style="height: 155px; min-height: 155px"
						>
							<button
								@click.stop="getAvailableRooms(hotel.id)"
								class="absolute top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg z-10"
								:class="selectedItemId === 'hotel-' + hotel.id ? 'bg-white text-[#FF613c]' : 'bg-[#FF613c] text-white'"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="22"
									height="22"
									viewBox="0 0 24 24"
									fill="none"
									:stroke="selectedItemId === 'hotel-' + hotel.id ? '#FF613c' : 'white'"
									stroke-width="3"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<circle cx="11" cy="11" r="8"></circle>
									<path d="m21 21-4.35-4.35"></path>
								</svg>
							</button>

							<div class="flex h-full">
								<div class="relative w-28 h-[155px] flex-shrink-0">
									<img
										:src="hotel.images?.[0]?.image || 'https://via.placeholder.com/300x300?text=No+Image'"
										:alt="hotel.name"
										class="w-full h-full object-cover"
									/>
								</div>

								<div class="flex-1 p-2.5 flex flex-col justify-between">
									<div>
										<div class="flex items-start justify-between mb-0.5">
											<h3
												class="font-semibold text-xs flex-1 mr-2"
												:class="selectedItemId === 'hotel-' + hotel.id ? 'text-white' : 'text-gray-900'"
											>
												{{ truncateText(hotel.name, 13) }}
											</h3>
										</div>

										<div class="flex items-center gap-0.5 mb-0.5">
											<span class="text-[#fbbf24] text-xs">{{ "★".repeat(hotel.rating || 0) }}</span>
										</div>

										<p
											class="text-[9px]"
											:class="selectedItemId === 'hotel-' + hotel.id ? 'text-white' : 'text-gray-900'"
										>
											Starting from
										</p>

										<div class="flex items-start justify-between mt-1">
											<div class="text-right">
												<div
													class="text-lg font-bold"
													:class="selectedItemId === 'hotel-' + hotel.id ? 'text-white' : 'text-gray-900'"
												>
													{{ hotel.lowest_room_price?.toLocaleString() || "999" }}
													<span class="text-sm">฿</span>
												</div>
											</div>
										</div>

										<div class="flex justify-between items-center gap-x-1.5 mt-1">
											<div
												class="flex px-1.5 text-sm mt-1 rounded-full w-full shadow-md justify-center py-3"
												@click="getViewDetail(hotel.id)"
												:class="
													selectedItemId === 'hotel-' + hotel.id
														? 'text-white bg-white/20'
														: 'text-gray-900 bg-gray-300/20'
												"
											>
												Detail
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div
							v-for="attraction in filteredAttractions"
							v-show="selectPart === 'all' || selectPart === 'attraction'"
							:key="'attraction-' + attraction.id"
							:ref="(el) => setCardRef(el, 'attraction', attraction.id)"
							:data-type="'attraction'"
							:data-id="attraction.id"
							@click="scrollToItem('attraction', attraction.id)"
							:class="[
								'flex-shrink-0 w-72 rounded-lg shadow-md transition-all duration-300 cursor-pointer overflow-hidden relative',
								selectedItemId === 'attraction-' + attraction.id ? 'bg-[#9333ea]' : 'bg-white',
							]"
							style="height: 155px; min-height: 155px"
						>
							<button
								@click.stop="viewAvailableTicket(attraction.id)"
								class="absolute top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg z-10"
								:class="
									selectedItemId === 'attraction-' + attraction.id
										? 'bg-white text-[#9333ea]'
										: 'bg-[#9333ea] text-white'
								"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="22"
									height="22"
									viewBox="0 0 24 24"
									fill="none"
									:stroke="selectedItemId === 'attraction-' + attraction.id ? '#9333ea' : 'white'"
									stroke-width="3"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<circle cx="11" cy="11" r="8"></circle>
									<path d="m21 21-4.35-4.35"></path>
								</svg>
							</button>

							<div class="flex h-full">
								<div class="relative w-28 h-[155px] flex-shrink-0">
									<img
										:src="attraction.cover_image || 'https://via.placeholder.com/300x300?text=No+Image'"
										:alt="attraction.name"
										class="w-full h-full object-cover"
									/>
								</div>

								<div class="flex-1 p-2.5 flex flex-col justify-between">
									<div>
										<div class="flex items-start justify-between mb-0.5">
											<h3
												class="font-semibold text-xs flex-1 mr-2"
												:class="selectedItemId === 'attraction-' + attraction.id ? 'text-white' : 'text-gray-900'"
											>
												{{ truncateText(attraction.name, 13) }}
											</h3>
										</div>

										<p
											class="text-[9px] mb-0.5"
											:class="selectedItemId === 'attraction-' + attraction.id ? 'text-white' : 'text-gray-600'"
										>
											{{ attraction.cities?.[0]?.name || "Attraction" }}
										</p>

										<p
											class="text-[9px]"
											:class="selectedItemId === 'attraction-' + attraction.id ? 'text-white' : 'text-gray-900'"
										>
											Starting from
										</p>

										<div class="flex items-start justify-between mt-1">
											<div class="text-right">
												<div
													class="text-lg font-bold"
													:class="selectedItemId === 'attraction-' + attraction.id ? 'text-white' : 'text-gray-900'"
												>
													{{ attraction.lowest_variation_price?.toLocaleString() || "999" }}
													<span class="text-sm">฿</span>
												</div>
											</div>
										</div>

										<div class="flex justify-between items-center gap-x-1.5 mt-1">
											<div
												class="flex px-1.5 text-sm mt-1 rounded-full w-full shadow-md justify-center py-3"
												@click.stop="viewAttractionDetail(attraction.id)"
												:class="
													selectedItemId === 'attraction-' + attraction.id
														? 'text-white bg-white/20'
														: 'text-gray-900 bg-gray-300/20'
												"
											>
												Detail
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</transition>

			<!-- Loading  -->
			<div v-if="loading" class="loading-overlay">
				<div class="loading-spinner"></div>
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
import { useRoute, useRouter } from "vue-router";
import { useDestinationStore } from "../stores/destination";
import { storeToRefs } from "pinia";
import DetailAttraction from "./MapComponent/DetailAttraction.vue";
import { PaperAirplaneIcon } from "@heroicons/vue/24/outline";
import Availabilities from "./MapComponent/hotels/Availabilities.vue";
import AvailabilityTicket from "./MapComponent/attractions/Availabilities.vue";

const hotelStore = useHotelStore();
const entranceStore = useEntranceStore();
const destinationStore = useDestinationStore();
const cityStore = useCityStore();
const router = useRouter();
const route = useRoute();

const loading = ref(false);
const allHotels = ref([]);
const allAttractions = ref([]);
const cityList = ref([]);
const selectedCity = ref("");
const selectedPlace = ref("");
const selectedCategory = ref("");
const priceFilter = ref("");
const showList = ref(true);
const selectedItemId = ref("");
const listContainer = ref(null);
const cardRefs = ref({});
const { dests } = storeToRefs(destinationStore);

const selectPart = ref("hotel");
const showTypeDropdown = ref(false);
const typeSearchQuery = ref("");

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

// Full screen modal
const fullScreenModal = ref({
	open: false,
	type: "",
	title: "",
	searchQuery: "",
	selected: "",
	filteredItems: [],
	items: [],
});

// Destination city filter for full screen modal
const destinationCityFilter = ref("");

// Map variables
let map = null;
let allMarkersLayer = null;

// Destinations data
const destinations = ref([]);

// Get destinations
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

// Filtered destinations
const visibleDestinations = computed(() => {
	if (!selectedCity.value) {
		return destinations.value.slice(0, 10);
	}

	// Filter destinations by selected city
	return destinations.value.filter((dest) => dest.city?.id == selectedCity.value).slice(0, 10);
});

const truncateText = (text, maxLength) => {
	if (!text) return "";
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + "...";
};

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

const visibleCities = computed(() => {
	return cityList.value;
});

const visibleCategories = computed(() => {
	return attractionCategories.value;
});

// Get places only for the selected city
const getPlaceListForCurrentCity = computed(() => {
	if (!selectedCity.value || !cityList.value.length) {
		return [];
	}

	const city = cityList.value.find((c) => c.id == selectedCity.value);
	if (!city) return [];

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

// Filtered items for full screen modal
const filteredFullScreenItems = computed(() => {
	const query = fullScreenModal.value.searchQuery.toLowerCase();
	let items = fullScreenModal.value.items;

	// Apply city filter for destinations
	if (fullScreenModal.value.type === "destination" && destinationCityFilter.value) {
		items = items.filter((item) => item.city?.id == destinationCityFilter.value);
	}

	if (!query) return items;

	return items.filter((item) => item.name.toLowerCase().includes(query));
});

// Helper function to check if item is selected in full screen modal
const isFullScreenItemSelected = (item) => {
	if (fullScreenModal.value.type === "place") {
		return fullScreenModal.value.selected === item.name;
	} else {
		return fullScreenModal.value.selected === item.id;
	}
};

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
			return "Budget (< 1,200฿)";
		case "1200-1800":
			return "Standard (1,200฿ - 1,800฿)";
		case "1800-3000":
			return "Premium (1,800฿ - 3,000฿)";
		case "3000-100000":
			return "Luxury (> 3,000฿)";
		default:
			return "All Prices";
	}
});

// Count of filtered hotels or attractions
const filteredItemsCount = computed(() => {
	if (selectPart.value === "hotel") {
		return filteredHotels.value.length;
	} else if (selectPart.value === "attraction") {
		return filteredAttractions.value.length;
	}
	return 0;
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

const getFullScreenTitle = () => {
	switch (fullScreenModal.value.type) {
		case "city":
			return "Cities";
		case "place":
			return "Places";
		case "category":
			return "Categories";
		case "destination":
			return "Destinations";
		default:
			return "Select";
	}
};

const getFullScreenSubtitle = () => {
	switch (fullScreenModal.value.type) {
		case "city":
			return "Choose city to filter";
		case "place":
			return "Choose place to filter";
		case "category":
			return "Choose category to filter";
		case "destination":
			return "Choose destination to find nearby hotels";
		default:
			return "Select an option";
	}
};

const getSearchPlaceholder = () => {
	switch (fullScreenModal.value.type) {
		case "city":
			return "Search cities...";
		case "place":
			return "Search places...";
		case "category":
			return "Search categories...";
		case "destination":
			return "Search destinations...";
		default:
			return "Search...";
	}
};

const getAllOptionText = () => {
	switch (fullScreenModal.value.type) {
		case "city":
			return "All cities";
		case "place":
			return "All places";
		case "category":
			return "All categories";
		case "destination":
			return "All destinations";
		default:
			return "All";
	}
};

const getEmptyStateSubtext = () => {
	switch (fullScreenModal.value.type) {
		case "destination":
			return "Try a different search term or city filter";
		default:
			return "Try a different search term";
	}
};

const openFilterModal = () => {
	showFilterModal.value = true;
	showTypeDropdown.value = false;
};

const closeFilterModal = () => {
	showFilterModal.value = false;
	showTypeDropdown.value = false;
	typeSearchQuery.value = "";
};

const openFullScreenModal = (type) => {
	let items = [];
	let currentSelection = "";

	if (type === "city") {
		items = cityList.value;
		currentSelection = selectedCity.value;
	} else if (type === "place") {
		items = getPlaceListForCurrentCity.value;
		currentSelection = selectedPlace.value;
	} else if (type === "category") {
		items = attractionCategories.value;
		currentSelection = selectedCategory.value;
	} else if (type === "destination") {
		items = destinations.value;
		currentSelection = selectedDestination.value?.id || "";
		destinationCityFilter.value = selectedCity.value || "";
	}

	fullScreenModal.value = {
		open: true,
		type: type,
		title: getFullScreenTitle(),
		searchQuery: "",
		selected: currentSelection,
		filteredItems: items,
		items: items,
	};
};

const backToMainFilterModal = () => {
	fullScreenModal.value = {
		open: false,
		type: "",
		title: "",
		searchQuery: "",
		selected: "",
		filteredItems: [],
		items: [],
	};
	destinationCityFilter.value = "";
	showFilterModal.value = true;
};

const closeFullScreenModal = () => {
	fullScreenModal.value = {
		open: false,
		type: "",
		title: "",
		searchQuery: "",
		selected: "",
		filteredItems: [],
		items: [],
	};
	destinationCityFilter.value = "";
};

const selectFullScreenItem = (item) => {
	if (item === "" || item === null) {
		fullScreenModal.value.selected = "";
	} else {
		fullScreenModal.value.selected = fullScreenModal.value.type === "place" ? item.name : item.id;
	}
};

const applyFullScreenSelection = async () => {
	if (fullScreenModal.value.type === "city") {
		selectedCity.value = fullScreenModal.value.selected;
		selectedPlace.value = "";
		clearDestination();
	} else if (fullScreenModal.value.type === "place") {
		selectedPlace.value = fullScreenModal.value.selected;
	} else if (fullScreenModal.value.type === "category") {
		selectedCategory.value = fullScreenModal.value.selected;
	} else if (fullScreenModal.value.type === "destination") {
		const selectedDest = destinations.value.find((dest) =>
			fullScreenModal.value.type === "place"
				? dest.name === fullScreenModal.value.selected
				: dest.id === fullScreenModal.value.selected
		);
		selectedDestination.value = selectedDest || null;
	}

	await nextTick();
	updateMapMarkers();
	backToMainFilterModal();

	setTimeout(() => {
		centerMapOnFilteredItems();
	}, 100);
};

const filterDestinationByCity = (cityId) => {
	destinationCityFilter.value = cityId;
};

const toggleTypeDropdown = () => {
	showTypeDropdown.value = !showTypeDropdown.value;
};

const selectType = async (type) => {
	selectPart.value = type;
	showTypeDropdown.value = false;
	typeSearchQuery.value = "";

	if (type !== "attraction") {
		selectedCategory.value = "";
	}

	await nextTick();
	updateMapMarkers();

	setTimeout(() => {
		centerMapOnFilteredItems();
	}, 100);
};

const selectCity = async (cityId) => {
	selectedCity.value = cityId;
	selectedPlace.value = "";
	clearDestination();

	await nextTick();
	updateMapMarkers();

	setTimeout(() => {
		centerMapOnFilteredItems();
	}, 100);
};

const selectPlace = async (placeName) => {
	selectedPlace.value = placeName;

	await nextTick();
	updateMapMarkers();

	setTimeout(() => {
		centerMapOnFilteredItems();
	}, 100);
};

const selectCategory = async (categoryId) => {
	selectedCategory.value = categoryId;

	await nextTick();
	updateMapMarkers();

	setTimeout(() => {
		centerMapOnFilteredItems();
	}, 100);
};

const resetAllFilters = async () => {
	selectedCity.value = "";
	selectedPlace.value = "";
	selectedCategory.value = "";
	priceFilter.value = "";
	clearDestination();

	await nextTick();
	updateMapMarkers();

	setTimeout(() => {
		centerMapOnFilteredItems();
	}, 100);

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

const clearDestination = async () => {
	selectedDestination.value = null;

	await nextTick();
	updateMapMarkers();

	setTimeout(() => {
		centerMapOnFilteredItems();
	}, 100);
};

const setPriceFilter = async (filter) => {
	if (loading.value) return;
	priceFilter.value = filter;

	await nextTick();
	updateMapMarkers();

	setTimeout(() => {
		centerMapOnFilteredItems();
	}, 100);
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

	// Filter by city
	if (selectedCity.value) {
		filtered = filtered.filter((hotel) => hotel.city_id == selectedCity.value);
	}

	// Filter by place
	if (selectedPlace.value) {
		filtered = filtered.filter((hotel) => hotel.place === selectedPlace.value);
	}

	// Filter by price
	if (priceFilter.value) {
		filtered = filtered.filter(isItemInPriceRange);
	}

	return filtered;
});

const filteredAttractions = computed(() => {
	let filtered = allAttractions.value;

	// Filter by city
	if (selectedCity.value) {
		filtered = filtered.filter((attraction) => attraction.cities?.some((city) => city.id == selectedCity.value));
	}

	// Filter by category
	if (selectedCategory.value) {
		filtered = filtered.filter((attraction) =>
			attraction.categories?.some((category) => category.id === selectedCategory.value)
		);
	}

	// Filter by price
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

const initializeMap = () => {
	map = L.map("map").setView([13.7563, 100.5018], 6);

	L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: "abcd",
		maxZoom: 20,
	}).addTo(map);

	allMarkersLayer = L.layerGroup().addTo(map);
	updateMapMarkers();
};

const updateMapMarkers = () => {
	if (allMarkersLayer) {
		allMarkersLayer.clearLayers();
	} else {
		allMarkersLayer = L.layerGroup().addTo(map);
	}

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
				marker.addTo(allMarkersLayer);
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
				marker.addTo(allMarkersLayer);
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

				marker.addTo(allMarkersLayer);
			}
		});
	}
};

const highlightDestinationMarker = (destinationId) => {
	const allDestMarkers = document.querySelectorAll(".destination-pin-container");
	allDestMarkers.forEach((marker) => {
		marker.classList.remove("active");
	});

	const activeDestMarker = document.querySelector(`.destination-pin-container[data-destination-id="${destinationId}"]`);
	if (activeDestMarker) {
		activeDestMarker.classList.add("active");
	}
};

const openDestinationPopup = (destination) => {
	const nearbyCount = getNearbyHotels(destination).length;

	const popupContent = `
		<div class="destination-popup p-4">
			<div class="flex items-start gap-3">
				<div class="w-16 h-16 flex-shrink-0">
					<img src="${destination.feature_img || "https://via.placeholder.com/64x64?text=Dest"}" 
						 alt="${destination.name}" 
						 class="w-full h-full object-cover rounded-lg">
				</div>
				<div class="flex-1 min-w-0">
					<h3 class="font-bold text-sm text-gray-900 mb-1">${destination.name}</h3>
					<p class="text-xs text-gray-600 mb-2">${destination.city?.name || ""}</p>
					<div class="flex items-center gap-2">
						<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
							${nearbyCount} hotels within ${destinationRadius.value}km
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

	await getCities();
	await getDestinations();
	await getMapList();
	await getAttractionList();

	initializeMap();
});

onUnmounted(() => {
	document.body.style.overflow = "";
	document.documentElement.style.overflow = "";
});
</script>

<style scoped>
/* Main Filter Modal Styles */
.filter-modal-container {
	width: 100%;
	min-height: 60vh;
	background-color: white;
	box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.footer-buttons-container {
	display: flex;
	gap: 12px;
	width: 100%;
}

.reset-all-button {
	flex: 1;
	padding: 12px;
	font-size: 14px;
	font-weight: 500;
	color: #6b7280;
	background-color: white;
	border: 1px solid rgba(229, 231, 235, 0.8);
	border-radius: 9999px;
	transition: all 0.2s ease;
	cursor: pointer;
}

.reset-all-button:hover {
	background-color: #f9fafb;
	border-color: rgba(156, 163, 175, 0.8);
}

.apply-filters-button {
	flex: 2;
	padding: 12px;
	font-size: 14px;
	font-weight: 500;
	color: white;
	background-color: #ff613c;
	border-radius: 9999px;
	border: 1px solid #ff613c;
	transition: background-color 0.2s ease;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.apply-filters-button:hover {
	background-color: #ff4d28;
}

.filter-count-badge {
	position: absolute;
	right: 12px;
	background-color: white;
	color: #ff613c;
	font-size: 12px;
	font-weight: 600;
	padding: 2px 8px;
	border-radius: 9999px;
	min-width: 20px;
	text-align: center;
}

.full-screen-apply-button {
	width: 100%;
	padding: 12px;
	font-size: 14px;
	font-weight: 500;
	color: white;
	background-color: #ff613c;
	border-radius: 9999px;
	border: 1px solid #ff613c;
	transition: background-color 0.2s ease;
	cursor: pointer;
}

.full-screen-apply-button:hover {
	background-color: #ff4d28;
}

/* Move the type dropdown to header */
.filter-modal-header {
	position: sticky;
	top: 0;
	z-index: 10;
	background-color: white;
	border-bottom: 1px solid rgba(229, 231, 235, 0.8);
	padding: 16px 24px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
}

.filter-header-content {
	display: flex;
	align-items: center;
	gap: 12px;
	flex: 1;
}

.dropdown-type-container {
	position: relative;
	width: 130px;
}

.filter-close-button {
	color: #9ca3af;
	padding: 4px;
	transition: color 0.2s ease;
	border: 1px solid rgba(229, 231, 235, 0.8);
	border-radius: 8px;
	background: white;
}

.filter-close-button:hover {
	color: #6b7280;
}

.filter-close-icon {
	width: 24px;
	height: 24px;
}

.filter-title {
	font-size: 18px;
	font-weight: 600;
	color: #111827;
	margin: 0;
}

.filter-subtitle {
	font-size: 12px;
	color: #6b7280;
	margin-left: 17px;
}

.filter-content {
	flex: 1;
	overflow-y: auto;
	padding: 24px;
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.filter-section {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.filter-section-header {
	display: flex;
	align-items: center;
	font-weight: 600;
	justify-content: space-between;
}

.filter-section-title {
	font-size: 16px;
	font-weight: 600;
	color: #111827;
	margin: 0;
}

.filter-section-actions {
	display: flex;
	align-items: center;
	gap: 12px;
}

/* Type Dropdown Styles */
.dropdown-type-container {
	position: relative;
}

.dropdown-type-wrapper {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 12px;
	border: 1px solid rgba(229, 231, 235, 0.8);
	border-radius: 12px;
	background-color: white;
	cursor: pointer;
	transition: all 0.2s ease;
	width: 100%;
}

.dropdown-type-wrapper:hover {
	border-color: rgba(156, 163, 175, 0.8);
	background-color: #f9fafb;
}

.dropdown-type-selected {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	font-weight: 500;
	color: #111827;
}

.dropdown-type-icon {
	width: 18px;
	height: 18px;
	color: #6b7280;
}

.dropdown-type-arrow {
	width: 18px;
	height: 18px;
	color: #6b7280;
	transition: transform 0.2s ease;
}

.dropdown-type-options {
	position: absolute;
	top: calc(100% + 4px);
	left: 0;
	right: 0;
	background-color: white;
	border: 1px solid rgba(229, 231, 235, 0.8);
	border-radius: 12px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	z-index: 20;
	overflow: hidden;
}

.dropdown-type-search {
	display: flex;
	align-items: center;
	padding: 2px 16px;
	border-bottom: 1px solid rgba(229, 231, 235, 0.8);
	background-color: white;
}

.dropdown-search-icon {
	width: 20px;
	height: 20px;
	color: #9ca3af;
	margin-right: 8px;
}

.dropdown-search-input {
	flex: 1;
	border: none;
	outline: none;
	font-size: 14px;
	color: #111827;
	background: transparent;
}

.dropdown-search-input::placeholder {
	color: #9ca3af;
}

.dropdown-type-option {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	font-size: 14px;
	font-weight: 500;
	color: #374151;
	background: white;
	border: none;
	width: 100%;
	cursor: pointer;
	transition: all 0.2s ease;
}

.dropdown-type-option:hover {
	background-color: #f9fafb;
}

.dropdown-type-option-active {
	color: #ff613c;
	background-color: rgba(255, 97, 60, 0.1);
}

.dropdown-type-option-active:hover {
	background-color: rgba(255, 97, 60, 0.15);
}

.dropdown-type-option-icon {
	width: 20px;
	height: 20px;
	color: currentColor;
	margin-right: 8px;
}

.dropdown-type-check {
	width: 20px;
	height: 20px;
	color: #ff613c;
	stroke-width: 3;
}

/* Pills Container Styles */
.pills-container {
	display: flex;
	gap: 8px;
	overflow-x: auto;
	padding-bottom: 8px;
}

.pills-container::-webkit-scrollbar {
	height: 4px;
}

.pills-container::-webkit-scrollbar-track {
	background: #f3f4f6;
	border-radius: 2px;
}

.pills-container::-webkit-scrollbar-thumb {
	background: #d1d5db;
	border-radius: 2px;
}

.pill-button {
	flex-shrink: 0;
	padding: 8px 16px;
	font-size: 14px;
	font-weight: 500;
	border-radius: 12px;
	border: 1px solid rgba(229, 231, 235, 0.8);
	transition: all 0.2s ease;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 6px;
	white-space: nowrap;
}

.pill-button-active {
	background-color: rgba(255, 97, 60, 0.1);
	color: #ff613c;
	border-color: #ff613c;
}

.pill-button-inactive {
	background-color: white;
	color: #374151;
}

.pill-button-inactive:hover {
	border-color: rgba(156, 163, 175, 0.8);
	background-color: #f9fafb;
}

.pill-check-icon {
	width: 16px;
	height: 16px;
	stroke-width: 3;
}

/* Price Range Text */
.price-range-text {
	font-size: 11px;
	color: #6b7280;
	margin-left: 4px;
	font-weight: normal;
}

/* Button Styles */
.see-more-button {
	font-size: 12px;
	font-weight: 500;
	color: #6b7280;
	transition: color 0.2s ease;
	background: none;
	border: none;
	padding: 0;
	cursor: pointer;
}

.see-more-button:hover {
	color: #111827;
}

.clear-button {
	font-size: 12px;
	font-weight: 500;
	color: #ff613c;
	transition: color 0.2s ease;
	background: none;
	border: none;
	padding: 0;
	cursor: pointer;
}

.clear-button:hover {
	color: #ff4d28;
}

/* Footer Styles */
.filter-footer {
	position: sticky;
	bottom: 0;
	background-color: white;
	border-top: 1px solid rgba(229, 231, 235, 0.8);
	padding: 16px 24px;
}

/* Full Screen Modal Styles */
.full-screen-modal-container {
	width: 100%;
	height: 100vh;
	background-color: white;
	box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.full-screen-modal-header {
	position: sticky;
	top: 0;
	z-index: 10;
	background-color: white;
	border-bottom: 1px solid rgba(229, 231, 235, 0.8);
	padding: 16px 24px;
}

.full-screen-header-content {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 16px;
}

.full-screen-back-button {
	color: #9ca3af;
	padding: 4px;
	transition: color 0.2s ease;
	border: 1px solid rgba(229, 231, 235, 0.8);
	border-radius: 8px;
	background: white;
}

.full-screen-back-button:hover {
	color: #6b7280;
}

.full-screen-back-icon {
	width: 24px;
	height: 24px;
}

.full-screen-title {
	font-size: 18px;
	font-weight: 600;
	color: #111827;
	margin: 0;
}

.full-screen-subtitle {
	font-size: 12px;
	color: #6b7280;
	margin: 4px 0 0 0;
}

.full-screen-search-container {
	position: relative;
}

.full-screen-search-input {
	width: 100%;
	padding: 12px 16px 12px 40px;
	font-size: 14px;
	border: 1px solid rgba(229, 231, 235, 0.8);
	border-radius: 12px;
	background-color: rgba(255, 255, 255, 0.8);
	outline: none;
	transition: all 0.2s ease;
}

.full-screen-search-input:focus {
	border-color: #ff613c;
	box-shadow: 0 0 0 2px rgba(255, 97, 60, 0.2);
}

.full-screen-search-icon {
	position: absolute;
	left: 12px;
	top: 50%;
	transform: translateY(-50%);
	width: 20px;
	height: 20px;
	color: #9ca3af;
}

.full-screen-content {
	flex: 1;
	overflow-y: auto;
	padding: 18px 24px 80px 24px; /* Extra padding for sticky footer */
}

.full-screen-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.full-screen-item-button {
	width: 100%;
	padding: 16px;
	font-size: 14px;
	font-weight: 500;
	border-radius: 12px;
	border: 1px solid rgba(229, 231, 235, 0.8);
	transition: all 0.2s ease;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: white;
	text-align: left;
}

.full-screen-item-active {
	border-color: #ff613c;
	color: #ff613c;
	background-color: rgba(255, 97, 60, 0.1);
}

.full-screen-item-inactive {
	color: #374151;
}

.full-screen-item-inactive:hover {
	border-color: rgba(156, 163, 175, 0.8);
	background-color: #f9fafb;
}

.full-screen-check-icon {
	width: 20px;
	height: 20px;
	stroke-width: 3;
}

.full-screen-empty-state {
	text-align: center;
	padding: 48px 16px;
	color: #9ca3af;
}

.full-screen-empty-icon {
	width: 64px;
	height: 64px;
	margin: 0 auto 16px;
	color: #e5e7eb;
}

.full-screen-empty-text {
	font-size: 14px;
	font-weight: 500;
	margin: 0 0 4px 0;
	color: #6b7280;
}

.full-screen-empty-subtext {
	font-size: 12px;
	margin: 0;
	color: #9ca3af;
}

/* Full Screen Footer */
.full-screen-footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: white;
	border-top: 1px solid rgba(229, 231, 235, 0.8);
	padding: 16px 24px;
	z-index: 10;
}

/* Toggle List Button */
.toggle-list-button {
	position: absolute;
	right: 12px;
	z-index: 1001;
	width: 48px;
	height: 48px;
	background-color: white;
	border: 1px solid rgba(224, 224, 224, 0.8);
	border-radius: 50%;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
	cursor: pointer;
}

.toggle-list-button:hover {
	background-color: #f9fafb;
	border-color: rgba(209, 213, 219, 0.8);
}

@media (max-width: 640px) {
	.toggle-list-button {
		width: 40px;
		height: 40px;
		right: 8px;
	}
}

.cards-list-container {
	position: absolute;
	left: 16px;
	right: 16px;
	z-index: 999;
	bottom: 0;
	padding-bottom: 20px;
	padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
	pointer-events: none;
	min-height: 155px;
	max-height: none;
	overflow: visible !important;
}

@media (min-width: 768px) {
	.cards-list-container {
		left: 100px;
		right: 20px;
	}
}

@media (max-width: 640px) {
	.cards-list-container {
		bottom: 0;
		padding-bottom: 12px;
		padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
		left: 8px;
		right: 8px;
		height: auto;
		min-height: 155px;
	}
}

.cards-list {
	display: flex;
	gap: 12px;
	overflow-x: auto;
	padding-bottom: 8px;
	pointer-events: auto;
	scrollbar-width: none;
	height: auto;
	min-height: 155px;
	align-items: flex-start;
	-webkit-overflow-scrolling: touch;
	overflow-y: visible;
}

.cards-list::-webkit-scrollbar {
	display: none;
}

.loading-overlay {
	position: absolute;
	inset: 0;
	background-color: rgba(255, 255, 255, 0.8);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2000;
}

.loading-spinner {
	width: 48px;
	height: 48px;
	border: 4px solid rgba(255, 97, 60, 0.2);
	border-top: 4px solid #ff613c;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.scrollbar-hide::-webkit-scrollbar {
	display: none;
}

@supports (padding: max(0px)) {
	.cards-list-container {
		padding-bottom: max(20px, env(safe-area-inset-bottom));
	}
}
/* Safari*/
@supports (-webkit-touch-callout: none) {
	.cards-list-container {
		height: 155px !important;
		max-height: 155px !important;
		padding-bottom: max(12px, env(safe-area-inset-bottom, 12px));
	}

	.cards-list {
		height: 155px !important;
		padding: 4px 0;
	}

	.cards-list > div[style*="height: 155px"] {
		height: 155px !important;
		min-height: 155px !important;
	}

	.cards-list > div > .flex > .relative {
		height: 155px !important;
		min-height: 155px !important;
	}
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
	border: 1px solid rgba(209, 213, 219, 0.8);
}

:deep(.attraction-badge:hover) {
	background: #ffffff;
	transform: scale(1.05);
	box-shadow: 0 4px 12px rgba(147, 51, 234, 0.6);
	border-color: rgba(156, 163, 175, 0.8);
}

:deep(.attraction-badge.active) {
	background: #9333ea !important;
	color: white !important;
	border-color: #9333ea !important;
	transform: scale(1.1);
	box-shadow: 0 4px 16px rgba(147, 51, 234, 0.6);
}

/* Map Marker Styles */
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
	border: 1px solid rgba(229, 231, 235, 0.8);
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

:deep(.destination-pin-container:hover .destination-pin) {
	transform: translateY(-5px) scale(1.1);
}

:deep(.destination-pin-container:hover .pin-image-wrapper) {
	border-color: #4299e1;
	box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

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

:deep(.destination-popup .leaflet-popup-content-wrapper) {
	border-radius: 12px;
	padding: 0;
	border: 1px solid rgba(229, 231, 235, 0.8);
}

:deep(.destination-popup .leaflet-popup-content) {
	margin: 0;
	width: 250px !important;
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
	cursor: pointer;
	transition: all 0.2s ease;
	border: 1px solid rgba(209, 213, 219, 0.8);
}

:deep(.price-badge:hover) {
	background: #ffffff;
	transform: scale(1.05);
	box-shadow: 0 4px 12px rgba(104, 104, 104, 0.6);
	border-color: rgba(156, 163, 175, 0.8);
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

@supports (padding: max(0px)) {
	.cards-list-container {
		padding-bottom: max(12px, env(safe-area-inset-bottom));
	}
}
</style>
