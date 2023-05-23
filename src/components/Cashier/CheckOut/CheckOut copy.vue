<!-- @format -->

<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useCartStore } from '@/stores/cart';

import { Close } from '@element-plus/icons';
import PriceDialog from './PriceDialog/PriceDialog.vue';

import { usePageStateStore } from '@/stores/cashier-state';

import type { cartItem } from '@/type/cart';
import type { ElInputNumber } from 'element-plus';

const cartStore = useCartStore();
const { cart, itemCount, cartAmount } = storeToRefs(cartStore);

interface priceDialog {
  dialog_state: boolean;
  amend_price: number;
  amend_count: number;
  amend_discount: number;
  amend_amount: number;
}
const priceDialog: priceDialog[] = reactive([]);
function openPriceDialog(index: number, item: cartItem) {
  priceDialog[index] = {
    dialog_state: true,
    amend_price: item.temp_price,
    amend_count: item.count,
    amend_discount: item.discount,
    amend_amount: item.temp_price * item.count,
  };
}
const priceDialogConfirm = (price: number, count: number, discount: number) => {
  const index = priceDialog.findIndex((item) => {
    if (item) return item.dialog_state;
  });
  console.log('checkout 组件收到更改后的价格：', price, index);

  if (index === -1) return;
  priceDialog[index].dialog_state = false;
  //   priceDialog[index].amend_price = price;
  cart.value[index].temp_price = price;
  cart.value[index].count = count;
  cart.value[index].discount = discount;
};
const closePriceDialog = () => {
  // 找出当前打开的dialog
  const index = priceDialog.findIndex((item) => {
    if (item) return item.dialog_state;
  });

  if (index === -1) return;
  priceDialog[index].dialog_state = false;
};

const countInputRefArr = ref<InstanceType<typeof ElInputNumber>[]>([]);
const cashier_recoverDefault = (index: number) => {
  pageState.cashier_preventDefault = false;
  countInputRefArr.value[index]!.focus();
};
const cashier_preventDefault = () => {
  pageState.cashier_preventDefault = true;
};

const pageState = usePageStateStore();
watchEffect(() => {
  const findRes = priceDialog.find((item) => {
    if (item) return item.dialog_state;
  });
  if (findRes) pageState.cashier_preventDefault = false;
  else pageState.cashier_preventDefault = true;
});

const showClearCartTips = ref(false);
</script>

<template>
  <div class="checkout">
    <header class="checkout-header">
      <div>
        商品数量：<span class="count">{{ itemCount }}</span>
      </div>

      <el-button
        type="warning"
        class="clear-btn"
        plain
        @click="showClearCartTips = true"
        >清空</el-button
      >
      <el-dialog
        v-model="showClearCartTips"
        class="clear-cart-dialog"
        width="30%"
        title="系统提示"
        align-center
      >
        <p class="tips">确定要清空当前购物车？</p>
        <div class="footer">
          <el-button
            class="cancel"
            size="large"
            @click="showClearCartTips = false"
            >取消</el-button
          >
          <el-button
            class="confirm"
            size="large"
            @click="
              () => {
                cartStore.cart.length = 0;
                showClearCartTips = false;
              }
            "
            >确定</el-button
          >
        </div>
      </el-dialog>
    </header>

    <section class="checkout-section">
      <el-scrollbar>
        <div class="cart-list">
          <div class="item" v-for="(item, index) in cart" :key="item.goodsCode">
            <div class="item-clear">
              <el-button
                :icon="Close"
                circle
                @click="cartStore.delToCart(item.goodsCode)"
              />
            </div>

            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-price" @click="openPriceDialog(index, item)">
                ￥{{ item.temp_price.toFixed(2) }}
              </div>
            </div>

            <PriceDialog
              v-if="priceDialog[index] && priceDialog[index].dialog_state"
              :visible="priceDialog[index].dialog_state"
              :item="item"
              @confirm-event="priceDialogConfirm"
              @close-dialog-event="closePriceDialog"
            ></PriceDialog>

            <div class="count-amend">
              <el-input-number
                v-model="cart[index].count"
                ref="countInputRefArr"
                :min="1"
                :max="9999"
                :precision="0"
                @click="cashier_recoverDefault(index)"
                @blur="cashier_preventDefault"
              />
              <div class="amount">
                ￥{{ (item.temp_price * item.count).toFixed(2) }}
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </section>

    <footer class="checkout-footer">
      <div class="hang-up">
        <el-icon><i class="iconfont icon-baobiaochakan"></i></el-icon>
        <span>取/挂单</span>
      </div>

      <div class="cart-amount">
        商品总额：<span class="amount">￥{{ cartAmount }}</span>
        <span class="unit">元</span>
      </div>

      <div class="settle">
        <el-icon><i class="iconfont icon-jiezhang1"></i></el-icon>
        <span>结算</span>
      </div>
    </footer>
  </div>
