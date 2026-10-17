import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,Tu as i,du as a,fu as o,ju as s,kc as c,pu as l}from"./control-ui-core-CTSdBcaH.js";import{Wr as u,gr as d,xr as f}from"./control-ui-core-vFnxmx94.js";import{$ as p,X as m,Y as h,ct as g,nt as _,ut as v}from"./lit-runtime-TNZj1e-P.js";import{Ft as y,Pt as b,ii as x}from"./ui-CnRtCcYL.js";import{A as S,M as C,O as w,k as T}from"./control-ui-boot-shared-kUERtt7j.js";function E(e){return e.items.filter(e=>e.status===`planned`)}function D(e){return e?.providers.filter(e=>e.found&&e.planFingerprint&&E(e).length>0)??[]}function O(){try{return globalThis.sessionStorage?.getItem(A)===`done`}catch{return!1}}function k(){try{globalThis.sessionStorage?.setItem(A,`done`)}catch{}}var A,j;function M(){return(M=e((()=>{w(),h(),_(),f(),r(),l(),y(),i(),t(),u(),A=`openclaw.onboarding.memory-import`,j=class extends n{constructor(...e){super(...e),this.active=!1,this.selectedByProvider={},this.applyingProviderId=null,this.results={},this.done=!1,this.closed=!1,this.subscriptions=new c(this).watchStore(()=>this.context?.gateway).watchStore(()=>this.context?.agents).watchStore(()=>this.context?.agentSelection),this.planTask=new T(this,{args:()=>{let e=this.context?.gateway.snapshot;return[this.active,this.closed,O(),this.isConnected&&e?.phase===`connected`?e.client??null:null,e?d(e.hello?.auth??null):!1,this.currentAgentId()]},task:async([e,t,n,r,i,a],{signal:o})=>{if(!e||t||n||!r||!i||!a||this.applyingProviderId!==null||this.done)return S;let s=await r.request(`migrations.memory.plan`,{agentId:a,overwrite:!1},{signal:o});return s.agentId!==a||D(s).length===0&&s.providers.some(e=>e.error)?S:{client:r,agentId:a,plan:s}},onComplete:({plan:e})=>{let t=D(e);if(t.length===0){e.providers.some(e=>e.error)||(k(),this.closed=!0);return}this.results={},this.done=!1,this.selectedByProvider=Object.fromEntries(t.map(e=>[e.providerId,!0]))}})}disconnectedCallback(){this.planTask.run([!1,!0,!0,null,!1,null]),this.subscriptions.clear(),super.disconnectedCallback()}updated(){if(this.context?.agents.state.agentsList)this.agentsListRequest=void 0;else if(this.context&&this.agentsListRequest!==this.context.agents){let e=this.context.agents;this.agentsListRequest=e,e.ensureList().catch(()=>null).then(()=>{this.context?.agents===e&&!e.state.agentsList&&(this.agentsListRequest=void 0)})}}currentAgentId(){let e=this.context?.agents.state.agentsList;if(!e)return null;let t=this.context?.agentSelection.state.selectedId;return t&&e.agents.some(e=>e.id===t)?t:e.defaultId??e.agents[0]?.id??null}get planBinding(){let e=this.planTask.value,t=this.context?.gateway.snapshot,n=this.currentAgentId();return this.planTask.status!==C.COMPLETE||!e?null:e.client===t?.client&&e.agentId===n?e:null}get plan(){return this.planBinding?.plan??null}toggleProvider(e,t){this.selectedByProvider={...this.selectedByProvider,[e]:t}}async importSelected(){let e=this.context,t=this.planBinding,n=t?.plan,r=t?.client,i=t?.agentId;if(!e||!r||!n||!i||this.applyingProviderId!==null||this.done)return;let o=D(n).filter(e=>this.selectedByProvider[e.providerId]);if(o.length!==0){for(let e of o){if(!this.isConnected||this.closed||this.context?.gateway.snapshot.client!==r||this.currentAgentId()!==i){this.results={...this.results,[e.providerId]:{kind:`error`,message:s(`onboarding.memoryImport.connectionChanged`)}};continue}let t=E(e).map(e=>e.id),n=e.planFingerprint;if(n&&t.length!==0){this.applyingProviderId=e.providerId;try{let a=await r.request(`migrations.memory.apply`,{idempotencyKey:b(),agentId:i,providerId:e.providerId,planFingerprint:n,itemIds:t,overwrite:!1});this.results={...this.results,[e.providerId]:{kind:a.summary.errors>0||a.summary.conflicts>0?`partial`:`success`,result:a}}}catch(t){this.results={...this.results,[e.providerId]:{kind:`error`,message:a(t,s(`onboarding.memoryImport.unknownError`))}}}}}this.applyingProviderId=null,this.done=this.context?.gateway.snapshot.client===r&&this.currentAgentId()===i,this.done||this.planTask.run()}}finish(){k(),this.closed=!0}reviewDetails(){this.finish(),this.context?.navigate(`memory-import`)}handleModalCancel(e){if(this.applyingProviderId!==null){e.preventDefault();return}this.finish()}renderProvider(e){let t=E(e).length,n=e.items.filter(e=>e.status===`conflict`).length,r=this.results[e.providerId],i=this.applyingProviderId===e.providerId;return p`
      <li class="onboarding-memory-import__provider" data-provider-id=${e.providerId}>
        <label>
          <input
            type="checkbox"
            .checked=${this.selectedByProvider[e.providerId]??!1}
            ?disabled=${this.applyingProviderId!==null||this.done}
            @change=${t=>this.toggleProvider(e.providerId,t.currentTarget.checked)}
          />
          <span class="onboarding-memory-import__provider-copy">
            <strong>${e.label}</strong>
            <code title=${e.source??``}
              >${e.source??s(`onboarding.memoryImport.sourceUnavailable`)}</code
            >
            <small>
              ${s(`onboarding.memoryImport.plannedCount`,{count:String(t)})}
              ${n>0?p`<span>
                      ${s(`onboarding.memoryImport.alreadyImported`,{count:String(n)})}
                    </span>`:m}
            </small>
          </span>
        </label>
        <div class="onboarding-memory-import__provider-status" aria-live="polite">
          ${i?s(`onboarding.memoryImport.importingProvider`):r?.kind===`success`?s(`onboarding.memoryImport.providerResult`,{migrated:String(r.result.summary.migrated),skipped:String(r.result.summary.skipped)}):r?.kind===`partial`?p`<span role="alert">
                      ${s(`onboarding.memoryImport.providerIncomplete`,{conflicts:String(r.result.summary.conflicts),errors:String(r.result.summary.errors),migrated:String(r.result.summary.migrated),skipped:String(r.result.summary.skipped)})}
                    </span>`:r?.kind===`error`?p`<span role="alert">
                        ${s(`onboarding.memoryImport.providerError`,{error:o(r.message)})}
                      </span>`:m}
        </div>
      </li>
    `}render(){let e=this.context,t=e?.gateway.snapshot,n=D(this.plan);if(!this.active||this.closed||O()||!e||t?.phase!==`connected`||!t.client||!d(t.hello?.auth??null)||n.length===0)return m;let r=n.filter(e=>this.selectedByProvider[e.providerId]).length,i=Object.values(this.results).filter(e=>e.kind!==`error`),a=i.reduce((e,t)=>e+t.result.summary.migrated,0),o=i.reduce((e,t)=>e+t.result.summary.skipped,0),c=s(`onboarding.memoryImport.title`),l=s(`onboarding.memoryImport.body`);return p`
      <openclaw-modal-dialog
        class="onboarding-memory-import-dialog"
        label=${c}
        description=${l}
        @modal-cancel=${e=>this.handleModalCancel(e)}
      >
        <section class="onboarding-memory-import">
          <header>
            <h2>${this.done?s(`onboarding.memoryImport.doneTitle`):c}</h2>
            <p>
              ${this.done?s(`onboarding.memoryImport.doneBody`,{migrated:String(a),skipped:String(o)}):l}
            </p>
          </header>
          <ul>
            ${n.map(e=>this.renderProvider(e))}
          </ul>
          <footer>
            ${this.done?p`<button
                    class="btn primary"
                    type="button"
                    data-test-id="onboarding-memory-import-continue"
                    @click=${()=>this.finish()}
                  >
                    ${s(`common.continue`)}
                  </button>`:p`
                    <button
                      class="btn primary"
                      type="button"
                      data-test-id="onboarding-memory-import-import"
                      ?disabled=${r===0||this.applyingProviderId!==null}
                      @click=${()=>void this.importSelected()}
                    >
                      ${this.applyingProviderId?s(`common.importing`):s(`onboarding.memoryImport.import`)}
                    </button>
                    <button
                      class="btn"
                      type="button"
                      data-test-id="onboarding-memory-import-skip"
                      ?disabled=${this.applyingProviderId!==null}
                      @click=${()=>this.finish()}
                    >
                      ${s(`onboarding.memoryImport.skip`)}
                    </button>
                    <button
                      class="btn btn--ghost onboarding-memory-import__review"
                      type="button"
                      ?disabled=${this.applyingProviderId!==null}
                      @click=${()=>this.reviewDetails()}
                    >
                      ${s(`onboarding.memoryImport.reviewDetails`)}
                    </button>
                  `}
          </footer>
        </section>
      </openclaw-modal-dialog>
    `}},x([v({attribute:!1})],j.prototype,`context`,void 0),x([v({type:Boolean})],j.prototype,`active`,void 0),x([g()],j.prototype,`selectedByProvider`,void 0),x([g()],j.prototype,`applyingProviderId`,void 0),x([g()],j.prototype,`results`,void 0),x([g()],j.prototype,`done`,void 0),x([g()],j.prototype,`closed`,void 0),customElements.get(`openclaw-onboarding-memory-import`)||customElements.define(`openclaw-onboarding-memory-import`,j)})))()}M();
//# sourceMappingURL=onboarding-memory-import-Cxv6-3yX.js.map