import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{_ as r,f as i,g as a,h as o,m as s,p as c}from"./lit-runtime-B2f-BITn.js";import{t as l}from"./string-coerce-BuYUxt7q.js";import{i as u}from"./string-normalization-BzUT2-1w.js";import{r as d}from"./i18n-Cb2Gon67.js";import{i as f}from"./number-coercion-FQ9q6Y4E.js";import{Bn as p,Fr as m,Ht as h,Pr as g,Rn as _,Vn as v,Vt as y,dn as b,fr as x,pr as S,sr as C,ur as w,xr as ee,zn as T}from"./index-DMlQdn8s.js";function E(e,t){if(!e)return t;if(!t)return e;let n={fresh:0,partial:1,stale:2,refreshing:3};return{status:n[t.status]>n[e.status]?t.status:e.status,cachedFiles:Math.max(e.cachedFiles,t.cachedFiles),pendingFiles:Math.max(e.pendingFiles,t.pendingFiles),staleFiles:Math.max(e.staleFiles,t.staleFiles),refreshedAt:Math.max(e.refreshedAt??0,t.refreshedAt??0)||void 0}}function D(e){return!e||e.status!==`refreshing`&&e.status!==`stale`&&e.status!==`partial`?null:d(`usage.cacheStatus.title`,{status:d(`usage.cacheStatus.status.${e.status}`),pending:String(e.pendingFiles),stale:String(e.staleFiles),cached:String(e.cachedFiles)})}function O(e,t,n,r,i){if(r&&e.length>0){let r=n.indexOf(e[e.length-1]),i=n.indexOf(t);if(r!==-1&&i!==-1){let[t,a]=r<i?[r,i]:[i,r];return[...new Set([...e,...n.slice(t,a+1)])]}}return e.includes(t)?e.filter(e=>e!==t):i?[...e,t]:[t]}function k(e,t,n,r,i){if(i&&e.length>0){let i=[...n].toSorted((e,t)=>{let n=r?e.usage?.totalTokens??0:e.usage?.totalCost??0;return(r?t.usage?.totalTokens??0:t.usage?.totalCost??0)-n}).map(e=>e.key),a=i.indexOf(e[e.length-1]),o=i.indexOf(t);if(a!==-1&&o!==-1){let[t,n]=a<o?[a,o]:[o,a];return[...new Set([...e,...i.slice(t,n+1)])]}}return e.length===1&&e[0]===t?[]:[t]}var A=new Set([`agent`,`channel`,`chat`,`provider`,`model`,`tool`,`label`,`key`,`session`,`id`,`has`,`mintokens`,`maxtokens`,`mincost`,`maxcost`,`minmessages`,`maxmessages`]),j=e=>l(e),M=e=>{let t=e.replace(/[.+^${}()|[\]\\]/g,`\\$&`).replace(/\*/g,`.*`).replace(/\?/g,`.`);return RegExp(`^${t}$`,`i`)},N=e=>{let t=l(e);if(!t)return null;t.startsWith(`$`)&&(t=t.slice(1));let n=1;if(t.endsWith(`k`)?(n=1e3,t=t.slice(0,-1)):t.endsWith(`m`)&&(n=1e6,t=t.slice(0,-1)),!/^\d+(?:\.\d+)?$/.test(t))return null;let r=Number(t)*n;return!Number.isFinite(r)||!Number.isSafeInteger(Math.round(r))?null:r},P=e=>(e.match(/"[^"]+"|\S+/g)??[]).map(e=>{let t=e.replace(/^"|"$/g,``),n=t.indexOf(`:`);return n>0?{key:t.slice(0,n),value:t.slice(n+1),raw:t}:{value:t,raw:t}}),F=e=>[e.label,e.key,e.sessionId].filter(e=>!!e).map(e=>l(e)),I=e=>{let t=new Set;e.modelProvider&&t.add(l(e.modelProvider)),e.providerOverride&&t.add(l(e.providerOverride)),e.origin?.provider&&t.add(l(e.origin.provider));for(let n of e.usage?.modelUsage??[])n.provider&&t.add(l(n.provider));return Array.from(t)},L=e=>{let t=new Set;e.model&&t.add(l(e.model));for(let n of e.usage?.modelUsage??[])n.model&&t.add(l(n.model));return Array.from(t)},R=e=>(e.usage?.toolUsage?.tools??[]).map(e=>l(e.name)),z=(e,t)=>{let n=j(t.value??``);if(!n)return!0;if(!t.key)return F(e).some(e=>e.includes(n));switch(j(t.key)){case`agent`:return l(e.agentId).includes(n);case`channel`:return l(e.channel).includes(n);case`chat`:return l(e.chatType).includes(n);case`provider`:return I(e).some(e=>e.includes(n));case`model`:return L(e).some(e=>e.includes(n));case`tool`:return R(e).some(e=>e.includes(n));case`label`:return l(e.label).includes(n);case`key`:case`session`:case`id`:if(n.includes(`*`)||n.includes(`?`)){let t=M(n);return t.test(e.key)||(e.sessionId?t.test(e.sessionId):!1)}return l(e.key).includes(n)||l(e.sessionId).includes(n);case`has`:switch(n){case`tools`:return(e.usage?.toolUsage?.totalCalls??0)>0;case`errors`:return(e.usage?.messageCounts?.errors??0)>0;case`context`:return!!e.contextWeight;case`usage`:return!!e.usage;case`model`:return L(e).length>0;case`provider`:return I(e).length>0;default:return!0}case`mintokens`:{let t=N(n);return t===null?!0:(e.usage?.totalTokens??0)>=t}case`maxtokens`:{let t=N(n);return t===null?!0:(e.usage?.totalTokens??0)<=t}case`mincost`:{let t=N(n);return t===null?!0:(e.usage?.totalCost??0)>=t}case`maxcost`:{let t=N(n);return t===null?!0:(e.usage?.totalCost??0)<=t}case`minmessages`:{let t=N(n);return t===null?!0:(e.usage?.messageCounts?.total??0)>=t}case`maxmessages`:{let t=N(n);return t===null?!0:(e.usage?.messageCounts?.total??0)<=t}default:return!0}},te=(e,t)=>{let n=P(t);if(n.length===0)return{sessions:e,warnings:[]};let r=[];for(let e of n){if(!e.key)continue;let t=j(e.key);if(!A.has(t)){r.push(`Unknown filter: ${e.key}`);continue}if(e.value===``&&r.push(`Missing value for ${e.key}`),t===`has`){let t=new Set([`tools`,`errors`,`context`,`usage`,`model`,`provider`]);e.value&&!t.has(j(e.value))&&r.push(`Unknown has:${e.value}`)}[`mintokens`,`maxtokens`,`mincost`,`maxcost`,`minmessages`,`maxmessages`].includes(t)&&e.value&&N(e.value)===null&&r.push(`Invalid number for ${e.key}`)}return{sessions:e.filter(e=>n.every(t=>z(e,t))),warnings:r}};function ne(e){let t=e.split(`
`),n=new Map,r=[];for(let e of t){let t=/^\[Tool:\s*([^\]]+)\]/.exec(e.trim());if(t){let e=t[1];n.set(e,(n.get(e)??0)+1);continue}e.trim().startsWith(`[Tool Result]`)||r.push(e)}let i=Array.from(n.entries()).toSorted((e,t)=>t[1]-e[1]),a=i.reduce((e,[,t])=>e+t,0);return{tools:i,summary:i.length>0?`Tools: ${i.map(([e,t])=>`${e}×${t}`).join(`, `)} (${a} calls)`:``,cleanContent:r.join(`
`).trim()}}function re(e,t){!t||t.count<=0||(e.count+=t.count,e.sum+=t.avgMs*t.count,e.min=Math.min(e.min,t.minMs),e.max=Math.max(e.max,t.maxMs),e.p95Max=Math.max(e.p95Max,t.p95Ms))}function ie(e,t){for(let n of t??[]){let t=e.get(n.date)??{date:n.date,count:0,sum:0,min:1/0,max:0,p95Max:0};t.count+=n.count,t.sum+=n.avgMs*n.count,t.min=Math.min(t.min,n.minMs),t.max=Math.max(t.max,n.maxMs),t.p95Max=Math.max(t.p95Max,n.p95Ms),e.set(n.date,t)}}function B(e){return{byChannel:Array.from(e.byChannelMap.entries()).map(([e,t])=>({channel:e,totals:t})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),latency:e.latencyTotals.count>0?{count:e.latencyTotals.count,avgMs:e.latencyTotals.sum/e.latencyTotals.count,minMs:e.latencyTotals.min===1/0?0:e.latencyTotals.min,maxMs:e.latencyTotals.max,p95Ms:e.latencyTotals.p95Max}:void 0,dailyLatency:Array.from(e.dailyLatencyMap.values()).map(e=>({date:e.date,count:e.count,avgMs:e.count?e.sum/e.count:0,minMs:e.min===1/0?0:e.min,maxMs:e.max,p95Ms:e.p95Max})).toSorted((e,t)=>e.date.localeCompare(t.date)),modelDaily:Array.from(e.modelDailyMap.values()).toSorted((e,t)=>e.date.localeCompare(t.date)||t.cost-e.cost),daily:Array.from(e.dailyMap.values()).toSorted((e,t)=>e.date.localeCompare(t.date))}}var ae=4,V=864e5;function H(e){return Math.round(e/ae)}function U(e){return C(e,{thousandsSuffix:`K`,trimTrailingZero:!1})}function oe(e){let t=new Date;return t.setHours(e,0,0,0),t.toLocaleTimeString(void 0,{hour:`numeric`})}function se(e,t,n){let r=e.usage;if(!r)return!1;let i=r.firstActivity??e.updatedAt,a=r.lastActivity??e.updatedAt;if(!i||!a)return!1;let o=Math.min(i,a),s=Math.max(i,a),c=Math.max(s-o,1)/6e4,l=o;for(;l<s;){let e=new Date(l),i=pe(e,t),a=Math.min(i.getTime(),s),o=Math.max((a-l)/6e4,0);n({usage:r,hour:le(e,t),weekday:ue(e,t),share:o/c}),l=a+1}return!0}function ce(e,t){let n=Array.from({length:24},()=>0),r=Array.from({length:24},()=>0);for(let i of e){let e=i.usage;if(!(!e?.messageCounts||e.messageCounts.total===0)){if(e.utcQuarterHourMessageCounts&&e.utcQuarterHourMessageCounts.length>0){for(let i of e.utcQuarterHourMessageCounts){let e=fe(i.date,i.quarterIndex,t);e&&(n[e.hour]+=i.errors,r[e.hour]+=i.total)}continue}se(i,t,({hour:t,share:i})=>{n[t]+=e.messageCounts.errors*i,r[t]+=e.messageCounts.total*i})}}return r.map((e,t)=>{let r=n[t];return{hour:t,rate:e>0?r/e:0,errors:r,msgs:e}}).filter(e=>e.msgs>0&&e.errors>0).toSorted((e,t)=>t.rate-e.rate).slice(0,5).map(e=>({label:oe(e.hour),value:`${(e.rate*100).toFixed(2)}%`,sub:`${Math.round(e.errors)} ${l(d(`usage.overview.errors`))} · ${Math.round(e.msgs)} ${d(`usage.overview.messagesAbbrev`)}`}))}function le(e,t){return t===`utc`?e.getUTCHours():e.getHours()}function ue(e,t){return t===`utc`?e.getUTCDay():e.getDay()}function de(e,t){let n=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!n||!Number.isInteger(t)||t<0||t>95)return null;let[,r,i,a]=n,o=Number(r),s=Number(i),c=Number(a),l=new Date(Date.UTC(o,s-1,c,0,t*15));return Number.isNaN(l.valueOf())||l.getUTCFullYear()!==o||l.getUTCMonth()!==s-1||l.getUTCDate()!==c?null:l}function fe(e,t,n){let r=de(e,t);return r?{hour:le(r,n),weekday:ue(r,n)}:null}function pe(e,t){let n=new Date(e);return t===`utc`?n.setUTCMinutes(59,59,999):n.setMinutes(59,59,999),n}function me(e,t,n){let r=e.usage?.utcQuarterHourTokenUsage;if(!r||r.length===0)return!1;let i=!1;for(let e of r){if(e.totalTokens<=0)continue;let r=fe(e.date,e.quarterIndex,t);r&&(i=!0,n({hour:r.hour,weekday:r.weekday,tokens:e.totalTokens}))}return i}function he(e,t,n){let r=e.usage,i=r?.firstActivity??e.updatedAt,a=r?.lastActivity??e.updatedAt;if(!i||!a)return!1;let o=Math.min(i,a),s=Math.max(i,a),c=o;for(;c<=s;){let e=new Date(c),r=le(e,n);if(t.includes(r))return!0;let i=pe(e,n);c=Math.min(i.getTime(),s)+1}return!1}function ge(e,t,n){if(t.length===0)return!0;let r=!1;return me(e,n,({hour:e})=>{t.includes(e)&&(r=!0)})?r:he(e,t,n)}function _e(e,t){let n=Array.from({length:24},()=>0),r=Array.from({length:7},()=>0),i=0,a=!1;for(let o of e){let e=o.usage;if(!(!e||!e.totalTokens||e.totalTokens<=0)){if(i+=e.totalTokens,me(o,t,({hour:e,weekday:t,tokens:i})=>{n[e]+=i,r[t]+=i})){a=!0;continue}se(o,t,({usage:e,hour:t,weekday:i,share:a})=>{n[t]+=e.totalTokens*a,r[i]+=e.totalTokens*a})&&(a=!0)}}let o=[d(`usage.mosaic.sun`),d(`usage.mosaic.mon`),d(`usage.mosaic.tue`),d(`usage.mosaic.wed`),d(`usage.mosaic.thu`),d(`usage.mosaic.fri`),d(`usage.mosaic.sat`)].map((e,t)=>({label:e,tokens:r[t]}));return{hasData:a,totalTokens:i,hourTotals:n,weekdayTotals:o}}function ve(e,t,n,r){let i=_e(e,t);if(!i.hasData)return a`
      <div class="card usage-mosaic">
        <div class="usage-mosaic-header">
          <div>
            <div class="usage-mosaic-title">${d(`usage.mosaic.title`)}</div>
            <div class="usage-mosaic-sub">${d(`usage.mosaic.subtitleEmpty`)}</div>
          </div>
          <div class="usage-mosaic-total">
            ${U(0)} ${l(d(`usage.metrics.tokens`))}
          </div>
        </div>
        <div class="usage-empty-block usage-empty-block--compact">
          ${d(`usage.mosaic.noTimelineData`)}
        </div>
      </div>
    `;let o=Math.max(...i.hourTotals,1),s=Math.max(...i.weekdayTotals.map(e=>e.tokens),1);return a`
    <div class="card usage-mosaic">
      <div class="usage-mosaic-header">
        <div>
          <div class="usage-mosaic-title">${d(`usage.mosaic.title`)}</div>
          <div class="usage-mosaic-sub">
            ${d(`usage.mosaic.subtitle`,{zone:d(t===`utc`?`usage.filters.timeZoneUtc`:`usage.filters.timeZoneLocal`)})}
          </div>
        </div>
        <div class="usage-mosaic-total">
          ${U(i.totalTokens)}
          ${l(d(`usage.metrics.tokens`))}
        </div>
      </div>
      <div class="usage-mosaic-grid">
        <div class="usage-mosaic-section">
          <div class="usage-mosaic-section-title">${d(`usage.mosaic.dayOfWeek`)}</div>
          <div class="usage-daypart-grid">
            ${i.weekdayTotals.map(e=>{let t=Math.min(e.tokens/s,1);return a`
                <div class="usage-daypart-cell" style="background: ${e.tokens>0?`color-mix(in srgb, var(--accent) ${(12+t*60).toFixed(1)}%, transparent)`:`transparent`};">
                  <div class="usage-daypart-label">${e.label}</div>
                  <div class="usage-daypart-value">${U(e.tokens)}</div>
                </div>
              `})}
          </div>
        </div>
        <div class="usage-mosaic-section">
          <div class="usage-mosaic-section-title">
            <span>${d(`usage.filters.hours`)}</span>
            <span class="usage-mosaic-sub">0 → 23</span>
          </div>
          <div class="usage-hour-grid">
            ${i.hourTotals.map((e,t)=>{let i=Math.min(e/o,1),s=e>0?`color-mix(in srgb, var(--accent) ${(8+i*70).toFixed(1)}%, transparent)`:`transparent`,c=`${t}:00 · ${U(e)} ${l(d(`usage.metrics.tokens`))}`,u=i>.7?`color-mix(in srgb, var(--accent) 60%, transparent)`:`color-mix(in srgb, var(--accent) 24%, transparent)`;return a`
                <div
                  class="usage-hour-cell ${n.includes(t)?`selected`:``}"
                  style="background: ${s}; border-color: ${u};"
                  title="${c}"
                  @click=${e=>r(t,e.shiftKey)}
                ></div>
              `})}
          </div>
          <div class="usage-hour-labels">
            <span>${d(`usage.mosaic.midnight`)}</span>
            <span>${d(`usage.mosaic.fourAm`)}</span>
            <span>${d(`usage.mosaic.eightAm`)}</span>
            <span>${d(`usage.mosaic.noon`)}</span>
            <span>${d(`usage.mosaic.fourPm`)}</span>
            <span>${d(`usage.mosaic.eightPm`)}</span>
          </div>
          <div class="usage-hour-legend">
            <span></span>
            ${d(`usage.mosaic.legend`)}
          </div>
        </div>
      </div>
    </div>
  `}function W(e,t=2){return`$${e.toFixed(t)}`}function ye(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function be(e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!t)return null;let[,n,r,i]=t,a=Number(n),o=Number(r)-1,s=Number(i),c=new Date(a,o,s);return Number.isNaN(c.valueOf())||c.getFullYear()!==a||c.getMonth()!==o||c.getDate()!==s?null:c}function xe(e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!t)return null;let n=Number(t[1]),r=Number(t[2]),i=Number(t[3]),a=Date.UTC(n,r-1,i),o=new Date(a);return o.getUTCFullYear()!==n||o.getUTCMonth()!==r-1||o.getUTCDate()!==i?null:a/V}function Se(e){return new Date(e*V).toISOString().slice(0,10)}function Ce(e){let t=be(e);return t?t.toLocaleDateString(void 0,{month:`short`,day:`numeric`}):e}function we(e){let t=be(e);return t?t.toLocaleDateString(void 0,{month:`long`,day:`numeric`,year:`numeric`}):e}var Te=()=>({input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0}),Ee=(e,t)=>{e.input+=t.input??0,e.output+=t.output??0,e.cacheRead+=t.cacheRead??0,e.cacheWrite+=t.cacheWrite??0,e.totalTokens+=t.totalTokens??0,e.totalCost+=t.totalCost??0,e.inputCost+=t.inputCost??0,e.outputCost+=t.outputCost??0,e.cacheReadCost+=t.cacheReadCost??0,e.cacheWriteCost+=t.cacheWriteCost??0,e.missingCostEntries+=t.missingCostEntries??0};function De(e,t,n){let r=xe(t),i=xe(n);if(r===null||i===null||r>i)return null;let a=Te();for(let t of e){let e=xe(t.date);e!==null&&e>=r&&e<=i&&Ee(a,t)}return{days:i-r+1,startDate:t,endDate:n,totals:a}}function Oe(e,t,n,r=[1,7,30,90]){let i=xe(t),a=xe(n);if(i===null||a===null||i>a)return[];let o=a-i+1;return Array.from(new Set(r.map(e=>Math.max(1,Math.trunc(e))))).filter(e=>e<o).toSorted((e,t)=>e-t).map(t=>De(e,Se(a-t+1),n)).filter(e=>e!==null)}var ke=(e,t)=>{if(e.length===0)return t??{messages:{total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},tools:{totalCalls:0,uniqueTools:0,tools:[]},byModel:[],byProvider:[],byAgent:[],byChannel:[],daily:[]};let n={total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},r=new Map,i=new Map,a=new Map,o=new Map,s=new Map,c=new Map,l=new Map,u=new Map,d={count:0,sum:0,min:1/0,max:0,p95Max:0};for(let t of e){let e=t.usage;if(e){if(e.messageCounts&&(n.total+=e.messageCounts.total,n.user+=e.messageCounts.user,n.assistant+=e.messageCounts.assistant,n.toolCalls+=e.messageCounts.toolCalls,n.toolResults+=e.messageCounts.toolResults,n.errors+=e.messageCounts.errors),e.toolUsage)for(let t of e.toolUsage.tools)r.set(t.name,(r.get(t.name)??0)+t.count);if(e.modelUsage)for(let t of e.modelUsage){let e=`${t.provider??`unknown`}::${t.model??`unknown`}`,n=i.get(e)??{provider:t.provider,model:t.model,count:0,totals:Te()};n.count+=t.count,Ee(n.totals,t.totals),i.set(e,n);let r=t.provider??`unknown`,o=a.get(r)??{provider:t.provider,model:void 0,count:0,totals:Te()};o.count+=t.count,Ee(o.totals,t.totals),a.set(r,o)}if(re(d,e.latency),t.agentId){let n=o.get(t.agentId)??Te();Ee(n,e),o.set(t.agentId,n)}if(t.channel){let n=s.get(t.channel)??Te();Ee(n,e),s.set(t.channel,n)}for(let t of e.dailyBreakdown??[]){let e=c.get(t.date)??{date:t.date,tokens:0,cost:0,messages:0,toolCalls:0,errors:0};e.tokens+=t.tokens,e.cost+=t.cost,c.set(t.date,e)}for(let t of e.dailyMessageCounts??[]){let e=c.get(t.date)??{date:t.date,tokens:0,cost:0,messages:0,toolCalls:0,errors:0};e.messages+=t.total,e.toolCalls+=t.toolCalls,e.errors+=t.errors,c.set(t.date,e)}ie(l,e.dailyLatency);for(let t of e.dailyModelUsage??[]){let e=`${t.date}::${t.provider??`unknown`}::${t.model??`unknown`}`,n=u.get(e)??{date:t.date,provider:t.provider,model:t.model,tokens:0,cost:0,count:0};n.tokens+=t.tokens,n.cost+=t.cost,n.count+=t.count,u.set(e,n)}}}let f=B({byChannelMap:s,latencyTotals:d,dailyLatencyMap:l,modelDailyMap:u,dailyMap:c});return{messages:n,tools:{totalCalls:Array.from(r.values()).reduce((e,t)=>e+t,0),uniqueTools:r.size,tools:Array.from(r.entries()).map(([e,t])=>({name:e,count:t})).toSorted((e,t)=>t.count-e.count)},byModel:Array.from(i.values()).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),byProvider:Array.from(a.values()).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),byAgent:Array.from(o.entries()).map(([e,t])=>({agentId:e,totals:t})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),...f}},Ae=(e,t,n)=>{let r=0,i=0;for(let t of e){let e=t.usage?.durationMs??0;e>0&&(r+=e,i+=1)}let a=i?r/i:0,o=t&&r>0?t.totalTokens/(r/6e4):void 0,s=t&&r>0?t.totalCost/(r/6e4):void 0,c=n.messages.total?n.messages.errors/n.messages.total:0,l;for(let e of n.daily){if(e.messages<=0||e.errors<=0)continue;let t={date:e.date,errors:e.errors,messages:e.messages,rate:e.errors/e.messages};(!l||t.rate>l.rate||t.rate===l.rate&&t.errors>l.errors)&&(l=t)}return{durationSumMs:r,durationCount:i,avgDurationMs:a,throughputTokensPerMin:o,throughputCostPerMin:s,errorRate:c,peakErrorDay:l}};function je(e,t,n=`text/plain`){let r=new Blob([t],{type:`${n};charset=utf-8`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=e,a.click(),URL.revokeObjectURL(i)}function Me(e){return/[",\n]/.test(e)?`"${e.replaceAll(`"`,`""`)}"`:e}function Ne(e){return e.map(e=>e==null?``:Me(String(e))).join(`,`)}var Pe=e=>{let t=[Ne([`key`,`label`,`agentId`,`channel`,`provider`,`model`,`updatedAt`,`durationMs`,`messages`,`errors`,`toolCalls`,`inputTokens`,`outputTokens`,`cacheReadTokens`,`cacheWriteTokens`,`totalTokens`,`totalCost`])];for(let n of e){let e=n.usage;t.push(Ne([n.key,n.label??``,n.agentId??``,n.channel??``,n.modelProvider??n.providerOverride??``,n.model??n.modelOverride??``,f(n.updatedAt)??``,e?.durationMs??``,e?.messageCounts?.total??``,e?.messageCounts?.errors??``,e?.messageCounts?.toolCalls??``,e?.input??``,e?.output??``,e?.cacheRead??``,e?.cacheWrite??``,e?.totalTokens??``,e?.totalCost??``]))}return t.join(`
`)},Fe=e=>{let t=[Ne([`date`,`inputTokens`,`outputTokens`,`cacheReadTokens`,`cacheWriteTokens`,`totalTokens`,`inputCost`,`outputCost`,`cacheReadCost`,`cacheWriteCost`,`totalCost`])];for(let n of e)t.push(Ne([n.date,n.input,n.output,n.cacheRead,n.cacheWrite,n.totalTokens,n.inputCost??``,n.outputCost??``,n.cacheReadCost??``,n.cacheWriteCost??``,n.totalCost]));return t.join(`
`)},Ie=(e,t,n)=>{let r=e.trim();if(!r)return[];let i=r.length?r.split(/\s+/):[],a=i.length?i[i.length-1]:``,[o,s]=a.includes(`:`)?[a.slice(0,a.indexOf(`:`)),a.slice(a.indexOf(`:`)+1)]:[``,``],c=l(o),d=l(s),f=e=>u(e.filter(e=>!!e)),p=f(t.map(e=>e.agentId)).slice(0,6),m=f(t.map(e=>e.channel)).slice(0,6),h=f([...t.map(e=>e.modelProvider),...t.map(e=>e.providerOverride),...n?.byProvider.map(e=>e.provider)??[]]).slice(0,6),g=f([...t.map(e=>e.model),...n?.byModel.map(e=>e.model)??[]]).slice(0,6),_=f(n?.tools.tools.map(e=>e.name)??[]).slice(0,6);if(!c)return[{label:`agent:`,value:`agent:`},{label:`channel:`,value:`channel:`},{label:`provider:`,value:`provider:`},{label:`model:`,value:`model:`},{label:`tool:`,value:`tool:`},{label:`has:errors`,value:`has:errors`},{label:`has:tools`,value:`has:tools`},{label:`minTokens:`,value:`minTokens:`},{label:`maxCost:`,value:`maxCost:`}];let v=[],y=(e,t)=>{for(let n of t)(!d||l(n).includes(d))&&v.push({label:`${e}:${n}`,value:`${e}:${n}`})};switch(c){case`agent`:y(`agent`,p);break;case`channel`:y(`channel`,m);break;case`provider`:y(`provider`,h);break;case`model`:y(`model`,g);break;case`tool`:y(`tool`,_);break;case`has`:[`errors`,`tools`,`context`,`usage`,`model`,`provider`].forEach(e=>{(!d||e.includes(d))&&v.push({label:`has:${e}`,value:`has:${e}`})});break;default:break}return v},Le=(e,t)=>{let n=e.trim();if(!n)return`${t} `;let r=n.split(/\s+/);return r[r.length-1]=t,`${r.join(` `)} `},G=e=>l(e),Re=(e,t)=>{let n=e.trim();if(!n)return`${t} `;let r=n.split(/\s+/),i=r[r.length-1]??``,a=t.includes(`:`)?t.split(`:`)[0]:null,o=i.includes(`:`)?i.split(`:`)[0]:null;return i.endsWith(`:`)&&a&&o===a?(r[r.length-1]=t,`${r.join(` `)} `):r.includes(t)?`${r.join(` `)} `:`${r.join(` `)} ${t} `},ze=(e,t)=>{let n=e.trim().split(/\s+/).filter(Boolean).filter(e=>e!==t);return n.length?`${n.join(` `)} `:``},Be=(e,t,n)=>{let r=G(t),i=[...P(e).filter(e=>G(e.key??``)!==r).map(e=>e.raw),...n.map(e=>`${t}:${e}`)];return i.length?`${i.join(` `)} `:``};function K(e,t){return t===0?0:e/t*100}function q(e){let t=Math.abs(e);return W(e,t===0||t>=.01?2:t>=1e-4?4:6)}function Ve(e,t,n){e.key!==`Enter`&&e.key!==` `||(e.preventDefault(),n(t,e.shiftKey))}function He(e){let t=e.totalCost||0;return{input:{tokens:e.input,cost:e.inputCost||0,pct:K(e.inputCost||0,t)},output:{tokens:e.output,cost:e.outputCost||0,pct:K(e.outputCost||0,t)},cacheRead:{tokens:e.cacheRead,cost:e.cacheReadCost||0,pct:K(e.cacheReadCost||0,t)},cacheWrite:{tokens:e.cacheWrite,cost:e.cacheWriteCost||0,pct:K(e.cacheWriteCost||0,t)},totalCost:t}}function Ue(e,t,n,r,i,s,c,l){if(!(e.length>0||t.length>0||n.length>0))return o;let u=n.length===1?r.find(e=>e.key===n[0]):null,f=u?b(u.label||u.key,20)+((u.label||u.key).length>20?`…`:``):n.length===1?n[0].slice(0,8)+`…`:d(`usage.filters.sessionsCount`,{count:String(n.length)}),p=u?u.label||u.key:n.length===1?n[0]:n.join(`, `),m=e.length===1?e[0]:d(`usage.filters.daysCount`,{count:String(e.length)}),h=t.length===1?`${t[0]}:00`:d(`usage.filters.hoursCount`,{count:String(t.length)});return a`
    <div class="active-filters">
      ${e.length>0?a`
            <div class="filter-chip">
              <span class="filter-chip-label">${d(`usage.filters.days`)}: ${m}</span>
              <openclaw-tooltip .content=${d(`usage.filters.remove`)}>
                <button
                  class="filter-chip-remove"
                  @click=${i}
                  aria-label="Remove days filter"
                >
                  ×
                </button>
              </openclaw-tooltip>
            </div>
          `:o}
      ${t.length>0?a`
            <div class="filter-chip">
              <span class="filter-chip-label">${d(`usage.filters.hours`)}: ${h}</span>
              <openclaw-tooltip .content=${d(`usage.filters.remove`)}>
                <button
                  class="filter-chip-remove"
                  @click=${s}
                  aria-label="Remove hours filter"
                >
                  ×
                </button>
              </openclaw-tooltip>
            </div>
          `:o}
      ${n.length>0?a`
            <div class="filter-chip" title="${p}">
              <span class="filter-chip-label">${d(`usage.filters.session`)}: ${f}</span>
              <openclaw-tooltip .content=${d(`usage.filters.remove`)}>
                <button
                  class="filter-chip-remove"
                  @click=${c}
                  aria-label="Remove session filter"
                >
                  ×
                </button>
              </openclaw-tooltip>
            </div>
          `:o}
      ${(e.length>0||t.length>0)&&n.length>0?a`
            <button class="btn btn--sm" @click=${l}>
              ${d(`usage.filters.clearAll`)}
            </button>
          `:o}
    </div>
  `}function We(e,t,n){let r=De(e,t,n);if(!r||e.length===0)return o;let i=Oe(e,t,n),s=ye(new Date),c=(e,t)=>e===1?t===s?d(`usage.presets.today`):Ce(t):d(`usage.costWindows.lastDays`,{count:String(e)}),l=[{label:d(`usage.costWindows.selectedRange`),summary:r,range:!0},...i.map(e=>({label:c(e.days,e.endDate),summary:e,range:!1}))];return a`
    <section class="cost-window-analysis">
      <div class="cost-window-header">
        <div>
          <div class="card-title usage-section-title">${d(`usage.costWindows.title`)}</div>
          <div class="card-sub">
            ${d(`usage.costWindows.subtitle`,{date:we(n)})}
          </div>
        </div>
        <div class="cost-window-range-label">
          ${Ce(t)} – ${Ce(n)}
        </div>
      </div>
      <div class="cost-window-grid">
        ${l.map(({label:e,summary:t,range:n})=>{let r=t.totals.totalCost/t.days;return a`
            <div class="cost-window-card ${n?`cost-window-card--range`:``}">
              <div class="cost-window-card__label">${e}</div>
              <div class="cost-window-card__value">
                ${q(t.totals.totalCost)}
              </div>
              <div class="cost-window-card__meta">
                ${U(t.totals.totalTokens)} ${d(`usage.metrics.tokens`)} ·
                ${q(r)} ${d(`usage.costWindows.perDay`)}
              </div>
            </div>
          `})}
      </div>
    </section>
  `}function Ge(e,t,n,r,i,s){if(!e.length)return a`
      <div class="daily-chart-compact">
        <div class="card-title usage-section-title">${d(`usage.daily.title`)}</div>
        <div class="usage-empty-block">${d(`usage.empty.noData`)}</div>
      </div>
    `;let c=n===`tokens`,u=e.map(e=>c?e.totalTokens:e.totalCost),f=Math.max(...u,0),p=f>0?f:c?1:1e-4,m=u.filter(e=>e>0),h=p/(m.length>0?Math.min(...m):p)>50,g=u.map(e=>{if(e<=0)return 0;let t=h?Math.sqrt(e/p):e/p;return Math.max(6,t*200)}),_=e.length>30?12:e.length>20?18:e.length>14?24:32,v=e.length<=14,y=new Set(t);return a`
    <div class="daily-chart-compact">
      <div class="daily-chart-header">
        <div class="chart-toggle small sessions-toggle">
          <button
            class="btn btn--sm toggle-btn ${r===`total`?`active`:``}"
            @click=${()=>i(`total`)}
          >
            ${d(`usage.daily.total`)}
          </button>
          <button
            class="btn btn--sm toggle-btn ${r===`by-type`?`active`:``}"
            @click=${()=>i(`by-type`)}
          >
            ${d(`usage.daily.byType`)}
          </button>
        </div>
        <div class="card-title">
          ${d(c?`usage.daily.tokensTitle`:`usage.daily.costTitle`)}
          ${h?a`<span
                class="daily-chart-scale-badge"
                title=${d(`usage.daily.compressedScaleHint`)}
                aria-label=${d(`usage.daily.compressedScaleHint`)}
                >√</span
              >`:o}
        </div>
      </div>
      <div class="daily-chart">
        <div class="daily-chart-plot">
          <div class="daily-chart-scale" aria-hidden="true">
            ${f>0?a`
                  <span
                    >${c?U(f):q(f)}</span
                  >
                  <span
                    >${c?U(h?f/4:f/2):q(h?f/4:f/2)}</span
                  >
                  <span>${c?U(0):W(0)}</span>
                `:a`<span>${c?U(0):W(0)}</span>`}
          </div>
          <div class="daily-chart-bars" style="--bar-max-width: ${_}px">
            ${e.map((t,n)=>{let i=g[n],o=y.has(t.date),u=Ce(t.date),f=e.length>20?String(Number.parseInt(t.date.slice(8),10)):u,p=e.length>20?`daily-bar-label daily-bar-label--compact`:`daily-bar-label`,m=r===`by-type`?c?[{value:t.output,class:`output`},{value:t.input,class:`input`},{value:t.cacheWrite,class:`cache-write`},{value:t.cacheRead,class:`cache-read`}]:[{value:t.outputCost??0,class:`output`},{value:t.inputCost??0,class:`input`},{value:t.cacheWriteCost??0,class:`cache-write`},{value:t.cacheReadCost??0,class:`cache-read`}]:[],h=r===`by-type`?c?[`${d(`usage.breakdown.output`)} ${U(t.output)}`,`${d(`usage.breakdown.input`)} ${U(t.input)}`,`${d(`usage.breakdown.cacheWrite`)} ${U(t.cacheWrite)}`,`${d(`usage.breakdown.cacheRead`)} ${U(t.cacheRead)}`]:[`${d(`usage.breakdown.output`)} ${q(t.outputCost??0)}`,`${d(`usage.breakdown.input`)} ${q(t.inputCost??0)}`,`${d(`usage.breakdown.cacheWrite`)} ${q(t.cacheWriteCost??0)}`,`${d(`usage.breakdown.cacheRead`)} ${q(t.cacheReadCost??0)}`]:[],_=c?U(t.totalTokens):q(t.totalCost),b={dateLabel:we(t.date),tokensLabel:`${U(t.totalTokens)} ${l(d(`usage.metrics.tokens`))}`.trim(),costLabel:q(t.totalCost),breakdownLines:h};return a`
                <openclaw-tooltip
                  .content=${[b.dateLabel,b.tokensLabel,b.costLabel,...b.breakdownLines].join(`
`)}
                >
                  <div
                    class="daily-bar-wrapper ${o?`selected`:``}"
                    role="button"
                    tabindex="0"
                    aria-pressed=${o?`true`:`false`}
                    aria-label=${`${b.dateLabel}: ${b.tokensLabel}, ${b.costLabel}`}
                    @keydown=${e=>Ve(e,t.date,s)}
                    @click=${e=>s(t.date,e.shiftKey)}
                  >
                    ${r===`by-type`?a`
                          <div
                            class="daily-bar daily-bar--stacked"
                            style="height: ${i.toFixed(0)}px;"
                          >
                            ${(()=>{let e=m.reduce((e,t)=>e+t.value,0)||1;return m.map(t=>a`
                                  <div
                                    class="cost-segment ${t.class}"
                                    style="height: ${t.value/e*100}%"
                                  ></div>
                                `)})()}
                          </div>
                        `:a`
                          <div class="daily-bar" style="height: ${i.toFixed(0)}px"></div>
                        `}
                    ${v?a`<div class="daily-bar-total">${_}</div>`:a`<div
                          class="daily-bar-total daily-bar-total--placeholder"
                          aria-hidden="true"
                        ></div>`}
                    <div class="${p}">${f}</div>
                  </div>
                </openclaw-tooltip>
              `})}
          </div>
        </div>
      </div>
    </div>
  `}function Ke(e,t){let n=He(e),r=t===`tokens`,i=e.totalTokens||1,o={output:K(e.output,i),input:K(e.input,i),cacheWrite:K(e.cacheWrite,i),cacheRead:K(e.cacheRead,i)};return a`
    <div class="cost-breakdown cost-breakdown-compact">
      <div class="cost-breakdown-header">
        ${d(r?`usage.breakdown.tokensByType`:`usage.breakdown.costByType`)}
      </div>
      <div class="cost-breakdown-bar">
        <div
          class="cost-segment output"
          style="width: ${(r?o.output:n.output.pct).toFixed(1)}%"
          title="${d(`usage.breakdown.output`)}: ${r?U(e.output):q(n.output.cost)}"
        ></div>
        <div
          class="cost-segment input"
          style="width: ${(r?o.input:n.input.pct).toFixed(1)}%"
          title="${d(`usage.breakdown.input`)}: ${r?U(e.input):q(n.input.cost)}"
        ></div>
        <div
          class="cost-segment cache-write"
          style="width: ${(r?o.cacheWrite:n.cacheWrite.pct).toFixed(1)}%"
          title="${d(`usage.breakdown.cacheWrite`)}: ${r?U(e.cacheWrite):q(n.cacheWrite.cost)}"
        ></div>
        <div
          class="cost-segment cache-read"
          style="width: ${(r?o.cacheRead:n.cacheRead.pct).toFixed(1)}%"
          title="${d(`usage.breakdown.cacheRead`)}: ${r?U(e.cacheRead):q(n.cacheRead.cost)}"
        ></div>
      </div>
      <div class="cost-breakdown-legend">
        <span class="legend-item"
          ><span class="legend-dot output"></span>${d(`usage.breakdown.output`)}
          ${r?U(e.output):q(n.output.cost)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot input"></span>${d(`usage.breakdown.input`)}
          ${r?U(e.input):q(n.input.cost)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot cache-write"></span>${d(`usage.breakdown.cacheWrite`)}
          ${r?U(e.cacheWrite):q(n.cacheWrite.cost)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot cache-read"></span>${d(`usage.breakdown.cacheRead`)}
          ${r?U(e.cacheRead):q(n.cacheRead.cost)}</span
        >
      </div>
      <div class="cost-breakdown-total">
        ${d(`usage.breakdown.total`)}:
        ${r?U(e.totalTokens):q(e.totalCost)}
      </div>
    </div>
  `}function J(e,t,n){return a`
    <div class="usage-insight-card">
      <div class="usage-insight-title">${e}</div>
      ${t.length===0?a`<div class="muted">${n}</div>`:a`
            <div class="usage-list">
              ${t.map(e=>a`
                  <div class="usage-list-item">
                    <span>${e.label}</span>
                    <span class="usage-list-value">
                      <span>${e.value}</span>
                      ${e.sub?a`<span class="usage-list-sub">${e.sub}</span>`:o}
                    </span>
                  </div>
                `)}
            </div>
          `}
    </div>
  `}function qe(e,t,n,r){let i=[`usage-insight-card`,r?.className].filter(Boolean).join(` `),s=[`usage-error-list`,r?.listClassName].filter(Boolean).join(` `);return a`
    <div class=${i}>
      <div class="usage-insight-title">${e}</div>
      ${t.length===0?a`<div class="muted">${n}</div>`:a`
            <div class=${s}>
              ${t.map(e=>a`
                  <div class="usage-error-row">
                    <div class="usage-error-date">${e.label}</div>
                    <div class="usage-error-rate">${e.value}</div>
                    ${e.sub?a`<div class="usage-error-sub">${e.sub}</div>`:o}
                  </div>
                `)}
            </div>
          `}
    </div>
  `}function Y(e){let t=[`stat`,`usage-summary-card`,e.className,e.tone?`usage-summary-card--${e.tone}`:``].filter(Boolean).join(` `),n=[`stat-value`,`usage-summary-value`,e.tone??``,e.compactValue?`usage-summary-value--compact`:``].filter(Boolean).join(` `);return a`
    <div class=${t}>
      <div class="usage-summary-title">
        ${e.title}
        <span class="usage-summary-hint" title=${e.hint}>?</span>
      </div>
      <div class=${n}>${e.value}</div>
      <div class="usage-summary-sub">${e.sub}</div>
    </div>
  `}function Je(e,t,n,r,i,s,c,u){if(!e)return o;let f=t.messages.total?Math.round(e.totalTokens/t.messages.total):0,p=t.messages.total?e.totalCost/t.messages.total:0,m=e.input+e.cacheRead+e.cacheWrite,h=m>0?e.cacheRead/m:0,g=m>0?`${(h*100).toFixed(1)}%`:d(`usage.common.emptyValue`),_=n.errorRate*100,v=n.throughputTokensPerMin===void 0?d(`usage.common.emptyValue`):`${U(Math.round(n.throughputTokensPerMin))} ${d(`usage.overview.tokensPerMinute`)}`,y=n.throughputCostPerMin===void 0?d(`usage.common.emptyValue`):`${q(n.throughputCostPerMin)} ${d(`usage.overview.perMinute`)}`,b=n.durationCount>0?ee(n.avgDurationMs,{spaced:!0})??d(`usage.common.emptyValue`):d(`usage.common.emptyValue`),x=d(`usage.overview.cacheHint`),S=d(`usage.overview.errorHint`),C=d(`usage.overview.throughputHint`),w=d(`usage.overview.avgTokensHint`),T=d(r?`usage.overview.avgCostHintMissing`:`usage.overview.avgCostHint`),E=t.daily.filter(e=>e.messages>0&&e.errors>0).map(e=>{let t=e.errors/e.messages;return{label:Ce(e.date),value:`${(t*100).toFixed(2)}%`,sub:`${e.errors} ${l(d(`usage.overview.errors`))} · ${e.messages} ${d(`usage.overview.messagesAbbrev`)} · ${U(e.tokens)}`,rate:t}}).toSorted((e,t)=>t.rate-e.rate).slice(0,5).map(({rate:e,...t})=>t),D=t=>i&&e.totalCost>0?d(`usage.overview.costShare`,{percent:(t/e.totalCost*100).toFixed(1)}):null,O=(e,t,n)=>[D(e),U(t),n===void 0?null:`${n} ${d(`usage.overview.messagesAbbrev`)}`].filter(e=>e!==null).join(` · `),k=t.byModel.slice(0,5).map(e=>({label:e.model??d(`usage.common.unknown`),value:q(e.totals.totalCost),sub:O(e.totals.totalCost,e.totals.totalTokens,e.count)})),A=t.byProvider.slice(0,5).map(e=>({label:e.provider??d(`usage.common.unknown`),value:q(e.totals.totalCost),sub:O(e.totals.totalCost,e.totals.totalTokens,e.count)})),j=t.tools.tools.slice(0,6).map(e=>({label:e.name,value:`${e.count}`,sub:d(`usage.overview.calls`)})),M=t.byAgent.slice(0,5).map(e=>({label:e.agentId,value:q(e.totals.totalCost),sub:O(e.totals.totalCost,e.totals.totalTokens)})),N=t.byChannel.slice(0,5).map(e=>({label:e.channel,value:q(e.totals.totalCost),sub:O(e.totals.totalCost,e.totals.totalTokens)}));return a`
    <section class="card usage-overview-card">
      <div class="card-title">${d(`usage.overview.title`)}</div>
      <div class="usage-overview-layout">
        <div class="usage-summary-grid">
          ${Y({title:d(`usage.overview.messages`),hint:d(`usage.overview.messagesHint`),value:t.messages.total,sub:`${t.messages.user} ${l(d(`usage.overview.user`))} · ${t.messages.assistant} ${l(d(`usage.overview.assistant`))}`,className:`usage-summary-card--hero`})}
          ${Y({title:d(`usage.overview.throughput`),hint:C,value:v,sub:y,className:`usage-summary-card--hero usage-summary-card--throughput`,compactValue:!0})}
          ${Y({title:d(`usage.overview.toolCalls`),hint:d(`usage.overview.toolCallsHint`),value:t.tools.totalCalls,sub:`${t.tools.uniqueTools} ${d(`usage.overview.toolsUsed`)}`,className:`usage-summary-card--half`})}
          ${Y({title:d(`usage.overview.avgTokens`),hint:w,value:U(f),sub:d(`usage.overview.acrossMessages`,{count:String(t.messages.total||0)}),className:`usage-summary-card--half`})}
          ${Y({title:d(`usage.overview.cacheHitRate`),hint:x,value:g,sub:`${U(e.cacheRead)} ${d(`usage.overview.cached`)} · ${U(m)} ${d(`usage.overview.prompt`)}`,tone:h>.6?`good`:h>.3?`warn`:`bad`,className:`usage-summary-card--medium`})}
          ${Y({title:d(`usage.overview.errorRate`),hint:S,value:`${_.toFixed(2)}%`,sub:`${t.messages.errors} ${l(d(`usage.overview.errors`))} · ${b} ${d(`usage.overview.avgSession`)}`,tone:_>5?`bad`:_>1?`warn`:`good`,className:`usage-summary-card--medium`})}
          ${Y({title:d(`usage.overview.avgCost`),hint:T,value:q(p),sub:`${q(e.totalCost)} ${l(d(`usage.breakdown.total`))}`,className:`usage-summary-card--compact`})}
          ${Y({title:d(`usage.overview.sessions`),hint:d(`usage.overview.sessionsHint`),value:c,sub:d(`usage.overview.sessionsInRange`,{count:String(u)}),className:`usage-summary-card--compact`})}
          ${Y({title:d(`usage.overview.errors`),hint:d(`usage.overview.errorsHint`),value:t.messages.errors,sub:`${t.messages.toolResults} ${d(`usage.overview.toolResults`)}`,className:`usage-summary-card--compact`})}
        </div>
        <div class="usage-insights-grid">
          ${J(d(`usage.overview.topModels`),k,d(`usage.overview.noModelData`))}
          ${J(d(`usage.overview.topProviders`),A,d(`usage.overview.noProviderData`))}
          ${J(d(`usage.overview.topTools`),j,d(`usage.overview.noToolCalls`))}
          ${J(d(`usage.overview.topAgents`),M,d(`usage.overview.noAgentData`))}
          ${J(d(`usage.overview.topChannels`),N,d(`usage.overview.noChannelData`))}
          ${qe(d(`usage.overview.peakErrorDays`),E,d(`usage.overview.noErrorData`))}
          ${qe(d(`usage.overview.peakErrorHours`),s,d(`usage.overview.noErrorData`),{className:`usage-insight-card--wide`,listClassName:`usage-error-list--hours`})}
        </div>
      </div>
    </section>
  `}function Ye(e,t,n,r,i,s,c,u,f,p,m,h,g,_,v){let y=e=>g.includes(e),b=e=>{let t=e.label||e.key;return t.startsWith(`agent:`)&&t.includes(`?token=`)?t.slice(0,t.indexOf(`?token=`)):t},x=async e=>{let t=b(e);try{await navigator.clipboard.writeText(t)}catch{}},S=e=>{let t=[];return y(`channel`)&&e.channel&&t.push(`channel:${e.channel}`),y(`agent`)&&e.agentId&&t.push(`agent:${e.agentId}`),y(`provider`)&&(e.modelProvider||e.providerOverride)&&t.push(`provider:${e.modelProvider??e.providerOverride}`),y(`model`)&&e.model&&t.push(`model:${e.model}`),y(`messages`)&&e.usage?.messageCounts&&t.push(`msgs:${e.usage.messageCounts.total}`),y(`tools`)&&e.usage?.toolUsage&&t.push(`tools:${e.usage.toolUsage.totalCalls}`),y(`errors`)&&e.usage?.messageCounts&&t.push(`errors:${e.usage.messageCounts.errors}`),y(`duration`)&&e.usage?.durationMs&&t.push(`dur:${ee(e.usage.durationMs,{spaced:!0})??`—`}`),t},C=new Set(n),w=(e,t)=>{let n=e.usage;return n?C.size>0&&n.dailyBreakdown&&n.dailyBreakdown.length>0?n.dailyBreakdown.reduce((e,n)=>C.has(n.date)?e+(t===`tokens`?n.tokens:n.cost):e,0):t===`tokens`?n.totalTokens??0:n.totalCost??0:0},T=e=>w(e,r?`tokens`:`cost`),E=e=>{switch(i){case`recent`:return e.updatedAt??0;case`messages`:return e.usage?.messageCounts?.total??0;case`errors`:return e.usage?.messageCounts?.errors??0;case`cost`:return w(e,`cost`);case`tokens`:return w(e,`tokens`)}return i},D=[...e].toSorted((e,t)=>{let n=E(t)-E(e);if(n!==0)return n;let r=(t.updatedAt??0)-(e.updatedAt??0);return r===0?b(e).localeCompare(b(t)):r}),O=s===`asc`?D.toReversed():D,k=O.reduce((e,t)=>e+T(t),0),A=O.length?k/O.length:0,j=O.reduce((e,t)=>e+(t.usage?.messageCounts?.errors??0),0),M=(e,t)=>{let n=T(e),i=b(e),s=S(e);return a`
      <div
        class="session-bar-row ${t?`selected`:``}"
        @click=${t=>f(e.key,t.shiftKey)}
        title="${e.key}"
      >
        <div class="session-bar-label">
          <div class="session-bar-title">${i}</div>
          ${s.length>0?a`<div class="session-bar-meta">${s.join(` · `)}</div>`:o}
        </div>
        <div class="session-bar-actions">
          <button
            class="btn btn--sm btn--ghost"
            @click=${t=>{t.stopPropagation(),x(e)}}
          >
            ${d(`usage.sessions.copy`)}
          </button>
          <div class="session-bar-value">
            ${r?U(n):q(n)}
          </div>
        </div>
      </div>
    `},N=new Set(t),P=O.filter(e=>N.has(e.key)),F=P.length,I=new Map(O.map(e=>[e.key,e])),L=c.map(e=>I.get(e)).filter(e=>!!e);return a`
    <div class="card sessions-card">
      <div class="sessions-card-header">
        <div class="card-title">${d(`usage.sessions.title`)}</div>
        <div class="sessions-card-count">
          ${d(`usage.sessions.shown`,{count:String(e.length)})}
          ${_===e.length?``:` · ${d(`usage.sessions.total`,{count:String(_)})}`}
        </div>
      </div>
      <div class="sessions-card-meta">
        <div class="sessions-card-stats">
          <span>
            ${r?U(A):q(A)}
            ${d(`usage.sessions.avg`)}
          </span>
          <span>${j} ${l(d(`usage.overview.errors`))}</span>
        </div>
        <div class="chart-toggle small">
          <button
            class="btn btn--sm toggle-btn ${u===`all`?`active`:``}"
            @click=${()=>h(`all`)}
          >
            ${d(`usage.sessions.all`)}
          </button>
          <button
            class="btn btn--sm toggle-btn ${u===`recent`?`active`:``}"
            @click=${()=>h(`recent`)}
          >
            ${d(`usage.sessions.recent`)}
          </button>
        </div>
        <label class="sessions-sort">
          <span>${d(`usage.sessions.sort`)}</span>
          <select
            @change=${e=>p(e.target.value)}
          >
            <option value="cost" ?selected=${i===`cost`}>
              ${d(`usage.metrics.cost`)}
            </option>
            <option value="errors" ?selected=${i===`errors`}>
              ${d(`usage.overview.errors`)}
            </option>
            <option value="messages" ?selected=${i===`messages`}>
              ${d(`usage.overview.messages`)}
            </option>
            <option value="recent" ?selected=${i===`recent`}>
              ${d(`usage.sessions.recentShort`)}
            </option>
            <option value="tokens" ?selected=${i===`tokens`}>
              ${d(`usage.metrics.tokens`)}
            </option>
          </select>
        </label>
        <openclaw-tooltip
          .content=${d(s===`desc`?`usage.sessions.descending`:`usage.sessions.ascending`)}
        >
          <button
            class="btn btn--sm"
            aria-label=${d(s===`desc`?`usage.sessions.descending`:`usage.sessions.ascending`)}
            @click=${()=>m(s===`desc`?`asc`:`desc`)}
          >
            ${s===`desc`?`↓`:`↑`}
          </button>
        </openclaw-tooltip>
        ${F>0?a`
              <button class="btn btn--sm" @click=${v}>
                ${d(`usage.sessions.clearSelection`)}
              </button>
            `:o}
      </div>
      ${u===`recent`?L.length===0?a` <div class="usage-empty-block">${d(`usage.sessions.noRecent`)}</div> `:a`
              <div class="session-bars session-bars--recent">
                ${L.map(e=>M(e,N.has(e.key)))}
              </div>
            `:e.length===0?a` <div class="usage-empty-block">${d(`usage.sessions.noneInRange`)}</div> `:a`
              <div class="session-bars">
                ${O.slice(0,50).map(e=>M(e,N.has(e.key)))}
                ${e.length>50?a`
                      <div class="usage-more-sessions">
                        ${d(`usage.sessions.more`,{count:String(e.length-50)})}
                      </div>
                    `:o}
              </div>
            `}
      ${F>1?a`
            <div class="sessions-selected-group">
              <div class="sessions-card-count">
                ${d(`usage.sessions.selected`,{count:String(F)})}
              </div>
              <div class="session-bars session-bars--selected">
                ${P.map(e=>M(e,!0))}
              </div>
            </div>
          `:o}
    </div>
  `}var Xe=.75,Ze=.06,Qe=5,X=12,Z=.7;function Q(e,t){return!t||t<=0?0:e/t*100}function $e(e){return e<0xe8d4a51000?e*1e3:e}function et(e,t,n){let r=Math.min(t,n),i=Math.max(t,n);return e.filter(e=>{if(e.timestamp<=0)return!0;let t=$e(e.timestamp);return t>=r&&t<=i})}function tt(e,t,n){let r=t||e.usage;if(!r)return a` <div class="usage-empty-block">${d(`usage.details.noUsageData`)}</div> `;let i=e=>e?x(e):d(`usage.common.emptyValue`),s=[];e.channel&&s.push(`channel:${e.channel}`),e.agentId&&s.push(`agent:${e.agentId}`),(e.modelProvider||e.providerOverride)&&s.push(`provider:${e.modelProvider??e.providerOverride}`),e.model&&s.push(`model:${e.model}`);let c=r.toolUsage?.tools.slice(0,6)??[],u,f,p;if(n){let e=new Map;for(let t of n){let{tools:n}=ne(t.content);for(let[t]of n)e.set(t,(e.get(t)||0)+1)}p=c.map(t=>({label:t.name,value:`${e.get(t.name)??0}`,sub:d(`usage.overview.calls`)})),u=[...e.values()].reduce((e,t)=>e+t,0),f=e.size}else p=c.map(e=>({label:e.name,value:`${e.count}`,sub:d(`usage.overview.calls`)})),u=r.toolUsage?.totalCalls??0,f=r.toolUsage?.uniqueTools??0;let m=r.modelUsage?.slice(0,6).map(e=>({label:e.model??d(`usage.common.unknown`),value:W(e.totals.totalCost),sub:U(e.totals.totalTokens)}))??[];return a`
    ${s.length>0?a`<div class="usage-badges">
          ${s.map(e=>a`<span class="usage-badge">${e}</span>`)}
        </div>`:o}
    <div class="session-summary-grid">
      <div class="stat session-summary-card">
        <div class="session-summary-title">${d(`usage.overview.messages`)}</div>
        <div class="stat-value session-summary-value">${r.messageCounts?.total??0}</div>
        <div class="session-summary-meta">
          ${r.messageCounts?.user??0}
          ${l(d(`usage.overview.user`))} ·
          ${r.messageCounts?.assistant??0}
          ${l(d(`usage.overview.assistant`))}
        </div>
      </div>
      <div class="stat session-summary-card">
        <div class="session-summary-title">${d(`usage.overview.toolCalls`)}</div>
        <div class="stat-value session-summary-value">${u}</div>
        <div class="session-summary-meta">${f} ${d(`usage.overview.toolsUsed`)}</div>
      </div>
      <div class="stat session-summary-card">
        <div class="session-summary-title">${d(`usage.overview.errors`)}</div>
        <div class="stat-value session-summary-value">${r.messageCounts?.errors??0}</div>
        <div class="session-summary-meta">
          ${r.messageCounts?.toolResults??0} ${d(`usage.overview.toolResults`)}
        </div>
      </div>
      <div class="stat session-summary-card">
        <div class="session-summary-title">${d(`usage.details.duration`)}</div>
        <div class="stat-value session-summary-value">
          ${ee(r.durationMs,{spaced:!0})??d(`usage.common.emptyValue`)}
        </div>
        <div class="session-summary-meta">
          ${i(r.firstActivity)} → ${i(r.lastActivity)}
        </div>
      </div>
    </div>
    <div class="usage-insights-grid usage-insights-grid--tight">
      ${J(d(`usage.overview.topTools`),p,d(`usage.overview.noToolCalls`))}
      ${J(d(`usage.details.modelMix`),m,d(`usage.overview.noModelData`))}
    </div>
  `}function nt(e,t,n,r){let i=Math.min(n,r),a=Math.max(n,r),o=t.filter(e=>e.timestamp>=i&&e.timestamp<=a);if(o.length===0)return;let s=0,c=0,l=0,u=0,d=0,f=0,p=0,m=0;for(let e of o)s+=e.totalTokens||0,c+=e.cost||0,d+=e.input||0,f+=e.output||0,p+=e.cacheRead||0,m+=e.cacheWrite||0,e.output>0&&u++,e.input>0&&l++;return{...e,totalTokens:s,totalCost:c,input:d,output:f,cacheRead:p,cacheWrite:m,durationMs:o[o.length-1].timestamp-o[0].timestamp,firstActivity:o[0].timestamp,lastActivity:o[o.length-1].timestamp,messageCounts:{total:o.length,user:l,assistant:u,toolCalls:0,toolResults:0,errors:0}}}function rt(e,t,n,r,i,s,c,u,f,p,m,h,g,_,v,y,x,S,C,w,ee,T,E,D,O,k){let A=e.label||e.key,j=A.length>50?b(A,50)+`…`:A,M=e.usage,N=u!==null&&f!==null,P=u!==null&&f!==null&&t?.points&&M?nt(M,t.points,u,f):void 0,F=P?{totalTokens:P.totalTokens,totalCost:P.totalCost}:{totalTokens:M?.totalTokens??0,totalCost:M?.totalCost??0},I=P?d(`usage.details.filtered`):``;return a`
    <div class="card session-detail-panel">
      <div class="session-detail-header">
        <div class="session-detail-header-left">
          <div class="session-detail-title">
            ${j}
            ${I?a`<span class="session-detail-indicator">${I}</span>`:o}
          </div>
        </div>
        <div class="session-detail-stats">
          ${M?a`
                <span
                  ><strong>${U(F.totalTokens)}</strong>
                  ${l(d(`usage.metrics.tokens`))}${I}</span
                >
                <span><strong>${W(F.totalCost)}</strong>${I}</span>
              `:o}
        </div>
        <openclaw-tooltip .content=${d(`usage.details.close`)}>
          <button
            class="btn btn--sm btn--ghost"
            @click=${k}
            aria-label=${d(`usage.details.close`)}
          >
            ×
          </button>
        </openclaw-tooltip>
      </div>
      ${e.scope===`family`&&e.includedSessionIds?.length?a`
            <div class="usage-lineage-note">
              ${d(`usage.scope.familyIncluded`,{count:String(e.includedSessionIds.length)})}
            </div>
          `:o}
      <div class="session-detail-content">
        ${tt(e,P,u!=null&&f!=null&&_?et(_,u,f):void 0)}
        <div class="session-detail-row">
          ${it(t,n,r,i,s,c,m,h,g,u,f,p)}
        </div>
        <div class="session-detail-bottom">
          ${ot(_,v,y,x,S,C,w,ee,T,E,N?u:null,N?f:null)}
          ${at(e.contextWeight,M,D,O)}
        </div>
      </div>
    </div>
  `}function it(e,t,n,i,s,c,u,f,p,m,h,g){if(t)return a`
      <div class="session-timeseries-compact">
        <div class="usage-empty-block">${d(`usage.loading.badge`)}</div>
      </div>
    `;if(!e||e.points.length<2)return a`
      <div class="session-timeseries-compact">
        <div class="usage-empty-block">${d(`usage.details.noTimeline`)}</div>
      </div>
    `;let _=e.points;if(u||f||p&&p.length>0){let t=u?new Date(u+`T00:00:00`).getTime():0,n=f?new Date(f+`T23:59:59`).getTime():1/0,r=p?.length?new Set(p):void 0;_=e.points.filter(e=>{if(e.timestamp<t||e.timestamp>n)return!1;if(r){let t=new Date(e.timestamp),n=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,`0`)}-${String(t.getDate()).padStart(2,`0`)}`;return r.has(n)}return!0})}if(_.length<2)return a`
      <div class="session-timeseries-compact">
        <div class="usage-empty-block">${d(`usage.details.noDataInRange`)}</div>
      </div>
    `;let v=0,y=0,b=0,x=0,C=0,ee=0;_=_.map(e=>(v+=e.totalTokens,y+=e.cost,b+=e.output,x+=e.input,C+=e.cacheRead,ee+=e.cacheWrite,{...e,cumulativeTokens:v,cumulativeCost:y}));let T=m!=null&&h!=null,E=T?Math.min(m,h):0,D=T?Math.max(m,h):1/0,O=0,k=_.length;if(T){O=_.findIndex(e=>e.timestamp>=E),O===-1&&(O=_.length);let e=_.findIndex(e=>e.timestamp>D);k=e===-1?_.length:e}let A=T?_.slice(O,k):_,j=0,M=0,N=0,P=0;for(let e of A)j+=e.output,M+=e.input,N+=e.cacheRead,P+=e.cacheWrite;let F={top:8,right:4,bottom:14,left:30},I=400-F.left-F.right,L=100-F.top-F.bottom,R=n===`cumulative`,z=n===`per-turn`&&s===`by-type`,te=j+M+N+P,ne=_.map(e=>R?e.cumulativeTokens:z?e.input+e.output+e.cacheRead+e.cacheWrite:e.totalTokens),re=Math.max(...ne,1),ie=I/_.length,B=Math.min(8,Math.max(1,ie*Xe)),ae=ie-B,V=F.left+O*(B+ae),H=k>=_.length?F.left+(_.length-1)*(B+ae)+B:F.left+(k-1)*(B+ae)+B;return a`
    <div class="session-timeseries-compact">
      <div class="timeseries-header-row">
        <div class="card-title usage-section-title">${d(`usage.details.usageOverTime`)}</div>
        <div class="timeseries-controls">
          ${T?a`
                <div class="chart-toggle small">
                  <button
                    class="btn btn--sm toggle-btn active"
                    @click=${()=>g?.(null,null)}
                  >
                    ${d(`usage.details.reset`)}
                  </button>
                </div>
              `:o}
          <div class="chart-toggle small">
            <button
              class="btn btn--sm toggle-btn ${R?``:`active`}"
              @click=${()=>i(`per-turn`)}
            >
              ${d(`usage.details.perTurn`)}
            </button>
            <button
              class="btn btn--sm toggle-btn ${R?`active`:``}"
              @click=${()=>i(`cumulative`)}
            >
              ${d(`usage.details.cumulative`)}
            </button>
          </div>
          ${R?o:a`
                <div class="chart-toggle small">
                  <button
                    class="btn btn--sm toggle-btn ${s===`total`?`active`:``}"
                    @click=${()=>c(`total`)}
                  >
                    ${d(`usage.daily.total`)}
                  </button>
                  <button
                    class="btn btn--sm toggle-btn ${s===`by-type`?`active`:``}"
                    @click=${()=>c(`by-type`)}
                  >
                    ${d(`usage.daily.byType`)}
                  </button>
                </div>
              `}
        </div>
      </div>
      <div class="timeseries-chart-wrapper">
        <svg viewBox="0 0 ${400} ${118}" class="timeseries-svg">
          <!-- Y axis -->
          <line
            x1="${F.left}"
            y1="${F.top}"
            x2="${F.left}"
            y2="${F.top+L}"
            stroke="var(--border)"
          />
          <!-- X axis -->
          <line
            x1="${F.left}"
            y1="${F.top+L}"
            x2="${400-F.right}"
            y2="${F.top+L}"
            stroke="var(--border)"
          />
          <!-- Y axis labels -->
          <text
            x="${F.left-4}"
            y="${F.top+5}"
            text-anchor="end"
            class="ts-axis-label"
          >
            ${U(re)}
          </text>
          <text
            x="${F.left-4}"
            y="${F.top+L}"
            text-anchor="end"
            class="ts-axis-label"
          >
            0
          </text>
          <!-- X axis labels (first and last) -->
          ${_.length>0?r`
            <text x="${F.left}" y="${F.top+L+10}" text-anchor="start" class="ts-axis-label">${S(_[0].timestamp,{hour:`2-digit`,minute:`2-digit`},``)}</text>
            <text x="${400-F.right}" y="${F.top+L+10}" text-anchor="end" class="ts-axis-label">${S(_[_.length-1].timestamp,{hour:`2-digit`,minute:`2-digit`},``)}</text>
          `:o}
          <!-- Bars -->
          ${_.map((e,t)=>{let n=ne[t],i=F.left+t*(B+ae),a=n/re*L,s=F.top+L-a,c=[w(e.timestamp,{month:`short`,day:`numeric`,hour:`2-digit`,minute:`2-digit`},``),`${U(n)} ${l(d(`usage.metrics.tokens`))}`];z&&(c.push(`Out ${U(e.output)}`),c.push(`In ${U(e.input)}`),c.push(`CW ${U(e.cacheWrite)}`),c.push(`CR ${U(e.cacheRead)}`));let u=c.join(` · `),f=T&&(t<O||t>=k);if(!z)return r`<rect x="${i}" y="${s}" width="${B}" height="${a}" class="ts-bar${f?` dimmed`:``}" rx="1"><title>${u}</title></rect>`;let p=[{value:e.output,cls:`output`},{value:e.input,cls:`input`},{value:e.cacheWrite,cls:`cache-write`},{value:e.cacheRead,cls:`cache-read`}],m=F.top+L,h=f?` dimmed`:``;return r`
              ${p.map(e=>{if(e.value<=0||n<=0)return o;let t=a*(e.value/n);return m-=t,r`<rect x="${i}" y="${m}" width="${B}" height="${t}" class="ts-bar ${e.cls}${h}" rx="1"><title>${u}</title></rect>`})}
            `})}
          <!-- Selection highlight overlay (always visible between handles) -->
          ${r`
            <rect 
              x="${V}" 
              y="${F.top}" 
              width="${Math.max(1,H-V)}" 
              height="${L}" 
              fill="var(--accent)" 
              opacity="${Ze}" 
              pointer-events="none"
            />
          `}
          <!-- Left cursor line + handle -->
          ${r`
            <line x1="${V}" y1="${F.top}" x2="${V}" y2="${F.top+L}" stroke="var(--accent)" stroke-width="0.8" opacity="0.7" />
            <rect x="${V-Qe/2}" y="${F.top+L/2-X/2}" width="${Qe}" height="${X}" rx="1.5" fill="var(--accent)" class="cursor-handle" />
            <line x1="${V-Z}" y1="${F.top+L/2-X/5}" x2="${V-Z}" y2="${F.top+L/2+X/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
            <line x1="${V+Z}" y1="${F.top+L/2-X/5}" x2="${V+Z}" y2="${F.top+L/2+X/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
          `}
          <!-- Right cursor line + handle -->
          ${r`
            <line x1="${H}" y1="${F.top}" x2="${H}" y2="${F.top+L}" stroke="var(--accent)" stroke-width="0.8" opacity="0.7" />
            <rect x="${H-Qe/2}" y="${F.top+L/2-X/2}" width="${Qe}" height="${X}" rx="1.5" fill="var(--accent)" class="cursor-handle" />
            <line x1="${H-Z}" y1="${F.top+L/2-X/5}" x2="${H-Z}" y2="${F.top+L/2+X/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
            <line x1="${H+Z}" y1="${F.top+L/2-X/5}" x2="${H+Z}" y2="${F.top+L/2+X/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
          `}
        </svg>
        <!-- Handle drag zones (only on handles, not full chart) -->
        ${(()=>{let e=`${(V/400*100).toFixed(1)}%`,t=`${(H/400*100).toFixed(1)}%`,n=e=>t=>{if(!g)return;t.preventDefault(),t.stopPropagation();let n=t.currentTarget.closest(`.timeseries-chart-wrapper`)?.querySelector(`svg`);if(!n)return;let r=n.getBoundingClientRect(),i=r.width,a=F.left/400*i,o=(400-F.right)/400*i-a,s=e=>{let t=Math.max(0,Math.min(1,(e-r.left-a)/o));return Math.min(Math.floor(t*_.length),_.length-1)},c=e===`left`?V:H,l=r.left+c/400*i,u=t.clientX-l;document.body.style.cursor=`col-resize`;let d=t=>{let n=t.clientX-u,r=s(n),i=_[r];if(i)if(e===`left`){let e=h??_[_.length-1].timestamp;g(Math.min(i.timestamp,e),e)}else{let e=m??_[0].timestamp;g(e,Math.max(i.timestamp,e))}},f=()=>{document.body.style.cursor=``,document.removeEventListener(`mousemove`,d),document.removeEventListener(`mouseup`,f)};document.addEventListener(`mousemove`,d),document.addEventListener(`mouseup`,f)};return a`
            <div
              class="chart-handle-zone chart-handle-left"
              style="left: ${e};"
              @mousedown=${n(`left`)}
            ></div>
            <div
              class="chart-handle-zone chart-handle-right"
              style="left: ${t};"
              @mousedown=${n(`right`)}
            ></div>
          `})()}
      </div>
      <div class="timeseries-summary">
        ${T?a`
              <span class="timeseries-summary__range">
                ${d(`usage.details.turnRange`,{start:String(O+1),end:String(k),total:String(_.length)})}
              </span>
              ·
              ${S(E,{hour:`2-digit`,minute:`2-digit`},``)}–${S(D,{hour:`2-digit`,minute:`2-digit`},``)}
              ·
              ${U(j+M+N+P)}
              · ${W(A.reduce((e,t)=>e+(t.cost||0),0))}
            `:a`${_.length} ${d(`usage.overview.messagesAbbrev`)} · ${U(v)}
            · ${W(y)}`}
      </div>
      ${z?a`
            <div class="timeseries-breakdown">
              <div class="card-title usage-section-title">${d(`usage.breakdown.tokensByType`)}</div>
              <div class="cost-breakdown-bar cost-breakdown-bar--compact">
                <div
                  class="cost-segment output"
                  style="width: ${Q(j,te).toFixed(1)}%"
                ></div>
                <div
                  class="cost-segment input"
                  style="width: ${Q(M,te).toFixed(1)}%"
                ></div>
                <div
                  class="cost-segment cache-write"
                  style="width: ${Q(P,te).toFixed(1)}%"
                ></div>
                <div
                  class="cost-segment cache-read"
                  style="width: ${Q(N,te).toFixed(1)}%"
                ></div>
              </div>
              <div class="cost-breakdown-legend">
                <div class="legend-item" title=${d(`usage.details.assistantOutputTokens`)}>
                  <span class="legend-dot output"></span>${d(`usage.breakdown.output`)}
                  ${U(j)}
                </div>
                <div class="legend-item" title=${d(`usage.details.userToolInputTokens`)}>
                  <span class="legend-dot input"></span>${d(`usage.breakdown.input`)}
                  ${U(M)}
                </div>
                <div class="legend-item" title=${d(`usage.details.tokensWrittenToCache`)}>
                  <span class="legend-dot cache-write"></span>${d(`usage.breakdown.cacheWrite`)}
                  ${U(P)}
                </div>
                <div class="legend-item" title=${d(`usage.details.tokensReadFromCache`)}>
                  <span class="legend-dot cache-read"></span>${d(`usage.breakdown.cacheRead`)}
                  ${U(N)}
                </div>
              </div>
              <div class="cost-breakdown-total">
                ${d(`usage.breakdown.total`)}: ${U(te)}
              </div>
            </div>
          `:o}
    </div>
  `}function at(e,t,n,r){if(!e)return a`
      <div class="context-details-panel">
        <div class="usage-empty-block">${d(`usage.details.noContextData`)}</div>
      </div>
    `;let i=H(e.systemPrompt.chars),s=H(e.skills.promptChars),c=H(e.tools.listChars+e.tools.schemaChars),l=H(e.injectedWorkspaceFiles.reduce((e,t)=>e+t.injectedChars,0)),u=i+s+c+l,f=``;if(t&&t.totalTokens>0){let e=t.input+t.cacheRead;e>0&&(f=`~${Math.min(u/e*100,100).toFixed(0)}% ${d(`usage.details.ofInput`)}`)}let p=e.skills.entries.toSorted((e,t)=>t.blockChars-e.blockChars),m=e.tools.entries.toSorted((e,t)=>t.summaryChars+t.schemaChars-(e.summaryChars+e.schemaChars)),h=e.injectedWorkspaceFiles.toSorted((e,t)=>t.injectedChars-e.injectedChars),g=n,_=g?p:p.slice(0,4),v=g?m:m.slice(0,4),y=g?h:h.slice(0,4),b=p.length>4||m.length>4||h.length>4;return a`
    <div class="context-details-panel">
      <div class="context-breakdown-header">
        <div class="card-title usage-section-title">
          ${d(`usage.details.systemPromptBreakdown`)}
        </div>
        ${b?a`<button class="btn btn--sm" @click=${r}>
              ${d(g?`usage.details.collapse`:`usage.details.expandAll`)}
            </button>`:o}
      </div>
      <p class="context-weight-desc">${f||d(`usage.details.baseContextPerMessage`)}</p>
      <div class="context-stacked-bar">
        <div
          class="context-segment system"
          style="width: ${Q(i,u).toFixed(1)}%"
          title="${d(`usage.details.system`)}: ~${U(i)}"
        ></div>
        <div
          class="context-segment skills"
          style="width: ${Q(s,u).toFixed(1)}%"
          title="${d(`usage.details.skills`)}: ~${U(s)}"
        ></div>
        <div
          class="context-segment tools"
          style="width: ${Q(c,u).toFixed(1)}%"
          title="${d(`usage.details.tools`)}: ~${U(c)}"
        ></div>
        <div
          class="context-segment files"
          style="width: ${Q(l,u).toFixed(1)}%"
          title="${d(`usage.details.files`)}: ~${U(l)}"
        ></div>
      </div>
      <div class="context-legend">
        <span class="legend-item"
          ><span class="legend-dot system"></span>${d(`usage.details.systemShort`)}
          ~${U(i)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot skills"></span>${d(`usage.details.skills`)}
          ~${U(s)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot tools"></span>${d(`usage.details.tools`)}
          ~${U(c)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot files"></span>${d(`usage.details.files`)}
          ~${U(l)}</span
        >
      </div>
      <div class="context-total">
        ${d(`usage.breakdown.total`)}: ~${U(u)}
      </div>
      <div class="context-breakdown-grid">
        ${p.length>0?(()=>{let e=p.length-_.length;return a`
                <div class="context-breakdown-card">
                  <div class="context-breakdown-title">
                    ${d(`usage.details.skills`)} (${p.length})
                  </div>
                  <div class="context-breakdown-list">
                    ${_.map(e=>a`
                        <div class="context-breakdown-item">
                          <span class="mono" title=${e.name}>${e.name}</span>
                          <span class="muted">~${U(H(e.blockChars))}</span>
                        </div>
                      `)}
                  </div>
                  ${e>0?a`
                        <div class="context-breakdown-more">
                          ${d(`usage.sessions.more`,{count:String(e)})}
                        </div>
                      `:o}
                </div>
              `})():o}
        ${m.length>0?(()=>{let e=m.length-v.length;return a`
                <div class="context-breakdown-card">
                  <div class="context-breakdown-title">
                    ${d(`usage.details.tools`)} (${m.length})
                  </div>
                  <div class="context-breakdown-list">
                    ${v.map(e=>a`
                        <div class="context-breakdown-item">
                          <span class="mono" title=${e.name}>${e.name}</span>
                          <span class="muted"
                            >~${U(H(e.summaryChars+e.schemaChars))}</span
                          >
                        </div>
                      `)}
                  </div>
                  ${e>0?a`
                        <div class="context-breakdown-more">
                          ${d(`usage.sessions.more`,{count:String(e)})}
                        </div>
                      `:o}
                </div>
              `})():o}
        ${h.length>0?(()=>{let e=h.length-y.length;return a`
                <div class="context-breakdown-card">
                  <div class="context-breakdown-title">
                    ${d(`usage.details.files`)} (${h.length})
                  </div>
                  <div class="context-breakdown-list">
                    ${y.map(e=>a`
                        <div class="context-breakdown-item">
                          <span class="mono" title=${e.name}>${e.name}</span>
                          <span class="muted"
                            >~${U(H(e.injectedChars))}</span
                          >
                        </div>
                      `)}
                  </div>
                  ${e>0?a`
                        <div class="context-breakdown-more">
                          ${d(`usage.sessions.more`,{count:String(e)})}
                        </div>
                      `:o}
                </div>
              `})():o}
      </div>
    </div>
  `}function ot(e,t,n,r,i,s,c,u,f,p,m,h){if(t)return a`
      <div class="session-logs-compact">
        <div class="session-logs-header">${d(`usage.details.conversation`)}</div>
        <div class="usage-empty-block">${d(`usage.loading.badge`)}</div>
      </div>
    `;if(!e||e.length===0)return a`
      <div class="session-logs-compact">
        <div class="session-logs-header">${d(`usage.details.conversation`)}</div>
        <div class="usage-empty-block">${d(`usage.details.noMessages`)}</div>
      </div>
    `;let g=l(i.query),_=e.map(e=>{let t=ne(e.content);return{log:e,toolInfo:t,cleanContent:t.cleanContent||e.content}}),v=Array.from(new Set(_.flatMap(e=>e.toolInfo.tools.map(([e])=>e)))).toSorted((e,t)=>e.localeCompare(t)),y=_.filter(e=>{if(m!=null&&h!=null){let t=e.log.timestamp;if(t>0){let e=Math.min(m,h),n=Math.max(m,h),r=$e(t);if(r<e||r>n)return!1}}return!(i.roles.length>0&&!i.roles.includes(e.log.role)||i.hasTools&&e.toolInfo.tools.length===0||i.tools.length>0&&!e.toolInfo.tools.some(([e])=>i.tools.includes(e))||g&&!l(e.cleanContent).includes(g))}),b=i.roles.length>0||i.tools.length>0||i.hasTools||g,S=m!=null&&h!=null,C=b||S?`${y.length} ${d(`usage.details.of`)} ${e.length}${S?` (${d(`usage.details.timelineFiltered`)})`:``}`:`${e.length}`,w=new Set(i.roles),ee=new Set(i.tools);return a`
    <div class="session-logs-compact">
      <div class="session-logs-header">
        <span>
          ${d(`usage.details.conversation`)}
          <span class="session-logs-header-count">
            (${C} ${l(d(`usage.overview.messages`))})
          </span>
        </span>
        <button class="btn btn--sm" @click=${r}>
          ${d(n?`usage.details.collapseAll`:`usage.details.expandAll`)}
        </button>
      </div>
      <div class="usage-filters-inline session-log-filters">
        <select
          multiple
          size="4"
          aria-label="Filter by role"
          @change=${e=>s(Array.from(e.target.selectedOptions).map(e=>e.value))}
        >
          <option value="user" ?selected=${w.has(`user`)}>
            ${d(`usage.overview.user`)}
          </option>
          <option value="assistant" ?selected=${w.has(`assistant`)}>
            ${d(`usage.overview.assistant`)}
          </option>
          <option value="tool" ?selected=${w.has(`tool`)}>
            ${d(`usage.details.tool`)}
          </option>
          <option value="toolResult" ?selected=${w.has(`toolResult`)}>
            ${d(`usage.details.toolResult`)}
          </option>
        </select>
        <select
          multiple
          size="4"
          aria-label="Filter by tool"
          @change=${e=>c(Array.from(e.target.selectedOptions).map(e=>e.value))}
        >
          ${v.map(e=>a`<option value=${e} ?selected=${ee.has(e)}>${e}</option>`)}
        </select>
        <label class="usage-filters-inline session-log-has-tools">
          <input
            type="checkbox"
            .checked=${i.hasTools}
            @change=${e=>u(e.target.checked)}
          />
          ${d(`usage.details.hasTools`)}
        </label>
        <input
          type="text"
          placeholder=${d(`usage.details.searchConversation`)}
          aria-label=${d(`usage.details.searchConversation`)}
          .value=${i.query}
          @input=${e=>f(e.target.value)}
        />
        <button class="btn btn--sm" @click=${p}>${d(`usage.filters.clear`)}</button>
      </div>
      <div class="session-logs-list">
        ${y.map(e=>{let{log:t,toolInfo:r,cleanContent:i}=e;return a`
            <div class="session-log-entry ${t.role===`user`?`user`:`assistant`}">
              <div class="session-log-meta">
                <span class="session-log-role">${t.role===`user`?d(`usage.details.you`):t.role===`assistant`?d(`usage.overview.assistant`):d(`usage.details.tool`)}</span>
                <span>${x(t.timestamp)}</span>
                ${t.tokens?a`<span>${U(t.tokens)}</span>`:o}
              </div>
              <div class="session-log-content">${i}</div>
              ${r.tools.length>0?a`
                    <details class="session-log-tools" ?open=${n}>
                      <summary>${r.summary}</summary>
                      <div class="session-log-tools-list">
                        ${r.tools.map(([e,t])=>a`
                            <span class="session-log-tools-pill">${e} × ${t}</span>
                          `)}
                      </div>
                    </details>
                  `:o}
            </div>
          `})}
        ${y.length===0?a`
              <div class="usage-empty-block usage-empty-block--compact">
                ${d(`usage.details.noMessagesMatch`)}
              </div>
            `:o}
      </div>
    </div>
  `}function st(){return{input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0}}function ct(e,t){return e.input+=t.input,e.output+=t.output,e.cacheRead+=t.cacheRead,e.cacheWrite+=t.cacheWrite,e.totalTokens+=t.totalTokens,e.totalCost+=t.totalCost,e.inputCost+=t.inputCost??0,e.outputCost+=t.outputCost??0,e.cacheReadCost+=t.cacheReadCost??0,e.cacheWriteCost+=t.cacheWriteCost??0,e.missingCostEntries+=t.missingCostEntries??0,e}function lt(e){return a`
    <section class="card usage-loading-card">
      <div class="usage-loading-header">
        <div class="usage-loading-title-group">
          <div class="card-title usage-section-title">${d(`usage.loading.title`)}</div>
          <span class="usage-loading-badge">
            <span class="usage-loading-spinner" aria-hidden="true"></span>
            ${d(`usage.loading.badge`)}
          </span>
        </div>
        <div class="usage-loading-controls">
          <div class="usage-date-range usage-date-range--loading">
            <input class="usage-date-input" type="date" .value=${e.startDate} disabled />
            <span class="usage-separator">${d(`usage.filters.to`)}</span>
            <input class="usage-date-input" type="date" .value=${e.endDate} disabled />
          </div>
        </div>
      </div>
      <div class="usage-loading-grid">
        <div class="usage-skeleton-block usage-skeleton-block--tall"></div>
        <div class="usage-skeleton-block"></div>
        <div class="usage-skeleton-block"></div>
      </div>
    </section>
  `}function ut(e){return a`
    <section class="card usage-empty-state">
      <div class="usage-empty-state__title">${d(`usage.empty.title`)}</div>
      <div class="card-sub usage-empty-state__subtitle">${d(`usage.empty.subtitle`)}</div>
      <div class="usage-empty-state__features">
        <span class="usage-empty-state__feature">${d(`usage.empty.featureOverview`)}</span>
        <span class="usage-empty-state__feature">${d(`usage.empty.featureSessions`)}</span>
        <span class="usage-empty-state__feature">${d(`usage.empty.featureTimeline`)}</span>
      </div>
      <div class="usage-empty-state__actions">
        <button class="btn primary" @click=${e}>${d(`common.refresh`)}</button>
      </div>
    </section>
  `}function dt(e,t){let n=t.trim().toUpperCase();return[`USD`,`EUR`,`GBP`,`CNY`,`JPY`].includes(n)?new Intl.NumberFormat(void 0,{style:`currency`,currency:n,maximumFractionDigits:n===`JPY`?0:2}).format(e):`${new Intl.NumberFormat(void 0,{maximumFractionDigits:2}).format(e)} ${t}`}function ft(e){return!e||!Number.isFinite(e)?null:new Intl.DateTimeFormat(void 0,{month:`short`,day:`numeric`,hour:`numeric`,minute:`2-digit`}).format(new Date(e))}function pt(e){return(e.billing??[]).map(e=>a`
      <div class="provider-usage-billing-row">
        <span>${e.label??(e.type===`balance`?d(`usage.providerUsage.balance`):e.type===`spend`?d(`usage.providerUsage.spend`):d(`usage.providerUsage.budget`))}</span>
        <strong>${e.type===`budget`?`${dt(e.used,e.unit)} / ${dt(e.limit,e.unit)}`:dt(e.amount,e.unit)}</strong>
      </div>
    `)}function mt(e,t){let n=e.costHistory;if(!n)return 0;let r=new Date,i=Date.UTC(r.getUTCFullYear(),r.getUTCMonth(),r.getUTCDate()),a=i-(Math.max(1,t)-1)*864e5;return n.daily.reduce((e,t)=>{let n=Date.parse(`${t.date}T00:00:00Z`);return Number.isFinite(n)&&n>=a&&n<=i?e+t.amount:e},0)}function ht(e){let t=e.costHistory;if(!t||t.daily.length===0)return o;let n=Math.max(...t.daily.map(e=>e.amount),0),r=t.daily.reduce((e,t)=>({requests:e.requests+(t.requests??0),input:e.input+t.inputTokens,cache:e.cache+t.cacheReadTokens+t.cacheWriteTokens,output:e.output+t.outputTokens}),{requests:0,input:0,cache:0,output:0});return a`
    <div class="provider-cost-history">
      <div class="provider-cost-windows">
        ${[[d(`usage.providerUsage.today`),mt(e,1)],[d(`usage.providerUsage.last7Days`),mt(e,7)],[d(`usage.providerUsage.lastDays`,{count:String(t.periodDays)}),t.daily.reduce((e,t)=>e+t.amount,0)]].map(([e,n])=>a`
            <div class="provider-cost-window">
              <span>${e}</span>
              <strong>${dt(n,t.unit)}</strong>
            </div>
          `)}
      </div>
      <div class="provider-cost-chart" aria-label=${d(`usage.providerUsage.dailyCost`)}>
        ${t.daily.map(e=>a`<span
            style=${`height: ${e.amount>0&&n>0?Math.max(3,e.amount/n*100):0}%`}
            title=${`${e.date}: ${dt(e.amount,t.unit)}`}
            aria-label=${`${e.date}: ${dt(e.amount,t.unit)}`}
          ></span>`)}
      </div>
      <div class="provider-cost-tokens">
        ${r.requests>0?a`<span
              >${d(`usage.providerUsage.requests`,{count:new Intl.NumberFormat().format(r.requests)})}</span
            >`:o}
        <span>${d(`usage.providerUsage.inputTokens`,{count:U(r.input)})}</span>
        <span>${d(`usage.providerUsage.cacheTokens`,{count:U(r.cache)})}</span>
        <span
          >${d(`usage.providerUsage.outputTokens`,{count:U(r.output)})}</span
        >
      </div>
      ${t.models.length>0||t.categories.length>0?a`
            <div class="provider-cost-breakdowns">
              ${t.models.length>0?a`
                    <div class="provider-cost-breakdown">
                      <span class="provider-cost-breakdown__title"
                        >${d(`usage.providerUsage.topModels`)}</span
                      >
                      ${t.models.slice(0,3).map(e=>a`
                            <div>
                              <span>${e.name}</span
                              ><strong>${U(e.totalTokens)}</strong>
                            </div>
                          `)}
                    </div>
                  `:o}
              ${t.categories.length>0?a`
                    <div class="provider-cost-breakdown">
                      <span class="provider-cost-breakdown__title"
                        >${d(`usage.providerUsage.costCategories`)}</span
                      >
                      ${t.categories.slice(0,3).map(e=>a`
                          <div>
                            <span>${e.name}</span>
                            <strong>${dt(e.amount,t.unit)}</strong>
                          </div>
                        `)}
                    </div>
                  `:o}
            </div>
          `:o}
    </div>
  `}function gt(e){return e.length===0?o:a`
    <section class="card provider-usage-section">
      <div class="provider-usage-heading">
        <div>
          <div class="card-title usage-section-title">${d(`usage.providerUsage.title`)}</div>
          <div class="card-sub">${d(`usage.providerUsage.subtitle`)}</div>
        </div>
        <span class="provider-usage-count">${e.length}</span>
      </div>
      <div class="provider-usage-grid">
        ${e.map(e=>a`
            <article class="provider-usage-card">
              <div class="provider-usage-card__header">
                <div>
                  <div class="provider-usage-card__name">${e.displayName}</div>
                  <div class="provider-usage-card__id">${e.provider}</div>
                </div>
                ${e.plan?a`<span class="provider-usage-plan">${e.plan}</span>`:o}
              </div>
              ${e.error?a`<div class="provider-usage-error">${e.error}</div>`:a`
                    ${e.windows.length>0?a`
                          <div class="provider-usage-windows">
                            ${e.windows.map(e=>{let t=Math.max(0,Math.min(100,e.usedPercent)),n=Math.max(0,100-t),r=ft(e.resetAt);return a`
                                <div class="provider-usage-window">
                                  <div class="provider-usage-window__meta">
                                    <span>${e.label}</span>
                                    <strong
                                      >${d(`usage.providerUsage.remaining`,{percent:n.toFixed(0)})}</strong
                                    >
                                  </div>
                                  <div
                                    class="provider-usage-progress"
                                    role="progressbar"
                                    aria-label=${e.label}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    aria-valuenow=${t.toFixed(0)}
                                  >
                                    <span style=${`width: ${t}%`}></span>
                                  </div>
                                  ${r?a`<div class="provider-usage-reset">
                                        ${d(`usage.providerUsage.resets`,{date:r})}
                                      </div>`:o}
                                </div>
                              `})}
                          </div>
                        `:o}
                    ${e.billing&&e.billing.length>0?a`<div class="provider-usage-billing">
                          ${pt(e)}
                        </div>`:o}
                    ${ht(e)}
                    ${e.summary?a`<div class="provider-usage-summary">${e.summary}</div>`:o}
                  `}
            </article>
          `)}
      </div>
    </section>
  `}function _t(e){let t=e.currentTarget;if(!t.open)return;let n=e=>{e.composedPath().includes(t)||(t.open=!1,window.removeEventListener(`click`,n,!0))};window.addEventListener(`click`,n,!0)}function vt(e){let{data:t,filters:n,display:r,detail:i,callbacks:s}=e,c=s.filters,l=s.display,u=s.details;if(t.loading&&!t.totals)return a`<div class="usage-page">${lt(n)}</div>`;let f=r.chartMode===`tokens`,p=n.query.trim().length>0,m=n.queryDraft.trim().length>0,h=new Set(n.selectedDays),g=new Set(n.selectedSessions),_=[...t.sessions].toSorted((e,t)=>{let n=f?e.usage?.totalTokens??0:e.usage?.totalCost??0;return(f?t.usage?.totalTokens??0:t.usage?.totalCost??0)-n}),v=n.agentId?_.filter(e=>G(e.agentId??``)===G(n.agentId??``)):_,y=h.size>0?v.filter(e=>{if(e.usage?.activityDates?.length)return e.usage.activityDates.some(e=>h.has(e));if(!e.updatedAt)return!1;let t=new Date(e.updatedAt),n=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,`0`)}-${String(t.getDate()).padStart(2,`0`)}`;return h.has(n)}):v,b=te(n.selectedHours.length>0?y.filter(e=>ge(e,n.selectedHours,n.timeZone)):y,n.query),x=b.sessions,S=b.warnings,C=Ie(n.queryDraft,v,t.aggregates),w=P(n.query),ee=e=>{let t=G(e);return w.filter(e=>G(e.key??``)===t).map(e=>e.value).filter(Boolean)},T=e=>{let t=new Set;for(let n of e)n&&t.add(n);return Array.from(t)},E=T([...t.agents,..._.map(e=>e.agentId)]).slice(0,12),O=T(v.map(e=>e.channel)).slice(0,12),k=T([...v.map(e=>e.modelProvider),...v.map(e=>e.providerOverride),...t.aggregates?.byProvider.map(e=>e.provider)??[]]).slice(0,12),A=T([...v.map(e=>e.model),...t.aggregates?.byModel.map(e=>e.model)??[]]).slice(0,12),j=T(t.aggregates?.tools.tools.map(e=>e.name)??[]).slice(0,12),M=n.selectedSessions.length===1?t.sessions.find(e=>e.key===n.selectedSessions[0])??x.find(e=>e.key===n.selectedSessions[0]):null,N=e=>e.reduce((e,t)=>t.usage?ct(e,t.usage):e,st()),F=e=>t.costDaily.filter(t=>e.has(t.date)).reduce((e,t)=>ct(e,t),st()),I,L,R=v.length;if(n.selectedSessions.length>0){let e=x.filter(e=>g.has(e.key));I=N(e),L=e.length}else n.selectedDays.length>0&&n.selectedHours.length===0?(I=F(h),L=x.length):n.selectedHours.length>0||p?(I=N(x),L=x.length):n.agentId?(I=N(v),L=R):(I=t.totals,L=R);let z=n.selectedSessions.length>0?x.filter(e=>g.has(e.key)):p||n.selectedHours.length>0?x:n.selectedDays.length>0?y:_,ne=n.selectedSessions.length>0||p||n.selectedHours.length>0||n.selectedDays.length>0||!!n.agentId,re=ke(ne?z:[],t.aggregates),ie=t.sessionsLimitReached&&!ne,B=ie?N(z):I,ae=ie?ke(z):re,V=ne?o:We(t.costDaily,n.startDate,n.endDate),H=n.selectedSessions.length>0?(()=>{let e=x.filter(e=>g.has(e.key)),n=new Set;for(let t of e)for(let e of t.usage?.activityDates??[])n.add(e);return n.size>0?t.costDaily.filter(e=>n.has(e.date)):t.costDaily})():t.costDaily,oe=Ae(z,B,ae),se=!t.loading&&!t.totals&&t.sessions.length===0,le=D(t.cacheStatus),ue=(B?.missingCostEntries??0)>0||(B?B.totalTokens>0&&B.totalCost===0&&B.input+B.output+B.cacheRead+B.cacheWrite>0:!1),de=[{label:d(`usage.presets.today`),days:1},{label:d(`usage.presets.last7d`),days:7},{label:d(`usage.presets.last30d`),days:30},{label:d(`usage.presets.last90d`),days:90},{label:d(`usage.presets.last1y`),days:365}],fe=e=>{let t=new Date,n=new Date;n.setDate(n.getDate()-(e-1)),c.onStartDateChange(ye(n)),c.onEndDateChange(ye(t))},pe=()=>{c.onStartDateChange(`1970-01-01`),c.onEndDateChange(ye(new Date))},me=(e,t,r)=>{if(r.length===0)return o;let i=ee(e),s=new Set(i.map(e=>G(e))),l=r.length>0&&r.every(e=>s.has(G(e))),u=i.length;return a`
      <details class="usage-filter-select" @toggle=${_t}>
        <summary>
          <span>${t}</span>
          ${u>0?a`<span class="usage-filter-badge">${u}</span>`:a` <span class="usage-filter-badge">${d(`usage.filters.all`)}</span> `}
        </summary>
        <div class="usage-filter-popover">
          <div class="usage-filter-actions">
            <button
              class="btn btn--sm"
              @click=${t=>{t.preventDefault(),t.stopPropagation(),c.onQueryDraftChange(Be(n.queryDraft,e,r))}}
              ?disabled=${l}
            >
              ${d(`usage.filters.selectAll`)}
            </button>
            <button
              class="btn btn--sm"
              @click=${t=>{t.preventDefault(),t.stopPropagation(),c.onQueryDraftChange(Be(n.queryDraft,e,[]))}}
              ?disabled=${u===0}
            >
              ${d(`usage.filters.clear`)}
            </button>
          </div>
          <div class="usage-filter-options">
            ${r.map(t=>a`
                <label class="usage-filter-option">
                  <input
                    type="checkbox"
                    .checked=${s.has(G(t))}
                    @change=${r=>{let i=r.target,a=`${e}:${t}`;c.onQueryDraftChange(i.checked?Re(n.queryDraft,a):ze(n.queryDraft,a))}}
                  />
                  <span>${t}</span>
                </label>
              `)}
          </div>
        </div>
      </details>
    `},he=()=>{let e=n.agentId??``;return a`
      <details class="usage-filter-select">
        <summary>
          <span>${d(`usage.filters.agent`)}</span>
          <span class="usage-filter-badge">${e||d(`usage.filters.all`)}</span>
        </summary>
        <div class="usage-filter-popover">
          <div class="usage-filter-options">
            ${[``,...E].map(t=>a`
                <label class="usage-filter-option">
                  <input
                    type="radio"
                    name="usage-agent-scope"
                    .checked=${e===t}
                    @change=${()=>c.onAgentChange(t||null)}
                  />
                  <span>${t||d(`usage.filters.all`)}</span>
                </label>
              `)}
          </div>
        </div>
      </details>
    `},_e=ye(new Date);return a`
    <div class="usage-page">
      <section class="card usage-header ${r.headerPinned?`pinned`:``}">
        <div class="usage-header-row">
          <div class="usage-header-title">
            <div class="card-title usage-section-title">${d(`usage.filters.title`)}</div>
            ${t.loading||le?a`<span class="usage-refresh-indicator" title=${le??``}>
                  ${d(`usage.loading.badge`)}
                </span>`:o}
            ${se?a`<span class="usage-query-hint">${d(`usage.empty.hint`)}</span>`:o}
          </div>
          <div class="usage-header-metrics">
            ${I?a`
                  <span class="usage-metric-badge">
                    <strong>${U(I.totalTokens)}</strong>
                    ${d(`usage.metrics.tokens`)}
                  </span>
                  <span class="usage-metric-badge">
                    <strong>${W(I.totalCost)}</strong>
                    ${d(`usage.metrics.cost`)}
                  </span>
                  <span class="usage-metric-badge">
                    <strong>${L}</strong>
                    ${d(L===1?`usage.metrics.session`:`usage.metrics.sessions`)}
                  </span>
                `:o}
            <button
              class="btn btn--sm usage-pin-btn ${r.headerPinned?`active`:``}"
              @click=${c.onToggleHeaderPinned}
            >
              ${r.headerPinned?d(`usage.filters.pinned`):d(`usage.filters.pin`)}
            </button>
            <details class="usage-export-menu" @toggle=${_t}>
              <summary class="btn btn--sm">${d(`usage.export.label`)} ▾</summary>
              <div class="usage-export-popover">
                <div class="usage-export-list">
                  <button
                    class="usage-export-item"
                    @click=${()=>je(`openclaw-usage-sessions-${_e}.csv`,Pe(x),`text/csv`)}
                    ?disabled=${x.length===0}
                  >
                    ${d(`usage.export.sessionsCsv`)}
                  </button>
                  <button
                    class="usage-export-item"
                    @click=${()=>je(`openclaw-usage-daily-${_e}.csv`,Fe(H),`text/csv`)}
                    ?disabled=${H.length===0}
                  >
                    ${d(`usage.export.dailyCsv`)}
                  </button>
                  <button
                    class="usage-export-item"
                    @click=${()=>je(`openclaw-usage-${_e}.json`,JSON.stringify({totals:I,sessions:x,daily:H,aggregates:re},null,2),`application/json`)}
                    ?disabled=${x.length===0&&H.length===0}
                  >
                    ${d(`usage.export.json`)}
                  </button>
                </div>
              </div>
            </details>
          </div>
        </div>

        <div class="usage-header-row">
          <div class="usage-controls">
            ${Ue(n.selectedDays,n.selectedHours,n.selectedSessions,t.sessions,c.onClearDays,c.onClearHours,c.onClearSessions,c.onClearFilters)}
            <div class="usage-presets">
              ${de.map(e=>a`
                  <button class="btn btn--sm" @click=${()=>fe(e.days)}>
                    ${e.label}
                  </button>
                `)}
              <button class="btn btn--sm" @click=${pe}>${d(`usage.presets.all`)}</button>
            </div>
            <div class="usage-date-range">
              <input
                class="usage-date-input"
                type="date"
                .value=${n.startDate}
                title=${d(`usage.filters.startDate`)}
                aria-label=${d(`usage.filters.startDate`)}
                @change=${e=>c.onStartDateChange(e.target.value)}
              />
              <span class="usage-separator">${d(`usage.filters.to`)}</span>
              <input
                class="usage-date-input"
                type="date"
                .value=${n.endDate}
                title=${d(`usage.filters.endDate`)}
                aria-label=${d(`usage.filters.endDate`)}
                @change=${e=>c.onEndDateChange(e.target.value)}
              />
            </div>
            <select
              class="usage-select"
              title=${d(`usage.filters.timeZone`)}
              aria-label=${d(`usage.filters.timeZone`)}
              .value=${n.timeZone}
              @change=${e=>c.onTimeZoneChange(e.target.value)}
            >
              <option value="local">${d(`usage.filters.timeZoneLocal`)}</option>
              <option value="utc">${d(`usage.filters.timeZoneUtc`)}</option>
            </select>
            <div class="chart-toggle">
              <button
                class="btn btn--sm toggle-btn ${n.scope===`instance`?`active`:``}"
                title=${d(`usage.scope.instanceHint`)}
                @click=${()=>c.onScopeChange(`instance`)}
              >
                ${d(`usage.scope.instance`)}
              </button>
              <button
                class="btn btn--sm toggle-btn ${n.scope===`family`?`active`:``}"
                title=${d(`usage.scope.familyHint`)}
                @click=${()=>c.onScopeChange(`family`)}
              >
                ${d(`usage.scope.family`)}
              </button>
            </div>
            <div class="chart-toggle">
              <button
                class="btn btn--sm toggle-btn ${f?`active`:``}"
                @click=${()=>l.onChartModeChange(`tokens`)}
              >
                ${d(`usage.metrics.tokens`)}
              </button>
              <button
                class="btn btn--sm toggle-btn ${f?``:`active`}"
                @click=${()=>l.onChartModeChange(`cost`)}
              >
                ${d(`usage.metrics.cost`)}
              </button>
            </div>
            <button
              class="btn btn--sm primary"
              @click=${c.onRefresh}
              ?disabled=${t.loading}
            >
              ${d(`common.refresh`)}
            </button>
          </div>
        </div>

        <div class="usage-query-section">
          <div class="usage-query-bar">
            <input
              class="usage-query-input"
              type="text"
              .value=${n.queryDraft}
              placeholder=${d(`usage.query.placeholder`)}
              @input=${e=>c.onQueryDraftChange(e.target.value)}
              @keydown=${e=>{e.key===`Enter`&&(e.preventDefault(),c.onApplyQuery())}}
            />
            <div class="usage-query-actions">
              <button
                class="btn btn--sm"
                @click=${c.onApplyQuery}
                ?disabled=${t.loading||!m&&!p}
              >
                ${d(`usage.query.apply`)}
              </button>
              ${m||p?a`
                    <button class="btn btn--sm" @click=${c.onClearQuery}>
                      ${d(`usage.filters.clear`)}
                    </button>
                  `:o}
              <span class="usage-query-hint">
                ${p?d(`usage.query.matching`,{shown:String(x.length),total:String(R)}):d(`usage.query.inRange`,{total:String(R)})}
              </span>
            </div>
          </div>
          <div class="usage-filter-row">
            ${he()}
            ${me(`channel`,d(`usage.filters.channel`),O)}
            ${me(`provider`,d(`usage.filters.provider`),k)}
            ${me(`model`,d(`usage.filters.model`),A)}
            ${me(`tool`,d(`usage.filters.tool`),j)}
            <span class="usage-query-hint">${d(`usage.query.tip`)}</span>
          </div>
          ${w.length>0?a`
                <div class="usage-query-chips">
                  ${w.map(e=>{let t=e.raw;return a`
                      <span class="usage-query-chip">
                        ${t}
                        <openclaw-tooltip .content=${d(`usage.filters.remove`)}>
                          <button
                            aria-label=${d(`usage.filters.remove`)}
                            @click=${()=>c.onQueryDraftChange(ze(n.queryDraft,t))}
                          >
                            ×
                          </button>
                        </openclaw-tooltip>
                      </span>
                    `})}
                </div>
              `:o}
          ${C.length>0?a`
                <div class="usage-query-suggestions">
                  ${C.map(e=>a`
                      <button
                        class="usage-query-suggestion"
                        @click=${()=>c.onQueryDraftChange(Le(n.queryDraft,e.value))}
                      >
                        ${e.label}
                      </button>
                    `)}
                </div>
              `:o}
          ${S.length>0?a`
                <div class="callout warning usage-callout usage-callout--tight">
                  ${S.join(` · `)}
                </div>
              `:o}
        </div>

        ${t.error?a`<div class="callout danger usage-callout">${t.error}</div>`:o}
        ${le?a`
              <div class="callout warning usage-callout usage-cache-warning">
                ${d(`usage.cacheStatus.warning`)} ${le}
              </div>
            `:o}
        ${t.sessionsLimitReached?a`
              <div class="callout warning usage-callout">${d(`usage.sessions.limitReached`)}</div>
            `:o}
      </section>

      ${gt(t.providerUsage)}
      ${se?ut(c.onRefresh):a`
            ${Je(B,ae,oe,ue,n.selectedDays.length===0,ce(z,n.timeZone),L,R)}
            ${ve(z,n.timeZone,n.selectedHours,c.onSelectHour)}

            <div class="usage-grid">
              <div class="usage-grid-column">
                <div class="card usage-left-card">
                  ${V}
                  ${Ge(H,n.selectedDays,r.chartMode,r.dailyChartMode,l.onDailyChartModeChange,c.onSelectDay)}
                  ${I?Ke(I,r.chartMode):o}
                </div>
                ${Ye(x,n.selectedSessions,n.selectedDays,f,r.sessionSort,r.sessionSortDir,r.recentSessions,r.sessionsTab,u.onSelectSession,l.onSessionSortChange,l.onSessionSortDirChange,l.onSessionsTabChange,r.visibleColumns,R,c.onClearSessions)}
              </div>
              ${M?a`<div class="usage-grid-column">
                    ${rt(M,i.timeSeries,i.timeSeriesLoading,i.timeSeriesMode,u.onTimeSeriesModeChange,i.timeSeriesBreakdownMode,u.onTimeSeriesBreakdownChange,i.timeSeriesCursorStart,i.timeSeriesCursorEnd,u.onTimeSeriesCursorRangeChange,n.startDate,n.endDate,n.selectedDays,i.sessionLogs,i.sessionLogsLoading,i.sessionLogsExpanded,u.onToggleSessionLogsExpanded,i.logFilters,u.onLogFilterRolesChange,u.onLogFilterToolsChange,u.onLogFilterHasToolsChange,u.onLogFilterQueryChange,u.onLogFilterClear,r.contextExpanded,u.onToggleContextExpanded,c.onClearSessions)}
                  </div>`:o}
            </div>
          `}
    </div>
  `}var yt=[`channel`,`agent`,`provider`,`model`,`messages`,`tools`,`errors`,`duration`];function bt(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function xt(e){if(typeof e==`string`)return e;if(e instanceof Error&&e.message.trim())return e.message;if(e&&typeof e==`object`)try{return JSON.stringify(e)||`request failed`}catch{}return`request failed`}var $=class extends s{constructor(...e){super(...e),this.usageLoading=!0,this.usageResult=null,this.usageCostSummary=null,this.providerUsageSummary=null,this.usageError=null,this.usageStartDate=bt(),this.usageEndDate=bt(),this.usageScope=`family`,this.usageAgentId=null,this.usageSelectedSessions=[],this.usageSelectedDays=[],this.usageSelectedHours=[],this.usageChartMode=`tokens`,this.usageDailyChartMode=`by-type`,this.usageTimeSeriesMode=`per-turn`,this.usageTimeSeriesBreakdownMode=`by-type`,this.usageTimeSeries=null,this.usageTimeSeriesLoading=!1,this.usageTimeSeriesCursorStart=null,this.usageTimeSeriesCursorEnd=null,this.usageSessionLogs=null,this.usageSessionLogsLoading=!1,this.usageSessionLogsExpanded=!1,this.usageQuery=``,this.usageQueryDraft=``,this.usageSessionSort=`recent`,this.usageSessionSortDir=`desc`,this.usageRecentSessions=[],this.usageTimeZone=`local`,this.usageContextExpanded=!1,this.usageHeaderPinned=!1,this.usageSessionsTab=`all`,this.usageVisibleColumns=[...yt],this.usageLogFilterRoles=[],this.usageLogFilterTools=[],this.usageLogFilterHasTools=!1,this.usageLogFilterQuery=``,this.client=null,this.connected=!1,this.usageRequestId=0,this.timeSeriesRequestId=0,this.logsRequestId=0,this.dateDebounceTimer=null,this.queryDebounceTimer=null,this.subscriptions=[],this.routeDataInitialized=!1,this.routeDataEnabled=!0}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.subscriptions=[this.context.gateway.subscribe(e=>this.applyGatewaySnapshot(e)),this.context.agents.subscribe(()=>this.requestUpdate())],this.applyGatewaySnapshot(this.context.gateway.snapshot,!0)}willUpdate(e){e.has(`routeData`)&&this.applyRouteData()}updated(e){e.has(`routeData`)&&this.ensureInitialData()}disconnectedCallback(){for(let e of this.subscriptions)e();this.subscriptions=[],this.clearDateDebounce(),this.clearQueryDebounce(),this.invalidateRequests(),this.client=null,this.connected=!1,super.disconnectedCallback()}applyGatewaySnapshot(e,t=!1){let n=e.client!==this.client,r=e.connected&&!this.connected;if(this.client=e.client,this.connected=e.connected,n&&!t&&this.resetForClientChange(),!e.connected||!e.client){this.invalidateRequests();return}this.context.agents.ensureList(),this.routeDataInitialized&&(n||r)&&this.loadUsage()}applyRouteData(){let e=this.routeData;if(!e||(this.routeDataInitialized=!0,!this.routeDataEnabled))return;let t=this.context.gateway.snapshot;if(e.client!==t.client||e.connected!==t.connected){this.routeDataEnabled=!1,this.usageLoading=!1;return}this.usageStartDate=e.query.startDate,this.usageEndDate=e.query.endDate,this.usageScope=e.query.scope,this.usageTimeZone=e.query.timeZone,this.usageAgentId=e.query.agentId,this.usageResult=e.result,this.usageCostSummary=e.costSummary,this.providerUsageSummary=e.providerUsageSummary,this.usageError=e.error,this.usageLoading=!1}ensureInitialData(){this.routeDataEnabled||!this.routeDataInitialized||!this.client||!this.connected||this.usageLoading||this.loadUsage()}resetForClientChange(){this.clearDateDebounce(),this.invalidateRequests(),this.routeDataEnabled=!1,this.usageResult=null,this.usageCostSummary=null,this.providerUsageSummary=null,this.usageError=null,this.usageAgentId=null,this.clearSelectionsAndDetails()}invalidateRequests(){this.usageRequestId+=1,this.timeSeriesRequestId+=1,this.logsRequestId+=1,this.usageLoading=!1,this.usageTimeSeriesLoading=!1,this.usageSessionLogsLoading=!1}invalidateUsageRequest(){this.usageRequestId+=1,this.routeDataEnabled=!1,this.usageLoading=!1}invalidateDetailRequests(){this.timeSeriesRequestId+=1,this.logsRequestId+=1,this.usageTimeSeriesLoading=!1,this.usageSessionLogsLoading=!1}isCurrentRequest(e,t){let n=this.context.gateway.snapshot;return this.isConnected&&e===this.usageRequestId&&n.client===t}isCurrentDetailRequest(e,t,n,r){let i=this.context.gateway.snapshot;return this.isConnected&&e===t&&i.client===n&&this.usageSelectedSessions.length===1&&this.usageSelectedSessions[0]===r}async loadUsage(){let e=this.client;if(!e||!this.connected||this.usageLoading)return;this.routeDataEnabled=!1;let t=++this.usageRequestId,n=this.usageStartDate,r=this.usageEndDate,i=this.usageScope,a=this.usageTimeZone,o=l(this.usageAgentId??``)||void 0;this.usageLoading=!0,this.usageError=null;try{let s=o?{agentId:o}:{agentScope:`all`},[c,l,u]=await Promise.all([T(e,{startDate:n,endDate:r,agentId:o,scope:i,timeZone:a}),e.request(`usage.cost`,{startDate:n,endDate:r,...s,..._(a)}),e.request(`usage.status`).catch(()=>null)]);if(!this.isCurrentRequest(t,e))return;this.usageResult=c,this.usageCostSummary=l,this.providerUsageSummary=u}catch(n){if(!this.isCurrentRequest(t,e))return;h(n)?(this.usageResult=null,this.usageCostSummary=null,this.usageError=y(`usage`)):this.usageError=xt(n)}finally{this.isCurrentRequest(t,e)&&(this.usageLoading=!1)}}async loadSessionTimeSeries(e){let t=this.client;if(!t||!this.connected)return;let n=++this.timeSeriesRequestId;this.usageTimeSeriesLoading=!0;try{let r=await v(t,e);this.isCurrentDetailRequest(n,this.timeSeriesRequestId,t,e)&&(this.usageTimeSeries=r)}catch{}finally{this.isCurrentDetailRequest(n,this.timeSeriesRequestId,t,e)&&(this.usageTimeSeriesLoading=!1)}}async loadSessionLogs(e){let t=this.client;if(!t||!this.connected)return;let n=++this.logsRequestId;this.usageSessionLogsLoading=!0;try{let r=await p(t,e);if(!this.isCurrentDetailRequest(n,this.logsRequestId,t,e))return;this.usageSessionLogs=Array.isArray(r.logs)?r.logs:null}catch{}finally{this.isCurrentDetailRequest(n,this.logsRequestId,t,e)&&(this.usageSessionLogsLoading=!1)}}clearSelections(){this.usageSelectedDays=[],this.usageSelectedHours=[],this.usageSelectedSessions=[]}clearDetails(){this.invalidateDetailRequests(),this.usageTimeSeries=null,this.usageSessionLogs=null,this.usageTimeSeriesCursorStart=null,this.usageTimeSeriesCursorEnd=null}clearSelectionsAndDetails(){this.clearSelections(),this.clearDetails()}clearDateDebounce(){this.dateDebounceTimer!==null&&(window.clearTimeout(this.dateDebounceTimer),this.dateDebounceTimer=null)}scheduleUsageLoad(){this.clearDateDebounce(),this.invalidateUsageRequest(),this.dateDebounceTimer=window.setTimeout(()=>{this.dateDebounceTimer=null,this.loadUsage()},400)}reloadUsage(){this.clearDateDebounce(),this.invalidateUsageRequest(),this.loadUsage()}clearQueryDebounce(){this.queryDebounceTimer!==null&&(window.clearTimeout(this.queryDebounceTimer),this.queryDebounceTimer=null)}selectSession(e,t){if(this.clearDetails(),this.usageRecentSessions=[e,...this.usageRecentSessions.filter(t=>t!==e)].slice(0,8),this.usageSelectedSessions=k(this.usageSelectedSessions,e,this.usageResult?.sessions??[],this.usageChartMode===`tokens`,t),this.usageSelectedSessions.length===1){let e=this.usageSelectedSessions[0];this.loadSessionTimeSeries(e),this.loadSessionLogs(e)}}render(){let e={data:{loading:this.usageLoading,error:this.usageError,sessions:this.usageResult?.sessions??[],agents:this.context.agents.state.agentsList?.agents.map(e=>e.id).filter(Boolean)??[],sessionsLimitReached:(this.usageResult?.sessions.length??0)>=1e3,totals:this.usageResult?.totals??null,aggregates:this.usageResult?.aggregates??null,costDaily:this.usageCostSummary?.daily??[],cacheStatus:E(this.usageResult?.cacheStatus,this.usageCostSummary?.cacheStatus),providerUsage:this.providerUsageSummary?.providers??[]},filters:{startDate:this.usageStartDate,endDate:this.usageEndDate,scope:this.usageScope,selectedSessions:this.usageSelectedSessions,selectedDays:this.usageSelectedDays,selectedHours:this.usageSelectedHours,agentId:this.usageAgentId,query:this.usageQuery,queryDraft:this.usageQueryDraft,timeZone:this.usageTimeZone},display:{chartMode:this.usageChartMode,dailyChartMode:this.usageDailyChartMode,sessionSort:this.usageSessionSort,sessionSortDir:this.usageSessionSortDir,recentSessions:this.usageRecentSessions,sessionsTab:this.usageSessionsTab,visibleColumns:this.usageVisibleColumns,contextExpanded:this.usageContextExpanded,headerPinned:this.usageHeaderPinned},detail:{timeSeriesMode:this.usageTimeSeriesMode,timeSeriesBreakdownMode:this.usageTimeSeriesBreakdownMode,timeSeries:this.usageTimeSeries,timeSeriesLoading:this.usageTimeSeriesLoading,timeSeriesCursorStart:this.usageTimeSeriesCursorStart,timeSeriesCursorEnd:this.usageTimeSeriesCursorEnd,sessionLogs:this.usageSessionLogs,sessionLogsLoading:this.usageSessionLogsLoading,sessionLogsExpanded:this.usageSessionLogsExpanded,logFilters:{roles:this.usageLogFilterRoles,tools:this.usageLogFilterTools,hasTools:this.usageLogFilterHasTools,query:this.usageLogFilterQuery}},callbacks:{filters:{onStartDateChange:e=>{this.usageStartDate=e,this.clearSelectionsAndDetails(),this.scheduleUsageLoad()},onEndDateChange:e=>{this.usageEndDate=e,this.clearSelectionsAndDetails(),this.scheduleUsageLoad()},onScopeChange:e=>{this.usageScope=e,this.clearSelectionsAndDetails(),this.reloadUsage()},onAgentChange:e=>{this.usageAgentId=e,this.clearSelectionsAndDetails(),this.reloadUsage()},onRefresh:()=>this.reloadUsage(),onTimeZoneChange:e=>{this.usageTimeZone=e,this.clearSelectionsAndDetails(),this.reloadUsage()},onToggleHeaderPinned:()=>{this.usageHeaderPinned=!this.usageHeaderPinned},onSelectHour:(e,t)=>{this.usageSelectedHours=O(this.usageSelectedHours,e,Array.from({length:24},(e,t)=>t),t,!0)},onQueryDraftChange:e=>{this.usageQueryDraft=e,this.clearQueryDebounce(),this.queryDebounceTimer=window.setTimeout(()=>{this.usageQuery=this.usageQueryDraft,this.queryDebounceTimer=null},250)},onApplyQuery:()=>{this.clearQueryDebounce(),this.usageQuery=this.usageQueryDraft},onClearQuery:()=>{this.clearQueryDebounce(),this.usageQueryDraft=``,this.usageQuery=``},onSelectDay:(e,t)=>{this.usageSelectedDays=O(this.usageSelectedDays,e,(this.usageCostSummary?.daily??[]).map(e=>e.date),t,!1)},onClearDays:()=>{this.usageSelectedDays=[]},onClearHours:()=>{this.usageSelectedHours=[]},onClearSessions:()=>{this.usageSelectedSessions=[],this.clearDetails()},onClearFilters:()=>this.clearSelectionsAndDetails()},display:{onChartModeChange:e=>{this.usageChartMode=e},onDailyChartModeChange:e=>{this.usageDailyChartMode=e},onSessionSortChange:e=>{this.usageSessionSort=e},onSessionSortDirChange:e=>{this.usageSessionSortDir=e},onSessionsTabChange:e=>{this.usageSessionsTab=e},onToggleColumn:e=>{this.usageVisibleColumns=this.usageVisibleColumns.includes(e)?this.usageVisibleColumns.filter(t=>t!==e):[...this.usageVisibleColumns,e]}},details:{onToggleContextExpanded:()=>{this.usageContextExpanded=!this.usageContextExpanded},onToggleSessionLogsExpanded:()=>{this.usageSessionLogsExpanded=!this.usageSessionLogsExpanded},onLogFilterRolesChange:e=>{this.usageLogFilterRoles=e},onLogFilterToolsChange:e=>{this.usageLogFilterTools=e},onLogFilterHasToolsChange:e=>{this.usageLogFilterHasTools=e},onLogFilterQueryChange:e=>{this.usageLogFilterQuery=e},onLogFilterClear:()=>{this.usageLogFilterRoles=[],this.usageLogFilterTools=[],this.usageLogFilterHasTools=!1,this.usageLogFilterQuery=``},onSelectSession:(e,t)=>this.selectSession(e,t),onTimeSeriesModeChange:e=>{this.usageTimeSeriesMode=e},onTimeSeriesBreakdownChange:e=>{this.usageTimeSeriesBreakdownMode=e},onTimeSeriesCursorRangeChange:(e,t)=>{this.usageTimeSeriesCursorStart=e,this.usageTimeSeriesCursorEnd=t}}}};return a`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${m(`usage`)}</div>
          <div class="page-sub">${g(`usage`)}</div>
        </div>
      </section>
      ${vt(e)}
    `}};n([t({context:e,subscribe:!1})],$.prototype,`context`,void 0),n([c({attribute:!1})],$.prototype,`routeData`,void 0),n([i()],$.prototype,`usageLoading`,void 0),n([i()],$.prototype,`usageResult`,void 0),n([i()],$.prototype,`usageCostSummary`,void 0),n([i()],$.prototype,`providerUsageSummary`,void 0),n([i()],$.prototype,`usageError`,void 0),n([i()],$.prototype,`usageStartDate`,void 0),n([i()],$.prototype,`usageEndDate`,void 0),n([i()],$.prototype,`usageScope`,void 0),n([i()],$.prototype,`usageAgentId`,void 0),n([i()],$.prototype,`usageSelectedSessions`,void 0),n([i()],$.prototype,`usageSelectedDays`,void 0),n([i()],$.prototype,`usageSelectedHours`,void 0),n([i()],$.prototype,`usageChartMode`,void 0),n([i()],$.prototype,`usageDailyChartMode`,void 0),n([i()],$.prototype,`usageTimeSeriesMode`,void 0),n([i()],$.prototype,`usageTimeSeriesBreakdownMode`,void 0),n([i()],$.prototype,`usageTimeSeries`,void 0),n([i()],$.prototype,`usageTimeSeriesLoading`,void 0),n([i()],$.prototype,`usageTimeSeriesCursorStart`,void 0),n([i()],$.prototype,`usageTimeSeriesCursorEnd`,void 0),n([i()],$.prototype,`usageSessionLogs`,void 0),n([i()],$.prototype,`usageSessionLogsLoading`,void 0),n([i()],$.prototype,`usageSessionLogsExpanded`,void 0),n([i()],$.prototype,`usageQuery`,void 0),n([i()],$.prototype,`usageQueryDraft`,void 0),n([i()],$.prototype,`usageSessionSort`,void 0),n([i()],$.prototype,`usageSessionSortDir`,void 0),n([i()],$.prototype,`usageRecentSessions`,void 0),n([i()],$.prototype,`usageTimeZone`,void 0),n([i()],$.prototype,`usageContextExpanded`,void 0),n([i()],$.prototype,`usageHeaderPinned`,void 0),n([i()],$.prototype,`usageSessionsTab`,void 0),n([i()],$.prototype,`usageVisibleColumns`,void 0),n([i()],$.prototype,`usageLogFilterRoles`,void 0),n([i()],$.prototype,`usageLogFilterTools`,void 0),n([i()],$.prototype,`usageLogFilterHasTools`,void 0),n([i()],$.prototype,`usageLogFilterQuery`,void 0),customElements.define(`openclaw-usage-page`,$);
//# sourceMappingURL=usage-page-CMBG26uV.js.map