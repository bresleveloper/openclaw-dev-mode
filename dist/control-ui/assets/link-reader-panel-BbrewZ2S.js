import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Yi as t,ai as n}from"./control-ui-foundation-Ds5QQwGa.js";import{Gl as r,Jl as i,Rl as a,Xl as o,zl as s}from"./control-ui-core-DkXlmHxW.js";import{$ as c,X as l,Y as u,c as ee,ct as d,d as te,mt as f,nt as ne,s as re,u as ie,ut as p}from"./lit-runtime-DLvISeBM.js";import{Fi as m,Ii as h,Jr as ae,Ur as g,ai as oe,cr as _,ni as se,oi as ce,or as le,ri as ue,rr as de,ur as v}from"./control-ui-core-BdNTI4B-.js";import{M as fe,R as pe}from"./control-ui-boot-shared-HpKatDDu.js";import{Ar as me,Nr as he,Pr as ge,kr as y,nr as _e,rr as ve}from"./control-ui-boot-shared-C5a8_33C.js";import{M as ye,N as be}from"./markdown-runtime-B1-JWj3L.js";import{n as xe,t as Se}from"./dock-panel-styles-C50XO1Q5.js";import{a as Ce,i as we,n as Te,r as Ee,t as b}from"./panel-tab-strip-11P7jwyG.js";import{a as De,i as Oe,n as ke,o as x,r as Ae,s as S,t as C}from"./link-reader-response-kbZINFt_.js";var w,T,E,D,O;function k(){return(k=e((()=>{w=32,T=4,E=2796268,D=8388608,O=class{constructor(e,t,n){this.client=e,this.method=t,this.isCurrent=n,this.abort=new AbortController,this.cache=new Map,this.queue=[],this.active=0,this.bytes=0,this.load=e=>{let t=this.cache.get(e);if(t)return t;if(this.abort.signal.aborted||!this.isCurrent())return Promise.reject(Error(`Reader image is unavailable`));if(this.cache.size>=w)return Promise.resolve(e);let n=new Promise((t,n)=>{this.queue.push(()=>{this.request(e).then(t,()=>{!this.abort.signal.aborted&&this.isCurrent()?t(e):n(Error(`Reader image is unavailable`))}).finally(()=>{this.active--,this.drain()})})});return this.cache.set(e,n),this.drain(),n}}dispose(){this.abort.abort(),this.cache.clear(),this.drain()}drain(){for(;this.active<T&&this.queue.length;)this.active++,this.queue.shift()()}async request(e){if(this.abort.signal.aborted||!this.isCurrent())throw Error(`Reader image is unavailable`);let t=await this.client.request(this.method,{url:e},{signal:this.abort.signal});if(this.abort.signal.aborted||!this.isCurrent()||t?.url!==e||typeof t.dataUrl!=`string`||t.dataUrl.length>E||this.bytes+t.dataUrl.length>D||!/^data:image\/(?:png|jpeg|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/u.test(t.dataUrl))throw Error(`Reader image is unavailable`);return this.bytes+=t.dataUrl.length,t.dataUrl}}})))()}var A;function j(){return(j=e((()=>{u(),A=f`
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
  .lr-checks-chevron svg {
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
  .lr-check-symbol svg {
    width: 16px;
    height: 16px;
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
`})))()}function M(e,t){if(!e.trim())return null;try{let n=new URL(e,t);return[`https:`,`http:`,`mailto:`].includes(n.protocol)&&!n.username&&!n.password?n:null}catch{return null}}function N(e,t){let n=document.createElement(`a`);return n.href=e,n.textContent=t,n.target=`_blank`,n.rel=`noopener noreferrer`,n.referrerPolicy=`no-referrer`,n.dataset.linkReaderExternal=``,n}function je(e,t,n){let r=M(e.getAttribute(`src`)??``,t),i=e.alt.trim()||o(`linkReader.image`),a=document.createElement(`span`);a.className=`lr-image`;let s=document.createElement(`span`);s.className=`lr-image-caption`;let c=document.createElement(`span`);c.textContent=i,s.append(c);let l=e.closest(`a`),u=r?.hostname.replace(/\.+$/u,``)??``,ee=!u.includes(`.`)||/(?:^|\.)(?:localhost|local|internal|localdomain)$/u.test(u),d=r?.protocol===`https:`&&r.origin!==window.location.origin&&!ee&&!pe(u);if(r&&[`https:`,`http:`].includes(r.protocol)&&s.append(` · `,N(r.href,o(`linkReader.openImage`))),d&&r){let e=document.createElement(`img`);e.alt=i,e.crossOrigin=`anonymous`,e.referrerPolicy=`no-referrer`,e.loading=`lazy`,e.decoding=`async`;let t=()=>{e.hidden=!0,c.textContent=o(`linkReader.imageUnavailable`,{title:i}),c.setAttribute(`role`,`status`)};if(e.addEventListener(`error`,t,{once:!0}),l)a.append(e);else{let t=N(r.href,``);t.setAttribute(`aria-label`,o(`linkReader.openImageTitle`,{title:i})),t.append(e),a.append(t)}n?n(r.href).then(t=>{e.isConnected&&(e.src=t)},t):e.src=r.href}else c.textContent=o(`linkReader.imageUnavailable`,{title:i});e.replaceWith(a),l?l.after(s):a.append(s)}function P(e,t,n){return te([e,t,n,i.getLocale()],()=>{let r;try{r=V.render(e,B)}catch{r=`<pre>`+y(e)+`</pre>`}let i=H.sanitize(r,{RETURN_DOM_FRAGMENT:!0,ALLOWED_TAGS:U,ALLOWED_ATTR:[`href`,`src`,`alt`,`title`,`class`,`open`,`start`,`type`,`checked`,`disabled`],ALLOW_DATA_ATTR:!1,ALLOW_ARIA_ATTR:!1});for(let e of i.querySelectorAll(`a`)){let n=M(e.getAttribute(`href`)??``,t);n?(e.href=n.href,e.target=`_blank`,e.rel=`noopener noreferrer`,e.referrerPolicy=`no-referrer`):e.removeAttribute(`href`)}for(let e of i.querySelectorAll(`input`))e.type=`checkbox`,e.disabled=!0;for(let e of i.querySelectorAll(`img`))je(e,t,n);return i})}function F(e){if(!e)return l;let t=new Date(e);return c`<time datetime=${e} title=${e}
    >${Number.isNaN(t.getTime())?e:t.toLocaleString()}</time
  >`}function I(e,t){return c`<pre
    class="lr-diff"
    tabindex="0"
    aria-label=${o(`linkReader.diffLabel`,{filename:t})}
  ><code>${e.split(`
`).map(e=>{let t=e.startsWith(`+`)?`add`:e.startsWith(`-`)?`delete`:e.startsWith(`@@`)?`hunk`:`context`;return c`<span class=${`lr-diff-line lr-diff-line--`+t}>${e}</span>`})}</code></pre>`}function Me(e,t){return c`<details class="lr-file" ?open=${t}>
    <summary>
      <span class="lr-filename">${e.path}</span
      ><span class="lr-stats"
        ><span class="lr-add">+${e.additions}</span>
        <span class="lr-delete">−${e.deletions}</span></span
      >
    </summary>
    ${e.previousPath?c`<p class="lr-meta">
            ${o(`linkReader.renamedFrom`,{filename:e.previousPath})}
          </p>`:l}
    ${e.patch?I(e.patch,e.path):c`<p class="lr-note">${o(`linkReader.patchUnavailable`)}</p>`}
    ${e.patchTruncated?c`<p class="lr-note">${o(`linkReader.patchTruncated`)}</p>`:l}
  </details>`}function Ne(e,t,n){let r=e.context,i=[r?.path,r?.lineLabel].filter(Boolean).join(`:`),a=M(e.url,t)?.href,s=r?.replyUrl?M(r.replyUrl,t)?.href:void 0;return c`<article class="lr-comment" id=${e.id}>
    <header class="lr-meta">
      <strong>${e.author}</strong>
      <a
        href=${a??l}
        target="_blank"
        rel="noopener noreferrer"
        referrerpolicy="no-referrer"
        title=${o(`linkReader.commentPermalink`)}
        >${e.createdAt?F(e.createdAt):o(`linkReader.commentPermalink`)}</a
      >
      ${e.label?c`<span class="lr-comment-kind">${e.label}</span>`:l}
    </header>
    ${i||r?.label?c`<p class="lr-review-location">
            <a
              href=${a??l}
              target="_blank"
              rel="noopener noreferrer"
              referrerpolicy="no-referrer"
              >${i}</a
            >
            ${r?.label}
          </p>`:l}
    ${s?c`<a
            class="lr-meta"
            href=${s}
            target="_blank"
            rel="noopener noreferrer"
            referrerpolicy="no-referrer"
            >${r?.replyLabel??o(`linkReader.replyContext`)}</a
          >`:l}
    ${r?.diff?c`<details class="lr-file lr-review-diff">
            <summary>${o(`linkReader.reviewContext`)}</summary>
            ${I(r.diff,r.path??``)}${r.diffTruncated?c`<p class="lr-note">${o(`linkReader.patchTruncated`)}</p>`:l}
          </details>`:l}
    <div class="lr-markdown">${P(e.body,t,n)}</div>
    ${e.bodyTruncated?c`<p class="lr-note">${o(`linkReader.bodyTruncated`)}</p>`:l}
  </article>`}function L(e){switch(e){case`success`:return m.check;case`failure`:return m.circleX;case`pending`:return m.clock;case`unavailable`:return m.circleQuestionMark;default:return m.circle}}function R(e){return o({success:`linkReader.checkSuccess`,failure:`linkReader.checkFailure`,pending:`linkReader.checkPending`,neutral:`linkReader.checkNeutral`}[e])}function Pe(e,t){let n={success:`linkReader.checksSuccess`,failure:`linkReader.checksFailure`,pending:`linkReader.checksPending`,neutral:`linkReader.checksNeutral`,unavailable:`linkReader.checksUnavailable`},r=e.url?M(e.url,t)?.href:void 0;return c`<details
    class=${`lr-checks lr-checks--`+e.state}
    data-reader-section="checks"
    tabindex="-1"
    ?open=${e.state===`failure`}
  >
    <summary>
      <span class="lr-checks-icon" aria-hidden="true">${L(e.state)}</span>
      <span class="lr-checks-heading"
        ><strong>${o(n[e.state])}</strong
        ><span class="lr-meta">${e.summary}</span></span
      >
      <span class="lr-checks-chevron" aria-hidden="true">${m.chevronDown}</span>
      ${!e.truncated&&e.state!==`unavailable`&&e.items.length===e.total&&e.total>0?c`<span class="lr-checks-meter" aria-hidden="true"
              >${e.items.map(e=>c`<span class=${`lr-check-segment lr-check-segment--`+e.state}></span>`)}</span
            >`:l}
    </summary>
    <ul class="lr-check-list">
      ${e.items.map(e=>{let n=e.url?M(e.url,t)?.href:void 0;return c`<li class=${`lr-check lr-check--`+e.state}>
          <span class="lr-check-symbol" role="img" aria-label=${R(e.state)}
            >${L(e.state)}</span
          >
          <span class="lr-check-copy"
            >${n?c`<a
                    href=${n}
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerpolicy="no-referrer"
                    data-link-reader-external
                    >${e.name}${m.externalLink}</a
                  >`:c`<span>${e.name}</span>`}
            <span class="lr-meta">${e.detail??R(e.state)}</span>
          </span>
        </li>`})}
    </ul>
    ${e.truncated?c`<p class="lr-note">${o(`linkReader.checksTruncated`)}</p>`:l}
    <footer class="lr-checks-footer">
      ${e.commit?c`<code title=${o(`linkReader.checksCommit`,{commit:e.commit})}>${e.commit.slice(0,7)}</code>`:l}
      ${r?c`<a href=${r} target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" data-link-reader-external>${o(`linkReader.checksSource`)}${m.externalLink}</a>`:l}
    </footer>
  </details>`}function z(e,t,n){return c`<button
    type="button"
    @click=${t=>{let n=t.currentTarget;if(!(n instanceof HTMLButtonElement))return;let r=n.closest(`.lr-document`)?.querySelector(`[data-reader-section="${e}"]`);r instanceof HTMLDetailsElement&&(r.open=!0),r?.focus({preventScroll:!0}),r?.scrollIntoView({block:`start`})}}
  >
    ${t}${n===void 0?l:c`<span class="lr-count">${n}</span>`}
  </button>`}function Fe(e,t,n){let r=ke(e.authorUrl,e.url),i=e.coAuthors??[],a=Math.max(i.length,e.coAuthorCount??0)-i.length,s=i.map(e=>e.name).join(`, `)+(a?` +`+a:``);return c`<article class="lr-document">
    <header class="lr-document-header">
      <div class="lr-eyebrow">${e.subtitle??t.reader.label}</div>
      <h1>${e.title}</h1>
      <div class="lr-meta lr-item-meta">
        ${e.badge?c`<span class=${`lr-state lr-state--`+e.badge.tone}
                >${e.badge.label}</span
              >`:l}
        ${e.author?r?c`<a
                  href=${r}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-link-reader-external
                  >${o(`linkReader.byAuthor`,{author:e.author})}</a
                >`:c`<span>${o(`linkReader.byAuthor`,{author:e.author})}</span>`:l}
        ${s.trim()?c`<span class="lr-coauthors">${o(`linkReader.coAuthors`,{authors:s.trim()})}</span>`:l}
        ${F(e.createdAt)}
      </div>
      ${e.metadata?.length?c`<dl class="lr-metadata">
              ${e.metadata.map(({label:e,value:t,tone:n})=>c`<div class=${`lr-metric lr-metric--`+(n??`neutral`)}>
                    <dt>${e}</dt>
                    <dd>${t}</dd>
                  </div>`)}
            </dl>`:l}
    </header>
    <nav class="lr-section-nav" aria-label=${o(`linkReader.navigation`)}>
      ${z(`overview`,o(`linkReader.overview`))}
      ${e.checks?z(`checks`,o(`linkReader.checks`),e.checks.total):l}
      ${e.files?z(`files`,o(`linkReader.filesShort`),e.filesTotal??e.files.length):l}
      ${e.comments?z(`comments`,o(`linkReader.discussion`),e.commentsTotal??e.comments.length):l}
    </nav>
    ${e.checks?Pe(e.checks,e.url):l}
    ${e.partial?c`<p class="lr-note" role="status">${o(`linkReader.partial`)}</p>`:l}
    <section
      aria-label=${o(`linkReader.description`)}
      class="lr-description"
      data-reader-section="overview"
      tabindex="-1"
    >
      <div class="lr-markdown">
        ${e.body?P(e.body,e.url,n):c`<p class="lr-meta">${o(`linkReader.noDescription`)}</p>`}
      </div>
      ${e.bodyTruncated?c`<p class="lr-note">${o(`linkReader.bodyTruncated`)}</p>`:l}
    </section>
    ${e.files?c`<section
            aria-label=${o(`linkReader.files`)}
            class="lr-files"
            id="files"
            data-reader-section="files"
            tabindex="-1"
          >
            <h2>
              ${o(`linkReader.files`)}
              <span class="lr-count"
                >${e.files.length}${e.filesTotal!==void 0&&e.filesTotal!==e.files.length?` / `+e.filesTotal:``}</span
              >
            </h2>
            ${e.files.map(t=>Me(t,e.filesExpanded===!0))}
            ${e.filesTruncated?c`<p class="lr-note">${o(`linkReader.filesTruncated`)}</p>`:l}
            ${e.files.length===0&&!e.filesTruncated?c`<p class="lr-meta">${o(`linkReader.noFiles`)}</p>`:l}
          </section>`:l}
    ${e.comments?c`<section
            aria-label=${o(`linkReader.comments`)}
            class="lr-comments"
            data-reader-section="comments"
            tabindex="-1"
          >
            <h2>
              ${o(`linkReader.comments`)}
              <span class="lr-count"
                >${e.comments.length}${e.commentsTotal!==void 0&&e.commentsTotal!==e.comments.length?` / `+e.commentsTotal:``}</span
              >
            </h2>
            ${e.comments.map(t=>Ne(t,e.url,n))}
            ${e.commentsTruncated?c`<p class="lr-note">${o(`linkReader.commentsTruncated`)}</p>`:l}
            ${e.comments.length===0&&!e.commentsTruncated?c`<p class="lr-meta">${o(`linkReader.noComments`)}</p>`:l}
          </section>`:l}
  </article>`}var B,V,H,U;function W(){return(W=e((()=>{fe(),ye(),u(),ie(),r(),x(),h(),C(),ve(),he(),me(),j(),S(),B=ge({mode:`document`,codeBlockChrome:`none`,fileLinks:!1,interactiveImages:!1,assistantTranscriptRoleHeaders:!1}),V=_e();for(let e of[`html_inline`,`html_block`]){let t=V.renderer.rules[e];V.renderer.rules[e]=(e,n,r,i,a)=>{let o=e[n]?.content??``;return o.trimStart().startsWith(`<!--`)?y(o.replace(/<!--[\s\S]*?(?:-->|$)/gu,``)):/^<img\s[^<>]*>\s*$/iu.test(o)?o:t(e,n,r,i,a)}}H=be(window),U=`a.b.blockquote.br.code.del.details.div.em.h1.h2.h3.h4.h5.h6.hr.i.img.input.li.ol.p.pre.s.span.strong.summary.table.tbody.td.th.thead.tr.ul`.split(`.`)})))()}var G;function K(){return(K=e((()=>{u(),G=f`
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
  .bp-actions {
    padding-left: 0;
  }
  .bp-icon {
    cursor: default;
    flex: none;
    text-decoration: none;
  }
  .bp-icon svg {
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
  .lr-external svg {
    width: 15px;
    height: 15px;
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
  .lr-markdown .markdown-link-github__icon {
    display: inline-block;
    width: 12px;
    height: 12px;
  }
  .lr-markdown .markdown-code-block__lang {
    color: var(--muted);
    font-size: 11px;
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
`})))()}function q(e){return Object.entries(m).find(([t])=>t===e)?.[1]??m.link}function J(e,t,n,r=!1){return c`<button
    class="rail-header__action bp-icon"
    type="button"
    title=${e}
    aria-label=${e}
    ?disabled=${r}
    @click=${n}
  >
    ${t}
  </button>`}function Y(e){return e?.history[e.index]??null}function X(e){if(e.view.status===`ready`)return e.view.detail.title;let t=Y(e);return t?t.reader.label+` · `+new URL(t.href).pathname:o(`linkReader.newTab`)}function Ie(e,t,n){let r=Y(e);return r?!t||e.view.status===`error`?c`<div class="lr-status" role="alert">
      <h2>${o(`linkReader.unavailableTitle`)}</h2>
      <p>
        ${t?e.view.status===`error`?e.view.message:o(`linkReader.unavailable`):o(`linkReader.disconnected`)}
      </p>
      <button class="lr-retry" type="button" ?disabled=${!t} @click=${n}>
        ${o(`linkReader.retry`)}</button
      ><a href=${r.href} target="_blank" rel="noopener noreferrer" data-link-reader-external
        >${o(`linkReader.openExternal`,{provider:r.reader.label})}</a
      >
    </div>`:e.view.status===`ready`?Fe(e.view.detail,r,e.view.images?.load):c`<p class="lr-status" role="status">${o(`linkReader.loadingPreview`)}</p>`:c`<p class="lr-status">${o(`linkReader.urlPlaceholder`)}</p>`}var Le,Re;function ze(){return(ze=e((()=>{u(),r(),ue(),xe(),h(),W(),K(),b(),Le=se({storageKey:`openclaw.link-reader.panel.v1`,minHeight:240,minWidth:300,defaultDock:`right`,supportedDocks:[`right`],defaultHeight:420,defaultWidth:560}),Re=[Te,Se,G,A]})))()}var Z,Q;function $(){return($=e((()=>{u(),ne(),re(),r(),x(),s(),ce(),h(),Oe(),k(),ze(),C(),le(),Ce(),b(),ae(),S(),Z=10,Q=class extends a{constructor(...e){super(...e),this.client=null,this.available=!1,this.readers=de,this.suppressed=!1,this.embedded=!1,this.presented=!1,this.tabsInHeader=!1,this.sessionKey=``,this.hostedSignature=``,this.urlDraft=``,this.invalidUrl=!1,this.tabLimitUrl=null,this.tabs=[],this.activeId=null,this.nextTabId=0,this.requestAbort=null,this.returnFocus=null,this.focusContent=!1,this.focusAddress=!1,this.refreshRequested=!1,this.dockLayout=new oe(this,{layout:Le,reservationPrefix:`link-reader`,isAvailable:()=>this.tabs.length>0&&!this.suppressed&&!this.embedded,isFullscreen:()=>this.embedded}),this.onToggleRequest=e=>this.handleToggleRequest(e)}get hostedTabs(){return this.tabs.map(e=>({id:e.id,label:X(e),url:Y(e)?.href,title:Y(e)?.href,icon:q(Y(e)?.reader.icon),className:e.view.status===`loading`?`is-connecting`:``}))}get activeHostedTabId(){return this.activeId}get hostedActions(){return J(o(`linkReader.newTab`),m.plus,()=>this.createTab(),this.tabs.length>=Z||!this.available||!this.readers.length)}selectHostedTab(e){this.selectTab(e)}async closeHostedTab(e){this.closeTab(e),await this.updateComplete}static{this.styles=Re}get activeTab(){return this.tabs.find(e=>e.id===this.activeId)}get target(){return Y(this.activeTab)}get panelPresented(){return!this.suppressed&&(this.embedded?this.presented:this.dockLayout.open)}connectedCallback(){super.connectedCallback(),this.embedded||(window.addEventListener(g,this.onToggleRequest),this.dockLayout.setSuppressed(this.suppressed))}disconnectedCallback(){this.abortRequest();for(let e of this.tabs)this.setTabView(e,{status:`idle`});this.tabs=[],this.activeId=null,this.returnFocus=null,window.removeEventListener(g,this.onToggleRequest),super.disconnectedCallback()}willUpdate(e){if(e.has(`embedded`)&&(window.removeEventListener(g,this.onToggleRequest),!this.embedded&&this.isConnected&&window.addEventListener(g,this.onToggleRequest)),e.has(`sessionKey`)&&e.get(`sessionKey`)!==void 0){this.abortRequest();for(let e of this.tabs)this.setTabView(e,{status:`idle`});this.tabs=[],this.activeId=null,this.urlDraft=``,this.invalidUrl=!1,this.tabLimitUrl=null,this.returnFocus=null,this.focusAddress=!1,this.focusContent=!1}this.embedded&&!this.presented&&this.abortRequest();let t=e.get(`readers`),n=e.has(`readers`)&&(!t||t.length!==this.readers.length||t.some((e,t)=>e!==this.readers[t]));if(e.has(`client`)||e.has(`available`)||e.has(`agentId`)||n){this.abortRequest();for(let e of this.tabs)this.setTabView(e,{status:`idle`})}n&&this.available&&(this.tabs=this.tabs.flatMap(e=>{let t=Y(e);return t?v(t.href,this.readers)?(e.history=e.history.flatMap(e=>{let t=v(e.href,this.readers);return t?[t]:[]}),e.index=e.history.findIndex(e=>e.href===t.href),[e]):[]:this.readers.length>0?[e]:[]}),this.tabs.some(e=>e.id===this.activeId)||(this.activeId=this.tabs[0]?.id??null),this.urlDraft=this.target?.href??``,this.tabs.length===0&&t?.length&&this.closePanel()),e.has(`suppressed`)&&this.abortRequest(),this.embedded||(this.dockLayout.setSuppressed(this.suppressed),this.dockLayout.restoreOpenState(),this.dockLayout.syncReservation()),this.embedded&&this.panelPresented&&this.tabs.length===0&&this.available&&this.readers.length>0&&[`embedded`,`presented`,`sessionKey`,`available`].some(t=>e.has(t))&&this.createTab(),this.isConnected&&this.panelPresented&&this.activeTab?.view.status===`idle`&&this.loadDetail()}updated(){let e=JSON.stringify([this.activeId,this.available,this.readers.length,this.tabs.map(e=>[e.id,X(e),Y(e)?.href,Y(e)?.reader.icon,e.view.status])]);if(e!==this.hostedSignature&&(this.hostedSignature=e,this.dispatchEvent(new Event(we,{bubbles:!0,composed:!0}))),!this.panelPresented)return;this.focusAddress&&(this.focusAddress=!1,this.renderRoot.querySelector(`.lr-url`)?.focus());let t=this.renderRoot.querySelector(`.lr-content:not([hidden])`);if(this.focusContent&&t&&(t.focus(),this.activeTab?.view.status===`ready`)){this.focusContent=!1,t.scrollTop=0;let e=this.target?new URL(this.target.href).hash.slice(1):``;[...t.querySelectorAll(`[id]`)].find(t=>t.id===e)?.scrollIntoView?.({block:`start`})}}abortRequest(){this.requestAbort?.abort(),this.requestAbort=null,this.activeTab?.view.status===`loading`&&(this.activeTab.view={status:`idle`}),this.refreshRequested=!1}setTabView(e,t){e.view.status===`ready`&&e.view.images?.dispose(),e.view=t}selectTab(e){e!==this.activeId&&this.tabs.some(t=>t.id===e)&&(this.abortRequest(),this.activeId=e,this.urlDraft=this.target?.href??``,this.invalidUrl=!1,this.tabLimitUrl=null,this.focusContent=!1,this.requestUpdate())}createTab(e){if(this.tabs.length>=Z){this.tabLimitUrl=e?.href??null;return}this.abortRequest();let t={id:`link-reader-tab-`+ ++this.nextTabId,history:e?[e]:[],index:e?0:-1,view:{status:`idle`}};this.tabs.push(t),this.activeId=t.id,this.urlDraft=e?.href??``,this.invalidUrl=!1,this.tabLimitUrl=null,this.focusAddress=!e,this.focusContent=!!e,this.embedded?this.requestUpdate():this.dockLayout.setOpen(!0)}closeTab(e){let t=this.tabs.findIndex(t=>t.id===e);if(t<0)return;let n=e===this.activeId;if(n&&this.abortRequest(),this.setTabView(this.tabs[t],{status:`idle`}),this.tabs.splice(t,1),this.tabLimitUrl=null,this.tabs.length===0){this.activeId=null,this.closePanel();return}if(n){this.activeId=null;let e=this.tabs[Math.min(t,this.tabs.length-1)];e&&this.selectTab(e.id)}this.requestUpdate()}navigate(e){let t=this.activeTab;if(!t){this.createTab(e);return}let n=Y(t);n?.href!==e.href&&(this.abortRequest(),t.history=[...t.history.slice(0,t.index+1),e].slice(-30),t.index=t.history.length-1,(!n||_(n)!==_(e))&&this.setTabView(t,{status:`idle`})),this.urlDraft=e.href,this.invalidUrl=!1,this.focusContent=!0,this.requestUpdate()}handleToggleRequest(e){let n=e instanceof CustomEvent?e.detail:void 0,r=t(n)?n:null;if(r?.open===!1){this.closePanel();return}let i=typeof r?.url==`string`?v(r.url,this.readers):null;if(this.isConnected&&this.available&&this.client&&!this.suppressed&&(!this.embedded||this.presented)&&this.readers.length&&(r?.url===void 0||i)){if(e.preventDefault(),!this.panelPresented||this.embedded&&!this.returnFocus){let e=document.activeElement;this.returnFocus=r?.trigger instanceof HTMLElement?r.trigger:e instanceof HTMLElement&&e!==this?e:null}if(!i&&r?.newTab){this.createTab();return}if(i){let e=r?.newTab===!1?void 0:this.tabs.find(e=>{let t=Y(e);return t&&_(t)===_(i)});e?(this.selectTab(e.id),this.navigate(i)):r?.newTab===!1||this.activeTab&&!this.target?this.navigate(i):this.createTab(i)}else this.activeTab||this.createTab();this.embedded?this.requestUpdate():this.dockLayout.setOpen(!0)}}closePanel(){this.abortRequest(),this.embedded?(this.onClose?.(),this.requestUpdate()):this.dockLayout.setOpen(!1),this.focusContent=!1,this.focusAddress=!1,this.returnFocus?.isConnected&&this.returnFocus.focus({preventScroll:!0}),this.returnFocus=null}refresh(){this.abortRequest(),this.activeTab&&this.setTabView(this.activeTab,{status:`idle`}),this.refreshRequested=!0,this.requestUpdate()}goHistory(e){let t=this.activeTab;!t||t.index+e<0||t.index+e>=t.history.length||(this.abortRequest(),t.index+=e,this.setTabView(t,{status:`idle`}),this.urlDraft=this.target?.href??``,this.invalidUrl=!1,this.focusContent=!0,this.requestUpdate())}commitUrl(e){e.preventDefault();let t=this.urlDraft.trim(),n=v(/^[a-z][a-z0-9+.-]*:/iu.test(t)?t:`https://`+t,this.readers);this.invalidUrl=!n,n&&this.navigate(n)}async loadDetail(){let e=this.target,t=this.activeTab,n=this.client,r=this.agentId,i=this.sessionKey,a=n?.connectionGeneration,o=n?.recoveryScope;if(!e||!t||!n||!this.available||!this.panelPresented)return;let s=new AbortController;this.requestAbort=s,t.view={status:`loading`};let c=()=>this.requestAbort===s&&!s.signal.aborted&&this.isConnected&&this.client===n&&this.agentId===r&&this.sessionKey===i&&n.connectionGeneration===a&&n.recoveryScope===o&&this.available&&this.panelPresented&&this.activeTab===t&&this.target?.href===e.href&&this.readers.includes(e.reader),l={url:e.href,...r?{agentId:r}:{},...this.refreshRequested?{refresh:!0}:{}};this.refreshRequested=!1,this.requestUpdate();try{let u=await n.request(e.reader.linkReader.detailMethod,l,{signal:s.signal});if(c()){if(!u||!Ae(e,u.url))throw Error(`Link document does not match the requested target`);let s=e.reader.linkReader.imageMethod,c=s?new O(n,s,()=>this.isConnected&&this.available&&this.client===n&&this.agentId===r&&this.sessionKey===i&&n.connectionGeneration===a&&n.recoveryScope===o&&this.tabs.includes(t)&&this.readers.includes(e.reader)&&t.view.status===`ready`&&t.view.detail===u):void 0;this.setTabView(t,{status:`ready`,detail:u,images:c}),this.requestUpdate()}}catch(e){c()&&(t.view={status:`error`,message:De(e)},this.requestUpdate())}}render(){let e=this.activeTab,t=this.target;return!e||this.suppressed||!this.embedded&&!this.dockLayout.open?l:c`<section
      class="bp bp--${this.embedded?`embedded`:`right`} link-reader-panel"
      style=${this.embedded?l:`width:${this.dockLayout.width}px`}
      aria-label=${o(`linkReader.title`)}
      @keydown=${e=>{e.key===`Escape`&&!e.defaultPrevented&&(e.preventDefault(),e.stopPropagation(),this.closePanel())}}
    >
      ${this.embedded?l:this.dockLayout.renderResizer(`bp`,o(`linkReader.resize`))}
      ${this.embedded&&this.tabsInHeader?l:c`<header class="rail-header bp-header lr-tab-header">
              ${Ee({tabs:this.tabs.map(e=>({id:e.id,domId:e.id+`-label`,label:X(e),title:Y(e)?.href,icon:q(Y(e)?.reader.icon),className:e.view.status===`loading`?`is-connecting`:``,closeLabel:o(`linkReader.closeTab`,{title:X(e)})})),activeId:this.activeId,ariaControls:`link-reader-tab-panel`,onSelect:e=>this.selectTab(e),onClose:e=>this.closeTab(e),onNew:()=>this.createTab(),newLabel:o(`linkReader.newTab`),newDisabled:this.tabs.length>=Z})}
              ${this.embedded?l:J(o(`linkReader.close`),m.x,()=>this.closePanel())}
            </header>`}
      <form class="lr-toolbar" @submit=${e=>this.commitUrl(e)}>
        ${J(o(`linkReader.back`),m.chevronLeft,()=>this.goHistory(-1),e.index<=0)}
        ${J(o(`linkReader.forward`),m.chevronRight,()=>this.goHistory(1),e.index>=e.history.length-1)}
        ${J(o(`linkReader.refresh`),m.refresh,()=>this.refresh(),!t||!this.available||!this.client||e.view.status===`loading`)}
        <input
          class="lr-url"
          type="text"
          spellcheck="false"
          autocomplete="off"
          .value=${this.urlDraft}
          placeholder=${o(`linkReader.urlPlaceholder`)}
          aria-label=${o(`linkReader.urlPlaceholder`)}
          aria-invalid=${this.invalidUrl}
          @input=${e=>{e.currentTarget instanceof HTMLInputElement&&(this.urlDraft=e.currentTarget.value,this.invalidUrl=!1)}}
          @keydown=${e=>{e.key===`Escape`&&(e.preventDefault(),this.urlDraft=t?.href??``,this.invalidUrl=!1)}}
        />
        <button
          class="rail-header__action bp-icon lr-go"
          type="submit"
          title=${o(`linkReader.openUrl`)}
          aria-label=${o(`linkReader.openUrl`)}
        >
          ${m.chevronRight}
        </button>
        ${t?c`<a
                class="lr-external"
                href=${t.href}
                target="_blank"
                rel="noopener noreferrer"
                data-link-reader-external
                >${m.externalLink}<span
                  >${o(`linkReader.openExternal`,{provider:t.reader.label})}</span
                ></a
              >`:l}
      </form>
      ${this.invalidUrl?c`<p class="lr-note" role="alert">${o(`linkReader.invalidUrl`)}</p>`:l}
      ${this.tabLimitUrl?c`<p class="lr-note" role="alert">
              ${o(`linkReader.tabLimit`)}
              <a
                href=${this.tabLimitUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-link-reader-external
                >${o(`linkReader.openOriginal`)}</a
              >
            </p>`:l}
      <div
        id="link-reader-tab-panel"
        class="lr-panels"
        role="tabpanel"
        aria-labelledby=${this.embedded&&this.tabsInHeader?l:e.id+`-label`}
        aria-label=${this.embedded&&this.tabsInHeader?X(e):l}
      >
        ${ee(this.tabs,e=>e.id,e=>c`<div
              class="lr-content"
              tabindex="-1"
              ?hidden=${e.id!==this.activeId}
              aria-busy=${e.view.status===`loading`}
            >
              ${Ie(e,this.available&&!!this.client,()=>this.refresh())}
            </div>`)}
      </div>
    </section>`}},n([p({attribute:!1})],Q.prototype,`client`,void 0),n([p({type:Boolean})],Q.prototype,`available`,void 0),n([p()],Q.prototype,`agentId`,void 0),n([p({attribute:!1})],Q.prototype,`readers`,void 0),n([p({type:Boolean})],Q.prototype,`suppressed`,void 0),n([p({type:Boolean,reflect:!0})],Q.prototype,`embedded`,void 0),n([p({type:Boolean})],Q.prototype,`presented`,void 0),n([p({type:Boolean})],Q.prototype,`tabsInHeader`,void 0),n([p({attribute:!1})],Q.prototype,`sessionKey`,void 0),n([p({attribute:!1})],Q.prototype,`onClose`,void 0),n([d()],Q.prototype,`urlDraft`,void 0),n([d()],Q.prototype,`invalidUrl`,void 0),n([d()],Q.prototype,`tabLimitUrl`,void 0),customElements.get(`openclaw-link-reader-panel`)||customElements.define(`openclaw-link-reader-panel`,Q)})))()}$();
//# sourceMappingURL=link-reader-panel-BbrewZ2S.js.map