(() => {
  const CFG = {
    SERVER_API: 'https://snippet.host/aifzzq/raw',
    PROMO_LINK: 'https://omg10.com/4/8725938',
    PROMO_ENABLED: true,
    SOCIAL: [
      { name: 'Telegram', url: 'https://t.me/' },
      { name: 'Instagram', url: 'https://instagram.com/' }
    ],
    CACHE_MIN: 10
  };

  const state = {
    route: 'home',
    servers: [],
    activeServer: null,
    catalogs: { movies: [], series: [], tv: [] },
    categories: { movies: [], series: [], tv: [] },
    favorites: new Set(read('hf_favorites', [])),
    history: read('hf_history', []),
    continue: read('hf_continue', []),
    search: '',
    hls: null,
    currentItem: null
  };

  const $ = (s) => document.querySelector(s);
  const esc = (x = '') => String(x).replace(/[<>&"']/g, (m) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[m]));
  const idOf = (item) => String(item.stream_id || item.series_id || item.id || `${item.name || item.title}-${item.type || ''}`).toLowerCase().replace(/\s+/g, '-');

  function read(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }
  function save(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

  function toast(msg) {
    const div = document.createElement('div');
    div.className = 'toast';
    div.textContent = msg;
    $('#toastRoot').appendChild(div);
    setTimeout(() => div.remove(), 2800);
  }

  function splash(on, text = 'Carregando...') {
    $('#splashText').textContent = text;
    $('#splash').classList.toggle('on', on);
  }

  async function fetchJson(url, timeout = 7000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  function adaptServers(raw) {
    const arr = Array.isArray(raw) ? raw : raw?.servers || raw?.data || [];
    return arr.map((s, i) => ({
      id: `srv-${i + 1}`,
      name: `Servidor ${i + 1}`,
      url: s.serverUrl || s.url || s.host || s.server || s.base_url,
      username: s.username || s.user || '',
      password: s.password || s.pass || ''
    })).filter((s) => s.url);
  }

  async function loadServers() {
    try {
      const raw = await fetchJson(CFG.SERVER_API);
      return adaptServers(raw);
    } catch {
      return [];
    }
  }

  async function testServer(server) {
    const start = performance.now();
    try {
      const url = `${server.url}/player_api.php?username=${encodeURIComponent(server.username)}&password=${encodeURIComponent(server.password)}&action=get_live_streams`;
      const data = await fetchJson(url, 4200);
      const ms = Math.round(performance.now() - start);
      return { ...server, ok: Array.isArray(data), latency: ms, score: ms + (Array.isArray(data) ? 0 : 9000) };
    } catch {
      return { ...server, ok: false, latency: 99999, score: 99999 };
    }
  }

  async function chooseServer() {
    splash(true, 'Selecionando melhor servidor...');
    state.servers = await loadServers();
    if (!state.servers.length) throw new Error('API de servidores indisponível');

    const last = read('hf_last_server', null);
    const tested = await Promise.all(state.servers.map(testServer));
    tested.sort((a, b) => a.score - b.score);

    state.activeServer = tested.find((s) => s.id === last && s.ok) || tested.find((s) => s.ok) || tested[0];
    save('hf_last_server', state.activeServer.id);
    $('#serverLabel').textContent = `Servidor: ${state.activeServer.name}`;
  }

  function cacheKey(type, cat = 'all') { return `hf_cache_${state.activeServer.id}_${type}_${cat}`; }
  function getCache(type, cat = 'all') {
    const c = read(cacheKey(type, cat), null);
    if (!c || !c.ts) return null;
    return (Date.now() - c.ts) / 60000 <= CFG.CACHE_MIN ? c.data : null;
  }

  async function getCatalog(type, category = 'all') {
    const cached = getCache(type, category);
    if (cached) return cached;
    const actions = { tv: 'get_live_streams', movies: 'get_vod_streams', series: 'get_series' };
    const p = new URLSearchParams({ username: state.activeServer.username, password: state.activeServer.password, action: actions[type] });
    if (category !== 'all') p.set('category_id', category);
    const data = await fetchJson(`${state.activeServer.url}/player_api.php?${p.toString()}`);
    const arr = Array.isArray(data) ? data : [];
    save(cacheKey(type, category), { ts: Date.now(), data: arr });
    return arr;
  }

  async function getCategories(type) {
    const actions = { tv: 'get_live_categories', movies: 'get_vod_categories', series: 'get_series_categories' };
    const p = new URLSearchParams({ username: state.activeServer.username, password: state.activeServer.password, action: actions[type] });
    try {
      const data = await fetchJson(`${state.activeServer.url}/player_api.php?${p.toString()}`);
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  }

  async function loadData() {
    splash(true, 'Carregando catálogos...');
    const [tv, movies, series] = await Promise.all([getCatalog('tv'), getCatalog('movies'), getCatalog('series')]);
    state.catalogs.tv = tv.map((x) => ({ ...x, type: 'tv' }));
    state.catalogs.movies = movies.map((x) => ({ ...x, type: 'movies' }));
    state.catalogs.series = series.map((x) => ({ ...x, type: 'series' }));
    state.categories.tv = await getCategories('tv');
    state.categories.movies = await getCategories('movies');
    state.categories.series = await getCategories('series');
  }

  function card(item) {
    const div = document.createElement('article');
    div.className = 'card';
    div.tabIndex = 0;
    div.dataset.id = idOf(item);
    div.innerHTML = `<img loading="lazy" src="${esc(item.stream_icon || item.cover || 'https://placehold.co/300x450/100a2b/fff?text=HamsterFlix')}" alt="${esc(item.name || item.title || 'capa')}" />
      <div class="meta"><h3>${esc(item.name || item.title || 'Sem título')}</h3><p>${esc(item.category_name || item.genre || 'Categoria')}</p><div class="badges"><span class="badge">${esc(item.type || 'conteúdo')}</span></div></div>`;
    div.onclick = () => openDetails(item);
    div.onkeydown = (e) => { if (e.key === 'Enter') openDetails(item); };
    return div;
  }

  function section(title, items) {
    const wrap = document.createElement('section');
    wrap.className = 'section';
    const head = document.createElement('div'); head.className = 'section-head'; head.innerHTML = `<h2>${esc(title)}</h2>`;
    const row = document.createElement('div'); row.className = 'row';
    if (!items.length) row.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
    else items.forEach((i) => row.appendChild(card(i)));
    wrap.append(head, row);
    return wrap;
  }

  function promo() {
    if (!CFG.PROMO_ENABLED) return document.createElement('div');
    const el = document.createElement('section');
    el.className = 'promo glass';
    el.innerHTML = `<div><strong>Patrocinado</strong><p>Parceria transparente</p></div><a class="btn" href="${esc(CFG.PROMO_LINK)}" target="_blank" rel="noopener">Abrir</a>`;
    return el;
  }

  function filtered(arr) {
    if (!state.search.trim()) return arr;
    const q = state.search.toLowerCase();
    return arr.filter((x) => `${x.name || x.title || ''}`.toLowerCase().includes(q));
  }

  function renderHome() {
    const view = $('#view'); view.innerHTML = '';
    view.append(
      section('Destaques', [...state.catalogs.movies, ...state.catalogs.series, ...state.catalogs.tv].slice(0, 20)),
      promo(),
      section('Filmes por categoria', state.catalogs.movies.slice(0, 20)),
      section('Séries por categoria', state.catalogs.series.slice(0, 20)),
      section('Canais ao vivo em destaque', state.catalogs.tv.slice(0, 20)),
      section('Continuar assistindo', state.continue),
      section('Histórico recente', state.history.slice(0, 20))
    );
  }

  function renderGridPage(type, title) {
    const view = $('#view'); view.innerHTML = '';
    const head = document.createElement('div'); head.className = 'section-head';
    const cats = state.categories[type] || [];
    head.innerHTML = `<h2>${title}</h2><button class="btn" id="favPageBtn">Favoritos</button>`;
    const controls = document.createElement('div'); controls.className = 'section'; controls.style.padding = '0 6px';
    controls.innerHTML = `<div class="controls"><select id="catSel"><option value="all">Todas categorias</option>${cats.map((c) => `<option value="${esc(c.category_id)}">${esc(c.category_name)}</option>`).join('')}</select><select id="ordSel"><option value="az">A-Z</option><option value="za">Z-A</option></select></div>`;
    const grid = document.createElement('div'); grid.className = 'grid';
    const render = async () => {
      let items = state.catalogs[type];
      const cat = $('#catSel')?.value || 'all';
      if (cat !== 'all') items = await getCatalog(type, cat);
      items = filtered(items).slice();
      if (($('#ordSel')?.value || 'az') === 'az') items.sort((a, b) => `${a.name || a.title}`.localeCompare(`${b.name || b.title}`));
      else items.sort((a, b) => `${b.name || b.title}`.localeCompare(`${a.name || a.title}`));
      grid.innerHTML = '';
      if (!items.length) grid.innerHTML = '<p class="empty">Sem resultados.</p>';
      else items.forEach((i) => grid.appendChild(card({ ...i, type })));
    };
    view.append(head, controls, grid);
    setTimeout(() => {
      $('#catSel').onchange = render;
      $('#ordSel').onchange = render;
      $('#favPageBtn').onclick = () => renderFavorites();
      render();
    }, 0);
  }

  function renderHistory() {
    const view = $('#view'); view.innerHTML = '';
    const head = document.createElement('div'); head.className = 'section-head';
    head.innerHTML = `<h2>Histórico</h2><button class="btn" id="clearHist">Limpar</button>`;
    const grid = document.createElement('div'); grid.className = 'grid';
    (state.history.length ? state.history : []).forEach((i) => grid.appendChild(card(i)));
    if (!state.history.length) grid.innerHTML = '<p class="empty">Histórico vazio.</p>';
    view.append(head, grid);
    $('#clearHist').onclick = () => {
      state.history = []; save('hf_history', []); renderHistory(); toast('Histórico limpo');
    };
  }

  function renderFavorites() {
    const view = $('#view'); view.innerHTML = '<div class="section-head"><h2>Favoritos</h2></div>';
    const grid = document.createElement('div'); grid.className = 'grid';
    const map = new Map([...state.catalogs.movies, ...state.catalogs.series, ...state.catalogs.tv].map((x) => [idOf(x), x]));
    [...state.favorites].forEach((id) => { if (map.get(id)) grid.appendChild(card(map.get(id))); });
    if (!grid.children.length) grid.innerHTML = '<p class="empty">Nenhum favorito.</p>';
    view.append(grid);
  }

  async function openDetails(item) {
    state.currentItem = item;
    const id = idOf(item);
    const kind = item.type || (item.series_id ? 'series' : item.stream_type === 'live' ? 'tv' : 'movies');
    const fav = state.favorites.has(id);

    $('#modalRoot').innerHTML = `<div class="modal-bg"><div class="modal glass"><h2>${esc(item.name || item.title || 'Detalhes')}</h2><p>${esc(kind)}</p>
      <div class="controls"><button class="btn" id="playBtn">Reproduzir</button><button class="btn" id="favBtn">${fav ? 'Desfavoritar' : 'Favoritar'}</button><button class="btn" id="socialBtn">Redes sociais</button><button class="btn" id="closeBtn">Fechar</button></div><div id="playerWrap"></div></div></div>`;

    $('#closeBtn').onclick = () => $('#modalRoot').innerHTML = '';
    $('#socialBtn').onclick = openSocial;
    $('#favBtn').onclick = () => {
      if (state.favorites.has(id)) state.favorites.delete(id); else state.favorites.add(id);
      save('hf_favorites', [...state.favorites]);
      toast('Favoritos atualizados');
      $('#favBtn').textContent = state.favorites.has(id) ? 'Desfavoritar' : 'Favoritar';
    };

    $('#playBtn').onclick = async () => {
      try {
        const media = await resolveMedia(item, kind);
        mountPlayer(media.url, media.download);
        trackHistory({ ...item, type: kind });
      } catch {
        toast('Erro ao abrir mídia. Tentando fallback de servidor...');
        await fallbackServer();
      }
    };
  }

  async function resolveMedia(item, kind) {
    if (kind === 'tv') return { url: `${state.activeServer.url}/live/${state.activeServer.username}/${state.activeServer.password}/${item.stream_id}.m3u8`, download: '' };
    if (kind === 'movies') {
      const ext = item.container_extension || 'mp4';
      const url = `${state.activeServer.url}/movie/${state.activeServer.username}/${state.activeServer.password}/${item.stream_id}.${ext}`;
      return { url, download: /mp4|mkv|mov/i.test(ext) ? url : '' };
    }
    const p = new URLSearchParams({ username: state.activeServer.username, password: state.activeServer.password, action: 'get_series_info', series_id: item.series_id });
    const info = await fetchJson(`${state.activeServer.url}/player_api.php?${p.toString()}`);
    const season = Object.keys(info.episodes || {})[0];
    const ep = info.episodes?.[season]?.[0];
    if (!ep) throw new Error('Sem episódios');
    const ext = ep.container_extension || 'mp4';
    const url = `${state.activeServer.url}/series/${state.activeServer.username}/${state.activeServer.password}/${ep.id}.${ext}`;
    return { url, download: /mp4|mkv|mov/i.test(ext) ? url : '' };
  }

  function mountPlayer(url, downloadUrl) {
    const root = $('#playerWrap');
    root.innerHTML = `<section class="player"><video id="video" controls playsinline></video><div class="overlay" id="ov">Carregando...</div></section><div class="controls"><button class="btn" id="pip">PiP</button><button class="btn" id="full">Fullscreen</button>${downloadUrl ? `<a class="btn" href="${esc(downloadUrl)}" download>Download</a>` : ''}<label>Volume <input id="vol" type="range" min="0" max="1" step="0.1" value="1"/></label></div>`;
    const v = $('#video');
    $('#vol').oninput = (e) => v.volume = Number(e.target.value);
    $('#pip').onclick = () => document.pictureInPictureEnabled && v.requestPictureInPicture?.();
    $('#full').onclick = () => root.querySelector('.player').requestFullscreen?.();

    const onFatal = async () => {
      $('#ov').textContent = 'Erro no stream, tentando novamente...';
      setTimeout(() => mountPlayer(url, downloadUrl), 1400);
    };

    v.onwaiting = () => $('#ov').style.display = 'flex';
    v.onplaying = () => $('#ov').style.display = 'none';
    v.ontimeupdate = () => trackContinue(v.currentTime, v.duration);

    if (state.hls) { state.hls.destroy(); state.hls = null; }
    if (url.includes('.m3u8') && window.Hls?.isSupported()) {
      state.hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      state.hls.loadSource(url);
      state.hls.attachMedia(v);
      state.hls.on(Hls.Events.MANIFEST_PARSED, () => v.play().catch(() => {}));
      state.hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal) onFatal(); });
    } else {
      v.src = url; v.play().catch(() => {}); v.onerror = onFatal;
    }
  }

  function trackHistory(item) {
    const row = { ...item, server: state.activeServer.name, timestamp: Date.now() };
    state.history = [row, ...state.history.filter((x) => idOf(x) !== idOf(row))].slice(0, 150);
    save('hf_history', state.history);
  }

  function trackContinue(currentTime, duration) {
    if (!state.currentItem) return;
    const row = { ...state.currentItem, progress: Math.round(currentTime || 0), duration: Math.round(duration || 0), server: state.activeServer.name, timestamp: Date.now() };
    state.continue = [row, ...state.continue.filter((x) => idOf(x) !== idOf(row))].slice(0, 80);
    save('hf_continue', state.continue);
  }

  async function fallbackServer() {
    const tested = await Promise.all(state.servers.map(testServer));
    tested.sort((a, b) => a.score - b.score);
    const next = tested.find((s) => s.ok && s.id !== state.activeServer.id);
    if (!next) return toast('Nenhum servidor alternativo disponível');
    state.activeServer = next;
    save('hf_last_server', next.id);
    $('#serverLabel').textContent = `Servidor: ${next.name}`;
    await loadData();
    render();
    toast(`Fallback para ${next.name}`);
  }

  function openSocial() {
    $('#modalRoot').innerHTML = `<div class="modal-bg"><div class="modal glass"><h2>Redes sociais</h2>${CFG.SOCIAL.map((s) => `<p><a class="btn" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a></p>`).join('')}<button class="btn" id="closeSocial">Fechar</button></div></div>`;
    $('#closeSocial').onclick = () => $('#modalRoot').innerHTML = '';
  }

  function openSettings() {
    $('#modalRoot').innerHTML = `<div class="modal-bg"><div class="modal glass"><h2>Configurações</h2>
      <label>Trocar servidor</label><select id="serverSelect">${state.servers.map((s) => `<option value="${s.id}" ${s.id === state.activeServer.id ? 'selected' : ''}>${s.name}</option>`).join('')}</select>
      <div class="controls"><button class="btn" id="applySrv">Aplicar</button><button class="btn" id="retestSrv">Retestar melhor servidor</button><button class="btn" id="closeSettings">Fechar</button></div></div></div>`;

    $('#closeSettings').onclick = () => $('#modalRoot').innerHTML = '';
    $('#applySrv').onclick = async () => {
      const id = $('#serverSelect').value;
      state.activeServer = state.servers.find((s) => s.id === id) || state.activeServer;
      save('hf_last_server', state.activeServer.id);
      $('#serverLabel').textContent = `Servidor: ${state.activeServer.name}`;
      await loadData(); render(); toast('Servidor alterado');
    };
    $('#retestSrv').onclick = async () => {
      splash(true, 'Retestando servidores...');
      await chooseServer(); await loadData(); render(); splash(false); toast('Melhor servidor atualizado');
    };
  }

  function openSearch() {
    $('#modalRoot').innerHTML = `<div class="modal-bg"><div class="modal glass"><h2>Busca global</h2><input id="globalSearch" placeholder="Buscar em filmes, séries e canais" />
    <div id="searchRes" class="section"></div><button class="btn" id="closeSearch">Fechar</button></div></div>`;
    $('#closeSearch').onclick = () => $('#modalRoot').innerHTML = '';

    const renderRes = (query) => {
      const q = query.trim().toLowerCase();
      const m = state.catalogs.movies.filter((x) => `${x.name || x.title || ''}`.toLowerCase().includes(q)).slice(0, 12);
      const s = state.catalogs.series.filter((x) => `${x.name || x.title || ''}`.toLowerCase().includes(q)).slice(0, 12);
      const t = state.catalogs.tv.filter((x) => `${x.name || x.title || ''}`.toLowerCase().includes(q)).slice(0, 12);
      $('#searchRes').innerHTML = `<div class="section-head"><h3>Filmes (${m.length})</h3></div><div class="row">${m.map((x) => `<p>${esc(x.name || x.title)}</p>`).join('')}</div><div class="section-head"><h3>Séries (${s.length})</h3></div><div class="row">${s.map((x) => `<p>${esc(x.name || x.title)}</p>`).join('')}</div><div class="section-head"><h3>TV (${t.length})</h3></div><div class="row">${t.map((x) => `<p>${esc(x.name || x.title)}</p>`).join('')}</div>`;
      state.search = query;
      render();
    };

    let timer;
    $('#globalSearch').oninput = (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => renderRes(e.target.value), 280);
    };
  }

  function setRoute(route) {
    state.route = route;
    document.querySelectorAll('.nav').forEach((b) => b.classList.toggle('active', b.dataset.route === route));
    render();
  }

  function render() {
    if (state.route === 'home') renderHome();
    if (state.route === 'movies') renderGridPage('movies', 'Catálogo de Filmes');
    if (state.route === 'series') renderGridPage('series', 'Catálogo de Séries');
    if (state.route === 'tv') renderGridPage('tv', 'Catálogo de TV ao vivo');
    if (state.route === 'history') renderHistory();
  }

  async function init() {
    try {
      splash(true, 'Inicializando app...');
      await chooseServer();
      await loadData();
      render();
      toast('Pronto para usar');
    } catch (e) {
      $('#view').innerHTML = `<section class="section glass" style="padding:12px;border-radius:14px"><h2>Erro de inicialização</h2><p class="empty">${esc(e.message)}. O app continua estável. Use Configurações para retestar mais tarde.</p></section>`;
      toast('Falha na API remota');
    } finally {
      splash(false);
    }
  }

  document.querySelectorAll('.nav').forEach((b) => b.onclick = () => setRoute(b.dataset.route));
  $('#settingsBtn').onclick = openSettings;
  $('#searchBtn').onclick = openSearch;
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $('#modalRoot').innerHTML = ''; });

  init();
})();
