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

      <el-table-column align="center" label="Description">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="RuleName">
        <template slot-scope="{row}">
          <span>{{ row.ruleName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Data">
        <template slot-scope="{row}">
          <span>{{ row.data ? JSON.stringify(row.data) : "" }}</span>
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
          <el-button type="success" size="mini" @click="handleAssign(row.name)">Assign</el-button>
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
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="Desciption" prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item label="RuleName" prop="ruleName">
          <el-select v-model="temp.ruleName" class="filter-item" placeholder>
            <el-option
              v-for="item in ruleOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Data">
          <el-input v-model="temp.data" :autosize="{ minRows: 4, maxRows: 4}" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">Confirm</el-button>
      </div>
    </el-dialog>

    <assignDialog
      :visible="assignDialog.visible"
      :id="assignDialog.id"
      :available="assignDialog.available"
      :assigned="assignDialog.assigned"
      @assignShow="assignShow"
      @assignChange="assignChange"
    ></assignDialog>
  </div>
</template>

<script>
import assignDialog from "@/views/admin/assignDialog";
import role from "@/api/admin/role";

export default {
  components: {
    assignDialog: assignDialog
  },
  data() {
    return {
      list: null,
      listLoading: true,
      ruleOptions: [],
      tempid: "",
      temp: {
        name: "",
        description: "",
        ruleName: "",
        data: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      rules: {
        name: [{ required: true, message: "name is required", trigger: "blur" }]
      },
      assignDialog: {
        visible: false,
        id: "",
        available: {},
        assigned: {}
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const { data } = await role.index();
      this.list = data.items;
      this.listLoading = false;
      this.ruleOptions = data.rules;
      this.ruleOptions.unshift({ name: "" });
    },
    resetTemp() {
      this.temp = {
        name: "",
        description: "",
        ruleName: "",
        data: ""
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
          role.create(this.temp).then(response => {
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
      this.temp.description = row.description;
      this.temp.ruleName = row.ruleName;
      this.temp.data = row.data ? JSON.stringify(row.data) : "";
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          role.update(this.tempid, this.temp).then(response => {
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
        role.delete(row.name).then(response => {
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
    },
    handleAssign(id) {
      role.view(id).then(response => {
        if (response.code == 20000) {
          this.assignDialog.visible = true;
          this.assignDialog.id = id;
          this.assignDialog.available = Object.assign(
            {},
            response.data.available
          );
          this.assignDialog.assigned = Object.assign(
            {},
            response.data.assigned
          );
        } else {
          this.$notify({
            title: "Error",
            message: response.message,
            type: "error",
            duration: 5000
          });
        }
      });
    },
    assignShow(show) {
      this.assignDialog.visible = show;
    },
    assignChange(id, direction, movedKeys) {
      if (direction == "right") {
        role
          .assign(id, {
            items: movedKeys
          })
          .then(response => {
            if (response.code == 20000) {
              this.handleAssign(id);
            } else {
              this.$notify({
                title: "Error",
                message: response.message,
                type: "error",
                duration: 5000
              });
            }
          });
      } else {
        role
          .remove(id, {
            items: movedKeys
          })
          .then(response => {
            if (response.code == 20000) {
              this.handleAssign(id);
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
    }
  }
};
</script>