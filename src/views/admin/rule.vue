<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >Create</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="Name">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Class Name">
        <template slot-scope="{row}">
          <span>{{ row.className }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Actions"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">Update</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="Class Name" prop="className">
          <el-input v-model="temp.className" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import rule from "@/api/admin/rule";

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      tempid: "",
      temp: {
        name: "",
        className: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      rules: {
        name: [
          { required: true, message: "name is required", trigger: "blur" }
        ],
        className: [
          { required: true, message: "Class Name is required", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const { data } = await rule.index();
      this.list = data.rules;
      this.listLoading = false;
    },
    resetTemp() {
      this.temp = {
        name: "",
        classNmae: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          rule.create(this.temp).then(response => {
            if (response.code == 20000) {
              this.dialogFormVisible = false;
              this.getList();
            } else {
              this.$notify({
                title: "Error",
                message: response.message,
                type: "error",
                duration: 5000
              });
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.resetTemp();
      this.tempid = row.name;
      this.temp.name = row.name;
      this.temp.className = row.className;
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          rule.update(this.tempid, this.temp).then(response => {
            if (response.code == 20000) {
              this.dialogFormVisible = false;
              this.getList();
            } else {
              this.$notify({
                title: "Error",
                message: response.message,
                type: "error",
                duration: 5000
              });
            }
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$confirm("Confirm Delete?", "Notice", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning"
      }).then(() => {
        rule.delete(row.name).then(response => {
          if (response.code == 20000) {
            this.getList();
          } else {
            this.$notify({
              title: "Error",
              message: response.message,
              type: "error",
              duration: 5000
            });
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.filter-container {
  padding-bottom: 10px;
}
.filter-container .filter-item {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
}
</style>