import { loadServers, findBestServer, getCatalog, streamUrl, canDownload, getSeriesInfo } from './api.js';
import { storage } from './storage.js';
import { ui } from './ui.js';
import { router } from './router.js';
import { debounce, normId, sanitize } from './utils.js';
import { ModernPlayer } from './player.js';
import { socialModal } from './promotions.js';

const state = {
  servers: [],
  activeServer: null,
  tv: [],
  movies: [],
  series: [],
  history: storage.getHistory(),
  continueWatching: storage.getContinue(),
  favorites: new Set(storage.getFavorites()),
  search: ''
};

const player = new ModernPlayer((currentTime, duration) => {
  if (!state.currentItem) return;
  const id = normId(state.currentItem);
  const next = state.continueWatching.filter((x) => x._id !== id);
  next.unshift({ ...state.currentItem, _id: id, progress: Math.round(currentTime), duration: Math.round(duration || 0), timestamp: Date.now(), server: state.activeServer?.name });
  state.continueWatching = next.slice(0, 40);
  storage.setContinue(state.continueWatching);
}, () => ui.toast('Falha de streaming, fallback automático em andamento...'));

const allItems = () => [...state.movies, ...state.series, ...state.tv];

const clickCards = () => {
  document.querySelectorAll('.card').forEach((c) => {
    c.onclick = () => {
      const id = c.dataset.id;
      const item = allItems().find((x) => normId(x) === id) || state.history.find((x) => normId(x) === id) || state.continueWatching.find((x) => normId(x) === id);
      if (item) openDetails(item);
    };
  });
};

const addHistory = (item) => {
  const row = { ...item, timestamp: Date.now(), server: state.activeServer?.name };
  const filtered = state.history.filter((x) => normId(x) !== normId(item));
  filtered.unshift(row);
  state.history = filtered.slice(0, 120);
  storage.setHistory(state.history);
};

const openDetails = async (item) => {
  state.currentItem = item;
  const id = normId(item);
  const favorite = state.favorites.has(id);
  const kind = item.type || (item.stream_type === 'live' ? 'tv' : item.series_id ? 'series' : 'movies');
  const media = kind === 'series' ? '' : streamUrl(state.activeServer, item, kind === 'live' ? 'tv' : kind);
  const down = canDownload(item, kind) ? media : '';
  ui.openModal(`<div class="modal-bg"><article class="modal glass"><h3>${sanitize(item.name || item.title || 'Detalhes')}</h3>
  <p class="muted">${sanitize(kind)}</p>
  <div class="controls"><button class="btn" id="playBtn">Reproduzir</button><button class="btn" id="favToggleBtn">${favorite ? 'Remover favorito' : 'Favoritar'}</button><button class="btn" id="socialBtn">Redes sociais</button><button class="btn" data-close>Fechar</button></div>
  <div id="playerZone"></div></article></div>`);

  document.getElementById('socialBtn').onclick = () => ui.openModal(socialModal());
  document.getElementById('favToggleBtn').onclick = () => {
    if (state.favorites.has(id)) state.favorites.delete(id); else state.favorites.add(id);
    storage.setFavorites([...state.favorites]);
    ui.toast('Favoritos atualizados');
  };

  document.getElementById('playBtn').onclick = async () => {
    if (kind === 'series') {
      const info = await getSeriesInfo(state.activeServer, item.series_id);
      const season = Object.keys(info.episodes || {})[0];
      const ep = info.episodes?.[season]?.[0];
      if (!ep) return ui.toast('Sem episódios disponíveis');
      const epUrl = `${state.activeServer.serverUrl}/series/${state.activeServer.username}/${state.activeServer.password}/${ep.id}.${ep.container_extension || 'mp4'}`;
      player.mount(document.getElementById('playerZone'), epUrl, { downloadUrl: canDownload(ep, 'series') ? epUrl : '' });
    } else {
      player.mount(document.getElementById('playerZone'), media, { downloadUrl: down });
    }
    addHistory({ ...item, type: kind });
  };
};

const renderRoute = (route) => {
  ui.setNav(route);
  if (route === 'home') ui.renderHome({ ...state, featured: allItems().slice(0, 15) });
  if (route === 'movies') ui.renderGrid('Catálogo de Filmes', filtered(state.movies), 'movies');
  if (route === 'series') ui.renderGrid('Catálogo de Séries', filtered(state.series), 'series');
  if (route === 'tv') ui.renderGrid('Catálogo de TV', filtered(state.tv), 'tv');
  if (route === 'history') {
    ui.renderHistory(state.history);
    document.getElementById('clearHistoryBtn')?.addEventListener('click', () => {
      storage.clearHistory();
      state.history = [];
      renderRoute('history');
    });
  }
  clickCards();
};

