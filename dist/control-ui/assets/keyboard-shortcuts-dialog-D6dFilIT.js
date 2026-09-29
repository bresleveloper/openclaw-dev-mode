import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Ds5QQwGa.js";import{Es as n,Gl as r,Kn as i,Os as a,Rl as o,Xl as s,js as c,qn as l,zl as u}from"./control-ui-core-DkXlmHxW.js";import{$ as d,X as f,Y as p,ct as m,mt as h,nt as g,ut as _}from"./lit-runtime-DLvISeBM.js";import{A as v,Fr as y,k as b}from"./control-ui-core-BdNTI4B-.js";import{On as x,kn as S}from"./control-ui-boot-shared-XNIZlLuA.js";var C;function w(){return(w=e((()=>{p(),g(),b(),r(),x(),i(),u(),y(),C=class extends o{constructor(...e){super(...e),this.sendShortcut=`enter`,this.open=!1,this.handleKeydown=async e=>{let t=e.currentTarget,r=document.openClawModalLayers;if(e.defaultPrevented||e.repeat||!this.open||!(t instanceof HTMLElement)||r?.size!==1||!r.has(t))return;let i=this.newSessionHost,a=i?.context,o=c(n.newSession,e)&&i&&!i.onboardingMode&&l(a?.gateway.snapshot,{method:`sessions.create`,params:{}}).allowed;(o||c(n.keyboardShortcuts,e))&&(e.preventDefault(),e.stopPropagation(),this.open=!1,await this.updateComplete,this.isConnected&&!this.open&&o&&i.isConnected&&i.context===a&&v(i,`shortcut`))}}static{this.styles=h`
    :host {
      display: contents;
      --openclaw-modal-width: 560px;
    }

    .dialog {
      display: flex;
      max-height: min(720px, calc(100dvh - 64px));
      flex-direction: column;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--card);
      color: var(--text);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 22px 16px;
      border-bottom: 1px solid var(--border);
    }

    h2 {
      margin: 0;
      color: var(--text-strong);
      font-size: 16px;
      font-weight: 600;
    }

    .close {
      display: grid;
      width: 28px;
      height: 28px;
      place-items: center;
      border: 0;
      border-radius: 6px;
      background: transparent;
      color: var(--muted);
      font-size: 20px;
    }

    .close:hover {
      background: var(--bg-hover);
      color: var(--text);
    }

    .body {
      overflow: auto;
      padding: 8px 22px 18px;
    }

    section + section {
      margin-top: 12px;
      border-top: 1px solid var(--border);
    }

    h3 {
      margin: 18px 0 8px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .shortcut-row {
      display: flex;
      min-height: 34px;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      font-size: 13px;
    }

    .combos {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .combo {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    kbd {
      min-width: 22px;
      padding: 3px 6px;
      border: 1px solid var(--border-strong);
      border-radius: 5px;
      background: var(--bg-muted);
      color: var(--text);
      font: inherit;
      font-size: 12px;
      text-align: center;
    }
  `}get isOpen(){return this.open}toggle(){this.open=!this.open}render(){if(!this.open)return f;let e=e=>{e.preventDefault(),this.open=!1};return d`
      <openclaw-modal-dialog
        label=${s(`shortcutsOverlay.title`)}
        @modal-cancel=${e}
        @keydown=${this.handleKeydown}
      >
        <div class="dialog">
          <header class="header">
            <h2>${s(`shortcutsOverlay.title`)}</h2>
            <button class="close" type="button" aria-label=${s(`common.close`)} @click=${e}>
              <span aria-hidden="true">×</span>
            </button>
          </header>
          <div class="body">
            ${S(this.sendShortcut).map(e=>d`
                <section>
                  <h3>${s(e.label)}</h3>
                  ${e.entries.map(e=>d`
                      <div class="shortcut-row">
                        <span>${s(e.label)}</span>
                        <span class="combos">
                          ${e.combos.map(e=>d`
                              <span class="combo">
                                ${a(e).map(e=>d`<kbd>${e}</kbd>`)}
                              </span>
                            `)}
                        </span>
                      </div>
                    `)}
                </section>
              `)}
          </div>
        </div>
      </openclaw-modal-dialog>
    `}},t([_({attribute:!1})],C.prototype,`sendShortcut`,void 0),t([_({attribute:!1})],C.prototype,`newSessionHost`,void 0),t([m()],C.prototype,`open`,void 0),customElements.get(`openclaw-keyboard-shortcuts-dialog`)||customElements.define(`openclaw-keyboard-shortcuts-dialog`,C)})))()}w();
//# sourceMappingURL=keyboard-shortcuts-dialog-D6dFilIT.js.map