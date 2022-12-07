<script setup lang="ts">
import { computed, toRaw } from 'vue';
import AttrPopover from '../../attr/AttrPopover.vue';

// 命名方便自引用
name: 'Tree';

const props = defineProps<{
  mixintree: any;
  treenode: any;
}>();

const {
  treeconfig,
  treeType,
  isCurrent,
  checkChildren,
  handleClick,
  handlerDrop,
  handlerDragenter,
  handlerDragleave,
  handlerDragover,
  handlerDragstart,
  handlerDragend,
} = props.mixintree;

// 强制处理子节点数据中混入null的问题
const treesList = computed(() =>
  props.treenode.filter((el: any) => el && el.id)
);
</script>
<template>
  <div
    v-if="treesList && treesList.length"
    :key="treeType + treesList[0].id + 'tree'"
    :class="`as-trees-${treeType || 'tree'}`"
  >
    <div
      class="as-trees"
      v-for="item in treesList"
      :key="treeType + item.id"
      @drop.stop="handlerDrop($event, item)"
      @dragenter.stop="handlerDragenter($event, item)"
      @dragleave.stop="handlerDragleave($event, item)"
      @dragover.stop.native="handlerDragover($event, item)"
    >
      <div class="as-trees-hover">
        {{ item.label }}
      </div>
      <div
        v-if="item && item.id"
        draggable="true"
        @dragstart="handlerDragstart($event, item)"
        @dragend="handlerDragend($event, item)"
        @click.stop="handleClick(item)"
        :id="treeType + item.id"
        :class="isCurrent(item)"
      >
        <TransitionGroup tag="span" name="fade">
          <div
            class="as-trees-bar"
            :key="treeType + item.id + 'bar'"
            :style="+treeconfig.styleto === 2 ? item.style : {}"
          >
            <div
              class="as-trees-open"
              v-if="item.children && item.children.length"
            >
              <el-icon
                v-if="item.showchildren"
                @click="item.showchildren = !item.showchildren"
              >
                <ArrowDownBold v-if="treeType === 'point'" />
                <CaretBottom v-else-if="treeType === 'tree'" />
                <Remove v-else />
              </el-icon>
              <el-icon v-else @click="item.showchildren = !item.showchildren">
                <ArrowRightBold v-if="treeType === 'point'" />
                <CaretRight v-else-if="treeType === 'tree'" />
                <CirclePlus v-else />
              </el-icon>
            </div>
            <div class="as-trees-opt" v-if="treeconfig.attrshow > 0">
              <AttrPopover :node="item" :mixintree="mixintree"></AttrPopover>
            </div>
            <div
              class="as-trees-ico"
              :style="+treeconfig.styleto === 1 ? item.style : {}"
            >
              <el-icon>
                <component :is="item.ico" />
              </el-icon>
            </div>
            <div class="as-trees-tit">{{ item.label }}</div>
          </div>
        </TransitionGroup>
      </div>
      <Tree
        v-if="checkChildren(item) && item.showchildren"
        :key="treeType + item.id + 'trees'"
        :mixintree="mixintree"
        :treenode="item.children"
      ></Tree>
    </div>
    <div class="as-trees-clear"></div>
  </div>
</template>

