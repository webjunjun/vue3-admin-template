import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Box3, Vector3 } from 'three'

async function loadSoldierGltf() {
  const loader = new GLTFLoader()
  const soldierData = await loader.loadAsync('/3dModels/Soldier.glb')

  console.log(soldierData)
  // 判断模型的尺寸
  // const box = new Box3().setFromObject(soldierData.scene)
  // const boxSize = box.getSize(new Vector3()).length()
  // const boxCenter = box.getCenter(new Vector3())
  // console.log(boxSize)
  // console.log(boxCenter)

  return soldierData.scene
}
export { loadSoldierGltf }
