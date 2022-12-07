<script setup lang="ts">
import { Uuid } from '@/utils/Uuid';

// 利用时间点做后缀，加随机数方式获取UUID
function uuid() {
  var tm = Date.now().toString(16);
  var tmp = 'asxxxxxx-yxxx-2xxx-yxxx-yxxxxxxxxxxx'.slice(0, -tm.length);
  return (
    tmp.replace(/[xy]/g, (c) => {
      var r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    }) + tm
  );
}

// URL.createObjectURL 方法返回的 URL 会带上一段 36 位长的字符串，和 UUID 的长度一致
function uuidBlob() {
  var temp_url = URL.createObjectURL(new Blob());
  var uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url);
  return uuid.substring(uuid.lastIndexOf('/') + 1);
}

// 可以固定某几个值不变，通过Math.random()获取随机数，并正则掉设置的默认字符
function guid() {
  return 'asxxxxxx-xxxx-2xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 封装一个随机数四个字符的函数，循环调用生成整个UUID
function guid2() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  );
}

// 通过Math.random()生成一个随机数组，拼接成字符串，支持自定义字符
function uuidDig() {
  var s: any = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    var r = Math.floor(Math.random() * 0x10);
    s[i] = hexDigits.substring(r, r + 1);
  }
  s[14] = '4';
  var v = (s[19] & 0x3) | 0x8;
  s[19] = hexDigits.substring(v, v + 1);
  s[8] = s[13] = s[18] = s[23] = '-';
  return s.join('');
}

// 指定长度和基数，默认就是普通的uuid，支持自定义字符
function uuidOpt(len: number, radix: number) {
  var chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid: any = [],
    i: number;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)];
    }
  } else {
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        var r: number = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}

const uuidObj: any = {
  Uuid1: Uuid(),
  Uuid2: Uuid('as', 16),
  Uuid22: Uuid('pr', 32),
  Uuid5: Uuid('ak', 10),
  uuid: uuid(),
  uuidBlob: uuidBlob(),
  guid: guid(),
  uuidDig: uuidDig(),
  guid2: guid2(),
  uuid3: uuidOpt(0, 0),
  uuidOpt: uuidOpt(20, 50),
};
</script>

<template>
  <h1>UUID</h1>
  <div v-for="item in uuidObj" class="uuid">
    <div v-for="s in item">{{ s }}</div>
  </div>
</template>

<style scoped lang="scss">
.uuid {
  div {
    display: inline-block;
    width: 20px;
    text-align: center;
  }
}
</style>
