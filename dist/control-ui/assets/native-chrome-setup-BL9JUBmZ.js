import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Zr as n,ai as r}from"./control-ui-foundation-Bju0LxrM.js";import{Gl as i,Ll as a,Xl as o,nc as s,tc as c,zl as l}from"./control-ui-core-DX6662ze.js";import{$ as u,X as d,Y as f,ct as p,nt as m,ut as h}from"./lit-runtime-BOUQsi_O.js";import{Di as g,Oi as _}from"./control-ui-core-QgEwr0pF.js";import{n as v,t as y}from"./en-settings-tomLhsTf.js";function b({result:e,legacyResult:t,running:n,failed:r}){if(r===`inspection`)return u`<p role="status">${o(`configPage.deviceSettings.chromeExtensionUnknown`)}</p>
      <p>${o(`configPage.deviceSettings.chromeExtensionStatusFailed`)}</p>`;if(n||r)return u`<p role="status">
      ${o(n?`configPage.deviceSettings.chromeExtensionPreparing`:`configPage.deviceSettings.chromeExtensionFailed`)}
    </p>`;let i=e?.installation??t;if(!i)return d;let a=(i.installedProfiles??i.discoveredProfiles)>0;return u`
    <p role="status">
      ${o(a?`configPage.deviceSettings.chromeExtensionDetected`:i.installedProfiles===void 0?`configPage.deviceSettings.chromeExtensionUnknown`:`configPage.deviceSettings.chromeExtensionNotInstalled`)}
    </p>
    ${a&&i.discoveredProfiles===0?u`<p>${o(`configPage.deviceSettings.chromeExtensionEnableHint`)}</p>`:d}
    ${e?u`
            <p role="status">
              ${o(`configPage.deviceSettings.chromeExtensionPhases.${e.phase}`)}
            </p>
            <p>
              ${o(`configPage.deviceSettings.chromeExtensionTarget`,{hostname:e.target.hostname,profile:e.target.profile,port:String(e.target.relayPort)})}
            </p>
            ${e.nextAction===`none`?d:u`<p>${o(`configPage.deviceSettings.chromeExtensionNextActions.${e.nextAction}`)}</p>`}
            ${e.connection.state===`connected`?u`<p>${o(`configPage.deviceSettings.chromeExtensionTabsHint`)}</p>`:d}
          `:u`
            <p>
              ${o(i.nativeHostRegistered?`configPage.deviceSettings.chromeExtensionPhases.waiting_for_connection`:`configPage.deviceSettings.chromeExtensionFailed`)}
            </p>
            ${!i.nativeHostRegistered||a?d:u`<p>${o(i.installRequested?`configPage.deviceSettings.chromeExtensionNextActions.open_chrome`:i.installedProfiles===void 0?`configPage.deviceSettings.chromeExtensionStatusUnsupported`:`configPage.deviceSettings.chromeExtensionNextActions.install_from_store`)}</p>`}
          `}
  `}function x(){return(x=e((()=>{f(),i(),y(),v()})))()}var S;function C(){return(C=e((()=>{t(),f(),m(),_(),i(),l(),s(),x(),S=class extends a{constructor(...e){super(...e),this.autoInspect=!1,this.running=!1,this.failed=null,this.result=null,this.legacyResult=null,this.generation=0,this.subscriptions=new c(this).watch(()=>this.context?.nativeDeviceSettings,(e,t)=>e.subscribe(t)).effect(()=>this.context?.nativeDeviceSettings,()=>()=>this.reset()).effect(()=>this.autoInspect&&this.capability?.snapshot?.browser?this.capability:void 0,()=>{let e=()=>void this.setup(`inspect`);return window.addEventListener(`focus`,e),e(),()=>{window.removeEventListener(`focus`,e),this.reset()}})}disconnectedCallback(){this.reset(),this.subscriptions.clear(),super.disconnectedCallback()}get capability(){return this.context?.nativeDeviceSettings}get actions(){let e=this.capability,t=e?.snapshot?.browser;return!e||!t?[]:t.chromeSetupActions?t.chromeSetupActions:e.snapshot?.device.platform===`macos`?[...e.installChromeExtension?[`install`]:[],...this.autoInspect&&e.chromeExtensionStatus?[`inspect`]:[]]:[]}get needsInstall(){let e=this.result?.installation??this.legacyResult;return!e||!e.nativeHostRegistered||(e.installedProfiles??e.discoveredProfiles)===0}reset(){this.generation+=1,this.running=!1,this.failed=null,this.result=null,this.legacyResult=null}async setup(e){let t=this.capability;if(!this.isConnected||!t||this.running||!this.actions.includes(e))return;let n=++this.generation,r=()=>this.isConnected&&this.capability===t&&this.generation===n;this.running=!0,this.failed=null,this.result=null,this.legacyResult=null;try{if(t.snapshot?.browser?.chromeSetupActions===void 0){let n;if(e===`inspect`&&t.chromeExtensionStatus)n=await t.chromeExtensionStatus();else if(e===`install`&&t.installChromeExtension)n=await t.installChromeExtension();else return;r()&&this.actions.includes(e)&&(this.legacyResult=n)}else{let n=await t.setupChromeExtension(e);r()&&this.actions.includes(e)&&(this.result=n)}}catch{r()&&(this.failed=this.autoInspect&&e===`inspect`?`inspection`:`setup`)}finally{r()&&(this.running=!1)}}render(){return this.capability?.snapshot?.browser?u`
      <div class="native-chrome-setup">
        <p>${o(`configPage.deviceSettings.chromeExtensionHint`)}</p>
        <div class="native-chrome-setup__actions">
          ${[[`install`,`chromeExtensionSetup`],[`inspect`,`chromeExtensionRefresh`],[`verify`,`chromeExtensionVerify`]].filter(([e])=>this.actions.includes(e)&&(e!==`install`||!this.autoInspect||this.needsInstall)).map(([e,t])=>u`
                <button
                  type="button"
                  class="btn"
                  ?disabled=${this.running}
                  @click=${()=>this.setup(e)}
                >
                  ${o(`configPage.deviceSettings.${t}`)}
                </button>
              `)}
        </div>
        ${b({result:this.result,legacyResult:this.legacyResult,running:this.running,failed:this.failed})}
      </div>
    `:d}},r([n({context:g,subscribe:!0})],S.prototype,`context`,void 0),r([h({type:Boolean,attribute:`auto-inspect`})],S.prototype,`autoInspect`,void 0),r([p()],S.prototype,`running`,void 0),r([p()],S.prototype,`failed`,void 0),r([p()],S.prototype,`result`,void 0),r([p()],S.prototype,`legacyResult`,void 0),customElements.get(`openclaw-native-chrome-setup`)||customElements.define(`openclaw-native-chrome-setup`,S)})))()}export{C as t};
//# sourceMappingURL=native-chrome-setup-BL9JUBmZ.js.map