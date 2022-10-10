<template>
  <el-button
    class="add"
    type="primary"
    size="small"
    plain
    @click="addDepartment"
    >添加</el-button
  >

  <!-- 表格数据 -->
  <el-table :data="tableData" stripe border style="width: 100%">
    <el-table-column label="#" type="index"></el-table-column>
    <el-table-column prop="department_name" label="部门名称"></el-table-column>
    <el-table-column prop="options" label="操作">
      <template v-slot="scope">
        <el-button
          type="primary"
          size="small"
          @click="updateDepartment(scope.row.id)"
          >修改</el-button
        >
        <el-popconfirm
          confirm-button-text="确认"
          cancel-button-text="取消"
          :icon="WarnTriangleFilled"
          icon-color="red"
          title="是否确定删除"
          @confirm="deleteDepartment(scope.row.id)"
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
  <el-dialog title="部门信息" v-model="dialogVisible" modal>
    <el-form :model="departmentForm.formData" ref="departmentFormRef">
      <el-form-item
        prop="department_name"
        label="部门"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="departmentForm.formData.department_name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDepartment()">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  reactive,
  ref,
  getCurrentInstance,
  ComponentInternalInstance,
  nextTick,
} from "vue-demi";
import type { FormInstance } from "element-plus";
import { WarnTriangleFilled } from "@element-plus/icons-vue";
import { format } from "../plugins/format";
const { proxy } = getCurrentInstance() as any;

const departmentFormRef = ref<FormInstance>();
// 表格数据
const tableData = ref([]);
// 分页
let currentPage = ref(1);
let pageSizes = ref([10, 15, 20]);
let pageSize = ref(10);
let total = ref(0);
// 弹出框
type typeDepartment = {
    formData: {
        id?:number;
        department_name: string;
    }
}
let departmentForm = reactive<typeDepartment>({
    formData: {
        id: 0,
        department_name: "",
    }
})

let dialogVisible = ref(false)
let isAdd = ref(false);
const formLabelWidth = ref("6rem");

const getTableList = async () => {
  const { data: res } = await proxy.$http.get("attendance/department");
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

function addDepartment() {
  dialogVisible.value = true;
  isAdd.value = true;
  nextTick(() => {
    reset(departmentFormRef.value)
    // 去掉因修改带过来的id
    delete departmentForm.formData.id;
  });
}

async function updateDepartment(updateId: number) {
  dialogVisible.value = true;
  isAdd.value = false;
  const { data: res } = await proxy.$http.get(
    `attendance/department/${updateId}`
  );
  if (res.status !== 200) return alert("获取该条数据失败");
  departmentForm.formData = res.data;
}

async function saveDepartment() {
  if (isAdd.value === false) {
    const { data: res } = await proxy.$http.put(
      `attendance/department/${departmentForm.formData.id}`,
      departmentForm.formData
    );
    if (res.status !== 200) return alert("更新失败");
  } else {
    const { data: res } = await proxy.$http.post(
      "attendance/department",
      departmentForm.formData
    );
    if (res.status !== 200) return alert("添加失败");
  }
  dialogVisible.value = false;
  getTableList();
}
async function deleteDepartment(id: number) {
  const { data: res } = await proxy?.$http.delete(`attendance/department/${id}`);
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