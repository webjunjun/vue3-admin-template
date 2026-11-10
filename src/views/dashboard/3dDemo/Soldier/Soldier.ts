
import { createCamera } from '@/components/3dComp/camera'
import { createScene } from '@/components/3dComp/scene'
import { createLights } from '@/components/3dComp/lights'

import { createControls } from '@/components/3dSystem/controls'
import { createRenderer } from '@/components/3dSystem/renderer'
import { Resizer } from '@/components/3dSystem/Resizer'
import { Loop } from '@/components/3dSystem/Loop'

import { AxesHelper, Color, Fog, GridHelper, Mesh, MeshPhongMaterial, PlaneGeometry } from 'three'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { loadSoldierGltf } from './loadSoldierGltf'

class Soldier {
  #camera;
  #scene;
  #renderer;
  #loop;
  #controls;
  // 拾取对象和鼠标向量 用于绑定事件
  // 案例需要的参数

  // container：塞进页面哪个DOM元素
  constructor(container: HTMLElement) {
    this.#camera = createCamera()
    this.#scene = createScene()
    this.#renderer = createRenderer()
    this.#loop = new Loop(this.#camera, this.#scene, this.#renderer)
    container.append(this.#renderer.domElement)

    this.#controls = createControls(this.#camera, this.#renderer.domElement)
    this.#controls.enablePan = false
    this.#controls.enableDamping
    this.#controls.minDistance = 3
    this.#controls.maxDistance = 20
    this.#controls.maxPolarAngle = Math.PI / 2

    const resizer = new Resizer(container, this.#camera, this.#renderer)
    const { ambientLight, mainLight } = createLights()
    this.#loop.updatables.push(this.#controls)
    this.#scene.add(ambientLight, mainLight)
  }

  async init() {
    this.#scene.background = new Color(0xa0a0a0);

    this.#camera.fov = 45
    this.#camera.far = 100
    this.#camera.near = 1
    this.#camera.position.set(1, 2, -6)
    this.#camera.lookAt(0, 1, 0);
    this.#camera.updateProjectionMatrix()

    this.#scene.fog = new Fog(0xa0a0a0, 10, 50)

    // 加载模型
    const soldier = await loadSoldierGltf()
    this.#scene.add(soldier)

    // 加载地面
    const mesh = new Mesh(
      new PlaneGeometry(100, 100),
      new MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
    )
    mesh.rotation.x = -Math.PI / 2
    mesh.receiveShadow = true
    this.#scene.add(mesh)

    // 坐标系 + 网格
    const axesHelper = new AxesHelper(100) // 红X绿Y蓝Z
    const gridHelper = new GridHelper(20, 20, 0xcccccc, 0xcccccc) // 20x20网格
    this.#scene.add(axesHelper, gridHelper)

    // GUI参数面板
    const gui = new GUI({ title: '模型参数调整' })
    const posFolder = gui.addFolder('位置(position)')
    posFolder.add(soldier.position, 'x', -10, 10, 0.01).name('X轴')
    posFolder.add(soldier.position, 'y', -10, 10, 0.01).name('Y轴')
    posFolder.add(soldier.position, 'z', -10, 10, 0.01).name('Z轴')

    const rotFolder = gui.addFolder('旋转(rotation) 弧度');
    rotFolder.add(soldier.rotation, 'x', 0, Math.PI*2, 0.01).name('X轴')
    rotFolder.add(soldier.rotation, 'y', 0, Math.PI*2, 0.01).name('Y轴')
    rotFolder.add(soldier.rotation, 'z', 0, Math.PI*2, 0.01).name('Z轴')

    const scaleFolder = gui.addFolder('缩放(scale)');
    scaleFolder.add(soldier.scale, 'x', 0.01, 5, 0.01).name('X轴').onChange((v: number)=>{soldier.scale.y=v;soldier.scale.z=v})
    scaleFolder.add(soldier.scale, 'y', 0.01, 5, 0.01).name('Y轴')
    scaleFolder.add(soldier.scale, 'z', 0.01, 5, 0.01).name('Z轴')
  }

  render() {
    this.#renderer.render(this.#scene, this.#camera)
  }

  start() {
    this.#loop.start()
  }

  stop() {
    this.#loop.stop()
  }
}

export { Soldier }
