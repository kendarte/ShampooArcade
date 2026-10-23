/* S.A. TV — channel ident / progressive effects, no dependencies or network requests. */
(() => {
  "use strict";
  const root = document.querySelector("#satv-ident");
  if (!root) return;
  const panels = [
    {
      line1: "TAEK-WON-COP", line2: "TURBO", channel: "01 / ACTION",
      en: "Retrofuturist action, tactical combat and anime spectacle.",
      es: "Acción retrofuturista, combate táctico y espectáculo estilo anime.",
      href: "https://kendarte.github.io/projects/taek-won-cop/"
    },
    {
      line1: "HORSE", line2: "RACER", channel: "02 / SPORTS",
      en: "Horse racing, arcade energy and cinematic simulation.",
      es: "Carreras de caballos, energía arcade y simulación cinematográfica.",
      href: "https://shampooarcade.itch.io/horse-racer"
    },
    {
      line1: "VR ARCADE", line2: "LAB", channel: "03 / EXPERIMENT",
      en: "VR prototypes and experiments. Playtests are not yet available.",
      es: "Prototipos y experimentos VR. Las pruebas todavía no están disponibles.",
      href: "#laboratorio"
    }
  ];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const copy = root.querySelector(".satv-ident-copy");
  const line1 = root.querySelector("[data-satv-line1]");
  const line2 = root.querySelector("[data-satv-line2]");
  const dek = root.querySelector("[data-satv-dek]");
  const channel = root.querySelector("[data-satv-channel]");
  const jump = root.querySelector("[data-satv-link]");
  const buttons = [...root.querySelectorAll("[data-satv-select]")];
  const toggle = root.querySelector("#satv-motion-toggle");
  let index = 0, paused = reduced.matches, timer = null;

  function render(next) {
    index = (next + panels.length) % panels.length;
    const selected = panels[index];
    line1.textContent = selected.line1;
    line2.textContent = selected.line2;
    dek.textContent = selected[document.documentElement.lang === "es" ? "es" : "en"];
    channel.textContent = "CH. " + selected.channel;
    jump.href = selected.href;
    if (selected.href.startsWith("https://")) {
      jump.target = "_blank"; jump.rel = "noopener";
    } else {
      jump.removeAttribute("target"); jump.removeAttribute("rel");
    }
    buttons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    copy.classList.remove("satv-channel-shift");
    void copy.offsetWidth;
    if (!reduced.matches && !paused) copy.classList.add("satv-channel-shift");
  }

  function syncPause() {
    document.body.classList.toggle("satv-motion-paused", paused);
    toggle.textContent = paused ? "▶ PLAY MOTION" : "Ⅱ PAUSE MOTION";
    toggle.setAttribute("aria-pressed", String(paused));
    if (timer) window.clearInterval(timer);
    timer = (!paused && !document.hidden) ? window.setInterval(() => render(index + 1), 6500) : null;
  }
  buttons.forEach((button, i) => button.addEventListener("click", () => {
    render(i);
    syncPause();
  }));
  toggle.addEventListener("click", () => {
    paused = !paused;
    syncPause();
  });
  document.addEventListener("visibilitychange", syncPause);
  reduced.addEventListener("change", e => {
    paused = e.matches;
    syncPause();
  });
  document.getElementById("lang")?.addEventListener("click", () => {
    window.requestAnimationFrame(() => render(index));
  });

  const staggerNodes = document.querySelectorAll(".broadcast-card,.lab-card,.transmission-card");
  if (!reduced.matches && "IntersectionObserver" in window) {
    document.body.classList.add("motion-ready");
    const ob = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("motion-in");
          ob.unobserve(entry.target);
        }
      });
    }, {rootMargin: "0px 0px 24px 0px", threshold: 0.08});
    staggerNodes.forEach((el, i) => {
      el.style.setProperty("--motion-delay", Math.min((i % 3) * 95, 190) + "ms");
      ob.observe(el);
    });
  }
  for (const screen of document.querySelectorAll(".broadcast-screen")) {
    const sweep = document.createElement("span");
    sweep.className = "satv-screen-sweep";
    sweep.setAttribute("aria-hidden", "true");
    screen.append(sweep);
  }
  for (const [i, bar] of [...root.querySelectorAll(".satv-ident-meter i")].entries()) {
    bar.style.setProperty("--bar", [52,78,42,93,56,82,65,47,89,69,33,74][i % 12] + "%");
    bar.style.setProperty("--speed", (0.72 + (i * 7 % 13) / 14).toFixed(2) + "s");
  }
  render(0);
  syncPause();
})();