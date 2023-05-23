<!-- @format -->

<script setup lang="ts">
import type { ElInput } from 'element-plus';
import { nextTick, reactive, ref, watch, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Comp1 from './Comp1.vue';

const route = useRoute();
const router = useRouter();
const value = ref('test view');
const flag = ref(true);
const inputRef = ref<InstanceType<typeof ElInput> | null>(null);
watch(flag, async (newFlag) => {
  if (!newFlag) {
    await nextTick();
    inputRef.value?.focus();
  } else inputRef.value?.blur();
});

const comp1Ref = ref<InstanceType<typeof Comp1> | null>(null);
function keepFocus(e: MouseEvent) {
  console.log(
    'test page mousedown, keepFocus...',
    e,
    e.defaultPrevented,
    comp1Ref.value,
    comp1Ref.value?.keepFocus
  );

  comp1Ref.value?.keepFocus();
  //   e.preventDefault();
  console.log(e.defaultPrevented);
  //   if (!e.defaultPrevented) {
  //     console.log(e.defaultPrevented);
  //     e.preventDefault();
  //     inputRef.value?.focus();
  //   } else inputRef.value?.blur();
}

// const page = ref<HTMLElement|null>(null)
// page.value?.addEventListener('mousedown', f1(target))
// function f1 (target:MouseEvent) {
//     target.preventDefault()
// }
</script>

<template>
  <div class="test-view" ref="page" @mousedown.prevent="keepFocus">
    <div class="box">
      <span @click="flag = !flag">change state</span>
      <div v-if="flag">{{ value }}</div>
      <template v-else>
        <el-input
          v-model="value"
          ref="inputRef"
          @click="inputRef?.focus()"
        ></el-input>
      </template>
    </div>

    <Comp1 ref="comp1Ref"></Comp1>

    <div class="box-1">box-1</div>

    <div class="box-2">box-2</div>
    <div class="box-wrap"></div>

    <span class="span-1">span-1</span>
    <span class="span-2">span-2</span>
  </div>
</template>

<style lang="less" scoped>
.box-wrap {
  overflow: hidden;
}
.box-1 {
  background: pink;
  margin-bottom: 20px;
}
.box-2 {
  background: red;
  margin-top: 10px;
}
.span-1 {
  color: red;
  margin-right: 10px;
}
.span-2 {
  color: pink;
  margin-left: 10px;
}

.test-view {
  user-select: none;
  background: skyblue;
  //   overflow: hidden;

  .el-input {
    width: 500px;
  }
}
</style>
