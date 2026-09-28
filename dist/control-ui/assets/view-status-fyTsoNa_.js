import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ai as t,Fs as n,Gl as r,Ls as i,Xl as a,ki as o,nu as s,tu as c}from"./control-ui-core-BfjCgLp6.js";import{$ as l,X as u,Y as d,_ as f,h as p,m}from"./lit-runtime-L6OV30Vo.js";import{Gn as h,Oa as g,Wn as _,ja as v}from"./control-ui-boot-shared-CYu509im.js";import{Ea as y,Oa as b,Ot as x,Ta as S,pt as C}from"./control-ui-boot-shared-Bm2ZxasE.js";import{n as w,t as T}from"./en-settings-B_O3e-Fr.js";import{r as E,t as D}from"./wizard-step-controls-CW6bDJe6.js";import{n as O,t as k}from"./wizard-login-controller-DeaGS-XK.js";var A,j;function M(){return(M=e((()=>{s(),A={modelSetup:{discovery:{title:`On this Gateway`,description:`Find existing connections or prepare a local model for {agent}. Using a model here changes this agent, not the global defaults.`,useForAgent:`Test & use for this agent`,connectForAgent:`Connect & use for this agent`,connectProvider:`Connect provider`,returnToModels:`Return to Models`,otherSoftware:`Other detected software`},verify:{title:`Selected model`,button:`Check model`,retry:`Try again`,checkAgain:`Check again`,checkingButton:`Checking…`,checking:`Checking — asking {modelRef} for a quick reply…`,ready:`Ready`,readyIn:`Ready · {latencyMs} ms`,providerUnavailable:`{provider} isn’t responding.`},nativeDiscovery:{title:`Discover existing conversations`,body:`Show native assistant conversations from this Gateway host in OpenClaw. This is discovery, not an import or copy.`,enable:`Show existing native conversations`,decline:`Leave unchecked to keep native session catalogs off when you connect your AI provider. Existing installations are not changed.`},success:{title:`Connection verified`,body:`OpenClaw received a real reply from {modelRef}. You can start chatting now.`,activeModel:`Active model`,latency:`Verified in {latencyMs} ms`,openChat:`Start chatting`,continueSetup:`Continue setup`,stayHere:`Stay in settings`,configuredModel:`Configured model`},utility:{role:`Setup & utility`,hint:`Helps set up OpenClaw and handles lightweight tasks. Regular chats need a primary model.`,useSetup:`Use for setup`,useUtility:`Use as utility`,ready:`Setup & utility model ready`,configured:`Setup & utility model`,verified:`OpenClaw received a real reply from {modelRef}. This model is ready for setup and lightweight tasks.`,model:`Utility model`,choosePrimary:`Choose a primary model below for regular chats. Your setup assistant remains available.`,primaryReady:`This model handles setup and lightweight tasks. Regular chats use your primary model.`,openAssistant:`Open setup assistant`,repair:`Recheck & repair`}}},j=Object.assign(()=>{Object.assign(c.modelSetup,A.modelSetup)},{catalog:A})})))()}var N;function P(){return(P=e((()=>{d(),m(),S(),O(),D(),r(),T(),i(),o(),g(),w(),N=class{constructor(e,t){this.host=e,this.options=t,this.picker=null,this.searchInput=p(),this.methodChoices=p(),this.focusPicker=null,this.generation=0,this.mutationActive=!1,this.refreshWarning=null,e.addController(this),this.wizard=new k(e,{getClient:()=>t.getScope().context.gateway.snapshot.client,getAgentId:()=>t.getScope().agentId,onClose:()=>this.reset(),onAnswer:(e,t)=>void this.run(()=>this.runner.answer(e,t)),onBackgroundCompletion:e=>this.run(()=>Promise.resolve(e),!0),requestFailedMessage:()=>a(`modelProviders.requestFailed`),sessionExpiredMessage:()=>a(`modelProviders.login.sessionExpired`)}),this.runner=this.wizard.runner}get busy(){return this.picker!==null||this.mutationActive||this.wizard.cancelling||this.runner.state.phase!==`idle`}get providerActions(){return{canMutate:this.options.canStart(),loginBusy:this.busy,onConnect:e=>this.open([e.id,...e.credentialProviderIds]),canConnect:e=>this.loginProviders([e.id,...e.credentialProviderIds]).length>0}}get pageActions(){return{selectedAgentId:this.options.getScope().agentId,onConnect:()=>this.open(),connectDisabled:!this.options.canStart()||this.busy,login:this.render(),loginMessage:this.message}}loginProviders(e,t=this.options.getScope().authStatus){let n=new Map,r=new Set;for(let i of t?.providerCapabilities??[])if(!e||e.includes(i.provider)){for(let e of i.loginOptions??[]){if(r.has(e.id))continue;r.add(e.id);let t=n.get(e.brandId);t||(t={id:e.brandId,label:``,choices:[]},n.set(t.id,t)),t.label||=e.groupLabel?.trim()??``,t.choices.push(e)}if(i.quickApiKeySetup&&this.options.onApiKey){let e=i.loginOptions?.length?i.loginOptions.map(e=>e.brandId):[i.provider];for(let t of new Set(e)){let e=n.get(t)??{id:t,label:``,choices:[]};n.set(t,{...e,apiKeyProvider:e.apiKeyProvider??i.provider})}}}for(let e of n.values())e.label||=y(e.id),e.choices.sort((e,t)=>Number(t.featured)-Number(e.featured)||e.label.localeCompare(t.label)||e.id.localeCompare(t.id));return[...n.values()].toSorted((e,t)=>e.label.localeCompare(t.label)||e.id.localeCompare(t.id))}async open(e,t){if(!this.options.canStart()||this.busy)return;let r=this.options.getScope(),{client:i,hello:o}=r.context.gateway.snapshot;if(!i||!r.agentId)return;let s=++this.generation,c=new AbortController;this.inventoryRequest=c;let l=()=>{let e=this.options.getScope();return s===this.generation&&e.context.gateway.snapshot.client===i&&e.context.gateway.snapshot.hello===o&&e.agentId===r.agentId&&this.options.canContinue()};this.picker={phase:`loading`,providers:e,providerId:``,query:``,isCurrent:l},this.focusPicker=null,this.message=void 0,this.host.requestUpdate();try{let n=r.authStatus??await v(i,{agentId:r.agentId,signal:c.signal});if(l()){let i=this.loginProviders(e,n),a=t?i.find(e=>e.choices.some(e=>e.id===t)):e&&i.length===1?i[0]:void 0;if(a?.apiKeyProvider&&!a.choices.length){this.reset(),this.options.onApiKey?.(a.apiKeyProvider);return}this.picker={phase:`ready`,providers:e,authStatus:n,providerId:a?.id??``,query:``,isCurrent:l},r.authStatus||(this.focusPicker=a?`method`:`search`)}}catch(t){l()&&(this.picker={phase:`error`,isCurrent:l,providers:e,providerId:``,query:``,message:n(t,a(`modelProviders.requestFailed`))})}finally{s===this.generation&&(this.inventoryRequest=void 0,l()||(this.picker=null),this.host.requestUpdate())}}reset(){this.generation+=1,this.inventoryRequest?.abort(),this.inventoryRequest=void 0,this.picker=null,this.focusPicker=null,this.mutationActive=!1,this.refreshWarning=null,this.message=void 0,this.wizard.reset()}hostDisconnected(){this.reset()}hostUpdated(){if(!this.focusPicker||!this.picker)return;let e=this.methodChoices.value,t=this.focusPicker===`search`?this.searchInput.value:e?.querySelector(`button`)??e;this.focusPicker=null,t?.focus({preventScroll:!0})}render(){let e=this.picker;if(e){let t=e.phase===`ready`?this.loginProviders(e.providers,e.authStatus):[],n=t.find(t=>t.id===e.providerId),r=e.query.trim().toLocaleLowerCase(),i=t.filter(e=>[e.id,e.label,...e.apiKeyProvider?[a(`modelProviders.status.apiKey`)]:[],...e.choices.flatMap(e=>[e.label,e.hint??``])].some(e=>e.toLocaleLowerCase().includes(r)));return l`
        <openclaw-modal-dialog
          label=${a(`modelProviders.login.title`)}
          @modal-cancel=${()=>this.reset()}
        >
          <div class="model-setup-wizard model-provider-login">
            <div class="model-setup-wizard__header">
              <h2>${a(`modelProviders.login.title`)}</h2>
            </div>
            <div class="model-setup-wizard__body">
              <p>${a(`modelProviders.login.description`)}</p>
              ${e.phase===`loading`?l`<div role="status">${a(`common.loading`)}</div>`:e.phase===`error`?l`<div role="alert">${e.message}</div>`:n?l`
                          <h3 class="model-provider-login__provider">
                            ${b(n.id)} ${n.label}
                          </h3>
                          <div data-models-login-choice tabindex="-1" ${f(this.methodChoices)}>
                            ${E({label:a(`modelProviders.login.method`),options:n.choices.map(e=>({value:e.id,label:e.label,hint:e.hint})),busy:e.phase!==`ready`||!e.isCurrent(),onAnswer:t=>{let r=n.choices.find(e=>e.id===t);this.picker===e&&r&&e.phase===`ready`&&e.isCurrent()&&(this.picker=null,this.refreshWarning=null,this.runner.prepareSignIn(r.kind,r.label),this.run(()=>this.runner.start(r.id,`models.authLogin`)))}})}
                          </div>
                          ${n.apiKeyProvider?l`
                                  <button
                                    type="button"
                                    class="btn"
                                    data-models-login-api-key
                                    ?disabled=${e.phase!==`ready`||!e.isCurrent()}
                                    @click=${()=>{this.picker===e&&n.apiKeyProvider&&e.phase===`ready`&&e.isCurrent()&&(this.reset(),this.options.onApiKey?.(n.apiKeyProvider))}}
                                  >
                                    ${a(`modelProviders.apiKey.set`)}
                                  </button>
                                `:u}
                        `:l`
                          <label class="field">
                            <span>${a(`modelProviders.search`)}</span>
                            <input
                              type="search"
                              data-models-login-search
                              autofocus
                              autocomplete="off"
                              ${f(this.searchInput)}
                              .value=${e.query}
                              @input=${t=>{e.query=t.currentTarget.value,this.host.requestUpdate()}}
                            />
                          </label>
                          <ul
                            class="model-provider-login__providers"
                            aria-label=${a(`modelSetup.manual.provider`)}
                          >
                            ${i.map(t=>l`
                                <li>
                                  <button
                                    type="button"
                                    class="btn model-provider-login__option"
                                    data-models-login-provider=${t.id}
                                    ?disabled=${e.phase!==`ready`||!e.isCurrent()}
                                    @click=${()=>{if(this.picker===e&&e.phase===`ready`&&e.isCurrent()){if(t.apiKeyProvider&&!t.choices.length){this.reset(),this.options.onApiKey?.(t.apiKeyProvider);return}e.providerId=t.id,this.focusPicker=`method`,this.host.requestUpdate()}}}
                                  >
                                    ${b(t.id)}
                                    <span class="model-provider-login__copy">
                                      <strong>${t.label}</strong>
                                      <span>
                                        ${[...t.choices.map(e=>e.label),...t.apiKeyProvider?[a(`modelProviders.status.apiKey`)]:[]].join(` · `)}
                                      </span>
                                    </span>
                                  </button>
                                </li>
                              `)}
                          </ul>
                          ${i.length?u:l`
                                  <p class="muted" role="status">
                                    ${a(r?`modelProviders.noMatches`:`modelProviders.login.noProviders`)}
                                  </p>
                                `}
                        `}
            </div>
            <div class="model-setup-wizard__footer">
              ${n?l`
                      <button
                        class="btn model-provider-login__secondary"
                        data-models-login-back
                        @click=${()=>{this.picker===e&&e.phase===`ready`&&e.isCurrent()&&(e.providers=void 0,e.providerId=``,this.focusPicker=`search`,this.host.requestUpdate())}}
                      >
                        ${a(`common.back`)}
                      </button>
                    `:!e.providers&&this.options.onDiscover?l`
                        <button
                          class="btn model-provider-login__secondary"
                          data-models-login-discover
                          ?disabled=${!e.isCurrent()}
                          @click=${()=>{this.picker===e&&e.isCurrent()&&(this.reset(),this.options.onDiscover?.())}}
                        >
                          ${a(`modelProviders.login.discover`)}
                        </button>
                      `:u}
              <button class="btn" @click=${()=>this.reset()}>${a(`common.cancel`)}</button>
            </div>
          </div>
        </openclaw-modal-dialog>
      `}return this.wizard.render({busy:this.mutationActive,refreshWarning:this.refreshWarning})}async complete(){let e=this.runner.state.authLabel;this.runner.close(),this.message={kind:`success`,text:[e,a(`modelProviders.login.done`)].filter(Boolean).join(`: `),...this.refreshWarning?{warning:this.refreshWarning}:{}},this.host.requestUpdate(),await this.options.refresh()}async run(e,r=!1){let i=this.options.getScope().context.gateway.snapshot.client;if(!i||this.mutationActive&&!r||!this.options.canContinue())return;let o=++this.generation;this.mutationActive=!0,this.host.requestUpdate();try{let n=await this.options.getScope().context.runtimeConfig.runExternalMutation(async n=>{if(n!==i)throw Error(a(`modelProviders.requestFailed`));let r=await e();return r&&t(n),r},{canDispatch:()=>o===this.generation&&this.options.getScope().context.gateway.snapshot.client===i&&this.options.canContinue(),dispatchError:a(`modelProviders.requestFailed`)});if(o!==this.generation)return;if(!n.ok){this.runner.fail(n.error);return}this.refreshWarning=n.refresh.ok?null:n.refresh.error,n.value&&n.value.isCurrent?.()!==!1&&await this.complete()}catch(e){o===this.generation&&this.runner.fail(n(e,a(`modelProviders.requestFailed`)))}finally{o===this.generation&&(this.mutationActive=!1,this.host.requestUpdate())}}}})))()}function F(e){let t=e.auth;if(!t)return u;let n=a(V[t.kind]),r=t.expiryLabel?a(`modelProviders.expiresIn`,{time:t.expiryLabel}):void 0;return l`
    <span title=${r??n}>
      ${x({kind:H[t.kind],label:n})}
    </span>
  `}function I(e){return e.hasConfigApiKey||!!e.apiKey||e.profiles.length>0}function L(e){return e.catalogStatus===`ready`&&e.auth?.kind!==`expired`&&e.auth?.kind!==`missing`&&e.auth?.kind!==`expiring`}function R(e){return e.checkingModels?x({kind:`muted`,label:a(`chat.modelControls.checkingProviderModels`,{providers:e.displayName})}):e.auth?.kind===`expired`||e.auth?.kind===`missing`||e.auth?.kind===`expiring`?F(e):e.catalogStatus===`auth-rejected`?x({kind:`danger`,label:a(`modelProviders.status.denied`)}):e.catalogStatus===`unavailable`?x({kind:`warn`,label:a(`modelProviders.status.modelsUnavailable`)}):I(e)?L(e)&&e.availableModelCount>0?x({kind:`ok`,label:a(`modelProviders.status.ready`)}):L(e)?x({kind:`muted`,label:a(`modelProviders.status.ok`)}):x({kind:`muted`,label:a(`modelProviders.status.configured`)}):F(e)}function z(e){return e?l`
    <div class="callout ${e.kind}" role=${e.kind===`error`?`alert`:`status`}>
      ${e.text}
    </div>
    ${e.warning?l`<div class="callout warning" role="status">${e.warning}</div>`:u}
  `:u}function B(e,t=!1){return l`<button
    class=${t?`btn primary`:`btn`}
    data-models-connect
    ?disabled=${e.connectDisabled}
    @click=${e.onConnect}
  >
    ${a(`modelProviders.login.action`)}
  </button>`}var V,H;function U(){return(U=e((()=>{d(),C(),r(),_(),h(),V={ok:`modelProviders.status.ok`,expiring:`modelProviders.status.expiring`,expired:`modelProviders.status.expired`,missing:`modelProviders.status.missing`,"api-key":`modelProviders.status.apiKey`},H={ok:`ok`,expiring:`warn`,expired:`danger`,missing:`danger`,"api-key":`muted`}})))()}export{R as a,M as c,z as i,j as l,U as n,N as o,B as r,P as s,L as t};
//# sourceMappingURL=view-status-fyTsoNa_.js.map