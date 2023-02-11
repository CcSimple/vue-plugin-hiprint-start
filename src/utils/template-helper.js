/*
 * @Description:
 * @Author: CcSimple
 * @Github: https://github.com/CcSimple
 * @Date: 2023-02-09 23:26:18
 * @LastEditors: CcSimple
 * @LastEditTime: 2023-02-09 23:35:20
 */
import { hiprint } from "vue-plugin-hiprint";

const templateMap = {};

export function newHiprintPrintTemplate(key, options) {
  let template = new hiprint.PrintTemplate(options);
  templateMap[key] = template;
  return template;
}

export function getHiprintPrintTemplate(key) {
  return templateMap[key];
}
