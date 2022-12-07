import { Directive, DirectiveBinding } from 'vue';
// 定义类型
type Ixy = {
  x: number;
  y: number;
};
type Iwh = {
  w: number;
  h: number;
};
// 定义宽高、坐标获取办法
function mouseXY(e: MouseEvent): Ixy {
  return {
    x: e.clientX,
    y: e.clientY,
  };
}
function domWH(el: HTMLElement): Iwh {
  return {
    w: el.clientWidth,
    h: el.clientHeight,
  };
}
// 定义VUE3指令
const vResize: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<any>) {
    // resize指令类型
    const resizeType = binding.value.type as string;
    // resize执行Dom
    const resizeDom = document.getElementById(
      binding.value.dom as string
    ) as HTMLElement;
    // resize的交互Dom
    const moveDom = el as HTMLElement;
    // 鼠标按下
    function mouseDown(e: MouseEvent) {
      const downXY: Ixy = mouseXY(e);
      const downWH: Iwh = domWH(resizeDom);
      // 鼠标移动
      function mouseMove(e: MouseEvent) {
        const moveXY: Ixy = mouseXY(e);
        const diffXY: Ixy = {
          x: moveXY.x - downXY.x,
          y: moveXY.y - downXY.y,
        };
        // 以下自定义自己的resize
        if (resizeType === 'left') {
          resizeDom.style.width = downWH.w + diffXY.x + 'px';
        } else if (resizeType === 'right') {
          resizeDom.style.width = downWH.w - diffXY.x + 'px';
        } else if (resizeType === 'bottom') {
          resizeDom.style.height = downWH.h - diffXY.y + 'px';
        }
      }
      // 监听
      document.addEventListener('mousemove', mouseMove);
      // 鼠标松开移除监听
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', mouseMove);
      });
    }
    // resize时间监听
    moveDom.addEventListener('mousedown', mouseDown);
  },
};

// 局部使用：
export default vResize;

// 全局使用示例：
// const directives = {
//   install: function (app: any) {
//     app.directive('resize', vResize);
//   },
// };

// export default directives;
