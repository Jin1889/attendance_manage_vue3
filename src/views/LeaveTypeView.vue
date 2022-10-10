<template>
    <el-button
      class="add"
      type="primary"
      size="small"
      plain
      @click="addLeaveType"
      >添加</el-button
    >
  
    <!-- 表格数据 -->
    <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column prop="leave_type" label="请假类型"></el-table-column>
      <el-table-column prop="options" label="操作">
        <template v-slot="scope">
          <el-button
            type="primary"
            size="small"
            @click="updateLeaveType(scope.row.id)"
            >修改</el-button
          >
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            :icon="WarnTriangleFilled"
            icon-color="red"
            title="是否确定删除"
            @confirm="deleteLeaveType(scope.row.id)"
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
      <el-form :model="leaveTypeForm.formData" ref="leaveTypeFormRef">
        <el-form-item
          prop="leave_type"
          label="请假类型"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="leaveTypeForm.formData.leave_type"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveLeaveType()">确 定</el-button>
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
  
  const leaveTypeFormRef = ref<FormInstance>();
  // 表格数据
  const tableData = ref([]);
  // 分页
  let currentPage = ref(1);
  let pageSizes = ref([10, 15, 20]);
  let pageSize = ref(10);
  let total = ref(0);
  // 弹出框
  type typeLeaveType = {
      formData: {
          id?:number;
          leave_type: string;
      }
  }
  let leaveTypeForm = reactive<typeLeaveType>({
      formData: {
          leave_type: "",
      }
  })
  
  let dialogVisible = ref(false)
  let isAdd = ref(false);
  const formLabelWidth = ref("6rem");
  
  const getTableList = async () => {
    const { data: res } = await proxy.$http.get("attendance/leaveType");
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
  
  function addLeaveType() {
    dialogVisible.value = true;
    isAdd.value = true;
    nextTick(() => {
      reset(leaveTypeFormRef.value)
      // 去掉因修改带过来的id
      delete leaveTypeForm.formData.id;
    });
  }
  
  async function updateLeaveType(updateId: number) {
    dialogVisible.value = true;
    isAdd.value = false;
    const { data: res } = await proxy.$http.get(
      `attendance/leaveType/${updateId}`
    );
    if (res.status !== 200) return alert("获取该条数据失败");
    leaveTypeForm.formData = res.data;
  }
  
  async function saveLeaveType() {
    if (isAdd.value === false) {
      const { data: res } = await proxy.$http.put(
        `attendance/leaveType/${leaveTypeForm.formData.id}`,
        leaveTypeForm.formData
      );
      if (res.status !== 200) return alert("更新失败");
    } else {
      const { data: res } = await proxy.$http.post(
        "attendance/leaveType",
        leaveTypeForm.formData
      );
      if (res.status !== 200) return alert("添加失败");
    }
    dialogVisible.value = false;
    getTableList();
  }
  async function deleteLeaveType(id: number) {
    const { data: res } = await proxy?.$http.delete(`attendance/leaveType/${id}`);
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