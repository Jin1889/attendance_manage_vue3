<template>
  <el-button class="add" type="primary" size="small" plain @click="addAttendance">添加</el-button>
  <!-- 表格数据 -->
  <el-table :data="tableData" stripe border style="width: 100%">
    <el-table-column label="#" type="index"></el-table-column>
    <el-table-column prop="username" label="用户名"></el-table-column>
    <el-table-column prop="real_name" label="姓名"></el-table-column>
    <el-table-column prop="date" label="日期"></el-table-column>
    <el-table-column prop="start_time" label="上班时间"></el-table-column>
    <el-table-column prop="end_time" label="下班时间"></el-table-column>
    <el-table-column prop="attendance_state" label="考勤状态"></el-table-column>
    <el-table-column prop="options" label="操作">
      <template v-slot="scope">
        <el-button type="primary" size="small" @click="updateAttendance(scope.row.id)">修改</el-button>
        <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" :icon="WarnTriangleFilled" icon-color="red"
          title="是否确定删除" @confirm="deleteAttendance(scope.row.id)">
          <template #reference>
            <el-button class="delete" type="danger" size="small">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination v-model:current-page="currentPage" :page-sizes="pageSizes" v-model:page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
    @current-change="handleCurrentChange">
  </el-pagination>
  <!-- 添加或修改 -->
  <el-dialog title="考勤信息" v-model="dialogVisible" modal close="closeMethod">
    <el-form :model="attendanceForm" ref="attendanceFormRef">
      <el-form-item v-if="isAdd" label="员工" :label-width="formLabelWidth">
        <Employee></Employee>
      </el-form-item>
      <el-form-item prop="date" label="日期" :label-width="formLabelWidth">
        <el-date-picker v-model="attendanceForm.formData.date" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="上下班时间" :label-width="formLabelWidth">
        <el-col :span="11">
          <el-time-picker placeholder="选择上班时间" v-model="attendanceForm.formData.start_time"></el-time-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker placeholder="选择下班时间" v-model="attendanceForm.formData.end_time"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="考勤状态" :label-width="formLabelWidth">
        <AttendanceState></AttendanceState>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAttendance()">确 定</el-button>
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
import { format } from "../plugins/format";
import { useStore } from 'vuex'
import Employee from "../components/Employee.vue"
import AttendanceState from "../components/AttendanceState.vue"
import { multiply } from "lodash";

const store = useStore()
const { proxy } = getCurrentInstance() as any;

const attendanceFormRef = ref<FormInstance>();
// 表格数据
const tableData = ref([]);
// 分页
let currentPage = ref(1);
let pageSizes = ref([10, 15, 20]);
let pageSize = ref(10);
let total = ref(0);
// 弹出框
type typeAttendance = {
  formData: {
    id?: number;
    date: string|null;
    start_time: string|null;
    end_time: string|null;
    attendance_state?: string;
    employee_id?: number;
    attendanceState_id?: number;
    username?: string;
    real_name?: string;
    department_name?: string;
  };
};
let attendanceForm = reactive<typeAttendance>({
  formData: {
    id: 0,
    date: "",
    start_time: "",
    end_time: null,
    attendance_state: "",
  },
});
let dialogVisible = ref(false);
let isAdd = ref(false);
const formLabelWidth = ref("6rem");

const getTableList = async () => {
  const { data: res } = await proxy.$http.get("attendance/attendance");
  if (res.status !== 200) return alert("获取数据失败");
  tableData.value = res.data.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
  total.value = res.data.length;
};
getTableList();

const reset = () => {
  attendanceForm.formData.date = ''
  attendanceForm.formData.start_time = ''
  attendanceForm.formData.end_time = ''
  store.commit('SET_ATTENDANCE_STATE', 0)
  store.commit('SET_EMPLOYEE_ID', 0)
}

function addAttendance() {
  dialogVisible.value = true;
  isAdd.value = true;
  nextTick(() => {
    reset()
    // 去掉因修改带过来的id
    delete attendanceForm.formData.id;
  });
}

async function updateAttendance(updateId: number) {
  dialogVisible.value = true;
  isAdd.value = false;
  const { data: res } = await proxy.$http.get(
    `attendance/attendance/${updateId}`
  );
  if (res.status !== 200) return alert("获取该条数据失败");
  attendanceForm.formData = res.data;
  store.commit('SET_ATTENDANCE_STATE', attendanceForm.formData.attendanceState_id)
}

const preSaveHandler = () => {
  attendanceForm.formData.attendanceState_id = store.state.attendanceStateId;
  attendanceForm.formData.date = format.dateFormat(attendanceForm.formData.date);
  attendanceForm.formData.start_time = format.dateTimeFormat(
    attendanceForm.formData.start_time
  );
  attendanceForm.formData.end_time = format.dateTimeFormat(
    attendanceForm.formData.end_time
  );
  delete attendanceForm.formData.username;
  delete attendanceForm.formData.real_name;
  delete attendanceForm.formData.department_name;
  delete attendanceForm.formData.attendance_state;
}

async function saveAttendance() {
  preSaveHandler()
  if (isAdd.value === false) {
    const { data: res } = await proxy.$http.put(
      `attendance/attendance/${attendanceForm.formData.id}`,
      attendanceForm.formData
    );
    console.log("-c-", res)
    if (res.status !== 200) return alert("更新失败");
  } else {
    delete attendanceForm.formData.id;
    attendanceForm.formData.employee_id = store.state.employeeId
    const { data: res } = await proxy.$http.post(
      "attendance/attendance",
      attendanceForm.formData
    );
    if (res.status !== 200) return alert("添加失败");
  }
  dialogVisible.value = false;
  getTableList();
}
async function deleteAttendance(id: number) {
  const { data: res } = await proxy?.$http.delete(`attendance/attendance/${id}`);
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