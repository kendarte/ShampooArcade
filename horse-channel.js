/* S.A.TV Channel 02 — Horse Racer source footage, swapping 4 animated WebP tiles behind CRT signal interference. */
(() => {
  "use strict";
  const host = document.querySelector("[data-horse-collage]");
  if (!host) return;
  const tiles = Array.from(host.querySelectorAll("[data-horse-collage-tile]"));
  const labels = Array.from(host.querySelectorAll("[data-horse-tile-label]"));
  if (tiles.length !== 4 || labels.length !== 4) return;
  const root = "media/horse-clips/";
  const sets = [
    [["01-start-gate.webp","START LINE"],["02-race-field.webp","THE FIELD"],["03-straightaway.webp","STRAIGHTAWAY"],["04-curve-run.webp","THE TURN"]],
    [["05-red-blue-duel.webp","RED VS BLUE"],["06-final-sprint.webp","FINAL SPRINT"],["07-finish-approach.webp","THE FINISH"],["08-finish-line.webp","RACE DAY"]]
  ];
  let current=0, changing=false, visible=!("IntersectionObserver" in window);
  const ready=[true,false];
  const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
  function preload(index){
    if(ready[index]) return;
    Promise.all(sets[index].map(([file])=>new Promise(resolve=>{
      const image=new Image(); image.onload=()=>resolve(true); image.onerror=()=>resolve(false); image.src=root+file;
    }))).then(results=>{ready[index]=results.every(Boolean)});
  }
  function tune(){
    if(!visible || document.hidden || changing || reduceMotion.matches) return;
    const next=(current+1)%sets.length;
    if(!ready[next]) {preload(next);return}
    changing=true;
    host.classList.remove("is-switching"); void host.offsetWidth;
    host.classList.add("is-switching");
    window.setTimeout(()=>{
      sets[next].forEach(([file,label],i)=>{
        const src=root+file;
        if(tiles[i].getAttribute("src")!==src)tiles[i].setAttribute("src",src);
        labels[i].textContent=label;
      });
      current=next;
    },245);
    window.setTimeout(()=>{host.classList.remove("is-switching");changing=false},580);
  }
  if("IntersectionObserver" in window){
    new IntersectionObserver(entries=>{
      visible=entries.some(entry=>entry.isIntersecting);
      if(visible && !reduceMotion.matches) preload(1);
    },{threshold:.12}).observe(host);
  } else preload(1);
  window.setInterval(tune,6500);
})();
