import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,du as n,ju as r,nc as i,pu as a}from"./control-ui-core-bJHyI7AF.js";import{an as o,in as s,na as c,ra as l}from"./control-ui-core-DNh4McGE.js";import{$ as u,F as d,M as f,X as p,Y as m}from"./lit-runtime-DyST807n.js";import{Lo as h,Ro as g}from"./control-ui-boot-shared-DsSYH3B6.js";import{Ht as _,zt as v}from"./ui-DeikvIdP.js";import{bi as y,ct as b,ut as x,xi as S}from"./control-ui-boot-shared-C9uJ732w.js";import{J as C,Q as w,X as T,Y as E,Z as D,nt as O}from"./control-ui-boot-new-rmJmUTpH.js";import"./control-ui-boot-new-styles-Bb6Ub5D3.js";function k(e){return A?Promise.resolve():(A=!0,o(void 0,({host:t,render:a,finish:o})=>{let s=e.defaults.cwd,l=!1,f=`checking`,m=0,h=!1,g=null,v=!1,y=new T(e.listDirectory,I),b=()=>{y.reset(),m+=1,o(),A=!1},C=async t=>{if(t.preventDefault(),!(h||f!==`git`&&f!==`not_git`)){h=!0,g=null,I();try{g=await e.submit({cwd:s.trim(),worktree:f===`git`&&l})}catch(e){g=n(e)}if(!g){b();return}h=!1,I()}},w=()=>{let e=t.querySelector(`wa-popover.session-group-defaults__folder-popover`);e&&(e.open=!1)},D=()=>{y.reset(),v=!1,I()},k=e=>{s=e.trim(),D(),w(),j(!1)},j=async t=>{let n=++m;f=`checking`,l=!1,g=null,I();try{let r=await e.inspectRepository(s.trim()||void 0);if(n!==m)return;f=r,l=r===`git`&&t&&e.defaults.worktree}catch(e){if(n!==m)return;l=!1,f=_(e)?`restricted`:`unavailable`}I()},M=e=>{l=e,g=null,I()},N=e=>{let t=e.detail.item.getAttribute(`value`);(t===`local`||t===`worktree`)&&M(t===`worktree`)},P=e=>{if(!(e.currentTarget instanceof HTMLElement))return;let t=e.currentTarget;e.key===`Escape`&&t.open&&(e.preventDefault(),e.stopPropagation(),t.open=!1,t.querySelector(`#session-group-defaults-mode-trigger`)?.focus({preventScroll:!0}))},F=()=>{v=!0,y.navigate(s||void 0)};function I(){let t=s.trim(),n=t?i(t):r(`sessionsView.groupDefaultsCwdPlaceholder`),o=f===`checking`?`checking`:f===`git`?`git`:f===`restricted`?`restricted`:`local`,m=[{value:`local`,label:r(`sessionsView.groupDefaultsLocal`),description:r(`newSession.checkoutCurrentNote`),icon:c.monitor},{value:`worktree`,label:r(`sessionsView.groupDefaultsWorktree`),description:r(`sessionsView.groupDefaultsWorktreeHint`),icon:c.gitBranch}],_=m[+!!l];a(()=>u`
          <openclaw-modal-dialog
            label=${r(`sessionsView.groupDefaultsTitle`,{group:e.group})}
            @modal-cancel=${e=>{if(h){e.preventDefault();return}b()}}
          >
            <form class="exec-approval-card session-group-defaults" @submit=${C}>
              <div class="exec-approval-header">
                <div>
                  <div class="exec-approval-title">
                    ${r(`sessionsView.groupDefaultsTitle`,{group:e.group})}
                  </div>
                  <div class="exec-approval-sub">${r(`sessionsView.groupDefaultsDescription`)}</div>
                </div>
              </div>
              <div class="session-group-defaults__fields">
                <div class="field">
                  <span>${r(`sessionsView.groupDefaultsCwd`)}</span>
                  <button
                    id="session-group-defaults-folder-trigger"
                    type="button"
                    class="new-session-page__trigger session-group-defaults__folder"
                    aria-label="${r(`sessionsView.groupDefaultsCwd`)}: ${n}"
                    aria-haspopup="dialog"
                    ?disabled=${h}
                  >
                    <span class="new-session-page__target-icon" aria-hidden="true"
                      >${c.folder}</span
                    >
                    <span class="session-group-defaults__folder-copy">
                      <strong>${n}</strong>
                      <small title=${t||p}
                        >${t||r(`sessionsView.groupDefaultsCwdHint`)}</small
                      >
                    </span>
                    <span class="new-session-page__trigger-chevron" aria-hidden="true"
                      >${c.chevronDown}</span
                    >
                  </button>
                  <wa-popover
                    ${d(x)}
                    class="new-session-page__select new-session-page__project-popover new-session-page__picker-popover session-group-defaults__folder-popover"
                    for="session-group-defaults-folder-trigger"
                    placement="bottom-start"
                    without-arrow
                    @wa-hide=${D}
                  >
                    ${v?E({browser:y,id:`session-group-defaults-browser`,label:r(`newSession.gateway`),registerProjectPath:null,registeringProject:!1,onBack:D,onRegisterProject:()=>void 0,onClose:D,onApplyFolder:k}):u`
                            <div class="new-session-page__picker-root">
                              ${O({value:`agent-workspace`,label:r(`sessionsView.groupDefaultsCwdPlaceholder`),icon:c.folder,checked:!t,onSelect:()=>k(``)},h)}
                              <button
                                type="button"
                                class="session-menu__item"
                                data-value="browse"
                                aria-pressed="false"
                                ?disabled=${h}
                                @click=${F}
                              >
                                <span class="session-menu__check" aria-hidden="true"></span>
                                <span class="session-menu__text">${r(`newSession.browse`)}</span>
                                <span class="new-session-page__menu-chevron" aria-hidden="true"
                                  >${c.chevronRight}</span
                                >
                              </button>
                            </div>
                          `}
                  </wa-popover>
                </div>
                <div class="field">
                  <span>${r(`sessionsView.groupDefaultsMode`)}</span>
                  <div
                    class="session-group-defaults__environment"
                    data-session-group-environment=${o}
                    aria-live="polite"
                  >
                    ${f===`git`?u`
                            <wa-dropdown
                              class="session-group-defaults__mode-dropdown"
                              placement="bottom-start"
                              aria-label=${r(`sessionsView.groupDefaultsMode`)}
                              @wa-select=${N}
                              @keydown=${P}
                            >
                              <button
                                id="session-group-defaults-mode-trigger"
                                slot="trigger"
                                type="button"
                                class="session-group-defaults__resolved-mode session-group-defaults__mode-trigger"
                                data-value=${_.value}
                                aria-label=${`${r(`sessionsView.groupDefaultsMode`)}: ${_.label}`}
                                ?disabled=${h}
                              >
                                <span class="new-session-page__target-icon" aria-hidden="true"
                                  >${_.icon}</span
                                >
                                <span class="session-group-defaults__resolved-copy">
                                  <strong>${_.label}</strong>
                                  <small>${_.description}</small>
                                </span>
                                <span class="new-session-page__trigger-chevron" aria-hidden="true"
                                  >${c.chevronDown}</span
                                >
                              </button>
                              ${m.map(e=>{let t=e===_;return u`
                                  <wa-dropdown-item
                                    class="session-group-defaults__mode-option"
                                    data-environment-mode=${e.value}
                                    ?data-selected=${t}
                                    aria-label=${`${e.label}, ${e.description}`}
                                    value=${e.value}
                                    type="checkbox"
                                    .checked=${t}
                                    ?disabled=${h}
                                    ?autofocus=${t&&!h}
                                    ${d(e=>S(e,t))}
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
                          `:u`
                            <div
                              class="session-group-defaults__resolved-mode"
                              role=${f===`checking`?`status`:p}
                            >
                              <span class="new-session-page__target-icon" aria-hidden="true"
                                >${f===`checking`?c.gitBranch:c.monitor}</span
                              >
                              <span class="session-group-defaults__resolved-copy">
                                <strong
                                  >${r(f===`checking`?`newSession.checkingGit`:`sessionsView.groupDefaultsLocal`)}</strong
                                >
                                ${f===`checking`?p:u`<small
                                        >${r(f===`restricted`?`sessionsView.groupDefaultsRequiresAdmin`:f===`unavailable`?`newSession.gitCheckUnavailable`:`newSession.checkoutCurrentNote`)}</small
                                      >`}
                              </span>
                            </div>
                          `}
                  </div>
                </div>
              </div>
              ${g?u`<div class="exec-approval-error" role="alert">${g}</div>`:p}
              <div class="exec-approval-actions">
                <button
                  type="submit"
                  class="btn primary"
                  ?disabled=${h||f===`checking`||f===`unavailable`||f===`restricted`}
                >
                  ${r(`common.save`)}
                </button>
                ${f===`unavailable`||f===`restricted`?u`
                        <button
                          type="button"
                          class="btn"
                          ?disabled=${h}
                          @click=${()=>void j(s.trim()===e.defaults.cwd.trim())}
                        >
                          ${r(`common.retry`)}
                        </button>
                      `:p}
                <button type="button" class="btn" ?disabled=${h} @click=${b}>
                  ${r(`common.cancel`)}
                </button>
              </div>
            </form>
          </openclaw-modal-dialog>
        `)}j(!0)}))}var A;function j(){return(j=e((()=>{v(),m(),f(),t(),h(),a(),w(),D(),C(),l(),s(),b(),y(),g(),A=!1})))()}j();export{k as showSessionGroupDefaultsDialog};
//# sourceMappingURL=session-group-defaults-dialog-DAfqQL7R.js.map