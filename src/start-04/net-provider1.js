/*
 * @Description: 模拟网络请求得到的数据
 * @Author: CcSimple
 * @Github: https://github.com/CcSimple
 * @Date: 2023-04-02 15:14:15
 * @LastEditors: CcSimple
 * @LastEditTime: 2023-04-02 15:47:33
 */

// 配合 provider-helper.js 使用
const data = {
  key: "NetProvider1",
  options: {
    groupName: "NetProvider1分组名称",
    printElements: [
      {
        id: "name",
        type: "txt", // 这里的 type 是后端返回的, 需要转换成 hiprint 的 type
        width: 100,
        height: 20,
        title: "名称",
        field: "name",
        testData: "名称1",
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
        title: "logo",
        field: "logo",
        options: {
          src: "https://foruda.gitee.com/avatar/1677050350324030848/5400665_ccsimple_1591166830.png!avatar200",
        },
      },
      {
        id: "table",
        type: "table",
        title: "空白表格",
        field: "table",
        options: {},
      },
      {
        id: "tableCustom",
        type: "tableCustom",
        title: "默认表格",
        field: "table",
        options: {},
        columns: [
          [
            { title: "名称", align: "center", field: "NAME", width: 100 },
            { title: "数量", align: "center", field: "SL", width: 100 },
            { title: "条码", align: "center", field: "TM", width: 100 },
            { title: "规格", align: "center", field: "GG", width: 100 },
            { title: "单价", align: "center", field: "DJ", width: 100 },
            { title: "金额", align: "center", field: "JE", width: 100 },
            { title: "备注", align: "center", field: "DETAIL", width: 100 },
          ],
        ],
      },
    ],
  },
};

export default data;
