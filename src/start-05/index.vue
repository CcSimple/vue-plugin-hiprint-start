<!--
 * @Description: 实战 — 动态模板;
 * @Author: CcSimple
 * @Github: https://github.com/CcSimple
 * @Date: 2023-02-16 11:52:50
 * @LastEditors: CcSimple
 * @LastEditTime: 2023-04-14 12:09:13
-->
<template>
  <div class="flex-col">
    <div class="flex-row justify-center" style="margin-bottom: 10px">
      <button class="warning circle-10 ml-10" @click.stop="mergeTemplate()">融合(左右模板)生成新的模板</button>
      <button class="api circle-10 ml-10" @click.stop="mergeTemplate2('A4')">融合(左右中模板)生成新的模板</button>
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
      <div class="flex-2 left">
        <div class="template" id="printTemplate1"></div>
        <div class="template" id="printTemplate2"></div>
        <div class="template" id="printTemplate3"></div>
      </div>
      <div class="flex-4 center">
        <!-- 设计器的 容器2 -->
        <div id="printTemplate"></div>
      </div>
      <div class="flex-2 right">
        <!-- 元素参数的 容器 -->
        <div id="PrintElementOptionSetting"></div>
      </div>
    </div>
    <start-preview ref="preview" />
  </div>
</template>

<script>
export default {
  name: "start-05",
};
</script>

<script setup>
import { onMounted, ref } from "vue";
import { hiprint } from "vue-plugin-hiprint";
import startPreview from "../components/preview.vue";
import template1 from "./template1";
import template2 from "./template2";
import template3 from "./template3";
import dataList from "./printData";

const preview = ref(null);
const PAPER_TYPE = {
  A3: {
    width: 420,
    height: 296.6,
  },
  A4: {
    width: 210,
    height: 296.6,
  },
  A5: {
    width: 210,
    height: 147.6,
  },
  B3: {
    width: 500,
    height: 352.6,
  },
  B4: {
    width: 250,
    height: 352.6,
  },
  B5: {
    width: 250,
    height: 175.6,
  },
};

/**
 * 这里必须要在 onMounted 中去构建 左侧可拖拽元素 或者 设计器
 * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
 */
onMounted(() => {
  buildDesigner();
});

/**
 * 构建设计器
 * 注意: 必须要在 onMounted 中去构建
 * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
 */
let hiprintTemplateMap = {
  1: undefined,
  2: undefined,
  3: undefined,
};
let templateMap = {
  1: template1,
  2: template2,
  3: template3,
};
const buildDesigner = () => {
  Array.from([1, 2, 3]).forEach((num) => {
    // eslint-disable-next-line no-undef
    $(`#printTemplate${num}`).empty(); // 先清空, 避免重复构建
    hiprintTemplateMap[num] = new hiprint.PrintTemplate({
      template: templateMap[num],
      settingContainer: "#PrintElementOptionSetting", // 元素参数容器
    });
    // 构建 并填充到 容器中
    hiprintTemplateMap[num].design(`#printTemplate${num}`, { grid: true }); // 0.0.46版本新增, 是否显示网格
  });
};
/**
 * 合并左右模板, 生成新的模板,
 * 填满 A4 纸张 (宽:210, 高:297)
 * @param toPaper {String} 我们想要打印的纸张类型
 */
