import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Ds5QQwGa.js";import{Gl as n,Rl as r,Xl as i,nu as a,tu as o,zl as s}from"./control-ui-core-DkXlmHxW.js";import{$ as c,Y as l,at as u,mt as d,nt as f,r as p,t as m,ut as h}from"./lit-runtime-DLvISeBM.js";import{Fi as g,Fr as _,Ii as v}from"./control-ui-core-BdNTI4B-.js";import{Qn as y,Vr as b,Xt as x,Yt as S,er as C,hr as w,mr as T,zr as E}from"./control-ui-boot-shared-C5a8_33C.js";import{n as D,t as O}from"./frontmatter-DV9Rn9SK.js";var k,A;function j(){return(j=e((()=>{a(),k={filePreview:{bundle:{binary:`This binary file is included in the bundle but cannot be displayed as text.`,"too-large":`This file exceeds the preview limit. Its contents have not been truncated or loaded.`,unavailable:`This file could not be read safely or is unavailable. Close and reopen the skill to try again.`,incomplete:`Some bundle content is unavailable. Select a file to see its status.`},listLabel:`Files`,searchPlaceholder:`Search files…`,readOnly:`read-only`,emptyTitle:`No files match`,emptySubtitle:`Try another file name or content search.`,copyFile:`Copy file`,fileCount:`{count} files`,filteredFileCount:`{count}/{total} files`,noMatches:`No files match.`,navigate:`navigate`,kind:{text:`Text`,shell:`Shell`,file:`File`}}},A=Object.assign(()=>{Object.assign(o.filePreview,k.filePreview)},{catalog:k})})))()}var M;function N(){return(N=e((()=>{l(),M=d`
  :host {
    display: contents;
  }

  .modal {
    width: 100%;
    height: min(780px, 86vh);
    background: var(--bg);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-lg);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
  }

  .heading {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: 16px;
    overflow-wrap: anywhere;
  }
  .close-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 32px;
    height: 32px;
    padding: 0;
    color: var(--muted);
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: var(--cursor-action);
  }
  .close-button:hover {
    color: var(--text-strong);
    background: var(--bg-elevated);
  }
  .close-button:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  .close-button svg {
    width: 18px;
    height: 18px;
  }
  .body.tree {
    grid-template-columns: minmax(180px, 260px) minmax(0, 1fr);
  }
  .tree .item {
    grid-template-columns: 16px minmax(0, 1fr);
  }
  .folder > summary {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 9px 10px;
    color: var(--muted);
    font-size: 12px;
  }
  .folder > summary svg {
    width: 16px;
    height: 16px;
  }
  .folder > div {
    padding-left: 12px;
  }
  .folder .item {
    width: 100%;
    padding: 9px 10px;
    gap: 8px;
  }
  .notice {
    margin: 0;
    padding: 12px 20px;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
  }
  .markdown {
    font-size: 14px;
    line-height: 1.65;
    overflow-wrap: anywhere;
  }
  .markdown > :first-child {
    margin-top: 0;
  }
  .markdown h1 {
    font-size: 24px;
  }
  .markdown h2 {
    font-size: 20px;
  }
  .markdown h3 {
    font-size: 16px;
  }
  .markdown pre {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    background: var(--bg-elevated);
    padding: 12px;
    border-radius: var(--radius-md);
  }
  .markdown code {
    font-family: var(--mono);
  }
  .markdown a {
    color: var(--accent);
  }
  .markdown table {
    display: block;
    overflow: auto;
    max-width: 100%;
  }
  .markdown th,
  .markdown td {
    padding: 8px;
    border: 1px solid var(--border);
  }
  .search-icon {
    color: var(--muted);
    font-size: 18px;
  }

  .search {
    flex: 1;
    min-width: 0;
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

  .body {
    flex: 1;
    display: grid;
    grid-template-columns: 360px minmax(0, 1fr);
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

  .item-icon svg,
  .chat-copy-btn svg {
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

  .chat-copy-btn__icon-check,
  .chat-copy-btn[data-copy-state="copied"] .chat-copy-btn__icon-copy {
    opacity: 0;
  }

  .chat-copy-btn[data-copy-state="copied"] .chat-copy-btn__icon-check {
    opacity: 1;
  }

  .chat-copy-btn[data-copy-state="copying"] {
    opacity: 0;
    pointer-events: none;
  }

  .chat-copy-btn[data-copy-state="error"] {
    border-color: var(--danger-subtle);
    background: var(--danger-subtle);
    color: var(--danger);
  }

  .chat-copy-btn[data-copy-state="copied"] {
    border-color: var(--ok-subtle);
    background: var(--ok-subtle);
    color: var(--ok);
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
    font-family: var(--mono);
    font-size: 10.5px;
    padding: 2px 6px;
    border: 1px solid var(--border);
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

  @media (max-width: 640px) {
    .head {
      padding: 12px;
    }

    .body,
    .body.tree {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: minmax(0, min(180px, 30dvh)) minmax(0, 1fr);
    }

    .list {
      min-width: 0;
      border-right: 0;
      border-bottom: 1px solid var(--border);
      padding: 10px 8px;
    }

    .item {
      min-width: 0;
    }

    .foot {
      gap: 8px;
      padding: 10px 12px;
    }
  }
`})))()}function P(e){let t=e.split(`
`),n=[];for(let e=0;e<t.length;e+=R)n.push(t.slice(e,e+R).join(`
`));return n}function F(e){let t=e.split(`.`).pop()?.toLowerCase()??``;return{md:`Markdown`,txt:i(`filePreview.kind.text`),json:`JSON`,yaml:`YAML`,yml:`YAML`,ts:`TypeScript`,js:`JavaScript`,py:`Python`,sh:i(`filePreview.kind.shell`)}[t]??(t?t.toUpperCase():i(`filePreview.kind.file`))}function I(e){return z[T(e)]}var L,R,z;function B(){return(B=e((()=>{l(),f(),m(),O(),n(),j(),s(),E(),w(),N(),v(),y(),S(),_(),A(),L=class extends r{constructor(...e){super(...e),this.files=[],this.activePath=``,this.query=``,this.label=``,this.listLabel=``,this.searchPlaceholder=``,this.contextLabel=``,this.readOnlyLabel=``,this.emptyTitle=``,this.emptySubtitle=``,this.copyLabel=``,this.layout=`files`,this.directories=[],this.loading=!1,this.fileLoading=!1,this.error=``,this.notice=``,this.filteredFiles=[],this.derivedInputsReady=!1,this.codeChunks=[],this.resetScrollAfterUpdate=!0,this.focusAfterUpdate=!1,this.handleDocumentLink=e=>{let t=e.target.closest(`a[href]`)?.getAttribute(`href`);if(!t||/^[a-z][a-z0-9+.-]*:|^\/\//iu.test(t))return;e.preventDefault();let n=new URL(this.activeFile?.path??`SKILL.md`,`https://skill.invalid/`),r=new URL(t,n),i;try{i=decodeURIComponent(r.pathname.slice(1))}catch{return}let a=this.files.find(e=>e.path===i);a&&this.emitSelect(a.path)},this.handleQueryInput=e=>{let t=e.target.value??``;this.dispatchEvent(new CustomEvent(`file-preview-query-change`,{bubbles:!0,composed:!0,detail:t}))},this.preventItemPointerFocus=e=>{e.preventDefault()},this.handleKeydown=e=>{switch(e.key){case`Escape`:e.preventDefault(),e.stopPropagation(),this.emitClose();return;case`ArrowDown`:this.moveSelection(1,e);return;case`ArrowUp`:this.moveSelection(-1,e)}},this.emitClose=()=>{this.dispatchEvent(new CustomEvent(`file-preview-close`,{bubbles:!0,composed:!0}))}}static{this.styles=M}willUpdate(e){if(!(!this.derivedInputsReady||e.has(`activePath`)||e.has(`query`)||e.has(`files`)||e.has(`layout`)))return;this.derivedInputsReady=!0,this.filteredFiles=this.filterFiles();let t=this.resolveActiveFile(this.filteredFiles);this.resetScrollAfterUpdate||=e.has(`layout`)||e.has(`query`)||this.activeFile?.path!==t?.path||this.activeFile?.contents!==t?.contents||this.activeFile?.message!==t?.message,this.activeFile=t;let n=t?.contents;n!==this.codeSource&&(this.codeSource=n,this.codeChunks=n===void 0?[]:P(n))}render(){let e=this.filteredFiles,t=this.activeFile,n=e.length===this.files.length?i(`filePreview.fileCount`,{count:String(this.files.length)}):i(`filePreview.filteredFileCount`,{count:String(e.length),total:String(this.files.length)}),r=this.label||i(`filePreview.label`),a=this.listLabel||i(`filePreview.listLabel`),o=this.searchPlaceholder||i(`filePreview.searchPlaceholder`);return c`
      <openclaw-modal-dialog
        label=${r}
        style="--openclaw-modal-width: min(1100px, 92vw); --openclaw-modal-max-height: 86vh;"
        @modal-cancel=${this.emitClose}
        @keydown=${this.handleKeydown}
      >
        <div class="modal">
          <header class="head">
            ${this.layout===`document`?c`<h1 class="heading">${r}</h1>
                    <button
                      class="close-button"
                      type="button"
                      aria-label=${i(`common.close`)}
                      @click=${this.emitClose}
                    >
                      ${g.x}
                    </button>`:c`<span class="search-icon">⌕</span
                    ><input
                      class="search"
                      placeholder=${o}
                      .value=${this.query}
                      @input=${this.handleQueryInput}
                    /><span class="state">${n}</span>`}
          </header>
          ${this.notice?c`<p class="notice" role="status">${this.notice}</p>`:``}
          <div
            class="body ${this.layout===`document`?`tree`:``}"
            aria-busy=${this.loading||this.fileLoading}
          >
            <aside class="list">
              ${this.layout===`files`?c`<div class="list-section">${a} · ${e.length}</div>`:``}
              ${this.loading&&!this.error?x(`file-list`,i(`common.loading`),!0):e.length===0?this.error?``:c`<div class="empty-list">${i(`filePreview.noMatches`)}</div>`:this.layout===`document`?this.renderFolder(``):e.map(e=>this.renderItem(e))}
            </aside>
            ${this.error?c`<section class="detail empty">
                    <p role="alert">${this.error}</p>
                    <button
                      class="button"
                      @click=${()=>this.dispatchEvent(new CustomEvent(`file-preview-retry`,{bubbles:!0,composed:!0}))}
                    >
                      ${i(`common.retry`)}
                    </button>
                  </section>`:this.loading||this.fileLoading?c`<section class="detail">
                      <div class="detail-body">
                        ${x(`document`,i(`common.loading`),!0)}
                      </div>
                    </section>`:t?this.renderFile(t):this.renderEmpty()}
          </div>
          ${this.layout===`files`?c`<footer class="foot">
                  <span class="foot-group"
                    ><span class="kbd">↑↓</span> ${i(`filePreview.navigate`)}</span
                  >
                  <span class="spacer"></span>
                  <button class="button" @click=${this.emitClose}>
                    ${i(`common.close`)} <span class="kbd">esc</span>
                  </button>
                </footer>`:``}
        </div>
      </openclaw-modal-dialog>
    `}renderItem(e){return c`<button
      class="item ${e.path===this.activeFile?.path?`is-active`:``}"
      data-path=${e.path}
      aria-current=${e.path===this.activeFile?.path?`true`:`false`}
      @pointerdown=${e=>{this.layout===`files`&&this.preventItemPointerFocus(e)}}
      @mousedown=${e=>{this.layout===`files`&&this.preventItemPointerFocus(e)}}
      @click=${()=>this.emitSelect(e.path)}
    >
      <span class="item-icon">${I(e.path)}</span
      ><span class="item-name" title=${e.path}
        >${this.layout===`document`?e.path.split(`/`).pop():e.path}</span
      >${this.layout===`files`?c`<span class="item-meta">${e.size}</span>`:``}
    </button>`}renderFolder(e){let t=this.filteredFiles.filter(t=>t.path.startsWith(e)),n=t.filter(t=>!t.path.slice(e.length).includes(`/`)),r=new Set([...t.map(e=>e.path),...this.directories.map(e=>`${e}/`)].filter(t=>t.startsWith(e)&&t.slice(e.length).includes(`/`)).map(t=>t.slice(e.length).split(`/`)[0]));return c`${n.map(e=>this.renderItem(e))}${[...r].toSorted().map(t=>c`<details class="folder" open>
          <summary>${g.folder}<span>${t}</span></summary>
          <div>${this.renderFolder(`${e}${t}/`)}</div>
        </details>`)}`}renderFile(e){return c`
      <section class="detail">
        ${this.layout===`files`?c`<div class="detail-head">
                <div class="detail-title-row">
                  <h2 class="title">${e.path}</h2>
                  ${e.contents?b(e.contents,this.copyLabel||i(`filePreview.copyFile`)):``}
                </div>
                <div class="chips">
                  <span class="chip accent">${F(e.path)}</span>
                  <span class="chip">${e.size}</span>
                  <span class="chip">${this.readOnlyLabel||i(`filePreview.readOnly`)}</span>
                  ${this.contextLabel?c`<span class="chip ok">${this.contextLabel}</span>`:``}
                </div>
              </div>`:``}
        <div class="detail-body">
          ${e.message?c`<p role="status">${e.message}</p>`:this.layout===`document`&&/\.md$/iu.test(e.path)?c`<article class="markdown" @click=${this.handleDocumentLink}>${p(C(D(e.contents),{mode:`document`,remoteImages:!1,codeBlockChrome:`none`,fileLinks:!1}))}</article>`:c`<div class="code-content">${this.codeChunks.map((e,t)=>c`<pre class="code-chunk" data-chunk=${t}>${e}</pre>`)}</div>`}
        </div>
      </section>
    `}renderEmpty(){return c`
      <section class="detail empty">
        <p class="empty-title">${this.emptyTitle||i(`filePreview.emptyTitle`)}</p>
        <p class="empty-subtitle">${this.emptySubtitle||i(`filePreview.emptySubtitle`)}</p>
      </section>
    `}filterFiles(){let e=this.layout===`files`?this.query.trim().toLowerCase():``;return e?this.files.filter(t=>`${t.path}\n${t.contents}`.toLowerCase().includes(e)):this.files}resolveActiveFile(e){return e.find(e=>e.path===this.activePath)??e[0]}connectedCallback(){super.connectedCallback(),this.resetScrollAfterUpdate=!0,this.focusAfterUpdate=!0,this.requestUpdate()}updated(e){if(this.resetScrollAfterUpdate){this.resetScrollAfterUpdate=!1;let e=this.detailBody;e&&(e.scrollTop=0,e.scrollLeft=0)}(e.has(`activePath`)||e.has(`query`)||e.has(`files`))&&(this.scrollActiveFileIntoView(),this.layout===`document`&&e.has(`activePath`)&&this.focusModal()),this.focusAfterUpdate&&this.isConnected&&(this.focusAfterUpdate=!1,this.focusModal())}focusModal(){(this.searchInput??this.shadowRoot?.querySelector(`.item.is-active, .button`)??this.shadowRoot?.querySelector(`.close-button`))?.focus({preventScroll:!0})}moveSelection(e,t){t.preventDefault(),t.stopPropagation();let n=this.layout===`document`?[...this.shadowRoot?.querySelectorAll(`.item`)??[]].filter(e=>!e.closest(`details:not([open])`)).flatMap(e=>this.filteredFiles.filter(t=>t.path===e.dataset.path)):this.filterFiles();if(n.length===0)return;let r=this.resolveActiveFile(n),i=r?n.findIndex(e=>e.path===r.path):-1,a=n[Math.max(0,Math.min(n.length-1,i+e))];a&&a.path!==r?.path&&this.emitSelect(a.path)}scrollActiveFileIntoView(){this.updateComplete.then(()=>{this.isConnected&&this.shadowRoot?.querySelector(`.item.is-active`)?.scrollIntoView({block:`nearest`})}).catch(()=>{})}emitSelect(e){this.dispatchEvent(new CustomEvent(`file-preview-select`,{bubbles:!0,composed:!0,detail:e})),this.layout===`files`&&this.focusModal()}},t([h({attribute:!1})],L.prototype,`files`,void 0),t([h()],L.prototype,`activePath`,void 0),t([h()],L.prototype,`query`,void 0),t([h()],L.prototype,`label`,void 0),t([h()],L.prototype,`listLabel`,void 0),t([h()],L.prototype,`searchPlaceholder`,void 0),t([h()],L.prototype,`contextLabel`,void 0),t([h()],L.prototype,`readOnlyLabel`,void 0),t([h()],L.prototype,`emptyTitle`,void 0),t([h()],L.prototype,`emptySubtitle`,void 0),t([h()],L.prototype,`copyLabel`,void 0),t([h()],L.prototype,`layout`,void 0),t([h({attribute:!1})],L.prototype,`directories`,void 0),t([h({type:Boolean})],L.prototype,`loading`,void 0),t([h({type:Boolean})],L.prototype,`fileLoading`,void 0),t([h()],L.prototype,`error`,void 0),t([h()],L.prototype,`notice`,void 0),t([u(`.search`)],L.prototype,`searchInput`,void 0),t([u(`.detail-body`)],L.prototype,`detailBody`,void 0),R=64,z={code:g.fileCode,component:g.layoutGrid,data:g.braces,file:g.fileText,image:g.image,markdown:g.book,package:g.box,shell:g.terminal,skill:g.pencilSparkles}})))()}function V(){return(V=e((()=>{B(),customElements.get(`openclaw-file-preview-modal`)||customElements.define(`openclaw-file-preview-modal`,L)})))()}export{j as n,A as r,V as t};
//# sourceMappingURL=file-preview-modal-registration-B_In9_tE.js.map