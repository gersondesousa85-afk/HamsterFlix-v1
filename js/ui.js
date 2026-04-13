import { sanitize, normId } from './utils.js';
import { promoBanner } from './promotions.js';

export const ui = {
  toast(msg) {
    const root = document.getElementById('toastRoot');
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    root.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  },

  setServerName(name) {
    document.getElementById('activeServerLabel').textContent = `Servidor: ${name}`;
  },

  loading(show) {
    document.getElementById('splash').classList.toggle('active', show);
  },

  setNav(route) {
    document.querySelectorAll('.nav-item').forEach((b) => b.classList.toggle('active', b.dataset.route === route));
  },

  renderHome(state, handlers) {
    const view = document.getElementById('view');
    const topMovies = state.movies.slice(0, 12);
    const topSeries = state.series.slice(0, 12);
    const topTv = state.tv.slice(0, 12);
    view.innerHTML = `${this.section('Destaques', state.featured, handlers)}
      ${promoBanner()}
      ${this.section('Filmes por categoria', topMovies, handlers)}
      ${this.section('Séries por categoria', topSeries, handlers)}
      ${this.section('TV em destaque', topTv, handlers)}
      ${this.section('Continuar assistindo', state.continueWatching, handlers)}
      ${this.section('Histórico recente', state.history.slice(0, 15), handlers)}`;
  },

  section(title, items, handlers) {
    if (!items?.length) return `<section><div class="section-title"><h2>${title}</h2></div><div class="horizontal-list">${Array.from({ length: 3 }).map(() => '<div class="skeleton"></div>').join('')}</div></section>`;
    return `<section>
      <div class="section-title"><h2>${title}</h2></div>
      <div class="horizontal-list">${items.map((x) => this.card(x)).join('')}</div>
    </section>`;
  },

  card(x) {
    return `<article class="card" data-id="${sanitize(normId(x))}">
      <img src="${sanitize(x.stream_icon || x.cover || 'https://placehold.co/300x450/100a2b/ffffff?text=HamsterFlix')}" alt="${sanitize(x.name || x.title || 'capa')}" loading="lazy" />
      <div class="card-body">
        <h3>${sanitize(x.name || x.title || 'Sem título')}</h3>
        <p class="muted">${sanitize(x.category_name || x.genre || 'Categoria')}</p>
        <span class="badge">${sanitize(x.type || 'Conteúdo')}</span>
      </div>
    </article>`;
  },

  renderGrid(title, items, type) {
    const view = document.getElementById('view');
    view.innerHTML = `<div class="section-title"><h2>${title}</h2></div><div class="grid">${items.map((x) => this.card({ ...x, type })).join('')}</div>`;
  },

  renderHistory(items) {
    const view = document.getElementById('view');
    view.innerHTML = `<div class="section-title"><h2>Histórico</h2><button class="btn" id="clearHistoryBtn">Limpar</button></div><div class="grid">${items.map((x) => this.card(x)).join('')}</div>`;
  },

  openModal(html) {
    const root = document.getElementById('modalRoot');
    root.innerHTML = html;
    root.querySelectorAll('[data-close]').forEach((b) => b.onclick = () => (root.innerHTML = ''));
  }
};
