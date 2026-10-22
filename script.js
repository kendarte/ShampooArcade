const nav=document.getElementById('site-nav');
const menu=document.getElementById('menu');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
const langBtn=document.getElementById('lang');
let lang='es';
langBtn.addEventListener('click',()=>{
 lang=lang==='es'?'en':'es'; document.documentElement.lang=lang;
 document.querySelectorAll('[data-es][data-en]').forEach(node=>node.textContent=node.dataset[lang]);
 langBtn.textContent=lang==='es'?'EN':'ES';
 langBtn.setAttribute('aria-label',lang==='es'?'Cambiar a inglés':'Switch to Spanish');
});
document.getElementById('year').textContent=new Date().getFullYear();