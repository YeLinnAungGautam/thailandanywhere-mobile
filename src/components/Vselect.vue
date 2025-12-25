import { watch } from 'vue';
<template>
  <v-select
    :options="filtered"
    :filterable="false"
    class="w-full bg-white"
    v-model="selectedData"
    @open="onOpen"
    @close="onClose"
    @search="onSearch"
    label="name"
    :multiple="isMult ? true : false"
    :clearable="false"
    :reduce="(d) => d.id"
    placeholder="Choose ..."
  >
    <template #list-footer>
      <li v-show="hasNextPage" ref="load" class="loader">
        Loading more options...
      </li>
    </template>
  </v-select>
</template>

<script>
export default {
  name: "InfiniteScroll",
  data: () => ({
    observer: null,
    limit: 10,
    search: "",
    countries: [],
    page: 1,
    selectedData: "",
  }),
  props: {
    data: Object,
    isMult: Boolean,
  },
  computed: {
    filtered() {
      // console.log(this.search);

      // return this.countries?.filter((country) =>
      //   country.name.includes(this.search)
      // );
      if (this.search) {
        this.$emit("searchData", this.search);
        return (this.countries = this.data.data);
      } else {
        return this.countries;
      }
    },

    hasNextPage() {
      if (!this.search) {
        return this.data?.meta.total > this.countries.length;
      } else {
        return false;
      }
    },
  },
  mounted() {
    console.log(this.data, "this is props data");
    if (this.data && this.data.data) {
      // this.countries = this.data.data;
      for (let i = 0; i < this.data?.data.length; i++) {
        this.countries.push(this.data?.data[i]);
      }
      console.log(this.countries, "this is data");
    }

    console.log(this.countries, "this is data");

    this.observer = new IntersectionObserver(this.infiniteScroll, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });
  },
  methods: {
    async onOpen() {
      if (this.hasNextPage) {
        await this.$nextTick();
        this.observer.observe(this.$refs.load);
      }
    },
    onClose() {
      this.observer.disconnect();
    },
    onSearch(query) {
      this.search = query;
      this.$emit("searchData", this.search);
    },
    async infiniteScroll([{ isIntersecting, target }]) {
      if (isIntersecting) {
        this.page += 1;
        const ul = target.offsetParent;
        const scrollTop = target.offsetParent.scrollTop;
        console.log("hello I scroll");
        this.$emit("childData", this.page);
        ul.scrollTop = scrollTop;
      }
    },
  },
  watch: {
    data(newValue, oldValue) {
      if (oldValue && oldValue.data && newValue && newValue.data) {
        if (!this.search || this.search == "") {
          for (let i = 0; i < newValue.data.length; i++) {
            this.countries.push(newValue.data[i]);
          }
        } else {
          this.countries = [];
          for (let i = 0; i < newValue.data.length; i++) {
            this.countries.push(newValue.data[i]);
          }
          console.log(newValue.data, "this is update");
        }
      }
    },
    selectedData(newValue) {
      this.$emit("selected", this.selectedData);
      console.log(this.selectedData, "this is selected");
    },
  },
};
</script>

<style scoped>
.loader {
  text-align: center;
  color: #bbbbbb;
}
</style>
