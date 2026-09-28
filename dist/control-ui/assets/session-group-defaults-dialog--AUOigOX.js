import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Fs as t,Gl as n,Ls as r,Xl as i}from"./control-ui-core-BfjCgLp6.js";import{$ as a,X as o,Y as s,_ as c,m as l}from"./lit-runtime-L6OV30Vo.js";import{Fi as u,Ii as d,Ut as f,Wt as p}from"./control-ui-core-qT0XjEdV.js";import{Il as m,Ll as h}from"./control-ui-boot-shared-CYu509im.js";import{Fa as g,Pa as _}from"./control-ui-boot-shared-Bm2ZxasE.js";import{m as v}from"./control-ui-boot-shared-BtDOT-1l.js";import{$ as y,Q as b,X as x,Z as S,et as C,it as w,mt as T}from"./control-ui-boot-new-BDpfvqZB.js";function E(e){return D?Promise.resolve():(D=!0,p(void 0,({host:n,render:r,finish:s})=>{let l=e.defaults.cwd,d=!1,f=`checking`,p=0,m=!1,h=null,_=!1,y=new b(e.listDirectory,P),x=()=>{y.reset(),p+=1,s(),D=!1},C=async n=>{if(n.preventDefault(),!(m||f===`checking`||f===`unavailable`)){m=!0,h=null,P();try{h=await e.submit({cwd:l.trim(),worktree:f===`git`&&d})}catch(e){h=t(e)}if(!h){x();return}m=!1,P()}},T=()=>{let e=n.querySelector(`wa-popover.session-group-defaults__folder-popover`);e&&(e.open=!1)},E=()=>{y.reset(),_=!1,P()},O=e=>{l=e.trim(),E(),T(),k(!1)},k=async t=>{let n=++p;f=`checking`,d=!1,h=null,P();try{let r=await e.inspectRepository(l.trim()||void 0);if(n!==p)return;f=r,d=r===`git`&&t&&e.defaults.worktree}catch{if(n!==p)return;f=`unavailable`,d=!1}P()},A=e=>{d=e,h=null,P()},j=e=>{let t=e.detail.item.getAttribute(`value`);(t===`local`||t===`worktree`)&&A(t===`worktree`)},M=e=>{if(!(e.currentTarget instanceof HTMLElement))return;let t=e.currentTarget;e.key===`Escape`&&t.open&&(e.preventDefault(),e.stopPropagation(),t.open=!1,t.querySelector(`#session-group-defaults-mode-trigger`)?.focus({preventScroll:!0}))},N=()=>{_=!0,y.navigate(l||void 0)};function P(){let t=l.trim(),n=t?v(t):i(`sessionsView.groupDefaultsCwdPlaceholder`),s=f===`checking`?`checking`:f===`git`?`git`:`local`,p=[{value:`local`,label:i(`sessionsView.groupDefaultsLocal`),description:i(`newSession.checkoutCurrentNote`),icon:u.monitor},{value:`worktree`,label:i(`sessionsView.groupDefaultsWorktree`),description:i(`sessionsView.groupDefaultsWorktreeHint`),icon:u.gitBranch}],b=p[+!!d];r(()=>a`
          <openclaw-modal-dialog
            label=${i(`sessionsView.groupDefaultsTitle`,{group:e.group})}
            @modal-cancel=${e=>{if(m){e.preventDefault();return}x()}}
          >
            <form class="exec-approval-card session-group-defaults" @submit=${C}>
              <div class="exec-approval-header">
                <div>
                  <div class="exec-approval-title">
                    ${i(`sessionsView.groupDefaultsTitle`,{group:e.group})}
                  </div>
                  <div class="exec-approval-sub">${i(`sessionsView.groupDefaultsDescription`)}</div>
                </div>
              </div>
              <div class="session-group-defaults__fields">
                <div class="field">
                  <span>${i(`sessionsView.groupDefaultsCwd`)}</span>
                  <button
                    id="session-group-defaults-folder-trigger"
                    type="button"
                    class="new-session-page__trigger session-group-defaults__folder"
                    aria-label="${i(`sessionsView.groupDefaultsCwd`)}: ${n}"
                    aria-haspopup="dialog"
                    ?disabled=${m}
                  >
                    <span class="new-session-page__target-icon" aria-hidden="true"
                      >${u.folder}</span
                    >
                    <span class="session-group-defaults__folder-copy">
                      <strong>${n}</strong>
                      <small title=${t||o}
                        >${t||i(`sessionsView.groupDefaultsCwdHint`)}</small
                      >
                    </span>
                    <span class="new-session-page__trigger-chevron" aria-hidden="true"
                      >${u.chevronDown}</span
                    >
                  </button>
                  <wa-popover
                    class="new-session-page__select new-session-page__project-popover new-session-page__picker-popover session-group-defaults__folder-popover"
                    for="session-group-defaults-folder-trigger"
                    placement="bottom-start"
                    without-arrow
                    @wa-hide=${E}
                  >
                    ${_?S({browser:y,id:`session-group-defaults-browser`,label:i(`newSession.gateway`),registerProjectPath:null,registeringProject:!1,onBack:E,onRegisterProject:()=>void 0,onClose:E,onApplyFolder:O}):a`
                            <div class="new-session-page__picker-root">
                              ${w({value:`agent-workspace`,label:i(`sessionsView.groupDefaultsCwdPlaceholder`),icon:u.folder,checked:!t,onSelect:()=>O(``)},m)}
                              <button
                                type="button"
                                class="session-menu__item"
                                data-value="browse"
                                aria-pressed="false"
                                ?disabled=${m}
                                @click=${N}
                              >
                                <span class="session-menu__check" aria-hidden="true"></span>
                                <span class="session-menu__text">${i(`newSession.browse`)}</span>
                                <span class="new-session-page__menu-chevron" aria-hidden="true"
                                  >${u.chevronRight}</span
                                >
                              </button>
                            </div>
                          `}
                  </wa-popover>
                </div>
                <div class="field">
                  <span>${i(`sessionsView.groupDefaultsMode`)}</span>
                  <div
                    class="session-group-defaults__environment"
                    data-session-group-environment=${s}
                    aria-live="polite"
                  >
                    ${f===`git`?a`
                            <wa-dropdown
                              class="session-group-defaults__mode-dropdown"
                              placement="bottom-start"
                              aria-label=${i(`sessionsView.groupDefaultsMode`)}
                              @wa-select=${j}
                              @keydown=${M}
                            >
                              <button
                                id="session-group-defaults-mode-trigger"
                                slot="trigger"
                                type="button"
                                class="session-group-defaults__resolved-mode session-group-defaults__mode-trigger"
                                data-value=${b.value}
                                aria-label=${`${i(`sessionsView.groupDefaultsMode`)}: ${b.label}`}
                                ?disabled=${m}
                              >
                                <span class="new-session-page__target-icon" aria-hidden="true"
                                  >${b.icon}</span
                                >
                                <span class="session-group-defaults__resolved-copy">
                                  <strong>${b.label}</strong>
                                  <small>${b.description}</small>
                                </span>
                                <span class="new-session-page__trigger-chevron" aria-hidden="true"
                                  >${u.chevronDown}</span
                                >
                              </button>
                              ${p.map(e=>{let t=e===b;return a`
                                  <wa-dropdown-item
                                    class="session-group-defaults__mode-option"
                                    data-environment-mode=${e.value}
                                    ?data-selected=${t}
                                    aria-label=${`${e.label}, ${e.description}`}
                                    value=${e.value}
                                    type="checkbox"
                                    .checked=${t}
                                    ?disabled=${m}
                                    ?autofocus=${t&&!m}
                                    ${c(e=>g(e,t))}
                                  >
                                    <span
                                      slot="icon"
                                      class="new-session-page__target-icon session-group-defaults__mode-option-icon"
                                      aria-hidden="true"
                                      >${e.icon}</span
                                    >
                                    <span class="session-group-defaults__resolved-copy">
                                      <strong>${e.label}</strong>
                                      <small>${e.description}</small>
                                    </span>
                                  </wa-dropdown-item>
                                `})}
                            </wa-dropdown>
                          `:a`
                            <div
                              class="session-group-defaults__resolved-mode"
                              role=${f===`checking`?`status`:o}
                            >
                              <span class="new-session-page__target-icon" aria-hidden="true"
                                >${f===`checking`?u.gitBranch:u.monitor}</span
                              >
                              <span class="session-group-defaults__resolved-copy">
                                <strong
                                  >${i(f===`checking`?`newSession.checkingGit`:`sessionsView.groupDefaultsLocal`)}</strong
                                >
                                ${f===`checking`?o:a`<small
                                        >${i(f===`unavailable`?`newSession.gitCheckUnavailable`:`newSession.checkoutCurrentNote`)}</small
                                      >`}
                              </span>
                            </div>
                          `}
                  </div>
                </div>
              </div>
              ${h?a`<div class="exec-approval-error" role="alert">${h}</div>`:o}
              <div class="exec-approval-actions">
                <button
                  type="submit"
                  class="btn primary"
                  ?disabled=${m||f===`checking`||f===`unavailable`}
                >
                  ${i(`common.save`)}
                </button>
                ${f===`unavailable`?a`
                        <button
                          type="button"
                          class="btn"
                          ?disabled=${m}
                          @click=${()=>void k(l.trim()===e.defaults.cwd.trim())}
                        >
                          ${i(`common.retry`)}
                        </button>
                      `:o}
                <button type="button" class="btn" ?disabled=${m} @click=${x}>
                  ${i(`common.cancel`)}
                </button>
              </div>
            </form>
          </openclaw-modal-dialog>
        `)}k(!0)}))}var D;function O(){return(O=e((()=>{s(),l(),n(),m(),r(),C(),y(),x(),d(),f(),_(),T(),h(),D=!1})))()}O();export{E as showSessionGroupDefaultsDialog};
//# sourceMappingURL=session-group-defaults-dialog--AUOigOX.js.map