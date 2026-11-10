type NodeData = {
  label: string,
  width: number,
  height: number
}

type OriginNode = {
  id: string,
  data: NodeData
}

type Edge = {
  id: string | number,
  source: string,
  target: string
}

export type CustomElement = { node: OriginNode[]; edge: Edge[] };
