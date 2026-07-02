import{d as e,f as t,g as n,i as r,l as i,m as a,p as o,t as s}from"./lit-runtime-BImxIzGR.js";import{m as c,y as l}from"./index-xuQ23plZ.js";var u=class extends t{constructor(...e){super(...e),this.files=[],this.activePath=``,this.query=``,this.label=`Support files`,this.listLabel=`Files`,this.searchPlaceholder=`Search files...`,this.contextLabel=``,this.readOnlyLabel=`read-only`,this.emptyTitle=`No files match`,this.emptySubtitle=`Try another file name or content search.`,this.handleQueryInput=e=>{let t=e.target.value??``;this.dispatchEvent(new CustomEvent(`file-preview-query-change`,{bubbles:!0,composed:!0,detail:t}))},this.preventItemPointerFocus=e=>{e.preventDefault()},this.handleKeydown=e=>{switch(e.key){case`Escape`:e.preventDefault(),e.stopPropagation(),this.emitClose();return;case`ArrowDown`:this.moveSelection(1,e);return;case`ArrowUp`:this.moveSelection(-1,e);default:}},this.emitClose=()=>{this.dispatchEvent(new CustomEvent(`file-preview-close`,{bubbles:!0,composed:!0}))}}static{this.styles=n`
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

    .esc,
    .kbd {
      font-family: var(--mono);
      border: 1px solid var(--border);
      color: var(--muted);
    }

    .esc {
      font-size: 10px;
      padding: 1px 5px;
      border-radius: 3px;
      background: var(--bg);
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

    .title {
      margin: 0 0 10px;
      font-family: var(--mono);
      font-size: 22px;
      color: var(--text-strong);
      font-weight: 700;
      letter-spacing: -0.01em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
      overflow: auto;
      padding: 20px 24px 24px;
    }

    .pre {
      margin: 0;
      font-family: var(--mono);
      font-size: 13px;
      line-height: 1.7;
      color: var(--text);
      background: transparent;
      border: none;
      white-space: pre-wrap;
      word-break: break-word;
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
  `}render(){let e=this.filterFiles(),t=this.resolveActiveFile(e),n=e.length===this.files.length?`${this.files.length} files`:`${e.length}/${this.files.length} files`;return a`
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
            autofocus
          />
          <span class="state">${n} <span class="esc">esc</span></span>
        </header>
        <div class="body">
          <aside class="list">
            <div class="list-section">${this.listLabel} · ${e.length}</div>
            ${e.length===0?a`<div class="empty-list">No files match.</div>`:e.map(e=>a`
                    <button
                      class="item ${e.path===t?.path?`is-active`:``}"
                      @pointerdown=${this.preventItemPointerFocus}
                      @mousedown=${this.preventItemPointerFocus}
                      @click=${()=>this.emitSelect(e.path)}
                    >
                      <span class="item-icon">${p(e.path)}</span>
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
    `}renderFile(e){return a`
      <section class="detail">
        <div class="detail-head">
          <h2 class="title">${e.path}</h2>
          <div class="chips">
            <span class="chip accent">${d(e.path)}</span>
            <span class="chip">${e.size}</span>
            <span class="chip">${this.readOnlyLabel}</span>
            ${this.contextLabel?a`<span class="chip ok">${this.contextLabel}</span>`:``}
          </div>
        </div>
        <div class="detail-body">
          <pre class="pre">${e.contents}</pre>
        </div>
      </section>
    `}renderEmpty(){return a`
      <section class="detail empty">
        <p class="empty-title">${this.emptyTitle}</p>
        <p class="empty-subtitle">${this.emptySubtitle}</p>
      </section>
    `}filterFiles(){let e=this.query.trim().toLowerCase();return e?this.files.filter(t=>`${t.path}\n${t.contents}`.toLowerCase().includes(e)):this.files}resolveActiveFile(e){return e.find(e=>e.path===this.activePath)??e[0]}firstUpdated(){this.focusModal()}updated(e){(e.has(`activePath`)||e.has(`query`)||e.has(`files`))&&this.scrollActiveFileIntoView()}focusModal(){(this.searchInput??this.shadowRoot?.querySelector(`.modal`))?.focus({preventScroll:!0})}moveSelection(e,t){t.preventDefault(),t.stopPropagation();let n=this.filterFiles();if(n.length===0)return;let r=this.resolveActiveFile(n),i=r?n.findIndex(e=>e.path===r.path):-1,a=n[Math.max(0,Math.min(n.length-1,i+e))];a&&a.path!==r?.path&&this.emitSelect(a.path)}scrollActiveFileIntoView(){this.updateComplete.then(()=>{this.isConnected&&this.shadowRoot?.querySelector(`.item.is-active`)?.scrollIntoView({block:`nearest`})}).catch(()=>{})}emitSelect(e){this.dispatchEvent(new CustomEvent(`file-preview-select`,{bubbles:!0,composed:!0,detail:e})),this.focusModal()}};c([e({attribute:!1})],u.prototype,`files`,void 0),c([e()],u.prototype,`activePath`,void 0),c([e()],u.prototype,`query`,void 0),c([e()],u.prototype,`label`,void 0),c([e()],u.prototype,`listLabel`,void 0),c([e()],u.prototype,`searchPlaceholder`,void 0),c([e()],u.prototype,`contextLabel`,void 0),c([e()],u.prototype,`readOnlyLabel`,void 0),c([e()],u.prototype,`emptyTitle`,void 0),c([e()],u.prototype,`emptySubtitle`,void 0),c([i(`.search`)],u.prototype,`searchInput`,void 0);function d(e){let t=e.split(`.`).pop()?.toLowerCase()??``;return{md:`Markdown`,txt:`Text`,json:`JSON`,yaml:`YAML`,yml:`YAML`,ts:`TypeScript`,js:`JavaScript`,py:`Python`,sh:`Shell`}[t]??(t?t.toUpperCase():`File`)}customElements.get(`openclaw-file-preview-modal`)||customElements.define(`openclaw-file-preview-modal`,u);var f=new Set(`ts.tsx.js.jsx.mjs.cjs.py.sh.bash.zsh.rb.go.rs.java.kt.swift.c.cc.cpp.h.hpp.json.yaml.yml.toml.xml.html.css.scss.sql`.split(`.`));function p(e){let t=e.split(`.`).pop()?.toLowerCase()??``;return f.has(t)?l.fileCode:l.fileText}var m=[`all`,`pending`,`applied`,`rejected`,`quarantined`,`stale`],h={all:`All`,pending:`Pending`,applied:`Applied`,rejected:`Rejected`,quarantined:`Quarantined`,stale:`Stale`},g=3,_=120,v={today:`Today`,yesterday:`Yesterday`,earlier:`Earlier this week`};function y(e){let t=q(e.proposals,e.statusFilter,e.query),n=t.find(t=>t.key===e.selectedKey)??t[0],i=J(t),s=n&&e.filePreviewKey?n.supportFiles.find(t=>t.path===e.filePreviewKey):null,c=e.revisionKey?e.proposals.find(t=>t.key===e.revisionKey):null,l=e.proposals.filter(e=>e.status===`pending`),u=n??l[0]??e.proposals[0],d=e.proposals.length===0&&!e.loading&&!e.error?P(e):e.mode===`today`?F(e,u,l):x(e,t,i,n);return a`
    <section class="skill-workshop sw-mode-${e.mode}">
      ${e.error?a`<div class="sw-error" role="status">${e.error}</div>`:o}
      <div class="sw-view" data-mode=${e.mode}>
        ${r(e.mode,a`<div class="sw-view__pane">${d}</div>`)}
      </div>
    </section>
    ${s&&n?a`
          <openclaw-file-preview-modal
            .files=${n.supportFiles}
            .activePath=${s.path}
            .query=${e.filePreviewQuery}
            .contextLabel=${`in ${n.slug}`}
            @file-preview-query-change=${t=>e.onFilePreviewQueryChange(t.detail)}
            @file-preview-select=${t=>e.onPreviewFile(n.key,t.detail)}
            @file-preview-close=${e.onClosePreview}
          ></openclaw-file-preview-modal>
        `:o}
    ${c?b(e,c):o}
  `}function b(e,t){let n=e.actionBusy?.key===t.key&&e.actionBusy.action===`revise`,r=e.revisionDraft.trim().length>0&&!e.actionBusy,i=e.mode===`board`?`Revise`:`Tweak`;return a`
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
            <div class="sw-revision-dialog__eyebrow">${i} proposal</div>
            <h2 id="sw-revision-title">${t.slug}</h2>
          </div>
          <button
            class="sw-revision-dialog__close"
            title="Close"
            aria-label="Close"
            ?disabled=${!!e.actionBusy}
            @click=${e.onRevisionCancel}
          >
            ×
          </button>
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
        ${n?a`
              <div class="sw-revision-dialog__status" role="status">
                <span class="sw-revision-dialog__status-dot" aria-hidden="true"></span>
                <span>Preparing revision handoff</span>
              </div>
            `:o}
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
  `}function x(e,t,n,r){return a`
    ${T(e)}
    <div class="sw-triage" style=${s({"--sw-queue-width":`${e.queueWidth}px`})}>
      ${E(e,n,r)} ${S(e)}
      ${r?O(e,r):j(e)}
    </div>
  `}function S(e){return a`
    <div
      class="sw-queue-resizer"
      role="separator"
      aria-label="Resize proposal list"
      aria-orientation="vertical"
      tabindex="0"
      @pointerdown=${t=>C(t,e)}
      @keydown=${t=>w(t,e)}
    ></div>
  `}function C(e,t){e.preventDefault(),e.stopPropagation();let n=e.clientX,r=t.queueWidth,i=document.body,a=i.style.cursor,o=i.style.userSelect;i.style.cursor=`col-resize`,i.style.userSelect=`none`;let s=()=>{window.removeEventListener(`pointermove`,c),window.removeEventListener(`pointerup`,l),window.removeEventListener(`pointercancel`,l),i.style.cursor=a,i.style.userSelect=o},c=e=>{t.onQueueWidthChange(r+e.clientX-n)},l=()=>{s()};window.addEventListener(`pointermove`,c),window.addEventListener(`pointerup`,l),window.addEventListener(`pointercancel`,l)}function w(e,t){if(e.key!==`ArrowLeft`&&e.key!==`ArrowRight`)return;e.preventDefault();let n=e.key===`ArrowLeft`?-24:24;t.onQueueWidthChange(t.queueWidth+n)}function T(e){return a`
    <div class="sw-lifecycle-tabs">
      ${m.map(t=>{let n=e.statusFilter===t,r=e.counts[t]??0;return a`
          <button
            class="sw-lifecycle-tab ${n?`is-active`:``}"
            @click=${()=>e.onStatusFilterChange(t)}
          >
            ${h[t]} <span class="sw-lifecycle-tab__count">${r}</span>
          </button>
        `})}
    </div>
  `}function E(e,t,n){let r=t.reduce((e,t)=>e+t.items.length,0);return a`
    <aside class="sw-queue">
      <div class="sw-queue__search">
        <input
          placeholder="Search proposals…"
          .value=${e.query}
          @input=${t=>e.onQueryChange(t.target.value??``)}
        />
      </div>
      <div class="sw-queue__body">
        ${r===0?a`<div class="sw-queue__empty">${Y(e)}</div>`:t.map(t=>a`
                <div class="sw-queue__group">
                  ${t.label} <span class="sw-queue__group-pill">${t.items.length}</span>
                </div>
                ${t.items.map(t=>D(e,t,n))}
              `)}
      </div>
    </aside>
  `}function D(e,t,n){let r=n?.key===t.key;return a`
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
  `}function O(e,t){let n=t.updatedAt&&t.updatedAt>t.createdAt?t.updatedAt:null,r=n?`Edited ${X(n)}`:`Created ${X(t.createdAt)}`,i=e.inspectingKey===t.key&&!t.body;return a`
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
            ${t.supportFiles.length>0?a`<button
                  class="sw-detail__meta-link"
                  @click=${()=>e.onPreviewFile(t.key,t.supportFiles[0].path)}
                >
                  ${t.supportFiles.length} support files
                </button>`:a`<span>0 support files</span>`}
          </div>
        </div>
        <div class="sw-detail__nav">
          <button title="Previous" @click=${e.onPrev}>↑</button>
          <button title="Next" @click=${e.onNext}>↓</button>
        </div>
      </div>

      <div class="sw-detail__body">
        <div class="sw-body-card">
          <h1>${t.slug}</h1>
          ${i?a`<p class="sw-muted">Loading proposal…</p>`:G(t.body)}
        </div>

        ${t.supportFiles.length>0?a`
              <div class="sw-section" style="margin-top: 18px;">
                <h3 class="sw-section__label">Support files</h3>
                <div class="sw-files">
                  ${t.supportFiles.map(n=>a`
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
            `:o}
      </div>

      ${e.actionNotice?.key===t.key?k(e.actionNotice):o}
      ${t.status===`pending`?A(e,t):o}
    </div>
  `}function k(e){return a`
    <div class="sw-action-toast" role="status" aria-live="polite">
      <span>${e.label}</span>
      <strong>${e.slug}</strong>
      <span>·</span>
    </div>
  `}function A(e,t){let n=e.actionBusy?.key===t.key?e.actionBusy.action:null,r=!!e.actionBusy;return a`
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
  `}function j(e){let t=M(e);return a`
    <div class="sw-detail sw-detail--empty">
      <div class="sw-filter-empty">
        <div class="sw-filter-empty__icon" aria-hidden="true">
          ${N(t.icon)}
        </div>
        <p class="sw-empty__title">${t.title}</p>
        <p class="sw-empty__sub">${t.body}</p>
      </div>
    </div>
  `}function M(e){if(e.query.trim())return{icon:`search`,title:`No matching proposals`,body:`Clear the search or try a different keyword.`};switch(e.statusFilter){case`pending`:return{icon:`clock`,title:`No pending proposals`,body:`New drafts will appear here when they need review.`};case`applied`:return{icon:`check`,title:`Nothing applied yet`,body:`Use a pending proposal and it will appear here as a live skill.`};case`rejected`:return{icon:`x`,title:`No rejected proposals`,body:`Skipped proposals will stay here for a clean review history.`};case`quarantined`:return{icon:`shield`,title:`Nothing quarantined`,body:`Scanner-blocked or safety-held proposals will appear here.`};case`stale`:return{icon:`refresh`,title:`No stale proposals`,body:`Proposals that can no longer apply cleanly will appear here.`};case`all`:return{icon:`search`,title:`No proposals here`,body:`Skill Workshop proposals will appear here when your agent drafts them.`}}return{icon:`search`,title:`No proposals here`,body:`Skill Workshop proposals will appear here when your agent drafts them.`}}function N(e){switch(e){case`clock`:return a`
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8"></circle>
          <path d="M12 7v5l3 2"></path>
        </svg>
      `;case`check`:return a`
        <svg viewBox="0 0 24 24">
          <path d="M5 12.5l4 4L19 7"></path>
        </svg>
      `;case`x`:return a`
        <svg viewBox="0 0 24 24">
          <path d="M7 7l10 10"></path>
          <path d="M17 7L7 17"></path>
        </svg>
      `;case`shield`:return a`
        <svg viewBox="0 0 24 24">
          <path d="M12 3l7 3v5c0 4.2-2.8 7.8-7 10-4.2-2.2-7-5.8-7-10V6l7-3z"></path>
          <path d="M9 12l2 2 4-5"></path>
        </svg>
      `;case`refresh`:return a`
        <svg viewBox="0 0 24 24">
          <path d="M17 2v5h-5"></path>
          <path d="M7 22v-5h5"></path>
          <path d="M19 10a7 7 0 0 0-12-4l-2 2"></path>
          <path d="M5 14a7 7 0 0 0 12 4l2-2"></path>
        </svg>
      `;case`search`:return a`
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="6"></circle>
          <path d="M16 16l4 4"></path>
        </svg>
      `}return o}function P(e){return a`
    <div class="sw-empty-state">
      <section class="sw-empty-state__panel" aria-label="No Skill Workshop proposals">
        <div class="sw-empty-state__glyph" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p class="sw-empty-state__eyebrow">Skill Workshop</p>
        <h2>No proposals yet</h2>
        <p>${e.assistantName.trim()||`Your agent`} hasn't drafted any skill proposals.</p>
        <div class="sw-empty-state__footer">New proposals will appear here for review.</div>
      </section>
    </div>
  `}function F(e,t,n){if(!t)return a`
      <div class="sw-today sw-today--empty">
        <p class="sw-empty__title">Nothing waiting today</p>
        <p class="sw-empty__sub">
          Your agent hasn't drafted anything new. Switch to Board to browse history.
        </p>
      </div>
    `;let r=Math.max(0,n.findIndex(e=>e.key===t.key)),i=Math.max(n.length,1),s=n.filter(e=>e.key!==t.key).slice(0,3),c=e.proposals.filter(e=>e.status===`applied`).slice(0,3),l=t.isNew?`NEW`:t.status===`pending`?`WAITING`:`REVIEWED`,u=t.ageLabel,d=W(Date.now()),f=t.status===`pending`,p=e.actionBusy?.key===t.key?e.actionBusy.action:null,m=!!e.actionBusy,h=e.assistantName.trim()||`agent`;return a`
    <div class="sw-today">
      <div class="sw-today__head">
        <div class="sw-today__date">${d}</div>
        <h1 class="sw-today__h1">${n.length} proposals waiting</h1>
        ${n.length===0?a`<div class="sw-today__sub">Browse what's already applied.</div>`:o}
        ${n.length>0?a`
              <div class="sw-today__progress">
                <span>${r+1} of ${i}</span>
                <div class="sw-today__dots">
                  ${n.map((e,t)=>a`
                      <span
                        class="sw-today__dot ${t<r?`is-done`:t===r?`is-now`:``}"
                      ></span>
                    `)}
                </div>
              </div>
            `:o}
      </div>

      <article class="sw-today__hero">
        <div class="sw-today__label">
          <span class="sw-today__ping"></span>
          ${l} · ${u}
        </div>
        <h2 class="sw-today__name">${t.slug}</h2>
        <p class="sw-today__one-liner">${t.oneLine}</p>

        ${I(t)}

        <div class="sw-today__author">
          <span class="sw-today__avatar">v${t.version}</span>
          <span>
            Drafted by <strong>${h}</strong> · ${u}.
            ${t.supportFiles.length>0?a`
                  <button
                    class="sw-today__files-link"
                    @click=${()=>e.onPreviewFile(t.key,t.supportFiles[0].path)}
                  >
                    ${t.supportFiles.length}
                    ${t.supportFiles.length===1?`support file`:`support files`}
                  </button>
                  come with it.
                `:o}
          </span>
        </div>

        ${f?a`
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
            `:o}
        ${e.actionNotice?.key===t.key?k(e.actionNotice):o}
      </article>

      ${s.length>0?a`
            <section class="sw-today__section">
              <header class="sw-today__section-head">
                <h3>Up next · ${n.length-1} more waiting</h3>
                <button class="sw-today__link" @click=${()=>e.onModeChange(`board`)}>
                  See all proposals →
                </button>
              </header>
              <div class="sw-today__upnext">
                ${s.map(t=>a`
                    <button class="sw-today__mini" @click=${()=>e.onSelect(t.key)}>
                      <div class="sw-today__mini-name">${t.slug}</div>
                      <div class="sw-today__mini-desc">${t.oneLine}</div>
                      <div class="sw-today__mini-meta">${t.ageLabel}</div>
                    </button>
                  `)}
              </div>
            </section>
          `:o}
      ${c.length>0?a`
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
                ${c.map(t=>a`
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
          `:o}
    </div>
  `}function I(e){let t=L(e.body);return t?a`
    <div class="sw-today__does">
      <div class="sw-today__does-h">${t.heading}</div>
      <ul>
        ${t.items.map(e=>a`<li>${e}</li>`)}
      </ul>
    </div>
  `:o}function L(e){let t=R(e),n=z(t,[`workflow`,`procedure`,`steps`,`agent workflow`,`process`]),r=n?V(n.lines):[];if(r.length>0)return{heading:`How the agent will use it`,items:r.slice(0,g)};let i=z(t,[`when to use`,`use when`,`applies when`,`trigger`,`triggers`]),a=i?V(i.lines):[];return a.length>0?{heading:`When the agent should use it`,items:a.slice(0,g)}:null}function R(e){let t=[],n=null,r=!1;for(let i of e.split(`
`)){let e=i.trim();e.startsWith("```")&&(r=!r);let a=r?null:/^(#{2,4})\s+(.+?)\s*$/.exec(e);if(a){n={title:B(a[2]),lines:[]},t.push(n);continue}n?.lines.push(i)}return t}function z(e,t){let n=new Set(t.map(B));return e.find(e=>n.has(e.title))}function B(e){return e.replace(/[#*_`[\]().:]/g,` `).replace(/\s+/g,` `).trim().toLowerCase()}function V(e){let t=[];for(let n of e){if(/^\s{2,}/.test(n))continue;let e=n.trim(),r=/^(?:[-*]|\d+\.)\s+(.+)/.exec(e);r&&t.push(H(r[1]))}return t.filter(Boolean)}function H(e){return U(e.replace(/^\*\*[^*]+\*\*\s*/,``).replace(/\[([^\]]+)\]\([^)]+\)/g,`$1`).replace(/`([^`]+)`/g,`$1`).replace(/\s+/g,` `).trim(),_)}function U(e,t){if(e.length<=t)return e;let n=e.slice(0,t-1),r=n.lastIndexOf(` `);return`${(r>48?n.slice(0,r):n).trimEnd()}…`}function W(e){let t=new Date(e);return`${t.toLocaleDateString(void 0,{weekday:`long`})} · ${t.toLocaleDateString(void 0,{month:`short`,day:`numeric`})}`}function G(e){let t=e.split(`
`),n=[],r=[],i=[],o=!1,s=[],c=()=>{r.length&&(n.push(a`<p>${K(r.join(` `))}</p>`),r=[])},l=()=>{if(i.length){let e=i;n.push(a`
        <ol>
          ${e.map(e=>a`<li>${K(e)}</li>`)}
        </ol>
      `),i=[]}};for(let e of t){let t=e.trimEnd();if(t.startsWith("```")){c(),l(),o?(n.push(a`<pre>${s.join(`
`)}</pre>`),s=[],o=!1):o=!0;continue}if(o){s.push(e);continue}if(t===``){c(),l();continue}if(t.startsWith(`## `)){c(),l(),n.push(a`<h3>${t.slice(3)}</h3>`);continue}if(t.startsWith(`# `)){c(),l(),n.push(a`<h3>${t.slice(2)}</h3>`);continue}let u=/^\d+\.\s+(.+)/.exec(t);if(u){c(),i.push(u[1]);continue}r.push(t)}return c(),l(),o&&s.length&&n.push(a`<pre>${s.join(`
`)}</pre>`),n}function K(e){let t=[],n=/(`[^`]+`|\*\*[^*]+\*\*)/g,r=0,i;for(;i=n.exec(e);){i.index>r&&t.push(e.slice(r,i.index));let n=i[0];n.startsWith("`")?t.push(a`<code>${n.slice(1,-1)}</code>`):t.push(a`<strong>${n.slice(2,-2)}</strong>`),r=i.index+n.length}return r<e.length&&t.push(e.slice(r)),t}function q(e,t,n){let r=n.trim().toLowerCase();return e.filter(e=>!(t!==`all`&&e.status!==t||r&&!`${e.name} ${e.oneLine} ${e.slug}`.toLowerCase().includes(r)))}function J(e){let t=new Map;for(let n of e){let e=t.get(n.recencyGroup)??[];e.push(n),t.set(n.recencyGroup,e)}return[`today`,`yesterday`,`earlier`].filter(e=>t.has(e)).map(e=>({label:v[e],items:t.get(e)??[]}))}function Y(e){return e.error?`Could not load proposals.`:e.loading?`Loading proposals…`:e.statusFilter===`all`?`No proposals match the current filter.`:`No ${h[e.statusFilter].toLowerCase()} proposals.`}function X(e){let t=Math.max(0,Date.now()-e),n=Math.floor(t/1e3);if(n<60)return`${n}s ago`;let r=Math.floor(n/60);if(r<60)return`${r} minutes ago`;let i=Math.floor(r/60);if(i<24)return`${i}h ago`;let a=Math.floor(i/24);return a<7?`${a}d ago`:new Date(e).toLocaleDateString()}export{q as filterSkillWorkshopProposals,y as renderSkillWorkshop};
//# sourceMappingURL=skill-workshop-BLeDeluc.js.map