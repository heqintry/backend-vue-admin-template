<template>
  <el-dialog title="Assign" :visible.sync="dialogVisible">
    <el-transfer
      v-model="value"
      :data="data"
      @change="handleChange"
      :titles="['Available', 'Assigned']"
    ></el-transfer>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    available: {
      type: Object,
      required: true
    },
    assigned: {
      type: Object,
      required: true
    }
  },
  watch: {
    visible(value) {
      if (value == true) {
        const data = [];
        const value = [];
        for (let key in this.available) {
          data.push({
            key: key,
            label: "[" + this.available[key] + "] " + key,
            disabled: false
          });
        }
        for (let key in this.assigned) {
          data.push({
            key: key,
            label: "[" + this.assigned[key] + "] " + key,
            disabled: false
          });
          value.push(key);
        }
        this.data = data;
        this.value = value;
      }
    }
  },
  data() {
    return {
      data: [],
      value: []
    };
  },
  computed: {
    dialogVisible: {
      get: function() {
        return this.visible;
      },
      set: function(value) {
        this.$emit("assignShow", value);
      }
    }
  },
  methods: {
    handleChange(value, direction, movedKeys) {
      this.$emit("assignChange", this.id, direction, movedKeys);
    }
  }
};
</script>