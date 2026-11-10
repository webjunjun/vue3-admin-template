// 扩展类型
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

declare module 'three' {
  interface PerspectiveCamera {
    tick?: (delta: number) => void // 为相机添加可选的 tick 方法类型
  }
  interface DirectionalLight {
    tick?: (delta: number) => void
  }

  interface AmbientLight {
    tick?: (delta: number) => void
  }
}

declare module 'three/examples/jsm/controls/OrbitControls.js' {
  interface OrbitControls {
    tick?: (delta: number) => void
  }
}