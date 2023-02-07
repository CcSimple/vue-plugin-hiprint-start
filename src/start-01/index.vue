<!--
 * @Description: 使用 — 入门篇; 
 * @Author: CcSimple
 * @Github: https://github.com/CcSimple
 * @Date: 2023-02-07 11:52:50
 * @LastEditors: CcSimple
 * @LastEditTime: 2023-02-07 21:48:50
-->
<template>
  <div class="flex-col">
    <div class="flex-row justify-center" style="margin-bottom: 10px">
      <button class="secondary circle-10" @click.stop="print">
        <i class="iconfont sv-printer" />
        浏览器打印
      </button>
      <button class="warning circle-10 ml-10" @click.stop="print2">
        直接打印(需要连接客户端)
        <i class="iconfont sv-printer" />
      </button>
    </div>
    <div class="flex-row" style="height: 87vh">
      <div class="flex-2 left">
        <div class="flex-row justify-center flex-wrap">
          <div class="title">基础元素</div>
          <div class="ep-draggable-item item" tid="defaultModule.text">
            <i class="iconfont sv-text" />
            <span>文本</span>
          </div>
          <div class="ep-draggable-item item" tid="defaultModule.image">
            <i class="iconfont sv-image" />
            <span>图片</span>
          </div>
          <div class="ep-draggable-item item" tid="defaultModule.longText">
            <i class="iconfont sv-longText" />
            <span>长文</span>
          </div>
          <div class="ep-draggable-item item" tid="defaultModule.table">
            <i class="iconfont sv-table" />
            <span>表格</span>
          </div>
          <div class="ep-draggable-item item" tid="defaultModule.html">
            <i class="iconfont sv-html" />
            <span>html</span>
          </div>
          <div class="ep-draggable-item item" tid="defaultModule.customText">
            <i class="iconfont sv-text" />
            <span>自定义</span>
          </div>
          <div class="title">辅助元素</div>
          <div class="ep-draggable-item item" tid="defaultModule.hline">
            <i class="iconfont sv-hline" />
            <span>横线</span>
          </div>
          <div class="ep-draggable-item item" tid="defaultModule.vline">
            <i class="iconfont sv-vline" />
            <span>竖线</span>
          </div>
          <div class="ep-draggable-item item" tid="defaultModule.rect">
            <i class="iconfont sv-rect" />
            <span>矩形</span>
          </div>
          <div class="ep-draggable-item item" tid="defaultModule.oval">
            <i class="iconfont sv-oval" />
            <span>圆形</span>
          </div>
        </div>
      </div>
      <div class="flex-5 center">
        <!-- 设计器的 容器 -->
        <div id="hiprint-printTemplate"></div>
      </div>
      <div class="flex-2 right">
        <!-- 元素参数的 容器 -->
        <div id="PrintElementOptionSetting"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "start-01",
};
</script>

<script setup>
import { onMounted } from "vue";
import { hiprint, defaultElementTypeProvider } from "vue-plugin-hiprint";
// 初始化 provider
hiprint.init({
  providers: [defaultElementTypeProvider()],
});
/**
 * 这里必须要在 onMounted 中去构建 左侧可拖拽元素 或者 设计器
 * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
 */
onMounted(() => {
  buildLeftElement();
  buildDesigner();
});
/**
 * 构建左侧可拖拽元素
 * 注意: 可拖拽元素必须在 hiprint.init() 之后调用
 * 而且 必须包含 class="ep-draggable-item" 否则无法拖拽进设计器
 */
const buildLeftElement = () => {
  // eslint-disable-next-line no-undef
  hiprint.PrintElementTypeManager.buildByHtml($(".ep-draggable-item"));
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
    settingContainer: "#PrintElementOptionSetting", // 元素参数容器
  });
  // 构建 并填充到 容器中
  hiprintTemplate.design("#hiprint-printTemplate");
};

/**
 * 浏览器打印
 */
const print = () => {
  hiprintTemplate.print({});
};
/**
 * 直接打印: 借助客户端,静默打印(无弹窗直接打印)
 * 注意: 需要先连接客户端
 */
const print2 = () => {
  if (hiprint.hiwebSocket.opened) {
    hiprintTemplate.print2({});
  } else {
    alert("请先连接客户端(刷新网页), 然后再点击「直接打印」");
  }
};
</script>

<style>
/* 重写全局 hiprint 样式 */
.hiprint-headerLine,
.hiprint-footerLine {
  border-color: purple !important;
}

.hiprint-headerLine:hover,
.hiprint-footerLine:hover {
  border-top: 3px dashed purple !important;
}

.hiprint-headerLine:hover:before {
  content: "页眉线";
  left: calc(50% - 18px);
  position: relative;
  background: #ffff;
  top: -14px;
  color: purple;
  font-size: 12px;
}

.hiprint-footerLine:hover:before {
  content: "页脚线";
  left: calc(50% - 18px);
  position: relative;
  color: purple;
  background: #ffff;
  top: -14px;
  font-size: 12px;
}
</style>
<style scoped>
/* 区域 */
.left {
  background: white;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  padding: 10px 0;
  box-shadow: 2px 2px 2px 0px rgb(128 0 128 / 20%);
  overflow: auto;
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
  width: 100%;
  margin: 10px 0 0 24px;
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
