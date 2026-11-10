import*as e from"node:module";import{createRequire as t}from"node:module";import{setImmediate as n}from"node:timers/promises";import{formatWithOptions as r,getSystemErrorName as i,toUSVString as a,types as o}from"node:util";import{getHeapStatistics as s}from"node:v8";import{Script as c,createContext as l}from"node:vm";import{PerformanceObserver as u,constants as d,performance as f}from"node:perf_hooks";import{MessageChannel as p,MessagePort as m,getEnvironmentData as h,isMainThread as g,parentPort as v,receiveMessageOnPort as y,setEnvironmentData as b,threadId as x,workerData as ee}from"node:worker_threads";import{AsyncLocalStorage as S,AsyncResource as te}from"node:async_hooks";import{createHash as ne,randomUUID as re}from"node:crypto";import C,{closeSync as ie,fstatSync as ae,openSync as oe,readSync as se,readdirSync as ce,default as le}from"node:fs";import ue from"node:fs/promises";import de,{platform as fe}from"node:os";import w,{basename as pe}from"node:path";import{URL as me,fileURLToPath as he}from"node:url";import ge from"node:process";import{Buffer as _e,isUtf8 as ve}from"node:buffer";import{channel as ye}from"node:diagnostics_channel";import be from"node:tty";import{Session as xe}from"node:inspector/promises";var __esmMin=(e,t,n)=>()=>{if(n)throw n[0];try{return e&&(t=e(e=0)),t}catch(e){throw n=[e],e}};function isRecord(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function asOptionalRecord(e){return isRecord(e)?e:void 0}function asNullableRecord(e){return isRecord(e)?e:null}function observeGcSamples(e){if(!u.supportedEntryTypes.includes(`gc`))return;let t=f.now(),n=!0,r=new u(r=>{if(!n)return;let i=[];for(let e of r.getEntries()){let n=Se[e.detail.kind];n&&e.startTime>=t&&i.push({kind:n,durationMs:e.duration})}i.length&&e(i)});return r.observe({entryTypes:[`gc`]}),()=>{n=!1,r.disconnect()}}var Se;function init_gc_observer(){return(init_gc_observer=__esmMin((()=>{Se={[d.NODE_PERFORMANCE_GC_MINOR]:`scavenge`,[d.NODE_PERFORMANCE_GC_MAJOR]:`mark_sweep_compact`,[d.NODE_PERFORMANCE_GC_INCREMENTAL]:`incremental`,[d.NODE_PERFORMANCE_GC_WEAKCB]:`weak_processing`}})))()}function resolveGlobalSingletonResetRegistry(){let e=globalThis,t=e[Ce];if(t instanceof Map)return t;let n=/* @__PURE__ */ new Map;return e[Ce]=n,n}function resolveGlobalSingleton(e,t,n,r=`close-and-restart`){let i=globalThis,a;return Object.hasOwn(i,e)?a=i[e]:(a=t(),i[e]=a),n&&resolveGlobalSingletonResetRegistry().set(e,{lifecycle:r,reset:()=>n(a)}),a}function resolveGlobalSet(e,t){return resolveGlobalSingleton(e,()=>/* @__PURE__ */ new Set,e=>e.clear(),t)}var Ce;function init_global_singleton(){return(init_global_singleton=__esmMin((()=>{Ce=Symbol.for(`openclaw.globalSingletonLifecycleResets`)})))()}var we;function init_detached_async_context(){return(init_detached_async_context=__esmMin((()=>{init_global_singleton(),we=typeof process>`u`?void 0:process.getBuiltinModule(`node:async_hooks`),we&&resolveGlobalSingleton(Symbol.for(`openclaw.detachedAsyncContext`),()=>new we.AsyncResource(`openclaw.detached-async-context`))})))()}function assertWorkerTaskActive(e,t){if(!t()||(e&Te)!==0)throw Error(`worker task cancelled`)}function acquireWorkerNativeSection(e,t){for(;;){let n=Atomics.load(e,0);if(assertWorkerTaskActive(n,t),Atomics.compareExchange(e,0,n,n+Ee)===n)break}let n=!1;return()=>{n||(n=!0,Atomics.sub(e,0,Ee),Atomics.notify(e,0))}}function withWorkerTaskNativeSectionScope(e,t,n){return ke.run(()=>acquireWorkerNativeSection(e,t),n)}function observeWorkerTaskCancellation(e,t,n){let r=!0,i=(async()=>{for(;;){if(!r||!t())return;let i=Atomics.load(e,0);if((i&Te)!==0){n();return}await Atomics.waitAsync(e,0,i).value}})();return()=>(r=!1,Atomics.notify(e,0),i)}function createWorkerTaskControl(e,t){let throwIfCancelled=()=>assertWorkerTaskActive(Atomics.load(e,0),t);return{throwIfCancelled,runNativeSection:async n=>{let r=acquireWorkerNativeSection(e,t),i;try{i=await n()}finally{r()}return throwIfCancelled(),i}}}var Te,Ee,De,Oe,ke;function init_worker_task_native_sections(){return(init_worker_task_native_sections=__esmMin((()=>{Te=1,Ee=2,De=Symbol.for(`openclaw.workerTaskNativeSection`),Oe=globalThis,ke=Oe[De]??=new S})))()}function serveOwnedWorkerTasks$1(e,t,n){if(!v)return;let r=v,i=r,a=!1,o=!1;n.initialize(i);let s,c=Promise.resolve(),l=Promise.resolve(),u;i.on(`message`,function receive(d){if(o){d.resourcePort?.close();return}if(!a){a=!0;let e=n.selectStartupPort?.(d);if(e){i.off(`message`,receive),i=e,n.initialize(i),i.on(`message`,receive),n.onReady?.();return}}if(n.onMessage(d.sampleMemory===!0),d.closeResource&&d.resourcePort){let e=d.resourcePort,r=c;l=l.then(()=>r).then(async()=>{if(o)throw Error(`Worker is retiring after a terminal task failure`);if(!t.closeResource)throw Error(`Worker does not own retained resources`);await t.closeResource(d.key),e.postMessage({ok:!0},[])}).catch(n=>{e.postMessage({ok:!1,error:n instanceof Error?n.message:String(n),detail:t.encodeResourceError?.(n)},[])}).finally(()=>{e.close(),!s&&!o&&n.onIdle()});return}if(d.responseId!==void 0){if(d.taskId===u?.taskId&&d.responseId===u.responseId)return;if(!s||d.taskId!==s.taskId||d.responseId!==s.responseId||!s.pending)throw Error(`stale worker task response`);try{s.assertCurrent()}catch(e){s.cancelPending(e);return}let e=s.pending;s.pending=void 0;let t=!1,n=d.taskId,r=d.responseId;e.resolve({input:d.input,consumed:()=>{t||(t=!0,i.postMessage({status:`consumed`,taskId:n,id:r}))}});return}if(s)throw Error(`overlapping worker tasks`);let f=new Int32Array(d.nativeSections),p={taskId:d.taskId,responseId:0,assertCurrent:()=>m.throwIfCancelled(),cancelPending:e=>{let t=p.pending;t&&(p.pending=void 0,u={taskId:p.taskId,responseId:p.responseId},t.reject(e))}},m=createWorkerTaskControl(f,()=>s===p);s=p;let h=d.interactive?observeWorkerTaskCancellation(f,()=>s===p,()=>p.cancelPending(/* @__PURE__ */ Error(`worker task cancelled`))):void 0,g=d.interactive?{notify:e=>{m.throwIfCancelled(),i.postMessage({status:`notification`,taskId:p.taskId,value:e})},consumeInput:()=>i.postMessage({status:`consumed`,taskId:p.taskId,id:0}),request:(e,t)=>{if(m.throwIfCancelled(),s!==p||p.pending)throw Error(`closed or busy worker channel`);let n=Promise.withResolvers();p.pending=n;try{let n=t?[...t]:[];m.throwIfCancelled(),i.postMessage({status:`request`,taskId:p.taskId,id:++p.responseId,value:e},n)}catch(e){p.pending=void 0,n.reject(e)}return n.promise}}:void 0,v=l;c=Promise.resolve().then(async()=>{try{return await v,m.throwIfCancelled(),n.installTaskContext(d.taskContext),await withWorkerTaskNativeSectionScope(f,()=>s===p,()=>e(d.input,g,m))}finally{await h?.(),s=void 0}}).then(e=>{i.postMessage({status:`ok`,value:e,taskId:p.taskId},t.transferList?.(e)??[])}).catch(e=>{if(t.retireOnError){o=!0;return}i.postMessage({status:`failed`,taskId:p.taskId,error:e instanceof Error?e.message:String(e)})}).finally(()=>{if(!o){n.onIdle();return}(async()=>{try{await l}finally{try{await n.onRetire?.()}finally{process.exitCode=1;try{i.close()}finally{i!==r&&r.close()}}}})().catch(()=>{process.exitCode=1})})}),n.onReady?.()}function init_worker_task_server(){return(init_worker_task_server=__esmMin((()=>{init_worker_task_native_sections()})))()}function init_worker(){return(init_worker=__esmMin((()=>{init_worker_task_native_sections(),init_worker_task_server()})))()}function scheduleOpenClawCompileCacheFlush(){if(!e.getCompileCacheDir?.())return;let t=globalThis[Symbol.for(`openclaw.nodeCompileCacheBase`)]??={};t.flush||(t.flush=setImmediate(()=>{t.flush=void 0;try{e.flushCompileCache()}catch{}}),t.flush.unref())}async function maintain(e){let t=w.dirname(w.dirname(e)),n=w.basename(w.dirname(e));if(w.basename(t)!==`openclaw`||sanitize(n)!==n||!Ne.test(w.basename(e)))return;let r=Date.now(),i=await ue.lstat(t).catch(()=>void 0);for(let n of[t,w.dirname(e),e]){let e=n===t?i:await ue.lstat(n).catch(()=>void 0);if(e&&!e.isDirectory())return}if(await ue.mkdir(e,{recursive:!0}),i&&r-i.mtimeMs<Me)return;await ue.utimes(t,new Date(r),new Date(r));let a=[],o=0;async function visit(e){for(let t of await ue.readdir(e,{withFileTypes:!0})){let n=w.join(e,t.name);if(t.isDirectory())await visit(n);else if(t.isFile()){let e=await ue.lstat(n);o+=e.size,a.push({file:n,size:e.size,mtimeMs:e.mtimeMs})}}}await visit(t),a.sort((e,t)=>e.mtimeMs-t.mtimeMs);for(let e of a)(o>Ae||r-e.mtimeMs>je)&&(await ue.unlink(e.file),o-=e.size)}var Ae,je,Me,Ne,sanitize;function init_node_compile_cache(){return(init_node_compile_cache=__esmMin((()=>{g&&process.env.OPENCLAW_PACKAGED_COMPILE_CACHE_RESPAWNED===`gateway`&&(delete process.env.NODE_DISABLE_COMPILE_CACHE,delete process.env.OPENCLAW_PACKAGED_COMPILE_CACHE_RESPAWNED),Ae=536870912,je=6048e5,Me=36e5,Ne=/^(?:[a-f0-9]{16}|\d+-\d+|no-package-json|build-[A-Za-z0-9._-]+)$/,sanitize=e=>{let t=e.replace(/[^A-Za-z0-9._-]+/g,`_`).replace(/^_+|_+$/g,``);return t&&t!==`.`&&t!==`..`?t:`unknown`},!g&&typeof ee?.openclawCompileCacheDirectory==`string`&&maintain(ee.openclawCompileCacheDirectory).catch(()=>{})})))()}function createUnownedAppliedLoggingConfig(){return Fe}function createLoggingState(){return{appliedConfig:createUnownedAppliedLoggingConfig(),cachedLogger:null,cachedSettings:null,cachedConsoleSettings:null,overrideSettings:null,invalidEnvLogLevelValue:null,consolePatched:!1,forceConsoleToStderr:!1,earlyConsoleRoutingRestore:null,consoleTimestampPrefix:!1,consoleSubsystemFilter:null,streamErrorHandlersInstalled:!1,rawConsole:null}}var Pe,Fe,Ie,T;function init_state(){return(init_state=__esmMin((()=>{Pe=Symbol.for(`openclaw.loggingState`),Fe=`unowned`,Ie=globalThis,T=Ie[Pe]??createLoggingState(),Object.hasOwn(T,`appliedConfig`)||(T.appliedConfig=Fe),Ie[Pe]=T})))()}function installDeletedAgentDatabaseFences(e){Le.deleted.clear();for(let[t,n]of e)Le.deleted.set(t,n)}async function applyAgentDatabaseReaderRequest(e){if(e.kind===`revive`){for(let[t,n]of Le.deleted)e.agentIds.includes(n)&&Le.deleted.delete(t);return}if(e.deleted)for(let t of e.candidates)Le.deleted.set(w.resolve(t.path),e.agentId);let t=e.deleted?void 0:new Set(e.retainedPaths?.map(e=>w.resolve(e))),n=(await Promise.allSettled([...Le.closers].map(async n=>n(e.candidates,t)))).flatMap(e=>e.status===`rejected`?[e.reason]:[]);if(n.length===1)throw n[0];if(n.length>1)throw AggregateError(n,`Agent database reader cleanup failed`)}function normalizeCandidates(e){if(Array.isArray(e)&&e.every(e=>isRecord(e)&&typeof e.path==`string`&&(e.scope===void 0||e.scope===`sibling-family`)))return e.map(e=>e.scope?{path:e.path,scope:e.scope}:{path:e.path})}function decodeAgentDatabaseReaderRequest(e){if(e===void 0)return;let t;try{t=JSON.parse(e)}catch{return}if(Array.isArray(t)){let e=normalizeCandidates(t);return e?{kind:`close`,candidates:e,deleted:!1}:void 0}if(isRecord(t)){if(`candidates`in t&&!(`deleted`in t)){let e=normalizeCandidates(t.candidates),n=t.retainedPaths;return e&&Array.isArray(n)&&n.every(e=>typeof e==`string`)?{kind:`close`,candidates:e,retainedPaths:n,deleted:!1}:void 0}if(`deleted`in t){let e=normalizeCandidates(t.deleted);return e&&typeof t.agentId==`string`&&t.agentId.length>0?{kind:`close`,candidates:e,deleted:!0,agentId:t.agentId}:void 0}if(`revive`in t&&Array.isArray(t.revive)&&t.revive.every(e=>typeof e==`string`))return{kind:`revive`,agentIds:t.revive}}}var Le;function init_agent_database_readers(){return(init_agent_database_readers=__esmMin((()=>{init_global_singleton(),Le=resolveGlobalSingleton(Symbol.for(`openclaw.agentDatabaseReaders`),()=>({closers:/* @__PURE__ */ new Set,deleted:/* @__PURE__ */ new Map}))})))()}function notifyListeners(e,t,n){for(let r of e)try{r(t)}catch(e){n?.(e)}}function categorizeFsSafeError(e){return Re.has(e)?`operational`:`policy`}var Re,FsSafeError,E=__esmMin((()=>{Re=/* @__PURE__ */ new Set([`helper-failed`,`helper-unavailable`,`not-empty`,`not-found`,`not-removable`,`permission-unverified`,`read-failed`,`timeout`,`unsupported-platform`]),FsSafeError=class extends Error{code;category;details;constructor(e,t,n={}){super(t,n),this.name=`FsSafeError`,this.code=e,this.category=categorizeFsSafeError(e),this.details=n.details}}}));function captureNativeFdClose(e){if(typeof e.closeOwnedFd!=`function`)throw new FsSafeError(`helper-unavailable`,`native descriptor ownership is unavailable`);return e.closeOwnedFd.bind(e)}var ze=__esmMin((()=>{E()}));function parseMode(e){if(!e)return;let t=e.trim().toLowerCase();if(t===`0`||t===`false`||t===`off`||t===`never`)return`off`;if(t===`1`||t===`true`||t===`on`||t===`auto`)return`auto`;if(t===`required`||t===`require`)return`require`}function getFsSafeNativeConfig(){return{mode:Be.mode??parseMode(process.env.FS_SAFE_NATIVE_MODE)??parseMode(process.env.OPENCLAW_FS_SAFE_NATIVE_MODE)??`auto`}}var Be,Ve=__esmMin((()=>{Be={}}));function loadFailure(e,t){try{return classifyLoadFailure(e,t)}catch{return{reason:`load-failed`,code:`UNKNOWN`}}}function classifyLoadFailure(e,t){let n=typeof e==`object`&&e&&`code`in e?e.code:void 0;if(n===`MODULE_NOT_FOUND`&&e instanceof Error&&e.message.split(`
`,1)[0]===`Cannot find module '${t}'`)try{resolvePackage(t)}catch(e){if(e instanceof Error&&`code`in e&&e.code===`MODULE_NOT_FOUND`&&e.message.split(`
`,1)[0]===`Cannot find module '${t}'`)return{reason:`package-missing`}}return{reason:`load-failed`,code:typeof n==`string`&&[`ERR_DLOPEN_FAILED`,`MODULE_NOT_FOUND`,`ERR_MODULE_NOT_FOUND`,`ERR_PACKAGE_PATH_NOT_EXPORTED`,`ERR_INVALID_PACKAGE_CONFIG`,`EACCES`,`EPERM`,`ENOENT`].includes(n)?n:`UNKNOWN`}}function isMuslFilename(e){return e.includes(`libc.musl-`)||e.includes(`ld-musl-`)}function isMuslFromReport(){try{if(!process.report||typeof process.report.getReport!=`function`)return;let e=process.report.getReport();if(e.header?.glibcVersionRuntime)return!1;if(e.sharedObjects?.some(isMuslFilename))return!0}catch{}}function isMuslFromFilesystem(){for(let e of[`/lib`,`/usr/lib`])try{if(ce(e).some(isMuslFilename))return!0}catch{}}function readUInt(e,t,n,r){if(t<0||t+n>e.length)return;if(n===2)return r?e.readUInt16LE(t):e.readUInt16BE(t);if(n===4)return r?e.readUInt32LE(t):e.readUInt32BE(t);let i=r?e.readBigUInt64LE(t):e.readBigUInt64BE(t);return i<=BigInt(2**53-1)?Number(i):void 0}function isMuslFromElfInterpreter(){let e;try{e=oe(process.execPath,`r`);let t=Buffer.alloc(64);if(se(e,t,0,t.length,0)<52||!t.subarray(0,4).equals(Buffer.from([127,69,76,70])))return;let n=t[4],r=t[5];if(n!==1&&n!==2||r!==1&&r!==2)return;let i=r===1,a=n===2,o=readUInt(t,a?32:28,a?8:4,i),s=readUInt(t,a?54:42,2,i),c=readUInt(t,a?56:44,2,i);if(o===void 0||s===void 0||c===void 0||s<(a?56:32)||c>1024)return;let l=Buffer.alloc(s);for(let t=0;t<c;t+=1){let n=o+t*s;if(se(e,l,0,s,n)!==s)return;if(readUInt(l,0,4,i)!==3)continue;let r=readUInt(l,a?8:4,a?8:4,i),c=readUInt(l,a?32:16,a?8:4,i);if(r===void 0||c===void 0||c<1||c>4096)return;let u=Buffer.alloc(c);return se(e,u,0,c,r)===c?isMuslFilename(u.toString(`utf8`)):void 0}}catch{return}finally{if(e!==void 0)try{ie(e)}catch{}}}function isMusl(){if(process.platform!==`linux`)return!1;for(let e of[isMuslFromReport,isMuslFromElfInterpreter,isMuslFromFilesystem]){let t=e();if(t!==void 0)return t}return!1}function targetFor(e,t,n){if(e===`win32`&&(t===`x64`||t===`arm64`))return`win32-${t}-msvc`;if(e===`darwin`&&t===`x64`)return`darwin-x64`;if(e===`darwin`&&t===`arm64`)return`darwin-arm64`;if(e===`freebsd`&&(t===`x64`||t===`arm64`))return`freebsd-${t}`;if(e===`linux`&&(t===`x64`||t===`arm64`))return`linux-${t}-${n?`musl`:`gnu`}`}function bundledTarget(){let e=isMusl();return Ye=targetFor(process.platform,process.arch,e),Xe=Ye??`${process.platform}-${process.arch}${process.platform===`linux`?`-${e?`musl`:`gnu`}`:``}`,Ye}function nativePackageForTarget(e){return`@openclaw/fs-safe-${e}`}function loadBundledBinding(){let e=bundledTarget();if(!e)throw Je={reason:`unsupported-target`},Error(`Unsupported OS or architecture: ${process.platform}-${process.arch}`);let t=Ue(()=>He(nativePackageForTarget(e)));return typeof t.closeOwnedFd!=`function`&&(Je={reason:`capability-missing`,capabilities:[`closeOwnedFd`]}),captureNativeFdClose(t),t}function selectNativeBinding(e,...t){if(!e)return;let n=t.filter(t=>typeof e[t]!=`function`);if(n.length===0)return e;if(getFsSafeNativeConfig().mode===`require`)throw new FsSafeError(`helper-unavailable`,`native fs-safe capabilities unavailable: ${n.join(`, `)}`)}function getNativeBinding(...e){let{mode:t}=getFsSafeNativeConfig();if(t!==`off`){if(!Ke){Ke=!0;try{let e=qe();typeof e.closeOwnedFd!=`function`&&(Je={reason:`capability-missing`,capabilities:[`closeOwnedFd`]}),captureNativeFdClose(e),We=e,Je={reason:`loaded`}}catch(e){Ge=e,Je.reason===`not-probed`&&(Ye??=bundledTarget(),Je=loadFailure(e,nativePackageForTarget(Ye??`${process.platform}-${process.arch}`)))}}if(We)return selectNativeBinding(We,...e);if(t===`require`)throw new FsSafeError(`helper-unavailable`,`native fs-safe helper is unavailable`,{cause:Ge})}}var He,Ue,We,Ge,Ke,qe,resolvePackage,Je,Ye,Xe,Ze=__esmMin((()=>{E(),ze(),Ve(),He=t(import.meta.url),Ue=S.snapshot(),Ke=!1,qe=loadBundledBinding,resolvePackage=e=>He.resolve(e),Je={reason:`not-probed`}}));function isWindowsAppContainer(e){if(e.isWindowsAppContainer)try{let t=e.isWindowsAppContainer();if(typeof t!=`boolean`)throw Error(`Invalid AppContainer membership`);return t}catch(e){throw new FsSafeError(`permission-unverified`,`Windows process token membership could not be verified`,{cause:e})}}var Qe=__esmMin((()=>{E()}));function resolve(e,t){if(t&&process.platform===`win32`)try{return C.realpathSync.native(e)}catch(t){if(t.code!==`EPERM`||t.syscall!==`realpath`)throw t;let n;try{n=getNativeBinding()}catch{n=void 0}if(!n||!isWindowsAppContainer(n))throw t;if(!n?.resolveWindowsCanonicalPath)throw new FsSafeError(`helper-unavailable`,`Windows canonicalization after a denied DOS-name query requires the native binding`,{cause:t});let r;try{r=n.resolveWindowsCanonicalPath(e)}catch(e){throw new FsSafeError(`path-mismatch`,`Windows canonical path cannot be verified safely`,{cause:e})}if(r===null)throw t;return r}if(et){if(e.includes(`\0`))throw Object.assign(/* @__PURE__ */ TypeError(`realpath input must not contain null bytes`),{code:`ERR_INVALID_ARG_VALUE`});let n=getNativeBinding();if(n?.canonicalizePath){let r=n.canonicalizePath(e,!t);if(r.path!==void 0)return r.path;let a=-r.errno,o=i(a);throw Object.assign(/* @__PURE__ */ Error(`${o}: realpath '${e}'`),{code:o,errno:a,syscall:`realpath`,path:e})}if(getFsSafeNativeConfig().mode===`require`)throw new FsSafeError(`helper-unavailable`,`native fs-safe canonicalization is unavailable`)}return t?C.realpathSync.native(e):C.realpathSync(e)}var $e,et,tt,nt=__esmMin((()=>{E(),Ze(),Ve(),Qe(),$e=process.versions.bun?fe():void 0,et=$e===`darwin`||$e===`linux`?$e:void 0,tt=Object.assign(e=>resolve(e,!1),{native:e=>resolve(e,!0)})}));function normalizeNullableString$1(e){return typeof e==`string`&&e.trim()||null}function normalizeOptionalString$1(e){return normalizeNullableString$1(e)??void 0}function normalizeOptionalLowercaseString$1(e){return normalizeOptionalString$1(e)?.toLowerCase()}function normalizeLowercaseStringOrEmpty$1(e){return normalizeOptionalLowercaseString$1(e)??``}var rt=__esmMin((()=>{}));function isWindowsSeparator(e,t){let n=e.charCodeAt(t);return n===47||n===92}function hasWindowsDrivePrefix(e,t=0){let n=e.charCodeAt(t)|32;return n>=97&&n<=122&&e.charCodeAt(t+1)===58}function windowsNamespaceMarker(e){let t=e[2];return(t===`.`||t===`?`)&&isWindowsSeparator(e,0)&&isWindowsSeparator(e,1)&&isWindowsSeparator(e,3)?t:void 0}function rootedWindowsDriveColonIndex(e){let t=hasWindowsDrivePrefix(e)?1:windowsNamespaceMarker(e)!==void 0&&hasWindowsDrivePrefix(e,4)?5:-1;return t>=0&&isWindowsSeparator(e,t+1)?t:-1}function asciiLowercase(e){return e.replace(/[A-Z]/g,e=>String.fromCharCode(e.charCodeAt(0)+32))}function windowsSegmentsClimbAbove(e){let t=0;for(let n of e)if(n!==``&&n!==`.`&&(t+=/^[. ]+$/.test(n)?-1:1,t<0))return!0;return!1}function windowsShareOrDeviceRoot(e){if(!isWindowsSeparator(e,0)||!isWindowsSeparator(e,1))return;let t=e.replaceAll(`/`,`\\`);if(windowsNamespaceMarker(t)===void 0)return asciiLowercase(w.win32.parse(t).root.replace(/\\+$/,``));let n=t.slice(4).split(`\\`),r=asciiLowercase(n[0]??``),i=r===`unc`?n.slice(0,3):n.slice(0,1);if(r===`globalroot`||r===`global`||i.length<(r===`unc`?3:1)||i.some(e=>e===``||/[. ]$/.test(e))||windowsSegmentsClimbAbove(n.slice(i.length)))return null;if(rootedWindowsDriveColonIndex(e)!==5)return asciiLowercase(r===`unc`?`\\\\${i[1]}\\${i[2]}`:`${t.slice(0,4)}${i[0]}`)}var it=__esmMin((()=>{}));function isExactlyUnderWindowsPath(e,t){let n=e.replaceAll(`/`,`\\`).replace(/(?<=.)\\+$/,``),r=t.replaceAll(`/`,`\\`);return r!==n&&!r.startsWith(n.endsWith(`\\`)?n:`${n}\\`)?!1:!windowsSegmentsClimbAbove(r.slice(n.length).split(`\\`))}function isForeignWindowsShareOrDevicePath(e,t,n=process.platform){if(n!==`win32`)return!1;let r=windowsShareOrDeviceRoot(e);return r!==void 0&&!t.some(t=>t!==void 0&&(r!==null&&windowsShareOrDeviceRoot(t)===r||isExactlyUnderWindowsPath(t,e)))}function isBareWindowsNamespaceDrive(e){return e.length===6&&windowsNamespaceMarker(e)!==void 0&&hasWindowsDrivePrefix(e,4)}function resolvePathPreservingWindowsRoot(e){return e.length===7&&process.platform===`win32`&&rootedWindowsDriveColonIndex(e)===5?e.includes(`/`)?e.replaceAll(`/`,`\\`):e:repairResolvedWindowsRoot(e,w.resolve(e))}function repairResolvedWindowsRoot(e,t){return t.length===6&&process.platform===`win32`&&isBareWindowsNamespaceDrive(t)&&!hasWindowsPathAlias(e,`filesystem`)?`${t}\\`:t}function resolvePathFromBasePreservingWindowsRoot(e,...t){let n=w.resolve(e,...t);return n.length!==6||process.platform!==`win32`||!isBareWindowsNamespaceDrive(n)||hasWindowsPathAlias(e,`filesystem`)||t.some(e=>hasWindowsPathAlias(e,`filesystem`))?n:`${n}\\`}function pathForWindowsFilesystem(e){if(process.platform!==`win32`||rootedWindowsDriveColonIndex(e)!==5)return e;if(e.length===7)return`${e[4]}:\\`;let t=w.resolve(e);return isBareWindowsNamespaceDrive(t)&&!hasWindowsPathAlias(e,`filesystem`)?`${t[4]}:\\`:e}function hasWindowsPathAlias(e,t,n=process.platform){if(n!==`win32`)return!1;let r=e.indexOf(`:`);return r===-1?!1:t===`relative`||r!==rootedWindowsDriveColonIndex(e)||e.indexOf(`:`,r+1)!==-1}function assertNoWindowsPathAliasForPlatform(e,t,n,r){if(hasWindowsPathAlias(e,t,r))throw new FsSafeError(`invalid-path`,n,{details:{reason:`windows-path-alias`}})}function assertNoWindowsPathAlias(e,t=`filesystem`,n=`path uses a Windows filesystem namespace alias`,r=process.platform){assertNoWindowsPathAliasForPlatform(e,t,n,r)}var at=__esmMin((()=>{E(),it()}));function isFileUrl(e){return st.test(e)}function hasEncodedFileUrlSeparator(e){return ot.test(e)}function isWindowsNetworkPath(e,t=process.platform){return t===`win32`&&isWindowsSeparator(e,0)&&isWindowsSeparator(e,1)&&(windowsNamespaceMarker(e)!==`?`||rootedWindowsDriveColonIndex(e)!==5)}function safeFileURLToPath(e,t=process.platform){let n;try{n=new me(e)}catch{throw Error(`Invalid file:// URL: ${e}`)}if(n.protocol!==`file:`)throw Error(`Invalid file:// URL: ${e}`);let r=normalizeLowercaseStringOrEmpty$1(n.hostname);if(r!==``&&r!==`localhost`)throw Error(`file:// URLs with remote hosts are not allowed: ${e}`);if(hasEncodedFileUrlSeparator(n.pathname))throw Error(`file:// URLs cannot encode path separators: ${e}`);let i=he(n,{windows:t===`win32`});if(hasWindowsPathAlias(i,`filesystem`,t))throw Error(`Local file URL cannot use Windows filesystem namespace aliases: ${i}`);if(isWindowsNetworkPath(i,t))throw Error(`Local file URL cannot use Windows network paths: ${i}`);return i}function trySafeFileURLToPath(e,t=process.platform){try{return safeFileURLToPath(e,t)}catch{return}}var ot,st,ct=__esmMin((()=>{rt(),at(),it(),ot=/%(?:2f|5c)/i,st=/^file:\/\//i}));function trimTrailingWindowsSeparators(e){let t=e.length;for(;t>0&&e.charCodeAt(t-1)===dt;)--t;return t===e.length?e:e.slice(0,t)}function trimTrailingWindowsIgnoredChars(e){let t=e.length;for(;t>0;){let n=e.charCodeAt(t-1);if(n!==ft&&n!==pt)break;--t}return t===e.length?e:e.slice(0,t)}function candidateReadPaths(e,t){if(!isFileUrl(e))return[e];let n=trySafeFileURLToPath(e,t);return n===void 0?[e]:[e,n]}function normalizePosixPath(e,t){if(w.posix.isAbsolute(e))return w.posix.normalize(e);let n=t&&w.posix.isAbsolute(t)?t:process.cwd();return w.posix.resolve(n,e)}function matchPosixDeviceReadPath(e,t){let n=normalizePosixPath(e,t);if(lt.has(n))return{path:n,reason:`posix-device`};if(n===`/dev/fd`||n.startsWith(`/dev/fd/`)||/^\/proc\/(?:self|thread-self|\d+)\/fd(?:\/|$)/.test(n))return{path:n,reason:`posix-fd`}}function normalizeWindowsDeviceBaseName(e){let t=trimTrailingWindowsSeparators(e.replace(/\//g,`\\`)),n=t.lastIndexOf(`\\`)+1,r=t.indexOf(`:`,n),i=t.indexOf(`.`,n),a=Math.min(r<0?t.length:r,i<0?t.length:i);return trimTrailingWindowsIgnoredChars(t.slice(n,a)).toUpperCase()}function matchWindowsDeviceReadPath(e){let t=e.replace(/\//g,`\\`);if(/^\\\\\.\\/.test(t)||/^\\\\\?\\GLOBALROOT\\Device\\/i.test(t))return{path:t,reason:`windows-device`};let n=normalizeWindowsDeviceBaseName(e);if(ut.has(n))return{path:t,reason:`windows-device`}}function matchUnsafeDeviceReadPath(e,t={}){let n=t.platform??process.platform;for(let r of candidateReadPaths(e,n)){let e=n===`win32`?matchWindowsDeviceReadPath(r):matchPosixDeviceReadPath(r,t.cwd);if(e)return e}}function isUnsafeDeviceReadPath(e,t){return matchUnsafeDeviceReadPath(e,t)!==void 0}var lt,ut,dt,ft,pt,mt=__esmMin((()=>{ct(),lt=/* @__PURE__ */ new Set([`/dev/zero`,`/dev/random`,`/dev/urandom`,`/dev/full`,`/dev/stdin`,`/dev/stdout`,`/dev/stderr`,`/dev/tty`,`/dev/console`]),ut=/* @__PURE__ */ new Set(/* @__PURE__ */ `CON.PRN.AUX.NUL.CLOCK$.CONIN$.CONOUT$.COM1.COM2.COM3.COM4.COM5.COM6.COM7.COM8.COM9.COM¹.COM².COM³.LPT1.LPT2.LPT3.LPT4.LPT5.LPT6.LPT7.LPT8.LPT9.LPT¹.LPT².LPT³`.split(`.`)),dt=92,ft=32,pt=46}));function assertNoDriveRelativePathSegments(e,t){if(ht.test(e))throw new FsSafeError(`invalid-path`,`${t} must not contain a drive letter`);return e}var ht,gt=__esmMin((()=>{E(),ht=/(?:^|\/)[A-Za-z]:(?!\\)/}));function normalizeWindowsPathForComparison(e){let t=w.win32.normalize(e);return t.startsWith(`\\\\?\\`)&&(t=t.slice(4),t.toUpperCase().startsWith(`UNC\\`)&&(t=`\\\\${t.slice(4)}`)),t.replaceAll(`/`,`\\`).toLowerCase()}function resolveWindowsPathForComparison(e){let t=w.win32.resolve(e);return t[1]===`:`&&w.win32.isAbsolute(t)?t.toLowerCase():normalizeWindowsPathForComparison(t.length===6?resolvePathPreservingWindowsRoot(e):t)}function isNodeError(e){return!!(e&&typeof e==`object`&&`code`in e)}function hasNodeErrorCode(e,t){return isNodeError(e)&&e.code===t}function assertNoNulPathInput(e,t=`path contains a NUL byte`){if(e.includes(`\0`))throw new FsSafeError(`invalid-path`,t)}function isNotFoundPathError(e){return isNodeError(e)&&typeof e.code==`string`&&_t.has(e.code)}function isSymlinkOpenError(e){return isNodeError(e)&&typeof e.code==`string`&&vt.has(e.code)}function isPathInside(e,t){if(process.platform===`win32`){if(isForeignWindowsShareOrDevicePath(t,[e]))return!1;let n=resolveWindowsPathForComparison(e),r=resolveWindowsPathForComparison(t);if(n[1]===`:`&&w.win32.isAbsolute(n)&&!r.includes(`:`,2)&&(r===n||r.startsWith(n)&&(n.endsWith(`\\`)||r[n.length]===`\\`)))return!0;let i=w.win32.relative(n,r),a=i.split(w.win32.sep)[0];return i===``||a!==`..`&&!w.win32.isAbsolute(i)}if(e.length>0&&e.charCodeAt(0)===yt&&t.length>=e.length&&t.charCodeAt(0)===yt&&!t.includes(`/..`)&&(t===e||t.startsWith(e)&&(e.charCodeAt(e.length-1)===yt||t.charCodeAt(e.length)===yt)))return!0;let n=w.resolve(e),r=w.resolve(t),i=w.relative(n,r),a=i.split(w.posix.sep)[0];return i===``||a!==`..`&&!w.isAbsolute(i)}function isPathRelativeEscape(e){if(w.isAbsolute(e))return!0;let t=0,n=e.split(process.platform===`win32`?/[/\\]/:/\//);for(let e of n)if(e===`..`){if(t===0)return!0;--t}else e!==``&&e!==`.`&&(t+=1);return!1}var _t,vt,yt,bt=__esmMin((()=>{E(),at(),mt(),_t=/* @__PURE__ */ new Set([`ENOENT`,`ENOTDIR`]),vt=/* @__PURE__ */ new Set([`ELOOP`,`EINVAL`,`ENOTSUP`]),yt=47}));function isMissingPathError(e){return hasNodeErrorCode(e,`ENOENT`)||hasNodeErrorCode(e,`ENOTDIR`)||hasNodeErrorCode(e,`not-found`)}function init_errno(){return(init_errno=__esmMin((()=>{bt()})))()}function isPostgresSqlConnection(e){return xt in e&&e[xt]===!0}function sqlPublicationAnchor(e){return isPostgresSqlConnection(e)?e.anchor:e}var xt;function init_sql_connection(){return(init_sql_connection=__esmMin((()=>{xt=Symbol.for(`openclaw.postgres-sync-connection`)})))()}var St;function init_sqlite_database_admission_key(){return(init_sqlite_database_admission_key=__esmMin((()=>{St=`openclaw.sqliteDatabaseAdmissions.v1`})))()}function normalizeWindowsPathPreservingCase(e){let t=w.win32.normalize(e);if(!t.startsWith(`\\\\?\\`))return t;let n=t.slice(4);return n.toUpperCase().startsWith(`UNC\\`)?`\\\\${n.slice(4)}`:n}function init_path_guards(){return(init_path_guards=__esmMin((()=>{bt()})))()}function readDatabaseIdentityBirthtime(e){return Ct?e.birthtimeNs.toString():`0`}function normalizeDatabasePath(e){let t=process.platform===`win32`?normalizeWindowsPathPreservingCase(e):e;return process.platform===`win32`&&!/^(?:[a-z]:[\\/]|[\\/]{2})/iu.test(t)?e:t}function isSoleDatabaseFileDescriptor(e,t){if(process.platform!==`linux`)return!1;try{for(let n of ce(`/proc/self/fd`))if(/^\d+$/u.test(n)&&Number(n)!==e)try{let e=ae(Number(n),{bigint:!0});if(e.dev===t.dev&&e.ino===t.ino)return!1}catch(e){if(!hasNodeErrorCode(e,`EBADF`))return!1}return!0}catch{return!1}}var Ct;function init_sqlite_worker_identity(){return(init_sqlite_worker_identity=__esmMin((()=>{init_errno(),init_path_guards(),Ct=process.platform!==`linux`&&process.platform!==`android`})))()}function readSqliteDatabaseAdmissionIdentity(e){return`${e.dev}:${e.ino}:${readDatabaseIdentityBirthtime(e)}`}function readSqliteDatabaseAdmissions(e){return Array.isArray(e)?e:void 0}function isSqliteDatabaseAdmissionRetired(e){return readSqliteDatabaseGeneration(e,`retired`)!==0}function isSqliteDatabaseAdmissionFactCurrent(e,t){return!isSqliteDatabaseAdmissionRetired(e)&&Atomics.load(new Int32Array(t.current),0)===1&&t.revision===readSqliteDatabaseFactRevision(e,t.schemaDependent)}function hasSqliteDatabaseSchemaAdmission(e){let t=e?.facts.get(`sqlite-schema`);return!!(e&&t&&isSqliteDatabaseAdmissionFactCurrent(e,t))}function readSqliteDatabaseFactRevision(e,t){return readSqliteDatabaseGeneration(e,t?`schemaRevision`:`factRevision`)}function readSqliteDatabaseGeneration(e,t){return Atomics.load(new Int32Array(e.generation),wt[t])}function advanceSqliteDatabaseGeneration(e,t){return Atomics.add(new Int32Array(e.generation),wt[t],1)}function publishSqliteDatabaseFact(e,t,n,r,i){if(r!==readSqliteDatabaseFactRevision(e,t.schemaDependent))return!1;t.writer===`host`&&advanceSqliteDatabaseGeneration(e,`hostRevision`);let a=e.facts.get(t.name);a&&Atomics.store(new Int32Array(a.current),0,0);let o=new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);return Atomics.store(new Int32Array(o),0,1),e.facts.set(t.name,{value:n,revision:r,schemaDependent:t.schemaDependent===!0,publication:i,current:o}),advanceSqliteDatabaseGeneration(e,`publicationRevision`),!0}function changedAdmissionEntries(e,t){let n=/* @__PURE__ */ new Map;for(let[r,i]of e)t.get(r)!==i&&n.set(r,i);return n}var wt,Tt,SqliteDatabaseAdmissionRegistry;function init_sqlite_database_admission_record(){return(init_sqlite_database_admission_record=__esmMin((()=>{init_sqlite_database_admission_key(),init_sqlite_worker_identity(),wt={schemaRevision:0,factRevision:1,publicationRevision:2,retired:3,writeRevision:4,hostRevision:5,unscopedWriteRevision:6,writeScopeRevision:7,sealPresent:8},Tt=Object.keys(wt).length,SqliteDatabaseAdmissionRegistry=class{constructor(){this.records=/* @__PURE__ */ new Map,this.locations=/* @__PURE__ */ new Map,this.published=/* @__PURE__ */ new Map,this.descriptors=/* @__PURE__ */ new Map,this.revision=0}changeReferences(e,t){let n=e.references.get(x);return n||(n=new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT),e.references.set(x,n)),Atomics.add(new Int32Array(n),0,t)+t===+(t===1)&&(t===-1&&this.retireUnreferenced(e),this.publish(e),!0)}retireUnreferenced(e){x!==0||[...e.references.values()].some(e=>Atomics.load(new Int32Array(e),0)>0)||(Atomics.compareExchange(new Int32Array(e.generation),wt.retired,0,2),e.facts.clear(),e.writeScopes.clear())}releaseWorker(e){for(let t of this.records.values()){let n=e>0?t.references.get(e):void 0;if(!n)continue;let r=Atomics.exchange(new Int32Array(n),0,-1);this.retireUnreferenced(t),!(r<=0)&&(advanceSqliteDatabaseGeneration(t,`writeRevision`),advanceSqliteDatabaseGeneration(t,`unscopedWriteRevision`))}this.publish()}observeLocation(e,t){this.locations.set(normalizeDatabasePath(w.resolve(e)),t)}forLocation(e){let t=this.locations.get(normalizeDatabasePath(w.resolve(e))),n=t===void 0?void 0:this.records.get(t);return n&&!isSqliteDatabaseAdmissionRetired(n)?n:void 0}hasSchemaAdmissionForIdentity(e){if(!e.key.startsWith(`file:`)||e.birthtime===void 0)return!1;let t=`${e.key.slice(5)}:${e.birthtime}`;return hasSqliteDatabaseSchemaAdmission(this.records.get(t))}forget(e){this.records.delete(e),this.published.delete(e);for(let[t,n]of this.locations)n===e&&this.locations.delete(t)}retainDescriptor(e,t,n){let r={identity:readSqliteDatabaseAdmissionIdentity(n),physicalIdentity:{key:`file:${n.dev}:${n.ino}`,birthtime:readDatabaseIdentityBirthtime(n)},location:e,descriptor:t,descriptorOwner:0,generationId:re(),generation:new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT*Tt),writeScopes:/* @__PURE__ */ new Map,writeScopeRevision:0,references:/* @__PURE__ */ new Map,facts:/* @__PURE__ */ new Map};return this.records.set(r.identity,r),this.descriptors.set(r.identity,t),this.observeLocation(e,r.identity),this.publish(r),r}retireDescriptor(e,t){let n=this.records.get(e),r=this.descriptors.get(e)??n?.descriptor;if(r===void 0)return!1;let i=C.fstatSync(r,{bigint:!0});return i.nlink>1n||t.requireSoleDescriptor&&!isSoleDatabaseFileDescriptor(r,i)?!1:(n&&Atomics.store(new Int32Array(n.generation),wt.retired,1),C.closeSync(r),this.descriptors.delete(e),this.forget(e),this.publish(),!0)}publish(e){if(!(e&&this.records.get(e.identity)!==e)){for(let t of this.records.values()){if(isSqliteDatabaseAdmissionRetired(t)){readSqliteDatabaseGeneration(t,`retired`)===1&&this.descriptors.delete(t.identity),this.forget(t.identity);continue}if(e&&t!==e)continue;let n=t===e;for(let[e,r]of t.references)Atomics.load(new Int32Array(r),0)<0&&(t.references.delete(e),n=!0);for(let[e,r]of t.writeScopes)Atomics.load(r.state,1)!==0&&(t.writeScopes.delete(e),n=!0);n&&(x===0&&(t.writeScopeRevision=readSqliteDatabaseGeneration(t,`writeScopeRevision`)),this.published.set(t.identity,{...t,facts:new Map(t.facts),writeScopes:new Map(t.writeScopes),references:new Map(t.references),hostRevision:x===0?readSqliteDatabaseGeneration(t,`hostRevision`):t.hostRevision}))}this.revision++,b(St,[...this.published.values()])}}capture(e,t){if(!t&&!e&&this.publish(),!t&&e?.revision===this.revision)return[];let n=t?[...t].flatMap(e=>{let t=this.published.get(e);return t&&!isSqliteDatabaseAdmissionRetired(t)?[t]:[]}):[...this.published.values()];return e?(t||(e.revision=this.revision),n.flatMap(t=>{let n=e.records.get(t.generation);return n===t?[]:(e.records.set(t.generation,t),[n?{...t,facts:changedAdmissionEntries(t.facts,n.facts),writeScopes:changedAdmissionEntries(t.writeScopes,n.writeScopes),references:changedAdmissionEntries(t.references,n.references)}:t])})):n}install(e){for(let t of e){let e=this.records.get(t.identity);if(t.descriptorOwner!==0||isSqliteDatabaseAdmissionRetired(t)){e&&isSqliteDatabaseAdmissionRetired(e)&&this.publish(e);continue}let n=!1;if(e&&isSqliteDatabaseAdmissionRetired(e)&&(e=void 0),!e)e={...t,hostRevision:void 0},this.records.set(t.identity,e),this.observeLocation(t.location,t.identity),n=!0;else if(e.generationId!==t.generationId)continue;for(let[r,i]of t.facts)isSqliteDatabaseAdmissionFactCurrent(t,i)&&e.facts.get(r)?.publication!==i.publication&&(e.facts.set(r,i),n=!0);for(let[r,i]of t.writeScopes){if(Atomics.load(i.state,1)!==0)continue;let t=e.writeScopes.get(r);t?.identity===i.identity||x===0&&t&&Atomics.load(t.state,1)===0||(x===0&&advanceSqliteDatabaseGeneration(e,`writeScopeRevision`),e.writeScopes.set(r,i),n=!0)}let r=readSqliteDatabaseGeneration(e,`writeScopeRevision`);(x===0||t.writeScopeRevision===r)&&(n||=e.writeScopeRevision!==r,e.writeScopeRevision=r);for(let[r,i]of t.references)!e.references.has(r)&&Atomics.load(new Int32Array(i),0)>=0&&(e.references.set(r,i),n=!0);x!==0&&t.hostRevision!==void 0&&t.hostRevision!==e.hostRevision&&t.hostRevision===readSqliteDatabaseGeneration(e,`hostRevision`)&&(e.hostRevision=t.hostRevision,n=!0),this.retireUnreferenced(e),(n||isSqliteDatabaseAdmissionRetired(e))&&this.publish(e)}}}})))()}function getSqliteNativeAdmissionFacts(e){return Et.operations.get(e)?.facts}var Et;function init_sqlite_native_admission(){return(init_sqlite_native_admission=__esmMin((()=>{init_global_singleton(),Et=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteNativeAdmissions`),()=>({operations:/* @__PURE__ */ new WeakMap}))})))()}function createSqliteDatabaseAdmissionReader(e){let{state:t,admission:n,pathAdmission:r,exchange:i,publishFact:a}=e;function getSqliteDatabaseAdmission(e,r,a={}){let o=sqlPublicationAnchor(e);if(!o.isOpen||t.suspended.has(o))return;let s=n(o,a.existingOnly!==!0&&!e.isTransaction);if(!s)return;let c=(isPostgresSqlConnection(e)?void 0:getSqliteNativeAdmissionFacts(e))?.get(r.name)??t.local.get(o)?.get(r.name);if(c&&c.revision===readSqliteDatabaseFactRevision(s,c.schemaDependent)&&(!c.schemaDependent||c.ddlRevision===(t.ddlRevisions.get(o)??0)))return r.read(c.value);if(r.schemaDependent&&t.schemaDirty.has(o))return;if(t.rolledBack.has(o)){if(e.isTransaction)return;t.rolledBack.delete(o)}let l=s.facts.get(r.name);if(!l||!isSqliteDatabaseAdmissionFactCurrent(s,l)){if(r.writer===`host`)return e.isTransaction||x===0||s.hostRevision===readSqliteDatabaseGeneration(s,`hostRevision`)?void 0:(i(s),l=s.facts.get(r.name),l&&isSqliteDatabaseAdmissionFactCurrent(s,l)?r.read(l.value):void 0);let n=readSqliteDatabaseGeneration(s,`publicationRevision`),a=t.misses.get(s)??/* @__PURE__ */ new Map;t.misses.set(s,a),!e.isTransaction&&a.get(r.name)!==n&&(i(s),l=s.facts.get(r.name),a.set(r.name,readSqliteDatabaseGeneration(s,`publicationRevision`)))}return l&&isSqliteDatabaseAdmissionFactCurrent(s,l)?r.read(l.value):void 0}function getOrLoadSqliteDatabaseAdmissionForPath(e,t,n){let i=r(e),o=i?.facts.get(t.name),s=i&&o&&isSqliteDatabaseAdmissionFactCurrent(i,o)?t.read(o.value):void 0;if(s!==void 0)return s;let c=i?readSqliteDatabaseFactRevision(i,t.schemaDependent):void 0,l=n();return i&&c!==void 0&&l!==void 0&&a(i,t,l,c),l}return{getSqliteDatabaseAdmission,getOrLoadSqliteDatabaseAdmissionForPath}}function init_sqlite_database_admission_read(){return(init_sqlite_database_admission_read=__esmMin((()=>{init_sql_connection(),init_sqlite_database_admission_record(),init_sqlite_native_admission()})))()}function readTableConstraintKeyword(e,t){let n=t;if(n.keyword===`CONSTRAINT`){let t=readSqlToken(e,n.end);n=t?readSqlToken(e,t.end):null}return n?.keyword&&Dt.has(n.keyword)?n.keyword:null}function readSqlToken(e,t){let n=t;for(;n<e.length&&/\s/u.test(e[n]??``);)n+=1;let r=e[n];if(!r)return null;if(r===`"`||r==="`"||r===`[`){let t=skipSqlQuoted(e,n,r);return{end:t,keyword:null,raw:e.slice(n,t)}}let i=n;for(;i<e.length&&!/[\s(,]/u.test(e[i]??``);)i+=1;let a=e.slice(n,i);return{end:i,keyword:a.toUpperCase(),raw:a}}function normalizeSqlIdentifier(e){return e.startsWith(`"`)&&e.endsWith(`"`)?e.slice(1,-1).replaceAll(`""`,`"`).toLowerCase():e.startsWith("`")&&e.endsWith("`")?e.slice(1,-1).replaceAll("``","`").toLowerCase():e.startsWith(`[`)&&e.endsWith(`]`)?e.slice(1,-1).toLowerCase():e.toLowerCase()}function splitSqlList(e){let t=[],n=0,r=0;for(let i of unquotedSqlIndexes(e,0)){let a=e[i];a===`(`?n+=1:a===`)`?--n:a===`,`&&n===0&&(t.push(e.slice(r,i)),r=i+1)}return t.push(e.slice(r)),t}function findSqlCharacter(e,t){for(let n of unquotedSqlIndexes(e,0))if(e[n]===t)return n;return-1}function findSqlClosingParenthesis(e,t){let n=0;for(let r of unquotedSqlIndexes(e,t)){let t=e[r];if(t===`(`)n+=1;else if(t===`)`&&(--n,n===0))return r}throw Error(`SQLite schema contains an unterminated table definition.`)}function normalizeSqlWhitespace(e){let t=``,n=!1,r=/[^\s'"`[/-]+|\s+|./gsu,i;for(;i=r.exec(e);){let a=i.index,o=i[0][0]??``,s=skipSqlQuoted(e,a,o),c=i[0];if(s!==a)c=e.slice(a,s),r.lastIndex=s;else{let t=skipSqlComment(e,a);if(t!==a){n=!0,r.lastIndex=t;continue}if(/\s/u.test(o)){n=!0;continue}}n&&t.length>0&&(t+=` `),t+=c,n=!1}return t.trim()}function*unquotedSqlIndexes(e,t){let n=t;for(;n<e.length;){let t=skipSqlQuoted(e,n,e[n]??``),r=t===n?skipSqlComment(e,n):t;r===n?(yield n,n+=1):n=r}}function skipSqlQuoted(e,t,n){if(n!==`'`&&n!==`"`&&n!=="`"&&n!==`[`)return t;let r=n===`[`?`]`:n,i=t+1;for(;i<e.length;){if(e[i]!==r){i+=1;continue}if(n!==`[`&&e[i+1]===r){i+=2;continue}return i+1}return e.length}function skipSqlComment(e,t){if(e.startsWith(`--`,t)){let n=e.indexOf(`
`,t+2);return n===-1?e.length:n+1}if(e.startsWith(`/*`,t)){let n=e.indexOf(`*/`,t+2);return n===-1?e.length:n+2}return t}var Dt;function init_sqlite_schema_sql(){return(init_sqlite_schema_sql=__esmMin((()=>{Dt=/* @__PURE__ */ new Set([`CHECK`,`FOREIGN`,`PRIMARY`,`UNIQUE`])})))()}function parseSqliteTableDefinition(e,t){if(e===null)throw Error(`Could not inspect SQLite table definition for ${t}.`);let n=findSqlCharacter(e,`(`);if(n===-1)throw Error(`SQLite table ${t} has no column definition.`);let r=findSqlClosingParenthesis(e,n),i=/* @__PURE__ */ new Map,a=[];for(let o of splitSqlList(e.slice(n+1,r))){let e=normalizeSqlWhitespace(o);if(!e)continue;let n=readSqlToken(e,0);if(!n)throw Error(`SQLite table ${t} contains an unreadable definition.`);if(readTableConstraintKeyword(e,n)){a.push(e);continue}let r=normalizeSqlIdentifier(n.raw);if(i.has(r))throw Error(`SQLite table ${t} contains duplicate column ${r}.`);i.set(r,e)}return{columns:new Map([...i].toSorted(([e],[t])=>e.localeCompare(t))),constraints:a.toSorted()}}function init_sqlite_schema_contract_assembly(){return(init_sqlite_schema_contract_assembly=__esmMin((()=>{init_sqlite_schema_sql()})))()}function hasPendingAgentStartupColumns(e){let t=/* @__PURE__ */ new Map;return kt.some(({tableName:n,columnName:r})=>{if(!e.has(n))return!1;let i=e.get(n);if(!i)return!0;let a=t.get(n);return a||(a=parseSqliteTableDefinition(i,n).columns,t.set(n,a)),!a.has(r)})}var Ot,kt;function init_openclaw_agent_db_additive_columns(){return(init_openclaw_agent_db_additive_columns=__esmMin((()=>{init_sqlite_schema_contract_assembly(),Ot=[{columnName:`owner_actor_type`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_actor_id`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_assigned_by_type`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_assigned_by_id`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_assigned_at`,dataType:`INTEGER`,tableName:`session_nodes`}],[...Ot],kt=[{tableName:`session_pending_inputs`,columnName:`consumed_event_id`,dataType:`TEXT`},{tableName:`session_transcript_active_events`,columnName:`context_eligible`,dataType:`INTEGER`},{tableName:`session_nodes`,columnName:`project_id`,dataType:`TEXT`},{tableName:`session_windows`,columnName:`row_transcript_json`,dataType:`TEXT`},{tableName:`session_windows`,columnName:`row_transcript_updated_at`,dataType:`INTEGER`},{tableName:`session_conversations`,columnName:`route_context_json`,dataType:`TEXT`}]})))()}function normalizeNullableString(e){return typeof e==`string`&&e.trim()||null}function normalizeOptionalString(e){return normalizeNullableString(e)??void 0}function normalizeOptionalLowercaseString(e){return normalizeOptionalString(e)?.toLowerCase()}function normalizeLowercaseStringOrEmpty(e){return normalizeOptionalLowercaseString(e)??``}function readProperty(e,t){try{return e[t]}catch{return}}function extractErrorCode(e){if(!e||typeof e!=`object`)return;let t=readProperty(e,`code`);return typeof t==`string`||typeof t==`number`?String(t):void 0}function init_error_coercion(){return(init_error_coercion=__esmMin((()=>{})))()}function skipHorizontalWhitespace(e,t){let n=t;for(;e[n]===` `||e[n]===`	`;)n+=1;return n}function skipSerializedBackslashes(e,t){let n=t;for(;n-t<64&&e[n]===`\\`;)n+=1;return n}function readSerializedLineEnd(e,t){let n=skipSerializedBackslashes(e,t);if(n===t)return null;if(e[n]===`n`)return n+1;if(e[n]!==`r`)return null;let r=skipSerializedBackslashes(e,n+1);return r>n+1&&e[r]===`n`?r+1:null}function readSerializedTabEnd(e,t){let n=skipSerializedBackslashes(e,t);return n>t&&e[n]===`t`?n+1:null}function skipAuthWhitespace(e,t){let n=t;for(;;){n=skipHorizontalWhitespace(e,n);let t=readSerializedTabEnd(e,n);if(t!==null){n=t;continue}let r=e[n]===`\r`&&e[n+1]===`
`?n+2:e[n]===`
`?n+1:readSerializedLineEnd(e,n);if(r===null||e[r]!==` `&&e[r]!==`	`&&readSerializedTabEnd(e,r)===null)return n;n=r}}function readAuthParamName(e,t){let n=zt.exec(e.slice(t));return n?{name:n[0].toLowerCase(),end:t+n[0].length}:null}function isAuthHeaderStart(e,t){let n=e[t-1];if((n!==`n`&&n!==`r`||e[t-2]!==`\\`)&&n!==void 0&&/[A-Za-z0-9_-]/u.test(n))return!1;let r=`proxy-authorization`,i=`authorization`,a=e.slice(t,t+19).toLowerCase(),o=a===r?r:a.startsWith(i)?i:null;if(!o)return!1;let s=t+o.length,c=skipSerializedBackslashes(e,s);if(e[c]===`"`||e[c]===`'`)c+=1;else if(c>s)return!1;return c=skipHorizontalWhitespace(e,c),e[c]===`:`||e[c]===`=`}function findNextAuthParamStart(e,t){let n=t;for(;;){if(n=skipAuthWhitespace(e,n),n>t&&isAuthHeaderStart(e,n)||n>=e.length||e[n]===`\r`||e[n]===`
`||e[n]===`;`)return null;if(e[n]===`,`){n+=1;continue}let r=readAuthParamName(e,n);if(r){let t=skipAuthWhitespace(e,r.end);if(e[t]===`=`&&e[t+1]!==`=`)return n}for(;n<e.length;){let r=skipAuthWhitespace(e,n);if(r>n){n=r;continue}if(n>t&&isAuthHeaderStart(e,n))return null;let i=e[n];if(i===`\r`||i===`
`||i===`;`)return null;if(n+=1,i===`,`)break}}}function usesAuthParams(e){return e===`digest`||e===`hawk`||e.startsWith(`aws4-`)}function isAuthFieldEnd(e){return e===void 0||e===`\r`||e===`
`||e===`;`||e===`\\`||e===`"`||e===`'`||e===`}`||e===`]`}function findAuthFieldEnd(e,t){let n=t;for(;n<e.length;){let r=skipAuthWhitespace(e,n);if(r>n){n=r;continue}if(n>t&&isAuthHeaderStart(e,n)||isAuthFieldEnd(e[n]))break;n+=1}return n}function readParamValue(e,t,n){let r=0;for(;e[t+r]===`\\`;)r+=1;let i=r>0&&e[t+r]===`"`,a=e[t]===`"`||e[t]===`'`?e[t]:void 0;if(a||i){let n=t+(i?r+1:1);for(;n<e.length;){if(e[n]===`\r`||e[n]===`
`){let t=skipAuthWhitespace(e,n);if(t===n)break;n=t;continue}if(i&&e[n]===`\\`){let t=n+1;for(;e[t]===`\\`;)t+=1;if(e[t]===`"`){if((t-n)%(2*(r+1))===r)return t+1;n=t+1;continue}n=t;continue}if(!i&&e[n]===`\\`&&n+1<e.length){n+=2;continue}if(!i&&e[n]===a)return n+1;n+=1}return n>t+1?n:null}if(n.signedHeaders){let n=/^:?[A-Za-z0-9!#$%&'*+.^_`|~-]+(?:;:?[A-Za-z0-9!#$%&'*+.^_`|~-]+)*/u.exec(e.slice(t));if(!n)return null;let r=t+n[0].length,i=e[r];return i===void 0||i===`,`||i===` `||i===`	`||i===`\r`||i===`
`?r:null}let o=(n.awsScope?Bt:zt).exec(e.slice(t));return o?t+o[0].length:null}function findStructuredAuthParamRanges(e){let t=[];for(let n of e.matchAll(Rt)){let r=(n[2]??``).toLowerCase(),i=(n.index??0)+n[0].length,a=i,o=i,s=readAuthParamName(e,i),c=s?skipAuthWhitespace(e,s.end):void 0;if(!s||c===void 0||e[c]!==`=`||e[c+1]===`=`){if(e[skipAuthWhitespace(e,i)]!==`,`&&!usesAuthParams(r))continue;let t=findNextAuthParamStart(e,i);if(t===null)continue;i=t}for(;;){let t=readAuthParamName(e,i);if(!t||(i=skipAuthWhitespace(e,t.end),e[i]!==`=`))break;i=skipAuthWhitespace(e,i+1);let n=readParamValue(e,i,{awsScope:r.startsWith(`aws4-`)&&t.name===`credential`,signedHeaders:t.name===`signedheaders`});if(n===null){let t=findNextAuthParamStart(e,i);if(t!==null){i=t;continue}o=Math.max(o,findAuthFieldEnd(e,i));break}o=n;let a=skipAuthWhitespace(e,n);if(e[a]!==`,`){if(!isAuthFieldEnd(e[a])){let t=findNextAuthParamStart(e,a);if(t!==null){i=t;continue}o=Math.max(o,findAuthFieldEnd(e,a))}break}let s=findNextAuthParamStart(e,a+1);if(s===null)break;i=s}o>a&&t.push({start:a,end:o})}return t}function redactStructuredAuthHeaders(e,t){let n=[],r=0;for(let i of findStructuredAuthParamRanges(e))(n.length===0||i.start>r)&&n.push(e.slice(r,i.start),t),r=Math.max(r,i.end);return n.push(e.slice(r)),n.join(``)}var At,jt,Mt,Nt,Pt,Ft,It,Lt,D,Rt,zt,Bt;function init_structured_auth_redaction(){return(init_structured_auth_redaction=__esmMin((()=>{At="[A-Za-z0-9!#$%&'*+.^_`|~-]+",jt=String.raw`(?:\[REDACTED\]|[^\s\\"',;&#?<>)}\]]+)`,Mt=String.raw`\\{1,64}t`,Nt=String.raw`(?:[ \t]+|${Mt})`,Pt=String.raw`(?:[ \t]*\r?\n${Nt}|[ \t]*\\{1,64}r\\{1,64}n${Nt}|[ \t]*\\{1,64}n${Nt}|[ \t]*${Mt}[ \t]*|[ \t]*)`,Ft=String.raw`(?:[ \t]*\r?\n${Nt}|[ \t]*\\{1,64}r\\{1,64}n${Nt}|[ \t]*\\{1,64}n${Nt}|[ \t]*${Mt}[ \t]*|[ \t]+)`,It=String.raw`(?:[ \t\r\n]*|[ \t]*\\{1,64}r\\{1,64}n(?:[ \t]*|${Mt})|[ \t]*\\{1,64}n(?:[ \t]*|${Mt})|[ \t]*${Mt}[ \t]*)`,Lt=String.raw`(^|[^A-Za-z0-9_-]|\\{1,64}[rn])`,D=String.raw`(?:\\{1,64}["']|["']|)`,String.raw`${Lt}(?:x-goog-api-key|api-key|apikey|x-api-token|x-access-token)${D}[ \t]*[:=]${Pt}${D}([^\s\\"',;]+)`,Rt=new RegExp(String.raw`${Lt}(?:Proxy-)?Authorization${D}[ \t]*[:=]${Pt}${D}(${At})${Ft}`,`giu`),zt=/^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u,Bt=/^[A-Za-z0-9!#$%&'*+.^_`|~:/-]+/u})))()}var Vt;function init_cjk_chars(){return(init_cjk_chars=__esmMin((()=>{Vt=[[[183,183],[12288,12703],[19968,40869],[44032,55215],[65281,65376]],[[4352,4607],[11904,12287],[12704,19967],[40870,40959],[40960,42239],[42752,42759],[43360,43391],[55216,55295],[63744,64255]],[[711,711],[713,715],[729,729],[746,747],[773,773],[803,803],[65040,65103],[65377,65500],[65504,65510]],[[119648,119665]],[[94176,94207],[110576,110591],[110592,110959],[127488,127743],[131072,195103],[196608,210047]]],RegExp(`[${Vt.flatMap(e=>e.map(([e,t])=>`\\u{${e.toString(16)}}-\\u{${t.toString(16)}}`)).join(``)}]`,`u`),(()=>{let e=Math.max(...Vt.flatMap(e=>e.map(([,e])=>e))),t=new Uint8Array(e+1);for(let[e,n]of Vt.entries())for(let[r,i]of n)t.fill(e+1,r,i+1);return t})()})))()}function expectDefined(e,t){if(e==null)throw Error(`expected `+t+` to be defined`);return e}var Ht;function init_number_coercion(){return(init_number_coercion=__esmMin((()=>{Ht=2147e6,Math.floor(Ht/1e3)})))()}function isHighSurrogate(e){return e>=55296&&e<=56319}function isLowSurrogate(e){return e>=56320&&e<=57343}function sliceUtf16Safe(e,t,n){let r=e.length,i=t<0?Math.max(r+t,0):Math.min(t,r),a=n===void 0?r:n<0?Math.max(r+n,0):Math.min(n,r);return a<=i?``:(i>0&&i<r&&isLowSurrogate(e.charCodeAt(i))&&isHighSurrogate(e.charCodeAt(i-1))&&(i+=1),a>0&&a<r&&isHighSurrogate(e.charCodeAt(a-1))&&isLowSurrogate(e.charCodeAt(a))&&--a,e.slice(i,a))}function truncateUtf16Safe(e,t){let n=Math.max(0,Math.floor(t));return e.length<=n?e:sliceUtf16Safe(e,0,n)}function init_src(){return(init_src=__esmMin((()=>{init_cjk_chars(),init_number_coercion()})))()}function pruneMapToMaxSize(e,t){if(Number.isNaN(t)||t===1/0)return;let n=Math.max(0,Math.floor(t));if(n<=0){e.clear();return}for(let t of e.keys()){if(e.size<=n)break;e.delete(t)}}function createParseFrame(){return{lastToken:null,containsRepetition:!1,hasAlternation:!1,branchMinLength:0,branchMaxLength:0,altMinLength:null,altMaxLength:null}}function addLength(e,t){return!Number.isFinite(e)||!Number.isFinite(t)?1/0:e+t}function multiplyLength(e,t){return Number.isFinite(e)?e*t:t===0?0:1/0}function recordAlternative(e){if(e.altMinLength===null||e.altMaxLength===null){e.altMinLength=e.branchMinLength,e.altMaxLength=e.branchMaxLength;return}e.altMinLength=Math.min(e.altMinLength,e.branchMinLength),e.altMaxLength=Math.max(e.altMaxLength,e.branchMaxLength)}function readQuantifier(e,t){let n=e[t],r=e[t+1]===`?`?2:1;if(n===`*`)return{consumed:r,minRepeat:0,maxRepeat:null};if(n===`+`)return{consumed:r,minRepeat:1,maxRepeat:null};if(n===`?`)return{consumed:r,minRepeat:0,maxRepeat:1};if(n!==`{`)return null;let i=t+1;for(;i<e.length&&/\d/.test(e.charAt(i));)i+=1;if(i===t+1)return null;let a=Number.parseInt(e.slice(t+1,i),10),o=a;if(e[i]===`,`){i+=1;let t=i;for(;i<e.length&&/\d/.test(e.charAt(i));)i+=1;o=i===t?null:Number.parseInt(e.slice(t,i),10)}return e[i]!==`}`||(i+=1,e[i]===`?`&&(i+=1),o!==null&&o<a)?null:{consumed:i-t,minRepeat:a,maxRepeat:o}}function hasNestedRepetition(e){let t=[createParseFrame()],n=!1,emitToken=e=>{let n=expectDefined(t[t.length-1],`frames entry at frames.length 1`);n.lastToken=e,e.containsRepetition&&(n.containsRepetition=!0),n.branchMinLength=addLength(n.branchMinLength,e.minLength),n.branchMaxLength=addLength(n.branchMaxLength,e.maxLength)},emitSimpleToken=()=>{emitToken({containsRepetition:!1,hasAmbiguousAlternation:!1,minLength:1,maxLength:1})};for(let r=0;r<e.length;r+=1){let i=e[r];if(n){i===`\\`?r+=1:i===`]`&&(n=!1);continue}if(i===`\\`){r+=1,emitSimpleToken();continue}if(i===`[`){n=!0,emitSimpleToken();continue}if(i===`(`){t.push(createParseFrame());continue}if(i===`)`){if(t.length>1){let e=t.pop();e.hasAlternation&&recordAlternative(e);let n=e.hasAlternation?e.altMinLength??0:e.branchMinLength,r=e.hasAlternation?e.altMaxLength??0:e.branchMaxLength;emitToken({containsRepetition:e.containsRepetition,hasAmbiguousAlternation:e.hasAlternation&&e.altMinLength!==null&&e.altMaxLength!==null&&e.altMinLength!==e.altMaxLength,minLength:n,maxLength:r})}continue}if(i===`|`){let e=expectDefined(t[t.length-1],`frames entry at frames.length 1`);e.hasAlternation=!0,recordAlternative(e),e.branchMinLength=0,e.branchMaxLength=0,e.lastToken=null;continue}let a=readQuantifier(e,r);if(!a){emitSimpleToken();continue}r+=a.consumed-1;let o=expectDefined(t[t.length-1],`frames entry at frames.length 1`),s=o.lastToken;if(!s)continue;if(s.containsRepetition||s.hasAmbiguousAlternation&&a.maxRepeat===null)return!0;let c=s.minLength,l=s.maxLength;s.minLength=multiplyLength(s.minLength,a.minRepeat),s.maxLength=a.maxRepeat===null?1/0:multiplyLength(s.maxLength,a.maxRepeat),s.containsRepetition=!0,o.containsRepetition=!0,o.branchMinLength=o.branchMinLength-c+s.minLength,o.branchMaxLength=addLength(Number.isFinite(o.branchMaxLength)&&Number.isFinite(l)?o.branchMaxLength-l:1/0,s.maxLength)}return!1}function compileSafeRegexDetailed(e,t=``){let n=e.trim();if(!n)return{regex:null,source:n,flags:t,reason:`empty`};let r=`${t}::${n}`,i=Wt.get(r);if(i)return i;let a;if(hasNestedRepetition(n))a={regex:null,source:n,flags:t,reason:`unsafe-nested-repetition`};else try{a={regex:new RegExp(n,t),source:n,flags:t,reason:null}}catch{a={regex:null,source:n,flags:t,reason:`invalid-regex`}}return Wt.set(r,a),pruneMapToMaxSize(Wt,Ut),a}var Ut,Wt;function init_safe_regex(){return(init_safe_regex=__esmMin((()=>{init_src(),Ut=256,Wt=/* @__PURE__ */ new Map})))()}function normalizeRejectReason(e){return e.reason===null||e.reason===`empty`?null:e.reason}function compileConfigRegex(e,t=``){let n=compileSafeRegexDetailed(e,t);return n.reason===`empty`?null:{regex:n.regex,pattern:n.source,flags:n.flags,reason:normalizeRejectReason(n)}}function init_config_regex(){return(init_config_regex=__esmMin((()=>{init_safe_regex()})))()}function isPlainObject$2(e){return typeof e==`object`&&!!e&&!Array.isArray(e)&&Object.prototype.toString.call(e)===`[object Object]`}function isBlockedObjectKey(e){return Gt.has(e)}var Gt;function init_prototype_keys(){return(init_prototype_keys=__esmMin((()=>{Gt=/* @__PURE__ */ new Set([`__proto__`,`prototype`,`constructor`])})))()}function appendConfigPathSegment(e,t){return typeof t==`number`?`${e}[${t}]`:/^[A-Za-z_$][A-Za-z0-9_$:-]*$/.test(t)?e?`${e}.${t}`:t:`${e}[${JSON.stringify(t)}]`}var Kt;function init_ref_contract(){return(init_ref_contract=__esmMin((()=>{Kt=`default`})))()}function parseEnvTemplateSecretRef(e,t=Kt){if(typeof e!=`string`)return null;let n=e.trim(),r=qt.exec(n)??Jt.exec(n);return r?{source:`env`,provider:t.trim()||`default`,id:expectDefined(r[1],`types.secrets regex capture 1`)}:null}var qt,Jt;function init_types_secrets(){return(init_types_secrets=__esmMin((()=>{init_src(),init_ref_contract(),qt=/^\$\{([A-Z][A-Z0-9_]{0,127})\}$/,Jt=/^\$([A-Z][A-Z0-9_]{0,127})$/})))()}function renderEnvTemplateToken(e){return e.defaultValue===void 0?`\${${e.name}}`:`\${${e.name}${Xt}${e.defaultValue}}`}function*iterateEnvTemplateTokens(e){for(let t=e.indexOf(`$`);t!==-1;t=e.indexOf(`$`,t+1)){let n=e[t+1]===`$`&&e[t+2]===`{`;if(!n&&e[t+1]!==`{`)continue;let r=t+(n?3:2),i=e.indexOf(`}`,r);if(i===-1)continue;let a=e.slice(r,i),o=a.indexOf(Xt),s=o===-1?a:a.slice(0,o),c=o===-1?void 0:a.slice(o+2);!Yt.test(s)||c?.includes(`$`)||c?.includes(`{`)||(yield{kind:n?`escaped`:`substitution`,name:s,defaultValue:c,start:t,end:i},t=i)}}function substituteString(e,t,n,r){if(!e.includes(`$`))return e;let i=parseEnvTemplateSecretRef(e);i&&!containsEnvVarReference(e)&&r?.onPendingEnvSecretRef?.(i.id,n);let a=[],o=0;for(let s of iterateEnvTemplateTokens(e)){if(a.push(e.slice(o,s.start)),o=s.end+1,s.kind===`escaped`){a.push(renderEnvTemplateToken(s));continue}let c=t[s.name];if(c===void 0||c===``){if(s.defaultValue!==void 0){a.push(s.defaultValue);continue}if(r?.onMissing){r.onMissing({varName:s.name,configPath:n}),i?.id===s.name&&r.onPendingEnvSecretRef?.(s.name,n),a.push(renderEnvTemplateToken(s));continue}throw new MissingEnvVarError(s.name,n)}i?.id===s.name&&r?.onResolvedEnvSecretRef?.(s.name,n),a.push(c)}return a.push(e.slice(o)),a.join(``)}function containsEnvVarReference(e){for(let t of iterateEnvTemplateTokens(e))if(t.kind===`substitution`)return!0;return!1}function resolveConfigEnvVars(e,t=process.env,n){let r=[],visit=(e,i)=>{if(typeof e==`string`)return substituteString(e,t,i,n);if(Array.isArray(e)){let t=e.length,n=[];n.length=t;let a=0;return r.push(()=>{for(;a<t;){let t=a++;if(t in e)return n[t]=visit(e[t],`${i}[${t}]`),!0}return!1}),n}if(isPlainObject$2(e)){let t={},n=Object.entries(e)[Symbol.iterator]();return r.push(()=>{let e=n.next();if(e.done)return!1;let[r,a]=e.value;return t[r]=visit(a,appendConfigPathSegment(i,r)),!0}),t}return e},i=visit(e,``);for(let e=r.at(-1);e;e=r.at(-1))e()||r.pop();return i}var Yt,Xt,MissingEnvVarError;function init_env_substitution(){return(init_env_substitution=__esmMin((()=>{init_types_secrets(),Yt=/^[A-Z_][A-Z0-9_]*$/,Xt=`:-`,MissingEnvVarError=class extends Error{constructor(e,t){super(`Missing env var "${e}" referenced at config path: ${t}`),this.varName=e,this.configPath=t,this.name=`MissingEnvVarError`}}})))()}function normalizeMaxBytes(e,t={}){let n=e===void 0?t.defaultValue:e;if(n===void 0||n===1/0)return n;if(!Number.isSafeInteger(n)||n<0)throw RangeError(`maxBytes must be a non-negative safe integer or Infinity`);return n}function recordFileObservationFailure(e,t){let n=Zt.getStore();if(!n)return;let r=n.get(e);r||n.set(e,r=/* @__PURE__ */ new Set),r.add(t)}var Zt,Qt=__esmMin((()=>{Zt=new S}));function fileIdentityMismatchError(){let e=new FsSafeError(`path-mismatch`,`file identity changed or could not be verified`);return recordFileObservationFailure(e,`identity`),e}function inspectFileIdentitySync(e,t,n=process.platform,r=fileIdentityMismatchError){let i,a;if(t&&(i=t.dev,typeof i!=`bigint`||(a=t.ino,typeof a!=`bigint`)||n===`win32`&&(i===0n||a===0n)))throw r();for(let t=0;t<2;t++){let t=e(),o=!0,s=t.dev;if(typeof s!=`bigint`)throw r();if(n===`win32`&&s===0n)o=!1;else{if(i!==void 0&&i!==s)throw r();i=s}let c=t.ino;if(typeof c!=`bigint`)throw r();if(n===`win32`&&c===0n)o=!1;else{if(a!==void 0&&a!==c)throw r();a=c}if(o)return t}throw r()}var $t=__esmMin((()=>{E(),Qt()}));function directoryComponentNotDirectoryError(e){return e===void 0?new FsSafeError(`not-file`,`directory component must be a directory`):new FsSafeError(`not-file`,`directory component must be a directory`,{cause:e})}function hardlinkedPathNotAllowedError(){return new FsSafeError(`hardlink`,`hardlinked path not allowed`)}function errorCauseOptions(e){return{cause:e instanceof Error?e:void 0}}var en=__esmMin((()=>{E()}));function directoryEntryPath(e,t=process.platform){let n=t===`win32`;if(typeof e==`string`){let t=e[e.length-1];if(t!==`/`&&(!n||t!==`\\`))return e}let r=(n?w.win32:w.posix).parse(e).root.length;if(n&&/^[\\/]{2}[?.][\\/]UNC[\\/]/i.test(e)){let t=w.win32.parse(`\\\\${e.slice(8)}`).root;t.length>1&&(r=Math.max(r,t.length+6))}let i=e.length;for(;i>r&&(e[i-1]===`/`||n&&e[i-1]===`\\`);)i--;return i===r||i===e.length?e:e.slice(0,i)}var tn=__esmMin((()=>{}));function safeNumber(e){return typeof e==`number`&&Number.isSafeInteger(e)&&e>=0}function safeExpected(e){return typeof e.dev==`bigint`&&typeof e.ino==`bigint`&&e.dev>=0n&&e.ino>=0n&&e.dev<=9007199254740991n&&e.ino<=9007199254740991n}function observeStatSync(e,t,n,r=process.platform,i){if(r===`win32`||!n&&t&&!safeExpected(t)){let a=inspectFileIdentitySync(()=>{let t=n;return n=void 0,t??e(!0)},t,r);return i?{stat:a,identity:t??{dev:a.dev,ino:a.ino}}:a}let a=n??e(!1),{dev:o,ino:s}=a,c=safeNumber(o),l=safeNumber(s),u=c?BigInt(o):typeof o==`bigint`?o:void 0,d=l?BigInt(s):typeof s==`bigint`?s:void 0;if(t&&(u!==void 0&&u!==t.dev||d!==void 0&&d!==t.ino))throw fileIdentityMismatchError();if(c&&l)return i?{stat:a,identity:t??{dev:u,ino:d}}:a;let f=inspectFileIdentitySync(()=>{let t=e(!0);if(u!==void 0&&t.dev!==u||d!==void 0&&t.ino!==d)throw fileIdentityMismatchError();return t},t,r);return i?{stat:f,identity:t??{dev:f.dev,ino:f.ino}}:f}function inspectStatObservationSync(e,t,n,r=process.platform){return observeStatSync(e,t,n,r,!0)}var nn=__esmMin((()=>{$t()}));function directoryOperationPath(e){return assertNoWindowsPathAlias(e,`filesystem`),pathForWindowsFilesystem(directoryEntryPath(e))}function inspectDirectoryIdentitySync(e,t,n,r=process.platform){return inspectDirectoryIdentityAtPathSync(directoryOperationPath(e),t===void 0?void 0:{dev:t.dev,ino:t.ino},n,r)}function inspectDirectoryIdentityAtPathSync(e,t,n,r=process.platform){return inspectFileIdentitySync(()=>{let t=n??C.lstatSync(e,{bigint:!0});if(n=void 0,t.isSymbolicLink()||!t.isDirectory())throw directoryComponentNotDirectoryError();return t},t,r)}function extendDirectoryObservationGuard(e,t,n){let r=e;return r.dir=t,r.realPath=n,r}var rn=__esmMin((()=>{$t(),en(),at(),tn()}));function formatErrorDetail(e){return e.replace(an,e=>`\\u${e.charCodeAt(0).toString(16).padStart(4,`0`)}`)}function shortPath(e){let t=de.homedir(),n=t.endsWith(w.sep)?t:`${t}${w.sep}`;return formatErrorDetail(e===t?`~`:e.startsWith(n)?`~${w.sep}${e.slice(n.length)}`:e)}var an;function init_error_detail(){return(init_error_detail=__esmMin((()=>{an=/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/gu})))()}function rootPathEscapeError(e){let t=Error(e);return on.add(t),t}function sanitizeRootPathError(e){return e instanceof Error&&(e.message=formatErrorDetail(e.message)),e}function pathEscapeError(e){return rootPathEscapeError(`Path escapes ${e.boundaryLabel} (${shortPath(e.rootPath)}): ${shortPath(e.absolutePath)}`)}function symlinkEscapeError(e){return rootPathEscapeError(`Symlink escapes ${e.boundaryLabel} (${shortPath(e.rootCanonicalPath)}): ${shortPath(e.symlinkPath)}`)}var on;function init_root_path_errors(){return(init_root_path_errors=__esmMin((()=>{init_error_detail(),on=/* @__PURE__ */ new WeakSet})))()}function statIdentityFromNative(e){return e<=9223372036854775807n||process.versions.bun?e:BigInt.asIntN(64,e)}function isNativeStatIdentity(e){return typeof e==`bigint`&&e>=0n&&e<=18446744073709551615n}var sn=__esmMin((()=>{}));function validateNativeDirectoryObservation(e){if(!e||!isNativeStatIdentity(e.dev)||!isNativeStatIdentity(e.ino)||typeof e.realPath!=`string`||e.realPath.includes(`\0`)||!w.isAbsolute(e.realPath)&&!w.win32.isAbsolute(e.realPath))throw new FsSafeError(`path-mismatch`,`native directory observation is invalid`);let t=statIdentityFromNative(e.dev),n=statIdentityFromNative(e.ino);return t===e.dev&&n===e.ino?e:{...e,dev:t,ino:n}}function inspectNativeDirectoryObservation(e,t,n,r=process.platform){return inspectFileIdentitySync(()=>validateNativeDirectoryObservation(e.observeDirectory(t)),n,r)}function extendNativeDirectoryObservationGuard(e,t){let n=e;return n.dir=t,n.identity=n,n.nativeDirectoryObservation=!0,n}function isNativeDirectoryObservationGuard(e){return typeof e==`object`&&!!e&&e.nativeDirectoryObservation===!0}function init_native_directory_observation(){return(init_native_directory_observation=__esmMin((()=>{E(),$t(),sn()})))()}function windowsComparisonSpelling(e){return/^\\\\\?\\UNC\\/i.test(e)?`\\\\${e.slice(8)}`:e.startsWith(`\\\\?\\`)?e.slice(4):e}function trimWindowsTrailingSeparators(e){let t=w.win32.parse(e).root.length,n=e.length;for(;n>t&&e[n-1]===`\\`;)--n;return e.slice(0,n)}function trimWindowsLeadingSeparators(e){let t=0;for(;e[t]===`\\`;)t+=1;return e.slice(t)}function exactWindowsRootPrefix(e,t){let n=trimWindowsTrailingSeparators(e.replaceAll(`/`,`\\`)),r=t.replaceAll(`/`,`\\`),i;if(r===n)i=``;else{let e=n.endsWith(`\\`)?n:`${n}\\`;if(!r.startsWith(e))return;i=trimWindowsLeadingSeparators(r.slice(e.length))}return{admission:`exact`,candidateRootPath:n,path:i===``?n:`${n}${n.endsWith(`\\`)?``:`\\`}${i}`,relativePath:i}}function windowsRootPrefix(e,t){let n=exactWindowsRootPrefix(e,t);if(n)return n;let r=w.win32.normalize(e.replaceAll(`/`,`\\`)),i=windowsComparisonSpelling(r),a=t.replaceAll(`/`,`\\`),o=windowsComparisonSpelling(a),s=trimWindowsTrailingSeparators(r),c=trimWindowsTrailingSeparators(i);if(!w.win32.isAbsolute(a))return;let l,u,d;if(o===c)l=``,u=a,d=`exact`;else if(o.toLowerCase()===c.toLowerCase())l=``,u=a,d=`identity`;else{let e=c.endsWith(`\\`)?c:`${c}\\`,t=o.slice(0,e.length);if(t===e)d=`exact`;else if(t.toLowerCase()===e.toLowerCase())d=`identity`;else return;l=trimWindowsLeadingSeparators(o.slice(e.length)),u=a.slice(0,c.length+(a.length-o.length))}let f=l===``?s:`${s}${s.endsWith(`\\`)?``:`\\`}${l}`;return{candidateRootPath:u,path:f,relativePath:l,admission:d}}function exactRootIdentity(e,t){if(typeof t?.dev==`bigint`&&typeof t.ino==`bigint`)return{dev:t.dev,ino:t.ino};let n=inspectDirectoryIdentitySync(e);return{dev:n.dev,ino:n.ino}}function admitPathInsideRoot(e){if(process.platform!==`win32`||w.sep===`/`&&e.rootPath.startsWith(`/`)&&e.rootPath[1]!==`/`&&e.rootPath[1]!==`\\`){if(e.rootPath.startsWith(`/`)&&e.candidatePath.startsWith(`/`)&&!e.candidatePath.includes(`/..`)&&(e.candidatePath===e.rootPath||e.candidatePath.startsWith(e.rootPath)&&(e.rootPath.endsWith(`/`)||e.candidatePath[e.rootPath.length]===`/`))){let t=e.rootPath.endsWith(`/`)?e.rootPath.length:e.rootPath.length+1;return{admission:`exact`,path:e.candidatePath,relativePath:e.candidatePath===e.rootPath?``:e.candidatePath.slice(t)}}let t=w.resolve(e.rootPath),n=w.resolve(e.candidatePath),r=w.relative(t,n);return isPathRelativeEscape(r)?void 0:{path:n,relativePath:r===`.`?``:r,admission:`exact`}}let t=windowsRootPrefix(e.rootPath,e.candidatePath);if(!t)return;let admitted=()=>({admission:t.admission,path:t.path,relativePath:t.relativePath});if(t.admission===`exact`)return admitted();let n=e.identityCache?.get(t.candidateRootPath);if(n!==void 0)return n?admitted():void 0;try{let n=exactRootIdentity(e.rootPath,e.rootIdentity),r=e.resolveCandidateRoot?tt.native(t.candidateRootPath):t.candidateRootPath;return e.inspectCandidateRoot?e.inspectCandidateRoot(r,n):inspectDirectoryIdentitySync(r,n),e.identityCache?.set(t.candidateRootPath,!0),admitted()}catch{e.identityCache?.set(t.candidateRootPath,!1);return}}function init_root_boundary(){return(init_root_boundary=__esmMin((()=>{rn(),bt(),nt()})))()}function absolutePathWithRawSegments(e){if(w.sep!==`\\`){if(w.isAbsolute(e))return e;let t=process.cwd();return`${t}${t.endsWith(w.sep)?``:w.sep}${e}`}let t=w.sep===`\\`?e.replaceAll(`/`,`\\`):e,n=w.isAbsolute(t);if(n&&t[0]!==`\\`)return t;let r=w.parse(t).root;if(n&&r!==`\\`)return t;let i=r?w.resolve(r):process.cwd();return`${i}${i.endsWith(w.sep)?``:w.sep}${t.slice(r.length)}`}function rawPathRelativeToCanonicalRoot(e,t,n={}){assertNoWindowsPathAlias(e),assertNoWindowsPathAlias(t);let r=absolutePathWithRawSegments(e),i=process.platform===`win32`?r.replaceAll(`/`,w.sep):r;if(isForeignWindowsShareOrDevicePath(i,[t]))return;let a=w.parse(i).root,o=i.slice(a.length).split(w.sep),s=o.findLastIndex(e=>e!==``&&e!==`.`),c=a,l=!1,u=process.platform===`win32`?/* @__PURE__ */ new Map:void 0;for(let r=0;r<o.length;r+=1){c+=`${c.endsWith(w.sep)?``:w.sep}${o[r]}`;let i,a=!1;try{let u=pathForWindowsFilesystem(c),d=C.lstatSync(u);if(a=d.isSymbolicLink(),a&&n.rejectFinalSymlink&&r===s)throw new FsSafeError(`symlink`,`final symlink not allowed`);if(!a&&!d.isDirectory()&&r<o.length-1||(l||=a,i=tt.native(u),assertNoWindowsPathAlias(i),a&&r<o.length-1&&!C.statSync(pathForWindowsFilesystem(i)).isDirectory()))return;if(a&&!isPathInside(t,i)&&!isPathInside(i,t))throw new FsSafeError(`outside-workspace`,`symlink prefix resolves outside the root ancestry: ${formatErrorDetail(e)}`)}catch(e){if(e instanceof FsSafeError)throw e;if(a)return;continue}let d=admitPathInsideRoot({rootPath:t,candidatePath:i,rootIdentity:n.rootIdentity,identityCache:u});if(d){if(n.rejectSymlinks&&l)throw new FsSafeError(`symlink`,`symlink path component not allowed`);return[d.relativePath,...o.slice(r+1)].filter(Boolean).join(w.sep)}}}function pathExists(e){try{return C.lstatSync(pathForWindowsFilesystem(e),{throwIfNoEntry:!1})!==void 0}catch(e){if(isNotFoundPathError(e))return!1;throw e}}function pathExistsSync(e){return C.existsSync(pathForWindowsFilesystem(e))}function resolveExistingAncestor(e,t){let n=t===`native`?pathExists:pathExistsSync,r=t===`native`?tt.native:tt;assertNoWindowsPathAlias(e);let i=resolvePathPreservingWindowsRoot(e);assertNoWindowsPathAlias(i);let a=i,o=w.parse(i).root;for(;a!==o&&!n(a);)a=w.dirname(a);if(!n(a))return i;let s;try{s=r(pathForWindowsFilesystem(a))}catch{return i}assertNoWindowsPathAlias(s);let c=resolvePathPreservingWindowsRoot(s);assertNoWindowsPathAlias(c);let l=a===i?c:w.resolve(c,`.${w.sep}${i.slice(a.length)}`);return assertNoWindowsPathAlias(l),l}function resolveSymlinkHopPath(e,t,n){try{let n=(t===`native`?tt.native:tt)(e);assertNoWindowsPathAlias(n,`filesystem`,`resolved symlink path uses a Windows filesystem namespace alias`);let r=resolvePathPreservingWindowsRoot(n);return assertNoWindowsPathAlias(r,`filesystem`,`resolved symlink path uses a Windows filesystem namespace alias`),r}catch(r){if(isSymlinkOpenError(r)||n&&isNotFoundPathError(r))throw new FsSafeError(`symlink`,`symlink path could not be resolved`,errorCauseOptions(r));if(!isNotFoundPathError(r))throw r;let i=C.readlinkSync(e);assertNoWindowsPathAlias(i,`filesystem`,`symlink target uses a Windows filesystem namespace alias`);let a=resolveExistingAncestor(resolvePathFromBasePreservingWindowsRoot(resolvePathPreservingWindowsRoot(w.dirname(e)),i),t);return assertNoWindowsPathAlias(a,`filesystem`,`resolved symlink path uses a Windows filesystem namespace alias`),a}}function init_root_path_existing(){return(init_root_path_existing=__esmMin((()=>{E(),init_error_detail(),bt(),nt(),at(),init_root_boundary(),en()})))()}function straightTraversalPath(e){if(e.length===0)return!1;let t=process.platform===`win32`,n=0;for(let r=0;r<=e.length;r+=1){if(!(r===e.length||e[r]===`/`||t&&e[r]===`\\`))continue;let i=r-n;if(i===0||i===1&&e.charCodeAt(n)===46||i===2&&e.charCodeAt(n)===46&&e.charCodeAt(n+1)===46)return!1;n=r+1}return!0}function createRootPathTraversalObservation(e,t){let{state:n}=e,r=n.finalComponentIndex<0&&(n.relativePath===``||n.relativePath===`.`);if(!t||!e.observationEligible||t.rootGuard.dir!==e.rootCanonicalPath||t.rootGuard.realPath!==e.rootCanonicalPath||e.rootPath!==e.rootCanonicalPath||!r&&!straightTraversalPath(n.relativePath)||!r&&n.finalComponentIndex!==n.segments.length-1)return;if(n.finalComponentIndex>=0){let e=t.kind===`stat`?n.finalComponentIndex-1:n.finalComponentIndex;return{enabled:!0,request:t,targetIndex:n.finalComponentIndex,directoryIndex:e,directoryGuard:e<0?t.rootGuard:void 0,directoryObserver:e<0?void 0:t.directoryObserver}}if(!r)return;let i=t.rootGuard,a=t.kind===`stat`?void 0:t.directoryObserver;if(t.kind===`directory`){if(a)try{let n=inspectNativeDirectoryObservation(a,t.rootGuard.dir,t.rootGuard.identity),r=admitPathInsideRoot({rootPath:e.rootCanonicalPath,candidatePath:n.realPath,rootIdentity:e.resolveParams.rootIdentity});if(!r||r.relativePath!==``)throw new FsSafeError(`path-mismatch`,`root path changed during operation`);n.realPath=r.path,i=extendNativeDirectoryObservationGuard(n,t.rootGuard.dir)}catch(e){if(e instanceof FsSafeError&&e.code===`path-mismatch`)throw new RootPathObservationError(e);a=void 0}if(!a)try{let n=admitPathInsideRoot({rootPath:e.rootCanonicalPath,candidatePath:tt.native(t.rootGuard.dir),rootIdentity:e.resolveParams.rootIdentity});if(!n||n.relativePath!==``)throw new FsSafeError(`path-mismatch`,`root path changed during operation`)}catch(e){throw new RootPathObservationError(e)}}return{enabled:!0,request:t,targetIndex:-1,directoryIndex:-1,directoryGuard:i,directoryObserver:a,targetPath:e.rootCanonicalPath,target:i}}function inspectRootPathTraversalEntry(e,t,n){if(t&&n.directoryObserver)try{return extendNativeDirectoryObservationGuard(inspectNativeDirectoryObservation(n.directoryObserver,e),e)}catch{n.directoryObserver=void 0}let r=process.platform===`win32`?C.lstatSync(e,{bigint:!0}):C.lstatSync(e);if(r.isSymbolicLink()||t&&!r.isDirectory())return{stat:r};try{return inspectStatObservationSync(t=>t?C.lstatSync(e,{bigint:!0}):C.lstatSync(e),void 0,r)}catch(e){throw e instanceof FsSafeError&&e.code===`path-mismatch`?new RootPathObservationError(e):e}}function captureRootPathObservedDirectory(e,t,n,r,i,a){if(!isNativeDirectoryObservationGuard(t)&&!t.stat.isDirectory())return!1;let o;try{o=isNativeDirectoryObservationGuard(t)?t.realPath:tt.native(r)}catch(e){throw new RootPathObservationError(e)}let s=admitPathInsideRoot({rootPath:i,candidatePath:o,rootIdentity:a});if(!s)throw new RootPathObservationError(new FsSafeError(`outside-workspace`,`directory is outside workspace root`));return isNativeDirectoryObservationGuard(t)?(t.dir=n,t.realPath=s.path,e.directoryGuard=t):e.directoryGuard=extendDirectoryObservationGuard(t,n,s.path),!0}var RootPathObservationError;function init_root_path_observation(){return(init_root_path_observation=__esmMin((()=>{rn(),E(),init_native_directory_observation(),init_root_boundary(),nt(),nn(),RootPathObservationError=class extends Error{error;parentReceipt;traversalFailure;constructor(e,t,n=!1){super(`root path observation failed`,{cause:e}),this.error=e,this.parentReceipt=t,this.traversalFailure=n,this.name=`RootPathObservationError`}}})))()}function resolveRootPathSyncWithCanonicalRootObservation(e,t){return resolveRootPathInternal(e,{mode:`ordinary`,observeRoot:t})}function resolveRootPathInternal(e,t={}){try{return traverseRootPath(e,t)}catch(e){throw sanitizeRootPathError(e)}}function prepareRootTraversal(e,t,n,r,i){let a=i,o=!1;if(isForeignWindowsShareOrDevicePath(a,[t,n]))throw pathEscapeError({rootPath:t,absolutePath:a,boundaryLabel:e.boundaryLabel});let s=admitRawPathInsideRoot(t,a,e.rootIdentity);if(s)a=s.path,o=s.admission===`identity`;else{let r=admitRawPathInsideRoot(n,a,e.rootIdentity),i=r?.relativePath??rawPathRelativeToCanonicalRoot(a,n,e);if(i===void 0)throw pathEscapeError({rootPath:t,absolutePath:a,boundaryLabel:e.boundaryLabel});o=r?.admission===`identity`,a=i===``?t:`${t}${w.sep}${i}`}return{params:e,rawAbsolutePath:a,rootPath:t,rootCanonicalPath:n,absolutePath:o?resolvePathPreservingWindowsRoot(a):r,observationEligible:a===i&&!o}}function captureValidRootPathInputs(e){let t=e.rootPath;assertNoNulPathInput(t,`root path contains a NUL byte`);let n=e.absolutePath;assertNoNulPathInput(n,`absolute path contains a NUL byte`),assertNoWindowsPathAlias(t,`filesystem`,`root path uses a Windows filesystem namespace alias`),assertNoWindowsPathAlias(n,`filesystem`,`absolute path uses a Windows filesystem namespace alias`),assertNoEmbeddedDriveRelativeSegment(t,`root path`),assertNoEmbeddedDriveRelativeSegment(n,`absolute path`);let r=e.rootCanonicalPath;r!==void 0&&(assertNoNulPathInput(r,`canonical root path contains a NUL byte`),assertNoWindowsPathAlias(r,`filesystem`,`canonical root path uses a Windows filesystem namespace alias`),assertNoEmbeddedDriveRelativeSegment(r,`canonical root path`));let i=e.policy,a=e.rootIdentity;return{rootPath:t,absolutePath:n,rootCanonicalPath:r,rootIdentity:a==null?void 0:{dev:a.dev,ino:a.ino},boundaryLabel:e.boundaryLabel,policy:i==null?void 0:{allowFinalSymlinkForUnlink:i.allowFinalSymlinkForUnlink},rejectSymlinks:e.rejectSymlinks,rejectFinalSymlink:e.rejectFinalSymlink,rejectUnresolvedSymlinks:e.rejectUnresolvedSymlinks}}function assertNoEmbeddedDriveRelativeSegment(e,t){if(process.platform!==`win32`)return;let n=w.parse(e).root;assertNoDriveRelativePathSegments(e.slice(n.length).replaceAll(`\\`,`/`),t)}function createLexicalTraversalContext(e){let t=admitRawPathInsideRoot(e.rootPath,e.rawAbsolutePath,e.params.rootIdentity)?.relativePath;if(t===void 0)throw Error(`Path traversal must begin at the root`);let n=splitTraversalSegments(t);return{state:{segments:n,relativePath:t,reuseLexicalCanonical:!1,finalComponentIndex:n.findLastIndex(e=>e!==`.`),allowFinalSymlink:e.params.policy?.allowFinalSymlinkForUnlink===!0,canonicalCursor:e.rootCanonicalPath,lexicalCursor:e.rootPath,preserveFinalSymlink:!1,missingDepth:0},resolveParams:e.params,rootPath:e.rootPath,rootCanonicalPath:e.rootCanonicalPath,absolutePath:e.absolutePath,observationEligible:e.observationEligible}}function createLexicalTraversalObservation(e,t){let n=createRootPathTraversalObservation(e,t);return n&&n.targetIndex>=0&&(e.state.reuseLexicalCanonical=!0),n}function splitTraversalSegments(e){let t=e.split(process.platform===`win32`?/[\\/]+/:/\/+/).filter(Boolean);return(e.endsWith(`/`)||process.platform===`win32`&&e.endsWith(`\\`))&&t.push(`.`),t}function admitRawPathInsideRoot(e,t,n){if(!w.isAbsolute(t))return;let r=e,i=process.platform===`win32`?t.replaceAll(`/`,w.sep):t;if(process.platform===`win32`)return admitPathInsideRoot({rootPath:r,candidatePath:i,rootIdentity:n});if(i===r)return{admission:`exact`,path:i,relativePath:``};let a=r.endsWith(w.sep)?r:`${r}${w.sep}`;return i.slice(0,a.length)===a?{admission:`exact`,path:i,relativePath:i.slice(a.length)}:void 0}function assertLexicalCursorInsideBoundary(e,t){return assertInsideBoundary({boundaryLabel:e.resolveParams.boundaryLabel,rootCanonicalPath:e.rootCanonicalPath,rootIdentity:e.resolveParams.rootIdentity,candidatePath:t,absolutePath:e.absolutePath})}function advanceCanonicalCursorForSegment(e,t){let n=e.state.reuseLexicalCanonical?e.state.lexicalCursor:resolvePathFromBasePreservingWindowsRoot(e.state.canonicalCursor,t);e.state.canonicalCursor=assertLexicalCursorInsideBoundary(e,n)}function disableLexicalTraversalObservation(e,t){t.enabled=!1,e.state.reuseLexicalCanonical=!1}function finalizeLexicalResolution(e,t){return e.state.canonicalCursor=assertLexicalCursorInsideBoundary(e,e.state.canonicalCursor),{absolutePath:e.absolutePath,canonicalPath:e.state.canonicalCursor,rootPath:e.rootPath,rootCanonicalPath:e.rootCanonicalPath,relativePath:relativeInsideRoot(e.rootCanonicalPath,e.state.canonicalCursor),exists:t!==`missing`,kind:t}}function applyResolvedSymlinkHop(e,t){let n;try{n=assertLexicalCursorInsideBoundary(e,t)}catch{throw symlinkEscapeError({boundaryLabel:e.resolveParams.boundaryLabel,rootCanonicalPath:e.rootCanonicalPath,symlinkPath:e.state.lexicalCursor})}e.state.canonicalCursor=n,e.state.lexicalCursor=n}function applyParentTraversalStep(e){e.state.lexicalCursor=resolvePathFromBasePreservingWindowsRoot(e.state.lexicalCursor,`..`),advanceCanonicalCursorForSegment(e,`..`),e.state.missingDepth>0&&--e.state.missingDepth}function assertDirectoryBeforeMoreSegments(e,t,n){if(!n&&!e.isDirectory())throw Object.assign(/* @__PURE__ */ Error(`Path component is not a directory: ${t}`),{code:`ENOTDIR`})}function assertResolvedLinkDirectory(e,t){t||assertDirectoryBeforeMoreSegments(C.statSync(pathForWindowsFilesystem(e)),e,t)}function traverseRootPath(e,{mode:t=`native`,observation:n,observeRoot:r,removalReceipts:i}){let a=captureValidRootPathInputs(e),o=absolutePathWithRawSegments(a.absolutePath),s=resolvePathPreservingWindowsRoot(a.rootPath),c=resolvePathPreservingWindowsRoot(o),l=a.rootCanonicalPath?resolvePathPreservingWindowsRoot(a.rootCanonicalPath):resolveExistingAncestor(s,t);assertNoWindowsPathAlias(s),assertNoWindowsPathAlias(c),assertNoWindowsPathAlias(l),r?.(l);let u=createLexicalTraversalContext(prepareRootTraversal(a,s,l,c,o)),{state:d}=u,f=createLexicalTraversalObservation(u,n?.request);for(let e=0;e<d.segments.length;e+=1){let n=d.segments[e]??``,r=e===d.segments.length-1;if(n===`.`)continue;if(n===`..`){applyParentTraversalStep(u);continue}if(d.lexicalCursor=w.join(d.lexicalCursor,n),d.missingDepth>0){advanceCanonicalCursorForSegment(u,n),d.missingDepth+=1;continue}let a,o;try{if(i&&!r){let e=C.lstatSync(pathForWindowsFilesystem(d.lexicalCursor),{bigint:!0});e.isDirectory()&&!e.isSymbolicLink()&&i.observeDirectory(d.lexicalCursor,e),a=e}else{let t=f?.enabled===!0&&e===f.directoryIndex,n=f?.enabled===!0&&e===f.targetIndex;(t||n)&&(o=inspectRootPathTraversalEntry(d.lexicalCursor,t,f)),a=isNativeDirectoryObservationGuard(o)?void 0:o?.stat??C.lstatSync(d.lexicalCursor)}}catch(t){if(f?.enabled&&f.request.kind===`stat`&&e===f.targetIndex&&f.directoryGuard){let e={kind:`stat-parent`,rootGuard:f.request.rootGuard,directoryGuard:f.directoryGuard,directoryObserver:f.directoryObserver,targetPath:d.lexicalCursor};throw new RootPathObservationError(t instanceof RootPathObservationError?t.error:sanitizeRootPathError(t),e,!(t instanceof RootPathObservationError))}if(!isNotFoundPathError(t))throw t;advanceCanonicalCursorForSegment(u,n),d.missingDepth=1;continue}if(isNativeDirectoryObservationGuard(o)){advanceCanonicalCursorForSegment(u,n),captureRootPathObservedDirectory(f,o,d.lexicalCursor,d.canonicalCursor,u.rootCanonicalPath,u.resolveParams.rootIdentity),e===f.targetIndex&&(f.targetPath=d.canonicalCursor,f.target=o);continue}if(!a)throw Error(`directory observation did not return metadata`);let s=a.isSymbolicLink();if(s||assertDirectoryBeforeMoreSegments(a,d.lexicalCursor,r),s&&(u.resolveParams.rejectFinalSymlink===!0&&e===d.finalComponentIndex||u.resolveParams.rejectSymlinks===!0&&r))throw new FsSafeError(`symlink`,`symlink path component not allowed`);let c=s&&d.allowFinalSymlink&&r;if(!s||c){if(d.preserveFinalSymlink=c,advanceCanonicalCursorForSegment(u,n),f?.enabled&&s&&disableLexicalTraversalObservation(u,f),f?.enabled&&e===f.directoryIndex&&(o?.identity&&captureRootPathObservedDirectory(f,o,d.canonicalCursor,d.canonicalCursor,u.rootCanonicalPath,u.resolveParams.rootIdentity)||disableLexicalTraversalObservation(u,f)),f?.enabled&&e===f.targetIndex&&(f.targetPath=d.canonicalCursor,f.target=o?.identity?o:void 0),d.preserveFinalSymlink)break;continue}f?.enabled&&disableLexicalTraversalObservation(u,f);let l=resolveSymlinkHopPath(d.lexicalCursor,t,u.resolveParams.rejectUnresolvedSymlinks);if(applyResolvedSymlinkHop(u,l),u.resolveParams.rejectSymlinks===!0)throw new FsSafeError(`symlink`,`symlink path component not allowed`);assertResolvedLinkDirectory(l,r)}let p=f?.enabled===!0&&f.directoryGuard!==void 0&&f.targetPath===d.canonicalCursor&&f.target!==void 0,m=p?isNativeDirectoryObservationGuard(f.target)?`directory`:toResolvedKind(f.target.stat):getPathKindSync(d.canonicalCursor,d.preserveFinalSymlink);return p&&n&&(n.receipt={kind:f.request.kind,rootGuard:f.request.rootGuard,directoryGuard:f.directoryGuard,directoryObserver:f.directoryObserver,targetPath:f.targetPath,target:f.target}),finalizeLexicalResolution(u,m)}function getPathKindSync(e,t){try{let n=pathForWindowsFilesystem(e);return toResolvedKind(t?C.lstatSync(n):C.statSync(n))}catch(e){if(isNotFoundPathError(e))return`missing`;throw e}}function toResolvedKind(e){return e.isFile()?`file`:e.isDirectory()?`directory`:e.isSymbolicLink()?`symlink`:`other`}function relativeInsideRoot(e,t){let n=w.relative(resolvePathPreservingWindowsRoot(e),resolvePathPreservingWindowsRoot(t));return!n||n===`.`||isPathRelativeEscape(n)?``:n}function assertInsideBoundary(e){let t=admitPathInsideRoot({rootPath:e.rootCanonicalPath,candidatePath:e.candidatePath,rootIdentity:e.rootIdentity});if(t)return t.path;throw Error(`Path resolves outside ${e.boundaryLabel} (${shortPath(e.rootCanonicalPath)}): ${shortPath(e.absolutePath)}`)}function init_root_path(){return(init_root_path=__esmMin((()=>{init_error_detail(),init_root_path_errors(),E(),init_native_directory_observation(),bt(),init_root_path_existing(),init_root_boundary(),init_root_path_observation(),gt(),at(),Object.freeze({allowFinalSymlinkForUnlink:!1,allowFinalHardlinkForUnlink:!1}),Object.freeze({allowFinalSymlinkForUnlink:!0,allowFinalHardlinkForUnlink:!0})})))()}function resolveReadOpenFlags(e){let t=e?.constants??C.constants,n=process.platform!==`win32`&&e?.followSymlinks!==!0&&typeof t.O_NOFOLLOW==`number`?t.O_NOFOLLOW:0,r=process.platform!==`win32`&&typeof t.O_NONBLOCK==`number`?t.O_NONBLOCK:0;return t.O_RDONLY|n|r}function init_read_open_flags(){return(init_read_open_flags=__esmMin((()=>{})))()}function exactFileIdentity(e){let{dev:t,ino:n}=e;if(typeof t!=`bigint`&&!Number.isSafeInteger(t)||typeof n!=`bigint`&&!Number.isSafeInteger(n))throw new FsSafeError(`path-mismatch`,`file identity is not exact`);return Object.freeze({dev:BigInt(t),ino:BigInt(n)})}function numberStatScalar(e){return Number(typeof e==`bigint`?BigInt.asUintN(64,e):e)}function numberStats(e){let t=Object.create(C.Stats.prototype);for(let n of[`dev`,`mode`,`nlink`,`uid`,`gid`,`rdev`,`blksize`,`ino`,`size`,`blocks`])t[n]=numberStatScalar(e[n]);for(let n of[`atime`,`mtime`,`ctime`,`birthtime`]){let r=e[`${n}Ns`],i=(r%1000000000n+1000000000n)%1000000000n;t[`${n}Ms`]=Number((r-i)/1000000000n)*1e3+Number(i)/1e6}return t}function init_exact_identity(){return(init_exact_identity=__esmMin((()=>{E()})))()}function readSymlinkResolution(e){return{rejectSymlinks:e!==`follow-within-root`&&e!==`follow-parents-within-root`,rejectFinalSymlink:e===`follow-parents-within-root`}}function isExpectedPathError(e){let t=typeof e==`object`&&e&&`code`in e?String(e.code):``;return t===`ENOENT`||t===`ENOTDIR`||t===`ELOOP`}function openPinnedFileSync(e){let t=e.filePath,n=e.resolvedPath,r=e.ioFs??C,i=e.allowedType??`file`,a=e.rejectPathSymlink===!0,o={rejectHardlinks:e.rejectHardlinks,rejectLeafSymlinks:e.rejectLeafSymlinks,maxBytes:e.maxBytes},s=resolveReadOpenFlags({constants:r.constants}),c=e.admittedFd??null;try{if(assertNoWindowsPathAlias(t,`filesystem`,`file path uses a Windows filesystem namespace alias`),n!==void 0&&assertNoWindowsPathAlias(n,`filesystem`,`resolved path uses a Windows filesystem namespace alias`),isUnsafeDeviceReadPath(t)||a&&r.lstatSync(t).isSymbolicLink())return{ok:!1,reason:`validation`};let l=n??(r===C?tt(t):r.realpathSync(t));if(assertNoWindowsPathAlias(l,`filesystem`,`resolved path uses a Windows filesystem namespace alias`),isUnsafeDeviceReadPath(l))return{ok:!1,reason:`validation`};let u=inspectFileIdentitySync(()=>{let e=r.lstatSync(l,{bigint:!0});return assertAllowedStat(e,i,o),e});c??=r.openSync(l,s);let d=inspectFileIdentitySync(()=>{let e=r.fstatSync(c,{bigint:!0});return assertAllowedStat(e,i,o),e},u);inspectFileIdentitySync(()=>{let e=r.lstatSync(l,{bigint:!0});return assertAllowedStat(e,i,o),e},d);let f=e.finalAdmission?.({path:l,descriptorIdentity:d})??l,p=numberStats(d),m={ok:!0,path:f,fd:c,stat:p,identity:d};return c=null,m}catch(e){return e instanceof FsSafeError?{ok:!1,reason:`validation`,error:e}:isExpectedPathError(e)?{ok:!1,reason:`path`,error:e}:{ok:!1,reason:`io`,error:e}}finally{if(c!==null)try{r.closeSync(c)}catch{}}}function assertAllowedStat(e,t,n){if(e.isSymbolicLink()&&n.rejectLeafSymlinks)throw new FsSafeError(`symlink`,`symlink not allowed`);if(e.isSymbolicLink()||!(t===`directory`?e.isDirectory():e.isFile()))throw new FsSafeError(`not-file`,`path does not have the required file type`);if(n.rejectHardlinks&&e.isFile()&&e.nlink>1n)throw new FsSafeError(`hardlink`,`path must not be hardlinked`);if(n.maxBytes!==void 0&&e.isFile()&&e.size>n.maxBytes)throw new FsSafeError(`too-large`,`file exceeds byte limit`)}function init_pinned_open(){return(init_pinned_open=__esmMin((()=>{init_exact_identity(),mt(),E(),$t(),init_read_open_flags(),at(),nt()})))()}function rootIdentityMismatch(e){return new FsSafeError(`path-mismatch`,`canonical root directory identity changed or could not be verified`,e===void 0?{}:{cause:e})}function inspectCanonicalRoot(e,t,n){try{assertNoWindowsPathAlias(t);let r=e===C?pathForWindowsFilesystem(t):t;return inspectFileIdentitySync(()=>{let t=e.lstatSync(r,{bigint:!0});if(!t.isDirectory()||t.isSymbolicLink())throw rootIdentityMismatch();return t},n)}catch(e){throw n&&isExpectedPathError(e)?rootIdentityMismatch(e):e}}function observeCanonicalRoot(e,t){try{let n=inspectCanonicalRoot(e,t),r=Object.freeze({dev:n.dev,ino:n.ino}),i=t;return process.platform===`win32`&&e===C&&(i=tt.native(pathForWindowsFilesystem(t)),i!==t&&inspectCanonicalRoot(e,i,r)),{ok:!0,path:i,identity:r}}catch(e){return{ok:!1,error:e}}}function resolveConsumedPath(e,t){return e===C?tt.native(t):e.realpathSync(t)}function createRootFileFinalAdmission(e,t,n,r=!0){let inspectRoot=(t,n)=>{inspectCanonicalRoot(e,t,n)};return({path:i,descriptorIdentity:a})=>{inspectCanonicalRoot(e,t.path,t.identity);let o=resolveConsumedPath(e,i);assertNoWindowsPathAlias(o,`filesystem`,`resolved file path uses a Windows filesystem namespace alias`);let s=admitPathInsideRoot({rootPath:t.path,candidatePath:o,rootIdentity:t.identity,inspectCandidateRoot:inspectRoot});if(!s)throw new FsSafeError(`outside-workspace`,`resolved path escapes ${n}`);try{let t=inspectFileIdentitySync(()=>e.lstatSync(s.path,{bigint:!0}),a);if(r&&t.isFile()&&t.nlink>1n)throw hardlinkedPathNotAllowedError()}catch(e){throw isExpectedPathError(e)?new FsSafeError(`path-mismatch`,`canonical file identity changed or could not be verified`,{cause:e}):e}return inspectCanonicalRoot(e,t.path,t.identity),s.path}}function init_root_file_final_admission(){return(init_root_file_final_admission=__esmMin((()=>{E(),init_pinned_open(),nt(),init_root_boundary(),en(),$t(),at()})))()}function canUseRootFileOpen(e){return typeof e.openSync==`function`&&typeof e.closeSync==`function`&&typeof e.fstatSync==`function`&&typeof e.lstatSync==`function`&&typeof e.realpathSync==`function`&&typeof e.readFileSync==`function`&&typeof e.constants==`object`&&e.constants!==null}function absoluteRootFilePath(e){if(w.isAbsolute(e))return e;let t=w.parse(e).root;return`${t?w.resolve(t):process.cwd()}${w.sep}${e.slice(t.length)}`}function openRootFileSync(e){let t=e.ioFs??C,n=e.absolutePath,r;try{let i=absoluteRootFilePath(n);assertNoWindowsPathAlias(i);let a=e.rootPath,o=e.rootRealPath,s=e.boundaryLabel,c;r=mapResolvedRootPath(i,s,resolveRootPathSyncWithCanonicalRootObservation({absolutePath:i,rootPath:a,rootCanonicalPath:o,boundaryLabel:s,...readSymlinkResolution(e.symlinks??(e.rejectSymlinks===!1?`follow-within-root`:`reject`)),skipLexicalRootCheck:e.skipLexicalRootCheck},e=>{c=observeCanonicalRoot(t,e)}),c)}catch(e){r=toBoundaryValidationError(e)}return finalizeRootFileOpen({resolved:r,maxBytes:e.maxBytes,rejectHardlinks:e.rejectHardlinks,allowedType:e.allowedType,ioFs:t})}function finalizeRootFileOpen(e){if(`ok`in e.resolved)return e.resolved;let t=e.resolved,n=e.rejectHardlinks??!0,r=openPinnedFileSync({filePath:t.absolutePath,resolvedPath:t.resolvedPath,rejectHardlinks:n,maxBytes:e.maxBytes,allowedType:e.allowedType,ioFs:e.ioFs,admittedFd:e.admittedFd,rejectLeafSymlinks:e.rejectLeafSymlinks,finalAdmission:createRootFileFinalAdmission(e.ioFs,t.rootObservation,t.boundaryLabel,n)});return r.ok?{ok:!0,path:r.path,fd:r.fd,stat:r.stat,exactIdentity:exactFileIdentity(r.identity),rootRealPath:t.rootRealPath}:r}function toBoundaryValidationError(e){return{ok:!1,reason:`validation`,error:e}}function mapResolvedRootPath(e,t,n,r){return r?r.ok?{absolutePath:e,resolvedPath:n.canonicalPath,rootRealPath:r.path,boundaryLabel:t,rootObservation:r}:toRootObservationError(r.error):toBoundaryValidationError(new FsSafeError(`path-mismatch`,`canonical root identity was not observed`))}function toRootObservationError(e){return e instanceof FsSafeError?toBoundaryValidationError(e):isExpectedPathError(e)?{ok:!1,reason:`path`,error:e}:{ok:!1,reason:`io`,error:e}}function init_root_file(){return(init_root_file=__esmMin((()=>{init_exact_identity(),init_root_path(),init_pinned_open(),at(),E(),init_root_file_final_admission()})))()}function validateWindow(e,t){if(!Number.isSafeInteger(t)||t<0||!Number.isSafeInteger(t+e.length))throw RangeError(`read position and window end must be non-negative safe integers`)}function readFileWindowFullySync(e,t,n){validateWindow(t,n);let r=0;for(;r<t.length;){let i=C.readSync(e,t,r,Math.min(t.length-r,cn),n+r);if(i===0)break;r+=i}return r}var cn;function init_positional_read(){return(init_positional_read=__esmMin((()=>{cn=2147483647})))()}function createInitialBuffer(e,t,n=Buffer.allocUnsafe){return n(Math.min(e,t,un)+1)}function createScratchBuffer(e,t=Buffer.allocUnsafe){return t(Math.min(ln,e+1))}function growReadBuffer(e,t,n=Buffer.allocUnsafe){let r=n(Math.min(t+1,Math.max(ln,e.length*2)));return e.copy(r),r}function finishReadBuffer(e,t,n){if(t===0)return Buffer.alloc(0);let r=e.subarray(0,t);if(t>=e.length/2)return r;if(!n)return Buffer.from(r);let i=n(t);return r.copy(i),i}function addReadBytes(e,t,n,r){let i=e+t;if(i>n)throw r?r():new FsSafeError(`too-large`,`file exceeds limit of ${n} bytes (got at least ${i})`);return i}function regularFileSize(e){try{let t=C.fstatSync(e);return t.isFile()&&Number.isSafeInteger(t.size)&&t.size>=0?t.size:void 0}catch{return}}function readBoundedSync(e,t,n={}){normalizeMaxBytes(e);let r=0,{observeRegularFileSize:i,createLimitError:a}=n,o=n.initialSize??i?.(),s=o===void 0?createScratchBuffer(e):createInitialBuffer(e,o);if(o!==void 0){let n=t(s,s.length);if(n===0)return finishReadBuffer(s,0);let o=n<s.length?i?.():void 0;if(r=addReadBytes(r,n,e,a),o!==void 0&&o>0&&n>=o)return finishReadBuffer(s,r)}for(;;){r===s.length&&(s=growReadBuffer(s,e));let n=s.subarray(r),i=t(n,n.length);if(i===0)return finishReadBuffer(s,r);r=addReadBytes(r,i,e,a)}}function readFileDescriptorBoundedSync(e,t){return readBoundedSync(t,(t,n)=>C.readSync(e,t,0,n,null),{initialSize:t<=ln?t:void 0,observeRegularFileSize:()=>regularFileSize(e)})}var ln,un;function init_bounded_read(){return(init_bounded_read=__esmMin((()=>{E(),ln=65536,un=16777216})))()}function getFsSafeTestHooks(){return dn}var dn,pn=__esmMin((()=>{E(),Ze()}));function resolveNonblockingWriteFlag(e=C.constants){return process.platform!==`win32`&&typeof e.O_NONBLOCK==`number`?e.O_NONBLOCK:0}function isNonblockingWriteEnxio(e,t){return hasNodeErrorCode(e,`ENXIO`)&&(t&(C.constants.O_WRONLY|C.constants.O_RDWR))===C.constants.O_WRONLY&&(t&resolveNonblockingWriteFlag())!==0}async function isNonRegularWriteOpenError(e,t,n){return isNonRegularWriteOpenErrorSync(e,t,n)}function isNonRegularWriteOpenErrorSync(e,t,n){if(!isNonblockingWriteEnxio(e,n))return!1;try{return!C.lstatSync(t).isFile()}catch{return!1}}function init_write_open_flags(){return(init_write_open_flags=__esmMin((()=>{bt()})))()}function outsideRootError(e,t){return/* @__PURE__ */ Error(`${e.messagePrefix??`Path`} must stay under ${t}.`)}function pathSegments(e){return e.split(process.platform===`win32`?/[/\\]+/:/\/+/).filter(e=>e.length>0&&e!==`.`)}function rawTargetSegments(e,t){let n=w.parse(t).root,r=`${resolvePathPreservingWindowsRoot(n||`.`)}${w.sep}${t.slice(n.length)}`,i=pathSegments(e),a=pathSegments(r),fold=e=>process.platform===`win32`?e.toLowerCase():e;if(!i.some((e,t)=>fold(e)!==fold(a[t]??``)))return a.slice(i.length)}function resolvePathWalk(e){let t=e.rootDir;assertNoWindowsPathAlias(t,`filesystem`,`root dir uses a Windows filesystem namespace alias`);let n=e.targetPath;assertNoWindowsPathAlias(n,`filesystem`,`target path uses a Windows filesystem namespace alias`);let r=resolvePathPreservingWindowsRoot(t),i=resolvePathPreservingWindowsRoot(n);if(isPathRelativeEscape(w.relative(r,i))){if(e.allowOutsideRoot)return null;throw outsideRootError(e,r)}let a=rawTargetSegments(r,n);if(!a)throw outsideRootError(e,r);return{root:r,segments:a}}function formatUnsafePath(e,t){return`${e.messagePrefix??`Path`} must not traverse symlinked directory: ${t}`}function isFilesystemRoot(e){return e===w.parse(e).root}function assertNoSymlinkParentsSync(e){let t=resolvePathWalk(e);if(!t)return;let n=t.root,r=[];for(let[i,a]of t.segments.entries()){if(a===`..`){let i=r[r.length-1];if(i?.kind===`dir`){r.pop(),n=r[r.length-1]?.path??t.root;continue}if(i?.kind===`symlink`)throw Error(formatUnsafePath(e,i.path));if(!isFilesystemRoot(t.root))throw outsideRootError(e,t.root);continue}n=w.join(n,a);try{let a=C.lstatSync(n);if(a.isSymbolicLink()){if(e.allowRootChildSymlink&&w.dirname(n)===t.root){r.push({path:n,kind:`symlink`});continue}throw Error(formatUnsafePath(e,n))}if((e.requireDirectories||i<t.segments.length-1)&&!a.isDirectory())throw new FsSafeError(`not-file`,`${e.messagePrefix??`Path`} must traverse directories: ${n}`);a.isDirectory()&&r.push({path:n,kind:`dir`})}catch(r){if(hasNodeErrorCode(r,`ENOENT`)&&e.allowMissing!==!1){if(process.platform===`win32`&&t.segments.slice(i+1).includes(`..`))throw new FsSafeError(`invalid-path`,`${e.messagePrefix??`Path`} must not cancel a missing directory: ${n}`);return}throw r}}}function init_symlink_parents(){return(init_symlink_parents=__esmMin((()=>{E(),bt(),at()})))()}function resolveRegularFileAppendFlags(e=C.constants){let t=e.O_NOFOLLOW;return e.O_CREAT|e.O_APPEND|e.O_WRONLY|(typeof t==`number`?t:0)|resolveNonblockingWriteFlag(e)}function assertRegularAppendStat(e,t){if(!e.isFile())throw Error(`Refusing to append to non-file: ${t}`);if(e.nlink>1n)throw Error(`Refusing to append to hardlinked file: ${t}`)}function throwAppendIdentityError(e,t){throw isNotFoundPathError(e)||e instanceof FsSafeError&&e.code===`path-mismatch`?Error(`Refusing to append after file changed: ${t}`,{cause:e}):e}function captureAppendOptions(e){let t=e.filePath;return assertNoWindowsPathAlias(t,`filesystem`,`file path uses a Windows filesystem namespace alias`),{filePath:t,content:e.content,encoding:e.encoding??`utf8`,mode:e.mode??384,maxFileBytes:e.maxFileBytes,rejectSymlinkParents:e.rejectSymlinkParents}}function inspectAppendPath(e){let t=C.lstatSync(e,{bigint:!0});if(t.isSymbolicLink())throw Error(`Refusing to append through symlink: ${e}`);if(!t.isFile())throw Error(`Refusing to append to non-file: ${e}`);return t}function prepareRegularAppend(e,t){if(t===!0){let t=w.dirname(e);assertNoSymlinkParentsSync({rootDir:w.parse(resolvePathPreservingWindowsRoot(t)).root,targetPath:t,allowMissing:!1,allowRootChildSymlink:!0,requireDirectories:!0,messagePrefix:`Refusing to append under`})}try{return inspectFileIdentitySync(()=>inspectAppendPath(e))}catch(e){if(!isNotFoundPathError(e))throw e}}function inspectOpenedRegularAppend(e,t,n){try{let r=inspectFileIdentitySync(()=>{let n=C.fstatSync(e,{bigint:!0});return assertRegularAppendStat(n,t),n},n);return inspectFileIdentitySync(()=>{let e=C.lstatSync(t,{bigint:!0});return assertRegularAppendStat(e,t),e},r),r}catch(e){throwAppendIdentityError(e,t)}}async function appendRegularFile(e){let{filePath:t,content:n,encoding:r,mode:i,maxFileBytes:a,rejectSymlinkParents:o}=captureAppendOptions(e),s=prepareRegularAppend(t,o),c=Buffer.isBuffer(n)?n.byteLength:Buffer.byteLength(n,r);if(a!==void 0&&Number(s?.size??0n)+c>a)return;await getFsSafeTestHooks()?.beforeRegularFileAppendOpen?.(t);let l=resolveRegularFileAppendFlags(),u;try{u=await ue.open(t,l,i)}catch(e){throw await isNonRegularWriteOpenError(e,t,l)?Error(`Refusing to append to non-file: ${t}`):e}try{let e=inspectOpenedRegularAppend(u.fd,t,s);if(a!==void 0&&Number(e.size)+c>a)return;await u.chmod(i),await u.appendFile(n,r),i&3584&&await u.chmod(i)}finally{await u.close()}}function appendRegularFileSync(e){let{filePath:t,content:n,encoding:r,mode:i,maxFileBytes:a,rejectSymlinkParents:o}=captureAppendOptions(e),s=prepareRegularAppend(t,o),c=typeof n==`string`?Buffer.from(n,r):Buffer.from(n);if(a!==void 0&&Number(s?.size??0n)+c.byteLength>a)return;getFsSafeTestHooks()?.beforeRegularFileAppendOpenSync?.(t);let l=resolveRegularFileAppendFlags(),u;try{u=C.openSync(t,l,i)}catch(e){throw isNonRegularWriteOpenErrorSync(e,t,l)?Error(`Refusing to append to non-file: ${t}`):e}try{let e=inspectOpenedRegularAppend(u,t,s);if(a!==void 0&&Number(e.size)+c.byteLength>a)return;C.fchmodSync(u,i),C.appendFileSync(u,c),i&3584&&C.fchmodSync(u,i)}finally{C.closeSync(u)}}function init_regular_file(){return(init_regular_file=__esmMin((()=>{E(),$t(),bt(),init_symlink_parents(),pn(),init_write_open_flags(),at()})))()}function init_boundary_path(){return(init_boundary_path=__esmMin((()=>{S.snapshot()})))()}function sanitizePlainObject(e){let t={};for(let[n,r]of Object.entries(e))isBlockedObjectKey(n)||(t[n]=isPlainObject$2(r)?sanitizePlainObject(r):r);return t}function mergeDeep(e,t,n={}){let r=n.arrays??`replace`,i=n.undefinedValues??`skip`;if(Array.isArray(e)&&Array.isArray(t))return r===`concat`?[...e,...t]:t;if(!isPlainObject$2(e)||!isPlainObject$2(t))return t===void 0&&i===`skip`?e:t;let a=sanitizePlainObject(e);for(let[e,o]of Object.entries(t)){if(isBlockedObjectKey(e)||o===void 0&&i===`skip`)continue;let t=a[e];a[e]=isPlainObject$2(o)?isPlainObject$2(t)?mergeDeep(t,o,n):sanitizePlainObject(o):r===`concat`&&Array.isArray(t)&&Array.isArray(o)?[...t,...o]:o}return a}function init_deep_merge(){return(init_deep_merge=__esmMin((()=>{init_prototype_keys()})))()}function normalizeHomeDirValue(e){let t=e?.trim();return t&&t!==`undefined`&&t!==`null`?t:void 0}function normalizeSafe(e){try{return normalizeHomeDirValue(e())}catch{return}}function resolveTermuxHome(e){let t=normalizeHomeDirValue(e.PREFIX);if(t&&normalizeHomeDirValue(e.ANDROID_DATA)&&/(?:^|\/)com\.termux\/files\/usr\/?$/u.test(t.replace(/\\/gu,`/`)))return w.resolve(t,`..`,`home`)}function resolveRawOsHomeDir(e,t){return normalizeHomeDirValue(e.HOME)??normalizeHomeDirValue(e.USERPROFILE)??resolveTermuxHome(e)??normalizeSafe(t)}function resolveOsHomeDir(e=process.env,t=de.homedir){let n=resolveRawOsHomeDir(e,t);return n?w.resolve(n):void 0}function resolveEffectiveHomeDir(e=process.env,t=de.homedir,n){let r=normalizeHomeDirValue(e.OPENCLAW_HOME);if(!r)return resolveOsHomeDir(e,t);if(r===`~`||r.startsWith(`~/`)||r.startsWith(`~\\`)){let i=resolveRawOsHomeDir(e,t);return i?w.resolve(r.replace(/^~(?=$|[\\/])/,()=>i)):n?.preserveUnresolvedTilde?w.resolve(r):void 0}return w.resolve(r)}function init_home_dir(){return(init_home_dir=__esmMin((()=>{})))()}function tryProcessCwd(){try{return process.cwd()}catch{return}}function resolveRequiredHomeDir(e=process.env,t=de.homedir){let n=resolveEffectiveHomeDir(e,t)??tryProcessCwd();if(n)return w.resolve(n);throw Error(`Unable to resolve an OpenClaw home: set OPENCLAW_HOME, HOME, or USERPROFILE, or run from an existing directory.`)}function expandHomePrefix(e,t){if(!e.startsWith(`~`))return e;let n=normalizeHomeDirValue(t?.home)??resolveEffectiveHomeDir(t?.env??process.env,t?.homedir??de.homedir);return n?e.replace(/^~(?=$|[\\/])/,()=>n):e}function resolvePathWithHome(e,t,n){let r=e.trim();if(!r)return r;let i=r.startsWith(`~`)?expandHomePrefix(r,{home:n(t?.env??process.env,t?.homedir??de.homedir),env:t?.env,homedir:t?.homedir}):r,a=mn.getStore();return a?w.resolve(a,i):w.resolve(i)}function resolveHomeRelativePath(e,t){return resolvePathWithHome(e,t,resolveRequiredHomeDir)}function resolveUserPath(e,t=process.env,n=de.homedir){return e?resolveHomeRelativePath(e,{env:t,homedir:n}):``}var mn;function init_home_dir$1(){return(init_home_dir$1=__esmMin((()=>{init_home_dir(),init_global_singleton(),mn=resolveGlobalSingleton(Symbol.for(`openclaw.userPathBaseDirectory`),()=>new S)})))()}function resolveConfigDir(e=process.env,t=de.homedir){let n=e.OPENCLAW_STATE_DIR?.trim();if(n)return resolveUserPath(n,e,t);let r=e.OPENCLAW_CONFIG_PATH?.trim();return r?w.dirname(resolveUserPath(r,e,t)):w.join(resolveRequiredHomeDir(e,t),`.openclaw`)}function init_config_dir(){return(init_config_dir=__esmMin((()=>{init_home_dir$1()})))()}function escapeRegExp(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}function clampNumber(e,t,n,r){return typeof e!=`number`||!Number.isFinite(e)?t:Math.min(Math.max(e,n??-1/0),r??1/0)}function resolveAttemptCount(e,t){return Math.max(1,Math.round(clampNumber(e,t)))}function resolveRetryDelayMs(e){return Math.min(Math.max(Math.round(e===1/0?hn:Number.isFinite(e)?e:0),0),hn)}function resolveJitterConfig(e,t){return e===`full`?`full`:typeof e==`number`&&Number.isFinite(e)?Math.min(Math.max(e,0),1):t}function resolveRetryConfig(e=gn,t){let n=resolveAttemptCount(t?.attempts,e.attempts),r=resolveRetryDelayMs(clampNumber(t?.minDelayMs,e.minDelayMs,0));return{attempts:n,minDelayMs:r,maxDelayMs:Math.max(r,resolveRetryDelayMs(clampNumber(t?.maxDelayMs,e.maxDelayMs,0))),jitter:resolveJitterConfig(t?.jitter,e.jitter)}}function applyJitter(e,t,n,r){if(t===`full`)return n===`symmetric`?Math.max(0,Math.round(e*(.5+r()*.5))):Math.max(0,Math.ceil(e*(1+r())));if(t<=0)return n===`positive`?Math.ceil(e):e;let i=r(),a=e*(1+(n===`positive`?i*t:(i*2-1)*t));return Math.max(0,n===`positive`?Math.ceil(a):Math.round(a))}function toRetryError(e,t=`Non-Error thrown`){if(e instanceof Error)return e;if(typeof e==`string`)return Error(e);let n=Error(t,{cause:e});return(typeof e==`object`&&e||typeof e==`function`)&&Object.assign(n,e),n}function createRetryRunner(e={}){let t=e.sleep??defaultSleep,n=e.random??Math.random,r=e.createFailure??(e=>toRetryError(e.at(-1)??/* @__PURE__ */ Error(`Retry failed`)));return async function(e,i=3,a=300){let o=[],s=typeof i==`number`,c=typeof i==`number`?{attempts:i}:i,l=resolveRetryConfig(gn,c),u=l.attempts,d=l.minDelayMs,f=l.maxDelayMs>0?l.maxDelayMs:1/0,p=c.retryAfterMaxDelayMs===void 0?f:Math.max(d,resolveRetryDelayMs(clampNumber(c.retryAfterMaxDelayMs,f,0))),m=c.random??n,h=c.sleep??t,g=c.shouldRetry??(()=>!0);for(let n=1;n<=u;n+=1)try{return await e()}catch(e){if(o.push(e),n>=u||!g(e,n))break;if(s){await t(resolveRetryDelayMs(a*2**(n-1)));continue}let r={attempt:n,maxAttempts:u,err:e,label:c.label},i=c.retryAfterMs?.(e),v=typeof i==`number`&&Number.isFinite(i),y=typeof c.delayMs==`function`?c.delayMs(r):c.delayMs,b=y===void 0?void 0:resolveRetryDelayMs(y),x=v?Math.max(i,d):b===void 0?d*2**(n-1):Math.max(b,d),ee=v?p:f,S=Math.min(x,ee),te=v&&(i??0)<=ee,ne=l.jitter===`full`&&!v||te;S=applyJitter(S,l.jitter,ne?`positive`:`symmetric`,m),S=Math.min(Math.max(S,d),ee),await c.onRetry?.({...r,delayMs:S}),S>0&&await h(S)}throw r(o)}}var hn,gn,defaultSleep;function init_src$1(){return(init_src$1=__esmMin((()=>{hn=2147e6,gn={attempts:3,minDelayMs:300,maxDelayMs:3e4,jitter:0},defaultSleep=async e=>{let t=e;do{let e=Math.min(t,hn);await new Promise(t=>{setTimeout(t,e)}),t-=e}while(t>0)},createRetryRunner()})))()}function init_abort_signal(){return(init_abort_signal=__esmMin((()=>{init_src$1()})))()}function init_sleep(){return(init_sleep=__esmMin((()=>{init_number_coercion(),init_src$1(),init_abort_signal()})))()}function init_utils(){return(init_utils=__esmMin((()=>{init_config_dir(),init_home_dir$1(),init_sleep(),String.raw`(?<=^|[\s"'\x60(\[{<=:;]|file://)`,String.raw`[\s"'\x60)\]}>]`,String.raw`[:;](?=[/\\~$]|[A-Za-z]:)`,resolveConfigDir()})))()}function getSealedRuntimeJson5(){return _n?.json5}function getSealedRuntimeSecureTempRoot(){return _n?.resolveSecureTempRoot}var _n;function init_sealed_runtime_registry(){return(init_sealed_runtime_registry=__esmMin((()=>{})))()}function isJson5Parser(e){return typeof e==`object`&&!!e&&`parse`in e&&typeof e.parse==`function`}function setJson5Runtime(e){let t=isJson5Parser(e)?e:typeof e==`object`&&e&&`default`in e?e.default:void 0;if(!isJson5Parser(t))throw Error(`json5 parser unavailable`);return vn=t,t}function loadJson5Parser(){if(vn)return vn;let e=getSealedRuntimeJson5();if(e!==void 0)return setJson5Runtime(e);throw Error(`sealed JSON5 runtime was not registered before use`)}function parseJsonWithJson5Fallback(e,t){try{return JSON.parse(e)}catch{return(t??loadJson5Parser()).parse(e)}}var vn;function init_parse_json_compat(){return(init_parse_json_compat=__esmMin((()=>{init_sealed_runtime_registry()})))()}function isConfigContainer(e){return Array.isArray(e)||isPlainObject$2(e)}function includeLogicalPath(e){let t=[];for(let n=e;n;n=n.parent)t.push(n.key);return t.toReversed()}function deepMerge(e,t){return mergeDeep(e,t,{arrays:`concat`,undefinedValues:`replace`})}function safeRealpath(e){try{return C.realpathSync(e)}catch{return e}}function createConfigIncludeBoundary(e,t=[]){let n=w.normalize(w.dirname(e));return{configRoot:{rootDir:n,rootRealDir:w.normalize(safeRealpath(n))},allowedRoots:t.filter(e=>typeof e==`string`&&e.length>0&&w.isAbsolute(e)).map(e=>{let t=w.normalize(e);return{rootDir:t,rootRealDir:w.normalize(safeRealpath(t))}})}}function readConfigIncludeFileWithGuards(e){let t=e.ioFs??C,n=e.maxBytes??bn;if(!canUseRootFileOpen(t)){let n=t.readFileSync(e.resolvedPath,`utf-8`);try{e.onResolvedPath?.(w.normalize(t.realpathSync(e.resolvedPath)))}catch{}return n}let r=openRootFileSync({absolutePath:e.resolvedPath,rootPath:e.rootRealDir,rootRealPath:e.rootRealDir,boundaryLabel:`config directory`,skipLexicalRootCheck:!0,rejectSymlinks:!1,maxBytes:n,ioFs:t});if(!r.ok)throw r.reason===`validation`?new ConfigIncludeError(`Include file failed security checks (regular file, max ${n} bytes, no hardlinks): ${e.includePath}`,e.includePath):new ConfigIncludeReadError(`Failed to read include file: ${e.includePath} (resolved: ${e.resolvedPath})`,e.includePath,r.error instanceof Error?r.error:void 0);try{let n=t.readFileSync(r.fd,`utf-8`);return e.onResolvedPath?.(w.normalize(r.path)),n}finally{t.closeSync(r.fd)}}function resolveConfigIncludes(e,t,n=Sn,r={}){let i=createConfigIncludeBoundary(t,r.allowedRoots??[]);return new IncludeProcessor(t,n,i).process(e)}function resolveConfigIncludesForTopLevelKey(e,t,n,r=Sn,i={}){let a=createConfigIncludeBoundary(t,i.allowedRoots??[]);return new IncludeProcessor(t,r,a,/* @__PURE__ */ new Set([n])).process(e)}var yn,bn,xn,ConfigIncludeError,ConfigIncludeReadError,CircularIncludeError,IncludeProcessor,Sn;function init_includes(){return(init_includes=__esmMin((()=>{init_src(),init_root_file(),init_boundary_path(),init_deep_merge(),init_errno(),bt(),init_utils(),init_parse_json_compat(),yn=`$include`,bn=2097152,xn=4096,ConfigIncludeError=class extends Error{constructor(e,t,n){super(e),this.includePath=t,this.cause=n,this.name=`ConfigIncludeError`}},ConfigIncludeReadError=class extends ConfigIncludeError{constructor(...e){super(...e),this.name=`ConfigIncludeReadError`}},CircularIncludeError=class extends ConfigIncludeError{constructor(e){super(`Circular include detected: ${e.join(` -> `)}`,expectDefined(e[e.length-1],`chain entry at chain.length 1`)),this.chain=e,this.name=`CircularIncludeError`}},IncludeProcessor=class{constructor(e,t,n,r){this.basePath=e,this.resolver=t,this.boundary=n,this.rootProjectionKeys=r}get rootDir(){return this.boundary.configRoot.rootDir}process(e){let t=[],n=this.traverseValue(e,null,!1,{basePath:this.basePath,visited:/* @__PURE__ */ new Set([w.normalize(this.basePath)]),depth:0}),r;for(;;){let e=n.next(r);if(e.done){let i=t.pop();if(!i)return e.value;r=e.value,n=i;continue}t.push(n),n=this.traverseValue(e.value.value,e.value.pathLink,e.value.hasArrayAncestor,e.value.context)}}*traverseValue(e,t,n,r){if(Array.isArray(e)){let n=[];for(let[i,a]of e.entries())n.push(isConfigContainer(a)?yield{value:a,pathLink:{parent:t,key:String(i)},hasArrayAncestor:!0,context:r}:a);return n}if(!isPlainObject$2(e))return e;if(!(`$include`in e)){let i=t===null,a={};for(let[o,s]of Object.entries(e))i&&this.rootProjectionKeys&&!this.rootProjectionKeys.has(o)||(a[o]=isConfigContainer(s)?yield{value:s,pathLink:{parent:t,key:o},hasArrayAncestor:n,context:r}:s);return a}return yield*this.traverseInclude(e,t,n,r)}*traverseInclude(e,t,n,r){let i=e[yn],a=t===null,o=Object.keys(e).filter(e=>e!==`$include`&&(!a||!this.rootProjectionKeys||this.rootProjectionKeys.has(e))),s=Array.isArray(i);if(!s&&typeof i!=`string`)throw new ConfigIncludeError(`Invalid $include value: expected string or array of strings, got ${typeof i}`,String(i));let c=[];for(let e of s?i:[i]){if(typeof e!=`string`)throw new ConfigIncludeError(`Invalid $include array item: expected string, got ${typeof e}`,String(e));let i=this.loadFileSync(e,r);c.push({value:yield{value:i.parsed,pathLink:t,hasArrayAncestor:n,context:i.nestedContext},targetPath:i.resolvedPath})}let l=s?c.reduce((e,t)=>deepMerge(e,t.value),{}):c[0].value;if(this.resolver.onIncludeResolved?.({path:includeLogicalPath(t),value:l,kind:s?`multiple`:`single`,hasSiblingOverrides:o.length>0,hasArrayAncestor:n,...s?{targetPaths:c.map(e=>e.targetPath)}:{targetPath:c[0].targetPath}}),o.length===0)return l;if(!isPlainObject$2(l))throw new ConfigIncludeError(`Sibling keys require included content to be an object`,typeof i==`string`?i:yn);let u={};for(let i of o){let a=e[i];u[i]=isConfigContainer(a)?yield{value:a,pathLink:{parent:t,key:i},hasArrayAncestor:n,context:r}:a}return deepMerge(l,u)}loadFileSync(e,t){let{resolvedPath:n,root:r}=this.resolvePath(e,t);if(t.visited.has(n))throw new CircularIncludeError([...t.visited,n]);if(t.depth>=10)throw new ConfigIncludeError(`Maximum include depth (10) exceeded at: ${e}`,e);let i=this.readFile(e,n,r);return{parsed:this.parseFile(e,n,i),resolvedPath:n,nestedContext:{basePath:n,visited:/* @__PURE__ */ new Set([...t.visited,n]),depth:t.depth+1}}}resolvePath(e,t){if(e.includes(`\0`))throw new ConfigIncludeError(`Include path must not contain null bytes`,e);if(e.length>=xn)throw new ConfigIncludeError(`Include path exceeds maximum length (${xn} characters)`,e);let n=w.dirname(t.basePath),r=w.isAbsolute(e)?e:w.resolve(n,e),i=w.normalize(r);if(i.length>=xn)throw new ConfigIncludeError(`Resolved include path exceeds maximum length (${xn} characters)`,e);let a=this.findContainingRoot(i,`rootDir`);if(!a)throw new ConfigIncludeError(`Include path escapes config directory: ${e} (root: ${this.rootDir})`,e);this.resolver.onLexicalPath?.(i);try{let t=C.realpathSync(i),n=this.findContainingRoot(t,`rootRealDir`);if(!n)throw new ConfigIncludeError(`Include path resolves outside config directory (symlink): ${e} (root: ${this.rootDir})`,e);return{resolvedPath:i,root:n}}catch(t){if(t instanceof ConfigIncludeError)throw t;if(isMissingPathError(t))return{resolvedPath:i,root:a};throw new ConfigIncludeReadError(`Failed to resolve include file realpath: ${e} (resolved: ${i})`,e,t instanceof Error?t:void 0)}}findContainingRoot(e,t){if(isPathInside(this.boundary.configRoot[t],e))return this.boundary.configRoot;for(let n of this.boundary.allowedRoots)if(isPathInside(n[t],e))return n;return null}readFile(e,t,n){try{return this.resolver.readFileWithGuards?this.resolver.readFileWithGuards({includePath:e,resolvedPath:t,rootRealDir:n.rootRealDir}):this.resolver.readFile(t)}catch(n){throw n instanceof ConfigIncludeError?n:new ConfigIncludeReadError(`Failed to read include file: ${e} (resolved: ${t})`,e,n instanceof Error?n:void 0)}}parseFile(e,t,n){try{return this.resolver.parseJson(n)}catch(n){throw new ConfigIncludeError(`Failed to parse include file: ${e} (resolved: ${t})`,e,n instanceof Error?n:void 0)}}},Sn={readFile:e=>C.readFileSync(e,`utf-8`),readFileWithGuards:readConfigIncludeFileWithGuards,parseJson:parseJsonWithJson5Fallback}})))()}function init_profile_utils(){return(init_profile_utils=__esmMin((()=>{init_home_dir$1()})))()}function init_tcp_port(){return(init_tcp_port=__esmMin((()=>{init_number_coercion()})))()}function resolveNewStateDir(e=resolveRequiredHomeDir){return w.join(e(),`.openclaw`)}function resolveStateDir(e=process.env,t=()=>resolveRequiredHomeDir(e,de.homedir)){let effectiveHomedir=()=>resolveRequiredHomeDir(e,t),n=e.OPENCLAW_STATE_DIR?.trim();return n?resolveHomeRelativePath(n,{env:e,homedir:effectiveHomedir}):resolveStateDirFromHome(e,effectiveHomedir)}function resolveStateDirFromHome(e,t){return resolveNewStateDir(t)}function init_state_dir(){return(init_state_dir=__esmMin((()=>{init_home_dir$1()})))()}function resolveIsNixMode(e=process.env){return e.OPENCLAW_NIX_MODE===`1`}function envHomedir(e){return()=>resolveRequiredHomeDir(e,de.homedir)}function resolveIncludeRoots(e=process.env,t=envHomedir(e)){let n=e.OPENCLAW_INCLUDE_ROOTS?.trim();if(!n)return[];let effectiveHomedir=()=>resolveRequiredHomeDir(e,t),r=/* @__PURE__ */ new Set,i=[];for(let t of n.split(w.delimiter)){let n=t.trim();if(!n)continue;let a=w.resolve(resolveHomeRelativePath(n,{env:e,homedir:effectiveHomedir}));r.has(a)||(r.add(a),i.push(a))}return i}function resolveConfigPathCandidate(e=process.env,t=envHomedir(e)){return resolveConfigPath(e,void 0,t)}function resolveConfigPath(e=process.env,t,n=envHomedir(e)){let r=e.OPENCLAW_CONFIG_PATH?.trim();return r?resolveUserPath(r,e,n):w.join(t??resolveStateDir(e,n),Cn)}var Cn;function init_paths(){return(init_paths=__esmMin((()=>{init_profile_utils(),init_home_dir$1(),init_tcp_port(),init_state_dir(),resolveIsNixMode(),Cn=`openclaw.json`,resolveStateDir(),resolveConfigPathCandidate()})))()}function resolveLoggingConfigSelector(){let e=process.env;return[e.OPENCLAW_CONFIG_PATH,e.OPENCLAW_STATE_DIR,e.OPENCLAW_HOME,e.OPENCLAW_PROFILE,e.HOME,e.USERPROFILE,e.HOMEDRIVE,e.HOMEPATH,e.PREFIX,e.ANDROID_DATA,e.OPENCLAW_TEST_FAST,tryProcessCwd()??``].map(e=>e??``).join(`\0`)}function resolvePartialDiagnosticLoggingConfig(e){if(!isRecord(e))return;let t={};if(typeof e.consoleStyle==`string`)try{let n=resolveConfigEnvVars({consoleStyle:e.consoleStyle});isRecord(n)&&(n.consoleStyle===`pretty`||n.consoleStyle===`compact`||n.consoleStyle===`json`)&&(t.consoleStyle=n.consoleStyle)}catch{}if(Array.isArray(e.redactPatterns))try{let n=resolveConfigEnvVars({redactPatterns:e.redactPatterns});isRecord(n)&&Array.isArray(n.redactPatterns)&&n.redactPatterns.every(e=>typeof e==`string`)&&(t.redactPatterns=n.redactPatterns)}catch{}return Object.keys(t).length>0?t:void 0}function readLoggingConfig(){try{if(T.appliedConfig!==`unowned`)return T.appliedConfig;let e=resolveLoggingConfigSelector();if(wn?.selector===e)return wn.logging;let t=resolveConfigPath();if(!C.existsSync(t)){wn={selector:e,logging:void 0};return}let n=parseJsonWithJson5Fallback(C.readFileSync(t,`utf8`)),r=resolveIncludeRoots(),i;try{i=resolveConfigIncludesForTopLevelKey(n,t,`logging`,void 0,{allowedRoots:r})}catch{let e=isRecord(n)?n.logging:void 0;if(e===void 0)return;try{i=resolveConfigIncludes({logging:e},t,void 0,{allowedRoots:r})}catch{return resolvePartialDiagnosticLoggingConfig(e)}}let a;try{a=resolveConfigEnvVars(i)}catch{return resolvePartialDiagnosticLoggingConfig(isRecord(i)?i.logging:void 0)}let o=isRecord(a)?a.logging:void 0,s=isRecord(o)?o:void 0;return wn={selector:e,logging:s},s}catch{return}}var wn;function init_config(){return(init_config=__esmMin((()=>{init_env_substitution(),init_includes(),init_paths(),init_parse_json_compat(),init_state()})))()}function clampMessage(e){return e.length>Tn?`${truncateUtf16Safe(e,Tn)}...(truncated)`:e}function stringifyFileLogMessagePart(e,t){if(t)return JSON.stringify(e);if(typeof e==`string`)return e;if(typeof e==`number`||typeof e==`boolean`||typeof e==`bigint`)return String(e);if(isRecord(e)&&typeof e.message==`string`)return e.message}function serializeFileLogRecord(e,t=[]){let n=[],r=JSON.parse(JSON.stringify(e,function(e,t){for(;n.length>0&&n.at(-1)!==this;)n.pop();if(typeof t==`bigint`)return String(t);if(typeof t==`object`&&t){if(n.includes(t))return`[Circular]`;n.push(t)}return t}));if(!isRecord(r))throw TypeError(`File log records must serialize to objects`);let i=[];for(let{key:e,json:n,primitiveText:a}of t){let t=a??stringifyFileLogMessagePart(r[e],n);t?.trim()&&i.push(t)}if(i.length>0){let e=clampMessage(i.join(` `));if(Object.hasOwn(r,`message`))r.message=e;else{let t=Object.entries(r);return t.splice(t.findIndex(([e])=>e===`hostname`)+1,0,[`message`,e]),JSON.stringify(Object.fromEntries(t))}}return JSON.stringify(r)}var Tn;function init_logger_file_message(){return(init_logger_file_message=__esmMin((()=>{Tn=4096})))()}function replacePatternBounded(e,t,n){if(e.length<=En)return e.replace(t,n);let r;for(let i=0;i<e.length;i+=Dn){let a=e.slice(i,i+Dn),o=a.replace(t,n);r===void 0?o!==a&&(r=e.slice(0,i)+o):r+=o}return r??e}var En,Dn;function init_redact_bounded(){return(init_redact_bounded=__esmMin((()=>{En=32768,Dn=16384})))()}function composeRedactionEdits(e,t,n){if(t.length===0)return n;let r=[],i=0;for(let e of t)i<e.start&&r.push({start:i,end:e.start}),r.push(e),i=e.end;i<e&&r.push({start:i,end:e});let a=[],o=0,s=0,c=0,consume=(t,n)=>{if(t===c){let t=r[o];if(!t)return{start:e,end:e};let n=t.replacement===void 0?t.start+s:t.start;return{start:n,end:t.replacement!==void 0&&s>0?t.end:n}}let i,l=0;for(;c<t;){let e=expectDefined(r[o],`current redaction piece`),u=e.replacement?.length??e.end-e.start,d=Math.min(u-s,t-c),f=e.replacement===void 0?e.start+s:e.start,p=e.replacement===void 0?f+d:e.end;i??=f,l=p,n&&d>0&&a.push({start:f,end:p,replacement:e.replacement?.slice(s,s+d)}),c+=d,s+=d,s===u&&(o+=1,s=0)}return{start:i??l,end:l}};for(let e of n)consume(e.start,!0),a.push({...consume(e.end,!1),replacement:e.replacement});for(;o<r.length;){let e=expectDefined(r[o],`remaining redaction piece`);consume(c+(e.replacement?.length??e.end-e.start)-s,!0)}let l=[],u=[],d,flush=()=>{d&&(d.replacement=u.join(``),l.push(d),d=void 0,u=[])};for(let e of a){if(e.replacement===void 0){flush();continue}let t=d&&d.start===e.start&&d.end===e.end&&e.start===e.end;!d||e.start>=d.end&&!t?(flush(),d={start:e.start,end:e.end,replacement:``}):d.end=Math.max(d.end,e.end),u.push(e.replacement)}return flush(),l}function rebaseRedactionEdits(e,t){let n=0,r=e.map(e=>{let t=e.start+n;return n+=e.replacement.length-(e.end-e.start),{...e,currentStart:t,currentEnd:e.end+n}}),boundary=(e,t)=>{let n=0,i=r.length;for(;n<i;){let t=n+i>>>1,a=expectDefined(r[t],`source redaction span`);a.end<e||a.end===e&&a.start!==a.end?n=t+1:i=t}let a=r[n];if(a&&(e>a.start||e===a.start&&a.start===a.end))return t?a.currentEnd:a.currentStart;let o=r[n-1];return e+(o?o.currentEnd-o.end:0)};return t.map(e=>({start:boundary(e.start,!1),end:boundary(e.end,!0),replacement:e.replacement}))}function mergeRedactionEdits(e){e.sort((e,t)=>e.start-t.start||e.end-t.end);let t=[];for(let n of e){let e=t.at(-1);!e||n.start>=e.end?t.push({...n}):(n.start!==e.start||n.end!==e.end||n.replacement!==e.replacement)&&(e.end=Math.max(e.end,n.end),e.replacement=`***`)}return t}function applyRedactionEdits(e,t){let n=[],r=0;for(let i of mergeRedactionEdits(t))n.push(e.slice(r,i.start),i.replacement),r=i.end;return n.join(``)+e.slice(r)}function init_redact_edit_composition(){return(init_redact_edit_composition=__esmMin((()=>{init_src()})))()}function normalizeUrlQueryParamName(e){let t=e.replace(kn,``);for(let e=0;e<=jn;e+=1){let e;try{e=decodeURIComponent(t).replace(kn,``)}catch{break}if(e===t)return{value:normalizeLowercaseStringOrEmpty(t).replaceAll(`-`,`_`),unresolvedEncoding:!1};t=e}return{value:normalizeLowercaseStringOrEmpty(t).replaceAll(`-`,`_`),unresolvedEncoding:t.includes(`%`)}}function isSensitiveUrlQueryParamName(e){let t=normalizeUrlQueryParamName(e);return t.unresolvedEncoding||On.has(t.value)||An.test(t.value)}var On,kn,An,jn;function init_redact_sensitive_url(){return(init_redact_sensitive_url=__esmMin((()=>{On=/* @__PURE__ */ new Set(/* @__PURE__ */ `token.key.api_key.apikey.secret.access_token.auth_token.password.pass.passwd.auth.jwt.session.id_token.code.client_secret.app_secret.hook_token.refresh_token.signature.x_amz_signature.x_amz_security_token.private_key.credential.authorization.sig.x_api_key.x_access_token.x_auth_token`.split(`.`)),kn=/[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu,An=/(?:^|_)token(?:_[a-f0-9]{16,})?$/u,jn=8})))()}function maskToken(e){return e.length<Mn?`***`:`${sliceUtf16Safe(e,0,Nn)}…${sliceUtf16Safe(e,-4)}`}function splitSecretValueForMask(e){let t=e[0]??``,n=+!!In.has(t);if(n){let n=e.lastIndexOf(t);if(n>0){let t=e.slice(n+1);if(Fn.test(t))return{maskable:e.slice(1,n),suffix:t,maskStart:0,maskEnd:n+1}}}let r=e.slice(n),i=r.match(Pn)?.[1]??``,a=i&&i.length<r.length?r.slice(0,-i.length):r;return{maskable:a,suffix:a===r?``:i,maskStart:0,maskEnd:n+a.length}}function splitFormAwareCredentialValue(e){let t=e.search(/&[A-Za-z_][A-Za-z0-9_.-]*=/u);return t<0?{secret:e,suffix:``}:{secret:e.slice(0,t),suffix:e.slice(t)}}function maskSecretValue(e,t){let{maskable:n,suffix:r}=splitSecretValueForMask(e);return`${t?.hinted?maskToken(n):`***`}${r}`}var Mn,Nn,Pn,Fn,In;function init_redact_mask(){return(init_redact_mask=__esmMin((()=>{Mn=18,Nn=6,Pn=/(["'`,;)}\]]+)$/u,Fn=/^["'`,;)}\]]*$/u,In=/* @__PURE__ */ new Set([`"`,`'`,"`"])})))()}function createState(){return{scanner:{offset:0,phase:`search`,dashes:0,keyword:`BEGIN `,keywordOffset:0,start:0,suffix:``},matchEnd:0}}function resetScanner(e,t){e.phase=`search`,e.dashes=+(t===`-`),e.suffix=``}function*readDelimiters(e,t){for(let n=0;n<e.length;n+=1){if(t.phase===`search`&&t.dashes===0){let r=e.indexOf(`-`,n);if(r===-1){t.offset+=e.length-n;return}t.offset+=r-n,n=r}let r=e.charCodeAt(n),i=r>=97&&r<=122?String.fromCharCode(r-32):e.charAt(n),a=t.offset++;switch(t.phase){case`search`:i===`-`?t.dashes=Math.min(5,t.dashes+1):t.dashes===5&&(i===`B`||i===`E`)?(t.phase=`keyword`,t.keyword=i===`B`?`BEGIN `:`END `,t.keywordOffset=1,t.start=a-5):t.dashes=0;break;case`keyword`:i===t.keyword.charAt(t.keywordOffset)?++t.keywordOffset===t.keyword.length&&(t.phase=`label`,t.suffix=``):resetScanner(t,i);break;case`label`:i>=`A`&&i<=`Z`||i===` `?t.suffix=(t.suffix+i).slice(-11):i===`-`&&t.suffix===`PRIVATE KEY`?(t.phase=`close`,t.dashes=1):resetScanner(t,i);break;case`close`:i===`-`?++t.dashes===5&&(t.phase=`search`,t.suffix=``,yield{kind:t.keyword===`BEGIN `?`begin`:`end`,start:t.start,end:a+1}):resetScanner(t,i)}}}function consumeDelimiter(e,t){if(!e.open){t.kind===`begin`&&t.start>=e.matchEnd&&(e.open={start:t.start,end:t.end});return}if(t.kind!==`end`||t.start<=e.open.end)return;let n={start:e.open.start,end:t.end,bodyStart:e.open.end,bodyEnd:t.start};return e.open=void 0,e.matchEnd=t.end,n}function*matchPem(e,t,n){let r={...t,scanner:{...t.scanner},open:t.open&&{...t.open}},i=r.scanner.offset;for(let t of readDelimiters(e,r.scanner)){let a=consumeDelimiter(r,t);if(!a)continue;let o=Math.max(0,(n?a.bodyStart:a.start)-i),s=(n?a.bodyEnd:a.end)-i;s<=o||(yield{match:e.slice(o,s),groups:[],input:e,offset:o,...n?{replacement:`…redacted…`}:{}})}if(n&&r.open){let t=Math.max(0,r.open.end-i);t<e.length&&(yield{match:e.slice(t),groups:[],input:e,offset:t,replacement:`…redacted…`})}}var Ln,Rn;function init_redact_pem(){return(init_redact_pem=__esmMin((()=>{Ln=String.raw`-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----`,Rn={source:Ln,exec(e){return matchPem(e,createState(),!1)},createContext(){let e=!1,t=!0;return{resolve(n){e=n?t:e,t=e},advance(t){let n=createState();e&&(n.open={start:-1,end:-1});for(let e of readDelimiters(t,n.scanner))consumeDelimiter(n,e);return n.open!==void 0},prepend(){let n=createState(),r=createState();return r.open={start:-1,end:-1},{consume(e){for(let t of readDelimiters(e,n.scanner))consumeDelimiter(n,t),consumeDelimiter(r,t)},finish(){let i=n.open?t:e,a=r.open?t:e;return e=i,t=a,e===t}}},pattern:{source:Ln,exec(t){let n=createState();return e&&(n.open={start:-1,end:-1}),matchPem(t,n,!0)}}}}}})))()}function isAwsValueCharacter(e){let t=e.charCodeAt(0);return t>=65&&t<=90||t>=97&&t<=122||t>=48&&t<=57||e===`/`||e===`+`||e===`=`}function couldMatchAwsSecretAccessKey(e){for(let t=39;t<e.length;){let n=t;for(;n>t-40&&isAwsValueCharacter(e[n]);)n--;if(n===t-40)return mr.test(e);t=n+40}return!1}function*matchAwsSecretAccessKeys(e){if(!couldMatchAwsSecretAccessKey(e))return;let t={'"':`"`,"'":`'`,"`":"`","<":`>`,"(":`)`,"[":`]`,"{":`}`},n=-1,r=-1,i,a=0,o=[];for(let s=0;s<=e.length;s++){let c=e[s]??``,l=s===e.length||hr.test(c),u=a;if(a=c===`\\`?a+1:0,c&&isAwsValueCharacter(c)?n===-1&&(n=s):n!==-1&&(s-n===40?o.push({start:n,end:s,origin:n,url:i}):s-n>40&&c===`@`&&e[s-41]===`/`&&o.push({start:s-40,end:s,origin:n,url:i}),n=-1),l){i&&(i.end=Math.min(i.end,s));for(let t of o){let n=t.url,r=n&&!n.hasAt&&n.portValid&&(n.portStart===-1||(n.authorityEnd===-1?n.end:n.authorityEnd)>n.portStart+1),i=e[t.start-1]??``,a=e[t.end]??``,o=t.start!==t.origin,s=n&&n.portStart!==-1&&t.origin===n.portStart+1&&n.authorityEnd>t.origin&&t.end>n.authorityEnd&&a===`@`;if(!o&&(i===`_`||isAwsValueCharacter(i))||a===`_`||e.slice(t.origin-8,t.origin)===`;base64,`||r&&!s&&t.start>=n.start&&t.end<=n.end)continue;let c=e.slice(t.start,t.end);mr.test(c)&&(yield{match:c,groups:[c],input:e,offset:t.start})}o.length=0,r=-1,i=void 0;continue}if(i&&s>=i.start&&(c===i.closing&&u===i.closingEscapeDepth?(i.end=Math.min(i.end,s),i=void 0):(`?#"'<>\`|()[]{}`.includes(c)&&(i.end=Math.min(i.end,s)),i.queryOrFragment||=c===`?`||c===`#`,i.authorityEnd===-1&&(i.hasAt||=c===`@`,`/?#`.includes(c)?i.authorityEnd=s:s<i.end&&(c===`:`?(i.portValid&&=i.portStart===-1,i.portStart=s):i.portStart!==-1&&(c<`0`||c>`9`)&&(i.portValid=!1))))),gr.test(c))r===-1&&(r=s);else{if((!i||s>=i.end&&!i.queryOrFragment)&&c===`:`&&e.startsWith(`//`,s+1)&&r!==-1&&_r.test(e[r])){let n=e[r-1],a=0;for(let t=r-2;t>=0&&e[t]===`\\`;t--)a++;i={start:s+3,end:e.length,authorityEnd:-1,portStart:-1,portValid:!0,hasAt:!1,queryOrFragment:!1,closing:n?t[n]:void 0,closingEscapeDepth:a}}r=-1}}}function*matchBarePassAssignments(e){if(!/pass\s*:/.test(e))return;let t=[...e.matchAll(yr)];if(t.length===0)return;let n=0,r=!1;for(let i=0;i<e.length;i++){let a=t[n];if(!a)return;if(i===a.index){n++;let o=e[i-1]??``,s=a[1]!==`pass`||o===`.`||o===`-`||o===`_`;if(s||r||o!==` `||!xr.test(e[i-2]??``)){r=!0;let o=i+a[0].length;if(!s){br.lastIndex=o;let t=br.exec(e)?.[0];t&&(o+=t.length,yield{match:e.slice(i,o),groups:[t],input:e,offset:i})}let c=t[n];for(;c&&c.index<o;)n++,c=t[n];i=o-1;continue}}let o=e[i];o===`
`||o===`\r`?r=!1:(o===`=`||o===`:`&&!Sr.test(e[i+1]??` `))&&(r=!0)}}function createBackendRedactPatterns(){let e=/* @__PURE__ */ new Set(/* @__PURE__ */ `access_token.auth_token.awssecretaccesskey.aws_secret_access_key.hook_token.refresh_token.id_token.token.api_key.apikey.client_secret.app_secret.password.pass.passwd.auth.jwt.session.code.signature.x_amz_signature.x_amz_security_token.secret.secretaccesskey.credential.private_key.authorization.key.card_number.card_cvc.card_cvv.cvc.cvv.security_code.payment_credential.shared_payment_token`.split(`.`)),t=RegExp(`^(?:${Er}|${Dr})$`,`i`),n=/* @__PURE__ */ new Set([Ar,Mr]),r=/* @__PURE__ */ new Set([Qn,$n,er,tr]),i=new RegExp(String.raw`[:=](?<=(?:${Kn})\s*[:=])`),a=new RegExp(String.raw`[:=](?<=(?:${Kn})\s*[:=])\s*["'\x60]`),o=new RegExp(String.raw`[:=](?<=\.(?:${Kn})\s*[:=])`),s=new RegExp(String.raw`=(?<=(?:^|[\s,;({\["])(?:${Gn})=)`,`i`);return{bodySecretKeys:e,credentialHeaderField:t,formAware:n,shellReferencePreserving:r,prefilters:new Map([[Qn,e=>/KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD|CVC|CVV|SECURITY|PAYMENT/.test(e)],[$n,e=>e.includes(`\\`)],[er,e=>/[=]["'`]/.test(e)],[tr,e=>s.test(e)],[rr,e=>/["'`]/.test(e)&&a.test(e)],[ir,e=>(e.includes(`:`)||e.includes(`=`))&&i.test(e)],[ar,e=>e.includes(`=`)],[or,e=>/[-_](?:password|passphrase|pass|passwd)\s*[:=]/.test(e)],[sr,e=>o.test(e)],[ur,e=>/["']/.test(e)],[dr,e=>/["']/.test(e)],...Nr.slice(0,4).map(e=>[e,e=>/authorization/i.test(e)]),[kr,e=>/api-key|apikey|api-token|access-token/i.test(e)],[Ar,e=>/api-key|apikey|api-token|access-token/i.test(e)],[cr,e=>e.includes(`"`)],[lr,e=>e.includes(`"`)],[jr,e=>/x-openclaw-token|x-pomerium-jwt-assertion|x-api-key|x-auth-token/i.test(e)],[Mr,e=>/x-openclaw-token|x-pomerium-jwt-assertion|x-api-key|x-auth-token/i.test(e)]]),chunkUnsafe:/* @__PURE__ */ new Set([wr,Tr,Pr,Fr,Ir,Lr,...Nr,...zr.filter(e=>e.startsWith(fr))])}}var zn,Bn,Vn,Hn,Un,Wn,Gn,Kn,qn,Jn,Yn,Xn,Zn,Qn,$n,er,tr,nr,rr,ir,ar,or,sr,cr,lr,ur,dr,fr,base64SafeToken,pr,mr,hr,gr,_r,vr,yr,br,xr,Sr,Cr,wr,Tr,Er,Dr,Or,kr,Ar,jr,Mr,Nr,Pr,Fr,Ir,Lr,Rr,zr,Br;function init_redact_patterns(){return(init_redact_patterns=__esmMin((()=>{init_structured_auth_redaction(),init_redact_pem(),zn=String.raw`CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN`,Bn=String.raw`card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token`,Vn=String.raw`cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token`,Hn=String.raw`aws[-_]?secret[-_]?access[-_]?key|awsSecretAccessKey|SecretAccessKey`,Un=String.raw`access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|id[-_]?token|api[-_]?key|apikey|client[-_]?secret|app[-_]?secret|private[-_]?key|${Hn}|credential|authorization|token|key|secret|password|pass|passwd|auth|jwt|session|code|signature|x[-_]?amz[-_]?(?:signature|security[-_]?token)`,Wn=String.raw`${Un}|app[-_]?secret|credential|${Bn}`,Gn=String.raw`access_token|refresh_token|id_token|auth[-_]?token|hook[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|private[-_]?key|authorization|jwt|token|secret|password|pass|passwd|credential|${Bn}`,Kn=String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|client[-_]?secret|app[-_]?secret|private[-_]?key|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|credential|${Bn}`,qn=String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|client[-_]?secret|app[-_]?secret|private[-_]?key|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|passwd|credential|${Bn}`,Jn=String.raw`access-token|refresh-token|id-token|auth-token|hook-token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|passphrase`,Yn=String.raw`password|passphrase|pass|passwd`,Xn=String.raw`${Hn}|api[-_]?key|hook[-_]?token|access[-_]?token|refresh[-_]?token|id[-_]?token|token|secret|password|passwd|credential|private[-_]?key|client[-_]?secret|${Bn}`,Zn=String.raw`\p{C}\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\u115F\u1160\u3164\uFFA0`,Qn=String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${zn})\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g`,$n=String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${zn})\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g`,er=String.raw`(^|[\s,;({\["])(?:${Gn})=(["'\x60])((?:(?!\2)[^\r\n])+)\2`,tr=String.raw`(^|[\s,;({\["])(?:${Gn})=(["'\x60]?[^\s&#"'\x60<>]+)`,nr=String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|${Bn}`,rr=String.raw`/(^|[\s,{])(?:(?:${nr})(?:\s*:\s*|\s+=\s*|=\s*)|[a-z0-9][a-z0-9._-]{0,79}[-_](?:${Yn})\s*[:=]\s*|[a-z0-9_.-]{1,80}\.(?:${Kn})\s*[:=]\s*)(["'\x60])((?:(?!\2)[^\r\n])+)\2/g`,ir=String.raw`/(^|[\s,{])(?:(?:${qn})\s*:\s*|(?:${Kn})(?:\s+=\s*|=\s+))([^\s#"'\x60<>]+)/g`,ar=String.raw`/(^|[\s,{])(?:${Jn})=([^\s#"'\x60<>]+)/g`,or=String.raw`/(^|[\s,{])[a-z0-9][a-z0-9._-]{0,79}[-_](?:${Yn})\s*[:=]\s*([^\s#"'\x60<>]+)/g`,sr=String.raw`/(^|[\s,{])[a-z0-9_.-]{1,80}\.(?:${Kn})\s*[:=]\s*([^\s#"'\x60<>]+)/g`,cr=String.raw`"(?:apiKey|api_key|apiToken|api_token|bearerToken|bearer_token|token|secret|password|passwd|${Hn}|credential|authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token|accessToken|access_token|refreshToken|refresh_token|idToken|id_token|authToken|auth_token|clientSecret|client_secret|privateKey|private_key|secret_value|raw_secret|secret_input|key_material)"\s*:\s*"([^"]+)"`,lr=String.raw`"(?:${Vn})"\s*:\s*"([^"]+)"`,ur=String.raw`(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|id[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret|private[-_]key|credential|authorization|secret[-_]value|raw[-_]secret|secret[-_]input|key[-_]material)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`,dr=String.raw`(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`,fr=String.raw`(^|[^A-Za-z0-9])`,base64SafeToken=e=>String.raw`${fr}(?=${e})(?<!;base64,[A-Za-z0-9+/=]*)(${e})`,pr=String.raw`(^|[^A-Za-z0-9_])`,mr=/(?=[A-Za-z0-9/+=]{0,39}[A-Z])(?=[A-Za-z0-9/+=]{0,39}[a-z])(?=[A-Za-z0-9/+=]{0,39}[0-9/+=])(?=[A-Za-z0-9/+=]{0,39}[G-Zg-z/+=])[A-Za-z0-9/+=]{40}/u,hr=/\s/,gr=/[A-Za-z0-9+.-]/,_r=/[A-Za-z]/,vr=Object.freeze({source:`aws-secret-access-key`,exec:matchAwsSecretAccessKeys,couldMatch:couldMatchAwsSecretAccessKey}),yr=new RegExp(String.raw`(?<![A-Za-z0-9])(pass|${qn})\s*:\s*`,`gi`),br=/[^\s#"'\x60<>]+/y,xr=/[A-Za-z0-9]/,Sr=/[ \t\r\n]/,Cr=Object.freeze({source:`bare-pass-assignment`,exec:matchBarePassAssignments}),wr=String.raw`\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b`,Tr=String.raw`\b(\d{6,}:[A-Za-z0-9_-]{20,})\b`,Er=`x-goog-api-key|api-key|apikey|x-api-token|x-access-token`,Dr=`X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token`,Or=String.raw`(^|[^A-Za-z0-9_?&-]|\\{1,64}[rn])`,kr=String.raw`${Or}(?:${Er})${D}[ \t]*:${Pt}${D}([^\s\\"',;]+)`,Ar=String.raw`${Or}(?:${Er})${D}[ \t]*=${Pt}${D}([^\s\\"',;]+)`,jr=String.raw`${Or}(?:${Dr})\s*:\s*([^\s"',;]+)`,Mr=String.raw`${Or}(?:${Dr})\s*=\s*([^\s"',;]+)`,Nr=[String.raw`${Lt}Proxy-Authorization${D}[ \t]*[:=]${Pt}${D}${At}${Ft}(${jt})`,String.raw`${Lt}Proxy-Authorization${D}[ \t]*[:=]${Pt}${D}(${jt})[ \t]*(?=${D}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,String.raw`${Lt}Authorization${D}[ \t]*[:=]${Pt}${D}(?!(?:Bearer|Basic|Bot)(?=${Ft}))${At}${Ft}(${jt})`,String.raw`${Lt}Authorization${D}[ \t]*[:=]${Pt}${D}(?!(?:Bearer|Basic|Bot)(?=${Ft}))(${jt})[ \t]*(?=${D}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,kr,Ar],Pr=String.raw`Authorization${D}[ \t]*[:=]${It}${D}Bearer${Ft}(${jt})`,Fr=String.raw`Authorization${D}[ \t]*[:=]${It}${D}Basic${Ft}(${jt})`,Ir=String.raw`Authorization${D}[ \t]*[:=]${It}${D}Bot${Ft}(${jt})`,Lr=String.raw`\bBearer\s+([-A-Za-z0-9._~+/=]{18,})(?![-A-Za-z0-9._~+/=])`,Rr=[Qn,$n,cr,lr,ur,dr,String.raw`--(?:${Xn})=([^\s"']+)`,String.raw`--(?:${Xn})\s+(?!(?:or|and)\b(?=\s+--))(["']?)([^\s"']+)\1`,Pr,Fr,Ir,...Nr,jr,Mr,Lr,String.raw`\b(?:https?|wss?|ftp):\/\/[^\/\s:@]*:([^\/\s@]+)@`,String.raw`\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:\s/@]*:([^@\s]+)@`,String.raw`(^|[\s,;])(?:${Wn})=([^&\s]+)(?=&[A-Za-z_][A-Za-z0-9_.-]*=)`,er,tr,rr,ir,Cr,ar,or,sr,Ln,String.raw`(^|[\s,{])["']?(?:${Hn})["']?\s*[:=]\s*(["']?)([A-Za-z0-9/+=]{40})(?![A-Za-z0-9/+=])\2`],zr=[String.raw`\b(sk-[A-Za-z0-9_-]{8,})\b`,String.raw`(ghp_[A-Za-z0-9]{10,})`,String.raw`(github_pat_[A-Za-z0-9_]{10,})`,String.raw`(gho_[A-Za-z0-9]{10,})`,String.raw`(ghu_[A-Za-z0-9]{10,})`,String.raw`(ghs_[A-Za-z0-9]{10,})`,String.raw`(ghr_[A-Za-z0-9]{10,})`,String.raw`(glpat-[A-Za-z0-9._=\-]{20,})`,String.raw`(gloas-(?:[A-Fa-f0-9]{65,}|[A-Za-z0-9_-]{64}|[A-Fa-f0-9]{32,}))`,String.raw`(gldt-[A-Za-z0-9_-]{20,})`,String.raw`(glcbt-[A-Za-z0-9]{1,5}_[A-Za-z0-9_-]{20,})`,String.raw`(glptt-[A-Za-z0-9_-]{40,})`,String.raw`(glft-(?:[A-Za-z0-9_-]{20,}|[a-h0-9]+-[0-9]+_))`,String.raw`(glimt-[A-Za-z0-9_-]{25,})`,String.raw`(glagent-[A-Za-z0-9_-]{50,})`,String.raw`(glwt-[A-Za-z0-9_-]{20,})`,String.raw`(glsoat-[A-Za-z0-9_-]{20,})`,String.raw`(glffct-[A-Za-z0-9_-]{20,})`,String.raw`(glrt-[A-Za-z0-9._-]{20,})`,String.raw`(glrtr?-[A-Za-z0-9_-]{27,300}\.[0-9a-z]{2}\.[0-9a-z]{9})`,String.raw`(GR1348941[A-Za-z0-9_-]{20,})`,String.raw`(_gitlab_session=[A-Za-z0-9%._-]{20,})`,String.raw`(xox[baprs]-[A-Za-z0-9-]{10,})`,String.raw`(xapp-[A-Za-z0-9-]{10,})`,String.raw`(https:\/\/hooks\.slack\.com\/(?:services\/T[A-Z0-9]+\/B[A-Z0-9]+|workflows\/T[A-Z0-9]+\/A[A-Z0-9]+\/[0-9]{17,19})\/[A-Za-z0-9]{20,})`,String.raw`(https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]{17,20}\/[A-Za-z0-9_-]{60,})`,String.raw`discord(?:.|\n|\r){0,40}?\b([A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27})\b`,String.raw`(gsk_[A-Za-z0-9_-]{10,})`,String.raw`(AIza[0-9A-Za-z\-_]{20,})`,String.raw`(ya29\.[0-9A-Za-z_\-./+=]{10,})`,String.raw`(1//0[0-9A-Za-z_\-./+=]{10,})`,String.raw`(GOCSPX-[A-Za-z0-9_-]{20,})`,String.raw`(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,String.raw`(pplx-[A-Za-z0-9_-]{10,})`,String.raw`(fal_[A-Za-z0-9_-]{10,})`,String.raw`${pr}(fc-[A-Za-z0-9]{10,})`,String.raw`(bb_live_[A-Za-z0-9_-]{10,})`,base64SafeToken(String.raw`gAAAA[A-Za-z0-9_=-]{20,}`),String.raw`(sk_live_[A-Za-z0-9]{10,})`,String.raw`(sk_test_[A-Za-z0-9]{10,})`,String.raw`(rk_live_[A-Za-z0-9]{10,})`,String.raw`(SG\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,String.raw`(npm_[A-Za-z0-9]{10,})`,String.raw`(pypi-[A-Za-z0-9_-]{10,})`,String.raw`(dop_v1_[A-Za-z0-9]{10,})`,String.raw`(doo_v1_[A-Za-z0-9]{10,})`,String.raw`(dor_v1_[A-Za-z0-9]{10,})`,String.raw`(dp\.(?:ct|pt|sa|scim|audit)\.[A-Za-z0-9]{40,44})`,String.raw`(dp\.st\.[A-Za-z0-9]{40,44})`,String.raw`(dp\.st\.[a-z0-9_-]{2,35}\.[A-Za-z0-9]{40,44})`,String.raw`(dckr_(?:pat|oat)_[A-Za-z0-9_-]{27,32})`,String.raw`(bkua_[a-z0-9]{40})`,String.raw`(CCIPAT_[A-Za-z0-9]{22}_[A-Fa-f0-9]{40})`,String.raw`(sbp_[a-z0-9]{40})`,base64SafeToken(String.raw`dapi[0-9a-f]{32}(?:-\d)?`),String.raw`(dd[pw]_[A-Za-z0-9]{36})`,String.raw`(glsa_[A-Za-z0-9_]{41})`,String.raw`(glc_eyJ[A-Za-z0-9+/=]{60,160})`,String.raw`(nfp_[A-Za-z0-9_]{36})`,String.raw`(CFPAT-[A-Za-z0-9_\-]{40,})`,base64SafeToken(String.raw`ATCTT3xFfG[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`),base64SafeToken(String.raw`ATATT[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`),base64SafeToken(String.raw`ATBB[A-Za-z0-9_=.-]{16,}`),String.raw`(BBDC-[A-Za-z0-9+/@_-]{40,50})`,String.raw`(HRKU-AA[A-Za-z0-9_-]{20,})`,String.raw`(pat-(?:eu|na)1-[A-Za-z0-9]{8}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{12})`,String.raw`(apify_api_[A-Za-z0-9\-]{20,})`,String.raw`(FlyV1 fm\d+_[A-Za-z0-9+/=,_-]{100,})`,String.raw`(fio-u-[A-Za-z0-9_-]{40,})`,String.raw`(^|[^A-Za-z0-9_])(am_[A-Za-z0-9_-]{10,})`,String.raw`(^|[^A-Za-z0-9_])(sk_[A-Za-z0-9_]{10,})`,String.raw`(tvly-[A-Za-z0-9]{10,})`,String.raw`(exa_[A-Za-z0-9]{10,})`,String.raw`(syt_[A-Za-z0-9]{10,})`,String.raw`(retaindb_[A-Za-z0-9]{10,})`,String.raw`(hsk-[A-Za-z0-9]{10,})`,String.raw`(mem0_[A-Za-z0-9]{10,})`,String.raw`(brv_[A-Za-z0-9]{10,})`,String.raw`(xai-[A-Za-z0-9]{30,})`,String.raw`${pr}(fw-[A-Za-z0-9]{30,})`,String.raw`${pr}(fw_[A-Za-z0-9]{30,})`,String.raw`${pr}(fpk_[A-Za-z0-9]{30,})`,base64SafeToken(String.raw`AKIA[A-Z0-9]{16}`),base64SafeToken(String.raw`ASIA[A-Z0-9]{16}`),String.raw`(AKID[A-Za-z0-9]{10,})`,String.raw`(LTAI[A-Za-z0-9]{10,})`,String.raw`(hf_[A-Za-z0-9]{10,})`,String.raw`(api_org_[A-Za-z0-9]{20,})`,String.raw`(r8_[A-Za-z0-9]{10,})`,wr,Tr],Br=[...Rr,...zr,vr]})))()}function createFormBodyRedactor(e){function normalizeSensitiveKeyName(e){let t=e.replace(Hr,``);try{return decodeURIComponent(t).replace(Hr,``).toLowerCase().replaceAll(`-`,`_`)}catch{return t.toLowerCase().replaceAll(`-`,`_`)}}function isSensitiveBodyKey(t){return isSensitiveUrlQueryParamName(t)||e.has(normalizeSensitiveKeyName(t))}function hasEncodedOrInvisibleFormKey(e){return Ur.test(e)||e.replace(Vr,``)!==e}function visitSensitiveAssignments(e,t,n){if(!e||t===`url`&&!e.includes(`?`)||t===`encoded`&&!e.includes(`%`)&&e.replace(Vr,``)===e||t===`context`&&!/[=:]/u.test(e))return;let visitPair=(e,r,i)=>{if(t===`encoded`&&!hasEncodedOrInvisibleFormKey(e)||!isSensitiveBodyKey(e))return;let{maskable:a,maskStart:o,maskEnd:s}=splitSecretValueForMask(r);n(i+o,i+s,a)};if(t===`form`){let t=0;for(let n of e.split(`&`)){let e=n.indexOf(`=`);e>=0&&visitPair(n.slice(0,e),n.slice(e+1),t+e+1),t+=n.length+1}return}let r=t===`url`?Qr:t===`encoded`?Xr:Zr,i=t===`context`?3:2;r.lastIndex=0;try{for(let t=r.exec(e);t;t=r.exec(e)){let e=t[1]??``,n=t[i]??``;visitPair(n,t[i+1]??``,t.index+e.length+n.length+1)}}finally{r.lastIndex=0}}function redactAssignmentValues(e,t,n){let r=[],i=[],a=0;return visitSensitiveAssignments(e,t,(o,s,c)=>{let l=t===`url`?maskToken(c):`***`;r.push(e.slice(a,o),l),n&&i.push({start:o,end:s,replacement:l}),a=s}),i.length>0&&n?.(i),r.length>0?r.join(``)+e.slice(a):e}function redactFormBodyLine(e,t){if(!e.includes(`=`))return e;let n=redactAssignmentValues(redactAssignmentValues(e,`encoded`,t),`context`,t);if(!n.includes(`&`))return n;if(Jr.test(n))return redactAssignmentValues(n,`form`,t);let r=[],i=n.replace(Yr,(e,n,i,a)=>{let o=redactAssignmentValues(i,`form`,t?e=>{for(let t of e)r.push({...t,start:a+n.length+t.start,end:a+n.length+t.end})}:void 0);return o===i?e:`${n}${o}`});return r.length>0&&t?.(r),redactAssignmentValues(redactAssignmentValues(i,`encoded`,t),`context`,t)}function redactFormBody(e,t){if(!e.includes(`=`))return e;if($r.test(e)){let n=0;return e.split($r).map(e=>{let r=ei.test(e)?e:redactFormBodyLine(e,t?e=>t(e.map(e=>({...e,start:n+e.start,end:n+e.end}))):void 0);return n+=r.length,r}).join(``)}return redactFormBodyLine(e,t)}return{redactAssignmentValues,redactFormBody}}var Vr,Hr,Ur,Wr,Gr,Kr,qr,Jr,Yr,Xr,Zr,Qr,$r,ei;function init_redact_form_body(){return(init_redact_form_body=__esmMin((()=>{init_redact_sensitive_url(),init_redact_mask(),init_redact_patterns(),Vr=new RegExp(String.raw`[${Zn}+]`,`gu`),Hr=/[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu,Ur=/%[0-9A-Fa-f]{2}/u,Wr=String.raw`[${Zn}+]*(?:[A-Za-z_]|%[0-9A-Fa-f]{2})(?:[A-Za-z0-9_.-]|%[0-9A-Fa-f]{2}|[${Zn}+])*`,Gr=`[^&\\s<>]*`,Kr=`[^&#\\s<>]*`,qr=String.raw`${Wr}=${Gr}`,Jr=new RegExp(String.raw`^${qr}(?:&${qr})+$`,`u`),Yr=RegExp(String.raw`(^|[\s:({\[,="'`+"`"+String.raw`])(${qr}(?:&${qr})+)`,`gu`),Xr=RegExp(String.raw`(^|[\s:({\[,="'`+"`"+String.raw`&])(${Wr})=(${Gr})`,`gu`),Zr=new RegExp(String.raw`(\b(?:body|form(?:[-_\s]?body)?)\s*[:=]\s*(["'\x60]?))(${Wr})=(${Gr})(["'\x60]?)`,`giu`),Qr=new RegExp(String.raw`([?&])(${Wr})=(${Kr})`,`gu`),$r=/(\r\n|\r|\n)/u,ei=/^(?:\r\n|\r|\n)$/u})))()}function skipWhitespace(e,t){let n=t;for(;e[n]===` `||e[n]===`	`||e[n]===`\r`||e[n]===`
`;)n+=1;return n}function readScalarTokens(e,t){let n=[],r=[],i={key:``,path:[],origins:t,origin:t.value,objectPath:!0},valueContext=e=>e?e.array?{...e.context,origin:e.context.origins?.value??e.context.origin,origins:e.context.origins?.children.get(String(e.nextIndex++))}:expectDefined(e.field,`JSON object field context`):i;for(let t of e.matchAll(ti)){let i=t[0],a=r.at(-1);if(i===`{`||i===`[`){let e=valueContext(a),o=i===`[`;r.push({array:o,nextIndex:0,context:o?{...e,objectPath:!1}:e,start:t.index,tokenStart:n.length});continue}if(i===`}`||i===`]`){let i=expectDefined(r.pop(),`JSON container`);if(i.tokenStart===n.length){let r=t.index+1,a=e.slice(i.start,r);n.push({...i.context,isKey:!1,string:!1,value:a,start:i.start,end:r,escaped:!1,edits:[],projectedEdits:[],currentValue:a,currentStart:i.start,currentEnd:r})}continue}let o=t.index,s=o+i.length,c=i.startsWith(`"`),l=c?JSON.parse(i):i,u=skipWhitespace(e,s),d=c&&e[u]===`:`,f;if(d){let t=expectDefined(a,`JSON property container`),n=t.context;f={key:``,path:[],origin:n.origin,objectPath:!1,rootKey:n.rootKey,rootValueStart:n.rootValueStart};let i=skipWhitespace(e,u+1);t.field={key:l,path:[...n.path,l],origins:n.origins?.children.get(l),origin:n.origins?.value??n.origin,objectPath:n.objectPath,rootKey:r.length===1?l:n.rootKey,rootValueStart:r.length===1?i:n.rootValueStart}}else f=valueContext(a);let p=d?{structured:!1,primitiveMask:!1}:f.origins?.value??f.origin;n.push({...f,origin:p,start:o,end:s,isKey:d,string:c,value:l,escaped:c&&i.includes(`\\`),edits:[],projectedEdits:[],currentValue:l,currentStart:o,currentEnd:s})}return n}function readBatchTokens(e,t,n=!1){let r=[],i=0;for(let a of e.split(`
`)){let e=!1;try{JSON.parse(a),e=!0}catch{}if(e)for(let e of readScalarTokens(a,t))e.deferEncoding=!e.string,e.start+=i,e.end+=i,e.currentStart+=i,e.currentEnd+=i,r.push(e);else{let e=r.at(-1);!n&&e?.raw&&e.end+1===i?(e.value+=`\n${a}`,e.currentValue=e.value,e.end=e.currentEnd=i+a.length):r.push({raw:!0,origin:t.value,key:``,path:[],objectPath:!1,isKey:!1,string:!1,value:a,escaped:!1,start:i,end:i+a.length,currentStart:i,currentEnd:i+a.length,currentValue:a,edits:[],projectedEdits:[]})}i+=a.length+1}return r}var ti;function init_redact_json_tokens(){return(init_redact_json_tokens=__esmMin((()=>{init_src(),ti=/"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}[\]]/g})))()}function parseRedactPatternSource(e){let t=e.match(/^\/(.+)\/([gimsuy]*)$/);if(!t)return[e,`gi`];let n=t[1]??``,r=t[2]??``;return[n,r.includes(`g`)?r:`${r}g`]}function escapeAtomEnd(e,t){let n=e[t+1];if(n===void 0)return-1;if(ai.has(n))return t+2;if(n===`x`)return ii.test(e[t+2]??``)&&ii.test(e[t+3]??``)?t+4:t+2;if((n===`u`||n===`p`||n===`P`)&&e[t+2]===`{`){let n=e.indexOf(`}`,t+3);return n===-1?t+2:n+1}if(n===`u`){let n=t+2;for(;n<t+6&&ii.test(e[n]??``);)n+=1;return n}if(n===`c`)return t+3;if(n===`k`&&e[t+2]===`<`){let n=e.indexOf(`>`,t+3);return n===-1?t+2:n+1}if(n>=`0`&&n<=`9`){let n=t+2;for(let t=n;t<e.length;t+=1){let r=e[t];if(r===void 0||r<`0`||r>`9`)break;n=t+1}return n}return t+2}function classAtomEnd(e,t){let n=t+1;if(e[n]===`^`&&(n+=1),e[n]===`]`)return-1;for(;n<e.length;){let t=e[n];if(t===`\\`){n+=2;continue}if(t===`]`)return n+1;n+=1}return e.length}function rewriteOpenEndedRepeats(e,t=``){if(!e.includes(`{`))return e;let n=``,r=-1,i=-1,a=0;for(;a<e.length;){let o=e[a],s=a+1,c=!0;if(o===`\\`)s=escapeAtomEnd(e,a),s<0?(s=a+1,c=!1):t.includes(`u`)&&isHighSurrogateEscape(e,a)&&e[s]===`\\`&&isLowSurrogateEscape(e,s)?s=escapeAtomEnd(e,s):c=!ai.has(e[a+1]);else if(o===`[`){if(s=classAtomEnd(e,a),s<0)return e}else if(o===`{`){let t=ni.exec(e.slice(a)),o=t&&r>=0?t:ri.exec(e.slice(a));if(o){n+=o===t?`{${t[1]}}${e.slice(r,i)}*`:o[0],a+=o[0].length,e[a]===`?`&&(n+=`?`,a+=1),r=-1;continue}}else t.includes(`u`)&&o>=`\ud800`&&o<=`\udbff`&&a+1<e.length&&e[a+1]>=`\udc00`&&e[a+1]<=`\udfff`?s=a+2:c=!`*+?()|^$`.includes(o);n+=e.slice(a,s),r=c?a:-1,i=s,a=s}return n}function readRedactMatch(e){let t=e.length>0&&typeof e[e.length-1]==`object`&&e[e.length-1]!==null?e.length-2:e.length-1,n=t-1,r=typeof e[0]==`string`?e[0]:``,i=e.slice(1,n).map(e=>typeof e==`string`?e:``),a=typeof e[n]==`number`?e[n]:-1;return{match:r,groups:i,input:typeof e[t]==`string`?e[t]:``,offset:a}}function setRedactPatternPrefilter(e,t){if(oi.has(e))return;let n=e.source,r=e.exec,i=e instanceof RegExp?e.flags:void 0,a=e instanceof RegExp?e[Symbol.replace]:void 0;oi.set(e,o=>e.source!==n||e.exec!==r||e instanceof RegExp&&(e.flags!==i||e[Symbol.replace]!==a)||t(o))}function getIndexedCaptureStart(e,t,n,r,i){if(!(e instanceof RegExp)||r<0||!t)return null;let a=si.get(e);a||(a=new RegExp(e.source,`${e.flags.replace(`d`,``).replace(`g`,``)}dg`),si.set(e,a)),a.lastIndex=r;let o=a.exec(t),s=o?.indices?.[i+1];return o?.index===r&&o[0]===n&&s?s[0]-r:null}function selectSecretCapture(e,t){let n={index:-1,value:e};for(let e=0;e<t.length;e++){let r=t[e];typeof r==`string`&&r.length>0&&(n.index=e,n.value=r)}return n}function getSecretCaptureStart(e,t,n,r,i){return getIndexedCaptureStart(e,t,n,r,i.index)??n.lastIndexOf(i.value)}function visitRedactMatches(e,t,n){if(oi.get(t)?.(e)===!1)return;if(!(t instanceof RegExp)){for(let r of t.exec(e))n(r,t);return}let r=t.global?t:ci.get(t);r||(r=new RegExp(t.source,`${t.flags}g`),ci.set(t,r));let i=r.unicode||r.flags.includes(`v`),a=0;for(;a<=e.length;){let o=r.lastIndex,s;try{r.lastIndex=a,s=r.exec(e)}finally{r.lastIndex=o}if(!s)return;if(a=s.index+s[0].length,!s[0]){let t=e.codePointAt(a);a+=i&&t!==void 0&&t>65535?2:1}n({match:s[0],groups:s.slice(1).map(e=>e??``),input:e,offset:s.index},t)}}function replaceRedactPattern(e,t,n,r){if(t instanceof RegExp)return oi.get(t)?.(e)===!1?(t.lastIndex=0,e):e.replace(t,r??((...e)=>n(readRedactMatch(e))));let i=[],a=0;return visitRedactMatches(e,t,t=>{i.push(e.slice(a,t.offset),n(t)),a=t.offset+t.match.length}),i.length?i.join(``)+e.slice(a):e}function redactPemBlock(e,t){let n=e.split(/\r?\n/).filter(Boolean);return n.length<2?`***`:`${n[0]}\n${t}\n${n[n.length-1]}`}var ni,ri,ii,ai,escapeHexValue,isHighSurrogateEscape,isLowSurrogateEscape,oi,si,ci;function init_redact_pattern_runtime(){return(init_redact_pattern_runtime=__esmMin((()=>{ni=/^\{(\d+),\}/,ri=/^\{(?:\d+(?:,\d*)?|,\d+)\}/,ii=/[0-9A-Fa-f]/,ai=/* @__PURE__ */ new Set([`b`,`B`]),escapeHexValue=(e,t)=>{let n=0;for(let r=0;r<4;r+=1){let i=e[t+r];if(i===void 0||!ii.test(i))return null;n=n*16+Number.parseInt(i,16)}return n},isHighSurrogateEscape=(e,t)=>{let n=escapeHexValue(e,t+2);return n!==null&&n>=55296&&n<=56319},isLowSurrogateEscape=(e,t)=>{let n=escapeHexValue(e,t+2);return n!==null&&n>=56320&&n<=57343},oi=/* @__PURE__ */ new WeakMap,si=/* @__PURE__ */ new WeakMap,ci=/* @__PURE__ */ new WeakMap})))()}function stringBoundaries(e,t,n){let r=/* @__PURE__ */ new Map,i=0;for(let a=t;a<n;i+=1)r.set(a,i),a+=e[a]===`\\`?e[a+1]===`u`?6:2:1;return r.set(n,i),r}function decodedBoundary(e,t,n){return t.escaped?(t.boundaries??=stringBoundaries(e,t.start+1,t.end-1),t.boundaries.get(n)):n-t.start-1}function encodedBoundary(e,t,n){if(!t.escaped)return t.start+1+n;if(!t.encodedBoundaries){t.boundaries??=stringBoundaries(e,t.start+1,t.end-1),t.encodedBoundaries=[];for(let[e,n]of t.boundaries)t.encodedBoundaries[n]=e}return expectDefined(t.encodedBoundaries[n],`decoded JSON edit boundary`)}function projectMessageEdits(e,t,n,r){let i=new Map(n.parts.map(e=>[e.key,e])),a=[];for(let o of t){if(!o.isKey&&o.path.length===1&&o.key===`message`)continue;let t=o.rootKey===void 0?void 0:i.get(o.rootKey);if(!t||!t.json&&(o.isKey||(t.messageField?o.path.length!==2||o.key!==`message`:o.path.length!==1)))continue;let s=r(o);for(let r of s){let i,s,c=r.replacement;if(t.json){let n=t.start-expectDefined(o.rootValueStart,`displayed JSON argument`);o.string?(i=n+encodedBoundary(e,o,r.start),s=n+encodedBoundary(e,o,r.end),c=JSON.stringify(c).slice(1,-1)):(i=n+o.start,s=n+o.end,c=JSON.stringify(c))}else i=t.start+r.start,s=t.start+(t.primitiveLength??r.end);i<n.contentLength&&a.push({start:i,end:Math.min(s,n.contentLength),replacement:c,scalar:t.json&&!o.string})}}return a.toSorted((e,t)=>e.start-t.start||e.end-t.end)}function firstIntersectingToken(e,t){let n=0,r=e.length;for(;n<r;){let i=n+r>>>1;expectDefined(e[i],`bounded JSON token search`).currentEnd<=t?n=i+1:r=i}return n}function updateCurrentToken(e,t){if(t.raw||t.deferEncoding){t.currentRaw=t.currentValue;return}let n=[],r=[],i=t.start+ +!!t.string,a=0,o=0;for(let s of t.edits){let c=t.string?encodedBoundary(e,t,s.start):t.start+s.start,l=t.string?encodedBoundary(e,t,s.end):t.start+s.end,u=JSON.stringify(s.replacement).slice(1,-1),d=a+c-i,f=d+u.length;r.push({start:d,end:f,decodedStart:s.start+o,decodedEnd:s.start+o+s.replacement.length,sourceEnd:l,sourceDecodedEnd:s.end,replacement:u}),n.push(e.slice(i,c),u),a=f,o+=s.replacement.length-(s.end-s.start),i=l}n.push(e.slice(i,t.end-+!!t.string)),t.currentRaw=`"${n.join(``)}"`,t.encodedEdits=r}function currentDecodedBoundary(e,t,n,r){let i=n-t.currentStart-1,a=t.encodedEdits;if(!a)return decodedBoundary(e,t,t.start+1+i);let o=0,s=a.length;for(;o<s;){let e=o+s>>>1;expectDefined(a[e],`current encoded edit`).end<i?o=e+1:s=e}let c=a[o];if(c&&i>=c.start){let e=i-c.start;if(!c.replacement.includes(`\\`))return c.decodedStart+e;let t=r.get(c.replacement);t||(t=stringBoundaries(c.replacement,0,c.replacement.length),r.set(c.replacement,t));let n=t.get(e);return n===void 0?void 0:c.decodedStart+n}let l=a[o-1],u=decodedBoundary(e,t,i+(l?l.sourceEnd-l.end:t.start+1));return u===void 0?void 0:u+(l?l.decodedEnd-l.sourceDecodedEnd:0)}function commitPatternEdits(e){let t=e.pending;if(e.pending=void 0,!t)return!1;let n=mergeRedactionEdits(t),r=applyRedactionEdits(e.currentValue,n);return r!==e.currentValue&&(e.edits=composeRedactionEdits(e.value.length,e.edits,n),e.currentValue=r,!0)}function changedRedactionEdits(e,t){let n=0;return t.filter(t=>{for(;e[n]&&expectDefined(e[n],`previous configured edit`).start<t.start;)n+=1;let r=e[n];return!r||r.start!==t.start||r.end!==t.end||r.replacement!==t.replacement})}function commitOriginalEdits(e,t){if(t.length===0)return!1;let n=mergeRedactionEdits([...e.edits,...t]),r=applyRedactionEdits(e.value,n);return r!==e.currentValue&&(e.edits=n,e.currentValue=r,!0)}function updateCurrentRecord(e,t,n,r){let i=[],a=0,o=0;for(let s of n){let n=s.currentStart,c=s.currentEnd;if(r.has(s)){updateCurrentToken(e,s);let r=expectDefined(s.currentRaw,`changed JSON token`);i.push(t.slice(a,n),r),a=c,s.currentStart=n+o,o+=r.length-(c-n)}else s.currentStart=n+o;s.currentEnd=c+o}return i.push(t.slice(a)),i.join(``)}function projectedStringEnd(e,t,n,r,i,a){let o=new Set(n.parts.filter(e=>e.json).map(e=>e.key)),s=projectMessageEdits(e,t,n,e=>e.string&&!e.isKey&&e.rootKey!==void 0&&o.has(e.rootKey)?[{start:0,end:e.value.length,replacement:``}]:[]).filter(e=>e.end<n.contentLength),c=rebaseRedactionEdits(r.edits,s).filter(e=>e.start<=i&&i<e.end&&a<=e.end);return c.length===1?expectDefined(c[0],`displayed source string`).end:r.currentValue.length}function redactJsonRecord(e,t,n,r,i,a,o,s,c,l){let u=l?[]:readScalarTokens(e,t),d=c?u.find(e=>!e.isKey&&e.path.length===1&&e.key===`message`):void 0,f=/* @__PURE__ */ new Map,p=[],m=d?.value??``,h=e,g=/* @__PURE__ */ new Set;for(let e of u)commitOriginalEdits(e,o(e))&&g.add(e);g.size>0&&(h=updateCurrentRecord(e,h,u,g));let v=u.filter(e=>!e.isKey&&e.string&&!s(e,e.currentValue)),projectMessage=()=>{if(!d||!c)return!1;let t=projectMessageEdits(e,u,c,e=>{let t=changedRedactionEdits(e.projectedEdits,e.edits);return e.projectedEdits=e.edits,t});if(t.length===0)return!1;let n=rebaseRedactionEdits(p,t),r=rebaseRedactionEdits(d.edits,t),i=0;for(let e=0;e<r.length;e+=1){let a=expectDefined(r[e],`projected message edit`),o=expectDefined(n[e],`projected source edit`),s=expectDefined(t[e],`source projection`);for(;d.edits[i]&&expectDefined(d.edits[i],`generated message span`).start<s.start;)i+=1;let c=d.edits[i],l=s.scalar&&c?.start===s.start&&c.end===s.end&&a.replacement===JSON.stringify(c.replacement),u=d.currentValue.slice(a.start,a.end);!l&&u!==a.replacement&&u!==m.slice(o.start,o.end)&&(a.replacement=s.scalar?JSON.stringify(`***`):`***`)}return d.pending=r,m=applyRedactionEdits(m,n),p=composeRedactionEdits(d.value.length,p,n),commitPatternEdits(d)};for(let[o,s]of n.entries()){let n=/* @__PURE__ */ new Set,p=/* @__PURE__ */ new Set,add=(e,t)=>{(e.pending??=[]).push(t),p.add(e)},m,visitDecodedMatch=(e,t)=>{let n=r(e,t),i=n?.redact(n);i&&i.end>=i.start&&add(m,i)};for(let i of s)if(!i.couldMatch||i.couldMatch(h))for(let a of i.patterns){if(o===0)for(m of v)visitRedactMatches(m.currentValue,a,visitDecodedMatch);else visitRedactMatches(h,a,n=>{let i=r(n,a);if(!(!i||i.end<i.start)){l&&u.length===0&&(u=readBatchTokens(e,t,l.preserveLines));for(let t=firstIntersectingToken(u,i.start);t<u.length;t+=1){let n=expectDefined(u[t],`serialized capture token`);if(n.currentStart>=i.end)break;let r=n.raw||n.deferEncoding,a=+!r,o=i.start>=n.currentStart+a&&i.end<=n.currentEnd-a;if(l&&n.isKey&&!o)continue;let s=n.currentValue;if(!n.raw&&!n.string&&n.edits.length===0){add(n,{start:0,end:s.length,replacement:`***`});continue}let p=Math.max(i.start,n.currentStart+a),m=r?p-n.currentStart:currentDecodedBoundary(e,n,p,f),g=Math.min(i.end,n.currentEnd-a),v=r?g-n.currentStart:currentDecodedBoundary(e,n,g,f);if(m===void 0||v===void 0){for(;m===void 0;)m=currentDecodedBoundary(e,n,--p,f);for(;v===void 0;)v=currentDecodedBoundary(e,n,++g,f);let t=n===d&&c?projectedStringEnd(e,u,c,n,m,v):s.length;add(n,{start:m,end:t,replacement:`***`});continue}if(v<m||l&&v===m)continue;let{start:y,end:b}=i,x=i.redact({start:m,end:v,value:h.slice(Math.max(y,n.currentStart+a),Math.min(b,n.currentEnd-a))});if(!x)continue;let ee=`***`;if(o)try{ee=r?x.replacement:JSON.parse(`"${x.replacement}"`)}catch{}add(n,{...x,replacement:ee})}}});if(p.size!==0){for(let e of p)commitPatternEdits(e)?o===0&&n.add(e):p.delete(e);o!==0&&p.size>0&&(h=updateCurrentRecord(e,h,u,p)),p.clear()}}for(let e of u)o===0?(e.pending=i(e,e.currentValue),commitPatternEdits(e)&&n.add(e)):commitOriginalEdits(e,a(e))&&n.add(e);(o!==0||g.size>0||n.size>0)&&projectMessage()&&d&&n.add(d),n.size>0&&(h=updateCurrentRecord(e,h,u,n))}if(d&&c){let e=c.finish(d.currentValue);if(e!==d.currentValue)return applyRedactionEdits(h,[{start:d.currentStart,end:d.currentEnd,replacement:JSON.stringify(e)}])}return applyRedactionEdits(h,u.flatMap(e=>e.deferEncoding&&e.edits.length>0?[{start:e.currentStart,end:e.currentEnd,replacement:JSON.stringify(e.currentValue)}]:[]))}function init_redact_json(){return(init_redact_json=__esmMin((()=>{init_src(),init_redact_edit_composition(),init_redact_json_tokens(),init_redact_pattern_runtime()})))()}function isJsWhitespaceAt(e,t){if(t>=e.length)return!1;let n=e.charCodeAt(t);return li.has(n)||n>=8192&&n<=8202}function isJsWhitespaceChar(e){return e!==void 0&&isJsWhitespaceAt(e,0)}function isAlnumChar(e){if(e===void 0)return!1;let t=e.charCodeAt(0);return t>=48&&t<=57||t>=65&&t<=90||t>=97&&t<=122}function isLetterChar(e){if(e===void 0)return!1;let t=e.charCodeAt(0);return t>=65&&t<=90||t>=97&&t<=122}function isWordChar(e){return e===`_`||isAlnumChar(e)}function isHexChar(e){if(e===void 0)return!1;let t=e.charCodeAt(0);return t>=48&&t<=57||t>=65&&t<=70||t>=97&&t<=102}function isDigitChar(e){return e!==void 0&&e.charCodeAt(0)>=48&&e.charCodeAt(0)<=57}function isBase64UrlChar(e){return isAlnumChar(e)||e===`+`||e===`/`||e===`=`}function*scanPrefixOccurrences(e,t){let n=ui.get(t);n||(n=[],ui.set(t,n));let r=n.pop()??new RegExp(t,`gi`);try{r.lastIndex=0;for(let t=r.exec(e);t;t=r.exec(e))yield t.index}finally{r.lastIndex=0,n.push(r)}}function isDataUrlPrefix(e,t){return t>=8&&e.slice(t-8,t).toLowerCase()===`;base64,`}function runEndOf(e,t,n){let r=t;for(;r<e.length&&n(e[r]);)r+=1;return r}function makeCachedRunEnd(e,t){let n=-1,r=-1;return i=>((i<n||i>=r)&&(n=i,r=runEndOf(e,i,t)),r)}function makeBase64SafeTokenMatcher(e,t,n){function*exec(e){let r=n(),i=-1,a=-1,o=0;for(let n of scanPrefixOccurrences(e,t)){if(n<o||n>0&&isAlnumChar(e[n-1]))continue;if(n>0){let t;if(isBase64UrlChar(e[n-1])){if(n-1>=i&&n-1<a)t=i;else{let r=n-1;for(;r>0&&isBase64UrlChar(e[r-1]);)--r;i=r,a=runEndOf(e,n,isBase64UrlChar),t=r}}else t=n;if(isDataUrlPrefix(e,t))continue}let t=r(e,n);if(t===null)continue;let s=n>0?n-1:0;yield{match:e.slice(s,t),groups:[n>0?e[n-1]:``,e.slice(n,t)],input:e,offset:s},o=t+1}}return Object.freeze({source:e,exec})}function fixedTailTokenEnd(e,t,n){return(r,i)=>{let a=i+e+t;for(let t=i+e;t<a;t++)if(!n(r[t]))return null;return a}}function dapiTokenEnd(e,t){let n=di(e,t);return n===null?null:e[n]===`-`&&isDigitChar(e[n+1])?n+2:n}function makeAtEqualsTokenMatcher(e,t){let n=t.length,r=fixedTailTokenEnd(1,8,isAlnumChar);return makeBase64SafeTokenMatcher(e,t,()=>{let e=-1,t=-1,i;return(a,o)=>{let s=o+n;if(s<e||s>=t){t=runEndOf(a,s,AT_VALUE_CHAR),e=s,i=void 0;for(let e=s;e<t;e++)a[e]===`=`&&r(a,e)!==null&&(i=e)}let c=s+1;return i!==void 0&&i>=c?i+9:null}})}function makeUserInfoMatcher(e,t,n){function*exec(e){let r=0,i=-1,a=e.indexOf(`://`);for(;a!==-1;){let o=a;for(;o>0&&isWordChar(e[o-1]);)--o;let s=e.slice(o,a).toLowerCase(),c=o;if(!t.has(s)&&o>=8&&s===`srv`&&e.slice(o-8,o).toLowerCase()===`mongodb+`&&(s=`mongodb+srv`,c=o-8),a>=r&&t.has(s)&&(c===0||!isWordChar(e[c-1]))){let t=a+3;for(;t<e.length&&e[t]!==`:`&&e[t]!==`/`&&e[t]!==`@`&&!isJsWhitespaceAt(e,t);)t+=1;if(e[t]===`:`){let o=t+1;if(o>=i){let t=runEndOf(e,o,e=>!n(e));if(e[t]===`@`&&t>o){yield{match:e.slice(c,t+1),groups:[e.slice(o,t)],input:e,offset:c},r=t+1,a=e.indexOf(`://`,t+1);continue}i=t}}}a=e.indexOf(`://`,a+1)}}return Object.freeze({source:e,exec})}function isFormPairBoundary(e,t){let n=e[t+1];return n===void 0||!isLetterChar(n)&&n!==`_`?!1:e[runEndOf(e,t+2,FORM_FIRST_PAIR_TAIL_CHAR)]===`=`}function makeQuotedAssignmentMatcher(e,t,n){let r=[];function*exec(e){let i=r.pop()??new RegExp(t,n),a=/* @__PURE__ */ new Map,o=0;try{for(;;){i.lastIndex=o;let t=i.exec(e);if(!t)return;let n=t.index,r=t[2],s=n+t[0].length,c=a.get(r),l=-1;if(!(c!==void 0&&s>=c.start&&s<c.end))for(l=s;l<e.length;){let t=e[l];if(t===r||t===`\r`||t===`
`)break;l+=1}if(l>s&&e[l]===r){let i=l+1;yield{match:e.slice(n,i),groups:[t[1]??``,r,e.slice(s,l)],input:e,offset:n},o=i}else l!==-1&&a.set(r,{start:s,end:l}),o=n+1}}finally{i.lastIndex=0,r.push(i)}}return Object.freeze({source:e,exec})}var li,ui,GAAAA_VALUE_CHAR,ATBB_VALUE_CHAR,AT_VALUE_CHAR,di,fi,pi,mi,hi,gi,_i,vi,yi,JWT_SEGMENT_CHAR,bi,xi,Si,Ci,wi,Ti,Ei,Di,Oi,FORM_FIRST_PAIR_KEY_CHAR,FORM_FIRST_PAIR_TAIL_CHAR,ki,Ai,ji,Mi,Ni,Pi;function init_redact_linear_matchers(){return(init_redact_linear_matchers=__esmMin((()=>{init_redact_patterns(),li=/* @__PURE__ */ new Set([9,10,11,12,13,32,160,5760,8232,8233,8239,8287,12288,65279]),ui=/* @__PURE__ */ new Map,GAAAA_VALUE_CHAR=e=>isAlnumChar(e)||e===`_`||e===`=`||e===`-`,ATBB_VALUE_CHAR=e=>isAlnumChar(e)||e===`_`||e===`=`||e===`.`||e===`-`,AT_VALUE_CHAR=e=>isAlnumChar(e)||e===`+`||e===`/`||e===`=`||e===`-`||e===`_`,di=fixedTailTokenEnd(4,32,isHexChar),fi=makeBase64SafeTokenMatcher(`vendor-token gAAAA (linear)`,`gAAAA`,()=>(e,t)=>{let n=runEndOf(e,t+5,GAAAA_VALUE_CHAR);return n-(t+5)>=20?n:null}),pi=makeBase64SafeTokenMatcher(`vendor-token ATBB (linear)`,`ATBB`,()=>(e,t)=>{let n=runEndOf(e,t+4,ATBB_VALUE_CHAR);return n-(t+4)>=16?n:null}),mi=makeBase64SafeTokenMatcher(`vendor-token AKIA (linear)`,`AKIA`,()=>fixedTailTokenEnd(4,16,isAlnumChar)),hi=makeBase64SafeTokenMatcher(`vendor-token ASIA (linear)`,`ASIA`,()=>fixedTailTokenEnd(4,16,isAlnumChar)),gi=makeBase64SafeTokenMatcher(`vendor-token dapi (linear)`,`dapi`,()=>dapiTokenEnd),_i=makeAtEqualsTokenMatcher(`vendor-token ATCTT3xFfG (linear)`,`ATCTT3xFfG`),vi=makeAtEqualsTokenMatcher(`vendor-token ATATT (linear)`,`ATATT`),yi=String.raw`(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,JWT_SEGMENT_CHAR=e=>isAlnumChar(e)||e===`_`||e===`-`,bi=Object.freeze({source:`jwt (linear)`,*exec(e){let t=makeCachedRunEnd(e,JWT_SEGMENT_CHAR),n=makeCachedRunEnd(e,JWT_SEGMENT_CHAR),r=makeCachedRunEnd(e,JWT_SEGMENT_CHAR),i=0;for(let a of scanPrefixOccurrences(e,`eyj`)){if(a<i)continue;let o=t(a+3);if(o-(a+3)<10||e[o]!==`.`)continue;let s=n(o+1);if(s-(o+1)<10||e[s]!==`.`)continue;let c=r(s+1);if(c-(s+1)<10)continue;let l=e.slice(a,c);yield{match:l,groups:[l],input:e,offset:a},i=c}}}),xi=String.raw`\b(?:https?|wss?|ftp):\/\/[^\/\s:@]*:([^\/\s@]+)@`,Si=String.raw`\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:\s/@]*:([^@\s]+)@`,Ci=/* @__PURE__ */ new Set([`http`,`https`,`ws`,`wss`,`ftp`]),wi=/* @__PURE__ */ new Set([`postgres`,`postgresql`,`mysql`,`mongodb`,`mongodb+srv`,`redis`,`rediss`,`amqp`,`amqps`]),Ti=makeUserInfoMatcher(`url-userinfo (linear)`,Ci,e=>e===`/`||e===`@`||isJsWhitespaceChar(e)),Ei=makeUserInfoMatcher(`connection-string (linear)`,wi,e=>e===`@`||isJsWhitespaceChar(e)),Di=String.raw`(^|[\s,;])(?:${Wn})=([^&\s]+)(?=&[A-Za-z_][A-Za-z0-9_.-]*=)`,Oi=RegExp(`^(?:${Wn})$`,`i`),FORM_FIRST_PAIR_KEY_CHAR=e=>isAlnumChar(e)||e===`-`||e===`_`,FORM_FIRST_PAIR_TAIL_CHAR=e=>isAlnumChar(e)||e===`_`||e===`.`||e===`-`,ki=Object.freeze({source:`form-body-first-pair (linear)`,*exec(e){let t=makeCachedRunEnd(e,e=>e!==`&`&&!isJsWhitespaceChar(e)),n=0,r=e.indexOf(`=`);for(;r!==-1;){let i=r;for(;i>0&&FORM_FIRST_PAIR_KEY_CHAR(e[i-1]);)--i;let a=e.slice(i,r);if(r>=n&&a.length>0&&Oi.test(a)&&(i===0||e[i-1]===`,`||e[i-1]===`;`||isJsWhitespaceAt(e,i-1))){let a=r+1,o=t(a);if(o>a&&o<e.length&&e[o]===`&`&&isFormPairBoundary(e,o)){let t=i>0?i-1:0;yield{match:e.slice(t,o),groups:[i>0?e[i-1]:``,e.slice(a,o)],input:e,offset:t},n=o,r=e.indexOf(`=`,o);continue}}r=e.indexOf(`=`,r+1)}}}),Ai=String.raw`(^|[\s,;({\["])(?:${Gn})=(["'\x60])`,ji=String.raw`(^|[\s,{])(?:(?:${nr})(?:\s*:\s*|\s+=\s*|=\s*)|[a-z0-9][a-z0-9._-]{0,79}[-_](?:${Yn})\s*[:=]\s*|[a-z0-9_.-]{1,80}\.(?:${Kn})\s*[:=]\s*)(["'\x60])`,Mi=makeQuotedAssignmentMatcher(`standalone-quoted-assignment (linear)`,Ai,`gi`),Ni=makeQuotedAssignmentMatcher(`config-quoted-assignment (linear)`,ji,`g`),Pi=/* @__PURE__ */ new Map([[base64SafeToken(String.raw`gAAAA[A-Za-z0-9_=-]{20,}`),fi],[base64SafeToken(String.raw`ATCTT3xFfG[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`),_i],[base64SafeToken(String.raw`ATATT[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`),vi],[base64SafeToken(String.raw`ATBB[A-Za-z0-9_=.-]{16,}`),pi],[base64SafeToken(String.raw`dapi[0-9a-f]{32}(?:-\d)?`),gi],[base64SafeToken(String.raw`AKIA[A-Z0-9]{16}`),mi],[base64SafeToken(String.raw`ASIA[A-Z0-9]{16}`),hi],[yi,bi],[xi,Ti],[Si,Ei],[Di,ki],[er,Mi],[rr,Ni]])})))()}function startRedactionMeasurement(e){if(!Fi.hasSubscribers)return;let t=f.now(),n=process.threadCpuUsage();return(r,i,a)=>{let o=f.now()-t,s=process.threadCpuUsage(n);Fi.publish({operation:e,outcome:r,pid:process.pid,threadId:x,isMainThread:g,elapsedMs:o,threadCpuMs:(s.user+s.system)/1e3,...i===void 0?{}:{inputChars:i},...a===void 0?{}:{patternCount:a}})}}var Fi;function init_redact_performance(){return(init_redact_performance=__esmMin((()=>{Fi=ye(`openclaw.redaction`)})))()}function couldMatchDefaultRedactPatterns(e){return Ii.test(e)||(e.includes(`-`)||e.includes(`_`))&&Li.test(e)||Ri.test(e)||e.includes(`://`)&&e.includes(`@`)||e.includes(`=`)&&zi.test(e)||vr.couldMatch(e)}function couldMatchDefaultFullContextPatterns(e){return couldMatchDefaultRedactPatterns(e)||Bi.test(e)}function couldMatchVendorRedactPatterns(e){return(e.includes(`-`)||e.includes(`_`))&&Li.test(e)||Ri.test(e)||Bi.test(e)}function createRedactPrefilter(e){let t=/* @__PURE__ */ new Map;return n=>{let r=t.get(n);if(r!==void 0)return r;let i=e(n);return t.set(n,i),i}}var Ii,Li,Ri,zi,Bi;function init_redact_prefilter(){return(init_redact_prefilter=__esmMin((()=>{init_redact_patterns(),Ii=/KEY|TOKEN|SECRET|PASSWORD|PASSWD|AUTH|COOKIE|SIGNATURE|CREDENTIAL|CARD|CVC|CVV|PAYMENT|security[-_]?code|\bpass\s*[=:]|\bpassphrase\s*[=:]|_(?:password|pass|passphrase|passwd)\s*[=:]|jwt\s*[=:]|session=|code=|\bsig\s*=/iu,Li=/sk-|GOCSPX-|gh[opsur]_|github_pat_|glpat-|gloas-|gldt-|glcbt-|glptt-|glft-|glimt-|glagent-|glwt-|glsoat-|glffct-|glrt-|glrtr-|_gitlab_session=|xox[baprs]-|xapp-|gsk_|pplx-|fal_|fc-|bb_live_|[sr]k_(?:live|test)_|npm_|pypi-|do[opr]_v1_|dckr_|bkua_|CCIPAT_|sbp_|dd[pw]_|glsa_|nfp_|CFPAT-|BBDC-|HRKU-|pat-(?:eu|na)1-|apify_api_|fio-u-|tvly-|exa_|syt_|retaindb_|mem0_|brv_|xai-|fw-|fw_|fpk_|(?:^|[^A-Za-z0-9_])(?:am_|sk_)|hf_|api_org_|r8_/iu,Ri=/PRIVATE KEY|\bBearer\s+|GR1348941|hooks\.slack\.com|discord|AIza|ya29\.|1\/\/0|eyJ|gAAAA|SG\.|dp\.(?:ct|pt|sa|st|scim|audit)\.|dapi[0-9a-f]|ATCTT3|ATATT|ATBB|FlyV1|A[KS]IA[A-Z0-9]|AKID|LTAI|\bbot\d{6,}:|\b\d{6,}:[A-Za-z0-9_-]{20,}/iu,zi=RegExp(`[${Zn}+%]`,`u`),Bi=/JWT|Bearer\s+|am_|sk_|(?<!\d)\d{6,}:[A-Za-z0-9_-]{20,}/i})))()}function invalidateMatcher(){Hi.registeredValueRedactor=void 0}function redactRegisteredSecretValues(e,t){return!e||Hi.registeredValues.size===0?e:(Hi.registeredValueRedactor??=createSecretValueRedactor([...Hi.registeredValues.keys()]),Hi.registeredValueRedactor(e,t))}function createSecretValueRedactor(e){let t,n;return(r,i)=>{if(!r||e.length===0)return r;let a=!1;n??=new Set(e.map(e=>e.charAt(0)));for(let e of n)if(r.includes(e)){a=!0;break}if(!a)return r;if(!t){let n=/* @__PURE__ */ new Map;for(let t of e.toSorted((e,t)=>t.length-e.length)){let e=t.slice(0,Vi),r=n.get(e);r?r.push(t):n.set(e,[t])}t={prefixes:new RegExp([...n.keys()].map(escapeRegExp).join(`|`),`g`),buckets:n}}let{prefixes:o,buckets:s}=t,c=[];o.lastIndex=0;for(let e=o.exec(r);e;e=o.exec(r)){let t=e.index,n=s.get(e[0])?.find(e=>r.startsWith(e,t));n!==void 0&&c.push({index:t,value:n}),o.lastIndex=t+(n?.length??1)}let l=``,u=0;for(let e of c)l+=`${r.slice(u,e.index)}${i(e.value,e.index)}`,u=e.index+e.value.length;return l+r.slice(u)}}function resetSecretRedactionRegistryForTest(){Hi.registeredValues.clear(),invalidateMatcher()}var Vi,Hi;function init_secret_redaction_registry(){return(init_secret_redaction_registry=__esmMin((()=>{init_global_singleton(),Vi=6,Hi=resolveGlobalSingleton(Symbol.for(`openclaw.secretRedactionRegistry`),()=>({registeredValues:/* @__PURE__ */ new Map,registeredValueRedactor:void 0})),process.env.VITEST&&(globalThis[Symbol.for(`openclaw.secretRedactionRegistryTestApi`)]={resetSecretRedactionRegistryForTest})})))()}function isKnownTransportErrorCode(e){return Gi.some(({code:t})=>t.exec(e)?.[0]===e)}var Ui,Wi,Gi;function init_assistant_error_format(){return(init_assistant_error_format=__esmMin((()=>{Ui=/(?:\s*:\s*|\s+)/,RegExp(`^(?:http\\s*)?(\\d{3})${Ui.source}(.+)$`,`i`),RegExp(`^(?:http\\s*)?(\\d{3})(?:${Ui.source}([\\s\\S]+))?$`,`i`),Wi="Couldn't connect to the AI service. Check your connection, then try again. For details, open Settings → Logs in the Control UI or run `openclaw logs --follow`.",Gi=[{code:/\beconnrefused\b/i,phrases:/connection refused|actively refused/i,message:Wi},{code:/\beconnreset\b|\beconnaborted\b|\benetreset\b|\bepipe\b/i,phrases:/socket hang up|connection reset|connection aborted/i,message:"Lost the connection to the AI service. Check the conversation before trying again. For details, open Settings → Logs in the Control UI or run `openclaw logs --follow`."},{code:/\benotfound\b|\beai_again\b|\benetunreach\b|\behostunreach\b|\behostdown\b/i,phrases:/getaddrinfo|no such host|\bdns\b|network is unreachable|host is unreachable|fetch failed|connection error|network request failed/i,message:Wi}]})))()}function shouldRedactStructuredAuthorizationCode(e,t,n){if(e!==`code`)return!1;let r=t.map(e=>e.toLowerCase());return r.length===1||r.at(-1)===`code`&&[`error`,`nodeerror`,`status`,`details`,`warnings`].includes(r.at(-2)??``)?!1:!(n!==void 0&&r.length>1&&r.slice(0,-1).every(e=>e===`cause`)&&isKnownTransportErrorCode(n))}function init_structured_authorization_code(){return(init_structured_authorization_code=__esmMin((()=>{init_assistant_error_format()})))()}function parsePattern(e){if(e===Ln)return Rn;if(typeof e!=`string`&&!(e instanceof RegExp))return typeof e==`object`&&e&&typeof e.exec==`function`?e:null;let t=typeof e==`string`?Pi.get(e)??null:null,n=!0;if(e instanceof RegExp)t=e.flags.includes(`g`)?e:new RegExp(e.source,`${e.flags}g`);else if(!t&&e.trim()){let[r,i]=parseRedactPatternSource(e),a=ta.has(e)?rewriteOpenEndedRepeats(r,i):r;t=compileConfigRegex(a,i)?.regex??null,n=t!==null&&t.source===a&&t.flags===i&&t.exec===RegExp.prototype.exec&&t[Symbol.replace]===RegExp.prototype[Symbol.replace]}if(t&&typeof e==`string`&&qi.shellReferencePreserving.has(e)&&Xi.add(t),t&&typeof e==`string`&&qi.formAware.has(e)&&na.add(t),t&&typeof e==`string`&&(e.startsWith(pr)||qi.chunkUnsafe.has(e))&&ea.add(t),t&&typeof e==`string`){if(ta.has(e)&&Zi.add(t),n&&$i.has(e)&&!Qi.has(t)){let e=t.source,n=t.exec,r=t instanceof RegExp?t.flags:void 0,i=t instanceof RegExp?t[Symbol.replace]:void 0;Qi.set(t,()=>t.source===e&&t.exec===n&&(!(t instanceof RegExp)||t.flags===r&&t[Symbol.replace]===i))}let r=qi.prefilters.get(e);n&&r&&setRedactPatternPrefilter(t,r)}return t}function resolvePatterns(e){if(usesBuiltInRedactPatterns(e))return ra??=Br.map(parsePattern).filter(e=>!!e),ra;let t=/* @__PURE__ */ new Set,n=!Array.isArray(e);for(let r of Array.isArray(e)?e:[]){let e=parsePattern(r);e?t.add(e):n=!0}if(n){for(let e of resolvePatterns())t.add(e);if(!ia){ia=!0;try{console.warn(`[openclaw] Ignoring invalid logging.redactPatterns entries; keeping valid patterns and built-in redaction. Fix logging.redactPatterns in your config.`)}catch{}}}return t.add(vr),[...t]}function usesBuiltInRedactPatterns(e){return e===void 0||e===Br||Array.isArray(e)&&e.length===0}function isShellReferenceToKey(e,t){if(!/^[A-Z_][A-Z0-9_]*$/.test(e))return!1;let n=t.match(/^\$([A-Z_][A-Z0-9_]*)$/);return n?n[1]===e:t.match(/^\$\{([A-Z_][A-Z0-9_]*)(?::[-=?+])?\}$/)?.[1]===e}function maskSecretFieldValue(e,t){let n=t.match(/^\$\{([A-Z_][A-Z0-9_]*):[-=?+][^{}]+\}(?![\s\S])/);return n&&n[1]===e?`${t.slice(0,t.indexOf(`:`)+2)}***}`:`***`}function shouldPreserveShellReferenceMatch(e,t){let n=e.match(/\b([A-Z_][A-Z0-9_]*)\b\s*[=:]/)?.[1];return n?isShellReferenceToKey(n,t):!1}function isEmptyShellParameterExpansionTail(e){return/^[-=?+]\}$/.test(e)}function prepareRedactionCapture({match:e,groups:t,input:n,offset:r,replacement:i},a){if(e.includes(`PRIVATE KEY-----`))return{start:r,end:r+e.length,value:e,redact:e=>({start:e.start,end:e.end,value:e.value,replacement:i??redactPemBlock(e.value,`…redacted…`)})};let o=selectSecretCapture(e,t);if(o.value===`***`)return;let s=o.value===e?0:getSecretCaptureStart(a,n,e,r,o);if(s<0)return;let c=r+s;return{start:c,end:c+o.value.length,value:o.value,redact:t=>{let n=t.value,r=na.has(a)?splitFormAwareCredentialValue(n):{secret:n,suffix:``};if(splitSecretValueForMask(r.secret).maskable===`***`)return;let o=Xi.has(a);if(o&&(shouldPreserveShellReferenceMatch(e,n)||isEmptyShellParameterExpansionTail(n)))return;let s=i??(o?maskToken(n):`${maskSecretValue(r.secret,{hinted:!0})}${r.suffix}`);return{start:t.start,end:t.end,replacement:s}}}}function redactMatch(e,t){let n=prepareRedactionCapture(e,t),r=n?.redact(n);return r?e.match.slice(0,r.start-e.offset)+r.replacement+e.match.slice(r.end-e.offset):e.match}function redactText(e,t,n){let r=startRedactionMeasurement(`text`),i=`error`;try{let r=Yi(Ji(redactStructuredAuthHeaders(e,`***`),`url`)),a,replace=e=>redactMatch(e,a),replaceRegex=(...e)=>replace(readRedactMatch(e)),o,s=!1;for(a of t){if(Qi.get(a)?.()&&(o!==r&&(o=r,s=couldMatchVendorRedactPatterns(r)),!s)){a instanceof RegExp&&(a.lastIndex=0);continue}r=a instanceof RegExp&&!n?.fullContext&&!Zi.has(a)&&!ea.has(a)?replacePatternBounded(r,a,replaceRegex):replaceRedactPattern(r,a,replace,replaceRegex)}return i=`ok`,r}finally{r?.(i,e.length,t.length)}}function looksLikeAppSpecificPassword(e){return e.split(`-`).every(e=>!la.has(e.toLowerCase()))}function redactAppSpecificPasswords(e){return e.includes(`-`)?e.replace(ca,(e,t)=>looksLikeAppSpecificPassword(t)?maskToken(t):e):e}function resolveConfigRedaction(){let e=readLoggingConfig();return{mode:Ki,patterns:e?.redactPatterns}}function resolveRedactOptions(e){let t=e??resolveConfigRedaction(),n=t.mode===`off`?`off`:Ki;return{mode:n,patterns:n===`off`?[]:resolvePatterns(t.patterns)}}function redactSensitiveText(e,t){return e&&redactSensitiveTextWithOptions(redactRegisteredSecretValues(e,maskToken),t??resolveConfigRedaction())}function redactSensitiveTextWithOptions(e,t){return t.mode===`off`||usesBuiltInRedactPatterns(t.patterns)&&!couldMatchDefaultRedactPatterns(e)?e:redactText(e,resolveRedactOptions(t).patterns)}function resolveToolPayloadRedaction(e=readLoggingConfig()){let t=e?.redactPatterns;return{mode:`tools`,patterns:Array.isArray(t)&&t.length>0?[...t,...Br]:t}}function redactToolPayloadText(e){return redactToolPayloadTextWithConfig(e,readLoggingConfig())}function redactToolPayloadTextWithConfig(e,t){return redactSensitiveText(e,resolveToolPayloadRedaction(t))}function isSensitiveFieldKey(e){return aa.test(e)||ua.test(e)}function isPublicShareIdPath(e){return e.at(-1)?.toLowerCase()===`id`&&e.at(-2)?.toLowerCase().replaceAll(`-`,``).replaceAll(`_`,``)===`publicshare`}function redactSensitiveFieldValueWithOptions(e,t,n,r=[e],i=!0,a=couldMatchDefaultRedactPatterns){let o=redactRegisteredSecretValues(t,maskToken);if(isPublicShareIdPath(r))return maskToken(o);let s=resolveRedactOptions(n);if(s.mode===`off`)return o;let c=!usesBuiltInRedactPatterns(n.patterns)||a(o)?redactText(o,s.patterns):o;if(c!==t||sa.test(e)){let e=redactAppSpecificPasswords(c);if(e!==t)return e}return c===t?shouldRedactStructuredStringField(e,o,r,i)?maskToken(o):o:c}function shouldRedactStructuredPrimitiveField(e,t){let n=e.toLowerCase();return isPublicShareIdPath(t)||shouldRedactStructuredAuthorizationCode(n,t)||isSensitiveFieldKey(e)}function isPlainRedactableObject(e){let t=Object.getPrototypeOf(e);return t===Object.prototype||t===null}function redactStructuredSecretValue(e,t,n,r,i,a=e?[e]:[],o=!0){if(typeof t==`string`)return redactSensitiveFieldValueWithOptions(e,t,r,a,o,i);if(t==null)return t;if(typeof t==`number`||typeof t==`boolean`||typeof t==`bigint`)return shouldRedactStructuredPrimitiveField(e,a)?`***`:t;if(Array.isArray(t)){if(n.has(t))return`[Circular]`;n.add(t);let o=t.map(t=>redactStructuredSecretValue(e,t,n,r,i,a,!1));return n.delete(t),o}if(typeof t==`object`){if(n.has(t))return`[Circular]`;if(!isPlainRedactableObject(t))return t;n.add(t);let e=Object.entries(t);for(let t of e){let[e,s]=t;t[1]=redactStructuredSecretValue(e,s,n,r,i,[...a,e],o)}return n.delete(t),Object.fromEntries(e)}return t}function redactSecretsWithOptions(e,t){return typeof e==`string`?redactSensitiveText(e,t):typeof e!=`object`||!e?e:redactStructuredSecretValue(``,e,/* @__PURE__ */ new WeakSet,t,createRedactPrefilter(couldMatchDefaultRedactPatterns))}function redactSecrets(e){return redactSecretsWithOptions(e,resolveToolPayloadRedaction())}function preservesStructuredReference(e,t){return e.toLowerCase()===`session`&&oa.test(t)||isShellReferenceToKey(e,t)}function shouldRedactStructuredStringField(e,t,n,r){return shouldRedactStructuredAuthorizationCode(e.toLowerCase(),n,r?t:void 0)||isSensitiveFieldKey(e)&&!preservesStructuredReference(e,t)}function classifyLogFieldProtection(e,t,n,r){return(r===void 0?shouldRedactStructuredPrimitiveField(e,t):isPublicShareIdPath(t)||shouldRedactStructuredStringField(e,r,t,n))?`legacy`:qi.credentialHeaderField.test(e)?`header`:void 0}function getFieldRecordEdits(e,t){let{key:n,value:r,path:i,objectPath:a}=e;return t===`off`||!e.string&&r===`null`||!classifyLogFieldProtection(n,i,a,e.string?r:void 0)?[]:[{start:0,end:r.length,replacement:maskSecretFieldValue(n,r)}]}function getTextRecordEdits(e,t,n){let{value:r}=e;if(e.isKey||n&&!e.origin.structured)return[];if(n&&e.origin.primitiveMask)return[{start:0,end:r.length,replacement:`***`}];if(!e.string)return[];let i=[],a=redactRegisteredSecretValues(r,(e,t)=>{let n=maskToken(e);return i.push({start:t,end:t+e.length,replacement:n}),n});if(n&&isPublicShareIdPath(e.path))return[{start:0,end:r.length,replacement:maskToken(a)}];if(t===`off`)return i;let o=i,receive=e=>{o=composeRedactionEdits(r.length,o,e)},s=findStructuredAuthParamRanges(a).map(({start:e,end:t})=>({start:e,end:t,replacement:`***`}));receive(s);let c=Ji(applyRedactionEdits(a,s),`url`,receive);return Yi(c,receive),o}function getLegacyFieldRecordEdits(e,t){let{key:n,value:r,path:i,objectPath:a}=e;if(e.isKey||!e.origin.structured||!e.string||isPublicShareIdPath(i))return[];let o=[];if(t!==r||sa.test(n))for(let e of t.matchAll(ca))looksLikeAppSpecificPassword(e[0])&&o.push({start:e.index,end:e.index+e[0].length,replacement:maskToken(e[0])});return o.length>0||t!==r?o:classifyLogFieldProtection(n,i,a,t)===`legacy`?[{start:0,end:t.length,replacement:maskToken(t)}]:[]}function*redactionEditMatches(e,t){for(let n of t)yield{match:e.slice(n.start,n.end),groups:[],input:e,offset:n.start,replacement:n.replacement}}function redactLogRecordForTransport(e,t){let n=startRedactionMeasurement(`log-record`),r=`error`,i;try{let n=t?.redaction??resolveRedactOptions(),a={value:{structured:!0,primitiveMask:!1},children:/* @__PURE__ */ new Map},o=[],s=JSON.stringify(e,function(e,t){for(;o.length>0&&o.at(-1)?.value!==this;)o.pop();let n=o.at(-1),r=Array.isArray(this),i=r&&n?n.key:e,s=r&&n?n.path:n?[...n.path,e]:[],c=t,l=(n?.structured??!0)&&(typeof c!=`object`||!c||Array.isArray(c)||isPlainRedactableObject(c)),u=l&&[`number`,`boolean`,`bigint`].includes(typeof c)&&classifyLogFieldProtection(i,s,!r,void 0)===`legacy`,d=typeof t==`object`&&!!t&&o.some(e=>e.value===t),f=d?`[Circular]`:typeof t==`bigint`?String(t):t,p=typeof f==`object`&&!!f,m=a;return n&&n.structured&&(p||!l||u||d)?(m={value:{structured:l&&!d,primitiveMask:u},children:/* @__PURE__ */ new Map},n.origins.children.set(e,m)):n?m=n.origins:a.value={structured:l,primitiveMask:u},p&&o.push({value:f,path:s,key:i,origins:m,structured:l}),f});i=s.length;let c=createRedactPrefilter(couldMatchDefaultFullContextPatterns),l=JSON.parse(redactJsonRecord(s,a,[[{patterns:n.patterns}],[{patterns:da},{patterns:n.patterns,...n.patterns===ra?{couldMatch:c}:{}}]],prepareRedactionCapture,t?getLegacyFieldRecordEdits:()=>[],e=>getFieldRecordEdits(e,n.mode),e=>getTextRecordEdits(e,n.mode,t!==void 0),(e,t)=>e.path.length===1&&fa.has(e.key)||n.patterns===ra&&!c(t),t?.message));return r=`ok`,l}finally{n?.(r,i)}}var Ki,qi,Ji,Yi,Xi,Zi,Qi,$i,ea,ta,na,ra,ia,aa,oa,sa,ca,la,ua,da,fa;function init_redact(){return(init_redact=__esmMin((()=>{init_structured_auth_redaction(),init_config_regex(),init_config(),init_redact_bounded(),init_redact_edit_composition(),init_redact_form_body(),init_redact_json(),init_redact_linear_matchers(),init_redact_mask(),init_redact_pattern_runtime(),init_redact_patterns(),init_redact_pem(),init_redact_performance(),init_redact_prefilter(),init_secret_redaction_registry(),init_structured_authorization_code(),Ki=`tools`,qi=createBackendRedactPatterns(),{redactAssignmentValues:Ji,redactFormBody:Yi}=createFormBodyRedactor(qi.bodySecretKeys),Xi=/* @__PURE__ */ new WeakSet,Zi=/* @__PURE__ */ new WeakSet,Qi=/* @__PURE__ */ new WeakMap,$i=new Set(zr),ea=/* @__PURE__ */ new WeakSet,ta=new Set(Br.filter(e=>typeof e==`string`)),na=/* @__PURE__ */ new WeakSet,ia=!1,aa=new RegExp(String.raw`^(?:api[-_]?key|apiKey|api[-_]?token|apiToken|bearer[-_]?token|bearerToken|token|secret|password|passwd|${Hn}|credential|authorization|private[-_]?key|privateKey|access[-_]?token|accessToken|refresh[-_]?token|refreshToken|id[-_]?token|idToken|auth[-_]?token|authToken|client[-_]?secret|clientSecret|app[-_]?secret|appSecret|secret[-_]?value|secretValue|raw[-_]?secret|rawSecret|secret[-_]?input|secretInput|key|key[-_]?material|keyMaterial|jwt|session|signature|cookie|set[-_]?cookie|${Bn}|${Vn})$`,`i`),oa=/^\$WORKSPACE_DIR\/[A-Za-z0-9._/-]+\.jsonl$/u,sa=/^(?:apple|icloud|app[-_]?specific[-_]?password|appSpecificPassword|application[-_]?password|text|content|message|error|errorMessage|detail|details|reason)$/i,ca=/\b([a-z]{4}-[a-z]{4}-[a-z]{4}-[a-z]{4})\b/g,la=/* @__PURE__ */ new Set([`case`,`claw`,`demo`,`file`,`main`,`name`,`open`,`path`,`slug`,`test`]),ua=new RegExp(String.raw`^(?:(?:[A-Z0-9]+[_-])+(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD)|API[_-]?KEY|TOKEN|SECRET|PASSWORD|PASSWD|${zn})$`,`i`),da=[{source:`registered secret values`,*exec(e){let t=[];redactRegisteredSecretValues(e,(n,r)=>(t.push({match:n,groups:[],input:e,offset:r,replacement:maskToken(n)}),n)),yield*t}},{source:`structured authorization parameters`,*exec(e){for(let{start:t,end:n}of findStructuredAuthParamRanges(e))yield{match:e.slice(t,n),groups:[],input:e,offset:t,replacement:`***`}}},{source:`URL query assignments`,*exec(e){let t=[];Ji(e,`url`,e=>t.push(...e)),yield*redactionEditMatches(e,t)}},{source:`form bodies`,*exec(e){let t=[];Yi(e,n=>{t=composeRedactionEdits(e.length,t,n)}),yield*redactionEditMatches(e,t)}}],fa=/* @__PURE__ */ new Set([`time`,`level`])})))()}function init_errors$1(){return(init_errors$1=__esmMin((()=>{init_redact(),init_errno()})))()}function walkUpFrom(e,t,n){let r=w.resolve(e);for(let e=0;t.maxDepth===void 0||e<t.maxDepth;e+=1){let e=n(r);if(e!=null)return e;let t=w.dirname(r);if(t===r)break;r=t}return null}function readGitMetadataFile(e,t=1048576){let n=C.openSync(e,C.constants.O_RDONLY|(C.constants.O_NONBLOCK??0));try{let e=C.fstatSync(n);if(!e.isFile()||e.size>t)throw Error(`Git metadata is not a bounded regular file`);let r=readFileDescriptorBoundedSync(n,Math.min(e.size,t));if(r.length!==e.size)throw Error(`Git metadata changed during its read`);return r}finally{C.closeSync(n)}}function readGitDirectoryPointerTarget(e,t=``){let n=readGitMetadataFile(e),r=n.toString(`utf8`).replace(/[\r\n]+$/u,``);if(!ve(n)||!r.startsWith(t)||r.length===t.length||r.includes(`\0`))throw Error(`Git directory pointer is incomplete or malformed`);let i=r.slice(t.length);return w.isAbsolute(i)?i:`${w.dirname(e)}${w.sep}${i}`}function readGitDirectoryPointer(e,t=``){return C.realpathSync.native(readGitDirectoryPointerTarget(e,t))}function resolveGitDirFromMarker(e){let t=w.join(e,`.git`);try{let e=C.statSync(t);return e.isDirectory()?t:e.isFile()?readGitDirectoryPointer(t,`gitdir: `):null}catch{return null}}function resolveGitHeadPath(e,t={}){return walkUpFrom(e,t,e=>{let t=resolveGitDirFromMarker(e);return t?w.join(t,`HEAD`):null})}function readGitMetadataPrefix(e,t=256){let n=C.openSync(e,C.constants.O_RDONLY|(C.constants.O_NONBLOCK??0));try{if(!C.fstatSync(n).isFile())throw Error(`Git metadata is not a regular file`);let e=Buffer.alloc(t),r=readFileWindowFullySync(n,e,0);return e.subarray(0,r).toString(`utf-8`)}finally{C.closeSync(n)}}function readGitHead(e,t={}){let n=resolveGitHeadPath(e,t);if(!n)return;let r=readGitMetadataFile(n).toString(`utf8`).trim();if(!r.startsWith(`ref:`))return{headPath:n,ref:null,value:r||null};let i=r.replace(/^ref:\s*/i,``).trim(),a=resolveGitRefsBase(n);return{headPath:n,ref:i,value:readGitRefs(a,[i]).get(i)??null,refsBase:a}}function resolveGitRefsBase(e){let t=w.dirname(e),n=w.join(t,`commondir`);try{return readGitDirectoryPointer(n)}catch(e){if(!isMissingPathError(e)||C.lstatSync(n,{throwIfNoEntry:!1}))throw e}return t}function readGitRefs(e,t){let n=new Map(t.map(e=>[e,null])),r=/* @__PURE__ */ new Set;for(let i of t){let t=resolveRefPath(e,i);if(t)try{n.set(i,readGitMetadataPrefix(t).trim())}catch(e){if(!isMissingPathError(e))throw e;r.add(i)}}if(r.size===0)return n;try{let t=readGitMetadataFile(w.join(e,`packed-refs`),2**53-1).toString(`utf8`),i=RegExp(`^(?![#^])[^\\S\\r\\n]*(\\S+)[^\\S\\r\\n]+(${[...r].map(escapeRegExp).join(`|`)})(?=\\s|$)`,`gm`);for(let[,e,a]of t.matchAll(i))r.delete(a)&&n.set(a,e)}catch(e){if(!isMissingPathError(e))throw e}return n}function resolveRefPath(e,t){if(!t.startsWith(`refs/`)||t.split(/[/]/).includes(`..`))return null;let n=w.resolve(e,t),r=w.relative(e,n);return!r||r.startsWith(`..`)||w.isAbsolute(r)?null:n}function init_git_root(){return(init_git_root=__esmMin((()=>{init_bounded_read(),init_positional_read(),init_errors$1()})))()}var LruCache;function init_lru_cache(){return(init_lru_cache=__esmMin((()=>{LruCache=class{#e;#t;#n;#r=/* @__PURE__ */ new Map;#i=0;constructor(e,t){this.#e=Number.isFinite(e)&&e>0?Math.max(1,Math.floor(e)):1,this.#t=t?.maxBytes??1/0,this.#n=t?.sizeOf}get size(){return this.#r.size}clear(){this.#r.clear(),this.#i=0}keys(){return this.#r.keys()}delete(e){return this.#r.has(e)?(this.#i-=this.#n?.(this.#r.get(e))??0,this.#r.delete(e)):!1}deleteValue(e){for(let[t,n]of this.#r)n===e&&this.delete(t)}peek(e){return this.#r.get(e)}get(e){if(!this.#r.has(e))return;let t=this.#r.get(e);return this.#r.delete(e),this.#r.set(e,t),t}set(e,t){this.delete(e),this.#r.set(e,t),this.#i+=this.#n?.(t)??0;for(let e of this.#r.keys()){if(this.#r.size<=this.#e&&this.#i<=this.#t)break;this.delete(e)}}}})))()}function materializeErrorStack(e){let t=e,n=/* @__PURE__ */ new Set;for(;t instanceof Error&&!n.has(t);){n.add(t);try{t.stack=String(t.stack)}catch{t.stack=`Stack trace unavailable: custom formatter failed`}t=t.cause}}function createDeferredCore(){return pa.withResolvers()}var pa;function init_deferred(){return(init_deferred=__esmMin((()=>{pa=Promise})))()}function runOutsideAsyncWorkScope(e){return ma.exit(()=>ha.exit(e))}var ma,ha,ga;function init_async_work_scope(){return(init_async_work_scope=__esmMin((()=>{init_detached_async_context(),init_deferred(),init_global_singleton(),ma=resolveGlobalSingleton(Symbol.for(`openclaw.asyncWorkScope`),()=>new S),ha=resolveGlobalSingleton(Symbol.for(`openclaw.asyncWorkScopeAncestry`),()=>new S),ga=class AsyncWorkScope{constructor(e){this.failures=e,this.pending=/* @__PURE__ */ new Set,this.controller=new AbortController,this.phase=`open`}get signal(){return this.controller.signal}get hasPendingWork(){return this.pending.size>0}get isClosing(){return this.phase!==`open`}enter(e){let t=ma.getStore(),n=ha.getStore(),r=t?n?.scope===t?n:{scope:t}:void 0;return new te(`OpenClawAsyncWorkScope`).runInAsyncScope(()=>(ma.enterWith(this),ha.enterWith({scope:this,parent:r}),e()))}run(e){if(this.phase===`closed`)throw Error(`Async work scope is closed`);let t=createDeferredCore();this.pending.add(t.promise);try{return this.enter(e)}finally{t.resolve(),this.pending.delete(t.promise)}}track(e){if(this.phase===`closed`)return Promise.reject(/* @__PURE__ */ Error(`Async work scope is closed`));let t=createDeferredCore();this.pending.add(t.promise),t.promise.then(()=>this.pending.delete(t.promise),e=>{this.pending.delete(t.promise),this.failures?.add(e)});try{t.resolve(this.enter(e))}catch(e){t.reject(e)}return t.promise}beginClose(e){this.phase===`open`&&(this.phase=`closing`,this.controller.abort(e))}runWhenIdle(e){return AsyncWorkScope.runWhenAllIdle(()=>[this],()=>this.track(e))}static async runWhenAllIdle(e,t){let n=e();for(;n.some(e=>e.pending.size>0);)await Promise.allSettled(n.flatMap(e=>Array.from(e.pending))),n=e();return t()}async drain(){for(this.beginClose();this.pending.size>0;)await Promise.allSettled(this.pending);this.phase=`closed`}}})))()}function appendPluginInstanceCleanupFailures(e,t,n){for(let r of n.errors)e.some(e=>e.pluginId===t&&e.error===r&&(e.hookId===`instance`||n.hostCleanupErrors?.includes(r)))||e.push({pluginId:t,hookId:`instance`,error:r})}function createPluginCacheSdk(){return{hosts:/* @__PURE__ */ new Map,contexts:/* @__PURE__ */ new Map,packageNames:/* @__PURE__ */ new Map,packageSearches:/* @__PURE__ */ new Map,argvDirectories:/* @__PURE__ */ new Map,devSourceRoots:/* @__PURE__ */ new Map,runtimeModules:/* @__PURE__ */ new Map,usableDistArtifacts:/* @__PURE__ */ new Map,normalizedJitiAliases:/* @__PURE__ */ new Map,aliasFacts:/* @__PURE__ */ new WeakMap,native:{sdkProviders:/* @__PURE__ */ new Map,nextSdkProviderOrder:0,parents:/* @__PURE__ */ new Map,aliases:/* @__PURE__ */ new Map,registeredHosts:/* @__PURE__ */ new Set,hostRoots:/* @__PURE__ */ new Map,nearestPackageRoots:/* @__PURE__ */ new Map,loaderPackageRoots:/* @__PURE__ */ new Map,allowedParentRoots:/* @__PURE__ */ new Map}}}var _a;function init_plugin_instance_error(){return(init_plugin_instance_error=__esmMin((()=>{init_global_singleton(),resolveGlobalSingleton(Symbol.for(`openclaw.pluginSourceRecoveryUnavailableError`),()=>class extends Error{constructor(e){super(`Captured plugin source is missing; its previous code cannot be recovered.`,{cause:e}),this.name=`PluginSourceRecoveryUnavailableError`}}),_a=resolveGlobalSingleton(Symbol.for(`openclaw.pluginInstanceDrainTimeoutError`),()=>class extends Error{constructor(e,t,n,r){super(e,n),this.settled=t,this.forcedRetirement=r,this.name=`PluginInstanceDrainTimeoutError`}})})))()}function createPluginExecutionFrame(e,t){return t?t.withScopes(e):new va(e)}var va,ya,ba;function init_plugin_instance_invocation(){return(init_plugin_instance_invocation=__esmMin((()=>{init_global_singleton(),va=class InvocationFrame{constructor(e,t=e.invocation){this.invocation=t,this.metadataScope=e.metadataScope,this.cacheScope=e.cacheScope,this.sourceCaptureStorage=e.sourceCaptureStorage}get runtimePluginId(){}withScopes(e){return new InvocationFrame(e)}},ya=resolveGlobalSingleton(Symbol.for(`openclaw.pluginInstanceInvocation`),()=>{let e=new S;return{invocation:{getStore(){return e.getStore()?.invocation},run(t,n){let r=e.getStore();return e.run(r?.invocation===t?r:createPluginExecutionFrame({...r,invocation:t},r),n)},exit(t){let n=e.getStore();return n?.invocation?e.run(n.withScopes({...n,invocation:void 0}),t):t()}},getFrame(){return e.getStore()},runFrame(t,n){return e.run(t,n)}}}),ya.invocation,ba=ya.getFrame,ya.runFrame})))()}function releasePluginCacheInstance(e,t){let n=Ca.get(e);if(t)t.instances.delete(e),n?.delete(t);else{for(let t of n??[])t.instances.delete(e);n?.clear()}n?.size===0&&Ca.delete(e)}function getPluginCacheRetainers(e){let t=Sa.get(e);return t||(t={references:/* @__PURE__ */ new Set,controller:new AbortController,settled:createDeferredCore()},Sa.set(e,t)),t}function createPluginMetadataCache(){return{current:{snapshot:void 0,owner:`operation`,configFingerprint:void 0,agentWorkspaceFingerprint:void 0,envFingerprint:void 0,defaultDiscoveryCompatible:!1,compatiblePolicyHashes:void 0,compatibleConfigFingerprints:void 0,revision:Symbol(`plugin-metadata-snapshot`),configIdentities:/* @__PURE__ */ new WeakSet},snapshots:/* @__PURE__ */ new Map,discovery:/* @__PURE__ */ new Map,sharedDiscovery:/* @__PURE__ */ new Map,projections:/* @__PURE__ */ new WeakMap,projectionSources:/* @__PURE__ */ new WeakMap,completions:/* @__PURE__ */ new WeakMap,indexFacts:/* @__PURE__ */ new WeakMap,providerPolicyOwners:/* @__PURE__ */ new WeakMap,channelAdapters:/* @__PURE__ */ new WeakMap,bundledChannelCatalogs:/* @__PURE__ */ new Map,bundledProviderPolicySurfaces:/* @__PURE__ */ new WeakMap,staticCatalogStates:/* @__PURE__ */ new WeakMap,modelSuppressionResolvers:/* @__PURE__ */ new WeakMap,mcpAuthDeclarations:/* @__PURE__ */ new WeakMap}}function createPluginCache(e={}){return{async[Symbol.asyncDispose](){await retirePluginCache(this)},kind:e.kind??`operation`,roots:/* @__PURE__ */ new Map,rootAliases:/* @__PURE__ */ new Map,sdk:createPluginCacheSdk(),setupModules:/* @__PURE__ */ new Map,instances:/* @__PURE__ */ new Set,metadata:createPluginMetadataCache(),installRecords:/* @__PURE__ */ new Map,persistedInstalledIndex:/* @__PURE__ */ new Map,preparedBundledDiscoveryModes:/* @__PURE__ */ new Map,dependencyStatus:/* @__PURE__ */ new WeakMap,moduleLoaders:/* @__PURE__ */ new Map,sources:/* @__PURE__ */ new Map,sourceAliases:/* @__PURE__ */ new Map,runtimeRecordRoots:/* @__PURE__ */ new WeakMap}}function getProcessPluginCache(){return xa.current??=createPluginCache({kind:`process`})}function getScopedPluginCache(){return ba()?.cacheScope?.cache}function getPluginCache(){return getScopedPluginCache()??getProcessPluginCache()}function retirePluginCache(e,t,n){let r=getPluginCacheRetainers(e);if(r.retirement)return r.retirement;let i=createDeferredCore();return r.retirement=i.promise,r.controller.abort(),materializeErrorStack(r.controller.signal.reason),runOutsideAsyncWorkScope(async()=>{r.references.size&&await r.settled.promise;let i=new ga;try{return await i.track(()=>beginPluginCacheRetirement(e,t,n))}finally{await i.drain()}}).then(i.resolve,i.reject),i.promise}function beginPluginCacheRetirement(e,t,n){if(e.retirement)return e.retirement;let r=createDeferredCore();return e.retirement=r.promise,(async()=>{t?.();let r=e.retireRegistryLoads?.(),i=/* @__PURE__ */ new Set([...e.setupModules.values(),...e.instances]);for(let e of i)e.quiesce();let[a]=await Promise.allSettled([r]),o=await Promise.allSettled([...i].map(async e=>({resource:e,result:await e.dispose(void 0,n)}))),s=e.sourceAdmissions;if(s){let e=o.flatMap(e=>e.status===`fulfilled`?e.value.result.errors.flatMap(e=>e instanceof _a?[e.settled]:[]):[]);e.length>0?Promise.allSettled(e).then(()=>s.dispose()).catch(e=>process.emitWarning(`Plugin native capture cleanup failed: ${String(e)}`)):await s.dispose()}e.setupModules.clear();for(let t of e.instances)releasePluginCacheInstance(t,e);let c=[...a.status===`rejected`?[a.reason]:[],...o.flatMap(e=>e.status===`rejected`?[e.reason]:[])];if(c.length)throw AggregateError(c,`Plugin cache resources failed to retire`);let l=a.status===`fulfilled`?a.value:void 0,u=[...l?.failures??[]];for(let e of o){if(e.status!==`fulfilled`)continue;let{resource:t,result:n}=e.value;appendPluginInstanceCleanupFailures(u,t.pluginId,n)}return{cleanupCount:l?.cleanupCount??0,failures:u}})().then(r.resolve,r.reject),r.promise}var xa,Sa,Ca;function init_plugin_cache(){return(init_plugin_cache=__esmMin((()=>{init_async_work_scope(),init_deferred(),init_global_singleton(),init_plugin_instance_error(),init_plugin_instance_invocation(),xa=resolveGlobalSingleton(Symbol.for(`openclaw.pluginCache`),()=>({snapshotOwners:/* @__PURE__ */ new WeakMap,retirements:[]})),Sa=resolveGlobalSingleton(Symbol.for(`openclaw.pluginCacheRetainers`),()=>/* @__PURE__ */ new WeakMap),Ca=resolveGlobalSingleton(Symbol.for(`openclaw.pluginInstanceCacheOwners`),()=>/* @__PURE__ */ new WeakMap)})))()}function parsePackageName(e){let t=JSON.parse(e);return typeof t.name==`string`?t.name:null}function readPackageNameSync(e){let t=getPluginCache().sdk.packageNames,n=w.join(w.resolve(e),`package.json`);if(t.has(n))return t.get(n)??null;try{let e=parsePackageName(le.readFileSync(n,`utf-8`));return t.set(n,e),e}catch{return t.set(n,null),null}}function findPackageRootSync(e,t=12){for(let n of iterAncestorDirs(e,t))if(readPackageNameSync(n)===`openclaw`)return n;return null}function*iterAncestorDirs(e,t){let n=w.resolve(e);for(let e=0;e<t&&(yield n,w.basename(n)!==`node_modules`);e+=1){let e=w.dirname(n);if(e===n)break;n=e}}function candidateDirsFromArgv1(e){let t=getPluginCache().sdk.argvDirectories,n=w.resolve(e),r=t.get(n);if(r)return[...r];let i=n,a=[];try{let e=le.realpathSync(i);e!==i&&a.push(w.dirname(e))}catch{}a.push(w.dirname(i));let o=i.split(w.sep),s=o.lastIndexOf(`.bin`);if(s>0&&o[s-1]===`node_modules`){let e=w.basename(i),t=o.slice(0,s).join(w.sep);a.push(w.join(t,e))}let c=dedupeCandidates(a);return t.set(n,c),[...c]}function preparePackageRootSearch(e,t){let n=buildCandidates(e),r=n.join(`\0`),i=getPluginCache().sdk.packageSearches,a=i.get(r);return{candidates:n,first:a?.all?a.all[0]??null:a?.first,complete(e){return i.set(r,t?{...i.get(r),first:e}:{first:e}),e}}}function resolveOpenClawPackageRootSync(e){let t=preparePackageRootSearch(e,!1);if(t.first!==void 0)return t.first;for(let e of t.candidates){let n=findPackageRootSync(e);if(n)return t.complete(n)}return t.complete(null)}function buildCandidates(e){let t=[];if(e.moduleUrl)try{t.push(w.dirname(he(e.moduleUrl)))}catch{}return e.argv1&&t.push(...candidateDirsFromArgv1(e.argv1)),e.cwd&&t.push(e.cwd),dedupeCandidates(t)}function dedupeCandidates(e){return[...new Set(e.map(e=>w.resolve(e)))]}function init_openclaw_root(){return(init_openclaw_root=__esmMin((()=>{init_plugin_cache()})))()}function resolveLoadedCommitHash(e={}){let t=e.moduleUrl??import.meta.url,n=readLoadedCommit(t);return n===void 0?resolveCommitHash({moduleUrl:t,...e.env?{env:e.env}:{}}):n}var formatCommit,wa,resolveCommitSearchDir,cacheGitCommit,resolveGitLookupDepth,readCommitFromGit,readCommitFromPackageJson,readCommitProbe,readCommitFromBuildInfo,readLoadedCommit,resolveCommitHash;function init_git_commit(){return(init_git_commit=__esmMin((()=>{init_errors$1(),init_git_root(),init_lru_cache(),init_openclaw_root(),formatCommit=e=>{let t=e?.match(/[0-9a-fA-F]{7,40}/);return t?normalizeLowercaseStringOrEmpty(t[0].slice(0,7)):null},wa=new LruCache(256),resolveCommitSearchDir=e=>{if(e.cwd)return w.resolve(e.cwd);if(e.moduleUrl)try{return w.dirname(he(e.moduleUrl))}catch{}return process.cwd()},cacheGitCommit=(e,t)=>(wa.set(e,t),t),resolveGitLookupDepth=(e,t)=>{if(!t)return;let n=w.relative(t,e);if(!(n.startsWith(`..`)||w.isAbsolute(n)))return(n?n.split(w.sep).filter(Boolean).length:0)+1},readCommitFromGit=(e,t)=>{let n=readGitHead(e,{maxDepth:resolveGitLookupDepth(e,t)});return n===void 0?void 0:formatCommit(n.value)},readCommitFromPackageJson=()=>null,readCommitProbe=(e,t,n)=>{try{for(let r of t){let t=he(new URL(r,e)),i;try{i=readGitMetadataPrefix(t,1024)}catch(e){if(isMissingPathError(e))continue;return null}try{let e=asNullableRecord(JSON.parse(i))?.[n];return typeof e==`string`?formatCommit(e):null}catch{return null}}}catch{}},readCommitFromBuildInfo=(e=import.meta.url)=>readCommitProbe(e,[`../build-info.json`,`./build-info.json`],`commit`)??null,readLoadedCommit=e=>{let t=readCommitProbe(e,[`../.buildstamp`,`./.buildstamp`],`head`),n=readCommitProbe(e,[`../.runtime-postbuildstamp`,`./.runtime-postbuildstamp`],`head`);return t!==void 0||n!==void 0?t||n?t&&t===n?t:null:readCommitFromBuildInfo(e):readCommitProbe(e,[`../build-info.json`,`./build-info.json`],`commit`)},resolveCommitHash=(e={})=>{let t=e.env??process.env,n=e.readers??{},r=n.readGitCommit??readCommitFromGit,i=t.GIT_COMMIT?.trim()||t.GIT_SHA?.trim(),a=formatCommit(i);if(a)return a;let o=resolveCommitSearchDir(e),s=wa.get(o);if(s!==void 0)return s;let c=resolveOpenClawPackageRootSync({cwd:e.cwd,moduleUrl:e.moduleUrl});try{let e=r(o,c);if(e!==void 0)return cacheGitCommit(o,e)}catch{}let l=n.readBuildInfoCommit?.()??readCommitFromBuildInfo();if(l)return cacheGitCommit(o,l);let u=n.readPackageJsonCommit?.()??readCommitFromPackageJson();if(u)return cacheGitCommit(o,u);try{return cacheGitCommit(o,r(o,c)??null)}catch{return cacheGitCommit(o,null)}}})))()}function readVersionFromJsonCandidates(e,n,r={}){try{let i=t(e);for(let e of n)try{let t=i(e),n=normalizeOptionalString(t.version);if(!n||r.requirePackageName&&t.name!==Ta)continue;return n}catch{}return null}catch{return null}}function readBuildIdFromJsonCandidates(e){try{let n=t(e);for(let e of Da)try{let t=normalizeOptionalString(n(e).buildId);if(t&&t.length<=96)return t}catch{}return null}catch{return null}}function firstNonEmpty(...e){for(let t of e){let e=normalizeOptionalString(t);if(e&&e.toLowerCase()!==`undefined`&&e.toLowerCase()!==`null`)return e}}function readVersionFromPackageJsonForModuleUrl(e){return readVersionFromJsonCandidates(e,Ea,{requirePackageName:!0})}function readVersionFromBuildInfoForModuleUrl(e){return readVersionFromJsonCandidates(e,Da)}function readBuildIdFromBuildInfoForModuleUrl(e){return readBuildIdFromJsonCandidates(e)}function resolveVersionFromModuleUrl(e){return readVersionFromBuildInfoForModuleUrl(e)||readVersionFromPackageJsonForModuleUrl(e)}function resolveBinaryVersion(e){return resolveVersionFromModuleUrl(e.moduleUrl)||firstNonEmpty(e.bundledVersion)||e.fallback||`0.0.0`}var Ta,Ea,Da,Oa;function init_version(){return(init_version=__esmMin((()=>{init_git_commit(),Ta=`openclaw`,Ea=[`../package.json`,`../../package.json`,`../../../package.json`,`./package.json`],Da=[`../build-info.json`,`../../build-info.json`,`./build-info.json`],readBuildIdFromBuildInfoForModuleUrl(import.meta.url),resolveLoadedCommitHash({moduleUrl:import.meta.url}),Oa=resolveBinaryVersion({moduleUrl:import.meta.url,bundledVersion:process.env.OPENCLAW_BUNDLED_VERSION})})))()}var ka;function init_openclaw_agent_schema(){return(init_openclaw_agent_schema=__esmMin((()=>{ka=`-- Session storage doctrine: session_nodes.entry_json owns hot logical-session facts;
-- session_entry_snapshots owns keyed cold values. Promoted node columns are query
-- indexes; session_windows and their children own transcript generations.
-- Legacy ACP provenance is private import evidence carried with its logical session.

CREATE TABLE IF NOT EXISTS schema_meta (
  meta_key TEXT NOT NULL PRIMARY KEY,
  role TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  agent_id TEXT,
  app_version TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS session_nodes (
  session_key TEXT NOT NULL PRIMARY KEY,
  current_session_id TEXT NOT NULL,
  entry_json TEXT NOT NULL,
  session_started_at INTEGER,
  has_optional_references INTEGER NOT NULL DEFAULT 0,
  snapshot_revision INTEGER NOT NULL DEFAULT 0,
  legacy_acp_migration_json TEXT,
  entry_valid INTEGER NOT NULL DEFAULT 0 CHECK (entry_valid IN (-1, 0, 1)),
  updated_at INTEGER NOT NULL,
  status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),
  created_at INTEGER,
  created_via TEXT CHECK (created_via IS NULL OR created_via IN ('operator', 'spawn', 'channel', 'cron', 'talk', 'run', 'plugin', 'internal')),
  created_actor_type TEXT CHECK (created_actor_type IS NULL OR created_actor_type IN ('human', 'agent', 'system')),
  created_actor_id TEXT,
  owner_actor_type TEXT,
  owner_actor_id TEXT,
  owner_assigned_by_type TEXT,
  owner_assigned_by_id TEXT,
  owner_assigned_at INTEGER,
  project_id TEXT,
  parent_session_key TEXT,
  spawned_by TEXT,
  fork_source_session_key TEXT,
  fork_source_session_id TEXT,
  fork_source_entry_id TEXT,
  label TEXT,
  display_name TEXT,
  category TEXT,
  icon TEXT,
  pinned_at INTEGER,
  archived_at INTEGER,
  last_read_at INTEGER,
  last_interaction_at INTEGER,
  last_activity_at INTEGER
) STRICT;

CREATE TABLE IF NOT EXISTS session_entry_snapshots (
  session_key TEXT NOT NULL,
  field TEXT NOT NULL CHECK (field IN ('sessionDiffBaseline', 'skillsSnapshot', 'systemPromptReport')),
  value_json TEXT NOT NULL,
  PRIMARY KEY (session_key, field),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT, WITHOUT ROWID;

CREATE TRIGGER IF NOT EXISTS session_entry_snapshots_after_insert
AFTER INSERT ON session_entry_snapshots
BEGIN
  UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1
  WHERE session_key = NEW.session_key;
END;

CREATE TRIGGER IF NOT EXISTS session_entry_snapshots_after_update
AFTER UPDATE OF session_key, field, value_json ON session_entry_snapshots
WHEN NEW.session_key IS NOT OLD.session_key
  OR NEW.field IS NOT OLD.field OR NEW.value_json IS NOT OLD.value_json
BEGIN
  UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1
  WHERE session_key IN (OLD.session_key, NEW.session_key);
END;

CREATE TRIGGER IF NOT EXISTS session_entry_snapshots_after_delete
AFTER DELETE ON session_entry_snapshots
BEGIN
  UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1
  WHERE session_key = OLD.session_key;
END;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_updated_at
  ON session_nodes(updated_at DESC, session_key);

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_last_interaction_at
  ON session_nodes(last_interaction_at DESC, session_key);

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_label
  ON session_nodes(label, session_key)
  WHERE label IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_parent_session_key
  ON session_nodes(parent_session_key, session_key);

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_spawned_by
  ON session_nodes(spawned_by, session_key);

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_status
  ON session_nodes(status, session_key)
  WHERE status IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_archived_at
  ON session_nodes(archived_at, session_key)
  WHERE archived_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_active
  ON session_nodes(session_key)
  WHERE archived_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_current_session_id
  ON session_nodes(current_session_id);

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_entry_valid_pending
  ON session_nodes(session_key)
  WHERE entry_valid = 0;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_entry_not_valid
  ON session_nodes(session_key)
  WHERE entry_valid != 1;

CREATE TABLE IF NOT EXISTS session_participants (
  session_key TEXT NOT NULL,
  identity_namespace TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  contribution_count INTEGER NOT NULL,
  first_prompted_at INTEGER,
  last_prompted_at INTEGER,
  PRIMARY KEY (session_key, identity_namespace, actor_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS session_key_contract (
  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
  main_key TEXT NOT NULL,
  canonical_ready TEXT,
  updated_at INTEGER NOT NULL
) STRICT;

INSERT OR IGNORE INTO session_key_contract (id, main_key, updated_at) VALUES (1, 'main', 0);

CREATE TABLE IF NOT EXISTS session_windows (
  session_id TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  previous_session_id TEXT,
  reason TEXT CHECK (reason IS NULL OR reason IN ('initial', 'reset', 'rollover', 'fork', 'rewind', 'switch', 'recovery', 'compaction')),
  session_scope TEXT NOT NULL DEFAULT 'conversation' CHECK (session_scope IN ('conversation', 'shared-main', 'group', 'channel')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  transcript_updated_at INTEGER DEFAULT NULL,
  row_transcript_json TEXT,
  row_transcript_updated_at INTEGER,
  transcript_observed_at INTEGER DEFAULT NULL,
  session_entry_provenance INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1)),
  acp_owned INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1)),
  plugin_owner_id TEXT,
  hook_external_content_source TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook')),
  started_at INTEGER,
  ended_at INTEGER,
  status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),
  chat_type TEXT CHECK (chat_type IS NULL OR chat_type IN ('direct', 'group', 'channel')),
  channel TEXT,
  account_id TEXT,
  primary_conversation_id TEXT,
  model_provider TEXT,
  model TEXT,
  agent_harness_id TEXT,
  parent_session_key TEXT,
  spawned_by TEXT,
  display_name TEXT,
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,
  FOREIGN KEY (primary_conversation_id) REFERENCES conversations(conversation_id) ON DELETE SET NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_session_windows_updated_at
  ON session_windows(updated_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_agent_session_windows_session_key
  ON session_windows(session_key, updated_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_agent_session_windows_created_at
  ON session_windows(created_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_agent_session_windows_conversation
  ON session_windows(primary_conversation_id, updated_at DESC, session_id)
  WHERE primary_conversation_id IS NOT NULL;

-- Offline imports and repairs queue explicit work; admission also settles keys
-- removed during repair, so the queue deliberately has no node foreign key.
CREATE TABLE IF NOT EXISTS session_canonical_validation_pending (
  session_key TEXT NOT NULL PRIMARY KEY
) STRICT;

CREATE TABLE IF NOT EXISTS conversations (
  conversation_id TEXT NOT NULL PRIMARY KEY,
  channel TEXT NOT NULL,
  account_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('direct', 'group', 'channel')),
  peer_id TEXT NOT NULL,
  delivery_target TEXT NOT NULL,
  parent_conversation_id TEXT,
  thread_id TEXT,
  native_channel_id TEXT,
  native_direct_user_id TEXT,
  label TEXT,
  metadata_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_conversations_lookup
  ON conversations(channel, account_id, kind, peer_id, thread_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_conversations_identity
  ON conversations(
    channel,
    account_id,
    kind,
    peer_id,
    IFNULL(parent_conversation_id, ''),
    IFNULL(thread_id, '')
  );

CREATE INDEX IF NOT EXISTS idx_agent_conversations_updated
  ON conversations(updated_at DESC, conversation_id);

CREATE TABLE IF NOT EXISTS conversation_deliveries (
  operation_id TEXT NOT NULL PRIMARY KEY,
  operation_kind TEXT NOT NULL CHECK (operation_kind IN ('send', 'turn')),
  conversation_id TEXT NOT NULL,
  source_session_key TEXT,
  message_hash TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('created', 'queued', 'sent', 'suppressed', 'rejected', 'unknown', 'replied')),
  prepared_message_id TEXT,
  platform_message_id TEXT,
  queue_id TEXT,
  rejection_error TEXT,
  reply_message_id TEXT,
  reply_to_id TEXT,
  reply_thread_id TEXT,
  reply_text TEXT,
  reply_timestamp INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  CHECK (
    (status = 'rejected' AND rejection_error IS NOT NULL) OR
    (status != 'rejected' AND rejection_error IS NULL)
  ),
  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_conversation_deliveries_reply
  ON conversation_deliveries(conversation_id, platform_message_id, prepared_message_id)
  WHERE status IN ('queued', 'sent', 'replied');

CREATE INDEX IF NOT EXISTS idx_agent_conversation_deliveries_updated
  ON conversation_deliveries(updated_at DESC, operation_id);

CREATE TABLE IF NOT EXISTS session_conversations (
  session_id TEXT NOT NULL,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'primary' CHECK (role IN ('primary', 'participant', 'related')),
  route_context_json TEXT,
  first_seen_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, conversation_id, role),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE,
  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE
) STRICT;

-- Older same-version writers preserve the envelope while updating the association.
CREATE TRIGGER IF NOT EXISTS session_conversations_route_context_invalidate_after_update
AFTER UPDATE OF role, last_seen_at ON session_conversations
WHEN NEW.route_context_json IS OLD.route_context_json
BEGIN
  UPDATE session_conversations
  SET route_context_json = NULL
  WHERE session_id = NEW.session_id
    AND conversation_id = NEW.conversation_id
    AND role = NEW.role;
END;

CREATE INDEX IF NOT EXISTS idx_agent_session_conversations_conversation
  ON session_conversations(conversation_id, last_seen_at DESC, session_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_session_conversations_primary
  ON session_conversations(session_id)
  WHERE role = 'primary';

CREATE TABLE IF NOT EXISTS session_members (
  session_key TEXT NOT NULL,
  identity_id TEXT NOT NULL,
  added_by TEXT NOT NULL,
  added_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, identity_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_session_members_identity
  ON session_members(identity_id, session_key);

CREATE TABLE IF NOT EXISTS session_suggestions (
  id TEXT PRIMARY KEY,
  session_key TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_label TEXT,
  text TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('pending', 'accepted', 'dismissed')),
  dispatch_token TEXT,
  dispatch_started_at INTEGER,
  dispatch_resolution TEXT CHECK (dispatch_resolution IN ('send', 'queue', 'edit', 'dismiss')),
  CHECK (
    (dispatch_token IS NULL AND dispatch_started_at IS NULL AND dispatch_resolution IS NULL)
    OR (dispatch_token IS NOT NULL AND dispatch_started_at IS NOT NULL AND dispatch_resolution IS NOT NULL)
  ),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_session_suggestions_session_state_created
  ON session_suggestions(session_key, state, created_at, id);

CREATE INDEX IF NOT EXISTS idx_agent_session_suggestions_author_created
  ON session_suggestions(author_id, created_at, id);

CREATE TABLE IF NOT EXISTS session_reactions (
  session_key TEXT NOT NULL,
  session_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  emoji TEXT NOT NULL,
  identity_id TEXT NOT NULL,
  identity_label TEXT,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, session_id, message_id, emoji, identity_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_session_reactions_message
  ON session_reactions(session_key, session_id, message_id);

CREATE TABLE IF NOT EXISTS board_tabs (
  session_key TEXT NOT NULL,
  tab_id TEXT NOT NULL,
  title TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 0),
  chat_dock TEXT NOT NULL DEFAULT 'right' CHECK (chat_dock IN ('left', 'right', 'bottom', 'hidden')),
  created_by TEXT NOT NULL CHECK (created_by IN ('user', 'agent')),
  revision INTEGER NOT NULL CHECK (revision >= 0),
  PRIMARY KEY (session_key, tab_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS board_widgets (
  session_key TEXT NOT NULL,
  name TEXT NOT NULL,
  tab_id TEXT NOT NULL,
  title TEXT,
  content_kind TEXT NOT NULL CHECK (content_kind IN ('html', 'mcp-app', 'plugin')),
  html BLOB,
  descriptor_json TEXT,
  sha256 TEXT NOT NULL,
  view_generation TEXT,
  revision INTEGER NOT NULL CHECK (revision >= 1),
  size_w INTEGER NOT NULL CHECK (size_w BETWEEN 1 AND 12),
  size_h INTEGER NOT NULL CHECK (size_h BETWEEN 1 AND 20),
  position INTEGER NOT NULL CHECK (position >= 0),
  manifest TEXT NOT NULL DEFAULT '{}',
  grant_state TEXT NOT NULL DEFAULT 'none' CHECK (grant_state IN ('none', 'pending', 'granted', 'rejected')),
  granted_sha TEXT,
  created_by TEXT NOT NULL CHECK (created_by IN ('user', 'agent')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, name),
  FOREIGN KEY (session_key, tab_id) REFERENCES board_tabs(session_key, tab_id) ON DELETE CASCADE,
  CHECK (
    (content_kind = 'html' AND html IS NOT NULL AND descriptor_json IS NULL AND view_generation IS NOT NULL) OR
    (content_kind = 'mcp-app' AND html IS NULL AND descriptor_json IS NOT NULL AND view_generation IS NULL) OR
    (content_kind = 'plugin' AND html IS NULL AND descriptor_json IS NOT NULL AND view_generation IS NULL)
  )
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_board_widgets_tab_position
  ON board_widgets(session_key, tab_id, position);

CREATE TABLE IF NOT EXISTS session_progress_cards (
  session_key TEXT NOT NULL PRIMARY KEY,
  markdown TEXT,
  steps_json TEXT,
  revision INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS heartbeat_outcomes (
  session_key TEXT NOT NULL PRIMARY KEY,
  run_session_key TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('progress', 'done', 'blocked', 'needs_attention')),
  summary TEXT NOT NULL,
  response_reason TEXT,
  priority TEXT CHECK (priority IS NULL OR priority IN ('low', 'normal', 'high')),
  next_check TEXT,
  task_names_json TEXT,
  wake_source TEXT,
  wake_reason TEXT,
  occurred_at INTEGER NOT NULL,
  context_run_id TEXT,
  context_claimed_at INTEGER,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS message_tool_run_outcomes (
  id INTEGER PRIMARY KEY,
  run_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('tool_delivered', 'mute')),
  run_status TEXT NOT NULL CHECK (run_status IN ('completed', 'errored', 'aborted')),
  occurred_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_message_tool_run_outcomes_occurred
  ON message_tool_run_outcomes(occurred_at DESC, id DESC);

-- Receipts outlive Goal clear and session reset so a delayed retry cannot recreate a Goal.
-- They intentionally have no session FK; bounded retention belongs to the operation owner.
CREATE TABLE IF NOT EXISTS session_goal_operations (
  session_key TEXT NOT NULL,
  operation_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  request_fingerprint TEXT NOT NULL,
  result_json TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, operation_id)
) STRICT;
CREATE INDEX IF NOT EXISTS idx_agent_session_goal_operations_expiry
  ON session_goal_operations(expires_at);

CREATE TABLE IF NOT EXISTS transcript_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event_json TEXT,
  created_at INTEGER NOT NULL,
  event_zstd BLOB,
  event_utf8_bytes INTEGER CHECK (event_utf8_bytes IS NULL OR event_utf8_bytes >= 0),
  navigation_json TEXT,
  navigation_type TEXT,
  navigation_custom_type TEXT,
  navigation_display INTEGER NOT NULL DEFAULT 0,
  message_role TEXT,
  navigation_last_type TEXT,
  navigation_last_custom_type TEXT,
  navigation_valid INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE,
  CHECK (
    (event_json IS NOT NULL AND event_zstd IS NULL)
    OR (
      event_json IS NULL AND event_zstd IS NOT NULL
      AND event_utf8_bytes IS NOT NULL
      AND event_utf8_bytes BETWEEN 1 AND 4194304
      AND length(event_zstd) BETWEEN 1 AND 4194304
      AND navigation_json IS NOT NULL
    )
  ),
  CHECK (
    navigation_json IS NULL OR CASE WHEN json_valid(navigation_json) THEN coalesce(
      octet_length(navigation_json) <= 16384
      AND json_type(navigation_json, '$.version') = 'integer'
      AND json_extract(navigation_json, '$.version') = 1
      AND json_type(navigation_json, '$.report') = 'object'
      AND json_extract(navigation_json, '$.report.kind') IN ('canonical', 'leaf', 'link', 'ignored')
      AND json_type(navigation_json, '$.navigation') = 'object'
      AND json_type(navigation_json, '$.reset') = 'object'
      AND json_type(navigation_json, '$.model') = 'object'
      AND json_type(navigation_json, '$.modelBytes') = 'integer'
      AND json_extract(navigation_json, '$.modelBytes') BETWEEN 0 AND 4194304
      AND json_type(navigation_json, '$.modelWithoutCheckpointBytes') = 'integer'
      AND json_extract(navigation_json, '$.modelWithoutCheckpointBytes') BETWEEN 0 AND 4194304
      AND json_type(navigation_json, '$.withoutCustomDataBytes') = 'integer'
      AND json_extract(navigation_json, '$.withoutCustomDataBytes') BETWEEN 0 AND 4194304,
      0) ELSE 0 END
  )
) STRICT;

-- Canonical cold-tier owner for reclaimed transcript generations. The derived
-- .deleted/.reset file may be recreated from this row after a crash.
CREATE TABLE IF NOT EXISTS session_transcript_archives (
  session_id TEXT NOT NULL,
  generation TEXT NOT NULL,
  session_key TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('deleted', 'reset')),
  encoding TEXT NOT NULL CHECK (encoding IN ('identity', 'zstd')),
  archive_blob BLOB NOT NULL,
  archive_sha256 TEXT NOT NULL CHECK (length(archive_sha256) = 64),
  archive_name TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  published_at INTEGER,
  publish_attempts INTEGER NOT NULL DEFAULT 0 CHECK (publish_attempts >= 0),
  last_publish_attempt_at INTEGER,
  last_publish_error TEXT,
  PRIMARY KEY (session_id, generation),
  CHECK (archive_name NOT LIKE '%/%' AND archive_name NOT LIKE '%\\%')
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_session_transcript_archives_pending
  ON session_transcript_archives(created_at, session_id, generation)
  WHERE published_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_agent_session_transcript_archives_retention
  ON session_transcript_archives(created_at, session_id, generation);

CREATE TABLE IF NOT EXISTS session_transcript_cold_archives (
  session_id TEXT NOT NULL PRIMARY KEY,
  generation TEXT NOT NULL,
  archive_name TEXT NOT NULL UNIQUE,
  archive_sha256 TEXT NOT NULL CHECK (length(archive_sha256) = 64),
  event_count INTEGER NOT NULL CHECK (event_count >= 1),
  raw_bytes INTEGER NOT NULL CHECK (raw_bytes >= 0),
  archive_bytes INTEGER NOT NULL CHECK (archive_bytes >= 0),
  last_seq INTEGER NOT NULL,
  archived_at INTEGER NOT NULL,
  storage TEXT NOT NULL CHECK (storage IN ('file', 'sqlite')),
  archive_blob BLOB,
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE,
  CHECK (length(archive_name) > 0 AND archive_name NOT IN ('.', '..') AND archive_name NOT LIKE '%/%' AND archive_name NOT LIKE '%\\%'),
  CHECK ((storage = 'file' AND archive_blob IS NULL) OR (storage = 'sqlite' AND archive_blob IS NOT NULL))
) STRICT;

CREATE TABLE IF NOT EXISTS transcript_rewrite_watermarks (
  session_id TEXT NOT NULL PRIMARY KEY,
  generation TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS trajectory_runtime_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  run_id TEXT,
  event_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_trajectory_runtime_run
  ON trajectory_runtime_events(session_id, run_id, created_at, octet_length(event_json));

CREATE TABLE IF NOT EXISTS acp_parent_stream_events (
  session_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, run_id, seq),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_acp_parent_stream_run
  ON acp_parent_stream_events(run_id, seq);

CREATE TABLE IF NOT EXISTS transcript_event_identities (
  session_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event_type TEXT,
  parent_id TEXT,
  message_idempotency_key TEXT,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, event_id),
  FOREIGN KEY (session_id, seq) REFERENCES transcript_events(session_id, seq) ON DELETE CASCADE
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_message_idempotency
  ON transcript_event_identities(session_id, message_idempotency_key)
  WHERE message_idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_identity_sequence
  ON transcript_event_identities(session_id, seq);

CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_parent
  ON transcript_event_identities(session_id, parent_id)
  WHERE parent_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_sequence
  ON transcript_event_identities(session_id, event_type, seq DESC);

CREATE TABLE IF NOT EXISTS context_engine_turn_outbox (
  enqueue_sequence INTEGER PRIMARY KEY,
  advancement_key TEXT NOT NULL UNIQUE,
  engine_id TEXT NOT NULL,
  owner_plugin_id TEXT,
  session_id TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  payload_state TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER,
  last_error TEXT,
  created_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_context_engine_turn_outbox_engine
  ON context_engine_turn_outbox(engine_id, created_at);

CREATE TABLE IF NOT EXISTS cache_entries (
  scope TEXT NOT NULL,
  key TEXT NOT NULL,
  value_json TEXT,
  blob BLOB,
  expires_at INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (scope, key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_cache_expiry
  ON cache_entries(scope, expires_at, key)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_cache_updated
  ON cache_entries(scope, updated_at DESC, key);

CREATE INDEX IF NOT EXISTS idx_agent_voice_session_open_scope
  ON cache_entries(CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.agentId') END,
    CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.sessionKey') END, CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.origin') END)
  WHERE scope = 'talk-client-voice-sessions'
    AND CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.status') END = 'open';

CREATE INDEX IF NOT EXISTS idx_agent_voice_session_open_updated
  ON cache_entries(scope, updated_at)
  WHERE scope = 'talk-client-voice-sessions'
    AND CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.status') END = 'open';

CREATE TABLE IF NOT EXISTS auth_profile_store (
  store_key TEXT NOT NULL PRIMARY KEY,
  store_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS auth_profile_state (
  state_key TEXT NOT NULL PRIMARY KEY,
  state_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_sources (
  id INTEGER PRIMARY KEY,
  path TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'memory',
  hash TEXT NOT NULL,
  mtime REAL NOT NULL,
  size INTEGER NOT NULL,
  UNIQUE (path, source)
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_chunks (
  chunk_rowid INTEGER PRIMARY KEY,
  id TEXT NOT NULL UNIQUE,
  path TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'memory',
  start_line INTEGER NOT NULL,
  end_line INTEGER NOT NULL,
  hash TEXT NOT NULL,
  model TEXT NOT NULL,
  text TEXT NOT NULL,
  embedding BLOB NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_chunk_recall_metadata (
  chunk_id TEXT PRIMARY KEY,
  importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10),
  triggers TEXT,
  project_key TEXT,
  FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_chunk_provenance (
  chunk_id TEXT PRIMARY KEY,
  origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),
  session_kind TEXT NOT NULL CHECK (session_kind IN ('interactive', 'cron', 'heartbeat', 'subagent', 'unknown')),
  observed_at INTEGER NOT NULL,
  supersedes_key TEXT,
  FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS memory_entry_origins (
  entry_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  session_key TEXT,
  origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),
  observed_at INTEGER NOT NULL,
  PRIMARY KEY (entry_key, agent_id, session_id)
) STRICT;

CREATE TABLE IF NOT EXISTS memory_session_tombstones (
  session_id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS memory_embedding_cache (
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  provider_key TEXT NOT NULL,
  hash TEXT NOT NULL,
  embedding BLOB NOT NULL,
  dims INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (provider, model, provider_key, hash)
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  revision INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS standing_intents (
  intent_key INTEGER PRIMARY KEY,
  id TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  trigger_keywords TEXT NOT NULL,
  trigger_embedding TEXT,
  channel_scope TEXT,
  sender_scope TEXT,
  creator_sender TEXT CHECK (creator_sender IS NULL OR length(trim(creator_sender)) > 0),
  status TEXT NOT NULL CHECK (status IN ('pending', 'armed', 'fired', 'done', 'cancelled', 'expired')),
  expires_at INTEGER NOT NULL,
  max_fires INTEGER NOT NULL CHECK (max_fires > 0),
  fire_count INTEGER NOT NULL DEFAULT 0 CHECK (fire_count >= 0),
  cooldown_seconds INTEGER NOT NULL DEFAULT 86400 CHECK (cooldown_seconds >= 0),
  last_fired_at INTEGER,
  created_at INTEGER NOT NULL,
  source_session_id TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_standing_intents_lifecycle
  ON standing_intents(status, expires_at, last_fired_at);

CREATE INDEX IF NOT EXISTS idx_standing_intents_scope
  ON standing_intents(status, channel_scope, sender_scope);

CREATE VIRTUAL TABLE IF NOT EXISTS standing_intents_fts USING fts5(
  trigger_keywords,
  content = 'standing_intents',
  content_rowid = 'intent_key',
  tokenize = 'unicode61 remove_diacritics 2'
);

CREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_insert
AFTER INSERT ON standing_intents
BEGIN
  INSERT INTO standing_intents_fts(rowid, trigger_keywords)
  VALUES (new.intent_key, new.trigger_keywords);
END;

CREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_delete
AFTER DELETE ON standing_intents
BEGIN
  INSERT INTO standing_intents_fts(standing_intents_fts, rowid, trigger_keywords)
  VALUES ('delete', old.intent_key, old.trigger_keywords);
END;

CREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_update
AFTER UPDATE OF trigger_keywords ON standing_intents
BEGIN
  INSERT INTO standing_intents_fts(standing_intents_fts, rowid, trigger_keywords)
  VALUES ('delete', old.intent_key, old.trigger_keywords);
  INSERT INTO standing_intents_fts(rowid, trigger_keywords)
  VALUES (new.intent_key, new.trigger_keywords);
END;

CREATE TABLE IF NOT EXISTS session_transcript_index_state (
  session_id TEXT NOT NULL PRIMARY KEY,
  indexed_seq INTEGER NOT NULL,
  leaf_event_id TEXT,
  needs_rebuild INTEGER NOT NULL DEFAULT 0,
  active_event_count INTEGER NOT NULL DEFAULT 0,
  active_message_count INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS session_transcript_active_events (
  session_id TEXT NOT NULL,
  active_position INTEGER NOT NULL CHECK (active_position >= 0),
  event_seq INTEGER NOT NULL,
  message_position INTEGER CHECK (message_position IS NULL OR message_position >= 0),
  context_eligible INTEGER,
  PRIMARY KEY (session_id, active_position),
  FOREIGN KEY (session_id, event_seq) REFERENCES transcript_events(session_id, seq) ON DELETE CASCADE
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_active_event_seq
  ON session_transcript_active_events(session_id, event_seq);

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_active_messages
  ON session_transcript_active_events(session_id, message_position)
  WHERE message_position IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_transcript_context_pending
  ON session_transcript_active_events(session_id)
  WHERE context_eligible IS NULL;

CREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(
  text,
  session_id UNINDEXED,
  message_id UNINDEXED,
  role UNINDEXED,
  timestamp UNINDEXED,
  tokenize = 'unicode61 remove_diacritics 2'
);

CREATE TABLE IF NOT EXISTS session_transcript_fts_rows (
  id INTEGER PRIMARY KEY,
  session_id TEXT NOT NULL,
  message_id TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_session_transcript_fts_rows_session_message
  ON session_transcript_fts_rows(session_id, message_id);

CREATE TRIGGER IF NOT EXISTS session_transcript_fts_rows_after_delete
AFTER DELETE ON session_transcript_fts_rows
BEGIN
  DELETE FROM session_transcript_fts WHERE rowid = OLD.id;
END;

INSERT OR IGNORE INTO memory_index_state (id, revision) VALUES (1, 0);

CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_insert
AFTER INSERT ON memory_index_sources
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_update
AFTER UPDATE ON memory_index_sources
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_delete
AFTER DELETE ON memory_index_sources
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_insert
AFTER INSERT ON memory_index_chunks
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_update
AFTER UPDATE ON memory_index_chunks
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_delete
AFTER DELETE ON memory_index_chunks
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE INDEX IF NOT EXISTS idx_memory_embedding_cache_updated_at
  ON memory_embedding_cache(updated_at);

CREATE INDEX IF NOT EXISTS idx_memory_index_sources_source
  ON memory_index_sources(source);

CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path_source
  ON memory_index_chunks(path, source);

CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_source
  ON memory_index_chunks(source);

-- Accepted input stays outside the active transcript until its exact turn owns execution.
CREATE TABLE IF NOT EXISTS session_pending_inputs (
  seq INTEGER PRIMARY KEY AUTOINCREMENT,
  input_id TEXT NOT NULL UNIQUE,
  session_key TEXT NOT NULL,
  session_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  run_id TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  message_json TEXT NOT NULL,
  lifecycle_generation TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('queued', 'interrupted', 'cancelled')),
  accepted_at INTEGER NOT NULL,
  consumed_event_id TEXT,
  UNIQUE (session_id, idempotency_key),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_session_pending_inputs_session
  ON session_pending_inputs(session_key, session_id, seq DESC);

-- Processing completion is separate from input consumption; neither schedules replay.
CREATE TABLE IF NOT EXISTS session_input_completions (
  session_key TEXT NOT NULL,
  session_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  run_id TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  outcome_json TEXT NOT NULL,
  succeeded INTEGER NOT NULL CHECK (succeeded IN (0, 1)),
  completed_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, idempotency_key),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE
) STRICT;
`})))()}var Aa;function init_openclaw_state_schema(){return(init_openclaw_state_schema=__esmMin((()=>{Aa=`

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
`})))()}function sqliteDatabaseSealSchemaFor(e=Oa){return ne(`sha256`).update(JSON.stringify([2,e])).update(ka).update(Aa).digest(`hex`)}function init_openclaw_database_seal_schema(){return(init_openclaw_database_seal_schema=__esmMin((()=>{init_version(),init_openclaw_agent_schema(),init_openclaw_state_schema()})))()}function fileFields(e){return{dev:e.dev.toString(),ino:e.ino.toString(),birthtime:readDatabaseIdentityBirthtime(e),size:e.size.toString(),mtimeNs:e.mtimeNs.toString()}}function checksum(e){return ne(`sha256`).update(e).digest(`hex`).slice(0,16)}function hasNoJournal(e){return[`-wal`,`-journal`].every(t=>{try{let n=C.statSync(`${e}${t}`,{bigint:!0});return n.isFile()&&n.size===0n}catch(e){if(hasNodeErrorCode(e,`ENOENT`))return!0;throw e}})}function readSqliteCleanCloseSeal(e,t,n){try{let r=`${e}.seal`;if(!C.lstatSync(r).isFile())return;let i=JSON.parse(C.readFileSync(r,`utf8`));if(!isRecord(i)||typeof i.payload!=`string`||i.checksum!==checksum(i.payload))return;let a=JSON.parse(i.payload);if(!isRecord(a)||a.version!==1||a.schemaIdentity!==t||typeof a.verifiedAt!=`number`||!Number.isSafeInteger(a.verifiedAt)||!(`facts`in a)||!n.isFile())return;let o=Date.now()-a.verifiedAt;return o<0||o>ja||!Object.entries(fileFields(n)).every(([e,t])=>a[e]===t)||!hasNoJournal(e)?void 0:{verifiedAt:a.verifiedAt,facts:a.facts}}catch{return}}function invalidateSqliteCleanCloseSeal(e){try{C.unlinkSync(`${e}.seal`)}catch(e){if(!hasNodeErrorCode(e,`ENOENT`))throw e}}function writeSqliteCleanCloseSeal(e,t,n,r){try{let i=`${e}.seal`,a=C.lstatSync(i,{throwIfNoEntry:!1});if(!n.isFile()||a&&!a.isFile()||!hasNoJournal(e))return invalidateSqliteCleanCloseSeal(e),!1;let o=JSON.stringify({version:1,schemaIdentity:t,...fileFields(n),verifiedAt:r.verifiedAt,facts:r.facts});return C.writeFileSync(i,JSON.stringify({payload:o,checksum:checksum(o)})),!0}catch{try{invalidateSqliteCleanCloseSeal(e)}catch{}return!1}}var ja;function init_sqlite_clean_close_seal(){return(init_sqlite_clean_close_seal=__esmMin((()=>{init_errno(),init_sqlite_worker_identity(),ja=6048e5})))()}function isSealedKey(e){return Pa.has(e)||e.startsWith(`memory.index-schema:`)}function encodeSealValue(e,t){return t instanceof Map?{sealType:`map`,entries:[...t]}:t instanceof Set?{sealType:`set`,entries:[...t]}:t instanceof SharedArrayBuffer?{sealType:`shared`,entries:[...new Int32Array(t)]}:t}function decodeSealValue(e,t){if(!isRecord(t)||!Array.isArray(t.entries))return t;if(t.sealType===`map`)return new Map(t.entries);if(t.sealType===`set`)return new Set(t.entries);if(t.sealType===`shared`){let e=new SharedArrayBuffer(t.entries.length*Int32Array.BYTES_PER_ELEMENT);return new Int32Array(e).set(t.entries),e}return t}var Ma,Na,Pa,SqliteDatabaseCleanCloseSeals;function init_sqlite_database_admission_seal(){return(init_sqlite_database_admission_seal=__esmMin((()=>{init_openclaw_agent_db_additive_columns(),init_openclaw_database_seal_schema(),init_sqlite_clean_close_seal(),init_sqlite_database_admission_record(),Ma=sqliteDatabaseSealSchemaFor(),Na={name:`sqlite.full-verification`,read:e=>typeof e==`number`&&Number.isSafeInteger(e)?e:void 0},Pa=/* @__PURE__ */ new Set([`sqlite-schema`,`sqlite.full-verification`,`state.schema-version`,`state.runtime-schema`,`state.integrity`,`agent.completed-validation`,`agent.canonical-validation-receipt`,`agent.schema-metadata`]),SqliteDatabaseCleanCloseSeals=class{constructor(e,t){this.publishFact=e,this.references=t,this.loaded=/* @__PURE__ */ new WeakSet}markCreated(e){this.loaded.add(e)}load(e){if(x!==0||this.loaded.has(e))return;this.loaded.add(e);let t=readSqliteCleanCloseSeal(e.location,Ma,C.fstatSync(e.descriptor,{bigint:!0}));if(t&&typeof t.facts==`string`)try{let n=JSON.parse(t.facts,decodeSealValue);if(!Array.isArray(n)||!n.every(e=>Array.isArray(e)&&e.length===3&&typeof e[0]==`string`&&isSealedKey(e[0])&&typeof e[1]==`boolean`)||!n.some(([e,,n])=>e===Na.name&&n===t.verifiedAt)||!n.some(([e,,t])=>e===`sqlite-schema`&&isRecord(t)))return;let r=n.find(([e])=>e===`sqlite-schema`)?.[2];if(!(r.tableSql instanceof Map)||hasPendingAgentStartupColumns(r.tableSql))return;for(let[t,r,i]of n)this.publishFact(e,{name:t,schemaDependent:r},i,readSqliteDatabaseFactRevision(e,r));Atomics.store(new Int32Array(e.generation),wt.sealPresent,1)}catch{}}invalidate(e,t){invalidateSqliteCleanCloseSeal(t?.location??e),t&&Atomics.store(new Int32Array(t.generation),wt.sealPresent,0)}prepare(e,t,n){let r=this.preparePublication(e,t,n);t&&this.references.retain(t);let i=t;return{publish:()=>i!==void 0&&r(),[Symbol.dispose]:()=>{let e=i;i=void 0,e&&this.references.release(e)}}}preparePublication(e,t,n){if(!t||e.isTransaction||n===void 0)return()=>!1;let r=[...t.facts].filter(([e,n])=>isSealedKey(e)&&isSqliteDatabaseAdmissionFactCurrent(t,n));if(!r.some(([e])=>e===`sqlite-schema`))return()=>!1;let i=JSON.stringify(r.map(([e,t])=>[e,t.schemaDependent,t.value]),encodeSealValue);return()=>{if(e.isOpen||readSqliteDatabaseGeneration(t,`retired`)!==0||r.some(([,e])=>Atomics.load(new Int32Array(e.current),0)!==1||e.revision!==readSqliteDatabaseFactRevision(t,e.schemaDependent)))return!1;try{let e=C.fstatSync(t.descriptor,{bigint:!0});if(readSqliteDatabaseAdmissionIdentity(C.statSync(t.location,{bigint:!0}))!==t.identity)return!1;let r=writeSqliteCleanCloseSeal(t.location,Ma,e,{verifiedAt:n,facts:i});return Atomics.store(new Int32Array(t.generation),wt.sealPresent,+!!r),r}catch{return!1}}}}})))()}function stringReplaceAll(e,t,n){let r=e.indexOf(t);if(r===-1)return e;let i=t.length,a=0,o=``;do o+=e.slice(a,r)+t+n,a=r+i,r=e.indexOf(t,a);while(r!==-1);return o+=e.slice(a),o}function stringEncaseCRLFWithFirstIndex(e,t,n,r){let i=0,a=``;do{let o=e[r-1]===`\r`;a+=e.slice(i,o?r-1:r)+t+(o?`\r
`:`
`)+n,i=r+1,r=e.indexOf(`
`,i)}while(r!==-1);return a+=e.slice(i),a}function assembleStyles(){let e=/* @__PURE__ */ new Map;for(let[t,n]of Object.entries(O)){for(let[t,r]of Object.entries(n))O[t]={open:`\u{1B}[${r[0]}m`,close:`\u{1B}[${r[1]}m`},n[t]=O[t],e.set(Number.parseInt(r[0],10),r[1]);Object.defineProperty(O,t,{value:n,enumerable:!1})}return Object.defineProperty(O,"codes",{value:e,enumerable:!1}),O.color.close=`\x1B[39m`,O.bgColor.close=`\x1B[49m`,O.underlineColor.close=`\x1B[59m`,O.color.ansi=wrapAnsi16(),O.color.ansi256=wrapAnsi256(),O.color.ansi16m=wrapAnsi16m(),O.bgColor.ansi=wrapAnsi16(Fa),O.bgColor.ansi256=wrapAnsi256(Fa),O.bgColor.ansi16m=wrapAnsi16m(Fa),O.underlineColor.ansi=wrapUnderlineAnsi,O.underlineColor.ansi256=wrapAnsi256(Ia),O.underlineColor.ansi16m=wrapAnsi16m(Ia),Object.defineProperties(O,{rgbToAnsi256:{value(e,t,n){return e===t&&t===n?e<8?16:e>248?231:Math.round((e-8)/247*24)+232:16+36*Math.round(e/255*5)+6*Math.round(t/255*5)+Math.round(n/255*5)},enumerable:!1},hexToRgb:{value(e){let t=/[\da-f]{6}|[\da-f]{3}/i.exec(e.toString(16));if(!t)return[0,0,0];let[n]=t;n.length===3&&(n=[...n].map(e=>e+e).join(``));let r=Number.parseInt(n,16);return[r>>16&255,r>>8&255,r&255]},enumerable:!1},hexToAnsi256:{value:e=>O.rgbToAnsi256(...O.hexToRgb(e)),enumerable:!1},ansi256ToAnsi:{value(e){if(e<8)return 30+e;if(e<16)return 90+(e-8);let t,n,r;if(e>=232)t=((e-232)*10+8)/255,n=t,r=t;else{e-=16;let i=e%36;t=Math.floor(e/36)/5,n=Math.floor(i/6)/5,r=i%6/5}let i=Math.max(t,n,r)*2;if(i===0)return 30;let a=30+(Math.round(r)<<2|Math.round(n)<<1|Math.round(t));return i===2&&(a+=60),a},enumerable:!1},rgbToAnsi:{value:(e,t,n)=>O.ansi256ToAnsi(O.rgbToAnsi256(e,t,n)),enumerable:!1},hexToAnsi:{value:e=>O.ansi256ToAnsi(O.hexToAnsi256(e)),enumerable:!1}}),O}var Fa,Ia,wrapAnsi16,wrapAnsi256,wrapAnsi16m,wrapUnderlineAnsi,O,La,Ra,za;function init_ansi_styles(){return(init_ansi_styles=__esmMin((()=>{Fa=10,Ia=20,wrapAnsi16=(e=0)=>t=>`\u{1B}[${t+e}m`,wrapAnsi256=(e=0)=>t=>`\u{1B}[${38+e};5;${t}m`,wrapAnsi16m=(e=0)=>(t,n,r)=>`\u{1B}[${38+e};2;${t};${n};${r}m`,wrapUnderlineAnsi=e=>`\u{1B}[58;5;${e<90?e-30:e-90+8}m`,O={modifier:{reset:[0,0],bold:[1,22],dim:[2,22],italic:[3,23],underline:[4,24],underlineDouble:[`4:2`,24],underlineCurly:[`4:3`,24],underlineDotted:[`4:4`,24],underlineDashed:[`4:5`,24],overline:[53,55],inverse:[7,27],hidden:[8,28],strikethrough:[9,29]},color:{black:[30,39],red:[31,39],green:[32,39],yellow:[33,39],blue:[34,39],magenta:[35,39],cyan:[36,39],white:[37,39],blackBright:[90,39],gray:[90,39],grey:[90,39],redBright:[91,39],greenBright:[92,39],yellowBright:[93,39],blueBright:[94,39],magentaBright:[95,39],cyanBright:[96,39],whiteBright:[97,39]},bgColor:{bgBlack:[40,49],bgRed:[41,49],bgGreen:[42,49],bgYellow:[43,49],bgBlue:[44,49],bgMagenta:[45,49],bgCyan:[46,49],bgWhite:[47,49],bgBlackBright:[100,49],bgGray:[100,49],bgGrey:[100,49],bgRedBright:[101,49],bgGreenBright:[102,49],bgYellowBright:[103,49],bgBlueBright:[104,49],bgMagentaBright:[105,49],bgCyanBright:[106,49],bgWhiteBright:[107,49]},underlineColor:{underlineBlack:[`58;5;0`,59],underlineRed:[`58;5;1`,59],underlineGreen:[`58;5;2`,59],underlineYellow:[`58;5;3`,59],underlineBlue:[`58;5;4`,59],underlineMagenta:[`58;5;5`,59],underlineCyan:[`58;5;6`,59],underlineWhite:[`58;5;7`,59],underlineBlackBright:[`58;5;8`,59],underlineGray:[`58;5;8`,59],underlineGrey:[`58;5;8`,59],underlineRedBright:[`58;5;9`,59],underlineGreenBright:[`58;5;10`,59],underlineYellowBright:[`58;5;11`,59],underlineBlueBright:[`58;5;12`,59],underlineMagentaBright:[`58;5;13`,59],underlineCyanBright:[`58;5;14`,59],underlineWhiteBright:[`58;5;15`,59]}},Object.keys(O.modifier),La=Object.keys(O.color),Ra=Object.keys(O.bgColor),Object.keys(O.underlineColor),[...La,...Ra],za=assembleStyles()})))()}function hasFlag(e,t=globalThis.Deno?globalThis.Deno.args:ge.argv){let n=e.startsWith(`-`)?``:e.length===1?`-`:`--`,r=t.indexOf(n+e),i=t.indexOf(`--`);return r!==-1&&(i===-1||r<i)}function hasNumericForceColor(){return/^\d+$/.test(k.FORCE_COLOR)}function envForceColor(){if(`FORCE_COLOR`in k){if(k.FORCE_COLOR===`false`)return 0;if(k.FORCE_COLOR===`true`||k.FORCE_COLOR.length===0)return 1;if(hasNumericForceColor())return Math.min(Number.parseInt(k.FORCE_COLOR,10),3)}}function translateLevel(e){return e!==0&&{level:e,hasBasic:!0,has256:e>=2,has16m:e>=3}}function _supportsColor(e,{streamIsTTY:t,sniffFlags:n=!0}={}){let r=envForceColor();r!==void 0&&(Ba=r);let i=n?Ba:r;if(i===0)return 0;if(n){if(hasFlag(`color=16m`)||hasFlag(`color=full`)||hasFlag(`color=truecolor`))return 3;if(hasFlag(`color=256`))return 2}if(i!==void 0&&hasNumericForceColor())return i;if(`TF_BUILD`in k&&`AGENT_NAME`in k)return 1;if(e&&!t&&i===void 0)return 0;let a=i||0;if(k.TERM===`dumb`)return a;if(ge.platform===`win32`){let e=de.release().split(`.`);return Number(e[0])>=10&&Number(e[2])>=10586?Number(e[2])>=14931?3:2:1}if(`CI`in k)return[`GITHUB_ACTIONS`,`GITEA_ACTIONS`,`CIRCLECI`].some(e=>e in k)?3:[`TRAVIS`,`APPVEYOR`,`GITLAB_CI`,`BUILDKITE`,`DRONE`].some(e=>e in k)||k.CI_NAME===`codeship`?1:a;if(`TEAMCITY_VERSION`in k)return+!!/^(?:9\.0*[1-9]\d*\.|\d{2,}\.)/.test(k.TEAMCITY_VERSION);if(k.COLORTERM===`truecolor`||k.TERM===`xterm-kitty`||k.TERM===`xterm-ghostty`||k.TERM===`wezterm`)return 3;if(`TERM_PROGRAM`in k){let e=Number.parseInt((k.TERM_PROGRAM_VERSION||``).split(`.`,1)[0],10);switch(k.TERM_PROGRAM){case`iTerm.app`:return e>=3?3:2;case`Apple_Terminal`:return 2}}return/-256(?:color)?$/i.test(k.TERM)?2:/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(k.TERM)||`COLORTERM`in k?1:a}function createSupportsColor(e,t={}){return translateLevel(_supportsColor(e,{streamIsTTY:e&&e.isTTY,...t}))}var k,Ba,Va;function init_supports_color(){return(init_supports_color=__esmMin((()=>{({env:k}=ge),hasFlag(`no-color`)||hasFlag(`no-colors`)||hasFlag(`color=false`)||hasFlag(`color=never`)?Ba=0:(hasFlag(`color`)||hasFlag(`colors`)||hasFlag(`color=true`)||hasFlag(`color=always`))&&(Ba=1),Va={stdout:createSupportsColor({isTTY:be.isatty(1)}),stderr:createSupportsColor({isTTY:be.isatty(2)})}})))()}function createChalk(e){return chalkFactory(e)}var Ha,Ua,Wa,Ga,Ka,qa,Ja,assertValidLevel,Ya,applyOptions,Chalk,chalkFactory,createModelConverters,Xa,createStyler,createBuilder,applyStyle;function init_source(){return(init_source=__esmMin((()=>{init_ansi_styles(),init_supports_color(),{stdout:Ha,stderr:Ua}=Va,Wa=Symbol(`GENERATOR`),Ga=Symbol(`STYLER`),Ka=Symbol(`IS_EMPTY`),qa=Symbol(`LEVEL`),Ja=Object.create(null),assertValidLevel=e=>{if(!Number.isSafeInteger(e)||e<0||e>3)throw Error("The `level` should be an integer from 0 to 3")},Ya={enumerable:!0,get(){return this[qa]},set(e){assertValidLevel(e),this[qa]=e}},applyOptions=(e,t={})=>{t.level!==void 0&&assertValidLevel(t.level);let n=Ha?Ha.level:0;e[qa]=t.level===void 0?n:t.level},Chalk=class{constructor(e){return chalkFactory(e)}},chalkFactory=e=>{let chalk=(...e)=>e.join(` `);return applyOptions(chalk,e),Object.setPrototypeOf(chalk,createChalk.prototype),chalk},Object.setPrototypeOf(createChalk.prototype,Function.prototype);for(let[e,t]of Object.entries(za))Ja[e]={get(){let n=createBuilder(this,createStyler(t.open,t.close,this[Ga]),this[Ka]);return Object.defineProperty(this,e,{value:n}),n}};Ja.visible={get(){let e=createBuilder(this,this[Ga],!0);return Object.defineProperty(this,"visible",{value:e}),e}},createModelConverters=(e,t)=>{let n=za[t];if(e===`rgb`){let ansi=(e,t,r)=>n.ansi(za.rgbToAnsi(e,t,r));return[ansi,ansi,(e,t,r)=>n.ansi256(za.rgbToAnsi256(e,t,r)),n.ansi16m]}if(e===`hex`){let ansi=e=>n.ansi(za.hexToAnsi(e));return[ansi,ansi,e=>n.ansi256(za.hexToAnsi256(e)),e=>n.ansi16m(...za.hexToRgb(e))]}let ansi=e=>n.ansi(za.ansi256ToAnsi(e));return[ansi,ansi,n.ansi256,n.ansi256]};for(let e of[`rgb`,`hex`,`ansi256`]){let t=e[0].toUpperCase()+e.slice(1);for(let[n,r]of[[e,`color`],[`bg`+t,`bgColor`],[`underline`+t,`underlineColor`]]){let{close:t}=za[r],i=createModelConverters(e,r);Ja[n]={get(){let styleFunction=function(e,n,r){let a=i[this.level](e,n,r);return createBuilder(this,createStyler(a,t,this[Ga]),this[Ka])};return Object.defineProperty(this,n,{value:styleFunction}),styleFunction}}}}Xa=Object.defineProperties(()=>{},{...Ja,level:{enumerable:!0,get(){return this[Wa].level},set(e){this[Wa].level=e}}}),createStyler=(e,t,n)=>{let r,i;return n===void 0?(r=e,i=t):(r=n.openAll+e,i=t+n.closeAll),{open:e,close:t,openAll:r,closeAll:i,parent:n}},createBuilder=(e,t,n)=>{let builder=(...e)=>e.length===1?applyStyle(builder,``+e[0]):e.length===2?applyStyle(builder,`${e[0]??``} ${e[1]??``}`):applyStyle(builder,e.join(` `));return Object.setPrototypeOf(builder,Xa),builder[Wa]=e[Wa]??e,builder[Ga]=t,builder[Ka]=n,builder},applyStyle=(e,t)=>{if(e[Wa][qa]<=0||!t)return e[Ka]?``:t;let n=e[Ga];if(n===void 0)return t;let{openAll:r,closeAll:i}=n;if(t.includes(`\x1B`))for(;n!==void 0;)t=stringReplaceAll(t,n.close,n.open),n=n.parent;let a=t.indexOf(`
`);return a!==-1&&(t=stringEncaseCRLFWithFirstIndex(t,i,r,a)),r+t+i},Object.defineProperties(createChalk.prototype,{...Ja,level:Ya}),createChalk(),createChalk({level:Ua?Ua.level:0})})))()}function clearActiveProgressLine(){Za?.isTTY&&Za.write(`\r\x1B[2K`)}var Za;function init_progress_line(){return(init_progress_line=__esmMin((()=>{Za=null})))()}function isVerbose(){return Qa}var Qa;function init_global_state(){return(init_global_state=__esmMin((()=>{Qa=!1})))()}function getDiagnosticEventListenerPresence(){let e=resolveGlobalSingleton($a,()=>({broadInterestCount:0,eventInterestDeltas:/* @__PURE__ */ new Map,marker:$a,internalCount:0,trustedCount:0}));return e.broadInterestCount??=0,e.eventInterestDeltas??=/* @__PURE__ */ new Map,e}function isInternalDiagnosticEventInterested(e,t,n){return(!e?.include||e.include.includes(t))&&!e?.exclude?.includes(t)&&(!n||!e?.includeTrusted||e.includeTrusted.includes(t))}function hasInternalDiagnosticEventInterest(e){let t=getDiagnosticEventListenerPresence();return t.broadInterestCount+(t.eventInterestDeltas.get(e)??0)>0}var $a;function init_diagnostic_event_listener_presence(){return(init_diagnostic_event_listener_presence=__esmMin((()=>{init_global_singleton(),$a=Symbol.for(`openclaw.diagnosticEventListenerPresence.v1`)})))()}function createDiagnosticMetadataForListener(e){return Object.freeze({...e})}function cloneDiagnosticValueForListener(e){return deepFreezeDiagnosticValue(structuredClone(e))}function deepFreezeDiagnosticValue(e,t=/* @__PURE__ */ new WeakSet){if(!e||typeof e!=`object`||t.has(e))return e;t.add(e);for(let n of Array.isArray(e)?e:Object.values(e))deepFreezeDiagnosticValue(n,t);return Object.freeze(e)}var eo;function init_diagnostic_model_request_provenance(){return(init_diagnostic_model_request_provenance=__esmMin((()=>{eo=`coreModelRequestLifecycle`})))()}function isTrustedOtelDiagnosticListener(e){return to.has(e)}var to;function init_diagnostic_otel_listener_provenance(){return(init_diagnostic_otel_listener_provenance=__esmMin((()=>{to=/* @__PURE__ */ new WeakSet})))()}var no;function init_diagnostic_semantic_run_progress_provenance(){return(init_diagnostic_semantic_run_progress_provenance=__esmMin((()=>{no=`coreSemanticRunProgress`})))()}var ro;function init_diagnostic_tool_execution_liveness(){return(init_diagnostic_tool_execution_liveness=__esmMin((()=>{init_global_singleton(),ro=`toolExecutionLiveness`,resolveGlobalSingleton(Symbol.for(`openclaw.diagnosticToolExecutionLiveness`),()=>({context:new S,events:/* @__PURE__ */ new WeakMap}))})))()}function isNonZeroHex(e){return!/^0+$/.test(e)}function getDiagnosticTraceScopeState(){return resolveGlobalSingleton(so,()=>({marker:so,storage:new S}))}function isValidDiagnosticTraceId(e){return typeof e==`string`&&io.test(e)&&isNonZeroHex(e)}function isValidDiagnosticSpanId(e){return typeof e==`string`&&ao.test(e)&&isNonZeroHex(e)}function isValidDiagnosticTraceFlags(e){return typeof e==`string`&&oo.test(e)}function getActiveDiagnosticTraceContext(){return getDiagnosticTraceScopeState().storage.getStore()}var io,ao,oo,so;function init_diagnostic_trace_context(){return(init_diagnostic_trace_context=__esmMin((()=>{init_src(),init_global_singleton(),io=/^[0-9a-f]{32}$/,ao=/^[0-9a-f]{16}$/,oo=/^[0-9a-f]{2}$/,so=Symbol.for(`openclaw.diagnosticTraceScope.state.v1`)})))()}function getDiagnosticTracePropagationState(){return resolveGlobalSingleton(co,()=>({marker:co,bridges:/* @__PURE__ */ new Set}))}function activeDiagnosticTracePropagationBridge(){let e;for(let t of getDiagnosticTracePropagationState().bridges)e=t;return e}function shouldPrepareDiagnosticTracePropagation(e){let t=activeDiagnosticTracePropagationBridge();if(!t?.prepareEvent)return!1;if(!t.shouldPrepareEvent)return!0;try{return t.shouldPrepareEvent(e)}catch(e){return console.error(`[diagnostic-trace-propagation] prepare filter error: ${String(e)}`),!1}}function prepareDiagnosticTracePropagation(e,t){let n=activeDiagnosticTracePropagationBridge();if(n?.prepareEvent)try{n.prepareEvent(e,t)}catch(t){console.error(`[diagnostic-trace-propagation] prepare error type=${e.type} seq=${e.seq}: ${String(t)}`)}}var co;function init_diagnostic_trace_propagation(){return(init_diagnostic_trace_propagation=__esmMin((()=>{init_global_singleton(),init_diagnostic_trace_context(),co=Symbol.for(`openclaw.diagnosticTracePropagation.state.v1`)})))()}function createRuntimeProcessEntrypoints(e){function runtimeProcessEntrypoint(t){return{currentModuleUrl:e,sourceWorkerName:t.startsWith(`infra/`)?t.slice(6):`../${t}`,distWorkerPath:`${t}.js`}}return{sqliteHeaderProbe:runtimeProcessEntrypoint(`infra/sqlite-header-probe.worker`),postgresBridge:runtimeProcessEntrypoint(`infra/postgres-sync/bridge.worker`),secretEgressProxy:runtimeProcessEntrypoint(`secrets/egress-proxy/proxy.worker`),codeModeNode:runtimeProcessEntrypoint(`agents/code-mode-node.worker`),cronReadOnly:runtimeProcessEntrypoint(`cron/store/read-only.worker`),stateRead:runtimeProcessEntrypoint(`state/openclaw-state-read.worker`),workerNativeLifecycle:runtimeProcessEntrypoint(`infra/worker-native-lifecycle.worker`),spawnBroker:runtimeProcessEntrypoint(`process/spawn-broker/worker`),cronStreamMatcher:runtimeProcessEntrypoint(`gateway/cron-stream-matcher.worker`),controlUiFile:runtimeProcessEntrypoint(`gateway/control-ui-file.worker`),publicSessionCard:runtimeProcessEntrypoint(`gateway/control-ui-public-session-card.worker`),nodeBootstrapArtifact:runtimeProcessEntrypoint(`gateway/worker-environments/node-bootstrap-artifact.worker`),nativeHookRelayClient:runtimeProcessEntrypoint(`agents/harness/native-hook-relay-client.worker`),computerHost:runtimeProcessEntrypoint(`gateway/desktop/computer.worker`),imageProcessor:runtimeProcessEntrypoint(`media/image-processor.worker`),fileToolPlanning:runtimeProcessEntrypoint(`agents/sessions/tools/file-tool-planning.worker`),fileToolRead:runtimeProcessEntrypoint(`agents/sessions/tools/read-file.worker`),attachmentProcessor:runtimeProcessEntrypoint(`media/attachment-processor.worker`),gitOperations:runtimeProcessEntrypoint(`infra/git-operation.worker`),gitPackCleanup:runtimeProcessEntrypoint(`agents/worktrees/git-pack-cleanup.worker`),fsSafeCopy:runtimeProcessEntrypoint(`infra/fs-safe-copy.worker`),sharedStateStore:runtimeProcessEntrypoint(`state/openclaw-state.worker`),authProfileInlineUsage:runtimeProcessEntrypoint(`agents/auth-profiles/inline-usage.worker`),pluginModelCatalogCredentials:runtimeProcessEntrypoint(`agents/plugin-model-catalog.worker`),agentDatabaseExecution:runtimeProcessEntrypoint(`state/openclaw-agent-execution.worker`),workspaceMemory:runtimeProcessEntrypoint(`worker/memory-worker-entry`),localAgentAvatar:runtimeProcessEntrypoint(`agents/identity-avatar-file.worker`),identityFile:runtimeProcessEntrypoint(`agents/identity-file.worker`),workspaceSkills:runtimeProcessEntrypoint(`worker/skills-worker-entry`),skillsDiscovery:runtimeProcessEntrypoint(`skills/runtime/discovery.worker`),boardStore:runtimeProcessEntrypoint(`boards/sqlite-board-store.worker`),progressCardStore:runtimeProcessEntrypoint(`session-cards/progress-card-store.worker`),sessionSharingStore:runtimeProcessEntrypoint(`config/sessions/session-sharing-store.worker`),sessionForkDomain:runtimeProcessEntrypoint(`config/sessions/session-fork-domain.worker`),sessionGoalOperations:runtimeProcessEntrypoint(`config/sessions/goals-operations.worker`),sessionLifecyclePlanningDomain:runtimeProcessEntrypoint(`config/sessions/session-lifecycle-projection.worker`),sessionMessageRewriteDomain:runtimeProcessEntrypoint(`config/sessions/session-message-rewrite.worker`),sessionDiskBudget:runtimeProcessEntrypoint(`config/sessions/disk-budget.worker`),heartbeatOutcomeStore:runtimeProcessEntrypoint(`infra/heartbeat-outcome-store.worker`),acpParentStreamStore:runtimeProcessEntrypoint(`agents/subagents/spawn/acp-parent-stream-store.worker`),messageToolRunOutcomeStore:runtimeProcessEntrypoint(`infra/message-tool-run-outcome-store.worker`),contextEngineTurnOutbox:runtimeProcessEntrypoint(`agents/harness/context-engine-turn-outbox.worker`),sqliteStore:runtimeProcessEntrypoint(`infra/sqlite-store.worker`),sqliteWriterAdmission:runtimeProcessEntrypoint(`infra/sqlite-writer-admission.worker`),agentSchemaInspection:runtimeProcessEntrypoint(`state/openclaw-agent-schema-inspection.worker`),stateMigrationSnapshot:runtimeProcessEntrypoint(`infra/state-migrations.snapshot.worker`),githubExec:runtimeProcessEntrypoint(`agents/github-exec-launcher`),sqliteReadOnly:runtimeProcessEntrypoint(`infra/sqlite-readonly-location.worker`),sqliteSnapshotStaging:runtimeProcessEntrypoint(`infra/sqlite-snapshot-staging.worker`),sqliteReadOnlyNativeResource:runtimeProcessEntrypoint(`infra/sqlite-readonly-native-resource`),sqliteSourceRevision:runtimeProcessEntrypoint(`infra/sqlite-source-revision.worker`),sqliteIntegrity:runtimeProcessEntrypoint(`infra/sqlite-integrity.worker`),sqliteCloseProbe:runtimeProcessEntrypoint(`infra/bun-sqlite-close-probe.worker`),preparedModelCatalog:runtimeProcessEntrypoint(`agents/prepared-model-catalog.worker`),providerPromptState:runtimeProcessEntrypoint(`agents/embedded-agent-runner/provider-prompt-state.worker`),updateRepair:runtimeProcessEntrypoint(`infra/update-repair.worker`),immutableBuild:runtimeProcessEntrypoint(`infra/update-immutable-build.worker`),updateMigratedFinalize:runtimeProcessEntrypoint(`infra/update-migrated-finalize.worker`),updateCandidateState:runtimeProcessEntrypoint(`infra/update-candidate-state.worker`),doctorLint:runtimeProcessEntrypoint(`commands/doctor-lint.worker`),doctor:runtimeProcessEntrypoint(`commands/doctor.worker`),databaseVerify:runtimeProcessEntrypoint(`state/openclaw-database-verify.worker`),stateOwnership:runtimeProcessEntrypoint(`state/openclaw-state-ownership.worker`),stateLeaseHeartbeat:runtimeProcessEntrypoint(`state/openclaw-state-lease-heartbeat.worker`),gatewayStateOwnerHeartbeat:runtimeProcessEntrypoint(`infra/gateway-state-owner-heartbeat.worker`),sessionTranscriptArchive:runtimeProcessEntrypoint(`config/sessions/session-accessor.sqlite-archive.worker`),sessionTranscript:runtimeProcessEntrypoint(`config/sessions/session-transcript.worker`),workerTranscriptCommit:runtimeProcessEntrypoint(`gateway/worker-environments/transcript-commit.worker`),sessionManagerMetadata:runtimeProcessEntrypoint(`agents/sessions/session-manager-metadata.worker`),sessionTranscriptProjectionPublication:runtimeProcessEntrypoint(`config/sessions/session-transcript-projection-publication.worker`),sessionTranscriptReports:runtimeProcessEntrypoint(`config/sessions/session-accessor.sqlite-transcript-reports.worker`),sessionTranscriptReconcile:runtimeProcessEntrypoint(`config/sessions/session-transcript-reconcile.worker`),tailscaleRouteOwner:runtimeProcessEntrypoint(`infra/tailscale-route-owner.worker`),serviceChildRelay:runtimeProcessEntrypoint(`process/supervisor/service-child-relay`),terminalPty:runtimeProcessEntrypoint(`process/terminal-pty-worker`),serviceChildGroupAnchor:runtimeProcessEntrypoint(`process/supervisor/service-child-group-anchor`),serviceChildWindowsJobAnchor:runtimeProcessEntrypoint(`process/supervisor/service-child-windows-job-anchor`),bunSqliteLibrary:runtimeProcessEntrypoint(`infra/bun-sqlite-library`)}}function normalizeDiagnosticWorkerScript(e){return typeof e==`string`&&lo.has(e)?e:`other`}var lo;function init_worker_diagnostic_script(){return(init_worker_diagnostic_script=__esmMin((()=>{lo=/* @__PURE__ */ new Set([...Object.values(createRuntimeProcessEntrypoints(import.meta.url)).map(e=>pe(e.distWorkerPath)),`catalog-page.worker.js`,`code-mode.worker.js`,`disk-budget.worker.js`,`document-extractor.worker.js`,`manager-index.worker.js`,`manager-search.worker.js`,`memory-index.worker.js`,`memory-search.worker.js`,`session-history.worker.js`,`audio-worker.runtime.js`,`realtime-quicksilver-audio.worker.js`,`realtime-quicksilver-socket.worker.js`,`telegram-ingress-worker.runtime.js`])})))()}function getDiagnosticEventsState(){let e=resolveGlobalSingleton(mo,()=>({marker:mo,enabled:!0,seq:0,listeners:/* @__PURE__ */ new Map,trustedListeners:/* @__PURE__ */ new Map,toolExecutionListeners:/* @__PURE__ */ new Set,toolExecutionSeq:0,dispatchDepth:0,asyncQueue:[],asyncDrainScheduled:!1,asyncDroppedEvents:0,asyncDroppedTrustedEvents:0,asyncDroppedUntrustedEvents:0,asyncDroppedPriorityEvents:0}));return e.asyncDroppedEvents??=0,e.asyncDroppedTrustedEvents??=0,e.asyncDroppedUntrustedEvents??=0,e.asyncDroppedPriorityEvents??=0,e.toolExecutionListeners??=/* @__PURE__ */ new Set,e.toolExecutionSeq??=0,e}function areDiagnosticsEnabledForProcess(){return getDiagnosticEventsState().enabled}function dispatchDiagnosticEvent(e,t,n,r,i={}){if(e.dispatchDepth>100){console.error(`[diagnostic-events] recursion guard tripped at depth=${e.dispatchDepth}, dropping type=${t.type}`);return}e.dispatchDepth+=1;try{if(!i.trustedListenersOnly){for(let[r,i]of e.listeners)if(isInternalDiagnosticEventInterested(i,t.type,n.trusted))try{r(cloneDiagnosticValueForListener(t),createDiagnosticMetadataForListener(n))}catch(e){let n=e instanceof Error?e.stack??e.message:String(e);console.error(`[diagnostic-events] listener error type=${t.type} seq=${t.seq}: ${n}`)}}for(let[a,o]of e.trustedListeners)if(isInternalDiagnosticEventInterested(o,t.type,n.trusted))try{let e=cloneDiagnosticValueForListener(t),s=createDiagnosticMetadataForListener(n);if(o?.includePrivateData===!1)a(e,s,uo);else if(isTrustedOtelDiagnosticListener(a)){let t=structuredClone(r??{});Reflect.deleteProperty(t,`hostPluginId`),a(e,s,deepFreezeDiagnosticValue(i.hostPluginId?Object.assign(t,{hostPluginId:i.hostPluginId}):t))}else a(e,s,r?cloneDiagnosticValueForListener(r):Object.freeze({}))}catch(e){let n=e instanceof Error?e.stack??e.message:String(e);console.error(`[diagnostic-events] trusted listener error type=${t.type} seq=${t.seq}: ${n}`)}}finally{--e.dispatchDepth}}function isPriorityAsyncDiagnosticEvent(e){return e.metadata.trusted&&go.has(e.event.type)}function noteAsyncDiagnosticDrop(e,t){e.asyncDroppedEvents+=1,t.metadata.trusted?e.asyncDroppedTrustedEvents+=1:e.asyncDroppedUntrustedEvents+=1,isPriorityAsyncDiagnosticEvent(t)&&(e.asyncDroppedPriorityEvents+=1)}function makeRoomForPriorityAsyncDiagnosticEvent(e){let t=e.asyncQueue.findIndex(e=>!isPriorityAsyncDiagnosticEvent(e));return t>=0?e.asyncQueue.splice(t,1)[0]:e.asyncQueue.shift()}function scheduleAsyncDiagnosticDrain(e){e.asyncDrainScheduled||(e.asyncDrainScheduled=!0,setImmediate(()=>{e.asyncDrainScheduled=!1;let t=e.asyncQueue.splice(0,po);for(let n of t)dispatchDiagnosticEvent(e,n.event,n.metadata,n.privateData,n);if(e.asyncQueue.length>0){scheduleAsyncDiagnosticDrain(e);return}dispatchAsyncDiagnosticDropSummary(e)}))}function dispatchAsyncDiagnosticDropSummary(e){if(e.asyncDroppedEvents<=0)return;let t=e.asyncDroppedEvents,n=e.asyncDroppedTrustedEvents,r=e.asyncDroppedUntrustedEvents,i=e.asyncDroppedPriorityEvents;e.asyncDroppedEvents=0,e.asyncDroppedTrustedEvents=0,e.asyncDroppedUntrustedEvents=0,e.asyncDroppedPriorityEvents=0,dispatchDiagnosticEvent(e,enrichDiagnosticEvent(e,{type:`diagnostic.async_queue.dropped`,droppedEvents:t,...n>0?{droppedTrustedEvents:n}:{},...r>0?{droppedUntrustedEvents:r}:{},...i>0?{droppedPriorityEvents:i}:{},queueLength:e.asyncQueue.length,maxQueueLength:fo,drainBatchSize:po}),createInternalDiagnosticMetadata(!1))}function enrichDiagnosticEvent(e,t){let n={};for(let[e,r]of Object.entries(t))isBlockedObjectKey(e)||(n[e]=r);return n.trace??=getActiveDiagnosticTraceContext(),e.seq+=1,n.seq=e.seq,n.ts=Date.now(),n}function createInternalDiagnosticMetadata(e){return{internal:!0,trusted:e}}function emitDiagnosticEventWithTrust(e,t,n={}){let r=getDiagnosticEventsState();if(t&&isToolExecutionEventInput(e)&&dispatchTrustedToolExecutionEvent(r,e),!r.enabled||e.type===`security.event`&&n.allowSecurityEvent!==!0)return;let i=enrichDiagnosticEvent(r,e);if(t&&i.type===`diagnostic.gc`){switch(i.kind){case`scavenge`:case`mark_sweep_compact`:case`incremental`:case`weak_processing`:break;default:i.kind=void 0}i.thread=i.thread===void 0||i.thread===`main`?`main`:normalizeDiagnosticWorkerScript(i.thread),(i.thread!==`code-mode-node.worker.js`||typeof i.workerSlot!=`number`||!Number.isInteger(i.workerSlot)||i.workerSlot<1||i.workerSlot>64)&&(i.workerSlot=void 0)}let{hostPluginId:a,internal:o=!1,privateData:s}=n,c=n.trustedTraceContext===!0,l={...o?createInternalDiagnosticMetadata(t):{trusted:t},...n.toolExecutionLiveness?{[ro]:n.toolExecutionLiveness}:{},...n.coreModelRequestLifecycle?{[eo]:n.coreModelRequestLifecycle}:{},...n.coreSemanticRunProgress?{[no]:n.coreSemanticRunProgress}:{},...c?{trustedTraceContext:c}:{}},u=t&&!n.queuedPhase&&shouldPrepareDiagnosticTracePropagation(i),d=n.queuedPhase||ho.has(i.type);if(d){if(r.asyncQueue.length>=fo){if(!t||!go.has(i.type)){noteAsyncDiagnosticDrop(r,{event:i,metadata:l,privateData:s,hostPluginId:a});return}let e=makeRoomForPriorityAsyncDiagnosticEvent(r);e&&noteAsyncDiagnosticDrop(r,e)}r.asyncQueue.push({event:i,metadata:l,privateData:s,hostPluginId:a})}u&&prepareDiagnosticTracePropagation(cloneDiagnosticValueForListener(i),createDiagnosticMetadataForListener(l)),d?scheduleAsyncDiagnosticDrain(r):dispatchDiagnosticEvent(r,i,l,s,{hostPluginId:a})}function isToolExecutionEventInput(e){return e.type===`tool.execution.started`||e.type===`tool.execution.completed`||e.type===`tool.execution.error`||e.type===`tool.execution.blocked`}function dispatchTrustedToolExecutionEvent(e,t){e.toolExecutionSeq+=1;let n;try{n=cloneDiagnosticValueForListener({...t,seq:e.toolExecutionSeq,ts:Date.now()})}catch(e){console.error(`[diagnostic-events] tool execution clone error type=${t.type}: ${String(e)}`);return}notifyListeners(e.toolExecutionListeners,n,e=>{console.error(`[diagnostic-events] tool execution listener error type=${n.type} seq=${n.seq}: ${String(e)}`)})}function emitDiagnosticEvent(e){emitDiagnosticEventWithTrust(e,!1)}function emitDiagnosticEventWithTrustedTraceContext(e){emitDiagnosticEventWithTrust(e,!1,{trustedTraceContext:!0})}var uo,fo,po,mo,ho,go;function init_diagnostic_events(){return(init_diagnostic_events=__esmMin((()=>{init_plugin_instance_invocation(),init_global_singleton(),init_diagnostic_event_listener_presence(),init_diagnostic_model_request_provenance(),init_diagnostic_otel_listener_provenance(),init_diagnostic_semantic_run_progress_provenance(),init_diagnostic_tool_execution_liveness(),init_diagnostic_trace_context(),init_diagnostic_trace_propagation(),init_prototype_keys(),init_worker_diagnostic_script(),uo=Object.freeze({}),fo=1e4,po=100,mo=Symbol.for(`openclaw.diagnosticEvents.state.v1`),ho=/* @__PURE__ */ new Set(/* @__PURE__ */ `worker.request,diagnostic.gc,gateway.event_loop.sample,gateway.http.cancelled,gateway.rpc,tool.execution.started,tool.execution.completed,tool.execution.error,tool.execution.blocked,skill.used,exec.process.completed,exec.approval.followup_suppressed,message.delivery.started,message.delivery.completed,message.delivery.error,talk.event,model.call.started,model.call.completed,model.call.error,run.progress,run.execution_phase,agent.commentary,harness.run.completed,harness.run.error,context.assembled,log.record`.split(`,`)),go=/* @__PURE__ */ new Set([`tool.execution.completed`,`tool.execution.error`,`tool.execution.blocked`,`model.call.completed`,`model.call.error`,`harness.run.completed`,`harness.run.error`])})))()}function init_restore(){return(init_restore=__esmMin((()=>{init_progress_line()})))()}function shouldEmitRuntimeLog(e=process.env){return e.VITEST!==`true`||e.OPENCLAW_TEST_RUNTIME_LOG===`1`||typeof console.log.mock==`object`}function shouldEmitRuntimeStdout(e=process.env){return e.VITEST!==`true`||e.OPENCLAW_TEST_RUNTIME_LOG===`1`||typeof process.stdout.write.mock==`object`}function isPipeClosedError(e){let t=e?.code;return t===`EPIPE`||t===`EIO`}function writeStdout(e){if(!shouldEmitRuntimeStdout())return;clearActiveProgressLine();let t=e.endsWith(`
`)?e:`${e}\n`;try{process.stdout.write(t)}catch(e){if(isPipeClosedError(e))return;throw e}}function createRuntimeIo(){return{log:(...e)=>{shouldEmitRuntimeLog()&&(clearActiveProgressLine(),console.log(...e))},error:(...e)=>{clearActiveProgressLine(),console.error(...e)},writeStdout,writeJson:(e,t=2)=>{writeStdout(JSON.stringify(e,void 0,t>0?t:void 0))}}}function init_runtime(){return(init_runtime=__esmMin((()=>{init_progress_line(),init_restore(),init_state(),{...createRuntimeIo()}})))()}var _o,vo,yo,bo;function init_ansi_sequences(){return(init_ansi_sequences=__esmMin((()=>{_o=`(?:\\x1b\\]|\\x9d)`,vo=`(?:\\x1b\\\\|\\x07|\\x9c)`,yo=`${_o}[^\\x07\\x1b\\x9c]*${vo}`,bo=`[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]`,new RegExp(yo,`y`)})))()}var xo;function init_ansi(){return(init_ansi=__esmMin((()=>{init_ansi_sequences(),xo=`${_o}[\\s\\S]*?${vo}`,RegExp(`${xo}|${bo}`,`y`),new Intl.Segmenter(void 0,{granularity:`grapheme`})})))()}function init_signal_exit_barrier(){return(init_signal_exit_barrier=__esmMin((()=>{init_global_singleton(),resolveGlobalSingleton(Symbol.for(`openclaw.signalExitOwner`),()=>({})),resolveGlobalSet(Symbol.for(`openclaw.signalExitBarriers`),`close-and-restart`),resolveGlobalSet(Symbol.for(`openclaw.signalExitGates`),`close-and-restart`),resolveGlobalSet(Symbol.for(`openclaw.signalExitFinalizers`),`close-and-restart`)})))()}function isValidTimeZone(e){let t=So.get(e);if(t!==void 0)return t;let n;try{new Intl.DateTimeFormat(`en`,{timeZone:e}).format(),n=!0}catch{n=!1}return So.set(e,n),n}function resolveEffectiveTimeZone(e){let t=e??process.env.TZ;return t&&isValidTimeZone(t)?t:wo??=Intl.DateTimeFormat().resolvedOptions().timeZone}function formatOffset(e){return e===`GMT`?`+00:00`:e.slice(3)}function getTimestampParts(e,t){let n=resolveEffectiveTimeZone(t),r=Math.floor(e.getTime()/1e3);if(To?.second===r&&To.timeZone===n)return To.parts;let i=Co.get(n);i||(i=new Intl.DateTimeFormat(`en`,{timeZone:n,year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`,second:`2-digit`,hour12:!1,fractionalSecondDigits:3,timeZoneName:`longOffset`}),Co.set(n,i));let a={};for(let t of i.formatToParts(e))a[t.type]=t.value;return To={second:r,timeZone:n,parts:a},a}function formatTimestamp(e,t){let n=t?.style??`medium`,r=getTimestampParts(e,t?.timeZone),i=formatOffset(r.timeZoneName??`GMT`),a=String(e.getUTCMilliseconds()).padStart(3,`0`);switch(n){case`short`:return`${r.hour}:${r.minute}:${r.second}${i}`;case`medium`:return`${r.hour}:${r.minute}:${r.second}.${a}${i}`;case`long`:return`${r.year}-${r.month}-${r.day}T${r.hour}:${r.minute}:${r.second}.${a}${i}`}throw Error(`Unsupported timestamp style`)}var So,Co,wo,To;function init_timestamps(){return(init_timestamps=__esmMin((()=>{So=/* @__PURE__ */ new Map,Co=/* @__PURE__ */ new Map})))()}function formatJsonConsoleLine(e){let t={...e.meta,time:formatTimestamp(/* @__PURE__ */ new Date,{style:`long`}),level:e.level,...e.subsystem?{subsystem:e.subsystem}:{},message:e.message};return JSON.stringify(redactLogRecordForTransport(t))}function formatConsoleDiagnosticLine(e){return(T.overrideSettings?.consoleStyle??readLoggingConfig()?.consoleStyle)===`json`?formatJsonConsoleLine(e):e.message}function init_json_console_line(){return(init_json_console_line=__esmMin((()=>{init_config(),init_redact(),init_state(),init_timestamps()})))()}function tryParseLogLevel(e){if(typeof e!=`string`)return;let t=e.trim();return Eo.includes(t)?t:void 0}function normalizeLogLevel(e,t=`info`){return tryParseLogLevel(e)??t}function levelToMinLevel(e){return Do[e]}function isLogLevelEnabled(e,t){return e!==`silent`&&t!==`silent`&&levelToMinLevel(e)>=levelToMinLevel(t)}var Eo,Do;function init_levels(){return(init_levels=__esmMin((()=>{Eo=[`silent`,`fatal`,`error`,`warn`,`info`,`debug`,`trace`],Do={trace:1,debug:2,info:3,warn:4,error:5,fatal:6,silent:1/0}})))()}function resolveEnvLogLevelOverride(){let e=normalizeOptionalString(process.env.OPENCLAW_LOG_LEVEL)??``;if(!e){T.invalidEnvLogLevelValue=null;return}let t=tryParseLogLevel(e);if(t)return T.invalidEnvLogLevelValue=null,t;if(T.invalidEnvLogLevelValue!==e){T.invalidEnvLogLevelValue=e;let t=`[openclaw] Ignoring invalid OPENCLAW_LOG_LEVEL="${redactToolPayloadText(e)}" (allowed: ${Eo.join(`|`)}).`;process.stderr.write(`${formatConsoleDiagnosticLine({level:`warn`,message:t})}\n`)}}function init_env_log_level(){return(init_env_log_level=__esmMin((()=>{init_json_console_line(),init_levels(),init_redact(),init_state()})))()}function resolveAsyncLocalStorage(){let e=globalThis.AsyncLocalStorage;if(typeof e==`function`)return e;try{let e=globalThis.process?.getBuiltinModule;if(typeof e==`function`){let t=e(`node:async_hooks`);if(typeof t?.AsyncLocalStorage==`function`)return t.AsyncLocalStorage}}catch{}}function createAsyncContextStore(e=resolveAsyncLocalStorage()){if(e==null)return Oo;let t;try{t=new e}catch{return Oo}return wrapStorageInstance(t)}function createAsyncContextStoreFromInstance(e){try{if(typeof e?.run!=`function`||typeof e?.getStore!=`function`)return Oo}catch{return Oo}return wrapStorageInstance(e)}function wrapStorageInstance(e){return{enabled:!0,run(t,n){let r=e.getStore(),i=r==null?{...t}:{...r,...t};return e.run(i,n)},getStore(){return e.getStore()}}}var Oo;function init_asyncContext(){return(init_asyncContext=__esmMin((()=>{Oo={run:(e,t)=>t(),getStore:()=>void 0,enabled:!1}})))()}var ko;function init_config$1(){return(init_config$1=__esmMin((()=>{ko=class TslogConfigError extends Error{code;setting;suggestion;constructor(e){super(`tslog: ${e.message}`),this.name=`TslogConfigError`,this.code=e.code,this.setting=e.setting,this.suggestion=e.suggestion,Object.setPrototypeOf(this,TslogConfigError.prototype)}}})))()}function getLocalStorage(){try{let e=globalThis.localStorage;return e!=null&&typeof e.getItem==`function`?e:void 0}catch{return}}function readPersistedLevel(e=Ao){let t=getLocalStorage();if(t!=null)try{let n=t.getItem(e);return n==null||n===``?void 0:n}catch{return}}function writePersistedLevel(e,t=Ao){let n=getLocalStorage();if(n!=null)try{n.setItem(t,String(e))}catch{}}var Ao;function init_levelPersistence(){return(init_levelPersistence=__esmMin((()=>{Ao=`tslog:level`})))()}function resolveLogLevelId(e,t){if(e!=null){if(typeof e==`number`)return e;if(t!=null){let n=t[e]??t[e.toUpperCase()];if(typeof n==`number`)return n;let r=e.toLowerCase();for(let e of Object.keys(t))if(e.toLowerCase()===r&&typeof t[e]==`number`)return t[e]}return Mo[e]??Mo[e.toUpperCase()]}}function validateCustomLevel(e,t,n){if(typeof e!=`string`||e.length===0)throw TypeError(`tslog: custom level name must be a non-empty string (got ${JSON.stringify(e)}).`);if(typeof t!=`number`||!Number.isFinite(t))throw TypeError(`tslog: custom level id for "${e}" must be a finite number (got ${JSON.stringify(t)}).`);if(Mo[e.toUpperCase()]!=null)throw RangeError(`tslog: custom level "${e}" collides with a canonical level name; the seven default names are reserved.`);let r=e.toLowerCase();if(No.has(r))throw RangeError(`tslog: custom level "${e}" collides with the logger member "${r}"; pick a different name.`);if(n!=null){for(let t of Object.keys(n))if(t!==e&&t.toLowerCase()===r)throw RangeError(`tslog: custom level "${e}" differs only by case from the already-registered "${t}"; level names are case-insensitive.`)}}var jo,Mo,No;function init_levels$1(){return(init_levels$1=__esmMin((()=>{jo=Object.freeze({0:`SILLY`,1:`TRACE`,2:`DEBUG`,3:`INFO`,4:`WARN`,5:`ERROR`,6:`FATAL`}),Mo=Object.freeze(Object.fromEntries(Object.entries(jo).map(([e,t])=>[t,Number(e)]))),No=/* @__PURE__ */ new Set([`log`,`child`,`settings`,`runtime`,`flush`,`use`])})))()}function splitStackLines(e){let t;try{let n=e?.stack;t=typeof n==`string`?n:void 0}catch{return[]}return t==null||t.length===0?[]:t.split(`
`).map(e=>e.trimEnd())}function sanitizeStackLines(e){return e.filter(e=>e.length>0&&!/^\s*Error\b/.test(e))}function toStackFrames(e,t){let n=[];for(let r of e){let e=t(r);e!=null&&n.push(e)}return n}function findFirstExternalFrameIndex(e,t=Fo){for(let n=0;n<e.length;n+=1){let r=e[n],i=r.filePath??``,a=r.fullFilePath??``;if(!t.some(e=>e.test(i)||e.test(a)))return n}return 0}function getCleanStackLines(e){return sanitizeStackLines(splitStackLines(e))}function buildStackTrace(e,t){return toStackFrames(getCleanStackLines(e),t)}function clampIndex(e,t){return e<0?0:e>=t?Math.max(0,t-1):e}function getDefaultIgnorePatterns(){return[...Fo]}var Po,Fo;function init_stackTrace(){return(init_stackTrace=__esmMin((()=>{Po=(()=>{try{let e=import.meta.url;
/* v8 ignore next 3 -- unreachable under the Node ESM runner where coverage runs; live in the browser IIFE, where esbuild lowers import.meta to {} */
if(typeof e!=`string`||e.length===0)return;let t=e.replace(/^file:\/\//,``).replace(/[\\/]env[\\/]stackTrace\.[a-z]+(?:\?.*)?$/i,``);
/* v8 ignore next -- unreachable under the Node ESM runner (our URL ends with env/stackTrace.<ext>); live in user bundles whose URL keeps path === url */
return t===e?void 0:t}catch{
/* v8 ignore next -- defensive: reading import.meta.url and the string replaces cannot throw in a real runtime */
return}})(),Fo=[/(?:^|[\\/])node_modules[\\/].*tslog/i,/node_modules_tslog/i,/(?:^|[\\/])deps[\\/].*tslog/i,/(?:^|[\\/])tslog[\\/]dist[\\/](?:esm|cjs)[\\/]/i,...Po==null?[]:[RegExp(`^(?:file://)?${Po.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}[\\\\/]`,`i`)],/\[root[ -]of[ -]the[ -]/i,/\[turbopack\]/i]})))()}function collectErrorCauses(e,t={}){let n=t.maxDepth??Io,r=[],i=/* @__PURE__ */ new Set,a=e,o=0;for(;a!=null&&o<n;){let e=safeGetCause(a);if(e==null||i.has(e))break;i.add(e),r.push(toError(e)),a=e,o+=1}return r}function safeGetCause(e){try{return e?.cause}catch{return}}function safeErrorString(e,t,n){try{let r=e[t];return typeof r==`string`?r:n}catch{return n}}function toError(e){if(e instanceof Error)return e;let t=Error(typeof e==`string`?e:stringifyCause(e));return typeof e==`object`&&e&&copyOwnProperties(e,t),t}function stringifyCause(e){try{let t=[];return JSON.stringify(e,function(e,n){if(typeof n==`bigint`)return String(n);if(typeof n==`object`&&n){for(;t.length>0&&t[t.length-1]!==this;)t.pop();if(t.includes(n))return`[Circular]`;t.push(n)}return n})??String(e)}catch{try{return String(e)}catch{return`[unserializable cause]`}}}function copyOwnProperties(e,t){let n;try{n=Object.keys(e)}catch{return}for(let r of n)if(r!==`__proto__`)try{t[r]=e[r]}catch{}}var Io;function init_errorUtils(){return(init_errorUtils=__esmMin((()=>{Io=5})))()}function isObjectOrArray(e){return typeof e==`object`&&!!e}function isObject$1(e){return typeof e==`object`&&!Array.isArray(e)&&e!==null}function shallowCopy(e){return Array.isArray(e)?[...e]:{...e}}function recursiveCloneAndExecuteFunctions(e,t=[]){return isObjectOrArray(e)&&t.includes(e)?shallowCopy(e):(isObjectOrArray(e)&&t.push(e),Array.isArray(e)?e.map(e=>recursiveCloneAndExecuteFunctions(e,t)):e instanceof Date?new Date(e.getTime()):isObject$1(e)?Object.getOwnPropertyNames(e).reduce((n,r)=>{let i=Object.getOwnPropertyDescriptor(e,r);
/* v8 ignore else -- typing-only: getOwnPropertyDescriptor is typed `| undefined`, but for a key getOwnPropertyNames just reported on the same object it is only undefined when a Proxy ownKeys trap invents a ghost key — no supported default LogObj shape does that */
if(i){let a=e[r],o=typeof a==`function`?a():recursiveCloneAndExecuteFunctions(a,t);Object.defineProperty(n,r,{value:o,writable:!0,enumerable:i.enumerable,configurable:!0})}return n},Object.create(Object.getPrototypeOf(e))):e)}function toErrorObject(e,t,n=0,r=/* @__PURE__ */ new Set){r.add(e);let i={nativeError:e,name:safeErrorString(e,`name`,`Error`),message:safeErrorString(e,`message`,``),stack:t.getErrorTrace(e)};if(n>=t.maxErrorCauseDepth)return i;let a=safeGetCause(e);if(a!=null){let e=toError(a);r.has(e)||(i.cause=toErrorObject(e,t,n+1,r))}return i}function getBoundFieldsHint(e){return e[Ro]}function getSpreadShapeHint(e){return e[Lo]}function isPlainSpreadObject(e){if(typeof e!=`object`||!e||Array.isArray(e))return!1;let t=Object.getPrototypeOf(e);return t===Object.prototype||t===null}function toLogObj(e,t,n,r={},i){let a=e.length===1&&n.isError(e[0]),o;t==null&&e.length===2&&!n.isError(e[0])&&!n.isError(e[1])&&(typeof e[0]==`string`&&isPlainSpreadObject(e[1])&&n.isBuffer(e[1])!==!0?o=`message-first`:isPlainSpreadObject(e[0])&&n.isBuffer(e[0])!==!0&&typeof e[1]==`string`&&(o=`object-first`)),e=e?.map(e=>n.isError(e)?toErrorObject(e,n):e);let s=i;if(o!==void 0&&i!=null){let t=o===`message-first`?e[1]:e[0];for(let e of Object.keys(i))Object.hasOwn(t,e)&&(s===i&&(s={...i}),delete s[e])}return t==null?e.length===1&&!Array.isArray(e[0])&&n.isBuffer(e[0])!==!0&&!(e[0]instanceof Date)?a&&s!=null?(r={...e[0],...r},r[Ro]=s):r=typeof e[0]==`object`&&e[0]!=null?{...s,...e[0],...r}:{...s,0:e[0],...r}:r={...s,...r,...e}:r={...s,...r,[t]:e},o!==void 0&&(r[Lo]=o),r}var Lo,Ro;function init_logObj(){return(init_logObj=__esmMin((()=>{init_errorUtils(),Lo=Symbol(`tslog.logObj.spreadShape`),Ro=Symbol(`tslog.logObj.boundFields`)})))()}function pad2(e){return e<10?`0${e}`:`${e}`}function toIsoString(e){let t=e.getUTCFullYear();if(!(t>=1e3&&t<=9999))return Number.isNaN(t)?`Invalid Date`:e.toISOString();let n=e.getUTCMilliseconds(),r=n<10?`00${n}`:n<100?`0${n}`:`${n}`;return`${t}-${pad2(e.getUTCMonth()+1)}-${pad2(e.getUTCDate())}T${pad2(e.getUTCHours())}:${pad2(e.getUTCMinutes())}:${pad2(e.getUTCSeconds())}.${r}Z`}function buildFlat(e,t){let n=t.meta.property,r=t.json,i=e[n],a=r.stableKeyOrder,o=e,s=Object.keys(o),c={hit:!1},l=i?.date instanceof Date?toIsoString(i.date):void 0,u=o[zo]instanceof Error&&typeof o.name==`string`&&Array.isArray(o.stack),d=!u&&Object.hasOwn(o,r.messageKey),f=!u&&Object.hasOwn(o,`0`),p=!1,m=!1,h=!1;if(!u){let e=d?void 0:getSpreadShapeHint(o);if(m=e===`object-first`&&typeof o[0]==`object`&&o[0]!==null&&!isErrorObject(o[0]),h=e===`message-first`&&typeof o[1]==`object`&&o[1]!==null&&!isErrorObject(o[1]),!m&&!h)for(let e=0;e<s.length;e++){let t=s[e];if(t!==n&&t!==r.messageKey&&t!==`0`&&isErrorObject(o[t])){p=!0;break}}}if(!u&&!p&&!m&&!h){let e=d?r.messageKey:f?`0`:void 0,t={};if(e!==void 0){let n=o[e];t[r.messageKey]=a?deepSortKeys(n,c):n}writeHead(t,i,r,l);let u;for(let t=0;t<s.length;t++){let i=s[t];i===n||i===e||i===`__proto__`||isReservedHeadKey(i,r)||(u===void 0&&(u=[]),u.push(i))}if(u!==void 0){if(a){u.sort();for(let e=0;e<u.length;e++)t[u[e]]=deepSortKeys(o[u[e]],c)}else for(let e=0;e<u.length;e++)t[u[e]]=o[u[e]]}return writeMeta(t,i,n,a,l,c),{flat:t,awkward:c.hit,scanned:a}}let g={},v=[];if(u){v.push(stripMeta(e,n));let t=getBoundFieldsHint(o);if(t!=null)for(let e of Object.keys(t))e===`__proto__`||e===n||Object.hasOwn(g,e)||(g[e]=t[e])}else for(let e=0;e<s.length;e++){let t=s[e];if(t===n)continue;let r=o[t];isErrorObject(r)?v.push(r):g[t]=r}if(m){let e=g[0];delete g[0];let t=g[1];delete g[1];for(let[t,r]of Object.entries(e))t!==`__proto__`&&t!==n&&!Object.hasOwn(g,t)&&(g[t]=r);g[r.messageKey]=t}if(h){let e=g[0];delete g[0];let t=g[1];delete g[1];for(let[e,r]of Object.entries(t))e!==`__proto__`&&e!==n&&!Object.hasOwn(g,e)&&(g[e]=r);g[r.messageKey]=e}let y=!1,b;Object.hasOwn(g,r.messageKey)?(y=!0,b=g[r.messageKey],delete g[r.messageKey]):Object.hasOwn(g,`0`)&&(y=!0,b=g[0],delete g[0]);let x={};y&&(x[r.messageKey]=b),writeHead(x,i,r,l);let ee=a?Object.keys(g).sort():Object.keys(g);for(let e of ee)e===`__proto__`||isReservedHeadKey(e,r)||(x[e]=a?deepSortKeys(g[e]):g[e]);if(v.length>0){let e=a?v.map(e=>deepSortKeys(e)):v;x[r.errorKey]=e.length===1?e[0]:e}return writeMeta(x,i,n,a,l),{flat:x,awkward:!0,scanned:!1}}function isReservedHeadKey(e,t){return e===t.levelKey||t.time!==!1&&e===t.timeKey||t.numericLevel&&e===t.levelIdKey}function writeHead(e,t,n,r){if(t==null)return;e[n.levelKey]=t.logLevelName,n.numericLevel&&(e[n.levelIdKey]=t.logLevelId);let i=n.time;if(i!==!1){if(i===`iso`||r===void 0){e[n.timeKey]=r===void 0?t.date:r;return}if(i===`epoch`){e[n.timeKey]=t.date.getTime();return}try{let a=i(t.date);e[n.timeKey]=typeof a==`string`||typeof a==`number`?a:r}catch{e[n.timeKey]=r}}}function writeMeta(e,t,n,r,i,a){if(t==null)return;let o=t,s={v:5},c=r?Object.keys(o).sort():Object.keys(o);for(let e=0;e<c.length;e++){let t=c[e];if(t===`date`&&i!==void 0){s.date=i;continue}s[t]=r?deepSortKeys(o[t],a):o[t]}e[n]=s}function renderJson(e,t){if(!t.json.stableKeyOrder&&t.json.time===`iso`){let n=renderPlannedLine(e,t);if(n!==void 0)return n}return renderJsonUnplanned(e,t)}function renderJsonUnplanned(e,t){let{flat:n,awkward:r,scanned:i}=buildFlat(e,t);return i?r?jsonStringifySafe(n):JSON.stringify(n):jsonStringifyValue(n)}function isIntegerLikeKey(e){let t=e.charCodeAt(0);return t<48||t>57?!1:Ho.test(e)}function isPlanStaticValue(e){let t=typeof e;return t===`string`||t===`number`||t===`boolean`||e===null||Array.isArray(e)&&e.every(e=>typeof e==`string`)}function buildLinePlan(e,t){let n=t.json;
/* v8 ignore next 3 -- unreachable defensive guard: buildLinePlan's sole caller (renderPlannedLine) is only reached from renderJson when json.time === "iso"; buildLinePlan is not exported, so no test path can enter with a non-"iso" mode */
if(n.time!==`iso`)return!1;let r=[n.messageKey,n.levelKey,n.timeKey,t.meta.property];if(n.numericLevel&&r.push(n.levelIdKey),new Set(r).size!==r.length)return!1;let i=[],a=[],o=`,${JSON.stringify(t.meta.property)}:{"v":5`,s=0,c=0,l=0,u=0;for(let t of Object.keys(e)){if(u++,t===`date`){o+=`,"date":"`,a.push(o,{dyn:`date`}),o=`"`,s++;continue}if(t===`logLevelId`){o+=`,"logLevelId":`,a.push(o,{dyn:`levelId`}),o=``,c++;continue}if(t===`logLevelName`){o+=`,"logLevelName":`,a.push(o,{dyn:`levelName`}),o=``,l++;continue}if(!Vo.has(t))return t!==`path`&&null;let n=e[t];if(!isPlanStaticValue(n))return!1;i.push({key:t,value:n}),o+=`,${JSON.stringify(t)}:${JSON.stringify(n)}`}return s!==1||c!==1||l!==1?!1:(a.push(`${o}}`),{messageKey:n.messageKey,levelKey:n.levelKey,levelIdKey:n.levelIdKey,timeKey:n.timeKey,numericLevel:n.numericLevel,metaProperty:t.meta.property,messagePrefix:`${JSON.stringify(n.messageKey)}:`,staticEntries:i,metaKeyCount:u,metaSegments:a,levelChunks:/* @__PURE__ */ new Map})}function planMatchesSettings(e,t){let n=t.json;return e.messageKey===n.messageKey&&e.levelKey===n.levelKey&&e.levelIdKey===n.levelIdKey&&e.timeKey===n.timeKey&&n.time===`iso`&&e.numericLevel===n.numericLevel&&e.metaProperty===t.meta.property}function stringifyFieldValue(e){return e===void 0?`"[undefined]"`:jsonStringifyValue(e)}function renderPlannedLine(e,t){let n=t.meta.property,r=e[n];if(r==null||!(r.date instanceof Date))return;let i=Bo.get(t);if(i===!1)return;if(i===void 0||!planMatchesSettings(i,t)){let e=buildLinePlan(r,t);if(e===null||(Bo.set(t,e),e===!1))return;i=e}let a=0;for(let e in r)a++;if(a!==i.metaKeyCount)return;for(let e=0;e<i.staticEntries.length;e++){let t=i.staticEntries[e];if(r[t.key]!==t.value)return}let o=e;if(o[zo]instanceof Error)return;let s=t.json,c=Object.hasOwn(o,s.messageKey),l=c?s.messageKey:Object.hasOwn(o,`0`)?`0`:void 0,u=l===void 0?void 0:o[l],d,f=c?void 0:getSpreadShapeHint(o);if(f!==void 0){let e=f===`object-first`?`0`:`1`,t=o[e];
/* v8 ignore else -- unreachable: toLogObj sets the hint only when that slot held a plain object, in the same pass that stores it there, and nothing between toLogObj and rendering rewrites positional values (middleware and masking run on the args BEFORE toLogObj); the typeof guard only protects the cast on a hand-built record */
typeof t==`object`&&t&&(u=o[e===`0`?`1`:`0`],d=t)}let p=d!==void 0;p&&(l=s.messageKey);let m=r.logLevelId,h=r.logLevelName,g=`${m}|${h}`,v=i.levelChunks.get(g);if(v===void 0){let e=`${JSON.stringify(i.levelKey)}:${JSON.stringify(h)}${i.numericLevel?`,${JSON.stringify(i.levelIdKey)}:${JSON.stringify(m)}`:``},${JSON.stringify(i.timeKey)}:"`,t=``,n=``,r=!1;for(let e of i.metaSegments){let i=typeof e==`string`?e:e.dyn===`levelId`?JSON.stringify(m):e.dyn===`levelName`?JSON.stringify(h):void 0;if(i===void 0){r=!0;continue}r?n+=i:t+=i}v={head:e,metaBefore:t,metaAfter:n},i.levelChunks.set(g,v)}let y=toIsoString(r.date),b=`{`;if(l!==void 0){let e=stringifyFieldValue(u);e!==void 0&&(b+=`${i.messagePrefix}${e},`)}b+=`${v.head}${y}"`;let x=Object.keys(o);for(let e=0;e<x.length;e++){let t=x[e];if(t===n||t===l||t===`__proto__`||isReservedHeadKey(t,s)||p&&(t===`0`||t===`1`))continue;if(isIntegerLikeKey(t))return;let r=o[t];if(isErrorObject(r))return;let i=stringifyFieldValue(r);i!==void 0&&(b+=`,${JSON.stringify(t)}:${i}`)}if(d!==void 0)for(let e of Object.keys(d)){if(e===s.messageKey||e===`__proto__`||e===n||isReservedHeadKey(e,s)||Object.hasOwn(o,e)&&e!==`0`&&e!==`1`)continue;if(isIntegerLikeKey(e))return;let t=stringifyFieldValue(d[e]);t!==void 0&&(b+=`,${JSON.stringify(e)}:${t}`)}return`${b+v.metaBefore+y+v.metaAfter}}`}function jsonStringifyValue(e){return containsAwkwardValue(e)?jsonStringifySafe(e):JSON.stringify(e)}function containsAwkwardValue(e,t=/* @__PURE__ */ new WeakSet){if(typeof e==`bigint`||e===void 0)return!0;if(typeof e!=`object`||!e)return!1;if(e instanceof Error||t.has(e))return!0;if(e instanceof Date)return!1;if(t.add(e),Array.isArray(e)){for(let n=0;n<e.length;n++)if(containsAwkwardValue(e[n],t))return!0;return t.delete(e),!1}for(let n of Object.keys(e))if(containsAwkwardValue(e[n],t))return!0;return t.delete(e),!1}function jsonStringifySafe(e){let t=[];return JSON.stringify(e,function(e,n){if(typeof n==`bigint`)return`${n}`;if(n===void 0)return`[undefined]`;if(typeof n==`object`&&n){if(n instanceof Error)return;for(;t.length>0&&t[t.length-1]!==this;)t.pop();if(t.includes(n))return`[Circular]`;t.push(n)}return n})}function deepSortKeys(e,t,n=/* @__PURE__ */ new WeakSet){if(typeof e!=`object`||!e)return t!==void 0&&(typeof e==`bigint`||e===void 0)&&(t.hit=!0),e;if(n.has(e))return`[Circular]`;if(!isPlainObject$1(e)&&!Array.isArray(e))return t!==void 0&&e instanceof Error&&(t.hit=!0),e;if(n.add(e),Array.isArray(e)){let r=e.map(e=>deepSortKeys(e,t,n));return n.delete(e),r}let r={};for(let i of Object.keys(e).sort())r[i]=deepSortKeys(e[i],t,n);return n.delete(e),r}function isPlainObject$1(e){if(typeof e!=`object`||!e||Array.isArray(e)||e instanceof Date||e instanceof Error)return!1;let t=Object.getPrototypeOf(e);return t===Object.prototype||t===null}function isErrorObject(e){if(typeof e!=`object`||!e||Array.isArray(e))return!1;let t=e;return t[zo]instanceof Error&&typeof t.name==`string`&&Array.isArray(t.stack)}function stripMeta(e,t){let n={};for(let r of Object.keys(e))r!==t&&(n[r]=e[r]);return n}var zo,Bo,Vo,Ho;function init_json(){return(init_json=__esmMin((()=>{init_logObj(),zo=`nativeError`,Bo=/* @__PURE__ */ new WeakMap,Vo=/* @__PURE__ */ new Set([`runtime`,`runtimeVersion`,`hostname`,`browser`,`name`,`parentNames`]),Ho=/^(?:0|[1-9]\d*)$/})))()}function attachMaskedArgs(e,t){return Object.defineProperty(e,Uo,{value:t,enumerable:!1,configurable:!0,writable:!0}),e}function getMaskedArgs(e,t){let n=e[Uo];if(Array.isArray(n))return n;let r=e;return Object.keys(r).filter(e=>e!==t).map(e=>r[e])}function runMiddleware(e,t){let n=e;for(let e of t){let t=e(n);if(t===null||t===!1)return null;t!==void 0&&(n=t)}return n}function pretty(e){return(t,n)=>{let r=t[n.meta.property],i=getMaskedArgs(t,n.meta.property);return e.prettyFormatLine(i,r,unstyled(n))}}function unstyled(e){return e.pretty.style===!1?e:{...e,pretty:{...e.pretty,style:!1,inspectOptions:{...e.pretty.inspectOptions}}}}function resolveFormatter(e,t,n){return e===`json`?n:e===`pretty`?pretty(t):e}var Uo;function init_pipeline(){return(init_pipeline=__esmMin((()=>{Uo=Symbol(`tslog.pipeline.maskedArgs`)})))()}function safeGetCwd(){try{let e=globalThis?.process;if(typeof e?.cwd==`function`)return e.cwd()}catch{}try{let e=globalThis?.Deno;if(typeof e?.cwd==`function`)return e.cwd()}catch{}}function isBrowserEnvironment$1(){return typeof window<`u`&&typeof document<`u`}function isWorkerEnvironment(){return typeof globalThis.importScripts==`function`}function isReactNativeEnvironment(){try{return globalThis.navigator?.product===`ReactNative`}catch{return!1}}function readEnvBag(){try{let e=globalThis?.process;if(e?.env!=null)return e.env}catch{}}function safeEnvGet(e){try{return readEnvBag()?.[e]}catch{return}}function noColorRequested(){let e=safeEnvGet(`NO_COLOR`);return e!=null&&e!==``}function forceColorRequested(){let e=safeEnvGet(`FORCE_COLOR`);return e!=null&&e!==``&&e!==`0`}function stdoutIsTTY(){try{return(globalThis?.process)?.stdout?.isTTY===!0}catch{return!1}}function resolveDefaultType(){return`pretty`}function consoleSupportsCssStyling(){if(!isBrowserEnvironment$1()&&!isWorkerEnvironment())return!1;let e=globalThis?.navigator?.userAgent??``;return/firefox/i.test(e)||globalThis?.CSS?.supports?.(`color`,`#000`)?!0:/safari/i.test(e)&&!/chrome/i.test(e)}function nativeConsoleMethod(e){try{let t=console[Wo]?.[e];if(typeof t==`function`)return t}catch{}return console[e]}var Wo;function init_nativeConsole(){return(init_nativeConsole=__esmMin((()=>{Wo=Symbol.for(`tslog.console.originals`)})))()}function isTransportFn(e){return typeof e==`function`}function normalizeTransport(e){if(isTransportFn(e)){let t=e;return{write(e){return t(e)}}}return e}function resolveTransportMinLevel(e,t){return e.minLevel==null?-1/0:resolveLogLevelId(e.minLevel,t)??-1/0}function runTransportIsolated(e,t,n){try{let r=e.write(t,n);if(r!=null&&typeof r.then==`function`){let t=Go.get(e);t===void 0&&(t=/* @__PURE__ */ new Set,Go.set(e,t));let n=r.then(()=>{t.delete(n)},r=>{t.delete(n),reportTransportError(e,r)});t.add(n)}}catch(t){reportTransportError(e,t)}}function reportTransportError(e,t){try{let n=e.name==null?``:` "${e.name}"`;nativeConsoleMethod(`error`)(`tslog: attached transport${n} threw an error`,t)}catch{}}function dispatchToTransports(e,t,n,r,i,a){if(e.length===0)return;let o,s,c,lineFor=e=>{if(typeof e==`function`){c??=/* @__PURE__ */ new Map;let n=c.get(e);if(n!==void 0)return n;let r=i(t,e);return c.set(e,r),r}return e===`json`?(s??=i(t,`json`),s):(o??=i(t,`pretty`),o)};for(let i of e){if(n<resolveTransportMinLevel(i,a))continue;let e=i.format??r,o;try{o=lineFor(e)}catch(e){reportTransportError(i,e),o=``}runTransportIsolated(i,t,o)}}function attachTransport(e,t){let n=normalizeTransport(t);e.push(n);let r=!1;return()=>{if(r)return;r=!0;let t=e.indexOf(n);t!==-1&&e.splice(t,1)}}async function flushAll(e,t=!1){if(e.length===0)return;let n=[];for(let t of e){let e=Go.get(t);e!==void 0&&e.size>0&&n.push(...e)}n.length>0&&await Promise.allSettled(n);let r=[];for(let n of e)if(typeof n.flush==`function`&&r.push(invokeIsolated(()=>n.flush?.(),n)),t){let e=n[Symbol.asyncDispose];typeof e==`function`&&r.push(invokeIsolated(()=>e.call(n),n))}r.length>0&&await Promise.allSettled(r)}async function disposeAll(e){if(e.length===0)return;let t=[];for(let n of e){let e=n[Symbol.asyncDispose];typeof e==`function`&&t.push(invokeIsolated(()=>e.call(n),n))}t.length>0&&await Promise.allSettled(t)}function invokeIsolated(e,t){try{return Promise.resolve(e()).catch(e=>reportTransportError(t,e))}catch(e){return reportTransportError(t,e),Promise.resolve()}}var Go;function init_transports(){return(init_transports=__esmMin((()=>{init_nativeConsole(),init_levels$1(),Go=/* @__PURE__ */ new WeakMap})))()}function editDistance(e,t,n){if(Math.abs(e.length-t.length)>n)return n+1;let r=Array.from({length:t.length+1},(e,t)=>t);for(let i=1;i<=e.length;i++){let a=[i],o=i;for(let n=1;n<=t.length;n++){let s=e[i-1]===t[n-1]?0:1;a[n]=Math.min(r[n]+1,a[n-1]+1,r[n-1]+s),a[n]<o&&(o=a[n])}if(o>n)return n+1;r=a}return r[t.length]}function nearestKey(e,t){let n=e.toLowerCase(),r=e.length<=4?1:2,i,a=r+1;for(let o of t){if(o.toLowerCase()===n)return o;let t=editDistance(e,o,r);t<a&&(a=t,i=o)}return i}function devWarningsEnabled(){return safeEnvGet(`TSLOG_DISABLE_WARNINGS`)==null&&safeEnvGet(`NODE_ENV`)!==`production`}function emitConfigWarning(e){try{nativeConsoleMethod(`warn`)(`tslog: ${e}`)}catch{}}function validateSettingsParam(e){if(e==null)return;let t=e.strictConfig===!0;if(!t&&!devWarningsEnabled())return;let report=e=>{if(t)throw new ko(e);emitConfigWarning(e.message)};if(e.minLevel!=null){let t=resolveLogLevelId(e.minLevel,e.customLevels);t==null?report({code:`UNKNOWN_MIN_LEVEL`,setting:`minLevel`,message:`unknown minLevel ${JSON.stringify(e.minLevel)}; expected a number 0-6 or a level name like "WARN".`,suggestion:`Use a number 0-6, a LogLevel enum value, or a level name like "WARN" — or register it via customLevels.`}):typeof e.minLevel==`number`&&(t<0||t>6)&&report({code:`MIN_LEVEL_OUT_OF_RANGE`,setting:`minLevel`,message:`minLevel ${t} is outside the default range 0-6; no default log method will be filtered as you might expect.`,suggestion:`Set minLevel to a number between 0 (SILLY) and 6 (FATAL), or register a customLevel for the out-of-range id.`})}try{let n=e.contextStorage;if(n!=null){let e=!1;try{e=typeof n.run!=`function`||typeof n.getStore!=`function`}catch{e=!0}if(e&&(t||!Xo.has(n))){try{Xo.add(n)}catch{}report({code:`INVALID_CONTEXT_STORAGE`,setting:`contextStorage`,message:`contextStorage does not look like an AsyncLocalStorage instance (needs run() and getStore()); runInContext will not propagate context.`,suggestion:'Pass an INSTANCE, e.g. `contextStorage: new AsyncLocalStorage()` from "node:async_hooks" — not the class itself.'})}}}catch(e){if(e instanceof ko)throw e}try{e.clock!=null&&typeof e.clock!=`function`&&report({code:`INVALID_CLOCK`,setting:`clock`,message:"clock must be a function returning a Date (e.g. `clock: () => new Date()`); it will be ignored.",suggestion:`Pass a zero-argument function returning a valid Date.`});let t=e.json?.time;t!=null&&t!==!1&&t!==`iso`&&t!==`epoch`&&typeof t!=`function`&&report({code:`INVALID_JSON_TIME`,setting:`json.time`,message:`unknown json.time value ${JSON.stringify(t)}; expected "iso", "epoch", false, or a (date) => string | number function.`,suggestion:`Use json.time: "iso" | "epoch" | false | ((date) => string | number).`})}catch(e){if(e instanceof ko)throw e}let n=[];try{n=Object.keys(e)}catch{}for(let e of n){if(qo.has(e))continue;let t=Object.hasOwn(Yo,e)?Yo[e]:void 0;if(t!=null){report({code:`V4_FLAT_KEY`,setting:e,message:`"${e}" was removed in v5 — use ${t} instead (see MIGRATION_v4_to_v5.md).`,suggestion:`Move "${e}" to ${t}.`});continue}let n=nearestKey(e,qo);report({code:`UNKNOWN_SETTING`,setting:e,message:`unknown setting "${e}"${n==null?``:` — did you mean "${n}"?`}`,suggestion:n==null?`Remove "${e}" — it is not a tslog setting.`:`Rename "${e}" to "${n}".`})}for(let[t,n]of Object.entries(Jo)){let r;try{r=e[t]}catch{continue}if(typeof r!=`object`||!r||Array.isArray(r))continue;let i=[];try{i=Object.keys(r)}catch{continue}for(let e of i){if(n.has(e))continue;let r=nearestKey(e,n);report({code:`UNKNOWN_SETTING`,setting:`${t}.${e}`,message:`unknown setting "${t}.${e}"${r==null?``:` — did you mean "${t}.${r}"?`}`,suggestion:r==null?`Remove "${t}.${e}" — it is not a tslog setting.`:`Rename "${t}.${e}" to "${t}.${r}".`})}}let r=e.pretty?.template;if(typeof r==`string`){let e=/{{\s*(.+?)\s*}}/g,t;for(;(t=e.exec(r))!=null;){let e=t[1];Ko.has(e)||report({code:`UNKNOWN_PRETTY_PLACEHOLDER`,setting:`pretty.template`,message:`pretty.template references unknown placeholder "{{${e}}}"; check the spelling (e.g. "{{logLevelName}}").`,suggestion:`Remove or fix "{{${e}}}" — see the recognized placeholders (e.g. "{{logLevelName}}", "{{filePathWithLine}}").`})}}}function resolveStackCapture(e,t){return e?.stack?.capture==null?t===`json`?`off`:`auto`:e.stack.capture}function resolveType(e){return e?.type==null?e?.pretty?.enabled==null?resolveDefaultType():e.pretty.enabled?`pretty`:`json`:e.type}function resolveStyle(e){return e?.pretty?.style==null?forceColorRequested()?!0:noColorRequested()?!1:isBrowserEnvironment$1()||isWorkerEnvironment()||isReactNativeEnvironment()?!0:stdoutIsTTY():e.pretty.style}function normalizeSettings(e){let t=resolveType(e),n=resolveStackCapture(e,t),r={};if(e?.customLevels!=null)for(let[t,n]of Object.entries(e.customLevels))validateCustomLevel(t,n,r),r[t]=n;return{type:t,name:e?.name,parentNames:e?.parentNames,minLevel:resolveLogLevelId(e?.minLevel,r)??0,argumentsArrayName:e?.argumentsArrayName,persistLevel:e?.persistLevel,persistLevelKey:e?.persistLevelKey,pretty:{template:e?.pretty?.template??`{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}	{{logLevelName}}	{{filePathWithLine}}{{nameWithDelimiterPrefix}}	`,errorTemplate:e?.pretty?.errorTemplate??`
{{errorName}} {{errorMessage}}
error stack:
{{errorStack}}`,errorStackTemplate:e?.pretty?.errorStackTemplate??`  • {{fileName}}	{{method}}
	{{filePathWithLine}}`,errorParentNamesSeparator:e?.pretty?.errorParentNamesSeparator??`:`,errorLoggerNameDelimiter:e?.pretty?.errorLoggerNameDelimiter??`	`,style:resolveStyle(e),timeZone:e?.pretty?.timeZone??`UTC`,styles:e?.pretty?.styles??{logLevelName:{"*":[`bold`,`black`,`bgWhiteBright`,`dim`],SILLY:[`bold`,`white`],TRACE:[`bold`,`whiteBright`],DEBUG:[`bold`,`green`],INFO:[`bold`,`blue`],WARN:[`bold`,`yellow`],ERROR:[`bold`,`red`],FATAL:[`bold`,`redBright`]},dateIsoStr:`white`,filePathWithLine:`white`,name:[`white`,`bold`],nameWithDelimiterPrefix:[`white`,`bold`],nameWithDelimiterSuffix:[`white`,`bold`],errorName:[`bold`,`bgRedBright`,`whiteBright`],fileName:[`yellow`],fileNameWithLine:`white`},levelMethod:e?.pretty?.levelMethod??{},passObjectsNatively:e?.pretty?.passObjectsNatively??isBrowserEnvironment$1(),inspectOptions:e?.pretty?.inspectOptions??{colors:!0,compact:!1,depth:1/0}},json:{messageKey:e?.json?.messageKey??`message`,levelKey:e?.json?.levelKey??`level`,levelIdKey:e?.json?.levelIdKey??`levelId`,timeKey:e?.json?.timeKey??`time`,errorKey:e?.json?.errorKey??`error`,numericLevel:e?.json?.numericLevel??!0,time:e?.json?.time??`iso`,stableKeyOrder:e?.json?.stableKeyOrder??!1},mask:{keys:[...e?.mask?.keys??[]],caseInsensitive:e?.mask?.caseInsensitive??!1,regex:[...e?.mask?.regex??[]],placeholder:e?.mask?.placeholder??`[***]`,paths:[...e?.mask?.paths??[]],censor:e?.mask?.censor,hashLabel:e?.mask?.hashLabel},stack:{capture:n,internalFramePatterns:[...e?.stack?.internalFramePatterns??[]]},meta:{property:e?.meta?.property??`_logMeta`,attachContext:e?.meta?.attachContext??!0},prefix:[...e?.prefix??[]],attachedTransports:(e?.attachedTransports??[]).map(e=>normalizeTransport(e)),middleware:[...e?.middleware??[]],customLevels:r,bindings:e?.bindings==null?void 0:{...e.bindings},strictConfig:e?.strictConfig??!1,contextStorage:e?.contextStorage,clock:e?.clock}}var Ko,qo,Jo,Yo,Xo;function init_settings(){return(init_settings=__esmMin((()=>{init_nativeConsole(),init_config$1(),init_levels$1(),init_transports(),Ko=/* @__PURE__ */ new Set([`yyyy`,`mm`,`dd`,`hh`,`MM`,`ss`,`ms`,`dateIsoStr`,`rawIsoStr`,`logLevelName`,`name`,`nameWithDelimiterPrefix`,`nameWithDelimiterSuffix`,`fullFilePath`,`filePathWithLine`,`fileNameWithLine`,`fileName`,`filePath`,`fileLine`,`fileColumn`]),qo=/* @__PURE__ */ new Set([`type`,`name`,`parentNames`,`minLevel`,`argumentsArrayName`,`persistLevel`,`persistLevelKey`,`pretty`,`json`,`mask`,`stack`,`meta`,`prefix`,`attachedTransports`,`middleware`,`customLevels`,`bindings`,`strictConfig`,`contextStorage`,`clock`]),Jo={pretty:/* @__PURE__ */ new Set([`enabled`,`template`,`errorTemplate`,`errorStackTemplate`,`errorParentNamesSeparator`,`errorLoggerNameDelimiter`,`style`,`timeZone`,`styles`,`levelMethod`,`passObjectsNatively`,`inspectOptions`]),json:/* @__PURE__ */ new Set([`messageKey`,`levelKey`,`levelIdKey`,`timeKey`,`time`,`errorKey`,`numericLevel`,`stableKeyOrder`]),mask:/* @__PURE__ */ new Set([`keys`,`caseInsensitive`,`regex`,`placeholder`,`paths`,`censor`,`hashLabel`]),stack:/* @__PURE__ */ new Set([`capture`,`internalFramePatterns`]),meta:/* @__PURE__ */ new Set([`property`,`attachContext`])},Yo={prettyLogTemplate:`pretty.template`,prettyErrorTemplate:`pretty.errorTemplate`,prettyErrorStackTemplate:`pretty.errorStackTemplate`,prettyErrorParentNamesSeparator:`pretty.errorParentNamesSeparator`,prettyErrorLoggerNameDelimiter:`pretty.errorLoggerNameDelimiter`,stylePrettyLogs:`pretty.style`,prettyLogTimeZone:`pretty.timeZone`,prettyLogStyles:`pretty.styles`,prettyInspectOptions:`pretty.inspectOptions`,maskValuesOfKeys:`mask.keys`,maskValuesOfKeysCaseInsensitive:`mask.caseInsensitive`,maskValuesRegEx:`mask.regex`,maskPlaceholder:`mask.placeholder`,metaProperty:`meta.property`,internalFramePatterns:`stack.internalFramePatterns`,prettyLogLevelMethod:`pretty.levelMethod`,hideLogPositionForProduction:`stack.capture ("off" hides positions)`,overwrite:`middleware / logger.use()`,stackDepthLevel:`the callerFrame constructor argument`},Xo=/* @__PURE__ */ new WeakSet})))()}function urlToObject(e){return{href:e.href,protocol:e.protocol,username:e.username,password:e.password,host:e.host,hostname:e.hostname,port:e.port,pathname:e.pathname,search:e.search,searchParams:[...e.searchParams].map(([e,t])=>({key:e,value:t})),hash:e.hash,origin:e.origin}}var Zo;function init_interfaces(){return(init_interfaces=__esmMin((()=>{(function(e){e[e.SILLY=0]=`SILLY`,e[e.TRACE=1]=`TRACE`,e[e.DEBUG=2]=`DEBUG`,e[e.INFO=3]=`INFO`,e[e.WARN=4]=`WARN`,e[e.ERROR=5]=`ERROR`,e[e.FATAL=6]=`FATAL`})(Zo||={})})))()}var Qo,$o,BaseLogger;function init_BaseLogger(){return(init_BaseLogger=__esmMin((()=>{init_asyncContext(),init_config$1(),init_levelPersistence(),init_levels$1(),init_logObj(),init_pipeline(),init_settings(),init_transports(),init_nativeConsole(),init_json(),Qo={renderJson:renderJsonUnplanned,validateSettings(e){if(e==null)return;let t=e.mask;if(t!=null&&((t.keys?.length??0)>0||(t.regex?.length??0)>0||(t.paths?.length??0)>0||t.censor!=null))throw new ko({code:`FEATURES_NO_MASKING`,setting:`mask`,message:`this BaseLogger was constructed without a feature set, so these mask settings would be silently ignored and secrets logged in plaintext.`,suggestion:'Pass the full feature set as the fifth constructor argument: `new BaseLogger(settings, logObj, env, NaN, fullCoreFeatures)` (exported from "tslog").'});if(e.type===`pretty`||e.pretty?.enabled===!0)throw new ko({code:`FEATURES_NO_PRETTY`,setting:`type`,message:`this BaseLogger was constructed without a feature set, so pretty output would lose its meta line.`,suggestion:"Pass the full feature set as the fifth constructor argument (`fullCoreFeatures`), or use the entry Logger classes."});if(e.strictConfig===!0)throw new ko({code:`FEATURES_NO_VALIDATION`,setting:`strictConfig`,message:`this BaseLogger was constructed without a feature set, so the strict settings validation you opted into cannot run.`,suggestion:"Pass the full feature set as the fifth constructor argument (`fullCoreFeatures`), which includes the validator."})}},$o={mask(e){for(let t=0;t<e.length;t++)if(e[t]instanceof URL)return e.map(e=>e instanceof URL?urlToObject(e):e);return e}},BaseLogger=class{logObj;callerFrame;runtime;settings;maxErrorCauseDepth=5;captureStackForMeta;maskingEngine;features;logObjDeps;asyncContextBox={};warnedContextNoop=!1;inheritedTransports;hasCustomLevels=!1;rawBindings;_conditionalNoop;constructor(e,t,n,r=NaN,i){if(this.logObj=t,this.callerFrame=r,this.features=i??Qo,this.features.validateSettings?.(e),this.runtime=n,this.settings=normalizeSettings(e),this.maskingEngine=this.features.createMaskingEngine?.(this.settings,{isError:e=>this.runtime.isError(e),isBuffer:e=>this.runtime.isBuffer(e)})??$o,this.logObjDeps={isError:e=>this.runtime.isError(e),isBuffer:e=>this.runtime.isBuffer(e),getErrorTrace:e=>this.runtime.getErrorTrace(e),maxErrorCauseDepth:this.maxErrorCauseDepth},this.settings.persistLevel===!0){let e=readPersistedLevel(this.settings.persistLevelKey??`tslog:level`);if(e!=null){let t=Number(e),n=resolveLogLevelId(e.trim()!==``&&Number.isFinite(t)?t:e,this.settings.customLevels);n!=null&&(this.settings.minLevel=n)}}this.captureStackForMeta=this._shouldCaptureStack(),this.settings.bindings!=null&&(this.rawBindings={...this.settings.bindings},this._sanitizeBindings(this.settings.bindings),this.settings.bindings=this.maskingEngine.mask([this.settings.bindings])[0]);for(let[e,t]of Object.entries(this.settings.customLevels))this.hasCustomLevels=!0,this._installCustomLevelMethod(e,t);this.settings.contextStorage!=null&&(this.asyncContextBox.store=createAsyncContextStoreFromInstance(this.settings.contextStorage))}_installCustomLevelMethod(e,t){let n=e.toLowerCase(),r=this[n];if(r!==void 0&&r?.__tslogCustomLevel===void 0){devWarningsEnabled()&&emitConfigWarning(`custom level "${e}" collides with the existing logger member "${n}"; no method was installed — use log(${t}, ${JSON.stringify(e)}, ...) instead.`);return}let method=(...n)=>this.log(t,e,...n);method.__tslogCustomLevel=e,Object.defineProperty(this,n,{value:method,enumerable:!1,configurable:!0,writable:!0})}_sanitizeBindings(e){for(let t of Object.keys(e)){let n=/^(?:0|[1-9]\d*)$/.test(t);(t===this.settings.json.messageKey||t===this.settings.meta.property||t===`__proto__`||n)&&(delete e[t],devWarningsEnabled()&&emitConfigWarning(`binding "${t}" was dropped: ${n?`integer-like keys are hoisted by JS object semantics`:`it collides with a reserved record key`} — rename the binding.`))}}setMinLevel(e){let t=resolveLogLevelId(e,this.settings.customLevels);return t==null?this:(this.settings.minLevel=t,this.settings.persistLevel===!0&&writePersistedLevel(t,this.settings.persistLevelKey??`tslog:level`),this)}log(e,t,...n){if(e<this.settings.minLevel)return;if(this.hasCustomLevels){let n=this.settings.customLevels[t];n!==void 0&&n!==e&&devWarningsEnabled()&&emitConfigWarning(`log(${e}, ${JSON.stringify(t)}) does not match the registered id ${n} for that custom level.`)}let r=this._resolveLogArguments(n),i=this.settings.prefix.length>0?[...this.settings.prefix,...r]:r,a=e,o=t,s;if(this.settings.middleware.length>0){let n=runMiddleware({logLevelId:e,logLevelName:t,args:i,settings:this.settings,meta:{}},this.settings.middleware);if(n==null)return;a=n.logLevelId,o=n.logLevelName,i=n.args,s=n.meta}let c=this.maskingEngine.mask(i),l=this.logObj==null?void 0:recursiveCloneAndExecuteFunctions(this.logObj),u=toLogObj(c,this.settings.argumentsArrayName,this.logObjDeps,l,this.settings.bindings),d=this._addMetaToLogObj(u,a,o),f=d[this.settings.meta.property];if(f!=null){if(this.settings.meta.attachContext){let e=this.asyncContextBox.store?.getStore();if(e!=null)for(let t of Object.keys(e))f[t]=e[t]}if(s!=null)for(let e of Object.keys(s))f[e]=s[e]}if(attachMaskedArgs(d,c),this.settings.type===`pretty`){let{args:e,errors:t}=this.runtime.prettyFormatLogObj(c,this.settings),n=this.features.buildPrettyMetaText?.(this.settings,f)??``;this.runtime.transportFormatted(n,e,t,f,this.settings)}else if(this.settings.type===`json`)try{let e=this.features.renderJson(d,this.settings);this.runtime.writeJsonLine==null?nativeConsoleMethod(`log`)(e):this.runtime.writeJsonLine(e)}catch{}if(this.settings.attachedTransports.length>0){let e=this.settings.type===`pretty`?`pretty`:`json`;dispatchToTransports(this.settings.attachedTransports,d,a,e,(e,t)=>resolveFormatter(t,this.runtime,this.features.renderJson)(e,this.settings),this.settings.customLevels)}return d}isLevelEnabled(e){let t=resolveLogLevelId(e,this.settings.customLevels);return t!=null&&t>=this.settings.minLevel}if(e){return e?this:this._getConditionalNoop()}_getConditionalNoop(){if(this._conditionalNoop==null){let noopMethod=()=>void 0;this._conditionalNoop=new Proxy(this,{get(e,t,n){if(t===`then`)return;let r=Reflect.get(e,t,n);return typeof r==`function`?noopMethod:r}})}return this._conditionalNoop}use(e){return this.settings.middleware.push(e),this}_getAsyncContextStore(){return this.asyncContextBox.store??(this.settings.contextStorage==null?this.asyncContextBox.store=this.runtime.createAsyncContextStore==null?createAsyncContextStore():this.runtime.createAsyncContextStore():this.asyncContextBox.store=createAsyncContextStoreFromInstance(this.settings.contextStorage)),this.asyncContextBox.store}runInContext(e,t){let n=this._getAsyncContextStore();return!n.enabled&&!this.warnedContextNoop&&devWarningsEnabled()&&(this.warnedContextNoop=!0,nativeConsoleMethod(`warn`)('tslog: runInContext() found no AsyncLocalStorage on this runtime — the function runs, but the context will NOT be attached to logs. On Cloudflare Workers enable the "nodejs_als" (or "nodejs_compat") compatibility flag and pass `contextStorage: new AsyncLocalStorage()` from "node:async_hooks".')),n.run(e,t)}getContext(){return this._getAsyncContextStore().getStore()}addLevel(e,t){return validateCustomLevel(e,t,this.settings.customLevels),this.settings.customLevels[e]=t,this.hasCustomLevels=!0,this._installCustomLevelMethod(e,t),this}attachTransport(e){return attachTransport(this.settings.attachedTransports,e)}async flush(){await Promise.all([flushAll(this.settings.attachedTransports),this._flushDefaultSink()])}async _flushDefaultSink(){try{await this.runtime.flushJsonSink?.()}catch{}}_ownedTransports(){let e=this.inheritedTransports;return e==null?this.settings.attachedTransports:this.settings.attachedTransports.filter(t=>!e.has(t))}async[Symbol.asyncDispose](){await Promise.all([flushAll(this.settings.attachedTransports),this._flushDefaultSink()]),await disposeAll(this._ownedTransports())}[Symbol.dispose](){this._flushDefaultSink(),flushAll(this.settings.attachedTransports).then(()=>disposeAll(this._ownedTransports()))}child(e,t){return this.getSubLogger(e,t)}getSubLogger(e,t){let n={...this.settings.customLevels,...e?.customLevels},r={...this.settings,...e,minLevel:resolveLogLevelId(e?.minLevel,n)??this.settings.minLevel,customLevels:n,pretty:{...this.settings.pretty,...e?.pretty},json:{...this.settings.json,...e?.json},mask:{...this.settings.mask,...e?.mask},stack:{...this.settings.stack,...e?.stack},meta:{...this.settings.meta,...e?.meta},attachedTransports:[...this.settings.attachedTransports,...e?.attachedTransports??[]],middleware:[...this.settings.middleware,...e?.middleware??[]],parentNames:this.settings?.parentNames!=null&&this.settings?.name!=null?[...this.settings.parentNames,this.settings.name]:this.settings?.name==null?void 0:[this.settings.name],prefix:[...this.settings.prefix,...e?.prefix??[]],bindings:this.rawBindings!=null||e?.bindings!=null?{...this.rawBindings,...e?.bindings}:void 0,contextStorage:e?.contextStorage??this.settings.contextStorage},i=new this.constructor(r,t??this.logObj,this.runtime,this.callerFrame,this.features);return(e?.contextStorage==null||e.contextStorage===this.settings.contextStorage)&&(i.asyncContextBox=this.asyncContextBox),i.inheritedTransports=new WeakSet(this.settings.attachedTransports),i}_resolveLogArguments(e){if(e.length===1&&typeof e[0]==`function`){let t=e[0];if(t.length===0){let e=t();return Array.isArray(e)?[...e]:[e]}}return e}_addMetaToLogObj(e,t,n){let r=this.runtime.getMeta(t,n,this.callerFrame,!this.captureStackForMeta,this.settings.name,this.settings.parentNames,this.settings.stack.internalFramePatterns),i=this.settings.clock;if(i!=null)try{let e=i();e instanceof Date&&!Number.isNaN(e.getTime())&&(r.date=e)}catch{}return{...e,[this.settings.meta.property]:r}}_shouldCaptureStack(){let e=this.settings.stack.capture;if(e===`off`)return!1;if(e===`full`||e===`lazy`||this.settings.type===`json`)return!0;let t=this.settings.pretty.template??``;return/{{\s*(file(Name|Path|Line|PathWithLine|NameWithLine)|fullFilePath)\s*}}/.test(t)}}})))()}function formatNumberAddZeros(e,t=2,n=0){return e!=null&&isNaN(e)?``:(e=e==null?e:e+n,t===2?e==null?`--`:e<10?`0${e}`:e.toString():e==null?`---`:e<10?`00${e}`:e<100?`0${e}`:e.toString())}function styleTokenToCss(e){return es[e]?.css}function ansiToCssConsoleFormat(e){let t=[],n=[],r=/* @__PURE__ */ new Map,i=``,a=``,flush=()=>{if(a.length===0)return;let e=a.replace(/%/g,`%%`);i.length>0?(t.push(`%c${e}%c`),n.push(i,``)):t.push(e),a=``},o=/\u001b\[(\d+)m/g,s=0,c;for(;(c=o.exec(e))!=null;){a+=e.slice(s,c.index),s=o.lastIndex;let t=Number(c[1]),n=ns.get(t);if(n!=null)r.set(t,n);else if(t===0)r.clear();else for(let[e,n]of r)n.close===t&&r.delete(e);let l=[...new Set([...r.values()].map(e=>e.css))].join(`; `);l!==i&&(flush(),i=l)}return a+=e.slice(s),flush(),{text:t.join(``),styles:n}}var A,es,ts,ns;function init_styles(){return(init_styles=__esmMin((()=>{A={black:`#000000`,red:`#ef5350`,green:`#66bb6a`,yellow:`#fdd835`,blue:`#42a5f5`,magenta:`#ab47bc`,cyan:`#26c6da`,white:`#fafafa`,blackBright:`#424242`,redBright:`#ff7043`,greenBright:`#81c784`,yellowBright:`#ffe082`,blueBright:`#64b5f6`,magentaBright:`#ce93d8`,cyanBright:`#4dd0e1`,whiteBright:`#ffffff`},es={reset:{ansi:[0,0]},bold:{ansi:[1,22],css:`font-weight: bold`},dim:{ansi:[2,22],css:`opacity: 0.75`},italic:{ansi:[3,23],css:`font-style: italic`},underline:{ansi:[4,24],css:`text-decoration: underline`},overline:{ansi:[53,55],css:`text-decoration: overline`},inverse:{ansi:[7,27],css:`filter: invert(1)`},hidden:{ansi:[8,28],css:`visibility: hidden`},strikethrough:{ansi:[9,29],css:`text-decoration: line-through`},black:{ansi:[30,39],css:`color: ${A.black}`},red:{ansi:[31,39],css:`color: ${A.red}`},green:{ansi:[32,39],css:`color: ${A.green}`},yellow:{ansi:[33,39],css:`color: ${A.yellow}`},blue:{ansi:[34,39],css:`color: ${A.blue}`},magenta:{ansi:[35,39],css:`color: ${A.magenta}`},cyan:{ansi:[36,39],css:`color: ${A.cyan}`},white:{ansi:[37,39]},blackBright:{ansi:[90,39],css:`color: ${A.blackBright}`},redBright:{ansi:[91,39],css:`color: ${A.redBright}`},greenBright:{ansi:[92,39],css:`color: ${A.greenBright}`},yellowBright:{ansi:[93,39],css:`color: ${A.yellowBright}`},blueBright:{ansi:[94,39],css:`color: ${A.blueBright}`},magentaBright:{ansi:[95,39],css:`color: ${A.magentaBright}`},cyanBright:{ansi:[96,39],css:`color: ${A.cyanBright}`},whiteBright:{ansi:[97,39]},bgBlack:{ansi:[40,49],css:`background-color: ${A.black}`},bgRed:{ansi:[41,49],css:`background-color: ${A.red}`},bgGreen:{ansi:[42,49],css:`background-color: ${A.green}`},bgYellow:{ansi:[43,49],css:`background-color: ${A.yellow}`},bgBlue:{ansi:[44,49],css:`background-color: ${A.blue}`},bgMagenta:{ansi:[45,49],css:`background-color: ${A.magenta}`},bgCyan:{ansi:[46,49],css:`background-color: ${A.cyan}`},bgWhite:{ansi:[47,49],css:`background-color: ${A.white}`},bgBlackBright:{ansi:[100,49],css:`background-color: ${A.blackBright}`},bgRedBright:{ansi:[101,49],css:`background-color: ${A.redBright}`},bgGreenBright:{ansi:[102,49],css:`background-color: ${A.greenBright}`},bgYellowBright:{ansi:[103,49],css:`background-color: ${A.yellowBright}`},bgBlueBright:{ansi:[104,49],css:`background-color: ${A.blueBright}`},bgMagentaBright:{ansi:[105,49],css:`background-color: ${A.magentaBright}`},bgCyanBright:{ansi:[106,49],css:`background-color: ${A.cyanBright}`},bgWhiteBright:{ansi:[107,49],css:`background-color: ${A.whiteBright}`}},ts=Object.fromEntries(Object.entries(es).map(([e,t])=>[e,t.ansi])),ns=new Map(Object.values(es).filter(e=>e.css!=null&&e.ansi[0]!==e.ansi[1]).map(e=>[e.ansi[0],{css:e.css,close:e.ansi[1]}]))})))()}function formatTemplate(e,t,n,r=!1){let i=String(t),ansiColorWrap=(e,t)=>`\u001b[${t[0]}m${e}\u001b[${t[1]}m`,styleWrap=(e,t)=>t!=null&&typeof t==`string`?ansiColorWrap(e,ts[t]):t!=null&&Array.isArray(t)?t.reduce((e,t)=>styleWrap(e,t),e):t!=null&&t[e.trim()]!=null?styleWrap(e,t[e.trim()]):t!=null&&t[`*`]!=null?styleWrap(e,t[`*`]):e;return i.replace(/{{(.+?)}}/g,(t,i)=>{let a=n[i]==null?r?``:t:String(n[i]);return e.pretty.style?styleWrap(a,e.pretty.styles?.[i]??null)+ansiColorWrap(``,ts.reset):a})}function init_formatTemplate(){return(init_formatTemplate=__esmMin((()=>{init_styles()})))()}function buildPrettyMeta(e,t){if(t==null)return{text:``,template:e.pretty.template,placeholders:{}};let n=e.pretty.template,r={},i=t.date,a=i instanceof Date&&!Number.isNaN(i.getTime())?i:void 0,o;if(i!=null&&a===void 0){if(i instanceof Date)o=`Invalid Date`;else try{o=String(i)}catch{o=`Invalid Date`}}n.includes(`{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}`)?n=n.replace(`{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}`,`{{dateIsoStr}}`):a==null?(r.yyyy=`----`,r.mm=`--`,r.dd=`--`,r.hh=`--`,r.MM=`--`,r.ss=`--`,r.ms=`---`):e.pretty.timeZone===`UTC`?(r.yyyy=a.getUTCFullYear(),r.mm=formatNumberAddZeros(a.getUTCMonth(),2,1),r.dd=formatNumberAddZeros(a.getUTCDate(),2),r.hh=formatNumberAddZeros(a.getUTCHours(),2),r.MM=formatNumberAddZeros(a.getUTCMinutes(),2),r.ss=formatNumberAddZeros(a.getUTCSeconds(),2),r.ms=formatNumberAddZeros(a.getUTCMilliseconds(),3)):(r.yyyy=a.getFullYear(),r.mm=formatNumberAddZeros(a.getMonth(),2,1),r.dd=formatNumberAddZeros(a.getDate(),2),r.hh=formatNumberAddZeros(a.getHours(),2),r.MM=formatNumberAddZeros(a.getMinutes(),2),r.ss=formatNumberAddZeros(a.getSeconds(),2),r.ms=formatNumberAddZeros(a.getMilliseconds(),3));let s=e.pretty.timeZone===`UTC`,c=s?a:a==null?void 0:/* @__PURE__ */ new Date(a.getTime()-a.getTimezoneOffset()*6e4);r.rawIsoStr=c==null?o??``:s?c.toISOString():localIsoString(c,a),r.dateIsoStr=c?.toISOString().replace(`T`,` `).replace(`Z`,``)??o??``,r.logLevelName=t.logLevelName,r.fileNameWithLine=t.path?.fileNameWithLine??``,r.filePathWithLine=t.path?.filePathWithLine??``,r.fullFilePath=t.path?.fullFilePath??``;let l=e.parentNames?.join(e.pretty.errorParentNamesSeparator);l=l!=null&&t.name!=null?l+e.pretty.errorParentNamesSeparator:void 0;
/* v8 ignore next -- defensive: parentNamesString is only set when meta.name is also set (see line above), so the meta.name ?? "" fallback is unreachable */
let u=t.name!=null||l!=null?`${l??``}${t.name??``}`:``;return r.name=u,r.nameWithDelimiterPrefix=u.length>0?e.pretty.errorLoggerNameDelimiter+u:``,r.nameWithDelimiterSuffix=u.length>0?u+e.pretty.errorLoggerNameDelimiter:``,{text:formatTemplate(e,n,r),template:n,placeholders:r}}function localIsoString(e,t){let n=e.toISOString().replace(`Z`,``),r=-t.getTimezoneOffset(),i=r>=0?`+`:`-`,a=Math.abs(r);return`${n}${i}${String(Math.floor(a/60)).padStart(2,`0`)}:${String(a%60).padStart(2,`0`)}`}function init_metaFormatting(){return(init_metaFormatting=__esmMin((()=>{init_formatTemplate()})))()}function safeRead(e,t){try{return e[t]}catch{return}}function throwsOnRead(e,t){try{return Reflect.get(e,t),!1}catch{return!0}}function maxSegments(e){let t=0;for(let n of e)n.segments.length>t&&(t=n.segments.length);return t}function stringifyForHash(e){if(e===null)return`null`;if(e===void 0)return`undefined`;let t=typeof e;if(t===`string`)return e;if(t===`number`||t===`boolean`||t===`bigint`)return String(e);try{let t=/* @__PURE__ */ new WeakSet;return JSON.stringify(e,(e,n)=>{if(typeof n==`object`&&n){if(t.has(n))return`[Circular]`;t.add(n)}return typeof n==`bigint`?String(n):n})??String(e)}catch{return String(e)}}function fnv1aHex(e){let t=rs;for(let n=0;n<e.length;n++)t^=e.charCodeAt(n),t=Math.imul(t,is);return(t>>>0).toString(16).padStart(8,`0`)}var MaskingEngine,rs,is;function init_masking(){return(init_masking=__esmMin((()=>{MaskingEngine=class{settings;predicates;maskKeysCache;maskPathsCache;globalRegexCache=/* @__PURE__ */ new WeakMap;constructor(e,t){this.settings=e,this.predicates=t}mask(e){let t=this.settings.mask.keys!=null&&this.settings.mask.keys.length>0,n=this.settings.mask.regex!=null&&this.settings.mask.regex.length>0,r=this.getMaskPaths(),i=r.length>0;if(!t&&!n&&!i){for(let t=0;t<e.length;t++)if(e[t]instanceof URL)return e.map(e=>e instanceof URL?urlToObject(e):e);return e}let a=this.createContext(r);return e?.map(e=>this.recurse(e instanceof URL?urlToObject(e):e,a))}getMaskKeys(){let e=this.settings.mask.keys??[],t=e.map(String).join(`|`),n=this.settings.mask.caseInsensitive===!0;if(this.maskKeysCache?.source===e&&this.maskKeysCache.caseInsensitive===n&&this.maskKeysCache.signature===t)return this.maskKeysCache.normalized;let r=n?e.map(e=>typeof e==`string`?e.toLowerCase():String(e).toLowerCase()):e.map(e=>typeof e==`string`?e:String(e));return this.maskKeysCache={source:e,caseInsensitive:n,normalized:r,signature:t},r}recursiveCloneAndMaskValuesOfKeys(e,t,n){let r=this.getMaskPaths(),i={keySet:this.buildKeySet(t),escapedPlaceholder:this.escapePlaceholder(),seen:/* @__PURE__ */ new WeakMap,inProgress:r.length>0?/* @__PURE__ */ new WeakSet:void 0,inertClones:r.length>0?/* @__PURE__ */ new WeakSet:void 0,legacySeen:this.toLegacySeen(n),paths:r,maxPathDepth:maxSegments(r),regexes:this.normalizedRegexes(),segmentStack:[],pathsSuspended:0};return this.recurse(e,i)}buildKeySet(e){let t=/* @__PURE__ */ new Set;for(let n of e)t.add(typeof n==`string`?n:String(n));return t}toLegacySeen(e){if(e instanceof WeakSet)return e;if(!Array.isArray(e)||e.length===0)return;let t=/* @__PURE__ */ new WeakSet;for(let n of e)typeof n==`object`&&n&&t.add(n);return t}escapePlaceholder(){return(this.settings.mask.placeholder||``).replace(/\$/g,`$$$$`)}createContext(e){let t=this.getMaskKeys();return{keySet:this.buildKeySet(t),escapedPlaceholder:this.escapePlaceholder(),seen:/* @__PURE__ */ new WeakMap,inProgress:e.length>0?/* @__PURE__ */ new WeakSet:void 0,inertClones:e.length>0?/* @__PURE__ */ new WeakSet:void 0,paths:e,maxPathDepth:maxSegments(e),regexes:this.normalizedRegexes(),segmentStack:[],pathsSuspended:0}}normalizedRegexes(){let e=this.settings.mask.regex??[];return e.length===0?e:e.map(e=>this.toGlobalRegex(e))}isPathInert(e){return e.pathsSuspended>0||e.segmentStack.length>=e.maxPathDepth}getMaskPaths(){
/* v8 ignore next -- normalized settings always provide the mask group with a paths array; the fallbacks guard direct engine construction */
let e=this.settings.mask?.paths??[];if(e.length===0)return[];let t=e.join(`|`);if(this.maskPathsCache?.source===e&&this.maskPathsCache.signature===t)return this.maskPathsCache.compiled;let n=[];for(let t of e)typeof t==`string`&&t.length!==0&&n.push({segments:t.split(`.`)});return this.maskPathsCache={source:e,signature:t,compiled:n},n}matchesPath(e){if(e.pathsSuspended>0)return!1;let t=e.segmentStack;for(let n of e.paths){let e=n.segments;if(e.length!==t.length)continue;let r=!0;for(let n=0;n<e.length;n++){let i=e[n];if(i!==`*`&&i!==t[n]){r=!1;break}}if(r)return!0}return!1}censorValue(e,t){let n=this.settings.mask?.censor;return typeof n==`function`?n(e,t.segmentStack.join(`.`)):n===`hash`?this.hashToken(e):typeof n==`string`?n:this.settings.mask.placeholder}hashToken(e){return`[${this.settings.mask.hashLabel||`hash`}:${fnv1aHex(stringifyForHash(e))}]`}recurse(e,t){if(typeof e==`object`&&e){if(t.legacySeen?.has(e))return{...e};let n=t.seen.get(e);if(n!==void 0&&(t.inProgress==null||t.inProgress.has(e)||typeof n==`object`&&n&&t.inertClones?.has(n)&&this.isPathInert(t)))return n}if(this.predicates.isBuffer(e))return e;if(this.predicates.isError(e))return this.maskError(e,t);if(e instanceof Map){let n=/* @__PURE__ */ new Map;t.seen.set(e,n),t.inertClones?.add(n),t.inProgress?.add(e),t.pathsSuspended++;try{let r=this.settings.mask.caseInsensitive===!0;for(let[i,a]of e){let e=typeof i==`string`?r?i.toLowerCase():i:typeof i==`number`||typeof i==`bigint`?String(i):void 0;e!=null&&t.keySet.has(e)?n.set(i,this.settings.mask.censor===`hash`?this.hashToken(a):this.settings.mask.placeholder):n.set(this.recurse(i,t),this.recurse(a,t))}}finally{t.pathsSuspended--,t.inProgress?.delete(e)}return n}if(e instanceof Set){let n=/* @__PURE__ */ new Set;t.seen.set(e,n),t.inertClones?.add(n),t.inProgress?.add(e),t.pathsSuspended++;try{for(let r of e)n.add(this.recurse(r,t))}finally{t.pathsSuspended--,t.inProgress?.delete(e)}return n}if(Array.isArray(e)){let n=Array(e.length);t.seen.set(e,n),t.inertClones!=null&&this.isPathInert(t)&&t.inertClones.add(n),t.inProgress?.add(e);let r=t.paths.length>0;try{for(let i=0;i<e.length;i++){if(!(i in e))continue;let a=e[i];if(!r){n[i]=this.recurse(a,t);continue}t.segmentStack.push(String(i));try{n[i]=this.matchesPath(t)?this.censorValue(a,t):this.recurse(a,t)}finally{t.segmentStack.pop()}}}finally{t.inProgress?.delete(e)}return n}if(e instanceof Date)return new Date(e.getTime());if(e instanceof URL)return e;if(typeof e==`object`&&e){let n=this.settings.mask.caseInsensitive===!0,r=t.paths.length>0,i=this.settings.mask.censor===`remove`,a=Object.create(Object.getPrototypeOf(e));t.seen.set(e,a),t.inertClones!=null&&this.isPathInert(t)&&t.inertClones.add(a),t.inProgress?.add(e);try{return Object.getOwnPropertyNames(e).reduce((a,o)=>{let s=n?typeof o==`string`?o.toLowerCase():String(o).toLowerCase():o;if(t.keySet.has(s)){if(this.settings.mask.censor===`hash`){let t;try{t=e[o]}catch{t=void 0}a[o]=this.hashToken(t)}else a[o]=this.settings.mask.placeholder;return a}if(r){t.segmentStack.push(o);try{if(this.matchesPath(t)){if(!i){let n;try{n=e[o]}catch{n=void 0}a[o]=this.censorValue(n,t)}return a}a[o]=this.recurseProperty(e,o,t)}finally{t.segmentStack.pop()}return a}return a[o]=this.recurseProperty(e,o,t),a},a)}finally{t.inProgress?.delete(e)}}else return typeof e==`string`?this.maskString(e,t):e}maskString(e,t){let n=e;for(let e of t.regexes)n=n.replace(e,t.escapedPlaceholder);return n}toGlobalRegex(e){if(e.global&&!e.sticky)return e;let t=this.globalRegexCache.get(e);return t??(t=new RegExp(e.source,`${e.flags.replace(/[gy]/g,``)}g`),this.globalRegexCache.set(e,t)),t}recurseProperty(e,t,n){try{return this.recurse(e[t],n)}catch{return null}}maskError(e,t){let n=Object.getPrototypeOf(e),r=e instanceof Error||Object.prototype.toString.call(e)===`[object Error]`?Object.setPrototypeOf(Object.defineProperty(/* @__PURE__ */ Error(),"stack",{value:void 0,writable:!0,configurable:!0}),n):Object.create(n);t.seen.set(e,r),t.inertClones!=null&&this.isPathInert(t)&&t.inertClones.add(r),t.inProgress?.add(e);try{let n=this.settings.mask.caseInsensitive===!0,i=t.paths.length>0,a=/* @__PURE__ */ new Set([...Object.getOwnPropertyNames(e),`stack`]);for(let e of[`name`,`message`])!a.has(e)&&throwsOnRead(r,e)&&a.add(e);for(let o of a){let a=o===`name`||o===`message`||o===`stack`,s=Object.getOwnPropertyDescriptor(e,o),c,l=!1;if(!a&&t.keySet.has(n?o.toLowerCase():o))c=this.settings.mask.censor===`hash`?this.hashToken(safeRead(e,o)):this.settings.mask.placeholder;else{i&&t.segmentStack.push(o);try{if(i&&this.matchesPath(t))l=this.settings.mask.censor===`remove`,c=l?void 0:this.censorValue(safeRead(e,o),t);else if(o===`stack`){let n=safeRead(e,`stack`);c=typeof n==`string`?this.maskStackHeader(n,safeRead(e,`message`),t):n}else c=this.recurseProperty(e,o,t)}finally{i&&t.segmentStack.pop()}}l&&o!==`stack`||Object.defineProperty(r,o,{value:c,enumerable:s?.enumerable===!0,writable:!0,configurable:!0})}}finally{t.inProgress?.delete(e)}return r}maskStackHeader(e,t,n){let r=e.indexOf(`
    at `);if(typeof t==`string`&&t.length>0){let n=e.indexOf(t),i=e.indexOf(`
`);if(n!==-1&&(i===-1||n<i)){let i=e.indexOf(`
    at `,n+t.length);r=i===-1?e.length:i}}return r===-1?e:this.maskString(e.slice(0,r),n)+e.slice(r)}},rs=2166136261,is=16777619})))()}var as;function init_features_full(){return(init_features_full=__esmMin((()=>{init_metaFormatting(),init_json(),init_masking(),init_settings(),as={createMaskingEngine(e,t){return new MaskingEngine(e,t)},renderJson(e,t){return renderJson(e,t)},validateSettings(e){validateSettingsParam(e)},buildPrettyMetaText(e,t){return buildPrettyMeta(e,t).text}}})))()}function settingsFromEnv(e){let t={},n=safeEnvGet(`TSLOG_LEVEL`);if(n!=null&&n!==``){let e=Number(n);t.minLevel=Number.isNaN(e)?n:e}let r=safeEnvGet(`TSLOG_TYPE`);(r===`json`||r===`pretty`||r===`hidden`)&&(t.type=r);let i=safeEnvGet(`TSLOG_NAME`);return i!=null&&i!==``&&(t.name=i),{...t,...e}}function init_fromEnv(){return(init_fromEnv=__esmMin((()=>{})))()}function defineLazyPath(e,t,n,r,i){Object.defineProperty(e,"path",{configurable:!0,enumerable:!0,get(){let a=i.resolveCallerStackFrame(t,n,r);return Object.defineProperty(e,"path",{configurable:!0,enumerable:!0,writable:!0,value:a}),a}})}function buildMeta(e,t,n,r,i,a,o,s,c){let l=Object.assign({},e,{date:/* @__PURE__ */ new Date,logLevelId:t,logLevelName:n});return a!==void 0&&(l.name=a),o!==void 0&&(l.parentNames=o),i||defineLazyPath(l,/* @__PURE__ */ Error(),r,s,c),l}function jsonStringifyRecursive(e){let t=/* @__PURE__ */ new Set;return JSON.stringify(e,(e,n)=>{if(typeof n==`object`&&n){if(t.has(n))return`[Circular]`;t.add(n)}return typeof n==`bigint`?`${n}`:n===void 0?`[undefined]`:n})}function shouldCaptureHostname(e){return e===`node`||e===`deno`||e===`bun`}function shouldCaptureRuntimeVersion(e){return e===`node`||e===`deno`||e===`bun`}function detectRuntimeInfo(){if(isBrowserEnvironment())return{name:`browser`,userAgent:globalThis.navigator?.userAgent};let e=globalThis;if(e.navigator?.product===`ReactNative`)return{name:`react-native`,version:resolveHermesVersion()};if(typeof e.importScripts==`function`)return{name:`worker`,userAgent:e.navigator?.userAgent};let t=globalThis;if(t.Bun!=null){let e=t.Bun.version;return{name:`bun`,version:e==null?void 0:`bun/${e}`,hostname:getEnvironmentHostname(t.process,t.Deno,t.Bun,t.location)}}if(t.Deno!=null){let e=t.Deno?.version?.deno;return{name:`deno`,version:e==null?void 0:`deno/${e}`,hostname:getEnvironmentHostname(t.process,t.Deno,t.Bun,t.location)}}return t.process?.versions?.node!=null||t.process?.version!=null?{name:`node`,version:t.process?.versions?.node??t.process?.version,hostname:getEnvironmentHostname(t.process,t.Deno,t.Bun,t.location)}:t.process==null?{name:`unknown`}:{name:`node`,version:`unknown`,hostname:getEnvironmentHostname(t.process,t.Deno,t.Bun,t.location)}}function resolveHermesVersion(){try{let e=globalThis.HermesInternal?.getRuntimeProperties?.()?.[`OSS Release Version`];return typeof e==`string`&&e.length>0?`hermes/${e}`:void 0}catch{return}}function createRuntimeMeta(e){if(e.name===`browser`||e.name===`worker`)return{runtime:e.name,browser:e.userAgent};if(e.name===`react-native`){let t={runtime:e.name};return e.version!==void 0&&(t.runtimeVersion=e.version),t}let t={runtime:e.name};return shouldCaptureRuntimeVersion(e.name)&&(t.runtimeVersion=e.version??`unknown`),shouldCaptureHostname(e.name)&&(t.hostname=e.hostname??`unknown`),t}function getEnvironmentHostname(e,t,n,r){try{let t=e?.env?.HOSTNAME??e?.env?.HOST??e?.env?.COMPUTERNAME;if(t!=null&&t.length>0)return t}catch{}try{let e=n?.env?.HOSTNAME??n?.env?.HOST??n?.env?.COMPUTERNAME;if(e!=null&&e.length>0)return e}catch{}try{let e=t?.env?.get;if(typeof e==`function`){let t=e(`HOSTNAME`);if(t!=null&&t.length>0)return t}}catch{}try{if(typeof t?.hostname==`function`){let e=t.hostname();if(e!=null&&e.length>0)return e}}catch{}try{if(typeof e?.getBuiltinModule==`function`){let t=e.getBuiltinModule(`node:os`);if(typeof t?.hostname==`function`){let e=t.hostname();if(e!=null&&e.length>0)return e}}}catch{}if(r?.hostname!=null&&r.hostname.length>0)return r.hostname}function isBrowserEnvironment(){return typeof window<`u`&&typeof document<`u`}function isNativeError(e){if(e instanceof Error)return!0;if(typeof e==`object`&&e){let t=Object.prototype.toString.call(e);if(/\[object .*Error\]/.test(t))return!0;let n=e.name;if(typeof n==`string`&&n.endsWith(`Error`))return!0}return!1}function parseServerStackLine(e,t,n){if(typeof e!=`string`||e.length===0)return;let r=e.trim();if(!r.includes(` at `)&&!r.startsWith(`at `))return;let i=r.replace(/^at\s+/,``),a,o=i,s=i.match(/^(.*?)\s+\((.*)\)$/);s&&(a=s[1],o=s[2]);let c=o.replace(/^\(/,``).replace(/\)$/,``),l=c.replace(/^address at /,``),u,d,f=l,p=l.split(`:`);p.length>=3&&/^\d+$/.test(p[p.length-1])?(d=p.pop(),u=p.pop(),f=p.join(`:`)):p.length>=2&&/^\d+$/.test(p[p.length-1])&&(u=p.pop(),f=p.join(`:`)),f=f.replace(/\?.*$/,``);let m=f.replace(/^file:\/\//,``),h;if(n!=null&&u!=null){let e=n(m,Number(u),d==null?1:Number(d));e!=null&&(m=e.source,h=e.source,u=String(e.line),d=String(e.column))}let g=t();g!=null&&m.startsWith(g)&&(m=m.slice(g.length),m=m.replace(/^[\\/]/,``)),m.length===0&&(m=f);let v=normalizeFilePath(m),y=v.length>0?v:m,b=y.split(/\\|\//),x=b[b.length-1],ee=x&&u?`${x}:${u}`:void 0,S=y&&u?`${y}:${u}`:void 0;return{fullFilePath:h==null?c:`${h}:${u}:${d}`,fileName:x,fileNameWithLine:ee,fileColumn:d,fileLine:u,filePath:y,filePathWithLine:S,method:a}}function parseBrowserStackLine(e){let t=globalThis.location?.origin;if(e==null)return;let n=e.replace(ss,``).match(os);if(!n)return;let r=n[1]?.replace(/\?.*$/,``);
/* v8 ignore next 3 -- defensive: the regex requires capture group 1 to match, so filePath is never null here */
if(r==null)return;let i=r.split(`/`),a=n[2],o=n[3],s=i[i.length-1],c=e.match(/(?:https?|file):\/\/[^\s)]+/),l;return l=c==null?t?`${t}${r}`:r:c[0].replace(/(?::\d+){1,2}$/,``).replace(/\?.*$/,``),{fullFilePath:l,fileName:s,fileNameWithLine:s&&a?`${s}:${a}`:void 0,fileColumn:o,fileLine:a,filePath:r,filePathWithLine:a?`${r}:${a}`:void 0,method:void 0}}function detectOwnBrowserFilePattern(e=/* @__PURE__ */ Error()){for(let t of getCleanStackLines(e)){let e=parseBrowserStackLine(t)?.fullFilePath;if(e)return RegExp(`^${e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}$`,`i`)}}function parseReactNativeStackLine(e,t){if(typeof e!=`string`||e.length===0)return;let n=parseServerStackLine(e,t);if(n!==void 0)return n;let r=e.match(cs);if(r){let e=r[1]!=null&&r[1].length>0?r[1]:void 0,t=r[2].replace(/\?.*$/,``),n=r[3],i=r[4];if(t.length>0&&!t.includes(`[native`)){let a=t.split(`/`),o=a[a.length-1];return{fullFilePath:r[2],fileName:o,fileNameWithLine:o?`${o}:${n}`:void 0,fileColumn:i,fileLine:n,filePath:t,filePathWithLine:`${t}:${n}`,method:e}}}return parseBrowserStackLine(e)}function normalizeFilePath(e){if(typeof e!=`string`||e.length===0)return e;let t=e.replace(/\\+/g,`\\`).replace(/\\/g,`/`),n=t.startsWith(`//`),r=t.startsWith(`/`)&&!n,i=t.match(/^[A-Za-z]:/),a=i?i[0]:``,o=(a?t.slice(a.length):t).split(`/`),s=[];for(let e of o)if(e!==``&&e!==`.`){if(e===`..`){s.length>0&&s.pop();continue}s.push(e)}let c=s.join(`/`);return n?c=`//${c}`:r?c=`/${c}`:a!==``&&(c=`${a}${c.length>0?`/${c}`:``}`),c.length===0?e:c}function formatStackFrames(e,t){return e.map(e=>formatTemplate(t,t.pretty.errorStackTemplate,{...e},!0))}function formatErrorMessage(e){return Object.getOwnPropertyNames(e).filter(e=>e!==`stack`&&e!==`cause`&&e!==`name`&&!ls.has(e)).reduce((t,n)=>{try{let r=e[n];if(typeof r==`function`)return t;t.push(stringifyFallback(r))}catch{}return t},[]).join(`, `)}function stringifyFallback(e){if(typeof e==`string`)return e;try{return JSON.stringify(e)}catch{return String(e)}}function stripAnsi(e){return e.replace(us,``)}function getPrettyLogMethod(e,t){return e&&t?.[e]?t[e]:t?.[`*`]?t[`*`]:nativeConsoleMethod(`log`)}var os,ss,cs,ls,us;function init_shared(){return(init_shared=__esmMin((()=>{init_formatTemplate(),init_nativeConsole(),init_stackTrace(),os=/(?:(?:file|https?|global code|[^@]+)@)?(?:file:)?((?:\/[^:/]+(?::(?=\/))?)+)(?::(\d+))?(?::(\d+))?/,ss=/[a-z][a-z0-9+.-]*:\/\/[^/\s)]*/i,cs=/^\s*(?:([^@\s]*)@)?(.+?):(\d+):(\d+)\s*$/,ls=/* @__PURE__ */ new Set([`fileName`,`lineNumber`,`columnNumber`,`line`,`column`,`sourceURL`]),us=/\u001b\[[0-9;]*m/g})))()}function createProviderBase(e){let{runtimeInfo:t}=e,n=createRuntimeMeta(t),r=e.flavor===`adaptive`,i=r&&(t.name===`browser`||t.name===`worker`),a=r&&t.name===`react-native`,o=i||a?[...getDefaultIgnorePatterns(),/node_modules[\\/].*tslog/i]:[...getDefaultIgnorePatterns(),/node:(?:internal|vm)/i,/\binternal[\\/]/i];if(i){let e=detectOwnBrowserFilePattern();e!=null&&o.push(e)}let s;function getWorkingDirectory(){return s===void 0&&(s=safeGetCwd()??null),s??void 0}function parseStackLine(t){return a?parseReactNativeStackLine(t,getWorkingDirectory):i?parseBrowserStackLine(t):parseServerStackLine(t,getWorkingDirectory,e.resolveSourceMap)}function formatWithOptionsSafe(t,n){try{return e.getFormatWithOptions()(t,...n)}catch{return n.map(stringifyFallback).join(` `)}}function resolveCallerStackFrame(e,t,n){let r=buildStackTrace(e,parseStackLine);if(r.length===0)return{};let i=findFirstExternalFrameIndex(r,n!=null&&n.length>0?[...o,...n]:o);
/* v8 ignore next -- defensive: clampIndex always yields a valid index for a non-empty frames array */
return r[clampIndex(Number.isFinite(t)&&t>=0?t:i,r.length)]??{}}let c={getCallerStackFrame(e,t=/* @__PURE__ */ Error(),n){return resolveCallerStackFrame(t,e,n)},getErrorTrace(e){return buildStackTrace(e,parseStackLine)},isError(e){return isNativeError(e)},isBuffer(e){return typeof Buffer<`u`&&typeof Buffer.isBuffer==`function`&&Buffer.isBuffer(e)},prettyFormatLogObj(e,t){return e.reduce((e,n)=>(c.isError(n)?e.errors.push(c.prettyFormatErrorObj(n,t)):e.args.push(n),e),{args:[],errors:[]})},prettyFormatErrorObj(e,t){let n=formatStackFrames(c.getErrorTrace(e),t),r=collectErrorCauses(e).map((e,n)=>{let r=safeErrorString(e,`message`,``);return[`Caused by (${n+1}): ${safeErrorString(e,`name`,`Error`)}${r?`: ${r}`:``}`,...formatStackFrames(buildStackTrace(e,parseStackLine),t)].join(`
`)}),i={errorName:` ${safeErrorString(e,`name`,`Error`)} `,errorMessage:formatErrorMessage(e),errorStack:[...n,...r].join(`
`)};return formatTemplate(t,t.pretty.errorTemplate,i)},prettyFormatLine(e,t,n){let r=n.pretty.style!==!1,{args:i,errors:a}=c.prettyFormatLogObj(e,n),o=buildPrettyMeta(n,t).text,s=(a.length>0&&i.length>0?`
`:``)+a.join(`
`),l=r?o:stripAnsi(o);return n.pretty.inspectOptions.colors=r,l+formatWithOptionsSafe(n.pretty.inspectOptions,i)+s},transportFormatted(e,t,n,r,a){let o=a.pretty.style!==!1,s=a.pretty.passObjectsNatively,c=(n.length>0&&t.length>0?`
`:``)+n.join(`
`),l=getPrettyLogMethod(r?.logLevelName,a.pretty.levelMethod);if(o&&i&&consoleSupportsCssStyling()){let n=stripAnsi(e);a.pretty.inspectOptions.colors=!1;let i=s?``:formatWithOptionsSafe(a.pretty.inspectOptions,t),o=r==null?{text:n,styles:[]}:buildCssMetaOutput(a,r),u=o.text.length>0&&o.styles.length>0,d=u?o.text:n,f=!s||t.length===0,p=f&&c.length>0?ansiToCssConsoleFormat(c):{text:``,styles:[]},m=d+i+p.text,h=[...u?o.styles:[],...p.styles],g=s?[...t,...!f&&c.length>0?[stripAnsi(c)]:[]]:[];h.length>0?l(m,...h,...g):l(m,...g);return}a.pretty.inspectOptions.colors=o;let u=o?e:stripAnsi(e);if(s){l(u,...t,...c?[c]:[]);return}l(u+formatWithOptionsSafe(a.pretty.inspectOptions,t)+c)},transportJSON(e){nativeConsoleMethod(`log`)(jsonStringifyRecursive(e))}};function buildEagerMeta(e,t,r,i,a,o,s){let l=Object.assign({},n,{date:/* @__PURE__ */ new Date,logLevelId:e,logLevelName:t});return i!=null&&(l.path=c.getCallerStackFrame(r,i,s)),a!==void 0&&(l.name=a),o!==void 0&&(l.parentNames=o),l}return{methods:c,staticMeta:n,resolveCallerStackFrame,buildEagerMeta}}function buildCssMetaOutput(e,t){
/* v8 ignore next 3 -- defensive: the sole caller only invokes this when logMeta is non-null */
if(t==null)return{text:``,styles:[]};let{template:n,placeholders:r}=buildPrettyMeta(e,t),i=[],a=[],o=0,s=/{{(.+?)}}/g,c;for(;(c=s.exec(n))!=null;){c.index>o&&i.push(n.slice(o,c.index));let t=c[1],l=r[t]==null?``:String(r[t]),u=tokensToCss(collectStyleTokens(e.pretty.styles?.[t],l));u.length>0?(i.push(`%c${l}%c`),a.push(u,``)):i.push(l),o=s.lastIndex}return o<n.length&&i.push(n.slice(o)),{text:i.join(``),styles:a}}function collectStyleTokens(e,t){if(e==null)return[];if(typeof e==`string`)return[e];if(Array.isArray(e))return e.flatMap(e=>collectStyleTokens(e,t));if(typeof e==`object`){let n=e[t.trim()]??e[`*`];return n==null?[]:collectStyleTokens(n,t)}return[]}function tokensToCss(e){let t=/* @__PURE__ */ new Set,n=[];for(let r of e){let e=styleTokenToCss(r);e!=null&&e.length>0&&!t.has(e)&&(t.add(e),n.push(e))}return n.join(`; `)}function init_providerBase(){return(init_providerBase=__esmMin((()=>{init_formatTemplate(),init_errorUtils(),init_metaFormatting(),init_nativeConsole(),init_styles(),init_shared(),init_stackTrace()})))()}function decodeVlq(e){let t=[],n=0,r=0;for(let i=0;i<e.length;i+=1){let a=e[i],o=ds[a];if(o==null)continue;let s=o&32,c=o&31;if(r+=c<<n,s){n+=5;continue}let l=r&1;r>>=1,t.push(l?-r:r),r=0,n=0}return t}function parseMappings(e){let t=/* @__PURE__ */ new Map,n=e.split(`;`),r=0,i=0,a=0;for(let e=0;e<n.length;e+=1){let o=0,s=n[e];if(s.length===0)continue;let c=[];for(let t of s.split(`,`)){if(t.length===0)continue;let n=decodeVlq(t);n.length<4||(o+=n[0],r+=n[1],i+=n[2],a+=n[3],c.push({genLine:e,genColumn:o,sourceIndex:r,origLine:i,origColumn:a}))}c.length>0&&(c.sort((e,t)=>e.genColumn-t.genColumn),t.set(e,c))}return t}function requireNodeModule(e){let n=typeof process<`u`?process.getBuiltinModule:void 0;if(typeof n==`function`)try{let t=n(e);
/* v8 ignore else -- defensive: the sole caller asks for "node:fs", which every runtime implementing getBuiltinModule resolves; the fall-through only guards the generic signature */
if(t!=null)return t}catch{}
/* v8 ignore next 6 -- reachable only on runtimes without getBuiltinModule (Node 22.0-22.2); the test runners are newer */
try{return t(import.meta.url)(e)}catch{return}}function getFs(){return ps||(ps=!0,fs=requireNodeModule(`node:fs`)),fs}function dirnameOf(e){let t=Math.max(e.lastIndexOf(`/`),e.lastIndexOf(`\\`));return t===-1?`.`:e.slice(0,t)}function joinPath(e,t){return/^([A-Za-z]:)?[/\\]/.test(t)?t:`${e.replace(/[/\\]+$/,``)}/${t}`}function extractSourceMappingUrl(e){let t=e.match(/\/[*/]#\s*sourceMappingURL=([^\s*]+)\s*(?:\*\/)?\s*$/gm);if(t!=null&&t.length!==0)return t[t.length-1].match(/sourceMappingURL=([^\s*]+)/)?.[1]}function loadRawSourceMap(e,t){let n;try{n=t.readFileSync(e,`utf8`)}catch{return}let r=extractSourceMappingUrl(n);if(r!=null)try{if(r.startsWith(`data:`)){let t=r.indexOf(`base64,`);if(t===-1)return;let n=Buffer.from(r.slice(t+7),`base64`).toString(`utf8`);return{raw:JSON.parse(n),mapDir:dirnameOf(e)}}let n=r;try{n=decodeURIComponent(r)}catch{}let i=joinPath(dirnameOf(e),n);return!t.existsSync(i)&&n!==r&&(i=joinPath(dirnameOf(e),r)),t.existsSync(i)?{raw:JSON.parse(t.readFileSync(i,`utf8`)),mapDir:dirnameOf(i)}:void 0}catch{return}}function getParsedSourceMap(e){let t=hs.get(e);if(t!==void 0)return t??void 0;if(hs.size>=ms){let[e]=hs.keys();hs.delete(e)}let n=getFs();
/* v8 ignore next 4 -- defensive: node:fs is always resolvable on Node/Bun/Deno, the only runtimes this resolver is wired into */
if(n==null){hs.set(e,null);return}let r;try{let t=loadRawSourceMap(e,n);r=t==null?void 0:parseRawMap(t.raw,t.mapDir,n)}catch{r=void 0}return hs.set(e,r??null),r}function parseRawMap(e,t,n,r=0){if(e.sections&&e.sections.length>0){
/* v8 ignore next -- defensive: the spec forbids nested index maps, so real-world depth never exceeds 1 */
if(r>=gs)return;let i=[];for(let a of e.sections){let e=a.offset?.line??0,o=a.offset?.column??0,s=a.map,c=t;if(s==null&&a.url!=null)try{let e=joinPath(t,a.url);n.existsSync(e)&&(s=JSON.parse(n.readFileSync(e,`utf8`)),c=dirnameOf(e))}catch{}i.push({offsetLine:e,offsetColumn:o,map:s==null?void 0:parseRawMap(s,c,n,r+1)})}return{kind:`sectioned`,sections:i}}if(e.mappings&&e.sources&&e.sources.length>0)return{kind:`flat`,sources:e.sources,sourceRoot:e.sourceRoot??``,mapDir:t,segmentsByLine:parseMappings(e.mappings)}}function resolveInParsedMap(e,t,n){if(e.kind===`flat`){let r=e.segmentsByLine.get(t);if(r==null||r.length===0)return;let i=findSegment(r,n)??r[0],a=e.sources[i.sourceIndex];return a==null?void 0:{source:resolveSourcePath(a,e.sourceRoot,e.mapDir),line:i.origLine+1,column:i.origColumn+1}}let r;for(let i of e.sections)if(t>i.offsetLine||t===i.offsetLine&&n>=i.offsetColumn)r=i;else break;if(r?.map==null)return;let i=t-r.offsetLine,a=t===r.offsetLine?Math.max(0,n-r.offsetColumn):n;return resolveInParsedMap(r.map,i,a)}function resolveSourcePath(e,t,n){let r=t.length>0?joinPath(t,e):e;if(r.startsWith(`file://`)){let e=normalizeFilePath(r.replace(/^file:\/\//,``));return e.length>0?e:r}let i=r.match(/^\[[^\]]+\]\/(.+)$/);if(i?.[1]){let e=normalizeFilePath(i[1]);
/* v8 ignore next -- defensive: `(.+)` guarantees a non-empty tail; normalizeFilePath collapses to empty only for degenerate inputs like "./" */
return e.length>0?e:r}let a=r.match(_s);if(a!=null){let e=r.slice(a[0].length),t=e.indexOf(`/`),n=normalizeFilePath(t===-1?e:e.slice(t+1));return n.length>0?n:r}return/^([A-Za-z]:)?[/\\]/.test(r)?r:normalizeFilePath(joinPath(n,r))}function findSegment(e,t){let n=0,r=e.length-1,i;for(;n<=r;){let a=n+r>>1,o=e[a];o.genColumn<=t?(i=o,n=a+1):r=a-1}return i}function resolveOriginalPosition(e,t,n){if(!Number.isFinite(t)||t<1)return;let r=getParsedSourceMap(e);if(r==null)return;let i=Number.isFinite(n)&&n>=1?n-1:0;return resolveInParsedMap(r,t-1,i)}function sourceMapResolutionEnabled(){let e=safeEnvGet(`TSLOG_SOURCE_MAPS`);return e==null?devWarningsEnabled():e!==`off`&&e!==`false`&&e!==`0`}function createSourceMapResolver(){return(e,t,n)=>{if(sourceMapResolutionEnabled())return resolveOriginalPosition(e,t,n)}}var ds,fs,ps,ms,hs,gs,_s;function init_sourceMap_node(){return(init_sourceMap_node=__esmMin((()=>{init_settings(),init_shared(),ds=Object.fromEntries([...`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`].map((e,t)=>[e,t])),ps=!1,ms=256,hs=/* @__PURE__ */ new Map,gs=2,_s=/^[a-z][a-z0-9+.-]*:\/\//i})))()}function runSyncDrains(){for(let e of vs)try{e.drainSync?.()}catch{}}function runAsyncFlushes(){if(!bs){bs=!0;for(let e of vs)try{let t=e.flushAsync?.();t!=null&&typeof t.catch==`function`&&t.catch(()=>void 0)}catch{}}}function installOnce(){if(!ys){ys=!0;try{let e=globalThis.process;if(typeof e?.on==`function`){e.on(`beforeExit`,runAsyncFlushes),e.on(`exit`,runSyncDrains);return}}catch{}try{let e=globalThis;typeof e.addEventListener==`function`&&e.document!=null&&e.addEventListener(`pagehide`,()=>{runSyncDrains(),runAsyncFlushes()})}catch{}}}function registerExitHook(e){return installOnce(),vs.add(e),()=>{vs.delete(e)}}var vs,ys,bs;function init_exitHooks(){return(init_exitHooks=__esmMin((()=>{vs=/* @__PURE__ */ new Set,ys=!1,bs=!1})))()}function createStdoutJsonSink(){let e=[],n=0,r=!1,i=0,a=[],o=/* @__PURE__ */ new WeakSet,s;function settleWaiters(){if(i===0&&a.length>0){let e=a;a=[];for(let t of e)t()}}function currentStdout(){return globalThis.process?.stdout}function writeChunk(e){let t=currentStdout();if(t!=null&&typeof t.write==`function`){if(typeof t.on==`function`&&!o.has(t)){o.add(t);try{t.on(`error`,()=>void 0)}catch{}}let n=!1,settle=()=>{n||(n=!0,i--,settleWaiters())};i++;try{t.write(e,settle)!==!1&&settle();return}catch{settle()}}try{
/* v8 ignore next -- the `: chunk` arm is unreachable: every writeChunk caller passes a newline-terminated chunk; the branch defends future callers */
nativeConsoleMethod(`log`)(e.endsWith(`
`)?e.slice(0,-1):e)}catch{}}function flushNow(){if(e.length===0)return;let t=`${e.join(`
`)}\n`;e.length=0,n=0,writeChunk(t)}function drainSync(){if(e.length===0)return;if(s===void 0)try{let e=t(import.meta.url)(`node:fs`);s=typeof e.writeSync==`function`?e.writeSync:null}catch{
/* v8 ignore next -- defensive: node:fs is always resolvable on Node; covers exotic loaders */
s=null}let r=`${e.join(`
`)}\n`;if(e.length=0,n=0,s!=null&&typeof Buffer<`u`){let e=Buffer.from(r,`utf8`),t=currentStdout()?.fd??1,n=0;try{for(;n<e.length;){let r=s(t,e.subarray(n));if(!(r>0))break;n+=r}}catch{}if(n>=e.length)return;writeChunk(e.subarray(n).toString(`utf8`));return}writeChunk(r)}registerExitHook({drainSync,flushAsync:()=>c.flush()});let c={write(t){if(e.push(t),n+=t.length+1,n>=xs){flushNow();return}r||(r=!0,queueMicrotask(()=>{r=!1,flushNow()}))},flush(){return flushNow(),i===0?Promise.resolve():new Promise(e=>{a.push(e)})},flushSync(){flushNow()}};return c}function getStdoutJsonSink(){return Ss===void 0&&(Ss=createStdoutJsonSink()),Ss}var xs,Ss;function init_stdoutSink_node(){return(init_stdoutSink_node=__esmMin((()=>{init_exitHooks(),init_nativeConsole(),xs=8192})))()}function createNodeEnvironment(){let e=createProviderBase({runtimeInfo:detectRuntimeInfo(),flavor:`server`,getFormatWithOptions:()=>r,resolveSourceMap:createSourceMapResolver()}),n={resolveCallerStackFrame:e.resolveCallerStackFrame};return{...e.methods,getMeta(t,r,i,a,o,s,c){return buildMeta(e.staticMeta,t,r,i,a,o,s,c,n)},writeJsonLine(e){getStdoutJsonSink().write(e)},flushJsonSink(){return getStdoutJsonSink().flush()},createAsyncContextStore(){try{let{AsyncLocalStorage:e}=t(import.meta.url)(`node:async_hooks`);return createAsyncContextStore(e)}catch{
/* v8 ignore next -- defensive: node:async_hooks is always resolvable on Node; the probe fallback covers exotic loaders */
return createAsyncContextStore()}}}}function init_environment_node(){return(init_environment_node=__esmMin((()=>{init_asyncContext(),init_providerBase(),init_shared(),init_sourceMap_node(),init_stdoutSink_node()})))()}function getNodeEnvironment(){return Cs??=createNodeEnvironment(),Cs}var Cs,ws;function init_index_node(){return(init_index_node=__esmMin((()=>{init_BaseLogger(),init_features_full(),init_fromEnv(),init_environment_node(),init_interfaces(),ws=class Logger extends BaseLogger{constructor(e,t){super(e,t,getNodeEnvironment(),NaN,as)}log(e,t,...n){return super.log(e,t,...n)}silly(...e){return super.log(Zo.SILLY,`SILLY`,...e)}trace(...e){return super.log(Zo.TRACE,`TRACE`,...e)}debug(...e){return super.log(Zo.DEBUG,`DEBUG`,...e)}info(...e){return super.log(Zo.INFO,`INFO`,...e)}warn(...e){return super.log(Zo.WARN,`WARN`,...e)}error(...e){return super.log(Zo.ERROR,`ERROR`,...e)}fatal(...e){return super.log(Zo.FATAL,`FATAL`,...e)}getSubLogger(e,t){return super.getSubLogger(e,t)}child(e,t){return super.getSubLogger(e,t)}static fromEnv(e){return new Logger(settingsFromEnv(e))}}})))()}function loadResolveSecureTempRoot(){if(Es)return Es;let e=getSealedRuntimeSecureTempRoot();if(e)return Es=e,e;throw Error(`sealed temp-root runtime was not registered before use`)}function resolvePreferredOpenClawTmpDir(e={}){return loadResolveSecureTempRoot()({...e,preferredDir:e.preferredDir??`/tmp/openclaw`,fallbackPrefix:`openclaw`,warningPrefix:`[openclaw]`,unsafeFallbackLabel:`OpenClaw temp dir`,skipPreferredOnWindows:!0})}var Ts,Es;function init_tmp_openclaw_dir(){return(init_tmp_openclaw_dir=__esmMin((()=>{init_sealed_runtime_registry(),Ts=`/tmp/openclaw`})))()}function canUseNodeFs(){try{return process.getBuiltinModule?.(`fs`)!==void 0}catch{return!1}}function formatLocalDate(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}var Ds,Os;function init_log_file_shared(){return(init_log_file_shared=__esmMin((()=>{Ds=`openclaw`,Os=`.log`})))()}function encodeLogProfileSegment(e){let t=``;for(let n of e)/^[a-z0-9]$/u.test(n)?t+=n:n===`-`?t+=`--`:n===`_`?t+=`-0`:/^[A-Z]$/u.test(n)?t+=`-1${n.toLowerCase()}`:t+=`-2${n.codePointAt(0)?.toString(16)??`0`}-`;return t}function resolveLogProfileSegment(e){let t=e.OPENCLAW_PROFILE?.trim();if(!t||t.toLowerCase()==="default")return null;let n=encodeLogProfileSegment(t);return n.length<=As?n:`-3${ne(`sha256`).update(t).digest(`hex`)}`}function resolveDefaultRollingLogFile(e){let t=e?.date??/* @__PURE__ */ new Date,n=e?.env??process.env,r=e?.logDir??(canUseNodeFs()?resolvePreferredOpenClawTmpDir():`/tmp/openclaw`),i=resolveLogProfileSegment(n),a=i?`-${i}`:``;return w.join(r,`${Ds}${a}-${formatLocalDate(t)}${Os}`)}function isLegacyRollingLogFilePath(e){let t=w.basename(e);return t===`openclaw-YYYY-MM-DD.log`||ks.exec(t)?.[1]===`openclaw`}function resolveRollingLogFilePathForDate(e,t){let n=ks.exec(w.basename(e));return n?w.join(w.dirname(e),`${n[1]}-${formatLocalDate(t)}${Os}`):isLegacyRollingLogFilePath(e)?w.join(w.dirname(e),`${Ds}-${formatLocalDate(t)}${Os}`):e}var ks,As;function init_log_file_path(){return(init_log_file_path=__esmMin((()=>{init_tmp_openclaw_dir(),init_log_file_shared(),ks=/^(openclaw(?:-[a-z0-9-]+)?)-(\d{4}-\d{2}-\d{2})\.log$/u,As=220})))()}function rotatedLogPath(e,t){let n=w.extname(e);return`${e.slice(0,e.length-n.length)}.${t}${n}`}function ensureLogDirectorySync(e,t=!0){try{C.mkdirSync(e)}catch(n){let r=extractErrorCode(n);if(r===`EEXIST`&&C.statSync(e).isDirectory())return;let i=w.dirname(e);if(!t||r!==`ENOENT`||i===e)throw n;ensureLogDirectorySync(i),ensureLogDirectorySync(e,!1)}}function rotateLogFile(e){try{ensureLogDirectorySync(w.dirname(e)),C.rmSync(rotatedLogPath(e,Ns),{force:!0});for(let t=4;t>=1;--t){let n=rotatedLogPath(e,t);C.existsSync(n)&&C.renameSync(n,rotatedLogPath(e,t+1))}return C.existsSync(e)&&C.renameSync(e,rotatedLogPath(e,1)),!0}catch{return!1}}async function getCurrentLogFileBytes(e){try{return(await ue.stat(e)).size}catch{return 0}}function getCurrentLogFileBytesSync(e){try{return C.statSync(e).size}catch{return 0}}function buildDroppedMarker(e,t){let n=/* @__PURE__ */ new Date,r=`[openclaw] file log queue overflow; dropped ${t} oldest record${t===1?``:`s`}`,i={0:r,_meta:{date:n,hostname:e.hostname,logLevelName:`WARN`,name:`openclaw`},time:formatTimestamp(n,{style:`long`}),hostname:e.hostname,message:r,dropped:t};return{...e,payload:`${JSON.stringify(i)}\n`}}function writeFileTransportWarning(e,t){try{let n=`${formatConsoleDiagnosticLine({level:`warn`,message:redactSensitiveText(e)})}\n`;return t?C.writeSync(process.stderr.fd,n):process.stderr.write(n),!0}catch{return!1}}function warnAboutRotationFailure(e,t){qs.get(e.file)!==e.maxFileBytes&&(qs.set(e.file,e.maxFileBytes),writeFileTransportWarning(`[openclaw] log file rotation failed; continuing writes file=${e.file} maxFileBytes=${e.maxFileBytes}`,t))}function warnAboutAppendFailure(e,t){if(Js.has(e.file))return;let n=Js.size>=Ps;n&&Ys||writeFileTransportWarning(n?`[openclaw] log file append failure diagnostics saturated; suppressing new file targets`:`[openclaw] log file append failed; records dropped; check that the path is a writable regular file; file=${e.file}`,t)&&(n?Ys=!0:Js.add(e.file))}function clearAppendFailure(e){Js.delete(e.file)&&(Ys=!1)}function claimQueuedEntries(){let e=Fs===0?j:[...j.slice(Fs),...j.slice(0,Fs)];return j=[],Fs=0,Rs>0&&zs&&e.unshift(buildDroppedMarker(zs,Rs)),Rs=0,zs=null,e}function prepareWrite(e,t,n,r,i){let a=Buffer.byteLength(e.payload,`utf8`);t.bytes>0&&t.bytes+a>e.maxFileBytes&&(rotateLogFile(e.file)?(t.bytes=0,qs.delete(e.file)):warnAboutRotationFailure(e,n));let o=i+1;if(n)return{payload:e.payload,payloadBytes:a,nextIndex:o};let s=[e.payload];for(;o<r.length;o+=1){let n=r[o];if(!n||n.file!==e.file||n.maxFileBytes!==e.maxFileBytes)break;let i=Buffer.byteLength(n.payload,`utf8`);if(a+i>Ms||t.bytes+a+i>e.maxFileBytes)break;s.push(n.payload),a+=i}return{payload:s.join(``),payloadBytes:a,nextIndex:o}}async function writeEntries(e,t){let n=/* @__PURE__ */ new Map;for(let r=0;r<e.length;){if(t!==Us||Ws)return;let i=e[r];if(!i)return;let a=n.get(i.file);if(!a){if(a={bytes:await getCurrentLogFileBytes(i.file)},t!==Us||Ws)return;n.set(i.file,a)}let o=prepareWrite(i,a,!1,e,r);Ls=o.nextIndex;try{await Ks({filePath:i.file,content:o.payload}),a.bytes+=o.payloadBytes,clearAppendFailure(i)}catch{warnAboutAppendFailure(i,!1)}finally{for(let t of e.slice(r,o.nextIndex))t.payload=``;r=o.nextIndex}}}function writeEntriesSync(e){let t=/* @__PURE__ */ new Map;for(let n=0;n<e.length;){let r=e[n];if(!r)return;let i=t.get(r.file);i||(i={bytes:getCurrentLogFileBytesSync(r.file)},t.set(r.file,i));let a=prepareWrite(r,i,!0,e,n);try{appendRegularFileSync({filePath:r.file,content:a.payload}),i.bytes+=a.payloadBytes,clearAppendFailure(r)}catch{warnAboutAppendFailure(r,!0)}r.payload=``,n=a.nextIndex}}async function runFlushLoop(){let e=Us;for(;;){if(e!==Us||Ws)return;let t=claimQueuedEntries();if(t.length===0||(Is=t,Ls=0,await writeEntries(t,e),e!==Us))return;Is=null,Ls=0}}function startFlush(){if(Hs||Ws)return;let e=runFlushLoop().catch(()=>void 0);Hs=e,e.then(()=>{Hs===e&&(Hs=null),(j.length>0||Rs>0)&&scheduleFlush()})}function scheduleFlush(){Vs||Hs||Ws||(Vs=setImmediate(()=>{Vs=null,startFlush()}))}function handleProcessBeforeExit(){flushFileLogQueue()}function handleProcessExit(){Ws=!0,drainFileLogQueueSync()}function installProcessHooks(){Gs||(Gs=!0,process.on(`beforeExit`,handleProcessBeforeExit),process.on(`exit`,handleProcessExit))}function removeProcessHooks(){Gs&&=(process.removeListener(`beforeExit`,handleProcessBeforeExit),process.removeListener(`exit`,handleProcessExit),!1)}function enqueueFileLog(e){if(Ws){writeEntriesSync([e]);return}if(installProcessHooks(),j.length>=Bs){let t=j[Fs];t&&(t.payload=``,zs??=t,Rs+=1),j[Fs]=e,Fs=(Fs+1)%j.length}else j.push(e);scheduleFlush()}async function flushFileLogQueue(){for(;;){Vs&&=(clearImmediate(Vs),null),!Hs&&(j.length>0||Rs>0)&&startFlush();let e=Hs;if(!e)return;await e}}function drainFileLogQueueSync(){Vs&&=(clearImmediate(Vs),null),Us+=1;let e=Is?Is.slice(Ls):[];Is=null,Ls=0,e.push(...claimQueuedEntries()),writeEntriesSync(e)}function setFileLogQueueMaxRecordsForTests(e){Bs=Math.max(1,e??js)}function setFileLogAppenderForTests(e){Ks=e??appendRegularFile}function resetFileLogTransportForTests(){drainFileLogQueueSync(),removeProcessHooks(),Ws=!1,Ks=appendRegularFile,Bs=js,qs.clear(),Js.clear(),Ys=!1}var js,Ms,Ns,Ps,j,Fs,Is,Ls,Rs,zs,Bs,Vs,Hs,Us,Ws,Gs,Ks,qs,Js,Ys,Xs;function init_logger_file_transport(){return(init_logger_file_transport=__esmMin((()=>{init_regular_file(),init_error_coercion(),init_global_singleton(),init_json_console_line(),init_redact(),init_timestamps(),js=4096,Ms=65536,Ns=5,Ps=64,j=[],Fs=0,Is=null,Ls=0,Rs=0,zs=null,Bs=js,Vs=null,Hs=null,Us=0,Ws=!1,Gs=!1,Ks=appendRegularFile,qs=/* @__PURE__ */ new Map,Js=/* @__PURE__ */ new Set,Ys=!1,Xs=resolveGlobalSingleton(Symbol.for(`openclaw.fileLogTransport`),()=>(process.env.VITEST!==`true`&&installProcessHooks(),{drainSync:drainFileLogQueueSync,enqueue:enqueueFileLog,flush:flushFileLogQueue,resetForTests:resetFileLogTransportForTests,setAppenderForTests:setFileLogAppenderForTests,setMaxQueuedRecordsForTests:setFileLogQueueMaxRecordsForTests}))})))()}function setLoggerFileTargetResolver(e){Zs=e}var Zs;function init_logger_settings_internal(){return(init_logger_settings_internal=__esmMin((()=>{})))()}function clampLogText(e,t){return e.length>t?`${truncateUtf16Safe(e,t)}...(truncated)`:e}function sanitizeDiagnosticLogText(e,t){return clampLogText(redactSensitiveText(clampLogText(e,t)),t)}function normalizeDiagnosticLogName(e){if(!e||e.trim().startsWith(`{`))return;let t=sanitizeDiagnosticLogText(e.trim(),oc);return cc.test(t)?t:void 0}function assignDiagnosticLogAttribute(e,t,n,r){if(t.count>=ic)return;let i=n.trim();if(isBlockedObjectKey(i)||redactSensitiveText(i)!==i||!cc.test(i))return;let a;if(typeof r==`string`)a=sanitizeDiagnosticLogText(r,ac);else if(typeof r==`boolean`||typeof r==`number`&&Number.isFinite(r))a=r;else return;e[i]=a,t.count+=1}function addDiagnosticLogAttributesFrom(e,t,n){if(n)for(let r in n){if(t.count>=ic)break;Object.hasOwn(n,r)&&r!==`trace`&&assignDiagnosticLogAttribute(e,t,r,n[r])}}function isPlainLogRecordObject(e){if(!isRecord(e))return!1;let t=Object.getPrototypeOf(e);return t===Object.prototype||t===null}function normalizeTraceContext(e){let t=asOptionalRecord(e);if(t&&isValidDiagnosticTraceId(t.traceId)&&(t.spanId===void 0||isValidDiagnosticSpanId(t.spanId))&&(t.parentSpanId===void 0||isValidDiagnosticSpanId(t.parentSpanId))&&(t.traceFlags===void 0||isValidDiagnosticTraceFlags(t.traceFlags)))return{traceId:t.traceId,...t.spanId?{spanId:t.spanId}:{},...t.parentSpanId?{parentSpanId:t.parentSpanId}:{},...t.traceFlags?{traceFlags:t.traceFlags}:{}}}function extractTraceContext(e){return normalizeTraceContext(e)??normalizeTraceContext(asOptionalRecord(e)?.trace)}function getSortedNumericLogEntries(e){return Object.entries(e).filter(([e])=>/^\d+$/.test(e)).toSorted((e,t)=>Number(e[0])-Number(t[0]))}function normalizeFileLogContextValue(e){if(typeof e==`string`){let t=e.trim();return t?clampLogText(t,sc):void 0}if(typeof e==`boolean`||typeof e==`number`&&Number.isFinite(e))return String(e)}function readFirstContextString(e,t){for(let n of e)if(n)for(let e of t){let t=normalizeFileLogContextValue(n[e]);if(t)return t}}function resolveLogHostname(){if(tc)return tc;let e=de.hostname().trim();return e?(tc=e,e):`unknown`}function withResolvedLogMetaHostname(e,t){return isRecord(e)?{...e,hostname:t}:e}function extractLogBindingPrefix(e){if(typeof e[0]==`string`&&e[0].length<=nc&&e[0].trim().startsWith(`{`))try{let t=JSON.parse(e[0]);if(isRecord(t))return{bindings:t,args:e.slice(1)}}catch{}return{args:e}}function resolveLogTraceContext(e,t){for(let n of[e,...t]){let e=extractTraceContext(n);if(e)return{trace:e,trustedTraceContext:!1}}let n=getActiveDiagnosticTraceContext();return n?{trace:n,trustedTraceContext:!0}:{trustedTraceContext:!1}}function prepareFileLogRecord(e){let t=getSortedNumericLogEntries(e),{bindings:n,args:r}=extractLogBindingPrefix(t.map(([,e])=>e)),{trace:i}=resolveLogTraceContext(n,r),a=isPlainLogRecordObject(r[0])?r[0]:void 0,o=[a,n,e],s=a&&typeof a.message!=`string`?1:0,c=t.slice(t.length-r.length+s).map(([e,t])=>{let n={key:e,json:t!=null&&![`string`,`number`,`boolean`,`bigint`].includes(typeof t)&&!(t instanceof Error)&&!(isPlainLogRecordObject(t)&&typeof t.message==`string`)};return typeof t==`number`&&!Number.isFinite(t)&&(n.primitiveText=String(t)),n}),l=readFirstContextString(o,[`agent_id`,`agentId`]),u=readFirstContextString(o,[`session_id`,`sessionId`,`sessionKey`]),d=readFirstContextString(o,[`channel`,`messageProvider`]);return{fields:{hostname:resolveLogHostname(),...l?{agent_id:l}:{},...u?{session_id:u}:{},...d?{channel:d}:{},...i},messageParts:c}}function buildDiagnosticLogRecord(e){let t=e._meta,{bindings:n,args:r}=extractLogBindingPrefix(getSortedNumericLogEntries(e).map(([,e])=>e)),{trace:i,trustedTraceContext:a}=resolveLogTraceContext(n,r),o=r[0],s=isPlainLogRecordObject(o)?o:void 0;s&&r.shift();let c=``;r.length>0&&typeof r[r.length-1]==`string`?c=sanitizeDiagnosticLogText(String(r.pop()),rc):r.length===1&&(typeof r[0]==`number`||typeof r[0]==`boolean`)&&(c=String(r[0]),r.length=0),c||=`log`;let l=Object.create(null),u={count:0};addDiagnosticLogAttributesFrom(l,u,n),addDiagnosticLogAttributesFrom(l,u,s);let d={};if(t?.path?.fileLine){let e=Number(t.path.fileLine);Number.isFinite(e)&&(d.line=e)}t?.path?.method&&(d.functionName=sanitizeDiagnosticLogText(t.path.method,oc));let f=normalizeDiagnosticLogName(t?.name),p=t?.parentNames?.map(normalizeDiagnosticLogName).filter(e=>!!e);return{event:{type:`log.record`,level:t?.logLevelName??`INFO`,message:c,...f?{loggerName:f}:{},...p?.length?{loggerParents:p}:{},...Object.keys(l).length>0?{attributes:l}:{},...Object.keys(d).length>0?{code:d}:{},...i?{trace:i}:{}},trustedTraceContext:a}}function attachDiagnosticEventTransport(e){e.attachTransport({format:()=>``,write:e=>{if(areDiagnosticsEnabledForProcess()&&hasInternalDiagnosticEventInterest(`log.record`))try{let t=buildDiagnosticLogRecord(redactSecrets(e));(t.trustedTraceContext?emitDiagnosticEventWithTrustedTraceContext:emitDiagnosticEvent)(t.event)}catch{}}})}function canUseSilentVitestFileLogFastPath(e){return process.env.VITEST===`true`&&process.env.OPENCLAW_TEST_FILE_LOG!==`1`&&!e&&!T.overrideSettings}function resolveDefaultActiveLogFile(){return process.env.VITEST===`true`&&process.env.OPENCLAW_TEST_FILE_LOG===`1`?w.join(process.cwd(),`.artifacts`,`test-logs`,`${Ds}-vitest-${process.pid}-${formatLocalDate(/* @__PURE__ */ new Date)}${Os}`):resolveDefaultRollingLogFile()}function resolveSettings(){if(!canUseNodeFs())return{level:`silent`,file:Qs,maxFileBytes:ec,rolling:!1};let e=resolveEnvLogLevelOverride();if(canUseSilentVitestFileLogFastPath(e))return{level:`silent`,file:resolveDefaultRollingLogFile(),maxFileBytes:ec,rolling:!0};let t=T.overrideSettings??readLoggingConfig(),n=process.env.VITEST===`true`&&process.env.OPENCLAW_TEST_FILE_LOG!==`1`?`silent`:`info`,r=normalizeLogLevel(t?.level,n),i=e??r,a=!t?.file||isLegacyRollingLogFilePath(t.file);return{level:i,file:resolveActiveLogFileWithMode(t?.file??resolveDefaultActiveLogFile(),a),maxFileBytes:resolveMaxLogFileBytes(t?.maxFileBytes),rolling:a}}function getRuntimeSettings(){let e=T.cachedSettings??resolveSettings();return T.cachedSettings=e,e}function isFileLogLevelEnabled(e){return isLogLevelEnabled(e,getRuntimeSettings().level)}function inheritLogLevel(e,t){let resolveLevel=t;Object.defineProperty(e.settings,"minLevel",{configurable:!0,enumerable:!0,get:()=>resolveLevel(),set:e=>{resolveLevel=()=>e}})}function buildLogger(){let e=new RuntimeLogger({name:`openclaw`,mask:{keys:[]},meta:{property:`_meta`},minLevel:levelToMinLevel(`fatal`),type:`hidden`});inheritLogLevel(e,()=>levelToMinLevel(getRuntimeSettings().level));let t;return e.attachTransport({format:()=>``,write:e=>{try{let n=getRuntimeSettings();if(n.level===`silent`)return;let r=resolveActiveLogFileWithMode(n.file,n.rolling);if(r!==t){t=r;try{ensureLogDirectorySync(w.dirname(t)),n.rolling&&pruneOldRollingLogs(w.dirname(t))}catch{}}let i=formatTimestamp(e.date??/* @__PURE__ */ new Date,{style:`long`}),{fields:a,messageParts:o}=prepareFileLogRecord(e),s=serializeFileLogRecord({...e,_meta:withResolvedLogMetaHostname(e._meta,a.hostname),time:i,...a},o);Xs.enqueue({file:t,hostname:a.hostname,maxFileBytes:n.maxFileBytes,payload:`${s}\n`})}catch{}}}),attachDiagnosticEventTransport(e),e}function resolveMaxLogFileBytes(e){return typeof e==`number`&&Number.isFinite(e)&&e>0?Math.floor(e):ec}function getLogger(){let e=T.cachedLogger;if(e)return e;getRuntimeSettings();let t=buildLogger();return T.cachedLogger=t,t}function getChildLogger(e,t){let n=getLogger(),r=e?JSON.stringify(e):void 0;return n.getSubLogger({name:r,prefix:e?[r??``]:[],...t?.level?{minLevel:levelToMinLevel(t.level)}:{}})}function resolveActiveLogFileWithMode(e,t){let n=expandHomePrefix(e);return t?resolveRollingLogFilePathForDate(n,/* @__PURE__ */ new Date):n}function pruneOldRollingLogs(e){try{let t=C.readdirSync(e,{withFileTypes:!0}),n=Date.now()-$s;for(let r of t){if(!r.isFile()||!r.name.startsWith(`openclaw-`)||!r.name.endsWith(`.log`))continue;let t=w.join(e,r.name);try{C.statSync(t).mtimeMs<n&&C.rmSync(t,{force:!0})}catch{}}}catch{}}var Qs,$s,ec,tc,nc,rc,ic,ac,oc,sc,cc,RuntimeLogger;function init_logger(){return(init_logger=__esmMin((()=>{init_index_node(),init_diagnostic_event_listener_presence(),init_diagnostic_events(),init_diagnostic_trace_context(),init_home_dir$1(),init_prototype_keys(),init_tmp_openclaw_dir(),init_config(),init_env_log_level(),init_levels(),init_log_file_path(),init_log_file_shared(),init_logger_file_message(),init_logger_file_transport(),init_logger_settings_internal(),init_redact(),init_state(),init_timestamps(),Qs=`${Ts}/openclaw.log`,$s=864e5,ec=104857600,tc=null,nc=8192,rc=4096,ic=32,ac=2048,oc=120,sc=512,cc=/^[A-Za-z0-9_.:-]{1,64}$/u,setLoggerFileTargetResolver(()=>{let{file:e,rolling:t}=resolveSettings();return{file:e,rolling:t}}),RuntimeLogger=class extends ws{getSubLogger(e,t){let n=e?.minLevel??this.settings.minLevel,r=super.getSubLogger({...e,minLevel:n===1/0?levelToMinLevel(`fatal`):n},t);return e?.minLevel==null?inheritLogLevel(r,()=>this.settings.minLevel):n===1/0&&(r.settings.minLevel=n),r}}})))()}function normalizeConsoleLevel(e){return isVerbose()?`debug`:!e&&process.env.VITEST===`true`&&process.env.OPENCLAW_TEST_CONSOLE!==`1`?`silent`:normalizeLogLevel(e,`info`)}function normalizeConsoleStyle(e){return e===`compact`||e===`json`||e===`pretty`?e:process.stdout.isTTY?`pretty`:`compact`}function resolveConsoleSettings(){let e=resolveEnvLogLevelOverride();if(process.env.VITEST===`true`&&process.env.OPENCLAW_TEST_CONSOLE!==`1`&&!isVerbose()&&!e&&!T.overrideSettings)return{level:`silent`,style:normalizeConsoleStyle(void 0)};let t=T.overrideSettings??readLoggingConfig();return{level:e??normalizeConsoleLevel(t?.consoleLevel),style:normalizeConsoleStyle(t?.consoleStyle)}}function getConsoleSettings(){let e=T.cachedConsoleSettings;if(e)return e;let t=resolveConsoleSettings();return T.cachedConsoleSettings=t,t}function shouldLogSubsystemToConsole(e){let t=T.consoleSubsystemFilter;if(!t||t.length===0)return!0;let n=normalizeOptionalString(e);return n?t.some(e=>n===e||n.startsWith(`${e}/`)):!1}function formatConsoleTimestamp(e){let t=/* @__PURE__ */ new Date;return e===`pretty`?formatTimestamp(t,{style:`short`}).replace(/[+-]\d{2}:\d{2}$/,``):formatTimestamp(t,{style:`long`})}function init_console(){return(init_console=__esmMin((()=>{init_ansi(),init_signal_exit_barrier(),init_global_state(),init_config(),init_env_log_level(),init_json_console_line(),init_levels(),init_logger(),init_redact(),init_state(),init_timestamps(),`${process.release.name}${process.pid}`})))()}function isRichConsoleEnv(){let e=normalizeLowercaseStringOrEmpty(process.env.TERM);return process.env.COLORTERM||process.env.TERM_PROGRAM?!0:e.length>0&&e!==`dumb`}function getColorForConsole(){let e=typeof process.env.FORCE_COLOR==`string`&&process.env.FORCE_COLOR.trim().length>0&&process.env.FORCE_COLOR.trim()!==`0`||!process.env.NO_COLOR&&(process.stdout.isTTY||process.stderr.isTTY||isRichConsoleEnv())?1:0;return lc[e]??=new Chalk({level:e})}function pickSubsystemColor(e){let t=dc.get(e);if(t)return t;let n=0;for(let t=0;t<e.length;t+=1)n=n*31+e.charCodeAt(t)|0;let r=Math.abs(n)%uc.length;return expectDefined(uc[r],`subsystem colors entry at idx`)}function formatSubsystemForConsole(e){let t=e.split(`/`).filter(Boolean),n=t.join(`/`)||e;for(;t[0]!==void 0&&fc.has(t[0]);)t.shift();let r=t.at(0);return r===void 0?n:pc.has(normalizeLowercaseStringOrEmpty(r))?r:t.slice(-2).join(`/`)}function stripRedundantSubsystemPrefixForConsole(e,t){if(!t)return e;if(e.startsWith(`[`)){let n=e.indexOf(`]`);if(n>1&&normalizeLowercaseStringOrEmpty(e.slice(1,n))===normalizeLowercaseStringOrEmpty(t))return e.slice(n+1).replace(/^ */,``)}if(normalizeLowercaseStringOrEmpty(e.slice(0,t.length))!==normalizeLowercaseStringOrEmpty(t))return e;let n=e.slice(t.length,t.length+1);return n!==`:`&&n!==` `?e:e.slice(t.length).replace(/^ *:? */,``)}function createConsoleLineFormatter(e){let t=formatSubsystemForConsole(e),n=`[${t}]`,r=pickSubsystemColor(t);return(e,i,a)=>{let o=getColorForConsole(),s=e===`error`||e===`fatal`?o.red:e===`warn`?o.yellow:e===`debug`||e===`trace`?o.gray:o.cyan,c=stripRedundantSubsystemPrefixForConsole(redactSensitiveText(i),t),l=a===`pretty`||T.consoleTimestampPrefix?o.gray(formatConsoleTimestamp(a)):``,u=o[r](n);return`${l?`${l} ${u}`:u} ${s(c)}`}}function writeConsoleLine(e,t,n={}){clearActiveProgressLine();let r=process.platform===`win32`&&process.env.GITHUB_ACTIONS===`true`?t.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,`?`).replace(/[\uD800-\uDFFF]/g,`?`):t,i=n.redacted?r:redactSensitiveText(r),a=T.rawConsole??console;T.forceConsoleToStderr||e===`error`||e===`fatal`?(a.error??console.error)(i):e===`warn`?(a.warn??console.warn)(i):(a.log??console.log)(i)}function shouldSuppressProbeConsoleLine(e){if(isVerbose()||e.level===`error`||e.level===`fatal`)return!1;let t=typeof e.message==`string`?e.message:``;return e.suppressProbeMessages?(typeof e.meta?.runId==`string`?e.meta.runId:typeof e.meta?.sessionId==`string`?e.meta.sessionId:void 0)?.startsWith(`probe-`)?!0:/(sessionId|runId)=probe-/.test(t):!1}function formatConsoleMetaValue(e){if(e!==void 0)return typeof e==`string`?/\s|=/.test(e)||e.length===0?JSON.stringify(e):e:e===null||typeof e==`number`||typeof e==`boolean`?String(e):JSON.stringify(e)}function prepareLogMetaRecord(e,t=!1){let n;for(let[r,i]of Object.entries(e))i instanceof Error&&(n??={...e},n[r]={name:i.name,message:i.message,errorCode:extractErrorCode(i),stack:t?i.stack?.split(`
`).slice(0,6).join(`
`):i.stack});return n??e}function formatConsoleMeta(e){let t;try{t=redactLogRecordForTransport(e)}catch{return``}let n=[];for(let[e,r]of Object.entries(t)){let t=formatConsoleMetaValue(r);t!==void 0&&n.push(`${e}=${t}`)}let r=n.join(` `);return r.length>hc?`${r.slice(0,hc)}...(truncated)`:r}function logToFile(e,t,n,r){t!==`silent`&&(r&&Object.keys(r).length>0?e[t](r,n):e[t](n))}function createSubsystemLogger(e){let t=normalizeOptionalString(e)??`unknown`,n=t===`agent/embedded`||t.startsWith(`agent/embedded/`)||t===`model-fallback`||t.startsWith(`model-fallback/`),r,i,a,getFileLogger=e=>(r??=getChildLogger({subsystem:t}),e===`error`||e===`fatal`||areDiagnosticsEnabledForProcess()&&hasInternalDiagnosticEventInterest(`log.record`)?r:(i||(i=r.getSubLogger({stack:{capture:`off`}}),i.settings.parentNames=r.settings.parentNames),i)),emitLog=(e,r,i)=>{let o=getConsoleSettings(),s=isLogLevelEnabled(e,o.level)&&shouldLogSubsystemToConsole(t),c=isFileLogLevelEnabled(e);if(!s&&!c)return;let l,u=i,d=i;if(i&&Object.keys(i).length>0){let{consoleMessage:e,...t}=i;typeof e==`string`&&(l=e),u=Object.keys(t).length>0?prepareLogMetaRecord(t):void 0,d=u&&s?prepareLogMetaRecord(t,!0):void 0}if(c&&logToFile(getFileLogger(e),e,r,u),!s)return;let f=o.style!==`json`&&l===void 0&&d&&mc.has(e)?formatConsoleMeta(d):``,p=l??(f?`${r} ${f}`:r);shouldSuppressProbeConsoleLine({level:e,suppressProbeMessages:n,message:p,meta:d})||writeConsoleLine(e,o.style===`json`?formatJsonConsoleLine({level:e,subsystem:t,message:r,meta:d}):(a??=createConsoleLineFormatter(t))(e,p,o.style),{redacted:!0})};return{subsystem:t,isEnabled(e,n=`any`){let r=isLogLevelEnabled(e,getConsoleSettings().level)&&shouldLogSubsystemToConsole(t),i=isFileLogLevelEnabled(e);return n===`console`?r:n===`file`?i:r||i},trace(e,t){emitLog(`trace`,e,t)},debug(e,t){emitLog(`debug`,e,t)},info(e,t){emitLog(`info`,e,t)},warn(e,t){emitLog(`warn`,e,t)},error(e,t){emitLog(`error`,e,t)},fatal(e,t){emitLog(`fatal`,e,t)},raw(e){isFileLogLevelEnabled(`info`)&&logToFile(getFileLogger(`info`),`info`,e,{raw:!0});let r=getConsoleSettings();if(isLogLevelEnabled(`info`,r.level)&&shouldLogSubsystemToConsole(t)){if(shouldSuppressProbeConsoleLine({level:`info`,suppressProbeMessages:n,message:e}))return;writeConsoleLine(`info`,r.style===`json`?formatJsonConsoleLine({level:`info`,subsystem:t,message:e}):e,{redacted:r.style===`json`})}},child(e){return createSubsystemLogger(`${t}/${e}`)}}}var lc,uc,dc,fc,pc,mc,hc;function init_subsystem(){return(init_subsystem=__esmMin((()=>{init_src(),init_error_coercion(),init_source(),init_progress_line(),init_global_state(),init_diagnostic_event_listener_presence(),init_diagnostic_events(),init_runtime(),init_console(),init_levels(),init_logger(),init_redact(),init_state(),(()=>{try{let e=process.getBuiltinModule?.(`util`).inspect;return typeof e==`function`?e:null}catch{return null}})(),lc=[],uc=[`cyan`,`green`,`yellow`,`blue`,`magenta`,`red`],dc=/* @__PURE__ */ new Map([[`gmail-watcher`,`blue`]]),fc=/* @__PURE__ */ new Set([`gateway`,`channels`,`providers`]),pc=/* @__PURE__ */ new Set(/* @__PURE__ */ `clickclack.discord.feishu.googlechat.imessage.irc.line.matrix.mattermost.msteams.nextcloud-talk.nostr.openclaw-weixin.qqbot.signal.slack.synology-chat.telegram.tlon.twitch.webchat.wecom.whatsapp.yuanbao.zalo.zalouser`.split(`.`)),mc=/* @__PURE__ */ new Set([`warn`,`error`,`fatal`]),hc=2048})))()}function init_sqlite_lifecycle_errors(){return(init_sqlite_lifecycle_errors=__esmMin((()=>{init_global_singleton(),resolveGlobalSingleton(Symbol.for(`openclaw.sqliteCoordinatorError`),()=>class extends Error{constructor(e,t){super(e),this.cause=t,this.name=`SqliteCoordinatorError`}})})))()}function hasSqlitePostCommitScope(e){return gc.has(sqlPublicationAnchor(e))}function stageSqliteTransactionState(e,t){let n=_c.get(sqlPublicationAnchor(e));return n?(t.stage(),n.push({prepareCommit:t.prepareCommit,commit:t.commit,prepareObservers:t.prepareObservers,invalidate:t.invalidate,rollback:t.rollback}),!0):!1}var gc,_c;function init_sqlite_post_commit(){return(init_sqlite_post_commit=__esmMin((()=>{init_subsystem(),init_global_singleton(),init_sql_connection(),init_sqlite_lifecycle_errors(),createSubsystemLogger(`sqlite/publication`),gc=resolveGlobalSingleton(Symbol.for(`openclaw.sqlitePostCommitPublications`),()=>/* @__PURE__ */ new WeakMap),_c=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteTransactionState`),()=>/* @__PURE__ */ new WeakMap)})))()}function createSqliteDatabaseWriteReceipts(e){function withSqliteDatabaseWriteScope(t,n,r){let i=e.admission(t);if(!(i?readSqliteDatabaseGeneration(i,`writeScopeRevision`)>0:M.localScopeRevisions.has(t))){let e=r();if(e instanceof Promise)throw Error(`SQLite write scopes cannot await work`);return e}let a=normalizedWriteScopes(n),o=M.writeScopes.get(t);M.writeScopes.set(t,a);try{let e=r();if(e instanceof Promise)throw Error(`SQLite write scopes cannot await work`);return e}finally{o?M.writeScopes.set(t,o):M.writeScopes.delete(t)}}function withoutSqliteDatabaseWriteScope(e,t){let n=M.writeScopes.get(e);M.writeScopes.delete(e);try{return t()}finally{n&&M.writeScopes.set(e,n)}}function ensureWriteScopes(t,n){let r=!1;for(let e of n){let n=t.writeScopes.get(e);(!n||Atomics.load(n.state,1)!==0)&&(t.writeScopes.set(e,createScopeRevision()),x===0&&advanceSqliteDatabaseGeneration(t,`writeScopeRevision`),r=!0)}r&&(advanceSqliteDatabaseGeneration(t,`publicationRevision`),e.publish(t))}function createScopeRevision(){return{identity:re(),state:new Int32Array(new SharedArrayBuffer(2*Int32Array.BYTES_PER_ELEMENT))}}function retireSqliteDatabaseWriteScopes(t,n){let r=normalizedWriteScopes(n),i=e.admission(t),retire=()=>{if(!i){let e=M.localScopeRevisions.get(t);for(let t of r)e?.delete(t);return}if(isSqliteDatabaseAdmissionRetired(i))return;let n=!1;for(let e of r){let t=i.writeScopes.get(e);t&&Atomics.exchange(t.state,1,1)===0&&(n=!0)}n&&(advanceSqliteDatabaseGeneration(i,`writeScopeRevision`),advanceSqliteDatabaseGeneration(i,`publicationRevision`),e.publish(i))};!stageSqliteTransactionState(t,{stage(){},commit:retire,rollback(){}})&&!t.isTransaction&&retire()}function scopedWriteToken(e,t,n){return JSON.stringify([e.identity,e.generationId,readSqliteDatabaseGeneration(e,`schemaRevision`),readSqliteDatabaseGeneration(e,`unscopedWriteRevision`)+ +(n===null)|0,t.map(t=>[t,e.writeScopes.get(t).identity,Atomics.load(e.writeScopes.get(t).state,0)+ +!!n?.has(t)|0])])}function localScopedWriteToken(e,t,n){return JSON.stringify([`memory`,(M.localUnscopedRevisions.get(e)??0)+ +(n===null),t.map(t=>[t,M.localScopeRevisions.get(e).get(t).identity,Atomics.load(M.localScopeRevisions.get(e).get(t).state,0)+ +!!n?.has(t)|0])])}function normalizedWriteScopes(e){return[...new Set((typeof e==`string`?[e]:e).map(e=>JSON.stringify(typeof e==`string`?[`key`,a(e)]:[`session-id`,a(e.sessionId)])))].toSorted()}function ensureLocalWriteScopes(e,t){let n=M.localScopeRevisions.get(e)??/* @__PURE__ */ new Map;for(let e of t)n.has(e)||n.set(e,createScopeRevision());M.localScopeRevisions.set(e,n)}function readScopedWriteToken(t,n,r=!1){let i=normalizedWriteScopes(n),a=e.admission(t);if(a?ensureWriteScopes(a,i):ensureLocalWriteScopes(t,i),e.readRevision(t)===void 0)return;let o=r?M.pendingWriteScopes.get(t):void 0;return a?scopedWriteToken(a,i,o):localScopedWriteToken(t,i,o)}function readSqliteDatabaseScopedWriteToken(e,t){return readScopedWriteToken(e,t)}function readSqliteDatabaseScopedWriteTokenForPath(t,n){let r=normalizedWriteScopes(n),i=e.pathAdmission(t);if(i&&!isSqliteDatabaseAdmissionRetired(i))return ensureWriteScopes(i,r),scopedWriteToken(i,r)}function readSqliteDatabaseScopedWriteTokensForPath(t,n){let r=e.pathAdmission(t);if(!r||isSqliteDatabaseAdmissionRetired(r))return;let i=n.map(normalizedWriteScopes);return ensureWriteScopes(r,i.flat()),i.map(e=>scopedWriteToken(r,e))}function readSqliteDatabasePendingScopedWriteToken(e,t){return readScopedWriteToken(e,t,!0)}function readSqliteDatabaseWriteTokenForPath(t){let n=e.pathAdmission(t);if(n&&!isSqliteDatabaseAdmissionRetired(n))return`${n.identity}:${n.generationId}:${readSqliteDatabaseGeneration(n,`writeRevision`)}`}function readSqliteDatabasePendingWriteToken(t){if(!t.isOpen||!t.isTransaction||!hasSqlitePostCommitScope(t)||e.suspended(t))return;let n=e.writer(t);if(n&&!isSqliteDatabaseAdmissionRetired(n))return`${n.identity}:${n.generationId}:${readSqliteDatabaseGeneration(n,`writeRevision`)+1|0}`}return{begin(e,t){let n=t?void 0:M.writeScopes.get(e),r=M.pendingWriteScopes.get(e);if(!n||r===null)M.pendingWriteScopes.set(e,null);else{let t=r??/* @__PURE__ */ new Set;for(let e of n)t.add(e);M.pendingWriteScopes.set(e,t)}},finish(e,t){let n=M.pendingWriteScopes.get(e);M.pendingWriteScopes.delete(e);let r=!n;if(n){let i=M.localScopeRevisions.get(e);for(let e of n){let n=i?.get(e);n&&Atomics.add(n.state,0,1);let a=t?.writeScopes.get(e);a&&Atomics.load(a.state,1)===0?Atomics.add(a.state,0,1):t&&(a||t.writeScopeRevision!==readSqliteDatabaseGeneration(t,`writeScopeRevision`))&&(r=!0)}}r&&(M.localUnscopedRevisions.set(e,(M.localUnscopedRevisions.get(e)??0)+1),t&&advanceSqliteDatabaseGeneration(t,`unscopedWriteRevision`))},retireSqliteDatabaseWriteScopes,withSqliteDatabaseWriteScope,withoutSqliteDatabaseWriteScope,readSqliteDatabaseScopedWriteToken,readSqliteDatabaseScopedWriteTokenForPath,readSqliteDatabaseScopedWriteTokensForPath,readSqliteDatabasePendingScopedWriteToken,readSqliteDatabaseWriteTokenForPath,readSqliteDatabasePendingWriteToken}}var M;function init_sqlite_database_write_receipts(){return(init_sqlite_database_write_receipts=__esmMin((()=>{init_global_singleton(),init_sqlite_database_admission_record(),init_sqlite_post_commit(),M=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteDatabaseWriteScopes`),()=>({writeScopes:/* @__PURE__ */ new WeakMap,pendingWriteScopes:/* @__PURE__ */ new WeakMap,localScopeRevisions:/* @__PURE__ */ new WeakMap,localUnscopedRevisions:/* @__PURE__ */ new WeakMap}))})))()}function exchange(e,t){let n=N.exchange.getStore();if(n&&!N.exchanging){N.exchanging=!0;try{let r=typeof e==`string`?{location:e}:{admissions:[e]},i=typeof e!=`string`&&isSqliteDatabaseAdmissionRetired(e);installSqliteDatabaseAdmissions(n(i?[e]:captureSqliteDatabaseAdmissions(void 0,r),i?void 0:typeof e==`string`?e:e.location,t))}finally{N.exchanging=!1}}}function retainSqliteDatabaseAdmissionLocation(e){let t=C.statSync(e,{bigint:!0});if(!t.isFile())return;let n=readSqliteDatabaseAdmissionIdentity(t),r=N.registry.records.get(n);if(r&&!isSqliteDatabaseAdmissionRetired(r)){N.registry.observeLocation(e,n),N.seals.load(r);return}if(x!==0)return;let i=N.registry.descriptors.get(n)??C.openSync(e,`r`),a=C.fstatSync(i,{bigint:!0});if(!a.isFile()||readSqliteDatabaseAdmissionIdentity(a)!==n)throw Error(`SQLite database changed while retaining its admission identity`);let o=N.registry.retainDescriptor(C.realpathSync.native(e),i,a);N.registry.observeLocation(e,o.identity),N.seals.load(o)}function pathAdmission(e){let t=N.registry.forLocation(e);if(t||=(exchange(e),N.registry.forLocation(e)),t)return N.seals.load(t),t;try{return retainSqliteDatabaseAdmissionLocation(e),N.registry.forLocation(e)}catch(e){if(hasNodeErrorCode(e,`ENOENT`))return;throw e}}function admission(e,t=!0){let n=N.openedIdentities.get(e);if(!e.isOpen||n===void 0||N.unproven.has(e))return;let r=N.connections.get(e);if(r)return isSqliteDatabaseAdmissionRetired(r)?void 0:r;let i=e.location();if(!i||i===`:memory:`)return;let a=t&&!e.isTransaction?pathAdmission(i):N.registry.records.get(n);if(a&&a.identity!==n)throw Error(`SQLite database changed identity before admission`);return a&&!isSqliteDatabaseAdmissionRetired(a)?retainConnection(e,a):void 0}function retainConnection(e,t){let n=t.identity,r=t;try{for(;;){if(r.identity!==n)throw Error(`SQLite database changed identity during native open`);let t=N.registry.changeReferences(r,1),i=!1;try{t&&exchange(r);let n=readSqliteDatabaseGeneration(r,`retired`);if(n===0)return N.connections.set(e,r),i=!0,r;if(n!==2)throw Error(`SQLite database admission retired during native open`)}finally{i||N.registry.changeReferences(r,-1)}let a=e.location(),o=e.isTransaction?N.registry.records.get(n):a?pathAdmission(a):void 0;if(!o||isSqliteDatabaseAdmissionRetired(o))throw Error(`SQLite database admission unavailable during native open`);r=o}}catch(t){throw N.openedIdentities.delete(e),t}}function releaseReference(e){N.registry.changeReferences(e,-1)&&(N.localSchemaRevisions.delete(e.identity),exchange(e))}function publishFact(e,t,n,r){if(t.writer===`host`&&x!==0)throw Error(`SQLite host-owned admission facts require the host publisher`);publishSqliteDatabaseFact(e,t,n,r,`${x}:${++N.publication}`)&&(N.registry.publish(e),exchange(e))}function readSqliteDatabaseWriteRevision(e){let t=sqlPublicationAnchor(e);if(!t.isOpen||N.suspended.has(t))return;let n=admission(t);if(!n){let e=t.location();return!e||e===`:memory:`?N.localWriteRevisions.get(t)??0:void 0}return readSqliteDatabaseGeneration(n,`writeRevision`)}function captureSqliteDatabaseAdmissions(e,t){if(!t)return N.registry.capture(e);let n=new Set(t.admissions?.map(e=>e.identity));if(t.location!==void 0){let e=N.registry.forLocation(t.location)?.identity;e&&n.add(e)}return N.registry.capture(e,n)}function installSqliteDatabaseAdmissions(e){N.registry.install(e)}function withSqliteDatabaseAdmissionExchange(e,t){return N.exchange.run(e,t)}var N,vc,yc,bc,xc,Sc,Cc,wc,Tc,Ec,Dc,Oc,kc,Ac;function init_sqlite_database_admission(){return(init_sqlite_database_admission=__esmMin((()=>{init_global_singleton(),init_errno(),init_sql_connection(),init_sqlite_database_admission_key(),init_sqlite_database_admission_read(),init_sqlite_database_admission_record(),init_sqlite_database_admission_seal(),init_sqlite_database_write_receipts(),init_sqlite_native_admission(),init_sqlite_post_commit(),N=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteDatabaseAdmissions`),()=>({registry:new SqliteDatabaseAdmissionRegistry,connections:/* @__PURE__ */ new WeakMap,openedIdentities:/* @__PURE__ */ new WeakMap,unproven:/* @__PURE__ */ new WeakSet,suspended:/* @__PURE__ */ new WeakSet,local:/* @__PURE__ */ new WeakMap,rolledBack:/* @__PURE__ */ new WeakSet,dataWriters:/* @__PURE__ */ new WeakMap,localWriteRevisions:/* @__PURE__ */ new WeakMap,writeListeners:/* @__PURE__ */ new WeakMap,ddlRevisions:/* @__PURE__ */ new WeakMap,schemaDirty:/* @__PURE__ */ new WeakSet,localSchemaRevisions:/* @__PURE__ */ new Map,misses:/* @__PURE__ */ new WeakMap,exchange:new S,exchanging:!1,publication:0,seals:new SqliteDatabaseCleanCloseSeals(publishFact,{retain:e=>N.registry.changeReferences(e,1),release:releaseReference})})),vc=createSqliteDatabaseWriteReceipts({admission,pathAdmission,readRevision:readSqliteDatabaseWriteRevision,writer:e=>N.dataWriters.get(e),suspended:e=>N.suspended.has(e),publish(e){N.registry.publish(e),exchange(e)}}),{retireSqliteDatabaseWriteScopes:yc,withSqliteDatabaseWriteScope:bc,withoutSqliteDatabaseWriteScope:xc,readSqliteDatabaseScopedWriteToken:Sc,readSqliteDatabaseScopedWriteTokenForPath:Cc,readSqliteDatabaseScopedWriteTokensForPath:wc,readSqliteDatabasePendingScopedWriteToken:Tc,readSqliteDatabaseWriteTokenForPath:Ec,readSqliteDatabasePendingWriteToken:Dc}=vc,{getSqliteDatabaseAdmission:Oc,getOrLoadSqliteDatabaseAdmissionForPath:kc}=createSqliteDatabaseAdmissionReader({state:N,admission,pathAdmission,exchange,publishFact}),Ac=readSqliteDatabaseAdmissions(h(St)),Ac&&installSqliteDatabaseAdmissions(Ac)})))()}function init_openclaw_state_db_paths(){return(init_openclaw_state_db_paths=__esmMin((()=>{init_paths(),init_boundary_path(),init_sqlite_worker_identity()})))()}function getEnumValues(e){let t=Object.values(e).filter(e=>typeof e==`number`);return Object.entries(e).filter(([e,n])=>t.indexOf(+e)===-1).map(([e,t])=>t)}function joinValues(e,t=`|`){return e.map(e=>stringifyPrimitive(e)).join(t)}function jsonStringifyReplacer(e,t){return typeof t==`bigint`?t.toString():t}function cached(e){return new Cached(e)}function nullish(e){return e==null}function cleanRegex(e){let t=+!!e.startsWith(`^`),n=e.endsWith(`$`)?e.length-1:e.length;return e.slice(t,n)}function floatSafeRemainder(e,t){let n=e/t,r=Math.round(n),i=4*2**-52*Math.max(Math.abs(n),1);return Math.abs(n-r)<i?0:n-r}function assignProp(e,t,n){Object.defineProperty(e,t,{value:n,writable:!0,enumerable:!0,configurable:!0})}function rawShape(e){let t=Object.getOwnPropertyDescriptor(e,`shape`);return t?.get?t.get.raw:t?.value}function sourceShape(e){return rawShape(e._zod.def)??e._zod.def.shape}function deferProp(e,t,n){Object.defineProperty(e,t,{get(){let e=n();return assignProp(this,t,e),e},enumerable:!0,configurable:!0})}function putProp(e,t,n){t in e?assignProp(e,t,n):e[t]=n}function mirrorShape(e,t,n,r){let i=sourceShape(t);for(let a of n){let n=Object.getOwnPropertyDescriptor(i,a);n.enumerable&&(n.get?deferProp(e,a,()=>{let e=t._zod.def.shape[a];return r?r(e,a):e}):putProp(e,a,r?r(n.value,a):n.value))}}function mirrorProps(e,t){for(let n of Reflect.ownKeys(t)){let r=Object.getOwnPropertyDescriptor(t,n);r.enumerable&&(r.get?deferProp(e,n,()=>t[n]):putProp(e,n,r.value))}}function mergeDefs(...e){let t={};for(let n of e){let e=Object.getOwnPropertyDescriptors(n);Object.assign(t,e)}return Object.defineProperties({},t)}function esc(e){return JSON.stringify(e)}function slugify(e){return e.toLowerCase().trim().replace(/[^\w\s-]/g,``).replace(/[\s_-]+/g,`-`).replace(/^-+|-+$/g,``)}function isObject(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function isPlainObject(e){if(isObject(e)===!1)return!1;let t=e.constructor;if(t===void 0||typeof t!=`function`)return!0;let n=t.prototype;return isObject(n)!==!1&&Object.prototype.hasOwnProperty.call(n,`isPrototypeOf`)!==!1}function shallowClone(e){return isPlainObject(e)?{...e}:Array.isArray(e)?[...e]:e instanceof Map?new Map(e):e instanceof Set?new Set(e):e}function escapeRegex(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}function clone(e,t,n){let r=new e._zod.constr(t??e._zod.def);return(!t||n?.parent)&&(r._zod.parent=e),r}function normalizeParams(e){let t=e;if(!t)return{};if(typeof t==`string`)return{error:()=>t};if(t?.message!==void 0){if(t?.error!==void 0)throw Error("Cannot specify both `message` and `error` params");t.error=t.message}return delete t.message,typeof t.error==`string`?{...t,error:()=>t.error}:t}function stringifyPrimitive(e){return typeof e==`bigint`?e.toString()+`n`:typeof e==`string`?`"${e}"`:`${e}`}function optionalKeys(e){return Object.keys(e).filter(t=>e[t]._zod.optin!==void 0&&e[t]._zod.optout===`optional`)}function pick(e,t){let n=e._zod.def,r=n.checks;if(r&&r.length>0)throw Error(`.pick() cannot be used on object schemas containing refinements`);let i={};return mirrorShape(i,e,maskedKeys(e,t)),clone(e,mergeDefs(n,{shape:i,checks:[]}))}function maskedKeys(e,t){let n=sourceShape(e),r=[];for(let e of Reflect.ownKeys(t)){if(!Object.getOwnPropertyDescriptor(n,e)?.enumerable)throw Error(`Unrecognized key: "${String(e)}"`);t[e]&&r.push(e)}return r}function omit(e,t){let n=e._zod.def,r=n.checks;if(r&&r.length>0)throw Error(`.omit() cannot be used on object schemas containing refinements`);let i=new Set(maskedKeys(e,t)),a={};return mirrorShape(a,e,Reflect.ownKeys(sourceShape(e)).filter(e=>!i.has(e))),clone(e,mergeDefs(n,{shape:a,checks:[]}))}function extend(e,t){if(!isPlainObject(t))throw Error(`Invalid input to extend: expected a plain object`);let n=e._zod.def.checks;if(n&&n.length>0){let n=sourceShape(e);for(let e of Reflect.ownKeys(t))if(Object.getOwnPropertyDescriptor(n,e)!==void 0)throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.")}return clone(e,mergeDefs(e._zod.def,{shape:extended(e,t)}))}function extended(e,t){let n={};return mirrorShape(n,e,Reflect.ownKeys(sourceShape(e))),mirrorProps(n,t),n}function safeExtend(e,t){if(!isPlainObject(t))throw Error(`Invalid input to safeExtend: expected a plain object`);return clone(e,mergeDefs(e._zod.def,{shape:extended(e,t)}))}function merge(e,t){if(!t?._zod?.def)throw Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");if(e._zod.def.checks?.length)throw Error(`.merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.`);let n={};return mirrorShape(n,e,Reflect.ownKeys(sourceShape(e))),mirrorShape(n,t,Reflect.ownKeys(sourceShape(t))),clone(e,mergeDefs(e._zod.def,{shape:n,get catchall(){return t._zod.def.catchall},checks:t._zod.def.checks??[]}))}function partial(e,t,n,r=`partial`){let i=t._zod.def.checks;if(i&&i.length>0)throw Error(`.${r}() cannot be used on object schemas containing refinements`);let a=n?new Set(maskedKeys(t,n)):void 0,o={};return mirrorShape(o,t,Reflect.ownKeys(sourceShape(t)),e&&((t,n)=>a&&!a.has(n)?t:new e({type:`optional`,innerType:t}))),clone(t,mergeDefs(t._zod.def,{shape:o,checks:[]}))}function required(e,t,n){let r=n?new Set(maskedKeys(t,n)):void 0,i={};return mirrorShape(i,t,Reflect.ownKeys(sourceShape(t)),(t,n)=>r&&!r.has(n)?t:new e({type:`nonoptional`,innerType:t})),clone(t,mergeDefs(t._zod.def,{shape:i}))}function aborted(e,t=0){if(e.aborted===!0)return!0;for(let n=t;n<e.issues.length;n++)if(e.issues[n]?.continue!==!0)return!0;return!1}function explicitlyAborted(e,t=0){if(e.aborted===!0)return!0;for(let n=t;n<e.issues.length;n++)if(e.issues[n]?.continue===!1)return!0;return!1}function prefixIssues(e,t){return t.map(t=>{var n;return(n=t).path??(n.path=[]),t.path.unshift(e),t})}function unwrapMessage(e){return typeof e==`string`?e:e?.message}function attachSchema(e,t,n){var r;for(let i=t;i<e.length;i++)(r=e[i]).schema??(r.schema=n)}function finalizeIssue(e,t,n){var r;let i=e.inst?._zod?.traits;i?.has(`$ZodType`)&&(i.has(`$ZodCheck`)?(r=e).schema??(r.schema=e.inst):e.schema=e.inst);let a=e.schema===e.inst?void 0:e.schema?._zod.def?.error,o=e.message?e.message:unwrapMessage(e.inst?._zod.def?.error?.(e))??unwrapMessage(a?.(e))??unwrapMessage(t?.error?.(e))??unwrapMessage(n.customError?.(e))??unwrapMessage(n.localeError?.(e))??`Invalid input`,s={};for(let t of Object.keys(e))t!==`inst`&&t!==`schema`&&t!==`continue`&&t!==`input`&&t!==`__proto__`&&(s[t]=e[t]);return s.path??=[],s.message=o,t?.reportInput&&(s.input=e.input),s}function codePointLength(e){let t=e.length;if(!Ic.test(e))return t;let n=t;for(let r=0;r<t-1;r++)(e.charCodeAt(r)&64512)==55296&&(e.charCodeAt(r+1)&64512)==56320&&(n--,r++);return n}function getLengthableOrigin(e){return Array.isArray(e)?`array`:typeof e==`string`?`string`:`unknown`}function parsedType(e){let t=typeof e;switch(t){case`number`:return Number.isNaN(e)?`nan`:`number`;case`object`:{if(e===null)return`null`;if(Array.isArray(e))return`array`;let t=e;if(t&&Object.getPrototypeOf(t)!==Object.prototype&&`constructor`in t&&t.constructor)return t.constructor.name}}return t}function issue(...e){let[t,n,r]=e;return typeof t==`string`?{message:t,code:`custom`,input:n,inst:r}:{...t}}function members(e,t){for(let n in t){let r=Object.getOwnPropertyDescriptor(t,n);r.get?Object.defineProperty(e,n,{...r,enumerable:!1}):defineBound(e,n,r.value)}}function own(e,t,n,r=!0){return Object.defineProperty(e,t,{configurable:!0,writable:!0,enumerable:r,value:n}),n}function hide(e,t,n){return own(e,t,n,!1)}function derived(e,t){for(let n in e){let r=e[n];Object.defineProperty(t,n,{configurable:!0,enumerable:!0,get(){return own(this,n,r(this))},set(e){own(this,n,e)}})}return t}function defineBound(e,t,n){Object.defineProperty(e,t,{configurable:!0,get(){return this==null?n:own(this,t,n.bind(this))},set(e){own(this,t,e)}})}function claim(e,t){let n=Object.getPrototypeOf(e);return t in n?void 0:n}function defineLazyInternal(e,t,n){let r=Object.getPrototypeOf(e._zod);if(t in r&&Lc!==e._zod){Lc=void 0;return}Lc=e._zod,Object.defineProperty(r,t,{configurable:!0,get(){Object.defineProperty(this,t,zc);let e=Rc;Rc=!1;try{let r=n(this);return Rc?delete this[t]:Object.defineProperty(this,t,{configurable:!0,writable:!0,value:r}),Rc||=e,r}catch(n){throw delete this[t],Rc||=e,n}},set(e){Object.defineProperty(this,t,{configurable:!0,writable:!0,value:e})}})}function installLazyProp(e,t,n,r){let i=claim(e,t);i&&Object.defineProperty(i,t,{configurable:!0,get(){let e={configurable:!0,writable:!0,enumerable:r,value:void 0};return Object.defineProperty(this,t,e),e.value=n(this),Object.defineProperty(this,t,e),e.value},set(e){Object.defineProperty(this,t,{configurable:!0,writable:!0,enumerable:r,value:e})}})}function constantCatch(e){let fn=()=>e;return fn[Bc]=!0,fn}var Cached,jc,Mc,Nc,Pc,Fc,Ic,Lc,Rc,zc,Bc;function init_util(){return(init_util=__esmMin((()=>{init_core(),Cached=class{constructor(e){this._getter=e,this._value=void 0}get value(){let e=this._getter;return e!==void 0&&(this._value=e(),this._getter=void 0),this._value}},jc=`captureStackTrace`in Error?Error.captureStackTrace:(...e)=>{},Mc=/* @__PURE__*/ cached(()=>{if(Wc.jitless||typeof navigator<`u`&&navigator?.userAgent?.includes(`Cloudflare`))return!1;try{return Function(``),!0}catch{return!1}}),Nc=/* @__PURE__*/ new Set([`string`,`number`,`symbol`]),Pc={safeint:[-(2**53-1),2**53-1],int32:[-2147483648,2147483647],uint32:[0,4294967295],float32:[-34028234663852886e22,34028234663852886e22],float64:[-Number.MAX_VALUE,Number.MAX_VALUE]},Fc={int64:[/* @__PURE__*/ BigInt(`-9223372036854775808`),/* @__PURE__*/ BigInt(`9223372036854775807`)],uint64:[/* @__PURE__*/ BigInt(0),/* @__PURE__*/ BigInt(`18446744073709551615`)]},Ic=/[\uD800-\uDBFF]/,Rc=!1,zc={configurable:!0,get(){Rc=!0}},Bc=`~constantCatch`})))()}function newError(e){let t=Uc;if(t){let n=t.stackTraceLimit;if(typeof n==`number`){try{t.stackTraceLimit=0}catch{return Uc=null,new e}try{return new e}finally{t.stackTraceLimit=n}}}return new e}function $constructor(e,t,n,r){let i={};function Internals(e){this.def=e,this.constr=_,this.traits=/* @__PURE__ */ new Set}Internals.prototype=i;let a=n,o=a&&/* @__PURE__ */ new WeakSet;function init(n,r){if(!n._zod){Hc.value=new Internals(r);try{Object.defineProperty(n,"_zod",Hc)}finally{Hc.value=void 0}}else if(n._zod.traits.has(e))return;if(n._zod.traits.add(e),t(n,r),o){let e=Object.getPrototypeOf(n),t=n._zod.constr.prototype,r=e;for(;r&&r!==t;)r=Object.getPrototypeOf(r);let i=r??e;o.has(i)||(o.add(i),members(i,a))}let i=_.prototype;for(let e in i)Object.prototype.hasOwnProperty.call(i,e)&&(e in n||(n[e]=i[e].bind(n)))}let s=r?.Parent??Object;class Definition extends s{}Object.defineProperty(Definition,"name",{value:e});function _(e){let t=r?.Parent?newError(Definition):this;init(t,e);let n=t._zod.deferred;if(n){for(let e of n)e();t._zod.deferred=void 0}let i=globalThis.__zod_globalConfig?.postProcessor;return i&&i(t),t}return Object.defineProperty(_,"init",{value:init}),Object.defineProperty(_,Symbol.hasInstance,{value:t=>r?.Parent&&t instanceof r.Parent?!0:t?._zod?.traits?.has(e)}),Object.defineProperty(_,"name",{value:e}),_}function config(e){return e&&Object.assign(Wc,e),Wc}var Vc,Hc,Uc,$ZodAsyncError,$ZodEncodeError,Wc;function init_core(){return(init_core=__esmMin((()=>{init_util(),Hc={value:void 0,enumerable:!1},Uc=`captureStackTrace`in Error?Error:null,$ZodAsyncError=class extends Error{constructor(){super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`)}},$ZodEncodeError=class extends Error{constructor(e){super(`Encountered unidirectional transform during encode: ${e}`),this.name=`ZodEncodeError`}},(Vc=globalThis).__zod_globalConfig??(Vc.__zod_globalConfig={}),Wc=globalThis.__zod_globalConfig})))()}function _getMessage(){let e=this._zod;return e.message??=JSON.stringify(e.def,jsonStringifyReplacer,2),e.message}function _setMessage(e){this._zod.message=e}function node(e,t,n){return Object.prototype.hasOwnProperty.call(e,t)||(t===`__proto__`?Object.defineProperty(e,t,{value:n(),writable:!0,enumerable:!0,configurable:!0}):e[t]=n()),e[t]}function flattenError(e,t=e=>e.message){let n={},r=[];for(let i of e.issues)i.path.length>0?node(n,i.path[0],()=>[]).push(t(i)):r.push(t(i));return{formErrors:r,fieldErrors:n}}function formatError(e,t=e=>e.message){let n={_errors:[]},processError=(e,r=[])=>{for(let i of e.issues)if(i.code===`invalid_union`&&i.errors.length)i.errors.map(e=>processError({issues:e},[...r,...i.path]));else if(i.code===`invalid_key`)processError({issues:i.issues},[...r,...i.path]);else if(i.code===`invalid_element`)processError({issues:i.issues},[...r,...i.path]);else{let e=[...r,...i.path];if(e.length===0)n._errors.push(t(i));else{let r=n,a=0;for(;a<e.length;){let n=e[a],o=a===e.length-1;if(n===`_errors`){o&&r._errors.push(t(i)),a++;continue}Object.prototype.hasOwnProperty.call(r,n)||Object.defineProperty(r,n,{value:{_errors:[]},enumerable:!0,writable:!0,configurable:!0});let s=r[n];o&&s._errors.push(t(i)),r=s,a++}}}};return processError(e),n}var Gc,Kc,qc,initializer$1,Jc;function init_errors$2(){return(init_errors$2=__esmMin((()=>{init_core(),init_util(),Gc={get:_getMessage,set:_setMessage,enumerable:!0,configurable:!0},Kc={value:void 0,enumerable:!1},qc=/* @__PURE__ */ new WeakSet([Object.prototype,Error.prototype]),initializer$1=(e,t)=>{e.name=`$ZodError`,Kc.value=t,Object.defineProperty(e,"issues",Kc),Kc.value=void 0,Object.defineProperty(e,"message",Gc);let n=Object.getPrototypeOf(e);qc.has(n)||(qc.add(n),Object.defineProperty(n,"toString",{configurable:!0,enumerable:!1,get(){let value=()=>this.message;return Object.defineProperty(this,"toString",{value,configurable:!0,writable:!0}),value},set(e){Object.defineProperty(this,"toString",{value:e,configurable:!0,writable:!0})}}))},Jc=$constructor(`$ZodError`,initializer$1),$constructor(`$ZodError`,initializer$1,void 0,{Parent:Error})})))()}function finalizeParams(e,t){return{callee:t?.callee??e,Err:t?.Err}}function failure(e,t,n){let r;return{success:!1,get error(){return r||(r=new e(t.map(e=>finalizeIssue(e,n,config()))),t=void 0,n=void 0),r},set error(e){r=e,t=void 0,n=void 0}}}function validateFallback(e,t,n){let r=n?{...n,async:!1,abortEarly:!0}:{async:!1,abortEarly:!0},i=e._zod.bag.fallbackRun,a;if(i?(r[Xc]=!0,a=i({value:t,issues:[]},r)):a=e._zod.run({value:t,issues:[]},r),a instanceof Promise)throw new $ZodAsyncError;return a.issues.length===0}var _parse,_parseAsync,_safeParse,_safeParseAsync,Yc,Xc,validate,validateAsync$1,_encode,_decode,_encodeAsync,_decodeAsync,_safeEncode,_safeDecode,_safeEncodeAsync,_safeDecodeAsync;function init_parse(){return(init_parse=__esmMin((()=>{init_core(),init_util(),_parse=e=>{let fn=(t,n,r,i)=>{let a=r?{...r,async:!1}:{async:!1},o=t._zod.run({value:n,issues:[]},a);if(o instanceof Promise)throw new $ZodAsyncError;if(o.issues.length){let t=new((i?.Err)??e)(o.issues.map(e=>finalizeIssue(e,a,config())));throw jc(t,i?.callee??fn),t}return o.value};return fn},_parseAsync=e=>{let fn=async(t,n,r,i)=>{let a=r?{...r,async:!0}:{async:!0},o=t._zod.run({value:n,issues:[]},a);if(o instanceof Promise&&(o=await o),o.issues.length){let t=new((i?.Err)??e)(o.issues.map(e=>finalizeIssue(e,a,config())));throw jc(t,i?.callee??fn),t}return o.value};return fn},_safeParse=e=>(t,n,r)=>{let i=r?{...r,async:!1}:{async:!1},a=t._zod.run({value:n,issues:[]},i);if(a instanceof Promise)throw new $ZodAsyncError;return a.issues.length?failure(e,a.issues,i):{success:!0,data:a.value}},_safeParseAsync=e=>async(t,n,r)=>{let i=r?{...r,async:!0}:{async:!0},a=t._zod.run({value:n,issues:[]},i);return a instanceof Promise&&(a=await a),a.issues.length?failure(e,a.issues,i):{success:!0,data:a.value}},Yc=/* @__PURE__ */ Symbol.for(`zod.compile.invalid`),Xc=/* @__PURE__ */ Symbol.for(`zod.compile.fallback`),validate=((e,t,n)=>{let r=e._zod.bag.validator;if(r!==void 0){if(r(t)!==Yc)return!0;if(r.definite===!0&&n===void 0)return!1}return validateFallback(e,t,n)}),validateAsync$1=async(e,t,n)=>{let r=n?{...n,async:!0,abortEarly:!0}:{async:!0,abortEarly:!0},i=e._zod.run({value:t,issues:[]},r);return i instanceof Promise&&(i=await i),i.issues.length===0},_encode=e=>{let t=_parse(e),fn=(e,n,r,i)=>{let a=r?{...r,direction:`backward`}:{direction:`backward`};return t(e,n,a,finalizeParams(fn,i))};return fn},_decode=e=>{let t=_parse(e),fn=(e,n,r,i)=>t(e,n,r,finalizeParams(fn,i));return fn},_encodeAsync=e=>{let t=_parseAsync(e),fn=async(e,n,r,i)=>{let a=r?{...r,direction:`backward`}:{direction:`backward`};return await t(e,n,a,finalizeParams(fn,i))};return fn},_decodeAsync=e=>{let t=_parseAsync(e),fn=async(e,n,r,i)=>await t(e,n,r,finalizeParams(fn,i));return fn},_safeEncode=e=>(t,n,r)=>{let i=r?{...r,direction:`backward`}:{direction:`backward`};return _safeParse(e)(t,n,i)},_safeDecode=e=>(t,n,r)=>_safeParse(e)(t,n,r),_safeEncodeAsync=e=>async(t,n,r)=>{let i=r?{...r,direction:`backward`}:{direction:`backward`};return _safeParseAsync(e)(t,n,i)},_safeDecodeAsync=e=>async(t,n,r)=>_safeParseAsync(e)(t,n,r)})))()}function nanoidOfLength(e){return RegExp(`^[a-zA-Z0-9_-]{${e}}$`)}function emoji(){return new RegExp(ol,`u`)}function anchor(e){return RegExp(`^${e}$`)}function timeSource(e){let t=`(?:[01]\\d|2[0-3]):[0-5]\\d`;return typeof e.precision==`number`?e.precision===-1?`${t}`:e.precision===0?`${t}:[0-5]\\d`:`${t}:[0-5]\\d\\.\\d{${e.precision}}`:e.seconds?`${t}:[0-5]\\d(?:\\.\\d+)?`:`${t}(?::[0-5]\\d(?:\\.\\d+)?)?`}function time(e){return RegExp(`^${timeSource(e)}$`)}function datetime(e){let t=[`Z`];e.offset&&t.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);let n=`${timeSource({precision:e.precision,seconds:!0})}(?:${t.join(`|`)})`,r=e.local?`${n}|${timeSource({precision:e.precision})}`:n;return RegExp(`^${hl}T(?:${r})$`)}var Zc,Qc,$c,el,tl,nl,rl,il,uuid,al,ol,sl,cl,ll,ul,dl,fl,pl,ml,hl,gl,_l,vl,yl,bl;function init_regexes(){return(init_regexes=__esmMin((()=>{Zc=/^[cC][0-9a-z]{6,}$/,Qc=/^[0-9a-z]+$/,$c=/^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/,el=/^[0-9a-vA-V]{20}$/,tl=/^[A-Za-z0-9]{27}$/,nl=/^[a-zA-Z0-9_-]{21}$/,rl=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,il=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,uuid=e=>e?RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`):/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,al=/^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,ol=`^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`,sl=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,cl=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,ll=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,ul=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,dl=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,fl=/^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/,pl=/^https?$/,ml=/^\+[1-9]\d{6,14}$/,hl=`(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`,gl=/*@__PURE__*/ anchor(hl),_l=/^[\s\S]{0,}$/,vl=/^-?\d+(?:\.\d+)?$/,yl=/^[^A-Z]*$/,bl=/^[^a-z]*$/})))()}var P,_whenHasLength,xl,Sl,Cl,wl,Tl,El,Dl,Ol,kl,Al,jl,Ml,Nl,Pl,Fl,Il;function init_checks(){return(init_checks=__esmMin((()=>{init_core(),init_regexes(),init_util(),P=/*@__PURE__*/ $constructor(`$ZodCheck`,(e,t)=>{var n;e._zod??={},e._zod.def=t,(n=e._zod).onattach??(n.onattach=[])}),_whenHasLength=e=>{let t=e.value;return!nullish(t)&&t.length!==void 0},xl={number:`number`,bigint:`bigint`,object:`date`},Sl=/*@__PURE__*/ $constructor(`$ZodCheckLessThan`,(e,t)=>{P.init(e,t);let n=xl[typeof t.value];e._zod.check=r=>{(t.inclusive?r.value<=t.value:r.value<t.value)||r.issues.push({origin:xl[typeof r.value]??n,code:`too_big`,maximum:typeof t.value==`object`?t.value.getTime():t.value,input:r.value,inclusive:t.inclusive,inst:e,continue:!t.abort})}}),Cl=/*@__PURE__*/ $constructor(`$ZodCheckGreaterThan`,(e,t)=>{P.init(e,t);let n=xl[typeof t.value];e._zod.check=r=>{(t.inclusive?r.value>=t.value:r.value>t.value)||r.issues.push({origin:xl[typeof r.value]??n,code:`too_small`,minimum:typeof t.value==`object`?t.value.getTime():t.value,input:r.value,inclusive:t.inclusive,inst:e,continue:!t.abort})}}),wl=/*@__PURE__*/ $constructor(`$ZodCheckMultipleOf`,(e,t)=>{P.init(e,t),e._zod.check=n=>{if(typeof n.value!=typeof t.value)throw Error(`Cannot mix number and bigint in multiple_of check.`);(typeof n.value==`bigint`?t.value!==BigInt(0)&&n.value%t.value===BigInt(0):floatSafeRemainder(n.value,t.value)===0)||n.issues.push({origin:typeof n.value,code:`not_multiple_of`,divisor:t.value,input:n.value,inst:e,continue:!t.abort})}}),Tl=/*@__PURE__*/ $constructor(`$ZodCheckNumberFormat`,(e,t)=>{P.init(e,t),t.format=t.format||`float64`;let n=t.format?.includes(`int`),r=n?`int`:`number`,[i,a]=Pc[t.format];e._zod.check=o=>{let s=o.value;if(n){if(!Number.isInteger(s)){o.issues.push({expected:r,format:t.format,code:`invalid_type`,continue:!1,input:s,inst:e});return}if(!Number.isSafeInteger(s)){s>0?o.issues.push({input:s,code:`too_big`,maximum:2**53-1,note:`Integers must be within the safe integer range.`,inst:e,origin:r,inclusive:!0,continue:!t.abort}):o.issues.push({input:s,code:`too_small`,minimum:-(2**53-1),note:`Integers must be within the safe integer range.`,inst:e,origin:r,inclusive:!0,continue:!t.abort});return}}s<i&&o.issues.push({origin:`number`,input:s,code:`too_small`,minimum:i,inclusive:!0,inst:e,continue:!t.abort}),s>a&&o.issues.push({origin:`number`,input:s,code:`too_big`,maximum:a,inclusive:!0,inst:e,continue:!t.abort})}}),El=/*@__PURE__*/ $constructor(`$ZodCheckMaxLength`,(e,t)=>{var n;P.init(e,t),(n=e._zod.def).when??(n.when=_whenHasLength),e._zod.check=n=>{let r=n.value,i=r.length;if((typeof r==`string`&&i>t.maximum?codePointLength(r):i)<=t.maximum)return;let a=getLengthableOrigin(r);n.issues.push({origin:a,code:`too_big`,maximum:t.maximum,inclusive:!0,input:r,inst:e,continue:!t.abort})}}),Dl=/*@__PURE__*/ $constructor(`$ZodCheckMinLength`,(e,t)=>{var n;P.init(e,t),(n=e._zod.def).when??(n.when=_whenHasLength),e._zod.check=n=>{let r=n.value,i=r.length;if((typeof r==`string`&&i>=t.minimum&&i<t.minimum*2?codePointLength(r):i)>=t.minimum)return;let a=getLengthableOrigin(r);n.issues.push({origin:a,code:`too_small`,minimum:t.minimum,inclusive:!0,input:r,inst:e,continue:!t.abort})}}),Ol=/*@__PURE__*/ $constructor(`$ZodCheckLengthEquals`,(e,t)=>{var n;P.init(e,t),(n=e._zod.def).when??(n.when=_whenHasLength),e._zod.check=n=>{let r=n.value,i=r.length,a=typeof r==`string`&&i>=t.length&&i<=t.length*2?codePointLength(r):i;if(a===t.length)return;let o=getLengthableOrigin(r),s=a>t.length;n.issues.push({origin:o,...s?{code:`too_big`,maximum:t.length}:{code:`too_small`,minimum:t.length},inclusive:!0,exact:!0,input:n.value,inst:e,continue:!t.abort})}}),kl=/*@__PURE__*/ $constructor(`$ZodCheckStringFormat`,(e,t)=>{var n,r;P.init(e,t),t.pattern?(n=e._zod).check??(n.check=n=>{t.pattern.lastIndex=0,!t.pattern.test(n.value)&&n.issues.push({origin:`string`,code:`invalid_format`,format:t.format,input:n.value,...t.pattern?{pattern:t.pattern.toString()}:{},inst:e,continue:!t.abort})}):(r=e._zod).check??(r.check=()=>{})}),Al=/*@__PURE__*/ $constructor(`$ZodCheckRegex`,(e,t)=>{kl.init(e,t),e._zod.check=n=>{t.pattern.lastIndex=0,!t.pattern.test(n.value)&&n.issues.push({origin:`string`,code:`invalid_format`,format:`regex`,input:n.value,pattern:t.pattern.toString(),inst:e,continue:!t.abort})}}),jl=/*@__PURE__*/ $constructor(`$ZodCheckLowerCase`,(e,t)=>{t.pattern??=yl,kl.init(e,t)}),Ml=/*@__PURE__*/ $constructor(`$ZodCheckUpperCase`,(e,t)=>{t.pattern??=bl,kl.init(e,t)}),Nl=/*@__PURE__*/ $constructor(`$ZodCheckIncludes`,(e,t)=>{P.init(e,t);let n=escapeRegex(t.includes);t.pattern=new RegExp(typeof t.position==`number`?`^.{${t.position},}${n}`:n),e._zod.check=n=>{n.value.includes(t.includes,t.position)||n.issues.push({origin:`string`,code:`invalid_format`,format:`includes`,includes:t.includes,input:n.value,inst:e,continue:!t.abort})}}),Pl=/*@__PURE__*/ $constructor(`$ZodCheckStartsWith`,(e,t)=>{P.init(e,t);let n=RegExp(`^${escapeRegex(t.prefix)}.*`);t.pattern??=n,e._zod.check=n=>{n.value.startsWith(t.prefix)||n.issues.push({origin:`string`,code:`invalid_format`,format:`starts_with`,prefix:t.prefix,input:n.value,inst:e,continue:!t.abort})}}),Fl=/*@__PURE__*/ $constructor(`$ZodCheckEndsWith`,(e,t)=>{P.init(e,t);let n=RegExp(`.*${escapeRegex(t.suffix)}$`);t.pattern??=n,e._zod.check=n=>{n.value.endsWith(t.suffix)||n.issues.push({origin:`string`,code:`invalid_format`,format:`ends_with`,suffix:t.suffix,input:n.value,inst:e,continue:!t.abort})}}),Il=/*@__PURE__*/ $constructor(`$ZodCheckOverwrite`,(e,t)=>{P.init(e,t),e._zod.check=e=>{e.value=t.tx(e.value)}})})))()}var Doc;function init_doc(){return(init_doc=__esmMin((()=>{Doc=class{constructor(e=[],t={}){this.content=[],this.indent=0,this.args=e,this.closed=t}indented(e){this.indent+=1;try{e(this)}finally{--this.indent}}write(e){if(typeof e==`function`){e(this,{execution:`sync`}),e(this,{execution:`async`});return}let t=e.split(`
`).filter(e=>e),n=Math.min(...t.map(e=>e.length-e.trimStart().length)),r=t.map(e=>e.slice(n)).map(e=>` `.repeat(this.indent*2)+e);for(let e of r)this.content.push(e)}compile(){let e=Function,t=this?.content??[``];return new e(...Object.keys(this.closed),`return function (${this.args.join(`, `)}) {\n${t.join(`
`)}\n};`)(...Object.values(this.closed))}}})))()}var Ll;function init_versions(){return(init_versions=__esmMin((()=>{Ll={major:4,minor:6,patch:5}})))()}async function validateAsync(e,t){let n={async:!0};return toStandardResult(await e._zod.run({value:t,issues:[]},n),n)}function standardProps(e){return{validate:t=>{let n={async:!1};try{let r=e._zod.run({value:t,issues:[]},n);if(!(r instanceof Promise))return toStandardResult(r,n)}catch{}return validateAsync(e,t)},vendor:`zod`,version:1}}function canParseURL(e){try{return typeof URL<`u`&&typeof URL.canParse==`function`?URL.canParse(e):(new URL(e),!0)}catch{return!1}}function validateURL(e,t){return!(`normalize`in t)&&!(`hostname`in t)&&!(`protocol`in t)?canParseURL(e)||2:parseURLObject(e,t)}function parseURLObject(e,t){if(!t.normalize&&t.protocol?.source===pl.source&&!/^https?:\/\//i.test(e))return 1;try{if(typeof URL<`u`){let t=URL;if(typeof t.parse==`function`)return t.parse(e)??2}return new URL(e)}catch{return 2}}function stripTabAndNewline(e){return e.replace(Hl,``)}function urlHostnameOk(e,t){return t.lastIndex=0,t.test(e.hostname)}function urlProtocolOk(e,t){return t.lastIndex=0,t.test(e.protocol.endsWith(`:`)?e.protocol.slice(0,-1):e.protocol)}function isValidIPv6(e){return nu.test(e)?canParseURL(`http://[${e}]`):!1}function isValidCIDRv6(e){let t=e.split(`/`);if(t.length!==2)return!1;let[n,r]=t;if(!r)return!1;let i=Number(r);return`${i}`!==r||i<0||i>128?!1:isValidIPv6(n)}function isValidBase64(e){if(e===``)return!0;if(/\s/.test(e)||e.length%4!=0)return!1;try{return atob(e),!0}catch{return!1}}function isValidBase64URL(e){if(!cu.test(e))return!1;let t=e.replace(/[-_]/g,e=>e===`-`?`+`:`/`);return isValidBase64(t.padEnd(Math.ceil(t.length/4)*4,`=`))}function isValidJWT(e,t=null){try{let n=e.split(`.`);if(n.length!==3)return!1;let[r]=n;if(!r)return!1;let i=JSON.parse(atob(r));return!(`typ`in i&&i?.typ!==`JWT`||!i.alg||t&&(!(`alg`in i)||i.alg!==t))}catch{return!1}}function handleArrayResult(e,t,n){e.issues.length&&t.issues.push(...prefixIssues(n,e.issues)),t.value[n]=e.value}function handlePropertyResult(e,t,n,r,i,a){let o=n in r,s=a===`optional`;if(o||!s||i!==`optional`){if(e.issues.length){if(i!==void 0&&s&&!o)return;t.issues.push(...prefixIssues(n,e.issues))}if(!o&&i===void 0){e.issues.length||t.issues.push({code:`invalid_type`,expected:`nonoptional`,input:void 0,path:[n]});return}e.value===void 0?(o||i===`defaulted`&&!s)&&(t.value[n]=void 0):t.value[n]=e.value}}function normalizeDef(e){let t=Object.keys(e.shape),n=Object.getOwnPropertySymbols(e.shape),r=n.length?n:_u,i=r.length?[...t,...r]:t;for(let t of i)if(!e.shape?.[t]?._zod?.traits?.has(`$ZodType`))throw Error(`Invalid element at key "${String(t)}": expected a Zod schema`);let a=optionalKeys(e.shape);return{...e,allKeys:i,symbolKeys:r,keySet:new Set(t),numKeys:t.length,optionalKeys:new Set(a)}}function handleCatchall(e,t,n,r,i,a,o){let s=[],c=i.keySet,l=i.catchall._zod,u=l.def.type,d=l.optin,f=l.optout,p=0;for(let i in t){if(o&&n.issues.length!==p){if(aborted(n,p))break;p=n.issues.length}if(c.has(i))continue;if(i===`__proto__`){u===`never`&&s.push(i);continue}if(u===`never`){s.push(i);continue}let a=l.run({value:t[i],issues:[]},r);a instanceof Promise?e.push(a.then(e=>handlePropertyResult(e,n,i,t,d,f))):handlePropertyResult(a,n,i,t,d,f)}return s.length&&n.issues.push({code:`unrecognized_keys`,keys:s,input:t,inst:a,continue:!0}),e.length?Promise.all(e).then(()=>n):n}function handleUnionResults(e,t,n,r){for(let n of e)if(n.issues.length===0)return t.value=n.value,t;let i=e.filter(e=>!aborted(e));return i.length===1?(t.value=i[0].value,i[0]):(t.issues.push({code:`invalid_union`,input:t.value,inst:n,errors:e.map(e=>e.issues.map(e=>finalizeIssue(e,r,config())))}),t)}function discriminatorMap(e){let t=/* @__PURE__ */ new Map;for(let n of e.options){let r=n._zod.propValues?.[e.discriminator];if(!r||r.size===0)throw Error(`Invalid discriminated union option at index "${e.options.indexOf(n)}"`);for(let e of r)if(t.has(e)){if(e!==void 0)throw Error(`Duplicate discriminator value "${String(e)}"`);t.set(e,null)}else t.set(e,n)}return t}function mergeValues(e,t){if(e===t||e instanceof Date&&t instanceof Date&&+e==+t)return{valid:!0,data:e};if(isPlainObject(e)&&isPlainObject(t)){let n=Object.keys(t),r=Object.keys(e).filter(e=>n.indexOf(e)!==-1),i={...e,...t};Object.prototype.hasOwnProperty.call(i,`__proto__`)&&delete i.__proto__;for(let n of r){if(n===`__proto__`)continue;let r=mergeValues(e[n],t[n]);if(!r.valid)return{valid:!1,mergeErrorPath:[n,...r.mergeErrorPath]};i[n]=r.data}return{valid:!0,data:i}}if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return{valid:!1,mergeErrorPath:[]};let n=[];for(let r=0;r<e.length;r++){let i=e[r],a=t[r],o=mergeValues(i,a);if(!o.valid)return{valid:!1,mergeErrorPath:[r,...o.mergeErrorPath]};n.push(o.data)}return{valid:!0,data:n}}return{valid:!1,mergeErrorPath:[]}}function handleIntersectionResults(e,t,n){let r=/* @__PURE__ */ new Map,i,a=/* @__PURE__ */ new Map,collect=(e,t)=>{let n;if(e.code===`unrecognized_keys`&&!e.path?.length)i??=e,n=e.keys;else if(e.code===`invalid_key`&&e.origin===`record`&&e.path?.length===1){let t=String(e.path[0]);a.has(t)||a.set(t,e),n=[t]}else return!1;for(let e of n)r.has(e)||r.set(e,{}),r.get(e)[t]=!0;return!0};for(let n of t.issues)collect(n,`l`)||e.issues.push(n);for(let t of n.issues)collect(t,`r`)||e.issues.push(t);let o=[...r].filter(([,e])=>e.l&&e.r).map(([e])=>e);if(o.length){let t=i?o.filter(e=>i.keys.includes(e)):[];t.length&&e.issues.push({...i,keys:t});for(let n of o)!t.includes(n)&&a.has(n)&&e.issues.push(a.get(n))}let s=mergeValues(t.value,n.value);if(!s.valid){if(aborted(e))return e;throw Error(`Unmergable intersection. Error path: ${JSON.stringify(s.mergeErrorPath)}`)}return e.value=s.data,e}function handleOptionalResult(e,t){return e.value=t.issues.length?void 0:t.value,e}function handleDefaultResult(e,t){return e.value===void 0&&(e.value=t.defaultValue),e}function handleNonOptionalResult(e,t){return!e.issues.length&&e.value===void 0&&e.issues.push({code:`invalid_type`,expected:`nonoptional`,input:e.value,inst:t}),e}function handleCatchResult(e,t,n,r){return t.issues.length?(e.value=n.catchValue({...t,value:e.value,error:{issues:t.issues.map(e=>finalizeIssue(e,r,config()))},input:e.value}),e):(e.value=t.value,t.memo&&(e.memo=!0),e)}function handlePipeResult(e,t,n){return e.issues.some(e=>e.code!==`unrecognized_keys`)?(e.aborted=!0,e):t._zod.run({value:e.value,issues:e.issues},n)}function handleReadonlyResult(e){return e.memo||(e.value=Object.freeze(e.value)),e}function handleRefineResult(e,t,n,r){if(!e){let e={code:`custom`,input:n,inst:r,path:[...r._zod.def.path??[]],continue:!r._zod.def.abort};r._zod.def.params&&(e.params=r._zod.def.params),t.issues.push(issue(e))}}var F,toStandardResult,Rl,I,zl,Bl,Vl,Hl,Ul,Wl,Gl,Kl,ql,Jl,Yl,Xl,Zl,Ql,$l,eu,tu,nu,ru,iu,au,ou,su,cu,lu,uu,du,fu,pu,mu,hu,gu,_u,vu,yu,bu,xu,Su,Cu,wu,Tu,Eu,Du,Ou,ku,Au,ju,Mu,Nu,Pu,Fu;function init_schemas(){return(init_schemas=__esmMin((()=>{init_checks(),init_core(),init_doc(),init_regexes(),init_util(),init_versions(),F=/*@__PURE__*/ $constructor(`$ZodType`,(e,t)=>{var n;e??={},e._zod.def=t,e._zod.bag=e._zod.bag||{},e._zod.version=Ll;let r=e._zod.def.checks,i=e._zod.traits.has(`$ZodCheck`)?[e,...r??[]]:r?.length?[...r]:[];for(let t of i)for(let n of t._zod.onattach)n(e);if(i.length===0)(n=e._zod).deferred??(n.deferred=[]),e._zod.deferred?.push(()=>{e._zod.run=e._zod.parse});else{let runChecks=(t,n,r)=>{if(t.memo)return t;let i=aborted(t),a;for(let o of n){if(o._zod.def.when){if(explicitlyAborted(t)||!o._zod.def.when(t))continue}else if(i)continue;let n=t.issues.length,s=o._zod.check(t);if(s instanceof Promise&&r?.async===!1)throw new $ZodAsyncError;if(a||s instanceof Promise)a=(a??Promise.resolve()).then(async()=>{await s,t.issues.length!==n&&(attachSchema(t.issues,n,e),i||=aborted(t,n))});else{if(t.issues.length===n)continue;attachSchema(t.issues,n,e),i||=aborted(t,n)}}return a?a.then(()=>t):t},handleCanaryResult=(t,n,r)=>{if(aborted(t))return t.aborted=!0,t;let a=runChecks(n,i,r);if(a instanceof Promise){if(r.async===!1)throw new $ZodAsyncError;return a.then(t=>e._zod.parse(t,r))}return e._zod.parse(a,r)};e._zod.run=(t,n)=>{if(n.skipChecks)return e._zod.parse(t,n);if(n.direction===`backward`){let r=e._zod.parse({value:t.value,issues:[]},{...n,skipChecks:!0});return r instanceof Promise?r.then(e=>handleCanaryResult(e,t,n)):handleCanaryResult(r,t,n)}let r=e._zod.parse(t,n);if(r instanceof Promise){if(n.async===!1)throw new $ZodAsyncError;return r.then(e=>runChecks(e,i,n))}return runChecks(r,i,n)}}},{get"~standard"(){return hide(this,`~standard`,standardProps(this))},set"~standard"(e){own(this,`~standard`,e)}}),toStandardResult=(e,t)=>e.issues.length?{issues:e.issues.map(e=>finalizeIssue(e,t,config()))}:{value:e.value},Rl=/*@__PURE__*/ $constructor(`$ZodString`,(e,t)=>{F.init(e,t),e._zod.pattern=t.pattern??_l,e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=String(n.value)}catch{}return typeof n.value==`string`||n.issues.push({expected:`string`,code:`invalid_type`,input:n.value,inst:e}),n}}),I=/*@__PURE__*/ $constructor(`$ZodStringFormat`,(e,t)=>{kl.init(e,t),Rl.init(e,t)}),zl=/*@__PURE__*/ $constructor(`$ZodGUID`,(e,t)=>{t.pattern??=il,I.init(e,t)}),Bl=/*@__PURE__*/ $constructor(`$ZodUUID`,(e,t)=>{if(t.version){let e={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[t.version];if(e===void 0)throw Error(`Invalid UUID version: "${t.version}"`);t.pattern??=uuid(e)}else t.pattern??=uuid();I.init(e,t)}),Vl=/*@__PURE__*/ $constructor(`$ZodEmail`,(e,t)=>{t.pattern??=al,I.init(e,t)}),Hl=/[\t\n\r]/g,Ul=/*@__PURE__*/ $constructor(`$ZodURL`,(e,t)=>{I.init(e,t),e._zod.check=n=>{try{let r=n.value.trim(),i=validateURL(r,t);if(i===1){n.issues.push({code:`invalid_format`,format:`url`,note:`Invalid URL format`,input:n.value,inst:e,continue:!t.abort});return}if(i===2){n.issues.push({code:`invalid_format`,format:`url`,input:n.value,inst:e,continue:!t.abort});return}if(i===!0){n.value=stripTabAndNewline(r);return}t.hostname&&!urlHostnameOk(i,t.hostname)&&n.issues.push({code:`invalid_format`,format:`url`,note:`Invalid hostname`,pattern:t.hostname.source,input:n.value,inst:e,continue:!t.abort}),t.protocol&&!urlProtocolOk(i,t.protocol)&&n.issues.push({code:`invalid_format`,format:`url`,note:`Invalid protocol`,pattern:t.protocol.source,input:n.value,inst:e,continue:!t.abort}),n.value=t.normalize?i.href:stripTabAndNewline(r);return}catch{n.issues.push({code:`invalid_format`,format:`url`,input:n.value,inst:e,continue:!t.abort})}}}),Wl=/*@__PURE__*/ $constructor(`$ZodEmoji`,(e,t)=>{t.pattern??=emoji(),I.init(e,t)}),Gl=/*@__PURE__*/ $constructor(`$ZodNanoID`,(e,t)=>{if(t.length!==void 0&&(!Number.isInteger(t.length)||t.length<1))throw Error(`Invalid nanoid length: ${t.length}`);t.pattern??=t.length===void 0?nl:nanoidOfLength(t.length),I.init(e,t)}),Kl=/*@__PURE__*/ $constructor(`$ZodCUID`,(e,t)=>{t.pattern??=Zc,I.init(e,t)}),ql=/*@__PURE__*/ $constructor(`$ZodCUID2`,(e,t)=>{t.pattern??=Qc,I.init(e,t)}),Jl=/*@__PURE__*/ $constructor(`$ZodULID`,(e,t)=>{t.pattern??=$c,I.init(e,t)}),Yl=/*@__PURE__*/ $constructor(`$ZodXID`,(e,t)=>{t.pattern??=el,I.init(e,t)}),Xl=/*@__PURE__*/ $constructor(`$ZodKSUID`,(e,t)=>{t.pattern??=tl,I.init(e,t)}),Zl=/*@__PURE__*/ $constructor(`$ZodISODateTime`,(e,t)=>{t.pattern??=datetime(t),I.init(e,t)}),Ql=/*@__PURE__*/ $constructor(`$ZodISODate`,(e,t)=>{t.pattern??=gl,I.init(e,t)}),$l=/*@__PURE__*/ $constructor(`$ZodISOTime`,(e,t)=>{t.pattern??=time(t),I.init(e,t)}),eu=/*@__PURE__*/ $constructor(`$ZodISODuration`,(e,t)=>{t.pattern??=rl,I.init(e,t)}),tu=/*@__PURE__*/ $constructor(`$ZodIPv4`,(e,t)=>{t.pattern??=sl,I.init(e,t)}),nu=/^[0-9a-fA-F:.]+$/,ru=/*@__PURE__*/ $constructor(`$ZodIPv6`,(e,t)=>{t.pattern??=cl,I.init(e,t),e._zod.check=n=>{isValidIPv6(n.value)||n.issues.push({code:`invalid_format`,format:`ipv6`,input:n.value,inst:e,continue:!t.abort})}}),iu=/*@__PURE__*/ $constructor(`$ZodCIDRv4`,(e,t)=>{t.pattern??=ll,I.init(e,t)}),au=/*@__PURE__*/ $constructor(`$ZodCIDRv6`,(e,t)=>{t.pattern??=ul,I.init(e,t),e._zod.check=n=>{isValidCIDRv6(n.value)||n.issues.push({code:`invalid_format`,format:`cidrv6`,input:n.value,inst:e,continue:!t.abort})}}),ou=/^[0-9a-zA-Z+/]*={0,2}$/,su=/*@__PURE__*/ $constructor(`$ZodBase64`,(e,t)=>{t.pattern??=ou,I.init(e,t),e._zod.check=n=>{isValidBase64(n.value)||n.issues.push({code:`invalid_format`,format:`base64`,input:n.value,inst:e,continue:!t.abort})}}),cu=/^[A-Za-z0-9_-]*$/,lu=/*@__PURE__*/ $constructor(`$ZodBase64URL`,(e,t)=>{t.pattern??=cu,I.init(e,t),e._zod.check=n=>{isValidBase64URL(n.value)||n.issues.push({code:`invalid_format`,format:`base64url`,input:n.value,inst:e,continue:!t.abort})}}),uu=/*@__PURE__*/ $constructor(`$ZodE164`,(e,t)=>{t.pattern??=ml,I.init(e,t)}),du=/*@__PURE__*/ $constructor(`$ZodJWT`,(e,t)=>{I.init(e,t),e._zod.check=n=>{isValidJWT(n.value,t.alg)||n.issues.push({code:`invalid_format`,format:`jwt`,input:n.value,inst:e,continue:!t.abort})}}),fu=/*@__PURE__*/ $constructor(`$ZodNumber`,(e,t)=>{F.init(e,t),e._zod.pattern=vl,e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=Number(n.value)}catch{}let i=n.value;if(typeof i==`number`&&!Number.isNaN(i)&&Number.isFinite(i))return n;let a=typeof i==`number`?Number.isNaN(i)?`NaN`:Number.isFinite(i)?void 0:String(i):void 0;return n.issues.push({expected:`number`,code:`invalid_type`,input:i,inst:e,...a?{received:a}:{}}),n}}),pu=/*@__PURE__*/ $constructor(`$ZodNumberFormat`,(e,t)=>{Tl.init(e,t),fu.init(e,t)}),mu=/*@__PURE__*/ $constructor(`$ZodUnknown`,(e,t)=>{F.init(e,t),e._zod.parse=e=>e}),hu=/*@__PURE__*/ $constructor(`$ZodNever`,(e,t)=>{F.init(e,t),e._zod.parse=(t,n)=>(t.issues.push({expected:`never`,code:`invalid_type`,input:t.value,inst:e}),t)}),gu=/*@__PURE__*/ $constructor(`$ZodArray`,(e,t)=>{F.init(e,t);let n=Wc.memoizer;n?.attach(e),e._zod.parse=(r,i)=>{let a=r.value;if(!Array.isArray(a))return r.issues.push({expected:`array`,code:`invalid_type`,input:a,inst:e}),r;r.value=n?n.alloc(e,r,Array(a.length),i):Array(a.length);let o=[],s=i?.abortEarly;for(let e=0;e<a.length;e++){let n=a[e],c=t.element._zod.run({value:n,issues:[]},i);if(c instanceof Promise)o.push(c.then(t=>handleArrayResult(t,r,e)));else if(handleArrayResult(c,r,e),s&&c.issues.length!==0&&aborted(c))break}return o.length?Promise.all(o).then(()=>r):r}}),_u=[],vu=/*@__PURE__*/ $constructor(`$ZodObject`,(e,t)=>{F.init(e,t);let n=Object.getOwnPropertyDescriptor(t,`shape`),r=n?.get?n.get.raw:t.shape??{};if(r){let get=()=>{let e={...r};return Object.defineProperty(t,"shape",{value:e}),get.raw=e,e};get.raw=r,Object.defineProperty(t,"shape",{get})}let i=cached(()=>normalizeDef(t));defineLazyInternal(e,`propValues`,e=>{let t=e.def.shape,n={};for(let e in t){let r=t[e]._zod;if(r.values){Object.prototype.hasOwnProperty.call(n,e)||assignProp(n,e,/* @__PURE__ */ new Set);for(let t of r.values)n[e].add(t);r.optin!==void 0&&n[e].add(void 0)}}return n});let a=isObject,o=t.catchall,s,c=Wc.memoizer;c?.attach(e),e._zod.parse=(t,n)=>{s??=i.value;let r=t.value;if(!a(r))return t.issues.push({expected:`object`,code:`invalid_type`,input:r,inst:e}),t;t.value=c?c.alloc(e,t,{},n):{};let l=[],u=s.shape,d=n?.abortEarly,f=t.issues.length;for(let e of s.allKeys){if(d&&t.issues.length!==f){if(aborted(t,f))break;f=t.issues.length}if(e===`__proto__`)continue;let i=u[e],a=i._zod.optin,o=i._zod.optout,s=i._zod.run({value:r[e],issues:[]},n);s instanceof Promise?l.push(s.then(n=>handlePropertyResult(n,t,e,r,a,o))):handlePropertyResult(s,t,e,r,a,o)}return o?handleCatchall(l,r,t,n,i.value,e,d===!0):l.length?Promise.all(l).then(()=>t):t}}),yu=/*@__PURE__*/ $constructor(`$ZodObjectJIT`,(e,t)=>{vu.init(e,t);let n=e._zod.parse,r=cached(()=>normalizeDef(t)),i=Wc.memoizer,generateFastpass=t=>{let n=r.value,a=n.symbolKeys,o=new Doc([`payload`,`ctx`],{shape:t,inst:e,memo:i,syms:a}),parseStr=e=>`shape[${e}]._zod.run({ value: input[${e}], issues: [] }, ctx)`,prefixStr=(e,t)=>`
          let ${e}_ab = false;
          for (let i = 0; i < ${e}.issues.length; i++) {
            const iss = ${e}.issues[i];
            iss.path = iss.path ? [${t}, ...iss.path] : [${t}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${e}_ab = true;
          }
          if (${e}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;o.write(`const input = payload.value;`);let s=Object.create(null),c=0;for(let e of n.allKeys)s[e]=`key_${c++}`;o.write(i?`const newResult = memo.alloc(inst, payload, {}, ctx);`:`const newResult = {};`);for(let e of n.allKeys){if(e===`__proto__`)continue;let n=s[e],r=typeof e==`symbol`?`syms[${a.indexOf(e)}]`:esc(e),i=`${r} in input`,c=t[e],l=c?._zod?.optin,u=l!==void 0,d=c?._zod?.optout===`optional`;if(o.write(`const ${n} = ${parseStr(r)};`),u&&d){let e=l===`optional`?`${n}_present`:`${n}.value !== undefined || ${n}_present`;o.write(`
        const ${n}_present = ${i};
        if (!${n}.issues.length || ${n}_present) {
          if (${n}.issues.length) {${prefixStr(n,r)}
          }

          if (${e}) {
            newResult[${r}] = ${n}.value;
          }
        }

      `)}else u?(o.write(`
        if (${n}.issues.length) {${prefixStr(n,r)}
        }
      `),l===`defaulted`?o.write(`newResult[${r}] = ${n}.value;`):o.write(`
        if (${n}.value !== undefined || ${i}) {
          newResult[${r}] = ${n}.value;
        }
      `)):o.write(`
        const ${n}_present = ${i};
        if (${n}.issues.length) {${prefixStr(n,r)}
        }
        if (!${n}_present && !${n}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${r}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${n}_present) {
          newResult[${r}] = ${n}.value;
        }

      `)}return o.write(`payload.value = newResult;`),o.write(`return payload;`),o.compile()},a,o=isObject,s=!Wc.jitless,c=s&&Mc.value,l=t.catchall,u;e._zod.parse=(i,d)=>{u??=r.value;let f=i.value;return o(f)?s&&c&&d?.async===!1&&d.jitless!==!0?(a||=generateFastpass(t.shape),i=a(i,d),l?handleCatchall([],f,i,d,u,e,d?.abortEarly===!0):i):n(i,d):(i.issues.push({expected:`object`,code:`invalid_type`,input:f,inst:e}),i)}}),bu=/*@__PURE__*/ $constructor(`$ZodUnion`,(e,t)=>{F.init(e,t),defineLazyInternal(e,`optin`,e=>e.def.options.some(e=>e._zod.optin===`defaulted`)?`defaulted`:e.def.options.some(e=>e._zod.optin!==void 0)?`optional`:void 0),defineLazyInternal(e,`optout`,e=>e.def.options.some(e=>e._zod.optout===`optional`)?`optional`:void 0),defineLazyInternal(e,`values`,e=>{if(e.def.options.every(e=>e._zod.values))return new Set(e.def.options.flatMap(e=>Array.from(e._zod.values)))}),defineLazyInternal(e,`pattern`,e=>{if(e.def.options.every(e=>e._zod.pattern)){let t=e.def.options.map(e=>e._zod.pattern);return RegExp(`^(${t.map(e=>cleanRegex(e.source)).join(`|`)})$`)}});let n=t.options.length===1?t.options[0]._zod.run:null;e._zod.parse=(r,i)=>{if(n)return n(r,i);let a=!1,o=[];for(let e of t.options){let t=e._zod.run({value:r.value,issues:[]},i);if(t instanceof Promise)o.push(t),a=!0;else{if(t.issues.length===0)return t;o.push(t)}}return a?Promise.all(o).then(t=>handleUnionResults(t,r,e,i)):handleUnionResults(o,r,e,i)}}),xu=/*@__PURE__*/ $constructor(`$ZodDiscriminatedUnion`,(e,t)=>{t.inclusive=!1,bu.init(e,t);let n=e._zod.parse;defineLazyInternal(e,`propValues`,e=>{let t={},n=0;for(let r of e.def.options){let i=r._zod.propValues;if(!i||Object.keys(i).length===0)throw Error(`Invalid discriminated union option at index "${e.def.options.indexOf(r)}"`);i[e.def.discriminator]?.has(void 0)&&n++;for(let[e,n]of Object.entries(i)){Object.prototype.hasOwnProperty.call(t,e)||assignProp(t,e,/* @__PURE__ */ new Set);for(let r of n)t[e].add(r)}}return!e.def.unionFallback&&n>1&&t[e.def.discriminator]?.delete(void 0),t}),t.options.forEach((e,n)=>{let r=rawShape(e._zod.def);if(r&&!Object.prototype.hasOwnProperty.call(r,t.discriminator))throw Error(`Invalid discriminated union option at index "${n}"`)});let r=cached(()=>discriminatorMap(t));e._zod.parse=(i,a)=>{let o=i.value;if(!isObject(o))return i.issues.push({code:`invalid_type`,expected:`object`,input:o,inst:e}),i;let s=o?.[t.discriminator],c=r.value.get(s);return c&&(s!==void 0||a.direction!==`backward`)?c._zod.run(i,a):t.unionFallback||a.direction===`backward`?n(i,a):(i.issues.push({code:`invalid_union`,errors:[],note:`No matching discriminator`,discriminator:t.discriminator,options:Array.from(r.value.keys()).filter(e=>r.value.get(e)!==null),input:o,path:[t.discriminator],inst:e}),i)}}),Su=/*@__PURE__*/ $constructor(`$ZodIntersection`,(e,t)=>{F.init(e,t),e._zod.parse=(e,n)=>{let r=e.value,i=t.left._zod.run({value:r,issues:[]},n),a=t.right._zod.run({value:r,issues:[]},n);return i instanceof Promise||a instanceof Promise?Promise.all([i,a]).then(([t,n])=>handleIntersectionResults(e,t,n)):handleIntersectionResults(e,i,a)}}),Cu=/*@__PURE__*/ $constructor(`$ZodEnum`,(e,t)=>{F.init(e,t);let n=getEnumValues(t.entries),r=new Set(n);e._zod.values=r,defineLazyInternal(e,`pattern`,e=>{let t=getEnumValues(e.def.entries).filter(e=>Nc.has(typeof e));return RegExp(t.length?`^(${t.map(e=>escapeRegex(e.toString())).join(`|`)})$`:`^[^\\s\\S]$`)}),e._zod.parse=(t,i)=>{let a=t.value;return r.has(a)||t.issues.push({code:`invalid_value`,values:n,input:a,inst:e}),t}}),wu=/*@__PURE__*/ $constructor(`$ZodLiteral`,(e,t)=>{F.init(e,t);let n=new Set(t.values);e._zod.values=n,defineLazyInternal(e,`pattern`,e=>{let t=e.def.values;return RegExp(t.length?`^(${t.map(e=>typeof e==`string`?escapeRegex(e):e?escapeRegex(e.toString()):String(e)).join(`|`)})$`:`^[^\\s\\S]$`)}),e._zod.parse=(r,i)=>{let a=r.value;return n.has(a)||r.issues.push({code:`invalid_value`,values:t.values,input:a,inst:e}),r}}),Tu=/*@__PURE__*/ $constructor(`$ZodTransform`,(e,t)=>{F.init(e,t),e._zod.optin=`optional`,Wc.memoizer?.guard(e),e._zod.parse=(n,r)=>{if(r.direction===`backward`)throw new $ZodEncodeError(e.constructor.name);let i=t.transform(n.value,n);if(r.async)return(i instanceof Promise?i:Promise.resolve(i)).then(e=>(n.value=e,n));if(i instanceof Promise)throw new $ZodAsyncError;return n.value=i,n}}),Eu=/*@__PURE__*/ $constructor(`$ZodOptional`,(e,t)=>{F.init(e,t),defineLazyInternal(e,`optin`,e=>e.def.innerType._zod.optin===`defaulted`?`defaulted`:`optional`),e._zod.optout=`optional`,defineLazyInternal(e,`values`,e=>{let t=e.def.innerType._zod.values;return t?/* @__PURE__ */ new Set([...t,void 0]):void 0}),defineLazyInternal(e,`pattern`,e=>{let t=e.def.innerType._zod.pattern;return t?RegExp(`^(${cleanRegex(t.source)})?$`):void 0}),e._zod.parse=(e,n)=>{if(e.value===void 0){if(t.innerType._zod.optin!==`defaulted`)return e;let r=t.innerType._zod.run({value:e.value,issues:[]},n);return r instanceof Promise?r.then(t=>handleOptionalResult(e,t)):handleOptionalResult(e,r)}return t.innerType._zod.run(e,n)}}),Du=/*@__PURE__*/ $constructor(`$ZodExactOptional`,(e,t)=>{Eu.init(e,t),defineLazyInternal(e,`values`,e=>e.def.innerType._zod.values),defineLazyInternal(e,`pattern`,e=>e.def.innerType._zod.pattern),e._zod.parse=(e,n)=>t.innerType._zod.run(e,n)}),Ou=/*@__PURE__*/ $constructor(`$ZodNullable`,(e,t)=>{F.init(e,t),defineLazyInternal(e,`optin`,e=>e.def.innerType._zod.optin),defineLazyInternal(e,`optout`,e=>e.def.innerType._zod.optout),defineLazyInternal(e,`pattern`,e=>{let t=e.def.innerType._zod.pattern;return t?RegExp(`^(${cleanRegex(t.source)}|null)$`):void 0}),defineLazyInternal(e,`values`,e=>e.def.innerType._zod.values?/* @__PURE__ */ new Set([...e.def.innerType._zod.values,null]):void 0),e._zod.parse=(e,n)=>e.value===null?e:t.innerType._zod.run(e,n)}),ku=/*@__PURE__*/ $constructor(`$ZodDefault`,(e,t)=>{F.init(e,t),e._zod.optin=`defaulted`,defineLazyInternal(e,`values`,e=>e.def.innerType._zod.values),e._zod.parse=(e,n)=>{if(n.direction===`backward`)return t.innerType._zod.run(e,n);if(e.value===void 0)return e.value=t.defaultValue,e;let r=t.innerType._zod.run(e,n);return r instanceof Promise?r.then(e=>handleDefaultResult(e,t)):handleDefaultResult(r,t)}}),Au=/*@__PURE__*/ $constructor(`$ZodPrefault`,(e,t)=>{F.init(e,t),e._zod.optin=`defaulted`,defineLazyInternal(e,`values`,e=>e.def.innerType._zod.values),e._zod.parse=(e,n)=>(n.direction===`backward`||e.value===void 0&&(e.value=t.defaultValue),t.innerType._zod.run(e,n))}),ju=/*@__PURE__*/ $constructor(`$ZodNonOptional`,(e,t)=>{F.init(e,t),defineLazyInternal(e,`values`,e=>{let t=e.def.innerType._zod.values;return t?new Set([...t].filter(e=>e!==void 0)):void 0}),e._zod.parse=(n,r)=>{let i=t.innerType._zod.run(n,r);return i instanceof Promise?i.then(t=>handleNonOptionalResult(t,e)):handleNonOptionalResult(i,e)}}),Mu=/*@__PURE__*/ $constructor(`$ZodCatch`,(e,t)=>{F.init(e,t),defineLazyInternal(e,`optin`,e=>e.def.innerType._zod.optin===`defaulted`?`defaulted`:`optional`),defineLazyInternal(e,`optout`,e=>e.def.innerType._zod.optout),defineLazyInternal(e,`values`,e=>e.def.innerType._zod.values),e._zod.parse=(e,n)=>{if(n.direction===`backward`)return t.innerType._zod.run(e,n);let r=t.innerType._zod.run({value:e.value,issues:[]},n);return r instanceof Promise?r.then(r=>handleCatchResult(e,r,t,n)):handleCatchResult(e,r,t,n)}}),Nu=/*@__PURE__*/ $constructor(`$ZodPipe`,(e,t)=>{F.init(e,t),defineLazyInternal(e,`values`,e=>e.def.in._zod.values),defineLazyInternal(e,`optin`,e=>e.def.in._zod.optin),defineLazyInternal(e,`optout`,e=>e.def.out._zod.optout),defineLazyInternal(e,`propValues`,e=>e.def.in._zod.propValues),e._zod.parse=(e,n)=>{if(n.direction===`backward`){let r=t.out._zod.run(e,n);return r instanceof Promise?r.then(e=>handlePipeResult(e,t.in,n)):handlePipeResult(r,t.in,n)}let r=t.in._zod.run(e,n);return r instanceof Promise?r.then(e=>handlePipeResult(e,t.out,n)):handlePipeResult(r,t.out,n)}}),Pu=/*@__PURE__*/ $constructor(`$ZodReadonly`,(e,t)=>{F.init(e,t),defineLazyInternal(e,`propValues`,e=>e.def.innerType._zod.propValues),defineLazyInternal(e,`values`,e=>e.def.innerType._zod.values),defineLazyInternal(e,`optin`,e=>e.def.innerType?._zod?.optin),defineLazyInternal(e,`optout`,e=>e.def.innerType?._zod?.optout),e._zod.parse=(e,n)=>{if(n.direction===`backward`)return t.innerType._zod.run(e,n);let r=t.innerType._zod.run(e,n);return r instanceof Promise?r.then(handleReadonlyResult):handleReadonlyResult(r)}}),Fu=/*@__PURE__*/ $constructor(`$ZodCustom`,(e,t)=>{P.init(e,t),F.init(e,t),e._zod.parse=(e,t)=>e,e._zod.check=n=>{let r=n.value,i=t.fn(r);if(i instanceof Promise)return i.then(t=>handleRefineResult(t,n,r,e));handleRefineResult(i,n,r,e)}})})))()}function isRef(e){return typeof e==`object`&&!!e}function cloneIssues(e){return e.map(e=>e.path?{...e,path:e.path.slice()}:{...e})}function isRecursive(e,t,n){let r=Ru.get(e);if(r!==void 0)return r?Vu:zu;if(t.has(e))return Vu;t.add(e);let i=zu,check=e=>{if(i!==Vu&&e?._zod){let r=isRecursive(e,t,n);r>i&&(i=r)}},shape=(e,r)=>{let i=zu;for(let a of Reflect.ownKeys(e)){let o=Object.getOwnPropertyDescriptor(e,a);if(r&&!o.enumerable)continue;let s=o.get?Bu:o.value?._zod?isRecursive(o.value,t,n):zu;s>i&&(i=s)}return i},merge=e=>{e>i&&(i=e)},a=e._zod.def;switch(a.type){case`object`:{let e=rawShape(a);merge(e?shape(e,!0):Bu),check(a.catchall);break}case`array`:check(a.element);break;case`tuple`:for(let e of a.items)check(e);check(a.rest);break;case`record`:case`map`:check(a.keyType),check(a.valueType);break;case`set`:check(a.valueType);break;case`union`:for(let e of a.options)check(e);break;case`intersection`:check(a.left),check(a.right);break;case`optional`:case`nullable`:case`default`:case`prefault`:case`catch`:case`readonly`:case`nonoptional`:case`promise`:case`success`:check(a.innerType);break;case`pipe`:check(a.in),check(a.out);break;case`function`:check(a.input),check(a.output);break;case`lazy`:{let r=a._cachedInner??(n?e._zod.innerType:void 0);merge(r?isRecursive(r,t,!1):Bu);break}case`template_literal`:case`string`:case`number`:case`int`:case`boolean`:case`bigint`:case`symbol`:case`undefined`:case`null`:case`void`:case`never`:case`any`:case`unknown`:case`date`:case`nan`:case`enum`:case`literal`:case`file`:case`transform`:case`custom`:break;default:for(let e in a){let t=Object.getOwnPropertyDescriptor(a,e);if(!t||t.get)continue;let n=t.value;if(n&&typeof n==`object`){if(n._zod)check(n);else if(Array.isArray(n))for(let e of n)check(e)}}}return t.delete(e),settle$1(e,i)}function settle$1(e,t){return t!==Bu&&Ru.set(e,t===Vu),t}function bucketFor(e,t){let n=e.buckets.get(t);return n||(n=/* @__PURE__ */ new WeakMap,e.buckets.set(t,n)),n}function memoizer(){return Wu}function isBackEdge(e,t){let n=e[Iu]?.backEdges;return n!==void 0&&isRef(t)&&n.has(t)}var $ZodCyclicError,Iu,Lu,Ru,zu,Bu,Vu,Hu,Uu,Wu;function init_memoizer(){return(init_memoizer=__esmMin((()=>{init_util(),$ZodCyclicError=class extends Error{constructor(){super(`Cannot parse a reference cycle that closes through a transform`),this.name=`ZodCyclicError`}},Iu=`~memo`,Lu=[],Ru=/*@__PURE__*/ new WeakMap,zu=0,Bu=1,Vu=2,Uu=[],Wu={alloc(e,t,n){let r=Hu;if(!r)return n;Hu=void 0;let i={value:n,issues:null};return r.set(t.value,i),Uu.push(i),n},guard(e){var t;(t=e._zod).deferred??(t.deferred=[]),e._zod.deferred.push(()=>{let t=e._zod.parse,wrapped=(e,n)=>{if(n.direction!==`backward`&&isBackEdge(n,e.value))throw new $ZodCyclicError;return t(e,n)};e._zod.parse=wrapped,e._zod.run===t&&(e._zod.run=wrapped)})},attach(e){var t;let n,r=!1,i,a;(t=e._zod).deferred??(t.deferred=[]),e._zod.deferred.push(()=>{let t=e._zod.parse,wrapped=(o,s)=>{if(n===void 0){let i=isRecursive(e,/* @__PURE__ */ new Set,!1);if(i===zu)return e._zod.parse=t,e._zod.run===wrapped&&(e._zod.run=t),t(o,s);i===Vu||r?n=!0:r=!0}let c=o.value;if(!isRef(c))return t(o,s);let l=s[Iu];l||(l={buckets:/* @__PURE__ */ new WeakMap,backEdges:void 0},s[Iu]=l);let u;i===s?u=a:(u=bucketFor(l,e),i=s,a=u);let d=u.get(c);if(d)return o.value=d.value,d.issues?d.issues.length&&o.issues.push(...cloneIssues(d.issues)):(o.memo=!0,l.backEdges??(l.backEdges=/* @__PURE__ */ new WeakSet),l.backEdges.add(d.value)),o;Hu=u;let f=Uu.length,p=t(o,s);Hu=void 0;let m=Uu.length>f?Uu.pop():void 0;return p instanceof Promise?p.then(e=>(m&&(m.issues=e.issues.length?cloneIssues(e.issues):Lu),e)):(m&&(m.issues=p.issues.length?cloneIssues(p.issues):Lu),p)};e._zod.parse=wrapped,e._zod.run===t&&(e._zod.run=wrapped)})}}})))()}function en_default(){return{localeError:error()}}var error;function init_en(){return(init_en=__esmMin((()=>{init_util(),error=()=>{let e={string:{unit:`characters`,verb:`to have`},file:{unit:`bytes`,verb:`to have`},array:{unit:`items`,verb:`to have`},set:{unit:`items`,verb:`to have`},map:{unit:`entries`,verb:`to have`}};function getSizing(t){return e[t]??null}let t={regex:`input`,email:`email address`,url:`URL`,emoji:`emoji`,uuid:`UUID`,uuidv4:`UUIDv4`,uuidv6:`UUIDv6`,nanoid:`nanoid`,guid:`GUID`,cuid:`cuid`,cuid2:`cuid2`,ulid:`ULID`,xid:`XID`,ksuid:`KSUID`,datetime:`ISO datetime`,date:`ISO date`,time:`ISO time`,duration:`ISO duration`,ipv4:`IPv4 address`,ipv6:`IPv6 address`,mac:`MAC address`,cidrv4:`IPv4 range`,cidrv6:`IPv6 range`,base64:`base64-encoded string`,base64url:`base64url-encoded string`,json_string:`JSON string`,e164:`E.164 number`,currency_code:`currency code`,credit_card:`credit card number`,iban:`IBAN`,jwt:`JWT`,template_literal:`input`},n={nan:`NaN`};function getTypeName(e,t){return e===`number`&&typeof t==`number`&&!Number.isFinite(t)?String(t):n[e]??e}return e=>{switch(e.code){case`invalid_type`:return`Invalid input: expected ${getTypeName(e.expected)}, received ${getTypeName(parsedType(e.input),e.input)}`;case`invalid_value`:return e.values.length===1?`Invalid input: expected ${stringifyPrimitive(e.values[0])}`:`Invalid option: expected one of ${joinValues(e.values,`|`)}`;case`too_big`:{let t=e.exact?`exactly `:e.inclusive?`<=`:`<`,n=getSizing(e.origin);return n?`Too big: expected ${e.origin??`value`} to have ${t}${e.maximum.toString()} ${n.unit??`elements`}`:`Too big: expected ${e.origin??`value`} to be ${t}${e.maximum.toString()}`}case`too_small`:{let t=e.exact?`exactly `:e.inclusive?`>=`:`>`,n=getSizing(e.origin);return n?`Too small: expected ${e.origin} to have ${t}${e.minimum.toString()} ${n.unit}`:`Too small: expected ${e.origin} to be ${t}${e.minimum.toString()}`}case`invalid_format`:{let n=e;return n.format===`starts_with`?`Invalid string: must start with "${n.prefix}"`:n.format===`ends_with`?`Invalid string: must end with "${n.suffix}"`:n.format===`includes`?`Invalid string: must include "${n.includes}"`:n.format===`regex`?`Invalid string: must match pattern ${n.pattern}`:`Invalid ${t[n.format]??e.format}`}case`not_multiple_of`:return`Invalid number: must be a multiple of ${e.divisor}`;case`unrecognized_keys`:return`Unrecognized key${e.keys.length>1?`s`:``}: ${joinValues(e.keys,`, `)}`;case`invalid_key`:return`Invalid key in ${e.origin}`;case`invalid_union`:return e.options&&Array.isArray(e.options)&&e.options.length>0?`Invalid discriminator value. Expected ${e.options.map(e=>`'${e}'`).join(` | `)}`:e.inclusive===!1?`Invalid input: more than one option matched`:`Invalid input`;case`invalid_element`:return`Invalid value in ${e.origin}`;default:return`Invalid input`}}}})))()}function registry(){return new $ZodRegistry}var Gu,$ZodRegistry,Ku;function init_registries(){return(init_registries=__esmMin((()=>{$ZodRegistry=class{constructor(){this._map=/* @__PURE__ */ new WeakMap,this._idmap=/* @__PURE__ */ new Map}add(e,...t){let n=t[0];return this._map.set(e,n),n&&typeof n==`object`&&`id`in n&&this._idmap.set(n.id,e),this}clear(){return this._map=/* @__PURE__ */ new WeakMap,this._idmap=/* @__PURE__ */ new Map,this}remove(e){let t=this._map.get(e);return t&&typeof t==`object`&&`id`in t&&this._idmap.delete(t.id),this._map.delete(e),this}get(e){let t=e._zod.parent;if(t){let n={...this.get(t)??{}};delete n.id;let r={...n,...this._map.get(e)};return Object.keys(r).length?r:void 0}return this._map.get(e)}has(e){return this._map.has(e)}},(Gu=globalThis).__zod_globalRegistry??(Gu.__zod_globalRegistry=registry()),Ku=globalThis.__zod_globalRegistry})))()}function snapshotChecks(e){return e.checks&&=[...e.checks],e}// @__NO_SIDE_EFFECTS__
function _string(e,t){return new e(snapshotChecks({type:`string`,...normalizeParams(t)}))}// @__NO_SIDE_EFFECTS__
function _email(e,t){return new e({type:`string`,format:`email`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _guid(e,t){return new e({type:`string`,format:`guid`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _uuid(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _uuidv4(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,version:`v4`,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _uuidv6(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,version:`v6`,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _uuidv7(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,version:`v7`,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _url(e,t){return new e({type:`string`,format:`url`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _emoji(e,t){return new e({type:`string`,format:`emoji`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _nanoid(e,t){return new e({type:`string`,format:`nanoid`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _cuid(e,t){return new e({type:`string`,format:`cuid`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _cuid2(e,t){return new e({type:`string`,format:`cuid2`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _ulid(e,t){return new e({type:`string`,format:`ulid`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _xid(e,t){return new e({type:`string`,format:`xid`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _ksuid(e,t){return new e({type:`string`,format:`ksuid`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _ipv4(e,t){return new e({type:`string`,format:`ipv4`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _ipv6(e,t){return new e({type:`string`,format:`ipv6`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _cidrv4(e,t){return new e({type:`string`,format:`cidrv4`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _cidrv6(e,t){return new e({type:`string`,format:`cidrv6`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _base64(e,t){return new e({type:`string`,format:`base64`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _base64url(e,t){return new e({type:`string`,format:`base64url`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _e164(e,t){return new e({type:`string`,format:`e164`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _jwt(e,t){return new e({type:`string`,format:`jwt`,check:`string_format`,abort:!1,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _isoDateTime(e,t){return new e({type:`string`,format:`datetime`,check:`string_format`,offset:!1,local:!1,precision:null,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _isoDate(e,t){return new e({type:`string`,format:`date`,check:`string_format`,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _isoTime(e,t){return new e({type:`string`,format:`time`,check:`string_format`,precision:null,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _isoDuration(e,t){return new e({type:`string`,format:`duration`,check:`string_format`,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _number(e,t){return new e(snapshotChecks({type:`number`,checks:[],...normalizeParams(t)}))}// @__NO_SIDE_EFFECTS__
function _int(e,t){return new e({type:`number`,check:`number_format`,abort:!1,format:`safeint`,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _unknown(e){return new e({type:`unknown`})}// @__NO_SIDE_EFFECTS__
function _never(e,t){return new e({type:`never`,...normalizeParams(t)})}// @__NO_SIDE_EFFECTS__
function _lt(e,t){return new Sl({check:`less_than`,...normalizeParams(t),value:e,inclusive:!1})}// @__NO_SIDE_EFFECTS__
function _lte(e,t){return new Sl({check:`less_than`,...normalizeParams(t),value:e,inclusive:!0})}// @__NO_SIDE_EFFECTS__
function _gt(e,t){return new Cl({check:`greater_than`,...normalizeParams(t),value:e,inclusive:!1})}// @__NO_SIDE_EFFECTS__
function _gte(e,t){return new Cl({check:`greater_than`,...normalizeParams(t),value:e,inclusive:!0})}// @__NO_SIDE_EFFECTS__
function _multipleOf(e,t){return new wl({check:`multiple_of`,...normalizeParams(t),value:e})}// @__NO_SIDE_EFFECTS__
function _maxLength(e,t){return new El({check:`max_length`,...normalizeParams(t),maximum:e})}// @__NO_SIDE_EFFECTS__
function _minLength(e,t){return new Dl({check:`min_length`,...normalizeParams(t),minimum:e})}// @__NO_SIDE_EFFECTS__
function _length(e,t){return new Ol({check:`length_equals`,...normalizeParams(t),length:e})}// @__NO_SIDE_EFFECTS__
function _regex(e,t){return new Al({check:`string_format`,format:`regex`,...normalizeParams(t),pattern:e})}// @__NO_SIDE_EFFECTS__
function _lowercase(e){return new jl({check:`string_format`,format:`lowercase`,...normalizeParams(e)})}// @__NO_SIDE_EFFECTS__
function _uppercase(e){return new Ml({check:`string_format`,format:`uppercase`,...normalizeParams(e)})}// @__NO_SIDE_EFFECTS__
function _includes(e,t){return new Nl({check:`string_format`,format:`includes`,...normalizeParams(t),includes:e})}// @__NO_SIDE_EFFECTS__
function _startsWith(e,t){return new Pl({check:`string_format`,format:`starts_with`,...normalizeParams(t),prefix:e})}// @__NO_SIDE_EFFECTS__
function _endsWith(e,t){return new Fl({check:`string_format`,format:`ends_with`,...normalizeParams(t),suffix:e})}// @__NO_SIDE_EFFECTS__
function _overwrite(e){return new Il({check:`overwrite`,tx:e})}// @__NO_SIDE_EFFECTS__
function _normalize(e){return/* @__PURE__ */ _overwrite(t=>t.normalize(e))}// @__NO_SIDE_EFFECTS__
function _trim(){return/* @__PURE__ */ _overwrite(e=>e.trim())}// @__NO_SIDE_EFFECTS__
function _toLowerCase(){return/* @__PURE__ */ _overwrite(e=>e.toLowerCase())}// @__NO_SIDE_EFFECTS__
function _toUpperCase(){return/* @__PURE__ */ _overwrite(e=>e.toUpperCase())}// @__NO_SIDE_EFFECTS__
function _slugify(){return/* @__PURE__ */ _overwrite(e=>slugify(e))}// @__NO_SIDE_EFFECTS__
function _array(e,t,n){return new e({type:`array`,element:t,...normalizeParams(n)})}// @__NO_SIDE_EFFECTS__
function _refine(e,t,n){return new e({type:`custom`,check:`custom`,fn:t,...normalizeParams(n)})}// @__NO_SIDE_EFFECTS__
function _superRefine(e,t){let n=/* @__PURE__ */ _check(t=>(t.addIssue=e=>{if(typeof e==`string`)t.issues.push(issue(e,t.value,n._zod.def));else{let r=e;r.fatal&&(r.continue=!1),r.code??=`custom`,`input`in r||(r.input=t.value),r.inst??=n,r.continue??=!n._zod.def.abort,t.issues.push(issue(r))}},e(t.value,t)),t);return n}// @__NO_SIDE_EFFECTS__
function _check(e,t){let n=new P({check:`custom`,...normalizeParams(t)});return n._zod.check=e,n}function init_api(){return(init_api=__esmMin((()=>{init_checks(),init_util()})))()}function assignProps(e,...t){for(let n of t)for(let t of Reflect.ownKeys(n))Object.prototype.propertyIsEnumerable.call(n,t)&&assignProp(e,t,n[t]);return e}function initializeContext(e){let t=e?.target??`draft-2020-12`;return t===`draft-4`&&(t=`draft-04`),t===`draft-7`&&(t=`draft-07`),{processors:e.processors??{},metadataRegistry:e?.metadata??Ku,target:t,unrepresentable:e?.unrepresentable??`throw`,override:e?.override??(()=>{}),io:e?.io??`output`,counter:0,seen:/* @__PURE__ */ new Map,sharedDefsExtractedFor:void 0,sharedEmitDoneFor:void 0,cycles:e?.cycles??`ref`,reused:e?.reused??`inline`,intersections:[],deferred:[],external:e?.external??void 0}}function handleUnrepresentable(e,t,n,r,i){let a=typeof t.unrepresentable==`function`?t.unrepresentable({zodSchema:e,path:r.path,message:i}):t.unrepresentable;if(a===`any`)return!1;if(a===void 0||a===`throw`)throw Error(i);return Object.assign(n,a),!0}function processSchema(e,t,n={path:[],schemaPath:[]}){var r;let i=e._zod.def,a=t.seen.get(e);if(a)return a.count++,n.schemaPath.includes(e)&&(a.cycle=n.path),a.schema;let o={schema:{},count:1,cycle:void 0,path:n.path};t.seen.set(e,o),t.sharedDefsExtractedFor=void 0,t.sharedEmitDoneFor=void 0;let s=e._zod.toJSONSchema?.();if(s)o.schema=s;else{let r={...n,schemaPath:[...n.schemaPath,e],path:n.path};if(e._zod.processJSONSchema)e._zod.processJSONSchema(t,o.schema,r);else{let n=o.schema,a=t.processors[i.type];if(!a)throw Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);a(e,t,n,r)}let a=e._zod.parent;a&&(o.ref||=a,processSchema(a,t,r),t.seen.get(a).isParent=!0)}let c=t.metadataRegistry.get(e);return c&&assignProps(o.schema,c),t.io===`input`&&isTransforming(e)&&(delete o.schema.examples,delete o.schema.default),t.io===`input`&&`_prefault`in o.schema&&((r=o.schema).default??(r.default=o.schema._prefault)),delete o.schema._prefault,t.seen.get(e).schema}function encodeJSONPointerSegment(e){return e.replace(/~/g,`~0`).replace(/\//g,`~1`)}function extractDefs(e,t){let n=e.seen.get(t);if(!n)throw Error(`Unprocessed schema. This is a bug in Zod.`);if(e.external&&e.sharedDefsExtractedFor===e.external)return;let r=/* @__PURE__ */ new Map;for(let t of e.seen.entries()){let n=e.metadataRegistry.get(t[0])?.id;if(n){let e=r.get(n);if(e&&e!==t[0])throw Error(`Duplicate schema id "${n}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);r.set(n,t[0])}}let makeURI=t=>{let r=e.target===`draft-2020-12`?`$defs`:`definitions`;if(e.external){let n=e.external.registry.get(t[0])?.id,i=e.external.uri??(e=>e);if(n)return{ref:i(n)};let a=t[1].defId??t[1].schema.id??`schema${e.counter++}`;return t[1].defId=a,{defId:a,ref:`${i(`__shared`)}#/${r}/${encodeJSONPointerSegment(a)}`}}let i=`#/${r}/`;if(t[1]===n&&!t[1].schema.id)return{ref:`#`};let a=t[1].schema.id??`__schema${e.counter++}`;return{defId:a,ref:i+encodeJSONPointerSegment(a)}},extractToDef=e=>{if(e[1].schema.$ref)return;let t=e[1],{ref:n,defId:r}=makeURI(e);t.def={...t.schema},r&&(t.defId=r);let i=t.schema;for(let e in i)delete i[e];i.$ref=n};if(e.cycles===`throw`)for(let t of e.seen.entries()){let e=t[1];if(e.cycle)throw Error(`Cycle detected: #/${e.cycle?.join(`/`)}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)}for(let n of e.seen.entries()){let r=n[1];if(t===n[0]){extractToDef(n);continue}if(e.external){let r=e.external.registry.get(n[0])?.id;if(t!==n[0]&&r){extractToDef(n);continue}}if(e.metadataRegistry.get(n[0])?.id){extractToDef(n);continue}if(r.cycle){extractToDef(n);continue}r.count>1&&e.reused===`ref`&&extractToDef(n)}e.external&&(e.sharedDefsExtractedFor=e.external)}function compactTypeUnion(e){let t=e.anyOf;if(!Array.isArray(t)||t.length===0||e.type!==void 0)return;let n=[];for(let e of t){if(!e||typeof e!=`object`)return;compactTypeUnion(e);let t=Object.keys(e);if(t.length!==1||t[0]!==`type`)return;let r=e.type;for(let e of Array.isArray(r)?r:[r]){if(typeof e!=`string`)return;n.includes(e)||n.push(e)}}delete e.anyOf,e.type=n.length===1?n[0]:n}function undeclaredConstraint(e){let t=e.additionalProperties;return t===void 0||t===!1||typeof t!=`object`||!t?null:Object.keys(t).length?t:null}function foldObjects(e){let t=[];for(let n of e){if(typeof n!=`object`||n.type!==`object`)return null;for(let e in n)if(!qu.has(e))return null;t.push(n)}let n={},r=/* @__PURE__ */ new Set;for(let e of t){for(let r in e.properties){if(Object.prototype.hasOwnProperty.call(n,r))continue;let e=[];for(let n of t){let t=n.properties?.[r]??undeclaredConstraint(n);t!=null&&(e.some(e=>JSON.stringify(e)===JSON.stringify(t))||e.push(t))}assignProp(n,r,e.length===1?e[0]:foldObjects(e)??{allOf:e})}for(let t of e.required??[])r.add(t)}let i={type:`object`,properties:n};if(r.size&&(i.required=[...r]),t.every(e=>e.additionalProperties===!1))i.additionalProperties=!1;else{let e=[];for(let n of t){let t=undeclaredConstraint(n);t&&!e.some(e=>JSON.stringify(e)===JSON.stringify(t))&&e.push(t)}e.length===1?i.additionalProperties=e[0]:e.length>1&&(i.additionalProperties={allOf:e})}return i}function foldIntersection(e){let t=e.allOf;if(!Array.isArray(t)||t.length<2)return;for(let t of qu)if(t in e)return;let n=t.filter(e=>Ju.some(t=>Array.isArray(e[t]))),r=null;if(!n.length)r=foldObjects(t);else{let e=n[0],i=Ju.find(t=>Array.isArray(e[t]));if(Object.keys(e).length!==1)return;let a=t.filter(t=>t!==e),o=e[i].map(e=>foldObjects([...a,e]));if(o.some(e=>!e))return;r={[i]:o}}r&&(delete e.allOf,assignProps(e,r))}function finalize(e,t){let n=e.seen.get(t);if(!n)throw Error(`Unprocessed schema. This is a bug in Zod.`);let flattenRef=t=>{let n=e.seen.get(t);if(n.ref===null)return;let r=n.def??n.schema,i={...r},a=n.ref;if(n.ref=null,a){flattenRef(a);let n=e.seen.get(a),o=n.schema;if(o.$ref&&(e.target===`draft-07`||e.target===`draft-04`||e.target===`openapi-3.0`)?(r.allOf=r.allOf??[],r.allOf.push(o)):assignProps(r,o),assignProps(r,i),t._zod.parent===a)for(let e in r)e!==`$ref`&&e!==`allOf`&&(e in i||delete r[e]);if(o.$ref&&n.def)for(let e in r)e!==`$ref`&&e!==`allOf`&&e in n.def&&JSON.stringify(r[e])===JSON.stringify(n.def[e])&&delete r[e]}let o=t._zod.parent;if(o&&o!==a){flattenRef(o);let t=e.seen.get(o);if(t?.schema.$ref&&(r.$ref=t.schema.$ref,t.def))for(let e in r)e!==`$ref`&&e!==`allOf`&&e in t.def&&JSON.stringify(r[e])===JSON.stringify(t.def[e])&&delete r[e]}e.override({zodSchema:t,jsonSchema:r,path:n.path??[]})};if(!e.external||e.sharedEmitDoneFor!==e.external){for(let t of[...e.seen.entries()].reverse())flattenRef(t[0]);if(e.target!==`openapi-3.0`)for(let t of e.seen.entries())compactTypeUnion(t[1].def??t[1].schema);for(let t of e.deferred)t();if(e.intersections.length){let t=/* @__PURE__ */ new Map;for(let n of e.seen.values())for(let e of[n.schema,n.def]){let n=e?.allOf;if(!Array.isArray(n))continue;let r=t.get(n);r?r.push(e):t.set(n,[e])}for(let n of e.intersections)for(let e of t.get(n)??[])foldIntersection(e)}}let r={};if(e.target===`draft-2020-12`?r.$schema=`https://json-schema.org/draft/2020-12/schema`:e.target===`draft-07`?r.$schema=`http://json-schema.org/draft-07/schema#`:e.target===`draft-04`?r.$schema=`http://json-schema.org/draft-04/schema#`:e.target,e.external?.uri){let n=e.external.registry.get(t)?.id;if(!n)throw Error("Schema is missing an `id` property");r.$id=e.external.uri(n)}assignProps(r,n.defId?n.schema:n.def??n.schema);let i=e.metadataRegistry.get(t)?.id;i!==void 0&&r.id===i&&delete r.id;let a=e.external?.defs??{};if(!e.external||e.sharedEmitDoneFor!==e.external)for(let t of e.seen.entries()){let e=t[1];e.def&&e.defId&&(e.def.id===e.defId&&delete e.def.id,assignProp(a,e.defId,e.def))}e.external&&(e.sharedEmitDoneFor=e.external),e.external||Object.keys(a).length>0&&(e.target===`draft-2020-12`?r.$defs=a:r.definitions=a);try{let n=JSON.parse(JSON.stringify(r));return Object.defineProperty(n,"~standard",{value:{...t[`~standard`],jsonSchema:{input:createStandardJSONSchemaMethod(t,`input`,e.processors),output:createStandardJSONSchemaMethod(t,`output`,e.processors)}},enumerable:!1,writable:!1}),n}catch{throw Error(`Error converting schema to JSON.`)}}function isTransforming(e,t){let n=t??{seen:/* @__PURE__ */ new Set};if(n.seen.has(e))return!1;n.seen.add(e);let r=e._zod.def;if(r.type===`transform`)return!0;if(r.type===`array`)return isTransforming(r.element,n);if(r.type===`set`)return isTransforming(r.valueType,n);if(r.type===`lazy`)return isTransforming(r.getter(),n);if(r.type===`promise`||r.type===`optional`||r.type===`nonoptional`||r.type===`nullable`||r.type===`readonly`||r.type==="default"||r.type===`prefault`||r.type===`catch`)return isTransforming(r.innerType,n);if(r.type===`intersection`)return isTransforming(r.left,n)||isTransforming(r.right,n);if(r.type===`record`||r.type===`map`)return isTransforming(r.keyType,n)||isTransforming(r.valueType,n);if(r.type===`pipe`)return e._zod.traits.has(`$ZodCodec`)?!0:isTransforming(r.in,n)||isTransforming(r.out,n);if(r.type===`object`){for(let e in r.shape)if(isTransforming(r.shape[e],n))return!0;return!1}if(r.type===`union`){for(let e of r.options)if(isTransforming(e,n))return!0;return!1}if(r.type===`tuple`){for(let e of r.items)if(isTransforming(e,n))return!0;return!!(r.rest&&isTransforming(r.rest,n))}return!1}var qu,Ju,createToJSONSchemaMethod,createStandardJSONSchemaMethod;function init_to_json_schema(){return(init_to_json_schema=__esmMin((()=>{init_registries(),init_util(),qu=/* @__PURE__ */ new Set([`type`,`properties`,`required`,`additionalProperties`]),Ju=[`oneOf`,`anyOf`],createToJSONSchemaMethod=(e,t={})=>n=>{let r=initializeContext({...n,processors:t});return processSchema(e,r),extractDefs(r,e),finalize(r,e)},createStandardJSONSchemaMethod=(e,t,n={})=>r=>{let{libraryOptions:i,target:a}=r??{},o=initializeContext({...i??{},target:a,io:t,processors:n});return processSchema(e,o),extractDefs(o,e),finalize(o,e)}})))()}function aggregateChecks(e){let t={},n=e._zod.def,r=e._zod.traits.has(`$ZodCheck`)?[e,...n.checks??[]]:n.checks??[];for(let e of r)Yu[e._zod.def.check]?.(t,e._zod.def);let i=e._zod.bag;i.minimum!==void 0&&narrowMin(t,`minimum`,i.minimum),i.exclusiveMinimum!==void 0&&narrowMin(t,`exclusiveMinimum`,i.exclusiveMinimum),i.maximum!==void 0&&narrowMax(t,`maximum`,i.maximum),i.exclusiveMaximum!==void 0&&narrowMax(t,`exclusiveMaximum`,i.exclusiveMaximum),i.multipleOf!==void 0&&addDivisor(t,i.multipleOf),i.format!==void 0&&(t.format??=i.format,i.format.includes(`int`)&&(t.isInt=!0)),i.mime&&intersectMime(t,i.mime);for(let e of i.patterns??[])addPattern(t,e);return t}function inputOptin(e){let t=e._zod.def;return t.type===`pipe`&&t.in._zod.traits.has(`$ZodTransform`)?inputOptin(t.out):t.type===`catch`?inputOptin(t.innerType):e._zod.optin}function serializeDefaultValue(e,t,n,r,i){let a=!1,o=JSON.stringify(e,(e,t)=>typeof t==`bigint`?(a=!0,null):t);return a?(handleUnrepresentable(t,n,r,i,`BigInt defaults cannot be represented in JSON Schema`),Qu):JSON.parse(o)}var narrowMin,narrowMax,narrowBoth,addDivisor,addPattern,intersectMime,setFormat,minContributor,maxContributor,formatContributor,Yu,Xu,Zu,exactPattern,stringProcessor,numberProcessor,neverProcessor,unknownProcessor,enumProcessor,literalProcessor,customProcessor,transformProcessor,arrayProcessor,objectProcessor,unionProcessor,intersectionProcessor,nullableProcessor,nonoptionalProcessor,Qu,defaultProcessor,prefaultProcessor,catchProcessor,pipeProcessor,readonlyProcessor,optionalProcessor;function init_json_schema_processors(){return(init_json_schema_processors=__esmMin((()=>{init_regexes(),init_schemas(),init_to_json_schema(),init_util(),narrowMin=(e,t,n)=>{(e[t]===void 0||n>e[t])&&(e[t]=n)},narrowMax=(e,t,n)=>{(e[t]===void 0||n<e[t])&&(e[t]=n)},narrowBoth=(e,t)=>{narrowMin(e,`minimum`,t),narrowMax(e,`maximum`,t)},addDivisor=(e,t)=>{e.multipleOf??=[],e.multipleOf.includes(t)||e.multipleOf.push(t)},addPattern=(e,t)=>{e.patterns??=/* @__PURE__ */ new Set,e.patterns.add(t)},intersectMime=(e,t)=>{e.mime=e.mime?e.mime.filter(e=>t.includes(e)):[...t]},setFormat=(e,t)=>{e.format=t,t.includes(`int`)&&(e.isInt=!0)},minContributor=(e,t)=>narrowMin(e,`minimum`,t.minimum),maxContributor=(e,t)=>narrowMax(e,`maximum`,t.maximum),formatContributor=e=>(t,n)=>{setFormat(t,n.format);let[r,i]=e[n.format];narrowMin(t,`minimum`,r),narrowMax(t,`maximum`,i)},Yu={greater_than:(e,t)=>narrowMin(e,t.inclusive?`minimum`:`exclusiveMinimum`,t.value),less_than:(e,t)=>narrowMax(e,t.inclusive?`maximum`:`exclusiveMaximum`,t.value),multiple_of:(e,t)=>addDivisor(e,t.value),number_format:formatContributor(Pc),bigint_format:formatContributor(Fc),min_length:minContributor,max_length:maxContributor,length_equals:(e,t)=>narrowBoth(e,t.length),min_size:minContributor,max_size:maxContributor,size_equals:(e,t)=>narrowBoth(e,t.size),string_format:(e,t)=>{setFormat(e,t.format),t.pattern&&addPattern(e,t.pattern),(t.format===`base64`||t.format===`base64url`)&&(e.contentEncoding=t.format),(t.local||t.precision===-1)&&(e.laxFormat=!0)},mime_type:(e,t)=>intersectMime(e,t.mime)},Xu={guid:`uuid`,url:`uri`,datetime:`date-time`,json_string:`json-string`,regex:``},Zu=/* @__PURE__ */ new Map([[ou,dl],[cu,fl]]),exactPattern=e=>Zu.get(e)??e,stringProcessor=(e,t,n,r)=>{let i=n;i.type=`string`;let{minimum:a,maximum:o,format:s,patterns:c,contentEncoding:l,laxFormat:u}=aggregateChecks(e);if(typeof a==`number`&&(i.minLength=a),typeof o==`number`&&(i.maxLength=o),s&&(i.format=Xu[s]??s,i.format===``&&delete i.format,(s===`time`||u)&&delete i.format),l&&(i.contentEncoding=l),c&&c.size>0){let e=[...c].map(exactPattern);e.length===1?i.pattern=e[0].source:e.length>1&&(i.allOf=[...e.map(e=>({...t.target===`draft-07`||t.target===`draft-04`||t.target===`openapi-3.0`?{type:`string`}:{},pattern:e.source}))])}},numberProcessor=(e,t,n,r)=>{let i=n,{minimum:a,maximum:o,multipleOf:s,exclusiveMaximum:c,exclusiveMinimum:l,isInt:u}=aggregateChecks(e);i.type=u?`integer`:`number`;let d=typeof l==`number`&&l>=(a??-1/0),f=typeof c==`number`&&c<=(o??1/0),p=t.target===`draft-04`||t.target===`openapi-3.0`;if(d?p?(i.minimum=l,i.exclusiveMinimum=!0):i.exclusiveMinimum=l:typeof a==`number`&&(i.minimum=a),f?p?(i.maximum=c,i.exclusiveMaximum=!0):i.exclusiveMaximum=c:typeof o==`number`&&(i.maximum=o),s){let n=/* @__PURE__ */ new Set;for(let a of s)Number.isFinite(a)&&a!==0?n.add(Math.abs(a)):handleUnrepresentable(e,t,i,r,`A multipleOf divisor of ${a} cannot be represented in JSON Schema`);let[a,...o]=n;a!==void 0&&(i.multipleOf=a),o.length&&(i.allOf=[...i.allOf??[],...o.map(e=>({multipleOf:e}))])}},neverProcessor=(e,t,n,r)=>{n.not={}},unknownProcessor=(e,t,n,r)=>{},enumProcessor=(e,t,n,r)=>{let i=e._zod.def,a=getEnumValues(i.entries);if(a.length===0){n.not={};return}a.every(e=>typeof e==`number`)&&(n.type=`number`),a.every(e=>typeof e==`string`)&&(n.type=`string`),n.enum=a},literalProcessor=(e,t,n,r)=>{let i=e._zod.def;if(i.values.length===0){n.not={};return}let a=[];for(let o of i.values)if(o===void 0){if(handleUnrepresentable(e,t,n,r,"Literal `undefined` cannot be represented in JSON Schema"))return}else if(typeof o==`bigint`){if(handleUnrepresentable(e,t,n,r,`BigInt literals cannot be represented in JSON Schema`))return;a.push(Number(o))}else a.push(o);if(a.length!==0){if(a.length===1){let e=a[0];n.type=e===null?`null`:typeof e,t.target===`draft-04`||t.target===`openapi-3.0`?n.enum=[e]:n.const=e}else a.every(e=>typeof e==`number`)&&(n.type=`number`),a.every(e=>typeof e==`string`)&&(n.type=`string`),a.every(e=>typeof e==`boolean`)&&(n.type=`boolean`),a.every(e=>e===null)&&(n.type=`null`),n.enum=a}},customProcessor=(e,t,n,r)=>{handleUnrepresentable(e,t,n,r,`Custom types cannot be represented in JSON Schema`)},transformProcessor=(e,t,n,r)=>{handleUnrepresentable(e,t,n,r,`Transforms cannot be represented in JSON Schema`)},arrayProcessor=(e,t,n,r)=>{let i=n,a=e._zod.def,{minimum:o,maximum:s}=aggregateChecks(e);typeof o==`number`&&(i.minItems=o),typeof s==`number`&&(i.maxItems=s),i.type=`array`,i.items=processSchema(a.element,t,{...r,path:[...r.path,`items`]})},objectProcessor=(e,t,n,r)=>{let i=n,a=e._zod.def,o=a.shape;if(Object.getOwnPropertySymbols(o).length&&handleUnrepresentable(e,t,i,r,`Symbol keys cannot be represented in JSON Schema`))return;i.type=`object`,i.properties={};for(let e in o)assignProp(i.properties,e,processSchema(o[e],t,{...r,path:[...r.path,`properties`,e]}));let s=[];for(let e of Object.keys(o)){let n=a.shape[e];(t.io===`input`?inputOptin(n)===void 0:n._zod.optout===void 0)&&s.push(e)}s.length>0&&(i.required=s),a.catchall?._zod.def.type===`never`?i.additionalProperties=!1:a.catchall?a.catchall&&(i.additionalProperties=processSchema(a.catchall,t,{...r,path:[...r.path,`additionalProperties`]})):t.io===`output`&&(i.additionalProperties=!1)},unionProcessor=(e,t,n,r)=>{let i=e._zod.def,a=i.inclusive===!1,o=i.options.map((e,n)=>processSchema(e,t,{...r,path:[...r.path,a?`oneOf`:`anyOf`,n]}));a?n.oneOf=o:n.anyOf=o},intersectionProcessor=(e,t,n,r)=>{let i=e._zod.def,a=processSchema(i.left,t,{...r,path:[...r.path,`allOf`,0]}),o=processSchema(i.right,t,{...r,path:[...r.path,`allOf`,1]}),isSimpleIntersection=e=>`allOf`in e&&Object.keys(e).length===1,s=[...isSimpleIntersection(a)?a.allOf:[a],...isSimpleIntersection(o)?o.allOf:[o]];n.allOf=s,t.intersections.push(s)},nullableProcessor=(e,t,n,r)=>{let i=e._zod.def,a=processSchema(i.innerType,t,r),o=t.seen.get(e);t.target===`openapi-3.0`?(o.ref=i.innerType,n.nullable=!0):n.anyOf=[a,{type:`null`}]},nonoptionalProcessor=(e,t,n,r)=>{let i=e._zod.def;processSchema(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType},Qu=Symbol(),defaultProcessor=(e,t,n,r)=>{let i=e._zod.def;processSchema(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType;let o=serializeDefaultValue(i.defaultValue,e,t,n,r);o!==Qu&&(n.default=o)},prefaultProcessor=(e,t,n,r)=>{let i=e._zod.def;processSchema(i.innerType,t,r);let a=t.seen.get(e);if(a.ref=i.innerType,t.io!==`input`)return;let o=serializeDefaultValue(i.defaultValue,e,t,n,r);o!==Qu&&(n._prefault=o)},catchProcessor=(e,t,n,r)=>{let i=e._zod.def;processSchema(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType;let o;try{o=i.catchValue(void 0)}catch{handleUnrepresentable(e,t,n,r,`Dynamic catch values are not supported in JSON Schema`);return}n.default=o},pipeProcessor=(e,t,n,r)=>{let i=e._zod.def,a=i.in._zod.traits.has(`$ZodTransform`),o=t.io===`input`?a?i.out:i.in:i.out;processSchema(o,t,r);let s=t.seen.get(e);s.ref=o},readonlyProcessor=(e,t,n,r)=>{let i=e._zod.def;processSchema(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType,n.readOnly=!0},optionalProcessor=(e,t,n,r)=>{let i=e._zod.def;processSchema(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType}})))()}function _lazyMethod(e,t,n){Object.defineProperty(e,t,{configurable:!0,enumerable:!1,get(){let e=n(this);return Object.defineProperty(this,t,{value:e,configurable:!0,writable:!0}),e},set(e){Object.defineProperty(this,t,{value:e,configurable:!0,writable:!0})}})}var $u,initializer,L;function init_errors$3(){return(init_errors$3=__esmMin((()=>{init_errors$2(),init_core(),init_util(),$u=/* @__PURE__ */ new WeakSet([Object.prototype,Error.prototype]),initializer=(e,t)=>{Jc.init(e,t),e.name=`ZodError`;let n=Object.getPrototypeOf(e);$u.has(n)||($u.add(n),_lazyMethod(n,`format`,e=>t=>formatError(e,t)),_lazyMethod(n,`flatten`,e=>t=>flattenError(e,t)),_lazyMethod(n,`addIssue`,e=>t=>{e.issues.push(t),e.message=JSON.stringify(e.issues,jsonStringifyReplacer,2)}),_lazyMethod(n,`addIssues`,e=>t=>{e.issues.push(...t),e.message=JSON.stringify(e.issues,jsonStringifyReplacer,2)}),Object.defineProperty(n,"isEmpty",{configurable:!0,enumerable:!1,get(){return this.issues.length===0}}))},L=/*@__PURE__*/ $constructor(`ZodError`,initializer,void 0,{Parent:Error})})))()}var ed,td,nd,rd,id,ad,od,sd,cd,ld,ud,dd;function init_parse$1(){return(init_parse$1=__esmMin((()=>{init_parse(),init_errors$3(),ed=/* @__PURE__ */ _parse(L),td=/* @__PURE__ */ _parseAsync(L),nd=/* @__PURE__ */ _safeParse(L),rd=/* @__PURE__ */ _safeParseAsync(L),id=/* @__PURE__ */ _encode(L),ad=/* @__PURE__ */ _decode(L),od=/* @__PURE__ */ _encodeAsync(L),sd=/* @__PURE__ */ _decodeAsync(L),cd=/* @__PURE__ */ _safeEncode(L),ld=/* @__PURE__ */ _safeDecode(L),ud=/* @__PURE__ */ _safeEncodeAsync(L),dd=/* @__PURE__ */ _safeDecodeAsync(L)})))()}function _ensureDefaultLocale(){Wc.localeError||config(en_default())}function _ensureDefaultMemoizer(){Wc.memoizer||config({memoizer:memoizer()})}function string(e){return/* @__PURE__ */ _string(pd,e)}function number(e){return/* @__PURE__ */ _number(Ld,e)}function int(e){return/* @__PURE__ */ _int(Rd,e)}function unknown(){return/* @__PURE__ */ _unknown(zd)}function never(e){return/* @__PURE__ */ _never(Bd,e)}function array(e,t){return/* @__PURE__ */ _array(Vd,e,t)}function object(e,t){let n={type:`object`,shape:e??{},...normalizeParams(t)};return new Hd(n)}function strictObject(e,t){return new Hd({type:`object`,shape:e,catchall:never(),...normalizeParams(t)})}function union(e,t){return new Ud({type:`union`,options:e,...normalizeParams(t)})}function discriminatedUnion(e,t,n){return new Wd({type:`union`,options:t,discriminator:e,...normalizeParams(n)})}function intersection(e,t){return new Gd({type:`intersection`,left:e,right:t})}function _enum(e,t){let n=Array.isArray(e)?Object.fromEntries(e.map(e=>[e,e])):e;return new Kd({type:`enum`,entries:n,...normalizeParams(t)})}function literal$1(e,t){return new qd({type:`literal`,values:Array.isArray(e)?e:[e],...normalizeParams(t)})}function transform(e){return new Jd({type:`transform`,transform:e})}function optional(e){return new Yd({type:`optional`,innerType:e})}function exactOptional(e){return new Xd({type:`optional`,innerType:e})}function nullable(e){return new Zd({type:`nullable`,innerType:e})}function _default(e,t){return new Qd({type:`default`,innerType:e,get defaultValue(){return typeof t==`function`?t():shallowClone(t)}})}function prefault(e,t){return new $d({type:`prefault`,innerType:e,get defaultValue(){return typeof t==`function`?t():shallowClone(t)}})}function nonoptional(e,t){return new ef({type:`nonoptional`,innerType:e,...normalizeParams(t)})}function _catch(e,t){return new tf({type:`catch`,innerType:e,catchValue:typeof t==`function`?t:constantCatch(t)})}function pipe(e,t){return new nf({type:`pipe`,in:e,out:t})}function readonly(e){return new rf({type:`readonly`,innerType:e})}function refine(e,t={}){return/* @__PURE__ */ _refine(af,e,t)}function superRefine(e,t){return/* @__PURE__ */ _superRefine(e,t)}var R,fd,pd,z,md,hd,gd,_d,vd,yd,bd,xd,Sd,Cd,wd,Td,Ed,Dd,Od,kd,Ad,jd,Md,Nd,Pd,Fd,Id,Ld,Rd,zd,Bd,Vd,Hd,Ud,Wd,Gd,Kd,qd,Jd,Yd,Xd,Zd,Qd,$d,ef,tf,nf,rf,af;function init_schemas$1(){return(init_schemas$1=__esmMin((()=>{init_core(),init_memoizer(),init_schemas(),init_util(),init_registries(),init_api(),init_json_schema_processors(),init_to_json_schema(),init_en(),init_parse$1(),R=/*@__PURE__*/ $constructor(`ZodType`,(e,t)=>(_ensureDefaultLocale(),F.init(e,t),e.def=t,e.type=t.type,e),{check(...e){let t=this.def;return this.clone(mergeDefs(t,{checks:[...t.checks??[],...e.map(e=>typeof e==`function`?{_zod:{check:e,def:{check:`custom`},onattach:[]}}:e)]}),{parent:!0})},with(...e){return this.check(...e)},clone(e,t){return clone(this,e,t)},brand(){return this},register(e,t){return e.add(this,t),this},refine(e,t){return this.check(refine(e,t))},superRefine(e,t){return this.check(superRefine(e,t))},overwrite(e){return this.check(/* @__PURE__ */ _overwrite(e))},optional(){return optional(this)},exactOptional(){return exactOptional(this)},nullable(){return nullable(this)},nullish(){return optional(nullable(this))},nonoptional(e){return nonoptional(this,e)},array(){return array(this)},or(e){return union([this,e])},and(e){return intersection(this,e)},transform(e){return pipe(this,transform(e))},default(e){return _default(this,e)},prefault(e){return prefault(this,e)},catch(e){return _catch(this,e)},pipe(e){return pipe(this,e)},readonly(){return readonly(this)},describe(e){let t=this.clone();return Ku.add(t,{description:e}),t},meta(...e){if(e.length===0)return Ku.get(this);let t=this.clone();return Ku.add(t,e[0]),t},isOptional(){return this.safeParse(void 0).success},isNullable(){return this.safeParse(null).success},apply(e,...t){return t.length===0?e(this):e(this,...t)},get"~standard"(){return hide(this,`~standard`,{...standardProps(this),jsonSchema:{input:createStandardJSONSchemaMethod(this,`input`),output:createStandardJSONSchemaMethod(this,`output`)}})},set"~standard"(e){own(this,`~standard`,e)},parse:function _parse(e,t){return ed(this,e,t,{callee:_parse})},parseAsync:async function _parseAsync(e,t){return await td(this,e,t,{callee:_parseAsync})},safeParse(e,t){return nd(this,e,t)},async safeParseAsync(e,t){return rd(this,e,t)},get spa(){return this?.safeParseAsync},set spa(e){own(this,`spa`,e)},validate(e,t){return validate(this,e,t)},validateAsync(e,t){return validateAsync$1(this,e,t)},encode:function _encode(e,t){return id(this,e,t,{callee:_encode})},decode:function _decode(e,t){return ad(this,e,t,{callee:_decode})},encodeAsync:async function _encodeAsync(e,t){return await od(this,e,t,{callee:_encodeAsync})},decodeAsync:async function _decodeAsync(e,t){return await sd(this,e,t,{callee:_decodeAsync})},safeEncode(e,t){return cd(this,e,t)},safeDecode(e,t){return ld(this,e,t)},async safeEncodeAsync(e,t){return ud(this,e,t)},async safeDecodeAsync(e,t){return dd(this,e,t)},toJSONSchema(e){return createToJSONSchemaMethod(this,{})(e)},get description(){return Ku.get(this)?.description},get _def(){return this._zod.def}}),fd=/*@__PURE__*/ $constructor(`_ZodString`,(e,t)=>{Rl.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>stringProcessor(e,t,n,r)},/*@__PURE__*/ derived({format:e=>aggregateChecks(e).format??null,minLength:e=>aggregateChecks(e).minimum??null,maxLength:e=>aggregateChecks(e).maximum??null},{regex(...e){return this.check(/* @__PURE__ */ _regex(...e))},includes(...e){return this.check(/* @__PURE__ */ _includes(...e))},startsWith(...e){return this.check(/* @__PURE__ */ _startsWith(...e))},endsWith(...e){return this.check(/* @__PURE__ */ _endsWith(...e))},min(...e){return this.check(/* @__PURE__ */ _minLength(...e))},max(...e){return this.check(/* @__PURE__ */ _maxLength(...e))},length(...e){return this.check(/* @__PURE__ */ _length(...e))},nonempty(...e){return this.check(/* @__PURE__ */ _minLength(1,...e))},lowercase(e){return this.check(/* @__PURE__ */ _lowercase(e))},uppercase(e){return this.check(/* @__PURE__ */ _uppercase(e))},trim(){return this.check(/* @__PURE__ */ _trim())},normalize(...e){return this.check(/* @__PURE__ */ _normalize(...e))},toLowerCase(){return this.check(/* @__PURE__ */ _toLowerCase())},toUpperCase(){return this.check(/* @__PURE__ */ _toUpperCase())},slugify(){return this.check(/* @__PURE__ */ _slugify())}})),pd=/*@__PURE__*/ $constructor(`ZodString`,(e,t)=>{Rl.init(e,t),fd.init(e,t)},{email(e){return this.check(/* @__PURE__ */ _email(vd,e))},url(e){return this.check(/* @__PURE__ */ _url(xd,e))},jwt(e){return this.check(/* @__PURE__ */ _jwt(Id,e))},emoji(e){return this.check(/* @__PURE__ */ _emoji(Sd,e))},guid(e){return this.check(/* @__PURE__ */ _guid(yd,e))},uuid(e){return this.check(/* @__PURE__ */ _uuid(bd,e))},uuidv4(e){return this.check(/* @__PURE__ */ _uuidv4(bd,e))},uuidv6(e){return this.check(/* @__PURE__ */ _uuidv6(bd,e))},uuidv7(e){return this.check(/* @__PURE__ */ _uuidv7(bd,e))},nanoid(e){return this.check(/* @__PURE__ */ _nanoid(Cd,e))},cuid(e){return this.check(/* @__PURE__ */ _cuid(wd,e))},cuid2(e){return this.check(/* @__PURE__ */ _cuid2(Td,e))},ulid(e){return this.check(/* @__PURE__ */ _ulid(Ed,e))},base64(e){return this.check(/* @__PURE__ */ _base64(Nd,e))},base64url(e){return this.check(/* @__PURE__ */ _base64url(Pd,e))},xid(e){return this.check(/* @__PURE__ */ _xid(Dd,e))},ksuid(e){return this.check(/* @__PURE__ */ _ksuid(Od,e))},ipv4(e){return this.check(/* @__PURE__ */ _ipv4(kd,e))},ipv6(e){return this.check(/* @__PURE__ */ _ipv6(Ad,e))},cidrv4(e){return this.check(/* @__PURE__ */ _cidrv4(jd,e))},cidrv6(e){return this.check(/* @__PURE__ */ _cidrv6(Md,e))},e164(e){return this.check(/* @__PURE__ */ _e164(Fd,e))},datetime(e){return this.check(/* @__PURE__ */ _isoDateTime(md,e))},date(e){return this.check(/* @__PURE__ */ _isoDate(hd,e))},time(e){return this.check(/* @__PURE__ */ _isoTime(gd,e))},duration(e){return this.check(/* @__PURE__ */ _isoDuration(_d,e))}}),z=/*@__PURE__*/ $constructor(`ZodStringFormat`,(e,t)=>{I.init(e,t),fd.init(e,t)}),md=/*@__PURE__*/ $constructor(`ZodISODateTime`,(e,t)=>{Zl.init(e,t),z.init(e,t)}),hd=/*@__PURE__*/ $constructor(`ZodISODate`,(e,t)=>{Ql.init(e,t),z.init(e,t)}),gd=/*@__PURE__*/ $constructor(`ZodISOTime`,(e,t)=>{$l.init(e,t),z.init(e,t)}),_d=/*@__PURE__*/ $constructor(`ZodISODuration`,(e,t)=>{eu.init(e,t),z.init(e,t)}),vd=/*@__PURE__*/ $constructor(`ZodEmail`,(e,t)=>{Vl.init(e,t),z.init(e,t)}),yd=/*@__PURE__*/ $constructor(`ZodGUID`,(e,t)=>{zl.init(e,t),z.init(e,t)}),bd=/*@__PURE__*/ $constructor(`ZodUUID`,(e,t)=>{Bl.init(e,t),z.init(e,t)}),xd=/*@__PURE__*/ $constructor(`ZodURL`,(e,t)=>{Ul.init(e,t),z.init(e,t)}),Sd=/*@__PURE__*/ $constructor(`ZodEmoji`,(e,t)=>{Wl.init(e,t),z.init(e,t)}),Cd=/*@__PURE__*/ $constructor(`ZodNanoID`,(e,t)=>{Gl.init(e,t),z.init(e,t)}),wd=/*@__PURE__*/ $constructor(`ZodCUID`,(e,t)=>{Kl.init(e,t),z.init(e,t)}),Td=/*@__PURE__*/ $constructor(`ZodCUID2`,(e,t)=>{ql.init(e,t),z.init(e,t)}),Ed=/*@__PURE__*/ $constructor(`ZodULID`,(e,t)=>{Jl.init(e,t),z.init(e,t)}),Dd=/*@__PURE__*/ $constructor(`ZodXID`,(e,t)=>{Yl.init(e,t),z.init(e,t)}),Od=/*@__PURE__*/ $constructor(`ZodKSUID`,(e,t)=>{Xl.init(e,t),z.init(e,t)}),kd=/*@__PURE__*/ $constructor(`ZodIPv4`,(e,t)=>{tu.init(e,t),z.init(e,t)}),Ad=/*@__PURE__*/ $constructor(`ZodIPv6`,(e,t)=>{ru.init(e,t),z.init(e,t)}),jd=/*@__PURE__*/ $constructor(`ZodCIDRv4`,(e,t)=>{iu.init(e,t),z.init(e,t)}),Md=/*@__PURE__*/ $constructor(`ZodCIDRv6`,(e,t)=>{au.init(e,t),z.init(e,t)}),Nd=/*@__PURE__*/ $constructor(`ZodBase64`,(e,t)=>{su.init(e,t),z.init(e,t)}),Pd=/*@__PURE__*/ $constructor(`ZodBase64URL`,(e,t)=>{lu.init(e,t),z.init(e,t)}),Fd=/*@__PURE__*/ $constructor(`ZodE164`,(e,t)=>{uu.init(e,t),z.init(e,t)}),Id=/*@__PURE__*/ $constructor(`ZodJWT`,(e,t)=>{du.init(e,t),z.init(e,t)}),Ld=/*@__PURE__*/ $constructor(`ZodNumber`,(e,t)=>{fu.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>numberProcessor(e,t,n,r),e.isFinite=!0},/*@__PURE__*/ derived({minValue:e=>{let{minimum:t,exclusiveMinimum:n}=aggregateChecks(e);return Math.max(t??-1/0,n??-1/0)},maxValue:e=>{let{maximum:t,exclusiveMaximum:n}=aggregateChecks(e);return Math.min(t??1/0,n??1/0)},isInt:e=>{let{isInt:t,multipleOf:n}=aggregateChecks(e);return!!t||!!n?.some(Number.isSafeInteger)},format:e=>aggregateChecks(e).format??null},{gt(e,t){return this.check(/* @__PURE__ */ _gt(e,t))},gte(e,t){return this.check(/* @__PURE__ */ _gte(e,t))},min(e,t){return this.check(/* @__PURE__ */ _gte(e,t))},lt(e,t){return this.check(/* @__PURE__ */ _lt(e,t))},lte(e,t){return this.check(/* @__PURE__ */ _lte(e,t))},max(e,t){return this.check(/* @__PURE__ */ _lte(e,t))},int(e){return this.check(int(e))},safe(e){return this.check(int(e))},positive(e){return this.check(/* @__PURE__ */ _gt(0,e))},nonnegative(e){return this.check(/* @__PURE__ */ _gte(0,e))},negative(e){return this.check(/* @__PURE__ */ _lt(0,e))},nonpositive(e){return this.check(/* @__PURE__ */ _lte(0,e))},multipleOf(e,t){return this.check(/* @__PURE__ */ _multipleOf(e,t))},step(e,t){return this.check(/* @__PURE__ */ _multipleOf(e,t))},finite(){return this}})),Rd=/*@__PURE__*/ $constructor(`ZodNumberFormat`,(e,t)=>{pu.init(e,t),Ld.init(e,t)}),zd=/*@__PURE__*/ $constructor(`ZodUnknown`,(e,t)=>{mu.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>unknownProcessor(e,t,n,r)}),Bd=/*@__PURE__*/ $constructor(`ZodNever`,(e,t)=>{hu.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>neverProcessor(e,t,n,r)}),Vd=/*@__PURE__*/ $constructor(`ZodArray`,(e,t)=>{_ensureDefaultMemoizer(),gu.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>arrayProcessor(e,t,n,r),e.element=t.element},{min(e,t){return this.check(/* @__PURE__ */ _minLength(e,t))},nonempty(e){return this.check(/* @__PURE__ */ _minLength(1,e))},max(e,t){return this.check(/* @__PURE__ */ _maxLength(e,t))},length(e,t){return this.check(/* @__PURE__ */ _length(e,t))},unwrap(){return this.element}}),Hd=/*@__PURE__*/ $constructor(`ZodObject`,(e,t)=>{_ensureDefaultMemoizer(),yu.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>objectProcessor(e,t,n,r),installLazyProp(e,`shape`,e=>e._zod.def.shape,!1)},{keyof(){return _enum(Object.keys(this._zod.def.shape))},catchall(e){return this.clone(mergeDefs(this._zod.def,{catchall:e}))},passthrough(){return this.clone(mergeDefs(this._zod.def,{catchall:unknown()}))},loose(){return this.clone(mergeDefs(this._zod.def,{catchall:unknown()}))},strict(){return this.clone(mergeDefs(this._zod.def,{catchall:never()}))},strip(){return this.clone(mergeDefs(this._zod.def,{catchall:void 0}))},extend(e){return extend(this,e)},safeExtend(e){return safeExtend(this,e)},merge(e){return merge(this,e)},pick(e){return pick(this,e)},omit(e){return omit(this,e)},partial(...e){return partial(Yd,this,e[0])},exactPartial(...e){return partial(Xd,this,e[0],`exactPartial`)},required(...e){return required(ef,this,e[0])}}),Ud=/*@__PURE__*/ $constructor(`ZodUnion`,(e,t)=>{bu.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>unionProcessor(e,t,n,r),e.options=t.options}),Wd=/*@__PURE__*/ $constructor(`ZodDiscriminatedUnion`,(e,t)=>{Ud.init(e,t),xu.init(e,t)}),Gd=/*@__PURE__*/ $constructor(`ZodIntersection`,(e,t)=>{Su.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>intersectionProcessor(e,t,n,r)}),Kd=/*@__PURE__*/ $constructor(`ZodEnum`,(e,t)=>{Cu.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>enumProcessor(e,t,n,r),e.enum=t.entries,e.options=[...e._zod.values];let n=new Set(Object.keys(t.entries));e.extract=(e,r)=>{let i={};for(let r of e)if(n.has(r))i[r]=t.entries[r];else throw Error(`Key ${r} not found in enum`);return new Kd({...t,checks:[],...normalizeParams(r),entries:i})},e.exclude=(e,r)=>{let i={...t.entries};for(let t of e)if(n.has(t))delete i[t];else throw Error(`Key ${t} not found in enum`);return new Kd({...t,checks:[],...normalizeParams(r),entries:i})}}),qd=/*@__PURE__*/ $constructor(`ZodLiteral`,(e,t)=>{wu.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>literalProcessor(e,t,n,r),e.values=new Set(t.values),Object.defineProperty(e,"value",{get(){if(t.values.length>1)throw Error("This schema contains multiple valid literal values. Use `.values` instead.");return t.values[0]}})}),Jd=/*@__PURE__*/ $constructor(`ZodTransform`,(e,t)=>{_ensureDefaultMemoizer(),Tu.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>transformProcessor(e,t,n,r),e._zod.parse=(n,r)=>{if(r.direction===`backward`)throw new $ZodEncodeError(e.constructor.name);n.addIssue=r=>{if(typeof r==`string`)n.issues.push(issue(r,n.value,t));else{let t=r;t.fatal&&(t.continue=!1),t.code??=`custom`,`input`in t||(t.input=n.value),t.inst??=e,n.issues.push(issue(t))}};let i=t.transform(n.value,n);return i instanceof Promise?i.then(e=>(n.value=e,n)):(n.value=i,n)}}),Yd=/*@__PURE__*/ $constructor(`ZodOptional`,(e,t)=>{Eu.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>optionalProcessor(e,t,n,r),e.unwrap=()=>e._zod.def.innerType}),Xd=/*@__PURE__*/ $constructor(`ZodExactOptional`,(e,t)=>{Du.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>optionalProcessor(e,t,n,r),e.unwrap=()=>e._zod.def.innerType}),Zd=/*@__PURE__*/ $constructor(`ZodNullable`,(e,t)=>{Ou.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>nullableProcessor(e,t,n,r),e.unwrap=()=>e._zod.def.innerType}),Qd=/*@__PURE__*/ $constructor(`ZodDefault`,(e,t)=>{ku.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>defaultProcessor(e,t,n,r),e.unwrap=()=>e._zod.def.innerType,e.removeDefault=e.unwrap}),$d=/*@__PURE__*/ $constructor(`ZodPrefault`,(e,t)=>{Au.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>prefaultProcessor(e,t,n,r),e.unwrap=()=>e._zod.def.innerType}),ef=/*@__PURE__*/ $constructor(`ZodNonOptional`,(e,t)=>{ju.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>nonoptionalProcessor(e,t,n,r),e.unwrap=()=>e._zod.def.innerType}),tf=/*@__PURE__*/ $constructor(`ZodCatch`,(e,t)=>{Mu.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>catchProcessor(e,t,n,r),e.unwrap=()=>e._zod.def.innerType,e.removeCatch=e.unwrap}),nf=/*@__PURE__*/ $constructor(`ZodPipe`,(e,t)=>{Nu.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>pipeProcessor(e,t,n,r),e.in=t.in,e.out=t.out}),rf=/*@__PURE__*/ $constructor(`ZodReadonly`,(e,t)=>{Pu.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>readonlyProcessor(e,t,n,r),e.unwrap=()=>e._zod.def.innerType}),af=/*@__PURE__*/ $constructor(`ZodCustom`,(e,t)=>{Fu.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>customProcessor(e,t,n,r)})})))()}function safeParseWithSchema(e,t){let n=e.safeParse(t);return n.success?n.data:null}function safeParseJsonWithSchema(e,t){try{return safeParseWithSchema(e,JSON.parse(t))}catch{return null}}var of,sf,cf,lf,uf,df,ff,pf,mf,hf,gf,_f,vf,yf,bf,xf,Sf;function init_update_managed_service_handoff_schema(){return(init_update_managed_service_handoff_schema=__esmMin((()=>{init_schemas$1(),of=string().min(1).max(4096),sf={pid:number().int().positive(),startIdentity:of.max(128)},cf=strictObject({...sf,startIdentitySource:literal$1(`argv-sha256`).nullable().optional()}).refine(({startIdentity:e,startIdentitySource:t})=>t===`argv-sha256`?/^win32-argv-sha256:[a-f0-9]{64}$/.test(e):!e.startsWith(`win32-argv-sha256:`)),lf=union([strictObject({platform:_enum([`linux`,`darwin`]),identity:string().regex(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i)}),strictObject({platform:literal$1(`win32`),identity:string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{7}Z$/)}),strictObject({platform:literal$1(`freebsd`),identity:string().regex(/^[a-f0-9]{32}$/)})]),uf=strictObject({kind:literal$1(`native`),unit:of,scope:of,placement:discriminatedUnion(`kind`,[strictObject({kind:literal$1(`pending`)}),strictObject({kind:literal$1(`attached`),invocation:string().regex(/^[a-f0-9]{32}$/i)})])}),df=literal$1(`original-cancellation-v1`),ff=strictObject({kind:literal$1(`update`),mutationProtocol:df}).extend({mutationProtocol:df.optional(),custody:_enum([`reserved`,`bound`]).optional()}),pf=discriminatedUnion(`kind`,[ff,strictObject({kind:literal$1(`triage`),phase:_enum([`reserved`,`running`,`closing`,`closed`,`uncertain`]),lifetime:discriminatedUnion(`kind`,[strictObject({kind:literal$1(`foreground`),boot:lf}),uf])}).refine(e=>e.phase!==`running`||e.lifetime.kind!==`native`||e.lifetime.placement.kind===`attached`)]),mf=of.refine(w.isAbsolute,`Native source path must be absolute`),hf=string().regex(/^[a-f0-9]{64}$/),gf=strictObject({runId:of,transactionId:of,claimId:of,revision:number().int().nonnegative(),recordSha256:hf,serviceKey:mf,configPaths:array(mf).min(1).max(512),lifetimeId:of}),_f=strictObject({id:string().uuid(),phase:_enum([`reserved`,`admitted`]),source:gf}),vf={executor:cf,helper:cf,action:pf},yf=strictObject({version:literal$1(2),executor:cf,helper:cf,action:ff}),bf=strictObject({key:of,owner:of,payload:string().min(1),updatedAt:number().int().nonnegative()}),xf=strictObject({version:literal$1(4),executor:cf,helper:cf,action:ff,cancellation:bf}).refine(e=>{let t=safeParseJsonWithSchema(yf,e.cancellation.payload);return t!==null&&JSON.stringify(t.helper)===JSON.stringify(e.helper)&&JSON.stringify(t.executor)===JSON.stringify(e.executor)&&JSON.stringify(t.action)===JSON.stringify(e.action)&&(JSON.stringify(e.helper)===JSON.stringify(e.executor)||t.action.mutationProtocol===`original-cancellation-v1`)}),Sf=strictObject({version:literal$1(2),...vf,mutationOriginal:bf.optional()}).refine(e=>{if(!e.mutationOriginal)return!0;let t=safeParseJsonWithSchema(yf,e.mutationOriginal.payload);return t!==null&&!e.mutationOriginal.key.includes(`/.openclaw-update-child-`)&&t.action.mutationProtocol===`original-cancellation-v1`}),discriminatedUnion(`version`,[xf,Sf,strictObject({version:literal$1(3),...vf,action:strictObject({kind:literal$1(`update`)}),nativeBorrower:_f})]),strictObject({version:literal$1(1),...sf})})))()}function init_update_managed_service_handoff_boot(){return(init_update_managed_service_handoff_boot=__esmMin((()=>{init_update_managed_service_handoff_schema()})))()}var Cf,wf,Tf,Ef,Df;function init_gateway_lock_payload(){return(init_gateway_lock_payload=__esmMin((()=>{init_schemas$1(),init_update_managed_service_handoff_boot(),init_update_managed_service_handoff_schema(),[Cf,wf,Tf]=lf.options,Ef=string().min(1),Df=discriminatedUnion(`platform`,[Cf.extend({host:Ef,platform:literal$1(`linux`),pidNsInode:string().min(1)}),Cf.extend({host:Ef,platform:literal$1(`darwin`)}),wf.extend({host:Ef}),Tf.extend({host:Ef})]),object({pid:number(),ownerId:string().min(1).optional(),stateOwnerKind:literal$1(`schema`).optional(),cronOwnerProjection:literal$1(`dynamic-default-v1`).optional(),createdAt:string(),startupPhase:literal$1(`starting`).optional(),configPath:string(),port:number().int().min(1).max(65535).optional(),role:_enum([`gateway`,`agent-embedded`,`skill-workshop-apply`,`sqlite-maintenance`]).optional(),stateDir:string().optional(),startTime:number().optional(),processNamespace:Df.nullable().optional()})})))()}var StateDatabaseAccessError,Of;function init_gateway_state_owner_record(){return(init_gateway_state_owner_record=__esmMin((()=>{init_global_singleton(),init_openclaw_state_db_paths(),init_gateway_lock_payload(),StateDatabaseAccessError=class extends Error{constructor(...e){super(...e),this.name=`StateDatabaseAccessError`}},resolveGlobalSingleton(Symbol.for(`openclaw.gatewayStateOwnerContentionError`),()=>class extends Error{constructor(e,t,n,r){super(`OpenClaw state database is busy at ${e}. ${n?`${n} `:``}Wait for the other OpenClaw process to finish, then retry. If it persists, run \`openclaw gateway status\` and check for other OpenClaw processes using the same state directory. A running Gateway can hold this ownership until it stops; stop it through its service manager or original terminal before retrying.`),this.databasePath=e,this.cause=t,this.holderDetail=n,this.holder=r,this.name=`GatewayStateOwnerContentionError`}}),resolveGlobalSingleton(Symbol.for(`openclaw.stateDatabaseMaintenanceScopeError`),()=>class extends StateDatabaseAccessError{constructor(e){super(`Internal state ownership error at ${e}: this process holds maintenance ownership without an active schema lease or maintenance scope. Retry the command; if it persists, report this error.`),this.databasePath=e,this.name=`StateDatabaseMaintenanceScopeError`}}),Of=resolveGlobalSingleton(Symbol.for(`openclaw.stateDatabaseAdmissionPendingError`),()=>class extends StateDatabaseAccessError{constructor(e,t){super(t),this.databasePath=e}}),resolveGlobalSingleton(Symbol.for(`openclaw.stateDatabaseOfflineMaintenanceError`),()=>class extends StateDatabaseAccessError{constructor(e,t){super(t),this.databasePath=e}})})))()}function currentSqliteOperationTiming(){return kf.getStore()?.timing}function forgetConnection(e){if(e.path){let t=Af.byPath.get(e.path);t?.delete(e.id),t?.size===0&&Af.byPath.delete(e.path)}let t=e.database.deref();t&&Af.byDatabase.get(t)===e&&Af.byDatabase.delete(t),Af.finalizer.unregister(e)}var kf,Af;function init_sqlite_reader_lifecycle(){return(init_sqlite_reader_lifecycle=__esmMin((()=>{init_global_singleton(),kf=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteReaderOwners`),()=>new S),resolveGlobalSingleton(Symbol.for(`openclaw.sqliteActiveReaders`),()=>({byDatabase:/* @__PURE__ */ new WeakMap,byPath:/* @__PURE__ */ new Map})),Af=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteReaderConnections`),()=>({nextId:0,byDatabase:/* @__PURE__ */ new WeakMap,byPath:/* @__PURE__ */ new Map,finalizer:new FinalizationRegistry(e=>forgetConnection(e))}))})))()}var jf,SqliteWorkerError;function init_sqlite_worker_contract(){return(init_sqlite_worker_contract=__esmMin((()=>{init_global_singleton(),process.hrtime,jf=Symbol.for(`openclaw.sqliteWorkerErrorCode`),resolveGlobalSingleton(Symbol.for(`openclaw.sqliteWorkerOpenRefusedError`),()=>class extends Error{constructor(e){super(`SQLite worker admission was refused before agent open`,{cause:e}),this.originalError=e,this.name=`SqliteWorkerOpenRefusedError`}}),resolveGlobalSingleton(Symbol.for(`openclaw.sqliteWorkerAdmissionTimeoutError`),()=>class extends Error{constructor(){super(`SQLite host admission timed out; retry after transaction rollback`),this.code=`admission-timeout`,this.name=`SqliteWorkerAdmissionTimeoutError`}}),SqliteWorkerError=class extends Error{constructor(e,t){super(e),this.code=t,this.name=`SqliteWorkerError`,Object.defineProperty(this,jf,{value:t})}}})))()}function bindSqliteDatabaseAdmissionUpstream(e){let t=Pf.connection;if(t){if(t.port!==e)throw new SqliteWorkerError(`SQLite admission upstream changed owner`,`closed`);return}let n={port:e,closed:!1};Pf.connection=n,e.once(`close`,()=>{n.closed=!0}),e.unref()}function exchangeSqliteDatabaseAdmissions(e,t,n,r){return exchangeDatabaseAdmissions(e,t,n,r)}function exchangeDatabaseAdmissions(e,t,n,r){let{port1:i,port2:a}=new p,o=new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)),s=currentSqliteOperationTiming(),c=Date.now();try{for(e.postMessage({kind:`sqlite-database-admissions`,admissions:t,location:n,create:r,port:a,decision:o.buffer},[a]);Atomics.load(o,0)===Mf;)Atomics.wait(o,0,Mf);let s=Atomics.load(o,0);if(s===4&&n&&r===!0)throw new Of(n,`OpenClaw state at ${n} is undergoing schema admission; retry when it finishes.`);if(s!==Nf)throw new SqliteWorkerError(`SQLite admission facts exchange failed`,`unavailable`);let c=readSqliteDatabaseAdmissions(y(i)?.message);if(!c)throw new SqliteWorkerError(`SQLite admission facts reply is unavailable`,`unavailable`);return c}finally{s&&(s.databaseAdmissionWaitMs+=Date.now()-c),i.close(),a.close()}}var Mf,Nf,Pf;function init_sqlite_worker_database_admission_relay(){return(init_sqlite_worker_database_admission_relay=__esmMin((()=>{init_global_singleton(),init_gateway_state_owner_record(),init_sqlite_database_admission_record(),init_sqlite_reader_lifecycle(),init_sqlite_worker_contract(),Mf=0,Nf=1,Pf=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteDatabaseAdmissionUpstream`),()=>({}))})))()}async function collectWorkerIdleGarbage(){if(zf=void 0,process.memoryUsage().heapUsed<=Lf+If)return;let e=Hf;Bf=!0;try{if(!Rf){let e=new xe;e.connect(),Rf=e}await Rf.post(`HeapProfiler.collectGarbage`),Bf=!1,e===Hf?Lf=process.memoryUsage().heapUsed:Vf&&scheduleWorkerIdleGc()}catch(e){Bf=!1,e instanceof Error&&e.message.startsWith(`Inspector error -32601:`)?Rf=null:process.emitWarning(e instanceof Error?e:String(e))}}function scheduleWorkerIdleGc(){g||Rf===null||(Vf=!0,!(zf||Bf)&&(process.memoryUsage().heapUsed<=Lf+If||(zf=setTimeout(()=>{collectWorkerIdleGarbage()},Ff).unref())))}function cancelWorkerIdleGc(){Hf++,Vf=!1,clearTimeout(zf),zf=void 0}var Ff,If,Lf,Rf,zf,Bf,Vf,Hf;function init_worker_idle_gc(){return(init_worker_idle_gc=__esmMin((()=>{Ff=1e3,If=33554432,Lf=0,Bf=!1,Vf=!1,Hf=0})))()}function serveWorkerMemorySamples(e){let{port1:t,port2:n}=new p,r=process.versions.bun?void 0:s().heap_size_limit,i,flushGc=()=>{i&&=(t.postMessage({gc:i}),void 0)},sample=()=>{let{heapUsed:e,heapTotal:n,external:a,arrayBuffers:o}=process.memoryUsage();t.postMessage({heapUsed:e,heapTotal:n,external:a,arrayBuffers:o,heapSizeLimitBytes:r,gc:i}),i=void 0},a;return t.on(`message`,e=>{e?e.gc?a??=observeGcSamples(e=>{(i??=[]).push(...e),i.length>=Uf&&flushGc()}):(a?.(),a=void 0,i=void 0):sample()}),t.once(`close`,()=>{a?.(),i=void 0}),t.on(`messageerror`,()=>t.close()),t.unref(),sample(),e.postMessage({status:`memory`,port:n},[n]),()=>{a?.(),flushGc(),t.close()}}var Uf;function init_worker_memory(){return(init_worker_memory=__esmMin((()=>{init_gc_observer(),Uf=256})))()}function init_worker_task_transport(){return(init_worker_task_transport=__esmMin((()=>{})))()}function serveWorkerTasks(e,t={}){serveOwnedWorkerTasks(e,t)}function serveOwnedWorkerTasks(e,t={}){let n,r,i,a,runWithDatabaseAdmission=async e=>{let t=i;if(!t)return e();let n=!0;try{return await withSqliteDatabaseAdmissionExchange((e,r,i)=>{if(!n)throw Error(`SQLite admission facts outlived their worker task`);return exchangeSqliteDatabaseAdmissions(t,e,r,i)},e)}finally{n=!1}};serveOwnedWorkerTasks$1((t,n,r)=>runWithDatabaseAdmission(()=>e(t,n,r)),{...t,closeResource:e=>runWithDatabaseAdmission(async()=>{let n=decodeAgentDatabaseReaderRequest(e);if(!n&&!t.closeResource)throw Error(`Worker does not own retained resources`);n&&await applyAgentDatabaseReaderRequest(n),(!n||n.kind===`close`)&&await t.closeResource?.(e)})},{selectStartupPort(e){if(isRecord(e)&&e.type===`openclaw.worker-task-port`){if(!(e.port instanceof m))throw Error(`Retained worker task port is invalid`);return r=e.port,r}},initialize(e){T.forceConsoleToStderr=!0,n=e},onReady(){r?.postMessage({status:`ready`},[])},onMessage(e){e&&!a&&(a=serveWorkerMemorySamples(n)),cancelWorkerIdleGc()},installTaskContext(e){installDeletedAgentDatabaseFences(e.deletedAgentDatabaseFences),e.databaseAdmissionPort&&bindSqliteDatabaseAdmissionUpstream(e.databaseAdmissionPort),i??=e.databaseAdmissionPort},onIdle(){scheduleOpenClawCompileCacheFlush(),t.idleGc!==!1&&scheduleWorkerIdleGc()},onRetire(){cancelWorkerIdleGc();try{a?.()}finally{i?.close()}}})}function init_worker_task_server$1(){return(init_worker_task_server$1=__esmMin((()=>{init_detached_async_context(),init_worker(),init_node_compile_cache(),init_state(),init_agent_database_readers(),init_sqlite_database_admission(),init_sqlite_worker_database_admission_relay(),init_worker_idle_gc(),init_worker_memory(),init_worker_task_transport()})))()}var Wf;function init_code_mode_console_source(){return(init_code_mode_console_source=__esmMin((()=>{Wf=String.raw`
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
`})))()}var Gf;function init_code_mode_swarm_controller_source(){return(init_code_mode_swarm_controller_source=__esmMin((()=>{Gf=String.raw`
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
`})))()}var Kf;function init_code_mode_controller_source(){return(init_code_mode_controller_source=__esmMin((()=>{init_code_mode_console_source(),init_code_mode_swarm_controller_source(),Kf=String.raw`
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
  // Bridge payloads carry trusted failure codes; guest JSON replacements must not rewrite them.
  const parseJson = JSON.parse;
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

  ${Wf}

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

  ${Gf}

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
    return safe(value.value);
  }

  function settle(id, ok, payload) {
    const entry = pending.get(String(id));
    if (!entry) return false;
    pending.delete(String(id));
    // Workers pass host-encoded strings; avoid guest-mutable String coercion.
    let parsed = null;
    if (typeof payload === "string") {
      try {
        parsed = parseJson(payload);
      } catch {
        parsed = payload;
      }
    }
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
        code === "invalid_input" || code === "input_contract" ? "invalid_input" : "internal_error",
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
    read: (name) => request("skillsRead", [name]),
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
          : () => request("describe", [callableName]),
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
    __openclawDrainQueuedRequests: { value: drainQueuedRequests },
    __openclawAdmissionError: { value: () => admissionError },
    // Final getters must run before the worker drains output and settles host work.
    __openclawRunCell: { value: async (run) => encodeFinalValue(await run()) },
    __openclawTakeOutputJson: { value: () => encodeFinalValue(output.splice(0)) },
    __openclawTrackRejection: {
      value: (promise, _reason, handled) => {
        if (handled) unhandledRejections.delete(promise);
        else unhandledRejections.add(promise);
      },
    },
    __openclawUnhandledRejection: { value: () => unhandledRejections.values().next().value },
  });
})();
`})))()}function jsonUtf8Bytes(e){try{return Buffer.byteLength(JSON.stringify(e),`utf8`)}catch{return Buffer.byteLength(String(e),`utf8`)}}function isContinuationByte(e){return e!==void 0&&(e&192)==128}function truncateEncodedPrefix(e,t){let n=t;for(;n>0&&isContinuationByte(e[n]);)--n;return e.subarray(0,n).toString(`utf8`)}function truncateUtf8Prefix(e,t){return t<=0?``:e.length<=t&&_e.byteLength(e)<=t?e:truncateEncodedPrefix(_e.from(e.slice(0,t)),t)}function init_utf8_truncate(){return(init_utf8_truncate=__esmMin((()=>{})))()}function createJsonPrefixFitter(e,t,n){let r=Buffer.byteLength(e,`utf8`),i,a,o=[],s=256;return c=>{if(c<=0)return``;if(r<=c&&(a??=jsonUtf8Bytes(e))+n(r)<=c)return e;i??=Buffer.from(e.slice(0,Math.ceil(Math.min(r,t))));let l=0,u=2,d=0,f=o.length-1;for(;d<=f;){let e=d+f>>>1,t=o[e];t.end<=c&&t.jsonBytes+n(t.end)<=c?(l=t.end,u=t.jsonBytes,d=e+1):f=e-1}for(;l<i.byteLength;){let e=i[l],t=e<128?1:e<224?2:e<240?3:4,a=l+t;if(a>=r||a>c||(u+=e===34||e===92||e===8||e===9||e===10||e===12||e===13?2:e<32?6:t,u+n(a)>c))break;l=a,l>=s&&(o.push({end:l,jsonBytes:u}),s=l+256)}return i.subarray(0,l).toString(`utf8`)}}function init_code_mode_json_fit(){return(init_code_mode_json_fit=__esmMin((()=>{})))()}function init_tool_result_text_budget(){return(init_tool_result_text_budget=__esmMin((()=>{init_cjk_chars()})))()}function init_tool_result_limits(){return(init_tool_result_limits=__esmMin((()=>{init_tool_result_text_budget()})))()}var qf,Jf;function init_external_content(){return(init_external_content=__esmMin((()=>{new RegExp([...[`<|im_start|>`,`<|im_end|>`,`<|endoftext|>`,`<|begin_of_text|>`,`<|end_of_text|>`,`<|start_header_id|>`,`<|end_header_id|>`,`<|eot_id|>`,`<|python_tag|>`,`<|eom_id|>`,`[INST]`,`[/INST]`,`<<SYS>>`,`<</SYS>>`,`<s>`,`</s>`,`<|channel|>`,`<|message|>`,`<|return|>`,`<|call|>`,`<start_of_turn>`,`<end_of_turn>`].map(escapeRegExp),`<\\|reserved_special_token_\\d+\\|>`].join(`|`),`g`),qf=65248,Jf={65308:`<`,65310:`>`,9001:`<`,9002:`>`,12296:`<`,12297:`>`,8249:`<`,8250:`>`,10216:`<`,10217:`>`,65124:`<`,65125:`>`,171:`<`,187:`>`,12298:`<`,12299:`>`,10218:`<`,10219:`>`,10220:`<`,10221:`>`,10222:`<`,10223:`>`,10092:`<`,10093:`>`,10094:`<`,10095:`>`,706:`<`,707:`>`,8203:``,8204:``,8205:``,8288:``,65279:``,173:``};for(let e of[65313,65345])for(let t=e;t<e+26;t+=1)Jf[t]=String.fromCharCode(t-qf);RegExp(`[${Object.keys(Jf).map(e=>String.fromCharCode(Number(e))).join(``)}]`,`u`)})))()}function init_tool_search_control_result(){return(init_tool_search_control_result=__esmMin((()=>{init_external_content()})))()}function stringifyCodeModeJsonSafe(e){try{return JSON.stringify(e)??`null`}catch{if(e instanceof Error)return JSON.stringify({name:e.name,message:e.message});switch(typeof e){case`number`:return JSON.stringify(e);case`bigint`:case`symbol`:case`function`:return JSON.stringify(String(e));default:return JSON.stringify(Object.prototype.toString.call(e))}}}function retainSource(e,t,n){return t<=n?{kind:`complete`,json:e}:{kind:`prefix`,json:truncateUtf8Prefix(e,n),originalBytes:t}}function captureCodeModeValue(e,t,n=t){let r=stringifyCodeModeJsonSafe(e),i=r.startsWith(`{`)||r.startsWith(`[`)?Math.max(t,n):t;return retainSource(r,Buffer.byteLength(r,`utf8`),i)}function createErrorFitter(e,t){let n=createJsonPrefixFitter(e,t,()=>18);return e=>`${n(e)} [error truncated]`}function boundCodeModeError(e,t){return jsonUtf8Bytes(e)<=t?e:createErrorFitter(e,t)(t)}var Yf;function init_code_mode_json(){return(init_code_mode_json=__esmMin((()=>{init_utf8_truncate(),init_code_mode_json_fit(),init_tool_result_limits(),init_tool_search_control_result(),Yf={count:0,source:{kind:`complete`,json:`[]`}}})))()}var Xf,CodeModeNodeProgress;function init_code_mode_node_progress(){return(init_code_mode_node_progress=__esmMin((()=>{Xf=64,CodeModeNodeProgress=class{constructor(e){this.buffer=typeof e==`number`?new SharedArrayBuffer(Xf+e):e,this.state=new Int32Array(this.buffer,0,2),this.headers=new DataView(this.buffer),this.bytes=Buffer.from(this.buffer,Xf)}get deadline(){return this.headers.getFloat64(56)}set deadline(e){this.headers.setFloat64(56,e)}get networkContentObserved(){return Atomics.load(this.state,1)===1}observeNetworkContent(){Atomics.store(this.state,1,1)}append(e){let t=Atomics.load(this.state,0),[n,r,i]=this.header(t),a=(n===0?`[`:`,`)+e,o=r+Buffer.byteLength(a),s=r===i?this.bytes.write(a,i):0,c=8+(1-t)*24;return this.headers.setFloat64(c,n+1),this.headers.setFloat64(c+8,o),this.headers.setFloat64(c+16,i+s),Atomics.store(this.state,0,1-t),n+1}resetOutput(){let e=1-Atomics.load(this.state,0);for(let t=0;t<3;t++)this.headers.setFloat64(8+e*24+t*8,0);Atomics.store(this.state,0,e)}output(){let[e,t,n]=this.header(Atomics.load(this.state,0)),r=e===0?`[]`:this.bytes.toString(`utf8`,0,n);return{count:e,source:e===0||t+1<=this.bytes.length?{kind:`complete`,json:e===0?r:r+`]`}:{kind:`prefix`,json:r,originalBytes:t+1}}}header(e){let t=8+e*24;return[this.headers.getFloat64(t),this.headers.getFloat64(t+8),this.headers.getFloat64(t+16)]}}})))()}function sourceExtent(e,t){let n=1,r=0;for(let t of e.matchAll(/\r\n|[\r\n\u2028\u2029]/gu))n+=1,r=t.index+t[0].length;let i=e.slice(r);return{lines:n,lastColumn:(t===`utf8`?Buffer.byteLength(i,`utf8`):i.length)+1}}function normalizeSourceStack(e,t){return!e||!t?e:e.replace(/^[^\S\r\n]+at [^\r\n]*openclaw-code-mode:(?:user|controller)\.js:\d+:\d+\)?(?:\r?\n|$)/gmu,e=>{let n=/openclaw-code-mode:user\.js:(\d+):(\d+)(?=\)?(?:\r?\n)?$)/u.exec(e);if(!n)return``;let r=Number(n[1])-t.lineOffset,i=Number(n[2]),a=i-(r===1?t.columnOffset:0);return r<1||r>t.lineCount||a<1||r===t.lineCount&&i>t.endColumn?``:e.replace(n[0],t.file+`:`+r+`:`+a)})}function buildUserSource(e,t=``,n=`utf8`){let r=`globalThis.__openclawResult = __openclawRunCell(async () => {\n${t}`,i=sourceExtent(r,n),a=sourceExtent(e,n),o=i.lastColumn-1;return{source:`${r}${e}\n})`,location:{file:Zf,lineOffset:i.lines-1,lineCount:a.lines,columnOffset:o,endColumn:a.lastColumn+(a.lines===1?o:0)}}}var Zf;function init_code_mode_source_location(){return(init_code_mode_source_location=__esmMin((()=>{Zf=`openclaw-code-mode:user.js`})))()}function isInAstralSet(e,t){for(var n=65536,r=0;r<t.length;r+=2){if(n+=t[r],n>e)return!1;if(n+=t[r+1],n>=e)return!0}return!1}function isIdentifierStart(e,t){return e<65?e===36:e<91?!0:e<97?e===95:e<123?!0:e<=65535?e>=170&&op.test(String.fromCharCode(e)):t!==!1&&isInAstralSet(e,$f)}function isIdentifierChar(e,t){return e<48?e===36:e<58?!0:e<65?!1:e<91?!0:e<97?e===95:e<123?!0:e<=65535?e>=170&&sp.test(String.fromCharCode(e)):t===!1?!1:isInAstralSet(e,$f)||isInAstralSet(e,Qf)}function binop(e,t){return new TokenType(e,{beforeExpr:!0,binop:t})}function kw(e,t){return t===void 0&&(t={}),t.keyword=e,cp[e]=new TokenType(e,t)}function isNewLine(e){return e===10||e===13||e===8232||e===8233}function nextLineBreak(e,t,n){n===void 0&&(n=e.length);for(var r=t;r<n;r++){var i=e.charCodeAt(r);if(isNewLine(i))return r<n-1&&i===13&&e.charCodeAt(r+1)===10?r+2:r+1}return-1}function wordsRegexp(e){return gp[e]||(gp[e]=RegExp(`^(?:`+e.replace(/ /g,`|`)+`)$`))}function codePointToString(e){return e<=65535?String.fromCharCode(e):(e-=65536,String.fromCharCode((e>>10)+55296,(e&1023)+56320))}function getLineInfo(e,t){for(var n=1,r=0;;){var i=nextLineBreak(e,r,t);if(i<0)return new Position(n,t-r);++n,r=i}}function getOptions(e){var t={};for(var n in vp)t[n]=e&&mp(e,n)?e[n]:vp[n];if(t.ecmaVersion===`latest`?t.ecmaVersion=1e8:t.ecmaVersion==null?(!yp&&typeof console==`object`&&console.warn&&(yp=!0,console.warn(`Since Acorn 8.0.0, options.ecmaVersion is required.
Defaulting to 2020, but this will stop working in the future.`)),t.ecmaVersion=11):t.ecmaVersion>=2015&&(t.ecmaVersion-=2009),t.allowReserved??=t.ecmaVersion<5,(!e||e.allowHashBang==null)&&(t.allowHashBang=t.ecmaVersion>=14),hp(t.onToken)){var r=t.onToken;t.onToken=function(e){return r.push(e)}}if(hp(t.onComment)&&(t.onComment=pushComment(t,t.onComment)),t.sourceType===`commonjs`&&t.allowAwaitOutsideFunction)throw Error(`Cannot use allowAwaitOutsideFunction with sourceType: commonjs`);return t}function pushComment(e,t){return function(n,r,i,a,o,s){var c={type:n?`Block`:`Line`,value:r,start:i,end:a};e.locations&&(c.loc=new SourceLocation(this,o,s)),e.ranges&&(c.range=[i,a]),t.push(c)}}function functionFlags(e,t){return xp|(e?Sp:0)|(t?Cp:0)}function keywordOpAt(e,t){for(var n=t+1,r=Math.min(e.input.length,t+11);n<r;){var i=e.fullCharCodeAt(n);if(!isIdentifierChar(i,!0))break;n+=i<=65535?1:2}return n===t+2&&e.input.slice(t,n)===`in`||n===t+10&&e.input.slice(t,n)===`instanceof`}function isPrivateNameConflicted(e,t){var n=t.key.name,r=e[n],i=`true`;return t.type===`MethodDefinition`&&(t.kind===`get`||t.kind===`set`)&&(i=(t.static?`s`:`i`)+t.kind),r===`iget`&&i===`iset`||r===`iset`&&i===`iget`||r===`sget`&&i===`sset`||r===`sset`&&i===`sget`?(e[n]=`true`,!1):r?!0:(e[n]=i,!1)}function checkKeyName(e,t){var n=e.computed,r=e.key;return!n&&(r.type===`Identifier`&&r.name===t||r.type===`Literal`&&r.value===t)}function isLocalVariableAccess(e){return e.type===`Identifier`||e.type===`ParenthesizedExpression`&&isLocalVariableAccess(e.expression)}function isPrivateFieldAccess(e){return e.type===`MemberExpression`&&e.property.type===`PrivateIdentifier`||e.type===`ChainExpression`&&isPrivateFieldAccess(e.expression)||e.type===`ParenthesizedExpression`&&isPrivateFieldAccess(e.expression)}function finishNodeAt(e,t,n,r){return e.type=t,e.end=n,this.options.locations&&(e.loc.end=r),this.options.ranges&&(e.range[1]=n),e}function buildUnicodeData(e){var t=dm[e]={binary:wordsRegexp(nm[e]+` `+im),binaryOfStrings:wordsRegexp(rm[e]),nonBinary:{General_Category:wordsRegexp(im),Script:wordsRegexp(um[e])}};t.nonBinary.Script_Extensions=t.nonBinary.Script,t.nonBinary.gc=t.nonBinary.General_Category,t.nonBinary.sc=t.nonBinary.Script,t.nonBinary.scx=t.nonBinary.Script_Extensions}function hasProp(e){for(var t in e)return!0;return!1}function isRegularExpressionModifier(e){return e===105||e===109||e===115}function isSyntaxCharacter(e){return e===36||e>=40&&e<=43||e===46||e===63||e>=91&&e<=94||e>=123&&e<=125}function isRegExpIdentifierStart(e){return isIdentifierStart(e,!0)||e===36||e===95}function isRegExpIdentifierPart(e){return isIdentifierChar(e,!0)||e===36||e===95||e===8204||e===8205}function isControlLetter(e){return e>=65&&e<=90||e>=97&&e<=122}function isValidUnicode(e){return e>=0&&e<=1114111}function isCharacterClassEscape(e){return e===100||e===68||e===115||e===83||e===119||e===87}function isUnicodePropertyNameCharacter(e){return isControlLetter(e)||e===95}function isUnicodePropertyValueCharacter(e){return isUnicodePropertyNameCharacter(e)||isDecimalDigit(e)}function isClassSetReservedDoublePunctuatorCharacter(e){return e===33||e>=35&&e<=38||e>=42&&e<=44||e===46||e>=58&&e<=64||e===94||e===96||e===126}function isClassSetSyntaxCharacter(e){return e===40||e===41||e===45||e===47||e>=91&&e<=93||e>=123&&e<=125}function isClassSetReservedPunctuator(e){return e===33||e===35||e===37||e===38||e===44||e===45||e>=58&&e<=62||e===64||e===96||e===126}function isDecimalDigit(e){return e>=48&&e<=57}function isHexDigit(e){return e>=48&&e<=57||e>=65&&e<=70||e>=97&&e<=102}function hexToInt(e){return e>=65&&e<=70?10+(e-65):e>=97&&e<=102?10+(e-97):e-48}function isOctalDigit(e){return e>=48&&e<=55}function stringToNumber(e,t){return t?parseInt(e,8):parseFloat(e.replace(/_/g,``))}function stringToBigInt(e){return typeof BigInt==`function`?BigInt(e.replace(/_/g,``)):null}function parse(e,t){return Parser.parse(e,t)}var Qf,$f,ep,tp,np,rp,ip,ap,op,sp,TokenType,B,V,cp,H,U,lp,up,W,dp,fp,pp,mp,hp,gp,_p,Position,SourceLocation,vp,yp,bp,xp,Sp,Cp,wp,Tp,Ep,Dp,Op,kp,Ap,jp,Mp,Np,Pp,Fp,Ip,Lp,Parser,G,K,Rp,DestructuringErrors,q,zp,Bp,Vp,Hp,Up,Wp,J,TokContext,Y,Gp,X,Kp,qp,Jp,Scope,Node,Yp,Xp,Zp,Qp,$p,em,tm,nm,rm,im,am,om,sm,cm,lm,um,dm,fm,pm,mm,Z,BranchID,RegExpValidationState,hm,gm,Q,Token,$,_m,vm;function init_acorn(){return(init_acorn=__esmMin((()=>{for(Qf=[509,0,227,0,150,4,294,9,1368,2,2,1,6,3,41,2,5,0,166,1,574,3,9,9,7,9,32,4,318,1,31,4,33,15,71,10,50,3,123,2,54,14,32,10,3,1,11,3,46,10,8,0,46,9,7,2,37,13,2,9,6,1,45,0,13,2,49,13,9,3,2,11,83,11,7,0,3,0,158,11,6,9,7,3,56,1,2,6,3,1,3,2,10,0,11,1,3,6,4,4,68,8,2,0,3,0,2,3,2,4,2,0,15,1,83,17,10,9,5,0,82,19,13,9,214,6,3,8,28,1,83,16,16,9,82,12,9,9,7,19,58,14,5,9,243,14,166,9,71,5,2,1,3,3,2,0,2,1,13,9,120,6,3,6,4,0,29,9,41,6,2,3,9,0,10,10,47,15,199,7,137,9,54,7,2,7,17,9,57,21,2,13,123,5,4,0,2,1,2,6,2,0,9,9,49,4,2,1,2,4,9,9,55,9,7,0,259,3,10,1,2,0,49,6,4,4,14,10,5350,0,7,14,11465,27,2343,9,87,9,39,4,60,6,26,9,535,9,470,0,2,54,8,3,82,0,12,1,19628,1,4178,9,519,45,3,22,481,1,61,4,4,5,9,7,3,6,31,3,149,2,12,2,9,1,3,0,33,1,1357,49,513,54,5,49,9,0,15,0,23,4,2,14,1361,6,2,16,3,6,2,1,2,4,101,0,161,6,10,9,357,0,62,13,499,13,245,1,2,9,233,0,3,0,8,1,6,0,475,6,110,6,6,9,4759,9,787719,239],$f=[0,11,2,25,2,18,2,1,2,14,3,13,35,122,70,52,268,28,4,48,48,31,14,29,6,37,11,29,3,35,5,7,2,4,43,157,19,35,5,35,5,39,9,51,13,10,2,14,2,6,2,1,2,10,2,14,2,6,2,1,4,51,13,310,10,21,11,7,25,5,2,41,2,13,65,5,3,0,2,43,2,1,4,0,3,22,11,22,10,30,66,18,2,1,11,21,11,25,7,25,39,55,7,1,65,0,16,3,2,2,2,28,43,28,4,28,36,7,2,27,28,53,11,21,11,18,14,17,111,72,56,50,14,50,14,35,39,27,10,22,251,41,7,1,17,5,18,21,18,28,11,0,9,21,43,17,47,20,28,22,13,52,58,1,3,0,14,44,33,24,27,35,30,0,3,0,9,34,4,0,13,47,15,3,22,0,2,0,36,17,2,24,20,1,64,6,2,0,2,3,2,14,2,9,8,46,39,7,3,1,3,21,2,6,2,1,2,4,4,0,19,0,13,4,31,9,2,0,3,0,2,37,2,0,26,0,2,0,45,52,19,3,21,2,31,47,21,1,2,0,185,46,42,3,37,47,21,0,60,42,14,0,72,26,38,6,186,43,117,63,32,7,3,0,3,7,2,1,2,23,16,0,2,0,95,7,3,38,17,0,2,0,29,0,11,39,8,0,22,0,12,45,20,0,19,72,18,0,182,32,32,8,2,36,18,0,50,29,113,6,2,1,2,37,22,0,26,5,2,1,2,31,15,0,24,43,22,0,239,18,16,0,2,12,2,33,125,0,80,921,103,111,6,206,13,310,2314,96,16,1071,18,5,26,3994,6,582,6842,29,1763,568,8,30,18,78,18,29,19,47,17,3,32,20,6,18,433,44,212,63,33,24,3,24,45,74,6,0,67,12,65,1,2,0,15,4,10,7386,37,33,96,114,14,913,15,50,7710,3,2,6,2,1,2,296,10,0,30,2,3,0,15,4,8,395,2309,106,6,12,4,8,8,9,5991,84,2,70,2,1,3,0,3,1,3,3,2,11,2,0,2,6,2,64,2,3,3,7,2,6,2,27,2,3,2,4,2,0,4,6,2,340,2,24,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,7,1845,129,15,6,55,50,49,61,147,44,11,6,17,0,322,29,19,43,485,27,229,29,3,0,208,30,2,2,2,1,2,6,3,4,10,1,225,6,2,3,2,1,2,14,2,196,60,67,8,0,1205,3,2,26,2,1,2,0,3,0,2,9,2,3,2,0,2,0,7,0,5,0,2,0,2,0,2,2,2,1,2,0,3,0,2,0,2,0,2,0,2,0,2,1,2,0,3,3,2,6,2,3,2,3,2,0,2,9,2,16,6,2,2,4,2,16,4421,42719,33,4382,2,5773,3,7472,16,621,2467,541,1507,4938,6,8489,39815,11327],ep=`‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄ-׉ؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୓-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-᫰ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･`,tp=`ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆ՘ՙՠ-ֈ֋֌א-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-࢏ࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚ౜ౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽ೜-ೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿ₏-₟ℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-꟝꟢꟱-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩ꭬꭭ꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ`,np={3:`abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile`,5:`class enum extends super const export import`,6:`enum`,strict:`implements interface let package private protected public static yield`,strictBind:`eval arguments`},rp=`break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this`,ip={5:rp,"5module":rp+` export import`,6:rp+` const class extends export import super`},ap=/^in(stanceof)?$/,op=RegExp(`[`+tp+`]`),sp=RegExp(`[`+tp+ep+`]`),TokenType=function(e,t){t===void 0&&(t={}),this.label=e,this.keyword=t.keyword,this.beforeExpr=!!t.beforeExpr,this.startsExpr=!!t.startsExpr,this.isLoop=!!t.isLoop,this.isAssign=!!t.isAssign,this.prefix=!!t.prefix,this.postfix=!!t.postfix,this.binop=t.binop||null,this.updateContext=null},B={beforeExpr:!0},V={startsExpr:!0},cp={},H={num:new TokenType(`num`,V),regexp:new TokenType(`regexp`,V),string:new TokenType(`string`,V),name:new TokenType(`name`,V),privateId:new TokenType(`privateId`,V),eof:new TokenType(`eof`),bracketL:new TokenType(`[`,{beforeExpr:!0,startsExpr:!0}),bracketR:new TokenType(`]`),braceL:new TokenType(`{`,{beforeExpr:!0,startsExpr:!0}),braceR:new TokenType(`}`),parenL:new TokenType(`(`,{beforeExpr:!0,startsExpr:!0}),parenR:new TokenType(`)`),comma:new TokenType(`,`,B),semi:new TokenType(`;`,B),colon:new TokenType(`:`,B),dot:new TokenType(`.`),question:new TokenType(`?`,B),questionDot:new TokenType(`?.`),arrow:new TokenType(`=>`,B),template:new TokenType(`template`),invalidTemplate:new TokenType(`invalidTemplate`),ellipsis:new TokenType(`...`,B),backQuote:new TokenType("`",V),dollarBraceL:new TokenType("${",{beforeExpr:!0,startsExpr:!0}),eq:new TokenType(`=`,{beforeExpr:!0,isAssign:!0}),assign:new TokenType(`_=`,{beforeExpr:!0,isAssign:!0}),incDec:new TokenType(`++/--`,{prefix:!0,postfix:!0,startsExpr:!0}),prefix:new TokenType(`!/~`,{beforeExpr:!0,prefix:!0,startsExpr:!0}),logicalOR:binop(`||`,1),logicalAND:binop(`&&`,2),bitwiseOR:binop(`|`,3),bitwiseXOR:binop(`^`,4),bitwiseAND:binop(`&`,5),equality:binop(`==/!=/===/!==`,6),relational:binop(`</>/<=/>=`,7),bitShift:binop(`<</>>/>>>`,8),plusMin:new TokenType(`+/-`,{beforeExpr:!0,binop:9,prefix:!0,startsExpr:!0}),modulo:binop(`%`,10),star:binop(`*`,10),slash:binop(`/`,10),starstar:new TokenType(`**`,{beforeExpr:!0}),coalesce:binop(`??`,1),_break:kw(`break`),_case:kw(`case`,B),_catch:kw(`catch`),_continue:kw(`continue`),_debugger:kw(`debugger`),_default:kw(`default`,B),_do:kw(`do`,{isLoop:!0,beforeExpr:!0}),_else:kw(`else`,B),_finally:kw(`finally`),_for:kw(`for`,{isLoop:!0}),_function:kw(`function`,V),_if:kw(`if`),_return:kw(`return`,B),_switch:kw(`switch`),_throw:kw(`throw`,B),_try:kw(`try`),_var:kw(`var`),_const:kw(`const`),_while:kw(`while`,{isLoop:!0}),_with:kw(`with`),_new:kw(`new`,{beforeExpr:!0,startsExpr:!0}),_this:kw(`this`,V),_super:kw(`super`,V),_class:kw(`class`,V),_extends:kw(`extends`,B),_export:kw(`export`),_import:kw(`import`,V),_null:kw(`null`,V),_true:kw(`true`,V),_false:kw(`false`,V),_in:kw(`in`,{beforeExpr:!0,binop:7}),_instanceof:kw(`instanceof`,{beforeExpr:!0,binop:7}),_typeof:kw(`typeof`,{beforeExpr:!0,prefix:!0,startsExpr:!0}),_void:kw(`void`,{beforeExpr:!0,prefix:!0,startsExpr:!0}),_delete:kw(`delete`,{beforeExpr:!0,prefix:!0,startsExpr:!0})},U=/\r\n?|\n|\u2028|\u2029/,lp=new RegExp(U.source,`g`),up=/[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/,W=/(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g,dp=Object.prototype,fp=dp.hasOwnProperty,pp=dp.toString,mp=Object.hasOwn||(function(e,t){return fp.call(e,t)}),hp=Array.isArray||(function(e){return pp.call(e)===`[object Array]`}),gp=Object.create(null),_p=/(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/,Position=function(e,t){this.line=e,this.column=t},Position.prototype.offset=function(e){return new Position(this.line,this.column+e)},SourceLocation=function(e,t,n){this.start=t,this.end=n,e.sourceFile!==null&&(this.source=e.sourceFile)},vp={ecmaVersion:null,sourceType:`script`,strict:!1,onInsertedSemicolon:null,onTrailingComma:null,allowReserved:null,allowReturnOutsideFunction:!1,allowImportExportEverywhere:!1,allowAwaitOutsideFunction:null,allowSuperOutsideMethod:null,allowHashBang:!1,checkPrivateFields:!0,locations:!1,startLocation:null,onToken:null,onComment:null,ranges:!1,program:null,sourceFile:null,directSourceFile:null,preserveParens:!1},yp=!1,bp=1,xp=2,Sp=4,Cp=8,wp=16,Tp=32,Ep=64,Dp=128,Op=256,kp=512,Ap=1024,jp=bp|xp|Op,Mp=0,Np=1,Pp=2,Fp=3,Ip=4,Lp=5,Parser=function(e,t,n){this.options=e=getOptions(e),this.sourceFile=e.sourceFile,this.keywords=wordsRegexp(ip[e.ecmaVersion>=6?6:e.sourceType===`module`?`5module`:5]);var r=``;e.allowReserved!==!0&&(r=np[e.ecmaVersion>=6?6:e.ecmaVersion===5?5:3],e.sourceType===`module`&&(r+=` await`)),this.reservedWords=wordsRegexp(r);var i=(r?r+` `:``)+np.strict;this.reservedWordsStrict=wordsRegexp(i),this.reservedWordsStrictBind=wordsRegexp(i+` `+np.strictBind),this.input=String(t),this.containsEsc=!1,this.pos=n||0,this.curLine=1,e.startLocation?(this.lineStart=this.pos-e.startLocation.column,this.curLine=e.startLocation.line):n?(this.lineStart=this.input.lastIndexOf(`
`,n-1)+1,this.options.locations&&(this.curLine=this.input.slice(0,this.lineStart).split(U).length)):this.lineStart=0,this.type=H.eof,this.value=null,this.start=this.end=this.pos,this.startLoc=this.endLoc=this.curPosition(),this.lastTokEndLoc=this.lastTokStartLoc=null,this.lastTokStart=this.lastTokEnd=this.pos,this.context=this.initialContext(),this.exprAllowed=!0,this.inModule=e.sourceType===`module`,this.strict=this.inModule||e.strict===!0||this.strictDirective(this.pos),this.potentialArrowAt=-1,this.potentialArrowInForAwait=!1,this.yieldPos=this.awaitPos=this.awaitIdentPos=0,this.labels=[],this.undefinedExports=Object.create(null),this.pos===0&&e.allowHashBang&&this.input.slice(0,2)===`#!`&&this.skipLineComment(2),this.scopeStack=[],this.enterScope(this.options.sourceType===`commonjs`?xp:bp),this.regexpState=null,this.privateNameStack=[]},G={inFunction:{configurable:!0},inGenerator:{configurable:!0},inAsync:{configurable:!0},canAwait:{configurable:!0},allowReturn:{configurable:!0},allowSuper:{configurable:!0},allowDirectSuper:{configurable:!0},treatFunctionsAsVar:{configurable:!0},allowNewDotTarget:{configurable:!0},allowUsing:{configurable:!0},inClassStaticBlock:{configurable:!0}},Parser.prototype.parse=function(){var e=this,t=this.options.program||this.startNode();return this.nextToken(),this.catchStackOverflow(function(){return e.parseTopLevel(t)})},G.inFunction.get=function(){return(this.currentVarScope().flags&xp)>0},G.inGenerator.get=function(){return(this.currentVarScope().flags&Cp)>0},G.inAsync.get=function(){return(this.currentVarScope().flags&Sp)>0},G.canAwait.get=function(){for(var e=this.scopeStack.length-1;e>=0;e--){var t=this.scopeStack[e].flags;if(t&(Op|kp))return!1;if(t&xp)return(t&Sp)>0}return this.inModule&&this.options.ecmaVersion>=13||this.options.allowAwaitOutsideFunction},G.allowReturn.get=function(){return!!(this.inFunction||this.options.allowReturnOutsideFunction&&this.currentVarScope().flags&bp)},G.allowSuper.get=function(){return(this.currentThisScope().flags&Ep)>0||this.options.allowSuperOutsideMethod},G.allowDirectSuper.get=function(){return(this.currentThisScope().flags&Dp)>0},G.treatFunctionsAsVar.get=function(){return this.treatFunctionsAsVarInScope(this.currentScope())},G.allowNewDotTarget.get=function(){for(var e=this.scopeStack.length-1;e>=0;e--){var t=this.scopeStack[e].flags;if(t&(Op|kp)||t&xp&&!(t&wp))return!0}return!1},G.allowUsing.get=function(){var e=this.currentScope().flags;return!(e&Ap||!this.inModule&&e&bp)},G.inClassStaticBlock.get=function(){return(this.currentVarScope().flags&Op)>0},Parser.extend=function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];for(var n=this,r=0;r<e.length;r++)n=e[r](n);return n},Parser.parse=function(e,t){return new this(t,e).parse()},Parser.parseExpressionAt=function(e,t,n){var r=new this(n,e,t);return r.nextToken(),r.parseExpression()},Parser.tokenizer=function(e,t){return new this(t,e)},Object.defineProperties(Parser.prototype,G),K=Parser.prototype,Rp=/^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/,K.strictDirective=function(e){if(this.options.ecmaVersion<5)return!1;for(;;){W.lastIndex=e,e+=W.exec(this.input)[0].length;var t=Rp.exec(this.input.slice(e));if(!t)return!1;if((t[1]||t[2])===`use strict`){W.lastIndex=e+t[0].length;var n=W.exec(this.input),r=n.index+n[0].length,i=this.input.charAt(r);return i===`;`||i===`}`||U.test(n[0])&&!(/[(`.[+\-/*%<>=,?^&]/.test(i)||i===`!`&&this.input.charAt(r+1)===`=`||i===`i`&&keywordOpAt(this,r))}e+=t[0].length,W.lastIndex=e,e+=W.exec(this.input)[0].length,this.input[e]===`;`&&e++}},K.eat=function(e){return this.type===e&&(this.next(),!0)},K.isContextual=function(e){return this.type===H.name&&this.value===e&&!this.containsEsc},K.eatContextual=function(e){return this.isContextual(e)?(this.next(),!0):!1},K.catchStackOverflow=function(e){try{return e()}catch(e){if(e instanceof Error&&(/\bstack\b.*\b(exceeded|overflow)\b/i.test(e.message)||/\btoo much recursion\b/i.test(e.message)))this.raise(this.start,`Not enough stack space to parse input`);else throw e}},K.expectContextual=function(e){this.eatContextual(e)||this.unexpected()},K.canInsertSemicolon=function(){return this.type===H.eof||this.type===H.braceR||U.test(this.input.slice(this.lastTokEnd,this.start))},K.insertSemicolon=function(){if(this.canInsertSemicolon())return this.options.onInsertedSemicolon&&this.options.onInsertedSemicolon(this.lastTokEnd,this.lastTokEndLoc),!0},K.semicolon=function(){!this.eat(H.semi)&&!this.insertSemicolon()&&this.unexpected()},K.afterTrailingComma=function(e,t){if(this.type===e)return this.options.onTrailingComma&&this.options.onTrailingComma(this.lastTokStart,this.lastTokStartLoc),t||this.next(),!0},K.expect=function(e){this.eat(e)||this.unexpected()},K.unexpected=function(e){this.raise(e??this.start,`Unexpected token`)},DestructuringErrors=function(){this.shorthandAssign=this.trailingComma=this.parenthesizedAssign=this.parenthesizedBind=this.doubleProto=-1},K.checkPatternErrors=function(e,t){if(e){e.trailingComma>-1&&this.raiseRecoverable(e.trailingComma,`Comma is not permitted after the rest element`);var n=t?e.parenthesizedAssign:e.parenthesizedBind;n>-1&&this.raiseRecoverable(n,t?`Assigning to rvalue`:`Parenthesized pattern`)}},K.checkExpressionErrors=function(e,t){if(!e)return!1;var n=e.shorthandAssign,r=e.doubleProto;if(!t)return n>=0||r>=0;n>=0&&this.raise(n,`Shorthand property assignments are valid only in destructuring patterns`),r>=0&&this.raiseRecoverable(r,`Redefinition of __proto__ property`)},K.checkYieldAwaitInDefaultParams=function(){this.yieldPos&&(!this.awaitPos||this.yieldPos<this.awaitPos)&&this.raise(this.yieldPos,`Yield expression cannot be a default value`),this.awaitPos&&this.raise(this.awaitPos,`Await expression cannot be a default value`)},K.isSimpleAssignTarget=function(e){return e.type===`ParenthesizedExpression`?this.isSimpleAssignTarget(e.expression):e.type===`Identifier`||e.type===`MemberExpression`},q=Parser.prototype,q.parseTopLevel=function(e){var t=Object.create(null);for(e.body||=[];this.type!==H.eof;){var n=this.parseStatement(null,!0,t);e.body.push(n)}if(this.inModule)for(var r=0,i=Object.keys(this.undefinedExports);r<i.length;r+=1){var a=i[r];this.raiseRecoverable(this.undefinedExports[a].start,`Export '`+a+`' is not defined`)}return this.adaptDirectivePrologue(e.body),this.next(),e.sourceType=this.options.sourceType===`commonjs`?`script`:this.options.sourceType,this.finishNode(e,`Program`)},zp={kind:`loop`},Bp={kind:`switch`},q.isLet=function(e){if(this.options.ecmaVersion<6||!this.isContextual(`let`))return!1;W.lastIndex=this.pos;var t=W.exec(this.input),n=this.pos+t[0].length,r=this.fullCharCodeAt(n);if(r===91||r===92)return!0;if(e)return!1;if(r===123)return!0;if(isIdentifierStart(r)){var i=n;do n+=r<=65535?1:2;while(isIdentifierChar(r=this.fullCharCodeAt(n)));if(r===92)return!0;var a=this.input.slice(i,n);if(!ap.test(a))return!0}return!1},q.isAsyncFunction=function(){if(this.options.ecmaVersion<8||!this.isContextual(`async`))return!1;W.lastIndex=this.pos;var e=W.exec(this.input),t=this.pos+e[0].length,n;return!U.test(this.input.slice(this.pos,t))&&this.input.slice(t,t+8)===`function`&&(t+8===this.input.length||!(isIdentifierChar(n=this.fullCharCodeAt(t+8))||n===92))},q.isUsingKeyword=function(e,t){if(this.options.ecmaVersion<17||!this.isContextual(e?`await`:`using`))return!1;W.lastIndex=this.pos;var n=W.exec(this.input),r=this.pos+n[0].length;if(U.test(this.input.slice(this.pos,r)))return!1;if(e){var i=r+5,a;if(this.input.slice(r,i)!==`using`||i===this.input.length||isIdentifierChar(a=this.fullCharCodeAt(i))||a===92)return!1;W.lastIndex=i;var o=W.exec(this.input);if(r=i+o[0].length,o&&U.test(this.input.slice(i,r)))return!1}var s=this.fullCharCodeAt(r);if(!isIdentifierStart(s)&&s!==92)return!1;var c=r;do r+=s<=65535?1:2;while(isIdentifierChar(s=this.fullCharCodeAt(r)));if(s===92)return!0;var l=this.input.slice(c,r);if(ap.test(l))return!1;if(t&&!e&&l===`of`){W.lastIndex=r;var u=W.exec(this.input);if(r+=u[0].length,this.input.charCodeAt(r)!==61||(s=this.input.charCodeAt(r+1))===61||s===62)return!1}return!0},q.isAwaitUsing=function(e){return this.isUsingKeyword(!0,e)},q.isUsing=function(e){return this.isUsingKeyword(!1,e)},q.parseStatement=function(e,t,n){var r=this.type,i=this.startNode(),a;switch(this.isLet(e)&&(r=H._var,a=`let`),r){case H._break:case H._continue:return this.parseBreakContinueStatement(i,r.keyword);case H._debugger:return this.parseDebuggerStatement(i);case H._do:return this.parseDoStatement(i);case H._for:return this.parseForStatement(i);case H._function:return e&&(this.strict||e!==`if`&&e!==`label`)&&this.options.ecmaVersion>=6&&this.unexpected(),this.parseFunctionStatement(i,!1,!e);case H._class:return e&&this.unexpected(),this.parseClass(i,!0);case H._if:return this.parseIfStatement(i);case H._return:return this.parseReturnStatement(i);case H._switch:return this.parseSwitchStatement(i);case H._throw:return this.parseThrowStatement(i);case H._try:return this.parseTryStatement(i);case H._const:case H._var:return a||=this.value,e&&a!==`var`&&this.unexpected(),this.parseVarStatement(i,a);case H._while:return this.parseWhileStatement(i);case H._with:return this.parseWithStatement(i);case H.braceL:return this.parseBlock(!0,i);case H.semi:return this.parseEmptyStatement(i);case H._export:case H._import:if(this.options.ecmaVersion>10&&r===H._import){W.lastIndex=this.pos;var o=W.exec(this.input),s=this.pos+o[0].length,c=this.input.charCodeAt(s);if(c===40||c===46)return this.parseExpressionStatement(i,this.parseExpression())}return this.options.allowImportExportEverywhere||(t||this.raise(this.start,`'import' and 'export' may only appear at the top level`),this.inModule||this.raise(this.start,`'import' and 'export' may appear only with 'sourceType: module'`)),r===H._import?this.parseImport(i):this.parseExport(i,n);default:if(this.isAsyncFunction())return e&&this.unexpected(),this.next(),this.parseFunctionStatement(i,!0,!e);var l=this.isAwaitUsing(!1)?`await using`:this.isUsing(!1)?`using`:null;if(l)return this.allowUsing||this.raise(this.start,"Using declaration cannot appear in the top level when source type is `script` or in the bare case statement"),e&&this.raise(this.start,`Using declaration is not allowed in single-statement positions`),l===`await using`&&(this.canAwait||this.raise(this.start,`Await using cannot appear outside of async function`),this.next()),this.next(),this.parseVar(i,!1,l),this.semicolon(),this.finishNode(i,`VariableDeclaration`);var u=this.value,d=this.parseExpression();return r===H.name&&d.type===`Identifier`&&this.eat(H.colon)?this.parseLabeledStatement(i,u,d,e):this.parseExpressionStatement(i,d)}},q.parseBreakContinueStatement=function(e,t){var n=t===`break`;this.next(),this.eat(H.semi)||this.insertSemicolon()?e.label=null:this.type===H.name?(e.label=this.parseIdent(),this.semicolon()):this.unexpected();for(var r=0;r<this.labels.length;++r){var i=this.labels[r];if((e.label==null||i.name===e.label.name)&&(i.kind!=null&&(n||i.kind===`loop`)||e.label&&n))break}return r===this.labels.length&&this.raise(e.start,`Unsyntactic `+t),this.finishNode(e,n?`BreakStatement`:`ContinueStatement`)},q.parseDebuggerStatement=function(e){return this.next(),this.semicolon(),this.finishNode(e,`DebuggerStatement`)},q.parseDoStatement=function(e){return this.next(),this.labels.push(zp),e.body=this.parseStatement(`do`),this.labels.pop(),this.expect(H._while),e.test=this.parseParenExpression(),this.options.ecmaVersion>=6?this.eat(H.semi):this.semicolon(),this.finishNode(e,`DoWhileStatement`)},q.parseForStatement=function(e){this.next();var t=this.options.ecmaVersion>=9&&this.canAwait&&this.eatContextual(`await`)?this.lastTokStart:-1;if(this.labels.push(zp),this.enterScope(0),this.expect(H.parenL),this.type===H.semi)return t>-1&&this.unexpected(t),this.parseFor(e,null);var n=this.isLet();if(this.type===H._var||this.type===H._const||n){var r=this.startNode(),i=n?`let`:this.value;return this.next(),this.parseVar(r,!0,i),this.finishNode(r,`VariableDeclaration`),this.parseForAfterInit(e,r,t)}var a=this.isContextual(`let`),o=!1,s=this.isUsing(!0)?`using`:this.isAwaitUsing(!0)?`await using`:null;if(s){var c=this.startNode();return this.next(),s===`await using`&&(this.canAwait||this.raise(this.start,`Await using cannot appear outside of async function`),this.next()),this.parseVar(c,!0,s),this.finishNode(c,`VariableDeclaration`),this.parseForAfterInit(e,c,t)}var l=this.containsEsc,u=new DestructuringErrors,d=this.start,f=t>-1?this.parseExprSubscripts(u,`await`):this.parseExpression(!0,u);return this.type===H._in||(o=this.options.ecmaVersion>=6&&this.isContextual(`of`))?(t>-1?(this.type===H._in&&this.unexpected(t),e.await=!0):o&&this.options.ecmaVersion>=8&&(f.start===d&&!l&&f.type===`Identifier`&&f.name===`async`?this.unexpected():this.options.ecmaVersion>=9&&(e.await=!1)),a&&o&&this.raise(f.start,`The left-hand side of a for-of loop may not start with 'let'.`),this.toAssignable(f,!1,u),this.checkLValPattern(f),this.parseForIn(e,f)):(this.checkExpressionErrors(u,!0),t>-1&&this.unexpected(t),this.parseFor(e,f))},q.parseForAfterInit=function(e,t,n){return(this.type===H._in||this.options.ecmaVersion>=6&&this.isContextual(`of`))&&t.declarations.length===1?(this.type===H._in?((t.kind===`using`||t.kind===`await using`)&&!t.declarations[0].init&&this.raise(this.start,`Using declaration is not allowed in for-in loops`),this.options.ecmaVersion>=9&&n>-1&&this.unexpected(n)):this.options.ecmaVersion>=9&&(e.await=n>-1),this.parseForIn(e,t)):(n>-1&&this.unexpected(n),this.parseFor(e,t))},q.parseFunctionStatement=function(e,t,n){return this.next(),this.parseFunction(e,Hp|(n?0:Up),!1,t)},q.parseIfStatement=function(e){return this.next(),e.test=this.parseParenExpression(),e.consequent=this.parseStatement(`if`),e.alternate=this.eat(H._else)?this.parseStatement(`if`):null,this.finishNode(e,`IfStatement`)},q.parseReturnStatement=function(e){return this.allowReturn||this.raise(this.start,`'return' outside of function`),this.next(),this.eat(H.semi)||this.insertSemicolon()?e.argument=null:(e.argument=this.parseExpression(),this.semicolon()),this.finishNode(e,`ReturnStatement`)},q.parseSwitchStatement=function(e){this.next(),e.discriminant=this.parseParenExpression(),e.cases=[],this.expect(H.braceL),this.labels.push(Bp),this.enterScope(Ap);for(var t,n=!1;this.type!==H.braceR;)if(this.type===H._case||this.type===H._default){var r=this.type===H._case;t&&this.finishNode(t,`SwitchCase`),e.cases.push(t=this.startNode()),t.consequent=[],this.next(),r?t.test=this.parseExpression():(n&&this.raiseRecoverable(this.lastTokStart,`Multiple default clauses`),n=!0,t.test=null),this.expect(H.colon)}else t||this.unexpected(),t.consequent.push(this.parseStatement(null));return this.exitScope(),t&&this.finishNode(t,`SwitchCase`),this.next(),this.labels.pop(),this.finishNode(e,`SwitchStatement`)},q.parseThrowStatement=function(e){return this.next(),U.test(this.input.slice(this.lastTokEnd,this.start))&&this.raise(this.lastTokEnd,`Illegal newline after throw`),e.argument=this.parseExpression(),this.semicolon(),this.finishNode(e,`ThrowStatement`)},Vp=[],q.parseCatchClauseParam=function(){var e=this.parseBindingAtom(),t=e.type===`Identifier`;return this.enterScope(t?Tp:0),this.checkLValPattern(e,t?Ip:Pp),this.expect(H.parenR),e},q.parseTryStatement=function(e){if(this.next(),e.block=this.parseBlock(),e.handler=null,this.type===H._catch){var t=this.startNode();this.next(),this.eat(H.parenL)?t.param=this.parseCatchClauseParam():(this.options.ecmaVersion<10&&this.unexpected(),t.param=null,this.enterScope(0)),t.body=this.parseBlock(!1),this.exitScope(),e.handler=this.finishNode(t,`CatchClause`)}return e.finalizer=this.eat(H._finally)?this.parseBlock():null,!e.handler&&!e.finalizer&&this.raise(e.start,`Missing catch or finally clause`),this.finishNode(e,`TryStatement`)},q.parseVarStatement=function(e,t,n){return this.next(),this.parseVar(e,!1,t,n),this.semicolon(),this.finishNode(e,`VariableDeclaration`)},q.parseWhileStatement=function(e){return this.next(),e.test=this.parseParenExpression(),this.labels.push(zp),e.body=this.parseStatement(`while`),this.labels.pop(),this.finishNode(e,`WhileStatement`)},q.parseWithStatement=function(e){return this.strict&&this.raise(this.start,`'with' in strict mode`),this.next(),e.object=this.parseParenExpression(),e.body=this.parseStatement(`with`),this.finishNode(e,`WithStatement`)},q.parseEmptyStatement=function(e){return this.next(),this.finishNode(e,`EmptyStatement`)},q.parseLabeledStatement=function(e,t,n,r){for(var i=0,a=this.labels;i<a.length;i+=1)a[i].name===t&&this.raise(n.start,`Label '`+t+`' is already declared`);for(var o=this.type.isLoop?`loop`:this.type===H._switch?`switch`:null,s=this.labels.length-1;s>=0;s--){var c=this.labels[s];if(c.statementStart===e.start)c.statementStart=this.start,c.kind=o;else break}return this.labels.push({name:t,kind:o,statementStart:this.start}),e.body=this.parseStatement(r?r.indexOf(`label`)===-1?r+`label`:r:`label`),this.labels.pop(),e.label=n,this.finishNode(e,`LabeledStatement`)},q.parseExpressionStatement=function(e,t){return e.expression=t,this.semicolon(),this.finishNode(e,`ExpressionStatement`)},q.parseBlock=function(e,t,n){for(e===void 0&&(e=!0),t===void 0&&(t=this.startNode()),t.body=[],this.expect(H.braceL),e&&this.enterScope(0);this.type!==H.braceR;){var r=this.parseStatement(null);t.body.push(r)}return n&&(this.strict=!1),this.next(),e&&this.exitScope(),this.finishNode(t,`BlockStatement`)},q.parseFor=function(e,t){return e.init=t,this.expect(H.semi),e.test=this.type===H.semi?null:this.parseExpression(),this.expect(H.semi),e.update=this.type===H.parenR?null:this.parseExpression(),this.expect(H.parenR),e.body=this.parseStatement(`for`),this.exitScope(),this.labels.pop(),this.finishNode(e,`ForStatement`)},q.parseForIn=function(e,t){var n=this.type===H._in;return this.next(),t.type===`VariableDeclaration`&&t.declarations[0].init!=null&&(!n||this.options.ecmaVersion<8||this.strict||t.kind!==`var`||t.declarations[0].id.type!==`Identifier`)&&this.raise(t.start,(n?`for-in`:`for-of`)+` loop variable declaration may not have an initializer`),e.left=t,e.right=n?this.parseExpression():this.parseMaybeAssign(),this.expect(H.parenR),e.body=this.parseStatement(`for`),this.exitScope(),this.labels.pop(),this.finishNode(e,n?`ForInStatement`:`ForOfStatement`)},q.parseVar=function(e,t,n,r){for(e.declarations=[],e.kind=n;;){var i=this.startNode();if(this.parseVarId(i,n),this.eat(H.eq)?i.init=this.parseMaybeAssign(t):!r&&n===`const`&&!(this.type===H._in||this.options.ecmaVersion>=6&&this.isContextual(`of`))?this.unexpected():!r&&(n===`using`||n===`await using`)&&this.options.ecmaVersion>=17&&this.type!==H._in&&!this.isContextual(`of`)?this.raise(this.lastTokEnd,`Missing initializer in `+n+` declaration`):!r&&i.id.type!==`Identifier`&&(!t||this.type!==H._in&&!this.isContextual(`of`))?this.raise(this.lastTokEnd,`Complex binding patterns require an initialization value`):i.init=null,e.declarations.push(this.finishNode(i,`VariableDeclarator`)),!this.eat(H.comma))break}return e},q.parseVarId=function(e,t){e.id=t===`using`||t===`await using`?this.parseIdent():this.parseBindingAtom(),this.checkLValPattern(e.id,t===`var`?Np:Pp,!1)},Hp=1,Up=2,Wp=4,q.parseFunction=function(e,t,n,r,i){this.initFunction(e),(this.options.ecmaVersion>=9||this.options.ecmaVersion>=6&&!r)&&(this.type===H.star&&t&Up&&this.unexpected(),e.generator=this.eat(H.star)),this.options.ecmaVersion>=8&&(e.async=!!r),t&Hp&&(e.id=t&Wp&&this.type!==H.name?null:this.parseIdent(),e.id&&!(t&Up)&&this.checkLValSimple(e.id,this.strict||e.generator||e.async?this.treatFunctionsAsVar?Np:Pp:Fp));var a=this.yieldPos,o=this.awaitPos,s=this.awaitIdentPos;return this.yieldPos=0,this.awaitPos=0,this.awaitIdentPos=0,this.enterScope(functionFlags(e.async,e.generator)),t&Hp||(e.id=this.type===H.name?this.parseIdent():null),this.parseFunctionParams(e),this.parseFunctionBody(e,n,!1,i),this.yieldPos=a,this.awaitPos=o,this.awaitIdentPos=s,this.finishNode(e,t&Hp?`FunctionDeclaration`:`FunctionExpression`)},q.parseFunctionParams=function(e){this.expect(H.parenL),e.params=this.parseBindingList(H.parenR,!1,this.options.ecmaVersion>=8),this.checkYieldAwaitInDefaultParams()},q.parseClass=function(e,t){this.next();var n=this.strict;this.strict=!0,this.parseClassId(e,t),this.parseClassSuper(e);var r=this.enterClassBody(),i=this.startNode(),a=!1;for(i.body=[],this.expect(H.braceL);this.type!==H.braceR;){var o=this.parseClassElement(e.superClass!==null);o&&(i.body.push(o),o.type===`MethodDefinition`&&o.kind===`constructor`?(a&&this.raiseRecoverable(o.start,`Duplicate constructor in the same class`),a=!0):o.key&&o.key.type===`PrivateIdentifier`&&isPrivateNameConflicted(r,o)&&this.raiseRecoverable(o.key.start,`Identifier '#`+o.key.name+`' has already been declared`))}return this.strict=n,this.next(),e.body=this.finishNode(i,`ClassBody`),this.exitClassBody(),this.finishNode(e,t?`ClassDeclaration`:`ClassExpression`)},q.parseClassElement=function(e){if(this.eat(H.semi))return null;var t=this.options.ecmaVersion,n=this.startNode(),r=``,i=!1,a=!1,o=`method`,s=!1;if(this.eatContextual(`static`)){if(t>=13&&this.eat(H.braceL))return this.parseClassStaticBlock(n),n;this.isClassElementNameStart()||this.type===H.star?s=!0:r=`static`}if(n.static=s,!r&&t>=8&&this.eatContextual(`async`)&&((this.isClassElementNameStart()||this.type===H.star)&&!this.canInsertSemicolon()?a=!0:r=`async`),!r&&(t>=9||!a)&&this.eat(H.star)&&(i=!0),!r&&!a&&!i){var c=this.value;(this.eatContextual(`get`)||this.eatContextual(`set`))&&(this.isClassElementNameStart()?o=c:r=c)}if(r?(n.computed=!1,n.key=this.startNodeAt(this.lastTokStart,this.lastTokStartLoc),n.key.name=r,this.finishNode(n.key,`Identifier`)):this.parseClassElementName(n),t<13||this.type===H.parenL||o!==`method`||i||a){var l=!n.static&&checkKeyName(n,`constructor`),u=l&&e;l&&o!==`method`&&this.raise(n.key.start,`Constructor can't have get/set modifier`),n.kind=l?`constructor`:o,this.parseClassMethod(n,i,a,u)}else this.parseClassField(n);return n},q.isClassElementNameStart=function(){return this.type===H.name||this.type===H.privateId||this.type===H.num||this.type===H.string||this.type===H.bracketL||this.type.keyword},q.parseClassElementName=function(e){this.type===H.privateId?(this.value===`constructor`&&this.raise(this.start,`Classes can't have an element named '#constructor'`),e.computed=!1,e.key=this.parsePrivateIdent()):this.parsePropertyName(e)},q.parseClassMethod=function(e,t,n,r){var i=e.key;e.kind===`constructor`?(t&&this.raise(i.start,`Constructor can't be a generator`),n&&this.raise(i.start,`Constructor can't be an async method`)):e.static&&checkKeyName(e,`prototype`)&&this.raise(i.start,`Classes may not have a static property named prototype`);var a=e.value=this.parseMethod(t,n,r);return e.kind===`get`&&a.params.length!==0&&this.raiseRecoverable(a.start,`getter should have no params`),e.kind===`set`&&a.params.length!==1&&this.raiseRecoverable(a.start,`setter should have exactly one param`),e.kind===`set`&&a.params[0].type===`RestElement`&&this.raiseRecoverable(a.params[0].start,`Setter cannot use rest params`),this.finishNode(e,`MethodDefinition`)},q.parseClassField=function(e){return checkKeyName(e,`constructor`)?this.raise(e.key.start,`Classes can't have a field named 'constructor'`):e.static&&checkKeyName(e,`prototype`)&&this.raise(e.key.start,`Classes can't have a static field named 'prototype'`),this.eat(H.eq)?(this.enterScope(kp|Ep),e.value=this.parseMaybeAssign(),this.exitScope()):e.value=null,this.semicolon(),this.finishNode(e,`PropertyDefinition`)},q.parseClassStaticBlock=function(e){e.body=[];var t=this.labels;for(this.labels=[],this.enterScope(Op|Ep);this.type!==H.braceR;){var n=this.parseStatement(null);e.body.push(n)}return this.next(),this.exitScope(),this.labels=t,this.finishNode(e,`StaticBlock`)},q.parseClassId=function(e,t){this.type===H.name?(e.id=this.parseIdent(),t&&this.checkLValSimple(e.id,Pp,!1)):(t===!0&&this.unexpected(),e.id=null)},q.parseClassSuper=function(e){e.superClass=this.eat(H._extends)?this.parseExprSubscripts(null,!1):null},q.enterClassBody=function(){var e={declared:Object.create(null),used:[]};return this.privateNameStack.push(e),e.declared},q.exitClassBody=function(){var e=this.privateNameStack.pop(),t=e.declared,n=e.used;if(this.options.checkPrivateFields)for(var r=this.privateNameStack.length,i=r===0?null:this.privateNameStack[r-1],a=0;a<n.length;++a){var o=n[a];mp(t,o.name)||(i?i.used.push(o):this.raiseRecoverable(o.start,`Private field '#`+o.name+`' must be declared in an enclosing class`))}},q.parseExportAllDeclaration=function(e,t){return this.options.ecmaVersion>=11&&(this.eatContextual(`as`)?(e.exported=this.parseModuleExportName(),this.checkExport(t,e.exported,this.lastTokStart)):e.exported=null),this.expectContextual(`from`),this.type!==H.string&&this.unexpected(),e.source=this.parseExprAtom(),this.options.ecmaVersion>=16&&(e.attributes=this.parseWithClause()),this.semicolon(),this.finishNode(e,`ExportAllDeclaration`)},q.parseExport=function(e,t){if(this.next(),this.eat(H.star))return this.parseExportAllDeclaration(e,t);if(this.eat(H._default))return this.checkExport(t,`default`,this.lastTokStart),e.declaration=this.parseExportDefaultDeclaration(),this.finishNode(e,`ExportDefaultDeclaration`);if(this.shouldParseExportStatement())e.declaration=this.parseExportDeclaration(e),e.declaration.type===`VariableDeclaration`?this.checkVariableExport(t,e.declaration.declarations):this.checkExport(t,e.declaration.id,e.declaration.id.start),e.specifiers=[],e.source=null,this.options.ecmaVersion>=16&&(e.attributes=[]);else{if(e.declaration=null,e.specifiers=this.parseExportSpecifiers(t),this.eatContextual(`from`))this.type!==H.string&&this.unexpected(),e.source=this.parseExprAtom(),this.options.ecmaVersion>=16&&(e.attributes=this.parseWithClause());else{for(var n=0,r=e.specifiers;n<r.length;n+=1){var i=r[n];this.checkUnreserved(i.local),this.checkLocalExport(i.local),i.local.type===`Literal`&&this.raise(i.local.start,"A string literal cannot be used as an exported binding without `from`.")}e.source=null,this.options.ecmaVersion>=16&&(e.attributes=[])}this.semicolon()}return this.finishNode(e,`ExportNamedDeclaration`)},q.parseExportDeclaration=function(e){return this.parseStatement(null)},q.parseExportDefaultDeclaration=function(){var e;if(this.type===H._function||(e=this.isAsyncFunction())){var t=this.startNode();return this.next(),e&&this.next(),this.parseFunction(t,Hp|Wp,!1,e)}if(this.type===H._class){var n=this.startNode();return this.parseClass(n,`nullableID`)}var r=this.parseMaybeAssign();return this.semicolon(),r},q.checkExport=function(e,t,n){e&&(typeof t!=`string`&&(t=t.type===`Identifier`?t.name:t.value),mp(e,t)&&this.raiseRecoverable(n,`Duplicate export '`+t+`'`),e[t]=!0)},q.checkPatternExport=function(e,t){var n=t.type;if(n===`Identifier`)this.checkExport(e,t,t.start);else if(n===`ObjectPattern`)for(var r=0,i=t.properties;r<i.length;r+=1){var a=i[r];this.checkPatternExport(e,a)}else if(n===`ArrayPattern`)for(var o=0,s=t.elements;o<s.length;o+=1){var c=s[o];c&&this.checkPatternExport(e,c)}else n===`Property`?this.checkPatternExport(e,t.value):n===`AssignmentPattern`?this.checkPatternExport(e,t.left):n===`RestElement`&&this.checkPatternExport(e,t.argument)},q.checkVariableExport=function(e,t){if(e)for(var n=0,r=t;n<r.length;n+=1){var i=r[n];this.checkPatternExport(e,i.id)}},q.shouldParseExportStatement=function(){return this.type.keyword===`var`||this.type.keyword===`const`||this.type.keyword===`class`||this.type.keyword===`function`||this.isLet()||this.isAsyncFunction()},q.parseExportSpecifier=function(e){var t=this.startNode();return t.local=this.parseModuleExportName(),t.exported=this.eatContextual(`as`)?this.parseModuleExportName():t.local,this.checkExport(e,t.exported,t.exported.start),this.finishNode(t,`ExportSpecifier`)},q.parseExportSpecifiers=function(e){var t=[],n=!0;for(this.expect(H.braceL);!this.eat(H.braceR);){if(n)n=!1;else if(this.expect(H.comma),this.afterTrailingComma(H.braceR))break;t.push(this.parseExportSpecifier(e))}return t},q.parseImport=function(e){return this.next(),this.type===H.string?(e.specifiers=Vp,e.source=this.parseExprAtom()):(e.specifiers=this.parseImportSpecifiers(),this.expectContextual(`from`),e.source=this.type===H.string?this.parseExprAtom():this.unexpected()),this.options.ecmaVersion>=16&&(e.attributes=this.parseWithClause()),this.semicolon(),this.finishNode(e,`ImportDeclaration`)},q.parseImportSpecifier=function(){var e=this.startNode();return e.imported=this.parseModuleExportName(),this.eatContextual(`as`)?e.local=this.parseIdent():(this.checkUnreserved(e.imported),e.local=e.imported),this.checkLValSimple(e.local,Pp),this.finishNode(e,`ImportSpecifier`)},q.parseImportDefaultSpecifier=function(){var e=this.startNode();return e.local=this.parseIdent(),this.checkLValSimple(e.local,Pp),this.finishNode(e,`ImportDefaultSpecifier`)},q.parseImportNamespaceSpecifier=function(){var e=this.startNode();return this.next(),this.expectContextual(`as`),e.local=this.parseIdent(),this.checkLValSimple(e.local,Pp),this.finishNode(e,`ImportNamespaceSpecifier`)},q.parseImportSpecifiers=function(){var e=[],t=!0;if(this.type===H.name&&(e.push(this.parseImportDefaultSpecifier()),!this.eat(H.comma)))return e;if(this.type===H.star)return e.push(this.parseImportNamespaceSpecifier()),e;for(this.expect(H.braceL);!this.eat(H.braceR);){if(t)t=!1;else if(this.expect(H.comma),this.afterTrailingComma(H.braceR))break;e.push(this.parseImportSpecifier())}return e},q.parseWithClause=function(){var e=[];if(!this.eat(H._with))return e;this.expect(H.braceL);for(var t={},n=!0;!this.eat(H.braceR);){if(n)n=!1;else if(this.expect(H.comma),this.afterTrailingComma(H.braceR))break;var r=this.parseImportAttribute(),i=r.key.type===`Identifier`?r.key.name:r.key.value;mp(t,i)&&this.raiseRecoverable(r.key.start,`Duplicate attribute key '`+i+`'`),t[i]=!0,e.push(r)}return e},q.parseImportAttribute=function(){var e=this.startNode();return e.key=this.type===H.string?this.parseExprAtom():this.parseIdent(this.options.allowReserved!==`never`),this.expect(H.colon),this.type!==H.string&&this.unexpected(),e.value=this.parseExprAtom(),this.finishNode(e,`ImportAttribute`)},q.parseModuleExportName=function(){if(this.options.ecmaVersion>=13&&this.type===H.string){var e=this.parseLiteral(this.value);return _p.test(e.value)&&this.raise(e.start,`An export name cannot include a lone surrogate.`),e}return this.parseIdent(!0)},q.adaptDirectivePrologue=function(e){for(var t=0;t<e.length&&this.isDirectiveCandidate(e[t]);++t)e[t].directive=e[t].expression.raw.slice(1,-1)},q.isDirectiveCandidate=function(e){return this.options.ecmaVersion>=5&&e.type===`ExpressionStatement`&&e.expression.type===`Literal`&&typeof e.expression.value==`string`&&(this.input[e.start]===`"`||this.input[e.start]===`'`)},J=Parser.prototype,J.toAssignable=function(e,t,n){if(this.options.ecmaVersion>=6&&e)switch(e.type){case`Identifier`:this.inAsync&&e.name===`await`&&this.raise(e.start,`Cannot use 'await' as identifier inside an async function`);break;case`ObjectPattern`:case`ArrayPattern`:case`AssignmentPattern`:case`RestElement`:break;case`ObjectExpression`:e.type=`ObjectPattern`,n&&this.checkPatternErrors(n,!0);for(var r=0,i=e.properties;r<i.length;r+=1){var a=i[r];this.toAssignable(a,t),a.type===`RestElement`&&(a.argument.type===`ArrayPattern`||a.argument.type===`ObjectPattern`)&&this.raise(a.argument.start,`Unexpected token`)}break;case`Property`:e.kind!==`init`&&this.raise(e.key.start,`Object pattern can't contain getter or setter`),this.toAssignable(e.value,t);break;case`ArrayExpression`:e.type=`ArrayPattern`,n&&this.checkPatternErrors(n,!0),this.toAssignableList(e.elements,t);break;case`SpreadElement`:e.type=`RestElement`,this.toAssignable(e.argument,t),e.argument.type===`AssignmentPattern`&&this.raise(e.argument.start,`Rest elements cannot have a default value`);break;case`AssignmentExpression`:e.operator!==`=`&&this.raise(e.left.end,`Only '=' operator can be used for specifying default value.`),e.type=`AssignmentPattern`,delete e.operator,this.toAssignable(e.left,t);break;case`ParenthesizedExpression`:this.toAssignable(e.expression,t,n);break;case`ChainExpression`:this.raiseRecoverable(e.start,`Optional chaining cannot appear in left-hand side`);break;case`MemberExpression`:if(!t)break;default:this.raise(e.start,`Assigning to rvalue`)}else n&&this.checkPatternErrors(n,!0);return e},J.toAssignableList=function(e,t){for(var n=e.length,r=0;r<n;r++){var i=e[r];i&&this.toAssignable(i,t)}if(n){var a=e[n-1];this.options.ecmaVersion===6&&t&&a&&a.type===`RestElement`&&a.argument.type!==`Identifier`&&this.unexpected(a.argument.start)}return e},J.parseSpread=function(e){var t=this.startNode();return this.next(),t.argument=this.parseMaybeAssign(!1,e),this.finishNode(t,`SpreadElement`)},J.parseRestBinding=function(){var e=this.startNode();return this.next(),this.options.ecmaVersion===6&&this.type!==H.name&&this.unexpected(),e.argument=this.parseBindingAtom(),this.finishNode(e,`RestElement`)},J.parseBindingAtom=function(){if(this.options.ecmaVersion>=6)switch(this.type){case H.bracketL:var e=this.startNode();return this.next(),e.elements=this.parseBindingList(H.bracketR,!0,!0),this.finishNode(e,`ArrayPattern`);case H.braceL:return this.parseObj(!0)}return this.parseIdent()},J.parseBindingList=function(e,t,n,r){for(var i=[],a=!0;!this.eat(e);)if(a?a=!1:this.expect(H.comma),t&&this.type===H.comma)i.push(null);else if(n&&this.afterTrailingComma(e))break;else if(this.type===H.ellipsis){var o=this.parseRestBinding();this.parseBindingListItem(o),i.push(o),this.type===H.comma&&this.raiseRecoverable(this.start,`Comma is not permitted after the rest element`),this.expect(e);break}else i.push(this.parseAssignableListItem(r));return i},J.parseAssignableListItem=function(e){var t=this.parseMaybeDefault(this.start,this.startLoc);return this.parseBindingListItem(t),t},J.parseBindingListItem=function(e){return e},J.parseMaybeDefault=function(e,t,n){if(n||=this.parseBindingAtom(),this.options.ecmaVersion<6||!this.eat(H.eq))return n;var r=this.startNodeAt(e,t);return r.left=n,r.right=this.parseMaybeAssign(),this.finishNode(r,`AssignmentPattern`)},J.checkLValSimple=function(e,t,n){t===void 0&&(t=Mp);var r=t!==Mp;switch(e.type){case`Identifier`:this.strict&&this.reservedWordsStrictBind.test(e.name)&&this.raiseRecoverable(e.start,(r?`Binding `:`Assigning to `)+e.name+` in strict mode`),r&&(t===Pp&&e.name===`let`&&this.raiseRecoverable(e.start,`let is disallowed as a lexically bound name`),n&&(mp(n,e.name)&&this.raiseRecoverable(e.start,`Argument name clash`),n[e.name]=!0),t!==Lp&&this.declareName(e.name,t,e.start));break;case`ChainExpression`:this.raiseRecoverable(e.start,`Optional chaining cannot appear in left-hand side`);break;case`MemberExpression`:r&&this.raiseRecoverable(e.start,`Binding member expression`);break;case`ParenthesizedExpression`:return r&&this.raiseRecoverable(e.start,`Binding parenthesized expression`),this.checkLValSimple(e.expression,t,n);default:this.raise(e.start,(r?`Binding`:`Assigning to`)+` rvalue`)}},J.checkLValPattern=function(e,t,n){switch(t===void 0&&(t=Mp),e.type){case`ObjectPattern`:for(var r=0,i=e.properties;r<i.length;r+=1){var a=i[r];this.checkLValInnerPattern(a,t,n)}break;case`ArrayPattern`:for(var o=0,s=e.elements;o<s.length;o+=1){var c=s[o];c&&this.checkLValInnerPattern(c,t,n)}break;default:this.checkLValSimple(e,t,n)}},J.checkLValInnerPattern=function(e,t,n){switch(t===void 0&&(t=Mp),e.type){case`Property`:this.checkLValInnerPattern(e.value,t,n);break;case`AssignmentPattern`:this.checkLValPattern(e.left,t,n);break;case`RestElement`:this.checkLValPattern(e.argument,t,n);break;default:this.checkLValPattern(e,t,n)}},TokContext=function(e,t,n,r,i){this.token=e,this.isExpr=!!t,this.preserveSpace=!!n,this.override=r,this.generator=!!i},Y={b_stat:new TokContext(`{`,!1),b_expr:new TokContext(`{`,!0),b_tmpl:new TokContext("${",!1),p_stat:new TokContext(`(`,!1),p_expr:new TokContext(`(`,!0),q_tmpl:new TokContext("`",!0,!0,function(e){return e.tryReadTemplateToken()}),f_stat:new TokContext(`function`,!1),f_expr:new TokContext(`function`,!0),f_expr_gen:new TokContext(`function`,!0,!1,null,!0),f_gen:new TokContext(`function`,!1,!1,null,!0)},Gp=Parser.prototype,Gp.initialContext=function(){return[Y.b_stat]},Gp.curContext=function(){return this.context[this.context.length-1]},Gp.braceIsBlock=function(e){var t=this.curContext();return t===Y.f_expr||t===Y.f_stat?!0:e===H.colon&&(t===Y.b_stat||t===Y.b_expr)?!t.isExpr:e===H._return||e===H.name&&this.exprAllowed?U.test(this.input.slice(this.lastTokEnd,this.start)):e===H._else||e===H.semi||e===H.eof||e===H.parenR||e===H.arrow?!0:e===H.braceL?t===Y.b_stat:e===H._var||e===H._const||e===H.name?!1:!this.exprAllowed},Gp.inGeneratorContext=function(){for(var e=this.context.length-1;e>=1;e--){var t=this.context[e];if(t.token===`function`)return t.generator}return!1},Gp.updateContext=function(e){var t,n=this.type;n.keyword&&e===H.dot?this.exprAllowed=!1:(t=n.updateContext)?t.call(this,e):this.exprAllowed=n.beforeExpr},Gp.overrideContext=function(e){this.curContext()!==e&&(this.context[this.context.length-1]=e)},H.parenR.updateContext=H.braceR.updateContext=function(){if(this.context.length===1){this.exprAllowed=!0;return}var e=this.context.pop();e===Y.b_stat&&this.curContext().token===`function`&&(e=this.context.pop()),this.exprAllowed=!e.isExpr},H.braceL.updateContext=function(e){this.context.push(this.braceIsBlock(e)?Y.b_stat:Y.b_expr),this.exprAllowed=!0},H.dollarBraceL.updateContext=function(){this.context.push(Y.b_tmpl),this.exprAllowed=!0},H.parenL.updateContext=function(e){var t=e===H._if||e===H._for||e===H._with||e===H._while;this.context.push(t?Y.p_stat:Y.p_expr),this.exprAllowed=!0},H.incDec.updateContext=function(){},H._function.updateContext=H._class.updateContext=function(e){e.beforeExpr&&e!==H._else&&(e!==H.semi||this.curContext()===Y.p_stat)&&!(e===H._return&&U.test(this.input.slice(this.lastTokEnd,this.start)))&&(e!==H.colon&&e!==H.braceL||this.curContext()!==Y.b_stat)?this.context.push(Y.f_expr):this.context.push(Y.f_stat),this.exprAllowed=!1},H.colon.updateContext=function(){this.curContext().token===`function`&&this.context.pop(),this.exprAllowed=!0},H.backQuote.updateContext=function(){this.curContext()===Y.q_tmpl?this.context.pop():this.context.push(Y.q_tmpl),this.exprAllowed=!1},H.star.updateContext=function(e){if(e===H._function){var t=this.context.length-1;this.context[t]===Y.f_expr?this.context[t]=Y.f_expr_gen:this.context[t]=Y.f_gen}this.exprAllowed=!0},H.name.updateContext=function(e){var t=!1;this.options.ecmaVersion>=6&&e!==H.dot&&(this.value===`of`&&!this.exprAllowed||this.value===`yield`&&this.inGeneratorContext())&&(t=!0),this.exprAllowed=t},X=Parser.prototype,X.checkPropClash=function(e,t,n){if(!(this.options.ecmaVersion>=9&&e.type===`SpreadElement`)&&!(this.options.ecmaVersion>=6&&(e.computed||e.method||e.shorthand))){var r=e.key,i;switch(r.type){case`Identifier`:i=r.name;break;case`Literal`:i=String(r.value);break;default:return}var a=e.kind;if(this.options.ecmaVersion>=6){i===`__proto__`&&a===`init`&&(t.proto&&(n?n.doubleProto<0&&(n.doubleProto=r.start):this.raiseRecoverable(r.start,`Redefinition of __proto__ property`)),t.proto=!0);return}i=`$`+i;var o=t[i];o?(a===`init`?this.strict&&o.init||o.get||o.set:o.init||o[a])&&this.raiseRecoverable(r.start,`Redefinition of property`):o=t[i]={init:!1,get:!1,set:!1},o[a]=!0}},X.parseExpression=function(e,t){var n=this;return this.catchStackOverflow(function(){var r=n.start,i=n.startLoc,a=n.parseMaybeAssign(e,t);if(n.type===H.comma){var o=n.startNodeAt(r,i);for(o.expressions=[a];n.eat(H.comma);)o.expressions.push(n.parseMaybeAssign(e,t));return n.finishNode(o,`SequenceExpression`)}return a})},X.parseMaybeAssign=function(e,t,n){if(this.isContextual(`yield`)){if(this.inGenerator)return this.parseYield(e);this.exprAllowed=!1}var r=!1,i=-1,a=-1,o=-1;t?(i=t.parenthesizedAssign,a=t.trailingComma,o=t.doubleProto,t.parenthesizedAssign=t.trailingComma=-1):(t=new DestructuringErrors,r=!0);var s=this.start,c=this.startLoc;(this.type===H.parenL||this.type===H.name)&&(this.potentialArrowAt=this.start,this.potentialArrowInForAwait=e===`await`);var l=this.parseMaybeConditional(e,t);if(n&&(l=n.call(this,l,s,c)),this.type.isAssign){var u=this.startNodeAt(s,c);return u.operator=this.value,this.type===H.eq&&(l=this.toAssignable(l,!1,t)),r||(t.parenthesizedAssign=t.trailingComma=-1,t.shorthandAssign>=l.start&&(t.shorthandAssign=-1),t.doubleProto>=l.start&&(t.doubleProto=-1)),this.type===H.eq?this.checkLValPattern(l):this.checkLValSimple(l),u.left=l,this.next(),u.right=this.parseMaybeAssign(e),o>-1&&(t.doubleProto=o),this.finishNode(u,`AssignmentExpression`)}return r&&this.checkExpressionErrors(t,!0),i>-1&&(t.parenthesizedAssign=i),a>-1&&(t.trailingComma=a),l},X.parseMaybeConditional=function(e,t){var n=this.start,r=this.startLoc,i=this.parseExprOps(e,t);if(this.checkExpressionErrors(t))return i;if((i.type!==`ArrowFunctionExpression`||i.start!==n)&&this.eat(H.question)){var a=this.startNodeAt(n,r);return a.test=i,a.consequent=this.parseMaybeAssign(),this.expect(H.colon),a.alternate=this.parseMaybeAssign(e),this.finishNode(a,`ConditionalExpression`)}return i},X.parseExprOps=function(e,t){var n=this.start,r=this.startLoc,i=this.parseMaybeUnary(t,!1,!1,e);return this.checkExpressionErrors(t)||i.start===n&&i.type===`ArrowFunctionExpression`?i:this.parseExprOp(i,n,r,-1,e)},X.parseExprOp=function(e,t,n,r,i){var a=this.type.binop;if(a!=null&&(!i||this.type!==H._in)&&a>r){var o=this.type===H.logicalOR||this.type===H.logicalAND,s=this.type===H.coalesce;s&&(a=H.logicalAND.binop);var c=this.value;this.next();var l=this.start,u=this.startLoc,d=this.parseExprOp(this.parseMaybeUnary(null,!1,!1,i),l,u,a,i),f=this.buildBinary(t,n,e,d,c,o||s);return(o&&this.type===H.coalesce||s&&(this.type===H.logicalOR||this.type===H.logicalAND))&&this.raiseRecoverable(this.start,`Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses`),this.parseExprOp(f,t,n,r,i)}return e},X.buildBinary=function(e,t,n,r,i,a){r.type===`PrivateIdentifier`&&this.raise(r.start,`Private identifier can only be left side of binary expression`);var o=this.startNodeAt(e,t);return o.left=n,o.operator=i,o.right=r,this.finishNode(o,a?`LogicalExpression`:`BinaryExpression`)},X.parseMaybeUnary=function(e,t,n,r){var i=this.start,a=this.startLoc,o;if(this.isContextual(`await`)&&this.canAwait)o=this.parseAwait(r),t=!0;else if(this.type.prefix){var s=this.startNode(),c=this.type===H.incDec;s.operator=this.value,s.prefix=!0,this.next(),s.argument=this.parseMaybeUnary(null,!0,c,r),this.checkExpressionErrors(e,!0),c?this.checkLValSimple(s.argument):this.strict&&s.operator===`delete`&&isLocalVariableAccess(s.argument)?this.raiseRecoverable(s.start,`Deleting local variable in strict mode`):s.operator===`delete`&&isPrivateFieldAccess(s.argument)?this.raiseRecoverable(s.start,`Private fields can not be deleted`):t=!0,o=this.finishNode(s,c?`UpdateExpression`:`UnaryExpression`)}else if(!t&&this.type===H.privateId)(r||this.privateNameStack.length===0)&&this.options.checkPrivateFields&&this.unexpected(),o=this.parsePrivateIdent(),this.type!==H._in&&this.unexpected();else{if(o=this.parseExprSubscripts(e,r),this.checkExpressionErrors(e))return o;for(;this.type.postfix&&!this.canInsertSemicolon();){var l=this.startNodeAt(i,a);l.operator=this.value,l.prefix=!1,l.argument=o,this.checkLValSimple(o),this.next(),o=this.finishNode(l,`UpdateExpression`)}}if(!n&&(o.type!==`ArrowFunctionExpression`||o.start!==i)&&this.eat(H.starstar)){if(t)this.unexpected(this.lastTokStart);else return this.buildBinary(i,a,o,this.parseMaybeUnary(null,!1,!1,r),`**`,!1)}else return o},X.parseExprSubscripts=function(e,t){var n=this.start,r=this.startLoc,i=-1,a=-1;e&&(i=e.doubleProto,a=e.shorthandAssign,e.doubleProto=e.shorthandAssign=-1);var o=this.parseExprAtom(e,t);if(o.type===`ArrowFunctionExpression`&&this.input.slice(this.lastTokStart,this.lastTokEnd)!==`)`)return o;var s=this.parseSubscripts(o,n,r,!1,t);return e&&(s.end>o.end&&(this.checkExpressionErrors(e,!0),e.parenthesizedAssign>=s.start&&(e.parenthesizedAssign=-1),e.parenthesizedBind>=s.start&&(e.parenthesizedBind=-1),e.trailingComma>=s.start&&(e.trailingComma=-1)),i>-1&&(e.doubleProto=i),a>-1&&(e.shorthandAssign=a)),s},X.parseSubscripts=function(e,t,n,r,i){for(var a=this.options.ecmaVersion>=8&&e.type===`Identifier`&&e.name===`async`&&this.lastTokEnd===e.end&&!this.canInsertSemicolon()&&e.end-e.start===5&&this.potentialArrowAt===e.start,o=!1;;){var s=this.parseSubscript(e,t,n,r,a,o,i);if(s.optional&&(o=!0),s.end===e.end||s.type===`ArrowFunctionExpression`){if(o){var c=this.startNodeAt(t,n);c.expression=s,s=this.finishNode(c,`ChainExpression`)}return s}e=s,a=!1}},X.shouldParseAsyncArrow=function(){return!this.canInsertSemicolon()&&this.eat(H.arrow)},X.parseSubscriptAsyncArrow=function(e,t,n,r){return this.parseArrowExpression(this.startNodeAt(e,t),n,!0,r)},X.parseSubscript=function(e,t,n,r,i,a,o){var s=this.options.ecmaVersion>=11,c=s&&this.eat(H.questionDot);r&&c&&this.raise(this.lastTokStart,`Optional chaining cannot appear in the callee of new expressions`);var l=this.eat(H.bracketL);if(l||c&&this.type!==H.parenL&&this.type!==H.backQuote||this.eat(H.dot)){var u=this.startNodeAt(t,n);u.object=e,l?(u.property=this.parseExpression(),this.expect(H.bracketR)):u.property=this.type===H.privateId&&e.type!==`Super`?this.parsePrivateIdent():this.parseIdent(this.options.allowReserved!==`never`),u.computed=!!l,s&&(u.optional=c),e=this.finishNode(u,`MemberExpression`)}else if(!r&&this.eat(H.parenL)){var d=new DestructuringErrors,f=this.yieldPos,p=this.awaitPos,m=this.awaitIdentPos;this.yieldPos=0,this.awaitPos=0,this.awaitIdentPos=0;var h=this.parseExprList(H.parenR,this.options.ecmaVersion>=8,!1,d);if(i&&!c&&this.shouldParseAsyncArrow())return this.checkPatternErrors(d,!1),this.checkYieldAwaitInDefaultParams(),this.awaitIdentPos>0&&this.raise(this.awaitIdentPos,`Cannot use 'await' as identifier inside an async function`),this.yieldPos=f,this.awaitPos=p,this.awaitIdentPos=m,this.parseSubscriptAsyncArrow(t,n,h,o);this.checkExpressionErrors(d,!0),this.yieldPos=f||this.yieldPos,this.awaitPos=p||this.awaitPos,this.awaitIdentPos=m||this.awaitIdentPos;var g=this.startNodeAt(t,n);g.callee=e,g.arguments=h,s&&(g.optional=c),e=this.finishNode(g,`CallExpression`)}else if(this.type===H.backQuote){(c||a)&&this.raise(this.start,`Optional chaining cannot appear in the tag of tagged template expressions`);var v=this.startNodeAt(t,n);v.tag=e,v.quasi=this.parseTemplate({isTagged:!0}),e=this.finishNode(v,`TaggedTemplateExpression`)}return e},X.parseExprAtom=function(e,t,n){this.type===H.slash&&this.readRegexp();var r,i=this.potentialArrowAt===this.start;switch(this.type){case H._super:return this.allowSuper||this.raise(this.start,`'super' keyword outside a method`),r=this.startNode(),this.next(),this.type===H.parenL&&!this.allowDirectSuper&&this.raise(r.start,`super() call outside constructor of a subclass`),this.type!==H.dot&&this.type!==H.bracketL&&this.type!==H.parenL&&this.unexpected(),this.finishNode(r,`Super`);case H._this:return r=this.startNode(),this.next(),this.finishNode(r,`ThisExpression`);case H.name:var a=this.start,o=this.startLoc,s=this.containsEsc,c=this.parseIdent(!1);if(this.options.ecmaVersion>=8&&!s&&c.name===`async`&&!this.canInsertSemicolon()&&this.eat(H._function))return this.overrideContext(Y.f_expr),this.parseFunction(this.startNodeAt(a,o),0,!1,!0,t);if(i&&!this.canInsertSemicolon()){if(this.eat(H.arrow))return this.parseArrowExpression(this.startNodeAt(a,o),[c],!1,t);if(this.options.ecmaVersion>=8&&c.name===`async`&&this.type===H.name&&!s&&(!this.potentialArrowInForAwait||this.value!==`of`||this.containsEsc))return c=this.parseIdent(!1),(this.canInsertSemicolon()||!this.eat(H.arrow))&&this.unexpected(),this.parseArrowExpression(this.startNodeAt(a,o),[c],!0,t)}return c;case H.regexp:var l=this.value;return r=this.parseLiteral(l.value),r.regex={pattern:l.pattern,flags:l.flags},r;case H.num:case H.string:return this.parseLiteral(this.value);case H._null:case H._true:case H._false:return r=this.startNode(),r.value=this.type===H._null?null:this.type===H._true,r.raw=this.type.keyword,this.next(),this.finishNode(r,`Literal`);case H.parenL:var u=this.start,d=this.parseParenAndDistinguishExpression(i,t);return e&&(e.parenthesizedAssign<0&&!this.isSimpleAssignTarget(d)&&(e.parenthesizedAssign=u),e.parenthesizedBind<0&&(e.parenthesizedBind=u)),d;case H.bracketL:return r=this.startNode(),this.next(),r.elements=this.parseExprList(H.bracketR,!0,!0,e),this.finishNode(r,`ArrayExpression`);case H.braceL:return this.overrideContext(Y.b_expr),this.parseObj(!1,e);case H._function:return r=this.startNode(),this.next(),this.parseFunction(r,0);case H._class:return this.parseClass(this.startNode(),!1);case H._new:return this.parseNew();case H.backQuote:return this.parseTemplate();case H._import:return this.options.ecmaVersion>=11?this.parseExprImport(n):this.unexpected();default:return this.parseExprAtomDefault()}},X.parseExprAtomDefault=function(){this.unexpected()},X.parseExprImport=function(e){var t=this.startNode();if(this.containsEsc&&this.raiseRecoverable(this.start,`Escape sequence in keyword import`),this.next(),this.type===H.parenL&&!e)return this.parseDynamicImport(t);if(this.type===H.dot){var n=this.startNodeAt(t.start,t.loc&&t.loc.start);return n.name=`import`,t.meta=this.finishNode(n,`Identifier`),this.parseImportMeta(t)}this.unexpected()},X.parseDynamicImport=function(e){if(this.next(),e.source=this.parseMaybeAssign(),this.options.ecmaVersion>=16)this.eat(H.parenR)?e.options=null:(this.expect(H.comma),this.afterTrailingComma(H.parenR)?e.options=null:(e.options=this.parseMaybeAssign(),this.eat(H.parenR)||(this.expect(H.comma),this.afterTrailingComma(H.parenR)||this.unexpected())));else if(!this.eat(H.parenR)){var t=this.start;this.eat(H.comma)&&this.eat(H.parenR)?this.raiseRecoverable(t,`Trailing comma is not allowed in import()`):this.unexpected(t)}return this.finishNode(e,`ImportExpression`)},X.parseImportMeta=function(e){this.next();var t=this.containsEsc;return e.property=this.parseIdent(!0),e.property.name!==`meta`&&this.raiseRecoverable(e.property.start,`The only valid meta property for import is 'import.meta'`),t&&this.raiseRecoverable(e.start,`'import.meta' must not contain escaped characters`),this.options.sourceType!==`module`&&!this.options.allowImportExportEverywhere&&this.raiseRecoverable(e.start,`Cannot use 'import.meta' outside a module`),this.finishNode(e,`MetaProperty`)},X.parseLiteral=function(e){var t=this.startNode();return t.value=e,t.raw=this.input.slice(this.start,this.end),t.raw.charCodeAt(t.raw.length-1)===110&&(t.bigint=t.value==null?t.raw.slice(0,-1).replace(/_/g,``):t.value.toString()),this.next(),this.finishNode(t,`Literal`)},X.parseParenExpression=function(){this.expect(H.parenL);var e=this.parseExpression();return this.expect(H.parenR),e},X.shouldParseArrow=function(e){return!this.canInsertSemicolon()},X.parseParenAndDistinguishExpression=function(e,t){var n=this.start,r=this.startLoc,i,a=this.options.ecmaVersion>=8;if(this.options.ecmaVersion>=6){this.next();var o=this.start,s=this.startLoc,c=[],l=!0,u=!1,d=new DestructuringErrors,f=this.yieldPos,p=this.awaitPos,m;for(this.yieldPos=0,this.awaitPos=0;this.type!==H.parenR;){if(l?l=!1:this.expect(H.comma),a&&this.afterTrailingComma(H.parenR,!0)){u=!0;break}if(this.type===H.ellipsis){m=this.start,c.push(this.parseParenItem(this.parseRestBinding())),this.type===H.comma&&this.raiseRecoverable(this.start,`Comma is not permitted after the rest element`);break}c.push(this.parseMaybeAssign(!1,d,this.parseParenItem))}var h=this.lastTokEnd,g=this.lastTokEndLoc;if(this.expect(H.parenR),e&&this.shouldParseArrow(c)&&this.eat(H.arrow))return this.checkPatternErrors(d,!1),this.checkYieldAwaitInDefaultParams(),this.yieldPos=f,this.awaitPos=p,this.parseParenArrowList(n,r,c,t);(!c.length||u)&&this.unexpected(this.lastTokStart),m&&this.unexpected(m),this.checkExpressionErrors(d,!0),this.yieldPos=f||this.yieldPos,this.awaitPos=p||this.awaitPos,c.length>1?(i=this.startNodeAt(o,s),i.expressions=c,this.finishNodeAt(i,`SequenceExpression`,h,g)):i=c[0]}else i=this.parseParenExpression();if(this.options.preserveParens){var v=this.startNodeAt(n,r);return v.expression=i,this.finishNode(v,`ParenthesizedExpression`)}return i},X.parseParenItem=function(e){return e},X.parseParenArrowList=function(e,t,n,r){return this.parseArrowExpression(this.startNodeAt(e,t),n,!1,r)},Kp=[],X.parseNew=function(){this.containsEsc&&this.raiseRecoverable(this.start,`Escape sequence in keyword new`);var e=this.startNode();if(this.next(),this.options.ecmaVersion>=6&&this.type===H.dot){var t=this.startNodeAt(e.start,e.loc&&e.loc.start);t.name=`new`,e.meta=this.finishNode(t,`Identifier`),this.next();var n=this.containsEsc;return e.property=this.parseIdent(!0),e.property.name!==`target`&&this.raiseRecoverable(e.property.start,`The only valid meta property for new is 'new.target'`),n&&this.raiseRecoverable(e.start,`'new.target' must not contain escaped characters`),this.allowNewDotTarget||this.raiseRecoverable(e.start,`'new.target' can only be used in functions and class static block`),this.finishNode(e,`MetaProperty`)}var r=this.start,i=this.startLoc;return e.callee=this.parseSubscripts(this.parseExprAtom(null,!1,!0),r,i,!0,!1),e.callee.type===`Super`&&this.raiseRecoverable(r,`Invalid use of 'super'`),e.arguments=this.eat(H.parenL)?this.parseExprList(H.parenR,this.options.ecmaVersion>=8,!1):Kp,this.finishNode(e,`NewExpression`)},X.parseTemplateElement=function(e){var t=e.isTagged,n=this.startNode();return this.type===H.invalidTemplate?(t||this.raiseRecoverable(this.start,`Bad escape sequence in untagged template literal`),n.value={raw:this.value.replace(/\r\n?/g,`
`),cooked:null}):n.value={raw:this.input.slice(this.start,this.end).replace(/\r\n?/g,`
`),cooked:this.value},this.next(),n.tail=this.type===H.backQuote,this.finishNode(n,`TemplateElement`)},X.parseTemplate=function(e){e===void 0&&(e={});var t=e.isTagged;t===void 0&&(t=!1);var n=this.startNode();this.next(),n.expressions=[];var r=this.parseTemplateElement({isTagged:t});for(n.quasis=[r];!r.tail;)this.type===H.eof&&this.raise(this.pos,`Unterminated template literal`),this.expect(H.dollarBraceL),n.expressions.push(this.parseExpression()),this.expect(H.braceR),n.quasis.push(r=this.parseTemplateElement({isTagged:t}));return this.next(),this.finishNode(n,`TemplateLiteral`)},X.isAsyncProp=function(e){return!e.computed&&e.key.type===`Identifier`&&e.key.name===`async`&&(this.type===H.name||this.type===H.num||this.type===H.string||this.type===H.bracketL||this.type.keyword||this.options.ecmaVersion>=9&&this.type===H.star)&&!U.test(this.input.slice(this.lastTokEnd,this.start))},X.parseObj=function(e,t){var n=this.startNode(),r=!0,i={};for(n.properties=[],this.next();!this.eat(H.braceR);){if(r)r=!1;else if(this.expect(H.comma),this.options.ecmaVersion>=5&&this.afterTrailingComma(H.braceR))break;var a=this.parseProperty(e,t);e||this.checkPropClash(a,i,t),n.properties.push(a)}return this.finishNode(n,e?`ObjectPattern`:`ObjectExpression`)},X.parseProperty=function(e,t){var n=this.startNode(),r,i,a,o;if(this.options.ecmaVersion>=9&&this.eat(H.ellipsis))return e?(n.argument=this.parseIdent(!1),this.type===H.comma&&this.raiseRecoverable(this.start,`Comma is not permitted after the rest element`),this.finishNode(n,`RestElement`)):(n.argument=this.parseMaybeAssign(!1,t),this.type===H.comma&&t&&t.trailingComma<0&&(t.trailingComma=this.start),this.finishNode(n,`SpreadElement`));this.options.ecmaVersion>=6&&(n.method=!1,n.shorthand=!1,(e||t)&&(a=this.start,o=this.startLoc),e||(r=this.eat(H.star)));var s=this.containsEsc;return this.parsePropertyName(n),!e&&!s&&this.options.ecmaVersion>=8&&!r&&this.isAsyncProp(n)?(i=!0,r=this.options.ecmaVersion>=9&&this.eat(H.star),this.parsePropertyName(n)):i=!1,this.parsePropertyValue(n,e,r,i,a,o,t,s),this.finishNode(n,`Property`)},X.parseGetterSetter=function(e){var t=e.key.name;this.parsePropertyName(e),e.value=this.parseMethod(!1),e.kind=t;var n=e.kind===`get`?0:1;if(e.value.params.length!==n){var r=e.value.start;e.kind===`get`?this.raiseRecoverable(r,`getter should have no params`):this.raiseRecoverable(r,`setter should have exactly one param`)}else e.kind===`set`&&e.value.params[0].type===`RestElement`&&this.raiseRecoverable(e.value.params[0].start,`Setter cannot use rest params`)},X.parsePropertyValue=function(e,t,n,r,i,a,o,s){(n||r)&&this.type===H.colon&&this.unexpected(),this.eat(H.colon)?(e.value=t?this.parseMaybeDefault(this.start,this.startLoc):this.parseMaybeAssign(!1,o),e.kind=`init`):this.options.ecmaVersion>=6&&this.type===H.parenL?(t&&this.unexpected(),e.method=!0,e.value=this.parseMethod(n,r),e.kind=`init`):!t&&!s&&this.options.ecmaVersion>=5&&!e.computed&&e.key.type===`Identifier`&&(e.key.name===`get`||e.key.name===`set`)&&this.type!==H.comma&&this.type!==H.braceR&&this.type!==H.eq?((n||r)&&this.unexpected(),this.parseGetterSetter(e)):this.options.ecmaVersion>=6&&!e.computed&&e.key.type===`Identifier`?((n||r)&&this.unexpected(),this.checkUnreserved(e.key),e.key.name===`await`&&!this.awaitIdentPos&&(this.awaitIdentPos=i),t?e.value=this.parseMaybeDefault(i,a,this.copyNode(e.key)):this.type===H.eq&&o?(o.shorthandAssign<0&&(o.shorthandAssign=this.start),e.value=this.parseMaybeDefault(i,a,this.copyNode(e.key))):e.value=this.copyNode(e.key),e.kind=`init`,e.shorthand=!0):this.unexpected()},X.parsePropertyName=function(e){if(this.options.ecmaVersion>=6){if(this.eat(H.bracketL))return e.computed=!0,e.key=this.parseMaybeAssign(),this.expect(H.bracketR),e.key;e.computed=!1}return e.key=this.type===H.num||this.type===H.string?this.parseExprAtom():this.parseIdent(this.options.allowReserved!==`never`)},X.initFunction=function(e){e.id=null,this.options.ecmaVersion>=6&&(e.generator=e.expression=!1),this.options.ecmaVersion>=8&&(e.async=!1)},X.parseMethod=function(e,t,n){var r=this.startNode(),i=this.yieldPos,a=this.awaitPos,o=this.awaitIdentPos;return this.initFunction(r),this.options.ecmaVersion>=6&&(r.generator=e),this.options.ecmaVersion>=8&&(r.async=!!t),this.yieldPos=0,this.awaitPos=0,this.awaitIdentPos=0,this.enterScope(functionFlags(t,r.generator)|Ep|(n?Dp:0)),this.expect(H.parenL),r.params=this.parseBindingList(H.parenR,!1,this.options.ecmaVersion>=8),this.checkYieldAwaitInDefaultParams(),this.parseFunctionBody(r,!1,!0,!1),this.yieldPos=i,this.awaitPos=a,this.awaitIdentPos=o,this.finishNode(r,`FunctionExpression`)},X.parseArrowExpression=function(e,t,n,r){var i=this.yieldPos,a=this.awaitPos,o=this.awaitIdentPos;return this.enterScope(functionFlags(n,!1)|wp),this.initFunction(e),this.options.ecmaVersion>=8&&(e.async=!!n),this.yieldPos=0,this.awaitPos=0,this.awaitIdentPos=0,e.params=this.toAssignableList(t,!0),this.parseFunctionBody(e,!0,!1,r),this.yieldPos=i,this.awaitPos=a,this.awaitIdentPos=o,this.finishNode(e,`ArrowFunctionExpression`)},X.parseFunctionBody=function(e,t,n,r){var i=t&&this.type!==H.braceL,a=this.strict,o=!1;if(i)e.body=this.parseMaybeAssign(r),e.expression=!0,this.checkParams(e,!1);else{var s=this.options.ecmaVersion>=7&&!this.isSimpleParamList(e.params);(!a||s)&&(o=this.strictDirective(this.end),o&&s&&this.raiseRecoverable(e.start,`Illegal 'use strict' directive in function with non-simple parameter list`));var c=this.labels;this.labels=[],o&&(this.strict=!0),this.checkParams(e,!a&&!o&&!t&&!n&&this.isSimpleParamList(e.params)),this.strict&&e.id&&this.checkLValSimple(e.id,Lp),e.body=this.parseBlock(!1,void 0,o&&!a),e.expression=!1,this.adaptDirectivePrologue(e.body.body),this.labels=c}this.exitScope()},X.isSimpleParamList=function(e){for(var t=0,n=e;t<n.length;t+=1)if(n[t].type!==`Identifier`)return!1;return!0},X.checkParams=function(e,t){for(var n=Object.create(null),r=0,i=e.params;r<i.length;r+=1){var a=i[r];this.checkLValInnerPattern(a,Np,t?null:n)}},X.parseExprList=function(e,t,n,r){for(var i=[],a=!0;!this.eat(e);){if(a)a=!1;else if(this.expect(H.comma),t&&this.afterTrailingComma(e))break;var o=void 0;n&&this.type===H.comma?o=null:this.type===H.ellipsis?(o=this.parseSpread(r),r&&this.type===H.comma&&r.trailingComma<0&&(r.trailingComma=this.start)):o=this.parseMaybeAssign(!1,r),i.push(o)}return i},X.checkUnreserved=function(e){var t=e.start,n=e.end,r=e.name;this.inGenerator&&r===`yield`&&this.raiseRecoverable(t,`Cannot use 'yield' as identifier inside a generator`),this.inAsync&&r===`await`&&this.raiseRecoverable(t,`Cannot use 'await' as identifier inside an async function`),!(this.currentThisScope().flags&jp)&&r===`arguments`&&this.raiseRecoverable(t,`Cannot use 'arguments' in class field initializer`),this.inClassStaticBlock&&(r===`arguments`||r===`await`)&&this.raise(t,`Cannot use `+r+` in class static initialization block`),this.keywords.test(r)&&this.raise(t,`Unexpected keyword '`+r+`'`),!(this.options.ecmaVersion<6&&this.input.slice(t,n).indexOf(`\\`)!==-1)&&(this.strict?this.reservedWordsStrict:this.reservedWords).test(r)&&(!this.inAsync&&r===`await`&&this.raiseRecoverable(t,`Cannot use keyword 'await' outside an async function`),this.raiseRecoverable(t,`The keyword '`+r+`' is reserved`))},X.parseIdent=function(e){var t=this.parseIdentNode();return this.next(!!e),this.finishNode(t,`Identifier`),e||(this.checkUnreserved(t),t.name===`await`&&!this.awaitIdentPos&&(this.awaitIdentPos=t.start)),t},X.parseIdentNode=function(){var e=this.startNode();return this.type===H.name?e.name=this.value:this.type.keyword?(e.name=this.type.keyword,(e.name===`class`||e.name===`function`)&&(this.lastTokEnd!==this.lastTokStart+1||this.input.charCodeAt(this.lastTokStart)!==46)&&this.context.pop(),this.type=H.name):this.unexpected(),e},X.parsePrivateIdent=function(){var e=this.startNode();return this.type===H.privateId?e.name=this.value:this.unexpected(),this.next(),this.finishNode(e,`PrivateIdentifier`),this.options.checkPrivateFields&&(this.privateNameStack.length===0?this.raise(e.start,`Private field '#`+e.name+`' must be declared in an enclosing class`):this.privateNameStack[this.privateNameStack.length-1].used.push(e)),e},X.parseYield=function(e){this.yieldPos||=this.start;var t=this.startNode();return this.next(),this.type===H.semi||this.canInsertSemicolon()||this.type!==H.star&&!this.type.startsExpr?(t.delegate=!1,t.argument=null):(t.delegate=this.eat(H.star),t.argument=this.parseMaybeAssign(e)),this.finishNode(t,`YieldExpression`)},X.parseAwait=function(e){this.awaitPos||=this.start;var t=this.startNode();return this.next(),t.argument=this.parseMaybeUnary(null,!0,!1,e),this.finishNode(t,`AwaitExpression`)},qp=Parser.prototype,qp.raise=function(e,t){var n=getLineInfo(this.input,e);t+=` (`+n.line+`:`+n.column+`)`,this.sourceFile&&(t+=` in `+this.sourceFile);var r=SyntaxError(t);throw r.pos=e,r.loc=n,r.raisedAt=this.pos,r},qp.raiseRecoverable=qp.raise,qp.curPosition=function(){if(this.options.locations)return new Position(this.curLine,this.pos-this.lineStart)},Jp=Parser.prototype,Scope=function(e){this.flags=e,this.var=[],this.lexical=[],this.functions=[]},Jp.enterScope=function(e){this.scopeStack.push(new Scope(e))},Jp.exitScope=function(){this.scopeStack.pop()},Jp.treatFunctionsAsVarInScope=function(e){return e.flags&xp||!this.inModule&&e.flags&bp},Jp.declareName=function(e,t,n){var r=!1;if(t===Pp){var i=this.currentScope();r=i.lexical.indexOf(e)>-1||i.functions.indexOf(e)>-1||i.var.indexOf(e)>-1,i.lexical.push(e),this.inModule&&i.flags&bp&&delete this.undefinedExports[e]}else if(t===Ip)this.currentScope().lexical.push(e);else if(t===Fp){var a=this.currentScope();r=this.treatFunctionsAsVar?a.lexical.indexOf(e)>-1:a.lexical.indexOf(e)>-1||a.var.indexOf(e)>-1,a.functions.push(e)}else for(var o=this.scopeStack.length-1;o>=0;--o){var s=this.scopeStack[o];if(s.lexical.indexOf(e)>-1&&!(s.flags&Tp&&s.lexical[0]===e)||!this.treatFunctionsAsVarInScope(s)&&s.functions.indexOf(e)>-1){r=!0;break}if(s.var.push(e),this.inModule&&s.flags&bp&&delete this.undefinedExports[e],s.flags&jp)break}r&&this.raiseRecoverable(n,`Identifier '`+e+`' has already been declared`)},Jp.checkLocalExport=function(e){this.scopeStack[0].lexical.indexOf(e.name)===-1&&this.scopeStack[0].var.indexOf(e.name)===-1&&(this.undefinedExports[e.name]=e)},Jp.currentScope=function(){return this.scopeStack[this.scopeStack.length-1]},Jp.currentVarScope=function(){for(var e=this.scopeStack.length-1;;e--){var t=this.scopeStack[e];if(t.flags&(jp|kp|Op))return t}},Jp.currentThisScope=function(){for(var e=this.scopeStack.length-1;;e--){var t=this.scopeStack[e];if(t.flags&(jp|kp|Op)&&!(t.flags&wp))return t}},Node=function(e,t,n){this.type=``,this.start=t,this.end=0,e.options.locations&&(this.loc=new SourceLocation(e,n)),e.options.directSourceFile&&(this.sourceFile=e.options.directSourceFile),e.options.ranges&&(this.range=[t,0])},Yp=Parser.prototype,Yp.startNode=function(){return new Node(this,this.start,this.startLoc)},Yp.startNodeAt=function(e,t){return new Node(this,e,t)},Yp.finishNode=function(e,t){return finishNodeAt.call(this,e,t,this.lastTokEnd,this.lastTokEndLoc)},Yp.finishNodeAt=function(e,t,n,r){return finishNodeAt.call(this,e,t,n,r)},Yp.copyNode=function(e){var t=new Node(this,e.start,this.startLoc);for(var n in e)t[n]=e[n];return t},Xp=`Berf Beria_Erfe Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sidetic Sidt Sunu Sunuwar Tai_Yo Tayo Todhri Todr Tolong_Siki Tols Tulu_Tigalari Tutg Unknown Zzzz`,Zp=`ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS`,Qp=Zp+` Extended_Pictographic`,$p=Qp,em=$p+` EBase EComp EMod EPres ExtPict`,tm=em,nm={9:Zp,10:Qp,11:$p,12:em,13:tm,14:tm},rm={9:``,10:``,11:``,12:``,13:``,14:`Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji`},im=`Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu`,am=`Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb`,om=am+` Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd`,sm=om+` Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho`,cm=sm+` Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi`,lm=cm+` Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith`,um={9:am,10:om,11:sm,12:cm,13:lm,14:lm+` `+Xp},dm={},fm=0,pm=[9,10,11,12,13,14];fm<pm.length;fm+=1)mm=pm[fm],buildUnicodeData(mm);Z=Parser.prototype,BranchID=function(e,t){this.parent=e,this.base=t||this},BranchID.prototype.separatedFrom=function(e){for(var t=this;t;t=t.parent)for(var n=e;n;n=n.parent)if(t.base===n.base&&t!==n)return!0;return!1},BranchID.prototype.sibling=function(){return new BranchID(this.parent,this.base)},RegExpValidationState=function(e){this.parser=e,this.validFlags=`gim`+(e.options.ecmaVersion>=6?`uy`:``)+(e.options.ecmaVersion>=9?`s`:``)+(e.options.ecmaVersion>=13?`d`:``)+(e.options.ecmaVersion>=15?`v`:``),this.unicodeProperties=dm[e.options.ecmaVersion>=14?14:e.options.ecmaVersion],this.source=``,this.flags=``,this.start=0,this.switchU=!1,this.switchV=!1,this.switchN=!1,this.pos=0,this.lastIntValue=0,this.lastStringValue=``,this.lastAssertionIsQuantifiable=!1,this.numCapturingParens=0,this.maxBackReference=0,this.groupNames=Object.create(null),this.backReferenceNames=[],this.branchID=null},RegExpValidationState.prototype.reset=function(e,t,n){var r=n.indexOf(`v`)!==-1,i=n.indexOf(`u`)!==-1;this.start=e|0,this.source=t+``,this.flags=n,r&&this.parser.options.ecmaVersion>=15?(this.switchU=!0,this.switchV=!0,this.switchN=!0):(this.switchU=i&&this.parser.options.ecmaVersion>=6,this.switchV=!1,this.switchN=i&&this.parser.options.ecmaVersion>=9)},RegExpValidationState.prototype.raise=function(e){this.parser.raiseRecoverable(this.start,`Invalid regular expression: /`+this.source+`/: `+e)},RegExpValidationState.prototype.at=function(e,t){t===void 0&&(t=!1);var n=this.source,r=n.length;if(e>=r)return-1;var i=n.charCodeAt(e);if(!(t||this.switchU)||i<=55295||i>=57344||e+1>=r)return i;var a=n.charCodeAt(e+1);return a>=56320&&a<=57343?(i<<10)+a-56613888:i},RegExpValidationState.prototype.nextIndex=function(e,t){t===void 0&&(t=!1);var n=this.source,r=n.length;if(e>=r)return r;var i=n.charCodeAt(e),a;return!(t||this.switchU)||i<=55295||i>=57344||e+1>=r||(a=n.charCodeAt(e+1))<56320||a>57343?e+1:e+2},RegExpValidationState.prototype.current=function(e){return e===void 0&&(e=!1),this.at(this.pos,e)},RegExpValidationState.prototype.lookahead=function(e){return e===void 0&&(e=!1),this.at(this.nextIndex(this.pos,e),e)},RegExpValidationState.prototype.advance=function(e){e===void 0&&(e=!1),this.pos=this.nextIndex(this.pos,e)},RegExpValidationState.prototype.eat=function(e,t){return t===void 0&&(t=!1),this.current(t)===e&&(this.advance(t),!0)},RegExpValidationState.prototype.eatChars=function(e,t){t===void 0&&(t=!1);for(var n=this.pos,r=0,i=e;r<i.length;r+=1){var a=i[r],o=this.at(n,t);if(o===-1||o!==a)return!1;n=this.nextIndex(n,t)}return this.pos=n,!0},Z.validateRegExpFlags=function(e){for(var t=e.validFlags,n=e.flags,r=!1,i=!1,a=0;a<n.length;a++){var o=n.charAt(a);t.indexOf(o)===-1&&this.raise(e.start,`Invalid regular expression flag`),n.indexOf(o,a+1)>-1&&this.raise(e.start,`Duplicate regular expression flag`),o===`u`&&(r=!0),o===`v`&&(i=!0)}this.options.ecmaVersion>=15&&r&&i&&this.raise(e.start,`Invalid regular expression flag`)},Z.validateRegExpPattern=function(e){this.regexp_pattern(e),!e.switchN&&this.options.ecmaVersion>=9&&hasProp(e.groupNames)&&(e.switchN=!0,this.regexp_pattern(e))},Z.regexp_pattern=function(e){e.pos=0,e.lastIntValue=0,e.lastStringValue=``,e.lastAssertionIsQuantifiable=!1,e.numCapturingParens=0,e.maxBackReference=0,e.groupNames=Object.create(null),e.backReferenceNames.length=0,e.branchID=null,this.regexp_disjunction(e),e.pos!==e.source.length&&(e.eat(41)&&e.raise(`Unmatched ')'`),(e.eat(93)||e.eat(125))&&e.raise(`Lone quantifier brackets`)),e.maxBackReference>e.numCapturingParens&&e.raise(`Invalid escape`);for(var t=0,n=e.backReferenceNames;t<n.length;t+=1){var r=n[t];e.groupNames[r]||e.raise(`Invalid named capture referenced`)}},Z.regexp_disjunction=function(e){var t=this.options.ecmaVersion>=16;for(t&&(e.branchID=new BranchID(e.branchID,null)),this.regexp_alternative(e);e.eat(124);)t&&(e.branchID=e.branchID.sibling()),this.regexp_alternative(e);t&&(e.branchID=e.branchID.parent),this.regexp_eatQuantifier(e,!0)&&e.raise(`Nothing to repeat`),e.eat(123)&&e.raise(`Lone quantifier brackets`)},Z.regexp_alternative=function(e){for(;e.pos<e.source.length&&this.regexp_eatTerm(e););},Z.regexp_eatTerm=function(e){return this.regexp_eatAssertion(e)?(e.lastAssertionIsQuantifiable&&this.regexp_eatQuantifier(e)&&e.switchU&&e.raise(`Invalid quantifier`),!0):(e.switchU?this.regexp_eatAtom(e):this.regexp_eatExtendedAtom(e))?(this.regexp_eatQuantifier(e),!0):!1},Z.regexp_eatAssertion=function(e){var t=e.pos;if(e.lastAssertionIsQuantifiable=!1,e.eat(94)||e.eat(36))return!0;if(e.eat(92)){if(e.eat(66)||e.eat(98))return!0;e.pos=t}if(e.eat(40)&&e.eat(63)){var n=!1;if(this.options.ecmaVersion>=9&&(n=e.eat(60)),e.eat(61)||e.eat(33))return this.regexp_disjunction(e),e.eat(41)||e.raise(`Unterminated group`),e.lastAssertionIsQuantifiable=!n,!0}return e.pos=t,!1},Z.regexp_eatQuantifier=function(e,t){return t===void 0&&(t=!1),this.regexp_eatQuantifierPrefix(e,t)?(e.eat(63),!0):!1},Z.regexp_eatQuantifierPrefix=function(e,t){return e.eat(42)||e.eat(43)||e.eat(63)||this.regexp_eatBracedQuantifier(e,t)},Z.regexp_eatBracedQuantifier=function(e,t){var n=e.pos;if(e.eat(123)){var r=0,i=-1;if(this.regexp_eatDecimalDigits(e)&&(r=e.lastIntValue,e.eat(44)&&this.regexp_eatDecimalDigits(e)&&(i=e.lastIntValue),e.eat(125)))return i!==-1&&i<r&&!t&&e.raise(`numbers out of order in {} quantifier`),!0;e.switchU&&!t&&e.raise(`Incomplete quantifier`),e.pos=n}return!1},Z.regexp_eatAtom=function(e){return this.regexp_eatPatternCharacters(e)||e.eat(46)||this.regexp_eatReverseSolidusAtomEscape(e)||this.regexp_eatCharacterClass(e)||this.regexp_eatUncapturingGroup(e)||this.regexp_eatCapturingGroup(e)},Z.regexp_eatReverseSolidusAtomEscape=function(e){var t=e.pos;if(e.eat(92)){if(this.regexp_eatAtomEscape(e))return!0;e.pos=t}return!1},Z.regexp_eatUncapturingGroup=function(e){var t=e.pos;if(e.eat(40)){if(e.eat(63)){if(this.options.ecmaVersion>=16){var n=this.regexp_eatModifiers(e),r=e.eat(45);if(n||r){for(var i=0;i<n.length;i++){var a=n.charAt(i);n.indexOf(a,i+1)>-1&&e.raise(`Duplicate regular expression modifiers`)}if(r){var o=this.regexp_eatModifiers(e);!n&&!o&&e.current()===58&&e.raise(`Invalid regular expression modifiers`);for(var s=0;s<o.length;s++){var c=o.charAt(s);(o.indexOf(c,s+1)>-1||n.indexOf(c)>-1)&&e.raise(`Duplicate regular expression modifiers`)}}}}if(e.eat(58)){if(this.regexp_disjunction(e),e.eat(41))return!0;e.raise(`Unterminated group`)}}e.pos=t}return!1},Z.regexp_eatCapturingGroup=function(e){if(e.eat(40)){if(this.options.ecmaVersion>=9?this.regexp_groupSpecifier(e):e.current()===63&&e.raise(`Invalid group`),this.regexp_disjunction(e),e.eat(41))return e.numCapturingParens+=1,!0;e.raise(`Unterminated group`)}return!1},Z.regexp_eatModifiers=function(e){for(var t=``,n=0;(n=e.current())!==-1&&isRegularExpressionModifier(n);)t+=codePointToString(n),e.advance();return t},Z.regexp_eatExtendedAtom=function(e){return e.eat(46)||this.regexp_eatReverseSolidusAtomEscape(e)||this.regexp_eatCharacterClass(e)||this.regexp_eatUncapturingGroup(e)||this.regexp_eatCapturingGroup(e)||this.regexp_eatInvalidBracedQuantifier(e)||this.regexp_eatExtendedPatternCharacter(e)},Z.regexp_eatInvalidBracedQuantifier=function(e){return this.regexp_eatBracedQuantifier(e,!0)&&e.raise(`Nothing to repeat`),!1},Z.regexp_eatSyntaxCharacter=function(e){var t=e.current();return isSyntaxCharacter(t)?(e.lastIntValue=t,e.advance(),!0):!1},Z.regexp_eatPatternCharacters=function(e){for(var t=e.pos,n=0;(n=e.current())!==-1&&!isSyntaxCharacter(n);)e.advance();return e.pos!==t},Z.regexp_eatExtendedPatternCharacter=function(e){var t=e.current();return t!==-1&&t!==36&&!(t>=40&&t<=43)&&t!==46&&t!==63&&t!==91&&t!==94&&t!==124&&(e.advance(),!0)},Z.regexp_groupSpecifier=function(e){if(e.eat(63)){this.regexp_eatGroupName(e)||e.raise(`Invalid group`);var t=this.options.ecmaVersion>=16,n=e.groupNames[e.lastStringValue];if(n){if(t)for(var r=0,i=n;r<i.length;r+=1)i[r].separatedFrom(e.branchID)||e.raise(`Duplicate capture group name`);else e.raise(`Duplicate capture group name`)}t?(n||(e.groupNames[e.lastStringValue]=[])).push(e.branchID):e.groupNames[e.lastStringValue]=!0}},Z.regexp_eatGroupName=function(e){if(e.lastStringValue=``,e.eat(60)){if(this.regexp_eatRegExpIdentifierName(e)&&e.eat(62))return!0;e.raise(`Invalid capture group name`)}return!1},Z.regexp_eatRegExpIdentifierName=function(e){if(e.lastStringValue=``,this.regexp_eatRegExpIdentifierStart(e)){for(e.lastStringValue+=codePointToString(e.lastIntValue);this.regexp_eatRegExpIdentifierPart(e);)e.lastStringValue+=codePointToString(e.lastIntValue);return!0}return!1},Z.regexp_eatRegExpIdentifierStart=function(e){var t=e.pos,n=this.options.ecmaVersion>=11,r=e.current(n);return e.advance(n),r===92&&this.regexp_eatRegExpUnicodeEscapeSequence(e,n)&&(r=e.lastIntValue),isRegExpIdentifierStart(r)?(e.lastIntValue=r,!0):(e.pos=t,!1)},Z.regexp_eatRegExpIdentifierPart=function(e){var t=e.pos,n=this.options.ecmaVersion>=11,r=e.current(n);return e.advance(n),r===92&&this.regexp_eatRegExpUnicodeEscapeSequence(e,n)&&(r=e.lastIntValue),isRegExpIdentifierPart(r)?(e.lastIntValue=r,!0):(e.pos=t,!1)},Z.regexp_eatAtomEscape=function(e){return this.regexp_eatBackReference(e)||this.regexp_eatCharacterClassEscape(e)||this.regexp_eatCharacterEscape(e)||e.switchN&&this.regexp_eatKGroupName(e)?!0:(e.switchU&&(e.current()===99&&e.raise(`Invalid unicode escape`),e.raise(`Invalid escape`)),!1)},Z.regexp_eatBackReference=function(e){var t=e.pos;if(this.regexp_eatDecimalEscape(e)){var n=e.lastIntValue;if(e.switchU)return n>e.maxBackReference&&(e.maxBackReference=n),!0;if(n<=e.numCapturingParens)return!0;e.pos=t}return!1},Z.regexp_eatKGroupName=function(e){if(e.eat(107)){if(this.regexp_eatGroupName(e))return e.backReferenceNames.push(e.lastStringValue),!0;e.raise(`Invalid named reference`)}return!1},Z.regexp_eatCharacterEscape=function(e){return this.regexp_eatControlEscape(e)||this.regexp_eatCControlLetter(e)||this.regexp_eatZero(e)||this.regexp_eatHexEscapeSequence(e)||this.regexp_eatRegExpUnicodeEscapeSequence(e,!1)||!e.switchU&&this.regexp_eatLegacyOctalEscapeSequence(e)||this.regexp_eatIdentityEscape(e)},Z.regexp_eatCControlLetter=function(e){var t=e.pos;if(e.eat(99)){if(this.regexp_eatControlLetter(e))return!0;e.pos=t}return!1},Z.regexp_eatZero=function(e){return e.current()===48&&!isDecimalDigit(e.lookahead())&&(e.lastIntValue=0,e.advance(),!0)},Z.regexp_eatControlEscape=function(e){var t=e.current();return t===116?(e.lastIntValue=9,e.advance(),!0):t===110?(e.lastIntValue=10,e.advance(),!0):t===118?(e.lastIntValue=11,e.advance(),!0):t===102?(e.lastIntValue=12,e.advance(),!0):t===114&&(e.lastIntValue=13,e.advance(),!0)},Z.regexp_eatControlLetter=function(e){var t=e.current();return isControlLetter(t)?(e.lastIntValue=t%32,e.advance(),!0):!1},Z.regexp_eatRegExpUnicodeEscapeSequence=function(e,t){t===void 0&&(t=!1);var n=e.pos,r=t||e.switchU;if(e.eat(117)){if(this.regexp_eatFixedHexDigits(e,4)){var i=e.lastIntValue;if(r&&i>=55296&&i<=56319){var a=e.pos;if(e.eat(92)&&e.eat(117)&&this.regexp_eatFixedHexDigits(e,4)){var o=e.lastIntValue;if(o>=56320&&o<=57343)return e.lastIntValue=(i-55296)*1024+(o-56320)+65536,!0}e.pos=a,e.lastIntValue=i}return!0}if(r&&e.eat(123)&&this.regexp_eatHexDigits(e)&&e.eat(125)&&isValidUnicode(e.lastIntValue))return!0;r&&e.raise(`Invalid unicode escape`),e.pos=n}return!1},Z.regexp_eatIdentityEscape=function(e){if(e.switchU)return this.regexp_eatSyntaxCharacter(e)?!0:e.eat(47)?(e.lastIntValue=47,!0):!1;var t=e.current();return t!==99&&(!e.switchN||t!==107)&&(e.lastIntValue=t,e.advance(),!0)},Z.regexp_eatDecimalEscape=function(e){e.lastIntValue=0;var t=e.current();if(t>=49&&t<=57){do e.lastIntValue=10*e.lastIntValue+(t-48),e.advance();while((t=e.current())>=48&&t<=57);return!0}return!1},hm=0,gm=1,Q=2,Z.regexp_eatCharacterClassEscape=function(e){var t=e.current();if(isCharacterClassEscape(t))return e.lastIntValue=-1,e.advance(),gm;var n=!1;if(e.switchU&&this.options.ecmaVersion>=9&&((n=t===80)||t===112)){e.lastIntValue=-1,e.advance();var r;if(e.eat(123)&&(r=this.regexp_eatUnicodePropertyValueExpression(e))&&e.eat(125))return n&&r===Q&&e.raise(`Invalid property name`),r;e.raise(`Invalid property name`)}return hm},Z.regexp_eatUnicodePropertyValueExpression=function(e){var t=e.pos;if(this.regexp_eatUnicodePropertyName(e)&&e.eat(61)){var n=e.lastStringValue;if(this.regexp_eatUnicodePropertyValue(e)){var r=e.lastStringValue;return this.regexp_validateUnicodePropertyNameAndValue(e,n,r),gm}}if(e.pos=t,this.regexp_eatLoneUnicodePropertyNameOrValue(e)){var i=e.lastStringValue;return this.regexp_validateUnicodePropertyNameOrValue(e,i)}return hm},Z.regexp_validateUnicodePropertyNameAndValue=function(e,t,n){mp(e.unicodeProperties.nonBinary,t)||e.raise(`Invalid property name`),e.unicodeProperties.nonBinary[t].test(n)||e.raise(`Invalid property value`)},Z.regexp_validateUnicodePropertyNameOrValue=function(e,t){if(e.unicodeProperties.binary.test(t))return gm;if(e.switchV&&e.unicodeProperties.binaryOfStrings.test(t))return Q;e.raise(`Invalid property name`)},Z.regexp_eatUnicodePropertyName=function(e){var t=0;for(e.lastStringValue=``;isUnicodePropertyNameCharacter(t=e.current());)e.lastStringValue+=codePointToString(t),e.advance();return e.lastStringValue!==``},Z.regexp_eatUnicodePropertyValue=function(e){var t=0;for(e.lastStringValue=``;isUnicodePropertyValueCharacter(t=e.current());)e.lastStringValue+=codePointToString(t),e.advance();return e.lastStringValue!==``},Z.regexp_eatLoneUnicodePropertyNameOrValue=function(e){return this.regexp_eatUnicodePropertyValue(e)},Z.regexp_eatCharacterClass=function(e){if(e.eat(91)){var t=e.eat(94),n=this.regexp_classContents(e);return e.eat(93)||e.raise(`Unterminated character class`),t&&n===Q&&e.raise(`Negated character class may contain strings`),!0}return!1},Z.regexp_classContents=function(e){return e.current()===93?gm:e.switchV?this.regexp_classSetExpression(e):(this.regexp_nonEmptyClassRanges(e),gm)},Z.regexp_nonEmptyClassRanges=function(e){for(;this.regexp_eatClassAtom(e);){var t=e.lastIntValue;if(e.eat(45)&&this.regexp_eatClassAtom(e)){var n=e.lastIntValue;e.switchU&&(t===-1||n===-1)&&e.raise(`Invalid character class`),t!==-1&&n!==-1&&t>n&&e.raise(`Range out of order in character class`)}}},Z.regexp_eatClassAtom=function(e){var t=e.pos;if(e.eat(92)){if(this.regexp_eatClassEscape(e))return!0;if(e.switchU){var n=e.current();(n===99||isOctalDigit(n))&&e.raise(`Invalid class escape`),e.raise(`Invalid escape`)}e.pos=t}var r=e.current();return r!==93&&(e.lastIntValue=r,e.advance(),!0)},Z.regexp_eatClassEscape=function(e){var t=e.pos;if(e.eat(98))return e.lastIntValue=8,!0;if(e.switchU&&e.eat(45))return e.lastIntValue=45,!0;if(!e.switchU&&e.eat(99)){if(this.regexp_eatClassControlLetter(e))return!0;e.pos=t}return this.regexp_eatCharacterClassEscape(e)||this.regexp_eatCharacterEscape(e)},Z.regexp_classSetExpression=function(e){var t=gm,n;if(!this.regexp_eatClassSetRange(e)){if(n=this.regexp_eatClassSetOperand(e)){n===Q&&(t=Q);for(var r=e.pos;e.eatChars([38,38]);){if(e.current()!==38&&(n=this.regexp_eatClassSetOperand(e))){n!==Q&&(t=gm);continue}e.raise(`Invalid character in character class`)}if(r!==e.pos)return t;for(;e.eatChars([45,45]);)this.regexp_eatClassSetOperand(e)||e.raise(`Invalid character in character class`);if(r!==e.pos)return t}else e.raise(`Invalid character in character class`)}for(;;)if(!this.regexp_eatClassSetRange(e)){if(n=this.regexp_eatClassSetOperand(e),!n)return t;n===Q&&(t=Q)}},Z.regexp_eatClassSetRange=function(e){var t=e.pos;if(this.regexp_eatClassSetCharacter(e)){var n=e.lastIntValue;if(e.eat(45)&&this.regexp_eatClassSetCharacter(e)){var r=e.lastIntValue;return n!==-1&&r!==-1&&n>r&&e.raise(`Range out of order in character class`),!0}e.pos=t}return!1},Z.regexp_eatClassSetOperand=function(e){return this.regexp_eatClassSetCharacter(e)?gm:this.regexp_eatClassStringDisjunction(e)||this.regexp_eatNestedClass(e)},Z.regexp_eatNestedClass=function(e){var t=e.pos;if(e.eat(91)){var n=e.eat(94),r=this.regexp_classContents(e);if(e.eat(93))return n&&r===Q&&e.raise(`Negated character class may contain strings`),r;e.pos=t}if(e.eat(92)){var i=this.regexp_eatCharacterClassEscape(e);if(i)return i;e.pos=t}return null},Z.regexp_eatClassStringDisjunction=function(e){var t=e.pos;if(e.eatChars([92,113])){if(e.eat(123)){var n=this.regexp_classStringDisjunctionContents(e);if(e.eat(125))return n}else e.raise(`Invalid escape`);e.pos=t}return null},Z.regexp_classStringDisjunctionContents=function(e){for(var t=this.regexp_classString(e);e.eat(124);)this.regexp_classString(e)===Q&&(t=Q);return t},Z.regexp_classString=function(e){for(var t=0;this.regexp_eatClassSetCharacter(e);)t++;return t===1?gm:Q},Z.regexp_eatClassSetCharacter=function(e){var t=e.pos;if(e.eat(92))return this.regexp_eatCharacterEscape(e)||this.regexp_eatClassSetReservedPunctuator(e)?!0:e.eat(98)?(e.lastIntValue=8,!0):(e.pos=t,!1);var n=e.current();return n<0||n===e.lookahead()&&isClassSetReservedDoublePunctuatorCharacter(n)||isClassSetSyntaxCharacter(n)?!1:(e.advance(),e.lastIntValue=n,!0)},Z.regexp_eatClassSetReservedPunctuator=function(e){var t=e.current();return isClassSetReservedPunctuator(t)?(e.lastIntValue=t,e.advance(),!0):!1},Z.regexp_eatClassControlLetter=function(e){var t=e.current();return isDecimalDigit(t)||t===95?(e.lastIntValue=t%32,e.advance(),!0):!1},Z.regexp_eatHexEscapeSequence=function(e){var t=e.pos;if(e.eat(120)){if(this.regexp_eatFixedHexDigits(e,2))return!0;e.switchU&&e.raise(`Invalid escape`),e.pos=t}return!1},Z.regexp_eatDecimalDigits=function(e){var t=e.pos,n=0;for(e.lastIntValue=0;isDecimalDigit(n=e.current());)e.lastIntValue=10*e.lastIntValue+(n-48),e.advance();return e.pos!==t},Z.regexp_eatHexDigits=function(e){var t=e.pos,n=0;for(e.lastIntValue=0;isHexDigit(n=e.current());)e.lastIntValue=16*e.lastIntValue+hexToInt(n),e.advance();return e.pos!==t},Z.regexp_eatLegacyOctalEscapeSequence=function(e){if(this.regexp_eatOctalDigit(e)){var t=e.lastIntValue;if(this.regexp_eatOctalDigit(e)){var n=e.lastIntValue;e.lastIntValue=t<=3&&this.regexp_eatOctalDigit(e)?t*64+n*8+e.lastIntValue:t*8+n}else e.lastIntValue=t;return!0}return!1},Z.regexp_eatOctalDigit=function(e){var t=e.current();return isOctalDigit(t)?(e.lastIntValue=t-48,e.advance(),!0):(e.lastIntValue=0,!1)},Z.regexp_eatFixedHexDigits=function(e,t){var n=e.pos;e.lastIntValue=0;for(var r=0;r<t;++r){var i=e.current();if(!isHexDigit(i))return e.pos=n,!1;e.lastIntValue=16*e.lastIntValue+hexToInt(i),e.advance()}return!0},Token=function(e){this.type=e.type,this.value=e.value,this.start=e.start,this.end=e.end,e.options.locations&&(this.loc=new SourceLocation(e,e.startLoc,e.endLoc)),e.options.ranges&&(this.range=[e.start,e.end])},$=Parser.prototype,$.next=function(e){!e&&this.type.keyword&&this.containsEsc&&this.raiseRecoverable(this.start,`Escape sequence in keyword `+this.type.keyword),this.options.onToken&&this.options.onToken(new Token(this)),this.lastTokEnd=this.end,this.lastTokStart=this.start,this.lastTokEndLoc=this.endLoc,this.lastTokStartLoc=this.startLoc,this.nextToken()},$.getToken=function(){return this.next(),new Token(this)},typeof Symbol<`u`&&($[Symbol.iterator]=function(){var e=this;return{next:function(){var t=e.getToken();return{done:t.type===H.eof,value:t}}}}),$.nextToken=function(){var e=this.curContext();if((!e||!e.preserveSpace)&&this.skipSpace(),this.start=this.pos,this.options.locations&&(this.startLoc=this.curPosition()),this.pos>=this.input.length)return this.finishToken(H.eof);if(e.override)return e.override(this);this.readToken(this.fullCharCodeAtPos())},$.readToken=function(e){return isIdentifierStart(e,this.options.ecmaVersion>=6)||e===92?this.readWord():this.getTokenFromCode(e)},$.fullCharCodeAt=function(e){var t=this.input.charCodeAt(e);if(t<=55295||t>=56320)return t;var n=this.input.charCodeAt(e+1);return n<=56319||n>=57344?t:(t<<10)+n-56613888},$.fullCharCodeAtPos=function(){return this.fullCharCodeAt(this.pos)},$.skipBlockComment=function(){var e=this.options.onComment&&this.curPosition(),t=this.pos,n=this.input.indexOf(`*/`,this.pos+=2);if(n===-1&&this.raise(this.pos-2,`Unterminated comment`),this.pos=n+2,this.options.locations)for(var r=void 0,i=t;(r=nextLineBreak(this.input,i,this.pos))>-1;)++this.curLine,i=this.lineStart=r;this.options.onComment&&this.options.onComment(!0,this.input.slice(t+2,n),t,this.pos,e,this.curPosition())},$.skipLineComment=function(e){for(var t=this.pos,n=this.options.onComment&&this.curPosition(),r=this.input.charCodeAt(this.pos+=e);this.pos<this.input.length&&!isNewLine(r);)r=this.input.charCodeAt(++this.pos);this.options.onComment&&this.options.onComment(!1,this.input.slice(t+e,this.pos),t,this.pos,n,this.curPosition())},$.skipSpace=function(){loop:for(;this.pos<this.input.length;){var e=this.input.charCodeAt(this.pos);switch(e){case 32:case 160:++this.pos;break;case 13:this.input.charCodeAt(this.pos+1)===10&&++this.pos;case 10:case 8232:case 8233:++this.pos,this.options.locations&&(++this.curLine,this.lineStart=this.pos);break;case 47:switch(this.input.charCodeAt(this.pos+1)){case 42:this.skipBlockComment();break;case 47:this.skipLineComment(2);break;default:break loop}break;default:if(e>8&&e<14||e>=5760&&up.test(String.fromCharCode(e)))++this.pos;else break loop}}},$.finishToken=function(e,t){this.end=this.pos,this.options.locations&&(this.endLoc=this.curPosition());var n=this.type;this.type=e,this.value=t,this.updateContext(n)},$.readToken_dot=function(){var e=this.input.charCodeAt(this.pos+1);if(e>=48&&e<=57)return this.readNumber(!0);var t=this.input.charCodeAt(this.pos+2);return this.options.ecmaVersion>=6&&e===46&&t===46?(this.pos+=3,this.finishToken(H.ellipsis)):(++this.pos,this.finishToken(H.dot))},$.readToken_slash=function(){var e=this.input.charCodeAt(this.pos+1);return this.exprAllowed?(++this.pos,this.readRegexp()):e===61?this.finishOp(H.assign,2):this.finishOp(H.slash,1)},$.readToken_mult_modulo_exp=function(e){var t=this.input.charCodeAt(this.pos+1),n=1,r=e===42?H.star:H.modulo;return this.options.ecmaVersion>=7&&e===42&&t===42&&(++n,r=H.starstar,t=this.input.charCodeAt(this.pos+2)),t===61?this.finishOp(H.assign,n+1):this.finishOp(r,n)},$.readToken_pipe_amp=function(e){var t=this.input.charCodeAt(this.pos+1);return t===e?this.options.ecmaVersion>=12&&this.input.charCodeAt(this.pos+2)===61?this.finishOp(H.assign,3):this.finishOp(e===124?H.logicalOR:H.logicalAND,2):t===61?this.finishOp(H.assign,2):this.finishOp(e===124?H.bitwiseOR:H.bitwiseAND,1)},$.readToken_caret=function(){return this.input.charCodeAt(this.pos+1)===61?this.finishOp(H.assign,2):this.finishOp(H.bitwiseXOR,1)},$.readToken_plus_min=function(e){var t=this.input.charCodeAt(this.pos+1);return t===e?t===45&&!this.inModule&&this.input.charCodeAt(this.pos+2)===62&&(this.lastTokEnd===0||U.test(this.input.slice(this.lastTokEnd,this.pos)))?(this.skipLineComment(3),this.skipSpace(),this.nextToken()):this.finishOp(H.incDec,2):t===61?this.finishOp(H.assign,2):this.finishOp(H.plusMin,1)},$.readToken_lt_gt=function(e){var t=this.input.charCodeAt(this.pos+1),n=1;return t===e?(n=e===62&&this.input.charCodeAt(this.pos+2)===62?3:2,this.input.charCodeAt(this.pos+n)===61?this.finishOp(H.assign,n+1):this.finishOp(H.bitShift,n)):t===33&&e===60&&!this.inModule&&this.input.charCodeAt(this.pos+2)===45&&this.input.charCodeAt(this.pos+3)===45?(this.skipLineComment(4),this.skipSpace(),this.nextToken()):(t===61&&(n=2),this.finishOp(H.relational,n))},$.readToken_eq_excl=function(e){var t=this.input.charCodeAt(this.pos+1);return t===61?this.finishOp(H.equality,this.input.charCodeAt(this.pos+2)===61?3:2):e===61&&t===62&&this.options.ecmaVersion>=6?(this.pos+=2,this.finishToken(H.arrow)):this.finishOp(e===61?H.eq:H.prefix,1)},$.readToken_question=function(){var e=this.options.ecmaVersion;if(e>=11){var t=this.input.charCodeAt(this.pos+1);if(t===46){var n=this.input.charCodeAt(this.pos+2);if(n<48||n>57)return this.finishOp(H.questionDot,2)}if(t===63)return e>=12&&this.input.charCodeAt(this.pos+2)===61?this.finishOp(H.assign,3):this.finishOp(H.coalesce,2)}return this.finishOp(H.question,1)},$.readToken_numberSign=function(){var e=this.options.ecmaVersion,t=35;if(e>=13&&(++this.pos,t=this.fullCharCodeAtPos(),isIdentifierStart(t,!0)||t===92))return this.finishToken(H.privateId,this.readWord1());this.raise(this.pos,`Unexpected character '`+codePointToString(t)+`'`)},$.getTokenFromCode=function(e){switch(e){case 46:return this.readToken_dot();case 40:return++this.pos,this.finishToken(H.parenL);case 41:return++this.pos,this.finishToken(H.parenR);case 59:return++this.pos,this.finishToken(H.semi);case 44:return++this.pos,this.finishToken(H.comma);case 91:return++this.pos,this.finishToken(H.bracketL);case 93:return++this.pos,this.finishToken(H.bracketR);case 123:return++this.pos,this.finishToken(H.braceL);case 125:return++this.pos,this.finishToken(H.braceR);case 58:return++this.pos,this.finishToken(H.colon);case 96:if(this.options.ecmaVersion<6)break;return++this.pos,this.finishToken(H.backQuote);case 48:var t=this.input.charCodeAt(this.pos+1);if(t===120||t===88)return this.readRadixNumber(16);if(this.options.ecmaVersion>=6){if(t===111||t===79)return this.readRadixNumber(8);if(t===98||t===66)return this.readRadixNumber(2)}case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:return this.readNumber(!1);case 34:case 39:return this.readString(e);case 47:return this.readToken_slash();case 37:case 42:return this.readToken_mult_modulo_exp(e);case 124:case 38:return this.readToken_pipe_amp(e);case 94:return this.readToken_caret();case 43:case 45:return this.readToken_plus_min(e);case 60:case 62:return this.readToken_lt_gt(e);case 61:case 33:return this.readToken_eq_excl(e);case 63:return this.readToken_question();case 126:return this.finishOp(H.prefix,1);case 35:return this.readToken_numberSign()}this.raise(this.pos,`Unexpected character '`+codePointToString(e)+`'`)},$.finishOp=function(e,t){var n=this.input.slice(this.pos,this.pos+t);return this.pos+=t,this.finishToken(e,n)},$.readRegexp=function(){for(var e,t,n=this.pos;;){this.pos>=this.input.length&&this.raise(n,`Unterminated regular expression`);var r=this.input.charAt(this.pos);if(U.test(r)&&this.raise(n,`Unterminated regular expression`),e)e=!1;else{if(r===`[`)t=!0;else if(r===`]`&&t)t=!1;else if(r===`/`&&!t)break;e=r===`\\`}++this.pos}var i=this.input.slice(n,this.pos);++this.pos;var a=this.pos,o=this.readWord1();this.containsEsc&&this.unexpected(a);var s=this.regexpState||=new RegExpValidationState(this);s.reset(n,i,o),this.validateRegExpFlags(s),this.validateRegExpPattern(s);var c=null;try{c=new RegExp(i,o)}catch{}return this.finishToken(H.regexp,{pattern:i,flags:o,value:c})},$.readInt=function(e,t,n){for(var r=this.options.ecmaVersion>=12&&t===void 0,i=n&&this.input.charCodeAt(this.pos)===48,a=this.pos,o=0,s=0,c=0,l=t??1/0;c<l;++c,++this.pos){var u=this.input.charCodeAt(this.pos),d=void 0;if(r&&u===95){i&&this.raiseRecoverable(this.pos,`Numeric separator is not allowed in legacy octal numeric literals`),s===95&&this.raiseRecoverable(this.pos,`Numeric separator must be exactly one underscore`),c===0&&this.raiseRecoverable(this.pos,`Numeric separator is not allowed at the first of digits`),s=u;continue}if(d=u>=97?u-97+10:u>=65?u-65+10:u>=48&&u<=57?u-48:1/0,d>=e)break;s=u,o=o*e+d}return r&&s===95&&this.raiseRecoverable(this.pos-1,`Numeric separator is not allowed at the last of digits`),this.pos===a||t!=null&&this.pos-a!==t?null:o},$.readRadixNumber=function(e){var t=this.pos;this.pos+=2;var n=this.readInt(e);return n??this.raise(this.start+2,`Expected number in radix `+e),this.options.ecmaVersion>=11&&this.input.charCodeAt(this.pos)===110?(n=stringToBigInt(this.input.slice(t,this.pos)),++this.pos):isIdentifierStart(this.fullCharCodeAtPos())&&this.raise(this.pos,`Identifier directly after number`),this.finishToken(H.num,n)},$.readNumber=function(e){var t=this.pos;!e&&this.readInt(10,void 0,!0)===null&&this.raise(t,`Invalid number`);var n=this.pos-t>=2&&this.input.charCodeAt(t)===48;n&&this.strict&&this.raise(t,`Invalid number`);var r=this.input.charCodeAt(this.pos);if(!n&&!e&&this.options.ecmaVersion>=11&&r===110){var i=stringToBigInt(this.input.slice(t,this.pos));return++this.pos,isIdentifierStart(this.fullCharCodeAtPos())&&this.raise(this.pos,`Identifier directly after number`),this.finishToken(H.num,i)}n&&/[89]/.test(this.input.slice(t,this.pos))&&(n=!1),r===46&&!n&&(++this.pos,this.readInt(10),r=this.input.charCodeAt(this.pos)),(r===69||r===101)&&!n&&(r=this.input.charCodeAt(++this.pos),(r===43||r===45)&&++this.pos,this.readInt(10)===null&&this.raise(t,`Invalid number`)),isIdentifierStart(this.fullCharCodeAtPos())&&this.raise(this.pos,`Identifier directly after number`);var a=stringToNumber(this.input.slice(t,this.pos),n);return this.finishToken(H.num,a)},$.readCodePoint=function(){var e=this.input.charCodeAt(this.pos),t;if(e===123){this.options.ecmaVersion<6&&this.unexpected();var n=++this.pos;t=this.readHexChar(this.input.indexOf(`}`,this.pos)-this.pos),++this.pos,t>1114111&&this.invalidStringToken(n,`Code point out of bounds`)}else t=this.readHexChar(4);return t},$.readString=function(e){for(var t=``,n=++this.pos;;){this.pos>=this.input.length&&this.raise(this.start,`Unterminated string constant`);var r=this.input.charCodeAt(this.pos);if(r===e)break;r===92?(t+=this.input.slice(n,this.pos),t+=this.readEscapedChar(!1),n=this.pos):r===8232||r===8233?(this.options.ecmaVersion<10&&this.raise(this.start,`Unterminated string constant`),++this.pos,this.options.locations&&(this.curLine++,this.lineStart=this.pos)):(isNewLine(r)&&this.raise(this.start,`Unterminated string constant`),++this.pos)}return t+=this.input.slice(n,this.pos++),this.finishToken(H.string,t)},_m={},$.tryReadTemplateToken=function(){this.inTemplateElement=!0;try{this.readTmplToken()}catch(e){if(e===_m)this.readInvalidTemplateToken();else throw e}this.inTemplateElement=!1},$.invalidStringToken=function(e,t){if(this.inTemplateElement&&this.options.ecmaVersion>=9)throw _m;this.raise(e,t)},$.readTmplToken=function(){for(var e=``,t=this.pos;;){this.pos>=this.input.length&&this.raise(this.start,`Unterminated template`);var n=this.input.charCodeAt(this.pos);if(n===96||n===36&&this.input.charCodeAt(this.pos+1)===123)return this.pos===this.start&&(this.type===H.template||this.type===H.invalidTemplate)?n===36?(this.pos+=2,this.finishToken(H.dollarBraceL)):(++this.pos,this.finishToken(H.backQuote)):(e+=this.input.slice(t,this.pos),this.finishToken(H.template,e));if(n===92)e+=this.input.slice(t,this.pos),e+=this.readEscapedChar(!0),t=this.pos;else if(isNewLine(n)){switch(e+=this.input.slice(t,this.pos),++this.pos,n){case 13:this.input.charCodeAt(this.pos)===10&&++this.pos;case 10:e+=`
`;break;default:e+=String.fromCharCode(n)}this.options.locations&&(++this.curLine,this.lineStart=this.pos),t=this.pos}else++this.pos}},$.readInvalidTemplateToken=function(){for(;this.pos<this.input.length;this.pos++)switch(this.input[this.pos]){case`\\`:++this.pos;break;case`$`:if(this.input[this.pos+1]!==`{`)break;case"`":return this.finishToken(H.invalidTemplate,this.input.slice(this.start,this.pos));case`\r`:this.input[this.pos+1]===`
`&&++this.pos;case`
`:case`\u2028`:case`\u2029`:++this.curLine,this.lineStart=this.pos+1}this.raise(this.start,`Unterminated template`)},$.readEscapedChar=function(e){var t=this.input.charCodeAt(++this.pos);switch(++this.pos,t){case 110:return`
`;case 114:return`\r`;case 120:return String.fromCharCode(this.readHexChar(2));case 117:return codePointToString(this.readCodePoint());case 116:return`	`;case 98:return`\b`;case 118:return`\v`;case 102:return`\f`;case 13:this.input.charCodeAt(this.pos)===10&&++this.pos;case 10:return this.options.locations&&(this.lineStart=this.pos,++this.curLine),``;case 56:case 57:if(this.strict&&this.invalidStringToken(this.pos-1,`Invalid escape sequence`),e){var n=this.pos-1;this.invalidStringToken(n,`Invalid escape sequence in template string`)}default:if(t>=48&&t<=55){var r=this.input.substr(this.pos-1,3).match(/^[0-7]+/)[0],i=parseInt(r,8);return i>255&&(r=r.slice(0,-1),i=parseInt(r,8)),this.pos+=r.length-1,t=this.input.charCodeAt(this.pos),(r!==`0`||t===56||t===57)&&(this.strict||e)&&this.invalidStringToken(this.pos-1-r.length,e?`Octal literal in template string`:`Octal literal in strict mode`),String.fromCharCode(i)}return isNewLine(t)?(this.options.locations&&(this.lineStart=this.pos,++this.curLine),``):String.fromCharCode(t)}},$.readHexChar=function(e){var t=this.pos,n=this.readInt(16,e);return n===null&&this.invalidStringToken(t,`Bad character escape sequence`),n},$.readWord1=function(){this.containsEsc=!1;for(var e=``,t=!0,n=this.pos,r=this.options.ecmaVersion>=6;this.pos<this.input.length;){var i=this.fullCharCodeAtPos();if(isIdentifierChar(i,r))this.pos+=i<=65535?1:2;else if(i===92){this.containsEsc=!0,e+=this.input.slice(n,this.pos);var a=this.pos;this.input.charCodeAt(++this.pos)!==117&&this.invalidStringToken(this.pos,`Expecting Unicode escape sequence \\uXXXX`),++this.pos;var o=this.readCodePoint();(t?isIdentifierStart:isIdentifierChar)(o,r)||this.invalidStringToken(a,`Invalid Unicode escape`),e+=codePointToString(o),n=this.pos}else break;t=!1}return e+this.input.slice(n,this.pos)},$.readWord=function(){var e=this.readWord1(),t=H.name;return this.keywords.test(e)&&(t=cp[e]),this.finishToken(t,e)},vm=`8.19.0`,Parser.acorn={Parser,version:vm,defaultOptions:vp,Position,SourceLocation,getLineInfo,Node,TokenType,tokTypes:H,keywordTypes:cp,TokContext,tokContexts:Y,isIdentifierChar,isIdentifierStart,Token,isNewLine,lineBreak:U,lineBreakG:lp,nonASCIIwhitespace:up}})))()}function buildCodeModeScriptParseSource(e){return{source:`(async () => {
${e}\n})`,codeOffset:15}}function parseCodeModeScriptSyntax(e){let{source:t}=buildCodeModeScriptParseSource(e);try{return{ok:!0,program:parse(t,{ecmaVersion:`latest`})}}catch(e){let t=e;return{ok:!1,message:t.message.replace(/ \(\d+:\d+\)$/u,``),line:t.loc.line-1,column:t.loc.column}}}function init_code_mode_script_syntax(){return(init_code_mode_script_syntax=__esmMin((()=>{init_acorn()})))()}function parsesAsGuestJavaScript(e,t=``){try{return new c(`(async () => {\n${t}${e}\n})`)instanceof c}catch{return!1}}function hasHoistedGuestBinding(e,t){return!parsesAsGuestJavaScript(e,`let ${t};\n`)&&parsesAsGuestJavaScript(e,`var ${t};\n`)}function stripShellEnvAssignments(e){let t=/[A-Za-z_]\w*=/uy;if(!t.test(e))return e;let n=new Uint32Array(e.length+3),r=new Uint32Array(e.length+3),i=new Uint32Array(e.length+3),a=0,o=0;for(let s=e.length-1;s>=t.lastIndex;--s){let t=e[s],c=t===` `||t===`	`,l=/\s/u.test(t),u=c?a||o:t===`
`?a:t===`\r`&&e[s+1]===`
`?o:0;c||(a=l?0:s,o=u);let d=t===`\\`&&s+1<e.length&&!/[\r\n\u2028\u2029]/u.test(e[s+1]),f=s+(d&&e.codePointAt(s+1)>65535?3:2);r[s]=(d?r[f]:0)||(t===`"`?n[s+1]:r[s+1]),i[s]=t===`'`?n[s+1]:i[s+1],n[s]=(t===`"`?r[s+1]:0)||(t===`'`?i[s+1]:0)||(d?n[f]:0)||(!l&&t!==`;`&&t!==`&`&&t!==`|`?n[s+1]:0)||u}let s=0;do{let e=n[t.lastIndex];if(!e)break;s=e,t.lastIndex=e}while(t.test(e));return e.slice(s)}function isShellLikeCodeModeSource(e){let t=e.trim();if(t.startsWith(`#!`))return!0;let n=t.replace(Om,``);if(!n||ym.test(n))return!1;if(Em.test(n))return!0;let r=stripShellEnvAssignments(n),i=Sm.exec(r),a=Cm.exec(r),o=i??(a&&!bm.test(a[1]??``)&&!xm.test(a[1]??``)?a:null);if(!o&&!wm.test(r))return!1;let s=o?r.slice(o[0].length):``,c=s.trimStart();if(o&&!c)return i!==null;if(!parsesAsGuestJavaScript(e))return!0;let l=o?.[1];return l&&hasHoistedGuestBinding(e,l)?!1:/^[\t ]*(?:[;\r\n]|&&?|\|{1,2})/u.test(s)?i!==null:!(!o||!Tm.test(c)&&!(i!==null&&Dm.test(c))&&!(l===`jq`&&c.startsWith(`.`)))}var ym,bm,xm,Sm,Cm,wm,Tm,Em,Dm,Om,km;function init_code_mode_shell_source(){return(init_code_mode_shell_source=__esmMin((()=>{ym=/^export\s+(?:(?:abstract|as|async|class|const|declare|default|enum|function|import|interface|let|namespace|type|var)\b|[={*])/u,bm=/^(?:abstract|as|async|await|break|case|catch|class|const|continue|debugger|declare|default|delete|do|else|enum|export|extends|false|finally|for|function|if|implements|import|in|instanceof|interface|let|namespace|new|null|of|private|protected|public|return|satisfies|static|super|switch|this|throw|true|try|typeof|undefined|var|void|while|with|yield)$/u,xm=/^(?:API|MCP|AggregateError|Array|ArrayBuffer|BigInt|BigInt64Array|BigUint64Array|Boolean|DataView|Date|Error|EvalError|Float32Array|Float64Array|Function|Infinity|Int16Array|Int32Array|Int8Array|Intl|JSON|Map|Math|NaN|Number|Object|Promise|Proxy|RangeError|ReferenceError|Reflect|RegExp|Set|String|Symbol|SyntaxError|TypeError|URIError|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|WeakMap|WeakSet|catalog|clearTimeout|console|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|globalThis|isFinite|isNaN|json|nodes|parseFloat|parseInt|setTimeout|skills|text|yield_control)$/u,Sm=/^(?:\/(?:usr\/(?:local\/)?)?bin\/)?(alias|apt|awk|bash|bg|brew|builtin|bun|cargo|cat|cd|chmod|cmd|command|cp|curl|cut|date|declare|df|dir|docker|dotnet|du|echo|env|exec|exit|export|fg|file|find|getopts|git|go|gradle|grep|hash|head|help|hostname|id|java|javac|jobs|jq|kill|kubectl|ln|local|logout|ls|make|mkdir|mvn|mv|node|npm|npx|perl|php|pip|pip3|pnpm|poetry|popd|powershell|printf|ps|pushd|pwd|pwsh|pytest|python|python3|read|readonly|rg|rm|ruby|rustc|rustup|sed|set|sh|shift|sleep|sort|source|stat|sudo|swift|systemctl|tail|tar|tee|test|touch|trap|tree|type|ulimit|umask|uname|uniq|unset|unzip|uv|uvx|vitest|wait|wc|wget|which|whoami|xargs|yarn|zip|zsh)(?=$|[\s;&|<>])/u,Cm=/^([A-Za-z_][\w-]*)(?=$|[\s;&|<>])/u,wm=/^(?:(?:\.{1,2}|~)[\\/]|\/|[A-Za-z]:[\\/])[^\s;|&()]+(?=$|[\t \r\n;&|])/u,Tm=/^(?:-{1,2}[a-z\d][\w-]*(?:[\t =;&|]|$)|(?:(?:\.{1,2}|~)[\\/]|\/|[A-Za-z]:[\\/])[^\s]+)/iu,Em=/^(?:(?:if|elif|while|until)[\t ]+(?:\[{1,2}(?=[\t ]|$)|test\b|[A-Za-z_][\w-]*(?=[\t ;]))|for[\t ]+(?:[A-Za-z_]\w*[\t ]+in\b|\(\([^\r\n]*\)\)[\t ]*;[\t ]*do\b)|case[\t ]+\S+[\t ]+in\b|function[\t ]+[A-Za-z_][\w-]*[\t ]*\{)/u,Dm=/^(?:\d*(?:>>?|<<?)|&>>?)/u,Om=/^(?:(?:\/\/[^\r\n]*(?:\r?\n|$)|\/\*[\s\S]*?\*\/|#[^\r\n]*(?:\r?\n|$))[\t \r\n]*)+/u,km=`code-mode exec runs JavaScript, not shell commands. Call an enabled async tool global from guest JavaScript; use catalog.search(query) when the bounded quick index omits it. Do not retry the same shell command as code.`})))()}var Am,ToolInputError;function init_tool_input_error(){return(init_tool_input_error=__esmMin((()=>{Am=/* @__PURE__ */ new WeakSet,ToolInputError=class extends Error{constructor(e){super(e),this.status=400,this.name=`ToolInputError`,Am.add(this)}}})))()}function isModuleLoaderCallee(e){if(e.type===`ParenthesizedExpression`||e.type===`ChainExpression`)return isModuleLoaderCallee(e.expression);if(e.type===`SequenceExpression`){let t=e.expressions[e.expressions.length-1];return t!==void 0&&isModuleLoaderCallee(t)}return e.type===`Identifier`&&e.name===`require`}function containsModuleAccess(e){if(e.type===`ImportExpression`||e.type===`CallExpression`&&isModuleLoaderCallee(e.callee))return!0;for(let t of Object.values(e))for(let e of Array.isArray(t)?t:[t])if(typeof e==`object`&&e&&`type`in e&&typeof e.type==`string`&&containsModuleAccess(e))return!0;return!1}function prepareSource(e){let t=parseCodeModeScriptSyntax(e);if(isShellLikeCodeModeSource(e))throw new ToolInputError(km);if(!t.ok){let e=truncateUtf16Safe(t.message,240);throw new ToolInputError(`SyntaxError at openclaw-code-mode:user.js:${t.line}:${t.column+1}: ${e}. No tools were dispatched; correct the JavaScript source and submit it again.`)}if((e.includes(`import`)||e.includes(`require`)||e.includes(`\\u`))&&containsModuleAccess(t.program))throw new ToolInputError(jm);return e}var jm;function init_code_mode_source(){return(init_code_mode_source=__esmMin((()=>{init_code_mode_script_syntax(),init_code_mode_shell_source(),init_tool_input_error(),jm=`code mode module access is disabled. Call an enabled async tool global from guest JavaScript; use catalog.search(query) when the bounded quick index omits it. Do not retry the same source with require() or an import.`})))()}function isBridgeMethod(e){return Fm.has(e)}function compileController(e){return new c(e,{filename:`openclaw-code-mode:controller.js`})}function evaluate(e,t){if(e.deadline-performance.now()<=0)throw Error(`code mode timeout exceeded`);return t.runInContext(e.context)}function sourceFrames(e,t){return normalizeSourceStack(e,t)?.split(`
`).filter(e=>e.includes(`openclaw-code-mode:user.js`)&&/^\s+at /u.test(e))??[]}function guestError(e,t){if(!o.isNativeError(e))return String(e);let n=sourceFrames(e.stack,t);if(n.length===0&&e.name===`SyntaxError`){let r=/^openclaw-code-mode:user\.js:(\d+)\n[^\n]*\n([ \t]*)\^/u.exec(e.stack??``),i=r?.[1],a=r?.[2];i!==void 0&&a!==void 0&&n.push(...sourceFrames(`    at ${Zf}:${i}:${a.length+1}`,t))}return[`${e.name}: ${e.message}`,...n].join(`
`)}function createCell(e,t,n,r,i){let a=performance.now(),o=Math.min(n+e.config.timeoutMs,a+(e.executionTimeoutMs??1/0));if(o<=a)throw Error(`code mode timeout exceeded`);let s=buildUserSource(t,e.prelude,`utf16`),u=l(Object.create(null),{microtaskMode:`afterEvaluate`}),d={context:u,config:e.config,location:s.location,pendingRequests:[],canceledRequestIds:[],replyIndex:0,rejections:/* @__PURE__ */ new Map,deadline:o,progress:r};return Mm=d,u.__openclawNodeTextEncoder=TextEncoder,u.__openclawNodeTextDecoder=TextDecoder,u.__openclawHostRequest=(e,t,n,r)=>{if(d.pendingRequests.length>=d.config.maxPendingToolCalls)throw d.admissionError=`too many pending code mode tool calls`,Error(d.admissionError);if(!isBridgeMethod(e))throw Error(`unsupported code mode bridge method`);let i=JSON.parse(t);if(!Array.isArray(i))throw Error(`invalid code mode bridge arguments: expected an array`);if(!n.startsWith(`bridge:${e}:`)||!/^bridge:[A-Za-z]+:[1-9]\d*$/u.test(n))throw Error(`invalid code mode bridge id`);if(d.pendingRequests.some(e=>e.id===n))throw Error(`duplicate code mode bridge id`);return d.pendingRequests.push({id:n,method:e,args:i}),sourceFrames(typeof r==`string`?r.slice(0,8192):``,d.location).join(`
`)},u.__openclawHostCancelRequest=e=>{let t=d.pendingRequests.findIndex(t=>t.id===e);t>=0&&(d.pendingRequests.splice(t,1),d.canceledRequestIds.push(e))},u.__openclawHostTakeBridgeReply=()=>{let e=d.replies?.[d.replyIndex];if(!e)return;d.replyIndex++;let t={__proto__:null,id:e.id,ok:e.ok,json:e.json};return e.json=``,t},u.__openclawHostObserveNetworkContent=()=>{d.networkContentObserved=!0,d.progress.observeNetworkContent()},u.__openclawHostOutput=e=>d.progress.append(e),u.__openclawNodeInit=new TextDecoder().decode(e.initialization),u.__openclawNodeMaxPending=e.config.maxPendingToolCalls,u.__openclawNodeFinish=(e,t)=>{d.outcome={ok:e,json:t}},r.deadline=performance.timeOrigin+o,i?.(),evaluate(d,Im),evaluate(d,new c(s.source,{filename:Zf})),evaluate(d,zm),d}function settle(e,t){e.replies=t,e.replyIndex=0;try{evaluate(e,Lm)}finally{e.replies=void 0,e.replyIndex=0;for(let e of t)e.json=``;t.length=0}}function formatGuestFailure(e,t){let n=JSON.parse(t);return n.bridgeCode===null&&n.name===`ReferenceError`&&/^(?:require|module|process) is not defined$/u.test(n.message)?{code:`invalid_input`,error:jm}:{code:n.bridgeCode??`internal_error`,...n.bridgeCode===null?{}:{failurePhase:`bridge`},error:[`${n.name}: ${n.message}`,...sourceFrames(n.stack,e.location)].join(`
`)}}function failed(e,t,n=Yf,r){return{status:`failed`,code:e,error:t,output:n,failurePhase:r??(e===`invalid_input`?`input`:`guest`),bridgeDispatchStarted:!1}}async function run(e,t){let r=Yf,i=t?.consumeInput,consume=()=>{let e=i;i=void 0,e?.()},a=e.config,c=performance.now(),l=new CodeModeNodeProgress(e.progress);try{let o=e.kind===`exec`?createCell(e,prepareSource(e.source),c,l,consume):Mm;if(!o)throw Error(`code mode continuation is no longer available`);for(e.kind===`resume`&&(o.progress=l,o.config=a,o.deadline=performance.now()+a.timeoutMs,l.deadline=performance.timeOrigin+o.deadline,o.networkContentObserved&&l.observeNetworkContent(),o.pendingRequests=e.pendingRequests??[],o.canceledRequestIds=[],settle(o,e.settledRequests));;){consume();let c=o.admissionError??evaluate(o,Rm);if(c!==void 0&&typeof c!=`string`)throw Error(`invalid code mode admission error`);if(c)throw new ToolInputError(c);await n(),r=l.output();let u=!o.outcome;if(u&&o.pendingRequests.length===0)throw Error(`code mode promise is pending without host work`);if(u||o.pendingRequests.length>0){let n=u?{kind:`awaiting`}:{kind:`draining`,requiredRequestIds:o.pendingRequests.map(e=>e.id)},c={pendingRequests:o.pendingRequests,canceledRequestIds:o.canceledRequestIds,settlementMode:n,output:r,memoryUsedBytes:s().used_heap_size,...o.networkContentObserved?{networkContentObserved:!0}:{}};if(!t||!e.inlineHost)return{status:`waiting`,...c,continuation:void 0};let l=await t.request({status:`boundary`,...c});r=Yf,i=l.consumed;let d=l.input;if(d.kind===`checkpoint`)return consume(),{status:`waiting`,...c,continuation:void 0,output:Yf};if(d.kind!==`continue`)throw Error(`invalid code mode continuation`);if(!Number.isFinite(d.timeoutMs)||d.timeoutMs<=0||d.timeoutMs>a.timeoutMs)throw Error(`code mode timeout exceeded`);o.deadline=performance.now()+d.timeoutMs,o.pendingRequests=d.pendingRequests,o.canceledRequestIds=[],settle(o,d.settledRequests);continue}let d=o.outcome,f=d.ok?void 0:d.json;if(d.ok&&o.rejections.size>0&&(o.context.__openclawNodeRejection=o.rejections.values().next().value,f=String(evaluate(o,Bm))),f!==void 0){let e=formatGuestFailure(o,f);return t?.notify({status:`failure`,error:JSON.parse(f),failurePhase:e.failurePhase??`guest`}),failed(e.code,boundCodeModeError(e.error,a.maxOutputBytes),r,e.failurePhase)}return{status:`completed`,output:r,value:captureCodeModeValue(JSON.parse(d.json),a.maxOutputBytes,e.retainFinalValue?Math.min(a.memoryLimitBytes,a.maxSnapshotBytes):a.maxOutputBytes)}}}catch(e){t?.notify({status:`failure`,error:o.isNativeError(e)?{name:e.name,message:e.message,stack:e.stack}:String(e),failurePhase:`guest`});let n=o.isNativeError(e)&&e.message===`code mode timeout exceeded`;return Mm&&r.count===0&&!n&&(r=l.output()),failed(n?`timeout`:e instanceof ToolInputError?`invalid_input`:`internal_error`,boundCodeModeError(n?`code mode timeout exceeded`:Mm?guestError(e,Mm.location):e instanceof Error?e.message:String(e),a.maxOutputBytes),n?l.output():r)}finally{consume()}}var Mm,Nm,Pm,Fm,Im,Lm,Rm,zm,Bm;function init_code_mode_node_worker(){return(init_code_mode_node_worker=__esmMin((()=>{init_gc_observer(),init_worker_task_server$1(),init_code_mode_controller_source(),init_code_mode_json(),init_code_mode_node_progress(),init_code_mode_source_location(),init_code_mode_source(),init_tool_input_error(),process.on(`unhandledRejection`,(e,t)=>Mm?.rejections.set(t,e)),process.on(`rejectionHandled`,e=>Mm?.rejections.delete(e)),Nm=performance.now(),Pm=0,observeGcSamples(e=>{for(let t of e)t.kind===`mark_sweep_compact`&&Pm++;let t=performance.now(),n=t-Nm;if(!(n<1e3)){if(Pm>=n/50){let e=s();if(e.used_heap_size>=e.heap_size_limit*.85)throw Object.assign(/* @__PURE__ */ Error(`Code Mode worker stopped after sustained garbage collection near its JavaScript heap limit`),{code:`ERR_CODE_MODE_GC_THRASH`})}Nm=t,Pm=0}}),Fm=/* @__PURE__ */ new Set([`search`,`describe`,`callValue`,`resultSave`,`resultLoad`,`resultDelete`,`nodes`,`yield`,`namespace`,`agentSpawn`,`agentWait`,`skillsList`,`skillsSearch`,`skillsRead`,`sleep`,`swarmNote`]),Im=compileController(String.raw`
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
    ${Kf}

    (() => {
      const finish = globalThis.__openclawNodeFinish;
      delete globalThis.__openclawNodeFinish;
      const stringify = JSON.stringify;
      const string = String;
      const encodeError = (error) => {
        const bridgeCode = __openclawBridgeFailureCode(error) ?? null;
        const diagnostic = (read, fallback) => {
          try { return read(); } catch { return fallback; }
        };
        // Guest error properties may throw; recorded bridge identity must still reach finish.
        const stack = diagnostic(() => error?.stack, "");
        // Provenance records contain primitives and never inherit guest toJSON hooks.
        return stringify({
          __proto__: null,
          bridgeCode,
          name: diagnostic(() => string(error?.name ?? "Error"), "Error"),
          message: diagnostic(() => string(error?.message ?? error), "Error"),
          stack: typeof stack === "string" ? stack : "",
        });
      };
      Object.defineProperties(globalThis, {
        __openclawNodeEncodeError: { value: encodeError },
        __openclawNodeObserveResult: { value: (result) => {
          result.then(value => finish(true, value), error => finish(false, encodeError(error)));
        }},
      });
    })();
  `),Lm=compileController(`__openclawSettleBridge()`),Rm=compileController(`(() => {
    const error = __openclawAdmissionError();
    if (!error) __openclawDrainQueuedRequests();
    return error;
  })()`),zm=compileController(`__openclawNodeObserveResult(__openclawResult)`),Bm=compileController(`(() => {
    const error = __openclawNodeRejection;
    delete globalThis.__openclawNodeRejection;
    return __openclawNodeEncodeError(error);
  })()`),serveWorkerTasks(async(e,t)=>{if(!isRecord(e)||!isRecord(e.config)||e.kind!==`exec`&&e.kind!==`resume`)return failed(`invalid_input`,`invalid code mode worker input`);let n=await run(e,t);return Mm?.networkContentObserved&&(n.networkContentObserved=!0),n.status!==`waiting`&&(Mm=void 0),n},{idleGc:!1})})))()}init_code_mode_node_worker();export{};