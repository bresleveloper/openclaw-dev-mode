import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,Tu as n,ju as r,ku as i,wu as a}from"./control-ui-core-CTSdBcaH.js";import{$r as o,Ar as s,Mr as c,Or as l,Tr as u,_i as d,ai as ee,hi as te,mi as ne,na as f,ra as p,vi as re}from"./control-ui-core-vFnxmx94.js";import{$ as m,X as h,Y as g,a as ie,c as ae,ct as _,i as oe,mt as se,nt as ce,s as le,ut as v}from"./lit-runtime-TNZj1e-P.js";import{L as ue,U as de}from"./control-ui-boot-shared-DSyxl38Y.js";import{_a as fe,ii as y}from"./ui-CnRtCcYL.js";import{Ct as pe,St as me,en as he,tn as ge}from"./control-ui-boot-shared-DeF_v3ER.js";import{v as b}from"./control-ui-boot-shared-BIBfFukq.js";import{M as _e,j as ve}from"./markdown-runtime-ORQpioyT.js";import{n as ye,t as be}from"./dock-panel-styles-BYfbusEB.js";import{a as xe,i as Se,n as Ce,r as we,t as x}from"./panel-tab-strip-Dwi019wO.js";import{a as Te,i as Ee,n as De,o as S,r as Oe,s as C,t as w}from"./link-reader-response-kG5v4_lz.js";var T,E,D,O,k;function A(){return(A=e((()=>{T=32,E=4,D=2796268,O=8388608,k=class{constructor(e,t,n){this.client=e,this.method=t,this.isCurrent=n,this.abort=new AbortController,this.cache=new Map,this.queue=[],this.active=0,this.bytes=0,this.load=e=>{let t=this.cache.get(e);if(t)return t;if(this.abort.signal.aborted||!this.isCurrent())return Promise.reject(Error(`Reader image is unavailable`));if(this.cache.size>=T)return Promise.resolve(e);let n=new Promise((t,n)=>{this.queue.push(()=>{this.request(e).then(t,()=>{!this.abort.signal.aborted&&this.isCurrent()?t(e):n(Error(`Reader image is unavailable`))}).finally(()=>{this.active--,this.drain()})})});return this.cache.set(e,n),this.drain(),n}}dispose(){this.abort.abort(),this.cache.clear(),this.drain()}drain(){for(;this.active<E&&this.queue.length;)this.active++,this.queue.shift()()}async request(e){if(this.abort.signal.aborted||!this.isCurrent())throw Error(`Reader image is unavailable`);let t=await this.client.request(this.method,{url:e},{signal:this.abort.signal});if(this.abort.signal.aborted||!this.isCurrent()||t?.url!==e||typeof t.dataUrl!=`string`||t.dataUrl.length>D||this.bytes+t.dataUrl.length>O||!/^data:image\/(?:png|jpeg|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/u.test(t.dataUrl))throw Error(`Reader image is unavailable`);return this.bytes+=t.dataUrl.length,t.dataUrl}}})))()}var j;function M(){return(M=e((()=>{g(),j=se`
  .lr-document {
    max-width: 920px;
    margin-inline: auto;
    min-width: 0;
  }
  .lr-eyebrow {
    color: var(--muted);
    font-size: 12px;
    font-weight: 500;
  }
  .lr-metadata {
    display: flex;
    flex-wrap: wrap;
    gap: 14px 24px;
    margin: 16px 0 0;
    padding: 12px 0 16px;
    border-top: 1px solid var(--border);
  }
  .lr-metric {
    min-width: 0;
  }
  .lr-metric dt {
    color: var(--muted);
    font-size: 11px;
    margin-bottom: 2px;
  }
  .lr-metric dd {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .lr-metric--positive dd {
    color: var(--ok);
  }
  .lr-metric--negative dd {
    color: var(--danger);
  }
  .lr-section-nav {
    position: sticky;
    /* Offset the reader padding so the bar sticks flush with its scrollport. */
    top: -24px;
    z-index: 1;
    display: flex;
    gap: 4px;
    overflow-x: auto;
    padding: 8px 0;
    margin-bottom: 16px;
    background: var(--bg);
    border-block: 1px solid var(--border);
  }
  .lr-section-nav button {
    display: inline-flex;
    flex: none;
    white-space: nowrap;
    align-items: center;
    gap: 6px;
    min-height: 32px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--muted);
    padding: 6px 9px;
    font: inherit;
    font-size: 12px;
    font-weight: 550;
    cursor: default;
  }
  .lr-section-nav button:hover {
    color: var(--text);
    background: color-mix(in srgb, var(--text) 6%, transparent);
  }
  .lr-count {
    display: inline-block;
    border-radius: 5px;
    padding: 0 5px;
    color: var(--muted);
    background: color-mix(in srgb, var(--text) 7%, transparent);
    font-size: 11px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
  .lr-document section > h2 {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  [data-reader-section],
  .lr-comment {
    scroll-margin-top: 64px;
  }
  [data-reader-section]:focus {
    outline: none;
  }
  .lr-checks {
    --check-color: var(--muted);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    margin: 20px 0 24px;
    background: color-mix(in srgb, var(--check-color) 3%, transparent);
  }
  .lr-checks--success,
  .lr-check--success {
    --check-color: var(--ok);
  }
  .lr-checks--failure,
  .lr-check--failure {
    --check-color: var(--danger);
  }
  .lr-checks--pending,
  .lr-check--pending {
    --check-color: var(--warn);
  }
  .lr-check--neutral {
    --check-color: var(--muted);
  }
  .lr-checks > summary {
    display: grid;
    grid-template-columns: 32px minmax(0, 1fr) 16px;
    align-items: center;
    column-gap: 12px;
    padding: 16px;
    list-style: none;
    cursor: default;
  }
  .lr-checks > summary::-webkit-details-marker {
    display: none;
  }
  .lr-checks-icon {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: var(--check-color);
    background: color-mix(in srgb, var(--check-color) 12%, transparent);
  }
  .lr-checks-icon svg {
    width: 17px;
    height: 17px;
  }
  .lr-checks-heading {
    display: grid;
    gap: 2px;
  }
  .lr-checks-heading strong {
    font-size: 13px;
    font-weight: 650;
  }
  .lr-checks-chevron {
    display: flex;
    color: var(--muted);
  }
  .lr-checks-chevron svg,
  .lr-check-symbol svg {
    width: 16px;
    height: 16px;
  }
  .lr-checks[open] .lr-checks-chevron {
    transform: rotate(180deg);
  }
  .lr-checks-meter {
    display: flex;
    gap: 3px;
    grid-column: 2;
    margin-top: 10px;
    height: 4px;
    overflow: hidden;
    border-radius: 2px;
  }
  .lr-check-segment {
    flex: 1;
    background: var(--muted);
  }
  .lr-check-segment--success {
    background: var(--ok);
  }
  .lr-check-segment--failure {
    background: var(--danger);
  }
  .lr-check-segment--pending {
    background: var(--warn);
  }
  .lr-check-list {
    max-height: 360px;
    overflow: auto;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .lr-check {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    border-top: 1px solid var(--border);
  }
  .lr-check-symbol {
    display: flex;
    color: var(--check-color);
  }
  .lr-check-copy {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    min-width: 0;
    flex: 1;
    gap: 4px 12px;
  }
  .lr-check-copy > a {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    color: var(--text);
    text-decoration: none;
  }
  .lr-check-copy > a:hover {
    text-decoration: underline;
  }
  .lr-check-copy > a svg {
    flex: none;
    width: 12px;
    height: 12px;
    color: var(--muted);
  }
  .lr-checks-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    border-top: 1px solid var(--border);
    padding: 12px 16px;
    font-size: 11px;
    color: var(--muted);
  }
  .lr-checks-footer a {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--muted);
  }
  .lr-checks-footer svg {
    width: 12px;
    height: 12px;
  }
  .lr-checks-footer code {
    font-family: var(--mono);
  }
  @media (max-width: 768px) {
    .lr-section-nav {
      top: -16px;
      gap: 0;
    }
    .lr-section-nav button {
      padding-inline: 7px;
    }
  }
  .lr-image {
    display: block;
    margin: 12px 0;
    max-width: 100%;
  }
  .lr-image img {
    display: block;
    max-width: 100%;
    max-height: 480px;
    height: auto;
    object-fit: contain;
    border-radius: 6px;
  }
  .lr-image img[hidden] {
    display: none;
  }
  .lr-image-caption {
    display: block;
    margin-top: 5px;
    color: var(--muted);
    font-size: 11px;
    overflow-wrap: anywhere;
  }
  .lr-image > a {
    display: inline-block;
    max-width: 100%;
  }
  .lr-comment-kind {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0 7px;
    font-size: 11px;
  }
  .lr-review-location {
    margin: 8px 0;
    color: var(--muted);
    font-size: 11px;
  }
  .lr-review-location a {
    font-family: var(--mono);
  }
  .lr-review-diff {
    margin-top: 8px;
  }
`})))()}function N(e,t){if(!e.trim())return null;let n=URL.parse(e,t);return n&&[`https:`,`http:`,`mailto:`].includes(n.protocol)&&!n.username&&!n.password?n:null}function P(e,t){let n=document.createElement(`a`);return n.href=e,n.textContent=t,n.target=`_blank`,n.rel=`noopener noreferrer`,n.referrerPolicy=`no-referrer`,n.dataset.linkReaderExternal=``,n}function ke(e,t,n){let i=N(e.getAttribute(`src`)??``,t),a=e.alt.trim()||r(`linkReader.image`),o=document.createElement(`span`);o.className=`lr-image`;let s=document.createElement(`span`);s.className=`lr-image-caption`;let c=document.createElement(`span`);c.textContent=a,s.append(c);let l=e.closest(`a`),u=i?.hostname.replace(/\.+$/u,``)??``,d=!u.includes(`.`)||/(?:^|\.)(?:localhost|local|internal|localdomain)$/u.test(u),ee=i?.protocol===`https:`&&i.origin!==window.location.origin&&!d&&!de(u);if(i&&[`https:`,`http:`].includes(i.protocol)&&s.append(` · `,P(i.href,r(`linkReader.openImage`))),ee&&i){let e=document.createElement(`img`);e.alt=a,e.crossOrigin=`anonymous`,e.referrerPolicy=`no-referrer`,e.loading=`lazy`,e.decoding=`async`;let t=()=>{e.hidden=!0,c.textContent=r(`linkReader.imageUnavailable`,{title:a}),c.setAttribute(`role`,`status`)};if(e.addEventListener(`error`,t,{once:!0}),l)o.append(e);else{let t=P(i.href,``);t.setAttribute(`aria-label`,r(`linkReader.openImageTitle`,{title:a})),t.append(e),o.append(t)}n?n(i.href).then(t=>{e.isConnected&&(e.src=t)},t):e.src=i.href}else c.textContent=r(`linkReader.imageUnavailable`,{title:a});e.replaceWith(o),l?l.after(s):o.append(s)}function F(e,t,n){return ae([e,t,n,i.getLocale()],()=>{let r;try{r=H.render(e,V)}catch{r=`<pre>`+b(e)+`</pre>`}let i=U.sanitize(r,{RETURN_DOM_FRAGMENT:!0,ALLOWED_TAGS:W,ALLOWED_ATTR:[`href`,`src`,`alt`,`title`,`class`,`open`,`start`,`type`,`checked`,`disabled`],ALLOW_DATA_ATTR:!1,ALLOW_ARIA_ATTR:!1});for(let e of i.querySelectorAll(`a`)){let n=N(e.getAttribute(`href`)??``,t);n?(e.href=n.href,e.target=`_blank`,e.rel=`noopener noreferrer`,e.referrerPolicy=`no-referrer`):e.removeAttribute(`href`)}for(let e of i.querySelectorAll(`input`))e.type=`checkbox`,e.disabled=!0;for(let e of i.querySelectorAll(`img`))ke(e,t,n);return i})}function I(e){if(!e)return h;let t=new Date(e);return m`<time datetime=${e} title=${e}
    >${Number.isNaN(t.getTime())?e:t.toLocaleString()}</time
  >`}function L(e,t){return m`<pre
    class="lr-diff"
    tabindex="0"
    aria-label=${r(`linkReader.diffLabel`,{filename:t})}
  ><code>${e.split(`
`).map(e=>{let t=e.startsWith(`+`)?`add`:e.startsWith(`-`)?`delete`:e.startsWith(`@@`)?`hunk`:`context`;return m`<span class=${`lr-diff-line lr-diff-line--`+t}>${e}</span>`})}</code></pre>`}function Ae(e,t){return m`<details class="lr-file" ?open=${t}>
    <summary>
      <span class="lr-filename">${e.path}</span
      ><span class="lr-stats"
        ><span class="lr-add">+${e.additions}</span>
        <span class="lr-delete">−${e.deletions}</span></span
      >
    </summary>
    ${e.previousPath?m`<p class="lr-meta">
            ${r(`linkReader.renamedFrom`,{filename:e.previousPath})}
          </p>`:h}
    ${e.patch?L(e.patch,e.path):m`<p class="lr-note">${r(`linkReader.patchUnavailable`)}</p>`}
    ${e.patchTruncated?m`<p class="lr-note">${r(`linkReader.patchTruncated`)}</p>`:h}
  </details>`}function je(e,t,n){let i=e.context,a=[i?.path,i?.lineLabel].filter(Boolean).join(`:`),o=N(e.url,t)?.href,s=i?.replyUrl?N(i.replyUrl,t)?.href:void 0;return m`<article class="lr-comment" id=${e.id}>
    <header class="lr-meta">
      <strong>${e.author}</strong>
      <a
        href=${o??h}
        target="_blank"
        rel="noopener noreferrer"
        referrerpolicy="no-referrer"
        title=${r(`linkReader.commentPermalink`)}
        >${e.createdAt?I(e.createdAt):r(`linkReader.commentPermalink`)}</a
      >
      ${e.label?m`<span class="lr-comment-kind">${e.label}</span>`:h}
    </header>
    ${a||i?.label?m`<p class="lr-review-location">
            <a
              href=${o??h}
              target="_blank"
              rel="noopener noreferrer"
              referrerpolicy="no-referrer"
              >${a}</a
            >
            ${i?.label}
          </p>`:h}
    ${s?m`<a
            class="lr-meta"
            href=${s}
            target="_blank"
            rel="noopener noreferrer"
            referrerpolicy="no-referrer"
            >${i?.replyLabel??r(`linkReader.replyContext`)}</a
          >`:h}
    ${i?.diff?m`<details class="lr-file lr-review-diff">
            <summary>${r(`linkReader.reviewContext`)}</summary>
            ${L(i.diff,i.path??``)}${i.diffTruncated?m`<p class="lr-note">${r(`linkReader.patchTruncated`)}</p>`:h}
          </details>`:h}
    <div class="lr-markdown">${F(e.body,t,n)}</div>
    ${e.bodyTruncated?m`<p class="lr-note">${r(`linkReader.bodyTruncated`)}</p>`:h}
  </article>`}function R(e){switch(e){case`success`:return f.check;case`failure`:return f.circleX;case`pending`:return f.clock;case`unavailable`:return f.circleQuestionMark;default:return f.circle}}function z(e){return r({success:`linkReader.checkSuccess`,failure:`linkReader.checkFailure`,pending:`linkReader.checkPending`,neutral:`linkReader.checkNeutral`}[e])}function Me(e,t){let n={success:`linkReader.checksSuccess`,failure:`linkReader.checksFailure`,pending:`linkReader.checksPending`,neutral:`linkReader.checksNeutral`,unavailable:`linkReader.checksUnavailable`},i=e.url?N(e.url,t)?.href:void 0;return m`<details
    class=${`lr-checks lr-checks--`+e.state}
    data-reader-section="checks"
    tabindex="-1"
    ?open=${e.state===`failure`}
  >
    <summary>
      <span class="lr-checks-icon" aria-hidden="true">${R(e.state)}</span>
      <span class="lr-checks-heading"
        ><strong>${r(n[e.state])}</strong
        ><span class="lr-meta">${e.summary}</span></span
      >
      <span class="lr-checks-chevron" aria-hidden="true">${f.chevronDown}</span>
      ${!e.truncated&&e.state!==`unavailable`&&e.items.length===e.total&&e.total>0?m`<span class="lr-checks-meter" aria-hidden="true"
              >${e.items.map(e=>m`<span class=${`lr-check-segment lr-check-segment--`+e.state}></span>`)}</span
            >`:h}
    </summary>
    <ul class="lr-check-list">
      ${e.items.map(e=>{let n=e.url?N(e.url,t)?.href:void 0;return m`<li class=${`lr-check lr-check--`+e.state}>
          <span class="lr-check-symbol" role="img" aria-label=${z(e.state)}
            >${R(e.state)}</span
          >
          <span class="lr-check-copy"
            >${n?m`<a
                    href=${n}
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerpolicy="no-referrer"
                    data-link-reader-external
                    >${e.name}${f.externalLink}</a
                  >`:m`<span>${e.name}</span>`}
            <span class="lr-meta">${e.detail??z(e.state)}</span>
          </span>
        </li>`})}
    </ul>
    ${e.truncated?m`<p class="lr-note">${r(`linkReader.checksTruncated`)}</p>`:h}
    <footer class="lr-checks-footer">
      ${e.commit?m`<code title=${r(`linkReader.checksCommit`,{commit:e.commit})}>${e.commit.slice(0,7)}</code>`:h}
      ${i?m`<a href=${i} target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" data-link-reader-external>${r(`linkReader.checksSource`)}${f.externalLink}</a>`:h}
    </footer>
  </details>`}function B(e,t,n){return m`<button
    type="button"
    @click=${t=>{let n=t.currentTarget;if(!(n instanceof HTMLButtonElement))return;let r=n.closest(`.lr-document`)?.querySelector(`[data-reader-section="${e}"]`);r instanceof HTMLDetailsElement&&(r.open=!0),r?.focus({preventScroll:!0}),r?.scrollIntoView({block:`start`})}}
  >
    ${t}${n===void 0?h:m`<span class="lr-count">${n}</span>`}
  </button>`}function Ne(e,t,n){let i=De(e.authorUrl,e.url),a=e.coAuthors??[],o=Math.max(a.length,e.coAuthorCount??0)-a.length,s=a.map(e=>e.name).join(`, `)+(o?` +`+o:``);return m`<article class="lr-document">
    <header class="lr-document-header">
      <div class="lr-eyebrow">${e.subtitle??t.reader.label}</div>
      <h1>${e.title}</h1>
      <div class="lr-meta lr-item-meta">
        ${e.badge?m`<span class=${`lr-state lr-state--`+e.badge.tone}
                >${e.badge.label}</span
              >`:h}
        ${e.author?i?m`<a
                  href=${i}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-link-reader-external
                  >${r(`linkReader.byAuthor`,{author:e.author})}</a
                >`:m`<span>${r(`linkReader.byAuthor`,{author:e.author})}</span>`:h}
        ${s.trim()?m`<span class="lr-coauthors">${r(`linkReader.coAuthors`,{authors:s.trim()})}</span>`:h}
        ${I(e.badge?.timestamp??e.createdAt)}
      </div>
      ${e.metadata?.length?m`<dl class="lr-metadata">
              ${e.metadata.map(({label:e,value:t,tone:n})=>m`<div class=${`lr-metric lr-metric--`+(n??`neutral`)}>
                    <dt>${e}</dt>
                    <dd>${t}</dd>
                  </div>`)}
            </dl>`:h}
    </header>
    <nav class="lr-section-nav" aria-label=${r(`linkReader.navigation`)}>
      ${B(`overview`,r(`linkReader.overview`))}
      ${e.checks?B(`checks`,r(`linkReader.checks`),e.checks.total):h}
      ${e.files?B(`files`,r(`linkReader.filesShort`),e.filesTotal??e.files.length):h}
      ${e.comments?B(`comments`,r(`linkReader.discussion`),e.commentsTotal??e.comments.length):h}
    </nav>
    ${e.checks?Me(e.checks,e.url):h}
    ${e.partial?m`<p class="lr-note" role="status">${r(`linkReader.partial`)}</p>`:h}
    <section
      aria-label=${r(`linkReader.description`)}
      class="lr-description"
      data-reader-section="overview"
      tabindex="-1"
    >
      <div class="lr-markdown">
        ${e.body?F(e.body,e.url,n):m`<p class="lr-meta">${r(`linkReader.noDescription`)}</p>`}
      </div>
      ${e.bodyTruncated?m`<p class="lr-note">${r(`linkReader.bodyTruncated`)}</p>`:h}
    </section>
    ${e.files?m`<section
            aria-label=${r(`linkReader.files`)}
            class="lr-files"
            id="files"
            data-reader-section="files"
            tabindex="-1"
          >
            <h2>
              ${r(`linkReader.files`)}
              <span class="lr-count"
                >${e.files.length}${e.filesTotal!==void 0&&e.filesTotal!==e.files.length?` / `+e.filesTotal:``}</span
              >
            </h2>
            ${e.files.map(t=>Ae(t,e.filesExpanded===!0))}
            ${e.filesTruncated?m`<p class="lr-note">${r(`linkReader.filesTruncated`)}</p>`:h}
            ${e.files.length===0&&!e.filesTruncated?m`<p class="lr-meta">${r(`linkReader.noFiles`)}</p>`:h}
          </section>`:h}
    ${e.comments?m`<section
            aria-label=${r(`linkReader.comments`)}
            class="lr-comments"
            data-reader-section="comments"
            tabindex="-1"
          >
            <h2>
              ${r(`linkReader.comments`)}
              <span class="lr-count"
                >${e.comments.length}${e.commentsTotal!==void 0&&e.commentsTotal!==e.comments.length?` / `+e.commentsTotal:``}</span
              >
            </h2>
            ${e.comments.map(t=>je(t,e.url,n))}
            ${e.commentsTruncated?m`<p class="lr-note">${r(`linkReader.commentsTruncated`)}</p>`:h}
            ${e.comments.length===0&&!e.commentsTruncated?m`<p class="lr-meta">${r(`linkReader.noComments`)}</p>`:h}
          </section>`:h}
  </article>`}var V,H,U,W;function G(){return(G=e((()=>{ue(),ve(),g(),le(),t(),S(),p(),w(),pe(),he(),C(),V=ge({mode:`document`,codeBlockChrome:`none`,fileLinks:!1,interactiveImages:!1,assistantTranscriptRoleHeaders:!1}),H=me();for(let e of[`html_inline`,`html_block`]){let t=H.renderer.rules[e];H.renderer.rules[e]=(e,n,r,i,a)=>{let o=e[n]?.content??``;return o.trimStart().startsWith(`<!--`)?b(o.replace(/<!--[\s\S]*?(?:-->|$)/gu,``)):/^<img\s[^<>]*>\s*$/iu.test(o)?o:t(e,n,r,i,a)}}U=_e(window),W=`a.b.blockquote.br.code.del.details.div.em.h1.h2.h3.h4.h5.h6.hr.i.img.input.li.ol.p.pre.s.span.strong.summary.table.tbody.td.th.thead.tr.ul`.split(`.`)})))()}var K;function q(){return(q=e((()=>{g(),K=se`
  .bp--right {
    top: var(--shell-topbar-height, 0);
    right: calc(
      var(--oc-terminal-reserve-right, 0px) + var(--oc-browser-reserve-right, 0px) +
        var(--oc-desktop-reserve-right, 0px)
    );
    bottom: calc(
      var(--oc-terminal-reserve-bottom, 0px) + var(--oc-browser-reserve-bottom, 0px) +
        var(--oc-desktop-reserve-bottom, 0px)
    );
    max-width: 100vw;
  }
  .bp-header {
    flex: none;
  }
  .bp--embedded {
    position: relative;
    inset: auto;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    flex: 1;
  }
  .bp-icon {
    cursor: default;
    flex: none;
    text-decoration: none;
  }
  .bp-icon svg,
  .lr-external svg {
    width: 15px;
    height: 15px;
  }
  .bp-icon:disabled,
  .lr-retry:disabled {
    opacity: 0.4;
    cursor: default;
  }
  :is(button, a, summary, pre):focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  .lr-tab-header .tabstrip {
    flex: 1;
  }
  .tabstrip-tab__label {
    max-width: 150px;
  }
  .lr-toolbar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px 8px;
    border-bottom: 1px solid var(--border);
  }
  .lr-url {
    flex: 1;
    min-width: 0;
    height: 30px;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 14px;
    padding: 3px 10px;
    color: var(--text);
    background: color-mix(in srgb, var(--text) 8%, transparent);
    font: inherit;
    font-size: 12px;
  }
  .lr-url:focus {
    border-color: var(--accent);
    outline: none;
  }
  .lr-external {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 5px;
    padding: 4px;
    color: var(--text);
    font-size: 12px;
    text-decoration: none;
    white-space: nowrap;
  }
  .lr-external:hover {
    text-decoration: underline;
  }
  .lr-panels {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
  .lr-content[hidden] {
    display: none;
  }
  .lr-content {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 24px;
    font-size: 13px;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }
  .lr-content:focus {
    outline: none;
  }
  h1 {
    margin: 10px 0 16px;
    font-size: 25px;
    line-height: 1.25;
    font-weight: 650;
    letter-spacing: -0.025em;
  }
  h2 {
    margin: 24px 0 12px;
    font-size: 14px;
    font-weight: 650;
  }
  a {
    color: var(--accent);
  }
  .lr-meta {
    color: var(--muted);
    font-size: 12px;
  }
  .lr-item-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .lr-state {
    padding: 2px 9px;
    border-radius: 12px;
    background: color-mix(in srgb, currentColor 12%, transparent);
    font-weight: 600;
  }
  .lr-state--positive {
    color: var(--ok);
  }
  .lr-state--accent {
    color: var(--pr-merged);
  }
  .lr-state--negative {
    color: var(--danger);
  }
  .lr-state--attention {
    color: var(--warn);
  }
  .lr-description {
    margin-top: 24px;
  }
  .lr-note {
    padding: 9px 12px;
    border-left: 2px solid var(--warn);
    background: color-mix(in srgb, var(--warn) 8%, transparent);
    font-size: 12px;
  }
  .lr-comment {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 12px;
  }
  .lr-comment header {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .lr-comment strong {
    color: var(--text);
  }
  .lr-file {
    border: 1px solid var(--border);
    border-radius: 9px;
    margin-bottom: 8px;
    overflow: hidden;
  }
  .lr-file summary {
    cursor: default;
    padding: 12px;
    background: color-mix(in srgb, var(--text) 4%, transparent);
  }
  .lr-filename {
    font-family: var(--mono);
    font-size: 12px;
  }
  .lr-stats {
    white-space: nowrap;
    margin-left: 10px;
    font-size: 11px;
  }
  .lr-add {
    color: var(--ok);
  }
  .lr-delete {
    color: var(--danger);
  }
  .lr-file > p {
    margin: 10px;
  }
  .lr-diff {
    margin: 0;
    overflow: auto;
    font-family: var(--mono);
    font-size: 11px;
    line-height: 1.7;
    tab-size: 2;
  }
  .lr-diff code {
    display: block;
    min-width: max-content;
  }
  .lr-diff-line {
    display: block;
    min-height: 1.7em;
    padding: 0 10px;
    white-space: pre;
  }
  .lr-diff-line--add {
    background: color-mix(in srgb, var(--ok) 14%, transparent);
  }
  .lr-diff-line--delete {
    background: color-mix(in srgb, var(--danger) 14%, transparent);
  }
  .lr-diff-line--hunk {
    color: var(--muted);
    background: color-mix(in srgb, var(--accent) 9%, transparent);
  }
  .lr-status {
    padding: 24px 0;
    color: var(--muted);
  }
  .lr-status h2 {
    color: var(--text);
  }
  .lr-status a {
    margin-left: 12px;
  }
  .lr-retry {
    font: inherit;
    color: var(--text);
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 4px 12px;
    cursor: default;
  }
  .lr-markdown :first-child {
    margin-top: 10px;
  }
  .lr-markdown p {
    margin: 10px 0;
  }
  .lr-markdown pre {
    white-space: pre;
    overflow: auto;
    padding: 10px;
    border-radius: 6px;
    background: color-mix(in srgb, var(--text) 5%, transparent);
  }
  .lr-markdown code {
    font-family: var(--mono);
    font-size: 0.9em;
  }
  .lr-markdown :not(pre) > code {
    padding: 2px 4px;
    border-radius: 3px;
    background: color-mix(in srgb, var(--text) 7%, transparent);
  }
  .lr-markdown blockquote {
    margin: 10px 0;
    padding-left: 12px;
    border-left: 3px solid var(--border);
    color: var(--muted);
  }
  .lr-markdown table {
    display: block;
    overflow: auto;
    border-collapse: collapse;
  }
  .lr-markdown :is(td, th) {
    border: 1px solid var(--border);
    padding: 5px 9px;
  }
  .lr-markdown img {
    max-width: 100%;
  }
  @media (max-width: 768px) {
    .bp--right {
      inset: 0;
      width: 100% !important;
      max-width: none;
      border: 0;
    }
    .bp-resizer {
      display: none;
    }
    .bp-header {
      min-height: 44px;
      padding: env(safe-area-inset-top, 0px) 6px 0;
    }
    .bp-icon {
      width: 34px;
      height: 34px;
    }
    .lr-toolbar {
      flex-wrap: wrap;
    }
    .lr-url {
      order: -1;
      flex-basis: 100%;
      font-size: 16px;
      height: 36px;
    }
    .lr-external {
      margin-left: auto;
    }
    .lr-content {
      padding: 16px 16px calc(16px + env(safe-area-inset-bottom, 0px));
    }
  }
`})))()}function Pe(e){return Object.entries(f).find(([t])=>t===e)?.[1]??f.link}function J(e,t,n,r=!1){return m`<button
    class="rail-header__action bp-icon"
    type="button"
    title=${e}
    aria-label=${e}
    ?disabled=${r}
    @click=${n}
  >
    ${t}
  </button>`}function Y(e){return e?.history[e.index]??null}function X(e){if(e.view.status===`ready`)return e.view.detail.title;let t=Y(e);return t?t.reader.label+` · `+new URL(t.href).pathname:r(`linkReader.newTab`)}function Fe(e,t,n){let i=Y(e);return i?!t||e.view.status===`error`?m`<div class="lr-status" role="alert">
      <h2>${r(`linkReader.unavailableTitle`)}</h2>
      <p>
        ${t?e.view.status===`error`?e.view.message:r(`linkReader.unavailable`):r(`linkReader.disconnected`)}
      </p>
      <button class="lr-retry" type="button" ?disabled=${!t} @click=${n}>
        ${r(`linkReader.retry`)}</button
      ><a href=${i.href} target="_blank" rel="noopener noreferrer" data-link-reader-external
        >${r(`linkReader.openExternal`,{provider:i.reader.label})}</a
      >
    </div>`:e.view.status===`ready`?Ne(e.view.detail,i,e.view.images?.load):m`<p class="lr-status" role="status">${r(`linkReader.loadingPreview`)}</p>`:m`<p class="lr-status">${r(`linkReader.urlPlaceholder`)}</p>`}var Ie,Le;function Re(){return(Re=e((()=>{g(),t(),te(),ye(),p(),M(),G(),q(),x(),Ie=ne({storageKey:`openclaw.link-reader.panel.v1`,minHeight:240,minWidth:300,defaultDock:`right`,supportedDocks:[`right`],defaultHeight:420,defaultWidth:560}),Le=[Ce,be,K,j]})))()}var Z,Q;function $(){return($=e((()=>{g(),ce(),oe(),t(),S(),n(),re(),p(),Ee(),A(),Re(),w(),l(),xe(),x(),ee(),C(),Z=10,Q=class extends a{constructor(...e){super(...e),this.client=null,this.available=!1,this.readers=u,this.suppressed=!1,this.embedded=!1,this.presented=!1,this.tabsInHeader=!1,this.sessionKey=``,this.hostedSignature=``,this.urlDraft=``,this.invalidUrl=!1,this.tabLimitUrl=null,this.tabs=[],this.activeId=null,this.nextTabId=0,this.requestAbort=null,this.returnFocus=null,this.scrollContent=!1,this.focusAddress=!1,this.refreshRequested=!1,this.dockLayout=new d(this,{layout:Ie,reservationPrefix:`link-reader`,isAvailable:()=>this.tabs.length>0&&!this.suppressed&&!this.embedded,isFullscreen:()=>this.embedded}),this.handleToggleRequest=e=>{let t=e instanceof CustomEvent?e.detail:void 0,n=fe(t)?t:null;if(n?.open===!1){this.closePanel();return}let r=typeof n?.url==`string`?c(n.url,this.readers):null;if(this.isConnected&&this.available&&this.client&&!this.suppressed&&(!this.embedded||this.presented)&&this.readers.length&&(n?.url===void 0||r)){if(e.preventDefault(),!this.panelPresented||this.embedded&&!this.returnFocus){let e=document.activeElement;this.returnFocus=n?.trigger instanceof HTMLElement?n.trigger:e instanceof HTMLElement&&e!==this?e:null}if(!r&&n?.newTab){this.createTab();return}if(r){let e=n?.newTab===!1?void 0:this.tabs.find(e=>{let t=Y(e);return t&&s(t)===s(r)});e?(this.selectHostedTab(e.id),this.navigate(r)):n?.newTab===!1||this.activeTab&&!this.target?this.navigate(r):this.createTab(r)}else this.activeTab||this.createTab();this.embedded?this.requestUpdate():this.dockLayout.setOpen(!0)}}}get hostedTabs(){return this.tabs.map(e=>({id:e.id,label:X(e),url:Y(e)?.href,title:Y(e)?.href,icon:Pe(Y(e)?.reader.icon),className:e.view.status===`loading`?`is-connecting`:``}))}get activeHostedTabId(){return this.activeId}get hostedActions(){return J(r(`linkReader.newTab`),f.plus,()=>this.createTab(),this.tabs.length>=Z||!this.available||!this.readers.length)}async closeHostedTab(e){this.closeTab(e),await this.updateComplete}static{this.styles=Le}get activeTab(){return this.tabs.find(e=>e.id===this.activeId)}get target(){return Y(this.activeTab)}get panelPresented(){return!this.suppressed&&(this.embedded?this.presented:this.dockLayout.open)}connectedCallback(){super.connectedCallback(),this.embedded||(window.addEventListener(o,this.handleToggleRequest),this.dockLayout.setSuppressed(this.suppressed))}disconnectedCallback(){this.resetTabViews(),this.tabs=[],this.activeId=null,this.returnFocus=null,window.removeEventListener(o,this.handleToggleRequest),super.disconnectedCallback()}willUpdate(e){e.has(`embedded`)&&(window.removeEventListener(o,this.handleToggleRequest),!this.embedded&&this.isConnected&&window.addEventListener(o,this.handleToggleRequest)),e.has(`sessionKey`)&&e.get(`sessionKey`)!==void 0&&(this.resetTabViews(),this.tabs=[],this.activeId=null,this.urlDraft=``,this.invalidUrl=!1,this.tabLimitUrl=null,this.returnFocus=null,this.focusAddress=!1,this.scrollContent=!1),this.embedded&&!this.presented&&this.abortRequest();let t=e.get(`readers`),n=e.has(`readers`)&&(!t||t.length!==this.readers.length||t.some((e,t)=>e!==this.readers[t]));(e.has(`client`)||e.has(`available`)||e.has(`agentId`)||n)&&this.resetTabViews(),n&&this.available&&(this.tabs=this.tabs.flatMap(e=>{let t=Y(e);return t?c(t.href,this.readers)?(e.history=e.history.flatMap(e=>{let t=c(e.href,this.readers);return t?[t]:[]}),e.index=e.history.findIndex(e=>e.href===t.href),[e]):[]:this.readers.length>0?[e]:[]}),this.tabs.some(e=>e.id===this.activeId)||(this.activeId=this.tabs[0]?.id??null),this.urlDraft=this.target?.href??``,this.tabs.length===0&&t?.length&&this.closePanel()),e.has(`suppressed`)&&this.abortRequest(),this.embedded||(this.dockLayout.setSuppressed(this.suppressed),this.dockLayout.restoreOpenState(),this.dockLayout.syncReservation()),this.embedded&&this.panelPresented&&this.tabs.length===0&&this.available&&this.readers.length>0&&[`embedded`,`presented`,`sessionKey`,`available`].some(t=>e.has(t))&&(this.createTab(),this.focusAddress=!1),this.isConnected&&this.panelPresented&&this.activeTab?.view.status===`idle`&&this.loadDetail()}updated(){let e=JSON.stringify([this.activeId,this.available,this.readers.length,this.tabs.map(e=>[e.id,X(e),Y(e)?.href,Y(e)?.reader.icon,e.view.status])]);if(e!==this.hostedSignature&&(this.hostedSignature=e,this.dispatchEvent(new Event(Se,{bubbles:!0,composed:!0}))),!this.panelPresented)return;this.focusAddress&&(this.focusAddress=!1,this.renderRoot.querySelector(`.lr-url`)?.focus());let t=this.renderRoot.querySelector(`.lr-content:not([hidden])`);if(this.scrollContent&&t&&this.activeTab?.view.status===`ready`){this.scrollContent=!1,t.scrollTop=0;let e=this.target?new URL(this.target.href).hash.slice(1):``;[...t.querySelectorAll(`[id]`)].find(t=>t.id===e)?.scrollIntoView?.({block:`start`})}}abortRequest(){this.requestAbort?.abort(),this.requestAbort=null,this.activeTab?.view.status===`loading`&&(this.activeTab.view={status:`idle`}),this.refreshRequested=!1}setTabView(e,t){e.view.status===`ready`&&e.view.images?.dispose(),e.view=t}resetTabViews(){this.abortRequest();for(let e of this.tabs)this.setTabView(e,{status:`idle`})}selectHostedTab(e){e!==this.activeId&&this.tabs.some(t=>t.id===e)&&(this.abortRequest(),this.activeId=e,this.urlDraft=this.target?.href??``,this.invalidUrl=!1,this.tabLimitUrl=null,this.scrollContent=!1,this.requestUpdate())}createTab(e){if(this.tabs.length>=Z){this.tabLimitUrl=e?.href??null;return}this.abortRequest();let t={id:`link-reader-tab-`+ ++this.nextTabId,history:e?[e]:[],index:e?0:-1,view:{status:`idle`}};this.tabs.push(t),this.activeId=t.id,this.urlDraft=e?.href??``,this.invalidUrl=!1,this.tabLimitUrl=null,this.focusAddress=!e,this.scrollContent=!!e,this.embedded?this.requestUpdate():this.dockLayout.setOpen(!0)}closeTab(e){let t=this.tabs.findIndex(t=>t.id===e);if(t<0)return;let n=e===this.activeId;if(n&&this.abortRequest(),this.setTabView(this.tabs[t],{status:`idle`}),this.tabs.splice(t,1),this.tabLimitUrl=null,this.tabs.length===0){this.activeId=null,this.closePanel();return}if(n){this.activeId=null;let e=this.tabs[Math.min(t,this.tabs.length-1)];e&&this.selectHostedTab(e.id)}this.requestUpdate()}navigate(e){let t=this.activeTab;if(!t){this.createTab(e);return}let n=Y(t);n?.href!==e.href&&(this.abortRequest(),t.history=[...t.history.slice(0,t.index+1),e].slice(-30),t.index=t.history.length-1,(!n||s(n)!==s(e))&&this.setTabView(t,{status:`idle`})),this.urlDraft=e.href,this.invalidUrl=!1,this.focusAddress=!1,this.scrollContent=!0,this.requestUpdate()}closePanel(){this.abortRequest(),this.embedded?(this.onClose?.(),this.requestUpdate()):this.dockLayout.setOpen(!1),this.scrollContent=!1,this.focusAddress=!1,this.returnFocus?.isConnected&&this.returnFocus.focus({preventScroll:!0}),this.returnFocus=null}refresh(){this.abortRequest(),this.activeTab&&this.setTabView(this.activeTab,{status:`idle`}),this.refreshRequested=!0,this.requestUpdate()}goHistory(e){let t=this.activeTab;!t||t.index+e<0||t.index+e>=t.history.length||(this.abortRequest(),t.index+=e,this.setTabView(t,{status:`idle`}),this.urlDraft=this.target?.href??``,this.invalidUrl=!1,this.scrollContent=!0,this.requestUpdate())}commitUrl(e){e.preventDefault();let t=this.urlDraft.trim(),n=c(/^[a-z][a-z0-9+.-]*:/iu.test(t)?t:`https://`+t,this.readers);this.invalidUrl=!n,n&&this.navigate(n)}async loadDetail(){let e=this.target,t=this.activeTab,n=this.client,r=this.agentId,i=this.sessionKey,a=n?.connectionGeneration,o=n?.recoveryScope;if(!e||!t||!n||!this.available||!this.panelPresented)return;let s=new AbortController;this.requestAbort=s,t.view={status:`loading`};let c=()=>this.requestAbort===s&&!s.signal.aborted&&this.isConnected&&this.client===n&&this.agentId===r&&this.sessionKey===i&&n.connectionGeneration===a&&n.recoveryScope===o&&this.available&&this.panelPresented&&this.activeTab===t&&this.target?.href===e.href&&this.readers.includes(e.reader),l={url:e.href,...r?{agentId:r}:{},...this.refreshRequested?{refresh:!0}:{}};this.refreshRequested=!1,this.requestUpdate();try{let u=await n.request(e.reader.linkReader.detailMethod,l,{signal:s.signal});if(c()){if(!u||!Oe(e,u.url))throw Error(`Link document does not match the requested target`);let s=e.reader.linkReader.imageMethod,c=s?new k(n,s,()=>this.isConnected&&this.available&&this.client===n&&this.agentId===r&&this.sessionKey===i&&n.connectionGeneration===a&&n.recoveryScope===o&&this.tabs.includes(t)&&this.readers.includes(e.reader)&&t.view.status===`ready`&&t.view.detail===u):void 0;this.setTabView(t,{status:`ready`,detail:u,images:c}),this.requestUpdate()}}catch(e){c()&&(t.view={status:`error`,message:Te(e)},this.requestUpdate())}}render(){let e=this.activeTab,t=this.target;return!e||this.suppressed||!this.embedded&&!this.dockLayout.open?h:m`<section
      class="bp bp--${this.embedded?`embedded`:`right`} link-reader-panel"
      style=${this.embedded?h:`width:${this.dockLayout.width}px`}
      aria-label=${r(`linkReader.title`)}
      @keydown=${e=>{e.key===`Escape`&&!e.defaultPrevented&&(e.preventDefault(),e.stopPropagation(),this.closePanel())}}
    >
      ${this.embedded?h:this.dockLayout.renderResizer(`bp`,r(`linkReader.resize`))}
      ${this.embedded&&this.tabsInHeader?h:m`<header class="rail-header bp-header lr-tab-header">
              ${we({tabs:this.hostedTabs.map(e=>({...e,domId:e.id+`-label`,closeLabel:r(`linkReader.closeTab`,{title:e.label})})),activeId:this.activeId,ariaControls:`link-reader-tab-panel`,onSelect:e=>this.selectHostedTab(e),onClose:e=>this.closeTab(e),onNew:()=>this.createTab(),newLabel:r(`linkReader.newTab`),newDisabled:this.tabs.length>=Z})}
              ${this.embedded?h:J(r(`linkReader.close`),f.x,()=>this.closePanel())}
            </header>`}
      <form class="lr-toolbar" @submit=${e=>this.commitUrl(e)}>
        ${J(r(`linkReader.back`),f.chevronLeft,()=>this.goHistory(-1),e.index<=0)}
        ${J(r(`linkReader.forward`),f.chevronRight,()=>this.goHistory(1),e.index>=e.history.length-1)}
        ${J(r(`linkReader.refresh`),f.refresh,()=>this.refresh(),!t||!this.available||!this.client||e.view.status===`loading`)}
        <input
          class="lr-url"
          type="text"
          spellcheck="false"
          autocomplete="off"
          .value=${this.urlDraft}
          placeholder=${r(`linkReader.urlPlaceholder`)}
          aria-label=${r(`linkReader.urlPlaceholder`)}
          aria-invalid=${this.invalidUrl}
          @input=${e=>{e.currentTarget instanceof HTMLInputElement&&(this.urlDraft=e.currentTarget.value,this.invalidUrl=!1)}}
          @keydown=${e=>{e.key===`Escape`&&(e.preventDefault(),this.urlDraft=t?.href??``,this.invalidUrl=!1)}}
        />
        <button
          class="rail-header__action bp-icon lr-go"
          type="submit"
          title=${r(`linkReader.openUrl`)}
          aria-label=${r(`linkReader.openUrl`)}
        >
          ${f.chevronRight}
        </button>
        ${t?m`<a
                class="lr-external"
                href=${t.href}
                target="_blank"
                rel="noopener noreferrer"
                data-link-reader-external
                >${f.externalLink}<span
                  >${r(`linkReader.openExternal`,{provider:t.reader.label})}</span
                ></a
              >`:h}
      </form>
      ${this.invalidUrl?m`<p class="lr-note" role="alert">${r(`linkReader.invalidUrl`)}</p>`:h}
      ${this.tabLimitUrl?m`<p class="lr-note" role="alert">
              ${r(`linkReader.tabLimit`)}
              <a
                href=${this.tabLimitUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-link-reader-external
                >${r(`linkReader.openOriginal`)}</a
              >
            </p>`:h}
      <div
        id="link-reader-tab-panel"
        class="lr-panels"
        role="tabpanel"
        aria-labelledby=${this.embedded&&this.tabsInHeader?h:e.id+`-label`}
        aria-label=${this.embedded&&this.tabsInHeader?X(e):h}
      >
        ${ie(this.tabs,e=>e.id,e=>m`<div
              class="lr-content"
              tabindex="-1"
              ?hidden=${e.id!==this.activeId}
              aria-busy=${e.view.status===`loading`}
            >
              ${Fe(e,this.available&&!!this.client,()=>this.refresh())}
            </div>`)}
      </div>
    </section>`}},y([v({attribute:!1})],Q.prototype,`client`,void 0),y([v({type:Boolean})],Q.prototype,`available`,void 0),y([v()],Q.prototype,`agentId`,void 0),y([v({attribute:!1})],Q.prototype,`readers`,void 0),y([v({type:Boolean})],Q.prototype,`suppressed`,void 0),y([v({type:Boolean,reflect:!0})],Q.prototype,`embedded`,void 0),y([v({type:Boolean})],Q.prototype,`presented`,void 0),y([v({type:Boolean})],Q.prototype,`tabsInHeader`,void 0),y([v({attribute:!1})],Q.prototype,`sessionKey`,void 0),y([v({attribute:!1})],Q.prototype,`onClose`,void 0),y([_()],Q.prototype,`urlDraft`,void 0),y([_()],Q.prototype,`invalidUrl`,void 0),y([_()],Q.prototype,`tabLimitUrl`,void 0),customElements.get(`openclaw-link-reader-panel`)||customElements.define(`openclaw-link-reader-panel`,Q)})))()}$();
//# sourceMappingURL=link-reader-panel-DYi3G5qt.js.map