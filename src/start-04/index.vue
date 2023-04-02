<!--
 * @Description: 使用 — 打印篇;
 * @Author: CcSimple
 * @Github: https://github.com/CcSimple
 * @Date: 2023-02-16 11:52:50
 * @LastEditors: CcSimple
 * @LastEditTime: 2023-04-02 16:19:21
-->
<template>
  <div class="flex-col">
    <div class="flex-row justify-center" style="margin-bottom: 10px">
      <button class="warning circle-10 ml-10" @click.stop="getProvider1(false)">模拟网络获取 provider 配置数据1(不清空)</button>
      <button class="warning circle-10 ml-10" @click.stop="getProvider2">模拟网络获取 provider 配置数据列表2</button>
      <button class="secondary circle-10 ml-10" @click.stop="getHtml">
        <i class="iconfont sv-preview" />
        预览
      </button>
      <button class="secondary circle-10 ml-10" @click.stop="print">
        <i class="iconfont sv-printer" />
        浏览器打印
      </button>
    </div>
    <div class="flex-row" style="height: 87vh">
      <div class="flex-2 center">
        <!-- 这里自定义显示样式 custom-style-types -->
        <div id="provider-container" class="custom-style-types"></div>
        <div v-if="loading" class="loading-wrapper">
          <span class="loading-dot loading-dot-spin"><i></i><i></i><i></i><i></i></span>
        </div>
      </div>
      <div class="flex-4 center">
        <!-- 设计器的 容器2 -->
        <div id="hiprint-printTemplate"></div>
      </div>
      <div class="flex-2 right">
        <!-- 元素参数的 容器 -->
        <div id="PrintElementOptionSetting"></div>
      </div>
    </div>
    <start04Preview ref="preview" />
  </div>
</template>

<script>
export default {
  name: "start-04",
};
</script>

<script setup>
import { onMounted, ref } from "vue";
import { hiprint } from "vue-plugin-hiprint";
import start04Preview from "./preview";
import helper from "./provider-helper";
import netData1 from "./net-provider1";
import netData2 from "./net-provider2";

const preview = ref(null);
const loading = ref(false);

/**
 * 这里必须要在 onMounted 中去构建 左侧可拖拽元素 或者 设计器
 * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
 */
onMounted(() => {
  getProvider1();
  buildDesigner();
});
/**
 * 构建provider
 * 注意: 可拖拽元素必须在 hiprint.init() 之后调用
 * 调用之前 可以先 console.log($("#provider-container")) 看看是否有该 dom
 */
const buildProvider = (data, clear) => {
  // 组装 provider
  if (Array.isArray(data)) {
    let providerList = helper.createProviderList(data);
    hiprint.init({ providers: providerList });
  } else {
    let provider = helper.createProvider(data.key, data.options);
    hiprint.init({ providers: [provider] });
  }
  if (clear) {
    // eslint-disable-next-line no-undef
    $("#provider-container").empty(); // 先清空, 避免重复构建
  }
  if (Array.isArray(data)) {
    // eslint-disable-next-line no-undef
    data.forEach((item) => hiprint.PrintElementTypeManager.build($("#provider-container"), item.key));
  } else {
    // eslint-disable-next-line no-undef
    hiprint.PrintElementTypeManager.build($("#provider-container"), data.key);
  }
  loading.value = false;
};
/**
 * 模拟网络请求,获取 provider 配置数据
 */
const getProvider1 = (clear = true) => {
  new Promise((resolve, reject) => {
    loading.value = true;
    setTimeout(() => {
      resolve(netData1);
    }, 2000);
  }).then((data) => {
    buildProvider(data, clear);
  });
};
const getProvider2 = (clear = true) => {
  new Promise((resolve, reject) => {
    loading.value = true;
    setTimeout(() => {
      resolve(netData2);
    }, 2000);
  }).then((data) => {
    buildProvider(data, clear);
  });
};
/**
 * 构建设计器
 * 注意: 必须要在 onMounted 中去构建
 * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
 */
let hiprintTemplate;
const buildDesigner = () => {
  // eslint-disable-next-line no-undef
  $("#hiprint-printTemplate").empty(); // 先清空, 避免重复构建
  hiprintTemplate = new hiprint.PrintTemplate({
    template: {}, // 模板json(object)
    settingContainer: "#PrintElementOptionSetting", // 元素参数容器
  });
  // 构建 并填充到 容器中
  hiprintTemplate.design("#hiprint-printTemplate", { grid: true }); // 0.0.46版本新增, 是否显示网格
};

