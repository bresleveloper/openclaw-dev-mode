import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Gl as t,Is as n,Ls as r,Xl as i,_n as a,in as o}from"./control-ui-core-BfjCgLp6.js";import{$ as s,X as c,Y as l}from"./lit-runtime-L6OV30Vo.js";function u(e){return e?.refreshing===!0}var d,f,p;function m(){return(m=e((()=>{d=5e3,f=3,p=class{constructor(e){this.options=e,this.timer=null,this.retryInFlight=null,this.pendingIncomplete=!1,this.attempts=0,this.cycle=0,this.exhaustionReported=!1}get exhausted(){return this.exhaustionReported}observe(e,t){return this.useConnection(t),e?this.retryInFlight===null?this.timer===null?this.armRetry():`retrying`:(this.pendingIncomplete=!0,`retrying`):(this.resetCycle(),`complete`)}armRetry(){if(this.attempts>=(this.options.limit??f))return this.reportExhaustion(),`exhausted`;this.attempts+=1,this.pendingIncomplete=!1;let e=this.cycle,t=typeof this.options.retryMs==`function`?this.options.retryMs(this.attempts):this.options.retryMs??d;return this.timer=window.setTimeout(()=>{this.timer=null;let t;try{t=this.options.retry()}catch{return}if(!t)return;let n=Promise.resolve(t).then(()=>void 0,()=>void 0);this.retryInFlight=n,n.finally(()=>{this.cycle===e&&this.retryInFlight===n&&(this.retryInFlight=null,this.pendingIncomplete&&(this.pendingIncomplete=!1,this.armRetry()))})},t),`retrying`}startCycle(){this.resetCycle()}useConnection(e){e!==this.connection&&(this.connection=e,this.startCycle())}dispose(){this.resetCycle()}resetCycle(){this.cycle+=1,this.attempts=0,this.pendingIncomplete=!1,this.retryInFlight=null,this.exhaustionReported=!1,this.clear()}reportExhaustion(){this.exhaustionReported||(this.exhaustionReported=!0,this.options.onExhausted?.())}clear(){this.timer!==null&&(window.clearTimeout(this.timer),this.timer=null)}}})))()}function h(e){if(e.reason===`manual`)return`fetch`;if(!e.visible)return`defer`;if(e.interrupted)return`fetch`;let t=e.ttlMs??g;return e.lastLoadedAtMs!==null&&e.nowMs-e.lastLoadedAtMs<t?`skip`:`fetch`}var g,_;function v(){return(v=e((()=>{m(),g=3e5,_=class{constructor(e){this.options=e,this.lastLoadedAtMs=null,this.pendingAutomaticRefresh=!1,this.reloadPending=!1,this.incompleteUsageRetry=new p({retry:()=>this.requestAndWait(`poll`),retryMs:e=>5e3*2**(e-1),onExhausted:()=>this.options.onIncompleteUsageExhausted?.()})}get incompleteUsageExhausted(){return this.incompleteUsageRetry.exhausted}setLastLoadedAtMs(e,t){return this.applyLoadState(e,t?.incomplete===!0,t?.connection)}markProviderUsage(e,t,n){let r=e?.ok===!1||e?.ok===!0&&u(e.value);return this.applyLoadState(t,r,n)}resetPayload(){this.applyLoadState(null,!1),this.reloadPending=!1}dispose(){this.incompleteUsageRetry.dispose()}applyLoadState(e,t,n){let r=this.incompleteUsageRetry.observe(t,n);return this.lastLoadedAtMs=r===`complete`?e:null,r}interrupt(){this.reloadPending||=this.options.isLoading()}markLoadDeferred(){this.reloadPending=!0}beginLoad(){this.reloadPending=!1}request(e){this.requestAndWait(e)}async requestAndWait(e){if(this.options.isLoading()&&e!==`manual`){this.pendingAutomaticRefresh=!0;return}this.pendingAutomaticRefresh=!1,h({reason:e,visible:document.visibilityState===`visible`&&document.hasFocus(),interrupted:this.reloadPending,nowMs:Date.now(),lastLoadedAtMs:this.lastLoadedAtMs})===`fetch`&&(e!==`poll`&&this.incompleteUsageRetry.startCycle(),await this.options.reload(e))}flushPending(){this.pendingAutomaticRefresh&&(this.pendingAutomaticRefresh=!1,this.request(`focus`))}}})))()}function y(e){return/\b\d+(?:m|h)\b/iu.test(e)&&!/\b168h\b/iu.test(e)?0:/\b(?:week|168h)\b/iu.test(e)?1:2}function b(e){let t=new Map;for(let n of e){let e=n.groupLabel??``,r=t.get(e)??[];r.push(n),t.set(e,r)}for(let e of t.values())e.sort((e,t)=>y(e.label)-y(t.label));return t}function x(e){let t=e.trim().toUpperCase();if([`USD`,`EUR`,`GBP`,`CNY`,`JPY`].includes(t)){let e=new Intl.NumberFormat(void 0,{style:`currency`,currency:t,maximumFractionDigits:t===`JPY`?0:2});return t=>e.format(t)}let n=new Intl.NumberFormat(void 0,{maximumFractionDigits:2});return t=>`${n.format(t)} ${e}`}function S(e){return!e||!Number.isFinite(e)?null:new Intl.DateTimeFormat(void 0,{month:`short`,day:`numeric`,hour:`numeric`,minute:`2-digit`}).format(new Date(e))}function C(e){return(e.billing??[]).map(e=>{let t=e.label??(e.type===`balance`?i(`usage.providerUsage.balance`):e.type===`spend`?i(`usage.providerUsage.spend`):i(`usage.providerUsage.budget`)),n=x(e.unit),r=e.type===`budget`?`${n(e.used)} / ${n(e.limit)}`:n(e.amount);return s`
      <div class="provider-usage-billing-row">
        <span>${t}</span>
        <strong>${r}</strong>
      </div>
    `})}function w(e,t){let n=e.costHistory;if(!n)return 0;let r=new Date,i=Date.UTC(r.getUTCFullYear(),r.getUTCMonth(),r.getUTCDate()),a=i-(Math.max(1,t)-1)*864e5;return n.daily.reduce((e,t)=>{let n=Date.parse(`${t.date}T00:00:00Z`);return Number.isFinite(n)&&n>=a&&n<=i?e+t.amount:e},0)}function T(e){let t=e.costHistory;if(!t||t.daily.length===0)return c;let n=0,r=0,a={requests:0,input:0,cache:0,output:0};for(let e of t.daily)n=Math.max(n,e.amount),r+=e.amount,a.requests+=e.requests??0,a.input+=e.inputTokens,a.cache=a.cache+e.cacheReadTokens+e.cacheWriteTokens,a.output+=e.outputTokens;let l=o(a.input),u=o(a.cache),d=o(a.output),f=[[i(`usage.providerUsage.today`),w(e,1)],[i(`usage.providerUsage.last7Days`),w(e,7)],[i(`usage.providerUsage.lastDays`,{count:String(t.periodDays)}),r]],p=x(t.unit);return s`
    <div class="provider-cost-history">
      <div class="provider-cost-windows">
        ${f.map(([e,t])=>s`
            <div class="provider-cost-window">
              <span>${e}</span>
              <strong>${p(t)}</strong>
            </div>
          `)}
      </div>
      <div class="provider-cost-chart" aria-label=${i(`usage.providerUsage.dailyCost`)}>
        ${t.daily.map(e=>{let t=e.amount>0&&n>0?Math.max(3,e.amount/n*100):0,r=`${e.date}: ${p(e.amount)}`;return s`<span
            style=${`height: ${t}%`}
            title=${r}
            aria-label=${r}
          ></span>`})}
      </div>
      <div class="provider-cost-tokens">
        ${a.requests>0?s`<span
                >${i(`usage.providerUsage.requests`,{count:new Intl.NumberFormat().format(a.requests)})}</span
              >`:c}
        <span>${i(`usage.providerUsage.inputTokens`,{count:l})}</span>
        <span>${i(`usage.providerUsage.cacheTokens`,{count:u})}</span>
        <span>${i(`usage.providerUsage.outputTokens`,{count:d})}</span>
      </div>
      ${t.models.length>0||t.categories.length>0?s`
              <div class="provider-cost-breakdowns">
                ${t.models.length>0?s`
                        <div class="provider-cost-breakdown">
                          <span class="provider-cost-breakdown__title"
                            >${i(`usage.providerUsage.topModels`)}</span
                          >
                          ${t.models.slice(0,3).map(e=>s`
                                <div>
                                  <span>${e.name}</span
                                  ><strong>${o(e.totalTokens)}</strong>
                                </div>
                              `)}
                        </div>
                      `:c}
                ${t.categories.length>0?s`
                        <div class="provider-cost-breakdown">
                          <span class="provider-cost-breakdown__title"
                            >${i(`usage.providerUsage.costCategories`)}</span
                          >
                          ${t.categories.slice(0,3).map(e=>s`
                              <div>
                                <span>${e.name}</span>
                                <strong>${p(e.amount)}</strong>
                              </div>
                            `)}
                        </div>
                      `:c}
              </div>
            `:c}
    </div>
  `}function E(e){let t=Math.max(0,Math.min(100,e.usedPercent)),n=Math.max(0,100-t),r=n<=10?`danger`:n<=25?`warn`:`ok`,a=i(`usage.providerUsage.remaining`,{percent:n.toFixed(0)}),o=S(e.resetAt);return s`
    <div class="provider-usage-window">
      <div class="provider-usage-window__meta">
        <span>${e.label}</span>
        <strong>${a}</strong>
      </div>
      <div
        class=${`provider-usage-progress provider-usage-progress--${r}`}
        role="progressbar"
        aria-label=${e.label}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${n.toFixed(0)}
        aria-valuetext=${a}
      >
        <span style=${`width: ${n}%`}></span>
      </div>
      ${o?s`<div class="provider-usage-reset">
              ${i(`usage.providerUsage.resets`,{date:o})}
            </div>`:c}
    </div>
  `}function D(e,t={}){return e.error?s`<div class="provider-usage-error">${n(e.error)}</div>`:s`
    ${e.windows.length>0?t.groupWindows?s`
              <div class="provider-usage-windows provider-usage-windows--grouped">
                ${Array.from(b(e.windows),([e,t])=>s`
                    <div
                      class="provider-usage-window-group"
                      role="group"
                      aria-label=${e||c}
                    >
                      ${e?s`<div class="provider-usage-window-group__title">${e}</div>`:c}
                      <div class="provider-usage-window-group__windows">
                        ${t.map(e=>E(e))}
                      </div>
                    </div>
                  `)}
              </div>
            `:s`
              <div class="provider-usage-windows">
                ${e.windows.map(e=>E(e))}
              </div>
            `:c}
    ${e.billing&&e.billing.length>0?s`<div class="provider-usage-billing">${C(e)}</div>`:c}
    ${T(e)}
    ${e.summary?s`<div class="provider-usage-summary">${e.summary}</div>`:c}
  `}function O(){return(O=e((()=>{l(),t(),r(),a()})))()}function k(){return(k=e((()=>{})))()}export{v as a,_ as i,O as n,m as o,D as r,u as s,k as t};
//# sourceMappingURL=usage-7PaU0Vjj.js.map