</template>

<style lang="less" scoped>
@import '@/style/less/cashier.less';

.checkout {
  display: flex;
  flex-direction: column;
  height: @checkout_height;

  .checkout-header {
    height: @checkout_header_height;
    flex-shrink: 0;
    .page-padding();
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--pc-bg-color-white);
    font-size: 14px;
    user-select: none;
    box-sizing: border-box;
    border-bottom: 1px solid skyblue;
    // .count {
    // }
    .clear-btn {
      padding: 12px 20px;
    }
    .clear-cart-dialog {
      .tips {
        height: 100px;
        line-height: 100px;
        text-align: center;
        font-size: 18px;
        background: #ecf5ff;
      }
      .footer {
        padding: 12px 20px;
        border-top: 1px solid #ccc;
        display: flex;
        justify-content: flex-end;

        .el-button {
          padding: 0 30px;
          &:not(:first-child) {
            margin-left: 20px;
          }
        }
        .cancel {
          background: #f5f5f5;
        }
        .confirm {
          background: var(--pc-bg-color-red);
          color: #e6e6e6;
        }
      }
    }
  }

  .checkout-section {
    height: ~'calc(@{checkout_height} - @{checkout_header_height} - @{checkout_footer_height})';
    .page-padding();
    padding-right: 0;

    .cart-list {
      box-sizing: border-box;
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: @checkout_goods_item_height;
        box-sizing: border-box;
        padding-right: 10px;
        &:not(:last-child) {
          border-bottom: 1px solid var(--pc-color--yellow-1);
        }

        .item-clear {
          flex-shrink: 0;
          padding: 0 10px;
          margin-right: 5px;
        }

        .item-info {
          flex: 1;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: 100%;
          box-sizing: border-box;
          padding-top: 5px;
          width: 0;

          .item-name {
            font-size: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .item-price {
            color: var(--pc-color--blue-1);
          }
        }
        :deep(.el-dialog) {
          width: 500px;
          &__header {
            background: var(--pc-bg-color-red);
            margin-right: 0;
            padding-right: 10px;
            .el-dialog__title {
              color: #e6e6e6;
            }
          }
          &__body {
            padding: 0;
            .row-1 {
              height: 60px;
              padding-left: 10px;
              border-bottom: 1px solid #ccc;
              .el-col {
                display: flex;
                align-items: center;
                font-size: 16px;
                .price {
                  font-size: 18px;
                  margin-left: 10px;
                }
              }
            }

            .row-2 {
              padding: 10px 20px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px 20px;
              .el-col {
                font-size: 16px;
              }
              .el-input {
                height: 40px;
              }
              .total {
                height: 60px;
                padding-top: 30px;
              }
              .el-input:nth-child(1) .el-input__inner {
                margin-left: 10px;
              }
              .el-col:nth-child(2) {
                height: 60px;
                padding-top: 20px;
                .el-input-number {
                  width: 80%;
                }
              }
            }
          }
        }

        .count-amend {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          height: 100%;
          :deep(.el-input-number) {
            width: 120px;
          }

          .amount {
            color: var(--pc-color--blue-1);
            font-size: 1.2em;
          }
        }
      }
    }
  }

  .checkout-footer {
    box-sizing: border-box;
    border-top: 1px solid skyblue;
    &:extend(.checkout .checkout-header);
    height: @checkout_footer_height;
    padding: 0 15px;

    .hang-up {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      height: ~'calc(@{checkout_footer_height} * 0.8)';
      width: ~'calc(@{checkout_footer_height} * 1)';
      padding: 0 10px;
      border: 1px solid var(--pc-bg-color-white-2);
      border-radius: 5%;
      font-size: 16px;
      user-select: none;

      span {
        margin-top: 5px;
      }
    }

    .cart-amount {
      font-size: 18px;
      .amount {
        color: var(--pc-color--blue-1);
        margin-right: 4px;
        font-size: 1.5em;
      }
      .unit {
        font-size: 14px;
      }
    }

    .settle {
      &:extend(.checkout .checkout-footer .hang-up all);
      background-color: var(--pc-bg-color-red);
      border: 1px solid var(--pc-color-red);
      height: ~'calc(@{checkout_footer_height} * 0.8)';
      width: ~'calc(@{checkout_footer_height} * 1.3)';
      color: var(--pc-bg-color-white-1);
    }
  }
}
</style>
