<!-- @format -->

<script setup lang="ts">
import { provide, ref, type Ref } from 'vue';
import Son from './Son.vue';
import BaseDialog from '@/components/Base/BaseDialog.vue';

const num1 = ref(1);
const changeNum1 = (): void => {
  num1.value += 2;
};
provide<{ num1: Ref<number>; changeNum1: () => void }>('test', {
  num1: num1,
  changeNum1: changeNum1,
});

const searchText = ref('');
const bookTitle = ref('');
const showDialog = ref(false);
</script>

<template>
  <div>father component</div>
  <p @click="num1 += 1">num1: {{ num1 }}</p>
  <hr />
  <p>searchText: {{ searchText }}</p>
  <p @click="searchText += 'a'">点击searchText + a</p>
  <Son v-model.capitalize="searchText" v-model:title="bookTitle"></Son>
  <button @click="showDialog = !showDialog">
    {{ showDialog ? '隐藏' : '显示' }}
  </button>
  <BaseDialog
    v-model:visible="showDialog"
    append-to-body
    width="300px"
    class="base-dialog"
  ></BaseDialog>
</template>

<style lang="less" scoped>
.base-dialog {
  :deep(.el-dialog) {
    // --el-dialog-width: v-bind(dialogWidth);
    user-select: none;
    &__header {
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--pc-bg-color-red);
      margin-right: 0;
      padding: 0;
      padding-right: 10px;
      box-sizing: border-box;
      height: 50px;

      .title {
        color: #e6e6e6;
        font-size: 18px;
      }
      .el-dialog__title {
        color: #e6e6e6;
      }
      .el-dialog__headerbtn {
        top: 0;
        .el-dialog__close {
          color: #e6e6e6;
        }
      }
    }
  }
}
</style>
