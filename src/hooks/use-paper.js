/*
 * @Description:
 * @Author: CcSimple
 * @Github: https://github.com/CcSimple
 * @Date: 2023-02-09 13:32:39
 * @LastEditors: CcSimple
 * @LastEditTime: 2023-02-09 23:38:03
 */
import { reactive, computed, toRefs } from "vue";
import { getHiprintPrintTemplate } from "../utils/template-helper";

/**
 * vue3 组合式函数
 * 把一些逻辑抽离出来，方便复用
 * 返回 使用方 可用的方法和数据
 */
export function usePaper(key) {
  // 数据
  const state = reactive({
    curPaper: {
      type: "A4",
      width: 210,
      height: 296.6,
    },
    paperTypes: {
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
    },
    // 自定义纸张
    paperPopVisible: false,
    paperWidth: "220",
    paperHeight: "80",
  });
  // 计算属性
  const curPaperType = computed(() => {
    let type = "other";
    let types = state.paperTypes;
    for (const key in types) {
      let item = types[key];
      let { width, height } = state.curPaper;
      if (item.width === width && item.height === height) {
        type = key;
      }
    }
    return type;
  });
  const tp = () => {
    return getHiprintPrintTemplate(key);
  };
  // 方法
  const showPaperPop = () => {
    state.paperPopVisible = true;
  };
  const hidePaperPop = () => {
    state.paperPopVisible = false;
  };
  const setPaper = (type, value) => {
    try {
      if (Object.keys(state.paperTypes).includes(type)) {
        state.curPaper = { type: type, width: value.width, height: value.height };
        tp().setPaper(value.width, value.height);
      } else {
        state.curPaper = { type: "other", width: value.width, height: value.height };
        tp().setPaper(value.width, value.height);
      }
    } catch (error) {
      alert(`操作失败: ${error}`);
    }
  };
  const setPaperOther = () => {
    let value = {};
    value.width = state.paperWidth;
    value.height = state.paperHeight;
    state.paperPopVisible = false;
    setPaper("other", value);
  };
  // 暴露给使用方
  return {
    ...toRefs(state),
    curPaperType,
    showPaperPop,
    hidePaperPop,
    setPaper,
    setPaperOther,
  };
}
