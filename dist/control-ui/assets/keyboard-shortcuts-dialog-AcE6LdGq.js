import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,Hr as n,Tu as r,Ur as i,_u as a,bu as o,ju as s,wu as c,xu as l}from"./control-ui-core-bJHyI7AF.js";import{F as u,Mi as d,P as f,Qi as p,Wr as m,Xi as h,ji as g,na as _,ra as v}from"./control-ui-core-DNh4McGE.js";import{$ as y,X as b,Y as x,ct as S,mt as C,nt as w,ut as T}from"./lit-runtime-DyST807n.js";import{Do as E,Eo as D}from"./control-ui-boot-shared-DsSYH3B6.js";import{ii as O}from"./ui-DeikvIdP.js";function k(e,...t){return{id:e,label:`shortcutsOverlay.labels.${e}`,combos:t}}function A(e,t){return{id:e,label:`shortcutsOverlay.sections.${e}`,entries:t}}function j(e=`enter`){return e===`modifier-enter`?M.map(e=>A(e.id,e.entries.map(e=>N.has(e.id)?k(e.id,a.modifiedEnter):e))):M}var M,N;function P(){return(P=e((()=>{D(),o(),E(),M=[A(`general`,[k(`commandPalette`,a.commandPalette),k(`newSession`,a.newSession),k(`paletteStartSession`,a.modifiedEnter),k(`keyboardShortcuts`,a.keyboardShortcuts),k(`toggleSidebar`,a.toggleSidebar),k(`debugOverlay`,a.debugOverlay),k(`appearanceSettings`,a.appearanceSettings),k(`startNewSession`,a.sendMessage),k(`closeDialog`,a.escape)]),A(`chat`,[k(`archiveSession`,a.archiveSession),k(`sendMessage`,a.sendMessage),k(`newline`,a.newline),k(`steerImmediately`,a.modifiedEnter),k(`historyRecall`,a.historyPrevious,a.historyNext),k(`transcriptSearch`,a.transcriptSearch),k(`clearReply`,a.escape),k(`stopResponse`,a.escape),k(`cancelDictation`,a.escape),k(`saveQueuedMessage`,a.modifiedEnter)]),A(`panels`,[k(`terminalPanel`,a.terminalPanel),k(`homePanel`,a.homePanel),k(`workspaceFiles`,a.workspaceFiles),k(`sideChat`,a.sideChat),k(`browserPanel`,a.browserPanel),k(`desktopPanel`,a.desktopPanel),k(`discussionPanel`,a.discussionPanel),k(`dashboardPanel`,a.dashboardPanel),k(`reviewPanel`,a.reviewPanel)]),A(`sidebar`,[k(`toggleSessionSelect`,a.toggleSessionSelect),k(`extendSessionSelect`,a.extendSessionSelect)]),A(`imageViewer`,[k(`zoomIn`,a.zoomIn),k(`zoomOut`,a.zoomOut),k(`zoomReset`,a.zoomReset),k(`panImageHorizontal`,a.imagePanLeft,a.imagePanRight),k(`panImageVertical`,a.imagePanUp,a.imagePanDown)]),A(`approvals`,[k(`approveOnce`,a.modifiedEnter),k(`approveAlways`,a.approveAlways),k(`denyApproval`,a.denyApproval)])],N=new Set([`sendMessage`,`startNewSession`])})))()}var F;function I(){return(I=e((()=>{x(),w(),f(),t(),P(),o(),n(),r(),v(),g(),h(),m(),F=class extends c{constructor(...e){super(...e),this.sendShortcut=`enter`,this.open=!1,this.handleKeydown=async e=>{let t=e.currentTarget,n=document.openClawModalLayers;if(e.defaultPrevented||e.repeat||!this.open||!(t instanceof HTMLElement)||n?.size!==1||!n.has(t))return;let r=this.newSessionHost,o=r?.context,s=l(a.newSession,e)&&r&&!r.onboardingMode&&i(o?.gateway.snapshot,{method:`sessions.create`,params:{},sessionScope:!0}).allowed;(s||l(a.keyboardShortcuts,e))&&(e.preventDefault(),e.stopPropagation(),this.open=!1,await this.updateComplete,this.isConnected&&!this.open&&s&&r.isConnected&&r.context===o&&u(r,`shortcut`))}}static{this.styles=[d,C`
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
      }

      .close span {
        display: flex;
      }

      .close svg {
        width: 16px;
        height: 16px;
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
    `]}get isOpen(){return this.open}toggle(){this.open=!this.open}render(){if(!this.open)return b;let e=e=>{e.preventDefault(),this.open=!1};return y`
      <openclaw-modal-dialog
        label=${s(`shortcutsOverlay.title`)}
        @modal-cancel=${e}
        @keydown=${this.handleKeydown}
      >
        <div class="dialog">
          <header class="header">
            <h2>${s(`shortcutsOverlay.title`)}</h2>
            <button class="close" type="button" aria-label=${s(`common.close`)} @click=${e}>
              <span aria-hidden="true">${_.x}</span>
            </button>
          </header>
          <div class="body">
            ${j(this.sendShortcut).map(e=>y`
                <section>
                  <h3>${s(e.label)}</h3>
                  ${e.entries.map(e=>y`
                      <div class="shortcut-row">
                        <span>${s(e.label)}</span>
                        <span class="combos">
                          ${e.combos.map(e=>y`
                              <span class="combo">
                                ${p(e,{separateKeys:!0})}
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
    `}},O([T({attribute:!1})],F.prototype,`sendShortcut`,void 0),O([T({attribute:!1})],F.prototype,`newSessionHost`,void 0),O([S()],F.prototype,`open`,void 0),customElements.get(`openclaw-keyboard-shortcuts-dialog`)||customElements.define(`openclaw-keyboard-shortcuts-dialog`,F)})))()}I();
//# sourceMappingURL=keyboard-shortcuts-dialog-AcE6LdGq.js.map