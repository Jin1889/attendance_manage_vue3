<template>
    <el-select v-model="attendanceState" clearable placeholder="请选择">
        <el-option v-for="item in options" :key="item['id']" :label="item['attendance_state']" :value="item['id']">
        </el-option>
    </el-select>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance, computed } from "vue-demi";
import { useStore } from 'vuex'

const store = useStore()
const { proxy } = getCurrentInstance() as any;

let options = ref([]);

const getAttendanceState = async () => {
  const { data: res } = await proxy.$http.get("attendance/system/attendanceState");
  if (res.status !== 200) return alert("获取数据失败");
  options.value = res.data;
};
getAttendanceState()

const attendanceState = computed({
  get() {
    return store.state.attendanceStateId;
  },
  set(val) {
    store.commit('SET_ATTENDANCE_STATE', val)
  },
})
</script>

<style lang="less">
</style>