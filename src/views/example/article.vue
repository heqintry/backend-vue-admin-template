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

      <el-table-column align="center" label="Title">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Content">
        <template slot-scope="{row}">
          <span>{{ row.content }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Author">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Author">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">{{ statusName(row.status) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="left" label="Actions" width="300px">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">Edit</el-button>
          <el-button
            size="mini"
            type="danger"
            :disabled="row.status==-1"
            @click="handleDelete(row)"
          >Delete</el-button>
          <el-button
            v-if="row.status==0"
            size="mini"
            type="success"
            @click="handlePublish(row)"
          >Publish</el-button>
          <el-button v-if="row.status==1" size="mini" @click="handleDraft(row)">Draft</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="Update" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Content" prop="content">
          <el-input v-model="temp.content" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateData()">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import article from "@/api/example/article";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        "1": "success",
        "0": "info",
        "-1": "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      tempid: "",
      temp: {
        title: "",
        content: ""
      },
      dialogFormVisible: false,
      rules: {
        title: [
          { required: true, message: "Title is required", trigger: "blur" }
        ],
        content: [
          { required: true, message: "Content is required", trigger: "blur" }
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
      const { data } = await article.index();
      this.list = data.articles;
      this.listLoading = false;
    },
    statusName(status) {
      const statusMap = {
        "1": "publish",
        "0": "draft",
        "-1": "deleted"
      };
      return statusMap[status];
    },
    handleUpdate(row) {
      this.tempid = row.id;
      this.temp.title = row.title;
      this.temp.content = row.content;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          article.update(this.tempid, this.temp).then(response => {
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
    handleDelete(row) {
      article.delete(row.id).then(response => {
        if (response.code == 20000) {
          this.getList();
        } else {
          this.notify(response.message);
        }
      });
    },
    handlePublish(row) {
      article.publish(row.id).then(response => {
        if (response.code == 20000) {
          this.getList();
        } else {
          this.notify(response.message);
        }
      });
    },
    handleDraft(row) {
      article.draft(row.id).then(response => {
        if (response.code == 20000) {
          this.getList();
        } else {
          this.notify(response.message);
        }
      });
    },
    notify(message) {
      this.$notify({
        title: "Error",
        message: message,
        type: "error",
        duration: 5000
      });
    }
  }
};
</script>