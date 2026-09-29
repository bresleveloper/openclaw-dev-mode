import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Zr as n,ai as r}from"./control-ui-foundation-Ds5QQwGa.js";import{Gl as i,Ll as a,Xl as o,nc as s,tc as c,zl as l}from"./control-ui-core-DkXlmHxW.js";import{$ as u,X as d,Y as f}from"./lit-runtime-DLvISeBM.js";import{Di as p,Fi as m,Ii as h,Oi as g,Qa as _,fo as v}from"./control-ui-core-BdNTI4B-.js";import{Ct as y,Dt as b,Et as x,Ot as S,St as C,_t as w,ht as T,jt as E,pt as D,wt as O}from"./control-ui-boot-shared-C5a8_33C.js";import{n as k,t as A}from"./en-settings-DSbIsAXM.js";import{n as j,t as M}from"./settings-workspace-DkkrNauO.js";var N;function P(){return(P=e((()=>{t(),f(),_(),g(),h(),D(),M(),i(),A(),l(),s(),k(),N=class extends a{constructor(...e){super(...e),this.subscriptions=new c(this).watch(()=>this.context?.nativeDeviceSettings,(e,t)=>e.subscribe(t))}disconnectedCallback(){this.subscriptions.clear(),super.disconnectedCallback()}renderPermissions(e){let t=this.context.nativeDeviceSettings,{permissions:n}=e,r=n.location,i=r?.preciseEditable??e.device.platform===`macos`;return u`
      ${n.entries.length>0?x({title:o(`configPage.deviceSettings.systemAccess`)},n.entries.map(({id:n,status:r})=>{let i=e.device.platform===`macos`&&(n===`screenRecording`||n===`accessibility`)&&r===`notDetermined`;return O({title:o(`configPage.deviceSettings.permissions.${n}.title`),description:o(`configPage.deviceSettings.permissions.${n}.hint`),stackedOnNarrow:!0,control:u`
                    <div class="settings-permission-control">
                      ${S({kind:`muted`,dot:!1,label:u`${r===`granted`?u`<span class="settings-permission-check" aria-hidden="true">${m.check}</span>`:d}${o(`configPage.deviceSettings.permissionStatuses.${i?`notGranted`:r}`)}`})}
                      ${r===`notDetermined`?u`<button type="button" class="btn" @click=${()=>t?.requestPermission(n)}>${o(`configPage.deviceSettings.grant`)}</button>`:r===`denied`?u`<button type="button" class="btn" @click=${()=>t?.openSystemSettings(n)}>${o(`configPage.deviceSettings.openSystemSettings`)}</button>`:d}
                      ${i?u`<button type="button" class="btn settings-permission-recovery" @click=${()=>t?.openSystemSettings(n)}>${o(`configPage.deviceSettings.openSystemSettings`)}</button>`:d}
                    </div>
                  `})})):d}
      ${r?x({title:o(`configPage.deviceSettings.location`)},u`
                ${O({title:o(`configPage.deviceSettings.locationAccess`),description:o(`configPage.deviceSettings.locationHint`),stackedOnNarrow:!0,control:b({value:r.mode,ariaLabel:o(`configPage.deviceSettings.locationAccess`),options:[`off`,`whileUsing`,`always`].map(e=>({value:e,label:o(`configPage.deviceSettings.locationModes.${e}`)})),onChange:e=>t?.set(`permissions.location.mode`,e)})})}
                ${i?E({title:o(`configPage.deviceSettings.preciseLocation`),description:o(`configPage.deviceSettings.preciseLocationHint`),checked:r.precise,disabled:r.mode===`off`,onChange:e=>t?.set(`permissions.location.precise`,e)}):O({title:o(`configPage.deviceSettings.preciseLocation`),description:o(`configPage.deviceSettings.preciseLocationReadOnlyHint`),stackedOnNarrow:!0,control:u`
                          <div class="settings-permission-control">
                            ${S({kind:`muted`,dot:!1,label:o(r.precise?`configPage.deviceSettings.preciseLocationStatuses.enabled`:`configPage.deviceSettings.preciseLocationStatuses.disabled`)})}
                            <button
                              type="button"
                              class="btn"
                              @click=${()=>t?.openSystemSettings(`location`)}
                            >
                              ${o(`configPage.deviceSettings.openSettings`)}
                            </button>
                          </div>
                        `})}
              `):d}
      ${e.capabilities?.activeComputerPresenceEnabled===void 0?d:x({title:o(`configPage.deviceSettings.privacy`)},E({title:o(`configPage.deviceSettings.activePresence`),description:o(`configPage.deviceSettings.activePresenceHint`),checked:e.capabilities.activeComputerPresenceEnabled,onChange:e=>t?.set(`capabilities.activeComputerPresenceEnabled`,e)}))}
    `}render(){let e=this.context?.nativeDeviceSettings,t=e?.snapshot,n=e?t?this.renderPermissions(t):w(o(`configPage.deviceSettings.loading`)):w(o(`configPage.deviceSettings.appOnly`));return u`
      ${y({title:v(`device-permissions`),subtitle:u`${o(t?.device.platform===`macos`?`configPage.deviceSettings.permissionsIntro`:`configPage.deviceSettings.permissionsIntroIos`)}
        ${T(`https://docs.openclaw.ai/platforms/${t?.device.platform??`macos`}`)}`})}
      ${j(C(n))}
    `}},r([n({context:p,subscribe:!0})],N.prototype,`context`,void 0),customElements.get(`openclaw-device-permissions-page`)||customElements.define(`openclaw-device-permissions-page`,N)})))()}P();
//# sourceMappingURL=permissions-page-zNN4mXZg.js.map