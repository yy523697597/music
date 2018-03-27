/*
 * @Author: yu yi
 * @Date: 2017-11-29 13:51:39
 * @Last Modified by: yu yi
 * @Last Modified time: 2018-03-27 10:28:03
 */

// 打乱数组排序,不会修改原来的数组
export function shuffle(arr) {
  let _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i);
    // 数组解构赋值，交换数组
    [_arr[j], _arr[i]] = [_arr[i], _arr[j]];
  }
  return _arr;
}
// 返回 min-max之间的随机整数
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// 节流函数
export function debounce(func, delay) {
  let timer;
  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// 从地址栏获取参数
export function getQueryString(name, url) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let r = window.location.search.substr(1).match(reg);
  if (url) {
    let s = url.split('?');
    r = s[1] ? s[1].match(reg) : s[0].match(reg);
  }
  if (r != null) return unescape(r[2]);
  return null;
}
