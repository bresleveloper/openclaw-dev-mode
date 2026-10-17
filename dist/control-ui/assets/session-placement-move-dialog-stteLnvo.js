import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,du as n,ju as r,pu as i}from"./control-ui-core-CTSdBcaH.js";import{an as a,in as o,na as s,ra as c}from"./control-ui-core-vFnxmx94.js";import{$ as l,X as u,Y as d}from"./lit-runtime-TNZj1e-P.js";import{Lo as f,Ro as p}from"./control-ui-boot-shared-D4E0xCZu.js";import{si as m,ui as h}from"./control-ui-boot-shared-DeF_v3ER.js";import{$ as g,H as _,Q as v,U as y,et as b,nt as x,tt as S}from"./control-ui-boot-new-amRNzQhv.js";import"./control-ui-boot-new-styles-Bb6Ub5D3.js";function C(e){if(!e)return``;switch(e.kind){case`gateway`:return`gateway`;case`profile`:return`profile:${e.profileId}`;default:return`device:${e.deviceId}`}}function w(e){return T?Promise.resolve(null):(T=!0,a(void 0,({render:t,finish:i})=>{let a=!0,o=null,c={profiles:[],devices:[]},d=e.mode===`move`?{kind:`gateway`}:null,f=new _,p=e=>{i(e),T=!1},h=e=>{d=e,y()},v=e=>{if(e.preventDefault(),!d)return;if(d.kind!==`profile`){p(d);return}let t=f.resolve(d.profileId),n=f.resolveOs(d.profileId);p({...d,...t?{machineClass:t}:{},...n?{os:n}:{}})};function y(){let n=C(d),i=c.profiles.toSorted(m),_=e.mode===`restart`,w=e.mode===`dispatch`,T=r(`sessionsView.${e.mode}SessionTitle`),E=r(`sessionsView.${e.mode}SessionDescription`,{session:e.sessionLabel}),D=r(`sessionsView.${e.mode}SessionAction`);t(()=>l`
          <openclaw-modal-dialog label=${T} @modal-cancel=${()=>p(null)}>
            <form class="exec-approval-card" @submit=${v}>
              <div class="exec-approval-header">
                <div class="exec-approval-title">${T}</div>
                <div class="muted">${E}</div>
              </div>
              ${_?l`<div class="exec-approval-error" role="alert">
                      ${r(`sessionsView.restartSessionWarning`)}
                    </div>`:w?l`<div class="callout">${r(`sessionsView.dispatchSessionNotice`)}</div>`:e.activeRun?l`<div class="exec-approval-error" role="alert">
                          ${r(`sessionsView.moveSessionActiveRunWarning`)}
                        </div>`:l`<div class="callout">
                          ${r(`sessionsView.moveSessionNoReplayWarning`)}
                        </div>`}
              ${a?l`<div class="muted">${r(`common.loading`)}</div>`:o?l`<div class="exec-approval-error" role="alert">${o}</div>`:l`
                        <div class="new-session-page__picker-root">
                          ${w?u:x({value:`gateway`,label:r(`newSession.gateway`),icon:s.monitor,checked:n===`gateway`,disabled:!!e.gatewayDisabledReason,title:e.gatewayDisabledReason,onSelect:()=>h({kind:`gateway`})},!1)}
                          ${c.devices.length>0?l`
                                  <div class="new-session-page__menu-title">
                                    ${r(`newSession.yourDevices`)}
                                  </div>
                                  ${c.devices.map(t=>{let r=e.deviceDisabledReason??t.disabledReason;return x({value:`device:${t.deviceId}`,label:t.label,sub:t.subtitle,icon:s.monitor,facts:e.deviceDisabledReason?[e.deviceDisabledReason]:t.facts,checked:n===`device:${t.deviceId}`,disabled:!!e.deviceDisabledReason||!t.selectable,title:r,onSelect:()=>h({kind:`device`,deviceId:t.deviceId})},!1)})}
                                `:u}
                          ${c.profiles.length>0?l`
                                  <div class="new-session-page__menu-title">
                                    ${r(`newSession.cloud`)}
                                  </div>
                                  ${i.map(t=>{let n=d?.kind===`profile`&&d.profileId===t.id,i=f.machines(t),a=t.operatingSystems??[],o=f.resolve(t.id)||i.find(e=>e.default===!0)?.id||``;return l`
                                      ${S({profiles:[t],selectedId:n?t.id:``,submitting:!1,profileDisabledReason:e.profileDisabledReason,onSelect:e=>h({kind:`profile`,profileId:e})})}
                                      ${n&&a.length>=2?l`
                                              <div class="new-session-page__menu-title">
                                                ${r(`newSession.operatingSystem`)}
                                              </div>
                                              ${b({operatingSystems:a,selectedId:f.selectedOs(t),submitting:!1,onSelect:e=>f.selectOs(t.id,e,c.profiles,!1,y)})}
                                            `:u}
                                      ${n&&i.length>0?l`
                                              <div class="new-session-page__menu-title">
                                                ${r(`newSession.machine`)}
                                              </div>
                                              ${g({machines:i,selectedId:o,submitting:!1,onSelect:e=>f.select(t.id,e,c.profiles,!1,y)})}
                                            `:u}
                                    `})}
                                `:u}
                        </div>
                      `}
              <div class="exec-approval-actions">
                <button
                  type="submit"
                  class="btn primary"
                  ?disabled=${a||!!o||!d}
                >
                  ${D}
                </button>
                <button type="button" class="btn" @click=${()=>p(null)}>
                  ${r(`common.cancel`)}
                </button>
              </div>
            </form>
          </openclaw-modal-dialog>
        `)}y(),e.loadCatalog().then(e=>{c=e}).catch(e=>{o=n(e,r(`sessionsView.moveSessionCatalogFailed`))}).finally(()=>{a=!1,y()})}))}var T;function E(){return(E=e((()=>{d(),t(),f(),i(),v(),y(),c(),o(),h(),p(),T=!1})))()}E();export{w as showSessionPlacementTargetDialog};
//# sourceMappingURL=session-placement-move-dialog-stteLnvo.js.map