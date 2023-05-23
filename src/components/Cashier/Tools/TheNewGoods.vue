<!-- @format -->

<script setup lang="ts">
import BaseDialog from '@/components/Base/BaseDialog.vue';
import TheContent from './TheNewGoodsContent.vue';

import { ref, watch } from 'vue';
import { useGoodsStore } from '@/stores/goods';
import { ElMessage } from 'element-plus';

interface emit {
  (e: 'close'): void;
}

const emit = defineEmits<emit>();

const visible = ref(true);
watch(visible, (newValue) => {
  if (!newValue) emit('close');
});

const contentRef = ref<InstanceType<typeof TheContent>>();
const { isLegitGoodsCode } = useGoodsStore();
function handleConfirm() {
  let canClose = true;
  let condition1,
    condition2,
    condition3 = false;

  if (contentRef.value) {
    condition1 = isLegitGoodsCode(contentRef.value.goodsCode);
    condition2 = contentRef.value.goodsName == '' ? false : true;
    condition3 = contentRef.value.goodsPrice == '0' ? false : true;
    console.log(condition1, condition2, condition3);
  }

  if (!(condition1 && condition2 && condition3)) canClose = false;

  if (!canClose) {
    ElMessage.closeAll();
    if (!condition1)
      ElMessage({
        message: '条码必须为纯数字且限制为4~16位！\n',
        type: 'warning',
      });
    if (!condition2)
      ElMessage({
        message: '名称不能为空！\n',
        type: 'warning',
      });
    if (!condition3)
      ElMessage({
        message: '售价不能为0！\n',
        type: 'warning',
      });
  } else {
    console.log('ok......');
    visible.value = false;
  }
}
</script>

<template>
  <div class="new-goods">
    <el-dialog
      v-model="visible"
      v-bind="$attrs"
      title="新增商品"
      @confirm-event="handleConfirm"
    >
      <TheContent ref="contentRef"></TheContent>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.new-goods :deep(.el-dialog) {
  &__body {
    padding: 30px 20px;
  }
}
// .new-goods :deep(.el-dialog) {
//   &__header {
//     background: pink;
//   }
//   &__body {
//     padding: 30px 20px !important;
//   }
// }
</style>
