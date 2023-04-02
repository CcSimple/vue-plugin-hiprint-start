<!--
 * @Description: 
 * @Author: CcSimple
 * @Github: https://github.com/CcSimple
 * @Date: 2023-02-07 11:52:50
 * @LastEditors: CcSimple
 * @LastEditTime: 2023-04-02 16:20:10
-->
<template>
  <div class="header">
    <div class="desc">
      <a :href="link">vue-plugin-hiprint</a>
      <span>使用教程</span>
    </div>
    <div class="wechat">
      <span>微信公众号:</span>
      <span>不简说</span>
      <div class="img">
        <div class="flex-col">
          <img src="./assets/wechat1.jpg" />
          <span>加我备注 "start" 进群</span>
        </div>
        <div class="flex-col">
          <img src="./assets/wechat2.jpg" />
          <span>公众号</span>
        </div>
      </div>
    </div>
    <div class="demos">
      <!-- 遍历按钮列表 -->
      <template v-for="item in btnList" :key="item.demo">
        <button :class="item.demo == curDemo ? 'primary' : 'info'" @click="changeDemo(item)">
          {{ item.title }}
        </button>
      </template>
    </div>
  </div>
  <!-- 动态渲染组件，懒得去弄路由了 -->
  <keep-alive>
    <component class="main" :is="demos[curDemo]" :msg="curDemo" />
  </keep-alive>
</template>

<script setup>
import { ref } from "vue";
import start01 from "./start-01/index.vue";
import start02 from "./start-02/index.vue";
import start03 from "./start-03/index.vue";
import start04 from "./start-04/index.vue";
// 链接
const host = window.location.host;
let href = "https://gitee.com/CcSimple/vue-plugin-hiprint";
if (host && host.includes("github")) {
  href = "https://github.com/CcSimple/vue-plugin-hiprint";
}
const link = ref(href);
// demo 按钮列表
const btnList = ref([
  {
    demo: "start01",
    title: "使用 — 入门篇",
  },
  {
    demo: "start02",
    title: "使用 — 进阶篇",
  },
  {
    demo: "start03",
    title: "使用 — 打印篇",
  },
  {
    demo: "start04",
    title: "实战 — 动态provider",
  },
]);
// demos 用于存放所有 demo
const demos = {
  start01,
  start02,
  start03,
  start04,
};
// curDemo 用于存放当前 demo 的 name
const curDemo = ref(Object.keys(demos)[0]);
// 切换 demo
const changeDemo = (item) => {
  curDemo.value = item.demo;
};
</script>

<style>
/* 顶部 */
.header {
  box-shadow: 0 2px 0 rgba(128, 0, 128, 0.2);
  padding: 8px 14px;
  height: 40px;
  line-height: 40px;
  display: flex;
}
/* 左侧 描述 */
.header .desc {
  margin-right: 14px;
}
.header .desc a {
  color: purple;
  font-weight: bolder;
  padding-right: 4px;
  text-decoration: none;
}
.header .desc span {
  font-size: 14px;
}
/* 公众号 */
.header .wechat {
  cursor: cell;
}
.header .wechat span:first-of-type {
  font-size: 14px;
  margin-right: 6px;
}
.header .wechat span:last-of-type {
  color: purple;
  font-weight: bolder;
  font-size: 16px;
  margin-right: 14px;
}
.header .wechat .img {
  display: flex;
  position: absolute;
  top: 60px;
  z-index: 10;
  visibility: hidden;
}
.header .wechat:hover .img {
  visibility: visible;
  animation: fadeIn linear 1s;
  background: white;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.header .wechat:hover .img img {
  width: 200px;
  height: 200px;
}
.header .wechat:hover .img div:first-of-type {
  margin-right: 10px;
}
/* 右侧 demo 按钮------> */
.header .demos {
  flex: 1;
}
/* 多个 button 间距 */
.header .demos button + button {
  margin-left: -1px;
}
.header .demos button:first-child:last-child {
  border-radius: 4px;
}
/* 两边的 btn 圆角 */
.header .demos button:first-child:not(:last-child) {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.header .demos button:last-child:not(:first-child) {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.main {
  padding: 10px;
}
</style>
