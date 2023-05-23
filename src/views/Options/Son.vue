<!-- @format -->

<script setup lang="ts">
import { computed, inject } from 'vue';

interface props {
  modelValue: string;
  title: string;
  modelModifiers: { default: () => {} };
}

const { num1: father_num1, changeNum1 } = inject('test', {
  num1: 9999,
  changeNum1: () => console.log('changeNum1的默认值'),
});
// const props = defineProps<props>(['modelValue', 'title']);
const props = defineProps<props>();
const emit = defineEmits(['update:modelValue', 'update:title']);
const emitValue = (e: InputEvent) => {
  console.log(e);
  let value = e.target.value;
  if (props.modelModifiers.capitalize)
    value = value.charAt(0).toUpperCase() + value.slice(1);
  emit('update:modelValue', value);
};
const value2 = computed({
  get() {
    return props.title;
  },
  set(value) {
    emit('update:title', value);
  },
});

console.log(props.modelModifiers);
</script>

<template>
  <div style="margin-top: 50px">son component</div>
  <p>father_num1: {{ father_num1 }}</p>
  <p>modelValue: {{ modelValue }}</p>
  <p>value2: {{ value2 }}</p>
  <button @click="changeNum1">点击改变father组件的num1</button>
  <div>
    <input :value="modelValue" @input="emitValue" />
  </div>
  <div>
    <input v-model="value2" />
  </div>
</template>

<style lang="less" scoped></style>
