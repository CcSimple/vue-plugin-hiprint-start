/*
 * @Description: 模拟网络请求得到的数据
 * @Author: CcSimple
 * @Github: https://github.com/CcSimple
 * @Date: 2023-04-02 15:14:15
 * @LastEditors: CcSimple
 * @LastEditTime: 2023-04-02 16:17:53
 */

// 配合 provider-helper.js 使用
const data1 = {
  key: "NetProvider2-1",
  options: {
    groupName: "NetProvider2-1分组名称",
    printElements: [
      {
        id: "name",
        type: "txt", // 这里的 type 是后端返回的, 需要转换成 hiprint 的 type
        width: 100,
        height: 20,
        title: "名称2-1",
        field: "name",
        testData: "名称2-1",
        // 协商的可选参数, 没有可选参数就返回 {}
        options: {
          fontSize: 12,
          color: "#f00808",
        },
      },
      {
        id: "logo",
        type: "img",
        width: 100,
        height: 100,
        title: "logo2-1",
        field: "logo",
        options: {
          src: "https://foruda.gitee.com/avatar/1677050350324030848/5400665_ccsimple_1591166830.png!avatar200",
        },
      },
    ],
  },
};
const data2 = {
  key: "NetProvider2-2",
  options: {
    groupName: "NetProvider2-2分组名称",
    printElements: [
      {
        id: "barcode",
        type: "barcode",
        width: 100,
        height: 20,
        title: "条形码",
        field: "barcode",
        testData: "1234567890",
      },
      {
        id: "qrcode",
        type: "qrcode",
        width: 100,
        height: 100,
        title: "二维码",
        field: "qrcode",
        testData: "1234567890",
      },
    ],
  },
};
const data3 = {
  key: "NetProvider2-3",
  options: {
    groupName: "NetProvider2-3分组名称",
    printElements: [
      {
        id: "hLine",
        type: "hLine", // 这里的 type 是后端返回的, 需要转换成 hiprint 的 type
        title: "横线",
      },
      {
        id: "vLine",
        type: "vLine",
        title: "竖线",
      },
      {
        id: "rect",
        type: "rect",
        title: "矩形",
      },
      {
        id: "oval",
        type: "oval",
        title: "圆形",
      },
    ],
  },
};

export default [data1, data2, data3];
