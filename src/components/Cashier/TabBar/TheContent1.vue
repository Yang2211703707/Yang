<!-- @format -->

<script setup lang="ts">
import NewContent from './TheNewContent.vue';
import { watch, reactive } from 'vue';
import type { baseCartItem } from '@/type/cart';

interface props {
  data: baseCartItem[];
}

const props = defineProps<props>();
const localContent1 = localStorage.getItem('tabbar-content1-datalist');
const datalist: baseCartItem[] = reactive(
  localContent1 ? JSON.parse(localContent1) : []
);
watch(datalist, (newDatalist) =>
  localStorage.setItem('tabbar-content1-datalist', JSON.stringify(newDatalist))
);
</script>

<template>
  <NewContent :data="datalist"></NewContent>
</template>

<style lang="less" scoped></style>
