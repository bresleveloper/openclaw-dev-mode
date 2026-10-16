import{n as e,r as t}from"./rolldown-runtime-8BhlS34s.js";import{Eu as n,Tu as r,dc as i,dn as a,du as o,fn as s,ju as c,lc as l,pu as u,wu as d}from"./control-ui-core-bJHyI7AF.js";import{Ct as ee,Jr as f,Kr as p,St as te,Xt as ne,Zt as re,_i as ie,aa as ae,ai as oe,hi as se,ia as ce,na as m,pi as le,ra as ue,vi as de}from"./control-ui-core-DNh4McGE.js";import{$ as h,X as g,Y as _,mt as fe,nt as pe,tt as me,ut as v}from"./lit-runtime-DyST807n.js";import{mt as he}from"./control-ui-boot-shared-DsSYH3B6.js";import{Ft as ge,Jt as _e,Pt as ve,Xt as ye,_a as y,fa as be,ii as b}from"./ui-DeikvIdP.js";import{$i as xe,Qi as x,ea as S,mt as Se,pt as Ce,ta as C}from"./control-ui-boot-shared-C9uJ732w.js";import{$n as w,An as we,Bn as T,Ct as Te,Dn as Ee,Fn as De,Gn as E,Hn as Oe,In as D,Kn as ke,Ln as O,Mn as Ae,Nn as je,On as Me,Pn as Ne,Qn as Pe,Rn as Fe,St as Ie,Tt as Le,Un as Re,Vn as ze,Wn as Be,Xn as Ve,Yn as He,Zn as Ue,er as k,ht as We,jn as Ge,kn as Ke,mt as qe,qn as Je,wt as Ye,xt as Xe,zn as A}from"./control-ui-boot-chat-DfNf0poH.js";import{n as Ze,t as Qe}from"./scrollbar-styles-D8VGVDiV.js";import{n as $e,t as et}from"./dock-panel-styles-CIuTBK0T.js";import{a as tt,i as nt,n as rt,r as it,t as j}from"./panel-tab-strip-C6eteeqt.js";import{n as at}from"./gateway-websocket-url-cYJwVUmD.js";import{n as ot,t as st}from"./dock-destination-controls-DwfJ8NRR.js";import{n as M,t as ct}from"./panel-empty-state-De_5Bizz.js";function N(){return typeof window>`u`?void 0:window}function lt(){return N()?.webkit?.messageHandlers?.openclawBrowser}function P(e){return typeof e==`string`&&e.length>0&&e.trim()===e}function F(e){return e===``||P(e)}function I(e){return typeof e==`number`&&Number.isFinite(e)}function L(e){if(e===`about:blank`)return!0;if(typeof e!=`string`)return!1;try{let t=new URL(e);return t.protocol===`http:`||t.protocol===`https:`}catch{return!1}}function ut(e){return y(e)&&I(e.x)&&I(e.y)&&I(e.width)&&e.width>=0&&I(e.height)&&e.height>=0}function dt(e){if(!y(e))return!1;if(e.type===`release-scope`)return P(e.scope);if(e.type===`present`)return P(e.scope)&&(e.tabId===null||P(e.tabId))&&(e.rect===null||ut(e.rect))&&typeof e.visible==`boolean`;if(!P(e.tabId))return!1;switch(e.type){case`open`:return L(e.url)&&F(e.sessionKey)&&(e.activate===void 0||typeof e.activate==`boolean`);case`navigate`:return L(e.url);case`inspect`:return I(e.x)&&e.x>=0&&I(e.y)&&e.y>=0;case`back`:case`forward`:case`reload`:case`stop`:case`close`:case`snapshot`:case`download`:return!0;default:return!1}}function ft(e){if(!y(e)||!Number.isSafeInteger(e.revision)||typeof e.revision!=`number`||e.revision<0||!Array.isArray(e.tabs))return!1;let t=new Set;return Array.from(e.tabs).every(e=>!y(e)||!P(e.id)||e.sessionKey!==void 0&&!F(e.sessionKey)||t.has(e.id)||!L(e.url)||typeof e.title!=`string`||e.favicon!==void 0&&(typeof e.favicon!=`string`||e.favicon.length>98304||!/^data:image\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/i.test(e.favicon))||typeof e.loading!=`boolean`||typeof e.canGoBack!=`boolean`||typeof e.canGoForward!=`boolean`||e.openedBy!==`web`&&e.openedBy!==`native`||e.openerTabId!==void 0&&!P(e.openerTabId)?!1:(t.add(e.id),!0))}function pt(e){return e===null||y(e)&&typeof e.tag==`string`&&typeof e.id==`string`&&Array.isArray(e.classes)&&e.classes.every(e=>typeof e==`string`)&&typeof e.role==`string`&&typeof e.name==`string`&&typeof e.focusable==`boolean`&&ut(e.rect)}async function R(e){let t=lt();if(typeof t?.postMessage!=`function`)return null;if(!dt(e))return{ok:!1,error:`Invalid native browser request`};try{let n=await t.postMessage.bind(t)(e);return y(n)&&n.ok===!1&&typeof n.error==`string`?{ok:!1,error:n.error}:!y(n)||n.ok!==!0?{ok:!1,error:`Invalid native browser reply`}:e.type===`open`?P(n.tabId)?{ok:!0,tabId:n.tabId}:{ok:!1,error:`Invalid native browser reply`}:e.type===`download`?typeof n.cancelled==`boolean`?{ok:!0,cancelled:n.cancelled}:{ok:!1,error:`Invalid native browser download`}:e.type===`snapshot`?typeof n.dataUrl!=`string`||!n.dataUrl.startsWith(`data:image/png;base64,`)||!I(n.cssWidth)||n.cssWidth<=0||!I(n.cssHeight)||n.cssHeight<=0?{ok:!1,error:`Invalid native browser snapshot`}:{ok:!0,dataUrl:n.dataUrl,cssWidth:n.cssWidth,cssHeight:n.cssHeight}:e.type===`inspect`?pt(n.node)?{ok:!0,node:n.node}:{ok:!1,error:`Invalid native browser inspection`}:{ok:!0}}catch(e){return{ok:!1,error:e instanceof Error?e.message:`Native browser request failed`}}}function mt(){if(!p())return null;let e=N()?.__OPENCLAW_NATIVE_BROWSER__;return ft(e)?e:null}function ht(e){if(!p())return()=>{};let t=mt()?.revision??-1,n=n=>{let r=n instanceof CustomEvent?n.detail:null;ft(r)&&r.revision>t&&(t=r.revision,e(r))};return window.addEventListener(z,n),()=>window.removeEventListener(z,n)}var z;function B(){return(B=e((()=>{z=`openclaw:native-browser-state`})))()}function V(e){return new Promise((t,n)=>{let r=new Image;r.addEventListener(`load`,()=>t(r)),r.addEventListener(`error`,()=>n(Error(c(`browser.errors.screenshotDecodeFailed`)))),r.src=e})}function gt(e){return xt.has(e)||e.length===1}function H(e,t){if(!e)return null;let n=e.getBoundingClientRect();return n.width<=0||n.height<=0?null:{x:(t.clientX-n.left)/n.width,y:(t.clientY-n.top)/n.height}}function _t(e,t,n){let r=H(e,t);if(!r||!n)return null;let i=n.metrics?.cssWidth??n.image.naturalWidth,a=n.metrics?.cssHeight??n.image.naturalHeight;return{x:r.x*i,y:r.y*a}}function vt(e,t){if(!e||!t)return null;let n=e.metrics?.cssWidth??e.image.naturalWidth,r=e.metrics?.cssHeight??e.image.naturalHeight;return n<=0||r<=0?null:{x:t.rect.x/n,y:t.rect.y/r,width:t.rect.width/n,height:t.rect.height/r}}function yt(e,t,n,r){if(!e||!t)return;let i=Math.max(1,Math.round(t.clientWidth)),a=Math.max(1,Math.round(t.clientHeight));(e.width!==i||e.height!==a)&&(e.width=i,e.height=a);let o=e.getContext(`2d`);o&&(o.clearRect(0,0,i,a),Le(o,{width:i,height:a,strokes:n,highlight:r}))}function bt(e,t,n,r,i){let a=e.metrics?.url||e.url||t?.url||``,o=e.metrics?.title||t?.title||``,s=Xe({url:a,title:o,strokes:n,element:r,browserTab:e.kind===`native`?void 0:e.browserTab}),c=Ie({image:e.image,width:e.image.naturalWidth,height:e.image.naturalHeight,strokes:n,highlight:i});return Te({...s,dataUrl:c,fileName:`annotated-page.png`})}var xt;function U(){return(U=e((()=>{n(),w(),Ye(),k(),xt=new Set([`Enter`,`Backspace`,`Delete`,`Tab`,`Escape`,`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Home`,`End`,`PageUp`,`PageDown`])})))()}var St,Ct;function wt(){return(wt=e((()=>{n(),D(),U(),St=120,Ct=class{constructor(e){this.host=e,this.drawingGesture=null,this.suppressStageClick=!1,this.inspectionError=null,this.pendingClick=null,this.clickSequence=0,this.inputGeneration=0,this.pendingText=null,this.compositionCurrent=null,this.touchScroll=null}resetCaptureState(){this.host.pendingInput.clearInput(),this.cancelOverlayPointerGesture(),this.pendingClick=null,this.pendingText=null,this.compositionCurrent=null,this.touchScroll=null;let e=this.host.host.renderRoot.querySelector(`.bp-input`);e&&(e.value=``,e.blur()),this.clickSequence+=1,this.inputGeneration+=1}stageElement(){return this.host.host.renderRoot.querySelector(`.bp-stage`)}remotePoint(e){return _t(this.stageElement(),e,this.host.view)}inspectHighlightRegion(){return vt(this.host.view,this.host.inspected)}handleStageClick(e){if(this.suppressStageClick){this.suppressStageClick=!1;return}if(this.host.mode!==`interact`)return;this.host.host.renderRoot.querySelector(`.bp-input`)?.focus({preventScroll:!0});let t=this.remotePoint(e),n=this.host.activeTargetId,r=this.host.operations.captureClient();if(!t||!n||!r)return;let i=this.host.operations.epoch,a=this.inputGeneration,o=()=>this.inputGeneration!==a||!this.host.operations.isLive(i,r)||this.host.activeTargetId!==n||this.host.mode!==`interact`?Promise.resolve(!1):this.host.runAction(e=>we(e,{targetId:n,x:t.x,y:t.y}));this.clickSequence+=1;let s=this.pendingText?Promise.all([this.pendingClick,this.pendingText]):this.pendingClick;this.pendingClick=s?s.then(o):o()}handleWheel(e){this.queueScroll(e.deltaX,e.deltaY)&&e.preventDefault()}queueScroll(e,t){if(this.host.mode!==`interact`||!this.host.view)return!1;let n=this.host.operations.captureClient(),r=this.host.activeTargetId;if(!n||!r||this.host.view.targetId!==r)return!1;let i=this.host.operations.epoch;return this.host.pendingInput.queueWheel(e,t,150,(e,t)=>{this.host.operations.isLive(i,n)&&this.host.activeTargetId===r&&this.host.view?.targetId===r&&this.host.mode===`interact`&&this.host.runAction(async n=>{if(this.host.evaluateUnavailable){await E(n,{targetId:r,key:t>=0?`PageDown`:`PageUp`});return}await Ue(n,{targetId:r,deltaX:e,deltaY:t})})}),!0}captureInputCurrent(){let e=this.host.operations.captureClient(),t=this.host.activeTargetId,n=this.host.operations.epoch,r=this.inputGeneration,i=this.clickSequence;return()=>!!(e&&t&&this.host.operations.isLive(n,e)&&this.host.activeTargetId===t&&this.host.view?.targetId===t&&this.inputGeneration===r&&this.clickSequence===i&&this.host.mode===`interact`)}handleTouchPointerDown(e){if(this.touchScroll||(this.suppressStageClick=!1,e.pointerType!==`touch`||this.host.mode!==`interact`))return;let t=this.remotePoint(e),n=this.captureInputCurrent();t&&n()&&(this.touchScroll={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,point:t,scrolling:!1,current:n})}handleTouchPointerMove(e){let t=this.touchScroll;if(!t||t.pointerId!==e.pointerId||!t.current()||!t.scrolling&&Math.hypot(e.clientX-t.startX,e.clientY-t.startY)<8)return;let n=this.remotePoint(e);n&&(e.preventDefault(),t.scrolling=!0,this.suppressStageClick=!0,this.queueScroll(t.point.x-n.x,t.point.y-n.y),t.point=n)}handleTouchPointerEnd(e){this.touchScroll?.pointerId===e.pointerId&&(this.touchScroll=null)}handleCompositionStart(){this.compositionCurrent=this.captureInputCurrent()}handleCompositionEnd(e){let t=this.compositionCurrent;this.compositionCurrent=null,t?.()&&e.data&&this.runAfterClick((t,n)=>O(t,{targetId:n,text:e.data})),e.currentTarget instanceof HTMLTextAreaElement&&(e.currentTarget.value=``)}handleTextInput(e){if(e.isComposing||this.compositionCurrent||e.type===`beforeinput`&&!e.cancelable)return;e.preventDefault(),e.stopPropagation();let t=e.currentTarget,n=e.data??(t instanceof HTMLTextAreaElement?t.value:``);if(e.inputType===`insertReplacementText`)this.host.setState(`noticeText`,c(`browser.manualTextCorrection`));else if([`insertText`,`insertFromPaste`].includes(e.inputType)&&n)this.runAfterClick((e,t)=>O(e,{targetId:t,text:n}));else{let t=e.inputType===`deleteContentBackward`?`Backspace`:e.inputType===`deleteContentForward`?`Delete`:e.inputType===`insertLineBreak`||e.inputType===`insertParagraph`?`Enter`:null;t&&this.runAfterClick((e,n)=>E(e,{targetId:n,key:t}))}t instanceof HTMLTextAreaElement&&(t.value=``)}handleViewportKeydown(e){if(this.host.mode!==`interact`||!this.host.view||e.isComposing||e.keyCode===229||this.compositionCurrent||e.metaKey||e.ctrlKey||e.altKey)return;let t=e.key;gt(t)&&(e.preventDefault(),this.runAfterClick((e,n)=>E(e,{targetId:n,key:t})))}handleViewportPaste(e){if(e.preventDefault(),e.stopPropagation(),!e.clipboardData?.types.includes(`text/plain`))return;let t=e.clipboardData.getData(`text/plain`);t&&this.runAfterClick((e,n)=>O(e,{targetId:n,text:t}))}runAfterClick(e){let t=this.host.activeTargetId,n=this.host.operations.captureClient();if(!n||!t||this.host.view?.targetId!==t||this.host.mode!==`interact`)return;let r=this.host.operations.epoch,i=this.inputGeneration,a=()=>{if(this.host.operations.isLive(r,n)&&this.host.activeTargetId===t&&this.host.view?.targetId===t&&this.host.mode===`interact`&&this.inputGeneration===i)return this.host.runAction(n=>e(n,t))},o=this.pendingClick,s=()=>o?o.then(e=>e?a():void 0):a();this.pendingText=this.pendingText?this.pendingText.then(s):Promise.resolve(s())}handleOverlayPointerDown(e){if(this.host.mode===`inspect`){this.suppressStageClick=!0,this.sendAnnotation({element:this.host.inspected});return}if(this.host.mode!==`annotate`||e.button!==0||this.drawingGesture)return;let t=H(this.stageElement(),e);if(!t)return;let n=e.currentTarget instanceof HTMLElement?e.currentTarget:e.target instanceof HTMLElement?e.target:null;if(!n)return;e.preventDefault();try{n.setPointerCapture(e.pointerId)}catch{}let r={pointerId:e.pointerId,captureTarget:n,stroke:{points:[t]}};this.drawingGesture=r,this.host.setState(`strokes`,[...this.host.strokes,r.stroke]),this.paintOverlay()}handleOverlayPointerMove(e){if(this.host.mode===`annotate`){let t=this.drawingGesture;if(!t||e.pointerId!==t.pointerId)return;let n=H(this.stageElement(),e);n&&(t.stroke.points.push(n),this.paintOverlay());return}this.host.mode===`inspect`&&this.queueInspect(e)}handleOverlayPointerUp(e){e.pointerId===this.drawingGesture?.pointerId&&(this.drawingGesture=null)}cancelOverlayPointerGesture(){let e=this.drawingGesture;if(this.drawingGesture=null,e)try{e.captureTarget.hasPointerCapture(e.pointerId)&&e.captureTarget.releasePointerCapture(e.pointerId)}catch{}}queueInspect(e){let t=this.host.operations.captureClient(),n=this.remotePoint(e),r=H(this.stageElement(),e),i=this.host.activeTargetId;if(!t||!n||!r||!i||this.host.evaluateUnavailable)return;let a=this.host.operations.beginInspection(t,()=>this.host.activeTargetId===i&&this.host.view?.targetId===i&&this.host.mode===`inspect`);this.host.setState(`inspected`,null),this.host.setState(`inspectPointer`,r),this.paintOverlay(),this.host.pendingInput.queueInspection(St,a,()=>{Fe(t,{targetId:i,x:n.x,y:n.y}).then(e=>{a()&&(this.inspectionError!==null&&this.host.errorText===this.inspectionError&&this.host.setState(`errorText`,null),this.inspectionError=null,this.host.setState(`inspected`,e),this.paintOverlay())}).catch(e=>{if(a()){if(A(e)){this.host.setState(`evaluateUnavailable`,!0),this.host.setState(`errorText`,c(`browser.inspectUnavailable`)),this.host.setState(`mode`,`interact`);return}this.host.reportError(e),this.inspectionError=this.host.errorText}})})}undoStroke(){this.cancelOverlayPointerGesture(),this.host.setState(`strokes`,this.host.strokes.slice(0,-1)),this.paintOverlay()}clearStrokes(){this.cancelOverlayPointerGesture(),this.host.setState(`strokes`,[]),this.paintOverlay()}async sendAnnotation(e){this.cancelOverlayPointerGesture();let t=this.host.view,n=this.host.tabs.find(e=>e.id===this.host.activeTargetId),r=e.element??null;if(!t||this.host.strokes.length===0&&!r)return;let i=r?this.inspectHighlightRegion():null,a;try{a=bt(t,n,this.host.strokes,r,i)}catch(e){this.host.reportError(e);return}if(a!==`accepted`){this.host.setState(`noticeText`,null),this.host.setState(`errorText`,c(a===`unhandled`?`browser.noChatTarget`:`browser.annotationLimitReached`));return}this.host.setState(`errorText`,null),this.host.setState(`noticeText`,c(`browser.annotationSent`)),this.host.exitCaptureModes()}paintOverlay(){yt(this.host.host.renderRoot.querySelector(`.bp-overlay`),this.stageElement(),this.host.strokes,this.host.mode===`inspect`?this.inspectHighlightRegion():null)}}})))()}var Tt;function Et(){return(Et=e((()=>{Se(),ne(),B(),n(),w(),u(),D(),k(),Tt=class{constructor(e){this.panel=e,this.pending=!1,this.request=null}get url(){let e=this.panel;if(e.unavailableTabText)return null;let t=e.native.activeTab?.url||(e.view?.targetId===e.activeTargetId?e.view?.metrics?.url||e.view?.url:null);if(!t)return null;try{return[`http:`,`https:`].includes(new URL(t).protocol)?t:null}catch{return null}}get available(){return!this.panel.host.dashboardTarget?.sessionScoped&&!this.pending&&!this.panel.pendingNewTab&&!this.panel.loading&&this.url!==null}cancel(){this.request?.abort(),this.request=null,this.pending=!1}async save(){let e=this.url;if(!e||!this.available)return;let t=this.panel,n=t.activeTargetId,r=t.native.activeTab,i=r?null:t.operations.captureClient(),a=new AbortController;this.request=a,this.pending=!0,t.setState(`errorText`,null),t.setState(`noticeText`,null),t.host.requestUpdate();let s=()=>this.request===a&&t.host.isConnected&&t.activeTargetId===n&&this.url===e&&(r!==void 0||t.operations.captureClient()===i);try{if(r){let e=await R({type:`download`,tabId:r.id});if(!e?.ok)throw Error(e&&!e.ok?e.error:c(`browser.tabUnavailable`))}else{if(!i||!n)throw Error(c(`browser.tabUnavailable`));let r=await Ae(i,n,e,a.signal);if(!s())return;let o=new Headers;t.host.authToken&&o.set(`Authorization`,`Bearer ${t.host.authToken}`);let l=await fetch(Ce(r.path,t.host.resourceBasePath),{headers:o,signal:a.signal,credentials:`same-origin`});if(!l.ok){let{errorMessage:e}=await re(l,a.signal);throw Error(e)}let u=await l.blob();if(!s())return;he(r.filename,u)}}catch(e){s()&&!a.signal.aborted&&t.setState(`errorText`,c(`browser.errors.downloadFailed`,{error:o(e)}))}finally{this.request===a&&(this.request=null,this.pending=!1,t.host.requestUpdate())}}}})))()}var Dt,Ot;function kt(){return(kt=e((()=>{B(),l(),ge(),Dt=0,Ot=class{constructor(e){this.controller=e,this.scope=ve(),this.presentedTabId=null,this.lastPresented=0,this.stage=null,this.resizeObserver=null,this.intersectionObserver=null,this.intersecting=!0,this.occluded=!1,this.frame=null,this.lastPresentation=null,this.connected=!1,this.schedule=()=>{this.connected&&this.frame===null&&(this.frame=requestAnimationFrame(()=>{this.frame=null,this.report()}))}}get hostElement(){let e=this.controller.host.renderRoot;return e instanceof ShadowRoot?e.host:e instanceof Element?e:null}connect(){this.connected||(this.connected=!0,this.hostElement?.setAttribute(`data-native-browser-scope`,this.scope),this.unsubscribeOcclusion=i(e=>{this.occluded=e,e&&this.hide(),this.schedule()},()=>this.stage?.getBoundingClientRect()??null),document.addEventListener(`scroll`,this.schedule,!0),window.addEventListener(`resize`,this.schedule),this.update())}disconnect(){this.hide(),this.hostElement?.removeAttribute(`data-native-browser-scope`),this.connected=!1,this.frame!==null&&(cancelAnimationFrame(this.frame),this.frame=null),this.resizeObserver?.disconnect(),this.intersectionObserver?.disconnect(),this.stage=null,this.unsubscribeOcclusion?.(),this.unsubscribeOcclusion=void 0,document.removeEventListener(`scroll`,this.schedule,!0),window.removeEventListener(`resize`,this.schedule),this.lastPresentation=null,R({type:`release-scope`,scope:this.scope})}update(){if(!this.connected)return;let e=this.controller.host.renderRoot.querySelector(`.bp-stage`);e!==this.stage&&(this.resizeObserver?.disconnect(),this.intersectionObserver?.disconnect(),this.stage=e,this.intersecting=!0,e&&(typeof ResizeObserver==`function`&&(this.resizeObserver??=new ResizeObserver(this.schedule),this.resizeObserver.observe(e)),typeof IntersectionObserver==`function`&&(this.intersectionObserver??=new IntersectionObserver(e=>{let t=e.find(e=>e.target===this.stage);t&&(this.intersecting=t.isIntersecting,this.schedule())}),this.intersectionObserver.observe(e)))),this.canPresent()||this.hide(),this.schedule()}renew(){this.lastPresentation=null,this.schedule()}hide(){this.connected&&this.send(null,null)}canPresent(){return!!(this.connected&&this.controller.host.isConnected&&this.controller.host.browserPanelIsOpen()&&this.controller.native.activeTab&&this.controller.mode===`interact`&&!this.occluded&&this.intersecting)}report(){let e=this.stage;if(!e||!this.canPresent()){this.hide();return}let t=e.getBoundingClientRect(),n=this.hostElement,r=document.elementFromPoint(t.x+t.width/2,t.y+t.height/2);for(;r?.shadowRoot&&typeof r.shadowRoot.elementFromPoint==`function`;){let e=r.shadowRoot.elementFromPoint(t.x+t.width/2,t.y+t.height/2);if(!e||e===r)break;r=e}let i=r;for(;i&&i!==n;)i=i instanceof ShadowRoot?i.host:i.parentNode;if(!i||t.width<=0||t.height<=0){this.hide();return}this.send(this.controller.activeTargetId,{x:t.x,y:t.y,width:t.width,height:t.height})}send(e,t){let n={type:`present`,scope:this.scope,tabId:e,rect:t,visible:!!e},r={key:JSON.stringify(n)};if(r.key===this.lastPresentation?.key)return;this.lastPresentation=r;let i=this.controller.host.sessionKey;this.presentedTabId=e,e&&(this.lastPresented=++Dt),R(n).then(e=>{e&&!e.ok&&this.connected&&this.controller.host.sessionKey===i&&this.lastPresentation===r&&this.controller.reportError(e.error)})}}})))()}var W,G,At;function jt(){return(jt=e((()=>{B(),ge(),D(),kt(),U(),W=new Set,G=new Map,At=class{constructor(e){this.controller=e,this.allNativeTabs=[],this.revision=-1,this.pendingActivation=null,this.pendingCommand=null,this.pendingAddressFocus=null,this.captureGeneration=0,this.inspectionGeneration=0,this.presentation=new Ot(e)}includesTab(e){return!this.controller.host.fixedTab&&(e.sessionKey===void 0||e.sessionKey===this.controller.host.sessionKey)}get nativeTabs(){return this.allNativeTabs.filter(e=>this.includesTab(e))}get activeTab(){return this.nativeTabs.find(e=>e.id===this.controller.activeTargetId)}get tabs(){return this.nativeTabs.map(e=>({...e,targetId:e.id,kind:`native`}))}connect(){if(!p()||this.unsubscribeState)return;W.add(this),this.revision=-1;let e=mt();e&&this.acceptState(e,!1),this.unsubscribeState=ht(e=>this.acceptState(e,!0)),this.presentation.connect()}disconnect(){this.unsubscribeState&&(this.unsubscribeState(),this.unsubscribeState=void 0,W.delete(this),this.cancelPendingActivation(),this.cancelCapture(),this.presentation.disconnect())}mergeRemoteTabs(e){return[...this.tabs,...e.filter(e=>e.kind!==`native`)]}acceptState(e,t){if(e.revision<=this.revision)return;let n=new Set(this.nativeTabs.map(e=>e.id)),r=this.activeTab;this.revision=e.revision,this.allNativeTabs=e.tabs,this.controller.setState(`tabs`,this.mergeRemoteTabs(this.controller.tabs));let i=this.controller.view;i?.kind===`native`&&this.nativeTabs.find(e=>e.id===i.targetId)?.url!==i.url&&(this.controller.exitCaptureModes(),this.controller.setState(`view`,null));for(let t of G.keys())e.tabs.some(e=>e.id===t)||G.delete(t);for(let e of this.nativeTabs)if(e.id===this.pendingActivation)this.pendingActivation=null,this.controller.selectTab(e.id).then(()=>{this.pendingAddressFocus===e.id&&this.focusAddress(e.id)});else if(t&&e.openedBy===`native`&&!n.has(e.id)){if(!G.has(e.id)){let t=[...W].filter(t=>t.includesTab(e)).toSorted((e,t)=>t.presentation.lastPresented-e.presentation.lastPresented),n=t.find(t=>t.presentation.presentedTabId===e.openerTabId)??t.find(e=>e.presentation.lastPresented>0);n&&G.set(e.id,n.presentation.scope)}G.get(e.id)===this.presentation.scope&&this.controller.selectTab(e.id)}if(r&&!this.activeTab){let e=this.controller.tabs[0];this.controller.setState(`activeTargetId`,null),this.controller.setState(`view`,null),this.controller.exitCaptureModes(),e&&!this.pendingActivation?this.controller.selectTab(e.id):e||this.controller.syncUrlDraft(``)}else!this.controller.activeTargetId&&!this.pendingActivation&&this.nativeTabs[0]&&this.controller.selectTab(this.nativeTabs[0].id);this.activeTab&&(this.controller.syncUrlDraft(this.activeTab.url),this.controller.mode===`interact`&&this.controller.setState(`loading`,this.activeTab.loading)),this.presentation.update()}async send(e){let t=this.controller.host.sessionKey,n=this.controller.activeTargetId,r=this.captureGeneration;this.pendingCommand=e;let i=await R(e);return this.pendingCommand!==e||(this.pendingCommand=null,this.captureGeneration!==r||!this.controller.host.isConnected||!this.controller.host.browserPanelIsOpen()||this.controller.host.sessionKey!==t||this.controller.activeTargetId!==n)?!1:(i&&!i.ok&&this.controller.reportError(i.error),i?.ok===!0)}cancelPendingActivation(e){this.pendingActivation=null,this.pendingCommand=null,this.pendingAddressFocus!==e&&(this.pendingAddressFocus=null)}async open(e,t,n=!1){if(this.controller.setState(`errorText`,null),this.controller.setState(`pendingNewTab`,!1),!t&&this.activeTab){let t=this.activeTab.id;return this.controller.exitCaptureModes(),await this.send({type:`navigate`,tabId:t,url:e})?t:null}this.cancelPendingActivation();let r=`mac-${ve()}`;this.pendingActivation=r,this.pendingAddressFocus=n?r:null;let i=await R({type:`open`,tabId:r,url:e,sessionKey:this.controller.host.sessionKey,activate:!0});return this.pendingActivation===r?!i?.ok||!i.tabId?(this.cancelPendingActivation(),i&&!i.ok&&this.controller.reportError(i.error),null):(this.pendingActivation=i.tabId,n&&(this.pendingAddressFocus=i.tabId),this.nativeTabs.some(e=>e.id===i.tabId)?(this.pendingActivation=null,await this.controller.selectTab(i.tabId),this.presentation.renew(),i.tabId):null):null}async beginNewTab(){let e=await this.open(`about:blank`,!0,!0);e&&this.pendingAddressFocus===e&&(await this.controller.host.updateComplete,this.focusAddress(e))}focusAddress(e){this.controller.activeTargetId===e&&(this.pendingAddressFocus=null,this.controller.host.isConnected&&this.controller.host.browserPanelIsOpen()&&(this.controller.setState(`urlDraft`,``),this.controller.host.renderRoot.querySelector(`.bp-url`)?.focus()))}cancelCapture(){this.captureGeneration+=1,this.inspectionGeneration+=1}async capture(e){let t=this.activeTab;if(!t)return;let n=++this.captureGeneration;this.controller.setState(`loading`,!0);let r=()=>n===this.captureGeneration&&this.controller.host.isConnected&&this.controller.host.browserPanelIsOpen()&&this.activeTab?.id===t.id&&this.activeTab.url===t.url;try{let n=await R({type:`snapshot`,tabId:t.id});if(!r())return;if(!n?.ok||typeof n.dataUrl!=`string`||typeof n.cssWidth!=`number`||typeof n.cssHeight!=`number`){n&&!n.ok&&this.controller.reportError(n.error);return}let i=await V(n.dataUrl);if(!r())return;this.controller.setState(`view`,{kind:`native`,targetId:t.id,dataUrl:n.dataUrl,image:i,url:t.url,metrics:{cssWidth:n.cssWidth,cssHeight:n.cssHeight,title:t.title,url:t.url}}),this.controller.setState(`mode`,e),this.presentation.hide()}catch(e){r()&&this.controller.reportError(e)}finally{r()&&this.controller.setState(`loading`,!1)}}inspect(e){let t=this.activeTab,n=this.controller.view,r=this.controller.host.renderRoot.querySelector(`.bp-stage`),i=_t(r,e,n),a=H(r,e);if(!t||n?.kind!==`native`||n.targetId!==t.id||n.url!==t.url||!i||!a||this.controller.mode!==`inspect`)return;let o=++this.inspectionGeneration,s=()=>o===this.inspectionGeneration&&this.controller.host.isConnected&&this.controller.host.browserPanelIsOpen()&&this.activeTab?.id===t.id&&this.activeTab.url===n.url&&this.controller.view===n&&this.controller.mode===`inspect`;this.controller.setState(`inspectPointer`,a),this.controller.setState(`inspected`,null),this.controller.pendingInput.queueInspection(120,s,()=>{R({type:`inspect`,tabId:t.id,x:i.x,y:i.y}).then(e=>{s()&&(e&&!e.ok?this.controller.reportError(e.error):e?.ok&&`node`in e&&(this.controller.setState(`inspected`,ke(e.node)),this.controller.input.paintOverlay()))})})}}})))()}var Mt;function Nt(){return(Nt=e((()=>{D(),Mt=class{constructor(e){this.host=e,this.lifecycleEpoch=0,this.requestedMutation=0,this.requestedSnapshot=0,this.acceptedSnapshot=0,this.requestedCapture=0,this.requestedInspection=0,this.capturePending=!1,this.navigationQueues=new WeakMap,this.navigationCommits=new WeakMap}get epoch(){return this.lifecycleEpoch}get hasPendingCapture(){return this.capturePending}captureClient(){let e=this.host.client,t=JSON.stringify(this.host.dashboardTarget),n=this.host.dashboardTarget?``:this.host.sessionKey.trim();if(!(this.host.remoteAvailable??this.host.available)||!e||!this.host.isConnected||!this.host.browserPanelIsOpen())return null;if(this.scope?.gateway!==e||this.scope.dashboardKey!==t||this.scope.sessionKey!==n){let r=Ee(e,this.route,()=>this.scope?.client===r&&this.scope.gateway===this.host.client&&JSON.stringify(this.host.dashboardTarget)===t&&(this.host.dashboardTarget?``:this.host.sessionKey.trim())===n&&(this.host.remoteAvailable??this.host.available)&&this.host.isConnected&&this.host.browserPanelIsOpen(),this.host.dashboardTarget,n?()=>({sessionKey:n,referencedTabs:this.host.sessionTabs??[]}):void 0);this.scope={gateway:e,client:r,dashboardKey:t,sessionKey:n}}return this.scope.client}resetRoute(e){this.invalidate(),this.route=e,this.scope=void 0}isLive(e,t){return this.host.isConnected&&this.host.available&&this.host.browserPanelIsOpen()&&this.lifecycleEpoch===e&&this.scope?.dashboardKey===JSON.stringify(this.host.dashboardTarget)&&(this.scope?.sessionKey??``)===(this.host.dashboardTarget?``:this.host.sessionKey.trim())&&(t===void 0||this.scope?.gateway===this.host.client&&this.scope.client===t)}invalidate(){this.lifecycleEpoch+=1,this.capturePending=!1,this.invalidateInspection()}invalidateInspection(){this.requestedInspection+=1}beginMutation(e){this.requestedCapture+=1,this.capturePending=!1;let t={client:e,epoch:this.lifecycleEpoch,id:++this.requestedMutation,mutationId:this.requestedMutation,isCurrent:()=>this.isLive(t.epoch,e)&&t.id===this.requestedMutation};return t}hasQueuedNavigation(e,t){return this.navigationQueues.get(e)?.has(t)??!1}hasUnreconciledNavigation(e,t){return!e||!t?!1:this.navigationCommits.get(e)?.has(t)??!1}hasPendingNavigation(e,t){return!!(e&&t&&(this.hasQueuedNavigation(e,t)||this.hasUnreconciledNavigation(e,t)))}markNavigationCommitted(e,t){let n=this.navigationCommits.get(e);n||(n=new Set,this.navigationCommits.set(e,n)),n.add(t)}forgetNavigation(e,t){let n=this.navigationCommits.get(e);n?.delete(t),n?.size===0&&this.navigationCommits.delete(e)}retainTabSnapshot(e,t){let n=this.navigationCommits.get(e);if(!n)return t;let r=new Set(t.map(e=>e.id));for(let e of n.keys())r.has(e)||n.delete(e);return n.size===0&&this.navigationCommits.delete(e),t}capturedTabs(e,t,n,r){let i=e.find(e=>e.id===t);if(!i)return e;let a=n?.title??i.title,o=n?.url||r||i.url;return a===i.title&&o===i.url&&!i.urlUnavailableReason?e:e.map(e=>e.id===t?{...e,title:a,url:o,urlUnavailableReason:void 0}:e)}async queueNavigation(e,t,n){let r=this.navigationQueues.get(e);r||(r=new Map,this.navigationQueues.set(e,r));let i=r.get(t),a=i?i.then(n,n):n();r.set(t,a);try{return await a}finally{r.get(t)===a&&(r.delete(t),r.size===0&&this.navigationQueues.delete(e))}}beginSnapshot(e){let t=this.requestedMutation,n={client:e,epoch:this.lifecycleEpoch,id:++this.requestedSnapshot,mutationId:t,isCurrent:()=>this.isLive(n.epoch,e)&&n.id===this.requestedSnapshot&&t===this.requestedMutation};return n}acceptSnapshot(e,t,n){return!this.isLive(e.epoch,e.client)||e.id<this.acceptedSnapshot||!e.isCurrent()&&n!==t?!1:(this.acceptedSnapshot=e.id,!0)}canCaptureSnapshot(e){return this.isLive(e.epoch,e.client)&&e.mutationId===this.requestedMutation}survivingInvocation(e,t){let n=this.lifecycleEpoch,r=this.requestedMutation;return()=>this.isLive(n,t)&&r===this.requestedMutation&&(r!==e.id||n!==e.epoch)}beginCapture(e,t,n,r=this.lifecycleEpoch){if(!this.isLive(r,e)||n()!==t)return null;let i=++this.requestedCapture;return this.capturePending=!0,()=>this.isLive(r,e)&&n()===t&&i===this.requestedCapture}completeCapture(){this.capturePending=!1}beginInspection(e,t){let n=this.lifecycleEpoch,r=++this.requestedInspection;return()=>this.isLive(n,e)&&r===this.requestedInspection&&t()}}})))()}var Pt;function Ft(){return(Ft=e((()=>{Pt=class{constructor(){this.wheelDeltaX=0,this.wheelDeltaY=0,this.lastInspectAt=0}clear(){clearTimeout(this.refreshTimer),this.refreshTimer=void 0,this.clearInput()}clearInput(){clearTimeout(this.wheelTimer),clearTimeout(this.inspectTimer),this.wheelTimer=void 0,this.inspectTimer=void 0,this.wheelDeltaX=0,this.wheelDeltaY=0,this.lastInspectAt=0}scheduleRefresh(e,t){clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>{this.refreshTimer=void 0,t()},e)}queueWheel(e,t,n,r){this.wheelDeltaX+=e,this.wheelDeltaY+=t,this.wheelTimer===void 0&&(this.wheelTimer=window.setTimeout(()=>{this.wheelTimer=void 0;let e=this.wheelDeltaX,t=this.wheelDeltaY;this.wheelDeltaX=0,this.wheelDeltaY=0,(e!==0||t!==0)&&r(e,t)},n))}queueInspection(e,t,n){let r=()=>{t()&&(this.lastInspectAt=Date.now(),n())};if(Date.now()-this.lastInspectAt>=e){r();return}clearTimeout(this.inspectTimer),this.inspectTimer=window.setTimeout(()=>{this.inspectTimer=void 0,r()},e)}}})))()}async function It(e,t,n,r,i){if(n||!r())return null;try{return await Je(e,t)}catch(e){if(r()&&T(e))throw e;return r()&&A(e)&&i(),null}}var Lt;function Rt(){return(Rt=e((()=>{D(),U(),Lt=class{constructor(e){this.controller=e}async listTabs(e){let t=await Oe(e),n=this.controller.host.fixedTab;if(!n)return t;let r=t.tabs.filter(e=>e.id===n.targetId||e.targetId===n.targetId);for(let e of r)e.id=n.targetId;return{...t,tabs:r}}async refreshTabs(e,t){let n=this.controller,r=n.operations.beginSnapshot(e);try{let i=await this.listTabs(e);return t()&&n.operations.acceptSnapshot(r,n.activeTargetId,n.activeTargetId)?(n.setState(`running`,i.running),n.setState(`tabs`,n.native.mergeRemoteTabs(n.operations.retainTabSnapshot(e,i.tabs))),n.clearUnavailableView(),`accepted`):`rejected`}catch{return t()&&r.isCurrent()?`failed`:`rejected`}}async capture(e,t=this.controller.operations.epoch){let n=this.controller.operations.captureClient();if(this.controller.native.activeTab||!n||!this.controller.operations.isLive(t,n)||this.controller.activeTargetId!==e||this.controller.mode!==`interact`||this.controller.clearUnavailableView()||this.controller.stream.ownsView(e))return;let r=this.controller.operations.beginCapture(n,e,()=>this.controller.activeTargetId,t);if(!r)return;this.controller.setState(`loading`,!0);let i=this.controller.stream,a=i.frameRevision,o=()=>r()&&this.controller.mode===`interact`&&a===i.frameRevision&&!i.ownsView(e);try{if(await i.ensure(e,n,t)||!r()||i.ownsView(e))return;a=i.frameRevision;let s=this.controller.operations.route,c=this.controller.host,l=await Ke(n,e);if(!o())return;let[u,d]=await Promise.all([je({resourceBasePath:c.resourceBasePath,authToken:c.authToken,path:l.path}),It(n,e,this.controller.evaluateUnavailable,o,()=>this.controller.setState(`evaluateUnavailable`,!0))]);if(!o())return;let ee=await V(u);if(!o())return;let f=l.url&&d?.url&&l.url!==d.url?null:d,p={targetId:e,dataUrl:u,image:ee,url:l.url,metrics:f,...s?{browserTab:{...s,targetId:e}}:{}};this.controller.setState(`tabs`,this.controller.operations.capturedTabs(this.controller.tabs,e,f,p.url)),this.controller.setState(`view`,p),i.releaseReplacedView(),p.url&&this.controller.syncUrlDraft(p.url)}catch(t){o()&&(T(t)?(this.controller.setState(`tabs`,this.controller.tabs.map(t=>t.id===e?{...t,url:``,urlUnavailableReason:`navigation_blocked`}:t)),this.controller.clearUnavailableView()||this.controller.reportError(t)):this.controller.reportError(t))}finally{r()&&(this.controller.operations.completeCapture(),this.controller.setState(`loading`,!1))}}}})))()}var zt;function Bt(){return(Bt=e((()=>{zt=class{constructor(e,t=e=>new WebSocket(e)){this.options=e,this.closed=!1,this.socket=t(at(e.wsPath,e.gatewayUrl)),this.socket.binaryType=`arraybuffer`,this.socket.addEventListener(`message`,e=>this.receive(e.data)),this.socket.addEventListener(`close`,({code:e,reason:t})=>this.finish(e,t)),this.socket.addEventListener(`error`,()=>{this.finish(1006,``),this.socket.close()})}close(){this.closed=!0,this.socket.close()}finish(e,t){this.closed||(this.closed=!0,this.options.onClose({code:e,reason:t}))}receive(e){if(!this.closed)try{if(typeof e==`string`){let t=be(JSON.parse(e));if(t?.type===`error`){this.finish(1011,``),this.socket.close();return}if(typeof t?.url!=`string`||typeof t.title!=`string`)throw Error(`Invalid screencast metadata`);if(t.type===`ready`&&typeof t.targetId==`string`)this.options.onReady({targetId:t.targetId,url:t.url,title:t.title});else if(t.type===`meta`)this.options.onMeta({url:t.url,title:t.title});else throw Error(`Invalid screencast message`);return}if(!(e instanceof ArrayBuffer)||e.byteLength<5)throw Error(`Invalid screencast frame`);let t=new DataView(e).getUint32(0);if(t===0||t>=e.byteLength-4)throw Error(`Invalid screencast header length`);let n=be(JSON.parse(new TextDecoder().decode(new Uint8Array(e,4,t))));if(typeof n?.url!=`string`||typeof n.cssWidth!=`number`||!Number.isFinite(n.cssWidth)||n.cssWidth<=0||typeof n.cssHeight!=`number`||!Number.isFinite(n.cssHeight)||n.cssHeight<=0)throw Error(`Invalid screencast dimensions`);this.options.onFrame({blob:new Blob([new Uint8Array(e,4+t)],{type:`image/jpeg`}),url:n.url,cssWidth:n.cssWidth,cssHeight:n.cssHeight})}catch{this.finish(1002,``),this.socket.close()}}}})))()}var K,Vt,Ht;function Ut(){return(Ut=e((()=>{ye(),D(),U(),Bt(),S(),K=1e4,Vt=500,Ht=class{constructor(e){this.host=e,this.frameRevision=0,this.unsupported=!1,this.lastFailures=new Map,this.retiringUrls=new Set}ownsView(e){return!!(this.attempt?.live&&this.attempt.targetId===e&&this.current(this.attempt))}current(e){return this.attempt===e&&this.host.activeTargetId===e.targetId&&this.host.operations.isLive(e.epoch,e.client)}dimensions(){let e=this.host.host.renderRoot.querySelector(`.bp-stage`),t=this.host.host.renderRoot.querySelector(`.bp-viewport`),n=e?.clientWidth||t?.clientWidth||this.host.observedViewportSize?.width||1280,r=t?.clientHeight||this.host.observedViewportSize?.height||n,i=globalThis.devicePixelRatio||1;return{width:n,maxWidth:Math.min(2e3,Math.ceil(n*i)),maxHeight:Math.min(2e3,Math.ceil(Math.max(n,r)*i))}}async ensure(e,t,n){let r=x(this.host.operations.route);if((!this.scope||this.scope.client!==this.host.host.client||this.scope.route!==r)&&(this.close(),this.scope={client:this.host.host.client,route:r},this.unsupported=!1),this.attempt&&this.current(this.attempt)&&this.attempt.targetId===e)return this.attempt.live||await this.attempt.firstFrame;if(this.unsupported||Date.now()-(this.lastFailures.get(e)??-1/0)<K)return!1;this.close(!1);let i=this.dimensions(),a,o=new Promise(e=>{let t=setTimeout(()=>{this.current(s)?this.recover(s):this.attempt===s&&this.close(!1)},_e);a=n=>{clearTimeout(t),e(n)}}),s={targetId:e,client:t,epoch:n,width:i.width,live:!1,controller:new AbortController,firstFrame:o,settle:a,decoding:!1,presented:!1};return this.attempt=s,this.connect(s,{maxWidth:i.maxWidth,maxHeight:i.maxHeight}),await o}async connect(e,t){try{let n=await He(e.client,{targetId:e.targetId,...t},{signal:e.controller.signal});if(!this.current(e))return;e.connection=new zt({gatewayUrl:this.host.host.client.gatewayUrl,wsPath:n.wsPath,onReady:({url:t,title:n})=>this.updateMetadata(e,{url:t,title:n}),onMeta:t=>this.updateMetadata(e,t),onFrame:t=>{this.current(e)&&(this.frameRevision+=1,e.live=!0,e.pendingFrame=t,e.decoding||this.decodeFrames(e))},onClose:({code:t})=>{if(this.current(e)){if(t!==4003&&t!==4004){this.recover(e);return}this.close(),t===4003?(this.host.setState(`tabs`,this.host.tabs.map(t=>t.id===e.targetId?{...t,url:``,urlUnavailableReason:`navigation_blocked`}:t)),this.host.clearUnavailableView()):t===4004&&this.host.refreshAll()}}})}catch(t){this.current(e)&&(this.unsupported=ze(t),this.unsupported?this.close(!1):this.recover(e))}}recover(e){this.lastFailures.set(e.targetId,Date.now()),this.close(!1),this.recovery={targetId:e.targetId,epoch:e.epoch,client:e.client},this.scheduleRecovery(e.live?0:K)}scheduleRecovery(e){let t=this.recovery;t&&(clearTimeout(this.recoveryTimer),this.recoveryTimer=setTimeout(()=>{if(this.recoveryTimer=void 0,this.host.activeTargetId!==t.targetId||!this.host.operations.isLive(t.epoch,t.client)){this.recovery=void 0;return}this.host.mode===`interact`&&(this.scheduleRecovery(K),this.resume(t))},e))}async resume(e){await this.ensure(e.targetId,e.client,e.epoch)||this.host.activeTargetId===e.targetId&&this.host.operations.isLive(e.epoch,e.client)&&!this.host.operations.hasPendingCapture&&this.host.refreshView(e.targetId)}updateMetadata(e,t){this.current(e)&&(e.metadata=t,this.host.setState(`tabs`,this.host.tabs.map(n=>n.id===e.targetId?{...n,...t,urlUnavailableReason:void 0}:n)),this.host.syncUrlDraft(t.url))}flushPendingFrame(){this.scheduleRecovery(0);let e=this.attempt;e&&this.current(e)&&!e.decoding&&this.decodeFrames(e),this.resize()}async decodeFrames(e){e.decoding=!0;try{for(;this.current(e)&&e.pendingFrame;){if(this.host.mode!==`interact`)return;let t=e.pendingFrame,n=e.metadata;e.pendingFrame=void 0;let r=URL.createObjectURL(t.blob);this.decodingUrl=r;let i=await V(r);if(!this.current(e))return;if(this.host.mode!==`interact`){e.pendingFrame??=t,URL.revokeObjectURL(r),this.decodingUrl=void 0;return}if(n!==e.metadata&&e.metadata?.url!==t.url){URL.revokeObjectURL(r),this.decodingUrl=void 0;continue}let a=this.objectUrl;this.decodingUrl=void 0,this.objectUrl=r;let o=e.metadata?.url===t.url?e.metadata.title:this.host.tabs.find(t=>t.id===e.targetId)?.title??``,s={cssWidth:t.cssWidth,cssHeight:t.cssHeight,title:o,url:t.url};this.host.setState(`tabs`,this.host.operations.capturedTabs(this.host.tabs,e.targetId,s,t.url)),this.host.setState(`view`,{targetId:e.targetId,dataUrl:r,image:i,url:t.url,metrics:s,...this.host.operations.route?{browserTab:{...this.host.operations.route,targetId:e.targetId}}:{}}),this.host.operations.forgetNavigation(e.client,e.targetId),this.host.syncUrlDraft(t.url),e.presented||(e.presented=!0,this.host.setState(`loading`,!1)),e.settle(!0),await this.retireAfterUpdate(a)}}catch{this.current(e)&&this.recover(e)}finally{e.decoding=!1}}resized(e){return Math.abs(this.dimensions().width-e.width)/e.width>.3}resize(){let e=this.attempt;e&&this.current(e)&&this.resized(e)&&(this.resizeTimer??=setTimeout(()=>{this.resizeTimer=void 0,this.attempt===e&&this.current(e)&&this.resized(e)&&this.host.mode===`interact`&&(this.close(!1),this.host.refreshView(e.targetId))},Vt))}releaseReplacedView(){let e=this.objectUrl;this.objectUrl=void 0,this.retireAfterUpdate(e)}async retireAfterUpdate(e){e&&this.retiringUrls.add(e),await this.host.host.updateComplete,e&&this.retiringUrls.delete(e)&&URL.revokeObjectURL(e)}close(e=!0){e&&this.lastFailures.clear(),clearTimeout(this.recoveryTimer),this.recoveryTimer=void 0,this.recovery=void 0,clearTimeout(this.resizeTimer),this.resizeTimer=void 0;let t=this.attempt;this.attempt=void 0,t?.controller.abort(),t?.settle(!1),t?.connection?.close();for(let t of[e?this.objectUrl:void 0,this.decodingUrl,...e?this.retiringUrls:[]])t&&URL.revokeObjectURL(t);e&&(this.objectUrl=void 0,this.retiringUrls.clear()),this.decodingUrl=void 0}}})))()}var Wt,q,J,Gt;function Kt(){return(Kt=e((()=>{D(),Wt=300,q=100,J=8192,Gt=class{constructor(e){this.controller=e,this.observedViewportSize=null,this.lastResize=null,this.resizing=!1}invalidate(){clearTimeout(this.timer),this.timer=void 0,this.lastResize=null}captured(){let e=this.lastResize,t=this.controller.view;e&&t?.targetId===e.targetId&&t.metrics&&Math.abs(t.metrics.cssWidth-e.width)<=1&&Math.abs(t.metrics.cssHeight-e.height)<=1&&(e.acknowledged=!0),this.schedule()}resize(e,t){this.observedViewportSize={width:e,height:t},clearTimeout(this.timer),this.timer=void 0,this.schedule()}schedule(){!this.controller.native.activeTab&&this.controller.host.browserPanelIsOpen()&&this.observedViewportSize&&(this.timer??=setTimeout(()=>{this.timer=void 0,this.syncViewport()},Wt))}syncViewport(){let e=this.controller.activeTargetId,t=this.observedViewportSize,n=this.controller.view;if(this.controller.native.activeTab||!this.controller.host.browserPanelIsOpen()||!this.controller.operations.captureClient()||!e||!t||n?.targetId!==e||this.resizing)return;let r=Math.min(J,Math.max(q,Math.round(t.width))),i=Math.min(J,Math.max(q,Math.round(t.height))),a=n.metrics?.cssWidth,o=n.metrics?.cssHeight;if(a!==void 0&&o!==void 0&&Math.abs(a-r)<=1&&Math.abs(o-i)<=1){this.lastResize=null;return}let s=this.lastResize;if(s?.targetId===e&&!s.acknowledged&&s.width===r&&s.height===i&&s.remoteWidth===a&&s.remoteHeight===o)return;let c={targetId:e,width:r,height:i,remoteWidth:a,remoteHeight:o,acknowledged:!1};this.lastResize=c,this.resizing=!0,this.controller.runAction(e=>Ve(e,c)).finally(()=>{this.resizing=!1,this.schedule()})}}})))()}function Y(e){let t=e.trim();if(!t)return null;let n=/^[a-z][a-z0-9+.-]*:(?![0-9])/i.test(t);if(n&&!/^https?:\/\//i.test(t))return null;let r=n?t:`https://${t}`;try{let e=new URL(r);return e.protocol===`http:`||e.protocol===`https:`?e.toString():null}catch{return null}}var qt,Jt;function Yt(){return(Yt=e((()=>{B(),te(),n(),u(),a(),D(),wt(),Et(),jt(),Nt(),Ft(),Rt(),Ut(),Kt(),S(),qt=350,Jt=class{constructor(e){this.host=e,this.running=null,this.tabs=[],this.activeTargetId=null,this.view=null,this.loading=!1,this.errorText=null,this.noticeText=null,this.mode=`interact`,this.strokes=[],this.inspected=null,this.inspectPointer=null,this.evaluateUnavailable=!1,this.urlDraft=``,this.pendingNewTab=!1,this.pendingInput=new Pt,this.download=new Tt(this),this.activeClient=null,this.urlDraftEditing=!1,this.viewport=new Gt(this),this.snapshot=new Lt(this),this.operations=new Mt(e),this.input=new Ct(this),this.stream=new Ht(this),this.native=new At(this),e.addController(this)}hostConnected(){this.native.connect()}hostUpdated(){this.native.presentation.update()}hostDisconnected(){this.suspendView(),this.native.disconnect()}suspendView(){this.native.cancelCapture(),this.native.presentation.hide(),this.input.resetCaptureState(),this.invalidateViewOperations(),this.view?.dataUrl.startsWith(`blob:`)&&this.setState(`view`,null),this.setState(`loading`,!1)}setState(e,t){Object.is(this[e],t)||((e===`view`&&t===null||e===`activeTargetId`)&&this.stream.close(),Object.assign(this,{[e]:t}),e===`view`&&this.view&&this.viewport.captured(),this.host.requestUpdate(),(e===`activeTargetId`||e===`mode`)&&this.native.presentation.update())}synchronizeClient(){return this.host.client!==this.activeClient&&(this.activeClient=this.host.client,this.operations.resetRoute(),this.resetBrowserState(),!0)}get unavailableTabText(){let e=this.tabs.find(e=>e.id===this.activeTargetId)?.urlUnavailableReason;return e?c(e===`navigation_blocked`?`browser.navigationBlocked`:`browser.navigationCheckFailed`):null}clearUnavailableView(){return this.unavailableTabText?(this.invalidateViewOperations(),this.setState(`view`,null),this.setState(`loading`,!1),this.setState(`urlDraft`,``),this.setState(`errorText`,null),this.exitCaptureModes(),!0):!1}invalidateViewOperations(){this.download.cancel(),this.stream.close(),this.operations.invalidate(),this.pendingInput.clear(),this.viewport.invalidate()}resetBrowserState(){this.invalidateViewOperations(),this.setState(`running`,null);let e=this.native.activeTab??this.native.tabs[0];this.setState(`tabs`,this.native.tabs),this.setState(`activeTargetId`,e?.id??null),this.setState(`view`,null),this.setState(`loading`,!1),this.setState(`errorText`,null),this.setState(`noticeText`,null),this.setState(`mode`,`interact`),this.setState(`strokes`,[]),this.input.resetCaptureState(),this.setState(`inspected`,null),this.setState(`inspectPointer`,null),this.urlDraftEditing=!1,this.setState(`urlDraft`,e?.url??``),this.setState(`pendingNewTab`,!1),this.setState(`evaluateUnavailable`,!1)}reportError(e){let t=T(e)?c(`browser.navigationBlocked`):o(e);this.setState(`errorText`,c(`browser.errors.requestFailed`,{error:t}))}async refreshAll(){this.native.presentation.update();let e=this.operations.captureClient();if(!e)return;let t=this.operations.beginSnapshot(e);this.setState(`errorText`,null),!this.native.activeTab&&!this.stream.ownsView(this.activeTargetId)&&this.setState(`loading`,!0);try{let n=await this.snapshot.listTabs(e),r=n.tabs.find(e=>e.id===this.activeTargetId||e.targetId===this.activeTargetId),i=r??n.tabs.find(e=>!e.urlUnavailableReason)??n.tabs[0];if(!this.operations.acceptSnapshot(t,this.activeTargetId,i?.id??null)||(this.setState(`running`,n.running),this.setState(`tabs`,this.native.mergeRemoteTabs(this.operations.retainTabSnapshot(e,n.tabs))),this.native.activeTab)||!this.operations.canCaptureSnapshot(t))return;n.running||this.setState(`view`,null),this.activeTargetId!==null&&!r&&(this.invalidateViewOperations(),t.epoch=this.operations.epoch,this.setState(`view`,null),this.exitCaptureModes()),this.setState(`activeTargetId`,i?.id??null),this.syncUrlDraft(i?.url??``),i?await this.refreshView(i.id,t.epoch):this.setState(`view`,null)}catch(e){t.isCurrent()&&this.reportError(e)}finally{t.isCurrent()&&!this.native.activeTab&&this.setState(`loading`,!1)}}async refreshView(e,t=this.operations.epoch){await this.snapshot.capture(e,t)}async runAction(e,t=!0){let n=this.operations.captureClient();if(!n)return!1;let r=this.operations.epoch,i=()=>this.operations.isLive(r,n);try{return this.setState(`errorText`,null),await e(n),i()&&t&&this.pendingInput.scheduleRefresh(qt,()=>{i()&&this.activeTargetId&&this.refreshView(this.activeTargetId,r)}),i()}catch(e){return i()?(A(e)&&this.setState(`evaluateUnavailable`,!0),this.reportError(e),this.operations.hasPendingCapture||this.setState(`loading`,!1),!1):!1}}get observedViewportSize(){return this.viewport.observedViewportSize}handleViewportResize(e,t){this.viewport.resize(e,t),this.stream.resize()}async startBrowserNow(){if(this.host.fixedTab||!this.operations.captureClient())return;let e=this.operations.epoch;this.setState(`loading`,!0),await this.runAction(async t=>{await Pe(t),this.operations.isLive(e,t)&&await this.refreshAll()},!1)}async openUrl(e,t){if(this.host.fixedTab&&(t.newTab||t.native||!this.activeTargetId)){this.reportError(c(`browser.tabUnavailable`));return}if(p()&&(t.native||t.newTab||this.native.activeTab||!this.activeTargetId)){await this.native.open(e,t.newTab||!this.native.activeTab);return}let n=this.operations.captureClient();if(!n)return;let r=this.operations.beginMutation(n);this.setState(`loading`,!0),this.setState(`errorText`,null),this.setState(`pendingNewTab`,!1);let i=!1;try{if(t.newTab||!this.activeTargetId){let t=await Be(n,e);if(!r.isCurrent()){await this.snapshot.refreshTabs(n,this.operations.survivingInvocation(r,n));return}let i=t?.id??this.activeTargetId;i!==this.activeTargetId&&(this.invalidateViewOperations(),r.epoch=this.operations.epoch,this.setState(`view`,null),this.exitCaptureModes()),this.setState(`activeTargetId`,i)}else{this.invalidateViewOperations(),r.epoch=this.operations.epoch,this.exitCaptureModes();let t=this.activeTargetId;if(i=this.operations.hasPendingNavigation(n,t),await this.operations.queueNavigation(n,t,async()=>{r.isCurrent()&&(await Re(n,{url:e,targetId:t}),this.operations.markNavigationCommitted(n,t))}),!r.isCurrent())return;this.setState(`view`,null)}if(await this.snapshot.refreshTabs(n,()=>r.isCurrent())!==`rejected`&&r.isCurrent()&&this.activeTargetId){let e=this.activeTargetId;await this.refreshView(e,r.epoch),!t.newTab&&r.isCurrent()&&this.view?.targetId===e&&this.operations.forgetNavigation(n,e)}}catch(e){if(r.isCurrent()){if(i&&this.activeTargetId){let e=this.activeTargetId,t=await this.snapshot.refreshTabs(n,()=>r.isCurrent()),i=this.tabs.find(t=>t.id===e);t===`accepted`&&r.isCurrent()&&i&&(this.setState(`view`,null),await this.refreshView(e,r.epoch),r.isCurrent()&&this.view?.targetId===e&&this.operations.forgetNavigation(n,e)),r.isCurrent()&&this.operations.hasUnreconciledNavigation(n,e)&&(this.setState(`activeTargetId`,null),this.setState(`view`,null),this.syncUrlDraft(``))}this.reportError(e)}}finally{r.isCurrent()&&this.setState(`loading`,!1)}}async selectTab(e,t,n){let r=this.host.fixedTab;if(r&&(t&&x(t)!==x(r)||e!==r.targetId&&!this.tabs.some(t=>t.id===e&&t.targetId===r.targetId)))return;this.native.cancelPendingActivation(e);let i=this.native.tabs.find(t=>t.id===e);if(i){this.invalidateViewOperations(),this.exitCaptureModes(),this.setState(`activeTargetId`,e),this.setState(`view`,null),this.setState(`urlDraft`,i.url),this.setState(`loading`,this.native.activeTab?.loading??!1),this.setState(`errorText`,null),this.native.presentation.renew();return}if(t&&x(this.operations.route)!==x(t))this.operations.resetRoute(t),this.resetBrowserState();else if(e===this.activeTargetId&&!t)return;let a=this.operations.captureClient(),o={targetId:this.activeTargetId,view:this.view};this.invalidateViewOperations();let s=this.operations.epoch;if(this.setState(`activeTargetId`,t?null:e),this.setState(`view`,null),this.exitCaptureModes(),(t||!this.clearUnavailableView())&&!await this.runAction(async r=>{if(t){let t=await this.snapshot.refreshTabs(r,()=>this.operations.isLive(s,r));if(!this.operations.isLive(s,r))return;let n=this.tabs.find(t=>t.id===e||t.targetId===e);if(this.setState(`activeTargetId`,this.running===!1?null:n?.id??e),t===`accepted`&&this.running!==!1&&!n)throw Error(c(`browser.tabUnavailable`));if(this.clearUnavailableView())return}let i=this.activeTargetId;i&&(n?.focusBrowserTab!==!1&&await Ne(r,i),this.operations.isLive(s,r)&&(await this.refreshView(i,s),this.operations.isLive(s,r)&&this.activeTargetId===i&&this.view?.targetId===i&&this.operations.forgetNavigation(r,i)))},!1)&&this.operations.isLive(s)&&this.activeTargetId===e){if(this.operations.hasPendingNavigation(a,o.targetId)){this.setState(`activeTargetId`,null),this.syncUrlDraft(``);return}this.setState(`activeTargetId`,o.targetId),this.setState(`view`,o.view?.dataUrl.startsWith(`blob:`)?null:o.view),o.targetId&&o.view?.dataUrl.startsWith(`blob:`)&&await this.refreshView(o.targetId)}}async closeTab(e){if(!this.host.fixedTab){if(this.native.tabs.some(t=>t.id===e)){await this.native.send({type:`close`,tabId:e});return}await this.runAction(async t=>{let n=this.operations.epoch;if(await Ge(t,e),this.operations.forgetNavigation(t,e),!this.operations.isLive(n,t)){this.operations.isLive(this.operations.epoch,t)&&await this.refreshAll();return}this.setState(`tabs`,this.tabs.filter(t=>t.id!==e));let r=await this.snapshot.refreshTabs(t,()=>this.operations.isLive(n,t));if(!this.operations.isLive(n,t))return;if(this.activeTargetId!==e){r!==`rejected`&&!this.operations.hasPendingCapture&&this.setState(`loading`,!1);return}let i=this.tabs.find(e=>!e.urlUnavailableReason)??this.tabs[0]??null;if(i?.kind===`native`){await this.selectTab(i.id);return}this.invalidateViewOperations(),this.setState(`activeTargetId`,i?.id??null),this.setState(`view`,null),this.exitCaptureModes(),i?await this.refreshView(i.id):this.setState(`loading`,!1)},!1),await this.host.updateComplete}}reloadPage(){if(this.native.activeTab){this.exitCaptureModes(),this.native.send({type:this.native.activeTab.loading?`stop`:`reload`,tabId:this.native.activeTab.id});return}if(this.unavailableTabText){this.refreshAll();return}let e=Y(this.view?.metrics?.url||this.view?.url||this.urlDraft);if(this.activeTargetId){if(!e){this.refreshView(this.activeTargetId);return}this.openUrl(e,{newTab:!1})}}goHistory(e){if(this.native.activeTab){this.exitCaptureModes(),this.native.send({type:e===-1?`back`:`forward`,tabId:this.native.activeTab.id});return}let t=this.activeTargetId;t&&this.view&&this.runAction(n=>De(n,{targetId:t,delta:e}))}commitUrlDraft(){let e=Y(this.urlDraft);e&&this.openUrl(e,{newTab:this.pendingNewTab||this.tabs.length===0})}beginNewTab(){if(this.host.fixedTab)return;if(p()){this.native.beginNewTab();return}this.setState(`pendingNewTab`,!0),this.setState(`urlDraft`,``);let e=this.operations.epoch;this.host.updateComplete.then(()=>{this.operations.isLive(e)&&this.host.renderRoot.querySelector(`.bp-url`)?.focus()})}resetUrlDraftFromView(){this.setState(`urlDraft`,this.native.activeTab?.url||this.view?.metrics?.url||this.view?.url||``)}syncUrlDraft(e){this.urlDraftEditing||this.setState(`urlDraft`,e)}openExternal(){let e=this.native.activeTab?.url||this.view?.metrics?.url||this.view?.url||this.urlDraft;e&&!(this.native.activeTab&&ee(e))&&s(e)}exitCaptureModes(){this.native.cancelCapture(),this.native.activeTab&&this.setState(`view`,null),this.operations.invalidateInspection(),this.input.resetCaptureState(),this.setState(`mode`,`interact`),this.setState(`strokes`,[]),this.setState(`inspected`,null),this.setState(`inspectPointer`,null),this.stream.flushPendingFrame()}setMode(e){if(this.mode===e){this.exitCaptureModes();return}if(this.exitCaptureModes(),this.native.activeTab&&e!==`interact`){this.native.capture(e);return}this.setState(`mode`,e),this.setState(`noticeText`,null),e===`inspect`&&this.evaluateUnavailable&&(this.setState(`errorText`,c(`browser.inspectUnavailable`)),this.setState(`mode`,`interact`))}handleStageClick(e){this.native.activeTab||this.input.handleStageClick(e)}handleWheel(e){this.native.activeTab||this.input.handleWheel(e)}handleViewportKeydown(e){this.native.activeTab||this.input.handleViewportKeydown(e)}handleViewportPaste(e){this.native.activeTab||this.input.handleViewportPaste(e)}handleOverlayPointerMove(e){this.native.activeTab&&this.mode===`inspect`?this.native.inspect(e):this.input.handleOverlayPointerMove(e)}}})))()}function Xt(e){if(e.title.trim())return e.title.trim();try{return new URL(e.url).host||c(`browser.untitledTab`)}catch{return e.url||c(`browser.untitledTab`)}}function X(e){return e.map(e=>({id:e.id,label:Xt(e),url:e.url,favicon:e.favicon,icon:e.kind===`native`?m.monitor:m.globe}))}function Zt(e){let t=X(e.tabs).map((t,n)=>({id:t.id,domId:`browser-tab-${t.id}`,label:t.label,title:`${c(e.tabs[n]?.kind===`native`?`browser.nativeTab`:`browser.remoteTab`)}: ${t.url}`,icon:t.favicon?h`<img class="tabstrip-tab__favicon" src=${t.favicon} alt="" />`:t.icon,closeLabel:`${c(`browser.closeTab`)}: ${t.label}`}));return it({tabs:t,activeId:e.activeTargetId,ariaControls:`browser-tab-panel`,onSelect:e.onSelect,onClose:e.onClose,onNew:e.onNew,newLabel:c(`browser.newTab`),newTabAction:!0,...e.hideNewControl?{newControl:g}:{}})}function Z(){return(Z=e((()=>{_(),n(),ue(),j()})))()}function Q(e){return h`<button
    class=${e.className??`bp-icon`}
    type="button"
    ?data-new-tab-action=${e.newTab}
    title=${e.title??e.label}
    aria-label=${e.label}
    aria-busy=${e.busy??g}
    ?disabled=${e.disabled}
    @click=${e.onClick}
  >
    ${e.icon}
  </button>`}function Qt(e,t){return Zt({tabs:e.tabs,activeTargetId:e.activeTargetId,onSelect:t=>void e.selectTab(t),onClose:t=>e.closeTab(t),onNew:()=>e.beginNewTab(),hideNewControl:t})}function $t(e,t,n,r){let i=e.native.activeTab?.url||e.view?.metrics?.url||e.view?.url||e.urlDraft;return h`
    <div class="rail-header__actions bp-actions">
      ${ot({current:t,groupClass:`bp-dock-modes`,groupLabel:c(`browser.title`),destinations:[{dock:`bottom`,label:c(`browser.dockBottom`),icon:m.panelBottomOpen,className:`bp-icon`},{dock:`right`,label:c(`browser.dockRight`),icon:m.panelRightOpen,className:`bp-icon`}],onSelect:n})}
      ${Q({className:`rail-header__action bp-icon`,label:c(`browser.openExternal`),icon:m.externalLink,newTab:!0,disabled:!i,onClick:()=>e.openExternal()})}
      ${Q({className:`rail-header__action bp-icon`,label:c(`browser.close`),icon:m.x,onClick:r})}
    </div>
  `}function en(e,t){let n=e.native.activeTab,r=!!(n||e.view);return h`
    <div class="bp-toolbar">
      ${!n&&!e.host.fixedTab&&!e.host.dashboardTarget?.sessionScoped&&e.operations.route?h`<span
              class="bp-profile"
              title=${c(`browser.profile`,{profile:e.operations.route.profile})}
              >${e.operations.route.profile}</span
            >`:g}
      ${t&&!e.host.fixedTab?Q({label:c(`browser.newTab`),icon:m.plus,newTab:!0,onClick:()=>e.beginNewTab()}):g}
      ${Q({label:c(`browser.back`),icon:m.chevronLeft,disabled:n?!n.canGoBack:!r||e.evaluateUnavailable,onClick:()=>e.goHistory(-1)})}
      ${Q({label:c(`browser.forward`),icon:m.chevronRight,disabled:n?!n.canGoForward:!r||e.evaluateUnavailable,onClick:()=>e.goHistory(1)})}
      ${Q({label:c(n?.loading?`browser.stop`:`browser.reload`),icon:n?.loading?m.x:m.refresh,busy:!n&&e.loading,disabled:!e.activeTargetId,onClick:()=>e.reloadPage()})}
      <input
        class="bp-url"
        type="text"
        spellcheck="false"
        autocomplete="off"
        ?disabled=${!(!e.host.fixedTab||e.activeTargetId)}
        placeholder=${c(`browser.urlPlaceholder`)}
        .value=${e.urlDraft}
        @focus=${t=>{e.urlDraftEditing=!0,t.target.select()}}
        @blur=${()=>{e.urlDraftEditing=!1}}
        @input=${t=>e.setState(`urlDraft`,t.target.value)}
        @keydown=${t=>{t.key===`Enter`?(t.preventDefault(),e.commitUrlDraft(),t.target.blur()):t.key===`Escape`&&(e.resetUrlDraftFromView(),t.target.blur())}}
      />
      ${t?Q({label:c(`browser.openExternal`),icon:m.externalLink,newTab:!0,disabled:!r,onClick:()=>e.openExternal()}):g}
      ${e.host.dashboardTarget?.sessionScoped?g:Q({label:c(e.download.pending?`browser.downloading`:`browser.downloadFile`),icon:e.download.pending?m.loader:m.download,busy:e.download.pending,disabled:!e.download.available,onClick:()=>void e.download.save()})}
      ${Q({className:`bp-icon ${e.mode===`annotate`?`is-active`:``}`,label:c(`browser.annotate`),icon:m.penLine,disabled:!r,onClick:()=>e.setMode(`annotate`)})}
      ${Q({className:`bp-icon ${e.mode===`inspect`?`is-active`:``}`,label:c(`browser.inspect`),title:!n&&e.evaluateUnavailable?c(`browser.inspectUnavailable`):c(`browser.inspect`),icon:sn,disabled:!r||!n&&e.evaluateUnavailable,onClick:()=>e.setMode(`inspect`)})}
    </div>
  `}function tn(e){return e.mode===`annotate`?h`
    <div class="bp-annotatebar">
      <span class="bp-annotatebar__hint">${c(`browser.annotateHint`)}</span>
      <button
        class="bp-btn"
        type="button"
        ?disabled=${e.strokes.length===0}
        @click=${()=>e.input.undoStroke()}
      >
        ${c(`browser.annotateUndo`)}
      </button>
      <button
        class="bp-btn"
        type="button"
        ?disabled=${e.strokes.length===0}
        @click=${()=>e.input.clearStrokes()}
      >
        ${c(`browser.annotateClear`)}
      </button>
      <button
        class="bp-btn"
        type="button"
        title=${c(`browser.annotateDone`)}
        @click=${()=>e.exitCaptureModes()}
      >
        ${m.x}
      </button>
      <button
        class="bp-btn bp-btn--primary"
        type="button"
        ?disabled=${e.strokes.length===0}
        @click=${()=>void e.input.sendAnnotation({})}
      >
        ${c(`browser.annotateSend`)}
      </button>
    </div>
  `:g}function nn(e){let t=e.inspected,n=e.inspectPointer;if(e.mode!==`inspect`||!t||!n)return g;let r=`${Math.min(92,Math.max(0,n.x*100))}%`,i=`${Math.min(92,Math.max(0,n.y*100+2))}%`,a=t.classes.map(e=>`.${e}`).join(``);return h`
    <div class="bp-tooltip" style="left:${r};top:${i}">
      <div class="bp-tooltip__title">
        <span class="bp-tooltip__selector"
          >${t.tag}${t.id?`#${t.id}`:``}${a}</span
        >
        <span class="bp-tooltip__size"
          >${Math.round(t.rect.width)} × ${Math.round(t.rect.height)}</span
        >
      </div>
      ${t.name?h`<div class="bp-tooltip__row">
              <span>${c(`browser.inspectName`)}</span><span>${t.name}</span>
            </div>`:g}
      ${t.role?h`<div class="bp-tooltip__row">
              <span>${c(`browser.inspectRole`)}</span><span>${t.role}</span>
            </div>`:g}
      <div class="bp-tooltip__row">
        <span>${c(`browser.inspectFocusable`)}</span><span>${t.focusable?`✓`:`–`}</span>
      </div>
    </div>
  `}function rn(e){if(e.native.activeTab&&e.mode===`interact`)return h`<div
      class="bp-stage bp-stage--native"
      aria-busy=${e.native.activeTab.loading}
    >
      ${e.native.activeTab.loading?h`<span class="bp-native-loading" role="status">${c(`browser.loading`)}</span>`:g}
    </div>`;if(!e.native.activeTab&&e.running===!1)return M({icon:m.globe,heading:c(`chat.sidePanel.browser`),description:c(`browser.notRunning`),action:e.host.fixedTab?g:h`
            <button class="bp-btn" type="button" @click=${()=>void e.startBrowserNow()}>
              ${c(`browser.start`)}
            </button>
          `});if(!e.view&&e.unavailableTabText)return h`<div class="bp-status" role="status">${e.unavailableTabText}</div>`;if(!e.view)return e.loading?We(`browser`,c(`browser.loading`)):M({icon:m.globe,heading:c(`chat.sidePanel.browser`),description:c(`chat.sidePanel.browserEmpty`)});let t=e.mode===`annotate`?`bp-overlay--annotate`:e.mode===`inspect`?`bp-overlay--inspect`:``;return h`
    <div class="bp-stage">
      <img
        class="bp-shot"
        src=${e.view.dataUrl}
        alt=${e.view.metrics?.title||``}
      />
      <canvas
        class="bp-overlay ${t}"
        @click=${t=>e.handleStageClick(t)}
        @pointerdown=${t=>e.input.handleOverlayPointerDown(t)}
        @pointermove=${t=>e.handleOverlayPointerMove(t)}
        @pointerup=${t=>e.input.handleOverlayPointerUp(t)}
        @pointercancel=${t=>e.input.handleOverlayPointerUp(t)}
        @lostpointercapture=${t=>e.input.handleOverlayPointerUp(t)}
      ></canvas>
      ${e.mode===`interact`?h`<textarea
              class="bp-overlay bp-input"
              aria-label=${c(`browser.inputLabel`)}
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              @click=${t=>e.handleStageClick(t)}
              @contextmenu=${t=>e.handleStageClick(t)}
              @beforeinput=${t=>e.input.handleTextInput(t)}
              @input=${t=>e.input.handleTextInput(t)}
              @compositionstart=${()=>e.input.handleCompositionStart()}
              @compositionend=${t=>e.input.handleCompositionEnd(t)}
              @pointerdown=${t=>e.input.handleTouchPointerDown(t)}
              @pointermove=${t=>e.input.handleTouchPointerMove(t)}
              @pointerup=${t=>e.input.handleTouchPointerEnd(t)}
              @pointercancel=${t=>e.input.handleTouchPointerEnd(t)}
              @lostpointercapture=${t=>e.input.handleTouchPointerEnd(t)}
            ></textarea>`:g}
      ${nn(e)}
    </div>
  `}function an(e,t){return h`
    <wa-tab-panel
      id="browser-tab-panel"
      class="bp-viewport"
      name=${e.activeTargetId??`browser`}
      active
      aria-labelledby=${t&&e.activeTargetId?`browser-tab-${e.activeTargetId}`:g}
      tabindex="0"
      .onwheel=${t=>e.handleWheel(t)}
      @keydown=${t=>e.handleViewportKeydown(t)}
      @paste=${t=>e.handleViewportPaste(t)}
      aria-busy=${e.loading?`true`:`false`}
    >
      ${rn(e)}
    </wa-tab-panel>
  `}function on(e,t,n,r,i,a,o,s=!1,l=!1){let u=s?g:t===`bottom`?`height:${n}px`:`width:${r}px`,d=!e.host.fixedTab&&(!s||!l&&e.tabs.length>0);return h`
    <section
      class="bp bp--${s?`embedded`:t}"
      style=${u}
      aria-label=${c(`browser.title`)}
    >
      ${s?g:o}
      ${d?h`<header class="rail-header bp-header">
              ${Qt(e,s)}
              ${s?g:$t(e,t,i,a)}
            </header>`:g}
      ${en(e,s)} ${tn(e)}
      ${e.errorText?h`<div class="bp-note bp-note--error" role="alert">${e.errorText}</div>`:e.noticeText?h`<div class="bp-note" role="status">${e.noticeText}</div>`:g}
      ${an(e,d)}
    </section>
  `}var sn;function cn(){return(cn=e((()=>{_(),n(),w(),st(),ce(),ue(),ct(),qe(),Z(),k(),sn=ae(me`<path d="m4 4 7.07 17 2.51-7.39L21 11.07z" />`)})))()}var ln;function un(){return(un=e((()=>{_(),ln=fe`
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
`})))()}var dn=t({}),$;function fn(){return(fn=e((()=>{_(),pe(),B(),n(),r(),Qe(),de(),se(),$e(),tt(),j(),oe(),D(),Yt(),cn(),Z(),un(),S(),$=class extends d{constructor(...e){super(...e),this.client=null,this.available=!1,this.remoteAvailable=!0,this.suppressed=!1,this.resourceBasePath=``,this.authToken=null,this.embedded=!1,this.tabsInHeader=!1,this.presented=!1,this.refreshOnPresentation=!0,this.sessionKey=``,this.sessionTabs=[],this.activeSessionKey=``,this.browserPanelController=new Jt(this),this.dockLayout=new ie(this,{layout:le,reservationPrefix:`browser`,isAvailable:()=>this.available}),this.viewportResizeObserver=null,this.observedViewportElement=null,this.handleToggleRequest=e=>{if(this.fixedTab)return;let t=e instanceof CustomEvent&&typeof e.detail==`object`&&e.detail!==null?e.detail:null;this.synchronizeBrowserContext();let n=C(t?.browserTab);if(t?.browserTab!==void 0&&!n)return;let r=typeof t?.url==`string`?Y(t.url):null,i=!0;if(this.embedded){if(!this.browserPanelIsOpen()||t?.open===!1||!this.available)return}else{if((t?.dock===`right`||t?.dock===`bottom`)&&this.dockLayout.setDock(t.dock,!1),t?.open===!1){this.closePanel();return}if(!r&&t?.open!==!0){this.toggle();return}if(!this.available)return;i=!this.dockLayout.open,this.dockLayout.setOpen(!0)}r?this.browserPanelController.openUrl(r,{newTab:!0,native:t?.native}):n?(this.consumedPreferredRevision=this.preferredRevision(),this.browserPanelController.selectTab(n.targetId,n)):t?.newTab===!0?this.browserPanelController.beginNewTab():i&&!this.followPreferredTab()&&this.browserPanelController.refreshAll()}}static{this.styles=[rt,et,ln,Ze]}connectedCallback(){super.connectedCallback(),this.embedded||window.addEventListener(f,this.handleToggleRequest),this.dockLayout.setSuppressed(this.suppressed),!this.embedded&&this.dockLayout.open&&this.browserPanelController.refreshAll()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(f,this.handleToggleRequest),this.viewportResizeObserver?.disconnect(),this.viewportResizeObserver=null,this.observedViewportElement=null}updated(e){if(e.has(`embedded`)&&(this.embedded?window.removeEventListener(f,this.handleToggleRequest):window.addEventListener(f,this.handleToggleRequest)),e.has(`suppressed`)){let e=this.dockLayout.setSuppressed(this.suppressed);this.suppressed?this.browserPanelController.suspendView():e&&this.browserPanelIsOpen()&&this.browserPanelController.refreshAll()}let t=e.has(`client`)||e.has(`available`),n=this.embedded&&(e.has(`embedded`)||e.has(`presented`)),r=this.synchronizeBrowserContext(),i=!this.dashboardTarget&&this.sessionKey.trim()?JSON.stringify(Me(this.sessionTabs).map(xe)):void 0,a=this.activeSessionTabsKey!==i;this.activeSessionTabsKey=i;let o=this.refreshOnPresentation&&this.followPreferredTab();this.embedded?!this.presented||!this.available||!this.client&&!p()?(n||t)&&this.browserPanelController.suspendView():this.refreshOnPresentation&&!o&&(r||n||t||a)&&this.browserPanelController.refreshAll():t&&(!this.available&&this.dockLayout.open?(this.dockLayout.hideWithoutPersisting(),this.browserPanelController.resetBrowserState()):this.available&&(this.dockLayout.restoreOpenState()||r&&this.browserPanelIsOpen())&&!o&&this.browserPanelController.refreshAll()),this.browserPanelController.native.presentation.update(),this.dockLayout.syncReservation(),this.browserPanelController.input.paintOverlay();let s=this.renderRoot.querySelector(`.bp-viewport`);s!==this.observedViewportElement&&(this.viewportResizeObserver?.disconnect(),this.observedViewportElement=s,s&&typeof ResizeObserver==`function`&&(this.viewportResizeObserver??=new ResizeObserver(e=>{let t=e[0];t&&this.browserPanelController.handleViewportResize(t.contentRect.width,t.contentRect.height)}),this.viewportResizeObserver.observe(s)));let c=this.browserPanelController,l=JSON.stringify([c.activeTargetId,c.tabs.map(e=>[e.id,e.kind,e.title,e.url,e.favicon])]);l!==this.lastHostedTabsChangeKey&&(this.lastHostedTabsChangeKey=l,this.dispatchEvent(new CustomEvent(nt,{bubbles:!0,composed:!0})))}get hostedTabs(){return X(this.browserPanelController.tabs)}get activeHostedTabId(){return this.browserPanelController.activeTargetId}selectHostedTab(e){this.browserPanelController.selectTab(e)}closeHostedTab(e){return this.browserPanelController.closeTab(e)}synchronizeBrowserContext(){let e=this.browserPanelController.synchronizeClient(),t=this.activeSessionKey!==this.sessionKey,n=JSON.stringify(this.dashboardTarget),r=this.activeDashboardKey!==n;return(t||r)&&(this.activeSessionKey=this.sessionKey,this.activeDashboardKey=n,this.browserPanelController.operations.resetRoute(),this.browserPanelController.resetBrowserState()),(e||t||r)&&(this.browserPanelController.native.cancelPendingActivation(),this.browserPanelController.native.cancelCapture(),this.consumedPreferredRevision=void 0),e||t||r}preferredRevision(){let e=this.preferredSelection;return e&&C(e.tab)?JSON.stringify([xe(e.tab),e.revision]):void 0}get preferredSelection(){return this.fixedTab?{tab:this.fixedTab,revision:`dashboard`}:this.preferredTab}followPreferredTab(){let e=this.preferredRevision(),t=this.preferredSelection;if(!this.browserPanelIsOpen()||!this.available||!this.client||!t||!e||e===this.consumedPreferredRevision)return!1;this.consumedPreferredRevision=e;let n=C(t.tab);return n&&this.browserPanelController.selectTab(n.targetId,n,{focusBrowserTab:!1}),!0}browserPanelIsOpen(){return this.embedded?this.presented&&!this.suppressed:this.dockLayout.open}toggle(){this.available&&(this.dockLayout.open?this.closePanel():(this.dockLayout.setOpen(!0),this.browserPanelController.refreshAll()))}closePanel(){this.browserPanelController.suspendView(),this.dockLayout.setOpen(!1)}render(){return!this.available||!this.embedded&&!this.dockLayout.open?g:on(this.browserPanelController,this.dockLayout.dock,this.dockLayout.height,this.dockLayout.width,e=>this.dockLayout.setDock(e),()=>this.closePanel(),this.dockLayout.renderResizer(`bp`,c(`browser.resize`)),this.embedded,this.tabsInHeader)}},b([v({attribute:!1})],$.prototype,`client`,void 0),b([v({type:Boolean})],$.prototype,`available`,void 0),b([v({type:Boolean})],$.prototype,`remoteAvailable`,void 0),b([v({type:Boolean})],$.prototype,`suppressed`,void 0),b([v({attribute:!1})],$.prototype,`resourceBasePath`,void 0),b([v({attribute:!1})],$.prototype,`authToken`,void 0),b([v({type:Boolean})],$.prototype,`embedded`,void 0),b([v({type:Boolean})],$.prototype,`tabsInHeader`,void 0),b([v({type:Boolean})],$.prototype,`presented`,void 0),b([v({type:Boolean})],$.prototype,`refreshOnPresentation`,void 0),b([v({attribute:!1})],$.prototype,`sessionKey`,void 0),b([v({attribute:!1})],$.prototype,`sessionTabs`,void 0),b([v({attribute:!1})],$.prototype,`preferredTab`,void 0),b([v({attribute:!1})],$.prototype,`fixedTab`,void 0),b([v({attribute:!1})],$.prototype,`dashboardTarget`,void 0),customElements.get(`openclaw-browser-panel`)||customElements.define(`openclaw-browser-panel`,$)})))()}export{fn as n,dn as t};
//# sourceMappingURL=browser-panel-hrCskS6g.js.map