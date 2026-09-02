# 适配层（Adapters）

内核 `theme-engine.js` 是**框架无关**的：它只做一件事——把「风格基因」翻译成 CSS 自定义变量，写到目标 DOM 节点上。任何框架都能复用同一个内核。

## 接入原理

```
SG.applyTheme(themeId, el)
   └─> el.style.setProperty('--sg-primary', '#00ffd5') ... 共 31 个变量
```

React / Vue / 原生 / jQuery / Svelte 都只需要在「主题变化」时调用这一行，UI 就会自动重刷。

## 文件

| 文件 | 说明 |
|------|------|
| `react.jsx` | React 版：`<SGThemeProvider>` + `useTheme()` hook + 原生组件包装示例 |
| `vue.vue` | Vue 3 版：组合式 `setTheme` / `theme`，插槽透传 |

## 快速上手（React）

```jsx
import { SGThemeProvider, useTheme } from './adapters/react';

function ThemeSwitcher() {
  const { themeId, setTheme } = useTheme();
  return (
    <select value={themeId} onChange={e => setTheme(e.target.value)}>
      {window.SG.presets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
    </select>
  );
}

<SGThemeProvider initialTheme="cyberpunk">
  <ThemeSwitcher />
  {/* 页面内容：所有视觉由 --sg-* 变量驱动 */}
</SGThemeProvider>
```

## 快速上手（Vue 3）

```vue
<script setup>
import { ref } from 'vue';
const current = ref('pet-fresh');
</script>

<template>
  <select v-model="current">
    <option v-for="p in window.SG.presets" :key="p.id" :value="p.id">{{ p.name }}</option>
  </select>
</template>
```

> 组件层（`components.js` 里的 7 个 Headless 组件）返回原生 DOM，可在任意框架里
> 用 `ref` 挂载；它们本身不依赖框架，因此**换框架不用重写组件**。
