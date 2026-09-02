/**
 * Style Genome · 特殊模块库（按需启用）
 * ------------------------------------------------------------
 * 4 个重组件，均「按需挂载 / 可销毁」，颜色取自第一层变量：
 *   particles()   粒子背景（Canvas）
 *   pixelCanvas() 像素画布（可交互涂鸦）
 *   threeD()      3D 容器（Three.js，CDN 懒加载，失败自动降级）
 *   audio()       音频播放器（WebAudio 合成，无需外部素材）
 */
(function (global) {
  'use strict';

  function cssVar(name, root) {
    return getComputedStyle(root || document.documentElement).getPropertyValue(name).trim();
  }

  /* ---------- 粒子背景 ---------- */
  function particles(container, opts) {
    opts = opts || {};
    var root = container.closest('.sg-root') || document.documentElement;
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    container.style.position = 'relative';
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var W, H, dots = [];
    function resize() {
      W = canvas.width = container.clientWidth;
      H = canvas.height = container.clientHeight;
    }
    var N = opts.count || 90;
    for (var i = 0; i < N; i++) dots.push({
      x: Math.random(), y: Math.random(), r: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4
    });
    var c1 = cssVar('--sg-primary', root), c2 = cssVar('--sg-secondary', root);
    var raf;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(function (d) {
        d.x += d.vx / W; d.y += d.vy / H;
        if (d.x < 0 || d.x > 1) d.vx *= -1;
        if (d.y < 0 || d.y > 1) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
        ctx.fillStyle = (d.r > 1.8) ? c2 : c1;
        ctx.globalAlpha = 0.7;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    resize();
    window.addEventListener('resize', resize);
    draw();
    return { destroy: function () { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); canvas.remove(); } };
  }

  /* ---------- 像素画布 ---------- */
  function pixelCanvas(container) {
    var root = container.closest('.sg-root') || document.documentElement;
    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(20,1fr);gap:2px;padding:1rem;';
    var c1 = cssVar('--sg-primary', root), c2 = cssVar('--sg-secondary', root);
    var cells = [];
    for (var i = 0; i < 400; i++) {
      var c = document.createElement('div');
      c.style.cssText = 'aspect-ratio:1;background:' + cssVar('--sg-bg2', root) + ';border-radius:2px;cursor:pointer;';
      c.addEventListener('click', function () { this.style.background = this.style.background === 'rgb(0, 0, 0)' || !this.style.background ? c1 : (this.dataset.on ? cssVar('--sg-bg2', root) : c1); this.dataset.on = this.dataset.on ? '' : '1'; });
      cells.push(c); grid.appendChild(c);
    }
    container.appendChild(grid);
    return { destroy: function () { grid.remove(); } };
  }

  /* ---------- 3D 容器（Three.js · 支持场景基因切换） ---------- */
  var SCENES3D = {
    torus:  { geo: 'TorusKnotGeometry',    args: [1.1, 0.34, 140, 20] },
    sphere: { geo: 'SphereGeometry',       args: [1.2, 48, 48] },
    icosa:  { geo: 'IcosahedronGeometry',  args: [1.2, 0] },
    cube:   { geo: 'BoxGeometry',          args: [1.5, 1.5, 1.5] },
    wave:   { geo: 'TorusGeometry',        args: [1.1, 0.4, 24, 80] }
  };
  var MATERIALS3D = {
    metal: { metalness: 0.7,  roughness: 0.25 },
    glass: { metalness: 0.1,  roughness: 0.05, transparent: true, opacity: 0.85 },
    glow:  { metalness: 0.2,  roughness: 0.3 }
  };

  function threeD(container, opts) {
    opts = opts || {};
    var root = container.closest('.sg-root') || document.documentElement;
    var c1 = cssVar('--sg-primary', root) || '#8888ff';
    var c2 = cssVar('--sg-secondary', root) || '#ff5a5f';
    var sceneCfg = SCENES3D[opts.shape] || SCENES3D.torus;
    var matCfg = MATERIALS3D[opts.material] || MATERIALS3D.metal;
    var speed = opts.speed || 1;
    var holder = document.createElement('div');
    holder.style.cssText = 'position:relative;height:280px;overflow:hidden;border-radius:var(--sg-r-card);';
    container.appendChild(holder);

    var cleanup = function () {};
    var loaded = false;

    function init() {
      if (!window.THREE) return;
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(50, holder.clientWidth / holder.clientHeight, 0.1, 100);
      camera.position.z = 4;
      var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
      renderer.setSize(holder.clientWidth, holder.clientHeight);
      holder.appendChild(renderer.domElement);

      var group = new THREE.Group();
      var geo = new THREE[sceneCfg.geo].apply(THREE, sceneCfg.args);
      var mat = new THREE.MeshStandardMaterial(Object.assign({
        color: new THREE.Color(c1), emissive: new THREE.Color(c2), emissiveIntensity: 0.15
      }, matCfg));
      var mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
      scene.add(group);
      var l1 = new THREE.PointLight(0xffffff, 1.4); l1.position.set(4, 4, 5); scene.add(l1);
      var l2 = new THREE.AmbientLight(0x444466, 1); scene.add(l2);

      var raf;
      function animate() {
        group.rotation.x += 0.005 * speed; group.rotation.y += 0.008 * speed;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      }
      animate();
      cleanup = function () { cancelAnimationFrame(raf); renderer.dispose(); geo.dispose(); mat.dispose(); holder.innerHTML = ''; };
      loaded = true;
    }

    var s = document.createElement('script');
    s.src = 'https://unpkg.com/three@0.160.0/build/three.min.js';
    s.onload = init;
    s.onerror = function () {
      holder.innerHTML = '<div style="padding:2rem;color:var(--sg-ink-mut);text-align:center;">3D 模块加载失败（网络受限），已降级为占位。</div>';
    };
    document.head.appendChild(s);

    return { destroy: function () { if (loaded) cleanup(); else { s.onload = s.onerror = null; } holder.remove(); } };
  }

  /* ---------- 音频播放器（WebAudio 合成） ---------- */
  function audio(container) {
    var root = container.closest('.sg-root') || document.documentElement;
    var box = document.createElement('div');
    box.className = 'sg-audio';
    box.style.cssText = 'display:flex;align-items:center;gap:1rem;padding:1rem 1.2rem;border:1px solid var(--sg-line);border-radius:var(--sg-r-card);box-shadow:var(--sg-sh-card);background:var(--sg-surface);max-width:460px;';
    var btn = document.createElement('button');
    btn.className = 'sg-btn primary';
    btn.textContent = '▶ 播放';
    var eq = document.createElement('div');
    eq.style.cssText = 'flex:1;display:flex;gap:3px;height:28px;align-items:flex-end;';
    var bars = [];
    for (var i = 0; i < 14; i++) { var b = document.createElement('span'); b.style.cssText = 'flex:1;background:' + cssVar('--sg-primary', root) + ';border-radius:2px;height:6px;transition:height .2s;'; bars.push(b); eq.appendChild(b); }
    box.appendChild(btn); box.appendChild(eq);
    container.appendChild(box);

    var actx = null, playing = false, nodes = [], timer = null;
    function start() {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      var now = actx.currentTime;
      var freqs = [261.63, 329.63, 392.0, 523.25];
      freqs.forEach(function (f, i) {
        var osc = actx.createOscillator();
        var g = actx.createGain();
        osc.type = 'triangle'; osc.frequency.value = f;
        g.gain.setValueAtTime(0.0001, now + i * 0.5);
        g.gain.exponentialRampToValueAtTime(0.18, now + i * 0.5 + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.5 + 1.6);
        osc.connect(g); g.connect(actx.destination);
        osc.start(now + i * 0.5); osc.stop(now + i * 0.5 + 1.7);
      });
      timer = setInterval(function () {
        bars.forEach(function (b) { b.style.height = (4 + Math.random() * 22) + 'px'; });
      }, 120);
      playing = true; btn.textContent = '■ 停止';
    }
    function stop() {
      clearInterval(timer);
      bars.forEach(function (b) { b.style.height = '6px'; });
      playing = false; btn.textContent = '▶ 播放';
    }
    btn.addEventListener('click', function () { playing ? stop() : start(); });

    return { destroy: function () { stop(); if (actx) actx.close(); box.remove(); } };
  }

  global.SGSpecial = { particles: particles, pixelCanvas: pixelCanvas, threeD: threeD, audio: audio };
})(window);
