<template>
  <el-menu
    text-color="#FFFFFF"
    active-text-color="rgb(97, 191, 246)"
    background-color="#303133"
    style="height: 100vh"
    :collapse="isCollapse"
    :collapse-transition="false"
    router
  >
    <el-menu-item index="/Home">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item
      :index="'/' + item.menuclick"
      v-for="(item, index) in menu"
      :key="index"
    >
      <i :class="item.menuicon"></i>
      <span slot="title">{{ item.menuname }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      // menu: [
      //   {
      //     menuClick: "Admin",
      //     menuName: "管理员管理",
      //     menuIcon: "el-icon-s-custom",
      //   },
      //   {
      //     menuClick: "User",
      //     menuName: "用户管理",
      //     menuIcon: "el-icon-user-solid",
      //   },
      // ],
    };
  },

  computed: {
    menu: {
      get() {
        return this.$store.state.menu;
      },
    },
  },

  props: {
    isCollapse: Boolean,
  },
};
</script>

<style>
.clss {
  color: rgb(97, 191, 246);
}
</style>