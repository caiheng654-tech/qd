<script setup>
/**
 * Style Genome · Vue 适配层（薄封装）
 * ------------------------------------------------------------
 * 内核 theme-engine.js 是框架无关的，Vue 这边用组合式函数 useTheme
 * 把「换基因」接到响应式状态上；Headless 组件用原生 SGComponents 挂载。
 */
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';

const props = defineProps({
  initialTheme: { type: String, default: 'minimal-white' },
  rootSelector: { type: String, default: null }
});

const themeId = ref(props.initialTheme);
const theme = computed(() => (window.SG ? window.SG.getTheme(themeId.value) : null));

function setTheme(id) {
  themeId.value = id;
}

let el = null;
function resolveEl() {
  el = props.rootSelector ? document.querySelector(props.rootSelector) : document.documentElement;
}

onMounted(() => {
  resolveEl();
  if (window.SG) window.SG.applyTheme(themeId.value, el);
});

watch(themeId, (id) => {
  if (window.SG) window.SG.applyTheme(id, el);
});

onBeforeUnmount(() => { el = null; });

defineExpose({ setTheme, theme });
</script>

<template>
  <div class="sg-theme-host">
    <slot :theme="theme" :setTheme="setTheme" />
  </div>
</template>
