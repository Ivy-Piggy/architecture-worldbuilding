/* 建筑 · 建造世界观 — 交互脚本 */

(function () {
  'use strict';

  /* ── 阅读进度条 ── */
  var fill = document.getElementById('progress-fill');
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? (window.scrollY / h) * 100 : 0;
    if (fill) fill.style.width = p.toFixed(2) + '%';

    /* 导航阴影 */
    var nav = document.getElementById('nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);

    /* 回到顶部 */
    var top = document.getElementById('toTop');
    if (top) top.classList.toggle('show', window.scrollY > 620);

    updateActiveNav();
  }

  /* ── 导航高亮 ── */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main > section, header#hero'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  function updateActiveNav() {
    var probe = window.scrollY + window.innerHeight * 0.28;
    var current = null;
    sections.forEach(function (s) {
      if (s.offsetTop <= probe) current = s.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  /* ── 滚动揭示 ── */
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { obs.observe(el); });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ── 案例库筛选 ── */
  var btns = document.querySelectorAll('.fbtn');
  var cases = document.querySelectorAll('.case');
  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      btns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      cases.forEach(function (c) {
        var show = (f === 'all') || (c.dataset.region === f);
        c.classList.toggle('hidden', !show);
        if (show) c.classList.add('revealed');
      });
    });
  });

  /* ── 回到顶部 ── */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 平滑锚点（带导航高度补偿） ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navH = document.getElementById('nav').offsetHeight + 14;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ── 元素卡片：鼠标位置微光（轻量视差） ── */
  document.querySelectorAll('.elem, .case, .read').forEach(function (card) {
    card.addEventListener('mousemove', function (ev) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((ev.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((ev.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
