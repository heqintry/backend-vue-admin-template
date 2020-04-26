<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="route" placeholder="Route" style="width: 300px;" class="filter-item" />
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >Add Route</el-button>
    </div>
    <div class="route-transfer">
      <el-transfer
        v-model="value"
        :data="data"
        @change="handleChange"
        :titles="['Available', 'Assigned']"
      ></el-transfer>
    </div>
  </div>
</template>

<script>
import route from "@/api/admin/route";

export default {
  data() {
    return {
      route: "",
      data: [],
      value: []
    };
  },
  created() {
    this.getIndex();
  },
  methods: {
    async getIndex() {
      const response = await route.index();
      if (response.code != 20000) {
        this.$notify({
          title: "Error",
          message: response.message,
          type: "error",
          duration: 5000
        });
        return;
      }

      const data = [];
      response.data.available.concat(response.data.assigned).forEach(item => {
        data.push({
          key: item,
          label: item
        });
      });
      this.data = data;
      this.value = response.data.assigned;
    },
    handleChange(value, direction, movedKeys) {
      if (direction == "right") {
        route
          .assign({
            routes: movedKeys
          })
          .then(response => {
            if (response.code == 20000) {
              this.getIndex();
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
        route
          .remove({
            routes: movedKeys
          })
          .then(response => {
            if (response.code == 20000) {
              this.getIndex();
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
    },
    handleCreate() {
      if (!this.route) {
        this.$notify({
          title: "Error",
          message: "Route must required",
          type: "error",
          duration: 5000
        });
        return;
      }
      route.create({ route: this.route }).then(response => {
        if (response.code == 20000) {
          this.route = "";
          this.getIndex();
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
};
</script>

<style>
.route-transfer .el-transfer-panel {
  width: 400px;
  height: 600px;
}
.route-transfer .el-transfer-panel__body {
  height: 100%;
}
.route-transfer .el-transfer-panel__list {
  height: 100%;
}
</style>