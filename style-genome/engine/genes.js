/**
 * Style Genome · 基因细分引擎（行为 / 结构 / 内容）
 * ------------------------------------------------------------
 * 把「一套风格」再往下拆成更细、可独立切换、可自由组合的基因：
 *
 *   视觉基因 visual   颜色 / 字体 / 排版 / 间距 / 圆角 / 阴影 / 动效曲线
 *                     → 由 theme-engine.js + presets.js 承载（token 层）
 *   行为基因 behavior 动效(motion) / 转场(transition) / 推镜(camera) / 特效(effects)
 *   结构基因 structure 组件变体(component) / 骨架(layout) / 3D 场景(scene3d)
 *   内容基因 content  语言(language) / 文案语气(tone) / 创意方向(creative)
 *
 * 用法：
 *   SGGenes.apply(root, {
 *     motion:'spring', transition:'fade', camera:'parallax',
 *     component:{button:'pill', card:'elevated', input:'box'},
 *     scene3d:'torus', language:'en', tone:'tech', creative:'data'
 *   })
 */
(function (global) {
  'use strict';

  /* ==================== 基因目录 ==================== */

  /* ---- 行为 · 动效 ---- */
  var MOTION = [
    { id: 'calm',   name: '沉稳', css: 'm-calm',   desc: '缓入缓出 · 克制位移' },
    { id: 'spring', name: '弹性', css: 'm-spring', desc: '回弹曲线 · 活泼缩放' },
    { id: 'sharp',  name: '硬朗', css: 'm-sharp',  desc: '近乎瞬时 · 干脆利落' },
    { id: 'luxe',   name: '奢华', css: 'm-luxe',   desc: '慢速缓动 · 若有若无' }
  ];

  /* ---- 行为 · 转场 ---- */
  var TRANSITION = [
    { id: 'fade',     name: '淡入',   css: 'tr-fade' },
    { id: 'slide-up', name: '上滑',   css: 'tr-slide-up' },
    { id: 'zoom',     name: '缩放',   css: 'tr-zoom' },
    { id: 'flip',     name: '翻转',   css: 'tr-flip' },
    { id: 'none',     name: '无',     css: 'tr-none' }
  ];

  /* ---- 行为 · 推镜（镜头运动） ---- */
  var CAMERA = [
    { id: 'static',     name: '静止', css: 'cam-static' },
    { id: 'parallax',   name: '视差', css: 'cam-parallax', js: true },
    { id: 'zoom-drift', name: '推镜', css: 'cam-zoom',     js: false },
    { id: 'tilt',       name: '倾斜', css: 'cam-tilt',     js: false }
  ];

  /* ---- 行为 · 特效（妆容，纯 CSS / 已有 JS） ---- */
  var EFFECTS = [
    { id: 'glass', name: '毛玻璃', type: 'css' },
    { id: 'noise', name: '噪点纹理', type: 'css' },
    { id: 'paper', name: '纸张纹理', type: 'css' },
    { id: 'pixel-font', name: '像素字体', type: 'css' },
    { id: 'glitch', name: '故障闪烁', type: 'css' },
    { id: 'neon', name: '霓虹发光', type: 'css' },
    { id: 'cursor-glow', name: '鼠标光晕', type: 'js' }
  ];

  /* ---- 结构 · 组件变体 ---- */
  var COMPONENT = {
    button: [
      { id: 'pill',    name: '胶囊' },
      { id: 'sharp',   name: '直角' },
      { id: 'outline', name: '描边' }
    ],
    card: [
      { id: 'flat',     name: '扁平' },
      { id: 'elevated', name: '悬浮' },
      { id: 'outline',  name: '描边' },
      { id: 'hard',     name: '硬影' }
    ],
    input: [
      { id: 'box',       name: '方框' },
      { id: 'underline', name: '下划线' },
      { id: 'pill',      name: '胶囊' }
    ]
  };

  /* ---- 结构 · 3D 场景 ---- */
  var SCENE3D = [
    { id: 'torus',  name: '圆环结' },
    { id: 'sphere', name: '球体' },
    { id: 'icosa',  name: '多面体' },
    { id: 'cube',   name: '方块' },
    { id: 'wave',   name: '波浪环' }
  ];

  /* ---- 内容 · 语言 ---- */
  var LANGUAGE = [
    { id: 'zh-CN', name: '简体中文' },
    { id: 'en',    name: 'English' },
    { id: 'zh-TW', name: '繁體中文' }
  ];

  /* ---- 内容 · 文案语气 ---- */
  var TONE = [
    { id: 'formal',  name: '正式' },
    { id: 'playful', name: '活泼' },
    { id: 'minimal', name: '极简' },
    { id: 'tech',    name: '科技' }
  ];

  /* ---- 内容 · 创意方向 ---- */
  var CREATIVE = [
    { id: 'narrative', name: '留白叙事', desc: '大标题 + 极简副文，靠留白讲故事' },
    { id: 'impact',    name: '冲击标题', desc: '超大标题 + 高对比，一句话抓住眼球' },
    { id: 'data',      name: '数据说服', desc: '用数字和对比说服，理性决策' },
    { id: 'emotion',   name: '情感共鸣', desc: '从痛点出发，唤起共鸣再给方案' }
  ];

  global.SG_GENES = {
    motion: MOTION, transition: TRANSITION, camera: CAMERA, effects: EFFECTS,
    component: COMPONENT, scene3d: SCENE3D,
    language: LANGUAGE, tone: TONE, creative: CREATIVE
  };

  /* ==================== 内容引擎（i18n / 语气 / 创意） ==================== */

  var LANGS = {
    'zh-CN': {
      'nav.home': '首页', 'nav.product': '产品', 'nav.cases': '案例',
      'nav.price': '价格', 'nav.about': '关于', 'nav.cta': '立即预约',
      'hero.kicker': 'Style Genome · 四层架构引擎',
      'hero.title': '一套代码，二十种皮肤',
      'hero.sub': '这是换肤引擎的演示预售页。左侧换一套风格基因，整个页面即时换装——颜色、字体、圆角、阴影、动效曲线全部重刷。',
      'hero.ctaPrimary': '立即预售', 'hero.ctaGhost': '观看演示',
      'sec.why': '为什么用这套系统', 'sec.countdown': '距离正式发布',
      'sec.pricing': '定价方案', 'sec.carousel': '他们怎么说',
      'sec.form': '预约演示', 'sec.special': '特殊模块库（按需启用）',
      'footer.line1': '© 2026 Style Genome · 一套代码，二十种皮肤',
      'footer.line2': '四层架构 · Design Tokens → Headless → Layout → Effect'
    },
    'en': {
      'nav.home': 'Home', 'nav.product': 'Product', 'nav.cases': 'Cases',
      'nav.price': 'Pricing', 'nav.about': 'About', 'nav.cta': 'Book now',
      'hero.kicker': 'Style Genome · 4-Layer Engine',
      'hero.title': 'One codebase, twenty skins',
      'hero.sub': 'A demo landing page for the skin engine. Pick a genome on the left and the whole page re-skins instantly — color, type, radius, shadow and easing all re-wired.',
      'hero.ctaPrimary': 'Get early access', 'hero.ctaGhost': 'Watch demo',
      'sec.why': 'Why this system', 'sec.countdown': 'Time to launch',
      'sec.pricing': 'Pricing plans', 'sec.carousel': 'What they say',
      'sec.form': 'Book a demo', 'sec.special': 'Special modules (opt-in)',
      'footer.line1': '© 2026 Style Genome · One codebase, twenty skins',
      'footer.line2': '4-layer · Design Tokens → Headless → Layout → Effect'
    },
    'zh-TW': {
      'nav.home': '首頁', 'nav.product': '產品', 'nav.cases': '案例',
      'nav.price': '價格', 'nav.about': '關於', 'nav.cta': '立即預約',
      'hero.kicker': 'Style Genome · 四層架構引擎',
      'hero.title': '一套程式碼，二十種皮膚',
      'hero.sub': '這是換膚引擎的示範預售頁。左側換一套風格基因，整個頁面即時換裝——顏色、字體、圓角、陰影、動效曲線全部重刷。',
      'hero.ctaPrimary': '立即預售', 'hero.ctaGhost': '觀看示範',
      'sec.why': '為什麼用這套系統', 'sec.countdown': '距離正式發佈',
      'sec.pricing': '定價方案', 'sec.carousel': '他們怎麼說',
      'sec.form': '預約示範', 'sec.special': '特殊模組庫（按需啟用）',
      'footer.line1': '© 2026 Style Genome · 一套程式碼，二十種皮膚',
      'footer.line2': '四層架構 · Design Tokens → Headless → Layout → Effect'
    }
  };

  /* 文案语气：覆盖 Hero 标题 / 副文 / 主按钮（zh-TW 回退 zh-CN） */
  var TONES = {
    formal: {
      'zh-CN': { title: '为每一次点击，注入专业质感', sub: '一套可复用的风格基因系统，让交付从「重新设计」变成「精准换装」。', cta: '获取方案' },
      'en':    { title: 'Professional polish, on every click', sub: 'A reusable style-genome system that turns redesigns into precise re-skins.', cta: 'Get the plan' }
    },
    playful: {
      'zh-CN': { title: '换个皮肤，就像换件衣服', sub: '二十种风格基因随你挑，圆角、色彩、字体一键换装，好玩又高效。', cta: '快来试试' },
      'en':    { title: 'Change skins like changing clothes', sub: 'Twenty genomes to pick — radius, color and type re-skin in one tap.', cta: 'Try it now' }
    },
    minimal: {
      'zh-CN': { title: '少一点，好很多', sub: '克制的留白，精准的排版。', cta: '了解' },
      'en':    { title: 'Less, but better', sub: 'Restrained whitespace. Precise typography.', cta: 'Learn' }
    },
    tech: {
      'zh-CN': { title: '代码即皮肤', sub: 'Design Tokens 驱动，变量即风格，构建即交付。', cta: '接入引擎' },
      'en':    { title: 'Code is the skin', sub: 'Driven by design tokens — variables are the style, build is the deliverable.', cta: 'Integrate' }
    }
  };

  /* 创意方向：覆盖 Hero 标题 / 副文 */
  var CREATIVES = {
    narrative: {
      'zh-CN': { title: '把故事，留在大片的空白里', sub: '用最少的字，讲最重的事。' },
      'en':    { title: 'Tell the story in the whitespace', sub: 'The fewest words carry the most weight.' }
    },
    impact: {
      'zh-CN': { title: '一套代码，二十种皮肤。', sub: '出稿速度翻五倍，客户要什么，30 秒就换什么。' },
      'en':    { title: 'One codebase. Twenty skins.', sub: 'Ship five times faster — re-skin to any client ask in 30 seconds.' }
    },
    data: {
      'zh-CN': { title: '20 套基因 · 6 种骨架 · 9 类特效', sub: '80% 的接单需求，一个配置器覆盖。' },
      'en':    { title: '20 genomes · 6 layouts · 9 effects', sub: 'One configurator covers 80% of client requests.' }
    },
    emotion: {
      'zh-CN': { title: '别再为改一版风格熬夜了', sub: '选骨架、选基因、勾特效，把时间留给真正重要的创意。' },
      'en':    { title: 'Stop pulling all-nighters over restyles', sub: 'Pick layout, genome, effects — save your nights for the ideas that matter.' }
    }
  };

  var SGContent = {
    LANGS: LANGS, TONES: TONES, CREATIVES: CREATIVES,
    apply: function (root, s) {
      if (!root) return;
      s = s || {};
      var lang = s.language || 'zh-CN';
      root.setAttribute('lang', lang);
      var dict = LANGS[lang] || LANGS['zh-CN'];
      Array.prototype.forEach.call(root.querySelectorAll('[data-i18n]'), function (n) {
        var k = n.getAttribute('data-i18n');
        if (dict[k] != null) n.textContent = dict[k];
      });
      var tv = (TONES[s.tone] || {})[lang] || (TONES[s.tone] || {})['zh-CN'];
      var cv = (CREATIVES[s.creative] || {})[lang] || (CREATIVES[s.creative] || {})['zh-CN'];
      function set(key, val) { var n = root.querySelector('[data-i18n="' + key + '"]'); if (n && val) n.textContent = val; }
      set('hero.title', cv && cv.title || tv && tv.title || dict['hero.title']);
      set('hero.sub', cv && cv.sub || tv && tv.sub || dict['hero.sub']);
      set('hero.ctaPrimary', tv && tv.cta || dict['hero.ctaPrimary']);
    }
  };

  /* ==================== 基因应用引擎 ==================== */

  var parClean = null;

  function scrollParent(el) {
    var p = el.parentElement;
    while (p) {
      var o = getComputedStyle(p).overflowY;
      if (o === 'auto' || o === 'scroll') return p;
      p = p.parentElement;
    }
    return null;
  }

  function setupParallax(root) {
    if (parClean) return;
    var items = root.querySelectorAll('[data-parallax]');
    var sp = scrollParent(root);
    var raf;
    function loop() {
      var y = sp ? sp.scrollTop : (window.scrollY || window.pageYOffset);
      Array.prototype.forEach.call(items, function (it) {
        var speed = parseFloat(it.getAttribute('data-parallax') || '0.2');
        it.style.transform = 'translate3d(0,' + (y * speed) + 'px,0)';
      });
      raf = requestAnimationFrame(loop);
    }
    loop();
    parClean = function () {
      cancelAnimationFrame(raf);
      Array.prototype.forEach.call(items, function (it) { it.style.transform = ''; });
    };
  }
  function teardownParallax() { if (parClean) { parClean(); parClean = null; } }

  function applyBehavior(root, b) {
    b = b || {};
    function arr(v) { return Array.isArray(v) ? v : (v == null ? [] : [v]); }
    var ms = arr(b.motion), ts = arr(b.transition), cs = arr(b.camera);
    /* 动效 / 转场 互斥：多选时最后勾选者生效（全局节奏只能一种）；推镜可叠加，全生效 */
    var m = ms.length ? ms[ms.length - 1] : '';
    var t = ts.length ? ts[ts.length - 1] : '';
    MOTION.forEach(function (x) { root.classList.toggle(x.css, x.id === m); });
    TRANSITION.forEach(function (x) { root.classList.toggle(x.css, x.id === t); });
    CAMERA.forEach(function (c) { root.classList.toggle(c.css, cs.indexOf(c.id) >= 0); });
    if (cs.indexOf('parallax') >= 0) setupParallax(root); else teardownParallax();
    /* 转场入场动画：切换时重放 */
    Array.prototype.forEach.call(root.querySelectorAll('.sg-hero, .sg-section'), function (s) {
      s.classList.remove('sg-enter'); void s.offsetWidth; s.classList.add('sg-enter');
    });
  }

  function applyStructure(root, st) {
    st = st || {};
    var comp = st.component || {};
    Object.keys(COMPONENT).forEach(function (kind) {
      COMPONENT[kind].forEach(function (v) {
        root.classList.toggle('sg-' + kind + '-' + v.id, comp[kind] === v.id);
      });
    });
  }

  var SGGenes = {
    MOTION: MOTION, TRANSITION: TRANSITION, CAMERA: CAMERA, EFFECTS: EFFECTS,
    COMPONENT: COMPONENT, SCENE3D: SCENE3D,
    LANGUAGE: LANGUAGE, TONE: TONE, CREATIVE: CREATIVE,
    content: SGContent,
    apply: function (root, g) {
      g = g || {};
      applyBehavior(root, g);
      applyStructure(root, g);
      SGContent.apply(root, { language: g.language, tone: g.tone, creative: g.creative });
    }
  };

  global.SGGenes = SGGenes;
  global.SGContent = SGContent;
})(window);
