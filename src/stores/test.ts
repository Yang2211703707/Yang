/** @format */

import { defineStore } from 'pinia';

export const useTestStore = defineStore('test', {
  state: () => {
    return {
      counter: 0,
    };
  },
  getters: {
    dCounter: (state) => state.counter * 2,
  },
  actions: {
    add() {
      console.log('add');
      this.counter++;
    },
  },
});
