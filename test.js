/** @format */

let items = document.getElementsByClassName('xsm-utable-body');
let datalist = [];

for (let i = 0; i < items.length; i++) {
  datalist[i] = {
    name: items[i].getElementsByClassName('cgt-name')[0].innerText,
    price: items[i].getElementsByClassName('cgt-col-price')[0].innerText,
    gprice: items[i].getElementsByClassName('cgt-col-guide-price')[0].innerText,
    price: items[i].getElementsByClassName('cgt-col-price')[0].innerText,
    inputRef: items[i].getElementsByClassName('xsm-order-list-shuru-input')[0],
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
newBtn.style.background = '#ccc';
newBtn.style.padding = '8px 15px';
newBtn.style.height = '40px';
newBtn.style.fontSize = '18px';
newBtn.style.color = '#409eff';
newBtn.style.border = '1px solid #dcdfe6';
newBtn.style.borderRadius = '5px';
newDiv.appendChild(newBtn);
newBtn.addEventListener('click', handleClick);

async function handleClick() {
  newBtn.style.backgroundColor = '#409eff';
  newBtn.style.color = '#ffffff';

  for (let i = 0; i < datalist.length; i++) {
    datalist[i].inputRef.focus();
    datalist[i].inputRef.value = 1;
    await sleepFunc(10);
  }

  //   保证可以获取到limit
  await sleepFunc(2000);
  const limitList = document.getElementsByClassName('cgt-col-qtl-lmt');
  for (let i = 0; i < datalist.length; i++) {
    datalist[i].limit = limitList[i].innerText;
  }

  //   找出可用量大于0的，组成indexArr
  let indexArr = [];
  for (let i = 0; i < datalist.length; i++) {
    if (Number(datalist[i].limit) > 0) indexArr.push(i);
  }

  //   并按价格从高到低对indexArr进行排序
  let priceList = [];
  indexArr.forEach((index) => {
    priceList.push({
      oIndex: index,
      price: Number(datalist[index].price),
    });
  });
  priceList.sort((a, b) => b.price - a.price);

  let totalLimit = Number(getElementsByClassName('xsm-limit'???));
  for (let i = 0; i < priceList.length; i++) {
    if (totalLimit > 0) {
      let oIndex = priceList[i].oIndex;
      let limit = datalist[oIndex].limit;
      datalist[oIndex].inputRef.value = limit;
      totalLimit -= limit;
      await sleepFunc(50);
    }
  }

  for (let j = 0; j < datalist.length; j++) {
    if (!priceList.some((item) => item.oIndex === j)) {
      datalist[j].inputRef.focus();
      datalist[j].inputRef.value = 0;
      await sleepFunc(20);
    }
  }

  console.log('script end!!!');
  let tipDiv = document.createElement('div');
  tipDiv.style.fontSize = '18px';
  tipDiv.innerText = '执行完毕！';
  newDiv.appendChild(tipDiv);
}

function sleepFunc(interval) {
  return new Promise((res) => setTimeout(res, interval));
}
