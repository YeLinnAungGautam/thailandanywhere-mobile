import { defineStore } from "pinia";

export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    isShowSidebar: true,
    isReservationShow: false,
    isSideBarDropdownShow: false,
    isTopBarDropdownShow: false,
    isOpenCustomerCreate: false,
    isGroupShow: false,
    isShowSetting: false,
    isShowAccount: false,
    isShowReservation: false,
  }),
  getters: {},
  actions: {
    customSideBar() {
      this.isShowSidebar = false;
    },
    showReservation() {
      this.isReservationShow = true;
    },
    showSidebar() {
      this.isShowSidebar = true;
    },
    hideSidebar() {
      this.isShowSidebar = false;
    },
    showSettingHandle() {
      this.isShowSetting = true;
    },
    toggleShowSetting() {
      this.isShowSetting = !this.isShowSetting;
    },
    toggleSidebar() {
      this.isShowSidebar = !this.isShowSidebar;
    },
    toggleReservation() {
      this.isReservationShow = !this.isReservationShow;
    },
    toggleShowReservation() {
      this.isReservationShow = true;
    },
    toggleSideBarDropdown() {
      this.isSideBarDropdownShow = !this.isSideBarDropdownShow;
    },
    toggleGroup() {
      this.isGroupShow = !this.isGroupShow;
    },
    toggleAccount() {
      this.isShowAccount = !this.isShowAccount;
    },
    toggleTopBarDropdown() {
      this.isTopBarDropdownShow = !this.isTopBarDropdownShow;
    },
    toggleCustomerCreate() {
      this.isOpenCustomerCreate = !this.isOpenCustomerCreate;
    },
  },
});
