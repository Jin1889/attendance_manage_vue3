<template>
  <div id="main"></div>
</template>

<script lang="ts" setup>
import {
  reactive,
  ref,
  getCurrentInstance,
  ComponentInternalInstance,
  onMounted,
} from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useRouter } from "vue-router";
const $router = useRouter();

const echartData = ref([]);

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const echartsInit = async () => {
  const { data: res } = await proxy.$http.get("attendance/system/chart");
  if (res.status !== 200) return alert("获取该条数据失败");
  echartData.value = res.data;

  let myChart = proxy.$echarts.init(document.getElementById("main"));

  let option = {
    legend: {
      top: "bottom",
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: "部门人数分布图",
        type: "pie",
        radius: [50, 250],
        center: ["50%", "50%"],
        roseType: "area",
        itemStyle: {
          borderRadius: 8,
        },
        data: [...echartData.value],
      },
    ],
  };

  myChart.setOption(option);
};

onMounted(() => {
  echartsInit();
});
</script>

<style lang="less" scoped>
#main {
    width: 100%;
    height: 100%;
}
</style>
