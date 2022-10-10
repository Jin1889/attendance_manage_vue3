<template>
    <el-button
      class="add"
      type="primary"
      size="small"
      plain
      @click="addLeave"
      >添加</el-button
    >
  
    <!-- 表格数据 -->
    <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="real_name" label="姓名" width="70"></el-table-column>
      <el-table-column prop="department_name" label="部门" width="70"></el-table-column>
      <el-table-column prop="leave_type" label="请假类型" width="90"></el-table-column>
      <el-table-column prop="leave_reason" label="请假原因"></el-table-column>
      <el-table-column prop="leave_start" label="开始时间"></el-table-column>
      <el-table-column prop="leave_end" label="结束时间"></el-table-column>
      <el-table-column prop="audit_state" label="审核状态"></el-table-column>
      <!-- <el-table-column prop="audit_name" label="审核人"></el-table-column>
      <el-table-column prop="audit_illustrate" label="审核说明"></el-table-column>
      <el-table-column prop="audit_time" label="审核时间"></el-table-column> -->
      <el-table-column prop="options" label="操作">
        <template v-slot="scope">
          <el-button
            type="primary"
            size="small"
            @click="updateLeave(scope.row.id)"
            >修改</el-button
          >
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            :icon="WarnTriangleFilled"
            icon-color="red"
            title="是否确定删除"
            @confirm="deleteLeave(scope.row.id)"
          >
            <template #reference>
              <el-button class="delete" type="danger" size="small"
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      :page-sizes="pageSizes"
      v-model:page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <!-- 添加或修改 -->
    <el-dialog title="请假类型" v-model="dialogVisible" modal>
      <el-form :model="leaveForm.formData" ref="leaveFormRef">
        <el-form-item
          prop="leave_type"
          label="请假类型"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="leaveForm.formData.leave_type"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveLeave()">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </template>
  
  <script lang="ts" setup>
  import {
    reactive,
    ref,
    getCurrentInstance,
    nextTick,
  } from "vue-demi";
  import type { FormInstance } from "element-plus";
  import { WarnTriangleFilled } from "@element-plus/icons-vue";
  const { proxy } = getCurrentInstance() as any;
  
  const leaveFormRef = ref<FormInstance>();
  // 表格数据
  const tableData = ref([]);
  // 分页
  let currentPage = ref(1);
  let pageSizes = ref([10, 15, 20]);
  let pageSize = ref(10);
  let total = ref(0);
  // 弹出框
  type typeLeave = {
      formData: {
          id?:number;
          leave_type: string;
      }
  }
  let leaveForm = reactive<typeLeave>({
      formData: {
          leave_type: "",
      }
  })
  
  let dialogVisible = ref(false)
  let isAdd = ref(false);
  const formLabelWidth = ref("6rem");
  
  const getTableList = async () => {
    const { data: res } = await proxy.$http.get("attendance/leave");
    if (res.status !== 200) return alert("获取数据失败");
    tableData.value = res.data.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    );
    total.value = res.data.length;
  };
  getTableList();
  
  const reset = (formEl: FormInstance | undefined) => {
    formEl?.resetFields()
  }
  
  function addLeave() {
    dialogVisible.value = true;
    isAdd.value = true;
    nextTick(() => {
      reset(leaveFormRef.value)
      // 去掉因修改带过来的id
      delete leaveForm.formData.id;
    });
  }
  
  async function updateLeave(updateId: number) {
    dialogVisible.value = true;
    isAdd.value = false;
    const { data: res } = await proxy.$http.get(
      `attendance/leave/${updateId}`
    );
    if (res.status !== 200) return alert("获取该条数据失败");
    leaveForm.formData = res.data;
  }
  
  async function saveLeave() {
    if (isAdd.value === false) {
      const { data: res } = await proxy.$http.put(
        `attendance/leave/${leaveForm.formData.id}`,
        leaveForm.formData
      );
      if (res.status !== 200) return alert("更新失败");
    } else {
      const { data: res } = await proxy.$http.post(
        "attendance/leave",
        leaveForm.formData
      );
      if (res.status !== 200) return alert("添加失败");
    }
    dialogVisible.value = false;
    getTableList();
  }
  async function deleteLeave(id: number) {
    const { data: res } = await proxy?.$http.delete(`attendance/leave/${id}`);
    if (res.status !== 200) return alert("删除失败");
    getTableList();
  }
  
  function handleSizeChange(val: number) {
    //   console.log(`每页 ${val} 条`);
    pageSize.value = val;
    getTableList();
  }
  function handleCurrentChange(val: number) {
    //   console.log(`当前页: ${val}`);
    currentPage.value = val;
    getTableList();
  }
  </script>
  
  <style lang="less" scoped>
  .add {
    margin-bottom: 0.5rem;
  }
  .delete {
    margin-left: 0.5rem;
  }
  .el-pagination {
    margin-top: 0.5rem;
  }
  </style>