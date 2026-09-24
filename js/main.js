(function(){
  "use strict";

  /* ---------- Utilidades ---------- */
  function $(sel, ctx){ return (ctx || document).querySelector(sel); }
  function $all(sel, ctx){ return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function haptic(ms){ if ('vibrate' in navigator){ try{ navigator.vibrate(ms || 12); }catch(e){} } }
  function toast(msg){
    var t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function(){ t.classList.remove('show'); }, 2600);
  }
  window.vdaToast = toast;

  /* ---------- Tema (modo oscuro / claro) ---------- */
  function initTheme(){
    var saved = localStorage.getItem('vda-theme');
    var theme = saved || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    $all('.theme-toggle').forEach(function(btn){
      btn.setAttribute('aria-pressed', theme === 'light');
    });
    $all('.theme-toggle').forEach(function(btn){
      btn.addEventListener('click', function(){
        var cur = document.documentElement.getAttribute('data-theme');
        var next = cur === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('vda-theme', next);
        $all('.theme-toggle').forEach(function(b){ b.setAttribute('aria-pressed', next === 'light'); });
        haptic(8);
      });
    });
  }

  /* ---------- Idioma ---------- */
  function initLanguage(){
    var saved = localStorage.getItem('vda-lang') || 'es';
    if (window.applyLanguage) window.applyLanguage(saved);
    $all('.lang-toggle').forEach(function(btn){
      btn.addEventListener('click', function(){
        var cur = localStorage.getItem('vda-lang') || 'es';
        var next = cur === 'es' ? 'en' : 'es';
        window.applyLanguage(next);
        haptic(8);
      });
    });
  }

  /* ---------- Loader ---------- */
  function initLoader(){
    var loader = $('#loader');
    if (!loader) return;
    function hide(){ loader.classList.add('hidden'); }
    if (document.readyState === 'complete') {
      setTimeout(hide, 350);
    } else {
      window.addEventListener('load', function(){ setTimeout(hide, 350); });
    }
    // Salvaguarda: nunca dejar el loader más de 3.5s
    setTimeout(hide, 3500);
  }

  /* ---------- Header con scroll ---------- */
  function initHeaderScroll(){
    var header = $('.site-header');
    if (!header) return;
    function onScroll(){
      header.classList.toggle('scrolled', window.scrollY > 12);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Navegación móvil ---------- */
  function initMobileNav(){
    var toggle = $('.nav-toggle');
    var panel = $('.mobile-nav');
    var scrim = $('.nav-scrim');
    if (!toggle || !panel) return;
    function open(){
      panel.classList.add('open'); scrim.classList.add('show');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function close(){
      panel.classList.remove('open'); scrim.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    toggle.addEventListener('click', function(){
      var isOpen = panel.classList.contains('open');
      isOpen ? close() : open();
      haptic(10);
    });
    scrim.addEventListener('click', close);
    $all('a', panel).forEach(function(a){ a.addEventListener('click', close); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
  }

  /* ---------- Reveal al hacer scroll ---------- */
  function initReveal(){
    var items = $all('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function(i){ i.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function(i){ io.observe(i); });
  }

  /* ---------- Botón volver arriba ---------- */
  function initBackTop(){
    var btn = $('.back-top');
    if (!btn) return;
    function onScroll(){ btn.classList.toggle('show', window.scrollY > 560); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
      haptic(10);
    });
  }

  /* ---------- Microinteracción: resplandor en botones al hover/click ---------- */
  function initButtonGlow(){
    $all('.btn').forEach(function(btn){
      btn.addEventListener('pointermove', function(e){
        var r = btn.getBoundingClientRect();
        btn.style.setProperty('--x', (e.clientX - r.left) + 'px');
        btn.style.setProperty('--y', (e.clientY - r.top) + 'px');
      });
      btn.addEventListener('click', function(){ haptic(10); });
    });
  }

  /* ---------- Banner de cookies ---------- */
  function initCookieBanner(){
    var banner = $('#cookie-banner');
    if (!banner) return;
    var consent = localStorage.getItem('vda-cookie-consent');
    if (!consent) {
      setTimeout(function(){ banner.classList.add('show'); }, 900);
    } else {
      applyAnalyticsConsent(consent === 'accepted');
    }
    var accept = $('#cookie-accept', banner);
    var reject = $('#cookie-reject', banner);
    if (accept) accept.addEventListener('click', function(){
      localStorage.setItem('vda-cookie-consent', 'accepted');
      banner.classList.remove('show');
      applyAnalyticsConsent(true);
      haptic(10);
    });
    if (reject) reject.addEventListener('click', function(){
      localStorage.setItem('vda-cookie-consent', 'rejected');
      banner.classList.remove('show');
      applyAnalyticsConsent(false);
      haptic(10);
    });
  }

  // Analítica desactivada por defecto; solo se activa si el usuario acepta cookies.
  // Sustituye este bloque por tu proveedor real (Plausible, GA4, etc.) usando su script oficial.
  function applyAnalyticsConsent(granted){
    if (!granted) return;
    window.__vdaAnalyticsReady = true;
    // Ejemplo (comentado) para Plausible:
    // var s = document.createElement('script');
    // s.defer = true; s.dataset.domain = 'tudominio.com';
    // s.src = 'https://plausible.io/js/script.js';
    // document.head.appendChild(s);
  }

  /* ---------- Formulario de contacto: validación, autosave, estados ---------- */
  function initContactForm(){
    var form = $('#contact-form');
    if (!form) return;
    var STORAGE_KEY = 'vda-contact-draft';
    var status = $('.form-status', form);
    var submitBtn = $('button[type="submit"]', form);

    function fieldOf(input){ return input.closest('.field'); }
    function showError(input, key){
      var f = fieldOf(input);
      f.classList.add('is-invalid');
      var msg = $('.error-msg', f);
      if (msg) {
        var dict = window.I18N[localStorage.getItem('vda-lang') || 'es'];
        msg.textContent = dict[key] || 'Campo inválido';
      }
    }
    function clearError(input){
      fieldOf(input).classList.remove('is-invalid');
    }
    function validateField(input){
      var value = input.value.trim();
      if (input.hasAttribute('required') && !value) { showError(input, 'form.errReq'); return false; }
      if (input.type === 'email' && value) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(value)) { showError(input, 'form.errEmail'); return false; }
      }
      if (input.tagName === 'TEXTAREA' && value && value.length < 10) { showError(input, 'form.errMsg'); return false; }
      clearError(input);
      return true;
    }

    $all('input, textarea', form).forEach(function(input){
      input.addEventListener('blur', function(){ validateField(input); });
      input.addEventListener('input', function(){
        if (fieldOf(input).classList.contains('is-invalid')) validateField(input);
        autosave();
      });
    });

    /* Autosave */
    function autosave(){
      var data = {};
      $all('input, textarea, select', form).forEach(function(el){ if (el.name) data[el.name] = el.value; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    function restoreDraft(){
      try{
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        var data = JSON.parse(raw);
        Object.keys(data).forEach(function(name){
          var el = form.elements[name];
          if (el) el.value = data[name];
        });
      }catch(e){}
    }
    restoreDraft();

    function setLoading(loading){
      if (!submitBtn) return;
      submitBtn.classList.toggle('is-loading', loading);
      submitBtn.disabled = loading;
    }
    function showStatus(type, key){
      status.className = 'form-status show ' + type;
      var dict = window.I18N[localStorage.getItem('vda-lang') || 'es'];
      status.textContent = dict[key];
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var valid = true;
      $all('input, textarea', form).forEach(function(input){
        if (!validateField(input)) valid = false;
      });
      if (!valid) { haptic([10, 40, 10]); return; }

      setLoading(true);
      status.className = 'form-status';

      // Simulación de envío. Sustituye por tu endpoint real (Formspree, backend propio, etc.)
      setTimeout(function(){
        setLoading(false);
        var ok = true; // cambia la lógica real de éxito/error aquí
        if (ok) {
          showStatus('success', 'form.success');
          haptic(16);
          localStorage.removeItem(STORAGE_KEY);
          form.reset();
          setTimeout(function(){ window.location.href = 'gracias.html'; }, 1100);
        } else {
          showStatus('error', 'form.errorState');
          haptic([10, 30, 10, 30]);
        }
      }, 1100);
    });
  }

  /* ---------- Compartir contenido ---------- */
  function initShare(){
    $all('.share-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var shareData = {
          title: document.title,
          text: 'Valledupar de América — vallenato en Huamanga, Ayacucho',
          url: window.location.href
        };
        if (navigator.share) {
          navigator.share(shareData).catch(function(){});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(shareData.url).then(function(){
            var dict = window.I18N[localStorage.getItem('vda-lang') || 'es'];
            toast(dict['share.copied']);
          });
        }
        haptic(10);
      });
    });
  }

  /* ---------- Testimonios: controles del carrusel ---------- */
  function initTestimonials(){
    var track = $('.testi-track');
    if (!track) return;
    $all('[data-testi-nav]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var dir = btn.getAttribute('data-testi-nav') === 'next' ? 1 : -1;
        var card = $('.testi-card', track);
        var step = card ? card.getBoundingClientRect().width + 22 : 320;
        track.scrollBy({ left: dir * step, behavior: 'smooth' });
        haptic(8);
      });
    });
  }

  /* ---------- Command palette ---------- */
  function initCommandPalette(){
    var backdrop = $('#cmdk-backdrop');
    if (!backdrop) return;
    var input = $('.cmdk input', backdrop);
    var list = $('.cmdk-list', backdrop);
    var items = $all('.cmdk-item', list);
    var activeIndex = 0;

    function open(){
      backdrop.classList.add('open');
      input.value = '';
      filter('');
      setTimeout(function(){ input.focus(); }, 30);
    }
    function close(){
      backdrop.classList.remove('open');
    }
    function filter(q){
      q = q.toLowerCase();
      var visible = [];
      items.forEach(function(item){
        var match = item.textContent.toLowerCase().indexOf(q) > -1;
        item.style.display = match ? 'flex' : 'none';
        item.classList.remove('active');
        if (match) visible.push(item);
      });
      activeIndex = 0;
      if (visible[0]) visible[0].classList.add('active');
    }
    function run(item){
      if (!item) return;
      var action = item.getAttribute('data-action');
      var href = item.getAttribute('data-href');
      close();
      if (href) { window.location.href = href; return; }
      if (action === 'toggle-theme') $('.theme-toggle') && $('.theme-toggle').click();
      if (action === 'toggle-lang') $('.lang-toggle') && $('.lang-toggle').click();
      if (action === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.addEventListener('keydown', function(e){
      var isK = (e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey);
      if (isK) { e.preventDefault(); backdrop.classList.contains('open') ? close() : open(); }
      if (e.key === 'Escape' && backdrop.classList.contains('open')) close();
      if (!backdrop.classList.contains('open')) return;
      var visible = items.filter(function(i){ return i.style.display !== 'none'; });
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, visible.length - 1); visible.forEach(function(i,idx){ i.classList.toggle('active', idx === activeIndex); }); }
      if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); visible.forEach(function(i,idx){ i.classList.toggle('active', idx === activeIndex); }); }
      if (e.key === 'Enter') { run(visible[activeIndex]); }
    });
    backdrop.addEventListener('click', function(e){ if (e.target === backdrop) close(); });
    input.addEventListener('input', function(){ filter(input.value); });
    items.forEach(function(item){ item.addEventListener('click', function(){ run(item); }); });
    $all('[data-open-cmdk]').forEach(function(btn){ btn.addEventListener('click', open); });
  }

  /* ---------- Atajo de teclado: t (tema) ---------- */
  function initShortcuts(){
    document.addEventListener('keydown', function(e){
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 't' || e.key === 'T') { var tt = $('.theme-toggle'); if (tt) tt.click(); }
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function(){
    initTheme();
    initLanguage();
    initLoader();
    initHeaderScroll();
    initMobileNav();
    initReveal();
    initBackTop();
    initButtonGlow();
    initCookieBanner();
    initContactForm();
    initShare();
    initTestimonials();
    initCommandPalette();
    initShortcuts();
  });
})();
