<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("CurUser")),
    };
  },
  watch: {
    "$store.state.menu": {
      handler(newVal, oldVal) {
        if (!oldVal && this.user && this.user.no) {
          this.$store.commit("setRouter", newVal);
        }
      },
    },
    immediate: true,
  },
  mounted() {
    this.$store.commit("setRouter", this.$store.state.menu);
  },
};
</script>

<style>
</style>
