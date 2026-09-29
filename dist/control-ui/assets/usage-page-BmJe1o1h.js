import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Aa as t,Cr as n,Ir as r,Or as i,Qr as a,Xr as o,Zr as s,ai as c,co as l,fr as u,ma as d}from"./control-ui-foundation-Ds5QQwGa.js";import{Ar as f,Br as p,En as m,Gl as h,Ll as g,On as _,Ur as v,Vr as y,Xl as b,_n as x,dn as S,in as C,mn as w,nc as T,nu as E,rn as D,tc as O,tu as k,vi as A,yi as j,zl as M}from"./control-ui-core-DkXlmHxW.js";import{$ as N,B as P,H as F,X as I,Y as L,b as R,ct as z,nt as B,tt as V,ut as ee,x as te}from"./lit-runtime-DLvISeBM.js";import{Di as H,Ni as U,Oi as W,Qa as ne,do as re,fo as ie}from"./control-ui-core-BdNTI4B-.js";import{Cn as ae,Ko as oe,Xo as se,la as ce,mo as le,po as ue,sa as de,zl as fe}from"./control-ui-boot-shared-XNIZlLuA.js";import{Bi as pe,Ct as me,Dt as he,Et as ge,Hi as _e,Pa as ve,Rr as ye,St as be,ai as xe,ci as Se,li as Ce,oi as we,pt as G,si as Te,ui as Ee,zr as De}from"./control-ui-boot-shared-C5a8_33C.js";import{n as Oe,t as ke}from"./settings-workspace-DkkrNauO.js";import{n as Ae,t as je}from"./agent-row-chip-AAtTH9tg.js";import{n as Me,t as Ne}from"./agent-scope-control-LCBIfOme.js";import{i as Pe,n as Fe,r as Ie}from"./usage-_abXQ0Pm.js";import{a as Le,i as Re,n as ze,o as Be,r as Ve,s as He}from"./usage-hVKt6OVY.js";import{a as Ue,c as We,d as Ge,f as Ke,i as qe,l as Je,n as Ye,o as Xe,r as Ze,s as Qe,t as $e,u as et}from"./request-usage-snapshot-Dhi9mBkU.js";function tt(e,t){return[e,t].some(e=>e&&e.status!==`fresh`)}function nt(e,t,n){let r=v(t),i=Se(r?Te():e,t,n);return{clearData:r,status:r&&i.error?{...i,error:p(`usage details`)}:i}}function rt(){return(rt=e((()=>{Ce(),y()})))()}function it(e,t){let n=null,r=(t,r)=>{if(n===t){n=null;try{r()}catch{}finally{e.requestUpdate()}}};return{get pending(){return n!==null},cancel:()=>{let t=n;n=null,t?.abort(),e.requestUpdate()},async run(i){let a=n,o=new AbortController;n=o,a?.abort(),e.requestUpdate();let s;try{s=await t.task(i,{signal:o.signal})}catch(e){r(o,()=>t.onError(e));return}r(o,()=>t.onComplete(s))}}}function at(e,t){return e?.key===t.key&&e.agentId===t.agentId&&e.sessionId===t.sessionId}function ot(e,n,r,i,a,o){let s=null,c=Te(),l=null,u=0,d=it(e,{task:async([e,n],{signal:i})=>({target:n,data:await r(e,{key:n.key,...!t(n.key.trim())&&n.agentId?{agentId:n.agentId}:{}},i,n.sessionId)}),onComplete:e=>{l=null,s=e,c=we()},onError:e=>{l=null;let t=nt(c,e,n.snapshot);t.clearData&&s&&delete s.data,c=t.status}}),f=()=>{l&&n.snapshot&&!_(n.snapshot)&&(c=Se(c,void 0,n.snapshot)),l=null,u+=1,d.cancel()},p=e=>{s=e?{target:e}:null,c=Te(),o?.()};return{get data(){return s?.data??null},get status(){return c},get loading(){return l!==null},async recover(e,t=!1){let r=u,a=i(e);await l,r===u&&at(a,i(e))&&n.snapshot&&_(n.snapshot)&&(c.awaitingGateway||c.error!==null||t&&!c.hasLoaded)&&this.load(e)},load(e,t=!0){let r=n.client;if(!r||!n.connected)return Promise.resolve();let o=!!e&&a?.(e)!==!1,m=i(e),h=at(s?.target,m);return(!h||!o)&&p(o?m:void 0),o?!t&&h?l??Promise.resolve():(c=xe(c),u+=1,l=d.run([r,m])):(f(),Promise.resolve())},cancel:f,clear(){p(),f()}}}var st;function ct(){return(ct=e((()=>{d(),Ce(),h(),m(),rt(),st=class{constructor(e,t,n,r,i){let a=e=>{let t=r().find(t=>t.key===e),i=t?.agentId??n().agentId;return{key:e,...i?{agentId:i}:{},sessionId:t?.sessionId}};this.timeSeries=ot(e,t,Pe,a,void 0,i),this.sessionLogs=ot(e,t,async(e,t)=>{let n=await Ie(e,t);return Array.isArray(n.logs)?n.logs:null},a),this.contextWeight=ot(e,t,async(e,t,r,i)=>{let a=(await Fe(e,{...n(),agentId:t.agentId},{key:t.key,includeContextWeight:!0,signal:r})).sessions[0];if(i!==void 0&&a?.sessionId!==void 0&&a.sessionId!==i)throw Error(b(`usage.details.contextOutOfDate`));return a?.contextWeight},a,e=>r().some(t=>t.key===e&&t.hasContextWeight))}load(e,t=!0){this.timeSeries.load(e,t),this.sessionLogs.load(e,t),this.contextWeight.load(e)}cancel(){this.timeSeries.cancel(),this.sessionLogs.cancel(),this.contextWeight.cancel()}clear(){this.timeSeries.clear(),this.sessionLogs.clear(),this.contextWeight.clear()}}})))()}var lt,ut;function dt(){return(dt=e((()=>{E(),lt={usage:{presets:{today:`Today`,last7d:`7d`,last30d:`30d`,last90d:`90d`,last1y:`1y`,all:`All`},scope:{instance:`Current instance`,instanceHint:`Show only the active session id for each logical session.`,family:`Historical lineage`,familyHint:`Roll up known rotated transcript-backed session ids.`,familyIncluded:`Historical lineage includes {count} session instances.`},filters:{rangeTitle:`Reporting range`,rangeHint:`Choose the dates to include in every chart and total.`,title:`Filters`,to:`to`,startDate:`Start date`,endDate:`End date`,timeZone:`Time zone`,timeZoneLocal:`Local`,timeZoneUtc:`UTC`,pin:`Pin`,pinned:`Pinned`,selectAll:`Select All`,clear:`Clear`,clearAll:`Clear All`,remove:`Remove filter`,removeDays:`Remove days filter`,removeHours:`Remove hours filter`,removeSession:`Remove session filter`,all:`All`,days:`Days`,hours:`Hours`,session:`Session`,agent:`Agent`,channel:`Channel`,provider:`Provider`,model:`Model`,tool:`Tool`,daysCount:`{count} days`,hoursCount:`{count} hours`,sessionsCount:`{count} sessions`},query:{placeholder:`Filter sessions (e.g. key:agent:main:cron* model:gpt-4o has:errors minTokens:2000)`,apply:`Filter (client-side)`,matching:`{shown} of {total} sessions match`,inRange:`{total} sessions in range`,tip:`Tip: use filters or click bars to refine days.`},export:{label:`Export`,changed:`Session context changed while preparing the export. Refresh usage and try again.`,sessionsCsv:`Sessions CSV`,dailyCsv:`Daily CSV`,json:`JSON`},cacheStatus:{warning:`Usage data may be incomplete. Checking for updated totals automatically.`,paused:`Usage data may be incomplete. Automatic checks paused; select Refresh to check again.`},creators:{title:`Started by`,description:`Usage grouped by who started each session. This is session attribution, not per-turn billing.`,all:`All identities`,select:`Filter by session creator`,selected:`Selected identity`,identity:`Identity`,unattributed:`Unattributed`,system:`System`,empty:`No usage for these dates and filters.`,more:`Show {count} more identities`},empty:{title:`No usage in this date range`,subtitle:`Try a wider date range or another identity to explore more history.`,hint:`Choose a wider date range or another identity.`,noData:`No data`},daily:{title:`Daily Usage`,total:`Total`,byType:`By Type`,tokensTitle:`Daily Token Usage`,costTitle:`Daily Cost`,compressedScaleHint:`Square-root scale keeps low-usage days visible.`},costWindows:{title:`Cost Windows`,subtitle:`Calendar windows ending {date}`,selectedRange:`Selected Range`,lastDays:`Last {count} days`,perDay:`/ day`},overview:{messages:`Messages`,messagesHint:`Total user and assistant messages in range.`,messagesAbbrev:`msgs`,user:`user`,assistant:`assistant`,toolCalls:`Tool Calls`,toolCallsHint:`Total tool call count across sessions.`,toolsUsed:`tools used`,errors:`Errors`,errorsHint:`Total message and tool errors in range.`,toolResults:`tool results`,avgTokens:`Avg Tokens / Msg`,avgTokensHint:`Average tokens per message in this range.`,avgCost:`Avg Cost / Msg`,avgCostHint:`Average cost per message when providers report costs.`,avgCostHintMissing:`Average cost per message when providers report costs. Cost data is missing for some or all sessions in this range.`,acrossMessages:`Across {count} messages`,sessions:`Sessions`,sessionsHint:`Distinct sessions in the range.`,sessionsInRange:`of {count} in range`,throughput:`Throughput`,throughputHint:`Throughput shows tokens per minute over active time. Higher is better.`,tokensPerMinute:`tok/min`,perMinute:`/ min`,errorRate:`Error Rate`,errorHint:`Error rate = errors / total messages. Lower is better.`,avgSession:`avg session`,cacheHitRate:`Cache Hit Rate`,cacheHint:`Cache hit rate = cache read / (input + cache read + cache write). Higher is better.`,cached:`cached`,prompt:`prompt`,calls:`calls`,costShare:`{percent}% of cost`,topModels:`Top Models`,topProviders:`Top Providers`,topTools:`Top Tools`,topAgents:`Top Agents`,topChannels:`Top Channels`,peakErrorDays:`Peak Error Days`,peakErrorHours:`Peak Error Hours`,noModelData:`No model data`,noProviderData:`No provider data`,noToolCalls:`No tool calls`,noAgentData:`No agent data`,noChannelData:`No channel data`,noErrorData:`No error data`},sessions:{title:`Sessions`,shown:`{count} shown`,total:`{count} total`,avg:`avg`,all:`All`,recent:`Recently viewed`,recentShort:`Recent`,sort:`Sort`,ascending:`Ascending`,descending:`Descending`,clearSelection:`Clear Selection`,noRecent:`No recent sessions`,noneInRange:`No sessions in range`,more:`+{count} more`,selected:`Selected ({count})`,copy:`Copy`,limitReached:`Showing first 1,000 sessions. Narrow date range for complete results.`},mosaic:{title:`Activity by Time`,subtitleEmpty:`Estimates require session timestamps.`,subtitle:`Estimated from session spans (first/last activity). Time zone: {zone}.`,noTimelineData:`No timeline data yet.`,dayOfWeek:`Day of Week`,midnight:`Midnight`,fourAm:`4am`,eightAm:`8am`,noon:`Noon`,fourPm:`4pm`,eightPm:`8pm`,legend:`Low → High token density`,sun:`Sun`,mon:`Mon`,tue:`Tue`,wed:`Wed`,thu:`Thu`,fri:`Fri`,sat:`Sat`}}},ut=Object.assign(()=>{let{overview:e,...t}=lt.usage;Object.assign(k.usage,t),Object.assign(k.usage.overview,e)},{catalog:lt})})))()}function ft({agentId:e,key:t,sessionId:n}){return JSON.stringify([e,t,n])}function pt(e,t,n){return it(e,{task:async(e,{signal:r})=>{let i=t.capture();if(!i)throw Error(b(`common.offline`));let a=`openclaw-usage-${Ue()}.json`,o=new Map;if(e.sessions.some(e=>e.hasContextWeight)){let t=await Fe(i.client,n(),{includeContextWeight:!0,signal:r});if(o=new Map(t.sessions.map(e=>[ft(e),e.contextWeight])),e.sessions.some(e=>e.hasContextWeight&&!o.get(ft(e))))throw Error(b(`usage.export.changed`))}return{connection:i,filename:a,data:{...e,sessions:e.sessions.map(e=>({...e,contextWeight:o.get(ft(e))??null}))}}},onComplete:({connection:e,filename:n,data:r})=>{t.isCurrent(e)&&ae(n,JSON.stringify(r,null,2),`application/json;charset=utf-8`)},onError:e=>{j({message:`${b(`usage.export.label`)}: ${Ge(e)}`})}})}function mt(){return(mt=e((()=>{h(),dt(),A(),We(),ut()})))()}function ht(e,t,n){let r=t?.sessions.map(e=>e.agentId).filter(e=>!!e?.trim())??[];return N`
    ${me({title:ie(`usage`),subtitle:re(`usage`),actions:Me({agents:e.agents.state.agentsList?.agents??[],additionalAgentIds:r,selection:e.agentSelection})})}
    ${Oe(n)}
  `}function gt(e){return N`
    <span class="settings-status settings-status--accent">
      <span class="usage-loading-spinner" aria-hidden="true"></span>
      ${e}
    </span>
  `}function _t(e){return N`
    <section class="settings-group usage-panel usage-empty-state">
      <div class="usage-empty-state__title">${b(`usage.empty.title`)}</div>
      <div class="card-sub usage-empty-state__subtitle">${b(`usage.empty.subtitle`)}</div>
      <div class="usage-empty-state__actions">
        <button class="btn primary" @click=${e}>${b(`common.refresh`)}</button>
      </div>
    </section>
  `}function vt(e,t,n){return Ee({status:e,errorMessage:e.error?b(`usage.details.loadFailed`,{detail:l(b(t)),error:e.error}):void 0,className:`usage-callout usage-detail-error--${n}`})}function yt(){return(yt=e((()=>{L(),ne(),Ne(),Ce(),G(),ke(),h()})))()}var bt;function xt(){return(xt=e((()=>{bt=[`channel`,`agent`,`provider`,`model`,`messages`,`tools`,`errors`,`duration`]})))()}function K(){return{input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0}}function St(e,t){if(e.input+=t.input,e.output+=t.output,e.cacheRead+=t.cacheRead,e.cacheWrite+=t.cacheWrite,e.totalTokens+=t.totalTokens,e.totalCost+=t.totalCost,e.inputCost+=t.inputCost,e.outputCost+=t.outputCost,e.cacheReadCost+=t.cacheReadCost,e.cacheWriteCost+=t.cacheWriteCost,e.missingCostEntries+=t.missingCostEntries,t.missingCostByModel){e.missingCostByModel??={};for(let[n,r]of Object.entries(t.missingCostByModel))e.missingCostByModel[n]=(e.missingCostByModel[n]??0)+r}}function Ct(e,t){return JSON.stringify([e??`unknown`,t??`unknown`])}function wt(e,t,n){return JSON.stringify([e,t??`unknown`,n??`unknown`])}function Tt(){return{count:0,sum:0,min:1/0,max:0,p95Max:0}}function Et(e,t){e.count+=t.count,e.sum+=t.avgMs*t.count,e.min=Math.min(e.min,t.minMs),e.max=Math.max(e.max,t.maxMs),e.p95Max=Math.max(e.p95Max,t.p95Ms)}function Dt(e){return{count:e.count,avgMs:e.count?e.sum/e.count:0,minMs:e.min===1/0?0:e.min,maxMs:e.max,p95Ms:e.p95Max}}function Ot(e,t,n,r){let i=e.get(t)??{provider:n.provider,model:r,count:0,totals:K()};i.count+=n.count,St(i.totals,n.totals),e.set(t,i)}function kt(e,t,n){if(!t)return;let r=e.get(t)??K();St(r,n),e.set(t,r)}function At(e,t){return t.totals.totalCost-e.totals.totalCost||t.totals.totalTokens-e.totals.totalTokens}function jt(){let e=K(),t={total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},n=new Map,r=new Map,i=new Map,a=new Map,o=new Map,s=new Map,c=new Map,l=new Map,u=new Map,d=new Map,f=Tt(),p=0,m=0;function h(e){let t=c.get(e);return t||(t={date:e,tokens:0,cost:0,messages:0,toolCalls:0,errors:0},c.set(e,t)),t}function g({usage:c,agentId:g,channel:_,createdActor:v,creatorKey:y=Mt}){if(!c)return;St(e,c),m=Math.max(m,c.durationMs??0);let b=c.firstActivity!==void 0||(c.messageCounts?.total??0)>0;b&&(p+=1),c.messageCounts&&(t.total+=c.messageCounts.total,t.user+=c.messageCounts.user,t.assistant+=c.messageCounts.assistant,t.toolCalls+=c.messageCounts.toolCalls,t.toolResults+=c.messageCounts.toolResults,t.errors+=c.messageCounts.errors);for(let e of c.toolUsage?.tools??[])n.set(e.name,(n.get(e.name)??0)+e.count);for(let e of c.modelUsage??[])Ot(r,Ct(e.provider,e.model),e,e.model),Ot(i,e.provider??`unknown`,e,void 0);kt(a,g,c),kt(o,_,c);let x=s.get(y)??{key:y,...v?{actor:v}:{},totals:K(),sessionCount:0,daily:new Map,sessionActivity:new Map};if(St(x.totals,c),b){x.sessionCount+=1;let e=[...new Set([...c.activityDates??[],...c.dailyBreakdown?.map(({date:e})=>e)??[],...c.dailyMessageCounts?.map(({date:e})=>e)??[]])].toSorted(),t=JSON.stringify(e),n=x.sessionActivity.get(t)??{dates:e,sessionCount:0};n.sessionCount+=1,x.sessionActivity.set(t,n)}s.set(y,x),c.latency&&c.latency.count>0&&Et(f,c.latency);for(let e of c.dailyLatency??[]){let t=u.get(e.date)??Tt();Et(t,e),u.set(e.date,t)}for(let e of c.dailyBreakdown??[]){let t=h(e.date);t.tokens+=e.tokens,t.cost+=e.cost,kt(l,e.date,e),kt(x.daily,e.date,e)}for(let e of c.dailyMessageCounts??[]){let t=h(e.date);t.messages+=e.total,t.toolCalls+=e.toolCalls,t.errors+=e.errors}for(let e of c.dailyModelUsage??[]){let t=wt(e.date,e.provider,e.model),n=d.get(t)??{date:e.date,provider:e.provider,model:e.model,tokens:0,cost:0,count:0};n.tokens+=e.tokens,n.cost+=e.cost,n.count+=e.count,d.set(t,n)}}function _(){let e=Array.from(n,([e,t])=>({name:e,count:t})).toSorted((e,t)=>t.count-e.count);return{sessionCount:p,...m>0?{longestSessionDurationMs:m}:{},messages:t,tools:{totalCalls:e.reduce((e,{count:t})=>e+t,0),uniqueTools:n.size,tools:e},byModel:Array.from(r.values()).toSorted(At),byProvider:Array.from(i.values()).toSorted(At),byAgent:Array.from(a,([e,t])=>({agentId:e,totals:t})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),byChannel:Array.from(o,([e,t])=>({channel:e,totals:t})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),byCreator:Array.from(s.values(),({daily:e,sessionActivity:t,...n})=>({...n,daily:Array.from(e,([e,t])=>({date:e,...t})).toSorted((e,t)=>e.date.localeCompare(t.date)),sessionActivity:Array.from(t.values()).toSorted((e,t)=>e.dates.join(`,`).localeCompare(t.dates.join(`,`)))})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost||t.totals.totalTokens-e.totals.totalTokens||e.key.localeCompare(t.key)),costDaily:Array.from(l,([e,t])=>({date:e,...t})).toSorted((e,t)=>e.date.localeCompare(t.date)),latency:f.count>0?Dt(f):void 0,dailyLatency:Array.from(u,([e,t])=>({date:e,...Dt(t)})).toSorted((e,t)=>e.date.localeCompare(t.date)),modelDaily:Array.from(d.values()).toSorted((e,t)=>e.date.localeCompare(t.date)||t.cost-e.cost),daily:Array.from(c.values()).toSorted((e,t)=>e.date.localeCompare(t.date))}}return{totals:e,add:g,finish:_}}var Mt;function Nt(){return(Nt=e((()=>{Mt=`["unknown"]`})))()}function Pt(e){return Math.round(e/nn)}function q(e){return C(e,{thousandsSuffix:`K`,trimTrailingZero:!1})}function J(e,t=2){return`$${e.toFixed(t)}`}function Ft(e){return new Date(Date.UTC(1970,0,1,e)).toLocaleTimeString(void 0,{hour:`numeric`,timeZone:`UTC`})}function It(e,t,n){let r=e.usage;if(!r)return!1;let i=r.firstActivity??e.updatedAt,a=r.lastActivity??e.updatedAt;if(!i||!a)return!1;let o=Math.min(i,a),s=Math.max(i,a);if(o===s){let e=new Date(o);return n({usage:r,hour:Rt(e,t),weekday:zt(e,t),share:1}),!0}let c=s-o,l=o;for(;l<s;){let e=new Date(l),i=Math.min(Ht(e,t),s);n({usage:r,hour:Rt(e,t),weekday:zt(e,t),share:(i-l)/c}),l=i}return!0}function Lt(e,t){let n=Array.from({length:24},()=>0),r=Array.from({length:24},()=>0);for(let i of e){let e=i.usage;if(!e?.messageCounts||e.messageCounts.total===0)continue;let a=e.messageCounts;if(e.utcQuarterHourMessageCounts&&e.utcQuarterHourMessageCounts.length>0){let i={utcDateKey:void 0,utcWeekday:null,utcStartMs:0};for(let a of e.utcQuarterHourMessageCounts){let e=Vt(a.date,a.quarterIndex,t,i);e&&(n[e.hour]=(n[e.hour]??0)+a.errors,r[e.hour]=(r[e.hour]??0)+a.total)}continue}It(i,t,({hour:e,share:t})=>{n[e]=(n[e]??0)+(a.errors??0)*t,r[e]=(r[e]??0)+a.total*t})}return r.map((e,t)=>{let r=n[t]??0;return{hour:t,rate:e>0?r/e:0,errors:r,msgs:e}}).filter(e=>e.msgs>0&&e.errors>0).toSorted((e,t)=>t.rate-e.rate).slice(0,5).map(e=>({label:Ft(e.hour),value:`${(e.rate*100).toFixed(2)}%`,sub:`${Math.round(e.errors)} ${l(b(`usage.overview.errors`))} · ${Math.round(e.msgs)} ${b(`usage.overview.messagesAbbrev`)}`}))}function Rt(e,t){return t===`utc`?e.getUTCHours():e.getHours()}function zt(e,t){return t===`utc`?e.getUTCDay():e.getDay()}function Bt(e,t){let n=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!n||!Number.isInteger(t)||t<0||t>95)return null;let[,r,i,a]=n,o=Number(r),s=Number(i),c=Number(a),l=new Date(Date.UTC(o,s-1,c,0,t*15));return Number.isNaN(l.valueOf())||l.getUTCFullYear()!==o||l.getUTCMonth()!==s-1||l.getUTCDate()!==c?null:l}function Vt(e,t,n,r){if(!Number.isInteger(t)||t<0||t>95)return null;if(e!==r.utcDateKey){r.utcDateKey=e;let t=Bt(e,0);r.utcWeekday=t?t.getUTCDay():null,r.utcStartMs=t?t.getTime():0}if(r.utcWeekday===null)return null;let i=n===`local`?new Date(r.utcStartMs+t*9e5):null;return{hour:i?Rt(i,n):Math.floor((t+0)/4),weekday:i?zt(i,n):r.utcWeekday}}function Ht(e,t){let n=e.getTime(),r=t===`utc`?e.getUTCMinutes():e.getMinutes(),i=t===`utc`?e.getUTCSeconds():e.getSeconds(),a=n+(60-r)*6e4-i*1e3-e.getMilliseconds();if(t===`utc`||new Date(a-1).getTimezoneOffset()===e.getTimezoneOffset())return a;let o=e.getTimezoneOffset(),s=n+1,c=a-1;for(;s<c;){let e=s+Math.floor((c-s)/2);new Date(e).getTimezoneOffset()===o?s=e+1:c=e}return s}function Ut(e,t,n){let r=e.usage?.utcQuarterHourTokenUsage;if(!r||r.length===0)return!1;let i=!1,a={utcDateKey:void 0,utcWeekday:null,utcStartMs:0};for(let e of r){if(e.totalTokens<=0)continue;let r=Vt(e.date,e.quarterIndex,t,a);if(r&&(i=!0,n({hour:r.hour,weekday:r.weekday,tokens:e.totalTokens})===!1))break}return i}function Wt(e,t,n){let r=e.usage,i=r?.firstActivity??e.updatedAt,a=r?.lastActivity??e.updatedAt;if(!i||!a)return!1;let o=Math.min(i,a),s=Math.max(i,a),c=o;for(;c<=s;){let e=new Date(c),r=Rt(e,n);if(t.includes(r))return!0;if(c===s)break;c=Math.min(Ht(e,n),s)}return!1}function Gt(e,t,n){if(t.length===0)return!0;let r=!1;return Ut(e,n,({hour:e})=>(r=t.includes(e),!r))?r:Wt(e,t,n)}function Kt(e,t){let n=Array.from({length:24},()=>0),r=Array.from({length:7},()=>0),i=0,a=!1;for(let o of e){let e=o.usage;if(!(!e||!e.totalTokens||e.totalTokens<=0)){if(i+=e.totalTokens,Ut(o,t,({hour:e,weekday:t,tokens:i})=>{n[e]=(n[e]??0)+i,r[t]=(r[t]??0)+i})){a=!0;continue}It(o,t,({usage:e,hour:t,weekday:i,share:a})=>{n[t]=(n[t]??0)+e.totalTokens*a,r[i]=(r[i]??0)+e.totalTokens*a})&&(a=!0)}}let o=[b(`usage.mosaic.sun`),b(`usage.mosaic.mon`),b(`usage.mosaic.tue`),b(`usage.mosaic.wed`),b(`usage.mosaic.thu`),b(`usage.mosaic.fri`),b(`usage.mosaic.sat`)].map((e,t)=>({label:e,tokens:r[t]??0}));return{hasData:a,totalTokens:i,hourTotals:n,weekdayTotals:o}}function qt(e,t,n,r){let i=Kt(e,t);if(!i.hasData)return ge({title:b(`usage.mosaic.title`),description:b(`usage.mosaic.subtitleEmpty`),actions:N`
          <div class="usage-mosaic-total">
            ${q(0)} ${l(b(`usage.metrics.tokens`))}
          </div>
        `},N`
        <div class="usage-panel usage-mosaic">
          <div class="usage-empty-block usage-empty-block--compact">
            ${b(`usage.mosaic.noTimelineData`)}
          </div>
        </div>
      `);let a=Math.max(...i.hourTotals,1),o=Math.max(...i.weekdayTotals.map(e=>e.tokens),1);return ge({title:b(`usage.mosaic.title`),description:b(`usage.mosaic.subtitle`,{zone:b(t===`utc`?`usage.filters.timeZoneUtc`:`usage.filters.timeZoneLocal`)}),actions:N`
        <div class="usage-mosaic-total">
          ${q(i.totalTokens)}
          ${l(b(`usage.metrics.tokens`))}
        </div>
      `},N`
      <div class="usage-panel usage-mosaic">
        <div class="usage-mosaic-grid">
          <div class="usage-mosaic-section">
            <div class="usage-mosaic-section-title">${b(`usage.mosaic.dayOfWeek`)}</div>
            <div class="usage-daypart-grid">
              ${i.weekdayTotals.map(e=>{let t=Math.min(e.tokens/o,1),n=e.tokens>0?`color-mix(in srgb, var(--accent) ${(12+t*60).toFixed(1)}%, transparent)`:`transparent`;return N`
                  <div class="usage-daypart-cell" style="background: ${n};">
                    <div class="usage-daypart-label">${e.label}</div>
                    <div class="usage-daypart-value">${q(e.tokens)}</div>
                  </div>
                `})}
            </div>
          </div>
          <div class="usage-mosaic-section">
            <div class="usage-mosaic-section-title">
              <span>${b(`usage.filters.hours`)}</span>
              <span class="usage-mosaic-sub">0 → 23</span>
            </div>
            <div class="usage-hour-grid">
              ${i.hourTotals.map((e,t)=>{let i=Math.min(e/a,1),o=e>0?`color-mix(in srgb, var(--accent) ${(8+i*70).toFixed(1)}%, transparent)`:`transparent`,s=`${t}:00 · ${q(e)} ${l(b(`usage.metrics.tokens`))}`,c=i>.7?`color-mix(in srgb, var(--accent) 60%, transparent)`:`color-mix(in srgb, var(--accent) 24%, transparent)`,u=n.includes(t);return N`
                  <button
                    type="button"
                    class="usage-hour-cell ${u?`selected`:``}"
                    style="background: ${o}; border-color: ${c};"
                    title="${s}"
                    aria-label=${s}
                    aria-pressed=${u?`true`:`false`}
                    @click=${e=>r(t,e.shiftKey)}
                  ></button>
                `})}
            </div>
            <div class="usage-hour-labels">
              <span>${b(`usage.mosaic.midnight`)}</span>
              <span>${b(`usage.mosaic.fourAm`)}</span>
              <span>${b(`usage.mosaic.eightAm`)}</span>
              <span>${b(`usage.mosaic.noon`)}</span>
              <span>${b(`usage.mosaic.fourPm`)}</span>
              <span>${b(`usage.mosaic.eightPm`)}</span>
            </div>
            <div class="usage-hour-legend">
              <span></span>
              ${b(`usage.mosaic.legend`)}
            </div>
          </div>
        </div>
      </div>
    `)}function Jt(e,t=`local`){let n=t===`utc`?e.getUTCFullYear():e.getFullYear(),r=(t===`utc`?e.getUTCMonth():e.getMonth())+1,i=t===`utc`?e.getUTCDate():e.getDate();return`${n}-${String(r).padStart(2,`0`)}-${String(i).padStart(2,`0`)}`}function Yt(e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!t)return null;let[,n,r,i]=t,a=Number(n),o=Number(r)-1,s=Number(i),c=new Date(a,o,s);return Number.isNaN(c.valueOf())||c.getFullYear()!==a||c.getMonth()!==o||c.getDate()!==s?null:c}function Xt(e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!t)return null;let n=Number(t[1]),r=Number(t[2]),i=Number(t[3]),a=Date.UTC(n,r-1,i),o=new Date(a);return o.getUTCFullYear()!==n||o.getUTCMonth()!==r-1||o.getUTCDate()!==i?null:a/rn}function Zt(e){return new Date(e*rn).toISOString().slice(0,10)}function Qt(e){let t=Yt(e);return t?t.toLocaleDateString(void 0,{month:`short`,day:`numeric`}):e}function $t(e){let t=Yt(e);return t?t.toLocaleDateString(void 0,{month:`long`,day:`numeric`,year:`numeric`}):e}function en(e,t,n){let r=Xt(t),i=Xt(n);if(r===null||i===null||r>i)return null;let a=K();for(let t of e){let e=Xt(t.date);e!==null&&e>=r&&e<=i&&St(a,t)}return{days:i-r+1,startDate:t,endDate:n,totals:a}}function tn(e,t,n,r=[1,7,30,90]){let i=Xt(t),a=Xt(n);if(i===null||a===null||i>a)return[];let o=a-i+1;return Array.from(new Set(r.map(e=>Math.max(1,Math.trunc(e))))).filter(e=>e<o).toSorted((e,t)=>e-t).map(t=>en(e,Zt(a-t+1),n)).filter(e=>e!==null)}var nn,rn,an,on;function sn(){return(sn=e((()=>{L(),Nt(),G(),h(),dt(),x(),ut(),nn=4,rn=864e5,an=(e,t)=>{if(e.length===0)return t??{messages:{total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},tools:{totalCalls:0,uniqueTools:0,tools:[]},byModel:[],byProvider:[],byAgent:[],byChannel:[],daily:[]};let n=jt();for(let t of e)n.add(t);return n.finish()},on=(e,t,n)=>{let r=0,i=0;for(let t of e){let e=t.usage?.durationMs??0;e>0&&(r+=e,i+=1)}let a=i?r/i:0,o=t&&r>0?t.totalTokens/(r/6e4):void 0,s=t&&r>0?t.totalCost/(r/6e4):void 0,c=n.messages.total?n.messages.errors/n.messages.total:0,l;for(let e of n.daily){if(e.messages<=0||e.errors<=0)continue;let t={date:e.date,errors:e.errors,messages:e.messages,rate:e.errors/e.messages};(!l||t.rate>l.rate||t.rate===l.rate&&t.errors>l.errors)&&(l=t)}return{durationSumMs:r,durationCount:i,avgDurationMs:a,throughputTokensPerMin:o,throughputCostPerMin:s,errorRate:c,peakErrorDay:l}}})))()}function cn(e){return/^[ \t\r\n]*[=+\-@\uFF0B\uFF0D\uFF1D\uFF20]/u.test(e)?`'${e}`:e}function ln(e,t=!0){let n=t?cn(e):e;return/[",\r\n]/.test(n)?`"${n.replaceAll(`"`,`""`)}"`:n}function un(e){return e.map(e=>e==null?``:ln(String(e),typeof e==`string`)).join(`,`)}function dn(e,t,n,r=12){for(let i of t){if(e.length>=r)break;let t=n(i);t&&!e.includes(t)&&e.push(t)}}function fn(e,t){let n={agent:[],channel:[],provider:[],model:[],tool:[]};return dn(n.agent,e,e=>e.agentId,6),dn(n.channel,e,e=>e.channel),dn(n.provider,e,e=>e.modelProvider),dn(n.provider,e,e=>e.providerOverride),dn(n.provider,t?.byProvider??[],e=>e.provider),dn(n.model,e,e=>e.model),dn(n.model,t?.byModel??[],e=>e.model),dn(n.tool,t?.tools.tools??[],e=>e.name),n}var pn,mn,hn,gn,Y,_n,vn;function yn(){return(yn=e((()=>{n(),We(),pn=e=>{let t=[un([`key`,`label`,`agentId`,`channel`,`provider`,`model`,`updatedAt`,`durationMs`,`messages`,`errors`,`toolCalls`,`inputTokens`,`outputTokens`,`cacheReadTokens`,`cacheWriteTokens`,`totalTokens`,`totalCost`])];for(let n of e){let e=n.usage;t.push(un([n.key,n.label??``,n.agentId??``,n.channel??``,n.modelProvider??n.providerOverride??``,n.model??n.modelOverride??``,i(n.updatedAt)??``,e?.durationMs??``,e?.messageCounts?.total??``,e?.messageCounts?.errors??``,e?.messageCounts?.toolCalls??``,e?.input??``,e?.output??``,e?.cacheRead??``,e?.cacheWrite??``,e?.totalTokens??``,e?.totalCost??``]))}return t.join(`
`)},mn=e=>{let t=[un([`date`,`inputTokens`,`outputTokens`,`cacheReadTokens`,`cacheWriteTokens`,`totalTokens`,`inputCost`,`outputCost`,`cacheReadCost`,`cacheWriteCost`,`totalCost`])];for(let n of e)t.push(un([n.date,n.input,n.output,n.cacheRead,n.cacheWrite,n.totalTokens,n.inputCost??``,n.outputCost??``,n.cacheReadCost??``,n.cacheWriteCost??``,n.totalCost]));return t.join(`
`)},hn=(e,t)=>{let n=e.trim();if(!n)return[];let r=Xe(n).map(e=>e.raw).at(-1)??``,[i,a]=r.includes(`:`)?[r.slice(0,r.indexOf(`:`)),r.slice(r.indexOf(`:`)+1)]:[``,``],o=l(i),s=l(a);if(!o)return[{label:`agent:`,value:`agent:`},{label:`channel:`,value:`channel:`},{label:`provider:`,value:`provider:`},{label:`model:`,value:`model:`},{label:`tool:`,value:`tool:`},{label:`has:errors`,value:`has:errors`},{label:`has:tools`,value:`has:tools`},{label:`minTokens:`,value:`minTokens:`},{label:`maxCost:`,value:`maxCost:`}];let c=[],u=(e,t)=>{for(let n of t.slice(0,6))(!s||l(n).includes(s))&&c.push({label:`${e}:${n}`,value:`${e}:${n}`})};switch(o){case`agent`:u(`agent`,t.agent);break;case`channel`:u(`channel`,t.channel);break;case`provider`:u(`provider`,t.provider);break;case`model`:u(`model`,t.model);break;case`tool`:u(`tool`,t.tool);break;case`has`:[`errors`,`tools`,`context`,`usage`,`model`,`provider`].forEach(e=>{(!s||e.includes(s))&&c.push({label:`has:${e}`,value:`has:${e}`})})}return c},gn=(e,t)=>{let n=e.trim();if(!n)return`${t} `;let r=Xe(n).map(e=>e.raw);return r[r.length-1]=t,`${r.join(` `)} `},Y=e=>l(e),_n=(e,t)=>{let n=Xe(e).map(e=>e.raw).filter(e=>e!==t);return n.length?`${n.join(` `)} `:``},vn=(e,t,n)=>{let r=Y(t),i=new Map(n.map(e=>[Y(e),e])),a=[];for(let t of Xe(e))(Y(t.key??``)!==r||i.delete(Y(t.value)))&&a.push(t.raw);let o=[...a,...Array.from(i.values(),e=>`${t}:${e}`)];return o.length?`${o.join(` `)} `:``}})))()}function bn(e,t,n){return{key:e,className:`usage-token-${e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}`,labelKey:`usage.breakdown.${e}`,hintKey:t,short:n}}function xn(e,t){return t===0?0:e/t*100}function Sn(e){let t=Math.abs(e);return J(e,t===0||t>=.01?2:t>=1e-4?4:6)}function Cn(e,t,n,r){(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),r(t,e.shiftKey,n))}function wn(e,t){let n=Date.parse(t.startDate),r=(Date.parse(t.endDate)-n)/864e5+1;if(!t.complete||!Number.isInteger(r)||r<1||r>366)return e.toSorted((e,t)=>e.date.localeCompare(t.date));let i=new Map(e.map(e=>[e.date,e]));return Array.from({length:r},(e,t)=>{let r=new Date(n+t*864e5).toISOString().slice(0,10);return i.get(r)??{...K(),date:r}})}function Tn(e,t,n,i,a,o,s){let c=wn(e,s);if(!c.length)return N`
      <div class="daily-chart-compact">
        <div class="card-title usage-section-title">${b(`usage.daily.title`)}</div>
        <div class="usage-empty-block">${b(`usage.empty.noData`)}</div>
      </div>
    `;let u=c.map(e=>e.date),d=n===`tokens`,f=c.map(e=>d?e.totalTokens:e.totalCost),p=Math.max(...f,0),m=p>0?p:d?1:1e-4,h=f.filter(e=>e>0),g=m/(h.length>0?Math.min(...h):m)>50,_=f.map(e=>{if(e<=0)return 0;let t=g?Math.sqrt(e/m):e/m;return Math.max(6,t*200)}),v=c.length>30?12:c.length>20?18:c.length>14?24:32,y=c.length<=14,x=new Set(t);return N`
    <div class="daily-chart-compact">
      <div class="daily-chart-header">
        ${he({mode:`buttons`,variant:`accent`,className:`small sessions-toggle`,value:i,onChange:a,onReselect:a,options:[{value:`total`,label:b(`usage.daily.total`)},{value:`by-type`,label:b(`usage.daily.byType`)}]})}
        <div class="card-title">
          ${b(d?`usage.daily.tokensTitle`:`usage.daily.costTitle`)}
          <div class="card-sub daily-chart-range">
            ${$t(s.startDate)} – ${$t(s.endDate)}
          </div>
          ${g?N`<span
                  class="daily-chart-scale-badge"
                  title=${b(`usage.daily.compressedScaleHint`)}
                  aria-label=${b(`usage.daily.compressedScaleHint`)}
                  >√</span
                >`:I}
        </div>
      </div>
      <div class="daily-chart">
        <div class="daily-chart-plot">
          <div class="daily-chart-scale" aria-hidden="true">
            ${(p>0?[p,p/(g?4:2),0]:[0]).map(e=>N`<span
                  >${d?q(e):e===0?J(0):Sn(e)}</span
                >`)}
          </div>
          <div class="daily-chart-bars" style="--bar-max-width: ${v}px">
            ${c.map((e,t)=>{let n=r(_[t],`daily usage bar height`),a=x.has(e.date),s=Qt(e.date),f=c.length<=14||t%Math.ceil(c.length/6)===0||t===c.length-1,p=s,m=f?`daily-bar-label`:`daily-bar-label daily-bar-label--hidden`,h=i===`by-type`?X.map(({key:t,className:n,labelKey:r})=>({value:d?e[t]:e[`${t}Cost`]??0,className:n,labelKey:r})):[],g=h.map(({value:e,labelKey:t})=>`${b(t)} ${d?q(e):Sn(e)}`),v=d?q(e.totalTokens):Sn(e.totalCost),S=$t(e.date),C=`${q(e.totalTokens)} ${l(b(`usage.metrics.tokens`))}`.trim(),w=Sn(e.totalCost),T=h.reduce((e,t)=>e+t.value,0)||1;return N`
                <openclaw-tooltip
                  .content=${[S,C,w,...g].join(`
`)}
                >
                  <div
                    class="daily-bar-wrapper ${a?`selected`:``}"
                    role="button"
                    tabindex="0"
                    aria-pressed=${a?`true`:`false`}
                    aria-label=${`${S}: ${C}, ${w}`}
                    @keydown=${t=>Cn(t,e.date,u,o)}
                    @click=${t=>o(e.date,t.shiftKey,u)}
                  >
                    ${i===`by-type`?N`
                            <div
                              class="daily-bar daily-bar--stacked ${n===0?`daily-bar--empty`:``}"
                              style="height: ${n.toFixed(0)}px;"
                            >
                              ${h.map(({className:e,value:t})=>N`
                                  <div
                                    class="cost-segment ${e}"
                                    style="height: ${t/T*100}%"
                                  ></div>
                                `)}
                            </div>
                          `:N`
                            <div
                              class="daily-bar ${n===0?`daily-bar--empty`:``}"
                              style="height: ${n.toFixed(0)}px"
                            ></div>
                          `}
                    ${y?N`<div class="daily-bar-total">${v}</div>`:N`<div
                            class="daily-bar-total daily-bar-total--placeholder"
                            aria-hidden="true"
                          ></div>`}
                    <div class="${m}">${p}</div>
                  </div>
                </openclaw-tooltip>
              `})}
          </div>
        </div>
      </div>
    </div>
  `}function En(e,t){let n=t===`tokens`,r=n?e.totalTokens||1:e.totalCost||0,i=X.map(({key:t,className:i,labelKey:a})=>{let o=n?e[t]:e[`${t}Cost`]||0;return{className:i,labelKey:a,percentage:xn(o,r),formatted:n?q(o):Sn(o)}});return N`
    <div class="cost-breakdown cost-breakdown-compact">
      <div class="cost-breakdown-header">
        ${b(n?`usage.breakdown.tokensByType`:`usage.breakdown.costByType`)}
      </div>
      <div class="cost-breakdown-bar">
        ${i.map(({className:e,labelKey:t,percentage:n,formatted:r})=>N`
            <div
              class="cost-segment ${e}"
              style="width: ${n.toFixed(1)}%"
              title="${b(t)}: ${r}"
            ></div>
          `)}
      </div>
      <div class="cost-breakdown-legend">
        ${i.map(({className:e,labelKey:t,formatted:n})=>N`
            <span class="legend-item"
              ><span class="legend-dot ${e}"></span>${b(t)} ${n}</span
            >
          `)}
      </div>
      <div class="cost-breakdown-total">
        ${b(`usage.breakdown.total`)}:
        ${n?q(e.totalTokens):Sn(e.totalCost)}
      </div>
    </div>
  `}var X;function Dn(){return(Dn=e((()=>{u(),L(),G(),h(),U(),sn(),X=[bn(`output`,`usage.details.assistantOutputTokens`,`Out`),bn(`input`,`usage.details.userToolInputTokens`,`In`),bn(`cacheWrite`,`usage.details.tokensWrittenToCache`,`CW`),bn(`cacheRead`,`usage.details.tokensReadFromCache`,`CR`)]})))()}function On({actor:e}){if(!e)return b(`usage.creators.unattributed`);let t=e.label?.trim()||e.identity?.id||e.id||b(e.type===`system`?`usage.creators.system`:`usage.common.unknown`);return e.identity?.type===`profile`?se({id:e.identity.id,name:t}):t}function kn(e){let t=e.options.toSorted((e,t)=>On(e).localeCompare(On(t))).map(e=>({key:e.key,label:On(e)}));return e.selectedKey!==null&&!t.some(t=>t.key===e.selectedKey)&&t.push({key:e.selectedKey,label:b(`usage.creators.selected`)}),N`
    <select
      class="usage-select usage-creator-filter"
      aria-label=${b(`usage.creators.select`)}
      @change=${t=>{let n=t.currentTarget.value;e.onSelect(n||null)}}
    >
      <option value="" .selected=${e.selectedKey===null}>${b(`usage.creators.all`)}</option>
      ${t.map(t=>N`
          <option value=${t.key} .selected=${t.key===e.selectedKey}>
            ${t.label}
          </option>
        `)}
    </select>
  `}function An(e){let t=t=>e.mode===`tokens`?t.totals.totalTokens:t.totals.totalCost,n=e.groups.toSorted((e,n)=>t(n)-t(e)||On(e).localeCompare(On(n))),r=n.reduce((e,n)=>e+t(n),0),i=n=>N`
    <table class="usage-creators-table">
      <thead>
        <tr>
          <th scope="col">${b(`usage.creators.identity`)}</th>
          <th scope="col">${b(`usage.metrics.tokens`)}</th>
          <th scope="col">${b(`usage.metrics.cost`)}</th>
          <th scope="col">${b(`usage.metrics.sessions`)}</th>
        </tr>
      </thead>
      <tbody>
        ${n.map(n=>N`
            <tr class=${n.key===e.selectedKey?`selected`:``}>
              <th scope="row">
                <button
                  type="button"
                  class="usage-creator-select"
                  aria-pressed=${n.key===e.selectedKey}
                  @click=${()=>e.onSelect(n.key)}
                >
                  <span class="usage-creator-name">
                    <span aria-hidden="true">${_e(n.actor,`row`)}</span>
                    <span>${On(n)}</span>
                  </span>
                  <span class="usage-creator-track" aria-hidden="true">
                    <span style=${`width: ${r>0?t(n)/r*100:0}%`}></span>
                  </span>
                </button>
              </th>
              <td class=${e.mode===`tokens`?`usage-creator-primary`:``}>
                ${q(n.totals.totalTokens)}
              </td>
              <td class=${e.mode===`cost`?`usage-creator-primary`:``}>
                ${J(n.totals.totalCost)}
              </td>
              <td>${n.sessionCount}</td>
            </tr>
          `)}
      </tbody>
    </table>
  `;return ge({title:b(`usage.creators.title`),description:b(`usage.creators.description`)},N`
      <div class="usage-panel usage-creators">
        ${n.length>0?i(n.slice(0,8)):N`<div class="usage-empty-block usage-empty-block--compact">
                ${b(`usage.creators.empty`)}
              </div>`}
        ${n.length>8?N`
                <details class="usage-creators-more">
                  <summary>
                    ${b(`usage.creators.more`,{count:String(n.length-8)})}
                  </summary>
                  ${i(n.slice(8))}
                </details>
              `:I}
      </div>
    `)}function jn(){return(jn=e((()=>{L(),pe(),G(),h(),oe(),sn()})))()}function Mn(e){let{sessionKey:t,displayLabel:n,meta:r,agentId:i,valueLabel:a,isSelected:o,onSelect:s}=e;return N`
    <div
      class="session-bar-row ${o?`selected`:``}"
      @click=${e=>{e.target instanceof Element&&e.target.closest(`button`)||s(e)}}
      title="${t}"
    >
      <button
        type="button"
        class="session-bar-selection"
        aria-label=${n}
        aria-pressed=${o?`true`:`false`}
        @click=${s}
      >
        <span class="session-bar-label">
          <span class="session-bar-title">${n}</span>
          ${i?Ae(i):I}
          ${r.length>0?N`<span class="session-bar-meta">${r.join(` · `)}</span>`:I}
        </span>
      </button>
      <div class="session-bar-actions">
        ${te(n,N`<button
            type="button"
            class="btn btn--sm btn--ghost"
            @click=${e=>{e.stopPropagation(),ye(e,n,b(`usage.sessions.copy`))}}
          >
            <span data-copy-label>${b(`usage.sessions.copy`)}</span>
          </button>`)}
        <div class="session-bar-value">${a}</div>
      </div>
    </div>
  `}function Nn(){return(Nn=e((()=>{L(),R(),je(),De(),h()})))()}function Z(e){let t=Math.abs(e);return J(e,t===0||t>=.01?2:t>=1e-4?4:6)}function Pn(e,t,n,r,i,a,s,c){if(!(e.length>0||t.length>0||n.length>0))return I;let l=n.at(0)??``,u=n.length===1?r.find(e=>e.key===l):null,d=u?o(u.label||u.key,20)+((u.label||u.key).length>20?`…`:``):n.length===1?o(l,8)+`…`:b(`usage.filters.sessionsCount`,{count:String(n.length)}),f=u?u.label||u.key:n.length===1?l:n.join(`, `),p=e.length===1?e[0]:b(`usage.filters.daysCount`,{count:String(e.length)}),m=t.length===1?`${t[0]}:00`:b(`usage.filters.hoursCount`,{count:String(t.length)}),h=[{active:e.length>0,labelKey:`usage.filters.days`,value:p,removeKey:`usage.filters.removeDays`,onClear:i},{active:t.length>0,labelKey:`usage.filters.hours`,value:m,removeKey:`usage.filters.removeHours`,onClear:a},{active:n.length>0,labelKey:`usage.filters.session`,value:d,removeKey:`usage.filters.removeSession`,onClear:s,title:f}];return N`
    <div class="active-filters">
      ${h.filter(({active:e})=>e).map(({labelKey:e,value:t,removeKey:n,onClear:r,title:i})=>N`
            <div class="filter-chip" title=${F(i)}>
              <span class="filter-chip-label">${b(e)}: ${t}</span>
              <openclaw-tooltip .content=${b(`usage.filters.remove`)}>
                <button class="filter-chip-remove" @click=${r} aria-label=${b(n)}>
                  ×
                </button>
              </openclaw-tooltip>
            </div>
          `)}
      ${(e.length>0||t.length>0)&&n.length>0?N`
              <button class="btn btn--sm" @click=${c}>
                ${b(`usage.filters.clearAll`)}
              </button>
            `:I}
    </div>
  `}function Fn(e,t,n,r){let i=en(e,t,n);if(!i||e.length===0)return I;let a=tn(e,t,n),o=Jt(new Date,r),s=(e,t)=>e===1?t===o?b(`usage.presets.today`):Qt(t):b(`usage.costWindows.lastDays`,{count:String(e)}),c=[{label:b(`usage.costWindows.selectedRange`),summary:i,range:!0},...a.map(e=>({label:s(e.days,e.endDate),summary:e,range:!1}))];return N`
    <section class="cost-window-analysis">
      <div class="cost-window-header">
        <div>
          <div class="card-title usage-section-title">${b(`usage.costWindows.title`)}</div>
          <div class="card-sub">
            ${b(`usage.costWindows.subtitle`,{date:$t(n)})}
          </div>
        </div>
        <div class="cost-window-range-label">
          ${Qt(t)} – ${Qt(n)}
        </div>
      </div>
      <div class="cost-window-grid">
        ${c.map(({label:e,summary:t,range:n})=>{let r=t.totals.totalCost/t.days;return N`
            <div class="cost-window-card ${n?`cost-window-card--range`:``}">
              <div class="cost-window-card__label">${e}</div>
              <div class="cost-window-card__value">
                ${Z(t.totals.totalCost)}
              </div>
              <div class="cost-window-card__meta">
                ${q(t.totals.totalTokens)} ${b(`usage.metrics.tokens`)} ·
                ${Z(r)} ${b(`usage.costWindows.perDay`)}
              </div>
            </div>
          `})}
      </div>
    </section>
  `}function In(e,t,n,r){let i=[`usage-insight-card`,r?.className].filter(Boolean).join(` `),a=[r?.error?`usage-error-list`:`usage-list`,r?.listClassName].filter(Boolean).join(` `);return N`
    <div class=${i}>
      <div class="usage-insight-title">${e}</div>
      ${t.length===0?N`<div class="muted">${n}</div>`:N`
              <div class=${a}>
                ${t.map(e=>r?.error?N`
                        <div class="usage-error-row">
                          <div class="usage-error-date">${e.label}</div>
                          <div class="usage-error-rate">${e.value}</div>
                          ${e.sub?N`<div class="usage-error-sub">${e.sub}</div>`:I}
                        </div>
                      `:N`
                        <div class="usage-list-item">
                          <span
                            >${e.agentId?Ae(e.agentId):e.label}</span
                          >
                          <span class="usage-list-value">
                            <span>${e.value}</span>
                            ${e.sub?N`<span class="usage-list-sub">${e.sub}</span>`:I}
                          </span>
                        </div>
                      `)}
              </div>
            `}
    </div>
  `}function Ln(e){let t=e.currentTarget;t instanceof HTMLElement&&t.focus()}function Q(e){let t=`usage-summary-hint-${e.hintId}`,n=[`stat`,`usage-summary-card`,e.className,e.tone?`usage-summary-card--${e.tone}`:``].filter(Boolean).join(` `),r=[`stat-value`,`usage-summary-value`,e.tone??``,e.compactValue?`usage-summary-value--compact`:``].filter(Boolean).join(` `);return N`
    <div class=${n}>
      <div class="usage-summary-title">
        ${e.title}
        <openclaw-tooltip open-on-click>
          <button
            id=${t}
            type="button"
            class="usage-summary-hint"
            aria-label=${e.title}
            @click=${Ln}
          >
            ?
          </button>
          <!-- Shared tooltips dismiss pointer activation so action buttons never
               strand one open. This hint exists only to be read, so it opts in to
               click-to-open; the click handler still normalizes browsers that do
               not focus buttons on pointer activation. -->
          <span slot="content">${e.hint}</span>
        </openclaw-tooltip>
      </div>
      <div class=${r}>${e.value}</div>
      <div class="usage-summary-sub">${e.sub}</div>
    </div>
  `}function Rn(e,t,n,r,i,a,o,s){if(!e)return I;let c=t.messages.total?Math.round(e.totalTokens/t.messages.total):0,u=t.messages.total?e.totalCost/t.messages.total:0,d=e.input+e.cacheRead+e.cacheWrite,f=d>0?e.cacheRead/d:0,p=d>0?`${(f*100).toFixed(1)}%`:b(`usage.common.emptyValue`),m=n.errorRate*100,h=n.throughputTokensPerMin===void 0?b(`usage.common.emptyValue`):`${q(Math.round(n.throughputTokensPerMin))} ${b(`usage.overview.tokensPerMinute`)}`,g=n.throughputCostPerMin===void 0?b(`usage.common.emptyValue`):`${Z(n.throughputCostPerMin)} ${b(`usage.overview.perMinute`)}`,_=n.durationCount>0?de(n.avgDurationMs)??b(`usage.common.emptyValue`):b(`usage.common.emptyValue`),v=t.daily.filter(e=>e.messages>0&&e.errors>0).map(e=>{let t=e.errors/e.messages;return{label:Qt(e.date),value:`${(t*100).toFixed(2)}%`,sub:`${e.errors} ${l(b(`usage.overview.errors`))} · ${e.messages} ${b(`usage.overview.messagesAbbrev`)} · ${q(e.tokens)}`,rate:t}}).toSorted((e,t)=>t.rate-e.rate).slice(0,5).map(({rate:e,...t})=>t),y=t=>i&&e.totalCost>0?b(`usage.overview.costShare`,{percent:(t/e.totalCost*100).toFixed(1)}):null,x=(e,t,n)=>[y(e),q(t),n===void 0?null:`${n} ${b(`usage.overview.messagesAbbrev`)}`].filter(e=>e!==null).join(` · `),S=t.byModel.slice(0,5).map(e=>({label:e.model??b(`usage.common.unknown`),value:Z(e.totals.totalCost),sub:x(e.totals.totalCost,e.totals.totalTokens,e.count)})),C=t.byProvider.slice(0,5).map(e=>({label:e.provider??b(`usage.common.unknown`),value:Z(e.totals.totalCost),sub:x(e.totals.totalCost,e.totals.totalTokens,e.count)})),w=t.tools.tools.slice(0,6).map(e=>({label:e.name,value:`${e.count}`,sub:b(`usage.overview.calls`)})),T=t.byAgent.slice(0,5).map(e=>({label:e.agentId,agentId:e.agentId,value:Z(e.totals.totalCost),sub:x(e.totals.totalCost,e.totals.totalTokens)})),E=t.byChannel.slice(0,5).map(e=>({label:e.channel,value:Z(e.totals.totalCost),sub:x(e.totals.totalCost,e.totals.totalTokens)})),D=[[`usage.overview.topModels`,S,`usage.overview.noModelData`],[`usage.overview.topProviders`,C,`usage.overview.noProviderData`],[`usage.overview.topTools`,w,`usage.overview.noToolCalls`],[`usage.overview.topAgents`,T,`usage.overview.noAgentData`],[`usage.overview.topChannels`,E,`usage.overview.noChannelData`]];return ge({title:b(`usage.overview.title`)},N`
      <section class="usage-panel usage-overview-card">
        <div class="usage-overview-layout">
          <div class="usage-summary-grid">
            ${Q({hintId:`messages`,title:b(`usage.overview.messages`),hint:b(`usage.overview.messagesHint`),value:t.messages.total,sub:`${t.messages.user} ${l(b(`usage.overview.user`))} · ${t.messages.assistant} ${l(b(`usage.overview.assistant`))}`,className:`usage-summary-card--hero`})}
            ${Q({hintId:`throughput`,title:b(`usage.overview.throughput`),hint:b(`usage.overview.throughputHint`),value:h,sub:g,className:`usage-summary-card--hero usage-summary-card--throughput`,compactValue:!0})}
            ${Q({hintId:`tool-calls`,title:b(`usage.overview.toolCalls`),hint:b(`usage.overview.toolCallsHint`),value:t.tools.totalCalls,sub:`${t.tools.uniqueTools} ${b(`usage.overview.toolsUsed`)}`,className:`usage-summary-card--half`})}
            ${Q({hintId:`average-tokens`,title:b(`usage.overview.avgTokens`),hint:b(`usage.overview.avgTokensHint`),value:q(c),sub:b(`usage.overview.acrossMessages`,{count:String(t.messages.total||0)}),className:`usage-summary-card--half`})}
            ${Q({hintId:`cache-hit-rate`,title:b(`usage.overview.cacheHitRate`),hint:b(`usage.overview.cacheHint`),value:p,sub:`${q(e.cacheRead)} ${b(`usage.overview.cached`)} · ${q(d)} ${b(`usage.overview.prompt`)}`,tone:f>.6?`good`:f>.3?`warn`:`bad`,className:`usage-summary-card--medium`})}
            ${Q({hintId:`error-rate`,title:b(`usage.overview.errorRate`),hint:b(`usage.overview.errorHint`),value:`${m.toFixed(2)}%`,sub:`${t.messages.errors} ${l(b(`usage.overview.errors`))} · ${_} ${b(`usage.overview.avgSession`)}`,tone:m>5?`bad`:m>1?`warn`:`good`,className:`usage-summary-card--medium`})}
            ${Q({hintId:`average-cost`,title:b(`usage.overview.avgCost`),hint:b(r?`usage.overview.avgCostHintMissing`:`usage.overview.avgCostHint`),value:Z(u),sub:`${Z(e.totalCost)} ${l(b(`usage.breakdown.total`))}`,className:`usage-summary-card--compact`})}
            ${Q({hintId:`sessions`,title:b(`usage.overview.sessions`),hint:b(`usage.overview.sessionsHint`),value:o,sub:b(`usage.overview.sessionsInRange`,{count:String(s)}),className:`usage-summary-card--compact`})}
            ${Q({hintId:`errors`,title:b(`usage.overview.errors`),hint:b(`usage.overview.errorsHint`),value:t.messages.errors,sub:`${t.messages.toolResults} ${b(`usage.overview.toolResults`)}`,className:`usage-summary-card--compact`})}
          </div>
          <div class="usage-insights-grid">
            ${D.map(([e,t,n])=>In(b(e),t,b(n)))}
            ${In(b(`usage.overview.peakErrorDays`),v,b(`usage.overview.noErrorData`),{error:!0})}
            ${In(b(`usage.overview.peakErrorHours`),a,b(`usage.overview.noErrorData`),{error:!0,className:`usage-insight-card--wide`,listClassName:`usage-error-list--hours`})}
          </div>
        </div>
      </section>
    `)}function zn(e,t,n,r,i,a,o,s,c,u,d,f,p,m,h){let g=e=>p.includes(e),_=g(`agent`)||new Set(e.map(e=>e.agentId)).size>1,v=e=>{let t=e.label||e.key;return t.startsWith(`agent:`)&&t.includes(`?token=`)?t.slice(0,t.indexOf(`?token=`)):t},y=e=>[g(`channel`)&&e.channel&&`channel:${e.channel}`,g(`provider`)&&(e.modelProvider||e.providerOverride)&&`provider:${e.modelProvider??e.providerOverride}`,g(`model`)&&e.model&&`model:${e.model}`,g(`messages`)&&e.usage?.messageCounts&&`msgs:${e.usage.messageCounts.total}`,g(`tools`)&&e.usage?.toolUsage&&`tools:${e.usage.toolUsage.totalCalls}`,g(`errors`)&&e.usage?.messageCounts&&`errors:${e.usage.messageCounts.errors}`,g(`duration`)&&e.usage?.durationMs&&`dur:${de(e.usage.durationMs)??`—`}`].filter(e=>typeof e==`string`&&e.length>0),x=new Set(n),S=e.map(e=>{let t=e.usage,n=t?.totalTokens??0,a=t?.totalCost??0,o=x.size>0?t?.dailyBreakdown:void 0;if(o?.length){n=0,a=0;for(let e of o)x.has(e.date)&&(n+=e.tokens,a+=e.cost)}let s;switch(i){case`recent`:s=e.updatedAt??0;break;case`messages`:s=t?.messageCounts?.total??0;break;case`errors`:s=t?.messageCounts?.errors??0;break;case`cost`:s=a;break;case`tokens`:s=n}return{session:e,displayLabel:v(e),value:r?n:a,sortValue:s}}).toSorted((e,t)=>{let n=t.sortValue-e.sortValue;if(n!==0)return n;let r=(t.session.updatedAt??0)-(e.session.updatedAt??0);return r===0?e.displayLabel.localeCompare(t.displayLabel):r}),C=a===`asc`?S.toReversed():S,w=C.reduce((e,t)=>e+t.value,0),T=C.length?w/C.length:0,E=C.reduce((e,t)=>e+(t.session.usage?.messageCounts?.errors??0),0),D=new Set(t),O=C.filter(e=>D.has(e.session.key)),k=O.length,A=new Map(C.map(e=>[e.session.key,e])),j=o.map(e=>A.get(e)).filter(e=>e!==void 0),M=s===`recent`?j:C.slice(0,50),P=e=>{let t=e.map(e=>e.session.key);return e.map(e=>Mn({sessionKey:e.session.key,displayLabel:e.displayLabel,meta:y(e.session),agentId:_?e.session.agentId:void 0,valueLabel:r?q(e.value):Z(e.value),isSelected:D.has(e.session.key),onSelect:n=>c(e.session.key,n.shiftKey,t)}))};return ge({title:b(`usage.sessions.title`)},N`
      <div class="usage-panel sessions-card">
        <div class="sessions-card-header">
          <div class="sessions-card-count">
            ${b(`usage.sessions.shown`,{count:String(M.length)})}
            ${m===M.length?``:` · ${b(`usage.sessions.total`,{count:String(m)})}`}
          </div>
        </div>
        <div class="sessions-card-meta">
          <div class="sessions-card-stats">
            <span>
              ${r?q(T):Z(T)}
              ${b(`usage.sessions.avg`)}
            </span>
            <span
              >${E} ${l(b(`usage.overview.errors`))}</span
            >
          </div>
          ${he({mode:`buttons`,variant:`accent`,ariaPressed:!1,className:`small`,value:s,onChange:f,onReselect:f,options:[{value:`all`,label:b(`usage.sessions.all`)},{value:`recent`,label:b(`usage.sessions.recent`)}]})}
          <label class="sessions-sort">
            <span>${b(`usage.sessions.sort`)}</span>
            <select
              class="settings-select"
              @change=${e=>u(e.target.value)}
            >
              ${Object.entries({cost:`usage.metrics.cost`,errors:`usage.overview.errors`,messages:`usage.overview.messages`,recent:`usage.sessions.recentShort`,tokens:`usage.metrics.tokens`}).map(([e,t])=>N`<option value=${e} ?selected=${i===e}>
                    ${b(t)}
                  </option>`)}
            </select>
          </label>
          <openclaw-tooltip
            .content=${b(a===`desc`?`usage.sessions.descending`:`usage.sessions.ascending`)}
          >
            <button
              class="btn btn--sm"
              aria-label=${b(a===`desc`?`usage.sessions.descending`:`usage.sessions.ascending`)}
              @click=${()=>d(a===`desc`?`asc`:`desc`)}
            >
              ${a===`desc`?`↓`:`↑`}
            </button>
          </openclaw-tooltip>
          ${k>0?N`
                  <button class="btn btn--sm" @click=${h}>
                    ${b(`usage.sessions.clearSelection`)}
                  </button>
                `:I}
        </div>
        ${s===`recent`?M.length===0?N` <div class="usage-empty-block">${b(`usage.sessions.noRecent`)}</div> `:N`
                  <div class="session-bars session-bars--recent">
                    ${P(M)}
                  </div>
                `:M.length===0?N` <div class="usage-empty-block">${b(`usage.sessions.noneInRange`)}</div> `:N`
                  <div class="session-bars">
                    ${P(M)}
                    ${e.length>M.length?N`
                            <div class="usage-more-sessions">
                              ${b(`usage.sessions.more`,{count:String(e.length-M.length)})}
                            </div>
                          `:I}
                  </div>
                `}
        ${k>1?N`
                <div class="sessions-selected-group">
                  <div class="sessions-card-count">
                    ${b(`usage.sessions.selected`,{count:String(k)})}
                  </div>
                  <div class="session-bars session-bars--selected">
                    ${P(O)}
                  </div>
                </div>
              `:I}
      </div>
    `)}function Bn(){return(Bn=e((()=>{L(),P(),je(),G(),h(),U(),ce(),sn(),Nn()})))()}function Vn(e,t){return t>0?e/t*100:0}function Hn(e){return e<0xe8d4a51000?e*1e3:e}function Un(e,t,n){let r=Number(e.slice(0,4)),i=Number(e.slice(5,7))-1,a=Number(e.slice(8,10))+n;return t===`utc`?Date.UTC(r,i,a):new Date(r,i,a).getTime()}function Wn(e,t,n){if(!(e.timestamp>0))return!0;let r=Hn(e.timestamp);return r>=Math.min(t,n)&&r<=Math.max(t,n)}function Gn(e,t,n){let r=t||e.usage;if(!r)return N` <div class="usage-empty-block">${b(`usage.details.noUsageData`)}</div> `;let i=e=>e?S(e):b(`usage.common.emptyValue`),a=n!==void 0,o=n?.filter(e=>e.timestamp>0),s=a?o?.length?o.reduce((e,{role:t})=>((t===`user`||t===`assistant`)&&(e[t]+=1,e.total+=1),e),{total:0,user:0,assistant:0}):void 0:r.messageCounts,c=[e.channel&&`channel:${e.channel}`,e.agentId&&`agent:${e.agentId}`,(e.modelProvider||e.providerOverride)&&`provider:${e.modelProvider??e.providerOverride}`,e.model&&`model:${e.model}`].filter(Boolean),u=r.toolUsage?.tools.slice(0,6)??[],d;if(o?.length){d=new Map;for(let e of o.filter(({role:e})=>e===`assistant`))for(let[t,n]of Je(e.content).tools)d.set(t,(d.get(t)??0)+n)}let f=u.map(e=>({label:e.name,value:`${d?d.get(e.name)??0:a?b(`usage.common.emptyValue`):e.count}`,sub:b(`usage.overview.calls`)})),p=d?[...d.values()].reduce((e,t)=>e+t,0):a?b(`usage.common.emptyValue`):r.toolUsage?.totalCalls??0,m=d?d.size:a?b(`usage.common.emptyValue`):r.toolUsage?.uniqueTools??0,h=r.modelUsage?.slice(0,6).map(e=>({label:e.model??b(`usage.common.unknown`),value:J(e.totals.totalCost),sub:q(e.totals.totalTokens)}))??[],g=[{labelKey:`usage.overview.messages`,value:s?.total??(a?b(`usage.common.emptyValue`):0),meta:N`${a&&!s?b(`usage.common.emptyValue`):N`${s?.user??0}
            ${l(b(`usage.overview.user`))} ·
            ${s?.assistant??0}
            ${l(b(`usage.overview.assistant`))}`}${a?N`<br />${b(`usage.details.loadedIntervalMessages`)}`:I}`},{labelKey:`usage.overview.toolCalls`,value:p,meta:N`${m} ${b(`usage.overview.toolsUsed`)}`},{labelKey:`usage.overview.errors`,value:a?b(`usage.common.emptyValue`):r.messageCounts?.errors??0,meta:N`${a?b(`usage.common.emptyValue`):r.messageCounts?.toolResults??0}
      ${b(`usage.overview.toolResults`)}`},{labelKey:`usage.details.duration`,value:de(r.durationMs)??b(`usage.common.emptyValue`),meta:N`${i(r.firstActivity)} → ${i(r.lastActivity)}`}];return N`
    ${c.length>0?N`<div class="usage-badges">
            ${c.map(e=>N`<span class="settings-row__value">${e}</span>`)}
          </div>`:I}
    <div class="session-summary-grid">
      ${g.map(({labelKey:e,value:t,meta:n})=>N`
          <div class="stat session-summary-card">
            <div class="session-summary-title">${b(e)}</div>
            <div class="stat-value session-summary-value">${t}</div>
            <div class="session-summary-meta">${n}</div>
          </div>
        `)}
    </div>
    <div class="usage-insights-grid usage-insights-grid--tight">
      ${In(b(`usage.overview.topTools`),f,b(`usage.overview.noToolCalls`))}
      ${In(b(`usage.details.modelMix`),h,b(`usage.overview.noModelData`))}
    </div>
  `}function Kn(e,t,n,i){let a=Math.min(n,i),o=Math.max(n,i),s=t.filter(e=>e.timestamp>=a&&e.timestamp<=o);if(s.length===0)return;let c=0,l=0,u={output:0,input:0,cacheWrite:0,cacheRead:0};for(let e of s){c+=e.totalTokens||0,l+=e.cost||0;for(let{key:t}of X)u[t]+=e[t]||0}let d=r(s[0],`filtered usage first point`),f=r(s.at(-1),`filtered usage last point`);return{...e,...u,totalTokens:c,totalCost:l,durationMs:f.timestamp-d.timestamp,firstActivity:d.timestamp,lastActivity:f.timestamp,messageCounts:void 0}}function qn(e,t,n,r,i,a,s,c,u,d,f,p,m,h,g,_,v,y,x,S,C,w,T,E,D,O,k,A,j,M){let P=e.label||e.key,F=P.length>50?o(P,50)+`…`:P,L=e.usage,R=u!==null&&d!==null,z=u!==null&&d!==null&&t?.points&&L?Kn(L,t.points,u,d):void 0,B=z?{totalTokens:z.totalTokens,totalCost:z.totalCost}:{totalTokens:L?.totalTokens??0,totalCost:L?.totalCost??0},V=z?b(`usage.details.filtered`):``;return N`
    <div class="settings-group usage-panel session-detail-panel">
      <div class="session-detail-header">
        <div class="session-detail-header-left">
          <div class="session-detail-title">
            ${F}
            ${V?N`<span class="session-detail-indicator">${V}</span>`:I}
          </div>
        </div>
        <div class="session-detail-stats">
          ${L?N`
                  <span
                    ><strong>${q(B.totalTokens)}</strong>
                    ${l(b(`usage.metrics.tokens`))}${V}</span
                  >
                  <span
                    ><strong>${J(B.totalCost)}</strong
                    >${V}</span
                  >
                `:I}
        </div>
        <openclaw-tooltip .content=${b(`usage.details.close`)}>
          <button
            class="btn btn--sm btn--ghost"
            @click=${M}
            aria-label=${b(`usage.details.close`)}
          >
            ×
          </button>
        </openclaw-tooltip>
      </div>
      ${e.scope===`family`&&e.includedSessionIds?.length?N`
              <div class="usage-lineage-note">
                ${b(`usage.scope.familyIncluded`,{count:String(e.includedSessionIds.length)})}
              </div>
            `:I}
      <div class="session-detail-content">
        ${Gn(e,z,R?y.hasLoaded&&_?_.filter(e=>Wn(e,u,d)):null:void 0)}
        <div class="session-detail-row">
          ${Jn(t,n,r,i,a,s,c,p,m,h,g,u,d,f)}
        </div>
        <div class="session-detail-bottom">
          ${Xn(_,v,y,x,S,C,w,T,E,D,O,R?u:null,R?d:null)}
          ${Yn(k,L,A,j)}
        </div>
      </div>
    </div>
  `}function Jn(e,t,n,i,a,o,s,c,u,d,f=`local`,p,m,h){if((t||n.awaitingGateway)&&!n.hasLoaded)return N`
      <div class="session-timeseries-compact">
        <div class="usage-empty-block">${b(`usage.loading.badge`)}</div>
      </div>
    `;let g=vt(n,`usage.details.usageOverTime`,`timeline`);if(n.error&&!n.hasLoaded)return N`
      <div class="session-timeseries-compact">
        <div class="card-title usage-section-title">${b(`usage.details.usageOverTime`)}</div>
        ${g}
      </div>
    `;if(!e||e.points.length<2)return N`
      <div class="session-timeseries-compact">
        ${g}
        <div class="usage-empty-block">${b(`usage.details.noTimeline`)}</div>
      </div>
    `;let _=e.points;if(c||u||d&&d.length>0){let t=c?Un(c,f,0):0,n=u?Un(u,f,1):1/0,r=d?.length?new Set(d):void 0;_=e.points.filter(e=>e.timestamp<t||e.timestamp>=n?!1:!r||r.has(Jt(new Date(e.timestamp),f)))}if(_.length<2)return N`
      <div class="session-timeseries-compact">
        ${g}
        <div class="usage-empty-block">${b(`usage.details.noDataInRange`)}</div>
      </div>
    `;let v=0,y=0;_=_.map(e=>(v+=e.totalTokens,y+=e.cost,{...e,cumulativeTokens:v,cumulativeCost:y}));let x=p!=null&&m!=null,S=x?Math.min(p,m):0,C=x?Math.max(p,m):1/0,T=0,E=_.length;if(x){T=_.findIndex(e=>e.timestamp>=S),T===-1&&(T=_.length);let e=_.findIndex(e=>e.timestamp>C);E=e===-1?_.length:e}let O=x?_.slice(T,E):_,k={output:0,input:0,cacheRead:0,cacheWrite:0};for(let e of O)for(let{key:t}of X)k[t]+=e[t];let A={top:8,right:4,bottom:14,left:30},j=400-A.left-A.right,M=100-A.top-A.bottom,P=i===`cumulative`,F=i===`per-turn`&&o===`by-type`,L=f===`utc`?{timeZone:`UTC`}:{},R=D({month:`short`,day:`numeric`,hour:`2-digit`,minute:`2-digit`,...L},``),z=Object.values(k).reduce((e,t)=>e+t,0),B=_.map(e=>P?e.cumulativeTokens:F?e.input+e.output+e.cacheRead+e.cacheWrite:e.totalTokens),ee=Math.max(...B,1),te=j/_.length,H=Math.min(Qn,Math.max(1,te*Zn)),U=te-H,W=A.left+T*(H+U),ne=E>=_.length?A.left+(_.length-1)*(H+U)+H:A.left+(E-1)*(H+U)+H;return N`
    <div class="session-timeseries-compact">
      <div class="timeseries-header-row">
        <div class="card-title usage-section-title">${b(`usage.details.usageOverTime`)}</div>
        <div class="timeseries-controls">
          ${x?N`
                  <div class="settings-segmented settings-segmented--accent small">
                    <button
                      class="btn btn--sm settings-segmented__btn settings-segmented__btn--active"
                      @click=${()=>h?.(null,null)}
                    >
                      ${b(`usage.details.reset`)}
                    </button>
                  </div>
                `:I}
          ${he({mode:`buttons`,variant:`accent`,ariaPressed:!1,className:`small`,value:i,onChange:a,onReselect:a,options:[{value:`per-turn`,label:b(`usage.details.perTurn`)},{value:`cumulative`,label:b(`usage.details.cumulative`)}]})}
          ${P?I:he({mode:`buttons`,variant:`accent`,ariaPressed:!1,className:`small`,value:o,onChange:s,onReselect:s,options:[{value:`total`,label:b(`usage.daily.total`)},{value:`by-type`,label:b(`usage.daily.byType`)}]})}
        </div>
      </div>
      ${g}
      <div class="timeseries-chart-wrapper">
        <svg viewBox="0 0 ${400} ${118}" class="timeseries-svg">
          ${[{x1:A.left,y1:A.top,x2:A.left,y2:A.top+M},{x1:A.left,y1:A.top+M,x2:400-A.right,y2:A.top+M}].map(({x1:e,y1:t,x2:n,y2:r})=>V`<line x1="${e}" y1="${t}" x2="${n}" y2="${r}" stroke="var(--border)" />`)}
          ${[{y:A.top+5,text:q(ee)},{y:A.top+M,text:`0`}].map(({y:e,text:t})=>V`<text x="${A.left-4}" y="${e}" text-anchor="end" class="ts-axis-label">${t}</text>`)}
          <!-- X axis labels (first and last) -->
          ${V`
            <text x="${A.left}" y="${A.top+M+10}" text-anchor="start" class="ts-axis-label">${w(r(_[0],`time series first point`).timestamp,{hour:`2-digit`,minute:`2-digit`,...L},``)}</text>
            <text x="${400-A.right}" y="${A.top+M+10}" text-anchor="end" class="ts-axis-label">${w(r(_.at(-1),`time series last point`).timestamp,{hour:`2-digit`,minute:`2-digit`,...L},``)}</text>
          `}
          <!-- Bars -->
          ${_.map((e,t)=>{let n=r(B[t],`time series bar total`),i=A.left+t*(H+U),a=n/ee*M,o=A.top+M-a,s=[R(e.timestamp),`${q(n)} ${l(b(`usage.metrics.tokens`))}`];F&&s.push(...X.map(({key:t,short:n})=>`${n} ${q(e[t])}`));let c=s.join(` · `),u=x&&(t<T||t>=E);if(!F)return V`<rect x="${i}" y="${o}" width="${H}" height="${a}" class="ts-bar${u?` dimmed`:``}" rx="1" data-tooltip=${c} aria-label=${c}></rect>`;let d=A.top+M,f=u?` dimmed`:``;return V`
              ${X.map(({key:t,className:r})=>{let o=e[t];if(o<=0||n<=0)return I;let s=o/n*a;return d-=s,V`<rect x="${i}" y="${d}" width="${H}" height="${s}" class="ts-bar ${r}${f}" rx="1" data-tooltip=${c} aria-label=${c}></rect>`})}
            `})}
          <!-- Selection highlight overlay (always visible between handles) -->
          ${V`
            <rect 
              x="${W}" 
              y="${A.top}" 
              width="${Math.max(1,ne-W)}" 
              height="${M}" 
              fill="var(--accent)" 
              opacity="${$n}" 
              pointer-events="none"
            />
          `}
          ${[W,ne].map(e=>V`
              <line x1="${e}" y1="${A.top}" x2="${e}" y2="${A.top+M}" stroke="var(--accent)" stroke-width="0.8" opacity="0.7" />
              <rect x="${e-er/2}" y="${A.top+M/2-tr/2}" width="${er}" height="${tr}" rx="1.5" fill="var(--accent)" class="cursor-handle" />
              ${[-.7,nr].map(t=>V`<line x1="${e+t}" y1="${A.top+M/2-tr/5}" x2="${e+t}" y2="${A.top+M/2+tr/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />`)}
            `)}
        </svg>
        <!-- Handle drag zones (only on handles, not full chart) -->
        ${(()=>{let e=e=>t=>{if(!h)return;t.preventDefault(),t.stopPropagation();let n=t.currentTarget.closest(`.timeseries-chart-wrapper`)?.querySelector(`svg`);if(!n)return;let i=n.getBoundingClientRect(),a=i.width,o=A.left/400*a,s=(400-A.right)/400*a-o,c=e=>{let t=Math.max(0,Math.min(1,(e-i.left-o)/s));return Math.min(Math.floor(t*_.length),_.length-1)},l=e===`left`?W:ne,u=i.left+l/400*a,d=t.clientX-u;document.body.style.cursor=`col-resize`;let f=t=>{let n=t.clientX-d,i=c(n),a=_[i];if(!a)return;let o=e===`left`,s=o?m??r(_.at(-1),`time series right cursor point`).timestamp:p??r(_[0],`time series left cursor point`).timestamp;h(o?Math.min(a.timestamp,s):s,o?s:Math.max(a.timestamp,s))},g=()=>{document.body.style.cursor=``,document.removeEventListener(`mousemove`,f),document.removeEventListener(`mouseup`,g)};document.addEventListener(`mousemove`,f),document.addEventListener(`mouseup`,g)};return N`
            ${[`left`,`right`].map(t=>N`<div
                class="chart-handle-zone chart-handle-${t}"
                style="left: ${((t===`left`?W:ne)/400*100).toFixed(1)}%;"
                @mousedown=${e(t)}
              ></div>`)}
          `})()}
      </div>
      <div class="timeseries-summary">
        ${x?N`
                <span class="timeseries-summary__range">
                  ${b(`usage.details.turnRange`,{start:String(T+1),end:String(E),total:String(_.length)})}
                </span>
                ·
                ${w(S,{hour:`2-digit`,minute:`2-digit`,...L},``)}–${w(C,{hour:`2-digit`,minute:`2-digit`,...L},``)}
                · ${q(z)} ·
                ${J(O.reduce((e,t)=>e+(t.cost||0),0))}
              `:N`${_.length} ${b(`usage.overview.messagesAbbrev`)} ·
              ${q(v)} · ${J(y)}`}
      </div>
      ${F?N`
              <div class="timeseries-breakdown">
                <div class="card-title usage-section-title">
                  ${b(`usage.breakdown.tokensByType`)}
                </div>
                <div class="cost-breakdown-bar cost-breakdown-bar--compact">
                  ${X.map(({key:e,className:t})=>N`
                      <div
                        class="cost-segment ${t}"
                        style="width: ${Vn(k[e],z).toFixed(1)}%"
                      ></div>
                    `)}
                </div>
                <div class="cost-breakdown-legend">
                  ${X.map(({key:e,className:t,labelKey:n,hintKey:r})=>N`
                      <div class="legend-item" title=${b(r)}>
                        <span class="legend-dot ${t}"></span>${b(n)}
                        ${q(k[e])}
                      </div>
                    `)}
                </div>
                <div class="cost-breakdown-total">
                  ${b(`usage.breakdown.total`)}: ${q(z)}
                </div>
              </div>
            `:I}
    </div>
  `}function Yn({weight:e,loading:t,status:n},r,i,a){let o=vt(n,`usage.details.systemPromptBreakdown`,`context`);if(!e)return N`
      <div class="context-details-panel">
        ${o}
        ${n.error?I:N`<div class="usage-empty-block">
                ${b(t||n.awaitingGateway?`usage.loading.badge`:`usage.details.noContextData`)}
              </div>`}
      </div>
    `;let s=[{className:`skills`,labelKey:`usage.details.skills`,tokens:Pt(e.skills.promptChars),entries:e.skills.entries.map(({name:e,blockChars:t})=>({name:e,chars:t}))},{className:`tools`,labelKey:`usage.details.tools`,tokens:Pt(e.tools.listChars+e.tools.schemaChars),entries:e.tools.entries.map(({name:e,summaryChars:t,schemaChars:n})=>({name:e,chars:t+n}))},{className:`files`,labelKey:`usage.details.files`,tokens:Pt(e.injectedWorkspaceFiles.reduce((e,t)=>t.injectionStatus===`native_unverified`?e:e+t.injectedChars,0)),entries:e.injectedWorkspaceFiles.map(({name:e,injectedChars:t})=>({name:e,chars:t}))}].map(({className:e,labelKey:t,tokens:n,entries:r})=>({className:e,labelKey:t,tokens:n,entries:r.toSorted((e,t)=>e.chars===null?t.chars===null?0:1:t.chars===null?-1:t.chars-e.chars)})),c=[{className:`system`,labelKey:`usage.details.system`,tokens:Pt(e.systemPrompt.chars)},...s],l=c.reduce((e,{tokens:t})=>e+t,0),u=r&&r.totalTokens>0?r.input+r.cacheRead:0,d=u>0?`~${Math.min(l/u*100,100).toFixed(0)}% ${b(`usage.details.ofInput`)}`:b(`usage.details.baseContextPerMessage`),f=s.some(({entries:e})=>e.length>4);return N`
    <div class="context-details-panel">
      ${o}
      <div class="context-breakdown-header">
        <div class="card-title usage-section-title">
          ${b(`usage.details.systemPromptBreakdown`)}
        </div>
        ${f?N`<button class="btn btn--sm" @click=${a}>
                ${b(i?`usage.details.collapse`:`usage.details.expandAll`)}
              </button>`:I}
      </div>
      <p class="context-weight-desc">${d}</p>
      <div class="context-stacked-bar">
        ${c.map(({className:e,labelKey:t,tokens:n})=>N`
            <div
              class="context-segment ${e}"
              style="width: ${Vn(n,l).toFixed(1)}%"
              title="${b(t)}: ~${q(n)}"
            ></div>
          `)}
      </div>
      <div class="context-legend">
        ${c.map(({className:e,labelKey:t,tokens:n})=>N`
            <span class="legend-item"
              ><span class="legend-dot ${e}"></span>${b(e===`system`?`usage.details.systemShort`:t)}
              ~${q(n)}</span
            >
          `)}
      </div>
      <div class="context-total">
        ${b(`usage.breakdown.total`)}: ~${q(l)}
      </div>
      <div class="context-breakdown-grid">
        ${s.filter(({entries:e})=>e.length>0).map(({labelKey:e,entries:t})=>{let n=i?t:t.slice(0,4),r=t.length-n.length;return N`
              <div class="context-breakdown-card">
                <div class="context-breakdown-title">${b(e)} (${t.length})</div>
                <div class="context-breakdown-list">
                  ${n.map(({name:e,chars:t})=>N`
                      <div class="context-breakdown-item">
                        <span class="mono" title=${e}>${e}</span>
                        <span class="muted"
                          >${t===null?b(`usage.common.unknown`):`~${q(Pt(t))}`}</span
                        >
                      </div>
                    `)}
                </div>
                ${r>0?N`
                        <div class="context-breakdown-more">
                          ${b(`usage.sessions.more`,{count:String(r)})}
                        </div>
                      `:I}
              </div>
            `})}
      </div>
    </div>
  `}function Xn(e,t,n,r,i,a,o,s,c,u,d,f,p){if((t||n.awaitingGateway)&&!n.hasLoaded)return N`
      <div class="session-logs-compact">
        <div class="session-logs-header">${b(`usage.details.conversation`)}</div>
        <div class="usage-empty-block">${b(`usage.loading.badge`)}</div>
      </div>
    `;let m=vt(n,`usage.details.conversation`,`conversation`);if(n.error&&!n.hasLoaded)return N`
      <div class="session-logs-compact">
        <div class="session-logs-header">${b(`usage.details.conversation`)}</div>
        ${m}
      </div>
    `;if(!e||e.length===0)return N`
      <div class="session-logs-compact">
        <div class="session-logs-header">${b(`usage.details.conversation`)}</div>
        ${m}
        <div class="usage-empty-block">${b(`usage.details.noMessages`)}</div>
      </div>
    `;let h=D(),g=l(a.query),_=e.map(e=>{let t=Je(e.content);return{log:e,toolInfo:t,cleanContent:t.cleanContent||e.content}}),v=Array.from(new Set(_.flatMap(e=>e.toolInfo.tools.map(([e])=>e)))).toSorted((e,t)=>e.localeCompare(t)),y=f!=null&&p!=null,x=_.filter(e=>(!y||Wn(e.log,f,p))&&(a.roles.length===0||a.roles.includes(e.log.role))&&(!a.hasTools||e.toolInfo.tools.length>0)&&(a.tools.length===0||e.toolInfo.tools.some(([e])=>a.tools.includes(e)))&&(!g||l(e.cleanContent).includes(g))),S=a.roles.length>0||a.tools.length>0||a.hasTools||g||y?`${x.length} ${b(`usage.details.of`)} ${e.length}${y?` (${b(`usage.details.timelineFiltered`)})`:``}`:`${e.length}`,C=new Set(a.roles),w=new Set(a.tools);return N`
    <div class="session-logs-compact">
      <div class="session-logs-header">
        <span>
          ${b(`usage.details.conversation`)}
          <span class="session-logs-header-count">
            (${S} ${l(b(`usage.overview.messages`))})
          </span>
        </span>
        <button class="btn btn--sm" @click=${i}>
          ${b(r?`usage.details.collapseAll`:`usage.details.expandAll`)}
        </button>
      </div>
      ${m}
      <div class="usage-filters-inline session-log-filters">
        <select
          multiple
          size="4"
          aria-label=${b(`usage.details.filterByRole`)}
          @change=${e=>o(Array.from(e.target.selectedOptions).map(e=>e.value))}
        >
          ${[[`user`,`usage.overview.user`],[`assistant`,`usage.overview.assistant`],[`tool`,`usage.details.tool`],[`toolResult`,`usage.details.toolResult`]].map(([e,t])=>N`<option value=${e} ?selected=${C.has(e)}>
                ${b(t)}
              </option>`)}
        </select>
        <select
          multiple
          size="4"
          aria-label=${b(`usage.details.filterByTool`)}
          @change=${e=>s(Array.from(e.target.selectedOptions).map(e=>e.value))}
        >
          ${v.map(e=>N`<option value=${e} ?selected=${w.has(e)}>${e}</option>`)}
        </select>
        <label class="usage-filters-inline session-log-has-tools">
          <input
            type="checkbox"
            .checked=${a.hasTools}
            @change=${e=>c(e.target.checked)}
          />
          ${b(`usage.details.hasTools`)}
        </label>
        <input
          type="text"
          placeholder=${b(`usage.details.searchConversation`)}
          aria-label=${b(`usage.details.searchConversation`)}
          .value=${a.query}
          @input=${e=>u(e.target.value)}
        />
        <button class="btn btn--sm" @click=${d}>${b(`usage.filters.clear`)}</button>
      </div>
      <div class="session-logs-list">
        ${x.map(e=>{let{log:t,toolInfo:n,cleanContent:i}=e,a=t.role===`user`?`user`:`assistant`,o=t.role===`user`?b(`usage.details.you`):t.role===`assistant`?b(`usage.overview.assistant`):b(`usage.details.tool`);return N`
            <div class="session-log-entry ${a}">
              <div class="session-log-meta">
                <span class="session-log-role">${o}</span>
                <span>${h(t.timestamp)}</span>
                ${t.tokens?N`<span>${q(t.tokens)}</span>`:I}
              </div>
              <div class="session-log-content">${i}</div>
              ${n.tools.length>0?N`
                      <details class="session-log-tools" ?open=${r}>
                        <summary>${n.summary}</summary>
                        <div class="session-log-tools-list">
                          ${n.tools.map(([e,t])=>N`
                              <span class="session-log-tools-pill">${e} × ${t}</span>
                            `)}
                        </div>
                      </details>
                    `:I}
            </div>
          `})}
        ${x.length===0?N`
                <div class="usage-empty-block usage-empty-block--compact">
                  ${b(`usage.details.noMessagesMatch`)}
                </div>
              `:I}
      </div>
    </div>
  `}var Zn,Qn,$n,er,tr,nr;function rr(){return(rr=e((()=>{u(),L(),G(),h(),U(),ce(),x(),We(),sn(),yt(),Dn(),Bn(),Zn=.75,Qn=8,$n=.06,er=5,tr=12,nr=.7})))()}function ir(e){return new Date(`${e}T12:00:00Z`).getTime()}function ar(e){return new Date(e).toISOString().slice(0,10)}function or(e){let t=e.toSorted((e,t)=>e-t),n=e=>t[Math.min(t.length-1,Math.floor(t.length*e))]??0;return[n(.25),n(.5),n(.75)]}function sr(e,t){return e<=0?0:e<t[0]?1:e<t[1]?2:e<t[2]?3:4}function cr(e,t,n,r){let i=ir(n),a=Math.max(ir(t),i-363*lr),o=new Map(e.map(e=>[e.date,e.totalTokens])),s=e.filter(e=>{let t=ir(e.date);return e.totalTokens>0&&t>=a&&t<=i}).map(e=>e.totalTokens),c=s.length>0?or(s):[0,0,0],l=a-new Date(a).getUTCDay()*lr,u=new Intl.DateTimeFormat(r,{month:`short`,timeZone:`UTC`}),d=[],f=[],p=-1;for(let e=l;e<=i;e+=7*lr){let t=[];for(let n=0;n<7;n+=1){let r=e+n*lr;if(r<a||r>i){t.push(null);continue}let s=ar(r),l=o.get(s)??0;t.push({date:s,tokens:l,level:sr(l,c)})}d.push({days:t});let r=ir(t.find(e=>e!==null)?.date??n),s=new Date(r).getUTCMonth();f.push(s===p?``:u.format(new Date(r))),p=s}return{weeks:d,monthLabels:f}}var lr;function ur(){return(ur=e((()=>{lr=864e5})))()}function dr(e){let t=hr+e.weeks.length*mr,n=new Intl.NumberFormat(void 0,{maximumFractionDigits:0}),r=new Intl.DateTimeFormat(void 0,{weekday:`short`,timeZone:`UTC`});return N`
    <svg
      class="usage-heatmap__svg"
      viewBox="0 0 ${t} ${116}"
      style="--usage-heatmap-width: ${t}px"
      role="img"
      aria-label=${b(`usage.heatmap.title`)}
    >
      ${e.monthLabels.map((e,t)=>e?V`<text class="usage-heatmap__month" x=${hr+t*mr} y="10">${e}</text>`:I)}
      ${_r.map(({row:e,utcDay:t})=>V`<text class="usage-heatmap__weekday" x=${24} y=${gr+e*mr+pr-2}>${r.format(new Date(t))}</text>`)}
      ${e.weeks.map((e,t)=>e.days.map((e,r)=>{if(!e)return I;let i=`${$t(e.date)} · ${b(`usage.heatmap.cellTokens`,{tokens:n.format(e.tokens)})}`;return V`
            <rect
              class="usage-heatmap__cell usage-heatmap__cell--l${e.level}"
              x=${hr+t*mr}
              y=${gr+r*mr}
              width=${pr}
              height=${pr}
              rx="2.5"
              data-tooltip=${i}
              aria-label=${i}
            ></rect>
          `}))}
    </svg>
  `}function fr(e,t,n){if(e.length===0)return I;let r=cr(e,t,n),i=N`
    <div class="usage-heatmap__legend" aria-hidden="true">
      <span>${b(`usage.heatmap.less`)}</span>
      ${[0,1,2,3,4].map(e=>N`<span class="usage-heatmap__swatch usage-heatmap__cell--l${e}"></span>`)}
      <span>${b(`usage.heatmap.more`)}</span>
    </div>
  `;return ge({title:b(`usage.heatmap.title`),description:b(`usage.heatmap.subtitle`),actions:i},N`<div class="usage-panel usage-heatmap">${dr(r)}</div>`)}var pr,mr,hr,gr,_r;function vr(){return(vr=e((()=>{L(),G(),h(),ur(),sn(),pr=11,mr=14,hr=30,gr=18,_r=[{row:1,utcDay:Date.UTC(2024,0,1)},{row:3,utcDay:Date.UTC(2024,0,3)},{row:5,utcDay:Date.UTC(2024,0,5)}]})))()}function yr(e,t,n,r,i){if(n.length===0)return I;let a=Y(e),o=Xe(r).filter(e=>Y(e.key??``)===a).map(e=>e.value).filter(Boolean),s=new Set(o.map(e=>Y(e))),c=n.length>0&&n.every(e=>s.has(Y(e))),l=o.length;return N`
    <wa-dropdown
      class="usage-filter-select"
      placement="bottom-start"
      @wa-select=${t=>{t.preventDefault();let a=t.detail.item.value;if(a===`command:select-all`){i(vn(r,e,n));return}if(a===`command:clear`){i(vn(r,e,[]));return}if(a?.startsWith(`option:`)){let n=decodeURIComponent(a.slice(7));i(vn(r,e,t.detail.item.checked?[...o,n]:o.filter(e=>Y(e)!==Y(n))))}}}
    >
      <button slot="trigger" type="button" class="usage-filter-trigger">
        <span>${t}</span>
        ${l>0?N`<span class="settings-count">${l}</span>`:N` <span class="settings-count">${b(`usage.filters.all`)}</span> `}
      </button>
      <wa-dropdown-item value="command:select-all" ?disabled=${c}>
        ${b(`usage.filters.selectAll`)}
      </wa-dropdown-item>
      <wa-dropdown-item value="command:clear" ?disabled=${l===0}>
        ${b(`usage.filters.clear`)}
      </wa-dropdown-item>
      <div class="session-menu__separator" role="separator"></div>
      ${n.map(e=>{let t=s.has(Y(e));return N`
          <wa-dropdown-item
            class="usage-filter-option"
            type="checkbox"
            value=${`option:${encodeURIComponent(e)}`}
            .checked=${t}
          >
            ${e}
          </wa-dropdown-item>
        `})}
    </wa-dropdown>
  `}function br(){return(br=e((()=>{L(),h(),We(),yn()})))()}function xr(e,t,n){let r=n?N`<div class="callout warning usage-callout">${b(`usage.providerUsage.stalled`)}</div>`:t?N`<div class="callout warning usage-callout">
          ${b(`usage.providerUsage.unavailable`)}
        </div>`:I;return e.length===0?r:ge({title:b(`usage.providerUsage.title`),count:e.length,description:b(`usage.providerUsage.subtitle`)},N`
      ${r}
      <div class="usage-panel provider-usage-section">
        <div class="provider-usage-grid">
          ${e.map(e=>N`
              <article class="provider-usage-card">
                <div class="provider-usage-card__header">
                  <div>
                    <div class="provider-usage-card__name">${e.displayName}</div>
                    <div class="provider-usage-card__id">${e.provider}</div>
                  </div>
                  ${e.plan?N`<span class="provider-usage-plan">${e.plan}</span>`:I}
                </div>
                ${Ve(e)}
              </article>
            `)}
        </div>
      </div>
    `)}function Sr(e){let{data:t,filters:n,display:r,detail:i,callbacks:a}=e,o=a.filters,s=a.display,c=a.details,l=t.cacheRefresh!==`complete`&&!t.totals?.totalTokens&&!t.totals?.totalCost&&!t.sessions.some(e=>e.usage?.totalTokens||e.usage?.totalCost)&&!t.costDaily.some(e=>e.totalTokens||e.totalCost),u=!l&&!!(t.totals||t.sessions.length||t.costDaily.length),d=t.loading||l&&t.cacheRefresh===`retrying`,f=r.chartMode===`tokens`,p=n.query.trim().length>0,m=n.queryDraft.trim().length>0,h=new Set(n.selectedDays),g=new Set(n.selectedSessions),_=t.sessions.toSorted((e,t)=>{let n=f?e.usage?.totalTokens??0:e.usage?.totalCost??0;return(f?t.usage?.totalTokens??0:t.usage?.totalCost??0)-n}),v=n.selectedHours.length>0?_.filter(e=>Gt(e,n.selectedHours,n.timeZone)):_,y=Qe(v,n.query),x=e=>h.size===0?!0:e.usage?.activityDates?.length?e.usage.activityDates.some(e=>h.has(e)):!!(e.updatedAt&&h.has(Jt(new Date(e.updatedAt),n.timeZone))),S=y.sessions.filter(x),C=y.warnings,w=fn(_,t.aggregates),T=hn(n.queryDraft,w),E=Xe(n.queryDraft),D=n.selectedSessions.length===1?t.sessions.find(e=>e.key===n.selectedSessions[0])??S.find(e=>e.key===n.selectedSessions[0]):null,O=g.size?y.sessions.filter(e=>g.has(e.key)):y.sessions,k=O.filter(x),A=g.size>0||p||n.selectedHours.length>0,j=A||h.size>0,M=e=>{let t=K();for(let n of e)n&&St(t,n);return t},P=A?(()=>{let e=new Map;for(let t of O)for(let n of t.usage?.dailyBreakdown??[]){let t=e.get(n.date)??K();St(t,n),e.set(n.date,t)}return Array.from(e,([e,t])=>({date:e,...t})).toSorted((e,t)=>e.date.localeCompare(t.date))})():t.costDaily,F=u?h.size?M(P.filter(e=>h.has(e.date))):A?M(k.map(e=>e.usage)):t.totals:null,L=t.aggregates?.sessionCount??_.length,R=j?an(k):an([],t.aggregates),z=A?void 0:t.aggregates?.byCreator;h.size>0&&(R.byCreator=(z??R.byCreator??[]).flatMap(e=>{let t=e.daily.filter(e=>h.has(e.date)),n=e.sessionActivity.flatMap(e=>{let t=e.dates.filter(e=>h.has(e));return t.length?[{dates:t,sessionCount:e.sessionCount}]:[]}),r=n.reduce((e,t)=>e+t.sessionCount,0),i=M(t);return r||i.totalTokens||i.totalCost?[{...e,totals:i,sessionCount:r,daily:t,sessionActivity:n}]:[]}));let B=h.size>0&&z?(R.byCreator??[]).reduce((e,t)=>e+t.sessionCount,0):j?k.length:t.aggregates?.sessionCount??k.length;h.size>0&&z&&(R.sessionCount=B);let V=t.sessionsLimitReached&&!j,ee=V?M(k.map(e=>e.usage)):F,te=V?an(k):R,H=j?I:Fn(t.costDaily,n.startDate,n.endDate,n.timeZone),U=on(k,ee,te),W=t.cacheRefresh===`complete`&&t.totals!==null&&!t.loading&&!t.error&&t.sessions.length===0&&(t.totals?.totalTokens??0)===0,ne=(F?.missingCostEntries??0)>0,re=[{label:b(`usage.presets.today`),days:1},{label:b(`usage.presets.last7d`),days:7},{label:b(`usage.presets.last30d`),days:30},{label:b(`usage.presets.last90d`),days:90},{label:b(`usage.presets.last1y`),days:365}],ie=e=>{let t=new Date,r=new Date(t);return n.timeZone===`utc`?r.setUTCDate(r.getUTCDate()-(e-1)):r.setDate(r.getDate()-(e-1)),{start:Jt(r,n.timeZone),end:Jt(t,n.timeZone)}},oe=e=>{let t=ie(e);return n.startDate===t.start&&n.endDate===t.end},se=e=>{let t=ie(e);o.onStartDateChange(t.start),o.onEndDateChange(t.end)},ce=()=>{o.onStartDateChange(`1970-01-01`),o.onEndDateChange(Jt(new Date,n.timeZone))},le=Jt(new Date);return be(N`
      <div class="usage-page">
        <section class="settings-section">
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${b(`usage.filters.rangeTitle`)}</h2>
            <div class="settings-section__actions">
              ${d?gt(b(`usage.loading.badge`)):I}
              ${W?N`<span class="usage-query-hint">${b(`usage.empty.hint`)}</span>`:I}
            </div>
          </div>
          <div
            class="settings-group usage-panel usage-header ${r.headerPinned?`pinned`:``}"
          >
            <div class="usage-header-row">
              <div class="usage-controls">
                ${Pn(n.selectedDays,n.selectedHours,n.selectedSessions,t.sessions,o.onClearDays,o.onClearHours,o.onClearSessions,o.onClearFilters)}
                <div class="usage-presets">
                  ${re.map(e=>N`
                      <button
                        class="btn btn--sm ${oe(e.days)?`active`:``}"
                        aria-pressed=${oe(e.days)}
                        @click=${()=>se(e.days)}
                      >
                        ${e.label}
                      </button>
                    `)}
                  <button
                    class="btn btn--sm ${n.startDate===`1970-01-01`?`active`:``}"
                    aria-pressed=${n.startDate===`1970-01-01`}
                    @click=${ce}
                  >
                    ${b(`usage.presets.all`)}
                  </button>
                </div>
                <div class="usage-date-range">
                  <input
                    class="usage-date-input"
                    type="date"
                    .value=${n.startDate}
                    title=${b(`usage.filters.startDate`)}
                    aria-label=${b(`usage.filters.startDate`)}
                    @change=${e=>o.onStartDateChange(e.target.value)}
                  />
                  <span class="usage-separator">${b(`usage.filters.to`)}</span>
                  <input
                    class="usage-date-input"
                    type="date"
                    .value=${n.endDate}
                    title=${b(`usage.filters.endDate`)}
                    aria-label=${b(`usage.filters.endDate`)}
                    @change=${e=>o.onEndDateChange(e.target.value)}
                  />
                </div>
                <select
                  class="usage-select"
                  title=${b(`usage.filters.timeZone`)}
                  aria-label=${b(`usage.filters.timeZone`)}
                  .value=${n.timeZone}
                  @change=${e=>o.onTimeZoneChange(e.target.value)}
                >
                  <option value="local">${b(`usage.filters.timeZoneLocal`)}</option>
                  <option value="utc">${b(`usage.filters.timeZoneUtc`)}</option>
                </select>
              </div>
              <div class="usage-view-options">
                ${kn({options:t.creatorOptions,selectedKey:n.creatorKey,onSelect:o.onCreatorChange})}
                ${he({mode:`buttons`,variant:`accent`,ariaPressed:!1,value:n.scope,onChange:o.onScopeChange,onReselect:o.onScopeChange,options:[{value:`instance`,label:b(`usage.scope.instance`),title:b(`usage.scope.instanceHint`)},{value:`family`,label:b(`usage.scope.family`),title:b(`usage.scope.familyHint`)}]})}
                ${he({mode:`buttons`,variant:`accent`,ariaPressed:!1,value:f?`tokens`:`cost`,onChange:s.onChartModeChange,onReselect:s.onChartModeChange,options:[{value:`tokens`,label:b(`usage.metrics.tokens`)},{value:`cost`,label:b(`usage.metrics.cost`)}]})}
                <button
                  class="btn btn--sm primary"
                  @click=${o.onRefresh}
                  ?disabled=${t.loading}
                >
                  ${b(`common.refresh`)}
                </button>
              </div>
            </div>

            <div class="usage-header-row">
              <div class="usage-header-metrics">
                ${F?N`
                        <span class="usage-metric-badge">
                          <strong>${q(F.totalTokens)}</strong>
                          ${b(`usage.metrics.tokens`)}
                        </span>
                        <span class="usage-metric-badge">
                          <strong>${J(F.totalCost)}</strong>
                          ${b(`usage.metrics.cost`)}
                        </span>
                        <span class="usage-metric-badge">
                          <strong>${B}</strong>
                          ${b(B===1?`usage.metrics.session`:`usage.metrics.sessions`)}
                        </span>
                      `:I}
                <button
                  class="btn btn--sm usage-pin-btn ${r.headerPinned?`active`:``}"
                  @click=${o.onToggleHeaderPinned}
                >
                  ${r.headerPinned?b(`usage.filters.pinned`):b(`usage.filters.pin`)}
                </button>
                <wa-dropdown
                  class="usage-export-menu"
                  placement="bottom-end"
                  @wa-select=${e=>{switch(e.detail.item.value){case`sessions-csv`:ae(`openclaw-usage-sessions-${le}.csv`,pn(k),`text/csv;charset=utf-8`);break;case`daily-csv`:ae(`openclaw-usage-daily-${le}.csv`,mn(P),`text/csv;charset=utf-8`);break;case`json`:s.onExportJson({totals:F,sessions:k,daily:P,aggregates:R});break;case void 0:}}}
                >
                  <button
                    slot="trigger"
                    type="button"
                    class="btn btn--sm"
                    aria-busy=${t.exporting}
                  >
                    ${t.exporting?b(`common.loading`):b(`usage.export.label`)} ▾
                  </button>
                  <wa-dropdown-item
                    value="sessions-csv"
                    ?disabled=${k.length===0}
                  >
                    ${b(`usage.export.sessionsCsv`)}
                  </wa-dropdown-item>
                  <wa-dropdown-item value="daily-csv" ?disabled=${P.length===0}>
                    ${b(`usage.export.dailyCsv`)}
                  </wa-dropdown-item>
                  <wa-dropdown-item
                    value="json"
                    ?disabled=${t.exporting||t.loading||k.length===0&&P.length===0}
                  >
                    ${b(`usage.export.json`)}
                  </wa-dropdown-item>
                </wa-dropdown>
              </div>
            </div>

            <div class="usage-query-section">
              <div class="usage-query-bar">
                <input
                  class="usage-query-input"
                  type="text"
                  .value=${n.queryDraft}
                  placeholder=${b(`usage.query.placeholder`)}
                  @input=${e=>o.onQueryDraftChange(e.target.value)}
                  @keydown=${e=>{e.key===`Enter`&&(e.preventDefault(),o.onApplyQuery())}}
                />
                <div class="usage-query-actions">
                  <button
                    class="btn btn--sm"
                    @click=${o.onApplyQuery}
                    ?disabled=${t.loading||!m&&!p}
                  >
                    ${b(`usage.query.apply`)}
                  </button>
                  ${m||p?N`
                          <button class="btn btn--sm" @click=${o.onClearQuery}>
                            ${b(`usage.filters.clear`)}
                          </button>
                        `:I}
                  <span class="usage-query-hint">
                    ${u?p?b(`usage.query.matching`,{shown:String(S.length),total:String(L)}):b(`usage.query.inRange`,{total:String(L)}):I}
                  </span>
                </div>
              </div>
              <div class="usage-filter-row">
                ${yr(`channel`,b(`usage.filters.channel`),w.channel,n.queryDraft,o.onQueryDraftChange)}
                ${yr(`provider`,b(`usage.filters.provider`),w.provider,n.queryDraft,o.onQueryDraftChange)}
                ${yr(`model`,b(`usage.filters.model`),w.model,n.queryDraft,o.onQueryDraftChange)}
                ${yr(`tool`,b(`usage.filters.tool`),w.tool,n.queryDraft,o.onQueryDraftChange)}
                <span class="usage-query-hint">${b(`usage.query.tip`)}</span>
              </div>
              ${E.length>0?N`
                      <div class="usage-query-chips">
                        ${E.map(e=>{let t=e.raw;return N`
                            <span class="usage-query-chip">
                              ${t}
                              <openclaw-tooltip .content=${b(`usage.filters.remove`)}>
                                <button
                                  aria-label=${b(`usage.filters.remove`)}
                                  @click=${()=>o.onQueryDraftChange(_n(n.queryDraft,t))}
                                >
                                  ×
                                </button>
                              </openclaw-tooltip>
                            </span>
                          `})}
                      </div>
                    `:I}
              ${T.length>0?N`
                      <div class="usage-query-suggestions">
                        ${T.map(e=>N`
                            <button
                              class="usage-query-suggestion"
                              @click=${()=>o.onQueryDraftChange(gn(n.queryDraft,e.value))}
                            >
                              ${e.label}
                            </button>
                          `)}
                      </div>
                    `:I}
              ${C.length>0?N`
                      <div class="callout warning usage-callout usage-callout--tight">
                        ${C.join(` · `)}
                      </div>
                    `:I}
            </div>

            ${t.error?N`<div class="callout danger usage-callout">${t.error}</div>`:I}
            ${t.cacheRefresh===`complete`?I:N`
                    <div
                      class="callout ${t.cacheRefresh===`exhausted`?`warning`:``} usage-callout usage-cache-warning"
                      role="status"
                      aria-live="polite"
                    >
                      ${b(t.cacheRefresh===`exhausted`?`usage.cacheStatus.paused`:`usage.cacheStatus.warning`)}
                    </div>
                  `}
            ${t.sessionsLimitReached?N`
                    <div class="callout warning usage-callout">
                      ${b(`usage.sessions.limitReached`)}
                    </div>
                  `:I}
          </div>
        </section>

        ${u?W?_t(o.onRefresh):N`
                  <div class="settings-group usage-panel usage-left-card usage-trend-section">
                    ${Tn(P,n.selectedDays,r.chartMode,r.dailyChartMode,s.onDailyChartModeChange,o.onSelectDay,{startDate:n.startDate,endDate:n.endDate,complete:t.cacheRefresh===`complete`})}
                    ${F?En(F,r.chartMode):I}
                  </div>
                  ${An({groups:R.byCreator??[],selectedKey:n.creatorKey,mode:r.chartMode,onSelect:o.onCreatorChange})}
                  ${Rn(ee,te,U,ne,n.selectedDays.length===0,Lt(k,n.timeZone),B,L)}
                  ${H}
                  ${fr(P,n.startDate,n.endDate)}
                  ${qt(k,n.timeZone,n.selectedHours,o.onSelectHour)}

                  <div class="usage-grid">
                    <div class="usage-grid-column">
                      ${zn(S,n.selectedSessions,n.selectedDays,f,r.sessionSort,r.sessionSortDir,r.recentSessions,r.sessionsTab,c.onSelectSession,s.onSessionSortChange,s.onSessionSortDirChange,s.onSessionsTabChange,r.visibleColumns,L,o.onClearSessions)}
                    </div>
                    ${D?N`<div class="usage-grid-column">
                            ${qn(D,i.timeSeries,i.timeSeriesLoading,i.timeSeriesStatus,i.timeSeriesMode,c.onTimeSeriesModeChange,i.timeSeriesBreakdownMode,c.onTimeSeriesBreakdownChange,i.timeSeriesCursorStart,i.timeSeriesCursorEnd,c.onTimeSeriesCursorRangeChange,n.startDate,n.endDate,n.selectedDays,n.timeZone,i.sessionLogs,i.sessionLogsLoading,i.sessionLogsStatus,i.sessionLogsExpanded,c.onToggleSessionLogsExpanded,i.logFilters,c.onLogFilterRolesChange,c.onLogFilterToolsChange,c.onLogFilterHasToolsChange,c.onLogFilterQueryChange,c.onLogFilterClear,i.context,r.contextExpanded,c.onToggleContextExpanded,o.onClearSessions)}
                          </div>`:I}
                  </div>
                `:d?N`<div class="usage-panel usage-loading-card">
                  <div class="usage-loading-grid">
                    <div class="skeleton usage-skeleton-block usage-skeleton-block--tall"></div>
                    <div class="skeleton usage-skeleton-block"></div>
                    <div class="skeleton usage-skeleton-block"></div>
                  </div>
                </div>`:I}
        ${xr(t.providerUsage,t.providerUsageUnavailable,t.providerUsageStalled)}
      </div>
    `,{wide:!0})}function Cr(){return(Cr=e((()=>{L(),ze(),G(),U(),ve(),h(),We(),sn(),yt(),yn(),Dn(),jn(),rr(),vr(),Bn(),br()})))()}var $,wr;function Tr(){return(Tr=e((()=>{a(),L(),B(),W(),f(),y(),Be(),le(),M(),T(),ct(),mt(),We(),yt(),Le(),$e(),xt(),Cr(),$=class extends g{constructor(...e){super(...e),this.usageSnapshot=null,this.providerUsageSummary=null,this.providerUsageUnavailable=!1,this.providerUsageIncomplete=!1,this.usageError=null,this.initialDateRange=qe(),this.usageStartDate=this.initialDateRange.startDate,this.usageEndDate=this.initialDateRange.endDate,this.usageScope=`family`,this.usageAgentId=null,this.usageCreatorKey=null,this.usageSelectedSessions=[],this.usageSelectedDays=[],this.usageSelectedHours=[],this.usageChartMode=`tokens`,this.usageDailyChartMode=`by-type`,this.usageTimeSeriesMode=`per-turn`,this.usageTimeSeriesBreakdownMode=`by-type`,this.usageTimeSeriesCursorStart=null,this.usageTimeSeriesCursorEnd=null,this.usageSessionLogsExpanded=!1,this.usageQuery=``,this.usageQueryDraft=``,this.usageSessionSort=`recent`,this.usageSessionSortDir=`desc`,this.usageRecentSessions=[],this.usageTimeZone=`local`,this.usageContextExpanded=!1,this.usageHeaderPinned=!1,this.usageSessionsTab=`all`,this.usageVisibleColumns=[...bt],this.usageLogFilterRoles=[],this.usageLogFilterTools=[],this.usageLogFilterHasTools=!1,this.usageLogFilterQuery=``,this.dateDebounceTimer=null,this.queryDebounceTimer=null,this.connectionEpoch={},this.routeDataInitialized=!1,this.routeDataEnabled=!0,this.refreshPolicy=new Re({isLoading:()=>this.usageLoading,reload:e=>{this.clearDateDebounce();let t=e===`manual`&&this.usageSelectedSessions.length===1?this.usageSelectedSessions[0]:void 0;return this.loadUsage(t)},onIncompleteUsageExhausted:()=>this.requestUpdate()}),this.gateway=new ue(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>this.resetForClientChange(),invalidateRequests:e=>{e.snapshot.phase!==`connected`&&(this.refreshPolicy.interrupt(),this.usageRequest.cancel(),this.details.cancel(),this.usageExportRequest.cancel())},onSnapshot:e=>this.handleGatewaySnapshot(e),onPageActivation:()=>this.refreshPolicy.request(`focus`)}),this.observeAgentScope=fe(e=>{this.routeDataInitialized&&this.usageAgentId!==e&&(this.usageAgentId=e,this.usageCreatorKey=null,this.clearSelectionsAndDetails(),this.refreshPolicy.request(`manual`)),this.requestUpdate()}),this.usageRequest=it(this,{task:async([e,t],{signal:n})=>{this.refreshPolicy.beginLoad();let r=this.connectionEpoch,i=this.currentQuery;return{epoch:r,query:i,refreshSessionKey:t,snapshot:await Ze(e,i,n)}},onComplete:e=>{let t=e.snapshot,n=this.isCurrentQuery(e.query);if(n&&t.ok){this.usageSnapshot={query:e.query,result:t.value.result,costSummary:t.value.costSummary},this.usageError=null;let n=this.usageSelectedSessions.length===1?this.usageSelectedSessions[0]:void 0;n&&this.details.load(n,e.refreshSessionKey===n)}else n&&!t.ok&&this.applyUsageError(t.error.cause);this.applyUsageLoadState(Ye(t),e.epoch,n&&t.ok?void 0:null),this.refreshPolicy.flushPending()},onError:e=>{this.applyUsageError(e),this.applyUsageLoadState({state:`pending`},this.connectionEpoch,null),this.refreshPolicy.flushPending()}}),this.usageExportRequest=pt(this,this.gateway,()=>this.currentQuery),this.details=new st(this,this.gateway,()=>this.currentQuery,()=>this.usageResult?.sessions??[],()=>{this.usageTimeSeriesCursorStart=null,this.usageTimeSeriesCursorEnd=null}),this.subscriptions=new O(this).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t))}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.ensureInitialData())}disconnectedCallback(){this.subscriptions.clear(),this.clearDateDebounce(),this.clearQueryDebounce(),this.refreshPolicy.dispose(),this.usageRequest.cancel(),this.details.cancel(),this.usageExportRequest.cancel(),super.disconnectedCallback()}applyRouteData(){let e=this.routeData;if(!e||(this.routeDataInitialized=!0,!this.routeDataEnabled))return;if(!this.gateway.isRouteDataCurrent(e)){this.routeDataEnabled=!1;return}let t=this.context.agentSelection.state.scopeId;if(e.query.agentId!==t){this.usageAgentId=t,this.clearSelectionsAndDetails(),this.resetProviderUsage(),this.refreshPolicy.request(`manual`);return}this.usageStartDate=e.query.startDate,this.usageEndDate=e.query.endDate,this.usageScope=e.query.scope,this.usageTimeZone=e.query.timeZone,this.usageAgentId=e.query.agentId,this.usageCreatorKey=e.query.creatorKey??null,this.usageSnapshot={query:this.currentQuery,result:e.result,costSummary:e.costSummary},this.applyUsageLoadState(e.providerUsage,this.connectionEpoch,e.loadedAtMs),this.usageError=e.error}ensureInitialData(){!this.routeDataEnabled&&this.routeDataInitialized&&this.gateway.client&&this.gateway.connected&&!this.usageLoading&&this.loadUsage()}resetForClientChange(){this.clearDateDebounce(),this.usageRequest.cancel(),this.routeDataInitialized&&(this.routeDataEnabled=!1),this.usageSnapshot=null,this.resetProviderUsage(),this.usageError=null,this.usageAgentId=this.context.agentSelection.state.scopeId,this.usageCreatorKey=null,this.clearSelectionsAndDetails()}resetProviderUsage(){this.providerUsageSummary=null,this.providerUsageUnavailable=!1,this.providerUsageIncomplete=!1,this.refreshPolicy.resetPayload()}applyUsageLoadState(e,t,n=Date.now()){if(e.state===`settled`){let t=e.result;this.providerUsageUnavailable=!t.ok,this.providerUsageIncomplete=!t.ok||He(t.value),t.ok&&!this.providerUsageIncomplete&&(this.providerUsageSummary=t.value)}let r=this.providerUsageIncomplete||this.usageCacheIncomplete;this.refreshPolicy.setLastLoadedAtMs(e.state===`pending`?null:n,{incomplete:r,connection:t})}get usageCacheIncomplete(){return tt(this.usageResult?.cacheStatus,this.usageCostSummary?.cacheStatus)}get currentQuery(){return{startDate:this.usageStartDate,endDate:this.usageEndDate,scope:this.usageScope,timeZone:this.usageTimeZone,agentId:l(this.usageAgentId??``)||void 0,creatorKey:this.usageCreatorKey??void 0}}isCurrentQuery(e){let t=this.currentQuery;return e.startDate===t.startDate&&e.endDate===t.endDate&&e.scope===t.scope&&e.timeZone===t.timeZone&&e.agentId===t.agentId&&e.creatorKey===t.creatorKey}get usageResult(){return this.usageSnapshot&&this.isCurrentQuery(this.usageSnapshot.query)?this.usageSnapshot.result:null}get usageCostSummary(){return this.usageSnapshot&&this.isCurrentQuery(this.usageSnapshot.query)?this.usageSnapshot.costSummary:null}get usageCreatorOptions(){return this.usageSnapshot?.query.agentId===this.currentQuery.agentId?this.usageSnapshot?.result?.creatorOptions??[]:[]}get providerUsageStalled(){return this.providerUsageIncomplete&&this.refreshPolicy.incompleteUsageExhausted}applyUsageError(e){let t=v(e);this.usageError=t?p(`usage`):Ge(e),t&&(this.usageSnapshot=null)}get usageLoading(){return!this.routeDataInitialized||this.dateDebounceTimer!==null||this.usageRequest.pending}loadUsage(e){let t=this.gateway.client;return!t||!this.gateway.connected?(this.refreshPolicy.markLoadDeferred(),Promise.resolve()):(this.routeDataEnabled=!1,this.usageError=null,this.usageRequest.run([t,e]))}clearSelections(){this.usageSelectedDays=[],this.usageSelectedHours=[],this.usageSelectedSessions=[]}clearSelectionsAndDetails(){this.usageExportRequest.cancel(),this.clearSelections(),this.details.clear()}clearDateDebounce(){this.dateDebounceTimer!==null&&(window.clearTimeout(this.dateDebounceTimer),this.dateDebounceTimer=null)}scheduleUsageLoad(){this.clearDateDebounce(),this.usageRequest.cancel(),this.usageError=null,this.refreshPolicy.resetPayload(),this.routeDataEnabled=!1,this.dateDebounceTimer=window.setTimeout(()=>{this.dateDebounceTimer=null,this.refreshPolicy.request(`manual`)},400)}handleGatewaySnapshot(e){if(!this.gateway.connected||!this.gateway.client)return;this.context.agents.ensureList(),(e.identityChanged||e.becameConnected)&&(this.connectionEpoch={},this.routeDataInitialized&&this.refreshPolicy.request(`reconnect`));let t=this.usageSelectedSessions.length===1?this.usageSelectedSessions[0]:void 0;if(e.becameAvailable&&t)for(let e of[this.details.timeSeries,this.details.sessionLogs,this.details.contextWeight])e.recover(t,e===this.details.contextWeight)}clearQueryDebounce(){this.queryDebounceTimer!==null&&(window.clearTimeout(this.queryDebounceTimer),this.queryDebounceTimer=null)}selectSession(e,t,n){if(this.details.clear(),this.usageRecentSessions=[e,...this.usageRecentSessions.filter(t=>t!==e)].slice(0,8),this.usageSelectedSessions=et(this.usageSelectedSessions,e,n,t),this.usageSelectedSessions.length===1){let e=this.usageSelectedSessions[0];e&&this.details.load(e)}}render(){let e=this.details.timeSeries.data,t={data:{loading:this.usageLoading,exporting:this.usageExportRequest.pending,error:this.usageError,sessions:this.usageResult?.sessions??[],creatorOptions:this.usageCreatorOptions,agents:this.context.agents.state.agentsList?.agents.map(e=>e.id).filter(Boolean)??[],sessionsLimitReached:(this.usageResult?.sessions.length??0)>=1e3,totals:this.usageResult?.totals??null,aggregates:this.usageResult?.aggregates??null,costDaily:this.usageCostSummary?.daily??[],cacheRefresh:this.usageCacheIncomplete?this.refreshPolicy.incompleteUsageExhausted?`exhausted`:`retrying`:`complete`,providerUsage:this.providerUsageSummary?.providers??[],providerUsageStalled:this.providerUsageStalled,providerUsageUnavailable:this.providerUsageUnavailable},filters:{startDate:this.usageStartDate,endDate:this.usageEndDate,scope:this.usageScope,selectedSessions:this.usageSelectedSessions,selectedDays:this.usageSelectedDays,selectedHours:this.usageSelectedHours,agentId:this.usageAgentId,creatorKey:this.usageCreatorKey,query:this.usageQuery,queryDraft:this.usageQueryDraft,timeZone:this.usageTimeZone},display:{chartMode:this.usageChartMode,dailyChartMode:this.usageDailyChartMode,sessionSort:this.usageSessionSort,sessionSortDir:this.usageSessionSortDir,recentSessions:this.usageRecentSessions,sessionsTab:this.usageSessionsTab,visibleColumns:this.usageVisibleColumns,contextExpanded:this.usageContextExpanded,headerPinned:this.usageHeaderPinned},detail:{context:{weight:this.details.contextWeight.data,loading:this.details.contextWeight.loading,status:this.details.contextWeight.status},timeSeriesMode:this.usageTimeSeriesMode,timeSeriesBreakdownMode:this.usageTimeSeriesBreakdownMode,timeSeries:e,timeSeriesLoading:this.details.timeSeries.loading,timeSeriesStatus:this.details.timeSeries.status,timeSeriesCursorStart:this.usageTimeSeriesCursorStart,timeSeriesCursorEnd:this.usageTimeSeriesCursorEnd,sessionLogs:this.details.sessionLogs.data,sessionLogsLoading:this.details.sessionLogs.loading,sessionLogsStatus:this.details.sessionLogs.status,sessionLogsExpanded:this.usageSessionLogsExpanded,logFilters:{roles:this.usageLogFilterRoles,tools:this.usageLogFilterTools,hasTools:this.usageLogFilterHasTools,query:this.usageLogFilterQuery}},callbacks:{filters:{onStartDateChange:e=>{this.usageStartDate=e,this.clearSelectionsAndDetails(),this.scheduleUsageLoad()},onEndDateChange:e=>{this.usageEndDate=e,this.clearSelectionsAndDetails(),this.scheduleUsageLoad()},onScopeChange:e=>{this.usageScope=e,this.clearSelectionsAndDetails(),this.refreshPolicy.request(`manual`)},onAgentChange:e=>{this.context.agentSelection.setScope(e)},onCreatorChange:e=>{this.usageCreatorKey=e,this.clearSelectionsAndDetails(),this.refreshPolicy.request(`manual`)},onRefresh:()=>this.refreshPolicy.request(`manual`),onTimeZoneChange:e=>{this.usageTimeZone=e,this.clearSelectionsAndDetails(),this.refreshPolicy.request(`manual`)},onToggleHeaderPinned:()=>this.usageHeaderPinned=!this.usageHeaderPinned,onSelectHour:(e,t)=>{this.usageSelectedHours=Ke(this.usageSelectedHours,e,Array.from({length:24},(e,t)=>t),t,!0)},onQueryDraftChange:e=>{this.usageQueryDraft=e,this.clearQueryDebounce(),this.queryDebounceTimer=window.setTimeout(()=>{this.usageQuery=this.usageQueryDraft,this.queryDebounceTimer=null},250)},onApplyQuery:()=>{this.clearQueryDebounce(),this.usageQuery=this.usageQueryDraft},onClearQuery:()=>{this.clearQueryDebounce(),this.usageQueryDraft=``,this.usageQuery=``},onSelectDay:(e,t,n)=>{this.usageSelectedDays=Ke(this.usageSelectedDays,e,n,t,!1)},onClearDays:()=>this.usageSelectedDays=[],onClearHours:()=>this.usageSelectedHours=[],onClearSessions:()=>{this.usageSelectedSessions=[],this.details.clear()},onClearFilters:()=>this.clearSelectionsAndDetails()},display:{onExportJson:e=>{this.usageExportRequest.run(e)},onChartModeChange:e=>this.usageChartMode=e,onDailyChartModeChange:e=>this.usageDailyChartMode=e,onSessionSortChange:e=>this.usageSessionSort=e,onSessionSortDirChange:e=>this.usageSessionSortDir=e,onSessionsTabChange:e=>this.usageSessionsTab=e,onToggleColumn:e=>{this.usageVisibleColumns=this.usageVisibleColumns.includes(e)?this.usageVisibleColumns.filter(t=>t!==e):[...this.usageVisibleColumns,e]}},details:{onToggleContextExpanded:()=>this.usageContextExpanded=!this.usageContextExpanded,onToggleSessionLogsExpanded:()=>this.usageSessionLogsExpanded=!this.usageSessionLogsExpanded,onLogFilterRolesChange:e=>{this.usageLogFilterRoles=e},onLogFilterToolsChange:e=>{this.usageLogFilterTools=e},onLogFilterHasToolsChange:e=>{this.usageLogFilterHasTools=e},onLogFilterQueryChange:e=>{this.usageLogFilterQuery=e},onLogFilterClear:()=>{this.usageLogFilterRoles=[],this.usageLogFilterTools=[],this.usageLogFilterHasTools=!1,this.usageLogFilterQuery=``},onSelectSession:(e,t,n)=>this.selectSession(e,t,n),onTimeSeriesModeChange:e=>{this.usageTimeSeriesMode=e},onTimeSeriesBreakdownChange:e=>{this.usageTimeSeriesBreakdownMode=e},onTimeSeriesCursorRangeChange:(t,n)=>{this.details.timeSeries.data===e&&(this.usageTimeSeriesCursorStart=t,this.usageTimeSeriesCursorEnd=n)}}}};return ht(this.context,this.usageResult,Sr(t))}},c([s({context:H,subscribe:!0})],$.prototype,`context`,void 0),c([ee({attribute:!1})],$.prototype,`routeData`,void 0),c([z()],$.prototype,`usageSnapshot`,void 0),c([z()],$.prototype,`providerUsageSummary`,void 0),c([z()],$.prototype,`providerUsageUnavailable`,void 0),c([z()],$.prototype,`providerUsageIncomplete`,void 0),c([z()],$.prototype,`usageError`,void 0),c([z()],$.prototype,`usageStartDate`,void 0),c([z()],$.prototype,`usageEndDate`,void 0),c([z()],$.prototype,`usageScope`,void 0),c([z()],$.prototype,`usageAgentId`,void 0),c([z()],$.prototype,`usageCreatorKey`,void 0),c([z()],$.prototype,`usageSelectedSessions`,void 0),c([z()],$.prototype,`usageSelectedDays`,void 0),c([z()],$.prototype,`usageSelectedHours`,void 0),c([z()],$.prototype,`usageChartMode`,void 0),c([z()],$.prototype,`usageDailyChartMode`,void 0),c([z()],$.prototype,`usageTimeSeriesMode`,void 0),c([z()],$.prototype,`usageTimeSeriesBreakdownMode`,void 0),c([z()],$.prototype,`usageTimeSeriesCursorStart`,void 0),c([z()],$.prototype,`usageTimeSeriesCursorEnd`,void 0),c([z()],$.prototype,`usageSessionLogsExpanded`,void 0),c([z()],$.prototype,`usageQuery`,void 0),c([z()],$.prototype,`usageQueryDraft`,void 0),c([z()],$.prototype,`usageSessionSort`,void 0),c([z()],$.prototype,`usageSessionSortDir`,void 0),c([z()],$.prototype,`usageRecentSessions`,void 0),c([z()],$.prototype,`usageTimeZone`,void 0),c([z()],$.prototype,`usageContextExpanded`,void 0),c([z()],$.prototype,`usageHeaderPinned`,void 0),c([z()],$.prototype,`usageSessionsTab`,void 0),c([z()],$.prototype,`usageVisibleColumns`,void 0),c([z()],$.prototype,`usageLogFilterRoles`,void 0),c([z()],$.prototype,`usageLogFilterTools`,void 0),c([z()],$.prototype,`usageLogFilterHasTools`,void 0),c([z()],$.prototype,`usageLogFilterQuery`,void 0),customElements.get(`openclaw-usage-page`)||customElements.define(`openclaw-usage-page`,$),wr={header:!0,render:e=>N`<openclaw-usage-page .routeData=${e}></openclaw-usage-page>`}})))()}Tr();export{wr as usagePageComponent};
//# sourceMappingURL=usage-page-BmJe1o1h.js.map