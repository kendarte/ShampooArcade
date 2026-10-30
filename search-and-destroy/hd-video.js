/* S.A. TV — Assemble the unmodified stabilized Full HD MP4 from static parts.
   Files are split solely to publish the original through GitHub Pages; no resampling. */
(() => {
  "use strict";
  const video = document.getElementById("sd-hotel-video");
  const button = document.getElementById("sd-hotel-load");
  const overlay = document.getElementById("sd-hotel-overlay");
  const status = document.getElementById("sd-hotel-status");
  if (!video || !button || !overlay || !status) return;
  const COUNT = 27;
  const BYTES = 18823263;
  const PART_ROOT = "../videos/hd/hotel-";
  let started = false;
  let videoUrl = null;

  const spanish = () => document.documentElement.lang === "es";
  const update = (done, total) => {
    const percent = Math.round(done * 100 / total);
    status.textContent = spanish()
      ? "Cargando video original 1080p… " + percent + "% (" + done + "/" + total + ")"
      : "Loading original 1080p video… " + percent + "% (" + done + "/" + total + ")";
  };
  async function assemble() {
    const buffers = new Array(COUNT);
    let next = 0;
    let finished = 0;
    let bytes = 0;
    async function worker() {
      while (next < COUNT) {
        const index = next++;
        const name = String(index).padStart(3, "0");
        const response = await fetch(PART_ROOT + name + ".bin", { cache: "force-cache" });
        if (!response.ok) throw new Error("Missing video part " + name + ": HTTP " + response.status);
        const data = await response.arrayBuffer();
        buffers[index] = data;
        bytes += data.byteLength;
        update(++finished, COUNT);
      }
    }
    await Promise.all(Array.from({ length: 5 }, worker));
    if (bytes !== BYTES || buffers.some(item => !item)) throw new Error("Video integrity error");
    return URL.createObjectURL(new Blob(buffers, { type: "video/mp4" }));
  }

  button.addEventListener("click", async () => {
    if (started) return;
    started = true;
    button.disabled = true;
    update(0, COUNT);
    try {
      videoUrl = await assemble();
      video.src = videoUrl;
      video.preload = "auto";
      video.load();
      overlay.hidden = true;
      // Browser autoplay may be blocked after an async download; native controls remain visible.
      video.play().catch(() => {});
    } catch (error) {
      console.error("S.A.TV Full HD video:", error);
      started = false;
      button.disabled = false;
      status.textContent = spanish()
        ? "No se pudo cargar el Full HD. Probá nuevamente."
        : "Full HD could not load. Please try again.";
    }
  });
  window.addEventListener("pagehide", () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
  });
})();