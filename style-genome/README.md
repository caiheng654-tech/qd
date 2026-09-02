# 🧬 风格基因库 · Style Genome

一套**四维基因细分**的换肤引擎：一套代码，二十多套皮肤，几十种细分子基因。把「做网站」变成「选基因 → 选骨架 → 选动效 → 选文案 → 填内容」，30 分钟出初版。

> 打开 `index.html` 即可用（零构建、零依赖，双击即跑）。

## 四维基因（4 大维度 · 全部可独立切换 / 自由组合）

| 维度 | 子基因 | 数量 | 落地 |
|------|--------|------|------|
| **① 视觉基因** 皮肤 | 颜色/字体/**排版**/**间距**/圆角/阴影/动效曲线 | 7 组 31+12 变量 | `presets.js` + `tokens.schema.json` + `theme-engine.js` |
| **② 结构基因** 骨架 | 布局骨架 / 组件变体（按钮/卡片/输入）/ 3D 场景 / 特殊模块 | 6 + 3×3 + 5 + 4 | `layouts.css` + `genes.js` + `genes.css` + `special.js` |
| **③ 行为基因** 动效 | 动效 / 转场 / 推镜 / 特效（妆容） | 4 + 5 + 4 + 7 | `genes.js` + `effects.css` + `effects.js` |
| **④ 内容基因** 文案 | 语言 / 文案语气 / 创意方向 | 3 + 4 + 4 | `genes.js`（内嵌 i18n / tone / creative 字典） |

每一维度都对齐了**独立可控、互不耦合**：换主题不丢行为、切语言不丢布局、换组件变体不丢文案。导出 `genome.json` 包含四维全量配置。

## 四层架构（实现视角）

| 层 | 定义 | 落地文件 |
|----|------|----------|
| **① 基础变量层** Design Tokens | 视觉基因 7 组变量 | `engine/presets.js`（20 套基因）+ `engine/tokens.schema.json` |
| **② 组件模板层** Headless 组件 | 只写逻辑、不写样式，样式由①变量注入 | `engine/components.js`（7 件套）+ `engine/base.css` |
| **③ 布局骨架层** Layout Kits | 6 种经典页面骨架 | `engine/layouts.css` |
| **④ 氛围滤镜层** Effect Engine | 7 种 CSS 特效（妆容） | `engine/effects.css` + `engine/effects.js` |
| **⑤ 基因细分层** 行为/结构/内容 | 动效/转场/推镜/组件变体/3D/语言/语气/创意 | `engine/genes.js` + `engine/genes.css` |

内核 `engine/theme-engine.js` 把视觉基因翻译为 43 个 CSS 变量注入 DOM，框架无关。`engine/genes.js` 加载行为/结构/内容基因目录与 `SGGenes.apply()` 应用引擎。

## 26 套风格基因（5 大类 · 含榜样采集）

- **深色 · 科技**：建筑深色 / 赛博朋克 / 极客终端 / 太空科幻 / 霓虹夜色
- **浅色 · 治愈**：宠物鲜食 / 治愈日系 / 极简白 / 新中式 / 北欧淡彩
- **商务 · 权威**：金融蓝 / 企业红黑金 / 律政灰 / 医疗青 / 暗黑奢华
- **艺术 · 个性**：波普撞色 / 复古像素 / 手作暖木 / 电光紫 / 春日生态
- **榜样 · 采集**（`sourcedFrom` 内部溯源，对外展示已中性化）：黑白沉浸 / 灵动圆润 / 红黑权威 / 沉浸影院 / 编辑画廊 / 中性系统

每套基因在 `presets.js` 由 `derive()` 根据圆角风格自动推导**间距节奏**与**排版默认**（紧凑/宽松、对齐、字距），可在 token 里显式覆盖。

### 主题排版布局差异化（换主题 → 布局跟着变）

不同主题自带**不同的布局骨架 + 排版基因**，预览一眼拉开差距，不再是「只换色、布局一个样」：

