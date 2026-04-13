import { CONFIG } from './config.js';

export const promoBanner = () => {
  if (!CONFIG.promo.enabled) return '';
  return `<section class="promo glass"><div><strong>${CONFIG.promo.label}</strong><p class="muted">Apoie o projeto por este link de parceiro.</p></div><a class="btn" href="${CONFIG.promo.link}" target="_blank" rel="noopener">Abrir</a></section>`;
};

export const socialModal = () => `
  <div class="modal-bg" id="socialModal">
    <div class="modal glass">
      <h3>Redes sociais do projeto</h3>
      ${CONFIG.social.map((s) => `<p><a class="btn" href="${s.url}" target="_blank" rel="noopener">${s.name}</a></p>`).join('')}
      <button class="btn" data-close>Fechar</button>
    </div>
  </div>`;
