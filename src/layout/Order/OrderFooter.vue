<!-- @format -->

<script setup lang="ts">
import { ref } from 'vue';

const currentPage = ref(1);
const pageSize = ref(30);
const background = ref(true);
const handleSizeChange = (e: any) => {
  console.log('handleSizeChange', e);
};
const handleCurrentChange = (e: any) => {
  console.log('handleCurrentChange', e);
};
</script>

<template>
  <el-pagination
    v-model:currentPage="currentPage"
    v-model:page-size="pageSize"
    :background="background"
    layout="prev, pager, next, jumper"
    :total="200"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<style lang="less" scoped>
.el-pagination {
  :deep(.el-pager li) {
    margin: 0 8px;
  }
}
</style>
