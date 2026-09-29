import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Ds5QQwGa.js";import{Fs as n,Gl as r,Is as i,Kr as a,Ll as o,Ls as s,Xl as c,nc as l,qr as u,tc as d,zl as f}from"./control-ui-core-DkXlmHxW.js";import{$ as p,X as m,Y as h,ct as g,nt as _,ut as v}from"./lit-runtime-DLvISeBM.js";import{Cr as y,Fr as b,Or as x}from"./control-ui-core-BdNTI4B-.js";import{G as S,H as C,U as w,V as T}from"./control-ui-boot-shared-R7zgIWiU.js";function E(e){return n(e,c(`onboarding.memoryImport.unknownError`))}function D(e){return e.items.filter(e=>e.status===`planned`)}function O(e){return e?.providers.filter(e=>e.found&&e.planFingerprint&&D(e).length>0)??[]}function k(){try{return globalThis.sessionStorage?.getItem(j)===`done`}catch{return!1}}function A(){try{globalThis.sessionStorage?.setItem(j,`done`)}catch{}}var j,M;function N(){return(N=e((()=>{T(),h(),_(),x(),r(),s(),u(),f(),l(),b(),j=`openclaw.onboarding.memory-import`,M=class extends o{constructor(...e){super(...e),this.active=!1,this.selectedByProvider={},this.applyingProviderId=null,this.results={},this.done=!1,this.closed=!1,this.subscriptions=new d(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agentSelection,(e,t)=>e.subscribe(t)),this.planTask=new C(this,{args:()=>{let e=this.context?.gateway.snapshot;return[this.active,this.closed,k(),this.isConnected&&e?.phase===`connected`?e.client??null:null,e?y(e.hello?.auth??null):!1,this.currentAgentId()]},task:async([e,t,n,r,i,a],{signal:o})=>{if(!e||t||n||!r||!i||!a||this.applyingProviderId!==null||this.done)return w;let s=await r.request(`migrations.memory.plan`,{agentId:a,overwrite:!1},{signal:o});return s.agentId!==a||O(s).length===0&&s.providers.some(e=>e.error)?w:{client:r,agentId:a,plan:s}},onComplete:({plan:e})=>{let t=O(e);if(t.length===0){e.providers.some(e=>e.error)||(A(),this.closed=!0);return}this.results={},this.done=!1,this.selectedByProvider=Object.fromEntries(t.map(e=>[e.providerId,!0]))}})}disconnectedCallback(){this.planTask.run([!1,!0,!0,null,!1,null]),this.subscriptions.clear(),super.disconnectedCallback()}updated(){if(this.context?.agents.state.agentsList)this.agentsListRequest=void 0;else if(this.context&&this.agentsListRequest!==this.context.agents){let e=this.context.agents;this.agentsListRequest=e,e.ensureList().catch(()=>null).then(()=>{this.context?.agents===e&&!e.state.agentsList&&(this.agentsListRequest=void 0)})}}currentAgentId(){let e=this.context?.agents.state.agentsList;if(!e)return null;let t=this.context?.agentSelection.state.selectedId;return t&&e.agents.some(e=>e.id===t)?t:e.defaultId??e.agents[0]?.id??null}get planBinding(){let e=this.planTask.value,t=this.context?.gateway.snapshot,n=this.currentAgentId();return this.planTask.status!==S.COMPLETE||!e?null:e.client===t?.client&&e.agentId===n?e:null}get plan(){return this.planBinding?.plan??null}toggleProvider(e,t){this.selectedByProvider={...this.selectedByProvider,[e]:t}}async importSelected(){let e=this.context,t=this.planBinding,n=t?.plan,r=t?.client,i=t?.agentId;if(!e||!r||!n||!i||this.applyingProviderId!==null||this.done)return;let o=O(n).filter(e=>this.selectedByProvider[e.providerId]);if(o.length!==0){for(let e of o){if(!this.isConnected||this.closed||this.context?.gateway.snapshot.client!==r||this.currentAgentId()!==i){this.results={...this.results,[e.providerId]:{kind:`error`,message:c(`onboarding.memoryImport.connectionChanged`)}};continue}let t=D(e).map(e=>e.id),n=e.planFingerprint;if(n&&t.length!==0){this.applyingProviderId=e.providerId;try{let o=await r.request(`migrations.memory.apply`,{idempotencyKey:a(),agentId:i,providerId:e.providerId,planFingerprint:n,itemIds:t,overwrite:!1});this.results={...this.results,[e.providerId]:{kind:o.summary.errors>0||o.summary.conflicts>0?`partial`:`success`,result:o}}}catch(t){this.results={...this.results,[e.providerId]:{kind:`error`,message:E(t)}}}}}this.applyingProviderId=null,this.done=this.context?.gateway.snapshot.client===r&&this.currentAgentId()===i,this.done||this.planTask.run()}}finish(){A(),this.closed=!0}reviewDetails(){this.finish(),this.context?.navigate(`memory-import`)}handleModalCancel(e){if(this.applyingProviderId!==null){e.preventDefault();return}this.finish()}renderProvider(e){let t=D(e).length,n=e.items.filter(e=>e.status===`conflict`).length,r=this.results[e.providerId],a=this.applyingProviderId===e.providerId;return p`
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
              >${e.source??c(`onboarding.memoryImport.sourceUnavailable`)}</code
            >
            <small>
              ${c(`onboarding.memoryImport.plannedCount`,{count:String(t)})}
              ${n>0?p`<span>
                      ${c(`onboarding.memoryImport.alreadyImported`,{count:String(n)})}
                    </span>`:m}
            </small>
          </span>
        </label>
        <div class="onboarding-memory-import__provider-status" aria-live="polite">
          ${a?c(`onboarding.memoryImport.importingProvider`):r?.kind===`success`?c(`onboarding.memoryImport.providerResult`,{migrated:String(r.result.summary.migrated),skipped:String(r.result.summary.skipped)}):r?.kind===`partial`?p`<span role="alert">
                      ${c(`onboarding.memoryImport.providerIncomplete`,{conflicts:String(r.result.summary.conflicts),errors:String(r.result.summary.errors),migrated:String(r.result.summary.migrated),skipped:String(r.result.summary.skipped)})}
                    </span>`:r?.kind===`error`?p`<span role="alert">
                        ${c(`onboarding.memoryImport.providerError`,{error:i(r.message)})}
                      </span>`:m}
        </div>
      </li>
    `}render(){let e=this.context,t=e?.gateway.snapshot,n=O(this.plan);if(!this.active||this.closed||k()||!e||t?.phase!==`connected`||!t.client||!y(t.hello?.auth??null)||n.length===0)return m;let r=n.filter(e=>this.selectedByProvider[e.providerId]).length,i=Object.values(this.results).filter(e=>e.kind!==`error`),a=i.reduce((e,t)=>e+t.result.summary.migrated,0),o=i.reduce((e,t)=>e+t.result.summary.skipped,0),s=c(`onboarding.memoryImport.title`),l=c(`onboarding.memoryImport.body`);return p`
      <openclaw-modal-dialog
        class="onboarding-memory-import-dialog"
        label=${s}
        description=${l}
        @modal-cancel=${e=>this.handleModalCancel(e)}
      >
        <section class="onboarding-memory-import">
          <header>
            <h2>${this.done?c(`onboarding.memoryImport.doneTitle`):s}</h2>
            <p>
              ${this.done?c(`onboarding.memoryImport.doneBody`,{migrated:String(a),skipped:String(o)}):l}
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
                    ${c(`common.continue`)}
                  </button>`:p`
                    <button
                      class="btn primary"
                      type="button"
                      data-test-id="onboarding-memory-import-import"
                      ?disabled=${r===0||this.applyingProviderId!==null}
                      @click=${()=>void this.importSelected()}
                    >
                      ${this.applyingProviderId?c(`common.importing`):c(`onboarding.memoryImport.import`)}
                    </button>
                    <button
                      class="btn"
                      type="button"
                      data-test-id="onboarding-memory-import-skip"
                      ?disabled=${this.applyingProviderId!==null}
                      @click=${()=>this.finish()}
                    >
                      ${c(`onboarding.memoryImport.skip`)}
                    </button>
                    <button
                      class="btn btn--ghost onboarding-memory-import__review"
                      type="button"
                      ?disabled=${this.applyingProviderId!==null}
                      @click=${()=>this.reviewDetails()}
                    >
                      ${c(`onboarding.memoryImport.reviewDetails`)}
                    </button>
                  `}
          </footer>
        </section>
      </openclaw-modal-dialog>
    `}},t([v({attribute:!1})],M.prototype,`context`,void 0),t([v({type:Boolean})],M.prototype,`active`,void 0),t([g()],M.prototype,`selectedByProvider`,void 0),t([g()],M.prototype,`applyingProviderId`,void 0),t([g()],M.prototype,`results`,void 0),t([g()],M.prototype,`done`,void 0),t([g()],M.prototype,`closed`,void 0),customElements.get(`openclaw-onboarding-memory-import`)||customElements.define(`openclaw-onboarding-memory-import`,M)})))()}N();
//# sourceMappingURL=onboarding-memory-import-CzbYtrB0.js.map