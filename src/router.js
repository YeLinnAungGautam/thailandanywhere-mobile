import { createRouter, createWebHistory } from "vue-router";
import LoginView from "./views/LoginPage.vue";
import HomeView from "./views/Home.vue";
import AnalyticsView from "./views/Analytics.vue";
import ProductView from "./views/Products.vue";
import CusProductView from "./views/CustomerView/Products.vue";
import HotelPageView from "./views/HotelPage.vue";
import RoomPageView from "./views/Room.vue";
import HotelCreatePageView from "./views/HotelCreatePage.vue";
import HotelEditPageView from "./views/HotelEditPage.vue";
import HotelViewPageView from "./views/HotelViewPage.vue";
import RoomCreatePageView from "./views/RoomCreatePage.vue";
import RoomEditPageView from "./views/RoomEditPage.vue";
import SaleListPageView from "./views/SalesList.vue";
import SaleCreatePageView from "./views/SalesCreatePage.vue";
import VantoursPageView from "./views/VantourPage.vue";
import VantoursCreatePageView from "./views/VantourCreatePage.vue";
import VantoursEditPageView from "./views/VantourEditPage.vue";
import AirportPageView from "./views/AirportPage.vue";
import AirportCreateView from "./views/AirportCreatePage.vue";
import AirportEditView from "./views/AirportEditPage.vue";
import GroupTourView from "./views/GrouptourPage.vue";
import GroupTourCreateView from "./views/GrouptourCreatePage.vue";
import GroupTourEditView from "./views/GrouptourEditPage.vue";
import AttractionPageView from "./views/EntrancePage.vue";
import AttractionCreatePageView from "./views/EntranceCreatePage.vue";
import AttractionEditPageView from "./views/EntranceEditPage.vue";
import VariationPageView from "./views/AttractionVariable.vue";
import VariationCreatePageView from "./views/AttractionVariableCreate.vue";
import VariationEditPageView from "./views/AttractionVariableEdit.vue";
import AirlinePageView from "./views/AirLinePage.vue";
import AirlineCreatePageView from "./views/AirLineCreatePage.vue";
import AirlineEditPageView from "./views/AirLineEditPage.vue";
import TicketPageView from "./views/AirlineTicket.vue";
import TicketCreatePageView from "./views/AirTicketCreatePage.vue";
import TicketEditPageView from "./views/AirTicketEditPage.vue";
import VantoursCarListPageView from "./views/VantourCarListPage.vue";
import AirportCarListPageView from "./views/AirportCarListPage.vue";
import CustomerPageView from "./views/CustmerPage.vue";
import CustomerCreatePageView from "./views/CustomerCreatePage.vue";
import CustomerEditPageView from "./views/CustomerEditPage.vue";
import SaleEditPageView from "./views/SalesEditPage.vue";
import InclusivePageView from "./views/InclusivePage.vue";
import ReservationsPageView from "./views/ReservationPage.vue";
import ReservationUpdate from "./views/ReservationEditPage.vue";
import RestaurantPageView from "./views/RestaurantPage.vue";
import RestaurantCreatePageView from "./views/RestaurantCreatePage.vue";
import RestaurantEditPageView from "./views/RestaurantEditPage.vue";
import MealPageView from "./views/MealPage.vue";
import MealCreatePageView from "./views/MealCreatePage.vue";
import MealEditPageView from "./views/MealEditPage.vue";
import VantoursViewPageView from "./views/VantourViewPage.vue";
import RoomViewPageView from "./views/RoomViewPage.vue";
import AttractionViewPageView from "./views/EntranceViewPage.vue";
import AirlineViewPageView from "./views/AirLineViewPage.vue";
import RestaurantViewPageView from "./views/RestaurantViewPage.vue";
import CarSupplierView from "./views/CarSupplierDashboard.vue";
import MapPage from "./views/MapPage.vue";
import Availability from "./views/Availability.vue";
import ChatView from "./views/ChatView.vue";
import { useAuthStore } from "./stores/auth";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: {
      guest: true,
    },
  },
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/car-supplier/dashboard",
    name: "carsupplier",
    component: CarSupplierView,
  },
  {
    path: "/analytics/:page",
    name: "analytics",
    component: AnalyticsView,
  },
  {
    path: "/products",
    name: "products",
    component: ProductView,
  },
  {
    path: "/customer/products/",
    name: "cus-products",
    component: CusProductView,
    meta: {
      guest: true,
    },
  },
  {
    path: "/products/hotels",
    name: "hotels",
    component: HotelPageView,
  },
  {
    path: "/products/hotels/create",
    name: "hotel_create",
    component: HotelCreatePageView,
  },
  {
    path: "/products/hotels/edit/:id",
    name: "hotel_edit",
    component: HotelEditPageView,
  },
  {
    path: "/products/hotels/view/:id",
    name: "hotel_view",
    component: HotelViewPageView,
  },
  {
    path: "/products/hotels/room/:id/:name",
    name: "room",
    component: RoomPageView,
  },
  {
    path: "/products/hotels/room/create",
    name: "room_create",
    component: RoomCreatePageView,
  },
  {
    path: "/products/hotels/room/edit/:id",
    name: "room_edit",
    component: RoomEditPageView,
  },
  {
    path: "/products/hotels/room/view/:id",
    name: "room_view",
    component: RoomViewPageView,
  },
  {
    path: "/sales",
    name: "sales",
    component: SaleListPageView,
  },
  {
    path: "/sales/create",
    name: "sales-create",
    component: SaleCreatePageView,
  },
  {
    path: "/sales/edit/:id",
    name: "sales-edit",
    component: SaleEditPageView,
  },
  {
    path: "/products/vantours",
    name: "vantours",
    component: VantoursPageView,
  },
  {
    path: "/products/vantours/carList/:id",
    name: "vantours-carlist",
    component: VantoursCarListPageView,
  },
  {
    path: "/products/vantours/create",
    name: "vantours-create",
    component: VantoursCreatePageView,
  },
  {
    path: "/products/vantours/edit/:id",
    name: "vantours-edit",
    component: VantoursEditPageView,
  },
  {
    path: "/products/vantours/view/:id",
    name: "vantours-view",
    component: VantoursViewPageView,
  },
  {
    path: "/products/airport",
    name: "airport",
    component: AirportPageView,
  },
  {
    path: "/products/airport/carList/:id",
    name: "airport-carlist",
    component: AirportCarListPageView,
  },
  {
    path: "/products/airport/create",
    name: "airport-create",
    component: AirportCreateView,
  },
  {
    path: "/products/airport/edit/:id",
    name: "airport-edit",
    component: AirportEditView,
  },
  {
    path: "/products/grouptour",
    name: "grouptour",
    component: GroupTourView,
  },
  {
    path: "/products/grouptour/create",
    name: "grouptour-create",
    component: GroupTourCreateView,
  },
  {
    path: "/products/grouptour/edit/:id",
    name: "grouptour-edit",
    component: GroupTourEditView,
  },
  {
    path: "/products/attraction",
    name: "attraction",
    component: AttractionPageView,
  },
  {
    path: "/products/attraction/create",
    name: "attraction-create",
    component: AttractionCreatePageView,
  },
  {
    path: "/products/attraction/edit/:id",
    name: "attraction-edit",
    component: AttractionEditPageView,
  },
  {
    path: "/products/attraction/view/:id",
    name: "attraction-view",
    component: AttractionViewPageView,
  },
  {
    path: "/products/attraction/variations/:id/:name",
    name: "variations",
    component: VariationPageView,
  },
  {
    path: "/products/attraction/variations/create",
    name: "variations-create",
    component: VariationCreatePageView,
  },
  {
    path: "/products/attraction/variations/edit/:id",
    name: "variations-edit",
    component: VariationEditPageView,
  },
  {
    path: "/products/airline",
    name: "airline",
    component: AirlinePageView,
  },
  {
    path: "/products/airline/create",
    name: "airline-create",
    component: AirlineCreatePageView,
  },
  {
    path: "/products/airline/edit/:id",
    name: "airline-edit",
    component: AirlineEditPageView,
  },
  {
    path: "/products/airline/view/:id",
    name: "airline-view",
    component: AirlineViewPageView,
  },
  {
    path: "/products/airline/ticket/:id/:name",
    name: "ticket",
    component: TicketPageView,
  },
  {
    path: "/products/airline/ticket/create",
    name: "ticket-create",
    component: TicketCreatePageView,
  },
  {
    path: "/products/airline/ticket/edit/:id",
    name: "ticket-edit",
    component: TicketEditPageView,
  },
  {
    path: "/customers",
    name: "customer",
    component: CustomerPageView,
  },
  {
    path: "/customers/create",
    name: "customer-create",
    component: CustomerCreatePageView,
  },
  {
    path: "/customers/edit/:id",
    name: "customer-edit",
    component: CustomerEditPageView,
  },
  {
    path: "/products/inclusive",
    name: "inclusive",
    component: InclusivePageView,
  },
  {
    path: "/reservations",
    name: "reservations",
    component: ReservationsPageView,
  },
  {
    path: "/reservation/update/:id",
    name: "reservation-update",
    component: ReservationUpdate,
  },
  {
    path: "/restaurants",
    name: "restaurant",
    component: RestaurantPageView,
  },
  {
    path: "/restaurants/create",
    name: "restaurant-create",
    component: RestaurantCreatePageView,
  },
  {
    path: "/restaurants/edit/:id",
    name: "restaurant-edit",
    component: RestaurantEditPageView,
  },
  {
    path: "/restaurants/view/:id",
    name: "restaurant-view",
    component: RestaurantViewPageView,
  },
  {
    path: "/products/restaurant/meal/:id/:name",
    name: "meal",
    component: MealPageView,
  },
  {
    path: "/products/restaurant/meal/create",
    name: "meal-create",
    component: MealCreatePageView,
  },
  {
    path: "/products/restaurant/meal/edit/:id",
    name: "meal-edit",
    component: MealEditPageView,
  },
  {
    path: "/map-page",
    name: "map-page",
    component: MapPage,
  },
  {
    path: "/availabilities",
    name: "availablities",
    component: Availability,
  },
  {
    path: "/chat",
    name: "chat",
    component: ChatView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem("tokenApp");

  // Allow guest routes
  if (to.meta.guest) {
    return next();
  }

  // If on login page and already has token, redirect to home
  if (to.name === "login" && token) {
    return next("/");
  }

  // Require authentication for protected routes
  if (!token) {
    return next("/login");
  }

  // If user data not loaded yet, try to load it (only once)
  if (!authStore.user && !authStore.token && !token) {
    try {
      await authStore.getMe();
      next();
    } catch (error) {
      console.error("❌ Auth check failed:", error);
      localStorage.removeItem("tokenApp");
      localStorage.removeItem("user");
      next("/login");
    }
  } else {
    // User already loaded, proceed
    next();
  }
});

export default router;