const filtered = (arr) => {
  const q = state.search.trim().toLowerCase();
  return q ? arr.filter((x) => `${x.name || x.title || ''}`.toLowerCase().includes(q)) : arr;
};

const loadCatalogs = async () => {
  state.tv = (await getCatalog(state.activeServer, 'tv')).map((x) => ({ ...x, type: 'tv' }));
  state.movies = (await getCatalog(state.activeServer, 'movies')).map((x) => ({ ...x, type: 'movies' }));
  state.series = (await getCatalog(state.activeServer, 'series')).map((x) => ({ ...x, type: 'series' }));
};

const pickServer = async () => {
  state.servers = await loadServers();
  if (!state.servers.length) throw new Error('Lista de servidores indisponível');

  const last = storage.getLastServer();
  if (last) {
    const found = state.servers.find((s) => s.id === last);
    if (found) state.activeServer = found;
  }

  const ranking = await findBestServer(state.servers);
  state.activeServer = state.activeServer || ranking[0];
  if (!state.activeServer?.ok && ranking.find((s) => s.ok)) state.activeServer = ranking.find((s) => s.ok);
  storage.setLastServer(state.activeServer.id);
  ui.setServerName(state.activeServer.name);
};

const openSettings = async () => {
  ui.openModal(`<div class="modal-bg"><section class="modal glass"><h3>Configurações</h3>
    <p class="muted">Último servidor usado: ${sanitize(storage.getLastServer() || '--')}</p>
    <label>Trocar servidor</label><select id="serverSelect" class="input">${state.servers.map((s) => `<option value="${s.id}" ${s.id === state.activeServer.id ? 'selected' : ''}>${s.name}</option>`).join('')}</select>
    <div class="controls"><button class="btn" id="applyServerBtn">Aplicar</button><button class="btn" id="retestBtn">Retestar melhor servidor</button><button class="btn" data-close>Fechar</button></div></section></div>`);

  document.getElementById('applyServerBtn').onclick = async () => {
    const id = document.getElementById('serverSelect').value;
    state.activeServer = state.servers.find((s) => s.id === id) || state.activeServer;
    storage.setLastServer(state.activeServer.id);
    ui.setServerName(state.activeServer.name);
    await loadCatalogs();
    renderRoute(router.current);
    ui.toast('Servidor alterado');
  };

  document.getElementById('retestBtn').onclick = async () => {
    const ranking = await findBestServer(state.servers);
    state.activeServer = ranking.find((s) => s.ok) || ranking[0];
    storage.setLastServer(state.activeServer.id);
    ui.setServerName(state.activeServer.name);
    await loadCatalogs();
    renderRoute(router.current);
    ui.toast('Melhor servidor atualizado');
  };
};

const bindGlobal = () => {
  document.querySelectorAll('.nav-item').forEach((b) => b.addEventListener('click', () => router.go(b.dataset.route)));
  document.getElementById('openSettingsBtn').onclick = () => openSettings();
  document.getElementById('openSearchBtn').onclick = () => {
    ui.openModal(`<div class="modal-bg"><div class="modal glass"><h3>Busca global</h3><input id="globalSearchInput" class="input" placeholder="Filmes, séries e canais" /><div id="searchResults"></div><button class="btn" data-close>Fechar</button></div></div>`);
    const input = document.getElementById('globalSearchInput');
    input.focus();
    input.oninput = debounce((e) => {
      state.search = e.target.value;
      const m = filtered(state.movies).slice(0, 8);
      const s = filtered(state.series).slice(0, 8);
      const t = filtered(state.tv).slice(0, 8);
      document.getElementById('searchResults').innerHTML = `<p class='muted'>Filmes (${m.length})</p>${m.map((x) => `<p>${sanitize(x.name || x.title)}</p>`).join('')}<p class='muted'>Séries (${s.length})</p>${s.map((x) => `<p>${sanitize(x.name || x.title)}</p>`).join('')}<p class='muted'>TV (${t.length})</p>${t.map((x) => `<p>${sanitize(x.name || x.title)}</p>`).join('')}`;
      renderRoute(router.current);
    }, 260);
  };
};

const init = async () => {
  try {
    ui.loading(true);
    bindGlobal();
    await pickServer();
    await loadCatalogs();
    router.init(renderRoute);
    ui.toast('Aplicação pronta');
  } catch (e) {
    ui.toast(`Erro: ${e.message}. Verifique API remota.`);
    document.getElementById('view').innerHTML = `<section class='glass' style='margin:8px;padding:12px;border-radius:14px'><h2>Erro ao iniciar</h2><p class='muted'>A API remota está indisponível. O app não quebrou e você pode retestar em Configurações.</p></section>`;
  } finally {
    ui.loading(false);
  }
};

init();
