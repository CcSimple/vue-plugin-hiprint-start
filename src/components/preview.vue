<!--
 * @Description: 
 * @Author: CcSimple
 * @Github: https://github.com/CcSimple
 * @Date: 2023-02-16 14:35:38
 * @LastEditors: CcSimple
 * @LastEditTime: 2023-04-11 13:40:27
-->
<template>
  <div class="modal" v-if="show">
    <div class="wrap" @click="close">
      <div class="box">
        <div class="modal-box__header" @click.stop="">预览</div>
        <div class="preview-body" style="max-height: 50vh; overflow: auto">
          <div class="container"></div>
        </div>
        <div class="modal-box__footer">
          <button class="primary" @click="close">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
let $ = require("jquery");
export default {
  name: "start-preview",
  setup() {
    const show = ref(false);
    const close = () => {
      show.value = false;
    };
    const showModal = (...html) => {
      show.value = true;
      do {
        setTimeout(() => {
          $(".container").empty();
          $(".container").html(html);
        }, 200);
        return;
      } while ($(".container").length <= 0);
    };
    return {
      show,
      close,
      showModal,
    };
  },
};
</script>

<style>
/* 不同模板 间隙 */
.container .hiprint-printTemplate {
  background: #fff;
  border-bottom: 10px solid #ccc;
}
/* 批量打印 间隙 */
.container .hiprint-printTemplate .hiprint-printPanel:not(:last-of-type) {
  border-bottom: 5px solid #ccc;
}
</style>
<style scoped>
.preview-body {
  background: #ccc;
  padding: 14px 0;
  display: flex;
  justify-content: center;
}
</style>
