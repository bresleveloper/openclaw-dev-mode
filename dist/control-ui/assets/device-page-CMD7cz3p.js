import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Zr as n,ai as r}from"./control-ui-foundation-Bju0LxrM.js";import{Gl as i,Ll as a,Xl as o,nc as s,tc as c,zl as l}from"./control-ui-core-DX6662ze.js";import{$ as u,X as d,Y as f,ct as p,i as m,nt as h,o as g}from"./lit-runtime-BOUQsi_O.js";import{Di as _,Oi as v,Qa as y,Za as b}from"./control-ui-core-QgEwr0pF.js";import{Ct as x,Et as S,Mt as C,Ot as w,St as T,_t as E,ht as D,jt as O,pt as k,wt as A}from"./control-ui-boot-shared-SOjXo6bG.js";import{n as j,t as M}from"./en-settings-tomLhsTf.js";import{n as N,t as P}from"./en-apps-CLiYdZTx.js";import{n as F,t as I}from"./settings-workspace-Du_3hPkz.js";import{t as L}from"./native-chrome-setup-BL9JUBmZ.js";function R(e){let t=B.get(e);if(t)return t;let n={domains:null,targetProfile:null};return B.set(e,n),n}function z(e,t,n){let r=B.get(e);r&&r[t]===n&&(r[t]=null,r.domains===null&&r.targetProfile===null&&B.delete(e))}var B,V;function H(){return(H=e((()=>{t(),f(),h(),m(),y(),v(),k(),I(),i(),P(),M(),l(),s(),L(),N(),j(),B=new WeakMap,V=class extends a{constructor(...e){super(...e),this.newDomain=``,this.targetProfileTimer=null,this.subscriptions=new c(this).watch(()=>this.context?.nativeDeviceSettings,(e,t)=>e.subscribe(t),e=>{this.targetProfileTimer&&this.targetProfileTimer.capability!==e&&this.flushTargetProfile()})}disconnectedCallback(){this.flushTargetProfile(),this.subscriptions.clear(),super.disconnectedCallback()}toggle(e,t,n,r,i=!1){return t===void 0?d:O({title:o(`configPage.deviceSettings.${n}`),description:r,checked:t,disabled:i,onChange:t=>this.context.nativeDeviceSettings?.set(e,t)})}editTargetProfile(e){let t=this.context.nativeDeviceSettings;t&&(this.targetProfileTimer!==null&&clearTimeout(this.targetProfileTimer.timer),R(t).targetProfile={value:e,sent:!1},this.targetProfileTimer={capability:t,timer:setTimeout(()=>this.flushTargetProfile(),400)},this.requestUpdate())}flushTargetProfile(){let e=this.targetProfileTimer;if(!e)return;clearTimeout(e.timer),this.targetProfileTimer=null;let t=B.get(e.capability)?.targetProfile;t&&!t.sent&&(t.sent=!0,e.capability.set(`browser.cookieSync.targetProfile`,t.value,()=>{z(e.capability,`targetProfile`,t)}))}updateDomains(e){let t=this.context.nativeDeviceSettings;if(!t)return;let n=B.get(t)?.domains??t.snapshot?.browser?.cookieSync?.domains;if(!n)return;let r=[...new Set(e(n).map(e=>e.trim().toLowerCase()).filter(Boolean))];R(t).domains=r,this.requestUpdate(),t.set(`browser.cookieSync.domains`,r,()=>{z(t,`domains`,r)})}renderBrowser(e){let t=this.context.nativeDeviceSettings,n=e.cookieSync,r=t?B.get(t):void 0,i=r?.domains??n?.domains??[],a=()=>{this.updateDomains(e=>[...e,this.newDomain]),this.newDomain=``};return u`
      ${S({title:o(`configPage.deviceSettings.chromeExtension`)},A({title:o(`configPage.deviceSettings.chromeExtensionSetup`),stacked:!0,control:u`
            <div class="device-extension-setup">
              <openclaw-native-chrome-setup auto-inspect></openclaw-native-chrome-setup>
              <div class="device-extension-setup__actions">
                <a
                  href="https://chromewebstore.google.com/detail/openclaw/kcdjddhmeafeomebliikmbpblkmkfoig"
                  target="_blank"
                  rel="noopener noreferrer"
                  >${o(`appsPage.ctaChromeWebStore`)}</a
                >
                ${D(`https://docs.openclaw.ai/tools/chrome-extension`)}
              </div>
            </div>
          `}))}
      ${e.importAvailable||n&&!n.available?S({title:o(`configPage.deviceSettings.browser`)},u`
                ${e.importAvailable?A({title:o(`configPage.deviceSettings.browserImport`),description:o(`configPage.deviceSettings.browserImportHint`),control:u`<button
                          type="button"
                          class="btn"
                          @click=${()=>t?.openPanel(`browser-import`)}
                        >
                          ${o(`configPage.deviceSettings.importBrowserLogins`)}
                        </button>`}):d}
                ${n&&!n.available?A({title:o(`configPage.deviceSettings.cookieSync`),description:o(`configPage.deviceSettings.cookieSyncUnavailable`)}):d}
              `):d}
      ${n?.available?S({title:o(e.importAvailable?`configPage.deviceSettings.cookieSync`:`configPage.deviceSettings.browser`),description:e.importAvailable?void 0:o(`configPage.deviceSettings.cookieSync`)},u`
                ${this.toggle(`browser.cookieSync.enabled`,n.enabled,`cookieSyncEnabled`,o(`configPage.deviceSettings.cookieSyncHint`))}
                ${A({title:o(`configPage.deviceSettings.domains`),description:o(`configPage.deviceSettings.domainsHint`),stacked:!0,control:u`<div class="device-domains">
                    ${i.map(e=>u`<div class="device-domain-entry">
                        ${C(e)}
                        <button
                          type="button"
                          class="btn small"
                          aria-label=${o(`configPage.deviceSettings.removeDomain`,{domain:e})}
                          @click=${()=>this.updateDomains(t=>t.filter(t=>t!==e))}
                        >
                          ${o(`common.remove`)}
                        </button>
                      </div>`)}
                    <form
                      class="device-domain-entry"
                      @submit=${e=>{e.preventDefault(),a()}}
                    >
                      <input
                        type="text"
                        class="settings-input"
                        aria-label=${o(`configPage.deviceSettings.addDomain`)}
                        .value=${g(this.newDomain)}
                        @input=${e=>{this.newDomain=e.currentTarget.value}}
                      />
                      <button type="submit" class="btn" ?disabled=${!this.newDomain.trim()}>
                        ${o(`configPage.deviceSettings.addDomain`)}
                      </button>
                    </form>
                  </div>`})}
                ${A({title:o(`configPage.deviceSettings.targetProfile`),description:o(`configPage.deviceSettings.targetProfileHint`),control:u`<input
                    type="text"
                    class="settings-input"
                    aria-label=${o(`configPage.deviceSettings.targetProfile`)}
                    .value=${g(r?.targetProfile?.value??n.targetProfile)}
                    @input=${e=>{this.editTargetProfile(e.currentTarget.value)}}
                    @change=${()=>this.flushTargetProfile()}
                  />`})}
                ${A({title:o(`configPage.deviceSettings.syncStatus`),description:n.detail??void 0,control:w({kind:n.state===`error`?`danger`:n.state===`running`?`accent`:`muted`,label:o(`configPage.deviceSettings.syncStates.${n.state}`)})})}
              `):d}
    `}renderSettings(e){let{app:t,capabilities:n}=e,r=this.context.nativeDeviceSettings;return u`
      ${t?S({title:o(`configPage.deviceSettings.app`)},u`
                ${this.toggle(`app.nativeExperienceEnabled`,t.nativeExperienceEnabled,`nativeExperience`,o(`configPage.deviceSettings.nativeExperienceHint`))}
                ${t.appearance===void 0?d:A({title:o(`configPage.deviceSettings.appearance`),control:u`<select
                          class="settings-select"
                          aria-label=${o(`configPage.deviceSettings.appearance`)}
                          .value=${g(t.appearance)}
                          @change=${e=>{let t=e.currentTarget.value;r?.set(`app.appearance`,t)}}
                        >
                          ${[`system`,`light`,`dark`].map(e=>u`<option value=${e} ?selected=${e===t.appearance}>${o(`configPage.deviceSettings.appearanceModes.${e}`)}</option>`)}
                        </select>`})}
                ${this.toggle(`app.notificationsEnabled`,t.notificationsEnabled,`notificationsEnabled`,o(`configPage.deviceSettings.notificationsEnabledHint`))}
                ${this.toggle(`app.showDockIcon`,t.showDockIcon,`showDockIcon`,o(`configPage.deviceSettings.showDockIconHint`))}
                ${t.iconStyle?A({title:o(`configPage.deviceSettings.iconStyle`),description:o(`configPage.deviceSettings.iconStyleHint`),control:u`<select
                          class="settings-select"
                          aria-label=${o(`configPage.deviceSettings.iconStyle`)}
                          .value=${g(t.iconStyle.selectedId)}
                          ?disabled=${t.iconStyle.available.length===0}
                          @change=${e=>{let t=e.currentTarget.value;r?.set(`app.iconStyle`,t)}}
                        >
                          ${t.iconStyle.available.map(e=>u`<option
                              value=${e.id}
                              ?selected=${e.id===t.iconStyle?.selectedId}
                            >
                              ${e.name}
                            </option>`)}
                        </select>`}):d}
                ${this.toggle(`app.iconAnimationsEnabled`,t.iconAnimationsEnabled,`iconAnimations`,o(`configPage.deviceSettings.iconAnimationsHint`))}
                ${this.toggle(`app.launchAtLogin`,t.launchAtLogin,`launchAtLogin`,t.launchAtLoginAvailable===!1?o(`configPage.deviceSettings.launchAtLoginUnavailable`):void 0,t.launchAtLoginAvailable===!1)}
                ${this.toggle(`app.quickChatEnabled`,t.quickChatEnabled,`quickChat`,o(`configPage.deviceSettings.quickChatHint`))}
                ${t.quickChatShortcut===void 0?d:A({title:o(`configPage.deviceSettings.quickChatShortcut`),control:u`
                          ${C(t.quickChatShortcut??o(`configPage.deviceSettings.notSet`))}
                          <button
                            type="button"
                            class="btn"
                            @click=${()=>r?.openPanel(`quick-chat-shortcut`)}
                          >
                            ${o(`configPage.deviceSettings.changeShortcut`)}
                          </button>
                        `})}
              `):d}
      ${n?S({title:o(`configPage.deviceSettings.capabilities`)},u`
                ${this.toggle(`capabilities.canvasEnabled`,n.canvasEnabled,`canvas`,o(`configPage.deviceSettings.canvasHint`))}
                ${this.toggle(`capabilities.cameraEnabled`,n.cameraEnabled,`camera`,o(`configPage.deviceSettings.cameraHint`))}
                ${this.toggle(`capabilities.keepAwakeEnabled`,n.keepAwakeEnabled,`keepAwake`,o(e.device.platform===`ios`?`configPage.deviceSettings.keepAwakeHint`:`configPage.deviceSettings.keepAwakeComputerHint`))}
                ${n.healthSummaryAvailable?this.toggle(`capabilities.healthSummaryEnabled`,n.healthSummaryEnabled,`healthSummary`,o(`configPage.deviceSettings.healthSummaryHint`)):d}
                ${this.toggle(`capabilities.computerControlEnabled`,n.computerControlEnabled,`computerControl`,o(`configPage.deviceSettings.computerControlHint`))}
                ${this.toggle(`capabilities.desktopSharingEnabled`,n.desktopSharingEnabled,`desktopSharing`,o(e.device.platform===`macos`?`configPage.deviceSettings.desktopSharingHint`:`configPage.deviceSettings.desktopSharingComputerHint`))}
                ${e.desktopSharing?A({title:o(`configPage.deviceSettings.desktopSharingStatus`),description:e.desktopSharing.detail,control:w({kind:e.desktopSharing.state===`error`?`danger`:e.desktopSharing.state===`running`?`ok`:`muted`,label:o(`configPage.deviceSettings.desktopSharingStates.${e.desktopSharing.state}`)})}):d}
                ${this.toggle(`capabilities.unattendedDesktopEnabled`,n.unattendedDesktopEnabled,`unattendedDesktop`,o(`configPage.deviceSettings.unattendedDesktopHint`))}
                ${e.desktopAvailability?A({title:o(`configPage.deviceSettings.desktopAvailability`),control:w({kind:e.desktopAvailability.state===`unlocked`?`ok`:`warn`,label:o(`configPage.deviceSettings.desktopStates.${e.desktopAvailability.state}`)})}):d}
                ${n.computerControlEnabled&&n.computerControlProvider!==void 0?A({title:o(`configPage.deviceSettings.computerControlProvider`),control:u`<select
                          class="settings-select"
                          aria-label=${o(`configPage.deviceSettings.computerControlProvider`)}
                          .value=${n.computerControlProvider}
                          @change=${e=>{let t=e.currentTarget.value;r?.set(`capabilities.computerControlProvider`,t)}}
                        >
                          <option
                            value="peekaboo"
                            ?selected=${n.computerControlProvider===`peekaboo`}
                          >
                            ${o(`configPage.deviceSettings.peekaboo`)}
                          </option>
                          <option
                            value="cua"
                            ?selected=${n.computerControlProvider===`cua`}
                            ?disabled=${!n.cuaDriverBundled}
                          >
                            ${o(n.cuaDriverBundled?`configPage.deviceSettings.cua`:`configPage.deviceSettings.cuaUnavailable`)}
                          </option>
                        </select>`}):d}
                ${this.toggle(`capabilities.peekabooBridgeEnabled`,n.peekabooBridgeEnabled,`peekabooBridge`,o(`configPage.deviceSettings.peekabooBridgeHint`),!n.computerControlEnabled)}
              `):d}
      ${e.browser?this.renderBrowser(e.browser):d}
      ${t?.debugPaneEnabled===void 0?d:S({title:o(`configPage.deviceSettings.developer`)},u`
                ${this.toggle(`app.debugPaneEnabled`,t.debugPaneEnabled,`debugTools`)}
                ${t.debugPaneEnabled?A({title:o(`configPage.deviceSettings.debugWindow`),control:u`<button type="button" class="btn" @click=${()=>r?.openPanel(`debug`)}>${o(`configPage.deviceSettings.openDebug`)}</button>`}):d}
              `)}
      ${e.device.platform===`ios`?S({title:o(`configPage.deviceSettings.device`)},u`${[`diagnostics`,`licenses`,`about`,`watch`].map(e=>A({title:o(`configPage.deviceSettings.panels.${e}`),control:u`<button
                    type="button"
                    class="btn"
                    @click=${()=>r?.openPanel(e)}
                  >
                    ${o(`configPage.deviceSettings.openPanel`)}
                  </button>`}))}`):d}
    `}render(){let e=this.context?.nativeDeviceSettings,t=e?.snapshot,n=e?t?this.renderSettings(t):E(o(`configPage.deviceSettings.loading`)):E(o(`configPage.deviceSettings.appOnly`));return u`
      ${x({title:o(b(t)),subtitle:u`${o(t?.device.platform===`macos`?`configPage.deviceSettings.intro`:`configPage.deviceSettings.introIos`)}
        ${D(`https://docs.openclaw.ai/platforms/${t?.device.platform??`macos`}`)}`})}
      ${F(T(n))}
    `}},r([n({context:_,subscribe:!0})],V.prototype,`context`,void 0),r([p()],V.prototype,`newDomain`,void 0),customElements.get(`openclaw-device-page`)||customElements.define(`openclaw-device-page`,V)})))()}H();
//# sourceMappingURL=device-page-CMD7cz3p.js.map