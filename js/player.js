export class ModernPlayer {
  constructor(onProgress, onError) {
    this.hls = null;
    this.onProgress = onProgress;
    this.onError = onError;
  }

  destroy() {
    if (this.hls) this.hls.destroy();
    this.hls = null;
  }

  mount(container, media, opts = {}) {
    container.innerHTML = '';
    const wrap = document.createElement('section');
    wrap.className = 'player-wrap';
    wrap.innerHTML = `<video id="videoEl" playsinline controls></video><div class="player-overlay" id="loadingOverlay">Carregando...</div>`;
    const controls = document.createElement('div');
    controls.className = 'controls';
    controls.innerHTML = `
      <button class="btn" id="pipBtn">PiP</button>
      <button class="btn" id="fullscreenBtn">Fullscreen</button>
      ${opts.downloadUrl ? '<a class="btn" id="downloadBtn" download>Download</a>' : ''}
      <label class="muted">Volume <input id="volRange" type="range" min="0" max="1" step="0.1" value="1" /></label>`;
    container.append(wrap, controls);
    const video = wrap.querySelector('#videoEl');
    const overlay = wrap.querySelector('#loadingOverlay');

    if (opts.downloadUrl) controls.querySelector('#downloadBtn').href = opts.downloadUrl;
    controls.querySelector('#fullscreenBtn').onclick = () => wrap.requestFullscreen?.();
    controls.querySelector('#pipBtn').onclick = () => document.pictureInPictureEnabled && video.requestPictureInPicture?.();
    controls.querySelector('#volRange').oninput = (e) => { video.volume = Number(e.target.value); };

    video.addEventListener('waiting', () => (overlay.style.display = 'flex'));
    video.addEventListener('playing', () => (overlay.style.display = 'none'));
    video.addEventListener('timeupdate', () => this.onProgress?.(video.currentTime, video.duration));

    const retry = () => setTimeout(() => this.mount(container, media, opts), 1400);

    if (media.includes('.m3u8') && window.Hls?.isSupported()) {
      this.hls = new Hls({ enableWorker: true });
      this.hls.loadSource(media);
      this.hls.attachMedia(video);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
      this.hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          overlay.textContent = 'Falha no player. Tentando novamente...';
          this.onError?.();
          retry();
        }
      });
    } else {
      video.src = media;
      video.play().catch(() => {});
      video.onerror = () => {
        overlay.textContent = 'Erro ao reproduzir. Tentando novamente...';
        this.onError?.();
        retry();
      };
    }
  }
}
