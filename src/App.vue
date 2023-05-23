<!-- @format -->

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn'; // element-plus中文化
import { ref } from 'vue';

const var1 = ref(666);

window.addEventListener('load', handleLoad);
function handleLoad() {
  console.log('is load!!!');
}
</script>

<script lang="ts">
export default {
  data() {
    return {
      var2: 233,
    };
  },
  mounted() {
    console.log('App mounted: ', this, this.var2);
  },
};
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
    <router-view name="NotFound"></router-view>
  </el-config-provider>
</template>

<style lang="less"></style>
