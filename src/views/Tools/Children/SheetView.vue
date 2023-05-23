<!-- @format -->

<script setup lang="ts">
import { reactive, ref } from 'vue';
import * as xlsx from 'xlsx';

import { UploadFilled } from '@element-plus/icons-vue';
import { ElMessage, type UploadFile } from 'element-plus';

import { useGoodsStore } from '@/stores/goods';
import type { baseGoodsItem, goodsItem } from '@/type/goods';

let { goodsList, goodsGenerator } = useGoodsStore();

interface uploadFiles {
  [sheetName: string]: object;
}
const uploadFiles: uploadFiles = ref({}); // 存放多个上传文件的对象
async function onBeforeUpload2(file: any) {
  console.log('onBeforeUpload', file);
  let result: any = await parseFiles(file);
  console.log(result);
  result = result.sheet1;
  console.log('@@@@', result);

  let modifiedRes: goodsItem[] = [];
  for (const key in result) {
    const item: baseGoodsItem = {
      goodsCode: result[key]['条码（货号）'],
      name: result[key]['商品名称'],
      unit: result[key]['规格'],
      category: result[key]['分类'],
      cost: result[key]['成本'],
      price: result[key]['售价'],
      stock: result[key]['数量'],
    };
    let generatorItem = goodsGenerator(item);
    modifiedRes.push(generatorItem);
    goodsList.push(generatorItem);
  }
  //   localStorage.setItem('goosList', JSON.stringify(modifiedRes));
  console.log(modifiedRes);
  uploadFiles.value = modifiedRes;
}
async function onBeforeUpload(file: any) {
  console.log('onBeforeUpload', file);
  let filesObj: any = await parseFiles(file);
  console.log(filesObj);
  const { sheet1 } = filesObj;
  console.log('@@@@', sheet1);

  let modifiedRes: goodsItem[] = [];

  for (const itemObj of sheet1) {
    const item: baseGoodsItem = {
      goodsCode: itemObj['条码（货号）'],
      name: itemObj['商品名称'],
      unit: itemObj['规格'],
      category: itemObj['分类'],
      cost: itemObj['成本'],
      price: itemObj['售价'],
      stock: itemObj['数量'],
    };
    let generatorItem = goodsGenerator(item);

    modifiedRes.push(generatorItem);
    goodsList.push(generatorItem);
  }

  localStorage.setItem('goodsList', JSON.stringify(modifiedRes));
  console.log(modifiedRes);
  uploadFiles.value = modifiedRes;
}
function parseFiles(file: any) {
  return new Promise((res, rej) => {
    const result: uploadFiles = {}; // 存放上传的文件

    if (!file) {
      let msg = '解析文件失败!没有读取到文件...';
      ElMessage({
        message: msg,
        type: 'error',
      });
      rej(msg);
    } else {
      const reader = new FileReader();

      if (RegExp(/.sheet/).test(file.type)) reader.readAsBinaryString(file);
      else if (RegExp(/text/).test(file.type)) reader.readAsText(file);
      else reader.readAsBinaryString(file);

      reader.addEventListener('load', () => {
        const data = reader.result;
        const workbook = xlsx.read(data, { type: 'binary' });
        let flag = 0;

        workbook.SheetNames.forEach((sheetName) => {
          flag += 1;
          let workSheet = workbook.Sheets[sheetName];
          result[`sheet${flag}`] = xlsx.utils.sheet_to_json(workSheet);
        });

        console.log('reader: ', reader, workbook, result);
        if (JSON.stringify(result) != '{}') {
          ElMessage({
            message: '上传成功',
            type: 'success',
          });
          res(result);
        } else rej(result);
      });
    }
  });
}
// function parseFiles(file: any) {
//   const result: uploadFiles = {}; // 存放上传的文件
//   if (!file)
//     ElMessage({
//       message: '解析文件失败!没有读取到文件...',
//       type: 'error',
//     });
//   else {
//     const reader = new FileReader();

//     if (RegExp(/.sheet/).test(file.type)) reader.readAsBinaryString(file);
//     else if (RegExp(/text/).test(file.type)) reader.readAsText(file);

//     reader.addEventListener('load', () => {
//       const data = reader.result;
//       const workbook = xlsx.read(data, { type: 'binary' });
//       let flag = 0;

//       workbook.SheetNames.forEach((sheetName) => {
//         flag += 1;
//         let workSheet = workbook.Sheets[sheetName];
//         result[`sheet${flag}`] = xlsx.utils.sheet_to_json(workSheet);
//       });
//       if (JSON.stringify(result) != '{}')
//         ElMessage({
//           message: '上传成功',
//           type: 'success',
//         });
//     });
//   }

//     return new Promise((res) => {
//       setTimeout(() => {
//         res(result);
//       }, 1000);
//     });
// }
</script>
<!-- 
    headers="http://127.0.0.1:5173"
    https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15
--->
<template>
  <el-upload
    class="upload-demo"
    action=""
    accept=".xls,.xlsx"
    drag
    multiple
    :limit="3"
    :before-upload="onBeforeUpload"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">拖拽文件到此处或 <em>点击上传</em> 文件</div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
</template>

<style lang="less" scoped></style>
