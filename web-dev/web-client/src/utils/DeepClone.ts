export function DeepClone(data: any): any {
  if (data && typeof data === 'object') {
    // 处理：object,array,date,function
    switch (Object.prototype.toString.call(data)) {
      case '[object String]':
        return data.toString();
      case '[object Number]':
        return Number(data.toString());
      case '[object Boolean]':
        return new Boolean(data.toString());
      case '[object Date]':
        return new Date(data.getTime());
      case '[object Array]':
        const arr: any[] = [];
        for (let i = 0; i < data.length; i++) {
          arr[i] = DeepClone(data[i]);
        }
        return arr;

      // js自带对象或用户自定义类实例
      case '[object Object]':
        const obj: any = {};
        for (let key in data) {
          // 会遍历原型链上的属性方法，可以用obj.hasOwnProperty(prop)来控制
          obj[key] = DeepClone(data[key]);
        }
        return obj;
    }

    // 针对函数的拷贝
    if (typeof data === 'function') {
      let func = data.bind(null);
      func.prototype = DeepClone(data.prototype);
      return func;
    }
  } else {
    // 处理：string,number,bool,null,undefined,symbol
    return data;
  }
}

export function DeepClone2(data: any): any {
  var root = Array.isArray(data) ? [] : {};
  var nodeList: any = [
    {
      parent: root,
      key: undefined,
      data: data,
    },
  ];
  while (nodeList.length) {
    let node: any = nodeList.pop(),
      parent = node.parent,
      k = node.key,
      data = node.data;
    let result = parent;
    if (typeof k !== 'undefined') {
      result = parent[k] = Array.isArray(data) ? [] : {};
    }
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (typeof data[key] === 'object') {
          nodeList.push({
            parent: result,
            key,
            data: data[key],
          });
        } else {
          result[key] = data[key];
        }
      }
    }
  }
  return root;
}
