import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Bc as n,Cu as r,Eu as i,Fl as a,Lc as o,Rs as s,Ru as c,Sc as l,Sl as u,Tu as d,Uc as f,Vs as p,bc as ee,du as te,fu as ne,gc as re,ju as m,kc as ie,pu as ae,xc as oe}from"./control-ui-core-CTSdBcaH.js";import{St as se,Ti as ce,Xn as le,Yr as ue,Zn as de,ai as fe,bi as pe,d as me,jo as he,l as ge,mo as _e,na as h,po as ve,ra as g,u as ye,wi as be,xi as xe,xt as Se}from"./control-ui-core-vFnxmx94.js";import{$ as _,X as v,Y as y,ct as Ce,nt as b,ut as x}from"./lit-runtime-TNZj1e-P.js";import{br as we,yr as Te}from"./control-ui-boot-shared-DSyxl38Y.js";import{c as S,d as C,l as w,u as Ee}from"./gateway-runtime-DiNPDWPd.js";import{Gi as De,an as Oe,fn as ke,ln as Ae,pn as je,qi as Me}from"./control-ui-boot-shared-D4E0xCZu.js";import{Ft as Ne,Pt as Pe,To as T,Xa as Fe,Xr as Ie,Zr as Le,_a as E,fa as D,ia as Re,ii as O,ro as k}from"./ui-CnRtCcYL.js";import{$n as A,Et as ze,Kt as Be,Qn as Ve,Tt as He,Ut as Ue,Xn as We,Yn as Ge,Zn as j,er as Ke,ot as qe}from"./control-ui-boot-shared-DeF_v3ER.js";import{i as Je,n as M,o as Ye,r as N,t as Xe}from"./plugin-help-Bay2K1vD.js";import{$a as Ze,Ja as Qe,Qa as $e,Xa as P}from"./control-ui-boot-shared-flpXqVdL.js";import{E as et,T as tt}from"./control-ui-boot-shared-BIBfFukq.js";import"./control-ui-boot-shared-styles-BaQ2sAfZ.js";import{r as nt,t as F}from"./custodian-alert-store-DMTYYmJp.js";import{It as rt,Lt as it,dr as at,fr as ot}from"./control-ui-boot-chat-CHJjvSiu.js";import{r as st,t as ct}from"./wizard-step-controls-DRsA5bAK.js";import{Jn as lt,Yn as ut,vr as dt,yr as ft}from"./control-ui-boot-chat-C7HFnbgz.js";import"./control-ui-boot-chat-CNnFKzxu.js";import"./chat-transcript-styles-Dzr3t9kA.js";function pt(e){if(!E(e))return;let t=e.code;return t===I.INFERENCE_UNAVAILABLE?{code:t}:void 0}function mt(e){if(!E(e))return;let t=e.code;return t===I.SESSION_INVALIDATED?{code:t}:void 0}var I;function L(){return(L=e((()=>{I={INFERENCE_UNAVAILABLE:`system_agent_inference_unavailable`,SESSION_INVALIDATED:`system_agent_session_invalidated`}})))()}var R;function ht(){return(ht=e((()=>{re(),N(),R=class{constructor(){this.ordinary={value:``},this.sensitive={value:``},this.context=null,this.cleanup=null}connect(e,t){this.cleanup?.(),this.context=e,this.cleanup=ee(e,t)}resetPrompt(e,t){this.sensitive={value:``},[e.wizardValue,e.wizardSecretVisible]=[void 0,!1],e.sensitive=t}get pluginReference(){return this.context?M(this.context):void 0}reconcile(e){if(!this.context||e.sensitive||e.wizardInputPending||e.hasUnresolvedQuestion())return;let t=Ye(this.context);t&&(this.ordinary={value:[this.ordinary.value,t].filter(Boolean).join(`

`)})}}})))()}function gt(e,t,n){t===`chat`&&n===`utility`?e?.navigate(`model-setup`,{search:`?firstRun=1`}):e?.navigate(t)}async function _t(e){let{context:t}=e,r=t.gateway.snapshot.sessionKey?.trim();if(e.agentId){let n=await t.agents.refreshList();if(!e.isCurrent())return`stale`;r=Fe({agentId:e.agentId,mainKey:n?.mainKey}),xe({selection:t.agentSelection,gateway:t.gateway,sessionKey:r,agentId:e.agentId})}if(!r)return`exit-setup`;let i=f({face:`chat`,sessionKey:r,fallbackAgentId:n(t),basePath:t.basePath,mainKey:a({agentsList:t.agents.state.agentsList,hello:t.gateway.snapshot.hello}),focusComposer:!e.hatchDraft});return t.navigate(`chat`,{pathname:i.options.pathname,...e.hatchDraft?{search:`?draft=${encodeURIComponent(m(`custodian.hatchDraft`))}`}:i.options.search?{search:i.options.search}:{}}),window.dispatchEvent(new CustomEvent(ue,{detail:{open:!1}})),`navigated`}function z(){return(z=e((()=>{pe(),fe(),i(),o(),u()})))()}function vt(e,t){return t===`received`?`sent`:e instanceof le||t===`unsent`?`rejected`:`unknown`}function yt(e,t){return t===`sent`?!1:t===`unknown`||e}function bt(e,t,n){return n!==`rejected`&&e!==null&&e.severity===t.severity&&e.message===t.message}function xt(e,t,n){return n.event===`health`?[Dt(n.payload),t]:[e,t]}function St(e){if(e.kind===`config-reload`)return m(`custodian.nudge.configReload`);let t=e.channelLabel??m(`custodian.nudge.channelFallback`);return e.kind===`channel-auth`?m(`custodian.nudge.channelAuth`,{channel:t}):e.kind===`channel-disconnected`?m(`custodian.nudge.channelDisconnected`,{channel:t}):m(`custodian.nudge.channelDegraded`,{channel:t})}function Ct(e){return _`<div class="custodian__nudge" role="status">
    <button
      class="custodian__nudge-action"
      type="button"
      ?disabled=${e.disabled}
      @click=${e.onSend}
    >
      ${St(e.nudge)}
    </button>
    <button
      class="custodian__nudge-dismiss"
      type="button"
      aria-label=${m(`custodian.nudge.dismiss`)}
      @click=${e.onDismiss}
    >
      ${h.x}
    </button>
  </div>`}function wt(e){return _`<div
    class="custodian__nudge custodian__nudge--channel-onboarding"
    role=${e.error?`alert`:`status`}
  >
    <div class="custodian__nudge-copy">
      <strong
        >${m(e.error?`custodian.nudge.channelStatusErrorTitle`:`custodian.nudge.channelSetupTitle`)}</strong
      >
      <span
        >${m(e.error?`custodian.nudge.channelStatusErrorBody`:`custodian.nudge.channelSetupBody`)}</span
      >
    </div>
    <button
      class="btn btn--sm primary custodian__nudge-cta"
      type="button"
      ?disabled=${e.error&&e.retrying}
      @click=${e.onAction}
    >
      ${m(e.error?e.retrying?`common.loading`:`common.retry`:`custodian.nudge.channelSetupAction`)}
    </button>
    <button
      class="custodian__nudge-dismiss"
      type="button"
      aria-label=${m(`custodian.nudge.channelSetupDismiss`)}
      @click=${e.onDismiss}
    >
      ${h.x}
    </button>
  </div>`}function Tt(e){return Ot.some(t=>e[t]===`configured_unavailable`)}function Et(e,t,n){if(n.configured===!1||n.enabled===!1)return null;let r=e.toLowerCase();if(Tt(n))return{severity:3,kind:`channel-auth`,channelLabel:t,message:`what happened with ${r} authentication?`};let i=typeof n.healthState==`string`?n.healthState.trim().toLowerCase():void 0;if(i===`terminal-disconnect`||D(n.probe)?.ok===!1)return{severity:3,kind:`channel-degraded`,channelLabel:t,message:`what happened with ${r}?`};if(i===`not-running`&&n.running===!1){let e=typeof n.reconnectAttempts==`number`?n.reconnectAttempts:0,t=typeof n.lastStartAt==`number`?n.lastStartAt:void 0,r=typeof n.lastStopAt==`number`?n.lastStopAt:void 0;if(n.restartPending===!1&&r!==void 0&&(t===void 0||r>=t)&&e<10)return null}return n.connected!==!0&&i!==`healthy`&&typeof n.lastError==`string`&&n.lastError.trim()?{severity:3,kind:`channel-degraded`,channelLabel:t,message:`what happened with ${r}?`}:n.connected===!1&&n.running===!0?{severity:2,kind:`channel-disconnected`,channelLabel:t,message:`what happened with ${r}?`}:i&&B.has(i)?{severity:1,kind:`channel-degraded`,channelLabel:t,message:`what happened with ${r}?`}:null}function Dt(e){let t=D(e);if(!t)return null;if(D(t.configReload)?.hotReloadStatus===`disabled`)return{severity:3,kind:`config-reload`,message:`what happened with configuration reload?`};let n=D(t.channels);if(!n)return null;let r=D(t.channelLabels),i=null;for(let[e,t]of Object.entries(n)){let n=D(t);if(!n)continue;let a=typeof r?.[e]==`string`?r[e]:e,o=D(n.accounts),s=o?Object.values(o).map(D).filter(e=>e!==null):[],c=s.length>0?s:[n];for(let t of c){let n=Et(e,a,t);n&&(!i||n.severity>i.severity)&&(i=n)}}return i}var B,Ot;function V(){return(V=e((()=>{y(),de(),g(),i(),B=new Set([`disconnected`,`stale-socket`,`stuck`,`terminal-disconnect`]),Ot=[`tokenStatus`,`botTokenStatus`,`appTokenStatus`,`signingSecretStatus`,`userTokenStatus`]})))()}function kt(e,t){e.activeVariant!==`caretaker`||e.eventNudgeClosed||([e.eventNudge,e.eventNudgePending]=xt(e.eventNudge,e.eventNudgePending,t),e.requestNudgeUpdate())}async function At(e){let t=e.eventNudge;if(!t||e.sensitive||e.hasUnresolvedQuestion())return;e.eventNudgePending=t,e.requestNudgeUpdate();let n=await e.send(t.message);if(e.eventNudgePending===t){e.eventNudgePending=null;let r=bt(e.eventNudge,t,n);[e.eventNudgeClosed,e.eventNudge]=[r,r?null:e.eventNudge],e.requestNudgeUpdate()}}function jt(e){[e.eventNudge,e.eventNudgeClosed]=[null,!0],e.requestNudgeUpdate()}function Mt(){return(Mt=e((()=>{V()})))()}function Nt(e){return e!==null&&e.length<=512&&e.trim().length>0}function Pt(){return`control-ui-onboarding-${Pe()}`}function Ft(e){try{c()?.setItem(H,e)}catch{}}function It(){let e=null;try{e=c()?.getItem(H)??null}catch{}if(Nt(e))return{sessionId:e,restored:!0};let t=Pt();return Ft(t),{sessionId:t,restored:!1}}var H;function Lt(){return(Lt=e((()=>{Ne(),H=`openclaw.custodian.session.v1`})))()}function Rt(e){if(!e||e.gateway.snapshot.phase!==`connected`)return`unresolved`;let t=e.agents.state.agentsList;if(!t)return`unresolved`;let n=k(e.gateway.snapshot.assistantAgentId??t.defaultId??``),r=t.agents.find(e=>k(e.id)===n);return r?r.model?.primary?.trim()?`ready`:r.utilityModel?.trim()?`utility`:`required`:`unresolved`}function zt(){return(zt=e((()=>{u()})))()}function Bt(e,t){return e.options?.find(e=>Object.is(e.value,t))}function Vt(e,t){if(e.type===`note`||e.type===`action`||e.type===`progress`)return{answer:{stepId:e.id},display:m(`common.continue`)};if(e.type===`text`)return typeof t==`string`?{answer:{stepId:e.id,value:t},display:t}:null;if(e.type===`confirm`)return typeof t==`boolean`?{answer:{stepId:e.id,value:t},display:m(t?`common.yes`:`common.no`)}:null;if(e.type===`select`){let n=Bt(e,t);return n?{answer:{stepId:e.id,value:t},display:n.label}:null}if(!Array.isArray(t))return null;if(t.length===0)return{answer:{stepId:e.id,value:[]},display:m(`common.none`)};let n=t.map(t=>Bt(e,t)?.label);return n.every(e=>e!==void 0)?{answer:{stepId:e.id,value:t},display:n.join(`, `)}:null}function Ht(e){return e.type===`multiselect`?Array.isArray(e.initialValue)?[...e.initialValue]:[]:e.initialValue}function Ut(e){return Ee(e?.gateway.snapshot??{},Te.SYSTEM_AGENT_WIZARD_CANCEL)??!1}function Wt(){return(Wt=e((()=>{we(),i(),w()})))()}function Gt(e,t){return e?`onboarding`:t?`new-agent`:`caretaker`}function U(e,t,n){let r=e===`caretaker`?{}:{welcomeVariant:e};if(t===void 0)return r;let i=window.location.pathname,a=he(i,ve(i));return{...r,message:t,...a?{context:{page:a,...n?{plugin:n}:{}}}:{}}}function W(e){return e.message!==void 0||e.wizardAnswer!==void 0||e.wizardCancel!==void 0}function Kt(e){let t=e&&typeof e==`object`?e.details:void 0;return{inferenceUnavailable:pt(t)!==void 0,sessionInvalidated:mt(t)!==void 0}}function G(){return(G=e((()=>{L(),_e()})))()}function qt(){return(qt=e((()=>{lt()})))()}var K;function Jt(){return(Jt=e((()=>{y(),b(),i(),K=class extends Re{constructor(...e){super(...e),this.selectedValue=``,this.requestKey=``,this.focusPreselection=!1}createRenderRoot(){return this}willUpdate(){let e=this.props,t=e?JSON.stringify([e.header??``,e.question,e.options.map(e=>[e.value,e.label,e.recommended===!0])]):``;t!==this.requestKey&&(this.requestKey=t,this.selectedValue=e?.options.slice(0,4).find(e=>e.recommended)?.value??``,this.focusPreselection=!!this.selectedValue)}updated(e){if(!this.focusPreselection||this.props?.disabled)return;this.focusPreselection=!1;let t=this.ownerDocument.activeElement;(!t||t===this.ownerDocument.body||this.contains(t))&&[...this.querySelectorAll(`.option-card__choice`)].find(e=>e.dataset.optionValue===this.selectedValue)?.focus({preventScroll:!0})}select(e){this.props?.disabled||(this.selectedValue=e,this.props?.onSelect?.(e),this.dispatchEvent(new CustomEvent(`option-select`,{bubbles:!0,composed:!0,detail:{value:e}})))}skip(){this.props?.disabled||(this.props?.onSkip?.(),this.dispatchEvent(new CustomEvent(`option-skip`,{bubbles:!0,composed:!0})))}render(){let e=this.props;if(!e)return v;let t=e.options.slice(0,4),n=t.findIndex(e=>e.recommended===!0);return _`
      <section class="option-card" role="group" aria-label=${e.question}>
        ${e.header?_`<div class="option-card__chip">${e.header}</div>`:v}
        <div class="option-card__question">${e.question}</div>
        <div class="option-card__choices" role="radiogroup">
          ${t.map((t,r)=>{let i=r===n,a=t.value===this.selectedValue;return _`
              <button
                class=${`option-card__choice ${i?`option-card__choice--recommended`:``} ${a?`option-card__choice--selected`:``}`}
                type="button"
                role="radio"
                aria-checked=${a?`true`:`false`}
                data-option-value=${t.value}
                ?disabled=${e.disabled}
                @click=${()=>this.select(t.value)}
              >
                <span class="option-card__choice-copy">
                  <strong>${t.label}</strong>
                  ${t.description?_`<span class="option-card__description">${t.description}</span>`:v}
                </span>
                ${i?_`<span class="option-card__recommended">
                        ${m(`optionCard.recommended`)}
                      </span>`:v}
              </button>
            `})}
        </div>
        <button
          class="option-card__skip"
          type="button"
          ?disabled=${e.disabled}
          @click=${()=>this.skip()}
        >
          ${m(`optionCard.skip`)}
        </button>
      </section>
    `}},O([x({attribute:!1})],K.prototype,`props`,void 0),O([Ce()],K.prototype,`selectedValue`,void 0),customElements.get(`openclaw-option-card`)||customElements.define(`openclaw-option-card`,K)})))()}function Yt(e){return _`<div class="custodian__option-card">
    <openclaw-option-card
      .props=${{header:e.question.header,question:e.question.question,options:e.question.options.map(e=>({value:e.label,label:e.label,description:e.description,recommended:e.recommended})),disabled:e.disabled,onSelect:e.onSelect,onSkip:e.onSkip}}
    ></openclaw-option-card>
  </div>`}function Xt(){return(Xt=e((()=>{y(),Jt()})))()}function Zt(e){if(!e||typeof e!=`object`)return null;let t=T(e.id),n=T(e.header),r=T(e.question);if(!t||!n||!r||!Array.isArray(e.options)||e.options.length<2||e.options.length>4)return null;let i=[];for(let t of e.options){let e=T(t?.label);if(!e)return null;let n=T(t.description??null),r=T(t.reply??null);i.push({label:e,...n?{description:n}:{},...t.recommended===!0?{recommended:!0}:{},...r?{reply:r}:{}})}return new Set(i.map(e=>e.label.toLocaleLowerCase())).size!==i.length||i.filter(e=>e.recommended).length>1?null:{id:t,header:n,question:r,options:i,isOther:e.isOther===!0,...e.skipAction===`exit`?{skipAction:`exit`}:{}}}function Qt(){return(Qt=e((()=>{})))()}function q(e,t,n,r=null,i=null){return{id:e,role:t,text:n,at:Date.now(),question:r,step:i}}function $t(e,t){let n=t.step??null,r=n?null:Zt(t.question),i=ln.test(t.reply);return i&&!r&&!n?null:{...q(e,`assistant`,i?``:t.reply,r,n),optionalWelcome:t.optionalWelcome===!0}}function en(e,t,n,r,i){return r||i||e.some(e=>e.question!==null&&e.question.id!==`system-agent-quick-actions`&&!t.has(`${e.id}:${e.question.id}`)&&!n.has(`${e.id}:${e.question.id}`))}function tn(e,t){let n=new Set(t);for(let t of e)t.question&&n.add(`${t.id}:${t.question.id}`);return n}function J(e){return te(e,m(`custodian.requestFailed`))}function nn(e){let t=`msg-${e.id}`,n={role:e.role,content:e.text},r=Me(n),i=Ae(n,r);return{kind:`group`,key:t,role:e.role,messages:[{message:n,key:t,hasVisibleContent:i===`non-text`||!!je(n,r).trim()}],visibleContent:i,timestamp:e.at,isStreaming:!1}}async function rn(e){try{return{ok:!0,turns:(await e.request(`openclaw.chat.history`,{},{timeoutMs:cn})).turns}}catch(e){return{ok:!1,error:e}}}function an(e,t){let n=t;return{messages:e.map(e=>({id:n++,role:e.role,text:e.role===`user`&&e.text===dn?m(`custodian.sensitiveReply`):e.text,at:e.at,question:null,step:null})),nextMessageId:n}}function on(e,t){return e.id===t?ft({kind:`divider`,key:`custodian-earlier`,label:m(`custodian.earlier`),timestamp:e.at}):v}function sn(e){let t=e.message.question,n=e.message.step;return _`
    ${e.message.text?ut(nn(e.message),{showReasoning:!1,showToolCalls:!1,assistantName:m(`custodian.title`),agentId:tt}):v}
    ${on(e.message,e.boundaryAfterId)}
    ${e.showQuestion&&t?Yt({question:t,disabled:e.questionDisabled,onSelect:e.onSelect,onSkip:e.onSkip}):v}
    ${e.showWizardStep&&n?_`<section
            class="custodian__wizard-step"
            aria-label=${ne(n.title??n.message,`Setup`)}
          >
            ${n.title?_`<strong class="custodian__wizard-title"
                    >${ne(n.title)}</strong
                  >`:v}
            ${st({step:n,value:e.wizardValue,busy:e.wizardDisabled,inputId:`custodian-wizard-input-${e.message.id}`,sensitiveRevealed:e.wizardSecretVisible,onValueChange:e.onWizardValueChange,onAnswer:e.onWizardAnswer,leadingAction:e.showWizardCancel?_`<button
                    class="btn btn--ghost custodian__wizard-cancel"
                    type="button"
                    ?disabled=${e.wizardDisabled}
                    @click=${e.onWizardCancel}
                  >
                    ${m(`custodian.cancel`)}
                  </button>`:void 0,onToggleSensitiveVisibility:e.onToggleWizardSecretVisibility})}
          </section>`:v}
  `}var cn,ln,un,dn;function Y(){return(Y=e((()=>{y(),et(),A(),ct(),i(),ke(),De(),Oe(),ae(),s(),dt(),qt(),Xt(),Qt(),cn=15e3,ln=/^\s*NO_REPLY\s*$/,un=class{constructor(e,t){this.onStatusChange=e,this.getGatewaySnapshot=t,this.status=j(),this.generation=0,this.recoveryPending=!1,this.inFlight=null}get refreshing(){return this.inFlight!==null}deferRecovery(){this.recoveryPending=!0}clearRecovery(){this.recoveryPending=!1}settleRecovery(e,t){this.recoveryPending&&!e&&(this.clearRecovery(),t())}watchAvailability(e){let t=this.getGatewaySnapshot();return()=>{let n=this.getGatewaySnapshot(),r=n&&p(n)&&(!t||!p(t));t=n,r&&this.recover(e)}}async recover(e){let t=this.generation;await this.inFlight?.promise;let n=this.getGatewaySnapshot();t===this.generation&&n&&p(n)&&(this.status.awaitingGateway||this.status.error!==null)&&e()}invalidate(){this.generation+=1,this.inFlight=null}reset(){this.clearRecovery(),this.invalidate(),this.status=j()}async read(e,t,n){let r=this.inFlight;if(r&&r.client===e&&r.epoch===t)return await r.promise,null;let i=++this.generation;this.status=Ge(this.status,{clearError:!1});let a=rn(e);this.inFlight={client:e,epoch:t,promise:a},this.onStatusChange();try{let e=await a;return!n()||i!==this.generation?null:(this.status=e.ok?We():Ve(this.status,e.error,this.getGatewaySnapshot()),e)}finally{this.inFlight?.promise===a&&(this.inFlight=null,this.onStatusChange())}}async loadMessages(e,t,n,r){this.clearRecovery();let i=await this.read(e,t,r);return i?.ok&&r()?an(i.turns,n):null}},dn=`<redacted secret>`})))()}var fn,pn,X;function Z(){return(Z=e((()=>{i(),w(),ht(),z(),Mt(),Lt(),l(),zt(),Wt(),V(),G(),Y(),fn=19e4,pn=class{constructor(){this.messages=[],this.sending=!1,this.sensitive=!1,this.wizardInputPending=!1,this.wizardSecretVisible=!1,this.questionReplyUncertain=!1,this.error=null,this.transcript=new un(()=>this.emit(),()=>this.context?.gateway.snapshot),this.dismissedQuestions=new Set,this.answeredQuestions=new Set,this.activeClient=null,this.chatAvailable=!1,this.eventNudge=null,this.eventNudgePending=null,this.eventNudgeClosed=!1,this.channelOnboardingNudgeClosed=!1,this.earlierBoundaryAfterId=null,this.abandonedTurnOutcomeUnknown=!1,this.inferenceState=`unverified`,this.inputDrafts=new R,this.context=null,this.variant=`caretaker`,this.sessionVariant=null,this.restoredIdentity=It(),this.sessionId=this.restoredIdentity.sessionId,this.rejoinBarrierPending=this.restoredIdentity.restored,this.requestEpoch=0,this.requestAbort=null,this.nextMessageId=1,this.retryParams=null,this.sessionClient=null,this.sessionOwnershipKey=null,this.sessionOwner=new oe,this.sessionStarted=!1,this.configuredInferenceState=`unresolved`,this.gatewayCleanup=null,this.agentCleanup=null,this.eventCleanup=null,this.listeners=new Set}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}connect(e,t){let n=this.context!==e;if(n||this.variant!==t){if(n){this.gatewayCleanup?.(),this.agentCleanup?.(),this.eventCleanup?.(),this.context=e,this.inputDrafts.connect(e,()=>this.emit());let t=this.transcript.watchAvailability(()=>void this.refreshTranscriptIfIdle());this.gatewayCleanup=e.gateway.subscribe(()=>{t(),this.synchronizeClient(),this.emit()}),this.agentCleanup=e.agents.subscribe(()=>{this.synchronizeClient(),this.emit()}),this.eventCleanup=e.gateway.subscribeEvents(e=>kt(this,e))}this.variant=t,this.synchronizeClient(),this.emit()}}get input(){return this.inputDrafts[this.sensitive?`sensitive`:`ordinary`].value}set input(e){this.inputDrafts[this.sensitive?`sensitive`:`ordinary`]={value:e}}setInput(e){this.input=e,this.emit()}setWizardValue(e){this.wizardValue=e,this.emit()}toggleWizardSecretVisibility(){this.wizardSecretVisible=!this.wizardSecretVisible,this.emit()}hasRealUserTurn(){return this.messages.some(e=>e.role===`user`)}get activeVariant(){return this.variant}hasUnresolvedQuestion(){return en(this.messages,this.dismissedQuestions,this.answeredQuestions,this.wizardInputPending,this.questionReplyUncertain)}get transcriptBlocked(){return this.sending||this.hasUnresolvedQuestion()||this.transcript.refreshing}async refreshTranscriptIfIdle(){let e=this.activeClient;if(e&&this.sessionStarted&&this.chatAvailable){if(this.transcriptBlocked){(this.transcript.status.awaitingGateway||this.transcript.status.error!==null)&&this.transcript.deferRecovery();return}await this.refreshTranscriptHistory(e,this.requestEpoch)&&this.abandonedTurnOutcomeUnknown&&(this.abandonedTurnOutcomeUnknown=!1,this.emit())}}canRetry(){return this.retryParams!==null&&!W(this.retryParams)}get setupRequired(){return this.configuredInferenceState===`required`}get canSend(){return this.activeClient!==null&&this.chatAvailable&&!this.sending&&(this.configuredInferenceState===`ready`||this.configuredInferenceState===`utility`)&&this.inferenceState===`ready`}get wizardCancelAvailable(){return Ut(this.context)}retry(){let e=this.activeClient,t=this.retryParams;e&&t&&!W(t)&&this.chatAvailable&&!this.sending&&this.initializeSession(e,t,!1)}async send(e,t,n=this.hasUnresolvedQuestion(),r){let i=e??this.input,a=this.sensitive?i:i.trim(),o=this.activeClient;if(!a.trim()||!o||!this.canSend)return this.emit(),`rejected`;let s=this.sensitive?m(`custodian.sensitiveReply`):t??a,c={sessionId:this.sessionId,...U(this.variant,a,this.inputDrafts.pluginReference)};return await this.sendUserTurn(o,c,s,n,()=>r&&(!r.isCurrent()||!r.admit())?!1:(e===void 0&&(this.input=``),!0))}async sendUserTurn(e,t,n,r,i){let a=[this.answeredQuestions,this.questionReplyUncertain],o,s=await this.requestReply(e,t,()=>{let e=this.inputDrafts.ordinary;if(i&&!i())return!1;let t=this.inputDrafts.ordinary;this.inputDrafts.resetPrompt(this,this.sensitive),o=this.requestEpoch,r&&(this.questionReplyUncertain=!0),this.abandonedTurnOutcomeUnknown=!1,this.answeredQuestions=tn(this.messages,this.answeredQuestions);let s=q(this.nextMessageId++,`user`,n);return this.messages=[...this.messages,s],()=>{this.messages=this.messages.filter(e=>e!==s),this.answeredQuestions=a[0],e!==t&&this.inputDrafts.ordinary===t&&(this.inputDrafts.ordinary=e)}});return r&&this.requestEpoch===o&&(this.questionReplyUncertain=yt(a[1],s),s===`rejected`&&(this.answeredQuestions=a[0]),this.emit()),s}requestNudgeUpdate(){this.emit()}sendEventNudge(){return At(this)}dismissEventNudge(){jt(this)}dismissChannelOnboardingNudge(){this.channelOnboardingNudgeClosed=!0,this.emit(),this.context?.replace(`custodian`)}openChannelsFromOnboarding(){this.channelOnboardingNudgeClosed=!0,this.revokeNavigationAuthority(),this.emit(),this.context?.navigate(`channels`)}async dismissQuestion(e){let t=e.question;if(t){if(t.skipAction===`exit`){this.exitSetup();return}await this.send(t.isOther?m(`optionCard.skip`):`cancel`,m(`optionCard.skip`),!0)!==`rejected`&&this.messages.includes(e)&&(this.dismissedQuestions=new Set(this.dismissedQuestions).add(`${e.id}:${t.id}`),this.emit())}}answerQuestion(e,t){let n=e.question;if(!n)return;let r=n.options.find(e=>e.label===t);this.send(r?.reply??t,t,!0)}answerWizardStep(e,t){if(!e.step||!this.wizardInputPending)return;let n=Vt(e.step,t),r=this.activeClient;if(!n||!r||!this.canSend){this.emit();return}let i=e.step.sensitive?m(`custodian.sensitiveReply`):n.display;this.sendUserTurn(r,{sessionId:this.sessionId,wizardAnswer:n.answer},i,!0)}cancelWizardStep(e){let t=e.step,n=this.activeClient;if(!t||!this.wizardInputPending||!n||!this.canSend||!this.wizardCancelAvailable){this.emit();return}this.sendUserTurn(n,{sessionId:this.sessionId,wizardCancel:{stepId:t.id}},m(`custodian.cancel`),!0)}exitSetup(e=`chat`){this.revokeNavigationAuthority(),gt(this.context,e,this.configuredInferenceState)}revokeNavigationAuthority(){this.requestAbort?.abort(),this.requestAbort=null,this.transcript.clearRecovery(),this.advanceRequestEpoch(),this.sending=!1,this.questionReplyUncertain=!1,this.retryParams=null,this.error=null}advanceRequestEpoch(){return this.transcript.invalidate(),++this.requestEpoch}emit(){this.inputDrafts.reconcile(this),this.transcript.settleRecovery(this.transcriptBlocked,()=>void this.refreshTranscriptIfIdle());for(let e of this.listeners)e()}startSession(e,t){this.sessionVariant=this.variant,this.sessionClient=e,this.sessionOwnershipKey=this.sessionOwner.key(this.context?.gateway??null),this.sessionStarted=!0,this.initializeSession(e,{sessionId:this.sessionId,...U(this.variant)},t)}replaceSessionId(e){e===void 0&&(this.rejoinBarrierPending=!1),this.sessionId=e??Pt(),Ft(this.sessionId)}abandonPendingUserTurn(e){e&&W(e)&&(this.retryParams=null,this.abandonedTurnOutcomeUnknown=!0)}restartVolatileSession(e){this.replaceSessionId(),this.answeredQuestions=tn(this.messages,this.answeredQuestions),this.inputDrafts.resetPrompt(this,!1),this.wizardInputPending=this.questionReplyUncertain=!1,this.earlierBoundaryAfterId=this.messages.at(-1)?.id??null,this.startSession(e,!1)}synchronizeClient(){let e=this.context;if(!e)return;let t=e.gateway.snapshot,n=t.phase===`connected`?t.client:null,r=n!==null&&S(t,`openclaw.chat`,`operator.admin`),i=C(t,`openclaw.chat`)===!1,a=Rt(this.context),o=a!==this.configuredInferenceState;this.configuredInferenceState=a;let s=this.sessionStarted&&this.sessionVariant!==this.variant,c=this.sessionOwner.key(e.gateway),l=this.sessionStarted&&n!==null&&this.activeClient===null,u=this.sessionStarted&&n!==null&&this.sessionClient!==null&&n!==this.sessionClient,d=this.sessionOwnershipKey!==null&&c!==this.sessionOwnershipKey;if(n===this.activeClient&&!s&&!u&&!d&&this.chatAvailable===(r&&a!==`unresolved`)&&!o)return;let f=this.sending&&this.retryParams!==null,p=f?this.retryParams:null;if((n!==this.activeClient||d)&&this.transcript.clearRecovery(),this.activeClient=n,this.advanceRequestEpoch(),this.sending=!1,this.chatAvailable=!1,s||d)d&&this.replaceSessionId(),[this.eventNudge,this.eventNudgePending]=[null,null],this.eventNudgeClosed=!1,this.abandonedTurnOutcomeUnknown=!1,this.sessionStarted=!1,this.clearConversation();else if(n&&(u||l)){if(!r){this.sessionStarted=!1,this.abandonPendingUserTurn(p),this.error=i?m(`custodian.unsupportedGateway`):null;return}this.chatAvailable=!0,this.abandonPendingUserTurn(p),this.requestAbort?.abort(),this.requestAbort=null,this.sessionClient=n,this.sessionOwnershipKey=c,this.questionReplyUncertain||this.abandonedTurnOutcomeUnknown?(this.questionReplyUncertain=!1,this.wizardInputPending=!1,this.abandonedTurnOutcomeUnknown=!1,this.rejoinBarrierPending=!0,this.initializeSession(n,{sessionId:this.sessionId,...U(this.variant)})):this.refreshTranscriptIfIdle();return}else f&&(p?.message===void 0&&(this.error=m(`custodian.connectionChanged`)),this.abandonPendingUserTurn(p));if(n){if(!r){this.error=i?m(`custodian.unsupportedGateway`):null;return}if(a!==`unresolved`){if(this.chatAvailable=!0,a===`required`){this.sessionStarted=!1,this.clearConversation();return}if(this.sessionStarted){this.retryParams||(this.error=f?this.error:null);return}this.clearConversation(!0),this.startSession(n,!0)}}}async initializeSession(e,t,n=!0){let r=this.advanceRequestEpoch();this.sending=!0,this.inferenceState=`unverified`,this.error=null,this.retryParams=t,this.emit(),n&&await this.refreshTranscriptHistory(e,r),r===this.requestEpoch&&e===this.activeClient&&await this.requestReply(e,t)}async refreshTranscriptHistory(e,t){let n=this.context;if(!n||C(n.gateway.snapshot,`openclaw.chat.history`)!==!0)return!1;let r=await this.transcript.loadMessages(e,t,this.nextMessageId,()=>t===this.requestEpoch&&e===this.activeClient);return r?([this.messages,this.nextMessageId]=[r.messages,r.nextMessageId],this.earlierBoundaryAfterId=this.messages.at(-1)?.id??null,this.emit(),!0):!1}clearConversation(e=!1){this.messages=[],this.dismissedQuestions=new Set,this.answeredQuestions=new Set,this.retryParams=null,this.error=null,this.transcript.reset(),this.inferenceState=`unverified`,e||(this.inputDrafts.ordinary={value:``}),this.inputDrafts.resetPrompt(this,!1),this.wizardInputPending=this.questionReplyUncertain=!1,this.earlierBoundaryAfterId=null}async requestReply(e,t,n){let r=this.context;if(!r)return`rejected`;let i=()=>e===this.activeClient&&r.gateway.snapshot.client===e&&S(r.gateway.snapshot,`openclaw.chat`,`operator.admin`);if(!i())return`rejected`;this.requestAbort?.abort();let a=new AbortController;this.requestAbort=a;let o=this.advanceRequestEpoch(),s=`unsent`,c;this.sending=!0,this.error=null,this.retryParams=t,this.emit();try{if(o!==this.requestEpoch||!i()||(c=n?.())===!1)return this.retryParams===t&&(this.retryParams=null),`rejected`;let l=e.request(`openclaw.chat`,t,{timeoutMs:fn,onSent:()=>{s=`sent`},signal:a.signal});this.emit();let u=await l;if(s=`received`,o!==this.requestEpoch||e!==this.activeClient||(this.replaceSessionId(u.sessionId),this.inputDrafts.resetPrompt(this,u.sensitive===!0),this.wizardInputPending=u.wizardInputPending===!0,this.retryParams=null,this.inferenceState=`ready`,this.rejoinBarrierPending&&!W(t)&&(this.rejoinBarrierPending=!1,await this.refreshTranscriptHistory(e,o),o!==this.requestEpoch||e!==this.activeClient)))return`sent`;this.wizardValue=u.step?Ht(u.step):void 0;let d=$t(this.nextMessageId,u);return d&&(this.nextMessageId+=1,this.messages=[...this.messages,d]),u.handoff?.kind===`model-accounts`?this.exitSetup(`profile`):u.action===`open-agent`?await _t({context:r,...u.agentId?{agentId:u.agentId}:{},hatchDraft:u.agentDraft===`hatch`,isCurrent:()=>o===this.requestEpoch&&e===this.activeClient})===`exit-setup`&&this.exitSetup():u.action===`exit`&&this.exitSetup(),`sent`}catch(n){if(o===this.requestEpoch&&e===this.activeClient){s===`unsent`&&c&&c(),this.error=J(n);let{inferenceUnavailable:r,sessionInvalidated:i}=Kt(n);r&&(this.inferenceState=`unverified`,this.retryParams={sessionId:this.sessionId,...U(this.variant)}),i&&W(t)?(this.restartVolatileSession(e),this.error=m(`custodian.sessionRestarted`,{error:J(n)})):i&&(this.replaceSessionId(),this.retryParams={...t,sessionId:this.sessionId},this.error=m(`custodian.sessionRestarted`,{error:J(n)}))}return W(t)&&this.retryParams===t&&(this.retryParams=null),vt(n,s)}finally{this.requestAbort===a&&(this.requestAbort=null),o===this.requestEpoch&&(this.sending=!1),this.emit()}}},X=new pn})))()}function mn(){return(mn=e((()=>{})))()}function hn(e,t,n){e.kind===`navigate`?t.navigate(e.routeId):n&&ge({startGatewayUpdate:()=>void t.overlays.runUpdate(),watchUpdateProgress:ye(t),onAcknowledge:()=>t.overlays.acknowledgeUpdateRun(),onCheckStatus:()=>t.overlays.refreshUpdateStatus(),onReviewUpdate:()=>t.navigate(`updates`),updateAvailable:t.overlays.snapshot.updateAvailable,updateSchedule:t.overlays.snapshot.updateSchedule,viaNativeApp:Se()})}function gn(e){let{action:t}=e.alert,n=S(e.context.gateway.snapshot,`update.run`,`operator.admin`),r=t?.target.kind===`update`&&!n;return _`<article class="custodian__nudge custodian__alert-card" role="status">
    <div class="custodian__alert-heading">
      <strong>${e.alert.title}</strong>
      <button
        class="custodian__nudge-dismiss"
        type="button"
        aria-label=${m(`common.dismiss`)}
        @click=${e.onDismiss}
      >
        ${h.x}
      </button>
    </div>
    <ul class="custodian__alert-facts">
      ${e.alert.facts.map(e=>_`<li>${e}</li>`)}
    </ul>
    ${t?_`<button
            class="btn btn--sm primary custodian__alert-action"
            type="button"
            title=${r?m(`updates.adminRequired`):v}
            ?disabled=${r}
            @click=${()=>hn(t.target,e.context,n)}
          >
            ${t.label}
          </button>`:v}
  </article>`}function _n(){return(_n=e((()=>{y(),se(),me(),g(),i(),w()})))()}var Q;function $(){return($=e((()=>{Le(),y(),b(),ce(),g(),rt(),Be(),ze(),A(),qe(),i(),at(),d(),t(),$e(),_n(),nt(),Z(),V(),N(),G(),Y(),ot(),Q=class extends r{constructor(){super(),this.store=X,this.onboarding=!1,this.newAgentIntent=!1,this.showChannelOnboardingNudge=!1,this.channelOnboardingError=null,this.channelOnboardingRetrying=!1,this.onRetryChannelOnboarding=()=>void 0,this.compact=!1,this.historyContent=v,this.composerTextarea=null,this.lastMessageId=null,this.lastPluginHelpFocus=0,new ie(this).watchStore(()=>this.store).watchStore(()=>F)}async getUpdateComplete(){let e=await super.getUpdateComplete();return await Promise.all(Array.from(this.querySelectorAll(`openclaw-option-card`)).map(e=>e.updateComplete)),e}willUpdate(){this.store.connect(this.context,Gt(this.onboarding,this.newAgentIntent))}disconnectedCallback(){this.composerTextarea&&=(P(this.composerTextarea),null),super.disconnectedCallback()}updated(){let e=this.store,t=this.querySelector(`textarea`);this.composerTextarea&&this.composerTextarea!==t&&P(this.composerTextarea),this.composerTextarea=t,t&&(Ze(t),Qe(t)),e.canSend&&!e.sensitive&&!e.hasUnresolvedQuestion()&&F.askIfReady((t,n,r)=>void e.send(t,r,!1,n));let n=Je(this.context);n>0&&n!==this.lastPluginHelpFocus&&!e.sensitive&&!e.wizardInputPending&&e.chatAvailable&&(this.lastPluginHelpFocus=n,t?.focus());let r=this.querySelector(`.custodian__messages`),i=this.store.messages.at(-1)?.id??null;if(i!==this.lastMessageId){this.lastMessageId=i;let e=r?.lastElementChild;e instanceof HTMLElement&&e.scrollIntoView?.({block:`nearest`})}}handleComposerKeydown(e){e.key!==`Enter`||e.shiftKey||e.isComposing||(e.preventDefault(),this.store.send())}render(){let e=this.store,t=M(this.context),n=t?m(`custodian.pluginPlaceholder`,{plugin:t.name}):m(`custodian.placeholder`),r=F.alert?gn({alert:F.alert,context:this.context,onDismiss:()=>F.dismiss()}):v;if(e.setupRequired)return _`
        <section
          class="custodian-surface custodian-surface--setup-required ${this.compact?`custodian-surface--panel`:``}"
        >
          ${r}
          <div class="custodian__setup-state" role="alert">
            <openclaw-mascot mood="idle" .size=${this.compact?72:96}></openclaw-mascot>
            <h2>${m(`modelSetup.required.title`)}</h2>
            <p>${m(`modelSetup.required.body`)}</p>
            <div class="custodian__setup-actions">
              <button
                class="btn primary"
                type="button"
                @click=${()=>e.exitSetup(`model-setup`)}
              >
                ${m(`modelSetup.required.action`)}
              </button>
            </div>
          </div>
        </section>
      `;let i=e.messages.length===0&&e.error!==null&&!e.sending,a=e.wizardInputPending?e.messages.findLast(e=>e.step!==null):void 0,o=t&&e.activeVariant===`caretaker`&&!e.sensitive&&!e.hasUnresolvedQuestion(),s=o&&!e.hasRealUserTurn(),c=s?Xe(this.context,t):void 0;return _`
      <section
        class="custodian-surface ${this.compact?`custodian-surface--panel`:``} ${i?`custodian-surface--empty-error`:``}"
      >
        <div
          class="custodian__messages"
          ${it()}
          aria-live="polite"
          @click=${e=>{Ue(e),He(e)}}
        >
          ${r}
          ${this.channelOnboardingError||this.showChannelOnboardingNudge?wt({error:!!this.channelOnboardingError,retrying:this.channelOnboardingRetrying,onAction:this.channelOnboardingError?this.onRetryChannelOnboarding:()=>e.openChannelsFromOnboarding(),onDismiss:()=>e.dismissChannelOnboardingNudge()}):v}
          ${!this.onboarding&&e.eventNudge&&!e.eventNudgePending?Ct({nudge:e.eventNudge,disabled:!e.canSend||e.sensitive||e.hasUnresolvedQuestion(),onSend:()=>void e.sendEventNudge(),onDismiss:()=>e.dismissEventNudge()}):v}
          ${s?_`<div class="custodian__plugin-intro">
                  <h2>${m(`custodian.pluginIntroTitle`,{plugin:t.name})}</h2>
                  <div class="custodian__plugin-starters">
                    ${[{label:m(`custodian.pluginStarterPurpose`),prompt:m(`custodian.pluginPromptPurpose`,{plugin:t.name})},{label:m(`custodian.pluginStarterTools`),prompt:m(`custodian.pluginPromptTools`,{plugin:t.name})},{label:m(`custodian.pluginStarterSetup`),prompt:m(`custodian.pluginPromptSetup`,{plugin:t.name})}].map(({label:e,prompt:t})=>_`<button
                        class="btn"
                        type="button"
                        @click=${()=>void c?.({question:t})}
                      >
                        ${e}
                      </button>`)}
                  </div>
                </div>`:v}
          ${e.messages.filter(e=>!o||!e.optionalWelcome).map(t=>{let n=t.question?`${t.id}:${t.question.id}`:``,r=t.question!==null&&!e.dismissedQuestions.has(n);return sn({message:t,boundaryAfterId:e.earlierBoundaryAfterId,showQuestion:r,questionDisabled:!e.canSend||e.answeredQuestions.has(n),onSelect:n=>e.answerQuestion(t,n),onSkip:()=>void e.dismissQuestion(t),showWizardStep:t===a,wizardValue:e.wizardValue,wizardDisabled:!e.canSend,wizardSecretVisible:e.wizardSecretVisible,onWizardValueChange:t=>e.setWizardValue(t),onWizardAnswer:n=>e.answerWizardStep(t,n),showWizardCancel:e.wizardCancelAvailable,onWizardCancel:()=>e.cancelWizardStep(t),onToggleWizardSecretVisibility:()=>e.toggleWizardSecretVisibility()})})}
          ${e.sending?_`<div class="chat-group assistant custodian__thinking-row" role="status">
                  <div class="chat-avatar assistant custodian__mascot-avatar" aria-hidden="true">
                    <openclaw-mascot mood="thinking" .size=${26}></openclaw-mascot>
                  </div>
                  <div class="chat-group-messages custodian__thinking">
                    <span></span><span></span><span></span>
                    <span class="sr-only">${m(`custodian.thinking`)}</span>
                  </div>
                </div>`:v}
          ${e.abandonedTurnOutcomeUnknown?_`<div class="custodian__error" role="alert">
                  <span>${m(`custodian.connectionChanged`)}</span>
                </div>`:v}
          ${Ke({status:e.transcript.status,className:`custodian__transcript-status`})}
          ${e.error&&!(e.abandonedTurnOutcomeUnknown&&e.error===m(`custodian.connectionChanged`))?_`<div class="custodian__error" role="alert">
                  <span>${e.error}</span>
                  ${e.activeClient&&e.chatAvailable&&e.canRetry()?_`<button
                          class="btn btn--sm"
                          type="button"
                          @click=${()=>e.retry()}
                        >
                          ${m(`common.retry`)}
                        </button>`:v}
                </div>`:v}
        </div>

        ${this.historyContent}
        ${a?v:_`<div class="agent-chat__composer-shell">
                <div class="agent-chat__input">
                  <div class="agent-chat__composer-input-row">
                    <div class="agent-chat__composer-combobox">
                      ${e.sensitive?_`<input
                              type="password"
                              .value=${e.input}
                              autocomplete="off"
                              placeholder=${m(`custodian.sensitivePlaceholder`)}
                              aria-label=${m(`custodian.sensitivePlaceholder`)}
                              ?disabled=${!e.canSend}
                              @input=${t=>e.setInput(t.target.value)}
                              @keydown=${e=>this.handleComposerKeydown(e)}
                            />`:_`<textarea
                              rows="1"
                              .value=${e.input}
                              autocomplete="on"
                              placeholder=${n}
                              aria-label=${n}
                              ?disabled=${!e.chatAvailable}
                              @input=${t=>e.setInput(t.target.value)}
                              @keydown=${e=>this.handleComposerKeydown(e)}
                            ></textarea>`}
                      <span class="agent-chat__composer-placeholder" aria-hidden="true"
                        >${e.sensitive?m(`custodian.sensitivePlaceholder`):n}</span
                      >
                    </div>
                    <div class="agent-chat__composer-actions">
                      <button
                        class="chat-send-btn"
                        type="button"
                        aria-label=${m(`custodian.send`)}
                        ?disabled=${!e.input.trim()||!e.canSend}
                        @click=${()=>void e.send()}
                      >
                        ${h.arrowUp}
                        <span class="agent-chat__control-label">${m(`custodian.send`)}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>`}
      </section>
    `}},O([Ie({context:be,subscribe:!0})],Q.prototype,`context`,void 0),O([x({attribute:!1})],Q.prototype,`store`,void 0),O([x({attribute:!1})],Q.prototype,`onboarding`,void 0),O([x({attribute:!1})],Q.prototype,`newAgentIntent`,void 0),O([x({attribute:!1})],Q.prototype,`showChannelOnboardingNudge`,void 0),O([x({attribute:!1})],Q.prototype,`channelOnboardingError`,void 0),O([x({attribute:!1})],Q.prototype,`channelOnboardingRetrying`,void 0),O([x({attribute:!1})],Q.prototype,`onRetryChannelOnboarding`,void 0),O([x({attribute:!1})],Q.prototype,`compact`,void 0),O([x({attribute:!1})],Q.prototype,`historyContent`,void 0),customElements.get(`openclaw-custodian-surface`)||customElements.define(`openclaw-custodian-surface`,Q)})))()}export{Z as i,mn as n,X as r,$ as t};
//# sourceMappingURL=custodian-surface-zwWEH61C.js.map