import { CONFIG } from './config.js';
import { storage } from './storage.js';

const safeFetch = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const pick = (obj, keys, fallback = '') => keys.map((k) => obj?.[k]).find(Boolean) || fallback;

export const adaptServers = (raw) => {
  const arr = Array.isArray(raw) ? raw : raw?.servers || raw?.data || [];
  return arr.map((s, i) => ({
    id: `srv-${i + 1}`,
    name: `Servidor ${i + 1}`,
    serverUrl: pick(s, ['serverUrl', 'url', 'host', 'server', 'base_url']),
    username: pick(s, ['username', 'user']),
    password: pick(s, ['password', 'pass'])
  })).filter((s) => s.serverUrl);
};

export const loadServers = async () => {
  try {
    const raw = await safeFetch(CONFIG.serverListApi);
    return adaptServers(raw);
  } catch {
    return [];
  }
};

const pingServer = async (server) => {
  const started = performance.now();
  try {
    const url = `${server.serverUrl}/player_api.php?username=${encodeURIComponent(server.username)}&password=${encodeURIComponent(server.password)}&action=get_live_streams`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4200);
    const data = await safeFetch(url, { signal: controller.signal });
    clearTimeout(timer);
    const elapsed = Math.round(performance.now() - started);
    return { ...server, latency: elapsed, score: elapsed + (Array.isArray(data) ? 0 : 10000), ok: Array.isArray(data) };
  } catch {
    return { ...server, latency: 99999, score: 99999, ok: false };
  }
};

export const findBestServer = async (servers) => {
  const tested = await Promise.all(servers.map(pingServer));
  return tested.sort((a, b) => a.score - b.score);
};

const cacheGet = (key, maxMinutes) => {
  const c = storage.getCache(key);
  if (!c?.ts) return null;
  if ((Date.now() - c.ts) / 60000 > maxMinutes) return null;
  return c.data;
};

export const getCatalog = async (server, type, category = 'all') => {
  const ck = `${server.id}_${type}_${category}`;
  const cached = cacheGet(ck, CONFIG.cacheMinutes);
  if (cached) return cached;

  const actionMap = { tv: 'get_live_streams', movies: 'get_vod_streams', series: 'get_series' };
  const params = new URLSearchParams({ username: server.username, password: server.password, action: actionMap[type] });
  if (category !== 'all') params.set('category_id', category);
  const url = `${server.serverUrl}/player_api.php?${params.toString()}`;
  const data = await safeFetch(url);
  const out = Array.isArray(data) ? data : [];
  storage.setCache(ck, { ts: Date.now(), data: out });
  return out;
};

export const getCategories = async (server, type) => {
  const actionMap = { tv: 'get_live_categories', movies: 'get_vod_categories', series: 'get_series_categories' };
  const params = new URLSearchParams({ username: server.username, password: server.password, action: actionMap[type] });
  const url = `${server.serverUrl}/player_api.php?${params.toString()}`;
  const data = await safeFetch(url);
  return Array.isArray(data) ? data : [];
};

export const getSeriesInfo = async (server, seriesId) => {
  const params = new URLSearchParams({ username: server.username, password: server.password, action: 'get_series_info', series_id: seriesId });
  return safeFetch(`${server.serverUrl}/player_api.php?${params.toString()}`);
};

export const streamUrl = (server, item, type) => {
  if (type === 'tv') return `${server.serverUrl}/live/${server.username}/${server.password}/${item.stream_id}.m3u8`;
  if (type === 'movies') return `${server.serverUrl}/movie/${server.username}/${server.password}/${item.stream_id}.${item.container_extension || 'mp4'}`;
  return '';
};

export const canDownload = (item, type) => type !== 'tv' && ['mp4', 'mkv', 'mov'].includes((item.container_extension || '').toLowerCase());
