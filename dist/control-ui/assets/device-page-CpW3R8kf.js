import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,Tu as i,ju as a,kc as o}from"./control-ui-core-CTSdBcaH.js";import{Ca as s,Ti as c,wa as l,wi as u}from"./control-ui-core-vFnxmx94.js";import{$ as d,X as f,Y as p,ct as m,h,nt as g,p as _}from"./lit-runtime-TNZj1e-P.js";import{Xr as v,Zr as y,ii as b}from"./ui-CnRtCcYL.js";import{B as x,G as S,I as C,K as w,R as T,Y as E,Z as D,et as O,l as k,q as A,tt as j,u as M}from"./control-ui-boot-shared-DeF_v3ER.js";import{n as N,t as P}from"./en-settings-CwgozeLb.js";import{n as F,t as I}from"./en-apps-ChoeDheF.js";import{t as L}from"./native-chrome-setup-DStAShuD.js";function R(e){let t=B.get(e);if(t)return t;let n={domains:null,targetProfile:null};return B.set(e,n),n}function z(e,t,n){let r=B.get(e);r&&r[t]===n&&(r[t]=null,r.domains===null&&r.targetProfile===null&&B.delete(e))}var B,V;function H(){return(H=e((()=>{y(),p(),g(),_(),l(),c(),C(),k(),r(),I(),P(),i(),t(),L(),F(),N(),B=new WeakMap,V=class extends n{constructor(...e){super(...e),this.newDomain=``,this.gatewayHostingEdit=null,this.targetProfileTimer=null,this.subscriptions=new o(this).watchStore(()=>this.context?.nativeDeviceSettings,e=>{this.targetProfileTimer&&this.targetProfileTimer.capability!==e&&this.flushTargetProfile()})}disconnectedCallback(){this.flushTargetProfile(),this.subscriptions.clear(),super.disconnectedCallback()}toggle(e,t,n,r,i=!1){return t===void 0?f:O({title:a(`configPage.deviceSettings.${n}`),description:r,checked:t,disabled:i,onChange:t=>this.context.nativeDeviceSettings?.set(e,t)})}renderGatewayHosting(e){let t=this.context.nativeDeviceSettings;if(e.keepGatewayRunning===void 0||!t)return f;let n=this.gatewayHostingEdit?.capability===t?this.gatewayHostingEdit:null;return O({title:a(`configPage.deviceSettings.keepGatewayRunning`),description:d`${a(`configPage.deviceSettings.keepGatewayRunningHint`)}
      ${n?.error?d`<br /><span role="alert">${a(`configPage.deviceSettings.keepGatewayRunningFailed`)} ${n.error.message}</span>`:f}`,checked:e.keepGatewayRunning,disabled:e.keepGatewayRunningAvailable!==!0||n?.pending===!0,onChange:e=>{let n={capability:t,pending:!0};this.gatewayHostingEdit=n,t.set(`app.keepGatewayRunning`,e,e=>{this.gatewayHostingEdit===n&&this.context.nativeDeviceSettings===t&&(this.gatewayHostingEdit={capability:t,pending:!1,error:e})})}})}editTargetProfile(e){let t=this.context.nativeDeviceSettings;t&&(this.targetProfileTimer!==null&&clearTimeout(this.targetProfileTimer.timer),R(t).targetProfile={value:e,sent:!1},this.targetProfileTimer={capability:t,timer:setTimeout(()=>this.flushTargetProfile(),400)},this.requestUpdate())}flushTargetProfile(){let e=this.targetProfileTimer;if(!e)return;clearTimeout(e.timer),this.targetProfileTimer=null;let t=B.get(e.capability)?.targetProfile;t&&!t.sent&&(t.sent=!0,e.capability.set(`browser.cookieSync.targetProfile`,t.value,()=>{z(e.capability,`targetProfile`,t)}))}updateDomains(e){let t=this.context.nativeDeviceSettings;if(!t)return;let n=B.get(t)?.domains??t.snapshot?.browser?.cookieSync?.domains;if(!n)return;let r=[...new Set(e(n).map(e=>e.trim().toLowerCase()).filter(Boolean))];R(t).domains=r,this.requestUpdate(),t.set(`browser.cookieSync.domains`,r,()=>{z(t,`domains`,r)})}renderBrowser(e){let t=this.context.nativeDeviceSettings,n=e.cookieSync,r=t?B.get(t):void 0,i=r?.domains??n?.domains??[],o=()=>{this.updateDomains(e=>[...e,this.newDomain]),this.newDomain=``};return d`
      ${E({title:a(`configPage.deviceSettings.chromeExtension`)},A({title:a(`configPage.deviceSettings.chromeExtensionSetup`),stacked:!0,control:d`
            <div class="device-extension-setup">
              <openclaw-native-chrome-setup auto-inspect></openclaw-native-chrome-setup>
              <div class="device-extension-setup__actions">
                <a
                  href="https://chromewebstore.google.com/detail/openclaw/kcdjddhmeafeomebliikmbpblkmkfoig"
                  target="_blank"
                  rel="noopener noreferrer"
                  >${a(`appsPage.ctaChromeWebStore`)}</a
                >
                ${T(`https://docs.openclaw.ai/tools/chrome-extension`)}
              </div>
            </div>
          `}))}
      ${e.importAvailable||n&&!n.available?E({title:a(`configPage.deviceSettings.browser`)},d`
                ${e.importAvailable?A({title:a(`configPage.deviceSettings.browserImport`),description:a(`configPage.deviceSettings.browserImportHint`),control:d`<button
                          type="button"
                          class="btn"
                          @click=${()=>t?.openPanel(`browser-import`)}
                        >
                          ${a(`configPage.deviceSettings.importBrowserLogins`)}
                        </button>`}):f}
                ${n&&!n.available?A({title:a(`configPage.deviceSettings.cookieSync`),description:a(`configPage.deviceSettings.cookieSyncUnavailable`)}):f}
              `):f}
      ${n?.available?E({title:a(e.importAvailable?`configPage.deviceSettings.cookieSync`:`configPage.deviceSettings.browser`),description:e.importAvailable?void 0:a(`configPage.deviceSettings.cookieSync`)},d`
                ${this.toggle(`browser.cookieSync.enabled`,n.enabled,`cookieSyncEnabled`,a(`configPage.deviceSettings.cookieSyncHint`))}
                ${A({title:a(`configPage.deviceSettings.domains`),description:a(`configPage.deviceSettings.domainsHint`),stacked:!0,control:d`<div class="device-domains">
                    ${i.map(e=>d`<div class="device-domain-entry">
                        ${j(e)}
                        <button
                          type="button"
                          class="btn small"
                          aria-label=${a(`configPage.deviceSettings.removeDomain`,{domain:e})}
                          @click=${()=>this.updateDomains(t=>t.filter(t=>t!==e))}
                        >
                          ${a(`common.remove`)}
                        </button>
                      </div>`)}
                    <form
                      class="device-domain-entry"
                      @submit=${e=>{e.preventDefault(),o()}}
                    >
                      <input
                        type="text"
                        class="settings-input"
                        aria-label=${a(`configPage.deviceSettings.addDomain`)}
                        .value=${h(this.newDomain)}
                        @input=${e=>{this.newDomain=e.currentTarget.value}}
                      />
                      <button type="submit" class="btn" ?disabled=${!this.newDomain.trim()}>
                        ${a(`configPage.deviceSettings.addDomain`)}
                      </button>
                    </form>
                  </div>`})}
                ${A({title:a(`configPage.deviceSettings.targetProfile`),description:a(`configPage.deviceSettings.targetProfileHint`),control:d`<input
                    type="text"
                    class="settings-input"
                    aria-label=${a(`configPage.deviceSettings.targetProfile`)}
                    .value=${h(r?.targetProfile?.value??n.targetProfile)}
                    @input=${e=>{this.editTargetProfile(e.currentTarget.value)}}
                    @change=${()=>this.flushTargetProfile()}
                  />`})}
                ${A({title:a(`configPage.deviceSettings.syncStatus`),description:n.detail??void 0,control:D({kind:n.state===`error`?`danger`:n.state===`running`?`accent`:`muted`,label:a(`configPage.deviceSettings.syncStates.${n.state}`)})})}
              `):f}
    `}renderSettings(e){let{app:t,capabilities:n}=e,r=this.context.nativeDeviceSettings;return d`
      ${t?E({title:a(`configPage.deviceSettings.app`)},d`
                ${this.toggle(`app.nativeExperienceEnabled`,t.nativeExperienceEnabled,`nativeExperience`,a(`configPage.deviceSettings.nativeExperienceHint`))}
                ${t.appearance===void 0?f:A({title:a(`configPage.deviceSettings.appearance`),control:d`<select
                          class="settings-select"
                          aria-label=${a(`configPage.deviceSettings.appearance`)}
                          .value=${h(t.appearance)}
                          @change=${e=>{let t=e.currentTarget.value;r?.set(`app.appearance`,t)}}
                        >
                          ${[`system`,`light`,`dark`].map(e=>d`<option value=${e} ?selected=${e===t.appearance}>${a(`configPage.deviceSettings.appearanceModes.${e}`)}</option>`)}
                        </select>`})}
                ${this.toggle(`app.notificationsEnabled`,t.notificationsEnabled,`notificationsEnabled`,a(`configPage.deviceSettings.notificationsEnabledHint`))}
                ${this.toggle(`app.showDockIcon`,t.showDockIcon,`showDockIcon`,a(`configPage.deviceSettings.showDockIconHint`))}
                ${t.iconStyle?A({title:a(`configPage.deviceSettings.iconStyle`),description:a(`configPage.deviceSettings.iconStyleHint`),control:d`<select
                          class="settings-select"
                          aria-label=${a(`configPage.deviceSettings.iconStyle`)}
                          .value=${h(t.iconStyle.selectedId)}
                          ?disabled=${t.iconStyle.available.length===0}
                          @change=${e=>{let t=e.currentTarget.value;r?.set(`app.iconStyle`,t)}}
                        >
                          ${t.iconStyle.available.map(e=>d`<option
                              value=${e.id}
                              ?selected=${e.id===t.iconStyle?.selectedId}
                            >
                              ${e.name}
                            </option>`)}
                        </select>`}):f}
                ${this.toggle(`app.iconAnimationsEnabled`,t.iconAnimationsEnabled,`iconAnimations`,a(`configPage.deviceSettings.iconAnimationsHint`))}
                ${this.toggle(`app.launchAtLogin`,t.launchAtLogin,`launchAtLogin`,t.launchAtLoginAvailable===!1?a(`configPage.deviceSettings.launchAtLoginUnavailable`):void 0,t.launchAtLoginAvailable===!1)}
                ${this.renderGatewayHosting(t)}
                ${this.toggle(`app.quickChatEnabled`,t.quickChatEnabled,`quickChat`,a(`configPage.deviceSettings.quickChatHint`))}
                ${t.quickChatShortcut===void 0?f:A({title:a(`configPage.deviceSettings.quickChatShortcut`),control:d`
                          ${j(t.quickChatShortcut??a(`configPage.deviceSettings.notSet`))}
                          <button
                            type="button"
                            class="btn"
                            @click=${()=>r?.openPanel(`quick-chat-shortcut`)}
                          >
                            ${a(`configPage.deviceSettings.changeShortcut`)}
                          </button>
                        `})}
              `):f}
      ${n?E({title:a(`configPage.deviceSettings.capabilities`)},d`
                ${this.toggle(`capabilities.canvasEnabled`,n.canvasEnabled,`canvas`,a(`configPage.deviceSettings.canvasHint`))}
                ${this.toggle(`capabilities.cameraEnabled`,n.cameraEnabled,`camera`,a(`configPage.deviceSettings.cameraHint`))}
                ${this.toggle(`capabilities.keepAwakeEnabled`,n.keepAwakeEnabled,`keepAwake`,a(e.device.platform===`ios`?`configPage.deviceSettings.keepAwakeHint`:`configPage.deviceSettings.keepAwakeComputerHint`))}
                ${n.healthSummaryAvailable?this.toggle(`capabilities.healthSummaryEnabled`,n.healthSummaryEnabled,`healthSummary`,a(`configPage.deviceSettings.healthSummaryHint`)):f}
                ${this.toggle(`capabilities.computerControlEnabled`,n.computerControlEnabled,`computerControl`,a(`configPage.deviceSettings.computerControlHint`))}
                ${this.toggle(`capabilities.desktopSharingEnabled`,n.desktopSharingEnabled,`desktopSharing`,a(e.device.platform===`macos`?`configPage.deviceSettings.desktopSharingHint`:`configPage.deviceSettings.desktopSharingComputerHint`))}
                ${e.desktopSharing?A({title:a(`configPage.deviceSettings.desktopSharingStatus`),description:e.desktopSharing.detail,control:D({kind:e.desktopSharing.state===`error`?`danger`:e.desktopSharing.state===`running`?`ok`:`muted`,label:a(`configPage.deviceSettings.desktopSharingStates.${e.desktopSharing.state}`)})}):f}
                ${this.toggle(`capabilities.unattendedDesktopEnabled`,n.unattendedDesktopEnabled,`unattendedDesktop`,a(`configPage.deviceSettings.unattendedDesktopHint`))}
                ${e.desktopAvailability?A({title:a(`configPage.deviceSettings.desktopAvailability`),control:D({kind:e.desktopAvailability.state===`unlocked`?`ok`:`warn`,label:a(`configPage.deviceSettings.desktopStates.${e.desktopAvailability.state}`)})}):f}
                ${n.computerControlEnabled&&n.computerControlProvider!==void 0?A({title:a(`configPage.deviceSettings.computerControlProvider`),control:d`<select
                          class="settings-select"
                          aria-label=${a(`configPage.deviceSettings.computerControlProvider`)}
                          .value=${n.computerControlProvider}
                          @change=${e=>{let t=e.currentTarget.value;r?.set(`capabilities.computerControlProvider`,t)}}
                        >
                          <option
                            value="peekaboo"
                            ?selected=${n.computerControlProvider===`peekaboo`}
                          >
                            ${a(`configPage.deviceSettings.peekaboo`)}
                          </option>
                          <option
                            value="cua"
                            ?selected=${n.computerControlProvider===`cua`}
                            ?disabled=${!n.cuaDriverBundled}
                          >
                            ${a(n.cuaDriverBundled?`configPage.deviceSettings.cua`:`configPage.deviceSettings.cuaUnavailable`)}
                          </option>
                        </select>`}):f}
                ${this.toggle(`capabilities.peekabooBridgeEnabled`,n.peekabooBridgeEnabled,`peekabooBridge`,a(`configPage.deviceSettings.peekabooBridgeHint`),!n.computerControlEnabled)}
              `):f}
      ${e.browser?this.renderBrowser(e.browser):f}
      ${t?.debugPaneEnabled===void 0?f:E({title:a(`configPage.deviceSettings.developer`)},d`
                ${this.toggle(`app.debugPaneEnabled`,t.debugPaneEnabled,`debugTools`)}
                ${t.debugPaneEnabled?A({title:a(`configPage.deviceSettings.debugWindow`),control:d`<button type="button" class="btn" @click=${()=>r?.openPanel(`debug`)}>${a(`configPage.deviceSettings.openDebug`)}</button>`}):f}
              `)}
      ${e.device.platform===`ios`?E({title:a(`configPage.deviceSettings.device`)},d`${[`diagnostics`,`licenses`,`about`,`watch`].map(e=>A({title:a(`configPage.deviceSettings.panels.${e}`),control:d`<button
                    type="button"
                    class="btn"
                    @click=${()=>r?.openPanel(e)}
                  >
                    ${a(`configPage.deviceSettings.openPanel`)}
                  </button>`}))}`):f}
    `}render(){let e=this.context?.nativeDeviceSettings,t=e?.snapshot,n=e?t?this.renderSettings(t):x(a(`configPage.deviceSettings.loading`)):x(a(`configPage.deviceSettings.appOnly`));return d`
      ${w({title:a(s(t)),subtitle:d`${a(t?.device.platform===`macos`?`configPage.deviceSettings.intro`:`configPage.deviceSettings.introIos`)}
        ${T(`https://docs.openclaw.ai/platforms/${t?.device.platform??`macos`}`)}`})}
      ${M(S(n))}
    `}},b([v({context:u,subscribe:!0})],V.prototype,`context`,void 0),b([m()],V.prototype,`newDomain`,void 0),b([m()],V.prototype,`gatewayHostingEdit`,void 0),customElements.get(`openclaw-device-page`)||customElements.define(`openclaw-device-page`,V)})))()}H();
//# sourceMappingURL=device-page-CpW3R8kf.js.map