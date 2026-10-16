const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./mcp-app-view-registration-z646NqPb.js","./gateway-runtime-FZ6mX2RY.js","./session-snapshot-database-DFlfztRJ.js","./control-ui-boot-shared-BRpXgwOq.js","./control-ui-boot-shared-BgJI8jW3.js","./control-ui-boot-shared-ChxHeQUn.js","./plugin-contracts-runtime-CWHgryFQ.js","./control-ui-boot-shared-Dg7r4uLq.js","./config-runtime-BecGLziM.js","./markdown-runtime-ORQpioyT.js","./control-ui-boot-shared-C9uJ732w.js","./control-ui-boot-shared-styles-BaQ2sAfZ.js","./sidebar-update-runtime-CVvIs9jq.js","./mcp-app-routing-1zgGff-7.js","./control-ui-boot-chat-DfNf0poH.js","./control-ui-boot-chat-CG50uxir.js","./control-ui-boot-chat-C0fpkn8t.js","./control-ui-boot-chat-CdE8XLfM.js","./chat-transcript-styles-Dzr3t9kA.js","./control-ui-boot-chat-styles-BRrYkFSc.js","./mcp-app-confirm-CmDPHPmU.js","./control-ui-core-yIvVj14Y.css","./control-ui-boot-shared-styles-DKyMAG_6.css","./control-ui-boot-shared-CXHNz0Bh.css","./sidebar-update-runtime-ah7rgQE7.css","./chat-transcript-styles-B_dd5Ueo.css","./control-ui-boot-chat-styles-C_Ls1c0m.css","./control-ui-boot-chat-mLz7NUiY.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Ci as n,Cu as r,Eu as i,Tu as a,W as o,du as s,ju as c,kc as l,m as u,p as d,pu as f,z as p}from"./control-ui-core-bJHyI7AF.js";import{Ti as m,cr as h,na as g,ra as _,sr as v,wi as y}from"./control-ui-core-DNh4McGE.js";import{$ as b,C as x,T as S,X as C,Y as w,ct as T,nt as E,ut as D}from"./lit-runtime-DyST807n.js";import{Qn as O}from"./control-ui-boot-shared-CE7ueCxh.js";import{_n as ee,gn as te,vn as k}from"./control-ui-boot-shared-DsSYH3B6.js";import{Xr as A,Zr as j,ii as M,oa as N,sa as P}from"./ui-DeikvIdP.js";import{$a as F,Ar as I,Er as L,Ja as R,Qa as z,Xa as B,kr as V}from"./control-ui-boot-shared-C1PHuQAX.js";import{ar as H,cr as U,lr as W,or as G,sr as K,ur as q}from"./control-ui-boot-chat-BvOXILEY.js";var J;function Y(){return(Y=e((()=>{j(),w(),E(),x(),m(),h(),i(),f(),u(),a(),t(),V(),P(),J=class extends r{constructor(){super(),this.requestId=``,this.sessionKey=``,this.selected=new Set,this.disabled=!1,this.busy=!1,this.error=``,this.uploaded=[],this.preview=null,this.generation=0,this.identity=``,new l(this).watchStore(()=>this.context?.gateway)}key(){return JSON.stringify([this.requestId,this.question?.questionId,this.question?.resource?.viewId,this.sessionKey,this.agentId,this.context?v(this.context.gateway).key:-1])}willUpdate(){let e=this.key();(e!==this.identity||this.disabled)&&(this.operationAbort?.abort(),this.generation++,e!==this.identity&&(this.uploaded=[]),this.identity=e,this.busy=!1,this.error=``,this.preview=null)}disconnectedCallback(){this.operationAbort?.abort(),this.generation++,super.disconnectedCallback()}async operation(e){let t=this.context,n=t?.gateway.snapshot.client,r=this.question;if(!t||t.gateway.snapshot.phase!==`connected`||!n||!r?.resource?.viewId||this.disabled||this.busy||!this.sessionKey)return;let i=++this.generation,a=new AbortController;this.operationAbort=a;let o=v(t.gateway).key,c=this.key(),l=()=>this.isConnected&&!this.disabled&&i===this.generation&&c===this.key()&&t.gateway.snapshot.client===n&&v(t.gateway).key===o;this.busy=!0,this.error=``;try{let t=await e(l);if(!l())return;let i=await n.request(`mcp.app.formResource`,{sessionKey:this.sessionKey,agentId:this.agentId,viewId:r.resource.viewId,requestId:this.requestId,questionId:r.questionId,...t},{signal:a.signal});if(!l())return;if(`resources`in i){if(!Array.isArray(i.resources)||i.resources.length>64||!i.resources.every(e=>typeof e.uri==`string`&&e.uri.length<=2048&&typeof e.name==`string`))throw Error(`Invalid resource upload result`);let e=new Map([...this.uploaded,...i.resources].map(e=>[e.uri,e]));if(e.size>64||!r.multiSelect&&i.resources.length!==1)throw Error(`Invalid resource upload count`);this.uploaded=[...e.values()];let t=r.multiSelect?new Set(this.selected):new Set;for(let e of i.resources)t.add(e.uri);this.dispatchEvent(new CustomEvent(`resource-selection`,{detail:{values:[...t]},bubbles:!0,composed:!0}))}else if(`preview`in i){if(i.preview.viewId){if(await N(()=>import(`./mcp-app-view-registration-z646NqPb.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url),!l())return;this.preview={viewId:i.preview.viewId}}else{let e=i.preview.contents?.map(e=>e.text??``).join(`
`)??``,t=i.preview.contents?.flatMap(e=>{let t=e.blob&&e.mimeType?`data:${e.mimeType};base64,${e.blob}`:void 0;return O(t)?[t]:[]}).slice(0,4);this.preview={text:e.slice(0,65536),images:t}}}}catch(e){l()&&(this.error=s(e))}finally{l()&&(this.busy=!1,this.operationAbort=void 0)}}async upload(e){let t=Array.from(e.files??[]);e.value=``,t.length&&await this.operation(async e=>{d(this.context?.config);let r=I(this.context?.gateway.snapshot.hello?.policy);if(!r||t.length+this.uploaded.length>64||L(t,r,0).length!==t.length)throw Error(c(`chat.questions.resourceUploadTooLarge`));let i=[];for(let r of t){let t=new Uint8Array(await r.arrayBuffer());if(!e())throw Error(`Resource upload cancelled`);d(this.context?.config),i.push({name:r.name,mimeType:r.type||`application/octet-stream`,content:n(t),...r.webkitRelativePath?{relativePath:r.webkitRelativePath}:{}})}return{action:`upload`,files:i}})}render(){let e=this.question,t=e?.resource;return!e||!t?.viewId?C:b`
      <div class="chat-question-panel__resource-actions">
        ${e.options.map((e,n)=>e.preview&&(t.selection!==`implicit`||this.selected.has(e.value??e.label))?b`<button class="btn btn--sm" type="button" ?disabled=${this.disabled||this.busy} @click=${()=>this.operation(async()=>({action:`preview`,optionIndex:n}))}>${c(`chat.questions.resourcePreview`)}: ${e.label}</button>`:C)}
        ${t.userOptions?b`<label class="field"
                ><span>${e.header}</span
                ><input
                  type="file"
                  aria-label=${e.header}
                  ?multiple=${e.multiSelect||t.userOptions.kind===`directory`}
                  accept=${S(t.userOptions.accept?.join(`,`))}
                  ?webkitdirectory=${t.userOptions.kind===`directory`}
                  ?disabled=${this.disabled||this.busy}
                  @change=${e=>{e.currentTarget instanceof HTMLInputElement&&this.upload(e.currentTarget)}}
              /></label>`:C}
        ${this.uploaded.filter(e=>this.selected.has(e.uri)).map(e=>b`<div>${e.name}<button class="btn btn--sm" type="button" ?disabled=${this.disabled||this.busy} @click=${()=>this.dispatchEvent(new CustomEvent(`resource-selection`,{detail:{values:[...this.selected].filter(t=>t!==e.uri)},bubbles:!0,composed:!0}))}>${c(`common.remove`)}</button></div>`)}
        ${this.busy?b`<div role="status">${c(`common.loading`)}</div>`:C}
        ${this.error?b`<div role="alert">${this.error}</div>`:C}
        ${this.preview?.viewId?b`<mcp-app-view
                .sessionKey=${this.sessionKey}
                .viewId=${this.preview.viewId}
              ></mcp-app-view>`:this.preview?b`${this.preview.images?.map(t=>b`<img class="chat-question-panel__resource-image" src=${t} alt=${e.header} />`)}
                  <pre class="chat-question-panel__resource-preview">${this.preview.text}</pre>`:C}
      </div>
    `}},M([A({context:y,subscribe:!0})],J.prototype,`context`,void 0),M([D({attribute:!1})],J.prototype,`question`,void 0),M([D({attribute:!1})],J.prototype,`requestId`,void 0),M([D({attribute:!1})],J.prototype,`sessionKey`,void 0),M([D({attribute:!1})],J.prototype,`agentId`,void 0),M([D({attribute:!1})],J.prototype,`selected`,void 0),M([D({type:Boolean})],J.prototype,`disabled`,void 0),M([T()],J.prototype,`busy`,void 0),M([T()],J.prototype,`error`,void 0),M([T()],J.prototype,`uploaded`,void 0),M([T()],J.prototype,`preview`,void 0),customElements.get(`openclaw-chat-question-resource`)||customElements.define(`openclaw-chat-question-resource`,J)})))()}function X(e){return e?b`<div class="chat-question-panel__external">
        <a
          class="btn btn--sm"
          href=${e}
          target=${te}
          rel=${ee()}
        >
          ${g.externalLink} ${c(`chat.questions.openLink`)}
        </a>
        <span class="muted">${c(`chat.questions.externalStepHint`)}</span>
      </div>`:C}function Z(){return(Z=e((()=>{w(),_(),i(),k()})))()}var Q;function $(){return($=e((()=>{w(),E(),_(),i(),o(),a(),z(),H(),Y(),Z(),Q=class extends r{constructor(...e){super(...e),this.currentQuestionIndex=0,this.pendingAction=null,this.requestKey=null,this.collapsed=!1,this.focusAfterUpdate=!1,this.answerTextarea=null,this.measuredAnswer=null}setCollapsed(e){if(this.props?.onCollapsedChange){this.props.onCollapsedChange(e);return}this.collapsed=e,this.focusAfterUpdate=!e,this.requestUpdate()}willUpdate(){let e=this.props?.model,t=e?.requestKey??null,n=e?.collapsed??!1;t===this.requestKey?this.props?.onCollapsedChange&&(this.collapsed&&!n&&(this.focusAfterUpdate=!0),this.collapsed=n):(this.requestKey=t,e&&G(e.questions,e.drafts),this.currentQuestionIndex=0,this.pendingAction=null,this.collapsed=n,this.focusAfterUpdate=!n&&e?.autoFocus!==!1)}disconnectedCallback(){super.disconnectedCallback(),this.answerTextarea&&=(B(this.answerTextarea),null)}updated(){let e=this.querySelector(`.chat-question-panel__textarea`);this.answerTextarea!==e&&(this.answerTextarea&&B(this.answerTextarea),this.answerTextarea=e,this.measuredAnswer=null,e&&F(e)),e&&this.measuredAnswer!==e.value&&(R(e),this.measuredAnswer=e.value),this.focusAfterUpdate&&!this.collapsed&&(this.focusAfterUpdate=!1,this.querySelector(`.chat-question-panel`)?.focus({preventScroll:!0}))}answerValues(e,t){return K(e.drafts.get(t.questionId),t)}buildAnswers(e){return Object.fromEntries(e.questions.map(t=>[t.questionId,this.answerValues(e,t)]))}updateDraft(e,t,n){e.drafts.set(t.questionId,n),this.requestUpdate(),this.props?.onChange?.()}focusPanel(){this.updateComplete.then(()=>this.querySelector(`.chat-question-panel`)?.focus({preventScroll:!0}))}toggleOption(e,t,n,r=!0){let i=e.drafts.get(t.questionId),a=new Set(t.multiSelect?i?.selected:[]);t.multiSelect&&a.has(n)?a.delete(n):a.add(n),this.updateDraft(e,t,{selected:a,freeText:t.multiSelect?i?.freeText??``:``}),r&&!t.multiSelect&&this.currentQuestionIndex<e.questions.length-1&&(this.currentQuestionIndex+=1,this.focusPanel())}setFreeText(e,t,n){let r=e.drafts.get(t.questionId);this.updateDraft(e,t,{selected:!t.multiSelect&&(U(t)?n:n.trim())?new Set:r?.selected??new Set,freeText:n})}async resolve(e,t){if(e.disabled||e.submitting||this.pendingAction)return;let n;if(t===`submit`){let t=this.props?.onSubmit;if(!t||!e.questions.every(t=>t.allowEmpty||this.answerValues(e,t).length>0))return;n=()=>t(this.buildAnswers(e))}else{let e=this.props?.onSkip;if(!e)return;n=e}let r={kind:t};this.pendingAction=r;try{await n()}catch{}finally{this.pendingAction===r&&(this.pendingAction=null)}}advanceOrSubmit(e,t){if(t.allowEmpty||this.answerValues(e,t).length!==0){if(this.currentQuestionIndex<e.questions.length-1){this.currentQuestionIndex+=1,this.focusPanel();return}this.resolve(e,`submit`)}}goBack(){this.currentQuestionIndex!==0&&(--this.currentQuestionIndex,this.focusPanel())}handleKeyDown(e,t,n,r){if(r||e.isComposing||e.keyCode===229)return;if(e.target instanceof HTMLTextAreaElement){e.key===`Enter`&&(e.metaKey||e.ctrlKey)&&!e.altKey&&!e.shiftKey&&(n.allowEmpty||this.answerValues(t,n).length>0)&&(e.preventDefault(),this.advanceOrSubmit(t,n));return}if(e.metaKey||e.ctrlKey||e.altKey||e.target instanceof HTMLAnchorElement)return;if(e.target instanceof HTMLInputElement){e.key===`Enter`&&(n.allowEmpty||this.answerValues(t,n).length>0)&&(e.preventDefault(),this.advanceOrSubmit(t,n));return}if(e.target instanceof HTMLButtonElement&&e.target.getAttribute(`role`)===`radio`&&[`ArrowDown`,`ArrowLeft`,`ArrowRight`,`ArrowUp`,`End`,`Home`].includes(e.key)){e.preventDefault();let r=Number(e.target.dataset.optionIndex??`0`),i=n.options.length-1,a=e.key===`Home`?0:e.key===`End`?i:e.key===`ArrowLeft`||e.key===`ArrowUp`?(r-1+n.options.length)%n.options.length:(r+1)%n.options.length,o=n.options[a];if(!o)return;let s=this.currentQuestionIndex;this.toggleOption(t,n,o.value??o.label,!1),this.currentQuestionIndex===s&&this.updateComplete.then(()=>this.querySelector(`.chat-question-panel__option[data-option-index="${a}"]`)?.focus({preventScroll:!0}));return}let i=Number(e.key)-1,a=this.querySelector(`.chat-question-panel__option[data-option-index="${i}"]`);if(i>=0&&i<9&&a){e.preventDefault(),a.click();return}if(n.options.length>0&&n.options.length<9&&!n.resource&&n.isOther&&i===n.options.length){e.preventDefault(),this.querySelector(`.chat-question-panel__other`)?.focus({preventScroll:!0});return}e.key===`Enter`&&!(e.target instanceof HTMLButtonElement)&&(n.allowEmpty||this.answerValues(t,n).length>0)&&(e.preventDefault(),this.advanceOrSubmit(t,n))}render(){let e=this.props;if(!e)return C;let{model:t}=e,n=t.questions[this.currentQuestionIndex];if(!n)return C;let r=t.disabled||t.submitting||this.pendingAction!==null,i=this.currentQuestionIndex===t.questions.length-1,a=n.allowEmpty||this.answerValues(t,n).length>0,o=t.drafts.get(n.questionId),s=`${this.currentQuestionIndex+1}/${t.questions.length}`,l=t.requestPosition?`${t.requestPosition.current}/${t.requestPosition.total}`:null,u=l?b`<div class="chat-question-panel__request-nav">
          <button
            type="button"
            aria-label=${c(`common.previous`)}
            @click=${e.onPreviousRequest}
          >
            ${g.chevronLeft}
          </button>
          <span>${l}</span>
          <button type="button" aria-label=${c(`common.next`)} @click=${e.onNextRequest}>
            ${g.chevronRight}
          </button>
        </div>`:C;return this.collapsed?b`
        <section
          class="chat-question-panel chat-question-panel--collapsed"
          aria-label=${t.title}
        >
          <button
            class="chat-question-panel__collapsed-button"
            type="button"
            @click=${()=>this.setCollapsed(!1)}
            aria-label=${c(`chat.questions.expand`)}
            aria-expanded="false"
          >
            <span
              ><strong>${t.title}</strong> ·
              ${t.collapsedLabel?b`${t.collapsedLabel} · ${n.question}`:n.header}</span
            >
            ${t.collapsedLabel?C:b`<span class="chat-question-panel__progress">${s}</span>`}
            <span class="chat-question-panel__chevron">${g.chevronDown}</span>
          </button>
          ${u}
        </section>
      `:b`
      <section
        class="chat-question-panel"
        role="group"
        aria-label=${t.title}
        tabindex="0"
        @keydown=${e=>this.handleKeyDown(e,t,n,r)}
      >
        <div class="chat-question-panel__topline">
          <div class="chat-question-panel__title">${t.title}</div>
          ${u}
          <span class="chat-question-panel__progress">${s}</span>
          <button
            class="chat-question-panel__collapse"
            type="button"
            @click=${()=>this.setCollapsed(!0)}
            aria-label=${c(`chat.questions.collapse`)}
            aria-expanded="true"
          >
            ${g.chevronDown}
          </button>
        </div>

        <div class="chat-question-panel__heading">
          <span class="chat-question-panel__prompt">${n.question}</span>
        </div>

        ${X(n.url)}
        ${q({question:n,selected:o?.selected??new Set,disabled:r,onSelect:e=>this.toggleOption(t,n,e)})}
        ${n.secretStore?b`
                <div class="chat-question-panel__store">
                  <div class="chat-question-panel__store-requester">
                    ${c(`chat.questions.storeRequestedBy`,{agent:t.agentId??c(`common.unknown`),session:t.sessionKey??c(`common.unknown`)})}
                  </div>
                  <div class="chat-question-panel__store-entry">
                    ${c(`chat.questions.storeEntry`,{name:n.secretStore.name,kind:n.secretStore.kind===`secret`?c(`secretsStore.protectedSecret`):c(`secretsStore.agentReadable`)})}
                  </div>
                  ${n.secretStore.reason?b`<div class="chat-question-panel__store-reason">
                          ${n.secretStore.reason}
                        </div>`:C}
                  ${n.secretStoreExisting?b`<div class="chat-question-panel__store-replacement">
                          ${n.secretStoreExisting.updatedBy?c(`chat.questions.storeReplacementBy`,{name:n.secretStore.name,updated:p(n.secretStoreExisting.updatedAtMs),updatedBy:n.secretStoreExisting.updatedBy}):c(`chat.questions.storeReplacement`,{name:n.secretStore.name,updated:p(n.secretStoreExisting.updatedAtMs)})}
                        </div>`:C}
                  ${n.secretStore.kind===`secret`?b`<label class="chat-question-panel__store-hosts">
                          <span>${c(`secretsStore.allowedHosts`)}</span>
                          <input
                            class="chat-question-panel__other chat-question-panel__hosts"
                            type="text"
                            autocomplete="off"
                            placeholder=${c(`secretsStore.allowedHostsPlaceholder`)}
                            .value=${t.secretStoreAllowedHostsDraft??n.secretStore.allowedHosts?.join(`, `)??``}
                            ?disabled=${r}
                            @input=${t=>{let n=t.target;n instanceof HTMLInputElement&&e.onSecretStoreAllowedHostsChange?.(n.value)}}
                          />
                        </label>`:C}
                </div>
              `:C}
        ${W({question:n,value:o?.freeText??``,selected:!!(U(n)?o?.freeText:o?.freeText.trim()),disabled:r,onInput:e=>this.setFreeText(t,n,e)})}
        ${n.resource?b`<openclaw-chat-question-resource
                .question=${n}
                .requestId=${t.requestKey}
                .sessionKey=${t.sessionKey??``}
                .agentId=${t.agentId}
                .selected=${o?.selected??new Set}
                .disabled=${r}
                @resource-selection=${e=>this.updateDraft(t,n,{selected:new Set(e.detail.values),freeText:``})}
              ></openclaw-chat-question-resource>`:C}

        <div class="chat-question-panel__footer">
          ${t.notice?b`<span class="chat-question-panel__error" role="status">${t.notice}</span>`:C}
          ${t.error?b`<span class="chat-question-panel__error" role="status">
                  ${c(`chat.questions.submitFailed`,{error:t.error})}
                  ${e.onDismissError?b`<button
                          type="button"
                          class="chat-question-panel__error-dismiss"
                          aria-label=${c(`chat.actions.dismissError`)}
                          @click=${e.onDismissError}
                        >
                          ${g.x}
                        </button>`:C}
                </span>`:C}
          ${this.currentQuestionIndex>0?b`<button
                  class="btn btn--sm chat-question-panel__back"
                  type="button"
                  ?disabled=${r}
                  @click=${()=>this.goBack()}
                >
                  ${c(`chat.questions.back`)}
                </button>`:C}
          ${e.onSkip?b`<button
                  class="btn btn--sm chat-question-panel__skip"
                  type="button"
                  ?disabled=${r}
                  @click=${()=>void this.resolve(t,`skip`)}
                >
                  ${this.pendingAction?.kind===`skip`?c(t.nonBlocking?`chat.asyncQuestions.dismissing`:`chat.questions.skipping`):c(t.nonBlocking?`chat.asyncQuestions.dismiss`:`chat.questions.skip`)}
                </button>`:C}
          <button
            class="btn btn--sm primary chat-question-panel__advance"
            type="button"
            ?disabled=${r||!a||!e.onSubmit}
            @click=${()=>this.advanceOrSubmit(t,n)}
          >
            ${this.pendingAction?.kind===`submit`||t.submitting?c(`chat.questions.submitting`):c(i?`chat.questions.submit`:`chat.questions.next`)}
          </button>
        </div>
      </section>
    `}},M([D({attribute:!1})],Q.prototype,`props`,void 0),M([T()],Q.prototype,`currentQuestionIndex`,void 0),M([T()],Q.prototype,`pendingAction`,void 0),customElements.get(`openclaw-chat-question-panel`)||customElements.define(`openclaw-chat-question-panel`,Q)})))()}$();export{Q as ChatQuestionPanel};
//# sourceMappingURL=chat-question-panel-DDfJlJ8U.js.map