/**
 * Style Genome · Theme Engine（内核）
 * ------------------------------------------------------------
 * 职责：把「风格基因」（一套 token JSON）翻译成 CSS 自定义变量，
 *       注入到目标容器上，实现「换一套 JSON 即换一套皮肤」。
 *
 * 框架无关：不依赖任何 UI 框架，React / Vue 只是薄适配层（见 adapters/）。
 * 用法：
 *   SG.applyTheme('cyberpunk', document.getElementById('stage'));
 *   SG.exportTheme('cyberpunk');            // 导出 JSON 字符串
 *   SG.onThemeChange(fn);                    // 监听换肤
 */
(function (global) {
  'use strict';

  /* token 路径 → CSS 变量名 的映射表 */
  const MAP = {
    'color.bg': '--sg-bg',
    'color.bg2': '--sg-bg2',
    'color.surface': '--sg-surface',
    'color.ink': '--sg-ink',
    'color.inkMut': '--sg-ink-mut',
    'color.inkDim': '--sg-ink-dim',
    'color.primary': '--sg-primary',
    'color.primaryContrast': '--sg-primary-contrast',
    'color.secondary': '--sg-secondary',
    'color.accent': '--sg-accent',
    'color.line': '--sg-line',
    'color.glass': '--sg-glass',
    'color.gradient': '--sg-gradient',
    'font.display': '--sg-f-display',
    'font.body': '--sg-f-body',
    'font.mono': '--sg-f-mono',
    'font.fwDisplay': '--sg-fw-display',
    'font.fwBody': '--sg-fw-body',
    'font.lineHeight': '--sg-lh',
    'font.scale': '--sg-scale',
    'font.letterSpacing': '--sg-ls',
    'radius.button': '--sg-r-button',
    'radius.card': '--sg-r-card',
    'radius.input': '--sg-r-input',
    'shadow.card': '--sg-sh-card',
    'shadow.button': '--sg-sh-button',
    'shadow.inset': '--sg-sh-inset',
    'shadow.glow': '--sg-sh-glow',
    'easing.in': '--sg-e-in',
    'easing.out': '--sg-e-out',
    'easing.inout': '--sg-e-inout',
    'easing.bounce': '--sg-e-bounce',
    'easing.linear': '--sg-e-linear',
    'type.maxWidth': '--sg-type-maxw',
    'type.bodySize': '--sg-type-body',
    'type.headingTransform': '--sg-type-h-transform',
    'type.headingAlign': '--sg-type-h-align',
    'type.sectionAlign': '--sg-type-sec-align',
    'type.headingSpacing': '--sg-type-h-spacing',
    'spacing.unit': '--sg-space-unit',
    'spacing.section': '--sg-space-section',
    'spacing.gap': '--sg-space-gap',
    'spacing.container': '--sg-space-container',
    'spacing.stack': '--sg-space-stack'
  };

  const DEFAULTS = {
    color: {
      bg: '#ffffff', bg2: '#f5f5f7', surface: '#ffffff',
      ink: '#111111', inkMut: 'rgba(17,17,17,.66)', inkDim: 'rgba(17,17,17,.42)',
      primary: '#111111', primaryContrast: '#ffffff', secondary: '#4f6bff', accent: '#ff5a5f',
      line: 'rgba(17,17,17,.14)', glass: 'rgba(255,255,255,.6)',
      gradient: 'linear-gradient(120deg,#111111,#4f6bff)'
    },
    font: {
      display: '-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif',
      body: '-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif',
      mono: '"JetBrains Mono",ui-monospace,SFMono-Regular,Consolas,monospace',
      fwDisplay: 700, fwBody: 400, lineHeight: 1.6, scale: 1.333, letterSpacing: '0'
    },
    radius: { button: '10px', card: '14px', input: '10px' },
    shadow: {
      card: '0 8px 30px rgba(0,0,0,.08)',
      button: '0 2px 10px rgba(0,0,0,.14)',
      inset: 'inset 0 0 0 1px rgba(0,0,0,.06)',
      glow: '0 0 24px rgba(0,0,0,.18)'
    },
    easing: {
      in: 'cubic-bezier(.55,.06,.68,.19)',
      out: 'cubic-bezier(.22,.61,.36,1)',
      inout: 'cubic-bezier(.65,.05,.36,1)',
      bounce: 'cubic-bezier(.68,-.55,.27,1.55)',
      linear: 'linear'
    },
    type: {
      maxWidth: '65ch', bodySize: '16px',
      headingTransform: 'none', headingAlign: 'left',
      sectionAlign: 'left', headingSpacing: '0'
    },
    spacing: {
      unit: '8px', section: '96px', gap: '24px',
      container: '1120px', stack: '18px'
    }
  };

  function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }

  function deepMerge(base, over) {
    if (!isObj(over)) return isObj(base) ? base : over;
    const out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    for (const k of Object.keys(over)) {
      out[k] = isObj(over[k]) ? deepMerge(base[k], over[k]) : over[k];
    }
    return out;
  }

  const presets = (global.SG_PRESETS || []).map(function (p) {
    return { id: p.id, name: p.name, category: p.category, tags: p.tags || [],
      recommendedEffects: p.recommendedEffects || [],
      sourcedFrom: p.sourcedFrom || null, genes: p.genes || null,
      layout: p.layout || 'stack',
      tokens: deepMerge(DEFAULTS, p.tokens) };
  });

  const listeners = [];
  let currentId = null;

  function find(id) {
    return presets.find(function (p) { return p.id === id; }) || presets[0];
  }

  function flatten(tokens) {
    const out = {};
    (function walk(prefix, node) {
      for (const k of Object.keys(node)) {
        const key = prefix ? prefix + '.' + k : k;
        if (isObj(node[k])) walk(key, node[k]);
        else { const v = MAP[key]; if (v) out[v] = node[k]; }
      }
    })(null, tokens);
    return out;
  }

  function applyTheme(id, targetEl) {
    const preset = find(id);
    currentId = preset.id;
    const el = targetEl || document.documentElement;
    const vars = flatten(preset.tokens);
    for (const k of Object.keys(vars)) el.style.setProperty(k, vars[k]);
    el.setAttribute('data-theme', preset.id);
    /* 排版基因：Hero 区块居中开关 */
    const secAlign = preset.tokens.type && preset.tokens.type.sectionAlign;
    el.classList.toggle('type-sec-center', secAlign === 'center');
    listeners.forEach(function (fn) { try { fn(preset, el); } catch (e) {} });
    return preset;
  }

  function getTheme(id) { return find(id || currentId); }

  function onThemeChange(fn) { listeners.push(fn); return function () { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); }; }

  function exportTheme(id) { return JSON.stringify(getTheme(id), null, 2); }

  global.SG = {
    DEFAULTS: DEFAULTS,
    presets: presets,
    categories: global.SG_CATEGORIES || [],
    applyTheme: applyTheme,
    getTheme: getTheme,
    onThemeChange: onThemeChange,
    exportTheme: exportTheme,
    flatten: flatten
  };
})(window);
