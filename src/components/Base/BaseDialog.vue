<!-- @format -->

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
interface props {
  modelValue: boolean;
  showCancelButton?: boolean;
}
interface emit {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirmEvent'): void;
}

const emit = defineEmits<emit>();
const props = withDefaults(defineProps<props>(), {
  modelValue: false,
  showCancelButton: true,
});
// const { width } = toRefs(props);
// const dialogWidth = computed(() => {
//   const execArr = /(\d+)(px|%)?/g.exec(width?.value + '');
//   if (execArr) {
//     if (execArr[1] && !execArr[2]) return width?.value + 'px';
//     else if (execArr[1] && execArr[2]) return width?.value;
//   } else return '50%';
// });

const handleConfirm = () => {
  emit('confirmEvent');
  //   emit('update:modelValue', false);
};
</script>

<template>
  <div class="base-dialog">
    <el-dialog
      v-model="modelValue"
      v-bind="$attrs"
      @close="emit('update:modelValue', false)"
    >
      <template #header>
        <div class="title">
          <slot name="header">Title</slot>
        </div>
      </template>

      <template #default>
        <slot name="default">content</slot>
      </template>

      <template #footer>
        <slot name="footer">
          <el-button
            v-if="showCancelButton"
            plain
            @click="emit('update:modelValue', false)"
            >取消</el-button
          >
          <el-button type="primary" plain @click="handleConfirm"
            >确定</el-button
          >
        </slot>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
// .base-dialog {
//   :deep(.el-dialog) {
//     // --el-dialog-width: v-bind(dialogWidth);
//     user-select: none;
//     &__header {
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       background: var(--pc-bg-color-red);
//       margin-right: 0;
//       padding: 0;
//       padding-right: 10px;
//       box-sizing: border-box;
//       height: 50px;

//       .title {
//         color: #e6e6e6;
//         font-size: 18px;
//       }
//       .el-dialog__title {
//         color: #e6e6e6;
//       }
//       .el-dialog__headerbtn {
//         top: 0;
//         .el-dialog__close {
//           color: #e6e6e6;
//         }
//       }
//     }
//   }
// }
</style>
