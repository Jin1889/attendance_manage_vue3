<template>
  <!-- 添加 -->
  <el-button class="add" type="primary" plain @click="addEmployee" size="small"
    >添加</el-button
  >
  <!-- 表格数据 -->
  <el-table :data="tableData" stripe border style="width: 100%">
    <el-table-column label="#" type="index"></el-table-column>
    <el-table-column
      prop="real_name"
      label="姓名"
      width="120"
    ></el-table-column>
    <el-table-column prop="username" label="用户名"></el-table-column>
    <el-table-column prop="gender" label="性别" width="80"></el-table-column>
    <el-table-column prop="age" label="年龄" width="100"></el-table-column>
    <el-table-column prop="tel" label="电话"></el-table-column>
    <el-table-column prop="entry_time" label="入职时间"></el-table-column>
    <el-table-column prop="department_name" label="部门名称"></el-table-column>
    <el-table-column
      prop="role_name"
      label="角色"
      width="100"
    ></el-table-column>
    <el-table-column prop="options" label="操作">
      <template v-slot="scope">
        <el-button
          type="primary"
          size="small"
          @click="updateEmployee(scope.row.id)"
          >修改</el-button
        >
        <el-popconfirm
          confirm-button-text="确认"
          cancel-button-text="取消"
          :icon="WarnTriangleFilled"
          icon-color="red"
          title="是否确定删除"
          @confirm="deleteEmployee(scope.row.id)"
        >
          <!-- <el-button slot="reference">删除</el-button> -->
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
  <el-dialog title="员工信息" v-model="dialogVisible" modal top="1.5rem">
    <el-form :model="employeeForm.formData" ref="employeeFormRef" width="100">
      <el-form-item
        prop="username"
        label="用户名"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="employeeForm.formData.username"
          autocomplete="off"
          :disabled="!isAdd"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="password"
        label="密码"
        :label-width="formLabelWidth"
        v-show="isAdd"
      >
        <el-input
          type="password"
          v-model="employeeForm.formData.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item prop="real_name" label="姓名" :label-width="formLabelWidth">
        <el-input
          v-model="employeeForm.formData.real_name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item prop="gender" label="性别" :label-width="formLabelWidth">
        <el-radio v-model="employeeForm.formData.gender" :label="1"
          >男</el-radio
        >
        <el-radio v-model="employeeForm.formData.gender" :label="2"
          >女</el-radio
        >
      </el-form-item>
      <el-form-item prop="age" label="年龄" :label-width="formLabelWidth">
        <el-input
          type="number"
          v-model="employeeForm.formData.age"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item prop="tel" label="电话" :label-width="formLabelWidth">
        <el-input
          v-model="employeeForm.formData.tel"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="entry_time"
        label="入职时间"
        :label-width="formLabelWidth"
      >
        <el-date-picker
          v-model="employeeForm.formData.entry_time"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        prop="department_id"
        label="部门"
        :label-width="formLabelWidth"
      >
        <el-select
          v-model="employeeForm.formData.department_id"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in departments"
            :key="item.id"
            :label="item.department_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="role_id" label="角色" :label-width="formLabelWidth">
        <el-select
          v-model="employeeForm.formData.role_id"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.role_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEmployee()">确 定</el-button>
      </span></template
    >
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

const employeeFormRef = ref<FormInstance>();
// 表格数据
const tableData = ref([]);
// 分页
let currentPage = ref(1);
let pageSizes = ref([10, 15, 20]);
let pageSize = ref(10);
let total = ref(0);
// 弹出框
type typeEmployee = {
  formData: {
    id?: number;
    username: string;
    password: string;
    real_name: string;
    gender: number;
    age: number;
    tel: string;
    entry_time: string;
    department_id: number;
    role_id: number;
  };
};
let employeeForm = reactive<typeEmployee>({
  formData: {
    id: 0,
    username: "",
    password: "",
    real_name: "",
    gender: 0,
    age: 0,
    tel: "",
    entry_time: "",
    department_id: 0,
    role_id: 0,
  },
});
let dialogVisible = ref(false);
let isAdd = ref(false);
let departments = ref([]);
let roles = ref([]);
// let name = ref("");

const formLabelWidth = ref("6rem");

const getTableList = async () => {
  const { data: res } = await proxy.$http.get("attendance/employee");
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

function addEmployee() {
  dialogVisible.value = true;
  isAdd.value = true;
  nextTick(() => {
    reset(employeeFormRef.value)
    // 去掉因修改带过来的id
    delete employeeForm.formData.id;
  });
}

async function updateEmployee(updateId: number) {
  dialogVisible.value = true;
  isAdd.value = false;
  const { data: res } = await proxy.$http.get(
    `attendance/employee/${updateId}`
  );
  if (res.status !== 200) return alert("获取该条数据失败");
  employeeForm.formData = res.data;
}

async function saveEmployee() {
  employeeForm.formData.entry_time = format.dateFormat(
    employeeForm.formData.entry_time
  );
  if (isAdd.value === false) {
    const { data: res } = await proxy.$http.put(
      `attendance/employee/${employeeForm.formData.id}`,
      employeeForm.formData
    );
    if (res.status !== 200) return alert("更新失败");
  } else {
    const { data: res } = await proxy.$http.post(
      "attendance/employee",
      employeeForm.formData
    );
    if (res.status !== 200) return alert("添加失败");
  }
  dialogVisible.value = false;
  getTableList();
}
async function deleteEmployee(id: number) {
  const { data: res } = await proxy?.$http.delete(`attendance/employee/${id}`);
  if (res.status !== 200) return alert("删除失败");
  getTableList();
}

const getOptions = async () => {
  const { data: result } = await proxy.$http.get("attendance/department");
  if (result.status !== 200) return alert("获取部门数据失败");
  departments.value = result.data;
  const { data: roleres } = await proxy.$http.get("attendance/role");
  if (roleres.status !== 200) return alert("获取部门数据失败");
  roles.value = roleres.data;
};
getOptions();

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