<template>
  <el-select v-model="employee" clearable placeholder="请选择">
    <el-option v-for="item in options" :key="item['id']"
      :label="item['username'] + '-' + item['real_name'] + '-' + item['department_name']" :value="item['id']">
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { reactive, ref, getCurrentInstance, computed } from "vue-demi";
import { useStore } from 'vuex'

const store = useStore()
const { proxy } = getCurrentInstance() as any;

let options = ref([]);

const getEmployee = async () => {
  const { data: res } = await proxy.$http.get("attendance/employee");
  if (res.status !== 200) return alert("获取数据失败");
  options.value = res.data;
};
getEmployee()

const employee = computed({
  get() {
    return store.state.employeeId;
  },
  set(val) {
    store.commit('SET_EMPLOYEE_ID', val)
  },
})
</script>

<style>
</style>