<style scoped lang="scss">
.bounce-move,
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-enter-from,
.bounce-leave-to {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
  position: absolute;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

/* 1. 声明过渡效果 */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. 声明进入和离开的状态 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. 确保离开的项目被移除出了布局流
      以便正确地计算移动时的动画效果。 */
.fade-leave-active {
  position: absolute;
}

// 树形与圆点样式合集
.as-trees-tree,
.as-trees-point {
  padding-left: 16px;
  min-width: 100%;
  .as-trees {
    white-space: nowrap;
    text-align: center;
    position: relative;
    display: table;
    .as-trees-my,
    .as-trees-mys {
      margin-top: 8px;
      width: v-bind('treeconfig.wt');
      .as-trees-bar {
        min-height: v-bind('treeconfig.ht');
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .as-trees-opt,
        .as-trees-open {
          display: inline-block;
          width: auto;
          text-align: center;
          position: absolute;
          top: calc(50% - 10px);
          .el-icon {
            font-size: 18px;
            cursor: pointer;
          }
        }
        .as-trees-open {
          color: #666666;
        }
        .as-trees-opt {
          right: 8px;
        }
        .as-trees-ico {
          display: inline-flex;
          height: v-bind('treeconfig.ht');
          justify-content: center;
          align-items: center;
          .el-icon {
            font-size: 20px;
          }
        }
        .as-trees-tit {
          font-size: 14px;
          padding-left: 12px;
          display: inline-block;
        }
      }
    }
  }
}
// 单独处理树形
.as-trees-tree {
  .as-trees-my,
  .as-trees-mys {
    border-radius: 2px;
    .as-trees-bar {
      border-radius: 2px;
      .as-trees-open {
        left: -20px;
      }
      .as-trees-ico {
        width: 38px;
      }
    }
  }
}
// 单独处理圆点
.as-trees-point {
  .as-trees-my,
  .as-trees-mys {
    border-radius: 30px;
    .as-trees-bar {
      padding: 5px 8px;
      border-radius: 30px;
      .as-trees-open {
        left: -22px;
      }
      .as-trees-ico {
        width: v-bind('treeconfig.ht');
        border-radius: 50%;
      }
    }
  }
}
// 卡片与叠加样式合集
.as-trees-card,
.as-trees-over {
  vertical-align: top;
  padding: 0 20px;
  .as-trees {
    white-space: nowrap;
    vertical-align: top;
    display: inline-block;
    min-width: v-bind('treeconfig.w');
    min-height: v-bind('treeconfig.h');
    padding: 5px;
    text-align: center;
    position: relative;
    .as-trees-my,
    .as-trees-mys {
      position: relative;
      .as-trees-bar {
        position: relative;
        cursor: pointer;
        overflow: hidden;
        .as-trees-opt,
        .as-trees-open {
          position: absolute;
          display: inline-block;
          text-align: center;
          width: auto;
          top: 3px;
          .el-icon {
            font-size: 12px;
            cursor: pointer;
          }
        }
        .as-trees-open {
          left: 3px;
          color: #282828;
        }
        .as-trees-opt {
          right: 3px;
        }

        .as-trees-ico {
          display: inline-flex;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          // height: v-bind('treeconfig.hf');
          justify-content: center;
          align-items: center;
          .el-icon {
            font-size: 30px;
          }
        }
        .as-trees-tit {
          display: inline-block;
        }
      }
    }

    .as-trees-my {
      .as-trees-bar {
        min-height: v-bind('treeconfig.h');
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .as-trees-tit {
          padding-top: 12px;
        }
      }
    }
    .as-trees-mys {
      .as-trees-bar {
        min-height: v-bind('treeconfig.hf');
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .as-trees-tit {
          padding-left: 12px;
        }
      }
    }
  }
  .as-trees-clear {
    clear: both;
  }
}
// 卡片
.as-trees-card {
  .as-trees-my {
    border-radius: 8px;
    .as-trees-bar {
      margin-top: 3px;
      border-radius: 8px;
    }
  }
  .as-trees-mys {
    border-radius: 8px 8px 0 0;
    .as-trees-bar {
      margin-top: 3px;
      border-radius: 8px 8px 0 0;
      padding: 0 22px;
    }
  }
}
// 叠加
.as-trees-over {
  .as-trees-my,
  .as-trees-mys {
    border-radius: 8px;
    .as-trees-bar {
      border-radius: 8px;
    }
  }
  .as-trees-mys {
    .as-trees-bar {
      padding: 0 22px v-bind('treeconfig.hf') 22px;
      margin: 0 0 calc(0px - v-bind('treeconfig.hf')) 0;
    }
  }
}
// 单个卡片与含子的卡片样式
.as-trees-my {
  .as-trees-bar {
    // border: 1px solid #ffffff;
    background-color: #c8c9c844;
    // background-image: linear-gradient(#F5F5F5,#d8d8d8);
  }
}
.as-trees-mys {
  .as-trees-bar {
    // border: 1px solid #ffffff;
    background-color: #c8c9c855;
    // background-image: linear-gradient(#F5F5F5,#d8d8d8);
  }
}
// 卡片标题
.as-trees-tit {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

// 当前节点显示
.as-trees-my,
.as-trees-mys {
  box-shadow: 3px 3px 5px 1px #d8d8d8;
  &:hover .as-trees-opt {
    color: #98989866;
  }
  .as-trees-opt {
    color: #98989801;
  }
}
.as-trees-my-cur {
  box-shadow: 0 0 3px 1px #009fa8;
  .as-trees-opt {
    color: #98989899;
  }
}
.as-trees-my-par {
  box-shadow: 0 -2px 1px #009fa888;
}
.as-trees-my-chi {
  box-shadow: 0 2px 1px #009fa888;
}
.as-trees-hover {
  position: absolute;
  top: 0;
  right: -9090px;
  width: 9090px;
  height: 100%;
  // background-color: #009fa888;
}
</style>
