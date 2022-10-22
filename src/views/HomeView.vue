<template>
  <el-container class="index">
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <el-menu
        unique-opened
        router
        text-color="#ffffff"
        background-color="#304156"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <template v-for="menu in menuList">
          <el-menu-item v-if="menu.path" :key="menu.id" :index="menu.path">
            <!-- <template slot="title"> -->
            <!-- <i :class="menu.icon"></i> -->
            <el-icon><Star /></el-icon>
            <span>{{ menu.title }}</span>
            <!-- </template> -->
          </el-menu-item>

          <el-sub-menu v-else :key="menu.id" :index="menu.id + ''">
            <template #title>
              <el-icon><Star /></el-icon>
              <!-- <i :class="menu.icon"></i> -->
              <span>{{ menu.title }}</span>
            </template>
            <el-menu-item
              :index="subMenu.path"
              v-for="subMenu in menu.children"
              :key="subMenu.id"
            >
              <template #title>
                <span>{{ subMenu.title }}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-aside>
    <el-container class="container">
      <el-header height="3rem">
        <div>
          <el-icon v-show="!isCollapse" @click="toggleCollapse" size="16px"
            ><Fold
          /></el-icon>
          <el-icon v-show="isCollapse" @click="toggleCollapse" size="16px"
            ><Expand
          /></el-icon>
          <span>后台管理系统</span>
        </div>
        <el-dropdown @command="logout">
          <span class="el-dropdown-link">
            admin
            <el-icon size="12px">
              <ArrowDown />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="exit">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main
        ><!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import {
  reactive,
  ref,
  getCurrentInstance,
  ComponentInternalInstance,
} from "vue-demi";

let isCollapse = ref(false);
let menuList = ref([]);
const exit = ref("exit");

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const getMenuList = async () => {
  const { data: res } = await proxy.$http.get("/attendance/system/menu");
  if (res.status !== 200) return alert("error");
  menuList.value = res.data;
};

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

const logout = (text: string) => {
  if (text === exit.value) {
    // window.sessionStorage.removeItem("token");
    window.sessionStorage.clear();
    this.$router.push("/login");
  }
};

getMenuList();
</script>

<style lang="less" scoped>
.index {
  height: 100%;
  .el-aside {
    .el-menu {
      height: 100%;
    }
  }
}

.el-icon-s-fold,
.el-icon-s-unfold {
  margin-right: 0.5rem;
}

.el-header {
  padding: 0 1rem;
  background-color: #b3c0d1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;

  .el-dropdown {
    margin-right: 2rem;
    font-size: 1rem;

    .el-dropdown-link {
      cursor: pointer;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
  }
}
</style>