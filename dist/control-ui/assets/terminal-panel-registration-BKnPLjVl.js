const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./browser-DOhmaakk.js","./gateway-runtime-FZ6mX2RY.js","./session-snapshot-database-DFlfztRJ.js","./control-ui-core-yIvVj14Y.css","./control-ui-boot-shared-C9uJ732w.js","./control-ui-boot-shared-BRpXgwOq.js","./control-ui-boot-shared-CE7ueCxh.js","./control-ui-boot-shared-DsSYH3B6.js","./control-ui-boot-shared-BgJI8jW3.js","./control-ui-boot-shared-C1PHuQAX.js","./control-ui-boot-shared-Dg7r4uLq.js","./config-runtime-BecGLziM.js","./control-ui-boot-shared-styles-BaQ2sAfZ.js","./markdown-runtime-ORQpioyT.js","./plugin-contracts-runtime-CWHgryFQ.js","./sidebar-update-runtime-CVvIs9jq.js","./control-ui-boot-shared-styles-DKyMAG_6.css","./control-ui-boot-shared-CXHNz0Bh.css","./sidebar-update-runtime-ah7rgQE7.css","./ghostty-web-Et3EMhT1.js"])))=>i.map(i=>d[i]);
import{n as e,r as t}from"./rolldown-runtime-8BhlS34s.js";import{Ac as n,Ci as r,Eu as i,Tu as a,Yc as o,Zc as s,dn as c,du as l,fn as u,fu as d,g as f,h as p,ju as m,kc as ee,m as te,pu as h,wu as ne}from"./control-ui-core-bJHyI7AF.js";import{Ai as re,Ti as ie,_i as ae,ai as oe,gi as se,hi as ce,na as g,ni as _,ra as v,ri as y,vi as le,wi as ue}from"./control-ui-core-DNh4McGE.js";import{$ as b,F as de,M as fe,N as pe,X as x,Y as S,ct as me,mt as he,nt as ge,tt as _e,ut as C}from"./lit-runtime-DyST807n.js";import{Ha as ve,Ra as ye,Xr as be,Zr as xe,co as Se,ii as w,lo as Ce,ma as we,oa as T,sa as E}from"./ui-DeikvIdP.js";import{A as Te,M as Ee,O as De,k as Oe}from"./control-ui-boot-shared-ChxHeQUn.js";import{C as ke,D as Ae,E as je,O as Me,S as Ne,ht as D,mt as O,w as Pe}from"./control-ui-boot-chat-DfNf0poH.js";import{n as Fe,t as Ie}from"./scrollbar-styles-D8VGVDiV.js";import{n as Le,t as Re}from"./dock-panel-styles-CIuTBK0T.js";import{a as ze,i as Be,n as Ve,r as He,t as k}from"./panel-tab-strip-C6eteeqt.js";import{n as Ue,t as We}from"./dock-destination-controls-DwfJ8NRR.js";import{n as Ge,t as Ke}from"./panel-empty-state-De_5Bizz.js";import{n as A}from"./theme-color-DAo4KRoc.js";import{a as j,c as qe,i as Je,l as Ye,n as Xe,o as M,r as Ze,s as N}from"./catalog-terminal-start-_c6w0j2H.js";var P,F;function I(){return(I=e((()=>{P=16777216,F=864e5,Math.ceil(P/3)*4})))()}async function Qe(e,t,n,r){let i={sessionId:t,...n};return await(r?e.request(`terminal.upload`,i,{signal:r}):e.request(`terminal.upload`,i))}async function $e(e){if(e.size>16777216)throw Error(m(`terminal.uploadTooLarge`,{file:e.name}));return r(new Uint8Array(await e.arrayBuffer()))}function et(e){return/^[A-Za-z0-9_@%+=:,./-]+$/u.test(e)?e:`'${e.replaceAll(`'`,`'\\''`)}'`}function tt(e,t,n){if(n===`native`){if(Se(e))throw Error(m(`terminal.uploadInvalidNativePath`));if(/^(?:[a-z]:[\\/]|\\\\)/iu.test(e)){if(e.includes(`"`))throw Error(m(`terminal.uploadInvalidNativePath`));return`"${e}"`}if(!e.startsWith(`/`))throw Error(m(`terminal.uploadInvalidNativePath`));return`"${e.replace(/[\\"$`]/gu,`\\$&`)}"`}let r=t.split(/[\\/]/u).pop()?.toLowerCase()??``;if(/^(?:pwsh|powershell)(?:\.exe)?$/u.test(r))return`'${e.replaceAll(`'`,`''`)}'`;if(/^cmd(?:\.exe)?$/u.test(r)){if(/[%!]/u.test(e))throw Error(m(`terminal.uploadUnsafeCmdPath`));return`"${e.replaceAll(`"`,`""`)}"`}if(!/^(?:(?:ba|da|a|k|z)?sh|fish)(?:\.exe)?$/u.test(r))throw Error(m(`terminal.uploadUnsupportedShell`,{shell:r||t}));return et(e)}function L(){return(L=e((()=>{Ce(),I(),i()})))()}function nt(e){if(typeof e==`object`&&e&&`retryable`in e){let t=e;return t.gatewayCode===`UNAVAILABLE`||t.code===`UNAVAILABLE`||t.retryable===!0}return!0}function rt(e){return b`<div class="rail-header__actions tp-actions">
    ${e.upload.uploadsEnabled()?b`<button
            class="rail-header__action tp-icon tp-upload"
            type="button"
            title=${m(`terminal.addFiles`)}
            aria-label=${m(`terminal.addFiles`)}
            ?disabled=${e.upload.hasPendingBatch()||!e.upload.hasActiveTab()}
            @click=${e.upload.chooseFiles}
          >
            ${g.paperclip}
          </button>`:x}
    ${e.fullscreen?x:b`${e.sessionPicker}${e.embedded?b`<button
                  class="rail-header__action tp-icon"
                  type="button"
                  title=${m(`terminal.dockBottom`)}
                  aria-label=${m(`terminal.dockBottom`)}
                  @click=${()=>e.onDock(`bottom`)}
                >
                  ${g.panelBottomOpen}
                </button>`:b`${Ue({current:e.dock,groupClass:`tp-dock-modes`,groupLabel:m(`terminal.dockMode`),destinations:[{dock:`bottom`,label:m(`terminal.dockBottom`),icon:g.panelBottomOpen,className:`tp-icon`},{dock:`right`,label:m(`terminal.dockRight`),icon:g.panelRightOpen,className:`tp-icon`},{dock:`main`,label:m(`terminal.dockMain`),icon:g.columns2,className:`tp-icon`}],onSelect:e.onDock})}
                  <button
                    class="rail-header__action tp-icon tp-open-fullscreen"
                    type="button"
                    data-new-tab-action
                    title=${m(`terminal.openWindow`)}
                    aria-label=${m(`terminal.openWindow`)}
                    @click=${e.onOpenFullscreen}
                  >
                    ${g.maximize}
                  </button>
                  <button
                    class="rail-header__action tp-icon"
                    type="button"
                    title=${m(`terminal.hide`)}
                    aria-label=${m(`terminal.hide`)}
                    @click=${e.onHide}
                  >
                    ${g.x}
                  </button>`}`}
  </div>`}function it(e){let t=e.progress,n=t&&(t.state===`failed`?m(`terminal.uploadFailed`):m(`terminal.uploadProgress`,{current:String(t.current),total:String(t.total)}));return b`${e.dragActive?b`<div class="tp-drop-overlay">${m(`terminal.dropFiles`)}</div>`:x}
  ${t?b`<div
          class="tp-upload-card ${t.state===`failed`?`tp-upload-card--failed`:``}"
          role=${t.state===`failed`?`alert`:`status`}
          aria-live=${t.state===`failed`?`assertive`:`polite`}
        >
          <div class="tp-upload-card__header">
            <div class="tp-upload-card__copy">
              <div class="tp-upload-card__title">${n}</div>
              <div class="tp-upload-card__file">${t.fileName}</div>
            </div>
            <div class="tp-upload-card__actions">
              ${t.state===`failed`&&t.retryable?b`<button
                      class="tp-upload-card__action tp-upload-retry"
                      type="button"
                      @click=${e.retry}
                    >
                      ${m(`terminal.retryUpload`)}
                    </button>`:x}
              <button
                class="tp-upload-card__action tp-upload-cancel"
                type="button"
                @click=${e.cancel}
              >
                ${m(`common.cancel`)}
              </button>
            </div>
          </div>
          <div
            class="tp-upload-progress"
            role="progressbar"
            aria-label=${n}
            aria-valuemin="0"
            aria-valuemax=${String(t.total)}
            aria-valuenow=${String(t.completed)}
          >
            <span
              class="tp-upload-progress__fill"
              style=${`width:${t.completed/t.total*100}%`}
            ></span>
            ${t.state===`uploading`?b`<span class="tp-upload-progress__activity"></span>`:x}
          </div>
          ${t.error?b`<div class="tp-upload-card__error">${t.error}</div>`:x}
          ${t.state===`failed`&&t.canInsert?b`<div class="tp-upload-card__recovery">
                  <button
                    class="tp-upload-card__action tp-upload-insert"
                    type="button"
                    @click=${e.insertCompleted}
                  >
                    ${m(`terminal.insertUploadedPaths`)}
                  </button>
                </div>`:x}
        </div>`:x}`}var R;function z(){return(z=e((()=>{S(),I(),i(),h(),te(),We(),v(),L(),R=class{constructor(e){this.host=e,this.dragActive=!1,this.batch=null,this.dragDepth=0,this.chooseFiles=()=>{this.admitUpload()&&this.host.fileInput()?.click()},this.handleFileSelection=e=>{let t=e.currentTarget;if(!this.admitUpload()){t.value=``;return}let n=Array.from(t.files??[]);t.value=``,this.uploadFiles(n)},this.handleDragEnter=e=>{this.admitDraggedFiles(e)&&(e.preventDefault(),this.dragDepth+=1,this.dragActive=!0,this.host.requestUpdate())},this.handleDragOver=e=>{this.admitDraggedFiles(e)&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`copy`))},this.handleDragLeave=e=>{this.hasDraggedFiles(e)&&(this.dragDepth=Math.max(0,this.dragDepth-1),this.dragDepth===0&&(this.dragActive=!1,this.host.requestUpdate()))},this.handleDrop=e=>{this.hasDraggedFiles(e)&&(e.preventDefault(),this.dragDepth=0,this.dragActive=!1,this.host.requestUpdate(),!this.hasPendingBatch()&&this.uploadFiles(Array.from(e.dataTransfer?.files??[])))},this.insertCompleted=()=>{let e=this.batch;e?.state===`failed`&&e.paths.length>0&&this.insertPaths(e)},this.retry=()=>{if(!this.admitUpload())return;let e=this.batch;if(e&&e.state===`failed`&&e.retryable){if(!this.host.isCurrent(e.tab)||!this.host.client()){this.cancelBatch(e);return}this.ensureUploadsRetained(e)&&(e.state=`uploading`,e.error=null,e.retryable=!1,e.abortController=new AbortController,this.host.requestUpdate(),this.runBatch(e))}},this.cancel=()=>{let e=this.batch;e&&this.cancelBatch(e)}}uploadsEnabled(){return f(this.host.config?.())}syncPolicy(){this.uploadsEnabled()||(this.cancel(),this.dragActive=!1,this.dragDepth=0)}admitUpload(){return this.uploadsEnabled()?!0:(this.host.setError(p()),this.syncPolicy(),!1)}hasActiveTab(){return!!this.host.activeTab()}hasPendingBatch(){return this.batch!==null}get progress(){let e=this.batch;if(!e)return null;let t=e.files.length,n=Math.min(e.nextIndex,t-1);return{completed:e.nextIndex,canInsert:e.paths.length>0&&(e.expiresAtMs===null||Date.now()<e.expiresAtMs),current:n+1,error:e.error,fileName:e.files[n]?.name??``,retryable:e.retryable,state:e.state,total:t}}hasDraggedFiles(e){return Array.from(e.dataTransfer?.types??[]).includes(`Files`)}admitDraggedFiles(e){return this.hasDraggedFiles(e)?this.uploadsEnabled()?this.hasActiveTab()&&!this.hasPendingBatch():(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`none`),!1):!1}uploadFiles(e){if(!this.admitUpload())return;let t=this.host.activeTab();if(e.length===0||!t||!this.host.client()||this.hasPendingBatch())return;this.host.setError(null);let n={tab:t,files:e,paths:[],expiresAtMs:null,nextIndex:0,state:`uploading`,error:null,retryable:!1,abortController:new AbortController};this.batch=n,this.host.requestUpdate(),this.runBatch(n)}isActive(e){return this.batch===e&&!e.abortController.signal.aborted}ensureCurrent(e){return this.isActive(e)?this.uploadsEnabled()?this.host.isCurrent(e.tab)?!0:(this.cancelBatch(e),!1):(this.host.setError(p()),this.cancelBatch(e),!1):!1}failBatch(e,t,n){this.ensureCurrent(e)&&(e.state=`failed`,e.error=l(t),e.retryable=n,this.host.requestUpdate())}ensureUploadsRetained(e){return e.expiresAtMs!==null&&Date.now()>=e.expiresAtMs?(this.failBatch(e,Error(m(`terminal.uploadExpired`)),!1),!1):!0}async runBatch(e){let t=this.host.client();if(!t||!this.ensureCurrent(e)){this.cancelBatch(e);return}for(;e.nextIndex<e.files.length;){let n=e.files[e.nextIndex];if(!n||!this.ensureCurrent(e)||!this.ensureUploadsRetained(e))return;this.host.requestUpdate();let r;try{r=await $e(n)}catch(t){this.failBatch(e,t,!1);return}if(!this.ensureCurrent(e))return;let i,a=Date.now();try{if(i=await Qe(t,e.tab.gatewaySessionId,{name:n.name,contentBase64:r},e.abortController.signal),!this.ensureCurrent(e))return}catch(t){this.failBatch(e,t,nt(t));return}let o;try{o=tt(i.path,e.tab.shell,i.uploadPathStyle)}catch(t){this.failBatch(e,t,!1);return}e.paths.push(o),e.expiresAtMs??=a+F,e.nextIndex+=1,this.host.requestUpdate()}this.insertPaths(e)}insertPaths(e){this.ensureCurrent(e)&&this.ensureUploadsRetained(e)&&(e.tab.controller.terminal.paste(e.paths.join(` `)),e.tab.controller.terminal.focus(),this.batch=null,this.host.requestUpdate())}cancelForTab(e){let t=this.batch;t?.tab===e&&this.cancelBatch(t)}cancelBatch(e){this.batch===e&&(e.abortController.abort(),this.batch=null,this.dragActive=!1,this.dragDepth=0,this.host.requestUpdate())}dispose(){this.batch?.abortController.abort(),this.batch=null,this.dragActive=!1,this.dragDepth=0}}})))()}function at({activeId:e,tabsInHeader:t=!1,connecting:n,error:r,uploadController:i}){return b`
    ${r?b`<div class="tp-error" role="alert">
            <span>${r.text}</span>
            ${r.retry?b`<button class="btn btn--sm" type="button" @click=${r.retry}>
                    ${m(`common.retry`)}
                  </button>`:x}
          </div>`:x}
    <wa-tab-panel
      id="terminal-tab-panel"
      class="tp-viewport"
      name=${e??`terminal`}
      active
      aria-labelledby=${e&&!t?`terminal-tab-${e}`:x}
      aria-label=${t?m(`terminal.title`):x}
      @dragenter=${i.handleDragEnter}
      @dragover=${i.handleDragOver}
      @dragleave=${i.handleDragLeave}
      @drop=${i.handleDrop}
    >
      ${n?D(`terminal`,m(`terminal.connecting`),!1,!0):x}
      ${!e&&!n&&!r?Ge({icon:g.terminal,heading:m(`chat.sidePanel.terminal`),description:m(`chat.sidePanel.terminalEmpty`)}):x}
      ${i.uploadsEnabled()?b`<input
              class="tp-file-input"
              type="file"
              multiple
              aria-hidden="true"
              tabindex="-1"
              @change=${i.handleFileSelection}
            />`:x}
      ${it(i)}
    </wa-tab-panel>
  `}function ot(e){return e instanceof j?m(`terminal.connectionTimedOut`):e instanceof M?m(`terminal.unusableSession`,{field:e.field}):l(e)}function B(){return(B=e((()=>{S(),i(),h(),v(),Ke(),O(),N(),z()})))()}function V(e){let t=e.getRootNode();return t instanceof ShadowRoot?t.activeElement??document.activeElement:document.activeElement}function H(e){e instanceof HTMLElement&&e.isConnected&&e.focus()}function U(e,t){try{e.dispose()}catch{}finally{t.remove()}}async function st(e,t,n,r){if(r.aborted)return!1;let i=e.controller,a=e.host,o=V(a),s=a.contains(o),c=a.cloneNode();c.style.display=`block`,c.style.visibility=`hidden`,c.inert=!0,a.before(c);let l,u=()=>{c.contains(V(c))&&H(o),l?U(l,c):c.remove()};try{if(l=await t(c,{readOnly:!0}),r.aborted||(n&&l.write(W.encode(n)),await new Promise(e=>{setTimeout(e,0)}),r.aborted))return u(),!1}catch(e){throw u(),e}let d=V(a),f=null;return a.contains(d)?f=c:c.contains(d)&&(f=s?c:o),c.inert=!1,l.setReadOnly(i.readOnly),c.style.display=a.style.display,c.style.visibility=a.style.visibility,e.controller=l,e.host=c,U(i,a),H(f),!0}var W;function G(){return(G=e((()=>{W=new TextEncoder})))()}function ct(e,t){let n=e?.trim();return!t&&n&&!s(n)?n:void 0}function lt(e){let t=e.split(/[\\/]/).pop()?.trim();return t&&t.length>0?t:`shell`}function K(e){let t=e.terminal;t.renderer&&t.wasmTerm&&t.renderer.render(t.wasmTerm,!0,t.viewportY,t,0)}var ut,q;function J(){return(J=e((()=>{o(),ut=`ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Symbols Nerd Font Mono", "MesloLGLDZ Nerd Font Mono", "JetBrainsMono Nerd Font Mono", "Liberation Mono", monospace`,q=new TextEncoder})))()}function dt(e,t){let n=new qe(ft,{mode:`latch`},e=>e.length);return{buffer:n,onData:r=>{let i=pt.decode(r),a=t();a?e.input(a,i):n.push(i)},onResize:({columns:n,rows:r})=>{let i=t();i&&e.resize(i,n,r)}}}var ft,pt;function mt(){return(mt=e((()=>{Ye(),ft=8192,pt=new TextDecoder})))()}function ht(){let e=getComputedStyle(document.documentElement);return{background:A(e,`--bg`),cursor:A(e,`--accent`),foreground:A(e,`--text`)}}function gt(e){let t=ht();return{...e===`light`?vt:_t,...t,cursorAccent:t.background,selectionBackground:`${t.cursor}${e===`light`?`4d`:`52`}`}}var _t,vt;function Y(){return(Y=e((()=>{_t={black:`#1b1e26`,red:`#ff6b6b`,green:`#4ec9a8`,yellow:`#e5c07b`,blue:`#5aa2ff`,magenta:`#c586c0`,cyan:`#56b6c2`,white:`#d7dae0`,brightBlack:`#5c6370`,brightRed:`#ff8787`,brightGreen:`#6fd7bd`,brightYellow:`#f0d197`,brightBlue:`#7cb7ff`,brightMagenta:`#d7a3d4`,brightCyan:`#7bd3dd`,brightWhite:`#ffffff`},vt={black:`#3a3f4b`,red:`#c62f3d`,green:`#177a5e`,yellow:`#8f6400`,blue:`#1e66d0`,magenta:`#94439c`,cyan:`#0f7487`,white:`#1b1e26`,brightBlack:`#5c6370`,brightRed:`#a3242f`,brightGreen:`#0f664e`,brightYellow:`#755200`,brightBlue:`#1a55ab`,brightMagenta:`#7c3382`,brightCyan:`#0c6070`,brightWhite:`#0a0c10`}})))()}async function yt(e){let{panel:t,connection:n}=e,r=document.createElement(`div`);if(r.className=`tp-host`,await t.updateComplete,!e.isCurrent())throw Error(`terminal operation cancelled`);let i=t.findTerminalPanelViewport();if(!i)throw Error(`terminal viewport unavailable`);i.append(r);let a={},o=dt(n,()=>a.current?.gatewaySessionId),{createTerminalDefaultColorQueryResponder:s}=await T(async()=>{let{createTerminalDefaultColorQueryResponder:e}=await import(`./browser-DOhmaakk.js`);return{createTerminalDefaultColorQueryResponder:e}},__vite__mapDeps([0,1,2,3]),import.meta.url),c=s({getColors:ht,reply:e=>o.onData(q.encode(e))}),l=(n,r)=>t.createTerminalController({parent:n,readOnly:r?.readOnly??!1,terminalOptions:{fontSize:11,fontFamily:ut,cursorBlink:!0,theme:gt(t.themeMode),scrollback:5e3},signal:e.signal,onData:o.onData,onResize:o.onResize}),u;try{u=await l(r)}catch(e){throw r.remove(),e}if(!e.isCurrent())throw U(u,r),Error(`terminal operation cancelled`);let d={id:`tab-${e.sequence}`,sequence:e.sequence,gatewaySessionId:``,pendingInput:o.buffer,defaultColorQueries:c,shellName:null,shell:``,agentId:null,cwd:null,agentOwned:!1,controller:u,host:r,status:`connecting`,awaitFirstOutput:e.awaitFirstOutput,readyTimer:null};return a.current=d,{tab:d,connection:n,cols:u.terminal.cols||80,rows:u.terminal.rows||24,sink:{onData:t=>{d.cancelled||(d.defaultColorQueries.observe(t),d.controller.write(q.encode(t)),t.length>0&&e.onReady(d))},onReplay:({data:t,newlyObservedFrom:n,mode:r,signal:i})=>{if(!(d.cancelled||i.aborted)){if(d.defaultColorQueries.primeFromReplay(t.slice(0,n)),d.defaultColorQueries.observe(t.slice(n)),r===`recovery`)return st(d,l,t,i).then(n=>{n&&t&&e.onReady(d)});t&&(d.controller.write(q.encode(t)),e.onReady(d))}},onExit:t=>e.onExit(d,t)}}}function bt(){return(bt=e((()=>{G(),J(),mt(),Y(),E()})))()}async function xt(e,t){await t,e&&(e.controller.fit(),K(e.controller),e.controller.terminal.focus())}function St(e,t){let n;for(let r of e){let e=r.controller.terminal;e.renderer&&e.wasmTerm&&(e.renderer.setTheme(n??=gt(t)),K(r.controller))}}function Ct(e,t,n){if(!n)return;for(let t of e)t.host.parentElement!==n&&n.append(t.host);let r=e.find(e=>e.id===t);r&&(r.controller.fit(),K(r.controller))}function X(){return(X=e((()=>{J(),Y()})))()}var wt;function Tt(){return(Tt=e((()=>{wt=class{constructor(e){this.options=e}markReady(e){this.stop(e),e.status===`connecting`&&(e.status=`live`,this.options.onReady(e))}arm(e){!e.readyTimer&&e.status===`connecting`&&e.awaitFirstOutput&&(e.readyTimer=setTimeout(()=>{e.readyTimer=null,this.options.isCurrent(e)&&e.status===`connecting`&&e.awaitFirstOutput&&(e.awaitFirstOutput=!1,this.options.onTimeout(e))},this.options.timeoutMs()))}stop(e){e.readyTimer&&=(clearTimeout(e.readyTimer),null),e.awaitFirstOutput=!1}}})))()}var Et;function Dt(){return(Dt=e((()=>{Et=class{constructor(){this.tail=Promise.resolve(),this.generation=0}enqueue(e){let t=this.generation,n=()=>t===this.generation,r=()=>n()?e(n):Promise.resolve(),i=this.tail.then(r,r);return this.tail=i.catch(()=>{}),i}reset(){this.generation+=1}}})))()}var Ot;function kt(){return(kt=e((()=>{i(),h(),Xe(),N(),G(),B(),bt(),X(),J(),ke(),je(),Tt(),Dt(),E(),Ot=class{constructor(e){this.host=e,this.tabs=[],this.activeId=null,this.booting=!1,this.error=null,this.connection=null,this.activeClient=null,this.activeAvailable=!1,this.hadClient=!1,this.hadAvailable=!1,this.lifecycleGeneration=0,this.lifecycleAbortController=new AbortController,this.lifecycleSyncToken=0,this.tabSequence=0,this.pendingRestore=null,this.intentQueue=Pe,this.bootQueue=new Et;let t=null;this.intentHost={bootQueue:this.bootQueue,currentGeneration:()=>this.lifecycleGeneration,canRun:()=>this.terminalActionsCanRun(),attach:(e,t,n)=>this.attachSessionNow(e,t,n),open:(e,t,n)=>this.openSessionNow(e,t,n),reattach:e=>this.reattachPersistedSessions(e),cancelledRestoreCompleted:()=>{this.error||this.closeEmptyPanel()},ensureInitial:async(e,t)=>{if(this.tabs.length===0){let n=this.host.page?this.host.routeTarget:null;return n&&`sessionId`in n?this.attachSessionNow(n.sessionId,!1,t):this.openSessionNow(n?.catalog,e,t)}return this.terminalActionsCanRun()},hasTabs:()=>this.tabs.length>0,requestUpdate:()=>this.host.requestUpdate(),setBooting:e=>this.updateControllerState({booting:e}),timeoutMs:()=>this.host.catalogReadyTimeoutMs,showTimeout:()=>{t=this.setError(m(`terminal.refreshRequired`))},clearTimeout:()=>{t&&this.error===t&&this.setError(null),t=null}},this.readiness=new wt({timeoutMs:()=>this.host.catalogReadyTimeoutMs,isCurrent:e=>this.tabs.includes(e),onReady:e=>{delete e.pendingOpen,this.updateControllerState({tabs:[...this.tabs]}),this.persistSessions()},onTimeout:e=>{this.setError(m(`terminal.connectionTimedOut`),e.pendingOpen),this.connection?.close(e.gatewaySessionId),this.removeTab(e),this.persistSessions()}})}updateControllerState(e){Object.assign(this,e),this.host.requestUpdate()}setError(e,t){return this.updateControllerState({error:e?{text:e,retryAction:t}:null}),this.error}retryOpen(){let e=this.error?.retryAction;e&&(this.setError(null),this.intentQueue.queue(e))}connectHost(){this.host.page&&(this.intentQueue=new Ne(!1)),this.activeClient=this.host.client,this.activeAvailable=this.host.available,this.hadClient=this.host.client!==null,this.hadAvailable=this.host.available,this.intentQueue.bindHost(this.intentHost),this.updateControllerState({booting:this.intentQueue.hasActions})}disconnectHost(){this.intentQueue.releaseHost(this.intentHost),this.disposeAllTabs(),this.activeClient=null,this.activeAvailable=!1}scheduleLifecycleSync(){let e=++this.lifecycleSyncToken,t=this.lifecycleGeneration;queueMicrotask(()=>{e===this.lifecycleSyncToken&&t===this.lifecycleGeneration&&this.host.isConnected&&this.synchronizeLifecycle()})}synchronizeLifecycle(){let e=this.host.client!==this.activeClient,t=this.host.available!==this.activeAvailable;if(!e&&!t)return;let n=t&&this.host.available&&this.hadAvailable,r=e&&this.hadClient||n,i=this.host.client!==null&&r;e&&(this.activeClient=this.host.client,this.hadClient||=this.host.client!==null),this.activeAvailable=this.host.available,this.hadAvailable||=this.host.available;let a=t&&!this.host.available;(e||a)&&this.disposeAllTabs();let o=e&&this.host.available&&this.host.terminalPanelOpen;t&&(this.host.available?this.host.restoreTerminalPanelOpenState()&&(o=!0):this.host.hideTerminalPanelForUnavailableSurface()),i?this.refreshBeforeReconnectRestore(o):o?this.restoreSessions():this.intentQueue.drain()}refreshBeforeReconnectRestore(e){let t=this.lifecycleGeneration;this.intentQueue.beginRefreshFence(this.intentHost,t),e&&this.restoreSessions();let n=()=>{t===this.lifecycleGeneration&&this.host.isConnected&&this.intentQueue.releaseRefreshFence(this.intentHost)};T(async()=>{let{refreshControlUiServiceWorker:e}=await import(`./control-ui-boot-shared-C9uJ732w.js`).then(e=>(e.Ki(),e.qi));return{refreshControlUiServiceWorker:e}},__vite__mapDeps([4,1,2,5,6,7,8,9,10,11,12,13,14,15,3,16,17,18]),import.meta.url).then(({refreshControlUiServiceWorker:e})=>e()).then(e=>{e||n()},n)}restoreSessions(){return this.intentQueue.queue({kind:`restore`,agentId:this.host.agentId?.trim()||null})}terminalActionsCanRun(){return this.host.client!==null&&this.host.client===this.activeClient&&this.host.available&&this.host.terminalPanelOpen&&this.host.isConnected}cancelPendingActions(){this.intentQueue.cancel(this.intentHost)}get waitingForRefresh(){return this.intentQueue.waitingForRefresh}async reattachPersistedSessions(e){let t=this.captureTerminalOperation();if(!t||this.tabs.length>0)return!1;let n=Ae(this.storageScope);if(n.length===0)return!1;let r={operation:t,pending:new Map(n.map(e=>[e,void 0])),userClosedTab:!1,cancelIntent:e};this.pendingRestore=r,this.updateControllerState({booting:!0});try{let e=await this.connectionFor(t).list();if(!this.isTerminalOperationCurrent(t,r))return!1;let n=new Map(e.map(e=>[e.sessionId,e]));for(let e of r.pending.keys()){let i=n.get(e);if(i?await this.attachSession(e,t,i.owner?.startsWith(`agent:`)===!0,r):await this.restoreExitedSession(e,r),!this.isTerminalOperationCurrent(t,r))return!1;r.pending.delete(e),this.persistSessions()}}catch{}finally{this.isTerminalOperationCurrent(t,r)&&(this.pendingRestore=null,this.updateControllerState({booting:!1}),this.persistSessions())}return this.isTerminalOperationCurrent(t)&&r.userClosedTab}get storageScope(){return this.host.page?`:page:${JSON.stringify(this.host.routeTarget)}`:``}async listSessions(){let e=this.captureTerminalOperation();if(!e)return null;let t=await this.connectionFor(e).list().catch(()=>[]);return this.isTerminalOperationCurrent(e)?t:null}async attachSessionById(e,t=!1){await this.intentQueue.queue({kind:`attach`,sessionId:e,agentOwned:t})}async attachSessionNow(e,t,n){let r=this.tabs.find(t=>t.gatewaySessionId===e);if(r)return this.switchTo(r.id),!0;let i=this.captureTerminalOperation(n);if(!i)return!1;this.updateControllerState({booting:!0,error:null});try{let n=await this.attachSession(e,i,t);return n&&this.activeId&&this.switchTo(this.activeId),n||this.isTerminalOperationCurrent(i)}finally{this.isTerminalOperationCurrent(i)&&this.updateControllerState({booting:!1})}}async bootTab(e,t={}){let n=await yt({panel:this.host,connection:this.connectionFor(e),sequence:++this.tabSequence,signal:e.signal,awaitFirstOutput:t.awaitFirstOutput===!0,isCurrent:()=>this.isTerminalOperationCurrent(e,t.restore?.batch),onReady:e=>this.readiness.markReady(e),onExit:(e,t)=>this.handleExit(e.id,t)});if(!this.isTerminalOperationCurrent(e,t.restore?.batch))throw U(n.tab.controller,n.tab.host),Error(`terminal operation cancelled`);return t.restore?.batch.pending.set(t.restore.sessionId,n.tab),n.tab.cancelPendingIntent=e.cancelIntent,this.updateControllerState({tabs:[...this.tabs,n.tab],activeId:n.tab.id}),n}adoptSession(e,t,n=!1){this.retireRestoredTab(e),delete e.cancelPendingIntent,e.gatewaySessionId=t.sessionId,e.shellName=t.title??lt(t.shell),e.shell=t.shell,e.agentId=t.agentId,e.cwd=t.cwd,e.agentOwned=t.owner===void 0?n:t.owner.startsWith(`agent:`);let r=e.pendingInput.drain();if(e.status!==`exited`){let{cols:n,rows:i}=e.controller.terminal;this.connection?.resize(t.sessionId,n||80,i||24);for(let e of r)this.connection?.input(t.sessionId,e)}e.status===`connecting`&&(e.awaitFirstOutput?this.readiness.arm(e):this.readiness.markReady(e)),this.updateControllerState({tabs:[...this.tabs]}),this.persistSessions()}removeTab(e){this.disposeTab(e);let t=this.tabs.filter(t=>t.id!==e.id);this.updateControllerState({tabs:t,activeId:this.activeId===e.id?t.at(-1)?.id??null:this.activeId})}openSession(){return this.intentQueue.queue({kind:`open`,agentId:this.host.agentId?.trim()||null})}async openSessionNow(e,t,n){let r=this.captureTerminalOperation(n);if(!r)return!1;this.updateControllerState({booting:!0,error:null});let i=e?{kind:`catalog`,agentId:t,catalog:e}:{kind:`open`,agentId:t},a=ct(this.host.sessionKey,e),o;try{let n=await this.bootTab(r,{awaitFirstOutput:!!e});o=n.tab,n.tab.pendingOpen=i;let s=await n.connection.open({agentId:t??void 0,...a?{sessionKey:a}:{},cols:n.cols,rows:n.rows,...e?{catalog:e}:{}},n.sink);if(!this.isTerminalOperationCurrent(r)||n.tab.cancelled){let e=n.tab.cancelled===`close`;return n.connection.close(s.sessionId),this.tabs.includes(n.tab)&&(n.tab.cancelled=`lifecycle`,this.removeTab(n.tab)),e}return this.adoptSession(n.tab,s,a!==void 0),n.tab.controller.terminal.focus(),!0}catch(e){return o&&!o.gatewaySessionId&&this.tabs.includes(o)&&this.removeTab(o),this.isTerminalOperationCurrent(r)?(o?.cancelled!==`close`&&this.setError(ot(e),e instanceof j||e instanceof M?i:void 0),!0):!1}finally{this.isTerminalOperationCurrent(r)&&this.updateControllerState({booting:!1})}}async attachSession(e,t,n=!1,r){let i,a,o=this.host.page?Ze(e,t.client):null;try{o&&(this.connection?.dispose(),this.connection=o.connection);let s=await this.bootTab(t,{awaitFirstOutput:o!==null,restore:r&&{batch:r,sessionId:e}});i=s.tab,a=s.connection,o&&o.bind(s.sink);let c=o?.result??await s.connection.attach(e,s.sink);return!this.isTerminalOperationCurrent(t,r)||s.tab.cancelled?(s.tab.cancelled===`close`&&s.connection.close(c.sessionId),this.tabs.includes(s.tab)&&(s.tab.cancelled=`lifecycle`,this.removeTab(s.tab)),!1):(this.adoptSession(s.tab,c,n),!0)}catch(n){if(o&&o.connection.close(o.result.sessionId),!this.isTerminalOperationCurrent(t,r,i))return!1;let s=r&&a?await this.confirmRestoredSessionGone(a,e,r):!1;return this.isTerminalOperationCurrent(t,r,i)?(i&&!i.gatewaySessionId&&this.tabs.includes(i)&&(s?this.markRestoredSessionExited(i,e):this.removeTab(i)),r||this.setError(`${m(`terminal.attachFailed`)}: ${l(n)}`),!1):!1}}async confirmRestoredSessionGone(e,t,n){let r=await e.list().catch(()=>null);return r!==null&&this.isTerminalOperationCurrent(n.operation,n)&&!r.some(e=>e.sessionId===t)}async restoreExitedSession(e,t){let n=await this.bootTab(t.operation,{restore:{batch:t,sessionId:e}});if(!this.isTerminalOperationCurrent(t.operation,t)||n.tab.cancelled){this.tabs.includes(n.tab)&&(n.tab.cancelled=`lifecycle`,this.removeTab(n.tab));return}this.markRestoredSessionExited(n.tab,e)}markRestoredSessionExited(e,t){e.gatewaySessionId=t,this.handleExit(e.id,{reason:`disconnected`,exitCode:null})}handleExit(e,t){let n=this.tabs.find(t=>t.id===e);n&&(this.retireRestoredTab(n),this.readiness.stop(n),delete n.pendingOpen,n.status=`exited`,n.exitReason=t.reason,n.exitCode=t.exitCode,n.exitSignal=t.signal,t.error?.trim()&&this.setError(d(t.error)),this.updateControllerState({tabs:[...this.tabs]}),this.persistSessions())}closeTab(e){let t=this.tabs.find(t=>t.id===e);t&&(t.cancelled=`close`,t.cancelPendingIntent?.(),this.retireRestoredTab(t),this.host.terminalPanelUploadController.cancelForTab(t),t.gatewaySessionId&&t.status!==`exited`&&this.connection?.close(t.gatewaySessionId),this.removeTab(t),this.persistSessions(),this.closeEmptyPanel())}closeEmptyPanel(){this.tabs.length===0&&!this.host.fullscreen&&!this.intentQueue.hasActions&&this.host.closeTerminalPanel()}switchTo(e){this.updateControllerState({activeId:e}),xt(this.tabs.find(t=>t.id===e),this.host.updateComplete)}retireRestoredTab(e){let t=this.pendingRestore;if(t&&this.isTerminalOperationCurrent(t.operation,t)){for(let[n,r]of t.pending)if(r===e){t.userClosedTab||=e.cancelled===`close`,t.pending.delete(n),e.cancelled===`close`&&t.pending.size===0&&t.cancelIntent?.();break}}}persistSessions(){let e=this.pendingRestore;if(e&&!this.isTerminalOperationCurrent(e.operation,e))return;let t=new Set(this.tabs.filter(e=>e.status===`live`&&e.gatewaySessionId).map(e=>e.gatewaySessionId));for(let n of e?.pending.keys()??[])t.add(n);Me([...t],this.storageScope)}captureTerminalOperation(e){let t=this.host.client;return this.intentQueue.fenced||!t||t!==this.activeClient||!this.host.available||!this.host.isConnected?null:{generation:this.lifecycleGeneration,client:t,signal:this.lifecycleAbortController.signal,cancelIntent:e}}isTerminalOperationCurrent(e,t,n){return this.host.isConnected&&this.host.available&&this.host.client===e.client&&this.activeClient===e.client&&this.lifecycleGeneration===e.generation&&(!t||this.pendingRestore===t)&&n?.cancelled!==`close`&&!e.signal.aborted}connectionFor(e){if(!this.isTerminalOperationCurrent(e))throw Error(`terminal operation cancelled`);return this.connection??=new Je(e.client),this.connection}disposeTab(e){this.readiness.stop(e),U(e.controller,e.host)}disposeAllTabs(){this.lifecycleGeneration+=1,this.pendingRestore=null,this.intentQueue.resetLifecycle(this.intentHost),this.lifecycleAbortController.abort(),this.lifecycleAbortController=new AbortController,this.bootQueue.reset(),this.error?.retryAction&&this.setError(this.error.text),this.updateControllerState({booting:!1}),this.host.terminalPanelUploadController.dispose();for(let e of this.tabs)e.cancelled=`lifecycle`,this.disposeTab(e);this.updateControllerState({tabs:[],activeId:null}),this.host.resetTerminalSessionPicker(),this.connection?.dispose(),this.connection=null}}})))()}var At;function jt(){return(jt=e((()=>{S(),At=he`
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
`})))()}function Mt(e){return e.status===`connecting`?m(`terminal.connecting`):e.status===`exited`?e.exitReason===`detached`?m(`terminal.detached`):typeof e.exitSignal==`number`&&e.exitSignal>0?m(`terminal.exitedSignal`,{signal:String(e.exitSignal)}):e.exitReason===`process_exit`&&typeof e.exitCode==`number`?m(`terminal.exitedCode`,{code:String(e.exitCode)}):m(`terminal.exited`):null}function Nt(e){return e.map(e=>({id:e.id,label:e.shellName??m(`terminal.tabLabel`,{n:String(e.sequence)}),title:e.agentId===null||e.cwd===null?null:m(`terminal.tabHint`,{agent:e.agentId,cwd:e.cwd}),icon:Ft,statusLabel:Mt(e),badge:e.agentOwned?m(`terminal.agentOwnedBadge`):null,className:`is-${e.status}`}))}function Pt(e){let t=Nt(e.tabs).map(e=>Object.assign(e,{domId:`terminal-tab-${e.id}`,closeLabel:`${m(`terminal.closeSession`)}: ${e.label}`}));return He({tabs:t,activeId:e.activeId,ariaControls:`terminal-tab-panel`,onSelect:e.onSelect,onClose:e.onClose,onNew:e.onNew,newLabel:m(`terminal.newSession`),newDisabled:e.booting})}var Ft;function Z(){return(Z=e((()=>{S(),i(),k(),Ft=_e`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4l3 3-3 3M8 11h5" /></svg>`})))()}var It;function Lt(){return(Lt=e((()=>{S(),It=he`
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
    box-shadow: var(--overlay-shadow);
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
`})))()}function Rt(e){return typeof e==`function`}async function zt(e){let[{createGhosttyTerminal:t,loadGhosttyRuntime:n},r]=await Promise.all([T(()=>import(`./browser-DOhmaakk.js`),__vite__mapDeps([0,1,2,3]),import.meta.url),T(()=>import(`./ghostty-web-Et3EMhT1.js`),__vite__mapDeps([19,1,2,3]),import.meta.url)]),i=await n({module:r}),a=await t({...e,runtime:i,autoFit:!1}),o=a.dispose.bind(a),s=a.terminal,c=new i.FitAddon;c.activate(s);let l;s.attachCustomKeyEventHandler(e=>e.defaultPrevented);let u=we(s)?.handleMouseUp,d=Rt(u)?u:void 0,f=!1;return a.fit=()=>{if(f)return;let e=c.proposeDimensions();e&&(e.cols!==s.cols||e.rows!==s.rows)&&a.resize({columns:e.cols,rows:e.rows})},a.dispose=()=>{f||(f=!0,l?.disconnect(),c.dispose(),d&&=(document.removeEventListener(`mouseup`,d),void 0),o())},e.signal?.aborted?a.dispose():e.autoFit!==!1&&(l=new ResizeObserver(()=>a.fit()),l.observe(e.parent),e.size||a.fit()),a}function Bt(){return(Bt=e((()=>{E()})))()}function Vt(e){return b`<button
    ${de(e.triggerRef)}
    class=${e.hosted?`rail-header__action`:`rail-header__action tp-icon`}
    type="button"
    title=${e.hosted?x:m(`terminal.sessions`)}
    aria-label=${m(`terminal.sessions`)}
    aria-expanded=${e.open?`true`:`false`}
    aria-haspopup="dialog"
    aria-controls=${e.hosted?x:Q}
    @click=${e.onToggle}
    @focusout=${e.onFocusOut}
  >
    ${g.server}
  </button>`}function Ht(e){return b`
    ${e.open?b`<div
            id=${Q}
            class="tp-session-menu ${e.hosted?`tp-session-menu--hosted`:``}"
            @focusout=${e.onFocusOut}
            role="dialog"
            aria-label=${m(`terminal.sessions`)}
            @keydown=${t=>{t.key===`Escape`&&(t.preventDefault(),t.stopPropagation(),e.onDismiss(!0))}}
          >
            <div class="tp-session-menu__header">
              <span>${m(`terminal.sessions`)}</span>
              <button class="tp-session-refresh" type="button" @click=${e.onRefresh}>
                ${m(`terminal.refreshSessions`)}
              </button>
            </div>
            ${e.loading?D(`terminal`,m(`terminal.loadingSessions`),!0):e.sessions.length===0?b`<div class="tp-session-empty">${m(`terminal.noSessions`)}</div>`:e.sessions.map(t=>{let n=e.currentSessionIds.has(t.sessionId),r=`${t.owner?.startsWith(`agent:`)===!0?`${m(`terminal.agentOwnedBadge`)} · `:``}${n?m(`terminal.currentSession`):t.attached?m(`terminal.sessionAttached`):m(`terminal.detached`)}`;return b`<button
                        class="tp-session"
                        type="button"
                        ?disabled=${n}
                        title=${n?r:m(`terminal.attachSession`)}
                        @click=${()=>e.onAttach(t.sessionId,t.owner)}
                      >
                        <span class="tp-session__agent">${t.agentId}</span>
                        <span class="tp-session__cwd">${t.cwd}</span>
                        <span class="tp-session__state">${r}</span>
                      </button>`})}
          </div>`:x}
  `}var Q;function Ut(){return(Ut=e((()=>{S(),fe(),i(),v(),O(),Q=`terminal-session-picker-dialog`})))()}var Wt,$;function Gt(){return(Gt=e((()=>{xe(),De(),ye(),S(),ge(),fe(),ie(),i(),c(),a(),Ie(),n(),le(),ce(),Le(),v(),ze(),re(),k(),oe(),B(),kt(),X(),jt(),Z(),Lt(),z(),Bt(),Ut(),Wt=3e4,$=class extends ne{constructor(){super(),this.client=null,this.agentId=null,this.sessionKey=null,this.available=!1,this.suppressed=!1,this.themeMode=`dark`,this.basePath=``,this.fullscreen=!1,this.embedded=!1,this.tabsInHeader=!1,this.page=!1,this.routeTarget=null,this.sessionPickerOpen=!1,this.pickerSessions=[],this.sessionPickerTrigger=pe(),this.sessionPickerTask=new Oe(this,{autoRun:!1,args:()=>[this.available?this.client:null],task:([e])=>e?this.terminalSessions.listSessions():Te,onComplete:e=>{e!==null&&(this.pickerSessions=e)}}),this.terminalPanelUploadController=new R({activeTab:()=>this.terminalSessions.tabs.find(e=>e.id===this.terminalSessions.activeId&&e.status===`live`&&e.gatewaySessionId),client:()=>this.client,config:()=>this.context?.config,isCurrent:e=>this.terminalSessions.tabs.includes(e)&&e.status===`live`,fileInput:()=>this.renderRoot.querySelector(`.tp-file-input`),setError:e=>this.terminalSessions.setError(e),requestUpdate:()=>this.requestUpdate()}),this.createTerminalController=zt,this.catalogReadyTimeoutMs=Wt,this.terminalSessions=new Ot(this),this.dockLayout=new ae(this,{layout:se,reservationPrefix:`terminal`,isAvailable:()=>this.isDockLayoutAvailable(),isFullscreen:()=>this.fullscreen,onResize:()=>this.terminalSessions.tabs.find(e=>e.id===this.terminalSessions.activeId)?.controller.fit()}),this.themeObserver=null,this.handleToggleRequest=e=>{let t=e instanceof CustomEvent&&typeof e.detail==`object`&&e.detail!==null?e.detail:null,n=t?.dock===`right`||t?.dock===`bottom`?t.dock:null;if(t?.agentId!==void 0&&(this.agentId=t.agentId),n&&this.dockLayout.setDock(n,!1),t?.open===!1){this.closeTerminalPanel();return}if(t?.terminalSessionId||t?.open===!0||t?.newSession===!0){if(!this.available)return;this.dockLayout.setOpen(!0),t.newSession===!0?this.terminalSessions.openSession():t.terminalSessionId?this.terminalSessions.attachSessionById(t.terminalSessionId,!0):this.terminalSessions.restoreSessions();return}this.toggle()},this.handleDocumentPointerDown=e=>{if(!this.sessionPickerOpen)return;let t=this.renderRoot.querySelector(`.tp-session-menu`),n=e.composedPath(),r=this.sessionPickerTrigger.value;!(r&&n.includes(r))&&!(t&&n.includes(t))&&this.closeSessionPicker(!1)},new ee(this).watchStore(()=>this.context?.config,()=>this.terminalPanelUploadController.syncPolicy())}get sessionBottomOnly(){return!this.embedded&&this.sessionKey!==null}connectedCallback(){super.connectedCallback(),this.terminalSessions.connectHost(),this.dockLayout.setSuppressed(this.suppressed),!this.fullscreen&&!this.embedded&&!this.sessionBottomOnly&&window.addEventListener(y,this.handleToggleRequest),!this.fullscreen&&!this.embedded&&window.addEventListener(_,this.handleToggleRequest),document.addEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),typeof MutationObserver<`u`&&(this.themeObserver=new MutationObserver(()=>St(this.terminalSessions.tabs,this.themeMode)),this.themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:[`data-theme`,`data-theme-mode`,`style`]})),this.dockLayout.open&&this.terminalSessions.restoreSessions()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(y,this.handleToggleRequest),window.removeEventListener(_,this.handleToggleRequest),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),this.themeObserver?.disconnect(),this.themeObserver=null,this.terminalSessions.disconnectHost()}updated(e){(e.has(`embedded`)||e.has(`sessionKey`))&&!this.fullscreen&&(this.embedded||this.sessionBottomOnly?window.removeEventListener(y,this.handleToggleRequest):window.addEventListener(y,this.handleToggleRequest),this.embedded?window.removeEventListener(_,this.handleToggleRequest):window.addEventListener(_,this.handleToggleRequest)),e.has(`suppressed`)&&this.dockLayout.setSuppressed(this.suppressed)&&this.terminalSessions.restoreSessions(),(e.has(`client`)||e.has(`available`))&&this.terminalSessions.scheduleLifecycleSync(),e.has(`themeMode`)&&St(this.terminalSessions.tabs,this.themeMode),e.has(`embedded`)&&this.embedded&&this.terminalSessions.restoreSessions(),(this.embedded||this.dockLayout.open)&&Ct(this.terminalSessions.tabs,this.terminalSessions.activeId,this.findTerminalPanelViewport()),this.dockLayout.syncReservation();let t=JSON.stringify([this.embedded&&this.tabsInHeader,this.terminalSessions.activeId,this.hostedTabs.map(({id:e,label:t,statusLabel:n,badge:r,className:i})=>[e,t,n,r,i]),this.terminalSessions.booting,this.sessionPickerOpen,this.sessionPickerTask.status,this.pickerSessions.map(e=>e.sessionId),this.terminalPanelUploadController.uploadsEnabled(),this.terminalPanelUploadController.hasPendingBatch(),this.terminalPanelUploadController.hasActiveTab()]);t!==this.lastHostedTabsChangeKey&&(this.lastHostedTabsChangeKey=t,this.dispatchEvent(new CustomEvent(Be,{bubbles:!0,composed:!0})))}get hostedTabs(){return Nt(this.terminalSessions.tabs)}get activeHostedTabId(){return this.terminalSessions.activeId}selectHostedTab(e){this.terminalSessions.switchTo(e)}async closeHostedTab(e){this.terminalSessions.closeTab(e),await this.updateComplete}get hostedActions(){if(!this.embedded||!this.tabsInHeader)return x;let e=this.terminalPanelUploadController;return b`
      <openclaw-tooltip .content=${m(`terminal.sessions`)}>
        ${Vt(this.sessionPickerProps)}
      </openclaw-tooltip>
      ${e.uploadsEnabled()?b`<openclaw-tooltip .content=${m(`terminal.addFiles`)}>
              <button
                class="rail-header__action"
                type="button"
                aria-label=${m(`terminal.addFiles`)}
                ?disabled=${!e.hasActiveTab()||e.hasPendingBatch()}
                @click=${e.chooseFiles}
              >
                ${g.paperclip}
              </button>
            </openclaw-tooltip>`:x}
      <openclaw-tooltip .content=${m(`terminal.dockBottom`)}>
        <button
          class="rail-header__action"
          type="button"
          aria-label=${m(`terminal.dockBottom`)}
          @click=${()=>this.setDock(`bottom`)}
        >
          ${g.panelBottomOpen}
        </button>
      </openclaw-tooltip>
    `}toggle(){this.available&&(this.dockLayout.open?this.closeTerminalPanel():(this.dockLayout.setOpen(!0),this.terminalSessions.restoreSessions()))}closeTerminalPanel(){this.closeSessionPicker(!1),this.terminalSessions.cancelPendingActions(),this.dockLayout.setOpen(!1)}get terminalPanelOpen(){return this.embedded?this.available:this.dockLayout.open&&this.isDockLayoutAvailable()}hideTerminalPanelForUnavailableSurface(){this.dockLayout.hideWithoutPersisting()}restoreTerminalPanelOpenState(){return this.dockLayout.restoreOpenState()}isDockLayoutAvailable(){return this.available&&(!this.sessionBottomOnly||this.dockLayout.dock===`bottom`)}toggleSessionPicker(){if(this.sessionPickerOpen){this.closeSessionPicker(!0);return}this.sessionPickerOpen=!0,this.sessionPickerTask.run(),this.updateComplete.then(()=>{this.sessionPickerOpen&&this.renderRoot.querySelector(`.tp-session-refresh`)?.focus()})}closeSessionPicker(e){this.sessionPickerOpen&&(this.sessionPickerOpen=!1,e&&this.updateComplete.then(()=>{this.sessionPickerTrigger.value?.focus()}))}handleSessionPickerFocusOut(e){let t=e=>e instanceof Node&&(e===this.sessionPickerTrigger.value||this.renderRoot.querySelector(`.tp-session-menu`)?.contains(e));t(e.relatedTarget)||queueMicrotask(()=>{!t(this.shadowRoot?.activeElement??document.activeElement)&&this.sessionPickerOpen&&this.closeSessionPicker(!1)})}async attachPickedSession(e,t){this.sessionPickerOpen=!1,await this.terminalSessions.attachSessionById(e,t?.startsWith(`agent:`)===!0)}setDock(e){if(this.embedded&&e===`bottom`){window.dispatchEvent(new CustomEvent(_,{detail:{agentId:this.agentId,dock:`bottom`,open:!0}}));return}this.dockLayout.setDock(e),this.updateComplete.then(()=>{for(let e of this.terminalSessions.tabs)e.controller.fit()})}openFullscreen(){let e=ve({kind:`terminal`},this.basePath);e&&u(e)}resetTerminalSessionPicker(){this.closeSessionPicker(!1),this.sessionPickerTask.run([null]),this.pickerSessions=[]}findTerminalPanelViewport(){return this.renderRoot.querySelector(`.tp-viewport`)}get sessionPickerProps(){return{hosted:this.embedded&&this.tabsInHeader,triggerRef:this.sessionPickerTrigger,open:this.sessionPickerOpen,loading:this.sessionPickerTask.status===Ee.PENDING,sessions:this.pickerSessions,currentSessionIds:new Set(this.terminalSessions.tabs.map(e=>e.gatewaySessionId).filter(e=>e.length>0)),onToggle:()=>this.toggleSessionPicker(),onDismiss:e=>this.closeSessionPicker(e),onFocusOut:e=>this.handleSessionPickerFocusOut(e),onRefresh:()=>void this.sessionPickerTask.run(),onAttach:(e,t)=>void this.attachPickedSession(e,t)}}render(){if(!this.terminalPanelOpen)return x;let e=this.embedded?`embedded`:this.fullscreen?`fullscreen`:this.dockLayout.dock,t=this.embedded||this.fullscreen||this.dockLayout.dock===`main`?x:this.dockLayout.dock===`bottom`?`height:${this.dockLayout.height}px;--tp-panel-height:${this.dockLayout.height}px`:`width:${this.dockLayout.width}px`,n=this.terminalSessions.tabs.find(e=>e.id===this.terminalSessions.activeId),r=this.terminalSessions.waitingForRefresh||this.terminalSessions.booting&&this.terminalSessions.tabs.length===0||n?.status===`connecting`,i=this.terminalSessions.error?{text:this.terminalSessions.error.text,retry:this.terminalSessions.error.retryAction?()=>this.terminalSessions.retryOpen():void 0}:null,a=this.embedded&&this.tabsInHeader,o=this.sessionPickerProps,s=b`<div class="tp-session-picker">
      ${Vt(o)} ${Ht(o)}
    </div>`,c=rt({fullscreen:this.fullscreen,embedded:this.embedded,dock:this.dockLayout.dock,upload:this.terminalPanelUploadController,sessionPicker:s,onDock:e=>this.setDock(e),onOpenFullscreen:()=>this.openFullscreen(),onHide:()=>this.closeTerminalPanel()});return b`
      <section class="tp tp--${e}" style=${t} aria-label=${m(`terminal.title`)}>
        ${this.embedded?x:this.dockLayout.renderResizer(`tp`,m(`terminal.resize`))}
        ${a?Ht(o):b`<header class="rail-header tp-header">
                ${Pt({tabs:this.terminalSessions.tabs,activeId:this.terminalSessions.activeId,booting:this.terminalSessions.booting,onSelect:e=>this.terminalSessions.switchTo(e),onClose:e=>this.closeHostedTab(e),onNew:()=>void this.terminalSessions.openSession()})}
                ${c}
              </header>`}
        ${at({activeId:this.terminalSessions.activeId,tabsInHeader:a,connecting:r,error:i,uploadController:this.terminalPanelUploadController})}
      </section>
    `}willUpdate(){for(let e of this.terminalSessions.tabs)e.host.style.display=e.id===this.terminalSessions.activeId?`block`:`none`}static{this.styles=[Ve,Re,At,It,Fe]}},w([be({context:ue,subscribe:!0})],$.prototype,`context`,void 0),w([C({attribute:!1})],$.prototype,`client`,void 0),w([C({attribute:!1})],$.prototype,`agentId`,void 0),w([C({attribute:!1})],$.prototype,`sessionKey`,void 0),w([C({type:Boolean})],$.prototype,`available`,void 0),w([C({type:Boolean})],$.prototype,`suppressed`,void 0),w([C({attribute:!1})],$.prototype,`themeMode`,void 0),w([C({attribute:!1})],$.prototype,`basePath`,void 0),w([C({type:Boolean})],$.prototype,`fullscreen`,void 0),w([C({type:Boolean})],$.prototype,`embedded`,void 0),w([C({type:Boolean})],$.prototype,`tabsInHeader`,void 0),w([C({type:Boolean})],$.prototype,`page`,void 0),w([C({attribute:!1})],$.prototype,`routeTarget`,void 0),w([me()],$.prototype,`sessionPickerOpen`,void 0),w([me()],$.prototype,`pickerSessions`,void 0)})))()}var Kt=t({});function qt(){return(qt=e((()=>{Gt(),customElements.get(`openclaw-terminal-panel`)||customElements.define(`openclaw-terminal-panel`,$)})))()}export{Kt as n,qt as t};
//# sourceMappingURL=terminal-panel-registration-BKnPLjVl.js.map