import LayoutTool from './tool/Index.vue';
import LayoutProgram from './program/Index.vue';
import LayoutProgramAttr from './program-attr/Index.vue';
import LayoutPoint from './point/Index.vue';
import LayoutPointAttr from './point-attr/Index.vue';
import LayoutProject from './project/Index.vue';
import LayoutSimulate from './simulate/Simulate.vue';

export function useLayout() {
  return {
    LayoutTool,
    LayoutProgram,
    LayoutProgramAttr,
    LayoutPoint,
    LayoutPointAttr,
    LayoutProject,
    LayoutSimulate,
  };
}
