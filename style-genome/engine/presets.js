/**
 * Style Genome · 风格基因库（第一层：Design Tokens 预设）
 * ------------------------------------------------------------
 * 20 套预设，分 4 大类。每一套都是「一套完整的 token 基因」，
 * 引擎读到即换肤。新增风格只需在此数组加一条 def(...)，无需改任何代码。
 *
 * def(id, {name, category, tags, recommendedEffects}, tokens)
 * tokens 里只写需要覆盖的字段，其余继承 DEFAULTS（见 theme-engine.js）。
 */
(function (global) {
  'use strict';

  var SANS = '-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif';
  var SERIF = '"Noto Serif SC","Songti SC","SimSun",serif';
  var MONO = '"JetBrains Mono",ui-monospace,Consolas,monospace';
  var HAND = '"ZCOOL KuaiLe","Yuanti SC","Comic Sans MS",cursive';
  var PIXEL = '"Press Start 2P","Courier New",monospace';

  function def(id, meta, tokens) {
    meta = meta || {};
    tokens = tokens || {};
    var d = derive(meta.category, tokens);
    tokens.spacing = tokens.spacing || d.spacing;
    tokens.type = tokens.type || d.type;
    return { id: id, name: meta.name || id, category: meta.category || 'art',
      tags: meta.tags || [], recommendedEffects: meta.recommendedEffects || [],
      /* 溯源 + 完整基因（采集自参考站 / 榜样的天花板级基因） */
      sourcedFrom: meta.sourcedFrom || null,
      genes: meta.genes || null,
      tokens: tokens };
  }

  /**
   * 细分基因自动推导：根据圆角「硬朗/圆润」推导间距节奏，
   * 并按「类别」推导排版差异（换主题 → 排版布局跟着变，不再是千篇一律左对齐）。
   * 任一字段都可在 tokens.spacing / tokens.type 里显式覆盖（独立切换）。
   */
  function derive(category, tokens) {
    var rn = parseInt(((tokens.radius && tokens.radius.button) || '10px'), 10) || 0;
    var tight = rn <= 2;   // 硬朗 → 紧凑
    var airy = rn >= 20;   // 圆润 → 宽松
    var spacing = {
      unit: tight ? '4px' : (airy ? '10px' : '8px'),
      section: tight ? '72px' : (airy ? '120px' : '96px'),
      gap: tight ? '16px' : (airy ? '28px' : '24px'),
      container: '1120px',
      stack: tight ? '12px' : '18px'
    };
    var ls = tokens.font && tokens.font.letterSpacing != null ? tokens.font.letterSpacing : '0';
    /* 类别 → 排版默认（制造主题间排版差异） */
    var CAT_TYPE = {
      'dark-tech':  { headingAlign: 'left',   sectionAlign: 'left',   headingTransform: 'none' },
      'light-heal': { headingAlign: 'center', sectionAlign: 'center', headingTransform: 'none' },
      'business':   { headingAlign: 'left',   sectionAlign: 'left',   headingTransform: 'uppercase' },
      'art':        { headingAlign: 'left',   sectionAlign: 'left',   headingTransform: 'none' }
    }[category] || { headingAlign: 'left', sectionAlign: 'left', headingTransform: 'none' };
    var type = {
      maxWidth: '65ch', bodySize: '16px',
      headingTransform: CAT_TYPE.headingTransform, headingAlign: CAT_TYPE.headingAlign,
      sectionAlign: CAT_TYPE.sectionAlign, headingSpacing: ls
    };
    return { spacing: spacing, type: type };
  }

  var PRESETS = [

    /* ============ 深色 · 科技 ============ */
    def('brutal-dark', { name: '建筑深色', category: 'dark-tech', tags: ['工业', '硬朗', '衬线'], recommendedEffects: ['noise'] }, {
      color: { bg: '#0a0a0a', bg2: '#111111', surface: '#131313', ink: '#ededed', inkMut: 'rgba(237,237,237,.66)', inkDim: 'rgba(237,237,237,.4)', primary: '#ededed', primaryContrast: '#0a0a0a', secondary: '#8f8f8f', accent: '#e0492f', line: 'rgba(237,237,237,.16)', glass: 'rgba(16,16,16,.55)', gradient: 'linear-gradient(120deg,#0a0a0a,#1c1c1c)' },
      font: { display: SERIF, fwDisplay: 200, scale: 1.5, letterSpacing: '-0.01em' },
      radius: { button: '0px', card: '0px', input: '0px' },
      shadow: { card: '8px 8px 0 rgba(237,237,237,.9)', button: '4px 4px 0 #8f8f8f', glow: '0 0 0 rgba(0,0,0,0)' },
      easing: { in: 'linear', out: 'linear', inout: 'linear', bounce: 'linear' }
    }),

    def('cyberpunk', { name: '赛博朋克', category: 'dark-tech', tags: ['霓虹', '故障', '未来'], recommendedEffects: ['neon', 'glitch', 'noise'] }, {
      color: { bg: '#07070d', bg2: '#0c0c16', surface: '#10101c', ink: '#e8f6f0', inkMut: 'rgba(232,246,240,.66)', inkDim: 'rgba(232,246,240,.4)', primary: '#00ffd5', primaryContrast: '#04110e', secondary: '#ff2d95', accent: '#8a5cff', line: 'rgba(0,255,213,.22)', glass: 'rgba(10,12,20,.5)', gradient: 'linear-gradient(120deg,#00ffd5,#8a5cff)' },
      font: { display: SANS, mono: MONO, fwDisplay: 800, scale: 1.45, letterSpacing: '0.02em' },
      radius: { button: '2px', card: '6px', input: '2px' },
      shadow: { card: '0 0 20px rgba(0,255,213,.12)', button: '0 0 16px rgba(0,255,213,.35)', glow: '0 0 18px #00ffd5' },
      easing: { bounce: 'cubic-bezier(.34,1.56,.64,1)' }
    }),

    def('terminal', { name: '极客终端', category: 'dark-tech', tags: ['黑客', 'CRT', '等宽'], recommendedEffects: ['glitch', 'pixel-font'] }, {
      color: { bg: '#010101', bg2: '#03140a', surface: '#020f08', ink: '#33ff66', inkMut: 'rgba(51,255,102,.66)', inkDim: 'rgba(51,255,102,.4)', primary: '#33ff66', primaryContrast: '#010101', secondary: '#00cc44', accent: '#ccff00', line: 'rgba(51,255,102,.25)', glass: 'rgba(1,8,4,.6)', gradient: 'linear-gradient(120deg,#02160a,#042a12)' },
      font: { display: MONO, body: MONO, mono: MONO, fwDisplay: 700, scale: 1.25, letterSpacing: '0' },
      radius: { button: '0px', card: '0px', input: '0px' },
      shadow: { card: '0 0 0 1px rgba(51,255,102,.4)', button: '0 0 12px rgba(51,255,102,.4)', glow: '0 0 12px #33ff66' },
      easing: { in: 'steps(6,end)', out: 'steps(6,end)', inout: 'steps(6,end)' }
    }),

    def('space', { name: '太空科幻', category: 'dark-tech', tags: ['深空', '发光', '星云'], recommendedEffects: ['cursor-glow', 'parallax'] }, {
      color: { bg: '#05061a', bg2: '#0a0d2e', surface: '#0c1036', ink: '#eef0ff', inkMut: 'rgba(238,240,255,.66)', inkDim: 'rgba(238,240,255,.42)', primary: '#7aa2ff', primaryContrast: '#05061a', secondary: '#4dd8f0', accent: '#ff6fa2', line: 'rgba(122,162,255,.2)', glass: 'rgba(10,13,40,.5)', gradient: 'linear-gradient(120deg,#7aa2ff,#4dd8f0)' },
      font: { display: SANS, fwDisplay: 700, scale: 1.5 },
      radius: { button: '24px', card: '20px', input: '16px' },
      shadow: { card: '0 12px 40px rgba(0,0,0,.5)', button: '0 4px 20px rgba(122,162,255,.4)', glow: '0 0 24px #7aa2ff' },
      easing: { out: 'cubic-bezier(.16,1,.3,1)' }
    }),

    def('neon-night', { name: '霓虹夜色', category: 'dark-tech', tags: ['霓虹描边', '夜店', '电光'], recommendedEffects: ['neon'] }, {
      color: { bg: '#0b0b14', bg2: '#12121f', surface: '#161626', ink: '#f2e9ff', inkMut: 'rgba(242,233,255,.66)', inkDim: 'rgba(242,233,255,.4)', primary: '#ff00aa', primaryContrast: '#0b0b14', secondary: '#00e5ff', accent: '#a0ff00', line: 'rgba(255,0,170,.25)', glass: 'rgba(16,14,26,.5)', gradient: 'linear-gradient(120deg,#ff00aa,#00e5ff)' },
      font: { display: SANS, fwDisplay: 900, scale: 1.45, letterSpacing: '0.04em' },
      radius: { button: '12px', card: '14px', input: '12px' },
      shadow: { card: '0 0 24px rgba(255,0,170,.15)', button: '0 0 20px rgba(255,0,170,.45)', glow: '0 0 16px #ff00aa' },
      easing: { bounce: 'cubic-bezier(.34,1.56,.64,1)' }
    }),

    /* ============ 浅色 · 治愈 ============ */
    def('pet-fresh', { name: '宠物鲜食', category: 'light-heal', tags: ['奶油', '圆润', '可爱'], recommendedEffects: ['paper'] }, {
      color: { bg: '#FFF8F0', bg2: '#FFF0E2', surface: '#FFFFFF', ink: '#4a3728', inkMut: 'rgba(74,55,40,.66)', inkDim: 'rgba(74,55,40,.42)', primary: '#ff8a5c', primaryContrast: '#fff', secondary: '#7ec8a8', accent: '#ffd166', line: 'rgba(74,55,40,.12)', glass: 'rgba(255,255,255,.7)', gradient: 'linear-gradient(120deg,#ff8a5c,#ffd166)' },
      font: { display: HAND, fwDisplay: 400, scale: 1.35, letterSpacing: '0.01em' },
      radius: { button: '32px', card: '32px', input: '24px' },
      shadow: { card: '0 20px 50px rgba(255,138,92,.16)', button: '0 8px 20px rgba(255,138,92,.35)', glow: '0 12px 30px rgba(255,138,92,.3)' },
      easing: { inout: 'cubic-bezier(.34,1.56,.64,1)', bounce: 'cubic-bezier(.34,1.56,.64,1)' }
    }),

    def('heal-jp', { name: '治愈日系', category: 'light-heal', tags: ['莫兰迪', '柔和', '清新'], recommendedEffects: ['paper'] }, {
      color: { bg: '#faf6ef', bg2: '#f3ede2', surface: '#fffdf8', ink: '#5b5b5b', inkMut: 'rgba(91,91,91,.66)', inkDim: 'rgba(91,91,91,.42)', primary: '#9db8a1', primaryContrast: '#fff', secondary: '#d9b8a0', accent: '#c8d8e4', line: 'rgba(91,91,91,.12)', glass: 'rgba(255,253,248,.72)', gradient: 'linear-gradient(120deg,#9db8a1,#d9b8a0)' },
      font: { display: SERIF, fwDisplay: 500, scale: 1.4, letterSpacing: '0.02em' },
      radius: { button: '20px', card: '20px', input: '14px' },
      shadow: { card: '0 14px 36px rgba(91,91,91,.1)', button: '0 6px 16px rgba(157,184,161,.35)', glow: '0 10px 28px rgba(157,184,161,.3)' },
      easing: { inout: 'cubic-bezier(.34,1.3,.64,1)' }
    }),

    def('minimal-white', { name: '极简白', category: 'light-heal', tags: ['留白', '克制', '苹果风'], recommendedEffects: [] }, {
      color: { bg: '#ffffff', bg2: '#f6f6f6', surface: '#ffffff', ink: '#111111', inkMut: 'rgba(17,17,17,.66)', inkDim: 'rgba(17,17,17,.42)', primary: '#111111', primaryContrast: '#ffffff', secondary: '#6e6e73', accent: '#0071e3', line: 'rgba(17,17,17,.12)', glass: 'rgba(255,255,255,.72)', gradient: 'linear-gradient(120deg,#111111,#6e6e73)' },
      font: { display: SANS, fwDisplay: 700, scale: 1.5, letterSpacing: '-0.02em' },
      radius: { button: '8px', card: '12px', input: '8px' },
      shadow: { card: '0 4px 24px rgba(0,0,0,.06)', button: '0 2px 8px rgba(0,0,0,.1)', glow: '0 0 0 rgba(0,0,0,0)' },
      easing: { out: 'cubic-bezier(.16,1,.3,1)' }
    }),

    def('new-chinese', { name: '新中式', category: 'light-heal', tags: ['宣纸', '朱砂', '宋体'], recommendedEffects: ['paper'] }, {
      color: { bg: '#f6f1e7', bg2: '#efe8d9', surface: '#fbf8f1', ink: '#2b2118', inkMut: 'rgba(43,33,24,.66)', inkDim: 'rgba(43,33,24,.42)', primary: '#9e2b25', primaryContrast: '#fbf8f1', secondary: '#b8a26a', accent: '#3d5a3d', line: 'rgba(43,33,24,.16)', glass: 'rgba(251,248,241,.7)', gradient: 'linear-gradient(120deg,#9e2b25,#b8a26a)' },
      font: { display: SERIF, body: SERIF, fwDisplay: 600, scale: 1.45, letterSpacing: '0.04em' },
      radius: { button: '2px', card: '4px', input: '2px' },
      shadow: { card: '0 6px 20px rgba(43,33,24,.12)', button: '0 2px 8px rgba(158,43,37,.28)', glow: '0 0 0 rgba(0,0,0,0)' },
      easing: { inout: 'cubic-bezier(.65,.05,.36,1)' }
    }),

    def('nordic-pastel', { name: '北欧淡彩', category: 'light-heal', tags: ['粉彩', '通透', '斯堪的纳维亚'], recommendedEffects: ['paper'] }, {
      color: { bg: '#f2f4f7', bg2: '#e9edf2', surface: '#ffffff', ink: '#33404a', inkMut: 'rgba(51,64,74,.66)', inkDim: 'rgba(51,64,74,.42)', primary: '#7b9db5', primaryContrast: '#fff', secondary: '#d8c0d8', accent: '#a5c9a5', line: 'rgba(51,64,74,.12)', glass: 'rgba(255,255,255,.66)', gradient: 'linear-gradient(120deg,#7b9db5,#d8c0d8)' },
      font: { display: SANS, fwDisplay: 600, scale: 1.35, letterSpacing: '-0.01em' },
      radius: { button: '16px', card: '16px', input: '12px' },
      shadow: { card: '0 10px 30px rgba(51,64,74,.08)', button: '0 4px 14px rgba(123,157,181,.3)', glow: '0 10px 26px rgba(123,157,181,.26)' },
      easing: { inout: 'cubic-bezier(.34,1.4,.64,1)' }
    }),

    /* ============ 商务 · 权威 ============ */
    def('fin-blue', { name: '金融蓝', category: 'business', tags: ['投行', '稳重', '金色'], recommendedEffects: [] }, {
      color: { bg: '#0b1e3a', bg2: '#0e2647', surface: '#122c52', ink: '#e8f0fa', inkMut: 'rgba(232,240,250,.68)', inkDim: 'rgba(232,240,250,.42)', primary: '#1f6feb', primaryContrast: '#fff', secondary: '#f5c518', accent: '#5aa9ff', line: 'rgba(232,240,250,.16)', glass: 'rgba(13,30,58,.6)', gradient: 'linear-gradient(120deg,#1f6feb,#0e2647)' },
      font: { display: SERIF, fwDisplay: 700, scale: 1.4, letterSpacing: '0' },
      radius: { button: '4px', card: '6px', input: '4px' },
      shadow: { card: '0 16px 40px rgba(0,0,0,.35)', button: '0 4px 16px rgba(31,111,235,.4)', glow: '0 0 0 rgba(0,0,0,0)' },
      easing: { inout: 'cubic-bezier(.65,.05,.36,1)' }
    }),

    def('corp-redblack', { name: '企业红黑金', category: 'business', tags: ['集团', '权威', '数字冲击'], recommendedEffects: [] }, {
      color: { bg: '#0d0d0d', bg2: '#161616', surface: '#1a1a1a', ink: '#f2f2f2', inkMut: 'rgba(242,242,242,.68)', inkDim: 'rgba(242,242,242,.42)', primary: '#e60012', primaryContrast: '#fff', secondary: '#c9a227', accent: '#ffffff', line: 'rgba(242,242,242,.16)', glass: 'rgba(18,18,18,.6)', gradient: 'linear-gradient(120deg,#e60012,#c9a227)' },
      font: { display: SANS, fwDisplay: 900, scale: 1.55, letterSpacing: '-0.02em' },
      radius: { button: '2px', card: '2px', input: '2px' },
      shadow: { card: '0 20px 50px rgba(0,0,0,.5)', button: '0 4px 18px rgba(230,0,18,.4)', glow: '0 0 0 rgba(0,0,0,0)' },
      easing: { out: 'cubic-bezier(.16,1,.3,1)' }
    }),

    def('legal-gray', { name: '律政灰', category: 'business', tags: ['律所', '严谨', '衬线'], recommendedEffects: [] }, {
      color: { bg: '#f5f5f0', bg2: '#ecece5', surface: '#fbfbf7', ink: '#1c1c1c', inkMut: 'rgba(28,28,28,.66)', inkDim: 'rgba(28,28,28,.42)', primary: '#2f2f2f', primaryContrast: '#fff', secondary: '#8a6d3b', accent: '#4a4a4a', line: 'rgba(28,28,28,.16)', glass: 'rgba(251,251,247,.7)', gradient: 'linear-gradient(120deg,#2f2f2f,#8a6d3b)' },
      font: { display: SERIF, body: SERIF, fwDisplay: 600, scale: 1.4, letterSpacing: '0.03em' },
      radius: { button: '0px', card: '2px', input: '0px' },
      shadow: { card: '0 4px 16px rgba(28,28,28,.1)', button: '0 2px 6px rgba(28,28,28,.2)', glow: '0 0 0 rgba(0,0,0,0)' },
      easing: { inout: 'cubic-bezier(.65,.05,.36,1)' }
    }),

    def('medical-cyan', { name: '医疗青', category: 'business', tags: ['医疗', '洁净', '信任'], recommendedEffects: [] }, {
      color: { bg: '#ffffff', bg2: '#eef6f7', surface: '#ffffff', ink: '#0f2a33', inkMut: 'rgba(15,42,51,.66)', inkDim: 'rgba(15,42,51,.42)', primary: '#0e7490', primaryContrast: '#fff', secondary: '#67e8f9', accent: '#0f766e', line: 'rgba(15,42,51,.12)', glass: 'rgba(255,255,255,.72)', gradient: 'linear-gradient(120deg,#0e7490,#67e8f9)' },
      font: { display: SANS, fwDisplay: 700, scale: 1.4, letterSpacing: '-0.01em' },
      radius: { button: '10px', card: '12px', input: '10px' },
      shadow: { card: '0 8px 28px rgba(14,116,144,.1)', button: '0 4px 14px rgba(14,116,144,.28)', glow: '0 10px 26px rgba(14,116,144,.24)' },
      easing: { inout: 'cubic-bezier(.65,.05,.36,1)' }
    }),

    def('premium-blackgold', { name: '暗黑奢华', category: 'business', tags: ['奢侈品', '黑金', '高级感'], recommendedEffects: ['cursor-glow'] }, {
      color: { bg: '#0a0a0a', bg2: '#111111', surface: '#141414', ink: '#e6d9b8', inkMut: 'rgba(230,217,184,.66)', inkDim: 'rgba(230,217,184,.42)', primary: '#d4af37', primaryContrast: '#0a0a0a', secondary: '#8a6d3b', accent: '#ffffff', line: 'rgba(212,175,55,.24)', glass: 'rgba(16,16,16,.55)', gradient: 'linear-gradient(120deg,#d4af37,#8a6d3b)' },
      font: { display: SERIF, fwDisplay: 500, scale: 1.5, letterSpacing: '0.06em' },
      radius: { button: '2px', card: '2px', input: '2px' },
      shadow: { card: '0 24px 60px rgba(0,0,0,.6)', button: '0 4px 20px rgba(212,175,55,.35)', glow: '0 0 22px rgba(212,175,55,.4)' },
      easing: { inout: 'cubic-bezier(.65,.05,.36,1)' }
    }),

    /* ============ 艺术 · 个性 ============ */
    def('pop-blast', { name: '波普撞色', category: 'art', tags: ['高饱和', '撞色', '活力'], recommendedEffects: ['noise'] }, {
      color: { bg: '#ffffff', bg2: '#fff5f5', surface: '#ffffff', ink: '#111111', inkMut: 'rgba(17,17,17,.66)', inkDim: 'rgba(17,17,17,.42)', primary: '#ff2e63', primaryContrast: '#fff', secondary: '#00d1ff', accent: '#ffd200', line: 'rgba(17,17,17,.16)', glass: 'rgba(255,255,255,.7)', gradient: 'linear-gradient(120deg,#ff2e63,#ffd200,#00d1ff)' },
      font: { display: SANS, fwDisplay: 900, scale: 1.5, letterSpacing: '-0.03em' },
      radius: { button: '24px', card: '24px', input: '16px' },
      shadow: { card: '6px 6px 0 #111111', button: '4px 4px 0 #111111', glow: '0 0 0 rgba(0,0,0,0)' },
      easing: { inout: 'cubic-bezier(.34,1.56,.64,1)', bounce: 'cubic-bezier(.34,1.56,.64,1)' }
    }),

    def('retro-pixel', { name: '复古像素', category: 'art', tags: ['8bit', '像素', '游戏'], recommendedEffects: ['pixel-font'] }, {
      color: { bg: '#1a1a2e', bg2: '#16162a', surface: '#202040', ink: '#e6e6e6', inkMut: 'rgba(230,230,230,.66)', inkDim: 'rgba(230,230,230,.42)', primary: '#ffcc00', primaryContrast: '#1a1a2e', secondary: '#00c8ff', accent: '#ff0055', line: 'rgba(230,230,230,.2)', glass: 'rgba(26,26,46,.6)', gradient: 'linear-gradient(120deg,#ffcc00,#ff0055)' },
      font: { display: PIXEL, body: PIXEL, mono: PIXEL, fwDisplay: 400, scale: 1.2, letterSpacing: '0' },
      radius: { button: '0px', card: '0px', input: '0px' },
      shadow: { card: '6px 6px 0 #000', button: '4px 4px 0 #000', glow: '0 0 0 rgba(0,0,0,0)' },
      easing: { in: 'steps(4,end)', out: 'steps(4,end)', inout: 'steps(4,end)' }
    }),

    def('handmade-wood', { name: '手作暖木', category: 'art', tags: ['牛皮纸', '手作', '温暖'], recommendedEffects: ['paper', 'noise'] }, {
      color: { bg: '#f7efe2', bg2: '#efe4d2', surface: '#fbf5ea', ink: '#4a3524', inkMut: 'rgba(74,53,36,.66)', inkDim: 'rgba(74,53,36,.42)', primary: '#b5651d', primaryContrast: '#fff', secondary: '#7a9b76', accent: '#c98a4b', line: 'rgba(74,53,36,.16)', glass: 'rgba(251,245,234,.68)', gradient: 'linear-gradient(120deg,#b5651d,#c98a4b)' },
      font: { display: SERIF, fwDisplay: 600, scale: 1.4, letterSpacing: '0.02em' },
      radius: { button: '12px', card: '14px', input: '10px' },
      shadow: { card: '0 10px 28px rgba(74,53,36,.14)', button: '0 4px 12px rgba(181,101,29,.3)', glow: '0 10px 24px rgba(181,101,29,.26)' },
      easing: { inout: 'cubic-bezier(.34,1.3,.64,1)' }
    }),

    def('violet-glow', { name: '电光紫', category: 'art', tags: ['紫色', '渐变', '赛博'], recommendedEffects: ['neon', 'cursor-glow'] }, {
      color: { bg: '#0f0a1e', bg2: '#16102c', surface: '#1b1436', ink: '#ece6ff', inkMut: 'rgba(236,230,255,.66)', inkDim: 'rgba(236,230,255,.42)', primary: '#a855f7', primaryContrast: '#0f0a1e', secondary: '#22d3ee', accent: '#f472b6', line: 'rgba(168,85,247,.25)', glass: 'rgba(20,14,38,.5)', gradient: 'linear-gradient(120deg,#a855f7,#22d3ee)' },
      font: { display: SANS, fwDisplay: 800, scale: 1.45, letterSpacing: '0.01em' },
      radius: { button: '16px', card: '18px', input: '12px' },
      shadow: { card: '0 0 30px rgba(168,85,247,.18)', button: '0 0 22px rgba(168,85,247,.5)', glow: '0 0 18px #a855f7' },
      easing: { inout: 'cubic-bezier(.34,1.4,.64,1)' }
    }),

    def('spring-eco', { name: '春日生态', category: 'art', tags: ['绿色', '有机', '清新'], recommendedEffects: ['paper'] }, {
      color: { bg: '#f4faf0', bg2: '#eaf4e2', surface: '#ffffff', ink: '#22341f', inkMut: 'rgba(34,52,31,.66)', inkDim: 'rgba(34,52,31,.42)', primary: '#4caf50', primaryContrast: '#fff', secondary: '#8bc34a', accent: '#ffd54f', line: 'rgba(34,52,31,.12)', glass: 'rgba(255,255,255,.66)', gradient: 'linear-gradient(120deg,#4caf50,#ffd54f)' },
      font: { display: SANS, fwDisplay: 700, scale: 1.35, letterSpacing: '-0.01em' },
      radius: { button: '20px', card: '22px', input: '14px' },
      shadow: { card: '0 12px 32px rgba(76,175,80,.12)', button: '0 6px 16px rgba(76,175,80,.32)', glow: '0 10px 26px rgba(76,175,80,.28)' },
      easing: { inout: 'cubic-bezier(.34,1.4,.64,1)' }
    }),

    /* ============ 榜样 · 采集（sourcedFrom：天花板级参考，采集→沉淀→复用） ============ */
    /* 沉淀自 assets/role-models/lusion —— 黑白基底 · 沉浸式 3D 叙事 · 极简 HUD */
    def('lusion-mono', { name: '黑白沉浸', category: 'harvest', tags: ['3D沉浸', '黑白', '极简HUD'], recommendedEffects: ['noise'],
      sourcedFrom: { id: 'lusion', name: 'Lusion', url: 'https://lusion.co', type: 'role-model', rank: 'high', concept: 'C2/C5', motion: 'T2/T4/T5 · M3/M5' },
      genes: { motion: 'luxe', transition: 'fade', camera: 'parallax', creative: 'narrative', tone: 'minimal' } }, {
      color: { bg: '#080808', bg2: '#0f0f0f', surface: '#121212', ink: '#f5f5f5', inkMut: 'rgba(245,245,245,.66)', inkDim: 'rgba(245,245,245,.4)', primary: '#ffffff', primaryContrast: '#080808', secondary: '#9a9a9a', accent: '#e8e8e8', line: 'rgba(245,245,245,.18)', glass: 'rgba(16,16,16,.6)', gradient: 'linear-gradient(120deg,#080808,#1c1c1c)' },
      font: { display: SANS, fwDisplay: 500, scale: 1.5, letterSpacing: '-0.02em' },
      radius: { button: '0px', card: '0px', input: '0px' },
      shadow: { card: '0 0 0 1px rgba(245,245,245,.12)', button: '0 0 0 1px rgba(245,245,245,.3)', glow: '0 0 0 rgba(0,0,0,0)' },
      easing: { out: 'cubic-bezier(.16,1,.3,1)' },
      type: { maxWidth: '70ch', headingAlign: 'left', headingSpacing: '-0.02em' },
      spacing: { section: '120px', container: '1280px' }
    }),

    /* 沉淀自 assets/role-models/cuberto —— 浅色留白 · 机构作品集 · 信息层级教科书 */
    def('cuberto-agency', { name: '灵动圆润', category: 'harvest', tags: ['留白', '机构', '作品集'], recommendedEffects: [],
      sourcedFrom: { id: 'cuberto', name: 'Cuberto', url: 'https://cuberto.com', type: 'role-model', rank: 'high', concept: 'C1', motion: '平滑滚动 · 卡片网格' },
      genes: { motion: 'calm', transition: 'slide-up', camera: 'static', creative: 'narrative', tone: 'minimal' } }, {
      color: { bg: '#f7f7f5', bg2: '#efefec', surface: '#ffffff', ink: '#141414', inkMut: 'rgba(20,20,20,.66)', inkDim: 'rgba(20,20,20,.42)', primary: '#141414', primaryContrast: '#ffffff', secondary: '#6b6b6b', accent: '#2f6bff', line: 'rgba(20,20,20,.12)', glass: 'rgba(255,255,255,.72)', gradient: 'linear-gradient(120deg,#141414,#2f6bff)' },
      font: { display: SANS, fwDisplay: 700, scale: 1.4, letterSpacing: '-0.02em' },
      radius: { button: '12px', card: '16px', input: '10px' },
      shadow: { card: '0 10px 40px rgba(0,0,0,.08)', button: '0 2px 8px rgba(0,0,0,.1)', glow: '0 0 0 rgba(0,0,0,0)' },
      easing: { out: 'cubic-bezier(.16,1,.3,1)' },
      type: { maxWidth: '60ch', headingAlign: 'left' },
      spacing: { section: '110px', container: '1240px' }
    }),

    /* 沉淀自 assets/role-models/nanfu —— 红黑金 · 数据锚点 · 权威叙事（T3 时间线 / M1 计数 / M2 数据锚点 / M6 记忆锤） */
    def('nanfu-authority', { name: '红黑权威', category: 'harvest', tags: ['数据锚点', '红黑金', '权威'], recommendedEffects: [],
      sourcedFrom: { id: 'nanfu', name: 'NANFU 南孚', url: 'https://www.nanfu.global', type: 'role-model', rank: 'high', concept: 'C3', motion: 'T1/T3/T5 · M1/M2/M6' },
      genes: { motion: 'sharp', transition: 'slide-up', camera: 'static', creative: 'data', tone: 'formal' } }, {
      color: { bg: '#0d0d0d', bg2: '#141414', surface: '#181818', ink: '#f5f5f5', inkMut: 'rgba(245,245,245,.68)', inkDim: 'rgba(245,245,245,.42)', primary: '#E2372D', primaryContrast: '#ffffff', secondary: '#c9a250', accent: '#ffffff', line: 'rgba(245,245,245,.16)', glass: 'rgba(18,18,18,.6)', gradient: 'linear-gradient(120deg,#E2372D,#c9a250)' },
      font: { display: SANS, fwDisplay: 900, scale: 1.55, letterSpacing: '-0.02em' },
      radius: { button: '2px', card: '2px', input: '2px' },
      shadow: { card: '0 20px 50px rgba(0,0,0,.5)', button: '0 4px 18px rgba(226,55,45,.4)', glow: '0 0 0 rgba(0,0,0,0)' },
      easing: { out: 'cubic-bezier(.16,1,.3,1)' },
      type: { maxWidth: '70ch', headingAlign: 'left', headingSpacing: '-0.02em' },
      spacing: { section: '120px', container: '1200px' }
    }),

    /* 沉淀自 assets/role-models/aurevia —— 深暖黑 · 金属金 · 衬线三体 · HUD（T6 粒子走廊 / T7 站点轮播 / M8 逐字 / M9 HUD） */
    def('aurevia-cinema', { name: '沉浸影院', category: 'harvest', tags: ['深暖黑', '金属金', '沉浸'], recommendedEffects: ['noise', 'cursor-glow', 'parallax'],
      sourcedFrom: { id: 'aurevia', name: 'Aurevia', url: 'https://aurevia-studio.pages.dev/', type: 'role-model', rank: 'high', concept: 'C1/C5', motion: 'T6/T7 · M8/M9' },
      genes: { motion: 'luxe', transition: 'zoom', camera: 'parallax', creative: 'narrative', tone: 'formal' } }, {
      color: { bg: '#0a0805', bg2: '#14100a', surface: '#18130c', ink: '#f0e9db', inkMut: 'rgba(240,233,219,.66)', inkDim: 'rgba(240,233,219,.42)', primary: '#d4af37', primaryContrast: '#0a0805', secondary: '#8a6d3b', accent: '#c9a227', line: 'rgba(212,175,55,.22)', glass: 'rgba(16,12,8,.5)', gradient: 'linear-gradient(120deg,#d4af37,#1e6e62)' },
      font: { display: SERIF, body: SANS, mono: MONO, fwDisplay: 500, scale: 1.45, letterSpacing: '0.02em' },
      radius: { button: '2px', card: '2px', input: '2px' },
      shadow: { card: '0 24px 60px rgba(0,0,0,.6)', button: '0 4px 20px rgba(212,175,55,.3)', glow: '0 0 26px rgba(212,175,55,.4)' },
      easing: { inout: 'cubic-bezier(.65,.05,.36,1)' },
      type: { maxWidth: '55ch', headingAlign: 'center', sectionAlign: 'center', headingSpacing: '0.02em' },
      spacing: { section: '140px', container: '1200px' }
    }),

    /* 采集自参考站 awwwards —— 极简画廊 · 编辑式大标题 · 宽网格留白 */
    def('awwwards-gallery', { name: '编辑画廊', category: 'harvest', tags: ['编辑式', '大标题', '极简'], recommendedEffects: [],
      sourcedFrom: { id: 'awwwards', name: 'Awwwards', url: 'https://www.awwwards.com', type: 'site', category: 'inspiration', motion: 'T5 · M5' },
      genes: { motion: 'sharp', transition: 'slide-up', camera: 'static', creative: 'impact', tone: 'minimal' } }, {
      color: { bg: '#ffffff', bg2: '#f4f4f4', surface: '#ffffff', ink: '#0a0a0a', inkMut: 'rgba(10,10,10,.66)', inkDim: 'rgba(10,10,10,.42)', primary: '#0a0a0a', primaryContrast: '#ffffff', secondary: '#666666', accent: '#0047ff', line: 'rgba(10,10,10,.14)', glass: 'rgba(255,255,255,.7)', gradient: 'linear-gradient(120deg,#0a0a0a,#0047ff)' },
      font: { display: SANS, fwDisplay: 600, scale: 1.5, letterSpacing: '-0.03em' },
      radius: { button: '0px', card: '0px', input: '0px' },
      shadow: { card: '0 0 0 1px rgba(10,10,10,.1)', button: '0 0 0 1px rgba(10,10,10,.2)', glow: '0 0 0 rgba(0,0,0,0)' },
      easing: { out: 'cubic-bezier(.16,1,.3,1)' },
      type: { maxWidth: '70ch', headingAlign: 'left', headingTransform: 'uppercase', headingSpacing: '-0.03em' },
      spacing: { section: '120px', container: '1440px' }
    }),

    /* 采集自参考站 shadcn/ui —— 中性色系统 · 精致圆角 · 克制无衬线 */
    def('shadcn-neutral', { name: '中性系统', category: 'harvest', tags: ['中性色', '系统化', '克制'], recommendedEffects: [],
      sourcedFrom: { id: 'ui-shadcn', name: 'shadcn/ui', url: 'https://ui.shadcn.com', type: 'site', category: 'ui-components', motion: '微交互' },
      genes: { motion: 'calm', transition: 'fade', camera: 'static', creative: 'data', tone: 'minimal' } }, {
      color: { bg: '#ffffff', bg2: '#f4f4f5', surface: '#ffffff', ink: '#18181b', inkMut: 'rgba(24,24,27,.66)', inkDim: 'rgba(24,24,27,.42)', primary: '#18181b', primaryContrast: '#ffffff', secondary: '#71717a', accent: '#2563eb', line: 'rgba(24,24,27,.12)', glass: 'rgba(255,255,255,.7)', gradient: 'linear-gradient(120deg,#18181b,#2563eb)' },
      font: { display: SANS, fwDisplay: 600, scale: 1.25, letterSpacing: '-0.01em' },
      radius: { button: '6px', card: '10px', input: '6px' },
      shadow: { card: '0 1px 3px rgba(0,0,0,.06)', button: '0 1px 2px rgba(0,0,0,.1)', glow: '0 0 0 rgba(0,0,0,0)' },
      easing: { inout: 'cubic-bezier(.65,.05,.36,1)' },
      type: { maxWidth: '65ch', headingAlign: 'left' },
      spacing: { section: '96px', container: '1200px', stack: '16px' }
    })
  ];

  /* 主题 → 推荐布局骨架：换主题自动切换布局，制造「主题间排版布局差异」。
   * 用户仍可在配置器手动改骨架，改后保持手动选择，直到再换主题。 */
  var LAYOUT_OVERRIDE = {
    /* 深色·科技 */
    'brutal-dark': 'stack', 'cyberpunk': 'fullscreen', 'terminal': 'stack',
    'space': 'fullscreen', 'neon-night': 'center',
    /* 浅色·治愈 */
    'pet-fresh': 'center', 'heal-jp': 'center', 'minimal-white': 'stack',
    'new-chinese': 'stack', 'nordic-pastel': 'center',
    /* 商务·权威 */
    'fin-blue': 'stack', 'corp-redblack': 'fullscreen', 'legal-gray': 'stack',
    'medical-cyan': 'stack', 'premium-blackgold': 'fullscreen',
    /* 艺术·个性 */
    'pop-blast': 'masonry', 'retro-pixel': 'split', 'handmade-wood': 'center',
    'violet-glow': 'center', 'spring-eco': 'masonry',
    /* 榜样·采集 */
    'lusion-mono': 'fullscreen', 'cuberto-agency': 'stack', 'nanfu-authority': 'fullscreen',
    'aurevia-cinema': 'center', 'awwwards-gallery': 'masonry', 'shadcn-neutral': 'stack'
  };
  PRESETS.forEach(function (p) { p.layout = LAYOUT_OVERRIDE[p.id] || 'stack'; });

  var CATEGORIES = [
    { id: 'dark-tech', name: '深色 · 科技' },
    { id: 'light-heal', name: '浅色 · 治愈' },
    { id: 'business', name: '商务 · 权威' },
    { id: 'art', name: '艺术 · 个性' },
    { id: 'harvest', name: '榜样 · 采集' }
  ];

  global.SG_PRESETS = PRESETS;
  global.SG_CATEGORIES = CATEGORIES;
})(window);
