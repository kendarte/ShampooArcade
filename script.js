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

// A click selects one link; section tracking resolves shared destinations separately.
const mainNavLinks=[...nav.querySelectorAll('a')];
const trackableSections=[...document.querySelectorAll('#programas,#laboratorio,#estudio,#conecta')];
let activeNav=mainNavLinks.find(link=>link.classList.contains('nav-active'));
const selectedNavByTarget=new Map();
let pendingNav=null;
let settleTimer;
function setActiveNav(link){
 if(!link)return;
 activeNav=link;
 mainNavLinks.forEach(item=>{
  const active=item===link;
  item.classList.toggle('nav-active',active);
  if(active)item.setAttribute('aria-current','page');
  else item.removeAttribute('aria-current');
 });
}
function followSection(){
 if(pendingNav)return;
 // Read all sections, not just the entries changed in the latest observer batch.
 const marker=window.innerHeight*.4;
 const section=trackableSections.filter(item=>item.getBoundingClientRect().top<=marker).pop()||trackableSections[0];
 const target='#'+section.id;
 const matches=mainNavLinks.filter(link=>link.getAttribute('href')===target);
 setActiveNav(matches.includes(activeNav)?activeNav:selectedNavByTarget.get(target)||matches.find(link=>link.hasAttribute('data-section-default'))||matches[0]);
}
function finishNavigation(){
 clearTimeout(settleTimer);
 pendingNav=null;
 followSection();
}
mainNavLinks.forEach(link=>link.addEventListener('click',()=>{
 selectedNavByTarget.set(link.getAttribute('href'),link);
 setActiveNav(link);
 pendingNav=link;
 clearTimeout(settleTimer);
 // Also settles clicks whose destination is already in view (no scroll event).
 settleTimer=setTimeout(finishNavigation,180);
}));
window.addEventListener('scroll',()=>{
 if(pendingNav){
  clearTimeout(settleTimer);
  settleTimer=setTimeout(finishNavigation,180);
 }else followSection();
},{passive:true});
// Manual input cancels the click's temporary hold during smooth scrolling.
window.addEventListener('wheel',finishNavigation,{passive:true});
window.addEventListener('touchstart',finishNavigation,{passive:true});
window.addEventListener('keydown',event=>{
 if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))finishNavigation();
});
const observer=new IntersectionObserver(followSection,{rootMargin:'-15% 0px -60% 0px',threshold:[0,.1,.35]});
trackableSections.forEach(section=>observer.observe(section));
window.addEventListener('resize',followSection);
setActiveNav(activeNav);
followSection();
