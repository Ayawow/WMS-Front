<template>
  <div>
    <!-- 查询 -->
    <div style="margin-bottom: 5px">
      <el-input
        v-model="name"
        placeholder="请输入分类名"
        style="width: 200px"
        suffix-icon="el-icon-search"
        @keyup.enter.native="postTableData"
      ></el-input>

      <el-button style="margin-left: 5px" type="primary" @click="postTableData"
        >查询</el-button
      >
      <el-button @click="ReInput" type="success">重置</el-button>
      <el-button type="primary" @click="add">新增</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{ background: '#f2f5fc', color: '#333' }"
      border
    >
      <el-table-column prop="id" label="ID" width="60"> </el-table-column>
      <el-table-column prop="name" label="分类名" width="180">
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="80"> </el-table-column>

      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="mod(scope.row)"
            >编辑</el-button
          >
          <el-popconfirm
            title="确定删除吗？"
            @confirm="del(scope.row.id)"
            style="margin-left: 5px"
          >
            <el-button slot="reference" size="small" type="danger"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
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

    <!-- 弹出框 -->
    <el-dialog title="新增" :visible.sync="dialogVisible" width="30%">
      <el-form :rules="rules" ref="form" :model="form" label-width="80px">
        <el-form-item prop="name" label="分类名">
          <el-col :span="20">
            <el-input v-model="form.name" id="name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-col :span="20">
            <el-input
              type="textarea"
              v-model="form.remark"
              id="remark"
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      pageNum: 1,
      pageSize: 6,
      total: 0,
      name: "",

      dialogVisible: false,
      form: {
        id: "",
        name: "",
        remark: "",
      },

      rules: {
        name: [
          { required: true, message: "请输入分类名", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    // this.getTableData();
    this.postTableData();
  },
  methods: {
    //获取分页数据
    postTableData() {
      this.$axios
        .post(this.$httpUrl + "/goodstype/list", {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          param: {
            name: this.name,
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

    add() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.restForm();

        this.form.id = "";
      });
    },

    doMod() {
      this.$axios
        .post(this.$httpUrl + "/goodstype/update", this.form)
        .then((res) => {
          if (res.data.code === 200) {
            this.dialogVisible = false;
            this.postTableData();
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.restForm();
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },

    doSave() {
      this.$axios
        .post(this.$httpUrl + "/goodstype/save", this.form)
        .then((res) => {
          if (res.data.code === 200) {
            this.dialogVisible = false;
            this.postTableData();
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.restForm();
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },

    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.doMod();
          } else {
            this.doSave();
          }
        } else {
          return false;
        }
      });
    },

    //编辑
    mod(row) {
      this.dialogVisible = true;
      this.form = { ...this.row, ...row };
    },

    // 删除`
    del(id) {
      this.$axios
        .delete(this.$httpUrl + "/goodstype/delete?id=" + id)
        .then((res) => {
          if (res.data.code === 200) {
            this.postTableData();
            this.$message({
              message: "删除成功",
              type: "success",
            });
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
  },
};
</script>

<style>
</style>