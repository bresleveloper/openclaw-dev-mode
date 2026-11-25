import{E as e,F as t,I as n,M as r,O as i,R as a,S as o,f as s,j as c,k as l,o as u,r as d,w as f,x as p,y as m}from"./code-mode-node.worker-redact-BmW1LBNi.mjs";import*as h from"node:module";import{setImmediate as g}from"node:timers/promises";import{isDeepStrictEqual as _,types as v}from"node:util";import{GCProfiler as y,getHeapSpaceStatistics as b,getHeapStatistics as x,serialize as S,setFlagsFromString as ee}from"node:v8";import{Script as te,createContext as ne}from"node:vm";import{MessageChannel as re,MessagePort as C,Worker as w,getEnvironmentData as ie,isMainThread as T,parentPort as ae,receiveMessageOnPort as oe,setEnvironmentData as se,threadId as E,workerData as ce}from"node:worker_threads";import{channel as le}from"node:diagnostics_channel";import{AsyncLocalStorage as D}from"node:async_hooks";import O from"node:path";import{fileURLToPath as ue}from"node:url";import{randomUUID as de}from"node:crypto";import fe,{fstatSync as pe,readdirSync as me}from"node:fs";import k,{realpath as he,stat as ge}from"node:fs/promises";import"node:os";import"@openclaw/fs-safe/path";import{isPromise as _e}from"node:util/types";import{Session as ve}from"node:inspector/promises";import{Buffer as A}from"node:buffer";import{parse as ye}from"acorn";const be={Scavenge:`scavenge`,MinorMarkSweep:`scavenge`,MarkSweepCompact:`mark_sweep_compact`,IncrementalMarking:`incremental`,ProcessWeakCallbacks:`weak_processing`},j=/* @__PURE__ */ new Set;let M,N,P;function getOldGenerationAfterGcBytes(){return P}function drain(e){let t=M?.stop();e&&M?.start();let n=[];for(let e of t?.statistics??[]){let t=be[e.gcType];if(!t)continue;let r=e.beforeGC.heapStatistics.usedHeapSize,i={kind:t,reason:`other`,durationMs:e.cost/1e3,heapUsedBeforeBytes:r,reclaimedBytes:Math.max(0,r-e.afterGC.heapStatistics.usedHeapSize)};if(t===`mark_sweep_compact`){i.heapUsedAfterMajorGcBytes=e.afterGC.heapStatistics.usedHeapSize,i.heapUsedAfterMajorGcTimestampSeconds=Date.now()/1e3,P=0;for(let t of e.afterGC.heapSpaceStatistics)(t.spaceName===`old_space`||t.spaceName===`large_object_space`)&&(P+=t.spaceUsedSize)}n.push(i)}if(n.length)for(let e of j)e(n)}function flushGcSamples(){M&&drain(!0)}function observeGcSamples(e){if(!process.versions.bun)return M?drain(!0):(M=new y,M.start(),N=setInterval(()=>drain(!0),1e3).unref()),j.add(e),()=>{if(!j.has(e))return;let t=j.size===1;drain(!t),j.delete(e),t&&(clearInterval(N),N=void 0,M=void 0,P=void 0)}}const F=a(Symbol.for(`openclaw.sqliteReaderMetrics`),()=>({counters:/* @__PURE__ */ new Map,listeners:/* @__PURE__ */ new Set,workers:/* @__PURE__ */ new Map,operations:/* @__PURE__ */ new Set,retired:/* @__PURE__ */ new Map}));function observeSqliteReaderCounters(e){F.listeners.add(e);for(let t of F.counters.values())e(t);return()=>F.listeners.delete(e)}function accumulateSqliteReaderCounters(e,t){for(let n of t){let t=n.operation,r=e.get(t);r||(r={operation:t,count:0,readBytes:0},e.set(t,r)),r.count+=Number(Atomics.load(n.values,0)),r.readBytes+=Number(Atomics.load(n.values,1))}}function receive(e,t){let{operation:n,values:r}=t,i=F.operations.has(n)||F.operations.size<256?n:`other`;F.operations.add(i);let a=F.workers.get(e);a||(a=/* @__PURE__ */ new Map,F.workers.set(e,a)),a.set(n,{operation:i,values:r})}function retire(e){let t=F.workers.get(e);t&&(accumulateSqliteReaderCounters(F.retired,t.values()),F.workers.delete(e))}const xe=`${process.execArgv.join(` `)} ${process.env.NODE_OPTIONS??``}`;T&&!process.versions.bun&&/--max[-_](?:old[-_]space[-_]size(?:[-_]percentage)?|heap[-_]size)(?:=|\s)/u.test(xe)&&(/--(?:freeze[-_]flags[-_]after[-_]init|(?:abort|exit)[-_]on[-_]contradictory[-_]flags)(?:=(?:true|1))?(?:\s|$)/u.test(xe)?process.emitWarning(`V8 startup flags prevent enforcing per-worker heap limits.`):ee(`--max-old-space-size=0 --max-heap-size=0`));function createRetainedOperation(e,t={}){let n=Promise.withResolvers(),r=Object.freeze({status:`pending`});return t.observeRejection!==!1&&n.promise.catch(()=>void 0),{operation:{result:n.promise,read:()=>r,service:e},resolve(e){r.status===`pending`&&(r=Object.freeze({status:`fulfilled`,value:e}),n.resolve(e))},reject(e){r.status===`pending`&&(r=Object.freeze({status:`rejected`,error:e}),n.reject(e))}}}function driveRetainedOperation(e,t,n){let r=D.snapshot(),i=!1,serviceInContext=()=>r(service),a=createRetainedOperation(serviceInContext);function service(){if(!(i||a.operation.read().status!==`pending`)){i=!0;try{t(a,serviceInContext)}catch(e){try{a.reject(n?n(e):e)}catch(e){a.reject(e)}}finally{i=!1}}}return e.result.then(serviceInContext,serviceInContext),a.operation.service(),a.operation}function flatMapRetainedOperation(e,t){let n;return driveRetainedOperation(e,(r,i)=>{if(!n){e.service();let r=e.read();if(r.status===`pending`)return;if(r.status===`rejected`)throw r.error;n=t(r.value),n.result.then(i,i)}n.service();let a=n.read();a.status===`fulfilled`?r.resolve(a.value):a.status===`rejected`&&r.reject(a.error)})}const Se=/* @__PURE__ */ `admit,audit.events.list,audit.writer.process,audit.writer.prune,database.domain.bind,database.domain.close,database.domain.publish,database.prepareWrite,database.walMaintenance,localWorkspace.prepare,localWorkspace.pruneLegacy,localWorkspace.beginSweep,localWorkspace.finishSweep,localWorkspace.sweepBatch,localWorkspace.mutate,localWorkspace.manifest,localWorkspace.readBacking,localWorkspace.sweepCandidates,localWorkspace.reviewBase,localWorkspace.byProjectionPath,localWorkspace.exists,localWorkspace.get,stateLease.acquire,stateLease.release,stateLease.renew,stateLease.verify,worktrees.assertPredicates,worktrees.delete,worktrees.slotCount,worktrees.pendingSlots,worktrees.reservePending,worktrees.releasePending,worktrees.insert,worktrees.update,worktrees.claimRemoval,worktrees.finalizeRemoval,worktrees.abortRemoval,worktrees.findLiveByOwner,worktrees.get,worktrees.sessionBinding,worktrees.findLiveByPath,worktrees.list,worktrees.liveIds,worktrees.provisionedPaths,worktrees.provisionedState,worktrees.provisionedChunk,worktrees.writeProvisionedSnapshot,worktrees.retireMissing,worktrees.deferCleanup,worktrees.admitRunLease,worktrees.releaseRunLease,worktrees.reapRunLeases,worktrees.reserveCapacity,worktrees.recoverPending,worktrees.templates.read,worktrees.templates.has,worktrees.templates.list,worktrees.templates.reserve,worktrees.templates.ready,worktrees.templates.delete,worktrees.templates.retainReader,worktrees.templates.releaseReader,worktrees.templates.hasReaders`.split(`,`),Ce=/* @__PURE__ */ `acp.acpSessions.agentDatabaseDeletion.agentDatabaseRegistry.agentDatabases.agentDeletionJournal.agentProvenance.apns.audit.authProfiles.backup.bootstrap.capture.channelIngress.templates.config.conversation.conversationBindings.database.deliveryQueue.deviceAuth.deviceIdentity.devicePairing.diagnostic.doctor.exec-approvals.execApprovals.generatedHtmlProvenance.githubPublication.githubRepository.legacyMcpOAuth.localWorkspace.managedImages.mcpOAuth.mentions.modelCatalog.nativeHookRelay.node.nodeHost.nodeWorker.onboardingRecommendations.operator.operatorApprovals.pairing.placementJournals.placementTools.placementTranscript.placementTurns.pluginBlob.pluginModelCatalogCredentials.plugins.preparedPoolPresence.projects.promotions.repositoryWorkspaces.restartSentinel.sandboxRegistry.secrets.sessionDelivery.sessionGroups.sessionRepositoryWorkspaces.sessionState.sessionUpstream.skillLibrary.skillUploads.skills.stateLease.subagents.telemetry.tts.tui.updateRuns.usageCache.userModelAccounts.userPreferences.userProfiles.webPush.workerEnvironments.workerInference.workerPlacements.workers.workspace.workshop.worktrees`.split(`.`),I=/* @__PURE__ */ new Set([...Se,...Ce]);function classifySqliteWorkerExecute(e){if(I.has(e))return e;let t=e.indexOf(`.`),n=t===-1?e:e.slice(0,t);return I.has(n)?n:`execute`}const we=/* @__PURE__ */ new Set(/* @__PURE__ */ `abortedPartial,acceptIntent,add,append,appendChunk,assistant,batch,boards.applyOps,boards.grant,boards.putWidget,cache.clear,cache.prune,cache.read,cache.retire,cache.stage.start,cache.write,cache.write.inline,cancel,catalog.pruneRemovedProviders,catalog.removeCredentials,catalog.replace,category.apply,category.prepare,claim,complete,connection.inspect,create,delete,deleteChunk,discardIntent,discover,enqueueIntent,finalize,finish,forget.mark,forget.purge,hasPending,index.facts,index.upgradeProviderKey,index.writeMetadata,involvement,list,listPendingSessions,match,owner.assign,participant,preflight,prepare,prepareRun,prune,publishClosedTurn,put,readNextPending,record,recordFailure,remove,reserve,schema.admit,source.chunks,source.delete,source.hash,source.refresh,source.replace,source.replace.group,source.replace.inline,source.state,stage.append,stage.discard,stage.start,suggestion.add,suggestion.claim,suggestion.finalize,suggestion.release,sweep,vector.ensure,vector.prepare,devicePairing.ensureToken,devicePairing.list,devicePairing.lookup,devicePairing.updateMetadata,devicePairing.updatePresence,devicePairing.verifyToken,session.actor.acceptInput,session.actor.adoptRun,session.actor.appendToolResult,session.actor.appendTranscriptEvent,session.actor.completeTurn,session.actor.deliveryPending,session.actor.deliverySettled,session.actor.patch,session.actor.read,session.agentPurge.commit,session.agentPurge.prepare,session.archivePruning.deletePublished,session.archivePruning.pruneRetention,session.archivePruning.reclaimPages,session.archivePruning.removeLegacy,session.archives.preparePublication,session.archives.recordPublication,session.entries.replace,session.entry.acp,session.entry.patch.commit,session.entry.patch.prepare,session.entry.read,session.entry.readResult,session.entry.replacements.commit,session.entry.replacements.prepare,session.goal.mutate,session.lifecycle.delete,session.lifecycle.deletePlan,session.lifecycle.project,session.lifecycle.reset,session.maintenance.finalize,session.maintenance.metadata,session.maintenance.prepare,session.maintenance.size,session.messageCut.commit,session.messageCut.fork,session.messageCut.preflight,session.messageRewrite.commit,session.messageRewrite.modelPrompt,session.messageRewrite.prepare,session.metadata.append,session.metadata.initialize,session.metadata.mutation,session.nativeBindings.delete,session.parentFork.commit,session.parentFork.prepare,session.parentFork.source,session.pendingInputs.mutate,session.pendingInputs.read,session.pendingInputs.withdraw,session.providerReview.compare,session.reaction.set,session.rowTranscript.backfill,session.turn.commit,session.turn.prepare,trajectory.events.append,trajectory.retention.begin,trajectory.retention.delete,transcript.commit,transcript.prepare,usageCache.prune,usageCache.writeQuarters,usageCache.writeRollup`.split(`,`)),Te=/* @__PURE__ */ new Map([[`preflight`,`transcript-projection.preflight`],[`sweep`,`transcript-projection.sweep`],[`claim`,`transcript-projection.claim`],[`deleteChunk`,`transcript-projection.deleteChunk`],[`appendChunk`,`transcript-projection.appendChunk`],[`finalize`,`transcript-projection.finalize`]]),Ee=[`/config/sessions/session-transcript-projection-publication.worker.js`,`/config/sessions/session-transcript-projection-publication.worker.ts`],De=[[`pluginState.`,`plugin_state`],[`session.history.`,`transcript_read`],[`trajectory.`,`transcripts`],[`session.transcript.`,`transcripts`],[`transcripts.`,`transcripts`],[`session.`,`sessions`],[`cron.`,`cron`]];function classifyWorkerRequest(e,n){if(typeof e!=`string`)return`execute`;if(we.has(e))return e;if(e===`auth-profile-rows`)return`auth_profiles`;if(e===`database.domain.execute`||e===`database.domain.publish`){let r=t(n)?n:void 0,i=r&&t(r.command)?r.command:void 0,a=r?.moduleUrl;if(e===`database.domain.publish`&&typeof a==`string`&&typeof i?.type==`string`&&Ee.some(e=>a.endsWith(e))){let e=Te.get(i.type);if(e)return e}let o=i?classifyWorkerRequest(i.type):`execute`;return o===`execute`?`domain_execute`:o}for(let[t,n]of De)if(e.startsWith(t))return n;return classifySqliteWorkerExecute(e)}const Oe=/* @__PURE__ */ new Set([...we,...Te.values(),...I,...De.map(([,e])=>e),`task`,`open`,`close`,`execute`,`domain_execute`,`auth_profiles`]);function normalizeWorkerRequestClass(e){return e!==void 0&&Oe.has(e)?e:`other`}function sampleWorkerAuthorityOperation(e){return T&&normalizeWorkerRequestClass(e).startsWith(`session.actor.`)&&Math.random()<1/128}function recordWorkerAuthorityMessage(e,t,n=sampleWorkerAuthorityOperation(t)){return recordWorkerMessage(e?.kind===`sqlite-database-admissions`?`admission`:`authority`,`from_worker`,typeof e?.payloadBytes==`number`?e.payloadBytes:void 0,t,n?e:void 0),n}function withoutField(e,n){if(!t(e)||!Object.hasOwn(e,n))return e;let r={...e};return delete r[n],r}function recordAuthorityPayload(e,n,r){let i=normalizeWorkerRequestClass(r);if(!i.startsWith(`session.actor.`))return;let a=n.kind===`native-settlement`&&t(n.settlement)?n.settlement.committed:n.committed,o=t(a);if(!o&&!Object.hasOwn(n,`facts`))return;let s=o?[`receipt_entry`,`receipt_events`,`receipt_value`,`receipt_other`]:[`admission_entry`,`admission_other`],c=(e.payloadComponents??={})[i]??={},l,u=o&&typeof n.payloadBytes==`number`?n.payloadBytes:void 0;try{let e=o?a.facts:n.facts;if(u??=S(e).byteLength,o&&t(e)&&t(e.receipt)){let t={...e.receipt,postimage:withoutField(e.receipt.postimage,`entry`)};delete t.entryMetadata;let n={...e,receipt:t},r=Math.min(u,S(n).byteLength),i={...n,receipt:{...n.receipt,transcript:withoutField(withoutField(e.receipt.transcript,`appendedEvents`),`authorityReceipts`)}},a=Math.min(r,S(i).byteLength),o=Math.min(a,S({...i,value:void 0,receipt:{...i.receipt,transcript:withoutField(i.receipt.transcript,`append`)}}).byteLength);l=[u-r,r-a,a-o,o]}else if(!o&&t(e)&&t(e.publication)&&e.publication.kind===`session-actor-admission`){let t=S({...e,publication:{...e.publication,snapshot:withoutField(e.publication.snapshot,`entry`)}}).byteLength;l=[u-t,t]}else l=o?[0,0,0,u]:[0,u];l.some(e=>e<0)&&(l=void 0)}catch{}for(let[e,t]of s.entries()){let n=c[t]??={bytes:0,samples:0,unmeasured:0};l?(n.bytes+=l[e]??0,n.samples++):(n.unmeasured++,t===`receipt_other`&&u!==void 0&&(n.bytes+=u))}}const ke=a(Symbol.for(`openclaw.workerMessageMetrics`),()=>/* @__PURE__ */ new Map);function recordWorkerMessage(e,t,n,r,i){if(!T)return;let a=ke.get(e);a||(a={},ke.set(e,a));let o=a[t]??={kind:e,direction:t,messages:0,payloadBytes:0,unmeasuredMessages:0};if(o.messages++,n===void 0)o.unmeasuredMessages++;else if(o.payloadBytes+=n,e===`sqlite_request`||e===`sqlite_reply`||e===`authority`){let e=o.payloadBytesByRequestClass??={},t=normalizeWorkerRequestClass(r);e[t]=(e[t]??0)+n}i&&e===`authority`&&t===`from_worker`&&recordAuthorityPayload(o,i,r)}function messageData(e){return t(e)&&!v.isProxy(e)?e:void 0}function dataProperty(e,t){return Object.getOwnPropertyDescriptor(e,t)?.value}function messageBody(e){let t=messageData(e),n=t&&dataProperty(t,`type`);return t&&(n===`post`||n===`message`)?dataProperty(t,`value`):e}function workerMessagePayloadBytes(e){if(!T)return;let t=messageBody(e),n=messageData(t),r=n&&(Object.getOwnPropertyDescriptor(n,`value`)??Object.getOwnPropertyDescriptor(n,`input`));if(r&&!(`value`in r))return;let i=r?r.value:t;if(!v.isProxy(i)){if(ArrayBuffer.isView(i)||i instanceof ArrayBuffer){let e=n&&dataProperty(n,`type`)===`open`?dataProperty(n,`preparation`):void 0;return i.byteLength+(ArrayBuffer.isView(e)?e.byteLength:0)}if(typeof i==`string`)return i.length*2;if(i==null)return 0}}function messageKind(e,t){let n=messageData(messageBody(e));if(!n)return t;switch(dataProperty(n,`status`)){case`ok`:case`failed`:return`task_reply`;case`request`:return`task_request`;case`notification`:return`task_notification`;case`consumed`:return`task_consumed`;case`memory`:return`memory`;case`ready`:return`lifecycle`}if(typeof dataProperty(n,`taskId`)==`number`)return`task_input`;if(typeof dataProperty(n,`actor`)==`number`)return`sqlite_request`;if(typeof dataProperty(n,`id`)==`number`&&typeof dataProperty(n,`ok`)==`boolean`)return`sqlite_reply`;if(typeof dataProperty(n,`operationId`)==`number`)switch(dataProperty(n,`type`)){case`prepare`:case`reclaim`:case`canonical-validation`:return`sqlite_request`;case`reclaimed`:case`refused`:case`checkpoint`:return`sqlite_reply`;case`admission`:case`admission-request`:case`admission-release`:return`admission`;case`commit-request`:return`authority`}switch(dataProperty(n,`type`)){case`resource-owner`:case`resource-message`:case`resource-closed`:return`resource`;case`cpu`:case`heap`:return`memory`;case`create`:case`created`:case`stop`:case`stopped`:case`close`:case`closed`:case`release`:case`execution-exit`:case`error`:case`messageerror`:case`create-error`:case`stop-error`:case`request-error`:return`lifecycle`}return dataProperty(n,`closeResource`)===!0?`resource`:t}function observeWorkerMessage(e,t,n=`other`,r,i){T&&recordWorkerMessage(messageKind(e,n),t,r===void 0?workerMessagePayloadBytes(e):r??void 0,i)}function canObserveWorkerMessages(e){if(!Object.isExtensible(e))return!1;for(let t of[`postMessage`,`emit`]){let n=e;for(;n;){let e=Object.getOwnPropertyDescriptor(n,t);if(e){if(!e.writable||typeof e.value!=`function`)return!1;break}n=Reflect.getPrototypeOf(n)}if(!n)return!1}return!0}function readPostgresBridgeCounters(e){return Array.isArray(e)?e.filter(e=>t(e)&&typeof e.threadId==`number`&&Number.isSafeInteger(e.threadId)&&e.threadId!==E&&e.count instanceof Int32Array&&e.count.length===1&&e.count.buffer instanceof SharedArrayBuffer&&(e.selfRootCount===void 0||e.selfRootCount instanceof Int32Array&&e.selfRootCount.length===1&&e.selfRootCount.buffer instanceof SharedArrayBuffer)):[]}function collectPostgresBridgeCounters(e,t,n){let r=/* @__PURE__ */ new Map([[E,{threadId:E,count:e,selfRootCount:n}]]);for(let e of t)for(let t of e.postgresBridgeCounters??[])r.set(t.threadId,t);return[...r.values()]}const Ae=le(`openclaw.code-mode.gc-storm`),L=a(Symbol.for(`openclaw.workerCpuSources`),()=>(process.on(`worker`,trackWorker),{gcObserver:void 0,postgresBridgeCount:new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)),postgresPoolSelfRootCount:new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)),postgresBridgeObservers:/* @__PURE__ */ new Set,revision:0,cpuSources:void 0,nextPoolId:0,poolIds:/* @__PURE__ */ new WeakMap,workers:/* @__PURE__ */ new Map,lifecycle:/* @__PURE__ */ new Map,taskMetrics:/* @__PURE__ */ new Map}));function createCpuTrackedWorker(e,t,n){let i=r(`worker:${c(e,t?.eval)}`,()=>new w(e,t));return trackNativeWorkerForCpu(i,e,t?.eval),Object.assign(L.workers.get(i),{internalMessages:!0,requestClass:n}),i}function trackNativeWorkerForCpu(e,t,n=!1){trackWorker(e);let r=L.workers.get(e),i=c(t,n);if(r.script!==i&&(r.script===`bridge.worker.js`&&Atomics.sub(L.postgresBridgeCount,0,1),i===`bridge.worker.js`&&Atomics.add(L.postgresBridgeCount,0,1),r.script=i),r.script===`sqlite-store.worker.js`&&attributeWorkerMetrics(r,`writer`),r.script===`code-mode-node.worker.js`&&r.workerSlot===void 0){let e=new Set([...L.workers.values()].map(e=>e.workerSlot));for(let t=1;t<=64;t++)if(!e.has(t)){r.workerSlot=t;break}}r.lifecycleMessages=r.script===`openclaw-state-lease-heartbeat.worker.js`||r.script===`gateway-state-owner-heartbeat.worker.js`}function getTrackedPostgresBridgeCounters(){return collectPostgresBridgeCounters(L.postgresBridgeCount,L.workers.values(),L.postgresPoolSelfRootCount)}function recordPostgresPoolSelfRoot(){return Atomics.compareExchange(L.postgresPoolSelfRootCount,0,0,1)===0}function observeTrackedPostgresBridgeCounters(e){return L.postgresBridgeObservers.add(e),()=>L.postgresBridgeObservers.delete(e)}function publishPostgresBridgeCounters(){for(let e of L.postgresBridgeObservers)e()}function receivePostgresBridgeCounters(e,t){let n=readPostgresBridgeCounters(t),r=e.postgresBridgeCounters;n.length===(r?.length??0)&&n.every((e,t)=>e.threadId===r?.[t]?.threadId)||(e.postgresBridgeCounters=n,publishPostgresBridgeCounters())}function attributeWorkerToPool(e,t,n){let r=L.workers.get(e);if(!r)return;let i=L.poolIds.get(t);i===void 0&&(i=++L.nextPoolId,L.poolIds.set(t,i)),r.poolId=i,attributeWorkerMetrics(r,n,0)}function attributeWorkerMetrics(e,t,n){let r=t===`reader`||t===`file-reader`||t===`compute`||t===`writer`||t===`singleton`?t:`other`,i=`${r}:${e.script}`,a=L.taskMetrics.get(i);a||(a={workerClass:r,script:e.script,tasksCompleted:n,heapUsedHighWaterBytes:0,gc:[]},L.taskMetrics.set(i,a)),e.taskMetrics=a}function forgetWorker(e){let t=L.workers.get(e);if(!t)return;let n=countWorkerStart(t),r=t.retirementReason??`exit`;n.retired.set(r,(n.retired.get(r)??0)+1),t.script===`bridge.worker.js`&&Atomics.sub(L.postgresBridgeCount,0,1),t.memoryFlush?.resolve(),drainWorkerMemoryPort(t),retire(t),t.memoryPort?.close(),L.workers.delete(e),L.revision++,L.cpuSources=void 0,t.postgresBridgeCounters&&publishPostgresBridgeCounters()}function countWorkerStart(e){let t=L.lifecycle.get(e.script);return t||(t={started:0,retired:/* @__PURE__ */ new Map},L.lifecycle.set(e.script,t)),e.started||(e.started=!0,t.started++),t}function markWorkerRetirement(e,t){let n=L.workers.get(e);n&&(n.retirementReason??=t)}function flushWorkerDiagnostics(e,t){let n=L.workers.get(e);if(n?.memoryFlush)return n.memoryFlush.operation;let r=n?.memoryPort;if(!n?.taskMetrics||!r||!L.gcObserver||[`failure`,`cancelled`,`crash`,`gc-thrash`,`gc-storm`,`exit`].includes(t))return;let i=performance.now()+100,a=createRetainedOperation(()=>{drainWorkerMemoryPort(n),performance.now()>=i&&a.resolve()});n.memoryFlush=a;let o=setTimeout(()=>a.resolve(),100);a.operation.result.then(()=>clearTimeout(o));try{r.postMessage({flush:!0}),recordWorkerMessage(`memory`,`to_worker`,1)}catch{a.resolve()}return a.operation}function trackWorker(e){if(L.workers.has(e))return;if(T&&e instanceof w&&recordWorkerMessage(`lifecycle`,`to_worker`),T&&e instanceof w&&canObserveWorkerMessages(e)){let n=Object.getPrototypeOf(e)===w.prototype,i=!n||Object.hasOwn(e,`postMessage`)?e.postMessage:void 0;e.postMessage=function(e,t){let n=r.internalMessages?workerMessagePayloadBytes(e):void 0;(i??w.prototype.postMessage).call(this,e,t),r.lifecycleMessages?recordWorkerMessage(`lifecycle`,`to_worker`,n):r.internalMessages?observeWorkerMessage(e,`to_worker`,`other`,n??null,r.requestClass?.()):recordWorkerMessage(`other`,`to_worker`)};let a=!n||Object.hasOwn(e,`emit`)?e.emit:void 0;e.emit=function(e,...n){if(e===`error`&&r.script===`code-mode-node.worker.js`){let e=n[0];r.retirementReason??=t(e)&&e.code===`ERR_CODE_MODE_GC_THRASH`?`gc-thrash`:`crash`}return e===`message`&&(r.lifecycleMessages?recordWorkerMessage(`lifecycle`,`from_worker`,workerMessagePayloadBytes(n[0])):r.internalMessages?observeWorkerMessage(n[0],`from_worker`,`other`,void 0,r.requestClass?.()):recordWorkerMessage(`other`,`from_worker`)),(a??w.prototype.emit).call(this,e,...n)}}let n=!1,finishCpuUsage=e=>(n=!1,e),failCpuUsage=()=>finishCpuUsage(void 0),r={script:`other`,cpuUsage(){if(n)return Promise.resolve(void 0);n=!0;try{return e.cpuUsage().then(finishCpuUsage,failCpuUsage)}catch{return Promise.resolve(failCpuUsage())}}};L.workers.set(e,r),queueMicrotask(()=>countWorkerStart(r)),L.revision++,L.cpuSources=void 0,e.once(`exit`,()=>forgetWorker(e))}function recordWorkerHeap({taskMetrics:e},t){e&&(e.heapUsedHighWaterBytes=Math.max(e.heapUsedHighWaterBytes,t))}function isWorkerGcObservationEnabled(){return!!L.gcObserver}function recordWorkerGc(e,t){let n=e.taskMetrics;if(n)for(let e of t){if(!e||![`scavenge`,`mark_sweep_compact`,`incremental`,`weak_processing`].includes(e.kind)||!Number.isFinite(e.durationMs)||e.durationMs<0)continue;let t=n.gc.find(t=>t.kind===e.kind);t||(t={kind:e.kind,count:0,durationMs:0,reclaimedBytes:0},n.gc.push(t)),t.count++,t.durationMs+=e.durationMs,Number.isFinite(e.reclaimedBytes)&&e.reclaimedBytes>=0&&(t.reclaimedBytes+=e.reclaimedBytes),n.heapUsedHighWaterBytes=Math.max(n.heapUsedHighWaterBytes,Number.isFinite(e.heapUsedBeforeBytes)?e.heapUsedBeforeBytes:0)}L.gcObserver?.(t,e.script,e.workerSlot)}function drainWorkerMemoryPort({memoryPort:e,memoryReceive:t}){if(e&&t)for(let n=oe(e);n;n=oe(e))t(n.message)}function receiveWorkerMemoryPort(e,n){if(t(n)&&(n.status===`ok`||n.status===`failed`)&&n.diagnostics===!0){let t=L.workers.get(e);return t?.taskMetrics?.tasksCompleted!==void 0&&t.taskMetrics.tasksCompleted++,!1}if(!t(n)||n.status!==`memory`||!(n.port instanceof C))return!1;let r=n.port,i=L.workers.get(e);if(!i||i.memoryPort||e.threadId===-1)return r.close(),!0;receivePostgresBridgeCounters(i,n.postgresBridgeCounters),i.memoryPort=r,i.memoryPending=!0;let close=()=>{i.memoryPort=void 0,i.memoryReceive=void 0,i.memoryPending=!1,i.memoryUnavailable=!0,i.memoryFlush?.resolve(),r.close()};return i.memoryReceive=t=>{if(`sqliteReaderCounter`in t)receive(i,t.sqliteReaderCounter),recordWorkerMessage(`memory`,`from_worker`,16);else if(`postgresBridgeCounters`in t)receivePostgresBridgeCounters(i,t.postgresBridgeCounters),recordWorkerMessage(`memory`,`from_worker`);else if(`flushed`in t)recordWorkerMessage(`memory`,`from_worker`,8),recordWorkerHeap(i,t.heapUsed),i.memoryFlush?.resolve();else if(`retireWorkerId`in t)recordWorkerMessage(`memory`,`from_worker`),Ae.publish(t.retireWorkerId);else if(`gcStorm`in t){recordWorkerMessage(`memory`,`from_worker`);let n=e.threadId,a=i.workerSlot;import(`./code-mode-node.worker-diagnostic-worker-gc-profile-p7wELmkl.mjs`).then(async({reportWorkerGcStorm:e})=>{let o=await e(t.gcStorm,n,a);o&&i.memoryPort===r&&r.postMessage({captureGcProfile:o})})}else recordWorkerMessage(`memory`,`from_worker`,(`heapUsed`in t?32+(t.heapSizeLimitBytes===void 0?0:8):0)+(`heapUsed`in t&&t.oldGenerationAfterGcBytes!==void 0?8:0)+(`heapUsed`in t?(t.heapSpaces?.length??0)*8:0)+(`heapUsed`in t?t.retainedData?.reduce((e,t)=>e+16+(t.stringBytes===void 0?0:8)+(t.objects===void 0?0:8)+(t.generations===void 0?0:8)+(t.providers===void 0?0:8)+(t.accounts===void 0?0:8)+(t.truncated===void 0?0:1),0)??0:0)+(t.gc?.length??0)*8),t.gc&&recordWorkerGc(i,t.gc),`heapUsed`in t&&(recordWorkerHeap(i,t.heapUsed),delete t.gc,i.heap={value:t,sampledAt:performance.now()},i.memoryPending=!1,i.memoryUnavailable=!1)},r.on(`message`,i.memoryReceive),r.once(`close`,close),r.once(`messageerror`,close),r.unref(),L.gcObserver&&(r.postMessage({gc:!0}),recordWorkerMessage(`memory`,`to_worker`,1)),!0}let R,je=0;function publishWorkerGcStorm(e){R&&(`retireWorkerId`in e?R.postMessage(e,[]):(performance.now()>=je&&(je=performance.now()+36e5,e.captureStatus=`requested`),R.postMessage({gcStorm:e},[])))}function serveWorkerMemorySamples(e,t){let{port1:n,port2:r}=new re;R=n;let i=observeSqliteReaderCounters(e=>{n.postMessage({sqliteReaderCounter:e})}),a=observeTrackedPostgresBridgeCounters(()=>{n.postMessage({postgresBridgeCounters:getTrackedPostgresBridgeCounters()})}),o=process.versions.bun?void 0:x().heap_size_limit,s,c=!1,flushGc=()=>{s&&=(n.postMessage({gc:s}),void 0)},sample=()=>{let{heapUsed:e,heapTotal:r,external:i,arrayBuffers:a}=process.memoryUsage(),c=process.versions.bun?void 0:b().map(({space_name:e,space_used_size:t})=>({space_name:e,space_used_size:t}));n.postMessage({heapUsed:e,heapTotal:r,external:i,arrayBuffers:a,heapSizeLimitBytes:o,oldGenerationAfterGcBytes:getOldGenerationAfterGcBytes(),heapSpaces:c,retainedData:t?.(),gc:s}),s=void 0},l,setGcEnabled=e=>{e?l??=observeGcSamples(e=>{(s??=[]).push(...e),(c||s.length>=256)&&flushGc()}):(l?.(),l=void 0,s=void 0)};return n.on(`message`,e=>{if(e&&`flush`in e)flushGcSamples(),flushGc(),n.postMessage({flushed:!0,heapUsed:x().used_heap_size});else if(e&&`captureGcProfile`in e){let t=e.captureGcProfile;import(`./code-mode-node.worker-diagnostic-worker-gc-profile-p7wELmkl.mjs`).then(({captureWorkerGcProfiles:e})=>e()).then(e=>{n.postMessage({gcStorm:e.status===`complete`?{...t,captureStatus:`complete`,profiles:e.result}:{...t,captureStatus:`unavailable`,captureReason:e.reason}})}).catch(()=>{n.postMessage({gcStorm:{...t,captureStatus:`unavailable`,captureReason:`capture-failed`}})})}else e?setGcEnabled(e.gc):sample()}),n.once(`close`,()=>{R=void 0,a(),i(),l?.(),s=void 0}),n.on(`messageerror`,()=>n.close()),n.unref(),sample(),e.postMessage({status:`memory`,port:r,postgresBridgeCounters:getTrackedPostgresBridgeCounters()},[r]),{setTaskMetrics(e){c=e,setGcEnabled(e)},collectTask(){return c?!0:void 0},close(){R=void 0,a(),i(),l?.(),l=void 0,flushGc(),n.close()}}}const Me=Symbol.for(`openclaw.workerTaskNativeSection`),Ne=globalThis,Pe=Ne[Me]??=new D;function assertWorkerTaskActive(e,t){if(!t()||e&1)throw Error(`worker task cancelled`)}function acquireWorkerNativeSection(e,t){for(;;){let n=Atomics.load(e,0);if(assertWorkerTaskActive(n,t),Atomics.compareExchange(e,0,n,n+2)===n)break}let n=!1;return()=>{n||(n=!0,Atomics.sub(e,0,2),Atomics.notify(e,0))}}function withWorkerTaskNativeSectionScope(e,t,n){return Pe.run(()=>acquireWorkerNativeSection(e,t),n)}function createWorkerNativeSectionState(){return new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT))}function cancelWorkerNativeSections(e){Atomics.or(e,0,1),Atomics.notify(e,0)}function observeWorkerTaskCancellation(e,t,n){let r=!0,i=(async()=>{for(;;){if(!r||!t())return;let i=Atomics.load(e,0);if(i&1){n();return}await Atomics.waitAsync(e,0,i).value}})();return()=>(r=!1,Atomics.notify(e,0),i)}function waitForWorkerNativeSections(e){if(!areWorkerNativeSectionsSettled(e))return(async()=>{for(;;){let t=Atomics.load(e,0);if(t<2)return;await Atomics.waitAsync(e,0,t).value}})()}function areWorkerNativeSectionsSettled(e){return Atomics.load(e,0)<2}function releaseWorkerNativeSectionsOnExit(e){Atomics.store(e,0,1),Atomics.notify(e,0)}function createWorkerTaskControl(e,t,n=new AbortController().signal){let throwIfCancelled=()=>assertWorkerTaskActive(Atomics.load(e,0),t);return{signal:n,throwIfCancelled,runNativeSection:async n=>{let r=acquireWorkerNativeSection(e,t),i;try{i=await n()}finally{r()}return throwIfCancelled(),i}}}function postTaskMessage(e,t,n,r=[]){e.postMessage(t,r),n&&(Atomics.add(n,0,1),Atomics.notify(n,0))}function serveOwnedWorkerTasks$1(e,t,n){if(!ae)return;let r=ae,i=r,a=!1,o=!1;n.initialize(i);let s,c=Promise.resolve(),l=Promise.resolve(),u=0,d,f=typeof e==`function`?void 0:e.synchronousStateless,p=typeof e==`function`?e:e.synchronousStateless,reply=(e,r)=>{postTaskMessage(i,{status:`ok`,value:r,taskId:e.taskId,...n.collectTaskDiagnostics?{diagnostics:n.collectTaskDiagnostics()}:{}},e.progressSignal,t.transferList?.(r)??[])},fail=(e,r)=>{t.retireOnError?o=!0:postTaskMessage(i,{status:`failed`,taskId:e.taskId,error:r instanceof Error?r.message:String(r),...n.collectTaskDiagnostics?{diagnostics:n.collectTaskDiagnostics()}:{}},e.progressSignal)},finish=()=>{o?(async()=>{try{await l}finally{try{await n.onRetire?.()}finally{process.exitCode=1;try{i.close()}finally{i!==r&&r.close()}}}})().catch(()=>{process.exitCode=1}):n.onIdle()};i.on(`message`,function receive(e){if(o){e.resourcePort?.close();return}if(!a){a=!0;let t=n.selectStartupPort?.(e);if(t){i.off(`message`,receive),i=t,n.initialize(i),i.on(`message`,receive),n.onReady?.();return}}if(n.onMessage(e.sampleMemory===!0),e.closeResource&&e.resourcePort){let r=e.resourcePort,i=t.closesBesideExecution?.(e.key)?void 0:c;u++,l=l.then(()=>i).then(async()=>{if(o)throw Error(`Worker is retiring after a terminal task failure`);await t.closeResource(e.key),r.postMessage({ok:!0},[])}).catch(e=>{r.postMessage({ok:!1,error:e instanceof Error?e.message:String(e),detail:t.encodeResourceError?.(e)},[])}).finally(()=>{r.close(),u--,!s&&!o&&n.onIdle()});return}if(e.responseId!==void 0){if(e.taskId===d?.taskId&&e.responseId===d.responseId)return;if(!s||e.taskId!==s.taskId||e.responseId!==s.responseId||!s.pending)throw Error(`stale worker task response`);try{s.assertCurrent()}catch(e){s.cancelPending(e);return}let t=s.pending;s.pending=void 0;let n=!1,r=e.taskId,a=e.responseId,o=s.progressSignal;t.resolve({input:e.input,consumed:()=>{n||(n=!0,postTaskMessage(i,{status:`consumed`,taskId:r,id:a},o))}});return}if(s)throw Error(`overlapping worker tasks`);let r=new Int32Array(e.nativeSections),m={taskId:e.taskId,responseId:0,progressSignal:e.progressSignal,assertCurrent:()=>g.throwIfCancelled(),cancelPending:e=>{let t=m.pending;t&&(m.pending=void 0,d={taskId:m.taskId,responseId:m.responseId},t.reject(e))}},h=new AbortController,g=createWorkerTaskControl(r,()=>s===m,h.signal);if(s=m,f&&!e.interactive&&u===0){try{g.throwIfCancelled(),n.installTaskContext(e.taskContext);let t=f(e.input);s=void 0,reply(m,t)}catch(e){s=void 0,fail(m,e)}finally{finish()}return}let _=observeWorkerTaskCancellation(r,()=>s===m,()=>{let e=/* @__PURE__ */ Error(`worker task cancelled`);h.abort(e),m.cancelPending(e)}),v=e.interactive?{notify:e=>{g.throwIfCancelled(),postTaskMessage(i,{status:`notification`,taskId:m.taskId,value:e},m.progressSignal)},consumeInput:()=>postTaskMessage(i,{status:`consumed`,taskId:m.taskId,id:0},m.progressSignal),request:(e,t)=>{if(g.throwIfCancelled(),s!==m||m.pending)throw Error(`closed or busy worker channel`);let n=Promise.withResolvers();m.pending=n;try{let n=t?[...t]:[];g.throwIfCancelled(),postTaskMessage(i,{status:`request`,taskId:m.taskId,id:++m.responseId,value:e},m.progressSignal,n)}catch(e){m.pending=void 0,n.reject(e)}return n.promise}}:void 0,y=l;c=Promise.resolve().then(async()=>{try{return await y,g.throwIfCancelled(),n.installTaskContext(e.taskContext),await withWorkerTaskNativeSectionScope(r,()=>s===m,()=>p(e.input,v,g))}finally{await _?.(),s=void 0}}).then(e=>reply(m,e)).catch(e=>fail(m,e)).finally(finish)}),n.onReady?.()}T&&process.env.OPENCLAW_PACKAGED_COMPILE_CACHE_RESPAWNED===`gateway`&&(delete process.env.NODE_DISABLE_COMPILE_CACHE,delete process.env.OPENCLAW_PACKAGED_COMPILE_CACHE_RESPAWNED);const Fe=36e5,Ie=3e4,Le=/^(?:[a-f0-9]{16}|\d+-\d+|no-package-json|build-[A-Za-z0-9._-]+)$/,sanitize=e=>{let t=e.replace(/[^A-Za-z0-9._-]+/g,`_`).replace(/^_+|_+$/g,``);return t&&t!==`.`&&t!==`..`?t:`unknown`};function scheduleOpenClawCompileCacheFlush(){if(!h.getCompileCacheDir?.())return;let e=globalThis[Symbol.for(`openclaw.nodeCompileCacheBase`)]??={};e.flush||(e.flush=setImmediate(()=>{e.flush=void 0;try{h.flushCompileCache()}catch{}}),e.flush.unref())}function resolveSafeNodeCompileCacheDirectory(e){if(process.platform===`win32`&&O.resolve(e).length>200)process.stderr.write(`[openclaw] Compile cache disabled: Windows cache path exceeds 200 characters.
`);else return e}async function maintain(e){let t=O.dirname(O.dirname(e)),n=O.basename(O.dirname(e));if(O.basename(t)!==`openclaw`||sanitize(n)!==n||!Le.test(O.basename(e)))return;let r=Date.now(),i=await k.lstat(t).catch(()=>void 0);for(let n of[t,O.dirname(e),e]){let e=n===t?i:await k.lstat(n).catch(()=>void 0);if(e&&!e.isDirectory())return}if(i&&r-i.mtimeMs<Fe)return;await k.mkdir(t,{recursive:!0});let a=`${t}.maintenance`,o=await k.lstat(a).catch(()=>void 0);if(o&&r-o.mtimeMs>3e5&&await k.rmdir(a).catch(()=>{}),!await k.mkdir(a).then(()=>!0,()=>!1))return;let s=[],c=0,l=0,u=!1;async function prune(){for(s.sort((e,t)=>t.mtimeMs-e.mtimeMs);s.length;){if(Date.now()-r>Ie)return!1;let e=s[s.length-1];if(c<=536870912&&s.length<=4096&&r-e.mtimeMs<=6048e5)break;await k.unlink(e.file).catch(e=>{if(e.code!==`ENOENT`)throw e}),c-=e.size,s.pop()}return!0}async function visit(e){for await(let t of await k.opendir(e)){if(++l>16384||Date.now()-r>Ie)return!1;let n=O.join(e,t.name);if(t.isDirectory()){if(!await visit(n))return!1}else if(t.isFile()){let e=await k.lstat(n).catch(e=>{if(e.code!==`ENOENT`)throw e});if(!e)continue;if(c+=e.size,s.push({file:n,size:e.size,mtimeMs:e.mtimeMs}),s.length%256==0&&!await prune())return!1}}return!0}try{if(r-(await k.lstat(t)).mtimeMs<Fe){u=!0;return}let e=await visit(t);if(await prune()&&e){let e=/* @__PURE__ */ new Date;await k.utimes(t,e,e),u=!0}}finally{u||await k.utimes(t,i?.atime??/* @__PURE__ */ new Date(0),i?.mtime??/* @__PURE__ */ new Date(0)).catch(()=>{}),await k.rmdir(a)}}process.argv[2]===`--maintain`&&process.argv[1]===ue(import.meta.url)&&process.argv[3]&&maintain(process.argv[3]).catch(()=>{});function throwIfSettledRejected(e,t){throwCollectedErrors(e.flatMap(e=>e.status===`rejected`?[e.reason]:[]),t)}function throwCollectedErrors(e,t){if(e.length===1)throw e[0];if(e.length>1)throw AggregateError(e,t)}function materializeErrorStack(e){try{for(let t of f(e))try{if(!(t instanceof Error))continue;try{t.stack=String(t.stack)}catch{t.stack=`Stack trace unavailable: custom formatter failed`}}catch{}}catch{}}function collectSynchronousErrors(e,t){let n=[];for(let r of e)try{t(r)}catch(e){n.push(e)}return n}const z=a(Symbol.for(`openclaw.agentDatabaseReaders`),()=>({closers:/* @__PURE__ */ new Set,deleted:/* @__PURE__ */ new Map}));function captureDeletedAgentDatabaseFences(){return[...z.deleted]}function installDeletedAgentDatabaseFences(e){z.deleted.clear();for(let[t,n]of e)z.deleted.set(t,n)}async function applyAgentDatabaseReaderRequest(e){if(e.kind===`revive`){for(let[t,n]of z.deleted)e.agentIds.includes(n)&&z.deleted.delete(t);return}if(e.deleted)for(let t of e.candidates)z.deleted.set(O.resolve(t.path),e.agentId);let t=e.deleted?void 0:new Set(e.retainedPaths?.map(e=>O.resolve(e)));throwIfSettledRejected(await Promise.allSettled([...z.closers].map(async n=>n(e.candidates,t))),`Agent database reader cleanup failed`)}function normalizeCandidates(e){if(Array.isArray(e)&&e.every(e=>t(e)&&typeof e.path==`string`&&(e.scope===void 0||e.scope===`sibling-family`)))return e.map(e=>e.scope?{path:e.path,scope:e.scope}:{path:e.path})}function decodeAgentDatabaseReaderRequest(e){if(e===void 0)return;let r;try{r=JSON.parse(e)}catch{return}if(Array.isArray(r)){let e=normalizeCandidates(r);return e?{kind:`close`,candidates:e,deleted:!1}:void 0}if(t(r)){if(`candidates`in r&&!(`deleted`in r)){let e=normalizeCandidates(r.candidates),t=r.retainedPaths;return e&&n(t)?{kind:`close`,candidates:e,retainedPaths:t,deleted:!1}:void 0}if(`deleted`in r){let e=normalizeCandidates(r.deleted);return e&&typeof r.agentId==`string`&&r.agentId.length>0?{kind:`close`,candidates:e,deleted:!0,agentId:r.agentId}:void 0}if(`revive`in r&&n(r.revive))return{kind:`revive`,agentIds:r.revive}}}const Re=a(Symbol.for(`openclaw.databaseEngineSelection`),()=>({})),ze=a(Symbol.for(`openclaw.databaseEngineMaintenanceSelection`),()=>new D);function getDatabaseEngineSelection(){return ze.getStore()??Re.selection}function withDatabaseEngineSelection(e,t){return ze.run(e,t)}const Be=ce,B=a(Symbol.for(`openclaw.postgresIoPool`),()=>({endpoints:Be?.postgresPool,workers:void 0,nextStep:void 0,ready:[],refresh:void 0,failure:void 0}));function postgresPoolWorkerFailure(){return B.failure}function bindPostgresPool(e){if(B.endpoints){if(B.endpoints===e)return;for(let{port:t}of e.services)t.close()}else B.endpoints=e}async function closePostgresPool(){let e=B.workers;B.workers=void 0;for(let{port:e}of B.endpoints?.services??[])e.close();B.endpoints=void 0,B.ready=[],B.refresh=void 0,B.failure=void 0,await Promise.all(e?.map(e=>e.terminate())??[])}const Ve=`openclaw.sqliteDatabaseAdmissions.v1`;function changedAdmissionEntries(e,t){let n=/* @__PURE__ */ new Map;for(let[r,i]of e)t.get(r)!==i&&n.set(r,i);return n}function changedAdmissionWriteScopes(e,t){let n=/* @__PURE__ */ new Map;return e.forEach((e,r)=>{e!==t[r]&&e.forEach((e,i)=>{t[r].get(i)!==e&&n.set(i,e)})}),n}const He=process.platform!==`linux`&&process.platform!==`android`;function databaseFileIdentityKey(e){return`${e.dev}:${e.ino}`}function readDatabaseIdentityBirthtime(e){return He?e.birthtimeNs.toString():`0`}function normalizeDatabasePath(e){let t=process.platform===`win32`?p(e):e;return process.platform===`win32`&&!/^(?:[a-z]:[\\/]|[\\/]{2})/iu.test(t)?e:t}function assertDatabaseFileIdentity(e,t){if(!e.isFile()||`file:${databaseFileIdentityKey(e)}`!==t.key||t.birthtime!==void 0&&readDatabaseIdentityBirthtime(e)!==t.birthtime)throw Error(`SQLite database file identity changed before existing-only open`)}function existingIdentity(e,t,n){if(!e.isFile())throw Error(`SQLite worker database path must identify a regular file`);if(e.dev!==t.dev||e.ino!==t.ino||readDatabaseIdentityBirthtime(e)!==readDatabaseIdentityBirthtime(t))throw Error(`SQLite database pathname changed during admission`);return{key:`file:${databaseFileIdentityKey(e)}`,canonicalPath:normalizeDatabasePath(n),birthtime:readDatabaseIdentityBirthtime(e)}}function missingAncestorParent(e,t,n){if(!o(n,`ENOENT`))throw n;t.unshift(O.basename(e));let r=O.dirname(e);if(r===e)throw n;return r}async function inspectDatabasePathIdentity(e){let t=await ge(e,{bigint:!0}).catch(e=>{if(!o(e,`ENOENT`))throw e});if(t){if(!t.isFile())return;try{let n=await he(e);return existingIdentity(t,await ge(n,{bigint:!0}),n)}catch(e){throw o(e,`ENOENT`)?Error(`SQLite database pathname changed during admission`,{cause:e}):e}}let n=await resolveDatabasePathKeyAsync(e);return{key:`path:${n}`,canonicalPath:n}}async function resolveDatabasePathKeyAsync(e){let t=[],n=O.resolve(e);for(;;)try{return normalizeDatabasePath(O.join(await he(n),...t))}catch(e){n=missingAncestorParent(n,t,e)}}function isSoleDatabaseFileDescriptor(e,t){if(process.platform!==`linux`)return!1;try{for(let n of me(`/proc/self/fd`))if(/^\d+$/u.test(n)&&Number(n)!==e)try{let e=pe(Number(n),{bigint:!0});if(e.dev===t.dev&&e.ino===t.ino)return!1}catch(e){if(!o(e,`EBADF`))return!1}return!0}catch{return!1}}function readSqliteDatabaseAdmissionIdentity(e){return`${e.dev}:${e.ino}:${readDatabaseIdentityBirthtime(e)}`}const V={schemaRevision:0,factRevision:1,publicationRevision:2,retired:3,writeRevision:4,hostRevision:5,unscopedWriteRevision:6,writeScopeRevision:7,sealPresent:8},Ue=Object.keys(V).length,We=Symbol.for(`openclaw.sqliteDatabaseAdmission.decodedValue`);function readSqliteDatabaseAdmissionFact(e,t){return e[We]??={value:t.read?t.read(e.value):e.value},e[We].value}function admitSqliteDatabaseFactValue(e,t){let n={value:t};return readSqliteDatabaseAdmissionFact(n,e),n}const Ge=1048576,H=a(Symbol.for(`openclaw.sqliteDatabaseWriteScopeRetention`),()=>/* @__PURE__ */ new WeakMap),writeScopeBytes=e=>e.length*2+256;function retainSqliteDatabaseWriteScope(e,t,n){let r=e.writeScopes,i=H.get(r);i||(i={bytes:[...r.keys()].reduce((e,t)=>e+writeScopeBytes(t),0),retired:/* @__PURE__ */ new Set},H.set(r,i)),r.delete(t)||(i.bytes+=writeScopeBytes(t)),r.set(t,n),pruneSqliteDatabaseWriteScopes(e)}function pruneSqliteDatabaseWriteScopes(e){let t=H.get(e.writeScopes);if(t.bytes<=Ge)return!1;let n=!1;for(let[r,i]of e.writeScopes)if(!(Atomics.compareExchange(i.state,2,0,-1)>0&&Atomics.load(i.state,1)===0)&&(Atomics.store(i.state,1,1),advanceSqliteDatabaseGeneration(e,`writeScopeRevision`),e.writeScopes.delete(r),t.bytes-=writeScopeBytes(r),t.retired.add(r),n=!0,t.bytes<=Ge))break;return n}function readSqliteDatabaseAdmissions(e){return Array.isArray(e)?e:void 0}function isSqliteDatabaseAdmissionRetired(e){return readSqliteDatabaseGeneration(e,`retired`)!==0}function isSqliteDatabaseAdmissionFactCurrent(e,t){return!isSqliteDatabaseAdmissionRetired(e)&&Atomics.load(new Int32Array(t.current),0)===1&&t.revision===readSqliteDatabaseFactRevision(e,t.schemaDependent)}function hasSqliteDatabaseSchemaAdmission(e){let t=e?.facts.get(`sqlite-schema`);return!!(e&&t&&isSqliteDatabaseAdmissionFactCurrent(e,t))}function readSqliteDatabaseFactRevision(e,t){return readSqliteDatabaseGeneration(e,t?`schemaRevision`:`factRevision`)}function readSqliteDatabaseGeneration(e,t){return Atomics.load(new Int32Array(e.generation),V[t])}function advanceSqliteDatabaseGeneration(e,t){return Atomics.add(new Int32Array(e.generation),V[t],1)}function publishSqliteDatabaseFact(e,t,n,r,i){if(isSqliteDatabaseAdmissionRetired(e)||r!==readSqliteDatabaseFactRevision(e,t.schemaDependent))return!1;t.writer===`host`&&advanceSqliteDatabaseGeneration(e,`hostRevision`);let a=e.facts.get(t.name);a&&Atomics.store(new Int32Array(a.current),0,0);let o=new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);return Atomics.store(new Int32Array(o),0,1),e.facts.set(t.name,{...n,revision:r,schemaDependent:t.schemaDependent===!0,lifetime:t.lifetime,publication:i,current:o}),advanceSqliteDatabaseGeneration(e,`publicationRevision`),!0}const Ke=Array.from({length:128},()=>/* @__PURE__ */ new Map);function snapshotWriteScopes(e,t=Ke,n){let r=t,i=H.get(e),visit=(n,a)=>{let o=0;for(let e=0;e<a.length;e++)o=o*31+a.charCodeAt(e)|0;let s=o&Ke.length-1,c=!n||Atomics.load(n.state,1)!==0;c&&e.delete(a)&&i&&(i.bytes-=writeScopeBytes(a)),!(c?!t[s].has(a):t[s].get(a)===n)&&(r===t&&(r=t.slice()),r[s]===t[s]&&(r[s]=new Map(t[s])),c?r[s].delete(a):r[s].set(a,n))};if(n)for(let t of n)visit(e.get(t),t);else e.forEach(visit);for(let t of i?.retired??[])visit(e.get(t),t);return i?.retired.clear(),r}function createSqliteDatabaseAdmissionCursor(){return{revision:-1,records:/* @__PURE__ */ new WeakMap}}var SqliteDatabaseAdmissionRegistry=class{constructor(){this.records=/* @__PURE__ */ new Map,this.exchangeCursor=createSqliteDatabaseAdmissionCursor(),this.locations=/* @__PURE__ */ new Map,this.published=/* @__PURE__ */ new Map,this.scopeSweeps=/* @__PURE__ */ new WeakMap,this.descriptors=/* @__PURE__ */ new Map,this.revision=0,this.retainProcessFacts=!0}useConnectionScopedFacts(){this.retainProcessFacts=!1}changeReferences(e,t){let n=e.references.get(E);return n||(n=new SharedArrayBuffer(2*Int32Array.BYTES_PER_ELEMENT),e.references.set(E,n)),Atomics.add(new Int32Array(n),0,t)+t===+(t===1)&&(t===-1&&this.retireUnreferenced(e),this.publish(e),!0)}retireUnreferenced(e){if(E!==0||isSqliteDatabaseAdmissionRetired(e)||[...e.references.values()].some(e=>Atomics.load(new Int32Array(e),0)>0))return;for(let[t,n]of e.facts)this.retainProcessFacts&&n.lifetime===`process`&&isSqliteDatabaseAdmissionFactCurrent(e,n)||e.facts.delete(t);let t=this.descriptors.get(e.identity);t&&(t.facts=e.facts),Atomics.compareExchange(new Int32Array(e.generation),V.retired,0,2),e.writeScopes.clear()}releaseWorker(e){let t=/* @__PURE__ */ new Map;for(let n of this.records.values()){let r=e>0?n.references.get(e):void 0;r&&(Atomics.compareExchange(n.writerDiagnostic,1,e+1,0),Atomics.store(new Int32Array(r),0,-1),this.retireUnreferenced(n),t.set(n,void 0))}t.size>0&&this.publish(t)}observeLocation(e,t){let n=normalizeDatabasePath(O.resolve(e));t===void 0?this.locations.delete(n):this.locations.set(n,t)}forLocation(e){return this.forPathname(normalizeDatabasePath(O.resolve(e)))}prepareLocation(e){let t=normalizeDatabasePath(O.resolve(e));return()=>this.forPathname(t)}forPathname(e){let t=this.locations.get(e),n=t===void 0?void 0:this.records.get(t);return n&&!isSqliteDatabaseAdmissionRetired(n)?n:void 0}forget(e){this.records.delete(e),this.published.delete(e);for(let[t,n]of this.locations)n===e&&this.locations.delete(t)}retainDescriptorCustody(e,t,n){let r=readSqliteDatabaseAdmissionIdentity(n),i=this.descriptors.get(r);if(i&&i.descriptor!==t)throw Error(`SQLite descriptor custody changed during admission`);i||this.descriptors.set(r,{location:e,descriptor:t,file:n,facts:/* @__PURE__ */ new Map})}retainDescriptor(e,t,n){let r=this.descriptors.get(readSqliteDatabaseAdmissionIdentity(n)),i={identity:readSqliteDatabaseAdmissionIdentity(n),physicalIdentity:{key:`file:${n.dev}:${n.ino}`,birthtime:readDatabaseIdentityBirthtime(n)},location:e,descriptor:t,descriptorOwner:0,generationId:de(),generation:new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT*Ue),writerDiagnostic:new Int32Array(new SharedArrayBuffer(125*Int32Array.BYTES_PER_ELEMENT)),writeScopes:/* @__PURE__ */ new Map,writeScopeRevision:0,references:/* @__PURE__ */ new Map,facts:new Map([...r?.facts??[]].filter(([,e])=>Atomics.load(new Int32Array(e.current),0)===1).map(([e,t])=>[e,{...t,revision:0}]))};this.records.set(i.identity,i);let a=r?.descriptor===t?r:{location:e,descriptor:t,file:n,facts:/* @__PURE__ */ new Map};return a.location=e,a.file=n,a.facts=/* @__PURE__ */ new Map,this.descriptors.set(i.identity,a),this.observeLocation(e,i.identity),this.publish(i),i}retireDescriptor(e,t){let n=this.records.get(e),r=this.descriptors.get(e)?.descriptor??n?.descriptor;if(r===void 0)return!1;let i=fe.fstatSync(r,{bigint:!0});return i.nlink>1n||t.requireSoleDescriptor&&!isSoleDatabaseFileDescriptor(r,i)?!1:(n&&Atomics.store(new Int32Array(n.generation),V.retired,1),fe.closeSync(r),this.descriptors.delete(e),this.forget(e),this.publish(),!0)}publish(e,t){let n=e instanceof Map;if(!e||n||this.records.get(e.identity)===e){for(let r of this.records.values()){if(isSqliteDatabaseAdmissionRetired(r)){readSqliteDatabaseGeneration(r,`retired`)===1&&this.descriptors.delete(r.identity),this.forget(r.identity);continue}if(e&&e!==r&&!(n&&e.has(r)))continue;let i=e===r||n;for(let[e,t]of r.references)Atomics.load(new Int32Array(t),0)<0&&(r.references.delete(e),i=!0);let a=this.published.get(r.identity),o=readSqliteDatabaseGeneration(r,`writeScopeRevision`),s=a&&e?n?e.get(r):t:void 0,c=s===void 0&&this.scopeSweeps.get(r)!==o,l=snapshotWriteScopes(r.writeScopes,a?.writeScopes,s??(c?void 0:[]));if(c&&this.scopeSweeps.set(r,o),i||=l!==a?.writeScopes,!i)continue;E===0&&(r.writeScopeRevision=readSqliteDatabaseGeneration(r,`writeScopeRevision`));let{writeScopes:u,...d}=r,f={...d,facts:new Map(r.facts),references:new Map(r.references),hostRevision:E===0?readSqliteDatabaseGeneration(r,`hostRevision`):r.hostRevision},p={...f,writeScopes:l.filter(e=>e.size>0)};this.published.set(r.identity,{metadata:f,writeScopes:l,snapshot:p})}this.revision++,se(Ve,[...this.published.values()].map(e=>e.snapshot))}}capture(e,t){let n=t?/* @__PURE__ */ new Set([...t.admissions?.map(e=>e.identity)??[],...t.location===void 0?[]:[this.forLocation(t.location)?.identity].filter(e=>e!==void 0)]):void 0;if(!n&&!e&&this.publish(),!n&&e?.revision===this.revision)return[];let r=n?[...n].flatMap(e=>{let t=this.published.get(e);return t&&!isSqliteDatabaseAdmissionRetired(t.snapshot)?[t]:[]}):[...this.published.values()];return e?(n||(e.revision=this.revision),r.flatMap(t=>{let n=e.records.get(t.metadata.generation);return n===t?[]:(e.records.set(t.metadata.generation,t),[n?{...t.metadata,facts:changedAdmissionEntries(t.metadata.facts,n.metadata.facts),writeScopes:[changedAdmissionWriteScopes(t.writeScopes,n.writeScopes)],references:changedAdmissionEntries(t.metadata.references,n.metadata.references)}:t.snapshot])})):r.map(e=>e.snapshot)}captureExchange(e,t){return t&&typeof t!=`string`&&isSqliteDatabaseAdmissionRetired(t)?[{...t,facts:/* @__PURE__ */ new Map,writeScopes:[],references:/* @__PURE__ */ new Map}]:this.capture(this.exchangeCursor,e)}resetExchangeCursor(){this.exchangeCursor=createSqliteDatabaseAdmissionCursor()}install(e){let t=/* @__PURE__ */ new Map;for(let n of e){let e=this.records.get(n.identity);if(n.descriptorOwner!==0||isSqliteDatabaseAdmissionRetired(n)){e&&isSqliteDatabaseAdmissionRetired(e)&&t.set(e,void 0);continue}let r=!1;if(e&&isSqliteDatabaseAdmissionRetired(e)&&(e=void 0),!e)e={...n,facts:new Map(n.facts),writeScopes:/* @__PURE__ */ new Map,references:new Map(n.references),hostRevision:void 0},this.records.set(n.identity,e),this.observeLocation(n.location,n.identity),r=!0;else if(e.generationId!==n.generationId)continue;!e.cleanCloseRefusal&&n.cleanCloseRefusal&&(e.cleanCloseRefusal=n.cleanCloseRefusal,r=!0);for(let[t,i]of n.facts)isSqliteDatabaseAdmissionFactCurrent(n,i)&&e.facts.get(t)?.publication!==i.publication&&(e.facts.set(t,i),r=!0);let i=t.get(e)??[];for(let t of n.writeScopes)for(let[n,a]of t){if(Atomics.load(a.state,1)!==0)continue;let t=e.writeScopes.get(n);if(!(t?.identity===a.identity||E===0&&t&&Atomics.load(t.state,1)===0)){if(E===0){let t=advanceSqliteDatabaseGeneration(e,`writeScopeRevision`);this.scopeSweeps.get(e)===t&&this.scopeSweeps.set(e,t+1|0)}retainSqliteDatabaseWriteScope(e,n,a),i.push(n),r=!0}}let a=readSqliteDatabaseGeneration(e,`writeScopeRevision`);(E===0||n.writeScopeRevision===a)&&(r||=e.writeScopeRevision!==a,e.writeScopeRevision=a);for(let[t,i]of n.references)!e.references.has(t)&&Atomics.load(new Int32Array(i),0)>=0&&(e.references.set(t,i),r=!0);E!==0&&n.hostRevision!==void 0&&n.hostRevision!==e.hostRevision&&n.hostRevision===readSqliteDatabaseGeneration(e,`hostRevision`)&&(e.hostRevision=n.hostRevision,r=!0),this.retireUnreferenced(e),(r||isSqliteDatabaseAdmissionRetired(e))&&t.set(e,i.length>0?i:void 0)}return t.size>0&&this.publish(t),t.size>0}};const U=a(Symbol.for(`openclaw.sqliteDatabaseAdmissions`),()=>({registry:new SqliteDatabaseAdmissionRegistry,descriptorPreparation:Promise.resolve(),connections:/* @__PURE__ */ new WeakMap,openedIdentities:/* @__PURE__ */ new WeakMap,unproven:/* @__PURE__ */ new WeakSet,suspended:/* @__PURE__ */ new WeakSet,local:/* @__PURE__ */ new WeakMap,rolledBack:/* @__PURE__ */ new WeakSet,dataWriters:/* @__PURE__ */ new WeakMap,localWriteRevisions:/* @__PURE__ */ new WeakMap,writeListeners:/* @__PURE__ */ new WeakMap,ddlRevisions:/* @__PURE__ */ new WeakMap,schemaDirty:/* @__PURE__ */ new WeakSet,localSchemaRevisions:/* @__PURE__ */ new Map,misses:/* @__PURE__ */ new WeakMap,exchange:new D,exchanging:!1,publication:0}));function captureSqliteDatabaseAdmissions(e,t){return U.registry.capture(e,t)}function installSqliteDatabaseAdmissions(e){U.registry.install(e)}function exchangeSqliteDatabaseAdmission(e,t,n=!1,r){let i=U.exchange.getStore();if(i&&!U.exchanging){U.exchanging=!0;try{let a=typeof e==`string`?{location:e}:{admissions:[e]},o=U.registry.captureExchange(a,e);if(n&&o.length===0)return;installSqliteDatabaseAdmissions(i(o,typeof e==`string`?e:void 0,t,r))}catch(e){throw U.registry.resetExchangeCursor(),e}finally{U.exchanging=!1}}}function withSqliteDatabaseAdmissionExchange(e,t){return U.exchange.run(e,t)}const qe=readSqliteDatabaseAdmissions(ie(Ve));qe&&(installSqliteDatabaseAdmissions(qe),U.registry.captureExchange());const Je=a(Symbol.for(`openclaw.stateDatabaseAccessError`),()=>class extends Error{constructor(...e){super(...e),this.name=`StateDatabaseAccessError`}});a(Symbol.for(`openclaw.gatewayStateOwnerContentionError`),()=>class extends Error{constructor(e,t,n,r){super(`OpenClaw state database is busy at ${e}. ${n?`${n} `:``}Wait for the other OpenClaw process to finish, then retry. If it persists, run \`openclaw gateway status\` and check for other OpenClaw processes using the same state directory. A running Gateway can hold this ownership until it stops; stop it through its service manager or original terminal before retrying.`),this.databasePath=e,this.cause=t,this.holderDetail=n,this.holder=r,this.name=`GatewayStateOwnerContentionError`}}),a(Symbol.for(`openclaw.stateDatabaseMaintenanceScopeError`),()=>class extends Je{constructor(e){super(`Internal state ownership error at ${e}: this process holds maintenance ownership without an active schema lease or maintenance scope. Retry the command; if it persists, report this error.`),this.name=`StateDatabaseMaintenanceScopeError`}});const Ye=a(Symbol.for(`openclaw.stateDatabaseAdmissionPendingError`),()=>class extends Je{constructor(e,t){super(t),this.databasePath=e}});a(Symbol.for(`openclaw.stateDatabaseOfflineMaintenanceError`),()=>class extends Je{constructor(e,t){super(t),this.databasePath=e}});const Xe=Symbol.for(`openclaw.sqliteWorkerErrorCode`);var SqliteWorkerError=class extends Error{constructor(e,t){super(e),this.code=t,this.name=`SqliteWorkerError`,Object.defineProperty(this,Xe,{value:t})}};function wrapSqliteWorkerError(e,t,...n){let r=n.filter(e=>e!==void 0).map(t=>i(t,e)).filter((e,t,n)=>n.findIndex(t=>_(t,e))===t);return Object.assign(t===void 0?Error(e):new SqliteWorkerError(e,t),{cause:r.length>1?AggregateError(r,e):r[0]})}const W=a(Symbol.for(`openclaw.sqliteDatabaseAdmissionWait`),()=>new D);function withSqliteDatabaseAdmissionWait(e,t){let n={wait:e,parent:W.getStore(),active:!0},close=()=>{n.active=!1},r=!1;try{let e=W.run(n,t);return _e(e)&&(r=!0,e.then(close,close)),e}finally{r||close()}}function readSqliteDatabaseAdmissionDeadline(){let e;for(let t=W.getStore();t;t=t.parent){if(!t.active)continue;let n=t.wait.deadlineAtMs;if(n!==void 0&&(e=Math.min(e??1/0,n)),t.wait.settlesCancellation)break}return e}function assertSqliteDatabaseAdmissionWaitActive(){try{for(let e=W.getStore();e;e=e.parent)if(e.active){if(e.wait.settlesCancellation)return;e.wait.assertActive?.()}}catch(e){throw wrapSqliteWorkerError(`SQLite admission facts exchange cancelled by its caller`,`unavailable`,e)}}function hasSqliteDatabaseAdmissionWait(){return W.getStore()!==void 0}const Ze=new m(Symbol.for(`openclaw.sqliteReaderOwners`)),Qe=a(Symbol.for(`openclaw.sqliteReaderConnections`),()=>({nextId:0,byDatabase:/* @__PURE__ */ new WeakMap,byPath:/* @__PURE__ */ new Map,finalizer:new FinalizationRegistry(e=>forgetConnection(e))}));function currentSqliteOperationTiming(){return Ze.getStore()?.timing}function forgetConnection(e){if(e.path){let t=Qe.byPath.get(e.path);t?.delete(e.id),t?.size===0&&Qe.byPath.delete(e.path)}}const $e=process.hrtime;function readSqliteWorkerMonotonicNs(){return $e.bigint()}a(Symbol.for(`openclaw.sqliteWorkerOpenRefusedError`),()=>class extends Error{constructor(e){super(`SQLite worker admission was refused before agent open`,{cause:e}),this.originalError=e,this.name=`SqliteWorkerOpenRefusedError`}}),a(Symbol.for(`openclaw.sqliteWorkerAdmissionTimeoutError`),()=>class extends Error{constructor(){super(`SQLite host admission timed out; retry after transaction rollback`),this.code=`admission-timeout`,this.name=`SqliteWorkerAdmissionTimeoutError`}});function readSqliteWorkerAdmissionDecision(e){if(!t(e)||!(e.decision instanceof SharedArrayBuffer)||e.decision.byteLength!==Int32Array.BYTES_PER_ELEMENT||e.stage!==`open`&&e.stage!==`prepare`&&e.stage!==`transaction`&&e.stage!==`commit`)return;let n=new Int32Array(e.decision),r=typeof e.deadlineMs==`number`&&Number.isFinite(e.deadlineMs)?readSqliteWorkerMonotonicNs()+BigInt(Math.max(0,Math.ceil(e.deadlineMs)))*1000000n:void 0;return{decision:n,expired:()=>{if(r!==void 0&&readSqliteWorkerMonotonicNs()>=r&&Atomics.compareExchange(n,0,0,3)===0&&Atomics.notify(n,0),Atomics.load(n,0)!==3)return!1;if(Array.isArray(e.ports))for(let t of e.ports)t instanceof C&&t.close();return!0},request:{stage:e.stage,facts:e.facts}}}var SqliteDatabaseAdmissionTimeoutError=class extends SqliteWorkerError{constructor(){super(`SQLite admission facts exchange timed out; the host did not reply`,`unavailable`)}};const et=a(Symbol.for(`openclaw.sqliteDatabaseAdmissionUpstream`),()=>({}));function bindSqliteDatabaseAdmissionUpstream(e){let t=et.connection;if(t){if(t.port!==e)throw new SqliteWorkerError(`SQLite admission upstream changed owner`,`closed`);return}let n={port:e,closed:!1};et.connection=n,e.once(`close`,()=>{n.closed=!0}),e.unref()}function getSqliteDatabaseAdmissionUpstream(){return et.connection}function isSqliteDatabaseAdmissionLocation(e){return t(e)&&typeof e.identity==`string`&&typeof e.canonicalPath==`string`}function exchangeSqliteDatabaseAdmissions(e,t,n,r,i){return exchangeDatabaseAdmissions(e,t,n,r,i)}function exchangeDatabaseAdmissions(e,t,n,r,i){let{port1:a,port2:o}=new re,s=new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)),c=currentSqliteOperationTiming(),l=Date.now(),u=readSqliteDatabaseAdmissionDeadline(),d=u===void 0?6e5:Math.max(0,u-Date.now()),f=readSqliteWorkerMonotonicNs()+BigInt(Math.ceil(d))*1000000n,remaining=()=>{assertSqliteDatabaseAdmissionWaitActive();let e=Number(f-readSqliteWorkerMonotonicNs())/1e6;if(e<=0)throw new SqliteDatabaseAdmissionTimeoutError;return e};try{for(remaining(),e.postMessage({kind:`sqlite-database-admissions`,admissions:t,location:n,create:r,observedLocation:i,deadlineAtMs:u,port:o,decision:s.buffer},[o]);Atomics.load(s,0)===0;){let e=remaining();Atomics.wait(s,0,0,hasSqliteDatabaseAdmissionWait()?Math.min(100,e):e)}remaining();let c=Atomics.load(s,0);if(c===4&&n&&r===!0)throw new Ye(n,`OpenClaw state at ${n} is undergoing schema admission; retry when it finishes.`);if(c!==1)throw new SqliteWorkerError(`SQLite admission facts exchange failed`,`unavailable`);let l=readSqliteDatabaseAdmissions(oe(a)?.message);if(!l)throw new SqliteWorkerError(`SQLite admission facts reply is unavailable`,`unavailable`);return l}finally{Atomics.compareExchange(s,0,0,2),c&&(c.databaseAdmissionWaitMs+=Date.now()-l),a.close(),o.close()}}const tt=/* @__PURE__ */ new WeakMap;function isSqliteDatabaseAdmissionMessage(e){return!(!(e.port instanceof C)||!(e.decision instanceof SharedArrayBuffer)||e.decision.byteLength!==Int32Array.BYTES_PER_ELEMENT||e.location!==void 0&&typeof e.location!=`string`||e.observedLocation!==void 0&&!isSqliteDatabaseAdmissionLocation(e.observedLocation)||e.deadlineAtMs!==void 0&&(typeof e.deadlineAtMs!=`number`||!Number.isFinite(e.deadlineAtMs))||e.create!==void 0&&typeof e.create!=`boolean`&&e.create!==`admitted`)}function createSqliteDatabaseAdmissionReplies(){let e=createSqliteDatabaseAdmissionCursor();return{release(e){tt.delete(e)},receive(t,n,r,i){if(!isSqliteDatabaseAdmissionMessage(t)){i(new SqliteWorkerError(`SQLite admission facts request is invalid`,`unavailable`));return}let a=new Int32Array(t.decision),{deadlineAtMs:o,observedLocation:s}=t,assertWaiting=()=>{if(Atomics.load(a,0)!==0||o!==void 0&&Date.now()>=o)throw new SqliteWorkerError(`SQLite admission requester stopped waiting`,`unavailable`)},c=t.port,l=t.location;return{message:t,decision:a,deadlineAtMs:o,observedLocation:s,assertWaiting,publishFacts:t=>{assertWaiting();let r=l===void 0&&t.length===0?void 0:{location:l,admissions:t},i=captureSqliteDatabaseAdmissions(tt.get(n)?.cursor??e,r);c.postMessage(i,[]),recordWorkerMessage(`admission`,`to_worker`),Atomics.compareExchange(a,0,0,1)},failFacts:(t,o)=>{if(Atomics.load(a,0)!==0)return;let s=tt.get(n);s?s.cursor=r?r(()=>s.reset()):s.reset():e=createSqliteDatabaseAdmissionCursor(),t instanceof Ye&&t.databasePath===o?Atomics.compareExchange(a,0,0,4):Atomics.compareExchange(a,0,0,2)===0&&i(t)},finishFacts:()=>{c.close(),Atomics.notify(a,0)}}}}}const nt=33554432,rt=typeof Bun==`object`?Bun:void 0;let G={heapUsed:0,external:0},K,q,J=!1;function hasIdleGarbageGrowth(){let e=process.memoryUsage();return e.heapUsed>G.heapUsed+nt||e.external>G.external+nt}async function collectWorkerIdleGarbage(){if(q=void 0,!hasIdleGarbageGrowth())return;J=!0;let e=process.memoryUsage(),t=Date.now();try{if(rt)rt.gc(!0);else{if(!K){let e=new ve;e.connect(),K=e}await K.post(`HeapProfiler.collectGarbage`)}G=process.memoryUsage();let n=Date.now()-t;if(n>=1e3){let t={elapsedMs:n,threadId:E,heapUsedBeforeBytes:e.heapUsed,heapUsedAfterBytes:G.heapUsed,externalBeforeBytes:e.external,externalAfterBytes:G.external};import(`./code-mode-node.worker-worker-idle-gc-report.runtime-BcZyNEPy.mjs`).then(({reportSlowIdleWorkerGc:e})=>e(t)).catch(e=>{process.emitWarning(e instanceof Error?e:String(e))})}}catch(e){process.emitWarning(e instanceof Error?e:String(e))}finally{J=!1}}function scheduleWorkerIdleGc(){T||q||J||hasIdleGarbageGrowth()&&(q=setTimeout(()=>{collectWorkerIdleGarbage()},1e3).unref())}function cancelWorkerIdleGc(){clearTimeout(q),q=void 0}function serveWorkerTasks(e,t={}){serveOwnedWorkerTasks(e,t)}function serveOwnedWorkerTasks(e,n={}){let r,i,a,o,s,c,runWithTaskContext=async e=>{let run=async()=>{let t=a;if(!t)return e();let n=!0;try{return await withSqliteDatabaseAdmissionExchange((e,r,i,a)=>{if(!n)throw Error(`SQLite admission facts outlived their worker task`);return exchangeSqliteDatabaseAdmissions(t,e,r,i,a)},e)}finally{n=!1}};return s?withDatabaseEngineSelection(s,run):run()};serveOwnedWorkerTasks$1(typeof e==`function`?(t,n,r)=>withSqliteDatabaseAdmissionWait({deadlineAtMs:o,assertActive:()=>r.throwIfCancelled()},()=>runWithTaskContext(async()=>{let i=await e(t,n,r),a=postgresPoolWorkerFailure();if(a)throw a;return i})):e,{...n,get retireOnError(){return n.retireOnError||postgresPoolWorkerFailure()!==void 0},closesBesideExecution:e=>{let t=decodeAgentDatabaseReaderRequest(e);return t?.kind===`revive`||t?.kind===`close`&&t.deleted},closeResource:e=>runWithTaskContext(async()=>{let t=decodeAgentDatabaseReaderRequest(e);if(!t&&!n.closeResource)throw Error(`Worker does not own retained resources`);t&&await applyAgentDatabaseReaderRequest(t),t&&t.kind!==`close`||await n.closeResource?.(e)})},{selectStartupPort(e){if(t(e)&&e.type===`openclaw.worker-task-port`){if(!(e.port instanceof C))throw Error(`Retained worker task port is invalid`);return i=e.port,i}},initialize(e){l.forceConsoleToStderr=!0,r=e},onReady(){i?.postMessage({status:`ready`},[])},onMessage(e){e&&!c&&(c=serveWorkerMemorySamples(r,n.retainedData)),cancelWorkerIdleGc()},installTaskContext(e){c?.setTaskMetrics(e.collectWorkerMetrics===!0),o=e.databaseAdmissionDeadlineAtMs,s=e.databaseEngineSelection,e.postgresPool&&bindPostgresPool(e.postgresPool),installDeletedAgentDatabaseFences(e.deletedAgentDatabaseFences),e.databaseAdmissionPort&&bindSqliteDatabaseAdmissionUpstream(e.databaseAdmissionPort),a??=e.databaseAdmissionPort},onIdle(){scheduleOpenClawCompileCacheFlush(),n.idleGc!==!1&&scheduleWorkerIdleGc()},collectTaskDiagnostics:()=>c?.collectTask(),onRetire(){cancelWorkerIdleGc();try{c?.close()}finally{a?.close()}}})}const it=[`search`,`describe`,`callValue`,`resultSave`,`resultLoad`,`resultDelete`,`nodes`,`yield`,`namespace`,`agentSpawn`,`agentWait`,`skillsList`,`skillsSearch`,`skillsRead`,`sleep`,`swarmNote`],at=String.raw`
(() => {
  const output = [];
  const pending = new Map();
  const queued = new Map();
  // Only ordinary requests use this quota. Swarm retains its group/VM bounds
  // while sharing the same ordered queue and in-flight slots.
  const maxQueuedOrdinary = ${128};
  let queuedOrdinaryCount = 0;
  let admissionError;
  const maxPending = globalThis.__openclawMaxPendingToolCalls;
  delete globalThis.__openclawMaxPendingToolCalls;
  const catalogBindings = Array.isArray(globalThis.__openclawCatalog) ? globalThis.__openclawCatalog : [];
  const apiFiles = Array.isArray(globalThis.__openclawApiFiles) ? globalThis.__openclawApiFiles : [];
  const namespaceDescriptors = Array.isArray(globalThis.__openclawNamespaces) ? globalThis.__openclawNamespaces : [];
  const hostRequest = globalThis.__openclawHostRequest;
  const hostCancelRequest = globalThis.__openclawHostCancelRequest;
  const hostTakeBridgeReply = globalThis.__openclawHostTakeBridgeReply;
  const hostObserveNetworkContent = globalThis.__openclawHostObserveNetworkContent;
  const hostOutput = globalThis.__openclawHostOutput;
  delete globalThis.__openclawHostOutput;
  delete globalThis.__openclawHostObserveNetworkContent;
  delete globalThis.__openclawHostRequest;
  delete globalThis.__openclawHostCancelRequest;
  delete globalThis.__openclawHostTakeBridgeReply;
  delete globalThis.__openclawCatalog;
  delete globalThis.__openclawApiFiles;
  delete globalThis.__openclawNamespaces;
  const bridgeSequences = new Map();
  const timers = new Map();
  // Keep rejection ownership in the snapshot so a handler attached after wait
  // can clear it; an unawaited failure must not become a successful cell.
  const unhandledRejections = new Set();
  // Rejection callbacks cross the VM boundary. Guest prototype changes must not
  // make them throw into the dependency's eager, uncapped exception formatter.
  const addUnhandledRejection = unhandledRejections.add.bind(unhandledRejections);
  const deleteUnhandledRejection = unhandledRejections.delete.bind(unhandledRejections);
  const unhandledRejectionValues = unhandledRejections.values.bind(unhandledRejections);
  const nextUnhandledRejection = Function.prototype.call.bind(unhandledRejections.values().next);
  // Maps each host-rejected bridge error to its terminal failure code. Guest
  // writes to error.code never reach the cell result; only this record does.
  const bridgeErrors = new WeakMap();
  // Guest prototype changes must not replace the operations that own error provenance.
  const rememberBridgeError = bridgeErrors.set.bind(bridgeErrors);
  const bridgeFailureCode = bridgeErrors.get.bind(bridgeErrors);
  let nextTimerId = 0;
  const GuestPromise = Promise;
  const GuestError = Error;
  const GuestTypeError = TypeError;
  const GuestRangeError = RangeError;
  const stringifyJson = JSON.stringify;
  const string = String;
  const sliceString = Function.prototype.call.bind(String.prototype.slice);
  const maxErrorUnits = Math.min(globalThis.__openclawMaxOutputBytes ?? 16_384, 16_384);
  delete globalThis.__openclawMaxOutputBytes;
  // Bridge payloads carry trusted failure codes; guest JSON replacements must not rewrite them.
  const parseJson = JSON.parse;
  function encodeError(error) {
    // Recover provenance before diagnostic getters can fail. Only bounded primitive
    // strings cross to the host; thrown arrays/objects must never be recursively dumped.
    const bridgeCode = bridgeFailureCode(error) ?? null;
    const diagnostic = (read, fallback) => {
      try {
        const value = read();
        const text = value !== null && (typeof value === "object" || typeof value === "function")
          ? "[Thrown object]" : string(value);
        return text.length <= maxErrorUnits ? text
          : sliceString(text, 0, maxErrorUnits) + " [error truncated]";
      } catch { return fallback; }
    };
    return stringifyJson({
      __proto__: null,
      bridgeCode,
      name: diagnostic(() => error?.name ?? "Error", "Error"),
      message: diagnostic(() => error?.message ?? error, "Error"),
      stack: diagnostic(() => {
        const stack = error?.stack;
        return typeof stack === "string" ? stack : "";
      }, ""),
    });
  }
  function emitOutput(entry) {
    if (hostOutput) return hostOutput(encodeFinalValue(entry));
    return output.push(entry);
  }
  const promiseOutput = "[Unawaited Promise: use await or Promise.all(...) before emitting or returning values.]";
  let networkContentObserved = false;
  function observeNetworkContent() {
    if (networkContentObserved) return;
    networkContentObserved = true;
    hostObserveNetworkContent();
  }

  
  // The counter lives in the VM snapshot. JSON code units are a conservative
  // bound (at most three UTF-8 bytes each), including empty-message overhead.
  let consoleUnits = 0;
  const consoleLimit = 16_384;
  const consoleMarker = "[console output truncated]";
  function consoleWrite(level, args) {
    if (consoleUnits >= consoleLimit) return;
    let nodes = 100;
    const seen = new Set();
    const clip = (value, limit) => {
      if (value.length <= limit) return value;
      // Do not split a surrogate pair at a diagnostic boundary.
      let end = limit;
      const last = value.charCodeAt(end - 1);
      if (last >= 0xd800 && last <= 0xdbff) end--;
      return value.slice(0, end) + "…[truncated]";
    };
    const inspect = (value, depth = 0) => {
      if (--nodes < 0) return "[truncated]";
      if (typeof value === "string") return clip(value, 512);
      if (value === null || typeof value === "boolean" || typeof value === "number") return value;
      if (typeof value === "undefined") return "undefined";
      if (typeof value === "bigint") return clip(String(value), 512) + "n";
      if (typeof value === "symbol") return clip(String(value), 512);
      if (typeof value === "function") return "[Function]";
      if (seen.has(value)) return "[Circular]";
      if (depth >= 4) return "[truncated]";
      seen.add(value);
      try {
        if (value instanceof GuestPromise) return promiseOutput;
        const array = Array.isArray(value);
        const result = array ? [] : Object.create(null);
        let count = 0;
        for (const key in value) {
          if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
          if (count++ >= 50 || nodes <= 0) {
            if (array) result.push("[truncated]");
            else result["…"] = "[truncated]";
            break;
          }
          const descriptor = Object.getOwnPropertyDescriptor(value, key);
          const item = descriptor && "value" in descriptor
            ? inspect(descriptor.value, depth + 1) : "[Accessor]";
          if (array) result.push(item);
          else result[clip(key, 512)] = item;
        }
        if (value instanceof Error) {
          const message = Object.getOwnPropertyDescriptor(value, "message");
          result.message = message && "value" in message ? inspect(message.value, depth + 1) : "[Accessor]";
        }
        return result;
      } finally {
        seen.delete(value);
      }
    };
    let message = level === "log" ? "" : "[" + level + "] ";
    for (let i = 0; i < args.length; i++) {
      if (i > 0) message += " ";
      if (nodes <= 0 || message.length >= 4096) { message += "[truncated]"; break; }
      try {
        const value = inspect(args[i]);
        message += typeof value === "string" ? value : JSON.stringify(value);
      } catch {
        message += "[Unserializable]";
      }
    }
    const entry = { type: "text", text: clip(message, 4096) };
    const units = JSON.stringify(entry).length;
    if (consoleUnits + units > consoleLimit - 100) {
      emitOutput({ type: "text", text: consoleMarker });
      consoleUnits = consoleLimit;
      return;
    }
    consoleUnits += units;
    emitOutput(entry);
  }
  const guestConsole = Object.freeze(Object.fromEntries(
    ["log", "info", "warn", "error", "debug"].map((level) => [level, (...args) => consoleWrite(level, args)]),
  ));


  function safe(value, diagnosePromises = false) {
    if (value === undefined) return null;
    try {
      return JSON.parse(JSON.stringify(diagnosePromises ? serializeOutputValue(value) : value));
    } catch {
      if (value instanceof Error) {
        return { name: value.name, message: value.message };
      }
      if (value === null) return null;
      const type = typeof value;
      if (type === "string" || type === "number" || type === "boolean") return value;
      return String(value);
    }
  }

  function asText(value) {
    if (typeof value === "string") return value;
    const encoded = JSON.stringify(safe(value, true));
    return typeof encoded === "string" ? encoded : String(value);
  }

  function assertQueueCapacity(queue) {
    if (!admissionError && !queue && pending.size >= maxPending && queuedOrdinaryCount >= maxQueuedOrdinary) {
      admissionError = "code mode bridge queue limit exceeded (" + maxQueuedOrdinary + " ordinary requests queued; " + maxPending + " in-flight slots). Await smaller batches before creating more tool calls or timers.";
    }
    // Sticky even if guest code catches the immediate error: the worker refuses
    // this entire synchronous frontier before dispatching any admitted prefix.
    if (admissionError) throw new Error(admissionError);
  }

  function beginRequest(method, args, { queue = false } = {}) {
    assertQueueCapacity(queue);
    const methodName = String(method);
    const sequence = (bridgeSequences.get(methodName) ?? 0) + 1;
    bridgeSequences.set(methodName, sequence);
    const id = "bridge:" + methodName + ":" + String(sequence);
    const argsJson = stringifyJson(args ?? []);
    // Guest toJSON/getters can create requests while serializing this input.
    assertQueueCapacity(queue);
    const callStack = new GuestError().stack;
    let callbacks;
    const promise = new Promise((resolve, reject) => { callbacks = { resolve, reject }; });
    const admit = () => {
      callbacks.stack = callStack;
      callbacks.location = hostRequest(methodName, argsJson, id, callStack);
      pending.set(id, callbacks);
    };
    if (queue || pending.size >= maxPending) {
      queued.set(id, { admit, callbacks, ordinary: !queue });
      if (!queue) queuedOrdinaryCount++;
    } else admit();
    return { id, promise };
  }

  // Admission and cancellation release capacity through the same owner.
  function takeQueuedRequest(id) {
    const entry = queued.get(id);
    if (!entry) return;
    queued.delete(id);
    if (entry.ordinary) queuedOrdinaryCount--;
    return entry;
  }

  // Refill after guest continuations run so dependent ordinary calls retain
  // first use of released slots. Waiting requests refill in insertion order.
  // Closures, copied inputs, and stable IDs live only in the bounded VM snapshot.
  function drainQueuedRequests() {
    while (queued.size > 0 && pending.size < maxPending) {
      const id = queued.keys().next().value;
      takeQueuedRequest(id).admit();
    }
  }

  function request(method, args, options) {
    return beginRequest(method, args, options).promise;
  }

  function scheduleTimer(callback, delay, args) {
    if (typeof callback !== "function") {
      throw new TypeError("setTimeout callback must be a function");
    }
    const numericDelay = Number(delay);
    const delayMs = Number.isFinite(numericDelay) ? Math.max(0, Math.floor(numericDelay)) : 0;
    const timerId = ++nextTimerId;
    const timerRequest = beginRequest("sleep", [delayMs]);
    timers.set(timerId, timerRequest.id);
    void timerRequest.promise.then(() => {
      if (!timers.delete(timerId)) return;
      callback(...args);
    });
    return timerId;
  }

  function cancelTimer(timerId) {
    const requestId = timers.get(Number(timerId));
    if (!requestId) return;
    timers.delete(Number(timerId));
    const queuedEntry = takeQueuedRequest(requestId);
    if (queuedEntry) {
      queuedEntry.callbacks.resolve(null);
      return;
    }
    hostCancelRequest(requestId);
    const entry = pending.get(requestId);
    if (!entry) return;
    pending.delete(requestId);
    entry.resolve(null);
  }


  class SwarmAgentError extends Error {
    constructor(runId, status, detail) {
      super("Swarm agent " + runId + " " + status + ": " + detail);
      this.name = "SwarmAgentError";
      this.runId = runId;
      this.status = status;
    }
  }

  function swarmNote(kind, value) {
    if (typeof value !== "string" || !value.trim()) {
      throw new TypeError(kind + " note must be a non-empty string");
    }
    void request("swarmNote", [{ kind, text: value }], { queue: true }).catch(() => {});
  }

  async function runAgent(prompt, options = {}) {
    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new TypeError("agents.run prompt must be a non-empty string");
    }
    if (options === null || typeof options !== "object" || Array.isArray(options)) {
      throw new TypeError("agents.run options must be an object");
    }
    if (options.phase !== undefined && (typeof options.phase !== "string" || !options.phase.trim())) {
      throw new TypeError("agents.run phase must be a non-empty string");
    }
    // Match the submitted contract even when callers reuse options while the child runs.
    const structured = options.schema !== undefined;
    if (options.phase !== undefined) swarmNote("phase", options.phase);
    const spawned = await request("agentSpawn", [prompt, options], { queue: true });
    const completion = await request("agentWait", [spawned.runId], { queue: true });
    if (!completion || completion.status !== "done") {
      const runId = completion?.runId ?? spawned.runId ?? "unknown";
      const status = completion?.status ?? "failed";
      const detail = [completion?.error, completion?.schemaError, completion?.result].find(
        (value) => typeof value === "string" && value.trim()
      ) || "collector returned no result";
      throw new SwarmAgentError(runId, status, detail);
    }
    return structured ? completion.structured : completion.result;
  }


  function namespaceFunction(namespaceId, path) {
    const callablePath = Object.freeze((Array.isArray(path) ? path : []).map((entry) => String(entry)));
    return (...args) => request("namespace", [namespaceId, callablePath, args]);
  }

  function deserializeNamespaceValue(namespaceId, value) {
    if (!value || typeof value !== "object") return null;
    if (value.kind === "function") {
      return namespaceFunction(namespaceId, Array.isArray(value.path) ? value.path.slice() : []);
    }
    if (value.kind === "array") {
      return Object.freeze((Array.isArray(value.items) ? value.items : []).map((item) => deserializeNamespaceValue(namespaceId, item)));
    }
    if (value.kind === "object") {
      const object = Object.create(null);
      for (const entry of Array.isArray(value.entries) ? value.entries : []) {
        const key = Array.isArray(entry) && typeof entry[0] === "string" ? entry[0] : "";
        if (!key) continue;
        const projected = deserializeNamespaceValue(namespaceId, entry[1]);
        Object.defineProperty(object, key, namespaceId === "mcp" && entry[1]?.kind === "value"
          ? { get: () => { observeNetworkContent(); return projected; }, enumerable: true }
          : { value: projected, enumerable: true });
      }
      return Object.freeze(object);
    }
    // Producers normalize these guest-owned values; a second JSON copy can OOM into safe()'s text fallback.
    return value.value;
  }

  function settle(id, ok, payload) {
    const entry = pending.get(String(id));
    if (!entry) return false;
    // Host replies are encoded JSON. Decoding failure must terminate the cell;
    // resolving raw transport text would silently change the tool result's type.
    const parsed = parseJson(payload);
    pending.delete(String(id));
    if (ok) {
      entry.resolve(parsed);
    } else {
      const error = new GuestError(typeof parsed === "string" ? parsed : parsed?.message ?? "nested tool failed");
      if (entry.stack) Object.defineProperty(error, "stack", { value: entry.stack, writable: true, configurable: true });
      if (entry.location) error.location = entry.location;
      const code = parsed && typeof parsed === "object" ? parsed.code : undefined;
      if (parsed && typeof parsed === "object") {
        error.code = code;
        error.effectStatus = "unknown";
      }
      rememberBridgeError(
        error,
        code === "invalid_input" || code === "input_contract" || code === "store_range" || code === "store_type"
          ? "invalid_input" : "internal_error",
      );
      entry.reject(error);
    }
    return true;
  }

  function settleHostReplies() {
    // Reply data comes only from the host, so guest calls cannot forge settlement or provenance.
    for (;;) {
      const reply = hostTakeBridgeReply();
      if (reply === undefined || reply === null) return;
      settle(reply.id, reply.ok === true, reply.json);
    }
  }

  function nodeHandle(descriptor) {
    const handle = Object.create(null);
    Object.defineProperties(handle, {
      id: { value: descriptor.id, enumerable: true },
      name: { value: descriptor.name, enumerable: true },
      invoke: {
        value: (command, params) => request("nodes", ["invoke", descriptor.id, command, params]),
        enumerable: true,
      },
    });
    if (typeof descriptor.listDirCommand === "string") {
      Object.defineProperty(handle, "listDir", {
        value: (path) => request("nodes", ["invoke", descriptor.id, descriptor.listDirCommand, { path }]),
        enumerable: true,
      });
    }
    return Object.freeze(handle);
  }

  const nodes = Object.freeze({
    list: () => request("nodes", ["list"]),
    get: async (idOrName) => nodeHandle(await request("nodes", ["get", idOrName])),
  });

  const skills = Object.freeze({
    list: (offset = 0) => request("skillsList", [offset]),
    search: (query, limit) => request("skillsSearch", limit === undefined ? [query] : [query, limit]),
    read: (name, relativePath) => request("skillsRead", relativePath === undefined ? [name] : [name, relativePath]),
  });

  const results = Object.freeze({
    save: (value) => request("resultSave", [value]),
    load: (id) => request("resultLoad", [id]),
    delete: (id) => request("resultDelete", [id]),
  });

  // Session operations use the existing result bridge; buffers stay with the host cell.
  async function sessionResult(method, key, value) {
    if (typeof key !== "string") throw new GuestTypeError("Code Mode store key must be a string.");
    try {
      const result = await request(method, method === "resultSave"
        ? [value, "session", key]
        : [key, "session"]);
      return method === "resultLoad" ? result.value : undefined;
    } catch (error) {
      if (!(error instanceof GuestError)) throw error;
      const Constructor = error.code === "store_range" ? GuestRangeError
        : error.code === "store_type" ? GuestTypeError : undefined;
      if (!Constructor) throw error;
      const typed = new Constructor(error.message);
      typed.code = error.code;
      typed.stack = error.stack;
      const bridgeCode = bridgeFailureCode(error);
      if (bridgeCode) rememberBridgeError(typed, bridgeCode);
      throw typed;
    }
  }

  if (globalThis.__openclawSwarmEnabled === true) {
    Object.defineProperties(globalThis, {
      agents: {
        value: Object.freeze({ run: runAgent }),
        enumerable: true,
      },
      phase: { value: (title) => swarmNote("phase", title), enumerable: true },
      log: { value: (message) => swarmNote("log", message), enumerable: true },
    });
  }

  function normalizeApiPath(value) {
    const text = String(value ?? "").trim().replace(/^\/+/, "");
    if (!text || text.split("/").some((segment) => !segment || segment === "." || segment === "..")) {
      throw new Error("invalid API file path");
    }
    return text;
  }

  const apiFileMap = new Map();
  for (const file of apiFiles) {
    if (!file || typeof file !== "object") continue;
    const path = typeof file.path === "string" ? file.path : "";
    const content = typeof file.content === "string" ? file.content : "";
    if (!path || !content) continue;
    apiFileMap.set(path, Object.freeze({
      path,
      content,
      description: typeof file.description === "string" ? file.description : undefined,
      bytes: file.bytes,
    }));
  }
  // Native declarations are generated by describe only when read, not injected
  // for every tool into every VM. Listing needs only the bounded callable metadata.
  const nativeApiFiles = new Map(catalogBindings.map(binding => [
    "tools/" + binding.callableName + ".d.ts", binding.callableName,
  ]));
  const api = Object.freeze({
    list: async (prefix = "") => {
      // list takes a directory prefix, so tolerate a trailing slash (API.list("mcp/"))
      // that read's exact-path normalizer would otherwise reject as an empty segment.
      const rawPrefix = prefix == null ? "" : String(prefix).trim().replace(/\/+$/, "");
      const normalizedPrefix = rawPrefix === "" ? "" : normalizeApiPath(rawPrefix);
      const files = [...apiFileMap.values(), ...[...nativeApiFiles.keys()].map(path => ({ path }))]
        .filter((file) => !normalizedPrefix || file.path === normalizedPrefix || file.path.startsWith(normalizedPrefix.replace(/\/?$/, "/")))
        .map((file) => Object.freeze({
          path: file.path,
          description: file.description,
          bytes: file.bytes,
        }));
      if (files.some(file => file.path.startsWith("mcp/"))) observeNetworkContent();
      return { files };
    },
    read: async (path) => {
      const normalizedPath = normalizeApiPath(path);
      const file = apiFileMap.get(normalizedPath);
      if (file) {
        if (normalizedPath.startsWith("mcp/")) observeNetworkContent();
        return file;
      }
      const callableName = nativeApiFiles.get(normalizedPath);
      if (callableName) return request("describe", [callableName, "declaration"]);
      throw new Error("Unknown API file: " + normalizedPath);
    },
  });

  const callableHandles = new Map();
  const callableMetadata = new WeakMap();
  function callableHandle(binding) {
    const callableName = typeof binding?.callableName === "string" ? binding.callableName : "";
    if (!callableName) return null;
    const existing = callableHandles.get(callableName);
    if (existing) return existing;
    const isMcp = binding.source === "mcp";
    const path = isMcp ? Object.freeze(binding.path.slice()) : undefined;
    const handle = isMcp
      ? namespaceFunction(binding.namespaceId, path)
      : (input) => request("callValue", [callableName, input]);
    const metadata = Object.freeze({
      callableName,
      toolName: typeof binding.name === "string" ? binding.name : callableName,
      label: typeof binding.label === "string" ? binding.label : undefined,
      description: typeof binding.description === "string" ? binding.description : "",
      source: binding.source,
      input: binding.input,
      output: binding.output,
      ...(isMcp ? { apiPath: binding.apiPath } : {}),
      ...(isMcp && typeof binding.instructions === "string" ? { instructions: binding.instructions } : {}),
      ...(isMcp && typeof binding.instructionsHint === "string" ? { instructionsHint: binding.instructionsHint } : {}),
    });
    for (const [key, value] of Object.entries(metadata)) {
      Object.defineProperty(handle, key, binding.source !== "openclaw"
        ? { get: () => { observeNetworkContent(); return value; }, enumerable: true }
        : { value, enumerable: true });
    }
    Object.defineProperties(handle, {
      name: { value: callableName },
      describe: {
        value: isMcp
          ? () => request("namespace", [binding.namespaceId, [path[0], "$api"], [path.slice(1).join("."), { schema: true }]])
          : (options) => request("describe", [
              callableName,
              options?.includeRarelyNeededOutputSchema === true ? "outputSchema" : undefined,
            ]),
        enumerable: true,
      },
      toJSON: { value: () => {
        if (binding.source !== "openclaw") observeNetworkContent();
        return metadata;
      } },
    });
    const frozen = Object.freeze(handle);
    callableHandles.set(callableName, frozen);
    callableMetadata.set(frozen, metadata);
    return frozen;
  }
  // Project nested catalog handles before ordinary JSON conversion drops functions.
  function serializeOutputValue(value, seen = new Map(), finalState) {
    if (value instanceof GuestPromise) return promiseOutput;
    const metadata = callableMetadata.get(value);
    if (metadata) {
      if (metadata.source !== "openclaw") observeNetworkContent();
      return finalState ? serializeOutputValue(metadata, seen, finalState) : metadata;
    }
    if (finalState) {
      if (typeof value === "function") return undefined;
      if (typeof value === "bigint") finalState.hasBigInt = true;
    }
    if (value === null || typeof value !== "object") return value;
    if (seen.has(value)) return seen.get(value);
    const proto = Object.getPrototypeOf(value);
    const isError = value instanceof Error;
    if (!finalState && !isError && !Array.isArray(value) && proto !== Object.prototype && proto !== null) return value;
    const plain = Array.isArray(value) ? new Array(value.length) : isError ? { name: value.name, message: value.message } : {};
    // Project before JSON.stringify can invoke Error.toJSON, and preserve graph
    // identity so cyclic custom fields use the ordinary bounded JSON fallback.
    seen.set(value, plain);
    if (finalState) {
      // Final conversion never invokes inherited toJSON hooks. Expanding sparse
      // arrays here keeps their allocation inside the guest's memory/time limits.
      Object.setPrototypeOf(plain, null);
      if (Array.isArray(value)) {
        for (let index = 0; index < plain.length; index++) {
          plain[index] = serializeOutputValue(value[index], seen, finalState);
        }
        return plain;
      }
      if (isError) {
        plain.name = serializeOutputValue(plain.name, seen, finalState);
        plain.message = serializeOutputValue(plain.message, seen, finalState);
      }
    }
    for (const key of Object.keys(value)) {
      if (isError && key === "toJSON") continue;
      Object.defineProperty(plain, key, {
        value: serializeOutputValue(value[key], seen, finalState), enumerable: true, configurable: true, writable: true,
      });
    }
    return plain;
  }

  function encodeFinalValue(value) {
    const state = { hasBigInt: false };
    const plain = serializeOutputValue(value, new Map(), state);
    if (typeof plain === "bigint") return stringifyJson("" + plain);
    const fallback = Array.isArray(plain) ? '"[object Array]"' : '"[object Object]"';
    // Detect BigInts before stringify can invoke a guest BigInt.toJSON hook.
    if (state.hasBigInt) return fallback;
    try {
      return stringifyJson(plain) ?? "null";
    } catch (error) {
      if (error instanceof GuestTypeError) return fallback;
      throw error;
    }
  }
  const catalog = Object.freeze({
    search: async (query, options) => {
      const matches = await request("search", [query, options]);
      return Object.freeze(matches.map((match) => {
        const handle = typeof match === "string" ? callableHandles.get(match) : callableHandle(match);
        if (!handle) throw new Error("Search result has no callable handle.");
        return handle;
      }));
    },
    all: () => Object.freeze(catalogBindings.map(binding => callableHandles.get(binding.callableName))),
  });

  const namespaceGlobals = Object.create(null);
  for (const descriptor of namespaceDescriptors) {
    const id = typeof descriptor?.id === "string" ? descriptor.id : "";
    const globalName = typeof descriptor?.globalName === "string" ? descriptor.globalName : "";
    if (!id || !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(globalName)) continue;
    const scope = deserializeNamespaceValue(id, descriptor.scope);
    Object.defineProperty(namespaceGlobals, globalName, {
      value: scope,
      enumerable: true,
    });
    const existingGlobal = Object.getOwnPropertyDescriptor(globalThis, globalName);
    if (existingGlobal && existingGlobal.configurable === false) continue;
    Object.defineProperty(globalThis, globalName, {
      value: scope,
      enumerable: true,
      configurable: true,
    });
  }

  for (const binding of catalogBindings) {
    const handle = callableHandle(binding);
    const callableName = typeof binding?.callableName === "string" ? binding.callableName : "";
    if (!handle || !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(callableName)) continue;
    Object.defineProperty(globalThis, callableName, {
      value: handle,
      enumerable: true,
      configurable: true,
    });
  }

  Object.defineProperties(globalThis, {
    API: { value: api, enumerable: true },
    catalog: { value: catalog, enumerable: true },
    nodes: { value: nodes, enumerable: true },
    namespaces: { value: Object.freeze(namespaceGlobals), enumerable: true },
    skills: { value: skills, enumerable: true },
    results: { value: results, enumerable: true },
    store: { value: (key, value) => sessionResult(value === undefined ? "resultDelete" : "resultSave", key, value), enumerable: true },
    load: { value: (key) => sessionResult("resultLoad", key), enumerable: true },
    setTimeout: { value: (callback, delay, ...args) => scheduleTimer(callback, delay, args), enumerable: true },
    clearTimeout: { value: cancelTimer, enumerable: true },
    console: { value: guestConsole, enumerable: true },
    text: { value: (value) => emitOutput({ type: "text", text: asText(value) }), enumerable: true },
    json: { value: (value) => emitOutput({ type: "json", value: safe(value, true) }), enumerable: true },
    yield_control: { value: (reason) => request("yield", [reason]), enumerable: true },
    __openclawSettleBridge: { value: settleHostReplies },
    __openclawBridgeFailureCode: { value: bridgeFailureCode },
    __openclawEncodeError: { value: encodeError },
    __openclawDrainQueuedRequests: { value: drainQueuedRequests },
    __openclawAdmissionError: { value: () => admissionError },
    // Final getters must run before the worker drains output and settles host work.
    __openclawRunCell: { value: async (run) => encodeFinalValue(await run()) },
    __openclawTakeOutputJson: { value: () => encodeFinalValue(output.splice(0)) },
    __openclawTrackRejection: {
      value: (promise, _reason, handled) => {
        if (handled) deleteUnhandledRejection(promise);
        else addUnhandledRejection(promise);
      },
    },
    __openclawUnhandledRejection: { value: () => nextUnhandledRejection(unhandledRejectionValues()).value },
  });
})();
`,ot={},st=/[\p{ASCII}]+|[^\p{ASCII}]/gu,Y=[[[183,183],[12288,12703],[19968,40869],[44032,55215],[65281,65376]],[[4352,4607],[11904,12287],[12704,19967],[40870,40959],[40960,42239],[42752,42759],[43360,43391],[55216,55295],[63744,64255]],[[711,711],[713,715],[729,729],[746,747],[773,773],[803,803],[65040,65103],[65377,65500],[65504,65510]],[[119648,119665]],[[94176,94207],[94208,101647],[110576,110591],[110592,111359],[127488,127743],[131072,195103],[196608,210047]]],ct=/* @__PURE__ */ RegExp(`[${Y.flatMap(e=>e.map(([e,t])=>`\\u{${e.toString(16)}}-\\u{${t.toString(16)}}`)).join(``)}]`,`u`),lt=/* @__PURE__ */ (()=>{let e=Math.max(...Y.flatMap(e=>e.map(([,e])=>e))),t=new Uint8Array(e+1);for(let[e,n]of Y.entries())for(let[r,i]of n)t.fill(e+1,r,i+1);return t})();function estimateStringChars(e){return estimateStringCharsWithMinimumRawWeight(e)}function estimateStringCharsWithMinimumRawWeight(e,t=ot){let n=Math.max(1,t.minimumRawWeight??1);if(n!==1&&n!==2){let t=0;for(let r of e.matchAll(st)){let e=r[0],i=Math.ceil(e.length*n);t+=e.charCodeAt(0)<=127?i:Math.max(estimateStringChars(e),i)}return t}let r=e.search(ct);if(r<0)return e.length*n;let i=0,a=0,o=0,s=0,c=0;for(let t=r;t<e.length;t+=1){let n=e.charCodeAt(t);if(!(n<128)){if(n>=55296&&n<=56319){let r=e.charCodeAt(t+1);r>=56320&&r<=57343&&(n=65536+(n-55296)*1024+r-56320,t+=1)}switch(lt[n]){case 1:i+=1;break;case 2:a+=1;break;case 3:o+=1;break;case 4:s+=1;break;case 5:c+=1}}}return e.length*n+i*(4-n)+a*(12-n)+o*(8-n)+s*(12-2*n)+c*(16-2*n)}function formatErrorMessage(t){return e(t,{redact:d})}const ut=/* @__PURE__ */ new WeakSet;var ToolInputError=class extends Error{constructor(e){super(e),this.status=400,this.name=`ToolInputError`,ut.add(this)}},CodeModeHeadlessTimeoutError=class extends Error{constructor(e=`code mode headless wall-clock timeout exceeded`){super(e),this.name=`CodeModeHeadlessTimeoutError`}};function jsonUtf8Bytes(e){try{return Buffer.byteLength(JSON.stringify(e),`utf8`)}catch{return Buffer.byteLength(String(e),`utf8`)}}function jsonUtf8BytesOrInfinity(e){try{let t=JSON.stringify(e);return typeof t==`string`?Buffer.byteLength(t,`utf8`):1/0}catch{return 1/0}}const dt=/["\\\u0000-\u001f\ud800-\udfff]/gu;function jsonStringByteLengthUpToLimit(e,t){if(e.length+2>t)return t+1;let n=Buffer.byteLength(e,`utf8`)+2;if(n>t)return t+1;for(let t of e.match(dt)??[]){let e=t.charCodeAt(0);n+=e>=55296?3:e<32&&!`\b	
\f\r`.includes(t)?5:1}return n}function boundedJsonUtf8Bytes(e,t){let n=0,r,add=e=>{if(n+=e,n>t)throw Error(`json_byte_limit_exceeded`)},visit=(e,i)=>{if(e===null){add(4);return}switch(typeof e){case`string`:add(jsonStringByteLengthUpToLimit(e,t-n));return;case`number`:add(jsonUtf8BytesOrInfinity(Number.isFinite(e)?e:null));return;case`boolean`:add(e?4:5);return;case`undefined`:case`function`:case`symbol`:i&&add(4);return;case`bigint`:throw Error(`json_byte_length_unsupported`)}let a=e;if((r??=/* @__PURE__ */ new WeakSet).has(a))throw Error(`json_byte_length_circular`);if(typeof a.toJSON==`function`&&!(a instanceof Date))throw Error(`json_byte_length_custom_to_json`);r.add(a);try{if(a instanceof Date){visit(a.toJSON(),i);return}let e=Array.isArray(a);if(add(1),e)for(let e=0;e<a.length;e+=1)e>0&&add(1),visit(a[e],!0);else{let e=!1,r=a;for(let i in r){if(!Object.prototype.propertyIsEnumerable.call(r,i))continue;let a=r[i];a!==void 0&&typeof a!=`function`&&typeof a!=`symbol`&&(e&&add(1),e=!0,add(jsonStringByteLengthUpToLimit(i,t-n)),add(1),visit(a,!1))}}add(1)}finally{r.delete(a)}};try{return visit(e,!1),{bytes:n,complete:!0}}catch{return{bytes:Math.max(n,t+1),complete:!1}}}function isContinuationByte(e){return e!==void 0&&(e&192)==128}function truncateEncodedPrefix(e,t){let n=t;for(;n>0&&isContinuationByte(e[n]);)--n;return e.subarray(0,n).toString(`utf8`)}function truncateUtf8Prefix(e,t){return t<=0?``:e.length<=t&&A.byteLength(e)<=t?e:truncateEncodedPrefix(A.from(e.slice(0,t)),t)}function truncateUtf8Suffix(e,t){if(t<=0)return``;if(e.length<=t&&A.byteLength(e)<=t)return e;let n=A.from(Number.isInteger(t)?e.slice(-t-1):e),r=n.byteLength-t;for(;r<n.byteLength&&isContinuationByte(n[r]);)r+=1;return n.subarray(r).toString(`utf8`)}function createJsonPrefixFitter(e,t,n){let r=Buffer.byteLength(e,`utf8`),i,a,o,s,c=0,l=0,u=0,d=[],f=256;return p=>{if(p<=0)return{text:``,bytes:0,jsonBytes:2,budget:{chars:2,contextChars:4}};if(r<=p&&(o??=Buffer.byteLength(a??=JSON.stringify(e),`utf8`))+n(r)<=p)return{text:e,bytes:r,jsonBytes:o,get budget(){return s??={chars:estimateStringCharsWithMinimumRawWeight(a),contextChars:estimateStringCharsWithMinimumRawWeight(a,{minimumRawWeight:2})}}};i??=Buffer.from(e.slice(0,Math.ceil(Math.min(r,t))));let m=0,h=2,g=0,_=d.length-1;for(;g<=_;){let e=g+_>>>1,t=d[e];t.end<=p&&t.jsonBytes+n(t.end)<=p?(m=t.end,h=t.jsonBytes,g=e+1):_=e-1}for(;m<i.byteLength;){let e=i[m],t=e<128?1:e<224?2:e<240?3:4,a=m+t;if(a>=r||a>p)break;let o=h+(e===34||e===92||e===8||e===9||e===10||e===12||e===13?2:e<32?6:t);if(o+n(a)>p)break;m=a,h=o,m>=f&&(d.push({end:m,jsonBytes:h}),f=m+256)}let v=i,y,b;return{get text(){return y??=v.toString(`utf8`,0,m)},bytes:m,jsonBytes:h,get budget(){if(!b){let e=Math.min(c,m),t=Math.max(c,m),n=v.toString(`utf8`,e,t),r=m>=c?1:-1;l+=r*(estimateStringCharsWithMinimumRawWeight(n)-(t-e)),u+=r*(estimateStringCharsWithMinimumRawWeight(n,{minimumRawWeight:2})-2*(t-e)),c=m,b={chars:h+l,contextChars:2*h+u}}return b}}}}a(Symbol.for(`openclaw.fullToolResultDelivery`),()=>new m(Symbol(`fullToolResultDelivery`))),new RegExp([...[`<|im_start|>`,`<|im_end|>`,`<|endoftext|>`,`<|begin_of_text|>`,`<|end_of_text|>`,`<|start_header_id|>`,`<|end_header_id|>`,`<|eot_id|>`,`<|python_tag|>`,`<|eom_id|>`,`[INST]`,`[/INST]`,`<<SYS>>`,`<</SYS>>`,`<s>`,`</s>`,`<|channel|>`,`<|message|>`,`<|return|>`,`<|call|>`,`<start_of_turn>`,`<end_of_turn>`].map(u),`<\\|reserved_special_token_\\d+\\|>`].join(`|`),`g`);const ft={65308:`<`,65310:`>`,9001:`<`,9002:`>`,12296:`<`,12297:`>`,8249:`<`,8250:`>`,10216:`<`,10217:`>`,65124:`<`,65125:`>`,171:`<`,187:`>`,12298:`<`,12299:`>`,10218:`<`,10219:`>`,10220:`<`,10221:`>`,10222:`<`,10223:`>`,10092:`<`,10093:`>`,10094:`<`,10095:`>`,706:`<`,707:`>`,8203:``,8204:``,8205:``,8288:``,65279:``,173:``};for(let e of[65313,65345])for(let t=e;t<e+26;t+=1)ft[t]=String.fromCharCode(t-65248);RegExp(`[${Object.keys(ft).map(e=>String.fromCharCode(Number(e))).join(``)}]`,`u`);function stringifyCodeModeJsonSafe(e){try{return JSON.stringify(e)??`null`}catch{if(e instanceof Error)return JSON.stringify({name:e.name,message:e.message});switch(typeof e){case`number`:return JSON.stringify(e);case`bigint`:case`symbol`:case`function`:return JSON.stringify(String(e));default:return JSON.stringify(Object.prototype.toString.call(e))}}}const X={count:0,source:{kind:`complete`,json:`[]`}};function retainSource(e,t,n){return t<=n?{kind:`complete`,json:e}:{kind:`prefix`,json:truncateUtf8Prefix(e,n),originalBytes:t}}function captureCodeModeValue(e,t,n=t){let r=stringifyCodeModeJsonSafe(e),i=r.startsWith(`{`)||r.startsWith(`[`)?Math.max(t,n):t;return retainSource(r,Buffer.byteLength(r,`utf8`),i)}function createErrorFitter(e,t){let n=createJsonPrefixFitter(e,t,()=>18);return e=>{let t=n(e);return{text(){return`${t.text} [error truncated]`},budget(){return{chars:t.budget.chars+18,contextChars:t.budget.contextChars+36}},jsonBytes:t.jsonBytes+18}}}function boundCodeModeError(e,t){return jsonUtf8Bytes(e)<=t?e:createErrorFitter(e,t)(t).text()}var CodeModeNodeProgress=class{constructor(e){this.buffer=typeof e==`number`?new SharedArrayBuffer(64+e):e,this.state=new Int32Array(this.buffer,0,2),this.headers=new DataView(this.buffer),this.bytes=Buffer.from(this.buffer,64)}get deadline(){return this.headers.getFloat64(56)}set deadline(e){this.headers.setFloat64(56,e)}get networkContentObserved(){return Atomics.load(this.state,1)===1}observeNetworkContent(){Atomics.store(this.state,1,1)}append(e){let t=Atomics.load(this.state,0),[n,r,i]=this.header(t),a=(n===0?`[`:`,`)+e,o=r+Buffer.byteLength(a),s=r===i?this.bytes.write(a,i):0,c=8+(1-t)*24;return this.headers.setFloat64(c,n+1),this.headers.setFloat64(c+8,o),this.headers.setFloat64(c+16,i+s),Atomics.store(this.state,0,1-t),n+1}resetOutput(){let e=1-Atomics.load(this.state,0);for(let t=0;t<3;t++)this.headers.setFloat64(8+e*24+t*8,0);Atomics.store(this.state,0,e)}output(){let[e,t,n]=this.header(Atomics.load(this.state,0)),r=e===0?`[]`:this.bytes.toString(`utf8`,0,n);return{count:e,source:e===0||t+1<=this.bytes.length?{kind:`complete`,json:e===0?r:r+`]`}:{kind:`prefix`,json:r,originalBytes:t+1}}}header(e){let t=8+e*24;return[this.headers.getFloat64(t),this.headers.getFloat64(t+8),this.headers.getFloat64(t+16)]}};const pt=`openclaw-code-mode:user.js`;function sourceExtent(e,t){let n=1,r=0;for(let t of e.matchAll(/\r\n|[\r\n\u2028\u2029]/gu))n+=1,r=t.index+t[0].length;let i=e.slice(r);return{lines:n,lastColumn:(t===`utf8`?Buffer.byteLength(i,`utf8`):i.length)+1}}function normalizeSourceStack(e,t){return!e||!t?e:e.replace(/^[^\S\r\n]+at [^\r\n]*openclaw-code-mode:(?:user|controller)\.js:\d+:\d+\)?(?:\r?\n|$)/gmu,e=>{let n=/openclaw-code-mode:user\.js:(\d+):(\d+)(?=\)?(?:\r?\n)?$)/u.exec(e);if(!n)return``;let r=Number(n[1])-t.lineOffset,i=Number(n[2]),a=i-(r===1?t.columnOffset:0);return r<1||r>t.lineCount||a<1||r===t.lineCount&&i>t.endColumn?``:e.replace(n[0],t.file+`:`+r+`:`+a)})}function buildUserSource(e,t=``,n=`utf8`){let r=`globalThis.__openclawResult = __openclawRunCell(async () => {\n${t}`,i=sourceExtent(r,n),a=sourceExtent(e,n),o=i.lastColumn-1;return{source:`${r}${e}\n})`,location:{file:pt,lineOffset:i.lines-1,lineCount:a.lines,columnOffset:o,endColumn:a.lastColumn+(a.lines===1?o:0)}}}function buildCodeModeScriptParseSource(e){return{source:`(async () => {
${e}\n})`,codeOffset:15}}function parseCodeModeScriptSyntax(e){let{source:t}=buildCodeModeScriptParseSource(e);try{return{ok:!0,program:ye(t,{ecmaVersion:`latest`})}}catch(e){let t=e;return{ok:!1,message:t.message.replace(/ \(\d+:\d+\)$/u,``),line:t.loc.line-1,column:t.loc.column}}}const mt=/^export\s+(?:(?:abstract|as|async|class|const|declare|default|enum|function|import|interface|let|namespace|type|var)\b|[={*])/u,ht=/^(?:abstract|as|async|await|break|case|catch|class|const|continue|debugger|declare|default|delete|do|else|enum|export|extends|false|finally|for|function|if|implements|import|in|instanceof|interface|let|namespace|new|null|of|private|protected|public|return|satisfies|static|super|switch|this|throw|true|try|typeof|undefined|var|void|while|with|yield)$/u,gt=/^(?:API|MCP|AggregateError|Array|ArrayBuffer|BigInt|BigInt64Array|BigUint64Array|Boolean|DataView|Date|Error|EvalError|Float32Array|Float64Array|Function|Infinity|Int16Array|Int32Array|Int8Array|Intl|JSON|Map|Math|NaN|Number|Object|Promise|Proxy|RangeError|ReferenceError|Reflect|RegExp|Set|String|Symbol|SyntaxError|TypeError|URIError|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|WeakMap|WeakSet|catalog|clearTimeout|console|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|globalThis|isFinite|isNaN|json|nodes|parseFloat|parseInt|setTimeout|skills|text|yield_control)$/u,_t=/^(?:\/(?:usr\/(?:local\/)?)?bin\/)?(alias|apt|awk|bash|bg|brew|builtin|bun|cargo|cat|cd|chmod|cmd|command|cp|curl|cut|date|declare|df|dir|docker|dotnet|du|echo|env|exec|exit|export|fg|file|find|getopts|git|go|gradle|grep|hash|head|help|hostname|id|java|javac|jobs|jq|kill|kubectl|ln|local|logout|ls|make|mkdir|mvn|mv|node|npm|npx|perl|php|pip|pip3|pnpm|poetry|popd|powershell|printf|ps|pushd|pwd|pwsh|pytest|python|python3|read|readonly|rg|rm|ruby|rustc|rustup|sed|set|sh|shift|sleep|sort|source|stat|sudo|swift|systemctl|tail|tar|tee|test|touch|trap|tree|type|ulimit|umask|uname|uniq|unset|unzip|uv|uvx|vitest|wait|wc|wget|which|whoami|xargs|yarn|zip|zsh)(?=$|[\s;&|<>])/u,vt=/^([A-Za-z_][\w-]*)(?=$|[\s;&|<>])/u,yt=/^(?:(?:\.{1,2}|~)[\\/]|\/|[A-Za-z]:[\\/])[^\s;|&()]+(?=$|[\t \r\n;&|])/u,bt=/^(?:-{1,2}[a-z\d][\w-]*(?:[\t =;&|]|$)|(?:(?:\.{1,2}|~)[\\/]|\/|[A-Za-z]:[\\/])[^\s]+)/iu,xt=/^(?:(?:if|elif|while|until)[\t ]+(?:\[{1,2}(?=[\t ]|$)|test\b|[A-Za-z_][\w-]*(?=[\t ;]))|for[\t ]+(?:[A-Za-z_]\w*[\t ]+in\b|\(\([^\r\n]*\)\)[\t ]*;[\t ]*do\b)|case[\t ]+\S+[\t ]+in\b|function[\t ]+[A-Za-z_][\w-]*[\t ]*\{)/u,St=/^(?:\d*(?:>>?|<<?)|&>>?)/u,Ct=/^(?:(?:\/\/[^\r\n]*(?:\r?\n|$)|\/\*[\s\S]*?\*\/|#[^\r\n]*(?:\r?\n|$))[\t \r\n]*)+/u;function stripShellEnvAssignments(e){let t=/[A-Za-z_]\w*=/uy;if(!t.test(e))return e;let n=new Uint32Array(e.length+3),r=new Uint32Array(e.length+3),i=new Uint32Array(e.length+3),a=0,o=0;for(let s=e.length-1;s>=t.lastIndex;--s){let t=e[s],c=t===` `||t===`	`,l=/\s/u.test(t),u=c?a||o:t===`
`?a:t===`\r`&&e[s+1]===`
`?o:0;c||(a=l?0:s,o=u);let d=t===`\\`&&s+1<e.length&&!/[\r\n\u2028\u2029]/u.test(e[s+1]),f=s+(d&&e.codePointAt(s+1)>65535?3:2);r[s]=(d?r[f]:0)||(t===`"`?n[s+1]:r[s+1]),i[s]=t===`'`?n[s+1]:i[s+1],n[s]=(t===`"`?r[s+1]:0)||(t===`'`?i[s+1]:0)||(d?n[f]:0)||(!l&&t!==`;`&&t!==`&`&&t!==`|`?n[s+1]:0)||u}let s=0;do{let e=n[t.lastIndex];if(!e)break;s=e,t.lastIndex=e}while(t.test(e));return e.slice(s)}function isShellLikeCodeModeSource(e,t){let n=e.trim();if(n.startsWith(`#!`))return!0;let r=n.replace(Ct,``);if(!r||mt.test(r))return!1;if(xt.test(r))return!0;let i=stripShellEnvAssignments(r),a=_t.exec(i),o=vt.exec(i),s=a??(o&&!ht.test(o[1]??``)&&!gt.test(o[1]??``)?o:null);if(!s&&!yt.test(i))return!1;let c=s?i.slice(s[0].length):``,l=c.trimStart();if(s&&!l)return a!==null;if(!t)return!0;let u=s?.[1];return u&&!parseCodeModeScriptSyntax(`let ${u};\n${e}`).ok&&parseCodeModeScriptSyntax(`var ${u};\n${e}`).ok?!1:/^[\t ]*(?:[;\r\n]|&&?|\|{1,2})/u.test(c)?a!==null:!(!s||!bt.test(l)&&!(a!==null&&St.test(l))&&!(u===`jq`&&l.startsWith(`.`)))}function isModuleLoaderCallee(e){if(e.type===`ParenthesizedExpression`||e.type===`ChainExpression`)return isModuleLoaderCallee(e.expression);if(e.type===`SequenceExpression`){let t=e.expressions[e.expressions.length-1];return t!==void 0&&isModuleLoaderCallee(t)}return e.type===`Identifier`&&e.name===`require`}function containsModuleAccess(e){if(e.type===`ImportExpression`||e.type===`CallExpression`&&isModuleLoaderCallee(e.callee))return!0;for(let t of Object.values(e))for(let e of Array.isArray(t)?t:[t])if(typeof e==`object`&&e&&`type`in e&&typeof e.type==`string`&&containsModuleAccess(e))return!0;return!1}const wt=`code mode module access is disabled. Call an enabled async tool global from guest JavaScript; use catalog.search(query) when the bounded quick index omits it. Do not retry the same source with require() or an import.`;function prepareSource(e){let t=parseCodeModeScriptSyntax(e);if(isShellLikeCodeModeSource(e,t.ok))throw new ToolInputError(`code-mode exec runs JavaScript, not shell commands. Call an enabled async tool global from guest JavaScript; use catalog.search(query) when the bounded quick index omits it. Do not retry the same shell command as code.`);if(!t.ok){let e=s(t.message,240);throw new ToolInputError(`SyntaxError at openclaw-code-mode:user.js:${t.line}:${t.column+1}: ${e}. No tools were dispatched; correct the JavaScript source and submit it again.`)}if((e.includes(`import`)||e.includes(`require`)||e.includes(`\\u`))&&containsModuleAccess(t.program))throw new ToolInputError(wt);return e}let Z;process.on(`unhandledRejection`,(e,t)=>Z?.rejections.set(t,e)),process.on(`rejectionHandled`,e=>Z?.rejections.delete(e));let Tt=performance.now(),Et=0,Dt=Tt,Q=0,Ot=0,kt=-1/0,At=0,$;observeGcSamples(e=>{for(let t of e)t.kind===`mark_sweep_compact`&&(Et++,Q++);let t=performance.now(),n=t-Dt;if(n>=1e4){let e=Q>n/100;if(Ot=e?Math.min(2,Ot+1):0,Ot===2&&$&&publishWorkerGcStorm({retireWorkerId:$}),e&&t-kt>=6e4){let{heapUsed:e,heapTotal:r,external:i,arrayBuffers:a}=process.memoryUsage();publishWorkerGcStorm({workerId:$,...Z?.gcAttribution,cellCount:At,activeCellCount:+!!Z,bridgeMethods:[...new Set(Z?.pendingRequests.map(e=>e.method)??[])],majorCollections:Q,intervalMs:n,heapUsed:e,heapTotal:r,external:i,arrayBuffers:a,heapSizeLimitBytes:x().heap_size_limit}),kt=t}Dt=t,Q=0}let r=t-Tt;if(!(r<1e3)){if(Et>=r/50){let e=x();if(e.used_heap_size>=e.heap_size_limit*.85)throw Object.assign(/* @__PURE__ */ Error(`Code Mode worker stopped after sustained garbage collection near its JavaScript heap limit`),{code:`ERR_CODE_MODE_GC_THRASH`})}Tt=t,Et=0}});const jt=new Set(it);function isBridgeMethod(e){return jt.has(e)}function rejectModuleImport(){throw Z&&(Z.moduleImportRejected=!0),Error(wt)}function compileController(e){return new te(e,{filename:`openclaw-code-mode:controller.js`,importModuleDynamically:rejectModuleImport})}const Mt=compileController(String.raw`
    (() => {
      // Keep native encoding prototypes private when this worker is reused.
      const Encoder = globalThis.__openclawNodeTextEncoder;
      const Decoder = globalThis.__openclawNodeTextDecoder;
      const Bytes = Uint8Array;
      delete globalThis.__openclawNodeTextEncoder;
      delete globalThis.__openclawNodeTextDecoder;
      Object.defineProperties(globalThis, {
        TextEncoder: { value: class TextEncoder {
          #encoder = new Encoder();
          get encoding() { return this.#encoder.encoding; }
          encode(input) { return new Bytes(this.#encoder.encode(input)); }
          encodeInto(input, destination) {
            const { read, written } = this.#encoder.encodeInto(input, destination);
            return { read, written };
          }
        }, enumerable: true },
        TextDecoder: { value: class TextDecoder {
          #decoder;
          constructor(label, options) { this.#decoder = new Decoder(label, options); }
          get encoding() { return this.#decoder.encoding; }
          get fatal() { return this.#decoder.fatal; }
          get ignoreBOM() { return this.#decoder.ignoreBOM; }
          decode(input, options) { return this.#decoder.decode(input, options); }
        }, enumerable: true },
      });
    })();

    Object.assign(globalThis, JSON.parse(__openclawNodeInit));
    delete globalThis.__openclawNodeInit;
    globalThis.__openclawMaxPendingToolCalls = __openclawNodeMaxPending;
    delete globalThis.__openclawNodeMaxPending;
    ${at}

    (() => {
      const finish = globalThis.__openclawNodeFinish;
      delete globalThis.__openclawNodeFinish;
      Object.defineProperties(globalThis, {
        __openclawNodeObserveResult: { value: (result) => {
          result.then(value => finish(true, value), error => finish(false, __openclawEncodeError(error)));
        }},
      });
    })();
  `),Nt=compileController(`__openclawSettleBridge()`),Pt=compileController(`(() => {
    const error = __openclawAdmissionError();
    if (!error) __openclawDrainQueuedRequests();
    return error;
  })()`),Ft=compileController(`__openclawNodeObserveResult(__openclawResult)`),It=compileController(`(() => {
    const error = __openclawNodeRejection;
    delete globalThis.__openclawNodeRejection;
    return __openclawEncodeError(error);
  })()`);function evaluate(e,t){if(e.deadline-performance.now()<=0)throw new CodeModeHeadlessTimeoutError;return t.runInContext(e.context)}function sourceFrames(e,t){return normalizeSourceStack(e,t)?.split(`
`).filter(e=>e.includes(`openclaw-code-mode:user.js`)&&/^\s+at /u.test(e))??[]}function createCell(e,t,n,r,i){let a=performance.now(),o=Math.min(n+e.config.timeoutMs,a+(e.executionTimeoutMs??1/0));if(o<=a)throw new CodeModeHeadlessTimeoutError;let s=buildUserSource(t,e.prelude,`utf16`),c=ne(Object.create(null),{microtaskMode:`afterEvaluate`,importModuleDynamically:rejectModuleImport});At++;let l={context:c,gcAttribution:e.gcAttribution,config:e.config,location:s.location,pendingRequests:[],canceledRequestIds:[],replyIndex:0,rejections:/* @__PURE__ */ new Map,deadline:o,progress:r};return Z=l,c.__openclawNodeTextEncoder=TextEncoder,c.__openclawNodeTextDecoder=TextDecoder,c.__openclawHostRequest=(e,t,n,r)=>{if(l.pendingRequests.length>=l.config.maxPendingToolCalls)throw l.admissionError=`too many pending code mode tool calls`,Error(l.admissionError);if(!isBridgeMethod(e))throw Error(`unsupported code mode bridge method`);let i=JSON.parse(t);if(!Array.isArray(i))throw Error(`invalid code mode bridge arguments: expected an array`);if(!n.startsWith(`bridge:${e}:`)||!/^bridge:[A-Za-z]+:[1-9]\d*$/u.test(n))throw Error(`invalid code mode bridge id`);if(l.pendingRequests.some(e=>e.id===n))throw Error(`duplicate code mode bridge id`);return l.pendingRequests.push({id:n,method:e,args:i}),sourceFrames(typeof r==`string`?r.slice(0,8192):``,l.location).join(`
`)},c.__openclawHostCancelRequest=e=>{let t=l.pendingRequests.findIndex(t=>t.id===e);t>=0&&(l.pendingRequests.splice(t,1),l.canceledRequestIds.push(e))},c.__openclawHostTakeBridgeReply=()=>{let e=l.replies?.[l.replyIndex];if(!e)return;l.replyIndex++;let t={__proto__:null,id:e.id,ok:e.ok,json:e.json};return e.json=``,t},c.__openclawHostObserveNetworkContent=()=>{l.networkContentObserved=!0,l.progress.observeNetworkContent()},c.__openclawHostOutput=e=>l.progress.append(e),c.__openclawNodeInit=new TextDecoder().decode(e.initialization),c.__openclawNodeMaxPending=e.config.maxPendingToolCalls,c.__openclawMaxOutputBytes=e.config.maxOutputBytes,c.__openclawNodeFinish=(e,t)=>{l.outcome={ok:e,json:t}},r.deadline=performance.timeOrigin+o,i?.(),evaluate(l,Mt),evaluate(l,new te(s.source,{filename:pt,importModuleDynamically:rejectModuleImport})),evaluate(l,Ft),l}function settle(e,t){e.replies=t,e.replyIndex=0;try{evaluate(e,Nt)}finally{e.replies=void 0,e.replyIndex=0;for(let e of t)e.json=``;t.length=0}}function formatGuestFailure(e,t){let n=JSON.parse(t);return n.bridgeCode===null&&n.name===`ReferenceError`&&/^(?:require|module|process) is not defined$/u.test(n.message)?{code:`invalid_input`,error:wt}:{code:n.bridgeCode??`internal_error`,...n.bridgeCode===null?{}:{failurePhase:`bridge`},error:[`${n.name}: ${n.message}`,...sourceFrames(n.stack,e.location)].join(`
`)}}function failed(e,t,n=X,r){return{status:`failed`,code:e,error:t,output:n,failurePhase:r??(e===`invalid_input`?`input`:`guest`),bridgeDispatchStarted:!1}}async function run(e,t){let n=X,r=t?.consumeInput,consume=()=>{let e=r;r=void 0,e?.()},i=e.config;$=e.gcAttribution?.workerId;let a=performance.now(),o=new CodeModeNodeProgress(e.progress);try{let s=e.kind===`exec`?createCell(e,prepareSource(e.source),a,o,consume):Z;if(!s)throw Error(`code mode continuation is no longer available`);for(e.kind===`resume`&&(s.progress=o,s.config=i,s.deadline=performance.now()+i.timeoutMs,o.deadline=performance.timeOrigin+s.deadline,s.networkContentObserved&&o.observeNetworkContent(),s.pendingRequests=e.pendingRequests??[],s.canceledRequestIds=[],settle(s,e.settledRequests));;){consume();let a=s.admissionError??evaluate(s,Pt);if(a!==void 0&&typeof a!=`string`)throw Error(`invalid code mode admission error`);if(a)throw new ToolInputError(a);if(await g(),s.moduleImportRejected){s.moduleImportRejected=!1;continue}n=o.output();let c=!s.outcome;if(c&&s.pendingRequests.length===0)throw new ToolInputError(`code mode promise is pending without host work`);if(c||s.outcome?.ok&&s.pendingRequests.length>0){let a=c?{kind:`awaiting`}:{kind:`draining`,requiredRequestIds:s.pendingRequests.map(e=>e.id)},o={pendingRequests:s.pendingRequests,canceledRequestIds:s.canceledRequestIds,settlementMode:a,output:n,memoryUsedBytes:x().used_heap_size,...s.networkContentObserved?{networkContentObserved:!0}:{}};if(!t||!e.inlineHost)return{status:`waiting`,...o,continuation:void 0};let l=await t.request({status:`boundary`,...o});n=X,r=l.consumed;let u=l.input;if(u.kind===`checkpoint`)return consume(),{status:`waiting`,...o,continuation:void 0,output:X};if(u.kind!==`continue`)throw Error(`invalid code mode continuation`);if(!Number.isFinite(u.timeoutMs)||u.timeoutMs<=0||u.timeoutMs>i.timeoutMs)throw Error(`invalid code mode continuation timeout`);s.deadline=performance.now()+u.timeoutMs,s.pendingRequests=u.pendingRequests,s.canceledRequestIds=[],settle(s,u.settledRequests);continue}let l=s.outcome,u=l.ok?void 0:l.json;if(l.ok&&s.rejections.size>0&&(s.context.__openclawNodeRejection=s.rejections.values().next().value,u=String(evaluate(s,It))),u!==void 0){let e=formatGuestFailure(s,u);return t?.notify({status:`failure`,error:JSON.parse(u),failurePhase:e.failurePhase??`guest`}),failed(e.code,boundCodeModeError(e.error,i.maxOutputBytes),n,e.failurePhase)}return{status:`completed`,output:n,value:captureCodeModeValue(JSON.parse(l.json),i.maxOutputBytes,e.retainFinalValue?Math.min(i.memoryLimitBytes,i.maxSnapshotBytes):i.maxOutputBytes)}}}catch(e){let r=e instanceof CodeModeHeadlessTimeoutError,a=e instanceof ToolInputError?`input`:r&&o.deadline?`guest`:`host`;return t?.notify({status:`failure`,error:v.isNativeError(e)?{name:e.name,message:e.message,stack:e.stack}:String(e),failurePhase:a}),Z&&n.count===0&&!r&&(n=o.output()),failed(r?`timeout`:e instanceof ToolInputError?`invalid_input`:`internal_error`,boundCodeModeError(r?`code mode timeout exceeded`:v.isNativeError(e)?e.message:String(e),i.maxOutputBytes),r?o.output():n,a)}finally{consume()}}serveWorkerTasks(async(e,t)=>{let n=await run(e,t);return Z?.networkContentObserved&&(n.networkContentObserved=!0),n.status!==`waiting`&&(Z=void 0),n},{idleGc:!1});export{recordPostgresPoolSelfRoot as $,retainSqliteDatabaseWriteScope as A,materializeErrorStack as B,pruneSqliteDatabaseWriteScopes as C,readSqliteDatabaseAdmissions as D,readSqliteDatabaseAdmissionIdentity as E,closePostgresPool as F,releaseWorkerNativeSectionsOnExit as G,areWorkerNativeSectionsSettled as H,B as I,createCpuTrackedWorker as J,waitForWorkerNativeSections as K,getDatabaseEngineSelection as L,inspectDatabasePathIdentity as M,readDatabaseIdentityBirthtime as N,readSqliteDatabaseFactRevision as O,Ve as P,receiveWorkerMemoryPort as Q,captureDeletedAgentDatabaseFences as R,isSqliteDatabaseAdmissionRetired as S,readSqliteDatabaseAdmissionFact as T,cancelWorkerNativeSections as U,resolveSafeNodeCompileCacheDirectory as V,createWorkerNativeSectionState as W,isWorkerGcObservationEnabled as X,flushWorkerDiagnostics as Y,markWorkerRetirement as Z,admitSqliteDatabaseFactValue as _,exchangeDatabaseAdmissions as a,classifyWorkerRequest as at,hasSqliteDatabaseSchemaAdmission as b,readSqliteDatabaseAdmissionDeadline as c,flatMapRetainedOperation as ct,Ye as d,trackNativeWorkerForCpu as et,captureSqliteDatabaseAdmissions as f,V as g,U as h,createSqliteDatabaseAdmissionReplies as i,workerMessagePayloadBytes as it,assertDatabaseFileIdentity as j,readSqliteDatabaseGeneration as k,withSqliteDatabaseAdmissionWait as l,installSqliteDatabaseAdmissions as m,boundedJsonUtf8Bytes as n,recordWorkerAuthorityMessage as nt,getSqliteDatabaseAdmissionUpstream as o,normalizeWorkerRequestClass as ot,exchangeSqliteDatabaseAdmission as p,attributeWorkerToPool as q,formatErrorMessage as r,recordWorkerMessage as rt,readSqliteWorkerAdmissionDecision as s,createRetainedOperation as st,truncateUtf8Suffix as t,observeWorkerMessage as tt,SqliteWorkerError as u,advanceSqliteDatabaseGeneration as v,publishSqliteDatabaseFact as w,isSqliteDatabaseAdmissionFactCurrent as x,createSqliteDatabaseAdmissionCursor as y,collectSynchronousErrors as z};