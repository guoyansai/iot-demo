/****
 * 将弧度值换算为（0-360°）
 * @param radian 弧度的值
 * @return 角度值
 */
function convRadian(radian){
    var degress = radian/(Math.PI/180);
    return degress;
}

/****
     * 方法 判断数组内的元素是否都相同\
     * @param arr 需要判断的数组
     */
function isAllEqual(arr){
    if (arr.length > 0) {
        return !arr.some(function(value, index) {
            return value !== arr[0];
        });
    } else {
        return true;
    }
}

/*****
 * 清空一个数组
 * @param value 一个数组格式变量
 */
function empty(value) {
    return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
}

/*****
 * 设置一个零件的位置
 * 将坐标系修改成 zyx的坐标轴
 * @param obj 一个Object3D对象
 * @param x 位置的值
 * @param y 位置的值
 * @param z 位置的值
 * @param psi 
 * @param theta 
 * @param phi 
 */
function setObjectPose(obj, [x = 0, y = 0, z = 0, psi = 0, theta = 0, phi = 0]) {
    if (obj) {
          obj.position.set(x, y, z)
          obj.rotation.set(phi, theta, psi, 'ZYX')
    }
}

/****
 * 四舍五入截取一个小数点
 * @param number 需要被处理的数据
 * @param length 需要被截取到的长度
 */
function fixedNumber(number, length){
    if(!length){ length = 0; }
    var tempNum = number.toFixed(length)*1;
    return tempNum;
}


export {
    convRadian,
    empty,
    setObjectPose,
    fixedNumber,
    isAllEqual
}