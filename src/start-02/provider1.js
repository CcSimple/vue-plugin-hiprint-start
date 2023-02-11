/*
 * @Description:
 * @Author: CcSimple
 * @Github: https://github.com/CcSimple
 * @Date: 2023-02-09 10:40:26
 * @LastEditors: CcSimple
 * @LastEditTime: 2023-02-09 11:37:21
 */
import { hiprint } from "vue-plugin-hiprint";
export const provider1 = function (options) {
  console.log(options);
  var addElementTypes = function (context) {
    context.removePrintElementTypes("providerModule1");
    context.addPrintElementTypes("providerModule1", [
      new hiprint.PrintElementTypeGroup("常规", [
        options.config,
        {
          tid: "providerModule1.header",
          title: "单据表头",
          data: "单据表头",
          type: "text",
          options: {
            testData: "单据表头",
            height: 17,
            fontSize: 16.5,
            fontWeight: "700",
            textAlign: "center",
            hideTitle: true,
          },
        },
        {
          tid: "providerModule1.type",
          title: "单据类型",
          data: "单据类型",
          type: "text",
          options: {
            testData: "单据类型",
            height: 16,
            fontSize: 15,
            fontWeight: "700",
            textAlign: "center",
            hideTitle: true,
          },
        },
        {
          tid: "providerModule1.order",
          title: "订单编号",
          data: "XS888888888",
          type: "text",
          options: {
            field: "order",
            testData: "XS888888888",
            height: 16,
            fontSize: 6.75,
            fontWeight: "700",
            textAlign: "left",
            textContentVerticalAlign: "middle",
          },
        },
        {
          tid: "providerModule1.date",
          title: "业务日期",
          data: "2020-01-01",
          type: "text",
          options: {
            field: "date",
            testData: "2020-01-01",
            height: 16,
            fontSize: 6.75,
            fontWeight: "700",
            textAlign: "left",
            textContentVerticalAlign: "middle",
          },
        },
        {
          tid: "providerModule1.barcode",
          title: "条形码",
          data: "XS888888888",
          type: "text",
          options: {
            field: "barcode",
            testData: "XS888888888",
            height: 32,
            fontSize: 12,
            lineHeight: 18,
            textAlign: "left",
            textType: "barcode",
          },
        },
        {
          tid: "providerModule1.qrcode",
          title: "二维码",
          data: "XS888888888",
          type: "text",
          options: {
            field: "qrcode",
            testData: "XS888888888",
            height: 32,
            fontSize: 12,
            lineHeight: 18,
            textType: "qrcode",
          },
        },
        {
          tid: "providerModule1.platform",
          title: "平台名称",
          data: "平台名称",
          type: "text",
          options: {
            field: "platform",
            testData: "平台名称",
            height: 17,
            fontSize: 16.5,
            fontWeight: "700",
            textAlign: "center",
            hideTitle: true,
          },
        },
        { tid: "providerModule1.image", title: "Logo", data: "", type: "image" },
      ]),
      new hiprint.PrintElementTypeGroup("客户", [
        {
          tid: "providerModule1.khname",
          title: "客户名称",
          data: "高级客户",
          type: "text",
          options: {
            field: "name",
            testData: "高级客户",
            height: 16,
            fontSize: 6.75,
            fontWeight: "700",
            textAlign: "left",
            textContentVerticalAlign: "middle",
          },
        },
        {
          tid: "providerModule1.tel",
          title: "客户电话",
          data: "18888888888",
          type: "text",
          options: {
            field: "tel",
            testData: "18888888888",
            height: 16,
            fontSize: 6.75,
            fontWeight: "700",
            textAlign: "left",
            textContentVerticalAlign: "middle",
          },
        },
      ]),
    ]);
  };
  return {
    addElementTypes: addElementTypes,
  };
};