let hiprintTemplate;
const mergeTemplate = (toPaper = "A4") => {
  // 1. 【确定】我们想要打印的内容 -> 及我们实际打印纸张的大小
  const { width, height } = PAPER_TYPE[toPaper];
  let template = {
    panels: [
      {
        index: 0,
        width,
        height,
        paperNumberDisabled: true, // 不使用默认的页面,用下面的元素,自定义页码
        printElements: [
          {
            options: {
              left: 466.5,
              top: 820.5,
              height: 9.75,
              width: 121.5,
              field: "page",
              title: "模拟的页码",
              textAlign: "center",
              hideTitle: true,
            },
            printElementType: {
              title: "文本",
              type: "text",
            },
          },
        ], // 我们实际需要打印的内容
      },
    ],
  };
  // 2. 【捋一捋】合并的模板与我们打印纸张之间的关系
  // 模板1: width: 105, height: 70
  // 模板2: width: 105, height: 70
  // 模板3: width: 210, height: 70
  // 根据这 3 个模板,我们可以估算出, 我们打印的 A4 纸, 可以容纳多少个 这样的模板.
  // 也就是说, 我们需要打印多少个小的打印模板, 才能填满 A4 纸.
  // 把一个模板(多个打印元素) 看成一个整体
  // [1][2]    [1][2]
  // [1][2] 或 [ 3 ]
  // [1][2] 者 [1][2]
  // [1][2]    [ 3 ]
  // 实现第一种情况:
  const ver = parseInt(height / 70); // 垂直方向, 可以容纳多少个模板
  const hor = parseInt(width / 105); // 水平方向, 可以容纳多少个模板
  // !!注意: 模板中的 left、top 单位是 pt;  width、height 单位是 mm
  // !!注意: 模板中的 left、top 单位是 pt;  width、height 单位是 mm
  // !!注意: 模板中的 left、top 单位是 pt;  width、height 单位是 mm
  let limitCount = 0; // 记录新模板有多少个整体, 以便于处理返回的数据!
  // top: 记录 打印元素 top值
  for (let v = 1, top = 0; v <= ver; v++) {
    // left: 记录 打印元素 left值
    for (let h = 1, left = 0; h <= hor; h++) {
      // 3 【拼接】我们需要打印的内容
      // 为了更好理解, 我这里拆分来写, 实际可根据 h 的值, 直接使用 hiprintTemplateMap[h]

      // 3.1. 获取 模板1 的 打印元素, 及 [1][2] 中的 [1]
      if (h == 1) {
        let printElements1 = hiprintTemplateMap[1].getJson().panels[0].printElements;
        printElements1 = printElements1.map((item) => {
          // 偏移量计算
          item.options.top += top;
          item.options.left += left;
          // !! 元素的字段名 肯定不能重复呀! 所以需要特殊处理!!!
          if (item.options.field) {
            // 及变成 字段名 + 第 v 行 第 h 列
            // 如: qrcode 变成 qrcode_1_1 (第 1 行 的 第 1 列)
            item.options.field += `_${v}_${h}`;
          }
          return item;
        });
        template.panels[0].printElements = template.panels[0].printElements.concat(printElements1);
      }
      // 3.2. 获取 模板2 的 打印元素, 及 [1][2] 中的 [2]
      if (h == 2) {
        let printElements2 = hiprintTemplateMap[2].getJson().panels[0].printElements;
        printElements2 = printElements2.map((item) => {
          // 偏移量计算
          item.options.top += top;
          item.options.left += left;
          // !! 元素的字段名 肯定不能重复呀! 所以需要特殊处理!!!
          if (item.options.field) {
            // 及变成 字段名 + 第 v 行 第 h 列
            // 如: qrcode 变成 qrcode_1_1 (第 1 行 的 第 1 列)
            item.options.field += `_${v}_${h}`;
          }
          return item;
        });
        template.panels[0].printElements = template.panels[0].printElements.concat(printElements2);
      }
      // 3.3. 计算 下一列 模板的 left 值
      // eslint-disable-next-line no-undef
      left += hinnn.mm.toPt(105);
      // 记录整体个数
      limitCount++;
    }
    // 3.4 计算下一行 模板的 top 值
    // eslint-disable-next-line no-undef
    top += hinnn.mm.toPt(70);
  }
  console.log(template);
  console.log(limitCount);
  // eslint-disable-next-line no-undef
  $("#printTemplate").empty(); // 先清空, 避免重复构建
  hiprintTemplate = new hiprint.PrintTemplate({
    template: template,
    settingContainer: "#PrintElementOptionSetting", // 元素参数容器
  });
  // 构建 并填充到 容器中
  hiprintTemplate.design("#printTemplate", { grid: true }); // 0.0.46版本新增, 是否显示网格
  // 处理新模板需要的数据
  mergePrintData(ver, hor, limitCount);
};
/**
 * 处理打印数据
 * @param hCount 水平方向, 可以容纳多少个模板
 * @param vCount 垂直方向, 可以容纳多少个模板
 * @param limitCount 新模板有多少个整体
 */
