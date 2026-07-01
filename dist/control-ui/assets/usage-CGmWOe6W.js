import{h as e,m as t,p as n}from"./lit-runtime-BImxIzGR.js";import{o as r,t as i}from"./string-coerce-BCNOsX82.js";import{$ as a,Z as o,at as s,et as c,jt as l,rt as u}from"./index-BNsbU2Am.js";function d(e){return!e||e.status!==`refreshing`&&e.status!==`stale`&&e.status!==`partial`?null:r(`usage.cacheStatus.title`,{status:r(`usage.cacheStatus.status.${e.status}`),pending:String(e.pendingFiles),stale:String(e.staleFiles),cached:String(e.cachedFiles)})}var f=new Set([`agent`,`channel`,`chat`,`provider`,`model`,`tool`,`label`,`key`,`session`,`id`,`has`,`mintokens`,`maxtokens`,`mincost`,`maxcost`,`minmessages`,`maxmessages`]),p=e=>i(e),m=e=>{let t=e.replace(/[.+^${}()|[\]\\]/g,`\\$&`).replace(/\*/g,`.*`).replace(/\?/g,`.`);return RegExp(`^${t}$`,`i`)},h=e=>{let t=i(e);if(!t)return null;t.startsWith(`$`)&&(t=t.slice(1));let n=1;if(t.endsWith(`k`)?(n=1e3,t=t.slice(0,-1)):t.endsWith(`m`)&&(n=1e6,t=t.slice(0,-1)),!/^\d+(?:\.\d+)?$/.test(t))return null;let r=Number(t)*n;return!Number.isFinite(r)||!Number.isSafeInteger(Math.round(r))?null:r},g=e=>(e.match(/"[^"]+"|\S+/g)??[]).map(e=>{let t=e.replace(/^"|"$/g,``),n=t.indexOf(`:`);return n>0?{key:t.slice(0,n),value:t.slice(n+1),raw:t}:{value:t,raw:t}}),_=e=>[e.label,e.key,e.sessionId].filter(e=>!!e).map(e=>i(e)),v=e=>{let t=new Set;e.modelProvider&&t.add(i(e.modelProvider)),e.providerOverride&&t.add(i(e.providerOverride)),e.origin?.provider&&t.add(i(e.origin.provider));for(let n of e.usage?.modelUsage??[])n.provider&&t.add(i(n.provider));return Array.from(t)},y=e=>{let t=new Set;e.model&&t.add(i(e.model));for(let n of e.usage?.modelUsage??[])n.model&&t.add(i(n.model));return Array.from(t)},b=e=>(e.usage?.toolUsage?.tools??[]).map(e=>i(e.name)),x=(e,t)=>{let n=p(t.value??``);if(!n)return!0;if(!t.key)return _(e).some(e=>e.includes(n));switch(p(t.key)){case`agent`:return i(e.agentId).includes(n);case`channel`:return i(e.channel).includes(n);case`chat`:return i(e.chatType).includes(n);case`provider`:return v(e).some(e=>e.includes(n));case`model`:return y(e).some(e=>e.includes(n));case`tool`:return b(e).some(e=>e.includes(n));case`label`:return i(e.label).includes(n);case`key`:case`session`:case`id`:if(n.includes(`*`)||n.includes(`?`)){let t=m(n);return t.test(e.key)||(e.sessionId?t.test(e.sessionId):!1)}return i(e.key).includes(n)||i(e.sessionId).includes(n);case`has`:switch(n){case`tools`:return(e.usage?.toolUsage?.totalCalls??0)>0;case`errors`:return(e.usage?.messageCounts?.errors??0)>0;case`context`:return!!e.contextWeight;case`usage`:return!!e.usage;case`model`:return y(e).length>0;case`provider`:return v(e).length>0;default:return!0}case`mintokens`:{let t=h(n);return t===null?!0:(e.usage?.totalTokens??0)>=t}case`maxtokens`:{let t=h(n);return t===null?!0:(e.usage?.totalTokens??0)<=t}case`mincost`:{let t=h(n);return t===null?!0:(e.usage?.totalCost??0)>=t}case`maxcost`:{let t=h(n);return t===null?!0:(e.usage?.totalCost??0)<=t}case`minmessages`:{let t=h(n);return t===null?!0:(e.usage?.messageCounts?.total??0)>=t}case`maxmessages`:{let t=h(n);return t===null?!0:(e.usage?.messageCounts?.total??0)<=t}default:return!0}},ee=(e,t)=>{let n=g(t);if(n.length===0)return{sessions:e,warnings:[]};let r=[];for(let e of n){if(!e.key)continue;let t=p(e.key);if(!f.has(t)){r.push(`Unknown filter: ${e.key}`);continue}if(e.value===``&&r.push(`Missing value for ${e.key}`),t===`has`){let t=new Set([`tools`,`errors`,`context`,`usage`,`model`,`provider`]);e.value&&!t.has(p(e.value))&&r.push(`Unknown has:${e.value}`)}[`mintokens`,`maxtokens`,`mincost`,`maxcost`,`minmessages`,`maxmessages`].includes(t)&&e.value&&h(e.value)===null&&r.push(`Invalid number for ${e.key}`)}return{sessions:e.filter(e=>n.every(t=>x(e,t))),warnings:r}};function S(e){let t=e.split(`
`),n=new Map,r=[];for(let e of t){let t=/^\[Tool:\s*([^\]]+)\]/.exec(e.trim());if(t){let e=t[1];n.set(e,(n.get(e)??0)+1);continue}e.trim().startsWith(`[Tool Result]`)||r.push(e)}let i=Array.from(n.entries()).toSorted((e,t)=>t[1]-e[1]),a=i.reduce((e,[,t])=>e+t,0);return{tools:i,summary:i.length>0?`Tools: ${i.map(([e,t])=>`${e}×${t}`).join(`, `)} (${a} calls)`:``,cleanContent:r.join(`
`).trim()}}function C(e,t){!t||t.count<=0||(e.count+=t.count,e.sum+=t.avgMs*t.count,e.min=Math.min(e.min,t.minMs),e.max=Math.max(e.max,t.maxMs),e.p95Max=Math.max(e.p95Max,t.p95Ms))}function w(e,t){for(let n of t??[]){let t=e.get(n.date)??{date:n.date,count:0,sum:0,min:1/0,max:0,p95Max:0};t.count+=n.count,t.sum+=n.avgMs*n.count,t.min=Math.min(t.min,n.minMs),t.max=Math.max(t.max,n.maxMs),t.p95Max=Math.max(t.p95Max,n.p95Ms),e.set(n.date,t)}}function T(e){return{byChannel:Array.from(e.byChannelMap.entries()).map(([e,t])=>({channel:e,totals:t})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),latency:e.latencyTotals.count>0?{count:e.latencyTotals.count,avgMs:e.latencyTotals.sum/e.latencyTotals.count,minMs:e.latencyTotals.min===1/0?0:e.latencyTotals.min,maxMs:e.latencyTotals.max,p95Ms:e.latencyTotals.p95Max}:void 0,dailyLatency:Array.from(e.dailyLatencyMap.values()).map(e=>({date:e.date,count:e.count,avgMs:e.count?e.sum/e.count:0,minMs:e.min===1/0?0:e.min,maxMs:e.max,p95Ms:e.p95Max})).toSorted((e,t)=>e.date.localeCompare(t.date)),modelDaily:Array.from(e.modelDailyMap.values()).toSorted((e,t)=>e.date.localeCompare(t.date)||t.cost-e.cost),daily:Array.from(e.dailyMap.values()).toSorted((e,t)=>e.date.localeCompare(t.date))}}var E=4;function D(e){return Math.round(e/E)}function O(e){return e>=1e6?`${(e/1e6).toFixed(1)}M`:e>=1e3?`${(e/1e3).toFixed(1)}K`:String(e)}function k(e){let t=new Date;return t.setHours(e,0,0,0),t.toLocaleTimeString(void 0,{hour:`numeric`})}function A(e,t,n){let r=e.usage;if(!r)return!1;let i=r.firstActivity??e.updatedAt,a=r.lastActivity??e.updatedAt;if(!i||!a)return!1;let o=Math.min(i,a),s=Math.max(i,a),c=Math.max(s-o,1)/6e4,l=o;for(;l<s;){let e=new Date(l),i=F(e,t),a=Math.min(i.getTime(),s),o=Math.max((a-l)/6e4,0);n({usage:r,hour:j(e,t),weekday:M(e,t),share:o/c}),l=a+1}return!0}function te(e,t){let n=Array.from({length:24},()=>0),a=Array.from({length:24},()=>0);for(let r of e){let e=r.usage;if(!(!e?.messageCounts||e.messageCounts.total===0)){if(e.utcQuarterHourMessageCounts&&e.utcQuarterHourMessageCounts.length>0){for(let r of e.utcQuarterHourMessageCounts){let e=P(r.date,r.quarterIndex,t);e&&(n[e.hour]+=r.errors,a[e.hour]+=r.total)}continue}A(r,t,({hour:t,share:r})=>{n[t]+=e.messageCounts.errors*r,a[t]+=e.messageCounts.total*r})}}return a.map((e,t)=>{let r=n[t];return{hour:t,rate:e>0?r/e:0,errors:r,msgs:e}}).filter(e=>e.msgs>0&&e.errors>0).toSorted((e,t)=>t.rate-e.rate).slice(0,5).map(e=>({label:k(e.hour),value:`${(e.rate*100).toFixed(2)}%`,sub:`${Math.round(e.errors)} ${i(r(`usage.overview.errors`))} · ${Math.round(e.msgs)} ${r(`usage.overview.messagesAbbrev`)}`}))}function j(e,t){return t===`utc`?e.getUTCHours():e.getHours()}function M(e,t){return t===`utc`?e.getUTCDay():e.getDay()}function N(e,t){let n=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!n||!Number.isInteger(t)||t<0||t>95)return null;let[,r,i,a]=n,o=Number(r),s=Number(i),c=Number(a),l=new Date(Date.UTC(o,s-1,c,0,t*15));return Number.isNaN(l.valueOf())||l.getUTCFullYear()!==o||l.getUTCMonth()!==s-1||l.getUTCDate()!==c?null:l}function P(e,t,n){let r=N(e,t);return r?{hour:j(r,n),weekday:M(r,n)}:null}function F(e,t){let n=new Date(e);return t===`utc`?n.setUTCMinutes(59,59,999):n.setMinutes(59,59,999),n}function I(e,t,n){let r=e.usage?.utcQuarterHourTokenUsage;if(!r||r.length===0)return!1;let i=!1;for(let e of r){if(e.totalTokens<=0)continue;let r=P(e.date,e.quarterIndex,t);r&&(i=!0,n({hour:r.hour,weekday:r.weekday,tokens:e.totalTokens}))}return i}function L(e,t,n){let r=e.usage,i=r?.firstActivity??e.updatedAt,a=r?.lastActivity??e.updatedAt;if(!i||!a)return!1;let o=Math.min(i,a),s=Math.max(i,a),c=o;for(;c<=s;){let e=new Date(c),r=j(e,n);if(t.includes(r))return!0;let i=F(e,n);c=Math.min(i.getTime(),s)+1}return!1}function ne(e,t,n){if(t.length===0)return!0;let r=!1;return I(e,n,({hour:e})=>{t.includes(e)&&(r=!0)})?r:L(e,t,n)}function R(e,t){let n=Array.from({length:24},()=>0),i=Array.from({length:7},()=>0),a=0,o=!1;for(let r of e){let e=r.usage;if(!(!e||!e.totalTokens||e.totalTokens<=0)){if(a+=e.totalTokens,I(r,t,({hour:e,weekday:t,tokens:r})=>{n[e]+=r,i[t]+=r})){o=!0;continue}A(r,t,({usage:e,hour:t,weekday:r,share:a})=>{n[t]+=e.totalTokens*a,i[r]+=e.totalTokens*a})&&(o=!0)}}let s=[r(`usage.mosaic.sun`),r(`usage.mosaic.mon`),r(`usage.mosaic.tue`),r(`usage.mosaic.wed`),r(`usage.mosaic.thu`),r(`usage.mosaic.fri`),r(`usage.mosaic.sat`)].map((e,t)=>({label:e,tokens:i[t]}));return{hasData:o,totalTokens:a,hourTotals:n,weekdayTotals:s}}function re(e,n,a,o){let s=R(e,n);if(!s.hasData)return t`
      <div class="card usage-mosaic">
        <div class="usage-mosaic-header">
          <div>
            <div class="usage-mosaic-title">${r(`usage.mosaic.title`)}</div>
            <div class="usage-mosaic-sub">${r(`usage.mosaic.subtitleEmpty`)}</div>
          </div>
          <div class="usage-mosaic-total">
            ${O(0)} ${i(r(`usage.metrics.tokens`))}
          </div>
        </div>
        <div class="usage-empty-block usage-empty-block--compact">
          ${r(`usage.mosaic.noTimelineData`)}
        </div>
      </div>
    `;let c=Math.max(...s.hourTotals,1),l=Math.max(...s.weekdayTotals.map(e=>e.tokens),1);return t`
    <div class="card usage-mosaic">
      <div class="usage-mosaic-header">
        <div>
          <div class="usage-mosaic-title">${r(`usage.mosaic.title`)}</div>
          <div class="usage-mosaic-sub">
            ${r(`usage.mosaic.subtitle`,{zone:r(n===`utc`?`usage.filters.timeZoneUtc`:`usage.filters.timeZoneLocal`)})}
          </div>
        </div>
        <div class="usage-mosaic-total">
          ${O(s.totalTokens)}
          ${i(r(`usage.metrics.tokens`))}
        </div>
      </div>
      <div class="usage-mosaic-grid">
        <div class="usage-mosaic-section">
          <div class="usage-mosaic-section-title">${r(`usage.mosaic.dayOfWeek`)}</div>
          <div class="usage-daypart-grid">
            ${s.weekdayTotals.map(e=>{let n=Math.min(e.tokens/l,1);return t`
                <div class="usage-daypart-cell" style="background: ${e.tokens>0?`color-mix(in srgb, var(--accent) ${(12+n*60).toFixed(1)}%, transparent)`:`transparent`};">
                  <div class="usage-daypart-label">${e.label}</div>
                  <div class="usage-daypart-value">${O(e.tokens)}</div>
                </div>
              `})}
          </div>
        </div>
        <div class="usage-mosaic-section">
          <div class="usage-mosaic-section-title">
            <span>${r(`usage.filters.hours`)}</span>
            <span class="usage-mosaic-sub">0 → 23</span>
          </div>
          <div class="usage-hour-grid">
            ${s.hourTotals.map((e,n)=>{let s=Math.min(e/c,1),l=e>0?`color-mix(in srgb, var(--accent) ${(8+s*70).toFixed(1)}%, transparent)`:`transparent`,u=`${n}:00 · ${O(e)} ${i(r(`usage.metrics.tokens`))}`,d=s>.7?`color-mix(in srgb, var(--accent) 60%, transparent)`:`color-mix(in srgb, var(--accent) 24%, transparent)`;return t`
                <div
                  class="usage-hour-cell ${a.includes(n)?`selected`:``}"
                  style="background: ${l}; border-color: ${d};"
                  title="${u}"
                  @click=${e=>o(n,e.shiftKey)}
                ></div>
              `})}
          </div>
          <div class="usage-hour-labels">
            <span>${r(`usage.mosaic.midnight`)}</span>
            <span>${r(`usage.mosaic.fourAm`)}</span>
            <span>${r(`usage.mosaic.eightAm`)}</span>
            <span>${r(`usage.mosaic.noon`)}</span>
            <span>${r(`usage.mosaic.fourPm`)}</span>
            <span>${r(`usage.mosaic.eightPm`)}</span>
          </div>
          <div class="usage-hour-legend">
            <span></span>
            ${r(`usage.mosaic.legend`)}
          </div>
        </div>
      </div>
    </div>
  `}function z(e,t=2){return`$${e.toFixed(t)}`}function ie(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function B(e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!t)return null;let[,n,r,i]=t,a=Number(n),o=Number(r)-1,s=Number(i),c=new Date(a,o,s);return Number.isNaN(c.valueOf())||c.getFullYear()!==a||c.getMonth()!==o||c.getDate()!==s?null:c}function ae(e){let t=B(e);return t?t.toLocaleDateString(void 0,{month:`short`,day:`numeric`}):e}function V(e){let t=B(e);return t?t.toLocaleDateString(void 0,{month:`long`,day:`numeric`,year:`numeric`}):e}var H=()=>({input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0}),U=(e,t)=>{e.input+=t.input??0,e.output+=t.output??0,e.cacheRead+=t.cacheRead??0,e.cacheWrite+=t.cacheWrite??0,e.totalTokens+=t.totalTokens??0,e.totalCost+=t.totalCost??0,e.inputCost+=t.inputCost??0,e.outputCost+=t.outputCost??0,e.cacheReadCost+=t.cacheReadCost??0,e.cacheWriteCost+=t.cacheWriteCost??0,e.missingCostEntries+=t.missingCostEntries??0},W=(e,t)=>{if(e.length===0)return t??{messages:{total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},tools:{totalCalls:0,uniqueTools:0,tools:[]},byModel:[],byProvider:[],byAgent:[],byChannel:[],daily:[]};let n={total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},r=new Map,i=new Map,a=new Map,o=new Map,s=new Map,c=new Map,l=new Map,u=new Map,d={count:0,sum:0,min:1/0,max:0,p95Max:0};for(let t of e){let e=t.usage;if(e){if(e.messageCounts&&(n.total+=e.messageCounts.total,n.user+=e.messageCounts.user,n.assistant+=e.messageCounts.assistant,n.toolCalls+=e.messageCounts.toolCalls,n.toolResults+=e.messageCounts.toolResults,n.errors+=e.messageCounts.errors),e.toolUsage)for(let t of e.toolUsage.tools)r.set(t.name,(r.get(t.name)??0)+t.count);if(e.modelUsage)for(let t of e.modelUsage){let e=`${t.provider??`unknown`}::${t.model??`unknown`}`,n=i.get(e)??{provider:t.provider,model:t.model,count:0,totals:H()};n.count+=t.count,U(n.totals,t.totals),i.set(e,n);let r=t.provider??`unknown`,o=a.get(r)??{provider:t.provider,model:void 0,count:0,totals:H()};o.count+=t.count,U(o.totals,t.totals),a.set(r,o)}if(C(d,e.latency),t.agentId){let n=o.get(t.agentId)??H();U(n,e),o.set(t.agentId,n)}if(t.channel){let n=s.get(t.channel)??H();U(n,e),s.set(t.channel,n)}for(let t of e.dailyBreakdown??[]){let e=c.get(t.date)??{date:t.date,tokens:0,cost:0,messages:0,toolCalls:0,errors:0};e.tokens+=t.tokens,e.cost+=t.cost,c.set(t.date,e)}for(let t of e.dailyMessageCounts??[]){let e=c.get(t.date)??{date:t.date,tokens:0,cost:0,messages:0,toolCalls:0,errors:0};e.messages+=t.total,e.toolCalls+=t.toolCalls,e.errors+=t.errors,c.set(t.date,e)}w(l,e.dailyLatency);for(let t of e.dailyModelUsage??[]){let e=`${t.date}::${t.provider??`unknown`}::${t.model??`unknown`}`,n=u.get(e)??{date:t.date,provider:t.provider,model:t.model,tokens:0,cost:0,count:0};n.tokens+=t.tokens,n.cost+=t.cost,n.count+=t.count,u.set(e,n)}}}let f=T({byChannelMap:s,latencyTotals:d,dailyLatencyMap:l,modelDailyMap:u,dailyMap:c});return{messages:n,tools:{totalCalls:Array.from(r.values()).reduce((e,t)=>e+t,0),uniqueTools:r.size,tools:Array.from(r.entries()).map(([e,t])=>({name:e,count:t})).toSorted((e,t)=>t.count-e.count)},byModel:Array.from(i.values()).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),byProvider:Array.from(a.values()).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),byAgent:Array.from(o.entries()).map(([e,t])=>({agentId:e,totals:t})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),...f}},oe=(e,t,n)=>{let r=0,i=0;for(let t of e){let e=t.usage?.durationMs??0;e>0&&(r+=e,i+=1)}let a=i?r/i:0,o=t&&r>0?t.totalTokens/(r/6e4):void 0,s=t&&r>0?t.totalCost/(r/6e4):void 0,c=n.messages.total?n.messages.errors/n.messages.total:0,l;for(let e of n.daily){if(e.messages<=0||e.errors<=0)continue;let t={date:e.date,errors:e.errors,messages:e.messages,rate:e.errors/e.messages};(!l||t.rate>l.rate||t.rate===l.rate&&t.errors>l.errors)&&(l=t)}return{durationSumMs:r,durationCount:i,avgDurationMs:a,throughputTokensPerMin:o,throughputCostPerMin:s,errorRate:c,peakErrorDay:l}};function se(e,t,n=`text/plain`){let r=new Blob([t],{type:`${n};charset=utf-8`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=e,a.click(),URL.revokeObjectURL(i)}function ce(e){return/[",\n]/.test(e)?`"${e.replaceAll(`"`,`""`)}"`:e}function G(e){return e.map(e=>e==null?``:ce(String(e))).join(`,`)}var le=e=>{let t=[G([`key`,`label`,`agentId`,`channel`,`provider`,`model`,`updatedAt`,`durationMs`,`messages`,`errors`,`toolCalls`,`inputTokens`,`outputTokens`,`cacheReadTokens`,`cacheWriteTokens`,`totalTokens`,`totalCost`])];for(let n of e){let e=n.usage;t.push(G([n.key,n.label??``,n.agentId??``,n.channel??``,n.modelProvider??n.providerOverride??``,n.model??n.modelOverride??``,s(n.updatedAt)??``,e?.durationMs??``,e?.messageCounts?.total??``,e?.messageCounts?.errors??``,e?.messageCounts?.toolCalls??``,e?.input??``,e?.output??``,e?.cacheRead??``,e?.cacheWrite??``,e?.totalTokens??``,e?.totalCost??``]))}return t.join(`
`)},ue=e=>{let t=[G([`date`,`inputTokens`,`outputTokens`,`cacheReadTokens`,`cacheWriteTokens`,`totalTokens`,`inputCost`,`outputCost`,`cacheReadCost`,`cacheWriteCost`,`totalCost`])];for(let n of e)t.push(G([n.date,n.input,n.output,n.cacheRead,n.cacheWrite,n.totalTokens,n.inputCost??``,n.outputCost??``,n.cacheReadCost??``,n.cacheWriteCost??``,n.totalCost]));return t.join(`
`)},de=(e,t,n)=>{let r=e.trim();if(!r)return[];let a=r.length?r.split(/\s+/):[],o=a.length?a[a.length-1]:``,[s,c]=o.includes(`:`)?[o.slice(0,o.indexOf(`:`)),o.slice(o.indexOf(`:`)+1)]:[``,``],u=i(s),d=i(c),f=e=>l(e.filter(e=>!!e)),p=f(t.map(e=>e.agentId)).slice(0,6),m=f(t.map(e=>e.channel)).slice(0,6),h=f([...t.map(e=>e.modelProvider),...t.map(e=>e.providerOverride),...n?.byProvider.map(e=>e.provider)??[]]).slice(0,6),g=f([...t.map(e=>e.model),...n?.byModel.map(e=>e.model)??[]]).slice(0,6),_=f(n?.tools.tools.map(e=>e.name)??[]).slice(0,6);if(!u)return[{label:`agent:`,value:`agent:`},{label:`channel:`,value:`channel:`},{label:`provider:`,value:`provider:`},{label:`model:`,value:`model:`},{label:`tool:`,value:`tool:`},{label:`has:errors`,value:`has:errors`},{label:`has:tools`,value:`has:tools`},{label:`minTokens:`,value:`minTokens:`},{label:`maxCost:`,value:`maxCost:`}];let v=[],y=(e,t)=>{for(let n of t)(!d||i(n).includes(d))&&v.push({label:`${e}:${n}`,value:`${e}:${n}`})};switch(u){case`agent`:y(`agent`,p);break;case`channel`:y(`channel`,m);break;case`provider`:y(`provider`,h);break;case`model`:y(`model`,g);break;case`tool`:y(`tool`,_);break;case`has`:[`errors`,`tools`,`context`,`usage`,`model`,`provider`].forEach(e=>{(!d||e.includes(d))&&v.push({label:`has:${e}`,value:`has:${e}`})});break;default:break}return v},fe=(e,t)=>{let n=e.trim();if(!n)return`${t} `;let r=n.split(/\s+/);return r[r.length-1]=t,`${r.join(` `)} `},K=e=>i(e),pe=(e,t)=>{let n=e.trim();if(!n)return`${t} `;let r=n.split(/\s+/),i=r[r.length-1]??``,a=t.includes(`:`)?t.split(`:`)[0]:null,o=i.includes(`:`)?i.split(`:`)[0]:null;return i.endsWith(`:`)&&a&&o===a?(r[r.length-1]=t,`${r.join(` `)} `):r.includes(t)?`${r.join(` `)} `:`${r.join(` `)} ${t} `},me=(e,t)=>{let n=e.trim().split(/\s+/).filter(Boolean).filter(e=>e!==t);return n.length?`${n.join(` `)} `:``},he=(e,t,n)=>{let r=K(t),i=[...g(e).filter(e=>K(e.key??``)!==r).map(e=>e.raw),...n.map(e=>`${t}:${e}`)];return i.length?`${i.join(` `)} `:``};function q(e,t){return t===0?0:e/t*100}var ge=8,_e=8,J=null,Y=null,ve=!1,ye=null,be=!1,xe=null;function Se(e,t,n){return Math.min(Math.max(e,t),Math.max(t,n))}function Ce(){return Y||(Y=document.createElement(`div`),Y.className=`daily-bar-tooltip daily-bar-tooltip--floating`),Y.isConnected||document.body.append(Y),Y}function we(e,t){let n=document.createElement(`strong`);n.textContent=t.dateLabel;let r=[n,document.createElement(`br`),document.createTextNode(t.tokensLabel),document.createElement(`br`),document.createTextNode(t.costLabel)];for(let e of t.breakdownLines){let t=document.createElement(`div`);t.textContent=e,r.push(t)}e.replaceChildren(...r)}function Te(){if(!J)return;if(!J.source.isConnected){je();return}let e=Ce(),t=J.source.getBoundingClientRect();e.style.visibility=`hidden`,e.style.left=`0px`,e.style.top=`0px`;let n=e.getBoundingClientRect(),r=window.innerWidth||document.documentElement.clientWidth,i=window.innerHeight||document.documentElement.clientHeight,a=r-n.width-ge,o=i-n.height-ge,s=Se(t.left+t.width/2-n.width/2,ge,a),c=t.top-n.height-_e,l=`above`;c<ge&&(l=`below`,c=t.bottom+_e),e.dataset.placement=l,e.style.left=`${Math.round(s)}px`,e.style.top=`${Math.round(Se(c,ge,o))}px`,e.style.visibility=``}function Ee(){ve||=(window.addEventListener(`resize`,Te),window.addEventListener(`scroll`,Te,!0),!0)}function De(){ve&&=(window.removeEventListener(`resize`,Te),window.removeEventListener(`scroll`,Te,!0),!1)}function Oe(){ye||(ye=new MutationObserver(()=>{J&&!J.source.isConnected&&je()}),ye.observe(document.body,{childList:!0,subtree:!0}))}function ke(){ye?.disconnect(),ye=null}function Ae(e,t,n){(!J||J.source!==e)&&(J={source:e,reasons:new Set,content:t}),J.content=t,J.reasons.add(n),we(Ce(),t),Te(),Ee(),Oe()}function je(e,t){J&&(e&&J.source!==e||t&&(J.reasons.delete(t),J.reasons.size>0)||(J=null,Y?.remove(),De(),ke()))}function Me(){be=!0,xe!==null&&window.clearTimeout(xe),xe=window.setTimeout(()=>{be=!1,xe=null},0)}function Ne(e,t){be||Ae(e,t,`focus`)}function Pe(e,t,n){e.key!==`Enter`&&e.key!==` `||(e.preventDefault(),n(t,e.shiftKey))}function Fe(e){let t=e.totalCost||0;return{input:{tokens:e.input,cost:e.inputCost||0,pct:q(e.inputCost||0,t)},output:{tokens:e.output,cost:e.outputCost||0,pct:q(e.outputCost||0,t)},cacheRead:{tokens:e.cacheRead,cost:e.cacheReadCost||0,pct:q(e.cacheReadCost||0,t)},cacheWrite:{tokens:e.cacheWrite,cost:e.cacheWriteCost||0,pct:q(e.cacheWriteCost||0,t)},totalCost:t}}function Ie(e,i,a,o,s,c,l,u){if(!(e.length>0||i.length>0||a.length>0))return n;let d=a.length===1?o.find(e=>e.key===a[0]):null,f=d?(d.label||d.key).slice(0,20)+((d.label||d.key).length>20?`…`:``):a.length===1?a[0].slice(0,8)+`…`:r(`usage.filters.sessionsCount`,{count:String(a.length)}),p=d?d.label||d.key:a.length===1?a[0]:a.join(`, `),m=e.length===1?e[0]:r(`usage.filters.daysCount`,{count:String(e.length)}),h=i.length===1?`${i[0]}:00`:r(`usage.filters.hoursCount`,{count:String(i.length)});return t`
    <div class="active-filters">
      ${e.length>0?t`
            <div class="filter-chip">
              <span class="filter-chip-label">${r(`usage.filters.days`)}: ${m}</span>
              <button
                class="filter-chip-remove"
                @click=${s}
                title=${r(`usage.filters.remove`)}
                aria-label="Remove days filter"
              >
                ×
              </button>
            </div>
          `:n}
      ${i.length>0?t`
            <div class="filter-chip">
              <span class="filter-chip-label">${r(`usage.filters.hours`)}: ${h}</span>
              <button
                class="filter-chip-remove"
                @click=${c}
                title=${r(`usage.filters.remove`)}
                aria-label="Remove hours filter"
              >
                ×
              </button>
            </div>
          `:n}
      ${a.length>0?t`
            <div class="filter-chip" title="${p}">
              <span class="filter-chip-label">${r(`usage.filters.session`)}: ${f}</span>
              <button
                class="filter-chip-remove"
                @click=${l}
                title=${r(`usage.filters.remove`)}
                aria-label="Remove session filter"
              >
                ×
              </button>
            </div>
          `:n}
      ${(e.length>0||i.length>0)&&a.length>0?t`
            <button class="btn btn--sm" @click=${u}>
              ${r(`usage.filters.clearAll`)}
            </button>
          `:n}
    </div>
  `}function Le(e,a,o,s,c,l){if(!e.length)return t`
      <div class="daily-chart-compact">
        <div class="card-title usage-section-title">${r(`usage.daily.title`)}</div>
        <div class="usage-empty-block">${r(`usage.empty.noData`)}</div>
      </div>
    `;let u=o===`tokens`,d=e.map(e=>u?e.totalTokens:e.totalCost),f=Math.max(...d,u?1:1e-4),p=d.filter(e=>e>0),m=f/(p.length>0?Math.min(...p):f),h=d.map(e=>{if(e<=0)return 0;let t=m>50?Math.sqrt(e/f):e/f;return Math.max(6,t*200)}),g=e.length>30?12:e.length>20?18:e.length>14?24:32,_=e.length<=14;return t`
    <div class="daily-chart-compact">
      <div class="daily-chart-header">
        <div class="chart-toggle small sessions-toggle">
          <button
            class="btn btn--sm toggle-btn ${s===`total`?`active`:``}"
            @click=${()=>c(`total`)}
          >
            ${r(`usage.daily.total`)}
          </button>
          <button
            class="btn btn--sm toggle-btn ${s===`by-type`?`active`:``}"
            @click=${()=>c(`by-type`)}
          >
            ${r(`usage.daily.byType`)}
          </button>
        </div>
        <div class="card-title">
          ${r(u?`usage.daily.tokensTitle`:`usage.daily.costTitle`)}
        </div>
      </div>
      <div class="daily-chart">
        <div class="daily-chart-bars" style="--bar-max-width: ${g}px">
          ${e.map((o,c)=>{let d=h[c],f=a.includes(o.date),p=ae(o.date),m=e.length>20?String(Number.parseInt(o.date.slice(8),10)):p,g=e.length>20?`daily-bar-label daily-bar-label--compact`:`daily-bar-label`,v=s===`by-type`?u?[{value:o.output,class:`output`},{value:o.input,class:`input`},{value:o.cacheWrite,class:`cache-write`},{value:o.cacheRead,class:`cache-read`}]:[{value:o.outputCost??0,class:`output`},{value:o.inputCost??0,class:`input`},{value:o.cacheWriteCost??0,class:`cache-write`},{value:o.cacheReadCost??0,class:`cache-read`}]:[],y=s===`by-type`?u?[`${r(`usage.breakdown.output`)} ${O(o.output)}`,`${r(`usage.breakdown.input`)} ${O(o.input)}`,`${r(`usage.breakdown.cacheWrite`)} ${O(o.cacheWrite)}`,`${r(`usage.breakdown.cacheRead`)} ${O(o.cacheRead)}`]:[`${r(`usage.breakdown.output`)} ${z(o.outputCost??0)}`,`${r(`usage.breakdown.input`)} ${z(o.inputCost??0)}`,`${r(`usage.breakdown.cacheWrite`)} ${z(o.cacheWriteCost??0)}`,`${r(`usage.breakdown.cacheRead`)} ${z(o.cacheReadCost??0)}`]:[],b=u?O(o.totalTokens):z(o.totalCost),x={dateLabel:V(o.date),tokensLabel:`${O(o.totalTokens)} ${i(r(`usage.metrics.tokens`))}`.trim(),costLabel:z(o.totalCost),breakdownLines:y};return t`
              <div
                class="daily-bar-wrapper ${f?`selected`:``}"
                role="button"
                tabindex="0"
                aria-pressed=${f?`true`:`false`}
                aria-label=${`${x.dateLabel}: ${x.tokensLabel}, ${x.costLabel}`}
                @pointerdown=${Me}
                @mouseenter=${e=>Ae(e.currentTarget,x,`hover`)}
                @mouseleave=${e=>je(e.currentTarget,`hover`)}
                @focus=${e=>Ne(e.currentTarget,x)}
                @blur=${e=>je(e.currentTarget,`focus`)}
                @keydown=${e=>Pe(e,o.date,l)}
                @click=${e=>l(o.date,e.shiftKey)}
              >
                ${s===`by-type`?t`
                      <div
                        class="daily-bar daily-bar--stacked"
                        style="height: ${d.toFixed(0)}px;"
                      >
                        ${(()=>{let e=v.reduce((e,t)=>e+t.value,0)||1;return v.map(n=>t`
                              <div
                                class="cost-segment ${n.class}"
                                style="height: ${n.value/e*100}%"
                              ></div>
                            `)})()}
                      </div>
                    `:t` <div class="daily-bar" style="height: ${d.toFixed(0)}px"></div> `}
                ${_?t`<div class="daily-bar-total">${b}</div>`:n}
                <div class="${g}">${m}</div>
              </div>
            `})}
        </div>
      </div>
    </div>
  `}function Re(e,n){let i=Fe(e),a=n===`tokens`,o=e.totalTokens||1,s={output:q(e.output,o),input:q(e.input,o),cacheWrite:q(e.cacheWrite,o),cacheRead:q(e.cacheRead,o)};return t`
    <div class="cost-breakdown cost-breakdown-compact">
      <div class="cost-breakdown-header">
        ${r(a?`usage.breakdown.tokensByType`:`usage.breakdown.costByType`)}
      </div>
      <div class="cost-breakdown-bar">
        <div
          class="cost-segment output"
          style="width: ${(a?s.output:i.output.pct).toFixed(1)}%"
          title="${r(`usage.breakdown.output`)}: ${a?O(e.output):z(i.output.cost)}"
        ></div>
        <div
          class="cost-segment input"
          style="width: ${(a?s.input:i.input.pct).toFixed(1)}%"
          title="${r(`usage.breakdown.input`)}: ${a?O(e.input):z(i.input.cost)}"
        ></div>
        <div
          class="cost-segment cache-write"
          style="width: ${(a?s.cacheWrite:i.cacheWrite.pct).toFixed(1)}%"
          title="${r(`usage.breakdown.cacheWrite`)}: ${a?O(e.cacheWrite):z(i.cacheWrite.cost)}"
        ></div>
        <div
          class="cost-segment cache-read"
          style="width: ${(a?s.cacheRead:i.cacheRead.pct).toFixed(1)}%"
          title="${r(`usage.breakdown.cacheRead`)}: ${a?O(e.cacheRead):z(i.cacheRead.cost)}"
        ></div>
      </div>
      <div class="cost-breakdown-legend">
        <span class="legend-item"
          ><span class="legend-dot output"></span>${r(`usage.breakdown.output`)}
          ${a?O(e.output):z(i.output.cost)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot input"></span>${r(`usage.breakdown.input`)}
          ${a?O(e.input):z(i.input.cost)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot cache-write"></span>${r(`usage.breakdown.cacheWrite`)}
          ${a?O(e.cacheWrite):z(i.cacheWrite.cost)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot cache-read"></span>${r(`usage.breakdown.cacheRead`)}
          ${a?O(e.cacheRead):z(i.cacheRead.cost)}</span
        >
      </div>
      <div class="cost-breakdown-total">
        ${r(`usage.breakdown.total`)}:
        ${a?O(e.totalTokens):z(e.totalCost)}
      </div>
    </div>
  `}function ze(e,r,i){return t`
    <div class="usage-insight-card">
      <div class="usage-insight-title">${e}</div>
      ${r.length===0?t`<div class="muted">${i}</div>`:t`
            <div class="usage-list">
              ${r.map(e=>t`
                  <div class="usage-list-item">
                    <span>${e.label}</span>
                    <span class="usage-list-value">
                      <span>${e.value}</span>
                      ${e.sub?t`<span class="usage-list-sub">${e.sub}</span>`:n}
                    </span>
                  </div>
                `)}
            </div>
          `}
    </div>
  `}function Be(e,r,i,a){let o=[`usage-insight-card`,a?.className].filter(Boolean).join(` `),s=[`usage-error-list`,a?.listClassName].filter(Boolean).join(` `);return t`
    <div class=${o}>
      <div class="usage-insight-title">${e}</div>
      ${r.length===0?t`<div class="muted">${i}</div>`:t`
            <div class=${s}>
              ${r.map(e=>t`
                  <div class="usage-error-row">
                    <div class="usage-error-date">${e.label}</div>
                    <div class="usage-error-rate">${e.value}</div>
                    ${e.sub?t`<div class="usage-error-sub">${e.sub}</div>`:n}
                  </div>
                `)}
            </div>
          `}
    </div>
  `}function X(e){let n=[`stat`,`usage-summary-card`,e.className,e.tone?`usage-summary-card--${e.tone}`:``].filter(Boolean).join(` `),r=[`stat-value`,`usage-summary-value`,e.tone??``,e.compactValue?`usage-summary-value--compact`:``].filter(Boolean).join(` `);return t`
    <div class=${n}>
      <div class="usage-summary-title">
        ${e.title}
        <span class="usage-summary-hint" title=${e.hint}>?</span>
      </div>
      <div class=${r}>${e.value}</div>
      <div class="usage-summary-sub">${e.sub}</div>
    </div>
  `}function Ve(e,a,o,s,c,l,d){if(!e)return n;let f=a.messages.total?Math.round(e.totalTokens/a.messages.total):0,p=a.messages.total?e.totalCost/a.messages.total:0,m=e.input+e.cacheRead+e.cacheWrite,h=m>0?e.cacheRead/m:0,g=m>0?`${(h*100).toFixed(1)}%`:r(`usage.common.emptyValue`),_=o.errorRate*100,v=o.throughputTokensPerMin===void 0?r(`usage.common.emptyValue`):`${O(Math.round(o.throughputTokensPerMin))} ${r(`usage.overview.tokensPerMinute`)}`,y=o.throughputCostPerMin===void 0?r(`usage.common.emptyValue`):`${z(o.throughputCostPerMin,4)} ${r(`usage.overview.perMinute`)}`,b=o.durationCount>0?u(o.avgDurationMs,{spaced:!0})??r(`usage.common.emptyValue`):r(`usage.common.emptyValue`),x=r(`usage.overview.cacheHint`),ee=r(`usage.overview.errorHint`),S=r(`usage.overview.throughputHint`),C=r(`usage.overview.avgTokensHint`),w=r(s?`usage.overview.avgCostHintMissing`:`usage.overview.avgCostHint`),T=a.daily.filter(e=>e.messages>0&&e.errors>0).map(e=>{let t=e.errors/e.messages;return{label:ae(e.date),value:`${(t*100).toFixed(2)}%`,sub:`${e.errors} ${i(r(`usage.overview.errors`))} · ${e.messages} ${r(`usage.overview.messagesAbbrev`)} · ${O(e.tokens)}`,rate:t}}).toSorted((e,t)=>t.rate-e.rate).slice(0,5).map(({rate:e,...t})=>t),E=a.byModel.slice(0,5).map(e=>({label:e.model??r(`usage.common.unknown`),value:z(e.totals.totalCost),sub:`${O(e.totals.totalTokens)} · ${e.count} ${r(`usage.overview.messagesAbbrev`)}`})),D=a.byProvider.slice(0,5).map(e=>({label:e.provider??r(`usage.common.unknown`),value:z(e.totals.totalCost),sub:`${O(e.totals.totalTokens)} · ${e.count} ${r(`usage.overview.messagesAbbrev`)}`})),k=a.tools.tools.slice(0,6).map(e=>({label:e.name,value:`${e.count}`,sub:r(`usage.overview.calls`)})),A=a.byAgent.slice(0,5).map(e=>({label:e.agentId,value:z(e.totals.totalCost),sub:O(e.totals.totalTokens)})),te=a.byChannel.slice(0,5).map(e=>({label:e.channel,value:z(e.totals.totalCost),sub:O(e.totals.totalTokens)}));return t`
    <section class="card usage-overview-card">
      <div class="card-title">${r(`usage.overview.title`)}</div>
      <div class="usage-overview-layout">
        <div class="usage-summary-grid">
          ${X({title:r(`usage.overview.messages`),hint:r(`usage.overview.messagesHint`),value:a.messages.total,sub:`${a.messages.user} ${i(r(`usage.overview.user`))} · ${a.messages.assistant} ${i(r(`usage.overview.assistant`))}`,className:`usage-summary-card--hero`})}
          ${X({title:r(`usage.overview.throughput`),hint:S,value:v,sub:y,className:`usage-summary-card--hero usage-summary-card--throughput`,compactValue:!0})}
          ${X({title:r(`usage.overview.toolCalls`),hint:r(`usage.overview.toolCallsHint`),value:a.tools.totalCalls,sub:`${a.tools.uniqueTools} ${r(`usage.overview.toolsUsed`)}`,className:`usage-summary-card--half`})}
          ${X({title:r(`usage.overview.avgTokens`),hint:C,value:O(f),sub:r(`usage.overview.acrossMessages`,{count:String(a.messages.total||0)}),className:`usage-summary-card--half`})}
          ${X({title:r(`usage.overview.cacheHitRate`),hint:x,value:g,sub:`${O(e.cacheRead)} ${r(`usage.overview.cached`)} · ${O(m)} ${r(`usage.overview.prompt`)}`,tone:h>.6?`good`:h>.3?`warn`:`bad`,className:`usage-summary-card--medium`})}
          ${X({title:r(`usage.overview.errorRate`),hint:ee,value:`${_.toFixed(2)}%`,sub:`${a.messages.errors} ${i(r(`usage.overview.errors`))} · ${b} ${r(`usage.overview.avgSession`)}`,tone:_>5?`bad`:_>1?`warn`:`good`,className:`usage-summary-card--medium`})}
          ${X({title:r(`usage.overview.avgCost`),hint:w,value:z(p,4),sub:`${z(e.totalCost)} ${i(r(`usage.breakdown.total`))}`,className:`usage-summary-card--compact`})}
          ${X({title:r(`usage.overview.sessions`),hint:r(`usage.overview.sessionsHint`),value:l,sub:r(`usage.overview.sessionsInRange`,{count:String(d)}),className:`usage-summary-card--compact`})}
          ${X({title:r(`usage.overview.errors`),hint:r(`usage.overview.errorsHint`),value:a.messages.errors,sub:`${a.messages.toolResults} ${r(`usage.overview.toolResults`)}`,className:`usage-summary-card--compact`})}
        </div>
        <div class="usage-insights-grid">
          ${ze(r(`usage.overview.topModels`),E,r(`usage.overview.noModelData`))}
          ${ze(r(`usage.overview.topProviders`),D,r(`usage.overview.noProviderData`))}
          ${ze(r(`usage.overview.topTools`),k,r(`usage.overview.noToolCalls`))}
          ${ze(r(`usage.overview.topAgents`),A,r(`usage.overview.noAgentData`))}
          ${ze(r(`usage.overview.topChannels`),te,r(`usage.overview.noChannelData`))}
          ${Be(r(`usage.overview.peakErrorDays`),T,r(`usage.overview.noErrorData`))}
          ${Be(r(`usage.overview.peakErrorHours`),c,r(`usage.overview.noErrorData`),{className:`usage-insight-card--wide`,listClassName:`usage-error-list--hours`})}
        </div>
      </div>
    </section>
  `}function He(e,a,o,s,c,l,d,f,p,m,h,g,_,v,y){let b=e=>_.includes(e),x=e=>{let t=e.label||e.key;return t.startsWith(`agent:`)&&t.includes(`?token=`)?t.slice(0,t.indexOf(`?token=`)):t},ee=async e=>{let t=x(e);try{await navigator.clipboard.writeText(t)}catch{}},S=e=>{let t=[];return b(`channel`)&&e.channel&&t.push(`channel:${e.channel}`),b(`agent`)&&e.agentId&&t.push(`agent:${e.agentId}`),b(`provider`)&&(e.modelProvider||e.providerOverride)&&t.push(`provider:${e.modelProvider??e.providerOverride}`),b(`model`)&&e.model&&t.push(`model:${e.model}`),b(`messages`)&&e.usage?.messageCounts&&t.push(`msgs:${e.usage.messageCounts.total}`),b(`tools`)&&e.usage?.toolUsage&&t.push(`tools:${e.usage.toolUsage.totalCalls}`),b(`errors`)&&e.usage?.messageCounts&&t.push(`errors:${e.usage.messageCounts.errors}`),b(`duration`)&&e.usage?.durationMs&&t.push(`dur:${u(e.usage.durationMs,{spaced:!0})??`—`}`),t},C=new Set(o),w=(e,t)=>{let n=e.usage;return n?C.size>0&&n.dailyBreakdown&&n.dailyBreakdown.length>0?n.dailyBreakdown.reduce((e,n)=>C.has(n.date)?e+(t===`tokens`?n.tokens:n.cost):e,0):t===`tokens`?n.totalTokens??0:n.totalCost??0:0},T=e=>w(e,s?`tokens`:`cost`),E=e=>{switch(c){case`recent`:return e.updatedAt??0;case`messages`:return e.usage?.messageCounts?.total??0;case`errors`:return e.usage?.messageCounts?.errors??0;case`cost`:return w(e,`cost`);case`tokens`:return w(e,`tokens`)}return c},D=[...e].toSorted((e,t)=>{let n=E(t)-E(e);if(n!==0)return n;let r=(t.updatedAt??0)-(e.updatedAt??0);return r===0?x(e).localeCompare(x(t)):r}),k=l===`asc`?D.toReversed():D,A=k.reduce((e,t)=>e+T(t),0),te=k.length?A/k.length:0,j=k.reduce((e,t)=>e+(t.usage?.messageCounts?.errors??0),0),M=(e,i)=>{let a=T(e),o=x(e),c=S(e);return t`
      <div
        class="session-bar-row ${i?`selected`:``}"
        @click=${t=>p(e.key,t.shiftKey)}
        title="${e.key}"
      >
        <div class="session-bar-label">
          <div class="session-bar-title">${o}</div>
          ${c.length>0?t`<div class="session-bar-meta">${c.join(` · `)}</div>`:n}
        </div>
        <div class="session-bar-actions">
          <button
            class="btn btn--sm btn--ghost"
            title=${r(`usage.sessions.copyName`)}
            @click=${t=>{t.stopPropagation(),ee(e)}}
          >
            ${r(`usage.sessions.copy`)}
          </button>
          <div class="session-bar-value">
            ${s?O(a):z(a)}
          </div>
        </div>
      </div>
    `},N=new Set(a),P=k.filter(e=>N.has(e.key)),F=P.length,I=new Map(k.map(e=>[e.key,e])),L=d.map(e=>I.get(e)).filter(e=>!!e);return t`
    <div class="card sessions-card">
      <div class="sessions-card-header">
        <div class="card-title">${r(`usage.sessions.title`)}</div>
        <div class="sessions-card-count">
          ${r(`usage.sessions.shown`,{count:String(e.length)})}
          ${v===e.length?``:` · ${r(`usage.sessions.total`,{count:String(v)})}`}
        </div>
      </div>
      <div class="sessions-card-meta">
        <div class="sessions-card-stats">
          <span>
            ${s?O(te):z(te)}
            ${r(`usage.sessions.avg`)}
          </span>
          <span>${j} ${i(r(`usage.overview.errors`))}</span>
        </div>
        <div class="chart-toggle small">
          <button
            class="btn btn--sm toggle-btn ${f===`all`?`active`:``}"
            @click=${()=>g(`all`)}
          >
            ${r(`usage.sessions.all`)}
          </button>
          <button
            class="btn btn--sm toggle-btn ${f===`recent`?`active`:``}"
            @click=${()=>g(`recent`)}
          >
            ${r(`usage.sessions.recent`)}
          </button>
        </div>
        <label class="sessions-sort">
          <span>${r(`usage.sessions.sort`)}</span>
          <select
            @change=${e=>m(e.target.value)}
          >
            <option value="cost" ?selected=${c===`cost`}>
              ${r(`usage.metrics.cost`)}
            </option>
            <option value="errors" ?selected=${c===`errors`}>
              ${r(`usage.overview.errors`)}
            </option>
            <option value="messages" ?selected=${c===`messages`}>
              ${r(`usage.overview.messages`)}
            </option>
            <option value="recent" ?selected=${c===`recent`}>
              ${r(`usage.sessions.recentShort`)}
            </option>
            <option value="tokens" ?selected=${c===`tokens`}>
              ${r(`usage.metrics.tokens`)}
            </option>
          </select>
        </label>
        <button
          class="btn btn--sm"
          @click=${()=>h(l===`desc`?`asc`:`desc`)}
          title=${r(l===`desc`?`usage.sessions.descending`:`usage.sessions.ascending`)}
        >
          ${l===`desc`?`↓`:`↑`}
        </button>
        ${F>0?t`
              <button class="btn btn--sm" @click=${y}>
                ${r(`usage.sessions.clearSelection`)}
              </button>
            `:n}
      </div>
      ${f===`recent`?L.length===0?t` <div class="usage-empty-block">${r(`usage.sessions.noRecent`)}</div> `:t`
              <div class="session-bars session-bars--recent">
                ${L.map(e=>M(e,N.has(e.key)))}
              </div>
            `:e.length===0?t` <div class="usage-empty-block">${r(`usage.sessions.noneInRange`)}</div> `:t`
              <div class="session-bars">
                ${k.slice(0,50).map(e=>M(e,N.has(e.key)))}
                ${e.length>50?t`
                      <div class="usage-more-sessions">
                        ${r(`usage.sessions.more`,{count:String(e.length-50)})}
                      </div>
                    `:n}
              </div>
            `}
      ${F>1?t`
            <div class="sessions-selected-group">
              <div class="sessions-card-count">
                ${r(`usage.sessions.selected`,{count:String(F)})}
              </div>
              <div class="session-bars session-bars--selected">
                ${P.map(e=>M(e,!0))}
              </div>
            </div>
          `:n}
    </div>
  `}var Ue=.75,We=.06,Ge=5,Z=12,Q=.7;function $(e,t){return!t||t<=0?0:e/t*100}function Ke(e){return e<0xe8d4a51000?e*1e3:e}function qe(e,t,n){let r=Math.min(t,n),i=Math.max(t,n);return e.filter(e=>{if(e.timestamp<=0)return!0;let t=Ke(e.timestamp);return t>=r&&t<=i})}function Je(e,o,s){let c=o||e.usage;if(!c)return t` <div class="usage-empty-block">${r(`usage.details.noUsageData`)}</div> `;let l=e=>e?a(e):r(`usage.common.emptyValue`),d=[];e.channel&&d.push(`channel:${e.channel}`),e.agentId&&d.push(`agent:${e.agentId}`),(e.modelProvider||e.providerOverride)&&d.push(`provider:${e.modelProvider??e.providerOverride}`),e.model&&d.push(`model:${e.model}`);let f=c.toolUsage?.tools.slice(0,6)??[],p,m,h;if(s){let e=new Map;for(let t of s){let{tools:n}=S(t.content);for(let[t]of n)e.set(t,(e.get(t)||0)+1)}h=f.map(t=>({label:t.name,value:`${e.get(t.name)??0}`,sub:r(`usage.overview.calls`)})),p=[...e.values()].reduce((e,t)=>e+t,0),m=e.size}else h=f.map(e=>({label:e.name,value:`${e.count}`,sub:r(`usage.overview.calls`)})),p=c.toolUsage?.totalCalls??0,m=c.toolUsage?.uniqueTools??0;let g=c.modelUsage?.slice(0,6).map(e=>({label:e.model??r(`usage.common.unknown`),value:z(e.totals.totalCost),sub:O(e.totals.totalTokens)}))??[];return t`
    ${d.length>0?t`<div class="usage-badges">
          ${d.map(e=>t`<span class="usage-badge">${e}</span>`)}
        </div>`:n}
    <div class="session-summary-grid">
      <div class="stat session-summary-card">
        <div class="session-summary-title">${r(`usage.overview.messages`)}</div>
        <div class="stat-value session-summary-value">${c.messageCounts?.total??0}</div>
        <div class="session-summary-meta">
          ${c.messageCounts?.user??0}
          ${i(r(`usage.overview.user`))} ·
          ${c.messageCounts?.assistant??0}
          ${i(r(`usage.overview.assistant`))}
        </div>
      </div>
      <div class="stat session-summary-card">
        <div class="session-summary-title">${r(`usage.overview.toolCalls`)}</div>
        <div class="stat-value session-summary-value">${p}</div>
        <div class="session-summary-meta">${m} ${r(`usage.overview.toolsUsed`)}</div>
      </div>
      <div class="stat session-summary-card">
        <div class="session-summary-title">${r(`usage.overview.errors`)}</div>
        <div class="stat-value session-summary-value">${c.messageCounts?.errors??0}</div>
        <div class="session-summary-meta">
          ${c.messageCounts?.toolResults??0} ${r(`usage.overview.toolResults`)}
        </div>
      </div>
      <div class="stat session-summary-card">
        <div class="session-summary-title">${r(`usage.details.duration`)}</div>
        <div class="stat-value session-summary-value">
          ${u(c.durationMs,{spaced:!0})??r(`usage.common.emptyValue`)}
        </div>
        <div class="session-summary-meta">
          ${l(c.firstActivity)} → ${l(c.lastActivity)}
        </div>
      </div>
    </div>
    <div class="usage-insights-grid usage-insights-grid--tight">
      ${ze(r(`usage.overview.topTools`),h,r(`usage.overview.noToolCalls`))}
      ${ze(r(`usage.details.modelMix`),g,r(`usage.overview.noModelData`))}
    </div>
  `}function Ye(e,t,n,r){let i=Math.min(n,r),a=Math.max(n,r),o=t.filter(e=>e.timestamp>=i&&e.timestamp<=a);if(o.length===0)return;let s=0,c=0,l=0,u=0,d=0,f=0,p=0,m=0;for(let e of o)s+=e.totalTokens||0,c+=e.cost||0,d+=e.input||0,f+=e.output||0,p+=e.cacheRead||0,m+=e.cacheWrite||0,e.output>0&&u++,e.input>0&&l++;return{...e,totalTokens:s,totalCost:c,input:d,output:f,cacheRead:p,cacheWrite:m,durationMs:o[o.length-1].timestamp-o[0].timestamp,firstActivity:o[0].timestamp,lastActivity:o[o.length-1].timestamp,messageCounts:{total:o.length,user:l,assistant:u,toolCalls:0,toolResults:0,errors:0}}}function Xe(e,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,ee,S,C,w,T,E,D,k){let A=e.label||e.key,te=A.length>50?A.slice(0,50)+`…`:A,j=e.usage,M=d!==null&&f!==null,N=d!==null&&f!==null&&a?.points&&j?Ye(j,a.points,d,f):void 0,P=N?{totalTokens:N.totalTokens,totalCost:N.totalCost}:{totalTokens:j?.totalTokens??0,totalCost:j?.totalCost??0},F=N?r(`usage.details.filtered`):``;return t`
    <div class="card session-detail-panel">
      <div class="session-detail-header">
        <div class="session-detail-header-left">
          <div class="session-detail-title">
            ${te}
            ${F?t`<span class="session-detail-indicator">${F}</span>`:n}
          </div>
        </div>
        <div class="session-detail-stats">
          ${j?t`
                <span
                  ><strong>${O(P.totalTokens)}</strong>
                  ${i(r(`usage.metrics.tokens`))}${F}</span
                >
                <span><strong>${z(P.totalCost)}</strong>${F}</span>
              `:n}
        </div>
        <button
          class="btn btn--sm btn--ghost"
          @click=${k}
          title=${r(`usage.details.close`)}
          aria-label=${r(`usage.details.close`)}
        >
          ×
        </button>
      </div>
      ${e.scope===`family`&&e.includedSessionIds?.length?t`
            <div class="usage-lineage-note">
              ${r(`usage.scope.familyIncluded`,{count:String(e.includedSessionIds.length)})}
            </div>
          `:n}
      <div class="session-detail-content">
        ${Je(e,N,d!=null&&f!=null&&_?qe(_,d,f):void 0)}
        <div class="session-detail-row">
          ${Ze(a,o,s,c,l,u,m,h,g,d,f,p)}
        </div>
        <div class="session-detail-bottom">
          ${$e(_,v,y,b,x,ee,S,C,w,T,M?d:null,M?f:null)}
          ${Qe(e.contextWeight,j,E,D)}
        </div>
      </div>
    </div>
  `}function Ze(a,s,l,u,d,f,p,m,h,g,_,v){if(s)return t`
      <div class="session-timeseries-compact">
        <div class="usage-empty-block">${r(`usage.loading.badge`)}</div>
      </div>
    `;if(!a||a.points.length<2)return t`
      <div class="session-timeseries-compact">
        <div class="usage-empty-block">${r(`usage.details.noTimeline`)}</div>
      </div>
    `;let y=a.points;if(p||m||h&&h.length>0){let e=p?new Date(p+`T00:00:00`).getTime():0,t=m?new Date(m+`T23:59:59`).getTime():1/0;y=a.points.filter(n=>{if(n.timestamp<e||n.timestamp>t)return!1;if(h&&h.length>0){let e=new Date(n.timestamp),t=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`;return h.includes(t)}return!0})}if(y.length<2)return t`
      <div class="session-timeseries-compact">
        <div class="usage-empty-block">${r(`usage.details.noDataInRange`)}</div>
      </div>
    `;let b=0,x=0,ee=0,S=0,C=0,w=0;y=y.map(e=>(b+=e.totalTokens,x+=e.cost,ee+=e.output,S+=e.input,C+=e.cacheRead,w+=e.cacheWrite,{...e,cumulativeTokens:b,cumulativeCost:x}));let T=g!=null&&_!=null,E=T?Math.min(g,_):0,D=T?Math.max(g,_):1/0,k=0,A=y.length;if(T){k=y.findIndex(e=>e.timestamp>=E),k===-1&&(k=y.length);let e=y.findIndex(e=>e.timestamp>D);A=e===-1?y.length:e}let te=T?y.slice(k,A):y,j=0,M=0,N=0,P=0;for(let e of te)j+=e.output,M+=e.input,N+=e.cacheRead,P+=e.cacheWrite;let F={top:8,right:4,bottom:14,left:30},I=400-F.left-F.right,L=100-F.top-F.bottom,ne=l===`cumulative`,R=l===`per-turn`&&d===`by-type`,re=j+M+N+P,ie=y.map(e=>ne?e.cumulativeTokens:R?e.input+e.output+e.cacheRead+e.cacheWrite:e.totalTokens),B=Math.max(...ie,1),ae=I/y.length,V=Math.min(8,Math.max(1,ae*Ue)),H=ae-V,U=F.left+k*(V+H),W=A>=y.length?F.left+(y.length-1)*(V+H)+V:F.left+(A-1)*(V+H)+V;return t`
    <div class="session-timeseries-compact">
      <div class="timeseries-header-row">
        <div class="card-title usage-section-title">${r(`usage.details.usageOverTime`)}</div>
        <div class="timeseries-controls">
          ${T?t`
                <div class="chart-toggle small">
                  <button
                    class="btn btn--sm toggle-btn active"
                    @click=${()=>v?.(null,null)}
                  >
                    ${r(`usage.details.reset`)}
                  </button>
                </div>
              `:n}
          <div class="chart-toggle small">
            <button
              class="btn btn--sm toggle-btn ${ne?``:`active`}"
              @click=${()=>u(`per-turn`)}
            >
              ${r(`usage.details.perTurn`)}
            </button>
            <button
              class="btn btn--sm toggle-btn ${ne?`active`:``}"
              @click=${()=>u(`cumulative`)}
            >
              ${r(`usage.details.cumulative`)}
            </button>
          </div>
          ${ne?n:t`
                <div class="chart-toggle small">
                  <button
                    class="btn btn--sm toggle-btn ${d===`total`?`active`:``}"
                    @click=${()=>f(`total`)}
                  >
                    ${r(`usage.daily.total`)}
                  </button>
                  <button
                    class="btn btn--sm toggle-btn ${d===`by-type`?`active`:``}"
                    @click=${()=>f(`by-type`)}
                  >
                    ${r(`usage.daily.byType`)}
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
            ${O(B)}
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
          ${y.length>0?e`
            <text x="${F.left}" y="${F.top+L+10}" text-anchor="start" class="ts-axis-label">${c(y[0].timestamp,{hour:`2-digit`,minute:`2-digit`},``)}</text>
            <text x="${400-F.right}" y="${F.top+L+10}" text-anchor="end" class="ts-axis-label">${c(y[y.length-1].timestamp,{hour:`2-digit`,minute:`2-digit`},``)}</text>
          `:n}
          <!-- Bars -->
          ${y.map((t,a)=>{let s=ie[a],c=F.left+a*(V+H),l=s/B*L,u=F.top+L-l,d=[o(t.timestamp,{month:`short`,day:`numeric`,hour:`2-digit`,minute:`2-digit`},``),`${O(s)} ${i(r(`usage.metrics.tokens`))}`];R&&(d.push(`Out ${O(t.output)}`),d.push(`In ${O(t.input)}`),d.push(`CW ${O(t.cacheWrite)}`),d.push(`CR ${O(t.cacheRead)}`));let f=d.join(` · `),p=T&&(a<k||a>=A);if(!R)return e`<rect x="${c}" y="${u}" width="${V}" height="${l}" class="ts-bar${p?` dimmed`:``}" rx="1"><title>${f}</title></rect>`;let m=[{value:t.output,cls:`output`},{value:t.input,cls:`input`},{value:t.cacheWrite,cls:`cache-write`},{value:t.cacheRead,cls:`cache-read`}],h=F.top+L,g=p?` dimmed`:``;return e`
              ${m.map(t=>{if(t.value<=0||s<=0)return n;let r=l*(t.value/s);return h-=r,e`<rect x="${c}" y="${h}" width="${V}" height="${r}" class="ts-bar ${t.cls}${g}" rx="1"><title>${f}</title></rect>`})}
            `})}
          <!-- Selection highlight overlay (always visible between handles) -->
          ${e`
            <rect 
              x="${U}" 
              y="${F.top}" 
              width="${Math.max(1,W-U)}" 
              height="${L}" 
              fill="var(--accent)" 
              opacity="${We}" 
              pointer-events="none"
            />
          `}
          <!-- Left cursor line + handle -->
          ${e`
            <line x1="${U}" y1="${F.top}" x2="${U}" y2="${F.top+L}" stroke="var(--accent)" stroke-width="0.8" opacity="0.7" />
            <rect x="${U-Ge/2}" y="${F.top+L/2-Z/2}" width="${Ge}" height="${Z}" rx="1.5" fill="var(--accent)" class="cursor-handle" />
            <line x1="${U-Q}" y1="${F.top+L/2-Z/5}" x2="${U-Q}" y2="${F.top+L/2+Z/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
            <line x1="${U+Q}" y1="${F.top+L/2-Z/5}" x2="${U+Q}" y2="${F.top+L/2+Z/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
          `}
          <!-- Right cursor line + handle -->
          ${e`
            <line x1="${W}" y1="${F.top}" x2="${W}" y2="${F.top+L}" stroke="var(--accent)" stroke-width="0.8" opacity="0.7" />
            <rect x="${W-Ge/2}" y="${F.top+L/2-Z/2}" width="${Ge}" height="${Z}" rx="1.5" fill="var(--accent)" class="cursor-handle" />
            <line x1="${W-Q}" y1="${F.top+L/2-Z/5}" x2="${W-Q}" y2="${F.top+L/2+Z/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
            <line x1="${W+Q}" y1="${F.top+L/2-Z/5}" x2="${W+Q}" y2="${F.top+L/2+Z/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
          `}
        </svg>
        <!-- Handle drag zones (only on handles, not full chart) -->
        ${(()=>{let e=`${(U/400*100).toFixed(1)}%`,n=`${(W/400*100).toFixed(1)}%`,r=e=>t=>{if(!v)return;t.preventDefault(),t.stopPropagation();let n=t.currentTarget.closest(`.timeseries-chart-wrapper`)?.querySelector(`svg`);if(!n)return;let r=n.getBoundingClientRect(),i=r.width,a=F.left/400*i,o=(400-F.right)/400*i-a,s=e=>{let t=Math.max(0,Math.min(1,(e-r.left-a)/o));return Math.min(Math.floor(t*y.length),y.length-1)},c=e===`left`?U:W,l=r.left+c/400*i,u=t.clientX-l;document.body.style.cursor=`col-resize`;let d=t=>{let n=s(t.clientX-u),r=y[n];if(r)if(e===`left`){let e=_??y[y.length-1].timestamp;v(Math.min(r.timestamp,e),e)}else{let e=g??y[0].timestamp;v(e,Math.max(r.timestamp,e))}},f=()=>{document.body.style.cursor=``,document.removeEventListener(`mousemove`,d),document.removeEventListener(`mouseup`,f)};document.addEventListener(`mousemove`,d),document.addEventListener(`mouseup`,f)};return t`
            <div
              class="chart-handle-zone chart-handle-left"
              style="left: ${e};"
              @mousedown=${r(`left`)}
            ></div>
            <div
              class="chart-handle-zone chart-handle-right"
              style="left: ${n};"
              @mousedown=${r(`right`)}
            ></div>
          `})()}
      </div>
      <div class="timeseries-summary">
        ${T?t`
              <span class="timeseries-summary__range">
                ${r(`usage.details.turnRange`,{start:String(k+1),end:String(A),total:String(y.length)})}
              </span>
              ·
              ${c(E,{hour:`2-digit`,minute:`2-digit`},``)}–${c(D,{hour:`2-digit`,minute:`2-digit`},``)}
              ·
              ${O(j+M+N+P)}
              · ${z(te.reduce((e,t)=>e+(t.cost||0),0))}
            `:t`${y.length} ${r(`usage.overview.messagesAbbrev`)} · ${O(b)}
            · ${z(x)}`}
      </div>
      ${R?t`
            <div class="timeseries-breakdown">
              <div class="card-title usage-section-title">${r(`usage.breakdown.tokensByType`)}</div>
              <div class="cost-breakdown-bar cost-breakdown-bar--compact">
                <div
                  class="cost-segment output"
                  style="width: ${$(j,re).toFixed(1)}%"
                ></div>
                <div
                  class="cost-segment input"
                  style="width: ${$(M,re).toFixed(1)}%"
                ></div>
                <div
                  class="cost-segment cache-write"
                  style="width: ${$(P,re).toFixed(1)}%"
                ></div>
                <div
                  class="cost-segment cache-read"
                  style="width: ${$(N,re).toFixed(1)}%"
                ></div>
              </div>
              <div class="cost-breakdown-legend">
                <div class="legend-item" title=${r(`usage.details.assistantOutputTokens`)}>
                  <span class="legend-dot output"></span>${r(`usage.breakdown.output`)}
                  ${O(j)}
                </div>
                <div class="legend-item" title=${r(`usage.details.userToolInputTokens`)}>
                  <span class="legend-dot input"></span>${r(`usage.breakdown.input`)}
                  ${O(M)}
                </div>
                <div class="legend-item" title=${r(`usage.details.tokensWrittenToCache`)}>
                  <span class="legend-dot cache-write"></span>${r(`usage.breakdown.cacheWrite`)}
                  ${O(P)}
                </div>
                <div class="legend-item" title=${r(`usage.details.tokensReadFromCache`)}>
                  <span class="legend-dot cache-read"></span>${r(`usage.breakdown.cacheRead`)}
                  ${O(N)}
                </div>
              </div>
              <div class="cost-breakdown-total">
                ${r(`usage.breakdown.total`)}: ${O(re)}
              </div>
            </div>
          `:n}
    </div>
  `}function Qe(e,i,a,o){if(!e)return t`
      <div class="context-details-panel">
        <div class="usage-empty-block">${r(`usage.details.noContextData`)}</div>
      </div>
    `;let s=D(e.systemPrompt.chars),c=D(e.skills.promptChars),l=D(e.tools.listChars+e.tools.schemaChars),u=D(e.injectedWorkspaceFiles.reduce((e,t)=>e+t.injectedChars,0)),d=s+c+l+u,f=``;if(i&&i.totalTokens>0){let e=i.input+i.cacheRead;e>0&&(f=`~${Math.min(d/e*100,100).toFixed(0)}% ${r(`usage.details.ofInput`)}`)}let p=e.skills.entries.toSorted((e,t)=>t.blockChars-e.blockChars),m=e.tools.entries.toSorted((e,t)=>t.summaryChars+t.schemaChars-(e.summaryChars+e.schemaChars)),h=e.injectedWorkspaceFiles.toSorted((e,t)=>t.injectedChars-e.injectedChars),g=a,_=g?p:p.slice(0,4),v=g?m:m.slice(0,4),y=g?h:h.slice(0,4),b=p.length>4||m.length>4||h.length>4;return t`
    <div class="context-details-panel">
      <div class="context-breakdown-header">
        <div class="card-title usage-section-title">
          ${r(`usage.details.systemPromptBreakdown`)}
        </div>
        ${b?t`<button class="btn btn--sm" @click=${o}>
              ${r(g?`usage.details.collapse`:`usage.details.expandAll`)}
            </button>`:n}
      </div>
      <p class="context-weight-desc">${f||r(`usage.details.baseContextPerMessage`)}</p>
      <div class="context-stacked-bar">
        <div
          class="context-segment system"
          style="width: ${$(s,d).toFixed(1)}%"
          title="${r(`usage.details.system`)}: ~${O(s)}"
        ></div>
        <div
          class="context-segment skills"
          style="width: ${$(c,d).toFixed(1)}%"
          title="${r(`usage.details.skills`)}: ~${O(c)}"
        ></div>
        <div
          class="context-segment tools"
          style="width: ${$(l,d).toFixed(1)}%"
          title="${r(`usage.details.tools`)}: ~${O(l)}"
        ></div>
        <div
          class="context-segment files"
          style="width: ${$(u,d).toFixed(1)}%"
          title="${r(`usage.details.files`)}: ~${O(u)}"
        ></div>
      </div>
      <div class="context-legend">
        <span class="legend-item"
          ><span class="legend-dot system"></span>${r(`usage.details.systemShort`)}
          ~${O(s)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot skills"></span>${r(`usage.details.skills`)}
          ~${O(c)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot tools"></span>${r(`usage.details.tools`)}
          ~${O(l)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot files"></span>${r(`usage.details.files`)}
          ~${O(u)}</span
        >
      </div>
      <div class="context-total">
        ${r(`usage.breakdown.total`)}: ~${O(d)}
      </div>
      <div class="context-breakdown-grid">
        ${p.length>0?(()=>{let e=p.length-_.length;return t`
                <div class="context-breakdown-card">
                  <div class="context-breakdown-title">
                    ${r(`usage.details.skills`)} (${p.length})
                  </div>
                  <div class="context-breakdown-list">
                    ${_.map(e=>t`
                        <div class="context-breakdown-item">
                          <span class="mono" title=${e.name}>${e.name}</span>
                          <span class="muted">~${O(D(e.blockChars))}</span>
                        </div>
                      `)}
                  </div>
                  ${e>0?t`
                        <div class="context-breakdown-more">
                          ${r(`usage.sessions.more`,{count:String(e)})}
                        </div>
                      `:n}
                </div>
              `})():n}
        ${m.length>0?(()=>{let e=m.length-v.length;return t`
                <div class="context-breakdown-card">
                  <div class="context-breakdown-title">
                    ${r(`usage.details.tools`)} (${m.length})
                  </div>
                  <div class="context-breakdown-list">
                    ${v.map(e=>t`
                        <div class="context-breakdown-item">
                          <span class="mono" title=${e.name}>${e.name}</span>
                          <span class="muted"
                            >~${O(D(e.summaryChars+e.schemaChars))}</span
                          >
                        </div>
                      `)}
                  </div>
                  ${e>0?t`
                        <div class="context-breakdown-more">
                          ${r(`usage.sessions.more`,{count:String(e)})}
                        </div>
                      `:n}
                </div>
              `})():n}
        ${h.length>0?(()=>{let e=h.length-y.length;return t`
                <div class="context-breakdown-card">
                  <div class="context-breakdown-title">
                    ${r(`usage.details.files`)} (${h.length})
                  </div>
                  <div class="context-breakdown-list">
                    ${y.map(e=>t`
                        <div class="context-breakdown-item">
                          <span class="mono" title=${e.name}>${e.name}</span>
                          <span class="muted"
                            >~${O(D(e.injectedChars))}</span
                          >
                        </div>
                      `)}
                  </div>
                  ${e>0?t`
                        <div class="context-breakdown-more">
                          ${r(`usage.sessions.more`,{count:String(e)})}
                        </div>
                      `:n}
                </div>
              `})():n}
      </div>
    </div>
  `}function $e(e,o,s,c,l,u,d,f,p,m,h,g){if(o)return t`
      <div class="session-logs-compact">
        <div class="session-logs-header">${r(`usage.details.conversation`)}</div>
        <div class="usage-empty-block">${r(`usage.loading.badge`)}</div>
      </div>
    `;if(!e||e.length===0)return t`
      <div class="session-logs-compact">
        <div class="session-logs-header">${r(`usage.details.conversation`)}</div>
        <div class="usage-empty-block">${r(`usage.details.noMessages`)}</div>
      </div>
    `;let _=i(l.query),v=e.map(e=>{let t=S(e.content);return{log:e,toolInfo:t,cleanContent:t.cleanContent||e.content}}),y=Array.from(new Set(v.flatMap(e=>e.toolInfo.tools.map(([e])=>e)))).toSorted((e,t)=>e.localeCompare(t)),b=v.filter(e=>{if(h!=null&&g!=null){let t=e.log.timestamp;if(t>0){let e=Math.min(h,g),n=Math.max(h,g),r=Ke(t);if(r<e||r>n)return!1}}return!(l.roles.length>0&&!l.roles.includes(e.log.role)||l.hasTools&&e.toolInfo.tools.length===0||l.tools.length>0&&!e.toolInfo.tools.some(([e])=>l.tools.includes(e))||_&&!i(e.cleanContent).includes(_))}),x=l.roles.length>0||l.tools.length>0||l.hasTools||_,ee=h!=null&&g!=null,C=x||ee?`${b.length} ${r(`usage.details.of`)} ${e.length}${ee?` (${r(`usage.details.timelineFiltered`)})`:``}`:`${e.length}`,w=new Set(l.roles),T=new Set(l.tools);return t`
    <div class="session-logs-compact">
      <div class="session-logs-header">
        <span>
          ${r(`usage.details.conversation`)}
          <span class="session-logs-header-count">
            (${C} ${i(r(`usage.overview.messages`))})
          </span>
        </span>
        <button class="btn btn--sm" @click=${c}>
          ${r(s?`usage.details.collapseAll`:`usage.details.expandAll`)}
        </button>
      </div>
      <div class="usage-filters-inline session-log-filters">
        <select
          multiple
          size="4"
          aria-label="Filter by role"
          @change=${e=>u(Array.from(e.target.selectedOptions).map(e=>e.value))}
        >
          <option value="user" ?selected=${w.has(`user`)}>
            ${r(`usage.overview.user`)}
          </option>
          <option value="assistant" ?selected=${w.has(`assistant`)}>
            ${r(`usage.overview.assistant`)}
          </option>
          <option value="tool" ?selected=${w.has(`tool`)}>
            ${r(`usage.details.tool`)}
          </option>
          <option value="toolResult" ?selected=${w.has(`toolResult`)}>
            ${r(`usage.details.toolResult`)}
          </option>
        </select>
        <select
          multiple
          size="4"
          aria-label="Filter by tool"
          @change=${e=>d(Array.from(e.target.selectedOptions).map(e=>e.value))}
        >
          ${y.map(e=>t`<option value=${e} ?selected=${T.has(e)}>${e}</option>`)}
        </select>
        <label class="usage-filters-inline session-log-has-tools">
          <input
            type="checkbox"
            .checked=${l.hasTools}
            @change=${e=>f(e.target.checked)}
          />
          ${r(`usage.details.hasTools`)}
        </label>
        <input
          type="text"
          placeholder=${r(`usage.details.searchConversation`)}
          aria-label=${r(`usage.details.searchConversation`)}
          .value=${l.query}
          @input=${e=>p(e.target.value)}
        />
        <button class="btn btn--sm" @click=${m}>${r(`usage.filters.clear`)}</button>
      </div>
      <div class="session-logs-list">
        ${b.map(e=>{let{log:i,toolInfo:o,cleanContent:c}=e;return t`
            <div class="session-log-entry ${i.role===`user`?`user`:`assistant`}">
              <div class="session-log-meta">
                <span class="session-log-role">${i.role===`user`?r(`usage.details.you`):i.role===`assistant`?r(`usage.overview.assistant`):r(`usage.details.tool`)}</span>
                <span>${a(i.timestamp)}</span>
                ${i.tokens?t`<span>${O(i.tokens)}</span>`:n}
              </div>
              <div class="session-log-content">${c}</div>
              ${o.tools.length>0?t`
                    <details class="session-log-tools" ?open=${s}>
                      <summary>${o.summary}</summary>
                      <div class="session-log-tools-list">
                        ${o.tools.map(([e,n])=>t`
                            <span class="session-log-tools-pill">${e} × ${n}</span>
                          `)}
                      </div>
                    </details>
                  `:n}
            </div>
          `})}
        ${b.length===0?t`
              <div class="usage-empty-block usage-empty-block--compact">
                ${r(`usage.details.noMessagesMatch`)}
              </div>
            `:n}
      </div>
    </div>
  `}function et(){return{input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0}}function tt(e,t){return e.input+=t.input,e.output+=t.output,e.cacheRead+=t.cacheRead,e.cacheWrite+=t.cacheWrite,e.totalTokens+=t.totalTokens,e.totalCost+=t.totalCost,e.inputCost+=t.inputCost??0,e.outputCost+=t.outputCost??0,e.cacheReadCost+=t.cacheReadCost??0,e.cacheWriteCost+=t.cacheWriteCost??0,e.missingCostEntries+=t.missingCostEntries??0,e}function nt(e){return t`
    <section class="card usage-loading-card">
      <div class="usage-loading-header">
        <div class="usage-loading-title-group">
          <div class="card-title usage-section-title">${r(`usage.loading.title`)}</div>
          <span class="usage-loading-badge">
            <span class="usage-loading-spinner" aria-hidden="true"></span>
            ${r(`usage.loading.badge`)}
          </span>
        </div>
        <div class="usage-loading-controls">
          <div class="usage-date-range usage-date-range--loading">
            <input class="usage-date-input" type="date" .value=${e.startDate} disabled />
            <span class="usage-separator">${r(`usage.filters.to`)}</span>
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
  `}function rt(e){return t`
    <section class="card usage-empty-state">
      <div class="usage-empty-state__title">${r(`usage.empty.title`)}</div>
      <div class="card-sub usage-empty-state__subtitle">${r(`usage.empty.subtitle`)}</div>
      <div class="usage-empty-state__features">
        <span class="usage-empty-state__feature">${r(`usage.empty.featureOverview`)}</span>
        <span class="usage-empty-state__feature">${r(`usage.empty.featureSessions`)}</span>
        <span class="usage-empty-state__feature">${r(`usage.empty.featureTimeline`)}</span>
      </div>
      <div class="usage-empty-state__actions">
        <button class="btn primary" @click=${e}>${r(`common.refresh`)}</button>
      </div>
    </section>
  `}function it(e){let t=e.currentTarget;if(!t.open)return;let n=e=>{e.composedPath().includes(t)||(t.open=!1,window.removeEventListener(`click`,n,!0))};window.addEventListener(`click`,n,!0)}function at(e){let{data:i,filters:a,display:o,detail:s,callbacks:c}=e,l=c.filters,u=c.display,f=c.details;if(i.loading&&!i.totals)return t`<div class="usage-page">${nt(a)}</div>`;let p=o.chartMode===`tokens`,m=a.query.trim().length>0,h=a.queryDraft.trim().length>0,_=[...i.sessions].toSorted((e,t)=>{let n=p?e.usage?.totalTokens??0:e.usage?.totalCost??0;return(p?t.usage?.totalTokens??0:t.usage?.totalCost??0)-n}),v=a.agentId?_.filter(e=>K(e.agentId??``)===K(a.agentId??``)):_,y=a.selectedDays.length>0?v.filter(e=>{if(e.usage?.activityDates?.length)return e.usage.activityDates.some(e=>a.selectedDays.includes(e));if(!e.updatedAt)return!1;let t=new Date(e.updatedAt),n=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,`0`)}-${String(t.getDate()).padStart(2,`0`)}`;return a.selectedDays.includes(n)}):v,b=ee(a.selectedHours.length>0?y.filter(e=>ne(e,a.selectedHours,a.timeZone)):y,a.query),x=b.sessions,S=b.warnings,C=de(a.queryDraft,v,i.aggregates),w=g(a.query),T=e=>{let t=K(e);return w.filter(e=>K(e.key??``)===t).map(e=>e.value).filter(Boolean)},E=e=>{let t=new Set;for(let n of e)n&&t.add(n);return Array.from(t)},D=E([...i.agents,..._.map(e=>e.agentId)]).slice(0,12),k=E(v.map(e=>e.channel)).slice(0,12),A=E([...v.map(e=>e.modelProvider),...v.map(e=>e.providerOverride),...i.aggregates?.byProvider.map(e=>e.provider)??[]]).slice(0,12),j=E([...v.map(e=>e.model),...i.aggregates?.byModel.map(e=>e.model)??[]]).slice(0,12),M=E(i.aggregates?.tools.tools.map(e=>e.name)??[]).slice(0,12),N=a.selectedSessions.length===1?i.sessions.find(e=>e.key===a.selectedSessions[0])??x.find(e=>e.key===a.selectedSessions[0]):null,P=e=>e.reduce((e,t)=>t.usage?tt(e,t.usage):e,et()),F=e=>i.costDaily.filter(t=>e.includes(t.date)).reduce((e,t)=>tt(e,t),et()),I,L,R=v.length;if(a.selectedSessions.length>0){let e=x.filter(e=>a.selectedSessions.includes(e.key));I=P(e),L=e.length}else a.selectedDays.length>0&&a.selectedHours.length===0?(I=F(a.selectedDays),L=x.length):a.selectedHours.length>0||m?(I=P(x),L=x.length):a.agentId?(I=P(v),L=R):(I=i.totals,L=R);let B=a.selectedSessions.length>0?x.filter(e=>a.selectedSessions.includes(e.key)):m||a.selectedHours.length>0?x:a.selectedDays.length>0?y:_,ae=a.selectedSessions.length>0||m||a.selectedHours.length>0||a.selectedDays.length>0||!!a.agentId,V=W(ae?B:[],i.aggregates),H=i.sessionsLimitReached&&!ae,U=H?P(B):I,ce=H?W(B):V,G=a.selectedSessions.length>0?(()=>{let e=x.filter(e=>a.selectedSessions.includes(e.key)),t=new Set;for(let n of e)for(let e of n.usage?.activityDates??[])t.add(e);return t.size>0?i.costDaily.filter(e=>t.has(e.date)):i.costDaily})():i.costDaily,q=oe(B,U,ce),ge=!i.loading&&!i.totals&&i.sessions.length===0,_e=d(i.cacheStatus),J=(U?.missingCostEntries??0)>0||(U?U.totalTokens>0&&U.totalCost===0&&U.input+U.output+U.cacheRead+U.cacheWrite>0:!1),Y=[{label:r(`usage.presets.today`),days:1},{label:r(`usage.presets.last7d`),days:7},{label:r(`usage.presets.last30d`),days:30},{label:r(`usage.presets.last90d`),days:90},{label:r(`usage.presets.last1y`),days:365}],ve=e=>{let t=new Date,n=new Date;n.setDate(n.getDate()-(e-1)),l.onStartDateChange(ie(n)),l.onEndDateChange(ie(t))},ye=()=>{l.onStartDateChange(`1970-01-01`),l.onEndDateChange(ie(new Date))},be=(e,i,o)=>{if(o.length===0)return n;let s=T(e),c=new Set(s.map(e=>K(e))),u=o.length>0&&o.every(e=>c.has(K(e))),d=s.length;return t`
      <details class="usage-filter-select" @toggle=${it}>
        <summary>
          <span>${i}</span>
          ${d>0?t`<span class="usage-filter-badge">${d}</span>`:t` <span class="usage-filter-badge">${r(`usage.filters.all`)}</span> `}
        </summary>
        <div class="usage-filter-popover">
          <div class="usage-filter-actions">
            <button
              class="btn btn--sm"
              @click=${t=>{t.preventDefault(),t.stopPropagation(),l.onQueryDraftChange(he(a.queryDraft,e,o))}}
              ?disabled=${u}
            >
              ${r(`usage.filters.selectAll`)}
            </button>
            <button
              class="btn btn--sm"
              @click=${t=>{t.preventDefault(),t.stopPropagation(),l.onQueryDraftChange(he(a.queryDraft,e,[]))}}
              ?disabled=${d===0}
            >
              ${r(`usage.filters.clear`)}
            </button>
          </div>
          <div class="usage-filter-options">
            ${o.map(n=>t`
                <label class="usage-filter-option">
                  <input
                    type="checkbox"
                    .checked=${c.has(K(n))}
                    @change=${t=>{let r=t.target,i=`${e}:${n}`;l.onQueryDraftChange(r.checked?pe(a.queryDraft,i):me(a.queryDraft,i))}}
                  />
                  <span>${n}</span>
                </label>
              `)}
          </div>
        </div>
      </details>
    `},xe=()=>{let e=a.agentId??``;return t`
      <details class="usage-filter-select">
        <summary>
          <span>${r(`usage.filters.agent`)}</span>
          <span class="usage-filter-badge">${e||r(`usage.filters.all`)}</span>
        </summary>
        <div class="usage-filter-popover">
          <div class="usage-filter-options">
            ${[``,...D].map(n=>t`
                <label class="usage-filter-option">
                  <input
                    type="radio"
                    name="usage-agent-scope"
                    .checked=${e===n}
                    @change=${()=>l.onAgentChange(n||null)}
                  />
                  <span>${n||r(`usage.filters.all`)}</span>
                </label>
              `)}
          </div>
        </div>
      </details>
    `},Se=ie(new Date);return t`
    <div class="usage-page">
      <section class="card usage-header ${o.headerPinned?`pinned`:``}">
        <div class="usage-header-row">
          <div class="usage-header-title">
            <div class="card-title usage-section-title">${r(`usage.filters.title`)}</div>
            ${i.loading||_e?t`<span class="usage-refresh-indicator" title=${_e??``}>
                  ${r(`usage.loading.badge`)}
                </span>`:n}
            ${ge?t`<span class="usage-query-hint">${r(`usage.empty.hint`)}</span>`:n}
          </div>
          <div class="usage-header-metrics">
            ${I?t`
                  <span class="usage-metric-badge">
                    <strong>${O(I.totalTokens)}</strong>
                    ${r(`usage.metrics.tokens`)}
                  </span>
                  <span class="usage-metric-badge">
                    <strong>${z(I.totalCost)}</strong>
                    ${r(`usage.metrics.cost`)}
                  </span>
                  <span class="usage-metric-badge">
                    <strong>${L}</strong>
                    ${r(L===1?`usage.metrics.session`:`usage.metrics.sessions`)}
                  </span>
                `:n}
            <button
              class="btn btn--sm usage-pin-btn ${o.headerPinned?`active`:``}"
              title=${o.headerPinned?r(`usage.filters.unpin`):r(`usage.filters.pin`)}
              @click=${l.onToggleHeaderPinned}
            >
              ${o.headerPinned?r(`usage.filters.pinned`):r(`usage.filters.pin`)}
            </button>
            <details class="usage-export-menu" @toggle=${it}>
              <summary class="btn btn--sm">${r(`usage.export.label`)} ▾</summary>
              <div class="usage-export-popover">
                <div class="usage-export-list">
                  <button
                    class="usage-export-item"
                    @click=${()=>se(`openclaw-usage-sessions-${Se}.csv`,le(x),`text/csv`)}
                    ?disabled=${x.length===0}
                  >
                    ${r(`usage.export.sessionsCsv`)}
                  </button>
                  <button
                    class="usage-export-item"
                    @click=${()=>se(`openclaw-usage-daily-${Se}.csv`,ue(G),`text/csv`)}
                    ?disabled=${G.length===0}
                  >
                    ${r(`usage.export.dailyCsv`)}
                  </button>
                  <button
                    class="usage-export-item"
                    @click=${()=>se(`openclaw-usage-${Se}.json`,JSON.stringify({totals:I,sessions:x,daily:G,aggregates:V},null,2),`application/json`)}
                    ?disabled=${x.length===0&&G.length===0}
                  >
                    ${r(`usage.export.json`)}
                  </button>
                </div>
              </div>
            </details>
          </div>
        </div>

        <div class="usage-header-row">
          <div class="usage-controls">
            ${Ie(a.selectedDays,a.selectedHours,a.selectedSessions,i.sessions,l.onClearDays,l.onClearHours,l.onClearSessions,l.onClearFilters)}
            <div class="usage-presets">
              ${Y.map(e=>t`
                  <button class="btn btn--sm" @click=${()=>ve(e.days)}>
                    ${e.label}
                  </button>
                `)}
              <button class="btn btn--sm" @click=${ye}>${r(`usage.presets.all`)}</button>
            </div>
            <div class="usage-date-range">
              <input
                class="usage-date-input"
                type="date"
                .value=${a.startDate}
                title=${r(`usage.filters.startDate`)}
                aria-label=${r(`usage.filters.startDate`)}
                @change=${e=>l.onStartDateChange(e.target.value)}
              />
              <span class="usage-separator">${r(`usage.filters.to`)}</span>
              <input
                class="usage-date-input"
                type="date"
                .value=${a.endDate}
                title=${r(`usage.filters.endDate`)}
                aria-label=${r(`usage.filters.endDate`)}
                @change=${e=>l.onEndDateChange(e.target.value)}
              />
            </div>
            <select
              class="usage-select"
              title=${r(`usage.filters.timeZone`)}
              aria-label=${r(`usage.filters.timeZone`)}
              .value=${a.timeZone}
              @change=${e=>l.onTimeZoneChange(e.target.value)}
            >
              <option value="local">${r(`usage.filters.timeZoneLocal`)}</option>
              <option value="utc">${r(`usage.filters.timeZoneUtc`)}</option>
            </select>
            <div class="chart-toggle">
              <button
                class="btn btn--sm toggle-btn ${a.scope===`instance`?`active`:``}"
                title=${r(`usage.scope.instanceHint`)}
                @click=${()=>l.onScopeChange(`instance`)}
              >
                ${r(`usage.scope.instance`)}
              </button>
              <button
                class="btn btn--sm toggle-btn ${a.scope===`family`?`active`:``}"
                title=${r(`usage.scope.familyHint`)}
                @click=${()=>l.onScopeChange(`family`)}
              >
                ${r(`usage.scope.family`)}
              </button>
            </div>
            <div class="chart-toggle">
              <button
                class="btn btn--sm toggle-btn ${p?`active`:``}"
                @click=${()=>u.onChartModeChange(`tokens`)}
              >
                ${r(`usage.metrics.tokens`)}
              </button>
              <button
                class="btn btn--sm toggle-btn ${p?``:`active`}"
                @click=${()=>u.onChartModeChange(`cost`)}
              >
                ${r(`usage.metrics.cost`)}
              </button>
            </div>
            <button
              class="btn btn--sm primary"
              @click=${l.onRefresh}
              ?disabled=${i.loading}
            >
              ${r(`common.refresh`)}
            </button>
          </div>
        </div>

        <div class="usage-query-section">
          <div class="usage-query-bar">
            <input
              class="usage-query-input"
              type="text"
              .value=${a.queryDraft}
              placeholder=${r(`usage.query.placeholder`)}
              @input=${e=>l.onQueryDraftChange(e.target.value)}
              @keydown=${e=>{e.key===`Enter`&&(e.preventDefault(),l.onApplyQuery())}}
            />
            <div class="usage-query-actions">
              <button
                class="btn btn--sm"
                @click=${l.onApplyQuery}
                ?disabled=${i.loading||!h&&!m}
              >
                ${r(`usage.query.apply`)}
              </button>
              ${h||m?t`
                    <button class="btn btn--sm" @click=${l.onClearQuery}>
                      ${r(`usage.filters.clear`)}
                    </button>
                  `:n}
              <span class="usage-query-hint">
                ${m?r(`usage.query.matching`,{shown:String(x.length),total:String(R)}):r(`usage.query.inRange`,{total:String(R)})}
              </span>
            </div>
          </div>
          <div class="usage-filter-row">
            ${xe()}
            ${be(`channel`,r(`usage.filters.channel`),k)}
            ${be(`provider`,r(`usage.filters.provider`),A)}
            ${be(`model`,r(`usage.filters.model`),j)}
            ${be(`tool`,r(`usage.filters.tool`),M)}
            <span class="usage-query-hint">${r(`usage.query.tip`)}</span>
          </div>
          ${w.length>0?t`
                <div class="usage-query-chips">
                  ${w.map(e=>{let n=e.raw;return t`
                      <span class="usage-query-chip">
                        ${n}
                        <button
                          title=${r(`usage.filters.remove`)}
                          @click=${()=>l.onQueryDraftChange(me(a.queryDraft,n))}
                        >
                          ×
                        </button>
                      </span>
                    `})}
                </div>
              `:n}
          ${C.length>0?t`
                <div class="usage-query-suggestions">
                  ${C.map(e=>t`
                      <button
                        class="usage-query-suggestion"
                        @click=${()=>l.onQueryDraftChange(fe(a.queryDraft,e.value))}
                      >
                        ${e.label}
                      </button>
                    `)}
                </div>
              `:n}
          ${S.length>0?t`
                <div class="callout warning usage-callout usage-callout--tight">
                  ${S.join(` · `)}
                </div>
              `:n}
        </div>

        ${i.error?t`<div class="callout danger usage-callout">${i.error}</div>`:n}
        ${_e?t`
              <div class="callout warning usage-callout usage-cache-warning">
                ${r(`usage.cacheStatus.warning`)} ${_e}
              </div>
            `:n}
        ${i.sessionsLimitReached?t`
              <div class="callout warning usage-callout">${r(`usage.sessions.limitReached`)}</div>
            `:n}
      </section>

      ${ge?rt(l.onRefresh):t`
            ${Ve(U,ce,q,J,te(B,a.timeZone),L,R)}
            ${re(B,a.timeZone,a.selectedHours,l.onSelectHour)}

            <div class="usage-grid">
              <div class="usage-grid-column">
                <div class="card usage-left-card">
                  ${Le(G,a.selectedDays,o.chartMode,o.dailyChartMode,u.onDailyChartModeChange,l.onSelectDay)}
                  ${I?Re(I,o.chartMode):n}
                </div>
                ${He(x,a.selectedSessions,a.selectedDays,p,o.sessionSort,o.sessionSortDir,o.recentSessions,o.sessionsTab,f.onSelectSession,u.onSessionSortChange,u.onSessionSortDirChange,u.onSessionsTabChange,o.visibleColumns,R,l.onClearSessions)}
              </div>
              ${N?t`<div class="usage-grid-column">
                    ${Xe(N,s.timeSeries,s.timeSeriesLoading,s.timeSeriesMode,f.onTimeSeriesModeChange,s.timeSeriesBreakdownMode,f.onTimeSeriesBreakdownChange,s.timeSeriesCursorStart,s.timeSeriesCursorEnd,f.onTimeSeriesCursorRangeChange,a.startDate,a.endDate,a.selectedDays,s.sessionLogs,s.sessionLogsLoading,s.sessionLogsExpanded,f.onToggleSessionLogsExpanded,s.logFilters,f.onLogFilterRolesChange,f.onLogFilterToolsChange,f.onLogFilterHasToolsChange,f.onLogFilterQueryChange,f.onLogFilterClear,o.contextExpanded,f.onToggleContextExpanded,l.onClearSessions)}
                  </div>`:n}
            </div>
          `}
    </div>
  `}export{at as renderUsage};
//# sourceMappingURL=usage-CGmWOe6W.js.map