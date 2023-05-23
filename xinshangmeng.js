/** @format */
const items = document.getElementsByClassName('xsm-utable-body');
const datalist = [];
for (let i = 0; i < items.length; i++) {
  datalist[i] = {
    name: items[i].getElementsByClassName('cgt-name')[0].innerText,
    price: items[i].getElementsByClassName('cgt-col-price')[0].innerText,
    gprice: items[i].getElementsByClassName('cgt-col-guide-price')[0].innerText,
    price: items[i].getElementsByClassName('cgt-col-price')[0].innerText,
    inputList: items[i].getElementsByClassName('xsm-order-list-shuru-input')[0],
    order: items[i].getElementsByClassName('cgt-col-ord')[0].innerText,
    limit: items[i].getElementsByClassName('cgt-col-qtl-lmt')[0].innerText,
  };
}

let newDiv = document.createElement('div');
newDiv.style.background = 'pink';
newDiv.style.position = 'fixed';
newDiv.style.top = '10%';
newDiv.style.left = '2%';
newDiv.style.minWidth = '200px';
newDiv.style.minHeight = '500px';
newDiv.style.display = 'flex';
newDiv.style.justifyContent = 'flex-start';
newDiv.style.alignItems = 'center';
newDiv.style.flexDirection = 'column';
document.body.appendChild(newDiv);

let newBtn = document.createElement('button');
newBtn.innerText = '点击运行脚本';
newBtn.style.background = '#b9ffff';
newBtn.style.padding = '8px 15px';
newBtn.style.height = '40px';
newBtn.style.fontSize = '18px';
newBtn.style.color = '#409eff';
newBtn.style.border = '1px solid #dcdfe6';
newBtn.style.borderRadius = '5px';
newDiv.appendChild(newBtn);
newBtn.addEventListener('click', async () => {
  newBtn.style.backgroundColor = '#409eff';
  newBtn.style.color = '#ffffff';

  for (let i = 0; i < datalist.length; i++) {
    datalist[i].inputList.focus();
    datalist[i].inputList.value = 1;
    await sleepFunc(10);
    datalist[i].limit =
      document.getElementsByClassName('cgt-col-qtl-lmt')[0].innerText;
  }

  const indexArr = [];
  datalist.forEach((item, index) => {
    if (Number(item.limit) > 0) {
      indexArr.push(index);
    }
  });
  const priceSortList = [];
  indexArr.forEach((index) => {
    priceSortList.push(Number(datalist[index].price));
  });
  priceSortList.sort((a, b) => b - a);
  priceSortList.forEach((price, index) => {
    indexArr[index] = datalist.findIndex((item) => Number(item.price) == price);
  });

  indexArr.forEach((index) => {
    datalist[index].inputList.value = Number(datalist[index].limit);
  });
  //   获取可用量列表，并记录下可用量 > 0 的下标，将下标存入 indexArr
  //   遍历 indexArr，把价格列表对应下标的元素提取出来，组成价格列表，然后从高到低排列价格列表
  //   遍历排序过的价格列表，找到每个在原价格数组对应的下标，并更新回 indexArr
  //   遍历 indexArr，根据下标获取对应的可用量，把可用量赋值给对应的 inputList 子元素。
  //   最后，单击两次 可用量 表头进行排序。
});

function sleepFunc(interval) {
  return new Promise((res) => setTimeout(() => res(), interval));
}
// function sleepFunc(interval) {
//   return new Promise((res) => {
//     setTimeout(() => {
//       res();
//     }, interval);
//   });
// }
