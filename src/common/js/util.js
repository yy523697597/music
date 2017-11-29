/*
 * @Author: yu yi
 * @Date: 2017-11-29 13:51:39
 * @Last Modified by: yu yi
 * @Last Modified time: 2017-11-29 15:23:10
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
