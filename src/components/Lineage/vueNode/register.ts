import VueNodeModel from './VueNodeModel'
import VueNodeView from './VueNodeView'
import LogicFlow from '@logicflow/core'

import RegisterConfig = LogicFlow.RegisterConfig

export type VueNodeConfig = {
  type: string
  component: any
} & Partial<RegisterConfig>

// js 写法
// const vueNodesMap = {}
// ts 写法
// export const vueNodesMap = Object.create(Object.prototype)
export const vueNodesMap: Record<
  string, {
    component: any
  }
> = {}

export const register = (config: VueNodeConfig, lf: LogicFlow) => {
  // component 为自定义的vue组件 通过创建虚拟DOM节点的h函数将vue组件塞入自定义的HTML节点
  // CustomNodeView CustomNodeModel 为LogicFlow的自定义类型
  const {
    type,
    component,
    view: CustomNodeView,
    model: CustomNodeModel
  } = config

  if (!type) {
    throw new Error('You should specify type in config')
  }

  vueNodesMap[type] = {
    component
  }

  lf.register({
    type,
    view: CustomNodeView || VueNodeView,
    model: CustomNodeModel || VueNodeModel
  })
}