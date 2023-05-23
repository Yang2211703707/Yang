/** @format */
import { onMounted, ref } from 'vue';

export const useDatePicker = () => {
  const date = new Date();
  const defaultTime = [
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59),
  ];

  const dateValue = ref<Date[]>([]);
  const shortcuts = [
    {
      text: '今天',
      value: () => {
        const _date = new Date();
        const year = _date.getFullYear();
        const month = _date.getMonth();
        const date = _date.getDate();
        const start = new Date(year, month, date, 0, 0, 0);
        const end = new Date(year, month, date, 23, 59, 59);
        return [start, end];
      },
    },
    {
      text: '昨天',
      value: () => {
        const _date = new Date();
        const year = _date.getFullYear();
        const month = _date.getMonth();
        const date = _date.getDate();
        const start = new Date(year, month, date - 1, 0, 0, 0);
        const end = new Date(year, month, date - 1, 23, 59, 59);
        return [start, end];
      },
    },
    {
      text: '近三天',
      value: () => {
        const _date = new Date();
        const year = _date.getFullYear();
        const month = _date.getMonth();
        const date = _date.getDate();
        const start = new Date(year, month, date - 3, 0, 0, 0);
        const end = new Date(year, month, date, 23, 59, 59);
        return [start, end];
      },
    },
    {
      text: '上周',
      value: () => {
        const _date = new Date();
        const year = _date.getFullYear();
        const month = _date.getMonth();
        const date = _date.getDate();
        const start = new Date(year, month, date - 7, 0, 0, 0);
        const end = new Date(year, month, date, 23, 59, 59);
        return [start, end];
      },
    },
    {
      text: '一个月',
      value: () => {
        const _date = new Date();
        const year = _date.getFullYear();
        const month = _date.getMonth();
        const date = _date.getDate();
        const start = new Date(year, month - 1, date, 0, 0, 0);
        const end = new Date(year, month - 1, date, 23, 59, 59);
        return [start, end];
      },
    },
    {
      text: '三个月',
      value: () => {
        const _date = new Date();
        const year = _date.getFullYear();
        const month = _date.getMonth();
        const date = _date.getDate();
        const start = new Date(year, month - 3, date, 0, 0, 0);
        const end = new Date(year, month, date, 23, 59, 59);
        return [start, end];
      },
    },
  ];
  onMounted(() => (dateValue.value = defaultTime));

  return { dateValue, shortcuts };
};
