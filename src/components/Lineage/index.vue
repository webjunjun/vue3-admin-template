<script lang="ts" setup>
import LogicFlow from '@logicflow/core'
import { layoutGraphData } from '@/components/Lineage/tools/layoutDagre'

import '@logicflow/core/lib/style/index.css'

defineOptions({
  name: 'Lineage'
})

const props = defineProps({
  height: {
    type: String,
    default: () => '400px'
  }
})

// 3.5以前 声明一个 ref 来存放该元素的引用 必须和模板里的 ref 同名
// const lineageRef = ref<HTMLElement | null>(null)
// 3.5+
const lineageRef = useTemplateRef<HTMLElement>('lineageRef')
const lf = ref<LogicFlow | null>(null)
const undoDisable = ref<boolean>(false)
const redoDisable = ref<boolean>(false)

// 注册流程图事件
const registerLfEvents = () => {
  // 历史记录事件
  lf.value?.on('history:change', ({ data: { undoAble, redoAble }}) => {
    undoDisable.value = !undoAble
    redoDisable.value = !redoAble
  })
  // 不允许建立连接事件
  lf.value?.on('connection:not-allowed', (data) => {
    if (data.msg) {
      ElMessage.success(data.msg)
    }
  })
  // 节点右键事件
  lf.value?.on('node:contextmenu', ({data, e, position}) => {
    console.log(data, e, position)
  })
  // 边右键事件
  lf.value?.on('edge:contextmenu', ({data, e, position}) => {
    console.log(data, e, position)
  })
}

// 控制栏事件
const onScaleMinus = () => {
  lf.value?.zoom(false)
}
const onScalePlus = () => {
  lf.value?.zoom(true)
}
const onFitView = () => {
  // 如果流程图高度是否大于画布高度
  lf.value?.resetZoom()
  // lf.value?.fitView()
  lf.value?.translateCenter()
}
const onUndo = () => {
  if (!undoDisable.value) {
    lf.value?.undo()
  }
}
const onRedo = () => {
  if (!redoDisable.value) {
    lf.value?.redo()
  }
}

// 初始化流程图
const initGraph = () => {
  lf.value = new LogicFlow({
    container: lineageRef.value as HTMLElement,
    edgeType: 'bezier',
    // edgeType: 'polyline',
    adjustEdge: false,
    edgeTextEdit: false,
    stopScrollGraph: true, // 禁止画布滚动后可开启画布缩放模式
    style: {
      bezier: {
        stroke: '#67C23A'
      },
      anchor: {
        stroke: '#67C23A'
      },
      arrow: {
        stroke: '#67C23A',
        // 定义箭头的三角形宽6px 高4px
        offset: 6,
        verticalLength: 4
      }
    },
    grid: true
  })
  lf.value.render({
    nodes: [],
    edges: []
  })
  const newGraphData = layoutGraphData({
      node: [
      { id: 'kspacey', data: { label: 'Kevin Spacey', width: 144, height: 100 }},
      { id: 'swilliams', data: { label: 'Saul Williams', width: 160, height: 100 }},
      { id: 'bpitt', data: { label: 'Brad Pitt', width: 108, height: 100 }},
      { id: 'hford', data: { label: 'Harrison Ford', width: 168, height: 100 }},
      { id: 'lwilson', data: { label: 'Luke Wilson', width: 144, height: 100 }},
      { id: 'kbacon', data: { label: 'Kevin Bacon', width: 121, height: 100 }}
    ],
    edge: [
      { id: 'kspacey->swilliams', source: 'kspacey', target: 'swilliams' },
      { id: 'swilliams->kbacon', source: 'swilliams', target: 'kbacon' },
      { id: 'bpitt->kbacon', source: 'bpitt', target: 'kbacon' },
      { id: 'hford->lwilson', source: 'hford', target: 'lwilson' },
      { id: 'lwilson->kbacon', source: 'lwilson', target: 'kbacon' }
    ]
  })
  lf.value.render(newGraphData)
}



onMounted(() => {
  initGraph()
})
</script>

<template>
  <div
    ref="lineageRef"
    class="lineage-container"
    :style="{height: props.height}"
  ></div>
</template>

<style lang="scss" scoped>
.lineage-container {
  width: 100%;
}
</style>