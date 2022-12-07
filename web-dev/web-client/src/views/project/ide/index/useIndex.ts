import { inject } from 'vue';
// 引入指令
import vResize from '@/components/v-resize';
// 引入模块
import { useLayout } from '../layout/useLayout';

export function useIndex() {
  const {
    LayoutTool,
    LayoutProgram,
    LayoutProgramAttr,
    LayoutPoint,
    LayoutPointAttr,
    LayoutProject,
    LayoutSimulate,
  } = useLayout();

  const model = inject('model');

  return {
    model,
    vResize,
    LayoutTool,
    LayoutProgram,
    LayoutProgramAttr,
    LayoutPoint,
    LayoutPointAttr,
    LayoutProject,
    LayoutSimulate,
  };
}