- **布局骨架联动**：每套基因在 `presets.js` 的 `LAYOUT_OVERRIDE` 映射了推荐骨架 —— 深色科技 → 单屏全屏（冲击）、浅色治愈 → 中心聚焦（温暖）、商务权威 → 上下结构（严谨）、艺术个性 → 瀑布流（活泼）、榜样采集 → 各高阶采集基因的原生布局（黑白沉浸全屏 / 沉浸影院中心 / 灵动圆润上下…）。换主题自动切换骨架，用户仍可手动改。
- **排版差异**：`derive()` 按类别推导对齐与标题大小写 —— 商务类标题大写 + 左对齐（权威感）、浅色治愈居中（温暖）、深色科技/艺术左对齐；采集基因按 `meta.md` 提炼的排版显式覆盖（如沉浸影院居中）。


### 榜样 · 采集（参考站采集闭环）

基因库的**天花板由参考站决定，不由手写预设决定**。`harvest` 类预设来自榜样库 + 获奖级参考站，每条带 `sourcedFrom`（内部溯源：id / url / concept C? / motion T?/M?）+ `genes`（完整行为+内容基因），换基因自动套行为+内容。

> **对外展示已中性化**：预设显示名、溯源徽章（统一显示「采集」）、采集源提示、选型单一律**不出现品牌名**——客户看到的只是「黑白沉浸 / 沉浸影院」这类风格描述，不会觉得抄袭。真实来源只存于 `sourcedFrom` 字段，供 AI 内部溯源与复用。

- 采集脚本：`python scripts/collect-genes.py`（解析榜样库 → `engine/harvest/*.gene.json`）；联网参考站 `--live URL`。
- 沉淀规矩：只进天花板（榜样 rank=high + 获奖级）、必带溯源、只解析不沉淀 = 不合格。
- 完整 SOP 见 `workflows/DESIGN-WF.md` 12.5 节。

## 子基因目录速览

- **动效 Motion**：沉稳 / 弹性 / 硬朗 / 奢华 —— 决定 hover / 转换的缓动曲线与时长（**多选**，最后勾选生效）
- **转场 Transition**：淡入 / 上滑 / 缩放 / 翻转 / 无 —— 入场动画（**多选**，最后勾选生效）
- **推镜 Camera**：静止 / 视差 / 推镜 / 倾斜 —— 镜头/页面运动（**多选**，可叠加）
- **特效 Effects**：毛玻璃 / 噪点 / 纸纹 / 像素字体 / 故障 / 霓虹 / 鼠标光晕
- **组件变体 Component**：按钮（胶囊/直角/描边）、卡片（扁平/悬浮/描边/硬影）、输入（方框/下划线/胶囊）
- **3D 场景 Scene3D**：圆环结 / 球体 / 多面体 / 方块 / 波浪环（材质 metal/glass/glow）
- **语言 Language**：简体中文 / English / 繁體中文（i18n 全套 nav + hero + section 标题 + footer）
- **文案语气 Tone**：正式 / 活泼 / 极简 / 科技（覆盖 hero 标题/副文/CTA）
- **创意方向 Creative**：留白叙事 / 冲击标题 / 数据说服 / 情感共鸣（覆盖 hero 标题/副文）

## 接单实操（6 步 · 含报价）

1. **选骨架**：问客户要长滚动还是分栏 → 第②层结构基因挑 1 个布局（换主题会自动推荐骨架）
2. **选基因**：从 26 套预设选风格 → 第①层视觉基因（换主题自动切骨架 + 排版）
3. **选动效**：动效 / 转场 / 推镜 + 特效（妆容）→ 第③层行为基因
4. **选结构变体**：按钮/卡片/输入/3D 场景 → 第②层结构基因子项
5. **选内容基因**：语言 / 文案语气 / 创意方向 → 第④层内容基因（中文站给中文+正式+留白叙事，海外站给 English+tech+impact）
6. **报价**：勾选特效 / 特殊模块 / 多语言后，第⑥区实时按复杂度算出预估报价 → 复制报价单给客户

最终 `genome.json` 是一份给前端的 4 维配置 + 给客户的「为什么选这套」文案 + 报价单。

## 报价预估（第⑥区 · 勾选 → 预览 → 按复杂度报价）

- **复杂度三档**：简单 ×0.8 / 标准 ×1.0 / 复杂 ×1.4，一键切换，总计实时重算。
- **勾选即计费**：特效、特殊模块（3D 容器更贵）、多语言、榜样基因（harvest 类）随勾选自动进报价；固定项（换肤引擎 / 布局 / 组件套件 / 响应式）打包计。
- **单价可改**：每个数字直接点击修改，最终价格由你定（工具给结构，数字你掌控）。
- **复制报价单**：`📋 复制报价单` 生成文本报价单（主题/布局/特效/模块/复杂度/合计）。

