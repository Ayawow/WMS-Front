<template>
  <div>
    <!-- 查询 -->
    <div style="margin-bottom: 5px">
      <el-input
        v-model="name"
        placeholder="请输入物品名"
        style="width: 200px"
        suffix-icon="el-icon-search"
        @keyup.enter.native="postTableData"
      ></el-input>
      <el-select v-model="storage" placeholder="请选择仓库">
        <el-option
          v-for="item in storageData"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>

      <el-select v-model="goodstype" placeholder="请选择分类">
        <el-option
          v-for="item in goodstypeData"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>

      <el-button style="margin-left: 5px" type="primary" @click="postTableData"
        >查询</el-button
      >
      <el-button @click="ReInput" type="success">重置</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{ background: '#f2f5fc', color: '#333' }"
      border
    >
      <el-table-column prop="id" label="ID" width="80"> </el-table-column>
      <el-table-column prop="goodsname" label="物品名" width="180">
      </el-table-column>
      <el-table-column prop="storagename" label="仓库名" width="180">
      </el-table-column>
      <el-table-column prop="goodstypename" label="分类名" width="180">
      </el-table-column>
      <el-table-column prop="adminname" label="操作人" width="120">
      </el-table-column>
      <el-table-column prop="username" label="申请人" width="120">
      </el-table-column>
      <el-table-column prop="count" label="数量" width="80"> </el-table-column>

      <el-table-column prop="createtime" label="操作时间" width="180">
      </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("CurUser")),
      goodstypeData: [],
      storageData: [],
      tableData: [],
      pageNum: 1,
      pageSize: 6,
      total: 0,
      name: "",
      storage: "",
      goodstype: "",

      dialogVisible: false,
      form: {
        id: "",
        name: "",
        remark: "",
        storage: "",
        goodstype: "",
        count: "",
      },
    };
  },
  mounted() {
    this.loadStorage();
    this.loadGoodstype();
    this.postTableData();
  },
  methods: {
    //获取分页数据
    postTableData() {
      this.$axios
        .post(this.$httpUrl + "/record/list", {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          param: {
            name: this.name,
            storage: this.storage + "",
            goodstype: this.goodstype + "",
            roleId: this.user.roleId + "",
            userId: this.user.id + "",
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.tableData = res.data.data;
            this.total = res.data.total;
          } else {
            alert(res.data.msg);
          }
        });
    },

    // 重置搜索
    ReInput() {
      this.name = "";
      this.storage = "";
      this.goodstype = "";
      this.postTableData();
    },

    // 分页
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.postTableData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.postTableData();
    },

    //新增

    restForm() {
      this.$refs.form.resetFields();
    },

    //获取仓库名
    loadStorage() {
      this.$axios
        .get(this.$httpUrl + "/storage/ls")
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 200) {
            this.storageData = res.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    formatStorage(row) {
      let temp = this.storageData.find((item) => {
        return item.id == row.storage;
      });

      return temp && temp.name;
    },

    //获取分类名
    loadGoodstype() {
      this.$axios
        .get(this.$httpUrl + "/goodstype/ls")
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 200) {
            this.goodstypeData = res.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    formatGoodstype(row) {
      let temp = this.goodstypeData.find((item) => {
        return item.id == row.goodstype;
      });

      return temp && temp.name;
    },
  },
};
</script>

<style>
</style>