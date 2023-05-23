<!-- @format -->

<script setup lang="ts">
import { ref } from 'vue';
import CheckOut from '@/components/Home/CheckOut.vue';
</script>

<template>
  <div class="cashier">
    <div class="cashier-main">
      <div class="left">
        <check-out></check-out>
      </div>

      <div class="right">
        <div class="tab-area">tab栏</div>
        <div class="tools-area">功能区</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '@/style/less/home.less';

* {
  box-sizing: border-box;
}

.cashier {
  height: @main_height;

  &-main {
    display: flex;
    height: @main_height;
    width: calc(100vw - @aside_width);

    .left {
      flex: 2;
      flex-shrink: 0;
      background-color: var(--pc-bg-color-white-1);
    }

    .right {
      flex: 3;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      background-color: var(--pc-bg-color-white-2);

      .tab-area {
        flex: 1;
      }

      .tools-area {
        height: @main_footer_height;
      }
    }
  }
}
</style>