## 一键交付 · 客户回传（第⑦区 · 静态部署 → 客户自助选 → 结果回传）

把 `index.html` 静态部署（或直接发文件）给客户自助勾选，客户选完把结果回传给你，你丢给 AI 直接开工。两种回传方式，零后端：

- **🔗 复制分享链接（客户最省事）**：把当前所有勾选编码进网址 `#g=...`，客户只复制一条网址发回；你打开链接即**自动还原全部勾选**（主题/布局/组件变体/3D/动效/转场/推镜/特效/特殊模块/语言/语气/创意/复杂度）。
- **📋 复制完整选型单（给 AI）**：一键生成结构化文本，包含**全部 11 个维度**的选型 + 报价单 + 一段「给 AI 的制作指令」 + 完整 `genome.json`。接单者直接粘贴给 AI，AI 读懂即开工。

> 闭环：客户勾选 → 复制分享链接发回 → 接单者打开还原 → 复制完整选型单 → 丢给 AI → 按 genome.json 精确复刻。

## 文件清单

```
index.html                4 维度可视化换肤配置器（实时预览 + 导出 genome.json）
engine/
  theme-engine.js         内核：视觉基因 → 43 个 CSS 变量
  tokens.schema.json      视觉基因 schema（7 组变量）
  presets.js              26 套风格基因（20 手写 + 6 榜样采集）+ derive() 自动生成 spacing/type
  harvest/                ★ 采集闭环产物：collect-genes.py 解析出的榜样基因片段 + manifest.json
  base.css                语义 class → 变量（消费 spacing/type 变量）
  components.js           7 个 Headless 组件
  layouts.css             6 种布局骨架（第三层）
  effects.css/.js         7 种 CSS 特效（第四层）
  special.js              特殊模块：粒子 / 像素 / 3D(scene 化) / 音频
  genes.js                ★ 基因细分层：SG_GENES 目录 + SGGenes.apply() + SGContent i18n
  genes.css               ★ 基因细分层样式：动效/转场/推镜/组件变体/Hero 居中
  adapters/               React / Vue 薄适配层
```

## 新增一套风格（30 秒）

在 `engine/presets.js` 的 `PRESETS` 数组里加一条：

```js
def('my-style', { name: '我的风格', category: 'art', tags: ['示例'], recommendedEffects: [] }, {
  color: { bg: '#...', primary: '#...', /* ... */ },
  font: { display: '"..."', scale: 1.4 },
  radius: { button: '12px', card: '16px', input: '12px' },
  shadow: { card: '...', button: '...' },
  easing: { inout: 'cubic-bezier(.65,.05,.36,1)' }
  // spacing / type 由 derive() 自动按圆角风格推导
})
```

采集自参考站的预设（归入 `harvest` 类）需额外带**溯源 + 完整基因**。注意：`name` 是**对外显示名**（中性化、不含品牌），`sourcedFrom.name/url` 是**内部溯源真实来源**（客户不可见）：

```js
def('lusion-mono', { name: '黑白沉浸', category: 'harvest', tags: ['3D沉浸','黑白'], recommendedEffects: ['noise'],
  sourcedFrom: { id: 'lusion', name: 'Lusion', url: 'https://lusion.co', type: 'role-model', rank: 'high', concept: 'C2/C5', motion: 'T2/T4/T5 · M3/M5' },
  genes: { motion: 'luxe', transition: 'fade', camera: 'parallax', creative: 'narrative', tone: 'minimal' } }, { /* tokens */ })
```

刷新配置器，新基因即出现在下拉里，全局样式自动重刷——**无需改任何组件代码**。

## 导出基因组（genome.json）

```json
{
  "meta": { "theme": "cyberpunk", "exportedAt": "..." },
  "visual": { "color": {...}, "font": {...}, "type": {...}, "spacing": {...}, ... },
  "behavior": { "motion": ["spring"], "transition": ["fade"], "camera": ["parallax"], "effects": ["neon"] },
  "structure": { "layout": "stack", "component": {"button":"pill","card":"elevated","input":"box"}, "scene3d": "torus" },
  "content": { "language": "en", "tone": "tech", "creative": "data" }
}
```

前端拿到这份 JSON 调 `SGGenes.apply(root, genome)` 一键换装。
