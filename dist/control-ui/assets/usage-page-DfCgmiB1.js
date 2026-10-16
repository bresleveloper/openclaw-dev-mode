import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{A as t,Ac as n,Cu as r,Eu as i,Iu as a,Ji as o,Li as s,Lu as c,R as l,Rs as u,Tu as d,V as f,Vs as p,W as m,Xi as h,du as g,j as _,ju as v,kc as y,lu as b,pu as x,qi as S,uu as C}from"./control-ui-core-bJHyI7AF.js";import{Ai as w,La as T,Ra as E,Ti as D,na as O,ra as k,wa as ee,wi as A}from"./control-ui-core-DNh4McGE.js";import{$ as j,C as M,T as N,X as P,Y as F,ct as I,d as L,nt as te,tt as R,u as z,ut as ne}from"./lit-runtime-DyST807n.js";import{Cn as B,En as re,Go as ie,Kr as V,Vr as H,ht as U}from"./control-ui-boot-shared-DsSYH3B6.js";import{Bi as ae,Ei as oe,Mi as se,Ra as ce,Xr as le,Zr as ue,eo as de,hi as fe,ii as W,qi as pe,wo as G}from"./ui-DeikvIdP.js";import{$n as me,Dr as he,G as ge,I as _e,K as ve,Qn as ye,X as be,Xn as xe,Y as Se,Yn as Ce,Zn as we,bi as Te,c as Ee,er as De,in as Oe,kr as ke,l as Ae,n as je,rn as Me,s as Ne,t as Pe,u as Fe}from"./control-ui-boot-shared-C9uJ732w.js";import{Hc as Ie,Uc as Le}from"./control-ui-boot-shared-C1PHuQAX.js";import{i as Re,n as ze,r as Be}from"./usage-BQd4o5lO.js";import{a as Ve,i as He,n as Ue,r as We}from"./usage-B2dpYrkh.js";import{n as Ge,t as Ke}from"./provider-usage-De2Vgryc.js";import{a as qe,c as Je,i as Ye,l as Xe,n as Ze,o as Qe,r as $e,s as et,t as tt,u as nt}from"./request-usage-snapshot-B9UGSIGD.js";function rt(e,t){return[e,t].some(e=>e&&e.status!==`fresh`)}function it(e){let t=e.cacheRefresh!==`complete`&&!e.totals?.totalTokens&&!e.totals?.totalCost&&!e.sessions.some(e=>e.usage?.computedAt!==void 0||e.usage?.totalTokens||e.usage?.totalCost)&&!e.costDaily.some(e=>e.totalTokens||e.totalCost);return{hasOverviewData:!t&&!!(e.totals||e.sessions.length||e.costDaily.length),loadingOverview:e.loading||t&&e.cacheRefresh===`retrying`}}function at(e,t){let n=0,r=0,i=[];for(let a of t?[e&&Object.hasOwn(e,t)?e[t]:void 0]:Object.values(e??{}))a&&(n=Math.max(n,a.usageUpdatedAt),r=Math.max(r,a.committedAt),a.usageRefreshFailed&&i.push(a));return{updatedAt:n,committedAt:r,failures:i}}function ot(e,t,n){let r=h(t),i=ye(r?we():e,t,n);return{clearData:r,status:r&&i.error?{...i,error:S(`usage details`)}:i}}function st(){return(st=e((()=>{me(),o()})))()}function ct(e,t){let n=null,r=(t,r)=>{if(n===t){n=null;try{r()}catch{}finally{e.requestUpdate()}}};return{get pending(){return n!==null},cancel:()=>{let t=n;n=null,t?.abort(),e.requestUpdate()},async run(i){let a=n,o=new AbortController;n=o,a?.abort(),e.requestUpdate();let s;try{s=await t.task(i,{signal:o.signal})}catch(e){r(o,()=>t.onError(e));return}r(o,()=>t.onComplete(s))}}}function lt(e,t){return e?.key===t.key&&e.agentId===t.agentId&&e.sessionId===t.sessionId}function ut(e,t,n,r,i,a){let o=null,s=we(),c=null,l=0,u=ct(e,{task:async([e,t],{signal:r})=>({target:t,data:await n(e,{key:t.key,...!de(t.key.trim())&&t.agentId?{agentId:t.agentId}:{}},r,t.sessionId)}),onComplete:e=>{c=null,o=e,s=xe()},onError:e=>{c=null;let n=ot(s,e,t.snapshot);n.clearData&&o&&delete o.data,s=n.status}}),d=()=>{c&&t.snapshot&&!p(t.snapshot)&&(s=ye(s,void 0,t.snapshot)),c=null,l+=1,u.cancel()},f=e=>{o=e?{target:e}:null,s=we(),a?.()};return{get data(){return o?.data??null},get status(){return s},get loading(){return c!==null},async recover(e,n=!1){let i=l,a=r(e);await c,i===l&&lt(a,r(e))&&t.snapshot&&p(t.snapshot)&&(s.awaitingGateway||s.error!==null||n&&!s.hasLoaded)&&this.load(e)},load(e,n=!0){let a=t.client;if(!a||!t.connected)return Promise.resolve();let p=!!e&&i?.(e)!==!1,m=r(e),h=lt(o?.target,m);return(!h||!p)&&f(p?m:void 0),p?!n&&h?c??Promise.resolve():(s=Ce(s),l+=1,c=u.run([a,m])):(d(),Promise.resolve())},cancel:d,clear(){f(),d()}}}var dt;function ft(){return(ft=e((()=>{ce(),me(),i(),u(),st(),dt=class{constructor(e,t,n,r,i){let a=e=>{let t=r().find(t=>t.key===e),i=t?.agentId??n().agentId;return{key:e,...i?{agentId:i}:{},sessionId:t?.sessionId}};this.timeSeries=ut(e,t,Re,a,void 0,i),this.sessionLogs=ut(e,t,async(e,t)=>{let n=await Be(e,t);return Array.isArray(n.logs)?n.logs:null},a),this.contextWeight=ut(e,t,async(e,t,r,i)=>{let a=(await ze(e,{...n(),agentId:t.agentId},{key:t.key,includeContextWeight:!0,signal:r})).sessions[0];if(i!==void 0&&a?.sessionId!==void 0&&a.sessionId!==i)throw Error(v(`usage.details.contextOutOfDate`));return a?.contextWeight},a,e=>r().some(t=>t.key===e&&t.hasContextWeight))}load(e,t=!0){this.timeSeries.load(e,t),this.sessionLogs.load(e,t),this.contextWeight.load(e)}cancel(){this.timeSeries.cancel(),this.sessionLogs.cancel(),this.contextWeight.cancel()}clear(){this.timeSeries.clear(),this.sessionLogs.clear(),this.contextWeight.clear()}}})))()}var pt,mt;function ht(){return(ht=e((()=>{c(),pt={usage:{presets:{today:`Today`,last7d:`7d`,last30d:`30d`,last90d:`90d`,last1y:`1y`,all:`All`},scope:{instance:`Current instance`,instanceHint:`Show only the active session id for each logical session.`,family:`Historical lineage`,familyHint:`Roll up known rotated transcript-backed session ids.`,familyIncluded:`Historical lineage includes {count} session instances.`},filters:{rangeTitle:`Reporting range`,rangeHint:`Choose the dates to include in every chart and total.`,title:`Filters`,to:`to`,startDate:`Start date`,endDate:`End date`,timeZone:`Time zone`,timeZoneLocal:`Local`,timeZoneUtc:`UTC`,pin:`Pin`,pinned:`Pinned`,selectAll:`Select All`,clear:`Clear`,clearAll:`Clear All`,remove:`Remove filter`,removeDays:`Remove days filter`,removeHours:`Remove hours filter`,removeSession:`Remove session filter`,all:`All`,days:`Days`,hours:`Hours`,session:`Session`,agent:`Agent`,channel:`Channel`,provider:`Provider`,model:`Model`,tool:`Tool`,daysCount:`{count} days`,hoursCount:`{count} hours`,sessionsCount:`{count} sessions`},query:{placeholder:`Filter sessions (e.g. key:agent:main:cron* model:gpt-4o has:errors minTokens:2000)`,apply:`Filter (client-side)`,matching:`{shown} of {total} sessions match`,inRange:`{total} sessions in range`,tip:`Tip: use filters or click bars to refine days.`},export:{label:`Export`,changed:`Session context changed while preparing the export. Refresh usage and try again.`,sessionsCsv:`Sessions CSV`,dailyCsv:`Daily CSV`,json:`JSON`},cacheStatus:{warning:`Usage data may be incomplete. Checking for updated totals automatically.`,paused:`Usage data may be incomplete. Automatic checks paused; select Refresh to check again.`},creators:{title:`Started by`,description:`Usage grouped by who started each session. This is session attribution, not per-turn billing.`,all:`All identities`,select:`Filter by session creator`,selected:`Selected identity`,identity:`Identity`,unattributed:`Unattributed`,system:`System`,empty:`No usage for these dates and filters.`,more:`Show {count} more identities`},empty:{title:`No usage in this date range`,subtitle:`Try a wider date range or another identity to explore more history.`,hint:`Choose a wider date range or another identity.`,noData:`No data`},daily:{title:`Daily Usage`,total:`Total`,byType:`By Type`,tokensTitle:`Daily Token Usage`,costTitle:`Daily Cost`,compressedScaleHint:`Square-root scale keeps low-usage days visible.`},costWindows:{title:`Cost Windows`,subtitle:`Calendar windows ending {date}`,selectedRange:`Selected Range`,lastDays:`Last {count} days`,perDay:`/ day`},overview:{messages:`Messages`,messagesHint:`Total user and assistant messages in range.`,messagesAbbrev:`msgs`,user:`user`,assistant:`assistant`,toolCalls:`Tool Calls`,toolCallsHint:`Total tool call count across sessions.`,toolsUsed:`tools used`,errors:`Errors`,errorsHint:`Total message and tool errors in range.`,toolResults:`tool results`,avgTokens:`Avg Tokens / Msg`,avgTokensHint:`Average tokens per message in this range.`,avgCost:`Avg Cost / Msg`,avgCostHint:`Average cost per message when providers report costs.`,avgCostHintMissing:`Average cost per message when providers report costs. Cost data is missing for some or all sessions in this range.`,acrossMessages:`Across {count} messages`,sessions:`Sessions`,sessionsHint:`Distinct sessions in the range.`,sessionsInRange:`of {count} in range`,throughput:`Throughput`,throughputHint:`Throughput shows tokens per minute over active time. Higher is better.`,tokensPerMinute:`tok/min`,perMinute:`/ min`,errorRate:`Error Rate`,errorHint:`Error rate = errors / total messages. Lower is better.`,avgSession:`avg session`,cacheHitRate:`Cache Hit Rate`,cacheHint:`Cache hit rate = cache read / (input + cache read + cache write). Higher is better.`,cached:`cached`,prompt:`prompt`,calls:`calls`,costShare:`{percent}% of cost`,topModels:`Top Models`,topProviders:`Top Providers`,topTools:`Top Tools`,topAgents:`Top Agents`,topChannels:`Top Channels`,peakErrorDays:`Peak Error Days`,peakErrorHours:`Peak Error Hours`,noModelData:`No model data`,noProviderData:`No provider data`,noToolCalls:`No tool calls`,noAgentData:`No agent data`,noChannelData:`No channel data`,noErrorData:`No error data`},sessions:{title:`Sessions`,shown:`{count} shown`,total:`{count} total`,avg:`avg`,all:`All`,recent:`Recently viewed`,recentShort:`Recent`,sort:`Sort`,ascending:`Ascending`,descending:`Descending`,clearSelection:`Clear Selection`,noRecent:`No recent sessions`,noneInRange:`No sessions in range`,more:`+{count} more`,selected:`Selected ({count})`,copy:`Copy`,limitReached:`Showing first 1,000 sessions. Narrow date range for complete results.`},mosaic:{title:`Activity by Time`,subtitleEmpty:`Estimates require session timestamps.`,subtitle:`Estimated from session spans (first/last activity). Time zone: {zone}.`,noTimelineData:`No timeline data yet.`,dayOfWeek:`Day of Week`,midnight:`Midnight`,fourAm:`4am`,eightAm:`8am`,noon:`Noon`,fourPm:`4pm`,eightPm:`8pm`,legend:`Low → High token density`,sun:`Sun`,mon:`Mon`,tue:`Tue`,wed:`Wed`,thu:`Thu`,fri:`Fri`,sat:`Sat`}}},mt=Object.assign(()=>{let{overview:e,...t}=pt.usage;Object.assign(a.usage,t),Object.assign(a.usage.overview,e)},{catalog:pt})})))()}function gt({agentId:e,key:t,sessionId:n}){return JSON.stringify([e,t,n])}function _t(e,t,n){return ct(e,{task:async(e,{signal:r})=>{let i=t.capture();if(!i)throw Error(v(`common.offline`));let a=`openclaw-usage-${Ye()}.json`,o=new Map;if(e.sessions.some(e=>e.hasContextWeight)){let t=await ze(i.client,n(),{includeContextWeight:!0,signal:r});if(o=new Map(t.sessions.map(e=>[gt(e),e.contextWeight])),e.sessions.some(e=>e.hasContextWeight&&!o.get(gt(e))))throw Error(v(`usage.export.changed`))}return{connection:i,filename:a,data:{...e,sessions:e.sessions.map(e=>({...e,contextWeight:o.get(gt(e))??null}))}}},onComplete:({connection:e,filename:n,data:r})=>{t.isCurrent(e)&&U(n,JSON.stringify(r,null,2),`application/json;charset=utf-8`)},onError:e=>{C({message:`${v(`usage.export.label`)}: ${g(e,`request failed`)}`})}})}function vt(){return(vt=e((()=>{i(),ht(),x(),b(),et(),mt()})))()}function yt(e,t,n){let r=t?.sessions.map(e=>e.agentId).filter(e=>!!e?.trim())??[];return j`
    ${ve({title:E(`usage`),subtitle:T(`usage`),actions:je({agents:e.agents.state.agentsList?.agents??[],additionalAgentIds:r,selection:e.agentSelection})})}
    ${Fe(n)}
  `}function bt(e){return j`
    <span class="settings-status settings-status--accent">
      <span class="usage-loading-spinner" aria-hidden="true"></span>
      ${e}
    </span>
  `}function xt(e){return j`
    <section class="settings-group usage-panel usage-empty-state">
      <div class="usage-empty-state__title">${v(`usage.empty.title`)}</div>
      <div class="card-sub usage-empty-state__subtitle">${v(`usage.empty.subtitle`)}</div>
      <div class="usage-empty-state__actions">
        <button class="btn primary" @click=${e}>${v(`common.refresh`)}</button>
      </div>
    </section>
  `}function St(e,t,n){return De({status:e,errorMessage:e.error?v(`usage.details.loadFailed`,{detail:G(v(t)),error:e.error}):void 0,className:`usage-callout usage-detail-error--${n}`})}function Ct(){return(Ct=e((()=>{F(),ee(),Pe(),me(),_e(),Ae(),i()})))()}function K(){return{input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0}}function wt(e,t){if(e.input+=t.input,e.output+=t.output,e.cacheRead+=t.cacheRead,e.cacheWrite+=t.cacheWrite,e.totalTokens+=t.totalTokens,e.totalCost+=t.totalCost,e.inputCost+=t.inputCost,e.outputCost+=t.outputCost,e.cacheReadCost+=t.cacheReadCost,e.cacheWriteCost+=t.cacheWriteCost,e.missingCostEntries+=t.missingCostEntries,t.missingCostByModel){e.missingCostByModel??={};for(let[n,r]of Object.entries(t.missingCostByModel))e.missingCostByModel[n]=(e.missingCostByModel[n]??0)+r}}function Tt(e,t){return JSON.stringify([e??`unknown`,t??`unknown`])}function Et(e,t,n){return JSON.stringify([e,t??`unknown`,n??`unknown`])}function Dt(){return{count:0,sum:0,min:1/0,max:0,p95Max:0}}function Ot(e,t){e.count+=t.count,e.sum+=t.avgMs*t.count,e.min=Math.min(e.min,t.minMs),e.max=Math.max(e.max,t.maxMs),e.p95Max=Math.max(e.p95Max,t.p95Ms)}function kt(e){return{count:e.count,avgMs:e.count?e.sum/e.count:0,minMs:e.min===1/0?0:e.min,maxMs:e.max,p95Ms:e.p95Max}}function At(e,t,n,r){let i=e.get(t)??{provider:n.provider,model:r,count:0,totals:K()};i.count+=n.count,wt(i.totals,n.totals),e.set(t,i)}function jt(e,t,n){if(!t)return;let r=e.get(t)??K();wt(r,n),e.set(t,r)}function Mt(e,t){return t.totals.totalCost-e.totals.totalCost||t.totals.totalTokens-e.totals.totalTokens}function Nt(){let e=K(),t={total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},n=new Map,r=new Map,i=new Map,a=new Map,o=new Map,s=new Map,c=new Map,l=new Map,u=new Map,d=new Map,f=Dt(),p=0,m=0;function h(e){let t=c.get(e);return t||(t={date:e,tokens:0,cost:0,messages:0,toolCalls:0,errors:0},c.set(e,t)),t}function g({usage:c,agentId:g,channel:_,createdActor:v,creatorKey:y=Pt}){if(!c)return;wt(e,c),m=Math.max(m,c.durationMs??0);let b=c.firstActivity!==void 0||(c.messageCounts?.total??0)>0;b&&(p+=1),c.messageCounts&&(t.total+=c.messageCounts.total,t.user+=c.messageCounts.user,t.assistant+=c.messageCounts.assistant,t.toolCalls+=c.messageCounts.toolCalls,t.toolResults+=c.messageCounts.toolResults,t.errors+=c.messageCounts.errors);for(let e of c.toolUsage?.tools??[])n.set(e.name,(n.get(e.name)??0)+e.count);for(let e of c.modelUsage??[])At(r,Tt(e.provider,e.model),e,e.model),At(i,e.provider??`unknown`,e,void 0);jt(a,g,c),jt(o,_,c);let x=s.get(y)??{key:y,...v?{actor:v}:{},totals:K(),sessionCount:0,daily:new Map,sessionActivity:new Map};if(wt(x.totals,c),b){x.sessionCount+=1;let e=[...new Set([...c.activityDates??[],...c.dailyBreakdown?.map(({date:e})=>e)??[],...c.dailyMessageCounts?.map(({date:e})=>e)??[]])].toSorted(),t=JSON.stringify(e),n=x.sessionActivity.get(t)??{dates:e,sessionCount:0};n.sessionCount+=1,x.sessionActivity.set(t,n)}s.set(y,x),c.latency&&c.latency.count>0&&Ot(f,c.latency);for(let e of c.dailyLatency??[]){let t=u.get(e.date)??Dt();Ot(t,e),u.set(e.date,t)}for(let e of c.dailyBreakdown??[]){let t=h(e.date);t.tokens+=e.tokens,t.cost+=e.cost,jt(l,e.date,e),jt(x.daily,e.date,e)}for(let e of c.dailyMessageCounts??[]){let t=h(e.date);t.messages+=e.total,t.toolCalls+=e.toolCalls,t.errors+=e.errors}for(let e of c.dailyModelUsage??[]){let t=Et(e.date,e.provider,e.model),n=d.get(t)??{date:e.date,provider:e.provider,model:e.model,tokens:0,cost:0,count:0};n.tokens+=e.tokens,n.cost+=e.cost,n.count+=e.count,d.set(t,n)}}function _(){let e=Array.from(n,([e,t])=>({name:e,count:t})).toSorted((e,t)=>t.count-e.count);return{sessionCount:p,...m>0?{longestSessionDurationMs:m}:{},messages:t,tools:{totalCalls:e.reduce((e,{count:t})=>e+t,0),uniqueTools:n.size,tools:e},byModel:Array.from(r.values()).toSorted(Mt),byProvider:Array.from(i.values()).toSorted(Mt),byAgent:Array.from(a,([e,t])=>({agentId:e,totals:t})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),byChannel:Array.from(o,([e,t])=>({channel:e,totals:t})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),byCreator:Array.from(s.values(),({daily:e,sessionActivity:t,...n})=>({...n,daily:Array.from(e,([e,t])=>({date:e,...t})).toSorted((e,t)=>e.date.localeCompare(t.date)),sessionActivity:Array.from(t.values()).toSorted((e,t)=>e.dates.join(`,`).localeCompare(t.dates.join(`,`)))})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost||t.totals.totalTokens-e.totals.totalTokens||e.key.localeCompare(t.key)),costDaily:Array.from(l,([e,t])=>({date:e,...t})).toSorted((e,t)=>e.date.localeCompare(t.date)),latency:f.count>0?kt(f):void 0,dailyLatency:Array.from(u,([e,t])=>({date:e,...kt(t)})).toSorted((e,t)=>e.date.localeCompare(t.date)),modelDaily:Array.from(d.values()).toSorted((e,t)=>e.date.localeCompare(t.date)||t.cost-e.cost),daily:Array.from(c.values()).toSorted((e,t)=>e.date.localeCompare(t.date))}}return{totals:e,add:g,finish:_}}var Pt;function Ft(){return(Ft=e((()=>{Pt=`["unknown"]`})))()}function It(e){return Math.round(e/rn)}function q(e){return _(e,{thousandsSuffix:`K`,trimTrailingZero:!1})}function J(e,t=2){return`$${e.toFixed(t)}`}function Y(e){let t=Math.abs(e);return J(e,t===0||t>=.01?2:t>=1e-4?4:6)}function Lt(e){return new Date(Date.UTC(1970,0,1,e)).toLocaleTimeString(void 0,{hour:`numeric`,timeZone:`UTC`})}function Rt(e,t,n){let r=e.usage;if(!r)return!1;let i=r.firstActivity??e.updatedAt,a=r.lastActivity??e.updatedAt;if(!i||!a)return!1;let o=Math.min(i,a),s=Math.max(i,a);if(o===s){let e=new Date(o);return n({usage:r,hour:Bt(e,t),weekday:Vt(e,t),share:1}),!0}let c=s-o,l=o;for(;l<s;){let e=new Date(l),i=Math.min(Wt(e,t),s);n({usage:r,hour:Bt(e,t),weekday:Vt(e,t),share:(i-l)/c}),l=i}return!0}function zt(e,t){let n=Array.from({length:24},()=>0),r=Array.from({length:24},()=>0);for(let i of e){let e=i.usage;if(!e?.messageCounts||e.messageCounts.total===0)continue;let a=e.messageCounts;if(e.utcQuarterHourMessageCounts&&e.utcQuarterHourMessageCounts.length>0){let i={utcDateKey:void 0,utcWeekday:null,utcStartMs:0};for(let a of e.utcQuarterHourMessageCounts){let e=Ut(a.date,a.quarterIndex,t,i);e&&(n[e.hour]=(n[e.hour]??0)+a.errors,r[e.hour]=(r[e.hour]??0)+a.total)}continue}Rt(i,t,({hour:e,share:t})=>{n[e]=(n[e]??0)+(a.errors??0)*t,r[e]=(r[e]??0)+a.total*t})}return r.map((e,t)=>{let r=n[t]??0;return{hour:t,rate:e>0?r/e:0,errors:r,msgs:e}}).filter(e=>e.msgs>0&&e.errors>0).toSorted((e,t)=>t.rate-e.rate).slice(0,5).map(e=>({label:Lt(e.hour),value:`${(e.rate*100).toFixed(2)}%`,sub:`${Math.round(e.errors)} ${G(v(`usage.overview.errors`))} · ${Math.round(e.msgs)} ${v(`usage.overview.messagesAbbrev`)}`}))}function Bt(e,t){return t===`utc`?e.getUTCHours():e.getHours()}function Vt(e,t){return t===`utc`?e.getUTCDay():e.getDay()}function Ht(e,t=`local`){let n=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!n)return null;let[,r,i,a]=n,o=Number(r),s=Number(i)-1,c=Number(a),l=t===`utc`?new Date(Date.UTC(o,s,c)):new Date(o,s,c),[u,d,f]=t===`utc`?[l.getUTCFullYear(),l.getUTCMonth(),l.getUTCDate()]:[l.getFullYear(),l.getMonth(),l.getDate()];return u===o&&d===s&&f===c?l:null}function Ut(e,t,n,r){if(!Number.isInteger(t)||t<0||t>95)return null;if(e!==r.utcDateKey){r.utcDateKey=e;let t=Ht(e,`utc`);r.utcWeekday=t?t.getUTCDay():null,r.utcStartMs=t?t.getTime():0}if(r.utcWeekday===null)return null;let i=n===`local`?new Date(r.utcStartMs+t*9e5):null;return{hour:i?Bt(i,n):Math.floor((t+0)/4),weekday:i?Vt(i,n):r.utcWeekday}}function Wt(e,t){let n=e.getTime(),r=t===`utc`?e.getUTCMinutes():e.getMinutes(),i=t===`utc`?e.getUTCSeconds():e.getSeconds(),a=n+(60-r)*6e4-i*1e3-e.getMilliseconds();if(t===`utc`||new Date(a-1).getTimezoneOffset()===e.getTimezoneOffset())return a;let o=e.getTimezoneOffset(),s=n+1,c=a-1;for(;s<c;){let e=s+Math.floor((c-s)/2);new Date(e).getTimezoneOffset()===o?s=e+1:c=e}return s}function Gt(e,t,n){let r=e.usage?.utcQuarterHourTokenUsage;if(!r||r.length===0)return!1;let i=!1,a={utcDateKey:void 0,utcWeekday:null,utcStartMs:0};for(let e of r){if(e.totalTokens<=0)continue;let r=Ut(e.date,e.quarterIndex,t,a);if(r&&(i=!0,n({hour:r.hour,weekday:r.weekday,tokens:e.totalTokens})===!1))break}return i}function Kt(e,t,n){let r=e.usage,i=r?.firstActivity??e.updatedAt,a=r?.lastActivity??e.updatedAt;if(!i||!a)return!1;let o=Math.min(i,a),s=Math.max(i,a),c=o;for(;c<=s;){let e=new Date(c),r=Bt(e,n);if(t.includes(r))return!0;if(c===s)break;c=Math.min(Wt(e,n),s)}return!1}function qt(e,t,n){if(t.length===0)return!0;let r=!1;return Gt(e,n,({hour:e})=>(r=t.includes(e),!r))?r:Kt(e,t,n)}function Jt(e,t){let n=Array.from({length:24},()=>0),r=Array.from({length:7},()=>0),i=0,a=!1;for(let o of e){let e=o.usage;if(!(!e||!e.totalTokens||e.totalTokens<=0)){if(i+=e.totalTokens,Gt(o,t,({hour:e,weekday:t,tokens:i})=>{n[e]=(n[e]??0)+i,r[t]=(r[t]??0)+i})){a=!0;continue}Rt(o,t,({usage:e,hour:t,weekday:i,share:a})=>{n[t]=(n[t]??0)+e.totalTokens*a,r[i]=(r[i]??0)+e.totalTokens*a})&&(a=!0)}}let o=[v(`usage.mosaic.sun`),v(`usage.mosaic.mon`),v(`usage.mosaic.tue`),v(`usage.mosaic.wed`),v(`usage.mosaic.thu`),v(`usage.mosaic.fri`),v(`usage.mosaic.sat`)].map((e,t)=>({label:e,tokens:r[t]??0}));return{hasData:a,totalTokens:i,hourTotals:n,weekdayTotals:o}}function Yt(e,t,n,r){let i=Jt(e,t),a=Math.max(...i.hourTotals,1),o=Math.max(...i.weekdayTotals.map(e=>e.tokens),1);return Se({title:v(`usage.mosaic.title`),description:i.hasData?v(`usage.mosaic.subtitle`,{zone:v(t===`utc`?`usage.filters.timeZoneUtc`:`usage.filters.timeZoneLocal`)}):v(`usage.mosaic.subtitleEmpty`),actions:j`
        <div class="usage-mosaic-total">
          ${q(i.hasData?i.totalTokens:0)}
          ${G(v(`usage.metrics.tokens`))}
        </div>
      `},j`
      <div class="usage-panel usage-mosaic">
        ${i.hasData?j`
                <div class="usage-mosaic-grid">
                  <div class="usage-mosaic-section">
                    <div class="usage-mosaic-section-title">${v(`usage.mosaic.dayOfWeek`)}</div>
                    <div class="usage-daypart-grid">
                      ${i.weekdayTotals.map(e=>{let t=Math.min(e.tokens/o,1),n=e.tokens>0?`color-mix(in srgb, var(--accent) ${(12+t*60).toFixed(1)}%, transparent)`:`transparent`;return j`
                          <div class="usage-daypart-cell" style="background: ${n};">
                            <div class="usage-daypart-label">${e.label}</div>
                            <div class="usage-daypart-value">${q(e.tokens)}</div>
                          </div>
                        `})}
                    </div>
                  </div>
                  <div class="usage-mosaic-section">
                    <div class="usage-mosaic-section-title">
                      <span>${v(`usage.filters.hours`)}</span>
                      <span class="usage-mosaic-sub">0 → 23</span>
                    </div>
                    <div class="usage-hour-grid">
                      ${i.hourTotals.map((e,t)=>{let i=Math.min(e/a,1),o=e>0?`color-mix(in srgb, var(--accent) ${(8+i*70).toFixed(1)}%, transparent)`:`transparent`,s=`${t}:00 · ${q(e)} ${G(v(`usage.metrics.tokens`))}`,c=i>.7?`color-mix(in srgb, var(--accent) 60%, transparent)`:`color-mix(in srgb, var(--accent) 24%, transparent)`,l=n.includes(t);return j`
                          <button
                            type="button"
                            class="usage-hour-cell ${l?`selected`:``}"
                            style="background: ${o}; border-color: ${c};"
                            title="${s}"
                            aria-label=${s}
                            aria-pressed=${l?`true`:`false`}
                            @click=${e=>r(t,e.shiftKey)}
                          ></button>
                        `})}
                    </div>
                    <div class="usage-hour-labels">
                      <span>${v(`usage.mosaic.midnight`)}</span>
                      <span>${v(`usage.mosaic.fourAm`)}</span>
                      <span>${v(`usage.mosaic.eightAm`)}</span>
                      <span>${v(`usage.mosaic.noon`)}</span>
                      <span>${v(`usage.mosaic.fourPm`)}</span>
                      <span>${v(`usage.mosaic.eightPm`)}</span>
                    </div>
                    <div class="usage-hour-legend">
                      <span></span>
                      ${v(`usage.mosaic.legend`)}
                    </div>
                  </div>
                </div>
              `:j`<div class="usage-empty-block usage-empty-block--compact">
                ${v(`usage.mosaic.noTimelineData`)}
              </div>`}
      </div>
    `)}function Xt(e,t=`local`){let n=t===`utc`?e.getUTCFullYear():e.getFullYear(),r=(t===`utc`?e.getUTCMonth():e.getMonth())+1,i=t===`utc`?e.getUTCDate():e.getDate();return`${n}-${String(r).padStart(2,`0`)}-${String(i).padStart(2,`0`)}`}function Zt(e){let t=Ht(e,`utc`);return t?t.getTime()/an:null}function Qt(e){return new Date(e*an).toISOString().slice(0,10)}function $t(e){let t=Ht(e);return t?t.toLocaleDateString(void 0,{month:`short`,day:`numeric`}):e}function en(e){let t=Ht(e);return t?t.toLocaleDateString(void 0,{month:`long`,day:`numeric`,year:`numeric`}):e}function tn(e,t,n){let r=Zt(t),i=Zt(n);if(r===null||i===null||r>i)return null;let a=K();for(let t of e){let e=Zt(t.date);e!==null&&e>=r&&e<=i&&wt(a,t)}return{days:i-r+1,endDate:n,totals:a}}function nn(e,t,n){let r=Zt(t),i=Zt(n);if(r===null||i===null||r>i)return[];let a=i-r+1;return[1,7,30,90].filter(e=>e<a).map(t=>tn(e,Qt(i-t+1),n)).filter(e=>e!==null)}var rn,an,on,sn;function X(){return(X=e((()=>{F(),Ft(),_e(),i(),ht(),m(),mt(),rn=4,an=864e5,on=(e,t)=>{if(e.length===0)return t??{messages:{total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},tools:{totalCalls:0,uniqueTools:0,tools:[]},byModel:[],byProvider:[],byAgent:[],byChannel:[],daily:[]};let n=Nt();for(let t of e)n.add(t);return n.finish()},sn=(e,t,n)=>{let r=0,i=0;for(let t of e){let e=t.usage?.durationMs??0;e>0&&(r+=e,i+=1)}let a=i?r/i:0,o=t&&r>0?t.totalTokens/(r/6e4):void 0,s=t&&r>0?t.totalCost/(r/6e4):void 0,c=n.messages.total?n.messages.errors/n.messages.total:0;return{durationCount:i,avgDurationMs:a,throughputTokensPerMin:o,throughputCostPerMin:s,errorRate:c}}})))()}function cn(e){return/^[ \t\r\n]*[=+\-@\uFF0B\uFF0D\uFF1D\uFF20]/u.test(e)?`'${e}`:e}function ln(e,t=!0){let n=t?cn(e):e;return/[",\r\n]/.test(n)?`"${n.replaceAll(`"`,`""`)}"`:n}function un(e){return e.map(e=>e==null?``:ln(String(e),typeof e==`string`)).join(`,`)}function dn(e,t){let n=Object.values(t);return[un(Object.keys(t)),...e.map(e=>un(n.map(t=>t(e))))].join(`
`)}function fn(e,t,n,r=12){for(let i of t){if(e.length>=r)break;let t=n(i);t&&!e.includes(t)&&e.push(t)}}function pn(e,t){let n={agent:[],channel:[],provider:[],model:[],tool:[]};return fn(n.agent,e,e=>e.agentId,6),fn(n.channel,e,e=>e.channel),fn(n.provider,e,e=>e.modelProvider),fn(n.provider,e,e=>e.providerOverride),fn(n.provider,t?.byProvider??[],e=>e.provider),fn(n.model,e,e=>e.model),fn(n.model,t?.byModel??[],e=>e.model),fn(n.tool,t?.tools.tools??[],e=>e.name),n}var mn,hn,gn,_n,vn,yn;function bn(){return(bn=e((()=>{oe(),et(),mn=e=>dn(e,{key:e=>e.key,label:e=>e.label,agentId:e=>e.agentId,channel:e=>e.channel,provider:e=>e.modelProvider??e.providerOverride,model:e=>e.model??e.modelOverride,updatedAt:e=>se(e.updatedAt),durationMs:e=>e.usage?.durationMs,messages:e=>e.usage?.messageCounts?.total,errors:e=>e.usage?.messageCounts?.errors,toolCalls:e=>e.usage?.messageCounts?.toolCalls,inputTokens:e=>e.usage?.input,outputTokens:e=>e.usage?.output,cacheReadTokens:e=>e.usage?.cacheRead,cacheWriteTokens:e=>e.usage?.cacheWrite,totalTokens:e=>e.usage?.totalTokens,totalCost:e=>e.usage?.totalCost}),hn=e=>dn(e,{date:e=>e.date,inputTokens:e=>e.input,outputTokens:e=>e.output,cacheReadTokens:e=>e.cacheRead,cacheWriteTokens:e=>e.cacheWrite,totalTokens:e=>e.totalTokens,inputCost:e=>e.inputCost,outputCost:e=>e.outputCost,cacheReadCost:e=>e.cacheReadCost,cacheWriteCost:e=>e.cacheWriteCost,totalCost:e=>e.totalCost}),gn=(e,t)=>{let n=e.trim();if(!n)return[];let r=qe(n).map(e=>e.raw).at(-1)??``,[i,a]=r.includes(`:`)?[r.slice(0,r.indexOf(`:`)),r.slice(r.indexOf(`:`)+1)]:[``,``],o=G(i),s=G(a);if(!o)return[`agent:`,`channel:`,`provider:`,`model:`,`tool:`,`has:errors`,`has:tools`,`minTokens:`,`maxCost:`].map(e=>({label:e,value:e}));let c;switch(o){case`agent`:case`channel`:case`provider`:case`model`:case`tool`:c=t[o].slice(0,6);break;case`has`:c=[`errors`,`tools`,`context`,`usage`,`model`,`provider`];break;default:return[]}return c.filter(e=>!s||G(e).includes(s)).map(e=>({label:`${o}:${e}`,value:`${o}:${e}`}))},_n=(e,t)=>{let n=e.trim();if(!n)return`${t} `;let r=qe(n).map(e=>e.raw);return r[r.length-1]=t,`${r.join(` `)} `},vn=(e,t)=>{let n=qe(e).map(e=>e.raw).filter(e=>e!==t);return n.length?`${n.join(` `)} `:``},yn=(e,t,n)=>{let r=G(t),i=new Map(n.map(e=>[G(e),e])),a=[];for(let t of qe(e))(G(t.key??``)!==r||i.delete(G(t.value)))&&a.push(t.raw);let o=[...a,...Array.from(i.values(),e=>`${t}:${e}`)];return o.length?`${o.join(` `)} `:``}})))()}function xn(e,t,n){return{key:e,className:`usage-token-${e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}`,labelKey:`usage.breakdown.${e}`,hintKey:t,short:n}}function Sn(e,t){return t===0?0:e/t*100}function Cn(e,t,n,r){(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),r(t,e.shiftKey,n))}function wn(e,t){let n=Date.parse(t.startDate),r=(Date.parse(t.endDate)-n)/864e5+1;if(!t.complete||!Number.isInteger(r)||r<1||r>366)return e.toSorted((e,t)=>e.date.localeCompare(t.date));let i=new Map(e.map(e=>[e.date,e]));return Array.from({length:r},(e,t)=>{let r=new Date(n+t*864e5).toISOString().slice(0,10);return i.get(r)??{...K(),date:r}})}function Tn(e,t,n,r,i,a,o){let s=wn(e,o);if(!s.length)return j`
      <div class="daily-chart-compact">
        <div class="card-title usage-section-title">${v(`usage.daily.title`)}</div>
        <div class="usage-empty-block">${v(`usage.empty.noData`)}</div>
      </div>
    `;let c=s.map(e=>e.date),l=n===`tokens`,u=s.map(e=>l?e.totalTokens:e.totalCost),d=Math.max(...u,0),f=d>0?d:l?1:1e-4,p=u.filter(e=>e>0),m=f/(p.length>0?Math.min(...p):f)>50,h=u.map(e=>{if(e<=0)return 0;let t=m?Math.sqrt(e/f):e/f;return Math.max(6,t*200)}),g=s.length>30?12:s.length>20?18:s.length>14?24:32,_=s.length<=14,y=new Set(t);return j`
    <div class="daily-chart-compact">
      <div class="daily-chart-header">
        ${be({mode:`buttons`,variant:`accent`,className:`small sessions-toggle`,value:r,onChange:i,onReselect:i,options:[{value:`total`,label:v(`usage.daily.total`)},{value:`by-type`,label:v(`usage.daily.byType`)}]})}
        <div class="card-title">
          ${v(l?`usage.daily.tokensTitle`:`usage.daily.costTitle`)}
          <div class="card-sub daily-chart-range">
            ${en(o.startDate)} – ${en(o.endDate)}
          </div>
          ${m?j`<span
                  class="daily-chart-scale-badge"
                  title=${v(`usage.daily.compressedScaleHint`)}
                  aria-label=${v(`usage.daily.compressedScaleHint`)}
                  >√</span
                >`:P}
        </div>
      </div>
      <div class="daily-chart">
        <div class="daily-chart-plot">
          <div class="daily-chart-scale" aria-hidden="true">
            ${(d>0?[d,d/(m?4:2),0]:[0]).map(e=>j`<span
                  >${l?q(e):e===0?J(0):Y(e)}</span
                >`)}
          </div>
          <div class="daily-chart-bars" style="--bar-max-width: ${g}px">
            ${s.map((e,t)=>{let n=ae(h[t],`daily usage bar height`),i=y.has(e.date),o=s.length<=14||t%Math.ceil(s.length/6)===0||t===s.length-1?`daily-bar-label`:`daily-bar-label daily-bar-label--hidden`,u=r===`by-type`?Z.map(({key:t,className:n,labelKey:r})=>({value:l?e[t]:e[`${t}Cost`]??0,className:n,labelKey:r})):[],d=u.map(({value:e,labelKey:t})=>`${v(t)} ${l?q(e):Y(e)}`),f=l?q(e.totalTokens):Y(e.totalCost),p=en(e.date),m=`${q(e.totalTokens)} ${G(v(`usage.metrics.tokens`))}`.trim(),g=Y(e.totalCost),b=u.reduce((e,t)=>e+t.value,0)||1;return j`
                <openclaw-tooltip
                  .content=${[p,m,g,...d].join(`
`)}
                >
                  <div
                    class="daily-bar-wrapper ${i?`selected`:``}"
                    role="button"
                    tabindex="0"
                    aria-pressed=${i?`true`:`false`}
                    aria-label=${`${p}: ${m}, ${g}`}
                    @keydown=${t=>Cn(t,e.date,c,a)}
                    @click=${t=>a(e.date,t.shiftKey,c)}
                  >
                    ${r===`by-type`?j`
                            <div
                              class="daily-bar daily-bar--stacked ${n===0?`daily-bar--empty`:``}"
                              style="height: ${n.toFixed(0)}px;"
                            >
                              ${u.map(({className:e,value:t})=>j`
                                  <div
                                    class="cost-segment ${e}"
                                    style="height: ${t/b*100}%"
                                  ></div>
                                `)}
                            </div>
                          `:j`
                            <div
                              class="daily-bar ${n===0?`daily-bar--empty`:``}"
                              style="height: ${n.toFixed(0)}px"
                            ></div>
                          `}
                    ${_?j`<div class="daily-bar-total">${f}</div>`:j`<div
                            class="daily-bar-total daily-bar-total--placeholder"
                            aria-hidden="true"
                          ></div>`}
                    <div class="${o}">${$t(e.date)}</div>
                  </div>
                </openclaw-tooltip>
              `})}
          </div>
        </div>
      </div>
    </div>
  `}function En(e,t){let n=t===`tokens`,r=n?e.totalTokens||1:e.totalCost||0,i=Z.map(({key:t,className:i,labelKey:a})=>{let o=n?e[t]:e[`${t}Cost`]||0;return{className:i,labelKey:a,percentage:Sn(o,r),formatted:n?q(o):Y(o)}});return j`
    <div class="cost-breakdown cost-breakdown-compact">
      <div class="cost-breakdown-header">
        ${v(n?`usage.breakdown.tokensByType`:`usage.breakdown.costByType`)}
      </div>
      <div class="cost-breakdown-bar">
        ${i.map(({className:e,labelKey:t,percentage:n,formatted:r})=>j`
            <div
              class="cost-segment ${e}"
              style="width: ${n.toFixed(1)}%"
              title="${v(t)}: ${r}"
            ></div>
          `)}
      </div>
      <div class="cost-breakdown-legend">
        ${i.map(({className:e,labelKey:t,formatted:n})=>j`
            <span class="legend-item"
              ><span class="legend-dot ${e}"></span>${v(t)} ${n}</span
            >
          `)}
      </div>
      <div class="cost-breakdown-total">
        ${v(`usage.breakdown.total`)}:
        ${n?q(e.totalTokens):Y(e.totalCost)}
      </div>
    </div>
  `}var Z;function Dn(){return(Dn=e((()=>{fe(),F(),_e(),i(),w(),X(),Z=[xn(`output`,`usage.details.assistantOutputTokens`,`Out`),xn(`input`,`usage.details.userToolInputTokens`,`In`),xn(`cacheWrite`,`usage.details.tokensWrittenToCache`,`CW`),xn(`cacheRead`,`usage.details.tokensReadFromCache`,`CR`)]})))()}function On({actor:e}){if(!e)return v(`usage.creators.unattributed`);let t=e.label?.trim()||e.identity?.id||e.id||v(e.type===`system`?`usage.creators.system`:`usage.common.unknown`);return e.identity?.type===`profile`?V({id:e.identity.id,name:t}):t}function kn(e){let t=e.options.toSorted((e,t)=>On(e).localeCompare(On(t))).map(e=>({key:e.key,label:On(e)}));return e.selectedKey!==null&&!t.some(t=>t.key===e.selectedKey)&&t.push({key:e.selectedKey,label:v(`usage.creators.selected`)}),j`
    <select
      class="usage-select usage-creator-filter"
      aria-label=${v(`usage.creators.select`)}
      @change=${t=>{let n=t.currentTarget.value;e.onSelect(n||null)}}
    >
      <option value="" .selected=${e.selectedKey===null}>${v(`usage.creators.all`)}</option>
      ${t.map(t=>j`
          <option value=${t.key} .selected=${t.key===e.selectedKey}>
            ${t.label}
          </option>
        `)}
    </select>
  `}function An(e){let t=t=>e.mode===`tokens`?t.totals.totalTokens:t.totals.totalCost,n=e.groups.toSorted((e,n)=>t(n)-t(e)||On(e).localeCompare(On(n))),r=n.reduce((e,n)=>e+t(n),0),i=n=>j`
    <table class="usage-creators-table">
      <thead>
        <tr>
          <th scope="col">${v(`usage.creators.identity`)}</th>
          <th scope="col">${v(`usage.metrics.tokens`)}</th>
          <th scope="col">${v(`usage.metrics.cost`)}</th>
          <th scope="col">${v(`usage.metrics.sessions`)}</th>
        </tr>
      </thead>
      <tbody>
        ${n.map(n=>j`
            <tr class=${n.key===e.selectedKey?`selected`:``}>
              <th scope="row">
                <button
                  type="button"
                  class="usage-creator-select"
                  aria-pressed=${n.key===e.selectedKey}
                  @click=${()=>e.onSelect(n.key)}
                >
                  <span class="usage-creator-name">
                    <span aria-hidden="true">${ke(n.actor,`row`)}</span>
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
  `;return Se({title:v(`usage.creators.title`),description:v(`usage.creators.description`)},j`
      <div class="usage-panel usage-creators">
        ${n.length>0?i(n.slice(0,8)):j`<div class="usage-empty-block usage-empty-block--compact">
                ${v(`usage.creators.empty`)}
              </div>`}
        ${n.length>8?j`
                <details class="usage-creators-more">
                  <summary>
                    ${v(`usage.creators.more`,{count:String(n.length-8)})}
                  </summary>
                  ${i(n.slice(8))}
                </details>
              `:P}
      </div>
    `)}function jn(){return(jn=e((()=>{F(),he(),_e(),i(),H(),X()})))()}function Mn(e){let{sessionKey:t,displayLabel:n,meta:r,agentId:i,valueLabel:a,isSelected:o,onSelect:s}=e;return j`
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
          ${i?Ee(i):P}
          ${r.length>0?j`<span class="session-bar-meta">${r.join(` · `)}</span>`:P}
        </span>
      </button>
      <div class="session-bar-actions">
        ${L(n,j`<button
            type="button"
            class="btn btn--sm btn--ghost"
            @click=${e=>{e.stopPropagation(),Me(e,n,v(`usage.sessions.copy`))}}
          >
            <span data-copy-label>${v(`usage.sessions.copy`)}</span>
          </button>`)}
        <div class="session-bar-value">${a}</div>
      </div>
    </div>
  `}function Nn(){return(Nn=e((()=>{F(),z(),Ne(),Oe(),i()})))()}function Pn(e,t,n,r,i,a,o,s){if(!(e.length>0||t.length>0||n.length>0))return P;let c=n.at(0)??``,l=n.length===1?r.find(e=>e.key===c):null,u=l?pe(l.label||l.key,20)+((l.label||l.key).length>20?`…`:``):n.length===1?pe(c,8)+`…`:v(`usage.filters.sessionsCount`,{count:String(n.length)}),d=l?l.label||l.key:n.length===1?c:n.join(`, `),f=e.length===1?e[0]:v(`usage.filters.daysCount`,{count:String(e.length)}),p=t.length===1?`${t[0]}:00`:v(`usage.filters.hoursCount`,{count:String(t.length)}),m=[{active:e.length>0,labelKey:`usage.filters.days`,value:f,removeKey:`usage.filters.removeDays`,onClear:i},{active:t.length>0,labelKey:`usage.filters.hours`,value:p,removeKey:`usage.filters.removeHours`,onClear:a},{active:n.length>0,labelKey:`usage.filters.session`,value:u,removeKey:`usage.filters.removeSession`,onClear:o,title:d}];return j`
    <div class="active-filters">
      ${m.filter(({active:e})=>e).map(({labelKey:e,value:t,removeKey:n,onClear:r,title:i})=>j`
            <div class="filter-chip" title=${N(i)}>
              <span class="filter-chip-label">${v(e)}: ${t}</span>
              <openclaw-tooltip .content=${v(`usage.filters.remove`)}>
                <button class="filter-chip-remove" @click=${r} aria-label=${v(n)}>
                  ${O.x}
                </button>
              </openclaw-tooltip>
            </div>
          `)}
      ${(e.length>0||t.length>0)&&n.length>0?j`
              <button class="btn btn--sm" @click=${s}>
                ${v(`usage.filters.clearAll`)}
              </button>
            `:P}
    </div>
  `}function Fn(e,t,n,r){let i=tn(e,t,n);if(!i||e.length===0)return P;let a=nn(e,t,n),o=Xt(new Date,r),s=(e,t)=>e===1?t===o?v(`usage.presets.today`):$t(t):v(`usage.costWindows.lastDays`,{count:String(e)}),c=[{label:v(`usage.costWindows.selectedRange`),summary:i,range:!0},...a.map(e=>({label:s(e.days,e.endDate),summary:e,range:!1}))];return j`
    <section class="cost-window-analysis">
      <div class="cost-window-header">
        <div>
          <div class="card-title usage-section-title">${v(`usage.costWindows.title`)}</div>
          <div class="card-sub">
            ${v(`usage.costWindows.subtitle`,{date:en(n)})}
          </div>
        </div>
        <div class="cost-window-range-label">
          ${$t(t)} – ${$t(n)}
        </div>
      </div>
      <div class="cost-window-grid">
        ${c.map(({label:e,summary:t,range:n})=>{let r=t.totals.totalCost/t.days;return j`
            <div class="cost-window-card ${n?`cost-window-card--range`:``}">
              <div class="cost-window-card__label">${e}</div>
              <div class="cost-window-card__value">
                ${Y(t.totals.totalCost)}
              </div>
              <div class="cost-window-card__meta">
                ${q(t.totals.totalTokens)} ${v(`usage.metrics.tokens`)} ·
                ${Y(r)} ${v(`usage.costWindows.perDay`)}
              </div>
            </div>
          `})}
      </div>
    </section>
  `}function In(e,t,n,r){let i=[`usage-insight-card`,r?.className].filter(Boolean).join(` `),a=[r?.error?`usage-error-list`:`usage-list`,r?.listClassName].filter(Boolean).join(` `);return j`
    <div class=${i}>
      <div class="usage-insight-title">${e}</div>
      ${t.length===0?j`<div class="muted">${n}</div>`:j`
              <div class=${a}>
                ${t.map(e=>r?.error?j`
                        <div class="usage-error-row">
                          <div class="usage-error-date">${e.label}</div>
                          <div class="usage-error-rate">${e.value}</div>
                          ${e.sub?j`<div class="usage-error-sub">${e.sub}</div>`:P}
                        </div>
                      `:j`
                        <div class="usage-list-item">
                          <span
                            >${e.agentId?Ee(e.agentId):e.label}</span
                          >
                          <span class="usage-list-value">
                            <span>${e.value}</span>
                            ${e.sub?j`<span class="usage-list-sub">${e.sub}</span>`:P}
                          </span>
                        </div>
                      `)}
              </div>
            `}
    </div>
  `}function Ln(e){let t=e.currentTarget;t instanceof HTMLElement&&t.focus()}function Q(e){let t=`usage-summary-hint-${e.hintId}`,n=[`stat`,`usage-summary-card`,e.className,e.tone?`usage-summary-card--${e.tone}`:``].filter(Boolean).join(` `),r=[`stat-value`,`usage-summary-value`,e.tone??``,e.compactValue?`usage-summary-value--compact`:``].filter(Boolean).join(` `);return j`
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
  `}function Rn(e,t,n,r,i,a,o,s){if(!e)return P;let c=t.messages.total?Math.round(e.totalTokens/t.messages.total):0,l=t.messages.total?e.totalCost/t.messages.total:0,u=e.input+e.cacheRead+e.cacheWrite,d=u>0?e.cacheRead/u:0,f=u>0?`${(d*100).toFixed(1)}%`:v(`usage.common.emptyValue`),p=n.errorRate*100,m=n.throughputTokensPerMin===void 0?v(`usage.common.emptyValue`):`${q(Math.round(n.throughputTokensPerMin))} ${v(`usage.overview.tokensPerMinute`)}`,h=n.throughputCostPerMin===void 0?v(`usage.common.emptyValue`):`${Y(n.throughputCostPerMin)} ${v(`usage.overview.perMinute`)}`,g=n.durationCount>0?B(n.avgDurationMs)??v(`usage.common.emptyValue`):v(`usage.common.emptyValue`),_=t.daily.filter(e=>e.messages>0&&e.errors>0).map(e=>{let t=e.errors/e.messages;return{label:$t(e.date),value:`${(t*100).toFixed(2)}%`,sub:`${e.errors} ${G(v(`usage.overview.errors`))} · ${e.messages} ${v(`usage.overview.messagesAbbrev`)} · ${q(e.tokens)}`,rate:t}}).toSorted((e,t)=>t.rate-e.rate).slice(0,5).map(({rate:e,...t})=>t),y=t=>i&&e.totalCost>0?v(`usage.overview.costShare`,{percent:(t/e.totalCost*100).toFixed(1)}):null,b=(e,t,n)=>[y(e),q(t),n===void 0?null:`${n} ${v(`usage.overview.messagesAbbrev`)}`].filter(e=>e!==null).join(` · `),x=t.byModel.slice(0,5).map(e=>({label:e.model??v(`usage.common.unknown`),value:Y(e.totals.totalCost),sub:b(e.totals.totalCost,e.totals.totalTokens,e.count)})),S=t.byProvider.slice(0,5).map(e=>({label:e.provider??v(`usage.common.unknown`),value:Y(e.totals.totalCost),sub:b(e.totals.totalCost,e.totals.totalTokens,e.count)})),C=t.tools.tools.slice(0,6).map(e=>({label:e.name,value:`${e.count}`,sub:v(`usage.overview.calls`)})),w=t.byAgent.slice(0,5).map(e=>({label:e.agentId,agentId:e.agentId,value:Y(e.totals.totalCost),sub:b(e.totals.totalCost,e.totals.totalTokens)})),T=t.byChannel.slice(0,5).map(e=>({label:e.channel,value:Y(e.totals.totalCost),sub:b(e.totals.totalCost,e.totals.totalTokens)})),E=[[`usage.overview.topModels`,x,`usage.overview.noModelData`],[`usage.overview.topProviders`,S,`usage.overview.noProviderData`],[`usage.overview.topTools`,C,`usage.overview.noToolCalls`],[`usage.overview.topAgents`,w,`usage.overview.noAgentData`],[`usage.overview.topChannels`,T,`usage.overview.noChannelData`]];return Se({title:v(`usage.overview.title`)},j`
      <section class="usage-panel usage-overview-card">
        <div class="usage-overview-layout">
          <div class="usage-summary-grid">
            ${Q({hintId:`messages`,title:v(`usage.overview.messages`),hint:v(`usage.overview.messagesHint`),value:t.messages.total,sub:`${t.messages.user} ${G(v(`usage.overview.user`))} · ${t.messages.assistant} ${G(v(`usage.overview.assistant`))}`,className:`usage-summary-card--hero`})}
            ${Q({hintId:`throughput`,title:v(`usage.overview.throughput`),hint:v(`usage.overview.throughputHint`),value:m,sub:h,className:`usage-summary-card--hero usage-summary-card--throughput`,compactValue:!0})}
            ${Q({hintId:`tool-calls`,title:v(`usage.overview.toolCalls`),hint:v(`usage.overview.toolCallsHint`),value:t.tools.totalCalls,sub:`${t.tools.uniqueTools} ${v(`usage.overview.toolsUsed`)}`,className:`usage-summary-card--half`})}
            ${Q({hintId:`average-tokens`,title:v(`usage.overview.avgTokens`),hint:v(`usage.overview.avgTokensHint`),value:q(c),sub:v(`usage.overview.acrossMessages`,{count:String(t.messages.total||0)}),className:`usage-summary-card--half`})}
            ${Q({hintId:`cache-hit-rate`,title:v(`usage.overview.cacheHitRate`),hint:v(`usage.overview.cacheHint`),value:f,sub:`${q(e.cacheRead)} ${v(`usage.overview.cached`)} · ${q(u)} ${v(`usage.overview.prompt`)}`,tone:d>.6?`good`:d>.3?`warn`:`bad`,className:`usage-summary-card--medium`})}
            ${Q({hintId:`error-rate`,title:v(`usage.overview.errorRate`),hint:v(`usage.overview.errorHint`),value:`${p.toFixed(2)}%`,sub:`${t.messages.errors} ${G(v(`usage.overview.errors`))} · ${g} ${v(`usage.overview.avgSession`)}`,tone:p>5?`bad`:p>1?`warn`:`good`,className:`usage-summary-card--medium`})}
            ${Q({hintId:`average-cost`,title:v(`usage.overview.avgCost`),hint:v(r?`usage.overview.avgCostHintMissing`:`usage.overview.avgCostHint`),value:Y(l),sub:`${Y(e.totalCost)} ${G(v(`usage.breakdown.total`))}`,className:`usage-summary-card--compact`})}
            ${Q({hintId:`sessions`,title:v(`usage.overview.sessions`),hint:v(`usage.overview.sessionsHint`),value:o,sub:v(`usage.overview.sessionsInRange`,{count:String(s)}),className:`usage-summary-card--compact`})}
            ${Q({hintId:`errors`,title:v(`usage.overview.errors`),hint:v(`usage.overview.errorsHint`),value:t.messages.errors,sub:`${t.messages.toolResults} ${v(`usage.overview.toolResults`)}`,className:`usage-summary-card--compact`})}
          </div>
          <div class="usage-insights-grid">
            ${E.map(([e,t,n])=>In(v(e),t,v(n)))}
            ${In(v(`usage.overview.peakErrorDays`),_,v(`usage.overview.noErrorData`),{error:!0})}
            ${In(v(`usage.overview.peakErrorHours`),a,v(`usage.overview.noErrorData`),{error:!0,className:`usage-insight-card--wide`,listClassName:`usage-error-list--hours`})}
          </div>
        </div>
      </section>
    `)}function zn(e,t,n,r,i,a,o,s,c,l,u,d,f,p){let m=e=>{let t=e.label||e.key;return t.startsWith(`agent:`)&&t.includes(`?token=`)?t.slice(0,t.indexOf(`?token=`)):t},h=e=>[e.channel&&`channel:${e.channel}`,(e.modelProvider||e.providerOverride)&&`provider:${e.modelProvider??e.providerOverride}`,e.model&&`model:${e.model}`,e.usage?.messageCounts&&`msgs:${e.usage.messageCounts.total}`,e.usage?.toolUsage&&`tools:${e.usage.toolUsage.totalCalls}`,e.usage?.messageCounts&&`errors:${e.usage.messageCounts.errors}`,e.usage?.durationMs&&`dur:${B(e.usage.durationMs)??`—`}`].filter(e=>typeof e==`string`&&e.length>0),g=new Set(n),_=e.map(e=>{let t=e.usage,n=t?.totalTokens??0,a=t?.totalCost??0,o=g.size>0?t?.dailyBreakdown:void 0;if(o?.length){n=0,a=0;for(let e of o)g.has(e.date)&&(n+=e.tokens,a+=e.cost)}return{session:e,displayLabel:m(e),value:r?n:a,sortValue:{recent:e.updatedAt??0,messages:t?.messageCounts?.total??0,errors:t?.messageCounts?.errors??0,cost:a,tokens:n}[i]}}).toSorted((e,t)=>{let n=t.sortValue-e.sortValue;if(n!==0)return n;let r=(t.session.updatedAt??0)-(e.session.updatedAt??0);return r===0?e.displayLabel.localeCompare(t.displayLabel):r}),y=a===`asc`?_.toReversed():_,b=y.reduce((e,t)=>e+t.value,0),x=y.length?b/y.length:0,S=y.reduce((e,t)=>e+(t.session.usage?.messageCounts?.errors??0),0),C=new Set(t),w=y.filter(e=>C.has(e.session.key)),T=w.length,E=new Map(y.map(e=>[e.session.key,e])),D=o.map(e=>E.get(e)).filter(e=>e!==void 0),O=s===`recent`?D:y.slice(0,50),k=e=>{let t=e.map(e=>e.session.key);return e.map(e=>Mn({sessionKey:e.session.key,displayLabel:e.displayLabel,meta:h(e.session),agentId:e.session.agentId,valueLabel:r?q(e.value):Y(e.value),isSelected:C.has(e.session.key),onSelect:n=>c(e.session.key,n.shiftKey,t)}))};return Se({title:v(`usage.sessions.title`)},j`
      <div class="usage-panel sessions-card">
        <div class="sessions-card-header">
          <div class="sessions-card-count">
            ${v(`usage.sessions.shown`,{count:String(O.length)})}
            ${f===O.length?``:` · ${v(`usage.sessions.total`,{count:String(f)})}`}
          </div>
        </div>
        <div class="sessions-card-meta">
          <div class="sessions-card-stats">
            <span>
              ${r?q(x):Y(x)}
              ${v(`usage.sessions.avg`)}
            </span>
            <span
              >${S} ${G(v(`usage.overview.errors`))}</span
            >
          </div>
          ${be({mode:`buttons`,variant:`accent`,ariaPressed:!1,className:`small`,value:s,onChange:d,onReselect:d,options:[{value:`all`,label:v(`usage.sessions.all`)},{value:`recent`,label:v(`usage.sessions.recent`)}]})}
          <label class="sessions-sort">
            <span>${v(`usage.sessions.sort`)}</span>
            <select
              class="settings-select"
              @change=${e=>l(e.target.value)}
            >
              ${Object.entries({cost:`usage.metrics.cost`,errors:`usage.overview.errors`,messages:`usage.overview.messages`,recent:`usage.sessions.recentShort`,tokens:`usage.metrics.tokens`}).map(([e,t])=>j`<option value=${e} ?selected=${i===e}>
                    ${v(t)}
                  </option>`)}
            </select>
          </label>
          <openclaw-tooltip
            .content=${v(a===`desc`?`usage.sessions.descending`:`usage.sessions.ascending`)}
          >
            <button
              class="btn btn--sm"
              aria-label=${v(a===`desc`?`usage.sessions.descending`:`usage.sessions.ascending`)}
              @click=${()=>u(a===`desc`?`asc`:`desc`)}
            >
              ${a===`desc`?`↓`:`↑`}
            </button>
          </openclaw-tooltip>
          ${T>0?j`
                  <button class="btn btn--sm" @click=${p}>
                    ${v(`usage.sessions.clearSelection`)}
                  </button>
                `:P}
        </div>
        ${O.length===0?j`<div class="usage-empty-block">
                ${v(s===`recent`?`usage.sessions.noRecent`:`usage.sessions.noneInRange`)}
              </div>`:j`
                <div
                  class=${s===`recent`?`session-bars session-bars--recent`:`session-bars`}
                >
                  ${k(O)}
                  ${s===`all`&&e.length>O.length?j`
                          <div class="usage-more-sessions">
                            ${v(`usage.sessions.more`,{count:String(e.length-O.length)})}
                          </div>
                        `:P}
                </div>
              `}
        ${T>1?j`
                <div class="sessions-selected-group">
                  <div class="sessions-card-count">
                    ${v(`usage.sessions.selected`,{count:String(T)})}
                  </div>
                  <div class="session-bars session-bars--selected">
                    ${k(w)}
                  </div>
                </div>
              `:P}
      </div>
    `)}function Bn(){return(Bn=e((()=>{F(),M(),Ne(),k(),_e(),i(),w(),re(),X(),Nn()})))()}function Vn(e,t,n){let r=t||e.usage;if(!r)return j` <div class="usage-empty-block">${v(`usage.details.noUsageData`)}</div> `;let i=e=>e?l(e):v(`usage.common.emptyValue`),a=n!==void 0,o=n?.filter(e=>e.timestamp>0),s=a?o?.length?o.reduce((e,{role:t})=>((t===`user`||t===`assistant`)&&(e[t]+=1,e.total+=1),e),{total:0,user:0,assistant:0}):void 0:r.messageCounts,c=[e.channel&&`channel:${e.channel}`,e.agentId&&`agent:${e.agentId}`,(e.modelProvider||e.providerOverride)&&`provider:${e.modelProvider??e.providerOverride}`,e.model&&`model:${e.model}`].filter(Boolean),u=r.toolUsage?.tools.slice(0,6)??[],d;if(o?.length){d=new Map;for(let e of o.filter(({role:e})=>e===`assistant`))for(let[t,n]of Je(e.content).tools)d.set(t,(d.get(t)??0)+n)}let f=u.map(e=>({label:e.name,value:`${d?d.get(e.name)??0:a?v(`usage.common.emptyValue`):e.count}`,sub:v(`usage.overview.calls`)})),p=d?[...d.values()].reduce((e,t)=>e+t,0):a?v(`usage.common.emptyValue`):r.toolUsage?.totalCalls??0,m=d?d.size:a?v(`usage.common.emptyValue`):r.toolUsage?.uniqueTools??0,h=r.modelUsage?.slice(0,6).map(e=>({label:e.model??v(`usage.common.unknown`),value:J(e.totals.totalCost),sub:q(e.totals.totalTokens)}))??[],g=[{labelKey:`usage.overview.messages`,value:s?.total??(a?v(`usage.common.emptyValue`):0),meta:j`${a&&!s?v(`usage.common.emptyValue`):j`${s?.user??0}
            ${G(v(`usage.overview.user`))} ·
            ${s?.assistant??0}
            ${G(v(`usage.overview.assistant`))}`}${a?j`<br />${v(`usage.details.loadedIntervalMessages`)}`:P}`},{labelKey:`usage.overview.toolCalls`,value:p,meta:j`${m} ${v(`usage.overview.toolsUsed`)}`},{labelKey:`usage.overview.errors`,value:a?v(`usage.common.emptyValue`):r.messageCounts?.errors??0,meta:j`${a?v(`usage.common.emptyValue`):r.messageCounts?.toolResults??0}
      ${v(`usage.overview.toolResults`)}`},{labelKey:`usage.details.duration`,value:B(r.durationMs)??v(`usage.common.emptyValue`),meta:j`${i(r.firstActivity)} → ${i(r.lastActivity)}`}];return j`
    ${c.length>0?j`<div class="usage-badges">
            ${c.map(e=>j`<span class="settings-row__value">${e}</span>`)}
          </div>`:P}
    <div class="session-summary-grid">
      ${g.map(({labelKey:e,value:t,meta:n})=>j`
          <div class="stat session-summary-card">
            <div class="session-summary-title">${v(e)}</div>
            <div class="stat-value session-summary-value">${t}</div>
            <div class="session-summary-meta">${n}</div>
          </div>
        `)}
    </div>
    <div class="usage-insights-grid usage-insights-grid--tight">
      ${In(v(`usage.overview.topTools`),f,v(`usage.overview.noToolCalls`))}
      ${In(v(`usage.details.modelMix`),h,v(`usage.overview.noModelData`))}
    </div>
  `}function Hn(){return(Hn=e((()=>{F(),i(),re(),m(),et(),X(),Bn()})))()}function Un(e,t,n){let r=Number(e.slice(0,4)),i=Number(e.slice(5,7))-1,a=Number(e.slice(8,10))+n;return t===`utc`?Date.UTC(r,i,a):new Date(r,i,a).getTime()}function Wn(e,n,{startDate:r,endDate:i,selectedDays:a,timeZone:o}){let{timeSeries:s,timeSeriesLoading:c,timeSeriesStatus:l,timeSeriesMode:u,timeSeriesBreakdownMode:d,timeSeriesCursorStart:p,timeSeriesCursorEnd:m}=e;if((c||l.awaitingGateway)&&!l.hasLoaded)return j`
      <div class="session-timeseries-compact">
        <div class="usage-empty-block">${v(`usage.loading.badge`)}</div>
      </div>
    `;let h=St(l,`usage.details.usageOverTime`,`timeline`);if(l.error&&!l.hasLoaded)return j`
      <div class="session-timeseries-compact">
        <div class="card-title usage-section-title">${v(`usage.details.usageOverTime`)}</div>
        ${h}
      </div>
    `;if(!s||s.points.length<2)return j`
      <div class="session-timeseries-compact">
        ${h}
        <div class="usage-empty-block">${v(`usage.details.noTimeline`)}</div>
      </div>
    `;let g=s.points;if(r||i||a&&a.length>0){let e=r?Un(r,o,0):0,t=i?Un(i,o,1):1/0,n=a?.length?new Set(a):void 0;g=s.points.filter(r=>r.timestamp<e||r.timestamp>=t?!1:!n||n.has(Xt(new Date(r.timestamp),o)))}if(g.length<2)return j`
      <div class="session-timeseries-compact">
        ${h}
        <div class="usage-empty-block">${v(`usage.details.noDataInRange`)}</div>
      </div>
    `;let _=0,y=0;g=g.map(e=>(_+=e.totalTokens,y+=e.cost,{...e,cumulativeTokens:_,cumulativeCost:y}));let b=p!=null&&m!=null,x=b?Math.min(p,m):0,S=b?Math.max(p,m):1/0,C=0,w=g.length;if(b){C=g.findIndex(e=>e.timestamp>=x),C===-1&&(C=g.length);let e=g.findIndex(e=>e.timestamp>S);w=e===-1?g.length:e}let T=b?g.slice(C,w):g,E={output:0,input:0,cacheRead:0,cacheWrite:0};for(let e of T)for(let{key:t}of Z)E[t]+=e[t];let D={top:8,right:4,bottom:14,left:30},O=400-D.left-D.right,k=100-D.top-D.bottom,ee=u===`cumulative`,A=u===`per-turn`&&d===`by-type`,M=o===`utc`?{timeZone:`UTC`}:{},N=t({month:`short`,day:`numeric`,hour:`2-digit`,minute:`2-digit`,...M},``),F=Object.values(E).reduce((e,t)=>e+t,0),I=g.map(e=>ee?e.cumulativeTokens:A?e.input+e.output+e.cacheRead+e.cacheWrite:e.totalTokens),L=Math.max(...I,1),te=O/g.length,z=Math.min(Kn,Math.max(1,te*Gn)),ne=te-z,B=D.left+C*(z+ne),re=D.left+(Math.min(w,g.length)-1)*(z+ne)+z,ie=ae(g[0],`time series first point`).timestamp,V=ae(g.at(-1),`time series last point`).timestamp,H=Math.max(ie,Math.min(V,x)),U=Math.max(ie,Math.min(V,S)),oe=(e,t)=>{n.onTimeSeriesCursorRangeChange?.(e===`left`?Math.max(ie,Math.min(t,U)):H,e===`right`?Math.min(V,Math.max(t,H)):U)},se=(e,t)=>{let n=t===`left`?H:U,r=t===`left`?ie:H,i=t===`left`?U:V,a;switch(e.key){case`ArrowLeft`:case`ArrowDown`:a=g.findLast(e=>e.timestamp<n)?.timestamp??r;break;case`ArrowRight`:case`ArrowUp`:a=g.find(e=>e.timestamp>n)?.timestamp??i;break;case`Home`:a=r;break;case`End`:a=i;break;default:return}e.preventDefault(),oe(t,a)};return j`
    <div class="session-timeseries-compact">
      <div class="timeseries-header-row">
        <div class="card-title usage-section-title">${v(`usage.details.usageOverTime`)}</div>
        <div class="timeseries-controls">
          ${b?j`
                  <div class="settings-segmented settings-segmented--accent small">
                    <button
                      class="btn btn--sm settings-segmented__btn settings-segmented__btn--active"
                      @click=${()=>n.onTimeSeriesCursorRangeChange?.(null,null)}
                    >
                      ${v(`usage.details.reset`)}
                    </button>
                  </div>
                `:P}
          ${be({mode:`buttons`,variant:`accent`,className:`small`,value:u,onChange:n.onTimeSeriesModeChange,onReselect:n.onTimeSeriesModeChange,options:[{value:`per-turn`,label:v(`usage.details.perTurn`)},{value:`cumulative`,label:v(`usage.details.cumulative`)}]})}
          ${ee?P:be({mode:`buttons`,variant:`accent`,className:`small`,value:d,onChange:n.onTimeSeriesBreakdownChange,onReselect:n.onTimeSeriesBreakdownChange,options:[{value:`total`,label:v(`usage.daily.total`)},{value:`by-type`,label:v(`usage.daily.byType`)}]})}
        </div>
      </div>
      ${h}
      <div class="timeseries-chart-wrapper">
        <svg viewBox="0 0 ${400} ${118}" class="timeseries-svg">
          ${[{x1:D.left,y1:D.top,x2:D.left,y2:D.top+k},{x1:D.left,y1:D.top+k,x2:400-D.right,y2:D.top+k}].map(({x1:e,y1:t,x2:n,y2:r})=>R`<line x1="${e}" y1="${t}" x2="${n}" y2="${r}" stroke="var(--border)" />`)}
          ${[{y:D.top+5,text:q(L)},{y:D.top+k,text:`0`}].map(({y:e,text:t})=>R`<text x="${D.left-4}" y="${e}" text-anchor="end" class="ts-axis-label">${t}</text>`)}
          ${R`
            <text x="${D.left}" y="${D.top+k+10}" text-anchor="start" class="ts-axis-label">${f(ie,{hour:`2-digit`,minute:`2-digit`,...M},``)}</text>
            <text x="${400-D.right}" y="${D.top+k+10}" text-anchor="end" class="ts-axis-label">${f(V,{hour:`2-digit`,minute:`2-digit`,...M},``)}</text>
          `}
          ${g.map((e,t)=>{let n=ae(I[t],`time series bar total`),r=D.left+t*(z+ne),i=n/L*k,a=D.top+k-i,o=[N(e.timestamp),`${q(n)} ${G(v(`usage.metrics.tokens`))}`];A&&o.push(...Z.map(({key:t,short:n})=>`${n} ${q(e[t])}`));let s=o.join(` · `),c=b&&(t<C||t>=w);if(!A)return R`<rect x="${r}" y="${a}" width="${z}" height="${i}" class="ts-bar${c?` dimmed`:``}" rx="1" role="img" data-tooltip=${s} aria-label=${s}></rect>`;let l=D.top+k,u=c?` dimmed`:``;return R`
              ${Z.map(({key:t,className:a})=>{let o=e[t];if(o<=0||n<=0)return P;let c=o/n*i;return l-=c,R`<rect x="${r}" y="${l}" width="${z}" height="${c}" class="ts-bar ${a}${u}" rx="1" role="img" data-tooltip=${s} aria-label=${s}></rect>`})}
            `})}
          <!-- Selection highlight overlay (always visible between handles) -->
          ${R`
            <rect
              x="${B}"
              y="${D.top}"
              width="${Math.max(1,re-B)}"
              height="${k}"
              fill="var(--accent)"
              opacity="${qn}"
              pointer-events="none"
            />
          `}
          ${[B,re].map(e=>R`
              <line x1="${e}" y1="${D.top}" x2="${e}" y2="${D.top+k}" stroke="var(--accent)" stroke-width="0.8" opacity="0.7" />
              <rect x="${e-Jn/2}" y="${D.top+k/2-Yn/2}" width="${Jn}" height="${Yn}" rx="1.5" fill="var(--accent)" class="cursor-handle" />
              ${[-.7,Xn].map(t=>R`<line x1="${e+t}" y1="${D.top+k/2-Yn/5}" x2="${e+t}" y2="${D.top+k/2+Yn/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />`)}
            `)}
        </svg>
        <!-- Handle drag zones (only on handles, not full chart) -->
        ${(()=>{let e=e=>t=>{if(!n.onTimeSeriesCursorRangeChange||!(t.currentTarget instanceof HTMLElement))return;t.preventDefault(),t.stopPropagation();let r=t.currentTarget.closest(`.timeseries-chart-wrapper`)?.querySelector(`svg`);if(!r)return;let i=r.getBoundingClientRect(),a=i.width,o=D.left/400*a,s=(400-D.right)/400*a-o,c=e=>{let t=Math.max(0,Math.min(1,(e-i.left-o)/s));return Math.min(Math.floor(t*g.length),g.length-1)},l=e===`left`?B:re,u=i.left+l/400*a,d=t.clientX-u;document.body.style.cursor=`col-resize`;let f=t=>{let n=t.clientX-d,r=c(n),i=g[r];i&&oe(e,i.timestamp)},p=()=>{document.body.style.cursor=``,document.removeEventListener(`mousemove`,f),document.removeEventListener(`mouseup`,p)};document.addEventListener(`mousemove`,f),document.addEventListener(`mouseup`,p)};return j`
            ${[`left`,`right`].map(t=>{let n=t===`left`?B:re;return j`<div
                class="chart-handle-zone chart-handle-${t}"
                role="slider"
                tabindex="0"
                aria-label=${v(t===`left`?`usage.details.rangeStart`:`usage.details.rangeEnd`)}
                aria-valuemin=${t===`left`?ie:H}
                aria-valuemax=${t===`left`?U:V}
                aria-valuenow=${t===`left`?H:U}
                aria-valuetext=${N(t===`left`?H:U)}
                style="left: ${(n/400*100).toFixed(1)}%;"
                @mousedown=${e(t)}
                @keydown=${e=>se(e,t)}
              ></div>`})}
          `})()}
      </div>
      <div class="timeseries-summary">
        ${b?j`
                <span class="timeseries-summary__range">
                  ${v(`usage.details.turnRange`,{start:String(C+1),end:String(w),total:String(g.length)})}
                </span>
                ·
                ${f(x,{hour:`2-digit`,minute:`2-digit`,...M},``)}–${f(S,{hour:`2-digit`,minute:`2-digit`,...M},``)}
                · ${q(F)} ·
                ${J(T.reduce((e,t)=>e+(t.cost||0),0))}
              `:j`${g.length} ${v(`usage.overview.messagesAbbrev`)} ·
              ${q(_)} · ${J(y)}`}
      </div>
      ${A?j`
              <div class="timeseries-breakdown">
                <div class="card-title usage-section-title">
                  ${v(`usage.breakdown.tokensByType`)}
                </div>
                <div class="cost-breakdown-bar cost-breakdown-bar--compact">
                  ${Z.map(({key:e,className:t})=>j`
                      <div
                        class="cost-segment ${t}"
                        style="width: ${(F>0?E[e]/F*100:0).toFixed(1)}%"
                      ></div>
                    `)}
                </div>
                <div class="cost-breakdown-legend">
                  ${Z.map(({key:e,className:t,labelKey:n,hintKey:r})=>j`
                      <div class="legend-item" title=${v(r)}>
                        <span class="legend-dot ${t}"></span>${v(n)}
                        ${q(E[e])}
                      </div>
                    `)}
                </div>
                <div class="cost-breakdown-total">
                  ${v(`usage.breakdown.total`)}: ${q(F)}
                </div>
              </div>
            `:P}
    </div>
  `}var Gn,Kn,qn,Jn,Yn,Xn;function Zn(){return(Zn=e((()=>{fe(),F(),_e(),i(),m(),X(),Ct(),Dn(),Gn=.75,Kn=8,qn=.06,Jn=5,Yn=12,Xn=.7})))()}function Qn(e,t){return t>0?e/t*100:0}function $n(e){return e<0xe8d4a51000?e*1e3:e}function er(e,t,n){if(!(e.timestamp>0))return!0;let r=$n(e.timestamp);return r>=Math.min(t,n)&&r<=Math.max(t,n)}function tr(e,t,n,r){let i=Math.min(n,r),a=Math.max(n,r),o=t.filter(e=>e.timestamp>=i&&e.timestamp<=a);if(o.length===0)return;let s=0,c=0,l={output:0,input:0,cacheWrite:0,cacheRead:0};for(let e of o){s+=e.totalTokens||0,c+=e.cost||0;for(let{key:t}of Z)l[t]+=e[t]||0}let u=ae(o[0],`filtered usage first point`),d=ae(o.at(-1),`filtered usage last point`);return{...e,...l,totalTokens:s,totalCost:c,durationMs:d.timestamp-u.timestamp,firstActivity:u.timestamp,lastActivity:d.timestamp,messageCounts:void 0}}function nr(e,t,n,r,i,a){let o=e.label||e.key,s=o.length>50?pe(o,50)+`…`:o,c=e.usage,{timeSeriesCursorStart:l,timeSeriesCursorEnd:u}=t,d=l!==null&&u!==null,f=l!==null&&u!==null&&t.timeSeries?.points&&c?tr(c,t.timeSeries.points,l,u):void 0,p=f?{totalTokens:f.totalTokens,totalCost:f.totalCost}:{totalTokens:c?.totalTokens??0,totalCost:c?.totalCost??0},m=f?v(`usage.details.filtered`):``;return j`
    <div class="settings-group usage-panel session-detail-panel">
      <div class="session-detail-header">
        <div class="session-detail-header-left">
          <div class="session-detail-title">
            ${s}
            ${m?j`<span class="session-detail-indicator">${m}</span>`:P}
          </div>
        </div>
        <div class="session-detail-stats">
          ${c?j`
                  <span
                    ><strong>${q(p.totalTokens)}</strong>
                    ${G(v(`usage.metrics.tokens`))}${m}</span
                  >
                  <span
                    ><strong>${J(p.totalCost)}</strong
                    >${m}</span
                  >
                `:P}
        </div>
        <openclaw-tooltip .content=${v(`usage.details.close`)}>
          <button
            class="btn btn--sm btn--ghost session-detail-close"
            @click=${a}
            aria-label=${v(`usage.details.close`)}
          >
            ${O.x}
          </button>
        </openclaw-tooltip>
      </div>
      ${e.scope===`family`&&e.includedSessionIds?.length?j`
              <div class="usage-lineage-note">
                ${v(`usage.scope.familyIncluded`,{count:String(e.includedSessionIds.length)})}
              </div>
            `:P}
      <div class="session-detail-content">
        ${Vn(e,f,d?t.sessionLogsStatus.hasLoaded&&t.sessionLogs?t.sessionLogs.filter(e=>er(e,l,u)):null:void 0)}
        <div class="session-detail-row">${Wn(t,n,r)}</div>
        <div class="session-detail-bottom">
          ${ir(t,n)}
          ${rr(t.context,c,i,n.onToggleContextExpanded)}
        </div>
      </div>
    </div>
  `}function rr({weight:e,loading:t,status:n},r,i,a){let o=St(n,`usage.details.systemPromptBreakdown`,`context`);if(!e)return j`
      <div class="context-details-panel">
        ${o}
        ${n.error?P:j`<div class="usage-empty-block">
                ${v(t||n.awaitingGateway?`usage.loading.badge`:`usage.details.noContextData`)}
              </div>`}
      </div>
    `;let s=[{className:`skills`,labelKey:`usage.details.skills`,tokens:It(e.skills.promptChars),entries:e.skills.entries.map(({name:e,blockChars:t})=>({name:e,chars:t}))},{className:`tools`,labelKey:`usage.details.tools`,tokens:It(e.tools.listChars+e.tools.schemaChars),entries:e.tools.entries.map(({name:e,summaryChars:t,schemaChars:n})=>({name:e,chars:t+n}))},{className:`files`,labelKey:`usage.details.files`,tokens:It(e.injectedWorkspaceFiles.reduce((e,t)=>t.injectionStatus===`native_unverified`?e:e+t.injectedChars,0)),entries:e.injectedWorkspaceFiles.map(({name:e,injectedChars:t})=>({name:e,chars:t}))}].map(({className:e,labelKey:t,tokens:n,entries:r})=>({className:e,labelKey:t,tokens:n,entries:r.toSorted((e,t)=>e.chars===null?t.chars===null?0:1:t.chars===null?-1:t.chars-e.chars)})),c=[{className:`system`,labelKey:`usage.details.system`,tokens:It(e.systemPrompt.chars)},...s],l=c.reduce((e,{tokens:t})=>e+t,0),u=r&&r.totalTokens>0?r.input+r.cacheRead:0,d=u>0?`~${Math.min(l/u*100,100).toFixed(0)}% ${v(`usage.details.ofInput`)}`:v(`usage.details.baseContextPerMessage`),f=s.some(({entries:e})=>e.length>4);return j`
    <div class="context-details-panel">
      ${o}
      <div class="context-breakdown-header">
        <div class="card-title usage-section-title">
          ${v(`usage.details.systemPromptBreakdown`)}
        </div>
        ${f?j`<button class="btn btn--sm" @click=${a}>
                ${v(i?`usage.details.collapse`:`usage.details.expandAll`)}
              </button>`:P}
      </div>
      <p class="context-weight-desc">${d}</p>
      <div class="context-stacked-bar">
        ${c.map(({className:e,labelKey:t,tokens:n})=>j`
            <div
              class="context-segment ${e}"
              style="width: ${Qn(n,l).toFixed(1)}%"
              title="${v(t)}: ~${q(n)}"
            ></div>
          `)}
      </div>
      <div class="context-legend">
        ${c.map(({className:e,labelKey:t,tokens:n})=>j`
            <span class="legend-item"
              ><span class="legend-dot ${e}"></span>${v(e===`system`?`usage.details.systemShort`:t)}
              ~${q(n)}</span
            >
          `)}
      </div>
      <div class="context-total">
        ${v(`usage.breakdown.total`)}: ~${q(l)}
      </div>
      <div class="context-breakdown-grid">
        ${s.filter(({entries:e})=>e.length>0).map(({labelKey:e,entries:t})=>{let n=i?t:t.slice(0,4),r=t.length-n.length;return j`
              <div class="context-breakdown-card">
                <div class="context-breakdown-title">${v(e)} (${t.length})</div>
                <div class="context-breakdown-list">
                  ${n.map(({name:e,chars:t})=>j`
                      <div class="context-breakdown-item">
                        <span class="mono" title=${e}>${e}</span>
                        <span class="muted"
                          >${t===null?v(`usage.common.unknown`):`~${q(It(t))}`}</span
                        >
                      </div>
                    `)}
                </div>
                ${r>0?j`
                        <div class="context-breakdown-more">
                          ${v(`usage.sessions.more`,{count:String(r)})}
                        </div>
                      `:P}
              </div>
            `})}
      </div>
    </div>
  `}function ir(e,n){let{sessionLogs:r,sessionLogsLoading:i,sessionLogsStatus:a,sessionLogsExpanded:o,logFilters:s,timeSeriesCursorStart:c,timeSeriesCursorEnd:l}=e,u=(i||a.awaitingGateway)&&!a.hasLoaded,d=a.error&&!a.hasLoaded,f=u?P:St(a,`usage.details.conversation`,`conversation`);if(u||d||!r?.length){let e=u?`usage.loading.badge`:`usage.details.noMessages`;return j`
      <div class="session-logs-compact">
        <div class="session-logs-header">${v(`usage.details.conversation`)}</div>
        ${f}
        ${u||!d?j`<div class="usage-empty-block">${v(e)}</div>`:P}
      </div>
    `}let p=t(),m=G(s.query),h=r.map(e=>{let t=Je(e.content);return{log:e,toolInfo:t,cleanContent:t.cleanContent||e.content}}),g=Array.from(new Set(h.flatMap(e=>e.toolInfo.tools.map(([e])=>e)))).toSorted((e,t)=>e.localeCompare(t)),_=c!=null&&l!=null,y=h.filter(e=>(!_||er(e.log,c,l))&&(s.roles.length===0||s.roles.includes(e.log.role))&&(!s.hasTools||e.toolInfo.tools.length>0)&&(s.tools.length===0||e.toolInfo.tools.some(([e])=>s.tools.includes(e)))&&(!m||G(e.cleanContent).includes(m))),b=s.roles.length>0||s.tools.length>0||s.hasTools||m||_?`${y.length} ${v(`usage.details.of`)} ${r.length}${_?` (${v(`usage.details.timelineFiltered`)})`:``}`:`${r.length}`,x=new Set(s.roles),S=new Set(s.tools);return j`
    <div class="session-logs-compact">
      <div class="session-logs-header">
        <span>
          ${v(`usage.details.conversation`)}
          <span class="session-logs-header-count">
            (${b} ${G(v(`usage.overview.messages`))})
          </span>
        </span>
        <button class="btn btn--sm" @click=${n.onToggleSessionLogsExpanded}>
          ${v(o?`usage.details.collapseAll`:`usage.details.expandAll`)}
        </button>
      </div>
      ${f}
      <div class="usage-filters-inline session-log-filters">
        <select
          multiple
          size="4"
          aria-label=${v(`usage.details.filterByRole`)}
          @change=${e=>n.onLogFilterRolesChange(Array.from(e.target.selectedOptions).map(e=>e.value))}
        >
          ${[[`user`,`usage.overview.user`],[`assistant`,`usage.overview.assistant`],[`tool`,`usage.details.tool`],[`toolResult`,`usage.details.toolResult`]].map(([e,t])=>j`<option value=${e} ?selected=${x.has(e)}>
                ${v(t)}
              </option>`)}
        </select>
        <select
          multiple
          size="4"
          aria-label=${v(`usage.details.filterByTool`)}
          @change=${e=>n.onLogFilterToolsChange(Array.from(e.target.selectedOptions).map(e=>e.value))}
        >
          ${g.map(e=>j`<option value=${e} ?selected=${S.has(e)}>${e}</option>`)}
        </select>
        <label class="usage-filters-inline session-log-has-tools">
          <input
            type="checkbox"
            .checked=${s.hasTools}
            @change=${e=>n.onLogFilterHasToolsChange(e.target.checked)}
          />
          ${v(`usage.details.hasTools`)}
        </label>
        <input
          type="text"
          placeholder=${v(`usage.details.searchConversation`)}
          aria-label=${v(`usage.details.searchConversation`)}
          .value=${s.query}
          @input=${e=>n.onLogFilterQueryChange(e.target.value)}
        />
        <button class="btn btn--sm" @click=${n.onLogFilterClear}>
          ${v(`usage.filters.clear`)}
        </button>
      </div>
      <div class="session-logs-list">
        ${y.map(e=>{let{log:t,toolInfo:n,cleanContent:r}=e,i=t.role===`user`?`user`:`assistant`,a=t.role===`user`?v(`usage.details.you`):t.role===`assistant`?v(`usage.overview.assistant`):v(`usage.details.tool`);return j`
            <div class="session-log-entry ${i}">
              <div class="session-log-meta">
                <span class="session-log-role">${a}</span>
                <span>${p(t.timestamp)}</span>
                ${t.tokens?j`<span>${q(t.tokens)}</span>`:P}
              </div>
              <div class="session-log-content">${r}</div>
              ${n.tools.length>0?j`
                      <details class="session-log-tools" ?open=${o}>
                        <summary>${n.summary}</summary>
                        <div class="session-log-tools-list">
                          ${n.tools.map(([e,t])=>j`
                              <span class="session-log-tools-pill">${e} × ${t}</span>
                            `)}
                        </div>
                      </details>
                    `:P}
            </div>
          `})}
        ${y.length===0?j`
                <div class="usage-empty-block usage-empty-block--compact">
                  ${v(`usage.details.noMessagesMatch`)}
                </div>
              `:P}
      </div>
    </div>
  `}function ar(){return(ar=e((()=>{fe(),F(),k(),i(),w(),m(),et(),X(),Ct(),Dn(),Hn(),Zn()})))()}function or(e){return new Date(`${e}T12:00:00Z`).getTime()}function sr(e){return new Date(e).toISOString().slice(0,10)}function cr(e){let t=e.toSorted((e,t)=>e-t),n=e=>t[Math.min(t.length-1,Math.floor(t.length*e))]??0;return[n(.25),n(.5),n(.75)]}function lr(e,t){return e<=0?0:e<t[0]?1:e<t[1]?2:e<t[2]?3:4}function ur(e,t,n,r){let i=or(n),a=Math.max(or(t),i-363*dr),o=new Map(e.map(e=>[e.date,e.totalTokens])),s=cr(e.filter(e=>{let t=or(e.date);return e.totalTokens>0&&t>=a&&t<=i}).map(e=>e.totalTokens)),c=a-new Date(a).getUTCDay()*dr,l=new Intl.DateTimeFormat(r,{month:`short`,timeZone:`UTC`}),u=[],d=[],f=-1;for(let e=c;e<=i;e+=7*dr){let t=[];for(let n=0;n<7;n+=1){let r=e+n*dr;if(r<a||r>i){t.push(null);continue}let c=sr(r),l=o.get(c)??0;t.push({date:c,tokens:l,level:lr(l,s)})}u.push({days:t});let r=or(t.find(e=>e!==null)?.date??n),c=new Date(r).getUTCMonth();d.push(c===f?``:l.format(new Date(r))),f=c}return{weeks:u,monthLabels:d}}var dr;function fr(){return(fr=e((()=>{dr=864e5})))()}function pr(e){let t=_r+e.weeks.length*gr,n=new Intl.NumberFormat(void 0,{maximumFractionDigits:0}),r=new Intl.DateTimeFormat(void 0,{weekday:`short`,timeZone:`UTC`});return j`
    <svg
      class="usage-heatmap__svg"
      viewBox="0 0 ${t} ${116}"
      style="--usage-heatmap-width: ${t}px"
      role="group"
      aria-label=${v(`usage.heatmap.title`)}
    >
      ${e.monthLabels.map((e,t)=>e?R`<text class="usage-heatmap__month" x=${_r+t*gr} y="10">${e}</text>`:P)}
      ${yr.map(({row:e,utcDay:t})=>R`<text class="usage-heatmap__weekday" x=${24} y=${vr+e*gr+hr-2}>${r.format(new Date(t))}</text>`)}
      ${e.weeks.map((e,t)=>e.days.map((e,r)=>{if(!e)return P;let i=`${en(e.date)} · ${v(`usage.heatmap.cellTokens`,{tokens:n.format(e.tokens)})}`;return R`
            <rect
              class="usage-heatmap__cell usage-heatmap__cell--l${e.level}"
              x=${_r+t*gr}
              y=${vr+r*gr}
              width=${hr}
              height=${hr}
              rx="2.5"
              role="img"
              data-tooltip=${i}
              aria-label=${i}
            ></rect>
          `}))}
    </svg>
  `}function mr(e,t,n){if(e.length===0)return P;let r=ur(e,t,n),i=j`
    <div class="usage-heatmap__legend" aria-hidden="true">
      <span>${v(`usage.heatmap.less`)}</span>
      ${[0,1,2,3,4].map(e=>j`<span class="usage-heatmap__swatch usage-heatmap__cell--l${e}"></span>`)}
      <span>${v(`usage.heatmap.more`)}</span>
    </div>
  `;return Se({title:v(`usage.heatmap.title`),description:v(`usage.heatmap.subtitle`),actions:i},j`<div class="usage-panel usage-heatmap">${pr(r)}</div>`)}var hr,gr,_r,vr,yr;function br(){return(br=e((()=>{F(),_e(),i(),fr(),X(),hr=11,gr=14,_r=30,vr=18,yr=[{row:1,utcDay:Date.UTC(2024,0,1)},{row:3,utcDay:Date.UTC(2024,0,3)},{row:5,utcDay:Date.UTC(2024,0,5)}]})))()}function xr(e,t,n,r,i){if(n.length===0)return P;let a=G(e),o=qe(r).filter(e=>G(e.key??``)===a).map(e=>e.value).filter(Boolean),s=new Set(o.map(e=>G(e))),c=n.every(e=>s.has(G(e))),l=o.length;return j`
    <wa-dropdown
      class="usage-filter-select"
      placement="bottom-start"
      @wa-select=${t=>{t.preventDefault();let a=t.detail.item.value;if(a===`command:select-all`){i(yn(r,e,n));return}if(a===`command:clear`){i(yn(r,e,[]));return}if(a?.startsWith(`option:`)){let n=decodeURIComponent(a.slice(7));i(yn(r,e,t.detail.item.checked?[...o,n]:o.filter(e=>G(e)!==G(n))))}}}
    >
      <button slot="trigger" type="button" class="usage-filter-trigger">
        <span>${t}</span>
        ${l>0?j`<span class="settings-count">${l}</span>`:j` <span class="settings-count">${v(`usage.filters.all`)}</span> `}
      </button>
      <wa-dropdown-item value="command:select-all" ?disabled=${c}>
        ${v(`usage.filters.selectAll`)}
      </wa-dropdown-item>
      <wa-dropdown-item value="command:clear" ?disabled=${l===0}>
        ${v(`usage.filters.clear`)}
      </wa-dropdown-item>
      <div class="session-menu__separator" role="separator"></div>
      ${n.map(e=>{let t=s.has(G(e));return j`
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
  `}function Sr(){return(Sr=e((()=>{F(),i(),et(),bn()})))()}function Cr(e,t,n){let r=n?j`<div class="callout warning usage-callout">${v(`usage.providerUsage.stalled`)}</div>`:t?j`<div class="callout warning usage-callout">
          ${v(`usage.providerUsage.unavailable`)}
        </div>`:P;return e.length===0?r:Se({title:v(`usage.providerUsage.title`),count:e.length,description:v(`usage.providerUsage.subtitle`)},j`
      ${r}
      <div class="usage-panel provider-usage-section">
        <div class="provider-usage-grid">
          ${e.map(e=>j`
              <article class="provider-usage-card">
                <div class="provider-usage-card__header">
                  <div>
                    <div class="provider-usage-card__name">${e.displayName}</div>
                    <div class="provider-usage-card__id">${e.provider}</div>
                  </div>
                  ${e.plan?j`<span class="provider-usage-plan">${e.plan}</span>`:P}
                </div>
                ${Ge(e)}
              </article>
            `)}
        </div>
      </div>
    `)}function wr(e){let{data:t,filters:n,display:r,detail:i,callbacks:a}=e,o=a.filters,s=a.display,c=a.details,{hasOverviewData:l,loadingOverview:u}=it(t),d=r.chartMode===`tokens`,f=n.query.trim().length>0,p=n.queryDraft.trim().length>0,m=new Set(n.selectedDays),h=new Set(n.selectedSessions),g=t.sessions.toSorted((e,t)=>{let n=d?e.usage?.totalTokens??0:e.usage?.totalCost??0;return(d?t.usage?.totalTokens??0:t.usage?.totalCost??0)-n}),_=n.selectedHours.length>0?g.filter(e=>qt(e,n.selectedHours,n.timeZone)):g,y=Qe(_,n.query),b=e=>m.size===0?!0:e.usage?.activityDates?.length?e.usage.activityDates.some(e=>m.has(e)):!!(e.updatedAt&&m.has(Xt(new Date(e.updatedAt),n.timeZone))),x=y.sessions.filter(b),S=y.warnings,C=pn(g,t.aggregates),w=gn(n.queryDraft,C),T=qe(n.queryDraft),E=n.selectedSessions.length===1?t.sessions.find(e=>e.key===n.selectedSessions[0]):null,D=h.size?y.sessions.filter(e=>h.has(e.key)):y.sessions,k=D.filter(b),ee=h.size>0||f||n.selectedHours.length>0,A=ee||m.size>0,M=e=>{let t=K();for(let n of e)n&&wt(t,n);return t},N=ee?(()=>{let e=new Map;for(let t of D)for(let n of t.usage?.dailyBreakdown??[]){let t=e.get(n.date)??K();wt(t,n),e.set(n.date,t)}return Array.from(e,([e,t])=>({date:e,...t})).toSorted((e,t)=>e.date.localeCompare(t.date))})():t.costDaily,F=l?m.size?M(N.filter(e=>m.has(e.date))):ee?M(k.map(e=>e.usage)):t.totals:null,I=t.aggregates?.sessionCount??g.length,L=A?on(k):on([],t.aggregates),te=ee?void 0:t.aggregates?.byCreator;m.size>0&&(L.byCreator=(te??L.byCreator??[]).flatMap(e=>{let t=e.daily.filter(e=>m.has(e.date)),n=e.sessionActivity.flatMap(e=>{let t=e.dates.filter(e=>m.has(e));return t.length?[{dates:t,sessionCount:e.sessionCount}]:[]}),r=n.reduce((e,t)=>e+t.sessionCount,0),i=M(t);return r||i.totalTokens||i.totalCost?[{...e,totals:i,sessionCount:r,daily:t,sessionActivity:n}]:[]}));let R=m.size>0&&te?(L.byCreator??[]).reduce((e,t)=>e+t.sessionCount,0):A?k.length:t.aggregates?.sessionCount??k.length;m.size>0&&te&&(L.sessionCount=R);let z=t.sessionsLimitReached&&!A,ne=z?M(k.map(e=>e.usage)):F,B=z?on(k):L,re=A?P:Fn(t.costDaily,n.startDate,n.endDate,n.timeZone),ie=sn(k,ne,B),V=t.cacheRefresh===`complete`&&t.totals!==null&&!t.loading&&!t.error&&t.sessions.length===0&&(t.totals?.totalTokens??0)===0,H=(F?.missingCostEntries??0)>0,ae=[{label:v(`usage.presets.today`),days:1},{label:v(`usage.presets.last7d`),days:7},{label:v(`usage.presets.last30d`),days:30},{label:v(`usage.presets.last90d`),days:90},{label:v(`usage.presets.last1y`),days:365}],oe=e=>{let t=new Date,r=new Date(t);return n.timeZone===`utc`?r.setUTCDate(r.getUTCDate()-(e-1)):r.setDate(r.getDate()-(e-1)),{start:Xt(r,n.timeZone),end:Xt(t,n.timeZone)}},se=e=>{let t=oe(e);return n.startDate===t.start&&n.endDate===t.end},ce=e=>{let t=oe(e);o.onStartDateChange(t.start),o.onEndDateChange(t.end)},le=()=>{o.onStartDateChange(`1970-01-01`),o.onEndDateChange(Xt(new Date,n.timeZone))},ue=Xt(new Date);return ge(j`
      <div class="usage-page">
        <section class="settings-section">
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${v(`usage.filters.rangeTitle`)}</h2>
            <div class="settings-section__actions">
              ${u?bt(v(`usage.loading.badge`)):P}
              ${V?j`<span class="usage-query-hint">${v(`usage.empty.hint`)}</span>`:P}
            </div>
          </div>
          <div
            class="settings-group usage-panel usage-header ${r.headerPinned?`pinned`:``}"
          >
            <div class="usage-header-row">
              <div class="usage-controls">
                ${Pn(n.selectedDays,n.selectedHours,n.selectedSessions,t.sessions,o.onClearDays,o.onClearHours,o.onClearSessions,o.onClearFilters)}
                <div class="usage-presets">
                  ${ae.map(e=>j`
                      <button
                        class="btn btn--sm ${se(e.days)?`active`:``}"
                        aria-pressed=${se(e.days)}
                        @click=${()=>ce(e.days)}
                      >
                        ${e.label}
                      </button>
                    `)}
                  <button
                    class="btn btn--sm ${n.startDate===`1970-01-01`?`active`:``}"
                    aria-pressed=${n.startDate===`1970-01-01`}
                    @click=${le}
                  >
                    ${v(`usage.presets.all`)}
                  </button>
                </div>
                <div class="usage-date-range">
                  <input
                    class="usage-date-input"
                    type="date"
                    .value=${n.startDate}
                    title=${v(`usage.filters.startDate`)}
                    aria-label=${v(`usage.filters.startDate`)}
                    @change=${e=>o.onStartDateChange(e.target.value)}
                  />
                  <span class="usage-separator">${v(`usage.filters.to`)}</span>
                  <input
                    class="usage-date-input"
                    type="date"
                    .value=${n.endDate}
                    title=${v(`usage.filters.endDate`)}
                    aria-label=${v(`usage.filters.endDate`)}
                    @change=${e=>o.onEndDateChange(e.target.value)}
                  />
                </div>
                <select
                  class="usage-select"
                  title=${v(`usage.filters.timeZone`)}
                  aria-label=${v(`usage.filters.timeZone`)}
                  .value=${n.timeZone}
                  @change=${e=>o.onTimeZoneChange(e.target.value)}
                >
                  <option value="local">${v(`usage.filters.timeZoneLocal`)}</option>
                  <option value="utc">${v(`usage.filters.timeZoneUtc`)}</option>
                </select>
              </div>
              <div class="usage-view-options">
                ${kn({options:t.creatorOptions,selectedKey:n.creatorKey,onSelect:o.onCreatorChange})}
                ${be({mode:`buttons`,variant:`accent`,value:n.scope,onChange:o.onScopeChange,onReselect:o.onScopeChange,options:[{value:`instance`,label:v(`usage.scope.instance`),title:v(`usage.scope.instanceHint`)},{value:`family`,label:v(`usage.scope.family`),title:v(`usage.scope.familyHint`)}]})}
                ${be({mode:`buttons`,variant:`accent`,value:d?`tokens`:`cost`,onChange:s.onChartModeChange,onReselect:s.onChartModeChange,options:[{value:`tokens`,label:v(`usage.metrics.tokens`)},{value:`cost`,label:v(`usage.metrics.cost`)}]})}
                <button
                  class="btn btn--sm primary"
                  @click=${o.onRefresh}
                  ?disabled=${t.loading}
                >
                  ${v(`common.refresh`)}
                </button>
              </div>
            </div>

            <div class="usage-header-row">
              <div class="usage-header-metrics">
                ${F?j`
                        <span class="usage-metric-badge">
                          <strong>${q(F.totalTokens)}</strong>
                          ${v(`usage.metrics.tokens`)}
                        </span>
                        <span class="usage-metric-badge">
                          <strong>${J(F.totalCost)}</strong>
                          ${v(`usage.metrics.cost`)}
                        </span>
                        <span class="usage-metric-badge">
                          <strong>${R}</strong>
                          ${v(R===1?`usage.metrics.session`:`usage.metrics.sessions`)}
                        </span>
                      `:P}
                <button
                  class="btn btn--sm usage-pin-btn ${r.headerPinned?`active`:``}"
                  @click=${o.onToggleHeaderPinned}
                >
                  ${r.headerPinned?v(`usage.filters.pinned`):v(`usage.filters.pin`)}
                </button>
                <wa-dropdown
                  class="usage-export-menu"
                  placement="bottom-end"
                  @wa-select=${e=>{switch(e.detail.item.value){case`sessions-csv`:U(`openclaw-usage-sessions-${ue}.csv`,mn(k),`text/csv;charset=utf-8`);break;case`daily-csv`:U(`openclaw-usage-daily-${ue}.csv`,hn(N),`text/csv;charset=utf-8`);break;case`json`:s.onExportJson({totals:F,sessions:k,daily:N,aggregates:L});break;case void 0:}}}
                >
                  <button
                    slot="trigger"
                    type="button"
                    class="btn btn--sm"
                    aria-busy=${t.exporting}
                  >
                    ${t.exporting?v(`common.loading`):v(`usage.export.label`)} ▾
                  </button>
                  <wa-dropdown-item
                    value="sessions-csv"
                    ?disabled=${k.length===0}
                  >
                    ${v(`usage.export.sessionsCsv`)}
                  </wa-dropdown-item>
                  <wa-dropdown-item value="daily-csv" ?disabled=${N.length===0}>
                    ${v(`usage.export.dailyCsv`)}
                  </wa-dropdown-item>
                  <wa-dropdown-item
                    value="json"
                    ?disabled=${t.exporting||t.loading||k.length===0&&N.length===0}
                  >
                    ${v(`usage.export.json`)}
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
                  aria-label=${v(`usage.query.placeholder`)}
                  placeholder=${v(`usage.query.placeholder`)}
                  @input=${e=>o.onQueryDraftChange(e.target.value)}
                  @keydown=${e=>{e.key===`Enter`&&(e.preventDefault(),o.onApplyQuery())}}
                />
                <div class="usage-query-actions">
                  <button
                    class="btn btn--sm"
                    @click=${o.onApplyQuery}
                    ?disabled=${t.loading||!p&&!f}
                  >
                    ${v(`usage.query.apply`)}
                  </button>
                  ${p||f?j`
                          <button class="btn btn--sm" @click=${o.onClearQuery}>
                            ${v(`usage.filters.clear`)}
                          </button>
                        `:P}
                  <span class="usage-query-hint">
                    ${l?f?v(`usage.query.matching`,{shown:String(x.length),total:String(I)}):v(`usage.query.inRange`,{total:String(I)}):P}
                  </span>
                </div>
              </div>
              <div class="usage-filter-row">
                ${xr(`channel`,v(`usage.filters.channel`),C.channel,n.queryDraft,o.onQueryDraftChange)}
                ${xr(`provider`,v(`usage.filters.provider`),C.provider,n.queryDraft,o.onQueryDraftChange)}
                ${xr(`model`,v(`usage.filters.model`),C.model,n.queryDraft,o.onQueryDraftChange)}
                ${xr(`tool`,v(`usage.filters.tool`),C.tool,n.queryDraft,o.onQueryDraftChange)}
                <span class="usage-query-hint">${v(`usage.query.tip`)}</span>
              </div>
              ${T.length>0?j`
                      <div class="usage-query-chips">
                        ${T.map(e=>{let t=e.raw;return j`
                            <span class="usage-query-chip">
                              ${t}
                              <openclaw-tooltip .content=${v(`usage.filters.remove`)}>
                                <button
                                  aria-label=${v(`usage.filters.remove`)}
                                  @click=${()=>o.onQueryDraftChange(vn(n.queryDraft,t))}
                                >
                                  ${O.x}
                                </button>
                              </openclaw-tooltip>
                            </span>
                          `})}
                      </div>
                    `:P}
              ${w.length>0?j`
                      <div class="usage-query-suggestions">
                        ${w.map(e=>j`
                            <button
                              class="usage-query-suggestion"
                              @click=${()=>o.onQueryDraftChange(_n(n.queryDraft,e.value))}
                            >
                              ${e.label}
                            </button>
                          `)}
                      </div>
                    `:P}
              ${S.length>0?j`
                      <div class="callout warning usage-callout usage-callout--tight">
                        ${S.join(` · `)}
                      </div>
                    `:P}
            </div>

            ${t.error?j`<div class="callout danger usage-callout">${t.error}</div>`:P}
            ${t.cacheRefresh===`complete`?P:j`
                    <div
                      class="callout ${t.cacheRefresh===`failed`?`warning`:``} usage-callout usage-cache-warning"
                      role="status"
                      aria-live="polite"
                    >
                      ${v(t.cacheRefresh===`failed`?`usage.cacheStatus.paused`:`usage.cacheStatus.warning`)}
                    </div>
                  `}
            ${t.sessionsLimitReached?j`
                    <div class="callout warning usage-callout">
                      ${v(`usage.sessions.limitReached`)}
                    </div>
                  `:P}
          </div>
        </section>

        ${l?V?xt(o.onRefresh):j`
                  <div class="settings-group usage-panel usage-left-card usage-trend-section">
                    ${Tn(N,n.selectedDays,r.chartMode,r.dailyChartMode,s.onDailyChartModeChange,o.onSelectDay,{startDate:n.startDate,endDate:n.endDate,complete:t.cacheRefresh===`complete`})}
                    ${F?En(F,r.chartMode):P}
                  </div>
                  ${An({groups:L.byCreator??[],selectedKey:n.creatorKey,mode:r.chartMode,onSelect:o.onCreatorChange})}
                  ${Rn(ne,B,ie,H,n.selectedDays.length===0,zt(k,n.timeZone),R,I)}
                  ${re}
                  ${mr(N,n.startDate,n.endDate)}
                  ${Yt(k,n.timeZone,n.selectedHours,o.onSelectHour)}

                  <div class="usage-grid">
                    <div class="usage-grid-column">
                      ${zn(x,n.selectedSessions,n.selectedDays,d,r.sessionSort,r.sessionSortDir,r.recentSessions,r.sessionsTab,c.onSelectSession,s.onSessionSortChange,s.onSessionSortDirChange,s.onSessionsTabChange,I,o.onClearSessions)}
                    </div>
                    ${E?j`<div class="usage-grid-column">
                            ${nr(E,i,c,n,r.contextExpanded,o.onClearSessions)}
                          </div>`:P}
                  </div>
                `:u?j`<div class="usage-panel usage-loading-card">
                  <div class="usage-loading-grid">
                    <div class="skeleton usage-skeleton-block usage-skeleton-block--tall"></div>
                    <div class="skeleton usage-skeleton-block"></div>
                    <div class="skeleton usage-skeleton-block"></div>
                  </div>
                </div>`:P}
        ${Cr(t.providerUsage,t.providerUsageUnavailable,t.providerUsageStalled)}
      </div>
    `,{wide:!0})}function Tr(){return(Tr=e((()=>{F(),k(),Ke(),_e(),w(),Te(),i(),et(),X(),Ct(),bn(),Dn(),jn(),ar(),br(),Bn(),Sr()})))()}var $,Er;function Dr(){return(Dr=e((()=>{ue(),F(),te(),D(),s(),x(),o(),He(),Le(),d(),n(),ft(),vt(),et(),Ct(),We(),tt(),Tr(),$=class extends r{constructor(...e){super(...e),this.usageSnapshot=null,this.providerUsageSummary=null,this.providerUsageUnavailable=!1,this.providerUsageIncomplete=!1,this.usageError=null,this.initialDateRange=$e(),this.usageStartDate=this.initialDateRange.startDate,this.usageEndDate=this.initialDateRange.endDate,this.usageScope=`family`,this.usageAgentId=null,this.usageCreatorKey=null,this.usageSelectedSessions=[],this.usageSelectedDays=[],this.usageSelectedHours=[],this.usageChartMode=`tokens`,this.usageDailyChartMode=`by-type`,this.usageTimeSeriesMode=`per-turn`,this.usageTimeSeriesBreakdownMode=`by-type`,this.usageTimeSeriesCursorStart=null,this.usageTimeSeriesCursorEnd=null,this.usageSessionLogsExpanded=!1,this.usageQuery=``,this.usageQueryDraft=``,this.usageSessionSort=`recent`,this.usageSessionSortDir=`desc`,this.usageRecentSessions=[],this.usageTimeZone=`local`,this.usageContextExpanded=!1,this.usageHeaderPinned=!1,this.usageSessionsTab=`all`,this.usageLogFilterRoles=[],this.usageLogFilterTools=[],this.usageLogFilterHasTools=!1,this.usageLogFilterQuery=``,this.dateDebounceTimer=null,this.queryDebounceTimer=null,this.connectionEpoch={},this.usageUpdatedAt=0,this.acknowledgedUsageFailures=new WeakSet,this.routeDataInitialized=!1,this.routeDataEnabled=!0,this.refreshPolicy=new Ue({isLoading:()=>this.usageLoading,reload:e=>{e===`manual`&&(this.usageUpdatedAt=this.usagePublication.updatedAt),this.clearDateDebounce();let t=e===`manual`&&this.usageSelectedSessions.length===1?this.usageSelectedSessions[0]:void 0;return this.loadUsage(t)},onIncompleteUsageExhausted:()=>this.requestUpdate()}),this.gateway=new Ie(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>this.resetForClientChange(),invalidateRequests:e=>{e.snapshot.phase!==`connected`&&(this.refreshPolicy.interrupt(),this.usageRequest.cancel(),this.details.cancel(),this.usageExportRequest.cancel())},onSnapshot:e=>this.handleGatewaySnapshot(e),onPageActivation:()=>this.refreshPolicy.request(`focus`)}),this.observeAgentScope=ie(e=>{this.routeDataInitialized&&this.usageAgentId!==e&&(this.usageAgentId=e,this.usageCreatorKey=null,this.clearSelectionsAndDetails(),this.refreshPolicy.request(`manual`)),this.requestUpdate()}),this.usageRequest=ct(this,{task:async([e,t],{signal:n})=>{this.refreshPolicy.beginLoad();let r=this.connectionEpoch,i=this.currentQuery;return{epoch:r,query:i,refreshSessionKey:t,snapshot:await Ze(e,i,n)}},onComplete:e=>{let t=e.snapshot,n=this.isCurrentQuery(e.query);if(n&&t.ok){this.usageSnapshot={query:e.query,result:t.value.result,costSummary:t.value.costSummary},this.usageError=null;let n=this.usageSelectedSessions.length===1?this.usageSelectedSessions[0]:void 0;n&&this.details.load(n,e.refreshSessionKey===n)}else n&&!t.ok&&this.applyUsageError(t.error.cause);this.applyUsageLoadState(t.ok?t.value.providerUsage:t.error.providerUsage,e.epoch,n&&t.ok?void 0:null),this.refreshPolicy.flushPending()},onError:e=>{this.applyUsageError(e),this.applyUsageLoadState({state:`pending`},this.connectionEpoch,null),this.refreshPolicy.flushPending()}}),this.usageExportRequest=_t(this,this.gateway,()=>this.currentQuery),this.details=new dt(this,this.gateway,()=>this.currentQuery,()=>this.usageResult?.sessions??[],()=>{this.usageTimeSeriesCursorStart=null,this.usageTimeSeriesCursorEnd=null}),this.subscriptions=new y(this).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).watchStore(()=>this.context?.agents)}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.ensureInitialData())}disconnectedCallback(){this.subscriptions.clear(),this.clearDateDebounce(),this.clearQueryDebounce(),this.refreshPolicy.dispose(),this.usageRequest.cancel(),this.details.cancel(),this.usageExportRequest.cancel(),super.disconnectedCallback()}applyRouteData(){let e=this.routeData;if(!e||(this.routeDataInitialized=!0,!this.routeDataEnabled))return;if(!this.gateway.isRouteDataCurrent(e)){this.routeDataEnabled=!1;return}let t=this.context.agentSelection.state.scopeId;if(e.query.agentId!==t){this.usageAgentId=t,this.clearSelectionsAndDetails(),this.resetProviderUsage(),this.refreshPolicy.request(`manual`);return}this.usageStartDate=e.query.startDate,this.usageEndDate=e.query.endDate,this.usageScope=e.query.scope,this.usageTimeZone=e.query.timeZone,this.usageAgentId=e.query.agentId,this.usageCreatorKey=e.query.creatorKey??null,this.usageSnapshot={query:this.currentQuery,result:e.result,costSummary:e.costSummary},this.applyUsageLoadState(e.providerUsage,this.connectionEpoch,e.loadedAtMs),this.usageError=e.error;let n=at(e.gatewaySnapshot.usagePublications,this.currentQuery.agentId).updatedAt;this.usagePublication.committedAt>n&&this.refreshPolicy.request(`publication`),this.refreshPolicy.flushPending()}ensureInitialData(){!this.routeDataEnabled&&this.routeDataInitialized&&this.gateway.client&&this.gateway.connected&&!this.usageLoading&&this.loadUsage()}resetForClientChange(){this.clearDateDebounce(),this.usageRequest.cancel(),this.routeDataInitialized&&(this.routeDataEnabled=!1),this.usageSnapshot=null,this.resetProviderUsage(),this.usageError=null,this.usageAgentId=this.context.agentSelection.state.scopeId,this.usageCreatorKey=null,this.clearSelectionsAndDetails()}resetProviderUsage(){this.providerUsageSummary=null,this.providerUsageUnavailable=!1,this.providerUsageIncomplete=!1,this.refreshPolicy.resetPayload()}applyUsageLoadState(e,t,n=Date.now()){if(e.state===`settled`){let t=e.result;this.providerUsageUnavailable=!t.ok,this.providerUsageIncomplete=!t.ok||Ve(t.value),t.ok&&!this.providerUsageIncomplete&&(this.providerUsageSummary=t.value)}this.refreshPolicy.setLastLoadedAtMs(e.state===`pending`||this.usageCacheIncomplete?null:n,{incomplete:this.providerUsageIncomplete,connection:t})}get usagePublication(){return at(this.gateway.snapshot?.usagePublications,this.currentQuery.agentId)}get usageRefreshFailed(){return this.usagePublication.failures.some(e=>!this.acknowledgedUsageFailures.has(e))}get usageCacheIncomplete(){return rt(this.usageResult?.cacheStatus,this.usageCostSummary?.cacheStatus)}get currentQuery(){return{startDate:this.usageStartDate,endDate:this.usageEndDate,scope:this.usageScope,timeZone:this.usageTimeZone,agentId:G(this.usageAgentId??``)||void 0,creatorKey:this.usageCreatorKey??void 0}}isCurrentQuery(e){let t=this.currentQuery;return e.startDate===t.startDate&&e.endDate===t.endDate&&e.scope===t.scope&&e.timeZone===t.timeZone&&e.agentId===t.agentId&&e.creatorKey===t.creatorKey}get usageResult(){return this.usageSnapshot&&this.isCurrentQuery(this.usageSnapshot.query)?this.usageSnapshot.result:null}get usageCostSummary(){return this.usageSnapshot&&this.isCurrentQuery(this.usageSnapshot.query)?this.usageSnapshot.costSummary:null}get usageCreatorOptions(){return this.usageSnapshot?.query.agentId===this.currentQuery.agentId?this.usageSnapshot?.result?.creatorOptions??[]:[]}get providerUsageStalled(){return this.providerUsageIncomplete&&this.refreshPolicy.incompleteUsageExhausted}applyUsageError(e){let t=h(e);this.usageError=t?S(`usage`):g(e,`request failed`),t&&(this.usageSnapshot=null)}get usageLoading(){return!this.routeDataInitialized||this.dateDebounceTimer!==null||this.usageRequest.pending}loadUsage(e){let t=this.gateway.client;return!t||!this.gateway.connected?(this.refreshPolicy.markLoadDeferred(),Promise.resolve()):(this.routeDataEnabled=!1,this.usageError=null,this.usageRequest.run([t,e]))}clearSelectionsAndDetails(){this.usageExportRequest.cancel(),this.usageSelectedDays=[],this.usageSelectedHours=[],this.usageSelectedSessions=[],this.details.clear()}clearDateDebounce(){this.dateDebounceTimer!==null&&(window.clearTimeout(this.dateDebounceTimer),this.dateDebounceTimer=null)}scheduleUsageLoad(){this.clearDateDebounce(),this.usageRequest.cancel(),this.usageError=null,this.refreshPolicy.resetPayload(),this.routeDataEnabled=!1,this.dateDebounceTimer=window.setTimeout(()=>{this.dateDebounceTimer=null,this.refreshPolicy.request(`manual`)},400)}handleGatewaySnapshot(e){if(!this.gateway.connected||!this.gateway.client)return;this.context.agents.ensureList();let t=this.usagePublication,n=t.committedAt>this.usageUpdatedAt;this.usageUpdatedAt=t.updatedAt,e.identityChanged||e.becameConnected?(this.connectionEpoch={},this.routeDataInitialized&&this.refreshPolicy.request(`reconnect`)):n&&this.routeDataInitialized&&this.refreshPolicy.request(`publication`);let r=this.usageSelectedSessions.length===1?this.usageSelectedSessions[0]:void 0;if(e.becameAvailable&&r)for(let e of[this.details.timeSeries,this.details.sessionLogs,this.details.contextWeight])e.recover(r,e===this.details.contextWeight)}clearQueryDebounce(){this.queryDebounceTimer!==null&&(window.clearTimeout(this.queryDebounceTimer),this.queryDebounceTimer=null)}selectSession(e,t,n){if(this.details.clear(),this.usageRecentSessions=[e,...this.usageRecentSessions.filter(t=>t!==e)].slice(0,8),this.usageSelectedSessions=Xe(this.usageSelectedSessions,e,n,t),this.usageSelectedSessions.length===1){let e=this.usageSelectedSessions[0];e&&this.details.load(e)}}render(){let e=this.details.timeSeries.data,t={data:{loading:this.usageLoading,exporting:this.usageExportRequest.pending,error:this.usageError,sessions:this.usageResult?.sessions??[],creatorOptions:this.usageCreatorOptions,sessionsLimitReached:(this.usageResult?.sessions.length??0)>=1e3,totals:this.usageResult?.totals??null,aggregates:this.usageResult?.aggregates??null,costDaily:this.usageCostSummary?.daily??[],cacheRefresh:this.usageCacheIncomplete?this.usageRefreshFailed?`failed`:`retrying`:`complete`,providerUsage:this.providerUsageSummary?.providers??[],providerUsageStalled:this.providerUsageStalled,providerUsageUnavailable:this.providerUsageUnavailable},filters:{startDate:this.usageStartDate,endDate:this.usageEndDate,scope:this.usageScope,selectedSessions:this.usageSelectedSessions,selectedDays:this.usageSelectedDays,selectedHours:this.usageSelectedHours,creatorKey:this.usageCreatorKey,query:this.usageQuery,queryDraft:this.usageQueryDraft,timeZone:this.usageTimeZone},display:{chartMode:this.usageChartMode,dailyChartMode:this.usageDailyChartMode,sessionSort:this.usageSessionSort,sessionSortDir:this.usageSessionSortDir,recentSessions:this.usageRecentSessions,sessionsTab:this.usageSessionsTab,contextExpanded:this.usageContextExpanded,headerPinned:this.usageHeaderPinned},detail:{context:{weight:this.details.contextWeight.data,loading:this.details.contextWeight.loading,status:this.details.contextWeight.status},timeSeriesMode:this.usageTimeSeriesMode,timeSeriesBreakdownMode:this.usageTimeSeriesBreakdownMode,timeSeries:e,timeSeriesLoading:this.details.timeSeries.loading,timeSeriesStatus:this.details.timeSeries.status,timeSeriesCursorStart:this.usageTimeSeriesCursorStart,timeSeriesCursorEnd:this.usageTimeSeriesCursorEnd,sessionLogs:this.details.sessionLogs.data,sessionLogsLoading:this.details.sessionLogs.loading,sessionLogsStatus:this.details.sessionLogs.status,sessionLogsExpanded:this.usageSessionLogsExpanded,logFilters:{roles:this.usageLogFilterRoles,tools:this.usageLogFilterTools,hasTools:this.usageLogFilterHasTools,query:this.usageLogFilterQuery}},callbacks:{filters:{onStartDateChange:e=>{this.usageStartDate=e,this.clearSelectionsAndDetails(),this.scheduleUsageLoad()},onEndDateChange:e=>{this.usageEndDate=e,this.clearSelectionsAndDetails(),this.scheduleUsageLoad()},onScopeChange:e=>{this.usageScope=e,this.clearSelectionsAndDetails(),this.refreshPolicy.request(`manual`)},onCreatorChange:e=>{this.usageCreatorKey=e,this.clearSelectionsAndDetails(),this.refreshPolicy.request(`manual`)},onRefresh:()=>{for(let e of this.usagePublication.failures)this.acknowledgedUsageFailures.add(e);this.refreshPolicy.request(`manual`)},onTimeZoneChange:e=>{this.usageTimeZone=e,this.clearSelectionsAndDetails(),this.refreshPolicy.request(`manual`)},onToggleHeaderPinned:()=>this.usageHeaderPinned=!this.usageHeaderPinned,onSelectHour:(e,t)=>{this.usageSelectedHours=nt(this.usageSelectedHours,e,Array.from({length:24},(e,t)=>t),t,!0)},onQueryDraftChange:e=>{this.usageQueryDraft=e,this.clearQueryDebounce(),this.queryDebounceTimer=window.setTimeout(()=>{this.usageQuery=this.usageQueryDraft,this.queryDebounceTimer=null},250)},onApplyQuery:()=>{this.clearQueryDebounce(),this.usageQuery=this.usageQueryDraft},onClearQuery:()=>{this.clearQueryDebounce(),this.usageQueryDraft=``,this.usageQuery=``},onSelectDay:(e,t,n)=>{this.usageSelectedDays=nt(this.usageSelectedDays,e,n,t,!1)},onClearDays:()=>this.usageSelectedDays=[],onClearHours:()=>this.usageSelectedHours=[],onClearSessions:()=>{this.usageSelectedSessions=[],this.details.clear()},onClearFilters:()=>this.clearSelectionsAndDetails()},display:{onExportJson:e=>{this.usageExportRequest.run(e)},onChartModeChange:e=>this.usageChartMode=e,onDailyChartModeChange:e=>this.usageDailyChartMode=e,onSessionSortChange:e=>this.usageSessionSort=e,onSessionSortDirChange:e=>this.usageSessionSortDir=e,onSessionsTabChange:e=>this.usageSessionsTab=e},details:{onToggleContextExpanded:()=>this.usageContextExpanded=!this.usageContextExpanded,onToggleSessionLogsExpanded:()=>this.usageSessionLogsExpanded=!this.usageSessionLogsExpanded,onLogFilterRolesChange:e=>{this.usageLogFilterRoles=e},onLogFilterToolsChange:e=>{this.usageLogFilterTools=e},onLogFilterHasToolsChange:e=>{this.usageLogFilterHasTools=e},onLogFilterQueryChange:e=>{this.usageLogFilterQuery=e},onLogFilterClear:()=>{this.usageLogFilterRoles=[],this.usageLogFilterTools=[],this.usageLogFilterHasTools=!1,this.usageLogFilterQuery=``},onSelectSession:(e,t,n)=>this.selectSession(e,t,n),onTimeSeriesModeChange:e=>{this.usageTimeSeriesMode=e},onTimeSeriesBreakdownChange:e=>{this.usageTimeSeriesBreakdownMode=e},onTimeSeriesCursorRangeChange:(t,n)=>{this.details.timeSeries.data===e&&(this.usageTimeSeriesCursorStart=t,this.usageTimeSeriesCursorEnd=n)}}}};return yt(this.context,this.usageResult,wr(t))}},W([le({context:A,subscribe:!0})],$.prototype,`context`,void 0),W([ne({attribute:!1})],$.prototype,`routeData`,void 0),W([I()],$.prototype,`usageSnapshot`,void 0),W([I()],$.prototype,`providerUsageSummary`,void 0),W([I()],$.prototype,`providerUsageUnavailable`,void 0),W([I()],$.prototype,`providerUsageIncomplete`,void 0),W([I()],$.prototype,`usageError`,void 0),W([I()],$.prototype,`usageStartDate`,void 0),W([I()],$.prototype,`usageEndDate`,void 0),W([I()],$.prototype,`usageScope`,void 0),W([I()],$.prototype,`usageAgentId`,void 0),W([I()],$.prototype,`usageCreatorKey`,void 0),W([I()],$.prototype,`usageSelectedSessions`,void 0),W([I()],$.prototype,`usageSelectedDays`,void 0),W([I()],$.prototype,`usageSelectedHours`,void 0),W([I()],$.prototype,`usageChartMode`,void 0),W([I()],$.prototype,`usageDailyChartMode`,void 0),W([I()],$.prototype,`usageTimeSeriesMode`,void 0),W([I()],$.prototype,`usageTimeSeriesBreakdownMode`,void 0),W([I()],$.prototype,`usageTimeSeriesCursorStart`,void 0),W([I()],$.prototype,`usageTimeSeriesCursorEnd`,void 0),W([I()],$.prototype,`usageSessionLogsExpanded`,void 0),W([I()],$.prototype,`usageQuery`,void 0),W([I()],$.prototype,`usageQueryDraft`,void 0),W([I()],$.prototype,`usageSessionSort`,void 0),W([I()],$.prototype,`usageSessionSortDir`,void 0),W([I()],$.prototype,`usageRecentSessions`,void 0),W([I()],$.prototype,`usageTimeZone`,void 0),W([I()],$.prototype,`usageContextExpanded`,void 0),W([I()],$.prototype,`usageHeaderPinned`,void 0),W([I()],$.prototype,`usageSessionsTab`,void 0),W([I()],$.prototype,`usageLogFilterRoles`,void 0),W([I()],$.prototype,`usageLogFilterTools`,void 0),W([I()],$.prototype,`usageLogFilterHasTools`,void 0),W([I()],$.prototype,`usageLogFilterQuery`,void 0),customElements.get(`openclaw-usage-page`)||customElements.define(`openclaw-usage-page`,$),Er={header:!0,render:e=>j`<openclaw-usage-page .routeData=${e}></openclaw-usage-page>`}})))()}Dr();export{Er as usagePageComponent};
//# sourceMappingURL=usage-page-DfCgmiB1.js.map