let printData = [];
const mergePrintData = (vCount, hCount, limitCount) => {
  printData = []; // 清空数据
  const len = dataList.length;
  let keys = Object.keys(dataList[0]); // 这里假设 每个模板数据格式一样, 取对象的 key
  let needPanel = Math.ceil(len / limitCount); // 需要多少个这样的面板,才能打印全部的数据
  for (let p = 0, curIndex = 0; p < needPanel; p++) {
    let panelPrintData = {
      page: `共${needPanel}页, 这是第${p + 1}页`,
    }; // 当前面板的打印数据
    for (let v = 1; v <= vCount; v++) {
      for (let h = 1; h <= hCount; h++) {
        if (curIndex >= len) {
          break;
        }
        keys.forEach((key) => {
          panelPrintData[`${key}_${v}_${h}`] = dataList[curIndex][key];
        });
        curIndex++;
      }
    }
    printData.push(panelPrintData);
  }
};
/**
 * 合并左右中模板, 生成新的模板 单列出来(怕你们看不明白)
 * 填满 A4 纸张 (宽:210, 高:297)
 * @param toPaper {String} 我们想要打印的纸张类型
 */
const mergeTemplate2 = (toPaper = "A4") => {
  // 1. 【确定】我们想要打印的内容 -> 及我们实际打印纸张的大小
  const { width, height } = PAPER_TYPE[toPaper];
  let template = {
    panels: [
      {
        index: 0,
        width,
        height,
        paperNumberDisabled: true, // 不使用默认的页面,用下面的元素,自定义页码
        printElements: [
          {
            options: {
              left: 466.5,
              top: 820.5,
              height: 9.75,
              width: 121.5,
              field: "page",
              title: "模拟的页码",
              textAlign: "center",
              hideTitle: true,
            },
            printElementType: {
              title: "文本",
              type: "text",
            },
          },
        ], // 我们实际需要打印的内容
      },
    ],
  };
  // 2. 【捋一捋】合并的模板与我们打印纸张之间的关系
  // 模板1: width: 105, height: 70
  // 模板2: width: 105, height: 70
  // 模板3: width: 210, height: 70
  // 根据这 3 个模板,我们可以估算出, 我们打印的 A4 纸, 可以容纳多少个 这样的模板.
  // 也就是说, 我们需要打印多少个小的打印模板, 才能填满 A4 纸.
  // 把一个模板(多个打印元素) 看成一个整体
  // [1][2]    [1][2]
  // [1][2] 或 [ 3 ]
  // [1][2] 者 [1][2]
  // [1][2]    [ 3 ]
  // 实现第一种情况:
  const ver = parseInt(height / 70); // 垂直方向, 可以容纳多少个模板
  const hor = parseInt(width / 105); // 水平方向, 可以容纳多少个模板
  // !!注意: 模板中的 left、top 单位是 pt;  width、height 单位是 mm
  // !!注意: 模板中的 left、top 单位是 pt;  width、height 单位是 mm
  // !!注意: 模板中的 left、top 单位是 pt;  width、height 单位是 mm
  let limitCount = 0; // 记录新模板有多少个整体, 以便于处理返回的数据!
  // top: 记录 打印元素 top值
  for (let v = 1, top = 0; v <= ver; v++) {
    // 特殊处理!! 插入[1][2]后插入[3]
    // 也就是第 2/4 行的时候
    if (v % 2 == 0) {
      let printElements3 = hiprintTemplateMap[3].getJson().panels[0].printElements;
      printElements3 = printElements3.map((item) => {
        // 偏移量计算
        item.options.top += top;
        // !! 元素的字段名 肯定不能重复呀! 所以需要特殊处理!!!
        if (item.options.field) {
          // 及变成 字段名 + 第 v 行 第 h 列
          // 如: qrcode 变成 qrcode_1_1 (第 1 行 的 第 1 列)
          item.options.field += `_${v}`;
        }
        return item;
      });
      template.panels[0].printElements = template.panels[0].printElements.concat(printElements3);
      // 记录整体个数
      limitCount++;
    } else {
      // left: 记录 打印元素 left值
      for (let h = 1, left = 0; h <= hor; h++) {
        // 3 【拼接】我们需要打印的内容
        // 为了更好理解, 我这里拆分来写, 实际可根据 h 的值, 直接使用 hiprintTemplateMap[h]

        // 3.1. 获取 模板1 的 打印元素, 及 [1][2] 中的 [1]
        if (h == 1) {
          let printElements1 = hiprintTemplateMap[1].getJson().panels[0].printElements;
          printElements1 = printElements1.map((item) => {
            // 偏移量计算
            item.options.top += top;
            item.options.left += left;
            // !! 元素的字段名 肯定不能重复呀! 所以需要特殊处理!!!
            if (item.options.field) {
              // 及变成 字段名 + 第 v 行 第 h 列
              // 如: qrcode 变成 qrcode_1_1 (第 1 行 的 第 1 列)
              item.options.field += `_${v}_${h}`;
            }
            return item;
          });
          template.panels[0].printElements = template.panels[0].printElements.concat(printElements1);
        }
        // 3.2. 获取 模板2 的 打印元素, 及 [1][2] 中的 [2]
        if (h == 2) {
          let printElements2 = hiprintTemplateMap[2].getJson().panels[0].printElements;
          printElements2 = printElements2.map((item) => {
            // 偏移量计算
            item.options.top += top;
            item.options.left += left;
            // !! 元素的字段名 肯定不能重复呀! 所以需要特殊处理!!!
            if (item.options.field) {
              // 及变成 字段名 + 第 v 行 第 h 列
              // 如: qrcode 变成 qrcode_1_1 (第 1 行 的 第 1 列)
              item.options.field += `_${v}_${h}`;
            }
            return item;
          });
          template.panels[0].printElements = template.panels[0].printElements.concat(printElements2);
        }
        // 3.3. 计算 下一列 模板的 left 值
        // eslint-disable-next-line no-undef
        left += hinnn.mm.toPt(105);
        // 记录整体个数
        limitCount++;
      }
    }
    // 3.4 计算下一行 模板的 top 值
    // eslint-disable-next-line no-undef
    top += hinnn.mm.toPt(70);
  }
  console.log(template);
  console.log(limitCount);
  // eslint-disable-next-line no-undef
  $("#printTemplate").empty(); // 先清空, 避免重复构建
  hiprintTemplate = new hiprint.PrintTemplate({
    template: template,
    settingContainer: "#PrintElementOptionSetting", // 元素参数容器
  });
  // 构建 并填充到 容器中
  hiprintTemplate.design("#printTemplate", { grid: true }); // 0.0.46版本新增, 是否显示网格
  // 处理新模板需要的数据
  mergePrintData2(ver, hor, limitCount);
};

