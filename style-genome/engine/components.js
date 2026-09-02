/**
 * Style Genome · Headless 组件层（第二层：骨架）
 * ------------------------------------------------------------
 * 只负责逻辑（点击 / 轮播 / 表单校验 / 倒计时），产出语义 class，
 * 不带任何颜色、字体、圆角、阴影 —— 全部由第一层 CSS 变量注入。
 * 框架无关：React / Vue 薄适配见 adapters/。
 */
(function (global) {
  'use strict';

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* ---------------- 导航栏 ---------------- */
  function navbar(props) {
    props = props || {};
    var links = props.links || ['首页', '产品', '案例', '价格', '关于'];
    var nav = el('nav', 'sg-nav');
    nav.appendChild(el('div', 'brand', props.brand || 'SG·DEMO'));
    var box = el('div', 'links');
    links.forEach(function (t) { box.appendChild(el('a', '', t)); });
    box.appendChild(el('a', 'sg-btn primary', props.cta || '立即预约'));
    nav.appendChild(box);
    return nav;
  }

  /* ---------------- Hero ---------------- */
  function hero(props) {
    props = props || {};
    var s = el('section', 'sg-hero');
    if (props.kicker) s.appendChild(el('span', 'sg-kicker', props.kicker));
    s.appendChild(el('h1', '', props.title || '让每一次点击，都成为一次心动'));
    s.appendChild(el('p', 'sub', props.sub || '一套代码，二十种皮肤。这是 Style Genome 的演示预售页——换一套风格基因，整个页面即时换装。'));
    var cta = el('div', 'cta');
    cta.appendChild(el('button', 'sg-btn primary', props.ctaPrimary || '立即预售'));
    cta.appendChild(el('button', 'sg-btn ghost', props.ctaGhost || '观看演示'));
    s.appendChild(cta);
    return s;
  }

  /* ---------------- 卡片列表 ---------------- */
  function cardList(props) {
    props = props || {};
    var sec = el('section', 'sg-section' + (props.alt ? ' alt' : ''));
    var wrap = el('div', 'sg-container');
    if (props.title) wrap.appendChild(el('h2', '', props.title));
    var cards = props.cards || [
      { icon: '⚡', title: '零依赖内核', desc: '纯 CSS 变量 + ES Module，无构建、无依赖，客户双击即用。' },
      { icon: '🎨', title: '二十套基因', desc: '四类风格基因库，接单导入配置，换变量即换皮肤。' },
      { icon: '🧩', title: '七件套组件', desc: '导航 / Hero / 卡片 / 表单 / 倒计时 / 定价 / 轮播，开箱即用。' },
      { icon: '✨', title: '九种特效', desc: '毛玻璃 / 噪点 / 纸纹 / 视差 / 光晕 / 转场 / 像素 / 故障 / 霓虹。' }
    ];
    var grid = el('div', 'sg-grid');
    cards.forEach(function (c) {
      var card = el('article', 'sg-card');
      card.appendChild(el('div', 'icon', c.icon));
      card.appendChild(el('h3', '', c.title));
      card.appendChild(el('p', '', c.desc));
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    sec.appendChild(wrap);
    return sec;
  }

  /* ---------------- 表单（带校验） ---------------- */
  function form(props) {
    props = props || {};
    var wrap = el('div', 'sg-container');
    if (props.title) wrap.appendChild(el('h2', '', props.title));
    var f = el('form', 'sg-form');
    f.setAttribute('novalidate', 'true');

    function field(label, input) {
      var d = el('div', 'sg-field');
      d.appendChild(el('label', 'sg-label', label));
      d.appendChild(input);
      d.appendChild(el('span', 'sg-error', '此项为必填'));
      f.appendChild(d);
      return input;
    }
    var name = field('称呼', el('input', 'sg-input'));
    name.placeholder = '你的名字'; name.name = 'name';
    var mail = field('邮箱', el('input', 'sg-input'));
    mail.placeholder = 'you@example.com'; mail.name = 'email';
    var area = el('textarea', 'sg-textarea'); area.rows = 3; area.placeholder = '想对我们说点什么（选填）';
    f.appendChild(area);
    var submit = el('button', 'sg-btn primary', props.submit || '提交预约');
    submit.type = 'submit';
    f.appendChild(submit);

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      [name, mail].forEach(function (inp) {
        var d = inp.parentElement;
        var valid = inp.name === 'email'
          ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())
          : inp.value.trim().length > 0;
        d.classList.toggle('invalid', !valid);
        if (!valid) ok = false;
      });
      if (ok) { f.reset(); submit.textContent = '已提交 ✓'; setTimeout(function () { submit.textContent = props.submit || '提交预约'; }, 1800); }
    });
    wrap.appendChild(f);
    var sec = el('section', 'sg-section'); sec.appendChild(wrap);
    return sec;
  }

  /* ---------------- 倒计时 ---------------- */
  function countdown(props) {
    props = props || {};
    var sec = el('section', 'sg-section alt');
    var wrap = el('div', 'sg-container');
    if (props.title) wrap.appendChild(el('h2', '', props.title));
    var cd = el('div', 'sg-countdown');
    var target = props.target instanceof Date ? props.target.getTime() : Date.now() + (props.days || 30) * 864e5;
    var units = [['num-d', '天'], ['num-h', '时'], ['num-m', '分'], ['num-s', '秒']];
    units.forEach(function (u) {
      var c = el('div', 'sg-count');
      c.appendChild(el('div', 'num ' + u[0], '0'));
      c.appendChild(el('div', 'lbl', u[1]));
      cd.appendChild(c);
    });
    var refs = {
      d: cd.querySelector('.num-d'), h: cd.querySelector('.num-h'),
      m: cd.querySelector('.num-m'), s: cd.querySelector('.num-s')
    };
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function tick() {
      var diff = Math.max(0, target - Date.now());
      var d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24,
        m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
      refs.d.textContent = d; refs.h.textContent = pad(h); refs.m.textContent = pad(m); refs.s.textContent = pad(s);
    }
    tick();
    var timer = setInterval(tick, 1000);
    sec.dataset.sgTimer = String(timer);
    wrap.appendChild(cd);
    sec.appendChild(wrap);
    return sec;
  }

  /* ---------------- 定价表 ---------------- */
  function pricing(props) {
    props = props || {};
    var sec = el('section', 'sg-section');
    var wrap = el('div', 'sg-container');
    if (props.title) wrap.appendChild(el('h2', '', props.title));
    var plans = props.plans || [
      { name: '基础版', price: '99', per: '/月', features: ['1 个站点', '10 套基因', '邮件支持'], featured: false },
      { name: '专业版', price: '299', per: '/月', features: ['无限站点', '20 套基因 + 自定义', '优先支持'], featured: true },
      { name: '旗舰版', price: '999', per: '/月', features: ['全部功能', '专属定制基因', '一对一顾问'], featured: false }
    ];
    var grid = el('div', 'sg-pricing');
    plans.forEach(function (p) {
      var plan = el('div', 'sg-plan' + (p.featured ? ' featured' : ''));
      plan.appendChild(el('div', 'name', p.name));
      var price = el('div', 'sg-price');
      price.appendChild(el('span', 'amount', '¥'));
      price.appendChild(document.createTextNode(p.price));
      price.appendChild(el('span', 'per', p.per));
      plan.appendChild(price);
      var ul = el('ul');
      p.features.forEach(function (f) { ul.appendChild(el('li', '', f)); });
      plan.appendChild(ul);
      plan.appendChild(el('button', 'sg-btn ' + (p.featured ? 'primary' : 'ghost'), p.featured ? '立即升级' : '选择方案'));
      grid.appendChild(plan);
    });
    wrap.appendChild(grid);
    sec.appendChild(wrap);
    return sec;
  }

  /* ---------------- 轮播图 ---------------- */
  function carousel(props) {
    props = props || {};
    var sec = el('section', 'sg-section alt');
    var wrap = el('div', 'sg-container');
    if (props.title) wrap.appendChild(el('h2', '', props.title));
    var slides = props.slides || [
      { quote: '换一套风格基因，整个页面一秒换装。这套系统让我们的出稿速度翻了五倍。', who: '某设计工作室 · 主理人' },
      { quote: '客户要“可爱一点”，我改了一个圆角变量和一个字体，30 秒交稿。', who: '独立接单设计师 · 阿哲' },
      { quote: '四种骨架 + 二十套皮肤，几乎覆盖了我 80% 的接单需求。', who: '前端外包 · 老周' }
    ];
    var car = el('div', 'sg-carousel');
    var track = el('div', 'sg-track');
    slides.forEach(function (s) {
      var slide = el('div', 'sg-slide');
      slide.appendChild(el('blockquote', '', s.quote));
      slide.appendChild(el('div', 'who', '— ' + s.who));
      track.appendChild(slide);
    });
    car.appendChild(track);
    car.appendChild(el('button', 'nav prev', '‹'));
    car.appendChild(el('button', 'nav next', '›'));
    wrap.appendChild(car);
    var dots = el('div', 'sg-dots');
    wrap.appendChild(dots);
    var idx = 0;
    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + idx * 100 + '%)';
      Array.prototype.forEach.call(dots.children, function (d, k) { d.classList.toggle('active', k === idx); });
    }
    slides.forEach(function (_, k) { dots.appendChild(el('button', 'sg-dot' + (k === 0 ? ' active' : ''))); });
    car.querySelector('.prev').addEventListener('click', function () { go(idx - 1); });
    car.querySelector('.next').addEventListener('click', function () { go(idx + 1); });
    dots.addEventListener('click', function (e) { if (e.target.classList.contains('sg-dot')) go(Array.prototype.indexOf.call(dots.children, e.target)); });
    sec.appendChild(wrap);
    return sec;
  }

  global.SGComponents = { navbar: navbar, hero: hero, cardList: cardList, form: form, countdown: countdown, pricing: pricing, carousel: carousel };
})(window);