/**
 * 获取打印html
 */
const getHtml = () => {
  let html = hiprintTemplate.getHtml({});
  preview.value.showModal(html);
};
/**
 * 浏览器打印
 */
const print = () => {
  // 参数: 打印时设置 左偏移量，上偏移量
  let options = { leftOffset: -1, topOffset: -1 };
  // 扩展
  let ext = {
    callback: () => {
      console.log("浏览器打印窗口已打开");
    },
    styleHandler: () => {
      // 重写 文本 打印样式
      return "<style>.hiprint-printElement-text{color:red !important;}</style>";
    },
  };
  // 调用浏览器打印
  hiprintTemplate.print({}, options, ext);
};
</script>

<style>
/* 自定义 provider 构建样式 */
.custom-style-types .hiprint-printElement-type {
  display: block;
}
.custom-style-types .hiprint-printElement-type {
  padding: 0 0 0 0;
  list-style: none;
}
.custom-style-types .hiprint-printElement-type > li > .title {
  display: block;
  padding: 4px 0px;
  color: rgb(0, 58, 230);
  clear: both;
}
.custom-style-types .hiprint-printElement-type > li > ul {
  padding: 0 0 0 0;
  display: block;
  list-style: none;
}
.custom-style-types .hiprint-printElement-type > li > ul > li {
  display: block;
  width: 50%;
  float: left;
  max-width: 100px;
}
.custom-style-types .hiprint-printElement-type > li > ul > li > a {
  padding: 12px 6px;
  color: #1296db;
  text-decoration: none;
  background: #fff;
  border: 1px solid #ddd;
  margin-right: 5px;
  width: 95%;
  max-width: 100px;
  display: inline-block;
  text-align: center;
  margin-bottom: 7px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.15);
}
</style>

<style scoped>
/* api按钮 */
.api {
  background: #00acc1;
}
.auto {
  width: auto !important;
}
/* 区域 */
.left {
  background: white;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  box-shadow: 2px 2px 2px 0px rgb(128 0 128 / 20%);
  overflow: auto;
}
.loading-wrapper {
  position: relative;
  top: 20%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -100%);
}
.loading-dot {
  animation: antRotate 1.2s infinite linear;
  transform: rotate(45deg);
  position: relative;
  display: inline-block;
  font-size: 40px;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
}
.loading-dot i {
  width: 20px;
  height: 20px;
  position: absolute;
  display: block;
  background-color: purple;
  border-radius: 100%;
  transform: scale(0.75);
  transform-origin: 50% 50%;
  opacity: 0.3;
  animation: antSpinMove 1s infinite linear alternate;
}
.loading-dot i:nth-child(1) {
  top: 0;
  left: 0;
}
.loading-dot i:nth-child(2) {
  top: 0;
  right: 0;
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}
.loading-dot i:nth-child(3) {
  right: 0;
  bottom: 0;
  -webkit-animation-delay: 0.8s;
  animation-delay: 0.8s;
}
.loading-dot i:nth-child(4) {
  bottom: 0;
  left: 0;
  -webkit-animation-delay: 1.2s;
  animation-delay: 1.2s;
}
@keyframes antRotate {
  to {
    -webkit-transform: rotate(405deg);
    transform: rotate(405deg);
  }
}
@-webkit-keyframes antRotate {
  to {
    -webkit-transform: rotate(405deg);
    transform: rotate(405deg);
  }
}
@keyframes antSpinMove {
  to {
    opacity: 1;
  }
}
@-webkit-keyframes antSpinMove {
  to {
    opacity: 1;
  }
}
.center {
  margin: 0 10px;
  background: white;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  padding: 20px;
  box-shadow: 2px 2px 2px 0px rgb(128 0 128 / 20%);
  overflow: auto;
}
.right {
  background: white;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  padding: 10px 0;
  box-shadow: 2px 2px 2px 0px rgb(128 0 128 / 20%);
  overflow: auto;
}
/* 左侧拖拽元素样式 */
.title {
  font-size: 16px;
  font-weight: 500;
  margin: 4px 0 4px 10px;
}
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 4px 10px;
  margin: 10px 8px 4px 8px;
  width: 38%;
  min-height: 60px;
  border-radius: 4px;
  box-shadow: 2px 2px 2px 2px rgba(171, 171, 171, 0.2);
}
.item .iconfont {
  font-size: 1.5rem;
}
.item span {
  font-size: 14px;
}
</style>
