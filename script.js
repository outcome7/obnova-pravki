'use strict';
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)');
  const header = $('.site-header'), nav = $('#nav'), toggle = $('.menu-toggle');
  function closeNav() { nav.classList.remove('is-open'); toggle?.setAttribute('aria-expanded','false'); toggle?.setAttribute('aria-label','Открыть меню'); }
  toggle?.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open'); nav.classList.toggle('is-open',open);
    toggle.setAttribute('aria-expanded',String(open)); toggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
  });
  $$('a',nav).forEach(a=>a.addEventListener('click',closeNav));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav()});
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeNav()});
  const progress = $('.scroll-progress span');
  let scrollFrame = null;
  function updateProgress(){scrollFrame=null;const max = document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?Math.min(100,Math.max(0,scrollY/max*100)):0)+'%';}
  addEventListener('scroll',()=>{if(scrollFrame===null)scrollFrame=requestAnimationFrame(updateProgress)},{passive:true});
  addEventListener('resize',updateProgress);updateProgress();
  $('#year').textContent=String(new Date().getFullYear());

  const form=$('#lead-form');
  form.addEventListener('submit',e=>{
    e.preventDefault();const status=$('#form-status');status.classList.remove('error');
    const values=Object.fromEntries(new FormData(form).entries());
    const name=(values.name||'').trim(),phone=(values.phone||'').trim(),city=(values.city||'').trim();
    if(!name || !phone || !city){status.textContent='Заполните ФИО, телефон и город.';status.classList.add('error');form.querySelector(!name?'#name':!phone?'#phone':'#city').focus();return;}
    if(!form.elements.consent.checked){status.textContent='Подтвердите согласие на передачу данных через WhatsApp.';status.classList.add('error');form.elements.consent.focus();return;}
    const email=(values.email||'').trim();if(email && !form.elements.email.checkValidity()){status.textContent='Проверьте адрес электронной почты.';status.classList.add('error');form.elements.email.focus();return;}
    const digits=phone.replace(/\D/g,'');
    if(digits.length<10 || digits.length>15){status.textContent='Введите корректный номер телефона (не менее 10 цифр).';status.classList.add('error');form.elements.phone.focus();return;}
    const message=['*НОВАЯ ЗАЯВКА НА ФРАНШИЗУ NUTEO*','','*ФИО:* '+name,'*Телефон:* '+phone,'*Город открытия:* '+city,email?'*E-mail:* '+email:'',values.experience?'*Опыт в бизнесе:* '+values.experience.trim():'',values.space?'*Помещение:* '+values.space:'','*Запрос:* Хочу обсудить открытие и получить финансовую модель.'].filter(Boolean).join('\n');
    const url='https://wa.me/79330052952?text='+encodeURIComponent(message);
    const opened=window.open(url,'_blank');
    if(opened){try{opened.opener=null;}catch(_){} }
    else { window.location.assign(url); }
    status.textContent='Заявка подготовлена. Для передачи менеджеру нажмите «Отправить» в WhatsApp.';
  });

  const mobileCta=$('.mobile-cta');
  if('IntersectionObserver' in window){
    const visible=new Set();const obs=new IntersectionObserver(items=>{items.forEach(x=>x.isIntersecting?visible.add(x.target):visible.delete(x.target));mobileCta.classList.toggle('is-hidden',visible.size>0)},{threshold:.07});
    [$('.hero'),$('#apply'),$('.footer')].forEach(x=>obs.observe(x));
  }

  if(prefersReduced.matches || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js-motion');
  const reveals=$$('.reveal');
  const revealObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}},{threshold:.03,rootMargin:'0px 0px 0px 0px'});
  reveals.forEach(x=>revealObserver.observe(x));
  const numberFormat=new Intl.NumberFormat('ru-RU');
  const nums=$$('[data-count]');
  function animateCounter(el){const end=Number(el.dataset.count);if(!Number.isFinite(end))return;const start=performance.now();const duration=1000;function draw(t){const p=Math.min(1,(t-start)/duration);const ease=1-Math.pow(1-p,4);el.textContent=numberFormat.format(Math.round(end*ease));if(p<1)requestAnimationFrame(draw);}requestAnimationFrame(draw);}
  const counterObserver=new IntersectionObserver(entries=>{entries.forEach(x=>{if(x.isIntersecting){counterObserver.unobserve(x.target);animateCounter(x.target);}})},{threshold:.5});
  nums.forEach(el=>counterObserver.observe(el));
  const chart=$('.bar-chart');const chartObserver=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('is-visible');chartObserver.unobserve(e.target);}}},{threshold:.3});chartObserver.observe(chart);
  prefersReduced.addEventListener?.('change',e=>{if(!e.matches)return;reveals.forEach(x=>x.classList.add('is-visible'));nums.forEach(el=>el.textContent=numberFormat.format(Number(el.dataset.count)));chart.classList.add('is-visible');revealObserver.disconnect();counterObserver.disconnect();chartObserver.disconnect();});
})();
