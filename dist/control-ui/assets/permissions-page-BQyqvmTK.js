import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,Tu as i,ju as a,kc as o}from"./control-ui-core-CTSdBcaH.js";import{Ra as s,Ti as c,na as l,ra as u,wa as d,wi as f}from"./control-ui-core-vFnxmx94.js";import{$ as p,X as m,Y as h}from"./lit-runtime-TNZj1e-P.js";import{Xr as g,Zr as _,ii as v}from"./ui-CnRtCcYL.js";import{B as y,G as b,I as x,K as S,R as C,X as w,Y as T,Z as E,et as D,l as O,q as k,u as A}from"./control-ui-boot-shared-DeF_v3ER.js";import{n as j,t as M}from"./en-settings-CwgozeLb.js";var N;function P(){return(P=e((()=>{_(),h(),d(),c(),u(),x(),O(),r(),M(),i(),t(),j(),N=class extends n{constructor(){super(),new o(this).watchStore(()=>this.context?.nativeDeviceSettings)}renderPermissions(e){let t=this.context.nativeDeviceSettings,{permissions:n}=e,r=n.location,i=r?.preciseEditable??e.device.platform===`macos`;return p`
      ${n.entries.length>0?T({title:a(`configPage.deviceSettings.systemAccess`)},n.entries.map(({id:n,status:r})=>{let i=a(`configPage.deviceSettings.permissions.${n}.title`),o=e.device.platform===`macos`&&(n===`screenRecording`||n===`accessibility`)&&r===`notDetermined`;return k({title:i,description:a(`configPage.deviceSettings.permissions.${n}.hint`),stackedOnNarrow:!0,control:p`
                    <div class="settings-permission-control">
                      ${E({kind:`muted`,dot:!1,label:p`${r===`granted`?p`<span class="settings-permission-check" aria-hidden="true">${l.check}</span>`:m}${a(`configPage.deviceSettings.permissionStatuses.${o?`notGranted`:r}`)}`})}
                      ${r===`notDetermined`?p`<button type="button" class="btn" aria-label=${`${a(`configPage.deviceSettings.grant`)}: ${i}`} @click=${()=>t?.requestPermission(n)}>${a(`configPage.deviceSettings.grant`)}</button>`:r===`denied`?p`<button type="button" class="btn" aria-label=${`${a(`configPage.deviceSettings.openSystemSettings`)}: ${i}`} @click=${()=>t?.openSystemSettings(n)}>${a(`configPage.deviceSettings.openSystemSettings`)}</button>`:m}
                      ${o?p`<button type="button" class="btn settings-permission-recovery" aria-label=${`${a(`configPage.deviceSettings.openSystemSettings`)}: ${i}`} @click=${()=>t?.openSystemSettings(n)}>${a(`configPage.deviceSettings.openSystemSettings`)}</button>`:m}
                    </div>
                  `})})):m}
      ${r?T({title:a(`configPage.deviceSettings.location`)},p`
                ${k({title:a(`configPage.deviceSettings.locationAccess`),description:a(`configPage.deviceSettings.locationHint`),stackedOnNarrow:!0,control:w({value:r.mode,ariaLabel:a(`configPage.deviceSettings.locationAccess`),options:[`off`,`whileUsing`,`always`].map(e=>({value:e,label:a(`configPage.deviceSettings.locationModes.${e}`)})),onChange:e=>t?.set(`permissions.location.mode`,e)})})}
                ${i?D({title:a(`configPage.deviceSettings.preciseLocation`),description:a(`configPage.deviceSettings.preciseLocationHint`),checked:r.precise,disabled:r.mode===`off`,onChange:e=>t?.set(`permissions.location.precise`,e)}):k({title:a(`configPage.deviceSettings.preciseLocation`),description:a(`configPage.deviceSettings.preciseLocationReadOnlyHint`),stackedOnNarrow:!0,control:p`
                          <div class="settings-permission-control">
                            ${E({kind:`muted`,dot:!1,label:a(r.precise?`configPage.deviceSettings.preciseLocationStatuses.enabled`:`configPage.deviceSettings.preciseLocationStatuses.disabled`)})}
                            <button
                              type="button"
                              class="btn"
                              aria-label=${`${a(`configPage.deviceSettings.openSettings`)}: ${a(`configPage.deviceSettings.preciseLocation`)}`}
                              @click=${()=>t?.openSystemSettings(`location`)}
                            >
                              ${a(`configPage.deviceSettings.openSettings`)}
                            </button>
                          </div>
                        `})}
              `):m}
      ${e.capabilities?.activeComputerPresenceEnabled===void 0?m:T({title:a(`configPage.deviceSettings.privacy`)},D({title:a(`configPage.deviceSettings.activePresence`),description:a(`configPage.deviceSettings.activePresenceHint`),checked:e.capabilities.activeComputerPresenceEnabled,onChange:e=>t?.set(`capabilities.activeComputerPresenceEnabled`,e)}))}
    `}render(){let e=this.context?.nativeDeviceSettings,t=e?.snapshot,n=e?t?this.renderPermissions(t):y(a(`configPage.deviceSettings.loading`)):y(a(`configPage.deviceSettings.appOnly`));return p`
      ${S({title:s(`device-permissions`),subtitle:p`${a(t?.device.platform===`macos`?`configPage.deviceSettings.permissionsIntro`:`configPage.deviceSettings.permissionsIntroIos`)}
        ${C(`https://docs.openclaw.ai/platforms/${t?.device.platform??`macos`}`)}`})}
      ${A(b(n))}
    `}},v([g({context:f,subscribe:!0})],N.prototype,`context`,void 0),customElements.get(`openclaw-device-permissions-page`)||customElements.define(`openclaw-device-permissions-page`,N)})))()}P();
//# sourceMappingURL=permissions-page-BQyqvmTK.js.map