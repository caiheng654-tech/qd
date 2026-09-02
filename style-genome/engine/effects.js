/**
 * Style Genome · Effect Engine（第四层：氛围滤镜 · JS 行为）
 * ------------------------------------------------------------
 * 只负责「需要脚本」的特效：鼠标光晕 / 滚动视差 / 页面转场。
 * 其余（毛玻璃 / 噪点 / 纸纹 / 像素字体 / 故障 / 霓虹）是纯 CSS class，
 * 由 toggle() 统一开关。
 */
(function (global) {
  'use strict';

  var CSS_ONLY = ['glass', 'noise', 'paper', 'pixel-font', 'neon', 'glitch'];
  var JS_EFFECTS = ['cursor-glow', 'parallax', 'page-transition'];

  var state = {}; // root -> { effectName: cleanup }

  function glowEl(root) {
    var g = root.querySelector('.sg-glow');
    if (!g) {
      g = document.createElement('div');
      g.className = 'sg-glow';
      root.appendChild(g);
    }
    return g;
  }

  function setupCursorGlow(root) {
    var glow = glowEl(root);
    glow.style.display = 'block';
    function move(e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }
    window.addEventListener('mousemove', move);
    return function () { glow.style.display = 'none'; window.removeEventListener('mousemove', move); };
  }

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
    var items = root.querySelectorAll('[data-parallax]');
    var sp = scrollParent(root);
    var raf = null;
    function loop() {
      var y = sp ? sp.scrollTop : (window.scrollY || window.pageYOffset);
      items.forEach(function (it) {
        var speed = parseFloat(it.getAttribute('data-parallax') || '0.2');
        it.style.transform = 'translate3d(0,' + (y * speed) + 'px,0)';
      });
      raf = requestAnimationFrame(loop);
    }
    loop();
    return function () {
      cancelAnimationFrame(raf);
      items.forEach(function (it) { it.style.transform = ''; });
    };
  }

  function setupPageTransition(root) {
    var targets = root.querySelectorAll('.sg-hero > *, .sg-section > .sg-container > *');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('in'); });
      return function () {};
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    targets.forEach(function (t) { io.observe(t); });
    return function () { io.disconnect(); targets.forEach(function (t) { t.classList.remove('in'); }); };
  }

  var HANDLERS = { 'cursor-glow': setupCursorGlow, 'parallax': setupParallax, 'page-transition': setupPageTransition };

  function on(root, name) {
    if (!root) return;
    var cls = 'fx-' + name;
    root.classList.add(cls);
    if (HANDLERS[name]) {
      var clean = HANDLERS[name](root);
      state[name] = clean;
    }
  }

  function off(root, name) {
    if (!root) return;
    root.classList.remove('fx-' + name);
    if (state[name]) { state[name](); delete state[name]; }
  }

  function apply(root, effects) {
    CSS_ONLY.concat(JS_EFFECTS).forEach(function (name) {
      var enabled = effects && effects.indexOf(name) >= 0;
      if (enabled) on(root, name); else off(root, name);
    });
  }

  global.SGEffects = {
    CSS_ONLY: CSS_ONLY,
    JS_EFFECTS: JS_EFFECTS,
    on: on,
    off: off,
    apply: apply
  };
})(window);
