import{_ as e,c as t,d as n,f as r,i,m as a,n as o,r as s,s as c,x as l,y as u}from"./control-ui-file.worker-worker-diagnostic-script-BlMTMrY5.mjs";import{c as d,d as f,g as p,i as m,l as h,m as g,n as _,r as v,s as y,t as b,u as x}from"./control-ui-file.worker-subsystem-DJTMz2eT.mjs";import{r as S}from"./control-ui-file.worker-runtime-process-manifest-BNtrgdg-.mjs";import{$ as C,A as w,B as ee,C as T,D as te,E,F as D,G as ne,H as O,I as re,J as ie,K as ae,L as oe,M as se,N as ce,O as k,P as A,Q as le,R as ue,S as de,T as fe,U as pe,V as me,W as j,X as he,Y as M,Z as ge,_ as _e,a as ve,at as ye,b as be,c as xe,d as Se,et as Ce,f as we,g as Te,h as Ee,i as De,it as Oe,j as N,k as P,l as F,m as ke,n as Ae,nt as je,o as Me,p as Ne,q as Pe,r as Fe,rt as Ie,s as Le,t as Re,tt as ze,u as Be,v as Ve,w as He,x as Ue,y as We,z as I}from"./control-ui-file.worker.js";import{i as Ge,t as Ke}from"./control-ui-file.worker-runtime-binary-CqhYZJ9B.mjs";import{i as qe,n as Je,r as Ye,t as L}from"./control-ui-file.worker-deferred-DTp5bnvu.mjs";import{createRequire as Xe}from"node:module";import{BroadcastChannel as Ze,MessageChannel as R,SHARE_ENV as Qe,Worker as $e,getEnvironmentData as z,isMainThread as et,receiveMessageOnPort as B,setEnvironmentData as tt,threadId as V}from"node:worker_threads";import{AsyncLocalStorage as H,AsyncResource as nt}from"node:async_hooks";import{createHash as rt,randomBytes as it,randomUUID as at}from"node:crypto";import U,{existsSync as ot,opendirSync as st,readFileSync as W,readdirSync as ct,readlinkSync as lt,statSync as ut}from"node:fs";import G,{rm as dt}from"node:fs/promises";import ft,{availableParallelism as pt,tmpdir as mt}from"node:os";import K,{basename as ht,join as gt,posix as _t}from"node:path";import{fileURLToPath as q,pathToFileURL as vt}from"node:url";import"@openclaw/fs-safe/path";import{isDeepStrictEqual as yt,stripVTControlCharacters as bt,toUSVString as xt}from"node:util";import{deserialize as St,serialize as Ct}from"node:v8";import{channel as wt}from"node:diagnostics_channel";import"node:perf_hooks";import{setTimeout as Tt}from"node:timers/promises";import{readRootJsonObjectSync as Et}from"@openclaw/fs-safe/json";import{readProcessIdentity as Dt}from"@openclaw/proc-safe/identity";import Ot,{execFile as kt,spawn as At,spawnSync as jt}from"node:child_process";import{ProcSafeError as Mt}from"@openclaw/proc-safe/errors";import{listProcesses as Nt}from"@openclaw/proc-safe/inspect";import{Buffer as Pt}from"node:buffer";import{parse as Ft}from"semver";import{Socket as J,connect as It}from"node:net";import"@openclaw/proc-safe/reaper";import{EventEmitter as Lt}from"node:events";resolveRuntimeProcessDistRoot(q(import.meta.url));function resolveRuntimeProcessDistRoot(e){let t=e.replaceAll(K.sep,`/`).lastIndexOf(`/dist/`);return t>=0?e.slice(0,t+6):void 0}function resolveRuntimeWorkerUrl(e){if(e.root!==void 0)return vt(K.join(e.root,`dist`,e.distWorkerPath));let t=q(e.currentModuleUrl),n=resolveRuntimeProcessDistRoot(t);if(n!==void 0){let t=e.distWorkerPath;if(e.package){let r=K.resolve(n,`..`),i=Et({rootDir:r,relativePath:`package.json`,boundaryLabel:`runtime worker package`,rejectHardlinks:!1});if(!i.ok)throw Error(`Cannot resolve runtime worker package: ${r}/package.json`);i.value.name===e.package.name&&(t=e.package.distWorkerPath)}return vt(K.join(n,t))}let r=e.sourceExtension??(K.extname(t)||`.js`);return new URL(`./${e.sourceWorkerName}${r}`,e.currentModuleUrl)}function isBunTargetRuntime(e){return e===process.execPath?!!process.versions.bun:Ke(e)}function resolveRuntimeArgs(e=process.execPath){return isBunTargetRuntime(e)?[`--no-install`]:[]}function runtimeNeedsTypeScriptLoader(e,t=process.execPath){return/\.[cm]?ts$/.test(e)&&!isBunTargetRuntime(t)}function resolveRuntimeWorkerArgv(e,t=process.execPath){let n=q(e);return runtimeNeedsTypeScriptLoader(n,t)?[`--import`,import.meta.resolve(`tsx`),n]:[...resolveRuntimeArgs(t),n]}function resolveRuntimeWorkerThreadExecArgv(e,t=process.execPath){return typeof SEALED_RUNTIME_BUILD==`boolean`&&SEALED_RUNTIME_BUILD?[]:e.protocol===`file:`&&runtimeNeedsTypeScriptLoader(q(e),t)?[`--import`,import.meta.resolve(`tsx/esm`)]:[]}function notifyListeners(e,t,n){for(let r of e)try{r(t)}catch(e){n?.(e)}}function registerListener(e,t){return e.add(t),()=>e.delete(t)}function resolveEnvironmentValue(e,t,n=process.platform){if(!e)return;if(n!==`win32`)return e[t]??(t===`PATH`?e.Path:void 0);let r=t.toUpperCase(),i=Object.keys(e).toSorted().find(e=>e.toUpperCase()===r);return i===void 0?void 0:e[i]}function mergeProcessEnv(e,t=process.platform){let n=Object.create(null),r=/* @__PURE__ */ new Map;for(let i of e){if(!i)continue;let e=Object.keys(i),a=/* @__PURE__ */ new Set;for(let o of t===`win32`?e.toSorted():e){let e=t===`win32`?o.toUpperCase():void 0;if(e!==void 0){if(a.has(e))continue;a.add(e);let t=r.get(e);t!==void 0&&delete n[t],r.delete(e)}let s=i[o];s===void 0?delete n[o]:(n[o]=s,e!==void 0&&Object.hasOwn(n,o)&&r.set(e,o))}}return n}const Rt=/* @__PURE__ */ new Set(/* @__PURE__ */ `PATH.Path.HOME.USER.LOGNAME.TMPDIR.TMP.TEMP.LANG.LANGUAGE.TZ.LC_ALL.LC_COLLATE.LC_CTYPE.LC_MESSAGES.LC_MONETARY.LC_NUMERIC.LC_TIME.LC_ADDRESS.LC_IDENTIFICATION.LC_MEASUREMENT.LC_NAME.LC_PAPER.LC_TELEPHONE.SYSTEMROOT.WINDIR.COMSPEC.PATHEXT.SYSTEMDRIVE.USERPROFILE.HOMEDRIVE.HOMEPATH.USERNAME.USERDOMAIN.APPDATA.LOCALAPPDATA.PROGRAMDATA.ALLUSERSPROFILE.PROGRAMFILES.PROGRAMFILES(X86).PROGRAMW6432.COMMONPROGRAMFILES.COMMONPROGRAMFILES(X86).COMMONPROGRAMW6432.PSMODULEANALYSISCACHEPATH`.split(`.`));function resolveDiagnosticProcessEnv(e=process.env,t=process.platform){return Object.fromEntries(Object.entries(mergeProcessEnv([e],t)).filter(([e])=>Rt.has(t===`win32`?e.toUpperCase():e)))}const zt=`C:\\Windows`;function readNativeProcessStartTime(e){if(!(process.platform!==`win32`||typeof SEALED_RUNTIME_BUILD==`boolean`&&SEALED_RUNTIME_BUILD))try{let t=Dt(e);return t&&!t.exited?Math.floor(t.startTimeMicros/1e3):null}catch{return}}function windowsSystemRoot(e){let t=resolveEnvironmentValue(e,`SystemRoot`,`win32`)??resolveEnvironmentValue(e,`WINDIR`,`win32`);if(!t)return zt;let n=K.win32.normalize(t);return/^[A-Za-z]:\\/.test(n)&&!n.startsWith(`\\\\`)?n:zt}function windowsPowerShellPath(e){return K.win32.join(windowsSystemRoot(e),`System32`,`WindowsPowerShell`,`v1.0`,`powershell.exe`)}function windowsWmicPath(e){return K.win32.join(windowsSystemRoot(e),`System32`,`wbem`,`wmic.exe`)}function decodeWindowsProcessOutput(e){return Buffer.isBuffer(e)?e.length>=2&&e[0]===255&&e[1]===254?e.toString(`utf16le`):e.toString(`utf8`):e}function parseWindowsProcessStartTime(e){let t=decodeWindowsProcessOutput(e).split(/\r?\n/).map(e=>e.trim()).filter(Boolean),n=t.find(e=>e.toLowerCase().startsWith(`creationdate=`))?.slice(13).trim()??t.find(e=>e.toLowerCase()!==`creationdate`)??``,r=Date.parse(n);if(Number.isFinite(r))return r;let i=n.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.(\d{6})([+-])(\d{3})$/);if(!i)return null;let[,a,o,s,c,l,u,d,f,p]=i;return Date.UTC(Number(a),Number(o)-1,Number(s),Number(c),Number(l),Number(u),Math.floor(Number(d)/1e3))-Number(p)*6e4*(f===`+`?1:-1)}function readWindowsProcessStartTimeSync(e,t=1e4,n=process.env){if(!Number.isInteger(e)||e<=0||e>4294967295)return null;let r=performance.now()+t,i=readNativeProcessStartTime(e);if(i!==void 0)return i;let a=Math.ceil(r-performance.now());if(a<=0)return null;let o=jt(windowsPowerShellPath(n),[`-NoProfile`,`-NonInteractive`,`-Command`,`$process = [System.Diagnostics.Process]::GetProcessById(${e}); try { [Console]::Out.Write($process.StartTime.ToUniversalTime().ToString("o")) } finally { $process.Dispose() }`],{encoding:`utf8`,env:resolveDiagnosticProcessEnv(n,`win32`),timeout:Math.min(a,5e3),windowsHide:!0});if(!o.error&&o.status===0){let e=parseWindowsProcessStartTime(o.stdout);if(e!==null)return e}let s=Math.ceil(r-performance.now());if(s<=0)return null;let c=jt(windowsWmicPath(n),[`process`,`where`,`ProcessId=${e}`,`get`,`CreationDate`,`/value`],{env:resolveDiagnosticProcessEnv(n,`win32`),timeout:s,windowsHide:!0,stdio:[`ignore`,`pipe`,`ignore`]});return!c.error&&c.status===0?parseWindowsProcessStartTime(c.stdout):null}let Bt;function loadFreeBsdProcessIdentityNative(){if(typeof SEALED_RUNTIME_BUILD==`boolean`&&SEALED_RUNTIME_BUILD)throw Error(`FreeBSD process identity is unavailable in this sealed runtime`);return Bt||=Xe(import.meta.url)(`@openclaw/proc-safe/identity`),Bt}function readFreeBsdProcessStartTime(e){if(process.platform!==`freebsd`||!Number.isInteger(e)||e<=0||e>2147483647)return null;try{return loadFreeBsdProcessIdentityNative().readProcessIdentity(e)?.startTimeSinceBootMicros??null}catch{return null}}function readDarwinNativeIdentity(e){if(!(process.platform!==`darwin`||typeof SEALED_RUNTIME_BUILD==`boolean`&&SEALED_RUNTIME_BUILD))try{let t=Dt(e);return t&&!t.exited?{startedAt:Math.floor(t.startTimeMicros/1e6),startTimeMicros:t.startTimeMicros}:null}catch{return}}function readNativeLiveness(e){if(!(![`darwin`,`win32`,`freebsd`].includes(process.platform)||typeof SEALED_RUNTIME_BUILD==`boolean`&&SEALED_RUNTIME_BUILD))try{let t=Dt(e);return t!==null&&!t.exited}catch(e){return e instanceof Mt&&(e.code===`helper-unavailable`||e.code===`unsupported-platform`)?void 0:!0}}let Vt=null;function isValidPid(e){return Number.isInteger(e)&&e>0}function hasLinuxProcfs(){return process.platform===`linux`||process.platform===`android`}function exitedLinuxStatus(e,t){let n=t.match(/^State:\s+(\S)/m)?.[1],r=t.match(/^Threads:[ \t]+(\d+)[ \t]*$/m)?.[1];if(r===`0`)return;let i=t.match(/^Tgid:[ \t]+(\d+)[ \t]*$/m)?.[1];return i!==void 0&&Number(i)!==e||(n===`Z`||n===`X`)&&r===`1`}function isMissingPid(e){try{process.kill(e,0)}catch(e){return c(e,`ESRCH`)}return!1}function isExitedLinuxProcess(e){if(!hasLinuxProcfs())return!1;try{let t=exitedLinuxStatus(e,U.readFileSync(`/proc/${e}/status`,`utf8`));if(t!==void 0)return t}catch{}return isMissingPid(e)}async function isPidDefinitelyDeadAsync(e){if(!hasLinuxProcfs())return isPidDefinitelyDead(e);if(!isValidPid(e))return!0;try{process.kill(e,0)}catch(e){return c(e,`ESRCH`)}try{let t=exitedLinuxStatus(e,await U.promises.readFile(`/proc/${e}/status`,`utf8`));if(t!==void 0)return t}catch{}return isMissingPid(e)}function isPidDefinitelyDead(e){if(!isValidPid(e))return!0;let n=!1;try{process.kill(e,0)}catch(e){let r=t(e)?e.code:void 0;if(r!==`ESRCH`&&(process.platform!==`win32`||r!==`EPERM`))return!1;n=r===`ESRCH`}let r=readNativeLiveness(e);return r===void 0?n&&process.platform!==`freebsd`||isExitedLinuxProcess(e):!r}function getDarwinProcessStartTime(e,t,n){let r=performance.now(),i=readDarwinNativeIdentity(e);if(i!==void 0)return i?.startedAt??null;let a=n===void 0?1e3:Math.ceil(n-(performance.now()-r));if(a<=0)return null;try{let n=Ot.execFileSync(`/bin/ps`,[`-o`,`lstart=`,`-p`,String(e)],{encoding:`utf8`,env:{...resolveDiagnosticProcessEnv(t),LC_ALL:`C`,TZ:`UTC`},stdio:[`ignore`,`pipe`,`ignore`],timeout:a,killSignal:`SIGKILL`}).trim(),r=Date.parse(`${n} UTC`);return Number.isFinite(r)?Math.floor(r/1e3):null}catch{return null}}function parseLinuxProcessStat(e,t){let n=t.lastIndexOf(`)`);if(n<0||!t.startsWith(`${e} (`))return null;let r=t.slice(n+1).trimStart().split(/\s+/),i=Number(r[19]),a=Number(r[1]);return Number.isSafeInteger(i)&&i>=0&&Number.isSafeInteger(a)&&a>=0?{parentPid:a,startedAt:i}:null}function readLinuxProcessStat(e){if(!isValidPid(e)||!hasLinuxProcfs())return null;try{return parseLinuxProcessStat(e,U.readFileSync(`/proc/${e}/stat`,`utf8`))}catch{return null}}function getProcessStartTime(e){return readLinuxProcessStat(e)?.startedAt??null}function getProcessInstanceStartTime(e){if(!isValidPid(e))return null;if(hasLinuxProcfs()){let t=getProcessStartTime(e);return Number.isSafeInteger(t)?t:null}let t=readDarwinNativeIdentity(e);if(!t)return null;let n=t.startTimeMicros;return Number.isSafeInteger(n)?n:null}function getFileLockProcessStartTime(e,t=process.env,n){if(!isValidPid(e))return null;let r=e===process.pid;if(r&&Vt!==null)return Vt;let i=process.platform===`darwin`?getDarwinProcessStartTime(e,t,n):process.platform===`win32`?readWindowsProcessStartTimeSync(e,n,t):process.platform===`freebsd`?readFreeBsdProcessStartTime(e):getProcessStartTime(e);return r&&i!==null&&(Vt=i),i}var DarwinProcessInspectionError=class extends Error{constructor(e,t){super(`Darwin process inspection ${e}`,t),this.reason=e,this.name=`DarwinProcessInspectionError`,this.code=e===`deadline`?`ETIMEDOUT`:e===`permission`?`EPERM`:`EIO`}};function failure(e){if(e instanceof DarwinProcessInspectionError)return e;let t=e&&typeof e==`object`&&`code`in e?e.code:void 0;return new DarwinProcessInspectionError(t===`ETIMEDOUT`||t===`ABORT_ERR`||t===`timeout`?`deadline`:[`EACCES`,`EPERM`,`ERR_ACCESS_DENIED`,`access-denied`].includes(String(t))?`permission`:`unavailable`,{cause:e})}function remaining(e){let t=Math.floor(e-performance.now());if(t<=0)throw new DarwinProcessInspectionError(`deadline`);return t}const Ht={running:`R`,sleeping:`S`,stopped:`T`,zombie:`Z`,idle:`I`,unknown:`?`};function hasReadableTopology(e){if(e.parentPid===void 0||e.processGroupId===void 0||e.state===void 0){if(Dt(e.pid)===null)return!1;throw new DarwinProcessInspectionError(`unavailable`)}return!0}function topology(e){return{pid:e.pid,ppid:e.parentPid,pgid:e.processGroupId,state:Ht[e.state],owner:e.owner}}function census(e,t){try{let n=Nt({timeoutMs:remaining(e),...t?{pids:t}:{}}).filter(hasReadableTopology);return remaining(e),n}catch(t){throw remaining(e),failure(t)}}function*readDarwinProcessCensus(e){let t=performance.now()+e,n=census(t).map(topology);for(let e of n)remaining(t),yield e;remaining(t)}function readLinuxProcessUid(e){try{let t=W(`/proc/${e}/status`,`utf8`).split(`
`).filter(e=>e.startsWith(`Uid:`)),n=(t.length===1?/^Uid:[ \t]+(\d+)[ \t]+(\d+)[ \t]+(\d+)[ \t]+(\d+)[ \t]*$/.exec(t[0]):null)?.slice(1).map(Number),r=process.getuid?.();return n?.every(e=>Number.isSafeInteger(e)&&e<=4294967295)?n.find(e=>e===r)??n[0]:void 0}catch{return}}function parseLinuxProcessGroupMember(e,t){let n=/^(\d+) \([\s\S]*\) (\S) (\d+) (-1|\d+)(?:\s|$)/.exec(t);if(!n||Number(n[1])!==e)throw Error(`Process group census is unavailable`);return{pid:e,ppid:Number(n[3]),pgid:Number(n[4]),state:n[2]}}async function readLinuxProcessGroupMemberAsync(e){let t=await G.readFile(`/proc/${e}/stat`,`utf8`);return{...parseLinuxProcessGroupMember(e,t),startedAt:parseLinuxProcessStat(e,t)?.startedAt??null}}function*readProcessGroupMembers(e,t){let r=t!==void 0;if(process.platform===`linux`){let t=Date.now()+e;for(let e of ct(`/proc`)){if(Date.now()>=t)throw Error(`Process group census exceeded its deadline`);if(!/^\d+$/.test(e))continue;let i=Number(e),a,o,s,c=!1;try{if(a=W(`/proc/${e}/stat`,`utf8`),r){s=readLinuxProcessUid(i);try{o=W(`/proc/${e}/cmdline`,`utf8`).split(`\0`).filter(Boolean)}catch(e){let t=process.getuid?.();if(c=s!==void 0&&t!==void 0&&s!==t&&[`EACCES`,`EPERM`].includes(n(e)??``),!c)throw e}}}catch(e){if(i!==process.pid&&[`ENOENT`,`ESRCH`].includes(n(e)??``))continue;throw Error(`Could not classify PID ${i}: process command inspection failed (${n(e)??`unavailable`}).`,{cause:e})}let l=parseLinuxProcessGroupMember(i,a);if(Date.now()>=t)throw Error(`Process group census is unavailable`);if(o?.length===0){let e=Number(a.slice(a.lastIndexOf(`)`)+2).split(/\s+/)[6]);if(!(Number.isInteger(e)&&e&2097152)&&!isPidDefinitelyDead(i)){let e=process.getuid?.();if(s!==void 0&&e!==void 0&&s!==e)c=!0,o=void 0;else throw Error(`Could not classify PID ${i}: live userspace process has no readable arguments.`)}}yield{pid:i,pgid:l.pgid,state:l.state,...o?{command:{ppid:l.ppid,argv:o,...s===void 0?{}:{uid:s}}}:c&&s!==void 0?{command:{ppid:l.ppid,argvUnavailable:!0,uid:s}}:{}}}if(Date.now()>=t)throw Error(`Process group census exceeded its deadline`);return}if(process.platform===`darwin`){for(let n of readDarwinProcessCensus(e)){let e={pid:n.pid,pgid:n.pgid,state:n.state},i;try{i=r?n.state.startsWith(`Z`)||n.pid===0?{argv:[]}:t?.readDarwinCommand(n.pid,n.owner):void 0}catch(t){if(!(t instanceof Mt)||t.code!==`incomplete`&&t.code!==`layout-mismatch`)throw t;yield{...e,ppid:n.ppid};continue}(!r||i)&&(yield{...e,...i?{command:{ppid:n.ppid,owner:n.owner,...i}}:{}})}return}if(r)throw Error(`Exact process command census is unavailable on ${process.platform}.`);let i=Date.now()+e,a=jt(`/bin/ps`,[`-A`,`-o`,`pid=,pgid=,stat=`],{encoding:`utf8`,timeout:e,maxBuffer:4194304});if(a.error||a.status!==0)throw Error(`Process group census is unavailable`);for(let e of a.stdout.split(`
`)){if(!e.trim())continue;let t=/^\s*(\d+)\s+(\d+)\s+(\S+)\s*$/.exec(e);if(!t)throw Error(`Process group census is unavailable`);let n=Number(t[1]);n!==a.pid&&(yield{pid:n,pgid:Number(t[2]),state:t[3]})}if(r&&Date.now()>=i)throw Error(`Process group census exceeded its deadline`)}function isLiveCensusMember({pid:e,state:t}){return!t.startsWith(`Z`)||process.platform===`linux`&&!isPidDefinitelyDead(e)}function isOwnProcfs(){if(process.platform!==`linux`)return!0;try{return lt(`/proc/self`)===String(process.pid)}catch{return!1}}function isProcessGroupGoneByCensus(e){if(!isOwnProcfs())return!1;try{for(let t of readProcessGroupMembers(1e3))if(t.pgid===e&&isLiveCensusMember(t))return!1;return!0}catch{return!1}}async function*readLinuxProcessGroupMembersAsync(e){if(process.platform!==`linux`)throw Error(`Asynchronous Linux process census requires Linux`);let t=Date.now()+e;for(let e of await G.readdir(`/proc`)){if(Date.now()>=t)throw Error(`Process group census exceeded its deadline`);if(!/^\d+$/.test(e))continue;let r=Number(e),i;try{i=await G.readFile(`/proc/${e}/stat`,`utf8`)}catch(e){if(r!==process.pid&&[`ENOENT`,`ESRCH`].includes(n(e)??``))continue;throw e}if(Date.now()>=t)throw Error(`Process group census exceeded its deadline`);yield parseLinuxProcessGroupMember(r,i)}if(Date.now()>=t)throw Error(`Process group census exceeded its deadline`)}async function isOwnProcfsAsync(){if(process.platform!==`linux`)return!0;try{return await G.readlink(`/proc/self`)===String(process.pid)}catch{return!1}}async function isProcessGroupGoneByCensusAsync(e){if(!await isOwnProcfsAsync())return!1;try{for await(let t of readLinuxProcessGroupMembersAsync(1e3))if(t.pgid===e&&(!t.state.startsWith(`Z`)||!await isPidDefinitelyDeadAsync(t.pid)))return!1;return!0}catch{return!1}}function realpathExistingAncestorSync(e){let t=[],n=e;for(;;)try{return K.join(U.realpathSync.native(n),...t.toReversed())}catch{let e=K.dirname(n);if(e===n)return;t.push(K.basename(n)),n=e}}async function realpathExistingAncestor(e){let t=[],n=e;for(;;)try{return K.join(await G.realpath(n),...t.toReversed())}catch{let e=K.dirname(n);if(e===n)return;t.push(K.basename(n)),n=e}}function resolveIdentityPathViaExistingAncestorSync(e){let t=K.resolve(e);return realpathExistingAncestorSync(t)??t}async function resolveIdentityPathViaExistingAncestor(e){let t=K.resolve(e);return await realpathExistingAncestor(t)??t}function canAccessSync(e,t){try{return U.accessSync(e,t),!0}catch{return!1}}function formatErrorMessage(e){return r(e,{redact:v})}const Ut=/* @__PURE__ */ new Map;function resolveRuntimeProcessEntrypointUrl(e){return Ut.get(e)??resolveRuntimeWorkerUrl(Ge[e])}function createWorkerComputeCapacity(e){if(!Number.isSafeInteger(e)||e<1)throw RangeError(`compute capacity must be a positive safe integer`);let t=/* @__PURE__ */ new Set,n=/* @__PURE__ */ new Set,r=/* @__PURE__ */ new Set,i=0,a=0,o=!1,canAdmit=e=>i<128&&a+e<=268435456,requestCheckpoints=()=>{let e=n.size;if(e){for(let n of t)if(n.requestCheckpoint()&&--e===0)break}},drain=()=>{if(!o){o=!0;try{for(;t.size<e&&n.size;){let e=n.values().next().value;n.delete(e),e()}}finally{o=!1}requestCheckpoints()}};return{getSnapshot:()=>({limit:e,active:t.size,waitingPools:n.size,pendingTasks:i,pendingBytes:a}),canAdmit,subscribeAdmission(e){return r.add(e),()=>r.delete(e)},admit(e){return canAdmit(e)?(i++,a+=e,!0):!1},finish(e){i--,a-=e;for(let e of r)e()},acquire(r,i){if(t.size>=e||!o&&n.size){n.add(r),requestCheckpoints();return}let a={requestCheckpoint:i};return t.add(a),a},release(e){t.delete(e),drain()},remove(e){n.delete(e)},requestCheckpoints}}var WorkerTaskError=class extends Error{constructor(e,t,n){super(e,n),this.code=t,this.name=`WorkerTaskError`,this.capacityAvailable=n?.capacityAvailable}};function workerTaskUnavailableError(e,t,n,r=e.task){let i=e.ready===!1?`startup`:r?.exchange?`exchange`:`running`;return new WorkerTaskError(t+(r?.diagnosticLabel?` [task=${r.diagnosticLabel} admittedInputBytes=${r.inputBytes} exchanges=${r.exchangeSequence} stage=${i}]`:``),`unavailable`,{cause:n})}function workerTaskRetirementError(e,t){return e?AggregateError([e,t],`Worker retirement failed: ${a(t,`worker retirement failed`).message}; task failed: ${e.message}`,{cause:t}):t}function workerTaskTimeoutError(e,t){let n=e?.sent===!1?e.name:void 0;n===`unknown`&&(n=t.protocol===`file:`?t.pathname.split(`/`).at(-1)?.slice(0,96)||`worker`:`${t.protocol} worker`);let r=new WorkerTaskError(n?`worker task timed out waiting for host callback ${n}`:`worker task timed out`,`timeout`);return n&&process.emitWarning(r.message,{code:`WORKER_HOST_CALLBACK_TIMEOUT`}),r}function enqueueWorkerTask(e,t){let n=t.options.pointRead?e.findIndex(e=>!e.options.pointRead):-1;e.splice(n===-1?e.length:n,0,t)}var WorkerTaskAdmission=class{constructor(e,t,n){this.maxPendingTasks=e,this.maxPendingBytes=t,this.shared=n,this.taskCount=0,this.byteCount=0,this.closed=!1,this.waiters=/* @__PURE__ */ new Map,this.notify=()=>{for(let[e,t]of this.waiters)(this.closed||this.taskCount<this.maxPendingTasks&&this.byteCount+e<=this.maxPendingBytes&&(!this.shared||this.shared.canAdmit(e)))&&(this.waiters.delete(e),t.resolve());this.waiters.size||(this.stopWatchingCapacity?.(),this.stopWatchingCapacity=void 0)};for(let[n,r]of Object.entries({maxPendingTasks:e,maxPendingBytes:t}))if(!Number.isSafeInteger(r)||r<1)throw RangeError(`${n} must be a positive safe integer`)}get pendingTasks(){return this.taskCount}get pendingBytes(){return this.byteCount}admitTask(e,t){let{pointRead:n,onRequest:r,onRequestSync:i}=e.options;if(n)return r||i?/* @__PURE__ */ TypeError(`Point reads carry their facts and cannot call back into the host`):void 0;let a=this.admit(e.inputBytes,t);return e.admitted=a===void 0,a}admit(e,t){let n;if(this.taskCount>=this.maxPendingTasks)n=`pool pending tasks: pendingTasks=${this.taskCount} maxPendingTasks=${this.maxPendingTasks} inputBytes=${e}`;else if(this.byteCount+e>this.maxPendingBytes)n=`pool pending bytes: pendingBytes=${this.byteCount} maxPendingBytes=${this.maxPendingBytes} inputBytes=${e}`;else if(this.shared&&!this.shared.admit(e)){let{pendingTasks:t,pendingBytes:r}=this.shared.getSnapshot();n=t>=128?`shared compute pending tasks: pendingTasks=${t} maxPendingTasks=128 inputBytes=${e}`:`shared compute pending bytes: pendingBytes=${r} maxPendingBytes=268435456 inputBytes=${e}`}else{this.taskCount++,this.byteCount+=e;return}let r=t();return new WorkerTaskError(`worker task capacity reached [${r?`task=${r} `:``}${n}]`,`overloaded`,{capacityAvailable:this.waitForCapacity(e)})}finish(e){this.taskCount--,this.byteCount-=e,this.shared?.finish(e),this.notify()}close(){this.closed=!0,this.notify()}waitForCapacity(e){if(e>this.maxPendingBytes||this.shared&&e>268435456)return;let t=this.waiters.get(e);if(t)return t.promise;let n=Promise.withResolvers();return this.waiters.set(e,n),this.stopWatchingCapacity??=this.shared?.subscribeAdmission(this.notify),this.notify(),n.promise}};function captureWorkerTaskContext(){let e=new nt(`OpenClaw.WorkerTask`);return t=>e.runInAsyncScope(t)}function serviceNativeWorkerPass(e,t){let n=[];for(let e of t)e.native&&n.push(e.native);e.serviceNativeWorkers(n)}function createWorkerTaskPoolBootstrap(e,t,n){let r,admissionError=()=>r&&![...e].some(e=>e.ready===!0&&!e.retiring&&!e.retirementFailed)?r:void 0,rejectQueued=()=>{let e=admissionError();if(!e)return;let r=t.splice(0);for(let t of r)n(t,e)};return{error:()=>r,get admissionError(){return admissionError()},fail(e){r??=e,rejectQueued()},rejectQueued,reset:()=>{r=void 0}}}function isPromiseLike(e){if(e===null||typeof e!=`object`&&typeof e!=`function`)return!1;try{return typeof e.then==`function`}catch{return!1}}function createWorkerHostExchange(e,t){let n=l(t)?t.kind??t.type:t;return e.exchange={id:++e.exchangeSequence,name:typeof n==`string`&&/^[a-zA-Z][a-zA-Z0-9._:-]{0,95}$/.test(n)?n:`unknown`,pressure:new AbortController,sent:!1,onConsumed:void 0}}function dispatchOwnedWorkerRequest(e,t,n,r,i){let a={signal:(e.controller??=new AbortController).signal,yieldSignal:r.pressure.signal},assertCurrent=()=>{if(e.done||t.task!==e)throw new WorkerTaskError(`worker task closed before host dispatch`,`unavailable`)};if(e.options.onRequestSync)try{assertCurrent(),i.accept(e.options.onRequestSync(n,a))}catch(e){i.reject(e)}else Promise.resolve().then(()=>(assertCurrent(),e.options.onRequest(n,a))).then(i.accept).catch(i.reject)}async function joinOwnedWorkerTasks(e){let t=(await Promise.allSettled(e)).flatMap(e=>e.status===`rejected`?[e.reason]:[]);if(t.length===1)throw t[0];if(t.length>1)throw AggregateError(t,`Worker task cleanup failed`)}function joinOwnedWorkerTask(e,t,n=!1){return startJoinOwnedWorkerTask(e,t,n).result}function startJoinOwnedWorkerTask(e,t,n){let r=startCloseOwnedWorkerTask(e,t,n),observe=()=>{let n=r.read();if(n.status===`pending`)return n;if(n.status===`rejected`&&e.owner?.closing===r&&(e.owner.closing=void 0),e.owner?.closed){let n=e.slot;e.slot=void 0,t.release(e,n)}return n},i=r.result.then(()=>{observe()},e=>{throw observe(),e});return i.catch(()=>void 0),{result:i,read:observe,service(){r.service(),observe()}}}function closeOwnedWorkerTask(e,t,n=!1){return startCloseOwnedWorkerTask(e,t,n).result}function startCloseOwnedWorkerTask(e,t,n){let r=e.owner;if(!r||r.closed){if(r?.closing)return r.closing;let e=F(()=>{});return e.resolve(),e.operation}if(r.retire||=n,r.closing)return r.closing;let i,a,o=!1,s=F(()=>{i?.service(),advance()}),advance=()=>{if(!(o||s.operation.read().status!==`pending`)){o=!0;try{if(e.preparation){a!==e.preparation.promise&&(a=e.preparation.promise,a.then(advance,s.reject));return}let n=e.slot;if(n&&r.retire){i||(i=t.retire(n),i.result.then(advance,advance));let e=i.read();if(e.status===`pending`)return;if(e.status===`rejected`)throw e.error}t.detach(e);try{r.complete?.()}finally{r.closed=!0,r.complete=void 0,r.onCloseError=void 0,e.input=void 0,e.options={},e.abort=()=>{}}s.resolve()}catch(e){r.onCloseError?.(e),s.reject(e)}finally{o=!1}}};return r.closing=s.operation,e.done||t.cancel(e),advance(),s.operation}function retainWorkerTask(e,t,n){return{result:e.promise,read:()=>e.read(),service:n,release:r=>{let i=startJoinOwnedWorkerTask(e,t,r?.retire===!0);return{result:i.result,read:()=>i.read(),service:()=>{n(),i.service()}}}}}function prepareWorkerTaskInput(e,t,n,r){let i=e.input;e.input=void 0;let a=Promise.withResolvers();e.preparation=a;let finishPreparation=()=>{a.resolve(),e.preparation===a&&(e.preparation=void 0)},failed=e=>{finishPreparation(),n(e)},o;try{o=typeof i==`function`?i():i}catch(e){failed(e);return}r&&(o=Promise.resolve(o).then(async e=>(await r(),e)));let ready=e=>{finishPreparation(),t(e)};isPromiseLike(o)?Promise.resolve(o).then(ready,failed):ready(o)}function armWorkerTaskTimeout(e,t,n,r){if(t===void 0||r&&(e.options.timeoutFrom??`enqueue`)!==r)return;clearTimeout(e.timer);let i=performance.now();e.deadline=Math.min(e.options.hostTimeout!==`owner`&&e.options.timeoutMs!==void 0?e.deadline??(e.options.timeoutFrom===`dispatch`?i:e.enqueuedAt)+p(e.options.timeoutMs,6e4):1/0,i+p(t,6e4)),e.timer=setTimeout(n,Math.max(0,e.deadline-i),e)}function expireWorkerTasks(e,t,n){let r=performance.now(),i=[...e,...[...t].flatMap(e=>e.task?[e.task]:[])];for(let e of i)!e.done&&e.deadline!==void 0&&r>=e.deadline&&n(e)}const Wt=wt(`openclaw.worker.task`);function joinWorkerTaskPreparationCleanups(e,t){return joinOwnedWorkerTasks([...[...e.preparationCleanups].map(([t,n])=>n.finally(()=>{e.preparationCleanups.delete(t)&&e.releaseAdmission(t)})),t.then(()=>void 0)])}function notifyExecutionSettled(e){try{e.executionNotified||(e.executionNotified=!0,e.options.onExecutionSettled?.({retired:e.slot?.retired===!0}))}catch(e){return a(e,`worker settlement receipt failed`)}}function createWorkerTaskCompletion(e,t,n,r){let i=e.slot,a=i?.native,o=a?.taskChannelFailure,s=i&&a&&o&&n&&(n===o||n.cause===o)?()=>{let t=a.terminalFailure;return t?workerTaskUnavailableError(i,String(t),t,e):a.executionStopped?workerTaskUnavailableError(i,`${o.message}; worker exited with code ${a.executionExitCode}`,o,e):n}:void 0;e.owner&&s&&(e.owner.onCloseError=t=>e.reject(workerTaskRetirementError(s(),t)));let c=e.owner?void 0:e.preparation,l,complete=()=>{!e.owner&&!c&&t.releaseAdmission(e);let i=s?.()??n;try{return completeWorkerTask(e,t,i,r,l)}finally{e.owner&&s&&e.reject(i)}};if(!c)return{complete,resolveFailure:s};let u=Promise.withResolvers();return t.preparationCleanups.set(e,u.promise),u.promise.catch(()=>void 0),{resolveFailure:s,complete:()=>{l=e.runInContext(()=>notifyExecutionSettled(e)),n&&e.reject(s?.()??n),c.promise.then(()=>{let n=complete();if(n)throw n;t.preparationCleanups.delete(e),t.releaseAdmission(e),u.resolve()}).catch(u.reject)}}}function completeWorkerTask(e,t,n,r,i){return e.runInContext(()=>{let o=n??i,s=i?[i]:[];try{e.inputConsumed||(e.inputConsumed=!0,e.options.onInputConsumed?.());let t=e.exchange?.onConsumed;e.exchange=void 0,t?.()}catch(e){let t=a(e,`worker input release failed`);s.push(t),o??=t}let c=notifyExecutionSettled(e);c&&(s.push(c),o??=c);let l=e.computePermit;if(e.computePermit=void 0,l&&t.releaseCompute(l),Wt.hasSubscribers){let n=performance.now();Wt.publish({...t.diagnostics(),outcome:o?`failed`:`ok`,queueMs:(e.startedAt??n)-e.enqueuedAt,preparationMs:e.startedAt===void 0?0:(e.preparedAt??n)-e.startedAt,runMs:e.preparedAt===void 0?0:n-e.preparedAt,transferMs:e.transferMs,hostWaitMs:e.hostWaitMs})}let u=s[0],d=s.length>1?AggregateError(s,`Worker task cleanup failed`,{cause:u}):u;if(e.owner){if(d)throw d}else o?e.reject(o):e.resolve(r);return d})}function startCloseWorkerPoolResources(e,t,n,r,i,a,o){let s=[...e].map(e=>{if(e.retiring)return e.retiring;if(e.native?.executionStopped)return n(e);let s=e.worker;if(!s){let e=F(()=>{});return e.resolve(),e.operation}let c=t.get(s)??{pending:0};return c.pending++,t.set(s,c),s.ref(),startCloseWorkerTaskResources(e,s,c,i,a,n,r,o)}),c=F(()=>{for(let e of s)e.service();advance()}),advance=()=>{let e=s.map(e=>e.read());if(e.some(e=>e.status===`pending`))return;let t=e.flatMap(e=>e.status===`rejected`?[e.error]:[]);t.length?c.reject(AggregateError(t,`Worker resource cleanup failed`)):c.resolve()};for(let e of s)e.result.then(advance,advance);return advance(),c.operation}function observeResourceWorkerExit(e,t,n){let r=t.exit;if(!r){let n=/* @__PURE__ */ new Set;r={waiters:n,receive:()=>{for(let e of n)e()}},t.exit=r,e.once(`exit`,r.receive)}return r.waiters.add(n),()=>{r.waiters.delete(n),r.waiters.size||(e.removeListener(`exit`,r.receive),t.exit===r&&(t.exit=void 0))}}function startCloseWorkerTaskResources(e,t,n,r,i,o,s,c){let{port1:u,port2:d}=s(()=>new R),f=H.snapshot(),p=!1,m=!1,h,g=F(()=>{if(p)return;for(e.native?.service(),e.native?.executionStopped&&(m=!0,h??=e.retiring??o(e));;){let e=B(u);if(!e||p)break;receive(e.message)}let t=h??e.retiring;if(m&&t){t.service();let e=t.read();e.status===`fulfilled`?finish():e.status===`rejected`&&finish(a(e.error,`Worker resource cleanup retirement failed`))}}),finish=r=>f(()=>{p||(p=!0,_(),u.close(),d.close(),n.pending--,n.pending||e.task||e.retiring||t.unref(),r?g.reject(r):g.resolve(),f=s)}),receive=e=>f(()=>{c?.();try{if(l(e)&&e.ok===!0){finish();return}let t=l(e)&&e.detail!==void 0&&i?.decodeResourceError?i.decodeResourceError(e.detail):Error(l(e)&&typeof e.error==`string`?e.error:`Invalid worker resource cleanup receipt`);finish(t)}catch(e){finish(a(e,`Worker resource cleanup receipt could not be decoded`))}}),_=observeResourceWorkerExit(t,n,()=>finish());u.once(`message`,receive),u.once(`messageerror`,e=>finish(a(e,`Worker resource cleanup receipt could not be decoded`))),u.once(`close`,()=>{if(p)return;let t=e.retiring;t?(m=!0,h=t,t.result.then(()=>finish(),e=>finish(a(e,`Worker resource cleanup retirement failed`)))):finish(/* @__PURE__ */ Error(`Worker resource cleanup closed without a receipt`))});try{t.postMessage({closeResource:!0,key:r,resourcePort:d},[d])}catch(e){finish(a(e,`Worker resource cleanup could not be sent`))}return g.operation}const Gt=3e5;function isWorkerIdleForPressure(e,t=!1){return e!==void 0&&(t||performance.now()-e>=1e3)}function createWorkerIdleTimers(e){let t=setTimeout,n=clearTimeout;return{clear(e){n(e.idleTimer),e.idleTimer=void 0},arm(n,r,i){n.idleTimer||(n.idleTimer=e(()=>t(()=>{n.idleTimer=void 0,i()},r)),n.idleTimer.unref())}}}function createWorkerTaskPoolRetirement({slots:e,options:t,retainOneIdleWorker:n,runInContext:r,dispatch:i,onRotationComplete:o,serviceDeadlines:s,markWorkerRetirement:c,serviceHost:l}){let u=/* @__PURE__ */ new Map,d=-1/0,f,p=-1/0,m,h,g=!1,_=createWorkerIdleTimers(r),v=performance.now.bind(performance),y=n?/* @__PURE__ */ new Set:void 0;function newestIdle(){if(!y)return;let e;for(let t of y)e=t;return e}function clearIdle(e){e.idleSince=void 0,y?.delete(e),_.clear(e)}let isBurstSlot=n=>{if(t.burstIdleTimeoutMs!==void 0){for(let t of e)if(!t.retiring&&!t.retirementFailed)return t!==n}return!1};function startRotate(){if(h)return h;let t=H.snapshot(),n,r,a=!1,c=F(()=>{serviceNativeWorkerPass(l,u),s();for(let e of n??[])e.service();r?.service(),advance()});h=c.operation,g=!1;let u=[...e],f=u.flatMap(e=>e.task?[e.task]:[]),advance=()=>t(()=>{if(!(a||c.operation.read().status!==`pending`)){a=!0;try{if(f.some(e=>e.read().status===`pending`))return;if(!n){n=u.map(e=>startRetire(e,`rotation`));for(let e of n)e.result.then(advance,advance)}for(let e of n){let t=e.read();if(t.status===`rejected`)throw t.error;if(t.status===`pending`)return}r||(r=startJoinArtifacts(),r.result.then(advance,advance));let e=r.read();if(e.status===`pending`)return;if(e.status===`rejected`)throw e.error;d=-1/0,p=-1/0,h=void 0,o(),c.resolve(),i()}catch(e){h=void 0,g=!0,c.reject(e)}finally{a=!1}}});for(let e of f)e.promise.then(advance,advance);return advance(),c.operation}function startRetire(n,a=`closed`){if(a===`idle_timeout`&&(isBurstSlot(n)?p=v():d=v()),f===n&&(f=void 0),m===n&&(m=void 0),n.worker&&c(n.worker,a),clearIdle(n),je(n.nativeSections),n.retiring)return n.retiring;let o=H.snapshot(),s,h,g=!1,_=!1,y=F(()=>{s?.service(),advance()}),advance=()=>o(()=>{if(!(_||y.operation.read().status!==`pending`)){_=!0;try{if(n.creating)return;if(!ze(n.nativeSections)){g||(g=!0,Promise.resolve(ye(n.nativeSections)).then(advance,y.reject));return}if(n.worker&&!s){c(n.worker,a);try{if(h===void 0&&(h=l.flushWorkerDiagnostics?.(n.worker,a)??null,h?.result.then(advance,advance)),h?.service(),h?.read().status===`pending`)return}catch{h=null}if(n.native)s=n.native.stop();else{let e=F(()=>{});s=e.operation,Promise.resolve().then(()=>n.worker.terminate()).then(()=>e.resolve(),e.reject)}if(l.workerStopped){let e=n.worker;s=Be(s,()=>{let t=F(()=>{}),n=l.workerStopped?.(e);return n?n.then(()=>t.resolve(),t.reject):t.resolve(),t.operation})}s.result.then(advance,advance)}let t=s?.read();if(t?.status===`pending`)return;if(t?.status===`rejected`)throw t.error;n.retired=!0;let o=n.releaseResources;o&&r(()=>{let e=(async()=>{try{await o()}catch(e){try{process.emitWarning(`Worker task resource release failed: ${String(e)}`)}catch{}}})(),t=F(()=>{});u.set(e,t.operation),e.then(()=>{u.delete(e),t.resolve()},t.reject)}),n.worker?.removeAllListeners(),e.delete(n);for(let e of n.completions??[])e();n.completions=void 0,i(),y.resolve()}catch(e){try{Promise.resolve(t.onRetirementFailure?.(e)).catch(()=>void 0)}catch{}n.retirementFailed=!0,n.retiring=void 0,y.reject(e)}finally{_=!1}}});return n.retiring=y.operation,Promise.resolve().then(advance),y.operation}function retire(e,t){return startRetire(e,t).result}function startJoinArtifacts(){let e=[...u.values()],t=F(()=>{for(let t of e)t.service();advance()}),advance=()=>{let n=e.map(e=>e.read()),r=n.find(e=>e.status===`rejected`);r?.status===`rejected`?t.reject(r.error):n.every(e=>e.status===`fulfilled`)&&t.resolve()};for(let t of e)t.result.then(advance,advance);return advance(),t.operation}async function retryFailedRetirements(){let t=await Promise.allSettled([...e].filter(e=>e.retirementFailed).map(e=>retire(e)));t.push(...await Promise.allSettled(u.keys()));let n=t.flatMap(e=>e.status===`rejected`?[a(e.reason,`worker retirement retry failed`)]:[]),r=n[0];if(r)throw n.length===1?r:AggregateError(n,`Worker retirement retries failed`,{cause:r})}function idle(e,n=0){let r=isBurstSlot(e),i=(r?t.burstIdleTimeoutMs:t.idleTimeoutMs)??6e4;if(e.idleSince??=v()-n,i<=0)return;if(y&&!y.has(e)){let t=newestIdle();y.add(e),t&&!t.idleTimer&&retire(t,`idle_timeout`).catch(()=>void 0)}!r&&!f&&v()-d<Gt&&(f=e),r&&(!m||!isBurstSlot(m))&&v()-p<Gt&&(m=e);let a=r?v():0,o=r?m===e?i*3:i:f===e?Math.max(i,Gt):i;_.arm(e,Math.max(0,o-n),()=>{newestIdle()!==e&&(r&&!isBurstSlot(e)?idle(e,v()-a):retire(e,`idle_timeout`).catch(()=>void 0))})}return{get preferredIdle(){return newestIdle()},get dispatchAllowed(){return h===void 0&&!g},startRotate,retire,startRetire,service(){let t=[...e];for(let e of t)e.retiring?.service();h?.service()},clearIdle,idle,retireIdle(t,n=!1){for(let r of e)!r.task&&!r.retiring&&!r.retirementFailed&&r.worker&&isWorkerIdleForPressure(r.idleSince,n)&&!t.get(r.worker)?.pending&&retire(r,`memory_pressure`).catch(()=>void 0)},retryFailedRetirements,joinArtifacts:()=>startJoinArtifacts().result}}function sendWorkerTaskInput(e){let{slot:t,task:n,input:r}=e;if(n.done)return;n.preparedAt=performance.now();let i=e.bootstrapError();if(i&&!t.worker)e.refuse(i);else try{let i=t.worker;if(!i){t.creating=!0;try{i=e.createWorker()}catch(t){e.fail(t,!0);return}finally{t.creating=!1}}let a=n.options.transferList?.(r);if(!n.done){let o=e.host.captureTaskContext(i),s=[...a??[],...e.host.taskContextTransferList?.(o)??[]],c=performance.now(),l=n.options.progressSignal;i.postMessage({input:r,taskId:n.id,interactive:!!(n.options.onRequest||n.options.onRequestSync||n.options.onNotification),nativeSections:t.nativeSections.buffer,...l?{progressSignal:l}:{},taskContext:o,sampleMemory:!0},s),n.transferMs+=performance.now()-c}}catch(t){e.fail(t)}}function createWorkerTaskPoolWorker(e){let{slot:t,options:n}=e,r=e.host.captureWorkerStartObserver?.(n.workerUrl),i=e.runInContext(()=>{let r=n.prepareWorker?.();t.releaseResources=r?.releaseResources;let i=r?.temporaryDirectory;if(i){let n=e.host.prepareResources(),r=t.releaseResources;t.releaseResources=async()=>{try{await n,await e.host.releaseTemporaryDirectory(i)}finally{await r?.()}}}let a=n.workerUrl,o={...n.workerOptions,...r?.options};e.host.requiresReady&&(t.ready=!1);let s=e.host.createWorker(a,o);return t.native=s.native,s.worker}),a=!1,started=()=>{a||(a=!0,e.onStarted(i),r?.(),r=void 0)};return t.native?(t.native.on(`started`,started),t.native.on(`execution-exit`,n=>{Oe(t.nativeSections),t.retiring||e.onFailure(e.unavailableError(`worker exited with code ${n}`),!0)})):started(),t.worker=i,i.on(`message`,n=>{if(e.host.receiveMessage(i,n))return;if(t.ready===!1){l(n)&&n.status===`ready`?t.ready=!0:e.onFailure(e.unavailableError(`worker task server did not become ready`),!0);return}let r=t.task;r?r.runInContext(()=>e.onMessage(n)):e.onMessage(n)}),i.on(`error`,t=>e.onFailure(e.unavailableError(String(t),t),!0)),i.on(`messageerror`,t=>e.onFailure(e.unavailableError(String(t),t))),i.once(`exit`,n=>{Oe(t.nativeSections);let r=a;a=!1,e.onExit(n,r)}),i}const Kt=H.snapshot(),qt=wt(`openclaw.memory.critical`);var WorkerTaskPoolCore=class{constructor(e,t,n,r={}){if(this.options=e,this.host=t,this.publicDispatch=n,this.ownerOptions=r,this.slots=/* @__PURE__ */ new Set,this.ownedTasks=/* @__PURE__ */ new Set,this.resourceClosures=/* @__PURE__ */ new WeakMap,this.ownedSettlement={cancel:e=>this.cancel(e,new WorkerTaskError(`worker task closed`,`unavailable`)),detach:e=>{e.slot?.task===e&&(e.slot.task=void 0,this.activeTasks--)},retire:e=>this.retirement.startRetire(e),release:(e,t)=>{this.ownedTasks.delete(e)&&(this.releaseAdmission(e),e.runInContext=Kt,this.dispatch(),t&&!e.owner?.retire&&!t.task&&!t.retiring&&this.idle(t))}},this.completion={preparationCleanups:/* @__PURE__ */ new Map,releaseAdmission:e=>this.releaseAdmission(e),releaseCompute:e=>this.computeCapacity.release(e),diagnostics:()=>({worker:this.options.workerUrl.pathname.split(`/`).at(-1),...this.publicDispatch?.getSnapshot()??this.getSnapshot(),pendingBytes:this.admission.pendingBytes})},this.queue=[],this.bootstrap=createWorkerTaskPoolBootstrap(this.slots,this.queue,(e,t)=>this.finish(e,t)),this.workers=0,this.workersCreated=0,this.activeTasks=0,this.resumeCompute=()=>this.dispatch(),this.nextTaskId=0,this.retireIdleOnPressure=e=>this.retirement.retireIdle(this.resourceClosures,e===!0),this.expireTasks=()=>expireWorkerTasks(this.queue,this.slots,this.timeout),this.retryFailedRetirements=()=>this.retirement.retryFailedRetirements(),this.timeout=e=>{e.done||this.cancel(e,workerTaskTimeoutError(e.exchange,this.options.workerUrl))},this.observeTask=t.createTaskObserver?.(e.workerUrl),this.maxWorkers=t.maxWorkers??e.maxWorkers??pt(),!Number.isSafeInteger(this.maxWorkers)||this.maxWorkers<1)throw RangeError(`maxWorkers must be a positive safe integer`);this.computeCapacity=e.sharedCompute?t.computeCapacity:void 0,this.admission=new WorkerTaskAdmission(e.maxPendingTasks??128,e.maxPendingBytes??268435456,this.computeCapacity),this.retirement=createWorkerTaskPoolRetirement({slots:this.slots,options:e,retainOneIdleWorker:r.retainOneIdleWorker,runInContext:Kt,dispatch:()=>this.dispatch(),onRotationComplete:()=>{this.bootstrap.reset(),e.onRotationComplete?.()},serviceDeadlines:this.expireTasks,markWorkerRetirement:(e,n)=>t.workerRetiring(e,n),serviceHost:t}),t.pools.register(this)}run(e,t){if(this.closedError)return Promise.reject(this.closedError);let n=t.inputBytes??0;return!Number.isSafeInteger(n)||n<0?Promise.reject(/* @__PURE__ */ RangeError(`inputBytes must be a nonnegative safe integer`)):this.enqueue(e,t,!1,n).promise}runTask(e,t){let n=this.enqueue(e,t,!0);return{result:n.promise,close:e=>joinOwnedWorkerTask(n,this.ownedSettlement,e?.retire===!0)}}startTask(e,t){if(!this.ownerOptions.retainedTransport)throw new WorkerTaskError(`Retained tasks require their native lifetime transport`,`unavailable`);return retainWorkerTask(this.enqueue(e,t,!0),this.ownedSettlement,()=>this.service())}service(){serviceNativeWorkerPass(this.host,this.slots),this.expireTasks(),this.retirement.service();for(let e of Array.from(this.ownedTasks))e.owner?.closing?.service();this.dispatch()}enqueue(e,t,n,r=t.inputBytes??0){let i=F(()=>this.service(),{observeRejection:this.ownerOptions.retainedTransport===!0}),o={promise:i.operation.result,resolve:i.resolve,reject:i.reject,read:()=>i.operation.read(),id:++this.nextTaskId,runInContext:captureWorkerTaskContext(),controller:void 0,inputConsumed:!1,executionNotified:!1,exchangeSequence:0,input:e,options:{...t},abort:()=>this.cancel(o,a(t.signal?.reason,`worker task aborted`)),done:!1,admitted:!1,...n?{owner:{closed:!1,retire:!1}}:{},inputBytes:r,enqueuedAt:performance.now(),transferMs:0,hostWaitMs:0};n&&this.ownedTasks.add(o);let s=this.closedError??this.bootstrap.admissionError;if(s||!Number.isSafeInteger(r)||r<0)return this.finish(o,s??/* @__PURE__ */ RangeError(`inputBytes must be a nonnegative safe integer`)),o;let c=this.admission.admitTask(o,()=>this.host.describeTask?.(this.options.workerUrl,void 0,t.diagnosticOperation));return c?(this.finish(o,c),o):(o.observation=this.observeTask?.(o.options.diagnosticOperation),armWorkerTaskTimeout(o,t.timeoutMs,this.timeout,`enqueue`),t.signal?.addEventListener(`abort`,o.abort,{once:!0}),enqueueWorkerTask(this.queue,o),t.signal?.aborted?o.abort():this.dispatch(),o)}get isClosed(){return this.closedError!==void 0}getSnapshot(){return{maxWorkers:this.maxWorkers,workers:this.workers,workersCreated:this.workersCreated,activeTasks:this.activeTasks,pendingTasks:this.admission.pendingTasks}}startCloseResources(e){return startCloseWorkerPoolResources(this.slots,this.resourceClosures,e=>this.ownedSettlement.retire(e),Kt,e,this.ownerOptions,this.host.observeResourceReply)}rotate(){return this.startRotate().result}startRotate(){return this.computeCapacity?.remove(this.resumeCompute),this.retirement.startRotate()}close(e=new WorkerTaskError(`worker task pool closed`,`unavailable`),t=`closed`){this.closedError??=e,this.admission.close(),qt.unsubscribe(this.retireIdleOnPressure),this.computeCapacity?.remove(this.resumeCompute);for(let e of this.queue.splice(0))this.finish(e,this.closedError);for(let e of this.slots)e.worker&&this.host.workerRetiring(e.worker,t),e.task&&!e.task.owner&&this.finish(e.task,this.closedError,void 0,!0);let n=[...this.ownedTasks],r=new Set(n.flatMap(e=>e.slot?.task===e?[e.slot]:[])),i=n.map(e=>joinOwnedWorkerTask(e,this.ownedSettlement,!0)),a=[...this.slots].filter(e=>!r.has(e)),o=[...i,...a.map(e=>this.retirement.retire(e,t))];return this.host.pools.close(this,o,()=>joinWorkerTaskPreparationCleanups(this.completion,this.retirement.joinArtifacts()))}dispatch(){for(this.slots.size||qt.unsubscribe(this.retireIdleOnPressure),this.queue.length&&!this.closedError&&this.retirement.dispatchAllowed||this.computeCapacity?.remove(this.resumeCompute);!this.closedError&&this.retirement.dispatchAllowed&&this.queue.length;){let e=this.queue[0],t=this.maxWorkers+Number(e.options.pointRead===!0),n=this.activeTasks<t?this.retirement.preferredIdle:void 0;if(n??=[...this.slots].find(e=>this.activeTasks<t&&!e.task&&!e.retiring&&!e.retirementFailed&&(!this.bootstrap.error()||e.worker)),!n){let e=this.bootstrap.error();if(e&&this.bootstrap.rejectQueued(),e||this.slots.size>=t){let e=this.queue.length;for(let t of this.slots)t.task?.exchange&&!t.task.exchange.sent&&!t.task.exchange.pressure.signal.aborted&&e-->0&&t.task.exchange.pressure.abort();return}}if(this.computeCapacity&&!e.options.pointRead){let t=this.computeCapacity.acquire(this.resumeCompute,()=>e.exchange&&!e.exchange.sent&&!e.exchange.pressure.signal.aborted?(e.runInContext(()=>e.exchange?.pressure.abort()),!0):!1);if(!t)return;e.computePermit=t}n||(n={nativeSections:Ie()},this.slots.add(n)),this.retirement.clearIdle(n);let r=this.queue.shift();n.task=r,this.activeTasks++,r.slot=n,r.startedAt=performance.now(),armWorkerTaskTimeout(r,r.options.timeoutMs,this.timeout,`dispatch`),r.observation?.started(),r.runInContext(()=>{try{n.worker?.ref()}catch(e){this.fail(n,a(e,`worker reference failed`));return}prepareWorkerTaskInput(r,e=>{r.diagnosticLabel=this.host.describeTask?.(this.options.workerUrl,e),sendWorkerTaskInput({slot:n,task:r,input:e,host:this.host,bootstrapError:this.bootstrap.error,createWorker:()=>this.createWorker(n),fail:(e,t)=>this.fail(n,workerTaskUnavailableError(n,String(e),e),t),refuse:e=>this.finish(r,e,void 0,!0)})},e=>this.finish(r,a(e,`worker task preparation failed`)),!n.worker&&this.options.prepareWorker?()=>Kt(()=>this.host.prepareResources()):void 0)})}}createWorker(e){return(this.options.idleTimeoutMs??6e4)>0&&(qt.unsubscribe(this.retireIdleOnPressure),qt.subscribe(this.retireIdleOnPressure)),createWorkerTaskPoolWorker({slot:e,options:this.options,host:this.host,runInContext:Kt,unavailableError:(t,n)=>workerTaskUnavailableError(e,t,n),onStarted:e=>{this.workers++,this.workersCreated++,this.host.workerStarted(e,this)},onMessage:t=>this.receive(e,t),onFailure:(t,n)=>this.fail(e,t,n),onExit:(t,n)=>{n&&this.workers--;let r=workerTaskUnavailableError(e,`worker exited with code ${t}`);this.fail(e,r,!0)}})}receive(e,t){if(e.retiring)return;let n=e.task;if(n&&l(t)&&(t.status===`request`||t.status===`consumed`||t.status===`notification`)){try{this.receiveExchange(e,n,t)}catch(t){this.fail(e,a(t,`worker consumption callback failed`))}return}if(!n||!l(t)||(n.options.onRequest||n.options.onRequestSync||t.taskId!==void 0)&&t.taskId!==n.id||t.status!==`ok`&&t.status!==`failed`){this.fail(e,new WorkerTaskError(`invalid worker task response`,`unavailable`));return}let r=t,i=!!(n.exchange||n.options.onInputConsumed&&!n.inputConsumed);if(r.status===`failed`)this.finish(n,new WorkerTaskError(r.error,`failed`),void 0,i);else{try{this.options.validateResult?.(r.value)}catch(t){this.fail(e,a(t,`worker result validation failed`));return}this.finish(n,void 0,r.value,i)}}receiveExchange(e,t,n){if(n.taskId!==t.id){this.fail(e,new WorkerTaskError(`stale worker exchange`,`unavailable`));return}if(n.status===`notification`){t.options.onNotification?.(n.value);return}if(n.status===`consumed`){if(n.id===0&&!t.inputConsumed){t.inputConsumed=!0;let e=t.options.onInputConsumed;t.options.onInputConsumed=void 0,e?.()}else if(t.exchange?.sent&&n.id===t.exchange.id){let e=t.exchange.onConsumed;t.exchange=void 0,e?.()}else this.fail(e,new WorkerTaskError(`invalid worker consumption receipt`,`unavailable`));return}if(!t.options.onRequest&&!t.options.onRequestSync||t.exchange||!Number.isSafeInteger(n.id)||n.id!==t.exchangeSequence+1){this.fail(e,new WorkerTaskError(`invalid worker exchange`,`unavailable`));return}t.options.hostTimeout===`owner`&&(clearTimeout(t.timer),t.deadline=void 0);let r=createWorkerHostExchange(t,n.value);t.hostWaitStartedAt=performance.now(),this.dispatch(),this.computeCapacity?.requestCheckpoints(),dispatchOwnedWorkerRequest(t,e,n.value,r,{accept:n=>{if(!t.done&&t.deadline!==void 0&&performance.now()>=t.deadline&&this.timeout(t),t.done||e.task!==t||e.retiring){let release=()=>{try{t.runInContext(()=>n.onConsumed?.())}catch{}};this.slots.has(e)?(e.completions??=[]).push(release):release()}else{this.finishHostWait(t),r.onConsumed=n.onConsumed,r.sent=!0,armWorkerTaskTimeout(t,n.timeoutMs,this.timeout);try{e.worker.postMessage({taskId:t.id,responseId:r.id,input:n.input},n.transferList)}catch(t){this.fail(e,a(t,`worker response delivery failed`))}}},reject:n=>{!t.done&&e.task===t&&this.fail(e,a(n,`worker host exchange failed`))}})}cancel(e,t){e.done||(e.slot?(e.slot.worker&&this.host.workerRetiring(e.slot.worker,`cancelled`),e.owner?this.finish(e,t,void 0,!0):this.fail(e.slot,t)):(this.queue.splice(this.queue.indexOf(e),1),this.finish(e,t)))}fail(e,t,n){e.retiring||(n&&e.ready===!1&&this.bootstrap.fail(t),e.worker&&this.host.workerRetiring(e.worker,`failure`),e.task?.owner?e.task.done?e.task.owner.retire||closeOwnedWorkerTask(e.task,this.ownedSettlement,!0).catch(()=>void 0):this.finish(e.task,t,void 0,!0):this.options.restartOnError===!1?(this.publicDispatch?.close(t)??this.close(t)).catch(()=>void 0):e.task?this.finish(e.task,t,void 0,!0):this.retirement.retire(e).catch(()=>void 0))}finishHostWait(e){let t=e.hostWaitStartedAt;t!==void 0&&(e.hostWaitStartedAt=void 0,e.hostWaitMs+=performance.now()-t)}finish(e,t,n,r=!1){if(e.done)return;this.finishHostWait(e),e.done=!0,e.observation?.completed(),e.observation=void 0,e.runInContext(()=>e.controller?.abort(t)),clearTimeout(e.timer),e.deadline=void 0,e.options.signal?.removeEventListener(`abort`,e.abort);let i=e.slot,{complete:a,resolveFailure:o}=createWorkerTaskCompletion(e,this.completion,t,n);e.owner?(e.owner.complete=a,e.owner.retire||=r||!!(t&&e.slot&&e.preparedAt!==void 0),t?(!o||e.preparation)&&e.reject(o?.()??t):e.resolve(n),(t||r)&&closeOwnedWorkerTask(e,this.ownedSettlement).catch(()=>void 0)):i&&(i.task=void 0,this.activeTasks--,r)?((i.completions??=[]).push(a),this.retirement.retire(i,`failure`).catch(n=>e.reject(workerTaskRetirementError(o?.()??t,n)))):(a(),this.dispatch(),i&&!i.task&&!i.retiring&&this.idle(i))}releaseAdmission(e){e.admitted&&(e.admitted=!1,this.admission.finish(e.inputBytes))}idle(e){e.worker&&!this.resourceClosures.get(e.worker)?.pending&&e.worker.unref(),this.retirement.idle(e)}};function createLazyPromiseLoader(e,t={}){let n,createPromise=()=>{let r=Promise.resolve().then(e);return t.cacheRejections!==!0&&r.catch(()=>{n===r&&(n=void 0)}),r};return{load(){return n??=createPromise(),n},peek(){return n},clear(){n=void 0}}}function createLazyRuntimeSurface(e,t){let n=createLazyPromiseLoader(()=>e().then(t),{cacheRejections:!0});return Object.assign(n.load,{peek:n.peek,clear:n.clear})}function createLazyRuntimeModule(e){return createLazyRuntimeSurface(e,e=>e)}const Jt=Symbol.for(`openclaw.nodeCompileCacheBase`);function resolveNodeCompileCacheEnv(e=process.env){if(e.NODE_DISABLE_COMPILE_CACHE!==void 0)return e;let t=e.NODE_COMPILE_CACHE??u(Jt,()=>({})).baseDirectory;if(t&&!Ce(t)){let t={...e,NODE_DISABLE_COMPILE_CACHE:`1`};return delete t.NODE_COMPILE_CACHE,t}return e.NODE_COMPILE_CACHE===void 0&&t?{...e,NODE_COMPILE_CACHE:t}:e}const Yt=wt(`openclaw.postgres.pool.self-root`);function startPool(){if(!et&&Le()){let e={threadId:V,owner:o(process.argv[1]??``)};Yt.publish(e);let t=new Ze(`openclaw.postgres.pool.self-root`);t.unref(),t.postMessage(e),t.close(),b(`postgres`).warn(`PostgreSQL worker ${e.owner} (thread ${V}) has no inherited pool; starting its own four I/O services.`)}let e=new SharedArrayBuffer(4),t=Array.from({length:4},()=>({channel:new R,signal:new SharedArrayBuffer(8),peers:[]}));for(let e=0;e<t.length;e++)for(let n=e+1;n<t.length;n++){let{port1:r,port2:i}=new R;t[e].peers.push({port:r,signal:t[n].signal}),t[n].peers.push({port:i,signal:t[e].signal})}let n={services:t.map(({channel:e,signal:t})=>({port:e.port1,signal:t})),allocation:e,nextStep:M.nextStep},r=resolveRuntimeProcessEntrypointUrl(`postgresBridge`),i=resolveRuntimeWorkerThreadExecArgv(r),a=[];M.endpoints=n,M.workers=a;let launch=e=>{let n=t[e],o=new Int32Array(n.signal),c=!1,l=new $e(r,{workerData:{host:n.channel.port2,signal:n.signal,peers:n.peers},transferList:[n.channel.port2,...n.peers.map(({port:e})=>e)],execArgv:i});xe(l,r),l.unref(),n.channel.port1.unref(),a[e]=l;let u=new Promise((e,t)=>{l.once(`error`,t),l.once(`exit`,()=>t(/* @__PURE__ */ Error(`PostgreSQL I/O service exited before readiness.${M.nextStep?` Run ${M.nextStep}.`:``}`))),l.once(`message`,()=>e())});u.catch(()=>{}),M.ready[e]=u,l.on(`error`,()=>{}),l.once(`exit`,()=>{c=!0,Atomics.store(o,1,1),Atomics.notify(o,1),s.add(e)}),Promise.resolve(Atomics.waitAsync(o,1,0).value).then(async()=>{c||await l.terminate()})},s=/* @__PURE__ */ new Set;M.refresh=()=>{for(let e of s){s.delete(e);let r={channel:new R,signal:new SharedArrayBuffer(8),peers:[]};t[e]=r,n.services[e]={port:r.channel.port1,signal:r.signal};for(let n=0;n<t.length;n++){if(n===e)continue;let i=t[n],{port1:o,port2:s}=new R;r.peers.push({port:o,signal:i.signal}),a[n].postMessage({watch:{port:s,signal:r.signal}},[s])}launch(e)}};try{for(let e=0;e<t.length;e++)launch(e)}catch(e){throw ie(),e}return n}function getPostgresPool(){return M.nextStep||M.refresh?.(),M.endpoints??startPool()}function createPostgresPoolEndpoints(e=he()){if(!M.endpoints&&(!e||!Object.values(e.effectiveEngines).includes(`postgres`)))return;let t=getPostgresPool();return{...t,services:t.services.map(({port:e,signal:t})=>{let n=new R;return e.postMessage({host:n.port2},[n.port2]),{port:n.port1,signal:t}})}}function postgresPoolTransferList(e){return e?.services.map(({port:e})=>e)??[]}const Xt=Symbol.for(`openclaw.postgres-sync-connection`);function isPostgresSqlConnection(e){return Xt in e&&e[Xt]===!0}function sqlPublicationAnchor(e){return isPostgresSqlConnection(e)?e.anchor:e}function fileFields(e){return{dev:e.dev.toString(),ino:e.ino.toString(),birthtime:ae(e),size:e.size.toString(),mtimeNs:e.mtimeNs.toString()}}function checksum(e){return rt(`sha256`).update(e).digest(`hex`).slice(0,16)}function hasNoJournal(e){return[`-wal`,`-journal`].every(t=>{try{let n=U.statSync(`${e}${t}`,{bigint:!0});return n.isFile()&&n.size===0n}catch(e){if(c(e,`ENOENT`))return!0;throw e}})}function decodeSeal(e,t,n){let r=JSON.parse(e);if(!l(r)||typeof r.payload!=`string`||r.checksum!==checksum(r.payload))return n(`malformed-proof`);let i=JSON.parse(r.payload);if(!l(i)||i.version!==1||typeof i.schemaIdentity!=`string`||typeof i.verifiedAt!=`number`||!Number.isSafeInteger(i.verifiedAt)||!(`facts`in i)||!t.isFile())return n(`malformed-proof`);let a=Date.now()-i.verifiedAt;return a<0||a>6048e5?n(`expired-proof`):Object.entries(fileFields(t)).every(([e,t])=>i[e]===t)?{schemaIdentity:i.schemaIdentity,verifiedAt:i.verifiedAt,facts:i.facts,...i.identity===void 0?{}:{identity:i.identity}}:n(`file-mismatch`)}function readSqliteCleanCloseSeal(e,t,n){let refuse=e=>{n?.(e)};try{let n=`${e}.seal`;if(!U.lstatSync(n).isFile())return refuse(`malformed-proof`);let r=decodeSeal(U.readFileSync(n,`utf8`),t,refuse);return r?hasNoJournal(e)?r:refuse(`journal-present`):void 0}catch(e){return refuse(c(e,`ENOENT`)?`no-proof`:`malformed-proof`)}}async function readSqliteCleanCloseSealAsync(e,t,n){let refuse=e=>{n?.(e)};try{let n=`${e}.seal`;if(!(await U.promises.lstat(n)).isFile())return refuse(`malformed-proof`);let r=decodeSeal(await U.promises.readFile(n,`utf8`),t,refuse);if(!r)return;for(let t of[`-wal`,`-journal`])try{let n=await U.promises.stat(`${e}${t}`,{bigint:!0});if(!n.isFile()||n.size!==0n)return refuse(`journal-present`)}catch(e){if(!c(e,`ENOENT`))throw e}return r}catch(e){return refuse(c(e,`ENOENT`)?`no-proof`:`malformed-proof`)}}function invalidateSqliteCleanCloseSeal(e){try{U.unlinkSync(`${e}.seal`)}catch(e){if(!c(e,`ENOENT`))throw e}}function writeSqliteCleanCloseSeal(e,t,n,r){try{let i=`${e}.seal`,a=U.lstatSync(i,{throwIfNoEntry:!1});if(!n.isFile()||a&&!a.isFile()||!hasNoJournal(e))return invalidateSqliteCleanCloseSeal(e),!1;let o=JSON.stringify({version:1,schemaIdentity:t,...fileFields(n),verifiedAt:r.verifiedAt,facts:r.facts,identity:r.identity});return U.writeFileSync(i,JSON.stringify({payload:o,checksum:checksum(o)})),!0}catch{try{invalidateSqliteCleanCloseSeal(e)}catch{}return!1}}u(Symbol.for(`openclaw.sqliteCoordinatorError`),()=>class extends Error{constructor(e,t){super(e),this.cause=t,this.name=`SqliteCoordinatorError`}});function createSqliteLifecycleAggregateError(e,t,n){return AggregateError(e,t,{cause:n})}function resolveSqliteDatabaseFilePath(e){if(!e.startsWith(`file:`))return e;let[t=``]=e.slice(5).split(/[?#]/u,1);return t.startsWith(`/`)?q(e):decodeURIComponent(t)}function createSqliteDatabaseDescriptorOwner(e){function prepareOwnedSqliteDatabaseAdmission(t){let n=k.descriptorPreparation.then(async()=>{if(V!==0)throw Error(`SQLite descriptor preparation belongs to the host`);t.assertCurrent();let n=await U.promises.stat(t.location,{bigint:!0});j(n,t.expectedIdentity);let r=await U.promises.realpath(t.location);if(t.assertCurrent(),r!==t.location)throw Error(`SQLite private staging location changed before admission`);let i=I(n),a=k.registry.descriptors.get(i);if(retainPreparedSqliteDatabaseAdmissionLocation(t.location,t.expectedIdentity,{identity:i,canonicalPath:r}))return;let o=a?.descriptor??await new Promise((e,n)=>{U.open(t.location,`r`,(t,r)=>t?n(t):e(r))}),s=!1,c=!1;try{let n=await new Promise((e,t)=>{U.fstat(o,{bigint:!0},(n,r)=>n?t(n):e(r))});j(n,t.expectedIdentity),s=a===void 0;let i,l=await readSqliteCleanCloseSealAsync(r,n,e=>{i=e});j(await U.promises.stat(t.location,{bigint:!0}),t.expectedIdentity),t.assertCurrent();let u=k.registry.retainDescriptor(r,o,n);c=!0,e.load(u,{seal:l,refusal:i})}catch(e){if(s&&!c)try{await new Promise((e,t)=>{U.close(o,n=>n?t(n):e())})}catch(t){throw createSqliteLifecycleAggregateError([e,t],`SQLite preparation cleanup failed`,e)}throw e}});return k.descriptorPreparation=n.then(()=>{},()=>{}),n}function prepareSqliteDatabaseAdmissionAsync(t){let n=resolveAdmissionTarget(t.location,t.create!==void 0);if(!n)return Promise.resolve(void 0);let{filename:r,create:i}=n,a=t.identity,prepare=async()=>{t.assertCurrent();let n=a??await ne(r);if(a=void 0,t.assertCurrent(),!n)return;if(t.expectedIdentity&&(n.key!==t.expectedIdentity.key||t.expectedIdentity.birthtime!==void 0&&n.birthtime!==t.expectedIdentity.birthtime))throw Error(`SQLite Worker path no longer matches its borrowed native owner`);let o=n.key.startsWith(`file:`),s=!o&&i?t.create:void 0;if(!o&&!s)return n;let l=`${n.key.slice(5)}:${n.birthtime}`;if(t.observedLocation&&t.observedLocation.identity!==l)throw Error(`SQLite database changed while retaining its admission identity`);if(V!==0){if(s)throw Error(`SQLite descriptor creation belongs to the host`);return pathAdmission(r,l),t.assertCurrent(),n}let u=o?k.registry.descriptors.get(l):void 0;if(u&&(j(u.file,n),retainPreparedSqliteDatabaseAdmissionLocation(r,void 0,{identity:l,canonicalPath:n.canonicalPath})))return n;let d,f;if(u)d=u.descriptor,f=u.file;else{s&&await s.authorize(n.canonicalPath),t.assertCurrent();let e=s?L():void 0;e&&s?.retain(e.promise);let i;try{i=await new Promise((e,t)=>{U.open(r,s?`wx`:`r`,420,(n,r)=>n?t(n):e(r))}),d=i,f=await new Promise((e,t)=>{U.fstat(d,{bigint:!0},(n,r)=>n?t(n):e(r))}),o&&j(f,n),k.registry.retainDescriptorCustody(n.canonicalPath,d,f),e?.resolve()}catch(t){if(i===void 0){if(e?.resolve(),s&&c(t,`EEXIST`))return prepare()}else e?.reject(t);throw t}}let p=o?n:{key:`file:${f.dev}:${f.ino}`,canonicalPath:n.canonicalPath,birthtime:ae(f)},m,h=o?await readSqliteCleanCloseSealAsync(n.canonicalPath,f,e=>{m=e}):void 0,g=await ne(r);if(!g||g.key!==p.key||g.birthtime!==p.birthtime||g.canonicalPath!==p.canonicalPath)throw Error(`SQLite database changed identity during admission`);t.assertCurrent();let _=k.registry.records.get(I(f)),v=_&&!D(_)?_:k.registry.retainDescriptor(p.canonicalPath,d,f);return k.registry.observeLocation(r,v.identity),o?e.load(v,{seal:h,refusal:m}):e.markLoaded(v),p},o=k.descriptorPreparation.then(prepare);return k.descriptorPreparation=o.then(()=>{},()=>{}),o}function retainPreparedSqliteDatabaseAdmissionLocation(t,n,r){let i=!r&&k.registry.forLocation(t),a=i&&k.registry.descriptors.get(i.identity);if(i&&n?.birthtime!==void 0&&i.physicalIdentity.key===n.key&&i.physicalIdentity.birthtime===n.birthtime&&a&&a.descriptor===i.descriptor&&e.isLoaded(a))return e.load(i),!0;let o=r&&k.registry.descriptors.get(r.identity);if(r&&o&&e.isLoaded(o)){n&&j(o.file,n);let i=k.registry.records.get(r.identity),a=i&&!D(i)?i:k.registry.retainDescriptor(r.canonicalPath,o.descriptor,o.file);return k.registry.observeLocation(t,a.identity),e.markLoaded(a),!0}return!1}function retainSqliteDatabaseAdmissionLocation(t,n,r){if(retainPreparedSqliteDatabaseAdmissionLocation(t,n,r))return;let i=U.statSync(t,{bigint:!0});if(!i.isFile())return;let a=I(i),o=k.registry.records.get(a);if(o&&!D(o)){k.registry.observeLocation(t,a),e.load(o);return}if(V!==0)return;let s=k.registry.descriptors.get(a)?.descriptor??U.openSync(t,`r`),c=U.fstatSync(s,{bigint:!0});if(!c.isFile()||I(c)!==a)throw Error(`SQLite database changed while retaining its admission identity`);let l=k.registry.retainDescriptor(U.realpathSync.native(t),s,c);k.registry.observeLocation(t,l.identity),e.load(l)}function pathAdmission(t,n){try{let r=k.registry.forLocation(t);if(!r){let e=n;if(e===void 0&&V!==0){let n=U.statSync(t,{bigint:!0});if(!n.isFile())return;e=I(n)}E(t,void 0,!1,e!==void 0&&V!==0?{identity:e,canonicalPath:U.realpathSync.native(t)}:void 0),r=k.registry.forLocation(t)}return r?(e.load(r),r):(retainSqliteDatabaseAdmissionLocation(t),k.registry.forLocation(t))}catch(e){if(c(e,`ENOENT`))return;throw e}}function resolveAdmissionTarget(e,t){let n=e,r=t;if(n&&n!==`:memory:`){if(n.startsWith(`file:`)){let e=new URL(n);if(e.searchParams.get(`mode`)===`memory`||([`ro`,`rw`].includes(e.searchParams.get(`mode`)??``)&&(r=!1),n=resolveSqliteDatabaseFilePath(n),!n||n===`:memory:`))return}return{filename:n,create:r}}}function prepareSqliteDatabaseAdmission(t,n={}){let r=resolveAdmissionTarget(t,n.create);if(!r)return;let{filename:i,create:a}=r;try{let e=U.statSync(i,{bigint:!0});if(!e.isFile()){k.registry.observeLocation(i,void 0);return}let t=I(e);return k.registry.observeLocation(i,t),t}catch(t){if(c(t,`ENOENT`)){if(k.registry.observeLocation(i,void 0),!a)return;if(V!==0){let e=k.exchange.getStore()!==void 0;E(i,!0);let n=prepareSqliteDatabaseAdmission(i);if(e&&n===void 0)throw Error(`SQLite worker file creation requires host authority: ${i}`,{cause:t});return n}let n;try{n=U.openSync(i,`wx`,420)}catch(e){if(c(e,`EEXIST`))return prepareSqliteDatabaseAdmission(i);throw e}let r=U.fstatSync(n,{bigint:!0}),o=k.registry.retainDescriptor(U.realpathSync.native(i),n,r);if(e.markLoaded(o),prepareSqliteDatabaseAdmission(i)!==o.identity)throw Error(`SQLite database changed identity during file creation`,{cause:t});return o.identity}throw t}}return{prepareOwnedSqliteDatabaseAdmission,prepareSqliteDatabaseAdmissionAsync,retainSqliteDatabaseAdmissionLocation,retainPreparedSqliteDatabaseAdmissionLocation,prepareSqliteDatabaseAdmission,pathAdmission}}const Zt=u(Symbol.for(`openclaw.sqliteNativeAdmissions`),()=>({operations:/* @__PURE__ */ new WeakMap}));function getSqliteNativeAdmissionFacts(e){return Zt.operations.get(e)?.facts}function createSqliteDatabaseAdmissionReader(e){let{state:t,admission:n,pathAdmission:r,exchange:i,retain:a,release:o,publishFact:s}=e;function readSqliteDatabaseWriteRevision(e){let r=sqlPublicationAnchor(e);if(!r.isOpen||t.suspended.has(r))return;let i=n(r);if(!i){let e=r.location();return!e||e===`:memory:`?t.localWriteRevisions.get(r)??0:void 0}return O(i,`writeRevision`)}function readSqliteDatabaseSiblingWriteRevision(e){let n=sqlPublicationAnchor(e),r=readSqliteDatabaseWriteRevision(n);return r===void 0?void 0:r-(t.localWriteRevisions.get(n)??0)|0}function readSqliteDatabaseCleanClose(t){let n=e.prepareFileIdentity(t),i=r(t);return i!==void 0&&i.identity===n&&Atomics.load(new Int32Array(i.generation),P.sealPresent)===1}function readSqliteDatabaseIntegrityVerification(t){let n=typeof t==`string`?getOrLoadSqliteDatabaseAdmissionForPath(t,e.integrityVerificationKey,()=>void 0):getSqliteDatabaseAdmission(t,e.integrityVerificationKey);return n===void 0?void 0:{verifiedAt:n}}function readSqliteDatabaseCleanCloseRefusal(e){return n(sqlPublicationAnchor(e))?.cleanCloseRefusal}function retainSqliteDatabaseAdmissionForPath(e){let n=r(e);if(!n)return;try{a(n)}catch(e){throw o(n),e}let i=!1,s=t.registry.prepareLocation(e);return{location:e,identity:{...n.physicalIdentity,canonicalPath:n.location},isCurrent:()=>!i&&s()===n,release(){i||(i=!0,o(n))}}}function withPathAdmission(e,t){let n=r(e);if(!n)return t(void 0);try{return a(n),t(n)}finally{o(n)}}function getSqliteDatabaseAdmission(e,r,a={}){let o=sqlPublicationAnchor(e);if(!o.isOpen||t.suspended.has(o))return;let s=n(o,a.existingOnly!==!0&&!e.isTransaction);if(!s)return;let c=(isPostgresSqlConnection(e)?void 0:getSqliteNativeAdmissionFacts(e))?.get(r.name)??t.local.get(o)?.get(r.name);if(c&&c.revision===me(s,c.schemaDependent)&&(!c.schemaDependent||c.ddlRevision===(t.ddlRevisions.get(o)??0)))return ue(c,r);if(r.schemaDependent&&t.schemaDirty.has(o))return;if(t.rolledBack.has(o)){if(e.isTransaction)return;t.rolledBack.delete(o)}let l=s.facts.get(r.name);if(!l||!A(s,l)||a.refresh&&r.writer!==`host`){if(r.writer===`host`)return e.isTransaction||V===0||s.hostRevision===O(s,`hostRevision`)?void 0:(i(s),l=s.facts.get(r.name),l&&A(s,l)?ue(l,r):void 0);let n=O(s,`publicationRevision`),o=t.misses.get(s)??/* @__PURE__ */ new Map;t.misses.set(s,o),r.writer!==`connection`&&!e.isTransaction&&(a.refresh||o.get(r.name)!==n)&&(i(s),l=s.facts.get(r.name),o.set(r.name,O(s,`publicationRevision`)))}return l&&A(s,l)?ue(l,r):void 0}function getOrLoadSqliteDatabaseAdmissionForPath(e,t,n){let read=e=>{if(!e)return n();let r=e.facts.get(t.name),i=r&&A(e,r)?ue(r,t):void 0;if(i!==void 0)return i;let a=me(e,t.schemaDependent),o=n();return o!==void 0&&s(e,t,w(t,o),a),o};return t.lifetime===`process`?withPathAdmission(e,read):read(r(e))}function peekSqliteDatabaseAdmissionForPath(e,n){let r=t.registry.forLocation(e),i=r?.facts.get(n.name);return r&&i&&A(r,i)?ue(i,n):void 0}function prepareSqliteDatabaseAdmissionForPath(e,t){let n=r(e);if(!n)return()=>void 0;let i=new Int32Array(n.generation),a=t.schemaDependent?P.schemaRevision:P.factRevision,o=n.facts.get(t.name),s=o&&new Int32Array(o.current);return()=>{if(Atomics.load(i,P.retired)!==0)return;let e=n.facts.get(t.name);return e!==o&&(o=e,s=o&&new Int32Array(o.current)),o&&s&&Atomics.load(s,0)===1&&o.revision===Atomics.load(i,a)?ue(o,t):void 0}}function getSqliteDatabaseSchemaRevision(e,r={}){let i=sqlPublicationAnchor(e),a=n(i,r.existingOnly!==!0);if(a)return O(a,`schemaRevision`);let o=t.openedIdentities.get(i);return o?t.localSchemaRevisions.get(o)??0:void 0}function hasSqliteDatabaseSchemaAdmissionForPath(e){return ce(r(e))}function getSqliteDatabaseAdmissionIdentityForPath(e){return t.registry.forLocation(e)?.physicalIdentity}function getSqliteDatabaseAdmissionSourceForPath(e){let n=t.registry.forLocation(e);return n&&{identity:n.physicalIdentity,canonicalPath:n.location}}function observeSqliteDatabaseAdmissionLocation(e,n){let r=t.registry.forLocation(n.canonicalPath);r?.physicalIdentity.key===n.key&&r.physicalIdentity.birthtime===n.birthtime&&t.registry.observeLocation(e,r.identity)}function hasSqliteDatabaseSchemaAdmissionForIdentity(e){if(!e.key.startsWith(`file:`)||e.birthtime===void 0)return!1;let n=`${e.key.slice(5)}:${e.birthtime}`;return ce(t.registry.records.get(n))}return{readSqliteDatabaseWriteRevision,readSqliteDatabaseSiblingWriteRevision,readSqliteDatabaseCleanClose,readSqliteDatabaseIntegrityVerification,readSqliteDatabaseCleanCloseRefusal,getSqliteDatabaseAdmission,getSqliteDatabaseSchemaRevision,getOrLoadSqliteDatabaseAdmissionForPath,peekSqliteDatabaseAdmissionForPath,prepareSqliteDatabaseAdmissionForPath,hasSqliteDatabaseSchemaAdmissionForPath,getSqliteDatabaseAdmissionIdentityForPath,getSqliteDatabaseAdmissionSourceForPath,observeSqliteDatabaseAdmissionLocation,hasSqliteDatabaseSchemaAdmissionForIdentity,retainSqliteDatabaseAdmissionForPath}}const Qt=/* @__PURE__ */ new Set([`CHECK`,`FOREIGN`,`PRIMARY`,`UNIQUE`]);function readTableConstraintKeyword(e,t){let n=t;if(n.keyword===`CONSTRAINT`){let t=readSqlToken(e,n.end);n=t?readSqlToken(e,t.end):null}return n?.keyword&&Qt.has(n.keyword)?n.keyword:null}function readSqlToken(e,t){let n=t;for(;n<e.length&&/\s/u.test(e[n]??``);)n+=1;let r=e[n];if(!r)return null;if(r===`"`||r==="`"||r===`[`){let t=skipSqlQuoted(e,n,r);return{end:t,keyword:null,raw:e.slice(n,t)}}let i=n;for(;i<e.length&&!/[\s(,]/u.test(e[i]??``);)i+=1;let a=e.slice(n,i);return{end:i,keyword:a.toUpperCase(),raw:a}}function normalizeSqlIdentifier(e){return e.startsWith(`"`)&&e.endsWith(`"`)?e.slice(1,-1).replaceAll(`""`,`"`).toLowerCase():e.startsWith("`")&&e.endsWith("`")?e.slice(1,-1).replaceAll("``","`").toLowerCase():e.startsWith(`[`)&&e.endsWith(`]`)?e.slice(1,-1).toLowerCase():e.toLowerCase()}function splitSqlList(e){let t=[],n=0,r=0;for(let i of unquotedSqlIndexes(e,0)){let a=e[i];a===`(`?n+=1:a===`)`?--n:a===`,`&&n===0&&(t.push(e.slice(r,i)),r=i+1)}return t.push(e.slice(r)),t}function findSqlCharacter(e,t){for(let n of unquotedSqlIndexes(e,0))if(e[n]===t)return n;return-1}function findSqlClosingParenthesis(e,t){let n=0;for(let r of unquotedSqlIndexes(e,t)){let t=e[r];if(t===`(`)n+=1;else if(t===`)`&&(--n,n===0))return r}throw Error(`SQLite schema contains an unterminated table definition.`)}function normalizeSqlWhitespace(e){let t=``,n=!1,r=/[^\s'"`[/-]+|\s+|./gsu,i;for(;i=r.exec(e);){let a=i.index,o=i[0][0]??``,s=skipSqlQuoted(e,a,o),c=i[0];if(s!==a)c=e.slice(a,s),r.lastIndex=s;else{let t=skipSqlComment(e,a);if(t!==a){n=!0,r.lastIndex=t;continue}if(/\s/u.test(o)){n=!0;continue}}n&&t.length>0&&(t+=` `),t+=c,n=!1}return t.trim()}function*unquotedSqlIndexes(e,t){let n=t;for(;n<e.length;){let t=skipSqlQuoted(e,n,e[n]??``),r=t===n?skipSqlComment(e,n):t;r===n?(yield n,n+=1):n=r}}function skipSqlQuoted(e,t,n){if(n!==`'`&&n!==`"`&&n!=="`"&&n!==`[`)return t;let r=n===`[`?`]`:n,i=t+1;for(;i<e.length;)if(e[i]!==r)i+=1;else if(n!==`[`&&e[i+1]===r)i+=2;else return i+1;return e.length}function skipSqlComment(e,t){if(e.startsWith(`--`,t)){let n=e.indexOf(`
`,t+2);return n===-1?e.length:n+1}if(e.startsWith(`/*`,t)){let n=e.indexOf(`*/`,t+2);return n===-1?e.length:n+2}return t}function parseSqliteTableDefinition(e,t){if(e===null)throw Error(`Could not inspect SQLite table definition for ${t}.`);let n=findSqlCharacter(e,`(`);if(n===-1)throw Error(`SQLite table ${t} has no column definition.`);let r=findSqlClosingParenthesis(e,n),i=/* @__PURE__ */ new Map,a=[];for(let o of splitSqlList(e.slice(n+1,r))){let e=normalizeSqlWhitespace(o);if(!e)continue;let n=readSqlToken(e,0);if(!n)throw Error(`SQLite table ${t} contains an unreadable definition.`);if(readTableConstraintKeyword(e,n)){a.push(e);continue}let r=normalizeSqlIdentifier(n.raw);if(i.has(r))throw Error(`SQLite table ${t} contains duplicate column ${r}.`);i.set(r,e)}return{columns:new Map([...i].toSorted(([e],[t])=>e.localeCompare(t))),constraints:a.toSorted()}}const $t=[{tableName:`session_pending_inputs`,columnName:`consumed_event_id`,dataType:`TEXT`},{tableName:`session_transcript_active_events`,columnName:`context_eligible`,dataType:`INTEGER`},{tableName:`session_nodes`,columnName:`project_id`,dataType:`TEXT`},{tableName:`session_windows`,columnName:`row_transcript_json`,dataType:`TEXT`},{tableName:`session_windows`,columnName:`row_transcript_updated_at`,dataType:`INTEGER`},{tableName:`session_conversations`,columnName:`route_context_json`,dataType:`TEXT`}];function hasPendingAgentStartupColumns(e){let t=/* @__PURE__ */ new Map;return $t.some(({tableName:n,columnName:r})=>{if(!e.has(n))return!1;let i=e.get(n);if(!i)return!0;let a=t.get(n);return a||(a=parseSqliteTableDefinition(i,n).columns,t.set(n,a)),!a.has(r)})}function materializeRuntimeProcessScriptFile(e,t={}){let n=U.mkdtempSync(K.join(t.parentDirectory??ft.tmpdir(),`openclaw-script-`)),r=K.join(n,e.fileName),i=!1,dispose=()=>{if(!i)try{U.rmSync(n,{recursive:!0,force:!0}),i=!0}catch(e){process.emitWarning(`Runtime script cleanup failed at ${n}: ${e instanceof Error?e.message:String(e)}`)}};try{return U.writeFileSync(r,e.source,{mode:384,flag:`wx`}),{url:vt(r),dispose}}catch(e){throw dispose(),e}}function probeBunSqliteLibrary(e){let t=materializeRuntimeProcessScriptFile({fileName:S.bunSqliteLibraryProbe.fileName,source:`import{createRequire}from"node:module";try{const candidate=process.argv[2];if(!candidate||process.argv.length!==3){throw new Error("Expected one SQLite library path")}const require2=createRequire(import.meta.url);const{Database}=require2("bun:sqlite");Database.setCustomSQLite(candidate);const database=new Database(":memory:");let facts;try{facts=database.query("SELECT sqlite_version() AS version, sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted").get()}finally{database.close()}process.stdout.write(JSON.stringify({protocol:1,version:facts.version,extensionLoadingSupported:facts.omitted===0}))}catch(error){process.stdout.write(JSON.stringify({protocol:1,error:(error instanceof Error?error.message:String(error)).slice(0,512)}));process.exitCode=1}
`});try{let n=q(t.url),r=K.dirname(n),i=K.join(r,`bunfig.toml`);U.writeFileSync(i,``,{mode:384,flag:`wx`});let a={};for(let e of[`SystemRoot`,`SYSTEMROOT`,`WINDIR`,`TEMP`,`TMP`,`TMPDIR`])process.env[e]&&(a[e]=process.env[e]);let o=jt(process.execPath,[`--no-install`,`--no-env-file`,`--config=${i}`,n,K.resolve(e)],{cwd:r,env:Ye(a),encoding:`utf8`,stdio:[`ignore`,`pipe`,`pipe`],timeout:5e3,killSignal:`SIGKILL`,maxBuffer:4096});if(o.error)throw o.error;let s=parseProbeFacts(o.stdout);if(o.status!==0)throw Error(s&&`error`in s&&typeof s.error==`string`?s.error.slice(0,512):`SQLite library probe failed (${o.signal??o.status})`);if(!s||!(`version`in s)||typeof s.version!=`string`||s.version.length>64||!(`extensionLoadingSupported`in s)||typeof s.extensionLoadingSupported!=`boolean`)throw Error(`SQLite library probe returned invalid output`);return{version:s.version,extensionLoadingSupported:s.extensionLoadingSupported}}finally{t.dispose()}}function parseProbeFacts(e){let t;try{t=JSON.parse(e)}catch{return}return typeof t==`object`&&t&&!Array.isArray(t)&&`protocol`in t&&t.protocol===1?t:void 0}const en=`openclaw.processMachineIdentity`;function isSqliteWalResetSafeVersion(e){let t=/^(\d+)\.(\d+)\.(\d+)$/u.exec(e.trim());if(!t)return!1;let[n,r,i]=t.slice(1).map(Number);return[n,r,i].every(Number.isSafeInteger)?n>3||n===3&&(r>51||r===51&&i>=3||r===50&&i>=7||r===44&&i>=6):!1}const tn=`openclaw.bunSqliteLibrarySelection`,nn=`openclaw.sqliteRuntimeCapabilities`,rn=`openclaw.sqliteNativeRuntimeAdmission`;function createCapabilities(e){let t,n,r=0,i=Object.freeze({explicitSqliteCloseReleasesNativeResources:!1,decided:!1,reason:`SQLite close capability has not been decided`});function decide(e){return t||(t=Object.freeze(e),tt(nn,t),t.explicitSqliteCloseReleasesNativeResources&&r>0&&process.emitWarning(`SQLite close became capable after ${r} topology owners were created; those owners remain conservative`,{code:`SQLITE_EARLY_TOPOLOGY`})),t}function conservative(e){return{explicitSqliteCloseReleasesNativeResources:!1,decided:!0,reason:e}}function settled(){if(t)return t;if(!process.versions.bun)return decide({explicitSqliteCloseReleasesNativeResources:!0,decided:!0,reason:`Node runtime`});if(process.platform===`win32`)return decide(conservative(`Bun Windows native-close conformance is not qualified`));if(!et)return decide({...i,reason:`Parent did not complete SQLite close admission`,...z(nn)})}return{get(){return settled()??i},capture(){let e=settled()??i;return e.decided||(r+=1),e.explicitSqliteCloseReleasesNativeResources},initialize(){return n??=(async()=>{e();let t=settled();if(t)return t;try{if(f(process.env.OPENCLAW_DIAGNOSTICS).flags.some(e=>e.toLowerCase()===`sqlite.close.conservative`))return decide(conservative(`SQLite close optimization disabled by internal diagnostic flag`));let{probeSqliteNativeClose:e}=await import(`./control-ui-file.worker-bun-sqlite-close-probe-aNWpBlhH.mjs`);return decide({...await e(),decided:!0})}catch(e){return decide(conservative(`SQLite close check failed: ${String(e)}`))}})(),n}}}function selectLibrary(e){let{Database:t}=Xe(import.meta.url)(`bun:sqlite`);t.setCustomSQLite(e)}function createSelector(){let e,t;return(n={})=>{if(t)throw t;if(e)return e;let r=n.explicitPath??(process.env.OPENCLAW_SQLITE_LIBRARY?.trim()||void 0);if(!process.versions.bun||process.platform!==`darwin`)return e=r?{source:`runtime`,ignoredOverride:`OPENCLAW_SQLITE_LIBRARY requires Bun on macOS`}:{source:`runtime`},e;let i=n.standaloneRoot??qe(),a=r===void 0&&i!==void 0?_t.join(i,`lib/libsqlite3.dylib`):void 0,o=process.env.HOMEBREW_PREFIX?.trim(),s=r===void 0?[.../* @__PURE__ */ new Set([...a?[a]:[],...o?[_t.join(o,`opt/sqlite/lib/libsqlite3.dylib`)]:[],`/opt/homebrew/opt/sqlite/lib/libsqlite3.dylib`,`/usr/local/opt/sqlite/lib/libsqlite3.dylib`,`/opt/local/lib/libsqlite3.dylib`])]:[r],c=[];for(let n of s){let i=r===void 0?n===a?`bundled`:`discovered`:`env`,o,s=!0;try{try{o=probeBunSqliteLibrary(n)}catch(e){throw s=ot(n),s?e:Error(`missing file`,{cause:e})}if(!isSqliteWalResetSafeVersion(o.version))throw Error(`SQLite version ${o.version} below the WAL safety floor`);if(!o.extensionLoadingSupported)throw Error(`built with SQLITE_OMIT_LOAD_EXTENSION`)}catch(e){if(r===void 0){(s||n===a)&&c.push(`${n} (${e instanceof Error?e.message:String(e)})`);continue}throw t=selectionError(n,e,i===`bundled`),t}try{selectLibrary(n)}catch(e){throw t=selectionError(n,e,i===`bundled`),t}return e={source:i,path:n,version:o.version,extensionLoadingSupported:!0},e}throw t=/* @__PURE__ */ Error(`No supported SQLite library for Bun on macOS (${process.arch})`+(c.length>0?`; unusable: ${c.join(`, `)}`:``)+`. Apple's system SQLite fails OpenClaw's read-only database connections. `+(a?`Rebuild or replace the complete standalone artifact to restore its bundled SQLite library. `:``)+`Install one with brew install sqlite, or set OPENCLAW_SQLITE_LIBRARY to a libsqlite3.dylib built for ${process.arch}.`),t}}function selectionError(e,t,n=!1){let r=n?`Rebuild or replace the complete standalone artifact (openclaw and runtime/), or set OPENCLAW_SQLITE_LIBRARY to a supported library.`:`Fix or unset OPENCLAW_SQLITE_LIBRARY; install a supported library with brew install sqlite.`;return Error(`Cannot use ${n?`bundled `:``}SQLite library ${e}: ${t instanceof Error?t.message:String(t)}. ${r}`,{cause:t})}function readPublishedSqliteLibrarySelection(){return z(tn)}function createRuntimeSelector(){let e=!!process.versions.bun&&process.platform===`darwin`,t;e&&!et&&(t=readPublishedSqliteLibrarySelection());let n=createSelector(),r=!1;return i=>{let a=t??n(i);return e&&et&&!r&&(tt(tn,Object.freeze({...a})),r=!0),a}}function runtimeSelector(){return u(Symbol.for(`openclaw.bunSqliteLibrarySelection`),createRuntimeSelector)}function capabilities(){let e=runtimeSelector();return e.capabilities??=createCapabilities(e)}function getSqliteRuntimeCapabilities(){return capabilities().get()}function captureSqliteWorkerEnvironmentData(e=z(Pe)){return[[tn,ensureSqliteLibrarySelected()],[nn,getSqliteRuntimeCapabilities()],[rn,z(rn)],[Pe,e],[en,z(en)]]}function ensureSqliteLibrarySelected(e){return runtimeSelector()(e)}function compareValidSemver(e,t){let n=Ft(e),r=Ft(t);return n&&r?n.compare(r):null}const an=Symbol.for(`openclaw.warning-filter`);function shouldIgnoreWarning(e){return!!(e.code===`DEP0040`&&e.message?.includes(`punycode`)||e.code===`DEP0060`&&e.message?.includes(`util._extend`)||e.name===`ExperimentalWarning`&&e.message?.includes(`SQLite is an experimental feature`))}function normalizeWarningArgs(e){let t=e[0],n=e[1],r=e[2],i,a,o;return t instanceof Error?(i=t.name,o=t.message,a=t.code):typeof t==`string`&&(o=t),l(n)?(typeof n.type==`string`&&(i=n.type),typeof n.code==`string`&&(a=n.code)):(typeof n==`string`&&(i=n),typeof r==`string`&&(a=r)),{name:i,code:a,message:o}}function installProcessWarningFilter(){let e=u(an,()=>({installed:!1}));if(e.installed)return;let t=process.emitWarning.bind(process),wrappedEmitWarning=((...e)=>{if(!shouldIgnoreWarning(normalizeWarningArgs(e))){if(e[0]instanceof Error&&l(e[1])){let t=e[0],n=Object.assign(Error(t.message),{name:t.name,code:t.code});process.emit(`warning`,n)}else Reflect.apply(t,process,e)}});process.emitWarning=wrappedEmitWarning,e.installed=!0}const on=Xe(import.meta.url);let sn;function assertSqliteWalResetSafeVersion(e,t){if(isSqliteWalResetSafeVersion(e))return;let n=process.config.variables,r=n.node_shared_sqlite===!0||n.node_shared_sqlite===`true`;throw Error(`OpenClaw requires SQLite 3.51.3+, 3.50.7+ within 3.50.x, or 3.44.6+ within 3.44.x for WAL safety; Node ${t} ${r?`uses shared system`:`embeds`} SQLite ${e}, which is affected by the upstream WAL-reset database corruption bug. ${r?`Upgrade the system SQLite library to one of those safe versions, or use a Node build embedding a safe version.`:`Upgrade to Node 24.22.1+ or 26.12.1+ before retrying.`}`)}function sqliteNativeRuntimeIdentity(){return{pid:process.pid,executable:process.execPath,nodeVersion:process.versions.node,bunVersion:process.versions.bun,library:ensureSqliteLibrarySelected()}}function parseSqliteNativeRuntimeAdmission(e){if(!l(e)||e.format!==1||typeof e.version!=`string`||typeof e.extensionLoadingSupported!=`boolean`)return;let t=sqliteNativeRuntimeIdentity();if(yt(e.runtime,t))return{format:1,runtime:t,version:e.version,storageIdentity:l(e.storageIdentity)&&typeof e.storageIdentity.sourceId==`string`&&typeof e.storageIdentity.compileOptions==`string`?{sourceId:e.storageIdentity.sourceId,compileOptions:e.storageIdentity.compileOptions}:void 0,extensionLoadingSupported:e.extensionLoadingSupported}}function safeSqliteNativeRuntimeAdmission(e){try{let t=parseSqliteNativeRuntimeAdmission(e);return t&&isSqliteWalResetSafeVersion(t.version)?t:void 0}catch{return}}function captureSqliteNativeRuntimeAdmission(){return safeSqliteNativeRuntimeAdmission(z(rn))}function assertSafeSqliteRuntime(e){if(sn===e)return;let t=parseSqliteNativeRuntimeAdmission(z(rn));if(t){assertSqliteWalResetSafeVersion(t.version,process.versions.node),compareValidSemver(t.version,`3.45.0`),t.extensionLoadingSupported,sn=e;return}let n=new e.DatabaseSync(`:memory:`),r,i,a;try{let e=n.prepare(`SELECT sqlite_version() AS version, sqlite_source_id() AS sourceId, (SELECT group_concat(compile_options, ',') FROM (SELECT compile_options FROM pragma_compile_options ORDER BY compile_options)) AS compileOptions, sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted`).get();r=typeof e?.version==`string`?e.version:`unknown`,assertSqliteWalResetSafeVersion(r,process.versions.node),typeof e?.sourceId==`string`&&e.sourceId&&typeof e.compileOptions==`string`&&(i={sourceId:e.sourceId,compileOptions:e.compileOptions}),a=e?.omitted===0}finally{n.close()}compareValidSemver(r,`3.45.0`),sn=e,tt(rn,{format:1,runtime:sqliteNativeRuntimeIdentity(),version:r,storageIdentity:i,extensionLoadingSupported:a})}function requireNodeSqlite(){installProcessWarningFilter();try{ensureSqliteLibrarySelected();let e=on("node:sqlite");return assertSafeSqliteRuntime(e),e}catch(e){let t=formatErrorMessage(e);throw Error(`SQLite support is unavailable or unsafe in this Node runtime. ${t}`,{cause:e})}}const cn=`-- Session storage doctrine: session_nodes.entry_json owns hot logical-session facts;
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
  ON session_windows(primary_conversation_id)
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

CREATE INDEX IF NOT EXISTS idx_agent_conversation_deliveries_source_session
  ON conversation_deliveries(source_session_key, operation_id);

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
CREATE TABLE IF NOT EXISTS session_creation_operations (
  operation_digest TEXT PRIMARY KEY,
  request_fingerprint TEXT NOT NULL,
  session_key TEXT NOT NULL,
  session_id TEXT NOT NULL,
  lifecycle_revision TEXT,
  role TEXT,
  scopes_json TEXT NOT NULL,
  expires_at INTEGER NOT NULL
) STRICT;
CREATE INDEX IF NOT EXISTS idx_agent_session_creation_operations_expiry
  ON session_creation_operations(expires_at);
-- END SESSION CREATION OPERATIONS

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
    OR (
      event_json IS NULL AND event_zstd IS NULL
      AND event_utf8_bytes IS NOT NULL
      AND event_utf8_bytes BETWEEN 1 AND 4194304
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

CREATE TABLE IF NOT EXISTS session_transcript_cold_archive_chunks (
  session_id TEXT NOT NULL,
  chunk_index INTEGER NOT NULL CHECK (chunk_index >= 0),
  archive_name TEXT NOT NULL UNIQUE,
  archive_sha256 TEXT NOT NULL CHECK (length(archive_sha256) = 64),
  first_seq INTEGER NOT NULL,
  last_seq INTEGER NOT NULL CHECK (last_seq >= first_seq),
  event_count INTEGER NOT NULL CHECK (event_count >= 1),
  raw_bytes INTEGER NOT NULL CHECK (raw_bytes >= 0),
  archive_bytes INTEGER NOT NULL CHECK (archive_bytes >= 0),
  archive_blob BLOB,
  PRIMARY KEY (session_id, chunk_index),
  FOREIGN KEY (session_id) REFERENCES session_transcript_cold_archives(session_id) ON DELETE CASCADE,
  CHECK (length(archive_name) > 0 AND archive_name NOT IN ('.', '..') AND archive_name NOT LIKE '%/%' AND archive_name NOT LIKE '%\\%')
) STRICT, WITHOUT ROWID;

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
  event_utf8_bytes INTEGER,
  event_payload BLOB,
  event_codec TEXT,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_trajectory_runtime_run
  ON trajectory_runtime_events(session_id, run_id, created_at, COALESCE(event_utf8_bytes, octet_length(event_json)));

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

CREATE TABLE IF NOT EXISTS agent_tool_usage (
  tool_id TEXT PRIMARY KEY NOT NULL,
  score REAL NOT NULL CHECK (score >= 0),
  updated_at INTEGER NOT NULL
) STRICT;
-- END AGENT TOOL USAGE

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
) STRICT, WITHOUT ROWID;

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

CREATE TABLE IF NOT EXISTS session_transcript_active_event_facts (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  serialized_bytes INTEGER NOT NULL CHECK (serialized_bytes >= 1),
  dependency_navigation_json TEXT NOT NULL,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id, seq)
    REFERENCES session_transcript_active_events(session_id, event_seq) ON DELETE CASCADE
) STRICT, WITHOUT ROWID;
-- END ACTIVE EVENT FACTS

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

CREATE INDEX IF NOT EXISTS idx_agent_session_input_completions_session_key
  ON session_input_completions(session_key);
`,ln=`

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
) STRICT, WITHOUT ROWID;

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
  ON state_leases(owner);

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

CREATE TABLE IF NOT EXISTS device_pairing_browser_requests (
  request_id TEXT NOT NULL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  device_id TEXT NOT NULL UNIQUE,
  public_key TEXT NOT NULL,
  remote_ip TEXT,
  user_agent TEXT,
  origin TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_token_sha256 TEXT,
  created_at_ms INTEGER NOT NULL,
  expires_at_ms INTEGER NOT NULL
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
  bootstrap_deferred INTEGER,
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
  created_via TEXT NOT NULL CHECK (created_via IN ('operator', 'agent', 'template')),
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

CREATE TABLE IF NOT EXISTS durable_background_processes (
  id TEXT NOT NULL PRIMARY KEY,
  record_json TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS sandbox_persistent_execs (
  owner_key TEXT NOT NULL PRIMARY KEY,
  source_identity TEXT NOT NULL,
  attempt_id TEXT NOT NULL UNIQUE,
  owner_json TEXT NOT NULL,
  backend_id TEXT NOT NULL CHECK (backend_id = 'docker'),
  backend_target_json TEXT NOT NULL,
  workspace_binding_json TEXT NOT NULL,
  container_id TEXT NOT NULL,
  container_name TEXT NOT NULL,
  container_started_at TEXT NOT NULL,
  revision INTEGER NOT NULL CHECK (revision > 0),
  phase TEXT NOT NULL CHECK (phase IN ('reserved', 'prepared', 'running', 'stopping', 'uncertain', 'stopped')),
  receipt_json TEXT,
  error TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  CHECK (phase NOT IN ('prepared', 'running') OR receipt_json IS NOT NULL)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_sandbox_persistent_execs_container
  ON sandbox_persistent_execs(container_id, owner_key);

CREATE INDEX IF NOT EXISTS idx_sandbox_persistent_execs_container_name
  ON sandbox_persistent_execs(container_name, owner_key);

CREATE INDEX IF NOT EXISTS idx_sandbox_persistent_execs_source
  ON sandbox_persistent_execs(source_identity, owner_key);

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

CREATE INDEX IF NOT EXISTS idx_task_runs_runtime_run
  ON task_runs(runtime, run_id, source_id, created_at, task_id);
CREATE INDEX IF NOT EXISTS idx_task_runs_cron_runtime_order
  ON task_runs(runtime, created_at, task_id) WHERE runtime = 'cron';
CREATE INDEX IF NOT EXISTS idx_task_runs_cron_source_order
  ON task_runs(source_id, created_at, task_id) WHERE runtime = 'cron';

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
  started_at_ms INTEGER,
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

CREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_chronology
  ON meeting_transcript_sessions(started_at_ms DESC, session_id ASC, started_at ASC);

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
  shared_host INTEGER,
  resource_receipt_json TEXT,
  retention_json TEXT,
  provision_source_json TEXT
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
  disk_authority_json TEXT,
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
  draft INTEGER,
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
  checkpoint_json TEXT,
  tree_root_digest BLOB,
  source_paths_digest BLOB,
  canonical_fingerprints BLOB,
  projection_fingerprints BLOB,
  CHECK (baseline_json IS NULL OR baseline_ref IS NOT NULL),
  CHECK ((journal_json IS NULL) = (journal_pack IS NULL))
) STRICT;

-- The projection owner advances changed nodes and its root in one acceptance.
-- Legacy baseline_json remains only until that owner's resumable conversion.
CREATE TABLE IF NOT EXISTS local_workspace_manifest_nodes (
  worktree_id TEXT NOT NULL,
  path TEXT NOT NULL,
  node_json TEXT NOT NULL,
  PRIMARY KEY (worktree_id, path),
  FOREIGN KEY (worktree_id)
    REFERENCES local_workspace_projections(worktree_id) ON DELETE CASCADE
) STRICT;

-- Immutable subtrees and source inventories are shared across projections and revisions.
-- Large JSON packs measured 410k VFS reads/load WITHOUT ROWID versus 10k with rowid.
CREATE TABLE IF NOT EXISTS local_workspace_tree_packs (
  tree_digest BLOB NOT NULL PRIMARY KEY CHECK (length(tree_digest) = 32),
  records_json TEXT NOT NULL,
  children_json TEXT NOT NULL,
  sweep_epoch INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS local_workspace_source_path_sets (
  path_digest BLOB NOT NULL PRIMARY KEY CHECK (length(path_digest) = 32),
  paths_zstd BLOB NOT NULL,
  sweep_epoch INTEGER NOT NULL
) STRICT, WITHOUT ROWID;

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
  repository_disk_authority_json TEXT,
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
  draft INTEGER,
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
  draft INTEGER,
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

CREATE TABLE IF NOT EXISTS template_installs (
  agent_id TEXT NOT NULL PRIMARY KEY,
  schema_version TEXT NOT NULL,
  source_kind TEXT NOT NULL,
  template_name TEXT NOT NULL,
  template_version TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS template_workspace_files (
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

CREATE TABLE IF NOT EXISTS template_package_refs (
  agent_id TEXT NOT NULL,
  package_kind TEXT NOT NULL,
  package_source TEXT NOT NULL,
  package_ref TEXT NOT NULL,
  package_version TEXT NOT NULL,
  package_integrity TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  template_name TEXT NOT NULL,
  package_status TEXT NOT NULL,
  relationship TEXT NOT NULL CHECK (relationship IN ('managed', 'referenced')),
  origin TEXT NOT NULL CHECK (origin IN ('template-introduced', 'pre-existing')),
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

CREATE TABLE IF NOT EXISTS template_cron_refs (
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

CREATE TABLE IF NOT EXISTS template_mcp_server_refs (
  agent_id TEXT NOT NULL,
  name TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  config_digest TEXT NOT NULL,
  relationship TEXT NOT NULL CHECK (relationship IN ('managed', 'referenced')),
  origin TEXT NOT NULL CHECK (origin IN ('template-introduced', 'pre-existing')),
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
  -- Host-scoped verified credit evidence; current profile bindings govern attribution.
  verified_email_json TEXT,
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
`;function sqliteDatabaseSealSchemaFor(e){requireNodeSqlite();let t=captureSqliteNativeRuntimeAdmission(),n=t?.storageIdentity;if(!t||!n)return;let r=[t.runtime.nodeVersion,t.runtime.bunVersion??null],i=JSON.stringify([t.version,n.sourceId,n.compileOptions,...r]),a=rt(`sha256`).update(JSON.stringify([3,i,e])),o=rt(`sha256`).update(e);return e!==`state`&&(a.update(`42`),a.update(cn),o.update(`42`),o.update(cn)),e!==`agent`&&(a.update(`40`),a.update(ln),o.update(`40`),o.update(ln)),{schemaIdentity:a.digest(`hex`),identity:{runtime:JSON.stringify(r),sqlite:{version:t.version,sourceId:n.sourceId,compileOptions:n.compileOptions.split(`,`).filter(e=>!e.startsWith(`COMPILER=`)).join(`,`)},schema:o.digest(`hex`),policy:3}}}const un={};function sealSchema(e){let t=e.includes(`agent.schema-metadata`),n=t===e.includes(`state.schema-version`)?`other`:t?`agent`:`state`;return un[n]??=sqliteDatabaseSealSchemaFor(n)}const dn={name:`sqlite.full-verification`,lifetime:`process`,read:e=>typeof e==`number`&&Number.isSafeInteger(e)?e:void 0},fn={...dn,name:`sqlite.quick-verification`},pn=/* @__PURE__ */ new Set([`sqlite-schema`,`sqlite.full-verification`,`sqlite.quick-verification`,`state.schema-version`,`state.runtime-schema`,`state.integrity`,`agent.completed-validation`,`agent.canonical-validation-receipt`,`agent.schema-metadata`]);function isSealedKey(e){return pn.has(e)||e.startsWith(`memory.index-schema:`)}function encodeSealValue(e,t){return t instanceof Map?{sealType:`map`,entries:[...t]}:t instanceof Set?{sealType:`set`,entries:[...t]}:t instanceof SharedArrayBuffer?{sealType:`shared`,entries:[...new Int32Array(t)]}:t}function decodeSealValue(e,t){if(!l(t)||!Array.isArray(t.entries))return t;if(t.sealType===`map`)return new Map(t.entries);if(t.sealType===`set`)return new Set(t.entries);if(t.sealType===`shared`){let e=new SharedArrayBuffer(t.entries.length*Int32Array.BYTES_PER_ELEMENT);return new Int32Array(e).set(t.entries),e}return t}var SqliteDatabaseCleanCloseSeals=class{constructor(e,t){this.publishFact=e,this.references=t,this.loaded=/* @__PURE__ */ new WeakMap}isLoaded(e){return this.loaded.has(e)}markLoaded(e){let t=this.references.descriptor(e)??e,n=this.loaded.get(t);n&&n!==e.generation&&Atomics.store(new Int32Array(e.generation),P.sealPresent,Atomics.load(new Int32Array(n),P.sealPresent)),this.loaded.set(t,e.generation)}load(e,t){if(V!==0)return;let n=this.references.descriptor(e)??e;if(this.loaded.has(n))this.markLoaded(e);else{this.markLoaded(e),e.cleanCloseRefusal=`malformed-proof`;try{t?.refusal&&(e.cleanCloseRefusal=t.refusal);let n=t?t.seal:readSqliteCleanCloseSeal(e.location,U.fstatSync(e.descriptor,{bigint:!0}),t=>{e.cleanCloseRefusal=t});if(!n||typeof n.facts!=`string`)return;let r=JSON.parse(n.facts,decodeSealValue);if(!Array.isArray(r)||!r.every(e=>Array.isArray(e)&&e.length===3&&typeof e[0]==`string`&&isSealedKey(e[0])&&typeof e[1]==`boolean`)||!r.some(([e,,t])=>(e===dn.name||e===fn.name)&&t===n.verifiedAt)||!r.some(([e,,t])=>e===`sqlite-schema`&&l(t)))return;let i=sealSchema(r.map(([e])=>e));if(!i){e.cleanCloseRefusal=`identity-mismatch`;return}let a=n.identity;if(a!==void 0&&(!l(a)||typeof a.runtime!=`string`||typeof a.schema!=`string`||typeof a.policy!=`number`))return;if(l(a)&&typeof a.sqlite!=`string`){if(!l(a.sqlite)||typeof a.sqlite.version!=`string`||typeof a.sqlite.sourceId!=`string`||typeof a.sqlite.compileOptions!=`string`)return;let t=a.schema!==i.identity.schema,n=a.policy!==i.identity.policy,r=a.sqlite.compileOptions!==i.identity.sqlite.compileOptions;if(t||n||r){e.cleanCloseRefusal=t?`schema-mismatch`:n?`policy-mismatch`:`feature-mismatch`;return}}else if(n.schemaIdentity!==i.schemaIdentity){e.cleanCloseRefusal=`identity-mismatch`;return}let o=r.find(([e])=>e===`sqlite-schema`)?.[2];if(!(o.tableSql instanceof Map))return;if(hasPendingAgentStartupColumns(o.tableSql)){e.cleanCloseRefusal=`schema-mismatch`;return}delete e.cleanCloseRefusal;for(let[t,n,i]of r)this.publishFact(e,{name:t,schemaDependent:n,lifetime:`process`},{value:i},me(e,n));Atomics.store(new Int32Array(e.generation),P.sealPresent,1)}catch{}finally{this.references.publish(e)}}}invalidate(e,t){invalidateSqliteCleanCloseSeal(t?.location??e),t&&Atomics.store(new Int32Array(t.generation),P.sealPresent,0)}prepare(e,t,n){let r=this.preparePublication(e,t,n);t&&this.references.retain(t);let i=t;return{publish:()=>i!==void 0&&r(),[Symbol.dispose]:()=>{let e=i;i=void 0,e&&this.references.release(e)}}}preparePublication(e,t,n){if(!t||e.isTransaction||n===void 0)return()=>!1;let r=[...t.facts].filter(([e,n])=>isSealedKey(e)&&A(t,n));if(!r.some(([e])=>e===`sqlite-schema`))return()=>!1;let i=JSON.stringify(r.map(([e,t])=>[e,t.schemaDependent,t.value]),encodeSealValue),a=sealSchema(r.map(([e])=>e));return a?()=>{if(e.isOpen||O(t,`retired`)!==0||r.some(([,e])=>Atomics.load(new Int32Array(e.current),0)!==1||e.revision!==me(t,e.schemaDependent)))return!1;try{let e=U.fstatSync(t.descriptor,{bigint:!0});if(I(U.statSync(t.location,{bigint:!0}))!==t.identity)return!1;let r=writeSqliteCleanCloseSeal(t.location,a.schemaIdentity,e,{verifiedAt:n,facts:i,identity:a.identity});return Atomics.store(new Int32Array(t.generation),P.sealPresent,+!!r),r}catch{return!1}}:()=>!1}};u(Symbol.for(`openclaw.sqliteInspectionOperations`),()=>/* @__PURE__ */ new WeakMap),u(Symbol.for(`openclaw.sqliteNativeOpenFailures`),()=>/* @__PURE__ */ new WeakSet),u(Symbol.for(`openclaw.sqliteSnapshotFailureScopes`),()=>new H),b(`sqlite/publication`);const mn=u(Symbol.for(`openclaw.sqlitePostCommitPublications`),()=>/* @__PURE__ */ new WeakMap),hn=u(Symbol.for(`openclaw.sqliteTransactionState`),()=>/* @__PURE__ */ new WeakMap);function hasSqlitePostCommitScope(e){return mn.has(sqlPublicationAnchor(e))}function stageSqliteTransactionState(e,t){let n=hn.get(sqlPublicationAnchor(e));return n?(t.stage?.(),n.push({prepareCommit:t.prepareCommit,commit:t.commit,prepareObservers:t.prepareObservers,invalidate:t.invalidate,rollback:t.rollback}),!0):!1}u(Symbol.for(`openclaw.sqliteNativeExecution`),()=>/* @__PURE__ */ new WeakMap);const gn=u(Symbol.for(`openclaw.sqlitePreparedNativeMutation`),()=>/* @__PURE__ */ new WeakMap);function isPreparingSqliteNativeMutation(e){return gn.get(e)?.phase===`preparing`}new FinalizationRegistry(e=>{for(let t of e)t.finish(!1,!0)});const Y=u(Symbol.for(`openclaw.sqliteDatabaseWriteScopes`),()=>({writeScopes:/* @__PURE__ */ new WeakMap,pendingWriteScopes:/* @__PURE__ */ new WeakMap,localScopeRevisions:/* @__PURE__ */ new WeakMap,localUnscopedRevisions:/* @__PURE__ */ new WeakMap}));function createSqliteDatabaseWriteReceipts(e){function onSqliteDatabaseWriteSettled(t,n){let r=sqlPublicationAnchor(t),i=e.admission(r);if(!i)return;let a=e.writeListeners.get(i);return a||(a=/* @__PURE__ */ new Set,e.writeListeners.set(i,a)),registerListener(a,n)}function settleWorker(t,n){let r=n>0?t.references.get(n):void 0;if(r&&Atomics.exchange(new Int32Array(r),1,0)>0){N(t,`writeRevision`),N(t,`unscopedWriteRevision`);let n=e.writeListeners.get(t);n&&notifyListeners(n,void 0)}}function withSqliteDatabaseWriteScope(t,n,r){let i=sqlPublicationAnchor(t),a=e.admission(i);if(!(a?O(a,`writeScopeRevision`)>0:Y.localScopeRevisions.has(i))){let e=r();if(isPromiseLike(e))throw Error(`SQLite write scopes cannot await work`);return e}let o=normalizedWriteScopes(n),s=Y.writeScopes.get(i);Y.writeScopes.set(i,o);try{let e=r();if(isPromiseLike(e))throw Error(`SQLite write scopes cannot await work`);return e}finally{s?Y.writeScopes.set(i,s):Y.writeScopes.delete(i)}}function withoutSqliteDatabaseWriteScope(e,t){let n=sqlPublicationAnchor(e),r=Y.writeScopes.get(n);Y.writeScopes.delete(n);try{return t()}finally{r&&Y.writeScopes.set(n,r)}}function ensureWriteScopes(t,n,r){let i=!1;for(let e of n){let n=t.writeScopes.get(e);(!n||Atomics.load(n.state,1)!==0||r&&!pinWriteScope(n))&&(n=createScopeRevision(),r&&Atomics.store(n.state,2,1),V===0&&N(t,`writeScopeRevision`),i=!0),r&&r.push(n),pe(t,e,n)}i&&(N(t,`publicationRevision`),e.publish(t,n))}function pinWriteScope(e){let t=Atomics.load(e.state,2);for(;t>=0;){let n=Atomics.compareExchange(e.state,2,t,t+1);if(n===t)return!0;t=n}return!1}let t,n=0;function createScopeRevision(){t&&n!==t.byteLength||(t=new SharedArrayBuffer(48*Int32Array.BYTES_PER_ELEMENT),n=0);let e=new Int32Array(t,n,3);return n+=e.byteLength,{identity:at(),state:e}}function retainSqliteDatabaseWriteScopesForPath(t,n){let r=e.pathAdmission(t);if(!r||D(r))return;let i=[],a=!1,release=()=>{if(!a){a=!0;try{for(let e of i)Atomics.sub(e.state,2,1);i.length>0&&!D(r)&&re(r)&&(N(r,`publicationRevision`),e.publish(r,[]))}finally{e.release(r)}}};try{return e.retain(r),ensureWriteScopes(r,normalizedWriteScopes(n),i),release}catch(e){throw release(),e}}function retireSqliteDatabaseWriteScopes(t,n){let r=sqlPublicationAnchor(t),i=normalizedWriteScopes(n),a=e.admission(r),retire=()=>{let t=a?.writeScopes??Y.localScopeRevisions.get(r),o=n.flatMap(e=>typeof e!=`string`&&e.partition===void 0?[normalizedWriteScopes([e])[0].slice(0,-1)+`,`]:[]);for(let e of t?.keys()??[])o.some(t=>e.startsWith(t))&&i.push(e);if(!a){let e=Y.localScopeRevisions.get(r);for(let t of i)e?.delete(t);return}if(D(a))return;let s=!1;for(let e of i){let t=a.writeScopes.get(e);t&&Atomics.exchange(t.state,1,1)===0&&(s=!0)}s&&(N(a,`writeScopeRevision`),N(a,`publicationRevision`),e.publish(a,i))};!stageSqliteTransactionState(r,{commit:retire})&&!t.isTransaction&&retire()}function prepareSqliteDatabaseScopedWriteRevisionForPath(t,n){let r=retainSqliteDatabaseWriteScopesForPath(t,n);if(!r)return;let i=e.pathAdmission(t);if(!i){r();return}let a=normalizedWriteScopes(n).map(e=>i.writeScopes.get(e)),o=a.map(e=>Atomics.load(e.state,0)),s=/* @__PURE__ */ new WeakMap,c=new Int32Array(i.generation),l=!1,inspectReference=e=>{let t=s.get(e);t||(t=new Int32Array(e),s.set(e,t)),l||=Atomics.load(t,1)>0},u=Atomics.load(c,P.schemaRevision),d=Atomics.load(c,P.unscopedWriteRevision),f=0,p=!1;return{read(){if(p||Atomics.load(c,P.retired)!==0||(l=!1,i.references.forEach(inspectReference),l))return;let e=Atomics.load(c,P.schemaRevision),t=Atomics.load(c,P.unscopedWriteRevision),n=u!==e||d!==t;u=e,d=t;for(let e=0;e<a.length;e++){let t=a[e];if(Atomics.load(t.state,1)!==0)return;let r=Atomics.load(t.state,0);n||=o[e]!==r,o[e]=r}return n&&f++,f},release(){p||(p=!0,r())}}}function scopedWriteToken(e,t,n,r=0){let i=O(e,`schemaRevision`)+r|0,a=[];for(let r of t){let o=e.writeScopes.get(r);if(!o||Atomics.load(o.state,1)!==0)return JSON.stringify([e.identity,e.generationId,i,`database`,O(e,`writeRevision`)+(n===void 0?0:1)|0,t]);a.push([r,o.identity,Atomics.load(o.state,0)+ +!!n?.has(r)|0])}return JSON.stringify([e.identity,e.generationId,i,O(e,`unscopedWriteRevision`)+ +(n===null)|0,a])}function localScopedWriteToken(e,t,n){return JSON.stringify([`memory`,(Y.localUnscopedRevisions.get(e)??0)+ +(n===null),t.map(t=>[t,Y.localScopeRevisions.get(e).get(t).identity,Atomics.load(Y.localScopeRevisions.get(e).get(t).state,0)+ +!!n?.has(t)|0])])}function normalizedWriteScopes(e){return[...new Set((typeof e==`string`?[e]:e).map(e=>JSON.stringify(typeof e==`string`?[`key`,xt(e)]:[`session-id`,xt(e.sessionId),...e.partition===void 0?[]:[xt(e.partition)]])))].toSorted()}function ensureLocalWriteScopes(e,t){let n=Y.localScopeRevisions.get(e)??/* @__PURE__ */ new Map;for(let e of t)n.has(e)||n.set(e,createScopeRevision());Y.localScopeRevisions.set(e,n)}function readScopedWriteToken(t,n,r,i=0){let a=normalizedWriteScopes(n),o=e.admission(t);if(o?ensureWriteScopes(o,a):ensureLocalWriteScopes(t,a),e.readRevision(t)!==void 0)return o?scopedWriteToken(o,a,r,i):localScopedWriteToken(t,a,r)}function readSqliteDatabaseScopedWriteToken(e,t){return readScopedWriteToken(sqlPublicationAnchor(e),t)}function readSqliteDatabaseScopedWriteTokenForPath(t,n,r){let i=normalizedWriteScopes(n),a=e.pathAdmission(t,r);if(a&&!D(a))return ensureWriteScopes(a,i),scopedWriteToken(a,i)}function readSqliteDatabaseScopedWriteTokensForPath(t,n){let r=e.pathAdmission(t);if(!r||D(r))return;let i=n.map(normalizedWriteScopes);return ensureWriteScopes(r,i.flat()),i.map(e=>scopedWriteToken(r,e))}function readSqliteDatabasePendingScopedWriteToken(t,n){let r=sqlPublicationAnchor(t);return readScopedWriteToken(r,n,Y.pendingWriteScopes.get(r),+!!e.hasPendingSchemaMutation(r))}function readSqliteDatabaseWriteTokenForPath(t){let n=e.pathAdmission(t);if(n&&!D(n))return`${n.identity}:${n.generationId}:${O(n,`writeRevision`)}`}function readSqliteDatabasePendingWriteToken(t){let n=sqlPublicationAnchor(t);if(!t.isOpen||!t.isTransaction&&!isPreparingSqliteNativeMutation(n)||!hasSqlitePostCommitScope(n)||e.suspended(n))return;let r=e.writer(n);if(r&&!D(r))return`${r.identity}:${r.generationId}:${O(r,`writeRevision`)+1|0}`}return{cancel(e){Y.pendingWriteScopes.delete(e)},begin(e,t){let n=t?void 0:Y.writeScopes.get(e),r=Y.pendingWriteScopes.get(e);if(!n||r===null)Y.pendingWriteScopes.set(e,null);else{let t=r??/* @__PURE__ */ new Set;for(let e of n)t.add(e);Y.pendingWriteScopes.set(e,t)}},finish(e,t){let n=Y.pendingWriteScopes.get(e);Y.pendingWriteScopes.delete(e);let r=!n;if(n){let i=Y.localScopeRevisions.get(e);for(let e of n){let n=i?.get(e);n&&Atomics.add(n.state,0,1);let a=t?.writeScopes.get(e);a&&Atomics.load(a.state,1)===0?Atomics.add(a.state,0,1):t&&(a||t.writeScopeRevision!==O(t,`writeScopeRevision`))&&(r=!0)}}r&&(Y.localUnscopedRevisions.set(e,(Y.localUnscopedRevisions.get(e)??0)+1),t&&N(t,`unscopedWriteRevision`))},settleWorker,onSqliteDatabaseWriteSettled,retireSqliteDatabaseWriteScopes,retainSqliteDatabaseWriteScopesForPath,prepareSqliteDatabaseScopedWriteRevisionForPath,withSqliteDatabaseWriteScope,withoutSqliteDatabaseWriteScope,readSqliteDatabaseScopedWriteToken,readSqliteDatabaseScopedWriteTokenForPath,readSqliteDatabaseScopedWriteTokensForPath,readSqliteDatabasePendingScopedWriteToken,readSqliteDatabaseWriteTokenForPath,readSqliteDatabasePendingWriteToken}}u(Symbol.for(`openclaw.postgresReadSnapshots`),()=>/* @__PURE__ */ new WeakMap);const _n=u(Symbol.for(`openclaw.sqliteSchemaFacts`),()=>/* @__PURE__ */ new WeakMap),vn=createSqliteDatabaseDescriptorOwner(u(Symbol.for(`openclaw.sqliteDatabaseCleanCloseSeals`),()=>new SqliteDatabaseCleanCloseSeals(publishFact,{retain:e=>k.registry.changeReferences(e,1),release:releaseReference,publish:e=>k.registry.publish(e),descriptor:e=>k.registry.descriptors.get(e.identity)}))),{prepareOwnedSqliteDatabaseAdmission:yn,prepareSqliteDatabaseAdmissionAsync:bn,retainSqliteDatabaseAdmissionLocation:xn,retainPreparedSqliteDatabaseAdmissionLocation:Sn,prepareSqliteDatabaseAdmission:Cn}=vn,{pathAdmission:wn}=vn,{readSqliteDatabaseCleanClose:Tn,readSqliteDatabaseWriteRevision:En,readSqliteDatabaseSiblingWriteRevision:Dn,readSqliteDatabaseIntegrityVerification:On,readSqliteDatabaseCleanCloseRefusal:kn,getSqliteDatabaseAdmission:An,getSqliteDatabaseSchemaRevision:jn,getOrLoadSqliteDatabaseAdmissionForPath:Mn,peekSqliteDatabaseAdmissionForPath:Nn,prepareSqliteDatabaseAdmissionForPath:Pn,hasSqliteDatabaseSchemaAdmissionForPath:Fn,getSqliteDatabaseAdmissionIdentityForPath:In,getSqliteDatabaseAdmissionSourceForPath:Ln,observeSqliteDatabaseAdmissionLocation:Rn,hasSqliteDatabaseSchemaAdmissionForIdentity:zn,retainSqliteDatabaseAdmissionForPath:Bn}=createSqliteDatabaseAdmissionReader({state:k,admission:admission$1,pathAdmission:wn,prepareFileIdentity:Cn,integrityVerificationKey:dn,exchange:E,publishFact,retain:retainReference,release:releaseReference}),Vn=createSqliteDatabaseWriteReceipts({admission:admission$1,pathAdmission:(e,t)=>t?t.key.startsWith(`file:`)?k.registry.records.get(`${t.key.slice(5)}:${t.birthtime}`):void 0:wn(e),retain:retainReference,release:releaseReference,writeListeners:k.writeListeners,readRevision:En,writer:e=>k.dataWriters.get(e),suspended:e=>k.suspended.has(e),hasPendingSchemaMutation:e=>e.isTransaction&&_n.get(e)?.transactionalSchema===!0,publish(e,t){k.registry.publish(e,t),E(e)}}),{onSqliteDatabaseWriteSettled:Hn,retireSqliteDatabaseWriteScopes:Un,retainSqliteDatabaseWriteScopesForPath:Wn,prepareSqliteDatabaseScopedWriteRevisionForPath:Gn,withSqliteDatabaseWriteScope:Kn,withoutSqliteDatabaseWriteScope:qn,readSqliteDatabaseScopedWriteToken:Jn,readSqliteDatabaseScopedWriteTokenForPath:Yn,readSqliteDatabaseScopedWriteTokensForPath:Xn,readSqliteDatabasePendingScopedWriteToken:Zn,readSqliteDatabaseWriteTokenForPath:Qn,readSqliteDatabasePendingWriteToken:$n}=Vn;function admission$1(e,t=!0){let n=k.openedIdentities.get(e);if(!e.isOpen||n===void 0||k.unproven.has(e))return;let r=k.connections.get(e);if(r)return D(r)?void 0:r;let i=e.location();if(!i||i===`:memory:`)return;let a=t&&!e.isTransaction?wn(i,n):k.registry.records.get(n);if(a&&a.identity!==n)throw Error(`SQLite database changed identity before admission`);return a&&!D(a)?retainConnection(e,a):void 0}function retainConnection(e,t){let n=t.identity,r=t;try{for(;;){if(r.identity!==n)throw Error(`SQLite database changed identity during native open`);let t=k.registry.changeReferences(r,1),i=!1;try{t&&E(r);let n=O(r,`retired`);if(n===0)return k.connections.set(e,r),i=!0,r;if(n!==2)throw Error(`SQLite database admission retired during native open`)}finally{i||k.registry.changeReferences(r,-1)}let a=e.location(),o=e.isTransaction?k.registry.records.get(n):a?wn(a,Cn(a)):void 0;if(!o||D(o))throw Error(`SQLite database admission unavailable during native open`);r=o}}catch(t){throw k.openedIdentities.delete(e),t}}function retainReference(e){k.registry.changeReferences(e,1)&&E(e)}function releaseReference(e){k.registry.changeReferences(e,-1)&&(k.localSchemaRevisions.delete(e.identity),E(e))}function publishFact(e,t,n,r){if(t.writer===`host`&&V!==0)throw Error(`SQLite host-owned admission facts require the host publisher`);oe(e,t,n,r,`${V}:${++k.publication}`)&&(k.registry.publish(e),t.writer!==`connection`&&E(e))}function trackSqliteDatabaseAdmissionWorker(e){let t=e.threadId;e.once(`exit`,()=>{for(let e of k.registry.records.values())Vn.settleWorker(e,t);k.registry.releaseWorker(t)})}function isNativeCommitReceipt(e){return l(e)&&e.version===1&&typeof e.sequence==`number`&&Number.isSafeInteger(e.sequence)&&e.sequence>=1&&Object.hasOwn(e,`facts`)}function isNativeSettlementReceipt(e){return l(e)&&(e.kind===`completed`||e.kind===`unknown`)&&(e.committed===void 0||isNativeCommitReceipt(e.committed))}u(Symbol.for(`openclaw.sqliteWorkerNativeCommitReceipts`),()=>/* @__PURE__ */ new WeakMap);function resolveSqliteWorkerFinishSettlement(e,t,n){return e??(n===`not-entered`&&!t?{kind:`completed`}:void 0)}u(Symbol.for(`openclaw.sqliteWorkerOperationAdmission`),()=>new H);function createSqliteWorkerNativeReceiptOwner(e,t){let n=[],r=!1,i,a=0,o,invalidProtocol=e=>t(new T(`SQLite worker ${e} is invalid`,`outcome-unknown`)),installCommitted=o=>{if(o.sequence<=a)return;a=o.sequence;let s={facts:o.facts};i=s,r=!0;try{e(()=>{for(let e of n)e(s)})}catch(e){t(Object.assign(new T(`SQLite committed facts publication failed`,`outcome-unknown`),{cause:e}))}finally{r=!1}};return{get committed(){return i},get settlement(){return o},get observingCommit(){return r},observe(e){n.push(e)},receive(e){if(l(e)&&e.kind===`native-commit`){let t=e.committed;return isNativeCommitReceipt(t)?(installCommitted(t),!0):(invalidProtocol(`commit receipt`),!0)}if(l(e)&&e.kind===`native-settlement`){let t=e.settlement;return isNativeSettlementReceipt(t)?(t.committed!==void 0&&installCommitted(t.committed),o={kind:t.kind,...i?{committed:i}:{}},!0):(invalidProtocol(`native settlement`),!0)}return!1},finish(e){o=resolveSqliteWorkerFinishSettlement(o,i,e),r?queueMicrotask(()=>{n.length=0}):n.length=0}}}const er=/* @__PURE__ */ new WeakMap;u(Symbol.for(`openclaw.sqliteWorkerExecutionAuthorities`),()=>/* @__PURE__ */ new WeakMap);function createSqliteDatabaseAdmissionRelay(e){return createOperationAdmission(()=>{throw Error(`Worker format facts do not grant database authority`)},void 0,e)}function createOperationAdmission(t,n,r,i){let{port1:o,port2:s}=e(()=>new R),c={admit:t,prepare:i,assertRelayCurrent:r,inOwnerContext:H.snapshot()},u=/* @__PURE__ */ new Map,d,f=Se(),p=[],m=!1,h=!1,g,_,v,y,b=new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)),recordFailure=(e,t)=>{(!v||v.source===`domain`&&t!==`domain`)&&(v={error:e,source:t})},refuse=(e,t,n)=>{Atomics.compareExchange(e,0,0,2)===0?(recordFailure(t,n),Atomics.notify(e,0)):Atomics.load(e,0)===1&&p.push(t)},x=createSqliteWorkerNativeReceiptOwner(e=>c?.inOwnerContext(e),e=>recordFailure(e,`protocol`)),receive=e=>{let t=c,n=l(e)?e:void 0;if(g=Ee(n,S.requestClass,g),h=!0,n?.kind===`sqlite-database-admissions`){let e=f.receive(n,S,t?.inOwnerContext,e=>recordFailure(e,`protocol`));if(!e)return;let{message:r,decision:i,deadlineAtMs:a,observedLocation:o,assertWaiting:s,publishFacts:d,failFacts:h,finishFacts:g}=e,_,v=!1;try{if(s(),m||!t)throw new T(`SQLite worker admission is closed`,`closed`);let e=r.create===`admitted`?t.assertRelayCurrent:void 0;if(r.create===`admitted`&&!e)throw new T(`SQLite creation relay is not admitted`,`closed`);let n=ee(r.admissions);if(!n)throw new T(`SQLite admission facts request is invalid`,`unavailable`);te(n);let f=y,b=f?.databaseIdentity,x=b&&(r.location===b.databasePath||r.location===f.databasePath)?b:void 0,S=Ne(),C=!r.create&&(!r.location||Sn(r.location,x,o));if(!S&&C){d(n);return}if(!S&&r.location&&(!r.create||f||e)){let a=r.location,l=r.create,assertCurrent=()=>{if(s(),m||c!==t||y!==f)throw new T(`SQLite worker admission is closed`,`closed`);t.inOwnerContext(()=>{f?.assertRequest?.(),e?.()})};u.set(i,void 0),v=!0,t.inOwnerContext(async()=>{try{await bn({location:a,expectedIdentity:x,observedLocation:o,assertCurrent,...l?{create:{async authorize(e){if(assertCurrent(),l===`admitted`)return;let n=f?.assertCreate?.bind(f),r=f?.prepareCreate?.bind(f);if(!f||!n)throw new T(`SQLite worker file creation requires host authority`,`closed`);f.coldOpenPath&&await resolveIdentityPathViaExistingAncestor(f.coldOpenPath)===e&&(_=f.coldOpenPath),assertCurrent(),t.inOwnerContext(()=>f.assertAccess()),r?await t.inOwnerContext(r,e):t.inOwnerContext(n,e),assertCurrent(),t.inOwnerContext(()=>f.assertAccess()),_=void 0},retain(e){u.set(i,e),e.catch(e=>{p.includes(e)||p.push(e)})}}}:{}}),assertCurrent(),d(n)}catch(e){h(e,_)}finally{u.delete(i),g()}});return}let w=r.location,E=!1;if(r.location&&r.create&&!Cn(r.location)){w=resolveIdentityPathViaExistingAncestorSync(r.location);let e=w,n=y,i=n?.assertCreate?.bind(n);r.create===`admitted`?E=!0:n&&i&&(n.coldOpenPath&&resolveIdentityPathViaExistingAncestorSync(n.coldOpenPath)===e&&(_=n.coldOpenPath),t.inOwnerContext(()=>{n.assertRequest?.(),n.assertAccess(),i(e)}),_=void 0,E=!0)}if(E&&e&&t.inOwnerContext(e),m)throw new T(`SQLite worker admission is closed`,`closed`);if(S){if(S.closed)throw new T(`SQLite admission upstream is closed`,`closed`);te(de({deadlineAtMs:a,assertActive:s},()=>we(S.port,n,w,E?`admitted`:void 0,o)))}else if(w)try{s(),E&&Cn(w,{create:!0});let e=y?.databaseIdentity;xn(w,e&&(w===e.databasePath||w===y?.databasePath)?e:void 0,o)}catch(e){if(!l(e)||e.code!==`ENOENT`)throw e}d(n)}catch(e){h(e,_)}finally{v||g()}return}if(x.receive(e))return;let r=be(e);if(!r){recordFailure(new T(`SQLite worker admission request is invalid`,`unavailable`),`protocol`);return}let{decision:i,expired:a,request:o}=r;if(a())return;u.set(i,void 0);try{_&&t?.inOwnerContext(_,o)}catch(e){refuse(i,e,`domain`);return}if(m||!t){refuse(i,new T(`SQLite worker admission is closed`,`closed`),`authority`);return}let grant=e=>{if(m||a()||Atomics.load(i,0)!==0)return!1;try{t.inOwnerContext(()=>y?.assertAccess())}catch(e){return refuse(i,e,`authority`),!1}if(m||a()||Atomics.load(i,0)!==0||(e?.(),a()))return!1;let n=Atomics.compareExchange(i,0,0,1)===0;return n&&Atomics.notify(i,0),n},s=!1,finishDecision=()=>{u.delete(i),Atomics.load(i,0)===0&&refuse(i,new T(`SQLite worker admission was not granted`,`closed`),`domain`)},d=`authority`;try{if(t.inOwnerContext(()=>{y?.assertRequest?.()}),o.stage===`prepare`&&l(o.facts)&&o.facts.kind===`schema-maintenance`){let e=y;if(!e||typeof o.facts.databasePath!=`string`||resolveIdentityPathViaExistingAncestorSync(o.facts.databasePath)!==e.databasePath)throw new T(`SQLite schema maintenance target differs from its admitted database`,`closed`);t.inOwnerContext(()=>{e.lease??=e.acquireSchema(),e.assertAccess(),e.lease.assertCurrent(),grant()})}else{d=`domain`;let e=t.prepare;if(e){s=!0,(async()=>{try{await t.inOwnerContext(e,o),!m&&!a()&&Atomics.load(i,0)===0&&t.inOwnerContext(t.admit,o,grant)}catch(e){refuse(i,e,`domain`)}finally{finishDecision()}})();return}t.inOwnerContext(t.admit,o,grant)}}catch(e){e instanceof He&&y?.coldOpenPath===e.databasePath&&!y.lease&&o.stage===`prepare`&&l(o.facts)&&o.facts.kind===`schema-maintenance`&&typeof o.facts.databasePath==`string`&&resolveIdentityPathViaExistingAncestorSync(o.facts.databasePath)===y.databasePath?Atomics.compareExchange(i,0,0,4)===0&&Atomics.notify(i,0):refuse(i,e,d)}finally{s||finishDecision()}};o.on(`message`,e=>c?c.inOwnerContext(receive,e):receive(e)).unref();let drain=e=>{for(let t=e;t;t=B(o))receive(t.message)},service=()=>{if(x.observingCommit)return;let e=B(o);if(e)return c?c.inOwnerContext(drain,e):drain(e)},S={port:s,attachment:n===void 0?void 0:{value:n},observeRequests(e){if(m||_)throw new T(`SQLite request observation is already bound or closed`,`closed`);_=e},bindDatabaseAuthority(e){if(m||y)throw new T(`SQLite database authority is already bound or closed`,`closed`);y={...e}},get failure(){return v?.error},get failureSource(){return v?.source},get cleanupFailures(){return p},get committed(){return service(),x.committed},get settlement(){return x.settlement},waitForSettlement(e){for(;;){if(service(),v!==void 0)throw a(v.error,`SQLite worker admission failed`);if(x.settlement?.kind===`completed`)return x.settlement;let t=e-performance.now();if(x.settlement?.kind===`unknown`||m||t<=0)throw new T(`SQLite worker native settlement is unknown`,`outcome-unknown`);Atomics.wait(b,0,0,Math.min(5,t))}},service,abortConstruction(){if(h)throw new T(`SQLite admission construction has already received work`,`closed`);if(S.finish()!==void 0)throw new T(`SQLite unstarted admission cleanup did not finish synchronously`,`closed`)},finish(e){if(d)return d;m=!0,service();let t=[...u.values()].filter(e=>e!==void 0);for(let e of u.keys())Atomics.load(e,0)===0&&refuse(e,new T(`SQLite worker admission is closed`,`closed`),`authority`);o.close(),s.close();let release=()=>{if(x.finish(e),_=void 0,y?.lease)try{y.lease.release(),y.lease=void 0}catch(e){p.push(e)}y?.lease||(y=void 0),c=void 0,f.release(S)};if(t.length===0)release();else return d=Promise.allSettled(t).then(release).finally(()=>{d=void 0}),d}};return er.set(S,e=>{if(m||h)throw new T(`SQLite commit observation is closed or started`,`closed`);x.observe(e)}),S}const tr=new i(Symbol(`spawnBroker`)),nr={startupDisabled:!1};function getSpawnBroker(){let e=tr.getStore();return nr.startupDisabled||e===null?void 0:e??nr.host}const rr=new TextDecoder,ir=/* @__PURE__ */ new Map([[` `,` `],[`
`,`
`],[`\b`,`\\b`],[`\f`,`\\f`],[`\r`,`\\r`],[`	`,`\\t`]]);function renderOutput(e){let t=typeof e==`string`?e:rr.decode(e);return t.endsWith(`
`)&&(t=t.slice(0,t.endsWith(`\r
`)?-2:-1)),bt(t).replace(/[\p{Separator}\p{Other}]/gu,e=>{let t=ir.get(e);if(t!==void 0)return t;let n=e.codePointAt(0),r=n.toString(16);return n<=65535?`\\u${r.padStart(4,`0`)}`:`\\U${r}`})}function decodeExecaMessage(e,t){return e.messageOutputs?[e.message,...e.messageOutputs.map(e=>renderOutput(t[e]))].join(`

`):e.message}function restoreError(e,t){let n=Error(decodeExecaMessage(e,t),{cause:e.cause?restoreError(e.cause,t):void 0});return Object.assign(n,{name:e.name,code:e.code})}function restoreExecaResult(e){let{error:t,...n}=e,r={...n,stdout:n.stdout,stderr:n.stderr,shortMessage:n.shortMessage,code:n.code};if(t){let e=restoreError(t,r);return Object.assign(e,r,{cause:e.cause})}return{...r,cause:void 0}}const X=u(Symbol.for(`openclaw.childRuntimeViability`),()=>({initialPath:process.execPath,initialIdentity:executableIdentity(process.execPath)})),ar=/(?:dyld[^\n]*:\s*Library not loaded:|error while loading shared libraries:)/i,or=/(?:dyld[^\n]*:\s*Symbol not found:|symbol lookup error:|Error loading shared library|version [`'"][^`'"\r\n]+[`'"] not found)/i;function executableIdentity(e){try{return formatExecutableIdentity(ut(e))}catch{return}}function formatExecutableIdentity({dev:e,ino:t,size:n,mtimeMs:r,mode:i}){return`${e}:${t}:${n}:${r}:${i}`}function publishRuntimeViability(e,t){return(c(t,`ENOENT`)||c(t,`ENOTDIR`))&&recordUnavailableRuntime(e,t),{execPath:e,available:!(X.execPath===e&&X.failure)}}async function prepareChildRuntimeViability(e){let t=e?.execPath??process.execPath,n=!(X.execPath===t&&X.failure);if(n)try{let e=await probeChildRuntimeExecutable(t);n=!classifyRuntimeProbe(t,e,await G.stat(t).then(formatExecutableIdentity,()=>void 0),e.error)}catch(e){n=publishRuntimeViability(t,await G.stat(t).then(()=>e,e=>e)).available}return{publish:()=>({execPath:t,available:n&&publishRuntimeViability(t).available})}}function recoverUnavailableRuntime(){if(X.execPath!==process.execPath||!X.failure||!X.recover||X.recoveryStarted)return;X.recoveryStarted=!0;let t=X.recover;e(()=>Promise.resolve().then(t).catch(()=>({status:`report-only`,reason:`Automatic runtime recovery is report-only: service or restart preparation failed. Inspect the service runtime and restart through its owner.`})).then(e=>{b(`gateway/runtime`).warn(`${e.status}: ${e.reason}`)}))}function runtimeProbeOptions(e={}){return{encoding:`utf8`,cwd:e.cwd??K.parse(process.execPath).root,env:e.env??{...process.env,NODE_OPTIONS:void 0},timeout:1e3,maxBuffer:8192}}async function probeChildRuntimeExecutable(e,t={}){let n=getSpawnBroker();if(n){let r=n.spawnExeca([e,`--version`],{...runtimeProbeOptions(t),extendEnv:!1,stripFinalNewline:!1,stdin:`ignore`});r.child.once(`spawn`,()=>{r.child.stdout?.resume(),r.child.stderr?.resume()});let i=restoreExecaResult(await r.result);return await r.child.waitForClose(),{stdout:typeof i.stdout==`string`?i.stdout:``,stderr:typeof i.stderr==`string`?i.stderr:``,error:i instanceof Error?i:void 0,status:i.exitCode??null,signal:i.signal??null}}return new Promise(n=>{kt(e,[`--version`],runtimeProbeOptions(t),(e,t,r)=>n({stdout:t,stderr:r,error:e??void 0,status:e?typeof e.code==`number`?e.code:null:0,signal:e?.signal??null}))})}function formatMissingChildRuntimeWarning(e){return e.available?void 0:`The Node.js runtime this Gateway started with (${y(e.execPath)}) can no longer start worker processes, likely because it was upgraded or removed. Restart the Gateway.`}function assertChildRuntimeAvailable(){if(X.execPath===process.execPath&&X.failure)throw X.failure}function recordUnavailableRuntime(e,t,n){if(X.execPath===e&&X.failure)return X.failure;X.execPath=e;let r=formatMissingChildRuntimeWarning({execPath:e,available:!1}),i=n?.trim();return X.failure=Object.assign(Error(i?`${r}\n${i}`:r,{cause:t}),{code:`NODE_RUNTIME_UNAVAILABLE`}),b(`gateway/runtime`).error(X.failure.message),recoverUnavailableRuntime(),X.failure}function needsRuntimeProbe(e){return!!(e.error||e.signal===`SIGABRT`||or.test(e.stderr??``))}function classifyRuntimeProbe(e,t,n,r){if(X.execPath===e&&X.failure)return X.failure;let i=e!==X.initialPath||n!==X.initialIdentity;return ar.test(t.stderr)||or.test(t.stderr)||c(t.error,`ENOENT`)||c(t.error,`ENOTDIR`)||i&&(t.signal===`SIGABRT`||c(t.error,`ENOEXEC`)||c(t.error,`EACCES`)||c(t.error,`EPERM`))?recordUnavailableRuntime(e,r,t.stderr):void 0}async function prepareChildRuntimeFailure(e){if(e.started)return;let t=e.execPath??process.execPath;if(X.execPath===t&&X.failure)return X.failure;if(ar.test(e.stderr??``)||e.error&&!(await prepareChildRuntimeViability({execPath:t})).publish().available)return recordUnavailableRuntime(t,e.error,e.stderr);if(!e.error&&needsRuntimeProbe(e))return classifyRuntimeProbe(t,await probeChildRuntimeExecutable(t),t===X.initialPath?await G.stat(t).then(formatExecutableIdentity,()=>void 0):void 0,e.error)}const sr=new H;function getSpawnBrokerAdmission(){return sr.getStore()??`command`}function waitForBrokerChildCompletion(e){return new Promise(t=>{let n=e.exitCode!=null||e.signalCode!=null,r=!e.connected,i=0,finish=()=>{n&&r&&i===0&&(e.removeListener(`exit`,onExit),e.removeListener(`error`,onError),e.removeListener(`disconnect`,onDisconnect),t())},onExit=()=>{n=!0,finish()},onError=()=>{e.pid===void 0&&(n=!0,r=!0,finish())},onDisconnect=()=>{r=!0,finish()};e.once(`exit`,onExit),e.on(`error`,onError),e.once(`disconnect`,onDisconnect);for(let t of e.stdio??[])t&&!t.closed&&(i++,t.once(`close`,()=>{i--,finish()}));finish()})}function isContinuationByte(e){return e!==void 0&&(e&192)==128}function truncateUtf8Suffix(e,t){if(t<=0)return``;if(e.length<=t&&Pt.byteLength(e)<=t)return e;let n=Pt.from(Number.isInteger(t)?e.slice(-t-1):e),r=n.byteLength-t;for(;r<n.byteLength&&isContinuationByte(n[r]);)r+=1;return n.subarray(r).toString(`utf8`)}function childCapacityError(e,t){let n=0,r=0;for(let t of e)n++,t===`mcp`&&r++;if(n>=512)return`Spawn broker child capacity exceeded (512); close running processes before retrying`;if(t===`mcp`&&r>=448)return`Spawn broker MCP child capacity exceeded (448); close unused MCP sessions before retrying`}var SpawnBrokerError=class extends Error{constructor(e,t){super(e,t),this.code=`ERR_SPAWN_BROKER_UNAVAILABLE`,this.name=`SpawnBrokerError`}};function serializeBrokerError(e){return{message:e.message,code:e.code,errno:e.errno,syscall:e.syscall,path:e.path}}function observeBrokerChildDiagnostics(e){let t=process.execPath,n=!1;e.once(`message`,()=>{n=!0});let r=``;return e.stderr?.setEncoding(`utf8`).on(`data`,e=>{r=truncateUtf8Suffix(r+e,2048)}),async()=>{let i=m(r).trim();return await prepareChildRuntimeFailure({execPath:t,stderr:r,signal:e.signalCode,started:n})??/* @__PURE__ */ Error(`exited with code=${e.exitCode??`null`} signal=${e.signalCode??`none`}${i?`\nstderr:\n${i}`:``}`)}}async function prepareBrokerFailureCause(e,t){try{return await e??t}catch(e){return AggregateError(t?[t,e]:[e],`Spawn broker diagnosis failed`,{cause:t})}}function createBrokerFailureError(e,t){return new SpawnBrokerError(e&&c(e,`NODE_RUNTIME_UNAVAILABLE`)?e.message:t?`Spawn broker exited; command outcome is unavailable`:`Spawn broker failed before readiness: ${e?.message??`channel lost`}`,{cause:e})}const cr=4096;function killProcessTree(e,t){if(!Number.isFinite(e)||e<=0)return;if(process.platform===`win32`){if(t?.force===!0){signalProcessTreeWindowsAndWait(e,`SIGKILL`);return}killProcessTreeWindows(e,normalizeGraceMs(t?.graceMs));return}let n=t?.detached===!0||t?.detached!==!1&&isProcessGroupLeader(e),r=t?.detached===!1&&!n&&process.platform===`linux`,i=r?collectUnixProcessTree(e):void 0;if(r&&!i){signalProcessTreeUnix(e,t?.force===!0?`SIGKILL`:`SIGTERM`,!1);return}let a=!1,force=()=>{if(a)return;a=!0;let t=i?.filter(verifiedProcessInstanceAlive)??[];(n?isProcessAlive(-e):r?t.length>0:isProcessAlive(e))&&signalProcessTreeUnix(e,`SIGKILL`,n,i?t:void 0)};if(t?.force===!0){i?force():signalProcessTreeUnix(e,`SIGKILL`,n);return}signalProcessTreeUnix(e,`SIGTERM`,n,i);let o=normalizeGraceMs(t?.graceMs),s=setTimeout(force,o);r||s.unref();let c=!1;return{force:()=>{clearTimeout(s),force()},exited:()=>(c||=n?!isProcessAlive(-e):i?!i.some(capturedProcessInstanceMayBeAlive):!isProcessAlive(e),c&&(a=!0,clearTimeout(s)),c)}}function normalizeGraceMs(e){return typeof e!=`number`||!Number.isFinite(e)?3e3:Math.max(0,Math.min(6e4,Math.floor(e)))}function isProcessAlive(e){try{process.kill(e,0)}catch(e){if((typeof e==`object`&&e&&`code`in e?e.code:void 0)!==`EPERM`)return!1}if(e<0||process.platform!==`linux`)return!0;try{let t=W(`/proc/${e}/status`,`utf8`);return!(t.match(/^State:\s+(\S)/m)?.[1]===`Z`&&/^Threads:[ \t]+1[ \t]*$/m.test(t))}catch{return!0}}function parseProcessGroupId(e){if(typeof e!=`string`||!/^\d+$/.test(e.trim()))return;let t=Number(e.trim());return Number.isSafeInteger(t)&&t>0?t:void 0}function readPsOutput(e){try{let t=jt(`ps`,e,{encoding:`utf8`,timeout:500});return t.error||t.status!==0?void 0:t.stdout}catch{return}}function readProcStatFields(e){try{let t=W(`/proc/${e}/stat`,`utf8`),n=t.lastIndexOf(`)`);return n<0?void 0:t.slice(n+1).trim().split(/\s+/)}catch{return}}function isProcessGroupLeader(e){return((process.platform===`linux`?parseProcessGroupId(readProcStatFields(e)?.[2]):void 0)??parseProcessGroupId(readPsOutput([`-p`,String(e),`-o`,`pgid=`])))===e}function parsePositivePids(e){return typeof e==`string`?e.trim().split(/\s+/u).map(e=>Number(e)).filter(e=>Number.isSafeInteger(e)&&e>0):[]}function readUnixProcessIdentity(e,t){return readUnixProcessInstance(e,t)?.identity}function readUnixProcessInstance(e,t){if(t!==void 0&&Date.now()>=t||process.platform!==`linux`)return;let n=readProcStatFields(e),r=Number(n?.[1]),i=n?.[19];if(i&&/^\d+$/u.test(i)&&Number.isSafeInteger(r))return{identity:`${e}:${i}`,ppid:r}}function verifiedProcessInstanceAlive(e){return!e.identity||!isProcessAlive(e.pid)?!1:readUnixProcessIdentity(e.pid)===e.identity}function capturedProcessInstanceMayBeAlive(e){if(!e.identity||!isProcessAlive(e.pid))return!1;let t=readUnixProcessIdentity(e.pid);return t===void 0||t===e.identity}function*readUnixProcessChildren(e,t){let n;try{for(n=st(`/proc/${e}/task`);t();){let t=n.readSync();if(!t)return;let r=parseProcessGroupId(t.name);if(r)try{yield*parsePositivePids(W(`/proc/${e}/task/${r}/children`,`utf8`))}catch{}}}catch{}finally{try{n?.closeSync()}catch{}}}function collectUnixProcessTree(e){if(process.platform!==`linux`)return;let t=[],n=/* @__PURE__ */ new Set([e]),r=0,i=Date.now()+500,a=readUnixProcessIdentity(e,i);if(!a||Date.now()>=i)return;let withinBounds=e=>Date.now()<i&&e<=128,hasCapacity=()=>n.size<cr,visit=(e,a,o)=>{if(!withinBounds(o)||!hasCapacity()||readUnixProcessIdentity(e,i)!==a)return;let s=readUnixProcessChildren(e,()=>withinBounds(o)&&hasCapacity()&&r++<cr&&readUnixProcessIdentity(e,i)===a);for(let r of s){if(!withinBounds(o+1)||!hasCapacity())return;if(n.has(r)||r===process.pid)continue;n.add(r);let a=readUnixProcessInstance(r,i);a&&a.ppid===e&&withinBounds(o+1)&&(visit(r,a.identity,o+1),t.push({pid:r,identity:a.identity}))}};return visit(e,a,0),[...t,{pid:e,identity:a}]}function signalProcessTreeUnix(e,t,n,r){if(n){signalUnixTarget(-e,t);return}let i=r??[{pid:e}];for(let e of i)(!r||verifiedProcessInstanceAlive(e))&&signalUnixTarget(e.pid,t)}function signalUnixTarget(e,t){try{process.kill(e,t)}catch{}}function runTaskkill(e,t){return new Promise(n=>{let r=!1,finish=e=>{r||(r=!0,clearTimeout(i),t?.(e),n())},i=setTimeout(()=>finish(null),3e3);i.unref?.();try{let t=At(`taskkill`,e,{stdio:`ignore`,detached:!0,windowsHide:!0});t.once(`error`,()=>finish(null)),t.once(`close`,e=>finish(e))}catch{finish(null)}})}function killProcessTreeWindows(e,t){let n=!1,r,forceKill=()=>{n||(n=!0,r!==void 0&&(clearTimeout(r),r=void 0),isProcessAlive(e)&&signalProcessTreeWindowsAndWait(e,`SIGKILL`))};signalProcessTreeWindowsAndWait(e,`SIGTERM`,e=>{e!==null&&e!==0&&forceKill()}),r=setTimeout(forceKill,t),r.unref()}function signalProcessTreeWindowsAndWait(e,t,n){return runTaskkill(t===`SIGKILL`?[`/F`,`/T`,`/PID`,String(e)]:[`/T`,`/PID`,String(e)],n)}function isDeniedProcessGroupProbe(e,t=0){if(process.platform!==`linux`||!c(e,`EPERM`))return!1;try{return process.kill(-4194305,t),!1}catch(e){return c(e,`EPERM`)}}function probeProcessGroup(e){try{return process.kill(-e,0),`alive`}catch(e){return c(e,`ESRCH`)?`gone`:isDeniedProcessGroupProbe(e)?`denied`:`alive`}}function isProcessGroupGoneByKernel(e){return probeProcessGroup(e)===`gone`}function isProcessGroupGone(e){let t=probeProcessGroup(e);return t===`gone`||t===`denied`&&isProcessGroupGoneByCensus(e)}async function isProcessGroupGoneAsync(e){let t=probeProcessGroup(e);return t===`gone`||t===`denied`&&await isProcessGroupGoneByCensusAsync(e)}function readCommandProcessStartTime(e,t={}){return process.platform!==`linux`&&process.platform!==`android`?t.instance?getProcessInstanceStartTime(e):getFileLockProcessStartTime(e):G.readFile(`/proc/${e}/stat`,`utf8`).then(n=>t.child&&(t.child.exitCode!=null||t.child.signalCode!=null)?null:parseLinuxProcessStat(e,n)?.startedAt??null,()=>null)}const lr=5e3;function isBrokerChildGroupAlive(e){if(isProcessGroupGone(e.pid))return!1;let t=getProcessInstanceStartTime(e.pid);if(e.isLeaderAlive)return e.isLeaderAlive()||isPidDefinitelyDead(e.pid)?e.startedAt===null||t===null||t===e.startedAt:!1;if(e.startedAt===null||t===null&&!isPidDefinitelyDead(e.pid))throw new SpawnBrokerError(`Spawn broker group leader identity is unavailable for pid=${e.pid}`);return t===null||t===e.startedAt}function signalRevalidatedGroupMembers(e,t,{snapshot:r,signaled:i}){if(!isOwnProcfs())throw new SpawnBrokerError(`Spawn broker cannot verify the process table belongs to its PID namespace`);let a=r.filter(t=>t.pid!==process.pid&&t.pgid===e&&!isPidDefinitelyDead(t.pid));if(!a.length)return 0;let o=new Map(a.map(e=>[e.pid,getProcessInstanceStartTime(e.pid)])),s;for(let r of readProcessGroupMembers(1e3)){if(r.pid===process.pid||r.pgid!==e||!o.has(r.pid))continue;let a=o.get(r.pid);if(a===null){if(!isPidDefinitelyDead(r.pid))throw new SpawnBrokerError(`Spawn broker cannot identify remaining group member pid=${r.pid}`);continue}if(getProcessInstanceStartTime(r.pid)!==a)continue;let c=`${r.pid}:${a}`;if(i.get(c)!==t){try{process.kill(r.pid,t)}catch(e){if(n(e)!==`ESRCH`){s??={error:e};continue}}i.set(c,t)}}if(s)throw s.error;return a.length}async function signalRevalidatedGroupMembersAsync(e,t,{snapshot:r,signaled:i}){if(!await isOwnProcfsAsync())throw new SpawnBrokerError(`Spawn broker cannot verify the process table belongs to its PID namespace`);let a=/* @__PURE__ */ new Map;for(let t of r)t.pid!==process.pid&&t.pgid===e&&!await isPidDefinitelyDeadAsync(t.pid)&&a.set(t.pid,await readCommandProcessStartTime(t.pid,{instance:!0}));if(!a.size)return 0;let o;for await(let r of readLinuxProcessGroupMembersAsync(1e3)){if(r.pid===process.pid||r.pgid!==e||!a.has(r.pid))continue;let s=a.get(r.pid);if(s===null){if(!await isPidDefinitelyDeadAsync(r.pid))throw new SpawnBrokerError(`Spawn broker cannot identify remaining group member pid=${r.pid}`);continue}let c=await readLinuxProcessGroupMemberAsync(r.pid).catch(()=>void 0),l=t();if(!l)return a.size;if(!c||c.pgid!==e||c.startedAt!==s)continue;let u=`${r.pid}:${s}`;if(i.get(u)!==l){try{process.kill(r.pid,l)}catch(e){if(n(e)!==`ESRCH`){o??={error:e};continue}}i.set(u,l)}}if(o)throw o.error;return a.size}function terminateRetainedBrokerChildGroup(e){let t=!1,r=!1,i,a,o=`SIGTERM`,s=/* @__PURE__ */ new Map,signalMembers=()=>{try{signalRevalidatedGroupMembers(e.pid,o,{snapshot:[...readProcessGroupMembers(1e3)],signaled:s})}catch(e){i=e}},signal=r=>{if(!t){if(!isBrokerChildGroupAlive(e))t=!0;else{o=r;try{process.kill(-e.pid,r)}catch(e){if(isDeniedProcessGroupProbe(e,r))a=e,signalMembers();else if(n(e)===`ESRCH`)t=!0;else throw e}}}},force=()=>{t||r||(r=!0,signal(`SIGKILL`))};return{force,settled:(async()=>{let n=performance.now()+lr,r=n+2e3;try{for(signal(`SIGTERM`);!t&&isBrokerChildGroupAlive(e);){if(performance.now()>=n&&force(),a&&!t&&signalMembers(),performance.now()>=r)throw new SpawnBrokerError(`Spawn broker child cleanup could not be confirmed for pid=${e.pid}`,{cause:i??a});await Tt(50)}}finally{t=!0}})()}}function terminateLostBrokerChild(e,t,n){if(t&&n){if(n.pid!==e)throw new SpawnBrokerError(`Spawn broker cleanup identity changed`);return terminateRetainedBrokerChildGroup(n)}let r=killProcessTree(e,{detached:t,graceMs:lr}),i=performance.now()+lr+2e3;return{force:()=>r?.force(),settled:(async()=>{for(;;){if(t){if(r?.exited(),await isPidDefinitelyDeadAsync(e)&&await isProcessGroupGoneAsync(e))break}else if(await isPidDefinitelyDeadAsync(e)&&(r?.exited()??!0))break;if(performance.now()>=i)throw new SpawnBrokerError(`Spawn broker child cleanup could not be confirmed for pid=${e}`);await Tt(50)}})()}}function terminateBrokerProcessGroup(e){let t=!1,r,i,a=`SIGTERM`,o=/* @__PURE__ */ new Map,s,retire=()=>{t=!0,clearTimeout(s)},signalMembers=async()=>{try{let n=[];for await(let e of readLinuxProcessGroupMembersAsync(1e3))n.push(e);await signalRevalidatedGroupMembersAsync(e,()=>t?void 0:a,{snapshot:n,signaled:o})}catch(e){r=e}},signal=async o=>{if(t||isProcessGroupGoneByKernel(e))retire();else{a=o;try{process.kill(-e,o)}catch(e){isDeniedProcessGroupProbe(e,o)?(i=e,await signalMembers()):n(e)!==`ESRCH`&&(r=e)}}},force=()=>{if(!t){if(isProcessGroupGone(e))retire();else{a=`SIGKILL`,clearTimeout(s);try{process.kill(-e,a)}catch(t){if(isDeniedProcessGroupProbe(t,a)){i=t;try{signalRevalidatedGroupMembers(e,a,{snapshot:[...readProcessGroupMembers(1e3)],signaled:o})}catch(e){r=e}}else n(t)!==`ESRCH`&&(r=t)}}}},c,escalate=()=>{t||c||(a=`SIGKILL`,c=(async()=>{await isProcessGroupGoneAsync(e)?retire():t||await signal(`SIGKILL`)})().catch(e=>{r=e}))};return{force,settled:(async()=>{try{if(await isProcessGroupGoneAsync(e))return;await signal(a),!t&&a===`SIGTERM`&&(s=setTimeout(escalate,lr));let n=performance.now()+lr+2e3;for(;await c,!(t||await isProcessGroupGoneAsync(e));){if(performance.now()>=n)throw new SpawnBrokerError(`Spawn broker group cleanup could not be confirmed for pgid=${e}`,{cause:r??i});i&&await signalMembers(),await Tt(50)}}finally{retire(),await c}})()}}function brokerSpawnOptions(e){let t=e.stdio??`pipe`,n=typeof t==`string`?[t,t,t]:[...t],r=[];for(let e=0;e<Math.max(3,n.length);e+=1){let t=n[e]??(e<3?`pipe`:`ignore`);if(t===`inherit`&&e!==0||t!==`pipe`&&t!==`ignore`&&t!==`inherit`&&t!==`ipc`)return;r.push(t)}if(e.signal||e.timeout||e.killSignal)throw Error(`Unsupported spawn broker cancellation options`);return{cwd:e.cwd instanceof URL?q(e.cwd):e.cwd,env:e.env?{...e.env}:{...process.env},argv0:e.argv0,detached:e.detached,shell:e.shell,windowsHide:e.windowsHide,windowsVerbatimArguments:e.windowsVerbatimArguments,serialization:e.serialization,uid:e.uid,gid:e.gid,stdio:r}}const ur=/* @__PURE__ */ new WeakMap,holdReadable=()=>{};function holdPipe(e){let t={read:e.read.bind(e),resumed:!1,onResume:()=>{t.resumed=!0}};ur.set(e,t),e.on(`resume`,t.onResume),e.on(`readable`,holdReadable),e.read=()=>null}function restoreStdinPipe(e){let t=Reflect.get(e,`_readableState`);if(!t||typeof t!=`object`||[`ended`,`endEmitted`,`reading`].some(e=>typeof Reflect.get(t,e)!=`boolean`))throw new SpawnBrokerError(`Spawn broker requires a Node readable state for stdin`);stopPipeReads(e),Object.assign(t,{readable:!1,ended:!0,endEmitted:!0,reading:!1})}function stopPipeReads(e){let t=Reflect.get(e,`_handle`);if(!t||typeof t!=`object`||!(`readStop`in t)||typeof t.readStop!=`function`||!(`reading`in t)||typeof t.reading!=`boolean`)throw new SpawnBrokerError(`Spawn broker requires a transferable Node pipe handle`);if(t.readStop()!==0)throw new SpawnBrokerError(`Spawn broker could not stop pipe reads`);t.reading=!1}function releasePipe(e){let t=restoreReader(e);t&&process.nextTick(()=>{e.destroyed||(e.emit(`readable`),t.resumed&&e.resume())})}function restoreReader(e){let t=ur.get(e);if(t)return e.read=t.read,ur.delete(e),e.removeListener(`resume`,t.onResume),e.removeListener(`readable`,holdReadable),t}var BrokerChild=class extends Lt{constructor(e,t,n,r=!1){super(),this.requestId=e,this.transmit=n,this.fileOutputPending=r,this.callbackContext=new nt(`OpenClawSpawnBrokerChild`),this.stdin=null,this.stdout=null,this.stderr=null,this.connected=!1,this.killed=!1,this.exitCode=null,this.signalCode=null,this.stdio=[null,null,null,null,null],this.opened=L(),this.completion=L(),this.pipes=/* @__PURE__ */ new Set,this.sends=/* @__PURE__ */ new Map,this.sendSequence=0,this.spawnReceived=!1,this.eventsReleased=!1,this.pendingEventOverflow=!1,this.pendingEvents=[],this.exited=!1,this.closed=!1,this.processNotStarted=!1,this.spawnfile=t[0],this.spawnargs=[...t],this.opened.promise.catch(()=>{}),this.on(`error`,()=>{})}markNotStarted(){this.processNotStarted=!0}get notStarted(){return this.processNotStarted}ready(){return this.opened.promise}emit(e,...t){return this.callbackContext.runInAsyncScope(()=>super.emit(e,...t))}waitForClose(){return this.completion.promise}settleFileOutput(){this.fileOutputPending=!1,this.finishClose()}attachPipe(e,t){t.emit=this.callbackContext.bind(t.emit.bind(t)),this.stdio[e]=t,e===0&&(this.stdin=t),e===1&&(this.stdout=t),e===2&&(this.stderr=t),this.pipes.add(t);let n=!1,acknowledge=t=>{n||(n=!0,this.transmit({type:`output-drained`,id:this.requestId,fd:e,error:t?serializeBrokerError(t):void 0}).catch(()=>{}))};t.once(e===0?`finish`:`end`,()=>acknowledge()),t.on(`error`,acknowledge),t.once(`close`,()=>{acknowledge(),this.pipes.delete(t),this.finishClose()})}receive(e){if(e.type===`spawned`){if(this.spawnReceived||this.closed)return;for(this.spawnReceived=!0,this.pid=e.pid,this.spawnfile=e.spawnfile,this.spawnargs=e.spawnargs,this.connected=e.connected,this.stdio.splice(e.stdioLength);this.stdio.length<e.stdioLength;)this.stdio.push(null);this.connected&&(this.channel=Object.assign(new Lt,{ref(){},unref(){}})),this.opened.resolve(),setImmediate(()=>{this.closed||(this.emit(`spawn`),setImmediate(()=>{for(let[e,t]of this.stdio.entries())e>0&&t instanceof J&&!t.destroyed&&releasePipe(t);this.eventsReleased=!0;for(let e of this.pendingEvents.splice(0))e()}))})}else!this.eventsReleased&&(this.spawnReceived||e.type!==`error`)?this.deferEvent(()=>this.emitMessage(e)):this.emitMessage(e)}deferEvent(e){this.pendingEventOverflow||(this.pendingEvents.length>=64?(this.pendingEventOverflow=!0,this.pendingEvents.splice(0),this.pendingEvents.push(()=>{this.kill(`SIGKILL`),this.failNow(new SpawnBrokerError(`Spawn broker startup event capacity exceeded`))})):this.pendingEvents.push(e))}emitMessage(e){switch(e.type){case`error`:{let t=Object.assign(Error(e.error.message),e.error);this.opened.reject(t),this.emit(`error`,t),this.pid||(this.exited=!0,this.finishClose());break}case`exit`:this.exited=!0,this.exitCode=e.code,this.signalCode=e.signal,this.stdin?.destroy(),this.emit(`exit`,e.code,e.signal),process.nextTick(()=>{for(let e of this.pipes)e.readable&&e.resume()}),this.finishClose();break;case`ipc-sent`:this.finishSend(e.sequence,e.error?Object.assign(Error(e.error.message),e.error):null);break;case`disconnect`:this.failSends(/* @__PURE__ */ Error(`Child process IPC channel is closed`)),this.connected=!1,this.channel=void 0,this.emit(`disconnect`),this.finishClose();break;case`ipc`:this.emit(`message`,e.message);break;case`closed`:this.finishClose()}}fail(e){this.spawnReceived&&!this.eventsReleased?this.deferEvent(()=>this.failNow(e)):this.failNow(e)}failNow(e){if(this.closed)return;this.opened.reject(e);let t=this.connected;this.connected=!1,this.channel=void 0,this.failSends(e),t&&this.emit(`disconnect`),this.exited||this.emit(`error`,e);for(let t of this.pipes)t.destroy(e);this.exited=!0,this.finishClose()}finishClose(){!this.exited||this.channel||this.pipes.size>0||this.closed||this.fileOutputPending||(this.closed=!0,this.completion.resolve(),this.emit(`close`,this.exitCode,this.signalCode))}kill(e=`SIGTERM`){return!this.exited&&(this.killed=!0,this.transmit({type:`kill`,id:this.requestId,signal:e}).catch(e=>this.fail(a(e,`Spawn broker signal delivery failed`))),!0)}send(e,t,n,r,i){let o=typeof t==`function`?t:typeof n==`function`?n:r;if(!this.connected||this.sends.size>=1024){let e=/* @__PURE__ */ Error(this.connected?`Child process IPC capacity exceeded`:`Child process IPC channel is closed`);return queueMicrotask(()=>o?o(e):this.emit(`error`,e)),!1}let s=++this.sendSequence;this.sends.set(s,nt.bind(e=>{o?o(e):e&&this.emit(`error`,e)}));let c=typeof t==`function`?void 0:t;return this.transmit({type:`ipc`,id:this.requestId,sequence:s,message:e},c,i).catch(e=>this.finishSend(s,a(e,`Spawn broker IPC delivery failed`))),!0}finishSend(e,t){let n=this.sends.get(e);this.sends.delete(e),n?.(t)}failSends(e){for(let t of this.sends.keys())this.finishSend(t,e)}disconnect(){this.connected&&(this.connected=!1,this.transmit({type:`disconnect`,id:this.requestId}).catch(e=>this.fail(a(e,`Spawn broker disconnect failed`))))}ref(){}unref(){}[Symbol.dispose](){this.kill(`SIGTERM`)}};function createBrokerCommandRequest(e,t,n){let r=e.type!==`spawn-execa`&&e.outputFile?L():void 0,i=e.type===`spawn-execa`?L():void 0;return r?.promise.catch(()=>{}),i?.promise.catch(()=>{}),{child:new BrokerChild(e.id,e.argv,n,!!r),initiateSpawn:t,result:i,output:r,childClosed:!1,resultSettled:!i&&!r,detached:e.options.detached===!0||e.type===`spawn-execa`&&e.options.killDescendants===!0}}function createBrokerCommands(e){let native=(t,n,r,i,a,o)=>{let s={type:i?`prepare-spawn`:`spawn`,id:e.nextId(),argv:[t,...n],options:r,execCgroup:a};return o&&(s.outputFile=o),e.admit(s,i)};return{spawn:(e,t,n,r,i)=>{let a=brokerSpawnOptions(n);if(!a)throw Error(`Unsupported spawn broker stdio or process options`);return native(e,t,a,r,i).child},spawnToFile:(e,t,n,r,i,a)=>{let o=native(e,t,n,i,a,r);return{child:o.child,output:o.output.promise}},spawnExeca:(t,n,r)=>{let i=e.nextId(),o=e.admit({type:`spawn-execa`,id:i,argv:t,options:n,execCgroup:r});return{child:o.child,result:o.result.promise,cancel:()=>{e.cancel(i).catch(e=>o.child.fail(a(e,`Spawn broker cancellation delivery failed`)))}}}}}function receiveBrokerCommandResponse(e,t,n,r){if(t.type===`pipe`){try{if(t.closed&&t.fd===0){let n=new J;e.child.attachPipe(t.fd,n),n.destroy()}else if(n instanceof J)t.fd===0?restoreStdinPipe(n):holdPipe(n),e.child.attachPipe(t.fd,n);else throw new SpawnBrokerError(`Spawn broker pipe transfer failed`)}catch(e){throw n instanceof J&&n.destroy(),e}return r({type:`pipe-received`,id:t.id,fd:t.fd})}if(t.type===`pipe-prefix`){let n=e.child.stdio[t.fd];n instanceof J&&t.bytes.length>0&&n.unshift(t.bytes)}else t.type===`file-output`?(e.nativeClosed=!0,`error`in t?e.output?.reject(Object.assign(Error(t.error.message),t.error)):e.output?.resolve(t.bytes),e.resultSettled=!0,e.child.settleFileOutput()):t.type===`execa-result`?(e.pid===void 0&&t.result.failed&&e.child.markNotStarted(),e.result?.resolve(t.result),e.resultSettled=!0):(t.type===`closed`?e.nativeClosed=!0:t.type===`error`&&t.notStarted&&e.child.markNotStarted(),t.type===`error`&&t.resultUnavailable&&e.output&&(e.output.reject(Object.assign(Error(t.error.message),t.error)),e.resultSettled=!0,e.child.settleFileOutput()),t.type===`error`&&t.resultUnavailable&&e.result&&(e.result.reject(Object.assign(Error(t.error.message),t.error)),e.resultSettled=!0),e.child.receive(t))}var BrokerFileReads=class{constructor(e){this.host=e,this.pending=/* @__PURE__ */ new Map,this.sequence=0}get size(){return this.pending.size}async read(e,t){return(await this.request({filePath:e},t)).buffer}async readPage(e,t,n){return this.request({filePath:e,page:t},n)}async request(e,t){if(t?.throwIfAborted(),await this.host.ready(),t?.throwIfAborted(),!this.host.canAdmit())throw new SpawnBrokerError(`Spawn broker cannot admit a raw file read`);let n=++this.sequence,r=L();this.pending.set(n,{chunks:[],result:r});let abort=()=>{r.reject(t?.reason),this.host.send({type:`cancel-read-file`,id:n}).catch(()=>{})};t?.addEventListener(`abort`,abort,{once:!0}),this.host.send({type:`read-file`,id:n,...e}).catch(r.reject);try{return await r.promise}finally{t?.removeEventListener(`abort`,abort),this.pending.delete(n)}}receive(e){if(e.type!==`file-read-chunk`&&e.type!==`file-read-result`)return!1;let t=this.pending.get(e.id);return t&&(e.type===`file-read-chunk`?t.chunks.push(e.bytes):e.error?t.result.reject(Object.assign(e.error,{code:e.code})):t.result.resolve(e.page??{buffer:Buffer.concat(t.chunks)})),!0}fail(e){for(let t of this.pending.values())t.result.reject(e);this.pending.clear()}};const Z=1048576,dr=`openclaw-spawn-broker-frame`;var BrokerIpcAdmissionError=class extends SpawnBrokerError{};function createBrokerSender(e){let t=0,n=0,r=0,i=Promise.resolve(),write=(t,n,r)=>new Promise((i,o)=>{try{let launch=()=>e(t,n,e=>e?o(e):i());r?r(launch):launch()}catch(e){o(a(e,`Spawn broker IPC write failed`))}}),enqueue=(e,r)=>{if(t+e>268435456||n>=1024)return Promise.reject(new BrokerIpcAdmissionError(`Spawn broker IPC capacity exceeded`));t+=e,n+=1;let a=i.then(r);return i=a.then(()=>{},()=>{}),a.finally(()=>{t-=e,--n})};return Object.assign((e,t,n)=>{let i=Ct(e),a=i.byteLength;if(a>Z&&t)return Promise.reject(new BrokerIpcAdmissionError(`Spawn broker handle metadata exceeds one IPC frame`));let o=++r;return enqueue(a,async()=>{if(a<=Z)await write(e,t,n);else for(let e=0;e<a;e+=Z){let t={kind:dr,id:o,total:a,offset:e,bytes:i.subarray(e,e+Z)};await write(t,void 0,e+Z>=a?n:void 0)}})},{reserve(e){return enqueue(Z,()=>e(async e=>{if(Ct(e).byteLength>Z)throw new SpawnBrokerError(`Spawn broker reserved publication exceeds one IPC frame`);await write(e)}))}})}function createBrokerReceiver(){let e,clear=()=>{e=void 0};return{receive(t){if(!t||typeof t!=`object`||!(`kind`in t)||t.kind!==dr)return clear(),t;let n=t;if(!Number.isSafeInteger(n.id)||!Number.isSafeInteger(n.total)||n.total<=Z||n.total>268435456||!Number.isSafeInteger(n.offset)||!Buffer.isBuffer(n.bytes)||n.bytes.length===0||n.bytes.length>Z)throw new SpawnBrokerError(`Invalid spawn broker IPC frame`);let r=e?.id===n.id?e:void 0;if(!r){if(n.offset!==0)throw new SpawnBrokerError(`Spawn broker receive capacity exceeded`);e=r={id:n.id,total:n.total,received:0,chunks:[]}}if(r.total!==n.total||r.received!==n.offset||r.received+n.bytes.length>r.total)throw new SpawnBrokerError(`Out-of-order spawn broker IPC frame`);if(r.chunks.push(n.bytes),r.received+=n.bytes.length,!(r.received<r.total))return clear(),St(Buffer.concat(r.chunks,r.total))},clear}}function fitsBrokerSocketPath(e,t){return process.platform===`win32`||Buffer.byteLength(K.join(e,t))<=103}function createNativeResourceAuthority(){let e=`oc-br-${it(16).toString(`hex`)}`,t=gt(mt(),e),n=process.platform===`win32`?void 0:fitsBrokerSocketPath(t,`resource.sock`)?t:gt(`/tmp`,e),r=it(32).toString(`hex`);return{directory:n,secret:r,endpoint:n?gt(n,`resource.sock`):`\\\\.\\pipe\\oc-br-${r}`}}const fr=new Map([EvalError,RangeError,ReferenceError,SyntaxError,TypeError,URIError,Error].map(e=>[e.name,e]));function decodeNativeWorkerFailure(e){let t=/* @__PURE__ */ new Map,decode=e=>{if(e.kind===`value`)return e.value;let n=t.get(e);if(n)return n;let r=fr.get(e.constructorName)??Error,i=e.constructorName===`AggregateError`?AggregateError([],e.message):e.constructorName===`SuppressedError`?new SuppressedError(void 0,void 0,e.message):new r(e.message);t.set(e,i),i.name=e.name,i.stack=e.stack;let defineField=(e,t,n=!1)=>{Object.defineProperty(i,e,{value:t,writable:!0,configurable:!0,enumerable:n})};for(let t of[`code`,`errcode`,`errno`])e[t]!==void 0&&defineField(t,e[t],!0);e.cause&&defineField(`cause`,decode(e.cause)),e.errors&&defineField(`errors`,e.errors.map(decode));for(let t of[`error`,`suppressed`]){let n=e[t];n&&defineField(t,decode(n))}return i};return decode(e)}const pr=15e3,mr=process.hrtime.bigint.bind(process.hrtime);function spawnBrokerStartupNowMs(){return Number(mr()/1000000n)}var BrokerNativeResourceCloseError=class extends Error{constructor(e){super(`Native resource cleanup failed`),this.payload=e,this.name=`BrokerNativeResourceCloseError`}},BrokerResourceClaims=class{constructor(e){this.host=e,this.claims=/* @__PURE__ */ new Map,this.bufferedBytes=0,this.bufferedMessages=0,this.closeSequence=0,this.sealed=!1}get size(){return this.claims.size}get hasOpenClaims(){return[...this.claims.values()].some(e=>!e.closed)}get needsReference(){return[...this.claims.values()].some(e=>!e.closed&&(!e.created||!!(e.failure||e.pending)||e.ownerMessages.size>0))}get admissionClosed(){return this.failure!==void 0||this.sealed}capture(e,t){if(this.admissionClosed)throw this.failure??new SpawnBrokerError(`Native resource source is sealed`);let n=Ct(e);if(n.length>268435456)throw new SpawnBrokerError(`Native resource input exceeds IPC capacity`);let r=St(n),i={attachment:r,callbacks:t,inContext:H.snapshot(),attached:L(),ready:!1,created:!1,closed:!1,lastSequence:0,ownerSequence:0,ownerMessages:/* @__PURE__ */ new Map};i.attached.promise.catch(()=>{}),this.claims.set(r.id,i),this.host.refreshReference();let active=()=>{if(this.claims.get(r.id)!==i)throw new SpawnBrokerError(`Native resource claim is released`);if(i.failure)throw i.failure};return{attachment:r,receive:e=>{if(e.id!==r.id)throw new SpawnBrokerError(`Native resource response belongs to another claim`);this.receive(e)},ownerMessage:e=>{if(active(),i.closed)throw new SpawnBrokerError(`Native resource is closed`);let t=i.ownerSequence+1,n=Ct({type:`resource-owner`,id:r.id,sequence:t,value:e});if(this.bufferedBytes+n.length>268435456||this.bufferedMessages>=1024)throw new SpawnBrokerError(`Native resource owner delivery capacity exceeded`);i.ownerSequence=t;let o=St(n);return i.ownerMessages.set(t,{request:o,size:n.length}),this.bufferedBytes+=n.length,this.bufferedMessages++,this.host.refreshReference(),(async()=>{await i.attached.promise,active();let e=i.ownerMessages.get(t);!i.closed&&e&&await this.host.transmit(e.request)})().catch(e=>{let t=a(e,`Native resource owner delivery failed`);this.claims.get(r.id)===i&&!i.closed&&!i.failure&&i.inContext(()=>i.callbacks.failed(t))}),{sequence:t}},close:()=>{if(i.closed)return Promise.resolve();try{active()}catch(e){return Promise.reject(a(e,`Native resource is unavailable`))}if(i.pending)return i.pending.completion.promise;let e=--this.closeSequence,t=L();return t.promise.catch(()=>{}),i.pending={requestId:e,completion:t},this.host.refreshReference(),(async()=>{await i.attached.promise,active(),!i.closed&&i.pending?.requestId===e&&await this.host.transmit({type:`resource-close`,id:r.id,requestId:e})})().catch(n=>{i.pending?.requestId===e&&(i.pending=void 0,this.host.refreshReference(),t.reject(a(n,`Native resource close delivery failed`)))}),t.promise},release:()=>{if(this.claims.get(r.id)===i){if(!i.closed)throw new SpawnBrokerError(`Native resource must close before release`);this.host.transmit({type:`resource-release`,id:r.id}).catch(()=>{}),this.remove(i)}},abandonUnattached:()=>{if(this.claims.get(r.id)!==i)return;if(i.ready||i.created)throw new SpawnBrokerError(`Attached native resource cannot be abandoned`);let e=new SpawnBrokerError(`Native resource was never dispatched`);i.attached.reject(e),i.pending?.completion.reject(e),this.remove(i)}}}receive(e){let t=this.claims.get(e.id);if(!(!t||t.failure&&e.type!==`resource-closed`)){if(e.type===`resource-ready`){if(this.host.markReady(e.pid,e.generation),t.ready)return;t.ready=!0,t.attached.resolve()}else if(e.type===`resource-created`){if(t.created)return;t.created=!0,this.host.refreshReference()}else if(e.type===`resource-owner-received`||e.type===`resource-owner-rejected`){let n=t.ownerMessages.get(e.sequence);if(n&&(t.ownerMessages.delete(e.sequence),this.bufferedBytes-=n.size,this.bufferedMessages--,this.host.refreshReference(),e.type===`resource-owner-rejected`)){let n=a(decodeNativeWorkerFailure(e.error),`Native resource owner callback failed`);t.inContext(()=>t.callbacks.failed(n))}return}else if(e.type===`resource-owner`){if(e.sequence<=t.lastSequence)return;t.lastSequence=e.sequence,t.inContext(()=>t.callbacks.message(e));return}else if(e.type===`resource-closed`){if(t.closed)return;t.closed=!0,this.clearOwnerMessages(t),t.pending?.completion.resolve(),t.pending=void 0,this.host.refreshReference()}else if(e.type===`resource-close-error`){if(t.pending?.requestId===e.requestId){let n=t.pending;t.pending=void 0,this.host.refreshReference(),n.completion.reject(e.resourceError?new BrokerNativeResourceCloseError(e.error):a(decodeNativeWorkerFailure(e.error),`Native resource cleanup failed`))}}else if(e.type===`resource-failed`){let n=a(decodeNativeWorkerFailure(e.error),`Native resource failed`);t.inContext(()=>t.callbacks.failed(n));return}t.inContext(()=>t.callbacks.message(e))}}closeAdmission(){this.sealed=!0}seal(){return this.sealPromise||=(this.closeAdmission(),this.host.transmit({type:`resource-seal`}).then(()=>{for(let e of this.claims.values())e.attached.resolve()},e=>{throw C(e),e})),this.sealPromise}closeBeforeStartup(){for(let e of this.claims.values())this.receive({type:`resource-closed`,id:e.attachment.id,requestId:0})}fail(e){C(e),this.failure??=e;let t=[...this.claims.values()].filter(t=>this.rejectClaim(t,e)),n=le(t,t=>t.inContext(()=>t.callbacks.failed(e)));if(n.length)throw AggregateError(n,`Native resource failure callback failed`)}rejectClaim(e,t){return e.failure||e.closed?!1:(e.failure=t,this.host.refreshReference(),e.attached.reject(t),e.pending?.completion.reject(t),e.pending=void 0,!0)}clearOwnerMessages(e){for(let t of e.ownerMessages.values())this.bufferedBytes-=t.size,this.bufferedMessages--;e.ownerMessages.clear()}remove(e){this.clearOwnerMessages(e),this.claims.delete(e.attachment.id),this.host.refreshReference()}};const hr=[100,250,500,1e3,2e3];var BrokerHost=class{constructor(e={}){if(this.options=e,this.runInContext=H.snapshot(),this.readiness=L(),this.available=!1,this.hasBeenReady=!1,this.closing=!1,this.generation=0,this.consecutiveFailures=0,this.sequence=0,this.requests=/* @__PURE__ */ new Map,this.childAdmissions=/* @__PURE__ */ new Map,this.pendingSpawns=/* @__PURE__ */ new Set,this.fileReads=new BrokerFileReads({ready:()=>this.ready(),send:e=>this.transmit(e),canAdmit:()=>!this.resourceClaims&&!this.closing&&this.pendingSpawns.size+this.fileReads.size<256}),this.cleanups=/* @__PURE__ */ new Set,this.cleanupErrors=[],this.startupDeadline=0,this.onParentExit=()=>{this.process?.connected&&this.process.disconnect();for(let e of this.cleanups)e.force()},this.readFilePage=this.fileReads.readPage.bind(this.fileReads),this.commands=createBrokerCommands({nextId:()=>++this.sequence,admit:(e,t)=>this.admit(e,t),cancel:e=>this.transmit({type:`cancel`,id:e})}),this.spawn=this.commands.spawn,this.spawnExeca=this.commands.spawnExeca,this.spawnToFile=this.commands.spawnToFile,this.workerUrl=e.workerUrl??resolveRuntimeWorkerUrl(Ge.spawnBroker),this.entryPath=q(this.workerUrl),e.nativeResources){let{directory:e,...t}=createNativeResourceAuthority();this.resourceDirectory=e,this.resourceAuthority=t,this.resourceClaims=new BrokerResourceClaims({transmit:async e=>{this.available||await this.ready(),await this.transmit(e)},markReady:(e,t)=>{if(!this.markNativeReady)throw new SpawnBrokerError(`Native resource broker unavailable`);this.markNativeReady(e,t)},refreshReference:()=>this.refreshNativeReference()})}this.readiness.promise.catch(()=>{}),this.start(),this.unregisterExitCleanup=_(this.onParentExit)}get pid(){return this.process?.pid}get hasOpenNativeResourceClaims(){return this.resourceClaims?.hasOpenClaims??!1}get nativeResourceAdmissionClosed(){return(this.resourceClaims?.admissionClosed??!1)||this.process?.connected===!1}ready(){return this.closing?Promise.reject(new SpawnBrokerError(`Spawn broker is closing`)):this.readiness.promise}readFile(e,t){return this.fileReads.read(e,t)}captureNativeResource(e,t){if(!this.resourceClaims||!this.resourceAuthority||this.closing||this.resourceClaims.size>=256)throw new SpawnBrokerError(`Native resource broker is unavailable or at capacity`);return this.resourceClaims.capture({...e,...e.moduleUrl.startsWith(`file:`)&&runtimeNeedsTypeScriptLoader(q(e.moduleUrl))?{sourceLoaderUrl:import.meta.resolve(`tsx/esm/api`)}:{},...this.resourceAuthority,generation:this.generation-1,startupDeadline:this.available?void 0:this.startupDeadline,id:++this.sequence},t)}sealNativeResources(){return this.resourceClaims&&!this.available?Promise.reject(new SpawnBrokerError(`Native resource broker is not ready for cleanup`)):this.resourceClaims?.seal()??Promise.reject(new SpawnBrokerError(`Native resources are disabled`))}serviceNativeResources(){this.serviceStartup?.()}refreshNativeReference(){this.resourceClaims&&this.process&&(this.closing||this.resourceClaims.needsReference||this.requests.size>0?(this.process.ref(),process.ref(this.process.stderr),this.process.channel?.ref?.()):(this.process.unref(),process.unref(this.process.stderr),this.process.channel?.unref?.()))}admit(e,t){e.admission=getSpawnBrokerAdmission();let n=childCapacityError(this.childAdmissions.values(),e.admission),r=createBrokerCommandRequest(e,t,this.transmit.bind(this)),{child:i,result:a,output:o}=r,fail=e=>{r.resultSettled=!0,a?.reject(e),o?.reject(e),i.settleFileOutput(),i.fail(e)};return!this.available||this.closing||this.pendingSpawns.size+this.fileReads.size>=256||n?(i.markNotStarted(),queueMicrotask(()=>fail(new SpawnBrokerError(this.available&&!this.closing?n??`Spawn broker startup capacity exceeded`:`Spawn broker is unavailable`))),r):(this.childAdmissions.set(e.id,e.admission),this.requests.set(e.id,r),this.pendingSpawns.add(e.id),this.refreshNativeReference(),i.waitForClose().then(()=>{r.childClosed=!0,this.retire(e.id,r)}),this.transmit(e).catch(t=>{if(this.pendingSpawns.delete(e.id),t instanceof BrokerIpcAdmissionError)i.markNotStarted();else if(r.output){this.process?.connected&&this.process.disconnect();return}!r.nativeInitiated&&e.type===`prepare-spawn`&&i.markNotStarted(),fail(new SpawnBrokerError(`Spawn broker request delivery failed`,{cause:t}))}),r)}retire(e,t){if(t.childClosed&&t.resultSettled&&!t.nativeInitiated){if(t.child.notStarted||!t.recovering&&t.nativeClosed)this.childAdmissions.delete(e);else if(!t.recovering||t.pid===void 0)return;this.requests.delete(e),this.refreshNativeReference()}}retainCleanup(e,t){this.cleanups.add(e),e.settled.then(()=>{this.cleanups.delete(e),t!==void 0&&this.childAdmissions.delete(t)},t=>{this.cleanupErrors.push(a(t,`Spawn broker cleanup failed`)),this.cleanups.delete(e)})}transmit(e,t,n){return!this.available||!this.sendMessage?Promise.reject(new SpawnBrokerError(`Spawn broker is unavailable`)):this.sendMessage(e,t,n)}start(){if(this.closing)return;try{assertChildRuntimeAvailable()}catch(e){this.readiness.reject(e);return}let e=this.generation++,t={type:`bootstrap`,...this.resourceAuthority?{nativeResource:{...this.resourceAuthority,generation:e}}:{}};if(Ct(t).byteLength>1024)throw new SpawnBrokerError(`Spawn broker bootstrap exceeds its IPC bound`);let n=At(process.execPath,resolveRuntimeWorkerArgv(this.workerUrl),{stdio:[`inherit`,`ignore`,`pipe`,`ipc`],detached:!0,serialization:`advanced`});this.process=n;let r=observeBrokerChildDiagnostics(n),i=!1,o=waitForBrokerChildCompletion(n),s,prepareTerminalDiagnosis=()=>s??=p?r():o.then(r),l;this.brokerClosed=o.then(async()=>{await l,i&&n.pid&&(n.exitCode!==0||n.signalCode!==null)&&this.cleanupErrors.push(new SpawnBrokerError(`Spawn broker shutdown failed`,{cause:await prepareTerminalDiagnosis().catch(e=>a(e,`Spawn broker exit diagnosis failed`))}))});let u=createBrokerReceiver(),d=L(),f=!1,p=!1;this.startupDeadline=spawnBrokerStartupNowMs()+pr;let checkStartup=()=>{!f&&!p&&spawnBrokerStartupNowMs()>=this.startupDeadline&&fail(/* @__PURE__ */ Error(`readiness deadline exceeded after 15000ms`))},m=this.resourceClaims?void 0:setTimeout(checkStartup,pr);this.serviceStartup=checkStartup;let fail=(e,t=!1)=>{if(f)return;i=this.closing,f=!0,clearTimeout(m),this.markNativeReady=void 0,u.clear(),this.available=!1,this.resourceClaims?.closeAdmission(),this.sendMessage=void 0,n.connected&&n.disconnect();let r=this.readiness;this.readiness=L(),this.readiness.promise.catch(()=>{});let a=this.requests;this.requests=/* @__PURE__ */ new Map,this.pendingSpawns.clear();let s=[];for(let[e,t]of a){if(t.recovering=!0,t.pid&&!t.nativeClosed){let r=t.pid;if(this.closing){let i;this.retainCleanup({force:()=>i?.force(),settled:d.promise.then(async()=>{(n.exitCode!==0||n.signalCode!==null)&&(i=terminateLostBrokerChild(r,t.detached),await i.settled)})},e)}else this.retainCleanup(terminateLostBrokerChild(r,t.detached),e)}else(t.child.notStarted||t.nativeClosed)&&this.childAdmissions.delete(e);t.output&&s.push(t)}if(this.refreshNativeReference(),n.pid&&process.platform!==`win32`){let e=n.pid,t;this.retainCleanup({force:()=>t?.force(),settled:d.promise.then(async()=>{t=terminateBrokerProcessGroup(e),await t.settled})})}l=prepareBrokerFailureCause(t?prepareTerminalDiagnosis():prepareChildRuntimeFailure({error:e,started:p}),e).then(e=>{let t=createBrokerFailureError(e,this.hasBeenReady);r.reject(t),this.fileReads.fail(t);for(let e of a.values())e.result?.reject(t),e.child.fail(t);if(a.clear(),s.length&&Promise.allSettled([o,...[...this.cleanups].map(e=>e.settled)]).then(()=>{for(let e of s)e.output?.reject(t),e.child.settleFileOutput();s.length=0}),this.resourceClaims||this.closing||!this.hasBeenReady||c(e,`NODE_RUNTIME_UNAVAILABLE`)){this.readiness.reject(t),this.resourceClaims?.fail(t);return}let n=hr[this.consecutiveFailures++];n===void 0?this.readiness.reject(t):this.restartTimer=setTimeout(()=>this.start(),n)})},markReady=(t,r)=>{if(f||t!==n.pid||r!==e)throw new SpawnBrokerError(`Native resource readiness does not match the captured broker`);p||(p=!0,clearTimeout(m),this.hasBeenReady=!0,this.consecutiveFailures=0,this.available=!0,this.readiness.resolve(),this.runInContext(()=>this.options.onReady?.(t,e>0)))};this.markNativeReady=markReady,n.once(`error`,fail),n.once(`exit`,()=>{f||(i=this.closing),d.resolve(),fail(void 0,!0)}),n.once(`disconnect`,()=>{p&&fail(/* @__PURE__ */ Error(`IPC channel disconnected`))}),n.on(`message`,(t,n)=>{if(f||this.closing){n instanceof J&&n.destroy();return}let r;try{r=u.receive(t)}catch(e){fail(a(e,`Spawn broker receive failed`));return}if(r===void 0)return;let i=r;if(i.type===`startup-failed`){if(!p&&this.resourceClaims){let e=this.resourceClaims;this.brokerClosed?.then(()=>e.closeBeforeStartup()).catch(e=>{this.cleanupErrors.push(a(e,`Spawn broker startup cleanup failed`))})}fail(Object.assign(Error(i.error.message),i.error));return}if(i.type===`ready`){try{markReady(i.pid,e)}catch(e){fail(a(e,`Spawn broker readiness failed`))}return}if(i.type===`resource-ready`||i.type===`resource-created`||i.type===`resource-target`||i.type===`resource-owner`||i.type===`resource-owner-received`||i.type===`resource-owner-rejected`||i.type===`resource-closed`||i.type===`resource-close-error`||i.type===`resource-failed`){try{this.resourceClaims?.receive(i)}catch(e){fail(a(e,`Spawn broker native resource receive failed`))}return}if(this.fileReads.receive(i))return;(i.type===`spawned`||i.type===`error`)&&this.pendingSpawns.delete(i.id);let o=this.requests.get(i.id);if(!o)n instanceof J&&n.destroy(),i.type===`pipe`?this.transmit({type:`pipe-received`,id:i.id,fd:i.fd}).catch(fail):i.type===`prepared`&&this.transmit({type:`launch`,id:i.id,allowed:!1}).catch(fail);else if((i.type===`owned`||i.type===`error`)&&(o.nativeInitiated?.resolve(),o.nativeInitiated=void 0),i.type===`prepared`){let e=o.initiateSpawn;o.initiateSpawn=void 0;let t=this.brokerClosed,n=e?o.nativeInitiated??=L():void 0,r=t&&n?Promise.race([n.promise,t]):Promise.reject(/* @__PURE__ */ Error(`Spawn broker retirement is unavailable`));r.catch(()=>{}),this.transmit({type:`launch`,id:i.id,allowed:!0},void 0,t=>{if(!e||!n||o.childClosed)throw new SpawnBrokerError(`Spawn broker launch grant is unavailable`);return e(t,r)}).catch(()=>{this.transmit({type:`launch`,id:i.id,allowed:!1}).catch(fail)})}else if(i.type===`owned`)o.pid=i.pid,o.childClosed&&(o.recovering=!0,this.retainCleanup(terminateLostBrokerChild(i.pid,o.detached),i.id),this.retire(i.id,o));else{try{receiveBrokerCommandResponse(o,i,n,e=>this.transmit(e))?.catch(fail)}catch(e){fail(a(e,`Spawn broker pipe setup failed`));return}this.retire(i.id,o)}});try{n.send(t,e=>{e&&fail(e)})}catch(e){fail(a(e,`Spawn broker bootstrap delivery failed`))}f||(this.sendMessage=createBrokerSender((e,t,r)=>n.send(e,t,{keepOpen:!0},r))),this.refreshNativeReference()}async waitForCleanup(){if(await Promise.allSettled([...this.cleanups].map(e=>e.settled)),this.cleanupErrors.length)throw AggregateError(this.cleanupErrors,`Spawn broker cleanup did not complete`)}close(){return this.resourceClaims?.hasOpenClaims?Promise.reject(new SpawnBrokerError(`Native resource claims must close before broker shutdown`)):this.closePromise??=this.closeInternal()}async closeInternal(){this.closing=!0,this.refreshNativeReference(),this.readiness.reject(new SpawnBrokerError(`Spawn broker is closing`)),this.fileReads.fail(new SpawnBrokerError(`Spawn broker is closing`)),clearTimeout(this.restartTimer);try{let e=this.process;e&&e.exitCode===null&&e.signalCode===null&&(this.resourceClaims?this.transmit({type:`shutdown`}).catch(()=>{e.connected&&e.disconnect()}):e.connected&&e.disconnect()),await this.brokerClosed;try{await this.waitForCleanup()}finally{this.resourceDirectory&&this.hasBeenReady&&await dt(this.resourceDirectory,{recursive:!0,force:!0})}}finally{this.unregisterExitCleanup()}this.options.onClosed?.()}};const createSpawnBrokerHost=e=>new BrokerHost(e);function createBrokerResourceSocket(e,t){let n=createBrokerReceiver(),r=Buffer.alloc(4),i=0,o,s=0,c=!1,l,u,stop=t=>{c||(c=!0,C(t),l=t,n.clear(),o=void 0,u?.(t??new SpawnBrokerError(`Spawn broker resource socket closed`)),e.destroy())},d=createBrokerSender((t,n,r)=>{if(c||e.destroyed){r(l??new SpawnBrokerError(`Spawn broker resource socket closed`));return}let i=Ct(t);if(i.length>268435456){r(new SpawnBrokerError(`Spawn broker resource frame exceeds capacity`));return}let o=Buffer.allocUnsafe(4+i.length);o.writeUInt32BE(i.length),i.copy(o,4);let complete=e=>{u===complete&&(u=void 0,r(e),e&&stop(e))};u=complete;try{e.write(o,e=>complete(e??null))}catch(e){complete(a(e,`Spawn broker resource write failed`))}});return e.on(`data`,e=>{try{let a=0;for(;a<e.length&&!c;){if(!o){let t=Math.min(4-i,e.length-a);if(e.copy(r,i,a,a+t),i+=t,a+=t,i!==4)continue;let n=r.readUInt32BE();if(n===0||n>268435456)throw new SpawnBrokerError(`Invalid spawn broker resource frame length`);o=Buffer.allocUnsafe(n),i=0}let c=Math.min(o.length-s,e.length-a);if(e.copy(o,s,a,a+c),s+=c,a+=c,s!==o.length)continue;let l=n.receive(St(o));if(o=void 0,s=0,l!==void 0){if(!l||typeof l!=`object`||!(`value`in l))throw new SpawnBrokerError(`Invalid spawn broker resource message`);t.message(l.value)}}}catch(e){stop(a(e,`Spawn broker resource read failed`))}}),e.once(`end`,()=>stop(o||i?new SpawnBrokerError(`Spawn broker resource socket ended during a frame`):void 0)),e.once(`error`,stop),e.once(`close`,()=>{stop(),t.close(l)}),{async send(t){if(c||e.destroyed)throw l??new SpawnBrokerError(`Spawn broker resource socket closed`);await d({value:t})},close:()=>stop()}}function attachBrokerNativeResource(e,t,n,r){let i=L();i.promise.catch(()=>{});let o,s,c,u=0,d=!1,f=!1,p=!1,m=!1,h,g=!1,_,recordFailure=e=>{if(m)return;let n=h===void 0;C(e),h??=e,clearTimeout(c),clearTimeout(v),i.reject(e),_?.completion.reject(e),_=void 0,t.close(),n&&r(e)},lose=e=>{m||g||(g=!0,recordFailure(e),o?.close())},transmit=async(e,t=!1)=>{if(h&&(!t||g))throw h;if(!o||m)throw Error(`Native resource attachment is closed`);await o.send(e)},receive=r=>{if(!l(r)||r.id!==e.id||typeof r.type!=`string`){lose(/* @__PURE__ */ Error(`Invalid native resource response identity`));return}let c=r;if(c.type===`resource-target`)t.postMessage(c.value,[]);else if(n(c),c.type===`resource-ready`)d=!0,clearTimeout(v);else if(c.type===`resource-created`)f=!0,s?.unref(),i.resolve();else if(c.type===`resource-closed`)m=!0,clearTimeout(v),_?.completion.resolve(),_=void 0,t.close(),o?.close();else if(c.type===`resource-close-error`){if(_?.id===c.requestId){let e=_;_=void 0,e.completion.reject(c.resourceError?new BrokerNativeResourceCloseError(c.error):a(decodeNativeWorkerFailure(c.error),`Native resource close failed`))}}else c.type===`resource-failed`&&recordFailure(a(decodeNativeWorkerFailure(c.error),`Native resource failed`))},start=()=>{if(h||m)return;let t;try{t=It(e.endpoint)}catch(e){queueMicrotask(()=>lose(a(e,`Native resource attachment failed`)));return}s=t;let n=!1,r;t.once(`error`,e=>{r=e}),o=createBrokerResourceSocket(t,{message:receive,close(t){m||g||(!n&&!d&&e.startupDeadline!==void 0&&spawnBrokerStartupNowMs()<e.startupDeadline?c=setTimeout(start,10):lose(t??r??/* @__PURE__ */ Error(`Native resource attachment lost`)))}}),t.once(`connect`,()=>{n=!0,p=!0,transmit({type:`resource-attach`,attachment:e}).catch(e=>lose(a(e,`Native resource attachment failed`)))})},v=e.startupDeadline===void 0?void 0:setTimeout(()=>{d||lose(/* @__PURE__ */ Error(`Spawn broker readiness deadline exceeded`))},Math.max(0,e.startupDeadline-spawnBrokerStartupNowMs()));start();let assertCleanupAvailable=()=>{if(g&&h)throw h},failDelivery=(e,t)=>{let n=a(e,t);n!==h&&lose(n)};return i.promise.then(()=>{t.on(`message`,t=>{transmit({type:`resource-target`,id:e.id,value:t}).catch(e=>failDelivery(e,`Native resource input delivery failed`))}),t.unref()},()=>{}),{get dispatched(){return p},ownerMessage(t,n){i.promise.then(()=>transmit({type:`resource-owner`,id:e.id,sequence:n,value:t},!0)).catch(e=>failDelivery(e,`Native resource owner delivery failed`))},async close(){if(m)return;if(assertCleanupAvailable(),!f)try{await i.promise}catch(e){if(!d||g)throw e}if(m)return;assertCleanupAvailable(),s?.ref();let t=_??{id:++u,completion:L()};_||(_=t,t.completion.promise.catch(()=>{}),transmit({type:`resource-close`,id:e.id,requestId:t.id},!0).catch(e=>lose(a(e,`Native resource close delivery failed`)))),await t.completion.promise},dispose(){clearTimeout(c),clearTimeout(v),o?.close()}}}const gr=u(Symbol.for(`openclaw.runtimeWorkerGeneration`),()=>new H);function resolveRuntimeWorkerGenerationUrl(e,t){return Je(e.href)?e:t?.resolve(e)??e}function captureRuntimeWorkerSource(e){let t=gr.getStore()?.generation,n=resolveRuntimeWorkerGenerationUrl(e,t);return n.href===e.href?{moduleUrl:e}:{moduleUrl:n,runtimeGeneration:t}}const _r=/* @__PURE__ */ Error(`Native worker port validation reached the live sentinel`);_r.stack=void 0;const vr={get value(){throw _r}};function nativePortIsOpen(e){if(process.versions.bun){let t=e.hasRef();e.unref(),e.ref();let n=e.hasRef();return t||e.unref(),n}try{structuredClone(vr,{transfer:[e]})}catch(e){if(e===_r)return!0;if(e instanceof DOMException&&e.name===`DataCloneError`)return!1;throw e}throw Error(`Native port validation did not abort serialization`)}var NativeWorkerTaskPort=class{constructor(e,t){this.port=e,this.callbacks=t,this.pending=[],this.readMessage=()=>B(this.port),this.started=!1,this.disposed=!1,this.portClosed=!1,this.receive=e=>{ke(e,`from_worker`),this.pending.push({type:`message`,value:e}),this.drain()},this.receiveError=e=>{this.pending.push({type:`messageerror`,error:e}),this.drain()},this.closed=()=>{this.portClosed=!0,this.drain(),this.fail(/* @__PURE__ */ Error(`Native worker task channel closed`))},e.on(`message`,this.receive),e.on(`messageerror`,this.receiveError),e.on(`close`,this.closed),e.unref()}fail(e){this.disposed||this.failure||(C(e),this.failure=e,this.callbacks.unavailable())}start(){this.started=!0}drain(){if(!this.disposed&&this.started)for(;;){let e=this.pending.shift();if(e)e.type===`message`?this.callbacks.message(e.value):this.callbacks.messageerror(e.error);else{if(this.portClosed||this.failure)return;let e;try{e=s(`worker:message-decode`,this.readMessage)}catch(e){this.fail(a(e,`Native worker task channel observation failed`));return}if(!e)return;ke(e.message,`from_worker`),this.callbacks.message(e.message)}if(this.disposed)return}}service(){if(this.drain(),this.disposed||this.failure)return;if(this.portClosed){this.fail(/* @__PURE__ */ Error(`Native worker task channel closed`));return}let e;try{e=nativePortIsOpen(this.port)}catch(e){this.fail(a(e,`Native worker task channel observation failed`));return}e||(this.portClosed=!0,this.fail(/* @__PURE__ */ Error(`Native worker task channel closed`)))}assertAvailable(){if(this.failure)throw this.failure;if(this.disposed||this.portClosed)throw Error(`Native worker task channel is closed`)}postMessage(e,t){this.assertAvailable();let n=_e(e);this.port.postMessage(e,t),ke(e,`to_worker`,`other`,n??null)}close(){this.disposed||(this.disposed=!0,this.pending.length=0,this.port.off(`message`,this.receive),this.port.off(`messageerror`,this.receiveError),this.port.off(`close`,this.closed),this.port.close())}};const yr={"catalog-page.worker.js":`catalog`,"code-mode.worker.js":`codeMode`,"disk-budget.worker.js":`diskBudget`,"document-extractor.worker.js":`document`,"manager-index.worker.js":`memoryIndex`,"manager-search.worker.js":`memorySearch`,"memory-index.worker.js":`memoryIndex`,"memory-search.worker.js":`memorySearch`,"run.worker.js":`teamReports`,"session-history.worker.js":`sessionHistory`},br=new Map([...Object.entries(Ge).map(([e,t])=>[ht(t.distWorkerPath),e]),...Object.entries(yr)]);function workerRequestKind(e){return br.get(ht(e.pathname).replace(/\.(?:ts|mjs)$/,`.js`))??`extension`}var NativeWorker=class extends Lt{get sourcePath(){if(!this.evalSource)return this.filename instanceof URL?this.filename.protocol===`file:`?q(this.filename):void 0:this.filename}get taskChannelFailure(){return this.taskPort?.failure}constructor(e,t,n,r,i,a,o){super(),this.runtime=e,this.id=t,this.filename=n,this.evalSource=r,this.ownsNativeResource=i,this.resourceConnection=a,this.runInContext=H.snapshot(),this.threadId=0,this.started=!1,this.executionStopped=!1,this.referenced=!0,this.stopping=!1,this.joined=!1,this.servicingResource=!1,this.resourceClosed=!1,this.supervisorJoined=!1,this.terminalObserved=!1,this.taskPortLossReported=!1,this.requestId=0,this.stopCompletion=F(()=>this.service()),this.cpuRequests=/* @__PURE__ */ new Map,this.heapRequests=/* @__PURE__ */ new Map,this.diagnosticName=`worker:${!r&&n instanceof URL?workerRequestKind(n):`other`}`,o&&(this.taskPort=new NativeWorkerTaskPort(o,{message:e=>this.runInContext(()=>s(this.diagnosticName,()=>this.emit(`message`,e))),messageerror:e=>this.runInContext(()=>this.emit(`messageerror`,e)),unavailable:()=>this.observeTaskPortLoss()}))}get needsReference(){return this.referenced||this.stopping||this.executionStopped&&this.ownsNativeResource&&!this.joined||this.cpuRequests.size>0||this.heapRequests.size>0}service(){this.runtime.service()}serviceTaskPort(){let e=this.taskPort;e&&(s(this.diagnosticName,()=>e.service()),this.observeTaskPortLoss())}observeTaskPortLoss(){let e=this.taskPort?.failure;!e||!this.started||!this.referenced||this.taskPortLossReported||this.terminalObserved||this.stopping||this.joined||this.executionStopped||this.runtime.failure||(this.taskPortLossReported=!0,this.runInContext(()=>this.emit(`error`,e)))}serviceResource(){if(!(!this.resourceBinding||this.servicingResource||this.joined)){this.servicingResource=!0;try{this.resourceBinding.service()}catch(e){this.resourceFailed(e)}finally{this.servicingResource=!1}}}attachResource(e){return this.resourceBinding=this.bindResource(e),{workerDataKey:e.workerDataKey,attachment:this.resourceBinding.attachment}}bindResource(e){let t=this.runtime.resourceBroker(),n=this.resourceConnection,r=!1,i=t.captureNativeResource({moduleUrl:e.moduleUrl,input:e.input,ownerPort:!!n},{message:e=>{e.type===`resource-owner`?n?.port.postMessage(e.value,[]):e.type===`resource-closed`&&this.runInContext(()=>{this.resourceClosed=!0,(this.supervisorJoined||this.executionStopped)&&this.finishJoined(this.executionExitCode)})},failed:e=>this.resourceFailed(e)}),forward=e=>{if(!r)try{let t=i.ownerMessage(e);this.runtime.failure||this.runtime.post({type:`resource-owner`,id:this.id,sequence:t.sequence,value:e})}catch(e){this.resourceFailed(a(e,`Native resource owner delivery failed`))}};n?.port.on(`message`,forward),n?.port.unref();let dispose=()=>{r||(r=!0,n?.port.off(`message`,forward),n?.port.close(),n?.dispose())};return{attachment:i.attachment,receive(e){i.receive(e)},service(){if(!r&&n)for(n.service();;){let e=B(n.port);if(!e)break;forward(e.message)}},async closeAfterSupervisor(){try{await t.sealNativeResources(),await i.close()}catch(e){throw e instanceof BrokerNativeResourceCloseError&&n?.decodeCloseError?n.decodeCloseError(e.payload):e}},release(){i.release(),dispose()},abandonUnattached(){i.abandonUnattached(),dispose()}}}abandonResource(){this.taskPort?.close(),this.resourceBinding?this.resourceBinding.abandonUnattached():this.resourceConnection?.dispose()}resourceFailed(e){this.runInContext(()=>{this.rejectStopCompletion(e),this.emit(`error`,a(e,`Native resource observation failed`))})}rejectStopCompletion(e){C(e),this.stopCompletion.reject(e)}recoverResource(){if(!this.resourceBinding||this.joined||this.resourceRecovery)return;let e=this.resourceBinding.closeAfterSupervisor();this.resourceRecovery=e,e.then(()=>this.runInContext(()=>{this.finishJoined(void 0)}),e=>this.runInContext(()=>{this.stopping=!1,this.rejectStopCompletion(e)}))}postMessage(e,t=[]){if(this.joined||this.stopping||this.executionStopped)throw Error(`Native worker is closing`);if(this.runtime.failure)throw this.runtime.failure;this.taskPort?this.taskPort.postMessage(e,t):this.runtime.post({type:`post`,id:this.id,value:e,transferList:t},t)}ref(){if(this.runtime.failure)throw this.runtime.failure;return this.taskPort?.assertAvailable(),this.referenced=!0,this.runtime.refreshReference(),this}unref(){if(this.referenced=!1,!this.joined&&this.runtime.failure)throw this.runtime.failure;return this.runtime.refreshReference(),this}stop(){if(this.joined)return this.stopCompletion.operation.read().status!==`fulfilled`&&(this.stopCompletion=F(()=>this.service()),this.stopCompletion.resolve()),this.stopCompletion.operation;if(this.stopCompletion.operation.read().status===`rejected`&&(this.stopCompletion=F(()=>this.service())),this.supervisorJoined&&this.resourceBinding)return this.rejectStopCompletion(Error(`Native resource cleanup is still retained after supervisor loss`,{cause:this.runtime.failure})),this.recoverResource(),this.stopCompletion.operation;if(!this.stopping){this.stopping=!0;try{this.runtime.post({type:`stop`,id:this.id})}catch(e){this.stopping=!1,this.rejectStopCompletion(e)}this.runtime.refreshReference()}return this.stopCompletion.operation}terminate(){return this.stop().result}cpuUsage(e){return this.requestSample(this.cpuRequests,{type:`cpu`,previous:e})}getHeapStatistics(){return this.requestSample(this.heapRequests,{type:`heap`})}requestSample(e,t){if(this.joined)return Promise.reject(/* @__PURE__ */ Error(`Native worker exited`));let n=F(()=>this.service()),r=++this.requestId;e.set(r,n);try{this.runtime.post({...t,id:this.id,requestId:r})}catch(t){e.delete(r),n.reject(t)}return this.runtime.refreshReference(),n.operation.result}rejectSamples(e){for(let t of[...this.cpuRequests.values(),...this.heapRequests.values()])t.reject(e);this.cpuRequests.clear(),this.heapRequests.clear()}ownerFailed(e){this.runInContext(()=>{this.terminalFailure??=e,this.taskPort?.close(),this.stopping=!1,this.rejectSamples(e),this.rejectStopCompletion(e),this.emit(`error`,e)})}ownerJoined(e){this.runInContext(()=>{if(this.terminalFailure??=e,this.stopping=!1,this.supervisorJoined=!0,this.rejectSamples(e),this.finishExecution(void 0),this.ownsNativeResource){if(this.resourceClosed){this.finishJoined(void 0);return}this.rejectStopCompletion(Error(`Native resource cleanup outcome is unavailable after owner loss`,{cause:e})),this.recoverResource()}else this.finishJoined(void 0)})}finishJoined(e){this.joined||(this.joined=!0,this.taskPort?.close(),this.threadId=-1,this.stopping=!1,this.referenced=!1,this.rejectSamples(/* @__PURE__ */ Error(`Native worker exited`)),this.stopCompletion.resolve(),this.runtime.handles.delete(this.id),this.runtime.failure||this.runtime.post({type:`release`,id:this.id}),this.runtime.refreshReference(),this.resourceBinding?this.resourceBinding.release():this.resourceConnection?.dispose(),this.finishExecution(e),this.emit(`exit`,e))}finishExecution(e){this.executionStopped||(this.taskPort?.close(),this.executionStopped=!0,this.executionExitCode=e,this.emit(`execution-exit`,e)),this.resourceClosed&&!this.joined&&this.finishJoined(e)}receive(e){this.runInContext(()=>s(this.diagnosticName,()=>{(e.type===`error`||e.type===`messageerror`||e.type===`create-error`||e.type===`execution-exit`||e.type===`stopped`||e.type===`stop-error`)&&(this.terminalObserved=!0,this.taskPort?.drain()),this.receiveOwned(e)}))}receiveOwned(e){if(e.type===`created`)this.started=!0,this.threadId=e.threadId,xe(this,this.filename,this.evalSource),this.taskPort?.start(),this.emit(`started`),this.taskPort?.drain(),this.observeTaskPortLoss();else if(e.type===`message`)this.emit(`message`,e.value);else if(e.type===`resource-message`)this.resourceBinding?.receive(e.response);else if(e.type===`error`||e.type===`messageerror`){let t=a(decodeNativeWorkerFailure(e.error),`Native worker failed`);this.terminalFailure??=t,this.emit(e.type,t)}else if(e.type===`create-error`){this.joined=!0,this.threadId=-1,this.referenced=!1;let t=a(decodeNativeWorkerFailure(e.error),`Native worker creation failed`);this.rejectSamples(t),this.stopCompletion.resolve(),this.runtime.handles.delete(this.id),this.runtime.refreshReference(),this.abandonResource(),this.emit(`error`,t)}else if(e.type===`stopped`)this.finishExecution(e.code),this.finishJoined(e.code);else if(e.type===`execution-exit`)this.finishExecution(e.code);else if(e.type===`stop-error`){let t=this.stopping;this.stopping=!1;let n;try{if(e.resourceError){if(!this.resourceConnection?.decodeCloseError)throw Error(`Native resource cleanup error decoder is unavailable`,{cause:e.error});n=this.resourceConnection.decodeCloseError(e.error)}else n=a(decodeNativeWorkerFailure(e.error),`Native worker stop failed`)}catch(e){n=a(e,`Native resource cleanup error decoding failed`)}this.rejectStopCompletion(n),t||this.emit(`error`,n)}else if(e.type===`cpu`)this.cpuRequests.get(e.requestId)?.resolve(e.value),this.cpuRequests.delete(e.requestId);else if(e.type===`heap`)this.heapRequests.get(e.requestId)?.resolve(e.value),this.heapRequests.delete(e.requestId);else if(e.type===`request-error`){let t=a(decodeNativeWorkerFailure(e.error),`Native worker observation failed`);this.cpuRequests.get(e.requestId)?.reject(t),this.heapRequests.get(e.requestId)?.reject(t),this.cpuRequests.delete(e.requestId),this.heapRequests.delete(e.requestId)}this.runtime.refreshReference()}};const Q=u(Symbol.for(`openclaw.nativeWorkerLifetimes`),()=>({nextId:0,sources:/* @__PURE__ */ new WeakMap,defaultBroker:{}}),closeDefaultRetainedNativeWorkerSource);async function closeDefaultRetainedNativeWorkerSource(){await Q.defaultSource?.close()}function forgetNativeSource(e){e.runtimeGeneration?Q.sources.get(e.runtimeGeneration)===e&&Q.sources.delete(e.runtimeGeneration):Q.defaultSource===e&&(Q.defaultSource=void 0)}function nativeCleanupFailures(e){return e.flatMap(e=>e.status===`rejected`?[e.reason]:[])}function nativeResourceBroker(t){return t.broker.host??=e(()=>createSpawnBrokerHost({nativeResources:!0,workerUrl:t.brokerModuleUrl}))}async function retireNativeResourceBroker(e){let t=e.broker;if(await t.closing,e.hasActiveWorkers||t.retainedUntilProcessExit||t.host?.hasOpenNativeResourceClaims)return!1;let n=t.host;return t.host=void 0,await(t.closing=n?.close()),t.closing=void 0,!0}function nativeRuntime(t){if(t.closing)throw Error(`Native worker source is closing`);let n=t.runtime;if(n){if(n.failure)throw n.failure;return n}return e(()=>{let{port1:e,port2:n}=new R,r=t.moduleUrl,i=se();fe(i);let o;try{o=Ae(r,{execArgv:resolveRuntimeWorkerThreadExecArgv(r),env:Qe,workerData:{port:n},transferList:[n]})}catch(t){throw e.close(),n.close(),t}let c=/* @__PURE__ */ new Map,l=L();l.promise.catch(()=>void 0);let u=!1,terminateOwner=()=>{if(!u){u=!0,o.ref(),e.ref();try{o.terminate().catch(l.reject)}catch(e){l.reject(e)}}},receive=e=>{ke(e,`from_worker`,`lifecycle`),c.get(e.id)?.receive(e)},readControlMessage=()=>B(e),d={databaseAdmissionCursor:i,handles:c,service(){for(;;){let e=s(`worker:control-decode`,readControlMessage);if(!e)break;receive(e.message)}let n=[...c.values()];for(let e of n)e.serviceTaskPort(),e.serviceResource();if(d.failure)return;let r;try{r=nativePortIsOpen(e)}catch(e){fail(Error(`Native worker lifetime channel observation failed`,{cause:e})),terminateOwner();return}r?t.broker.host?.serviceNativeResources():(fail(/* @__PURE__ */ Error(`Native worker lifetime channel closed`)),terminateOwner())},post(t,n=[]){if(d.failure)throw d.failure;let r=_e(t);e.postMessage(t,n),ke(t,`to_worker`,`lifecycle`,r??null)},resourceBroker(){return nativeResourceBroker(t)},refreshReference(){[...c.values()].some(e=>e.needsReference)?(o.ref(),e.ref()):(o.unref(),e.unref())},close(){return d.failure??=/* @__PURE__ */ Error(`Native worker lifetime owner is closing`),C(d.failure),terminateOwner(),l.promise}},fail=e=>{if(!d.failure){d.failure=a(e,`Native worker lifetime owner failed`),C(d.failure);for(let e of c.values())e.ownerFailed(d.failure)}};return e.on(`message`,receive),e.on(`messageerror`,e=>{try{fail(e)}finally{terminateOwner()}}),o.on(`message`,e=>Me(o,e)),o.on(`error`,fail),o.once(`exit`,()=>{setImmediate(()=>{let n=d.failure??/* @__PURE__ */ Error(`Native worker lifetime owner exited`);C(n),d.failure=n,t.closing=!0;for(let e of c.values())e.ownerJoined(n);e.close(),l.resolve()})}),t.runtime=d,d.refreshReference(),d})}function captureRetainedNativeWorkerSource(e){let t=resolveRuntimeProcessEntrypointUrl(`workerNativeLifecycle`),n=e===void 0?captureRuntimeWorkerSource(t):{moduleUrl:resolveRuntimeWorkerGenerationUrl(t,e.runtimeGeneration),runtimeGeneration:e.runtimeGeneration},r=n.runtimeGeneration?Q.sources.get(n.runtimeGeneration):Q.defaultSource;if(r)return r;!n.runtimeGeneration&&Q.defaultBroker.host?.nativeResourceAdmissionClosed&&(Q.defaultBroker={});let i={...n,broker:n.runtimeGeneration?{}:Q.defaultBroker,brokerModuleUrl:resolveRuntimeWorkerGenerationUrl(resolveRuntimeProcessEntrypointUrl(`spawnBroker`),n.runtimeGeneration),closing:!1,get hasActiveWorkers(){return!!i.runtime?.handles.size},activeWorkerPaths(){return[...i.runtime?.handles.values()??[]].map(e=>e.sourcePath)},retireIdleBroker(){return retireNativeResourceBroker(i)},close(){return o??=Promise.resolve().then(async()=>{try{let e=nativeCleanupFailures(await Promise.allSettled([...a.values()].map(e=>e())));if(e.length)throw AggregateError(e,`Native worker execution owner cleanup failed`);if(i.hasActiveWorkers)throw Error(`Native worker execution owners have not joined`);i.closing=!0,await i.runtime?.close(),await retireNativeResourceBroker(i),forgetNativeSource(i),a.clear()}catch(e){throw i.closing||(o=void 0),C(e),e}})},create(e,t,n,r){try{return startNativeWorker(nativeRuntime(i),e,t??{},n,r)}catch(e){throw r?.host.close(),r?.worker.close(),e}},async captureIndependentResource(e,t){if(await i.broker.closing,i.closing)throw Error(`Native worker source is closing`);let r=nativeResourceBroker(i),{port1:o,port2:s}=new R,c=L(),fail=e=>{c.reject(e),s.close()},l=r.captureNativeResource({moduleUrl:String(resolveRuntimeWorkerGenerationUrl(e,n.runtimeGeneration)),input:t,ownerPort:!1},{message(e){e.type===`resource-created`&&c.resolve()},failed:fail}),u=attachBrokerNativeResource(l.attachment,o,e=>l.receive(e),fail),d=!1,f={port:s,retainBrokerUntilProcessExit(){i.broker.retainedUntilProcessExit=!0},async close(){d||(u.dispatched?(await u.close(),await l.close(),l.release()):l.abandonUnattached(),u.dispose(),o.close(),s.close(),d=!0,a.delete(f),i.closing&&await retireNativeResourceBroker(i))}};try{return await c.promise,f}catch(e){try{await f.close()}catch(t){throw i.retain(f,()=>f.close()),AggregateError([e,t],`Native resource creation cleanup failed`,{cause:t})}throw e}},captureResource(e,t,r,i){let a=H.snapshot();return Object.freeze({moduleUrl:String(resolveRuntimeWorkerGenerationUrl(e,n.runtimeGeneration)),workerDataKey:t,input:r===void 0?void 0:structuredClone(r),connect:i?()=>a(()=>{let e=i(),t=e.decodeCloseError?.bind(e);return{port:e.port,service:()=>a(()=>e.service()),dispose:()=>a(()=>e.dispose()),decodeCloseError:t?e=>a(()=>t(e)):void 0}}):void 0})},retain(e,t){a.set(e,t),n.runtimeGeneration?.retain(i,()=>i.close())}},a=/* @__PURE__ */ new Map,o;return n.runtimeGeneration?Q.sources.set(n.runtimeGeneration,i):Q.defaultSource=i,i}function createRetainedNativeWorker(e,t={},n,r,i){try{return(n??captureRetainedNativeWorkerSource({runtimeGeneration:void 0})).create(e,t,r,i)}catch(e){throw i?.host.close(),i?.worker.close(),e}}function startNativeWorker(e,t,n,r,i){let a=++Q.nextId,o,s,c=!1;try{o=r?.connect?.(),s=new NativeWorker(e,a,t,n.eval===!0,r!==void 0,o,i?.host);let{env:l,transferList:u=[],...d}=n;e.handles.set(a,s);let f=r?s.attachResource(r):void 0,p=fe(e.databaseAdmissionCursor);c=!0,e.post({type:`create`,id:a,filename:{kind:t instanceof URL?`url`:`path`,value:String(t)},environmentData:captureSqliteWorkerEnvironmentData(p),options:{...d,environment:{...l===Qe?process.env:l??process.env},shareEnvironment:l===Qe},transferList:[...u],resource:f,taskPort:i?.worker},i?[...u,i.worker]:u)}catch(t){throw c&&(e.databaseAdmissionCursor=se()),e.handles.delete(a),e.refreshReference(),s?s.abandonResource():(i?.host.close(),o?.dispose()),i?.worker.close(),t}return e.refreshReference(),s}function resolveWorkerComputeLimit(){return Math.max(1,pt()-1)}function resolveWorkerPoolSize(e){return Math.min(e===`reader`||e===`file-reader`?2:e===`compute`?4:1,resolveWorkerComputeLimit())}resolveWorkerPoolSize(`reader`);const xr=u(Symbol.for(`openclaw.workerStartObservation`),()=>new H);function captureWorkerStartObserver(e){let t=xr.getStore();return t?()=>t(o(e)):void 0}const Sr=u(Symbol.for(`openclaw.workerRequestMetricsListeners`),()=>/* @__PURE__ */ new Set),Cr=u(Symbol.for(`openclaw.sqliteWorkerReservationObservation`),()=>new H),wr=x(`sqlite.worker-timing`),Tr=u(Symbol.for(`openclaw.workerRequestQueueDepth`),()=>/* @__PURE__ */ new Map);function trackWorkerRequest(e,t,n){let r=We(t),i=e===`sqlite_writer`?Cr.getStore():void 0,a=performance.now(),o=e===`sqlite_writer`&&(wr||Sr.size>0||g(`worker.request`,!0))?{enqueued:a}:void 0,s,c=!1,l,emit=(t,n,i)=>{if(!d())return;let a=Tr.get(e)??0,s=t===`completed`?o:void 0;for(let o of Sr)try{o(e,r,t,a,n,i,s)}catch{}g(`worker.request`,!0)&&h({type:`worker.request`,kind:e,requestClass:r,phase:t,queueDepth:a,...n===void 0?{}:{queueWaitMs:n},...i===void 0?{}:{durationMs:i},...s?{timing:s}:{}})},dequeue=()=>Tr.set(e,(Tr.get(e)??0)-1);Tr.set(e,(Tr.get(e)??0)+1),emit(`queued`);let u={requestClass:r,timing:o,...i?{recordTransactions:e=>{i.transactionCount=(i.transactionCount??0)+e}}:{},started:(e,t)=>{c||s!==void 0||(s=performance.now(),o&&t&&(l={performance:t,atStart:t.eventLoopUtilization(),threadId:e}),i&&(u.startedAt=s,u.threadId=e,i.active=u,i.operations.add(i.operations.has(r)||i.operations.size<8?r:`other`)),o&&(o.dispatched=s),n?.removeEventListener(`abort`,u.completed),dequeue(),emit(`started`,s-a))},completed:()=>{if(!c){if(c=!0,i?.active===u&&(i.active=void 0),n?.removeEventListener(`abort`,u.completed),s===void 0&&dequeue(),l&&o?.posted!==void 0&&o.received!==void 0&&o.received-o.posted>=1e3){let e=l.performance.eventLoopUtilization(l.atStart),t=o.executeStarted!==void 0&&o.executeFinished!==void 0?o.executeFinished-o.executeStarted:0,n={requestClass:r,threadId:l.threadId,deliveryMs:Math.round(o.received-o.posted),executeMs:Math.round(t),workerActiveMs:Math.round(e.active),workerIdleMs:Math.round(e.idle),workerActiveOutsideExecuteMs:Math.round(Math.max(0,e.active-t))};import(`./control-ui-file.worker-worker-request-delivery-report.runtime-GohOmfj9.mjs`).then(({reportSlowWorkerDelivery:e})=>e(n)).catch(e=>{process.emitWarning(e instanceof Error?e:String(e))})}emit(`completed`,void 0,s===void 0?void 0:performance.now()-s)}}};return n?.addEventListener(`abort`,u.completed,{once:!0}),n?.aborted&&u.completed(),u}function getWorkerComputeCapacity(){return u(Symbol.for(`openclaw.workerComputeCapacity`),()=>createWorkerComputeCapacity(resolveWorkerComputeLimit()))}u(Symbol.for(`openclaw.activeStoreWriters`),()=>new H),u(Symbol.for(`openclaw.storeWriterTurn`),()=>({started:0,startedAt:0,reset:void 0,wait:void 0})),u(Symbol.for(`openclaw.agentDatabaseWriteAdmission`),()=>({queues:/* @__PURE__ */ new Map})).queues;const Er=u(Symbol.for(`openclaw.workerTaskPools`),()=>/* @__PURE__ */ new Set);function*reachablePools(){for(let e of Er){let t=e.deref();t?yield{pool:t,reference:e}:Er.delete(e)}}const Dr={register(e){for(let t of reachablePools())if(t.pool===e)return e;return Er.add(new WeakRef(e)),e},async close(e,t,n){await joinOwnedWorkerTasks(t),await n();for(let t of reachablePools())t.pool===e&&Er.delete(t.reference)}},Or=/* @__PURE__ */ new Set([`prepare`,`prepare-session`,`transcript-stats`,`session-entries`,`session-cleanup`,`session-memory-capture`,`history-page`,`historical-eviction-candidates`,`usage-cost`,`model-context`,`context-messages`,`transcript-search`,`session-target-prepare`,`session-store-target`,`session-target-inventory`,`combined-store-topology`]),kr=createLazyRuntimeModule(()=>import(`./control-ui-file.worker-temp-artifact-cleanup-DdLm1wJc.mjs`)),$=u(Symbol.for(`openclaw.workerTaskDatabaseAdmissionChannels`),()=>/* @__PURE__ */ new Map);function createWorkerTaskHost(t={},n){let r=n&&n!==`writer`&&n!==`singleton`,i=t.retainedTransport?t.nativeSource??captureRetainedNativeWorkerSource({runtimeGeneration:void 0}):void 0;return{maxWorkers:n?resolveWorkerPoolSize(n):void 0,requiresReady:t.retainedTransport,createWorker(e,n){let a={execArgv:resolveRuntimeWorkerThreadExecArgv(e),...n};if(a.env===void 0&&(a.env=resolveNodeCompileCacheEnv()),r){let e=a.resourceLimits;a.resourceLimits={maxOldGenerationSizeMb:e?.maxOldGenerationSizeMb??512,maxYoungGenerationSizeMb:e?.maxYoungGenerationSizeMb,codeRangeSizeMb:e?.codeRangeSizeMb,stackSizeMb:e?.stackSizeMb}}if(t.retainedTransport){let{port1:n,port2:r}=new R,o=createRetainedNativeWorker(e,a,i,t.nativeResource,{host:n,worker:r});return{worker:o,native:o}}return{worker:Ae(e,a)}},serviceNativeWorkers(e){for(let{owner:e}of $.values())e.service();e[0]?.service()},prepareResources:kr,async releaseTemporaryDirectory(e){let{removeTemporaryArtifacts:t}=await kr();await t(e,`Worker task`)},captureTaskContext(t){let n=$.get(t);n||(n={owner:e(()=>createSqliteDatabaseAdmissionRelay(()=>{if($.get(t)?.retiring!==!1)throw Error(`SQLite creation relay's task worker is retiring`)})),sent:!1,retiring:!1},$.set(t,n));let r=he(),i={collectWorkerMetrics:De(),...r?{databaseEngineSelection:r}:{},deletedAgentDatabaseFences:ge(),databaseAdmissionDeadlineAtMs:Ue(),...n.sent?{}:{databaseAdmissionPort:n.owner.port}};return n.postgresSent||(i.postgresPool=createPostgresPoolEndpoints(),n.postgresSent=i.postgresPool!==void 0),n.sent=!0,i},taskContextTransferList(e){let t=e,n=postgresPoolTransferList(t.postgresPool);return t.databaseAdmissionPort?[t.databaseAdmissionPort,...n]:n},createTaskObserver(e){let t=workerRequestKind(e);return e=>trackWorkerRequest(t,e===void 0?`task`:Ve(e))},describeTask(e,t,n){if(n!==void 0){let t=Or.has(n)?n:Ve(n);return`${workerRequestKind(e)}.${t}`}let r=typeof t==`object`&&t?Object.getOwnPropertyDescriptor(t,`kind`)?.value:void 0,i=typeof r==`string`&&Or.has(r)?r:`task`;return`${workerRequestKind(e)}.${i}`},receiveMessage:Me,observeResourceReply:()=>Te(`resource`,`from_worker`),captureWorkerStartObserver,workerStarted(e,t){trackSqliteDatabaseAdmissionWorker(e),Re(e,t,n)},workerRetiring(e,t){let n=$.get(e);n&&(n.retiring=!0),ve(e,t)},workerStopped(e){let t=$.get(e);if(t){t.retiring=!0;let n=t.owner.finish();if(n)return n.then(()=>{$.delete(e)});$.delete(e)}},flushWorkerDiagnostics:Fe,computeCapacity:getWorkerComputeCapacity(),pools:Dr}}var WorkerTaskPool=class{constructor(e){this.core=new WorkerTaskPoolCore(e,createWorkerTaskHost(void 0,e.workerClass),{close:e=>this.close(e),getSnapshot:()=>this.getSnapshot()})}run(e,t){return this.core.run(e,t)}get isClosed(){return this.core.isClosed}getSnapshot(){return this.core.getSnapshot()}retryFailedRetirements(){return this.core.retryFailedRetirements()}rotate(){return this.core.rotate()}close(e,t){return this.core.close(e,t)}};async function runFileLogIOInWorker(e,t){let n=u(Symbol.for(`openclaw.fileLogWorker`),()=>({}),async e=>{await t(),await e.pool?.close(),e.pool=void 0});return await(n.pool??=new WorkerTaskPool({workerUrl:resolveRuntimeProcessEntrypointUrl(`fileLog`),workerClass:`writer`})).run(e,{inputBytes:Buffer.byteLength(e.file)+(e.type===`append`?Buffer.byteLength(e.payload):0)})}export{isPidDefinitelyDead as a,resolveRuntimeWorkerUrl as c,readProcessGroupMembers as i,canAccessSync as n,readLinuxProcessStat as o,resolveIdentityPathViaExistingAncestorSync as r,runFileLogIOInWorker,resolveDiagnosticProcessEnv as s,formatErrorMessage as t};