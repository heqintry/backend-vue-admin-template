<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="ID">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Username">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleAssign(row.id)">Assign</el-button>
        </template>
      </el-table-column>
    </el-table>

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
import assignment from "@/api/admin/assignment";

export default {
  components: {
    assignDialog: assignDialog
  },
  data() {
    return {
      list: null,
      listLoading: true,
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
      const { data } = await assignment.index();
      this.list = data.users;
      this.listLoading = false;
    },
    handleAssign(id) {
      assignment.view(id).then(response => {
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
        assignment
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
        assignment
          .revoke(id, {
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