/**
 * 处理打印数据 左右中模板, (怕你们看不懂)
 * @param hCount 水平方向, 可以容纳多少个模板
 * @param vCount 垂直方向, 可以容纳多少个模板
 * @param limitCount 新模板有多少个整体
 */
const mergePrintData2 = (vCount, hCount, limitCount) => {
  printData = []; // 清空数据
  const len = dataList.length;
  let keys = Object.keys(dataList[0]); // 这里假设 每个模板数据格式一样, 取对象的 key
  let needPanel = Math.ceil(len / limitCount); // 需要多少个这样的面板,才能打印全部的数据
  for (let p = 0, curIndex = 0; p < needPanel; p++) {
    let panelPrintData = {
      page: `共${needPanel}页, 这是第${p + 1}页`,
    }; // 当前面板的打印数据
    for (let v = 1; v <= vCount; v++) {
      if (v % 2 == 0) {
        if (curIndex >= len) {
          break;
        }
        keys.forEach((key) => {
          panelPrintData[`${key}_${v}`] = dataList[curIndex][key];
        });
        curIndex++;
      } else {
        for (let h = 1; h <= hCount; h++) {
          if (curIndex >= len) {
            break;
          }
          keys.forEach((key) => {
            panelPrintData[`${key}_${v}_${h}`] = dataList[curIndex][key];
          });
          curIndex++;
        }
      }
    }
    printData.push(panelPrintData);
  }
};

/**
 * 获取打印html
 */
const getHtml = () => {
  let html = hiprintTemplate.getHtml(printData);
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
  hiprintTemplate.print(printData, options, ext);
};
</script>

<style>
.modal .wrap .box {
  width: 60% !important;
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
.left .template {
  height: 33.2%;
  border-bottom: 1px solid #d9d9d9;
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
