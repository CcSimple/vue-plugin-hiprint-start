/*
 * @Description: 动态创建 provider
 * @Author: CcSimple
 * @Github: https://github.com/CcSimple
 * @Date: 2023-04-02 14:11:51
 * @LastEditors: CcSimple
 * @LastEditTime: 2023-04-02 16:10:18
 */

import { hiprint } from "vue-plugin-hiprint";

/**
 * 这是个说明文档, 用于说明如何自定义 provider
 * 首先需要理解清楚, 自定义 provider 的格式是什么样的
 * 我在 【vue-plugin-hiprint】如何自定义可拖拽元素 provider 一文中, 已经详细介绍了
 * 链接: https://mp.weixin.qq.com/s/n9i1j8hhVJvnlfJRPRtWog
 * 格式如下:
 * @param {Object} options 这是我们实际传入的参数, 一般是一个对象, 里面包含了一些配置信息
 * @return {Object} 返回一个对象, 里面包含了 addElementTypes 方法
 */
// eslint-disable-next-line no-unused-vars
const 格式 = function (options) {
  // 这里的 options 是一个对象, 是我们在使用时传入的
  // 当然你可以自定义有几个参数 如: function (map,options) {}
  console.log(options);
  // 这里的 context 是一个对象, 是由 hiprint 内部执行时回调回来的.
  // 我们可以 log 出来看看
  var addElementTypes = function (context) {
    console.log(context);
  };
  return {
    addElementTypes: addElementTypes,
  };
};

// --------------- 以下是实战示例 ----------------

/**
 * @description 这是一个示例, 如果后端返回的数据,与我们需要的格式不对应, 那么我们可以在这里进行转换
 */
const PRINT_ELEMENT_TYPE_MAP = {
  // 比如后端返回元素类型的是 "txt", 但是我们需要的是 "text"
  txt: "text",
  img: "image",
  // 比如后端返回的 "二维码", 但是我们需要的是 "text"
  qrcode: "text",
  // 比如后端返回的 "条形码", 但是我们需要的是 "text"
  barcode: "text",
  table: "table",
  tableCustom: "table",
  hLine: "hline",
  vLine: "vline",
  rect: "rect",
  oval: "oval",
};

/**
 * 创建一个 provider
 * @param {*} key 这个 key 是用于创建 "唯一" 的 "tid" 的, 一般是用于区分不同的 provider
 * @param {*} options 这个就需要根据实际情况来定义了,根据项目实际情况与后端协商定义
 * @returns Object
 */
const createProvider = function (key, options) {
  const addElementTypes = function (context) {
    // 先清空, 避免重复添加. 如果有特殊需求, 可以不清空
    context.removePrintElementTypes(key);
    // 实际添加 一般分为以下几步:
    // 1. 添加一个key (用于创建 "唯一" 的 "tid" ) -- 对象包含数组: {"key",[]}
    // 2. 添加一个分组 (就是为了给元素分组, 便于展示) -- 对象包含数组: {"分组名称",[]}
    // 3. 添加分组下的元素数组 (实际的元素操作,都在这里进行) -- 数组包含对象 [{元素格式},{元素格式}]

    // 反过来说, 我们就是需要 先 "创建元素数组", 把这个"元素数组"push到 "分组对象"中, 最后把这个"分组对象"push到 "key数组"中
    // 反过来说, 我们就是需要 先 "创建元素数组", 把这个"元素数组"push到 "分组对象"中, 最后把这个"分组对象"push到 "key数组"中
    // 反过来说, 我们就是需要 先 "创建元素数组", 把这个"元素数组"push到 "分组对象"中, 最后把这个"分组对象"push到 "key数组"中

    // 所以我们先来 第 3 步: 创建元素数组
    // 这里的 options.config 是一个数组, 里面包含了后端返回的元素配置信息
    let printElements = options.printElements.map((item) => {
      // 提出来, 方便处理 二维码 条形码;
      // 如果和后端约定好,那么就更简单了,直接把后端返回的数据,直接赋值给 options
      let options = {
        title: item.title, // 在 options 中添加 title, 是可以清空的
        field: item.field,
        testData: item.testData,
        ...item.options, // 可选参数之类的, 或者参数都在这里面
      };
      // 有些元素可以不设置宽高的,比如 table
      item.width && (options.width = item.width);
      item.height && (options.height = item.height);
      // 特殊处理 二维码 条形码
      if (["qrcode", "barcode"].includes(item.type)) {
        options.textType = item.type;
      }
      //   基础打印元素选项
      let printElement = {
        tid: `${key}.${item.id}`, // 确保不重复就行
        title: item.title, // 这个 title 清空了,还是会有这个默认值
        type: PRINT_ELEMENT_TYPE_MAP[item.type], // 转换后端返回的元素类型
        options: options,
      };
      // 特殊处理 表格 (表格参比较多咯~~~)
      if (["table", "tableCustom"].includes(item.type)) {
        // 根据实际情况 进行处理
        if (item.columns) {
          printElement.columns = item.columns;
        } else {
          printElement.columns = [
            [
              { align: "center", width: 100 },
              { align: "center", width: 100 },
            ],
          ];
        }
        return printElement;
      }
      return printElement;
    });
    // 第 2 步: 创建分组对象
    // 如果 是多个分组, 就再套一层循环就好了
    let printElementGroup = new hiprint.PrintElementTypeGroup(options.groupName, printElements);
    // 第 1 步: 添加到 key 数组中
    context.addPrintElementTypes(key, [printElementGroup]);
  };
  return {
    addElementTypes: addElementTypes,
  };
};

/**
 * 创建多个 provider
 * @param {*} optionList 参数列表
 * @returns Array
 */
const createProviderList = function (optionList) {
  const providers = optionList.map((item) => {
    return createProvider(item.key, item.options);
  });
  // 当你不清楚的时候, 可以 log 出来看看
  return providers;
};

// --------------- 以上是实战示例 ----------------

export default { createProvider, createProviderList };
