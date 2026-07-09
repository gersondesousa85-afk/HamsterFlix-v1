/* ═══ NovaFlix — busca, reprodução e download de filmes/séries/animes ═══ */
'use strict';
const SOURCES_URL = 'http://hamsterflix.liveblog365.com/filmes.txt';
const CURATED_URL = 'http://hamsterflix.liveblog365.com/lista.txt';
/* Identidade visual de cada streaming: logo oficial embutido (SVG do
   Simple Icons, sem depender de rede) ou monograma com a cor da marca
   para plataformas sem logo licenciado (Disney+, Globoplay, Star+…). */
const PLAT_LOGOS={
  netflix:'m5.398 0 8.348 23.602c2.346.059 4.856.398 4.856.398L10.113 0H5.398zm8.489 0v9.172l4.715 13.33V0h-4.715zM5.398 1.5V24c1.873-.225 2.81-.312 4.715-.398V14.83L5.398 1.5z',
  hbomax:'M3.784 8.716c-.655 0-1.32.29-2.173.946v-.78H0v6.236h1.715V11.24c.749-.592 1.091-.78 1.372-.78.333 0 .551.209.551.729v3.928h1.715V11.23c.748-.582 1.081-.769 1.372-.769.333 0 .55.208.55.728v3.928H8.99v-4.53c0-1.403-.8-1.871-1.57-1.871-.654 0-1.32.27-2.192.936-.28-.697-.894-.936-1.444-.936zm8.689 0c-1.705 0-3.118 1.466-3.118 3.284 0 1.82 1.413 3.285 3.118 3.285.842 0 1.57-.312 2.131-.988v.82h1.632V8.883h-1.632v.822c-.561-.676-1.29-.988-2.131-.988zm4.064.166c.707 1.102 1.507 2.09 2.443 3.077a26.593 26.593 0 0 0-2.443 3.16h2.069a13.603 13.603 0 0 1 1.673-2.183 14.067 14.067 0 0 1 1.632 2.182H24a25.142 25.142 0 0 0-2.432-3.16A23.918 23.918 0 0 0 24 8.883h-2.047a14.65 14.65 0 0 1-1.674 2.11 13.357 13.357 0 0 1-1.674-2.11zm-3.804 1.279c1.018 0 1.84.82 1.84 1.84a1.837 1.837 0 0 1-1.84 1.839c-1.019 0-1.84-.82-1.84-1.84 0-1.018.821-1.84 1.84-1.84zm0 .415c-.78 0-1.414.633-1.414 1.423s.634 1.424 1.413 1.424c.78 0 1.414-.634 1.414-1.424s-.634-1.424-1.414-1.424z',
  primevideo:'M0 9.508c0-.043.01-.073.028-.09.018-.017.047-.025.086-.025h.329c.07 0 .112.034.127.101l.032.119c.091-.088.202-.159.33-.21a1.04 1.04 0 0 1 .396-.079c.294 0 .528.109.7.326.171.217.257.51.257.88 0 .254-.042.475-.127.665-.086.19-.201.335-.347.437a.85.85 0 0 1-.502.154c-.125 0-.243-.02-.355-.06a.857.857 0 0 1-.288-.164v1.003c0 .043-.008.073-.025.09-.017.016-.046.025-.09.025H.115c-.04 0-.068-.009-.086-.025-.019-.017-.028-.047-.028-.09zm1.113.32a.868.868 0 0 0-.447.124v1.206a.834.834 0 0 0 .447.124c.17 0 .296-.058.376-.174.081-.117.121-.3.121-.55 0-.254-.04-.439-.118-.555-.08-.116-.206-.174-.379-.174zm2.248-.087c.121-.134.236-.23.344-.286a.733.733 0 0 1 .345-.085h.063c.043 0 .073.009.092.025.018.017.027.047.027.09v.385c0 .04-.008.068-.025.087-.017.018-.046.027-.089.027a.923.923 0 0 1-.082-.004 1.369 1.369 0 0 0-.383.025c-.1.02-.186.045-.256.076v1.54c0 .04-.008.069-.025.087-.016.018-.046.028-.089.028h-.437c-.04 0-.069-.01-.087-.028-.018-.018-.028-.047-.028-.087V9.508c0-.043.01-.073.028-.09.018-.017.047-.025.087-.025h.328c.07 0 .112.034.128.1zm1.526-.71a.396.396 0 0 1-.278-.096.338.338 0 0 1-.105-.262c0-.11.035-.197.105-.26a.395.395 0 0 1 .278-.097c.116 0 .208.032.278.096.07.064.105.151.105.261a.34.34 0 0 1-.105.262.396.396 0 0 1-.278.096zm-.333.477c0-.043.01-.073.027-.09.019-.017.048-.025.087-.025h.438c.043 0 .072.008.089.025s.025.047.025.09v2.113c0 .04-.008.069-.025.087-.017.018-.046.028-.09.028h-.437c-.04 0-.068-.01-.087-.028-.018-.018-.027-.047-.027-.087zm1.837.11c.161-.107.306-.183.435-.227.13-.045.263-.067.4-.067.273 0 .466.098.579.294.155-.104.3-.18.438-.225.137-.046.278-.069.424-.069.213 0 .377.06.495.179.117.12.175.286.175.5v1.618c0 .04-.008.069-.025.087-.017.019-.046.027-.089.027h-.438c-.04 0-.068-.008-.086-.027-.018-.018-.028-.047-.028-.087V10.15c0-.208-.092-.312-.278-.312-.164 0-.33.04-.497.119v1.664c0 .04-.008.069-.025.087-.017.019-.046.027-.09.027h-.437c-.04 0-.068-.008-.086-.027-.019-.018-.028-.047-.028-.087V10.15c0-.208-.093-.312-.278-.312-.17 0-.337.04-.502.123v1.66c0 .04-.008.069-.025.087-.017.019-.046.027-.089.027h-.438c-.039 0-.068-.008-.086-.027-.018-.018-.027-.047-.027-.087V9.508c0-.043.009-.073.027-.09.018-.017.047-.025.086-.025h.329c.07 0 .112.034.128.101zm4.387 1.16a1.81 1.81 0 0 1-.451-.05c.018.204.08.35.185.44.105.088.263.132.476.132.085 0 .168-.005.249-.016a3.08 3.08 0 0 0 .362-.078.143.143 0 0 1 .023-.002c.052 0 .078.035.078.105v.211c0 .049-.007.083-.02.103a.169.169 0 0 1-.08.053 1.953 1.953 0 0 1-.708.128c-.377 0-.666-.103-.868-.312-.203-.207-.304-.505-.304-.893 0-.398.104-.71.31-.935.207-.227.494-.34.862-.34.283 0 .504.069.664.206a.69.69 0 0 1 .24.55c0 .23-.087.403-.258.52-.172.119-.425.177-.76.177zm.064-.99c-.292 0-.46.18-.506.54.122.025.257.037.406.037.155 0 .267-.024.337-.071.07-.047.105-.12.105-.218 0-.193-.114-.289-.342-.289zm2.948 1.946a.21.21 0 0 1-.075-.011.119.119 0 0 1-.05-.037.274.274 0 0 1-.038-.071l-.777-2.04a1.863 1.863 0 0 1-.023-.063.162.162 0 0 1-.009-.05c0-.047.03-.07.091-.07h.454c.049 0 .084.01.107.028.023.018.04.049.052.092l.468 1.622.477-1.622a.175.175 0 0 1 .052-.092c.023-.018.058-.027.107-.027h.44c.061 0 .091.022.091.068a.16.16 0 0 1-.009.05l-.022.065-.777 2.039a.274.274 0 0 1-.039.07.122.122 0 0 1-.047.038.207.207 0 0 1-.078.01zm2.02-2.703a.393.393 0 0 1-.277-.097.338.338 0 0 1-.105-.26c0-.11.035-.198.105-.262a.393.393 0 0 1 .277-.096c.115 0 .207.032.277.096.07.064.104.151.104.261 0 .11-.034.197-.104.261a.393.393 0 0 1-.277.097zm-.218 2.703c-.04 0-.068-.01-.086-.028-.019-.018-.028-.047-.028-.087V9.507c0-.043.01-.072.028-.09.018-.016.047-.024.086-.024h.436c.042 0 .072.008.089.025.016.017.024.046.024.09v2.111c0 .04-.008.07-.024.087-.017.019-.047.028-.09.028zm1.948.05a.869.869 0 0 1-.513-.153.97.97 0 0 1-.334-.426 1.6 1.6 0 0 1-.116-.63c0-.38.09-.682.268-.91a.856.856 0 0 1 .709-.341.98.98 0 0 1 .622.206V8.458c0-.043.01-.073.027-.09.018-.016.047-.025.087-.025h.436c.042 0 .071.009.088.025.017.017.025.047.025.09v3.161c0 .04-.008.07-.025.087-.017.019-.046.028-.088.028h-.364a.135.135 0 0 1-.084-.023.137.137 0 0 1-.043-.078l-.027-.105a.958.958 0 0 1-.668.256zm.218-.504a.762.762 0 0 0 .418-.128v-1.21a.872.872 0 0 0-.45-.114c-.16 0-.28.06-.358.18-.08.121-.118.304-.118.548 0 .245.041.426.124.546.084.119.212.178.384.178zm2.588-.51c-.169 0-.315-.016-.44-.05.018.201.078.345.18.432.103.087.257.13.465.13.083 0 .164-.005.242-.016a2.997 2.997 0 0 0 .354-.076.135.135 0 0 1 .022-.002c.05 0 .075.035.075.103v.207c0 .048-.007.082-.02.101a.165.165 0 0 1-.077.052 1.895 1.895 0 0 1-.69.126c-.367 0-.65-.102-.846-.306-.197-.204-.296-.496-.296-.876 0-.39.1-.695.302-.917.202-.222.482-.333.84-.333.276 0 .492.068.647.203a.678.678 0 0 1 .234.539c0 .225-.084.395-.251.51-.168.115-.415.173-.74.173zm.063-.97c-.285 0-.45.176-.494.53.119.024.25.036.396.036.15 0 .26-.024.329-.07.068-.046.102-.117.102-.213 0-.19-.111-.284-.333-.284zm2.442 2.003c-.36 0-.642-.11-.845-.328-.203-.218-.304-.523-.304-.914 0-.388.101-.691.304-.91.203-.218.485-.327.845-.327s.642.109.845.327c.203.219.304.522.304.91 0 .39-.101.696-.304.914-.203.218-.485.328-.845.328zm0-.514c.318 0 .477-.242.477-.728 0-.483-.16-.724-.477-.724-.318 0-.477.241-.477.724 0 .486.16.728.477.728zm-6.844 1.886c.405-.306.944-.408 1.39-.408.418 0 .756.09.828.185.15.2-.039 1.584-.775 2.244-.112.102-.22.047-.17-.087.166-.442.536-1.436.36-1.677-.175-.242-1.158-.115-1.6-.058-.068.008-.107-.02-.112-.061v-.023c.004-.036.03-.078.079-.115zm-10.184-.172a.105.105 0 0 1 .106-.091c.027 0 .057.009.089.028a11.778 11.778 0 0 0 6.194 1.772c1.52 0 3.19-.34 4.726-1.043.232-.105.426.164.2.346-1.371 1.09-3.359 1.67-5.07 1.67-2.397 0-4.557-.956-6.191-2.547a.173.173 0 0 1-.054-.097Z',
  appletv:'M20.57 17.735h-1.815l-3.34-9.203h1.633l2.02 5.987c.075.231.273.9.586 2.012l.297-.997.33-1.006 2.094-6.004H24zm-5.344-.066a5.76 5.76 0 0 1-1.55.207c-1.23 0-1.84-.693-1.84-2.087V9.646h-1.063V8.532h1.121V7.081l1.476-.602v2.062h1.707v1.113H13.38v5.805c0 .446.074.75.214.932.14.182.396.264.75.264.207 0 .495-.041.883-.115zm-7.29-5.343c.017 1.764 1.55 2.358 1.567 2.366-.017.042-.248.842-.808 1.658-.487.71-.99 1.418-1.79 1.435-.783.016-1.03-.462-1.93-.462-.89 0-1.17.445-1.913.478-.758.025-1.344-.775-1.838-1.484-.998-1.451-1.765-4.098-.734-5.88.51-.89 1.426-1.451 2.416-1.46.75-.016 1.468.512 1.93.512.461 0 1.327-.627 2.234-.536.38.016 1.452.157 2.136 1.154-.058.033-1.278.743-1.27 2.219M6.468 7.988c.404-.495.685-1.18.61-1.864-.585.025-1.294.388-1.723.883-.38.437-.71 1.138-.619 1.806.652.05 1.328-.338 1.732-.825Z',
  paramountplus:'M16.347 21.373c.057-.084.151-.314-.025-.74l-.53-1.428c-.073-.182.084-.293.19-.173 0 0 1.004 1.157 1.264 1.64l.495.822c.425.028 1.6.06 2.732.06a3.26 3.26 0 0 1-.316-.364c-1.93-2.392-3.154-3.724-3.166-3.737-.391-.426-.572-.508-.87-.643a4.82 4.82 0 0 1-.138-.065v.364c0 .047-.057.073-.086.022l-2.846-5.001a1.598 1.598 0 0 0-.508-.587l-.277-.194-1.354 3.123c.212 0 .354.216.27.409l-1.25 2.893h1.147c.443 0 .883.087 1.294.255l.302.125s-.913 1.878-.913 2.867c0 .181.028.362.075.534h2.104l-.096-.595s1.266.294 2.502.413M12 2.437c-6.627 0-12 5.373-12 12 0 2.669.873 5.133 2.346 7.126.503-.218.783-.542.983-.791l2.234-2.858a.467.467 0 0 1 .179-.138l.336-.146 3.674-4.659.534-.417 1.094-1.524a.482.482 0 0 1 .101-.102l.478-.347a.34.34 0 0 1 .398-.004l.578.407c.308.216.557.504.726.84l2.322 4.077c.051.09.09.129.182.174.454.227.732.268 1.33.913.277.304 1.495 1.666 3.203 3.784.236.318.538.588.963.783A11.948 11.948 0 0 0 24 14.437c0-6.627-5.373-12-12-12M3.236 15.1l-.778-.253-.48.662v-.818l-.778-.253.778-.253v-.818l.48.662.778-.253-.48.662Zm-.185 2.676-.252.778-.253-.778h-.818l.661-.481-.253-.777.663.48.66-.48-.252.777.662.481Zm.156-6.195.253.778-.661-.48-.663.48.253-.778-.66-.48h.817l.253-.778.252.777h.818Zm1.314-1.76L4.04 9.16l-.778.253.48-.661-.48-.663.778.254.48-.662v.818l.778.253-.777.252Zm2.045-2.862-.253.777-.252-.777h-.818l.662-.48-.253-.778.661.48.661-.48-.252.777.662.48Zm2.577-1.313-.48.661V5.49l-.779-.254.778-.253v-.817l.48.66.78-.253-.481.663.48.66zm3.265-.75.253.778-.661-.48-.662.48.252-.777-.66-.481h.818L12 3.637l.252.778h.818zm2.93.595v.816l-.481-.661-.777.252.48-.662-.48-.662.777.253.48-.66v.817l.779.252zm5.426 8.285.778.253.48-.662v.818l.778.253-.778.253v.818l-.48-.662-.778.253.48-.662zm-3.077-6.04-.253-.777h-.818l.662-.48-.253-.778.662.48.662-.48-.254.778.662.48h-.818zm1.792 2.086v-.818l-.777-.252.777-.253V7.68l.481.662.777-.254-.48.663.48.66-.777-.252zm1.469 1.278.253-.777.254.777h.816l-.66.481.252.778-.662-.48-.661.48.253-.778-.662-.48zm.506 6.676-.253.778-.253-.778h-.817l.662-.481-.253-.777.66.48.663-.48-.253.777.661.481zm-12.08-.615.76-1.588c.024-.048-.032-.108-.067-.067l-.664.668c-.313.329-.847 1.25-.95 1.421l-.808 1.335a.109.109 0 0 1 .1.162l-.739 1.238c-.18.309.145.523.189.452 1.157-1.868 1.832-1.719 1.832-1.719l.387-.897c.022-.047-.001-.1-.05-.12-.12-.05-.316-.27.01-.885z',
  crunchyroll:'M2.909 13.436C2.914 7.61 7.642 2.893 13.468 2.898c5.576.005 10.137 4.339 10.51 9.819q.021-.351.022-.706C24.007 5.385 18.64.006 12.012 0S.007 5.36 0 11.988 5.36 23.994 11.988 24q.412 0 .815-.027c-5.526-.338-9.9-4.928-9.894-10.538Zm16.284.155a4.1 4.1 0 0 1-4.095-4.103 4.1 4.1 0 0 1 2.712-3.855 8.95 8.95 0 0 0-4.187-1.037 9.007 9.007 0 1 0 8.997 9.016q-.001-.847-.15-1.651a4.1 4.1 0 0 1-3.278 1.63Z',
  hulu:'M14.707 15.957h1.912V8.043h-1.912zm-3.357-2.256a.517.517 0 01-.512.511H9.727a.517.517 0 01-.512-.511v-3.19H7.303v3.345c0 1.368.879 2.09 2.168 2.09h1.868c1.189 0 1.912-.856 1.912-2.09V10.51h-1.912c.01 0 .01 3.09.01 3.19zm10.75-3.19v3.19a.517.517 0 01-.512.511h-1.112a.517.517 0 01-.511-.511v-3.19h-1.912v3.345c0 1.368.878 2.09 2.167 2.09h1.868c1.19 0 1.912-.856 1.912-2.09V10.51zm-18.32 0H2.557c-.434 0-.645.11-.645.11V8.044H0v7.903h1.9v-3.179c0-.278.234-.511.512-.511h1.112c.278 0 .511.233.511.511v3.19h1.912v-3.446c0-1.445-.967-2-2.167-2Z'
};
const PLAT_META=[
  {k:['netflix'],bg:'#E50914',fg:'#fff',ini:'N',logo:'netflix'},
  {k:['disney','disney plus'],bg:'#0E47BE',fg:'#fff',ini:'D+'},
  {k:['hbo','hbo max','max'],bg:'#7B2BF9',fg:'#fff',ini:'HBO',logo:'hbomax'},
  {k:['prime','prime video','amazon','amazon prime'],bg:'#00A8E1',fg:'#04222e',ini:'PV',logo:'primevideo'},
  {k:['apple tv','apple tv plus'],bg:'#1c1c1e',fg:'#fff',ini:'TV+',logo:'appletv'},
  {k:['paramount','paramount plus'],bg:'#0064FF',fg:'#fff',ini:'P+',logo:'paramountplus'},
  {k:['globoplay'],bg:'#FB0234',fg:'#fff',ini:'g'},
  {k:['star','star plus'],bg:'#E6007E',fg:'#fff',ini:'S+'},
  {k:['crunchyroll'],bg:'#F47521',fg:'#2b1100',ini:'CR',logo:'crunchyroll'},
  {k:['telecine'],bg:'#1F2A8C',fg:'#fff',ini:'TC'},
  {k:['hulu'],bg:'#1CE783',fg:'#04250f',ini:'hulu',logo:'hulu'},
  {k:['pluto','pluto tv'],bg:'#FFDB00',fg:'#211a00',ini:'PL'},
];
function platMeta(name){
  const n=norm(name);
  return PLAT_META.find(m=>m.k.some(k=>n===k||n.includes(k)))||{bg:'var(--s3)',fg:'var(--tx)',ini:(name[0]||'?').toUpperCase()};
}
/* Ícone da plataforma: SVG oficial quando existir; senão, monograma */
function platIconHTML(name){
  const m=platMeta(name);
  const path=m.logo&&PLAT_LOGOS[m.logo];
  if(!path) return `<span class="plat-ic" style="background:${m.bg};color:${m.fg}">${esc(m.ini)}</span>`;
  return `<span class="plat-ic" style="background:${m.bg}">`+
    `<svg viewBox="0 0 24 24" role="img" aria-label="${esc(name)}" fill="${m.fg}"><path d="${path}"/></svg></span>`;
}
const PLATFORM_WORDS=['netflix','hbo','hbo max','max','disney','disney plus','prime','prime video','amazon','amazon prime',
  'apple tv','apple tv plus','paramount','paramount plus','globoplay','star plus','star','crunchyroll','telecine',
  'discovery','discovery plus','hulu','peacock','pluto','pluto tv','looke','mubi','lionsgate','universal','claro video'];
