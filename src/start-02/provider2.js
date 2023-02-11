/*
 * @Description:
 * @Author: CcSimple
 * @Github: https://github.com/CcSimple
 * @Date: 2023-02-09 10:40:26
 * @LastEditors: CcSimple
 * @LastEditTime: 2023-02-09 10:50:02
 */
import { hiprint } from "vue-plugin-hiprint";
export const provider2 = function (options) {
  console.log(options);
  var addElementTypes = function (context) {
    context.removePrintElementTypes("providerModule2");
    context.addPrintElementTypes("providerModule2", [
      new hiprint.PrintElementTypeGroup("表格/其他", [
        {
          tid: "providerModule2.table",
          title: "订单数据",
          type: "table",
          options: {
            field: "table",
            fields: [
              { text: "名称", field: "NAME" },
              { text: "数量", field: "SL" },
              { text: "规格", field: "GG" },
              { text: "条码", field: "TM" },
              { text: "单价", field: "DJ" },
              { text: "金额", field: "JE" },
              { text: "备注", field: "DETAIL" },
            ],
          },
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
          footerFormatter: function (options, rows, data, currentPageGridRowsData) {
            console.log(currentPageGridRowsData);
            if (data && data["totalCap"]) {
              return `<td style="padding:0 10px" colspan="100">${"应收金额大写: " + data["totalCap"]}</td>`;
            }
            return '<td style="padding:0 10px" colspan="100">应收金额大写: </td>';
          },
        },
        { tid: "providerModule2.customText", title: "文本", customText: "自定义文本", custom: true, type: "text" },
        {
          tid: "providerModule2.longText",
          title: "长文本",
          type: "longText",
          options: {
            field: "test.longText",
            width: 200,
            testData: "长文本分页/不分页测试",
          },
        },
      ]),
      new hiprint.PrintElementTypeGroup("辅助", [
        {
          tid: "providerModule2.hline",
          title: "横线",
          type: "hline",
        },
        {
          tid: "providerModule2.vline",
          title: "竖线",
          type: "vline",
        },
        {
          tid: "providerModule2.rect",
          title: "矩形",
          type: "rect",
        },
        {
          tid: "providerModule2.oval",
          title: "椭圆",
          type: "oval",
        },
      ]),
    ]);
  };
  return {
    addElementTypes: addElementTypes,
  };
};
