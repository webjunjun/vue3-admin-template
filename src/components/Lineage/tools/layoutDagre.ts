import * as dagreGraphlib from '@dagrejs/dagre'
import LogicFlow from '@logicflow/core'
import { CustomElement } from '@/types/Lineage.types'

// 创建新的Graph 每个节点必须有宽高
// const dagre = new dagreGraphlib.graphlib.Graph()
// 设置Graph的布局配置规则
// dagre.setGraph({
//   rankdir: 'TB', // 节点排布方式 TB, BT, LR, RL
//   align: undefined, // 节点对齐方式 TB, BT, LR, RL
//   nodesep: 50, // 节点之间的间距
//   edgesep: 10, // 边之间的间距?
//   ranksep: 50, // 层级之间的间距
//   marginx: 0, // Graph左右间距
//   marginy: 0, // Graph上下间距
//   acyclicer: undefined, // 值为greedy置环形图
//   ranker: 'network-simplex' // 计算节点所处层级的算法 network-simplex, tight-tree, longest-path
// })
// 设置默认节点和边的样式
// dagre.setDefaultNodeLabel(() => ({}))
// dagre.setDefaultEdgeLabel(() => ({}))
// 添加节点
// dagre.setNode('A', { label: 'Node A' })
// dagre.setNode('B', { label: 'Node B' })
// 添加边
// dagre.setEdge('A', 'B')
// 进行布局 第一个参数是Graph 第二个参数是Graph的全部配置规则
// dagreGraphlib.layout(dagre)

/**
 * 过滤重复的点位
 */
const pointFilter = (points: Array<{x: number, y: number}>) => {
  const allPoints = points
  let i = 1
  while (i < allPoints.length - 1) {
    const pre = allPoints[i - 1]
    const current = allPoints[i]
    const next = allPoints[i + 1]
    if ((pre.x === current.x && current.x === next.x) || (pre.y === current.y && current.y === next.y)) {
      allPoints.splice(i, 1)
    } else {
      i++
    }
  }
  return allPoints
}

/**
 * 计算源点与目标点的起点、终点以及两个或四个中间点
 */
const calcPointsList = (
  model: LogicFlow.EdgeConfig,
  nodes: LogicFlow.NodeConfig[],
  // 层级间距
  ranksep: number = 0,
  // 节点间距
  nodesep: number = 0,
  // 是否贝塞尔曲线
  isBezier: boolean = false
) => {
  // 在节点确认从左向右后，通过计算来保证节点连线清晰
  const pointsList = []
  const newSourceNodeData = nodes.find(node => node.id === model.sourceNodeId)
  const newTargetNodeData = nodes.find(node => node.id === model.targetNodeId)
  if (!newSourceNodeData || !newTargetNodeData) {
    return undefined
  }
  const sourceHalfWidth = newSourceNodeData.width / 2
  const targetHalfWidth = newTargetNodeData.width / 2
  const sourceHalfHeight = newSourceNodeData.height / 2
  const targetHalfHeight = newTargetNodeData.height / 2
  if (newSourceNodeData.x < newTargetNodeData.x) {
    // 源点在左 目标点在右
    // 1、源点和目标点在同一水平位置 2、源点在上 目标点在下 3、源点在下 目标点在上
    pointsList.push({
      x: newSourceNodeData.x + sourceHalfWidth,
      y: newSourceNodeData.y
    })
    pointsList.push({
      x: newSourceNodeData.x + sourceHalfWidth + ranksep / 2,
      y: newSourceNodeData.y
    })
    pointsList.push({
      x: newSourceNodeData.x + sourceHalfWidth + ranksep / 2,
      y: newTargetNodeData.y
    })
    pointsList.push({
      x: newTargetNodeData.x - targetHalfWidth,
      y: newTargetNodeData.y
    })
    return isBezier ? pointsList : pointFilter(pointsList)
  }
  if (newSourceNodeData.x > newTargetNodeData.x) {
    // 源点在右 目标点在左
    // 1、源点和目标点在同一水平位置 2、源点在上 目标点在下 3、源点在下 目标点在上
    pointsList.push({
      x: newSourceNodeData.x + sourceHalfWidth,
      y: newSourceNodeData.y
    })
    pointsList.push({
      x: newSourceNodeData.x + sourceHalfWidth + ranksep / 2,
      y: newSourceNodeData.y
    })
    if (newSourceNodeData.y >= newTargetNodeData.y) {
      pointsList.push({
        x: newSourceNodeData.x + sourceHalfWidth + ranksep / 2,
        y: newTargetNodeData.y - targetHalfHeight - nodesep / 2
      })
      pointsList.push({
        x: newTargetNodeData.x - targetHalfWidth - ranksep / 2,
        y: newTargetNodeData.y - targetHalfHeight - nodesep / 2
      })
    } else {
      pointsList.push({
        x: newSourceNodeData.x + sourceHalfWidth + ranksep / 2,
        y: newTargetNodeData.y + targetHalfHeight + nodesep / 2
      })
      pointsList.push({
        x: newTargetNodeData.x - targetHalfWidth - ranksep / 2,
        y: newTargetNodeData.y + targetHalfHeight + nodesep / 2
      })
    }
    pointsList.push({
      x: newTargetNodeData.x - targetHalfWidth - ranksep / 2,
      y: newTargetNodeData.y
    })
    pointsList.push({
      x: newTargetNodeData.x - targetHalfWidth,
      y: newTargetNodeData.y
    })
    return isBezier ? pointsList : pointFilter(pointsList)
  }
  return undefined
}

