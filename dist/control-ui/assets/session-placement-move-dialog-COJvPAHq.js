import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Fs as t,Gl as n,Ls as r,Xl as i}from"./control-ui-core-DkXlmHxW.js";import{$ as a,X as o,Y as s}from"./lit-runtime-DLvISeBM.js";import{Fi as c,Ii as l,Ut as u,Wt as d}from"./control-ui-core-BdNTI4B-.js";import{Il as f,Ll as p}from"./control-ui-boot-shared-XNIZlLuA.js";import{Sa as m,Ta as h}from"./control-ui-boot-shared-C5a8_33C.js";import{G as g,W as _,et as v,it as y,nt as b,rt as x,tt as S}from"./control-ui-boot-new-DDdINxls.js";function C(e){if(!e)return``;switch(e.kind){case`gateway`:return`gateway`;case`profile`:return`profile:${e.profileId}`;case`device`:return`device:${e.deviceId}`}throw Error(`Unknown session placement move target`)}function w(e){return T?Promise.resolve(null):(T=!0,d(void 0,({render:n,finish:r})=>{let s=!0,l=null,u={profiles:[],devices:[]},d=e.mode===`move`?{kind:`gateway`}:null,f=new _,p=e=>{r(e),T=!1},h=e=>{d=e,v()},g=e=>{if(e.preventDefault(),!d)return;if(d.kind!==`profile`){p(d);return}let t=f.resolve(d.profileId),n=f.resolveOs(d.profileId);p({...d,...t?{machineClass:t}:{},...n?{os:n}:{}})};function v(){let t=C(d),r=u.profiles.toSorted(m),_=e.mode===`restart`,w=e.mode===`dispatch`,T=i(`sessionsView.${e.mode}SessionTitle`),E=i(`sessionsView.${e.mode}SessionDescription`,{session:e.sessionLabel}),D=i(`sessionsView.${e.mode}SessionAction`);n(()=>a`
          <openclaw-modal-dialog label=${T} @modal-cancel=${()=>p(null)}>
            <form class="exec-approval-card" @submit=${g}>
              <div class="exec-approval-header">
                <div class="exec-approval-title">${T}</div>
                <div class="muted">${E}</div>
              </div>
              ${_?a`<div class="exec-approval-error" role="alert">
                      ${i(`sessionsView.restartSessionWarning`)}
                    </div>`:w?a`<div class="callout">${i(`sessionsView.dispatchSessionNotice`)}</div>`:e.activeRun?a`<div class="exec-approval-error" role="alert">
                          ${i(`sessionsView.moveSessionActiveRunWarning`)}
                        </div>`:a`<div class="callout">
                          ${i(`sessionsView.moveSessionNoReplayWarning`)}
                        </div>`}
              ${s?a`<div class="muted">${i(`common.loading`)}</div>`:l?a`<div class="exec-approval-error" role="alert">${l}</div>`:a`
                        <div class="new-session-page__picker-root">
                          ${w?o:y({value:`gateway`,label:i(`newSession.gateway`),icon:c.monitor,checked:t===`gateway`,disabled:!!e.gatewayDisabledReason,title:e.gatewayDisabledReason,onSelect:()=>h({kind:`gateway`})},!1)}
                          ${u.devices.length>0?a`
                                  <div class="new-session-page__menu-title">
                                    ${i(`newSession.yourDevices`)}
                                  </div>
                                  ${u.devices.map(n=>{let r=e.deviceDisabledReason??n.disabledReason;return y({value:`device:${n.deviceId}`,label:n.label,sub:n.subtitle,icon:c.monitor,facts:e.deviceDisabledReason?[e.deviceDisabledReason]:n.facts,checked:t===`device:${n.deviceId}`,disabled:!!e.deviceDisabledReason||!n.selectable,title:r,onSelect:()=>h({kind:`device`,deviceId:n.deviceId})},!1)})}
                                `:o}
                          ${u.profiles.length>0?a`
                                  <div class="new-session-page__menu-title">
                                    ${i(`newSession.cloud`)}
                                  </div>
                                  ${r.map(t=>{let n=d?.kind===`profile`&&d.profileId===t.id,r=f.machines(t),s=t.operatingSystems??[],c=f.resolve(t.id)||r.find(e=>e.default===!0)?.id||``;return a`
                                      ${x({profiles:[t],selectedId:n?t.id:``,submitting:!1,profileDisabledReason:e.profileDisabledReason,onSelect:e=>h({kind:`profile`,profileId:e})})}
                                      ${n&&s.length>=2?a`
                                              <div class="new-session-page__menu-title">
                                                ${i(`newSession.operatingSystem`)}
                                              </div>
                                              ${b({operatingSystems:s,selectedId:f.selectedOs(t),submitting:!1,onSelect:e=>f.selectOs(t.id,e,u.profiles,!1,v)})}
                                            `:o}
                                      ${n&&r.length>0?a`
                                              <div class="new-session-page__menu-title">
                                                ${i(`newSession.machine`)}
                                              </div>
                                              ${S({machines:r,selectedId:c,submitting:!1,onSelect:e=>f.select(t.id,e,u.profiles,!1,v)})}
                                            `:o}
                                    `})}
                                `:o}
                        </div>
                      `}
              <div class="exec-approval-actions">
                <button
                  type="submit"
                  class="btn primary"
                  ?disabled=${s||!!l||!d}
                >
                  ${D}
                </button>
                <button type="button" class="btn" @click=${()=>p(null)}>
                  ${i(`common.cancel`)}
                </button>
              </div>
            </form>
          </openclaw-modal-dialog>
        `)}v(),e.loadCatalog().then(e=>{u=e}).catch(e=>{l=t(e,i(`sessionsView.moveSessionCatalogFailed`))}).finally(()=>{s=!1,v()})}))}var T;function E(){return(E=e((()=>{s(),n(),f(),r(),v(),g(),l(),u(),h(),p(),T=!1})))()}E();export{w as showSessionPlacementTargetDialog};
//# sourceMappingURL=session-placement-move-dialog-COJvPAHq.js.map