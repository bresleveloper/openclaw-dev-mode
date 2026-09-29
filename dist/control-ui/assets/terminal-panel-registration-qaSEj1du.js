const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./browser-D5BHV49K.js","./gateway-runtime-DGdfj77o.js","./control-ui-core-2cJmD3kZ.css","./sw-refresh.runtime-erblKRd8.js","./control-ui-boot-shared-C8yid87L.js","./control-ui-boot-shared-Cz3Zwi4M.js","./control-ui-boot-shared-BaakSUsS.js","./control-ui-boot-shared-DIh44kBs.js","./markdown-runtime-B1-JWj3L.js","./config-runtime-CgOgfOrG.js","./control-ui-boot-shared-gJH8zZtq.js","./control-ui-boot-shared-CnT6GD3L.js","./control-ui-boot-shared-DbQ0OGrz.js","./control-ui-boot-shared-BwgRPMMK.js","./control-ui-boot-shared-Do172wng.js","./control-ui-boot-shared-Cw9VhLyx.js","./sidebar-update-runtime-DljiVzh4.js","./control-ui-boot-shared-CVUnDsao.css","./sidebar-update-runtime-ah7rgQE7.css","./ghostty-web-Dk5Ycl6p.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ki as t,La as n,Ra as r,ai as i,ma as a,no as o,to as s,va as c}from"./control-ui-foundation-Bju0LxrM.js";import{Fs as l,Gl as u,Is as d,Ls as f,Rl as p,Sc as m,Xl as h,bc as ee,lt as te,ut as ne,zl as re}from"./control-ui-core-DX6662ze.js";import{$ as g,X as _,Y as v,_ as ie,ct as y,h as ae,m as oe,mt as se,nt as ce,tt as le,ut as b}from"./lit-runtime-BOUQsi_O.js";import{Fi as x,Gr as S,Ii as C,Jr as ue,Kr as w,Ni as de,ai as fe,ii as pe,oi as me,ri as he}from"./control-ui-core-QgEwr0pF.js";import{G as ge,H as _e,U as ve,V as ye}from"./control-ui-boot-shared-BTCVmdzL.js";import{B as be,G as xe,K as Se,X as Ce,Xt as T,Y as we,Yt as E,Z as Te,q as Ee,z as De}from"./control-ui-boot-shared-SOjXo6bG.js";import{n as Oe,t as ke}from"./scrollbar-styles-B5ndmzEX.js";import{n as Ae,t as je}from"./dock-panel-styles-C3B37hwD.js";import{a as Me,i as Ne,n as Pe,r as Fe,t as D}from"./panel-tab-strip-C3OyLkQ3.js";import{n as Ie,t as Le}from"./dock-destination-controls-DST1Slhs.js";import{n as O}from"./theme-color-DAo4KRoc.js";import{a as k,c as Re,i as ze,l as Be,o as A,r as Ve,s as j,t as He}from"./catalog-terminal-start-C8X1hs-4.js";var M,N;function P(){return(P=e((()=>{M=16777216,N=864e5,Math.ceil(M/3)*4})))()}function Ue(e){return e.shellName??h(`terminal.tabLabel`,{n:String(e.sequence)})}function We(e){return e.agentId===null||e.cwd===null?null:h(`terminal.tabHint`,{agent:e.agentId,cwd:e.cwd})}function Ge(e){return e.status===`connecting`?h(`terminal.connecting`):e.status===`exited`?e.exitReason===`detached`?h(`terminal.detached`):typeof e.exitSignal==`number`&&e.exitSignal>0?h(`terminal.exitedSignal`,{signal:String(e.exitSignal)}):e.exitReason===`process_exit`&&typeof e.exitCode==`number`?h(`terminal.exitedCode`,{code:String(e.exitCode)}):h(`terminal.exited`):null}function F(e){return e.map(e=>({id:e.id,label:Ue(e),title:We(e),icon:I,statusLabel:Ge(e),badge:e.agentOwned?h(`terminal.agentOwnedBadge`):null,className:`is-${e.status}`}))}function Ke(e){let t=F(e.tabs).map(e=>Object.assign(e,{domId:`terminal-tab-${e.id}`,closeLabel:`${h(`terminal.closeSession`)}: ${e.label}`}));return Fe({tabs:t,activeId:e.activeId,ariaControls:`terminal-tab-panel`,onSelect:e.onSelect,onClose:e.onClose,onNew:e.onNew,newLabel:h(`terminal.newSession`),newDisabled:e.booting})}var I;function L(){return(L=e((()=>{v(),u(),D(),I=le`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4l3 3-3 3M8 11h5" /></svg>`})))()}async function qe(e,t,n,r){let i={sessionId:t,...n};return await(r?e.request(`terminal.upload`,i,{signal:r}):e.request(`terminal.upload`,i))}async function Je(e){if(e.size>R)throw Error(h(`terminal.uploadTooLarge`,{file:e.name}));let t=new Uint8Array(await e.arrayBuffer()),n=[],r=32768;for(let e=0;e<t.length;e+=r)n.push(String.fromCharCode(...t.subarray(e,e+r)));return btoa(n.join(``))}function Ye(e){return/^[A-Za-z0-9_@%+=:,./-]+$/u.test(e)?e:`'${e.replaceAll(`'`,`'\\''`)}'`}function Xe(e,t,r){if(r===`native`){if(n(e))throw Error(h(`terminal.uploadInvalidNativePath`));if(/^(?:[a-z]:[\\/]|\\\\)/iu.test(e)){if(e.includes(`"`))throw Error(h(`terminal.uploadInvalidNativePath`));return`"${e}"`}if(!e.startsWith(`/`))throw Error(h(`terminal.uploadInvalidNativePath`));return`"${e.replace(/[\\"$`]/gu,`\\$&`)}"`}let i=t.split(/[\\/]/u).pop()?.toLowerCase()??``;if(/^(?:pwsh|powershell)(?:\.exe)?$/u.test(i))return`'${e.replaceAll(`'`,`''`)}'`;if(/^cmd(?:\.exe)?$/u.test(i)){if(/[%!]/u.test(e))throw Error(h(`terminal.uploadUnsafeCmdPath`));return`"${e.replaceAll(`"`,`""`)}"`}if(!/^(?:(?:ba|da|a|k|z)?sh|fish)(?:\.exe)?$/u.test(i))throw Error(h(`terminal.uploadUnsupportedShell`,{shell:i||t}));return Ye(e)}var R;function Ze(){return(Ze=e((()=>{r(),u(),R=16777216})))()}function Qe(e){if(typeof e==`object`&&e&&`retryable`in e){let t=e;return t.gatewayCode===`UNAVAILABLE`||t.code===`UNAVAILABLE`||t.retryable===!0}return!0}function $e(e){return g`<div class="rail-header__actions tp-actions">
    <button
      class="rail-header__action tp-icon tp-upload"
      type="button"
      title=${h(`terminal.addFiles`)}
      aria-label=${h(`terminal.addFiles`)}
      ?disabled=${e.upload.hasPendingBatch()||!e.upload.hasActiveTab()}
      @click=${e.upload.chooseFiles}
    >
      ${x.paperclip}
    </button>
    ${e.fullscreen?_:g`${e.sessionPicker}${e.embedded?g`<button
                  class="rail-header__action tp-icon"
                  type="button"
                  title=${h(`terminal.dockBottom`)}
                  aria-label=${h(`terminal.dockBottom`)}
                  @click=${()=>e.onDock(`bottom`)}
                >
                  ${x.panelBottomOpen}
                </button>`:g`${Ie({current:e.dock,groupClass:`tp-dock-modes`,groupLabel:h(`terminal.dockMode`),destinations:[{dock:`bottom`,label:h(`terminal.dockBottom`),icon:x.panelBottomOpen,className:`tp-icon`},{dock:`right`,label:h(`terminal.dockRight`),icon:x.panelRightOpen,className:`tp-icon`},{dock:`main`,label:h(`terminal.dockMain`),icon:x.columns2,className:`tp-icon`}],onSelect:e.onDock})}
                  <button
                    class="rail-header__action tp-icon tp-open-fullscreen"
                    type="button"
                    data-new-tab-action
                    title=${h(`terminal.openWindow`)}
                    aria-label=${h(`terminal.openWindow`)}
                    @click=${e.onOpenFullscreen}
                  >
                    ${x.maximize}
                  </button>
                  <button
                    class="rail-header__action tp-icon"
                    type="button"
                    title=${h(`terminal.hide`)}
                    aria-label=${h(`terminal.hide`)}
                    @click=${e.onHide}
                  >
                    ${x.x}
                  </button>`}`}
  </div>`}function et(e){let t=e.progress;return g`${e.dragActive?g`<div class="tp-drop-overlay">${h(`terminal.dropFiles`)}</div>`:_}
  ${t?g`<div
          class="tp-upload-card ${t.state===`failed`?`tp-upload-card--failed`:``}"
          role=${t.state===`failed`?`alert`:`status`}
          aria-live=${t.state===`failed`?`assertive`:`polite`}
        >
          <div class="tp-upload-card__header">
            <div class="tp-upload-card__copy">
              <div class="tp-upload-card__title">
                ${t.state===`failed`?h(`terminal.uploadFailed`):h(`terminal.uploadProgress`,{current:String(t.current),total:String(t.total)})}
              </div>
              <div class="tp-upload-card__file">${t.fileName}</div>
            </div>
            <div class="tp-upload-card__actions">
              ${t.state===`failed`&&t.retryable?g`<button
                      class="tp-upload-card__action tp-upload-retry"
                      type="button"
                      @click=${e.retry}
                    >
                      ${h(`terminal.retryUpload`)}
                    </button>`:_}
              <button
                class="tp-upload-card__action tp-upload-cancel"
                type="button"
                @click=${e.cancel}
              >
                ${h(`common.cancel`)}
              </button>
            </div>
          </div>
          <div
            class="tp-upload-progress"
            role="progressbar"
            aria-label=${t.state===`failed`?h(`terminal.uploadFailed`):h(`terminal.uploadProgress`,{current:String(t.current),total:String(t.total)})}
            aria-valuemin="0"
            aria-valuemax=${String(t.total)}
            aria-valuenow=${String(t.completed)}
          >
            <span
              class="tp-upload-progress__fill"
              style=${`width:${t.completed/t.total*100}%`}
            ></span>
            ${t.state===`uploading`?g`<span class="tp-upload-progress__activity"></span>`:_}
          </div>
          ${t.error?g`<div class="tp-upload-card__error">${t.error}</div>`:_}
          ${t.state===`failed`&&t.canInsert?g`<div class="tp-upload-card__recovery">
                  <button
                    class="tp-upload-card__action tp-upload-insert"
                    type="button"
                    @click=${e.insertCompleted}
                  >
                    ${h(`terminal.insertUploadedPaths`)}
                  </button>
                </div>`:_}
        </div>`:_}`}var tt;function z(){return(z=e((()=>{v(),P(),u(),f(),Le(),C(),Ze(),tt=class{constructor(e){this.host=e,this.dragActive=!1,this.batch=null,this.dragDepth=0,this.chooseFiles=()=>{this.host.fileInput()?.click()},this.handleFileSelection=e=>{let t=e.currentTarget,n=Array.from(t.files??[]);t.value=``,this.uploadFiles(n)},this.handleDragEnter=e=>{this.hasDraggedFiles(e)&&this.hasActiveTab()&&!this.hasPendingBatch()&&(e.preventDefault(),this.dragDepth+=1,this.dragActive=!0,this.host.requestUpdate())},this.handleDragOver=e=>{this.hasDraggedFiles(e)&&this.hasActiveTab()&&!this.hasPendingBatch()&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`copy`))},this.handleDragLeave=e=>{this.hasDraggedFiles(e)&&(this.dragDepth=Math.max(0,this.dragDepth-1),this.dragDepth===0&&(this.dragActive=!1,this.host.requestUpdate()))},this.handleDrop=e=>{this.hasDraggedFiles(e)&&(e.preventDefault(),this.dragDepth=0,this.dragActive=!1,this.host.requestUpdate(),!this.hasPendingBatch()&&this.uploadFiles(Array.from(e.dataTransfer?.files??[])))},this.insertCompleted=()=>{let e=this.batch;e?.state===`failed`&&e.paths.length>0&&this.insertPaths(e)},this.retry=()=>{let e=this.batch;if(e&&e.state===`failed`&&e.retryable){if(!this.host.isCurrent(e.tab)||!this.host.client()){this.cancelBatch(e);return}this.ensureUploadsRetained(e)&&(e.state=`uploading`,e.error=null,e.retryable=!1,e.abortController=new AbortController,this.host.requestUpdate(),this.runBatch(e))}},this.cancel=()=>{let e=this.batch;e&&this.cancelBatch(e)}}hasActiveTab(){return!!this.host.activeTab()}hasPendingBatch(){return this.batch!==null}get progress(){let e=this.batch;if(!e)return null;let t=e.files.length,n=Math.min(e.nextIndex,t-1);return{completed:e.nextIndex,canInsert:e.paths.length>0&&(e.expiresAtMs===null||Date.now()<e.expiresAtMs),current:n+1,error:e.error,fileName:e.files[n]?.name??``,retryable:e.retryable,state:e.state,total:t}}hasDraggedFiles(e){return Array.from(e.dataTransfer?.types??[]).includes(`Files`)}uploadFiles(e){let t=this.host.activeTab();if(e.length===0||!t||!this.host.client()||this.hasPendingBatch())return;this.host.setError(null);let n={tab:t,files:e,paths:[],expiresAtMs:null,nextIndex:0,state:`uploading`,error:null,retryable:!1,abortController:new AbortController};this.batch=n,this.host.requestUpdate(),this.runBatch(n)}isActive(e){return this.batch===e&&!e.abortController.signal.aborted}ensureCurrent(e){return this.isActive(e)?this.host.isCurrent(e.tab)?!0:(this.cancelBatch(e),!1):!1}failBatch(e,t,n){this.ensureCurrent(e)&&(e.state=`failed`,e.error=l(t),e.retryable=n,this.host.requestUpdate())}ensureUploadsRetained(e){return e.expiresAtMs!==null&&Date.now()>=e.expiresAtMs?(this.failBatch(e,Error(h(`terminal.uploadExpired`)),!1),!1):!0}async runBatch(e){let t=this.host.client();if(!t||!this.ensureCurrent(e)){this.cancelBatch(e);return}for(;e.nextIndex<e.files.length;){let n=e.files[e.nextIndex];if(!n||!this.ensureCurrent(e)||!this.ensureUploadsRetained(e))return;this.host.requestUpdate();let r;try{r=await Je(n)}catch(t){this.failBatch(e,t,!1);return}if(!this.ensureCurrent(e))return;let i,a=Date.now();try{if(i=await qe(t,e.tab.gatewaySessionId,{name:n.name,contentBase64:r},e.abortController.signal),!this.ensureCurrent(e))return}catch(t){this.failBatch(e,t,Qe(t));return}let o;try{o=Xe(i.path,e.tab.shell,i.uploadPathStyle)}catch(t){this.failBatch(e,t,!1);return}e.paths.push(o),e.expiresAtMs??=a+N,e.nextIndex+=1,this.host.requestUpdate()}this.insertPaths(e)}insertPaths(e){this.ensureCurrent(e)&&this.ensureUploadsRetained(e)&&(e.tab.controller.terminal.paste(e.paths.join(` `)),e.tab.controller.terminal.focus(),this.batch=null,this.host.requestUpdate())}cancelForTab(e){let t=this.batch;t?.tab===e&&this.cancelBatch(t)}cancelBatch(e){this.batch===e&&(e.abortController.abort(),this.batch=null,this.dragActive=!1,this.dragDepth=0,this.host.requestUpdate())}dispose(){this.batch?.abortController.abort(),this.batch=null,this.dragActive=!1,this.dragDepth=0}}})))()}function nt(e,t,n,r,i,a,o,s){return $e({fullscreen:e,embedded:t,dock:n,upload:r,sessionPicker:i,onDock:a,onOpenFullscreen:o,onHide:s})}function rt(e,t,n,r,i,a,o){return g`<header class="rail-header tp-header">
    ${Ke({tabs:e,activeId:t,booting:n,onSelect:i,onClose:a,onNew:o})}
    ${r}
  </header>`}function it({activeId:e,tabsInHeader:t=!1,connecting:n,error:r,uploadController:i}){return g`
    ${r?g`<div class="tp-error" role="alert">
            <span>${r.text}</span>
            ${r.retry?g`<button class="btn btn--sm" type="button" @click=${r.retry}>
                    ${h(`common.retry`)}
                  </button>`:_}
          </div>`:_}
    <wa-tab-panel
      id="terminal-tab-panel"
      class="tp-viewport"
      name=${e??`terminal`}
      active
      aria-labelledby=${e&&!t?`terminal-tab-${e}`:_}
      aria-label=${t?h(`terminal.title`):_}
      @dragenter=${i.handleDragEnter}
      @dragover=${i.handleDragOver}
      @dragleave=${i.handleDragLeave}
      @drop=${i.handleDrop}
    >
      ${n?T(`terminal`,h(`terminal.connecting`),!1,!0):_}
      ${!e&&!n&&!r?be({icon:x.terminal,heading:h(`chat.sidePanel.terminal`),description:h(`chat.sidePanel.terminalEmpty`)}):_}
      <input
        class="tp-file-input"
        type="file"
        multiple
        aria-hidden="true"
        tabindex="-1"
        @change=${i.handleFileSelection}
      />
      ${et(i)}
    </wa-tab-panel>
  `}function at(e){return e instanceof k?h(`terminal.connectionTimedOut`):e instanceof A?h(`terminal.unusableSession`,{field:e.field}):l(e)}function B(){return(B=e((()=>{v(),u(),f(),C(),De(),E(),j(),L(),z()})))()}function V(e){let t=e.getRootNode();return t instanceof ShadowRoot?t.activeElement??document.activeElement:document.activeElement}function H(e,t){return t===e||e.contains(t)}function ot(e){e instanceof HTMLElement&&e.isConnected&&e.focus()}function U(e,t){try{e.dispose()}catch{}finally{t.remove()}}async function st(e,t,n,r){if(r.aborted)return!1;let i=e.controller,a=e.host,o=V(a),s=H(a,o),c=a.cloneNode();c.style.display=`block`,c.style.visibility=`hidden`,c.inert=!0,a.before(c);let l,u=()=>{H(c,V(c))&&ot(o),l?U(l,c):c.remove()};try{if(l=await t(c,{readOnly:!0}),r.aborted||(n&&l.write(ct.encode(n)),await new Promise(e=>{setTimeout(e,0)}),r.aborted))return u(),!1}catch(e){throw u(),e}let d=V(a),f=null;return H(a,d)?f=c:H(c,d)&&(f=s?c:o),c.inert=!1,l.setReadOnly(i.readOnly),c.style.display=a.style.display,c.style.visibility=a.style.visibility,e.controller=l,e.host=c,U(i,a),ot(f),!0}var ct;function W(){return(W=e((()=>{ct=new TextEncoder})))()}function lt(e,t){let n=e?.trim();return!t&&n&&!m(n)?n:void 0}function ut(e){let t=e.split(/[\\/]/).pop()?.trim();return t&&t.length>0?t:`shell`}function G(e){let t=e.terminal;t.renderer&&t.wasmTerm&&t.renderer.render(t.wasmTerm,!0,t.viewportY,t,0)}var dt,K;function q(){return(q=e((()=>{ee(),dt=`ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Symbols Nerd Font Mono", "MesloLGLDZ Nerd Font Mono", "JetBrainsMono Nerd Font Mono", "Liberation Mono", monospace`,K=new TextEncoder})))()}function ft(e,t){let n=new Re(pt,{mode:`latch`},e=>e.length);return{buffer:n,onData:r=>{let i=mt.decode(r),a=t();a?e.input(a,i):n.push(i)},onResize:({columns:n,rows:r})=>{let i=t();i&&e.resize(i,n,r)}}}var pt,mt;function ht(){return(ht=e((()=>{Be(),pt=8192,mt=new TextDecoder})))()}function gt(){let e=getComputedStyle(document.documentElement);return{background:O(e,`--bg`),cursor:O(e,`--accent`),foreground:O(e,`--text`)}}function _t(e){let t=gt();return{...e===`light`?yt:vt,...t,cursorAccent:t.background,selectionBackground:`${t.cursor}${e===`light`?`4d`:`52`}`}}var vt,yt;function J(){return(J=e((()=>{vt={black:`#1b1e26`,red:`#ff6b6b`,green:`#4ec9a8`,yellow:`#e5c07b`,blue:`#5aa2ff`,magenta:`#c586c0`,cyan:`#56b6c2`,white:`#d7dae0`,brightBlack:`#5c6370`,brightRed:`#ff8787`,brightGreen:`#6fd7bd`,brightYellow:`#f0d197`,brightBlue:`#7cb7ff`,brightMagenta:`#d7a3d4`,brightCyan:`#7bd3dd`,brightWhite:`#ffffff`},yt={black:`#3a3f4b`,red:`#c62f3d`,green:`#177a5e`,yellow:`#8f6400`,blue:`#1e66d0`,magenta:`#94439c`,cyan:`#0f7487`,white:`#1b1e26`,brightBlack:`#5c6370`,brightRed:`#a3242f`,brightGreen:`#0f664e`,brightYellow:`#755200`,brightBlue:`#1a55ab`,brightMagenta:`#7c3382`,brightCyan:`#0c6070`,brightWhite:`#0a0c10`}})))()}async function bt(e){let{panel:t,connection:n}=e,r=document.createElement(`div`);if(r.className=`tp-host`,await t.updateComplete,!e.isCurrent())throw Error(`terminal operation cancelled`);let i=t.findTerminalPanelViewport();if(!i)throw Error(`terminal viewport unavailable`);i.append(r);let a={},o=ft(n,()=>a.current?.gatewaySessionId),{createTerminalDefaultColorQueryResponder:c}=await s(async()=>{let{createTerminalDefaultColorQueryResponder:e}=await import(`./browser-D5BHV49K.js`);return{createTerminalDefaultColorQueryResponder:e}},__vite__mapDeps([0,1,2]),import.meta.url),l=c({getColors:gt,reply:e=>o.onData(K.encode(e))}),u=(n,r)=>t.createTerminalController({parent:n,readOnly:r?.readOnly??!1,terminalOptions:{fontSize:11,fontFamily:dt,cursorBlink:!0,theme:_t(t.themeMode),scrollback:5e3},signal:e.signal,onData:o.onData,onResize:o.onResize}),d;try{d=await u(r)}catch(e){throw r.remove(),e}if(!e.isCurrent())throw U(d,r),Error(`terminal operation cancelled`);let f={id:`tab-${e.sequence}`,sequence:e.sequence,gatewaySessionId:``,pendingInput:o.buffer,defaultColorQueries:l,shellName:null,shell:``,agentId:null,cwd:null,agentOwned:!1,controller:d,host:r,status:`connecting`,awaitFirstOutput:e.awaitFirstOutput,readyTimer:null};return a.current=f,{tab:f,connection:n,cols:d.terminal.cols||80,rows:d.terminal.rows||24,sink:{onData:t=>{f.cancelled||(f.defaultColorQueries.observe(t),f.controller.write(K.encode(t)),t.length>0&&e.onReady(f))},onReplay:({data:t,newlyObservedFrom:n,mode:r,signal:i})=>{if(!(f.cancelled||i.aborted)){if(f.defaultColorQueries.primeFromReplay(t.slice(0,n)),f.defaultColorQueries.observe(t.slice(n)),r===`recovery`)return st(f,u,t,i).then(n=>{n&&t&&e.onReady(f)});t&&(f.controller.write(K.encode(t)),e.onReady(f))}},onExit:t=>e.onExit(f,t)}}}function xt(){return(xt=e((()=>{W(),q(),ht(),J(),o()})))()}async function St(e,t){await t,e&&(e.controller.fit(),G(e.controller),e.controller.terminal.focus())}function Ct(e,t){let n;for(let r of e){let e=r.controller.terminal;e.renderer&&e.wasmTerm&&(e.renderer.setTheme(n??=_t(t)),G(r.controller))}}function wt(e,t,n){if(!n)return;for(let t of e)t.host.parentElement!==n&&n.append(t.host);let r=e.find(e=>e.id===t);r&&(r.controller.fit(),G(r.controller))}function Tt(e,t){e.find(e=>e.id===t)?.controller.fit()}function Et(e){for(let t of e)t.controller.fit()}function Dt(e,t){for(let n of e)n.host.style.display=n.id===t?`block`:`none`}function Y(){return(Y=e((()=>{q(),J()})))()}var Ot;function kt(){return(kt=e((()=>{Ot=class{constructor(e){this.options=e}markReady(e){this.stop(e),e.status===`connecting`&&(e.status=`live`,this.options.onReady(e))}arm(e){!e.readyTimer&&e.status===`connecting`&&e.awaitFirstOutput&&(e.readyTimer=setTimeout(()=>{e.readyTimer=null,this.options.isCurrent(e)&&e.status===`connecting`&&e.awaitFirstOutput&&(e.awaitFirstOutput=!1,this.options.onTimeout(e))},this.options.timeoutMs()))}stop(e){e.readyTimer&&=(clearTimeout(e.readyTimer),null),e.awaitFirstOutput=!1}}})))()}async function At(e,t){for(let n of t)if(await n(),!e())return}var jt;function Mt(){return(Mt=e((()=>{jt=class{constructor(){this.tail=Promise.resolve(),this.generation=0}enqueue(e){let t=this.generation,n=()=>t===this.generation,r=()=>n()?e(n):Promise.resolve(),i=this.tail.then(r,r);return this.tail=i.catch(()=>{}),i}enqueueSteps(...e){return this.enqueue(t=>At(t,e))}reset(){this.generation+=1}}})))()}var Nt;function Pt(){return(Pt=e((()=>{u(),f(),He(),j(),W(),B(),xt(),Y(),q(),Se(),we(),kt(),Mt(),o(),Nt=class{constructor(e){this.host=e,this.tabs=[],this.activeId=null,this.booting=!1,this.error=null,this.connection=null,this.activeClient=null,this.activeAvailable=!1,this.hadClient=!1,this.hadAvailable=!1,this.lifecycleGeneration=0,this.lifecycleAbortController=new AbortController,this.lifecycleSyncToken=0,this.tabSequence=0,this.pendingRestore=null,this.intentQueue=Ee,this.bootQueue=new jt;let t=null;this.intentHost={bootQueue:this.bootQueue,currentGeneration:()=>this.lifecycleGeneration,canRun:()=>this.terminalActionsCanRun(),attach:(e,t,n)=>this.attachSessionNow(e,t,n),open:(e,t,n)=>this.openSessionNow(e,t,n),reattach:e=>this.reattachPersistedSessions(e),cancelledRestoreCompleted:()=>{this.error||this.closeEmptyPanel()},ensureInitial:async(e,t)=>{if(this.tabs.length===0){let n=this.host.page?this.host.routeTarget:null;return n&&`sessionId`in n?this.attachSessionNow(n.sessionId,!1,t):this.openSessionNow(n?.catalog,e,t)}return this.terminalActionsCanRun()},hasTabs:()=>this.tabs.length>0,requestUpdate:()=>this.host.requestUpdate(),setBooting:e=>this.updateControllerState({booting:e}),timeoutMs:()=>this.host.catalogReadyTimeoutMs,showTimeout:()=>{t=this.setError(h(`terminal.refreshRequired`))},clearTimeout:()=>{t&&this.error===t&&this.setError(null),t=null}},this.readiness=new Ot({timeoutMs:()=>this.host.catalogReadyTimeoutMs,isCurrent:e=>this.tabs.includes(e),onReady:e=>{delete e.pendingOpen,this.updateControllerState({tabs:[...this.tabs]}),this.persistSessions()},onTimeout:e=>{this.setError(h(`terminal.connectionTimedOut`),e.pendingOpen),this.connection?.close(e.gatewaySessionId),this.removeTab(e),this.persistSessions()}})}updateControllerState(e){Object.assign(this,e),this.host.requestUpdate()}setError(e,t){return this.updateControllerState({error:e?{text:e,retryAction:t}:null}),this.error}retryOpen(){let e=this.error?.retryAction;e&&(this.setError(null),this.intentQueue.queue(e))}connectHost(){this.host.page&&(this.intentQueue=new xe(!1)),this.activeClient=this.host.client,this.activeAvailable=this.host.available,this.hadClient=this.host.client!==null,this.hadAvailable=this.host.available,this.intentQueue.bindHost(this.intentHost),this.updateControllerState({booting:this.intentQueue.hasActions})}disconnectHost(){this.intentQueue.releaseHost(this.intentHost),this.disposeAllTabs(),this.activeClient=null,this.activeAvailable=!1}scheduleLifecycleSync(){let e=++this.lifecycleSyncToken,t=this.lifecycleGeneration;queueMicrotask(()=>{e===this.lifecycleSyncToken&&t===this.lifecycleGeneration&&this.host.isConnected&&this.synchronizeLifecycle()})}synchronizeLifecycle(){let e=this.host.client!==this.activeClient,t=this.host.available!==this.activeAvailable;if(!e&&!t)return;let n=t&&this.host.available&&this.hadAvailable,r=e&&this.hadClient||n,i=this.host.client!==null&&r;e&&(this.activeClient=this.host.client,this.hadClient||=this.host.client!==null),this.activeAvailable=this.host.available,this.hadAvailable||=this.host.available;let a=t&&!this.host.available;(e||a)&&this.disposeAllTabs();let o=e&&this.host.available&&this.host.terminalPanelOpen;t&&(this.host.available?this.host.restoreTerminalPanelOpenState()&&(o=!0):this.host.hideTerminalPanelForUnavailableSurface()),i?this.refreshBeforeReconnectRestore(o):o?this.restoreSessions():this.intentQueue.drain()}refreshBeforeReconnectRestore(e){let t=this.lifecycleGeneration;this.intentQueue.beginRefreshFence(this.intentHost,t),e&&this.restoreSessions();let n=()=>{t===this.lifecycleGeneration&&this.host.isConnected&&this.intentQueue.releaseRefreshFence(this.intentHost)};s(async()=>{let{refreshControlUiServiceWorker:e}=await import(`./sw-refresh.runtime-erblKRd8.js`);return{refreshControlUiServiceWorker:e}},__vite__mapDeps([3,1,4,5,6,7,8,9,10,11,12,13,14,15,16,2,17,18]),import.meta.url).then(({refreshControlUiServiceWorker:e})=>e()).then(e=>{e||n()},n)}restoreSessions(){return this.intentQueue.queue({kind:`restore`,agentId:this.host.agentId?.trim()||null})}terminalActionsCanRun(){return this.host.client!==null&&this.host.client===this.activeClient&&this.host.available&&this.host.terminalPanelOpen&&this.host.isConnected}cancelPendingActions(){this.intentQueue.cancel(this.intentHost)}get waitingForRefresh(){return this.intentQueue.waitingForRefresh}async reattachPersistedSessions(e){let t=this.captureTerminalOperation();if(!t||this.tabs.length>0)return!1;let n=Ce(this.storageScope);if(n.length===0)return!1;let r={operation:t,pending:new Map(n.map(e=>[e,void 0])),userClosedTab:!1,cancelIntent:e};this.pendingRestore=r,this.updateControllerState({booting:!0});try{let e=await this.connectionFor(t).list();if(!this.isTerminalOperationCurrent(t,r))return!1;let n=new Map(e.map(e=>[e.sessionId,e]));for(let e of r.pending.keys()){let i=n.get(e);if(i?await this.attachSession(e,t,i.owner?.startsWith(`agent:`)===!0,r):await this.restoreExitedSession(e,r),!this.isTerminalOperationCurrent(t,r))return!1;r.pending.delete(e),this.persistSessions()}}catch{}finally{this.isTerminalOperationCurrent(t,r)&&(this.pendingRestore=null,this.updateControllerState({booting:!1}),this.persistSessions())}return this.isTerminalOperationCurrent(t)&&r.userClosedTab}get storageScope(){return this.host.page?`:page:${JSON.stringify(this.host.routeTarget)}`:``}async listSessions(){let e=this.captureTerminalOperation();if(!e)return null;let t=await this.connectionFor(e).list().catch(()=>[]);return this.isTerminalOperationCurrent(e)?t:null}async attachSessionById(e,t=!1){await this.intentQueue.queue({kind:`attach`,sessionId:e,agentOwned:t})}async attachSessionNow(e,t,n){let r=this.tabs.find(t=>t.gatewaySessionId===e);if(r)return this.switchTo(r.id),!0;let i=this.captureTerminalOperation(n);if(!i)return!1;this.updateControllerState({booting:!0,error:null});try{let n=await this.attachSession(e,i,t);return n&&this.activeId&&this.switchTo(this.activeId),n||this.isTerminalOperationCurrent(i)}finally{this.isTerminalOperationCurrent(i)&&this.updateControllerState({booting:!1})}}async bootTab(e,t={}){let n=await bt({panel:this.host,connection:this.connectionFor(e),sequence:++this.tabSequence,signal:e.signal,awaitFirstOutput:t.awaitFirstOutput===!0,isCurrent:()=>this.isTerminalOperationCurrent(e,t.restore?.batch),onReady:e=>this.readiness.markReady(e),onExit:(e,t)=>this.handleExit(e.id,t)});if(!this.isTerminalOperationCurrent(e,t.restore?.batch))throw U(n.tab.controller,n.tab.host),Error(`terminal operation cancelled`);return t.restore?.batch.pending.set(t.restore.sessionId,n.tab),n.tab.cancelPendingIntent=e.cancelIntent,this.updateControllerState({tabs:[...this.tabs,n.tab],activeId:n.tab.id}),n}adoptSession(e,t,n=!1){this.retireRestoredTab(e),delete e.cancelPendingIntent,e.gatewaySessionId=t.sessionId,e.shellName=t.title??ut(t.shell),e.shell=t.shell,e.agentId=t.agentId,e.cwd=t.cwd,e.agentOwned=t.owner===void 0?n:t.owner.startsWith(`agent:`);let r=e.pendingInput.drain();if(e.status!==`exited`){let{cols:n,rows:i}=e.controller.terminal;this.connection?.resize(t.sessionId,n||80,i||24);for(let e of r)this.connection?.input(t.sessionId,e)}e.status===`connecting`&&(e.awaitFirstOutput?this.readiness.arm(e):this.readiness.markReady(e)),this.updateControllerState({tabs:[...this.tabs]}),this.persistSessions()}removeTab(e){this.disposeTab(e);let t=this.tabs.filter(t=>t.id!==e.id);this.updateControllerState({tabs:t,activeId:this.activeId===e.id?t.at(-1)?.id??null:this.activeId})}openSession(){return this.intentQueue.queue({kind:`open`,agentId:this.host.agentId?.trim()||null})}async openSessionNow(e,t,n){let r=this.captureTerminalOperation(n);if(!r)return!1;this.updateControllerState({booting:!0,error:null});let i=e?{kind:`catalog`,agentId:t,catalog:e}:{kind:`open`,agentId:t},a=lt(this.host.sessionKey,e),o;try{let n=await this.bootTab(r,{awaitFirstOutput:!!e});o=n.tab,n.tab.pendingOpen=i;let s=await n.connection.open({agentId:t??void 0,...a?{sessionKey:a}:{},cols:n.cols,rows:n.rows,...e?{catalog:e}:{}},n.sink);if(!this.isTerminalOperationCurrent(r)||n.tab.cancelled){let e=n.tab.cancelled===`close`;return n.connection.close(s.sessionId),this.tabs.includes(n.tab)&&(n.tab.cancelled=`lifecycle`,this.removeTab(n.tab)),e}return this.adoptSession(n.tab,s,a!==void 0),n.tab.controller.terminal.focus(),!0}catch(e){return o&&!o.gatewaySessionId&&this.tabs.includes(o)&&this.removeTab(o),this.isTerminalOperationCurrent(r)?(o?.cancelled!==`close`&&this.setError(at(e),e instanceof k||e instanceof A?i:void 0),!0):!1}finally{this.isTerminalOperationCurrent(r)&&this.updateControllerState({booting:!1})}}async attachSession(e,t,n=!1,r){let i,a,o=this.host.page?Ve(e,t.client):null;try{o&&(this.connection?.dispose(),this.connection=o.connection);let s=await this.bootTab(t,{awaitFirstOutput:o!==null,restore:r&&{batch:r,sessionId:e}});i=s.tab,a=s.connection,o&&o.bind(s.sink);let c=o?.result??await s.connection.attach(e,s.sink);return!this.isTerminalOperationCurrent(t,r)||s.tab.cancelled?(s.tab.cancelled===`close`&&s.connection.close(c.sessionId),this.tabs.includes(s.tab)&&(s.tab.cancelled=`lifecycle`,this.removeTab(s.tab)),!1):(this.adoptSession(s.tab,c,n),!0)}catch(n){if(o&&o.connection.close(o.result.sessionId),!this.isTerminalOperationCurrent(t,r,i))return!1;let s=r&&a?await this.confirmRestoredSessionGone(a,e,r):!1;return this.isTerminalOperationCurrent(t,r,i)?(i&&!i.gatewaySessionId&&this.tabs.includes(i)&&(s?this.markRestoredSessionExited(i,e):this.removeTab(i)),r||this.setError(`${h(`terminal.attachFailed`)}: ${l(n)}`),!1):!1}}async confirmRestoredSessionGone(e,t,n){let r=await e.list().catch(()=>null);return r!==null&&this.isTerminalOperationCurrent(n.operation,n)&&!r.some(e=>e.sessionId===t)}async restoreExitedSession(e,t){let n=await this.bootTab(t.operation,{restore:{batch:t,sessionId:e}});if(!this.isTerminalOperationCurrent(t.operation,t)||n.tab.cancelled){this.tabs.includes(n.tab)&&(n.tab.cancelled=`lifecycle`,this.removeTab(n.tab));return}this.markRestoredSessionExited(n.tab,e)}markRestoredSessionExited(e,t){e.gatewaySessionId=t,this.handleExit(e.id,{reason:`disconnected`,exitCode:null})}handleExit(e,t){let n=this.tabs.find(t=>t.id===e);n&&(this.retireRestoredTab(n),this.readiness.stop(n),delete n.pendingOpen,n.status=`exited`,n.exitReason=t.reason,n.exitCode=t.exitCode,n.exitSignal=t.signal,t.error?.trim()&&this.setError(d(t.error)),this.updateControllerState({tabs:[...this.tabs]}),this.persistSessions())}closeTab(e){let t=this.tabs.find(t=>t.id===e);t&&(t.cancelled=`close`,t.cancelPendingIntent?.(),this.retireRestoredTab(t),this.host.terminalPanelUploadController.cancelForTab(t),t.gatewaySessionId&&t.status!==`exited`&&this.connection?.close(t.gatewaySessionId),this.removeTab(t),this.persistSessions(),this.closeEmptyPanel())}closeEmptyPanel(){this.tabs.length===0&&!this.host.fullscreen&&!this.intentQueue.hasActions&&this.host.closeTerminalPanel()}switchTo(e){this.updateControllerState({activeId:e}),St(this.tabs.find(t=>t.id===e),this.host.updateComplete)}retireRestoredTab(e){let t=this.pendingRestore;if(t&&this.isTerminalOperationCurrent(t.operation,t)){for(let[n,r]of t.pending)if(r===e){t.userClosedTab||=e.cancelled===`close`,t.pending.delete(n),e.cancelled===`close`&&t.pending.size===0&&t.cancelIntent?.();break}}}persistSessions(){let e=this.pendingRestore;if(e&&!this.isTerminalOperationCurrent(e.operation,e))return;let t=new Set(this.tabs.filter(e=>e.status===`live`&&e.gatewaySessionId).map(e=>e.gatewaySessionId));for(let n of e?.pending.keys()??[])t.add(n);Te([...t],this.storageScope)}captureTerminalOperation(e){let t=this.host.client;return this.intentQueue.fenced||!t||t!==this.activeClient||!this.host.available||!this.host.isConnected?null:{generation:this.lifecycleGeneration,client:t,signal:this.lifecycleAbortController.signal,cancelIntent:e}}isTerminalOperationCurrent(e,t,n){return this.host.isConnected&&this.host.available&&this.host.client===e.client&&this.activeClient===e.client&&this.lifecycleGeneration===e.generation&&(!t||this.pendingRestore===t)&&n?.cancelled!==`close`&&!e.signal.aborted}connectionFor(e){if(!this.isTerminalOperationCurrent(e))throw Error(`terminal operation cancelled`);return this.connection??=new ze(e.client),this.connection}disposeTab(e){this.readiness.stop(e),U(e.controller,e.host)}disposeAllTabs(){this.lifecycleGeneration+=1,this.pendingRestore=null,this.intentQueue.resetLifecycle(this.intentHost),this.lifecycleAbortController.abort(),this.lifecycleAbortController=new AbortController,this.bootQueue.reset(),this.error?.retryAction&&this.setError(this.error.text),this.updateControllerState({booting:!1}),this.host.terminalPanelUploadController.dispose();for(let e of this.tabs)e.cancelled=`lifecycle`,this.disposeTab(e);this.updateControllerState({tabs:[],activeId:null}),this.host.resetTerminalSessionPicker(),this.connection?.dispose(),this.connection=null}}})))()}var Ft;function It(){return(It=e((()=>{v(),Ft=se`
  .tp--bottom {
    left: var(--shell-nav-width, 0);
    right: 0;
    bottom: 0;
    --tp-session-menu-max-height: calc(var(--tp-panel-height) - 44px);
  }
  .tp--right {
    top: var(--shell-topbar-height, 0);
    right: 0;
    bottom: 0;
    --tp-session-menu-max-height: calc(100dvh - var(--shell-topbar-height, 0px) - 44px);
  }
  .tp--main {
    /* Main mode owns the content region; later sibling docks may overlay it. */
    top: var(--shell-topbar-height, 0);
    left: var(--shell-nav-width, 0);
    right: 0;
    bottom: 0;
    --tp-session-menu-max-height: calc(100dvh - var(--shell-topbar-height, 0px) - 44px);
  }
  .tp--fullscreen {
    inset: 0;
  }
  .tp--embedded {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .tp-header .tabstrip-tab__icon {
    color: var(--muted, #8a919e);
  }
  /* Same glyph system as the side panel rail. Positioned so the session
     menu anchors to the header, not its mid-toolbar trigger: a
     trigger-anchored menu wider than the icons spills past the panel's
     left edge, and header anchoring makes 100% mean "panel width". */
  .tp-header {
    --rail-header-action-glyph-size: 15px;

    position: relative;
  }
  .tp-header .tabstrip-tab__icon svg,
  .tp-header .tp-icon svg {
    width: 15px;
    height: 15px;
    stroke-width: 1.6px;
  }
  .tp-dock-modes {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .tp-session-picker {
    position: static;
  }
  .tp-session-menu {
    position: absolute;
    z-index: 4;
    top: calc(100% + 3px);
    left: 8px;
    right: 8px;
    width: auto;
    max-width: 360px;
    /* Both edges are pinned, so the menu can never reach past the panel; the
       auto margin keeps it right-aligned under its trigger while it fits. */
    margin-left: auto;
    max-height: min(420px, var(--tp-session-menu-max-height));
    overflow-y: auto;
    padding: var(--menu-padding);
    border: 1px solid var(--overlay-border);
    border-radius: var(--menu-radius);
    background: var(--bg-elevated);
    box-shadow: var(--overlay-shadow);
  }
  .tp-session-menu--hosted {
    --tp-session-menu-max-height: calc(100% - 8px);

    top: 4px;
  }
  .tp-session-menu__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 6px 7px;
    color: var(--text, #d7dae0);
    font-size: 12px;
    font-weight: 600;
  }
  /* Refreshing the list is not destructive, so it reads as a plain action. */
  .tp-session-refresh {
    border: 0;
    background: transparent;
    color: var(--muted, #8a919e);
    font: inherit;
    font-weight: 500;
    padding: 2px 4px;
  }
  .tp-session-refresh:hover,
  .tp-session-refresh:focus-visible {
    color: var(--text, #d7dae0);
  }
  .tp-session {
    display: grid;
    grid-template-columns: minmax(70px, auto) minmax(100px, 1fr) auto;
    align-items: center;
    gap: 8px;
    width: 100%;
    border: 0;
    min-height: var(--menu-item-height);
    border-radius: var(--menu-item-radius);
    background: transparent;
    color: var(--text, #d7dae0);
    padding: 7px 8px;
    text-align: left;
  }
  .tp-session:not(:disabled):hover,
  .tp-session:not(:disabled):focus-visible {
    background: var(--bg-hover);
  }
  .tp-session:disabled {
    opacity: 0.55;
  }
  .tp-session__agent {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    font-weight: 600;
  }
  .tp-session__cwd {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--muted, #8a919e);
    font:
      11px ui-monospace,
      SFMono-Regular,
      "SF Mono",
      Menlo,
      Consolas,
      "Liberation Mono",
      monospace;
  }
  .tp-session__state {
    color: var(--muted, #8a919e);
    font-size: 11px;
    white-space: nowrap;
  }
  .tp-session-empty {
    padding: 10px 8px;
    color: var(--muted, #8a919e);
    font-size: 12px;
  }
  .tp-viewport {
    position: relative;
    flex: 1;
    min-height: 0;
    background: var(--bg, #0e1015);
  }
  .tp-host {
    position: absolute;
    inset: 0;
    z-index: 0;
    padding: 6px 8px;
    caret-color: transparent;
  }
  .tp-error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 12px;
    font-size: 12px;
    color: var(--danger, #ff6b6b);
  }
  .tp-error .btn {
    flex: 0 0 auto;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--bg-elevated);
    color: var(--text);
    padding: 6px 10px;
    font: inherit;
  }
`})))()}var X;function Lt(){return(Lt=e((()=>{v(),X=se`
  .rail-header__action:disabled {
    opacity: var(--rail-header-action-disabled-opacity, 0.4);
    pointer-events: none;
  }
  .tp-file-input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .tp-drop-overlay {
    position: absolute;
    z-index: 4;
    inset: 8px;
    display: grid;
    place-items: center;
    border: 1px dashed var(--accent, #ff5c5c);
    background: color-mix(in srgb, var(--bg, #0e1015) 88%, var(--accent, #ff5c5c));
    color: var(--text, #d7dae0);
    font-size: 13px;
    pointer-events: none;
  }
  .tp-upload-card {
    position: absolute;
    z-index: 5;
    right: 10px;
    bottom: 10px;
    width: min(300px, calc(100% - 20px));
    box-sizing: border-box;
    padding: 9px 10px 10px;
    border: 1px solid var(--border, #262b34);
    border-radius: 7px;
    background: color-mix(in srgb, var(--bg, #0e1015) 94%, var(--text, #d7dae0));
    box-shadow: 0 8px 24px rgb(0 0 0 / 28%);
    color: var(--text, #d7dae0);
    font-size: 11px;
  }
  .tp-upload-card--failed {
    border-color: color-mix(in srgb, var(--danger, #ff6b6b) 55%, var(--border, #262b34));
  }
  .tp-upload-card__header {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .tp-upload-card__copy {
    flex: 1;
    min-width: 0;
  }
  .tp-upload-card__title {
    color: var(--text, #d7dae0);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .tp-upload-card--failed .tp-upload-card__title,
  .tp-upload-card__error {
    color: var(--danger, #ff6b6b);
  }
  .tp-upload-card__file {
    margin-top: 2px;
    overflow: hidden;
    color: var(--muted, #8a919e);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tp-upload-card__error {
    margin-top: 6px;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }
  .tp-upload-card__actions {
    display: flex;
    gap: 4px;
  }
  .tp-upload-card__recovery {
    margin-top: 8px;
  }
  .tp-upload-card__action {
    margin: -3px 0;
    padding: 3px 5px;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: var(--muted, #8a919e);
    font: inherit;
    cursor: var(--cursor-action);
  }
  .tp-upload-card__action:hover {
    background: color-mix(in srgb, var(--text, #d7dae0) 10%, transparent);
    color: var(--text, #d7dae0);
  }
  .tp-upload-card__action:focus-visible {
    outline: 1px solid var(--accent, #ff5c5c);
    outline-offset: 1px;
  }
  .tp-upload-retry {
    color: var(--accent, #ff5c5c);
  }
  .tp-upload-progress {
    position: relative;
    height: 3px;
    margin-top: 8px;
    overflow: hidden;
    border-radius: 999px;
    background: color-mix(in srgb, var(--border, #262b34) 72%, transparent);
  }
  .tp-upload-progress__fill,
  .tp-upload-progress__activity {
    position: absolute;
    inset-block: 0;
    left: 0;
    border-radius: inherit;
    background: var(--accent, #ff5c5c);
  }
  .tp-upload-progress__fill {
    transition: width 180ms ease-out;
  }
  .tp-upload-progress__activity {
    width: 26%;
    opacity: 0.7;
    animation: tp-upload-progress 1.15s ease-in-out infinite;
  }
  .tp-upload-card--failed .tp-upload-progress__fill {
    background: var(--danger, #ff6b6b);
  }
  @keyframes tp-upload-progress {
    from {
      transform: translateX(-110%);
    }
    to {
      transform: translateX(385%);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .tp-upload-progress__activity {
      animation: none;
      transform: none;
    }
  }
`})))()}function Rt(e){return typeof e==`function`}async function zt(e){let[{createGhosttyTerminal:n,loadGhosttyRuntime:r},i]=await Promise.all([s(()=>import(`./browser-D5BHV49K.js`),__vite__mapDeps([0,1,2]),import.meta.url),s(()=>import(`./ghostty-web-Dk5Ycl6p.js`),__vite__mapDeps([19,1,2]),import.meta.url)]),a=await r({module:i}),o=await n({...e,runtime:a,autoFit:!1}),c=o.dispose.bind(o),l=o.terminal,u=new a.FitAddon;u.activate(l);let d;l.attachCustomKeyEventHandler(e=>e.defaultPrevented);let f=t(l)?.handleMouseUp,p=Rt(f)?f:void 0,m=!1;return o.fit=()=>{if(m)return;let e=u.proposeDimensions();e&&(e.cols!==l.cols||e.rows!==l.rows)&&o.resize({columns:e.cols,rows:e.rows})},o.dispose=()=>{m||(m=!0,d?.disconnect(),u.dispose(),p&&=(document.removeEventListener(`mouseup`,p),void 0),c())},e.signal?.aborted?o.dispose():e.autoFit!==!1&&(d=new ResizeObserver(()=>o.fit()),d.observe(e.parent),e.size||o.fit()),o}function Bt(){return(Bt=e((()=>{o()})))()}function Vt(e){return g`<button
    ${ie(e.triggerRef)}
    class=${e.hosted?`rail-header__action`:`rail-header__action tp-icon`}
    type="button"
    title=${e.hosted?_:h(`terminal.sessions`)}
    aria-label=${h(`terminal.sessions`)}
    aria-expanded=${e.open?`true`:`false`}
    aria-haspopup="dialog"
    aria-controls=${e.hosted?_:Z}
    @click=${e.onToggle}
    @focusout=${e.onFocusOut}
  >
    ${x.server}
  </button>`}function Ht(e){return g`
    ${e.open?g`<div
            id=${Z}
            class="tp-session-menu ${e.hosted?`tp-session-menu--hosted`:``}"
            @focusout=${e.onFocusOut}
            role="dialog"
            aria-label=${h(`terminal.sessions`)}
            @keydown=${t=>{t.key===`Escape`&&(t.preventDefault(),t.stopPropagation(),e.onDismiss(!0))}}
          >
            <div class="tp-session-menu__header">
              <span>${h(`terminal.sessions`)}</span>
              <button class="tp-session-refresh" type="button" @click=${e.onRefresh}>
                ${h(`terminal.refreshSessions`)}
              </button>
            </div>
            ${e.loading?T(`terminal`,h(`terminal.loadingSessions`),!0):e.sessions.length===0?g`<div class="tp-session-empty">${h(`terminal.noSessions`)}</div>`:e.sessions.map(t=>{let n=e.currentSessionIds.has(t.sessionId),r=`${t.owner?.startsWith(`agent:`)===!0?`${h(`terminal.agentOwnedBadge`)} · `:``}${n?h(`terminal.currentSession`):t.attached?h(`terminal.sessionAttached`):h(`terminal.detached`)}`;return g`<button
                        class="tp-session"
                        type="button"
                        ?disabled=${n}
                        title=${n?r:h(`terminal.attachSession`)}
                        @click=${()=>e.onAttach(t.sessionId,t.owner)}
                      >
                        <span class="tp-session__agent">${t.agentId}</span>
                        <span class="tp-session__cwd">${t.cwd}</span>
                        <span class="tp-session__state">${r}</span>
                      </button>`})}
          </div>`:_}
  `}var Z;function Ut(){return(Ut=e((()=>{v(),oe(),u(),C(),E(),Z=`terminal-session-picker-dialog`})))()}var Wt,Q;function Gt(){return(Gt=e((()=>{ye(),a(),v(),ce(),oe(),u(),te(),re(),ke(),me(),he(),Ae(),C(),Me(),de(),D(),ue(),B(),Pt(),Y(),It(),L(),Lt(),z(),Bt(),Ut(),Wt=3e4,Q=class extends p{constructor(...e){super(...e),this.client=null,this.agentId=null,this.sessionKey=null,this.available=!1,this.suppressed=!1,this.themeMode=`dark`,this.basePath=``,this.fullscreen=!1,this.embedded=!1,this.tabsInHeader=!1,this.page=!1,this.routeTarget=null,this.sessionPickerOpen=!1,this.pickerSessions=[],this.sessionPickerTrigger=ae(),this.sessionPickerTask=new _e(this,{autoRun:!1,args:()=>[this.available?this.client:null],task:([e])=>e?this.terminalSessions.listSessions():ve,onComplete:e=>{e!==null&&(this.pickerSessions=e)}}),this.terminalPanelUploadController=new tt({activeTab:()=>this.terminalSessions.tabs.find(e=>e.id===this.terminalSessions.activeId&&e.status===`live`&&e.gatewaySessionId),client:()=>this.client,isCurrent:e=>this.terminalSessions.tabs.includes(e)&&e.status===`live`,fileInput:()=>this.renderRoot.querySelector(`.tp-file-input`),setError:e=>this.terminalSessions.setError(e),requestUpdate:()=>this.requestUpdate()}),this.createTerminalController=zt,this.catalogReadyTimeoutMs=Wt,this.terminalSessions=new Nt(this),this.dockLayout=new fe(this,{layout:pe,reservationPrefix:`terminal`,isAvailable:()=>this.isDockLayoutAvailable(),isFullscreen:()=>this.fullscreen,onResize:()=>Tt(this.terminalSessions.tabs,this.terminalSessions.activeId)}),this.onToggleRequest=e=>this.handleToggleRequest(e),this.onDockBottomRequest=e=>this.handleToggleRequest(e),this.onDocumentPointerDown=e=>this.handleDocumentPointerDown(e),this.themeObserver=null}get sessionBottomOnly(){return!this.embedded&&this.sessionKey!==null}connectedCallback(){super.connectedCallback(),this.terminalSessions.connectHost(),this.dockLayout.setSuppressed(this.suppressed),!this.fullscreen&&!this.embedded&&!this.sessionBottomOnly&&window.addEventListener(w,this.onToggleRequest),!this.fullscreen&&!this.embedded&&window.addEventListener(S,this.onDockBottomRequest),document.addEventListener(`pointerdown`,this.onDocumentPointerDown,!0),typeof MutationObserver<`u`&&(this.themeObserver=new MutationObserver(()=>Ct(this.terminalSessions.tabs,this.themeMode)),this.themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:[`data-theme`,`data-theme-mode`,`style`]})),this.dockLayout.open&&this.terminalSessions.restoreSessions()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(w,this.onToggleRequest),window.removeEventListener(S,this.onDockBottomRequest),document.removeEventListener(`pointerdown`,this.onDocumentPointerDown,!0),this.themeObserver?.disconnect(),this.themeObserver=null,this.terminalSessions.disconnectHost()}updated(e){(e.has(`embedded`)||e.has(`sessionKey`))&&!this.fullscreen&&(this.embedded||this.sessionBottomOnly?window.removeEventListener(w,this.onToggleRequest):window.addEventListener(w,this.onToggleRequest),this.embedded?window.removeEventListener(S,this.onDockBottomRequest):window.addEventListener(S,this.onDockBottomRequest)),e.has(`suppressed`)&&this.dockLayout.setSuppressed(this.suppressed)&&this.terminalSessions.restoreSessions(),(e.has(`client`)||e.has(`available`))&&this.terminalSessions.scheduleLifecycleSync(),e.has(`themeMode`)&&Ct(this.terminalSessions.tabs,this.themeMode),e.has(`embedded`)&&this.embedded&&this.terminalSessions.restoreSessions(),(this.embedded||this.dockLayout.open)&&wt(this.terminalSessions.tabs,this.terminalSessions.activeId,this.findTerminalPanelViewport()),this.dockLayout.syncReservation();let t=JSON.stringify([this.embedded&&this.tabsInHeader,this.terminalSessions.activeId,this.hostedTabs.map(({id:e,label:t,statusLabel:n,badge:r,className:i})=>[e,t,n,r,i]),this.terminalSessions.booting,this.sessionPickerOpen,this.sessionPickerTask.status,this.pickerSessions.map(e=>e.sessionId),this.terminalPanelUploadController.hasPendingBatch(),this.terminalPanelUploadController.hasActiveTab()]);t!==this.lastHostedTabsChangeKey&&(this.lastHostedTabsChangeKey=t,this.dispatchEvent(new CustomEvent(Ne,{bubbles:!0,composed:!0})))}get hostedTabs(){return F(this.terminalSessions.tabs)}get activeHostedTabId(){return this.terminalSessions.activeId}selectHostedTab(e){this.terminalSessions.switchTo(e)}async closeHostedTab(e){this.terminalSessions.closeTab(e),await this.updateComplete}get hostedActions(){if(!this.embedded||!this.tabsInHeader)return _;let e=this.terminalPanelUploadController;return g`
      <openclaw-tooltip .content=${h(`terminal.sessions`)}>
        ${Vt(this.sessionPickerProps)}
      </openclaw-tooltip>
      <openclaw-tooltip .content=${h(`terminal.addFiles`)}>
        <button
          class="rail-header__action"
          type="button"
          aria-label=${h(`terminal.addFiles`)}
          ?disabled=${!e.hasActiveTab()||e.hasPendingBatch()}
          @click=${e.chooseFiles}
        >
          ${x.paperclip}
        </button>
      </openclaw-tooltip>
      <openclaw-tooltip .content=${h(`terminal.dockBottom`)}>
        <button
          class="rail-header__action"
          type="button"
          aria-label=${h(`terminal.dockBottom`)}
          @click=${()=>this.setDock(`bottom`)}
        >
          ${x.panelBottomOpen}
        </button>
      </openclaw-tooltip>
    `}toggle(){this.available&&(this.dockLayout.open?this.closeTerminalPanel():(this.dockLayout.setOpen(!0),this.terminalSessions.restoreSessions()))}handleToggleRequest(e){let t=e instanceof CustomEvent&&typeof e.detail==`object`&&e.detail!==null?e.detail:null,n=t?.dock===`right`||t?.dock===`bottom`?t.dock:null;if(t?.agentId!==void 0&&(this.agentId=t.agentId),n&&this.dockLayout.setDock(n,!1),t?.open===!1){this.closeTerminalPanel();return}if(t?.terminalSessionId||t?.open===!0||t?.newSession===!0){if(!this.available)return;this.dockLayout.setOpen(!0),t.newSession===!0?this.terminalSessions.openSession():t.terminalSessionId?this.terminalSessions.attachSessionById(t.terminalSessionId,!0):this.terminalSessions.restoreSessions();return}this.toggle()}closeTerminalPanel(){this.closeSessionPicker(!1),this.terminalSessions.cancelPendingActions(),this.dockLayout.setOpen(!1)}get terminalPanelOpen(){return this.embedded?this.available:this.dockLayout.open&&this.isDockLayoutAvailable()}hideTerminalPanelForUnavailableSurface(){this.dockLayout.hideWithoutPersisting()}restoreTerminalPanelOpenState(){return this.dockLayout.restoreOpenState()}isDockLayoutAvailable(){return this.available&&(!this.sessionBottomOnly||this.dockLayout.dock===`bottom`)}toggleSessionPicker(){if(this.sessionPickerOpen){this.closeSessionPicker(!0);return}this.sessionPickerOpen=!0,this.refreshSessionPicker(),this.updateComplete.then(()=>{this.sessionPickerOpen&&this.renderRoot.querySelector(`.tp-session-refresh`)?.focus()})}closeSessionPicker(e){this.sessionPickerOpen&&(this.sessionPickerOpen=!1,e&&this.updateComplete.then(()=>{this.sessionPickerTrigger.value?.focus()}))}handleDocumentPointerDown(e){if(!this.sessionPickerOpen)return;let t=this.renderRoot.querySelector(`.tp-session-menu`),n=e.composedPath(),r=this.sessionPickerTrigger.value;!(r&&n.includes(r))&&!(t&&n.includes(t))&&this.closeSessionPicker(!1)}handleSessionPickerFocusOut(e){let t=e=>e instanceof Node&&(e===this.sessionPickerTrigger.value||this.renderRoot.querySelector(`.tp-session-menu`)?.contains(e));t(e.relatedTarget)||queueMicrotask(()=>{!t(this.shadowRoot?.activeElement??document.activeElement)&&this.sessionPickerOpen&&this.closeSessionPicker(!1)})}refreshSessionPicker(){return this.sessionPickerTask.run()}async attachPickedSession(e,t){this.sessionPickerOpen=!1,await this.terminalSessions.attachSessionById(e,t?.startsWith(`agent:`)===!0)}setDock(e){if(this.embedded&&e===`bottom`){window.dispatchEvent(new CustomEvent(S,{detail:{agentId:this.agentId,dock:`bottom`,open:!0}}));return}this.dockLayout.setDock(e),this.updateComplete.then(()=>Et(this.terminalSessions.tabs))}openFullscreen(){let e=c({kind:`terminal`},this.basePath);e&&ne(e)}resetTerminalSessionPicker(){this.closeSessionPicker(!1),this.sessionPickerTask.run([null]),this.pickerSessions=[]}findTerminalPanelViewport(){return this.renderRoot.querySelector(`.tp-viewport`)}get sessionPickerProps(){return{hosted:this.embedded&&this.tabsInHeader,triggerRef:this.sessionPickerTrigger,open:this.sessionPickerOpen,loading:this.sessionPickerTask.status===ge.PENDING,sessions:this.pickerSessions,currentSessionIds:new Set(this.terminalSessions.tabs.map(e=>e.gatewaySessionId).filter(e=>typeof e==`string`&&e.length>0)),onToggle:()=>this.toggleSessionPicker(),onDismiss:e=>this.closeSessionPicker(e),onFocusOut:e=>this.handleSessionPickerFocusOut(e),onRefresh:()=>void this.refreshSessionPicker(),onAttach:(e,t)=>void this.attachPickedSession(e,t)}}render(){if(!this.terminalPanelOpen)return _;let e=this.embedded?`embedded`:this.fullscreen?`fullscreen`:this.dockLayout.dock,t=this.embedded||this.fullscreen||this.dockLayout.dock===`main`?_:this.dockLayout.dock===`bottom`?`height:${this.dockLayout.height}px;--tp-panel-height:${this.dockLayout.height}px`:`width:${this.dockLayout.width}px`,n=this.terminalSessions.tabs.find(e=>e.id===this.terminalSessions.activeId),r=this.terminalSessions.waitingForRefresh||this.terminalSessions.booting&&this.terminalSessions.tabs.length===0||n?.status===`connecting`,i=this.terminalSessions.error?{text:this.terminalSessions.error.text,retry:this.terminalSessions.error.retryAction?()=>this.terminalSessions.retryOpen():void 0}:null,a=this.embedded&&this.tabsInHeader,o=this.sessionPickerProps,s=g`<div class="tp-session-picker">
      ${Vt(o)} ${Ht(o)}
    </div>`,c=nt(this.fullscreen,this.embedded,this.dockLayout.dock,this.terminalPanelUploadController,s,e=>this.setDock(e),()=>this.openFullscreen(),()=>this.closeTerminalPanel());return g`
      <section class="tp tp--${e}" style=${t} aria-label=${h(`terminal.title`)}>
        ${this.embedded?_:this.dockLayout.renderResizer(`tp`,h(`terminal.resize`))}
        ${a?Ht(o):rt(this.terminalSessions.tabs,this.terminalSessions.activeId,this.terminalSessions.booting,c,e=>this.terminalSessions.switchTo(e),e=>this.closeHostedTab(e),()=>void this.terminalSessions.openSession())}
        ${it({activeId:this.terminalSessions.activeId,tabsInHeader:a,connecting:r,error:i,uploadController:this.terminalPanelUploadController})}
      </section>
    `}willUpdate(){Dt(this.terminalSessions.tabs,this.terminalSessions.activeId)}static{this.styles=[Pe,je,Ft,X,Oe]}},i([b({attribute:!1})],Q.prototype,`client`,void 0),i([b({attribute:!1})],Q.prototype,`agentId`,void 0),i([b({attribute:!1})],Q.prototype,`sessionKey`,void 0),i([b({type:Boolean})],Q.prototype,`available`,void 0),i([b({type:Boolean})],Q.prototype,`suppressed`,void 0),i([b({attribute:!1})],Q.prototype,`themeMode`,void 0),i([b({attribute:!1})],Q.prototype,`basePath`,void 0),i([b({type:Boolean})],Q.prototype,`fullscreen`,void 0),i([b({type:Boolean})],Q.prototype,`embedded`,void 0),i([b({type:Boolean})],Q.prototype,`tabsInHeader`,void 0),i([b({type:Boolean})],Q.prototype,`page`,void 0),i([b({attribute:!1})],Q.prototype,`routeTarget`,void 0),i([y()],Q.prototype,`sessionPickerOpen`,void 0),i([y()],Q.prototype,`pickerSessions`,void 0)})))()}function $(){return($=e((()=>{Gt(),customElements.get(`openclaw-terminal-panel`)||customElements.define(`openclaw-terminal-panel`,Q)})))()}export{$ as t};
//# sourceMappingURL=terminal-panel-registration-qaSEj1du.js.map