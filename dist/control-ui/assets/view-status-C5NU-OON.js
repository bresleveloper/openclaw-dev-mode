import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Cu as t,Eu as n,Iu as r,Lu as i,Tu as a,dl as o,du as s,ju as c,lt as l,lu as u,ml as d,nl as f,ol as p,pl as m,pu as h,ut as g,uu as _}from"./control-ui-core-bJHyI7AF.js";import{aa as v,ia as ee,na as y,ra as b}from"./control-ui-core-DNh4McGE.js";import{$ as x,F as S,M as te,N as C,X as w,Y as T,a as ne,ct as re,i as ie,nt as ae,tt as oe,ut as E}from"./lit-runtime-DyST807n.js";import{At as se,En as ce,Fn as le,In as ue,Ln as de,Nn as D,On as fe,Pn as pe,_n as me,gn as he,jt as ge,vn as _e,wn as ve}from"./control-ui-boot-shared-DsSYH3B6.js";import{Br as O,Gr as k,Kr as A,fa as j,ii as M}from"./ui-DeikvIdP.js";import{A as ye,M as be,O as xe,k as Se}from"./control-ui-boot-shared-ChxHeQUn.js";import{I as N,Z as P,di as F,pi as I,ui as L}from"./control-ui-boot-shared-C9uJ732w.js";import{n as R,t as z}from"./en-settings-C6f4UN4T.js";import{n as Ce,t as we}from"./wizard-login-controller-BzGhKgO8.js";import{n as Te,t as Ee}from"./provider-usage-De2Vgryc.js";function De(e,t){return{onPrimaryChange:n=>{t({primary:n,fallbacks:e().fallbacks.filter(e=>e!==n)})},onFallbackChange:n=>{t({fallbacks:n?[n,...e().fallbacks.slice(1).filter(e=>e!==n)]:[]})},onUtilityChange:e=>t({utilityModel:e}),onDecisionChange:e=>t({decisionModel:e}),onThinkingChange:e=>t({thinkingLevel:e,thinkingOverridden:!0}),onThinkingReset:()=>t({thinkingLevel:void 0,thinkingOverridden:!1}),onFastModeChange:e=>t({fastMode:e,fastModeOverridden:!0}),onFastModeReset:()=>t({fastMode:void 0,fastModeOverridden:!1})}}function Oe(e){let t=e?.thinkingDefault,n=e?.fastModeDefault;return{thinkingLevel:typeof t==`string`?t:void 0,thinkingOverridden:e!==null&&Object.hasOwn(e,`thinkingDefault`),fastMode:n===`auto`||n===`ultrafast`||typeof n==`boolean`?n:void 0,fastModeOverridden:e!==null&&Object.hasOwn(e,`fastModeDefault`)}}function ke(e){return{agents:{defaults:{...e.primary?{model:e.fallbacks.length>0?{primary:e.primary,fallbacks:[...e.fallbacks]}:e.primary}:{},utilityModel:e.utilityModel,...e.decisionModel===void 0?{}:{decisionModel:e.decisionModel},thinkingDefault:e.thinkingOverridden&&e.thinkingLevel?e.thinkingLevel:null,fastModeDefault:e.fastModeOverridden&&e.fastMode!==void 0?e.fastMode:null}}}}function Ae(e,t){if(t.length===1)return t[0];let n=t.some(e=>e.status===`ok`)?`ok`:Le.find(e=>t.some(t=>t.status===e))??`unknown`,r=t.find(e=>e.status===n)?.error;return{provider:e,status:n,...r?{error:r}:{},results:t.flatMap(e=>e.results.map(t=>({...t,label:`${e.provider}: ${t.label}`})))}}function je(e){let t=e.runtimeConfig.state,n=e.overlays.snapshot;return t.configLoading||t.configSaving||t.configApplying||n.updateRunning||n.updateReconciliationPending}function Me(e){let t=e.gateway.snapshot;if(t.phase!==`connected`)return c(`modelProviders.readOnly.disconnected`);if(e.runtimeConfig.canPatch!==!0)return c(`modelProviders.readOnly.adminRequired`);let n=e.runtimeConfig.state;return!t.client||n.client!==t.client||!m(n)?c(`modelProviders.configUnavailable`):null}function B(e){return s(e,c(`modelProviders.requestFailed`))}async function V(e,t){let n=e.value.warning?[e.value.warning]:[];if(!e.refresh.ok)n.push(e.refresh.error);else try{let e=await t();e&&n.push(e)}catch(e){n.push(B(e))}return n.length?n.join(` `):null}async function Ne(e,t){let{runtimeConfig:n}=e;e.setBusy(!0),e.setMessage(null);try{if(await n.ensureLoaded(),!e.isCurrentClient())return;let r=await n.patch({raw:t.raw,note:t.note,...t.replacePaths?{replacePaths:t.replacePaths}:{}});if(!e.isCurrentClient())return;r||e.isCurrentAgent()&&e.setMessage({kind:`error`,text:n.state.lastError??c(`modelProviders.configUnavailable`)})}catch(t){e.isCurrentClient()&&e.isCurrentAgent()&&e.setMessage({kind:`error`,text:B(t)})}finally{e.isCurrentClient()&&e.isCurrentAgent()&&e.setBusy(!1)}}async function Pe(e,t){let n=()=>e.isCurrentClient()&&e.isCurrentAgent();e.setBusy(!0),e.setMessage(null);try{let r=await e.runtimeConfig.runExternalMutation(async e=>{if(e!==t.client)throw Error(c(`modelProviders.requestFailed`));let n={provider:t.provider,agentId:t.agentId},r=await(t.apiKey===null?e.request(`models.authLogout`,{...n,credentialType:`api_key`}):e.request(`models.authSetApiKey`,{...n,apiKey:t.apiKey}));return g(e),r},{canDispatch:()=>n()&&e.canMutate()});if(!n())return{ok:!1};if(!r.ok)return e.setMessage({kind:`error`,text:r.error}),{ok:!1};let i=await V(r,()=>e.refreshProviders());return n()?(e.setMessage({kind:`success`,text:t.success,...i?{warning:i}:{}}),{ok:!0,warning:i}):{ok:!1}}finally{n()&&e.setBusy(!1)}}function Fe(e,t,n){return c(e===`add`?`modelProviders.add.saved`:t===null?`modelProviders.apiKey.removed`:`modelProviders.apiKey.saved`,{provider:n})}var Ie,Le;function H(){return(H=e((()=>{n(),d(),h(),l(),Ie=[`agents.defaults.model.fallbacks`],Le=[`auth`,`billing`,`rate_limit`,`timeout`,`format`,`no_model`,`unknown`]})))()}function U(e,t){return e.find(e=>t.some(t=>e.ids.has(t)))}function W(e,t,n){let r=U(e,[t]);if(r)return r;let i={ids:new Set([t]),card:{id:t,displayName:n,profiles:[],profileProviderIds:{},profileOrders:{},profileOrderExplicitProviders:[],profileOrderStoredProviders:[],profileOrderLocks:{},credentialProviderIds:[],logoutTargets:[],hasConfigApiKey:!1,modelCount:0,availableModelCount:0},hasModelAuth:!1};return e.push(i),i}function Re(e,t){let n=A(t);n&&!e.some(e=>A(e)===n)&&e.push(t)}function ze(e,t,n){if(n.length===0)return;let r=A(t),i=e.find(e=>A(e.provider)===r);if(!i){e.push({provider:t,profileIds:[...new Set(n)]});return}i.profileIds=[...new Set([...i.profileIds,...n])]}function Be(e){let t=[],n=new Map,r=new Map,i=new Set;for(let t of e.authStatus?.providerCapabilities??[]){let e=D(t.provider);e&&n.set(e,n.get(e)===!0||t.apiKeySupported)}for(let n of e.configProviderIds??[]){let e=D(n);e&&(W(t,e,F(e)).card.configKey??=n)}for(let n of e.configApiKeyProviderIds??[]){let e=D(n);if(e){let r=W(t,e,F(e)).card;r.configKey=n,r.hasConfigApiKey=!0,Re(r.credentialProviderIds,n)}}for(let[n,r]of Object.entries(e.configProviderAuthModes??{})){let e=D(n);e&&(W(t,e,F(e)).card.configAuthMode=r)}for(let n of e.pendingProviders??[]){let e=D(n);e&&(W(t,e,F(e)).card.checkingModels=!0)}for(let n of e.providerOutcomes??[]){let e=D(n.provider);if(!e)continue;let r=W(t,e,F(e)),i=r.catalogOutcome,a=n.profileId===void 0,o=Ge[a?`provider`:`profile`];(!i||(a===(i.profileId===void 0)?o.indexOf(n.status)<o.indexOf(i.status):a))&&(r.catalogOutcome=n)}for(let n of e.models??[]){let e=D(n.provider);if(!e)continue;let r=W(t,e,F(e));r.card.modelCount+=1,n.available===!0&&(r.card.availableModelCount+=1)}for(let a of e.authStatus?.providers??[]){let e=D(a.provider);if(!e)continue;let o=a.usage?D(a.usage.providerId):e,s=[...new Set([e,o])],c=U(t,s)??W(t,o,F(o));for(let e of s)c.ids.add(e);if(c.card.displayName=a.displayName||c.card.displayName,c.card.profiles.push(...a.profiles),a.profiles.length>0){let e=a.authProvider||a.provider;for(let t of a.profiles)c.card.profileProviderIds[t.profileId]=e;a.profileOrder!==void 0&&i.add(e);let t=a.profileOrder??a.profiles.map(e=>e.profileId);r.set(e,[...new Set([...r.get(e)??[],...t])]),c.card.profileOrders[e]=t,a.profileOrderStored===!0&&!c.card.profileOrderStoredProviders.includes(e)&&c.card.profileOrderStoredProviders.push(e),a.profileOrderLocked!==void 0&&(c.card.profileOrderLocks[e]??=a.profileOrderLocked)}(a.apiKey||a.profiles.length>0)&&Re(c.card.credentialProviderIds,a.provider),ze(c.card.logoutTargets,a.provider,a.profiles.filter(e=>e.logoutSupported===!0).map(e=>e.profileId)),c.card.apiKey??=a.apiKey,c.hasModelAuth||=le(a)||n.has(e);let l=a.usage;l&&!c.card.usage&&(c.card.usage={provider:l.providerId,displayName:a.displayName,windows:l.windows,...l.summary?{summary:l.summary}:{},...l.plan?{plan:l.plan}:{},...l.billing?.length?{billing:l.billing}:{}})}for(let e of t){e.card.profileOrderExplicitProviders=Object.keys(e.card.profileOrders).filter(e=>i.has(e));for(let t of Object.keys(e.card.profileOrders)){let n=r.get(t);n&&(e.card.profileOrders[t]=n)}}for(let n of ue(e.authStatus?.providers??[])){let e=U(t,[D(n.provider)]);e&&(e.card.auth={kind:n.status===`static`?`api-key`:n.status,...n.expiry?.label?{expiryLabel:n.expiry.label}:{}})}for(let n of e.providerUsage?.providers??[]){let e=D(n.provider);if(!e)continue;let r=U(t,[e])??W(t,e,n.displayName||F(e));r.ids.add(e),r.card.usage=n}for(let n of e.costByProvider??[]){let e=D(n.provider??``);if(!e)continue;let r=W(t,e,F(e)),i=r.card.localCost??={totalCost:0,totalTokens:0,messageCount:0};i.totalCost+=n.totals.totalCost,i.totalTokens+=n.totals.totalTokens,i.messageCount+=n.count}return t.filter(t=>t.hasModelAuth||(e.configProviderIds??[]).some(e=>D(e)===t.card.id)||!!t.card.usage||t.card.modelCount>0||!!t.catalogOutcome||t.card.checkingModels||(t.card.localCost?.totalTokens??0)>0).map(e=>{let t=n.get(e.card.id);return Object.assign({},e.card,e.catalogOutcome?{catalogStatus:e.catalogOutcome.status}:{},t===void 0?{}:{apiKeySupported:t})}).toSorted((e,t)=>e.displayName.localeCompare(t.displayName))}function Ve(e,t,n){if(e.retired||e.modelSelectionPolicy?.restricted)return{defaults:{...t,primary:e.modelSelectionPolicy?.defaultModel??``,fallbacks:[],utilityModel:null,decisionModel:null},configuredModels:e.models.filter(e=>e.manualSelectionAllowed!==!1)};let r=n??t;return{defaults:r,configuredModels:He(e.hasSnapshot?e.models:null,r)}}function G(e){return e.selectionRef===void 0?e.id.startsWith(`${e.provider}/`)?e.id:`${e.provider}/${e.id}`:e.selectionRef}function He(e,t){let n=new Set([t.primary,...t.fallbacks,t.utilityModel].filter(e=>typeof e==`string`&&e.length>0)),r=(e??[]).filter(e=>e.available!==!1||n.has(G(e))),i=new Set(r.map(G)),a=e===null?{}:{available:!1};for(let t of n){if(i.has(t))continue;let{model:n,profile:o}=O(t);if(o){let i=(e??[]).find(e=>G(e)===n);if(i){r.push({...i,selectionRef:t});continue}}let s=t.indexOf(`/`);if(s<=0||s===t.length-1){let n=t.trim().toLowerCase(),i=(e??[]).find(e=>e.alias?.trim().toLowerCase()===n||e.id.trim()===t.trim());r.push({...i??{provider:``,id:t,name:t,...a},selectionRef:t});continue}r.push({provider:t.slice(0,s),id:t.slice(s+1),name:t,...a})}return r}function Ue(e){let t=j(e?.models),n=j(t?.providers),r=j(e?.agents),i=j(r?.defaults),a=i?.model,o=j(a),s=typeof a==`string`?a:typeof o?.primary==`string`?o.primary:``,c=Array.isArray(o?.fallbacks)?o.fallbacks.filter(e=>typeof e==`string`):[];return{providerIds:Object.keys(n??{}),apiKeyProviderIds:Object.entries(n??{}).filter(([,e])=>{let t=j(e);return t?Object.hasOwn(t,`apiKey`)&&t.apiKey!=null:!1}).map(([e])=>e),providerAuthModes:Object.fromEntries(Object.entries(n??{}).flatMap(([e,t])=>{let n=j(t)?.auth;return typeof n==`string`?[[e,n]]:[]})),defaults:{primary:s,fallbacks:c,utilityModel:typeof i?.utilityModel==`string`?i.utilityModel:null,...typeof i?.decisionModel==`string`?{decisionModel:i.decisionModel}:{}}}}function We(e,t){let n=new Set(Array.from(t,D)),r=new Map;for(let t of e??[]){let e=D(t.provider);t.quickApiKeySetup&&e&&!n.has(e)&&!r.has(e)&&r.set(e,{id:e,displayName:F(e)})}return[...r.values()].toSorted((e,t)=>e.displayName.localeCompare(t.displayName))}var Ge;function K(){return(K=e((()=>{k(),L(),pe(),Ge={provider:[`auth-rejected`,`unavailable`,`ready`],profile:[`ready`,`auth-rejected`,`unavailable`]}})))()}var q,Ke;function qe(){return(qe=e((()=>{i(),q={modelSetup:{discovery:{title:`On this Gateway`,description:`Find existing connections or prepare a local model for {agent}. Using a model here changes this agent, not the global defaults.`,useForAgent:`Test & use for this agent`,connectForAgent:`Connect & use for this agent`,connectProvider:`Connect provider`,returnToModels:`Return to Models`,otherSoftware:`Other detected software`},verify:{title:`Selected model`,button:`Check model`,retry:`Try again`,checkAgain:`Check again`,checkingButton:`Checking…`,checking:`Checking — asking {modelRef} for a quick reply…`,ready:`Ready`,readyIn:`Ready · {latencyMs} ms`,providerUnavailable:`{provider} isn’t responding.`},nativeDiscovery:{title:`Discover existing conversations`,body:`Show native assistant conversations from this Gateway host in OpenClaw. This is discovery, not an import or copy.`,enable:`Show existing native conversations`,decline:`Leave unchecked to keep native session catalogs off when you connect your AI provider. Existing installations are not changed.`},success:{title:`Connection verified`,body:`OpenClaw received a real reply from {modelRef}. You can start chatting now.`,activeModel:`Active model`,latency:`Verified in {latencyMs} ms`,openChat:`Start chatting`,continueSetup:`Continue setup`,stayHere:`Stay in settings`,configuredModel:`Configured model`},utility:{role:`Setup & utility`,hint:`Helps set up OpenClaw and handles lightweight tasks. Regular chats need a primary model.`,useSetup:`Use for setup`,useUtility:`Use as utility`,ready:`Setup & utility model ready`,configured:`Setup & utility model`,verified:`OpenClaw received a real reply from {modelRef}. This model is ready for setup and lightweight tasks.`,model:`Utility model`,choosePrimary:`Choose a primary model below for regular chats. Your setup assistant remains available.`,primaryReady:`This model handles setup and lightweight tasks. Regular chats use your primary model.`,openAssistant:`Open setup assistant`,repair:`Recheck & repair`}}},Ke=Object.assign(()=>{Object.assign(r.modelSetup,q.modelSetup)},{catalog:q})})))()}function Je({providers:e,authStatus:t,allowQuickApiKey:n,manualProviders:r}){let i=new Map,a=new Set;for(let r of t?.providerCapabilities??[])if(!e||e.includes(r.provider)){for(let e of r.loginOptions??[]){let t=i.get(e.brandId);t||(t={id:e.brandId,label:``,choices:[],authProviders:[]},i.set(t.id,t)),t.label||=e.groupLabel?.trim()??``,t.authProviders.includes(r.provider)||t.authProviders.push(r.provider),a.has(e.id)||(a.add(e.id),t.choices.push(e))}if(r.quickApiKeySetup&&n){let e=r.loginOptions?.length?r.loginOptions.map(e=>e.brandId):[r.provider];for(let t of new Set(e)){let e=i.get(t)??{id:t,label:``,choices:[],authProviders:[]};e.authProviders.includes(r.provider)||e.authProviders.push(r.provider),i.set(t,{...e,apiKeyProvider:e.apiKeyProvider??r.provider})}}}if(r)for(let t of r){let n=t.brandId??t.id;if(a.has(t.id)||e&&!e.includes(n))continue;let r=i.get(n)??{id:n,label:``,choices:[],authProviders:[]};r.label||=t.groupLabel?.trim()||t.label,r.authProviders.includes(n)||r.authProviders.push(n);let o=r.choices.some(e=>e.label===t.label);r.choices.push({...t,brandId:n,kind:`setup-secret`,featured:!1,...o?{label:c(`modelSetup.manual.accessValueFor`,{provider:t.label}),hint:c(`modelSetup.manual.accessValuePlaceholder`)}:{}}),a.add(t.id),i.set(n,r)}for(let e of i.values())e.label||=F(e.id);return[...i.values()].toSorted((e,t)=>e.label.localeCompare(t.label)||e.id.localeCompare(t.id))}function Ye(){return(Ye=e((()=>{L(),n()})))()}var J;function Xe(){return(Xe=e((()=>{xe(),T(),ae(),b(),Ee(),n(),h(),a(),J=class extends t{constructor(...e){super(...e),this.client=null,this.agentId=``,this.profileId=``,this.refresh=0,this.usage=new Se(this,{args:()=>[this.client,this.agentId,this.profileId,this.refresh],task:([e,t,n],{signal:r})=>e&&t&&n?e.request(`codex.accountUsage`,{agentId:t,profileId:n},{signal:r,timeoutMs:3e4}):ye})}refreshUsage(){this.refresh+=1}render(){return this.client?x`
      <div class="model-providers__account-usage">
        <button
          class="model-providers__account-refresh"
          type="button"
          aria-label=${c(`common.refresh`)}
          title=${c(`common.refresh`)}
          ?disabled=${this.usage.status===be.PENDING}
          @click=${()=>this.refreshUsage()}
        >
          ${y.refresh}
        </button>
        ${this.usage.render({pending:()=>x`<span>${c(`common.loading`)}</span>`,complete:e=>e.providers.length===0?x`<span>${c(`modelProviders.noStats`)}</span>`:e.providers.map(e=>x`
                    ${e.plan?x`<strong>${e.plan}</strong>`:w}
                    <div>
                      ${e.windows.length||e.billing?.length?Te(e,{groupWindows:!0}):c(`modelProviders.noStats`)}
                    </div>
                  `),error:e=>x`<span class="provider-usage-error">${s(e)}</span>`})}
      </div>
    `:w}},M([E({attribute:!1})],J.prototype,`client`,void 0),M([E()],J.prototype,`agentId`,void 0),M([E()],J.prototype,`profileId`,void 0),M([re()],J.prototype,`refresh`,void 0),customElements.get(`openclaw-model-account-usage`)||customElements.define(`openclaw-model-account-usage`,J)})))()}function Ze(e){_({placement:`bottom`,message:B(e),icon:y.alertTriangle,durationMs:12e3})}function Qe(e){_({placement:`bottom`,message:[c(`modelProviders.logout.done`),e].filter(Boolean).join(` `),icon:y.check})}function $e(e){switch(e.source){case`config`:return c(`modelProviders.profiles.sourceConfig`);case`external`:return e.displayName||c(`modelProviders.profiles.sourceExternal`);case`inherited`:return c(`modelProviders.profiles.sourceInherited`);case`saved`:return c(`modelProviders.profiles.sourceSaved`);default:return}}function Y(e){if(e.apiKey?.source===`config`)return c(`modelProviders.credentials.configKey`);if(e.apiKey?.source===`env`)return e.apiKey.envVar?c(`modelProviders.credentials.envKeyNamed`,{name:e.apiKey.envVar}):c(`modelProviders.credentials.envKey`)}function et(e){return c(e===`auth-config`?`modelProviders.profiles.priorityManagedByAuth`:`modelProviders.profiles.priorityManagedByProvider`)}function tt(e){let t=[],n=$e(e);return n&&e.source!==`saved`&&t.push(n),e.email&&e.displayName&&e.displayName!==n&&t.push(e.displayName),e.lastUsedAt&&t.push(c(`modelProviders.profiles.lastUsed`,{time:ve(Date.now()-e.lastUsedAt)})),t.join(` · `)}function nt(e){let t=(e.split(`@`)[0]??``).split(/[^a-z0-9]+/iu).filter(Boolean);return(t.length>1?`${t[0]?.[0]??``}${t.at(-1)?.[0]??``}`:t[0]?.slice(0,2)??``).toLocaleUpperCase()||`?`}function rt(e,t){switch(e.externallyManaged&&(e.status===`expired`||e.status===`expiring`)?`ok`:e.status){case`ok`:return P({kind:t?`muted`:`ok`,label:c(t?`modelProviders.status.configured`:`modelProviders.status.ok`)});case`static`:return P({kind:`ok`,label:c(`modelProviders.status.configured`)});case`expiring`:return P({kind:`warn`,label:c(`modelProviders.status.expiring`)});case`expired`:return P({kind:`danger`,label:c(`modelProviders.status.expired`)});default:return P({kind:`muted`,label:c(`modelProviders.status.missing`)})}}function it(e,t){return e.profiles.filter(n=>(e.profileProviderIds[n.profileId]??e.id)===t)}function at(e,t){return e.logoutTargets.find(e=>e.profileIds.includes(t))?.provider}function ot(e,t){let n=new Set(e.map(e=>e.profileId));return[...t.filter(e=>n.delete(e)),...e.flatMap(e=>n.delete(e.profileId)?[e.profileId]:[])]}function st(e,t){if(e.length!==t.length)return!1;let n=new Set(e.map(e=>e.profileId));return n.size===e.length&&t.every(e=>n.delete(e))}function ct(e,t){return[...new Set(e.profiles.map(t=>e.profileProviderIds[t.profileId]??e.id))].map(n=>{let r=it(e,n),i=t[n]??e.profileOrders[n]??[],a=e.profileOrderLocks[n],o=st(r,i),s=e.profileOrderStoredProviders.includes(n),l=t[n]!==void 0||e.profileOrderExplicitProviders.includes(n),u=a?et(a):o?void 0:c(s?`modelProviders.profiles.partialStoredOrder`:`modelProviders.profiles.partialOrder`),d=new Map(r.map(e=>[e.profileId,e]));return{provider:n,order:i,lock:a,complete:o,stored:s,explicit:l,explanation:u,profiles:ot(r,i).flatMap(e=>{let t=d.get(e);return t?[t]:[]})}})}function lt(e){e.classList.remove(Z);for(let t of e.querySelectorAll(`.model-providers__profile`))t.classList.remove(X),t.style.removeProperty(`translate`)}function ut(e){if(!e.canMove||e.event.button!==0)return;let t=e.event.currentTarget;if(!(t instanceof HTMLElement))return;let n=t.closest(`.model-providers__profile`),r=t.closest(`.model-providers__profiles`);if(!n||!r)return;let i=r.getBoundingClientRect().top,a=[...r.querySelectorAll(`.model-providers__profile`)].filter(t=>t.dataset.profileProvider===e.provider).map(e=>({element:e,bounds:e.getBoundingClientRect()})),o=a.find(e=>e.element===n);if(!o)return;let s=a.filter(e=>e!==o),c,l=`before`;e.event.preventDefault(),r.classList.add(Z),n.classList.add(X);try{t.setPointerCapture?.(e.event.pointerId)}catch{}let u=t=>{if(t.pointerId!==e.event.pointerId)return;let u=i-r.getBoundingClientRect().top,d=t.clientY-e.event.clientY+u;n.style.translate=`${t.clientX-e.event.clientX}px ${d}px`;let f=document.elementFromPoint(t.clientX,t.clientY),p=f?.closest(`.model-providers__profile`),m=t.clientY+u,h=f&&r.contains(f)&&(!p||p.dataset.profileProvider===e.provider)&&a.some(({bounds:e})=>t.clientX>=e.left&&t.clientX<=e.right&&m>=e.top&&m<=e.bottom),g=(d>0?o.bounds.bottom:o.bounds.top)+d;c=h?s.find(({bounds:e})=>g<e.top+e.height/2):void 0,l=c?`before`:`after`,h&&!c&&(c=s.at(-1));let _=c?fe(a,o,c,l):a;_.indexOf(o)===a.indexOf(o)&&(c=void 0);let v=a[0]?.bounds.top??0;for(let e of _)e!==o&&(e.element.style.translate=`0px ${v-e.bounds.top}px`),v+=e.bounds.height},d=(n,i)=>{if(n.pointerId!==e.event.pointerId)return;u(n);let a=c?.element.dataset.profileId;lt(r),t.removeEventListener(`pointermove`,u),t.removeEventListener(`pointerup`,f),t.removeEventListener(`pointercancel`,p),t.removeEventListener(`lostpointercapture`,p),document.removeEventListener(`keydown`,m,!0);try{t.releasePointerCapture?.(e.event.pointerId)}catch{}i&&a&&e.move(a,l)},f=e=>d(e,!0),p=e=>d(e,!1),m=t=>{t.key===`Escape`&&(t.preventDefault(),t.stopPropagation(),d(e.event,!1))};t.addEventListener(`pointermove`,u),t.addEventListener(`pointerup`,f),t.addEventListener(`pointercancel`,p),t.addEventListener(`lostpointercapture`,p),document.addEventListener(`keydown`,m,!0)}function dt(e,t){return e.email||e.displayName||c(`modelProviders.profiles.account`,{number:String(t+1)})}function ft(e,t,n){let r=tt(e);return x`
    <span class="model-providers__profile-avatar" aria-hidden="true"
      >${nt(t)}</span
    >
    <div class="model-providers__profile-copy">
      <strong>${t}</strong>
      ${r?x`<span>${r}</span>`:w}
      ${n?x`<details>
              <summary>${c(`modelProviders.profiles.details`)}</summary>
              <div>${e.profileId}</div>
              ${e.expiry?x`<span>${c(`modelProviders.expiresIn`,{time:e.expiry.label})}</span>`:w}
            </details>`:w}
    </div>
  `}function pt(e,t){let n=e.flatMap(e=>e.profiles.map(n=>({profile:n,authRejected:e.catalogStatus===`auth-rejected`,canUse:e.profileProviderIds[n.profileId]===t?.authProvider&&(n.source===`saved`||n.source===`inherited`)}))),r=[...new Set(e.map(Y).filter(Boolean))];return x`
    <section
      class="model-provider-login__accounts"
      aria-label=${c(`modelProviders.login.accounts`)}
    >
      <h3>${c(`modelProviders.login.accounts`)}</h3>
      ${n.length?x`
              <div role="list">
                ${n.map(({profile:e,authRejected:n,canUse:r},i)=>x`
                    <div
                      class="model-provider-login__account"
                      role="listitem"
                      data-profile-id=${e.profileId}
                    >
                      ${ft(e,dt(e,i),!1)}
                      ${rt(e,n)}
                      ${r&&t?x`<button
                              class="btn"
                              data-models-use-account
                              ?disabled=${t.disabled}
                              @click=${()=>t.onUse(e.profileId)}
                            >
                              ${c(`modelProviders.login.useAccount`)}
                            </button>`:w}
                    </div>
                  `)}
              </div>
            `:w}
      ${r.map(e=>x`<p class="muted">${e}</p>`)}
      ${!n.length&&!r.length?x`<p class="muted">${c(`modelProviders.login.noAccounts`)}</p>`:w}
    </section>
  `}function mt(e,t){if(e.profiles.length===0)return w;let n=ct(e,t.profileOrders),r=new Map(e.profiles.map((e,t)=>[e.profileId,dt(e,t)])),i=n.flatMap(e=>e.profiles.map(t=>({group:e,profile:t}))),a=n.some(e=>!e.lock&&e.complete&&e.order.length>1),o=[...new Set(n.flatMap(e=>e.explanation?[e.explanation]:[]))],s=Y(e);return x`
    <section
      class="model-providers__profiles"
      aria-label=${`${c(`modelProviders.profiles.title`)}: ${e.displayName}`}
    >
      <div class="model-providers__profiles-heading">
        <div class="model-providers__profiles-heading-copy">
          <strong>${c(`modelProviders.profiles.title`)}</strong>
          <span
            >${c(i.length===1?`modelProviders.profiles.accountOne`:`modelProviders.profiles.accounts`,{count:String(i.length)})}${s?` · ${s}`:``}</span
          >
          ${a?x`<span>${c(`modelProviders.profiles.reorderHint`)}</span>`:w}
          ${o.map(e=>x`<span>${e}</span>`)}
        </div>
        <div class="model-providers__profiles-heading-actions">
          ${e.profileOrderStoredProviders.map(n=>x`<button
              type="button"
              class="btn btn--sm btn--ghost"
              ?disabled=${!t.canMutate}
              title=${t.canMutate?c(`modelProviders.profiles.resetOrderHint`):t.mutationBlockedReason??``}
              @click=${()=>t.onProfileOrderChange(e.id,n,null)}
            >
              ${c(`modelProviders.profiles.resetOrder`)}
            </button>`)}
          ${t.onAddAccount?x`<button
                  type="button"
                  class="btn btn--sm"
                  ?disabled=${t.addAccountDisabled}
                  @click=${t.onAddAccount}
                >
                  ${c(`modelProviders.profiles.addAccount`)}
                </button>`:w}
        </div>
      </div>
      <div class="model-providers__profile-list" role="list">
        ${ne(i,({profile:e})=>e.profileId,({profile:n,group:i})=>{let{provider:a,order:o,complete:s,lock:l,stored:u,explicit:d}=i,f=o.indexOf(n.profileId),p=t.canMutate&&!l&&s&&o.length>1&&f>=0,m=!l&&(s||u)&&o.length>1,h=r.get(n.profileId),g=at(e,n.profileId),_=c(`modelProviders.logout.actionFor`,{account:h}),v=t.canMutate?_:t.mutationBlockedReason??``,ee=t.canMutate?i.explanation??``:t.mutationBlockedReason??``,b=(r,i)=>{p&&t.onProfileOrderChange(e.id,a,fe(o,n.profileId,r,i))},S=(e,t)=>{let n=o[f+t];if(!p||!n)return;let r=e.currentTarget,i=r instanceof HTMLButtonElement&&document.activeElement===r;b(n,t<0?`before`:`after`),i&&queueMicrotask(()=>{r.isConnected&&document.activeElement===document.body&&r.focus({preventScroll:!0})})};return x`
              <div
                class="model-providers__profile"
                role="listitem"
                data-profile-id=${n.profileId}
                data-profile-provider=${a}
              >
                <span class="model-providers__profile-order">
                  ${m?x`<button
                          type="button"
                          class="model-providers__profile-grip"
                          ?disabled=${!p}
                          aria-label=${c(`modelProviders.profiles.reorder`,{account:h,position:String(f+1)})}
                          aria-keyshortcuts=${p?`ArrowUp ArrowDown`:w}
                          title=${ee||c(`modelProviders.profiles.reorderHint`)}
                          @pointerdown=${e=>ut({event:e,canMove:p,provider:a,move:b})}
                          @keydown=${e=>{(e.key===`ArrowUp`||e.key===`ArrowDown`)&&(e.preventDefault(),S(e,e.key===`ArrowUp`?-1:1))}}
                        >
                          ${y.gripVertical}
                        </button>`:x`<span aria-hidden="true"></span>`}
                  ${d&&s&&f>=0?x`<span
                          class="model-providers__profile-position"
                          aria-label=${c(`modelProviders.profiles.priority`,{position:String(f+1)})}
                          title=${c(`modelProviders.profiles.priority`,{position:String(f+1)})}
                          >${f+1}</span
                        >`:w}
                </span>
                ${ft(n,h,!0)}
                ${a===`openai`&&n.type!==`api_key`?x`<openclaw-model-account-usage
                        .client=${t.usageClient??null}
                        .agentId=${t.usageAgentId??``}
                        .profileId=${n.profileId}
                      ></openclaw-model-account-usage>`:w}
                <span class="model-providers__profile-status"
                  >${rt(n,e.catalogStatus===`auth-rejected`)}</span
                >
                <span class="model-providers__profile-actions">
                  ${n.logoutSupported===!0&&g?x`<button
                          type="button"
                          class="model-providers__profile-logout"
                          aria-label=${_}
                          title=${v}
                          ?disabled=${!t.canMutate||t.busy[`logout:${e.id}`]}
                          @click=${()=>t.onRequestLogout({cardId:e.id,label:h,target:{provider:g,profileIds:[n.profileId]}})}
                        >
                          ${ht}
                        </button>`:w}
                </span>
              </div>
            `})}
      </div>
    </section>
  `}var X,Z,ht;function Q(){return(Q=e((()=>{T(),Xe(),ie(),ee(),b(),N(),n(),z(),ce(),u(),H(),R(),X=`model-providers__profile--dragging`,Z=`model-providers__profiles--sorting`,ht=v(oe` <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
  <polyline points="16 17 21 12 16 7" />
  <line x1="21" x2="9" y1="12" y2="12" />`)})))()}function gt(){return(gt=e((()=>{})))()}var _t;function vt(){return(vt=e((()=>{k(),T(),te(),L(),Ce(),n(),z(),f(),d(),_e(),h(),l(),pe(),K(),Ye(),Q(),R(),_t=class{constructor(e,t){this.host=e,this.options=t,this.picker=null,this.searchInput=C(),this.methodChoices=C(),this.focusPicker=null,this.generation=0,this.mutationActive=!1,this.refreshWarning=null,this.mode=`auth`,e.addController(this),this.wizard=new we(e,{getClient:()=>t.getScope().context.gateway.snapshot.client,getAgentId:()=>t.getScope().agentId,onClose:()=>this.reset(),onAnswer:(e,t)=>void this.run(()=>this.runner.answer(e,t)),onBackgroundCompletion:e=>this.run(()=>Promise.resolve(e),!0),requestFailedMessage:()=>c(`modelProviders.requestFailed`),sessionExpiredMessage:()=>c(`modelProviders.login.sessionExpired`)}),this.runner=this.wizard.runner}get busy(){return this.picker!==null||this.mutationActive||this.wizard.cancelling||this.runner.state.phase!==`idle`}get providerActions(){return{canMutate:this.options.canStart(),loginBusy:this.busy,onConnect:e=>this.open([e.id,...e.credentialProviderIds]),canConnect:e=>this.loginProviders([e.id,...e.credentialProviderIds]).length>0}}get pageActions(){return{selectedAgentId:this.options.getScope().agentId,onConnect:()=>this.open(),connectDisabled:!this.options.canStart()||this.busy,login:this.render(),loginMessage:this.message}}selectedModel(){let{context:e,agentId:t}=this.options.getScope(),{entry:n,defaults:r}=p(m(e.runtimeConfig.state),t??``);return o(n?.model)??o(r?.model)}missingSelection(){let e=this.selectedModel(),{authStatus:t}=this.options.getScope();if(!e||!t?.ts||t.unavailable)return null;let{model:n,profile:r}=O(e),i=n.indexOf(`/`);if(!r||i<1||t.providers.some(e=>e.profiles.some(e=>e.profileId===r)))return null;let a=A(n.slice(0,i)),o=t.providers.find(e=>A(e.provider)===a)?.authProvider??a;return{model:n,provider:D(a),authProvider:o}}renderRecovery(){let e=this.missingSelection(),t=this.options.getScope().authStatus?.providerCapabilities?.filter(t=>D(t.provider)===e?.provider).map(e=>e.provider);return e?x`<div class="callout warning" role="status" data-models-account-recovery>
          <p>${c(`modelProviders.login.missingSelection`,{model:e.model})}</p>
          <button
            class="btn"
            data-models-recover-account
            ?disabled=${!this.options.canStart()||this.busy}
            @click=${()=>void this.open(t)}
          >
            ${c(`modelProviders.login.chooseAccount`)}
          </button>
        </div>`:w}async activateSavedProfile(e,t){let n=this.selectedModel();if(!this.options.canStart()||this.mutationActive||this.missingSelection()?.model!==t)return;this.picker=null,this.mode=`activate`,this.message=void 0,this.refreshWarning=null;let r=`saved-auth:${encodeURIComponent(e)}`;await this.run(()=>{if(this.selectedModel()!==n)throw Error(c(`modelProviders.login.selectionChanged`));return this.runner.activate({kind:r,modelRef:t},e)})}loginProviders(e,t=this.options.getScope().authStatus){return Je({providers:e,authStatus:t,allowQuickApiKey:!!this.options.onApiKey,manualProviders:this.options.onManualProvider?this.options.getManualProviders?.():void 0})}async open(e,t){if(!this.options.canStart()||this.busy)return;let n=this.options.getScope(),{client:r,hello:i}=n.context.gateway.snapshot;if(!r||!n.agentId)return;let a=++this.generation,o=new AbortController;this.inventoryRequest=o;let l=()=>{let e=this.options.getScope();return a===this.generation&&e.context.gateway.snapshot.client===r&&e.context.gateway.snapshot.hello===i&&e.agentId===n.agentId&&this.options.canContinue()};this.picker={phase:`loading`,providers:e,providerId:``,query:``,isCurrent:l},this.focusPicker=null,this.message=void 0,this.host.requestUpdate();try{let i=n.authStatus??await de(r,{agentId:n.agentId,signal:o.signal});if(l()){let r=this.loginProviders(e,i),a=t?r.find(e=>e.choices.some(e=>e.id===t)):e&&r.length===1?r[0]:void 0;this.picker={phase:`ready`,providers:e,authStatus:i,providerId:a?.id??``,query:``,isCurrent:l},n.authStatus||(this.focusPicker=a?`method`:`search`)}}catch(t){l()&&(this.picker={phase:`error`,isCurrent:l,providers:e,providerId:``,query:``,message:s(t,c(`modelProviders.requestFailed`))})}finally{a===this.generation&&(this.inventoryRequest=void 0,l()||(this.picker=null),this.host.requestUpdate())}}reset(){this.generation+=1,this.inventoryRequest?.abort(),this.inventoryRequest=void 0,this.picker=null,this.focusPicker=null,this.mutationActive=!1,this.refreshWarning=null,this.message=void 0,this.mode=`auth`,this.wizard.reset()}hostDisconnected(){this.reset()}hostUpdated(){if(!this.focusPicker||!this.picker)return;let e=this.methodChoices.value,t=this.focusPicker===`search`?this.searchInput.value:e?.querySelector(`button`)??e;this.focusPicker=null,t?.focus({preventScroll:!0})}render(){let e=this.picker;if(e){let t=()=>this.picker===e&&e.phase===`ready`&&e.isCurrent(),n=e.phase===`ready`?this.loginProviders(e.providers,e.authStatus):[],r=n.find(t=>t.id===e.providerId),i=r&&e.phase===`ready`?Be({authStatus:e.authStatus,models:null,providerUsage:null,costByProvider:null}).filter(e=>r.authProviders.some(t=>e.id===D(t))):[],a=r?.choices.find(e=>e.docsUrl)?.docsUrl??`https://docs.openclaw.ai/concepts/model-providers`,o=this.missingSelection(),s=o&&i.some(e=>e.id===o.provider)?o:null,l=e.query.trim().toLocaleLowerCase(),u=n.filter(e=>[e.id,e.label,...e.apiKeyProvider?[c(`modelProviders.status.apiKey`)]:[],...e.choices.flatMap(e=>[e.label,e.hint??``])].some(e=>e.toLocaleLowerCase().includes(l)));return x`
        <openclaw-modal-dialog
          label=${r?.label??c(`modelProviders.login.title`)}
          @modal-cancel=${()=>this.reset()}
        >
          <div class="model-setup-wizard model-provider-login">
            <div class="model-setup-wizard__header">
              <h2 class="model-provider-login__provider">
                ${r?x`${I(r.id,{className:`model-providers__icon`})} ${r.label}`:c(`modelProviders.login.title`)}
              </h2>
            </div>
            <div class="model-setup-wizard__body">
              <p>
                ${s?c(`modelProviders.login.useAccountDescription`,{model:s.model}):this.options.onManualProvider?c(`modelProviders.login.setupDescription`):c(`modelProviders.login.description`)}
              </p>
              ${e.phase===`loading`?x`<div role="status">${c(`common.loading`)}</div>`:e.phase===`error`?x`<div role="alert">${e.message}</div>`:r?x`
                          ${e.phase===`ready`&&e.authStatus.unavailable?x`<p role="status">${e.authStatus.unavailable.message}</p>`:pt(i,s?{authProvider:s.authProvider,disabled:!e.isCurrent()||!this.options.canStart(),onUse:t=>{this.picker===e&&e.isCurrent()&&this.activateSavedProfile(t,s.model)}}:void 0)}
                          <section class="model-provider-login__methods" ${S(this.methodChoices)}>
                            <h3>${c(`modelProviders.login.connectAccount`)}</h3>
                            <div data-models-login-choice>
                              ${r.choices.map(n=>x`
                                  <button
                                    type="button"
                                    class="btn model-provider-login__option"
                                    ?disabled=${e.phase!==`ready`||!e.isCurrent()}
                                    @click=${()=>{if(t()){if(n.kind===`setup-secret`){this.reset(),this.options.onManualProvider?.(n.id);return}this.picker=null,this.mode=`auth`,this.refreshWarning=null,this.runner.prepareSignIn(n.kind,n.label),this.run(()=>this.runner.start(n.id,`models.authLogin`))}}}
                                  >
                                    <span class="model-provider-login__copy">
                                      <strong>${n.label}</strong>
                                      ${n.hint?x`<span>${n.hint}</span>`:w}
                                    </span>
                                  </button>
                                `)}
                            </div>
                            ${r.apiKeyProvider?x`
                                    <button
                                      type="button"
                                      class="btn model-provider-login__option"
                                      data-models-login-api-key
                                      ?disabled=${e.phase!==`ready`||!e.isCurrent()}
                                      @click=${()=>{t()&&r.apiKeyProvider&&(this.reset(),this.options.onApiKey?.(r.apiKeyProvider))}}
                                    >
                                      <span class="model-provider-login__copy">
                                        <strong>${c(`modelProviders.status.apiKey`)}</strong>
                                        <span>${c(`modelProviders.login.apiKeyHint`)}</span>
                                      </span>
                                    </button>
                                  `:w}
                            <a
                              class="learn-more-link"
                              href=${a}
                              target=${he}
                              rel=${me()}
                              >${c(`modelProviders.login.compareMethods`)}</a
                            >
                          </section>
                        `:x`
                          <label class="field">
                            <span>${c(`modelProviders.search`)}</span>
                            <input
                              type="search"
                              data-models-login-search
                              autofocus
                              autocomplete="off"
                              ${S(this.searchInput)}
                              .value=${e.query}
                              @input=${t=>{e.query=t.currentTarget.value,this.host.requestUpdate()}}
                            />
                          </label>
                          <ul
                            class="model-provider-login__providers"
                            aria-label=${c(`modelSetup.manual.provider`)}
                          >
                            ${u.map(n=>x`
                                <li>
                                  <button
                                    type="button"
                                    class="btn model-provider-login__option"
                                    data-models-login-provider=${n.id}
                                    ?disabled=${e.phase!==`ready`||!e.isCurrent()}
                                    @click=${()=>{t()&&(e.providerId=n.id,this.focusPicker=`method`,this.host.requestUpdate())}}
                                  >
                                    ${I(n.id,{className:`model-providers__icon`})}
                                    <span class="model-provider-login__copy">
                                      <strong>${n.label}</strong>
                                      <span>
                                        ${[...n.choices.map(e=>e.label),...n.apiKeyProvider?[c(`modelProviders.status.apiKey`)]:[]].join(` · `)}
                                      </span>
                                    </span>
                                  </button>
                                </li>
                              `)}
                          </ul>
                          ${u.length?w:x`
                                  <p class="muted" role="status">
                                    ${c(l?`modelProviders.noMatches`:`modelProviders.login.noProviders`)}
                                  </p>
                                `}
                        `}
            </div>
            <div class="model-setup-wizard__footer">
              ${r?x`
                      <button
                        class="btn model-provider-login__secondary"
                        data-models-login-back
                        @click=${()=>{t()&&(e.providers=void 0,e.providerId=``,this.focusPicker=`search`,this.host.requestUpdate())}}
                      >
                        ${c(`common.back`)}
                      </button>
                    `:!e.providers&&this.options.onDiscover?x`
                        <button
                          class="btn model-provider-login__secondary"
                          data-models-login-discover
                          ?disabled=${!e.isCurrent()}
                          @click=${()=>{this.picker===e&&e.isCurrent()&&(this.reset(),this.options.onDiscover?.())}}
                        >
                          ${c(`modelProviders.login.discover`)}
                        </button>
                      `:w}
              <button class="btn" @click=${()=>this.reset()}>${c(`common.cancel`)}</button>
            </div>
          </div>
        </openclaw-modal-dialog>
      `}return this.wizard.render({mode:this.mode,busy:this.mutationActive,refreshWarning:this.refreshWarning})}async complete(e){let t=e.startMethod===`openclaw.setup.activate.start`;if(t&&!e.modelActivation){this.runner.fail(c(`modelSetup.errors.activationFailed`));return}let n=this.runner.state.authLabel;this.runner.close(),this.message={kind:`success`,text:t?c(`modelProviders.login.activated`):[n,c(`modelProviders.login.done`)].filter(Boolean).join(`: `),warning:[e.modelActivation?.gatewayRestartRequired?c(`labsPage.restartRequired`):null,this.refreshWarning].filter(Boolean).join(`
`)||void 0},this.host.requestUpdate(),await this.options.refresh()}async run(e,t=!1){let n=this.options.getScope().context.gateway.snapshot.client;if(!n||this.mutationActive&&!t||!this.options.canContinue())return;let r=++this.generation;this.mutationActive=!0,this.host.requestUpdate();try{let t=await this.options.getScope().context.runtimeConfig.runExternalMutation(async t=>{if(t!==n)throw Error(c(`modelProviders.requestFailed`));let r=await e();return r&&g(t),r},{canDispatch:()=>r===this.generation&&this.options.getScope().context.gateway.snapshot.client===n&&this.options.canContinue(),dispatchError:c(`modelProviders.requestFailed`)});if(r!==this.generation)return;if(!t.ok){this.runner.fail(t.error);return}this.refreshWarning=t.refresh.ok?null:t.refresh.error,t.value&&t.value.isCurrent?.()!==!1&&await this.complete(t.value)}catch(e){r===this.generation&&this.runner.fail(s(e,c(`modelProviders.requestFailed`)))}finally{r===this.generation&&(this.mutationActive=!1,this.host.requestUpdate())}}}})))()}function $(e){let t=e.auth;if(!t)return w;let n=wt[t.kind],r=c(n.labelKey),i=t.expiryLabel?c(`modelProviders.expiresIn`,{time:t.expiryLabel}):void 0;return x`
    <span title=${i??r}> ${P({kind:n.kind,label:r})} </span>
  `}function yt(e){return e.hasConfigApiKey||!!e.apiKey||e.profiles.length>0}function bt(e){return e.catalogStatus===`ready`&&e.auth?.kind!==`expired`&&e.auth?.kind!==`missing`&&e.auth?.kind!==`expiring`}function xt(e){if(e.checkingModels)return P({kind:`muted`,label:c(`chat.modelControls.checkingProviderModels`,{providers:e.displayName})});if(e.auth?.kind===`expired`||e.auth?.kind===`missing`||e.auth?.kind===`expiring`)return $(e);if(e.catalogStatus===`auth-rejected`)return P({kind:`danger`,label:c(`modelProviders.status.denied`)});if(e.catalogStatus===`unavailable`)return P({kind:`warn`,label:c(`modelProviders.status.modelsUnavailable`)});if(!yt(e))return $(e);let t=bt(e),n=t&&e.availableModelCount>0;return P({kind:n?`ok`:`muted`,label:c(n?`modelProviders.status.ready`:t?`modelProviders.status.ok`:`modelProviders.status.configured`)})}function St(e){return e?x`
    <div class="callout ${e.kind}" role=${e.kind===`error`?`alert`:`status`}>
      ${e.text}
    </div>
    ${e.warning?x`<div class="callout warning" role="status">${e.warning}</div>`:w}
  `:w}function Ct(e,t=!1){return x`<button
    class=${t?`btn primary`:`btn`}
    data-models-connect
    ?disabled=${e.connectDisabled}
    @click=${e.onConnect}
  >
    ${c(`modelProviders.login.action`)}
  </button>`}var wt;function Tt(){return(Tt=e((()=>{T(),N(),n(),se(),ge(),wt={ok:{kind:`ok`,labelKey:`modelProviders.status.ok`},expiring:{kind:`warn`,labelKey:`modelProviders.status.expiring`},expired:{kind:`danger`,labelKey:`modelProviders.status.expired`},missing:{kind:`danger`,labelKey:`modelProviders.status.missing`},"api-key":{kind:`muted`,labelKey:`modelProviders.status.apiKey`}}})))()}export{Me as A,Ie as C,De as D,Ae as E,Ne as F,V as M,Oe as N,Fe as O,Pe as P,Ve as S,H as T,Be as _,St as a,G as b,vt as c,Q as d,mt as f,Ke as g,qe as h,Ct as i,B as j,je as k,gt as l,Qe as m,bt as n,xt as o,Ze as p,Tt as r,_t as s,yt as t,Y as u,We as v,ke as w,Ue as x,K as y};
//# sourceMappingURL=view-status-C5NU-OON.js.map