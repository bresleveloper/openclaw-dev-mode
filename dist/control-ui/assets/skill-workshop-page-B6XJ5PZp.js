import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{d as r,g as i,h as a,l as o,m as s,p as c,r as l,v as u}from"./lit-runtime-B2f-BITn.js";import{o as d,r as f}from"./i18n-Cb2Gon67.js";import{u as p}from"./session-key-O2mAF18C.js";import{Er as m,Wn as h,Yn as g,an as _,cn as v,in as ee,jn as te,l as ne,ln as re,on as y,sn as b}from"./index-DMlQdn8s.js";function x(e,t,n){let r=n.trim().toLowerCase();return e.filter(e=>!(t!==`all`&&e.status!==t||r&&!`${e.name} ${e.oneLine} ${e.slug}`.toLowerCase().includes(r)))}var S=`openclaw:control-ui:skill-workshop-mode:v1`,C=`openclaw:control-ui:skill-workshop-current-chat-revisions:v1`;function ie(){try{return d()?.getItem(S)===`board`?`board`:`today`}catch{return`today`}}function ae(e){try{d()?.setItem(S,e)}catch{}}function oe(){try{return d()?.getItem(C)===`true`}catch{return!1}}function se(e){try{d()?.setItem(C,String(e))}catch{}}var w=class extends s{constructor(...e){super(...e),this.files=[],this.activePath=``,this.query=``,this.label=`Support files`,this.listLabel=`Files`,this.searchPlaceholder=`Search files...`,this.contextLabel=``,this.readOnlyLabel=`read-only`,this.emptyTitle=`No files match`,this.emptySubtitle=`Try another file name or content search.`,this.copyLabel=`Copy file`,this.filteredFiles=[],this.derivedInputsReady=!1,this.codeChunks=[],this.resetScrollAfterUpdate=!0,this.handleQueryInput=e=>{let t=e.target.value??``;this.dispatchEvent(new CustomEvent(`file-preview-query-change`,{bubbles:!0,composed:!0,detail:t}))},this.preventItemPointerFocus=e=>{e.preventDefault()},this.handleKeydown=e=>{switch(e.key){case`Escape`:e.preventDefault(),e.stopPropagation(),this.emitClose();return;case`ArrowDown`:this.moveSelection(1,e);return;case`ArrowUp`:this.moveSelection(-1,e);default:}},this.emitClose=()=>{this.dispatchEvent(new CustomEvent(`file-preview-close`,{bubbles:!0,composed:!0}))}}static{this.styles=u`
    :host {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: block;
    }

    .backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(6px);
      animation: fade 140ms ease-out;
    }

    @keyframes fade {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes pop {
      from {
        transform: translate(-50%, -48%) scale(0.97);
        opacity: 0;
      }
      to {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
    }

    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: min(1100px, 92vw);
      height: min(780px, 86vh);
      background: var(--bg);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-lg);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: pop 160ms ease-out;
    }

    .head {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      background: var(--bg);
    }

    .search-icon {
      color: var(--muted);
      font-size: 18px;
    }

    .search {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-strong);
      font: inherit;
      font-size: 18px;
      font-weight: 400;
      padding: 4px 0;
    }

    .search:focus,
    .search:focus-visible {
      outline: none;
      border: none;
      box-shadow: none;
    }

    .search::placeholder {
      color: var(--muted);
    }

    .state {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--muted);
      padding: 5px 10px;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--bg-elevated);
    }

    .kbd {
      font-family: var(--mono);
      border: 1px solid var(--border);
      color: var(--muted);
    }

    .body {
      flex: 1;
      display: grid;
      grid-template-columns: 360px 1fr;
      min-height: 0;
    }

    .list {
      border-right: 1px solid var(--border);
      padding: 14px 10px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .list-section {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
      padding: 4px 12px 8px;
    }

    .item {
      display: grid;
      grid-template-columns: 16px 1fr auto;
      gap: 12px;
      align-items: center;
      padding: 12px 14px;
      border-radius: var(--radius-md);
      border: none;
      background: transparent;
      color: var(--text);
      cursor: pointer;
      font: inherit;
      outline: none;
      text-align: left;
    }

    .item:focus-visible {
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 55%, transparent);
    }

    .item:hover {
      background: var(--bg-elevated);
    }

    .item.is-active {
      background: var(--accent-subtle);
    }

    .item.is-active .item-name {
      color: var(--text-strong);
    }

    .item-icon {
      width: 16px;
      height: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--muted);
      opacity: 0.85;
    }

    .item.is-active .item-icon {
      color: var(--accent);
      opacity: 1;
    }

    .item-icon svg {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.5px;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .item-name {
      font-family: var(--mono);
      font-size: 14px;
      color: var(--text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-meta {
      color: var(--muted);
      font-size: 12px;
    }

    .empty-list {
      color: var(--muted);
      font-size: 13px;
      padding: 12px;
    }

    .detail {
      display: flex;
      flex-direction: column;
      min-width: 0;
      min-height: 0;
    }

    .detail.empty {
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
    }

    .detail-head {
      padding: 20px 24px 14px;
      border-bottom: 1px solid var(--border);
    }

    .detail-title-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    .title {
      flex: 1;
      min-width: 0;
      margin: 0;
      font-family: var(--mono);
      font-size: 22px;
      color: var(--text-strong);
      font-weight: 700;
      letter-spacing: -0.01em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chat-copy-btn {
      width: 32px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--bg-elevated);
      color: var(--muted);
      cursor: pointer;
    }

    .chat-copy-btn:hover {
      border-color: var(--border-strong);
      color: var(--text-strong);
    }

    .chat-copy-btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .chat-copy-btn__icon {
      display: inline-flex;
      width: 16px;
      height: 16px;
      position: relative;
    }

    .chat-copy-btn__icon-copy,
    .chat-copy-btn__icon-check {
      position: absolute;
      inset: 0;
      transition: opacity 150ms ease;
    }

    .chat-copy-btn__icon-check {
      opacity: 0;
    }

    .chat-copy-btn[data-copied="1"] .chat-copy-btn__icon-copy {
      opacity: 0;
    }

    .chat-copy-btn[data-copied="1"] .chat-copy-btn__icon-check {
      opacity: 1;
    }

    .chat-copy-btn[data-copying="1"] {
      opacity: 0;
      pointer-events: none;
    }

    .chat-copy-btn[data-error="1"] {
      border-color: var(--danger-subtle);
      background: var(--danger-subtle);
      color: var(--danger);
    }

    .chat-copy-btn[data-copied="1"] {
      border-color: var(--ok-subtle);
      background: var(--ok-subtle);
      color: var(--ok);
    }

    .chat-copy-btn svg {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.5px;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 11.5px;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      color: var(--muted);
    }

    .chip.accent {
      background: var(--accent-subtle);
      border-color: color-mix(in srgb, var(--accent) 30%, transparent);
      color: var(--accent);
    }

    .chip.ok {
      background: color-mix(in srgb, var(--ok) 12%, transparent);
      border-color: color-mix(in srgb, var(--ok) 30%, transparent);
      color: var(--ok);
    }

    .detail-body {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px 24px 24px;
    }

    .code-content {
      min-width: 0;
    }

    .code-chunk {
      margin: 0;
      min-width: 0;
      font-family: var(--mono);
      font-size: 13px;
      line-height: 1.7;
      color: var(--text);
      white-space: pre-wrap;
      word-break: break-word;
      content-visibility: auto;
      contain-intrinsic-block-size: auto 1414px;
    }

    .foot {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 12px 20px;
      border-top: 1px solid var(--border);
      background: var(--bg);
      font-size: 12px;
      color: var(--muted);
    }

    .foot-group {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .kbd {
      font-size: 10.5px;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--bg-elevated);
      color: var(--text);
    }

    .spacer {
      flex: 1;
    }

    .button {
      height: 36px;
      padding: 0 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      background: var(--bg-elevated);
      color: var(--text);
      font-weight: 600;
      cursor: pointer;
    }

    .button:hover {
      border-color: var(--border-strong);
      color: var(--text-strong);
    }

    .empty-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-strong);
      margin: 0 0 8px;
    }

    .empty-subtitle {
      margin: 0;
      font-size: 13px;
      color: var(--muted);
      max-width: 380px;
    }
  `}willUpdate(e){if(!(!this.derivedInputsReady||e.has(`activePath`)||e.has(`query`)||e.has(`files`)))return;this.derivedInputsReady=!0,this.filteredFiles=this.filterFiles();let t=this.resolveActiveFile(this.filteredFiles);this.activeFile=t;let n=t?.contents;n!==this.codeSource&&(this.codeSource=n,this.codeChunks=n===void 0?[]:ce(n)),this.resetScrollAfterUpdate=!0}render(){let e=this.filteredFiles,t=this.activeFile,n=e.length===this.files.length?`${this.files.length} files`:`${e.length}/${this.files.length} files`;return i`
      <div class="backdrop" @click=${this.emitClose}></div>
      <div
        class="modal"
        role="dialog"
        aria-label=${this.label}
        aria-modal="true"
        tabindex="-1"
        @keydown=${this.handleKeydown}
      >
        <header class="head">
          <span class="search-icon">⌕</span>
          <input
            class="search"
            placeholder=${this.searchPlaceholder}
            .value=${this.query}
            @input=${this.handleQueryInput}
          />
          <span class="state">${n}</span>
        </header>
        <div class="body">
          <aside class="list">
            <div class="list-section">${this.listLabel} · ${e.length}</div>
            ${e.length===0?i`<div class="empty-list">No files match.</div>`:e.map(e=>i`
                    <button
                      class="item ${e.path===t?.path?`is-active`:``}"
                      @pointerdown=${this.preventItemPointerFocus}
                      @mousedown=${this.preventItemPointerFocus}
                      @click=${()=>this.emitSelect(e.path)}
                    >
                      <span class="item-icon">${D(e.path)}</span>
                      <span class="item-name">${e.path}</span>
                      <span class="item-meta">${e.size}</span>
                    </button>
                  `)}
          </aside>
          ${t?this.renderFile(t):this.renderEmpty()}
        </div>
        <footer class="foot">
          <span class="foot-group"><span class="kbd">↑↓</span> navigate</span>
          <span class="spacer"></span>
          <button class="button" @click=${this.emitClose}>
            Close <span class="kbd">esc</span>
          </button>
        </footer>
      </div>
    `}renderFile(e){return i`
      <section class="detail">
        <div class="detail-head">
          <div class="detail-title-row">
            <h2 class="title">${e.path}</h2>
            ${e.contents?te(e.contents,this.copyLabel):``}
          </div>
          <div class="chips">
            <span class="chip accent">${le(e.path)}</span>
            <span class="chip">${e.size}</span>
            <span class="chip">${this.readOnlyLabel}</span>
            ${this.contextLabel?i`<span class="chip ok">${this.contextLabel}</span>`:``}
          </div>
        </div>
        <div class="detail-body">
          <div class="code-content">
            ${this.codeChunks.map((e,t)=>i`<pre class="code-chunk" data-chunk=${t}>${e}</pre>`)}
          </div>
        </div>
      </section>
    `}renderEmpty(){return i`
      <section class="detail empty">
        <p class="empty-title">${this.emptyTitle}</p>
        <p class="empty-subtitle">${this.emptySubtitle}</p>
      </section>
    `}filterFiles(){let e=this.query.trim().toLowerCase();return e?this.files.filter(t=>`${t.path}\n${t.contents}`.toLowerCase().includes(e)):this.files}resolveActiveFile(e){return e.find(e=>e.path===this.activePath)??e[0]}firstUpdated(){this.focusModal()}connectedCallback(){super.connectedCallback(),this.resetScrollAfterUpdate=!0,this.requestUpdate()}updated(e){if(this.resetScrollAfterUpdate){this.resetScrollAfterUpdate=!1;let e=this.detailBody;e&&(e.scrollTop=0,e.scrollLeft=0)}(e.has(`activePath`)||e.has(`query`)||e.has(`files`))&&this.scrollActiveFileIntoView()}focusModal(){(this.searchInput??this.shadowRoot?.querySelector(`.modal`))?.focus({preventScroll:!0})}moveSelection(e,t){t.preventDefault(),t.stopPropagation();let n=this.filterFiles();if(n.length===0)return;let r=this.resolveActiveFile(n),i=r?n.findIndex(e=>e.path===r.path):-1,a=n[Math.max(0,Math.min(n.length-1,i+e))];a&&a.path!==r?.path&&this.emitSelect(a.path)}scrollActiveFileIntoView(){this.updateComplete.then(()=>{this.isConnected&&this.shadowRoot?.querySelector(`.item.is-active`)?.scrollIntoView({block:`nearest`})}).catch(()=>{})}emitSelect(e){this.dispatchEvent(new CustomEvent(`file-preview-select`,{bubbles:!0,composed:!0,detail:e})),this.focusModal()}};n([c({attribute:!1})],w.prototype,`files`,void 0),n([c()],w.prototype,`activePath`,void 0),n([c()],w.prototype,`query`,void 0),n([c()],w.prototype,`label`,void 0),n([c()],w.prototype,`listLabel`,void 0),n([c()],w.prototype,`searchPlaceholder`,void 0),n([c()],w.prototype,`contextLabel`,void 0),n([c()],w.prototype,`readOnlyLabel`,void 0),n([c()],w.prototype,`emptyTitle`,void 0),n([c()],w.prototype,`emptySubtitle`,void 0),n([c()],w.prototype,`copyLabel`,void 0),n([r(`.search`)],w.prototype,`searchInput`,void 0),n([r(`.detail-body`)],w.prototype,`detailBody`,void 0);var T=64;function ce(e){let t=e.split(`
`),n=[];for(let e=0;e<t.length;e+=T)n.push(t.slice(e,e+T).join(`
`));return n}function le(e){let t=e.split(`.`).pop()?.toLowerCase()??``;return{md:`Markdown`,txt:`Text`,json:`JSON`,yaml:`YAML`,yml:`YAML`,ts:`TypeScript`,js:`JavaScript`,py:`Python`,sh:`Shell`}[t]??(t?t.toUpperCase():`File`)}customElements.get(`openclaw-file-preview-modal`)||customElements.define(`openclaw-file-preview-modal`,w);var E=new Set(`ts.tsx.js.jsx.mjs.cjs.py.sh.bash.zsh.rb.go.rs.java.kt.swift.c.cc.cpp.h.hpp.json.yaml.yml.toml.xml.html.css.scss.sql`.split(`.`));function D(e){let t=e.split(`.`).pop()?.toLowerCase()??``;return E.has(t)?m.fileCode:m.fileText}var O=[`all`,`pending`,`applied`,`rejected`,`quarantined`,`stale`],k={all:`All`,pending:`Pending`,applied:`Applied`,rejected:`Rejected`,quarantined:`Quarantined`,stale:`Stale`},A=3,j=120,M={today:`Today`,yesterday:`Yesterday`,earlier:`Earlier this week`};function N(e){let t=x(e.proposals,e.statusFilter,e.query),n=t.find(t=>t.key===e.selectedKey)??t[0],r=Se(t),s=n&&e.filePreviewKey?n.supportFiles.find(t=>t.path===e.filePreviewKey):null,c=e.revisionKey?e.proposals.find(t=>t.key===e.revisionKey):null,l=e.proposals.filter(e=>e.status===`pending`),u=n??l[0]??e.proposals[0],d=e.proposals.length===0&&!e.loading&&!e.error?pe(e):e.mode===`today`?me(e,u,l):F(e,r,n);return i`
    <section class="skill-workshop sw-mode-${e.mode}">
      ${e.error?i`<div class="sw-error" role="status">${e.error}</div>`:a}
      <div class="sw-view" data-mode=${e.mode}>
        ${o(e.mode,i`<div class="sw-view__pane">${d}</div>`)}
      </div>
    </section>
    ${s&&n?i`
          <openclaw-file-preview-modal
            .files=${n.supportFiles}
            .activePath=${s.path}
            .query=${e.filePreviewQuery}
            .contextLabel=${`in ${n.slug}`}
            @file-preview-query-change=${t=>e.onFilePreviewQueryChange(t.detail)}
            @file-preview-select=${t=>e.onPreviewFile(n.key,t.detail)}
            @file-preview-close=${e.onClosePreview}
          ></openclaw-file-preview-modal>
        `:a}
    ${c?P(e,c):a}
  `}function P(e,t){let n=e.actionBusy?.key===t.key&&e.actionBusy.action===`revise`,r=e.revisionDraft.trim().length>0&&!e.actionBusy,o=e.mode===`board`?`Revise`:`Tweak`;return i`
    <div class="sw-revision-backdrop" role="presentation" @click=${e.onRevisionCancel}>
      <section
        class="sw-revision-dialog ${n?`sw-revision-dialog--sending`:``}"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sw-revision-title"
        @click=${e=>e.stopPropagation()}
      >
        <div class="sw-revision-dialog__head">
          <div>
            <div class="sw-revision-dialog__eyebrow">${o} proposal</div>
            <h2 id="sw-revision-title">${t.slug}</h2>
          </div>
          <openclaw-tooltip content="Close">
            <button
              class="sw-revision-dialog__close"
              aria-label="Close"
              ?disabled=${!!e.actionBusy}
              @click=${e.onRevisionCancel}
            >
              ×
            </button>
          </openclaw-tooltip>
        </div>
        <p class="sw-revision-dialog__copy">
          Tell the agent what should change. The proposal stays pending and the workshop will create
          a revised version.
        </p>
        <textarea
          class="sw-revision-dialog__input"
          autofocus
          placeholder="Example: Make this use Gmail labels instead of unread search, and add a safer dry-run step."
          .value=${e.revisionDraft}
          ?disabled=${!!e.actionBusy}
          @input=${t=>e.onRevisionDraftChange(t.target.value??``)}
        ></textarea>
        ${n?i`
              <div class="sw-revision-dialog__status" role="status">
                <span class="sw-revision-dialog__status-dot" aria-hidden="true"></span>
                <span>Preparing revision handoff</span>
              </div>
            `:a}
        <div class="sw-revision-dialog__actions">
          <button
            class="sw-btn sw-btn--ghost"
            ?disabled=${!!e.actionBusy}
            @click=${e.onRevisionCancel}
          >
            Cancel
          </button>
          <button
            class="sw-btn sw-btn--primary ${n?`is-busy`:``}"
            ?disabled=${!r}
            @click=${()=>e.onRevisionSubmit(t.key)}
          >
            ${n?`Sending…`:`Send revision`}
          </button>
        </div>
      </section>
    </div>
  `}function F(e,t,n){return i`
    ${z(e)}
    <div class="sw-triage" style=${l({"--sw-queue-width":`${e.queueWidth}px`})}>
      ${B(e,t,n)} ${I(e)}
      ${n?H(e,n):ue(e)}
    </div>
  `}function I(e){return i`
    <div
      class="sw-queue-resizer"
      role="separator"
      aria-label="Resize proposal list"
      aria-orientation="vertical"
      tabindex="0"
      @pointerdown=${t=>L(t,e)}
      @keydown=${t=>R(t,e)}
    ></div>
  `}function L(e,t){e.preventDefault(),e.stopPropagation();let n=e.clientX,r=t.queueWidth,i=document.body,a=i.style.cursor,o=i.style.userSelect;i.style.cursor=`col-resize`,i.style.userSelect=`none`;let s=()=>{window.removeEventListener(`pointermove`,c),window.removeEventListener(`pointerup`,l),window.removeEventListener(`pointercancel`,l),i.style.cursor=a,i.style.userSelect=o},c=e=>{t.onQueueWidthChange(r+e.clientX-n)},l=()=>{s()};window.addEventListener(`pointermove`,c),window.addEventListener(`pointerup`,l),window.addEventListener(`pointercancel`,l)}function R(e,t){if(e.key!==`ArrowLeft`&&e.key!==`ArrowRight`)return;e.preventDefault();let n=e.key===`ArrowLeft`?-24:24;t.onQueueWidthChange(t.queueWidth+n)}function z(e){return i`
    <div class="sw-lifecycle-tabs">
      ${O.map(t=>{let n=e.statusFilter===t,r=e.counts[t]??0;return i`
          <button
            class="sw-lifecycle-tab ${n?`is-active`:``}"
            @click=${()=>e.onStatusFilterChange(t)}
          >
            ${k[t]} <span class="sw-lifecycle-tab__count">${r}</span>
          </button>
        `})}
    </div>
  `}function B(e,t,n){let r=t.reduce((e,t)=>e+t.items.length,0);return i`
    <aside class="sw-queue">
      <div class="sw-queue__search">
        <input
          placeholder="Search proposals…"
          .value=${e.query}
          @input=${t=>e.onQueryChange(t.target.value??``)}
        />
      </div>
      <div class="sw-queue__body">
        ${r===0?i`<div class="sw-queue__empty">${Ce(e)}</div>`:t.map(t=>i`
                <div class="sw-queue__group">
                  ${t.label} <span class="sw-queue__group-pill">${t.items.length}</span>
                </div>
                ${t.items.map(t=>V(e,t,n))}
              `)}
      </div>
    </aside>
  `}function V(e,t,n){let r=n?.key===t.key;return i`
    <button
      class="sw-row ${t.isNew?`is-new`:`is-seen`} ${r?`is-selected`:``}"
      @click=${()=>e.onSelect(t.key)}
    >
      <span class="sw-row__dot"></span>
      <span>
        <span class="sw-row__title">${t.name}</span>
        <span class="sw-row__desc">${t.oneLine}</span>
      </span>
      <span class="sw-row__meta">${t.ageLabel}</span>
    </button>
  `}function H(e,t){let n=t.updatedAt&&t.updatedAt>t.createdAt?t.updatedAt:null,r=n?`Edited ${X(n)}`:`Created ${X(t.createdAt)}`,o=e.inspectingKey===t.key&&!t.body;return i`
    <div class="sw-detail">
      <div class="sw-detail__head">
        <div class="sw-detail__head-left">
          <h1 class="sw-detail__title">${t.name}</h1>
          <div class="sw-detail__one-line">${t.oneLine}</div>
          <div class="sw-detail__meta">
            <span>${r}</span>
            <span>·</span>
            <span>v${t.version}</span>
            <span>·</span>
            ${t.supportFiles.length>0?i`<button
                  class="sw-detail__meta-link"
                  @click=${()=>e.onPreviewFile(t.key,t.supportFiles[0].path)}
                >
                  ${t.supportFiles.length} support files
                </button>`:i`<span>0 support files</span>`}
          </div>
        </div>
        <div class="sw-detail__nav">
          <openclaw-tooltip content="Previous">
            <button aria-label="Previous" @click=${e.onPrev}>↑</button>
          </openclaw-tooltip>
          <openclaw-tooltip content="Next">
            <button aria-label="Next" @click=${e.onNext}>↓</button>
          </openclaw-tooltip>
        </div>
      </div>

      <div class="sw-detail__body">
        <div class="sw-body-card">
          <h1>${t.slug}</h1>
          ${o?i`<p class="sw-muted">Loading proposal…</p>`:xe(t.body)}
        </div>

        ${t.supportFiles.length>0?i`
              <div class="sw-section" style="margin-top: 18px;">
                <h3 class="sw-section__label">Support files</h3>
                <div class="sw-files">
                  ${t.supportFiles.map(n=>i`
                      <button
                        class="sw-file"
                        @click=${()=>e.onPreviewFile(t.key,n.path)}
                      >
                        <span>📄</span>
                        <span class="sw-file__name">${n.path}</span>
                        <span class="sw-file__size"
                          >${n.size} <span class="sw-file__hint">· click to preview</span></span
                        >
                      </button>
                    `)}
                </div>
              </div>
            `:a}
      </div>

      ${e.actionNotice?.key===t.key?U(e.actionNotice):a}
      ${t.status===`pending`?W(e,t):a}
    </div>
  `}function U(e){return i`
    <div class="sw-action-toast" role="status" aria-live="polite">
      <span>${e.label}</span>
      <strong>${e.slug}</strong>
      <span>·</span>
    </div>
  `}function W(e,t){let n=e.actionBusy?.key===t.key?e.actionBusy.action:null,r=!!e.actionBusy;return i`
    <div class="sw-action-bar" aria-busy=${n?`true`:`false`}>
      <button
        class="sw-btn sw-btn--primary ${n===`apply`?`is-busy`:``}"
        ?disabled=${r}
        @click=${()=>e.onApply(t.key)}
      >
        ${n===`apply`?`Applying…`:`Apply`}
      </button>
      <button
        class="sw-btn ${n===`revise`?`is-busy`:``}"
        ?disabled=${r}
        @click=${()=>e.onRevise(t.key)}
      >
        ${n===`revise`?`Opening…`:`Revise`}
      </button>
      <button
        class="sw-btn sw-btn--ghost sw-btn--danger ${n===`reject`?`is-busy`:``}"
        ?disabled=${r}
        @click=${()=>e.onReject(t.key)}
      >
        ${n===`reject`?`Rejecting…`:`Reject`}
      </button>
    </div>
  `}function ue(e){let t=de(e);return i`
    <div class="sw-detail sw-detail--empty">
      <div class="sw-filter-empty">
        <div class="sw-filter-empty__icon" aria-hidden="true">
          ${fe(t.icon)}
        </div>
        <p class="sw-empty__title">${t.title}</p>
        <p class="sw-empty__sub">${t.body}</p>
      </div>
    </div>
  `}function de(e){if(e.query.trim())return{icon:`search`,title:`No matching proposals`,body:`Clear the search or try a different keyword.`};switch(e.statusFilter){case`pending`:return{icon:`clock`,title:`No pending proposals`,body:`New drafts will appear here when they need review.`};case`applied`:return{icon:`check`,title:`Nothing applied yet`,body:`Use a pending proposal and it will appear here as a live skill.`};case`rejected`:return{icon:`x`,title:`No rejected proposals`,body:`Skipped proposals will stay here for a clean review history.`};case`quarantined`:return{icon:`shield`,title:`Nothing quarantined`,body:`Scanner-blocked or safety-held proposals will appear here.`};case`stale`:return{icon:`refresh`,title:`No stale proposals`,body:`Proposals that can no longer apply cleanly will appear here.`};case`all`:return{icon:`search`,title:`No proposals here`,body:`Skill Workshop proposals will appear here when your agent drafts them.`}}return{icon:`search`,title:`No proposals here`,body:`Skill Workshop proposals will appear here when your agent drafts them.`}}function fe(e){switch(e){case`clock`:return i`
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8"></circle>
          <path d="M12 7v5l3 2"></path>
        </svg>
      `;case`check`:return i`
        <svg viewBox="0 0 24 24">
          <path d="M5 12.5l4 4L19 7"></path>
        </svg>
      `;case`x`:return i`
        <svg viewBox="0 0 24 24">
          <path d="M7 7l10 10"></path>
          <path d="M17 7L7 17"></path>
        </svg>
      `;case`shield`:return i`
        <svg viewBox="0 0 24 24">
          <path d="M12 3l7 3v5c0 4.2-2.8 7.8-7 10-4.2-2.2-7-5.8-7-10V6l7-3z"></path>
          <path d="M9 12l2 2 4-5"></path>
        </svg>
      `;case`refresh`:return i`
        <svg viewBox="0 0 24 24">
          <path d="M17 2v5h-5"></path>
          <path d="M7 22v-5h5"></path>
          <path d="M19 10a7 7 0 0 0-12-4l-2 2"></path>
          <path d="M5 14a7 7 0 0 0 12 4l2-2"></path>
        </svg>
      `;case`search`:return i`
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="6"></circle>
          <path d="M16 16l4 4"></path>
        </svg>
      `}return a}function pe(e){return i`
    <div class="sw-empty-state">
      <section class="sw-empty-state__panel" aria-label="No Skill Workshop proposals">
        <div class="sw-empty-state__glyph" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p class="sw-empty-state__eyebrow">Skill Workshop</p>
        <h2>No proposals yet</h2>
        <p>${G(e,`Your agent`)} hasn't drafted any skill proposals.</p>
        <div class="sw-empty-state__footer">New proposals will appear here for review.</div>
      </section>
    </div>
  `}function G(e,t){return e.workshopAgentName.trim()||e.assistantName.trim()||t}function me(e,t,n){if(!t)return i`
      <div class="sw-today sw-today--empty">
        <p class="sw-empty__title">Nothing waiting today</p>
        <p class="sw-empty__sub">
          Your agent hasn't drafted anything new. Switch to Board to browse history.
        </p>
      </div>
    `;let r=Math.max(0,n.findIndex(e=>e.key===t.key)),o=Math.max(n.length,1),s=n.filter(e=>e.key!==t.key).slice(0,3),c=e.proposals.filter(e=>e.status===`applied`).slice(0,3),l=t.isNew?`NEW`:t.status===`pending`?`WAITING`:`REVIEWED`,u=t.ageLabel,d=be(Date.now()),f=t.status===`pending`,p=e.actionBusy?.key===t.key?e.actionBusy.action:null,m=!!e.actionBusy,h=G(e,`agent`);return i`
    <div class="sw-today">
      <div class="sw-today__head">
        <div class="sw-today__date">${d}</div>
        <h1 class="sw-today__h1">${n.length} proposals waiting</h1>
        ${n.length===0?i`<div class="sw-today__sub">Browse what's already applied.</div>`:a}
        ${n.length>0?i`
              <div class="sw-today__progress">
                <span>${r+1} of ${o}</span>
                <div class="sw-today__dots">
                  ${n.map((e,t)=>i`
                      <span
                        class="sw-today__dot ${t<r?`is-done`:t===r?`is-now`:``}"
                      ></span>
                    `)}
                </div>
              </div>
            `:a}
      </div>

      <article class="sw-today__hero">
        <div class="sw-today__label">
          <span class="sw-today__ping"></span>
          ${l} · ${u}
        </div>
        <h2 class="sw-today__name">${t.slug}</h2>
        <p class="sw-today__one-liner">${t.oneLine}</p>

        ${he(t)}

        <div class="sw-today__author">
          <span class="sw-today__avatar">v${t.version}</span>
          <span>
            Drafted by <strong>${h}</strong> · ${u}.
            ${t.supportFiles.length>0?i`
                  <button
                    class="sw-today__files-link"
                    @click=${()=>e.onPreviewFile(t.key,t.supportFiles[0].path)}
                  >
                    ${t.supportFiles.length}
                    ${t.supportFiles.length===1?`support file`:`support files`}
                  </button>
                  come with it.
                `:a}
          </span>
        </div>

        ${f?i`
              <div class="sw-today__actions" aria-busy=${p?`true`:`false`}>
                <button
                  class="sw-today__big sw-today__big--primary ${p===`apply`?`is-busy`:``}"
                  ?disabled=${m}
                  @click=${()=>e.onApply(t.key)}
                >
                  ${p===`apply`?`Applying…`:`Use it`}
                  <span class="sw-today__big-sub">Add to your skills</span>
                </button>
                <button
                  class="sw-today__big sw-today__big--tweak ${p===`revise`?`is-busy`:``}"
                  ?disabled=${m}
                  @click=${()=>e.onRevise(t.key)}
                >
                  ${p===`revise`?`Opening…`:`Tweak it`}
                  <span class="sw-today__big-sub">Ask the agent to change something</span>
                </button>
                <button
                  class="sw-today__big sw-today__big--skip ${p===`reject`?`is-busy`:``}"
                  ?disabled=${m}
                  @click=${()=>e.onReject(t.key)}
                >
                  ${p===`reject`?`Skipping…`:`Skip`}
                  <span class="sw-today__big-sub">Not for me</span>
                </button>
              </div>
            `:a}
        ${e.actionNotice?.key===t.key?U(e.actionNotice):a}
      </article>

      ${s.length>0?i`
            <section class="sw-today__section">
              <header class="sw-today__section-head">
                <h3>Up next · ${n.length-1} more waiting</h3>
                <button class="sw-today__link" @click=${()=>e.onModeChange(`board`)}>
                  See all proposals →
                </button>
              </header>
              <div class="sw-today__upnext">
                ${s.map(t=>i`
                    <button class="sw-today__mini" @click=${()=>e.onSelect(t.key)}>
                      <div class="sw-today__mini-name">${t.slug}</div>
                      <div class="sw-today__mini-desc">${t.oneLine}</div>
                      <div class="sw-today__mini-meta">${t.ageLabel}</div>
                    </button>
                  `)}
              </div>
            </section>
          `:a}
      ${c.length>0?i`
            <section class="sw-today__section">
              <header class="sw-today__section-head">
                <h3>Your collection · ${e.counts.applied} in use</h3>
                <button
                  class="sw-today__link sw-today__link--muted"
                  @click=${()=>e.onModeChange(`board`)}
                >
                  Manage →
                </button>
              </header>
              <div class="sw-today__applied">
                ${c.map(t=>i`
                    <button
                      class="sw-today__applied-row"
                      @click=${()=>{e.onSelect(t.key),e.onModeChange(`board`)}}
                    >
                      <span class="sw-today__check">✓</span>
                      <span class="sw-today__applied-name">
                        <strong>${t.slug}</strong> — ${t.oneLine}
                      </span>
                      <span class="sw-today__applied-when">${t.ageLabel}</span>
                    </button>
                  `)}
              </div>
            </section>
          `:a}
    </div>
  `}function he(e){let t=ge(e.body);return t?i`
    <div class="sw-today__does">
      <div class="sw-today__does-h">${t.heading}</div>
      <ul>
        ${t.items.map(e=>i`<li>${e}</li>`)}
      </ul>
    </div>
  `:a}function ge(e){let t=_e(e),n=K(t,[`workflow`,`procedure`,`steps`,`agent workflow`,`process`]),r=n?J(n.lines):[];if(r.length>0)return{heading:`How the agent will use it`,items:r.slice(0,A)};let i=K(t,[`when to use`,`use when`,`applies when`,`trigger`,`triggers`]),a=i?J(i.lines):[];return a.length>0?{heading:`When the agent should use it`,items:a.slice(0,A)}:null}function _e(e){let t=[],n=null,r=!1;for(let i of e.split(`
`)){let e=i.trim();e.startsWith("```")&&(r=!r);let a=r?null:/^(#{2,4})\s+(.+?)\s*$/.exec(e);if(a){n={title:q(a[2]),lines:[]},t.push(n);continue}n?.lines.push(i)}return t}function K(e,t){let n=new Set(t.map(q));return e.find(e=>n.has(e.title))}function q(e){return e.replace(/[#*_`[\]().:]/g,` `).replace(/\s+/g,` `).trim().toLowerCase()}function J(e){let t=[];for(let n of e){if(/^\s{2,}/.test(n))continue;let e=n.trim(),r=/^(?:[-*]|\d+\.)\s+(.+)/.exec(e);r&&t.push(ve(r[1]))}return t.filter(Boolean)}function ve(e){return ye(e.replace(/^\*\*[^*]+\*\*\s*/,``).replace(/\[([^\]]+)\]\([^)]+\)/g,`$1`).replace(/`([^`]+)`/g,`$1`).replace(/\s+/g,` `).trim(),j)}function ye(e,t){if(e.length<=t)return e;let n=e.slice(0,t-1),r=n.lastIndexOf(` `);return`${(r>48?n.slice(0,r):n).trimEnd()}…`}function be(e){let t=new Date(e);return`${t.toLocaleDateString(void 0,{weekday:`long`})} · ${t.toLocaleDateString(void 0,{month:`short`,day:`numeric`})}`}function xe(e){let t=e.split(`
`),n=[],r=[],a=[],o=!1,s=[],c=()=>{r.length&&(n.push(i`<p>${Y(r.join(` `))}</p>`),r=[])},l=()=>{if(a.length){let e=a;n.push(i`
        <ol>
          ${e.map(e=>i`<li>${Y(e)}</li>`)}
        </ol>
      `),a=[]}};for(let e of t){let t=e.trimEnd();if(t.startsWith("```")){c(),l(),o?(n.push(i`<pre>${s.join(`
`)}</pre>`),s=[],o=!1):o=!0;continue}if(o){s.push(e);continue}if(t===``){c(),l();continue}if(t.startsWith(`## `)){c(),l(),n.push(i`<h3>${t.slice(3)}</h3>`);continue}if(t.startsWith(`# `)){c(),l(),n.push(i`<h3>${t.slice(2)}</h3>`);continue}let u=/^\d+\.\s+(.+)/.exec(t);if(u){c(),a.push(u[1]);continue}r.push(t)}return c(),l(),o&&s.length&&n.push(i`<pre>${s.join(`
`)}</pre>`),n}function Y(e){let t=[],n=/(`[^`]+`|\*\*[^*]+\*\*)/g,r=0,a;for(;a=n.exec(e);){a.index>r&&t.push(e.slice(r,a.index));let n=a[0];n.startsWith("`")?t.push(i`<code>${n.slice(1,-1)}</code>`):t.push(i`<strong>${n.slice(2,-2)}</strong>`),r=a.index+n.length}return r<e.length&&t.push(e.slice(r)),t}function Se(e){let t=new Map;for(let n of e){let e=t.get(n.recencyGroup)??[];e.push(n),t.set(n.recencyGroup,e)}return[`today`,`yesterday`,`earlier`].filter(e=>t.has(e)).map(e=>({label:M[e],items:t.get(e)??[]}))}function Ce(e){return e.error?`Could not load proposals.`:e.loading?`Loading proposals…`:e.statusFilter===`all`?`No proposals match the current filter.`:`No ${k[e.statusFilter].toLowerCase()} proposals.`}function X(e){let t=Math.max(0,Date.now()-e),n=Math.floor(t/1e3);if(n<60)return`${n}s ago`;let r=Math.floor(n/60);if(r<60)return`${r} minutes ago`;let i=Math.floor(r/60);if(i<24)return`${i}h ago`;let a=Math.floor(i/24);return a<7?`${a}d ago`:new Date(e).toLocaleDateString()}function we(e,t){let n=t?.trim();return n?e?.sessions.find(e=>e.key===n)??null:null}function Te(e){return!!(e&&!e.archived&&!e.hasActiveRun)}async function Z(e,t){let n=e.sessions.state;return n.agentId===t&&n.result?.sessions.length?n.result:e.sessions.list({agentId:t})}async function Ee(e,t,n,r){let i=t.gateway.snapshot.hello;if(e.skillWorkshopUseCurrentChatForRevisions)return h(ne().sessionKey,i).trim()||null;let a=p(n.origin?.agentId??r),o=we(await Z(t,a),n.origin?.sessionKey);if(Te(o))return o.key;let s=h(await t.sessions.create({agentId:a,label:`Skill Workshop: ${n.slug||n.key}`.slice(0,80)}),i).trim();if(!s)throw Error(t.sessions.state.error??`Could not prepare a Skill Workshop session.`);return s}function De(e,t,n){e.skillWorkshopUseCurrentChatForRevisions!==t&&(e.skillWorkshopUseCurrentChatForRevisions=t,se(t),n())}function Q(e,t,n){e.skillWorkshopMode!==t&&(e.skillWorkshopMode=t,ae(t),n())}function Oe(e,t){let n=f(`skillWorkshop.header.useCurrentChat`);return i`
    <div class="sw-header-controls">
      <label
        class="sw-revision-session-toggle"
        title=${f(`skillWorkshop.header.useCurrentChatTooltip`)}
      >
        <input
          type="checkbox"
          aria-label=${f(`skillWorkshop.header.useCurrentChatAria`)}
          .checked=${e.skillWorkshopUseCurrentChatForRevisions}
          @change=${n=>De(e,n.currentTarget.checked,t)}
        />
        <span class="sw-revision-session-toggle__track" aria-hidden="true"></span>
        <span class="sw-revision-session-toggle__label">${n}</span>
      </label>
      <div
        class="sw-mode-switch"
        role="tablist"
        aria-label="Workshop view"
        data-mode=${e.skillWorkshopMode}
      >
        <button
          type="button"
          class="sw-mode-switch__opt ${e.skillWorkshopMode===`board`?`is-active`:``}"
          role="tab"
          aria-selected=${e.skillWorkshopMode===`board`?`true`:`false`}
          @click=${()=>Q(e,`board`,t)}
        >
          <svg viewBox="0 0 24 24" class="sw-mode-switch__icon" aria-hidden="true">
            <rect x="3" y="4" width="7" height="16" rx="1.5" />
            <rect x="14" y="4" width="7" height="9" rx="1.5" />
            <rect x="14" y="15" width="7" height="5" rx="1.5" />
          </svg>
          <span>Board</span>
        </button>
        <button
          type="button"
          class="sw-mode-switch__opt ${e.skillWorkshopMode===`today`?`is-active`:``}"
          role="tab"
          aria-selected=${e.skillWorkshopMode===`today`?`true`:`false`}
          @click=${()=>Q(e,`today`,t)}
        >
          <svg viewBox="0 0 24 24" class="sw-mode-switch__icon" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path
              d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"
            />
          </svg>
          <span>Today</span>
        </button>
        <span class="sw-mode-switch__indicator" aria-hidden="true"></span>
      </div>
    </div>
  `}function ke(e,{context:t,workshopAgentName:n,onRevisionRequest:r},a){return i`
    <section class=${e.skillWorkshopMode===`today`?`content--skill-workshop content--skill-workshop-today`:`content--skill-workshop`}>
      <section class="content-header">
        <div>
          <div class="page-title">${f(`tabs.skillWorkshop`)}</div>
          <div class="page-sub">${f(`subtitles.skillWorkshop`)}</div>
        </div>
        <div class="page-meta">${Oe(e,a)}</div>
      </section>
      ${(()=>{let i=x(e.skillWorkshopProposals,e.skillWorkshopStatusFilter,e.skillWorkshopQuery),o=i.findIndex(t=>t.key===e.skillWorkshopSelectedKey),s=n=>{e.skillWorkshopFilePreviewKey=null,re(e,t,n).finally(a),a()},c=e=>{if(i.length===0)return;let t=o<0?0:(o+e+i.length)%i.length;s(i[t].key)},l=t=>{t.length===0||t.some(t=>t.key===e.skillWorkshopSelectedKey)||s(t[0].key)};return N({loading:e.skillWorkshopLoading,error:e.skillWorkshopError,inspectingKey:e.skillWorkshopInspectingKey,proposals:e.skillWorkshopProposals,selectedKey:e.skillWorkshopSelectedKey,statusFilter:e.skillWorkshopStatusFilter,query:e.skillWorkshopQuery,filePreviewKey:e.skillWorkshopFilePreviewKey,filePreviewQuery:e.skillWorkshopFilePreviewQuery,queueWidth:e.skillWorkshopQueueWidth,mode:e.skillWorkshopMode,actionBusy:e.skillWorkshopActionBusy,actionNotice:e.skillWorkshopActionNotice,revisionKey:e.skillWorkshopRevisionKey,revisionDraft:e.skillWorkshopRevisionDraft,assistantName:t.config.current.assistantIdentity.name,workshopAgentName:n,counts:ee(e.skillWorkshopProposals),onStatusFilterChange:t=>{e.skillWorkshopStatusFilter=t,a(),l(x(e.skillWorkshopProposals,t,e.skillWorkshopQuery))},onQueryChange:t=>{e.skillWorkshopQuery=t,a(),l(x(e.skillWorkshopProposals,e.skillWorkshopStatusFilter,t))},onFilePreviewQueryChange:t=>{e.skillWorkshopFilePreviewQuery=t,a()},onQueueWidthChange:t=>{e.skillWorkshopQueueWidth=t,a()},onModeChange:t=>Q(e,t,a),onSelect:s,onPrev:()=>c(-1),onNext:()=>c(1),onApply:n=>{v(e,t,`apply`,n).finally(a),a()},onRevise:t=>{e.skillWorkshopRevisionKey=t,e.skillWorkshopRevisionDraft=``,a()},onReject:n=>{v(e,t,`reject`,n).finally(a),a()},onRevisionDraftChange:t=>{e.skillWorkshopRevisionDraft=t,a()},onRevisionCancel:()=>{e.skillWorkshopRevisionKey=null,e.skillWorkshopRevisionDraft=``,a()},onRevisionSubmit:n=>r?void b(e,t,n,r).finally(a):void 0,onPreviewFile:(t,n)=>{e.skillWorkshopSelectedKey=t,e.skillWorkshopFilePreviewKey=n,a()},onClosePreview:()=>{e.skillWorkshopFilePreviewKey=null,e.skillWorkshopFilePreviewQuery=``,a()}})})()}
    </section>
  `}var $=class extends s{constructor(...e){super(...e),this.handleRevisionRequest=async(e,t,n)=>{if(!this.state||!this.context)throw Error(`Skill Workshop is not ready.`);let r=await Ee(this.state,this.context,t,n);if(!r)throw Error(this.context.sessions.state.error??`Could not prepare a Skill Workshop session.`);this.context.skillWorkshopRevision.prepare({sessionKey:r,instructions:e,proposalId:t.key,proposalAgentId:p(t.origin?.agentId??n)}),this.context.navigate(`chat`,{search:g(r)})},this.requestPageUpdate=()=>{this.isConnected&&this.requestUpdate()}}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.startGatewaySubscription()}willUpdate(){!this.state&&this.context&&(this.state=_(this.data),this.state.skillWorkshopMode=ie(),this.state.skillWorkshopUseCurrentChatForRevisions=oe())}updated(){this.startGatewaySubscription(),this.startConfigSubscription(),this.startAgentSelectionSubscription(),this.startAgentIdentitySubscription(),this.ensureWorkshopAgentIdentity()}startGatewaySubscription(){let e=this.context;!this.state||!e||this.stopGatewaySubscription||(this.stopGatewaySubscription=e.gateway.subscribe(e=>{!e.connected||!this.state||!this.context||y(this.state,this.context).finally(this.requestPageUpdate)}),!this.data?.skillWorkshopLoaded&&e.gateway.snapshot.connected&&y(this.state,e).finally(this.requestPageUpdate))}startAgentIdentitySubscription(){let e=this.context;!e||this.stopAgentIdentitySubscription||(this.stopAgentIdentitySubscription=e.agentIdentity.subscribe(this.requestPageUpdate))}startConfigSubscription(){let e=this.context;!e||this.stopConfigSubscription||(this.stopConfigSubscription=e.config.subscribe(this.requestPageUpdate))}startAgentSelectionSubscription(){let e=this.context;!e||!this.state||this.stopAgentSelectionSubscription||(this.stopAgentSelectionSubscription=e.agentSelection.subscribe(()=>{!this.state||!this.context||y(this.state,this.context).finally(this.requestPageUpdate)}))}ensureWorkshopAgentIdentity(){let e=this.context,t=this.state?.skillWorkshopAgentId;!e||!t||e.agentIdentity.get(t)||e.agentIdentity.ensure([t])}disconnectedCallback(){this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.stopConfigSubscription?.(),this.stopConfigSubscription=void 0,this.stopAgentSelectionSubscription?.(),this.stopAgentSelectionSubscription=void 0,this.stopAgentIdentitySubscription?.(),this.stopAgentIdentitySubscription=void 0,this.state?.skillWorkshopActionNoticeTimer&&(globalThis.clearTimeout(this.state.skillWorkshopActionNoticeTimer),this.state.skillWorkshopActionNoticeTimer=null),super.disconnectedCallback()}render(){return this.state&&this.context?ke(this.state,{context:this.context,workshopAgentName:this.context.agentIdentity.get(this.state.skillWorkshopAgentId)?.name?.trim()??``,onRevisionRequest:this.onRevisionRequest??this.handleRevisionRequest},this.requestPageUpdate):a}};n([t({context:e,subscribe:!1})],$.prototype,`context`,void 0),n([c({attribute:!1})],$.prototype,`data`,void 0),n([c({attribute:!1})],$.prototype,`onRevisionRequest`,void 0),customElements.get(`openclaw-skill-workshop-page`)||customElements.define(`openclaw-skill-workshop-page`,$);
//# sourceMappingURL=skill-workshop-page-B6XJ5PZp.js.map