const getLayoutedGraph = (elements: CustomElement): dagreGraphlib.graphlib.Graph<{}> => {
  const dagreGraph = new dagreGraphlib.graphlib.Graph()
  console.log(dagreGraph)
  dagreGraph.setGraph({
    rankdir: 'LR'
  })
  // 必须明确给每条边设置默认的边样式 否则报错
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  // 获取节点的ID
  const nodeSet = new Set(elements.node.map(item => item.id))
  // 添加节点
  elements.node.forEach(el => {
    dagreGraph.setNode(el.id, {
      width: el.data.width,
      height: el.data.height
    })
  })
  // 获取和节点相关的边
  const edgesRequired = elements.edge.filter(
    el => nodeSet.has(el.source) && nodeSet.has(el.target)
  )
  // 添加边
  edgesRequired.forEach(el => {
    dagreGraph.setEdge(el.source, el.target)
  })
  // 计算布局
  dagreGraphlib.layout(dagreGraph)

  // 返回带有布局节点和边信息的布局对象
  return dagreGraph
}

// 将数据转换成logic的数据格式
export const layoutGraphData = (elements: CustomElement): {
  nodes: LogicFlow.NodeConfig[]
  edges: LogicFlow.EdgeConfig[]
} => {
  const layoutData = getLayoutedGraph(elements)
  const newGraphData: {
    nodes: LogicFlow.NodeConfig[]
    edges: LogicFlow.EdgeConfig[]
  } = {
    nodes: [],
    edges: []
  }
  let node = null
  layoutData.nodes().forEach(v => {
    node = layoutData.node(v)
    newGraphData.nodes.push({
      id: v,
      // type: 'dbTables',
      type: 'rect',
      // 业务数据存放处
      properties: {
        // 必须有width、height 否则使用历史记录功能会出问题
        width: node.width,
        height: node.height
      },
      // 节点的中心点的x,y坐标
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height
    })
  })
  let edge = null
  let dataEdge: LogicFlow.EdgeConfig | null = null
  let first = null
  let last = null
  let isBezier = false
  layoutData.edges().forEach(v => {
    edge = layoutData.edge(v)
    dataEdge = {
      type: 'bezier',
      // type: 'polyline',
      sourceNodeId: v.v,
      targetNodeId: v.w,
      pointsList: undefined,
      startPoint: undefined,
      endPoint: undefined
    }
    isBezier = dataEdge.type === 'bezier' ? true : false
    dataEdge.pointsList = calcPointsList(dataEdge, newGraphData.nodes, 50, 50, isBezier)
    if (dataEdge.pointsList) {
      first = dataEdge.pointsList[0]
      last = dataEdge.pointsList[dataEdge.pointsList.length - 1]
      dataEdge.startPoint = { x: first.x, y: first.y }
      dataEdge.endPoint = { x: last.x, y: last.y }
    }
    newGraphData.edges.push(dataEdge)
  })

  return newGraphData
}
