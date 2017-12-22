import storage from 'good-storage';

// 使用双下划线，避免命名重复
const SEARCH_KEY = '__search__';
// 搜索数组最大存储条数
const SEARCH_MAX_LENGTH = 15;

/**
 *
 *
 * @author yu yi
 * @export
 * @param {any} query 要缓存的字段
 */
// 保存搜索历史
export function saveSearch(query) {
  // 获取搜索数组，如果没有的话，就返回默认的空数组
  let searches = storage.get(SEARCH_KEY, []);
  // 将要缓存的字段，添加到搜索数组的第一位
  insertArray(
    searches,
    query,
    item => {
      return item === query;
    },
    SEARCH_MAX_LENGTH
  );
  // 缓存搜索数组
  storage.set(SEARCH_KEY, searches);
  // 返回搜索数组
  return searches;
}

// 删除搜索历史
export function deleteSearchHistory(query) {
  let searches = storage.get(SEARCH_KEY, []);
  deleteFromArray(searches, item => {
    return item === query;
  });
  // 缓存搜索数组
  storage.set(SEARCH_KEY, searches);
  // 返回搜索数组
  return searches;
}

/**
 * @author yu yi
 * @param {any} arr 被插入的数组
 * @param {any} val 要插入的值
 * @param {any} compare 比较函数
 * @param {any} maxLen 数组长度最大值
 */
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare);
  // 如果数据存在于数组，且是第一条就什么也不用做
  if (index === 0) {
    return;
  }
  // 如果数组中存在而且，索引大于1，就删除这个值，再插入到头部
  if (index > 0) {
    arr.splice(index, 1);
  }
  arr.unshift(val);
  // 如果插入之后数组长度过大，需要在数组尾端弹出一个值
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}

// 从缓存中获取搜索历史
export function loadSearch() {
  return storage.get(SEARCH_KEY, []);
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

// 清空搜索历史
export function clearSearch() {
  storage.remove(SEARCH_KEY);
  return [];
}
