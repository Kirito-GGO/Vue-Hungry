// 时间戳格式化
export function formatDate(date, fmt) {
  // y+ 匹配以y开头 一个或多个字符串
  // test() 方法用于检测一个字符串是否匹配某个模式
  if (/(y+)/.test(fmt)) {
    // replace() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串
    // RegExp.$1这个对象就是匹配了()里面的值
    // getFullYear() 方法可返回一个表示年份的 4 位数字
    // substr() 方法可在字符串中抽取从 开始 下标开始的指定数目的字符
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}
