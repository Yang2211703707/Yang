<!-- @format -->

<script setup lang="ts">
import type { ElInput } from 'element-plus';
import { ref, watchEffect } from 'vue';

const value = ref('comp1');
const flag = ref(true);
const inputRef = ref<InstanceType<typeof ElInput> | null>(null);
watchEffect(() => {
  if (!inputRef.value) return;

  if (flag.value) {
    inputRef.value.focus();
    // inputRef.value.select();
  } else {
    inputRef.value.blur();
  }
});

function keepFocus(e?: MouseEvent) {
  console.log('comp1 mousedown, keepFocus...', e);
  inputRef.value?.focus();
}

defineExpose({
  keepFocus,
});
</script>

<template>
  <div class="comp1">
    <button @click="keepFocus">test1</button>
    <span v-if="!flag" @click="flag = true">focus</span>
    <span v-else @click="flag = false">blur</span>
    <el-input v-model="value" ref="inputRef"></el-input>
  </div>
</template>

<style lang="less" scoped>
.comp1 {
  border-top: 3px dotted hotpink;
  border-bottom: 3px dotted hotpink;
  padding: 10px 10px;
  user-select: none;
  display: flex;
  align-items: center;
  .el-input {
    width: 300px;
  }
}
</style>
