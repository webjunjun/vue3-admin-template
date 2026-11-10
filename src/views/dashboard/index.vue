<template>
  <div class="app-container">
    <div id="scene-container" ref="canvasContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { Soldier } from './3dDemo/Soldier/Soldier'

defineOptions({
  name: 'Dashboard',
  inheritAttrs: false
})

// 获取容器 DOM 引用
const canvasContainer = ref(null)

const threeMain = async () => {
  if (canvasContainer.value) {
    const soldier = new Soldier(canvasContainer.value)
    await soldier.init()
    soldier.start()
  }
}

onMounted(() => {
  threeMain().catch(err => {
    console.error(err)
  })
})

</script>

<style lang="scss" scoped></style>
