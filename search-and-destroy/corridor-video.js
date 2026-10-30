/* S.A. TV — Original 1080p corridor gameplay, exact MP4 assembled from static chunks. */
(() => {
  "use strict";
  const video = document.getElementById("sd-corridor-video");
  const button = document.getElementById("sd-corridor-load");
  const overlay = document.getElementById("sd-corridor-overlay");
  const status = document.getElementById("sd-corridor-status");
  if (!video || !button || !overlay || !status) return;
  const PARTS = 20, SIZE = 14346535, ROOT = "../videos/hd/corridor-";
  let started = false;
  let blobUrl = null;
  const isEs = () => document.documentElement.lang === "es";
  const progress = (done) => {
    status.textContent = (isEs() ? "Cargando Full HD original… " : "Loading original Full HD… ")
      + Math.round(done / PARTS * 100) + "% (" + done + "/" + PARTS + ")";
  };
  async function loadOriginal() {
    const chunks = Array(PARTS);
    let next = 0, complete = 0, bytes = 0;
    async function fetcher() {
      while (next < PARTS) {
        const i = next++;
        const name = String(i).padStart(3, "0");
        const response = await fetch(ROOT + name + ".bin", { cache: "force-cache" });
        if (!response.ok) throw new Error("HTTP " + response.status + " (" + name + ")");
        const buffer = await response.arrayBuffer();
        chunks[i] = buffer;
        bytes += buffer.byteLength;
        progress(++complete);
      }
    }
    await Promise.all(Array.from({ length: 5 }, fetcher));
    if (bytes !== SIZE || chunks.some(x => !x)) throw new Error("Incomplete original footage");
    return URL.createObjectURL(new Blob(chunks, { type: "video/mp4" }));
  }
  button.addEventListener("click", async () => {
    if (started) return;
    started = true;
    button.disabled = true;
    progress(0);
    try {
      blobUrl = await loadOriginal();
      video.src = blobUrl;
      video.preload = "auto";
      video.load();
      overlay.hidden = true;
      video.play().catch(() => {});
    } catch (e) {
      console.error("S.A. TV corridor HD:", e);
      started = false;
      button.disabled = false;
      status.textContent = isEs() ? "Error de carga; intentá otra vez." : "Loading failed; try again.";
    }
  });
  window.addEventListener("pagehide", () => { if (blobUrl) URL.revokeObjectURL(blobUrl); });
})();