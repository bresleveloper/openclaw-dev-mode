import{n as e,r as t}from"./rolldown-runtime-8BhlS34s.js";import{Ac as n,Co as r,Eu as i,Iu as a,Lu as o,No as s,Sl as c,Tu as l,_l as u,bu as d,du as f,fu as p,ju as m,kc as h,pu as g,wu as _}from"./control-ui-core-bJHyI7AF.js";import{M as v,N as y,Zr as b,_i as x,aa as S,ai as C,ia as w,na as T,ra as E,vi as ee}from"./control-ui-core-DNh4McGE.js";import{$ as D,X as O,Y as k,ct as A,mt as j,nt as te,tt as M,ut as N}from"./lit-runtime-DyST807n.js";import{_a as ne,ii as P,oa as re,sa as ie,ta as F}from"./ui-DeikvIdP.js";import{Cc as ae,wc as oe}from"./control-ui-boot-shared-C1PHuQAX.js";import{f as se,m as ce}from"./control-ui-boot-chat-HWH89scD.js";import{dt as I,ft as L,ht as R,mt as le,pt as ue}from"./control-ui-boot-chat-DfNf0poH.js";import{n as de,t as fe}from"./scrollbar-styles-D8VGVDiV.js";import{n as pe,t as me}from"./dock-panel-styles-CIuTBK0T.js";import{n as z}from"./gateway-websocket-url-cYJwVUmD.js";import{n as he,t as ge}from"./reasoned-disabled-control-DOelYLrp.js";import{n as _e,t as ve}from"./desktop-focus-window-By3mA_O2.js";var B,V;function H(){return(H=e((()=>{o(),B={desktop:{title:a.desktop.title,openWindow:a.desktop.openWindow,unavailable:a.desktop.unavailable,toggle:a.desktop.toggle,hide:`Hide desktop panel`,resize:`Resize desktop panel`,dockBottom:`Dock to bottom`,dockRight:`Dock to right`,enterFullscreen:`Enter fullscreen`,exitFullscreen:`Exit fullscreen`,fullscreenUnavailable:`Fullscreen is unavailable in this browser`,enterPictureInPicture:`Open desktop in Picture-in-Picture`,exitPictureInPicture:`Close Picture-in-Picture`,pictureInPictureTitle:`Desktop — view-only Picture-in-Picture`,pictureInPictureUnavailable:`Picture-in-Picture requires a supported browser and a secure connection`,pickerTitle:`Desktop sources`,thisMachine:`This machine`,refresh:`Refresh`,refreshing:`Refreshing…`,loading:`Loading desktop sources…`,empty:`No desktop-capable sources are available.`,sourceUnavailable:`The requested desktop is unavailable. Retry when the machine is ready.`,macLocked:`This Mac is locked. Sign in through Screen Sharing or on the Mac to use computer control.`,macLockStateUnknown:`This Mac’s lock state is unknown. Check the desktop before using computer control; Screen Sharing remains available for sign-in.`,connect:`Connect`,connecting:a.desktop.connecting,starting:`Starting your machine…`,preparing:`Preparing the desktop…`,takeControl:`Take control`,switchToViewOnly:`Switch to view only`,viewOnly:`View only`,control:`Control`,audio:{unavailable:`Audio unavailable`,setupUnavailable:`Desktop audio setup is unavailable. Ask the operator to check that pulseaudio and pulseaudio-utils are installed, then restart the managed desktop.`,reconnect:`Reconnect desktop for audio`,connecting:`Connecting desktop audio…`,unmute:`Unmute desktop audio`,mute:`Mute desktop audio`,blocked:`Audio playback was blocked. Allow sound for this site, then click Unmute desktop audio again.`,unsupported:`Desktop audio requires a browser with Web Audio support. Try a current browser.`,failed:`Desktop audio disconnected or could not start. Reconnect the desktop to try again.`},keyboard:`Keyboard`,keyboardInput:`Remote desktop keyboard input`,touchControls:`Remote desktop controls`,fit:`Fit`,actual:`Actual`,match:`Match`,sizing:`Desktop size`,matchRequirement:`Match requires a VNC server that supports desktop resizing.`,fitScreen:`Fit screen`,actualSize:`Use actual size`,back:`Back`,disconnect:`Disconnect`,reconnect:a.desktop.reconnect,passwordPrompt:`Enter the VNC password for this machine.`,passwordLabel:`VNC password`,accountPrompt:`Enter a macOS account allowed in System Settings → General → Sharing. Remote Management also requires Observe/Control permissions.`,usernameLabel:`macOS username`,accountPasswordLabel:`macOS password`,controlTaken:`Another operator took control`,controlTakenBy:`{operator} took control`,disconnected:`Desktop disconnected: {reason}`,disconnectedClean:`Desktop disconnected`,closeCode:`connection closed with code {code}`,unknownReason:`unknown reason`,errors:{pictureInPictureFailed:`Could not open or update Picture-in-Picture. Check browser permissions and try again from the desktop viewer.`,listFailed:`Could not load desktop sources: {error}`,fullscreenFailed:`Could not change fullscreen mode: {error}`,securityFailed:`Desktop security negotiation failed: {reason}`,connectionFailed:`Reconnect. If it fails again, check the browser console and desktop service logs.`}}},V=Object.assign(()=>Object.assign(a.desktop,B.desktop),{catalog:B})})))()}var U;function W(){return(W=e((()=>{k(),E(),U=class{constructor(e,t){this.host=e,this.options=t,this.active=!1,this.errorText=null,this.restoreFocus=!1,this.onFullscreenChange=()=>{let e=this.active;this.active=this.ownsFullscreen(),this.options.onChange(),this.host.requestUpdate(),e&&!this.active&&this.restoreFocus&&this.host.updateComplete.then(()=>{this.host.renderRoot.querySelector(this.options.buttonSelector)?.focus(),this.restoreFocus=!1})},e.addController(this)}hostConnected(){document.addEventListener(`fullscreenchange`,this.onFullscreenChange)}hostDisconnected(){document.removeEventListener(`fullscreenchange`,this.onFullscreenChange),this.restoreFocus=!1,this.ownsFullscreen()&&document.exitFullscreen().catch(()=>{})}renderButton(){let e=this.supported(),t=this.active?this.options.exitLabel():e?this.options.enterLabel():this.options.unavailableLabel();return D`<openclaw-tooltip .content=${t}>
      <button
        class=${this.options.buttonClass}
        type="button"
        aria-label=${t}
        aria-pressed=${this.active?`true`:`false`}
        aria-disabled=${e?`false`:`true`}
        @click=${()=>void this.toggle()}
      >
        <span class=${this.options.iconClass} aria-hidden="true">
          ${this.active?T.minimize:T.maximize}
        </span>
      </button>
    </openclaw-tooltip>`}async exit(){if(this.active)try{await document.exitFullscreen()}catch(e){this.setError(this.options.errorMessage(e))}}ownsFullscreen(){let e=this.options.section();return e?((this.host.renderRoot instanceof ShadowRoot?this.host.renderRoot.fullscreenElement:null)??document.fullscreenElement)===e:!1}supported(){return document.fullscreenEnabled&&typeof Element.prototype.requestFullscreen==`function`}async toggle(){if(this.setError(null),this.active){await this.exit();return}let e=this.options.section();if(!e||!this.supported()){this.setError(this.options.unavailableLabel());return}this.restoreFocus=!0;try{await e.requestFullscreen()}catch(e){this.restoreFocus=!1,this.setError(this.options.errorMessage(e))}}setError(e){this.errorText=e,e&&this.options.onError?.(e),this.host.requestUpdate()}}})))()}var G;function ye(){return(ye=e((()=>{g(),G=class{constructor(e,t){this.host=e,this.target=t,this.app=null,this.error=null,this.operationId=0}clear(){this.operationId+=1,this.app=null,this.error=null,this.host.requestUpdate()}async launch(e){let{client:t,source:n,presented:r,state:i,apps:a}=this.target();if(!t||!r||n?.kind!==`environment`||i!==`connecting`&&i!==`connected`||!a.includes(e)||this.app===e)return;let o=++this.operationId;this.app=e,this.error=null,this.host.requestUpdate();try{await t.request(`desktop.launch`,{source:n,app:e})}catch(e){if(o!==this.operationId)return;this.error=f(e)}o===this.operationId&&(this.app=null,this.host.requestUpdate())}}})))()}function be(e){let t=e.state===`playing`||e.state===`starting`,n=e.state===`unavailable`||e.state===`setup-unavailable`||e.state===`unsupported`||e.state===`error`,r=m(e.state===`retired`?`desktop.audio.reconnect`:e.state===`unavailable`||e.state===`setup-unavailable`?`desktop.audio.unavailable`:e.state===`unsupported`?`desktop.audio.unsupported`:e.state===`error`?`desktop.audio.failed`:e.state===`connecting`?`desktop.audio.connecting`:t?`desktop.audio.mute`:`desktop.audio.unmute`),i=e.state===`setup-unavailable`,a=!e.connected||n||e.state===`connecting`;return he(i?m(`desktop.audio.setupUnavailable`):null,D`<button
      class=${(e.documentMode?`desktop-touch-action`:`desktop-toolbar-action`)+` desktop-audio-button`}
      type="button"
      title=${i?O:r}
      aria-label=${r}
      aria-pressed=${t?`true`:`false`}
      aria-busy=${e.state===`starting`||e.state===`connecting`?`true`:`false`}
      aria-disabled=${i?`true`:O}
      ?disabled=${a&&!i}
      @click=${()=>{a||e.onToggle()}}
    >
      ${t?Ce:Se}
      <span class="desktop-audio-label"
        >${m(e.state===`retired`?`desktop.audio.reconnect`:n?`desktop.audio.unavailable`:t?`desktop.audio.mute`:`desktop.audio.unmute`)}</span
      >
    </button>`)}function xe(e){let t=e===`blocked`?m(`desktop.audio.blocked`):e===`unsupported`?m(`desktop.audio.unsupported`):e===`error`?m(`desktop.audio.failed`):null;return t?D`<div class="desktop-note desktop-note--error" role="alert">${t}</div>`:O}var K,Se,Ce;function we(){return(we=e((()=>{k(),i(),H(),w(),ge(),V(),K=M`<polygon points="11 5 6 9 3 9 3 15 6 15 11 19 11 5" />`,Se=S(M`${K}<path d="m17 9 6 6m0-6-6 6" />`),Ce=S(M`${K}<path d="M15.5 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13" />`)})))()}var q,J,Te,Ee,De;function Oe(){return(Oe=e((()=>{q=48e3,J=4,Te=q/4,Ee=32,De=class{constructor(e){this.context=e,this.remainder=new Uint8Array,this.playhead=0,this.sources=new Map}play(e){let t=this.remainder.length+e.length,n=t-t%J,r=t=>t<this.remainder.length?this.remainder[t]:e[t-this.remainder.length],i=new Uint8Array(t-n);for(let e=0;e<i.length;e+=1)i[e]=r(n+e);let a=Math.min(n/J,Te);if(a===0){this.remainder=i;return}let o=new Uint8Array(a*J),s=n-o.length;for(let e=0;e<o.length;e+=1)o[e]=r(s+e);this.remainder=i;let c=this.context.currentTime,l=a/q;(Math.max(c,this.playhead)+l-c>.25||this.sources.size>=Ee)&&this.clearSources();let u=this.context.createBuffer(2,a,q),d=new DataView(o.buffer);for(let e=0;e<2;e+=1){let t=u.getChannelData(e);for(let n=0;n<a;n+=1)t[n]=d.getInt16(n*J+e*2,!0)/32768}let f=this.context.createBufferSource(),p=()=>{this.sources.delete(f)&&(f.removeEventListener(`ended`,p),f.disconnect())};this.sources.set(f,p),f.addEventListener(`ended`,p),f.buffer=u,f.connect(this.context.destination);let m=Math.max(c,this.playhead);f.start(m),this.playhead=m+l}stop(){this.remainder=new Uint8Array,this.clearSources()}clearSources(){let e=[...this.sources];this.sources.clear(),this.playhead=this.context.currentTime;for(let[t,n]of e){t.removeEventListener(`ended`,n);try{t.stop()}catch{}t.disconnect()}}}})))()}var ke,Ae;function je(){return(je=e((()=>{we(),Oe(),ke=48e3,Ae=class{constructor(e,t,n){this.host=e,this.connected=t,this.reconnect=n,this.state=`unavailable`,this.socket=null,this.removeSocketListeners=null,this.visibilityDocument=null,this.context=null,this.queue=null,this.generation=0,this.intent=0,this.pendingStops=0,this.startReady=!1,this.startRequested=!1,this.onVisibilityChange=()=>{this.host.ownerDocument.hidden&&this.retire()},e.addController(this)}hostConnected(){this.visibilityDocument=this.host.ownerDocument,this.visibilityDocument.addEventListener(`visibilitychange`,this.onVisibilityChange)}hostDisconnected(){this.visibilityDocument?.removeEventListener(`visibilitychange`,this.onVisibilityChange),this.visibilityDocument=null,this.close()}get visible(){return!this.host.ownerDocument.hidden&&(!this.host.embedded||this.host.presented)}renderButton(){return be({state:this.state,connected:this.connected(),documentMode:this.host.documentMode,onToggle:()=>{this.state===`playing`||this.state===`starting`?this.mute():this.state===`retired`?this.reconnect():this.connected()&&this.visible&&this.unmute()}})}renderNotice(){return xe(this.state)}connect(e,t){this.close();let n=e.audio;if(!n){e.audioUnavailableReason===`setup-unavailable`&&this.setState(`setup-unavailable`);return}if(!this.visible){this.retire(!0);return}if(typeof AudioContext!=`function`){this.setState(`unsupported`);return}let r=this.generation;this.pendingStops=0;try{let e=new WebSocket(z(n.wsPath,t));this.socket=e,e.binaryType=`arraybuffer`;let i=()=>r===this.generation&&this.socket===e,a=()=>{i()&&this.setState(`muted`)},o=e=>{if(i()){if(typeof e.data==`string`)this.handleStatus(e.data);else if(e.data instanceof ArrayBuffer&&this.state===`playing`){if(this.context?.state!==`running`){this.stop(`blocked`);return}try{this.queue?.play(new Uint8Array(e.data))}catch{this.stop(`error`)}}}},s=()=>{i()&&(this.close(),this.setState(`error`))};this.removeSocketListeners=()=>{e.removeEventListener(`open`,a),e.removeEventListener(`message`,o),e.removeEventListener(`error`,s),e.removeEventListener(`close`,s)},e.addEventListener(`open`,a),e.addEventListener(`message`,o),e.addEventListener(`error`,s),e.addEventListener(`close`,s),this.setState(`connecting`)}catch{this.close(),this.setState(`error`)}}unmute(){let e=this.socket;if(!e||e.readyState!==WebSocket.OPEN||this.state===`starting`||this.state===`playing`)return;let t=this.generation,n=++this.intent;try{let e=new AudioContext({latencyHint:`interactive`,sampleRate:ke});this.context=e;let r=e.resume();this.setState(`starting`),r.then(()=>{if(t===this.generation&&n===this.intent&&this.context===e){if(e.state!==`running`){this.stop(`blocked`);return}this.startReady=!0,this.startCapture()}},()=>{t===this.generation&&n===this.intent&&this.stop(`blocked`)})}catch{this.stop(`blocked`)}}mute(){this.stop(`muted`)}retire(e=this.state!==`unavailable`&&this.state!==`setup-unavailable`){let t=this.state===`setup-unavailable`;this.close(),t&&!e&&this.setState(`setup-unavailable`),e&&this.setState(`retired`)}close(){++this.generation,this.stop(`unavailable`);let e=this.socket;this.socket=null,this.removeSocketListeners?.(),this.removeSocketListeners=null,e?.close()}stop(e){++this.intent,this.startReady=!1,this.startRequested=!1,this.queue?.stop(),this.queue=null;let t=this.context;if(this.context=null,t&&t.close().catch(()=>void 0),this.socket?.readyState===WebSocket.OPEN)try{this.pendingStops+=1,this.socket.send(JSON.stringify({action:`stop`}))}catch{}this.setState(e)}startCapture(){let e=this.socket;if(!(!e||!this.startReady||this.pendingStops>0)){this.startReady=!1,this.startRequested=!0;try{e.send(JSON.stringify({action:`start`}))}catch{this.stop(`error`)}}}handleStatus(e){let t;try{t=JSON.parse(e)}catch{return}if(typeof t==`object`&&t&&`state`in t){if(this.pendingStops>0){t.state===`stopped`&&(--this.pendingStops,this.startCapture());return}if(t.state===`started`&&this.state===`starting`&&this.startRequested){if(this.startRequested=!1,this.context?.state!==`running`){this.stop(`blocked`);return}this.queue=new De(this.context),this.setState(`playing`)}else(this.state===`starting`||this.state===`playing`)&&(t.state===`error`||t.state===`stopped`)&&this.stop(`error`)}}setState(e){this.state=e,this.host.requestUpdate()}}})))()}var Me,Ne;function Pe(){return(Pe=e((()=>{d(),ie(),Me=async()=>(await re(()=>import(`./novnc-DviyAnH8.js`),[],import.meta.url)).default,Ne=class{constructor(e,t=e=>new WebSocket(e),n=Me){this.rfbConstructor=e,this.createWebSocket=t,this.loadRfb=n}async connect(e){let t=this.rfbConstructor??await this.loadRfb(),n=z(e.wsUrl,e.gatewayUrl);if(!e.isCurrent())throw new DOMException(`Desktop connection is no longer current`,`AbortError`);let r=this.createWebSocket(n),i;r.addEventListener(`close`,e=>{i={code:e.code,reason:e.reason}});let a=new t(e.target,r,e.credentials?{credentials:e.credentials}:void 0);a.background=e.background??getComputedStyle(e.target).backgroundColor,a.viewOnly=e.viewOnly,a.resizeSession=!1;let o=!1,s=!1,c=!0,l=!1,u=e.sizingMode??`fit`,d=t=>{e.target.querySelector(`canvas`)?.dispatchEvent(t)},f=(e,t=e.type)=>new KeyboardEvent(t,{key:e.key,code:e.code,location:e.location,ctrlKey:e.ctrlKey,shiftKey:e.shiftKey,altKey:e.altKey,metaKey:e.metaKey,repeat:e.repeat,isComposing:e.isComposing,bubbles:!0,cancelable:!0}),p=new Map,m=new Set,h=e=>{let t=e.code||e.key;!a.viewOnly&&!o&&t!==`Unidentified`&&!(t===`CapsLock`&&F())&&p.set(t,e)},g=e=>p.delete(e.code||e.key),_=()=>p.clear(),v=()=>{for(let e of p.values())d(f(e,`keyup`));p.clear()},y=e=>m.add(e.pointerId),b=e=>m.delete(e.pointerId);e.target.addEventListener(`keydown`,h,!0),e.target.addEventListener(`keyup`,g,!0),e.target.addEventListener(`pointerdown`,y,!0),window.addEventListener(`pointerup`,b,!0),window.addEventListener(`pointercancel`,b,!0),window.addEventListener(`blur`,_);let x=()=>{e.target.removeEventListener(`keydown`,h,!0),e.target.removeEventListener(`keyup`,g,!0),e.target.removeEventListener(`pointerdown`,y,!0),window.removeEventListener(`pointerup`,b,!0),window.removeEventListener(`pointercancel`,b,!0),window.removeEventListener(`blur`,_),p.clear(),m.clear()},S=()=>{v(),s=!0,a.resizeSession=!1,a.viewOnly=!0},C=()=>{a.resizeSession=!1,!o&&e.isCurrent()&&(a.scaleViewport=u!==`actual`,a.resizeSession=c&&l&&!a.viewOnly&&e.canResize===!0&&u===`match`)};return C(),a.addEventListener(`connect`,()=>{if(o||!e.isCurrent()){S();return}l=!0,e.onConnect?.(),C()}),a.addEventListener(`disconnect`,t=>{o=!0,S(),x();let{clean:n}=t.detail;e.onDisconnect?.({...i,clean:n})}),a.addEventListener(`securityfailure`,t=>{S();let n=t.detail??{};e.onSecurityFailure?.(n)}),{disconnect:()=>{o||(o=!0,S(),x(),a.disconnect())},disableInput:S,setPresented:t=>(c=t,o||s||!e.isCurrent()||!c&&m.size>0?!1:(c||v(),a.resizeSession=!1,a.viewOnly=!c||e.viewOnly,C(),!0)),setSizingMode:e=>{u=e,C()},sendKeyboardEvent:e=>d(f(e)),sendText:e=>{let t=e.replace(/\r\n?/g,`
`);for(let e of t){if(e.length===2){a.sendKey(16777216|e.codePointAt(0),null);continue}d(new KeyboardEvent(`keydown`,{key:e===`
`?`Enter`:e,code:`Unidentified`,bubbles:!0,cancelable:!0}))}},sendBackspace:()=>a.sendKey(65288,`Backspace`)}}}})))()}var Y,Fe;function Ie(){return(Ie=e((()=>{d(),Y=`________________`,Fe=class{constructor(e){this.options=e,this.value=Y,this.modifierConnection=null,this.modifiers=new Map,this.clearModifiers=()=>{this.modifiers.clear(),window.removeEventListener(`blur`,this.clearModifiers),window.removeEventListener(`keyup`,this.handleWindowKeyup,!0)},this.handleWindowKeyup=e=>{if(!e.isTrusted||e.composedPath()[0]===this.options.input())return;let t=this.currentConnection();t&&this.modifiers.delete(e.code)&&(this.modifiers.size===0&&this.clearModifiers(),t.sendKeyboardEvent(e))}}focus(e){let t=this.currentConnection();e&&t&&this.reconcileModifiers(e,t);let n=this.options.input();n?.focus({preventScroll:!0}),n?.setSelectionRange(n.value.length,n.value.length)}reset(e){e||(this.clearModifiers(),this.modifierConnection=null),this.value=Y;let t=e??this.options.input();t&&(t.value=Y)}handleKeyboardEvent(e){let t=this.currentConnection();t&&(e.type===`keydown`&&this.reconcileModifiers(e,t),!(!e.isComposing&&!e.altKey&&(F()?e.metaKey&&!e.ctrlKey:e.ctrlKey&&!e.metaKey)&&e.key.toLowerCase()===`v`)&&([`Meta`,`Control`,`Shift`,`Alt`].includes(e.key)&&(e.type===`keydown`?(this.modifiers.set(e.code,e),window.addEventListener(`blur`,this.clearModifiers,{once:!0}),window.addEventListener(`keyup`,this.handleWindowKeyup,!0)):(this.modifiers.delete(e.code),this.modifiers.size===0&&this.clearModifiers())),t.sendKeyboardEvent(e),e.preventDefault()))}handleInput(e){let t=e.currentTarget,n=this.currentConnection();if(!n){this.reset(t);return}let r=t.value,i=e.inputType===`insertFromPaste`?[...this.modifiers.values()]:[];for(let e of i)n.sendKeyboardEvent(new KeyboardEvent(`keyup`,e));let a=0;for(let e of this.value){if(!r.startsWith(e,a))break;a+=e.length}for(let e=Array.from(this.value.slice(a)).length;e>0;--e)n.sendBackspace();n.sendText(r.slice(a));for(let e of i)n.sendKeyboardEvent(e);if(r.length<1||r.length>32){this.reset(t);return}this.value=r}reconcileModifiers(e,t){if(e.isTrusted){for(let[n,r]of this.modifiers)e.getModifierState(r.key)||(this.modifiers.delete(n),t.sendKeyboardEvent(new KeyboardEvent(`keyup`,r)));this.modifiers.size===0&&this.clearModifiers()}}currentConnection(){let e=this.options.controlling()?this.options.connection():null;return e!==this.modifierConnection&&(this.clearModifiers(),this.modifierConnection=e),e}}})))()}function Le(e,t){e.request(`desktop.release`,{wsPath:t}).catch(()=>void 0)}var Re;function ze(){return(ze=e((()=>{Re=class{constructor(){this.current=null,this.retained=null,this.connected=!1,this.hiddenTimer=null}get handle(){return this.connected?this.current:null}begin(e){this.clearHiddenTimer();let t=e?this.connected?this.current:this.retained:null,n=this.current,r=this.retained;this.current=null,this.retained=t,this.connected=!1;let i=this.abandonObservation;this.abandonObservation=void 0,i?.(),n!==t&&n?.disconnect(),r!==t&&r?.disconnect(),t?.disableInput()}setPresented(e,t){let n=this.hiddenTimer!==null;return this.clearHiddenTimer(),e?(n&&this.current?.setPresented(!0),!n):(this.handle?.setPresented(!1)?this.hiddenTimer=setTimeout(t,3e4):t(),!1)}clearHiddenTimer(){this.hiddenTimer!==null&&(clearTimeout(this.hiddenTimer),this.hiddenTimer=null)}attach(e){this.current=e}retainObservation(e){this.abandonObservation=e}setSizingMode(e){this.current?.setSizingMode(e)}markConnected(){this.abandonObservation=void 0,this.connected=!0;let e=this.retained;this.retained=null,e?.disconnect()}disconnect(){this.begin(!1)}}})))()}function Be(e,t){let n=e.get(`password`);if(typeof n!=`string`||n.length===0)return;let r=e.get(`username`);if(t!==`ard-account`||typeof r==`string`&&r.trim().length!==0)return{...typeof r==`string`&&r.trim()?{username:r.trim()}:{},password:n}}function Ve(e,t,n){return e.kind!==`environment`&&n?.password&&(t===`vnc-password`||t===`ard-account`&&n.username)?n:void 0}function He(e,t){let n=e.preauthenticated?void 0:e.vncPassword?{password:e.vncPassword}:e.auth===`vnc-password`?t:void 0;return e.auth===`vnc-password`&&e.preauthenticated!==!0&&!n?.password?{phase:`credentials`,auth:`vnc-password`,credentials:n}:{phase:`ready`,auth:e.auth===`ard-account`?`ard-account`:void 0,credentials:n}}function Ue(e){if(!e||typeof e!=`object`||!(`details`in e))return null;let t=e.details;if(!t||typeof t!=`object`||!(`code`in t)||t.code!==We)return null;let n=`auth`in t?t.auth:void 0;return n===`vnc-password`||n===`ard-account`?n:null}var We;function Ge(){return(Ge=e((()=>{We=`DESKTOP_CREDENTIALS_REQUIRED`})))()}var Ke;function qe(){return(qe=e((()=>{k(),Ke=j`
  /* The inset sizes this to the viewport on its own. Do not reintroduce viewport
     height units: Android WebView hosts the Control UI in a container that
     resolves dvh/vh/svh/lvh to 0, which collapses the viewer to a blank page. */
  .desktop-document {
    position: fixed;
    inset: 0;
    display: flex;
    overflow: hidden;
    box-sizing: border-box;
    background: var(--bg);
  }
  .desktop-document .desktop-content {
    width: 100%;
  }
  .desktop-document .desktop-stage {
    width: 100%;
  }
  .desktop-touch-toolbar {
    position: absolute;
    z-index: 3;
    right: 12px;
    bottom: max(12px, env(safe-area-inset-bottom));
    left: 12px;
    display: flex;
    box-sizing: border-box;
    width: max-content;
    max-width: calc(100% - 24px);
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin: 0 auto;
    padding: 5px;
    border: 1px solid color-mix(in srgb, var(--text) 16%, transparent);
    border-radius: 14px;
    background: color-mix(in srgb, var(--bg) 84%, transparent);
    box-shadow: var(--overlay-shadow);
    backdrop-filter: blur(16px);
  }
  .desktop-touch-action {
    display: inline-flex;
    min-width: 48px;
    height: 44px;
    align-items: center;
    justify-content: center;
    gap: 5px;
    border: 0;
    border-radius: 10px;
    padding: 0 9px;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 11px;
  }
  .desktop-touch-action[aria-pressed="true"] {
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) 16%, transparent);
  }
  .desktop-touch-action:focus-visible {
    outline: 2px solid var(--focus, var(--accent));
    outline-offset: 1px;
  }
  .desktop-touch-action > svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
  .desktop-touch-action__icon {
    display: inline-flex;
    width: 18px;
    height: 18px;
  }
  .desktop-touch-action__icon svg {
    width: 100%;
    height: 100%;
    stroke-width: 1.8;
  }
  .desktop-keyboard-input {
    position: fixed;
    bottom: 0;
    left: 50%;
    width: 1px;
    height: 1px;
    border: 0;
    padding: 0;
    opacity: 0;
    pointer-events: none;
  }
  @media (max-width: 560px) {
    .desktop-touch-action {
      min-width: 44px;
      padding: 0 7px;
    }
    .desktop-touch-action__label {
      display: none;
    }
  }
  @media (max-width: 400px) {
    .desktop-touch-toolbar {
      display: grid;
      width: calc(100% - 24px);
      grid-template-columns: repeat(3, minmax(44px, 1fr));
    }
    .desktop-touch-toolbar .desktop-sizing {
      box-sizing: border-box;
      width: 100%;
    }
  }
`})))()}var Je;function Ye(){return(Ye=e((()=>{k(),Je=j`
  .desktop-apps {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 3px;
  }
  .desktop-app-button,
  .desktop-toolbar-action,
  .desktop-toolbar-mode {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: 0;
    border-radius: 4px;
    padding: 5px 7px;
    background: transparent;
    color: var(--muted);
    font: inherit;
    font-size: 12px;
    white-space: nowrap;
  }
  .desktop-app-button {
    color: var(--text);
  }
  .desktop-app-button:hover:not(:disabled),
  .desktop-toolbar-action:hover:not(:disabled) {
    background: color-mix(in srgb, var(--text) 8%, transparent);
    color: var(--text);
  }
  .desktop-app-button:focus-visible,
  .desktop-toolbar-action:focus-visible {
    outline: 2px solid var(--focus, var(--accent));
    outline-offset: 1px;
  }
  .desktop-app-button:disabled,
  .desktop-toolbar-action:disabled {
    cursor: default;
    opacity: 0.55;
  }
  .desktop-app-button__icon {
    display: inline-flex;
    width: 15px;
    height: 15px;
  }
  .desktop-app-button__icon svg {
    width: 100%;
    height: 100%;
    stroke-width: 1.75;
  }
  .desktop-app-button__icon--launching {
    animation: desktop-app-launch 900ms linear infinite;
  }
  @keyframes desktop-app-launch {
    50% {
      opacity: 0.6;
      transform: rotate(180deg) scale(0.92);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .desktop-app-button__icon--launching {
      animation: none;
    }
  }
`})))()}var Xe,Ze;function Qe(){return(Qe=e((()=>{k(),fe(),pe(),qe(),Ye(),Xe=j`
  .bp--embedded {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .bp--bottom {
    left: var(--shell-nav-width, 0);
    right: calc(var(--oc-terminal-reserve-right, 0px) + var(--oc-browser-reserve-right, 0px));
    bottom: calc(var(--oc-terminal-reserve-bottom, 0px) + var(--oc-browser-reserve-bottom, 0px));
  }
  .bp--right {
    top: var(--shell-topbar-height, 0);
    right: calc(var(--oc-terminal-reserve-right, 0px) + var(--oc-browser-reserve-right, 0px));
    bottom: calc(var(--oc-terminal-reserve-bottom, 0px) + var(--oc-browser-reserve-bottom, 0px));
  }
  .bp-title {
    min-width: 0;
  }
  .bp-icon[aria-disabled="true"] {
    opacity: 0.4;
  }
  .desktop-toolbar-action > svg {
    width: 15px;
    height: 15px;
  }
  .desktop-audio-button {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .desktop-audio-button > svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
  .desktop-audio-button:disabled,
  .desktop-audio-button[aria-disabled="true"] {
    opacity: 0.5;
  }
  .desktop-touch-toolbar .desktop-audio-label {
    display: none;
  }
  .desktop-fullscreen-icon > svg {
    width: 15px;
    height: 15px;
  }
  .bp:fullscreen {
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
  .desktop-content {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
  }
  .desktop-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-bottom: 1px solid var(--border, #262b34);
  }
  .desktop-toolbar--connection {
    flex-wrap: wrap;
    min-height: 42px;
    gap: 12px;
  }
  .desktop-toolbar__spacer {
    flex: 1;
  }
  .desktop-sizing {
    width: 88px;
    height: 32px;
    flex: 0 0 auto;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0 6px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 12px;
  }
  .desktop-touch-toolbar .desktop-sizing {
    height: 44px;
  }
  .desktop-button {
    border: 1px solid var(--border, #262b34);
    border-radius: 6px;
    padding: 5px 10px;
    background: transparent;
    color: var(--text, #d7dae0);
    font: inherit;
    font-size: 12px;
  }
  .desktop-button:hover:not(:disabled) {
    background: color-mix(in srgb, var(--text, #d7dae0) 10%, transparent);
  }
  .desktop-button--primary {
    border-color: var(--accent, #ff5c5c);
    color: var(--accent, #ff5c5c);
  }
  .desktop-button:disabled,
  .desktop-touch-action:disabled {
    opacity: 0.5;
  }
  .desktop-session {
    overflow: hidden;
    max-width: 100%;
    color: var(--muted);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .desktop-note {
    padding: 7px 12px;
    border-bottom: 1px solid var(--border, #262b34);
    color: var(--muted, #8a919e);
    font-size: 12px;
  }
  .desktop-note--error {
    color: var(--danger, #ff6b6b);
  }
  .desktop-picker,
  .desktop-status {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
    gap: 10px;
    overflow: auto;
    padding: 14px;
    background: var(--panel);
  }
  .desktop-status {
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--muted, #8a919e);
  }
  .desktop-credentials {
    display: flex;
    width: min(320px, 100%);
    flex-direction: column;
    gap: 10px;
    text-align: left;
  }
  .desktop-credentials__label {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: var(--text, #d7dae0);
    font-size: 12px;
  }
  .desktop-credentials__input {
    border: 1px solid var(--border, #262b34);
    border-radius: 6px;
    padding: 7px 9px;
    background: var(--bg, #111318);
    color: var(--text, #d7dae0);
    font: inherit;
  }
  .desktop-environment {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border: 1px solid var(--border, #262b34);
    border-radius: 8px;
  }
  .desktop-environment__details {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
    gap: 5px;
  }
  .desktop-environment__id {
    overflow: hidden;
    color: var(--text, #d7dae0);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .desktop-environment__meta,
  .desktop-environment__sessions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 5px;
    color: var(--muted, #8a919e);
    font-size: 11px;
  }
  .desktop-stage {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    background: var(--bg);
  }
  .desktop-surface {
    position: absolute;
    inset: 0;
    background: var(--bg);
  }
  /* View-only affordance: clicking anywhere on the desktop takes control. */
  .desktop-stage__take-control {
    position: absolute;
    inset: 0;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: var(--cursor-action, pointer);
  }
  .desktop-stage__take-control:focus-visible {
    outline: 2px solid var(--accent, #ff5c5c);
    outline-offset: -2px;
  }
`,Ze=[me,Je,Xe,Ke,de]})))()}function $e(e){let t=at({...e.connection,state:e.content.state,presentationControls:e.workspaceControls?D`<button
            class="desktop-toolbar-action"
            type="button"
            title=${m(`desktop.openWindow`)}
            aria-label=${m(`desktop.openWindow`)}
            @click=${e.onOpenWindow}
          >
            ${T.externalLink}</button
          >${e.renderFullscreenControl()}`:O}),n=e.embedded||e.fullscreen?``:e.dock===`bottom`?`height:${e.height}px`:`width:${e.width}px`;return D`
    <section
      class="bp bp--${e.embedded?`embedded`:e.dock}"
      style=${n}
      aria-label=${m(`desktop.title`)}
    >
      ${e.embedded?O:e.renderResizer()}
      ${e.embedded?O:tt({dock:e.dock,fullscreenControl:e.renderFullscreenControl(),onDock:e.onDock,onOpenWindow:e.onOpenWindow,onClose:e.onClose})}
      ${et({...e.content,connection:t})}
    </section>
  `}function et(e){return D`
    <div class="desktop-content">
      ${e.notice}
      ${e.state===`picker`?e.picker:e.state===`inventory-error`||e.state===`disconnected`?e.recovery:e.state===`credentials`?e.credentials:e.connection}
    </div>
  `}function tt(e){return D`
    <header class="rail-header bp-header">
      <div class="rail-header__title bp-title">${m(`desktop.title`)}</div>
      <div class="rail-header__actions bp-actions">
        <button
          class="rail-header__action bp-icon ${e.dock===`bottom`?`is-active`:``}"
          type="button"
          title=${m(`desktop.dockBottom`)}
          aria-label=${m(`desktop.dockBottom`)}
          @click=${()=>e.onDock(`bottom`)}
        >
          ${T.panelBottomOpen}
        </button>
        <button
          class="rail-header__action bp-icon ${e.dock===`right`?`is-active`:``}"
          type="button"
          title=${m(`desktop.dockRight`)}
          aria-label=${m(`desktop.dockRight`)}
          @click=${()=>e.onDock(`right`)}
        >
          ${T.panelRightOpen}
        </button>
        <button
          class="rail-header__action bp-icon bp-open-window"
          type="button"
          title=${m(`desktop.openWindow`)}
          aria-label=${m(`desktop.openWindow`)}
          @click=${e.onOpenWindow}
        >
          ${T.externalLink}
        </button>
        ${e.fullscreenControl}
        <button
          class="rail-header__action bp-icon"
          type="button"
          title=${m(`desktop.hide`)}
          aria-label=${m(`desktop.hide`)}
          @click=${e.onClose}
        >
          ${T.x}
        </button>
      </div>
    </header>
  `}function nt(e){return e.automatic?D`<div class="desktop-status" role="status">
      <button class="desktop-button" type="button" @click=${e.onRefresh}>
        ${m(`common.retry`)}
      </button>
    </div>`:D`
    <div class="desktop-toolbar">
      <span>${m(`desktop.pickerTitle`)}</span>
      <span class="desktop-toolbar__spacer"></span>
      <button
        class="desktop-button"
        type="button"
        ?disabled=${e.loading}
        @click=${e.onRefresh}
      >
        ${e.loading?m(`desktop.refreshing`):m(`desktop.refresh`)}
      </button>
    </div>
    <div class="desktop-picker">
      ${e.loading&&e.environments.length===0?R(`desktop`,m(`desktop.loading`)):e.environments.length===0?D`<div class="desktop-status">${m(`desktop.empty`)}</div>`:e.environments.map(t=>rt(t,e.onConnect))}
    </div>
  `}function rt(e,t){let n=e.worker,r=I(e);return D`
    <div class="desktop-environment">
      <div class="desktop-environment__details">
        <div class="desktop-environment__id">
          ${r.kind===`host`?m(`desktop.thisMachine`):e.id}
        </div>
        <div class="desktop-environment__meta">
          <span>${n?.state??e.status}</span>
        </div>
        ${n&&n.attachedSessionIds.length>0?D`<div class="desktop-environment__sessions">
                ${n.attachedSessionIds.map(e=>D`<span class="desktop-session">${e}</span>`)}
              </div>`:O}
      </div>
      <button
        class="desktop-button desktop-button--primary"
        type="button"
        @click=${()=>t(e.id)}
      >
        ${m(`desktop.connect`)}
      </button>
    </div>
  `}function it(e){return D`
    <div class="desktop-status">
      <form class="desktop-credentials" @submit=${e.onSubmit}>
        <div>${m(e.ardAccount?`desktop.accountPrompt`:`desktop.passwordPrompt`)}</div>
        ${e.ardAccount?D`<label class="desktop-credentials__label">
                ${m(`desktop.usernameLabel`)}
                <input
                  class="desktop-credentials__input"
                  name="username"
                  type="text"
                  autocomplete="off"
                  .value=${e.username}
                  required
                />
              </label>`:O}
        <label class="desktop-credentials__label">
          ${m(e.ardAccount?`desktop.accountPasswordLabel`:`desktop.passwordLabel`)}
          <input
            class="desktop-credentials__input"
            name="password"
            type="password"
            autocomplete="off"
            required
          />
        </label>
        <button class="desktop-button desktop-button--primary" type="submit">
          ${m(`desktop.connect`)}
        </button>
      </form>
    </div>
  `}function at(e){return D`
    <div class="desktop-toolbar desktop-toolbar--connection">
      ${e.showApps&&e.desktopApps.length>0?D`<div class="desktop-apps">
              ${e.desktopApps.map(t=>{let n=e.launchingApp===t,r=m(t===`browser`?`browser.title`:`terminal.title`);return D`<button
                  class="desktop-app-button"
                  type="button"
                  title=${r}
                  aria-label=${r}
                  aria-busy=${n?`true`:`false`}
                  ?disabled=${!e.environmentSelected||n}
                  @click=${()=>e.onLaunch(t)}
                >
                  <span
                    class="desktop-app-button__icon ${n?`desktop-app-button__icon--launching`:``}"
                    aria-hidden="true"
                  >
                    ${t===`browser`?T.chrome:T.terminal}
                  </span>
                  <span>${r}</span>
                </button>`})}
            </div>`:O}
      <span class="desktop-toolbar__spacer"></span>
      ${e.controlling?D`<button
              class="desktop-toolbar-action"
              type="button"
              aria-label=${m(`desktop.switchToViewOnly`)}
              ?disabled=${e.state!==`connected`}
              @click=${e.onControlToggle}
            >
              ${m(`desktop.control`)}
            </button>`:e.state===`connected`?D`<span class="desktop-toolbar-mode" role="status">${m(`desktop.viewOnly`)}</span>`:O}
      ${ot(e.sizing)} ${e.audioControl??O}
      ${e.pictureInPictureControl} ${e.presentationControls??O}
      <button
        class="desktop-toolbar-action"
        type="button"
        title=${m(`desktop.disconnect`)}
        aria-label=${m(`desktop.disconnect`)}
        @click=${e.onDisconnect}
      >
        ${m(`desktop.disconnect`)}
      </button>
    </div>
    <div class="desktop-stage">
      <div class="desktop-surface"></div>
      ${e.controlling?O:D`<button
              class="desktop-stage__take-control"
              type="button"
              title=${m(`desktop.takeControl`)}
              aria-label=${m(`desktop.takeControl`)}
              ?disabled=${e.state!==`connected`}
              @click=${e.onTakeControl}
            ></button>`}
      ${e.state===`connecting`?R(`desktop`,m(`desktop.connecting`),!1,!0):O}
    </div>
  `}function ot(e){return D`
    <select
      class="desktop-sizing"
      aria-label=${m(`desktop.sizing`)}
      title=${m(`desktop.matchRequirement`)}
      @change=${t=>{if(!(t.currentTarget instanceof HTMLSelectElement))return;let n=t.currentTarget.value;(n===`fit`||n===`actual`||n===`match`&&e.canResize)&&e.onChange(n)}}
    >
      <option value="fit" .selected=${e.mode===`fit`}>${m(`desktop.fit`)}</option>
      <option value="actual" .selected=${e.mode===`actual`}>${m(`desktop.actual`)}</option>
      ${e.canResize||e.mode===`match`?D`<option
              value="match"
              .selected=${e.mode===`match`}
              ?disabled=${!e.canResize}
            >
              ${m(`desktop.match`)}
            </option>`:O}
    </select>
  `}function st(e,t,n){let r=e?D`<div class="desktop-note desktop-note--error" role="alert">${e}</div>`:t?D`<div class="desktop-note" role="status">${t}</div>`:O,i=n?.state===`locked`?m(`desktop.macLocked`):n?.state===`unknown`?m(`desktop.macLockStateUnknown`):null;return D`${r}${i?D`<div class="desktop-note" role="status">${i}</div>`:O}`}function X(){return(X=e((()=>{k(),i(),H(),E(),le(),L(),V()})))()}var ct,lt;function ut(){return(ut=e((()=>{k(),i(),H(),w(),X(),V(),ct=S(M`<rect x="2" y="3" width="20" height="18" rx="2" />
  <rect x="12" y="11" width="7" height="7" rx="1" />`),lt=class{constructor(e,t){this.host=e,this.state=t,this.errorText=null,this.popup=null,this.pending=!1,this.generation=0,this.stopMirror=null,e.addController(this)}hostDisconnected(){this.close()}get opener(){return this.host.ownerDocument.defaultView}source(){return this.host.available&&this.state()===`connected`&&(!this.host.embedded||this.host.presented)?this.host.renderRoot.querySelector(`.desktop-surface canvas`):null}renderNotice(...[e,t,n]){return st(this.errorText??e,t,n)}renderButton(){let e=this.state()===`connected`,t=this.host.documentMode?`desktop-touch-action`:`desktop-toolbar-action`,n=this.opener?.isSecureContext===!0&&typeof this.opener.documentPictureInPicture?.requestWindow==`function`,r=this.popup?m(`desktop.exitPictureInPicture`):m(n?`desktop.enterPictureInPicture`:`desktop.pictureInPictureUnavailable`);return D`<button
      class=${t+` desktop-picture-in-picture-button`}
      type="button"
      title=${r}
      aria-label=${r}
      aria-pressed=${this.popup?`true`:`false`}
      aria-busy=${this.pending?`true`:`false`}
      ?disabled=${!n||!e||this.pending}
      @click=${()=>void this.toggle()}
    >
      ${ct}
    </button>`}close(){++this.generation,this.stopMirror?.(),this.stopMirror=null;let e=this.popup;this.popup=null,e?.close(),this.errorText=null,this.host.requestUpdate()}async toggle(){if(this.popup){this.close();return}let e=this.opener,t=e?.documentPictureInPicture,n=this.source();if(this.pending||!e?.isSecureContext||!t||!n||!this.host.isConnected)return;let r=++this.generation;this.pending=!0,this.errorText=null,this.host.requestUpdate();let i=null;try{if(i=await t.requestWindow({width:640,height:400}),i.closed||r!==this.generation||!this.host.isConnected||this.source()!==n){i.close();return}this.popup=i,this.startMirror(i,n)}catch{i?.close(),r===this.generation&&(this.close(),this.errorText=m(`desktop.errors.pictureInPictureFailed`))}finally{this.pending=!1,this.host.requestUpdate()}}startMirror(e,t){let n=e.document;n.title=m(`desktop.pictureInPictureTitle`),n.documentElement.lang=this.host.ownerDocument.documentElement.lang;let r=n.createElement(`canvas`);r.setAttribute(`role`,`img`),r.setAttribute(`aria-label`,m(`desktop.pictureInPictureTitle`)),r.style.cssText=`display:block;width:100%;height:100%;object-fit:contain;pointer-events:none`,n.body.style.cssText=`margin:0;height:100vh;background:var(--bg);color:var(--text);overflow:hidden`,n.body.replaceChildren(r);let i=r.getContext(`2d`);if(!i)throw Error(`Picture-in-Picture canvas is unavailable`);let a=this.host.ownerDocument.documentElement,o=()=>{let e=getComputedStyle(a);n.documentElement.style.setProperty(`--bg`,e.getPropertyValue(`--bg`)),n.documentElement.style.setProperty(`--text`,e.getPropertyValue(`--text`)),n.documentElement.style.colorScheme=e.colorScheme};o();let s=new MutationObserver(o);s.observe(a,{attributes:!0,attributeFilter:[`data-theme`,`data-theme-mode`,`style`]});let c=0,l=-1/0,u=()=>{this.popup===e&&this.close()};e.addEventListener(`pagehide`,u,{once:!0}),this.stopMirror=()=>{s.disconnect(),e.cancelAnimationFrame(c),e.removeEventListener(`pagehide`,u),r.remove()};let d=n=>{if(this.popup===e){if(e.closed||this.source()!==t||!t.isConnected){this.close();return}try{if(n-l>=1e3/30&&t.width>0&&t.height>0){let a=Math.min(1,e.innerWidth*e.devicePixelRatio/t.width,e.innerHeight*e.devicePixelRatio/t.height),o=Math.max(1,Math.round(t.width*a)),s=Math.max(1,Math.round(t.height*a));(r.width!==o||r.height!==s)&&(r.width=o,r.height=s),i.drawImage(t,0,0,o,s),l=n}c=e.requestAnimationFrame(d)}catch{this.close(),this.errorText=m(`desktop.errors.pictureInPictureFailed`),this.host.requestUpdate()}}};c=e.requestAnimationFrame(d)}}})))()}function dt(e){let t=D`
    <div class="desktop-stage">
      <div class="desktop-surface"></div>
      ${e.state===`connecting`?R(`desktop`,m(`desktop.connecting`),!1,!0):O}
      <textarea
        class="desktop-keyboard-input"
        inputmode="text"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        tabindex="-1"
        aria-label=${m(`desktop.keyboardInput`)}
        ?disabled=${e.state!==`connected`||!e.controlling}
        .value=${e.keyboardInputValue}
        @keydown=${e.onKeyboardEvent}
        @keyup=${e.onKeyboardEvent}
        @input=${e.onKeyboardInput}
      ></textarea>
      <nav class="desktop-touch-toolbar" aria-label=${m(`desktop.touchControls`)}>
        ${e.audioControl??O} ${e.pictureInPictureControl}
        <button
          class="desktop-touch-action"
          type="button"
          aria-label=${m(e.controlling?`desktop.switchToViewOnly`:`desktop.takeControl`)}
          aria-pressed=${e.controlling?`true`:`false`}
          ?disabled=${e.state!==`connected`}
          @click=${e.onControlToggle}
        >
          <span class="desktop-touch-action__icon" aria-hidden="true">
            ${e.controlling?T.hand:T.eye}
          </span>
          <span class="desktop-touch-action__label">
            ${m(e.controlling?`desktop.control`:`desktop.viewOnly`)}
          </span>
        </button>
        <button
          class="desktop-touch-action"
          type="button"
          aria-label=${m(`desktop.keyboard`)}
          ?disabled=${e.state!==`connected`||!e.controlling}
          @click=${e.onKeyboardFocus}
        >
          <span class="desktop-touch-action__icon" aria-hidden="true">${ft}</span>
          <span class="desktop-touch-action__label">${m(`desktop.keyboard`)}</span>
        </button>
        ${ot(e.sizing)}
        <button
          class="desktop-touch-action"
          type="button"
          aria-label=${m(`desktop.back`)}
          @click=${e.onClose}
        >
          <span class="desktop-touch-action__icon" aria-hidden="true">${T.arrowLeft}</span>
          <span class="desktop-touch-action__label">${m(`desktop.back`)}</span>
        </button>
      </nav>
    </div>
  `;return D`
    <section class="desktop-document" aria-label=${m(`desktop.title`)}>
      ${et({...e,connection:t})}
    </section>
  `}var ft;function pt(){return(pt=e((()=>{k(),i(),H(),w(),E(),le(),X(),V(),ft=S(M`
  <rect width="20" height="14" x="2" y="5" rx="2" />
  <path d="M6 9h.01" />
  <path d="M10 9h.01" />
  <path d="M14 9h.01" />
  <path d="M18 9h.01" />
  <path d="M6 13h.01" />
  <path d="M10 13h.01" />
  <path d="M14 13h.01" />
  <path d="M18 13h.01" />
  <path d="M8 17h8" />
`)})))()}function mt(e){return D`
    <div class="desktop-status">
      ${e.inventoryError?O:D`<div>
              ${e.reason?m(`desktop.disconnected`,{reason:e.reason}):m(`desktop.disconnectedClean`)}
            </div>`}
      <button class="desktop-button desktop-button--primary" type="button" @click=${e.onRetry}>
        ${m(e.inventoryError?`common.retry`:`desktop.reconnect`)}
      </button>
    </div>
  `}function Z(){return(Z=e((()=>{k(),i(),H(),V()})))()}function ht(e){let t={state:e.content.state===`picker`&&e.content.loading&&e.content.automaticSource&&e.content.hasTarget?`connecting`:e.content.state,notice:e.startup?D`${e.content.notice}${st(null,m(e.startup.worker?.state===`bootstrapping`?`desktop.preparing`:`desktop.starting`))}`:e.content.notice,picker:nt({...e.content.picker,loading:e.content.loading}),credentials:it(e.content.credentials),recovery:mt({...e.content.recovery,inventoryError:e.content.state===`inventory-error`})},n=e.focusTarget();return e.documentMode?dt({...t,controlling:e.controlling,sizing:e.sizing,keyboardInputValue:e.mobileKeyboard.value,pictureInPictureControl:e.pictureInPictureControl,audioControl:e.audioControl,onControlToggle:e.onControlToggle,onKeyboardFocus:t=>e.mobileKeyboard.focus(t),onKeyboardEvent:t=>e.mobileKeyboard.handleKeyboardEvent(t),onKeyboardInput:t=>e.mobileKeyboard.handleInput(t),onClose:e.onDocumentClose}):$e({embedded:e.embedded,workspaceControls:e.workspaceControls,dock:e.dockLayout.dock,height:e.dockLayout.height,width:e.dockLayout.width,fullscreen:e.fullscreenMode.active,renderResizer:()=>e.dockLayout.renderResizer(`bp`,m(`desktop.resize`)),renderFullscreenControl:()=>e.fullscreenMode.renderButton(),onDock:t=>e.dockLayout.setDock(t),onOpenWindow:()=>{let t=e.focusTarget();_e(t.basePath,t.source,!t.workspaceControls&&t.control)},onClose:e.onClose,content:t,connection:{controlling:e.controlling,desktopApps:e.desktopApps,environmentSelected:n.source!==null,launchingApp:e.launchingApp,showApps:n.source!==null&&I({id:n.source}).kind===`environment`,sizing:e.sizing,pictureInPictureControl:e.pictureInPictureControl,audioControl:e.audioControl,onLaunch:e.onLaunch,onTakeControl:e.onTakeControl,onControlToggle:e.onControlToggle,onDisconnect:e.onDisconnect}})}var gt;function _t(){return(_t=e((()=>{k(),i(),g(),pt(),ve(),Z(),X(),L(),gt={buttonClass:`bp-icon desktop-fullscreen-button`,buttonSelector:`.desktop-fullscreen-button`,iconClass:`desktop-fullscreen-icon`,enterLabel:()=>m(`desktop.enterFullscreen`),exitLabel:()=>m(`desktop.exitFullscreen`),unavailableLabel:()=>m(`desktop.fullscreenUnavailable`),errorMessage:e=>m(`desktop.errors.fullscreenFailed`,{error:f(e)})}})))()}var vt;function yt(){return(yt=e((()=>{r(),c(),oe(),n(),se(),L(),vt=class{constructor(e,t,n,r,i,a){this.host=e,this.currentTarget=t,this.onTargetChange=n,this.onInventoryChange=r,this.requestedAvailabilityTarget=i,this.onTargetError=a,this.refreshId=0,this.availabilityRequestId=0,this.desktopSource=null,this.availabilitySnapshot=null,this.startupPoll=new ae(e,2e3,()=>void this.refreshStartup(),!1),new h(e).effect(()=>e.available&&e.suppliedEnvironments===null?e.client:null,t=>t.addEventListener(n=>{if(!e.isConnected||!e.available||t!==e.client)return;if(n.event===`node.runnerInventory.changed`){let e=n.payload;ne(e)&&typeof e.nodeId==`string`&&e.nodeId.length>0&&(this.availabilityTarget===`node:${e.nodeId}`?this.refreshDesktopAvailability(e.nodeId):this.onInventoryChange());return}if(n.event===`presence`||n.event===`node.pair.resolved`||n.event===`config.changed`){this.onInventoryChange();return}let r=e.documentMode&&e.sessionKey!==null&&e.requestedSource===null&&n.event===`sessions.changed`&&!(ne(n.payload)&&n.payload.phase===`message`)?s(n.payload):null;if(r&&u(r.key,e.sessionKey)){let e=this.resolveTarget();e&&e.target.then(t=>{e.isCurrent()&&t!==void 0&&(t===null||t!==this.currentTarget())&&this.onTargetChange(t)}).catch(t=>{e.isCurrent()&&this.onTargetError(t)})}}))}invalidate(){this.refreshId+=1,this.stopStartup()?.resolve(void 0)}targetChanged(e,t){return e.has(`client`)||e.has(`available`)||e.has(`sessions`)||e.has(`embedded`)||e.has(`documentMode`)||e.has(`requestedSource`)&&(!this.host.embedded||this.host.suppliedEnvironments!==null||t)||e.has(`sessionKey`)||e.has(`documentControl`)}stopStartup(){this.startupPoll.stop();let e=this.startup;return this.startup=void 0,this.startupEnvironment&&(this.startupEnvironment=void 0,this.host.requestUpdate()),e}async refreshStartup(){let e=this.startup;if(e&&!e.busy){if(!e.isCurrent()){this.stopStartup()?.resolve(void 0);return}e.busy=!0;try{let t=await e.load();if(this.startup!==e)return;!e.isCurrent()||!t?.pendingSource?this.stopStartup()?.resolve(e.isCurrent()?t:void 0):(this.startupEnvironment=t.environments.find(e=>e.id===t.pendingSource),this.host.requestUpdate())}catch(t){this.startup===e&&this.stopStartup()?.reject(t)}finally{e.busy=!1}}}async waitForStartup(e,t){let n=await e();if(t())return n?.pendingSource?await new Promise((r,i)=>{this.startupEnvironment=n.environments.find(e=>e.id===n.pendingSource),this.host.requestUpdate(),this.startup={load:e,isCurrent:t,resolve:r,reject:i,busy:!1},this.startupPoll.start()}):n}loadInventory(e){this.invalidate();let t=this.host.client,n=e.automatic?this.resolveTarget(e.target,e.refresh):{target:Promise.resolve(e.target),isCurrent:()=>!0},r=()=>this.host.isConnected&&this.host.available&&t===this.host.client&&e.isCurrent()&&n?.isCurrent()===!0;return{isCurrent:r,result:t&&n?this.waitForStartup(()=>ue(t,{target:n.target,isCurrent:r,recoverToPicker:this.host.documentMode&&!this.host.embedded}),r):Promise.resolve(void 0)}}setDesktopSource(e,t){let n=this.host.client,r=this.desktopSource;r&&(r.client!==n||e.kind!==`node`||r.nodeId!==e.nodeId)&&this.clearDesktopSource(),this.desktopSource=n&&e.kind===`node`?{client:n,nodeId:e.nodeId,availability:t}:null}clearDesktopSource(){this.desktopSource=null,this.availabilitySnapshot=null,this.availabilityRequestId+=1}get desktopAvailability(){let e=this.desktopSource;if(!e||e.client!==this.host.client)return;let t=this.availabilitySnapshot;return t?.client===e.client&&t.nodeId===e.nodeId?t.availability:e.availability}get availabilityTarget(){return this.desktopSource&&this.desktopSource.client!==this.host.client?null:this.requestedAvailabilityTarget()}async refreshDesktopAvailability(e){let{client:t}=this.host;if(!t)return;let n=`node:${e}`,r=++this.availabilityRequestId,i=()=>this.host.isConnected&&this.host.available&&t===this.host.client&&r===this.availabilityRequestId&&n===this.availabilityTarget;try{let r=await t.request(`environments.status`,{environmentId:n});if(!i())return;if(r.id!==n)throw Error(`Desktop status returned a different environment`);this.availabilitySnapshot={client:t,nodeId:e,availability:r.desktopAvailability},this.host.requestUpdate()}catch{i()&&this.desktopAvailability&&(this.availabilitySnapshot={client:t,nodeId:e,availability:{state:`unknown`}},this.host.requestUpdate())}}resolveTarget(e,t=!1){let{client:n,sessions:r,sessionKey:i,requestedSource:a,documentMode:o}=this.host;if(!n)return;let s=++this.refreshId,c=()=>s===this.refreshId&&this.host.isConnected&&n===this.host.client&&r===this.host.sessions&&i===this.host.sessionKey&&o===this.host.documentMode&&this.host.available&&a===this.host.requestedSource,l=a??e;return{target:l===void 0&&o&&i!==null?r.describe({key:i},{client:n,refresh:t}).then(({session:e})=>ce(e??void 0)):Promise.resolve(l??(i===null?void 0:null)),isCurrent:c}}}})))()}var bt=t({}),Q;function $(){return($=e((()=>{k(),te(),i(),H(),g(),l(),ee(),W(),C(),ye(),je(),Pe(),Ie(),ze(),Ge(),y(),Qe(),ut(),_t(),yt(),L(),V(),Q=class extends _{constructor(...e){super(...e),this.client=null,this.available=!1,this.suppressed=!1,this.documentMode=!1,this.requestedSource=null,this.sessionKey=null,this.documentControl=!1,this.basePath=``,this.suppliedEnvironments=null,this.workspaceControls=!1,this.embedded=!1,this.presented=!1,this.refreshOnPresentation=!0,this.onDocumentClose=null,this.onFocusTargetChange=null,this.desktopClientFactory=()=>new Ne,this.environments=[],this.loading=!1,this.state=`picker`,this.environmentId=null,this.source=null,this.controlling=!1,this.errorText=null,this.noticeText=null,this.disconnectedReason=null,this.desktopApps=[],this.sizingMode=`fit`,this.canResize=!1,this.connection=new Re,this.audio=new Ae(this,()=>this.state===`connected`,()=>void this.connectEnvironment(this.environmentId,this.controlling)),this.launcher=new G(this,()=>({client:this.client,source:this.source,presented:!this.embedded||this.presented,state:this.state,apps:this.desktopApps})),this.pictureInPicture=new lt(this,()=>this.state),this.pendingConnection=null,this.operationId=0,this.controlTakeoverRecoveryUsed=!1,this.sourceSelection=`pending`,this.sessionSource=new vt(this,()=>this.environmentId,e=>{this.usesAutomaticSource&&(this.returnToPicker(`pending`),this.refreshEnvironments(void 0,e))},()=>{(this.state===`picker`||this.state===`inventory-error`&&this.usesAutomaticSource)&&!this.suppressed&&(this.embedded?this.presented:this.documentMode||this.dockLayout.open)&&this.refreshEnvironments()},()=>this.state===`picker`&&!this.loading||this.state===`inventory-error`?null:this.environmentId??(this.usesAutomaticSource?this.requestedSource:null),e=>{this.usesAutomaticSource&&(this.state===`picker`||this.state===`inventory-error`)&&(this.sessionSource.invalidate(),this.operationId+=1,this.loading=!1,this.errorText=m(`desktop.errors.listFailed`,{error:f(e)}),this.state=`inventory-error`)}),this.mobileKeyboard=new Fe({connection:()=>this.connection.handle,controlling:()=>this.controlling,input:()=>this.shadowRoot?.querySelector(`.desktop-keyboard-input`)}),this.dockLayout=new x(this,{layout:v,reservationPrefix:`desktop`,isAvailable:()=>this.available,isFullscreen:()=>this.fullscreenMode.active}),this.fullscreenMode=new U(this,{...gt,section:()=>this.renderRoot.querySelector(`section.bp`),onChange:()=>this.dockLayout.syncReservation()}),this.handleToggleRequest=e=>{if(this.documentMode||this.suppressed||this.embedded&&!this.presented)return;let t=e instanceof CustomEvent&&typeof e.detail==`object`&&e.detail!==null?e.detail:null;if(!this.embedded&&(t?.dock===`right`||t?.dock===`bottom`)&&this.dockLayout.setDock(t.dock,!1),t?.open===!1){this.closePanel();return}if(!this.available||this.embedded&&!this.client)return;let n=this.embedded||this.dockLayout.open;this.embedded||this.dockLayout.setOpen(!0);let r=t?.environmentId??(t?.open===!0?this.environmentId:null);r?this.connectRequestedEnvironment(r,!!t?.environmentId):this.embedded?(this.returnToPicker(this.sessionKey===null?`picker`:`pending`),this.refreshEnvironments()):n?t?.open!==!0&&this.closePanel():this.refreshEnvironments()}}static{this.styles=Ze}connectedCallback(){super.connectedCallback(),this.embedded||window.addEventListener(b,this.handleToggleRequest),this.dockLayout.setSuppressed(this.suppressed),(this.documentMode&&this.hasUpdated&&this.available||!this.documentMode&&!this.embedded&&this.dockLayout.open)&&this.refreshEnvironments()}disconnectedCallback(){window.removeEventListener(b,this.handleToggleRequest),this.documentMode&&this.usesAutomaticSource?this.returnToPicker(`pending`):this.disconnectConnection(),this.sessionSource.clearDesktopSource(),this.credentials=void 0,super.disconnectedCallback()}updated(e){if(e.has(`embedded`)&&(this.embedded?window.removeEventListener(b,this.handleToggleRequest):window.addEventListener(b,this.handleToggleRequest)),e.has(`suppressed`)){let e=this.dockLayout.setSuppressed(this.suppressed);this.suppressed?this.returnToPicker():e&&this.refreshEnvironments()}let t=e.has(`client`)||e.has(`available`),n=this.sessionSource.targetChanged(e,this.usesAutomaticSource);if((this.documentMode||this.embedded)&&n?(this.returnToPicker(`pending`),this.available&&(!this.embedded||this.presented&&this.refreshOnPresentation)&&this.refreshEnvironments()):this.embedded&&e.has(`presented`)&&e.get(`presented`)!==this.presented&&this.state!==`disconnected`?(this.pictureInPicture.close(),this.mobileKeyboard.reset(),this.presented||this.audio.retire(),this.connection.setPresented(this.presented,()=>this.returnToPicker(`pending`))&&this.refreshOnPresentation&&this.refreshEnvironments()):t&&(!this.available&&this.dockLayout.open?(this.dockLayout.hideWithoutPersisting(),this.returnToPicker()):this.available&&this.dockLayout.restoreOpenState()&&this.refreshEnvironments()),e.has(`suppliedEnvironments`)&&this.suppliedEnvironments!==null){this.environments=[...this.suppliedEnvironments];let e=this.environments.find(e=>e.id===this.environmentId);this.source&&this.sessionSource.setDesktopSource(this.source,e?.desktopAvailability)}this.dockLayout.syncReservation(),this.onFocusTargetChange?.({kind:`desktop`,control:this.controlling,...this.sourceSelection===`picker`?{}:this.sourceSelection===`explicit`||this.sessionKey===null?{source:this.environmentId}:{session:this.sessionKey}})}closePanel(){this.returnToPicker(),this.embedded||this.dockLayout.setOpen(!1)}get usesAutomaticSource(){return this.sourceSelection===`pending`||this.sourceSelection===`resolved`}returnToPicker(e=`picker`){this.disconnectConnection(),this.state=`picker`,this.sourceSelection=e,this.environmentId=null,this.source=null,this.credentials=void 0,this.credentialAuth=void 0,this.desktopApps=[],this.controlling=!1,this.sizingMode=`fit`,this.canResize=!1,this.disconnectedReason=null,this.sessionSource.clearDesktopSource()}disconnectConnection(e=!1){this.audio.close(),this.pictureInPicture.close(),this.operationId+=1,this.pendingConnection=null,this.connection.begin(e),this.mobileKeyboard.reset(),e||(this.sessionSource.invalidate(),this.loading=!1,this.launcher.clear())}async refreshEnvironments(e,t,n=!1){if(!this.client||!this.available||this.embedded&&!this.presented)return!1;let r=e??++this.operationId;this.loading=!0,this.errorText=null;let i=!1,a;if(this.suppliedEnvironments!==null){this.environments=[...this.suppliedEnvironments],this.loading=!1;let e=this.environments.find(e=>e.id===this.requestedSource&&e.desktop);return e&&this.sourceSelection===`pending`&&(this.sourceSelection=`resolved`,await this.connectEnvironment(e.id,!1)),!0}let o=this.sessionSource.loadInventory({automatic:this.sourceSelection===`pending`,target:t,refresh:n,isCurrent:()=>r===this.operationId&&(!this.embedded||this.presented)});try{let e=await o.result;e&&o.isCurrent()&&(a=e.selectedSource,this.environments=e.environments,i=!0)}catch(e){o.isCurrent()&&(this.errorText=m(`desktop.errors.listFailed`,{error:f(e)}),(this.requestedSource!==null||this.sessionKey!==null)&&(this.state=`inventory-error`))}finally{o.isCurrent()&&(this.loading=!1)}return i&&o.isCurrent()&&this.sourceSelection===`pending`&&(a===void 0?(this.requestedSource!==null||this.sessionKey!==null)&&(this.noticeText=m(`desktop.sourceUnavailable`)):(this.sourceSelection=`resolved`,await this.connectEnvironment(a,this.documentControl))),i}async connectRequestedEnvironment(e,t=!0){if(e===this.environmentId&&(this.state===`connecting`||this.state===`connected`||this.state===`credentials`)){t&&(this.sourceSelection=`explicit`);return}this.returnToPicker(t?`explicit`:this.sourceSelection),this.environmentId=e,this.state=`connecting`;let n=this.operationId,r=await this.refreshEnvironments(n,e);if(n===this.operationId){if(!r){this.state=`inventory-error`;return}this.connectEnvironment(e,!1)}}async connectEnvironment(e,t,n={}){let r=this.client;if(!e||!r||!this.available||this.embedded&&!this.presented)return;this.environmentId!==e&&(this.credentials=void 0,this.credentialAuth=void 0,this.sizingMode=`fit`),this.canResize=!1;let i=this.environments.find(t=>t.id===e);this.desktopApps=[...i?.worker?.desktopApps??[]],this.disconnectConnection(this.environmentId===e);let a=this.operationId,o=I(i??{id:e});this.environmentId=e,this.source=o,this.sessionSource.setDesktopSource(o,i?.desktopAvailability),this.controlling=t,this.state=`connecting`,this.errorText=null,this.disconnectedReason=null,n.preserveNotice||(this.noticeText=null),this.controlTakeoverRecoveryUsed=n.takeoverRecovery===!0;try{let n=Ve(o,this.credentialAuth,this.credentials),i=await r.request(`desktop.observe`,{source:o,control:t,...n?{credentials:n}:{}}),s=()=>Le(r,i.wsPath);if(a!==this.operationId){s();return}this.controlling=i.control,this.canResize=i.canResize===!0,(!this.canResize||!this.controlling)&&this.sizingMode===`match`&&(this.sizingMode=`fit`);let{credentials:c,auth:l,phase:u}=He(i,this.credentials);if(u===`credentials`&&this.connection.disconnect(),this.connection.retainObservation(s),this.credentialAuth=l??this.credentialAuth,u===`credentials`){this.pendingConnection={environmentId:e,control:t,observed:i,operationId:a},this.state=`credentials`;return}await this.connectObserved({environmentId:e,control:t,observed:i,operationId:a},c)}catch(n){let r=Ue(n);if(r&&a===this.operationId){this.connection.disconnect(),this.credentialAuth=r,this.pendingConnection={environmentId:e,control:t,operationId:a},this.state=`credentials`;return}this.failConnection(a,n)}}async connectObserved(e,t){let n=this.client;if(n&&e.operationId===this.operationId){this.state=`connecting`;try{if(await this.updateComplete,e.operationId!==this.operationId)return;let r=this.shadowRoot?.querySelector(`.desktop-surface`);if(!r)throw Error(`Desktop render target is unavailable`);this.audio.connect(e.observed,n.gatewayUrl);let i=await this.desktopClientFactory().connect({background:`var(--bg)`,isCurrent:()=>e.operationId===this.operationId,wsUrl:e.observed.wsPath,gatewayUrl:n.gatewayUrl,credentials:t,viewOnly:!e.observed.control,canResize:e.observed.canResize,sizingMode:this.sizingMode,target:r,onConnect:()=>{e.operationId===this.operationId&&(this.connection.setSizingMode(this.sizingMode),this.connection.markConnected(),this.state=`connected`)},onDisconnect:t=>{e.operationId===this.operationId&&this.handleDesktopDisconnect(e.environmentId,t)},onSecurityFailure:t=>{if(e.operationId===this.operationId){let n=p(t.reason,m(`desktop.unknownReason`));this.errorText=m(`desktop.errors.securityFailed`,{reason:n}),this.failConnection(e.operationId,Error(n))}}});if(e.operationId!==this.operationId){i.disconnect();return}this.connection.attach(i),this.connection.setSizingMode(this.sizingMode)}catch(t){this.failConnection(e.operationId,t)}}}failConnection(e,t){e===this.operationId&&(this.disconnectConnection(),this.state=`disconnected`,this.disconnectedReason=f(t))}handleCredentialsSubmit(e){e.preventDefault();let t=this.pendingConnection;if(!t||t.operationId!==this.operationId)return;let n=Be(new FormData(e.currentTarget),this.credentialAuth);n&&(this.credentials=n,this.pendingConnection=null,t.observed?this.connectObserved({...t,observed:t.observed},n):this.connectEnvironment(t.environmentId,t.control))}handleDesktopDisconnect(e,{code:t,reason:n,clean:r}){if(this.disconnectConnection(),t===1008&&this.credentialAuth===`ard-account`&&e!==null){this.credentials=this.credentials?.username?{username:this.credentials.username}:void 0,this.pendingConnection={environmentId:e,control:this.controlling,operationId:this.operationId},this.state=`credentials`,this.errorText=m(`desktop.errors.securityFailed`,{reason:p(n,m(`desktop.unknownReason`))});return}if(t===4e3&&(n===`control-taken`||n?.startsWith(`control-taken:`))&&this.controlling&&e!==null&&(!this.embedded||this.presented)&&!this.controlTakeoverRecoveryUsed){let t=p(n.slice(14));this.noticeText=t?m(`desktop.controlTakenBy`,{operator:t}):m(`desktop.controlTaken`),this.connectEnvironment(e,!1,{preserveNotice:!0,takeoverRecovery:!0});return}this.state=`disconnected`,this.disconnectedReason=p(n,t?m(`desktop.closeCode`,{code:String(t)}):``)||(r?null:m(`desktop.errors.connectionFailed`))}render(){if(!this.available||!this.documentMode&&!this.embedded&&!this.dockLayout.open)return O;let e=this.pictureInPicture.renderNotice(this.fullscreenMode.errorText??this.launcher.error??this.errorText,this.noticeText,this.sessionSource.desktopAvailability);return ht({documentMode:this.documentMode,embedded:this.embedded,workspaceControls:this.workspaceControls,content:{state:this.state,loading:this.loading,automaticSource:this.usesAutomaticSource,hasTarget:this.sessionKey!==null||this.requestedSource!==null,notice:D`${e}${this.audio.renderNotice()}`,picker:{automatic:this.usesAutomaticSource&&this.embedded&&this.sessionKey!==null,environments:this.environments,onRefresh:()=>void this.refreshEnvironments(void 0,void 0,!0),onConnect:e=>{this.sourceSelection=`explicit`,this.connectEnvironment(e,!1)}},credentials:{ardAccount:this.credentialAuth===`ard-account`,username:this.credentials?.username??``,onSubmit:e=>this.handleCredentialsSubmit(e)},recovery:{reason:this.disconnectedReason,onRetry:()=>{if(this.state===`inventory-error`&&this.documentMode||!this.environmentId){this.sourceSelection!==`picker`&&(this.sourceSelection=`pending`),this.state=`picker`,this.refreshEnvironments(void 0,void 0,!0);return}if(this.state===`inventory-error`&&this.environmentId){this.connectRequestedEnvironment(this.environmentId);return}this.connectEnvironment(this.environmentId,this.controlling)}}},controlling:this.controlling,desktopApps:this.desktopApps,launchingApp:this.launcher.app,startup:this.sessionSource.startupEnvironment,sizing:{mode:this.sizingMode,canResize:this.canResize&&this.controlling&&this.state===`connected`,onChange:e=>{this.sizingMode=e,this.connection.setSizingMode(e)}},mobileKeyboard:this.mobileKeyboard,pictureInPictureControl:this.pictureInPicture.renderButton(),audioControl:this.audio.renderButton(),dockLayout:this.dockLayout,fullscreenMode:this.fullscreenMode,onControlToggle:()=>void this.connectEnvironment(this.environmentId,!this.controlling),onTakeControl:()=>void this.connectEnvironment(this.environmentId,!0),onLaunch:e=>void this.launcher.launch(e),onClose:()=>this.closePanel(),onDocumentClose:()=>this.onDocumentClose?.(),focusTarget:()=>({basePath:this.basePath,source:this.environmentId,control:this.controlling,workspaceControls:this.workspaceControls}),onDisconnect:()=>{this.embedded&&(this.sessionKey!==null||this.suppliedEnvironments!==null)?this.handleDesktopDisconnect(this.environmentId,{clean:!0}):this.returnToPicker()}})}},P([N({attribute:!1})],Q.prototype,`client`,void 0),P([N({attribute:!1})],Q.prototype,`sessions`,void 0),P([N({type:Boolean})],Q.prototype,`available`,void 0),P([N({type:Boolean})],Q.prototype,`suppressed`,void 0),P([N({type:Boolean})],Q.prototype,`documentMode`,void 0),P([N({attribute:!1})],Q.prototype,`requestedSource`,void 0),P([N({attribute:!1})],Q.prototype,`sessionKey`,void 0),P([N({type:Boolean})],Q.prototype,`documentControl`,void 0),P([N({attribute:!1})],Q.prototype,`basePath`,void 0),P([N({attribute:!1})],Q.prototype,`suppliedEnvironments`,void 0),P([N({type:Boolean})],Q.prototype,`workspaceControls`,void 0),P([N({type:Boolean})],Q.prototype,`embedded`,void 0),P([N({type:Boolean})],Q.prototype,`presented`,void 0),P([N({type:Boolean})],Q.prototype,`refreshOnPresentation`,void 0),P([N({attribute:!1})],Q.prototype,`onDocumentClose`,void 0),P([N({attribute:!1})],Q.prototype,`onFocusTargetChange`,void 0),P([A()],Q.prototype,`environments`,void 0),P([A()],Q.prototype,`loading`,void 0),P([A()],Q.prototype,`state`,void 0),P([A()],Q.prototype,`environmentId`,void 0),P([A()],Q.prototype,`source`,void 0),P([A()],Q.prototype,`controlling`,void 0),P([A()],Q.prototype,`errorText`,void 0),P([A()],Q.prototype,`noticeText`,void 0),P([A()],Q.prototype,`disconnectedReason`,void 0),P([A()],Q.prototype,`desktopApps`,void 0),P([A()],Q.prototype,`sizingMode`,void 0),P([A()],Q.prototype,`canResize`,void 0),P([A()],Q.prototype,`sourceSelection`,void 0),customElements.get(`openclaw-desktop-panel`)||customElements.define(`openclaw-desktop-panel`,Q)})))()}export{$ as n,bt as t};
//# sourceMappingURL=desktop-panel-C5JZR96r.js.map