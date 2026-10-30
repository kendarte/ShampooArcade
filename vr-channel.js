/* S.A. TV — real gameplay collage. Only the VR Arcade Lab lineup screen is changed. */
(() => {
  "use strict";
  const root = document.querySelector("[data-vr-collage]");
  if (!root) return;
  const tiles = Array.from(root.querySelectorAll("[data-vr-collage-tile]"));
  if (tiles.length !== 4) return;

  const base = "search-and-destroy/assets/clips/";
  const sets = [
    ["01-hotel-gunplay.webp", "02-enemy-waves.webp", "03-baskerville-summon.webp", "04-blood-and-gore.webp"],
    ["05-corridor-firefight.webp", "06-magic-sigil.webp", "07-green-corridor.webp", "08-trial-results.webp"]
  ].map(names => names.map(name => base + name));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let visible = !("IntersectionObserver" in window);
  let current = 0;
  let switching = false;
  const loaded = [true, false];

  function preloadSet(index) {
    if (loaded[index]) return Promise.resolve(true);
    return Promise.all(sets[index].map(src => new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    }))).then(results => {
      loaded[index] = results.every(Boolean);
      return loaded[index];
    });
  }

  function switchChannel() {
    if (!visible || document.hidden || reduceMotion.matches || switching) return;
    const next = (current + 1) % sets.length;
    if (!loaded[next]) { preloadSet(next); return; }
    switching = true;
    root.classList.remove("is-switching");
    void root.offsetWidth;
    root.classList.add("is-switching");
    window.setTimeout(() => {
      tiles.forEach((tile, i) => {
        if (tile.getAttribute("src") !== sets[next][i]) tile.setAttribute("src", sets[next][i]);
      });
      current = next;
    }, 245);
    window.setTimeout(() => {
      root.classList.remove("is-switching");
      switching = false;
    }, 580);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible && !reduceMotion.matches) preloadSet(1);
    }, { threshold: .12 });
    observer.observe(root);
  } else {
    preloadSet(1);
  }
  window.setInterval(switchChannel, 6500);
})();
