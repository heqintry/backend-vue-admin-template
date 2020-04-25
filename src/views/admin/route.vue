<template>
  <div class="app-container">
    <el-transfer
      v-model="value"
      :data="data"
      @change="handleChange"
      :titles="['Available', 'Assigned']"
    ></el-transfer>
  </div>
</template>

<script>
import route from "@/api/admin/route";

export default {
  data() {
    return {
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