const G  = id=>document.getElementById(id);
const $$ = s=>[...document.querySelectorAll(s)];

const norm = s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[.,;:!?'"´`^~()\[\]{}\-–—_|\/\\+*]/g,' ').replace(/\s+/g,' ').trim();
const esc = s=>!s?'':String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const fmtT = s=>{ if(!isFinite(s))return'0:00'; s=Math.floor(s); const h=~~(s/3600),m=~~(s%3600/60),x=s%60;
  return h?`${h}:${String(m).padStart(2,'0')}:${String(x).padStart(2,'0')}`:`${m}:${String(x).padStart(2,'0')}`; };

function toast(msg, type=''){ const t=document.createElement('div'); t.className='t '+type; t.textContent=msg;
  G('toast').appendChild(t); setTimeout(()=>{t.style.opacity='0';t.style.transition='.3s';setTimeout(()=>t.remove(),320)},3600); }

/* ═══════════════════════════════════════════════════════════════════════════
   MONETIZAÇÃO POR DIRECT LINK
   ─────────────────────────────────────────────────────────────────────────
   • Contador ÚNICO e global (Assistir + Baixar), persistido em localStorage —
     nunca se perde ao fechar/reabrir o app. Sem qualquer contagem por tempo.
   • Os 5 primeiros cliques passam livres. Depois, ciclo permanente de 3:
     1º e 2º cliques abrem normalmente; o 3º mostra "Aguarde um instante…"
     e abre o Direct Link.
   • A ação bloqueada (assistir/baixar + item escolhido) fica salva; quando o
     usuário volta ao app ela é executada automaticamente e o ciclo reinicia.
   • Em WebView Android o link NUNCA abre dentro da WebView: usa Intent
     (ACTION_VIEW) para o Chrome e, sem Chrome, para o navegador padrão.
   Toda a lógica está centralizada neste módulo; os botões apenas chamam
   Monet.gate(tipo, payload) e prosseguem se ele liberar.
   ═══════════════════════════════════════════════════════════════════════ */
const Monet={
  URL:'https://omg10.com/4/8725938',
  FREE_CLICKS:5,        // cliques iniciais sem anúncio
  CYCLE_AD_AT:3,        // no ciclo permanente, o 3º clique exibe o anúncio
  KEY:'nf_monet',       // {total, cycle, waiting, pending}

  load(){ try{ return JSON.parse(localStorage.getItem(this.KEY))||{}; }catch{ return {}; } },
  save(st){ try{ localStorage.setItem(this.KEY,JSON.stringify(st)); }catch{} },

  /* WebView Android: UA contém "; wv)" (moderno) ou "Version/x.x" + Chrome (legado) */
  isAndroidWebView(){
    const ua=navigator.userAgent||'';
    if(!/Android/i.test(ua)) return false;
    return /;\s*wv\)/i.test(ua) || (/Version\/[\d.]+/i.test(ua) && /Chrome\//i.test(ua));
  },

  /* Abre o Direct Link SEMPRE fora da WebView.
     Em WebView: Intent ACTION_VIEW mirando o Chrome; se o Chrome não existir
     o intent falha e caímos no intent genérico (navegador padrão do sistema). */
  openDirectLink(){
    const url=this.URL;
    if(this.isAndroidWebView()){
      const bare=url.replace(/^https?:\/\//,'');
      const viaChrome=`intent://${bare}#Intent;scheme=https;action=android.intent.action.VIEW;package=com.android.chrome;end`;
      const viaPadrao=`intent://${bare}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
      try{ location.href=viaChrome; }catch{ location.href=viaPadrao; }
      // Se após 1,2s o app continuar visível, o Chrome não está instalado:
      // repete com o intent genérico (navegador padrão via ACTION_VIEW).
      setTimeout(()=>{ if(!document.hidden){ try{ location.href=viaPadrao; }catch{} } },1200);
      // Último recurso: nova janela (o wrapper da WebView decide o destino).
      setTimeout(()=>{ if(!document.hidden) window.open(url,'_blank'); },2400);
    } else {
      // Navegador comum: nova aba (chamado dentro do gesto de clique,
      // então não é bloqueado como pop-up).
      const w=window.open(url,'_blank','noopener');
      if(!w) location.href=url; // pop-up bloqueado: mesma aba (voltar retoma a ação)
    }
  },

  /* Porteiro único de Assistir/Baixar.
     Retorna true  → a ação segue normalmente;
     Retorna false → o anúncio foi aberto e a ação ficou pendente. */
  gate(type, payload){
    const st=this.load();
    st.total=(st.total||0)+1;
    // Fase livre: os 5 primeiros cliques nunca têm anúncio
    if(st.total<=this.FREE_CLICKS){ this.save(st); return true; }
    // Ciclo permanente: 1º e 2º liberados, 3º exibe o Direct Link
    st.cycle=(st.cycle||0)+1;
    if(st.cycle<this.CYCLE_AD_AT){ this.save(st); return true; }
    st.pending={type, payload};   // guarda o que o usuário tentou fazer
    st.waiting=true;              // aguardando o retorno do anúncio
    this.save(st);
    toast('Aguarde um instante…');
    this.openDirectLink();
    return false;
  },

  /* Retorno ao app: reinicia o ciclo e executa a ação pendente
     (Assistir → reproduz sozinho; Baixar → download inicia sozinho). */
  resume(){
    const st=this.load();
    if(!st.waiting) return;
    if(!G('boot').classList.contains('off')) return; // espera o boot terminar
    st.waiting=false; st.cycle=0;
    const p=st.pending; st.pending=null;
    this.save(st);
    if(!p||!p.payload||!p.payload.item) return;
    if(p.type==='download') startDownload(p.payload.item, true);
    else playItem(p.payload.item, p.payload.list||[]);
  }
};
/* Retomada automática: ao voltar do navegador (visibilidade/pageshow)
   ou ao reabrir o app (chamado também ao fim do boot). */
document.addEventListener('visibilitychange',()=>{ if(!document.hidden) Monet.resume(); });
window.addEventListener('pageshow',()=>Monet.resume());

/* ═══ Busca tolerante a erros de digitação (acentos + distância de edição) ═══ */
function lev(a,b,max){ // Levenshtein com corte antecipado
  if(Math.abs(a.length-b.length)>max) return max+1;
  const dp=Array.from({length:a.length+1},(_,i)=>i);
  for(let j=1;j<=b.length;j++){
    let prev=dp[0]; dp[0]=j; let rowMin=dp[0];
    for(let i=1;i<=a.length;i++){
      const tmp=dp[i];
      dp[i]=Math.min(dp[i]+1, dp[i-1]+1, prev+(a[i-1]===b[j-1]?0:1));
      prev=tmp; if(dp[i]<rowMin)rowMin=dp[i];
    }
    if(rowMin>max) return max+1;
  }
  return dp[a.length];
}
function fuzzyScore(nameN, qN, qWords){
  if(nameN.includes(qN)) return 100 - nameN.indexOf(qN)*0.1;      // substring direta
  const nWords = nameN.split(' ');
  let hits=0, score=0;
  for(const qw of qWords){
    if(qw.length<2){ continue; }
    let best=-1;
    for(const nw of nWords){
      if(nw.startsWith(qw)){ best=Math.max(best,80); continue; }
      if(nw.includes(qw)){ best=Math.max(best,60); continue; }
      const tol = qw.length>=6?2 : qw.length>=4?1 : 0;             // "vingadres" acha "vingadores"
      if(tol && lev(nw,qw,tol)<=tol) best=Math.max(best,50);
    }
    if(best>0){ hits++; score+=best; }
  }
  if(!hits || hits < Math.ceil(qWords.length*0.6)) return 0;       // maioria das palavras precisa bater
  return score/qWords.length;
}

/* ═══ Rede robusta ═══
   Por que só 1 proxy falhava: os servidores não enviam CORS, então quase
   tudo passa por proxy — e o allorigins sozinho cai/limita com frequência,
   fazendo o app "não encontrar" listas que funcionam. Agora:
   • pool de 3 proxies com rotação;
   • memoriza qual funcionou e o tenta primeiro nas próximas chamadas;
   • pula a tentativa direta quando seria mixed content garantido;
   • leitura em streaming com progresso (bytes) p/ a barra de carregamento. */
const PAGE_HTTPS_N = location.protocol==='https:';
const PROXIES=[
  u=>'https://api.allorigins.win/raw?url='+encodeURIComponent(u),
  u=>'https://corsproxy.io/?url='+encodeURIComponent(u),
  u=>'https://api.codetabs.com/v1/proxy?quest='+encodeURIComponent(u),
];
let _goodProxy = +(localStorage.getItem('nf_proxy')||0);

function netPlan(url){
  const order=[...PROXIES.keys()];
  order.splice(order.indexOf(_goodProxy),1); order.unshift(_goodProxy);
  const plan=[];
  if(!(PAGE_HTTPS_N && /^http:/i.test(url))) plan.push({u:url, p:-1}); // direta só se não for mixed content
  order.forEach(i=>plan.push({u:PROXIES[i](url), p:i}));
  return plan;
}

async function fetchSmart(url, {timeout=9000, asJson=false, onProgress=null}={}){
  let lastErr;
  for(const step of netPlan(url)){
    const ctrl=new AbortController(); const t=setTimeout(()=>ctrl.abort(),timeout);
    try{
      const r=await fetch(step.u,{signal:ctrl.signal});
      if(!r.ok) throw new Error('HTTP '+r.status);
      let text;
      if(onProgress && r.body){
        const total=+r.headers.get('content-length')||0;
        const reader=r.body.getReader(); const chunks=[]; let got=0;
        while(true){
          const {done,value}=await reader.read();
          if(done) break;
          chunks.push(value); got+=value.length;
          onProgress(got,total);
        }
        clearTimeout(t);
        const buf=new Uint8Array(got); let o=0;
        for(const c of chunks){ buf.set(c,o); o+=c.length; }
        text=new TextDecoder().decode(buf);
      } else { text=await r.text(); clearTimeout(t); }
      if(step.p>=0 && step.p!==_goodProxy){ _goodProxy=step.p; localStorage.setItem('nf_proxy',String(step.p)); }
      return asJson ? JSON.parse(text) : text;
    }catch(e){ clearTimeout(t); lastErr=e; }
  }
  throw lastErr||new Error('Falha de rede');
}

/* ═══ Estado ═══ */
const ST={
  curated:null, plat:null,
  sources:[],           // [{base,user,pass,status:'?'|'ok'|'bad',expira}]
  active:null,
  movies:[], series:[], // catálogo da lista ativa
  history: JSON.parse(localStorage.getItem('nf_hist')||'[]'),   // {key,name,icon,type,pos,dur,ts,url?}
  saved:   JSON.parse(localStorage.getItem('nf_saved')||'[]'),
  dls:     JSON.parse(localStorage.getItem('nf_dls')||'[]'),    // {key,name,icon,url,ts,status}
  tutSeen: localStorage.getItem('nf_tut')==='1',
  q:'', page:'home', lib:'dl',
  curList:[], curIdx:-1, cur:null,
};
const saveLS=()=>{ localStorage.setItem('nf_hist',JSON.stringify(ST.history.slice(0,80)));
  localStorage.setItem('nf_saved',JSON.stringify(ST.saved)); localStorage.setItem('nf_dls',JSON.stringify(ST.dls)); };
// Migração: itens antigos ganham a chave por nome
[ST.history,ST.saved,ST.dls].forEach(arr=>arr.forEach(x=>{ if(!x.nkey&&x.name) x.nkey=norm(x.name); }));

/* Detecção por nome: encontra o título equivalente no catálogo ATUAL */
function resolveByName(nkey, name){
  if(!nkey) nkey=norm(name||'');
  // filmes: igualdade exata primeiro, depois fuzzy
  let hit=ST.movies.find(m=>m.nameN===nkey);
  if(hit) return {url:movieUrl(hit), icon:hit.icon};
  // episódios de séries locais (modo M3U)
  for(const g of ST.series){
    if(!g.eps) continue;
    const ep=g.eps.find(x=>norm(x.name)===nkey);
    if(ep) return {url:ep.url, icon:ep.icon||g.icon};
  }
  // fuzzy como último recurso
  const qW=nkey.split(' ').filter(w=>w.length>1);
  let best=null,bs=0;
  for(const m of ST.movies){ const sc=fuzzyScore(m.nameN,nkey,qW); if(sc>bs){bs=sc;best={url:movieUrl(m),icon:m.icon};} }
  return bs>=70?best:null;
}

/* ═══ BOOT: carrega fontes e escolhe a primeira que funciona ═══ */
function parseSources(txt){
  // Extrai QUALQUER url get.php/player_api do texto, mesmo com lixo ao redor,
  // linhas com nomes, espaços ou várias urls na mesma linha.
  const found = txt.match(/https?:\/\/[^\s"'<>]+?(?:get|player_api)\.php[^\s"'<>]*/gi) || [];
  const out=[], seen=new Set();
  for(const raw of found){
    try{
      const u=new URL(raw);
      const user=u.searchParams.get('username'), pass=u.searchParams.get('password');
      if(!user||!pass) continue;
      const k=u.origin+'|'+user;
      if(seen.has(k)) continue; seen.add(k);
      out.push({base:u.origin, user, pass, status:'?', expira:''});
    }catch{}
  }
  return out;
}
const api = (s,extra='')=>`${s.base}/player_api.php?username=${encodeURIComponent(s.user)}&password=${encodeURIComponent(s.pass)}${extra}`;

async function testSource(s){
  try{
    const j=await fetchSmart(api(s),{timeout:10000,asJson:true});
    const ui=j?.user_info;
    // Antes exigíamos status==='Active' e rejeitávamos contas trial/painéis
    // que não enviam status — listas boas eram descartadas. Agora só
    // recusamos estados explicitamente ruins.
    if(ui && String(ui.auth)==='1' && !['Banned','Disabled','Expired'].includes(ui.status)){
      if(ui.exp_date) s.expira=new Date(+ui.exp_date*1000).toLocaleDateString('pt-BR');
      return true;
    }
  }catch{}
  return false;
}

const m3uUrl=s=>`${s.base}/get.php?username=${encodeURIComponent(s.user)}&password=${encodeURIComponent(s.pass)}&type=m3u_plus&output=ts`;

/* Sonda o get.php em streaming: baixa só o começo, confirma "#EXTM3U" e aborta.
   Valida a lista em ~1 requisição parcial, sem baixar o arquivo inteiro. */
async function probeM3U(s){
  for(const step of netPlan(m3uUrl(s))){
    const ctrl=new AbortController(); const t=setTimeout(()=>ctrl.abort(),12000);
    try{
      const r=await fetch(step.u,{signal:ctrl.signal});
      if(!r.ok) throw 0;
      if(!r.body){ const tx=await r.text(); clearTimeout(t); if(tx.includes('#EXTM3U')){markProxy(step);return true;} continue; }
      const reader=r.body.getReader(); let head='';
      const dec=new TextDecoder();
      while(head.length<4096){
        const {done,value}=await reader.read();
        if(done) break;
        head+=dec.decode(value,{stream:true});
        if(head.includes('#EXTM3U')){ ctrl.abort(); clearTimeout(t); markProxy(step); return true; }
      }
      clearTimeout(t);
    }catch{ clearTimeout(t); }
  }
  return false;
}
function markProxy(step){ if(step.p>=0&&step.p!==_goodProxy){_goodProxy=step.p;localStorage.setItem('nf_proxy',String(step.p));} }

/* Valida uma lista pelos dois caminhos em paralelo; o primeiro que confirmar vence */
function testDual(s){
  return new Promise(res=>{
    let done=false, pend=2;
    const fin=ok=>{ if(done)return; if(ok){done=true;s.status='ok';res(true);}
      else if(--pend===0){ s.status='bad'; res(false); } };
    testSource(s).then(ok=>{ if(ok)s.mode='api'; fin(ok); });
    probeM3U(s).then(ok=>{ if(ok&&!s.mode)s.mode='m3u'; fin(ok); });
  });
}

/* Testa todas em paralelo e resolve com a PRIMEIRA que autenticar */
function raceSources(list, onEach){
  return new Promise(resolve=>{
    let pending=list.length, winner=null;
    if(!pending) return resolve(null);
    list.forEach(async s=>{
      const ok=await testDual(s);
      onEach?.(s);
      if(ok && !winner){ winner=s; resolve(s); }
      if(--pending===0 && !winner) resolve(null);
    });
  });
}

/* Cache do catálogo em IndexedDB — entrada quase instantânea nas próximas visitas */
const IDB={
  open(){ return new Promise((res,rej)=>{ const r=indexedDB.open('novaflix',1);
    r.onupgradeneeded=()=>r.result.createObjectStore('kv');
    r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); }); },
  async get(k){ try{ const db=await this.open(); return await new Promise(res=>{
    const t=db.transaction('kv').objectStore('kv').get(k);
    t.onsuccess=()=>res(t.result); t.onerror=()=>res(null); }); }catch{ return null; } },
  async set(k,v){ try{ const db=await this.open(); await new Promise(res=>{
    const t=db.transaction('kv','readwrite').objectStore('kv').put(v,k);
    t.onsuccess=res; t.onerror=res; }); }catch{} }
};

const fmtMB=b=>(b/1048576).toFixed(1)+' MB';
function bootProg(pct, txt, detail=''){
  G('bootBar').style.width=Math.min(100,pct)+'%';
  G('bootPct').textContent=Math.round(Math.min(100,pct))+'%';
  if(txt)G('bootSt').textContent=txt;
  G('bootLog').textContent=detail;
}

async function boot(){
  G('bootRetry').style.display='none';
  loadCurated(); // curadoria em paralelo, não bloqueia

  // ── Caminho rápido: último servidor + catálogo em cache ──
  try{
    const cache=await IDB.get('cat');
    const savedSources=JSON.parse(localStorage.getItem('nf_sources')||'null');
    if(cache && savedSources?.length && cache.idx<savedSources.length &&
       (cache.movies?.length || cache.series?.length)){
      ST.sources=savedSources.map(s=>({...s,status:'?',mode:s.mode}));
      ST.active=ST.sources[cache.idx]; ST.active.status='ok';
      ST.movies=cache.movies||[]; ST.series=cache.series||[];
      _matchCache.clear();
      bootProg(100,'Pronto!');
      finishBoot();
      revalidateBg(cache.ts);   // valida e atualiza em segundo plano
      return;
    }
  }catch{}

  bootProg(4,'Conectando…');
  let txt;
  try{ txt=await fetchSmart(SOURCES_URL,{timeout:14000}); }
  catch{ bootProg(4,'Sem conexão com o serviço.','Verifique a internet e tente de novo.'); G('bootRetry').style.display='block'; return; }
  ST.sources=parseSources(txt);
  bootProg(12,`${ST.sources.length} servidores disponíveis`);
  if(!ST.sources.length){ bootProg(12,'Nenhum servidor disponível no momento.'); G('bootRetry').style.display='block'; return; }

  // Prioriza a última que funcionou, mas testa TODAS em paralelo —
  // a primeira que autenticar vence (rápido mesmo com listas mortas no meio).
  const savedIdx=+localStorage.getItem('nf_srcIdx');
  const list=[...ST.sources];
  if(savedIdx>=0 && savedIdx<list.length) list.unshift(list.splice(savedIdx,1)[0]);
  let done=0;
  bootProg(15,`Procurando o servidor mais rápido…`);
  const winner=await raceSources(list, ()=>{ done++; bootProg(15+30*(done/list.length),null,`${done}/${list.length} testadas`); });
  if(!winner){
    bootProg(45,'Nenhum servidor respondeu agora.','Tente novamente em instantes.');
    G('bootRetry').style.display='block'; return;
  }
  ST.active=winner;
  localStorage.setItem('nf_srcIdx',String(ST.sources.indexOf(winner)));
  localStorage.setItem('nf_sources',JSON.stringify(ST.sources.map(({base,user,pass,mode})=>({base,user,pass,mode}))));
  bootProg(46,'Servidor conectado! Carregando catálogo…','');
  await loadCatalog();
  saveCatCache();
  bootProg(100,'Pronto!');
  setTimeout(finishBoot,250);
}

function saveCatCache(){
  _matchCache.clear();
  IDB.set('cat',{idx:ST.sources.indexOf(ST.active), ts:Date.now(),
    movies:ST.movies, series:ST.series});
}

/* Valida o servidor em segundo plano; se caiu, troca sozinho sem travar o usuário */
async function revalidateBg(cacheTs){
  const idxTxt=await fetchSmart(SOURCES_URL,{timeout:14000}).catch(()=>null);
  if(idxTxt){
    const fresh=parseSources(idxTxt);
    if(fresh.length){ // preserva o ativo se ainda existir
      const key=s=>s.base+'|'+s.user;
      const act=ST.active&&key(ST.active);
      ST.sources=fresh;
      ST.active=fresh.find(s=>key(s)===act)||null;
      localStorage.setItem('nf_sources',JSON.stringify(fresh.map(({base,user,pass})=>({base,user,pass}))));
    }
  }
  if(ST.active && await testDual(ST.active)){
    updSrcChip();
    if(Date.now()-(cacheTs||0) > 12*3600*1000){ // catálogo com +12h: renova silenciosamente
      await loadCatalog(); saveCatCache();
      if(!ST.q) renderReco();
    }
    return;
  }
  // servidor caiu: elege outro sem incomodar
  const winner=await raceSources(ST.sources.filter(s=>s!==ST.active), null);
  if(!winner){ updSrcChip(); toast('Servidor indisponível no momento','warn'); return; }
  ST.active=winner;
  localStorage.setItem('nf_srcIdx',String(ST.sources.indexOf(winner)));
  toast(`Conectado ao Servidor ${ST.sources.indexOf(winner)+1}`,'ok');
  updSrcChip();
  await loadCatalog(); saveCatCache();
  if(!ST.q) renderHome(); updLibCnt();
}

async function loadCatalog(){
  // Caminho 1: API (leve). Se o painel bloquear a API, cai para o M3U completo.
  if(ST.active.mode!=='m3u'){
    try{
      const mv=await fetchSmart(api(ST.active,'&action=get_vod_streams'),
        {timeout:40000,asJson:true,onProgress:(got,total)=>{
          const p=total?got/total:Math.min(1,got/6e6);
          bootProg(46+26*p,'Baixando catálogo de filmes…',fmtMB(got)+(total?' de '+fmtMB(total):''));
        }});
      ST.movies=(Array.isArray(mv)?mv:[]).map(m=>({
        key:'mv'+m.stream_id, id:m.stream_id, name:m.name||'', nameN:norm(m.name||''),
        icon:m.stream_icon||'', ext:m.container_extension||'mp4', type:'movie'
      }));
      bootProg(74,`${ST.movies.length.toLocaleString('pt-BR')} filmes carregados`);
      const sr=await fetchSmart(api(ST.active,'&action=get_series'),
        {timeout:40000,asJson:true,onProgress:(got,total)=>{
          const p=total?got/total:Math.min(1,got/3e6);
          bootProg(74+22*p,'Baixando catálogo de séries…',fmtMB(got)+(total?' de '+fmtMB(total):''));
        }});
      ST.series=(Array.isArray(sr)?sr:[]).map(s=>({
        key:'sr'+s.series_id, id:s.series_id, name:s.name||'', nameN:norm(s.name||''),
        icon:s.cover||'', type:'series'
      }));
      bootProg(96,`${ST.series.length.toLocaleString('pt-BR')} séries carregadas`);
      if(ST.movies.length||ST.series.length) return;
    }catch(e){ /* API bloqueada → M3U */ }
  }
  // Caminho 2: M3U completo (o mesmo link distribuído — sempre existe)
  try{
    bootProg(48,'Baixando catálogo completo…');
    const txt=await fetchSmart(m3uUrl(ST.active),
      {timeout:120000,onProgress:(got,total)=>{
        const p=total?got/total:Math.min(1,got/2.5e7);
        bootProg(48+38*p,'Baixando catálogo completo…',fmtMB(got)+(total?' de '+fmtMB(total):''));
      }});
    bootProg(88,'Organizando filmes e séries…');
    await new Promise(r=>setTimeout(r,30)); // deixa a barra pintar antes do parse pesado
    buildFromM3U(txt);
    bootProg(96,`${ST.movies.length.toLocaleString('pt-BR')} filmes · ${ST.series.length.toLocaleString('pt-BR')} séries`);
  }catch(e){ toast('Falha ao carregar o catálogo: '+(e.message||'rede'),'err'); }
}

/* ─── Parser do M3U: extrai filmes e séries (agrupadas), ignora canais ao vivo ─── */
function epInfo(n){
  n=n||''; let s=0,e=0,m;
  m=n.match(/\bS(\d{1,2})\s*[.\-_ ]*E?P?\.?\s*(\d{1,4})\b/i)
   ||n.match(/\b(\d{1,2})x(\d{1,4})\b/)
   ||n.match(/\bT(?:emp(?:orada)?)?\.?\s*(\d{1,2})\b[^\d]{0,8}E?P?\.?\s*(\d{1,4})\b/i);
  if(m){s=+m[1];e=+m[2];}
  else{ m=n.match(/\bEP?\.?\s*(\d{1,4})\b/i)||n.match(/\bepis[oó]dio\s*(\d{1,4})/i); if(m){s=1;e=+m[1];} }
  let base=n.replace(/\bS\d{1,2}\s*[.\-_ ]*E?P?\.?\s*\d{1,4}\b.*$/i,'')
    .replace(/\b\d{1,2}x\d{1,4}\b.*$/,'')
    .replace(/\bT(?:emp(?:orada)?)?\.?\s*\d{1,2}\b.*$/i,'')
    .replace(/\bEP?\.?\s*\d{1,4}\b.*$/i,'')
    .replace(/\bepis[oó]dio\s*\d{1,4}.*$/i,'')
    .replace(/[\s\-–—:|.]+$/,'').trim();
  return {s:s||1, e:e||0, base:base||n};
}

function buildFromM3U(txt){
  const lines=txt.split(/\r?\n/);
  const movies=[], serMap=new Map();
  let name='',logo='';
  for(let i=0;i<lines.length;i++){
    const L=lines[i];
    if(L.startsWith('#EXTINF')){
      const rL=L.match(/tvg-logo=(?:"([^"]*)"|'([^']*)'|(\S+))/i);
      logo=rL?(rL[1]||rL[2]||rL[3]||'').trim():'';
      const c=L.lastIndexOf(','); name=c>=0?L.slice(c+1).trim():'';
    } else if(L.startsWith('http')){
      const url=L.trim();
      if(/\/movie\//i.test(url)){
        movies.push({key:'m3u'+movies.length, name, nameN:norm(name), icon:logo, url, type:'movie'});
      } else if(/\/series\//i.test(url)){
        const {s,e,base}=epInfo(name);
        const k=norm(base);
        if(!serMap.has(k)) serMap.set(k,{key:'grp'+serMap.size, name:base, nameN:norm(base), icon:logo, type:'series', eps:[]});
        const g=serMap.get(k);
        if(!g.icon&&logo)g.icon=logo;
        g.eps.push({name, url, icon:logo, s, e});
      }
      name='';logo='';
    }
  }
  serMap.forEach(g=>g.eps.sort((a,b)=>a.s-b.s||a.e-b.e));
  ST.movies=movies;
  ST.series=[...serMap.values()];
}

function finishBoot(){
  G('boot').classList.add('off');
  updSrcChip(); renderHome(); updLibCnt();
  if(!ST.movies.length && !ST.series.length) toast('O servidor conectou mas o catálogo veio vazio','warn');
  Monet.resume(); // app reaberto após o anúncio: retoma a ação pendente
}

function updSrcChip(){
  const c=G('srcChip');
  c.className='src-chip '+(ST.active?'ok':'bad');
  const i=ST.sources.indexOf(ST.active);
  G('srcChipTx').textContent = ST.active ? `Servidor ${i+1}` : 'sem servidor';
}

/* ═══ Lista curada (lista.txt): títulos p/ Recomendados + plataformas como categorias ═══ */
/* Formato do lista.txt:
     NETFLIX                       ← plataforma
     ------------------------      ← separador (ignorado)
     >>> AÇÃO E AVENTURA           ← categoria
     * Título PT (Alt Title, 2025) - Dir. Fulano   ← conteúdo
       Sinopse em linha indentada…                  ← descrição        */
function parseCurated(txt){
  const plats=[]; let curPlat=null, curCat=null, lastItem=null;
  const flat=[];
  const platOf=l=>{
    const n=norm(l);
    if(!n||n.length<2||n.split(' ').length>4) return null;
    return PLATFORM_WORDS.find(p=>n===p||n===p+' plus'||n.replace(/ plus$/,'')===p)?l:null;
  };
  txt.split(/\r?\n/).forEach(raw=>{
    if(/^[=\-_#\s]{4,}$/.test(raw)) return;
    const indented=/^\s{2,}\S/.test(raw) && !/^\s*[*>]/.test(raw);
    const l=raw.trim();
    if(!l||/^https?:/i.test(l)) return;
    if(/^>{2,}/.test(l)){
      const name=l.replace(/^>+\s*/,'').trim();
      if(!name) return;
      if(!curPlat){ curPlat={name:'Destaques',cats:[]}; plats.push(curPlat); }
      curCat={name, items:[]};
      curPlat.cats.push(curCat); lastItem=null; return;
    }
    if(/^\*/.test(l)){
      let body=l.replace(/^\*\s*/,'').replace(/\s*-\s*Dir\..*$/i,'').trim();
      let alt='', year='';
      const par=body.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
      let title=body;
      if(par){ title=par[1].trim();
        const inside=par[2].split(',').map(x=>x.trim());
        const y=inside.find(x=>/^\d{4}$/.test(x));
        year=y||''; alt=inside.filter(x=>x!==y).join(', '); }
      if(!title) return;
      lastItem={t:title, alt, year, desc:'', cat:curCat?.name||'', plat:curPlat?.name||''};
      if(!curPlat){ curPlat={name:'Destaques',cats:[]}; plats.push(curPlat); }
      if(!curCat){ curCat={name:'Destaques',items:[]}; curPlat.cats.push(curCat); }
      curCat.items.push(lastItem); flat.push(lastItem); return;
    }
    if(indented && lastItem && !lastItem.desc){ lastItem.desc=l; return; }
    const p=platOf(l.replace(/[:=]+$/,''));
    if(p){ curPlat={name:l.replace(/[:=]+$/,'').trim(), cats:[]}; plats.push(curPlat); curCat=null; lastItem=null; return; }
    const headers=['categoria','categorias','recomendado','recomendados','plataforma','plataformas','filmes','series','destaque','destaques'];
    if(!headers.includes(norm(l)) && norm(l).length>2 && !curPlat){
      flat.push({t:l, alt:'', year:'', desc:'', cat:'', plat:''});
    }
  });
  return {plats, flat};
}
function __old_parseCurated(txt){
  const cats=[], recos=[], seenC=new Set(), seenR=new Set();
  txt.split(/\r?\n/).forEach(raw=>{
    const l=raw.replace(/^[\s\-\*\d\.\)>#•:=]+/,'').replace(/[:=\s]+$/,'').trim();
    if(!l || /^https?:/i.test(l)) return;
    // ignora cabeçalhos decorativos do arquivo (===, ---, "CATEGORIAS", "RECOMENDADOS", etc.)
    if(/^[=\-_*#\s]+$/.test(raw)) return;
    const headers=['categoria','categorias','recomendado','recomendados','recomendacoes','plataforma','plataformas','filmes','series','conteudo','conteudos','lista','listas','streaming','streamings','destaque','destaques'];
    const n=norm(l);
    if(n.length<2) return;
    if(headers.includes(n)) return;
    const isPlat = PLATFORM_WORDS.includes(n) || (n.split(' ').length<=3 && PLATFORM_WORDS.some(p=>n===p||n===p+' plus'||n.replace(/ plus$/,'')===p));
    if(isPlat){ if(!seenC.has(n)){seenC.add(n);cats.push(l);} }
    else if(!seenR.has(n)){ seenR.add(n); recos.push(l); }
  });
  return {cats, recos};
}

async function loadCurated(){
  // cache instantâneo + atualização em segundo plano
  const cached=localStorage.getItem('nf_curated');
  if(cached){ try{ ST.curated=JSON.parse(cached); }catch{} }
  applyCurated();
  try{
    const txt=await fetchSmart(CURATED_URL,{timeout:14000});
    ST.curated=parseCurated(txt);
    localStorage.setItem('nf_curated',JSON.stringify(ST.curated));
    applyCurated();
  }catch{}
}

function applyCurated(){
  const row=G('platRow');
  const plats=ST.curated?.plats||[];
  row.style.display=plats.length?'flex':'none';
  row.innerHTML='';
  plats.forEach(p=>{
    const b=document.createElement('button');
    b.className='plat';
    b.innerHTML=platIconHTML(p.name)+esc(p.name);
    b.onclick=()=>{
      const already=ST.plat===p.name;
      ST.plat=already?null:p.name;
      $$('.plat').forEach(x=>x.classList.toggle('on',!already&&x===b));
      renderHome();
    };
    row.appendChild(b);
  });
  if(!ST.q) renderHome();
}

/* ─── Casamento curadoria ↔ catálogo (com cache): PT → alternativo → fuzzy ─── */
const _matchCache=new Map();
function matchCatalog(ci){
  const all=[...ST.movies,...ST.series];
  if(!all.length) return null;                 // catálogo ainda não chegou: NÃO cachear o "não"
  const ck=ci.t+'|'+ci.alt;
  if(_matchCache.has(ck)) return _matchCache.get(ck);
  const nk=norm(ci.t), ak=ci.alt?norm(ci.alt):null;
  let hit=all.find(it=>it.nameN===nk)||(ak?all.find(it=>it.nameN===ak):null)||null;
  if(!hit){
    const qW=nk.split(' ').filter(w=>w.length>1); let bs=0;
    for(const it of all){ const sc=fuzzyScore(it.nameN,nk,qW); if(sc>bs){bs=sc;hit=it;} }
    if(bs<72&&ak){ const aW=ak.split(' ').filter(w=>w.length>1); bs=0; let h2=null;
      for(const it of all){ const sc=fuzzyScore(it.nameN,ak,aW); if(sc>bs){bs=sc;h2=it;} }
      hit=bs>=72?h2:null; }
    else if(bs<72) hit=null;
  }
  _matchCache.set(ck,hit);
  return hit;
}

/* Recomendados: casa os nomes curados com o catálogo atual (exato → fuzzy) */
function curatedPicks(){
  const flat=ST.curated?.flat||[];
  if(!flat.length) return null;
  const out=[], used=new Set();
  for(const ci of flat){
    const hit=matchCatalog(ci);
    if(hit && !used.has(hit.key)){ used.add(hit.key); out.push(hit); }
    if(out.length>=24) break;
  }
  return out.length?out:null;
}

/* ═══ HOME: recomendados + resultados ═══ */
function mulberry(seed){ return ()=>{ seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed);
  t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

function renderHome(){
  const platView=G('platView'), reco=G('homeReco'), hero=G('hero');
  if(ST.plat){
    reco.style.display='none'; hero.style.display='none'; platView.style.display='block';
    renderPlatform(ST.plat);
  } else {
    platView.style.display='none'; reco.style.display='block';
    renderHero(); renderReco();
  }
}

const capCase=s=>s.toLowerCase().replace(/(^|\s)\S/g,c=>c.toUpperCase());

/* Visão da plataforma: conteúdos do arquivo, por categoria (Ação, Comédia…) */
function renderPlatform(name){
  const p=(ST.curated?.plats||[]).find(x=>x.name===name);
  const box=G('platView'); box.innerHTML='';
  if(!p||!p.cats.length){ box.innerHTML=emptyH('film','Sem categorias','O arquivo não trouxe conteúdos desta plataforma.'); return; }
  p.cats.forEach(cat=>{
    if(!cat.items.length) return;
    const rail=document.createElement('div'); rail.className='rail';
    const row=document.createElement('div'); row.className='rail-row';
    let matched=0;
    cat.items.forEach(ci=>{
      const hit=matchCatalog(ci);
      if(hit){ const c=mkCard(hit); c.classList.add('sm'); row.appendChild(c); matched++; }
      else row.appendChild(mkGhostCard(ci));
    });
    rail.innerHTML=`<div class="rail-hd"><i class="fas fa-tag"></i>${esc(capCase(cat.name))}<span class="n">${matched}/${cat.items.length} no servidor</span></div>`;
    rail.appendChild(row);
    box.appendChild(rail);
  });
}

function mkGhostCard(ci){
  const el=document.createElement('div'); el.className='card sm ghost';
  el.innerHTML=`<div class="cov"><div class="np"><i class="fas fa-hourglass-half"></i><span>${esc(ci.t)}</span></div></div>
    <div class="card-nm">${esc(ci.t)}${ci.year?' ('+ci.year+')':''}</div>`;
  el.onclick=()=>toast('Este título ainda não está no servidor atual','warn');
  return el;
}

/* ─── Slide de destaques no topo (adaptável, auto-avanço) ─── */
let _heroT=null;
function renderHero(){
  const hero=G('hero');
  const flat=ST.curated?.flat||[];
  const picks=[];
  for(const ci of flat){ const hit=matchCatalog(ci); if(hit&&hit.icon){ picks.push({hit,ci}); if(picks.length>=6)break; } }
  if(!picks.length){ hero.style.display='none'; return; }
  hero.style.display='block';
  const track=G('heroTrack');
  track.innerHTML=picks.map(({hit,ci},i)=>`
    <div class="hero-sl" data-i="${i}">
      <div class="hero-bg">${nfImg(hit.icon,'')}</div>
      <div class="hero-ov"></div>
      <div class="hero-info">
        <div class="hero-tt">${esc(hit.name)}</div>
        <div class="hero-mt">${ci.year?ci.year+' · ':''}${esc(capCase(ci.cat||''))}${ci.plat?' · '+esc(ci.plat):''}</div>
        <button class="hero-btn"><i class="fas fa-play"></i> Assistir</button>
      </div>
    </div>`).join('');
  G('heroDots').innerHTML=picks.map((_,i)=>`<span class="hd${i===0?' on':''}"></span>`).join('');
  [...track.children].forEach((sl,i)=>{
    sl.querySelector('.hero-btn').onclick=e=>{ e.stopPropagation(); openDetail(picks[i].hit); };
    sl.onclick=()=>openDetail(picks[i].hit);
  });
  const dots=()=>{ const i=Math.round(track.scrollLeft/Math.max(1,track.clientWidth));
    $$('#heroDots .hd').forEach((d,j)=>d.classList.toggle('on',j===i)); };
  track.onscroll=dots;
  clearInterval(_heroT); let hold=false;
  track.ontouchstart=()=>hold=true; track.ontouchend=()=>setTimeout(()=>hold=false,4000);
  _heroT=setInterval(()=>{ if(hold||ST.q||ST.plat||ST.page!=='home')return;
    const i=Math.round(track.scrollLeft/Math.max(1,track.clientWidth));
    track.scrollTo({left:((i+1)%picks.length)*track.clientWidth, behavior:'smooth'});
  },5000);
}

function renderReco(){
  const all=[...ST.movies,...ST.series];
  const grid=G('recoGrid'); grid.innerHTML='';
  if(!all.length){ grid.innerHTML=emptyH('film','Catálogo vazio','O servidor conectado não retornou conteúdo. Troque de servidor no seletor acima.'); G('recoN').textContent=''; return; }
  // 1º: seleção curada por nome (lista.txt); 2º: sorteio diário como reserva
  let picks=curatedPicks();
  if(!picks){
    const rnd=mulberry(new Date().toDateString().split('').reduce((a,c)=>a+c.charCodeAt(0),0));
    const idx=new Set();
    while(idx.size<Math.min(21,all.length)) idx.add(~~(rnd()*all.length));
    picks=[...idx].map(i=>all[i]);
  }
  const frag=document.createDocumentFragment();
  picks.forEach(it=>frag.appendChild(mkCard(it)));
  grid.appendChild(frag);
  G('recoN').textContent=`${all.length.toLocaleString('pt-BR')} títulos`;
}

let _srchT=null;
function doSearch(q){
  ST.q=norm(q);
  G('srchBox').classList.toggle('has',!!q);
  const showRes=!!ST.q;
  G('homeRes').style.display=showRes?'block':'none';
  if(showRes){ G('homeReco').style.display='none'; G('hero').style.display='none'; G('platView').style.display='none'; }
  else { renderHome(); return; }
  const qN=ST.q, qWords=qN.split(' ').filter(w=>w.length>1);
  const scored=[];
  for(const it of [...ST.movies,...ST.series]){
    const sc=fuzzyScore(it.nameN,qN,qWords.length?qWords:[qN]);
    if(sc>0) scored.push([sc,it]);
  }
  scored.sort((a,b)=>b[0]-a[0]);
  const res=scored.slice(0,60).map(x=>x[1]);
  const grid=G('resGrid'); grid.innerHTML='';
  G('resN').textContent=res.length?`${scored.length} encontrados`:'';
  if(!res.length){ grid.innerHTML=emptyH('magnifying-glass','Nada encontrado',`Nenhum título parecido com "${esc(q)}". Tente menos palavras.`); return; }
  const frag=document.createDocumentFragment();
  res.forEach(it=>frag.appendChild(mkCard(it)));
  grid.appendChild(frag);
}

function emptyH(ic,t,p){ return `<div class="empty" style="grid-column:1/-1"><i class="fas fa-${ic}"></i><h3>${t}</h3><p>${p}</p></div>`; }

/* ═══ Imagens: direto → proxy wsrv → allorigins → placeholder ═══ */
const PAGE_HTTPS=location.protocol==='https:';
function imgChain(o){ const c=[]; if(!(PAGE_HTTPS&&/^http:/i.test(o))) c.push(o);
  c.push('https://wsrv.nl/?url='+encodeURIComponent(o)+'&w=360&fit=inside');
  c.push('https://api.allorigins.win/raw?url='+encodeURIComponent(o)); return c; }
function nfImg(icon, fb){
  if(!icon||!/^https?:/i.test(icon)) return fb;
  const c=imgChain(icon);
  return `<img src="${esc(c[0])}" data-orig="${esc(icon)}" data-try="0" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onload="if(this.naturalWidth)this.dataset.ok='1'" onerror="nfImgErr(this)" data-fb="${esc(btoa(unescape(encodeURIComponent(fb))))}">`;
}
window.nfImgErr=function(img){
  const c=imgChain(img.dataset.orig), n=+img.dataset.try+1;
  if(n<c.length){ img.dataset.try=String(n); img.src=c[n]; }
  else{ try{ img.parentElement.innerHTML=decodeURIComponent(escape(atob(img.dataset.fb))); }catch{ img.remove(); } }
};
setInterval(()=>{ // varredor de imagens penduradas (hosts que nunca respondem)
  const vh=innerHeight+600, now=Date.now();
  document.querySelectorAll('img[data-orig]:not([data-ok])').forEach(img=>{
    if(img.complete&&img.naturalWidth>0){ img.dataset.ok='1'; return; }
    const r=img.getBoundingClientRect();
    if(r.bottom<-600||r.top>vh) return;
    if(!img.dataset.t0){ img.dataset.t0=now; return; }
    if(now-(+img.dataset.t0)>8000){ img.dataset.t0=now; nfImgErr(img); }
  });
},3000);

/* ═══ Cards ═══ */
function progressOf(keyOrName, name){
  const nk = name!==undefined ? norm(name) : null;
  const h = ST.history.find(x=>x.key===keyOrName || (nk&&x.nkey===nk) || x.nkey===keyOrName);
  return (h?.pos>10&&h?.dur)?Math.min(100,h.pos/h.dur*100):0;
}
function mkCard(it){
  const el=document.createElement('div'); el.className='card';
  const pct=it.type==='movie'?progressOf(it.key,it.name):0;
  el.innerHTML=`<div class="cov">
      <span class="tbadge ${it.type==='movie'?'mv':'sr'}">${it.type==='movie'?'FILME':'SÉRIE'}</span>
      ${nfImg(it.icon,`<div class="np"><i class="fas fa-${it.type==='movie'?'film':'tv'}"></i><span>${esc(it.name)}</span></div>`)}
      ${pct?`<div class="pb"><div class="f" style="width:${pct.toFixed(1)}%"></div></div>`:''}
    </div>
    <div class="card-nm">${esc(it.name)}</div>`;
  el.onclick=()=>openDetail(it);
  return el;
}

/* ═══ DETALHE: capa + Assistir / Salvar / Baixar ═══ */
const movieUrl=it=>it.url || `${ST.active.base}/movie/${ST.active.user}/${ST.active.pass}/${it.id}.${it.ext}`;
const epUrl=ep=>`${ST.active.base}/series/${ST.active.user}/${ST.active.pass}/${ep.id}.${ep.ext}`;

function openDetail(it){
  const h=ST.history.find(x=>x.key===it.key);
  const saved=ST.saved.some(x=>x.key===it.key);
  G('detTtl').textContent=it.name;
  const body=G('detBody');
  body.innerHTML=`
    <div class="det">
      <div class="det-cov">${nfImg(it.icon,`<div class="np"><i class="fas fa-${it.type==='movie'?'film':'tv'}"></i></div>`)}</div>
      <div class="det-info">
        <div class="det-nm">${esc(it.name)}</div>
        <div class="det-meta"><span>${it.type==='movie'?'Filme':'Série'}</span>${it.type==='movie'&&it.ext?`<span>.${esc(it.ext)}</span>`:''}${it.eps?`<span>${it.eps.length} eps</span>`:''}</div>
        ${it.type==='movie'&&h?.pos>10&&h?.dur?`<div class="det-resume"><i class="fas fa-clock-rotate-left"></i> Continuar de ${fmtT(h.pos)}</div>`:''}
      </div>
    </div>
    ${it.type==='movie'?`
    <div class="act-row">
      <button class="act watch" id="aWatch"><i class="fas fa-play"></i>Assistir</button>
      <button class="act save ${saved?'on':''}" id="aSave"><i class="fas fa-bookmark"></i>${saved?'Salvo':'Salvar'}</button>
      <button class="act dl" id="aDl"><i class="fas fa-download"></i>Baixar</button>
    </div>`:`
    <div class="act-row" style="grid-template-columns:1fr">
      <button class="act save ${saved?'on':''}" id="aSave" style="flex-direction:row"><i class="fas fa-bookmark"></i>${saved?'Salvo na biblioteca':'Salvar na biblioteca'}</button>
    </div>
    <div class="seas" id="detSeas"></div>
    <div id="detEps"><div class="eps-load"><div class="spin"></div>Carregando episódios…</div></div>`}
  `;
  openModal('mDet');
  G('aSave').onclick=()=>toggleSave(it,G('aSave'));
  if(it.type==='movie'){
    G('aWatch').onclick=()=>{
      const item={key:it.key,name:it.name,icon:it.icon,url:movieUrl(it),type:'movie'};
      // Porteiro da monetização: se o anúncio abrir, o filme toca sozinho na volta
      if(Monet.gate('watch',{item})) openServerSheet(item);
    };
    G('aDl').onclick=()=>startDownload({key:it.key,name:it.name,icon:it.icon,url:movieUrl(it)});
  } else if(it.eps) renderLocalEps(it);   // série vinda do M3U (episódios já em memória)
  else loadEpisodes(it);                  // série vinda da API
}

async function loadEpisodes(it){
  let info;
  try{ info=await fetchSmart(api(ST.active,'&action=get_series_info&series_id='+it.id),{timeout:15000,asJson:true}); }
  catch{ G('detEps').innerHTML=emptyH('plug-circle-xmark','Falha ao carregar','Não consegui buscar os episódios agora. Feche e tente de novo.'); return; }
  const eps=info?.episodes||{};
  const seasons=Object.keys(eps).sort((a,b)=>+a-+b);
  if(!seasons.length){ G('detEps').innerHTML=emptyH('tv','Sem episódios','A lista não retornou episódios para esta série.'); return; }
  const bar=G('detSeas');
  bar.innerHTML='';
  seasons.forEach((s,i)=>{
    const b=document.createElement('button'); b.className='chip'+(i===0?' on':'');
    b.textContent='Temporada '+s;
    b.onclick=()=>{ $$('#detSeas .chip').forEach(x=>x.classList.remove('on')); b.classList.add('on'); renderEps(it,eps,s); };
    bar.appendChild(b);
  });
  renderEps(it,eps,seasons[0]);
  it._eps=eps; // p/ next/prev no player
}

function epObj(it,e){ return {key:'ep'+e.id, id:e.id, ext:e.container_extension||'mp4',
  name:`${it.name} — T${e.season||''} E${e.episode_num} ${e.title&&e.title!==it.name?('· '+e.title):''}`.trim(), icon:it.icon}; }

function renderEps(it,eps,season){
  const list=G('detEps'); list.innerHTML='';
  const all=Object.values(eps).flat().map(e=>epObj(it,e));
  (eps[season]||[]).forEach(e=>{
    const ep=epObj(it,e);
    const pct=progressOf(ep.key);
    const row=document.createElement('div'); row.className='ep';
    row.innerHTML=`<span class="ep-n">E${String(e.episode_num).padStart(2,'0')}</span>
      <div class="ep-i"><div class="ep-nm">${esc(e.title||('Episódio '+e.episode_num))}</div>
      ${pct?`<div class="ep-pb"><div class="f" style="width:${pct.toFixed(1)}%"></div></div>`:''}</div>
      <button class="ep-dl" title="Baixar episódio"><i class="fas fa-download"></i></button>`;
    row.onclick=ev=>{
      if(ev.target.closest('.ep-dl')) return;
      closeModal('mDet');
      const item={key:ep.key,name:ep.name,icon:it.icon,url:epUrl(ep),type:'episode'};
      const lst=all.map(x=>({key:x.key,name:x.name,icon:it.icon,url:epUrl(x),type:'episode'}));
      // Porteiro da monetização: episódio pendente volta tocando sozinho
      if(Monet.gate('watch',{item,list:lst})) playItem(item,lst);
    };
    row.querySelector('.ep-dl').onclick=ev=>{ ev.stopPropagation(); startDownload({key:ep.key,name:ep.name,icon:it.icon,url:epUrl(ep)}); };
    list.appendChild(row);
  });
}

/* Série do modo M3U: temporadas/episódios já estão em memória */
function renderLocalEps(it){
  const seasons=[...new Set(it.eps.map(x=>x.s))].sort((a,b)=>a-b);
  const bar=G('detSeas'); bar.innerHTML='';
  bar.style.display=seasons.length>1?'flex':'none';
  seasons.forEach((s,i)=>{
    const b=document.createElement('button'); b.className='chip'+(i===0?' on':'');
    b.textContent='Temporada '+s;
    b.onclick=()=>{ $$('#detSeas .chip').forEach(x=>x.classList.remove('on')); b.classList.add('on'); drawLocalEps(it,s); };
    bar.appendChild(b);
  });
  drawLocalEps(it,seasons[0]);
}
function drawLocalEps(it,season){
  const list=G('detEps'); list.innerHTML='';
  const all=it.eps.map((x,i)=>({key:'lep'+it.key+'_'+i, name:x.name, icon:x.icon||it.icon, url:x.url, type:'episode'}));
  it.eps.forEach((x,i)=>{
    if(x.s!==season)return;
    const ep=all[i], pct=progressOf(ep.key);
    const row=document.createElement('div'); row.className='ep';
    row.innerHTML=`<span class="ep-n">${x.e?'E'+String(x.e).padStart(2,'0'):'<i class="fas fa-play" style="font-size:.6rem"></i>'}</span>
      <div class="ep-i"><div class="ep-nm">${esc(x.name)}</div>
      ${pct?`<div class="ep-pb"><div class="f" style="width:${pct.toFixed(1)}%"></div></div>`:''}</div>
      <button class="ep-dl" title="Baixar episódio"><i class="fas fa-download"></i></button>`;
    row.onclick=ev=>{ if(ev.target.closest('.ep-dl'))return; closeModal('mDet');
      // Porteiro da monetização: episódio pendente volta tocando sozinho
      if(Monet.gate('watch',{item:ep,list:all})) playItem(ep, all); };
    row.querySelector('.ep-dl').onclick=ev=>{ ev.stopPropagation(); startDownload(ep); };
    list.appendChild(row);
  });
}

/* ═══ Salvar / Baixar ═══ */
function toggleSave(it,btn){
  const i=ST.saved.findIndex(x=>x.key===it.key);
  if(i>=0){ ST.saved.splice(i,1); btn.classList.remove('on'); btn.innerHTML='<i class="fas fa-bookmark"></i>Salvar'; toast('Removido dos salvos'); }
  else{ ST.saved.unshift({key:it.key,nkey:norm(it.name),name:it.name,icon:it.icon,type:it.type,ts:Date.now()}); btn.classList.add('on'); btn.innerHTML='<i class="fas fa-bookmark"></i>Salvo'; toast('Salvo na biblioteca','ok'); }
  saveLS(); updLibCnt(); if(ST.page==='lib') renderLib();
}

/* skipGate=true é usado apenas pela retomada pós-anúncio (Monet.resume) */
function startDownload(d, skipGate=false){
  d.nkey=d.nkey||norm(d.name);
  // Porteiro da monetização: se o anúncio abrir, o download inicia sozinho na volta
  if(!skipGate && !Monet.gate('download',{item:{key:d.key,nkey:d.nkey,name:d.name,icon:d.icon,url:d.url}})) return;
  if(!ST.dls.some(x=>x.nkey===d.nkey)) ST.dls.unshift({...d,ts:Date.now(),status:'ini'});
  else ST.dls.find(x=>x.key===d.key).ts=Date.now();
  saveLS(); updLibCnt();
  const a=document.createElement('a');
  a.href=d.url; a.download=d.name.replace(/[\\/:*?"<>|]/g,' ').trim()||'video';
  document.body.appendChild(a); a.click(); a.remove();
  toast('Download iniciado — acompanhe na notificação','ok');
  if(!ST.tutSeen){ ST.tutSeen=true; localStorage.setItem('nf_tut','1'); setTimeout(()=>openModal('mTut'),600); }
}

/* ═══ BIBLIOTECA ═══ */
function updLibCnt(){ const n=ST.dls.length; const c=G('libCnt'); c.style.display=n?'flex':'none'; c.textContent=n; }
function renderLib(){
  const box=G('libList'); box.innerHTML='';
  let items,mode=ST.lib;
  if(mode==='dl') items=ST.dls;
  else if(mode==='hist') items=ST.history;
  else items=ST.saved;
  if(!items.length){
    const map={dl:['download','Nenhum download','Toque em Baixar em qualquer filme ou episódio — ele aparecerá aqui.'],
      hist:['clock-rotate-left','Nada assistido ainda','O que você assistir aparece aqui, com opção de continuar de onde parou.'],
      saved:['bookmark','Nada salvo','Use o botão Salvar nos títulos para guardá-los aqui.']};
    box.innerHTML=emptyH(...map[mode]); return;
  }
  items.forEach(it=>{
    const pct=(it.pos>10&&it.dur)?Math.min(100,it.pos/it.dur*100):0;
    const row=document.createElement('div'); row.className='lib-row';
    row.innerHTML=`<div class="lib-cov">${nfImg(it.icon,'<div class="np"><i class="fas fa-film"></i></div>')}</div>
      <div class="lib-info">
        <div class="lib-nm">${esc(it.name)}</div>
        <div class="lib-meta">${new Date(it.ts).toLocaleDateString('pt-BR')}${pct?` · ${fmtT(it.pos)} assistidos`:''}</div>
        ${mode==='dl'?`<span class="st-tag ${it.status==='done'?'done':'ini'}">${it.status==='done'?'CONCLUÍDO ✓':'INICIADO'}</span>`:''}
        ${pct?`<div class="lib-pb"><div class="f" style="width:${pct.toFixed(1)}%"></div></div>`:''}
      </div>
      <div class="lib-acts">
        ${mode==='dl'?`<button class="lib-btn dl" title="${it.status==='done'?'Marcar como não concluído':'Marcar como concluído'}"><i class="fas fa-check"></i></button>`:''}
        ${it.url?'<button class="lib-btn pl" title="Assistir"><i class="fas fa-play"></i></button>':''}
        <button class="lib-btn del" title="Remover"><i class="fas fa-trash"></i></button>
      </div>`;
    row.querySelector('.pl')&&(row.querySelector('.pl').onclick=e=>{e.stopPropagation();playFromLib(it);});
    row.querySelector('.del').onclick=e=>{
      e.stopPropagation();
      const arr=mode==='dl'?ST.dls:mode==='hist'?ST.history:ST.saved;
      const i=arr.findIndex(x=>x.key===it.key); if(i>=0)arr.splice(i,1);
      saveLS(); updLibCnt(); renderLib();
    };
    const chk=row.querySelector('.lib-btn.dl');
    chk&&(chk.onclick=e=>{ e.stopPropagation(); it.status=it.status==='done'?'ini':'done'; saveLS(); renderLib(); });
    row.onclick=()=>playFromLib(it);
    box.appendChild(row);
  });
}

/* ═══ Seletor de servidores para o MESMO filme ═══ */
function openServerSheet(item){
  const nk=item.nkey||norm(item.name);
  G('svTtl').textContent=item.name;
  const box=G('svList');
  box.innerHTML='<div class="eps-load"><div class="spin"></div>Procurando servidores com este título…</div>';
  openModal('mServers');
  const results=[]; // {idx, s, url}
  // servidor ativo primeiro (URL já resolvida)
  results.push({idx:ST.sources.indexOf(ST.active)+1, s:ST.active, url:item.url, ready:true});
  renderServerSheet(item, results);
  // demais servidores: detecta o título por nome (em paralelo)
  const others=ST.sources.filter(s=>s!==ST.active);
  let pending=others.length;
  if(!pending){ finalizeSheet(item,results); return; }
  others.forEach(async s=>{
    let url=null;
    try{
      if(s.status!=='ok') await testDual(s);
      if(s.base===ST.active.base && /\/(movie|series)\//.test(item.url||'')){
        url=swapCreds(item.url,s);
      } else {
        const cat=await sourceCatalog(s);
        if(cat){ let hit=cat.movies.find(m=>m.nameN===nk);
          if(!hit){ const qW=nk.split(' ').filter(w=>w.length>1); let bs=0;
            for(const m of cat.movies){ const sc=fuzzyScore(m.nameN,nk,qW); if(sc>bs){bs=sc;hit=m;} } if(bs<72)hit=null; }
          if(hit) url=`${s.base}/movie/${encodeURIComponent(s.user)}/${encodeURIComponent(s.pass)}/${hit.id}.${hit.ext}`;
        }
      }
    }catch{}
    if(url) results.push({idx:ST.sources.indexOf(s)+1, s, url});
    if(--pending===0) finalizeSheet(item,results);
    else renderServerSheet(item,results);
  });
}
function finalizeSheet(item,results){
  results.sort((a,b)=>a.idx-b.idx);
  renderServerSheet(item,results,true);
}
function renderServerSheet(item,results,done=false){
  results.sort((a,b)=>a.idx-b.idx);
  const box=G('svList');
  box.innerHTML=results.map((r,i)=>`
    <button class="sv-opt" data-i="${i}">
      <span class="sv-ic"><i class="fas fa-circle-play"></i></span>
      <span class="sv-tx"><b>Servidor ${r.idx}</b><small>${r.ready?'disponível agora':'encontrado'}</small></span>
      <i class="fas fa-chevron-right"></i>
    </button>`).join('') +
    (done?'':'<div class="sv-scan"><div class="spin" style="width:20px;height:20px"></div>procurando mais servidores…</div>') +
    (done&&results.length===0?emptyH('server','Nenhum servidor','Este título não está disponível em nenhum servidor agora.'):'');
  $$('#svList .sv-opt').forEach(b=>b.onclick=()=>{
    closeModal('mServers');
    playItemFrom(item, results, results[+b.dataset.i]); // referência por índice; URL nunca vai ao DOM
  });
}
// toca começando por um servidor escolhido; failover usa os demais da folha
function playItemFrom(item, results, chosen){
  ST.active = chosen.s; localStorage.setItem('nf_srcIdx',String(ST.sources.indexOf(chosen.s)));
  updSrcChip();
  playItem({...item, url:chosen.url},[]);
  if(_fo) results.forEach(r=>{ if(r!==chosen) {/* deixados p/ tryNextServer via catálogo */} });
}

/* Tocar da biblioteca: redescobre o título na lista ativa pelo nome */
function playFromLib(it){
  const r=resolveByName(it.nkey, it.name);
  let item=null;
  if(r) item={...it, url:r.url, icon:it.icon||r.icon};
  else if(it.url) item={...it};              // catálogo atual não tem: tenta o URL guardado
  if(!item){ toast('Título não encontrado na lista atual','warn'); return; }
  // Porteiro da monetização: item da biblioteca volta tocando sozinho
  if(Monet.gate('watch',{item:{key:item.key,nkey:item.nkey,name:item.name,icon:item.icon,url:item.url,type:item.type||'movie'}}))
    playItem(item,[]);
}

/* ═══ PLAYER — engine com fallback, watchdog e buffer visível ═══ */
let hlsI=null, mpegtsI=null;
const HLS_OK=typeof Hls!=='undefined'&&Hls.isSupported();
const MPEGTS_OK=typeof mpegts!=='undefined'&&mpegts.isSupported();
let _wdT=null,_wdLast=-1,_wdStall=0,_wdReloads=0,_curStream=null,_playing=false;

let _fo=null; // estado do failover: {item, resumeAt, tried:Set}

function swapCreds(url, s){
  return url.replace(/\/(movie|series)\/[^/]+\/[^/]+\//, `/$1/${encodeURIComponent(s.user)}/${encodeURIComponent(s.pass)}/`);
}

async function sourceCatalog(s){ // catálogo enxuto de outro servidor (cacheado)
  if(s._cat) return s._cat;
  try{
    const mv=await fetchSmart(api(s,'&action=get_vod_streams'),{timeout:30000,asJson:true});
    s._cat={movies:(Array.isArray(mv)?mv:[]).map(m=>({nameN:norm(m.name||''), id:m.stream_id, ext:m.container_extension||'mp4'}))};
  }catch{ s._cat=null; }
  return s._cat;
}

async function tryNextServer(){
  if(!G('ply').classList.contains('on')){ _fo=null; return; }   // usuário saiu: aborta em silêncio
  if(!_fo) return finalFail();
  const others=ST.sources.filter(s=>s!==ST.active && !_fo.tried.has(s));
  others.sort((a,b)=>(b.status==='ok')-(a.status==='ok'));
  const total=ST.sources.length;
  for(const s of others){
    _fo.tried.add(s);
    const k=_fo.tried.size+1;
    G('plySpinTx').textContent=`Por favor aguarde… servidor ${Math.min(k,total)} de ${total}`;
    G('plySpin').classList.add('on');
    // servidor ainda não validado? testa rápido
    if(!G('ply').classList.contains('on')){ _fo=null; return; }
    if(s.status!=='ok'){ if(!await testDual(s)) continue; }
    let url=null;
    if(s.base===ST.active.base && /\/(movie|series)\//.test(_fo.item.url||'')){
      url=swapCreds(_fo.item.url, s);        // mesmo host: só troca as credenciais
    } else {
      const cat=await sourceCatalog(s);       // host diferente: detecta pelo nome
      if(cat){
        const nk=_fo.item.nkey||norm(_fo.item.name);
        let hit=cat.movies.find(m=>m.nameN===nk);
        if(!hit){ const qW=nk.split(' ').filter(w=>w.length>1); let bs=0;
          for(const m of cat.movies){ const sc=fuzzyScore(m.nameN,nk,qW); if(sc>bs){bs=sc;hit=m;} }
          if(bs<70) hit=null; }
        if(hit) url=`${s.base}/movie/${encodeURIComponent(s.user)}/${encodeURIComponent(s.pass)}/${hit.id}.${hit.ext}`;
      }
    }
    if(url){ loadStream(url, _fo.resumeAt, true); return; } // falhou de novo? giveUp → volta aqui
  }
  finalFail();
}
function finalFail(){
  const n=(_fo?_fo.tried.size:0)+1; _fo=null;
  G('plySpin').classList.remove('on');
  toast(`Não foi possível reproduzir este título em nenhum dos ${Math.max(n,1)} servidores`,'err');
}

function playItem(item, list){
  ST.cur=item; ST.curList=list; ST.curIdx=list.findIndex(x=>x.key===item.key);
  const prev=ST.history.find(h=>h.nkey===(item.nkey||norm(item.name)) || h.key===item.key);
  let resume=0;
  if(prev?.pos>10&&(!prev.dur||prev.pos<prev.dur*0.95)) resume=prev.pos;
  const nk=item.nkey||norm(item.name);
  ST.history=[{key:item.key,nkey:nk,name:item.name,icon:item.icon,type:item.type||'movie',url:item.url,pos:prev?.pos||0,dur:prev?.dur||0,ts:Date.now()},
    ...ST.history.filter(h=>h.nkey!==nk)].slice(0,80);
  saveLS();
  G('plyTtl').textContent=item.name;
  G('plySub').textContent=ST.curList.length?`${ST.curIdx+1} de ${ST.curList.length}`:'';
  G('plyPrev').style.visibility=G('plyNext').style.visibility=ST.curList.length>1?'visible':'hidden';
  G('ply').classList.add('on','ctrl');
  autoHide();
  _fo={item:{...item, nkey:item.nkey||norm(item.name)}, resumeAt:resume, tried:new Set()};
  if(resume) toast(`Continuando de ${fmtT(resume)}`,'ok');
  loadStream(item.url, resume, false);
}

function mkHls(onProbeFail){
  const h=new Hls({maxBufferLength:60,maxMaxBufferLength:120,backBufferLength:30,enableWorker:true,
    fragLoadingMaxRetry:6,manifestLoadingMaxRetry:2,levelLoadingMaxRetry:6,nudgeMaxRetry:8});
  let mErr=0; h._probing=true;
  h.on(Hls.Events.FRAG_BUFFERED,()=>{h._probing=false;mErr=0;});
  h.on(Hls.Events.ERROR,(_,d)=>{
    if(!d.fatal)return;
    if(h._probing){h._probing=false;onProbeFail?.();return;}
    if(d.type===Hls.ErrorTypes.NETWORK_ERROR) setTimeout(()=>{try{h.startLoad()}catch{}},800);
    else if(d.type===Hls.ErrorTypes.MEDIA_ERROR){ mErr++;
      if(mErr===1)h.recoverMediaError(); else if(mErr===2){h.swapAudioCodec();h.recoverMediaError();}
      else engineReload(); }
    else engineReload();
  });
  return h;
}
function engineReload(){
  if(!_curStream)return;
  if(_wdReloads>=3){ stopWD();
    if(_fo){ _fo.resumeAt=G('vEl').currentTime||_fo.resumeAt; G('plySpinTx').textContent='Por favor aguarde…'; G('plySpin').classList.add('on'); tryNextServer(); }
    else { G('plySpin').classList.remove('on'); toast('Não foi possível manter a reprodução','err'); }
    return; }
  _wdReloads++; toast('Reconectando…','warn');
  const v=G('vEl');
  loadStream(_curStream.url, v.currentTime||_curStream.pos||0, true);
}
function startWD(){
  stopWD(); _wdLast=-1; _wdStall=0;
  _wdT=setInterval(()=>{
    const v=G('vEl');
    if(!G('ply').classList.contains('on')){stopWD();return;}
    if(v.paused||!_playing){_wdStall=0;return;}
    if(v.currentTime===_wdLast){ _wdStall+=2;
      if(_wdStall===4)G('plySpin').classList.add('on');
      if(_wdStall>=8)engineReload();
    } else { _wdStall=0;_wdReloads=0;G('plySpin').classList.remove('on'); }
    _wdLast=v.currentTime;
    // buffer à frente visível
    let buf=0; for(let i=0;i<v.buffered.length;i++) if(v.buffered.start(i)<=v.currentTime&&v.currentTime<=v.buffered.end(i)) buf=v.buffered.end(i)-v.currentTime;
    G('plyBuf').textContent='buffer '+Math.round(buf)+'s';
    if(v.duration&&v.buffered.length) G('plyBufBar').style.width=Math.min(100,v.buffered.end(v.buffered.length-1)/v.duration*100)+'%';
  },2000);
}
function stopWD(){clearInterval(_wdT);_wdT=null;}

function loadStream(url, resumeAt=0, isRetry=false){
  if(isRetry && !G('ply').classList.contains('on')) return;      // não ressuscitar após sair
  const v=G('vEl');
  _curStream={url,pos:resumeAt};
  if(!isRetry)_wdReloads=0;
  G('plySpinTx').textContent=isRetry?'Reconectando…':'Carregando…';
  G('plySpin').classList.add('on');
  const kill=()=>{ if(hlsI){try{hlsI.destroy()}catch{}hlsI=null;}
    if(mpegtsI){try{mpegtsI.unload();mpegtsI.detachMediaElement();mpegtsI.destroy()}catch{}mpegtsI=null;}
    v.onerror=null;v.oncanplay=null;v.removeAttribute('src');try{v.load()}catch{} };
  kill();
  const isM3U8=/\.m3u8(\?|$)/i.test(url), isTS=/\.ts(\?|$)/i.test(url);
  const cands=[];
  if(isM3U8) cands.push({k:'hls',u:url},{k:'native',u:url});
  else if(isTS) cands.push({k:'hls',u:url.replace(/\.ts(\?|$)/i,'.m3u8$1')},{k:'mpegts',u:url},{k:'native',u:url});
  else { cands.push({k:'native',u:url}); if(HLS_OK)cands.push({k:'hls',u:url}); }
  let ci=0, settled=false, probeT=null;
  const isLive=false; // catálogo é só VOD
  const onReady=()=>{ if(settled)return; settled=true; clearTimeout(probeT);
    _playing=true; syncPP(); G('plySpin').classList.remove('on');
    if(_fo) _fo.tried.clear();          // tocou: zera o ciclo p/ futuros travamentos
    if(resumeAt>1){try{v.currentTime=resumeAt}catch{}}
    startWD(); };
  const giveUp=()=>{ settled=true; clearTimeout(probeT);
    if(_fo){ G('plySpinTx').textContent='Por favor aguarde…'; tryNextServer(); }
    else { G('plySpin').classList.remove('on'); toast('Não foi possível reproduzir este título','err'); } };
  const next=()=>{ if(settled)return; clearTimeout(probeT); kill(); ci++; ci<cands.length?attempt():giveUp(); };
  const tryPlay=(failOnRej=true)=>{ v.play().then(onReady).catch(err=>{
    if(settled)return;
    if(err?.name==='NotAllowedError'){ v.muted=true; G('plyMute').innerHTML='<i class="fas fa-volume-xmark"></i>';
      v.play().then(()=>{onReady();toast('Sem som (bloqueio do navegador) — toque no 🔊','warn')}).catch(()=>{if(failOnRej)next()}); }
    else if(failOnRej) next(); }); };
  const attempt=()=>{
    const c=cands[ci];
    probeT=setTimeout(()=>{if(!settled)next()},12000);
    if(c.k==='hls'){ if(!HLS_OK){next();return;}
      hlsI=mkHls(next); hlsI.loadSource(c.u); hlsI.attachMedia(v);
      hlsI.once(Hls.Events.MANIFEST_PARSED,()=>tryPlay(false));
      hlsI.once(Hls.Events.FRAG_BUFFERED,()=>{if(!settled)tryPlay(false)});
    } else if(c.k==='mpegts'){ if(!MPEGTS_OK){next();return;}
      mpegtsI=mpegts.createPlayer({type:'mse',isLive,url:c.u},{enableWorker:true,lazyLoad:false,liveBufferLatencyChasing:isLive});
      mpegtsI.attachMediaElement(v);
      mpegtsI.on(mpegts.Events.ERROR,()=>{ if(!settled)next(); else engineReload(); });
      mpegtsI.load(); tryPlay(false);
      v.oncanplay=()=>{if(!settled)tryPlay(false)};
    } else { v.onerror=()=>{if(!settled)next()}; v.src=c.u; tryPlay(true); }
  };
  attempt();
  v.onwaiting=()=>{if(settled)G('plySpin').classList.add('on')};
  v.onplaying=()=>{G('plySpin').classList.remove('on');if(settled){_playing=true;syncPP();}};
  let lastSave=0;
  v.ontimeupdate=()=>{
    if(!v.duration)return;
    const p=v.currentTime/v.duration*100;
    G('plyFill').style.width=p+'%';
    G('plyTime').textContent=`${fmtT(v.currentTime)} / ${fmtT(v.duration)}`;
    const now=Date.now();
    if(now-lastSave>5000){lastSave=now;saveHistPos();}
  };
  v.onended=()=>{ saveHistPos(); if(ST.curIdx>=0&&ST.curIdx<ST.curList.length-1) nav(1); };
}
function saveHistPos(){
  const v=G('vEl'); if(!ST.cur||!v.duration)return;
  const h=ST.history.find(x=>x.key===ST.cur.key); if(!h)return;
  h.pos=v.currentTime; h.dur=v.duration; saveLS();
}
function syncPP(){ G('plyPP').innerHTML=`<i class="fas fa-${_playing?'pause':'play'}"></i>`; }
function nav(dir){
  if(!ST.curList.length)return;
  const i=ST.curIdx+dir;
  if(i<0||i>=ST.curList.length)return;
  saveHistPos(); playItem(ST.curList[i],ST.curList);
}
function closePlayer(){
  G('ply').classList.add('closing');
  setTimeout(()=>G('ply').classList.remove('closing'),220);
  saveHistPos(); stopWD(); _curStream=null; _playing=false; _fo=null;
  const v=G('vEl');
  if(hlsI){try{hlsI.destroy()}catch{}hlsI=null;}
  if(mpegtsI){try{mpegtsI.unload();mpegtsI.detachMediaElement();mpegtsI.destroy()}catch{}mpegtsI=null;}
  try{v.pause()}catch{} v.removeAttribute('src'); try{v.load()}catch{}
  G('ply').classList.remove('on','ctrl');
  if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
  if(ST.page==='home'&&!ST.q)renderHome(); if(ST.page==='lib')renderLib();
}
let _hideT=null;
function autoHide(){ clearTimeout(_hideT); _hideT=setTimeout(()=>G('ply').classList.remove('ctrl'),3500); }

/* ═══ Seletor de listas ═══ */
function renderSrc(){
  const box=G('srcList'); box.innerHTML='';
  ST.sources.forEach((s,i)=>{
    const row=document.createElement('div');
    row.className='src-row '+(s.status==='ok'?'ok':s.status==='bad'?'bad':'')+(ST.active===s?' on':'');
    row.innerHTML=`<span class="dot"></span><div class="inf">
      <div class="nm">Servidor ${i+1}</div>
      <div class="mt">${s.expira?'expira '+s.expira+' · ':''}${s.status==='bad'?'offline':s.status==='ok'?'ativo':'não testado'}</div></div>
      ${ST.active===s?'<i class="fas fa-check" style="color:var(--gold)"></i>':''}`;
    row.onclick=async()=>{
      toast('Testando lista…');
      if(await testDual(s)){
        ST.active=s; localStorage.setItem('nf_srcIdx',String(i));
        updSrcChip(); renderSrc(); closeModal('mSrc');
        G('boot').classList.remove('off'); bootProg(46,'Carregando catálogo do servidor…');
        ST.movies=[];ST.series=[]; _matchCache.clear();
        await loadCatalog(); saveCatCache(); bootProg(100,'Pronto!'); finishBoot();
        G('srchIn').value=''; doSearch('');
      } else { renderSrc(); toast('Este servidor não respondeu','err'); }
    };
    box.appendChild(row);
  });
}

/* ═══ Modais / navegação ═══ */
function openModal(id){G(id).classList.add('on')}
function closeModal(id){G(id).classList.remove('on')}
function switchPage(pg){
  ST.page=pg;
  $$('.bnav-btn').forEach(b=>b.classList.toggle('on',b.dataset.pg===pg));
  G('pgHome').style.display=pg==='home'?'block':'none';
  G('pgLib').style.display=pg==='lib'?'block':'none';
  if(pg==='lib')renderLib();
}

/* ═══ Eventos ═══ */
/* Trava do botão voltar: fecha player/modal/aba em vez de sair do navegador */
function closeTopUI(){
  if(G('ply').classList.contains('on')){ closePlayer(); return true; }
  const openM=$$('.modal.on')[0];
  if(openM){ openM.classList.remove('on'); return true; }
  if(ST.page!=='home'){ switchPage('home'); return true; }
  if(ST.q){ G('srchIn').value=''; doSearch(''); return true; }
  if(ST.plat){ ST.plat=null; $$('.plat').forEach(x=>x.classList.remove('on')); renderHome(); return true; }
  return true; // raiz: consome o voltar mesmo assim (não sai do app)
}
history.pushState({nf:1},'');
window.addEventListener('popstate',()=>{ closeTopUI(); history.pushState({nf:1},''); });

document.addEventListener('DOMContentLoaded',()=>{
  boot();
  G('bootRetry').onclick=boot;
  G('srchIn').oninput=e=>{clearTimeout(_srchT);_srchT=setTimeout(()=>doSearch(e.target.value),260);};
  G('srchClr').onclick=()=>{G('srchIn').value='';doSearch('');};
  $$('.bnav-btn').forEach(b=>b.onclick=()=>switchPage(b.dataset.pg));
  $$('.lib-chips .chip').forEach(c=>c.onclick=()=>{ST.lib=c.dataset.lib;$$('.lib-chips .chip').forEach(x=>x.classList.toggle('on',x===c));renderLib();});
  $$('[data-close]').forEach(b=>b.onclick=()=>closeModal(b.dataset.close));
  $$('.modal').forEach(m=>m.onclick=e=>{if(e.target===m)m.classList.remove('on');});
  G('btnHelp').onclick=()=>openModal('mTut');
  G('srcChip').onclick=()=>{renderSrc();openModal('mSrc');};
  G('srcRetest').onclick=async()=>{ ST.sources.forEach(s=>{s.status='?';s.mode=undefined;}); renderSrc(); await Promise.all(ST.sources.map(async s=>{ await testDual(s); renderSrc(); })); };
  // player
  const v=G('vEl');
  G('plyBack').addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();closePlayer();});
  G('plyPP').onclick=()=>{ if(v.paused){v.play();_playing=true;}else{v.pause();_playing=false;} syncPP(); autoHide(); };
  G('plyRw').onclick=()=>{v.currentTime=Math.max(0,v.currentTime-10);autoHide();};
  G('plyFw').onclick=()=>{v.currentTime=Math.min(v.duration||1e9,v.currentTime+10);autoHide();};
  G('plyPrev').onclick=()=>nav(-1);
  G('plyNext').onclick=()=>nav(1);
  G('plyMute').onclick=()=>{v.muted=!v.muted;G('plyMute').innerHTML=`<i class="fas fa-volume-${v.muted?'xmark':'high'}"></i>`;autoHide();};
  G('plyFs').onclick=()=>{ if(document.fullscreenElement)document.exitFullscreen(); else G('ply').requestFullscreen?.().catch(()=>{}); autoHide(); };
  // (alternância de controles agora é tratada pela camada de gestos)
  G('plySeek').onclick=e=>{
    if(!v.duration)return;
    const r=G('plySeek').getBoundingClientRect();
    v.currentTime=(e.clientX-r.left)/r.width*v.duration; autoHide();
  };

  /* Gestos estilo app: duplo-toque = ±10s; arrastar vertical = brilho(esq)/volume(dir) */
  const gest=G('plyGest'); let gStartX=0,gStartY=0,gMode=null,gStartVol=1,gStartBr=0,lastTap=0;
  const hint=(icon,txt)=>{ const h=G('plyHint'); h.innerHTML=`<i class="fas fa-${icon}"></i> ${txt}`; h.classList.add('on'); clearTimeout(h._t); h._t=setTimeout(()=>h.classList.remove('on'),700); };
  gest.addEventListener('touchstart',e=>{
    const t=e.touches[0]; gStartX=t.clientX; gStartY=t.clientY; gMode=null;
    gStartVol=v.volume; gStartBr=+(G('plyBright').style.opacity||0);
  },{passive:true});
  gest.addEventListener('touchmove',e=>{
    const t=e.touches[0], dx=t.clientX-gStartX, dy=t.clientY-gStartY;
    if(!gMode && Math.abs(dy)>18 && Math.abs(dy)>Math.abs(dx)) gMode=gStartX < innerWidth/2 ? 'bright':'vol';
    if(gMode==='vol'){ const nv=Math.max(0,Math.min(1,gStartVol - dy/220)); v.volume=nv; v.muted=nv===0;
      hint('volume-'+(nv===0?'xmark':nv<.5?'low':'high'), Math.round(nv*100)+'%'); }
    else if(gMode==='bright'){ const nb=Math.max(0,Math.min(.85,gStartBr + dy/220)); G('plyBright').style.opacity=nb;
      hint('sun', Math.round((1-nb)*100)+'%'); }
  },{passive:true});
  gest.addEventListener('click',()=>{
    const now=Date.now();
    if(now-lastTap<300){ // duplo-toque
      if(event.clientX>innerWidth/2){ v.currentTime=Math.min(v.duration||1e9,v.currentTime+10); hint('rotate-right','+10s'); }
      else { v.currentTime=Math.max(0,v.currentTime-10); hint('rotate-left','-10s'); }
    } else { G('ply').classList.toggle('ctrl'); autoHide(); }
    lastTap=now;
  });
  document.addEventListener('keydown',e=>{
    if(!G('ply').classList.contains('on'))return;
    if(e.key===' '){e.preventDefault();G('plyPP').click();}
    if(e.key==='ArrowRight')G('plyFw').click();
    if(e.key==='ArrowLeft')G('plyRw').click();
    if(e.key==='Escape')closePlayer();
  });
});
