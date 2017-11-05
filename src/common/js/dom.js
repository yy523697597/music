export function addClass(el, className) {
  if (hasClass(el, className)) {
    return;
  } else {
    // 先拆分,然后再组合
    let newClass = el.className.split(' ');
    newClass.push(className);
    el.className = newClass.join(' ');
  }
}
export function hasClass(el, className) {
  // 创建一个className 开头或结尾包含空格正则
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  //   返回匹配结果
  return reg.test(el.className);
}
