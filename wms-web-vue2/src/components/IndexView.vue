<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <!-- 左边导航栏 -->
    <el-aside :width="aside_width" style="background-color: rgb(238, 241, 246)">
      <AsideView :isCollapse="isCollapse"></AsideView>
    </el-aside>

    <!-- 右边导航 -->
    <el-container>
      <el-header
        style="
          text-align: right;
          font-size: 12px;
          border-bottom: rgba(168, 168, 168, 0.3) 1px solid;
        "
      >
        <HeaderView @doCollapse="doCollapse" :icon="icon"></HeaderView>
      </el-header>

      <!-- 内容 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.el-header {
  background-color: #ffffff;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>

<script>
import AsideView from "./AsideView.vue";
import HeaderView from "./HeaderView.vue";

export default {
  components: {
    AsideView,
    HeaderView,
  },

  data() {
    return {
      isCollapse: false,
      aside_width: "200px",
      icon: "el-icon-s-unfold",
    };
  },
  methods: {
    doCollapse() {
      // 调用HeaderView组件中的方法
      this.isCollapse = !this.isCollapse;
      this.aside_width = this.isCollapse ? "64px" : "200px";
      this.icon = this.isCollapse ? "el-icon-s-fold" : "el-icon-s-unfold";
    },
  },
};
</script>
