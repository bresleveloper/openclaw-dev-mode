import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{r as t,t as n}from"./worker-chunk-Dw-4PAmJ.mjs";import{r,t as i}from"./worker-chunk-CgmymHol.mjs";import{n as a,u as o}from"./worker-chunk-Beu5zrK3.mjs";import{n as s,o as c}from"./worker-chunk-DHzx9GZ_.mjs";import{d as l,h as u,o as d,t as ee}from"./worker-chunk-a5H2i7-x.mjs";import{c as te,o as ne,s as f,t as re}from"./worker-chunk-ol4R2Y93.mjs";import{c as p,l as m,r as h}from"./worker-chunk-D-pM6VZQ.mjs";import{i as ie,n as ae,r as oe}from"./worker-chunk-DoVH2ZtP.mjs";import{n as se,t as ce}from"./worker-chunk-BBlBFPic.mjs";import{n as le,t as ue}from"./worker-chunk-B8Bvxwi0.mjs";import{n as de,t as fe}from"./worker-chunk-C5bO4Pvi.mjs";import{A as pe,B as me,C as he,N as ge,P as _e,S as ve,W as g,_,k as ye}from"./worker-chunk-D-t5pbdl.mjs";import{t as be}from"./worker-chunk-uKvqOJn0.mjs";import{n as xe,t as Se}from"./worker-chunk-Dl-SYIPm.mjs";import{a as Ce,r as we,s as Te}from"./worker-chunk-B6G-O0_t.mjs";import{n as Ee,o as De,r as Oe,s as ke,t as Ae}from"./worker-chunk-Btgf1Fda.mjs";import{o as je,s as Me}from"./worker-chunk-DQq7ZiUr.mjs";import{a as v,i as y,n as Ne,o as Pe,s as Fe,u as Ie}from"./worker-chunk-0R9-efJM.mjs";import{i as Le,r as Re}from"./worker-chunk-DTCqdhQS.mjs";import{J as b,_t as x,c as ze,ct as S,m as Be,mt as Ve,pt as C,q as w,x as He,yt as Ue}from"./worker-chunk-nCN7lbx3.mjs";import{n as We,t as T}from"./worker-chunk-Af7r65nx.mjs";import{i as Ge,l as Ke,t as qe}from"./worker-chunk-CCBKtdP2.mjs";import{c as Je,g as Ye,h as Xe,i as Ze}from"./worker-chunk-CfWg-CZ2.mjs";import{i as Qe,n as $e}from"./worker-chunk-xlua9rtZ.mjs";import{a as et,n as tt,r as nt}from"./worker-chunk-8BtaZ3IZ.mjs";import{i as rt,m as it,o as at}from"./worker-chunk-Bj_sLDlx.mjs";import{r as ot,s as st}from"./worker-chunk-DUflihCn.mjs";import{a as E,d as D,i as ct,n as lt,r as ut,s as dt,t as O}from"./worker-chunk-B-FmzGT2.mjs";import{i as ft,o as pt}from"./worker-chunk-BJAs1Zl8.mjs";import{o as mt,t as ht}from"./worker-chunk-CKLjF99n.mjs";import{i as gt,n as _t,o as vt}from"./worker-chunk-zEl65iey.mjs";import{c as yt,l as k,s as bt}from"./worker-chunk-BF2XxaQ9.mjs";import{t as xt}from"./worker-chunk-JZ7TNN3T.mjs";import{l as St,o as Ct}from"./worker-chunk-C_0XwOGs.mjs";import{i as wt,u as Tt}from"./worker-chunk-LezG9avP.mjs";import{c as Et,n as Dt,r as A,u as Ot}from"./worker-chunk-Dsc13Sgv.mjs";import{n as kt,t as At}from"./worker-chunk-DspXIEov.mjs";import{O as jt,S as Mt,d as Nt,i as Pt,k as Ft,u as It,x as j}from"./worker-chunk-Ch21v3RD.mjs";import{i as Lt,n as Rt,r as zt}from"./worker-chunk-aG8-LLwy.mjs";import{a as Bt,c as Vt,d as Ht,f as Ut,i as M,n as N,o as P,s as F,t as Wt}from"./worker-chunk-DZIw2MZV.mjs";import{r as Gt,t as I}from"./worker-chunk-CG9KdiV9.mjs";import{r as Kt,t as qt}from"./worker-chunk-4_5sIAO7.mjs";import{i as Jt,n as Yt,r as Xt,t as Zt}from"./worker-chunk-UsP_x64J.mjs";import{a as L,c as Qt,d as $t,i as en,l as tn,n as nn,r as R,s as rn,u as an}from"./worker-chunk-C2F8-lfk.mjs";import{r as on,t as sn}from"./worker-chunk-hOUg5eBw.mjs";import{a as cn,c as ln,d as un,n as dn,o as fn,r as pn,s as mn,u as z}from"./worker-chunk-qhgeU88D.mjs";import{F as hn,I as gn,L as _n,N as vn,P as yn,c as bn,d as xn,l as Sn,o as Cn,u as wn}from"./worker-chunk-Cpbbdrf2.mjs";import{i as Tn,r as En,t as Dn}from"./worker-chunk-Cj5pfRRL.mjs";import{i as On,n as kn,t as An}from"./worker-chunk-DVqcxSj2.mjs";import{existsSync as jn}from"node:fs";import B from"node:path";import{createHash as Mn}from"node:crypto";function withStateDatabaseSchemaMaintenance({databasePath:e,busyTimeoutMs:t},n){if(St(e))return n();let r=se(e),i=Et(r);if(i)return i.assertCurrent(),n();let a;try{a=Dt(r,{busyTimeoutMs:t})}catch(e){throw e instanceof xt?new V(r,e):e}return ke(a,`state schema mutation`,()=>a.run(n))}var V,Nn=e((()=>{s(),ce(),Ot(),De(),Ct(),V=c(Symbol.for(`openclaw.stateSchemaMutationConflictError`),()=>class extends Error{constructor(e,t){super(`OpenClaw refused shared state schema mutation at ${e} because another Gateway owns that state directory. Stop that Gateway or perform the update through its managed restart path, then retry.`,{cause:t}),this.name=`StateSchemaMutationConflictError`}})}));function resolveCronCompletionStatus(e){return e.status===`error`||e.status===`skipped`?`failed`:e.status===`ok`?e.requiredDelivery===void 0?e.delivered===!0||e.deliveryStatus===`delivered`||e.deliveryStatus===`not-requested`?`succeeded`:`unknown`:!e.requiredDelivery||e.deliveryStatus===`delivered`||e.deliveryStatus===`not-delivered`&&e.deliverySuppressionReason!==void 0?`succeeded`:e.deliveryStatus===`not-delivered`?`failed`:`unknown`:`unknown`}function resolveAdmittedCronCompletionStatus(e,t,n,r){return resolveCronCompletionStatus({status:t,deliveryStatus:n,deliverySuppressionReason:r,requiredDelivery:e.delivery?.bestEffort!==!0&&n!==`not-requested`})}var Pn=e((()=>{}));function isCronTimeoutErrorText(e){return typeof e==`string`&&zn.some(t=>e===t||e.startsWith(`${t} `))}var Fn,In,Ln,Rn,zn,Bn=e((()=>{Fn=`cron: job interrupted by gateway restart`,In=`cron: job execution timed out`,Ln=`cron: isolated agent setup timed out before runner start`,Rn=`cron: isolated agent run stalled before execution start`,zn=[In,Ln,Rn]}));function normalizeSeverity(e){return e===`info`||e===`warn`||e===`error`?e:`error`}function normalizeSource(e){switch(e){case`cron-preflight`:case`cron-setup`:case`model-preflight`:case`agent-run`:case`tool`:case`exec`:case`delivery`:return e;default:return`agent-run`}}function normalizeTimestamp$1(e,t){return typeof e==`number`&&Number.isFinite(e)&&e>=0?Math.floor(e):t()}function formatUnknownError(e){return e instanceof Error?e.message||e.name:String(e)}function normalizeExitCode(e){return d(e)??(e===null?null:void 0)}function tailText(e,t){return e.length<=t?e:oe(e,-t)}function normalizeDiagnosticMessage(e,t){if(typeof e!=`string`)return{};let n=o(e);if(!n)return{};let r=t(n);return r.length<=Hn?{message:r}:{message:`${ie(r,999)}…`,truncated:!0}}function normalizeCronRunDiagnosticSummary(e){let t=o(e);if(t)return t.length<=Un?t:`${ie(t,1999)}…`}function normalizeCronRunDiagnosticsCore(e,t){if(!e||typeof e!=`object`)return;let n=e,r=t?.nowMs??Date.now,i=t?.redactText??(e=>e),a=Array.isArray(n.entries)?n.entries:[],o=[];for(let e of a){if(!e||typeof e!=`object`)continue;let t=e,n=normalizeDiagnosticMessage(t.message,i);n.message&&(o.push({ts:normalizeTimestamp$1(t.ts,r),source:normalizeSource(t.source),severity:normalizeSeverity(t.severity),message:n.message,...typeof t.toolName==`string`&&t.toolName.trim()?{toolName:t.toolName.trim()}:{},...typeof t.exitCode==`number`&&Number.isFinite(t.exitCode)?{exitCode:t.exitCode}:t.exitCode===null?{exitCode:null}:{},...t.truncated===!0||n.truncated?{truncated:!0}:{}}),o.length>Vn&&o.shift())}let s=normalizeCronRunDiagnosticSummary(typeof n.summary==`string`?i(n.summary):void 0);if(o.length!==0||s)return{...s?{summary:s}:{},entries:o}}var Vn,Hn,Un,Wn=e((()=>{u(),a(),ae(),Vn=10,Hn=1e3,Un=2e3}));function isJsonValue(e){let t=[e];for(;t.length>0;){let e=t.pop();if(e!==null&&typeof e!=`string`&&typeof e!=`boolean`&&typeof e!=`number`){if(!Array.isArray(e)&&!m(e))return!1;for(let n of Object.values(e))t.push(n)}}return!0}function parseCronRunDetailJson(e){let t=f(e);return isJsonValue(t)?t:void 0}function toJsonValue(e){let t=JSON.stringify(e);return t===void 0?void 0:parseCronRunDetailJson(t)}function isJsonObject(e){return m(e)}function normalizeTimestamp(e){return l(e,{min:0,max:ee})}function isCronRunStatus(e){return Gn.safeParse(e).success}function isCronDeliveryStatus(e){return U.safeParse(e).success}function parseCronRunLogEntryObject(e,t){let n=o(t?.jobId),r=Xn.safeParse(e);if(!r.success)return null;let i=r.data;return n&&i.jobId!==n?null:{ts:i.ts,jobId:i.jobId,action:`finished`,status:i.status,completionStatus:i.completionStatus??resolveCronCompletionStatus({status:i.status,delivered:i.delivered,deliveryStatus:i.deliveryStatus}),error:i.error,errorReason:i.errorReason,summary:i.summary,runId:i.runId,diagnostics:normalizeCronRunDiagnosticsCore(i.diagnostics),runAtMs:i.runAtMs,durationMs:i.durationMs,nextRunAtMs:i.nextRunAtMs,triggerFired:i.triggerFired,model:i.model,provider:i.provider,usage:i.usage,delivered:i.delivered,deliveryStatus:i.deliveryStatus,deliveryError:i.deliveryError,deliverySuppressionReason:i.deliverySuppressionReason,failureNotificationDelivery:i.failureNotificationDelivery,delivery:i.delivery,sessionId:i.sessionId,sessionKey:i.sessionKey}}function cronRunLogEntryToDetail(e,t){return toJsonValue({kind:H,status:e.status,completionStatus:e.completionStatus,error:e.error??null,summary:e.summary??null,storeKey:t.storeKey,errorReason:e.errorReason,diagnostics:e.diagnostics,delivered:e.delivered,deliveryStatus:e.deliveryStatus,deliveryError:e.deliveryError,deliverySuppressionReason:e.deliverySuppressionReason,failureNotificationDelivery:e.failureNotificationDelivery,delivery:e.delivery,sessionId:e.sessionId,runId:e.runId,runAtMs:e.runAtMs,durationMs:e.durationMs,nextRunAtMs:e.nextRunAtMs,triggerFired:e.triggerFired,triggerStateChanged:t.triggerEval?.fired===!0?t.triggerEval.stateChanged:void 0,triggerState:t.triggerEval?.fired===!0&&t.triggerEval.stateChanged?t.triggerEval.state:void 0,scriptStateChanged:t.scriptResult?.scriptStateChanged===!0||void 0,scriptState:t.scriptResult?.scriptStateChanged===!0?t.scriptResult.scriptState:void 0,model:e.model,provider:e.provider,usage:e.usage})??{kind:H}}function cronRunRecordStoreKey(e){return isJsonObject(e.detail)&&typeof e.detail.storeKey==`string`?e.detail.storeKey:void 0}function resolveCronRunRecordTimestamp(e){return e.endedAt??e.lastEventAt??e.createdAt}function compareCronRunRecordsNewestFirst(e,t){return resolveCronRunRecordTimestamp(t)-resolveCronRunRecordTimestamp(e)||t.createdAt-e.createdAt||t.id.localeCompare(e.id)}function cronRunStorageStatus(e){return e.status===`ok`?(e.completionStatus??resolveCronCompletionStatus({status:e.status,delivered:e.delivered,deliveryStatus:e.deliveryStatus}))===`succeeded`?`succeeded`:`failed`:e.status===`error`&&isCronTimeoutErrorText(e.error)?`timed_out`:`failed`}function cronRunRecordToRunLogEntry(e){if(!e.jobId||!isJsonObject(e.detail)||e.detail.kind!==H)return null;let t={...e.detail};return delete t.storeKey,parseCronRunLogEntryObject({error:e.error,summary:e.summary,...t,ts:resolveCronRunRecordTimestamp(e),jobId:e.jobId,action:`finished`,sessionKey:e.sessionKey,runId:typeof e.detail.runId==`string`?e.detail.runId:e.runId},{jobId:e.jobId})}var H,Gn,Kn,U,W,G,qn,K,Jn,Yn,Xn,Zn=e((()=>{ne(),u(),p(),a(),be(),xe(),Pn(),Bn(),Wn(),H=`cron-run`,Gn=_([`ok`,`error`,`skipped`]),Kn=_([`succeeded`,`failed`,`unknown`]),U=_([`delivered`,`not-delivered`,`unknown`,`not-requested`]),W=me().optional().catch(void 0),G=me().refine(e=>e.trim().length>0).optional().catch(void 0),qn=g().optional().transform(e=>normalizeTimestamp(e)),K=g().optional().transform(e=>l(e,{min:0})),Jn=_e({input_tokens:K,output_tokens:K,total_tokens:K,cache_read_tokens:K,cache_write_tokens:K}).transform(e=>Object.values(e).some(e=>e!==void 0)?e:void 0).optional().catch(void 0),Yn=pe({status:U,delivered:ve().optional().catch(void 0),error:W}).transform(({status:e,delivered:t,error:n})=>({status:e,...t===void 0?{}:{delivered:t},...n===void 0?{}:{error:n}})).optional().catch(void 0),Xn=pe({action:ye(`finished`),jobId:me().refine(e=>e.trim().length>0),ts:g().transform(e=>normalizeTimestamp(e)).pipe(ge()),status:Gn.optional().catch(void 0),completionStatus:Kn.optional().catch(void 0),error:W,errorReason:_(Se).optional().catch(void 0),summary:W,runId:G,diagnostics:g().optional(),runAtMs:qn,durationMs:K,nextRunAtMs:qn,triggerFired:g().optional().transform(e=>e===!0||void 0),model:G,provider:G,usage:Jn,delivered:ve().optional().catch(void 0),deliveryStatus:U.optional().catch(void 0),deliveryError:W,deliverySuppressionReason:_([`empty`,`silent`,`heartbeat`,`channel_transform`]).optional().catch(void 0),failureNotificationDelivery:Yn,delivery:he(isJsonObject).optional().catch(void 0),sessionId:G,sessionKey:G})}));function hasLegacyCronRunLogs(e){let t=Ze(e);return t?t.tables.has(`cron_run_logs`):!!e.prepare(`SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'cron_run_logs' LIMIT 1`).get()}function collectMirroredTasks(e){let t=e.prepare(`SELECT source_id, ended_at, detail_json
       FROM task_runs
       WHERE runtime = 'cron' AND source_id IS NOT NULL AND detail_json IS NOT NULL`).all(),n=/* @__PURE__ */ new Map;for(let e of t){let t=e.detail_json?te(e.detail_json):void 0;if(!e.source_id||t?.kind!==`cron-run`)continue;let r=n.get(e.source_id)??[];r.push({endedAt:k(e.ended_at)??null,...typeof t.runId==`string`&&t.runId?{runId:t.runId}:{}}),n.set(e.source_id,r)}return n}function hasMirroredIdentity(e,t,n){return e.some(e=>t&&e.runId?e.runId===t:e.endedAt===n)}function integerToBoolean(e){return e==null?void 0:bt(e)!==0}function parseLegacyRow(e){let t=parseCronRunLogEntryObject(f(e.entry_json??``),{jobId:e.job_id});return t?{...t,ts:k(e.ts)??t.ts,jobId:e.job_id,status:e.status??t.status,error:e.error??t.error,summary:e.summary??t.summary,delivered:integerToBoolean(e.delivered)??t.delivered,deliveryStatus:e.delivery_status??t.deliveryStatus,deliveryError:e.delivery_error??t.deliveryError,sessionId:e.session_id??t.sessionId,sessionKey:e.session_key??t.sessionKey,runId:e.run_id??t.runId,runAtMs:k(e.run_at_ms??null)??t.runAtMs,durationMs:k(e.duration_ms??null)??t.durationMs,nextRunAtMs:k(e.next_run_at_ms??null)??t.nextRunAtMs,model:e.model??t.model,provider:e.provider??t.provider}:null}function migrateLegacyCronRunLogsToTaskRuns(e){if(!hasLegacyCronRunLogs(e))return{imported:0,alreadyMirrored:0,malformed:0,skipped:!0};let t=collectMirroredTasks(e),n=/* @__PURE__ */ new Map,r=e.prepare(`
    INSERT INTO task_runs (
      task_id, runtime, task_kind, source_id, requester_session_key, owner_key, scope_kind,
      child_session_key, parent_flow_id, parent_task_id, agent_id, requester_agent_id, run_id,
      label, task, status, delivery_status, notify_policy, created_at, started_at, ended_at,
      last_event_at, cleanup_after, error, progress_summary, terminal_summary, terminal_outcome,
      detail_json
    ) VALUES (
      @task_id, 'cron', NULL, @source_id, '', '', 'system', @child_session_key, NULL, NULL,
      NULL, NULL, @run_id, NULL, @task, @status, 'not_applicable', 'silent', @created_at,
      @started_at, @ended_at, @ended_at, NULL, @error, NULL, @terminal_summary,
      @terminal_outcome, @detail_json
    )
  `),i=0,a=0,o=0,s=0;for(;;){let c=e.prepare(`SELECT * FROM cron_run_logs
         ORDER BY job_id, ts, store_key, seq
         LIMIT ? OFFSET ?`).all($n,s);if(c.length===0)break;s+=c.length;for(let e of c){let s=parseLegacyRow(e);if(!s){o++;continue}let c=`${s.jobId}\0${s.ts}`,l=(n.get(c)??0)+1;if(n.set(c,l),hasMirroredIdentity(t.get(s.jobId)??[],s.runId,s.ts)){a++;continue}let u=`cron-runlog-import:${s.jobId}:${s.ts}:${l}`,d=cronRunStorageStatus(s);r.run({task_id:u,source_id:s.jobId,child_session_key:s.sessionKey?.trim()||null,run_id:u,task:s.jobId,status:d,created_at:s.runAtMs??s.ts,started_at:s.runAtMs??null,ended_at:s.ts,error:s.error??null,terminal_summary:s.summary??null,terminal_outcome:d===`succeeded`?`succeeded`:null,detail_json:JSON.stringify(cronRunLogEntryToDetail(s,{storeKey:e.store_key}))}),i++}}e.exec(`
    DROP INDEX IF EXISTS idx_cron_run_logs_store_ts;
    DROP INDEX IF EXISTS idx_cron_run_logs_job_status;
    DROP INDEX IF EXISTS idx_cron_run_logs_delivery;
    DROP TABLE cron_run_logs;
  `);let c={imported:i,alreadyMirrored:a,malformed:o,skipped:!1},l=Date.now();return e.prepare(`INSERT INTO migration_runs (id, started_at, finished_at, status, report_json)
     VALUES (?, ?, ?, 'completed', ?)
     ON CONFLICT(id) DO UPDATE SET
       finished_at = excluded.finished_at,
       status = excluded.status,
       report_json = excluded.report_json`).run(Qn,l,l,JSON.stringify(c)),c}var Qn,$n,er=e((()=>{re(),Zn(),yt(),Je(),Qn=`state:cron-run-logs-to-task-runs:v1`,$n=500}));function migrateCronDeliveryAttemptState(e,t){return t<20&&P(e,`cron_run_receipts`)?N(e,`cron_run_receipts`,`delivery_attempt_state TEXT NOT NULL DEFAULT 'unknown' CHECK (delivery_attempt_state IN ('unknown', 'not-started', 'started'))`):!1}var tr=e((()=>{M()}));function getAuditRecordKysely(e){return Pe(e)}function parseAuditRecord(e){return{key:e.event_key,value:JSON.parse(e.payload_json),createdAt:e.created_at,sequence:e.sequence}}function readAuditWriteState(e){let t=v(e.database,getAuditRecordKysely(e.database).selectFrom(`diagnostic_events`).select(t=>[t.fn.max(`sequence`).filterWhere(`sequence`,e.legacy?`<`:`>=`,0).as(`sequence`),t.fn.countAll().as(`count`),t.fn.countAll().filterWhere(`event_key`,`=`,e.key??``).as(`keyCount`)]).where(`scope`,`=`,e.scope)),n=(t?.sequence??(e.legacy?nr:0))+1;if(!Number.isSafeInteger(n)||e.legacy&&n>=0)throw Error(`Audit sequence exhausted for scope ${e.scope}`);return{nextSequence:n,count:bt(t?.count??0),keyExists:bt(t?.keyCount??0)>0}}function pruneAuditRecords(e){let t=e.count-e.maxEntries;if(t<=0)return;let n=e.protectedKey,r=getAuditRecordKysely(e.database).selectFrom(`diagnostic_events`).select(`event_key`).where(`scope`,`=`,e.scope),i=(n===void 0?r:r.where(`event_key`,`!=`,n)).orderBy(`sequence`,`asc`).limit(t);y(e.database,getAuditRecordKysely(e.database).deleteFrom(`diagnostic_events`).where(`scope`,`=`,e.scope).where(`event_key`,`in`,i))}function prepareSqliteAuditRecord(e,t){let n=JSON.stringify(t.value);if(n===void 0)throw Error(`Audit record ${e}/${t.key} is not JSON-serializable`);return{event_key:t.key,payload_json:n,created_at:t.createdAt}}function createAuditRecordInsert(e){return Ie(e,t=>getAuditRecordKysely(e).insertInto(`diagnostic_events`).values({scope:t(e=>e.scope),event_key:t(e=>e.event_key),payload_json:t(e=>e.payload_json),created_at:t(e=>e.created_at),sequence:t(e=>e.sequence)}).onConflict(e=>e.columns([`scope`,`event_key`]).doNothing()))}function createSqliteAuditRecordKernel(e,t){let n=t.scope,r=t.maxEntries,prune=(t,i)=>pruneAuditRecords({database:e,scope:n,maxEntries:r,count:t,protectedKey:i}),selectEntries=()=>getAuditRecordKysely(e).selectFrom(`diagnostic_events`).select([`event_key`,`payload_json`,`created_at`,`sequence`]).where(`scope`,`=`,n);function insertRecord(t){return Number(rr(e)({...t,scope:n}).numAffectedRows??0)}function upsertPreparedRecord(t){let r=readAuditWriteState({database:e,scope:n,legacy:!1,key:t.event_key});y(e,getAuditRecordKysely(e).insertInto(`diagnostic_events`).values({scope:n,event_key:t.event_key,payload_json:t.payload_json,created_at:t.created_at,sequence:r.nextSequence}).onConflict(e=>e.columns([`scope`,`event_key`]).doUpdateSet({payload_json:t.payload_json,created_at:t.created_at}))),prune(r.count+ +!r.keyExists,t.event_key)}function deleteRecord(t){y(e,getAuditRecordKysely(e).deleteFrom(`diagnostic_events`).where(`scope`,`=`,n).where(`event_key`,`=`,t))}return{register(t){let r=readAuditWriteState({database:e,scope:n,legacy:!1}),i=insertRecord({...t,sequence:r.nextSequence});prune(r.count+i,t.event_key)},upsert:upsertPreparedRecord,delete:deleteRecord,compareAndSet(t,r,i){return(v(e,getAuditRecordKysely(e).selectFrom(`diagnostic_events`).select(`payload_json`).where(`scope`,`=`,n).where(`event_key`,`=`,t))?.payload_json??null)===r&&(i?upsertPreparedRecord(i):deleteRecord(t),!0)},registerLegacyMany(t){let r=readAuditWriteState({database:e,scope:n,legacy:!0}),i=r.nextSequence,a=r.count;for(let e of t)a+=insertRecord({...e,sequence:i}),i+=1;prune(a)},entries(){return y(e,selectEntries().orderBy(`sequence`,`asc`)).rows.map(e=>{let{sequence:t,...n}=parseAuditRecord(e);return n})},latest(t){let n=selectEntries(),r=t.beforeSequence===void 0?n:n.where(`sequence`,`<`,t.beforeSequence);return y(e,r.orderBy(`sequence`,`desc`).limit(t.limit)).rows.map(e=>parseAuditRecord(e))}}}var nr,rr,ir=e((()=>{Fe(),yt(),nr=-(2**53-1),rr=Ne(createAuditRecordInsert)}));function reprojectLegacyCronJson(e){let t=ar.map(([t])=>F(e,`cron_jobs`,t)?x(t):`NULL AS ${x(t)}`),n=F(e,`cron_jobs`,`last_run_status`)?`last_run_status`:`NULL AS last_run_status`,r=e.prepare(`SELECT store_key, job_id, enabled, job_json, state_json, ${n}, ${t.join(`, `)}
         FROM cron_jobs`).all(),i=e.prepare(`UPDATE cron_jobs SET job_json = ?, state_json = ? WHERE store_key = ? AND job_id = ?`);for(let e of r){if(typeof e.store_key!=`string`||typeof e.job_id!=`string`||typeof e.job_json!=`string`||typeof e.state_json!=`string`)throw Error(`OpenClaw v12 cron job row is not canonical`);let t=h(f(e.job_json)),n=h(f(e.state_json));if(!t||!n)continue;let r=!1,a=h(t.delivery),o=h(a?.failureDestination);if((!Object.hasOwn(t,`delivery`)||a!==null)&&(!a||!Object.hasOwn(a,`failureDestination`)||o!==null)){let n=a??{},i=o??{};for(let[t,n]of ar){let a=e[t];typeof a!=`string`||Object.hasOwn(i,n)||(i[n]=a===``?null:a,r=!0)}r&&(n.failureDestination=i,t.delivery=n)}typeof t.enabled!=`boolean`&&(t.enabled=e.enabled!==0,r=!0);let s=Object.hasOwn(n,`lastStatus`);!Object.hasOwn(n,`lastRunStatus`)&&(s||typeof e.last_run_status==`string`)&&(n.lastRunStatus=s?n.lastStatus:e.last_run_status,r=!0),r&&i.run(JSON.stringify(t),JSON.stringify(n),e.store_key,e.job_id)}}function rebuildJsonCanonicalTable(e,t){let n=`${t}_migration_v13`;if(P(e,n))throw Error(`OpenClaw v13 migration table already exists: ${n}`);let r=S(w,t,{errorMessage:`Canonical ${t} schema block is missing`}).replace(`CREATE TABLE IF NOT EXISTS ${t} (`,`CREATE TABLE ${n} (`);e.exec(r);let i=e.prepare(`PRAGMA table_xinfo(${n})`).all().flatMap(e=>e.hidden===0&&typeof e.name==`string`?[e.name]:[]),a=i.map(n=>yn.some(e=>e.tableName===t&&e.columnName===n)&&!F(e,t,n)?`NULL`:x(n));e.exec(`INSERT INTO ${n} (${i.map(x).join(`, `)}) SELECT ${a.join(`, `)} FROM ${t};`),e.exec(`DROP TABLE ${t};`),e.exec(`ALTER TABLE ${n} RENAME TO ${t};`)}function migrateJsonCanonicalWideRowsV13(e,t){if(t>=13)return!1;let n=!1;P(e,`cron_jobs`)&&F(e,`cron_jobs`,`schedule_kind`)&&(reprojectLegacyCronJson(e),rebuildJsonCanonicalTable(e,`cron_jobs`),n=!0);let r=P(e,`workspace_setup_state`),i=P(e,`workspace_attestations`);if(r&&!F(e,`workspace_setup_state`,`attested_at_ms`)&&(e.exec(`ALTER TABLE workspace_setup_state ADD COLUMN attested_at_ms INTEGER;`),e.exec(`ALTER TABLE workspace_setup_state ADD COLUMN attestation_updated_at_ms INTEGER;`),rebuildJsonCanonicalTable(e,`workspace_setup_state`),n=!0),i){e.exec(`
      UPDATE workspace_setup_state
         SET attested_at_ms = (
               SELECT attested_at_ms FROM workspace_attestations
                WHERE workspace_attestations.workspace_key = workspace_setup_state.workspace_key
             ),
             attestation_updated_at_ms = (
               SELECT updated_at_ms FROM workspace_attestations
                WHERE workspace_attestations.workspace_key = workspace_setup_state.workspace_key
             )
       WHERE workspace_key IN (SELECT workspace_key FROM workspace_attestations);
    `);let t=P(e,`workspace_path_aliases`)?`(SELECT alias.workspace_path FROM workspace_path_aliases alias
           WHERE alias.workspace_key = a.workspace_key LIMIT 1)`:`NULL`;e.exec(`
      INSERT INTO workspace_setup_state (
        workspace_key, workspace_path, attested_at_ms, attestation_updated_at_ms
      )
      SELECT a.workspace_key,
             ${t},
             a.attested_at_ms,
             a.updated_at_ms
        FROM workspace_attestations a
       WHERE a.workspace_key NOT IN (SELECT workspace_key FROM workspace_setup_state);
    `),e.exec(`DROP TABLE workspace_attestations;`),n=!0}(r||i)&&P(e,`workspace_generated_bootstrap_hashes`)&&(rebuildJsonCanonicalTable(e,`workspace_generated_bootstrap_hashes`),e.exec(`
      DELETE FROM workspace_generated_bootstrap_hashes
       WHERE workspace_key NOT IN (SELECT workspace_key FROM workspace_setup_state);
    `));for(let[t,r,i]of[[`auth_profile_stores`,`store_json`,`authProfiles.store`],[`auth_profile_state`,`state_json`,`authProfiles.state`]])P(e,t)&&(e.prepare(`INSERT INTO config_machine_state (state_key, value_json, updated_at_ms)
       SELECT ?, ${r}, updated_at FROM ${t} WHERE store_key = 'shared'
       ON CONFLICT(state_key) DO NOTHING`).run(i),e.exec(`DROP TABLE ${t};`),n=!0);if(P(e,`installed_plugin_index`)){let t=e.prepare(`SELECT * FROM installed_plugin_index WHERE index_key = 'installed-plugin-index'`).get();if(t){let n=h(f(String(t.install_records_json))),r=f(String(t.plugins_json)),i=f(String(t.diagnostics_json));if(!n||!Array.isArray(r)||!Array.isArray(i)){let n=`plugins.installedIndex.quarantine`,r=`Preserved invalid legacy installed_plugin_index row in diagnostic_events (${n}). Run openclaw doctor --fix or openclaw plugins registry --refresh to repair the plugin index; inspect the preserved row if install records need recovery.`;createSqliteAuditRecordKernel(e,{scope:n,maxEntries:2**53-1}).register(prepareSqliteAuditRecord(n,{key:Mn(`sha256`).update(JSON.stringify(t)).digest(`hex`),value:{level:`warn`,message:r,raw:t},createdAt:Date.now()})),qe(e,()=>fe(`state/db`).warn(r))}let a={version:Number(t.version),...typeof t.warning==`string`&&t.warning?{warning:t.warning}:{},hostContractVersion:t.host_contract_version,compatRegistryVersion:t.compat_registry_version,migrationVersion:Number(t.migration_version),policyHash:t.policy_hash,generatedAtMs:Number(t.generated_at_ms),...typeof t.workspace_dir==`string`?{workspaceDir:t.workspace_dir}:{},...typeof t.refresh_reason==`string`&&t.refresh_reason?{refreshReason:t.refresh_reason}:{},installRecords:n,plugins:r,diagnostics:i};e.prepare(`INSERT INTO config_machine_state (state_key, value_json, updated_at_ms)
         VALUES (?, ?, ?) ON CONFLICT(state_key) DO NOTHING`).run(`plugins.installedIndex`,JSON.stringify({revision:Number(t.updated_at_ms),index:a}),Number(t.updated_at_ms))}e.exec(`DROP TABLE installed_plugin_index;`),n=!0}return P(e,`subagent_runs`)&&F(e,`subagent_runs`,`task`)&&(bn(e),rebuildJsonCanonicalTable(e,`subagent_runs`),n=!0),n}var ar,or=e((()=>{re(),p(),ir(),Ge(),C(),de(),_n(),Cn(),M(),b(),ar=[[`failure_delivery_mode`,`mode`],[`failure_delivery_channel`,`channel`],[`failure_delivery_to`,`to`],[`failure_delivery_account_id`,`accountId`]]}));function migratePredicateColumnsV21(e,t){if(t>=21)return!1;let n=!1,text=(e,t)=>`CASE WHEN json_valid(${e}) THEN CASE WHEN json_type(${e}, '${t}') = 'text' THEN json_extract(${e}, '${t}') END END`;if(P(e,`meeting_transcript_sessions`)){let t=[`accountId`,`guildId`,`channelId`,`meetingUrl`,`threadTs`,`fileId`],r=[`source_account_id`,`source_guild_id`,`source_channel_id`,`source_meeting_url`,`source_thread_ts`,`source_file_id`];for(let t of[...r,`metadata_agent_id`])n=N(e,`meeting_transcript_sessions`,`${t} TEXT`)||n;e.exec(`UPDATE meeting_transcript_sessions SET
      ${r.map((e,n)=>`${e} = ${text(`source_json`,`$.${t[n]}`)}`).join(`,`)},
      metadata_agent_id = ${text(`metadata_json`,`$.agentId`)}`)}return P(e,`meeting_transcript_summaries`)&&(n=N(e,`meeting_transcript_summaries`,`overview TEXT`)||n,e.exec(`UPDATE meeting_transcript_summaries SET overview = ${text(`summary_json`,`$.overview`)}`)),P(e,`delivery_queue_entries`)&&(n=N(e,`delivery_queue_entries`,`retention_id_prefix TEXT`)||n,n=N(e,`delivery_queue_entries`,`retention_max_age_ms INTEGER`)||n,n=N(e,`delivery_queue_entries`,`retention_max_entries INTEGER`)||n,e.exec(`UPDATE delivery_queue_entries SET
      (retention_id_prefix, retention_max_age_ms, retention_max_entries) = (
        SELECT id_prefix, max_age_ms, max_entries FROM (
          SELECT json_extract(entry_json, '$.completionRetention.idPrefix') id_prefix,
            json_extract(entry_json, '$.completionRetention.maxAgeMs') max_age_ms,
            json_extract(entry_json, '$.completionRetention.maxEntries') max_entries
          WHERE json_valid(entry_json)
            AND json_type(entry_json, '$.completionRetention') = 'object'
        ) WHERE typeof(id_prefix) = 'text' AND id_prefix <> ''
          AND substr(id, 1, length(id_prefix)) = id_prefix
          AND typeof(max_age_ms) = 'integer' AND max_age_ms BETWEEN 1 AND 9007199254740991
          AND typeof(max_entries) = 'integer' AND max_entries BETWEEN 1 AND 9007199254740991
      )`)),n}var sr=e((()=>{M()}));function migratePortableIdentityColumnsV22(e,t){if(t>=22)return!1;let n=!1,r=Ze(e)??Xe(e);for(let t of q){if(!P(e,t)||F(e,t,`cursor_id`))continue;let i=r.tableSql.get(t);if(typeof i!=`string`)throw Error(`Missing v22 cursor migration schema: ${t}`);let a=x(`${t}_migration_v22`),o=x(t),s=[...Bt(e,t)].map(x).join(`, `);e.exec(`CREATE TABLE ${a} (cursor_id INTEGER NOT NULL, ${i.slice(i.indexOf(`(`)+1)};
      INSERT INTO ${a} (rowid, ${s}, cursor_id) SELECT rowid, ${s}, rowid FROM ${o} ORDER BY rowid;
      DROP TABLE ${o};
      ALTER TABLE ${a} RENAME TO ${o};`);for(let n of[...r.indexDefinitions.values(),...r.triggers.values()])n.table===t&&typeof n.sql==`string`&&e.exec(n.sql);n=!0}if(P(e,`acp_sessions`)){n=N(e,`acp_sessions`,`resume_agent_session_id TEXT`)||n,n=N(e,`acp_sessions`,`resume_acpx_session_id TEXT`)||n;let t=`CASE WHEN json_valid(identity_json) THEN identity_json END`,r=`char(9,10,11,12,13,32,160,5760,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,65279)`;e.exec(`UPDATE acp_sessions SET
      resume_agent_session_id = CASE WHEN json_type(${t}, '$.agentSessionId') = 'text'
        THEN trim(json_extract(${t}, '$.agentSessionId'), ${r}) END,
      resume_acpx_session_id = CASE WHEN json_type(${t}, '$.acpxSessionId') = 'text'
        THEN trim(json_extract(${t}, '$.acpxSessionId'), ${r}) END;
      DROP INDEX IF EXISTS idx_acp_sessions_resume_agent;
      DROP INDEX IF EXISTS idx_acp_sessions_resume_acpx;`)}return n}var q,cr=e((()=>{Ye(),Je(),C(),M(),q=[`operator_approvals`,`cron_run_receipts`,`execution_decision_facts`,`skill_workshop_changes`]}));function readOwnershipWorkerReply(e,t){let n;try{n=JSON.parse(e)}catch{throw j(`returned invalid ownership JSON`,t)}if(!m(n)||Object.keys(n).length!==2||typeof n.ok!=`boolean`)throw j(`returned an invalid ownership result`,t);if(n.ok&&typeof n.ownershipJson==`string`)return n.ownershipJson;if(!n.ok&&`workerError`in n){let e=/* @__PURE__ */ Error(`Shared-state ownership inspection failed`);throw Lt(e,n.workerError),Rt(e,{includeOrdinary:!0})}throw j(`returned an invalid ownership result`,t)}function inspectOpenClawStateOwnershipWithWorker(e,n){return Nt(n,n=>{n?.throwIfAborted();let{moduleUrl:i,runtimeGeneration:a}=At(r(`stateOwnership`));return It({pathname:e,operation:`state ownership`,argv:[...t(i),e],runtimeGeneration:a,signal:n,stoppedFailure:`ownership owner stopped`,read:e=>{if(n?.throwIfAborted(),e.failure)throw j(e.failure,e.stderr);return readOwnershipWorkerReply(e.stdout,e.stderr)}})})}var lr=e((()=>{p(),i(),kt(),n(),Mt(),Pt(),zt()}));function isOpenClawStateWriteContentionError(e){return e instanceof xt||e instanceof V||at(e)}function parseExternalOwnership(e,t){let n;try{n=JSON.parse(e)}catch{throw new Oe(t,`reserved value is not valid JSON`)}let r=m(n)?n:void 0,i=r?Object.keys(r).toSorted().join(`,`):``,a=r?.managerId,o=r?.claimedAt;if(i!==`claimedAt,managerId,mode,version`||r?.version!==1||r?.mode!==`external`||typeof a!=`string`||!fr.test(a)||typeof o!=`number`||!Number.isSafeInteger(o)||o<0||o>dr)throw new Oe(t,`reserved value does not match the version 1 external ownership contract`);return{version:1,mode:`external`,managerId:a,claimedAt:o}}function inspectOpenClawStateOwnershipFromDatabase(e,t,n=!1){try{if(!n&&!P(e,`config_machine_state`))return null;let r=n||Le(e)?`SELECT value_json FROM config_machine_state WHERE state_key = ? LIMIT 1`:`SELECT value_json FROM config_machine_state NOT INDEXED WHERE state_key = ? LIMIT 1`,i=e.prepare(r).get(ur);if(!i)return null;if(typeof i.value_json!=`string`)throw new Oe(t,`reserved value is not text`);return parseExternalOwnership(i.value_json,t)}catch(e){throw Jt(e,t)}}function inspectOwnershipThroughConnection(e,t,n){let r=it(()=>Qe(e,{readOnly:!0})),i;try{return i=n?.(r),r.exec(`PRAGMA busy_timeout = ${dt}; PRAGMA query_only = ON; PRAGMA trusted_schema = OFF;`),inspectOpenClawStateOwnershipFromDatabase(r,t)}finally{try{i?.()}finally{r.close()}}}function assertOwnershipAllowsWrite(e,t,n){if(e&&!Me(n))throw new Ae(t,e.managerId)}async function assertOpenClawStateWriteAllowedAtPath(e){e.signal?.throwIfAborted();let t=B.resolve(e.databasePath);if(A(t),e.recoverOrphanedSidecars!==!1&&tt(t)&&withStateDatabaseSchemaMaintenance({databasePath:t},()=>et(t)),!jn(t))return;let n=e.env??process.env;if(!e.openStateSchemaReadAdmission&&!Tt()&&!Et(t)){let r=await inspectOpenClawStateOwnershipWithWorker(t,e.signal);e.signal?.throwIfAborted(),A(t),assertOwnershipAllowsWrite(r===`null`?null:parseExternalOwnership(r,t),t,n);return}let r=await Kt(t,{preserveSourceArtifacts:!0,signal:e.signal}),i=!1;try{e.signal?.throwIfAborted(),A(t),assertOwnershipAllowsWrite(inspectOwnershipThroughConnection(r.location,t,e.openStateSchemaReadAdmission),t,n),i=!0}finally{await r.cleanupAsync().catch(e=>{if(!i||!jt(e,r.cleanupRoot))throw e})}}function assertOpenClawStateWriteAllowed(e){let t=B.resolve(e.databasePath);A(t);let n=e.inspectOwnership?void 0:ze(e.database,J);if(n===void 0){let r=inspectOpenClawStateOwnershipFromDatabase(e.database,t,e.schemaReady);n=e.inspectOwnership?void 0:ze(e.database,J),n===void 0&&(n=r,He(e.database,J,n))}assertOwnershipAllowsWrite(n,t,e.env??process.env)}var ur,dr,fr,J,pr=e((()=>{p(),Ot(),je(),$e(),Re(),Be(),rt(),nt(),De(),Ft(),ht(),qt(),mt(),_t(),Nn(),wt(),D(),M(),Xt(),lr(),ur=`gateway.supervision`,dr=864e13,fr=/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u,J={name:`state.external-ownership`,read(e){if(e===null)return null;if(m(e)&&e.version===1&&e.mode===`external`&&typeof e.managerId==`string`&&typeof e.claimedAt==`number`)return{version:1,mode:`external`,managerId:e.managerId,claimedAt:e.claimedAt}}}}));function getOpenClawStateCanonicalNamedIndexSet(){return xr??=new Set(ln(w).map(e=>e.name)),xr}function getOpenClawStateRuntimeSchema(e){let{includeVersionLazyAdditiveTables:t,includeAgentDeletionJournal:n=!0}=e,r=`${t}:${n}`,i=Sr.get(r);if(i!==void 0)return i;let a=w,o=[...t?ut:E,...n?[]:O],s=t?lt:ct;for(let e of o)a=a.replace(S(a,e,{errorMessage:`lazy additive state schema block is missing for ${e}`}),``);for(let e of s){let t=a.indexOf(`CREATE INDEX IF NOT EXISTS ${e}`),n=a.indexOf(`CREATE UNIQUE INDEX IF NOT EXISTS ${e}`),r=t>=0?t:n,i=r>=0?a.indexOf(`;`,r):-1;if(r<0||i<0)throw Error(`lazy additive state schema index is missing for ${e}`);a=`${a.slice(0,r)}${a.slice(i+1)}`}return Sr.set(r,a),a}function isOpenClawStateStartupRepairableSchemaIssue(e){return e.code===`missing-table`?yr.has(e.objectName):e.code===`missing-column`?_r.has(e.objectName):e.code===`missing-or-drifted-index`&&getOpenClawStateCanonicalNamedIndexSet().has(e.objectName)}function isOpenClawStateFirstUseSchemaIssue(e){return e.code===`missing-column`&&gr.has(e.objectName)}var mr,hr,gr,_r,vr,yr,br,xr,Sr,Cr,Y,wr,Tr=e((()=>{z(),C(),_n(),D(),b(),mr=yn.map(({columnName:e,tableName:t})=>`${t}.${e}`),hr=vn.map(({columnName:e,tableName:t})=>`${t}.${e}`),gr=new Set(hr),_r=/* @__PURE__ */ new Set([...hn.map(({columnName:e,tableName:t})=>`${t}.${e}`),...Object.values(gn).flat().map(([e,t])=>`${e}.${t.split(` `,1)[0]}`)]),vr=[`worker_session_tool_operations`,`worker_turn_tool_authorities`],yr=new Set(vr),br=[`idx_meeting_transcript_utterances_id`,`idx_operator_approvals_source_run_resolved`,`idx_task_runs_requester_session_key`,`idx_worker_session_placements_environment`],Sr=/* @__PURE__ */ new Map,Cr={allowCompatibleAdditiveColumns:!0,allowedMissingTables:O,allowedMissingColumns:hr,allowedColumnDefinitions:{"diagnostic_events.sequence":[`sequence INTEGER NOT NULL DEFAULT 0`],"claw_package_refs.package_integrity":[`package_integrity TEXT NOT NULL DEFAULT 'sha256:0000000000000000000000000000000000000000000000000000000000000000'`],"claw_package_refs.updated_at_ms":[`updated_at_ms INTEGER NOT NULL DEFAULT 0`],"cron_jobs.enabled":[`enabled INTEGER NOT NULL DEFAULT 1`],"cron_jobs.name":[`name TEXT NOT NULL DEFAULT ''`],"cron_jobs.payload_kind":[`payload_kind TEXT NOT NULL DEFAULT 'message'`],"current_conversation_bindings.conversation_kind":[`conversation_kind TEXT NOT NULL DEFAULT 'channel'`],"operator_approvals.resolution_ref":[`resolution_ref TEXT`],"worker_environments.desktop_json":[`desktop_json TEXT`],"worker_environments.bootstrap_install_kind":[`bootstrap_install_kind TEXT`],"worker_environments.shared_host":[`shared_host INTEGER CHECK (shared_host IN (0, 1))`],"worker_environments.node_setup_id":[`node_setup_id TEXT`],"worker_environments.node_device_id":[`node_device_id TEXT`],"worker_session_placements.terminal_reason":[`terminal_reason TEXT`],"worker_session_placements.terminal_at_ms":[`terminal_at_ms INTEGER`]}},Y={...Cr,excludedTables:E,excludedIndexes:ct},wr={...Cr,allowedMissingTables:[...E,...vr,...O],allowedMissingIndexes:br,allowedMissingColumns:mr}}));function repairDanglingSkillWorkshopCollectionReviewIndex(e){return An(e)?On(e,()=>{e.prepare(`UPDATE sqlite_schema SET sql = ? WHERE type = 'index' AND name = ?`).run(`CREATE INDEX ${Zt} ON skill_workshop_collection_reviews(create_time DESC, review_id DESC)`,Zt);let t=e.prepare(`PRAGMA schema_version`).get(),n=typeof t.schema_version==`number`?t.schema_version:0;return e.exec(`PRAGMA schema_version = ${n+1}; PRAGMA writable_schema = OFF;`),e.exec(`DROP INDEX ${Zt};`),!0}):!1}function prepareStateDatabaseSchemaRepair(e,t,n){let r=An(e),assertWriteAllowed=()=>assertOpenClawStateWriteAllowed({database:e,databasePath:t,env:n,inspectOwnership:!0}),admit=()=>{R(e,t),r&&assertWriteAllowed()};return r?On(e,admit):admit(),()=>(r?On(e,assertWriteAllowed):assertWriteAllowed(),repairDanglingSkillWorkshopCollectionReviewIndex(e)?[`Removed dangling legacy Skill Workshop review index`]:[])}function assertOpenClawStateDatabaseOwner(e,t){let n=Qt(e);if(n&&rn(e))return{schema_version:n.userVersion};let r=P(e,`schema_meta`),i;try{i=r?e.prepare(`SELECT role, schema_version FROM schema_meta WHERE meta_key = 'primary' LIMIT 1`).get():void 0}catch(t){throw Wt(e,`schema_meta`,[`meta_key`,`role`,`schema_version`],t)}if(i?.role!==`global`){let e=typeof i?.role==`string`?i.role:`missing`;throw new I(`OpenClaw state database ${t.pathname} has schema role ${e}; expected global. Run openclaw doctor --fix to inspect and repair its ownership.`)}return i}function assertOpenClawStateDatabaseForMaintenance(e,t,n){Le(e)&&Ut(`postgres`,`repair`);let r=R(e,t.pathname,t.schemaVersions);if((t.schemaVersions?.contentVersion??L(e))!==22)throw new I(`OpenClaw state database ${t.pathname} uses schema version ${r}; run openclaw doctor --fix before compacting it.`);let i=assertOpenClawStateDatabaseOwner(e,t);if(i?.schema_version!==r){let e=typeof i?.schema_version==`number`?i.schema_version:`invalid`;throw new I(`OpenClaw state database ${t.pathname} metadata schema version ${e} does not match ${r}; run openclaw doctor --fix before compacting it.`)}dn(e,t.pathname,w,wr,n)}function assertOpenClawStateDatabaseVersionForMigration(e,t){let n=pt(e);if(L(e)!==t.version)throw new I(`OpenClaw state database ${t.pathname} uses schema version ${n}; expected ${t.version} before migrating it.`);let r=assertOpenClawStateDatabaseOwner(e,t);if(r?.schema_version!==n){let e=typeof r?.schema_version==`number`?r.schema_version:`invalid`;throw new I(`OpenClaw state database ${t.pathname} metadata schema version ${e} does not match ${n}; repair the ownership metadata before migrating it.`)}pn(e,t.pathname,w,{allowedMissingTables:[...t.version===5?Dr:t.version<13?Er:E,...O]})}function markCurrentStateSchemaVersion(e,t={}){if(!P(e,`audit_events`))return;let n=Tn(e);if(e.exec(`PRAGMA user_version = ${n};`),$t(e,{userVersion:n,contentVersion:22}),P(e,`schema_meta`)&&[`meta_key`,`schema_version`,`updated_at`].every(t=>F(e,`schema_meta`,t))){let r=Date.now();if(t.createMetadataIfMissing){e.prepare(`INSERT INTO schema_meta (
           meta_key, role, schema_version, agent_id, app_version, created_at, updated_at
         ) VALUES ('primary', 'global', ?, NULL, NULL, ?, ?)
         ON CONFLICT(meta_key) DO UPDATE SET
           schema_version = excluded.schema_version,
           updated_at = excluded.updated_at`).run(n,r,r);return}e.prepare(`UPDATE schema_meta SET schema_version = ?, updated_at = ? WHERE meta_key = 'primary'`).run(n,r)}}function migrateCronCreatorNamespaces(e,t){return t>=14||!P(e,`cron_jobs`)?!1:(e.exec(`
    UPDATE cron_jobs
       SET job_json = json_set(job_json, '$.createdActor.source', 'unknown')
     WHERE json_valid(job_json)
       AND json_extract(job_json, '$.createdActor.type') = 'human';
  `),!0)}function migrateConversationBindingTargets(e,t){if(t>=15)return!1;let n=[`target_agent_id`,`target_session_id`].filter(t=>F(e,`current_conversation_bindings`,t));if(n.length===0)return!1;e.exec(`DROP INDEX IF EXISTS idx_current_conversation_bindings_target;`);for(let t of n)e.exec(`ALTER TABLE current_conversation_bindings DROP COLUMN ${t};`);return!0}function migratePreparedWorkerOwnership(e,t){if(t>=17||!P(e,`worker_environments`))return!1;let n=w.indexOf(`CREATE TABLE IF NOT EXISTS worker_environments (`),r=w.indexOf(`
) STRICT;`,n);if(n<0||r<n)throw Error(`OpenClaw worker environment schema marker is missing.`);let i=Ue(w.slice(n+48,r)).map(e=>e.trim()).filter(e=>e.startsWith(`last_activated_at_ms `)||e.startsWith(`preparation_`)),a=!1;for(let t of i)a=N(e,`worker_environments`,t)||a;return a}function migrateGitHubPublicationRequesterAuthority(e,t){if(t>=18)return!1;let n=!1;for(let t of[`github_publication_session_lifecycles`,`github_repository_publication_requests`])P(e,t)&&(n=N(e,t,`requester_authority_json TEXT`)||n);return n}function migrateBoundedStateSchema(e,t,n={}){let r=[Ar,jr].filter(({version:e})=>e>t);if(t>=22||r.length!==22-t)return;let i=new Set(r.flatMap(e=>e.tables)),a=ln(w).filter(e=>i.has(e.tableName));if(!n.versionMigrationOnly&&(P(e,`cron_run_logs`)||fn(e,`

CREATE TABLE IF NOT EXISTS mcp_oauth_stores (
  store_key TEXT NOT NULL PRIMARY KEY,
  format_version INTEGER NOT NULL CHECK (format_version = 1),
  store_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS mcp_oauth_pending_authorizations (
  state TEXT NOT NULL PRIMARY KEY,
  store_key TEXT NOT NULL,
  create_time INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS diagnostic_events (
  scope TEXT NOT NULL,
  event_key TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  sequence INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (scope, event_key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_diagnostic_events_scope_sequence
  ON diagnostic_events(scope, sequence, event_key);

CREATE TABLE IF NOT EXISTS skill_usage (
  skill_file TEXT NOT NULL PRIMARY KEY,
  skill_key TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  skill_source TEXT NOT NULL,
  first_used_at_ms INTEGER NOT NULL,
  last_used_at_ms INTEGER NOT NULL,
  use_count INTEGER NOT NULL,
  last_agent_id TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_skill_usage_key
  ON skill_usage(skill_key, skill_file);

-- Profile-owned skill library: additive, absent until first publication/import.
CREATE TABLE IF NOT EXISTS skill_library_entries (
  skill_id TEXT NOT NULL PRIMARY KEY,
  owner_profile_id TEXT,
  author_profile_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  current_revision TEXT NOT NULL,
  shared INT NOT NULL,
  enabled INT NOT NULL,
  removed INT NOT NULL,
  created_at INT NOT NULL,
  updated_at INT NOT NULL
) STRICT;
CREATE TABLE IF NOT EXISTS skill_library_revisions (
  skill_id TEXT NOT NULL,
  revision TEXT NOT NULL,
  description TEXT NOT NULL,
  files_json TEXT NOT NULL,
  created_at INT NOT NULL,
  PRIMARY KEY (skill_id, revision)
) STRICT;
CREATE TABLE IF NOT EXISTS skill_library_events (
  event_id TEXT NOT NULL PRIMARY KEY,
  skill_id TEXT NOT NULL,
  revision TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_profile_id TEXT NOT NULL,
  created_at INT NOT NULL
) STRICT;
CREATE TABLE IF NOT EXISTS skill_library_uploads (
  upload_id TEXT NOT NULL PRIMARY KEY,
  owner_profile_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  size_bytes INT NOT NULL,
  sha256 TEXT NOT NULL,
  archive_blob BLOB NOT NULL,
  expires_at INT NOT NULL,
  published_skill_id TEXT
) STRICT;
-- End profile-owned skill library.

CREATE TABLE IF NOT EXISTS skill_workshop_changes (
  cursor_id INTEGER NOT NULL,
  change_id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'patch', 'write_file', 'remove_file', 'archive', 'restore')),
  actor TEXT NOT NULL CHECK (actor IN ('agent', 'review', 'curator', 'user')),
  summary TEXT NOT NULL,
  version_id TEXT,
  session_key TEXT,
  run_id TEXT,
  created_at_ms INTEGER NOT NULL
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS skill_workshop_changes_cursor_id_idx
  ON skill_workshop_changes(cursor_id);

CREATE INDEX IF NOT EXISTS idx_skill_workshop_changes_agent_time
  ON skill_workshop_changes(agent_id, created_at_ms);

CREATE TABLE IF NOT EXISTS audit_events (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL UNIQUE,
  source_id TEXT NOT NULL UNIQUE,
  schema_version INTEGER NOT NULL DEFAULT 1,
  source_sequence INTEGER NOT NULL,
  occurred_at INTEGER NOT NULL,
  kind TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  error_code TEXT,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  agent_id TEXT,
  session_key TEXT,
  session_id TEXT,
  run_id TEXT,
  tool_call_id TEXT,
  tool_name TEXT,
  direction TEXT,
  channel TEXT,
  conversation_kind TEXT,
  message_outcome TEXT,
  reason_code TEXT,
  delivery_kind TEXT,
  failure_stage TEXT,
  duration_ms INTEGER,
  result_count INTEGER,
  account_ref TEXT,
  conversation_ref TEXT,
  message_ref TEXT,
  target_ref TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_audit_events_time
  ON audit_events(occurred_at DESC, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_agent_sequence
  ON audit_events(agent_id, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_session_sequence
  ON audit_events(session_key, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_run_sequence
  ON audit_events(run_id, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_kind_sequence
  ON audit_events(kind, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_status_sequence
  ON audit_events(status, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_channel_sequence
  ON audit_events(channel, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_direction_sequence
  ON audit_events(direction, sequence DESC);

CREATE TABLE IF NOT EXISTS outbound_message_execution_bindings (
  event_id TEXT NOT NULL PRIMARY KEY,
  context_id TEXT NOT NULL CHECK (length(context_id) BETWEEN 1 AND 256),
  execution_id TEXT NOT NULL CHECK (length(execution_id) BETWEEN 1 AND 256),
  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),
  FOREIGN KEY (event_id) REFERENCES audit_events(event_id) ON DELETE CASCADE
) STRICT;
CREATE INDEX IF NOT EXISTS outbound_message_execution_bindings_execution_event_idx
  ON outbound_message_execution_bindings (context_id, execution_id, run_id, event_id);

CREATE TABLE IF NOT EXISTS outbound_message_progress (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  progress_id TEXT NOT NULL UNIQUE CHECK (length(progress_id) BETWEEN 1 AND 256),
  source_id TEXT NOT NULL UNIQUE CHECK (length(source_id) BETWEEN 1 AND 512),
  source_sequence INTEGER NOT NULL CHECK (source_sequence >= 1),
  schema_version INTEGER NOT NULL CHECK (schema_version = 1),
  occurred_at INTEGER NOT NULL CHECK (occurred_at >= 0),
  action TEXT NOT NULL CHECK (
    action IN ('message.outbound.queued', 'message.outbound.platform-started')
  ),
  outcome TEXT NOT NULL CHECK (outcome IN ('queued', 'platform_started')),
  actor_type TEXT NOT NULL CHECK (actor_type IN ('agent', 'system')),
  actor_id TEXT NOT NULL CHECK (length(actor_id) BETWEEN 1 AND 256),
  agent_id TEXT CHECK (agent_id IS NULL OR length(agent_id) BETWEEN 1 AND 256),
  run_id TEXT CHECK (run_id IS NULL OR length(run_id) BETWEEN 1 AND 256),
  context_id TEXT,
  execution_id TEXT,
  channel TEXT NOT NULL CHECK (length(channel) BETWEEN 1 AND 256),
  conversation_kind TEXT NOT NULL CHECK (
    conversation_kind IN ('direct', 'group', 'channel', 'unknown')
  ),
  duration_ms INTEGER CHECK (duration_ms IS NULL OR duration_ms >= 0),
  account_ref TEXT,
  conversation_ref TEXT,
  target_ref TEXT,
  UNIQUE (occurred_at, progress_id)
) STRICT;
CREATE INDEX IF NOT EXISTS outbound_message_progress_occurred_idx
  ON outbound_message_progress (occurred_at, sequence);
CREATE INDEX IF NOT EXISTS outbound_message_progress_run_occurred_idx
  ON outbound_message_progress (run_id, occurred_at, sequence);

CREATE TABLE IF NOT EXISTS audit_identity_keys (
  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
  key_id TEXT NOT NULL,
  key BLOB NOT NULL,
  created_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS config_revision_keys (
  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
  hmac_key BLOB NOT NULL CHECK (length(hmac_key) = 32)
) STRICT;

CREATE TABLE IF NOT EXISTS execution_identity_contexts (
  context_id TEXT NOT NULL PRIMARY KEY CHECK (length(context_id) BETWEEN 1 AND 256),
  execution_id TEXT NOT NULL UNIQUE CHECK (length(execution_id) BETWEEN 1 AND 256),
  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),
  created_at INTEGER NOT NULL CHECK (created_at >= 0),
  coverage_state TEXT NOT NULL CHECK (
    coverage_state IN ('attribution-only', 'unattributed', 'unknown', 'unsupported')
  ),
  context_bytes INTEGER NOT NULL CHECK (context_bytes BETWEEN 1 AND 16384),
  context_json TEXT NOT NULL CHECK (length(context_json) > 0),
  UNIQUE (created_at, context_id)
) STRICT;
CREATE INDEX IF NOT EXISTS execution_identity_contexts_run_created_idx
  ON execution_identity_contexts (run_id, created_at, execution_id);

CREATE TABLE IF NOT EXISTS execution_decision_facts (
  cursor_id INTEGER NOT NULL,
  receipt_id TEXT NOT NULL PRIMARY KEY CHECK (length(receipt_id) BETWEEN 1 AND 256),
  context_id TEXT NOT NULL CHECK (length(context_id) BETWEEN 1 AND 256),
  execution_id TEXT NOT NULL CHECK (length(execution_id) BETWEEN 1 AND 256),
  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),
  action_id TEXT CHECK (action_id IS NULL OR length(action_id) BETWEEN 1 AND 256),
  action_family TEXT NOT NULL CHECK (length(action_family) BETWEEN 1 AND 256),
  decision_outcome TEXT NOT NULL CHECK (
    decision_outcome IN ('allowed', 'denied', 'not-applicable', 'unknown')
  ),
  coverage_state TEXT NOT NULL CHECK (
    coverage_state IN ('enforced', 'attribution-only', 'unattributed', 'unknown', 'unsupported')
  ),
  reason_code TEXT NOT NULL CHECK (length(reason_code) BETWEEN 1 AND 256),
  owner TEXT NOT NULL CHECK (length(owner) BETWEEN 1 AND 256),
  source_ref TEXT NOT NULL CHECK (length(source_ref) BETWEEN 1 AND 256),
  occurred_at INTEGER NOT NULL CHECK (occurred_at >= 0),
  receipt_bytes INTEGER NOT NULL CHECK (receipt_bytes BETWEEN 1 AND 16384),
  receipt_json TEXT NOT NULL CHECK (length(receipt_json) > 0),
  UNIQUE (occurred_at, receipt_id)
) STRICT;
CREATE UNIQUE INDEX IF NOT EXISTS execution_decision_facts_cursor_id_idx
  ON execution_decision_facts(cursor_id);

CREATE INDEX IF NOT EXISTS execution_decision_facts_context_occurred_idx
  ON execution_decision_facts (context_id, occurred_at, receipt_id);
CREATE INDEX IF NOT EXISTS execution_decision_facts_run_occurred_idx
  ON execution_decision_facts (run_id, occurred_at, receipt_id);

-- Exact admission identity stays separate from owner-native lifecycle rows so
-- older readers retain byte-compatible cron/task/flow table definitions.
CREATE TABLE IF NOT EXISTS execution_owner_lifecycle_bindings (
  owner_kind TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  context_id TEXT NOT NULL,
  execution_id TEXT NOT NULL,
  PRIMARY KEY (owner_kind, owner_id)
) STRICT;

CREATE TABLE IF NOT EXISTS session_state_events (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  dedupe_key TEXT UNIQUE,
  session_key TEXT NOT NULL,
  session_id TEXT,
  agent_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT,
  run_id TEXT,
  occurred_at INTEGER NOT NULL,
  summary TEXT NOT NULL,
  payload_json TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_session_state_events_session_sequence
  ON session_state_events(session_key, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_session_state_events_time
  ON session_state_events(occurred_at DESC, sequence DESC);

CREATE TABLE IF NOT EXISTS session_state_heads (
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  last_sequence INTEGER NOT NULL,
  pruned_max_sequence INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, agent_id)
) STRICT;

-- Notifiable watcher identity is the bare session key, matching the process-local
-- system-event queue it feeds. Provenance distinguishes explicit immediate-wake
-- watches from ambient queue-only group watches. Other bare keys
-- (session.scope="global") are ambiguous across agents and excluded until watcher
-- identity is agent-scoped end-to-end.
CREATE TABLE IF NOT EXISTS session_watch_cursors (
  watcher_session_key TEXT NOT NULL,
  watcher_store_path TEXT,
  target_session_key TEXT NOT NULL,
  last_seen_sequence INTEGER NOT NULL DEFAULT 0,
  notified_sequence INTEGER NOT NULL DEFAULT 0,
  material_sequence INTEGER NOT NULL DEFAULT 0,
  provenance TEXT NOT NULL DEFAULT 'explicit' CHECK (provenance IN ('explicit', 'ambient-group')),
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (watcher_session_key, target_session_key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_session_watch_cursors_target
  ON session_watch_cursors(target_session_key);

CREATE TABLE IF NOT EXISTS session_upstream_links (
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  catalog_id TEXT NOT NULL,
  host_id TEXT NOT NULL,
  thread_id TEXT NOT NULL,
  upstream_kind TEXT NOT NULL,
  upstream_ref_json TEXT,
  last_marker_json TEXT,
  last_scanned_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  -- (session_key, agent_id) composite identity: under session.scope="global" agents
  -- share bare keys; a key-only row would let one agent overwrite another's upstream.
  PRIMARY KEY (session_key, agent_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_session_upstream_links_catalog_id
  ON session_upstream_links(catalog_id);

CREATE TABLE IF NOT EXISTS state_leases (
  scope TEXT NOT NULL,
  lease_key TEXT NOT NULL,
  owner TEXT NOT NULL,
  expires_at INTEGER,
  heartbeat_at INTEGER,
  payload_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (scope, lease_key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_state_leases_expiry
  ON state_leases(expires_at, scope, lease_key)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_state_leases_owner
  ON state_leases(owner, updated_at DESC);

CREATE TABLE IF NOT EXISTS exec_approvals_config (
  config_key TEXT NOT NULL PRIMARY KEY,
  raw_json TEXT NOT NULL,
  socket_path TEXT,
  has_socket_token INTEGER NOT NULL,
  default_security TEXT,
  default_ask TEXT,
  default_ask_fallback TEXT,
  auto_allow_skills INTEGER,
  agent_count INTEGER NOT NULL,
  allowlist_count INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS operator_approvals (
  cursor_id INTEGER NOT NULL,
  approval_id TEXT NOT NULL PRIMARY KEY CHECK (
    length(approval_id) > 0 AND approval_id NOT IN ('.', '..')
  ),
  resolution_ref TEXT NOT NULL CHECK (
    length(resolution_ref) = 43 AND resolution_ref NOT GLOB '*[^A-Za-z0-9_-]*'
  ),
  kind TEXT NOT NULL CHECK (kind IN ('exec', 'plugin', 'system-agent')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'allowed', 'denied', 'expired', 'cancelled')),
  presentation_json TEXT NOT NULL,
  requested_by_device_id TEXT,
  requested_by_client_id TEXT,
  requested_by_device_token_auth INTEGER NOT NULL DEFAULT 0,
  reviewer_device_ids_json TEXT NOT NULL,
  source_agent_id TEXT,
  source_session_key TEXT,
  source_session_id TEXT,
  source_run_id TEXT,
  source_tool_call_id TEXT,
  source_tool_name TEXT,
  audience_session_keys_json TEXT NOT NULL,
  runtime_epoch TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  expires_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  decision TEXT CHECK (decision IN ('allow-once', 'allow-always', 'deny')),
  terminal_reason TEXT CHECK (
    terminal_reason IN (
      'user',
      'timeout',
      'malformed-verdict',
      'no-route',
      'run-aborted',
      'gateway-restart',
      'storage-corrupt'
    )
  ),
  resolved_at_ms INTEGER,
  resolver_kind TEXT CHECK (resolver_kind IN ('device', 'channel', 'runtime', 'system')),
  resolver_id TEXT,
  consumed_at_ms INTEGER,
  consumed_by TEXT,
  CHECK (expires_at_ms >= created_at_ms),
  CHECK (updated_at_ms >= created_at_ms),
  CHECK (resolved_at_ms IS NULL OR resolved_at_ms >= created_at_ms),
  CHECK (resolved_at_ms IS NULL OR resolved_at_ms <= updated_at_ms),
  CHECK (consumed_at_ms IS NULL OR consumed_at_ms >= resolved_at_ms),
  CHECK (consumed_at_ms IS NULL OR consumed_at_ms <= updated_at_ms),
  CHECK (requested_by_device_token_auth IN (0, 1)),
  CHECK (
    (
      status = 'pending'
      AND decision IS NULL
      AND terminal_reason IS NULL
      AND resolved_at_ms IS NULL
      AND resolver_kind IS NULL
      AND resolver_id IS NULL
      AND consumed_at_ms IS NULL
      AND consumed_by IS NULL
    )
    OR (
      status = 'allowed'
      AND decision IN ('allow-once', 'allow-always')
      AND terminal_reason = 'user'
      AND resolved_at_ms IS NOT NULL
      AND resolver_kind IS NOT NULL
    )
    OR (
      status = 'denied'
      AND decision = 'deny'
      AND terminal_reason IN ('user', 'malformed-verdict', 'no-route', 'storage-corrupt')
      AND resolved_at_ms IS NOT NULL
      AND resolver_kind IS NOT NULL
      AND consumed_at_ms IS NULL
      AND consumed_by IS NULL
    )
    OR (
      status = 'expired'
      AND decision = 'deny'
      AND terminal_reason = 'timeout'
      AND resolved_at_ms IS NOT NULL
      AND resolver_kind IS NOT NULL
      AND consumed_at_ms IS NULL
      AND consumed_by IS NULL
    )
    OR (
      status = 'cancelled'
      AND decision = 'deny'
      AND terminal_reason IN ('run-aborted', 'gateway-restart')
      AND resolved_at_ms IS NOT NULL
      AND resolver_kind IS NOT NULL
      AND consumed_at_ms IS NULL
      AND consumed_by IS NULL
    )
  ),
  CHECK (
    (consumed_at_ms IS NULL AND consumed_by IS NULL)
    OR (
      status = 'allowed'
      AND decision = 'allow-once'
      AND consumed_at_ms IS NOT NULL
      AND consumed_by IS NOT NULL
    )
  )
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_cursor_id
  ON operator_approvals(cursor_id);

CREATE INDEX IF NOT EXISTS idx_operator_approvals_status_expiry
  ON operator_approvals(status, expires_at_ms, approval_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref
  ON operator_approvals(resolution_ref);

CREATE INDEX IF NOT EXISTS idx_operator_approvals_source_session_created
  ON operator_approvals(source_session_key, created_at_ms DESC, approval_id);

CREATE INDEX IF NOT EXISTS idx_operator_approvals_source_run_resolved
  ON operator_approvals(source_run_id, resolved_at_ms, approval_id)
  WHERE source_run_id IS NOT NULL AND resolved_at_ms IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_operator_approvals_resolved
  ON operator_approvals(resolved_at_ms, approval_id)
  WHERE resolved_at_ms IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_operator_approvals_runtime_pending
  ON operator_approvals(runtime_epoch, approval_id)
  WHERE status = 'pending';

CREATE TABLE IF NOT EXISTS operator_approval_execution_identities (
  approval_id TEXT NOT NULL PRIMARY KEY
    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,
  source_context_id TEXT NOT NULL CHECK (
    length(source_context_id) BETWEEN 1 AND 256 AND source_context_id = trim(source_context_id)
  ),
  source_execution_id TEXT NOT NULL CHECK (
    length(source_execution_id) BETWEEN 1 AND 256 AND source_execution_id = trim(source_execution_id)
  )
) STRICT;

CREATE TABLE IF NOT EXISTS operator_approval_standing_grants (
  grant_id TEXT NOT NULL PRIMARY KEY CHECK (length(grant_id) > 0),
  minted_by_approval_id TEXT NOT NULL
    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL CHECK (length(agent_id) > 0),
  cron_job_id TEXT NOT NULL CHECK (length(cron_job_id) > 0),
  job_config_revision TEXT NOT NULL CHECK (length(job_config_revision) > 0),
  operation_binding TEXT NOT NULL CHECK (length(operation_binding) > 0),
  created_at_ms INTEGER NOT NULL,
  expires_at_ms INTEGER CHECK (expires_at_ms IS NULL OR expires_at_ms >= created_at_ms),
  revoked_at_ms INTEGER,
  revoked_by TEXT,
  last_used_at_ms INTEGER,
  use_count INTEGER NOT NULL DEFAULT 0
) STRICT;

CREATE INDEX IF NOT EXISTS idx_operator_approval_standing_grants_binding
  ON operator_approval_standing_grants(agent_id, cron_job_id, operation_binding, created_at_ms DESC);

CREATE TABLE IF NOT EXISTS operator_approval_standing_grant_generations (
  grant_id TEXT NOT NULL PRIMARY KEY
    REFERENCES operator_approval_standing_grants(grant_id) ON DELETE CASCADE,
  job_definition_generation INTEGER NOT NULL CHECK (job_definition_generation >= 1)
) STRICT;

CREATE TABLE IF NOT EXISTS schema_meta (
  meta_key TEXT NOT NULL PRIMARY KEY,
  role TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  agent_id TEXT,
  app_version TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS config_machine_state (
  state_key TEXT NOT NULL PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS device_pairing_pending (
  request_id TEXT NOT NULL PRIMARY KEY,
  device_id TEXT NOT NULL,
  public_key TEXT NOT NULL,
  display_name TEXT,
  platform TEXT,
  device_family TEXT,
  client_id TEXT,
  client_mode TEXT,
  browser_origin TEXT,
  role TEXT,
  roles_json TEXT,
  scopes_json TEXT,
  remote_ip TEXT,
  silent INTEGER,
  is_repair INTEGER,
  ts INTEGER NOT NULL,
  refreshed_at_ms INTEGER
) STRICT;

CREATE INDEX IF NOT EXISTS idx_device_pairing_pending_device
  ON device_pairing_pending(device_id, ts DESC);

CREATE TABLE IF NOT EXISTS device_pairing_paired (
  device_id TEXT NOT NULL PRIMARY KEY,
  public_key TEXT NOT NULL,
  display_name TEXT,
  operator_label TEXT,
  platform TEXT,
  device_family TEXT,
  client_id TEXT,
  client_mode TEXT,
  browser_origin TEXT,
  role TEXT,
  roles_json TEXT,
  scopes_json TEXT,
  approved_scopes_json TEXT,
  remote_ip TEXT,
  tokens_json TEXT,
  approved_via TEXT,
  node_surface_json TEXT,
  pending_node_surface_json TEXT,
  created_at_ms INTEGER NOT NULL,
  approved_at_ms INTEGER NOT NULL,
  last_seen_at_ms INTEGER,
  last_seen_reason TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_device_pairing_paired_approved
  ON device_pairing_paired(approved_at_ms DESC, device_id);

CREATE TABLE IF NOT EXISTS device_bootstrap_tokens (
  token_key TEXT NOT NULL PRIMARY KEY,
  token TEXT NOT NULL,
  setup_id TEXT,
  ts INTEGER NOT NULL,
  device_id TEXT,
  public_key TEXT,
  profile_json TEXT,
  redeemed_profile_json TEXT,
  pending_profile_json TEXT,
  issued_at_ms INTEGER NOT NULL,
  last_used_at_ms INTEGER
) STRICT;

CREATE INDEX IF NOT EXISTS idx_device_bootstrap_tokens_ts
  ON device_bootstrap_tokens(ts);

-- Terminal outcome of a redeemed setup credential. The bootstrap row is deleted
-- on redemption, so this is the only durable proof a setup code succeeded; the
-- presenting client reconciles it when the completion broadcast is missed.
-- Non-secret only: never the bootstrap token or anything derived from it.
-- Bounded by retention to a handful of live rows, so the primary key is the
-- only access path worth having.
CREATE TABLE IF NOT EXISTS device_pair_setup_completions (
  setup_id TEXT NOT NULL PRIMARY KEY,
  device_id TEXT NOT NULL,
  device_name TEXT,
  access TEXT NOT NULL,
  completed_at_ms INTEGER NOT NULL,
  delivery_state TEXT NOT NULL CHECK (delivery_state IN ('uncertain', 'confirmed')),
  retain_until_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS device_pairing_join_codes (
  shortcode TEXT,
  payload_json TEXT,
  created_at_ms INTEGER,
  expires_at_ms INTEGER
) STRICT;

CREATE TABLE IF NOT EXISTS device_identities (
  identity_key TEXT NOT NULL PRIMARY KEY,
  device_id TEXT NOT NULL,
  public_key_pem TEXT NOT NULL,
  private_key_pem TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_device_identities_device
  ON device_identities(device_id, updated_at_ms DESC);

CREATE TABLE IF NOT EXISTS device_auth_tokens (
  device_id TEXT NOT NULL,
  role TEXT NOT NULL,
  token TEXT NOT NULL,
  scopes_json TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (device_id, role)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_device_auth_tokens_updated
  ON device_auth_tokens(updated_at_ms DESC, device_id, role);

CREATE TABLE IF NOT EXISTS gateway_origin_device_tokens (
  gateway_scope TEXT NOT NULL,
  device_id TEXT NOT NULL,
  role TEXT NOT NULL,
  token TEXT NOT NULL,
  scopes_json TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (gateway_scope, device_id, role)
) STRICT;

CREATE TABLE IF NOT EXISTS macos_port_guardian_records (
  pid INTEGER NOT NULL PRIMARY KEY,
  port INTEGER NOT NULL,
  command TEXT NOT NULL,
  mode TEXT NOT NULL,
  timestamp REAL NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_macos_port_guardian_records_port
  ON macos_port_guardian_records(port, timestamp DESC);

CREATE TABLE IF NOT EXISTS workspace_setup_state (
  workspace_key TEXT NOT NULL PRIMARY KEY,
  -- NULL only for attestation-only rows whose legacy source never recorded a
  -- path (orphan hashed-key attestations); setup rows always carry one.
  workspace_path TEXT,
  -- NULL setup columns mean an attestation-only row: replaceWorkspaceAttestation
  -- may record hashes before any setup milestone exists for the workspace.
  version INTEGER,
  bootstrap_seeded_at TEXT,
  setup_completed_at TEXT,
  updated_at INTEGER,
  attested_at_ms INTEGER,
  attestation_updated_at_ms INTEGER,
  CHECK (version IS NULL OR workspace_path IS NOT NULL)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_workspace_setup_state_path
  ON workspace_setup_state(workspace_path);

CREATE TABLE IF NOT EXISTS workspace_path_aliases (
  alias_key TEXT NOT NULL PRIMARY KEY,
  alias_path TEXT NOT NULL,
  workspace_key TEXT NOT NULL,
  workspace_path TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_workspace_path_aliases_workspace
  ON workspace_path_aliases(workspace_key);



CREATE TABLE IF NOT EXISTS workspace_generated_bootstrap_hashes (
  workspace_key TEXT NOT NULL,
  filename TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  PRIMARY KEY (workspace_key, filename),
  FOREIGN KEY (workspace_key) REFERENCES workspace_setup_state(workspace_key) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS native_hook_relay_bridges (
  relay_id TEXT NOT NULL PRIMARY KEY,
  pid INTEGER NOT NULL,
  hostname TEXT NOT NULL,
  port INTEGER NOT NULL,
  token TEXT NOT NULL,
  expires_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_native_hook_relay_bridges_expires
  ON native_hook_relay_bridges(expires_at_ms, relay_id);

CREATE TABLE IF NOT EXISTS managed_outgoing_image_records (
  attachment_id TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  agent_id TEXT,
  message_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  retention_class TEXT,
  alt TEXT NOT NULL,
  original_media_root TEXT NOT NULL,
  original_media_id TEXT NOT NULL,
  original_media_subdir TEXT NOT NULL,
  original_content_type TEXT NOT NULL,
  original_width INTEGER,
  original_height INTEGER,
  original_size_bytes INTEGER,
  original_filename TEXT,
  record_json TEXT NOT NULL,
  cleanup_pending INTEGER NOT NULL DEFAULT 0 CHECK (cleanup_pending IN (0, 1))
) STRICT;

CREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_session
  ON managed_outgoing_image_records(session_key, created_at DESC, attachment_id);

CREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_message
  ON managed_outgoing_image_records(session_key, message_id, attachment_id)
  WHERE message_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_agent_session
  ON managed_outgoing_image_records(session_key, agent_id, created_at DESC, attachment_id);

CREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_agent_message
  ON managed_outgoing_image_records(session_key, agent_id, message_id, attachment_id)
  WHERE message_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS channel_pairing_requests (
  channel_key TEXT NOT NULL,
  account_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  meta_json TEXT,
  PRIMARY KEY (channel_key, account_id, request_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_code
  ON channel_pairing_requests(channel_key, code);

CREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_created
  ON channel_pairing_requests(channel_key, created_at, request_id);

CREATE TABLE IF NOT EXISTS channel_pairing_allow_entries (
  channel_key TEXT NOT NULL,
  account_id TEXT NOT NULL,
  entry TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (channel_key, account_id, entry)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_channel_pairing_allow_account
  ON channel_pairing_allow_entries(channel_key, account_id, sort_order, entry);

CREATE TABLE IF NOT EXISTS web_push_subscriptions (
  endpoint_hash TEXT NOT NULL PRIMARY KEY,
  subscription_id TEXT NOT NULL UNIQUE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  device_id TEXT,
  user_profile_id TEXT,
  preferences_json TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_web_push_subscriptions_updated
  ON web_push_subscriptions(updated_at_ms DESC, subscription_id);

CREATE TABLE IF NOT EXISTS web_push_approval_deliveries (
  approval_id TEXT NOT NULL
    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,
  subscription_id TEXT NOT NULL
    REFERENCES web_push_subscriptions(subscription_id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  user_profile_id TEXT,
  prepared_at_ms INTEGER NOT NULL,
  PRIMARY KEY (approval_id, subscription_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_web_push_approval_deliveries_subscription
  ON web_push_approval_deliveries(subscription_id, approval_id);

CREATE TABLE IF NOT EXISTS apns_registrations (
  node_id TEXT NOT NULL PRIMARY KEY,
  transport TEXT NOT NULL,
  token TEXT,
  relay_handle TEXT,
  send_grant TEXT,
  installation_id TEXT,
  relay_origin TEXT,
  topic TEXT NOT NULL,
  environment TEXT NOT NULL,
  distribution TEXT,
  token_debug_suffix TEXT,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_apns_registrations_updated
  ON apns_registrations(updated_at_ms DESC, node_id);

CREATE TABLE IF NOT EXISTS apns_registration_tombstones (
  node_id TEXT NOT NULL PRIMARY KEY,
  deleted_at_ms INTEGER NOT NULL
) STRICT;

-- Node-host-owned launch journal. The descriptor and its credential remain
-- process memory only; this table records bounded supervision facts.
CREATE TABLE IF NOT EXISTS node_worker_launches (
  launch_id TEXT NOT NULL PRIMARY KEY
    CHECK (length(launch_id) BETWEEN 1 AND 256 AND instr(launch_id, char(0)) = 0),
  plan_hash TEXT NOT NULL
    CHECK (length(plan_hash) = 64 AND plan_hash NOT GLOB '*[^0-9a-f]*'),
  gateway_namespace TEXT NOT NULL
    CHECK (
      length(gateway_namespace) BETWEEN 1 AND 128
      AND gateway_namespace NOT GLOB '*[^A-Za-z0-9._-]*'
      AND gateway_namespace GLOB '[A-Za-z0-9]*'
    ),
  environment_id TEXT NOT NULL
    CHECK (length(environment_id) BETWEEN 1 AND 256 AND instr(environment_id, char(0)) = 0),
  session_id TEXT NOT NULL
    CHECK (length(session_id) BETWEEN 1 AND 256 AND instr(session_id, char(0)) = 0),
  owner_epoch INTEGER NOT NULL CHECK (owner_epoch BETWEEN 1 AND 9007199254740991),
  placement_generation INTEGER NOT NULL
    CHECK (placement_generation BETWEEN 0 AND 9007199254740991),
  run_id TEXT NOT NULL
    CHECK (length(run_id) BETWEEN 1 AND 256 AND instr(run_id, char(0)) = 0),
  state TEXT NOT NULL
    CHECK (state IN ('pending', 'running', 'completed', 'failed', 'interrupted', 'cancelled')),
  supervisor_pid INTEGER NOT NULL CHECK (supervisor_pid BETWEEN 1 AND 2147483647),
  supervisor_start_time INTEGER NOT NULL
    CHECK (supervisor_start_time BETWEEN 0 AND 9007199254740991),
  worker_pid INTEGER CHECK (worker_pid IS NULL OR worker_pid BETWEEN 1 AND 2147483647),
  worker_start_time INTEGER CHECK (
    worker_start_time IS NULL OR worker_start_time BETWEEN 0 AND 9007199254740991
  ),
  result_json TEXT CHECK (
    result_json IS NULL
    OR (
      length(CAST(result_json AS BLOB)) BETWEEN 1 AND 65536
      AND instr(result_json, char(0)) = 0
      AND json_valid(result_json)
    )
  ),
  error_text TEXT CHECK (
    error_text IS NULL
    OR (
      length(CAST(error_text AS BLOB)) BETWEEN 1 AND 4096
      AND instr(error_text, char(0)) = 0
      AND instr(error_text, char(10)) = 0
      AND instr(error_text, char(13)) = 0
    )
  ),
  completed_at_ms INTEGER CHECK (
    completed_at_ms IS NULL OR completed_at_ms BETWEEN 0 AND 9007199254740991
  ),
  created_at_ms INTEGER NOT NULL CHECK (created_at_ms BETWEEN 0 AND 9007199254740991),
  updated_at_ms INTEGER NOT NULL CHECK (
    updated_at_ms BETWEEN created_at_ms AND 9007199254740991
  ),
  CHECK ((worker_pid IS NULL) = (worker_start_time IS NULL)),
  CHECK (
    (state = 'pending'
      AND worker_pid IS NULL AND result_json IS NULL AND error_text IS NULL
      AND completed_at_ms IS NULL)
    OR
    (state = 'running'
      AND worker_pid IS NOT NULL AND result_json IS NULL AND error_text IS NULL
      AND completed_at_ms IS NULL)
    OR
    (state = 'completed'
      AND result_json IS NOT NULL AND error_text IS NULL
      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)
    OR
    (state IN ('failed', 'interrupted', 'cancelled')
      AND result_json IS NULL AND error_text IS NOT NULL
      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)
  )
) STRICT;

CREATE INDEX IF NOT EXISTS idx_node_worker_launches_terminal_completed
  ON node_worker_launches(completed_at_ms, launch_id)
  WHERE completed_at_ms IS NOT NULL;

CREATE TABLE IF NOT EXISTS node_worker_launch_boots (
  launch_id TEXT NOT NULL PRIMARY KEY
    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,
  boot_id TEXT CHECK (boot_id IS NULL OR length(boot_id) BETWEEN 1 AND 128)
) STRICT;

CREATE TABLE IF NOT EXISTS node_worker_launch_containers (
  launch_id TEXT PRIMARY KEY,
  container_json TEXT
) STRICT;

CREATE TABLE IF NOT EXISTS node_worker_launch_cleanup (
  launch_id TEXT NOT NULL PRIMARY KEY
    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,
  cleanup_mode TEXT NOT NULL CHECK (cleanup_mode IN ('process-group', 'owned-anchor')),
  lineage_settled INTEGER CHECK (lineage_settled IS NULL OR lineage_settled = 1)
) STRICT;

-- Older readers retain owned-anchor custody: lineage EOF is not this certificate.
CREATE TABLE IF NOT EXISTS node_worker_launch_process_scopes (
  launch_id TEXT NOT NULL PRIMARY KEY
    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,
  scope_kind TEXT NOT NULL CHECK (scope_kind = 'linux-subreaper'),
  descendants_reaped INTEGER CHECK (descendants_reaped IS NULL OR descendants_reaped = 1)
) STRICT;

-- Turn receipts have a shorter lifetime than their physical worker owner.
-- Keeping the launch running preserves capacity and predecessor cleanup semantics.
CREATE TABLE IF NOT EXISTS node_worker_turns (
  turn_id TEXT NOT NULL PRIMARY KEY
    CHECK (length(turn_id) BETWEEN 1 AND 256 AND instr(turn_id, char(0)) = 0),
  owner_launch_id TEXT NOT NULL
    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,
  plan_hash TEXT NOT NULL
    CHECK (length(plan_hash) = 64 AND plan_hash NOT GLOB '*[^0-9a-f]*'),
  run_id TEXT NOT NULL
    CHECK (length(run_id) BETWEEN 1 AND 256 AND instr(run_id, char(0)) = 0),
  state TEXT NOT NULL
    CHECK (state IN ('running', 'completed', 'failed', 'interrupted', 'cancelled')),
  result_json TEXT CHECK (
    result_json IS NULL
    OR (
      length(CAST(result_json AS BLOB)) BETWEEN 1 AND 65536
      AND instr(result_json, char(0)) = 0
      AND json_valid(result_json)
    )
  ),
  error_text TEXT CHECK (
    error_text IS NULL
    OR (
      length(CAST(error_text AS BLOB)) BETWEEN 1 AND 4096
      AND instr(error_text, char(0)) = 0
      AND instr(error_text, char(10)) = 0
      AND instr(error_text, char(13)) = 0
    )
  ),
  completed_at_ms INTEGER CHECK (
    completed_at_ms IS NULL OR completed_at_ms BETWEEN 0 AND 9007199254740991
  ),
  created_at_ms INTEGER NOT NULL CHECK (created_at_ms BETWEEN 0 AND 9007199254740991),
  updated_at_ms INTEGER NOT NULL CHECK (
    updated_at_ms BETWEEN created_at_ms AND 9007199254740991
  ),
  CHECK (
    (state = 'running'
      AND result_json IS NULL AND error_text IS NULL AND completed_at_ms IS NULL)
    OR
    (state = 'completed'
      AND result_json IS NOT NULL AND error_text IS NULL
      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)
    OR
    (state IN ('failed', 'interrupted', 'cancelled')
      AND result_json IS NULL AND error_text IS NOT NULL
      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)
  )
) STRICT;

CREATE INDEX IF NOT EXISTS idx_node_worker_turns_terminal_completed
  ON node_worker_turns(completed_at_ms, turn_id)
  WHERE completed_at_ms IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_node_worker_turns_active_owner
  ON node_worker_turns(owner_launch_id)
  WHERE state = 'running';

CREATE TABLE IF NOT EXISTS config_health_entries (
  config_path TEXT NOT NULL PRIMARY KEY,
  last_known_good_json TEXT,
  last_promoted_good_json TEXT,
  last_observed_suspicious_signature TEXT,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS clawhub_promotion_claims (
  slug TEXT NOT NULL PRIMARY KEY,
  provider TEXT,
  model_keys_json TEXT NOT NULL,
  ends_at_ms INTEGER NOT NULL,
  claimed_at_ms INTEGER NOT NULL
) STRICT;



CREATE TABLE IF NOT EXISTS official_external_plugin_catalog_snapshots (
  feed_url TEXT NOT NULL PRIMARY KEY,
  body TEXT NOT NULL,
  status INTEGER NOT NULL,
  etag TEXT,
  last_modified TEXT,
  checksum TEXT NOT NULL,
  saved_at TEXT NOT NULL,
  trust_mode TEXT,
  trust_key_id TEXT,
  trust_signature_count INTEGER,
  trust_threshold INTEGER,
  trust_verified_at TEXT,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_official_external_plugin_catalog_snapshots_updated
  ON official_external_plugin_catalog_snapshots(updated_at_ms DESC, feed_url);

CREATE TABLE IF NOT EXISTS update_runs (
  run_id TEXT PRIMARY KEY NOT NULL,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  trigger TEXT NOT NULL CHECK (trigger IN ('chat', 'control-ui', 'cli', 'campaign', 'mac-app', 'api')),
  phase TEXT NOT NULL CHECK (phase IN ('requested', 'staging', 'validating', 'repairing', 'activating', 'restarting', 'verifying', 'finished')),
  status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed', 'rolled-back', 'skipped')),
  reason TEXT,
  origin_json TEXT NOT NULL CHECK (length(CAST(origin_json AS BLOB)) <= 16384),
  target_json TEXT NOT NULL CHECK (length(CAST(target_json AS BLOB)) <= 16384),
  before_json TEXT NOT NULL CHECK (length(CAST(before_json AS BLOB)) <= 16384),
  after_json TEXT NOT NULL CHECK (length(CAST(after_json AS BLOB)) <= 16384),
  steps_json TEXT NOT NULL CHECK (length(CAST(steps_json AS BLOB)) <= 16384),
  verification_json TEXT NOT NULL CHECK (length(CAST(verification_json AS BLOB)) <= 16384),
  repair_json TEXT NOT NULL CHECK (length(CAST(repair_json AS BLOB)) <= 16384),
  confirmed_at_ms INTEGER,
  finished_at_ms INTEGER,
  downtime_ms INTEGER,
  CHECK ((status = 'running' AND phase != 'finished' AND finished_at_ms IS NULL) OR
    (status != 'running' AND phase = 'finished' AND finished_at_ms IS NOT NULL))
) STRICT;

CREATE INDEX IF NOT EXISTS idx_update_runs_created
  ON update_runs(created_at_ms DESC, run_id);
CREATE INDEX IF NOT EXISTS idx_update_runs_active
  ON update_runs(status, created_at_ms DESC, run_id);

CREATE TABLE IF NOT EXISTS gateway_restart_sentinel (
  sentinel_key TEXT NOT NULL PRIMARY KEY,
  version INTEGER NOT NULL,
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  ts INTEGER NOT NULL,
  session_key TEXT,
  thread_id TEXT,
  delivery_channel TEXT,
  delivery_to TEXT,
  delivery_account_id TEXT,
  message TEXT,
  continuation_json TEXT,
  doctor_hint TEXT,
  stats_json TEXT,
  payload_json TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_gateway_restart_sentinel_ts
  ON gateway_restart_sentinel(ts DESC, sentinel_key);

CREATE TABLE IF NOT EXISTS gateway_restart_intent (
  intent_key TEXT NOT NULL PRIMARY KEY,
  kind TEXT NOT NULL,
  pid INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  reason TEXT,
  force INTEGER,
  wait_ms INTEGER,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS gateway_restart_handoff (
  handoff_key TEXT NOT NULL PRIMARY KEY,
  kind TEXT NOT NULL,
  version INTEGER NOT NULL,
  intent_id TEXT NOT NULL,
  pid INTEGER NOT NULL,
  process_instance_id TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  reason TEXT,
  restart_trace_started_at INTEGER,
  restart_trace_last_at INTEGER,
  source TEXT NOT NULL,
  restart_kind TEXT NOT NULL,
  supervisor_mode TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_gateway_restart_handoff_expiry
  ON gateway_restart_handoff(expires_at, pid);

CREATE TABLE IF NOT EXISTS gateway_boot_lifecycle (
  boot_id TEXT NOT NULL PRIMARY KEY,
  pid INTEGER NOT NULL,
  started_at_ms INTEGER NOT NULL,
  completed_at_ms INTEGER,
  outcome TEXT,
  startup_reason TEXT,
  reason TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_gateway_boot_lifecycle_started
  ON gateway_boot_lifecycle(started_at_ms);

CREATE TABLE IF NOT EXISTS acp_sessions (
  session_key TEXT NOT NULL PRIMARY KEY,
  session_id TEXT,
  backend TEXT NOT NULL,
  agent TEXT NOT NULL,
  runtime_session_name TEXT NOT NULL,
  identity_json TEXT,
  resume_agent_session_id TEXT,
  resume_acpx_session_id TEXT,
  mode TEXT NOT NULL,
  runtime_options_json TEXT,
  cwd TEXT,
  state TEXT NOT NULL,
  last_activity_at INTEGER NOT NULL,
  last_error TEXT,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_acp_sessions_state_activity
  ON acp_sessions(state, last_activity_at DESC, session_key);

CREATE INDEX IF NOT EXISTS idx_acp_sessions_agent_activity
  ON acp_sessions(agent, last_activity_at DESC, session_key);

CREATE INDEX IF NOT EXISTS idx_acp_sessions_resume_agent
  ON acp_sessions(resume_agent_session_id);

CREATE INDEX IF NOT EXISTS idx_acp_sessions_resume_acpx
  ON acp_sessions(resume_acpx_session_id);

CREATE TABLE IF NOT EXISTS acp_replay_sessions (
  session_id TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  cwd TEXT NOT NULL,
  complete INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  next_seq INTEGER NOT NULL,
  -- Running estimate of this session's ledger footprint (row overhead plus
  -- all event rows), maintained at insert/trim so budget checks never scan
  -- acp_replay_events (#100622).
  estimated_bytes INTEGER NOT NULL DEFAULT 0
) STRICT;

CREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_key_updated
  ON acp_replay_sessions(session_key, complete, updated_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_updated
  ON acp_replay_sessions(updated_at DESC, session_id);

CREATE TABLE IF NOT EXISTS acp_replay_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  at INTEGER NOT NULL,
  session_key TEXT NOT NULL,
  run_id TEXT,
  update_json TEXT NOT NULL,
  estimated_bytes INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES acp_replay_sessions(session_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_acp_replay_events_session_seq
  ON acp_replay_events(session_id, seq);

CREATE TABLE IF NOT EXISTS agent_databases (
  agent_id TEXT NOT NULL,
  path TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  size_bytes INTEGER,
  PRIMARY KEY (agent_id, path)
) STRICT;

CREATE TABLE IF NOT EXISTS agent_deletion_journal (
  agent_id TEXT PRIMARY KEY,
  operation_id TEXT NOT NULL DEFAULT '',
  phase TEXT,
  agent_dir TEXT NOT NULL,
  workspace_dir TEXT NOT NULL,
  sessions_dir TEXT NOT NULL,
  database_paths_json TEXT NOT NULL DEFAULT '[]',
  cleanup_paths_json TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL,
  cleanup_completed INTEGER NOT NULL DEFAULT 0,
  delete_files INTEGER NOT NULL DEFAULT 1
) STRICT;

CREATE TABLE IF NOT EXISTS agent_provenance (
  agent_id TEXT PRIMARY KEY,
  created_via TEXT NOT NULL CHECK (created_via IN ('operator', 'agent', 'claw')),
  creator_agent_id TEXT,
  created_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS agent_database_leases (
  lease_id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  path TEXT NOT NULL,
  owner_pid INTEGER NOT NULL,
  owner_start_time INTEGER,
  opened_at INTEGER NOT NULL,
  provenance TEXT
) STRICT;

CREATE TABLE IF NOT EXISTS plugin_state_entries (
  plugin_id TEXT NOT NULL,
  namespace TEXT NOT NULL,
  entry_key TEXT NOT NULL,
  value_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER,
  PRIMARY KEY (plugin_id, namespace, entry_key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_plugin_state_expiry
  ON plugin_state_entries(expires_at)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_plugin_state_listing
  ON plugin_state_entries(plugin_id, namespace, created_at, entry_key, expires_at);

CREATE TABLE IF NOT EXISTS channel_ingress_events (
  queue_name TEXT NOT NULL,
  event_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  status TEXT NOT NULL,
  lane_key TEXT,
  payload_json TEXT NOT NULL,
  metadata_json TEXT,
  received_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  claim_token TEXT,
  claim_owner TEXT,
  claimed_at INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER,
  last_error TEXT,
  failed_reason TEXT,
  failed_at INTEGER,
  completed_at INTEGER,
  completed_metadata_json TEXT,
  PRIMARY KEY (queue_name, event_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_channel_ingress_pending
  ON channel_ingress_events(queue_name, status, received_at, event_id);

CREATE INDEX IF NOT EXISTS idx_channel_ingress_claims
  ON channel_ingress_events(queue_name, status, claimed_at);

CREATE INDEX IF NOT EXISTS idx_channel_ingress_lane
  ON channel_ingress_events(queue_name, status, lane_key);

CREATE TABLE IF NOT EXISTS plugin_blob_entries (
  plugin_id TEXT NOT NULL,
  namespace TEXT NOT NULL,
  entry_key TEXT NOT NULL,
  metadata_json TEXT NOT NULL,
  blob BLOB NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER,
  PRIMARY KEY (plugin_id, namespace, entry_key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_plugin_blob_expiry
  ON plugin_blob_entries(expires_at)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_plugin_blob_listing
  ON plugin_blob_entries(plugin_id, namespace, created_at, entry_key);

CREATE TABLE IF NOT EXISTS skill_uploads (
  upload_id TEXT NOT NULL PRIMARY KEY,
  kind TEXT NOT NULL,
  slug TEXT NOT NULL,
  force INTEGER NOT NULL,
  size_bytes INTEGER NOT NULL,
  sha256 TEXT,
  actual_sha256 TEXT,
  received_bytes INTEGER NOT NULL,
  archive_blob BLOB NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  committed INTEGER NOT NULL,
  committed_at INTEGER,
  idempotency_key_hash TEXT UNIQUE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_skill_uploads_expiry
  ON skill_uploads(expires_at);

CREATE INDEX IF NOT EXISTS idx_skill_uploads_idempotency
  ON skill_uploads(idempotency_key_hash)
  WHERE idempotency_key_hash IS NOT NULL;

CREATE TABLE IF NOT EXISTS skill_upload_chunks (
  upload_id TEXT NOT NULL,
  byte_offset INTEGER NOT NULL CHECK (byte_offset >= 0),
  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0),
  chunk_blob BLOB NOT NULL,
  PRIMARY KEY (upload_id, byte_offset),
  FOREIGN KEY (upload_id) REFERENCES skill_uploads(upload_id) ON DELETE CASCADE,
  CHECK (length(chunk_blob) = size_bytes)
) STRICT;

CREATE TABLE IF NOT EXISTS capture_sessions (
  id TEXT NOT NULL PRIMARY KEY,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  mode TEXT NOT NULL,
  source_scope TEXT NOT NULL,
  source_process TEXT NOT NULL,
  proxy_url TEXT
) STRICT;

CREATE TABLE IF NOT EXISTS capture_blobs (
  blob_id TEXT NOT NULL PRIMARY KEY,
  content_type TEXT,
  encoding TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  sha256 TEXT NOT NULL,
  data BLOB NOT NULL,
  created_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS capture_events (
  id INTEGER NOT NULL PRIMARY KEY,
  session_id TEXT NOT NULL,
  ts INTEGER NOT NULL,
  source_scope TEXT NOT NULL,
  source_process TEXT NOT NULL,
  protocol TEXT NOT NULL,
  direction TEXT NOT NULL,
  kind TEXT NOT NULL,
  flow_id TEXT NOT NULL,
  method TEXT,
  host TEXT,
  path TEXT,
  status INTEGER,
  close_code INTEGER,
  content_type TEXT,
  headers_json TEXT,
  data_text TEXT,
  data_blob_id TEXT,
  data_sha256 TEXT,
  error_text TEXT,
  meta_json TEXT,
  FOREIGN KEY (session_id) REFERENCES capture_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (data_blob_id) REFERENCES capture_blobs(blob_id) ON DELETE SET NULL
) STRICT;

CREATE INDEX IF NOT EXISTS capture_events_session_ts_idx
  ON capture_events(session_id, ts);

CREATE INDEX IF NOT EXISTS capture_events_flow_idx
  ON capture_events(flow_id, ts);

CREATE TABLE IF NOT EXISTS sandbox_registry_entries (
  registry_kind TEXT NOT NULL,
  container_name TEXT NOT NULL,
  session_key TEXT,
  backend_id TEXT,
  runtime_label TEXT,
  image TEXT,
  created_at_ms INTEGER,
  last_used_at_ms INTEGER,
  config_label_kind TEXT,
  config_hash TEXT,
  cdp_port INTEGER,
  no_vnc_port INTEGER,
  entry_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (registry_kind, container_name)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_sandbox_registry_updated
  ON sandbox_registry_entries(registry_kind, updated_at DESC, container_name);

CREATE INDEX IF NOT EXISTS idx_sandbox_registry_session
  ON sandbox_registry_entries(registry_kind, session_key, last_used_at_ms DESC, container_name)
  WHERE session_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sandbox_registry_last_used
  ON sandbox_registry_entries(registry_kind, last_used_at_ms DESC, container_name)
  WHERE last_used_at_ms IS NOT NULL;

CREATE TABLE IF NOT EXISTS cron_jobs (
  store_key TEXT NOT NULL,
  job_id TEXT NOT NULL,
  declaration_key TEXT,
  owner_agent_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  enabled INTEGER NOT NULL,
  agent_id TEXT,
  payload_kind TEXT NOT NULL,
  job_json TEXT NOT NULL,
  grant_definition_revision TEXT,
  grant_definition_generation INTEGER,
  grant_definition_updated_at INTEGER,
  state_json TEXT NOT NULL DEFAULT '{}',
  runtime_updated_at_ms INTEGER,
  schedule_identity TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (store_key, job_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_cron_jobs_store_order
  ON cron_jobs(store_key, sort_order ASC, updated_at ASC, job_id);

-- One owner-native receipt is also the durable execution fence. Receipts
-- survive job deletion so operators can distinguish a run from log inference.
CREATE TABLE IF NOT EXISTS cron_run_receipts (
  cursor_id INTEGER NOT NULL,
  receipt_id TEXT PRIMARY KEY,
  store_key TEXT NOT NULL,
  job_id TEXT NOT NULL,
  config_revision TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  request_run_id TEXT,
  delivery_attempt_state TEXT NOT NULL DEFAULT 'unknown' CHECK (delivery_attempt_state IN ('unknown', 'not-started', 'started')),
  status TEXT NOT NULL,
  owner_pid INTEGER NOT NULL,
  owner_start_time INTEGER,
  started_at_ms INTEGER NOT NULL,
  finished_at_ms INTEGER,
  error_text TEXT,
  CHECK (status IN ('running', 'ok', 'error', 'skipped', 'interrupted', 'superseded')),
  CHECK (
    (status = 'running' AND finished_at_ms IS NULL)
    OR
    (status != 'running' AND finished_at_ms IS NOT NULL)
  )
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS cron_run_receipts_cursor_id_idx
  ON cron_run_receipts(cursor_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cron_run_receipts_active_job
  ON cron_run_receipts(store_key, job_id)
  WHERE status = 'running';

CREATE INDEX IF NOT EXISTS idx_cron_run_receipts_job_history
  ON cron_run_receipts(store_key, job_id, started_at_ms DESC, receipt_id DESC);

-- Retirement follows the receipt's retention without changing its released shape.
CREATE TABLE IF NOT EXISTS cron_run_trigger_state_retirements (
  receipt_id TEXT PRIMARY KEY
    REFERENCES cron_run_receipts(receipt_id) ON DELETE CASCADE
) STRICT;

-- Runtime-private authority is independent of job_json so downgraded writers
-- can rewrite recognized job config without erasing or silently widening it.
CREATE TABLE IF NOT EXISTS cron_job_runtime_authorities (
  store_key TEXT NOT NULL,
  job_id TEXT NOT NULL,
  authority_json TEXT,
  authority_input_fingerprint TEXT,
  recovery_required INTEGER NOT NULL,
  PRIMARY KEY (store_key, job_id),
  FOREIGN KEY (store_key, job_id)
    REFERENCES cron_jobs(store_key, job_id) ON DELETE CASCADE,
  CHECK (recovery_required IN (0, 1)),
  CHECK (
    (recovery_required = 0 AND authority_json IS NOT NULL AND authority_input_fingerprint IS NOT NULL)
    OR
    (recovery_required = 1 AND authority_json IS NULL AND authority_input_fingerprint IS NULL)
  )
) STRICT;

-- Scratch is separate from cron_jobs so scheduler state writes and downgraded
-- full-row replacement preserve it. New builds prune rows explicitly on job removal.
-- content NULL is a tombstone: it keeps the revision lineage monotonic across
-- unset/recreate so stale compare-and-swap writes cannot resurrect old content.
CREATE TABLE IF NOT EXISTS cron_job_scratch (
  store_key TEXT NOT NULL,
  job_id TEXT NOT NULL,
  content TEXT,
  revision INTEGER NOT NULL,
  source_sha256 TEXT,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (store_key, job_id),
  CHECK (revision >= 1),
  CHECK (content IS NULL OR length(CAST(content AS BLOB)) <= 262144)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_cron_job_scratch_store_updated
  ON cron_job_scratch(store_key, updated_at_ms DESC, job_id);

CREATE TABLE IF NOT EXISTS delivery_queue_entries (
  queue_name TEXT NOT NULL,
  id TEXT NOT NULL,
  status TEXT NOT NULL,
  entry_kind TEXT,
  session_key TEXT,
  channel TEXT,
  target TEXT,
  account_id TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER,
  last_error TEXT,
  recovery_state TEXT,
  platform_send_started_at INTEGER,
  entry_json TEXT NOT NULL,
  retention_id_prefix TEXT,
  retention_max_age_ms INTEGER,
  retention_max_entries INTEGER,
  enqueued_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  failed_at INTEGER,
  PRIMARY KEY (queue_name, id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_delivery_queue_pending
  ON delivery_queue_entries(queue_name, status, enqueued_at, id);

CREATE INDEX IF NOT EXISTS idx_delivery_queue_failed
  ON delivery_queue_entries(status, queue_name, failed_at, id);

CREATE INDEX IF NOT EXISTS idx_delivery_queue_session
  ON delivery_queue_entries(queue_name, status, session_key, enqueued_at, id)
  WHERE session_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_delivery_queue_target
  ON delivery_queue_entries(queue_name, status, channel, target, enqueued_at, id)
  WHERE channel IS NOT NULL AND target IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_delivery_queue_bounded_retention
  ON delivery_queue_entries(queue_name, retention_id_prefix, enqueued_at DESC, id DESC)
  WHERE status IN ('completed', 'failed') AND recovery_state = 'completed_bounded'
    AND retention_id_prefix IS NOT NULL;

CREATE TABLE IF NOT EXISTS task_runs (
  task_id TEXT NOT NULL PRIMARY KEY,
  runtime TEXT NOT NULL,
  task_kind TEXT,
  source_id TEXT,
  requester_session_key TEXT,
  owner_key TEXT NOT NULL,
  scope_kind TEXT NOT NULL,
  child_session_key TEXT,
  parent_flow_id TEXT,
  parent_task_id TEXT,
  agent_id TEXT,
  requester_agent_id TEXT,
  run_id TEXT,
  execution_owner_host TEXT,
  execution_owner_pid INTEGER,
  execution_owner_start_identity INTEGER,
  label TEXT,
  task TEXT NOT NULL,
  status TEXT NOT NULL,
  delivery_status TEXT NOT NULL,
  notify_policy TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  started_at INTEGER,
  ended_at INTEGER,
  last_event_at INTEGER,
  cleanup_after INTEGER,
  tool_use_count INTEGER,
  last_tool_name TEXT,
  error TEXT,
  progress_summary TEXT,
  terminal_summary TEXT,
  terminal_outcome TEXT,
  detail_json TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_task_runs_run_id ON task_runs(run_id);
CREATE INDEX IF NOT EXISTS idx_task_runs_status ON task_runs(status);
CREATE INDEX IF NOT EXISTS idx_task_runs_runtime_status ON task_runs(runtime, status);
CREATE INDEX IF NOT EXISTS idx_task_runs_cleanup_after ON task_runs(cleanup_after);
CREATE INDEX IF NOT EXISTS idx_task_runs_last_event_at ON task_runs(last_event_at);
CREATE INDEX IF NOT EXISTS idx_task_runs_owner_key ON task_runs(owner_key);
CREATE INDEX IF NOT EXISTS idx_task_runs_parent_flow_id ON task_runs(parent_flow_id);
CREATE INDEX IF NOT EXISTS idx_task_runs_child_session_key ON task_runs(child_session_key);
CREATE INDEX IF NOT EXISTS idx_task_runs_requester_session_key ON task_runs(requester_session_key);
CREATE INDEX IF NOT EXISTS idx_task_runs_runtime_source_ended
  ON task_runs(runtime, source_id, ended_at, created_at, task_id);
CREATE INDEX IF NOT EXISTS idx_task_runs_runtime_ended
  ON task_runs(runtime, ended_at, created_at, task_id);

CREATE TABLE IF NOT EXISTS subagent_runs (
  run_id TEXT NOT NULL PRIMARY KEY,
  child_session_key TEXT NOT NULL,
  controller_session_key TEXT,
  controller_store_path TEXT,
  requester_session_key TEXT NOT NULL,
  requester_store_path TEXT,
  created_at INTEGER NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}'
) STRICT;

CREATE INDEX IF NOT EXISTS idx_subagent_runs_child_session_key
  ON subagent_runs(child_session_key, created_at DESC, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_requester_session_key
  ON subagent_runs(requester_session_key, created_at DESC, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_controller_session_key
  ON subagent_runs(controller_session_key, created_at DESC, run_id);

CREATE TABLE IF NOT EXISTS current_conversation_bindings (
  binding_key TEXT NOT NULL PRIMARY KEY,
  binding_id TEXT NOT NULL,
  target_session_key TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT NOT NULL,
  conversation_kind TEXT NOT NULL,
  parent_conversation_id TEXT,
  conversation_id TEXT NOT NULL,
  target_kind TEXT NOT NULL,
  status TEXT NOT NULL,
  bound_at INTEGER NOT NULL,
  expires_at INTEGER,
  metadata_json TEXT,
  record_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_target
  ON current_conversation_bindings(target_session_key, updated_at DESC, binding_key);
CREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_conversation
  ON current_conversation_bindings(channel, account_id, conversation_kind, conversation_id);
CREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_expires
  ON current_conversation_bindings(expires_at, binding_key);

CREATE TABLE IF NOT EXISTS plugin_binding_approvals (
  plugin_root TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT NOT NULL,
  plugin_id TEXT NOT NULL,
  plugin_name TEXT,
  approved_at INTEGER NOT NULL,
  PRIMARY KEY (plugin_root, channel, account_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_plugin_binding_approvals_plugin
  ON plugin_binding_approvals(plugin_id, approved_at DESC);

CREATE TABLE IF NOT EXISTS task_delivery_state (
  task_id TEXT NOT NULL PRIMARY KEY,
  requester_origin_json TEXT,
  last_notified_event_at INTEGER,
  FOREIGN KEY (task_id) REFERENCES task_runs(task_id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS flow_runs (
  flow_id TEXT NOT NULL PRIMARY KEY,
  shape TEXT,
  sync_mode TEXT NOT NULL DEFAULT 'managed',
  owner_key TEXT NOT NULL,
  requester_origin_json TEXT,
  controller_id TEXT,
  revision INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  notify_policy TEXT NOT NULL,
  goal TEXT NOT NULL,
  current_step TEXT,
  blocked_task_id TEXT,
  blocked_summary TEXT,
  state_json TEXT,
  wait_json TEXT,
  cancel_requested_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  ended_at INTEGER
) STRICT;

CREATE INDEX IF NOT EXISTS idx_flow_runs_status ON flow_runs(status);
CREATE INDEX IF NOT EXISTS idx_flow_runs_owner_key ON flow_runs(owner_key);
CREATE INDEX IF NOT EXISTS idx_flow_runs_updated_at ON flow_runs(updated_at);

-- Durable meeting-capture sessions are gateway-global rather than agent-session
-- transcripts. JSON/JSONL files are doctor import inputs or explicit CLI exports.
CREATE TABLE IF NOT EXISTS meeting_transcript_sessions (
  session_id TEXT NOT NULL,
  started_at TEXT NOT NULL,
  selector TEXT NOT NULL UNIQUE,
  export_key TEXT NOT NULL,
  session_slug TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  title TEXT,
  source_json TEXT NOT NULL,
  source_account_id TEXT,
  source_guild_id TEXT,
  source_channel_id TEXT,
  source_meeting_url TEXT,
  source_thread_ts TEXT,
  source_file_id TEXT,
  stopped_at TEXT,
  metadata_json TEXT,
  metadata_agent_id TEXT,
  export_manifest_json TEXT NOT NULL DEFAULT '{}',
  export_pending_json TEXT NOT NULL DEFAULT '[]',
  next_utterance_seq INTEGER NOT NULL DEFAULT 0 CHECK (next_utterance_seq >= 0),
  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),
  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),
  PRIMARY KEY (session_id, started_at)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_started
  ON meeting_transcript_sessions(started_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_id
  ON meeting_transcript_sessions(session_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_slug
  ON meeting_transcript_sessions(session_slug, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_export_key
  ON meeting_transcript_sessions(export_key);

CREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_source
  ON meeting_transcript_sessions(provider_id, source_account_id, source_guild_id,
    source_channel_id, source_meeting_url, source_thread_ts, source_file_id,
    stopped_at DESC, started_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_account
  ON meeting_transcript_sessions(source_account_id);

CREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_agent
  ON meeting_transcript_sessions(metadata_agent_id);

CREATE TABLE IF NOT EXISTS meeting_transcript_utterances (
  session_id TEXT NOT NULL,
  session_started_at TEXT NOT NULL,
  sequence INTEGER NOT NULL CHECK (sequence >= 0),
  utterance_id TEXT,
  started_at TEXT,
  ended_at TEXT,
  speaker_id TEXT,
  speaker_label TEXT,
  text TEXT NOT NULL,
  final INTEGER CHECK (final IN (0, 1)),
  metadata_json TEXT,
  PRIMARY KEY (session_id, session_started_at, sequence),
  FOREIGN KEY (session_id, session_started_at)
    REFERENCES meeting_transcript_sessions(session_id, started_at)
    ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_meeting_transcript_utterances_id
  ON meeting_transcript_utterances(session_id, session_started_at, utterance_id)
  WHERE utterance_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS meeting_transcript_summaries (
  session_id TEXT NOT NULL,
  session_started_at TEXT NOT NULL,
  generated_at TEXT,
  summary_json TEXT,
  overview TEXT,
  markdown TEXT,
  utterance_count INTEGER NOT NULL CHECK (utterance_count >= 0),
  PRIMARY KEY (session_id, session_started_at),
  FOREIGN KEY (session_id, session_started_at)
    REFERENCES meeting_transcript_sessions(session_id, started_at)
    ON DELETE CASCADE,
  CHECK (summary_json IS NOT NULL OR markdown IS NOT NULL)
) STRICT;

CREATE TABLE IF NOT EXISTS migration_runs (
  id TEXT NOT NULL PRIMARY KEY,
  started_at INTEGER NOT NULL,
  finished_at INTEGER,
  status TEXT NOT NULL,
  report_json TEXT NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_migration_runs_started
  ON migration_runs(started_at DESC, id);

CREATE TABLE IF NOT EXISTS migration_sources (
  source_key TEXT NOT NULL PRIMARY KEY,
  migration_kind TEXT NOT NULL,
  source_path TEXT NOT NULL,
  target_table TEXT NOT NULL,
  source_sha256 TEXT,
  source_size_bytes INTEGER,
  source_record_count INTEGER,
  last_run_id TEXT NOT NULL,
  status TEXT NOT NULL,
  imported_at INTEGER NOT NULL,
  removed_source INTEGER NOT NULL DEFAULT 0,
  report_json TEXT NOT NULL,
  FOREIGN KEY (last_run_id) REFERENCES migration_runs(id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_migration_sources_path
  ON migration_sources(source_path, migration_kind, target_table);

CREATE INDEX IF NOT EXISTS idx_migration_sources_run
  ON migration_sources(last_run_id, source_path);

CREATE TABLE IF NOT EXISTS backup_runs (
  id TEXT NOT NULL PRIMARY KEY,
  created_at INTEGER NOT NULL,
  archive_path TEXT NOT NULL,
  status TEXT NOT NULL,
  manifest_json TEXT NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_backup_runs_created
  ON backup_runs(created_at DESC, id);

CREATE TABLE IF NOT EXISTS worktrees (
  id TEXT NOT NULL PRIMARY KEY,
  repo_fingerprint TEXT NOT NULL,
  repo_root TEXT NOT NULL,
  path TEXT NOT NULL,
  branch TEXT NOT NULL,
  base_ref TEXT NOT NULL,
  owner_kind TEXT NOT NULL CHECK (owner_kind IN ('manual', 'workboard', 'session')),
  owner_id TEXT,
  snapshot_ref TEXT,
  provisioned_paths_json TEXT,
  created_at INTEGER NOT NULL,
  last_active_at INTEGER NOT NULL,
  removed_at INTEGER,
  run_end_cleanup_json TEXT,
  gc_protection_json TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_worktrees_repo_fingerprint
  ON worktrees(repo_fingerprint);

CREATE INDEX IF NOT EXISTS idx_worktrees_removed_at
  ON worktrees(removed_at);

CREATE TABLE IF NOT EXISTS worktree_provisioned_file_chunks (
  worktree_id TEXT NOT NULL,
  path TEXT NOT NULL,
  chunk_index INTEGER NOT NULL CHECK (chunk_index >= 0),
  data BLOB NOT NULL,
  PRIMARY KEY (worktree_id, path, chunk_index)
) STRICT;

CREATE TABLE IF NOT EXISTS worktree_templates (
  cache_key TEXT NOT NULL PRIMARY KEY,
  id TEXT NOT NULL UNIQUE,
  repo_root TEXT NOT NULL,
  common_dir TEXT NOT NULL,
  worktree_root TEXT NOT NULL,
  path TEXT NOT NULL,
  backend TEXT NOT NULL,
  source_commit TEXT NOT NULL,
  content_key TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('preparing', 'ready')),
  created_at INTEGER NOT NULL,
  last_used_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS projects (
  id TEXT NOT NULL PRIMARY KEY,
  display_name TEXT NOT NULL,
  repo_root TEXT NOT NULL,
  origin_url TEXT,
  source TEXT NOT NULL CHECK (source IN ('registered', 'cloned')),
  created_at_ms INT NOT NULL,
  updated_at_ms INT NOT NULL
) STRICT;

-- One explicitly retained, normalized private background per durable profile.
CREATE TABLE IF NOT EXISTS user_background_images (
  profile_id TEXT NOT NULL PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  asset_id TEXT NOT NULL UNIQUE,
  image BLOB NOT NULL CHECK (length(image) BETWEEN 1 AND 2097152),
  width INTEGER NOT NULL CHECK (width BETWEEN 1 AND 2560),
  height INTEGER NOT NULL CHECK (height BETWEEN 1 AND 2560)
) STRICT;

CREATE TABLE IF NOT EXISTS user_preferences (
  profile_id TEXT NOT NULL,
  pref_key TEXT NOT NULL,
  value_json TEXT NOT NULL,
  updated_at_ms INT NOT NULL,
  PRIMARY KEY (profile_id, pref_key)
) STRICT;

-- Gateway-owned custom session group catalog (names + display order).
-- Membership stays on each session entry's category field; this table only
-- owns which groups exist and how operator UIs order them.
CREATE TABLE IF NOT EXISTS session_groups (
  name TEXT NOT NULL PRIMARY KEY,
  position INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  cwd TEXT,
  worktree INTEGER
) STRICT;

-- Gateway-owned durable cloud worker lifecycle. Provider-specific execution
-- stays in plugins; this table records only core reconciliation facts.
CREATE TABLE IF NOT EXISTS worker_environments (
  environment_id TEXT NOT NULL PRIMARY KEY,
  provider_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  profile_snapshot_json TEXT NOT NULL,
  last_activated_at_ms INTEGER,
  preparation_key TEXT,
  preparation_purpose TEXT,
  preparation_demand_at_ms INTEGER,
  preparation_expires_at_ms INTEGER,
  preparation_consumed_at_ms INTEGER CHECK (
    (preparation_key IS NULL AND preparation_demand_at_ms IS NULL
      AND preparation_expires_at_ms IS NULL AND preparation_consumed_at_ms IS NULL)
    OR
    (preparation_key IS NOT NULL AND length(preparation_key) = 64
      AND preparation_key NOT GLOB '*[^0-9a-f]*'
      AND preparation_demand_at_ms IS NOT NULL
      AND preparation_demand_at_ms BETWEEN 0 AND 9007199254740991
      AND preparation_expires_at_ms IS NOT NULL
      AND preparation_expires_at_ms > preparation_demand_at_ms
      AND preparation_expires_at_ms <= 9007199254740991
      AND (preparation_consumed_at_ms IS NULL
        OR (preparation_consumed_at_ms >= preparation_demand_at_ms
          AND preparation_consumed_at_ms < preparation_expires_at_ms)))
  ),
  provision_operation_id TEXT NOT NULL UNIQUE,
  lease_id TEXT,
  node_setup_id TEXT,
  node_device_id TEXT,
  ssh_host TEXT,
  ssh_port INTEGER CHECK (ssh_port IS NULL OR (ssh_port >= 1 AND ssh_port <= 65535)),
  ssh_user TEXT,
  ssh_host_key TEXT,
  ssh_key_ref_json TEXT,
  desktop_json TEXT,
  state TEXT NOT NULL CHECK (
    state IN (
      'requested',
      'provisioning',
      'bootstrapping',
      'ready',
      'attached',
      'idle',
      'draining',
      'destroying',
      'destroyed',
      'failed',
      'orphaned'
    )
  ),
  bootstrap_bundle_hash TEXT,
  bootstrap_openclaw_version TEXT,
  bootstrap_protocol_features_json TEXT,
  bootstrap_install_kind TEXT,
  owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0),
  teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed')),
  attached_session_ids_json TEXT NOT NULL DEFAULT '[]',
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  state_changed_at_ms INTEGER NOT NULL,
  idle_since_at_ms INTEGER,
  destroy_requested_at_ms INTEGER,
  last_error TEXT,
  shared_host INTEGER
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_worker_environments_provider_lease
  ON worker_environments(provider_id, lease_id)
  WHERE lease_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_worker_environments_terminal_changed
  ON worker_environments(state_changed_at_ms, environment_id);

-- A dedicated node registers its fixed build paths before ready, then binds
-- them once. The environment belongs to the Gateway's separate database.
CREATE TABLE IF NOT EXISTS node_worker_prepared_workspaces (
  preparation_key TEXT NOT NULL PRIMARY KEY CHECK (
    length(preparation_key) = 64 AND preparation_key NOT GLOB '*[^0-9a-f]*'
  ),
  cache_key TEXT NOT NULL CHECK (
    length(cache_key) = 64 AND cache_key NOT GLOB '*[^0-9a-f]*'
  ),
  gateway_namespace TEXT NOT NULL CHECK (length(gateway_namespace) > 0),
  workspace_dir TEXT NOT NULL UNIQUE CHECK (length(workspace_dir) > 0),
  home_dir TEXT NOT NULL CHECK (length(home_dir) > 0),
  source_manifest_ref TEXT NOT NULL CHECK (
    length(source_manifest_ref) = 71 AND substr(source_manifest_ref, 1, 7) = 'sha256:'
      AND substr(source_manifest_ref, 8) NOT GLOB '*[^0-9a-f]*'
  ),
  prepared_manifest_ref TEXT NOT NULL CHECK (
    length(prepared_manifest_ref) = 71 AND substr(prepared_manifest_ref, 1, 7) = 'sha256:'
      AND substr(prepared_manifest_ref, 8) NOT GLOB '*[^0-9a-f]*'
  ),
  state TEXT NOT NULL CHECK (state IN ('available', 'bound', 'retiring', 'retired')),
  environment_id TEXT NOT NULL CHECK (length(environment_id) > 0),
  session_id TEXT,
  session_key TEXT,
  owner_epoch INTEGER CHECK (owner_epoch BETWEEN 1 AND 9007199254740991),
  created_at_ms INTEGER NOT NULL CHECK (created_at_ms BETWEEN 0 AND 9007199254740991),
  bound_at_ms INTEGER CHECK (bound_at_ms BETWEEN created_at_ms AND 9007199254740991),
  retired_at_ms INTEGER CHECK (
    retired_at_ms BETWEEN coalesce(bound_at_ms, created_at_ms) AND 9007199254740991
  ),
  CHECK (
    (session_id IS NULL AND session_key IS NULL AND owner_epoch IS NULL AND bound_at_ms IS NULL)
    OR
    (session_id IS NOT NULL AND length(session_id) > 0
      AND session_key IS NOT NULL AND length(session_key) > 0
      AND owner_epoch IS NOT NULL AND bound_at_ms IS NOT NULL)
  ),
  CHECK (
    (state = 'available' AND bound_at_ms IS NULL AND retired_at_ms IS NULL)
    OR (state = 'bound' AND bound_at_ms IS NOT NULL AND retired_at_ms IS NULL)
    OR (state = 'retiring' AND retired_at_ms IS NULL)
    OR (state = 'retired' AND retired_at_ms IS NOT NULL)
  )
) STRICT;

-- Provider-advertised fallback ports preserve stable retry order separately
-- from the downgrade-sensitive canonical worker environment row.
CREATE TABLE IF NOT EXISTS worker_environment_ssh_fallback_ports (
  environment_id TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 0 AND position <= 9),
  port INTEGER NOT NULL CHECK (port >= 1 AND port <= 65535),
  PRIMARY KEY (environment_id, position),
  UNIQUE (environment_id, port),
  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE
) STRICT;

-- Logical sessions own repository intent and accepted artifact references,
-- independently of the worker or rotating transcript session id.
CREATE TABLE IF NOT EXISTS session_repository_workspaces (
  workspace_id TEXT NOT NULL PRIMARY KEY CHECK (length(workspace_id) = 36),
  agent_id TEXT NOT NULL CHECK (length(agent_id) BETWEEN 1 AND 128),
  session_key TEXT NOT NULL CHECK (length(session_key) BETWEEN 1 AND 1024),
  url TEXT NOT NULL CHECK (length(url) BETWEEN 1 AND 4096),
  requested_ref TEXT CHECK (requested_ref IS NULL OR length(requested_ref) BETWEEN 1 AND 1024),
  run_setup_script INTEGER NOT NULL DEFAULT 0 CHECK (run_setup_script IN (0, 1)),
  base_commit TEXT CHECK (base_commit IS NULL OR length(base_commit) IN (40, 64)),
  base_manifest_hash TEXT,
  branch TEXT NOT NULL CHECK (length(branch) BETWEEN 1 AND 256),
  checkpoint_ref TEXT,
  manifest_hash TEXT,
  revision INTEGER NOT NULL CHECK (revision >= 0),
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  UNIQUE (agent_id, session_key),
  CHECK (base_manifest_hash IS NULL OR base_commit IS NOT NULL),
  CHECK ((checkpoint_ref IS NULL AND manifest_hash IS NULL)
    OR (checkpoint_ref IS NOT NULL AND manifest_hash IS NOT NULL AND base_manifest_hash IS NOT NULL))
) STRICT;

CREATE TABLE IF NOT EXISTS github_repository_publication_requests (
  request_id TEXT NOT NULL PRIMARY KEY,
  owner_profile_id TEXT,
  connection_generation TEXT,
  idempotency_key TEXT NOT NULL,
  request_digest TEXT NOT NULL,
  session_id TEXT NOT NULL,
  session_lifecycle_revision TEXT,
  requester_authority_json TEXT,
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  workspace_id TEXT NOT NULL,
  checkpoint_ref TEXT,
  checkpoint_digest TEXT,
  claim_id TEXT,
  run_id TEXT,
  environment_id TEXT,
  owner_epoch INTEGER,
  placement_generation INTEGER,
  identity_source TEXT NOT NULL CHECK (identity_source IN ('system-detected', 'system-configured', 'agent-override', 'personal')),
  identity_profile_id TEXT,
  identity_account_id INTEGER NOT NULL,
  identity_login TEXT NOT NULL,
  title TEXT,
  body TEXT,
  status TEXT NOT NULL CHECK (status IN ('requested', 'publishing', 'needs_confirmation', 'published', 'failed')),
  gateway_instance_id TEXT,
  execution_id TEXT,
  last_effect TEXT CHECK (last_effect IN ('push', 'pull_request')),
  effect_state TEXT CHECK (effect_state IN ('dispatched', 'observed')),
  push_repository TEXT,
  repository TEXT,
  branch TEXT NOT NULL,
  base_branch TEXT,
  source_head_commit TEXT,
  source_index_tree TEXT,
  workspace_tree TEXT,
  previous_head_commit TEXT,
  pushed_head_commit TEXT,
  head_commit TEXT,
  pull_request_url TEXT,
  error_code TEXT,
  next_action TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  reported_at_ms INTEGER,
  CHECK ((identity_source = 'personal' AND owner_profile_id IS NOT NULL AND connection_generation IS NOT NULL)
    OR (identity_source <> 'personal' AND owner_profile_id IS NULL AND connection_generation IS NULL)),
  CHECK ((checkpoint_ref IS NULL AND checkpoint_digest IS NULL) OR (checkpoint_ref IS NOT NULL AND checkpoint_digest IS NOT NULL)),
  CHECK ((last_effect IS NULL AND effect_state IS NULL) OR (last_effect IS NOT NULL AND effect_state IS NOT NULL))
) STRICT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_github_repository_publication_shared_request
  ON github_repository_publication_requests(session_id, idempotency_key) WHERE owner_profile_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_github_repository_publication_personal_request
  ON github_repository_publication_requests(owner_profile_id, session_id, idempotency_key) WHERE owner_profile_id IS NOT NULL;

-- Session placement lives in the shared state database so local admission,
-- worker admission, and environment attachment use one durable authority.
CREATE TABLE IF NOT EXISTS worker_session_placements (
  session_id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  execution_mode TEXT CHECK (execution_mode IN ('worker-turn', 'remote-exec')),
  state TEXT NOT NULL CHECK (
    state IN (
      'local',
      'requested',
      'provisioning',
      'syncing',
      'starting',
      'active',
      'draining',
      'reconciling',
      'reclaimed',
      'failed'
    )
  ),
  environment_id TEXT,
  transition_generation INTEGER NOT NULL DEFAULT 0 CHECK (transition_generation >= 0),
  active_owner_epoch INTEGER CHECK (active_owner_epoch IS NULL OR active_owner_epoch >= 1),
  workspace_base_manifest_ref TEXT,
  remote_workspace_dir TEXT,
  worker_bundle_hash TEXT,
  last_transcript_ack_cursor INTEGER CHECK (
    last_transcript_ack_cursor IS NULL OR last_transcript_ack_cursor >= 0
  ),
  last_live_event_ack_cursor INTEGER CHECK (
    last_live_event_ack_cursor IS NULL OR last_live_event_ack_cursor >= 0
  ),
  recovery_error TEXT,
  turn_claim_owner TEXT CHECK (turn_claim_owner IN ('local', 'worker')),
  turn_claim_id TEXT,
  turn_claim_run_id TEXT,
  turn_claim_generation INTEGER CHECK (
    turn_claim_generation IS NULL OR turn_claim_generation >= 0
  ),
  turn_claim_owner_epoch INTEGER CHECK (
    turn_claim_owner_epoch IS NULL OR turn_claim_owner_epoch >= 1
  ),
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  state_changed_at_ms INTEGER NOT NULL,
  terminal_reason TEXT,
  terminal_at_ms INTEGER,
  CHECK (
    (state IN ('local', 'requested')
      AND environment_id IS NULL AND active_owner_epoch IS NULL
      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL
      AND worker_bundle_hash IS NULL
      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL
      AND recovery_error IS NULL)
    OR
    (state IS 'provisioning'
      AND active_owner_epoch IS NULL
      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL
      AND worker_bundle_hash IS NULL
      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL
      AND recovery_error IS NULL)
    OR
    (state IS 'syncing'
      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL
      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL
      AND worker_bundle_hash IS NOT NULL
      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL
      AND recovery_error IS NULL)
    OR
    (state IS 'starting'
      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL
      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL
      AND worker_bundle_hash IS NOT NULL
      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL
      AND recovery_error IS NULL)
    OR
    (state IN ('active', 'draining', 'reconciling')
      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL
      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL
      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL)
    OR
    (state IS 'reclaimed'
      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL
      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL
      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL
      AND turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL
      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)
    OR
    (state IS 'failed' AND recovery_error IS NOT NULL)
  ),
  CHECK (
    (turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL
      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)
    OR
    (turn_claim_owner IS 'local' AND turn_claim_id IS NOT NULL
      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL
      AND turn_claim_owner_epoch IS NULL)
    OR
    (turn_claim_owner IS 'worker' AND turn_claim_id IS NOT NULL
      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL
      AND turn_claim_owner_epoch IS NOT NULL)
  ),
  CHECK (
    turn_claim_owner IS NULL
    OR
    (turn_claim_owner IS 'local' AND (
      state IN ('local', 'requested', 'failed')
      OR (state IN ('active', 'draining') AND execution_mode IS 'remote-exec')
    ))
    OR
    (turn_claim_owner IS 'worker' AND state IN ('active', 'draining')
      AND (execution_mode IS NULL OR execution_mode IS 'worker-turn')
      AND turn_claim_owner_epoch IS active_owner_epoch)
  )
) STRICT;

CREATE INDEX IF NOT EXISTS idx_worker_session_placements_session_key
  ON worker_session_placements(agent_id, session_key);

CREATE INDEX IF NOT EXISTS idx_worker_session_placements_reconcile
  ON worker_session_placements(updated_at_ms, session_id);

CREATE INDEX IF NOT EXISTS idx_worker_session_placements_environment
  ON worker_session_placements(environment_id)
  WHERE environment_id IS NOT NULL;

-- Planned placement moves retain their exact source CAS and bounded target
-- without widening the stable placement-state vocabulary. The opaque operation
-- id fences stale asynchronous completion; it is correlation, never authority.
CREATE TABLE IF NOT EXISTS worker_session_placement_moves (
  operation_id TEXT NOT NULL PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE
    REFERENCES worker_session_placements(session_id) ON DELETE CASCADE,
  source_generation INTEGER NOT NULL CHECK (source_generation >= 0),
  source_environment_id TEXT NOT NULL CHECK (
    length(source_environment_id) BETWEEN 1 AND 256
    AND source_environment_id = trim(source_environment_id)
  ),
  source_owner_epoch INTEGER NOT NULL CHECK (source_owner_epoch >= 1),
  target_kind TEXT NOT NULL CHECK (target_kind IN ('gateway', 'profile', 'device')),
  target_id TEXT,
  -- Keep these nullable columns constraint-free so lazy ALTER TABLE produces the
  -- same shape as fresh databases; placement-move code validates their values.
  target_machine_class TEXT,
  target_os TEXT,
  -- Explicit source abandonment is a durable operator decision. Keep the bit
  -- bare and nullable so same-version older readers can safely omit it.
  abandon_source INTEGER,
  last_error TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  CHECK (
    (target_kind IS 'gateway' AND target_id IS NULL)
    OR
    (target_kind IN ('profile', 'device')
      AND target_id IS NOT NULL
      AND length(target_id) BETWEEN 1 AND 256
      AND target_id = trim(target_id))
  )
) STRICT;

-- Worker-visible session RPC authority is persisted against the exact turn
-- claim. The launch descriptor is informative only; Gateway dispatch always
-- revalidates this record and the live placement claim before executing.
CREATE TABLE IF NOT EXISTS worker_turn_tool_authorities (
  session_id TEXT NOT NULL PRIMARY KEY,
  environment_id TEXT NOT NULL,
  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),
  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),
  claim_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  tool_names_json TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE
) STRICT;

-- Tool-call ids are idempotency keys only within one exact source turn claim.
-- A running operation from another Gateway instance is ambiguous and is never
-- replayed. A persisted random seed separates durable downstream identities
-- from Gateway authentication keys and survives ordinary process restarts.
CREATE TABLE IF NOT EXISTS worker_session_tool_operations (
  source_session_id TEXT NOT NULL,
  source_claim_id TEXT NOT NULL,
  tool_call_id TEXT NOT NULL,
  tool_name TEXT NOT NULL CHECK (tool_name IN ('sessions_spawn', 'sessions_send')),
  request_digest TEXT NOT NULL,
  operation_seed TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed', 'unknown')),
  child_session_key TEXT,
  result_json TEXT,
  gateway_instance_id TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (source_session_id, source_claim_id, tool_call_id),
  FOREIGN KEY (source_session_id)
    REFERENCES worker_session_placements(session_id) ON DELETE CASCADE
) STRICT;

-- Local sandbox execution is a projection of a session-owned managed worktree.
-- No cascade: an older binary must not discard pending edits with a session row.
CREATE TABLE IF NOT EXISTS local_workspace_projections (
  worktree_id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  session_id TEXT NOT NULL,
  lifecycle_revision TEXT,
  projection_path TEXT NOT NULL UNIQUE,
  base_commit TEXT NOT NULL,
  source_paths_json TEXT NOT NULL,
  baseline_json TEXT,
  baseline_ref TEXT,
  pending_ref TEXT,
  pending_target TEXT CHECK (pending_target IN ('canonical', 'projection')),
  paused_runtimes_json TEXT,
  journal_json TEXT,
  journal_pack BLOB CHECK (journal_pack IS NULL OR length(journal_pack) <= 268435456),
  revision INTEGER NOT NULL DEFAULT 0 CHECK (revision >= 0),
  created_at_ms INTEGER NOT NULL,
  CHECK ((baseline_json IS NULL) = (baseline_ref IS NULL)),
  CHECK ((journal_json IS NULL) = (journal_pack IS NULL))
) STRICT;

-- A reconciliation journal is written before managed-worktree mutation. The
-- bounded Git base snapshot repairs any subset left by an interrupted apply.
CREATE TABLE IF NOT EXISTS worker_workspace_reconciliations (
  session_id TEXT NOT NULL PRIMARY KEY,
  environment_id TEXT NOT NULL,
  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),
  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),
  base_manifest_ref TEXT NOT NULL,
  current_manifest_ref TEXT NOT NULL,
  plan_json TEXT NOT NULL,
  base_pack BLOB NOT NULL CHECK (length(base_pack) <= 268435456),
  created_at_ms INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE
) STRICT;

-- A completed remote turn is fenced from stale-claim teardown until its
-- workspace result is durably reconciled into the managed worktree.
CREATE TABLE IF NOT EXISTS worker_workspace_pending_results (
  session_id TEXT NOT NULL PRIMARY KEY,
  environment_id TEXT NOT NULL,
  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),
  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),
  claim_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  gateway_instance_id TEXT NOT NULL,
  recovery_requested_at_ms INTEGER,
  workspace_accepted_at_ms INTEGER,
  staged_result_ref TEXT,
  repository_workspace_id TEXT,
  created_at_ms INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE
) STRICT;

-- GitHub publication intent records the authoritative session worktree. Cloud
-- requests execute only after the exact turn claim's result is accepted locally.
-- Secrets stay in the effective Gateway-owned GitHub profile and never enter
-- this row or the worker protocol.
CREATE TABLE IF NOT EXISTS github_publication_requests (
  request_id TEXT NOT NULL PRIMARY KEY,
  idempotency_key TEXT NOT NULL,
  request_digest TEXT NOT NULL,
  session_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  worktree_id TEXT NOT NULL,
  repository_fingerprint TEXT NOT NULL,
  claim_id TEXT,
  run_id TEXT,
  environment_id TEXT,
  owner_epoch INTEGER CHECK (owner_epoch IS NULL OR owner_epoch >= 1),
  placement_generation INTEGER CHECK (
    placement_generation IS NULL OR placement_generation >= 0
  ),
  identity_source TEXT NOT NULL CHECK (
    identity_source IN ('system-detected', 'system-configured', 'agent-override')
  ),
  identity_profile_id TEXT,
  identity_account_id INTEGER NOT NULL CHECK (identity_account_id >= 1),
  identity_login TEXT NOT NULL,
  title TEXT,
  body TEXT,
  status TEXT NOT NULL CHECK (
    status IN ('requested', 'publishing', 'published', 'failed')
  ),
  gateway_instance_id TEXT,
  repository TEXT,
  branch TEXT NOT NULL,
  base_branch TEXT,
  source_head_commit TEXT,
  source_index_tree TEXT,
  workspace_tree TEXT,
  head_commit TEXT,
  pull_request_url TEXT,
  error_code TEXT,
  next_action TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  reported_at_ms INTEGER,
  UNIQUE (session_id, idempotency_key),
  CHECK (
    (claim_id IS NULL AND run_id IS NULL AND environment_id IS NULL
      AND owner_epoch IS NULL AND placement_generation IS NULL)
    OR
    (claim_id IS NOT NULL AND run_id IS NOT NULL AND placement_generation IS NOT NULL
      AND ((environment_id IS NULL AND owner_epoch IS NULL)
        OR (environment_id IS NOT NULL AND owner_epoch IS NOT NULL)))
  ),
  CHECK (
    (identity_source IS 'system-detected' AND identity_profile_id IS NULL)
    OR
    (identity_source IN ('system-configured', 'agent-override')
      AND identity_profile_id IS NOT NULL)
  ),
  CHECK (
    (source_head_commit IS NULL AND source_index_tree IS NULL AND workspace_tree IS NULL)
    OR
    (source_head_commit IS NOT NULL AND workspace_tree IS NOT NULL)
  ),
  CHECK (
    (status IS 'published' AND pull_request_url IS NOT NULL AND error_code IS NULL
      AND next_action IS NULL)
    OR
    (status IS 'failed' AND pull_request_url IS NULL AND error_code IS NOT NULL
      AND next_action IS NOT NULL)
    OR
    (status IN ('requested', 'publishing') AND pull_request_url IS NULL
      AND error_code IS NULL AND next_action IS NULL)
  )
) STRICT;

CREATE INDEX IF NOT EXISTS idx_github_publication_requests_pending
  ON github_publication_requests(status, updated_at_ms, request_id);

-- Personal requests cannot be interpreted or resumed by older shared publishers.
CREATE TABLE IF NOT EXISTS github_personal_publication_requests (
  request_id TEXT NOT NULL PRIMARY KEY CHECK (length(request_id) = 36),
  owner_profile_id TEXT NOT NULL CHECK (length(owner_profile_id) BETWEEN 1 AND 128),
  connection_generation TEXT NOT NULL CHECK (length(connection_generation) = 36),
  idempotency_key TEXT NOT NULL CHECK (length(idempotency_key) BETWEEN 1 AND 128),
  request_digest TEXT NOT NULL CHECK (length(request_digest) = 64),
  session_id TEXT NOT NULL CHECK (length(session_id) BETWEEN 1 AND 128),
  session_key TEXT NOT NULL CHECK (length(session_key) BETWEEN 1 AND 1024),
  agent_id TEXT NOT NULL CHECK (length(agent_id) BETWEEN 1 AND 128),
  worktree_id TEXT NOT NULL CHECK (length(worktree_id) BETWEEN 1 AND 128),
  repository_fingerprint TEXT NOT NULL CHECK (length(repository_fingerprint) BETWEEN 1 AND 256),
  identity_source TEXT NOT NULL CHECK (identity_source = 'personal'),
  identity_profile_id TEXT NOT NULL CHECK (length(identity_profile_id) = 36),
  identity_account_id INTEGER NOT NULL CHECK (identity_account_id >= 1),
  identity_login TEXT NOT NULL CHECK (length(identity_login) BETWEEN 1 AND 39),
  title TEXT CHECK (title IS NULL OR length(title) BETWEEN 1 AND 256),
  body TEXT CHECK (body IS NULL OR length(body) BETWEEN 1 AND 8192),
  status TEXT NOT NULL CHECK (status IN ('requested', 'publishing', 'needs_confirmation', 'published', 'failed')),
  gateway_instance_id TEXT CHECK (gateway_instance_id IS NULL OR length(gateway_instance_id) BETWEEN 1 AND 128),
  execution_id TEXT CHECK (execution_id IS NULL OR length(execution_id) = 36),
  last_effect TEXT CHECK (last_effect IS NULL OR last_effect IN ('push', 'pull_request')),
  effect_state TEXT CHECK (effect_state IS NULL OR effect_state IN ('dispatched', 'observed')),
  push_repository TEXT NOT NULL CHECK (length(push_repository) BETWEEN 3 AND 256),
  repository TEXT NOT NULL CHECK (length(repository) BETWEEN 3 AND 256),
  branch TEXT NOT NULL CHECK (length(branch) BETWEEN 1 AND 256),
  base_branch TEXT NOT NULL CHECK (length(base_branch) BETWEEN 1 AND 256),
  source_head_commit TEXT NOT NULL CHECK (length(source_head_commit) IN (40, 64)),
  source_index_tree TEXT NOT NULL CHECK (length(source_index_tree) IN (40, 64)),
  workspace_tree TEXT NOT NULL CHECK (length(workspace_tree) IN (40, 64)),
  head_commit TEXT CHECK (head_commit IS NULL OR length(head_commit) IN (40, 64)),
  pull_request_url TEXT CHECK (pull_request_url IS NULL OR length(pull_request_url) BETWEEN 1 AND 2048),
  error_code TEXT CHECK (error_code IS NULL OR length(error_code) BETWEEN 1 AND 64),
  next_action TEXT CHECK (next_action IS NULL OR length(next_action) BETWEEN 1 AND 1024),
  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),
  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= created_at_ms),
  reported_at_ms INTEGER,
  UNIQUE (owner_profile_id, session_id, idempotency_key),
  CHECK ((status = 'publishing' AND gateway_instance_id IS NOT NULL AND execution_id IS NOT NULL) OR status <> 'publishing'),
  CHECK ((last_effect IS NULL AND effect_state IS NULL) OR (last_effect IS NOT NULL AND effect_state IS NOT NULL)),
  CHECK ((status = 'published' AND pull_request_url IS NOT NULL AND head_commit IS NOT NULL AND error_code IS NULL AND next_action IS NULL)
    OR (status = 'failed' AND error_code IS NOT NULL AND next_action IS NOT NULL)
    OR (status IN ('requested', 'publishing', 'needs_confirmation') AND error_code IS NULL AND next_action IS NULL))
) STRICT;
CREATE INDEX IF NOT EXISTS idx_github_personal_publication_owner_session
  ON github_personal_publication_requests(owner_profile_id, session_id, created_at_ms);
CREATE INDEX IF NOT EXISTS idx_github_personal_publication_pending
  ON github_personal_publication_requests(status, updated_at_ms, request_id);

-- Older readers validate both local receipt tables exactly. Their immutable
-- lifecycle binding stays in a first-use companion so those schemas remain readable.
CREATE TABLE IF NOT EXISTS github_publication_session_lifecycles (
  publication_kind TEXT NOT NULL CHECK (publication_kind IN ('shared', 'personal')),
  request_id TEXT NOT NULL,
  lifecycle_revision TEXT,
  requester_authority_json TEXT,
  PRIMARY KEY (publication_kind, request_id)
) STRICT;

-- One active, opaque admission credential per worker environment. Plaintext
-- may be retried until delivery acknowledgement but never enters durable state.
CREATE TABLE IF NOT EXISTS worker_environment_credentials (
  environment_id TEXT NOT NULL PRIMARY KEY,
  credential_hash TEXT NOT NULL UNIQUE,
  bundle_hash TEXT NOT NULL,
  session_id TEXT,
  rpc_set_version INTEGER NOT NULL CHECK (rpc_set_version >= 1),
  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 0),
  expires_at_ms INTEGER NOT NULL CHECK (expires_at_ms >= 0),
  delivered_at_ms INTEGER CHECK (delivered_at_ms >= 0),
  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE
) STRICT;

-- One durable sequence cursor per attached session owner epoch. The environment
-- binding prevents independent workers with coincident epochs from sharing replay state.
CREATE TABLE IF NOT EXISTS worker_transcript_commit_heads (
  session_id TEXT NOT NULL,
  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),
  environment_id TEXT NOT NULL,
  next_seq INTEGER NOT NULL CHECK (next_seq >= 1),
  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),
  PRIMARY KEY (session_id, run_epoch)
) STRICT;

-- Pending rows preserve a claimed request across gateway restarts. Terminal rows
-- cache the exact result returned for deterministic at-least-once replay.
CREATE TABLE IF NOT EXISTS worker_transcript_commits (
  session_id TEXT NOT NULL,
  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),
  seq INTEGER NOT NULL CHECK (seq >= 1),
  request_hash TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),
  result_json TEXT,
  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),
  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),
  PRIMARY KEY (session_id, run_epoch, seq),
  FOREIGN KEY (session_id, run_epoch)
    REFERENCES worker_transcript_commit_heads(session_id, run_epoch)
    ON DELETE CASCADE,
  CHECK (
    (state = 'pending' AND result_json IS NULL) OR
    (state = 'terminal' AND result_json IS NOT NULL)
  )
) STRICT;

-- Pending rows preserve a claimed inference turn across gateway restarts.
-- Terminal rows cache the exact outcome returned for deterministic replay.
CREATE TABLE IF NOT EXISTS worker_inference_turns (
  session_id TEXT NOT NULL,
  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),
  run_id TEXT NOT NULL,
  turn_id TEXT NOT NULL,
  environment_id TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),
  terminal_json TEXT,
  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),
  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),
  PRIMARY KEY (session_id, run_epoch, run_id, turn_id),
  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE,
  CHECK (
    (state = 'pending' AND terminal_json IS NULL) OR
    (state = 'terminal' AND terminal_json IS NOT NULL)
  )
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_worker_inference_turns_pending_run
  ON worker_inference_turns(session_id, run_epoch, run_id)
  WHERE state = 'pending';

CREATE TABLE IF NOT EXISTS claw_installs (
  agent_id TEXT NOT NULL PRIMARY KEY,
  schema_version TEXT NOT NULL,
  source_kind TEXT NOT NULL,
  claw_name TEXT NOT NULL,
  claw_version TEXT NOT NULL,
  package_root TEXT NOT NULL,
  manifest_path TEXT NOT NULL,
  integrity_kind TEXT NOT NULL,
  integrity TEXT NOT NULL,
  source_byte_length INTEGER NOT NULL,
  manifest_schema_version INTEGER NOT NULL,
  plan_integrity TEXT NOT NULL,
  workspace TEXT NOT NULL UNIQUE,
  agent_config_digest TEXT NOT NULL,
  agent_owned_paths_json TEXT NOT NULL,
  bootstrap_source_path TEXT,
  bootstrap_content_digest TEXT,
  status TEXT NOT NULL CHECK (
    status IN ('pending', 'workspace_ready', 'config_committed', 'complete', 'partial')
  ),
  added_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS claw_workspace_files (
  agent_id TEXT NOT NULL,
  target_path TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  workspace TEXT NOT NULL,
  source_path TEXT NOT NULL,
  content_digest TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (agent_id, target_path)
) STRICT;

CREATE TABLE IF NOT EXISTS claw_package_refs (
  agent_id TEXT NOT NULL,
  package_kind TEXT NOT NULL,
  package_source TEXT NOT NULL,
  package_ref TEXT NOT NULL,
  package_version TEXT NOT NULL,
  package_integrity TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  claw_name TEXT NOT NULL,
  package_status TEXT NOT NULL,
  relationship TEXT NOT NULL CHECK (relationship IN ('managed', 'referenced')),
  origin TEXT NOT NULL CHECK (origin IN ('claw-introduced', 'pre-existing')),
  independent_owner INTEGER NOT NULL CHECK (independent_owner IN (0, 1)),
  extension_id TEXT,
  extension_format TEXT,
  extension_detected_format TEXT,
  extension_mapped_json TEXT,
  extension_unavailable_json TEXT,
  extension_adapter_identity TEXT,
  installed_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (agent_id, package_kind, package_source, package_ref, package_version)
) STRICT;

CREATE TABLE IF NOT EXISTS claw_cron_refs (
  agent_id TEXT NOT NULL,
  manifest_id TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  declaration_key TEXT NOT NULL UNIQUE,
  scheduler_job_id TEXT UNIQUE,
  status TEXT NOT NULL,
  job_json TEXT NOT NULL,
  error TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (agent_id, manifest_id)
) STRICT;

CREATE TABLE IF NOT EXISTS claw_mcp_server_refs (
  agent_id TEXT NOT NULL,
  name TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  config_digest TEXT NOT NULL,
  relationship TEXT NOT NULL CHECK (relationship IN ('managed', 'referenced')),
  origin TEXT NOT NULL CHECK (origin IN ('claw-introduced', 'pre-existing')),
  independent_owner INTEGER NOT NULL DEFAULT 0 CHECK (independent_owner IN (0, 1)),
  status TEXT NOT NULL,
  error TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (agent_id, name)
) STRICT;

CREATE TABLE IF NOT EXISTS user_profile_identities (
  provider TEXT NOT NULL,
  subject TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  canonical_login TEXT,
  created_at INTEGER NOT NULL,
  authorization_id TEXT,
  authorization_basis_json TEXT,
  PRIMARY KEY (provider, subject)
) STRICT;
CREATE INDEX IF NOT EXISTS idx_user_profile_identities_profile_id
  ON user_profile_identities(profile_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profile_identities_authorization
  ON user_profile_identities(authorization_id);

CREATE TABLE IF NOT EXISTS outbound_media_provenance (
  realpath TEXT NOT NULL PRIMARY KEY,
  kind TEXT NOT NULL,
  version INTEGER NOT NULL,
  sha256 TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  created_at_ms INTEGER NOT NULL
) STRICT;

-- scope_id is non-null because SQLite treats NULLs as distinct in unique indexes/PKs,
-- which would allow duplicate team rows. This PK also avoids a rebuild for identity scope.
CREATE TABLE IF NOT EXISTS secret_store_entries (
  scope_kind TEXT NOT NULL CHECK (scope_kind IN ('team', 'identity')),
  scope_id TEXT NOT NULL,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('secret', 'env')),
  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),
  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),
  updated_by TEXT,
  deleted_at_ms INTEGER,
  allowed_hosts TEXT,
  CHECK ((scope_kind = 'team' AND scope_id = '') OR (scope_kind = 'identity' AND length(scope_id) > 0)),
  PRIMARY KEY (scope_kind, scope_id, name)
) STRICT;
CREATE INDEX IF NOT EXISTS secret_store_entries_live_idx
  ON secret_store_entries (scope_kind, scope_id, name) WHERE deleted_at_ms IS NULL;
`,{...Y,allowedMissingColumns:[...Y.allowedMissingColumns??[],...r.flatMap(e=>e.columns)],allowedMissingIndexes:[...Y.allowedMissingIndexes??[],...a.map(e=>e.name)],excludedIndexes:[...Y.excludedIndexes??[],`idx_acp_sessions_resume_agent`,`idx_acp_sessions_resume_acpx`]}).length>0))return;let o=[];for(let n of r)n.migrate(e,t),o.push(n.applied);for(let t of a)if(P(e,t.tableName)){let n=t.unique?`CREATE UNIQUE INDEX`:`CREATE INDEX`;e.exec(`${n} IF NOT EXISTS ${t.name} ${t.definition};`)}return o}function runStateSchemaMigrationTransaction(e,t,n,r,i){let a=Number(e.prepare(`PRAGMA foreign_keys`).get()?.foreign_keys)===1;a&&e.exec(`PRAGMA foreign_keys = OFF;`);try{return vt(e,()=>{i?.();let r=pt(e),a=r<22?En(e):void 0;if(!a)return n();try{if(!P(e,`config_machine_state`))throw Error(`Shared state schema publication requires config_machine_state.`);return n()}catch(e){throw e instanceof Ee?e:new ue([{kind:`state`,path:t,foundVersion:r,supportedVersion:22}],a.updaterVersion,{targetVersion:T,cause:e})}},r)}finally{a&&e.isOpen&&e.exec(`PRAGMA foreign_keys = ON;`)}}function writeCurrentStateSchemaMetadata(e,t){let n=Pe(e),r=Tn(e);e.exec(`PRAGMA user_version = ${r};`),$t(e,{userVersion:r,contentVersion:22}),y(e,n.insertInto(`schema_meta`).values({meta_key:`primary`,role:`global`,schema_version:r,agent_id:null,app_version:T,created_at:t,updated_at:t}).onConflict(e=>e.column(`meta_key`).doUpdateSet({role:`global`,schema_version:r,agent_id:null,app_version:T,updated_at:t}).where(e=>e.or([e(`schema_meta.schema_version`,`!=`,r),e(`schema_meta.app_version`,`is not`,T),e(`schema_meta.role`,`!=`,`global`)]))))}function executeCanonicalStateSchema(e,t){e.exec(getOpenClawStateRuntimeSchema({...t,includeAgentDeletionJournal:t.includeAgentDeletionJournal??P(e,`agent_deletion_journal`)}))}var Er,Dr,Or,kr,Ar,jr,Mr,Nr=e((()=>{Ht(),Fe(),Re(),De(),z(),Gt(),C(),_t(),ft(),We(),tn(),D(),tr(),kn(),M(),or(),sr(),cr(),en(),pr(),Tr(),Dn(),b(),le(),Er=[`gateway_origin_device_tokens`,...E,`worker_session_tool_operations`,`worker_turn_tool_authorities`],Dr=[`agent_database_leases`,`agent_deletion_journal`,`claw_cron_refs`,`claw_installs`,`claw_mcp_server_refs`,`claw_package_refs`,`claw_workspace_files`,`config_machine_state`,`cron_job_scratch`,`meeting_transcript_sessions`,`meeting_transcript_summaries`,`meeting_transcript_utterances`,`outbound_media_provenance`,`worker_environment_credentials`,`worker_transcript_commit_heads`,`worker_transcript_commits`,...Er],Or=[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],kr=new Map(Or.map(e=>[e,(t,n)=>assertOpenClawStateDatabaseVersionForMigration(t,{...n,version:e})])),Ar={version:21,tables:[`meeting_transcript_sessions`,`meeting_transcript_summaries`,`delivery_queue_entries`],columns:[...[`source_account_id`,`source_guild_id`,`source_channel_id`,`source_meeting_url`,`source_thread_ts`,`source_file_id`,`metadata_agent_id`].map(e=>`meeting_transcript_sessions.${e}`),`meeting_transcript_summaries.overview`,`delivery_queue_entries.retention_id_prefix`,`delivery_queue_entries.retention_max_age_ms`,`delivery_queue_entries.retention_max_entries`],migrate:migratePredicateColumnsV21,applied:`Derived meeting transcript selectors and bounded delivery retention columns (v21)`},jr={version:22,tables:[`acp_sessions`,...q],columns:[`acp_sessions.resume_agent_session_id`,`acp_sessions.resume_acpx_session_id`,...q.map(e=>`${e}.cursor_id`)],migrate:migratePortableIdentityColumnsV22,applied:`Promoted portable ACP resume keys and cursor identities (v22)`},Mr=[jr,{migrate:migrateJsonCanonicalWideRowsV13,applied:`Consolidated shared state tables (v13)`},{migrate:migrateCronCreatorNamespaces,applied:`Qualified historical cron creator attribution as unknown (v14)`},{migrate:migrateConversationBindingTargets,applied:`Removed redundant conversation binding target projections (v15)`},{migrate:migratePreparedWorkerOwnership,applied:`Recorded prepared worker ownership and one-use lifecycle (v17)`},{migrate:migrateGitHubPublicationRequesterAuthority,applied:`Added original requester authority to GitHub publication receipts (v18)`},{migrate:migrateCronDeliveryAttemptState,applied:`Recorded cron completion delivery attempt uncertainty (v20)`}]}));function tableColumnInfo(e,t){return e.prepare(`PRAGMA table_info(${t})`).all()}function tableHasExactColumns(e,t,n){let r=tableColumnInfo(e,t).map(e=>e.name);return r.length===n.length&&r.every((e,t)=>e===n[t])}function tableHasRequiredColumns(e,t,n){let r=new Map(tableColumnInfo(e,t).map(e=>[e.name,e]));return n.every(e=>Number(r.get(e)?.notnull??0)===1)}function tableSql(e,t){let n=e.prepare(`SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?`).get(t);return typeof n?.sql==`string`?n.sql:void 0}function tableHasUniqueColumn(e,t,n){return e.prepare(`PRAGMA index_list(${t})`).all().some(t=>{if(Number(t.unique??0)!==1||typeof t.name!=`string`)return!1;let r=t.name.replaceAll(`'`,`''`),i=e.prepare(`PRAGMA index_info('${r}')`).all();return i.length===1&&i[0]?.name===n})}function hasCanonicalAuditEventTable(e,t,n){let r=tableSql(e,`audit_events`)?.toLowerCase();return tableHasExactColumns(e,`audit_events`,t)&&Vt(e,`audit_events`).join(`,`)===`sequence`&&tableHasRequiredColumns(e,`audit_events`,n)&&typeof r==`string`&&/\bsequence\s+integer\s+primary\s+key\s+autoincrement\b/.test(r)&&tableHasUniqueColumn(e,`audit_events`,`event_id`)&&tableHasUniqueColumn(e,`audit_events`,`source_id`)}function hasCanonicalAuditIdentityKeyTable(e){if(!P(e,`audit_identity_keys`))return!1;let t=tableSql(e,`audit_identity_keys`)?.toLowerCase();return tableHasExactColumns(e,`audit_identity_keys`,[`id`,`key_id`,`key`,`created_at`])&&Vt(e,`audit_identity_keys`).join(`,`)===`id`&&tableHasRequiredColumns(e,`audit_identity_keys`,[`id`,`key_id`,`key`,`created_at`])&&typeof t==`string`&&/\bcheck\s*\(\s*id\s*=\s*1\s*\)/.test(t)}function hasCanonicalAuditEventsSchema(e){let t=Ze(e);return t&&Fr.every(({name:e,sql:n})=>Ve(t.tableSql.get(e)??null)===n)?!0:P(e,`audit_events`)?hasCanonicalAuditEventTable(e,Lr,[`event_id`,`source_id`,`schema_version`,`source_sequence`,`occurred_at`,`kind`,`action`,`status`,`actor_type`,`actor_id`])&&hasCanonicalAuditIdentityKeyTable(e):pt(e)<Pr&&!P(e,`audit_identity_keys`)}function canRepairLegacyAuditEventsSchema(e){return!P(e,`audit_events`)||P(e,`audit_events_migration_new`)||F(e,`audit_events`,`schema_version`)?!1:(!P(e,`audit_identity_keys`)||hasCanonicalAuditIdentityKeyTable(e))&&hasCanonicalAuditEventTable(e,Ir,[`event_id`,`source_id`,`source_sequence`,`occurred_at`,`kind`,`action`,`status`,`actor_type`,`actor_id`,`agent_id`,`run_id`])}function readAuditEventSequenceHighWater(e){if(!P(e,`sqlite_sequence`))return;let t=e.prepare(`SELECT CAST(seq AS TEXT) AS seq FROM sqlite_sequence WHERE name = 'audit_events'`).get();if(t===void 0)return;if(typeof t.seq!=`string`||!/^\d+$/.test(t.seq))throw Error(`audit event sequence high-water mark is invalid`);let n=BigInt(t.seq);if(n>BigInt(2**53-1))throw Error(`audit event sequence high-water mark exceeds the supported integer range`);return Number(n)}function restoreAuditEventSequenceHighWater(e,t){t!==void 0&&(e.prepare(`DELETE FROM sqlite_sequence WHERE name = 'audit_events'`).run(),e.prepare(`INSERT INTO sqlite_sequence (name, seq) VALUES ('audit_events', ?)`).run(t))}function repairAuditEventsSchema(e){if(hasCanonicalAuditEventsSchema(e)||!canRepairLegacyAuditEventsSchema(e))return!1;let t=readAuditEventSequenceHighWater(e);return e.exec(`
    CREATE TABLE audit_events_migration_new (
      sequence INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL UNIQUE,
      source_id TEXT NOT NULL UNIQUE,
      schema_version INTEGER NOT NULL DEFAULT 1,
      source_sequence INTEGER NOT NULL,
      occurred_at INTEGER NOT NULL,
      kind TEXT NOT NULL,
      action TEXT NOT NULL,
      status TEXT NOT NULL,
      error_code TEXT,
      actor_type TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      agent_id TEXT,
      session_key TEXT,
      session_id TEXT,
      run_id TEXT,
      tool_call_id TEXT,
      tool_name TEXT,
      direction TEXT,
      channel TEXT,
      conversation_kind TEXT,
      message_outcome TEXT,
      reason_code TEXT,
      delivery_kind TEXT,
      failure_stage TEXT,
      duration_ms INTEGER,
      result_count INTEGER,
      account_ref TEXT,
      conversation_ref TEXT,
      message_ref TEXT,
      target_ref TEXT
    );
    INSERT INTO audit_events_migration_new (${X.join(`, `)})
    SELECT ${X.map(e=>e===`schema_version`?`1`:e).join(`, `)}
    FROM audit_events;
    DROP TABLE audit_events;
    ALTER TABLE audit_events_migration_new RENAME TO audit_events;
    CREATE INDEX idx_audit_events_time
      ON audit_events(occurred_at DESC, sequence DESC);
    CREATE INDEX idx_audit_events_agent_sequence
      ON audit_events(agent_id, sequence DESC);
    CREATE INDEX idx_audit_events_session_sequence
      ON audit_events(session_key, sequence DESC);
    CREATE INDEX idx_audit_events_run_sequence
      ON audit_events(run_id, sequence DESC);
    CREATE INDEX idx_audit_events_kind_sequence
      ON audit_events(kind, sequence DESC);
    CREATE INDEX idx_audit_events_status_sequence
      ON audit_events(status, sequence DESC);
    CREATE INDEX idx_audit_events_channel_sequence
      ON audit_events(channel, sequence DESC);
    CREATE INDEX idx_audit_events_direction_sequence
      ON audit_events(direction, sequence DESC);
    CREATE TABLE IF NOT EXISTS audit_identity_keys (
      id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
      key_id TEXT NOT NULL,
      key BLOB NOT NULL,
      created_at INTEGER NOT NULL
    );
  `),restoreAuditEventSequenceHighWater(e,t),!0}var Pr,Fr,Ir,X,Lr,Rr=e((()=>{Je(),C(),ft(),M(),b(),Pr=2,Fr=[`audit_events`,`audit_identity_keys`].map(e=>({name:e,sql:Ve(S(w,e))})),Ir=[`sequence`,`event_id`,`source_id`,`source_sequence`,`occurred_at`,`kind`,`action`,`status`,`error_code`,`actor_type`,`actor_id`,`agent_id`,`session_key`,`session_id`,`run_id`,`tool_call_id`,`tool_name`],X=Ir.flatMap(e=>e===`source_id`?[e,`schema_version`]:[e]),Lr=[...X,`direction`,`channel`,`conversation_kind`,`message_outcome`,`reason_code`,`delivery_kind`,`failure_stage`,`duration_ms`,`result_count`,`account_ref`,`conversation_ref`,`message_ref`,`target_ref`]}));function createStateConfigMachineTable(e){e.exec(`
    CREATE TABLE IF NOT EXISTS config_machine_state (
      state_key TEXT NOT NULL PRIMARY KEY,
      value_json TEXT NOT NULL,
      updated_at_ms INTEGER NOT NULL
    ) STRICT;
  `)}function migrateSingletonStateFoldInV12(e,t){if(t>=12)return!1;createStateConfigMachineTable(e);let n=e.prepare(`INSERT INTO config_machine_state (state_key, value_json, updated_at_ms) VALUES (?, ?, ?) ON CONFLICT(state_key) DO NOTHING`);if(P(e,`update_check_state`)){let t=e.prepare(`SELECT * FROM update_check_state WHERE state_key = 'default'`).get();t&&n.run(`update.checkState`,JSON.stringify({lastCheckedAt:t.last_checked_at??void 0,lastNotifiedVersion:t.last_notified_version??void 0,lastNotifiedTag:t.last_notified_tag??void 0,lastAvailableVersion:t.last_available_version??void 0,lastAvailableTag:t.last_available_tag??void 0,autoInstallId:t.auto_install_id??void 0,autoFirstSeenVersion:t.auto_first_seen_version??void 0,autoFirstSeenTag:t.auto_first_seen_tag??void 0,autoFirstSeenAt:t.auto_first_seen_at??void 0,autoLastAttemptVersion:t.auto_last_attempt_version??void 0,autoLastAttemptAt:t.auto_last_attempt_at??void 0,autoLastSuccessVersion:t.auto_last_success_version??void 0,autoLastSuccessAt:t.auto_last_success_at??void 0}),Number(t.updated_at_ms))}if(P(e,`voicewake_triggers`)){let t=e.prepare(`SELECT trigger, updated_at_ms FROM voicewake_triggers WHERE config_key = 'default' ORDER BY position`).all();t.length>0&&n.run(`voicewake.triggers`,JSON.stringify(t.map(e=>e.trigger)),Math.max(...t.map(e=>Number(e.updated_at_ms))))}if(P(e,`voicewake_routing_config`)){let t=e.prepare(`SELECT * FROM voicewake_routing_config WHERE config_key = 'default'`).get();if(t){let r=P(e,`voicewake_routing_routes`)?e.prepare(`SELECT trigger, target_mode, target_agent_id, target_session_key FROM voicewake_routing_routes WHERE config_key = 'default' ORDER BY position`).all():[],targetFromColumns=(e,t,n)=>e===`agent`&&typeof t==`string`&&t?{agentId:t}:e===`session`&&typeof n==`string`&&n?{sessionKey:n}:{mode:`current`};n.run(`voicewake.routing`,JSON.stringify({version:1,defaultTarget:targetFromColumns(t.default_target_mode,t.default_target_agent_id,t.default_target_session_key),routes:r.map(e=>({trigger:e.trigger,target:targetFromColumns(e.target_mode,e.target_agent_id,e.target_session_key)})),updatedAtMs:t.updated_at_ms}),Number(t.updated_at_ms))}}if(P(e,`onboarding_recommendations`)){let t=e.prepare(`SELECT * FROM onboarding_recommendations`).all();for(let e of t)n.run(`onboarding.recommendations.${String(e.config_key)}`,JSON.stringify({inventoryHash:e.inventory_hash,matches:JSON.parse(String(e.matches_json)),offeredAt:e.offered_at_ms,acceptedAt:e.accepted_at_ms,updatedAt:e.updated_at_ms}),Number(e.updated_at_ms))}if(P(e,`sidebar_sections`)){let t=e.prepare(`SELECT section_id FROM sidebar_sections ORDER BY position, section_id`).all();t.length>0&&n.run(`sidebar.sectionOrder`,JSON.stringify(t.map(e=>e.section_id)),Date.now())}if(P(e,`node_host_config`)){let t=e.prepare(`SELECT * FROM node_host_config WHERE config_key = 'current'`).get();if(t){let e={host:t.gateway_host??void 0,port:t.gateway_port??void 0,tls:t.gateway_tls==null?void 0:t.gateway_tls===1,tlsFingerprint:t.gateway_tls_fingerprint??void 0,contextPath:t.gateway_context_path??void 0,cloudflareAccess:t.gateway_cloudflare_access_json==null?void 0:JSON.parse(String(t.gateway_cloudflare_access_json))};n.run(`nodeHost.config`,JSON.stringify({version:t.version,nodeId:t.node_id,...t.display_name==null?{}:{displayName:t.display_name},gateway:Object.values(e).some(e=>e!==void 0)?e:void 0,installedAppsSharing:t.installed_apps_sharing===1}),Number(t.updated_at_ms))}}if(P(e,`web_push_vapid_keys`)){let t=e.prepare(`SELECT * FROM web_push_vapid_keys WHERE key_id = 'default'`).get();t&&n.run(`webPush.vapidKeys`,JSON.stringify({publicKey:t.public_key,privateKey:t.private_key,subject:t.subject}),Number(t.updated_at_ms))}let r=!1;for(let t of Z)P(e,t)&&(e.exec(`DROP TABLE IF EXISTS ${t};`),r=!0);return r}var Z,zr=e((()=>{M(),Z=[`skill_curator_state`,`update_check_state`,`clawhub_promotions_feed_state`,`model_catalog_remote`,`voicewake_triggers`,`voicewake_routing_routes`,`voicewake_routing_config`,`onboarding_recommendations`,`cron_store_epochs`,`tui_last_sessions`,`sidebar_sections`,`node_host_config`,`web_push_vapid_keys`]})),Q,Br,Vr=e((()=>{Q=`explicit`,Br=`ambient-group`}));function getSessionWatchCursorKysely(e){return Pe(e)}function hasLegacyAmbientWatchSentinels(e){return v(e,getSessionWatchCursorKysely(e).selectFrom(`session_watch_cursors`).select(`watcher_session_key`).where(`watcher_session_key`,`>=`,Ur).where(`watcher_session_key`,`<`,Wr).limit(1))!==void 0}function needsSessionWatchCursorProvenanceMigration(e,t){return P(e,`session_watch_cursors`)?t<Hr||!F(e,`session_watch_cursors`,`provenance`)||hasLegacyAmbientWatchSentinels(e):!1}function decodeLegacyAmbientWatchMarkerKey(e){let t=e.slice(20);if(t&&t.length%2==0&&/^[0-9a-f]+$/.test(t))try{return new TextDecoder(`utf-8`,{fatal:!0,ignoreBOM:!0}).decode(Buffer.from(t,`hex`))}catch{return}}function migrateSessionWatchCursorProvenance(e){if(!P(e,`session_watch_cursors`))return{addedColumn:!1,migratedAmbientWatches:0,removedLegacySentinels:0};let t=N(e,`session_watch_cursors`,Gr),n=getSessionWatchCursorKysely(e),r=y(e,n.selectFrom(`session_watch_cursors`).select([`watcher_session_key`,`target_session_key`,`updated_at`]).where(`watcher_session_key`,`>=`,Ur).where(`watcher_session_key`,`<`,Wr)).rows,i=0;for(let t of r){let r=decodeLegacyAmbientWatchMarkerKey(t.watcher_session_key);if(r){let a=v(e,n.selectFrom(`session_watch_cursors`).select(`updated_at`).where(`watcher_session_key`,`=`,r).where(`target_session_key`,`=`,t.target_session_key));if(a){let o=y(e,n.updateTable(`session_watch_cursors`).set({provenance:Br,updated_at:Math.max(a.updated_at,t.updated_at)}).where(`watcher_session_key`,`=`,r).where(`target_session_key`,`=`,t.target_session_key));i+=Number(o.numAffectedRows??0n)}}y(e,n.deleteFrom(`session_watch_cursors`).where(`watcher_session_key`,`=`,t.watcher_session_key).where(`target_session_key`,`=`,t.target_session_key))}return{addedColumn:t,migratedAmbientWatches:i,removedLegacySentinels:r.length}}var Hr,Ur,Wr,Gr,Kr=e((()=>{Fe(),M(),Vr(),Hr=4,Ur=`ambient-group-watch:`,Wr=`ambient-group-watch;`,Gr=`provenance TEXT NOT NULL DEFAULT '${Q}' CHECK (provenance IN ('${Q}', '${Br}'))`}));function deriveRetiredCommitmentsContract(){let e=new Map(ln(Zr).map(({fingerprint:e,name:t})=>[t,JSON.stringify(e)]));return{indexFingerprints:e,compatibility:{allowedColumnDefinitions:{"commitments.attempts":[`attempts INTEGER NOT NULL DEFAULT 0`],"commitments.confidence":[`confidence REAL NOT NULL DEFAULT 0`],"commitments.created_at_ms":[`created_at_ms INTEGER NOT NULL DEFAULT 0`],"commitments.dedupe_key":[`dedupe_key TEXT NOT NULL DEFAULT ''`],"commitments.due_timezone":[`due_timezone TEXT NOT NULL DEFAULT 'UTC'`],"commitments.kind":[`kind TEXT NOT NULL DEFAULT 'followup'`],"commitments.reason":[`reason TEXT NOT NULL DEFAULT ''`],"commitments.sensitivity":[`sensitivity TEXT NOT NULL DEFAULT 'normal'`],"commitments.source":[`source TEXT NOT NULL DEFAULT 'unknown'`],"commitments.suggested_text":[`suggested_text TEXT NOT NULL DEFAULT ''`]},allowedMissingColumns:$r,allowedMissingIndexes:[...e.keys()]}}}function hasSupportedRetiredCommitmentsSchema(e,t,{compatibility:n,indexFingerprints:r}){return fn(e,t,n).length>0?!1:e.prepare(`SELECT type, name
           FROM sqlite_schema
          WHERE type IN ('index', 'trigger')
            AND tbl_name = 'commitments'
            AND sql IS NOT NULL
          ORDER BY type, name`).all().every(t=>t.type===`index`&&JSON.stringify(cn(e,t.name))===r.get(t.name))}function assertRecognizedRetiredCommitmentsSchema(e){if(!hasRecognizedRetiredCommitmentsSchema(e))throw dn(e,`retired OpenClaw commitments schema`,Zr,deriveRetiredCommitmentsContract().compatibility),Error(`Retired OpenClaw commitments schema has unsupported additional indexes; refusing destructive migration.`)}function hasRecognizedRetiredCommitmentsSchema(e){let t=deriveRetiredCommitmentsContract();return hasSupportedRetiredCommitmentsSchema(e,Zr,t)||hasSupportedRetiredCommitmentsSchema(e,Qr,t)}function assertNoRetiredCommitmentsForeignKeys(e){let t=e.prepare(`SELECT name
         FROM sqlite_schema
        WHERE type = 'table' AND name <> 'commitments'
        ORDER BY name`).all();for(let n of t)if(e.prepare(`PRAGMA foreign_key_list(${x(n.name)})`).all().some(e=>typeof e.table==`string`&&e.table.toLowerCase()===`commitments`))throw Error(`Retired OpenClaw commitments schema is referenced by table ${n.name}; refusing destructive migration.`)}function collectRetainedSchemaSql(e){return new Map(e.prepare(`SELECT type, name, sql
             FROM sqlite_schema
            WHERE type IN ('trigger', 'view')
              AND tbl_name <> 'commitments'
              AND sql IS NOT NULL
            ORDER BY type, name`).all().map(e=>[`${e.type}:${e.name}`,e.sql]))}function assertNoRetiredCommitmentsSchemaDependencies(e){let t=`__openclaw_retired_commitments_probe`;if(P(e,t))throw Error(`OpenClaw state database already contains ${t}; refusing destructive migration.`);let n=collectRetainedSchemaSql(e),r=`openclaw_probe_commitments_dependencies`;e.exec(`SAVEPOINT ${r};`);let i;try{e.exec(`ALTER TABLE commitments RENAME TO ${x(t)};`);let r=collectRetainedSchemaSql(e);i=[...n].find(([e,t])=>r.get(e)!==t)?.[0]}catch(t){throw e.exec(`ROLLBACK TO ${r}; RELEASE ${r};`),Error(`Could not prove retained SQLite views and triggers independent of commitments; refusing destructive migration.`,{cause:t})}if(e.exec(`ROLLBACK TO ${r}; RELEASE ${r};`),i){let[e,t]=i.split(`:`,2);throw Error(`Retired OpenClaw commitments schema is referenced by ${e} ${t}; refusing destructive migration.`)}}function assertVirtualTablesUsable(e,t){let n=e.prepare(`SELECT name
         FROM sqlite_schema
        WHERE type = 'table' AND lower(sql) LIKE 'create virtual table%'
        ORDER BY name`).all();for(let r of n)try{e.prepare(`SELECT * FROM ${x(r.name)} LIMIT 1`).all()}catch(e){throw Error(`SQLite virtual table ${r.name} is unusable ${t} commitments retirement.`,{cause:e})}}function migrateRetiredCommitmentsSchema(e,t){if(t>=7||!P(e,`commitments`))return!1;assertRecognizedRetiredCommitmentsSchema(e),assertNoRetiredCommitmentsForeignKeys(e),assertNoRetiredCommitmentsSchemaDependencies(e),assertVirtualTablesUsable(e,`before`);let n=`openclaw_retire_commitments_v7`;e.exec(`SAVEPOINT ${n};`);try{return e.exec(`DROP TABLE commitments;`),assertVirtualTablesUsable(e,`after`),e.exec(`RELEASE ${n};`),!0}catch(t){throw e.exec(`ROLLBACK TO ${n}; RELEASE ${n};`),t}}function migrateRetiredDeadStateTablesV10(e,t){if(t>=10)return!1;let n=!1;for(let t of Jr)P(e,t)&&(e.exec(`DROP TABLE IF EXISTS ${t};`),n=!0);return n}function migrateRetiredSkillCuratorTablesV11(e,t){if(t>=11)return!1;let n=$.filter(t=>P(e,t));if(n.length===0)return!1;if(n.includes(`skill_lifecycle`)){let t=Number(e.prepare(`SELECT COUNT(*) AS archived_count FROM skill_lifecycle WHERE state = 'archived'`).get()?.archived_count);t>0&&qr.info(`${t} previously archived workshop skills are live again; archive any you no longer want`)}for(let t of n)e.exec(`DROP TABLE IF EXISTS ${t};`);return!0}function dropRetiredSkillWorkshopProposalTables(e){let t=ei.filter(t=>P(e,t));if(t.length===0)return!1;let n=e.prepare(`SELECT type, name FROM sqlite_schema
        WHERE type IN ('index', 'trigger') AND sql IS NOT NULL
          AND tbl_name IN (${t.map(()=>`?`).join(`, `)})`).all(...t);for(let{type:t,name:r}of n)(t===`index`||t===`trigger`)&&typeof r==`string`&&e.exec(`DROP ${t.toUpperCase()} IF EXISTS ${x(r)};`);for(let n of t)e.exec(`DROP TABLE ${n};`);return!0}function runRetiredStateTableMigrations(e,t){let n=[];return migrateRetiredCommitmentsSchema(e,t)&&n.push(`Discarded retired shared-state commitments rows, table, and indexes`),migrateRetiredDeadStateTablesV10(e,t)&&n.push(`Retired six dead shared-state tables (v10)`),migrateRetiredSkillCuratorTablesV11(e,t)&&n.push(`Retired legacy skill curator lifecycle and proposal origin-run tables`),n}var qr,logRetiredStateTableMigration,Jr,Yr,Xr,Zr,Qr,$r,$,ei,ti=e((()=>{z(),C(),de(),M(),qr=fe(`state/db`),logRetiredStateTableMigration=e=>qr.info(e),Jr=[`agent_model_catalogs`,`android_notification_recent_packages`,`command_log_entries`,`diagnostic_stability_bundles`,`media_blobs`,`model_capability_cache`],Yr=`
  id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT,
  recipient_id TEXT,
  thread_id TEXT,
  sender_id TEXT,
  kind TEXT NOT NULL,
  sensitivity TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  reason TEXT NOT NULL,
  suggested_text TEXT NOT NULL,
  dedupe_key TEXT NOT NULL,
  confidence REAL NOT NULL,
  due_earliest_ms INTEGER NOT NULL,
  due_latest_ms INTEGER NOT NULL,
  due_timezone TEXT NOT NULL,
  source_message_id TEXT,
  source_run_id TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  last_attempt_at_ms INTEGER,
  sent_at_ms INTEGER,
  dismissed_at_ms INTEGER,
  snoozed_until_ms INTEGER,
  expired_at_ms INTEGER,
  record_json TEXT NOT NULL
`,Xr=`CREATE INDEX idx_commitments_scope_due
  ON commitments(agent_id, session_key, status, due_earliest_ms, due_latest_ms);
CREATE INDEX idx_commitments_status_due
  ON commitments(status, due_earliest_ms, due_latest_ms);
CREATE INDEX idx_commitments_scope_dedupe
  ON commitments(agent_id, session_key, channel, dedupe_key, status);`,Zr=`
CREATE TABLE commitments (${Yr.slice(1,-1)}
) STRICT;
${Xr}
CREATE INDEX idx_commitments_agent_due
  ON commitments(agent_id, status, due_earliest_ms, due_latest_ms, session_key);
CREATE INDEX idx_commitments_agent_sent
  ON commitments(agent_id, status, sent_at_ms, session_key);
`,Qr=`
CREATE TABLE commitments (${Yr.slice(1,-1)}
);
${Xr}
`,$r=[`commitments.account_id`,`commitments.recipient_id`,`commitments.thread_id`,`commitments.sender_id`,`commitments.kind`,`commitments.sensitivity`,`commitments.source`,`commitments.reason`,`commitments.suggested_text`,`commitments.dedupe_key`,`commitments.confidence`,`commitments.due_timezone`,`commitments.source_message_id`,`commitments.source_run_id`,`commitments.created_at_ms`,`commitments.attempts`,`commitments.last_attempt_at_ms`,`commitments.sent_at_ms`,`commitments.dismissed_at_ms`,`commitments.snoozed_until_ms`,`commitments.expired_at_ms`],$=[`skill_lifecycle`,`skill_workshop_proposal_origin_runs`],ei=[`skill_workshop_proposal_events`,`skill_workshop_proposal_rollbacks`,`skill_workshop_collection_reviews`,`skill_workshop_proposals`]}));function dropLegacyStateTables(e){let t=[`database`,`verifications`].join(`_`);e.exec(`DROP TABLE IF EXISTS ${t};`),e.exec(`DROP TABLE IF EXISTS node_pairing_pending; DROP TABLE IF EXISTS node_pairing_paired;`)}function migrateWorkerPlacementExecutionModeSchema(e,t){if(t>=8||!P(e,`worker_session_placements`))return!1;for(let t of[`execution_mode TEXT`,`terminal_reason TEXT`,`terminal_at_ms INTEGER`])N(e,`worker_session_placements`,t);let n=S(w,`worker_session_placements`,{errorMessage:`Canonical worker placement schema block is missing`}),r=Qe(`:memory:`),i;try{r.exec(n),i=r.prepare(`PRAGMA table_xinfo(worker_session_placements)`).all().filter(e=>e.hidden===0).map(e=>e.name)}finally{r.close()}let a=e.prepare(`PRAGMA table_xinfo(worker_session_placements)`).all().filter(e=>e.hidden===0).map(e=>e.name),o=new Set(i);if(a.length!==i.length||a.some(e=>!o.has(e)))throw Error(`OpenClaw v7 worker placement columns are not canonical`);if(e.prepare(`SELECT type, name
         FROM sqlite_schema
        WHERE tbl_name = 'worker_session_placements'
          AND type IN ('index', 'trigger')
          AND sql IS NOT NULL
          AND name NOT IN (
            'idx_worker_session_placements_session_key',
            'idx_worker_session_placements_reconcile',
            'idx_worker_session_placements_environment'
          )`).all().length>0)throw Error(`OpenClaw v7 worker placement schema has unsupported attached objects`);let s=`worker_session_placements_migration_v8`;if(P(e,s))throw Error(`OpenClaw worker placement migration table already exists: ${s}`);let c=n.replace(`CREATE TABLE IF NOT EXISTS worker_session_placements`,`CREATE TABLE ${s}`),l=i.map(x).join(`, `);return e.exec(c),e.exec(`INSERT INTO ${s} (${l}) SELECT ${l} FROM worker_session_placements;`),e.exec(`DROP TABLE worker_session_placements;`),e.exec(`ALTER TABLE ${s} RENAME TO worker_session_placements;`),!0}function isDefaultAgentDatabasePath(e,t){let n=B.dirname(e),r=B.dirname(n);return B.basename(e)===`openclaw-agent.sqlite`&&B.basename(n)===`agent`&&B.basename(r)===t&&B.basename(B.dirname(r))===`agents`}function migrateAgentDatabaseRelativePaths(e,t,n){if(t>=9||!P(e,`agent_databases`))return{relativized:0,reanchored:[],deleted:[],preserved:0};let r=e.prepare(`SELECT agent_id, path FROM agent_databases`).all(),i=e.prepare(`UPDATE agent_databases SET path = ? WHERE agent_id = ? AND path = ?`),a=e.prepare(`DELETE FROM agent_databases WHERE agent_id = ? AND path = ?`),o=e.prepare(`SELECT 1 FROM agent_databases WHERE agent_id = ? AND path = ? LIMIT 1`),s=e.prepare(`
    UPDATE agent_databases AS canonical
       SET schema_version = source.schema_version,
           last_seen_at = source.last_seen_at,
           size_bytes = source.size_bytes
      FROM agent_databases AS source
     WHERE canonical.agent_id = ? AND canonical.path = ?
       AND source.agent_id = canonical.agent_id AND source.path = ?
       AND source.last_seen_at > canonical.last_seen_at
  `),c=0,l=[],u=[];for(let e of r){let t=e.agent_id,r=e.path;if(typeof t!=`string`||typeof r!=`string`)throw Error(`OpenClaw v8 agent database registry paths are not canonical`);if(!B.isAbsolute(r))continue;let l=Ce(n,r);B.isAbsolute(l)||(o.get(t,l)?(s.run(t,l,r),a.run(t,r),u.push(r)):(i.run(l,t,r),c+=1))}let d=Te(n);for(let e of r){let t=e.agent_id,r=e.path;if(typeof t==`string`&&typeof r==`string`&&B.isAbsolute(r)&&B.isAbsolute(Ce(n,r))&&isDefaultAgentDatabasePath(B.resolve(r),t)){let e=B.join(d,`agents`,t,`agent`,`openclaw-agent.sqlite`),s=Ce(n,e);o.get(t,s)?(a.run(t,r),u.push(r)):jn(e)&&(i.run(s,t,r),l.push(r))}}return{relativized:c,reanchored:l,deleted:u,preserved:r.length-c-l.length-u.length}}function assertCanonicalAgentDatabasesPrimaryKey(e,t){if(!P(e,`agent_databases`))return;let n=Vt(e,`agent_databases`);if(n.length!==2||n[0]!==`agent_id`||n[1]!==`path`)throw new I(`OpenClaw state database ${t} has an unsupported agent database registry schema. Upgrades from pre-July-2026 state are no longer migrated; restore a backup produced by a July 2026 or newer release before retrying.`)}function repairLegacyGatewayRestartHandoffsForStrictMigration(e){P(e,`gateway_restart_handoff`)&&(e.prepare(`DELETE FROM gateway_restart_handoff WHERE expires_at <= ?`).run(Date.now()),e.exec(`
    UPDATE gateway_restart_handoff
    SET
      restart_trace_started_at = CASE
        WHEN typeof(restart_trace_started_at) = 'real'
          THEN CAST(restart_trace_started_at AS INTEGER)
        ELSE restart_trace_started_at
      END,
      restart_trace_last_at = CASE
        WHEN typeof(restart_trace_last_at) = 'real'
          THEN CAST(restart_trace_last_at AS INTEGER)
        ELSE restart_trace_last_at
      END
    WHERE typeof(restart_trace_started_at) = 'real'
       OR typeof(restart_trace_last_at) = 'real';
  `))}function assertCanonicalStateSchemaShape(e,t){if(Sn(e,t),assertCanonicalAgentDatabasesPrimaryKey(e,t),!hasCanonicalAuditEventsSchema(e))throw canRepairLegacyAuditEventsSchema(e)?new Yt(`audit-events-v2`,t):new I(`OpenClaw state database ${t} has a noncanonical audit event schema that cannot be repaired automatically; restore the canonical audit_events shape before retrying.`)}function detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(e,t){assertCanonicalAgentDatabasesPrimaryKey(e,t);let n=[],r=L(e);return r<7&&P(e,`commitments`)&&hasRecognizedRetiredCommitmentsSchema(e)&&n.push({kind:`commitments-retirement-v7`,path:t}),r===7&&P(e,`worker_session_placements`)&&n.push({kind:`worker-placement-execution-mode-v8`,path:t}),r===8&&P(e,`agent_databases`)&&n.push({kind:`agent-databases-relative-paths-v9`,path:t}),r<10&&Jr.some(t=>P(e,t))&&n.push({kind:`state-table-retirement-v10`,path:t}),r<11&&$.some(t=>P(e,t))&&n.push({kind:`state-table-retirement-v11`,path:t}),r<12&&Z.some(t=>P(e,t))&&n.push({kind:`singleton-state-foldin-v12`,path:t}),r<13&&(F(e,`cron_jobs`,`schedule_kind`)||F(e,`subagent_runs`,`task`)||P(e,`workspace_attestations`)||P(e,`installed_plugin_index`)||P(e,`auth_profile_stores`))&&n.push({kind:`state-consolidation-v13`,path:t}),r<14&&P(e,`cron_jobs`)&&n.push({kind:`creator-namespace-v14`,path:t}),r<15&&(F(e,`current_conversation_bindings`,`target_agent_id`)||F(e,`current_conversation_bindings`,`target_session_id`))&&n.push({kind:`conversation-binding-targets-v15`,path:t}),r<17&&P(e,`worker_environments`)&&!F(e,`worker_environments`,`preparation_consumed_at_ms`)&&n.push({kind:`prepared-worker-ownership-v17`,path:t}),r<18&&[`github_publication_session_lifecycles`,`github_repository_publication_requests`].some(t=>P(e,t)&&!F(e,t,`requester_authority_json`))&&n.push({kind:`github-publication-requester-authority-v18`,path:t}),r<21&&[`meeting_transcript_sessions`,`meeting_transcript_summaries`,`delivery_queue_entries`].some(t=>P(e,t))&&n.push({kind:`predicate-columns-v21`,path:t}),r<22&&[`acp_sessions`,...q].some(t=>P(e,t))&&n.push({kind:`portable-identity-columns-v22`,path:t}),hasCanonicalAuditEventsSchema(e)||n.push({kind:`audit-events-v2`,path:t}),P(e,`audit_events`)&&r<3&&n.push({kind:`strict-tables-v3`,path:t}),needsSessionWatchCursorProvenanceMigration(e,r)&&n.push({kind:`session-watch-cursor-provenance-v4`,path:t}),n.push(...wn(e,t)),n}var ni,ri=e((()=>{$e(),Gt(),C(),Rr(),D(),xn(),M(),Xt(),zr(),cr(),en(),Kr(),ti(),we(),b(),ni={"agent-databases-composite-primary-key":[`agent_databases`],"audit-events-v2":[`audit_events`,`audit_identity_keys`],"commitments-retirement-v7":[`commitments`],"worker-placement-execution-mode-v8":[`worker_session_placements`],"agent-databases-relative-paths-v9":[`agent_databases`],"state-table-retirement-v10":Jr,"state-table-retirement-v11":$,"singleton-state-foldin-v12":[`config_machine_state`,...Z],"state-consolidation-v13":[`cron_jobs`,`subagent_runs`,`workspace_setup_state`,`workspace_attestations`,`workspace_generated_bootstrap_hashes`,`auth_profile_stores`,`auth_profile_state`,`installed_plugin_index`,`config_machine_state`,`diagnostic_events`],"creator-namespace-v14":[`cron_jobs`],"conversation-binding-targets-v15":[`current_conversation_bindings`],"prepared-worker-ownership-v17":[`worker_environments`],"github-publication-requester-authority-v18":[`github_publication_session_lifecycles`,`github_repository_publication_requests`],"portable-identity-columns-v22":[`acp_sessions`,...q],"predicate-columns-v21":[`meeting_transcript_sessions`,`meeting_transcript_summaries`,`delivery_queue_entries`],"operator-approvals-system-agent":[`operator_approvals`],"session-watch-cursor-provenance-v4":[`session_watch_cursors`],"strict-tables-v3":w.split(`
`).flatMap(e=>{let t=/^CREATE TABLE IF NOT EXISTS (\w+) \(/u.exec(e)?.[1];return t?[t]:[]})}}));function needsOpenClawStateDatabaseSchemaRepair(e,t=`automatic`){let n;try{if(n=Qe(e,{readOnly:!0}),t===`automatic`&&rn(n)?.startupReady)return!1;nn(n,e),R(n,e);let r=L(n)!==22||hasLegacyCronRunLogs(n);return r||(assertCurrentStateRuntimeSchema(n,e),t===`doctor`&&ot(n,e)),r}catch{return!0}finally{n?.close()}}function assertCurrentStateRuntimeSchema(e,t,n=mn(e)){assertCanonicalStateSchemaShape(e,t),assertOpenClawStateDatabaseForMaintenance(e,{pathname:t},n),dn(e,t,w,Y,n)}function assertNoLegacyStateRuntimeRepair(e,t){if(hasLegacyCronRunLogs(e))throw new Yt(`legacy-cron-run-logs`,t)}function isOpenClawStateSchemaFastPathEligible(e,t,n){let r=rn(e);if(r)return r.startupReady;let i,a=Ke(e,()=>gt(e,()=>{let r=R(e,t);if(L(e)!==22)return!1;let a=un(e);if(typeof a!=`number`)throw Error(`Shared-state database ${t} schema version is unavailable.`);return assertCurrentStateRuntimeSchema(e,t,mn(e)),assertNoLegacyStateRuntimeRepair(e,t),i=sn(e,t,{schemaVersion:a,userVersion:r},n),!0},{operationLabel:`state.admission.fast-path`}));return i?.(),a&&an(e,!0),a}var ii=e((()=>{$e(),st(),Ge(),z(),_t(),er(),tn(),D(),on(),Nr(),Xt(),ri(),en(),Tr(),b()}));export{migratePredicateColumnsV21 as $,assertOpenClawStateDatabaseForMaintenance as A,withStateDatabaseSchemaMaintenance as At,writeCurrentStateSchemaMetadata as B,Q as C,Bn as Ct,migrateSingletonStateFoldInV12 as D,resolveCronCompletionStatus as Dt,zr as E,resolveAdmittedCronCompletionStatus as Et,migrateBoundedStateSchema as F,isOpenClawStateFirstUseSchemaIssue as G,Y as H,kr as I,assertOpenClawStateWriteAllowedAtPath as J,isOpenClawStateStartupRepairableSchemaIssue as K,prepareStateDatabaseSchemaRepair as L,executeCanonicalStateSchema as M,Nr as N,Rr as O,V as Ot,markCurrentStateSchemaVersion as P,sr as Q,runStateSchemaMigrationTransaction as R,Br as S,Fn as St,createStateConfigMachineTable as T,Pn as Tt,getOpenClawStateRuntimeSchema as U,wr as V,Tr as W,inspectOpenClawStateOwnershipFromDatabase as X,pr as Y,isOpenClawStateWriteContentionError as Z,logRetiredStateTableMigration as _,normalizeExitCode as _t,needsOpenClawStateDatabaseSchemaRepair as a,compareCronRunRecordsNewestFirst as at,migrateSessionWatchCursorProvenance as b,Rn as bt,assertCanonicalStateSchemaShape as c,cronRunRecordToRunLogEntry as ct,ri as d,isCronDeliveryStatus as dt,createSqliteAuditRecordKernel as et,migrateAgentDatabaseRelativePaths as f,isCronRunStatus as ft,ti as g,normalizeCronRunDiagnosticsCore as gt,dropRetiredSkillWorkshopProposalTables as h,normalizeCronRunDiagnosticSummary as ht,isOpenClawStateSchemaFastPathEligible as i,migrateLegacyCronRunLogsToTaskRuns as it,assertOpenClawStateDatabaseOwner as j,repairAuditEventsSchema as k,Nn as kt,detectOpenClawStateDatabaseSchemaMigrationsFromDatabase as l,cronRunStorageStatus as lt,repairLegacyGatewayRestartHandoffsForStrictMigration as m,Wn as mt,assertNoLegacyStateRuntimeRepair as n,prepareSqliteAuditRecord as nt,ni as o,cronRunLogEntryToDetail as ot,migrateWorkerPlacementExecutionModeSchema as p,formatUnknownError as pt,assertOpenClawStateWriteAllowed as q,ii as r,er as rt,assertCanonicalAgentDatabasesPrimaryKey as s,cronRunRecordStoreKey as st,assertCurrentStateRuntimeSchema as t,ir as tt,dropLegacyStateTables as u,Zn as ut,runRetiredStateTableMigrations as v,tailText as vt,Vr as w,isCronTimeoutErrorText as wt,needsSessionWatchCursorProvenanceMigration as x,Ln as xt,Kr as y,In as yt,Mr as z};