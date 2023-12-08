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
      <el-button type="primary" @click="add" v-if="user.roleId != 2"
        >新增</el-button
      >
      <el-button type="primary" @click="takein" v-if="user.roleId != 2"
        >入库</el-button
      >
      <el-button type="primary" @click="takeout" v-if="user.roleId != 2"
        >出库</el-button
      >
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{ background: '#f2f5fc', color: '#333' }"
      border
      highlight-current-row
      @current-change="selectCurrentChange"
    >
      <el-table-column prop="id" label="ID" width="60"> </el-table-column>
      <el-table-column prop="name" label="物品名" width="180">
      </el-table-column>
      <el-table-column
        prop="storage"
        label="仓库名"
        width="180"
        :formatter="formatStorage"
      >
      </el-table-column>
      <el-table-column
        prop="goodstype"
        label="分类名"
        width="180"
        :formatter="formatGoodstype"
      >
      </el-table-column>
      <el-table-column prop="count" label="数量" width="180"> </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
      <el-table-column prop="operate" label="操作" v-if="user.roleId != 2">
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

    <!-- 新增弹出框 -->
    <el-dialog title="新增" :visible.sync="dialogVisible" width="30%">
      <el-form :rules="rules" ref="form" :model="form" label-width="80px">
        <el-form-item prop="name" label="物品名">
          <el-col :span="20">
            <el-input v-model="form.name" id="name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="storage" label="仓库名">
          <el-col :span="20">
            <el-select v-model="form.storage" placeholder="请选择仓库">
              <el-option
                v-for="item in storageData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item prop="goodstype" label="分类名">
          <el-col :span="20">
            <el-select v-model="form.goodstype" placeholder="请选择分类">
              <el-option
                v-for="item in goodstypeData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item prop="count" label="数量">
          <el-col :span="20">
            <el-input v-model="form.count" id="count"></el-input>
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

    <!-- 入库弹出框 -->
    <el-dialog title="入库" :visible.sync="indialogVisible" width="30%">
      <el-dialog
        title="选择申请人"
        :visible.sync="innerVisible"
        width="70%"
        append-to-body
      >
        <SelectUser @doSelectUser="doSelectUser"> </SelectUser>
        <span slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmUser">确 定</el-button>
        </span>
      </el-dialog>

      <el-form :rules="rulesin" ref="formin" :model="formin" label-width="80px">
        <el-form-item label="物品名">
          <el-col :span="20">
            <el-input v-model="formin.goodsname" id="name" readonly></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="申请人">
          <el-col :span="20">
            <el-input
              v-model="formin.username"
              readonly
              @click.native="selectUser"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="count" label="数量">
          <el-col :span="20">
            <el-input v-model="formin.count" id="count"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-col :span="20">
            <el-input
              type="textarea"
              v-model="formin.remark"
              id="remark"
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="indialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doInGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SelectUser from "../user/SelectUser.vue";

export default {
  components: {
    SelectUser,
  },

  data() {
    let checkCount = (rule, value, callback) => {
      if (value > 9999) {
        return callback(new Error("输入数量过大"));
      } else {
        callback();
      }
    };

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
      indialogVisible: false,
      innerVisible: false,
      form: {
        id: "",
        name: "",
        remark: "",
        storage: "",
        goodstype: "",
        count: "",
      },

      rules: {
        name: [
          { required: true, message: "请输入物品名", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
        count: [
          { required: true, message: "请输入数量", trigger: "blur" },
          { pattern: /^[1-9]\d*$/, message: "请输入正整数", trigger: "blur" },
          { validate: checkCount, trigger: "blur" },
        ],
        storage: [{ required: true, message: "请选择仓库", trigger: "change" }],
        goodstype: [
          { required: true, message: "请选择物品分类", trigger: "change" },
        ],
      },

      formin: {
        goods: "",
        goodsname: "",
        remark: "",
        username: "",
        userid: "",
        adminId: "",
        count: "",
      },
      rulesin: {},
      currentRow: {},
      tempUser: {},
    };
  },
  mounted() {
    this.loadGoodstype();
    this.loadStorage();
    this.postTableData();
  },
  methods: {
    //获取分页数据
    postTableData() {
      this.$axios
        .post(this.$httpUrl + "/goods/list", {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          param: {
            name: this.name,
            storage: this.storage + "",
            goodstype: this.goodstype + "",
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

    restForm() {
      this.$refs.form.resetFields();
    },
    restInForm() {
      this.$refs.formin.resetFields();
    },

    //新增
    add() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.restForm();
        this.form.id = "";
      });
    },
    //入库
    takein() {
      if (!this.currentRow.id) {
        alert("请选择一条数据");
        return;
      }
      this.indialogVisible = true;
      this.$nextTick(() => {
        this.restInForm();
      });

      this.formin.goodsname = this.currentRow.name;
      this.formin.goods = this.currentRow.id;
      this.formin.adminId = this.user.id;
      this.formin.action = "1";
    },

    //出库
    takeout() {
      if (!this.currentRow.id) {
        alert("请选择一条数据");
        return;
      }
      this.indialogVisible = true;
      this.$nextTick(() => {
        this.restInForm();
      });

      this.formin.goodsname = this.currentRow.name;
      this.formin.goods = this.currentRow.id;
      this.formin.adminId = this.user.id;
      this.formin.action = "2";
    },

    doMod() {
      this.$axios
        .post(this.$httpUrl + "/goods/update", this.form)
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
      this.$axios.post(this.$httpUrl + "/goods/save", this.form).then((res) => {
        if (res.data.code === 200) {
          this.dialogVisible = false;
          this.postTableData();
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.restInForm();
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

    doInGoods() {
      this.$axios
        .post(this.$httpUrl + "/record/save", this.formin)
        .then((res) => {
          if (res.data.code === 200) {
            this.indialogVisible = false;
            this.postTableData();
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.restInForm();
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },

    //编辑
    mod(row) {
      this.dialogVisible = true;
      this.form = { ...row };
    },

    // 删除`
    del(id) {
      this.$axios
        .delete(this.$httpUrl + "/goods/delete?id=" + id)
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
    selectCurrentChange(val) {
      this.currentRow = val;
    },

    selectUser() {
      this.innerVisible = true;
    },

    doSelectUser(val) {
      this.tempUser = val;
    },
    confirmUser() {
      this.formin.username = this.tempUser.name;
      this.formin.userid = this.tempUser.id;
      this.innerVisible = false;
    },
  },
};
</script>

<style>
</style>