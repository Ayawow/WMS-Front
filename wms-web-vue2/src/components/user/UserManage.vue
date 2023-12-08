<template>
  <div>
    <!-- 查询 -->
    <div style="margin-bottom: 5px">
      <el-input
        v-model="name"
        placeholder="请输入名称"
        style="width: 200px"
        suffix-icon="el-icon-search"
        @keyup.enter.native="postTableData"
      ></el-input>

      <el-select
        style="margin-left: 5px"
        v-model="sex"
        filterable
        placeholder="请选择性别"
      >
        <el-option
          v-for="item in sexs"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

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
      <el-table-column prop="no" label="账号" width="100"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="age" label="年龄" width="80"> </el-table-column>

      <el-table-column prop="sex" label="性别" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.sex === 1 ? 'primary' : 'success'"
            disable-transitions
            >{{ scope.row.sex === 1 ? "男" : "女" }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column prop="roleId" label="角色" width="120">
        <template slot-scope="scope">
          <el-tag
            :type="
              scope.row.roleId === 0
                ? 'danger'
                : scope.row.roleId === 1
                ? 'primary'
                : 'success'
            "
            disable-transitions
            >{{
              scope.row.roleId === 0
                ? "超级管理员"
                : scope.row.roleId === 1
                ? "管理员"
                : "用户"
            }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="200"> </el-table-column>
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
        <el-form-item prop="no" label="账户">
          <el-col :span="20">
            <el-input v-model="form.no" id="no"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="name" label="姓名">
          <el-col :span="20">
            <el-input v-model="form.name" id="name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-col :span="20">
            <el-input v-model="form.password" id="password"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="age" label="年龄">
          <el-col :span="20">
            <el-input v-model="form.age" id="age"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="phone" label="电话">
          <el-col :span="20">
            <el-input v-model="form.phone" id="phone"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-radio-group v-model="form.sex" id="sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
          </el-radio-group>
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
    let checkAge = (rule, value, callback) => {
      if (value < 18) {
        return callback(new Error("年龄未满18岁"));
      } else {
        callback();
      }
    };

    let checkDuplicate = (rule, value, callback) => {
      if (this.form.id) {
        callback();
      } else {
        this.$axios
          .get(this.$httpUrl + "/user/findByNo?no=" + this.form.no)
          .then((res) => {
            if (res.data.code != 200) {
              callback();
            } else {
              callback(new Error("账号已存在"));
            }
          });
      }
    };

    return {
      tableData: [],
      pageNum: 1,
      pageSize: 4,
      total: 0,
      name: "",
      sex: "",
      sexs: [
        { value: "1", label: "男" },
        { value: "0", label: "女" },
      ],
      dialogVisible: false,
      form: {
        id: "",
        name: "",
        no: "",
        password: "",
        age: "",
        phone: "",
        sex: "1",
        roleId: "2",
      },

      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        no: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 2,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
          { validator: checkDuplicate, trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        age: [
          { required: true, message: "请输入年龄", trigger: "blur" },
          { min: 1, max: 3, message: "长度在 1 到 3 个字符", trigger: "blur" },
          {
            pattern: /^([1-9][0-9]*){1,3}$/,
            message: "年龄必须是正整数",
            trigger: "blur",
          },
          { validator: checkAge, trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9|][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
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
    // 获取表格数据
    // getTableData() {
    //   this.$axios.get(this.$httpUrl + "/user/list").then((res) => {
    //     this.tableData = res.data;
    //   });
    // },
    //获取分页数据
    postTableData() {
      this.$axios
        .post(this.$httpUrl + "/user/listPageC1", {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          param: {
            name: this.name,
            sex: this.sex,
            roleId: "2",
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
      this.sex = "";
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
      });
    },

    doMod() {
      this.$axios
        .post(this.$httpUrl + "/user/update", this.form)
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
      this.$axios.post(this.$httpUrl + "/user/save", this.form).then((res) => {
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
      this.form.sex = row.sex + "";
      this.form.age = row.age + "";
    },

    // 删除`
    del(id) {
      this.$axios
        .delete(this.$httpUrl + "/user/delete?id=" + id)
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