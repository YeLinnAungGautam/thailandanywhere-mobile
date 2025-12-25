<template>
	<div class="flex flex-col sm:flex-row min-h-[62vh] sm:h-[62vh] bg-white">
		<!--  Navigation Dropdown-->
		<div class="sm:hidden border-gray-200 px-4 py-3 sticky top-0 z-10 bg-white">
			<select v-model="activeSection" @change="scrollToSection(activeSection)"
				class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent">
				<option value="description" v-if="detail?.description || detail?.full_description_en">Description</option>
				<option value="location" v-if="detail?.location_map_title || detail?.place">Location</option>
				<option value="activities" v-if="detail?.activities && detail.activities.length > 0">Activities</option>
				<option value="payment" v-if="detail?.payment_method">Payment Information</option>
				<option value="contract" v-if="detail?.contract_name">Contract Information</option>
			</select>
		</div>

		<div class="hidden sm:block w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
			<div class="p-4">
				<nav>
					<ul class="space-y-1">
						<li v-if="detail?.description || detail?.full_description_en">
							<a href="#description" @click.prevent="setActiveSection('description')" :class="activeSection === 'description' ? 'bg-[#FF613c]/10 text-[#FF613c]' : 'text-gray-700 hover:bg-gray-100'
								" class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer">
								<span class="w-2 h-2 inline-block rounded-full mr-1"
									:class="activeSection === 'description' ? 'bg-[#FF613c]' : 'bg-gray-400'"></span>
								Description
							</a>
						</li>

						<li v-if="detail?.location_map_title || detail?.place">
							<a href="#location" @click.prevent="setActiveSection('location')" :class="activeSection === 'location' ? 'bg-[#FF613c]/10 text-[#FF613c]' : 'text-gray-700 hover:bg-gray-100'
								" class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer">
								<span class="w-2 h-2 inline-block rounded-full mr-1"
									:class="activeSection === 'location' ? 'bg-[#FF613c]' : 'bg-gray-400'"></span>
								Location
							</a>
						</li>

						<li v-if="detail?.activities && detail.activities.length > 0">
							<a href="#activities" @click.prevent="setActiveSection('activities')" :class="activeSection === 'activities' ? 'bg-[#FF613c]/10 text-[#FF613c]' : 'text-gray-700 hover:bg-gray-100'
								" class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer">
								<span class="w-2 h-2 inline-block rounded-full mr-1"
									:class="activeSection === 'activities' ? 'bg-[#FF613c]' : 'bg-gray-400'"></span>
								Activities
							</a>
						</li>

						<li v-if="detail?.payment_method">
							<a href="#payment" @click.prevent="setActiveSection('payment')" :class="activeSection === 'payment' ? 'bg-[#FF613c]/10 text-[#FF613c]' : 'text-gray-700 hover:bg-gray-100'
								" class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer">
								<span class="w-2 h-2 inline-block rounded-full mr-1"
									:class="activeSection === 'payment' ? 'bg-[#FF613c]' : 'bg-gray-400'"></span>
								Payment Information
							</a>
						</li>

						<li v-if="detail?.contract_name">
							<a href="#contract" @click.prevent="setActiveSection('contract')" :class="activeSection === 'contract' ? 'bg-[#FF613c]/10 text-[#FF613c]' : 'text-gray-700 hover:bg-gray-100'
								" class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer">
								<span class="w-2 h-2 inline-block rounded-full mr-1"
									:class="activeSection === 'contract' ? 'bg-[#FF613c]' : 'bg-gray-400'"></span>
								Contract Information
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>

		<!-- Right Content Area -->
		<div class="flex-1 overflow-y-auto">
			<div class="p-4 sm:p-6 max-w-full">
				<!-- Description Section -->
				<section id="description" v-if="detail?.description || detail?.full_description_en"
					class="mb-6 sm:mb-8 scroll-mt-4">
					<div class="flex justify-between items-center mb-3 sm:mb-4">
						<h2 class="text-sm sm:text-base font-semibold text-[#FF613c]">Description</h2>
					</div>
					<div class="space-y-3 text-xs sm:text-sm">
						<div v-if="detail?.full_description_en">
							<div
								class="text-gray-700 bg-gray-50 p-4 sm:p-6 rounded-lg leading-relaxed min-h-[200px] sm:min-h-[300px] overflow-x-auto">
								{{ detail.full_description_en }}
							</div>
						</div>
						<div v-else-if="detail?.description">
							<div
								class="text-gray-700 bg-gray-50 p-4 sm:p-6 rounded-lg leading-relaxed min-h-[200px] sm:min-h-[300px] overflow-x-auto">
								{{ detail.description }}
							</div>
						</div>
					</div>
				</section>

				<!-- Location Section -->
				<section id="location" v-if="detail?.location_map_title || detail?.place" class="mb-6 sm:mb-8 scroll-mt-4">
					<div class="flex justify-between items-center mb-3 sm:mb-4">
						<h2 class="text-sm sm:text-base font-semibold text-[#FF613c]">Location</h2>
					</div>
					<div class="space-y-2 text-xs sm:text-sm">
						<p v-if="detail?.place" class="text-gray-700 p-4 sm:p-6 bg-gray-50 rounded-lg overflow-x-auto">
							{{ detail.place }}
						</p>
						<p v-if="detail?.location_map_title" class="text-gray-600 px-4 sm:px-6 overflow-x-auto">
							{{ detail.location_map_title }}
						</p>
						<div v-if="detail?.latitude && detail?.longitude"
							class="text-gray-600 px-4 sm:px-6 text-xs overflow-x-auto">
							<span class="font-medium">Coordinates:</span>
							{{ detail.latitude }}, {{ detail.longitude }}
						</div>
						<div v-if="detail?.location_map" class="mt-3 sm:mt-4">
							<iframe :src="detail.location_map" class="w-full h-48 sm:h-80 rounded-lg" style="border: 0"
								allowfullscreen="" loading="lazy"></iframe>
						</div>
					</div>
				</section>

				<!-- Activities Section -->
				<section id="activities" v-if="detail?.activities && detail.activities.length > 0"
					class="mb-6 sm:mb-8 scroll-mt-4">
					<div class="flex justify-between items-center mb-3 sm:mb-4">
						<h2 class="text-sm sm:text-base font-semibold text-[#FF613c]">Activities</h2>
					</div>
					<div class="space-y-2 sm:space-y-3 bg-gray-50 p-4 sm:p-6 rounded-lg min-h-[200px] sm:min-h-[300px]">
						<div v-for="(activity, index) in detail.activities" :key="index"
							class="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg bg-white">
							<div class="flex items-center space-x-2 sm:space-x-3">
								<div
									class="w-8 h-8 sm:w-10 sm:h-10 bg-[#FF613c]/10 rounded-full flex items-center justify-center flex-shrink-0">
									<span class="text-[#FF613c] font-semibold text-sm sm:text-base">{{ index + 1 }}</span>
								</div>
								<div class="min-w-0">
									<p class="text-xs sm:text-sm font-medium text-gray-700 truncate">
										{{ activity.name || activity }}
									</p>
									<p v-if="activity.description" class="text-xs text-gray-500 truncate">
										{{ activity.description }}
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- Payment Information Section -->
				<section id="payment" v-if="detail?.payment_method" class="mb-6 sm:mb-8 scroll-mt-4">
					<div class="flex justify-between items-center mb-3 sm:mb-4">
						<h2 class="text-sm sm:text-base font-semibold text-[#FF613c]">Payment Information</h2>
					</div>
					<div class="bg-gray-50 p-4 sm:p-6 rounded-lg min-h-[200px] sm:min-h-[300px]">
						<div class="space-y-3 sm:space-y-4 text-xs sm:text-sm">
							<div
								class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3 sm:pb-4">
								<span class="text-gray-500 font-medium mb-1 sm:mb-0">Payment Method:</span>
								<span class="text-gray-900 font-semibold overflow-x-auto">{{ detail.payment_method }}</span>
							</div>
							<div v-if="detail?.bank_name"
								class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3 sm:pb-4">
								<span class="text-gray-500 font-medium mb-1 sm:mb-0">Bank Name:</span>
								<span class="text-gray-900 overflow-x-auto">{{ detail.bank_name }}</span>
							</div>
							<div v-if="detail?.bank_account_number"
								class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3 sm:pb-4">
								<span class="text-gray-500 font-medium mb-1 sm:mb-0">Account Number:</span>
								<span class="text-gray-900 font-mono overflow-x-auto">{{ detail.bank_account_number }}</span>
							</div>
							<div v-if="detail?.account_name" class="flex flex-col sm:flex-row sm:items-center justify-between">
								<span class="text-gray-500 font-medium mb-1 sm:mb-0">Account Name:</span>
								<span class="text-gray-900 overflow-x-auto">{{ detail.account_name }}</span>
							</div>
						</div>
					</div>
				</section>

				<!-- Contract Information Section -->
				<section id="contract" v-if="detail?.contract_name" class="mb-6 sm:mb-8 scroll-mt-4">
					<div class="flex justify-between items-center mb-3 sm:mb-4">
						<h2 class="text-sm sm:text-base font-semibold text-[#FF613c]">Contract Information</h2>
					</div>
					<div class="bg-gray-50 p-4 sm:p-6 rounded-lg min-h-[200px] sm:min-h-[300px]">
						<div class="space-y-3 sm:space-y-4 text-xs sm:text-sm">
							<div
								class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3 sm:pb-4">
								<span class="text-gray-500 font-medium mb-1 sm:mb-0">Contract Name:</span>
								<span class="text-gray-900 font-semibold overflow-x-auto">{{ detail.contract_name }}</span>
							</div>
							<div v-if="detail?.legal_name"
								class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3 sm:pb-4">
								<span class="text-gray-500 font-medium mb-1 sm:mb-0">Legal Name:</span>
								<span class="text-gray-900 overflow-x-auto">{{ detail.legal_name }}</span>
							</div>
							<div v-if="detail?.vat_name && detail.vat_name !== 'null'"
								class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3 sm:pb-4">
								<span class="text-gray-500 font-medium mb-1 sm:mb-0">VAT Name:</span>
								<span class="text-gray-900 overflow-x-auto">{{ detail.vat_name }}</span>
							</div>
							<div v-if="detail?.vat_id && detail.vat_id !== 'null'"
								class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3 sm:pb-4">
								<span class="text-gray-500 font-medium mb-1 sm:mb-0">VAT ID:</span>
								<span class="text-gray-900 overflow-x-auto">{{ detail.vat_id }}</span>
							</div>
							<div v-if="detail?.vat_address && detail.vat_address !== 'null'"
								class="flex flex-col sm:flex-row sm:items-center justify-between">
								<span class="text-gray-500 font-medium mb-1 sm:mb-0">VAT Address:</span>
								<span class="text-gray-900 overflow-x-auto">{{ detail.vat_address }}</span>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
	detail: {
		type: Object,
		required: true,
	},
});

const activeSection = ref("description");

const setActiveSection = (section) => {
	activeSection.value = section;
};

const scrollToSection = (sectionId) => {
	const section = document.getElementById(sectionId);
	if (section) {
		section.scrollIntoView({ behavior: "smooth" });
	}
};

onMounted(() => {
	const sections = document.querySelectorAll("section[id]");

	if (sections.length === 0) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
					activeSection.value = entry.target.id;
				}
			});
		},
		{
			threshold: 0.5,
			rootMargin: "-50px 0px -50px 0px",
		}
	);

	sections.forEach((section) => {
		observer.observe(section);
	});

	return () => {
		sections.forEach((section) => {
			observer.unobserve(section);
		});
	};
});
</script>

<style scoped>
@media (max-width: 640px) {
	select {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 0.75rem center;
		background-size: 1em;
	}

	.truncate {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.overflow-x-auto {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}
}
</style>
