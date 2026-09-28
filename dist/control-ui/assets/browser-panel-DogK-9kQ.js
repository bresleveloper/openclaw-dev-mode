import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Wi as t,Yi as n,ai as r}from"./control-ui-foundation-Dh9Nir5C.js";import{Cs as i,Fs as a,Gl as o,Kr as s,Ls as c,Rl as l,Xl as u,lt as d,qr as f,ut as ee,xs as te,zl as ne}from"./control-ui-core-BfjCgLp6.js";import{$ as p,X as m,Y as h,mt as re,nt as ie,tt as ae,ut as g}from"./lit-runtime-L6OV30Vo.js";import{Fi as _,Ii as v,Ir as y,It as oe,Jr as se,Li as ce,Lt as le,Ri as ue,Rr as b,ai as de,bt as fe,oi as pe,ri as me,ti as he,yt as ge}from"./control-ui-core-qT0XjEdV.js";import{Fr as x,Pr as S,Sn as _e}from"./control-ui-boot-shared-CYu509im.js";import{An as ve,B as ye,Bt as be,Cn as xe,Dn as Se,En as Ce,Fn as we,Hn as Te,Ht as Ee,In as De,Ln as Oe,Mn as ke,On as Ae,Pn as je,Rt as Me,Sn as Ne,Tn as C,Vn as Pe,Vt as Fe,Xt as Ie,Yt as Le,_n as Re,_o as w,bn as ze,bo as T,gn as Be,hn as Ve,jn as He,kn as Ue,mn as We,pn as Ge,vn as Ke,vo as qe,wn as E,xn as D,yn as Je,yo as O,z as Ye,zt as Xe}from"./control-ui-boot-shared-Bm2ZxasE.js";import{n as Ze,t as Qe}from"./scrollbar-styles-DcWcVovJ.js";import{n as $e,t as et}from"./dock-panel-styles-BV7T-eMK.js";import{a as tt,i as nt,n as rt,r as it,t as k}from"./panel-tab-strip-_epoyRIU.js";import{n as at}from"./gateway-websocket-url-cYJwVUmD.js";import{n as ot,t as st}from"./dock-destination-controls-BULy0g0z.js";function A(){return typeof window>`u`?void 0:window}function ct(){return A()?.webkit?.messageHandlers?.openclawBrowser}function j(e){return typeof e==`string`&&e.length>0&&e.trim()===e}function M(e){return e===``||j(e)}function N(e){return typeof e==`number`&&Number.isFinite(e)}function P(e){if(e===`about:blank`)return!0;if(typeof e!=`string`)return!1;try{let t=new URL(e);return t.protocol===`http:`||t.protocol===`https:`}catch{return!1}}function F(e){return n(e)&&N(e.x)&&N(e.y)&&N(e.width)&&e.width>=0&&N(e.height)&&e.height>=0}function lt(e){if(!n(e))return!1;if(e.type===`release-scope`)return j(e.scope);if(e.type===`present`)return j(e.scope)&&(e.tabId===null||j(e.tabId))&&(e.rect===null||F(e.rect))&&typeof e.visible==`boolean`;if(!j(e.tabId))return!1;switch(e.type){case`open`:return P(e.url)&&M(e.sessionKey)&&(e.activate===void 0||typeof e.activate==`boolean`);case`navigate`:return P(e.url);case`inspect`:return N(e.x)&&e.x>=0&&N(e.y)&&e.y>=0;case`back`:case`forward`:case`reload`:case`stop`:case`close`:case`snapshot`:case`download`:return!0;default:return!1}}function I(e){if(!n(e)||!Number.isSafeInteger(e.revision)||typeof e.revision!=`number`||e.revision<0||!Array.isArray(e.tabs))return!1;let t=new Set;return Array.from(e.tabs).every(e=>!n(e)||!j(e.id)||e.sessionKey!==void 0&&!M(e.sessionKey)||t.has(e.id)||!P(e.url)||typeof e.title!=`string`||e.favicon!==void 0&&(typeof e.favicon!=`string`||e.favicon.length>98304||!/^data:image\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/i.test(e.favicon))||typeof e.loading!=`boolean`||typeof e.canGoBack!=`boolean`||typeof e.canGoForward!=`boolean`||e.openedBy!==`web`&&e.openedBy!==`native`||e.openerTabId!==void 0&&!j(e.openerTabId)?!1:(t.add(e.id),!0))}function ut(e){return e===null||n(e)&&typeof e.tag==`string`&&typeof e.id==`string`&&Array.isArray(e.classes)&&e.classes.every(e=>typeof e==`string`)&&typeof e.role==`string`&&typeof e.name==`string`&&typeof e.focusable==`boolean`&&F(e.rect)}async function L(e){let t=ct();if(typeof t?.postMessage!=`function`)return null;if(!lt(e))return{ok:!1,error:`Invalid native browser request`};try{let r=await t.postMessage.bind(t)(e);return n(r)&&r.ok===!1&&typeof r.error==`string`?{ok:!1,error:r.error}:!n(r)||r.ok!==!0?{ok:!1,error:`Invalid native browser reply`}:e.type===`open`?j(r.tabId)?{ok:!0,tabId:r.tabId}:{ok:!1,error:`Invalid native browser reply`}:e.type===`download`?typeof r.cancelled==`boolean`?{ok:!0,cancelled:r.cancelled}:{ok:!1,error:`Invalid native browser download`}:e.type===`snapshot`?typeof r.dataUrl!=`string`||!r.dataUrl.startsWith(`data:image/png;base64,`)||!N(r.cssWidth)||r.cssWidth<=0||!N(r.cssHeight)||r.cssHeight<=0?{ok:!1,error:`Invalid native browser snapshot`}:{ok:!0,dataUrl:r.dataUrl,cssWidth:r.cssWidth,cssHeight:r.cssHeight}:e.type===`inspect`?ut(r.node)?{ok:!0,node:r.node}:{ok:!1,error:`Invalid native browser inspection`}:{ok:!0}}catch(e){return{ok:!1,error:e instanceof Error?e.message:`Native browser request failed`}}}function R(){if(!y())return null;let e=A()?.__OPENCLAW_NATIVE_BROWSER__;return I(e)?e:null}function dt(e){if(!y())return()=>{};let t=R()?.revision??-1,n=n=>{let r=n instanceof CustomEvent?n.detail:null;I(r)&&r.revision>t&&(t=r.revision,e(r))};return window.addEventListener(z,n),()=>window.removeEventListener(z,n)}var z;function B(){return(B=e((()=>{z=`openclaw:native-browser-state`})))()}function V(e){return new Promise((t,n)=>{let r=new Image;r.addEventListener(`load`,()=>t(r)),r.addEventListener(`error`,()=>n(Error(u(`browser.errors.screenshotDecodeFailed`)))),r.src=e})}function ft(e){return _t.has(e)||e.length===1}function H(e,t){if(!e)return null;let n=e.getBoundingClientRect();return n.width<=0||n.height<=0?null:{x:(t.clientX-n.left)/n.width,y:(t.clientY-n.top)/n.height}}function pt(e,t,n){let r=H(e,t);if(!r||!n)return null;let i=n.metrics?.cssWidth??n.image.naturalWidth,a=n.metrics?.cssHeight??n.image.naturalHeight;return{x:r.x*i,y:r.y*a}}function mt(e,t){if(!e||!t)return null;let n=e.metrics?.cssWidth??e.image.naturalWidth,r=e.metrics?.cssHeight??e.image.naturalHeight;return n<=0||r<=0?null:{x:t.rect.x/n,y:t.rect.y/r,width:t.rect.width/n,height:t.rect.height/r}}function ht(e,t,n,r){if(!e||!t)return;let i=Math.max(1,Math.round(t.clientWidth)),a=Math.max(1,Math.round(t.clientHeight));(e.width!==i||e.height!==a)&&(e.width=i,e.height=a);let o=e.getContext(`2d`);o&&(o.clearRect(0,0,i,a),Ee(o,{width:i,height:a,strokes:n,highlight:r}))}function gt(e,t,n,r,i){let a=e.metrics?.url||e.url||t?.url||``,o=e.metrics?.title||t?.title||``,s=Me({url:a,title:o,strokes:n,element:r,browserTab:e.kind===`native`?void 0:e.browserTab}),c=Xe({image:e.image,width:e.image.naturalWidth,height:e.image.naturalHeight,strokes:n,highlight:i});return be({...s,dataUrl:c,fileName:`annotated-page.png`})}var _t;function U(){return(U=e((()=>{o(),S(),Fe(),x(),_t=new Set([`Enter`,`Backspace`,`Delete`,`Tab`,`Escape`,`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Home`,`End`,`PageUp`,`PageDown`])})))()}var vt,yt;function bt(){return(bt=e((()=>{o(),D(),U(),vt=120,yt=class{constructor(e){this.host=e,this.drawingGesture=null,this.suppressStageClick=!1,this.inspectionError=null,this.pendingClick=null,this.clickSequence=0,this.inputGeneration=0}resetCaptureState(){this.host.pendingInput.clearInput(),this.cancelOverlayPointerGesture(),this.pendingClick=null,this.clickSequence+=1,this.inputGeneration+=1}stageElement(){return this.host.host.renderRoot.querySelector(`.bp-stage`)}remotePoint(e){return pt(this.stageElement(),e,this.host.view)}inspectHighlightRegion(){return mt(this.host.view,this.host.inspected)}handleStageClick(e){if(this.suppressStageClick){this.suppressStageClick=!1;return}if(this.host.mode!==`interact`)return;this.host.host.renderRoot.querySelector(`.bp-input`)?.focus({preventScroll:!0});let t=this.remotePoint(e),n=this.host.activeTargetId,r=this.host.operations.captureClient();if(!t||!n||!r)return;let i=this.host.operations.epoch,a=this.inputGeneration,o=()=>this.inputGeneration!==a||!this.host.operations.isLive(i,r)||this.host.activeTargetId!==n||this.host.mode!==`interact`?Promise.resolve(!1):this.host.runAction(e=>Ve(e,{targetId:n,x:t.x,y:t.y}));this.clickSequence+=1,this.pendingClick=this.pendingClick?this.pendingClick.then(o):o()}handleWheel(e){if(this.host.mode!==`interact`||!this.host.view)return;let t=this.host.operations.captureClient(),n=this.host.activeTargetId;if(!t||!n)return;e.preventDefault();let r=this.host.operations.epoch;this.host.pendingInput.queueWheel(e.deltaX,e.deltaY,150,(e,i)=>{this.host.operations.isLive(r,t)&&this.host.activeTargetId===n&&this.host.mode===`interact`&&this.host.runAction(async t=>{if(this.host.evaluateUnavailable){await ve(t,{targetId:n,key:i>=0?`PageDown`:`PageUp`});return}await De(t,{targetId:n,deltaX:e,deltaY:i})})})}handleViewportKeydown(e){if(this.host.mode!==`interact`||!this.host.view||e.metaKey||e.ctrlKey||e.altKey)return;let t=e.key;ft(t)&&(e.preventDefault(),this.runAfterClick((e,n)=>ve(e,{targetId:n,key:t})))}handleViewportPaste(e){if(e.preventDefault(),e.stopPropagation(),!e.clipboardData?.types.includes(`text/plain`))return;let t=e.clipboardData.getData(`text/plain`);t&&this.runAfterClick((e,n)=>Ne(e,{targetId:n,text:t}))}runAfterClick(e){let t=this.host.activeTargetId,n=this.host.operations.captureClient();if(!n||!t||this.host.view?.targetId!==t||this.host.mode!==`interact`)return;let r=this.host.operations.epoch,i=this.clickSequence,a=()=>{this.host.operations.isLive(r,n)&&this.host.activeTargetId===t&&this.host.view?.targetId===t&&this.host.mode===`interact`&&this.clickSequence===i&&this.host.runAction(n=>e(n,t))};this.pendingClick?this.pendingClick.then(e=>{e&&a()}):a()}handleOverlayPointerDown(e){if(this.host.mode===`inspect`){this.suppressStageClick=!0,this.sendAnnotation({element:this.host.inspected});return}if(this.host.mode!==`annotate`||e.button!==0||this.drawingGesture)return;let t=H(this.stageElement(),e);if(!t)return;let n=e.currentTarget instanceof HTMLElement?e.currentTarget:e.target instanceof HTMLElement?e.target:null;if(!n)return;e.preventDefault();try{n.setPointerCapture(e.pointerId)}catch{}let r={pointerId:e.pointerId,captureTarget:n,stroke:{points:[t]}};this.drawingGesture=r,this.host.setState(`strokes`,[...this.host.strokes,r.stroke]),this.paintOverlay()}handleOverlayPointerMove(e){if(this.host.mode===`annotate`){let t=this.drawingGesture;if(!t||e.pointerId!==t.pointerId)return;let n=H(this.stageElement(),e);n&&(t.stroke.points.push(n),this.paintOverlay());return}this.host.mode===`inspect`&&this.queueInspect(e)}handleOverlayPointerUp(e){e.pointerId===this.drawingGesture?.pointerId&&(this.drawingGesture=null)}cancelOverlayPointerGesture(){let e=this.drawingGesture;if(this.drawingGesture=null,e)try{e.captureTarget.hasPointerCapture(e.pointerId)&&e.captureTarget.releasePointerCapture(e.pointerId)}catch{}}queueInspect(e){let t=this.host.operations.captureClient(),n=this.remotePoint(e),r=H(this.stageElement(),e),i=this.host.activeTargetId;if(!t||!n||!r||!i||this.host.evaluateUnavailable)return;let a=this.host.operations.beginInspection(t,()=>this.host.activeTargetId===i&&this.host.view?.targetId===i&&this.host.mode===`inspect`);this.host.setState(`inspected`,null),this.host.setState(`inspectPointer`,r),this.paintOverlay(),this.host.pendingInput.queueInspection(vt,a,()=>{xe(t,{targetId:i,x:n.x,y:n.y}).then(e=>{a()&&(this.inspectionError!==null&&this.host.errorText===this.inspectionError&&this.host.setState(`errorText`,null),this.inspectionError=null,this.host.setState(`inspected`,e),this.paintOverlay())}).catch(e=>{if(a()){if(E(e)){this.host.setState(`evaluateUnavailable`,!0),this.host.setState(`errorText`,u(`browser.inspectUnavailable`)),this.host.setState(`mode`,`interact`);return}this.host.reportError(e),this.inspectionError=this.host.errorText}})})}undoStroke(){this.cancelOverlayPointerGesture(),this.host.setState(`strokes`,this.host.strokes.slice(0,-1)),this.paintOverlay()}clearStrokes(){this.cancelOverlayPointerGesture(),this.host.setState(`strokes`,[]),this.paintOverlay()}async sendAnnotation(e){this.cancelOverlayPointerGesture();let t=this.host.view,n=this.host.tabs.find(e=>e.id===this.host.activeTargetId),r=e.element??null;if(!t||this.host.strokes.length===0&&!r)return;let i=r?this.inspectHighlightRegion():null,a;try{a=gt(t,n,this.host.strokes,r,i)}catch(e){this.host.reportError(e);return}if(a===`unhandled`){this.host.setState(`noticeText`,null),this.host.setState(`errorText`,u(`browser.noChatTarget`));return}if(a===`rejected`){this.host.setState(`noticeText`,null),this.host.setState(`errorText`,u(`browser.annotationLimitReached`));return}this.host.setState(`errorText`,null),this.host.setState(`noticeText`,u(`browser.annotationSent`)),this.host.exitCaptureModes()}paintOverlay(){ht(this.host.host.renderRoot.querySelector(`.bp-overlay`),this.stageElement(),this.host.strokes,this.host.mode===`inspect`?this.inspectHighlightRegion():null)}}})))()}var xt;function St(){return(St=e((()=>{Te(),oe(),B(),o(),S(),c(),D(),x(),xt=class{constructor(e){this.panel=e,this.pending=!1,this.request=null}get url(){let e=this.panel;if(e.unavailableTabText)return null;let t=e.native.activeTab?.url||(e.view?.targetId===e.activeTargetId?e.view?.metrics?.url||e.view?.url:null);if(!t)return null;try{return[`http:`,`https:`].includes(new URL(t).protocol)?t:null}catch{return null}}get available(){return!this.pending&&!this.panel.pendingNewTab&&!this.panel.loading&&this.url!==null}cancel(){this.request?.abort(),this.request=null,this.pending=!1}async save(){let e=this.url;if(!e||!this.available)return;let t=this.panel,n=t.activeTargetId,r=t.native.activeTab,i=r?null:t.operations.captureClient(),o=new AbortController;this.request=o,this.pending=!0,t.setState(`errorText`,null),t.setState(`noticeText`,null),t.host.requestUpdate();let s=()=>this.request===o&&t.host.isConnected&&t.activeTargetId===n&&this.url===e&&(r!==void 0||t.operations.captureClient()===i);try{if(r){let e=await L({type:`download`,tabId:r.id});if(!e?.ok)throw Error(e&&!e.ok?e.error:u(`browser.tabUnavailable`))}else{if(!i||!n)throw Error(u(`browser.tabUnavailable`));let r=await Re(i,n,e,o.signal);if(!s())return;let a=new Headers;t.host.authToken&&a.set(`Authorization`,`Bearer ${t.host.authToken}`);let c=await fetch(Pe(r.path,t.host.resourceBasePath),{headers:a,signal:o.signal,credentials:`same-origin`});if(!c.ok){let{errorMessage:e}=await le(c,o.signal);throw Error(e)}let l=await c.blob();if(!s())return;_e(r.filename,l)}}catch(e){s()&&!o.signal.aborted&&t.setState(`errorText`,u(`browser.errors.downloadFailed`,{error:a(e)}))}finally{this.request===o&&(this.request=null,this.pending=!1,t.host.requestUpdate())}}}})))()}var Ct,wt;function Tt(){return(Tt=e((()=>{B(),te(),f(),Ct=0,wt=class{constructor(e){this.controller=e,this.scope=s(),this.presentedTabId=null,this.lastPresented=0,this.stage=null,this.resizeObserver=null,this.intersectionObserver=null,this.intersecting=!0,this.occluded=!1,this.frame=null,this.lastPayload=``,this.connected=!1,this.schedule=()=>{this.connected&&this.frame===null&&(this.frame=requestAnimationFrame(()=>{this.frame=null,this.report()}))}}get hostElement(){let e=this.controller.host.renderRoot;return e instanceof ShadowRoot?e.host:e instanceof Element?e:null}connect(){this.connected||(this.connected=!0,this.hostElement?.setAttribute(`data-native-browser-scope`,this.scope),this.unsubscribeOcclusion=i(e=>{this.occluded=e,e&&this.hide(),this.schedule()},()=>this.stage?.getBoundingClientRect()??null),document.addEventListener(`scroll`,this.schedule,!0),window.addEventListener(`resize`,this.schedule),this.update())}disconnect(){this.hide(),this.hostElement?.removeAttribute(`data-native-browser-scope`),this.connected=!1,this.frame!==null&&(cancelAnimationFrame(this.frame),this.frame=null),this.resizeObserver?.disconnect(),this.intersectionObserver?.disconnect(),this.stage=null,this.unsubscribeOcclusion?.(),this.unsubscribeOcclusion=void 0,document.removeEventListener(`scroll`,this.schedule,!0),window.removeEventListener(`resize`,this.schedule),this.lastPayload=``,L({type:`release-scope`,scope:this.scope})}update(){if(!this.connected)return;let e=this.controller.host.renderRoot.querySelector(`.bp-stage`);e!==this.stage&&(this.resizeObserver?.disconnect(),this.intersectionObserver?.disconnect(),this.stage=e,this.intersecting=!0,e&&(typeof ResizeObserver==`function`&&(this.resizeObserver??=new ResizeObserver(this.schedule),this.resizeObserver.observe(e)),typeof IntersectionObserver==`function`&&(this.intersectionObserver??=new IntersectionObserver(e=>{let t=e.find(e=>e.target===this.stage);t&&(this.intersecting=t.isIntersecting,this.schedule())}),this.intersectionObserver.observe(e)))),this.canPresent()||this.hide(),this.schedule()}renew(){this.lastPayload=``,this.schedule()}hide(){this.connected&&this.send(null,null)}canPresent(){return!!(this.connected&&this.controller.host.isConnected&&this.controller.host.browserPanelIsOpen()&&this.controller.native.activeTab&&this.controller.mode===`interact`&&!this.occluded&&this.intersecting)}report(){let e=this.stage;if(!e||!this.canPresent()){this.hide();return}let t=e.getBoundingClientRect(),n=this.hostElement,r=document.elementFromPoint(t.x+t.width/2,t.y+t.height/2);for(;r?.shadowRoot&&typeof r.shadowRoot.elementFromPoint==`function`;){let e=r.shadowRoot.elementFromPoint(t.x+t.width/2,t.y+t.height/2);if(!e||e===r)break;r=e}let i=r;for(;i&&i!==n;)i=i instanceof ShadowRoot?i.host:i.parentNode;if(!i||t.width<=0||t.height<=0){this.hide();return}this.send(this.controller.activeTargetId,{x:t.x,y:t.y,width:t.width,height:t.height})}send(e,t){let n={type:`present`,scope:this.scope,tabId:e,rect:t,visible:!!e},r=JSON.stringify(n);r!==this.lastPayload&&(this.lastPayload=r,this.presentedTabId=e,e&&(this.lastPresented=++Ct),L(n).then(e=>{e&&!e.ok&&this.connected&&this.controller.reportError(e.error)}))}}})))()}var W,G,Et;function Dt(){return(Dt=e((()=>{B(),f(),D(),Tt(),U(),W=new Set,G=new Map,Et=class{constructor(e){this.controller=e,this.allNativeTabs=[],this.revision=-1,this.pendingActivation=null,this.pendingAddressFocus=null,this.captureGeneration=0,this.inspectionGeneration=0,this.presentation=new wt(e)}includesTab(e){return!this.controller.host.fixedTab&&(e.sessionKey===void 0||e.sessionKey===this.controller.host.sessionKey)}get nativeTabs(){return this.allNativeTabs.filter(e=>this.includesTab(e))}get activeTab(){return this.nativeTabs.find(e=>e.id===this.controller.activeTargetId)}get tabs(){return this.nativeTabs.map(e=>({...e,targetId:e.id,kind:`native`}))}connect(){if(!y()||this.unsubscribeState)return;W.add(this),this.revision=-1;let e=R();e&&this.acceptState(e,!1),this.unsubscribeState=dt(e=>this.acceptState(e,!0)),this.presentation.connect()}disconnect(){this.unsubscribeState&&(this.unsubscribeState(),this.unsubscribeState=void 0,W.delete(this),this.pendingActivation=null,this.cancelCapture(),this.presentation.disconnect())}mergeRemoteTabs(e){return[...this.tabs,...e.filter(e=>e.kind!==`native`)]}acceptState(e,t){if(e.revision<=this.revision)return;let n=new Set(this.nativeTabs.map(e=>e.id)),r=this.activeTab;this.revision=e.revision,this.allNativeTabs=e.tabs,this.controller.setState(`tabs`,this.mergeRemoteTabs(this.controller.tabs));let i=this.controller.view;i?.kind===`native`&&this.nativeTabs.find(e=>e.id===i.targetId)?.url!==i.url&&(this.controller.exitCaptureModes(),this.controller.setState(`view`,null));for(let t of G.keys())e.tabs.some(e=>e.id===t)||G.delete(t);for(let e of this.nativeTabs)if(e.id===this.pendingActivation)this.pendingActivation=null,this.controller.selectTab(e.id).then(()=>{this.pendingAddressFocus===e.id&&this.focusAddress(e.id)});else if(t&&e.openedBy===`native`&&!n.has(e.id)){if(!G.has(e.id)){let t=[...W].filter(t=>t.includesTab(e)),n=t.filter(t=>t.presentation.presentedTabId===e.openerTabId).toSorted((e,t)=>t.presentation.lastPresented-e.presentation.lastPresented)[0]??t.filter(e=>e.presentation.lastPresented>0).toSorted((e,t)=>t.presentation.lastPresented-e.presentation.lastPresented)[0];n&&G.set(e.id,n.presentation.scope)}G.get(e.id)===this.presentation.scope&&this.controller.selectTab(e.id)}if(r&&!this.activeTab){let e=this.controller.tabs[0];this.controller.setState(`activeTargetId`,null),this.controller.setState(`view`,null),this.controller.exitCaptureModes(),e&&!this.pendingActivation?this.controller.selectTab(e.id):e||this.controller.syncUrlDraft(``)}else!this.controller.activeTargetId&&!this.pendingActivation&&this.nativeTabs[0]&&this.controller.selectTab(this.nativeTabs[0].id);this.activeTab&&(this.controller.syncUrlDraft(this.activeTab.url),this.controller.mode===`interact`&&this.controller.setState(`loading`,this.activeTab.loading)),this.presentation.update()}async send(e){let t=await L(e);return t&&!t.ok&&this.controller.reportError(t.error),t?.ok===!0}cancelPendingActivation(e){this.pendingActivation=null,this.pendingAddressFocus!==e&&(this.pendingAddressFocus=null)}async open(e,t,n=!1){if(this.controller.setState(`errorText`,null),this.controller.setState(`pendingNewTab`,!1),!t&&this.activeTab){let t=this.activeTab.id;return this.controller.exitCaptureModes(),await this.send({type:`navigate`,tabId:t,url:e})?t:null}let r=`mac-${s()}`;this.pendingActivation=r,this.pendingAddressFocus=n?r:null;let i=await L({type:`open`,tabId:r,url:e,sessionKey:this.controller.host.sessionKey,activate:!0});return this.pendingActivation===r?!i?.ok||!i.tabId?(this.cancelPendingActivation(),i&&!i.ok&&this.controller.reportError(i.error),null):(this.pendingActivation=i.tabId,n&&(this.pendingAddressFocus=i.tabId),this.nativeTabs.some(e=>e.id===i.tabId)?(this.pendingActivation=null,await this.controller.selectTab(i.tabId),this.presentation.renew(),i.tabId):null):null}async beginNewTab(){let e=await this.open(`about:blank`,!0,!0);e&&this.pendingAddressFocus===e&&(await this.controller.host.updateComplete,this.focusAddress(e))}focusAddress(e){this.controller.activeTargetId===e&&(this.pendingAddressFocus=null,this.controller.host.isConnected&&this.controller.host.browserPanelIsOpen()&&(this.controller.setState(`urlDraft`,``),this.controller.host.renderRoot.querySelector(`.bp-url`)?.focus()))}cancelCapture(){this.captureGeneration+=1,this.inspectionGeneration+=1}async capture(e){let t=this.activeTab;if(!t)return;let n=++this.captureGeneration;this.controller.setState(`loading`,!0);let r=()=>n===this.captureGeneration&&this.controller.host.isConnected&&this.controller.host.browserPanelIsOpen()&&this.activeTab?.id===t.id&&this.activeTab.url===t.url;try{let n=await L({type:`snapshot`,tabId:t.id});if(!r())return;if(!n?.ok||typeof n.dataUrl!=`string`||typeof n.cssWidth!=`number`||typeof n.cssHeight!=`number`){n&&!n.ok&&this.controller.reportError(n.error);return}let i=await V(n.dataUrl);if(!r())return;this.controller.setState(`view`,{kind:`native`,targetId:t.id,dataUrl:n.dataUrl,image:i,url:t.url,metrics:{cssWidth:n.cssWidth,cssHeight:n.cssHeight,title:t.title,url:t.url}}),this.controller.setState(`mode`,e),this.presentation.hide()}catch(e){r()&&this.controller.reportError(e)}finally{r()&&this.controller.setState(`loading`,!1)}}inspect(e){let t=this.activeTab,n=this.controller.view,r=this.controller.host.renderRoot.querySelector(`.bp-stage`),i=pt(r,e,n),a=H(r,e);if(!t||n?.kind!==`native`||n.targetId!==t.id||n.url!==t.url||!i||!a||this.controller.mode!==`inspect`)return;let o=++this.inspectionGeneration,s=()=>o===this.inspectionGeneration&&this.controller.host.isConnected&&this.controller.host.browserPanelIsOpen()&&this.activeTab?.id===t.id&&this.activeTab.url===n.url&&this.controller.view===n&&this.controller.mode===`inspect`;this.controller.setState(`inspectPointer`,a),this.controller.setState(`inspected`,null),this.controller.pendingInput.queueInspection(120,s,()=>{L({type:`inspect`,tabId:t.id,x:i.x,y:i.y}).then(e=>{s()&&(e&&!e.ok?this.controller.reportError(e.error):e?.ok&&`node`in e&&(this.controller.setState(`inspected`,He(e.node)),this.controller.paintOverlay()))})})}}})))()}async function Ot(e,t,n,r,i){if(n||!r())return null;try{return await ke(e,t)}catch(e){if(r()&&C(e))throw e;return r()&&E(e)&&i(),null}}async function kt(e){let t=await We(e.client,e.targetId);if(!e.current())return null;let[n,r]=await Promise.all([Ke({resourceBasePath:e.host.resourceBasePath,authToken:e.host.authToken,path:t.path}),Ot(e.client,e.targetId,e.isEvaluateUnavailable(),e.current,e.markEvaluateUnavailable)]);if(!e.current())return null;let i=await V(n);if(!e.current())return null;let a=t.url&&r?.url&&t.url!==r.url?null:r;return{targetId:e.targetId,dataUrl:n,image:i,url:t.url,metrics:a,...e.route?{browserTab:{...e.route,targetId:e.targetId}}:{}}}var At;function K(){return(K=e((()=>{D(),U(),At=class{constructor(e){this.host=e,this.lifecycleEpoch=0,this.requestedMutation=0,this.requestedSnapshot=0,this.acceptedSnapshot=0,this.requestedCapture=0,this.requestedInspection=0,this.capturePending=!1,this.navigationQueues=new WeakMap,this.navigationCommits=new WeakMap}get epoch(){return this.lifecycleEpoch}get hasPendingCapture(){return this.capturePending}captureClient(){let e=this.host.client,t=JSON.stringify(this.host.dashboardTarget);if(!(this.host.remoteAvailable??this.host.available)||!e||!this.host.isConnected||!this.host.browserPanelIsOpen())return null;if(this.scope?.gateway!==e||this.scope.dashboardKey!==t){let n=Ge(e,this.route,()=>this.scope?.client===n&&this.scope.gateway===this.host.client&&JSON.stringify(this.host.dashboardTarget)===t&&(this.host.remoteAvailable??this.host.available)&&this.host.isConnected&&this.host.browserPanelIsOpen(),this.host.dashboardTarget);this.scope={gateway:e,client:n,dashboardKey:t}}return this.scope.client}resetRoute(e){this.invalidate(),this.route=e,this.scope=void 0}isLive(e,t){return this.host.isConnected&&this.host.available&&this.host.browserPanelIsOpen()&&this.lifecycleEpoch===e&&this.scope?.dashboardKey===JSON.stringify(this.host.dashboardTarget)&&(t===void 0||this.scope?.gateway===this.host.client&&this.scope.client===t)}invalidate(){this.lifecycleEpoch+=1,this.capturePending=!1,this.invalidateInspection()}invalidateInspection(){this.requestedInspection+=1}beginMutation(e){this.requestedCapture+=1,this.capturePending=!1;let t={client:e,epoch:this.lifecycleEpoch,id:++this.requestedMutation,mutationId:this.requestedMutation,isCurrent:()=>this.isLive(t.epoch,e)&&t.id===this.requestedMutation};return t}hasQueuedNavigation(e,t){return this.navigationQueues.get(e)?.has(t)??!1}hasUnreconciledNavigation(e,t){return!e||!t?!1:this.navigationCommits.get(e)?.has(t)??!1}hasPendingNavigation(e,t){return!!(e&&t&&(this.hasQueuedNavigation(e,t)||this.hasUnreconciledNavigation(e,t)))}markNavigationCommitted(e,t){let n=this.navigationCommits.get(e);n||(n=new Set,this.navigationCommits.set(e,n)),n.add(t)}markNavigationReconciled(e,t){this.forgetNavigation(e,t)}forgetNavigation(e,t){let n=this.navigationCommits.get(e);n?.delete(t),n?.size===0&&this.navigationCommits.delete(e)}retainTabSnapshot(e,t){let n=this.navigationCommits.get(e);if(!n)return t;let r=new Set(t.map(e=>e.id));for(let e of n.keys())r.has(e)||n.delete(e);return n.size===0&&this.navigationCommits.delete(e),t}capturedTabs(e,t,n,r){let i=e.find(e=>e.id===t);if(!i)return e;let a=n?.title??i.title,o=n?.url||r||i.url;return a===i.title&&o===i.url&&!i.urlUnavailableReason?e:e.map(e=>e.id===t?{...e,title:a,url:o,urlUnavailableReason:void 0}:e)}async queueNavigation(e,t,n){let r=this.navigationQueues.get(e);r||(r=new Map,this.navigationQueues.set(e,r));let i=r.get(t),a=i?i.then(n,n):n();r.set(t,a);try{return await a}finally{r.get(t)===a&&(r.delete(t),r.size===0&&this.navigationQueues.delete(e))}}beginSnapshot(e){let t=this.requestedMutation,n={client:e,epoch:this.lifecycleEpoch,id:++this.requestedSnapshot,mutationId:t,isCurrent:()=>this.isLive(n.epoch,e)&&n.id===this.requestedSnapshot&&t===this.requestedMutation};return n}acceptSnapshot(e,t,n){return!this.isLive(e.epoch,e.client)||e.id<this.acceptedSnapshot||!e.isCurrent()&&n!==t?!1:(this.acceptedSnapshot=e.id,!0)}canCaptureSnapshot(e){return this.isLive(e.epoch,e.client)&&e.mutationId===this.requestedMutation}survivingInvocation(e,t){let n=this.lifecycleEpoch,r=this.requestedMutation;return()=>this.isLive(n,t)&&r===this.requestedMutation&&(r!==e.id||n!==e.epoch)}beginCapture(e,t,n,r=this.lifecycleEpoch){if(!this.isLive(r,e)||n()!==t)return null;let i=++this.requestedCapture;return this.capturePending=!0,()=>this.isLive(r,e)&&n()===t&&i===this.requestedCapture}completeCapture(){this.capturePending=!1}beginInspection(e,t){let n=this.lifecycleEpoch,r=++this.requestedInspection;return()=>this.isLive(n,e)&&r===this.requestedInspection&&t()}}})))()}var jt;function Mt(){return(Mt=e((()=>{jt=class{constructor(){this.refreshTimer=null,this.viewportResizeTimer=null,this.wheelTimer=null,this.inspectTimer=null,this.wheelDeltaX=0,this.wheelDeltaY=0,this.lastInspectAt=0}clear(){this.refreshTimer!==null&&(clearTimeout(this.refreshTimer),this.refreshTimer=null),this.viewportResizeTimer!==null&&(clearTimeout(this.viewportResizeTimer),this.viewportResizeTimer=null),this.clearInput()}clearInput(){this.wheelTimer!==null&&(clearTimeout(this.wheelTimer),this.wheelTimer=null),this.inspectTimer!==null&&(clearTimeout(this.inspectTimer),this.inspectTimer=null),this.wheelDeltaX=0,this.wheelDeltaY=0,this.lastInspectAt=0}scheduleRefresh(e,t){this.refreshTimer!==null&&clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>{this.refreshTimer=null,t()},e)}scheduleViewportResize(e,t){this.viewportResizeTimer!==null&&clearTimeout(this.viewportResizeTimer),this.viewportResizeTimer=window.setTimeout(()=>{this.viewportResizeTimer=null,t()},e)}queueWheel(e,t,n,r){this.wheelDeltaX+=e,this.wheelDeltaY+=t,this.wheelTimer===null&&(this.wheelTimer=window.setTimeout(()=>{this.wheelTimer=null;let e=this.wheelDeltaX,t=this.wheelDeltaY;this.wheelDeltaX=0,this.wheelDeltaY=0,(e!==0||t!==0)&&r(e,t)},n))}queueInspection(e,t,n){let r=()=>{t()&&(this.lastInspectAt=Date.now(),n())};if(Date.now()-this.lastInspectAt>=e){r();return}this.inspectTimer!==null&&clearTimeout(this.inspectTimer),this.inspectTimer=window.setTimeout(()=>{this.inspectTimer=null,r()},e)}}})))()}var Nt;function Pt(){return(Pt=e((()=>{D(),K(),Nt=class{constructor(e,t){this.controller=e,this.viewport=t}async listTabs(e){let t=await Se(e),n=this.controller.host.fixedTab;if(!n)return t;let r=t.tabs.filter(e=>e.id===n.targetId||e.targetId===n.targetId);for(let e of r)e.id=n.targetId;return{...t,tabs:r}}async refreshTabs(e,t){let n=this.controller,r=n.operations.beginSnapshot(e);try{let i=await this.listTabs(e);return t()&&n.operations.acceptSnapshot(r,n.activeTargetId,n.activeTargetId)?(n.setState(`running`,i.running),n.setState(`tabs`,n.native.mergeRemoteTabs(n.operations.retainTabSnapshot(e,i.tabs))),n.clearUnavailableView(),`accepted`):`rejected`}catch{return t()&&r.isCurrent()?`failed`:`rejected`}}async capture(e,t=this.controller.operations.epoch){let n=this.controller.operations.captureClient();if(this.controller.native.activeTab||!n||!this.controller.operations.isLive(t,n)||this.controller.activeTargetId!==e||this.controller.mode!==`interact`||this.controller.clearUnavailableView()||this.controller.stream.ownsView(e))return;let r=this.controller.operations.beginCapture(n,e,()=>this.controller.activeTargetId,t);if(!r)return;this.controller.setState(`loading`,!0);let i=this.controller.stream,a=i.frameRevision,o=()=>r()&&this.controller.mode===`interact`&&a===i.frameRevision&&!i.ownsView(e);try{if(await i.ensure(e,n,t)||!r()||i.ownsView(e))return;a=i.frameRevision;let s=await kt({client:n,targetId:e,route:this.controller.operations.route,host:this.controller.host,isEvaluateUnavailable:()=>this.controller.evaluateUnavailable,current:o,markEvaluateUnavailable:()=>this.controller.setState(`evaluateUnavailable`,!0)});if(!s||!o())return;let{metrics:c}=s;this.controller.setState(`tabs`,this.controller.operations.capturedTabs(this.controller.tabs,e,c,s.url)),this.controller.setState(`view`,s),i.releaseReplacedView(),this.viewport.captured(c),s.url&&this.controller.syncUrlDraft(s.url)}catch(t){o()&&(C(t)?(this.controller.setState(`tabs`,this.controller.tabs.map(t=>t.id===e?{...t,url:``,urlUnavailableReason:`navigation_blocked`}:t)),this.controller.clearUnavailableView()||this.controller.reportError(t)):this.controller.reportError(t))}finally{r()&&(this.controller.operations.completeCapture(),this.controller.setState(`loading`,!1))}}}})))()}var Ft;function It(){return(It=e((()=>{Ft=class{constructor(e,t=e=>new WebSocket(e)){this.options=e,this.closed=!1,this.socket=t(at(e.wsPath,e.gatewayUrl)),this.socket.binaryType=`arraybuffer`,this.socket.addEventListener(`message`,e=>this.receive(e.data)),this.socket.addEventListener(`close`,({code:e,reason:t})=>this.finish(e,t)),this.socket.addEventListener(`error`,()=>{this.finish(1006,``),this.socket.close()})}close(){this.closed=!0,this.socket.close()}finish(e,t){this.closed||(this.closed=!0,this.options.onClose({code:e,reason:t}))}receive(e){if(!this.closed)try{if(typeof e==`string`){let n=t(JSON.parse(e));if(n?.type===`error`){this.finish(1011,``),this.socket.close();return}if(typeof n?.url!=`string`||typeof n.title!=`string`)throw Error(`Invalid screencast metadata`);if(n.type===`ready`&&typeof n.targetId==`string`)this.options.onReady({targetId:n.targetId,url:n.url,title:n.title});else if(n.type===`meta`)this.options.onMeta({url:n.url,title:n.title});else throw Error(`Invalid screencast message`);return}if(!(e instanceof ArrayBuffer)||e.byteLength<5)throw Error(`Invalid screencast frame`);let n=new DataView(e).getUint32(0);if(n===0||n>=e.byteLength-4)throw Error(`Invalid screencast header length`);let r=t(JSON.parse(new TextDecoder().decode(new Uint8Array(e,4,n))));if(typeof r?.url!=`string`||typeof r.cssWidth!=`number`||!Number.isFinite(r.cssWidth)||r.cssWidth<=0||typeof r.cssHeight!=`number`||!Number.isFinite(r.cssHeight)||r.cssHeight<=0)throw Error(`Invalid screencast dimensions`);this.options.onFrame({blob:new Blob([new Uint8Array(e,4+n)],{type:`image/jpeg`}),url:r.url,cssWidth:r.cssWidth,cssHeight:r.cssHeight})}catch{this.finish(1002,``),this.socket.close()}}}})))()}var Lt,q,Rt,zt;function Bt(){return(Bt=e((()=>{D(),U(),It(),O(),Lt=1500,q=1e4,Rt=500,zt=class{constructor(e){this.host=e,this.frameRevision=0,this.unsupported=!1,this.lastFailures=new Map,this.viewportSyncPending=!1,this.retiringUrls=new Set}ownsView(e){return!!(this.attempt?.live&&this.attempt.targetId===e&&this.current(this.attempt))}current(e){return this.attempt===e&&this.host.activeTargetId===e.targetId&&this.host.operations.isLive(e.epoch,e.client)}dimensions(){let e=this.host.host.renderRoot.querySelector(`.bp-stage`),t=this.host.host.renderRoot.querySelector(`.bp-viewport`),n=e?.clientWidth||t?.clientWidth||this.host.observedViewportSize?.width||1280,r=t?.clientHeight||this.host.observedViewportSize?.height||n,i=globalThis.devicePixelRatio||1;return{width:n,maxWidth:Math.min(2e3,Math.ceil(n*i)),maxHeight:Math.min(2e3,Math.ceil(Math.max(n,r)*i))}}async ensure(e,t,n){let r=w(this.host.operations.route);if((!this.scope||this.scope.client!==this.host.host.client||this.scope.route!==r)&&(this.close(),this.scope={client:this.host.host.client,route:r},this.unsupported=!1),this.attempt&&this.current(this.attempt)&&this.attempt.targetId===e)return this.attempt.live||await this.attempt.firstFrame;if(this.unsupported||Date.now()-(this.lastFailures.get(e)??-1/0)<q)return!1;this.close(!1);let i=this.dimensions(),a,o=new Promise(e=>{let t=setTimeout(()=>e(!1),Lt);a=n=>{clearTimeout(t),e(n)}}),s={targetId:e,client:t,epoch:n,width:i.width,live:!1,firstFrame:o,settle:a,decoding:!1,presented:!1};return this.attempt=s,this.connect(s,{maxWidth:i.maxWidth,maxHeight:i.maxHeight}),await o}async connect(e,t){try{let n=await je(e.client,{targetId:e.targetId,...t});if(!this.current(e))return;e.connection=new Ft({gatewayUrl:this.host.host.client.gatewayUrl,wsPath:n.wsPath,onReady:({url:t,title:n})=>this.updateMetadata(e,{url:t,title:n}),onMeta:t=>this.updateMetadata(e,t),onFrame:t=>{this.current(e)&&(this.frameRevision+=1,e.live=!0,e.pendingFrame=t,e.decoding||this.decodeFrames(e))},onClose:({code:t})=>{if(this.current(e)){if(t!==4003&&t!==4004){this.recover(e);return}this.close(),t===4003?(this.host.setState(`tabs`,this.host.tabs.map(t=>t.id===e.targetId?{...t,url:``,urlUnavailableReason:`navigation_blocked`}:t)),this.host.clearUnavailableView()):t===4004&&this.host.refreshAll()}}})}catch(t){this.current(e)&&(this.unsupported=Ce(t),this.unsupported?this.close(!1):this.recover(e))}}recover(e){this.lastFailures.set(e.targetId,Date.now()),this.close(!1),this.recovery={targetId:e.targetId,epoch:e.epoch,client:e.client},this.scheduleRecovery(e.live?0:q)}scheduleRecovery(e){let t=this.recovery;t&&(clearTimeout(this.recoveryTimer),this.recoveryTimer=setTimeout(()=>{if(this.recoveryTimer=void 0,this.host.activeTargetId!==t.targetId||!this.host.operations.isLive(t.epoch,t.client)){this.recovery=void 0;return}this.host.mode===`interact`&&(this.scheduleRecovery(q),this.resume(t))},e))}async resume(e){await this.ensure(e.targetId,e.client,e.epoch)||this.host.activeTargetId===e.targetId&&this.host.operations.isLive(e.epoch,e.client)&&!this.host.operations.hasPendingCapture&&this.host.refreshView(e.targetId)}updateMetadata(e,t){this.current(e)&&(e.metadata=t,this.host.setState(`tabs`,this.host.tabs.map(n=>n.id===e.targetId?{...n,...t,urlUnavailableReason:void 0}:n)),this.host.urlDraftEditing||this.host.setState(`urlDraft`,t.url))}flushPendingFrame(){this.scheduleRecovery(0);let e=this.attempt;e&&this.current(e)&&!e.decoding&&this.decodeFrames(e),this.restartAfterResize()}async decodeFrames(e){e.decoding=!0;try{for(;this.current(e)&&e.pendingFrame;){if(this.host.mode!==`interact`)return;let t=e.pendingFrame,n=e.metadata;e.pendingFrame=void 0;let r=URL.createObjectURL(t.blob);this.decodingUrl=r;let i=await V(r);if(!this.current(e))return;if(this.host.mode!==`interact`){e.pendingFrame??=t,URL.revokeObjectURL(r),this.decodingUrl=void 0;return}if(n!==e.metadata&&e.metadata?.url!==t.url){URL.revokeObjectURL(r),this.decodingUrl=void 0;continue}let a=this.objectUrl;this.decodingUrl=void 0,this.objectUrl=r;let o=e.metadata?.url===t.url?e.metadata.title:this.host.tabs.find(t=>t.id===e.targetId)?.title??``,s={cssWidth:t.cssWidth,cssHeight:t.cssHeight,title:o,url:t.url};this.host.setState(`tabs`,this.host.operations.capturedTabs(this.host.tabs,e.targetId,s,t.url)),this.host.setState(`view`,{targetId:e.targetId,dataUrl:r,image:i,url:t.url,metrics:s,...this.host.operations.route?{browserTab:{...this.host.operations.route,targetId:e.targetId}}:{}}),this.host.operations.markNavigationReconciled(e.client,e.targetId),this.host.urlDraftEditing||this.host.setState(`urlDraft`,t.url),this.host.observedViewportSize&&(Math.abs(t.cssWidth-this.host.observedViewportSize.width)>1||Math.abs(t.cssHeight-this.host.observedViewportSize.height)>1)&&!this.viewportSyncPending&&(this.viewportSyncPending=!0,this.host.scheduleViewportSync()),e.presented||(e.presented=!0,this.host.setState(`loading`,!1)),e.settle(!0),await this.retireAfterUpdate(a)}}catch{this.current(e)&&this.recover(e)}finally{e.decoding=!1}}resize(){this.viewportSyncPending=!1,this.restartAfterResize()}resized(e){return Math.abs(this.dimensions().width-e.width)/e.width>.3}restartAfterResize(){let e=this.attempt;e&&this.current(e)&&this.resized(e)&&(this.resizeTimer??=setTimeout(()=>{this.resizeTimer=void 0,this.attempt===e&&this.current(e)&&this.resized(e)&&this.host.mode===`interact`&&(this.close(!1),this.host.refreshView(e.targetId))},Rt))}releaseReplacedView(){let e=this.objectUrl;this.objectUrl=void 0,this.retireAfterUpdate(e)}async retireAfterUpdate(e){e&&this.retiringUrls.add(e),await this.host.host.updateComplete,e&&this.retiringUrls.delete(e)&&URL.revokeObjectURL(e)}close(e=!0){e&&this.lastFailures.clear(),clearTimeout(this.recoveryTimer),this.recoveryTimer=void 0,this.recovery=void 0,clearTimeout(this.resizeTimer),this.resizeTimer=void 0,this.viewportSyncPending=!1;let t=this.attempt;this.attempt=void 0,t?.settle(!1),t?.connection?.close();for(let t of[e?this.objectUrl:void 0,this.decodingUrl,...e?this.retiringUrls:[]])t&&URL.revokeObjectURL(t);e&&(this.objectUrl=void 0,this.retiringUrls.clear()),this.decodingUrl=void 0}}})))()}var Vt,J,Y,Ht;function X(){return(X=e((()=>{D(),Vt=300,J=100,Y=8192,Ht=class{constructor(e){this.controller=e,this.observedViewportSize=null,this.lastRequestedViewport=null}invalidate(){this.lastRequestedViewport=null}captured(e){e&&this.observedViewportSize&&(Math.abs(e.cssWidth-this.observedViewportSize.width)>1||Math.abs(e.cssHeight-this.observedViewportSize.height)>1)&&this.schedule()}resize(e,t){this.observedViewportSize={width:e,height:t},this.schedule()}schedule(){this.controller.native.activeTab||this.controller.pendingInput.scheduleViewportResize(Vt,()=>this.syncViewport())}syncViewport(){let e=this.controller.activeTargetId,t=this.observedViewportSize;if(this.controller.native.activeTab||!this.controller.host.browserPanelIsOpen()||!this.controller.operations.captureClient()||!e||!t)return;this.controller.stream.resize();let n=Math.min(Y,Math.max(J,Math.round(t.width))),r=Math.min(Y,Math.max(J,Math.round(t.height))),i=this.controller.view?.targetId===e?this.controller.view:null;if(!i)return;let a=i.metrics;a&&Math.abs(a.cssWidth-n)<=1&&Math.abs(a.cssHeight-r)<=1||(this.lastRequestedViewport?.targetId!==e||this.lastRequestedViewport.width!==n||this.lastRequestedViewport.height!==r)&&(this.lastRequestedViewport={targetId:e,width:n,height:r},this.controller.runAction(t=>we(t,{targetId:e,width:n,height:r})))}}})))()}function Z(e){let t=e.trim();if(!t)return null;let n=/^[a-z][a-z0-9+.-]*:(?![0-9])/i.test(t);if(n&&!/^https?:\/\//i.test(t))return null;let r=n?t:`https://${t}`;try{let e=new URL(r);return e.protocol===`http:`||e.protocol===`https:`?e.toString():null}catch{return null}}var Ut,Wt;function Gt(){return(Gt=e((()=>{B(),ge(),o(),c(),d(),D(),bt(),St(),Dt(),K(),Mt(),Pt(),Bt(),X(),O(),Ut=350,Wt=class{constructor(e){this.host=e,this.running=null,this.tabs=[],this.activeTargetId=null,this.view=null,this.loading=!1,this.errorText=null,this.noticeText=null,this.mode=`interact`,this.strokes=[],this.inspected=null,this.inspectPointer=null,this.evaluateUnavailable=!1,this.urlDraft=``,this.pendingNewTab=!1,this.pendingInput=new jt,this.download=new xt(this),this.activeClient=null,this.urlDraftEditing=!1,this.viewport=new Ht(this),this.snapshot=new Nt(this,this.viewport),this.operations=new At(e),this.input=new yt(this),this.stream=new zt(this),this.native=new Et(this),e.addController(this)}hostConnected(){this.native.connect()}hostUpdated(){this.native.presentation.update()}hostDisconnected(){this.suspendView(),this.native.disconnect()}suspendView(){this.native.cancelCapture(),this.native.presentation.hide(),this.input.resetCaptureState(),this.invalidateViewOperations(),this.view?.dataUrl.startsWith(`blob:`)&&this.setState(`view`,null),this.setState(`loading`,!1)}setState(e,t){Object.is(this[e],t)||((e===`view`&&t===null||e===`activeTargetId`)&&this.stream.close(),Object.assign(this,{[e]:t}),this.host.requestUpdate(),(e===`activeTargetId`||e===`mode`)&&this.native.presentation.update())}synchronizeClient(){return this.host.client!==this.activeClient&&(this.activeClient=this.host.client,this.operations.resetRoute(),this.resetBrowserState(),!0)}get unavailableTabText(){let e=this.tabs.find(e=>e.id===this.activeTargetId)?.urlUnavailableReason;return e?u(e===`navigation_blocked`?`browser.navigationBlocked`:`browser.navigationCheckFailed`):null}clearUnavailableView(){return this.unavailableTabText?(this.invalidateViewOperations(),this.setState(`view`,null),this.setState(`loading`,!1),this.setState(`urlDraft`,``),this.setState(`errorText`,null),this.exitCaptureModes(),!0):!1}invalidateViewOperations(){this.download.cancel(),this.stream.close(),this.operations.invalidate(),this.pendingInput.clear(),this.viewport.invalidate()}resetBrowserState(){this.invalidateViewOperations(),this.setState(`running`,null);let e=this.native.activeTab??this.native.tabs[0];this.setState(`tabs`,this.native.tabs),this.setState(`activeTargetId`,e?.id??null),this.setState(`view`,null),this.setState(`loading`,!1),this.setState(`errorText`,null),this.setState(`noticeText`,null),this.setState(`mode`,`interact`),this.setState(`strokes`,[]),this.input.resetCaptureState(),this.setState(`inspected`,null),this.setState(`inspectPointer`,null),this.urlDraftEditing=!1,this.setState(`urlDraft`,e?.url??``),this.setState(`pendingNewTab`,!1),this.setState(`evaluateUnavailable`,!1)}reportError(e){let t=C(e)?u(`browser.navigationBlocked`):a(e);this.setState(`errorText`,u(`browser.errors.requestFailed`,{error:t}))}async refreshAll(){this.native.presentation.update();let e=this.operations.captureClient();if(!e)return;let t=this.operations.beginSnapshot(e);this.setState(`errorText`,null),!this.native.activeTab&&!this.stream.ownsView(this.activeTargetId)&&this.setState(`loading`,!0);try{let n=await this.snapshot.listTabs(e),r=n.tabs.find(e=>e.id===this.activeTargetId||e.targetId===this.activeTargetId),i=r??n.tabs.find(e=>!e.urlUnavailableReason)??n.tabs[0];if(!this.operations.acceptSnapshot(t,this.activeTargetId,i?.id??null)||(this.setState(`running`,n.running),this.setState(`tabs`,this.native.mergeRemoteTabs(this.operations.retainTabSnapshot(e,n.tabs))),this.native.activeTab)||!this.operations.canCaptureSnapshot(t))return;n.running||this.setState(`view`,null),this.activeTargetId!==null&&!r&&(this.invalidateViewOperations(),t.epoch=this.operations.epoch,this.setState(`view`,null),this.exitCaptureModes()),this.setState(`activeTargetId`,i?.id??null),this.urlDraftEditing||this.setState(`urlDraft`,i?.url??``),i?await this.refreshView(i.id,t.epoch):this.setState(`view`,null)}catch(e){t.isCurrent()&&this.reportError(e)}finally{t.isCurrent()&&!this.native.activeTab&&this.setState(`loading`,!1)}}async refreshView(e,t=this.operations.epoch){await this.snapshot.capture(e,t)}async runAction(e,t=!0){let n=this.operations.captureClient();if(!n)return!1;let r=this.operations.epoch,i=()=>this.operations.isLive(r,n);try{return this.setState(`errorText`,null),await e(n),i()&&t&&this.pendingInput.scheduleRefresh(Ut,()=>{i()&&this.activeTargetId&&this.refreshView(this.activeTargetId,r)}),i()}catch(e){return i()?(E(e)&&this.setState(`evaluateUnavailable`,!0),this.reportError(e),this.operations.hasPendingCapture||this.setState(`loading`,!1),!1):!1}}get observedViewportSize(){return this.viewport.observedViewportSize}scheduleViewportSync(){this.viewport.schedule()}handleViewportResize(e,t){this.viewport.resize(e,t)}async startBrowserNow(){if(this.host.fixedTab||!this.operations.captureClient())return;let e=this.operations.epoch;this.setState(`loading`,!0),await this.runAction(async t=>{await Oe(t),this.operations.isLive(e,t)&&await this.refreshAll()},!1)}async openUrl(e,t){if(this.host.fixedTab&&(t.newTab||t.native||!this.activeTargetId)){this.reportError(u(`browser.tabUnavailable`));return}if(y()&&(t.native||t.newTab||this.native.activeTab||!this.activeTargetId)){await this.native.open(e,t.newTab||!this.native.activeTab);return}let n=this.operations.captureClient();if(!n)return;let r=this.operations.beginMutation(n);this.setState(`loading`,!0),this.setState(`errorText`,null),this.setState(`pendingNewTab`,!1);let i=!1;try{if(t.newTab||!this.activeTargetId){let t=await Ue(n,e);if(!r.isCurrent()){await this.snapshot.refreshTabs(n,this.operations.survivingInvocation(r,n));return}let i=t?.id??this.activeTargetId;i!==this.activeTargetId&&(this.invalidateViewOperations(),r.epoch=this.operations.epoch,this.setState(`view`,null),this.exitCaptureModes()),this.setState(`activeTargetId`,i)}else{this.invalidateViewOperations(),r.epoch=this.operations.epoch,this.exitCaptureModes();let t=this.activeTargetId;if(i=this.operations.hasQueuedNavigation(n,t)||this.operations.hasUnreconciledNavigation(n,t),await this.operations.queueNavigation(n,t,async()=>{r.isCurrent()&&(await Ae(n,{url:e,targetId:t}),this.operations.markNavigationCommitted(n,t))}),!r.isCurrent())return;this.setState(`view`,null)}if(await this.snapshot.refreshTabs(n,()=>r.isCurrent())!==`rejected`&&r.isCurrent()&&this.activeTargetId){let e=this.activeTargetId;await this.refreshView(e,r.epoch),!t.newTab&&r.isCurrent()&&this.view?.targetId===e&&this.operations.markNavigationReconciled(n,e)}}catch(e){if(r.isCurrent()){if(i&&this.activeTargetId){let e=this.activeTargetId,t=await this.snapshot.refreshTabs(n,()=>r.isCurrent()),i=this.tabs.find(t=>t.id===e);t===`accepted`&&r.isCurrent()&&i&&(this.setState(`view`,null),await this.refreshView(e,r.epoch),r.isCurrent()&&this.view?.targetId===e&&this.operations.markNavigationReconciled(n,e)),r.isCurrent()&&this.operations.hasUnreconciledNavigation(n,e)&&(this.setState(`activeTargetId`,null),this.setState(`view`,null),this.urlDraftEditing||this.setState(`urlDraft`,``))}this.reportError(e)}}finally{r.isCurrent()&&this.setState(`loading`,!1)}}async selectTab(e,t,n){let r=this.host.fixedTab;if(r&&(t&&w(t)!==w(r)||e!==r.targetId&&!this.tabs.some(t=>t.id===e&&t.targetId===r.targetId)))return;this.native.cancelPendingActivation(e);let i=this.native.tabs.find(t=>t.id===e);if(i){this.invalidateViewOperations(),this.exitCaptureModes(),this.setState(`activeTargetId`,e),this.setState(`view`,null),this.setState(`urlDraft`,i.url),this.setState(`loading`,this.native.activeTab?.loading??!1),this.setState(`errorText`,null),this.native.presentation.renew();return}if(t&&w(this.operations.route)!==w(t))this.operations.resetRoute(t),this.resetBrowserState();else if(e===this.activeTargetId&&!t)return;let a=this.operations.captureClient(),o={targetId:this.activeTargetId,view:this.view};this.invalidateViewOperations();let s=this.operations.epoch;if(this.setState(`activeTargetId`,t?null:e),this.setState(`view`,null),this.exitCaptureModes(),(t||!this.clearUnavailableView())&&!await this.runAction(async r=>{if(t){let t=await this.snapshot.refreshTabs(r,()=>this.operations.isLive(s,r));if(!this.operations.isLive(s,r))return;let n=this.tabs.find(t=>t.id===e||t.targetId===e);if(this.setState(`activeTargetId`,this.running===!1?null:n?.id??e),t===`accepted`&&this.running!==!1&&!n)throw Error(u(`browser.tabUnavailable`));if(this.clearUnavailableView())return}let i=this.activeTargetId;i&&(n?.focusBrowserTab!==!1&&await Je(r,i),this.operations.isLive(s,r)&&(await this.refreshView(i,s),this.operations.isLive(s,r)&&this.activeTargetId===i&&this.view?.targetId===i&&this.operations.markNavigationReconciled(r,i)))},!1)&&this.operations.isLive(s)&&this.activeTargetId===e){if(this.operations.hasPendingNavigation(a,o.targetId)){this.setState(`activeTargetId`,null),this.urlDraftEditing||this.setState(`urlDraft`,``);return}this.setState(`activeTargetId`,o.targetId),this.setState(`view`,o.view?.dataUrl.startsWith(`blob:`)?null:o.view),o.targetId&&o.view?.dataUrl.startsWith(`blob:`)&&await this.refreshView(o.targetId)}}async closeTab(e){if(!this.host.fixedTab){if(this.native.tabs.some(t=>t.id===e)){await this.native.send({type:`close`,tabId:e});return}await this.runAction(async t=>{let n=this.operations.epoch;if(await Be(t,e),this.operations.forgetNavigation(t,e),!this.operations.isLive(n,t)){this.operations.isLive(this.operations.epoch,t)&&await this.refreshAll();return}this.setState(`tabs`,this.tabs.filter(t=>t.id!==e));let r=await this.snapshot.refreshTabs(t,()=>this.operations.isLive(n,t));if(!this.operations.isLive(n,t))return;if(this.activeTargetId!==e){r!==`rejected`&&!this.operations.hasPendingCapture&&this.setState(`loading`,!1);return}let i=this.tabs.find(e=>!e.urlUnavailableReason)??this.tabs[0]??null;if(i?.kind===`native`){await this.selectTab(i.id);return}this.invalidateViewOperations(),this.setState(`activeTargetId`,i?.id??null),this.setState(`view`,null),this.exitCaptureModes(),i?await this.refreshView(i.id):this.setState(`loading`,!1)},!1),await this.host.updateComplete}}reloadPage(){if(this.native.activeTab){this.exitCaptureModes(),this.native.send({type:this.native.activeTab.loading?`stop`:`reload`,tabId:this.native.activeTab.id});return}if(this.unavailableTabText){this.refreshAll();return}let e=Z(this.view?.metrics?.url||this.view?.url||this.urlDraft);if(this.activeTargetId){if(!e){this.refreshView(this.activeTargetId);return}this.openUrl(e,{newTab:!1})}}goHistory(e){if(this.native.activeTab){this.exitCaptureModes(),this.native.send({type:e===-1?`back`:`forward`,tabId:this.native.activeTab.id});return}let t=this.activeTargetId;t&&this.view&&this.runAction(n=>ze(n,{targetId:t,delta:e}))}commitUrlDraft(){let e=Z(this.urlDraft);e&&this.openUrl(e,{newTab:this.pendingNewTab||this.tabs.length===0})}beginNewTab(){if(this.host.fixedTab)return;if(y()){this.native.beginNewTab();return}this.setState(`pendingNewTab`,!0),this.setState(`urlDraft`,``);let e=this.operations.epoch;this.host.updateComplete.then(()=>{this.operations.isLive(e)&&this.host.renderRoot.querySelector(`.bp-url`)?.focus()})}setUrlDraftEditing(e){this.urlDraftEditing=e}resetUrlDraftFromView(){this.setState(`urlDraft`,this.native.activeTab?.url||this.view?.metrics?.url||this.view?.url||``)}syncUrlDraft(e){this.urlDraftEditing||this.setState(`urlDraft`,e)}openExternal(){let e=this.native.activeTab?.url||this.view?.metrics?.url||this.view?.url||this.urlDraft;e&&!(this.native.activeTab&&fe(e))&&ee(e)}exitCaptureModes(){this.native.cancelCapture(),this.native.activeTab&&this.setState(`view`,null),this.operations.invalidateInspection(),this.input.resetCaptureState(),this.setState(`mode`,`interact`),this.setState(`strokes`,[]),this.setState(`inspected`,null),this.setState(`inspectPointer`,null),this.stream.flushPendingFrame()}setMode(e){if(this.mode===e){this.exitCaptureModes();return}if(this.exitCaptureModes(),this.native.activeTab&&e!==`interact`){this.native.capture(e);return}this.setState(`mode`,e),this.setState(`noticeText`,null),e===`inspect`&&this.evaluateUnavailable&&(this.setState(`errorText`,u(`browser.inspectUnavailable`)),this.setState(`mode`,`interact`))}inspectHighlightRegion(){return this.input.inspectHighlightRegion()}handleStageClick(e){this.native.activeTab||this.input.handleStageClick(e)}handleWheel(e){this.native.activeTab||this.input.handleWheel(e)}handleViewportKeydown(e){this.native.activeTab||this.input.handleViewportKeydown(e)}handleViewportPaste(e){this.native.activeTab||this.input.handleViewportPaste(e)}handleOverlayPointerDown(e){this.input.handleOverlayPointerDown(e)}handleOverlayPointerMove(e){this.native.activeTab&&this.mode===`inspect`?this.native.inspect(e):this.input.handleOverlayPointerMove(e)}handleOverlayPointerUp(e){this.input.handleOverlayPointerUp(e)}undoStroke(){this.input.undoStroke()}clearStrokes(){this.input.clearStrokes()}async sendAnnotation(e){await this.input.sendAnnotation(e)}paintOverlay(){this.input.paintOverlay()}}})))()}function Kt(e){if(e.title.trim())return e.title.trim();try{return new URL(e.url).host||u(`browser.untitledTab`)}catch{return e.url||u(`browser.untitledTab`)}}function qt(e){return e.map(e=>({id:e.id,label:Kt(e),url:e.url,favicon:e.favicon,icon:e.kind===`native`?_.monitor:_.globe}))}function Jt(e){let t=qt(e.tabs).map((t,n)=>({id:t.id,domId:`browser-tab-${t.id}`,label:t.label,title:`${u(e.tabs[n]?.kind===`native`?`browser.nativeTab`:`browser.remoteTab`)}: ${t.url}`,icon:t.favicon?p`<img class="tabstrip-tab__favicon" src=${t.favicon} alt="" />`:t.icon,closeLabel:`${u(`browser.closeTab`)}: ${t.label}`}));return it({tabs:t,activeId:e.activeTargetId,ariaControls:`browser-tab-panel`,onSelect:e.onSelect,onClose:e.onClose,onNew:e.onNew,newLabel:u(`browser.newTab`),newTabAction:!0,...e.hideNewControl?{newControl:m}:{}})}function Q(){return(Q=e((()=>{h(),o(),v(),k()})))()}function Yt(e,t){return Jt({tabs:e.tabs,activeTargetId:e.activeTargetId,onSelect:t=>void e.selectTab(t),onClose:t=>e.closeTab(t),onNew:()=>e.beginNewTab(),hideNewControl:t})}function Xt(e,t,n,r){let i=e.native.activeTab?.url||e.view?.metrics?.url||e.view?.url||e.urlDraft;return p`
    <div class="rail-header__actions bp-actions">
      ${ot({current:t,groupClass:`bp-dock-modes`,groupLabel:u(`browser.title`),destinations:[{dock:`bottom`,label:u(`browser.dockBottom`),icon:_.panelBottomOpen,className:`bp-icon`},{dock:`right`,label:u(`browser.dockRight`),icon:_.panelRightOpen,className:`bp-icon`}],onSelect:n})}
      <button
        class="rail-header__action bp-icon"
        type="button"
        data-new-tab-action
        title=${u(`browser.openExternal`)}
        aria-label=${u(`browser.openExternal`)}
        ?disabled=${!i}
        @click=${()=>e.openExternal()}
      >
        ${_.externalLink}
      </button>
      <button
        class="rail-header__action bp-icon"
        type="button"
        title=${u(`browser.close`)}
        aria-label=${u(`browser.close`)}
        @click=${r}
      >
        ${_.x}
      </button>
    </div>
  `}function Zt(e,t){let n=e.native.activeTab,r=!!(n||e.view);return p`
    <div class="bp-toolbar">
      ${!n&&e.operations.route?p`<span
              class="bp-profile"
              title=${u(`browser.profile`,{profile:e.operations.route.profile})}
              >${e.operations.route.profile}</span
            >`:m}
      ${t&&!e.host.fixedTab?p`<button
              class="bp-icon"
              type="button"
              data-new-tab-action
              title=${u(`browser.newTab`)}
              aria-label=${u(`browser.newTab`)}
              @click=${()=>e.beginNewTab()}
            >
              ${_.plus}
            </button>`:m}
      <button
        class="bp-icon"
        type="button"
        title=${u(`browser.back`)}
        aria-label=${u(`browser.back`)}
        ?disabled=${n?!n.canGoBack:!r||e.evaluateUnavailable}
        @click=${()=>e.goHistory(-1)}
      >
        ${_.chevronLeft}
      </button>
      <button
        class="bp-icon"
        type="button"
        title=${u(`browser.forward`)}
        aria-label=${u(`browser.forward`)}
        ?disabled=${n?!n.canGoForward:!r||e.evaluateUnavailable}
        @click=${()=>e.goHistory(1)}
      >
        ${_.chevronRight}
      </button>
      <button
        class="bp-icon"
        type="button"
        title=${u(n?.loading?`browser.stop`:`browser.reload`)}
        aria-label=${u(n?.loading?`browser.stop`:`browser.reload`)}
        aria-busy=${!n&&e.loading}
        ?disabled=${!e.activeTargetId}
        @click=${()=>e.reloadPage()}
      >
        ${n?.loading?_.x:_.refresh}
      </button>
      <input
        class="bp-url"
        type="text"
        spellcheck="false"
        autocomplete="off"
        ?disabled=${!(!e.host.fixedTab||e.activeTargetId)}
        placeholder=${u(`browser.urlPlaceholder`)}
        .value=${e.urlDraft}
        @focus=${t=>{e.setUrlDraftEditing(!0),t.target.select()}}
        @blur=${()=>e.setUrlDraftEditing(!1)}
        @input=${t=>e.setState(`urlDraft`,t.target.value)}
        @keydown=${t=>{t.key===`Enter`?(t.preventDefault(),e.commitUrlDraft(),t.target.blur()):t.key===`Escape`&&(e.resetUrlDraftFromView(),t.target.blur())}}
      />
      ${t?p`<button
              class="bp-icon"
              type="button"
              data-new-tab-action
              title=${u(`browser.openExternal`)}
              aria-label=${u(`browser.openExternal`)}
              ?disabled=${!r}
              @click=${()=>e.openExternal()}
            >
              ${_.externalLink}
            </button>`:m}
      <button
        class="bp-icon"
        type="button"
        title=${u(e.download.pending?`browser.downloading`:`browser.downloadFile`)}
        aria-label=${u(e.download.pending?`browser.downloading`:`browser.downloadFile`)}
        aria-busy=${e.download.pending}
        ?disabled=${!e.download.available}
        @click=${()=>void e.download.save()}
      >
        ${e.download.pending?_.loader:_.download}
      </button>
      <button
        class="bp-icon ${e.mode===`annotate`?`is-active`:``}"
        type="button"
        title=${u(`browser.annotate`)}
        aria-label=${u(`browser.annotate`)}
        ?disabled=${!r}
        @click=${()=>e.setMode(`annotate`)}
      >
        ${_.penLine}
      </button>
      <button
        class="bp-icon ${e.mode===`inspect`?`is-active`:``}"
        type="button"
        title=${!n&&e.evaluateUnavailable?u(`browser.inspectUnavailable`):u(`browser.inspect`)}
        aria-label=${u(`browser.inspect`)}
        ?disabled=${!r||!n&&e.evaluateUnavailable}
        @click=${()=>e.setMode(`inspect`)}
      >
        ${rn}
      </button>
    </div>
  `}function Qt(e){return e.mode===`annotate`?p`
    <div class="bp-annotatebar">
      <span class="bp-annotatebar__hint">${u(`browser.annotateHint`)}</span>
      <button
        class="bp-btn"
        type="button"
        ?disabled=${e.strokes.length===0}
        @click=${()=>e.undoStroke()}
      >
        ${u(`browser.annotateUndo`)}
      </button>
      <button
        class="bp-btn"
        type="button"
        ?disabled=${e.strokes.length===0}
        @click=${()=>e.clearStrokes()}
      >
        ${u(`browser.annotateClear`)}
      </button>
      <button
        class="bp-btn"
        type="button"
        title=${u(`browser.annotateDone`)}
        @click=${()=>e.exitCaptureModes()}
      >
        ${_.x}
      </button>
      <button
        class="bp-btn bp-btn--primary"
        type="button"
        ?disabled=${e.strokes.length===0}
        @click=${()=>void e.sendAnnotation({})}
      >
        ${u(`browser.annotateSend`)}
      </button>
    </div>
  `:m}function $t(e){let t=e.inspected,n=e.inspectPointer;if(e.mode!==`inspect`||!t||!n)return m;let r=`${Math.min(92,Math.max(0,n.x*100))}%`,i=`${Math.min(92,Math.max(0,n.y*100+2))}%`,a=t.classes.map(e=>`.${e}`).join(``);return p`
    <div class="bp-tooltip" style="left:${r};top:${i}">
      <div class="bp-tooltip__title">
        <span class="bp-tooltip__selector"
          >${t.tag}${t.id?`#${t.id}`:``}${a}</span
        >
        <span class="bp-tooltip__size"
          >${Math.round(t.rect.width)} × ${Math.round(t.rect.height)}</span
        >
      </div>
      ${t.name?p`<div class="bp-tooltip__row">
              <span>${u(`browser.inspectName`)}</span><span>${t.name}</span>
            </div>`:m}
      ${t.role?p`<div class="bp-tooltip__row">
              <span>${u(`browser.inspectRole`)}</span><span>${t.role}</span>
            </div>`:m}
      <div class="bp-tooltip__row">
        <span>${u(`browser.inspectFocusable`)}</span><span>${t.focusable?`✓`:`–`}</span>
      </div>
    </div>
  `}function en(e){if(e.native.activeTab&&e.mode===`interact`)return p`<div
      class="bp-stage bp-stage--native"
      aria-busy=${e.native.activeTab.loading}
    >
      ${e.native.activeTab.loading?p`<span class="bp-native-loading" role="status">${u(`browser.loading`)}</span>`:m}
    </div>`;if(!e.native.activeTab&&e.running===!1)return ye({icon:_.globe,heading:u(`chat.sidePanel.browser`),description:u(`browser.notRunning`),action:e.host.fixedTab?m:p`
            <button class="bp-btn" type="button" @click=${()=>void e.startBrowserNow()}>
              ${u(`browser.start`)}
            </button>
          `});if(!e.view&&e.unavailableTabText)return p`<div class="bp-status" role="status">${e.unavailableTabText}</div>`;if(!e.view)return e.loading?Ie(`browser`,u(`browser.loading`)):ye({icon:_.globe,heading:u(`chat.sidePanel.browser`),description:u(`chat.sidePanel.browserEmpty`)});let t=e.mode===`annotate`?`bp-overlay--annotate`:e.mode===`inspect`?`bp-overlay--inspect`:``;return p`
    <div class="bp-stage">
      <img
        class="bp-shot"
        src=${e.view.dataUrl}
        alt=${e.view.metrics?.title||``}
      />
      <canvas
        class="bp-overlay ${t}"
        @click=${t=>e.handleStageClick(t)}
        @pointerdown=${t=>e.handleOverlayPointerDown(t)}
        @pointermove=${t=>e.handleOverlayPointerMove(t)}
        @pointerup=${t=>e.handleOverlayPointerUp(t)}
        @pointercancel=${t=>e.handleOverlayPointerUp(t)}
        @lostpointercapture=${t=>e.handleOverlayPointerUp(t)}
      ></canvas>
      ${e.mode===`interact`?p`<textarea
              class="bp-overlay bp-input"
              aria-label=${u(`browser.inputLabel`)}
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              @click=${t=>e.handleStageClick(t)}
              @contextmenu=${t=>e.handleStageClick(t)}
              @beforeinput=${e=>e.preventDefault()}
              @input=${e=>{e.currentTarget instanceof HTMLTextAreaElement&&(e.currentTarget.value=``)}}
            ></textarea>`:m}
      ${$t(e)}
    </div>
  `}function tn(e,t){return p`
    <wa-tab-panel
      id="browser-tab-panel"
      class="bp-viewport"
      name=${e.activeTargetId??`browser`}
      active
      aria-labelledby=${t&&e.activeTargetId?`browser-tab-${e.activeTargetId}`:m}
      tabindex="0"
      .onwheel=${t=>e.handleWheel(t)}
      @keydown=${t=>e.handleViewportKeydown(t)}
      @paste=${t=>e.handleViewportPaste(t)}
      aria-busy=${e.loading?`true`:`false`}
    >
      ${en(e)}
    </wa-tab-panel>
  `}function nn(e,t,n,r,i,a,o,s=!1,c=!1){let l=s?m:t===`bottom`?`height:${n}px`:`width:${r}px`,d=!e.host.fixedTab&&(!s||!c&&e.tabs.length>0);return p`
    <section
      class="bp bp--${s?`embedded`:t}"
      style=${l}
      aria-label=${u(`browser.title`)}
    >
      ${s?m:o}
      ${d?p`<header class="rail-header bp-header">
              ${Yt(e,s)}
              ${s?m:Xt(e,t,i,a)}
            </header>`:m}
      ${Zt(e,s)} ${Qt(e)}
      ${e.errorText?p`<div class="bp-note bp-note--error" role="alert">${e.errorText}</div>`:e.noticeText?p`<div class="bp-note" role="status">${e.noticeText}</div>`:m}
      ${tn(e,d)}
    </section>
  `}var rn;function an(){return(an=e((()=>{h(),o(),S(),st(),ce(),v(),Ye(),Le(),Q(),x(),rn=ue(ae`<path d="m4 4 7.07 17 2.51-7.39L21 11.07z" />`)})))()}var on;function sn(){return(sn=e((()=>{h(),on=re`
  /* Docked panels get a single hairline separator on the inner edge so they
     read as layout, not as a floating card. The browser dock yields to the
     terminal dock's reserved edges so the two panels tile instead of
     overlapping when both are open. */
  .bp--bottom {
    left: var(--shell-nav-width, 0);
    right: var(--oc-terminal-reserve-right, 0px);
    bottom: var(--oc-terminal-reserve-bottom, 0px);
  }
  .bp--right {
    top: var(--shell-topbar-height, 0);
    right: var(--oc-terminal-reserve-right, 0px);
    bottom: var(--oc-terminal-reserve-bottom, 0px);
  }
  .bp--embedded {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .bp-actions {
    flex: none;
  }
  .bp-profile {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--muted);
    font-size: 11px;
  }

  .bp-toolbar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px 8px;
    border-bottom: 1px solid var(--border, #262b34);
  }
  .bp-toolbar .bp-icon {
    display: inline-flex;
    flex: none;
    width: 28px;
    height: 28px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--muted, #8a919e);
  }
  /* Shadow-root icons need explicit dimensions in WebKit as well as Chromium. */
  .bp-toolbar .bp-icon > svg,
  .bp-annotatebar .bp-btn > svg {
    width: 16px;
    height: 16px;
    flex: none;
  }
  .bp-toolbar .bp-icon[aria-busy="true"] > svg {
    animation: bp-toolbar-spin 1s linear infinite;
  }
  @keyframes bp-toolbar-spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .bp-toolbar .bp-icon[aria-busy="true"] > svg {
      animation: none;
    }
  }
  .bp-toolbar .bp-icon:hover,
  .bp-toolbar .bp-icon:focus-visible {
    background: color-mix(in srgb, var(--text, #d7dae0) 10%, transparent);
    color: var(--text, #d7dae0);
  }
  .bp-url {
    flex: 1;
    min-width: 0;
    height: 28px;
    padding: 0 12px;
    border: 1px solid transparent;
    border-radius: 14px;
    background: color-mix(in srgb, var(--text, #d7dae0) 8%, transparent);
    color: var(--text, #d7dae0);
    font-size: 12.5px;
    font-family: inherit;
    outline: none;
    text-overflow: ellipsis;
  }
  .bp-url:focus {
    border-color: var(--accent, #ff5c5c);
    background: var(--bg, #0e1015);
  }
  .bp-annotatebar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 10px;
    font-size: 12px;
    color: var(--muted, #8a919e);
    border-bottom: 1px solid var(--border, #262b34);
    background: color-mix(in srgb, var(--accent, #ff5c5c) 7%, transparent);
  }
  .bp-annotatebar__hint {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bp-btn {
    border: 1px solid var(--border, #262b34);
    background: transparent;
    color: var(--text, #d7dae0);
    font-size: 12px;
    font-family: inherit;
    border-radius: 6px;
    padding: 3px 10px;
  }
  .bp-btn:hover {
    background: color-mix(in srgb, var(--text, #d7dae0) 10%, transparent);
  }
  .bp-btn--primary {
    border-color: var(--accent, #ff5c5c);
    color: var(--accent, #ff5c5c);
  }
  .bp-viewport {
    position: relative;
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
    overflow: auto;
    background: var(--bg, #0e1015);
    outline: none;
  }
  /* The tab panel's own body must stretch, otherwise an empty state sizes to its
     content and sits in the upper third instead of centring in the viewport. */
  .bp-viewport::part(base) {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    flex-direction: column;
  }
  .bp-stage {
    position: relative;
    width: 100%;
  }
  .bp-stage--native {
    flex: 1 1 auto;
    min-height: 100px;
  }
  .bp-native-loading {
    display: block;
    padding: var(--space-2);
    color: var(--muted);
    font-size: var(--font-size-xs);
  }
  .bp-shot {
    display: block;
    width: 100%;
    height: auto;
    user-select: none;
    -webkit-user-drag: none;
  }
  .bp-overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    touch-action: none;
  }
  .bp-overlay--annotate {
    cursor: crosshair;
  }
  .bp-input {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
    resize: none;
    background: transparent;
    color: transparent;
    caret-color: transparent;
    cursor: default;
  }
  .bp-overlay--inspect {
    cursor: default;
  }
  .bp-tooltip {
    position: absolute;
    z-index: 3;
    max-width: 320px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--border, #262b34);
    background: var(--bg, #0e1015);
    box-shadow: var(--shadow-md, 0 4px 16px rgba(0, 0, 0, 0.3));
    font-size: 12px;
    pointer-events: none;
  }
  .bp-tooltip__title {
    display: flex;
    align-items: baseline;
    gap: 8px;
    justify-content: space-between;
  }
  .bp-tooltip__selector {
    color: var(--accent, #6ea8fe);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    word-break: break-all;
  }
  .bp-tooltip__size {
    color: var(--muted, #8a919e);
    white-space: nowrap;
  }
  .bp-tooltip__row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 4px;
    color: var(--muted, #8a919e);
  }
  .bp-tooltip__row span:last-child {
    color: var(--text, #d7dae0);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bp-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 100%;
    padding: 20px;
    font-size: 12.5px;
    color: var(--muted, #8a919e);
    text-align: center;
  }
  .bp-note {
    padding: 6px 12px;
    font-size: 12px;
    color: var(--muted, #8a919e);
    border-bottom: 1px solid var(--border, #262b34);
  }
  .bp-note--error {
    color: var(--danger, #ff6b6b);
  }
`})))()}var $;function cn(){return(cn=e((()=>{h(),ie(),B(),o(),ne(),Qe(),pe(),me(),$e(),tt(),k(),se(),Gt(),an(),Q(),sn(),O(),$=class extends l{constructor(...e){super(...e),this.client=null,this.available=!1,this.remoteAvailable=!0,this.suppressed=!1,this.resourceBasePath=``,this.authToken=null,this.embedded=!1,this.tabsInHeader=!1,this.presented=!1,this.refreshOnPresentation=!0,this.sessionKey=``,this.activeSessionKey=``,this.browserPanelController=new Wt(this),this.dockLayout=new de(this,{layout:he,reservationPrefix:`browser`,isAvailable:()=>this.available}),this.onToggleRequest=e=>this.handleToggleRequest(e),this.viewportResizeObserver=null,this.observedViewportElement=null}static{this.styles=[rt,et,on,Ze]}connectedCallback(){super.connectedCallback(),this.embedded||window.addEventListener(b,this.onToggleRequest),this.dockLayout.setSuppressed(this.suppressed),!this.embedded&&this.dockLayout.open&&this.browserPanelController.refreshAll()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(b,this.onToggleRequest),this.viewportResizeObserver?.disconnect(),this.viewportResizeObserver=null,this.observedViewportElement=null}updated(e){if(e.has(`embedded`)&&(this.embedded?window.removeEventListener(b,this.onToggleRequest):window.addEventListener(b,this.onToggleRequest)),e.has(`suppressed`)){let e=this.dockLayout.setSuppressed(this.suppressed);this.suppressed?this.browserPanelController.suspendView():e&&this.browserPanelIsOpen()&&this.browserPanelController.refreshAll()}let t=e.has(`client`)||e.has(`available`),n=this.embedded&&(e.has(`embedded`)||e.has(`presented`)),r=this.synchronizeBrowserContext(),i=this.refreshOnPresentation&&this.followPreferredTab();this.embedded?!this.presented||!this.available||!this.client&&!y()?(n||t)&&this.browserPanelController.suspendView():this.refreshOnPresentation&&!i&&(r||n||t)&&this.browserPanelController.refreshAll():t&&(!this.available&&this.dockLayout.open?(this.dockLayout.hideWithoutPersisting(),this.browserPanelController.resetBrowserState()):this.available&&(this.dockLayout.restoreOpenState()||r&&this.browserPanelIsOpen())&&!i&&this.browserPanelController.refreshAll()),this.browserPanelController.native.presentation.update(),this.dockLayout.syncReservation(),this.browserPanelController.paintOverlay();let a=this.renderRoot.querySelector(`.bp-viewport`);a!==this.observedViewportElement&&(this.viewportResizeObserver?.disconnect(),this.observedViewportElement=a,a&&typeof ResizeObserver==`function`&&(this.viewportResizeObserver??=new ResizeObserver(e=>{let t=e[0];t&&this.browserPanelController.handleViewportResize(t.contentRect.width,t.contentRect.height)}),this.viewportResizeObserver.observe(a)));let o=this.browserPanelController,s=JSON.stringify([o.activeTargetId,o.tabs.map(e=>[e.id,e.kind,e.title,e.url,e.favicon])]);s!==this.lastHostedTabsChangeKey&&(this.lastHostedTabsChangeKey=s,this.dispatchEvent(new CustomEvent(nt,{bubbles:!0,composed:!0})))}get hostedTabs(){return qt(this.browserPanelController.tabs)}get activeHostedTabId(){return this.browserPanelController.activeTargetId}selectHostedTab(e){this.browserPanelController.selectTab(e)}closeHostedTab(e){return this.browserPanelController.closeTab(e)}synchronizeBrowserContext(){let e=this.browserPanelController.synchronizeClient(),t=this.activeSessionKey!==this.sessionKey,n=JSON.stringify(this.dashboardTarget),r=this.activeDashboardKey!==n;return(t||r)&&(this.activeSessionKey=this.sessionKey,this.activeDashboardKey=n,this.browserPanelController.operations.resetRoute(),this.browserPanelController.resetBrowserState()),(e||t||r)&&(this.browserPanelController.native.cancelPendingActivation(),this.browserPanelController.native.cancelCapture(),this.consumedPreferredRevision=void 0),e||t||r}preferredRevision(){let e=this.preferredSelection;return e&&T(e.tab)?JSON.stringify([qe(e.tab),e.revision]):void 0}get preferredSelection(){return this.fixedTab?{tab:this.fixedTab,revision:`dashboard`}:this.preferredTab}followPreferredTab(){let e=this.preferredRevision(),t=this.preferredSelection;if(!this.browserPanelIsOpen()||!this.available||!this.client||!t||!e||e===this.consumedPreferredRevision)return!1;this.consumedPreferredRevision=e;let n=T(t.tab);return n&&this.browserPanelController.selectTab(n.targetId,n,{focusBrowserTab:!1}),!0}browserPanelIsOpen(){return this.embedded?this.presented&&!this.suppressed:this.dockLayout.open}toggle(){this.available&&(this.dockLayout.open?this.closePanel():(this.dockLayout.setOpen(!0),this.browserPanelController.refreshAll()))}handleToggleRequest(e){if(this.fixedTab)return;let t=e instanceof CustomEvent&&typeof e.detail==`object`&&e.detail!==null?e.detail:null;this.synchronizeBrowserContext();let n=T(t?.browserTab);if(t?.browserTab!==void 0&&!n)return;if(this.embedded){if(!this.browserPanelIsOpen()||t?.open===!1||!this.available)return;let e=typeof t?.url==`string`?Z(t.url):null;e?this.browserPanelController.openUrl(e,{newTab:!0,native:t?.native}):n?(this.consumedPreferredRevision=this.preferredRevision(),this.browserPanelController.selectTab(n.targetId,n)):t?.newTab===!0?this.browserPanelController.beginNewTab():this.followPreferredTab()||this.browserPanelController.refreshAll();return}if((t?.dock===`right`||t?.dock===`bottom`)&&this.dockLayout.setDock(t.dock,!1),t?.open===!1){this.closePanel();return}let r=typeof t?.url==`string`?Z(t.url):null;if(r||t?.open===!0){if(!this.available)return;let e=this.dockLayout.open;this.dockLayout.setOpen(!0),r?this.browserPanelController.openUrl(r,{newTab:!0,native:t?.native}):n?(this.consumedPreferredRevision=this.preferredRevision(),this.browserPanelController.selectTab(n.targetId,n)):t?.newTab===!0?this.browserPanelController.beginNewTab():!e&&!this.followPreferredTab()&&this.browserPanelController.refreshAll();return}this.toggle()}closePanel(){this.browserPanelController.suspendView(),this.dockLayout.setOpen(!1)}setDock(e){this.dockLayout.setDock(e)}render(){return!this.available||!this.embedded&&!this.dockLayout.open?m:nn(this.browserPanelController,this.dockLayout.dock,this.dockLayout.height,this.dockLayout.width,e=>this.setDock(e),()=>this.closePanel(),this.dockLayout.renderResizer(`bp`,u(`browser.resize`)),this.embedded,this.tabsInHeader)}},r([g({attribute:!1})],$.prototype,`client`,void 0),r([g({type:Boolean})],$.prototype,`available`,void 0),r([g({type:Boolean})],$.prototype,`remoteAvailable`,void 0),r([g({type:Boolean})],$.prototype,`suppressed`,void 0),r([g({attribute:!1})],$.prototype,`resourceBasePath`,void 0),r([g({attribute:!1})],$.prototype,`authToken`,void 0),r([g({type:Boolean})],$.prototype,`embedded`,void 0),r([g({type:Boolean})],$.prototype,`tabsInHeader`,void 0),r([g({type:Boolean})],$.prototype,`presented`,void 0),r([g({type:Boolean})],$.prototype,`refreshOnPresentation`,void 0),r([g({attribute:!1})],$.prototype,`sessionKey`,void 0),r([g({attribute:!1})],$.prototype,`preferredTab`,void 0),r([g({attribute:!1})],$.prototype,`fixedTab`,void 0),r([g({attribute:!1})],$.prototype,`dashboardTarget`,void 0),customElements.get(`openclaw-browser-panel`)||customElements.define(`openclaw-browser-panel`,$)})))()}export{cn as t};
//# sourceMappingURL=browser-panel-DogK-9kQ.js.map