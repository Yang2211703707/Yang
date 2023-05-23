<!-- @format -->

<script setup lang="ts">
import { usePageStateStore } from '@/stores/cashier-state';
import { storeToRefs } from 'pinia';

const { showNewGoodsComp } = storeToRefs(usePageStateStore());
</script>

<template>
  <el-dialog v-model="showNewGoodsComp">
    <template #header>
      <div>new Goods Component</div>
    </template>

    <div>content</div>
  </el-dialog>
</template>

<style lang="less" scoped></style>
