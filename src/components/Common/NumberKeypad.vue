<!-- @format -->

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { forEach } from 'lodash';
import { ref, watch, watchEffect } from 'vue';

type disableTarget =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '.'
  | 'percent'
  | 'del'
  | 'clear'
  | 'confirm';
interface props {
  disableTarget?: disableTarget[];
}
const props = withDefaults(defineProps<props>(), {
  disableTarget: () => [],
});
// 数字软键盘基本信息
const options = [
  {
    label: '7',
    id: 'num_7',
    value: '7',
    disabled: false,
  },
  {
    label: '8',
    id: 'num_8',
    value: '8',
    disabled: false,
  },
  {
    label: '9',
    id: 'num_9',
    value: '9',
    disabled: false,
  },
  {
    label: '删除',
    id: 'char_del',
    value: 'del',
    disabled: false,
  },
  {
    label: '4',
    id: 'num_4',
    value: '4',
    disabled: false,
  },
  {
    label: '5',
    id: 'num_5',
    value: '5',
    disabled: false,
  },
  {
    label: '6',
    id: 'num_6',
    value: '6',
    disabled: false,
  },
  {
    label: '清空',
    id: 'char_clear',
    value: 'clear',
    disabled: false,
  },
  {
    label: '1',
    id: 'num_1',
    value: '1',
    disabled: false,
  },
  {
    label: '2',
    id: 'num_2',
    value: '2',
    disabled: false,
  },
  {
    label: '3',
    id: 'num_3',
    value: '3',
    disabled: false,
  },
  {
    label: '确认(Enter)',
    id: 'char_enter',
    value: 'confirm',
    disabled: false,
  },
  {
    label: '%',
    id: 'char_percent',
    value: 'percent',
    disabled: false,
  },
  {
    label: '0',
    id: 'num_0',
    value: '0',
    disabled: false,
  },
  {
    label: '.',
    id: 'char_point',
    value: '.',
    disabled: false,
  },
];
watch(
  () => props.disableTarget,
  (newTargetList) => {
    newTargetList.forEach((target) => {
      const findIndexRes = options.findIndex(
        (option) => option.value === target
      );
      if (findIndexRes > -1) options[findIndexRes].disabled = true;
    });
  },
  {
    immediate: true,
  }
);

interface emit {
  (e: 'inputEvent', value: string): void;
  (e: 'deleteEvent'): void;
  (e: 'clearEvent'): void;
  (e: 'confirmEvent', value?: string): void;
}
const emit = defineEmits<emit>();
const result = ref('');
// watch(result, (nValue) => {
//   emit('inputEvent', nValue);
//   result.value = '';
// });

// 处理键位点击
function handleClick(e: PointerEvent) {
  if (((e.target as HTMLElement).dataset.disabled as unknown) === 'true')
    return;

  const input = (e.target as HTMLElement).dataset.value;
  if (input === '.') _handleDecimalPoint();
  else if (!Number.isNaN(Number(input))) _handleNumberKey(input);
  else
    switch (input) {
      case 'percent':
        _handlePercentKey();
        break;
      case 'del':
        _handleDeleteKey();
        break;
      case 'clear':
        _handleClearKey();
        break;
      case 'confirm':
        _handleConfirmKey();
        break;
    }
}

const _handleNumberKey = (num: string) => {
  emit('inputEvent', num);
  return;

  //   暂时舍弃以下逻辑
  const index = result.value.indexOf('.');
  const len = result.value.length;
  // 数字输入时限制第一位不为 0 , 且小数不超过 2 位。
  if (len === 0) {
    if (num === '0') {
      ElMessage.closeAll();
      ElMessage({
        message: '第一位为0，无效输入！',
        type: 'warning',
      });
    } else {
      result.value += num;
    }
  } else {
    if (index === -1) result.value += num;
    else {
      let decimal = len - 1 - index;
      if (decimal >= 2) {
        ElMessage.closeAll();
        ElMessage({
          message: '小数最大两位，无效输入！',
          type: 'warning',
        });
      } else result.value += num;
    }
  }
};
const _handleDecimalPoint = () => {
  emit('inputEvent', '.');
  return;

  //   暂时舍弃以下逻辑
  if (result.value.indexOf('.') > -1) return; // result有小数点就不响应添加小数点
  result.value.length === 0 ? (result.value += '0.') : (result.value += '.');
};
const _handlePercentKey = () => {
  ElMessage.closeAll();
  ElMessage({
    message: '即将执行输入%',
    type: 'warning',
  });
};
const _handleDeleteKey = () => {
  emit('deleteEvent');
  return;

  // 暂时舍弃以下逻辑
  let str = result.value;
  if (str.length === 0) return;
  else result.value = str.substring(0, str.length - 1);
};
const _handleClearKey = () => {
  emit('clearEvent');
  return;

  // 暂时舍弃以下逻辑
  result.value = '';
};
const _handleConfirmKey = () => {
  emit('confirmEvent');
  return;

  // 暂时舍弃以下逻辑
  let str = result.value;
  if (str.length === 0) return;
  str = Number(str).toFixed(2); // 经筛选的值不会超过两位，可以放心toFixed
  emit('confirmEvent', str);
  result.value = '';
};
</script>

<template>
  <div class="number-keypad" @click="handleClick">
    <div
      class="item"
      :class="id"
      v-for="{ label, id, value, disabled } in options"
      :key="id"
    >
      <div
        :class="[disabled ? 'disabled' : 'label']"
        :data-value="value"
        :data-disabled="disabled"
      >
        {{ label }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@border: 1px solid #ccc;
@item_h: 75px;

.number-keypad {
  width: 100%;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(4, 1fr);
  border-top: @border;
  margin-top: 20px;
  user-select: none;

  .item {
    box-sizing: border-box;
    height: @item_h;
    line-height: @item_h;
    &:not(.char_enter) {
      border-right: @border;
      border-bottom: @border;
    }

    .label {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 0;
      padding: 0;
      &:active:not(.char_enter .label) {
        background: #f5f5f5;
      }
    }

    .disabled {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 0;
      padding: 0;
      color: #ccc;
    }
  }

  .char_enter {
    height: @item_h * 2;
    line-height: @item_h * 2;
    grid-area: 3 / 4 / 5 / 5;
    .label {
      background: var(--pc-bg-color-red);
      color: #fff;
      &:active {
        background: var(--pc-color-red);
      }
    }

    // grid-row: 4 / 5;
    // grid-row-start: span 2;
  }
}
</style>
