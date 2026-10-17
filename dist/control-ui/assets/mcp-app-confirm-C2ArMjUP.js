import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,ju as n}from"./control-ui-core-CTSdBcaH.js";import{$ as r,F as i,M as a,X as o,Y as s,mt as c}from"./lit-runtime-TNZj1e-P.js";import{Cr as l,Sr as u}from"./control-ui-boot-shared-D4E0xCZu.js";var d,f;function p(){return(p=e((()=>{s(),d=c`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: var(--bg-accent);
  color: var(--text);
  font-size: 13px;
`,f=c`
  :host {
    display: block;
    width: 100%;
  }
  .mount {
    width: 100%;
    min-height: 160px;
  }
  .mount:empty {
    min-height: 0;
  }
  :host([fill-container]) {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }
  :host([fill-container]) .mount,
  :host([display-mode="fullscreen"]) .mount {
    flex: 1;
    min-height: 0;
  }
  iframe {
    display: block;
    width: 100%;
    border: 0;
    background: var(--board-surface, transparent);
  }
  :host([display-mode="fullscreen"]) {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: var(--bg);
    padding-top: 40px;
    margin: 0;
    border: 0;
    box-sizing: border-box;
  }
  .exit-fullscreen {
    position: absolute;
    top: 4px;
    right: 8px;
  }
  .inactive {
    ${d}
    justify-content: space-between;
  }
  .inactive button {
    flex-shrink: 0;
  }
  .error {
    padding: 14px;
    color: var(--danger, #dc2626);
    font-size: 13px;
  }
`})))()}var m,h;function g(){return(g=e((()=>{s(),a(),t(),u(),p(),l(),m=c`
  .mcp-app-confirm {
    ${d}
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    flex-shrink: 0;
    flex-wrap: wrap;
    font: 13px/1.4 var(--font-body, sans-serif);
    border-bottom: 1px solid var(--border);
  }
  .mcp-app-confirm:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: -2px;
  }
  .mcp-app-confirm__copy {
    flex: 1 1 240px;
    min-width: 0;
  }
  .mcp-app-confirm__title,
  .mcp-app-confirm__preview {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .mcp-app-confirm__title {
    font-weight: 600;
  }
  .mcp-app-confirm__preview {
    color: var(--muted);
    margin-top: 4px;
  }
  .mcp-app-confirm__actions {
    display: flex;
    flex-shrink: 0;
    gap: 8px;
  }
  .mcp-app-confirm__actions button {
    padding: 7px 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md, 8px);
    background: var(--bg);
    color: var(--text);
    font: inherit;
  }
  .mcp-app-confirm__actions .mcp-app-confirm__accept {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--accent-foreground);
  }
`,h=class{constructor(e){this.requestUpdate=e,this.pending=null,this.focusStrip=e=>{let t=this.pending;queueMicrotask(()=>{e instanceof HTMLElement&&e.isConnected&&this.pending===t&&e.focus({preventScroll:!0})})}}request(e){return this.pending||!e.isCurrent()?Promise.resolve(!1):new Promise(t=>{this.pending={...e,resolve:t},this.requestUpdate()})}cancel(){this.finish(!1,!1)}update(){this.pending&&!this.pending.isCurrent()&&this.cancel()}finish(e,t=!0){let n=this.pending;if(!n)return;this.pending=null,this.requestUpdate();let r=n.isCurrent()&&n.frame.isConnected;t&&r&&n.frame.focus({preventScroll:!0}),n.resolve(e&&r)}render(){let e=this.pending;if(!e)return o;let t=n(e.kind===`message`?`mcpApp.confirmMessage`:`mcpApp.confirmFile`);return r`
      <style>
        ${m}
      </style>
      <div
        class="mcp-app-confirm"
        role="alertdialog"
        aria-label=${`${e.title}: ${t}`}
        tabindex="-1"
        ${i(this.focusStrip)}
        @keydown=${e=>{(e.key===`Escape`||e.key===`Enter`)&&(e.stopPropagation(),(e.key===`Escape`||e.target===e.currentTarget)&&(e.preventDefault(),this.finish(e.key===`Enter`)))}}
      >
        <div class="mcp-app-confirm__copy">
          <div class="mcp-app-confirm__title" title=${e.title}>${e.title}</div>
          <div>${t}</div>
          <div class="mcp-app-confirm__preview" title=${e.text}>
            ${e.text.length>200?`${e.text.slice(0,200)}…`:e.text}
          </div>
        </div>
        <div class="mcp-app-confirm__actions">
          <button class="mcp-app-confirm__accept" type="button" @click=${()=>this.finish(!0)}>
            ${n(e.kind===`message`?`mcpApp.sendMessage`:`mcpApp.openFile`)}
          </button>
          <button type="button" @click=${()=>this.finish(!1)}>${n(`mcpApp.cancel`)}</button>
        </div>
      </div>
    `}}})))()}export{f as i,g as n,p as r,h as t};
//# sourceMappingURL=mcp-app-confirm-C2ArMjUP.js.map