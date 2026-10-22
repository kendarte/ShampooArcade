const nav=document.getElementById('site-nav');
const menu=document.getElementById('menu');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
const langBtn=document.getElementById('lang');
let lang='en';
langBtn.addEventListener('click',()=>{
 lang=lang==='es'?'en':'es'; document.documentElement.lang=lang;
 document.querySelectorAll('[data-es][data-en]').forEach(node=>node.textContent=node.dataset[lang]);
 langBtn.textContent=lang==='es'?'EN':'ES';
 langBtn.setAttribute('aria-label',lang==='es'?'Switch to English':'Cambiar a español');
});
document.getElementById('year').textContent=new Date().getFullYear();

// Magenta navigation highlight follows user selection and the visible section.
const mainNavLinks=[...nav.querySelectorAll('a')];
function setActiveNav(target){mainNavLinks.forEach(link=>{const active=link.getAttribute('href')===target;link.classList.toggle('nav-active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});}
mainNavLinks.forEach(link=>link.addEventListener('click',()=>setActiveNav(link.getAttribute('href'))));
const trackableSections=[...document.querySelectorAll('#programas,#laboratorio,#estudio,#conecta')];
const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible){const section='#'+visible.target.id;setActiveNav(section);}}, {rootMargin:'-15% 0px -60% 0px',threshold:[0,.1,.35]});
trackableSections.forEach(e=>observer.observe(e));