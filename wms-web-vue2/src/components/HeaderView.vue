<template>
  <div style="display: flex; line-height: 60px">
    <div>
      <i
        :class="icon"
        style="font-size: 20px; line-height: 60px; cursor: pointer"
        @click="collapse"
      ></i>
    </div>
    <div style="flex: 1; text-align: center; font-size: 34px">
      <span>欢迎来到仓库管理系统</span>
    </div>
    <el-dropdown>
      <span>{{ user.name }}</span>
      <i class="el-icon-arrow-down" style="margin: 5px"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="toUser">个人中心</el-dropdown-item>
        <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("CurUser")),
    };
  },

  methods: {
    collapse() {
      this.$emit("doCollapse");
    },

    toUser() {
      this.$router.push("/Home");
    },
    logout() {
      this.$confirm("您确认要退出吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!",
          });
          sessionStorage.clear();
          this.$router.push("/");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
          });
        });
    },
  },

  props: {
    icon: String,
  },
};
</script>

<style>
</style>