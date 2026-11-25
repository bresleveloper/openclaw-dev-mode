import{createRequire as e}from"node:module";import{Socket as t,connect as n,createConnection as r,createServer as i}from"node:net";import{setImmediate as a,setTimeout as s}from"node:timers/promises";import{appendRegularFileSync as c,canUseRootFileOpen as l,openRootFileSync as u,readFileWindowFully as d,readRegularFile as f}from"@openclaw/fs-safe/advanced";import p,{execFile as m,execFileSync as h,spawn as g,spawnSync as _}from"node:child_process";import v,{existsSync as y,fstatSync as b,mkdirSync as x,opendirSync as S,readFile as C,readFileSync as w,readdirSync as ee,readlinkSync as te,statSync as ne,default as re}from"node:fs";import{ProcSafeError as ie}from"@openclaw/proc-safe/errors";import{readProcessAncestry as ae,readProcessIdentity as oe}from"@openclaw/proc-safe/identity";import{hasNodeErrorCode as T,isNodeError as se,isPathInside as ce,isPathInside as le}from"@openclaw/fs-safe/path";import E,{basename as ue,dirname as de,join as fe,posix as pe}from"node:path";import{createHash as me,randomBytes as he,randomUUID as ge}from"node:crypto";import{AsyncLocalStorage as D,AsyncResource as _e}from"node:async_hooks";import O,{chmod as ve,mkdir as ye,mkdtemp as be,realpath as xe,rm as Se,stat as Ce,default as we}from"node:fs/promises";import k,{availableParallelism as Te,tmpdir as Ee}from"node:os";import{MIMEType as De,isDeepStrictEqual as Oe,promisify as ke,stripVTControlCharacters as Ae,toUSVString as je,types as Me}from"node:util";import"@openclaw/proc-safe/reaper";import{listProcesses as Ne,readProcessCommand as Pe}from"@openclaw/proc-safe/inspect";import{EventEmitter as Fe,once as Ie}from"node:events";import{Transform as Le}from"node:stream";import{pipeline as Re}from"node:stream/promises";import*as ze from"node:v8";import{deserialize as Be,serialize as A,setFlagsFromString as Ve}from"node:v8";import{fileURLToPath as j,pathToFileURL as He}from"node:url";import{root as Ue}from"@openclaw/fs-safe";import{Chalk as We}from"chalk";import{performance as Ge}from"node:perf_hooks";import"@openclaw/fs-safe/errors";import"@openclaw/fs-safe/output";import"@openclaw/fs-safe/root";import"@openclaw/fs-safe/secure-file";import"@openclaw/fs-safe/walk";import{channel as Ke}from"node:diagnostics_channel";import{BroadcastChannel as qe,MessageChannel as M,MessagePort as Je,SHARE_ENV as Ye,Worker as Xe,getEnvironmentData as Ze,isMainThread as N,receiveMessageOnPort as Qe,setEnvironmentData as $e,threadId as P,workerData as et}from"node:worker_threads";import{Logger as tt}from"tslog";import{readRootJsonObjectSync as nt}from"@openclaw/fs-safe/json";import{replaceFileAtomic as rt}from"@openclaw/fs-safe/atomic";import{parse as it}from"semver";import{isPromise as at}from"node:util/types";import{Buffer as ot}from"node:buffer";import"@openclaw/fs-safe/durability";import{PinnedProcess as st}from"@openclaw/proc-safe/windows-job";import{execa as ct}from"execa";var lt=Object.defineProperty,__esmMin=(e,t,n)=>()=>{if(n)throw n[0];try{return e&&(t=e(e=0)),t}catch(e){throw n=[e],e}},__exportAll=(e,t)=>{let n={};for(var r in e)lt(n,r,{get:e[r],enumerable:!0});return t||lt(n,Symbol.toStringTag,{value:`Module`}),n};function isProviderAuthPersistenceError(e){try{return ut in e&&e[ut]===!0}catch{return!1}}function isErrorObject(e){try{return e instanceof Error||Object.prototype.toString.call(e)===`[object Error]`}catch{return!1}}function isAggregateErrorObject(e){try{if(e instanceof AggregateError)return!0;for(let t=Object.getPrototypeOf(e);t;t=Object.getPrototypeOf(t)){let e=Object.getOwnPropertyDescriptor(t,`constructor`)?.value;if(typeof e==`function`&&e.name===`AggregateError`)return!0}}catch{}return!1}function readProperty(e,t){try{return e[t]}catch{return}}function readErrorText(e,t){let n=readProperty(e,t);return typeof n==`string`?n:void 0}function formatStatusAndCode(e){if((typeof e!=`object`||!e)&&typeof e!=`function`)return;try{if(Object.keys(e).some(e=>e!==`status`&&e!==`code`))return}catch{}let t=readProperty(e,`status`),n=readProperty(e,`code`);if(t!==void 0||n!==void 0)return`status=${typeof t==`string`||typeof t==`number`?String(t):`unknown`} code=${typeof n==`string`||typeof n==`number`?String(n):`unknown`}`}function stringifyUnknown(e){if(e===null||typeof e!=`object`&&typeof e!=`function`)return String(e);try{let t=JSON.stringify(e);if(t!==void 0)return t}catch{}try{return Object.prototype.toString.call(e)}catch{return`Unknown error`}}function readErrorCauses(e){if(!isErrorObject(e))return[];let t=readProperty(e,`cause`),n=isAggregateErrorObject(e)?readProperty(e,`errors`):void 0,r=isProviderAuthPersistenceError(e)?[readProperty(e,`persistenceError`),readProperty(e,`cleanupError`)]:[],i=readErrorText(e,`name`)===`SuppressedError`?[readProperty(e,`error`),readProperty(e,`suppressed`)].map(e=>e??String(e)):[];return[...r,t||void 0,...Array.isArray(n)?n:[],...i]}function formatErrorMessage$1(e,t={}){let n;if(isErrorObject(e)){n=readErrorText(e,`message`)||readErrorText(e,`name`)||`Error`;let r=/* @__PURE__ */ new Set([n]),appendCauseMessage=e=>{e&&!r.has(e)&&(n+=` | ${e}`,r.add(e))};if(t.includeCode){let t=readProperty(e,`code`);(typeof t==`string`||typeof t==`number`)&&appendCauseMessage(String(t))}let i=collectErrorGraphCandidates(e,readErrorCauses);for(let e of i.slice(1))if(isErrorObject(e)){let t=readErrorText(e,`message`);t&&n.includes(t)?r.add(t):appendCauseMessage(t);let i=readProperty(e,`code`);(typeof i==`string`||typeof i==`number`)&&appendCauseMessage(String(i))}else appendCauseMessage(typeof e==`string`?e:formatStatusAndCode(e)??stringifyUnknown(e))}else n=formatStatusAndCode(e)??stringifyUnknown(e);return t.redact?t.redact(n):n}function formatErrorStackWithMessage(e){let t=readErrorText(e,`name`)||`Error`,n=readErrorText(e,`message`)??``,r=readProperty(e,`stack`);if(typeof r!=`string`||!r)return n||t;if(!n||r.includes(n))return r;let i=`${t}: ${n}`,a=r.indexOf(`
`),s=a<0?r:r.slice(0,a);return s===t?i+r.slice(s.length):`${i}\n${r}`}function toErrorObject(e,t){if(e instanceof Error)return e;if(typeof e==`string`)return Error(e);let n=Error(t,{cause:e});return(typeof e==`object`&&e||typeof e==`function`)&&Object.assign(n,e),n}function stringifyNonErrorCause(e){if(e===null)return`null`;if(typeof e==`string`)return e;if(typeof e==`number`||typeof e==`boolean`||typeof e==`bigint`)return String(e);try{return JSON.stringify(e)??Object.prototype.toString.call(e)}catch{return Object.prototype.toString.call(e)}}function extractErrorCode(e){if(!e||typeof e!=`object`)return;let t=readProperty(e,`code`);return typeof t==`string`||typeof t==`number`?String(t):void 0}function collectErrorGraphCandidates(e,t){if(e==null)return[];let n=[e],r=(/* @__PURE__ */ new Set()).add(e);for(let e of n)if(e&&typeof e==`object`&&t)for(let i of t(e))i!=null&&!r.has(i)&&(r.add(i),n.push(i));return n}function collectNestedErrorCandidates(e){return collectErrorGraphCandidates(e,e=>{let t=[readProperty(e,`cause`),readProperty(e,`reason`),readProperty(e,`original`),readProperty(e,`error`),readProperty(e,`suppressed`),readProperty(e,`data`)],n=readProperty(e,`errors`);return Array.isArray(n)&&t.push(...n),t})}var ut,F=__esmMin((()=>{ut=Symbol.for(`openclaw.provider-auth-persistence-error`)}));function throwSettledAggregate(e,t){let n=e.flatMap(e=>e.status===`rejected`?[e.reason]:[]);if(n.length)throw AggregateError(n,t)}function throwCollectedErrors(e,t){if(e.length===1)throw e[0];if(e.length>1)throw AggregateError(e,t)}function materializeErrorStack(e){try{for(let t of collectNestedErrorCandidates(e))try{if(!(t instanceof Error))continue;try{t.stack=String(t.stack)}catch{t.stack=`Stack trace unavailable: custom formatter failed`}}catch{}}catch{}}function collectSynchronousErrors(e,t){let n=[];for(let r of e)try{t(r)}catch(e){n.push(e)}return n}var dt=__esmMin((()=>{F()}));function createDeferredCore(){return ft.withResolvers()}var ft,I=__esmMin((()=>{ft=Promise}));function isMissingPathError(e){return T(e,`ENOENT`)||T(e,`ENOTDIR`)||T(e,`not-found`)}var L=__esmMin((()=>{}));function resolveEnvironmentValue(e,t,n=process.platform){if(!e)return;if(n!==`win32`)return e[t]??(t===`PATH`?e.Path:void 0);let r=t.toUpperCase(),i=Object.keys(e).toSorted().find(e=>e.toUpperCase()===r);return i===void 0?void 0:e[i]}function mergeProcessEnv(e,t=process.platform){let n=Object.create(null),r=/* @__PURE__ */ new Map;for(let i of e){if(!i)continue;let e=Object.keys(i),a=/* @__PURE__ */ new Set;for(let s of t===`win32`?e.toSorted():e){let e=t===`win32`?s.toUpperCase():void 0;if(e!==void 0){if(a.has(e))continue;a.add(e);let t=r.get(e);t!==void 0&&delete n[t],r.delete(e)}let c=i[s];c===void 0?delete n[s]:(n[s]=c,e!==void 0&&Object.hasOwn(n,s)&&r.set(e,s))}}return n}function resolveDiagnosticProcessEnv(e=process.env,t=process.platform){return Object.fromEntries(Object.entries(mergeProcessEnv([e],t)).filter(([e])=>pt.has(t===`win32`?e.toUpperCase():e)))}var pt,mt=__esmMin((()=>{pt=/* @__PURE__ */ new Set(/* @__PURE__ */ `PATH.Path.HOME.USER.LOGNAME.TMPDIR.TMP.TEMP.LANG.LANGUAGE.TZ.LC_ALL.LC_COLLATE.LC_CTYPE.LC_MESSAGES.LC_MONETARY.LC_NUMERIC.LC_TIME.LC_ADDRESS.LC_IDENTIFICATION.LC_MEASUREMENT.LC_NAME.LC_PAPER.LC_TELEPHONE.SYSTEMROOT.WINDIR.COMSPEC.PATHEXT.SYSTEMDRIVE.USERPROFILE.HOMEDRIVE.HOMEPATH.USERNAME.USERDOMAIN.APPDATA.LOCALAPPDATA.PROGRAMDATA.ALLUSERSPROFILE.PROGRAMFILES.PROGRAMFILES(X86).PROGRAMW6432.COMMONPROGRAMFILES.COMMONPROGRAMFILES(X86).COMMONPROGRAMW6432.PSMODULEANALYSISCACHEPATH`.split(`.`))}));function readNativeProcessStartTime(e){if(!(process.platform!==`win32`||typeof SEALED_RUNTIME_BUILD==`boolean`&&SEALED_RUNTIME_BUILD))try{let t=oe(e);return t&&!t.exited?Math.floor(t.startTimeMicros/1e3):null}catch{return}}function windowsSystemRoot(e){let t=resolveEnvironmentValue(e,`SystemRoot`,`win32`)??resolveEnvironmentValue(e,`WINDIR`,`win32`);if(!t)return _t;let n=E.win32.normalize(t);return/^[A-Za-z]:\\/.test(n)&&!n.startsWith(`\\\\`)?n:_t}function windowsPowerShellPath(e){return E.win32.join(windowsSystemRoot(e),`System32`,`WindowsPowerShell`,`v1.0`,`powershell.exe`)}function windowsWmicPath(e){return E.win32.join(windowsSystemRoot(e),`System32`,`wbem`,`wmic.exe`)}function decodeWindowsProcessOutput(e){return Buffer.isBuffer(e)?e.length>=2&&e[0]===255&&e[1]===254?e.toString(`utf16le`):e.toString(`utf8`):e}function parseWindowsProcessStartTime(e){let t=decodeWindowsProcessOutput(e).split(/\r?\n/).map(e=>e.trim()).filter(Boolean),n=t.find(e=>e.toLowerCase().startsWith(`creationdate=`))?.slice(13).trim()??t.find(e=>e.toLowerCase()!==`creationdate`)??``,r=Date.parse(n);if(Number.isFinite(r))return r;let i=n.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.(\d{6})([+-])(\d{3})$/);if(!i)return null;let[,a,s,c,l,u,d,f,p,m]=i;return Date.UTC(Number(a),Number(s)-1,Number(c),Number(l),Number(u),Number(d),Math.floor(Number(f)/1e3))-Number(m)*6e4*(p===`+`?1:-1)}function readWindowsProcessStartTimeSync(e,t=gt,n=process.env){if(!Number.isInteger(e)||e<=0||e>4294967295)return null;let r=performance.now()+t,i=readNativeProcessStartTime(e);if(i!==void 0)return i;let a=Math.ceil(r-performance.now());if(a<=0)return null;let s=_(windowsPowerShellPath(n),[`-NoProfile`,`-NonInteractive`,`-Command`,`$process = [System.Diagnostics.Process]::GetProcessById(${e}); try { [Console]::Out.Write($process.StartTime.ToUniversalTime().ToString("o")) } finally { $process.Dispose() }`],{encoding:`utf8`,env:resolveDiagnosticProcessEnv(n,`win32`),timeout:Math.min(a,ht),windowsHide:!0});if(!s.error&&s.status===0){let e=parseWindowsProcessStartTime(s.stdout);if(e!==null)return e}let c=Math.ceil(r-performance.now());if(c<=0)return null;let l=_(windowsWmicPath(n),[`process`,`where`,`ProcessId=${e}`,`get`,`CreationDate`,`/value`],{env:resolveDiagnosticProcessEnv(n,`win32`),timeout:c,windowsHide:!0,stdio:[`ignore`,`pipe`,`ignore`]});return!l.error&&l.status===0?parseWindowsProcessStartTime(l.stdout):null}var ht,gt,_t,vt=__esmMin((()=>{mt(),ht=5e3,gt=1e4,_t=`C:\\Windows`}));function loadFreeBsdProcessIdentityNative(){if(typeof SEALED_RUNTIME_BUILD==`boolean`&&SEALED_RUNTIME_BUILD)throw Error(`FreeBSD process identity is unavailable in this sealed runtime`);return yt||=e(import.meta.url)(`@openclaw/proc-safe/identity`),yt}var yt,bt=__esmMin((()=>{}));function readFreeBsdProcessStartTime(e){if(process.platform!==`freebsd`||!Number.isInteger(e)||e<=0||e>2147483647)return null;try{return loadFreeBsdProcessIdentityNative().readProcessIdentity(e)?.startTimeSinceBootMicros??null}catch{return null}}var xt=__esmMin((()=>{bt()}));function readDarwinNativeIdentity(e){if(!(process.platform!==`darwin`||typeof SEALED_RUNTIME_BUILD==`boolean`&&SEALED_RUNTIME_BUILD))try{let t=oe(e);return t&&!t.exited?{startedAt:Math.floor(t.startTimeMicros/1e6),startTimeMicros:t.startTimeMicros}:null}catch{return}}function readNativeLiveness(e){if(!(![`darwin`,`win32`,`freebsd`].includes(process.platform)||typeof SEALED_RUNTIME_BUILD==`boolean`&&SEALED_RUNTIME_BUILD))try{let t=oe(e);return t!==null&&!t.exited}catch(e){return e instanceof ie&&(e.code===`helper-unavailable`||e.code===`unsupported-platform`)?void 0:!0}}function isValidPid(e){return Number.isInteger(e)&&e>0}function hasLinuxProcfs(){return process.platform===`linux`||process.platform===`android`}function exitedLinuxStatus(e,t){let n=t.match(/^State:\s+(\S)/m)?.[1],r=t.match(/^Threads:[ \t]+(\d+)[ \t]*$/m)?.[1];if(r===`0`)return;let i=t.match(/^Tgid:[ \t]+(\d+)[ \t]*$/m)?.[1];return i!==void 0&&Number(i)!==e||(n===`Z`||n===`X`)&&r===`1`}function isMissingPid(e){try{process.kill(e,0)}catch(e){return T(e,`ESRCH`)}return!1}function isExitedLinuxProcess(e){if(!hasLinuxProcfs())return!1;try{let t=exitedLinuxStatus(e,v.readFileSync(`/proc/${e}/status`,`utf8`));if(t!==void 0)return t}catch{}return isMissingPid(e)}async function isPidDefinitelyDeadAsync(e){if(!hasLinuxProcfs())return isPidDefinitelyDead(e);if(!isValidPid(e))return!0;try{process.kill(e,0)}catch(e){return T(e,`ESRCH`)}try{let t=exitedLinuxStatus(e,await v.promises.readFile(`/proc/${e}/status`,`utf8`));if(t!==void 0)return t}catch{}return isMissingPid(e)}function isPidDefinitelyDead(e){if(!isValidPid(e))return!0;let t=!1;try{process.kill(e,0)}catch(e){let n=se(e)?e.code:void 0;if(n!==`ESRCH`&&(process.platform!==`win32`||n!==`EPERM`))return!1;t=n===`ESRCH`}let n=readNativeLiveness(e);return n===void 0?t&&process.platform!==`freebsd`||isExitedLinuxProcess(e):!n}function getDarwinProcessStartTime(e,t,n){let r=performance.now(),i=readDarwinNativeIdentity(e);if(i!==void 0)return i?.startedAt??null;let a=n===void 0?St:Math.ceil(n-(performance.now()-r));if(a<=0)return null;try{let n=p.execFileSync(`/bin/ps`,[`-o`,`lstart=`,`-p`,String(e)],{encoding:`utf8`,env:{...resolveDiagnosticProcessEnv(t),LC_ALL:`C`,TZ:`UTC`},stdio:[`ignore`,`pipe`,`ignore`],timeout:a,killSignal:`SIGKILL`}).trim(),r=Date.parse(`${n} UTC`);return Number.isFinite(r)?Math.floor(r/1e3):null}catch{return null}}function parseLinuxProcessStat(e,t){let n=t.lastIndexOf(`)`);if(n<0||!t.startsWith(`${e} (`))return null;let r=t.slice(n+1).trimStart().split(/\s+/),i=Number(r[19]),a=Number(r[1]);return Number.isSafeInteger(i)&&i>=0&&Number.isSafeInteger(a)&&a>=0?{parentPid:a,startedAt:i}:null}function readLinuxProcessStat(e){if(!isValidPid(e)||!hasLinuxProcfs())return null;try{return parseLinuxProcessStat(e,v.readFileSync(`/proc/${e}/stat`,`utf8`))}catch{return null}}function getProcessStartTime(e){return readLinuxProcessStat(e)?.startedAt??null}function getProcessInstanceStartTime(e){if(!isValidPid(e))return null;if(hasLinuxProcfs()){let t=getProcessStartTime(e);return Number.isSafeInteger(t)?t:null}let t=readDarwinNativeIdentity(e);if(!t)return null;let n=t.startTimeMicros;return Number.isSafeInteger(n)?n:null}function getFileLockProcessStartTime(e,t=process.env,n){if(!isValidPid(e))return null;let r=e===process.pid;if(r&&Ct!==null)return Ct;let i=process.platform===`darwin`?getDarwinProcessStartTime(e,t,n):process.platform===`win32`?readWindowsProcessStartTimeSync(e,n,t):process.platform===`freebsd`?readFreeBsdProcessStartTime(e):getProcessStartTime(e);return r&&i!==null&&(Ct=i),i}var St,Ct,wt=__esmMin((()=>{L(),mt(),vt(),xt(),St=1e3,Ct=null}));function parseNodeReleaseVersion(e){if(typeof e!=`string`)return null;let t=Tt.exec(e.trim());if(!t)return null;let n={major:Number(t[1]),minor:Number(t[2]),patch:Number(t[3])};return Object.values(n).every(Number.isSafeInteger)&&(!t[4]||n.major>Dt.major)?n:null}function renderProcessNodeVersionCheck(){return`((value) => {
  if (typeof value !== "string") return false;
  const match = new RegExp(${JSON.stringify(Tt.source)}, "u").exec(value.trim());
  if (!match) return false;
  const version = { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
  if (!Object.values(version).every(Number.isSafeInteger)) return false;
  const floors = ${JSON.stringify(Et)};
  if (match[4] && version.major <= floors[floors.length - 1].major) return false;
  const minimum = floors.find((floor) => floor.major === version.major);
  const atLeast = (floor) =>
    version.major > floor.major ||
    (version.major === floor.major &&
      (version.minor > floor.minor ||
        (version.minor === floor.minor && version.patch >= floor.patch)));
  return minimum ? atLeast(minimum) : version.major > floors[floors.length - 1].major;
})(process.versions.node)`}var Tt,Et,Dt,Ot,kt=__esmMin((()=>{Tt=/^v?((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u,Et=[{major:24,minor:16,patch:0},{major:26,minor:1,patch:0}],Dt=Et[Et.length-1],Ot=Et.map(({major:e,minor:t,patch:n},r)=>`>=${e}.${t}.${n}${r<Et.length-1?` <${e+1}`:``}`).join(` || `),`${Ot.replaceAll(` || `,`, `).replace(/, ([^,]+)$/,`, or $1`)}`,renderProcessNodeVersionCheck()}));function resolveGlobalSingletonResetRegistry(){let e=globalThis,t=e[At];if(t instanceof Map)return t;let n=/* @__PURE__ */ new Map;return e[At]=n,n}function resolveGlobalSingleton(e,t,n,r=`close-and-restart`){let i=globalThis,a;return Object.hasOwn(i,e)?a=i[e]:(a=t(),i[e]=a),n&&resolveGlobalSingletonResetRegistry().set(e,{lifecycle:r,reset:()=>n(a)}),a}function resolveGlobalSet(e,t){return resolveGlobalSingleton(e,()=>/* @__PURE__ */ new Set,e=>e.clear(),t)}var At,R=__esmMin((()=>{At=Symbol.for(`openclaw.globalSingletonLifecycleResets`)}));function runInDetachedAsyncContext(e){return Mt?Mt.runInAsyncScope(e):e()}var jt,Mt,Nt=__esmMin((()=>{R(),jt=typeof process>`u`?void 0:process.getBuiltinModule?.(`node:async_hooks`),Mt=jt?resolveGlobalSingleton(Symbol.for(`openclaw.detachedAsyncContext`),()=>new jt.AsyncResource(`openclaw.detached-async-context`)):void 0})),Pt,Ft=__esmMin((()=>{kt(),L(),Nt(),R(),Buffer.from(`
VmRSS:`),Buffer.from(`
VmSwap:`),Pt=parseNodeReleaseVersion(process.versions.node),!process.versions.bun&&Pt&&(Pt.major===24&&Pt.minor>=19||Pt.major===26&&Pt.minor>=4&&Pt.minor),ke(C),resolveGlobalSingleton(Symbol.for(`openclaw.hostExecMemory`),()=>({watches:/* @__PURE__ */ new Set,sampling:!1,assessmentPending:!1}))}));function spawnInAgentExecCgroup(e,t){if(!e||process.platform!==`linux`)return t();let n=!1;try{v.writeFileSync(E.join(e,`cgroup.procs`),`0`),n=!0}catch(e){process.emitWarning(`Agent exec cgroup placement failed: ${String(e)}`)}try{return t()}finally{if(n)try{let t=E.basename(E.dirname(e))===`agent-exec`?E.dirname(e):e;v.writeFileSync(E.join(E.dirname(t),`gateway`,`cgroup.procs`),`0`)}catch(e){process.emitWarning(`Spawn broker could not return to the Gateway cgroup: ${String(e)}`)}}}var It=__esmMin((()=>{Ft()}));function normalizeNullableString(e){return typeof e==`string`&&e.trim()||null}function normalizeOptionalString(e){return normalizeNullableString(e)??void 0}function normalizeOptionalLowercaseString(e){return normalizeOptionalString(e)?.toLowerCase()}function normalizeLowercaseStringOrEmpty(e){return normalizeOptionalLowercaseString(e)??``}var Lt=__esmMin((()=>{}));function asBoolean(e){return typeof e==`boolean`?e:void 0}function parseBooleanValue(e,t={}){let n=asBoolean(e);if(n!==void 0)return n;let r=normalizeOptionalLowercaseString(e);if(r){if((t.truthy??Rt).includes(r))return!0;if((t.falsy??zt).includes(r))return!1}}var Rt,zt,Bt=__esmMin((()=>{Lt(),Rt=[`true`,`1`,`yes`,`on`],zt=[`false`,`0`,`no`,`off`]}));dt(),wt(),It(),Bt();const Vt=`OPENCLAW_CHILD_OOM_SCORE_ADJ`;function raiseChildOomScore(e){if(e!==void 0)try{v.writeFileSync(`/proc/${e}/oom_score_adj`,`1000`)}catch{}}function spawnOomScoreAdjusted(e,t,n){let r=g(e,t,n);return!n.shell&&shouldAdjustChildOomScore(n)&&raiseChildOomScore(r.pid),r}function shouldAdjustChildOomScore(e){return(e?.platform??process.platform)===`linux`&&parseBooleanValue(e?.env?.[Vt]??process.env[Vt])!==!1}function isWrapped(e,t){return e===`/bin/sh`&&t[0]===`-c`&&t[1]===`echo 1000 > /proc/self/oom_score_adj 2>/dev/null; exec "$0" "$@"`}function spawnWithInheritedOomScore(e,t,n){if(process.platform!==`linux`||!isWrapped(e,t)||!t[2]||n.shell||n.argv0!==void 0)return spawnOomScoreAdjusted(e,t,n);let r,i;try{r=v.openSync(`/proc/self/oom_score_adj`,`r+`),i=v.readFileSync(r,`utf8`).trim(),v.writeSync(r,`1000`,0,`utf8`)}catch{return r!==void 0&&v.closeSync(r),g(e,t,n)}try{return g(t[2],t.slice(3),n)}finally{try{v.writeSync(r,i,0,`utf8`)}catch{process.emitWarning(`Could not restore spawn owner's Linux OOM score`)}finally{v.closeSync(r)}}}function disposeFailedChild(e){if(e){e.once(`error`,()=>{}),e.pid&&e.exitCode===null&&e.signalCode===null&&e.kill(`SIGKILL`),e.connected&&e.disconnect();for(let t of e.stdio??[])t?.destroy()}}function waitForBrokerChildCompletion(e){return new Promise(t=>{let n=e.exitCode!=null||e.signalCode!=null,r=!e.connected,i=0,finish=()=>{n&&r&&i===0&&(e.removeListener(`exit`,onExit),e.removeListener(`error`,onError),e.removeListener(`disconnect`,onDisconnect),t())},onExit=()=>{n=!0,finish()},onError=()=>{e.pid===void 0&&(n=!0,r=!0,finish())},onDisconnect=()=>{r=!0,finish()};e.once(`exit`,onExit),e.on(`error`,onError),e.once(`disconnect`,onDisconnect);for(let t of e.stdio??[])t&&!t.closed&&(i++,t.once(`close`,()=>{i--,finish()}));finish()})}var Ht=__esmMin((()=>{}));function killProcessTree(e,t){if(!Number.isFinite(e)||e<=0)return;if(process.platform===`win32`){if(t?.force===!0){signalProcessTreeWindowsAndWait(e,`SIGKILL`);return}killProcessTreeWindows(e,normalizeGraceMs(t?.graceMs));return}let n=t?.detached===!0||t?.detached!==!1&&isProcessGroupLeader(e),r=t?.detached===!1&&!n&&process.platform===`linux`,i=r?collectUnixProcessTree(e):void 0;if(r&&!i){signalProcessTreeUnix(e,t?.force===!0?`SIGKILL`:`SIGTERM`,!1);return}let a=!1,force=()=>{if(a)return;a=!0;let t=i?.filter(verifiedProcessInstanceAlive)??[];(n?isProcessAlive(-e):r?t.length>0:isProcessAlive(e))&&signalProcessTreeUnix(e,`SIGKILL`,n,i?t:void 0)};if(t?.force===!0){i?force():signalProcessTreeUnix(e,`SIGKILL`,n);return}signalProcessTreeUnix(e,`SIGTERM`,n,i);let s=normalizeGraceMs(t?.graceMs),c=setTimeout(force,s);r||c.unref();let l=!1;return{force:()=>{clearTimeout(c),force()},exited:()=>(l||=n?!isProcessAlive(-e):i?!i.some(capturedProcessInstanceMayBeAlive):!isProcessAlive(e),l&&(a=!0,clearTimeout(c)),l)}}function normalizeGraceMs(e){return typeof e!=`number`||!Number.isFinite(e)?Ut:Math.max(0,Math.min(Wt,Math.floor(e)))}function isProcessAlive(e){try{process.kill(e,0)}catch(e){if((typeof e==`object`&&e&&`code`in e?e.code:void 0)!==`EPERM`)return!1}if(e<0||process.platform!==`linux`)return!0;try{let t=w(`/proc/${e}/status`,`utf8`);return!(t.match(/^State:\s+(\S)/m)?.[1]===`Z`&&/^Threads:[ \t]+1[ \t]*$/m.test(t))}catch{return!0}}function parseProcessGroupId(e){if(typeof e!=`string`||!/^\d+$/.test(e.trim()))return;let t=Number(e.trim());return Number.isSafeInteger(t)&&t>0?t:void 0}function readPsOutput(e){try{let t=_(`ps`,e,{encoding:`utf8`,timeout:500});return t.error||t.status!==0?void 0:t.stdout}catch{return}}function readProcStatFields(e){try{let t=w(`/proc/${e}/stat`,`utf8`),n=t.lastIndexOf(`)`);return n<0?void 0:t.slice(n+1).trim().split(/\s+/)}catch{return}}function isProcessGroupLeader(e){return((process.platform===`linux`?parseProcessGroupId(readProcStatFields(e)?.[2]):void 0)??parseProcessGroupId(readPsOutput([`-p`,String(e),`-o`,`pgid=`])))===e}function parsePositivePids(e){return typeof e==`string`?e.trim().split(/\s+/u).map(e=>Number(e)).filter(e=>Number.isSafeInteger(e)&&e>0):[]}function readUnixProcessIdentity(e,t){return readUnixProcessInstance(e,t)?.identity}function readUnixProcessInstance(e,t){if(t!==void 0&&Date.now()>=t||process.platform!==`linux`)return;let n=readProcStatFields(e),r=Number(n?.[1]),i=n?.[19];if(i&&/^\d+$/u.test(i)&&Number.isSafeInteger(r))return{identity:`${e}:${i}`,ppid:r}}function verifiedProcessInstanceAlive(e){return!e.identity||!isProcessAlive(e.pid)?!1:readUnixProcessIdentity(e.pid)===e.identity}function capturedProcessInstanceMayBeAlive(e){if(!e.identity||!isProcessAlive(e.pid))return!1;let t=readUnixProcessIdentity(e.pid);return t===void 0||t===e.identity}function*readUnixProcessChildren(e,t){let n;try{for(n=S(`/proc/${e}/task`);t();){let t=n.readSync();if(!t)return;let r=parseProcessGroupId(t.name);if(r)try{yield*parsePositivePids(w(`/proc/${e}/task/${r}/children`,`utf8`))}catch{}}}catch{}finally{try{n?.closeSync()}catch{}}}function collectUnixProcessTree(e){if(process.platform!==`linux`)return;let t=[],n=/* @__PURE__ */ new Set([e]),r=0,i=Date.now()+Kt,a=readUnixProcessIdentity(e,i);if(!a||Date.now()>=i)return;let withinBounds=e=>Date.now()<i&&e<=Jt,hasCapacity=()=>n.size<qt,visit=(e,a,s)=>{if(!withinBounds(s)||!hasCapacity()||readUnixProcessIdentity(e,i)!==a)return;let c=readUnixProcessChildren(e,()=>withinBounds(s)&&hasCapacity()&&r++<qt&&readUnixProcessIdentity(e,i)===a);for(let r of c){if(!withinBounds(s+1)||!hasCapacity())return;if(n.has(r)||r===process.pid)continue;n.add(r);let a=readUnixProcessInstance(r,i);a&&a.ppid===e&&withinBounds(s+1)&&(visit(r,a.identity,s+1),t.push({pid:r,identity:a.identity}))}};return visit(e,a,0),[...t,{pid:e,identity:a}]}function signalProcessTreeUnix(e,t,n,r){if(n){signalUnixTarget(-e,t);return}let i=r??[{pid:e}];for(let e of i)(!r||verifiedProcessInstanceAlive(e))&&signalUnixTarget(e.pid,t)}function signalUnixTarget(e,t){try{process.kill(e,t)}catch{}}function runTaskkill(e,t){return new Promise(n=>{let r=!1,finish=e=>{r||(r=!0,clearTimeout(i),t?.(e),n())},i=setTimeout(()=>finish(null),Gt);i.unref?.();try{let t=g(`taskkill`,e,{stdio:`ignore`,detached:!0,windowsHide:!0});t.once(`error`,()=>finish(null)),t.once(`close`,e=>finish(e))}catch{finish(null)}})}function killProcessTreeWindows(e,t){let n=!1,r,forceKill=()=>{n||(n=!0,r!==void 0&&(clearTimeout(r),r=void 0),isProcessAlive(e)&&signalProcessTreeWindowsAndWait(e,`SIGKILL`))};signalProcessTreeWindowsAndWait(e,`SIGTERM`,e=>{e!==null&&e!==0&&forceKill()}),r=setTimeout(forceKill,t),r.unref()}function signalProcessTreeWindowsAndWait(e,t,n){return runTaskkill(t===`SIGKILL`?[`/F`,`/T`,`/PID`,String(e)]:[`/T`,`/PID`,String(e)],n)}var Ut,Wt,Gt,Kt,qt,Jt,Yt=__esmMin((()=>{Ut=3e3,Wt=6e4,Gt=3e3,Kt=500,qt=4096,Jt=128})),Xt=__esmMin((()=>{Yt()})),Zt=__esmMin((()=>{L()}));function failure(e){if(e instanceof DarwinProcessInspectionError)return e;let t=e&&typeof e==`object`&&`code`in e?e.code:void 0;return new DarwinProcessInspectionError(t===`ETIMEDOUT`||t===`ABORT_ERR`||t===`timeout`?`deadline`:[`EACCES`,`EPERM`,`ERR_ACCESS_DENIED`,`access-denied`].includes(String(t))?`permission`:`unavailable`,{cause:e})}function remaining(e){let t=Math.floor(e-performance.now());if(t<=0)throw new DarwinProcessInspectionError(`deadline`);return t}function hasReadableTopology(e){if(e.parentPid===void 0||e.processGroupId===void 0||e.state===void 0){if(oe(e.pid)===null)return!1;throw new DarwinProcessInspectionError(`unavailable`)}return!0}function topology(e){return{pid:e.pid,ppid:e.parentPid,pgid:e.processGroupId,state:Qt[e.state],owner:e.owner}}function census(e,t){try{let n=Ne({timeoutMs:remaining(e),...t?{pids:t}:{}}).filter(hasReadableTopology);return remaining(e),n}catch(t){throw remaining(e),failure(t)}}function*readDarwinProcessCensus(e){let t=performance.now()+e,n=census(t).map(topology);for(let e of n)remaining(t),yield e;remaining(t)}var DarwinProcessInspectionError,Qt,$t=__esmMin((()=>{DarwinProcessInspectionError=class extends Error{constructor(e,t){super(`Darwin process inspection ${e}`,t),this.reason=e,this.name=`DarwinProcessInspectionError`,this.code=e===`deadline`?`ETIMEDOUT`:e===`permission`?`EPERM`:`EIO`}},Qt={running:`R`,sleeping:`S`,stopped:`T`,zombie:`Z`,idle:`I`,unknown:`?`}}));function readLinuxProcessUid(e){try{let t=w(`/proc/${e}/status`,`utf8`).split(`
`).filter(e=>e.startsWith(`Uid:`)),n=(t.length===1?/^Uid:[ \t]+(\d+)[ \t]+(\d+)[ \t]+(\d+)[ \t]+(\d+)[ \t]*$/.exec(t[0]):null)?.slice(1).map(Number),r=process.getuid?.();return n?.every(e=>Number.isSafeInteger(e)&&e<=4294967295)?n.find(e=>e===r)??n[0]:void 0}catch{return}}function parseLinuxProcessGroupMember(e,t){let n=/^(\d+) \([\s\S]*\) (\S) (\d+) (-1|\d+)(?:\s|$)/.exec(t);if(!n||Number(n[1])!==e)throw Error(`Process group census is unavailable`);return{pid:e,ppid:Number(n[3]),pgid:Number(n[4]),state:n[2]}}async function readLinuxProcessGroupMemberAsync(e){let t=await O.readFile(`/proc/${e}/stat`,`utf8`);return{...parseLinuxProcessGroupMember(e,t),startedAt:parseLinuxProcessStat(e,t)?.startedAt??null}}function*readProcessGroupMembers(e,t){let n=t!==void 0;if(process.platform===`linux`){let t=Date.now()+e;for(let e of ee(`/proc`)){if(Date.now()>=t)throw Error(`Process group census exceeded its deadline`);if(!/^\d+$/.test(e))continue;let r=Number(e),i,a,s,c=!1;try{if(i=w(`/proc/${e}/stat`,`utf8`),n){s=readLinuxProcessUid(r);try{a=w(`/proc/${e}/cmdline`,`utf8`).split(`\0`).filter(Boolean)}catch(e){let t=process.getuid?.();if(c=s!==void 0&&t!==void 0&&s!==t&&[`EACCES`,`EPERM`].includes(extractErrorCode(e)??``),!c)throw e}}}catch(e){if(r!==process.pid&&[`ENOENT`,`ESRCH`].includes(extractErrorCode(e)??``))continue;throw Error(`Could not classify PID ${r}: process command inspection failed (${extractErrorCode(e)??`unavailable`}).`,{cause:e})}let l=parseLinuxProcessGroupMember(r,i);if(Date.now()>=t)throw Error(`Process group census is unavailable`);if(a?.length===0){let e=Number(i.slice(i.lastIndexOf(`)`)+2).split(/\s+/)[6]);if(!(Number.isInteger(e)&&e&2097152)&&!isPidDefinitelyDead(r)){let e=process.getuid?.();if(s!==void 0&&e!==void 0&&s!==e)c=!0,a=void 0;else throw Error(`Could not classify PID ${r}: live userspace process has no readable arguments.`)}}yield{pid:r,pgid:l.pgid,state:l.state,...a?{command:{ppid:l.ppid,argv:a,...s===void 0?{}:{uid:s}}}:c&&s!==void 0?{command:{ppid:l.ppid,argvUnavailable:!0,uid:s}}:{}}}if(Date.now()>=t)throw Error(`Process group census exceeded its deadline`);return}if(process.platform===`darwin`){for(let r of readDarwinProcessCensus(e)){let e={pid:r.pid,pgid:r.pgid,state:r.state},i;try{i=n?r.state.startsWith(`Z`)||r.pid===0?{argv:[]}:t?.readDarwinCommand(r.pid,r.owner):void 0}catch(t){if(!(t instanceof ie)||t.code!==`incomplete`&&t.code!==`layout-mismatch`)throw t;yield{...e,ppid:r.ppid};continue}(!n||i)&&(yield{...e,...i?{command:{ppid:r.ppid,owner:r.owner,...i}}:{}})}return}if(n)throw Error(`Exact process command census is unavailable on ${process.platform}.`);let r=Date.now()+e,i=_(`/bin/ps`,[`-A`,`-o`,`pid=,pgid=,stat=`],{encoding:`utf8`,timeout:e,maxBuffer:4194304});if(i.error||i.status!==0)throw Error(`Process group census is unavailable`);for(let e of i.stdout.split(`
`)){if(!e.trim())continue;let t=/^\s*(\d+)\s+(\d+)\s+(\S+)\s*$/.exec(e);if(!t)throw Error(`Process group census is unavailable`);let n=Number(t[1]);n!==i.pid&&(yield{pid:n,pgid:Number(t[2]),state:t[3]})}if(n&&Date.now()>=r)throw Error(`Process group census exceeded its deadline`)}function isLiveCensusMember({pid:e,state:t}){return!t.startsWith(`Z`)||process.platform===`linux`&&!isPidDefinitelyDead(e)}function isOwnProcfs(){if(process.platform!==`linux`)return!0;try{return te(`/proc/self`)===String(process.pid)}catch{return!1}}function isProcessGroupGoneByCensus(e){if(!isOwnProcfs())return!1;try{for(let t of readProcessGroupMembers(1e3))if(t.pgid===e&&isLiveCensusMember(t))return!1;return!0}catch{return!1}}async function*readLinuxProcessGroupMembersAsync(e){if(process.platform!==`linux`)throw Error(`Asynchronous Linux process census requires Linux`);let t=Date.now()+e;for(let e of await O.readdir(`/proc`)){if(Date.now()>=t)throw Error(`Process group census exceeded its deadline`);if(!/^\d+$/.test(e))continue;let n=Number(e),r;try{r=await O.readFile(`/proc/${e}/stat`,`utf8`)}catch(e){if(n!==process.pid&&[`ENOENT`,`ESRCH`].includes(extractErrorCode(e)??``))continue;throw e}if(Date.now()>=t)throw Error(`Process group census exceeded its deadline`);yield parseLinuxProcessGroupMember(n,r)}if(Date.now()>=t)throw Error(`Process group census exceeded its deadline`)}async function isOwnProcfsAsync(){if(process.platform!==`linux`)return!0;try{return await O.readlink(`/proc/self`)===String(process.pid)}catch{return!1}}async function isProcessGroupGoneByCensusAsync(e){if(!await isOwnProcfsAsync())return!1;try{for await(let t of readLinuxProcessGroupMembersAsync(1e3))if(t.pgid===e&&(!t.state.startsWith(`Z`)||!await isPidDefinitelyDeadAsync(t.pid)))return!1;return!0}catch{return!1}}var en=__esmMin((()=>{F(),$t()}));function isDeniedProcessGroupProbe(e,t=0){if(process.platform!==`linux`||!T(e,`EPERM`))return!1;try{return process.kill(-4194305,t),!1}catch(e){return T(e,`EPERM`)}}function probeProcessGroup(e){try{return process.kill(-e,0),`alive`}catch(e){return T(e,`ESRCH`)?`gone`:isDeniedProcessGroupProbe(e)?`denied`:`alive`}}function isProcessGroupGoneByKernel(e){return probeProcessGroup(e)===`gone`}function isProcessGroupGone(e){let t=probeProcessGroup(e);return t===`gone`||t===`denied`&&isProcessGroupGoneByCensus(e)}async function isProcessGroupGoneAsync(e){let t=probeProcessGroup(e);return t===`gone`||t===`denied`&&await isProcessGroupGoneByCensusAsync(e)}var tn=__esmMin((()=>{L(),Zt(),en()}));function readCommandProcessStartTime(e,t={}){return process.platform!==`linux`&&process.platform!==`android`?t.instance?getProcessInstanceStartTime(e):getFileLockProcessStartTime(e):O.readFile(`/proc/${e}/stat`,`utf8`).then(n=>t.child&&(t.child.exitCode!=null||t.child.signalCode!=null)?null:parseLinuxProcessStat(e,n)?.startedAt??null,()=>null)}var nn=__esmMin((()=>{wt()})),rn,an=__esmMin((()=>{rn=5e3}));function childCapacityError(e,t){let n=0,r=0;for(let t of e)n++,t===`mcp`&&r++;if(n>=on)return`Spawn broker child capacity exceeded (${on}); close running processes before retrying`;if(t===`mcp`&&r>=sn)return`Spawn broker MCP child capacity exceeded (${sn}); close unused MCP sessions before retrying`}function serializeBrokerError(e){return{message:e.message,code:e.code,errno:e.errno,syscall:e.syscall,path:e.path}}var on,sn,SpawnBrokerError,z=__esmMin((()=>{on=512,sn=448,SpawnBrokerError=class extends Error{constructor(e,t){super(e,t),this.code=`ERR_SPAWN_BROKER_UNAVAILABLE`,this.name=`SpawnBrokerError`}}}));function isBrokerChildGroupAlive(e){if(isProcessGroupGone(e.pid))return!1;let t=getProcessInstanceStartTime(e.pid);if(e.isLeaderAlive)return e.isLeaderAlive()||isPidDefinitelyDead(e.pid)?e.startedAt===null||t===null||t===e.startedAt:!1;if(e.startedAt===null||t===null&&!isPidDefinitelyDead(e.pid))throw new SpawnBrokerError(`Spawn broker group leader identity is unavailable for pid=${e.pid}`);return t===null||t===e.startedAt}function signalRevalidatedGroupMembers(e,t,{snapshot:n,signaled:r}){if(!isOwnProcfs())throw new SpawnBrokerError(`Spawn broker cannot verify the process table belongs to its PID namespace`);let i=n.filter(t=>t.pid!==process.pid&&t.pgid===e&&!isPidDefinitelyDead(t.pid));if(!i.length)return 0;let a=new Map(i.map(e=>[e.pid,getProcessInstanceStartTime(e.pid)])),s;for(let n of readProcessGroupMembers(1e3)){if(n.pid===process.pid||n.pgid!==e||!a.has(n.pid))continue;let i=a.get(n.pid);if(i===null){if(!isPidDefinitelyDead(n.pid))throw new SpawnBrokerError(`Spawn broker cannot identify remaining group member pid=${n.pid}`);continue}if(getProcessInstanceStartTime(n.pid)!==i)continue;let c=`${n.pid}:${i}`;if(r.get(c)!==t){try{process.kill(n.pid,t)}catch(e){if(extractErrorCode(e)!==`ESRCH`){s??={error:e};continue}}r.set(c,t)}}if(s)throw s.error;return i.length}async function signalRevalidatedGroupMembersAsync(e,t,{snapshot:n,signaled:r}){if(!await isOwnProcfsAsync())throw new SpawnBrokerError(`Spawn broker cannot verify the process table belongs to its PID namespace`);let i=/* @__PURE__ */ new Map;for(let t of n)t.pid!==process.pid&&t.pgid===e&&!await isPidDefinitelyDeadAsync(t.pid)&&i.set(t.pid,await readCommandProcessStartTime(t.pid,{instance:!0}));if(!i.size)return 0;let a;for await(let n of readLinuxProcessGroupMembersAsync(1e3)){if(n.pid===process.pid||n.pgid!==e||!i.has(n.pid))continue;let s=i.get(n.pid);if(s===null){if(!await isPidDefinitelyDeadAsync(n.pid))throw new SpawnBrokerError(`Spawn broker cannot identify remaining group member pid=${n.pid}`);continue}let c=await readLinuxProcessGroupMemberAsync(n.pid).catch(()=>void 0),l=t();if(!l)return i.size;if(!c||c.pgid!==e||c.startedAt!==s)continue;let u=`${n.pid}:${s}`;if(r.get(u)!==l){try{process.kill(n.pid,l)}catch(e){if(extractErrorCode(e)!==`ESRCH`){a??={error:e};continue}}r.set(u,l)}}if(a)throw a.error;return i.size}function terminateRetainedBrokerChildGroup(e){let t=!1,n=!1,r,i,a=`SIGTERM`,c=/* @__PURE__ */ new Map,signalMembers=()=>{try{signalRevalidatedGroupMembers(e.pid,a,{snapshot:[...readProcessGroupMembers(1e3)],signaled:c})}catch(e){r=e}},signal=n=>{if(!t){if(!isBrokerChildGroupAlive(e))t=!0;else{a=n;try{process.kill(-e.pid,n)}catch(e){if(isDeniedProcessGroupProbe(e,n))i=e,signalMembers();else if(extractErrorCode(e)===`ESRCH`)t=!0;else throw e}}}},force=()=>{t||n||(n=!0,signal(`SIGKILL`))};return{force,settled:(async()=>{let n=performance.now()+rn,a=n+2e3;try{for(signal(`SIGTERM`);!t&&isBrokerChildGroupAlive(e);){if(performance.now()>=n&&force(),i&&!t&&signalMembers(),performance.now()>=a)throw new SpawnBrokerError(`Spawn broker child cleanup could not be confirmed for pid=${e.pid}`,{cause:r??i});await s(50)}}finally{t=!0}})()}}function terminateLostBrokerChild(e,t,n){if(t&&n){if(n.pid!==e)throw new SpawnBrokerError(`Spawn broker cleanup identity changed`);return terminateRetainedBrokerChildGroup(n)}let r=killProcessTree(e,{detached:t,graceMs:rn}),i=performance.now()+rn+2e3;return{force:()=>r?.force(),settled:(async()=>{for(;;){if(t){if(r?.exited(),await isPidDefinitelyDeadAsync(e)&&await isProcessGroupGoneAsync(e))break}else if(await isPidDefinitelyDeadAsync(e)&&(r?.exited()??!0))break;if(performance.now()>=i)throw new SpawnBrokerError(`Spawn broker child cleanup could not be confirmed for pid=${e}`);await s(50)}})()}}async function drainCurrentBrokerProcessGroup(){if(process.platform===`win32`)return;let e=performance.now()+rn,t=/* @__PURE__ */ new Map;for(;;){let n=[...readProcessGroupMembers(1e3)];if(!n.some(e=>e.pid===process.pid&&e.pgid===process.pid))throw new SpawnBrokerError(`Spawn broker lost its private process group`);let r=performance.now()<e?`SIGTERM`:`SIGKILL`;if(!signalRevalidatedGroupMembers(process.pid,r,{snapshot:n,signaled:t}))return;await s(50)}}function terminateBrokerProcessGroup(e){let t=!1,n,r,i=`SIGTERM`,a=/* @__PURE__ */ new Map,c,retire=()=>{t=!0,clearTimeout(c)},signalMembers=async()=>{try{let n=[];for await(let e of readLinuxProcessGroupMembersAsync(1e3))n.push(e);await signalRevalidatedGroupMembersAsync(e,()=>t?void 0:i,{snapshot:n,signaled:a})}catch(e){n=e}},signal=async a=>{if(t||isProcessGroupGoneByKernel(e))retire();else{i=a;try{process.kill(-e,a)}catch(e){isDeniedProcessGroupProbe(e,a)?(r=e,await signalMembers()):extractErrorCode(e)!==`ESRCH`&&(n=e)}}},force=()=>{if(!t){if(isProcessGroupGone(e))retire();else{i=`SIGKILL`,clearTimeout(c);try{process.kill(-e,i)}catch(t){if(isDeniedProcessGroupProbe(t,i)){r=t;try{signalRevalidatedGroupMembers(e,i,{snapshot:[...readProcessGroupMembers(1e3)],signaled:a})}catch(e){n=e}}else extractErrorCode(t)!==`ESRCH`&&(n=t)}}}},l,escalate=()=>{t||l||(i=`SIGKILL`,l=(async()=>{await isProcessGroupGoneAsync(e)?retire():t||await signal(`SIGKILL`)})().catch(e=>{n=e}))};return{force,settled:(async()=>{try{if(await isProcessGroupGoneAsync(e))return;await signal(i),!t&&i===`SIGTERM`&&(c=setTimeout(escalate,rn));let a=performance.now()+rn+2e3;for(;await l,!(t||await isProcessGroupGoneAsync(e));){if(performance.now()>=a)throw new SpawnBrokerError(`Spawn broker group cleanup could not be confirmed for pgid=${e}`,{cause:n??r});r&&await signalMembers(),await s(50)}}finally{retire(),await l}})()}}var cn=__esmMin((()=>{F(),wt(),tn(),nn(),Xt(),an(),en(),z()}));function renderOutput(e){let t=typeof e==`string`?e:ln.decode(e);return t.endsWith(`
`)&&(t=t.slice(0,t.endsWith(`\r
`)?-2:-1)),Ae(t).replace(/[\p{Separator}\p{Other}]/gu,e=>{let t=un.get(e);if(t!==void 0)return t;let n=e.codePointAt(0),r=n.toString(16);return n<=65535?`\\u${r.padStart(4,`0`)}`:`\\U${r}`})}function encodeExecaMessage(e,t){let n=[],r=e.length;for(let i of[`stdout`,`stderr`]){let a=renderOutput(t[i]);if(!a)continue;let s=r-a.length;if(s<2||!e.endsWith(a,r)||e.slice(s-2,s)!==`

`)return{message:e};n.unshift(i),r=s-2}return n.length>0?{message:e.slice(0,r),messageOutputs:n}:{message:e}}function decodeExecaMessage(e,t){return e.messageOutputs?[e.message,...e.messageOutputs.map(e=>renderOutput(t[e]))].join(`

`):e.message}function serializeExecaError(e,t={}){return{name:e.name,...encodeExecaMessage(e.message,t),...`code`in e&&typeof e.code==`string`?{code:e.code}:{},...e.cause instanceof Error?{cause:serializeExecaError(e.cause)}:{}}}function restoreError(e,t){let n=Error(decodeExecaMessage(e,t),{cause:e.cause?restoreError(e.cause,t):void 0});return Object.assign(n,{name:e.name,code:e.code})}function restoreExecaResult(e){let{error:t,...n}=e,r={...n,stdout:n.stdout,stderr:n.stderr,shortMessage:n.shortMessage,code:n.code};if(t){let e=restoreError(t,r);return Object.assign(e,r,{cause:e.cause})}return{...r,cause:void 0}}function createBrokerExecaAdmissionFailure(e){return{failed:!0,code:e.code,timedOut:!1,isCanceled:!1,isGracefullyCanceled:!1,isMaxBuffer:!1,isTerminated:!1,isForcefullyTerminated:!1,command:``,escapedCommand:``,cwd:process.cwd(),durationMs:0,error:serializeExecaError(e)}}var ln,un,dn=__esmMin((()=>{ln=new TextDecoder,un=/* @__PURE__ */ new Map([[` `,` `],[`
`,`
`],[`\b`,`\\b`],[`\f`,`\\f`],[`\r`,`\\r`],[`	`,`\\t`]])}));dn(),Ht(),cn();async function prepareProcessOutputFile(e){let t=await O.open(e.path,`wx`,384),n;return{stdio:e.maxBytes===void 0?t.fd:`pipe`,start(r,i=!1,a=waitForBrokerChildCompletion(r)){let s=0,c=e.maxBytes;return n=(async()=>{try{if(await Ie(r,`spawn`),c===void 0)return await a,(await t.stat()).size;if(!r.stdout)throw Error(`Process output pipe is unavailable`);return await Re(r.stdout,new Le({transform(e,t,n){s+=e.byteLength,n(s>c?Object.assign(/* @__PURE__ */ Error(`Process output exceeds ${c} bytes`),{code:`ERR_PROCESS_OUTPUT_LIMIT`}):null,e)}}),t.createWriteStream()),await a,s}catch(e){let t=r.pid?terminateLostBrokerChild(r.pid,i):void 0;throw t?.force(),await Promise.all([a,t?.settled]),e}finally{await t.close()}})(),n.catch(()=>{}),n},async close(){n?await n.catch(()=>{}):await t.close()}}}function createBrokerSender(e){let t=0,n=0,r=0,i=Promise.resolve(),write=(t,n,r)=>new Promise((i,a)=>{try{let launch=()=>e(t,n,e=>e?a(e):i());r?r(launch):launch()}catch(e){a(toErrorObject(e,`Spawn broker IPC write failed`))}}),enqueue=(e,r)=>{if(t+e>268435456||n>=1024)return Promise.reject(new BrokerIpcAdmissionError(`Spawn broker IPC capacity exceeded`));t+=e,n+=1;let a=i.then(r);return i=a.then(()=>{},()=>{}),a.finally(()=>{t-=e,--n})};return Object.assign((e,t,n)=>{let i=A(e),a=i.byteLength;if(a>fn&&t)return Promise.reject(new BrokerIpcAdmissionError(`Spawn broker handle metadata exceeds one IPC frame`));let s=++r;return enqueue(a,async()=>{if(a<=fn)await write(e,t,n);else for(let e=0;e<a;e+=fn){let t={kind:pn,id:s,total:a,offset:e,bytes:i.subarray(e,e+fn)};await write(t,void 0,e+fn>=a?n:void 0)}})},{reserve(e){return enqueue(fn,()=>e(async e=>{if(A(e).byteLength>fn)throw new SpawnBrokerError(`Spawn broker reserved publication exceeds one IPC frame`);await write(e)}))}})}function createBrokerReceiver(){let e,clear=()=>{e=void 0};return{receive(t){if(!t||typeof t!=`object`||!(`kind`in t)||t.kind!==pn)return clear(),t;let n=t;if(!Number.isSafeInteger(n.id)||!Number.isSafeInteger(n.total)||n.total<=fn||n.total>268435456||!Number.isSafeInteger(n.offset)||!Buffer.isBuffer(n.bytes)||n.bytes.length===0||n.bytes.length>fn)throw new SpawnBrokerError(`Invalid spawn broker IPC frame`);let r=e?.id===n.id?e:void 0;if(!r){if(n.offset!==0)throw new SpawnBrokerError(`Spawn broker receive capacity exceeded`);e=r={id:n.id,total:n.total,received:0,chunks:[]}}if(r.total!==n.total||r.received!==n.offset||r.received+n.bytes.length>r.total)throw new SpawnBrokerError(`Out-of-order spawn broker IPC frame`);if(r.chunks.push(n.bytes),r.received+=n.bytes.length,!(r.received<r.total))return clear(),Be(Buffer.concat(r.chunks,r.total))},clear}}var fn,pn,BrokerIpcAdmissionError,mn=__esmMin((()=>{F(),z(),fn=1048576,pn=`openclaw-spawn-broker-frame`,BrokerIpcAdmissionError=class extends SpawnBrokerError{}}));function brokerSpawnOptions(e){let t=e.stdio??`pipe`,n=typeof t==`string`?[t,t,t]:[...t],r=[];for(let e=0;e<Math.max(3,n.length);e+=1){let t=n[e]??(e<3?`pipe`:`ignore`);if(t===`inherit`&&e!==0||t!==`pipe`&&t!==`ignore`&&t!==`inherit`&&t!==`ipc`)return;r.push(t)}if(e.signal||e.timeout||e.killSignal)throw Error(`Unsupported spawn broker cancellation options`);return{cwd:e.cwd instanceof URL?j(e.cwd):e.cwd,env:e.env?{...e.env}:{...process.env},argv0:e.argv0,detached:e.detached,shell:e.shell,windowsHide:e.windowsHide,windowsVerbatimArguments:e.windowsVerbatimArguments,serialization:e.serialization,uid:e.uid,gid:e.gid,stdio:r}}function holdPipe(e){let t={read:e.read.bind(e),resumed:!1,onResume:()=>{t.resumed=!0}};hn.set(e,t),e.on(`resume`,t.onResume),e.on(`readable`,holdReadable),e.read=()=>null}function holdPipeForTransfer(e){stopPipeReads(e),holdPipe(e)}function restoreStdinPipe(e){let t=Reflect.get(e,`_readableState`);if(!t||typeof t!=`object`||[`ended`,`endEmitted`,`reading`].some(e=>typeof Reflect.get(t,e)!=`boolean`))throw new SpawnBrokerError(`Spawn broker requires a Node readable state for stdin`);stopPipeReads(e),Object.assign(t,{readable:!1,ended:!0,endEmitted:!0,reading:!1})}function stopPipeReads(e){let t=Reflect.get(e,`_handle`);if(!t||typeof t!=`object`||!(`readStop`in t)||typeof t.readStop!=`function`||!(`reading`in t)||typeof t.reading!=`boolean`)throw new SpawnBrokerError(`Spawn broker requires a transferable Node pipe handle`);if(t.readStop()!==0)throw new SpawnBrokerError(`Spawn broker could not stop pipe reads`);t.reading=!1}function takePipePrefix(e){let t=hn.get(e);if(!t)throw Error(`Spawn broker pipe was not held for handoff`);let n=t.read.call(e,e.readableLength);if(restoreReader(e),n===null)return Buffer.alloc(0);if(!Buffer.isBuffer(n))throw Error(`Spawn broker pipe must contain bytes`);return n}function releasePipe(e){let t=restoreReader(e);t&&process.nextTick(()=>{e.destroyed||(e.emit(`readable`),t.resumed&&e.resume())})}function restoreReader(e){let t=hn.get(e);if(t)return e.read=t.read,hn.delete(e),e.removeListener(`resume`,t.onResume),e.removeListener(`readable`,holdReadable),t}var hn,holdReadable,gn=__esmMin((()=>{z(),hn=/* @__PURE__ */ new WeakMap,holdReadable=()=>{}}));function isRecord(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function asOptionalRecord(e){return isRecord(e)?e:void 0}var B=__esmMin((()=>{}));function encodeNativeWorkerFailure(e){let t=/* @__PURE__ */ new Map,encode=e=>{if(!(e instanceof Error))return{kind:`value`,value:e==null||typeof e==`string`||typeof e==`number`||typeof e==`boolean`||typeof e==`bigint`?e:stringifyNonErrorCause(e)};let n=t.get(e);if(n)return n;let r={kind:`error`,constructorName:e instanceof AggregateError?`AggregateError`:e instanceof SuppressedError?`SuppressedError`:[..._n].find(([,t])=>e instanceof t)?.[0]??`Error`,name:e.name,message:e.message,stack:e.stack};t.set(e,r);for(let t=e;t;t=Object.getPrototypeOf(t)){let e=Object.getOwnPropertyDescriptor(t,`code`);if(e){let t=e.value;(typeof t==`string`||typeof t==`number`)&&(r.code=t);break}}for(let t of[`errcode`,`errno`]){let n=Object.getOwnPropertyDescriptor(e,t)?.value;typeof n==`number`&&(r[t]=n)}Object.hasOwn(e,`cause`)&&(r.cause=encode(e.cause));let i=Object.getOwnPropertyDescriptor(e,`errors`)?.value;if(Array.isArray(i)&&(r.errors=i.map(encode)),e instanceof SuppressedError||e.name===`SuppressedError`)for(let t of[`error`,`suppressed`]){let n=Object.getOwnPropertyDescriptor(e,t);n&&`value`in n&&(r[t]=encode(n.value))}return r};return encode(e)}function decodeNativeWorkerFailure(e){let t=/* @__PURE__ */ new Map,decode=e=>{if(e.kind===`value`)return e.value;let n=t.get(e);if(n)return n;let r=_n.get(e.constructorName)??Error,i=e.constructorName===`AggregateError`?AggregateError([],e.message):e.constructorName===`SuppressedError`?new SuppressedError(void 0,void 0,e.message):new r(e.message);t.set(e,i),i.name=e.name,i.stack=e.stack;let defineField=(e,t,n=!1)=>{Object.defineProperty(i,e,{value:t,writable:!0,configurable:!0,enumerable:n})};for(let t of[`code`,`errcode`,`errno`])e[t]!==void 0&&defineField(t,e[t],!0);e.cause&&defineField(`cause`,decode(e.cause)),e.errors&&defineField(`errors`,e.errors.map(decode));for(let t of[`error`,`suppressed`]){let n=e[t];n&&defineField(t,decode(n))}return i};return decode(e)}var _n,vn=__esmMin((()=>{F(),_n=new Map([EvalError,RangeError,ReferenceError,SyntaxError,TypeError,URIError,Error].map(e=>[e.name,e]))}));function spawnBrokerStartupNowMs(){return Number(bn()/1000000n)}var yn,bn,BrokerNativeResourceCloseError,xn=__esmMin((()=>{yn=15e3,bn=process.hrtime.bigint.bind(process.hrtime),BrokerNativeResourceCloseError=class extends Error{constructor(e){super(`Native resource cleanup failed`),this.payload=e,this.name=`BrokerNativeResourceCloseError`}}}));function createBrokerResourceSocket(e,t){let n=createBrokerReceiver(),r=Buffer.alloc(4),i=0,a,s=0,c=!1,l,u,stop=t=>{c||(c=!0,materializeErrorStack(t),l=t,n.clear(),a=void 0,u?.(t??new SpawnBrokerError(`Spawn broker resource socket closed`)),e.destroy())},d=createBrokerSender((t,n,r)=>{if(c||e.destroyed){r(l??new SpawnBrokerError(`Spawn broker resource socket closed`));return}let i=A(t);if(i.length>268435456){r(new SpawnBrokerError(`Spawn broker resource frame exceeds capacity`));return}let a=Buffer.allocUnsafe(4+i.length);a.writeUInt32BE(i.length),i.copy(a,4);let complete=e=>{u===complete&&(u=void 0,r(e),e&&stop(e))};u=complete;try{e.write(a,e=>complete(e??null))}catch(e){complete(toErrorObject(e,`Spawn broker resource write failed`))}});return e.on(`data`,e=>{try{let l=0;for(;l<e.length&&!c;){if(!a){let t=Math.min(4-i,e.length-l);if(e.copy(r,i,l,l+t),i+=t,l+=t,i!==4)continue;let n=r.readUInt32BE();if(n===0||n>268435456)throw new SpawnBrokerError(`Invalid spawn broker resource frame length`);a=Buffer.allocUnsafe(n),i=0}let c=Math.min(a.length-s,e.length-l);if(e.copy(a,s,l,l+c),s+=c,l+=c,s!==a.length)continue;let u=n.receive(Be(a));if(a=void 0,s=0,u!==void 0){if(!u||typeof u!=`object`||!(`value`in u))throw new SpawnBrokerError(`Invalid spawn broker resource message`);t.message(u.value)}}}catch(e){stop(toErrorObject(e,`Spawn broker resource read failed`))}}),e.once(`end`,()=>stop(a||i?new SpawnBrokerError(`Spawn broker resource socket ended during a frame`):void 0)),e.once(`error`,stop),e.once(`close`,()=>{stop(),t.close(l)}),{async send(t){if(c||e.destroyed)throw l??new SpawnBrokerError(`Spawn broker resource socket closed`);await d({value:t})},close:()=>stop()}}var Sn=__esmMin((()=>{F(),mn(),z()}));gn(),B(),dt(),vn(),mn(),xn(),Sn();var BrokerResourcePort=class extends Fe{constructor(e){super(),this.send=e,this.closed=!1}postMessage(e){if(this.closed)throw Error(`Native resource message port is closed`);this.send(e)}receive(e){this.closed||this.emit(`message`,e)}close(){this.closed||(this.closed=!0,this.emit(`close`))}};async function createBrokerNativeResourceServer(e){let t=/* @__PURE__ */ new Map,n=process.platform===`win32`?void 0:de(e.endpoint),r=/* @__PURE__ */ new Set,a=!0,s=!1,c=!1,l,u=0,d=0,live=()=>a&&process.connected,publishParent=t=>{e.reportParent(t).catch(()=>disconnect())},publishSocket=(e,t)=>{let n=e.socket;n&&n.send(t).catch(()=>n.close())},publish=(e,t)=>{publishSocket(e,t),publishParent(t)},failed=(e,t)=>{publish(e,{type:`resource-failed`,id:e.attachment.id,error:encodeNativeWorkerFailure(t)})},seal=(e,t)=>{for(let n of t)try{n?.close()}catch(t){live()&&failed(e,t)}},closeError=(e,t,n)=>{let r={type:`resource-close-error`,id:e.attachment.id,requestId:t},i;try{i=e.owner?.encodeCloseError?{...r,error:e.owner.encodeCloseError(n),resourceError:!0}:{...r,error:encodeNativeWorkerFailure(n),resourceError:!1}}catch(e){i={...r,error:encodeNativeWorkerFailure(AggregateError([n,e],`Native resource cleanup error encoding failed`,{cause:n})),resourceError:!1}}publish(e,i)},closeOwner=e=>{if(e.closed)return Promise.resolve();if(e.nativeClose)return e.nativeClose;let t=Promise.resolve().then(async()=>{await e.owner?.close(),e.closed=!0,seal(e,[e.target,e.ownerPort])});return e.nativeClose=t,t.catch(()=>{a&&(e.nativeClose=void 0)}),t},closeResource=async(e,t)=>{if(e.closed)publish(e,{type:`resource-closed`,id:e.attachment.id,requestId:t});else try{await(e.closing??=(async()=>{await new Promise(t=>{s?t():(e.finishInitializationWait=t,e.initialized.then(t))}),live()&&await closeOwner(e)})().finally(()=>{e.closing=void 0,e.finishInitializationWait=void 0})),live()&&publish(e,{type:`resource-closed`,id:e.attachment.id,requestId:t})}catch(n){live()&&closeError(e,t,n)}},receiveOwner=(e,t)=>{if(t.sequence<=e.ownerSequence)return;if(!e.ownerPort||e.closed||!e.created)throw Error(`Native resource owner port is unavailable`);let n=e.ownerPort,apply=(t,r)=>{e.ownerSequence=t;try{n.receive(r)}catch(n){try{return publish(e,{type:`resource-owner-rejected`,id:e.attachment.id,sequence:t,error:encodeNativeWorkerFailure(n)}),!0}catch(t){return failed(e,t),disconnect(),!1}}return publish(e,{type:`resource-owner-received`,id:e.attachment.id,sequence:t}),!0};if(t.sequence!==e.ownerSequence+1){if(e.ownerMessages.has(t.sequence))return;let n=A(t).length;if(u+n>268435456||d>=1024)throw Error(`Native resource owner receive capacity exceeded`);e.ownerMessages.set(t.sequence,{value:t.value,size:n}),u+=n,d++}else if(apply(t.sequence,t.value))for(;;){let t=e.ownerMessages.get(e.ownerSequence+1);if(!t||(e.ownerMessages.delete(++e.ownerSequence),u-=t.size,d--,!apply(e.ownerSequence,t.value)))return}},receive=e=>{if(!live())return;if(e.type===`resource-seal`){s=!0;for(let e of t.values())e.finishInitializationWait?.();return}let n=t.get(e.id);if(!n){if(s&&e.type===`resource-close`){publishParent({type:`resource-closed`,id:e.id,requestId:e.requestId});return}publishParent({type:`resource-failed`,id:e.id,error:encodeNativeWorkerFailure(/* @__PURE__ */ Error(`Native resource owner is unavailable`))})}else if(e.type===`resource-owner`)try{receiveOwner(n,e)}catch(e){failed(n,e)}else if(e.type===`resource-close`)closeResource(n,e.requestId);else if(e.type===`resource-release`){if(!n.closed){failed(n,/* @__PURE__ */ Error(`Native resource must close before release`));return}t.delete(e.id);for(let e of n.ownerMessages.values())u-=e.size,d--;n.ownerMessages.clear(),n.socket?.close()}else if(!n.created||n.closed||(n.closing||s)&&e.type===`resource-target`)failed(n,/* @__PURE__ */ Error(`Native resource is not accepting messages`));else try{if(n.targetSealed)throw Error(`Native resource target port is closed`);n.target.receive(e.value)}catch(e){failed(n,e)}},f=i(n=>{let i,a=createBrokerResourceSocket(n,{message(r){if(!live()||!r||typeof r!=`object`||!(`type`in r)){a.close();return}let l=r;if(l.type===`resource-seal`){a.close();return}if(l.type!==`resource-attach`){if(!i||l.id!==i.attachment.id||![`resource-target`,`resource-owner`,`resource-close`,`resource-release`].includes(l.type)){a.close();return}receive(l);return}let u=l.attachment;if(s||i||!u||u.secret!==e.secret||u.generation!==e.generation||u.endpoint!==e.endpoint||!Number.isSafeInteger(u.id)||u.id<=0||typeof u.moduleUrl!=`string`||u.sourceLoaderUrl!==void 0&&typeof u.sourceLoaderUrl!=`string`||typeof u.ownerPort!=`boolean`||t.has(u.id)){a.close();return}if(!e.canAdmit()){a.send({type:`resource-failed`,id:u.id,error:encodeNativeWorkerFailure(/* @__PURE__ */ Error(`Spawn broker request capacity exceeded`))}).finally(()=>a.close()).catch(()=>{});return}let d={attachment:u,target:new BrokerResourcePort(e=>{publishSocket(d,{type:`resource-target`,id:u.id,value:e})}),initialized:Promise.resolve(),created:!1,targetSealed:!1,closed:!1,sequence:0,ownerSequence:0,ownerMessages:/* @__PURE__ */ new Map};u.ownerPort&&(d.ownerPort=new BrokerResourcePort(e=>{publish(d,{type:`resource-owner`,id:u.id,sequence:++d.sequence,value:e})})),t.set(u.id,d),i=d,d.socket=a,n.setTimeout(0);let f={type:`resource-ready`,id:u.id,pid:process.pid,generation:e.generation},p=a.send(f);publishParent(f),d.initialized=(async()=>{if(await p,!live()||s)return;if(!c&&u.sourceLoaderUrl){let e=await import(u.sourceLoaderUrl);if(!live()||s)return;if(!isRecord(e)||typeof e.register!=`function`)throw Error(`Native resource source loader is unavailable`);e.register(),c=!0}let e=await import(u.moduleUrl);live()&&!s&&(d.owner=e.createNativeWorkerResource(d.target,u.input,d.ownerPort),d.created=!0,publish(d,{type:`resource-created`,id:u.id}))})().catch(e=>{failed(d,e)})},close(){r.delete(a),i?.socket===a&&(i.socket=void 0,i.targetSealed=!0,seal(i,[i.target]))}});r.add(a),n.setTimeout(yn,()=>a.close()),live()||a.close()});f.maxConnections=256;let p=new Promise(e=>{f.once(`close`,e)});function disconnect(){if(a){a=!1,s=!0,f.close();for(let e of r)e.close();for(let e of t.values())e.finishInitializationWait?.(),seal(e,[e.target,e.ownerPort]);close().catch(()=>{process.exitCode=1,process.stderr.write(`Spawn broker native resource cleanup failed.
`)})}}function close(){return l??=Promise.resolve().then(async()=>{let e=await Promise.allSettled([...t.values()].map(async e=>{await e.initialized,await closeOwner(e)}));await p,n&&e.push(...await Promise.allSettled([Se(n,{recursive:!0,force:!0})])),throwSettledAggregate(e,`Spawn broker native resource cleanup failed`),t.clear()}),disconnect(),l}n&&await ye(n,{mode:448});try{n&&await ve(n,448),await new Promise((t,n)=>{f.once(`error`,n),f.listen(e.endpoint,()=>{f.off(`error`,n),f.on(`error`,disconnect),t()})})}catch(e){let t=[e];if(n)try{await Se(n,{recursive:!0,force:!0})}catch(e){t.push(e)}throw throwCollectedErrors(t,`Native resource server startup and cleanup failed`),e}return{receive,disconnect,close,get size(){return t.size}}}mn();function createWorkerSender(e){let n,r,finish=(e,t)=>{n===e&&(n=void 0,e.callback(t))},i=createBrokerSender((i,a,s)=>{if(r){s(r);return}if(!(a instanceof t)||!i||typeof i!=`object`||!(`type`in i)||i.type!==`pipe`||!(`id`in i)||typeof i.id!=`number`||!(`fd`in i)||typeof i.fd!=`number`){e(i,a,s);return}let c={id:i.id,fd:i.fd,written:!1,received:!1,callback:s};n=c;let l=i.fd===0&&a.destroyed;try{e(l?{...i,closed:!0}:i,l?void 0:a,e=>{e?finish(c,e):(c.written=!0,c.received&&finish(c,null))})}catch(e){throw n=void 0,e}});return{send:i,reserve(e){return i.reserve(async t=>{if(r)throw r;return await e(t)})},acknowledge(e,t){n&&n.id===e&&n.fd===t&&(n.received=!0,n.written&&finish(n,null))},close(e){r=e,n&&finish(n,e)}}}function basenameFromAnyPath(e){let t=E.win32.basename(E.posix.basename(e));return t===`.`||t===`..`?``:t}function extnameFromAnyPath(e){return E.extname(basenameFromAnyPath(e))}var Cn=__esmMin((()=>{}));function isZipContainerMime(e){return e.endsWith(`+zip`)||On.has(e)}function normalizeMimeType(e){if(!e)return;let t=e.split(`;`)[0]?.trim().toLowerCase();if(t)return Object.hasOwn(kn,t)?kn[t]:t}async function sniffMime(e){if(e){try{let{fileTypeFromBuffer:t}=await import(`file-type`),n=await t(e.byteLength<=1048576?e:e.subarray(0,wn));if(n?.mime)return normalizeMimeType(n.mime)}catch{}return e.toString(`ascii`,0,4)===`caff`?`audio/x-caf`:void 0}}function getFileExtension(e){if(!e)return;let t=/^https?:\/\//i.test(e)?URL.parse(e):null;if(t){let e=t.pathname.slice(t.pathname.lastIndexOf(`/`)+1);try{let t=e.replace(/%2f/gi,`%252F`).replace(/%5c/gi,`%255C`);e=decodeURIComponent(t)}catch{}return E.posix.extname(e).toLowerCase()||void 0}return extnameFromAnyPath(e).toLowerCase()||void 0}function mimeTypeFromFilePath(e){let t=getFileExtension(e);if(t)return En[t]}async function detectMime(e){let t=En[getFileExtension(e.filePath)??``],n=[e.headerMime,...e.additionalMimeHints??[]].map(e=>normalizeMimeType(e)).filter(e=>!!e),r=n[0],i=await sniffMime(e.buffer),a=i===`application/octet-stream`||i===`application/zip`,s=t&&t!==i&&!t.startsWith(`image/`)?t:void 0,c=i===`application/zip`?[t,...n].find(e=>e&&isZipContainerMime(e)):i===`application/octet-stream`?s??n.find(e=>e!==`application/octet-stream`):void 0,l=a?c??i:i??t;return l&&[...n,t].find(e=>e&&Dn[e]===l)||(l??r)}var wn,Tn,En,Dn,On,kn,An=__esmMin((()=>{Cn(),wn=1048576,Tn={"image/avif":`.avif`,"image/heic":`.heic`,"image/heic-sequence":`.heic`,"image/heif":`.heif`,"image/heif-sequence":`.heif`,"image/bmp":`.bmp`,"image/jpg":`.jpg`,"image/jpeg":`.jpg`,"image/png":`.png`,"image/svg+xml":`.svg`,"image/webp":`.webp`,"image/gif":`.gif`,"audio/aiff":`.aiff`,"audio/x-aiff":`.aiff`,"audio/ogg":`.ogg`,"audio/mpeg":`.mp3`,"audio/mp3":`.mp3`,"audio/wav":`.wav`,"audio/wave":`.wav`,"audio/x-wav":`.wav`,"audio/flac":`.flac`,"audio/aac":`.aac`,"audio/amr":`.amr`,"audio/opus":`.opus`,"audio/webm":`.webm`,"audio/x-m4a":`.m4a`,"audio/m4a":`.m4a`,"audio/mp4":`.m4a`,"audio/x-caf":`.caf`,"video/x-msvideo":`.avi`,"video/x-m4v":`.m4v`,"video/mp4":`.mp4`,"video/x-matroska":`.mkv`,"video/webm":`.webm`,"video/x-flv":`.flv`,"video/x-ms-wmv":`.wmv`,"video/quicktime":`.mov`,"application/pdf":`.pdf`,"application/json":`.json`,"application/yaml":`.yaml`,"application/zip":`.zip`,"application/gzip":`.gz`,"application/x-tar":`.tar`,"application/x-7z-compressed":`.7z`,"application/vnd.rar":`.rar`,"application/msword":`.doc`,"application/vnd.ms-excel":`.xls`,"application/vnd.ms-powerpoint":`.ppt`,"application/vnd.openxmlformats-officedocument.wordprocessingml.document":`.docx`,"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":`.xlsx`,"application/vnd.openxmlformats-officedocument.presentationml.presentation":`.pptx`,"text/csv":`.csv`,"text/plain":`.txt`,"text/markdown":`.md`,"text/html":`.html`,"text/xml":`.xml`,"text/css":`.css`,"application/xml":`.xml`},En={};for(let[e,t]of Object.entries(Tn))En[t]??=e;Object.assign(En,{".jpg":`image/jpeg`,".m2a":`audio/mpeg`,".m4b":`audio/mp4`,".mp3":`audio/mpeg`,".oga":`audio/ogg`,".wav":`audio/wav`,".webm":`video/webm`,".aif":`audio/aiff`,".aifc":`audio/aiff`,".jpeg":`image/jpeg`,".cfg":`text/plain`,".conf":`text/plain`,".env":`text/plain`,".ini":`text/plain`,".js":`text/javascript`,".log":`text/plain`,".htm":`text/html`,".tsv":`text/tab-separated-values`,".xml":`text/xml`,".yml":`application/yaml`}),Dn={"audio/mp4":`video/mp4`,"audio/x-m4a":`video/mp4`,"audio/m4a":`video/mp4`,"audio/webm":`video/webm`},On=/* @__PURE__ */ new Set(/* @__PURE__ */ `application/java-archive,application/vnd.android.package-archive,application/vnd.apple.keynote,application/vnd.apple.numbers,application/vnd.apple.pages,application/vnd.google-earth.kmz,application/vnd.ms-excel.sheet.macroenabled.12,application/vnd.ms-excel.template.macroenabled.12,application/vnd.ms-powerpoint.presentation.macroenabled.12,application/vnd.ms-powerpoint.slideshow.macroenabled.12,application/vnd.ms-powerpoint.template.macroenabled.12,application/vnd.ms-visio.drawing,application/vnd.ms-visio.drawing.macroenabled.12,application/vnd.ms-visio.stencil,application/vnd.ms-visio.stencil.macroenabled.12,application/vnd.ms-visio.template,application/vnd.ms-visio.template.macroenabled.12,application/vnd.ms-word.document.macroenabled.12,application/vnd.ms-word.template.macroenabled.12,application/vnd.oasis.opendocument.graphics,application/vnd.oasis.opendocument.graphics-template,application/vnd.oasis.opendocument.presentation,application/vnd.oasis.opendocument.presentation-template,application/vnd.oasis.opendocument.spreadsheet,application/vnd.oasis.opendocument.spreadsheet-template,application/vnd.oasis.opendocument.text,application/vnd.oasis.opendocument.text-template,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.presentationml.slideshow,application/vnd.openxmlformats-officedocument.presentationml.template,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.spreadsheetml.template,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.wordprocessingml.template,application/x-xpinstall,model/3mf`.split(`,`)),kn={"image/apng":`image/png`,"text/yaml":`application/yaml`,"application/x-yaml":`application/yaml`,"application/xml":`text/xml`,"video/vnd.avi":`video/x-msvideo`,"video/matroska":`video/x-matroska`}}));function attachmentClassFromMime(e){let t=normalizeMimeType(e);return t?t.startsWith(`text/`)||jn.test(t)||t.endsWith(`+json`)||t.endsWith(`+xml`)?`text`:t.startsWith(`image/`)?`image`:t.startsWith(`audio/`)?`audio`:t.startsWith(`video/`)?`video`:Mn.test(t)?`document`:Nn.test(t)||isZipContainerMime(t)?`archive`:`binary`:`binary`}function resolveUtf16Charset(e){if(e.length<2)return;let t=e.readUInt16LE(0);if(t===65279)return`utf-16le`;if(t===65534)return`utf-16be`;let n=Math.min(e.length,2048),r=0,i=0;for(let t=0;t<n;t+=1)e[t]===0&&(t%2==0?r+=1:i+=1);if(!((r+i)/n<=.2))return i>=r?`utf-16le`:`utf-16be`}function textRatios(e,t){let n=0,r=0,i=0;for(let a of e){let e=a.codePointAt(0)??0,s=e===9||e===10||e===13||e===32,c=!s&&(e<32||e>=127&&e<=159);i+=1,n+=Number(!c),r+=Number(s||!c&&t&&Pn.test(a))}return i===0?[0,0]:[n/i,r/i]}function isCleanText(e,t){try{return textRatios(new TextDecoder(t,{fatal:!0}).decode(e),!1)[0]===1}catch{return!1}}function sniffTextCharset(e){let t=e.subarray(0,4096),n=t.subarray(-4),r=n.findLastIndex(e=>(e&192)!=128),i=n[r]??0,a=i>=240?4:i>=224?3:i>=194?2:1,s=t.length+Math.max(0,r+a-n.length);try{return textRatios(new TextDecoder(`utf-8`,{fatal:!0}).decode(e.subarray(0,s)),!1)[0]>.85?`utf-8`:void 0}catch{let[e,n]=textRatios(new TextDecoder(`windows-1252`).decode(t),!0);return e>.95&&n>.3?`windows-1252`:void 0}}async function classifyAttachmentBytes(e){let t=await detectMime({buffer:e.buffer,headerMime:e.declaredMime,additionalMimeHints:e.additionalMimeHints,filePath:e.name??void 0}),n=attachmentClassFromMime(t),r=[e.declaredMime,...e.additionalMimeHints??[]],i;for(let e of r)if(e)try{let t=new De(e).params.get(`charset`);if(t!==null){i=t;break}}catch{}let a=e.buffer.length>=2&&(e.buffer.readUInt16LE(0)===65279||e.buffer.readUInt16LE(0)===65534);if(t===`application/octet-stream`||t?.startsWith(`application/vnd.`)||n!==`binary`&&!a){let a=n===`text`?resolveUtf16Charset(e.buffer)??i:void 0;return n===`text`&&!a&&!r.some(e=>/;\s*charset\s*=/i.test(e??``))&&sniffTextCharset(e.buffer)===`windows-1252`&&(a=`windows-1252`),a?{mime:t,class:n,charset:a}:{mime:t,class:n}}let s=await detectMime({buffer:e.buffer});if(s&&s===t&&attachmentClassFromMime(s)===`binary`)return{mime:s,class:`binary`};let c=e.buffer.length>=4?e.buffer.readUInt32BE(0):0;if(c===1347093252||c===1347092738||c===1347093766)return{mime:t,class:`archive`};let l=a?resolveUtf16Charset(e.buffer):void 0;if(n===`text`&&l&&isCleanText(e.buffer,l))return{mime:t,class:`text`,charset:l};let u=resolveUtf16Charset(e.buffer)??sniffTextCharset(e.buffer);if(!u)return{mime:t,class:`binary`};let d=mimeTypeFromFilePath(e.name),f=new TextDecoder(u).decode(e.buffer.subarray(0,Math.min(e.buffer.length,8192))).split(/\r?\n/,1)[0],p=(attachmentClassFromMime(d)===`text`?d:void 0)??(f?.includes(`,`)?`text/csv`:f?.includes(`	`)?`text/tab-separated-values`:`text/plain`),m=u===`utf-16le`||u===`utf-16be`?u:i??u;return{mime:p,class:`text`,...m===`utf-8`?{}:{charset:m}}}var jn,Mn,Nn,Pn,Fn=__esmMin((()=>{An(),jn=/^application\/(?:json|javascript|xml|yaml|x-yaml)$/,Mn=/^application\/(?:pdf|msword|x-cfb|vnd\.(?:apple\.(?:keynote|numbers|pages)|ms-.+|oasis\.opendocument\..+|openxmlformats-officedocument\..+))$/,Nn=/^application\/(?:gzip|vnd\.rar|x-7z-compressed|x-gzip|x-rar-compressed|x-tar|x-zip-compressed|zip)$/,Pn=/[\p{L}\p{N}]/u})),In=__esmMin((()=>{})),Ln=__esmMin((()=>{})),Rn=__esmMin((()=>{})),zn=__esmMin((()=>{}));function expectDefined(e,t){if(e==null)throw Error(`expected `+t+` to be defined`);return e}var Bn=__esmMin((()=>{})),Vn=__esmMin((()=>{})),Hn=__esmMin((()=>{}));function asFiniteNumber(e){return typeof e==`number`&&Number.isFinite(e)?e:void 0}function resolveTimerTimeoutMs(e,t,n=1){let r=asFiniteNumber(e)??asFiniteNumber(t),i=Math.max(0,Math.floor(n));return r===void 0?i:Math.min(Math.max(Math.floor(r),i),Un)}var Un,Wn=__esmMin((()=>{Un=2147e6,Math.floor(Un/1e3)})),Gn=__esmMin((()=>{})),Kn=__esmMin((()=>{}));function normalizeStringEntries(e){return(e??[]).map(e=>String(e).trim()).filter(Boolean)}function normalizeStringEntriesLower(e){return normalizeStringEntries(e).map(e=>e.toLowerCase())}function uniqueValues(e){return[...new Set(e)]}function uniqueStrings(e){return uniqueValues(e)}function normalizeUniqueStringEntriesLower(e){return uniqueStrings(normalizeStringEntriesLower(e?[...e]:void 0))}var qn=__esmMin((()=>{})),Jn=__esmMin((()=>{}));function isHighSurrogate(e){return e>=55296&&e<=56319}function isLowSurrogate(e){return e>=56320&&e<=57343}function sliceUtf16Safe(e,t,n){let r=e.length,i=t<0?Math.max(r+t,0):Math.min(t,r),a=n===void 0?r:n<0?Math.max(r+n,0):Math.min(n,r);return a<=i?``:(i>0&&i<r&&isLowSurrogate(e.charCodeAt(i))&&isHighSurrogate(e.charCodeAt(i-1))&&(i+=1),a>0&&a<r&&isHighSurrogate(e.charCodeAt(a-1))&&isLowSurrogate(e.charCodeAt(a))&&--a,e.slice(i,a))}function truncateUtf16Safe(e,t){let n=Math.max(0,Math.floor(t));return e.length<=n?e:sliceUtf16Safe(e,0,n)}var Yn=__esmMin((()=>{})),Xn=__esmMin((()=>{In(),Ln(),Rn(),zn(),F(),Bn(),Vn(),Hn(),Wn(),B(),Gn(),Kn(),Lt(),qn(),Jn(),Yn()}));function clearActiveProgressLine(){Zn?.isTTY&&Zn.write(`\r\x1B[2K`)}var Zn,Qn=__esmMin((()=>{Zn=null}));function isVerbose(){return $n}var $n,er=__esmMin((()=>{$n=!1}));function notifyListeners(e,t,n){for(let r of e)try{r(t)}catch(e){n?.(e)}}function registerListener(e,t){return e.add(t),()=>e.delete(t)}var tr=__esmMin((()=>{}));function isInternalDiagnosticEventInterested(e,t,n){return(!e?.include||e.include.includes(t))&&!e?.exclude?.includes(t)&&(!n||!e?.includeTrusted||e.includeTrusted.includes(t))}function hasInternalDiagnosticEventInterest(e,t=!1){let n=t?nr.trustedInterest:nr.untrustedInterest;return n.broadInterestCount+(n.eventInterestDeltas.get(e)??0)>0}var nr,rr=__esmMin((()=>{R(),nr=resolveGlobalSingleton(Symbol.for(`openclaw.diagnosticEventListenerPresence.v1`),()=>({untrustedInterest:{broadInterestCount:0,eventInterestDeltas:/* @__PURE__ */ new Map},trustedInterest:{broadInterestCount:0,eventInterestDeltas:/* @__PURE__ */ new Map},interestListeners:/* @__PURE__ */ new Map,internalCount:0,trustedCount:0,promptStatsCount:0}))}));function enterAsyncStore(e,t){return this.enterWith(e),t()}function runWithAsyncStore(e,t,n){return e.getStore()===t?n():new _e(`OpenClawAsyncStore`).runInAsyncScope(enterAsyncStore,e,t,n)}var ir=__esmMin((()=>{})),ar,or=__esmMin((()=>{R(),resolveGlobalSingleton(Symbol.for(`openclaw.pluginSourceAcquisitionFailures`),()=>/* @__PURE__ */ new WeakSet),resolveGlobalSingleton(Symbol.for(`openclaw.pluginSourcePreparationOperations`),()=>/* @__PURE__ */ new WeakSet),resolveGlobalSingleton(Symbol.for(`openclaw.pluginInventoryRetiredError`),()=>class extends Error{constructor(){super(`Plugin inventory has retired; begin a new plugin operation.`),this.name=`PluginInventoryRetiredError`}}),resolveGlobalSingleton(Symbol.for(`openclaw.pluginSourceRecoveryUnavailableError`),()=>class extends Error{constructor(e){super(`Captured plugin source is missing; its previous code cannot be recovered.`,{cause:e}),this.name=`PluginSourceRecoveryUnavailableError`}}),ar=resolveGlobalSingleton(Symbol.for(`openclaw.pluginInstanceDrainTimeoutError`),()=>class extends Error{constructor(e,t,n,r){super(e,n),this.settled=t,this.forcedRetirement=r,this.name=`PluginInstanceDrainTimeoutError`}})}));function createPluginExecutionFrame(e,t){return t?t.withScopes(e):new sr(e)}var sr,cr,lr,ur=__esmMin((()=>{ir(),R(),or(),sr=class InvocationFrame{constructor(e,t=e.invocation){this.retentionOwner=e.retentionOwner,this.invocation=t,this.metadataScope=e.metadataScope,this.cacheScope=e.cacheScope,this.sourceCaptureStorage=e.sourceCaptureStorage}get runtimePluginId(){}get canUseInteractiveStateReadCapacity(){return!1}withScopes(e){return new InvocationFrame(e)}},cr=resolveGlobalSingleton(Symbol.for(`openclaw.pluginInstanceInvocation`),()=>{let e=new D;return{invocation:{getStore(){return e.getStore()?.invocation},run(t,n){let r=e.getStore();return r?.invocation===t?n():runWithAsyncStore(e,createPluginExecutionFrame({...r,invocation:t},r),n)},exit(t){let n=e.getStore();return n?.invocation?runWithAsyncStore(e,n.withScopes({...n,invocation:void 0}),t):t()}},getFrame(){return e.getStore()},runFrame(t,n){return runWithAsyncStore(e,t,n)}}}),cr.invocation,lr=cr.getFrame,cr.runFrame})),V,dr,fr,pr,mr=__esmMin((()=>{V={priority:!1,publicExcluded:!1},dr=[{...V,name:`worker.request`},{...V,name:`diagnostic.gc`,publicExcluded:!0},{...V,name:`gateway.event_loop.sample`,publicExcluded:!0},{...V,name:`gateway.main_thread.stall`,publicExcluded:!0},{...V,name:`gateway.http.cancelled`,publicExcluded:!0},{...V,name:`gateway.rpc`,publicExcluded:!0},{...V,name:`sessions.list.baseline.retired`},{...V,name:`sessions.list.retention`,publicExcluded:!0},{...V,name:`sessions.projection.retention`,publicExcluded:!0},{...V,name:`sessions.event.retention`,publicExcluded:!0},{...V,name:`sessions.event.rows.reset`,publicExcluded:!0},{...V,name:`gateway.ws.event`,publicExcluded:!0},{...V,name:`gateway.ws.connections`,publicExcluded:!0},{...V,name:`tool.execution.started`},{...V,name:`tool.execution.completed`,priority:!0},{...V,name:`tool.execution.error`,priority:!0},{...V,name:`tool.execution.blocked`,priority:!0},{...V,name:`skill.used`},{...V,name:`exec.process.completed`},{...V,name:`exec.approval.followup_suppressed`},{...V,name:`message.delivery.started`},{...V,name:`message.delivery.completed`},{...V,name:`message.delivery.error`},{...V,name:`talk.event`},{...V,name:`model.call.started`},{...V,name:`model.call.completed`,priority:!0},{...V,name:`model.call.error`,priority:!0},{...V,name:`model.response.observed`},{...V,name:`run.progress`},{...V,name:`run.execution_phase`},{...V,name:`agent.commentary`},{...V,name:`harness.run.completed`,priority:!0},{...V,name:`harness.run.error`,priority:!0},{...V,name:`context.assembled`},{...V,name:`log.record`,publicExcluded:!0}],fr=dr.map(e=>e.name),pr=dr.filter(e=>e.priority).map(e=>e.name),dr.filter(e=>e.publicExcluded).map(e=>e.name)})),hr,AsyncContext,gr=__esmMin((()=>{R(),hr=resolveGlobalSingleton(Symbol.for(`openclaw.asyncContext`),()=>new D),AsyncContext=class{constructor(e){this.key=e}getStore(){return hr.getStore()?.[this.key]}run(e,t){let n=hr.getStore(),r=n?.[this.key];if(Object.is(r,e))return t();let i={...n,[this.key]:e};hr.enterWith(i);try{return t()}finally{let e=hr.getStore();hr.enterWith(e===i?n:{...e,[this.key]:r})}}exit(e){return this.run(void 0,e)}enterWith(e){hr.enterWith({...hr.getStore(),[this.key]:e})}}}));function isNonZeroHex(e){return!/^0+$/.test(e)}function isValidDiagnosticTraceId(e){return typeof e==`string`&&_r.test(e)&&isNonZeroHex(e)}function isValidDiagnosticSpanId(e){return typeof e==`string`&&vr.test(e)&&isNonZeroHex(e)}function isValidDiagnosticTraceFlags(e){return typeof e==`string`&&yr.test(e)}function normalizeDiagnosticTraceContext(e){let t=asOptionalRecord(e);if(t&&isValidDiagnosticTraceId(t.traceId)&&(t.spanId===void 0||isValidDiagnosticSpanId(t.spanId))&&(t.parentSpanId===void 0||isValidDiagnosticSpanId(t.parentSpanId))&&(t.traceFlags===void 0||isValidDiagnosticTraceFlags(t.traceFlags)))return{traceId:t.traceId,...t.spanId?{spanId:t.spanId}:{},...t.parentSpanId?{parentSpanId:t.parentSpanId}:{},...t.traceFlags?{traceFlags:t.traceFlags}:{}}}function getActiveDiagnosticTraceContext(){return xr.getStore()}var _r,vr,yr,br,xr,Sr=__esmMin((()=>{Xn(),gr(),_r=/^[0-9a-f]{32}$/,vr=/^[0-9a-f]{16}$/,yr=/^[0-9a-f]{2}$/,br=Symbol.for(`openclaw.diagnosticTraceScope.state.v1`),xr=new AsyncContext(br)}));function isBlockedObjectKey(e){return Cr.has(e)}var Cr,wr=__esmMin((()=>{Cr=/* @__PURE__ */ new Set([`__proto__`,`prototype`,`constructor`])}));function cloneDiagnosticValueForListener(e,t=!1){if(Tr.has(e))return e;if(t&&Object.getOwnPropertySymbols(e).length===0&&Object.values(e).every(e=>isImmutableDiagnosticValue(e)))return Tr.add(e),Object.freeze(e);let n=structuredClone(e);return freezeDiagnosticValue(n,/* @__PURE__ */ new WeakSet)&&Tr.add(n),n}function createDiagnosticValueForListeners(e,t=!1){let n;return()=>{if(n)return n;let r=cloneDiagnosticValueForListener(e,t);return Tr.has(r)&&(n=r),r}}function isImmutableDiagnosticValue(e,t){if(!e||typeof e!=`object`)return typeof e!=`function`&&typeof e!=`symbol`;if(Tr.has(e)||t?.has(e))return!0;let n=Object.getPrototypeOf(e);if(!Object.isFrozen(e)||n!==Object.prototype&&n!==Array.prototype&&n!==null)return!1;let r=t;return Reflect.ownKeys(e).every(t=>{let n=Object.getOwnPropertyDescriptor(e,t);return typeof t==`symbol`||!(`value`in n)?!1:(n.value&&typeof n.value==`object`&&(r??=/* @__PURE__ */ new WeakSet).add(e),isImmutableDiagnosticValue(n.value,r))})}function freezeDiagnosticValue(e,t){if(!e||typeof e!=`object`||t.has(e))return!0;if(ArrayBuffer.isView(e))return!1;t.add(e);let n=Object.getPrototypeOf(e),r=n===Object.prototype||n===Array.prototype||n===null;for(let n of Object.values(e))freezeDiagnosticValue(n,t)||(r=!1);return Object.freeze(e),r}function enrichDiagnosticEvent(e,t,n=!0){let r={};for(let[e,n]of Object.entries(t))isBlockedObjectKey(e)||(r[e]=n);return n&&(r.trace??=getActiveDiagnosticTraceContext()),e.seq+=1,r.seq=e.seq,r.ts=Date.now(),r}function captureQueuedDiagnosticEvent(e,t){try{let n=!1,r=!1;if(e.privateData||e.trustedListenersOnly){for(let i of t)if(isInternalDiagnosticEventInterested(i,e.event.type,e.metadata.trusted)&&(n=!0,i?.includePrivateData!==!1)){r=!0;break}}if(e.trustedListenersOnly&&!n)return!1;if(e.event=cloneDiagnosticValueForListener(e.event,!0),e.privateData)try{e.privateData=r?cloneDiagnosticValueForListener(e.privateData):void 0}catch(t){e.privateData=void 0,console.error(`[diagnostic-events] private snapshot error type=${e.event.type}: ${String(t)}`)}return!0}catch(t){return console.error(`[diagnostic-events] queue snapshot error type=${e.event.type}: ${String(t)}`),!1}}var Tr,Er=__esmMin((()=>{rr(),Sr(),wr(),Tr=/* @__PURE__ */ new WeakSet})),Dr,Or=__esmMin((()=>{Dr=`coreModelRequestLifecycle`}));function isTrustedOtelDiagnosticListener(e){return kr.has(e)}var kr,Ar=__esmMin((()=>{kr=/* @__PURE__ */ new WeakSet}));function consumeHostPluginUsageDiagnosticEvent(e){let t=jr.get(e);return jr.delete(e),t}var jr,Mr=__esmMin((()=>{jr=/* @__PURE__ */ new WeakMap}));function consumeCoreSemanticRunProgressDiagnosticEvent(e){let t=Pr.get(e);return Pr.delete(e),t}var Nr,Pr,Fr=__esmMin((()=>{Nr=`coreSemanticRunProgress`,Pr=/* @__PURE__ */ new WeakMap}));function consumeToolExecutionLivenessDiagnosticEvent(e){let t=Lr.events.get(e);return Lr.events.delete(e),t}var Ir,Lr,Rr=__esmMin((()=>{gr(),R(),Ir=`toolExecutionLiveness`,Lr=resolveGlobalSingleton(Symbol.for(`openclaw.diagnosticToolExecutionLiveness`),()=>({context:new AsyncContext(Symbol(`toolExecutionDeadline`)),events:/* @__PURE__ */ new WeakMap}))}));function hasDiagnosticTracePropagationConsumer(){return Br.activeBridge?.prepareEvent!==void 0}function shouldPrepareDiagnosticTracePropagation(e){let t=Br.activeBridge;if(!t?.prepareEvent)return!1;if(!t.shouldPrepareEvent)return!0;try{return t.shouldPrepareEvent(e)}catch(e){return console.error(`[diagnostic-trace-propagation] prepare filter error: ${String(e)}`),!1}}function prepareDiagnosticTracePropagation(e,t){let n=Br.activeBridge;if(n?.prepareEvent)try{n.prepareEvent(e,t)}catch(t){console.error(`[diagnostic-trace-propagation] prepare error type=${e.type} seq=${e.seq}: ${String(t)}`)}}var zr,Br,Vr=__esmMin((()=>{R(),Sr(),zr=Symbol.for(`openclaw.diagnosticTracePropagation.state.v1`),Br=resolveGlobalSingleton(zr,()=>({marker:zr,bridges:/* @__PURE__ */ new Set,activeBridge:void 0}))}));function hasNonzeroUsage(e){return!e||e.usageReport?.state===`unavailable`?!1:[e.input,e.output,e.cacheRead,e.cacheWrite,e.contextUsage?.state===`available`?e.contextUsage.promptTokens:void 0,e.contextUsage?.state===`available`?e.contextUsage.totalTokens:void 0,e.reasoningTokens,e.total].some(e=>typeof e==`number`&&Number.isFinite(e)&&e>0)||e.contextUsage?.state===`unavailable`}function hasRecordedUsageCost(e){let t=asOptionalRecord(e),n=asFiniteNumber(t?.total);return n!==void 0&&n>=0&&(n>0||t?.totalOrigin===`provider-billed`||Hr.some(e=>(asFiniteNumber(t?.[e])??0)!==0))}function hasObservedModelUsage(e){return e?.usageReport!==void 0||hasRecordedUsageCost(e?.cost)||hasNonzeroUsage(e)}var Hr,Ur=__esmMin((()=>{Wn(),B(),Hr=[`input`,`output`,`cacheRead`,`cacheWrite`]}));function parseDiagnosticEnvFlags(e){let t=e?.trim()??``,n=t.toLowerCase();return n?[`0`,`false`,`off`,`none`].includes(n)?{flags:[],disablesAll:!0}:[`1`,`true`,`all`,`*`].includes(n)?{flags:[`*`],disablesAll:!1}:{flags:t.split(/[,\s]+/),disablesAll:!1}:{flags:[],disablesAll:!1}}var Wr=__esmMin((()=>{}));function isDiagnosticFlagEnabled(e,t,n=process.env){let r=t?.diagnostics?.flags??[],i=parseDiagnosticEnvFlags(n[Gr]),a=i.disablesAll?[]:normalizeUniqueStringEntriesLower([...r,...i.flags]),s=normalizeLowercaseStringOrEmpty(e);if(!s)return!1;for(let e of a)if(e===`*`||e===`all`||e===s||e.endsWith(`.*`)&&s===e.slice(0,-2)||e.endsWith(`*`)&&s.startsWith(e.slice(0,-1)))return!0;return!1}var Gr,Kr=__esmMin((()=>{Lt(),qn(),Wr(),Gr=`OPENCLAW_DIAGNOSTICS`})),qr=__esmMin((()=>{R(),resolveGlobalSingleton(Symbol.for(`openclaw.processEnvironmentKey`),()=>({key:{},aliases:new WeakSet([process.env])}))})),Jr,Yr=__esmMin((()=>{qr(),Jr=[`FS_SAFE_PYTHON_MODE`,`OPENCLAW_FS_SAFE_PYTHON_MODE`],[...Jr]}));function isTruthyEnvValue(e){return parseBooleanValue(e)===!0}var Xr=__esmMin((()=>{Bt(),Yr()}));function runWithMainThreadTask(e,t,n){let r=Zr.observer;return r?r.run(e,t,n):t()}var Zr,Qr=__esmMin((()=>{Nt(),R(),Zr=resolveGlobalSingleton(Symbol.for(`openclaw.mainThreadTask`),()=>({context:new D}))}));function _usingCtx(){var e=typeof SuppressedError==`function`?SuppressedError:function(e,t){var n=Error();return n.name=`SuppressedError`,n.error=e,n.suppressed=t,n},t={},n=[];function using(e,t){if(t!=null){if(Object(t)!==t)throw TypeError(`using declarations can only be used with objects, functions, null, or undefined.`);if(e)var o=t[Symbol.asyncDispose||Symbol.for(`Symbol.asyncDispose`)];if(o===void 0&&(o=t[Symbol.dispose||Symbol.for(`Symbol.dispose`)],e))var r=o;if(typeof o!=`function`)throw TypeError(`Object is not disposable.`);r&&(o=function(){try{r.call(t)}catch(e){return Promise.reject(e)}}),n.push({v:t,d:o,a:e})}else e&&n.push({d:t,a:e});return t}return{e:t,u:using.bind(null,!1),a:using.bind(null,!0),d:function(){var r,i=this.e,a=0;function next(){for(;r=n.pop();)try{if(!r.a&&a===1)return a=0,n.push(r),Promise.resolve().then(next);if(r.d){var e=r.d.call(r.v);if(r.a)return a|=2,Promise.resolve(e).then(next,err)}else a|=1}catch(e){return err(e)}if(a===1)return i===t?Promise.resolve():Promise.reject(i);if(i!==t)throw i}function err(n){return i=i===t?n:new e(n,i),next()}return next()}}}var $r=__esmMin((()=>{}));function modelUsageTimelineAttributes(e){let t={usageState:e?.usageReport?.state??(hasObservedModelUsage(e)?`available`:`unreported`)};for(let n of[`input`,`output`,`cacheRead`,`cacheWrite`,`cacheWrite1h`,`cacheWrite5m`,`reasoningTokens`,`promptTokens`,`total`]){let r=e?.[n];r!==void 0&&(t[n]=r)}return t}function recordDiagnosticModelUsageTimeline(e){if(!isDiagnosticsTimelineEnabled())return;let t=e.trace??getActiveDiagnosticTraceContext();emitDiagnosticsTimelineEvent({type:`mark`,name:`model.usage`,provider:e.provider,attributes:{...modelUsageTimelineAttributes({...e.usage,usageReport:e.usageReport}),...e.model?{model:e.model}:{},...e.sessionId?{sessionId:e.sessionId}:{},...t?{traceId:t.traceId}:{},...e.purpose?{purpose:e.purpose}:{},...e.runtimeKind?{runtimeKind:e.runtimeKind}:{},...e.completionId?{completionId:e.completionId}:{},...e.attemptId?{attemptId:e.attemptId}:{},...e.costUsd===void 0?{}:{costUsd:e.costUsd}}})}function isDiagnosticsTimelineEnabled(e={}){let{config:t,env:n=process.env}=e,r=n.OPENCLAW_DIAGNOSTICS_TIMELINE_PATH;return typeof r!=`string`||r.trim().length===0?!1:isDiagnosticFlagEnabled(`timeline`,t,n)||isDiagnosticFlagEnabled(`diagnostics.timeline`,t,n)||isTruthyEnvValue(n.OPENCLAW_DIAGNOSTICS)}function normalizeNumber(e){if(typeof e==`number`&&Number.isFinite(e))return Math.max(0,Math.round(e*1e3)/1e3)}function normalizeAttributes(e){if(!e)return;let t={};for(let[n,r]of Object.entries(e))typeof r==`number`?Number.isFinite(r)&&(t[n]=r):(typeof r==`string`||typeof r==`boolean`||r===null)&&(t[n]=r);return Object.keys(t).length>0?t:void 0}function serializeTimelineEvent(e,t){let n=normalizeAttributes(e.attributes),r={schemaVersion:ei,type:e.type,timestamp:e.timestamp??(/* @__PURE__ */ new Date()).toISOString(),name:e.name,...t.OPENCLAW_DIAGNOSTICS_RUN_ID?{runId:t.OPENCLAW_DIAGNOSTICS_RUN_ID}:{},...t.OPENCLAW_DIAGNOSTICS_ENV?{envName:t.OPENCLAW_DIAGNOSTICS_ENV}:{},pid:process.pid,...e.runId?{runId:e.runId}:{},...e.envName?{envName:e.envName}:{},...typeof e.pid==`number`?{pid:e.pid}:{},phase:e.phase||void 0,spanId:e.spanId||void 0,parentSpanId:e.parentSpanId||void 0,durationMs:normalizeNumber(e.durationMs),errorName:e.errorName||void 0,errorMessage:e.errorMessage||void 0,p50Ms:normalizeNumber(e.p50Ms),p95Ms:normalizeNumber(e.p95Ms),p99Ms:normalizeNumber(e.p99Ms),maxMs:normalizeNumber(e.maxMs),activeSpanName:e.activeSpanName||void 0,provider:e.provider||void 0,operation:e.operation||void 0,ok:typeof e.ok==`boolean`?e.ok:void 0,status:normalizeNumber(e.status),command:e.command||void 0,exitCode:e.exitCode,signal:e.signal,attributes:n};return`${JSON.stringify(r)}\n`}function emitDiagnosticsTimelineEvent(e,t={}){let n=t.env??process.env;if(!isDiagnosticsTimelineEnabled(t))return;let r=n.OPENCLAW_DIAGNOSTICS_TIMELINE_PATH?.trim();r&&ni.write(r,e,n)}var ei,ti,ni,ri=__esmMin((()=>{Ur(),R(),Kr(),Sr(),Xr(),Qr(),ei=`openclaw.diagnostics.v1`,ti=65536,new D,new D,ni=resolveGlobalSingleton(Symbol.for(`openclaw.diagnosticsTimelineWriter`),()=>{let e,t,n,r=!1,i=!1,a=/* @__PURE__ */ new Set;function append(e,t){try{let n=de(e.path);a.has(n)||(x(n,{recursive:!0}),a.add(n)),c({filePath:e.path,content:t})}catch(t){e.failedWrites++,i||(i=!0,console.warn(`[diagnostics] failed to write timeline event: ${String(t)}`))}}function flush(){n&&=(clearImmediate(n),void 0);let e=t;t=void 0,e&&append(e.capture,e.content)}return process.once(`exit`,()=>{r=!0,flush()}),{flush,write(i,a,s){e?.path!==i&&(flush(),e={path:i,id:ge(),sequence:0,failedWrites:0});let c=serializeTimelineEvent({...a,attributes:{...a.attributes,captureId:e.id,sequence:++e.sequence,failedWrites:e.failedWrites}},s),l=Buffer.byteLength(c,`utf8`);t&&t.bytes+l>ti&&flush(),r||l>ti?append(e,c):(t?(t.content+=c,t.bytes+=l):t={capture:e,content:c,bytes:l},n??=setImmediate(flush).unref())}}})}));function createRuntimeProcessEntrypoints(e){let runtimeProcessEntrypoint=(t,n=t,r=`.js`,i)=>({currentModuleUrl:e,sourceModulePath:`src/${t}${i??`.ts`}`,sourceExtension:i,sourceWorkerName:t.startsWith(`infra/`)?t.slice(6):`../${t}`,distWorkerPath:`${n}${r}`}),loaderFreeEntrypoint=e=>runtimeProcessEntrypoint(e,void 0,void 0,`.mjs`);return{daemonRuntimeProbe:runtimeProcessEntrypoint(`infra/daemon-runtime-probe.entry`),pluginToolsServe:runtimeProcessEntrypoint(`mcp/plugin-tools-serve`),openclawToolsServe:runtimeProcessEntrypoint(`mcp/openclaw-tools-serve`),repositoryPublicationRestore:loaderFreeEntrypoint(`gateway/repository-publication-restore.generated.worker`),nodeWorkspacePublicationSnapshot:loaderFreeEntrypoint(`node-host/node-worker-publication-snapshot.generated.worker`),nodeWorkspaceManifest:loaderFreeEntrypoint(`node-host/node-worker-workspace-manifest.generated.worker`),nodeWorkspaceGitHistory:loaderFreeEntrypoint(`node-host/node-worker-workspace-git-history.generated.worker`),doctorDatabaseEngineInspection:runtimeProcessEntrypoint(`commands/doctor-database-engine-inspection.worker`),doctorDatabaseBloat:runtimeProcessEntrypoint(`commands/doctor-db-bloat.worker`),backupDatabaseDiscovery:runtimeProcessEntrypoint(`infra/backup-database-discovery.worker`),sqliteHeaderProbe:runtimeProcessEntrypoint(`infra/sqlite-header-probe.worker`),databaseBackup:runtimeProcessEntrypoint(`snapshot/database-backup.worker`),managedHandoffEngine:runtimeProcessEntrypoint(`infra/update-managed-service-handoff-engine.worker`),updatePostgresState:runtimeProcessEntrypoint(`infra/update-candidate-state.postgres.worker`),databasePortCommand:runtimeProcessEntrypoint(`infra/database-engine/port-command.entry.worker`),stallObserver:runtimeProcessEntrypoint(`logging/diagnostic-stall-observer.worker`),fileLog:runtimeProcessEntrypoint(`logging/logger-file.worker`),systemCaWarmup:runtimeProcessEntrypoint(`gateway/system-ca-warmup.worker`),openclawIdTunnel:runtimeProcessEntrypoint(`gateway/openclaw-id/tunnel-child/entry`),shutdownHardExit:loaderFreeEntrypoint(`cli/gateway-cli/shutdown-hard-exit.worker`),packageIntegrityHasher:runtimeProcessEntrypoint(`infra/package-update-integrity-hasher.worker`),packageLocalOverrides:runtimeProcessEntrypoint(`infra/package-local-overrides.worker`),directoryWatchHost:runtimeProcessEntrypoint(`infra/directory-watch-host.worker`),directoryWatchParent:runtimeProcessEntrypoint(`infra/directory-watch-parent.worker`),workspaceQuiescenceAcquire:loaderFreeEntrypoint(`gateway/worker-environments/workspace-quiescence-acquire.generated.worker`),workspaceQuiescenceRenew:loaderFreeEntrypoint(`gateway/worker-environments/workspace-quiescence-renew.generated.worker`),workspaceQuiescenceRelease:loaderFreeEntrypoint(`gateway/worker-environments/workspace-quiescence-release.generated.worker`),packageActivationRecovery:runtimeProcessEntrypoint(`infra/package-update-activation-sealed`,`package-update-activation-recovery`,`.mjs`),managedHandoffPostgresBridge:runtimeProcessEntrypoint(`infra/update-managed-service-handoff-postgres.worker`,`managed-handoff-postgres-bridge.worker`,`.mjs`),managedHandoffRuntime:runtimeProcessEntrypoint(`infra/update-managed-service-handoff-sealed`,`managed-handoff-runtime`,`.mjs`),sqliteVector:runtimeProcessEntrypoint(`infra/database-engine/sqlite-vector.child`),postgresBridge:runtimeProcessEntrypoint(`infra/postgres-sync/bridge.worker`),secretEgressProxy:runtimeProcessEntrypoint(`secrets/egress-proxy/proxy.worker`),codeModeNode:runtimeProcessEntrypoint(`agents/code-mode-node.worker`),cronReadOnly:runtimeProcessEntrypoint(`cron/store/read-only.worker`),stateRead:runtimeProcessEntrypoint(`state/openclaw-state-read.worker`),workerNativeLifecycle:runtimeProcessEntrypoint(`infra/worker-native-lifecycle.worker`),spawnBroker:runtimeProcessEntrypoint(`process/spawn-broker/worker`),cronStreamMatcher:runtimeProcessEntrypoint(`gateway/cron-stream-matcher.worker`),controlUiFile:runtimeProcessEntrypoint(`gateway/control-ui-file.worker`),publicSessionCard:runtimeProcessEntrypoint(`gateway/control-ui-public-session-card.worker`),nodeBootstrapArtifact:runtimeProcessEntrypoint(`gateway/worker-environments/node-bootstrap-artifact.worker`),nativeHookRelayClient:runtimeProcessEntrypoint(`agents/harness/native-hook-relay-client.worker`),computerHost:runtimeProcessEntrypoint(`gateway/desktop/computer.worker`),imageProcessor:runtimeProcessEntrypoint(`media/image-processor.worker`),fileToolPlanning:runtimeProcessEntrypoint(`agents/sessions/tools/file-tool-planning.worker`),fileToolRead:runtimeProcessEntrypoint(`agents/sessions/tools/read-file.worker`),attachmentProcessor:runtimeProcessEntrypoint(`media/attachment-processor.worker`),widgetScriptSyntax:runtimeProcessEntrypoint(`canvas/widget-script-syntax.worker`),gitOperations:runtimeProcessEntrypoint(`infra/git-operation.worker`),gitPackCleanup:runtimeProcessEntrypoint(`agents/worktrees/git-pack-cleanup.worker`),fsSafeCopy:runtimeProcessEntrypoint(`infra/fs-safe-copy.worker`),execRealpath:runtimeProcessEntrypoint(`infra/exec-realpath.worker`),sharedStateStore:runtimeProcessEntrypoint(`state/openclaw-state.worker`),clientCredentials:runtimeProcessEntrypoint(`infra/client-credential.worker`),secretFileRead:runtimeProcessEntrypoint(`infra/secret-file-read.worker`),ttsPreferences:runtimeProcessEntrypoint(`tts/tts-settings-write.worker`),authProfileInlineUsage:runtimeProcessEntrypoint(`agents/auth-profiles/inline-usage.worker`),pluginModelCatalogRead:runtimeProcessEntrypoint(`agents/plugin-model-catalog-read.worker`),pluginModelCatalogCredentials:runtimeProcessEntrypoint(`agents/plugin-model-catalog.worker`),pluginCaptureNativeResource:runtimeProcessEntrypoint(`plugins/plugin-capture-native-resource`),pluginGenerationPreparation:runtimeProcessEntrypoint(`plugins/plugin-generation-preparation.worker`),agentDatabaseExecution:runtimeProcessEntrypoint(`state/openclaw-agent-execution.worker`),workspaceMemory:runtimeProcessEntrypoint(`worker/memory-worker-entry`,`agents/workspace-memory.worker`),localAgentAvatar:runtimeProcessEntrypoint(`agents/identity-avatar-file.worker`),identityFile:runtimeProcessEntrypoint(`agents/identity-file.worker`),workspaceSkills:runtimeProcessEntrypoint(`worker/skills-worker-entry`,`agents/workspace-skills.worker`),skillsDiscovery:runtimeProcessEntrypoint(`skills/runtime/discovery.worker`),boardStore:runtimeProcessEntrypoint(`boards/sqlite-board-store.worker`),progressCardStore:runtimeProcessEntrypoint(`session-cards/progress-card-store.worker`),sessionSharingStore:runtimeProcessEntrypoint(`config/sessions/session-sharing-store.worker`),sessionForkDomain:runtimeProcessEntrypoint(`config/sessions/session-fork-domain.worker`),sessionGoalOperations:runtimeProcessEntrypoint(`config/sessions/goals-operations.worker`),sessionLifecyclePlanningDomain:runtimeProcessEntrypoint(`config/sessions/session-lifecycle-projection.worker`),sessionMessageRewriteDomain:runtimeProcessEntrypoint(`config/sessions/session-message-rewrite.worker`),sessionDiskBudget:runtimeProcessEntrypoint(`config/sessions/disk-budget.worker`),contextEngineTurnOutbox:runtimeProcessEntrypoint(`agents/harness/context-engine-turn-outbox.worker`),sqliteStore:runtimeProcessEntrypoint(`infra/sqlite-store.worker`),sqliteWriterAdmission:runtimeProcessEntrypoint(`infra/sqlite-writer-admission.worker`),agentSchemaInspection:runtimeProcessEntrypoint(`state/openclaw-agent-schema-inspection.worker`),stateMigrationSnapshot:runtimeProcessEntrypoint(`infra/state-migrations.snapshot.worker`),githubExec:runtimeProcessEntrypoint(`agents/github-exec-launcher`),shellSnapshotEnvironment:runtimeProcessEntrypoint(`agents/shell-snapshot-env.worker`),sqliteReadOnly:runtimeProcessEntrypoint(`infra/sqlite-readonly-location.worker`),sqliteSnapshotStaging:runtimeProcessEntrypoint(`infra/sqlite-snapshot-staging.worker`),sqliteReadOnlyNativeResource:runtimeProcessEntrypoint(`infra/sqlite-readonly-native-resource`),sqliteSourceRevision:runtimeProcessEntrypoint(`infra/sqlite-source-revision.worker`),sqliteIntegrity:runtimeProcessEntrypoint(`infra/sqlite-integrity.worker`),sqliteCloseProbe:runtimeProcessEntrypoint(`infra/bun-sqlite-close-probe.worker`),preparedModelCatalog:runtimeProcessEntrypoint(`agents/prepared-model-catalog.worker`),providerPromptState:runtimeProcessEntrypoint(`agents/embedded-agent-runner/provider-prompt-state.worker`),retiredWorktreeCleanup:runtimeProcessEntrypoint(`agents/worktrees/retired-worktree-cleanup.worker`),updateNativeGate:runtimeProcessEntrypoint(`cli/update-cli/update-command-native-gate.worker`),updateStateSizes:runtimeProcessEntrypoint(`infra/update-state-sizes.entry`),updateRepair:runtimeProcessEntrypoint(`infra/update-repair.worker`),immutableBuild:runtimeProcessEntrypoint(`infra/update-immutable-build.worker`),updateMigratedFinalize:runtimeProcessEntrypoint(`infra/update-migrated-finalize.worker`),updateConfigProjection:runtimeProcessEntrypoint(`infra/update-config-projection.worker`),updateAutomaticCleanup:runtimeProcessEntrypoint(`infra/update-automatic-cleanup.worker`),updateCandidateState:runtimeProcessEntrypoint(`infra/update-candidate-state.worker`),doctorLint:runtimeProcessEntrypoint(`commands/doctor-lint.worker`),doctor:runtimeProcessEntrypoint(`commands/doctor.worker`),databaseVerify:runtimeProcessEntrypoint(`state/openclaw-database-verify.worker`),stateOwnership:runtimeProcessEntrypoint(`state/openclaw-state-ownership.worker`),stateLeaseHeartbeat:runtimeProcessEntrypoint(`state/openclaw-state-lease-heartbeat.worker`),gatewayStateOwnerHeartbeat:runtimeProcessEntrypoint(`infra/gateway-state-owner-heartbeat.worker`),sessionTranscriptArchive:runtimeProcessEntrypoint(`config/sessions/session-accessor.sqlite-archive.worker`),sessionTranscript:runtimeProcessEntrypoint(`config/sessions/session-transcript.worker`),usageOverview:runtimeProcessEntrypoint(`infra/session-cost-usage-overview-report.worker`),workerTranscriptCommit:runtimeProcessEntrypoint(`gateway/worker-environments/transcript-commit.worker`),sessionManagerMetadata:runtimeProcessEntrypoint(`agents/sessions/session-manager-metadata.worker`),sessionTranscriptProjectionPublication:runtimeProcessEntrypoint(`config/sessions/session-transcript-projection-publication.worker`),sessionTranscriptActiveFactsBackfill:runtimeProcessEntrypoint(`config/sessions/session-transcript-active-facts-backfill.worker`),sessionTranscriptReports:runtimeProcessEntrypoint(`config/sessions/session-accessor.sqlite-transcript-reports.worker`),sessionTranscriptReconcile:runtimeProcessEntrypoint(`config/sessions/session-transcript-reconcile.worker`),tailscaleRouteOwner:runtimeProcessEntrypoint(`infra/tailscale-route-owner.worker`),serviceChildRelay:runtimeProcessEntrypoint(`process/supervisor/service-child-relay`),terminalPty:runtimeProcessEntrypoint(`process/terminal-pty-worker`),serviceChildGroupAnchor:runtimeProcessEntrypoint(`process/supervisor/service-child-group-anchor`),serviceChildWindowsJobAnchor:runtimeProcessEntrypoint(`process/supervisor/service-child-windows-job-anchor`),bunSqliteLibrary:runtimeProcessEntrypoint(`infra/bun-sqlite-library`)}}function pluginRuntimeProcess(e,t,n){return{plugin:e,ownerSource:`extensions/${e}/${t}.ts`,sourceWorkerName:n,distWorkerPath:`extensions/${e}/${n}.js`,package:{name:`@openclaw/${e}`,distWorkerPath:`${n}.js`}}}var ii,ai,oi,si=__esmMin((()=>{ii={browserNativeHost:{...pluginRuntimeProcess(`browser`,`native-host-entry`,`native-host-entry`),package:{name:`@openclaw/browser-plugin`,distWorkerPath:`native-host-entry.js`}},browserRelayDaemon:{...pluginRuntimeProcess(`browser`,`native-host-entry`,`relay-daemon-entry`),package:{name:`@openclaw/browser-plugin`,distWorkerPath:`relay-daemon-entry.js`}},browserSetup:{...pluginRuntimeProcess(`browser`,`setup-entry`,`setup-entry`),package:{name:`@openclaw/browser-plugin`,distWorkerPath:`setup-entry.js`}},quickJsCodeMode:{...pluginRuntimeProcess(`code-mode-quickjs`,`src/executor`,`src/code-mode.worker`),sourceWorkerName:`code-mode.worker`},codexStdio:pluginRuntimeProcess(`codex`,`stdio-worker-entrypoint`,`stdio.worker`),codexCatalogPage:pluginRuntimeProcess(`codex`,`catalog-page-worker-entrypoint`,`catalog-page.worker`),codexSessionHistory:pluginRuntimeProcess(`codex`,`session-history-worker-entrypoint`,`session-history.worker`),discordAudio:{...pluginRuntimeProcess(`discord`,`src/voice/audio-worker-thread`,`src/voice/audio-worker.runtime`),sourceWorkerName:`audio-worker.runtime`},documentExtractor:{...pluginRuntimeProcess(`document-extract`,`document-extractor-worker-entrypoint`,`document-extractor.worker`),package:{name:`@openclaw/document-extract-plugin`,distWorkerPath:`document-extractor.worker.js`}},webReadability:{...pluginRuntimeProcess(`web-readability`,`web-content-extractor-worker.runtime`,`web-content-extractor.worker`),package:{name:`@openclaw/web-readability-plugin`,distWorkerPath:`web-content-extractor.worker.js`}},fileTransferDirFetch:{...pluginRuntimeProcess(`file-transfer`,`src/node-host/dir-fetch-archive`,`src/node-host/dir-fetch-archive.worker`),sourceWorkerName:`dir-fetch-archive.worker`},fileTransferDirList:{...pluginRuntimeProcess(`file-transfer`,`src/node-host/dir-list-worker-command`,`src/node-host/dir-list.worker`),sourceWorkerName:`dir-list.worker`},iMessageChatDb:{...pluginRuntimeProcess(`imessage`,`src/chat-db`,`src/chat-db.worker`),sourceWorkerName:`chat-db.worker`},knowledgeRegistry:{...pluginRuntimeProcess(`knowledge`,`src/registry-client`,`src/registry-worker`),sourceWorkerName:`registry-worker`},knowledgeStorage:{...pluginRuntimeProcess(`knowledge`,`src/storage-client`,`src/storage-worker`),sourceWorkerName:`storage-worker`},mxcLauncher:{plugin:`mxc`,ownerSource:`extensions/mxc/src/plugin-root.ts`,sourceWorkerName:`mxc-spawn-launcher`,sourceExtension:`.mjs`,build:`static-asset`,distWorkerPath:`extensions/mxc/mxc-spawn-launcher.mjs`,package:{name:`@openclaw/mxc-sandbox`,distWorkerPath:`mxc-spawn-launcher.mjs`}},onePasswordSecretResolver:{plugin:`onepassword`,ownerSource:`extensions/onepassword/onepassword-secret-ref-resolver.js`,sourceWorkerName:`onepassword-secret-ref-resolver`,sourceExtension:`.js`,build:`static-asset`,distWorkerPath:`extensions/onepassword/onepassword-secret-ref-resolver.js`,package:{name:`@openclaw/onepassword`,distWorkerPath:`onepassword-secret-ref-resolver.js`}},vaultSecretResolver:{plugin:`vault`,ownerSource:`extensions/vault/vault-secret-ref-resolver.js`,sourceWorkerName:`vault-secret-ref-resolver`,sourceExtension:`.js`,build:`static-asset`,distWorkerPath:`extensions/vault/vault-secret-ref-resolver.js`,package:{name:`@openclaw/vault`,distWorkerPath:`vault-secret-ref-resolver.js`}},memorySearch:{...pluginRuntimeProcess(`memory-core`,`src/memory/manager-cpu-entrypoints`,`src/memory/manager-search.worker`),sourceWorkerName:`manager-search.worker`,distWorkerPath:`extensions/memory-core/memory-search.worker.js`},memoryIndex:{...pluginRuntimeProcess(`memory-core`,`src/memory/manager-cpu-entrypoints`,`src/memory/manager-index.worker`),sourceWorkerName:`manager-index.worker`,distWorkerPath:`extensions/memory-core/memory-index.worker.js`},memoryPublication:{...pluginRuntimeProcess(`memory-core`,`src/memory/manager-cpu-entrypoints`,`src/memory/manager-publication.worker`),sourceWorkerName:`manager-publication.worker`,distWorkerPath:`extensions/memory-core/memory-publication.worker.js`},memoryStandingIntents:{...pluginRuntimeProcess(`memory-core`,`src/memory/manager-cpu-entrypoints`,`src/standing-intents.worker`),sourceWorkerName:`../standing-intents.worker`,distWorkerPath:`extensions/memory-core/standing-intents.worker.js`},memoryEntryOrigins:{...pluginRuntimeProcess(`memory-core`,`src/memory/manager-cpu-entrypoints`,`src/memory-entry-origins.worker`),sourceWorkerName:`../memory-entry-origins.worker`,distWorkerPath:`extensions/memory-core/memory-entry-origins.worker.js`},memoryStatsRuntime:pluginRuntimeProcess(`memory-lancedb`,`memory-stats-entrypoint`,`memory-stats.worker`),memoryWikiQuery:{...pluginRuntimeProcess(`memory-wiki`,`src/query-reader`,`src/query-reader.worker`),sourceWorkerName:`query-reader.worker`},openAiRealtimeAudio:{...pluginRuntimeProcess(`openai`,`realtime-quicksilver-peer.runtime`,`realtime-quicksilver-audio.worker`),package:{name:`@openclaw/openai-provider`,distWorkerPath:`realtime-quicksilver-audio.worker.js`}},openAiRealtimeSocket:{...pluginRuntimeProcess(`openai`,`realtime-quicksilver-socket`,`realtime-quicksilver-socket.worker`),package:{name:`@openclaw/openai-provider`,distWorkerPath:`realtime-quicksilver-socket.worker.js`}},qaExecutionIdentityInspection:{...pluginRuntimeProcess(`qa-lab`,`src/execution-identity-storage-inspection`,`src/execution-identity-storage-inspection.worker`),sourceWorkerName:`execution-identity-storage-inspection.worker`},telegramIngress:{...pluginRuntimeProcess(`telegram`,`src/telegram-ingress-worker`,`src/telegram-ingress-worker.runtime`),sourceWorkerName:`telegram-ingress-worker.runtime`,distWorkerPath:`telegram-ingress-worker.runtime.js`},telegramWidgetCheck:{...pluginRuntimeProcess(`telegram`,`src/widgets/widget-check`,`src/widgets/widget-check.worker`),sourceWorkerName:`widget-check.worker`},onnxInference:pluginRuntimeProcess(`onnx`,`index`,`src/inference.worker`),teamReportsStore:pluginRuntimeProcess(`team-reports`,`index`,`src/store.worker`),teamReportsRun:pluginRuntimeProcess(`team-reports`,`index`,`src/run.worker`),logbookStore:pluginRuntimeProcess(`logbook`,`index`,`src/store.worker`),workboardSqlite:pluginRuntimeProcess(`workboard`,`index`,`src/sqlite-store.worker`)},ai={managedHandoff:{ownerSource:`src/infra/update-managed-service-handoff-sealed.ts`,entries:[[`postgresBridge`,`managedHandoffPostgresBridge`]]},worker:{ownerSource:`src/worker/worker-deploy-runtime.ts`,entries:[[`clientCredentials`,`client-credential.worker`],[`codeModeNode`,`code-mode-node.worker`],[`stateRead`,`openclaw-state-read.worker`],[`workerNativeLifecycle`,`worker-native-lifecycle.worker`],[`fileLog`,`file-log.worker`],[`fileToolPlanning`,`file-tool-planning.worker`],[`fileToolRead`,`file-tool-read.worker`],[`gatewayStateOwnerHeartbeat`,`gateway-state-owner-heartbeat.worker`],[`githubExec`,`github-exec-launcher`],[`imageProcessor`,`image-processor.worker`],[`serviceChildRelay`,`service-child-relay`],[`sqliteSourceRevision`,`sqlite-source-revision.worker`],[`sqliteStore`,`sqlite-store.worker`],[`sharedStateStore`,`sqlite-store.worker`]]},serviceChildRelay:{ownerSource:`src/process/supervisor/service-child-relay.ts`,entries:[[`serviceChildGroupAnchor`,`service-child-group-anchor`]]}},oi={bunSqliteLibraryProbe:{buildSource:`src/infra/bun-sqlite-library-probe.entry.ts`,sourceModule:`src/infra/bun-sqlite-library-probe.generated.ts`,sourceBinding:`BUN_SQLITE_LIBRARY_PROBE_SOURCE`,kind:`file`,fileName:`bun-sqlite-library-probe.mjs`,materialize:!0},packageCliNodeProbe:{buildSource:`scripts/lib/package-cli-node-probe.entry.mjs`,sourceModule:`scripts/lib/package-cli-node-probe.generated.mjs`,sourceBinding:`PACKAGE_CLI_NODE_PROBE_SOURCE`,kind:`file`,fileName:`package-cli-node-probe.mjs`,materialize:!0},fsSafeNpmCliPreload:{buildSource:`scripts/lib/fs-safe-npm-cli-preload.entry.mjs`,sourceModule:`scripts/lib/fs-safe-npm-cli-preload.generated.mjs`,sourceBinding:`FS_SAFE_NPM_CLI_PRELOAD_DATA_URL`,kind:`data-url`},repositoryPublicationRestoreRemote:{sourceModule:`src/gateway/github-repository-publication-restore.ts`,sourceBinding:`RESTORE_PUBLICATION_INDEX_JS`,kind:`source`},nodeRuntimeProbe:{buildSource:`src/infra/node-runtime-probe.entry.ts`,sourceModule:`src/infra/node-runtime-probe.generated.mjs`,sourceBinding:`NODE_RUNTIME_PROBE_SOURCE`,kind:`file`,fileName:`node-runtime-probe.mjs`,materialize:!0},daemonRuntimeProbe:{buildSource:`src/infra/daemon-runtime-probe.entry.ts`,sourceModule:`src/infra/daemon-runtime-probe.generated.mjs`,sourceBinding:`DAEMON_RUNTIME_PROBE_SOURCE`,kind:`file`,fileName:`daemon-runtime-probe.mjs`,materialize:!0,runtimeEntrypoint:`daemonRuntimeProbe`},updateStateSizes:{sourceModule:`src/infra/update-state-sizes.generated.mjs`,sourceBinding:`UPDATE_STATE_SIZES_SOURCE`,kind:`file`,fileName:`update-state-sizes.mjs`,materialize:!0,runtimeEntrypoint:`updateStateSizes`},updateNativeGate:{sourceModule:`src/cli/update-cli/update-command-native-gate.generated.ts`,sourceBinding:`UPDATE_NATIVE_GATE_SOURCE`,kind:`file`,fileName:`update-native-gate.mjs`},managedUpdateHandoff:{sourceModule:`src/infra/update-managed-service-handoff.ts`,sourceBinding:`HANDOFF_SCRIPT`,kind:`file`,fileName:`handoff.cjs`},workspaceQuiescence:{sourceModule:`src/gateway/worker-environments/workspace-quiescence-scripts.ts`,export:`workspaceQuiescenceArgv`,kind:`argv`}}}));function normalizeDiagnosticWorkerScript(e){return typeof e==`string`&&ui.has(e)?e:`other`}function workerScriptName(e,t=!1){return t||e instanceof URL&&e.protocol!==`file:`?`other`:li.get(scriptBasename(e instanceof URL?j(e):e))??`other`}var scriptBasename,ci,li,ui,di=__esmMin((()=>{si(),scriptBasename=e=>ue(e).replace(/\.[cm]?[jt]s$/u,`.js`),ci=createRuntimeProcessEntrypoints(import.meta.url),li=/* @__PURE__ */ new Map;for(let e of Object.values(ci)){let t=scriptBasename(e.distWorkerPath);li.set(t,t),li.set(scriptBasename(e.sourceModulePath),t)}for(let e of Object.values(ii)){let t=scriptBasename(e.distWorkerPath);li.set(t,t),li.set(scriptBasename(e.package.distWorkerPath),t),li.set(scriptBasename(`${e.sourceWorkerName}.js`),t)}for(let e of Object.values(ai))for(let[t,n]of e.entries){let e=scriptBasename(`${n}.mjs`);li.has(e)||li.set(e,scriptBasename(ci[t].distWorkerPath))}ui=new Set(li.values())}));function areDiagnosticsEnabledForProcess(){return vi.enabled}function dispatchDiagnosticEvent(e,t,n,r,i={}){if(e.dispatchDepth>100)console.error(`[diagnostic-events] recursion guard tripped at depth=${e.dispatchDepth}, dropping type=${t.type}`);else{e.dispatchDepth+=1;try{let a=createDiagnosticValueForListeners(t,!0),s=r&&createDiagnosticValueForListeners(r);if(!i.trustedListenersOnly){for(let[r,i]of e.listeners)if(isInternalDiagnosticEventInterested(i,t.type,n.trusted))try{r(a(),n)}catch(e){let n=e instanceof Error?formatErrorStackWithMessage(e):String(e);console.error(`[diagnostic-events] listener error type=${t.type} seq=${t.seq}: ${n}`)}}for(let[r,c]of e.trustedListeners)if(isInternalDiagnosticEventInterested(c,t.type,n.trusted))try{let e=a(),t=isTrustedOtelDiagnosticListener(r),l=fi;if(c?.includePrivateData!==!1&&(l=s?.()??fi,t&&(i.hostPluginId||Object.hasOwn(l,`hostPluginId`)))){let e={...l,hostPluginId:i.hostPluginId};i.hostPluginId||Reflect.deleteProperty(e,`hostPluginId`),l=Object.freeze(e)}r(e,n,l)}catch(e){let n=e instanceof Error?formatErrorStackWithMessage(e):String(e);console.error(`[diagnostic-events] trusted listener error type=${t.type} seq=${t.seq}: ${n}`)}}finally{--e.dispatchDepth}}}function isPriorityAsyncDiagnosticEvent(e){return e.metadata.trusted&&_i.has(e.event.type)}function noteAsyncDiagnosticDrop(e,t){e.asyncDroppedEvents+=1,t.metadata.trusted?e.asyncDroppedTrustedEvents+=1:e.asyncDroppedUntrustedEvents+=1,isPriorityAsyncDiagnosticEvent(t)&&(e.asyncDroppedPriorityEvents+=1)}function makeRoomForPriorityAsyncDiagnosticEvent(e){let t=e.asyncQueue.findIndex(e=>!isPriorityAsyncDiagnosticEvent(e));return t>=0?e.asyncQueue.splice(t,1)[0]:e.asyncQueue.shift()}function scheduleAsyncDiagnosticDrain(e){e.asyncDrainScheduled||(e.asyncDrainScheduled=!0,setImmediate(()=>{e.asyncDrainScheduled=!1;let t=e.asyncQueue.splice(0,mi);for(let n of t)dispatchDiagnosticEvent(e,n.event,n.metadata,n.privateData,n);e.asyncQueue.length>0?scheduleAsyncDiagnosticDrain(e):dispatchAsyncDiagnosticDropSummary(e)}))}function dispatchAsyncDiagnosticDropSummary(e){if(e.asyncDroppedEvents<=0)return;let t=e.asyncDroppedEvents,n=e.asyncDroppedTrustedEvents,r=e.asyncDroppedUntrustedEvents,i=e.asyncDroppedPriorityEvents;e.asyncDroppedEvents=0,e.asyncDroppedTrustedEvents=0,e.asyncDroppedUntrustedEvents=0,e.asyncDroppedPriorityEvents=0,dispatchDiagnosticEvent(e,enrichDiagnosticEvent(e,{type:`diagnostic.async_queue.dropped`,droppedEvents:t,...n>0?{droppedTrustedEvents:n}:{},...r>0?{droppedUntrustedEvents:r}:{},...i>0?{droppedPriorityEvents:i}:{},queueLength:e.asyncQueue.length,maxQueueLength:pi,drainBatchSize:mi}),Object.freeze({internal:!0,trusted:!1}))}function emitDiagnosticEventWithTrust(e,t,n={}){let r=vi,i=t&&isToolExecutionEventInput(e)?dispatchTrustedToolExecutionEvent(r,e):void 0;if(!r.enabled||e.type===`security.event`&&n.allowSecurityEvent!==!0)return;let a=hasInternalDiagnosticEventInterest(e.type,t);if(!a&&!(t&&!n.queuedPhase&&hasDiagnosticTracePropagationConsumer())){r.seq+=1;return}let s=enrichDiagnosticEvent(r,i??e,!n.queuedPhase);if(t&&s.type===`diagnostic.gc`){switch(s.kind){case`scavenge`:case`mark_sweep_compact`:case`incremental`:case`weak_processing`:break;default:s.kind=void 0}switch(s.reason){case`none`:case`forced`:case`synchronous_phantom_processing`:case`all_available_garbage`:case`all_external_memory`:case`schedule_idle`:case`construct_retained`:case`other`:break;default:s.reason=`other`}s.thread=s.thread===void 0||s.thread===`main`?`main`:normalizeDiagnosticWorkerScript(s.thread),(s.thread!==`code-mode-node.worker.js`||typeof s.workerSlot!=`number`||!Number.isInteger(s.workerSlot)||s.workerSlot<1||s.workerSlot>64)&&(s.workerSlot=void 0)}let{hostPluginId:c,internal:l=!1,privateData:u}=n,d=n.trustedTraceContext===!0,f=Object.freeze({...l?{internal:!0}:{},trusted:t,...n.toolExecutionLiveness?{[Ir]:n.toolExecutionLiveness}:{},...n.coreModelRequestLifecycle?{[Dr]:n.coreModelRequestLifecycle}:{},...n.coreSemanticRunProgress?{[Nr]:n.coreSemanticRunProgress}:{},...d?{trustedTraceContext:d}:{}}),p=t&&!n.queuedPhase&&shouldPrepareDiagnosticTracePropagation(s),m=a&&(n.queuedPhase||gi.has(s.type));if(m){if(r.asyncQueue.length>=pi){if(!t||!_i.has(s.type)){noteAsyncDiagnosticDrop(r,{event:s,metadata:f,privateData:u,hostPluginId:c});return}let e=makeRoomForPriorityAsyncDiagnosticEvent(r);e&&noteAsyncDiagnosticDrop(r,e)}let e={event:s,metadata:f,privateData:u,hostPluginId:c};if(!captureQueuedDiagnosticEvent(e,r.trustedListeners.values()))return;s=e.event,r.asyncQueue.push(e)}p&&(m||(s=cloneDiagnosticValueForListener(s,!0)),prepareDiagnosticTracePropagation(cloneDiagnosticValueForListener(s),f)),m?scheduleAsyncDiagnosticDrain(r):a&&dispatchDiagnosticEvent(r,s,f,u,{hostPluginId:c})}function isToolExecutionEventInput(e){return e.type===`tool.execution.started`||e.type===`tool.execution.completed`||e.type===`tool.execution.error`||e.type===`tool.execution.blocked`}function dispatchTrustedToolExecutionEvent(e,t){if(e.toolExecutionSeq+=1,e.toolExecutionListeners.size===0)return;let n;try{n=cloneDiagnosticValueForListener({...t,seq:e.toolExecutionSeq,ts:Date.now()},!0)}catch(e){console.error(`[diagnostic-events] tool execution clone error type=${t.type}: ${String(e)}`);return}let r=createDiagnosticValueForListeners(n);for(let t of e.toolExecutionListeners)try{t(r())}catch(e){console.error(`[diagnostic-events] tool execution listener error type=${n.type} seq=${n.seq}: ${String(e)}`)}return n}function emitDiagnosticEvent(e){emitDiagnosticEventWithTrust(e,!1)}function emitDiagnosticEventWithTrustedTraceContext(e){emitDiagnosticEventWithTrust(e,!1,{trustedTraceContext:!0})}function emitTrustedDiagnosticEvent(e){e.type===`model.usage`&&recordDiagnosticModelUsageTimeline(e);let t=consumeToolExecutionLivenessDiagnosticEvent(e),n=consumeHostPluginUsageDiagnosticEvent(e),r=consumeCoreSemanticRunProgressDiagnosticEvent(e);emitDiagnosticEventWithTrust(e,!0,{...t?{toolExecutionLiveness:t}:{},...n?{hostPluginId:n,internal:!0}:{},...r?{coreSemanticRunProgress:r}:{}})}var fi,pi,mi,hi,gi,_i,vi,yi=__esmMin((()=>{F(),ur(),R(),rr(),mr(),Er(),Or(),Ar(),Mr(),Fr(),Rr(),Sr(),Vr(),ri(),di(),fi=Object.freeze({}),pi=1e4,mi=100,hi=Symbol.for(`openclaw.diagnosticEvents.state.v1`),gi=new Set(fr),_i=new Set(pr),vi=resolveGlobalSingleton(hi,()=>({marker:hi,enabled:!0,seq:0,listeners:/* @__PURE__ */ new Map,trustedListeners:/* @__PURE__ */ new Map,toolExecutionListeners:/* @__PURE__ */ new Set,toolExecutionSeq:0,dispatchDepth:0,asyncQueue:[],asyncDrainScheduled:!1,asyncDroppedEvents:0,asyncDroppedTrustedEvents:0,asyncDroppedUntrustedEvents:0,asyncDroppedPriorityEvents:0}))})),bi=__esmMin((()=>{Qn()}));function createUnownedAppliedLoggingConfig(){return Si}function createLoggingState(){return{appliedConfig:createUnownedAppliedLoggingConfig(),cachedLogger:null,cachedSettings:null,cachedConsoleSettings:null,overrideSettings:null,invalidEnvLogLevelValue:null,consolePatched:!1,forceConsoleToStderr:!1,earlyConsoleRoutingRestore:null,consoleTimestampPrefix:!1,consoleSubsystemFilter:null,streamErrorHandlersInstalled:!1,rawConsole:null}}var xi,Si,Ci,H,wi=__esmMin((()=>{xi=Symbol.for(`openclaw.loggingState`),Si=`unowned`,Ci=globalThis,H=Ci[xi]??createLoggingState(),Ci[xi]=H}));function shouldEmitRuntimeLog(e=process.env){return e.VITEST!==`true`||e.OPENCLAW_TEST_RUNTIME_LOG===`1`||typeof console.log.mock==`object`}function shouldEmitRuntimeStdout(e=process.env){return e.VITEST!==`true`||e.OPENCLAW_TEST_RUNTIME_LOG===`1`||typeof process.stdout.write.mock==`object`}function isPipeClosedError(e){let t=e?.code;return t===`EPIPE`||t===`EIO`}function writeStdout(e){if(!shouldEmitRuntimeStdout())return;clearActiveProgressLine();let t=e.endsWith(`
`)?e:`${e}\n`;try{process.stdout.write(t)}catch(e){if(isPipeClosedError(e))return;throw e}}function createRuntimeIo(){return{log:(...e)=>{shouldEmitRuntimeLog()&&(clearActiveProgressLine(),console.log(...e))},error:(...e)=>{clearActiveProgressLine(),console.error(...e)},writeStdout,writeJson:(e,t=2)=>{writeStdout(JSON.stringify(e,void 0,t>0?t:void 0))}}}var Ti=__esmMin((()=>{Qn(),bi(),wi(),{...createRuntimeIo()}}));function matchAnsiOscAt(e,t){return Ai.lastIndex=t,Ai.exec(e)?.[0]}function scanAnsiCsiAt(e,t){let n=e.charCodeAt(t);if(n!==155&&(n!==27||e.charCodeAt(t+1)!==91))return;let r=t+(n===155?1:2),i=[],a=!1;for(;r<e.length;){let t=e.charCodeAt(r);if(t===24||t===26){r+=1,a=!0;break}if(t===27||t===155){a=!0;break}if(t<=31||t===127)i.push(e.charAt(r)),r+=1;else if(t>=32&&t<=63)r+=1;else{t>=64&&t<=126&&(r+=1),a=!0;break}}return{controls:i,ended:a,value:e.slice(t,r)}}var Ei,Di,Oi,ki,Ai,ji=__esmMin((()=>{Ei=`(?:\\x1b\\]|\\x9d)`,Di=`(?:\\x1b\\\\|\\x07|\\x9c)`,Oi=`${Ei}[^\\x07\\x1b\\x9c]*${Di}`,ki=`[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]`,Ai=new RegExp(Oi,`y`)}));function hasAnsiIntroducer(e){return e.includes(`\x1B`)||e.includes(``)||e.includes(``)}function stripAnsiInternal(e,t){if(!hasAnsiIntroducer(e))return e;let n=[],r=0,i=0;for(;i<e.length;){let a=e.charCodeAt(i);if(a!==27&&a!==155&&a!==157){i+=1;continue}let s=matchAnsiOscAt(e,i),c=s?void 0:scanAnsiCsiAt(e,i);Ni.lastIndex=i;let l=!s&&t.compatibilityGrammar?Ni.exec(e)?.[0]:void 0,u=s?.length??c?.value.length??l?.length;if(u===void 0)i+=1;else{if(c&&!c.ended&&t.preserveIncompleteCsi)break;c?.controls.length===0&&l&&(u=Math.max(u,l.length)),n.push(e.slice(r,i),...c?.controls??[]),i+=u,r=i}}return n.push(e.slice(r)),n.join(``)}function stripAnsi(e){return stripAnsiInternal(e,{compatibilityGrammar:!1})}var Mi,Ni,Pi=__esmMin((()=>{ji(),Mi=`${Ei}[\\s\\S]*?${Di}`,Ni=RegExp(`${Mi}|${ki}`,`y`),new Intl.Segmenter(void 0,{granularity:`grapheme`})})),Fi=__esmMin((()=>{R(),resolveGlobalSingleton(Symbol.for(`openclaw.signalExitOwner`),()=>({})),resolveGlobalSet(Symbol.for(`openclaw.signalExitBarriers`),`close-and-restart`),resolveGlobalSet(Symbol.for(`openclaw.signalExitGates`),`close-and-restart`),resolveGlobalSet(Symbol.for(`openclaw.signalExitFinalizers`),`close-and-restart`),resolveGlobalSet(Symbol.for(`openclaw.signalExitObservers`),`close-and-restart`),resolveGlobalSingleton(Symbol.for(`openclaw.gatewayStartupSignals`),()=>({}))}));function isPlainObject(e){return typeof e==`object`&&!!e&&!Array.isArray(e)&&Object.prototype.toString.call(e)===`[object Object]`}var Ii=__esmMin((()=>{}));function getSealedRuntimeJson5(){return Li?.json5}function getSealedRuntimeSecureTempRoot(){return Li?.resolveSecureTempRoot}var Li,Ri=__esmMin((()=>{}));function isJson5Parser(e){return typeof e==`object`&&!!e&&`parse`in e&&typeof e.parse==`function`}function setJson5Runtime(e){let t=isJson5Parser(e)?e:typeof e==`object`&&e&&`default`in e?e.default:void 0;if(!isJson5Parser(t))throw Error(`json5 parser unavailable`);return zi=t,t}function loadJson5Parser(){if(zi)return zi;let t=getSealedRuntimeJson5();if(t!==void 0)return setJson5Runtime(t);if(typeof SEALED_RUNTIME_BUILD==`boolean`&&SEALED_RUNTIME_BUILD)throw Error(`sealed JSON5 runtime was not registered before use`);return setJson5Runtime(e(import.meta.url)(`json5`))}function parseJsonWithJson5Fallback(e,t){try{return JSON.parse(e)}catch{return(t??loadJson5Parser()).parse(e)}}var zi,Bi=__esmMin((()=>{Ri()}));function appendConfigPathSegment(e,t){return typeof t==`number`?`${e}[${t}]`:/^[A-Za-z_$][A-Za-z0-9_$:-]*$/.test(t)?e?`${e}.${t}`:t:`${e}[${JSON.stringify(t)}]`}var Vi=__esmMin((()=>{})),Hi,Ui=__esmMin((()=>{Hi=`default`}));function parseEnvTemplateSecretRef(e,t=Hi){if(typeof e!=`string`)return null;let n=e.trim(),r=Wi.exec(n)??Gi.exec(n);return r?{source:`env`,provider:t.trim()||`default`,id:expectDefined(r[1],`types.secrets regex capture 1`)}:null}var Wi,Gi,Ki=__esmMin((()=>{Xn(),Ui(),Wi=/^\$\{([A-Z][A-Z0-9_]{0,127})\}$/,Gi=/^\$([A-Z][A-Z0-9_]{0,127})$/}));function renderEnvTemplateToken(e){return e.defaultValue===void 0?`\${${e.name}}`:`\${${e.name}${Ji}${e.defaultValue}}`}function*iterateEnvTemplateTokens(e){for(let t=e.indexOf(`$`);t!==-1;t=e.indexOf(`$`,t+1)){let n=e[t+1]===`$`&&e[t+2]===`{`;if(!n&&e[t+1]!==`{`)continue;let r=t+(n?3:2),i=e.indexOf(`}`,r);if(i===-1)continue;let a=e.slice(r,i),s=a.indexOf(Ji),c=s===-1?a:a.slice(0,s),l=s===-1?void 0:a.slice(s+2);!qi.test(c)||l?.includes(`$`)||l?.includes(`{`)||(yield{kind:n?`escaped`:`substitution`,name:c,defaultValue:l,start:t,end:i},t=i)}}function substituteString(e,t,n,r){if(!e.includes(`$`))return e;let i=parseEnvTemplateSecretRef(e);i&&!containsEnvVarReference(e)&&r?.onPendingEnvSecretRef?.(i.id,n);let a=[],s=0;for(let c of iterateEnvTemplateTokens(e)){if(a.push(e.slice(s,c.start)),s=c.end+1,c.kind===`escaped`){a.push(renderEnvTemplateToken(c));continue}let l=t[c.name];if(l===void 0||l===``){if(c.defaultValue!==void 0){a.push(c.defaultValue);continue}if(r?.onMissing){r.onMissing({varName:c.name,configPath:n}),i?.id===c.name&&r.onPendingEnvSecretRef?.(c.name,n),a.push(renderEnvTemplateToken(c));continue}throw new MissingEnvVarError(c.name,n)}i?.id===c.name&&r?.onResolvedEnvSecretRef?.(c.name,n),a.push(l)}return a.push(e.slice(s)),a.join(``)}function containsEnvVarReference(e){for(let t of iterateEnvTemplateTokens(e))if(t.kind===`substitution`)return!0;return!1}function resolveConfigEnvVars(e,t=process.env,n){let r=[],visit=(e,i)=>{if(typeof e==`string`)return substituteString(e,t,i,n);if(Array.isArray(e)){let t=e.length,n=[];n.length=t;let a=0;return r.push(()=>{for(;a<t;){let t=a++;if(t in e)return n[t]=visit(e[t],`${i}[${t}]`),!0}return!1}),n}if(isPlainObject(e)){let t={},n=Object.entries(e)[Symbol.iterator]();return r.push(()=>{let e=n.next();if(e.done)return!1;let[r,a]=e.value;return t[r]=visit(a,appendConfigPathSegment(i,r)),!0}),t}return e},i=visit(e,``);for(let e=r.at(-1);e;e=r.at(-1))e()||r.pop();return i}var qi,Ji,MissingEnvVarError,Yi=__esmMin((()=>{Ii(),Vi(),Ki(),qi=/^[A-Z_][A-Z0-9_]*$/,Ji=`:-`,MissingEnvVarError=class extends Error{constructor(e,t){super(`Missing env var "${e}" referenced at config path: ${t}`),this.varName=e,this.configPath=t,this.name=`MissingEnvVarError`}}})),Xi=__esmMin((()=>{}));function sanitizePlainObject(e){let t={};for(let[n,r]of Object.entries(e))isBlockedObjectKey(n)||(t[n]=isPlainObject(r)?sanitizePlainObject(r):r);return t}function mergeDeep(e,t,n={}){let r=n.arrays??`replace`,i=n.undefinedValues??`skip`;if(Array.isArray(e)&&Array.isArray(t))return r===`concat`?[...e,...t]:t;if(!isPlainObject(e)||!isPlainObject(t))return t===void 0&&i===`skip`?e:t;let a=sanitizePlainObject(e);for(let[e,s]of Object.entries(t)){if(isBlockedObjectKey(e)||s===void 0&&i===`skip`)continue;let t=a[e];a[e]=isPlainObject(s)?isPlainObject(t)?mergeDeep(t,s,n):sanitizePlainObject(s):r===`concat`&&Array.isArray(t)&&Array.isArray(s)?[...t,...s]:s}return a}var Zi=__esmMin((()=>{Ii(),wr()}));function normalizeWindowsPathPreservingCase(e){let t=E.win32.normalize(e);if(!t.startsWith(`\\\\?\\`))return t;let n=t.slice(4);return n.toUpperCase().startsWith(`UNC\\`)?`\\\\${n.slice(4)}`:n}var Qi=__esmMin((()=>{}));function*walkForContainment(e,t){let n=E.isAbsolute(e)?e:`${process.cwd()}${E.sep}${e}`,r=E.parse(n).root,i=n.slice(r.length).split(E.sep===`\\`?/[\\/]/:`/`).filter(e=>e!==``&&e!==`.`);for(let e=i.length;e>=0;--e){let n=i.slice(e),a=r+i.slice(0,e).join(E.sep);if(n.includes(`..`))return{kind:`unresolved`,reason:`parent-after-missing`,prefix:a};let s=yield{op:`realpath`,path:a};if(s.ok)return{kind:`resolved`,path:E.join(s.value,...n)};if(!isMissingPathError(s.error))return{kind:`unresolved`,reason:T(s.error,`ELOOP`)?`link-loop`:`unreadable`,prefix:a};let c=yield{op:`readlink`,path:a};if(c.ok){if(t<=0)return{kind:`unresolved`,reason:`link-loop`,prefix:a};let e=yield*walkForContainment([E.isAbsolute(c.value)?c.value:`${E.dirname(a)}${E.sep}${c.value}`,...n].join(E.sep),t-1);return e.kind===`resolved`?{...e,danglingLink:e.danglingLink??a}:e}if((yield{op:`lstat`,path:a}).ok)return{kind:`unresolved`,reason:`unreadable`,prefix:a}}return{kind:`unresolved`,reason:`unreadable`,prefix:r}}function answerSync(e){try{return e.op===`lstat`?(v.lstatSync(e.path),{ok:!0,value:e.path}):{ok:!0,value:e.op===`realpath`?v.realpathSync.native(e.path):v.readlinkSync(e.path)}}catch(e){return{ok:!1,error:e}}}function canonicalizeForContainmentSync(e){let t=walkForContainment(e,$i),n=t.next();for(;!n.done;)n=t.next(answerSync(n.value));return n.value}function realpathViaExistingPrefixSync(e){let t=canonicalizeForContainmentSync(e);return t.kind===`resolved`?t.path:void 0}function canonicalizeContainmentRootSync(e){let t=E.resolve(e);return realpathViaExistingPrefixSync(t)??t}var $i,ea=__esmMin((()=>{L(),Qi(),$i=32})),ta=__esmMin((()=>{}));function normalizeHomeDirValue(e){let t=e?.trim();return t&&t!==`undefined`&&t!==`null`?t:void 0}function normalizeSafe(e){try{return normalizeHomeDirValue(e())}catch{return}}function resolveTermuxHome(e){let t=normalizeHomeDirValue(e.PREFIX);if(t&&normalizeHomeDirValue(e.ANDROID_DATA)&&/(?:^|\/)com\.termux\/files\/usr\/?$/u.test(t.replace(/\\/gu,`/`)))return E.resolve(t,`..`,`home`)}function resolveRawOsHomeDir(e,t){return normalizeHomeDirValue(e.HOME)??normalizeHomeDirValue(e.USERPROFILE)??resolveTermuxHome(e)??normalizeSafe(t)}function resolveOsHomeDir(e=process.env,t=k.homedir){let n=resolveRawOsHomeDir(e,t);return n?E.resolve(n):void 0}function resolveEffectiveHomeDir(e=process.env,t=k.homedir,n){let r=normalizeHomeDirValue(e.OPENCLAW_HOME);if(!r)return resolveOsHomeDir(e,t);if(r===`~`||r.startsWith(`~/`)||r.startsWith(`~\\`)){let i=resolveRawOsHomeDir(e,t);return i?E.resolve(r.replace(/^~(?=$|[\\/])/,()=>i)):n?.preserveUnresolvedTilde?E.resolve(r):void 0}return E.resolve(r)}var na=__esmMin((()=>{}));function sanitizeTerminalText(e){return stripAnsi(e).replace(/[\p{Cc}\p{Bidi_Control}]/gu,e=>e===`\r`?`\\r`:e===`
`?`\\n`:e===`	`?`\\t`:``)}var ra=__esmMin((()=>{Pi()}));function tryProcessCwd(){try{return process.cwd()}catch{return}}var ia=__esmMin((()=>{}));function getUserPathBaseDirectory(){return resolveGlobalSingleton(Symbol.for(`openclaw.userPathBaseDirectory`),()=>{let{AsyncLocalStorage:e}=process.getBuiltinModule(`async_hooks`);return new e})}function resolveRequiredHomeDir(e=process.env,t=k.homedir){let n=resolveEffectiveHomeDir(e,t)??tryProcessCwd();if(n)return E.resolve(n);throw Error(`Unable to resolve an OpenClaw home: set OPENCLAW_HOME, HOME, or USERPROFILE, or run from an existing directory.`)}function expandHomePrefix(e,t){if(!e.startsWith(`~`))return e;let n=normalizeHomeDirValue(t?.home)??resolveEffectiveHomeDir(t?.env??process.env,t?.homedir??k.homedir);return n?e.replace(/^~(?=$|[\\/])/,()=>n):e}function resolveAgainstUserBase(e){let t=getUserPathBaseDirectory().getStore();return t?E.resolve(t,e):E.resolve(e)}function resolvePathWithHome(e,t,n,r=resolveAgainstUserBase){let i=e.trim();return i&&r(i.startsWith(`~`)?expandHomePrefix(i,{home:n(t?.env??process.env,t?.homedir??k.homedir),env:t?.env,homedir:t?.homedir}):i)}function resolveHomeRelativePath(e,t){return resolvePathWithHome(e,t,resolveRequiredHomeDir)}function resolveUserPath(e,t=process.env,n=k.homedir){return e?resolveHomeRelativePath(e,{env:t,homedir:n}):``}var aa=__esmMin((()=>{na(),R(),ia()}));function isValidProfileName(e){return oa.test(e)}function normalizeProfileName(e){let t=e?.trim();return!t||normalizeLowercaseStringOrEmpty(t)==="default"||!isValidProfileName(t)?null:t}function resolveProfileStateDir(e,t,n){let r=e.trim();if(!isValidProfileName(r))throw Error(`Invalid profile name: ${JSON.stringify(e)}`);let i=normalizeLowercaseStringOrEmpty(r)==="default"?``:`-${r}`;return E.join(resolveRequiredHomeDir(t,n),`.openclaw${i}`)}var oa,sa=__esmMin((()=>{Lt(),aa(),oa=/^[a-z0-9][a-z0-9_-]{0,63}$/i})),LruCache,ca=__esmMin((()=>{LruCache=class{#e;#t;#n;#r=/* @__PURE__ */ new Map;#i=0;constructor(e,t){this.#e=Number.isFinite(e)&&e>0?Math.max(1,Math.floor(e)):1,this.#t=t?.maxBytes??1/0,this.#n=t?.sizeOf}get size(){return this.#r.size}clear(){this.#r.clear(),this.#i=0}keys(){return this.#r.keys()}delete(e){return this.#r.has(e)?(this.#i-=this.#n?.(this.#r.get(e))??0,this.#r.delete(e)):!1}deleteValue(e){for(let[t,n]of this.#r)n===e&&this.delete(t)}peek(e){return this.#r.get(e)}get(e){if(!this.#r.has(e))return;let t=this.#r.get(e);return this.#r.delete(e),this.#r.set(e,t),t}set(e,t){this.delete(e),this.#r.set(e,t),this.#i+=this.#n?.(t)??0;for(let e of this.#r.keys()){if(this.#r.size<=this.#e&&this.#i<=this.#t)break;this.delete(e)}}}}));function resolveNewStateDir(e=resolveRequiredHomeDir){return E.join(e(),`.openclaw`)}function resolveStateDir(e=process.env,t=k.homedir){let n=e.OPENCLAW_STATE_DIR?.trim();if(n&&process.platform!==`win32`&&E.isAbsolute(n)){let e=la.peek(n);if(e!==void 0)return e;let t=E.resolve(n);return la.set(n,t),t}return n?resolveHomeRelativePath(n,{env:e,homedir:t}):resolveStateDirFromHome(e,()=>resolveRequiredHomeDir(e,t))}function resolveStateDirFromHome(e,t){let n=normalizeProfileName(e.OPENCLAW_PROFILE);return n?resolveProfileStateDir(n,e,t):resolveNewStateDir(t)}var la,ua=__esmMin((()=>{sa(),aa(),ca(),la=new LruCache(64)}));function resolveConfigDir(e=process.env,t=k.homedir){let n=e.OPENCLAW_STATE_DIR?.trim();if(n)return resolveUserPath(n,e,t);let r=e.OPENCLAW_CONFIG_PATH?.trim();return r?E.dirname(resolveUserPath(r,e,t)):resolveStateDir(e,t)}var da=__esmMin((()=>{ua(),aa()})),fa=__esmMin((()=>{Qi()}));function escapeRegExp(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}var pa=__esmMin((()=>{}));function createAbortError(e,t){let n=Error(e,t);return n.name=`AbortError`,n}async function raceWithTimeout(e,t,n,r={}){let i,onAbort;try{let a=new Promise((e,a)=>{let settle=t=>{try{e(t())}catch(e){a(e)}};i=setTimeout(()=>settle(n),t),r.ref===!1&&i.unref?.();let s=r.signal;s&&(onAbort=()=>settle(()=>{if(r.onAbort)return r.onAbort(s);throw createAbortError(`Operation aborted`,{cause:s.reason})}),s.addEventListener(`abort`,onAbort,{once:!0}),s.aborted&&onAbort())}),s;try{s=typeof e==`function`?e():e}catch(e){throw a.catch(()=>{}),e}return await Promise.race([s,a])}finally{clearTimeout(i),onAbort&&r.signal?.removeEventListener(`abort`,onAbort)}}function clampNumber(e,t,n,r){return typeof e!=`number`||!Number.isFinite(e)?t:Math.min(Math.max(e,n??-1/0),r??1/0)}function resolveRetryDelayMs(e){return Math.min(Math.max(Math.round(e===1/0?ma:Number.isFinite(e)?e:0),0),ma)}function resolveRetryConfig(e=ha,t){let n=Math.max(1,Math.round(clampNumber(t?.attempts,e.attempts))),r=resolveRetryDelayMs(clampNumber(t?.minDelayMs,e.minDelayMs,0)),i=Math.max(r,resolveRetryDelayMs(clampNumber(t?.maxDelayMs,e.maxDelayMs,0))),a=t?.jitter,s=e.jitter;return{attempts:n,minDelayMs:r,maxDelayMs:i,jitter:a===`full`?a:typeof a==`number`&&Number.isFinite(a)?Math.min(Math.max(a,0),1):s}}function applyJitter(e,t,n,r){if(t===`full`)return n===`symmetric`?Math.max(0,Math.round(e*(.5+r()*.5))):Math.max(0,Math.ceil(e*(1+r())));if(t<=0)return n===`positive`?Math.ceil(e):e;let i=r(),a=e*(1+(n===`positive`?i*t:(i*2-1)*t));return Math.max(0,n===`positive`?Math.ceil(a):Math.round(a))}function toRetryError(e,t=`Non-Error thrown`){if(e instanceof Error)return e;if(typeof e==`string`)return Error(e);let n=Error(t,{cause:e});return(typeof e==`object`&&e||typeof e==`function`)&&Object.assign(n,e),n}function createRetryRunner(e={}){let t=e.random??Math.random,n=e.createFailure??(e=>toRetryError(e.at(-1)??/* @__PURE__ */ Error(`Retry failed`)));return async function(r,i=3,a=300){let s=[],c=typeof i==`number`,l=typeof i==`number`?{attempts:i}:i,u=resolveRetryConfig(ha,l),d=u.attempts,f=u.minDelayMs,p=u.maxDelayMs>0?u.maxDelayMs:1/0,m=l.retryAfterMaxDelayMs===void 0?p:Math.max(f,resolveRetryDelayMs(clampNumber(l.retryAfterMaxDelayMs,p,0))),h=l.random??t,g=l.sleep??defaultSleep,_=l.shouldRetry??(()=>!0);for(let t=1;t<=d;t+=1)try{return await r()}catch(n){if(s.push(n),t>=d||e.shouldRetry?.(n)===!1||!_(n,t))break;if(c){await defaultSleep(resolveRetryDelayMs(a*2**(t-1)));continue}let r={attempt:t,maxAttempts:d,err:n,label:l.label},i=l.retryAfterMs?.(n),v=typeof i==`number`&&Number.isFinite(i),y=typeof l.delayMs==`function`?l.delayMs(r):l.delayMs,b=y===void 0?void 0:resolveRetryDelayMs(y),x=v?Math.max(i,f):b===void 0?f*2**(t-1):Math.max(b,f),S=v?m:p,C=Math.min(x,S),w=v&&(i??0)<=S,ee=u.jitter===`full`&&!v||w;C=applyJitter(C,u.jitter,ee?`positive`:`symmetric`,h),C=Math.min(Math.max(C,f),S),await l.onRetry?.({...r,delayMs:C}),C>0&&await g(C)}throw n(s)}}var ma,ha,defaultSleep,ga=__esmMin((()=>{ma=2147e6,ha={attempts:3,minDelayMs:300,maxDelayMs:3e4,jitter:0},defaultSleep=async e=>{let t=e;do{let e=Math.min(t,ma);await new Promise(t=>{setTimeout(t,e)}),t-=e}while(t>0)},createRetryRunner()})),_a=__esmMin((()=>{ga()})),va=__esmMin((()=>{Wn(),ga(),_a()})),ya=__esmMin((()=>{})),ba=__esmMin((()=>{ra(),da(),fa(),Ii(),va(),ya(),String.raw`(?<=^|[\s"'\x60(\[{<=:;]|file://)`,String.raw`[\s"'\x60)\]}>]`,String.raw`[:;](?=[/\\~$]|[A-Za-z]:)`,resolveConfigDir()}));function isConfigContainer(e){return Array.isArray(e)||isPlainObject(e)}function includeLogicalPath(e){let t=[];for(let n=e;n;n=n.parent)t.push(n.key);return t.toReversed()}function deepMerge(e,t){return mergeDeep(e,t,{arrays:`concat`,undefinedValues:`replace`})}function safeRealpath(e){return canonicalizeContainmentRootSync(e)}function createConfigIncludeBoundary(e,t=[]){let n=E.normalize(E.dirname(e));return{configRoot:{rootDir:n,rootRealDir:E.normalize(safeRealpath(n))},allowedRoots:t.filter(e=>typeof e==`string`&&e.length>0&&E.isAbsolute(e)).map(e=>{let t=E.normalize(e);return{rootDir:t,rootRealDir:E.normalize(safeRealpath(t))}})}}function readConfigIncludeFileWithGuards(e){let t=e.ioFs??v,n=e.maxBytes??Sa;if(!l(t)){let n=t.readFileSync(e.resolvedPath,`utf-8`);try{e.onResolvedPath?.(E.normalize(t.realpathSync(e.resolvedPath)))}catch{}return n}let r=u({absolutePath:e.resolvedPath,rootPath:e.rootRealDir,rootRealPath:e.rootRealDir,boundaryLabel:`config directory`,skipLexicalRootCheck:!0,rejectSymlinks:!1,maxBytes:n,ioFs:t});if(!r.ok)throw r.reason===`validation`?new ConfigIncludeError(`Include file failed security checks (regular file, max ${n} bytes, no hardlinks): ${e.includePath}`,e.includePath):new ConfigIncludeReadError(`Failed to read include file: ${e.includePath} (resolved: ${e.resolvedPath})`,e.includePath,r.error instanceof Error?r.error:void 0);try{let n=t.readFileSync(r.fd,`utf-8`);return e.onResolvedPath?.(E.normalize(r.path)),n}finally{t.closeSync(r.fd)}}function resolveConfigIncludes(e,t,n=wa,r={}){let i=createConfigIncludeBoundary(t,r.allowedRoots??[]);return new IncludeProcessor(t,n,i).process(e)}function resolveConfigIncludesForTopLevelKey(e,t,n,r=wa,i={}){let a=createConfigIncludeBoundary(t,i.allowedRoots??[]);return new IncludeProcessor(t,r,a,/* @__PURE__ */ new Set([n])).process(e)}var xa,Sa,Ca,ConfigIncludeError,ConfigIncludeReadError,CircularIncludeError,IncludeProcessor,wa,Ta=__esmMin((()=>{Xn(),Xi(),Zi(),L(),ea(),ta(),ba(),Bi(),xa=`$include`,Sa=2097152,Ca=4096,ConfigIncludeError=class extends Error{constructor(e,t,n){super(e),this.includePath=t,this.cause=n,this.name=`ConfigIncludeError`}},ConfigIncludeReadError=class extends ConfigIncludeError{constructor(...e){super(...e),this.name=`ConfigIncludeReadError`}},CircularIncludeError=class extends ConfigIncludeError{constructor(e){super(`Circular include detected: ${e.join(` -> `)}`,expectDefined(e[e.length-1],`chain entry at chain.length 1`)),this.chain=e,this.name=`CircularIncludeError`}},IncludeProcessor=class{constructor(e,t,n,r){this.basePath=e,this.resolver=t,this.boundary=n,this.rootProjectionKeys=r}get rootDir(){return this.boundary.configRoot.rootDir}process(e){let t=[],n=this.traverseValue(e,null,!1,{basePath:this.basePath,visited:/* @__PURE__ */ new Set([E.normalize(this.basePath)]),depth:0}),r;for(;;){let e=n.next(r);if(e.done){let i=t.pop();if(!i)return e.value;r=e.value,n=i}else t.push(n),n=this.traverseValue(e.value.value,e.value.pathLink,e.value.hasArrayAncestor,e.value.context)}}*traverseValue(e,t,n,r){if(Array.isArray(e)){let n=[];for(let[i,a]of e.entries())n.push(isConfigContainer(a)?yield{value:a,pathLink:{parent:t,key:String(i)},hasArrayAncestor:!0,context:r}:a);return n}if(!isPlainObject(e))return e;if(!(`$include`in e)){let i=t===null,a={};for(let[s,c]of Object.entries(e))i&&this.rootProjectionKeys&&!this.rootProjectionKeys.has(s)||(a[s]=isConfigContainer(c)?yield{value:c,pathLink:{parent:t,key:s},hasArrayAncestor:n,context:r}:c);return a}return yield*this.traverseInclude(e,t,n,r)}*traverseInclude(e,t,n,r){let i=e[xa],a=t===null,s=Object.keys(e).filter(e=>e!==`$include`&&(!a||!this.rootProjectionKeys||this.rootProjectionKeys.has(e))),c=Array.isArray(i);if(!c&&typeof i!=`string`)throw new ConfigIncludeError(`Invalid $include value: expected string or array of strings, got ${typeof i}`,String(i));let l=[];for(let e of c?i:[i]){if(typeof e!=`string`)throw new ConfigIncludeError(`Invalid $include array item: expected string, got ${typeof e}`,String(e));let i=this.loadFileSync(e,r);l.push({value:yield{value:i.parsed,pathLink:t,hasArrayAncestor:n,context:i.nestedContext},targetPath:i.resolvedPath})}let u=c?l.reduce((e,t)=>deepMerge(e,t.value),{}):l[0].value;if(this.resolver.onIncludeResolved?.({path:includeLogicalPath(t),value:u,kind:c?`multiple`:`single`,hasSiblingOverrides:s.length>0,hasArrayAncestor:n,...c?{targetPaths:l.map(e=>e.targetPath)}:{targetPath:l[0].targetPath}}),s.length===0)return u;if(!isPlainObject(u))throw new ConfigIncludeError(`Sibling keys require included content to be an object`,typeof i==`string`?i:xa);let d={};for(let i of s){let a=e[i];d[i]=isConfigContainer(a)?yield{value:a,pathLink:{parent:t,key:i},hasArrayAncestor:n,context:r}:a}return deepMerge(u,d)}loadFileSync(e,t){let{resolvedPath:n,root:r}=this.resolvePath(e,t);if(t.visited.has(n))throw new CircularIncludeError([...t.visited,n]);if(t.depth>=10)throw new ConfigIncludeError(`Maximum include depth (10) exceeded at: ${e}`,e);let i=this.readFile(e,n,r);return{parsed:this.parseFile(e,n,i),resolvedPath:n,nestedContext:{basePath:n,visited:/* @__PURE__ */ new Set([...t.visited,n]),depth:t.depth+1}}}resolvePath(e,t){if(e.includes(`\0`))throw new ConfigIncludeError(`Include path must not contain null bytes`,e);if(e.length>=Ca)throw new ConfigIncludeError(`Include path exceeds maximum length (${Ca} characters)`,e);let n=E.dirname(t.basePath),r=E.isAbsolute(e)?e:E.resolve(n,e),i=E.normalize(this.resolver.mapPath?.(r)??r);if(i.length>=Ca)throw new ConfigIncludeError(`Resolved include path exceeds maximum length (${Ca} characters)`,e);let a=realpathViaExistingPrefixSync(i),s=this.findContainingRoot(i,`rootDir`)??(a?this.findContainingRoot(E.normalize(a),`rootRealDir`):null);if(!s)throw new ConfigIncludeError(`Include path escapes config directory: ${e} (root: ${this.rootDir})`,e);this.resolver.onLexicalPath?.(i);try{let t=v.realpathSync(i),n=this.findContainingRoot(t,`rootRealDir`);if(!n)throw new ConfigIncludeError(`Include path resolves outside config directory (symlink): ${e} (root: ${this.rootDir})`,e);return{resolvedPath:i,root:n}}catch(t){if(t instanceof ConfigIncludeError)throw t;if(isMissingPathError(t))return{resolvedPath:i,root:s};throw new ConfigIncludeReadError(`Failed to resolve include file realpath: ${e} (resolved: ${i})`,e,t instanceof Error?t:void 0)}}findContainingRoot(e,t){if(ce(this.boundary.configRoot[t],e))return this.boundary.configRoot;for(let n of this.boundary.allowedRoots)if(ce(n[t],e))return n;return null}readFile(e,t,n){try{return this.resolver.readFileWithGuards?this.resolver.readFileWithGuards({includePath:e,resolvedPath:t,rootRealDir:n.rootRealDir}):this.resolver.readFile(t)}catch(n){throw n instanceof ConfigIncludeError?n:new ConfigIncludeReadError(`Failed to read include file: ${e} (resolved: ${t})`,e,n instanceof Error?n:void 0)}}parseFile(e,t,n){try{return this.resolver.parseJson(n)}catch(n){throw new ConfigIncludeError(`Failed to parse include file: ${e} (resolved: ${t})`,e,n instanceof Error?n:void 0)}}},wa={readFile:e=>v.readFileSync(e,`utf-8`),readFileWithGuards:readConfigIncludeFileWithGuards,parseJson:parseJsonWithJson5Fallback}})),Ea=__esmMin((()=>{Wn()}));function resolveIsNixMode(e=process.env){return e.OPENCLAW_NIX_MODE===`1`}function envHomedir(e){return()=>resolveRequiredHomeDir(e,k.homedir)}function resolveIncludeRoots(e=process.env,t=envHomedir(e)){let n=e.OPENCLAW_INCLUDE_ROOTS?.trim();if(!n)return[];let effectiveHomedir=()=>resolveRequiredHomeDir(e,t),r=/* @__PURE__ */ new Set,i=[];for(let t of n.split(E.delimiter)){let n=t.trim();if(!n)continue;let a=E.resolve(resolveHomeRelativePath(n,{env:e,homedir:effectiveHomedir}));r.has(a)||(r.add(a),i.push(a))}return i}function resolveConfigPathCandidate(e=process.env,t=envHomedir(e)){return resolveConfigPath(e,void 0,t)}function resolveConfigPath(e=process.env,t,n=envHomedir(e)){let r=e.OPENCLAW_CONFIG_PATH?.trim();return r?resolveUserPath(r,e,n):E.join(t??resolveStateDir(e,n),Da)}var Da,Oa=__esmMin((()=>{aa(),Ea(),ua(),resolveIsNixMode(),Da=`openclaw.json`,resolveStateDir(),resolveConfigPathCandidate()}));function resolveLoggingConfigSelector(){let e=process.env;return[e.OPENCLAW_CONFIG_PATH,e.OPENCLAW_STATE_DIR,e.OPENCLAW_HOME,e.OPENCLAW_PROFILE,e.HOME,e.USERPROFILE,e.HOMEDRIVE,e.HOMEPATH,e.PREFIX,e.ANDROID_DATA,e.OPENCLAW_TEST_FAST,tryProcessCwd()??``].map(e=>e??``).join(`\0`)}function resolvePartialDiagnosticLoggingConfig(e){if(!isRecord(e))return;let t={};if(typeof e.consoleStyle==`string`)try{let n=resolveConfigEnvVars({consoleStyle:e.consoleStyle});isRecord(n)&&(n.consoleStyle===`pretty`||n.consoleStyle===`compact`||n.consoleStyle===`json`)&&(t.consoleStyle=n.consoleStyle)}catch{}if(Array.isArray(e.redactPatterns))try{let n=resolveConfigEnvVars({redactPatterns:e.redactPatterns});isRecord(n)&&Array.isArray(n.redactPatterns)&&n.redactPatterns.every(e=>typeof e==`string`)&&(t.redactPatterns=n.redactPatterns)}catch{}return Object.keys(t).length>0?t:void 0}function readLoggingConfig(){try{if(H.appliedConfig!==`unowned`)return H.appliedConfig;let e=resolveLoggingConfigSelector();if(ka?.selector===e)return ka.logging;let t=resolveConfigPath();if(!v.existsSync(t)){ka={selector:e,logging:void 0};return}let n=parseJsonWithJson5Fallback(v.readFileSync(t,`utf8`)),r=resolveIncludeRoots(),i;try{i=resolveConfigIncludesForTopLevelKey(n,t,`logging`,void 0,{allowedRoots:r})}catch{let e=isRecord(n)?n.logging:void 0;if(e===void 0)return;try{i=resolveConfigIncludes({logging:e},t,void 0,{allowedRoots:r})}catch{return resolvePartialDiagnosticLoggingConfig(e)}}let a;try{a=resolveConfigEnvVars(i)}catch{return resolvePartialDiagnosticLoggingConfig(isRecord(i)?i.logging:void 0)}let s=isRecord(a)?a.logging:void 0,c=isRecord(s)?s:void 0;return ka={selector:e,logging:c},c}catch{return}}var ka,Aa=__esmMin((()=>{B(),Yi(),Ta(),Oa(),ia(),Bi(),wi()}));function normalizeUrlQueryParamName(e){let t=e.replace(Ma,``);for(let e=0;e<=Pa;e+=1){let e;try{e=decodeURIComponent(t).replace(Ma,``)}catch{break}if(e===t)return{value:normalizeLowercaseStringOrEmpty(t).replaceAll(`-`,`_`),unresolvedEncoding:!1};t=e}return{value:normalizeLowercaseStringOrEmpty(t).replaceAll(`-`,`_`),unresolvedEncoding:t.includes(`%`)}}function isSensitiveUrlQueryParamName(e){let t=normalizeUrlQueryParamName(e);return t.unresolvedEncoding||ja.has(t.value)||Na.test(t.value)}var ja,Ma,Na,Pa,Fa=__esmMin((()=>{Lt(),ja=/* @__PURE__ */ new Set(/* @__PURE__ */ `token.key.api_key.apikey.secret.access_token.auth_token.password.pass.passwd.auth.jwt.session.id_token.code.client_secret.app_secret.hook_token.refresh_token.signature.x_amz_signature.x_amz_security_token.private_key.credential.authorization.sig.x_api_key.x_access_token.x_auth_token`.split(`.`)),Ma=/[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu,Na=/(?:^|_)token(?:_[a-f0-9]{16,})?$/u,Pa=8}));function skipHorizontalWhitespace(e,t){let n=t;for(;e[n]===` `||e[n]===`	`;)n+=1;return n}function skipSerializedBackslashes(e,t){let n=t;for(;n-t<64&&e[n]===`\\`;)n+=1;return n}function readSerializedLineEnd(e,t){let n=skipSerializedBackslashes(e,t);if(n===t)return null;if(e[n]===`n`)return n+1;if(e[n]!==`r`)return null;let r=skipSerializedBackslashes(e,n+1);return r>n+1&&e[r]===`n`?r+1:null}function readSerializedTabEnd(e,t){let n=skipSerializedBackslashes(e,t);return n>t&&e[n]===`t`?n+1:null}function skipAuthWhitespace(e,t){let n=t;for(;;){n=skipHorizontalWhitespace(e,n);let t=readSerializedTabEnd(e,n);if(t!==null){n=t;continue}let r=e[n]===`\r`&&e[n+1]===`
`?n+2:e[n]===`
`?n+1:readSerializedLineEnd(e,n);if(r===null||e[r]!==` `&&e[r]!==`	`&&readSerializedTabEnd(e,r)===null)return n;n=r}}function readAuthParamName(e,t){let n=Ga.exec(e.slice(t));return n?{name:n[0].toLowerCase(),end:t+n[0].length}:null}function isAuthHeaderStart(e,t){let n=e[t-1];if((n!==`n`&&n!==`r`||e[t-2]!==`\\`)&&n!==void 0&&/[A-Za-z0-9_-]/u.test(n))return!1;let r=`proxy-authorization`,i=`authorization`,a=e.slice(t,t+19).toLowerCase(),s=a===r?r:a.startsWith(i)?i:null;if(!s)return!1;let c=t+s.length,l=skipSerializedBackslashes(e,c);if(e[l]===`"`||e[l]===`'`)l+=1;else if(l>c)return!1;return l=skipHorizontalWhitespace(e,l),e[l]===`:`||e[l]===`=`}function findNextAuthParamStart(e,t){let n=t;for(;;){if(n=skipAuthWhitespace(e,n),n>t&&isAuthHeaderStart(e,n)||n>=e.length||e[n]===`\r`||e[n]===`
`||e[n]===`;`)return null;if(e[n]===`,`){n+=1;continue}let r=readAuthParamName(e,n);if(r){let t=skipAuthWhitespace(e,r.end);if(e[t]===`=`&&e[t+1]!==`=`)return n}for(;n<e.length;){let r=skipAuthWhitespace(e,n);if(r>n){n=r;continue}if(n>t&&isAuthHeaderStart(e,n))return null;let i=e[n];if(i===`\r`||i===`
`||i===`;`)return null;if(n+=1,i===`,`)break}}}function usesAuthParams(e){return e===`digest`||e===`hawk`||e.startsWith(`aws4-`)}function isAuthFieldEnd(e){return e===void 0||e===`\r`||e===`
`||e===`;`||e===`\\`||e===`"`||e===`'`||e===`}`||e===`]`}function findAuthFieldEnd(e,t){let n=t;for(;n<e.length;){let r=skipAuthWhitespace(e,n);if(r>n)n=r;else{if(n>t&&isAuthHeaderStart(e,n)||isAuthFieldEnd(e[n]))break;n+=1}}return n}function readParamValue(e,t,n){let r=0;for(;e[t+r]===`\\`;)r+=1;let i=r>0&&e[t+r]===`"`,a=e[t]===`"`||e[t]===`'`?e[t]:void 0;if(a||i){let n=t+(i?r+1:1);for(;n<e.length;)if(e[n]===`\r`||e[n]===`
`){let t=skipAuthWhitespace(e,n);if(t===n)break;n=t}else if(i&&e[n]===`\\`){let t=n+1;for(;e[t]===`\\`;)t+=1;if(e[t]===`"`){if((t-n)%(2*(r+1))===r)return t+1;n=t+1;continue}n=t}else if(!i&&e[n]===`\\`&&n+1<e.length)n+=2;else{if(!i&&e[n]===a)return n+1;n+=1}return n>t+1?n:null}if(n.signedHeaders){let n=/^:?[A-Za-z0-9!#$%&'*+.^_`|~-]+(?:;:?[A-Za-z0-9!#$%&'*+.^_`|~-]+)*/u.exec(e.slice(t));if(!n)return null;let r=t+n[0].length,i=e[r];return i===void 0||i===`,`||i===` `||i===`	`||i===`\r`||i===`
`?r:null}let s=(n.awsScope?Ka:Ga).exec(e.slice(t));return s?t+s[0].length:null}function findStructuredAuthParamRanges(e){let t=[];for(let n of e.matchAll(Wa)){let r=(n[2]??``).toLowerCase(),i=(n.index??0)+n[0].length,a=i,s=i,c=readAuthParamName(e,i),l=c?skipAuthWhitespace(e,c.end):void 0;if(!c||l===void 0||e[l]!==`=`||e[l+1]===`=`){if(e[skipAuthWhitespace(e,i)]!==`,`&&!usesAuthParams(r))continue;let t=findNextAuthParamStart(e,i);if(t===null)continue;i=t}for(;;){let t=readAuthParamName(e,i);if(!t||(i=skipAuthWhitespace(e,t.end),e[i]!==`=`))break;i=skipAuthWhitespace(e,i+1);let n=readParamValue(e,i,{awsScope:r.startsWith(`aws4-`)&&t.name===`credential`,signedHeaders:t.name===`signedheaders`});if(n===null){let t=findNextAuthParamStart(e,i);if(t!==null){i=t;continue}s=Math.max(s,findAuthFieldEnd(e,i));break}s=n;let a=skipAuthWhitespace(e,n);if(e[a]!==`,`){if(!isAuthFieldEnd(e[a])){let t=findNextAuthParamStart(e,a);if(t!==null){i=t;continue}s=Math.max(s,findAuthFieldEnd(e,a))}break}let c=findNextAuthParamStart(e,a+1);if(c===null)break;i=c}s>a&&t.push({start:a,end:s})}return t}function redactStructuredAuthHeaders(e,t){let n=[],r=0;for(let i of findStructuredAuthParamRanges(e))(n.length===0||i.start>r)&&n.push(e.slice(r,i.start),t),r=Math.max(r,i.end);return n.push(e.slice(r)),n.join(``)}var Ia,La,Ra,za,Ba,Va,Ha,Ua,U,Wa,Ga,Ka,qa=__esmMin((()=>{Ia="[A-Za-z0-9!#$%&'*+.^_`|~-]+",La=String.raw`(?:\[REDACTED\]|[^\s\\"',;&#?<>)}\]]+)`,Ra=String.raw`\\{1,64}t`,za=String.raw`(?:[ \t]+|${Ra})`,Ba=String.raw`(?:[ \t]*\r?\n${za}|[ \t]*\\{1,64}r\\{1,64}n${za}|[ \t]*\\{1,64}n${za}|[ \t]*${Ra}[ \t]*|[ \t]*)`,Va=String.raw`(?:[ \t]*\r?\n${za}|[ \t]*\\{1,64}r\\{1,64}n${za}|[ \t]*\\{1,64}n${za}|[ \t]*${Ra}[ \t]*|[ \t]+)`,Ha=String.raw`(?:[ \t\r\n]*|[ \t]*\\{1,64}r\\{1,64}n(?:[ \t]*|${Ra})|[ \t]*\\{1,64}n(?:[ \t]*|${Ra})|[ \t]*${Ra}[ \t]*)`,Ua=String.raw`(^|[^A-Za-z0-9_-]|\\{1,64}[rn])`,U=String.raw`(?:\\{1,64}["']|["']|)`,`${Ua}${U}${Ba}${U}`,Wa=/* @__PURE__ */ RegExp(`${Ua}(?:Proxy-)?Authorization${U}[ \\t]*[:=]${Ba}${U}(${Ia})${Va}`,`giu`),Ga=/^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u,Ka=/^[A-Za-z0-9!#$%&'*+.^_`|~:/-]+/u}));function pruneMapToMaxSize(e,t){if(Number.isNaN(t)||t===1/0)return;let n=Math.max(0,Math.floor(t));if(n<=0)e.clear();else for(let t of e.keys()){if(e.size<=n)break;e.delete(t)}}var Ja=__esmMin((()=>{}));function createParseFrame(){return{lastToken:null,containsRepetition:!1,hasAlternation:!1,branchMinLength:0,branchMaxLength:0,altMinLength:null,altMaxLength:null}}function addLength(e,t){return!Number.isFinite(e)||!Number.isFinite(t)?1/0:e+t}function multiplyLength(e,t){return Number.isFinite(e)?e*t:t===0?0:1/0}function recordAlternative(e){e.altMinLength===null||e.altMaxLength===null?(e.altMinLength=e.branchMinLength,e.altMaxLength=e.branchMaxLength):(e.altMinLength=Math.min(e.altMinLength,e.branchMinLength),e.altMaxLength=Math.max(e.altMaxLength,e.branchMaxLength))}function readQuantifier(e,t){let n=e[t],r=e[t+1]===`?`?2:1;if(n===`*`)return{consumed:r,minRepeat:0,maxRepeat:null};if(n===`+`)return{consumed:r,minRepeat:1,maxRepeat:null};if(n===`?`)return{consumed:r,minRepeat:0,maxRepeat:1};if(n!==`{`)return null;let i=t+1;for(;i<e.length&&/\d/.test(e.charAt(i));)i+=1;if(i===t+1)return null;let a=Number.parseInt(e.slice(t+1,i),10),s=a;if(e[i]===`,`){i+=1;let t=i;for(;i<e.length&&/\d/.test(e.charAt(i));)i+=1;s=i===t?null:Number.parseInt(e.slice(t,i),10)}return e[i]!==`}`||(i+=1,e[i]===`?`&&(i+=1),s!==null&&s<a)?null:{consumed:i-t,minRepeat:a,maxRepeat:s}}function hasNestedRepetition(e){let t=[createParseFrame()],n=!1,emitToken=e=>{let n=expectDefined(t[t.length-1],`frames entry at frames.length 1`);n.lastToken=e,e.containsRepetition&&(n.containsRepetition=!0),n.branchMinLength=addLength(n.branchMinLength,e.minLength),n.branchMaxLength=addLength(n.branchMaxLength,e.maxLength)},emitSimpleToken=()=>{emitToken({containsRepetition:!1,hasAmbiguousAlternation:!1,minLength:1,maxLength:1})};for(let r=0;r<e.length;r+=1){let i=e[r];if(n){i===`\\`?r+=1:i===`]`&&(n=!1);continue}if(i===`\\`){r+=1,emitSimpleToken();continue}if(i===`[`){n=!0,emitSimpleToken();continue}if(i===`(`){t.push(createParseFrame());continue}if(i===`)`){if(t.length>1){let e=t.pop();e.hasAlternation&&recordAlternative(e);let n=e.hasAlternation?e.altMinLength??0:e.branchMinLength,r=e.hasAlternation?e.altMaxLength??0:e.branchMaxLength;emitToken({containsRepetition:e.containsRepetition,hasAmbiguousAlternation:e.hasAlternation&&e.altMinLength!==null&&e.altMaxLength!==null&&e.altMinLength!==e.altMaxLength,minLength:n,maxLength:r})}continue}if(i===`|`){let e=expectDefined(t[t.length-1],`frames entry at frames.length 1`);e.hasAlternation=!0,recordAlternative(e),e.branchMinLength=0,e.branchMaxLength=0,e.lastToken=null;continue}let a=readQuantifier(e,r);if(!a){emitSimpleToken();continue}r+=a.consumed-1;let s=expectDefined(t[t.length-1],`frames entry at frames.length 1`),c=s.lastToken;if(!c)continue;if(c.containsRepetition||c.hasAmbiguousAlternation&&a.maxRepeat===null)return!0;let l=c.minLength,u=c.maxLength;c.minLength=multiplyLength(c.minLength,a.minRepeat),c.maxLength=a.maxRepeat===null?1/0:multiplyLength(c.maxLength,a.maxRepeat),c.containsRepetition=!0,s.containsRepetition=!0,s.branchMinLength=s.branchMinLength-l+c.minLength,s.branchMaxLength=addLength(Number.isFinite(s.branchMaxLength)&&Number.isFinite(u)?s.branchMaxLength-u:1/0,c.maxLength)}return!1}function compileSafeRegexDetailed(e,t=``){let n=e.trim();if(!n)return{regex:null,source:n,flags:t,reason:`empty`};let r=`${t}::${n}`,i=Xa.get(r);if(i)return i;let a;if(hasNestedRepetition(n))a={regex:null,source:n,flags:t,reason:`unsafe-nested-repetition`};else try{a={regex:new RegExp(n,t),source:n,flags:t,reason:null}}catch{a={regex:null,source:n,flags:t,reason:`invalid-regex`}}return Xa.set(r,a),pruneMapToMaxSize(Xa,Ya),a}var Ya,Xa,Za=__esmMin((()=>{Xn(),Ja(),Ya=256,Xa=/* @__PURE__ */ new Map}));function compileConfigRegex(e,t=``){let n=compileSafeRegexDetailed(e,t);return n.reason===`empty`?null:{regex:n.regex,pattern:n.source,flags:n.flags,reason:n.reason}}var Qa=__esmMin((()=>{Za()}));function clampMessage(e){return e.length>$a?`${truncateUtf16Safe(e,$a)}...(truncated)`:e}function stringifyFileLogMessagePart(e,t){if(t)return JSON.stringify(e);if(typeof e==`string`)return e;if(typeof e==`number`||typeof e==`boolean`||typeof e==`bigint`)return String(e);if(isRecord(e)&&typeof e.message==`string`)return e.message}function serializeFileLogRecord(e,t=[]){let n=[],r=JSON.parse(JSON.stringify(e,function(e,t){for(;n.length>0&&n.at(-1)!==this;)n.pop();if(typeof t==`bigint`)return String(t);if(typeof t==`object`&&t){if(n.includes(t))return`[Circular]`;n.push(t)}return t}));if(!isRecord(r))throw TypeError(`File log records must serialize to objects`);let i=[];for(let{key:e,json:n,primitiveText:a}of t){let t=a??stringifyFileLogMessagePart(r[e],n);t?.trim()&&i.push(t)}if(i.length>0){let e=clampMessage(i.join(` `));if(Object.hasOwn(r,`message`))r.message=e;else{let t=Object.entries(r);return t.splice(t.findIndex(([e])=>e===`hostname`)+1,0,[`message`,e]),JSON.stringify(Object.fromEntries(t))}}return JSON.stringify(r)}var $a,eo=__esmMin((()=>{B(),Yn(),$a=4096}));function replacePatternBounded(e,t,n){if(e.length<=to)return e.replace(t,n);let r;for(let i=0;i<e.length;i+=no){let a=e.slice(i,i+no),s=a.replace(t,n);r===void 0?s!==a&&(r=e.slice(0,i)+s):r+=s}return r??e}var to,no,ro=__esmMin((()=>{to=32768,no=16384}));function composeRedactionEdits(e,t,n){if(t.length===0)return n;let r=[],i=0;for(let e of t)i<e.start&&r.push({start:i,end:e.start}),r.push(e),i=e.end;i<e&&r.push({start:i,end:e});let a=[],s=0,c=0,l=0,consume=(t,n)=>{if(t===l){let t=r[s];if(!t)return{start:e,end:e};let n=t.replacement===void 0?t.start+c:t.start;return{start:n,end:t.replacement!==void 0&&c>0?t.end:n}}let i,u=0;for(;l<t;){let e=expectDefined(r[s],`current redaction piece`),d=e.replacement?.length??e.end-e.start,f=Math.min(d-c,t-l),p=e.replacement===void 0?e.start+c:e.start,m=e.replacement===void 0?p+f:e.end;i??=p,u=m,n&&f>0&&a.push({start:p,end:m,replacement:e.replacement?.slice(c,c+f)}),l+=f,c+=f,c===d&&(s+=1,c=0)}return{start:i??u,end:u}};for(let e of n)consume(e.start,!0),a.push({...consume(e.end,!1),replacement:e.replacement});for(;s<r.length;){let e=expectDefined(r[s],`remaining redaction piece`);consume(l+(e.replacement?.length??e.end-e.start)-c,!0)}let u=[],d=[],f,flush=()=>{f&&(f.replacement=d.join(``),u.push(f),f=void 0,d=[])};for(let e of a){if(e.replacement===void 0){flush();continue}let t=f&&f.start===e.start&&f.end===e.end&&e.start===e.end;!f||e.start>=f.end&&!t?(flush(),f={start:e.start,end:e.end,replacement:``}):f.end=Math.max(f.end,e.end),d.push(e.replacement)}return flush(),u}function rebaseRedactionEdits(e,t){let n=0,r=e.map(e=>{let t=e.start+n;return n+=e.replacement.length-(e.end-e.start),{...e,currentStart:t,currentEnd:e.end+n}}),boundary=(e,t)=>{let n=0,i=r.length;for(;n<i;){let t=n+i>>>1,a=expectDefined(r[t],`source redaction span`);a.end<e||a.end===e&&a.start!==a.end?n=t+1:i=t}let a=r[n];if(a&&(e>a.start||e===a.start&&a.start===a.end))return t?a.currentEnd:a.currentStart;let s=r[n-1];return e+(s?s.currentEnd-s.end:0)};return t.map(e=>({start:boundary(e.start,!1),end:boundary(e.end,!0),replacement:e.replacement}))}function mergeRedactionEdits(e){e.sort((e,t)=>e.start-t.start||e.end-t.end);let t=[];for(let n of e){let e=t.at(-1);!e||n.start>=e.end?t.push({...n}):(n.start!==e.start||n.end!==e.end||n.replacement!==e.replacement)&&(e.end=Math.max(e.end,n.end),e.replacement=`***`)}return t}function applyRedactionEdits(e,t){let n=[],r=0;for(let i of mergeRedactionEdits(t))n.push(e.slice(r,i.start),i.replacement),r=i.end;return n.join(``)+e.slice(r)}var io=__esmMin((()=>{Xn()}));function skipWhitespace(e,t){let n=t;for(;e[n]===` `||e[n]===`	`||e[n]===`\r`||e[n]===`
`;)n+=1;return n}function readScalarTokens(e,t){let n=[],r=[],i={key:``,path:[],origins:t,origin:t.value,objectPath:!0},valueContext=e=>e?e.array?{...e.context,origin:e.context.origins?.value??e.context.origin,origins:e.context.origins?.children.get(String(e.nextIndex++))}:expectDefined(e.field,`JSON object field context`):i;for(let t of e.matchAll(ao)){let i=t[0],a=r.at(-1);if(i===`{`||i===`[`){let e=valueContext(a),s=i===`[`;r.push({array:s,nextIndex:0,context:s?{...e,objectPath:!1}:e,start:t.index,tokenStart:n.length});continue}if(i===`}`||i===`]`){let i=expectDefined(r.pop(),`JSON container`);if(i.tokenStart===n.length){let r=t.index+1,a=e.slice(i.start,r);n.push({...i.context,isKey:!1,string:!1,value:a,start:i.start,end:r,escaped:!1,edits:[],projectedEdits:[],currentValue:a,currentStart:i.start,currentEnd:r})}continue}let s=t.index,c=s+i.length,l=i.startsWith(`"`),u=l?JSON.parse(i):i,d=skipWhitespace(e,c),f=l&&e[d]===`:`,p;if(f){let t=expectDefined(a,`JSON property container`),n=t.context;p={key:``,path:[],origin:n.origin,objectPath:!1,rootKey:n.rootKey,rootValueStart:n.rootValueStart};let i=skipWhitespace(e,d+1);t.field={key:u,path:[...n.path,u],origins:n.origins?.children.get(u),origin:n.origins?.value??n.origin,objectPath:n.objectPath,rootKey:r.length===1?u:n.rootKey,rootValueStart:r.length===1?i:n.rootValueStart}}else p=valueContext(a);let m=f?{structured:!1,primitiveMask:!1}:p.origins?.value??p.origin;n.push({...p,origin:m,start:s,end:c,isKey:f,string:l,value:u,escaped:l&&i.includes(`\\`),edits:[],projectedEdits:[],currentValue:u,currentStart:s,currentEnd:c})}return n}function readBatchTokens(e,t,n=!1){let r=[],i=0;for(let a of e.split(`
`)){let e=!1;try{JSON.parse(a),e=!0}catch{}if(e)for(let e of readScalarTokens(a,t))e.deferEncoding=!e.string,e.start+=i,e.end+=i,e.currentStart+=i,e.currentEnd+=i,r.push(e);else{let e=r.at(-1);!n&&e?.raw&&e.end+1===i?(e.value+=`\n${a}`,e.currentValue=e.value,e.end=e.currentEnd=i+a.length):r.push({raw:!0,origin:t.value,key:``,path:[],objectPath:!1,isKey:!1,string:!1,value:a,escaped:!1,start:i,end:i+a.length,currentStart:i,currentEnd:i+a.length,currentValue:a,edits:[],projectedEdits:[]})}i+=a.length+1}return r}var ao,oo=__esmMin((()=>{Xn(),ao=/"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}[\]]/g}));function parseRedactPatternSource(e){let t=e.match(/^\/(.+)\/([gimsuy]*)$/);if(!t)return[e,`gi`];let n=t[1]??``,r=t[2]??``;return[n,r.includes(`g`)?r:`${r}g`]}function escapeAtomEnd(e,t){let n=e[t+1];if(n===void 0)return-1;if(uo.has(n))return t+2;if(n===`x`)return lo.test(e[t+2]??``)&&lo.test(e[t+3]??``)?t+4:t+2;if((n===`u`||n===`p`||n===`P`)&&e[t+2]===`{`){let n=e.indexOf(`}`,t+3);return n===-1?t+2:n+1}if(n===`u`){let n=t+2;for(;n<t+6&&lo.test(e[n]??``);)n+=1;return n}if(n===`c`)return t+3;if(n===`k`&&e[t+2]===`<`){let n=e.indexOf(`>`,t+3);return n===-1?t+2:n+1}if(n>=`0`&&n<=`9`){let n=t+2;for(let t=n;t<e.length;t+=1){let r=e[t];if(r===void 0||r<`0`||r>`9`)break;n=t+1}return n}return t+2}function classAtomEnd(e,t){let n=t+1;if(e[n]===`^`&&(n+=1),e[n]===`]`)return-1;for(;n<e.length;){let t=e[n];if(t===`\\`)n+=2;else{if(t===`]`)return n+1;n+=1}}return e.length}function rewriteOpenEndedRepeats(e,t=``){if(!e.includes(`{`))return e;let n=``,r=-1,i=-1,a=0;for(;a<e.length;){let s=e[a],c=a+1,l=!0;if(s===`\\`)c=escapeAtomEnd(e,a),c<0?(c=a+1,l=!1):t.includes(`u`)&&isHighSurrogateEscape(e,a)&&e[c]===`\\`&&isLowSurrogateEscape(e,c)?c=escapeAtomEnd(e,c):l=!uo.has(e[a+1]);else if(s===`[`){if(c=classAtomEnd(e,a),c<0)return e}else if(s===`{`){let t=so.exec(e.slice(a)),s=t&&r>=0?t:co.exec(e.slice(a));if(s){n+=s===t?`{${t[1]}}${e.slice(r,i)}*`:s[0],a+=s[0].length,e[a]===`?`&&(n+=`?`,a+=1),r=-1;continue}}else t.includes(`u`)&&s>=`\ud800`&&s<=`\udbff`&&a+1<e.length&&e[a+1]>=`\udc00`&&e[a+1]<=`\udfff`?c=a+2:l=!`*+?()|^$`.includes(s);n+=e.slice(a,c),r=l?a:-1,i=c,a=c}return n}function readRedactMatch(e){let t=e.length>0&&typeof e[e.length-1]==`object`&&e[e.length-1]!==null?e.length-2:e.length-1,n=t-1,r=typeof e[0]==`string`?e[0]:``,i=e.slice(1,n).map(e=>typeof e==`string`?e:``),a=typeof e[n]==`number`?e[n]:-1;return{match:r,groups:i,input:typeof e[t]==`string`?e[t]:``,offset:a}}function setRedactPatternPrefilter(e,t){if(fo.has(e))return;let n=e.source,r=e.exec,i=e instanceof RegExp?e.flags:void 0,a=e instanceof RegExp?e[Symbol.replace]:void 0;fo.set(e,s=>e.source!==n||e.exec!==r||e instanceof RegExp&&(e.flags!==i||e[Symbol.replace]!==a)||t(s))}function selectSecretCapture(e,t){let n={index:-1,value:e};for(let e=0;e<t.length;e++){let r=t[e];typeof r==`string`&&r.length>0&&(n.index=e,n.value=r)}return n}function getSecretCaptureStart(e,t,n,r,i){let a=i.index;if(!(e instanceof RegExp)||r<0||!t)return n.lastIndexOf(i.value);let s=po.get(e);s||(s=new RegExp(e.source,`${e.flags.replace(`d`,``).replace(`g`,``)}dg`),po.set(e,s)),s.lastIndex=r;let c=s.exec(t),l=c?.indices?.[a+1];return c?.index===r&&c[0]===n&&l?l[0]-r:n.lastIndexOf(i.value)}function visitRedactMatches(e,t,n){if(fo.get(t)?.(e)===!1)return;if(!(t instanceof RegExp)){for(let r of t.exec(e))n(r,t);return}let r=t.global?t:mo.get(t);r||(r=new RegExp(t.source,`${t.flags}g`),mo.set(t,r));let i=r.unicode||r.flags.includes(`v`),a=0;for(;a<=e.length;){let s=r.lastIndex,c;try{r.lastIndex=a,c=r.exec(e)}finally{r.lastIndex=s}if(!c)return;if(a=c.index+c[0].length,!c[0]){let t=e.codePointAt(a);a+=i&&t!==void 0&&t>65535?2:1}n({match:c[0],groups:c.slice(1).map(e=>e??``),input:e,offset:c.index},t)}}function replaceRedactPattern(e,t,n,r){if(t instanceof RegExp)return fo.get(t)?.(e)===!1?(t.lastIndex=0,e):e.replace(t,r??((...e)=>n(readRedactMatch(e))));let i=[],a=0;return visitRedactMatches(e,t,t=>{i.push(e.slice(a,t.offset),n(t)),a=t.offset+t.match.length}),i.length?i.join(``)+e.slice(a):e}function redactPemBlock(e,t){let n=e.split(/\r?\n/).filter(Boolean);return n.length<2?`***`:`${n[0]}\n${t}\n${n[n.length-1]}`}var so,co,lo,uo,escapeHexValue,isHighSurrogateEscape,isLowSurrogateEscape,fo,po,mo,ho=__esmMin((()=>{so=/^\{(\d+),\}/,co=/^\{(?:\d+(?:,\d*)?|,\d+)\}/,lo=/[0-9A-Fa-f]/,uo=/* @__PURE__ */ new Set([`b`,`B`]),escapeHexValue=(e,t)=>{let n=0;for(let r=0;r<4;r+=1){let i=e[t+r];if(i===void 0||!lo.test(i))return null;n=n*16+Number.parseInt(i,16)}return n},isHighSurrogateEscape=(e,t)=>{let n=escapeHexValue(e,t+2);return n!==null&&n>=55296&&n<=56319},isLowSurrogateEscape=(e,t)=>{let n=escapeHexValue(e,t+2);return n!==null&&n>=56320&&n<=57343},fo=/* @__PURE__ */ new WeakMap,po=/* @__PURE__ */ new WeakMap,mo=/* @__PURE__ */ new WeakMap}));function stringBoundaries(e,t,n){let r=/* @__PURE__ */ new Map,i=0;for(let a=t;a<n;i+=1)r.set(a,i),a+=e[a]===`\\`?e[a+1]===`u`?6:2:1;return r.set(n,i),r}function decodedBoundary(e,t,n){return t.escaped?(t.boundaries??=stringBoundaries(e,t.start+1,t.end-1),t.boundaries.get(n)):n-t.start-1}function encodedBoundary(e,t,n){if(!t.escaped)return t.start+1+n;if(!t.encodedBoundaries){t.boundaries??=stringBoundaries(e,t.start+1,t.end-1),t.encodedBoundaries=[];for(let[e,n]of t.boundaries)t.encodedBoundaries[n]=e}return expectDefined(t.encodedBoundaries[n],`decoded JSON edit boundary`)}function projectMessageEdits(e,t,n,r){let i=new Map(n.parts.map(e=>[e.key,e])),a=[];for(let s of t){if(!s.isKey&&s.path.length===1&&s.key===`message`)continue;let t=s.rootKey===void 0?void 0:i.get(s.rootKey);if(!t||!t.json&&(s.isKey||(t.messageField?s.path.length!==2||s.key!==`message`:s.path.length!==1)))continue;let c=r(s);for(let r of c){let i,c,l=r.replacement;if(t.json){let n=t.start-expectDefined(s.rootValueStart,`displayed JSON argument`);s.string?(i=n+encodedBoundary(e,s,r.start),c=n+encodedBoundary(e,s,r.end),l=JSON.stringify(l).slice(1,-1)):(i=n+s.start,c=n+s.end,l=JSON.stringify(l))}else i=t.start+r.start,c=t.start+r.end;i<n.contentLength&&a.push({start:i,end:Math.min(c,n.contentLength),replacement:l,scalar:t.json&&!s.string})}}return a.toSorted((e,t)=>e.start-t.start||e.end-t.end)}function firstIntersectingToken(e,t){let n=0,r=e.length;for(;n<r;){let i=n+r>>>1;expectDefined(e[i],`bounded JSON token search`).currentEnd<=t?n=i+1:r=i}return n}function updateCurrentToken(e,t){if(t.raw||t.deferEncoding){t.currentRaw=t.currentValue;return}let n=[],r=[],i=t.start+ +!!t.string,a=0,s=0;for(let c of t.edits){let l=t.string?encodedBoundary(e,t,c.start):t.start+c.start,u=t.string?encodedBoundary(e,t,c.end):t.start+c.end,d=JSON.stringify(c.replacement).slice(1,-1),f=a+l-i,p=f+d.length;r.push({start:f,end:p,decodedStart:c.start+s,decodedEnd:c.start+s+c.replacement.length,sourceEnd:u,sourceDecodedEnd:c.end,replacement:d}),n.push(e.slice(i,l),d),a=p,s+=c.replacement.length-(c.end-c.start),i=u}n.push(e.slice(i,t.end-+!!t.string)),t.currentRaw=`"${n.join(``)}"`,t.encodedEdits=r}function currentDecodedBoundary(e,t,n,r){let i=n-t.currentStart-1,a=t.encodedEdits;if(!a)return decodedBoundary(e,t,t.start+1+i);let s=0,c=a.length;for(;s<c;){let e=s+c>>>1;expectDefined(a[e],`current encoded edit`).end<i?s=e+1:c=e}let l=a[s];if(l&&i>=l.start){let e=i-l.start;if(!l.replacement.includes(`\\`))return l.decodedStart+e;let t=r.get(l.replacement);t||(t=stringBoundaries(l.replacement,0,l.replacement.length),r.set(l.replacement,t));let n=t.get(e);return n===void 0?void 0:l.decodedStart+n}let u=a[s-1],d=decodedBoundary(e,t,i+(u?u.sourceEnd-u.end:t.start+1));return d===void 0?void 0:d+(u?u.decodedEnd-u.sourceDecodedEnd:0)}function commitPatternEdits(e){let t=e.pending;if(e.pending=void 0,!t)return!1;let n=mergeRedactionEdits(t),r=applyRedactionEdits(e.currentValue,n);return r!==e.currentValue&&(e.edits=composeRedactionEdits(e.value.length,e.edits,n),e.currentValue=r,!0)}function changedRedactionEdits(e,t){let n=0;return t.filter(t=>{for(;e[n]&&expectDefined(e[n],`previous configured edit`).start<t.start;)n+=1;let r=e[n];return!r||r.start!==t.start||r.end!==t.end||r.replacement!==t.replacement})}function commitOriginalEdits(e,t){if(t.length===0)return!1;let n=mergeRedactionEdits([...e.edits,...t]),r=applyRedactionEdits(e.value,n);return r!==e.currentValue&&(e.edits=n,e.currentValue=r,!0)}function updateCurrentRecord(e,t,n,r){let i=[],a=0,s=0;for(let c of n){let n=c.currentStart,l=c.currentEnd;if(r.has(c)){updateCurrentToken(e,c);let r=expectDefined(c.currentRaw,`changed JSON token`);i.push(t.slice(a,n),r),a=l,c.currentStart=n+s,s+=r.length-(l-n)}else c.currentStart=n+s;c.currentEnd=l+s}return i.push(t.slice(a)),i.join(``)}function projectedStringEnd(e,t,n,r,i,a){let s=new Set(n.parts.filter(e=>e.json).map(e=>e.key)),c=projectMessageEdits(e,t,n,e=>e.string&&!e.isKey&&e.rootKey!==void 0&&s.has(e.rootKey)?[{start:0,end:e.value.length,replacement:``}]:[]).filter(e=>e.end<n.contentLength),l=rebaseRedactionEdits(r.edits,c).filter(e=>e.start<=i&&i<e.end&&a<=e.end);return l.length===1?expectDefined(l[0],`displayed source string`).end:r.currentValue.length}function redactJsonRecord(e,t,n,r,i,a,s,c,l,u){let d=u?[]:readScalarTokens(e,t),f=l?d.find(e=>!e.isKey&&e.path.length===1&&e.key===`message`):void 0,p=/* @__PURE__ */ new Map,m=[],h=f?.value??``,g=e,_=/* @__PURE__ */ new Set;for(let e of d)commitOriginalEdits(e,s(e))&&_.add(e);_.size>0&&(g=updateCurrentRecord(e,g,d,_));let v=d.filter(e=>!e.isKey&&e.string&&!c(e,e.currentValue)),projectMessage=()=>{if(!f||!l)return!1;let t=projectMessageEdits(e,d,l,e=>{let t=changedRedactionEdits(e.projectedEdits,e.edits);return e.projectedEdits=e.edits,t});if(t.length===0)return!1;let n=rebaseRedactionEdits(m,t),r=rebaseRedactionEdits(f.edits,t),i=0;for(let e=0;e<r.length;e+=1){let a=expectDefined(r[e],`projected message edit`),s=expectDefined(n[e],`projected source edit`),c=expectDefined(t[e],`source projection`);for(;f.edits[i]&&expectDefined(f.edits[i],`generated message span`).start<c.start;)i+=1;let l=f.edits[i],u=c.scalar&&l?.start===c.start&&l.end===c.end&&a.replacement===JSON.stringify(l.replacement),d=f.currentValue.slice(a.start,a.end);!u&&d!==a.replacement&&d!==h.slice(s.start,s.end)&&(a.replacement=c.scalar?JSON.stringify(`***`):`***`)}return f.pending=r,h=applyRedactionEdits(h,n),m=composeRedactionEdits(f.value.length,m,n),commitPatternEdits(f)};for(let[s,c]of n.entries()){let n=/* @__PURE__ */ new Set,m=/* @__PURE__ */ new Set,add=(e,t)=>{(e.pending??=[]).push(t),m.add(e)},h,visitDecodedMatch=(e,t)=>{let n=r(e,t),i=n?.redact(n);i&&i.end>=i.start&&add(h,i)};for(let i of c)if(!i.couldMatch||i.couldMatch(g))for(let a of i.patterns){if(s===0)for(h of v)visitRedactMatches(h.currentValue,a,visitDecodedMatch);else visitRedactMatches(g,a,n=>{let i=r(n,a);if(!(!i||i.end<i.start)){u&&d.length===0&&(d=readBatchTokens(e,t,u.preserveLines));for(let t=firstIntersectingToken(d,i.start);t<d.length;t+=1){let n=expectDefined(d[t],`serialized capture token`);if(n.currentStart>=i.end)break;let r=n.raw||n.deferEncoding,a=+!r,s=i.start>=n.currentStart+a&&i.end<=n.currentEnd-a;if(u&&n.isKey&&!s)continue;let c=n.currentValue;if(!n.raw&&!n.string&&n.edits.length===0){add(n,{start:0,end:c.length,replacement:`***`});continue}let m=Math.max(i.start,n.currentStart+a),h=r?m-n.currentStart:currentDecodedBoundary(e,n,m,p),_=Math.min(i.end,n.currentEnd-a),v=r?_-n.currentStart:currentDecodedBoundary(e,n,_,p);if(h===void 0||v===void 0){for(;h===void 0;)h=currentDecodedBoundary(e,n,--m,p);for(;v===void 0;)v=currentDecodedBoundary(e,n,++_,p);let t=n===f&&l?projectedStringEnd(e,d,l,n,h,v):c.length;add(n,{start:h,end:t,replacement:`***`});continue}if(v<h||u&&v===h)continue;let{start:y,end:b}=i,x=i.redact({start:h,end:v,value:g.slice(Math.max(y,n.currentStart+a),Math.min(b,n.currentEnd-a))});if(!x)continue;let S=`***`;if(s)try{S=r?x.replacement:JSON.parse(`"${x.replacement}"`)}catch{}add(n,{...x,replacement:S})}}});if(m.size!==0){for(let e of m)commitPatternEdits(e)?s===0&&n.add(e):m.delete(e);s!==0&&m.size>0&&(g=updateCurrentRecord(e,g,d,m)),m.clear()}}for(let e of d)s===0?(e.pending=i(e,e.currentValue),commitPatternEdits(e)&&n.add(e)):commitOriginalEdits(e,a(e))&&n.add(e);(s!==0||_.size>0||n.size>0)&&projectMessage()&&f&&n.add(f),n.size>0&&(g=updateCurrentRecord(e,g,d,n))}if(f&&l){let e=l.finish(f.currentValue);if(e!==f.currentValue)return applyRedactionEdits(g,[{start:f.currentStart,end:f.currentEnd,replacement:JSON.stringify(e)}])}return applyRedactionEdits(g,d.flatMap(e=>e.deferEncoding&&e.edits.length>0?[{start:e.currentStart,end:e.currentEnd,replacement:JSON.stringify(e.currentValue)}]:[]))}var go=__esmMin((()=>{Xn(),io(),oo(),ho()}));function createState(){return{scanner:{offset:0,phase:`search`,dashes:0,keyword:`BEGIN `,keywordOffset:0,start:0,suffix:``},matchEnd:0}}function resetScanner(e,t){e.phase=`search`,e.dashes=+(t===`-`),e.suffix=``}function*readDelimiters(e,t){for(let n=0;n<e.length;n+=1){if(t.phase===`search`&&t.dashes===0){let r=e.indexOf(`-`,n);if(r===-1){t.offset+=e.length-n;return}t.offset+=r-n,n=r}let r=e.charCodeAt(n),i=r>=97&&r<=122?String.fromCharCode(r-32):e.charAt(n),a=t.offset++;switch(t.phase){case`search`:i===`-`?t.dashes=Math.min(5,t.dashes+1):t.dashes===5&&(i===`B`||i===`E`)?(t.phase=`keyword`,t.keyword=i===`B`?`BEGIN `:`END `,t.keywordOffset=1,t.start=a-5):t.dashes=0;break;case`keyword`:i===t.keyword.charAt(t.keywordOffset)?++t.keywordOffset===t.keyword.length&&(t.phase=`label`,t.suffix=``):resetScanner(t,i);break;case`label`:i>=`A`&&i<=`Z`||i===` `?t.suffix=(t.suffix+i).slice(-11):i===`-`&&t.suffix===`PRIVATE KEY`?(t.phase=`close`,t.dashes=1):resetScanner(t,i);break;case`close`:i===`-`?++t.dashes===5&&(t.phase=`search`,t.suffix=``,yield{kind:t.keyword===`BEGIN `?`begin`:`end`,start:t.start,end:a+1}):resetScanner(t,i)}}}function consumeDelimiter(e,t){if(!e.open){t.kind===`begin`&&t.start>=e.matchEnd&&(e.open={start:t.start,end:t.end});return}if(t.kind!==`end`||t.start<=e.open.end)return;let n={start:e.open.start,end:t.end,bodyStart:e.open.end,bodyEnd:t.start};return e.open=void 0,e.matchEnd=t.end,n}function*matchPem(e,t,n){let r={...t,scanner:{...t.scanner},open:t.open&&{...t.open}},i=r.scanner.offset;for(let t of readDelimiters(e,r.scanner)){let a=consumeDelimiter(r,t);if(!a)continue;let s=Math.max(0,(n?a.bodyStart:a.start)-i),c=(n?a.bodyEnd:a.end)-i;c<=s||(yield{match:e.slice(s,c),groups:[],input:e,offset:s,...n?{replacement:`…redacted…`}:{}})}if(n&&r.open){let t=Math.max(0,r.open.end-i);t<e.length&&(yield{match:e.slice(t),groups:[],input:e,offset:t,replacement:`…redacted…`})}}var _o,vo,yo=__esmMin((()=>{_o=String.raw`-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----`,vo={source:_o,exec(e){return matchPem(e,createState(),!1)},createContext(){let e=!1,t=!0;return{resolve(n){e=n?t:e,t=e},advance(t){let n=createState();e&&(n.open={start:-1,end:-1});for(let e of readDelimiters(t,n.scanner))consumeDelimiter(n,e);return n.open!==void 0},prepend(){let n=createState(),r=createState();return r.open={start:-1,end:-1},{consume(e){for(let t of readDelimiters(e,n.scanner))consumeDelimiter(n,t),consumeDelimiter(r,t)},finish(){let i=n.open?t:e,a=r.open?t:e;return e=i,t=a,e===t}}},pattern:{source:_o,exec(t){let n=createState();return e&&(n.open={start:-1,end:-1}),matchPem(t,n,!0)}}}}}}));function isAwsValueCharacter(e){let t=e.charCodeAt(0);return t>=65&&t<=90||t>=97&&t<=122||t>=48&&t<=57||e===`/`||e===`+`||e===`=`}function couldMatchAwsSecretAccessKey(e){for(let t=39;t<e.length;){let n=t;for(;n>t-40&&isAwsValueCharacter(e[n]);)n--;if(n===t-40)return Yo.test(e);t=n+40}return!1}function*matchAwsSecretAccessKeys(e){if(!couldMatchAwsSecretAccessKey(e))return;let t={'"':`"`,"'":`'`,"`":"`","<":`>`,"(":`)`,"[":`]`,"{":`}`},n=-1,r=-1,i,a=0,s=[];for(let c=0;c<=e.length;c++){let l=e[c]??``,u=c===e.length||Xo.test(l),d=a;if(a=l===`\\`?a+1:0,l&&isAwsValueCharacter(l)?n===-1&&(n=c):n!==-1&&(c-n===40?s.push({start:n,end:c,origin:n,url:i}):c-n>40&&l===`@`&&e[c-41]===`/`&&s.push({start:c-40,end:c,origin:n,url:i}),n=-1),u){i&&(i.end=Math.min(i.end,c));for(let t of s){let n=t.url,r=n&&!n.hasAt&&n.portValid&&(n.portStart===-1||(n.authorityEnd===-1?n.end:n.authorityEnd)>n.portStart+1),i=e[t.start-1]??``,a=e[t.end]??``,s=t.start!==t.origin,c=n&&n.portStart!==-1&&t.origin===n.portStart+1&&n.authorityEnd>t.origin&&t.end>n.authorityEnd&&a===`@`;if(!s&&(i===`_`||isAwsValueCharacter(i))||a===`_`||e.slice(t.origin-8,t.origin)===`;base64,`||r&&!c&&t.start>=n.start&&t.end<=n.end)continue;let l=e.slice(t.start,t.end);Yo.test(l)&&(yield{match:l,groups:[l],input:e,offset:t.start})}s.length=0,r=-1,i=void 0}else if(i&&c>=i.start&&(l===i.closing&&d===i.closingEscapeDepth?(i.end=Math.min(i.end,c),i=void 0):(`?#"'<>\`|()[]{}`.includes(l)&&(i.end=Math.min(i.end,c)),i.queryOrFragment||=l===`?`||l===`#`,i.authorityEnd===-1&&(i.hasAt||=l===`@`,`/?#`.includes(l)?i.authorityEnd=c:c<i.end&&(l===`:`?(i.portValid&&=i.portStart===-1,i.portStart=c):i.portStart!==-1&&(l<`0`||l>`9`)&&(i.portValid=!1))))),Zo.test(l))r===-1&&(r=c);else{if((!i||c>=i.end&&!i.queryOrFragment)&&l===`:`&&e.startsWith(`//`,c+1)&&r!==-1&&Qo.test(e[r])){let n=e[r-1],a=0;for(let t=r-2;t>=0&&e[t]===`\\`;t--)a++;i={start:c+3,end:e.length,authorityEnd:-1,portStart:-1,portValid:!0,hasAt:!1,queryOrFragment:!1,closing:n?t[n]:void 0,closingEscapeDepth:a}}r=-1}}}function*matchBarePassAssignments(e){if(!/pass\s*:/.test(e))return;let t=[...e.matchAll(es)];if(t.length===0)return;let n=0,r=!1;for(let i=0;i<e.length;i++){let a=t[n];if(!a)return;if(i===a.index){n++;let s=e[i-1]??``,c=a[1]!==`pass`||s===`.`||s===`-`||s===`_`;if(c||r||s!==` `||!ns.test(e[i-2]??``)){r=!0;let s=i+a[0].length;if(!c){ts.lastIndex=s;let t=ts.exec(e)?.[0];t&&(s+=t.length,yield{match:e.slice(i,s),groups:[t],input:e,offset:i})}let l=t[n];for(;l&&l.index<s;)n++,l=t[n];i=s-1;continue}}let s=e[i];s===`
`||s===`\r`?r=!1:(s===`=`||s===`:`&&!rs.test(e[i+1]??` `))&&(r=!0)}}function createBackendRedactPatterns(){let e=/* @__PURE__ */ new Set(/* @__PURE__ */ `access_token.auth_token.awssecretaccesskey.aws_secret_access_key.hook_token.refresh_token.id_token.token.api_key.apikey.client_secret.app_secret.password.pass.passwd.auth.jwt.session.code.signature.x_amz_signature.x_amz_security_token.secret.secretaccesskey.credential.private_key.authorization.key.card_number.card_cvc.card_cvv.cvc.cvv.security_code.payment_credential.shared_payment_token`.split(`.`)),t=RegExp(`^(?:${ss}|${cs})$`,`i`),n=/* @__PURE__ */ new Set([ds,ps]),r=/* @__PURE__ */ new Set([No,Po,Fo,Io]),i=new RegExp(String.raw`[:=](?<=(?:${Do})\s*[:=])`),a=new RegExp(String.raw`[:=](?<=(?:${Do})\s*[:=])\s*["'\x60]`),s=new RegExp(String.raw`[:=](?<=\.(?:${Do})\s*[:=])`),c=new RegExp(String.raw`=(?<=(?:^|[\s,;({\["])(?:${Eo})=)`,`i`);return{bodySecretKeys:e,credentialHeaderField:t,formAware:n,shellReferencePreserving:r,prefilters:new Map([[No,e=>/KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD|CVC|CVV|SECURITY|PAYMENT/.test(e)],[Po,e=>e.includes(`\\`)],[Fo,e=>/[=]["'`]/.test(e)],[Io,e=>c.test(e)],[Ro,e=>/["'`]/.test(e)&&a.test(e)],[zo,e=>(e.includes(`:`)||e.includes(`=`))&&i.test(e)],[Bo,e=>e.includes(`=`)],[Vo,e=>/[-_](?:password|passphrase|pass|passwd)\s*[:=]/.test(e)],[Ho,e=>s.test(e)],[Go,e=>/["']/.test(e)],[Ko,e=>/["']/.test(e)],...ms.slice(0,4).map(e=>[e,e=>/authorization/i.test(e)]),[us,e=>/api-key|apikey|api-token|access-token/i.test(e)],[ds,e=>/api-key|apikey|api-token|access-token/i.test(e)],[Uo,e=>e.includes(`"`)],[Wo,e=>e.includes(`"`)],[fs,e=>/x-openclaw-token|x-pomerium-jwt-assertion|x-api-key|x-auth-token/i.test(e)],[ps,e=>/x-openclaw-token|x-pomerium-jwt-assertion|x-api-key|x-auth-token/i.test(e)]]),chunkUnsafe:/* @__PURE__ */ new Set([as,os,hs,gs,_s,vs,...ms,...bs.filter(e=>e.startsWith(qo))])}}var bo,xo,So,Co,wo,To,Eo,Do,Oo,ko,Ao,jo,Mo,No,Po,Fo,Io,Lo,Ro,zo,Bo,Vo,Ho,Uo,Wo,Go,Ko,qo,base64SafeToken,Jo,Yo,Xo,Zo,Qo,$o,es,ts,ns,rs,is,as,os,ss,cs,ls,us,ds,fs,ps,ms,hs,gs,_s,vs,ys,bs,xs,Ss=__esmMin((()=>{qa(),yo(),bo=String.raw`CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN`,xo=String.raw`card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token`,So=String.raw`cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token`,Co=String.raw`aws[-_]?secret[-_]?access[-_]?key|awsSecretAccessKey|SecretAccessKey`,wo=String.raw`access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|id[-_]?token|api[-_]?key|apikey|client[-_]?secret|app[-_]?secret|private[-_]?key|${Co}|credential|authorization|token|key|secret|password|pass|passwd|auth|jwt|session|code|signature|x[-_]?amz[-_]?(?:signature|security[-_]?token)`,To=String.raw`${wo}|app[-_]?secret|credential|${xo}`,Eo=String.raw`access_token|refresh_token|id_token|auth[-_]?token|hook[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|private[-_]?key|authorization|jwt|token|secret|password|pass|passwd|credential|${xo}`,Do=String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|client[-_]?secret|app[-_]?secret|private[-_]?key|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|credential|${xo}`,Oo=String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|client[-_]?secret|app[-_]?secret|private[-_]?key|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|passwd|credential|${xo}`,ko=String.raw`access-token|refresh-token|id-token|auth-token|hook-token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|passphrase`,Ao=String.raw`password|passphrase|pass|passwd`,jo=String.raw`${Co}|api[-_]?key|hook[-_]?token|access[-_]?token|refresh[-_]?token|id[-_]?token|token|secret|password|passwd|credential|private[-_]?key|client[-_]?secret|${xo}`,Mo=`\\p{C}\\u00A0\\u1680\\u2000-\\u200A\\u202F\\u205F\\u3000\\u115F\\u1160\\u3164\\uFFA0`,No=String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${bo})\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g`,Po=String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${bo})\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g`,Fo=String.raw`(^|[\s,;({\["])(?:${Eo})=(["'\x60])((?:(?!\2)[^\r\n])+)\2`,Io=String.raw`(^|[\s,;({\["])(?:${Eo})=(["'\x60]?[^\s&#"'\x60<>]+)`,Lo=String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|${xo}`,Ro=String.raw`/(^|[\s,{])(?:(?:${Lo})(?:\s*:\s*|\s+=\s*|=\s*)|[a-z0-9][a-z0-9._-]{0,79}[-_](?:${Ao})\s*[:=]\s*|[a-z0-9_.-]{1,80}\.(?:${Do})\s*[:=]\s*)(["'\x60])((?:(?!\2)[^\r\n])+)\2/g`,zo=String.raw`/(^|[\s,{])(?:(?:${Oo})\s*:\s*|(?:${Do})(?:\s+=\s*|=\s+))([^\s#"'\x60<>]+)/g`,Bo=String.raw`/(^|[\s,{])(?:${ko})=([^\s#"'\x60<>]+)/g`,Vo=String.raw`/(^|[\s,{])[a-z0-9][a-z0-9._-]{0,79}[-_](?:${Ao})\s*[:=]\s*([^\s#"'\x60<>]+)/g`,Ho=String.raw`/(^|[\s,{])[a-z0-9_.-]{1,80}\.(?:${Do})\s*[:=]\s*([^\s#"'\x60<>]+)/g`,Uo=String.raw`"(?:apiKey|api_key|apiToken|api_token|bearerToken|bearer_token|token|secret|password|passwd|${Co}|credential|authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token|accessToken|access_token|refreshToken|refresh_token|idToken|id_token|authToken|auth_token|clientSecret|client_secret|privateKey|private_key|secret_value|raw_secret|secret_input|key_material)"\s*:\s*"([^"]+)"`,Wo=String.raw`"(?:${So})"\s*:\s*"([^"]+)"`,Go=String.raw`(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|id[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret|private[-_]key|credential|authorization|secret[-_]value|raw[-_]secret|secret[-_]input|key[-_]material)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`,Ko=String.raw`(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`,qo=String.raw`(^|[^A-Za-z0-9])`,base64SafeToken=e=>String.raw`${qo}(?=${e})(?<!;base64,[A-Za-z0-9+/=]*)(${e})`,Jo=String.raw`(^|[^A-Za-z0-9_])`,Yo=/(?=[A-Za-z0-9/+=]{0,39}[A-Z])(?=[A-Za-z0-9/+=]{0,39}[a-z])(?=[A-Za-z0-9/+=]{0,39}[0-9/+=])(?=[A-Za-z0-9/+=]{0,39}[G-Zg-z/+=])[A-Za-z0-9/+=]{40}/u,Xo=/\s/,Zo=/[A-Za-z0-9+.-]/,Qo=/[A-Za-z]/,$o=Object.freeze({source:`aws-secret-access-key`,exec:matchAwsSecretAccessKeys,couldMatch:couldMatchAwsSecretAccessKey}),es=new RegExp(String.raw`(?<![A-Za-z0-9])(pass|${Oo})\s*:\s*`,`gi`),ts=/[^\s#"'\x60<>]+/y,ns=/[A-Za-z0-9]/,rs=/[ \t\r\n]/,is=Object.freeze({source:`bare-pass-assignment`,exec:matchBarePassAssignments}),as=String.raw`\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b`,os=String.raw`\b(\d{6,}:[A-Za-z0-9_-]{20,})\b`,ss=`x-goog-api-key|api-key|apikey|x-api-token|x-access-token`,cs=`X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token`,ls=String.raw`(^|[^A-Za-z0-9_?&-]|\\{1,64}[rn])`,us=String.raw`${ls}(?:${ss})${U}[ \t]*:${Ba}${U}([^\s\\"',;]+)`,ds=String.raw`${ls}(?:${ss})${U}[ \t]*=${Ba}${U}([^\s\\"',;]+)`,fs=String.raw`${ls}(?:${cs})\s*:\s*([^\s"',;]+)`,ps=String.raw`${ls}(?:${cs})\s*=\s*([^\s"',;]+)`,ms=[String.raw`${Ua}Proxy-Authorization${U}[ \t]*[:=]${Ba}${U}${Ia}${Va}(${La})`,String.raw`${Ua}Proxy-Authorization${U}[ \t]*[:=]${Ba}${U}(${La})[ \t]*(?=${U}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,String.raw`${Ua}Authorization${U}[ \t]*[:=]${Ba}${U}(?!(?:Bearer|Basic|Bot)(?=${Va}))${Ia}${Va}(${La})`,String.raw`${Ua}Authorization${U}[ \t]*[:=]${Ba}${U}(?!(?:Bearer|Basic|Bot)(?=${Va}))(${La})[ \t]*(?=${U}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,us,ds],hs=String.raw`Authorization${U}[ \t]*[:=]${Ha}${U}Bearer${Va}(${La})`,gs=String.raw`Authorization${U}[ \t]*[:=]${Ha}${U}Basic${Va}(${La})`,_s=String.raw`Authorization${U}[ \t]*[:=]${Ha}${U}Bot${Va}(${La})`,vs=String.raw`\bBearer\s+([-A-Za-z0-9._~+/=]{18,})(?![-A-Za-z0-9._~+/=])`,ys=[No,Po,Uo,Wo,Go,Ko,String.raw`--(?:${jo})=([^\s"']+)`,String.raw`--(?:${jo})\s+(?!(?:or|and)\b(?=\s+--))(["']?)([^\s"']+)\1`,hs,gs,_s,...ms,fs,ps,vs,String.raw`\b(?:https?|wss?|ftp):\/\/[^\/\s:@]*:([^\/\s@]+)@`,String.raw`\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:\s/@]*:([^@\s]+)@`,String.raw`(^|[\s,;])(?:${To})=([^&\s]+)(?=&[A-Za-z_][A-Za-z0-9_.-]*=)`,Fo,Io,Ro,zo,is,Bo,Vo,Ho,_o,String.raw`(^|[\s,{])["']?(?:${Co})["']?\s*[:=]\s*(["']?)([A-Za-z0-9/+=]{40})(?![A-Za-z0-9/+=])\2`],bs=[String.raw`\b(sk-[A-Za-z0-9_-]{8,})\b`,String.raw`(ghp_[A-Za-z0-9]{10,})`,String.raw`(github_pat_[A-Za-z0-9_]{10,})`,String.raw`(gho_[A-Za-z0-9]{10,})`,String.raw`(ghu_[A-Za-z0-9]{10,})`,String.raw`(ghs_[A-Za-z0-9]{10,})`,String.raw`(ghr_[A-Za-z0-9]{10,})`,String.raw`(glpat-[A-Za-z0-9._=\-]{20,})`,String.raw`(gloas-(?:[A-Fa-f0-9]{65,}|[A-Za-z0-9_-]{64}|[A-Fa-f0-9]{32,}))`,String.raw`(gldt-[A-Za-z0-9_-]{20,})`,String.raw`(glcbt-[A-Za-z0-9]{1,5}_[A-Za-z0-9_-]{20,})`,String.raw`(glptt-[A-Za-z0-9_-]{40,})`,String.raw`(glft-(?:[A-Za-z0-9_-]{20,}|[a-h0-9]+-[0-9]+_))`,String.raw`(glimt-[A-Za-z0-9_-]{25,})`,String.raw`(glagent-[A-Za-z0-9_-]{50,})`,String.raw`(glwt-[A-Za-z0-9_-]{20,})`,String.raw`(glsoat-[A-Za-z0-9_-]{20,})`,String.raw`(glffct-[A-Za-z0-9_-]{20,})`,String.raw`(glrt-[A-Za-z0-9._-]{20,})`,String.raw`(glrtr?-[A-Za-z0-9_-]{27,300}\.[0-9a-z]{2}\.[0-9a-z]{9})`,String.raw`(GR1348941[A-Za-z0-9_-]{20,})`,String.raw`(_gitlab_session=[A-Za-z0-9%._-]{20,})`,String.raw`(xox[baprs]-[A-Za-z0-9-]{10,})`,String.raw`(xapp-[A-Za-z0-9-]{10,})`,String.raw`(https:\/\/hooks\.slack\.com\/(?:services\/T[A-Z0-9]+\/B[A-Z0-9]+|workflows\/T[A-Z0-9]+\/A[A-Z0-9]+\/[0-9]{17,19})\/[A-Za-z0-9]{20,})`,String.raw`(https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]{17,20}\/[A-Za-z0-9_-]{60,})`,String.raw`discord(?:.|\n|\r){0,40}?\b([A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27})\b`,String.raw`(gsk_[A-Za-z0-9_-]{10,})`,String.raw`(AIza[0-9A-Za-z\-_]{20,})`,String.raw`(ya29\.[0-9A-Za-z_\-./+=]{10,})`,String.raw`(1//0[0-9A-Za-z_\-./+=]{10,})`,String.raw`(GOCSPX-[A-Za-z0-9_-]{20,})`,String.raw`(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,String.raw`(pplx-[A-Za-z0-9_-]{10,})`,String.raw`(fal_[A-Za-z0-9_-]{10,})`,String.raw`${Jo}(fc-[A-Za-z0-9]{10,})`,String.raw`(bb_live_[A-Za-z0-9_-]{10,})`,base64SafeToken(String.raw`gAAAA[A-Za-z0-9_=-]{20,}`),String.raw`(sk_live_[A-Za-z0-9]{10,})`,String.raw`(sk_test_[A-Za-z0-9]{10,})`,String.raw`(rk_live_[A-Za-z0-9]{10,})`,String.raw`(SG\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,String.raw`(npm_[A-Za-z0-9]{10,})`,String.raw`(pypi-[A-Za-z0-9_-]{10,})`,String.raw`(dop_v1_[A-Za-z0-9]{10,})`,String.raw`(doo_v1_[A-Za-z0-9]{10,})`,String.raw`(dor_v1_[A-Za-z0-9]{10,})`,String.raw`(dp\.(?:ct|pt|sa|scim|audit)\.[A-Za-z0-9]{40,44})`,String.raw`(dp\.st\.[A-Za-z0-9]{40,44})`,String.raw`(dp\.st\.[a-z0-9_-]{2,35}\.[A-Za-z0-9]{40,44})`,String.raw`(dckr_(?:pat|oat)_[A-Za-z0-9_-]{27,32})`,String.raw`(bkua_[a-z0-9]{40})`,String.raw`(CCIPAT_[A-Za-z0-9]{22}_[A-Fa-f0-9]{40})`,String.raw`(sbp_[a-z0-9]{40})`,base64SafeToken(String.raw`dapi[0-9a-f]{32}(?:-\d)?`),String.raw`(dd[pw]_[A-Za-z0-9]{36})`,String.raw`(glsa_[A-Za-z0-9_]{41})`,String.raw`(glc_eyJ[A-Za-z0-9+/=]{60,160})`,String.raw`(nfp_[A-Za-z0-9_]{36})`,String.raw`(CFPAT-[A-Za-z0-9_\-]{40,})`,base64SafeToken(String.raw`ATCTT3xFfG[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`),base64SafeToken(String.raw`ATATT[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`),base64SafeToken(String.raw`ATBB[A-Za-z0-9_=.-]{16,}`),String.raw`(BBDC-[A-Za-z0-9+/@_-]{40,50})`,String.raw`(HRKU-AA[A-Za-z0-9_-]{20,})`,String.raw`(pat-(?:eu|na)1-[A-Za-z0-9]{8}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{12})`,String.raw`(apify_api_[A-Za-z0-9\-]{20,})`,String.raw`(FlyV1 fm\d+_[A-Za-z0-9+/=,_-]{100,})`,String.raw`(fio-u-[A-Za-z0-9_-]{40,})`,String.raw`(^|[^A-Za-z0-9_])(am_[A-Za-z0-9_-]{10,})`,String.raw`(^|[^A-Za-z0-9_])(sk_[A-Za-z0-9_]{10,})`,String.raw`(tvly-[A-Za-z0-9]{10,})`,String.raw`(exa_[A-Za-z0-9]{10,})`,String.raw`(syt_[A-Za-z0-9]{10,})`,String.raw`(retaindb_[A-Za-z0-9]{10,})`,String.raw`(hsk-[A-Za-z0-9]{10,})`,String.raw`(mem0_[A-Za-z0-9]{10,})`,String.raw`(brv_[A-Za-z0-9]{10,})`,String.raw`(xai-[A-Za-z0-9]{30,})`,String.raw`${Jo}(fw-[A-Za-z0-9]{30,})`,String.raw`${Jo}(fw_[A-Za-z0-9]{30,})`,String.raw`${Jo}(fpk_[A-Za-z0-9]{30,})`,base64SafeToken(String.raw`AKIA[A-Z0-9]{16}`),base64SafeToken(String.raw`ASIA[A-Z0-9]{16}`),String.raw`(AKID[A-Za-z0-9]{10,})`,String.raw`(LTAI[A-Za-z0-9]{10,})`,String.raw`(hf_[A-Za-z0-9]{10,})`,String.raw`(api_org_[A-Za-z0-9]{20,})`,String.raw`(r8_[A-Za-z0-9]{10,})`,as,os],xs=[...ys,...bs,$o]}));function isJsWhitespaceAt(e,t){if(t>=e.length)return!1;let n=e.charCodeAt(t);return Cs.has(n)||n>=8192&&n<=8202}function isJsWhitespaceChar(e){return e!==void 0&&isJsWhitespaceAt(e,0)}function isAlnumChar(e){if(e===void 0)return!1;let t=e.charCodeAt(0);return t>=48&&t<=57||t>=65&&t<=90||t>=97&&t<=122}function isLetterChar(e){if(e===void 0)return!1;let t=e.charCodeAt(0);return t>=65&&t<=90||t>=97&&t<=122}function isWordChar(e){return e===`_`||isAlnumChar(e)}function isHexChar(e){if(e===void 0)return!1;let t=e.charCodeAt(0);return t>=48&&t<=57||t>=65&&t<=70||t>=97&&t<=102}function isDigitChar(e){return e!==void 0&&e.charCodeAt(0)>=48&&e.charCodeAt(0)<=57}function isBase64UrlChar(e){return isAlnumChar(e)||e===`+`||e===`/`||e===`=`}function*scanPrefixOccurrences(e,t){let n=ws.get(t);n||(n=[],ws.set(t,n));let r=n.pop()??new RegExp(t,`gi`);try{r.lastIndex=0;for(let t=r.exec(e);t;t=r.exec(e))yield t.index}finally{r.lastIndex=0,n.push(r)}}function isDataUrlPrefix(e,t){return t>=8&&e.slice(t-8,t).toLowerCase()===`;base64,`}function runEndOf(e,t,n){let r=t;for(;r<e.length&&n(e[r]);)r+=1;return r}function makeCachedRunEnd(e,t){let n=-1,r=-1;return i=>((i<n||i>=r)&&(n=i,r=runEndOf(e,i,t)),r)}function makeBase64SafeTokenMatcher(e,t,n){function*exec(e){let r=n(),i=-1,a=-1,s=0;for(let n of scanPrefixOccurrences(e,t)){if(n<s||n>0&&isAlnumChar(e[n-1]))continue;if(n>0){let t;if(isBase64UrlChar(e[n-1])){if(n-1>=i&&n-1<a)t=i;else{let r=n-1;for(;r>0&&isBase64UrlChar(e[r-1]);)--r;i=r,a=runEndOf(e,n,isBase64UrlChar),t=r}}else t=n;if(isDataUrlPrefix(e,t))continue}let t=r(e,n);if(t===null)continue;let c=n>0?n-1:0;yield{match:e.slice(c,t),groups:[n>0?e[n-1]:``,e.slice(n,t)],input:e,offset:c},s=t+1}}return Object.freeze({source:e,exec})}function fixedTailTokenEnd(e,t,n){return(r,i)=>{let a=i+e+t;for(let t=i+e;t<a;t++)if(!n(r[t]))return null;return a}}function dapiTokenEnd(e,t){let n=Ts(e,t);return n===null?null:e[n]===`-`&&isDigitChar(e[n+1])?n+2:n}function makeAtEqualsTokenMatcher(e,t){let n=t.length,r=fixedTailTokenEnd(1,8,isAlnumChar);return makeBase64SafeTokenMatcher(e,t,()=>{let e=-1,t=-1,i;return(a,s)=>{let c=s+n;if(c<e||c>=t){t=runEndOf(a,c,AT_VALUE_CHAR),e=c,i=void 0;for(let e=c;e<t;e++)a[e]===`=`&&r(a,e)!==null&&(i=e)}let l=c+1;return i!==void 0&&i>=l?i+9:null}})}function makeUserInfoMatcher(e,t,n){function*exec(e){let r=0,i=-1,a=e.indexOf(`://`);for(;a!==-1;){let s=a;for(;s>0&&isWordChar(e[s-1]);)--s;let c=e.slice(s,a).toLowerCase(),l=s;if(!t.has(c)&&s>=8&&c===`srv`&&e.slice(s-8,s).toLowerCase()===`mongodb+`&&(c=`mongodb+srv`,l=s-8),a>=r&&t.has(c)&&(l===0||!isWordChar(e[l-1]))){let t=a+3;for(;t<e.length&&e[t]!==`:`&&e[t]!==`/`&&e[t]!==`@`&&!isJsWhitespaceAt(e,t);)t+=1;if(e[t]===`:`){let s=t+1;if(s>=i){let t=runEndOf(e,s,e=>!n(e));if(e[t]===`@`&&t>s){yield{match:e.slice(l,t+1),groups:[e.slice(s,t)],input:e,offset:l},r=t+1,a=e.indexOf(`://`,t+1);continue}i=t}}}a=e.indexOf(`://`,a+1)}}return Object.freeze({source:e,exec})}function isFormPairBoundary(e,t){let n=e[t+1];return n===void 0||!isLetterChar(n)&&n!==`_`?!1:e[runEndOf(e,t+2,FORM_FIRST_PAIR_TAIL_CHAR)]===`=`}function makeQuotedAssignmentMatcher(e,t,n){let r=[];function*exec(e){let i=r.pop()??new RegExp(t,n),a=/* @__PURE__ */ new Map,s=0;try{for(;;){i.lastIndex=s;let t=i.exec(e);if(!t)return;let n=t.index,r=t[2],c=n+t[0].length,l=a.get(r),u=-1;if(!(l!==void 0&&c>=l.start&&c<l.end))for(u=c;u<e.length;){let t=e[u];if(t===r||t===`\r`||t===`
`)break;u+=1}if(u>c&&e[u]===r){let i=u+1;yield{match:e.slice(n,i),groups:[t[1]??``,r,e.slice(c,u)],input:e,offset:n},s=i}else u!==-1&&a.set(r,{start:c,end:u}),s=n+1}}finally{i.lastIndex=0,r.push(i)}}return Object.freeze({source:e,exec})}var Cs,ws,GAAAA_VALUE_CHAR,ATBB_VALUE_CHAR,AT_VALUE_CHAR,Ts,Es,Ds,Os,ks,As,js,Ms,Ns,JWT_SEGMENT_CHAR,Ps,Fs,Is,Ls,Rs,zs,Bs,Vs,Hs,FORM_FIRST_PAIR_KEY_CHAR,FORM_FIRST_PAIR_TAIL_CHAR,Us,Ws,Gs,Ks,qs,Js,Ys=__esmMin((()=>{Ss(),Cs=/* @__PURE__ */ new Set([9,10,11,12,13,32,160,5760,8232,8233,8239,8287,12288,65279]),ws=/* @__PURE__ */ new Map,GAAAA_VALUE_CHAR=e=>isAlnumChar(e)||e===`_`||e===`=`||e===`-`,ATBB_VALUE_CHAR=e=>isAlnumChar(e)||e===`_`||e===`=`||e===`.`||e===`-`,AT_VALUE_CHAR=e=>isAlnumChar(e)||e===`+`||e===`/`||e===`=`||e===`-`||e===`_`,Ts=fixedTailTokenEnd(4,32,isHexChar),Es=makeBase64SafeTokenMatcher(`vendor-token gAAAA (linear)`,`gAAAA`,()=>(e,t)=>{let n=runEndOf(e,t+5,GAAAA_VALUE_CHAR);return n-(t+5)>=20?n:null}),Ds=makeBase64SafeTokenMatcher(`vendor-token ATBB (linear)`,`ATBB`,()=>(e,t)=>{let n=runEndOf(e,t+4,ATBB_VALUE_CHAR);return n-(t+4)>=16?n:null}),Os=makeBase64SafeTokenMatcher(`vendor-token AKIA (linear)`,`AKIA`,()=>fixedTailTokenEnd(4,16,isAlnumChar)),ks=makeBase64SafeTokenMatcher(`vendor-token ASIA (linear)`,`ASIA`,()=>fixedTailTokenEnd(4,16,isAlnumChar)),As=makeBase64SafeTokenMatcher(`vendor-token dapi (linear)`,`dapi`,()=>dapiTokenEnd),js=makeAtEqualsTokenMatcher(`vendor-token ATCTT3xFfG (linear)`,`ATCTT3xFfG`),Ms=makeAtEqualsTokenMatcher(`vendor-token ATATT (linear)`,`ATATT`),Ns=String.raw`(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,JWT_SEGMENT_CHAR=e=>isAlnumChar(e)||e===`_`||e===`-`,Ps=Object.freeze({source:`jwt (linear)`,*exec(e){let t=makeCachedRunEnd(e,JWT_SEGMENT_CHAR),n=makeCachedRunEnd(e,JWT_SEGMENT_CHAR),r=makeCachedRunEnd(e,JWT_SEGMENT_CHAR),i=0;for(let a of scanPrefixOccurrences(e,`eyj`)){if(a<i)continue;let s=t(a+3);if(s-(a+3)<10||e[s]!==`.`)continue;let c=n(s+1);if(c-(s+1)<10||e[c]!==`.`)continue;let l=r(c+1);if(l-(c+1)<10)continue;let u=e.slice(a,l);yield{match:u,groups:[u],input:e,offset:a},i=l}}}),Fs=String.raw`\b(?:https?|wss?|ftp):\/\/[^\/\s:@]*:([^\/\s@]+)@`,Is=String.raw`\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:\s/@]*:([^@\s]+)@`,Ls=/* @__PURE__ */ new Set([`http`,`https`,`ws`,`wss`,`ftp`]),Rs=/* @__PURE__ */ new Set([`postgres`,`postgresql`,`mysql`,`mongodb`,`mongodb+srv`,`redis`,`rediss`,`amqp`,`amqps`]),zs=makeUserInfoMatcher(`url-userinfo (linear)`,Ls,e=>e===`/`||e===`@`||isJsWhitespaceChar(e)),Bs=makeUserInfoMatcher(`connection-string (linear)`,Rs,e=>e===`@`||isJsWhitespaceChar(e)),Vs=String.raw`(^|[\s,;])(?:${To})=([^&\s]+)(?=&[A-Za-z_][A-Za-z0-9_.-]*=)`,Hs=RegExp(`^(?:${To})$`,`i`),FORM_FIRST_PAIR_KEY_CHAR=e=>isAlnumChar(e)||e===`-`||e===`_`,FORM_FIRST_PAIR_TAIL_CHAR=e=>isAlnumChar(e)||e===`_`||e===`.`||e===`-`,Us=Object.freeze({source:`form-body-first-pair (linear)`,*exec(e){let t=makeCachedRunEnd(e,e=>e!==`&`&&!isJsWhitespaceChar(e)),n=0,r=e.indexOf(`=`);for(;r!==-1;){let i=r;for(;i>0&&FORM_FIRST_PAIR_KEY_CHAR(e[i-1]);)--i;let a=e.slice(i,r);if(r>=n&&a.length>0&&Hs.test(a)&&(i===0||e[i-1]===`,`||e[i-1]===`;`||isJsWhitespaceAt(e,i-1))){let a=r+1,s=t(a);if(s>a&&s<e.length&&e[s]===`&`&&isFormPairBoundary(e,s)){let t=i>0?i-1:0;yield{match:e.slice(t,s),groups:[i>0?e[i-1]:``,e.slice(a,s)],input:e,offset:t},n=s,r=e.indexOf(`=`,s);continue}}r=e.indexOf(`=`,r+1)}}}),Ws=String.raw`(^|[\s,;({\["])(?:${Eo})=(["'\x60])`,Gs=String.raw`(^|[\s,{])(?:(?:${Lo})(?:\s*:\s*|\s+=\s*|=\s*)|[a-z0-9][a-z0-9._-]{0,79}[-_](?:${Ao})\s*[:=]\s*|[a-z0-9_.-]{1,80}\.(?:${Do})\s*[:=]\s*)(["'\x60])`,Ks=makeQuotedAssignmentMatcher(`standalone-quoted-assignment (linear)`,Ws,`gi`),qs=makeQuotedAssignmentMatcher(`config-quoted-assignment (linear)`,Gs,`g`),Js=/* @__PURE__ */ new Map([[base64SafeToken(String.raw`gAAAA[A-Za-z0-9_=-]{20,}`),Es],[base64SafeToken(String.raw`ATCTT3xFfG[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`),js],[base64SafeToken(String.raw`ATATT[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`),Ms],[base64SafeToken(String.raw`ATBB[A-Za-z0-9_=.-]{16,}`),Ds],[base64SafeToken(String.raw`dapi[0-9a-f]{32}(?:-\d)?`),As],[base64SafeToken(String.raw`AKIA[A-Z0-9]{16}`),Os],[base64SafeToken(String.raw`ASIA[A-Z0-9]{16}`),ks],[Ns,Ps],[Fs,zs],[Is,Bs],[Vs,Us],[Fo,Ks],[Ro,qs]])}));function maskToken(e){return e.length<Xs?`***`:`${sliceUtf16Safe(e,0,Zs)}…${sliceUtf16Safe(e,-4)}`}function splitSecretValueForMask(e){let t=e[0]??``,n=+!!ec.has(t);if(n){let n=e.lastIndexOf(t);if(n>0){let t=e.slice(n+1);if($s.test(t))return{maskable:e.slice(1,n),suffix:t,maskStart:0,maskEnd:n+1}}}let r=e.slice(n),i=r.match(Qs)?.[1]??``,a=i&&i.length<r.length?r.slice(0,-i.length):r;return{maskable:a,suffix:a===r?``:i,maskStart:0,maskEnd:n+a.length}}function splitFormAwareCredentialValue(e){let t=e.search(/&[A-Za-z_][A-Za-z0-9_.-]*=/u);return t<0?{secret:e,suffix:``}:{secret:e.slice(0,t),suffix:e.slice(t)}}function maskSecretValue(e){let{maskable:t,suffix:n}=splitSecretValueForMask(e);return`${maskToken(t)}${n}`}var Xs,Zs,Qs,$s,ec,tc=__esmMin((()=>{Yn(),Xs=18,Zs=6,Qs=/(["'`,;)}\]]+)$/u,$s=/^["'`,;)}\]]*$/u,ec=/* @__PURE__ */ new Set([`"`,`'`,"`"])}));function startRedactionMeasurement(e){if(!nc.hasSubscribers)return;let t=Ge.now(),n=process.threadCpuUsage();return(r,i,a)=>{let s=Ge.now()-t,c=process.threadCpuUsage(n);nc.publish({operation:e,outcome:r,pid:process.pid,threadId:P,isMainThread:N,elapsedMs:s,threadCpuMs:(c.user+c.system)/1e3,...i===void 0?{}:{inputChars:i},...a===void 0?{}:{patternCount:a}})}}var nc,rc=__esmMin((()=>{nc=Ke(`openclaw.redaction`)}));function couldMatchDefaultRedactPatterns(e){return ic.test(e)||(e.includes(`-`)||e.includes(`_`))&&ac.test(e)||oc.test(e)||e.includes(`://`)&&e.includes(`@`)||e.includes(`=`)&&sc.test(e)||$o.couldMatch(e)}function couldMatchDefaultFullContextPatterns(e){return couldMatchDefaultRedactPatterns(e)||cc.test(e)}function couldMatchVendorRedactPatterns(e){return(e.includes(`-`)||e.includes(`_`))&&ac.test(e)||oc.test(e)||cc.test(e)}function createRedactPrefilter(e){let t=/* @__PURE__ */ new Map;return n=>{let r=t.get(n);if(r!==void 0)return r;let i=e(n);return t.set(n,i),i}}var ic,ac,oc,sc,cc,lc=__esmMin((()=>{Ss(),ic=/KEY|TOKEN|SECRET|PASSWORD|PASSWD|AUTH|COOKIE|SIGNATURE|CREDENTIAL|CARD|CVC|CVV|PAYMENT|security[-_]?code|\bpass\s*[=:]|\bpassphrase\s*[=:]|_(?:password|pass|passphrase|passwd)\s*[=:]|jwt\s*[=:]|session=|code=|\bsig\s*=/iu,ac=/sk-|GOCSPX-|gh[opsur]_|github_pat_|glpat-|gloas-|gldt-|glcbt-|glptt-|glft-|glimt-|glagent-|glwt-|glsoat-|glffct-|glrt-|glrtr-|_gitlab_session=|xox[baprs]-|xapp-|gsk_|pplx-|fal_|fc-|bb_live_|[sr]k_(?:live|test)_|npm_|pypi-|do[opr]_v1_|dckr_|bkua_|CCIPAT_|sbp_|dd[pw]_|glsa_|nfp_|CFPAT-|BBDC-|HRKU-|pat-(?:eu|na)1-|apify_api_|fio-u-|tvly-|exa_|syt_|retaindb_|mem0_|brv_|xai-|fw-|fw_|fpk_|(?:^|[^A-Za-z0-9_])(?:am_|sk_)|hf_|api_org_|r8_/iu,oc=/PRIVATE KEY|\bBearer\s+|GR1348941|hooks\.slack\.com|discord|AIza|ya29\.|1\/\/0|eyJ|gAAAA|SG\.|dp\.(?:ct|pt|sa|st|scim|audit)\.|dapi[0-9a-f]|ATCTT3|ATATT|ATBB|FlyV1|A[KS]IA[A-Z0-9]|AKID|LTAI|\bbot\d{6,}:|\b\d{6,}:[A-Za-z0-9_-]{20,}/iu,sc=RegExp(`[${Mo}+%]`,`u`),cc=/JWT|Bearer\s+|am_|sk_|(?<!\d)\d{6,}:[A-Za-z0-9_-]{20,}/i}));function groupPluginRecords(e,t){let n=/* @__PURE__ */ new Map;for(let r of e){let e=t(r),i=n.get(e);i?i.push(r):n.set(e,[r])}return n}var uc=__esmMin((()=>{}));function invalidateMatcher(){fc.revision+=1,fc.registeredValueRedactor=void 0}function redactRegisteredSecretValues(e,t){return!e||fc.registeredValues.size===0?e:(fc.registeredValueRedactor??=createSecretValueRedactor([...fc.registeredValues.keys()]),fc.registeredValueRedactor(e,t))}function createSecretValueRedactor(e){let t,n;return(r,i)=>{if(!r||e.length===0)return r;let a=!1;n??=new Set(e.map(e=>e.charAt(0)));for(let e of n)if(r.includes(e)){a=!0;break}if(!a)return r;if(!t){let n=groupPluginRecords(e.toSorted((e,t)=>t.length-e.length),e=>e.slice(0,dc));t={prefixes:new RegExp([...n.keys()].map(escapeRegExp).join(`|`),`g`),buckets:n}}let{prefixes:s,buckets:c}=t,l=[];s.lastIndex=0;for(let e=s.exec(r);e;e=s.exec(r)){let t=e.index,n=c.get(e[0])?.find(e=>r.startsWith(e,t));n!==void 0&&l.push({index:t,value:n}),s.lastIndex=t+(n?.length??1)}let u=``,d=0;for(let e of l)u+=`${r.slice(d,e.index)}${i(e.value,e.index)}`,d=e.index+e.value.length;return u+r.slice(d)}}function resetSecretRedactionRegistryForTest(){fc.registeredValues.clear(),invalidateMatcher()}var dc,fc,pc=__esmMin((()=>{uc(),R(),pa(),dc=6,fc=resolveGlobalSingleton(Symbol.for(`openclaw.secretRedactionRegistry`),()=>({revision:0,registeredValues:/* @__PURE__ */ new Map,registeredValueRedactor:void 0})),process.env.VITEST&&(globalThis[Symbol.for(`openclaw.secretRedactionRegistryTestApi`)]={resetSecretRedactionRegistryForTest})}));function classifyCode(e){return mc.has(e)?`hostname_mismatch`:hc.has(e)?`certificate_invalid`:null}function classifyMessage(e){return gc.some(t=>t.test(e))?`hostname_mismatch`:_c.some(t=>t.test(e))?`certificate_invalid`:null}function inspectTlsCertificateErrorInternal(e,t,n){if(n>vc)return null;if(typeof e==`string`){let t=classifyMessage(e);return t?{kind:t,message:e}:null}if(!e||typeof e!=`object`||t.has(e))return null;t.add(e);let r=e,i=typeof r.code==`string`?r.code.trim().toUpperCase():void 0,a=typeof r.message==`string`&&r.message.trim()?r.message:void 0,s=i?classifyCode(i):null;if(i&&s)return{kind:s,code:i,message:a??i};let c=Array.isArray(r.errors)?r.errors:[];for(let e of[r.cause,r.error,...c]){let r=inspectTlsCertificateErrorInternal(e,t,n+1);if(r)return r}let l=a?classifyMessage(a):null;return l&&a?{kind:l,message:a}:null}function inspectTlsCertificateError(e){return inspectTlsCertificateErrorInternal(e,/* @__PURE__ */ new Set,0)}var mc,hc,gc,_c,vc,yc=__esmMin((()=>{mc=/* @__PURE__ */ new Set([`ERR_TLS_CERT_ALTNAME_INVALID`,`HOSTNAME_MISMATCH`]),hc=/* @__PURE__ */ new Set(/* @__PURE__ */ `CERT_CHAIN_TOO_LONG.CERT_HAS_EXPIRED.CERT_NOT_YET_VALID.CERT_REJECTED.CERT_REVOKED.CERT_SIGNATURE_FAILURE.CERT_UNTRUSTED.CRL_HAS_EXPIRED.CRL_NOT_YET_VALID.CRL_SIGNATURE_FAILURE.DEPTH_ZERO_SELF_SIGNED_CERT.ERROR_IN_CERT_NOT_AFTER_FIELD.ERROR_IN_CERT_NOT_BEFORE_FIELD.ERROR_IN_CRL_LAST_UPDATE_FIELD.ERROR_IN_CRL_NEXT_UPDATE_FIELD.INVALID_CA.INVALID_PURPOSE.PATH_LENGTH_EXCEEDED.SELF_SIGNED_CERT_IN_CHAIN.UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY.UNABLE_TO_DECRYPT_CERT_SIGNATURE.UNABLE_TO_DECRYPT_CRL_SIGNATURE.UNABLE_TO_GET_CRL.UNABLE_TO_GET_ISSUER_CERT.UNABLE_TO_GET_ISSUER_CERT_LOCALLY.UNABLE_TO_VERIFY_LEAF_SIGNATURE`.split(`.`)),gc=[/hostname\/ip does not match certificate(?:'s)? altnames/i,/hostname mismatch/i,/host: .+ is not in the cert(?:ificate)?(?:'s)? altnames/i],_c=[/certificate has expired/i,/certificate is not yet valid/i,/self[- ]signed certificate/i,/unable to get local issuer certificate/i,/unable to verify the first certificate/i],vc=8}));function isKnownTransportErrorCode(e){return Sc.some(({code:t})=>t.exec(e)?.[0]===e)||inspectTlsCertificateError({code:e})?.code===e}var bc,xc,Sc,Cc=__esmMin((()=>{yc(),bc=/(?:\s*:\s*|\s+)/,RegExp(`^(?:http\\s*)?(\\d{3})${bc.source}(.+)$`,`i`),RegExp(`^(?:http\\s*)?(\\d{3})(?:${bc.source}([\\s\\S]+))?$`,`i`),xc="Couldn't connect to the AI service. Check your connection, then try again. For details, open Settings → Logs in the OpenClaw app or run `openclaw logs --follow`.",Sc=[{code:/\beconnrefused\b/i,phrases:/connection refused|actively refused/i,message:xc},{code:/\beconnreset\b|\beconnaborted\b|\benetreset\b|\bepipe\b/i,phrases:/socket hang up|connection reset|connection aborted/i,message:"Lost the connection to the AI service. Check the conversation before trying again. For details, open Settings → Logs in the OpenClaw app or run `openclaw logs --follow`."},{code:/\benotfound\b|\beai_again\b|\benetunreach\b|\behostunreach\b|\behostdown\b/i,phrases:/getaddrinfo|no such host|\bdns\b|network is unreachable|host is unreachable|fetch failed|connection error|network request failed/i,message:xc}]}));function shouldRedactStructuredAuthorizationCode(e,t,n){if(e!==`code`)return!1;let r=t.map(e=>e.toLowerCase());return r.length===1||r.at(-1)===`code`&&[`error`,`nodeerror`,`status`,`details`,`warnings`].includes(r.at(-2)??``)?!1:!(n!==void 0&&r.length>1&&r.slice(0,-1).every(e=>e===`cause`)&&isKnownTransportErrorCode(n))}var wc=__esmMin((()=>{Cc()}));function parsePattern(e){if(e===_o)return vo;if(typeof e!=`string`&&!(e instanceof RegExp))return typeof e==`object`&&e&&typeof e.exec==`function`?e:null;let t=typeof e==`string`?Js.get(e)??null:null,n=!0;if(e instanceof RegExp)t=e.flags.includes(`g`)?e:new RegExp(e.source,`${e.flags}g`);else if(!t&&e.trim()){let[r,i]=parseRedactPatternSource(e),a=Mc.has(e)?rewriteOpenEndedRepeats(r,i):r;t=compileConfigRegex(a,i)?.regex??null,n=t!==null&&t.source===a&&t.flags===i&&t.exec===RegExp.prototype.exec&&t[Symbol.replace]===RegExp.prototype[Symbol.replace]}if(t&&typeof e==`string`&&Ec.shellReferencePreserving.has(e)&&Dc.add(t),t&&typeof e==`string`&&Ec.formAware.has(e)&&Nc.add(t),t&&typeof e==`string`&&(e.startsWith(Jo)||Ec.chunkUnsafe.has(e))&&jc.add(t),t&&typeof e==`string`){if(Mc.has(e)&&Oc.add(t),n&&Ac.has(e)&&!kc.has(t)){let e=t.source,n=t.exec,r=t instanceof RegExp?t.flags:void 0,i=t instanceof RegExp?t[Symbol.replace]:void 0;kc.set(t,()=>t.source===e&&t.exec===n&&(!(t instanceof RegExp)||t.flags===r&&t[Symbol.replace]===i))}let r=Ec.prefilters.get(e);n&&r&&setRedactPatternPrefilter(t,r)}return t}function resolvePatterns(e){if(usesBuiltInRedactPatterns(e))return Pc??=xs.map(parsePattern).filter(e=>!!e),Pc;let t=/* @__PURE__ */ new Set,n=!Array.isArray(e);for(let r of Array.isArray(e)?e:[]){let e=parsePattern(r);e?t.add(e):n=!0}if(n){for(let e of resolvePatterns())t.add(e);if(!Fc){Fc=!0;try{console.warn(`[openclaw] Ignoring invalid logging.redactPatterns entries; keeping valid patterns and built-in redaction. Fix logging.redactPatterns in your config.`)}catch{}}}return t.add($o),[...t]}function usesBuiltInRedactPatterns(e){return e===void 0||e===xs||Array.isArray(e)&&e.length===0}function normalizeSensitiveKeyName(e){let t=e.replace(Lc,``);try{return decodeURIComponent(t).replace(Lc,``).toLowerCase().replaceAll(`-`,`_`)}catch{return t.toLowerCase().replaceAll(`-`,`_`)}}function isSensitiveBodyKey(e){return isSensitiveUrlQueryParamName(e)||Ec.bodySecretKeys.has(normalizeSensitiveKeyName(e))}function hasEncodedOrInvisibleFormKey(e){return Rc.test(e)||e.replace(Ic,``)!==e}function visitSensitiveAssignments(e,t,n){if(!e||t===`url`&&!e.includes(`?`)||t===`encoded`&&!e.includes(`%`)&&e.replace(Ic,``)===e||t===`context`&&!/[=:]/u.test(e))return;let visitPair=(e,r,i)=>{if(t===`encoded`&&!hasEncodedOrInvisibleFormKey(e)||!isSensitiveBodyKey(e))return;let{maskable:a,maskStart:s,maskEnd:c}=splitSecretValueForMask(r);n(i+s,i+c,a)};if(t===`form`){let t=0;for(let n of e.split(`&`)){let e=n.indexOf(`=`);e>=0&&visitPair(n.slice(0,e),n.slice(e+1),t+e+1),t+=n.length+1}return}let r=t===`url`?qc:t===`encoded`?Gc:Kc,i=t===`context`?3:2;r.lastIndex=0;try{for(let t=r.exec(e);t;t=r.exec(e)){let e=t[1]??``,n=t[i]??``;visitPair(n,t[i+1]??``,t.index+e.length+n.length+1)}}finally{r.lastIndex=0}}function redactAssignmentValues(e,t,n){let r=[],i=[],a=0;return visitSensitiveAssignments(e,t,(s,c,l)=>{let u=t===`url`?maskToken(l):`***`;r.push(e.slice(a,s),u),n&&i.push({start:s,end:c,replacement:u}),a=c}),i.length>0&&n?.(i),r.length>0?r.join(``)+e.slice(a):e}function redactFormBodyLine(e,t){if(!e.includes(`=`))return e;let n=redactAssignmentValues(redactAssignmentValues(e,`encoded`,t),`context`,t);if(!n.includes(`&`))return n;if(Uc.test(n))return redactAssignmentValues(n,`form`,t);let r=[],i=n.replace(Wc,(e,n,i,a)=>{let s=redactAssignmentValues(i,`form`,t?e=>{for(let t of e)r.push({...t,start:a+n.length+t.start,end:a+n.length+t.end})}:void 0);return s===i?e:`${n}${s}`});return r.length>0&&t?.(r),redactAssignmentValues(redactAssignmentValues(i,`encoded`,t),`context`,t)}function redactFormBody(e,t){if(!e.includes(`=`))return e;if(Jc.test(e)){let n=0;return e.split(Jc).map(e=>{let r=Yc.test(e)?e:redactFormBodyLine(e,t?e=>t(e.map(e=>({...e,start:n+e.start,end:n+e.end}))):void 0);return n+=r.length,r}).join(``)}return redactFormBodyLine(e,t)}function isShellReferenceToKey(e,t){if(!/^[A-Z_][A-Z0-9_]*$/.test(e))return!1;let n=t.match(/^\$([A-Z_][A-Z0-9_]*)$/);return n?n[1]===e:t.match(/^\$\{([A-Z_][A-Z0-9_]*)(?::[-=?+])?\}$/)?.[1]===e}function maskSecretFieldValue(e,t){let n=t.match(/^\$\{([A-Z_][A-Z0-9_]*):[-=?+][^{}]+\}(?![\s\S])/);return n&&n[1]===e?`${t.slice(0,t.indexOf(`:`)+2)}***}`:`***`}function shouldPreserveShellReferenceMatch(e,t){let n=e.match(/\b([A-Z_][A-Z0-9_]*)\b\s*[=:]/)?.[1];return n?isShellReferenceToKey(n,t):!1}function isEmptyShellParameterExpansionTail(e){return/^[-=?+]\}$/.test(e)}function prepareRedactionCapture({match:e,groups:t,input:n,offset:r,replacement:i},a){if(e.includes(`PRIVATE KEY-----`))return{start:r,end:r+e.length,value:e,redact:e=>({start:e.start,end:e.end,value:e.value,replacement:i??redactPemBlock(e.value,`…redacted…`)})};let s=selectSecretCapture(e,t);if(s.value===`***`)return;let c=s.value===e?0:getSecretCaptureStart(a,n,e,r,s);if(c<0)return;let l=r+c;return{start:l,end:l+s.value.length,value:s.value,redact:t=>{let n=t.value,r=Nc.has(a)?splitFormAwareCredentialValue(n):{secret:n,suffix:``};if(splitSecretValueForMask(r.secret).maskable===`***`)return;let s=Dc.has(a);if(s&&(shouldPreserveShellReferenceMatch(e,n)||isEmptyShellParameterExpansionTail(n)))return;let c=i??(s?maskToken(n):`${maskSecretValue(r.secret)}${r.suffix}`);return{start:t.start,end:t.end,replacement:c}}}}function redactMatch(e,t){let n=prepareRedactionCapture(e,t),r=n?.redact(n);return r?e.match.slice(0,r.start-e.offset)+r.replacement+e.match.slice(r.end-e.offset):e.match}function redactText(e,t,n){let r=startRedactionMeasurement(`text`),i=`error`;try{let r=redactFormBody(redactAssignmentValues(redactStructuredAuthHeaders(e,`***`),`url`)),a,replace=e=>redactMatch(e,a),replaceRegex=(...e)=>replace(readRedactMatch(e)),s,c=!1;for(a of t)kc.get(a)?.()&&(s!==r&&(s=r,c=couldMatchVendorRedactPatterns(r)),!c)?a instanceof RegExp&&(a.lastIndex=0):r=a instanceof RegExp&&!n?.fullContext&&!Oc.has(a)&&!jc.has(a)?replacePatternBounded(r,a,replaceRegex):replaceRedactPattern(r,a,replace,replaceRegex);return i=`ok`,r}finally{r?.(i,e.length,t.length)}}function looksLikeAppSpecificPassword(e){return e.split(`-`).every(e=>!el.has(e.toLowerCase()))}function redactAppSpecificPasswords(e){return e.includes(`-`)?e.replace($c,(e,t)=>looksLikeAppSpecificPassword(t)?maskToken(t):e):e}function resolveConfigRedaction(){let e=readLoggingConfig();return{mode:Tc,patterns:e?.redactPatterns}}function resolveRedactOptions(e){let t=e??resolveConfigRedaction(),n=t.mode===`off`?`off`:Tc;return{mode:n,patterns:n===`off`?[]:resolvePatterns(t.patterns)}}function redactSensitiveText(e,t){return e&&redactSensitiveTextWithOptions(redactRegisteredSecretValues(e,maskToken),t??resolveConfigRedaction())}function redactSensitiveTextWithOptions(e,t){return t.mode===`off`||usesBuiltInRedactPatterns(t.patterns)&&!couldMatchDefaultRedactPatterns(e)?e:redactText(e,resolveRedactOptions(t).patterns)}function resolveToolPayloadRedaction(e=readLoggingConfig()){let t=e?.redactPatterns;return{mode:`tools`,patterns:Array.isArray(t)&&t.length>0?[...t,...xs]:t}}function redactToolPayloadText(e){return redactToolPayloadTextWithConfig(e,readLoggingConfig())}function redactToolPayloadTextWithConfig(e,t){return redactSensitiveText(e,resolveToolPayloadRedaction(t))}function isSensitiveFieldKey(e){return Xc.test(e)||tl.test(e)}function isPublicShareIdPath(e){return e.at(-1)?.toLowerCase()===`id`&&e.at(-2)?.toLowerCase().replaceAll(`-`,``).replaceAll(`_`,``)===`publicshare`}function redactSensitiveFieldValueWithOptions(e,t,n,r=[e],i=!0,a=couldMatchDefaultRedactPatterns){let s=redactRegisteredSecretValues(t,maskToken);if(isPublicShareIdPath(r))return maskToken(s);let c=resolveRedactOptions(n);if(c.mode===`off`)return s;let l=!usesBuiltInRedactPatterns(n.patterns)||a(s)?redactText(s,c.patterns):s;if(l!==t||Qc.test(e)){let e=redactAppSpecificPasswords(l);if(e!==t)return e}return l===t?shouldRedactStructuredStringField(e,s,r,i)?maskToken(s):s:l}function shouldRedactStructuredPrimitiveField(e,t){let n=e.toLowerCase();return isPublicShareIdPath(t)||shouldRedactStructuredAuthorizationCode(n,t)||isSensitiveFieldKey(e)}function isPlainRedactableObject(e){let t=Object.getPrototypeOf(e);return t===Object.prototype||t===null}function redactStructuredSecretValue(e,t,n,r,i,a=e?[e]:[],s=!0){if(typeof t==`string`)return redactSensitiveFieldValueWithOptions(e,t,r,a,s,i);if(t==null)return t;if(typeof t==`number`||typeof t==`boolean`||typeof t==`bigint`)return shouldRedactStructuredPrimitiveField(e,a)?`***`:t;if(Array.isArray(t)){if(n.has(t))return`[Circular]`;n.add(t);let s=t.map(t=>redactStructuredSecretValue(e,t,n,r,i,a,!1));return n.delete(t),s}if(typeof t==`object`){if(n.has(t))return`[Circular]`;if(!isPlainRedactableObject(t))return t;n.add(t);let e=Object.entries(t);for(let t of e){let[e,c]=t;t[1]=redactStructuredSecretValue(e,c,n,r,i,[...a,e],s)}return n.delete(t),Object.fromEntries(e)}return t}function redactSecretsWithOptions(e,t){return typeof e==`string`?redactSensitiveText(e,t):typeof e!=`object`||!e?e:redactStructuredSecretValue(``,e,/* @__PURE__ */ new WeakSet,t,createRedactPrefilter(couldMatchDefaultRedactPatterns))}function redactSecrets(e){return redactSecretsWithOptions(e,resolveToolPayloadRedaction())}function preservesStructuredReference(e,t){return e.toLowerCase()===`session`&&Zc.test(t)||isShellReferenceToKey(e,t)}function shouldRedactStructuredStringField(e,t,n,r){return shouldRedactStructuredAuthorizationCode(e.toLowerCase(),n,r?t:void 0)||isSensitiveFieldKey(e)&&!preservesStructuredReference(e,t)}function classifyLogFieldProtection(e,t,n,r){return(r===void 0?shouldRedactStructuredPrimitiveField(e,t):isPublicShareIdPath(t)||shouldRedactStructuredStringField(e,r,t,n))?`legacy`:Ec.credentialHeaderField.test(e)?`header`:void 0}function getFieldRecordEdits(e,t){let{key:n,value:r,path:i,objectPath:a}=e;return t===`off`||!e.string&&r===`null`||!classifyLogFieldProtection(n,i,a,e.string?r:void 0)?[]:[{start:0,end:r.length,replacement:maskSecretFieldValue(n,r)}]}function getTextRecordEdits(e,t,n){let{value:r}=e;if(e.isKey||n&&!e.origin.structured)return[];if(n&&e.origin.primitiveMask)return[{start:0,end:r.length,replacement:`***`}];if(!e.string)return[];let i=[],a=redactRegisteredSecretValues(r,(e,t)=>{let n=maskToken(e);return i.push({start:t,end:t+e.length,replacement:n}),n});if(n&&isPublicShareIdPath(e.path))return[{start:0,end:r.length,replacement:maskToken(a)}];if(t===`off`)return i;let s=i,receive=e=>{s=composeRedactionEdits(r.length,s,e)},c=findStructuredAuthParamRanges(a).map(({start:e,end:t})=>({start:e,end:t,replacement:`***`}));return receive(c),redactFormBody(redactAssignmentValues(applyRedactionEdits(a,c),`url`,receive),receive),s}function getLegacyFieldRecordEdits(e,t){let{key:n,value:r,path:i,objectPath:a}=e;if(e.isKey||!e.origin.structured||!e.string||isPublicShareIdPath(i))return[];let s=[];if(t!==r||Qc.test(n))for(let e of t.matchAll($c))looksLikeAppSpecificPassword(e[0])&&s.push({start:e.index,end:e.index+e[0].length,replacement:maskToken(e[0])});return s.length>0||t!==r?s:classifyLogFieldProtection(n,i,a,t)===`legacy`?[{start:0,end:t.length,replacement:maskToken(t)}]:[]}function*redactionEditMatches(e,t){for(let n of t)yield{match:e.slice(n.start,n.end),groups:[],input:e,offset:n.start,replacement:n.replacement}}function redactLogRecordForTransport(e,t){let n=startRedactionMeasurement(`log-record`),r=`error`,i;try{let n=t?.redaction??resolveRedactOptions(),a={value:{structured:!0,primitiveMask:!1},children:/* @__PURE__ */ new Map},s=[],c=JSON.stringify(e,function(e,t){for(;s.length>0&&s.at(-1)?.value!==this;)s.pop();let n=s.at(-1),r=Array.isArray(this),i=r&&n?n.key:e,c=r&&n?n.path:n?[...n.path,e]:[],l=t,u=(n?.structured??!0)&&(typeof l!=`object`||!l||Array.isArray(l)||isPlainRedactableObject(l)),d=u&&[`number`,`boolean`,`bigint`].includes(typeof l)&&classifyLogFieldProtection(i,c,!r,void 0)===`legacy`,f=typeof t==`object`&&!!t&&s.some(e=>e.value===t),p=f?`[Circular]`:typeof t==`bigint`?String(t):t,m=typeof p==`object`&&!!p,h=a;return n&&n.structured&&(m||!u||d||f)?(h={value:{structured:u&&!f,primitiveMask:d},children:/* @__PURE__ */ new Map},n.origins.children.set(e,h)):n?h=n.origins:a.value={structured:u,primitiveMask:d},m&&s.push({value:p,path:c,key:i,origins:h,structured:u}),p});i=c.length;let l=createRedactPrefilter(couldMatchDefaultFullContextPatterns),u=JSON.parse(redactJsonRecord(c,a,[[{patterns:n.patterns}],[{patterns:nl},{patterns:n.patterns,...n.patterns===Pc?{couldMatch:l}:{}}]],prepareRedactionCapture,t?getLegacyFieldRecordEdits:()=>[],e=>getFieldRecordEdits(e,n.mode),e=>getTextRecordEdits(e,n.mode,t!==void 0),(e,t)=>e.path.length===1&&rl.has(e.key)||n.patterns===Pc&&!l(t),t?.message));return r=`ok`,u}finally{n?.(r,i)}}var Tc,Ec,Dc,Oc,kc,Ac,jc,Mc,Nc,Pc,Fc,Ic,Lc,Rc,zc,Bc,Vc,Hc,Uc,Wc,Gc,Kc,qc,Jc,Yc,Xc,Zc,Qc,$c,el,tl,nl,rl,il=__esmMin((()=>{Fa(),qa(),Qa(),Aa(),ro(),io(),go(),Ys(),tc(),ho(),Ss(),yo(),rc(),lc(),pc(),wc(),Tc=`tools`,Ec=createBackendRedactPatterns(),Dc=/* @__PURE__ */ new WeakSet,Oc=/* @__PURE__ */ new WeakSet,kc=/* @__PURE__ */ new WeakMap,Ac=new Set(bs),jc=/* @__PURE__ */ new WeakSet,Mc=new Set(xs.filter(e=>typeof e==`string`)),Nc=/* @__PURE__ */ new WeakSet,Fc=!1,Ic=new RegExp(String.raw`[${Mo}+]`,`gu`),Lc=/[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu,Rc=/%[0-9A-Fa-f]{2}/u,zc=String.raw`[${Mo}+]*(?:[A-Za-z_]|%[0-9A-Fa-f]{2})(?:[A-Za-z0-9_.-]|%[0-9A-Fa-f]{2}|[${Mo}+])*`,Bc=`[^&\\s<>]*`,Vc=`[^&#\\s<>]*`,Hc=String.raw`${zc}=${Bc}`,Uc=new RegExp(String.raw`^${Hc}(?:&${Hc})+$`,`u`),Wc=RegExp(String.raw`(^|[\s:({\[,="'`+"`"+String.raw`])(${Hc}(?:&${Hc})+)`,`gu`),Gc=RegExp(String.raw`(^|[\s:({\[,="'`+"`"+String.raw`&])(${zc})=(${Bc})`,`gu`),Kc=new RegExp(String.raw`(\b(?:body|form(?:[-_\s]?body)?)\s*[:=]\s*(["'\x60]?))(${zc})=(${Bc})(["'\x60]?)`,`giu`),qc=new RegExp(String.raw`([?&])(${zc})=(${Vc})`,`gu`),Jc=/(\r\n|\r|\n)/u,Yc=/^(?:\r\n|\r|\n)$/u,Xc=new RegExp(String.raw`^(?:api[-_]?key|apiKey|api[-_]?token|apiToken|bearer[-_]?token|bearerToken|token|secret|password|passwd|${Co}|credential|authorization|private[-_]?key|privateKey|access[-_]?token|accessToken|refresh[-_]?token|refreshToken|id[-_]?token|idToken|auth[-_]?token|authToken|client[-_]?secret|clientSecret|app[-_]?secret|appSecret|secret[-_]?value|secretValue|raw[-_]?secret|rawSecret|secret[-_]?input|secretInput|key|key[-_]?material|keyMaterial|jwt|session|signature|cookie|set[-_]?cookie|${xo}|${So})$`,`i`),Zc=/^\$WORKSPACE_DIR\/[A-Za-z0-9._/-]+\.jsonl$/u,Qc=/^(?:apple|icloud|app[-_]?specific[-_]?password|appSpecificPassword|application[-_]?password|text|content|message|error|errorMessage|detail|details|reason)$/i,$c=/\b([a-z]{4}-[a-z]{4}-[a-z]{4}-[a-z]{4})\b/g,el=/* @__PURE__ */ new Set([`case`,`claw`,`demo`,`file`,`main`,`name`,`open`,`path`,`slug`,`test`]),tl=new RegExp(String.raw`^(?:(?:[A-Z0-9]+[_-])+(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD)|API[_-]?KEY|TOKEN|SECRET|PASSWORD|PASSWD|${bo})$`,`i`),nl=[{source:`registered secret values`,*exec(e){let t=[];redactRegisteredSecretValues(e,(n,r)=>(t.push({match:n,groups:[],input:e,offset:r,replacement:maskToken(n)}),n)),yield*t}},{source:`structured authorization parameters`,*exec(e){for(let{start:t,end:n}of findStructuredAuthParamRanges(e))yield{match:e.slice(t,n),groups:[],input:e,offset:t,replacement:`***`}}},{source:`URL query assignments`,*exec(e){let t=[];redactAssignmentValues(e,`url`,e=>t.push(...e)),yield*redactionEditMatches(e,t)}},{source:`form bodies`,*exec(e){let t=[];redactFormBody(e,n=>{t=composeRedactionEdits(e.length,t,n)}),yield*redactionEditMatches(e,t)}}],rl=/* @__PURE__ */ new Set([`time`,`level`])}));function isValidTimeZone(e){let t=al.get(e);if(t!==void 0)return t;let n;try{new Intl.DateTimeFormat(`en`,{timeZone:e}).format(),n=!0}catch{n=!1}return al.set(e,n),n}function resolveEffectiveTimeZone(e){let t=e??process.env.TZ;return t&&isValidTimeZone(t)?t:sl??=Intl.DateTimeFormat().resolvedOptions().timeZone}function getTimestampParts(e,t){let n=resolveEffectiveTimeZone(t),r=Math.floor(e.getTime()/1e3);if(cl?.second===r&&cl.timeZone===n)return cl.parts;let i=ol.get(n);i||(i=new Intl.DateTimeFormat(`en`,{timeZone:n,year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`,second:`2-digit`,hour12:!1,fractionalSecondDigits:3,timeZoneName:`longOffset`}),ol.set(n,i));let a={};for(let t of i.formatToParts(e))a[t.type]=t.value;return cl={second:r,timeZone:n,parts:a},a}function formatTimestamp(e,t){let n=t?.style??`medium`,r=getTimestampParts(e,t?.timeZone),i=r.timeZoneName??`GMT`,a=i===`GMT`?`+00:00`:i.slice(3),s=String(e.getUTCMilliseconds()).padStart(3,`0`);switch(n){case`short`:return`${r.hour}:${r.minute}:${r.second}${a}`;case`medium`:return`${r.hour}:${r.minute}:${r.second}.${s}${a}`;case`long`:return`${r.year}-${r.month}-${r.day}T${r.hour}:${r.minute}:${r.second}.${s}${a}`}throw Error(`Unsupported timestamp style`)}var al,ol,sl,cl,ll=__esmMin((()=>{al=/* @__PURE__ */ new Map,ol=/* @__PURE__ */ new Map}));function formatJsonConsoleLine(e){let t={...e.meta,time:formatTimestamp(/* @__PURE__ */ new Date,{style:`long`}),level:e.level,...e.subsystem?{subsystem:e.subsystem}:{},message:e.message};return JSON.stringify(redactLogRecordForTransport(t))}function formatConsoleDiagnosticLine(e){return(H.overrideSettings?.consoleStyle??readLoggingConfig()?.consoleStyle)===`json`?formatJsonConsoleLine(e):e.message}function writeConsoleDiagnosticWarning(e){process.stderr.write(`${formatConsoleDiagnosticLine({level:`warn`,message:e})}\n`)}var ul=__esmMin((()=>{Aa(),il(),wi(),ll()}));function tryParseLogLevel(e){if(typeof e!=`string`)return;let t=e.trim();return dl.includes(t)?t:void 0}function normalizeLogLevel(e,t=`info`){return tryParseLogLevel(e)??t}function levelToMinLevel(e){return fl[e]}function isLogLevelEnabled(e,t){return e!==`silent`&&t!==`silent`&&levelToMinLevel(e)>=levelToMinLevel(t)}var dl,fl,pl=__esmMin((()=>{dl=[`silent`,`fatal`,`error`,`warn`,`info`,`debug`,`trace`],fl={trace:1,debug:2,info:3,warn:4,error:5,fatal:6,silent:1/0}}));function resolveEnvLogLevelOverride(){let e=normalizeOptionalString(process.env.OPENCLAW_LOG_LEVEL)??``;if(!e){H.invalidEnvLogLevelValue=null;return}let t=tryParseLogLevel(e);if(t)return H.invalidEnvLogLevelValue=null,t;H.invalidEnvLogLevelValue!==e&&(H.invalidEnvLogLevelValue=e,writeConsoleDiagnosticWarning(`[openclaw] Ignoring invalid OPENCLAW_LOG_LEVEL="${redactToolPayloadText(e)}" (allowed: ${dl.join(`|`)}).`))}var ml=__esmMin((()=>{Lt(),ul(),pl(),il(),wi()}));function loadResolveSecureTempRoot(){if(gl)return gl;let e=getSealedRuntimeSecureTempRoot();if(e)return gl=e,e;if(typeof SEALED_RUNTIME_BUILD==`boolean`&&SEALED_RUNTIME_BUILD)throw Error(`sealed temp-root runtime was not registered before use`);if(typeof process.getBuiltinModule!=`function`)throw Error(`Node module loading is unavailable for secure temp-root resolution`);return gl=process.getBuiltinModule(`module`).createRequire(import.meta.url)(`@openclaw/fs-safe/secure-temp-root`).resolveSecureTempRoot,gl}function assertSafeTempAncestors(e,t){let n=t.platform??process.platform;if(n===`win32`||n===`android`)return;let r=process.getBuiltinModule(`fs`),i=t.lstatSync??r.lstatSync,a=t.lstatSync&&t.lstatSync!==r.lstatSync?E.resolve(e):r.realpathSync.native(e);for(let e=E.dirname(a);;e=E.dirname(e)){let t=i(e);if(t.mode!==void 0&&t.mode&18&&!(t.mode&512)){let t=`'${e.replaceAll(`'`,`'\\''`)}'`;throw Error(`Temp workspace ancestor ${JSON.stringify(e)} is group/world writable without sticky protection; have its owner run chmod +t ${t} for a shared temp directory or chmod go-w ${t} for a private ancestor.`)}if(E.dirname(e)===e)return}}function resolvePreferredOpenClawTmpDir(e={}){let t=loadResolveSecureTempRoot(),n={...e,preferredDir:e.preferredDir??`/tmp/openclaw`,fallbackPrefix:`openclaw`,warningPrefix:`[openclaw]`,unsafeFallbackLabel:`OpenClaw temp dir`,skipPreferredOnWindows:!0},r=t(n);if(e.purpose===`coordination`)return r;let i;try{return assertSafeTempAncestors(r,e),r}catch(e){i=e}let a=e.stateDir??resolveStateDir();try{let r=t({...n,preferredDir:void 0,tmpdir:()=>E.join(a,`tmp`)});return assertSafeTempAncestors(r,e),(e.warn??console.warn)(`[openclaw] ${String(i)} Using private state temp dir: ${r}`),r}catch(e){throw Error(`No safe OpenClaw temp root is available. Default root: ${String(i)} State fallback ${JSON.stringify(a)}: ${String(e)}`,{cause:e})}}var hl,gl,_l=__esmMin((()=>{ua(),Ri(),hl=`/tmp/openclaw`}));function readParsedField(e,t,n){for(let r of typeof t==`string`?[t]:t){let t=n(e[r]);if(t!==void 0)return t}}var vl=__esmMin((()=>{}));function canUseNodeFs(){try{return process.getBuiltinModule?.(`fs`)!==void 0}catch{return!1}}function formatLocalDate(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}var yl,bl,xl=__esmMin((()=>{yl=`openclaw`,bl=`.log`}));function detachEmptyGroup(e){e.pending.size>0||(Sl.lastGroup===e&&(Sl.lastGroup=void 0),process.removeListener(`exit`,e.dispatch))}function registerProcessExitCleanup(e){let t={close:e},n=Sl.lastGroup;if(!n||process.listeners(`exit`).at(-1)!==n.dispatch){let e=/* @__PURE__ */ new Set([t]),r={pending:e,dispatch:()=>{let t=[...e];e.clear(),detachEmptyGroup(r);for(let e of t)try{e.close()}catch{}}};process.on(`exit`,r.dispatch),Sl.lastGroup=n=r}else n.pending.add(t);let r=n;return()=>{r.pending.delete(t),detachEmptyGroup(r)}}var Sl,Cl=__esmMin((()=>{R(),Sl=resolveGlobalSingleton(Symbol.for(`openclaw.processExitCleanup`),()=>({}))}));function rotatedLogPath(e,t){let n=E.extname(e);return`${e.slice(0,e.length-n.length)}.${t}${n}`}function ensureLogDirectorySync(e,t=!0,n=511){try{v.mkdirSync(e,{mode:n})}catch(r){let i=extractErrorCode(r);if(i===`EEXIST`&&v.statSync(e).isDirectory())return;let a=E.dirname(e);if(!t||i!==`ENOENT`||a===e)throw r;ensureLogDirectorySync(a,!0,n),ensureLogDirectorySync(e,!1,n)}}function rotateLogFile(e){try{ensureLogDirectorySync(E.dirname(e)),v.rmSync(rotatedLogPath(e,wl),{force:!0});for(let t=4;t>=1;--t){let n=rotatedLogPath(e,t);v.existsSync(n)&&v.renameSync(n,rotatedLogPath(e,t+1))}return v.existsSync(e)&&v.renameSync(e,rotatedLogPath(e,1)),!0}catch{return!1}}function pruneOldRollingLogs(e){try{let t=v.readdirSync(e,{withFileTypes:!0}),n=Date.now()-Tl;for(let r of t){if(!r.isFile()||!r.name.startsWith(`openclaw-`)||!r.name.endsWith(`.log`))continue;let t=E.join(e,r.name);try{v.statSync(t).mtimeMs<n&&v.rmSync(t,{force:!0})}catch{}}}catch{}}function prepareFileLogTarget(e,t){ensureLogDirectorySync(E.dirname(e)),t&&pruneOldRollingLogs(E.dirname(e))}function resolveDefaultFileLogTarget(e,t){return ensureLogDirectorySync(t.stateDir,!0,448),E.join(resolvePreferredOpenClawTmpDir({preferredDir:E.join(t.stateDir,`logs`),tmpdir:()=>E.join(t.stateDir,`tmp`),stateDir:t.stateDir}),e)}async function executeFileLogIO(e){switch(e.type){case`resolveDefault`:return resolveDefaultFileLogTarget(e.file,e.root);case`prepare`:return prepareFileLogTarget(e.file,e.rolling);case`size`:try{return v.statSync(e.file).size}catch{return 0}case`append`:{let t=e.rotate?rotateLogFile(e.file)?`rotated`:`failed`:`none`;try{return c({filePath:e.file,content:e.payload}),{rotation:t,appended:!0}}catch{return{rotation:t,appended:!1}}}}}var wl,Tl,El=__esmMin((()=>{F(),_l(),xl(),wl=5,Tl=864e5})),Dl,Ol,kl,Al=__esmMin((()=>{Dl=Symbol.for(`openclaw.cliRespawnParent`),Ol=`OPENCLAW_CLI_RESPAWN_PARENT`,kl=process.env[Ol],delete process.env[Ol],kl===String(process.ppid)&&(globalThis[Dl]={pid:process.ppid})}));function parseNodeOptionsEnvVar(e){let t=[],n=``,r=!1,i=e??``;for(let e=0;e<i.length;e+=1){let a=i.charAt(e);if(a===`\\`&&r){if(e+=1,e>=i.length)return null;a=i.charAt(e)}else if(a===` `&&!r){n.length>0&&(t.push(n),n=``);continue}else if(a===`"`){r=!r;continue}n+=a}return r?null:(n.length>0&&t.push(n),t)}var jl=__esmMin((()=>{}));function readStandaloneRuntimeManifest(e=process.execPath){return readStandaloneManifest({executable:e})}function projectStandaloneBuildInfo(e){let nonBlank=e=>typeof e==`string`&&e.trim().length>0,stringList=e=>Array.isArray(e)&&e.every(nonBlank),t={mode:e.mode,openclaw:{version:e.openclaw.version,...nonBlank(e.openclaw.commit)?{commit:e.openclaw.commit}:{}},bun:{version:e.bun.version}};for(let n of[`revision`,`commit`,`executableSha256`])nonBlank(e.bun[n])&&(t.bun[n]=e.bun[n]);if(e.build!==void 0){let{id:n,flavor:r,pluginSetSha256:i,moduleGraphSha256:a}=e.build;if(!nonBlank(n)||![`standard`,`support`].includes(r)||!/^[a-f0-9]{64}$/.test(i)||!/^[a-f0-9]{64}$/.test(a))throw Error(`Invalid standalone build provenance`);if(t.build={id:n,flavor:r,pluginSetSha256:i,moduleGraphSha256:a},e.build.debugEntry!==void 0){let n=e.build.debugEntry;if(typeof n!=`string`||!n.startsWith(`debug/`)||n.includes(`\\`)||n.split(`/`).some(e=>!e||e===`.`||e===`..`))throw Error(`Invalid standalone debugger entry`);t.build.debugEntry=n}}if(e.target!==void 0){if(!nonBlank(e.target.platform)||!nonBlank(e.target.arch))throw Error(`Invalid standalone build target`);t.target={platform:e.target.platform,arch:e.target.arch}}if(e.plugins!==void 0){if(!stringList(e.plugins.embedded)||!stringList(e.plugins.omitted))throw Error(`Invalid standalone plugin inventory`);t.plugins={embedded:[...e.plugins.embedded],omitted:[...e.plugins.omitted]}}if(e.nativeModules!==void 0){if(!Array.isArray(e.nativeModules)||e.nativeModules.some(e=>!e||!nonBlank(e.name)||!nonBlank(e.version)||!stringList(e.artifacts)||e.qualification!==`unverified`||!nonBlank(e.backend)))throw Error(`Invalid standalone native inventory`);t.nativeModules=e.nativeModules.map(({name:e,version:t,artifacts:n,qualification:r,backend:i})=>({name:e,version:t,artifacts:[...n],qualification:r,backend:i}))}return t}function readStandaloneManifest({executable:e,runtimeRoot:t,includeBuild:n=!1}){let r=e??t;if(!E.isAbsolute(r))return;let i=E.dirname(r),a=E.join(i,`manifest.json`),s;try{s=w(a,`utf8`)}catch(e){if(e?.code===`ENOENT`||e?.code===`ENOTDIR`)return;throw e}let c;try{c=JSON.parse(s)}catch(e){throw Error(`Invalid standalone runtime manifest: ${a}`,{cause:e})}let nonBlank=e=>typeof e==`string`&&e.trim().length>0;if(c?.schemaVersion!==1||![`jit`,`bytecode`,`aot`].includes(c.mode)||!nonBlank(c.executable?.path)||!nonBlank(c.runtime?.path)||!nonBlank(c.openclaw?.version)||!nonBlank(c.bun?.version))throw Error(`Invalid standalone runtime manifest: ${a}`);let l=E.relative(i,E.resolve(i,c.executable.path)),u=E.relative(i,E.resolve(i,c.runtime.path));if(E.isAbsolute(c.executable.path)||!l||l===`..`||l.startsWith(`..${E.sep}`)||e&&E.resolve(i,c.executable.path)!==E.resolve(e)||t&&E.resolve(i,c.runtime.path)!==E.resolve(t)||E.isAbsolute(c.runtime.path)||!u||u===`..`||u.startsWith(`..${E.sep}`))throw Error(`Invalid standalone runtime manifest: ${a}`);return{schemaVersion:1,mode:c.mode,executable:{path:c.executable.path,...nonBlank(c.executable.sha256)?{sha256:c.executable.sha256}:{}},runtime:{path:c.runtime.path,...nonBlank(c.runtime.sha256)?{sha256:c.runtime.sha256}:{}},openclaw:{version:c.openclaw.version,...nonBlank(c.openclaw.commit)?{commit:c.openclaw.commit}:{}},bun:{version:c.bun.version},...n?projectStandaloneBuildInfo(c):{}}}function getEmbeddedStandaloneRuntimeRoot(){let e=globalThis.__openclawStandaloneRootUrl;return typeof e==`string`?j(e):void 0}function isEmbeddedStandaloneModule(e){let t=e.startsWith(`file:`)?j(e):e;return globalThis.__openclawStandaloneIsEmbeddedModule?.(t)===!0}function resolveStandaloneSidecarRoot(e=process.execPath){if(e===process.execPath){let e=getEmbeddedStandaloneRuntimeRoot();if(e!==void 0)return e}let t=readStandaloneRuntimeManifest(e);return t?E.resolve(E.dirname(e),t.runtime.path):void 0}function isStandaloneRuntimeExecutable(e=process.execPath){return resolveStandaloneSidecarRoot(e)!==void 0}function resolveRuntimeScriptEnv(e){return isStandaloneRuntimeExecutable()?{...e,BUN_BE_BUN:`1`}:{...e}}var Ml,Nl=__esmMin((()=>{Al(),Ml=Symbol.for(`openclaw.windowsNativeRedirectStartup`),process.platform===`win32`&&!process.versions.bun&&(globalThis[Ml]??=Object.freeze({execArgv:Object.freeze([...process.execArgv]),appRoot:process.env.OPENCLAW_NATIVE_APP_ROOT,stagedRoot:process.env.OPENCLAW_NATIVE_STAGED_ROOT}))})),Pl,Fl=__esmMin((()=>{si(),Pl=createRuntimeProcessEntrypoints(import.meta.url)}));function resolveRuntimeProcessDistRoot(e){let t=e.replaceAll(E.sep,`/`).lastIndexOf(`/dist/`);return t>=0?e.slice(0,t+6):void 0}var Il=__esmMin((()=>{resolveRuntimeProcessDistRoot(j(import.meta.url))}));function normalizeRuntimeBasename(e){let t=e.trim().replace(/^["']|["']$/g,``),n=Math.max(t.lastIndexOf(`/`),t.lastIndexOf(`\\`));return(n===-1?t:t.slice(n+1)).trim().toLowerCase()}function isNodeRuntime(e){let t=normalizeRuntimeBasename(e);return/^node(?:js)?(?:\.exe)?$/.test(t)||Ll.test(t)}function isBunRuntime(e){let t=normalizeRuntimeBasename(e);return t===`bun`||t===`bun.exe`}function resolveRuntimeScriptPosition(e){let t=[],n=e[0]??``,r=n.replaceAll(`\\`,`/`).trim().toLowerCase().split(`/`).at(-1),i=isBunRuntime(n),a=r===`tsx`||r===`tsx.cmd`,s=i?`run`:a?`watch`:void 0,c,l=[];if(!isNodeRuntime(n)&&!i&&!a)return{position:{kind:`not-runtime`},operands:t,sourceIndices:l};for(let n=1;n<e.length;n++){let r=e[n];if(r===`--`){if(!c)return{position:l.length===0&&e[n+1]?n+1:{kind:`other`},operands:t,sourceIndices:l};t.push(...e.slice(n+1).map(e=>({value:e,module:!1})));break}if(r===`-e`||r===`-p`||/^--(?:eval|print|run)(?:=|$)/.test(r)){r.includes(`=`)||n++,l.push(n);continue}let a=r.indexOf(`=`),u=a<0?r:r.slice(0,a);if(r.startsWith(`-r`)&&!r.startsWith(`--`)&&r.length>2)t.push({value:r.slice(2),module:!0});else if(zl.has(u)){let s=a<0?e[++n]??``:r.slice(a+1),c=!i&&u===`--test-reporter`&&/^(?:dot|spec|tap)$/.test(s);!Rl.has(u)||c||i&&u===`--loader`||t.push({value:s,module:!0})}else if(r.startsWith(`-`)){let e=`--no-${u.replace(/^--(?:no-)?/,``)}`,n=!i&&process.allowedNodeEnvironmentFlags.has(u),s=Bl.has(u)||i&&(u===`--hot`||u===`--no-install`)||n&&process.allowedNodeEnvironmentFlags.has(e);l.length===0&&!s&&!/^--[^=]+=/.test(r)&&(c??={kind:`unclassified`,reason:`unsupported runtime option ${r}`}),a>=0&&!s&&!n&&t.push({value:r.slice(a+1),module:!0})}else if(l.length===0&&r===s)s=void 0;else if(l.length===0){if(!c)return{position:n,operands:t,sourceIndices:l};s=void 0,t.push({value:r,module:!1})}else break}return{position:c??{kind:`other`},operands:t,sourceIndices:c?[]:l}}var Ll,Rl,zl,Bl,Vl=__esmMin((()=>{Ll=/^node(?:-\d+|\d+)(?:\.\d+)*(?:\.exe)?$/,Rl=/* @__PURE__ */ new Set([`-r`,`--preload`,`--require`,`--import`,`--loader`,`--experimental-loader`,`--test-reporter`,`--test-global-setup`]),zl=/* @__PURE__ */ new Set([...Rl,`-C`,`--env-file`,`--env-file-if-exists`,`--tsconfig`,`--cwd`,`--conditions`,`--icu-data-dir`,`--openssl-config`,`--title`,`--disable-warning`,`--disable-proto`,`--cpu-prof-name`,`--max-old-space-size`,`--max-semi-space-size`]),Bl=/* @__PURE__ */ new Set([`--inspect`,`--inspect-brk`,`--inspect-wait`,`--expose-gc`,`--jitless`,`--no-opt`,`--experimental-strip-types`,`--watch`,`--no-warnings`,`--trace-uncaught`,`--bun`])}));function resolveRuntimeWorkerUrl(e){if(e.root!==void 0)return He(E.join(e.root,`dist`,e.distWorkerPath));let t=j(e.currentModuleUrl),n=resolveRuntimeProcessDistRoot(t);if(n!==void 0){let t=e.distWorkerPath;if(e.package){let r=E.resolve(n,`..`),i=nt({rootDir:r,relativePath:`package.json`,boundaryLabel:`runtime worker package`,rejectHardlinks:!1});if(!i.ok)throw Error(`Cannot resolve runtime worker package: ${r}/package.json`);i.value.name===e.package.name&&(t=e.package.distWorkerPath)}return He(E.join(n,t))}let r=e.sourceExtension??(E.extname(t)||`.js`);return new URL(`./${e.sourceWorkerName}${r}`,e.currentModuleUrl)}function isBunTargetRuntime(e){return e===process.execPath?!!process.versions.bun:isBunRuntime(e)}function resolveRuntimeArgs(e=process.execPath){return isBunTargetRuntime(e)?[`--no-install`]:[]}function runtimeNeedsTypeScriptLoader(e,t=process.execPath){return/\.[cm]?ts$/.test(e)&&!isBunTargetRuntime(t)}function resolveRuntimeWorkerArgv(e,t=process.execPath){let n=j(e);return runtimeNeedsTypeScriptLoader(n,t)?[`--import`,import.meta.resolve(`tsx`),n]:[...resolveRuntimeArgs(t),n]}function resolveRuntimeWorkerThreadExecArgv(e,t=process.execPath){return typeof SEALED_RUNTIME_BUILD==`boolean`&&SEALED_RUNTIME_BUILD?[]:e.protocol===`file:`&&runtimeNeedsTypeScriptLoader(j(e),t)?[`--import`,import.meta.resolve(`tsx/esm`)]:[]}var Hl=__esmMin((()=>{Nl(),Il(),Vl()}));function resolveRuntimeProcessEntrypointUrl(e){return Ul.get(e)??resolveRuntimeWorkerUrl(Pl[e])}var Ul,Wl=__esmMin((()=>{Nl(),Fl(),si(),Hl(),Ul=/* @__PURE__ */ new Map}));function createRetainedOperation(e,t={}){let n=Promise.withResolvers(),r=Object.freeze({status:`pending`});return t.observeRejection!==!1&&n.promise.catch(()=>void 0),{operation:{result:n.promise,read:()=>r,service:e},resolve(e){r.status===`pending`&&(r=Object.freeze({status:`fulfilled`,value:e}),n.resolve(e))},reject(e){r.status===`pending`&&(r=Object.freeze({status:`rejected`,error:e}),n.reject(e))}}}function driveRetainedOperation(e,t,n){let r=D.snapshot(),i=!1,serviceInContext=()=>r(service),a=createRetainedOperation(serviceInContext);function service(){if(!(i||a.operation.read().status!==`pending`)){i=!0;try{t(a,serviceInContext)}catch(e){try{a.reject(n?n(e):e)}catch(e){a.reject(e)}}finally{i=!1}}}return e.result.then(serviceInContext,serviceInContext),a.operation.service(),a.operation}function flatMapRetainedOperation(e,t){let n;return driveRetainedOperation(e,(r,i)=>{if(!n){e.service();let r=e.read();if(r.status===`pending`)return;if(r.status===`rejected`)throw r.error;n=t(r.value),n.result.then(i,i)}n.service();let a=n.read();a.status===`fulfilled`?r.resolve(a.value):a.status===`rejected`&&r.reject(a.error)})}var Gl=__esmMin((()=>{}));function createWorkerComputeCapacity(e){if(!Number.isSafeInteger(e)||e<1)throw RangeError(`compute capacity must be a positive safe integer`);let t=/* @__PURE__ */ new Set,n=/* @__PURE__ */ new Set,r=/* @__PURE__ */ new Set,i=0,a=0,s=!1,canAdmit=e=>i<128&&a+e<=268435456,requestCheckpoints=()=>{let e=n.size;if(e){for(let n of t)if(n.requestCheckpoint()&&--e===0)break}},drain=()=>{if(!s){s=!0;try{for(;t.size<e&&n.size;){let e=n.values().next().value;n.delete(e),e()}}finally{s=!1}requestCheckpoints()}};return{getSnapshot:()=>({limit:e,active:t.size,waitingPools:n.size,pendingTasks:i,pendingBytes:a}),canAdmit,subscribeAdmission(e){return r.add(e),()=>r.delete(e)},admit(e){return canAdmit(e)?(i++,a+=e,!0):!1},finish(e){i--,a-=e;for(let e of r)e()},acquire(r,i){if(t.size>=e||!s&&n.size){n.add(r),requestCheckpoints();return}let a={requestCheckpoint:i};return t.add(a),a},release(e){t.delete(e),drain()},remove(e){n.delete(e)},requestCheckpoints}}var Kl,ql=__esmMin((()=>{Kl=268435456}));function workerTaskUnavailableError(e,t,n,r=e.task){let i=e.ready===!1?`startup`:r?.exchange?`exchange`:`running`,a=r?.diagnosticLabel?` [task=${r.diagnosticLabel} admittedInputBytes=${r.inputBytes} exchanges=${r.exchangeSequence} stage=${i}]`:``;return new WorkerTaskError(t+a,`unavailable`,{cause:n})}function workerTaskRetirementError(e,t){return e?AggregateError([e,t],`Worker retirement failed: ${toErrorObject(t,`worker retirement failed`).message}; task failed: ${e.message}`,{cause:t}):t}function workerTaskTimeoutError(e,t){let n=e?.sent===!1?e.name:void 0;n===`unknown`&&(n=t.protocol===`file:`?t.pathname.split(`/`).at(-1)?.slice(0,96)||`worker`:`${t.protocol} worker`);let r=new WorkerTaskError(n?`worker task timed out waiting for host callback ${n}`:`worker task timed out`,`timeout`);return n&&process.emitWarning(r.message,{code:`WORKER_HOST_CALLBACK_TIMEOUT`}),r}var WorkerTaskError,Jl=__esmMin((()=>{F(),WorkerTaskError=class extends Error{constructor(e,t,n){super(e,n),this.code=t,this.name=`WorkerTaskError`,this.capacityAvailable=n?.capacityAvailable}}}));function enqueueWorkerTask(e,t){let n=t.options.pointRead?e.findIndex(e=>!e.options.pointRead):-1;e.splice(n===-1?e.length:n,0,t)}var WorkerTaskAdmission,Yl=__esmMin((()=>{ql(),Jl(),WorkerTaskAdmission=class{constructor(e,t,n){this.maxPendingTasks=e,this.maxPendingBytes=t,this.shared=n,this.taskCount=0,this.byteCount=0,this.closed=!1,this.waiters=/* @__PURE__ */ new Map,this.notify=()=>{for(let[e,t]of this.waiters)(this.closed||this.taskCount<this.maxPendingTasks&&this.byteCount+e<=this.maxPendingBytes&&(!this.shared||this.shared.canAdmit(e)))&&(this.waiters.delete(e),t.resolve());this.waiters.size||(this.stopWatchingCapacity?.(),this.stopWatchingCapacity=void 0)};for(let[n,r]of Object.entries({maxPendingTasks:e,maxPendingBytes:t}))if(!Number.isSafeInteger(r)||r<1)throw RangeError(`${n} must be a positive safe integer`)}get pendingTasks(){return this.taskCount}get pendingBytes(){return this.byteCount}admitTask(e,t){let{pointRead:n,onRequest:r,onRequestSync:i}=e.options;if(n)return r||i?/* @__PURE__ */ TypeError(`Point reads carry their facts and cannot call back into the host`):void 0;let a=this.admit(e.inputBytes,t);return e.admitted=a===void 0,a}admit(e,t){let n;if(this.taskCount>=this.maxPendingTasks)n=`pool pending tasks: pendingTasks=${this.taskCount} maxPendingTasks=${this.maxPendingTasks} inputBytes=${e}`;else if(this.byteCount+e>this.maxPendingBytes)n=`pool pending bytes: pendingBytes=${this.byteCount} maxPendingBytes=${this.maxPendingBytes} inputBytes=${e}`;else if(this.shared&&!this.shared.admit(e)){let{pendingTasks:t,pendingBytes:r}=this.shared.getSnapshot();n=t>=128?`shared compute pending tasks: pendingTasks=${t} maxPendingTasks=128 inputBytes=${e}`:`shared compute pending bytes: pendingBytes=${r} maxPendingBytes=${Kl} inputBytes=${e}`}else{this.taskCount++,this.byteCount+=e;return}let r=t();return new WorkerTaskError(`worker task capacity reached [${r?`task=${r} `:``}${n}]`,`overloaded`,{capacityAvailable:this.waitForCapacity(e)})}finish(e){this.taskCount--,this.byteCount-=e,this.shared?.finish(e),this.notify()}close(){this.closed=!0,this.notify()}waitForCapacity(e){if(e>this.maxPendingBytes||this.shared&&e>268435456)return;let t=this.waiters.get(e);if(t)return t.promise;let n=Promise.withResolvers();return this.waiters.set(e,n),this.stopWatchingCapacity??=this.shared?.subscribeAdmission(this.notify),this.notify(),n.promise}}}));function captureWorkerTaskContext(){let e=new _e(`OpenClaw.WorkerTask`);return t=>e.runInAsyncScope(t)}var Xl=__esmMin((()=>{}));function serviceNativeWorkerPass(e,t){let n=[];for(let e of t)e.native&&n.push(e.native);e.serviceNativeWorkers(n)}var Zl=__esmMin((()=>{}));function createWorkerNativeSectionState(){return new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT))}function cancelWorkerNativeSections(e){Atomics.or(e,0,Ql),Atomics.notify(e,0)}function waitForWorkerNativeSections(e){if(!areWorkerNativeSectionsSettled(e))return(async()=>{for(;;){let t=Atomics.load(e,0);if(t<$l)return;await Atomics.waitAsync(e,0,t).value}})()}function areWorkerNativeSectionsSettled(e){return Atomics.load(e,0)<$l}function releaseWorkerNativeSectionsOnExit(e){Atomics.store(e,0,Ql),Atomics.notify(e,0)}var Ql,$l,eu,tu,nu=__esmMin((()=>{Ql=1,$l=2,eu=Symbol.for(`openclaw.workerTaskNativeSection`),tu=globalThis,tu[eu]??=new D}));function createWorkerTaskPoolBootstrap(e,t,n){let r,admissionError=()=>r&&![...e].some(e=>e.ready===!0&&!e.retiring&&!e.retirementFailed)?r:void 0,rejectQueued=()=>{let e=admissionError();if(!e)return;let r=t.splice(0);for(let t of r)n(t,e)};return{error:()=>r,get admissionError(){return admissionError()},fail(e){r??=e,rejectQueued()},rejectQueued,reset:()=>{r=void 0}}}var ru=__esmMin((()=>{}));function isPromiseLike(e){if(e===null||typeof e!=`object`&&typeof e!=`function`)return!1;try{return typeof e.then==`function`}catch{return!1}}var iu=__esmMin((()=>{}));function createWorkerHostExchange(e,t){let n=isRecord(t)?t.kind??t.type:t;return e.exchange={id:++e.exchangeSequence,name:typeof n==`string`&&/^[a-zA-Z][a-zA-Z0-9._:-]{0,95}$/.test(n)?n:`unknown`,pressure:new AbortController,sent:!1,onConsumed:void 0}}function dispatchOwnedWorkerRequest(e,t,n,r,i){let a={signal:(e.controller??=new AbortController).signal,yieldSignal:r.pressure.signal},assertCurrent=()=>{if(e.done||t.task!==e)throw new WorkerTaskError(`worker task closed before host dispatch`,`unavailable`)};if(e.options.onRequestSync)try{assertCurrent(),i.accept(e.options.onRequestSync(n,a))}catch(e){i.reject(e)}else Promise.resolve().then(()=>(assertCurrent(),e.options.onRequest(n,a))).then(i.accept).catch(i.reject)}async function joinOwnedWorkerTasks(e){let t=(await Promise.allSettled(e)).flatMap(e=>e.status===`rejected`?[e.reason]:[]);if(t.length===1)throw t[0];if(t.length>1)throw AggregateError(t,`Worker task cleanup failed`)}function joinOwnedWorkerTask(e,t,n=!1){return startJoinOwnedWorkerTask(e,t,n).result}function startJoinOwnedWorkerTask(e,t,n){let r=startCloseOwnedWorkerTask(e,t,n),observe=()=>{let n=r.read();if(n.status===`pending`)return n;if(n.status===`rejected`&&e.owner?.closing===r&&(e.owner.closing=void 0),e.owner?.closed){let n=e.slot;e.slot=void 0,t.release(e,n)}return n},i=r.result.then(()=>{observe()},e=>{throw observe(),e});return i.catch(()=>void 0),{result:i,read:observe,service(){r.service(),observe()}}}function closeOwnedWorkerTask(e,t,n=!1){return startCloseOwnedWorkerTask(e,t,n).result}function startCloseOwnedWorkerTask(e,t,n){let r=e.owner;if(!r||r.closed){if(r?.closing)return r.closing;let e=createRetainedOperation(()=>{});return e.resolve(),e.operation}if(r.retire||=n,r.closing)return r.closing;let i,a,s=!1,c=createRetainedOperation(()=>{i?.service(),advance()}),advance=()=>{if(!(s||c.operation.read().status!==`pending`)){s=!0;try{if(e.preparation){a!==e.preparation.promise&&(a=e.preparation.promise,a.then(advance,c.reject));return}let n=e.slot;if(n&&r.retire){i||(i=t.retire(n),i.result.then(advance,advance));let e=i.read();if(e.status===`pending`)return;if(e.status===`rejected`)throw e.error}t.detach(e);try{r.complete?.()}finally{r.closed=!0,r.complete=void 0,r.onCloseError=void 0,e.input=void 0,e.options={},e.abort=()=>{}}c.resolve()}catch(e){r.onCloseError?.(e),c.reject(e)}finally{s=!1}}};return r.closing=c.operation,e.done||t.cancel(e),advance(),c.operation}function retainWorkerTask(e,t,n){return{result:e.promise,read:()=>e.read(),service:n,release:r=>{let i=startJoinOwnedWorkerTask(e,t,r?.retire===!0);return{result:i.result,read:()=>i.read(),service:()=>{n(),i.service()}}}}}function prepareWorkerTaskInput(e,t,n,r){let i=e.input;e.input=void 0;let a=Promise.withResolvers();e.preparation=a;let finishPreparation=()=>{a.resolve(),e.preparation===a&&(e.preparation=void 0)},failed=e=>{finishPreparation(),n(e)},s;try{s=typeof i==`function`?i():i}catch(e){failed(e);return}r&&(s=Promise.resolve(s).then(async e=>(await r(),e)));let ready=e=>{finishPreparation(),t(e)};isPromiseLike(s)?Promise.resolve(s).then(ready,failed):ready(s)}function armWorkerTaskTimeout(e,t,n,r){if(t===void 0||r&&(e.options.timeoutFrom??`enqueue`)!==r)return;clearTimeout(e.timer);let i=performance.now();e.deadline=Math.min(e.options.hostTimeout!==`owner`&&e.options.timeoutMs!==void 0?e.deadline??(e.options.timeoutFrom===`dispatch`?i:e.enqueuedAt)+resolveTimerTimeoutMs(e.options.timeoutMs,6e4):1/0,i+resolveTimerTimeoutMs(t,6e4)),e.timer=setTimeout(n,Math.max(0,e.deadline-i),e)}function expireWorkerTasks(e,t,n){let r=performance.now(),i=[...e,...[...t].flatMap(e=>e.task?[e.task]:[])];for(let e of i)!e.done&&e.deadline!==void 0&&r>=e.deadline&&n(e)}var au=__esmMin((()=>{Wn(),iu(),B(),Gl(),Jl()}));function joinWorkerTaskPreparationCleanups(e,t){return joinOwnedWorkerTasks([...[...e.preparationCleanups].map(([t,n])=>n.finally(()=>{e.preparationCleanups.delete(t)&&e.releaseAdmission(t)})),t.then(()=>void 0)])}function notifyExecutionSettled(e){try{e.executionNotified||(e.executionNotified=!0,e.options.onExecutionSettled?.({retired:e.slot?.retired===!0}))}catch(e){return toErrorObject(e,`worker settlement receipt failed`)}}function createWorkerTaskCompletion(e,t,n,r){let i=e.slot,a=i?.native,s=a?.taskChannelFailure,c=i&&a&&s&&n&&(n===s||n.cause===s)?()=>{let t=a.terminalFailure;return t?workerTaskUnavailableError(i,String(t),t,e):a.executionStopped?workerTaskUnavailableError(i,`${s.message}; worker exited with code ${a.executionExitCode}`,s,e):n}:void 0;e.owner&&c&&(e.owner.onCloseError=t=>e.reject(workerTaskRetirementError(c(),t)));let l=e.owner?void 0:e.preparation,u,complete=()=>{!e.owner&&!l&&t.releaseAdmission(e);let i=c?.()??n;try{return completeWorkerTask(e,t,i,r,u)}finally{e.owner&&c&&e.reject(i)}};if(!l)return{complete,resolveFailure:c};let d=Promise.withResolvers();return t.preparationCleanups.set(e,d.promise),d.promise.catch(()=>void 0),{resolveFailure:c,complete:()=>{u=e.runInContext(()=>notifyExecutionSettled(e)),n&&e.reject(c?.()??n),l.promise.then(()=>{let n=complete();if(n)throw n;t.preparationCleanups.delete(e),t.releaseAdmission(e),d.resolve()}).catch(d.reject)}}}function completeWorkerTask(e,t,n,r,i){return e.runInContext(()=>{let a=n??i,s=i?[i]:[];try{e.inputConsumed||(e.inputConsumed=!0,e.options.onInputConsumed?.());let t=e.exchange?.onConsumed;e.exchange=void 0,t?.()}catch(e){let t=toErrorObject(e,`worker input release failed`);s.push(t),a??=t}let c=notifyExecutionSettled(e);c&&(s.push(c),a??=c);let l=e.computePermit;if(e.computePermit=void 0,l&&t.releaseCompute(l),ou.hasSubscribers){let n=performance.now();ou.publish({...t.diagnostics(),outcome:a?`failed`:`ok`,queueMs:(e.startedAt??n)-e.enqueuedAt,preparationMs:e.startedAt===void 0?0:(e.preparedAt??n)-e.startedAt,runMs:e.preparedAt===void 0?0:n-e.preparedAt,transferMs:e.transferMs,hostWaitMs:e.hostWaitMs})}let u=s[0],d=s.length>1?AggregateError(s,`Worker task cleanup failed`,{cause:u}):u;if(e.owner){if(d)throw d}else a?e.reject(a):e.resolve(r);return d})}var ou,su=__esmMin((()=>{F(),Jl(),au(),ou=Ke(`openclaw.worker.task`)}));function startCloseWorkerPoolResources(e,t,n,r,i,a,s){let c=[...e].map(e=>{if(e.retiring)return e.retiring;if(e.native?.executionStopped)return n(e);let c=e.worker;if(!c){let e=createRetainedOperation(()=>{});return e.resolve(),e.operation}let l=t.get(c)??{pending:0};return l.pending++,t.set(c,l),c.ref(),startCloseWorkerTaskResources(e,c,l,i,a,n,r,s)}),l=createRetainedOperation(()=>{for(let e of c)e.service();advance()}),advance=()=>{let e=c.map(e=>e.read());if(e.some(e=>e.status===`pending`))return;let t=e.flatMap(e=>e.status===`rejected`?[e.error]:[]);t.length?l.reject(AggregateError(t,`Worker resource cleanup failed`)):l.resolve()};for(let e of c)e.result.then(advance,advance);return advance(),l.operation}function observeResourceWorkerExit(e,t,n){let r=t.exit;if(!r){let n=/* @__PURE__ */ new Set;r={waiters:n,receive:()=>{for(let e of n)e()}},t.exit=r,e.once(`exit`,r.receive)}return r.waiters.add(n),()=>{r.waiters.delete(n),r.waiters.size||(e.removeListener(`exit`,r.receive),t.exit===r&&(t.exit=void 0))}}function startCloseWorkerTaskResources(e,t,n,r,i,a,s,c){let{port1:l,port2:u}=s(()=>new M),d=D.snapshot(),f=!1,p=!1,m,h=createRetainedOperation(()=>{if(f)return;for(e.native?.service(),e.native?.executionStopped&&(p=!0,m??=e.retiring??a(e));;){let e=Qe(l);if(!e||f)break;receive(e.message)}let t=m??e.retiring;if(p&&t){t.service();let e=t.read();e.status===`fulfilled`?finish():e.status===`rejected`&&finish(toErrorObject(e.error,`Worker resource cleanup retirement failed`))}}),finish=r=>d(()=>{f||(f=!0,g(),l.close(),u.close(),n.pending--,n.pending||e.task||e.retiring||t.unref(),r?h.reject(r):h.resolve(),d=s)}),receive=e=>d(()=>{c?.();try{if(isRecord(e)&&e.ok===!0){finish();return}let t=isRecord(e)&&e.detail!==void 0&&i?.decodeResourceError?i.decodeResourceError(e.detail):Error(isRecord(e)&&typeof e.error==`string`?e.error:`Invalid worker resource cleanup receipt`);finish(t)}catch(e){finish(toErrorObject(e,`Worker resource cleanup receipt could not be decoded`))}}),g=observeResourceWorkerExit(t,n,()=>finish());l.once(`message`,receive),l.once(`messageerror`,e=>finish(toErrorObject(e,`Worker resource cleanup receipt could not be decoded`))),l.once(`close`,()=>{if(f)return;let t=e.retiring;t?(p=!0,m=t,t.result.then(()=>finish(),e=>finish(toErrorObject(e,`Worker resource cleanup retirement failed`)))):finish(/* @__PURE__ */ Error(`Worker resource cleanup closed without a receipt`))});try{t.postMessage({closeResource:!0,key:r,resourcePort:u},[u])}catch(e){finish(toErrorObject(e,`Worker resource cleanup could not be sent`))}return h.operation}var cu=__esmMin((()=>{F(),B(),Gl()}));function isWorkerIdleForPressure(e,t=!1){return e!==void 0&&(t||performance.now()-e>=1e3)}function createWorkerIdleTimers(e){let t=setTimeout,n=clearTimeout;return{clear(e){n(e.idleTimer),e.idleTimer=void 0},arm(n,r,i){n.idleTimer||(n.idleTimer=e(()=>t(()=>{n.idleTimer=void 0,i()},r)),n.idleTimer.unref())}}}function createWorkerTaskPoolRetirement({slots:e,options:t,retainOneIdleWorker:n,runInContext:r,dispatch:i,onRotationComplete:a,serviceDeadlines:s,markWorkerRetirement:c,serviceHost:l}){let u=/* @__PURE__ */ new Map,d=-1/0,f,p=-1/0,m,h,g=!1,_=createWorkerIdleTimers(r),v=performance.now.bind(performance),y=n?/* @__PURE__ */ new Set:void 0;function newestIdle(){if(!y)return;let e;for(let t of y)e=t;return e}function clearIdle(e){e.idleSince=void 0,y?.delete(e),_.clear(e)}let isBurstSlot=n=>{if(t.burstIdleTimeoutMs!==void 0){for(let t of e)if(!t.retiring&&!t.retirementFailed)return t!==n}return!1};function startRotate(){if(h)return h;let t=D.snapshot(),n,r,c=!1,u=createRetainedOperation(()=>{serviceNativeWorkerPass(l,f),s();for(let e of n??[])e.service();r?.service(),advance()});h=u.operation,g=!1;let f=[...e],m=f.flatMap(e=>e.task?[e.task]:[]),advance=()=>t(()=>{if(!(c||u.operation.read().status!==`pending`)){c=!0;try{if(m.some(e=>e.read().status===`pending`))return;if(!n){n=f.map(e=>startRetire(e,`rotation`));for(let e of n)e.result.then(advance,advance)}for(let e of n){let t=e.read();if(t.status===`rejected`)throw t.error;if(t.status===`pending`)return}r||(r=startJoinArtifacts(),r.result.then(advance,advance));let e=r.read();if(e.status===`pending`)return;if(e.status===`rejected`)throw e.error;d=-1/0,p=-1/0,h=void 0,a(),u.resolve(),i()}catch(e){h=void 0,g=!0,u.reject(e)}finally{c=!1}}});for(let e of m)e.promise.then(advance,advance);return advance(),u.operation}function startRetire(n,a=`closed`){if(a===`idle_timeout`&&(isBurstSlot(n)?p=v():d=v()),f===n&&(f=void 0),m===n&&(m=void 0),n.worker&&c(n.worker,a),clearIdle(n),cancelWorkerNativeSections(n.nativeSections),n.retiring)return n.retiring;let s=D.snapshot(),h,g,_=!1,y=!1,b=createRetainedOperation(()=>{h?.service(),advance()}),advance=()=>s(()=>{if(!(y||b.operation.read().status!==`pending`)){y=!0;try{if(n.creating)return;if(!areWorkerNativeSectionsSettled(n.nativeSections)){_||(_=!0,Promise.resolve(waitForWorkerNativeSections(n.nativeSections)).then(advance,b.reject));return}if(n.worker&&!h){c(n.worker,a);try{if(g===void 0&&(g=l.flushWorkerDiagnostics?.(n.worker,a)??null,g?.result.then(advance,advance)),g?.service(),g?.read().status===`pending`)return}catch{g=null}if(n.native)h=n.native.stop();else{let e=createRetainedOperation(()=>{});h=e.operation,Promise.resolve().then(()=>n.worker.terminate()).then(()=>e.resolve(),e.reject)}if(l.workerStopped){let e=n.worker;h=flatMapRetainedOperation(h,()=>{let t=createRetainedOperation(()=>{}),n=l.workerStopped?.(e);return n?n.then(()=>t.resolve(),t.reject):t.resolve(),t.operation})}h.result.then(advance,advance)}let t=h?.read();if(t?.status===`pending`)return;if(t?.status===`rejected`)throw t.error;n.retired=!0;let s=n.releaseResources;s&&r(()=>{let e=(async()=>{try{await s()}catch(e){try{process.emitWarning(`Worker task resource release failed: ${String(e)}`)}catch{}}})(),t=createRetainedOperation(()=>{});u.set(e,t.operation),e.then(()=>{u.delete(e),t.resolve()},t.reject)}),n.worker?.removeAllListeners(),e.delete(n);for(let e of n.completions??[])e();n.completions=void 0,i(),b.resolve()}catch(e){try{Promise.resolve(t.onRetirementFailure?.(e)).catch(()=>void 0)}catch{}n.retirementFailed=!0,n.retiring=void 0,b.reject(e)}finally{y=!1}}});return n.retiring=b.operation,Promise.resolve().then(advance),b.operation}function retire(e,t){return startRetire(e,t).result}function startJoinArtifacts(){let e=[...u.values()],t=createRetainedOperation(()=>{for(let t of e)t.service();advance()}),advance=()=>{let n=e.map(e=>e.read()),r=n.find(e=>e.status===`rejected`);r?.status===`rejected`?t.reject(r.error):n.every(e=>e.status===`fulfilled`)&&t.resolve()};for(let t of e)t.result.then(advance,advance);return advance(),t.operation}async function retryFailedRetirements(){let t=await Promise.allSettled([...e].filter(e=>e.retirementFailed).map(e=>retire(e)));t.push(...await Promise.allSettled(u.keys()));let n=t.flatMap(e=>e.status===`rejected`?[toErrorObject(e.reason,`worker retirement retry failed`)]:[]),r=n[0];if(r)throw n.length===1?r:AggregateError(n,`Worker retirement retries failed`,{cause:r})}function idle(e,n=0){let r=isBurstSlot(e),i=(r?t.burstIdleTimeoutMs:t.idleTimeoutMs)??6e4;if(e.idleSince??=v()-n,i<=0)return;if(y&&!y.has(e)){let t=newestIdle();y.add(e),t&&!t.idleTimer&&retire(t,`idle_timeout`).catch(()=>void 0)}!r&&!f&&v()-d<lu&&(f=e),r&&(!m||!isBurstSlot(m))&&v()-p<lu&&(m=e);let a=r?v():0,s=r?m===e?i*3:i:f===e?Math.max(i,lu):i;_.arm(e,Math.max(0,s-n),()=>{newestIdle()!==e&&(r&&!isBurstSlot(e)?idle(e,v()-a):retire(e,`idle_timeout`).catch(()=>void 0))})}return{get preferredIdle(){return newestIdle()},get dispatchAllowed(){return h===void 0&&!g},startRotate,retire,startRetire,service(){let t=[...e];for(let e of t)e.retiring?.service();h?.service()},clearIdle,idle,retireIdle(t,n=!1){for(let r of e)!r.task&&!r.retiring&&!r.retirementFailed&&r.worker&&isWorkerIdleForPressure(r.idleSince,n)&&!t.get(r.worker)?.pending&&retire(r,`memory_pressure`).catch(()=>void 0)},retryFailedRetirements,joinArtifacts:()=>startJoinArtifacts().result}}var lu,uu=__esmMin((()=>{F(),Gl(),Zl(),nu(),lu=3e5}));function sendWorkerTaskInput(e){let{slot:t,task:n,input:r}=e;if(n.done)return;n.preparedAt=performance.now();let i=e.bootstrapError();if(i&&!t.worker)e.refuse(i);else try{let i=t.worker;if(!i){t.creating=!0;try{i=e.createWorker()}catch(t){e.fail(t,!0);return}finally{t.creating=!1}}let a=n.options.transferList?.(r);if(!n.done){let s=e.host.captureTaskContext(i),c=[...a??[],...e.host.taskContextTransferList?.(s)??[]],l=performance.now(),u=n.options.progressSignal;i.postMessage({input:r,taskId:n.id,interactive:!!(n.options.onRequest||n.options.onRequestSync||n.options.onNotification),nativeSections:t.nativeSections.buffer,...u?{progressSignal:u}:{},taskContext:s,sampleMemory:!0},c),n.transferMs+=performance.now()-l}}catch(t){e.fail(t)}}function createWorkerTaskPoolWorker(e){let{slot:t,options:n}=e,r=e.host.captureWorkerStartObserver?.(n.workerUrl),i=e.runInContext(()=>{let r=n.prepareWorker?.();t.releaseResources=r?.releaseResources;let i=r?.temporaryDirectory;if(i){let n=e.host.prepareResources(),r=t.releaseResources;t.releaseResources=async()=>{try{await n,await e.host.releaseTemporaryDirectory(i)}finally{await r?.()}}}let a=n.workerUrl,s={...n.workerOptions,...r?.options};e.host.requiresReady&&(t.ready=!1);let c=e.host.createWorker(a,s);return t.native=c.native,c.worker}),a=!1,started=()=>{a||(a=!0,e.onStarted(i),r?.(),r=void 0)};return t.native?(t.native.on(`started`,started),t.native.on(`execution-exit`,n=>{releaseWorkerNativeSectionsOnExit(t.nativeSections),t.retiring||e.onFailure(e.unavailableError(`worker exited with code ${n}`),!0)})):started(),t.worker=i,i.on(`message`,n=>{if(e.host.receiveMessage(i,n))return;if(t.ready===!1){isRecord(n)&&n.status===`ready`?t.ready=!0:e.onFailure(e.unavailableError(`worker task server did not become ready`),!0);return}let r=t.task;r?r.runInContext(()=>e.onMessage(n)):e.onMessage(n)}),i.on(`error`,t=>e.onFailure(e.unavailableError(String(t),t),!0)),i.on(`messageerror`,t=>e.onFailure(e.unavailableError(String(t),t))),i.once(`exit`,n=>{releaseWorkerNativeSectionsOnExit(t.nativeSections);let r=a;a=!1,e.onExit(n,r)}),i}var du=__esmMin((()=>{B(),nu()})),fu,pu,WorkerTaskPoolCore,mu=__esmMin((()=>{F(),B(),Gl(),Yl(),ql(),Xl(),Jl(),Zl(),nu(),ru(),su(),au(),cu(),uu(),du(),fu=D.snapshot(),pu=Ke(`openclaw.memory.critical`),WorkerTaskPoolCore=class{constructor(e,t,n,r={}){if(this.options=e,this.host=t,this.publicDispatch=n,this.ownerOptions=r,this.slots=/* @__PURE__ */ new Set,this.ownedTasks=/* @__PURE__ */ new Set,this.resourceClosures=/* @__PURE__ */ new WeakMap,this.ownedSettlement={cancel:e=>this.cancel(e,new WorkerTaskError(`worker task closed`,`unavailable`)),detach:e=>{e.slot?.task===e&&(e.slot.task=void 0,this.activeTasks--)},retire:e=>this.retirement.startRetire(e),release:(e,t)=>{this.ownedTasks.delete(e)&&(this.releaseAdmission(e),e.runInContext=fu,this.dispatch(),t&&!e.owner?.retire&&!t.task&&!t.retiring&&this.idle(t))}},this.completion={preparationCleanups:/* @__PURE__ */ new Map,releaseAdmission:e=>this.releaseAdmission(e),releaseCompute:e=>this.computeCapacity.release(e),diagnostics:()=>({worker:this.options.workerUrl.pathname.split(`/`).at(-1),...this.publicDispatch?.getSnapshot()??this.getSnapshot(),pendingBytes:this.admission.pendingBytes})},this.queue=[],this.bootstrap=createWorkerTaskPoolBootstrap(this.slots,this.queue,(e,t)=>this.finish(e,t)),this.workers=0,this.workersCreated=0,this.activeTasks=0,this.resumeCompute=()=>this.dispatch(),this.nextTaskId=0,this.retireIdleOnPressure=e=>this.retirement.retireIdle(this.resourceClosures,e===!0),this.expireTasks=()=>expireWorkerTasks(this.queue,this.slots,this.timeout),this.retryFailedRetirements=()=>this.retirement.retryFailedRetirements(),this.timeout=e=>{e.done||this.cancel(e,workerTaskTimeoutError(e.exchange,this.options.workerUrl))},this.observeTask=t.createTaskObserver?.(e.workerUrl),this.maxWorkers=t.maxWorkers??e.maxWorkers??Te(),!Number.isSafeInteger(this.maxWorkers)||this.maxWorkers<1)throw RangeError(`maxWorkers must be a positive safe integer`);this.computeCapacity=e.sharedCompute?t.computeCapacity:void 0,this.admission=new WorkerTaskAdmission(e.maxPendingTasks??128,e.maxPendingBytes??268435456,this.computeCapacity),this.retirement=createWorkerTaskPoolRetirement({slots:this.slots,options:e,retainOneIdleWorker:r.retainOneIdleWorker,runInContext:fu,dispatch:()=>this.dispatch(),onRotationComplete:()=>{this.bootstrap.reset(),e.onRotationComplete?.()},serviceDeadlines:this.expireTasks,markWorkerRetirement:(e,n)=>t.workerRetiring(e,n),serviceHost:t}),t.pools.register(this)}run(e,t){if(this.closedError)return Promise.reject(this.closedError);let n=t.inputBytes??0;return!Number.isSafeInteger(n)||n<0?Promise.reject(/* @__PURE__ */ RangeError(`inputBytes must be a nonnegative safe integer`)):this.enqueue(e,t,!1,n).promise}runTask(e,t){let n=this.enqueue(e,t,!0);return{result:n.promise,close:e=>joinOwnedWorkerTask(n,this.ownedSettlement,e?.retire===!0)}}startTask(e,t){if(!this.ownerOptions.retainedTransport)throw new WorkerTaskError(`Retained tasks require their native lifetime transport`,`unavailable`);return retainWorkerTask(this.enqueue(e,t,!0),this.ownedSettlement,()=>this.service())}service(){serviceNativeWorkerPass(this.host,this.slots),this.expireTasks(),this.retirement.service();for(let e of Array.from(this.ownedTasks))e.owner?.closing?.service();this.dispatch()}enqueue(e,t,n,r=t.inputBytes??0){let i=createRetainedOperation(()=>this.service(),{observeRejection:this.ownerOptions.retainedTransport===!0}),a={promise:i.operation.result,resolve:i.resolve,reject:i.reject,read:()=>i.operation.read(),id:++this.nextTaskId,runInContext:captureWorkerTaskContext(),controller:void 0,inputConsumed:!1,executionNotified:!1,exchangeSequence:0,input:e,options:{...t},abort:()=>this.cancel(a,toErrorObject(t.signal?.reason,`worker task aborted`)),done:!1,admitted:!1,...n?{owner:{closed:!1,retire:!1}}:{},inputBytes:r,enqueuedAt:performance.now(),transferMs:0,hostWaitMs:0};n&&this.ownedTasks.add(a);let s=this.closedError??this.bootstrap.admissionError;if(s||!Number.isSafeInteger(r)||r<0)return this.finish(a,s??/* @__PURE__ */ RangeError(`inputBytes must be a nonnegative safe integer`)),a;let c=this.admission.admitTask(a,()=>this.host.describeTask?.(this.options.workerUrl,void 0,t.diagnosticOperation));return c?(this.finish(a,c),a):(a.observation=this.observeTask?.(a.options.diagnosticOperation),armWorkerTaskTimeout(a,t.timeoutMs,this.timeout,`enqueue`),t.signal?.addEventListener(`abort`,a.abort,{once:!0}),enqueueWorkerTask(this.queue,a),t.signal?.aborted?a.abort():this.dispatch(),a)}get isClosed(){return this.closedError!==void 0}getSnapshot(){return{maxWorkers:this.maxWorkers,workers:this.workers,workersCreated:this.workersCreated,activeTasks:this.activeTasks,pendingTasks:this.admission.pendingTasks}}startCloseResources(e){return startCloseWorkerPoolResources(this.slots,this.resourceClosures,e=>this.ownedSettlement.retire(e),fu,e,this.ownerOptions,this.host.observeResourceReply)}rotate(){return this.startRotate().result}startRotate(){return this.computeCapacity?.remove(this.resumeCompute),this.retirement.startRotate()}close(e=new WorkerTaskError(`worker task pool closed`,`unavailable`),t=`closed`){this.closedError??=e,this.admission.close(),pu.unsubscribe(this.retireIdleOnPressure),this.computeCapacity?.remove(this.resumeCompute);for(let e of this.queue.splice(0))this.finish(e,this.closedError);for(let e of this.slots)e.worker&&this.host.workerRetiring(e.worker,t),e.task&&!e.task.owner&&this.finish(e.task,this.closedError,void 0,!0);let n=[...this.ownedTasks],r=new Set(n.flatMap(e=>e.slot?.task===e?[e.slot]:[])),i=n.map(e=>joinOwnedWorkerTask(e,this.ownedSettlement,!0)),a=[...this.slots].filter(e=>!r.has(e)),s=[...i,...a.map(e=>this.retirement.retire(e,t))];return this.host.pools.close(this,s,()=>joinWorkerTaskPreparationCleanups(this.completion,this.retirement.joinArtifacts()))}dispatch(){for(this.slots.size||pu.unsubscribe(this.retireIdleOnPressure),this.queue.length&&!this.closedError&&this.retirement.dispatchAllowed||this.computeCapacity?.remove(this.resumeCompute);!this.closedError&&this.retirement.dispatchAllowed&&this.queue.length;){let e=this.queue[0],t=this.maxWorkers+Number(e.options.pointRead===!0),n=this.activeTasks<t?this.retirement.preferredIdle:void 0;if(n??=[...this.slots].find(e=>this.activeTasks<t&&!e.task&&!e.retiring&&!e.retirementFailed&&(!this.bootstrap.error()||e.worker)),!n){let e=this.bootstrap.error();if(e&&this.bootstrap.rejectQueued(),e||this.slots.size>=t){let e=this.queue.length;for(let t of this.slots)t.task?.exchange&&!t.task.exchange.sent&&!t.task.exchange.pressure.signal.aborted&&e-->0&&t.task.exchange.pressure.abort();return}}if(this.computeCapacity&&!e.options.pointRead){let t=this.computeCapacity.acquire(this.resumeCompute,()=>e.exchange&&!e.exchange.sent&&!e.exchange.pressure.signal.aborted?(e.runInContext(()=>e.exchange?.pressure.abort()),!0):!1);if(!t)return;e.computePermit=t}n||(n={nativeSections:createWorkerNativeSectionState()},this.slots.add(n)),this.retirement.clearIdle(n);let r=this.queue.shift();n.task=r,this.activeTasks++,r.slot=n,r.startedAt=performance.now(),armWorkerTaskTimeout(r,r.options.timeoutMs,this.timeout,`dispatch`),r.observation?.started(),r.runInContext(()=>{try{n.worker?.ref()}catch(e){this.fail(n,toErrorObject(e,`worker reference failed`));return}prepareWorkerTaskInput(r,e=>{r.diagnosticLabel=this.host.describeTask?.(this.options.workerUrl,e),sendWorkerTaskInput({slot:n,task:r,input:e,host:this.host,bootstrapError:this.bootstrap.error,createWorker:()=>this.createWorker(n),fail:(e,t)=>this.fail(n,workerTaskUnavailableError(n,String(e),e),t),refuse:e=>this.finish(r,e,void 0,!0)})},e=>this.finish(r,toErrorObject(e,`worker task preparation failed`)),!n.worker&&this.options.prepareWorker?()=>fu(()=>this.host.prepareResources()):void 0)})}}createWorker(e){return(this.options.idleTimeoutMs??6e4)>0&&(pu.unsubscribe(this.retireIdleOnPressure),pu.subscribe(this.retireIdleOnPressure)),createWorkerTaskPoolWorker({slot:e,options:this.options,host:this.host,runInContext:fu,unavailableError:(t,n)=>workerTaskUnavailableError(e,t,n),onStarted:e=>{this.workers++,this.workersCreated++,this.host.workerStarted(e,this)},onMessage:t=>this.receive(e,t),onFailure:(t,n)=>this.fail(e,t,n),onExit:(t,n)=>{n&&this.workers--;let r=workerTaskUnavailableError(e,`worker exited with code ${t}`);this.fail(e,r,!0)}})}receive(e,t){if(e.retiring)return;let n=e.task;if(n&&isRecord(t)&&(t.status===`request`||t.status===`consumed`||t.status===`notification`)){try{this.receiveExchange(e,n,t)}catch(t){this.fail(e,toErrorObject(t,`worker consumption callback failed`))}return}if(!n||!isRecord(t)||(n.options.onRequest||n.options.onRequestSync||t.taskId!==void 0)&&t.taskId!==n.id||t.status!==`ok`&&t.status!==`failed`){this.fail(e,new WorkerTaskError(`invalid worker task response`,`unavailable`));return}let r=t,i=!!(n.exchange||n.options.onInputConsumed&&!n.inputConsumed);if(r.status===`failed`)this.finish(n,new WorkerTaskError(r.error,`failed`),void 0,i);else{try{this.options.validateResult?.(r.value)}catch(t){this.fail(e,toErrorObject(t,`worker result validation failed`));return}this.finish(n,void 0,r.value,i)}}receiveExchange(e,t,n){if(n.taskId!==t.id){this.fail(e,new WorkerTaskError(`stale worker exchange`,`unavailable`));return}if(n.status===`notification`){t.options.onNotification?.(n.value);return}if(n.status===`consumed`){if(n.id===0&&!t.inputConsumed){t.inputConsumed=!0;let e=t.options.onInputConsumed;t.options.onInputConsumed=void 0,e?.()}else if(t.exchange?.sent&&n.id===t.exchange.id){let e=t.exchange.onConsumed;t.exchange=void 0,e?.()}else this.fail(e,new WorkerTaskError(`invalid worker consumption receipt`,`unavailable`));return}if(!t.options.onRequest&&!t.options.onRequestSync||t.exchange||!Number.isSafeInteger(n.id)||n.id!==t.exchangeSequence+1){this.fail(e,new WorkerTaskError(`invalid worker exchange`,`unavailable`));return}t.options.hostTimeout===`owner`&&(clearTimeout(t.timer),t.deadline=void 0);let r=createWorkerHostExchange(t,n.value);t.hostWaitStartedAt=performance.now(),this.dispatch(),this.computeCapacity?.requestCheckpoints(),dispatchOwnedWorkerRequest(t,e,n.value,r,{accept:n=>{if(!t.done&&t.deadline!==void 0&&performance.now()>=t.deadline&&this.timeout(t),t.done||e.task!==t||e.retiring){let release=()=>{try{t.runInContext(()=>n.onConsumed?.())}catch{}};this.slots.has(e)?(e.completions??=[]).push(release):release()}else{this.finishHostWait(t),r.onConsumed=n.onConsumed,r.sent=!0,armWorkerTaskTimeout(t,n.timeoutMs,this.timeout);try{e.worker.postMessage({taskId:t.id,responseId:r.id,input:n.input},n.transferList)}catch(t){this.fail(e,toErrorObject(t,`worker response delivery failed`))}}},reject:n=>{!t.done&&e.task===t&&this.fail(e,toErrorObject(n,`worker host exchange failed`))}})}cancel(e,t){e.done||(e.slot?(e.slot.worker&&this.host.workerRetiring(e.slot.worker,`cancelled`),e.owner?this.finish(e,t,void 0,!0):this.fail(e.slot,t)):(this.queue.splice(this.queue.indexOf(e),1),this.finish(e,t)))}fail(e,t,n){e.retiring||(n&&e.ready===!1&&this.bootstrap.fail(t),e.worker&&this.host.workerRetiring(e.worker,`failure`),e.task?.owner?e.task.done?e.task.owner.retire||closeOwnedWorkerTask(e.task,this.ownedSettlement,!0).catch(()=>void 0):this.finish(e.task,t,void 0,!0):this.options.restartOnError===!1?(this.publicDispatch?.close(t)??this.close(t)).catch(()=>void 0):e.task?this.finish(e.task,t,void 0,!0):this.retirement.retire(e).catch(()=>void 0))}finishHostWait(e){let t=e.hostWaitStartedAt;t!==void 0&&(e.hostWaitStartedAt=void 0,e.hostWaitMs+=performance.now()-t)}finish(e,t,n,r=!1){if(e.done)return;this.finishHostWait(e),e.done=!0,e.observation?.completed(),e.observation=void 0,e.runInContext(()=>e.controller?.abort(t)),clearTimeout(e.timer),e.deadline=void 0,e.options.signal?.removeEventListener(`abort`,e.abort);let i=e.slot,{complete:a,resolveFailure:s}=createWorkerTaskCompletion(e,this.completion,t,n);e.owner?(e.owner.complete=a,e.owner.retire||=r||!!(t&&e.slot&&e.preparedAt!==void 0),t?(!s||e.preparation)&&e.reject(s?.()??t):e.resolve(n),(t||r)&&closeOwnedWorkerTask(e,this.ownedSettlement).catch(()=>void 0)):i&&(i.task=void 0,this.activeTasks--,r)?((i.completions??=[]).push(a),this.retirement.retire(i,`failure`).catch(n=>e.reject(workerTaskRetirementError(s?.()??t,n)))):(a(),this.dispatch(),i&&!i.task&&!i.retiring&&this.idle(i))}releaseAdmission(e){e.admitted&&(e.admitted=!1,this.admission.finish(e.inputBytes))}idle(e){e.worker&&!this.resourceClosures.get(e.worker)?.pending&&e.worker.unref(),this.retirement.idle(e)}}})),hu=__esmMin((()=>{mu(),uu(),Jl(),ql(),au()}));function createLazyPromiseLoader(e,t={}){let n,createPromise=()=>{let r=Promise.resolve().then(e);return t.cacheRejections!==!0&&r.catch(()=>{n===r&&(n=void 0)}),r};return{load(){return n??=createPromise(),n},peek(){return n},clear(){n=void 0}}}var gu=__esmMin((()=>{}));function createLazyRuntimeSurface(e,t){let n=createLazyPromiseLoader(()=>e().then(t),{cacheRejections:!0});return Object.assign(n.load,{peek:n.peek,clear:n.clear})}function createLazyRuntimeModule(e){return createLazyRuntimeSurface(e,e=>e)}var _u=__esmMin((()=>{gu()}));function captureDeletedAgentDatabaseFences(){return[...vu.deleted]}var vu,yu=__esmMin((()=>{R(),vu=resolveGlobalSingleton(Symbol.for(`openclaw.agentDatabaseReaders`),()=>({closers:/* @__PURE__ */ new Set,deleted:/* @__PURE__ */ new Map}))}));function getDatabaseEngineSelection(){return xu.getStore()??bu.selection}var bu,xu,Su=__esmMin((()=>{R(),bu=resolveGlobalSingleton(Symbol.for(`openclaw.databaseEngineSelection`),()=>({})),xu=resolveGlobalSingleton(Symbol.for(`openclaw.databaseEngineMaintenanceSelection`),()=>new D)}));function resolveSafeNodeCompileCacheDirectory(e){if(process.platform===`win32`&&E.resolve(e).length>200)process.stderr.write(`[openclaw] Compile cache disabled: Windows cache path exceeds 200 characters.
`);else return e}async function maintain(e){let t=E.dirname(E.dirname(e)),n=E.basename(E.dirname(e));if(E.basename(t)!==`openclaw`||sanitize(n)!==n||!ku.test(E.basename(e)))return;let r=Date.now(),i=await O.lstat(t).catch(()=>void 0);for(let n of[t,E.dirname(e),e]){let e=n===t?i:await O.lstat(n).catch(()=>void 0);if(e&&!e.isDirectory())return}if(i&&r-i.mtimeMs<Tu)return;await O.mkdir(t,{recursive:!0});let a=`${t}.maintenance`,s=await O.lstat(a).catch(()=>void 0);if(s&&r-s.mtimeMs>3e5&&await O.rmdir(a).catch(()=>{}),!await O.mkdir(a).then(()=>!0,()=>!1))return;let c=[],l=0,u=0,d=!1;async function prune(){for(c.sort((e,t)=>t.mtimeMs-e.mtimeMs);c.length;){if(Date.now()-r>Ou)return!1;let e=c[c.length-1];if(l<=Cu&&c.length<=Eu&&r-e.mtimeMs<=wu)break;await O.unlink(e.file).catch(e=>{if(e.code!==`ENOENT`)throw e}),l-=e.size,c.pop()}return!0}async function visit(e){for await(let t of await O.opendir(e)){if(++u>Du||Date.now()-r>Ou)return!1;let n=E.join(e,t.name);if(t.isDirectory()){if(!await visit(n))return!1}else if(t.isFile()){let e=await O.lstat(n).catch(e=>{if(e.code!==`ENOENT`)throw e});if(!e)continue;if(l+=e.size,c.push({file:n,size:e.size,mtimeMs:e.mtimeMs}),c.length%256==0&&!await prune())return!1}}return!0}try{if(r-(await O.lstat(t)).mtimeMs<Tu){d=!0;return}let e=await visit(t);if(await prune()&&e){let e=/* @__PURE__ */ new Date;await O.utimes(t,e,e),d=!0}}finally{d||await O.utimes(t,i?.atime??/* @__PURE__ */ new Date(0),i?.mtime??/* @__PURE__ */ new Date(0)).catch(()=>{}),await O.rmdir(a)}}var Cu,wu,Tu,Eu,Du,Ou,ku,sanitize,Au=__esmMin((()=>{N&&process.env.OPENCLAW_PACKAGED_COMPILE_CACHE_RESPAWNED===`gateway`&&(delete process.env.NODE_DISABLE_COMPILE_CACHE,delete process.env.OPENCLAW_PACKAGED_COMPILE_CACHE_RESPAWNED),Cu=536870912,wu=6048e5,Tu=36e5,Eu=4096,Du=16384,Ou=3e4,ku=/^(?:[a-f0-9]{16}|\d+-\d+|no-package-json|build-[A-Za-z0-9._-]+)$/,sanitize=e=>{let t=e.replace(/[^A-Za-z0-9._-]+/g,`_`).replace(/^_+|_+$/g,``);return t&&t!==`.`&&t!==`..`?t:`unknown`},process.argv[2]===`--maintain`&&process.argv[1]===j(import.meta.url)&&process.argv[3]&&maintain(process.argv[3]).catch(()=>{})}));function resolveNodeCompileCacheEnv(e=process.env){if(e.NODE_DISABLE_COMPILE_CACHE!==void 0)return e;let t=e.NODE_COMPILE_CACHE??resolveGlobalSingleton(ju,()=>({})).baseDirectory;if(t&&!resolveSafeNodeCompileCacheDirectory(t)){let t={...e,NODE_DISABLE_COMPILE_CACHE:`1`};return delete t.NODE_COMPILE_CACHE,t}return e.NODE_COMPILE_CACHE===void 0&&t?{...e,NODE_COMPILE_CACHE:t}:e}var ju,Mu=__esmMin((()=>{Au(),R(),ju=Symbol.for(`openclaw.nodeCompileCacheBase`)})),Nu,Pu,Fu,Iu=__esmMin((()=>{Nu=`${process.execArgv.join(` `)} ${process.env.NODE_OPTIONS??``}`,Pu=/--max[-_](?:old[-_]space[-_]size(?:[-_]percentage)?|heap[-_]size)(?:=|\s)/u,Fu=/--(?:freeze[-_]flags[-_]after[-_]init|(?:abort|exit)[-_]on[-_]contradictory[-_]flags)(?:=(?:true|1))?(?:\s|$)/u,N&&!process.versions.bun&&Pu.test(Nu)&&(Fu.test(Nu)?process.emitWarning(`V8 startup flags prevent enforcing per-worker heap limits.`):Ve(`--max-old-space-size=0 --max-heap-size=0`))})),Lu=__esmMin((()=>{Gl()}));function accumulateSqliteReaderCounters(e,t){for(let n of t){let t=n.operation,r=e.get(t);r||(r={operation:t,count:0,readBytes:0},e.set(t,r)),r.count+=Number(Atomics.load(n.values,0)),r.readBytes+=Number(Atomics.load(n.values,1))}}function receive(e,t){let{operation:n,values:r}=t,i=zu.operations.has(n)||zu.operations.size<Ru?n:`other`;zu.operations.add(i);let a=zu.workers.get(e);a||(a=/* @__PURE__ */ new Map,zu.workers.set(e,a)),a.set(n,{operation:i,values:r})}function retire(e){let t=zu.workers.get(e);t&&(accumulateSqliteReaderCounters(zu.retired,t.values()),zu.workers.delete(e))}var Ru,zu,Bu=__esmMin((()=>{R(),Ru=256,zu=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteReaderMetrics`),()=>({counters:/* @__PURE__ */ new Map,listeners:/* @__PURE__ */ new Set,workers:/* @__PURE__ */ new Map,operations:/* @__PURE__ */ new Set,retired:/* @__PURE__ */ new Map}))}));function classifySqliteWorkerExecute(e){if(Uu.has(e))return e;let t=e.indexOf(`.`),n=t===-1?e:e.slice(0,t);return Uu.has(n)?n:`execute`}function classifyWorkerRequest(e,t){if(typeof e!=`string`)return`execute`;if(Wu.has(e))return e;if(e===`auth-profile-rows`)return`auth_profiles`;if(e===`database.domain.execute`||e===`database.domain.publish`){let n=isRecord(t)?t:void 0,r=n&&isRecord(n.command)?n.command:void 0,i=n?.moduleUrl;if(e===`database.domain.publish`&&typeof i==`string`&&typeof r?.type==`string`&&Ku.some(e=>i.endsWith(e))){let e=Gu.get(r.type);if(e)return e}let a=r?classifyWorkerRequest(r.type):`execute`;return a===`execute`?`domain_execute`:a}for(let[t,n]of qu)if(e.startsWith(t))return n;return classifySqliteWorkerExecute(e)}function normalizeWorkerRequestClass(e){return e!==void 0&&Ju.has(e)?e:`other`}var Vu,Hu,Uu,Wu,Gu,Ku,qu,Ju,Yu=__esmMin((()=>{B(),Vu=/* @__PURE__ */ `admit,audit.events.list,audit.writer.process,audit.writer.prune,database.domain.bind,database.domain.close,database.domain.publish,database.prepareWrite,database.walMaintenance,localWorkspace.prepare,localWorkspace.pruneLegacy,localWorkspace.beginSweep,localWorkspace.finishSweep,localWorkspace.sweepBatch,localWorkspace.mutate,localWorkspace.manifest,localWorkspace.readBacking,localWorkspace.sweepCandidates,localWorkspace.reviewBase,localWorkspace.byProjectionPath,localWorkspace.exists,localWorkspace.get,stateLease.acquire,stateLease.release,stateLease.renew,stateLease.verify,worktrees.assertPredicates,worktrees.delete,worktrees.slotCount,worktrees.pendingSlots,worktrees.reservePending,worktrees.releasePending,worktrees.insert,worktrees.update,worktrees.claimRemoval,worktrees.finalizeRemoval,worktrees.abortRemoval,worktrees.findLiveByOwner,worktrees.get,worktrees.sessionBinding,worktrees.findLiveByPath,worktrees.list,worktrees.liveIds,worktrees.provisionedPaths,worktrees.provisionedState,worktrees.provisionedChunk,worktrees.writeProvisionedSnapshot,worktrees.retireMissing,worktrees.deferCleanup,worktrees.admitRunLease,worktrees.releaseRunLease,worktrees.reapRunLeases,worktrees.reserveCapacity,worktrees.recoverPending,worktrees.templates.read,worktrees.templates.has,worktrees.templates.list,worktrees.templates.reserve,worktrees.templates.ready,worktrees.templates.delete,worktrees.templates.retainReader,worktrees.templates.releaseReader,worktrees.templates.hasReaders`.split(`,`),Hu=/* @__PURE__ */ `acp.acpSessions.agentDatabaseDeletion.agentDatabaseRegistry.agentDatabases.agentDeletionJournal.agentProvenance.apns.audit.authProfiles.backup.bootstrap.capture.channelIngress.templates.config.conversation.conversationBindings.database.deliveryQueue.deviceAuth.deviceIdentity.devicePairing.diagnostic.doctor.exec-approvals.execApprovals.generatedHtmlProvenance.githubPublication.githubRepository.legacyMcpOAuth.localWorkspace.managedImages.mcpOAuth.mentions.modelCatalog.nativeHookRelay.node.nodeHost.nodeWorker.onboardingRecommendations.operator.operatorApprovals.pairing.placementJournals.placementTools.placementTranscript.placementTurns.pluginBlob.pluginModelCatalogCredentials.plugins.preparedPoolPresence.projects.promotions.repositoryWorkspaces.restartSentinel.sandboxRegistry.secrets.sessionDelivery.sessionGroups.sessionRepositoryWorkspaces.sessionState.sessionUpstream.skillLibrary.skillUploads.skills.stateLease.subagents.telemetry.tts.tui.updateRuns.usageCache.userModelAccounts.userPreferences.userProfiles.webPush.workerEnvironments.workerInference.workerPlacements.workers.workspace.workshop.worktrees`.split(`.`),Uu=/* @__PURE__ */ new Set([...Vu,...Hu]),Wu=/* @__PURE__ */ new Set(/* @__PURE__ */ `abortedPartial,acceptIntent,add,append,appendChunk,assistant,batch,boards.applyOps,boards.grant,boards.putWidget,cache.clear,cache.prune,cache.read,cache.retire,cache.stage.start,cache.write,cache.write.inline,cancel,catalog.pruneRemovedProviders,catalog.removeCredentials,catalog.replace,category.apply,category.prepare,claim,complete,connection.inspect,create,delete,deleteChunk,discardIntent,discover,enqueueIntent,finalize,finish,forget.mark,forget.purge,hasPending,index.facts,index.upgradeProviderKey,index.writeMetadata,involvement,list,listPendingSessions,match,owner.assign,participant,preflight,prepare,prepareRun,prune,publishClosedTurn,put,readNextPending,record,recordFailure,remove,reserve,schema.admit,source.chunks,source.delete,source.hash,source.refresh,source.replace,source.replace.group,source.replace.inline,source.state,stage.append,stage.discard,stage.start,suggestion.add,suggestion.claim,suggestion.finalize,suggestion.release,sweep,vector.ensure,vector.prepare,devicePairing.ensureToken,devicePairing.list,devicePairing.lookup,devicePairing.updateMetadata,devicePairing.updatePresence,devicePairing.verifyToken,session.actor.acceptInput,session.actor.adoptRun,session.actor.appendToolResult,session.actor.appendTranscriptEvent,session.actor.completeTurn,session.actor.deliveryPending,session.actor.deliverySettled,session.actor.patch,session.actor.read,session.agentPurge.commit,session.agentPurge.prepare,session.archivePruning.deletePublished,session.archivePruning.pruneRetention,session.archivePruning.reclaimPages,session.archivePruning.removeLegacy,session.archives.preparePublication,session.archives.recordPublication,session.entries.replace,session.entry.acp,session.entry.patch.commit,session.entry.patch.prepare,session.entry.read,session.entry.readResult,session.entry.replacements.commit,session.entry.replacements.prepare,session.goal.mutate,session.lifecycle.delete,session.lifecycle.deletePlan,session.lifecycle.project,session.lifecycle.reset,session.maintenance.finalize,session.maintenance.metadata,session.maintenance.prepare,session.maintenance.size,session.messageCut.commit,session.messageCut.fork,session.messageCut.preflight,session.messageRewrite.commit,session.messageRewrite.modelPrompt,session.messageRewrite.prepare,session.metadata.append,session.metadata.initialize,session.metadata.mutation,session.nativeBindings.delete,session.parentFork.commit,session.parentFork.prepare,session.parentFork.source,session.pendingInputs.mutate,session.pendingInputs.read,session.pendingInputs.withdraw,session.providerReview.compare,session.reaction.set,session.rowTranscript.backfill,session.turn.commit,session.turn.prepare,trajectory.events.append,trajectory.retention.begin,trajectory.retention.delete,transcript.commit,transcript.prepare,usageCache.prune,usageCache.writeQuarters,usageCache.writeRollup`.split(`,`)),Gu=/* @__PURE__ */ new Map([[`preflight`,`transcript-projection.preflight`],[`sweep`,`transcript-projection.sweep`],[`claim`,`transcript-projection.claim`],[`deleteChunk`,`transcript-projection.deleteChunk`],[`appendChunk`,`transcript-projection.appendChunk`],[`finalize`,`transcript-projection.finalize`]]),Ku=[`/config/sessions/session-transcript-projection-publication.worker.js`,`/config/sessions/session-transcript-projection-publication.worker.ts`],qu=[[`pluginState.`,`plugin_state`],[`session.history.`,`transcript_read`],[`trajectory.`,`transcripts`],[`session.transcript.`,`transcripts`],[`transcripts.`,`transcripts`],[`session.`,`sessions`],[`cron.`,`cron`]],Ju=/* @__PURE__ */ new Set([...Wu,...Gu.values(),...Uu,...qu.map(([,e])=>e),`task`,`open`,`close`,`execute`,`domain_execute`,`auth_profiles`])}));function sampleWorkerAuthorityOperation(e){return N&&normalizeWorkerRequestClass(e).startsWith(`session.actor.`)&&Math.random()<1/128}function recordWorkerAuthorityMessage(e,t,n=sampleWorkerAuthorityOperation(t)){return recordWorkerMessage(e?.kind===`sqlite-database-admissions`?`admission`:`authority`,`from_worker`,typeof e?.payloadBytes==`number`?e.payloadBytes:void 0,t,n?e:void 0),n}function withoutField(e,t){if(!isRecord(e)||!Object.hasOwn(e,t))return e;let n={...e};return delete n[t],n}function recordAuthorityPayload(e,t,n){let r=normalizeWorkerRequestClass(n);if(!r.startsWith(`session.actor.`))return;let i=t.kind===`native-settlement`&&isRecord(t.settlement)?t.settlement.committed:t.committed,a=isRecord(i);if(!a&&!Object.hasOwn(t,`facts`))return;let s=a?[`receipt_entry`,`receipt_events`,`receipt_value`,`receipt_other`]:[`admission_entry`,`admission_other`],c=(e.payloadComponents??={})[r]??={},l,u=a&&typeof t.payloadBytes==`number`?t.payloadBytes:void 0;try{let e=a?i.facts:t.facts;if(u??=A(e).byteLength,a&&isRecord(e)&&isRecord(e.receipt)){let t={...e.receipt,postimage:withoutField(e.receipt.postimage,`entry`)};delete t.entryMetadata;let n={...e,receipt:t},r=Math.min(u,A(n).byteLength),i={...n,receipt:{...n.receipt,transcript:withoutField(withoutField(e.receipt.transcript,`appendedEvents`),`authorityReceipts`)}},a=Math.min(r,A(i).byteLength),s=Math.min(a,A({...i,value:void 0,receipt:{...i.receipt,transcript:withoutField(i.receipt.transcript,`append`)}}).byteLength);l=[u-r,r-a,a-s,s]}else if(!a&&isRecord(e)&&isRecord(e.publication)&&e.publication.kind===`session-actor-admission`){let t=A({...e,publication:{...e.publication,snapshot:withoutField(e.publication.snapshot,`entry`)}}).byteLength;l=[u-t,t]}else l=a?[0,0,0,u]:[0,u];l.some(e=>e<0)&&(l=void 0)}catch{}for(let[e,t]of s.entries()){let n=c[t]??={bytes:0,samples:0,unmeasured:0};l?(n.bytes+=l[e]??0,n.samples++):(n.unmeasured++,t===`receipt_other`&&u!==void 0&&(n.bytes+=u))}}function recordWorkerMessage(e,t,n,r,i){if(!N)return;let a=Xu.get(e);a||(a={},Xu.set(e,a));let s=a[t]??={kind:e,direction:t,messages:0,payloadBytes:0,unmeasuredMessages:0};if(s.messages++,n===void 0)s.unmeasuredMessages++;else if(s.payloadBytes+=n,e===`sqlite_request`||e===`sqlite_reply`||e===`authority`){let e=s.payloadBytesByRequestClass??={},t=normalizeWorkerRequestClass(r);e[t]=(e[t]??0)+n}i&&e===`authority`&&t===`from_worker`&&recordAuthorityPayload(s,i,r)}function messageData(e){return isRecord(e)&&!Me.isProxy(e)?e:void 0}function dataProperty(e,t){return Object.getOwnPropertyDescriptor(e,t)?.value}function messageBody(e){let t=messageData(e),n=t&&dataProperty(t,`type`);return t&&(n===`post`||n===`message`)?dataProperty(t,`value`):e}function workerMessagePayloadBytes(e){if(!N)return;let t=messageBody(e),n=messageData(t),r=n&&(Object.getOwnPropertyDescriptor(n,`value`)??Object.getOwnPropertyDescriptor(n,`input`));if(r&&!(`value`in r))return;let i=r?r.value:t;if(!Me.isProxy(i)){if(ArrayBuffer.isView(i)||i instanceof ArrayBuffer){let e=n&&dataProperty(n,`type`)===`open`?dataProperty(n,`preparation`):void 0;return i.byteLength+(ArrayBuffer.isView(e)?e.byteLength:0)}if(typeof i==`string`)return i.length*2;if(i==null)return 0}}function messageKind(e,t){let n=messageData(messageBody(e));if(!n)return t;switch(dataProperty(n,`status`)){case`ok`:case`failed`:return`task_reply`;case`request`:return`task_request`;case`notification`:return`task_notification`;case`consumed`:return`task_consumed`;case`memory`:return`memory`;case`ready`:return`lifecycle`}if(typeof dataProperty(n,`taskId`)==`number`)return`task_input`;if(typeof dataProperty(n,`actor`)==`number`)return`sqlite_request`;if(typeof dataProperty(n,`id`)==`number`&&typeof dataProperty(n,`ok`)==`boolean`)return`sqlite_reply`;if(typeof dataProperty(n,`operationId`)==`number`)switch(dataProperty(n,`type`)){case`prepare`:case`reclaim`:case`canonical-validation`:return`sqlite_request`;case`reclaimed`:case`refused`:case`checkpoint`:return`sqlite_reply`;case`admission`:case`admission-request`:case`admission-release`:return`admission`;case`commit-request`:return`authority`}switch(dataProperty(n,`type`)){case`resource-owner`:case`resource-message`:case`resource-closed`:return`resource`;case`cpu`:case`heap`:return`memory`;case`create`:case`created`:case`stop`:case`stopped`:case`close`:case`closed`:case`release`:case`execution-exit`:case`error`:case`messageerror`:case`create-error`:case`stop-error`:case`request-error`:return`lifecycle`}return dataProperty(n,`closeResource`)===!0?`resource`:t}function observeWorkerMessage(e,t,n=`other`,r,i){N&&recordWorkerMessage(messageKind(e,n),t,r===void 0?workerMessagePayloadBytes(e):r??void 0,i)}function canObserveWorkerMessages(e){if(!Object.isExtensible(e))return!1;for(let t of[`postMessage`,`emit`]){let n=e;for(;n;){let e=Object.getOwnPropertyDescriptor(n,t);if(e){if(!e.writable||typeof e.value!=`function`)return!1;break}n=Reflect.getPrototypeOf(n)}if(!n)return!1}return!0}var Xu,Zu=__esmMin((()=>{B(),R(),Yu(),Xu=resolveGlobalSingleton(Symbol.for(`openclaw.workerMessageMetrics`),()=>/* @__PURE__ */ new Map)}));function readPostgresBridgeCounters(e){return Array.isArray(e)?e.filter(e=>isRecord(e)&&typeof e.threadId==`number`&&Number.isSafeInteger(e.threadId)&&e.threadId!==P&&e.count instanceof Int32Array&&e.count.length===1&&e.count.buffer instanceof SharedArrayBuffer&&(e.selfRootCount===void 0||e.selfRootCount instanceof Int32Array&&e.selfRootCount.length===1&&e.selfRootCount.buffer instanceof SharedArrayBuffer)):[]}var Qu=__esmMin((()=>{B()}));function jsonUtf8BytesOrInfinity(e){try{let t=JSON.stringify(e);return typeof t==`string`?Buffer.byteLength(t,`utf8`):1/0}catch{return 1/0}}function jsonStringByteLengthUpToLimit(e,t){if(e.length+2>t)return t+1;let n=Buffer.byteLength(e,`utf8`)+2;if(n>t)return t+1;for(let t of e.match($u)??[]){let e=t.charCodeAt(0);n+=e>=55296?3:e<32&&!`\b	
\f\r`.includes(t)?5:1}return n}function boundedJsonUtf8Bytes(e,t){let n=0,r,add=e=>{if(n+=e,n>t)throw Error(`json_byte_limit_exceeded`)},visit=(e,i)=>{if(e===null){add(4);return}switch(typeof e){case`string`:add(jsonStringByteLengthUpToLimit(e,t-n));return;case`number`:add(jsonUtf8BytesOrInfinity(Number.isFinite(e)?e:null));return;case`boolean`:add(e?4:5);return;case`undefined`:case`function`:case`symbol`:i&&add(4);return;case`bigint`:throw Error(`json_byte_length_unsupported`)}let a=e;if((r??=/* @__PURE__ */ new WeakSet).has(a))throw Error(`json_byte_length_circular`);if(typeof a.toJSON==`function`&&!(a instanceof Date))throw Error(`json_byte_length_custom_to_json`);r.add(a);try{if(a instanceof Date){visit(a.toJSON(),i);return}let e=Array.isArray(a);if(add(1),e)for(let e=0;e<a.length;e+=1)e>0&&add(1),visit(a[e],!0);else{let e=!1,r=a;for(let i in r){if(!Object.prototype.propertyIsEnumerable.call(r,i))continue;let a=r[i];a!==void 0&&typeof a!=`function`&&typeof a!=`symbol`&&(e&&add(1),e=!0,add(jsonStringByteLengthUpToLimit(i,t-n)),add(1),visit(a,!1))}}add(1)}finally{r.delete(a)}};try{return visit(e,!1),{bytes:n,complete:!0}}catch{return{bytes:Math.max(n,t+1),complete:!1}}}var $u,ed=__esmMin((()=>{$u=/["\\\u0000-\u001f\ud800-\udfff]/gu})),td=__esmMin((()=>{Nl(),R(),resolveGlobalSingleton(Symbol.for(`openclaw.runtimeExecutionNotices`),()=>{let e=`openclaw.runtimeExecutionNotices`,t=Ze(e),n=t instanceof SharedArrayBuffer?t:new SharedArrayBuffer(4);return $e(e,n),new Int32Array(n)})})),nd=__esmMin((()=>{Nl(),td()})),rd=__esmMin((()=>{ga()}));function runOutsideAsyncWorkScope(e){return id.getStore()===void 0?ad.getStore()===void 0?e():ad.exit(e):runWithAsyncStore(id,void 0,()=>(ad.enterWith(void 0),e()))}var id,ad,od,sd,cd=__esmMin((()=>{dt(),Nt(),ir(),I(),R(),rd(),id=resolveGlobalSingleton(Symbol.for(`openclaw.asyncWorkScope`),()=>new D),ad=resolveGlobalSingleton(Symbol.for(`openclaw.asyncWorkScopeAncestry`),()=>new D),od=resolveGlobalSingleton(Symbol.for(`openclaw.asyncWorkScopeClosedError`),()=>class extends Error{constructor(){super(`Async work scope is closed`),this.name=`AsyncWorkScopeClosedError`}}),sd=class AsyncWorkScope{constructor(e){this.failures=e,this.pending=/* @__PURE__ */ new Set,this.controller=new AbortController,this.phase=`open`}get signal(){return this.controller.signal}get hasPendingWork(){return this.pending.size>0}get isClosing(){return this.phase!==`open`}enter(e){let t=id.getStore();if(t===this)return e();let n=ad.getStore(),r=t?n?.scope===t?n:{scope:t}:void 0;return runWithAsyncStore(id,this,()=>(ad.enterWith({scope:this,parent:r}),e()))}run(e){if(this.phase===`closed`)throw new od;if(this.pending.size>0)return this.enter(e);let t=createDeferredCore();this.pending.add(t.promise);try{return this.enter(e)}finally{t.resolve(),this.pending.delete(t.promise)}}track(e){if(this.phase===`closed`)return Promise.reject(new od);let t=createDeferredCore();this.pending.add(t.promise),t.promise.then(()=>this.pending.delete(t.promise),e=>{this.pending.delete(t.promise),this.failures&&(materializeErrorStack(e),this.failures.add(e))});try{t.resolve(this.enter(e))}catch(e){t.reject(e)}return t.promise}beginClose(e){this.phase===`open`&&(this.phase=`closing`,this.controller.abort(e),materializeErrorStack(this.controller.signal.reason))}runWhenIdle(e){return AsyncWorkScope.runWhenAllIdle(()=>[this],()=>this.track(e))}static async runWhenAllIdle(e,t){let n=e();for(;n.some(e=>e.pending.size>0);)await Promise.allSettled(n.flatMap(e=>Array.from(e.pending))),n=e();return t()}async drain(){for(this.beginClose();this.pending.size>0;)await Promise.allSettled(this.pending);this.phase=`closed`}},resolveGlobalSingleton(Symbol.for(`openclaw.gatewayRetainedWorkTimeoutError`),()=>class extends Error{constructor(){super(`Retained Gateway work did not settle after abort; resources remain retained`)}})}));function appendPluginInstanceCleanupFailures(e,t,n){for(let r of n.errors)e.some(e=>e.pluginId===t&&e.error===r)||e.push({pluginId:t,hookId:`instance`,error:r})}var ld=__esmMin((()=>{}));function createPluginCacheSdk(){return{hosts:/* @__PURE__ */ new Map,contexts:/* @__PURE__ */ new Map,roots:/* @__PURE__ */ new Set,packageNames:/* @__PURE__ */ new Map,packageSearches:/* @__PURE__ */ new Map,argvDirectories:/* @__PURE__ */ new Map,devSourceRoots:/* @__PURE__ */ new Map,runtimeModules:/* @__PURE__ */ new Map,normalizedJitiAliases:/* @__PURE__ */ new Map,aliasFacts:/* @__PURE__ */ new WeakMap,native:{sdkProviders:/* @__PURE__ */ new Map,nextSdkProviderOrder:0,parents:/* @__PURE__ */ new Map,aliases:/* @__PURE__ */ new Map,registeredHosts:/* @__PURE__ */ new Set,hostRoots:/* @__PURE__ */ new Map,nearestPackageRoots:/* @__PURE__ */ new Map,loaderPackageRoots:/* @__PURE__ */ new Map,allowedParentRoots:/* @__PURE__ */ new Map}}}var ud=__esmMin((()=>{}));function releasePluginCacheInstance(e,t){let n=pd.get(e);if(t)t.instances.delete(e),n?.delete(t);else{for(let t of n??[])t.instances.delete(e);n?.clear()}n?.size===0&&pd.delete(e)}function getPluginCacheRetainers(e){let t=fd.get(e);return t||(t={references:/* @__PURE__ */ new Set,controller:new AbortController,settled:createDeferredCore()},fd.set(e,t)),t}function createPluginMetadataCache(){return{current:{snapshot:void 0,owner:`operation`,configFingerprint:void 0,agentWorkspaceFingerprint:void 0,envFingerprint:void 0,defaultDiscoveryCompatible:!1,compatibleConfigFingerprints:void 0,configIdentities:/* @__PURE__ */ new WeakSet},autoEnable:/* @__PURE__ */ new WeakMap,snapshots:/* @__PURE__ */ new Map,derivedIndexes:/* @__PURE__ */ new WeakMap,preparedManifests:/* @__PURE__ */ new WeakMap,snapshotManifestFacts:/* @__PURE__ */ new WeakMap,discovery:/* @__PURE__ */ new Map,sharedDiscovery:/* @__PURE__ */ new Map,projections:/* @__PURE__ */ new WeakMap,projectionSources:/* @__PURE__ */ new WeakMap,completions:/* @__PURE__ */ new WeakMap,indexFacts:/* @__PURE__ */ new WeakMap,providerPolicyOwners:/* @__PURE__ */ new WeakMap,channelAdapters:/* @__PURE__ */ new WeakMap,bundledChannelCatalogs:/* @__PURE__ */ new Map,bundledProviderPolicySurfaces:/* @__PURE__ */ new WeakMap,staticCatalogStates:/* @__PURE__ */ new WeakMap,modelSuppressionResolvers:/* @__PURE__ */ new WeakMap,mcpAuthDeclarations:/* @__PURE__ */ new WeakMap}}function createPluginCache(e={}){return{async[Symbol.asyncDispose](){await retirePluginCache(this)},kind:e.kind??`operation`,roots:/* @__PURE__ */ new Map,rootAliases:/* @__PURE__ */ new Map,sdk:createPluginCacheSdk(),setupModules:/* @__PURE__ */ new Map,instances:/* @__PURE__ */ new Set,metadata:createPluginMetadataCache(),installRecords:/* @__PURE__ */ new Map,persistedInstalledIndex:/* @__PURE__ */ new Map,preparedBundledDiscoveryModes:/* @__PURE__ */ new Map,dependencyStatus:/* @__PURE__ */ new WeakMap,moduleLoaders:/* @__PURE__ */ new Map,sources:/* @__PURE__ */ new Map,sourceAliases:/* @__PURE__ */ new Map,runtimeRecordRoots:/* @__PURE__ */ new WeakMap}}function getProcessPluginCache(){return dd.current??=createPluginCache({kind:`process`})}function getScopedPluginCache(){return lr()?.cacheScope?.cache}function getPluginCache(){return getScopedPluginCache()??getProcessPluginCache()}function retirePluginCache(e,t,n){let r=getPluginCacheRetainers(e);if(r.retirement)return r.retirement;let i=createDeferredCore();return r.retirement=i.promise,r.controller.abort(),materializeErrorStack(r.controller.signal.reason),runOutsideAsyncWorkScope(async()=>{r.references.size&&await r.settled.promise;let i=new sd;try{return await i.track(()=>beginPluginCacheRetirement(e,t,n))}finally{await i.drain()}}).then(i.resolve,i.reject),i.promise}function beginPluginCacheRetirement(e,t,n){if(e.retirement)return e.retirement;let r=createDeferredCore();return e.retirement=r.promise,(async()=>{t?.();let r=e.retireRegistryLoads?.(),i=/* @__PURE__ */ new Set([...e.setupModules.values(),...e.instances]);for(let e of i)e.quiesce();let[a]=await Promise.allSettled([r]),s=await Promise.allSettled([...i].map(async e=>({resource:e,result:await e.dispose(void 0,n)}))),c=e.sourceAdmissions;if(c){let e=s.flatMap(e=>e.status===`fulfilled`?e.value.result.errors.flatMap(e=>e instanceof ar?[e.settled]:[]):[]);e.length>0?Promise.allSettled(e).then(()=>c.dispose()).catch(e=>process.emitWarning(`Plugin native capture cleanup failed: ${String(e)}`)):await c.dispose()}e.setupModules.clear();for(let t of e.instances)releasePluginCacheInstance(t,e);let l=[...a.status===`rejected`?[a.reason]:[],...s.flatMap(e=>e.status===`rejected`?[e.reason]:[])];if(l.length)throw AggregateError(l,`Plugin cache resources failed to retire`);let u=a.status===`fulfilled`?a.value:void 0,d=[...u?.failures??[]];for(let e of s){if(e.status!==`fulfilled`)continue;let{resource:t,result:n}=e.value;appendPluginInstanceCleanupFailures(d,t.pluginId,n)}return{cleanupCount:u?.cleanupCount??0,failures:d}})().then(r.resolve,r.reject),r.promise}var dd,fd,pd,md=__esmMin((()=>{dt(),cd(),I(),R(),ld(),ud(),or(),ur(),dd=resolveGlobalSingleton(Symbol.for(`openclaw.pluginCache`),()=>({snapshotOwners:/* @__PURE__ */ new WeakMap,retirements:[]})),fd=resolveGlobalSingleton(Symbol.for(`openclaw.pluginCacheRetainers`),()=>/* @__PURE__ */ new WeakMap),pd=resolveGlobalSingleton(Symbol.for(`openclaw.pluginInstanceCacheOwners`),()=>/* @__PURE__ */ new WeakMap)})),hd=__esmMin((()=>{}));function parsePackageName(e){let t=JSON.parse(e);return typeof t.name==`string`?t.name:null}async function readPackageName(e,t){t?.throwIfAborted();let n=getPluginCache().sdk.packageNames,r=E.join(E.resolve(e),`package.json`);if(n.has(r))return n.get(r)??null;try{let e=parsePackageName(await we.readFile(r,{encoding:`utf-8`,signal:t}));return t?.throwIfAborted(),n.set(r,e),e}catch{return t?.throwIfAborted(),n.set(r,null),null}}async function findPackageRoot(e,t){for(let n of iterAncestorDirs(e))if(await readPackageName(n,t)===`openclaw`)return n;return null}function*iterAncestorDirs(e){let t=E.resolve(e);for(let e=0;e<12&&(yield t,E.basename(t)!==`node_modules`);e+=1){let e=E.dirname(t);if(e===t)break;t=e}}function candidateDirsFromArgv1(e){let t=getPluginCache().sdk.argvDirectories,n=E.resolve(e),r=t.get(n);if(r)return[...r];let i=n,a=[];try{let e=re.realpathSync(i);e!==i&&a.push(E.dirname(e))}catch{}a.push(E.dirname(i));let s=i.split(E.sep),c=s.lastIndexOf(`.bin`);if(c>0&&s[c-1]===`node_modules`){let e=E.basename(i),t=s.slice(0,c).join(E.sep);a.push(E.join(t,e))}let l=dedupeCandidates(a);return t.set(n,l),[...l]}function preparePackageRootSearch(e,t){let n=buildCandidates(e),r=n.join(`\0`),i=getPluginCache().sdk.packageSearches,a=i.get(r);return{candidates:n,first:a?.all?a.all[0]??null:a?.first,complete(e){return i.set(r,t?{...i.get(r),first:e}:{first:e}),e}}}async function resolveOpenClawPackageRoot(e){e.signal?.throwIfAborted();let t=preparePackageRootSearch(e,!0);if(t.first!==void 0)return t.first;for(let n of t.candidates){let r=await findPackageRoot(n,e.signal);if(r)return t.complete(r)}return t.complete(null)}function buildCandidates(e){let t=[];if(e.moduleUrl)try{t.push(E.dirname(j(e.moduleUrl)))}catch{}return e.argv1&&t.push(...candidateDirsFromArgv1(e.argv1)),e.cwd&&t.push(e.cwd),dedupeCandidates(t)}function dedupeCandidates(e){return[...new Set(e.map(e=>E.resolve(e)))]}var gd=__esmMin((()=>{md(),hd(),si()}));function assertProfile(e){if(!e)throw new ProfileFailure(`invalid-profile`)}function createInspectorProfileCapture(e,t){let n=new e.Session;return n.connect(),{setup:()=>t.setup(n),start:()=>t.start(n),stop:()=>t.stop(n),close:async()=>{let e=!1;try{await t.disable(n),e=!0}catch{}if(n.disconnect(),!e)throw new ProfileFailure(`cleanup-failed`)}}}function hasProfilerConflict(){let e=parseNodeOptionsEnvVar(process.env.NODE_OPTIONS);return e===null||!!process.env.NODE_V8_COVERAGE||!!(process.versions.bun&&(process.env.BUN_INSPECT||process.env.BUN_INSPECT_CONNECT_TO))||[...process.execArgv,...e??[]].some(e=>/^--(?:inspect|cpu-prof|heap-prof|prof|perf-|.*coverage)/.test(e.replaceAll(`_`,`-`)))}function codePath(e){return E.sep===`/`?e:e.replaceAll(E.sep,`/`)}function codeUrl(e,t){if(/^node:[a-zA-Z0-9_./-]+$/.test(e))return e;if(e.length>2048||/[?#]/.test(e))return;let n=e;if(e.startsWith(`file:`))try{n=j(e)}catch{return}if(!E.isAbsolute(n))return;let r=t?codePath(E.relative(t,n)):``,i=(t&&!r.startsWith(`..`)?`/${r}`:codePath(E.normalize(n))).match(/.*\/node_modules\/((?:@[a-zA-Z0-9_-][a-zA-Z0-9._-]*\/)?[a-zA-Z0-9_-][a-zA-Z0-9._-]*)\//)?.[1];return i?`node_modules/${i}`:/^(?:packages\/[a-zA-Z0-9_@.+-]+\/)?(?:src|dist)\/[a-zA-Z0-9_@./+-]+\.[cm]?js$/.test(r)||/^(?:packages\/[a-zA-Z0-9_@.+-]+\/)?src\/[a-zA-Z0-9_@./+-]+\.ts$/.test(r)?`openclaw:${r}`:void 0}function sanitizeDiagnosticProfileFrame(e,t){assertProfile(!!e&&typeof e.functionName==`string`&&typeof e.url==`string`&&typeof e.scriptId==`string`&&/^-?\d{1,32}$/.test(e.scriptId)&&Number.isSafeInteger(e.lineNumber)&&Number.isSafeInteger(e.columnNumber));let n=codeUrl(e.url,t),r=e.url===``&&_d.has(e.functionName),i=r||n!==void 0&&e.functionName.length<=256&&/^(?:(?:(?:get|set) )?#?[$A-Z_a-z][$\w]*(?:\.#?[$A-Z_a-z][$\w]*)*)?$/.test(e.functionName),a=n?.startsWith(`node_modules/`)&&!(n.startsWith(`node_modules/@openclaw/`)&&i)?`[dep:${n.slice(13)}]`:e.scriptId===`0`&&e.url===``&&e.lineNumber<0&&!r?`[native]`:void 0;return{redacted:!i&&!a,callFrame:{functionName:a??(i?e.functionName:`[redacted]`),scriptId:e.scriptId,url:n??``,lineNumber:e.lineNumber,columnNumber:e.columnNumber}}}async function captureDiagnosticProfile(e){let unavailable=(e,t=!1)=>({status:`unavailable`,reason:e,cleanupFailed:t});if(vd)return unavailable(`busy`);vd=!0;let t,n=!1,r=!1,i,a=!1,c,l,u,d=0,f=0,p=null,assertActive=()=>{if(e.signal?.aborted||!e.hasAuthority())throw new ProfileFailure(`cancelled`)};try{assertActive();let i=await import(`node:inspector/promises`).catch(()=>{throw new ProfileFailure(`unsupported`)}),a=!N&&e.workerTracingInactive?()=>void 0:(await import(`node:trace_events`).catch(()=>{throw new ProfileFailure(`unsupported`)})).getEnabledCategories,assertTracingInactive=()=>{if(a())throw new ProfileFailure(`tracing-active`)};if(p=await resolveOpenClawPackageRoot({moduleUrl:import.meta.url}),assertActive(),i.url()||hasProfilerConflict())throw new ProfileFailure(`conflict`);assertTracingInactive(),t=e.create(i),await t.setup?.(),assertActive(),assertTracingInactive(),l={...process.memoryUsage(),heapSpaces:ze.getHeapSpaceStatistics()};let m=performance.now();n=!0;let h=t.start();f=performance.now()-m,await h,e.durationMs>0&&await s(e.durationMs,void 0,{signal:e.signal}),assertActive(),r=!0;let g=await t.stop();if(!g)throw new ProfileFailure(`capture-failed`);({profile:c}=g),d=performance.now()-m,u={...process.memoryUsage(),heapSpaces:ze.getHeapSpaceStatistics()}}catch(t){i=t instanceof ProfileFailure?t.reason:e.signal?.aborted?`cancelled`:t instanceof Error&&t.message.startsWith(`Inspector error -32601:`)?`unsupported`:`capture-failed`}finally{if(t){if(n&&!r)try{await t.stop()}catch{a=!0}try{await t.close()}catch{a=!0}}}if(i||a)return vd=!1,unavailable(i??`cleanup-failed`,a);try{assertActive();let t=await e.sanitize(c,p,{durationMs:d,startBlockedMs:f,before:l,after:u});return assertActive(),{status:`complete`,result:t}}catch(e){return unavailable(e instanceof ProfileFailure?e.reason:`invalid-profile`)}finally{vd=!1}}var _d,vd,ProfileFailure,yd=__esmMin((()=>{jl(),gd(),_d=/* @__PURE__ */ new Set([`(root)`,`(program)`,`(idle)`,`(garbage collector)`,`(GC)`,`(PARSER)`,`(COMPILER)`,`(BYTECODE_COMPILER)`,`(V8 API)`,`(EXTERNAL)`,`(LOGGING)`,`(IDLE_EXTERNAL)`,`(IDLE)`,`(JS)`,`(deopt)`]),vd=!1,ProfileFailure=class extends Error{constructor(e){super(e),this.reason=e}}})),bd=__esmMin((()=>{ua(),yd()}));function sanitizeNode(e,t){let{callFrame:n,redacted:r}=sanitizeDiagnosticProfileFrame(e.callFrame,t);return{redacted:r||e.deoptReason!==void 0,node:{id:e.id,callFrame:n,...e.children===void 0?{}:{children:e.children},...e.hitCount===void 0?{}:{hitCount:e.hitCount},...e.positionTicks===void 0?{}:{positionTicks:e.positionTicks},...e.deoptReason===void 0?{}:{deoptReason:`[redacted]`}}}}function sanitizeCpuProfileResult(e,t,{durationMs:n,startBlockedMs:r}){assertProfile(e.samples!==void 0&&e.timeDeltas!==void 0);let i=0,a=e.nodes.map(e=>{let n=sanitizeNode(e,t);return i+=Number(n.redacted),n.node});return{requestedDurationMs:xd,actualDurationMs:n,startBlockedMs:r,samplingIntervalMicros:Sd,sampleLossCount:null,redactedNodeCount:i,profile:{nodes:a,startTime:e.startTime,endTime:e.endTime,samples:e.samples,timeDeltas:e.timeDeltas}}}function sanitizeDiagnosticCpuProfile(e,t,n){if(assertProfile(e.samples!==void 0&&e.timeDeltas!==void 0),e.nodes.length>Cd||e.samples.length>wd)throw new ProfileFailure(`profile-too-large`);let r=sanitizeCpuProfileResult(e,t,n),{nodes:i}=r.profile;if(boundedJsonUtf8Bytes(r,1048576).complete)return r;let a=new Map(i.map(e=>[e.id,e])),s=/* @__PURE__ */ new Map;for(let e of i)for(let t of e.children??[])s.set(t,e.id);let c=/* @__PURE__ */ new Map;for(let t of e.samples)c.set(t,(c.get(t)??0)+1);let l=/* @__PURE__ */ new Map;for(let[e,t]of c){let n=[],r=a.get(e);for(;r&&n.length<Td;)n.push(r.callFrame),r=a.get(s.get(r.id));let i=0;if(!n.some(e=>e.url.startsWith(`openclaw:`))){let e=0;for(;r&&!r.callFrame.url.startsWith(`openclaw:`);)e++,r=a.get(s.get(r.id));r&&(n.push(r.callFrame),i=e)}let c=JSON.stringify({stack:n,elidedFrameCount:i}),u=l.get(c);u?u.sampleCount+=t:l.set(c,{stack:n,elidedFrameCount:i,sampleCount:t})}let u=[],d={...r,profile:void 0,truncated:!0,originalNodeCount:i.length,sampleCount:e.samples.length,omittedSampleCount:e.samples.length,summary:u},f=Buffer.byteLength(JSON.stringify(d));for(let e of[...l.values()].toSorted((e,t)=>t.sampleCount-e.sampleCount)){let t=Buffer.byteLength(JSON.stringify(e))+Number(d.summary.length>0);if(d.summary.length===Ed||f+t>1048576)break;d.summary.push(e),d.omittedSampleCount-=e.sampleCount,f+=t}return d}var xd,Sd,Cd,wd,Td,Ed,Dd=__esmMin((()=>{ed(),nd(),bd(),yd(),xd=5e3,Sd=1e4,Cd=16384,wd=65536,Td=8,Ed=128}));async function sortAllocationSummaries(e){let compare=(e,t)=>t.totalBytes-e.totalBytes||t.selfBytes-e.selfBytes,t=[],n=[];for(let r of e)n.push(r),n.length===2048&&(t.push(n.toSorted(compare)),n=[],await a());for(n.length&&t.push(n.toSorted(compare));t.length>1;){let e=[];for(let n=0;n<t.length;n+=2){let r=t[n],i=t[n+1];if(!i){e.push(r);continue}let s=[],c=0,l=0;for(;c<r.length||l<i.length;)s.push(l===i.length||c<r.length&&compare(r[c],i[l])<=0?r[c++]:i[l++]),s.length%2048==0&&await a();e.push(s)}t=e}return t[0]??[]}async function sanitizeDiagnosticHeapProfile(e,t,n,r){let i=e.samples,s=/* @__PURE__ */ new Map,c=[{source:e.head}],l=0,u=0;for(let{source:e,parent:n}of c){++u%1024==0&&await a();let{callFrame:r,redacted:i}=sanitizeDiagnosticProfileFrame(e.callFrame,t);l+=Number(i);let d={id:e.id,callFrame:r,selfSize:e.selfSize,children:[]},f={node:d,parent:n,totalBytes:d.selfSize,count:0,frameId:0};s.set(d.id,f),n?.node.children.push(d);for(let t of e.children)c.push({source:t,parent:f}),++u%1024==0&&await a()}c.length=0;let d=[],f=0,p=0;for(let e of i){++u%1024==0&&await a();let t=s.get(e.nodeId);t?(t.count++,d.push({size:e.size,nodeId:e.nodeId,ordinal:e.ordinal})):(f++,p+=e.size)}let m=[...s.values()];s.clear();for(let e=m.length-1;e>=0;e--){++u%1024==0&&await a();let t=m[e];t.parent&&(t.parent.totalBytes+=t.totalBytes)}let h={...n,redactedNodeCount:l,unattributedSampleCount:f,unattributedSampleBytes:p},g={...h,truncated:f>0,profile:{head:m[0].node,samples:d}};if(boundedJsonUtf8Bytes(g,1048576).complete)return g;let _=await r?.(g.profile),v=/* @__PURE__ */ new Map,y=/* @__PURE__ */ new Map,b=[],x=[],S=[];for(let e of m){++u%1024==0&&await a();let t=JSON.stringify(e.node.callFrame),n=v.get(t);n===void 0&&(n=v.size,v.set(t,n)),e.frameId=n;let{totalBytes:r,count:i}=e;if(r===0)continue;let s=e.node.selfSize;e.app=e.node.callFrame.url.startsWith(`openclaw:`)?e:e.parent?.app,e.owner=e.parent?.owner??e.app;let c=e.parent;for(let t=1;c&&t<=Od;t++,c=c.parent){if(c.frameId!==n)continue;let r=e.parent,i=c.parent,a=1;for(;a<t&&r&&i&&r.frameId===i.frameId;)r=r.parent,i=i.parent,a++;if(a===t){let n=c.cycle;e.cycle={width:t,count:n?.width===t?n.count+1:2,next:n?.width===t?n.next:i};break}}x.length=S.length=b.length=0,x.push(e),S.push(1),b.push(n);let l=e.parent;for(;l&&x.length<Od;){let e=l.cycle,t=e&&e.width<=Od-x.length?e.width:1,n=t===e?.width?e.count:1,r=n>1?e.next:l.parent;for(let e=0;e<t;e++){let r=l,i=e===t-1&&n>1;x.push(r),S.push(i?n:1),b.push(i?`${r.frameId}x${n}`:r.frameId),l=r.parent}l=r}if(l){let t=x[29].app,n=t?t===e.owner?[t]:[t,e.owner]:[];x.length=S.length=b.length=29,x.push(void 0,...n),S.push(1,1,1),b.push(`...`,...n.map(e=>e.frameId))}let d=b.join(`,`),f=y.get(d);if(f)f.selfBytes+=s,f.totalBytes+=r,f.count+=i;else{let t=[e.node.callFrame];for(let e=1;e<x.length;e++){let n=x[e]?.node.callFrame;t.push(n?S[e]>1?{...n,functionName:`${n.functionName} ×${S[e]}`}:n:{functionName:`[...]`,url:``,scriptId:`0`,lineNumber:-1,columnNumber:-1})}y.set(d,{stack:t,selfBytes:s,totalBytes:r,count:i})}}v.clear(),x.length=0,m.length=0;let C={...h,..._,truncated:!0,summary:[]},w=Buffer.byteLength(JSON.stringify(C));for(let e of await sortAllocationSummaries(y.values())){++u%1024==0&&await a();let t=Buffer.byteLength(JSON.stringify(e))+Number(C.summary.length>0);if(w+t>1048576)break;C.summary.push(e),w+=t}return C}var Od,kd=__esmMin((()=>{ed(),nd(),bd(),yd(),Od=32})),Ad=/* @__PURE__ */ __exportAll({captureWorkerGcProfiles:()=>captureWorkerGcProfiles,reportWorkerGcStorm:()=>reportWorkerGcStorm,writeWorkerGcProfiles:()=>writeWorkerGcProfiles});async function reportWorkerGcStorm(e,t,n){let{profiles:r,...i}=e,a={...i,workerThreadId:t,workerSlot:n},s=createSubsystemLogger(`agents/code-mode`);if(r)try{let e=await writeWorkerGcProfiles(r);s.warn(`Code Mode worker GC storm`,{...a,profileFiles:e})}catch{s.warn(`Code Mode worker GC storm`,{...a,captureStatus:`unavailable`,captureReason:`profile-write-failed`})}else s.warn(`Code Mode worker GC storm`,a);if(i.captureStatus===`requested`){let{getEnabledCategories:e}=await import(`node:trace_events`);if(e())s.warn(`Code Mode worker GC storm`,{...a,captureStatus:`unavailable`,captureReason:`tracing-active`});else return i}}function captureWorkerGcProfiles(){return captureDiagnosticProfile({hasAuthority:()=>!0,durationMs:jd,workerTracingInactive:!0,create:e=>createInspectorProfileCapture(e,{setup:async e=>{await e.post(`HeapProfiler.enable`),await e.post(`Profiler.enable`),await e.post(`Profiler.setSamplingInterval`,{interval:1e4})},start:async e=>{await e.post(`HeapProfiler.startSampling`,{samplingInterval:Md,includeObjectsCollectedByMajorGC:!0,includeObjectsCollectedByMinorGC:!0}),await e.post(`Profiler.start`)},stop:async e=>{let[t,n]=await Promise.all([e.post(`HeapProfiler.stopSampling`),e.post(`Profiler.stop`)]);return{profile:{heap:t.profile,cpu:n.profile}}},disable:e=>Promise.all([e.post(`HeapProfiler.disable`),e.post(`Profiler.disable`)])}),sanitize:async({heap:e,cpu:t},n,r)=>({heap:JSON.stringify(await sanitizeDiagnosticHeapProfile(e,n,{durationMs:r.durationMs,requestedDurationMs:jd,effectiveDurationMs:jd,actualDurationMs:r.durationMs,durationLimitReason:null,samplingIntervalBytes:Md,includeObjectsCollectedByMajorGC:!0,includeObjectsCollectedByMinorGC:!0,heapUsedBefore:r.before.heapUsed,heapUsedAfter:r.after.heapUsed,heapSpacesBefore:r.before.heapSpaces,heapSpacesAfter:r.after.heapSpaces,rssBefore:r.before.rss,rssAfter:r.after.rss})),cpu:JSON.stringify(sanitizeDiagnosticCpuProfile(t,n,r))})})}function writeWorkerGcProfiles(e){let t=Fd.then(async()=>{let t=E.join(resolveStateDir(),`diagnostics`);await O.mkdir(t,{recursive:!0,mode:448});let n=(await O.readdir(t)).filter(e=>Pd.test(e)).toSorted();for(let e of n.slice(0,Math.max(0,n.length-Nd+2)))await O.unlink(E.join(t,e));let r=`code-mode-gc-${Date.now()}-${ge()}`,i=[];for(let[n,a]of[[`heap`,e.heap],[`cpu`,e.cpu]]){let e=`${r}.${n}profile.json`;await rt({filePath:E.join(t,e),content:a,mode:384,dirMode:448}),i.push(e)}return i});return Fd=t.catch(()=>{}),t}var jd,Md,Nd,Pd,Fd,Id=__esmMin((()=>{ua(),Dd(),kd(),yd(),Wg(),jd=5e3,Md=262144,Nd=20,Pd=/^code-mode-gc-\d+-[a-f0-9-]+\.(?:heapprofile|cpuprofile)\.json$/,Fd=Promise.resolve()}));function createCpuTrackedWorker(e,t,n){let r=runWithMainThreadTask(`worker:${workerScriptName(e,t?.eval)}`,()=>new Xe(e,t));return trackNativeWorkerForCpu(r,e,t?.eval),Object.assign(W.workers.get(r),{internalMessages:!0,requestClass:n}),r}function trackNativeWorkerForCpu(e,t,n=!1){trackWorker(e);let r=W.workers.get(e),i=workerScriptName(t,n);if(r.script!==i&&(r.script===`bridge.worker.js`&&Atomics.sub(W.postgresBridgeCount,0,1),i===`bridge.worker.js`&&Atomics.add(W.postgresBridgeCount,0,1),r.script=i),r.script===`sqlite-store.worker.js`&&attributeWorkerMetrics(r,`writer`),r.script===`code-mode-node.worker.js`&&r.workerSlot===void 0){let e=new Set([...W.workers.values()].map(e=>e.workerSlot));for(let t=1;t<=64;t++)if(!e.has(t)){r.workerSlot=t;break}}r.lifecycleMessages=r.script===`openclaw-state-lease-heartbeat.worker.js`||r.script===`gateway-state-owner-heartbeat.worker.js`}function recordPostgresPoolSelfRoot(){return Atomics.compareExchange(W.postgresPoolSelfRootCount,0,0,1)===0}function publishPostgresBridgeCounters(){for(let e of W.postgresBridgeObservers)e()}function receivePostgresBridgeCounters(e,t){let n=readPostgresBridgeCounters(t),r=e.postgresBridgeCounters;n.length===(r?.length??0)&&n.every((e,t)=>e.threadId===r?.[t]?.threadId)||(e.postgresBridgeCounters=n,publishPostgresBridgeCounters())}function attributeWorkerToPool(e,t,n){let r=W.workers.get(e);if(!r)return;let i=W.poolIds.get(t);i===void 0&&(i=++W.nextPoolId,W.poolIds.set(t,i)),r.poolId=i,attributeWorkerMetrics(r,n,0)}function attributeWorkerMetrics(e,t,n){let r=t===`reader`||t===`file-reader`||t===`compute`||t===`writer`||t===`singleton`?t:`other`,i=`${r}:${e.script}`,a=W.taskMetrics.get(i);a||(a={workerClass:r,script:e.script,tasksCompleted:n,heapUsedHighWaterBytes:0,gc:[]},W.taskMetrics.set(i,a)),e.taskMetrics=a}function forgetWorker(e){let t=W.workers.get(e);if(!t)return;let n=countWorkerStart(t),r=t.retirementReason??`exit`;n.retired.set(r,(n.retired.get(r)??0)+1),t.script===`bridge.worker.js`&&Atomics.sub(W.postgresBridgeCount,0,1),t.memoryFlush?.resolve(),drainWorkerMemoryPort(t),retire(t),t.memoryPort?.close(),W.workers.delete(e),W.revision++,W.cpuSources=void 0,t.postgresBridgeCounters&&publishPostgresBridgeCounters()}function countWorkerStart(e){let t=W.lifecycle.get(e.script);return t||(t={started:0,retired:/* @__PURE__ */ new Map},W.lifecycle.set(e.script,t)),e.started||(e.started=!0,t.started++),t}function markWorkerRetirement(e,t){let n=W.workers.get(e);n&&(n.retirementReason??=t)}function flushWorkerDiagnostics(e,t){let n=W.workers.get(e);if(n?.memoryFlush)return n.memoryFlush.operation;let r=n?.memoryPort;if(!n?.taskMetrics||!r||!W.gcObserver||[`failure`,`cancelled`,`crash`,`gc-thrash`,`gc-storm`,`exit`].includes(t))return;let i=performance.now()+100,a=createRetainedOperation(()=>{drainWorkerMemoryPort(n),performance.now()>=i&&a.resolve()});n.memoryFlush=a;let s=setTimeout(()=>a.resolve(),100);a.operation.result.then(()=>clearTimeout(s));try{r.postMessage({flush:!0}),recordWorkerMessage(`memory`,`to_worker`,1)}catch{a.resolve()}return a.operation}function trackWorker(e){if(W.workers.has(e))return;if(N&&e instanceof Xe&&recordWorkerMessage(`lifecycle`,`to_worker`),N&&e instanceof Xe&&canObserveWorkerMessages(e)){let t=Object.getPrototypeOf(e)===Xe.prototype,r=!t||Object.hasOwn(e,`postMessage`)?e.postMessage:void 0;e.postMessage=function(e,t){let i=n.internalMessages?workerMessagePayloadBytes(e):void 0;(r??Xe.prototype.postMessage).call(this,e,t),n.lifecycleMessages?recordWorkerMessage(`lifecycle`,`to_worker`,i):n.internalMessages?observeWorkerMessage(e,`to_worker`,`other`,i??null,n.requestClass?.()):recordWorkerMessage(`other`,`to_worker`)};let i=!t||Object.hasOwn(e,`emit`)?e.emit:void 0;e.emit=function(e,...t){if(e===`error`&&n.script===`code-mode-node.worker.js`){let e=t[0];n.retirementReason??=isRecord(e)&&e.code===`ERR_CODE_MODE_GC_THRASH`?`gc-thrash`:`crash`}return e===`message`&&(n.lifecycleMessages?recordWorkerMessage(`lifecycle`,`from_worker`,workerMessagePayloadBytes(t[0])):n.internalMessages?observeWorkerMessage(t[0],`from_worker`,`other`,void 0,n.requestClass?.()):recordWorkerMessage(`other`,`from_worker`)),(i??Xe.prototype.emit).call(this,e,...t)}}let t=!1,finishCpuUsage=e=>(t=!1,e),failCpuUsage=()=>finishCpuUsage(void 0),n={script:`other`,cpuUsage(){if(t)return Promise.resolve(void 0);t=!0;try{return e.cpuUsage().then(finishCpuUsage,failCpuUsage)}catch{return Promise.resolve(failCpuUsage())}}};W.workers.set(e,n),queueMicrotask(()=>countWorkerStart(n)),W.revision++,W.cpuSources=void 0,e.once(`exit`,()=>forgetWorker(e))}function recordWorkerHeap({taskMetrics:e},t){e&&(e.heapUsedHighWaterBytes=Math.max(e.heapUsedHighWaterBytes,t))}function isWorkerGcObservationEnabled(){return!!W.gcObserver}function recordWorkerGc(e,t){let n=e.taskMetrics;if(n)for(let e of t){if(!e||![`scavenge`,`mark_sweep_compact`,`incremental`,`weak_processing`].includes(e.kind)||!Number.isFinite(e.durationMs)||e.durationMs<0)continue;let t=n.gc.find(t=>t.kind===e.kind);t||(t={kind:e.kind,count:0,durationMs:0,reclaimedBytes:0},n.gc.push(t)),t.count++,t.durationMs+=e.durationMs,Number.isFinite(e.reclaimedBytes)&&e.reclaimedBytes>=0&&(t.reclaimedBytes+=e.reclaimedBytes),n.heapUsedHighWaterBytes=Math.max(n.heapUsedHighWaterBytes,Number.isFinite(e.heapUsedBeforeBytes)?e.heapUsedBeforeBytes:0)}W.gcObserver?.(t,e.script,e.workerSlot)}function drainWorkerMemoryPort({memoryPort:e,memoryReceive:t}){if(e&&t)for(let n=Qe(e);n;n=Qe(e))t(n.message)}function receiveWorkerMemoryPort(e,t){if(isRecord(t)&&(t.status===`ok`||t.status===`failed`)&&t.diagnostics===!0){let t=W.workers.get(e);return t?.taskMetrics?.tasksCompleted!==void 0&&t.taskMetrics.tasksCompleted++,!1}if(!isRecord(t)||t.status!==`memory`||!(t.port instanceof Je))return!1;let n=t.port,r=W.workers.get(e);if(!r||r.memoryPort||e.threadId===-1)return n.close(),!0;receivePostgresBridgeCounters(r,t.postgresBridgeCounters),r.memoryPort=n,r.memoryPending=!0;let close=()=>{r.memoryPort=void 0,r.memoryReceive=void 0,r.memoryPending=!1,r.memoryUnavailable=!0,r.memoryFlush?.resolve(),n.close()};return r.memoryReceive=t=>{if(`sqliteReaderCounter`in t)receive(r,t.sqliteReaderCounter),recordWorkerMessage(`memory`,`from_worker`,16);else if(`postgresBridgeCounters`in t)receivePostgresBridgeCounters(r,t.postgresBridgeCounters),recordWorkerMessage(`memory`,`from_worker`);else if(`flushed`in t)recordWorkerMessage(`memory`,`from_worker`,8),recordWorkerHeap(r,t.heapUsed),r.memoryFlush?.resolve();else if(`retireWorkerId`in t)recordWorkerMessage(`memory`,`from_worker`),Ld.publish(t.retireWorkerId);else if(`gcStorm`in t){recordWorkerMessage(`memory`,`from_worker`);let i=e.threadId,a=r.workerSlot;Promise.resolve().then(()=>(Id(),Ad)).then(async({reportWorkerGcStorm:e})=>{let s=await e(t.gcStorm,i,a);s&&r.memoryPort===n&&n.postMessage({captureGcProfile:s})})}else recordWorkerMessage(`memory`,`from_worker`,(`heapUsed`in t?32+(t.heapSizeLimitBytes===void 0?0:8):0)+(`heapUsed`in t&&t.oldGenerationAfterGcBytes!==void 0?8:0)+(`heapUsed`in t?(t.heapSpaces?.length??0)*8:0)+(`heapUsed`in t?t.retainedData?.reduce((e,t)=>e+16+(t.stringBytes===void 0?0:8)+(t.objects===void 0?0:8)+(t.generations===void 0?0:8)+(t.providers===void 0?0:8)+(t.accounts===void 0?0:8)+(t.truncated===void 0?0:1),0)??0:0)+(t.gc?.length??0)*8),t.gc&&recordWorkerGc(r,t.gc),`heapUsed`in t&&(recordWorkerHeap(r,t.heapUsed),delete t.gc,r.heap={value:t,sampledAt:performance.now()},r.memoryPending=!1,r.memoryUnavailable=!1)},n.on(`message`,r.memoryReceive),n.once(`close`,close),n.once(`messageerror`,close),n.unref(),W.gcObserver&&(n.postMessage({gc:!0}),recordWorkerMessage(`memory`,`to_worker`,1)),!0}var Ld,W,Rd=__esmMin((()=>{Iu(),B(),Lu(),R(),Qr(),Bu(),di(),Zu(),Qu(),Ld=Ke(`openclaw.code-mode.gc-storm`),W=resolveGlobalSingleton(Symbol.for(`openclaw.workerCpuSources`),()=>(process.on(`worker`,trackWorker),{gcObserver:void 0,postgresBridgeCount:new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)),postgresPoolSelfRootCount:new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)),postgresBridgeObservers:/* @__PURE__ */ new Set,revision:0,cpuSources:void 0,nextPoolId:0,poolIds:/* @__PURE__ */ new WeakMap,workers:/* @__PURE__ */ new Map,lifecycle:/* @__PURE__ */ new Map,taskMetrics:/* @__PURE__ */ new Map}))}));async function closePostgresPool(){let e=G.workers;G.workers=void 0;for(let{port:e}of G.endpoints?.services??[])e.close();G.endpoints=void 0,G.ready=[],G.refresh=void 0,G.failure=void 0,await Promise.all(e?.map(e=>e.terminate())??[])}var zd,G,Bd=__esmMin((()=>{R(),zd=et,G=resolveGlobalSingleton(Symbol.for(`openclaw.postgresIoPool`),()=>({endpoints:zd?.postgresPool,workers:void 0,nextStep:void 0,ready:[],refresh:void 0,failure:void 0}))}));function startPool(){if(!N&&recordPostgresPoolSelfRoot()){let e={threadId:P,owner:workerScriptName(process.argv[1]??``)};Vd.publish(e);let t=new qe(`openclaw.postgres.pool.self-root`);t.unref(),t.postMessage(e),t.close(),createSubsystemLogger(`postgres`).warn(`PostgreSQL worker ${e.owner} (thread ${P}) has no inherited pool; starting its own four I/O services.`)}let e=new SharedArrayBuffer(4),t=Array.from({length:4},()=>({channel:new M,signal:new SharedArrayBuffer(8),peers:[]}));for(let e=0;e<t.length;e++)for(let n=e+1;n<t.length;n++){let{port1:r,port2:i}=new M;t[e].peers.push({port:r,signal:t[n].signal}),t[n].peers.push({port:i,signal:t[e].signal})}let n={services:t.map(({channel:e,signal:t})=>({port:e.port1,signal:t})),allocation:e,nextStep:G.nextStep},r=resolveRuntimeProcessEntrypointUrl(`postgresBridge`),i=resolveRuntimeWorkerThreadExecArgv(r),a=[];G.endpoints=n,G.workers=a;let launch=e=>{let n=t[e],c=new Int32Array(n.signal),l=!1,u=new Xe(r,{workerData:{host:n.channel.port2,signal:n.signal,peers:n.peers},transferList:[n.channel.port2,...n.peers.map(({port:e})=>e)],execArgv:i});trackNativeWorkerForCpu(u,r),u.unref(),n.channel.port1.unref(),a[e]=u;let d=new Promise((e,t)=>{u.once(`error`,t),u.once(`exit`,()=>t(/* @__PURE__ */ Error(`PostgreSQL I/O service exited before readiness.${G.nextStep?` Run ${G.nextStep}.`:``}`))),u.once(`message`,()=>e())});d.catch(()=>{}),G.ready[e]=d,u.on(`error`,()=>{}),u.once(`exit`,()=>{l=!0,Atomics.store(c,1,1),Atomics.notify(c,1),s.add(e)}),Promise.resolve(Atomics.waitAsync(c,1,0).value).then(async()=>{l||await u.terminate()})},s=/* @__PURE__ */ new Set;G.refresh=()=>{for(let e of s){s.delete(e);let r={channel:new M,signal:new SharedArrayBuffer(8),peers:[]};t[e]=r,n.services[e]={port:r.channel.port1,signal:r.signal};for(let n=0;n<t.length;n++){if(n===e)continue;let i=t[n],{port1:s,port2:c}=new M;r.peers.push({port:s,signal:i.signal}),a[n].postMessage({watch:{port:c,signal:r.signal}},[c])}launch(e)}};try{for(let e=0;e<t.length;e++)launch(e)}catch(e){throw closePostgresPool(),e}return n}function getPostgresPool(){return G.nextStep||G.refresh?.(),G.endpoints??startPool()}function createPostgresPoolEndpoints(e=getDatabaseEngineSelection()){if(!G.endpoints&&(!e||!Object.values(e.effectiveEngines).includes(`postgres`)))return;let t=getPostgresPool();return{...t,services:t.services.map(({port:e,signal:t})=>{let n=new M;return e.postMessage({host:n.port2},[n.port2]),{port:n.port1,signal:t}})}}function postgresPoolTransferList(e){return e?.services.map(({port:e})=>e)??[]}var Vd,Hd=__esmMin((()=>{Wg(),Su(),Wl(),Hl(),Rd(),di(),Bd(),Vd=Ke(`openclaw.postgres.pool.self-root`)}));function isPostgresSqlConnection(e){return Ud in e&&e[Ud]===!0}function sqlPublicationAnchor(e){return isPostgresSqlConnection(e)?e.anchor:e}var Ud,Wd=__esmMin((()=>{Ud=Symbol.for(`openclaw.postgres-sync-connection`)})),Gd,Kd=__esmMin((()=>{Gd=`openclaw.sqliteDatabaseAdmissions.v1`}));function changedAdmissionEntries(e,t){let n=/* @__PURE__ */ new Map;for(let[r,i]of e)t.get(r)!==i&&n.set(r,i);return n}function changedAdmissionWriteScopes(e,t){let n=/* @__PURE__ */ new Map;return e.forEach((e,r)=>{e!==t[r]&&e.forEach((e,i)=>{t[r].get(i)!==e&&n.set(i,e)})}),n}var qd=__esmMin((()=>{}));function databaseFileIdentityKey(e){return`${e.dev}:${e.ino}`}function readDatabaseIdentityBirthtime(e){return Jd?e.birthtimeNs.toString():`0`}function normalizeDatabasePath(e){let t=process.platform===`win32`?normalizeWindowsPathPreservingCase(e):e;return process.platform===`win32`&&!/^(?:[a-z]:[\\/]|[\\/]{2})/iu.test(t)?e:t}function assertDatabaseFileIdentity(e,t){if(!e.isFile()||`file:${databaseFileIdentityKey(e)}`!==t.key||t.birthtime!==void 0&&readDatabaseIdentityBirthtime(e)!==t.birthtime)throw Error(`SQLite database file identity changed before existing-only open`)}function existingIdentity(e,t,n){if(!e.isFile())throw Error(`SQLite worker database path must identify a regular file`);if(e.dev!==t.dev||e.ino!==t.ino||readDatabaseIdentityBirthtime(e)!==readDatabaseIdentityBirthtime(t))throw Error(`SQLite database pathname changed during admission`);return{key:`file:${databaseFileIdentityKey(e)}`,canonicalPath:normalizeDatabasePath(n),birthtime:readDatabaseIdentityBirthtime(e)}}function missingAncestorParent(e,t,n){if(!T(n,`ENOENT`))throw n;t.unshift(E.basename(e));let r=E.dirname(e);if(r===e)throw n;return r}async function inspectDatabasePathIdentity(e){let t=await Ce(e,{bigint:!0}).catch(e=>{if(!T(e,`ENOENT`))throw e});if(t){if(!t.isFile())return;try{let n=await xe(e);return existingIdentity(t,await Ce(n,{bigint:!0}),n)}catch(e){throw T(e,`ENOENT`)?Error(`SQLite database pathname changed during admission`,{cause:e}):e}}let n=await resolveDatabasePathKeyAsync(e);return{key:`path:${n}`,canonicalPath:n}}async function resolveDatabasePathKeyAsync(e){let t=[],n=E.resolve(e);for(;;)try{return normalizeDatabasePath(E.join(await xe(n),...t))}catch(e){n=missingAncestorParent(n,t,e)}}function isSoleDatabaseFileDescriptor(e,t){if(process.platform!==`linux`)return!1;try{for(let n of ee(`/proc/self/fd`))if(/^\d+$/u.test(n)&&Number(n)!==e)try{let e=b(Number(n),{bigint:!0});if(e.dev===t.dev&&e.ino===t.ino)return!1}catch(e){if(!T(e,`EBADF`))return!1}return!0}catch{return!1}}var Jd,Yd=__esmMin((()=>{L(),Qi(),Jd=process.platform!==`linux`&&process.platform!==`android`}));function readSqliteDatabaseAdmissionIdentity(e){return`${e.dev}:${e.ino}:${readDatabaseIdentityBirthtime(e)}`}function readSqliteDatabaseAdmissionFact(e,t){return e[Zd]??={value:t.read?t.read(e.value):e.value},e[Zd].value}function admitSqliteDatabaseFactValue(e,t){let n={value:t};return readSqliteDatabaseAdmissionFact(n,e),n}function retainSqliteDatabaseWriteScope(e,t,n){let r=e.writeScopes,i=$d.get(r);i||(i={bytes:[...r.keys()].reduce((e,t)=>e+writeScopeBytes(t),0),retired:/* @__PURE__ */ new Set},$d.set(r,i)),r.delete(t)||(i.bytes+=writeScopeBytes(t)),r.set(t,n),pruneSqliteDatabaseWriteScopes(e)}function pruneSqliteDatabaseWriteScopes(e){let t=$d.get(e.writeScopes);if(t.bytes<=Qd)return!1;let n=!1;for(let[r,i]of e.writeScopes)if(!(Atomics.compareExchange(i.state,2,0,-1)>0&&Atomics.load(i.state,1)===0)&&(Atomics.store(i.state,1,1),advanceSqliteDatabaseGeneration(e,`writeScopeRevision`),e.writeScopes.delete(r),t.bytes-=writeScopeBytes(r),t.retired.add(r),n=!0,t.bytes<=Qd))break;return n}function readSqliteDatabaseAdmissions(e){return Array.isArray(e)?e:void 0}function isSqliteDatabaseAdmissionRetired(e){return readSqliteDatabaseGeneration(e,`retired`)!==0}function isSqliteDatabaseAdmissionFactCurrent(e,t){return!isSqliteDatabaseAdmissionRetired(e)&&Atomics.load(new Int32Array(t.current),0)===1&&t.revision===readSqliteDatabaseFactRevision(e,t.schemaDependent)}function hasSqliteDatabaseSchemaAdmission(e){let t=e?.facts.get(`sqlite-schema`);return!!(e&&t&&isSqliteDatabaseAdmissionFactCurrent(e,t))}function readSqliteDatabaseFactRevision(e,t){return readSqliteDatabaseGeneration(e,t?`schemaRevision`:`factRevision`)}function readSqliteDatabaseGeneration(e,t){return Atomics.load(new Int32Array(e.generation),K[t])}function advanceSqliteDatabaseGeneration(e,t){return Atomics.add(new Int32Array(e.generation),K[t],1)}function publishSqliteDatabaseFact(e,t,n,r,i){if(isSqliteDatabaseAdmissionRetired(e)||r!==readSqliteDatabaseFactRevision(e,t.schemaDependent))return!1;t.writer===`host`&&advanceSqliteDatabaseGeneration(e,`hostRevision`);let a=e.facts.get(t.name);a&&Atomics.store(new Int32Array(a.current),0,0);let s=new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);return Atomics.store(new Int32Array(s),0,1),e.facts.set(t.name,{...n,revision:r,schemaDependent:t.schemaDependent===!0,lifetime:t.lifetime,publication:i,current:s}),advanceSqliteDatabaseGeneration(e,`publicationRevision`),!0}function snapshotWriteScopes(e,t=ef,n){let r=t,i=$d.get(e),visit=(n,a)=>{let s=0;for(let e=0;e<a.length;e++)s=s*31+a.charCodeAt(e)|0;let c=s&ef.length-1,l=!n||Atomics.load(n.state,1)!==0;l&&e.delete(a)&&i&&(i.bytes-=writeScopeBytes(a)),!(l?!t[c].has(a):t[c].get(a)===n)&&(r===t&&(r=t.slice()),r[c]===t[c]&&(r[c]=new Map(t[c])),l?r[c].delete(a):r[c].set(a,n))};if(n)for(let t of n)visit(e.get(t),t);else e.forEach(visit);for(let t of i?.retired??[])visit(e.get(t),t);return i?.retired.clear(),r}function createSqliteDatabaseAdmissionCursor(){return{revision:-1,records:/* @__PURE__ */ new WeakMap}}var K,Xd,Zd,Qd,$d,writeScopeBytes,ef,SqliteDatabaseAdmissionRegistry,tf=__esmMin((()=>{R(),qd(),Kd(),Yd(),K={schemaRevision:0,factRevision:1,publicationRevision:2,retired:3,writeRevision:4,hostRevision:5,unscopedWriteRevision:6,writeScopeRevision:7,sealPresent:8},Xd=Object.keys(K).length,Zd=Symbol.for(`openclaw.sqliteDatabaseAdmission.decodedValue`),Qd=1048576,$d=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteDatabaseWriteScopeRetention`),()=>/* @__PURE__ */ new WeakMap),writeScopeBytes=e=>e.length*2+256,ef=Array.from({length:128},()=>/* @__PURE__ */ new Map),SqliteDatabaseAdmissionRegistry=class{constructor(){this.records=/* @__PURE__ */ new Map,this.exchangeCursor=createSqliteDatabaseAdmissionCursor(),this.locations=/* @__PURE__ */ new Map,this.published=/* @__PURE__ */ new Map,this.scopeSweeps=/* @__PURE__ */ new WeakMap,this.descriptors=/* @__PURE__ */ new Map,this.revision=0,this.retainProcessFacts=!0}useConnectionScopedFacts(){this.retainProcessFacts=!1}changeReferences(e,t){let n=e.references.get(P);return n||(n=new SharedArrayBuffer(2*Int32Array.BYTES_PER_ELEMENT),e.references.set(P,n)),Atomics.add(new Int32Array(n),0,t)+t===+(t===1)&&(t===-1&&this.retireUnreferenced(e),this.publish(e),!0)}retireUnreferenced(e){if(P!==0||isSqliteDatabaseAdmissionRetired(e)||[...e.references.values()].some(e=>Atomics.load(new Int32Array(e),0)>0))return;for(let[t,n]of e.facts)this.retainProcessFacts&&n.lifetime===`process`&&isSqliteDatabaseAdmissionFactCurrent(e,n)||e.facts.delete(t);let t=this.descriptors.get(e.identity);t&&(t.facts=e.facts),Atomics.compareExchange(new Int32Array(e.generation),K.retired,0,2),e.writeScopes.clear()}releaseWorker(e){let t=/* @__PURE__ */ new Map;for(let n of this.records.values()){let r=e>0?n.references.get(e):void 0;r&&(Atomics.compareExchange(n.writerDiagnostic,1,e+1,0),Atomics.store(new Int32Array(r),0,-1),this.retireUnreferenced(n),t.set(n,void 0))}t.size>0&&this.publish(t)}observeLocation(e,t){let n=normalizeDatabasePath(E.resolve(e));t===void 0?this.locations.delete(n):this.locations.set(n,t)}forLocation(e){return this.forPathname(normalizeDatabasePath(E.resolve(e)))}prepareLocation(e){let t=normalizeDatabasePath(E.resolve(e));return()=>this.forPathname(t)}forPathname(e){let t=this.locations.get(e),n=t===void 0?void 0:this.records.get(t);return n&&!isSqliteDatabaseAdmissionRetired(n)?n:void 0}forget(e){this.records.delete(e),this.published.delete(e);for(let[t,n]of this.locations)n===e&&this.locations.delete(t)}retainDescriptorCustody(e,t,n){let r=readSqliteDatabaseAdmissionIdentity(n),i=this.descriptors.get(r);if(i&&i.descriptor!==t)throw Error(`SQLite descriptor custody changed during admission`);i||this.descriptors.set(r,{location:e,descriptor:t,file:n,facts:/* @__PURE__ */ new Map})}retainDescriptor(e,t,n){let r=this.descriptors.get(readSqliteDatabaseAdmissionIdentity(n)),i={identity:readSqliteDatabaseAdmissionIdentity(n),physicalIdentity:{key:`file:${n.dev}:${n.ino}`,birthtime:readDatabaseIdentityBirthtime(n)},location:e,descriptor:t,descriptorOwner:0,generationId:ge(),generation:new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT*Xd),writerDiagnostic:new Int32Array(new SharedArrayBuffer(125*Int32Array.BYTES_PER_ELEMENT)),writeScopes:/* @__PURE__ */ new Map,writeScopeRevision:0,references:/* @__PURE__ */ new Map,facts:new Map([...r?.facts??[]].filter(([,e])=>Atomics.load(new Int32Array(e.current),0)===1).map(([e,t])=>[e,{...t,revision:0}]))};this.records.set(i.identity,i);let a=r?.descriptor===t?r:{location:e,descriptor:t,file:n,facts:/* @__PURE__ */ new Map};return a.location=e,a.file=n,a.facts=/* @__PURE__ */ new Map,this.descriptors.set(i.identity,a),this.observeLocation(e,i.identity),this.publish(i),i}retireDescriptor(e,t){let n=this.records.get(e),r=this.descriptors.get(e)?.descriptor??n?.descriptor;if(r===void 0)return!1;let i=v.fstatSync(r,{bigint:!0});return i.nlink>1n||t.requireSoleDescriptor&&!isSoleDatabaseFileDescriptor(r,i)?!1:(n&&Atomics.store(new Int32Array(n.generation),K.retired,1),v.closeSync(r),this.descriptors.delete(e),this.forget(e),this.publish(),!0)}publish(e,t){let n=e instanceof Map;if(!e||n||this.records.get(e.identity)===e){for(let r of this.records.values()){if(isSqliteDatabaseAdmissionRetired(r)){readSqliteDatabaseGeneration(r,`retired`)===1&&this.descriptors.delete(r.identity),this.forget(r.identity);continue}if(e&&e!==r&&!(n&&e.has(r)))continue;let i=e===r||n;for(let[e,t]of r.references)Atomics.load(new Int32Array(t),0)<0&&(r.references.delete(e),i=!0);let a=this.published.get(r.identity),s=readSqliteDatabaseGeneration(r,`writeScopeRevision`),c=a&&e?n?e.get(r):t:void 0,l=c===void 0&&this.scopeSweeps.get(r)!==s,u=snapshotWriteScopes(r.writeScopes,a?.writeScopes,c??(l?void 0:[]));if(l&&this.scopeSweeps.set(r,s),i||=u!==a?.writeScopes,!i)continue;P===0&&(r.writeScopeRevision=readSqliteDatabaseGeneration(r,`writeScopeRevision`));let{writeScopes:d,...f}=r,p={...f,facts:new Map(r.facts),references:new Map(r.references),hostRevision:P===0?readSqliteDatabaseGeneration(r,`hostRevision`):r.hostRevision},m={...p,writeScopes:u.filter(e=>e.size>0)};this.published.set(r.identity,{metadata:p,writeScopes:u,snapshot:m})}this.revision++,$e(Gd,[...this.published.values()].map(e=>e.snapshot))}}capture(e,t){let n=t?/* @__PURE__ */ new Set([...t.admissions?.map(e=>e.identity)??[],...t.location===void 0?[]:[this.forLocation(t.location)?.identity].filter(e=>e!==void 0)]):void 0;if(!n&&!e&&this.publish(),!n&&e?.revision===this.revision)return[];let r=n?[...n].flatMap(e=>{let t=this.published.get(e);return t&&!isSqliteDatabaseAdmissionRetired(t.snapshot)?[t]:[]}):[...this.published.values()];return e?(n||(e.revision=this.revision),r.flatMap(t=>{let n=e.records.get(t.metadata.generation);return n===t?[]:(e.records.set(t.metadata.generation,t),[n?{...t.metadata,facts:changedAdmissionEntries(t.metadata.facts,n.metadata.facts),writeScopes:[changedAdmissionWriteScopes(t.writeScopes,n.writeScopes)],references:changedAdmissionEntries(t.metadata.references,n.metadata.references)}:t.snapshot])})):r.map(e=>e.snapshot)}captureExchange(e,t){return t&&typeof t!=`string`&&isSqliteDatabaseAdmissionRetired(t)?[{...t,facts:/* @__PURE__ */ new Map,writeScopes:[],references:/* @__PURE__ */ new Map}]:this.capture(this.exchangeCursor,e)}resetExchangeCursor(){this.exchangeCursor=createSqliteDatabaseAdmissionCursor()}install(e){let t=/* @__PURE__ */ new Map;for(let n of e){let e=this.records.get(n.identity);if(n.descriptorOwner!==0||isSqliteDatabaseAdmissionRetired(n)){e&&isSqliteDatabaseAdmissionRetired(e)&&t.set(e,void 0);continue}let r=!1;if(e&&isSqliteDatabaseAdmissionRetired(e)&&(e=void 0),!e)e={...n,facts:new Map(n.facts),writeScopes:/* @__PURE__ */ new Map,references:new Map(n.references),hostRevision:void 0},this.records.set(n.identity,e),this.observeLocation(n.location,n.identity),r=!0;else if(e.generationId!==n.generationId)continue;!e.cleanCloseRefusal&&n.cleanCloseRefusal&&(e.cleanCloseRefusal=n.cleanCloseRefusal,r=!0);for(let[t,i]of n.facts)isSqliteDatabaseAdmissionFactCurrent(n,i)&&e.facts.get(t)?.publication!==i.publication&&(e.facts.set(t,i),r=!0);let i=t.get(e)??[];for(let t of n.writeScopes)for(let[n,a]of t){if(Atomics.load(a.state,1)!==0)continue;let t=e.writeScopes.get(n);if(!(t?.identity===a.identity||P===0&&t&&Atomics.load(t.state,1)===0)){if(P===0){let t=advanceSqliteDatabaseGeneration(e,`writeScopeRevision`);this.scopeSweeps.get(e)===t&&this.scopeSweeps.set(e,t+1|0)}retainSqliteDatabaseWriteScope(e,n,a),i.push(n),r=!0}}let a=readSqliteDatabaseGeneration(e,`writeScopeRevision`);(P===0||n.writeScopeRevision===a)&&(r||=e.writeScopeRevision!==a,e.writeScopeRevision=a);for(let[t,i]of n.references)!e.references.has(t)&&Atomics.load(new Int32Array(i),0)>=0&&(e.references.set(t,i),r=!0);P!==0&&n.hostRevision!==void 0&&n.hostRevision!==e.hostRevision&&n.hostRevision===readSqliteDatabaseGeneration(e,`hostRevision`)&&(e.hostRevision=n.hostRevision,r=!0),this.retireUnreferenced(e),(r||isSqliteDatabaseAdmissionRetired(e))&&t.set(e,i.length>0?i:void 0)}return t.size>0&&this.publish(t),t.size>0}}}));function captureSqliteDatabaseAdmissions(e,t){return q.registry.capture(e,t)}function installSqliteDatabaseAdmissions(e){q.registry.install(e)}function exchangeSqliteDatabaseAdmission(e,t,n=!1,r){let i=q.exchange.getStore();if(i&&!q.exchanging){q.exchanging=!0;try{let a=typeof e==`string`?{location:e}:{admissions:[e]},s=q.registry.captureExchange(a,e);if(n&&s.length===0)return;installSqliteDatabaseAdmissions(i(s,typeof e==`string`?e:void 0,t,r))}catch(e){throw q.registry.resetExchangeCursor(),e}finally{q.exchanging=!1}}}var q,nf,rf=__esmMin((()=>{R(),Kd(),tf(),q=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteDatabaseAdmissions`),()=>({registry:new SqliteDatabaseAdmissionRegistry,descriptorPreparation:Promise.resolve(),connections:/* @__PURE__ */ new WeakMap,openedIdentities:/* @__PURE__ */ new WeakMap,unproven:/* @__PURE__ */ new WeakSet,suspended:/* @__PURE__ */ new WeakSet,local:/* @__PURE__ */ new WeakMap,rolledBack:/* @__PURE__ */ new WeakSet,dataWriters:/* @__PURE__ */ new WeakMap,localWriteRevisions:/* @__PURE__ */ new WeakMap,writeListeners:/* @__PURE__ */ new WeakMap,ddlRevisions:/* @__PURE__ */ new WeakMap,schemaDirty:/* @__PURE__ */ new WeakSet,localSchemaRevisions:/* @__PURE__ */ new Map,misses:/* @__PURE__ */ new WeakMap,exchange:new D,exchanging:!1,publication:0})),nf=readSqliteDatabaseAdmissions(Ze(Gd)),nf&&(installSqliteDatabaseAdmissions(nf),q.registry.captureExchange())}));function fileFields(e){return{dev:e.dev.toString(),ino:e.ino.toString(),birthtime:readDatabaseIdentityBirthtime(e),size:e.size.toString(),mtimeNs:e.mtimeNs.toString()}}function checksum(e){return me(`sha256`).update(e).digest(`hex`).slice(0,16)}function hasNoJournal(e){return[`-wal`,`-journal`].every(t=>{try{let n=v.statSync(`${e}${t}`,{bigint:!0});return n.isFile()&&n.size===0n}catch(e){if(T(e,`ENOENT`))return!0;throw e}})}function decodeSeal(e,t,n){let r=JSON.parse(e);if(!isRecord(r)||typeof r.payload!=`string`||r.checksum!==checksum(r.payload))return n(`malformed-proof`);let i=JSON.parse(r.payload);if(!isRecord(i)||i.version!==1||typeof i.schemaIdentity!=`string`||typeof i.verifiedAt!=`number`||!Number.isSafeInteger(i.verifiedAt)||!(`facts`in i)||!t.isFile())return n(`malformed-proof`);let a=Date.now()-i.verifiedAt;return a<0||a>af?n(`expired-proof`):Object.entries(fileFields(t)).every(([e,t])=>i[e]===t)?{schemaIdentity:i.schemaIdentity,verifiedAt:i.verifiedAt,facts:i.facts,...i.identity===void 0?{}:{identity:i.identity}}:n(`file-mismatch`)}function readSqliteCleanCloseSeal(e,t,n){let refuse=e=>{n?.(e)};try{let n=`${e}.seal`;if(!v.lstatSync(n).isFile())return refuse(`malformed-proof`);let r=decodeSeal(v.readFileSync(n,`utf8`),t,refuse);return r?hasNoJournal(e)?r:refuse(`journal-present`):void 0}catch(e){return refuse(T(e,`ENOENT`)?`no-proof`:`malformed-proof`)}}async function readSqliteCleanCloseSealAsync(e,t,n){let refuse=e=>{n?.(e)};try{let n=`${e}.seal`;if(!(await v.promises.lstat(n)).isFile())return refuse(`malformed-proof`);let r=decodeSeal(await v.promises.readFile(n,`utf8`),t,refuse);if(!r)return;for(let t of[`-wal`,`-journal`])try{let n=await v.promises.stat(`${e}${t}`,{bigint:!0});if(!n.isFile()||n.size!==0n)return refuse(`journal-present`)}catch(e){if(!T(e,`ENOENT`))throw e}return r}catch(e){return refuse(T(e,`ENOENT`)?`no-proof`:`malformed-proof`)}}function invalidateSqliteCleanCloseSeal(e){try{v.unlinkSync(`${e}.seal`)}catch(e){if(!T(e,`ENOENT`))throw e}}function writeSqliteCleanCloseSeal(e,t,n,r){try{let i=`${e}.seal`,a=v.lstatSync(i,{throwIfNoEntry:!1});if(!n.isFile()||a&&!a.isFile()||!hasNoJournal(e))return invalidateSqliteCleanCloseSeal(e),!1;let s=JSON.stringify({version:1,schemaIdentity:t,...fileFields(n),verifiedAt:r.verifiedAt,facts:r.facts,identity:r.identity});return v.writeFileSync(i,JSON.stringify({payload:s,checksum:checksum(s)})),!0}catch{try{invalidateSqliteCleanCloseSeal(e)}catch{}return!1}}var af,of=__esmMin((()=>{B(),L(),Yd(),af=6048e5}));function createSqliteLifecycleAggregateError(e,t,n){return AggregateError(e,t,{cause:n})}var sf=__esmMin((()=>{R(),resolveGlobalSingleton(Symbol.for(`openclaw.sqliteCoordinatorError`),()=>class extends Error{constructor(e,t){super(e),this.cause=t,this.name=`SqliteCoordinatorError`}})}));function resolveSqliteDatabaseFilePath(e){if(!e.startsWith(`file:`))return e;let[t=``]=e.slice(5).split(/[?#]/u,1);return t.startsWith(`/`)?j(e):decodeURIComponent(t)}function createSqliteDatabaseDescriptorOwner(e){function prepareOwnedSqliteDatabaseAdmission(t){let n=q.descriptorPreparation.then(async()=>{if(P!==0)throw Error(`SQLite descriptor preparation belongs to the host`);t.assertCurrent();let n=await v.promises.stat(t.location,{bigint:!0});assertDatabaseFileIdentity(n,t.expectedIdentity);let r=await v.promises.realpath(t.location);if(t.assertCurrent(),r!==t.location)throw Error(`SQLite private staging location changed before admission`);let i=readSqliteDatabaseAdmissionIdentity(n),a=q.registry.descriptors.get(i);if(retainPreparedSqliteDatabaseAdmissionLocation(t.location,t.expectedIdentity,{identity:i,canonicalPath:r}))return;let s=a?.descriptor??await new Promise((e,n)=>{v.open(t.location,`r`,(t,r)=>t?n(t):e(r))}),c=!1,l=!1;try{let n=await new Promise((e,t)=>{v.fstat(s,{bigint:!0},(n,r)=>n?t(n):e(r))});assertDatabaseFileIdentity(n,t.expectedIdentity),c=a===void 0;let i,u=await readSqliteCleanCloseSealAsync(r,n,e=>{i=e});assertDatabaseFileIdentity(await v.promises.stat(t.location,{bigint:!0}),t.expectedIdentity),t.assertCurrent();let d=q.registry.retainDescriptor(r,s,n);l=!0,e.load(d,{seal:u,refusal:i})}catch(e){if(c&&!l)try{await new Promise((e,t)=>{v.close(s,n=>n?t(n):e())})}catch(t){throw createSqliteLifecycleAggregateError([e,t],`SQLite preparation cleanup failed`,e)}throw e}});return q.descriptorPreparation=n.then(()=>{},()=>{}),n}function prepareSqliteDatabaseAdmissionAsync(t){let n=resolveAdmissionTarget(t.location,t.create!==void 0);if(!n)return Promise.resolve(void 0);let{filename:r,create:i}=n,a=t.identity,prepare=async()=>{t.assertCurrent();let n=a??await inspectDatabasePathIdentity(r);if(a=void 0,t.assertCurrent(),!n)return;if(t.expectedIdentity&&(n.key!==t.expectedIdentity.key||t.expectedIdentity.birthtime!==void 0&&n.birthtime!==t.expectedIdentity.birthtime))throw Error(`SQLite Worker path no longer matches its borrowed native owner`);let s=n.key.startsWith(`file:`),c=!s&&i?t.create:void 0;if(!s&&!c)return n;let l=`${n.key.slice(5)}:${n.birthtime}`;if(t.observedLocation&&t.observedLocation.identity!==l)throw Error(`SQLite database changed while retaining its admission identity`);if(P!==0){if(c)throw Error(`SQLite descriptor creation belongs to the host`);return pathAdmission(r,l),t.assertCurrent(),n}let u=s?q.registry.descriptors.get(l):void 0;if(u&&(assertDatabaseFileIdentity(u.file,n),retainPreparedSqliteDatabaseAdmissionLocation(r,void 0,{identity:l,canonicalPath:n.canonicalPath})))return n;let d,f;if(u)d=u.descriptor,f=u.file;else{c&&await c.authorize(n.canonicalPath),t.assertCurrent();let e=c?createDeferredCore():void 0;e&&c?.retain(e.promise);let i;try{i=await new Promise((e,t)=>{v.open(r,c?`wx`:`r`,420,(n,r)=>n?t(n):e(r))}),d=i,f=await new Promise((e,t)=>{v.fstat(d,{bigint:!0},(n,r)=>n?t(n):e(r))}),s&&assertDatabaseFileIdentity(f,n),q.registry.retainDescriptorCustody(n.canonicalPath,d,f),e?.resolve()}catch(t){if(i===void 0){if(e?.resolve(),c&&T(t,`EEXIST`))return prepare()}else e?.reject(t);throw t}}let p=s?n:{key:`file:${f.dev}:${f.ino}`,canonicalPath:n.canonicalPath,birthtime:readDatabaseIdentityBirthtime(f)},m,h=s?await readSqliteCleanCloseSealAsync(n.canonicalPath,f,e=>{m=e}):void 0,g=await inspectDatabasePathIdentity(r);if(!g||g.key!==p.key||g.birthtime!==p.birthtime||g.canonicalPath!==p.canonicalPath)throw Error(`SQLite database changed identity during admission`);t.assertCurrent();let _=q.registry.records.get(readSqliteDatabaseAdmissionIdentity(f)),y=_&&!isSqliteDatabaseAdmissionRetired(_)?_:q.registry.retainDescriptor(p.canonicalPath,d,f);return q.registry.observeLocation(r,y.identity),s?e.load(y,{seal:h,refusal:m}):e.markLoaded(y),p},s=q.descriptorPreparation.then(prepare);return q.descriptorPreparation=s.then(()=>{},()=>{}),s}function retainPreparedSqliteDatabaseAdmissionLocation(t,n,r){let i=!r&&q.registry.forLocation(t),a=i&&q.registry.descriptors.get(i.identity);if(i&&n?.birthtime!==void 0&&i.physicalIdentity.key===n.key&&i.physicalIdentity.birthtime===n.birthtime&&a&&a.descriptor===i.descriptor&&e.isLoaded(a))return e.load(i),!0;let s=r&&q.registry.descriptors.get(r.identity);if(r&&s&&e.isLoaded(s)){n&&assertDatabaseFileIdentity(s.file,n);let i=q.registry.records.get(r.identity),a=i&&!isSqliteDatabaseAdmissionRetired(i)?i:q.registry.retainDescriptor(r.canonicalPath,s.descriptor,s.file);return q.registry.observeLocation(t,a.identity),e.markLoaded(a),!0}return!1}function retainSqliteDatabaseAdmissionLocation(t,n,r){if(retainPreparedSqliteDatabaseAdmissionLocation(t,n,r))return;let i=v.statSync(t,{bigint:!0});if(!i.isFile())return;let a=readSqliteDatabaseAdmissionIdentity(i),s=q.registry.records.get(a);if(s&&!isSqliteDatabaseAdmissionRetired(s)){q.registry.observeLocation(t,a),e.load(s);return}if(P!==0)return;let c=q.registry.descriptors.get(a)?.descriptor??v.openSync(t,`r`),l=v.fstatSync(c,{bigint:!0});if(!l.isFile()||readSqliteDatabaseAdmissionIdentity(l)!==a)throw Error(`SQLite database changed while retaining its admission identity`);let u=q.registry.retainDescriptor(v.realpathSync.native(t),c,l);q.registry.observeLocation(t,u.identity),e.load(u)}function pathAdmission(t,n){try{let r=q.registry.forLocation(t);if(!r){let e=n;if(e===void 0&&P!==0){let n=v.statSync(t,{bigint:!0});if(!n.isFile())return;e=readSqliteDatabaseAdmissionIdentity(n)}exchangeSqliteDatabaseAdmission(t,void 0,!1,e!==void 0&&P!==0?{identity:e,canonicalPath:v.realpathSync.native(t)}:void 0),r=q.registry.forLocation(t)}return r?(e.load(r),r):(retainSqliteDatabaseAdmissionLocation(t),q.registry.forLocation(t))}catch(e){if(T(e,`ENOENT`))return;throw e}}function resolveAdmissionTarget(e,t){let n=e,r=t;if(n&&n!==`:memory:`){if(n.startsWith(`file:`)){let e=new URL(n);if(e.searchParams.get(`mode`)===`memory`||([`ro`,`rw`].includes(e.searchParams.get(`mode`)??``)&&(r=!1),n=resolveSqliteDatabaseFilePath(n),!n||n===`:memory:`))return}return{filename:n,create:r}}}function prepareSqliteDatabaseAdmission(t,n={}){let r=resolveAdmissionTarget(t,n.create);if(!r)return;let{filename:i,create:a}=r;try{let e=v.statSync(i,{bigint:!0});if(!e.isFile()){q.registry.observeLocation(i,void 0);return}let t=readSqliteDatabaseAdmissionIdentity(e);return q.registry.observeLocation(i,t),t}catch(t){if(T(t,`ENOENT`)){if(q.registry.observeLocation(i,void 0),!a)return;if(P!==0){let e=q.exchange.getStore()!==void 0;exchangeSqliteDatabaseAdmission(i,!0);let n=prepareSqliteDatabaseAdmission(i);if(e&&n===void 0)throw Error(`SQLite worker file creation requires host authority: ${i}`,{cause:t});return n}let n;try{n=v.openSync(i,`wx`,420)}catch(e){if(T(e,`EEXIST`))return prepareSqliteDatabaseAdmission(i);throw e}let r=v.fstatSync(n,{bigint:!0}),s=q.registry.retainDescriptor(v.realpathSync.native(i),n,r);if(e.markLoaded(s),prepareSqliteDatabaseAdmission(i)!==s.identity)throw Error(`SQLite database changed identity during file creation`,{cause:t});return s.identity}throw t}}return{prepareOwnedSqliteDatabaseAdmission,prepareSqliteDatabaseAdmissionAsync,retainSqliteDatabaseAdmissionLocation,retainPreparedSqliteDatabaseAdmissionLocation,prepareSqliteDatabaseAdmission,pathAdmission}}var cf=__esmMin((()=>{I(),L(),of(),rf(),tf(),sf(),Yd()}));function getSqliteNativeAdmissionFacts(e){return lf.operations.get(e)?.facts}var lf,uf=__esmMin((()=>{R(),lf=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteNativeAdmissions`),()=>({operations:/* @__PURE__ */ new WeakMap}))}));function createSqliteDatabaseAdmissionReader(e){let{state:t,admission:n,pathAdmission:r,exchange:i,retain:a,release:s,publishFact:c}=e;function readSqliteDatabaseWriteRevision(e){let r=sqlPublicationAnchor(e);if(!r.isOpen||t.suspended.has(r))return;let i=n(r);if(!i){let e=r.location();return!e||e===`:memory:`?t.localWriteRevisions.get(r)??0:void 0}return readSqliteDatabaseGeneration(i,`writeRevision`)}function readSqliteDatabaseSiblingWriteRevision(e){let n=sqlPublicationAnchor(e),r=readSqliteDatabaseWriteRevision(n);return r===void 0?void 0:r-(t.localWriteRevisions.get(n)??0)|0}function readSqliteDatabaseCleanClose(t){let n=e.prepareFileIdentity(t),i=r(t);return i!==void 0&&i.identity===n&&Atomics.load(new Int32Array(i.generation),K.sealPresent)===1}function readSqliteDatabaseIntegrityVerification(t){let n=typeof t==`string`?getOrLoadSqliteDatabaseAdmissionForPath(t,e.integrityVerificationKey,()=>void 0):getSqliteDatabaseAdmission(t,e.integrityVerificationKey);return n===void 0?void 0:{verifiedAt:n}}function readSqliteDatabaseCleanCloseRefusal(e){return n(sqlPublicationAnchor(e))?.cleanCloseRefusal}function retainSqliteDatabaseAdmissionForPath(e){let n=r(e);if(!n)return;try{a(n)}catch(e){throw s(n),e}let i=!1,c=t.registry.prepareLocation(e);return{location:e,identity:{...n.physicalIdentity,canonicalPath:n.location},isCurrent:()=>!i&&c()===n,release(){i||(i=!0,s(n))}}}function withPathAdmission(e,t){let n=r(e);if(!n)return t(void 0);try{return a(n),t(n)}finally{s(n)}}function getSqliteDatabaseAdmission(e,r,a={}){let s=sqlPublicationAnchor(e);if(!s.isOpen||t.suspended.has(s))return;let c=n(s,a.existingOnly!==!0&&!e.isTransaction);if(!c)return;let l=(isPostgresSqlConnection(e)?void 0:getSqliteNativeAdmissionFacts(e))?.get(r.name)??t.local.get(s)?.get(r.name);if(l&&l.revision===readSqliteDatabaseFactRevision(c,l.schemaDependent)&&(!l.schemaDependent||l.ddlRevision===(t.ddlRevisions.get(s)??0)))return readSqliteDatabaseAdmissionFact(l,r);if(r.schemaDependent&&t.schemaDirty.has(s))return;if(t.rolledBack.has(s)){if(e.isTransaction)return;t.rolledBack.delete(s)}let u=c.facts.get(r.name);if(!u||!isSqliteDatabaseAdmissionFactCurrent(c,u)||a.refresh&&r.writer!==`host`){if(r.writer===`host`)return e.isTransaction||P===0||c.hostRevision===readSqliteDatabaseGeneration(c,`hostRevision`)?void 0:(i(c),u=c.facts.get(r.name),u&&isSqliteDatabaseAdmissionFactCurrent(c,u)?readSqliteDatabaseAdmissionFact(u,r):void 0);let n=readSqliteDatabaseGeneration(c,`publicationRevision`),s=t.misses.get(c)??/* @__PURE__ */ new Map;t.misses.set(c,s),r.writer!==`connection`&&!e.isTransaction&&(a.refresh||s.get(r.name)!==n)&&(i(c),u=c.facts.get(r.name),s.set(r.name,readSqliteDatabaseGeneration(c,`publicationRevision`)))}return u&&isSqliteDatabaseAdmissionFactCurrent(c,u)?readSqliteDatabaseAdmissionFact(u,r):void 0}function getOrLoadSqliteDatabaseAdmissionForPath(e,t,n){let read=e=>{if(!e)return n();let r=e.facts.get(t.name),i=r&&isSqliteDatabaseAdmissionFactCurrent(e,r)?readSqliteDatabaseAdmissionFact(r,t):void 0;if(i!==void 0)return i;let a=readSqliteDatabaseFactRevision(e,t.schemaDependent),s=n();return s!==void 0&&c(e,t,admitSqliteDatabaseFactValue(t,s),a),s};return t.lifetime===`process`?withPathAdmission(e,read):read(r(e))}function peekSqliteDatabaseAdmissionForPath(e,n){let r=t.registry.forLocation(e),i=r?.facts.get(n.name);return r&&i&&isSqliteDatabaseAdmissionFactCurrent(r,i)?readSqliteDatabaseAdmissionFact(i,n):void 0}function prepareSqliteDatabaseAdmissionForPath(e,t){let n=r(e);if(!n)return()=>void 0;let i=new Int32Array(n.generation),a=t.schemaDependent?K.schemaRevision:K.factRevision,s=n.facts.get(t.name),c=s&&new Int32Array(s.current);return()=>{if(Atomics.load(i,K.retired)!==0)return;let e=n.facts.get(t.name);return e!==s&&(s=e,c=s&&new Int32Array(s.current)),s&&c&&Atomics.load(c,0)===1&&s.revision===Atomics.load(i,a)?readSqliteDatabaseAdmissionFact(s,t):void 0}}function getSqliteDatabaseSchemaRevision(e,r={}){let i=sqlPublicationAnchor(e),a=n(i,r.existingOnly!==!0);if(a)return readSqliteDatabaseGeneration(a,`schemaRevision`);let s=t.openedIdentities.get(i);return s?t.localSchemaRevisions.get(s)??0:void 0}function hasSqliteDatabaseSchemaAdmissionForPath(e){return hasSqliteDatabaseSchemaAdmission(r(e))}function getSqliteDatabaseAdmissionIdentityForPath(e){return t.registry.forLocation(e)?.physicalIdentity}function getSqliteDatabaseAdmissionSourceForPath(e){let n=t.registry.forLocation(e);return n&&{identity:n.physicalIdentity,canonicalPath:n.location}}function observeSqliteDatabaseAdmissionLocation(e,n){let r=t.registry.forLocation(n.canonicalPath);r?.physicalIdentity.key===n.key&&r.physicalIdentity.birthtime===n.birthtime&&t.registry.observeLocation(e,r.identity)}function hasSqliteDatabaseSchemaAdmissionForIdentity(e){if(!e.key.startsWith(`file:`)||e.birthtime===void 0)return!1;let n=`${e.key.slice(5)}:${e.birthtime}`;return hasSqliteDatabaseSchemaAdmission(t.registry.records.get(n))}return{readSqliteDatabaseWriteRevision,readSqliteDatabaseSiblingWriteRevision,readSqliteDatabaseCleanClose,readSqliteDatabaseIntegrityVerification,readSqliteDatabaseCleanCloseRefusal,getSqliteDatabaseAdmission,getSqliteDatabaseSchemaRevision,getOrLoadSqliteDatabaseAdmissionForPath,peekSqliteDatabaseAdmissionForPath,prepareSqliteDatabaseAdmissionForPath,hasSqliteDatabaseSchemaAdmissionForPath,getSqliteDatabaseAdmissionIdentityForPath,getSqliteDatabaseAdmissionSourceForPath,observeSqliteDatabaseAdmissionLocation,hasSqliteDatabaseSchemaAdmissionForIdentity,retainSqliteDatabaseAdmissionForPath}}var df=__esmMin((()=>{Wd(),tf(),uf()}));function readTableConstraintKeyword(e,t){let n=t;if(n.keyword===`CONSTRAINT`){let t=readSqlToken(e,n.end);n=t?readSqlToken(e,t.end):null}return n?.keyword&&ff.has(n.keyword)?n.keyword:null}function readSqlToken(e,t){let n=t;for(;n<e.length&&/\s/u.test(e[n]??``);)n+=1;let r=e[n];if(!r)return null;if(r===`"`||r==="`"||r===`[`){let t=skipSqlQuoted(e,n,r);return{end:t,keyword:null,raw:e.slice(n,t)}}let i=n;for(;i<e.length&&!/[\s(,]/u.test(e[i]??``);)i+=1;let a=e.slice(n,i);return{end:i,keyword:a.toUpperCase(),raw:a}}function normalizeSqlIdentifier(e){return e.startsWith(`"`)&&e.endsWith(`"`)?e.slice(1,-1).replaceAll(`""`,`"`).toLowerCase():e.startsWith("`")&&e.endsWith("`")?e.slice(1,-1).replaceAll("``","`").toLowerCase():e.startsWith(`[`)&&e.endsWith(`]`)?e.slice(1,-1).toLowerCase():e.toLowerCase()}function splitSqlList(e){let t=[],n=0,r=0;for(let i of unquotedSqlIndexes(e,0)){let a=e[i];a===`(`?n+=1:a===`)`?--n:a===`,`&&n===0&&(t.push(e.slice(r,i)),r=i+1)}return t.push(e.slice(r)),t}function findSqlCharacter(e,t){for(let n of unquotedSqlIndexes(e,0))if(e[n]===t)return n;return-1}function findSqlClosingParenthesis(e,t){let n=0;for(let r of unquotedSqlIndexes(e,t)){let t=e[r];if(t===`(`)n+=1;else if(t===`)`&&(--n,n===0))return r}throw Error(`SQLite schema contains an unterminated table definition.`)}function normalizeSqlWhitespace(e){let t=``,n=!1,r=/[^\s'"`[/-]+|\s+|./gsu,i;for(;i=r.exec(e);){let a=i.index,s=i[0][0]??``,c=skipSqlQuoted(e,a,s),l=i[0];if(c!==a)l=e.slice(a,c),r.lastIndex=c;else{let t=skipSqlComment(e,a);if(t!==a){n=!0,r.lastIndex=t;continue}if(/\s/u.test(s)){n=!0;continue}}n&&t.length>0&&(t+=` `),t+=l,n=!1}return t.trim()}function*unquotedSqlIndexes(e,t){let n=t;for(;n<e.length;){let t=skipSqlQuoted(e,n,e[n]??``),r=t===n?skipSqlComment(e,n):t;r===n?(yield n,n+=1):n=r}}function skipSqlQuoted(e,t,n){if(n!==`'`&&n!==`"`&&n!=="`"&&n!==`[`)return t;let r=n===`[`?`]`:n,i=t+1;for(;i<e.length;)if(e[i]!==r)i+=1;else if(n!==`[`&&e[i+1]===r)i+=2;else return i+1;return e.length}function skipSqlComment(e,t){if(e.startsWith(`--`,t)){let n=e.indexOf(`
`,t+2);return n===-1?e.length:n+1}if(e.startsWith(`/*`,t)){let n=e.indexOf(`*/`,t+2);return n===-1?e.length:n+2}return t}var ff,pf=__esmMin((()=>{ff=/* @__PURE__ */ new Set([`CHECK`,`FOREIGN`,`PRIMARY`,`UNIQUE`])}));function parseSqliteTableDefinition(e,t){if(e===null)throw Error(`Could not inspect SQLite table definition for ${t}.`);let n=findSqlCharacter(e,`(`);if(n===-1)throw Error(`SQLite table ${t} has no column definition.`);let r=findSqlClosingParenthesis(e,n),i=/* @__PURE__ */ new Map,a=[];for(let s of splitSqlList(e.slice(n+1,r))){let e=normalizeSqlWhitespace(s);if(!e)continue;let n=readSqlToken(e,0);if(!n)throw Error(`SQLite table ${t} contains an unreadable definition.`);if(readTableConstraintKeyword(e,n)){a.push(e);continue}let r=normalizeSqlIdentifier(n.raw);if(i.has(r))throw Error(`SQLite table ${t} contains duplicate column ${r}.`);i.set(r,e)}return{columns:new Map([...i].toSorted(([e],[t])=>e.localeCompare(t))),constraints:a.toSorted()}}var mf=__esmMin((()=>{pf()}));function hasPendingAgentStartupColumns(e){let t=/* @__PURE__ */ new Map;return gf.some(({tableName:n,columnName:r})=>{if(!e.has(n))return!1;let i=e.get(n);if(!i)return!0;let a=t.get(n);return a||(a=parseSqliteTableDefinition(i,n).columns,t.set(n,a)),!a.has(r)})}var hf,gf,_f=__esmMin((()=>{mf(),hf=[{columnName:`owner_actor_type`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_actor_id`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_assigned_by_type`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_assigned_by_id`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_assigned_at`,dataType:`INTEGER`,tableName:`session_nodes`}],[...hf],gf=[{tableName:`session_pending_inputs`,columnName:`consumed_event_id`,dataType:`TEXT`},{tableName:`session_transcript_active_events`,columnName:`context_eligible`,dataType:`INTEGER`},{tableName:`session_nodes`,columnName:`project_id`,dataType:`TEXT`},{tableName:`session_windows`,columnName:`row_transcript_json`,dataType:`TEXT`},{tableName:`session_windows`,columnName:`row_transcript_updated_at`,dataType:`INTEGER`},{tableName:`session_conversations`,columnName:`route_context_json`,dataType:`TEXT`}]})),vf,yf=__esmMin((()=>{vf=`import{createRequire}from"node:module";try{const candidate=process.argv[2];if(!candidate||process.argv.length!==3){throw new Error("Expected one SQLite library path")}const require2=createRequire(import.meta.url);const{Database}=require2("bun:sqlite");Database.setCustomSQLite(candidate);const database=new Database(":memory:");let facts;try{facts=database.query("SELECT sqlite_version() AS version, sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted").get()}finally{database.close()}process.stdout.write(JSON.stringify({protocol:1,version:facts.version,extensionLoadingSupported:facts.omitted===0}))}catch(error){process.stdout.write(JSON.stringify({protocol:1,error:(error instanceof Error?error.message:String(error)).slice(0,512)}));process.exitCode=1}
`}));function materializeRuntimeProcessScriptFile(e,t={}){let n=v.mkdtempSync(E.join(t.parentDirectory??k.tmpdir(),`openclaw-script-`)),r=E.join(n,e.fileName),i=!1,dispose=()=>{if(!i)try{v.rmSync(n,{recursive:!0,force:!0}),i=!0}catch(e){process.emitWarning(`Runtime script cleanup failed at ${n}: ${e instanceof Error?e.message:String(e)}`)}};try{return v.writeFileSync(r,e.source,{mode:384,flag:`wx`}),{url:He(r),dispose}}catch(e){throw dispose(),e}}var bf=__esmMin((()=>{}));function probeBunSqliteLibrary(e){let t=materializeRuntimeProcessScriptFile({fileName:oi.bunSqliteLibraryProbe.fileName,source:vf});try{let n=j(t.url),r=E.dirname(n),i=E.join(r,`bunfig.toml`);v.writeFileSync(i,``,{mode:384,flag:`wx`});let a={};for(let e of[`SystemRoot`,`SYSTEMROOT`,`WINDIR`,`TEMP`,`TMP`,`TMPDIR`])process.env[e]&&(a[e]=process.env[e]);let s=_(process.execPath,[`--no-install`,`--no-env-file`,`--config=${i}`,n,E.resolve(e)],{cwd:r,env:resolveRuntimeScriptEnv(a),encoding:`utf8`,stdio:[`ignore`,`pipe`,`pipe`],timeout:5e3,killSignal:`SIGKILL`,maxBuffer:4096});if(s.error)throw s.error;let c=parseProbeFacts(s.stdout);if(s.status!==0)throw Error(c&&`error`in c&&typeof c.error==`string`?c.error.slice(0,512):`SQLite library probe failed (${s.signal??s.status})`);if(!c||!(`version`in c)||typeof c.version!=`string`||c.version.length>64||!(`extensionLoadingSupported`in c)||typeof c.extensionLoadingSupported!=`boolean`)throw Error(`SQLite library probe returned invalid output`);return{version:c.version,extensionLoadingSupported:c.extensionLoadingSupported}}finally{t.dispose()}}function parseProbeFacts(e){let t;try{t=JSON.parse(e)}catch{return}return typeof t==`object`&&t&&!Array.isArray(t)&&`protocol`in t&&t.protocol===1?t:void 0}var xf=__esmMin((()=>{Nl(),yf(),si(),bf()})),Sf,Cf=__esmMin((()=>{Sf=`openclaw.processMachineIdentity`}));function isSqliteWalResetSafeVersion(e){let t=/^(\d+)\.(\d+)\.(\d+)$/u.exec(e.trim());if(!t)return!1;let[n,r,i]=t.slice(1).map(Number);return[n,r,i].every(Number.isSafeInteger)?n>3||n===3&&(r>51||r===51&&i>=3||r===50&&i>=7||r===44&&i>=6):!1}var wf=__esmMin((()=>{})),Tf=__esmMin((()=>{wf()})),Ef=/* @__PURE__ */ __exportAll({probeSqliteNativeClose:()=>probeSqliteNativeClose});async function cleanupProbe(e,t,n){try{e&&(n&&e.unref(),await raceWithTimeout(e.terminate(),5e3,()=>{throw Error(`SQLite close check termination timed out after 5000ms`)},{ref:!n}),await a(void 0,{ref:!n})),t&&await Se(t,{recursive:!0,force:!0})}catch(n){e?.unref();let r=`SQLite close check cleanup failed: ${String(n)}; retained ${t}`;return process.emitWarning(r,{code:`SQLITE_CLOSE_PROBE_CLEANUP`}),r}}async function probeSqliteNativeClose(){let e,t,n,r;try{e=await be(fe(Ee(),`openclaw-sqlite-close-`)),e=await xe(e),Df.publish({phase:`start`}),t=new Xe(resolveRuntimeWorkerUrl(Pl.sqliteCloseProbe),{workerData:e,execArgv:[]});let i=t;r=await new Promise((e,t)=>{i.once(`message`,n=>{typeof n==`string`?e({explicitSqliteCloseReleasesNativeResources:n===``,reason:n||`Native close check passed`}):t(/* @__PURE__ */ Error(`Invalid SQLite close check reply`))}),i.once(`error`,t),i.once(`exit`,e=>t(/* @__PURE__ */ Error(`SQLite close check exited before its reply (${e})`))),n=setTimeout(()=>t(/* @__PURE__ */ Error(`SQLite close check timed out after 10000ms`)),1e4)})}catch(e){r={explicitSqliteCloseReleasesNativeResources:!1,reason:String(e)}}finally{clearTimeout(n)}let i=!r.explicitSqliteCloseReleasesNativeResources,a=cleanupProbe(t,e,i);if(i)return r;let s=await a;return s?{explicitSqliteCloseReleasesNativeResources:!1,reason:s}:r}var Df,Of=__esmMin((()=>{ga(),Fl(),Hl(),Df=Ke(`openclaw.sqlite.close-probe`)}));function createCapabilities(e){let t,n,r=0,i=Object.freeze({explicitSqliteCloseReleasesNativeResources:!1,decided:!1,reason:`SQLite close capability has not been decided`});function decide(e){return t||(t=Object.freeze(e),$e(Af,t),t.explicitSqliteCloseReleasesNativeResources&&r>0&&process.emitWarning(`SQLite close became capable after ${r} topology owners were created; those owners remain conservative`,{code:`SQLITE_EARLY_TOPOLOGY`})),t}function conservative(e){return{explicitSqliteCloseReleasesNativeResources:!1,decided:!0,reason:e}}function settled(){if(t)return t;if(!process.versions.bun)return decide({explicitSqliteCloseReleasesNativeResources:!0,decided:!0,reason:`Node runtime`});if(process.platform===`win32`)return decide(conservative(`Bun Windows native-close conformance is not qualified`));if(!N)return decide({...i,reason:`Parent did not complete SQLite close admission`,...Ze(Af)})}return{get(){return settled()??i},capture(){let e=settled()??i;return e.decided||(r+=1),e.explicitSqliteCloseReleasesNativeResources},initialize(){return n??=(async()=>{e();let t=settled();if(t)return t;try{if(parseDiagnosticEnvFlags(process.env.OPENCLAW_DIAGNOSTICS).flags.some(e=>e.toLowerCase()===`sqlite.close.conservative`))return decide(conservative(`SQLite close optimization disabled by internal diagnostic flag`));let{probeSqliteNativeClose:e}=await Promise.resolve().then(()=>(Of(),Ef));return decide({...await e(),decided:!0})}catch(e){return decide(conservative(`SQLite close check failed: ${String(e)}`))}})(),n}}}function selectLibrary(t){let{Database:n}=e(import.meta.url)(`bun:sqlite`);n.setCustomSQLite(t)}function createSelector(){let e,t;return(n={})=>{if(t)throw t;if(e)return e;let r=n.explicitPath??(process.env.OPENCLAW_SQLITE_LIBRARY?.trim()||void 0);if(!process.versions.bun||process.platform!==`darwin`)return e=r?{source:`runtime`,ignoredOverride:`OPENCLAW_SQLITE_LIBRARY requires Bun on macOS`}:{source:`runtime`},e;let i=n.standaloneRoot??resolveStandaloneSidecarRoot(),a=r===void 0&&i!==void 0?pe.join(i,`lib/libsqlite3.dylib`):void 0,s=process.env.HOMEBREW_PREFIX?.trim(),c=r===void 0?[.../* @__PURE__ */ new Set([...a?[a]:[],...s?[pe.join(s,`opt/sqlite/lib/libsqlite3.dylib`)]:[],`/opt/homebrew/opt/sqlite/lib/libsqlite3.dylib`,`/usr/local/opt/sqlite/lib/libsqlite3.dylib`,`/opt/local/lib/libsqlite3.dylib`])]:[r],l=[];for(let n of c){let i=r===void 0?n===a?`bundled`:`discovered`:`env`,s,c=!0;try{try{s=probeBunSqliteLibrary(n)}catch(e){throw c=y(n),c?e:Error(`missing file`,{cause:e})}if(!isSqliteWalResetSafeVersion(s.version))throw Error(`SQLite version ${s.version} below the WAL safety floor`);if(!s.extensionLoadingSupported)throw Error(`built with SQLITE_OMIT_LOAD_EXTENSION`)}catch(e){if(r===void 0){(c||n===a)&&l.push(`${n} (${e instanceof Error?e.message:String(e)})`);continue}throw t=selectionError(n,e,i===`bundled`),t}try{selectLibrary(n)}catch(e){throw t=selectionError(n,e,i===`bundled`),t}return e={source:i,path:n,version:s.version,extensionLoadingSupported:!0},e}throw t=/* @__PURE__ */ Error(`No supported SQLite library for Bun on macOS (${process.arch})`+(l.length>0?`; unusable: ${l.join(`, `)}`:``)+`. Apple's system SQLite fails OpenClaw's read-only database connections. `+(a?`Rebuild or replace the complete standalone artifact to restore its bundled SQLite library. `:``)+`Install one with brew install sqlite, or set OPENCLAW_SQLITE_LIBRARY to a libsqlite3.dylib built for ${process.arch}.`),t}}function selectionError(e,t,n=!1){let r=n?`Rebuild or replace the complete standalone artifact (openclaw and runtime/), or set OPENCLAW_SQLITE_LIBRARY to a supported library.`:`Fix or unset OPENCLAW_SQLITE_LIBRARY; install a supported library with brew install sqlite.`;return Error(`Cannot use ${n?`bundled `:``}SQLite library ${e}: ${t instanceof Error?t.message:String(t)}. ${r}`,{cause:t})}function readPublishedSqliteLibrarySelection(){return Ze(kf)}function createRuntimeSelector(){let e=!!process.versions.bun&&process.platform===`darwin`,t;e&&!N&&(t=readPublishedSqliteLibrarySelection());let n=createSelector(),r=!1;return i=>{let a=t??n(i);return e&&N&&!r&&($e(kf,Object.freeze({...a})),r=!0),a}}function runtimeSelector(){return resolveGlobalSingleton(Symbol.for(`openclaw.bunSqliteLibrarySelection`),createRuntimeSelector)}function capabilities(){let e=runtimeSelector();return e.capabilities??=createCapabilities(e)}function getSqliteRuntimeCapabilities(){return capabilities().get()}function captureSqliteWorkerEnvironmentData(e=Ze(Gd)){return[[kf,ensureSqliteLibrarySelected()],[Af,getSqliteRuntimeCapabilities()],[jf,Ze(jf)],[Gd,e],[Sf,Ze(Sf)]]}function ensureSqliteLibrarySelected(e){return runtimeSelector()(e)}var kf,Af,jf,Mf=__esmMin((()=>{Nl(),R(),xf(),Cf(),Wr(),Kd(),Tf(),kf=`openclaw.bunSqliteLibrarySelection`,Af=`openclaw.sqliteRuntimeCapabilities`,jf=`openclaw.sqliteNativeRuntimeAdmission`}));function formatErrorMessage(e){return formatErrorMessage$1(e,{redact:redactSensitiveText})}var Nf=__esmMin((()=>{F(),il(),L()}));function compareValidSemver(e,t){let n=it(e),r=it(t);return n&&r?n.compare(r):null}var Pf=__esmMin((()=>{}));function shouldIgnoreWarning(e){return!!(e.code===`DEP0040`&&e.message?.includes(`punycode`)||e.code===`DEP0060`&&e.message?.includes(`util._extend`)||e.name===`ExperimentalWarning`&&e.message?.includes(`SQLite is an experimental feature`))}function normalizeWarningArgs(e){let t=e[0],n=e[1],r=e[2],i,a,s;return t instanceof Error?(i=t.name,s=t.message,a=t.code):typeof t==`string`&&(s=t),isRecord(n)?(typeof n.type==`string`&&(i=n.type),typeof n.code==`string`&&(a=n.code)):(typeof n==`string`&&(i=n),typeof r==`string`&&(a=r)),{name:i,code:a,message:s}}function installProcessWarningFilter(){let e=resolveGlobalSingleton(Ff,()=>({installed:!1}));if(e.installed)return;let t=process.emitWarning.bind(process),wrappedEmitWarning=((...e)=>{if(!shouldIgnoreWarning(normalizeWarningArgs(e))){if(e[0]instanceof Error&&isRecord(e[1])){let t=e[0],n=Object.assign(Error(t.message),{name:t.name,code:t.code});process.emit(`warning`,n)}else Reflect.apply(t,process,e)}});process.emitWarning=wrappedEmitWarning,e.installed=!0}var Ff,If=__esmMin((()=>{B(),R(),Ff=Symbol.for(`openclaw.warning-filter`)}));function assertSqliteWalResetSafeVersion(e,t){if(isSqliteWalResetSafeVersion(e))return;let n=process.config.variables,r=n.node_shared_sqlite===!0||n.node_shared_sqlite===`true`;throw Error(`OpenClaw requires SQLite 3.51.3+, 3.50.7+ within 3.50.x, or 3.44.6+ within 3.44.x for WAL safety; Node ${t} ${r?`uses shared system`:`embeds`} SQLite ${e}, which is affected by the upstream WAL-reset database corruption bug. ${r?`Upgrade the system SQLite library to one of those safe versions, or use a Node build embedding a safe version.`:`Upgrade to Node 24.22.1+ or 26.12.1+ before retrying.`}`)}function sqliteNativeRuntimeIdentity(){return{pid:process.pid,executable:process.execPath,nodeVersion:process.versions.node,bunVersion:process.versions.bun,library:ensureSqliteLibrarySelected()}}function parseSqliteNativeRuntimeAdmission(e){if(!isRecord(e)||e.format!==1||typeof e.version!=`string`||typeof e.extensionLoadingSupported!=`boolean`)return;let t=sqliteNativeRuntimeIdentity();if(Oe(e.runtime,t))return{format:1,runtime:t,version:e.version,storageIdentity:isRecord(e.storageIdentity)&&typeof e.storageIdentity.sourceId==`string`&&typeof e.storageIdentity.compileOptions==`string`?{sourceId:e.storageIdentity.sourceId,compileOptions:e.storageIdentity.compileOptions}:void 0,extensionLoadingSupported:e.extensionLoadingSupported}}function safeSqliteNativeRuntimeAdmission(e){try{let t=parseSqliteNativeRuntimeAdmission(e);return t&&isSqliteWalResetSafeVersion(t.version)?t:void 0}catch{return}}function captureSqliteNativeRuntimeAdmission(){return safeSqliteNativeRuntimeAdmission(Ze(jf))}function assertSafeSqliteRuntime(e){if(Rf===e)return;let t=parseSqliteNativeRuntimeAdmission(Ze(jf));if(t){assertSqliteWalResetSafeVersion(t.version,process.versions.node),Bf=(compareValidSemver(t.version,`3.45.0`)??-1)>=0,zf=t.extensionLoadingSupported,Rf=e;return}let n=new e.DatabaseSync(`:memory:`),r,i,a;try{let e=n.prepare(`SELECT sqlite_version() AS version, sqlite_source_id() AS sourceId, (SELECT group_concat(compile_options, ',') FROM (SELECT compile_options FROM pragma_compile_options ORDER BY compile_options)) AS compileOptions, sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted`).get();r=typeof e?.version==`string`?e.version:`unknown`,assertSqliteWalResetSafeVersion(r,process.versions.node),typeof e?.sourceId==`string`&&e.sourceId&&typeof e.compileOptions==`string`&&(i={sourceId:e.sourceId,compileOptions:e.compileOptions}),a=e?.omitted===0}finally{n.close()}Bf=(compareValidSemver(r,`3.45.0`)??-1)>=0,zf=a,Rf=e,$e(jf,{format:1,runtime:sqliteNativeRuntimeIdentity(),version:r,storageIdentity:i,extensionLoadingSupported:a})}function requireNodeSqlite(){installProcessWarningFilter();try{ensureSqliteLibrarySelected();let e=Lf("node:sqlite");return assertSafeSqliteRuntime(e),e}catch(e){let t=formatErrorMessage(e);throw Error(`SQLite support is unavailable or unsafe in this Node runtime. ${t}`,{cause:e})}}var Lf,Rf,zf,Bf,Vf=__esmMin((()=>{B(),Mf(),Nf(),Pf(),Tf(),If(),Lf=e(import.meta.url)})),Hf,Uf=__esmMin((()=>{Hf=`-- Session storage doctrine: session_nodes.entry_json owns hot logical-session facts;
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
`})),Wf=__esmMin((()=>{})),Gf,Kf=__esmMin((()=>{Gf=`

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
`}));function sqliteDatabaseSealSchemaFor(e){requireNodeSqlite();let t=captureSqliteNativeRuntimeAdmission(),n=t?.storageIdentity;if(!t||!n)return;let r=[t.runtime.nodeVersion,t.runtime.bunVersion??null],i=JSON.stringify([t.version,n.sourceId,n.compileOptions,...r]),a=me(`sha256`).update(JSON.stringify([qf,i,e])),s=me(`sha256`).update(e);return e!==`state`&&(a.update(`42`),a.update(Hf),s.update(`42`),s.update(Hf)),e!==`agent`&&(a.update(`40`),a.update(Gf),s.update(`40`),s.update(Gf)),{schemaIdentity:a.digest(`hex`),identity:{runtime:JSON.stringify(r),sqlite:{version:t.version,sourceId:n.sourceId,compileOptions:n.compileOptions.split(`,`).filter(e=>!e.startsWith(`COMPILER=`)).join(`,`)},schema:s.digest(`hex`),policy:qf}}}var qf,Jf=__esmMin((()=>{Vf(),Uf(),Wf(),Kf(),qf=3}));function sealSchema(e){let t=e.includes(`agent.schema-metadata`),n=t===e.includes(`state.schema-version`)?`other`:t?`agent`:`state`;return Yf[n]??=sqliteDatabaseSealSchemaFor(n)}function isSealedKey(e){return Qf.has(e)||e.startsWith(`memory.index-schema:`)}function encodeSealValue(e,t){return t instanceof Map?{sealType:`map`,entries:[...t]}:t instanceof Set?{sealType:`set`,entries:[...t]}:t instanceof SharedArrayBuffer?{sealType:`shared`,entries:[...new Int32Array(t)]}:t}function decodeSealValue(e,t){if(!isRecord(t)||!Array.isArray(t.entries))return t;if(t.sealType===`map`)return new Map(t.entries);if(t.sealType===`set`)return new Set(t.entries);if(t.sealType===`shared`){let e=new SharedArrayBuffer(t.entries.length*Int32Array.BYTES_PER_ELEMENT);return new Int32Array(e).set(t.entries),e}return t}var Yf,Xf,Zf,Qf,SqliteDatabaseCleanCloseSeals,$f=__esmMin((()=>{B(),_f(),Jf(),of(),tf(),Yf={},Xf={name:`sqlite.full-verification`,lifetime:`process`,read:e=>typeof e==`number`&&Number.isSafeInteger(e)?e:void 0},Zf={...Xf,name:`sqlite.quick-verification`},Qf=/* @__PURE__ */ new Set([`sqlite-schema`,`sqlite.full-verification`,`sqlite.quick-verification`,`state.schema-version`,`state.runtime-schema`,`state.integrity`,`agent.completed-validation`,`agent.canonical-validation-receipt`,`agent.schema-metadata`]),SqliteDatabaseCleanCloseSeals=class{constructor(e,t){this.publishFact=e,this.references=t,this.loaded=/* @__PURE__ */ new WeakMap}isLoaded(e){return this.loaded.has(e)}markLoaded(e){let t=this.references.descriptor(e)??e,n=this.loaded.get(t);n&&n!==e.generation&&Atomics.store(new Int32Array(e.generation),K.sealPresent,Atomics.load(new Int32Array(n),K.sealPresent)),this.loaded.set(t,e.generation)}load(e,t){if(P!==0)return;let n=this.references.descriptor(e)??e;if(this.loaded.has(n))this.markLoaded(e);else{this.markLoaded(e),e.cleanCloseRefusal=`malformed-proof`;try{t?.refusal&&(e.cleanCloseRefusal=t.refusal);let n=t?t.seal:readSqliteCleanCloseSeal(e.location,v.fstatSync(e.descriptor,{bigint:!0}),t=>{e.cleanCloseRefusal=t});if(!n||typeof n.facts!=`string`)return;let r=JSON.parse(n.facts,decodeSealValue);if(!Array.isArray(r)||!r.every(e=>Array.isArray(e)&&e.length===3&&typeof e[0]==`string`&&isSealedKey(e[0])&&typeof e[1]==`boolean`)||!r.some(([e,,t])=>(e===Xf.name||e===Zf.name)&&t===n.verifiedAt)||!r.some(([e,,t])=>e===`sqlite-schema`&&isRecord(t)))return;let i=sealSchema(r.map(([e])=>e));if(!i){e.cleanCloseRefusal=`identity-mismatch`;return}let a=n.identity;if(a!==void 0&&(!isRecord(a)||typeof a.runtime!=`string`||typeof a.schema!=`string`||typeof a.policy!=`number`))return;if(isRecord(a)&&typeof a.sqlite!=`string`){if(!isRecord(a.sqlite)||typeof a.sqlite.version!=`string`||typeof a.sqlite.sourceId!=`string`||typeof a.sqlite.compileOptions!=`string`)return;let t=a.schema!==i.identity.schema,n=a.policy!==i.identity.policy,r=a.sqlite.compileOptions!==i.identity.sqlite.compileOptions;if(t||n||r){e.cleanCloseRefusal=t?`schema-mismatch`:n?`policy-mismatch`:`feature-mismatch`;return}}else if(n.schemaIdentity!==i.schemaIdentity){e.cleanCloseRefusal=`identity-mismatch`;return}let s=r.find(([e])=>e===`sqlite-schema`)?.[2];if(!(s.tableSql instanceof Map))return;if(hasPendingAgentStartupColumns(s.tableSql)){e.cleanCloseRefusal=`schema-mismatch`;return}delete e.cleanCloseRefusal;for(let[t,n,i]of r)this.publishFact(e,{name:t,schemaDependent:n,lifetime:`process`},{value:i},readSqliteDatabaseFactRevision(e,n));Atomics.store(new Int32Array(e.generation),K.sealPresent,1)}catch{}finally{this.references.publish(e)}}}invalidate(e,t){invalidateSqliteCleanCloseSeal(t?.location??e),t&&Atomics.store(new Int32Array(t.generation),K.sealPresent,0)}prepare(e,t,n){let r=this.preparePublication(e,t,n);t&&this.references.retain(t);let i=t;return{publish:()=>i!==void 0&&r(),[Symbol.dispose]:()=>{let e=i;i=void 0,e&&this.references.release(e)}}}preparePublication(e,t,n){if(!t||e.isTransaction||n===void 0)return()=>!1;let r=[...t.facts].filter(([e,n])=>isSealedKey(e)&&isSqliteDatabaseAdmissionFactCurrent(t,n));if(!r.some(([e])=>e===`sqlite-schema`))return()=>!1;let i=JSON.stringify(r.map(([e,t])=>[e,t.schemaDependent,t.value]),encodeSealValue),a=sealSchema(r.map(([e])=>e));return a?()=>{if(e.isOpen||readSqliteDatabaseGeneration(t,`retired`)!==0||r.some(([,e])=>Atomics.load(new Int32Array(e.current),0)!==1||e.revision!==readSqliteDatabaseFactRevision(t,e.schemaDependent)))return!1;try{let e=v.fstatSync(t.descriptor,{bigint:!0});if(readSqliteDatabaseAdmissionIdentity(v.statSync(t.location,{bigint:!0}))!==t.identity)return!1;let r=writeSqliteCleanCloseSeal(t.location,a.schemaIdentity,e,{verifiedAt:n,facts:i,identity:a.identity});return Atomics.store(new Int32Array(t.generation),K.sealPresent,+!!r),r}catch{return!1}}:()=>!1}}}));function wrapSqliteWorkerError(e,t,...n){let r=n.filter(e=>e!==void 0).map(t=>toErrorObject(t,e)).filter((e,t,n)=>n.findIndex(t=>Oe(t,e))===t);return Object.assign(t===void 0?Error(e):new SqliteWorkerError(e,t),{cause:r.length>1?AggregateError(r,e):r[0]})}var ep,SqliteWorkerError,tp=__esmMin((()=>{F(),ep=Symbol.for(`openclaw.sqliteWorkerErrorCode`),SqliteWorkerError=class extends Error{constructor(e,t){super(e),this.code=t,this.name=`SqliteWorkerError`,Object.defineProperty(this,ep,{value:t})}}}));function withSqliteDatabaseAdmissionWait(e,t){let n={wait:e,parent:np.getStore(),active:!0},close=()=>{n.active=!1},r=!1;try{let e=np.run(n,t);return at(e)&&(r=!0,e.then(close,close)),e}finally{r||close()}}function readSqliteDatabaseAdmissionDeadline(){let e;for(let t=np.getStore();t;t=t.parent){if(!t.active)continue;let n=t.wait.deadlineAtMs;if(n!==void 0&&(e=Math.min(e??1/0,n)),t.wait.settlesCancellation)break}return e}function assertSqliteDatabaseAdmissionWaitActive(){try{for(let e=np.getStore();e;e=e.parent)if(e.active){if(e.wait.settlesCancellation)return;e.wait.assertActive?.()}}catch(e){throw wrapSqliteWorkerError(`SQLite admission facts exchange cancelled by its caller`,`unavailable`,e)}}function hasSqliteDatabaseAdmissionWait(){return np.getStore()!==void 0}var np,rp=__esmMin((()=>{R(),tp(),np=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteDatabaseAdmissionWait`),()=>new D)})),ip=__esmMin((()=>{R(),resolveGlobalSingleton(Symbol.for(`openclaw.sqliteInspectionOperations`),()=>/* @__PURE__ */ new WeakMap),resolveGlobalSingleton(Symbol.for(`openclaw.sqliteNativeOpenFailures`),()=>/* @__PURE__ */ new WeakSet),resolveGlobalSingleton(Symbol.for(`openclaw.sqliteSnapshotFailureScopes`),()=>new D)}));function hasSqlitePostCommitScope(e){return ap.has(sqlPublicationAnchor(e))}function stageSqliteTransactionState(e,t){let n=op.get(sqlPublicationAnchor(e));return n?(t.stage?.(),n.push({prepareCommit:t.prepareCommit,commit:t.commit,prepareObservers:t.prepareObservers,invalidate:t.invalidate,rollback:t.rollback}),!0):!1}var ap,op,sp=__esmMin((()=>{Wg(),R(),Wd(),sf(),createSubsystemLogger(`sqlite/publication`),ap=resolveGlobalSingleton(Symbol.for(`openclaw.sqlitePostCommitPublications`),()=>/* @__PURE__ */ new WeakMap),op=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteTransactionState`),()=>/* @__PURE__ */ new WeakMap)}));function isPreparingSqliteNativeMutation(e){return cp.get(e)?.phase===`preparing`}var cp,lp=__esmMin((()=>{R(),ip(),sp(),resolveGlobalSingleton(Symbol.for(`openclaw.sqliteNativeExecution`),()=>/* @__PURE__ */ new WeakMap),cp=resolveGlobalSingleton(Symbol.for(`openclaw.sqlitePreparedNativeMutation`),()=>/* @__PURE__ */ new WeakMap),new FinalizationRegistry(e=>{for(let t of e)t.finish(!1,!0)})}));function createSqliteDatabaseWriteReceipts(e){function onSqliteDatabaseWriteSettled(t,n){let r=sqlPublicationAnchor(t),i=e.admission(r);if(!i)return;let a=e.writeListeners.get(i);return a||(a=/* @__PURE__ */ new Set,e.writeListeners.set(i,a)),registerListener(a,n)}function settleWorker(t,n){let r=n>0?t.references.get(n):void 0;if(r&&Atomics.exchange(new Int32Array(r),1,0)>0){advanceSqliteDatabaseGeneration(t,`writeRevision`),advanceSqliteDatabaseGeneration(t,`unscopedWriteRevision`);let n=e.writeListeners.get(t);n&&notifyListeners(n,void 0)}}function withSqliteDatabaseWriteScope(t,n,r){let i=sqlPublicationAnchor(t),a=e.admission(i);if(!(a?readSqliteDatabaseGeneration(a,`writeScopeRevision`)>0:J.localScopeRevisions.has(i))){let e=r();if(isPromiseLike(e))throw Error(`SQLite write scopes cannot await work`);return e}let s=normalizedWriteScopes(n),c=J.writeScopes.get(i);J.writeScopes.set(i,s);try{let e=r();if(isPromiseLike(e))throw Error(`SQLite write scopes cannot await work`);return e}finally{c?J.writeScopes.set(i,c):J.writeScopes.delete(i)}}function withoutSqliteDatabaseWriteScope(e,t){let n=sqlPublicationAnchor(e),r=J.writeScopes.get(n);J.writeScopes.delete(n);try{return t()}finally{r&&J.writeScopes.set(n,r)}}function ensureWriteScopes(t,n,r){let i=!1;for(let e of n){let n=t.writeScopes.get(e);(!n||Atomics.load(n.state,1)!==0||r&&!pinWriteScope(n))&&(n=createScopeRevision(),r&&Atomics.store(n.state,2,1),P===0&&advanceSqliteDatabaseGeneration(t,`writeScopeRevision`),i=!0),r&&r.push(n),retainSqliteDatabaseWriteScope(t,e,n)}i&&(advanceSqliteDatabaseGeneration(t,`publicationRevision`),e.publish(t,n))}function pinWriteScope(e){let t=Atomics.load(e.state,2);for(;t>=0;){let n=Atomics.compareExchange(e.state,2,t,t+1);if(n===t)return!0;t=n}return!1}let t,n=0;function createScopeRevision(){t&&n!==t.byteLength||(t=new SharedArrayBuffer(48*Int32Array.BYTES_PER_ELEMENT),n=0);let e=new Int32Array(t,n,3);return n+=e.byteLength,{identity:ge(),state:e}}function retainSqliteDatabaseWriteScopesForPath(t,n){let r=e.pathAdmission(t);if(!r||isSqliteDatabaseAdmissionRetired(r))return;let i=[],a=!1,release=()=>{if(!a){a=!0;try{for(let e of i)Atomics.sub(e.state,2,1);i.length>0&&!isSqliteDatabaseAdmissionRetired(r)&&pruneSqliteDatabaseWriteScopes(r)&&(advanceSqliteDatabaseGeneration(r,`publicationRevision`),e.publish(r,[]))}finally{e.release(r)}}};try{return e.retain(r),ensureWriteScopes(r,normalizedWriteScopes(n),i),release}catch(e){throw release(),e}}function retireSqliteDatabaseWriteScopes(t,n){let r=sqlPublicationAnchor(t),i=normalizedWriteScopes(n),a=e.admission(r),retire=()=>{let t=a?.writeScopes??J.localScopeRevisions.get(r),s=n.flatMap(e=>typeof e!=`string`&&e.partition===void 0?[normalizedWriteScopes([e])[0].slice(0,-1)+`,`]:[]);for(let e of t?.keys()??[])s.some(t=>e.startsWith(t))&&i.push(e);if(!a){let e=J.localScopeRevisions.get(r);for(let t of i)e?.delete(t);return}if(isSqliteDatabaseAdmissionRetired(a))return;let c=!1;for(let e of i){let t=a.writeScopes.get(e);t&&Atomics.exchange(t.state,1,1)===0&&(c=!0)}c&&(advanceSqliteDatabaseGeneration(a,`writeScopeRevision`),advanceSqliteDatabaseGeneration(a,`publicationRevision`),e.publish(a,i))};!stageSqliteTransactionState(r,{commit:retire})&&!t.isTransaction&&retire()}function prepareSqliteDatabaseScopedWriteRevisionForPath(t,n){let r=retainSqliteDatabaseWriteScopesForPath(t,n);if(!r)return;let i=e.pathAdmission(t);if(!i){r();return}let a=normalizedWriteScopes(n).map(e=>i.writeScopes.get(e)),s=a.map(e=>Atomics.load(e.state,0)),c=/* @__PURE__ */ new WeakMap,l=new Int32Array(i.generation),u=!1,inspectReference=e=>{let t=c.get(e);t||(t=new Int32Array(e),c.set(e,t)),u||=Atomics.load(t,1)>0},d=Atomics.load(l,K.schemaRevision),f=Atomics.load(l,K.unscopedWriteRevision),p=0,m=!1;return{read(){if(m||Atomics.load(l,K.retired)!==0||(u=!1,i.references.forEach(inspectReference),u))return;let e=Atomics.load(l,K.schemaRevision),t=Atomics.load(l,K.unscopedWriteRevision),n=d!==e||f!==t;d=e,f=t;for(let e=0;e<a.length;e++){let t=a[e];if(Atomics.load(t.state,1)!==0)return;let r=Atomics.load(t.state,0);n||=s[e]!==r,s[e]=r}return n&&p++,p},release(){m||(m=!0,r())}}}function scopedWriteToken(e,t,n,r=0){let i=readSqliteDatabaseGeneration(e,`schemaRevision`)+r|0,a=[];for(let r of t){let s=e.writeScopes.get(r);if(!s||Atomics.load(s.state,1)!==0)return JSON.stringify([e.identity,e.generationId,i,`database`,readSqliteDatabaseGeneration(e,`writeRevision`)+(n===void 0?0:1)|0,t]);a.push([r,s.identity,Atomics.load(s.state,0)+ +!!n?.has(r)|0])}return JSON.stringify([e.identity,e.generationId,i,readSqliteDatabaseGeneration(e,`unscopedWriteRevision`)+ +(n===null)|0,a])}function localScopedWriteToken(e,t,n){return JSON.stringify([`memory`,(J.localUnscopedRevisions.get(e)??0)+ +(n===null),t.map(t=>[t,J.localScopeRevisions.get(e).get(t).identity,Atomics.load(J.localScopeRevisions.get(e).get(t).state,0)+ +!!n?.has(t)|0])])}function normalizedWriteScopes(e){return[...new Set((typeof e==`string`?[e]:e).map(e=>JSON.stringify(typeof e==`string`?[`key`,je(e)]:[`session-id`,je(e.sessionId),...e.partition===void 0?[]:[je(e.partition)]])))].toSorted()}function ensureLocalWriteScopes(e,t){let n=J.localScopeRevisions.get(e)??/* @__PURE__ */ new Map;for(let e of t)n.has(e)||n.set(e,createScopeRevision());J.localScopeRevisions.set(e,n)}function readScopedWriteToken(t,n,r,i=0){let a=normalizedWriteScopes(n),s=e.admission(t);if(s?ensureWriteScopes(s,a):ensureLocalWriteScopes(t,a),e.readRevision(t)!==void 0)return s?scopedWriteToken(s,a,r,i):localScopedWriteToken(t,a,r)}function readSqliteDatabaseScopedWriteToken(e,t){return readScopedWriteToken(sqlPublicationAnchor(e),t)}function readSqliteDatabaseScopedWriteTokenForPath(t,n,r){let i=normalizedWriteScopes(n),a=e.pathAdmission(t,r);if(a&&!isSqliteDatabaseAdmissionRetired(a))return ensureWriteScopes(a,i),scopedWriteToken(a,i)}function readSqliteDatabaseScopedWriteTokensForPath(t,n){let r=e.pathAdmission(t);if(!r||isSqliteDatabaseAdmissionRetired(r))return;let i=n.map(normalizedWriteScopes);return ensureWriteScopes(r,i.flat()),i.map(e=>scopedWriteToken(r,e))}function readSqliteDatabasePendingScopedWriteToken(t,n){let r=sqlPublicationAnchor(t);return readScopedWriteToken(r,n,J.pendingWriteScopes.get(r),+!!e.hasPendingSchemaMutation(r))}function readSqliteDatabaseWriteTokenForPath(t){let n=e.pathAdmission(t);if(n&&!isSqliteDatabaseAdmissionRetired(n))return`${n.identity}:${n.generationId}:${readSqliteDatabaseGeneration(n,`writeRevision`)}`}function readSqliteDatabasePendingWriteToken(t){let n=sqlPublicationAnchor(t);if(!t.isOpen||!t.isTransaction&&!isPreparingSqliteNativeMutation(n)||!hasSqlitePostCommitScope(n)||e.suspended(n))return;let r=e.writer(n);if(r&&!isSqliteDatabaseAdmissionRetired(r))return`${r.identity}:${r.generationId}:${readSqliteDatabaseGeneration(r,`writeRevision`)+1|0}`}return{cancel(e){J.pendingWriteScopes.delete(e)},begin(e,t){let n=t?void 0:J.writeScopes.get(e),r=J.pendingWriteScopes.get(e);if(!n||r===null)J.pendingWriteScopes.set(e,null);else{let t=r??/* @__PURE__ */ new Set;for(let e of n)t.add(e);J.pendingWriteScopes.set(e,t)}},finish(e,t){let n=J.pendingWriteScopes.get(e);J.pendingWriteScopes.delete(e);let r=!n;if(n){let i=J.localScopeRevisions.get(e);for(let e of n){let n=i?.get(e);n&&Atomics.add(n.state,0,1);let a=t?.writeScopes.get(e);a&&Atomics.load(a.state,1)===0?Atomics.add(a.state,0,1):t&&(a||t.writeScopeRevision!==readSqliteDatabaseGeneration(t,`writeScopeRevision`))&&(r=!0)}}r&&(J.localUnscopedRevisions.set(e,(J.localUnscopedRevisions.get(e)??0)+1),t&&advanceSqliteDatabaseGeneration(t,`unscopedWriteRevision`))},settleWorker,onSqliteDatabaseWriteSettled,retireSqliteDatabaseWriteScopes,retainSqliteDatabaseWriteScopesForPath,prepareSqliteDatabaseScopedWriteRevisionForPath,withSqliteDatabaseWriteScope,withoutSqliteDatabaseWriteScope,readSqliteDatabaseScopedWriteToken,readSqliteDatabaseScopedWriteTokenForPath,readSqliteDatabaseScopedWriteTokensForPath,readSqliteDatabasePendingScopedWriteToken,readSqliteDatabaseWriteTokenForPath,readSqliteDatabasePendingWriteToken}}var J,up=__esmMin((()=>{iu(),R(),tr(),Wd(),tf(),lp(),sp(),J=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteDatabaseWriteScopes`),()=>({writeScopes:/* @__PURE__ */ new WeakMap,pendingWriteScopes:/* @__PURE__ */ new WeakMap,localScopeRevisions:/* @__PURE__ */ new WeakMap,localUnscopedRevisions:/* @__PURE__ */ new WeakMap}))})),dp,fp=__esmMin((()=>{R(),resolveGlobalSingleton(Symbol.for(`openclaw.postgresReadSnapshots`),()=>/* @__PURE__ */ new WeakMap),dp=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteSchemaFacts`),()=>/* @__PURE__ */ new WeakMap)}));function admission$1(e,t=!0){let n=q.openedIdentities.get(e);if(!e.isOpen||n===void 0||q.unproven.has(e))return;let r=q.connections.get(e);if(r)return isSqliteDatabaseAdmissionRetired(r)?void 0:r;let i=e.location();if(!i||i===`:memory:`)return;let a=t&&!e.isTransaction?bp(i,n):q.registry.records.get(n);if(a&&a.identity!==n)throw Error(`SQLite database changed identity before admission`);return a&&!isSqliteDatabaseAdmissionRetired(a)?retainConnection(e,a):void 0}function retainConnection(e,t){let n=t.identity,r=t;try{for(;;){if(r.identity!==n)throw Error(`SQLite database changed identity during native open`);let t=q.registry.changeReferences(r,1),i=!1;try{t&&exchangeSqliteDatabaseAdmission(r);let n=readSqliteDatabaseGeneration(r,`retired`);if(n===0)return q.connections.set(e,r),i=!0,r;if(n!==2)throw Error(`SQLite database admission retired during native open`)}finally{i||q.registry.changeReferences(r,-1)}let a=e.location(),s=e.isTransaction?q.registry.records.get(n):a?bp(a,yp(a)):void 0;if(!s||isSqliteDatabaseAdmissionRetired(s))throw Error(`SQLite database admission unavailable during native open`);r=s}}catch(t){throw q.openedIdentities.delete(e),t}}function retainReference(e){q.registry.changeReferences(e,1)&&exchangeSqliteDatabaseAdmission(e)}function releaseReference(e){q.registry.changeReferences(e,-1)&&(q.localSchemaRevisions.delete(e.identity),exchangeSqliteDatabaseAdmission(e))}function publishFact(e,t,n,r){if(t.writer===`host`&&P!==0)throw Error(`SQLite host-owned admission facts require the host publisher`);publishSqliteDatabaseFact(e,t,n,r,`${P}:${++q.publication}`)&&(q.registry.publish(e),t.writer!==`connection`&&exchangeSqliteDatabaseAdmission(e))}function trackSqliteDatabaseAdmissionWorker(e){let t=e.threadId;e.once(`exit`,()=>{for(let e of q.registry.records.values())Rp.settleWorker(e,t);q.registry.releaseWorker(t)})}var pp,mp,hp,gp,_p,vp,yp,bp,xp,Sp,Cp,wp,Tp,Ep,Dp,Op,kp,Ap,jp,Mp,Np,Pp,Fp,Ip,Lp,Rp,zp,Bp,Vp,Hp,Up,Wp,Gp,Kp,qp,Jp,Yp,Xp,Zp=__esmMin((()=>{R(),rf(),cf(),df(),tf(),$f(),rp(),up(),uf(),sp(),fp(),pp=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteDatabaseCleanCloseSeals`),()=>new SqliteDatabaseCleanCloseSeals(publishFact,{retain:e=>q.registry.changeReferences(e,1),release:releaseReference,publish:e=>q.registry.publish(e),descriptor:e=>q.registry.descriptors.get(e.identity)})),mp=createSqliteDatabaseDescriptorOwner(pp),{prepareOwnedSqliteDatabaseAdmission:hp,prepareSqliteDatabaseAdmissionAsync:gp,retainSqliteDatabaseAdmissionLocation:_p,retainPreparedSqliteDatabaseAdmissionLocation:vp,prepareSqliteDatabaseAdmission:yp}=mp,{pathAdmission:bp}=mp,xp=createSqliteDatabaseAdmissionReader({state:q,admission:admission$1,pathAdmission:bp,prepareFileIdentity:yp,integrityVerificationKey:Xf,exchange:exchangeSqliteDatabaseAdmission,publishFact,retain:retainReference,release:releaseReference}),{readSqliteDatabaseCleanClose:Sp,readSqliteDatabaseWriteRevision:Cp,readSqliteDatabaseSiblingWriteRevision:wp,readSqliteDatabaseIntegrityVerification:Tp,readSqliteDatabaseCleanCloseRefusal:Ep,getSqliteDatabaseAdmission:Dp,getSqliteDatabaseSchemaRevision:Op,getOrLoadSqliteDatabaseAdmissionForPath:kp,peekSqliteDatabaseAdmissionForPath:Ap,prepareSqliteDatabaseAdmissionForPath:jp,hasSqliteDatabaseSchemaAdmissionForPath:Mp,getSqliteDatabaseAdmissionIdentityForPath:Np,getSqliteDatabaseAdmissionSourceForPath:Pp,observeSqliteDatabaseAdmissionLocation:Fp,hasSqliteDatabaseSchemaAdmissionForIdentity:Ip,retainSqliteDatabaseAdmissionForPath:Lp}=xp,Rp=createSqliteDatabaseWriteReceipts({admission:admission$1,pathAdmission:(e,t)=>t?t.key.startsWith(`file:`)?q.registry.records.get(`${t.key.slice(5)}:${t.birthtime}`):void 0:bp(e),retain:retainReference,release:releaseReference,writeListeners:q.writeListeners,readRevision:Cp,writer:e=>q.dataWriters.get(e),suspended:e=>q.suspended.has(e),hasPendingSchemaMutation:e=>e.isTransaction&&dp.get(e)?.transactionalSchema===!0,publish(e,t){q.registry.publish(e,t),exchangeSqliteDatabaseAdmission(e)}}),{onSqliteDatabaseWriteSettled:zp,retireSqliteDatabaseWriteScopes:Bp,retainSqliteDatabaseWriteScopesForPath:Vp,prepareSqliteDatabaseScopedWriteRevisionForPath:Hp,withSqliteDatabaseWriteScope:Up,withoutSqliteDatabaseWriteScope:Wp,readSqliteDatabaseScopedWriteToken:Gp,readSqliteDatabaseScopedWriteTokenForPath:Kp,readSqliteDatabaseScopedWriteTokensForPath:qp,readSqliteDatabasePendingScopedWriteToken:Jp,readSqliteDatabaseWriteTokenForPath:Yp,readSqliteDatabasePendingWriteToken:Xp}=Rp})),Qp,$p,em=__esmMin((()=>{R(),Qp=resolveGlobalSingleton(Symbol.for(`openclaw.stateDatabaseAccessError`),()=>class extends Error{constructor(...e){super(...e),this.name=`StateDatabaseAccessError`}}),resolveGlobalSingleton(Symbol.for(`openclaw.gatewayStateOwnerContentionError`),()=>class extends Error{constructor(e,t,n,r){super(`OpenClaw state database is busy at ${e}. ${n?`${n} `:``}Wait for the other OpenClaw process to finish, then retry. If it persists, run \`openclaw gateway status\` and check for other OpenClaw processes using the same state directory. A running Gateway can hold this ownership until it stops; stop it through its service manager or original terminal before retrying.`),this.databasePath=e,this.cause=t,this.holderDetail=n,this.holder=r,this.name=`GatewayStateOwnerContentionError`}}),resolveGlobalSingleton(Symbol.for(`openclaw.stateDatabaseMaintenanceScopeError`),()=>class extends Qp{constructor(e){super(`Internal state ownership error at ${e}: this process holds maintenance ownership without an active schema lease or maintenance scope. Retry the command; if it persists, report this error.`),this.name=`StateDatabaseMaintenanceScopeError`}}),$p=resolveGlobalSingleton(Symbol.for(`openclaw.stateDatabaseAdmissionPendingError`),()=>class extends Qp{constructor(e,t){super(t),this.databasePath=e}}),resolveGlobalSingleton(Symbol.for(`openclaw.stateDatabaseOfflineMaintenanceError`),()=>class extends Qp{constructor(e,t){super(t),this.databasePath=e}})}));function currentSqliteOperationTiming(){return tm.getStore()?.timing}function forgetConnection(e){if(e.path){let t=nm.byPath.get(e.path);t?.delete(e.id),t?.size===0&&nm.byPath.delete(e.path)}}var tm,nm,rm=__esmMin((()=>{gr(),R(),Bu(),tm=new AsyncContext(Symbol.for(`openclaw.sqliteReaderOwners`)),nm=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteReaderConnections`),()=>({nextId:0,byDatabase:/* @__PURE__ */ new WeakMap,byPath:/* @__PURE__ */ new Map,finalizer:new FinalizationRegistry(e=>forgetConnection(e))}))}));function readSqliteWorkerMonotonicNs(){return im.bigint()}function readSqliteWorkerAdmissionDecision(e){if(!isRecord(e)||!(e.decision instanceof SharedArrayBuffer)||e.decision.byteLength!==Int32Array.BYTES_PER_ELEMENT||e.stage!==`open`&&e.stage!==`prepare`&&e.stage!==`transaction`&&e.stage!==`commit`)return;let t=new Int32Array(e.decision),n=typeof e.deadlineMs==`number`&&Number.isFinite(e.deadlineMs)?readSqliteWorkerMonotonicNs()+BigInt(Math.max(0,Math.ceil(e.deadlineMs)))*1000000n:void 0;return{decision:t,expired:()=>{if(n!==void 0&&readSqliteWorkerMonotonicNs()>=n&&Atomics.compareExchange(t,0,0,3)===0&&Atomics.notify(t,0),Atomics.load(t,0)!==3)return!1;if(Array.isArray(e.ports))for(let t of e.ports)t instanceof Je&&t.close();return!0},request:{stage:e.stage,facts:e.facts}}}var im,am=__esmMin((()=>{B(),R(),tp(),im=process.hrtime,resolveGlobalSingleton(Symbol.for(`openclaw.sqliteWorkerOpenRefusedError`),()=>class extends Error{constructor(e){super(`SQLite worker admission was refused before agent open`,{cause:e}),this.originalError=e,this.name=`SqliteWorkerOpenRefusedError`}}),resolveGlobalSingleton(Symbol.for(`openclaw.sqliteWorkerAdmissionTimeoutError`),()=>class extends Error{constructor(){super(`SQLite host admission timed out; retry after transaction rollback`),this.code=`admission-timeout`,this.name=`SqliteWorkerAdmissionTimeoutError`}})}));function getSqliteDatabaseAdmissionUpstream(){return dm.connection}function isSqliteDatabaseAdmissionLocation(e){return isRecord(e)&&typeof e.identity==`string`&&typeof e.canonicalPath==`string`}function exchangeDatabaseAdmissions(e,t,n,r,i){let{port1:a,port2:s}=new M,c=new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)),l=currentSqliteOperationTiming(),u=Date.now(),d=readSqliteDatabaseAdmissionDeadline(),f=d===void 0?um:Math.max(0,d-Date.now()),p=readSqliteWorkerMonotonicNs()+BigInt(Math.ceil(f))*1000000n,remaining=()=>{assertSqliteDatabaseAdmissionWaitActive();let e=Number(p-readSqliteWorkerMonotonicNs())/1e6;if(e<=0)throw new SqliteDatabaseAdmissionTimeoutError;return e};try{for(remaining(),e.postMessage({kind:`sqlite-database-admissions`,admissions:t,location:n,create:r,observedLocation:i,deadlineAtMs:d,port:s,decision:c.buffer},[s]);Atomics.load(c,0)===om;){let e=remaining();Atomics.wait(c,0,om,hasSqliteDatabaseAdmissionWait()?Math.min(100,e):e)}remaining();let l=Atomics.load(c,0);if(l===4&&n&&r===!0)throw new $p(n,`OpenClaw state at ${n} is undergoing schema admission; retry when it finishes.`);if(l!==sm)throw new SqliteWorkerError(`SQLite admission facts exchange failed`,`unavailable`);let u=readSqliteDatabaseAdmissions(Qe(a)?.message);if(!u)throw new SqliteWorkerError(`SQLite admission facts reply is unavailable`,`unavailable`);return u}finally{Atomics.compareExchange(c,0,om,cm),l&&(l.databaseAdmissionWaitMs+=Date.now()-u),a.close(),s.close()}}function isSqliteDatabaseAdmissionMessage(e){return!(!(e.port instanceof Je)||!(e.decision instanceof SharedArrayBuffer)||e.decision.byteLength!==Int32Array.BYTES_PER_ELEMENT||e.location!==void 0&&typeof e.location!=`string`||e.observedLocation!==void 0&&!isSqliteDatabaseAdmissionLocation(e.observedLocation)||e.deadlineAtMs!==void 0&&(typeof e.deadlineAtMs!=`number`||!Number.isFinite(e.deadlineAtMs))||e.create!==void 0&&typeof e.create!=`boolean`&&e.create!==`admitted`)}function createSqliteDatabaseAdmissionReplies(){let e=createSqliteDatabaseAdmissionCursor();return{release(e){fm.delete(e)},receive(t,n,r,i){if(!isSqliteDatabaseAdmissionMessage(t)){i(new SqliteWorkerError(`SQLite admission facts request is invalid`,`unavailable`));return}let a=new Int32Array(t.decision),{deadlineAtMs:s,observedLocation:c}=t,assertWaiting=()=>{if(Atomics.load(a,0)!==om||s!==void 0&&Date.now()>=s)throw new SqliteWorkerError(`SQLite admission requester stopped waiting`,`unavailable`)},l=t.port,u=t.location;return{message:t,decision:a,deadlineAtMs:s,observedLocation:c,assertWaiting,publishFacts:t=>{assertWaiting();let r=u===void 0&&t.length===0?void 0:{location:u,admissions:t},i=captureSqliteDatabaseAdmissions(fm.get(n)?.cursor??e,r);l.postMessage(i,[]),recordWorkerMessage(`admission`,`to_worker`),Atomics.compareExchange(a,0,om,sm)},failFacts:(t,s)=>{if(Atomics.load(a,0)!==om)return;let c=fm.get(n);c?c.cursor=r?r(()=>c.reset()):c.reset():e=createSqliteDatabaseAdmissionCursor(),t instanceof $p&&t.databasePath===s?Atomics.compareExchange(a,0,om,4):Atomics.compareExchange(a,0,om,lm)===om&&i(t)},finishFacts:()=>{l.close(),Atomics.notify(a,0)}}}}}var om,sm,cm,lm,um,SqliteDatabaseAdmissionTimeoutError,dm,fm,pm=__esmMin((()=>{B(),R(),em(),rf(),tf(),rp(),rm(),am(),Zu(),om=0,sm=1,cm=2,lm=2,um=6e5,SqliteDatabaseAdmissionTimeoutError=class extends SqliteWorkerError{constructor(){super(`SQLite admission facts exchange timed out; the host did not reply`,`unavailable`)}},dm=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteDatabaseAdmissionUpstream`),()=>({})),fm=/* @__PURE__ */ new WeakMap}));function realpathExistingAncestorSync(e){let t=[],n=e;for(;;)try{return E.join(v.realpathSync.native(n),...t.toReversed())}catch{let e=E.dirname(n);if(e===n)return;t.push(E.basename(n)),n=e}}async function realpathExistingAncestor(e){let t=[],n=e;for(;;)try{return E.join(await O.realpath(n),...t.toReversed())}catch{let e=E.dirname(n);if(e===n)return;t.push(E.basename(n)),n=e}}function resolveIdentityPathViaExistingAncestorSync(e){let t=E.resolve(e);return realpathExistingAncestorSync(t)??t}async function resolveIdentityPathViaExistingAncestor(e){let t=E.resolve(e);return await realpathExistingAncestor(t)??t}function canAccessSync(e,t){try{return v.accessSync(e,t),!0}catch{return!1}}var mm=__esmMin((()=>{L()}));function isNativeCommitReceipt(e){return isRecord(e)&&e.version===1&&typeof e.sequence==`number`&&Number.isSafeInteger(e.sequence)&&e.sequence>=1&&Object.hasOwn(e,`facts`)}function isNativeSettlementReceipt(e){return isRecord(e)&&(e.kind===`completed`||e.kind===`unknown`)&&(e.committed===void 0||isNativeCommitReceipt(e.committed))}function resolveSqliteWorkerFinishSettlement(e,t,n){return e??(n===`not-entered`&&!t?{kind:`completed`}:void 0)}function createSqliteWorkerNativeReceiptOwner(e,t){let n=[],r=!1,i,a=0,s,invalidProtocol=e=>t(new SqliteWorkerError(`SQLite worker ${e} is invalid`,`outcome-unknown`)),installCommitted=s=>{if(s.sequence<=a)return;a=s.sequence;let c={facts:s.facts};i=c,r=!0;try{e(()=>{for(let e of n)e(c)})}catch(e){t(Object.assign(new SqliteWorkerError(`SQLite committed facts publication failed`,`outcome-unknown`),{cause:e}))}finally{r=!1}};return{get committed(){return i},get settlement(){return s},get observingCommit(){return r},observe(e){n.push(e)},receive(e){if(isRecord(e)&&e.kind===`native-commit`){let t=e.committed;return isNativeCommitReceipt(t)?(installCommitted(t),!0):(invalidProtocol(`commit receipt`),!0)}if(isRecord(e)&&e.kind===`native-settlement`){let t=e.settlement;return isNativeSettlementReceipt(t)?(t.committed!==void 0&&installCommitted(t.committed),s={kind:t.kind,...i?{committed:i}:{}},!0):(invalidProtocol(`native settlement`),!0)}return!1},finish(e){s=resolveSqliteWorkerFinishSettlement(s,i,e),r?queueMicrotask(()=>{n.length=0}):n.length=0}}}var hm=__esmMin((()=>{B(),R(),sp(),am(),resolveGlobalSingleton(Symbol.for(`openclaw.sqliteWorkerNativeCommitReceipts`),()=>/* @__PURE__ */ new WeakMap),resolveGlobalSingleton(Symbol.for(`openclaw.sqliteWorkerOperationAdmission`),()=>new D)})),gm=__esmMin((()=>{am()})),_m=__esmMin((()=>{em(),rm(),am(),pm(),Yd(),hm(),gm()})),vm=__esmMin((()=>{Zp(),am(),pm(),hm(),_m()}));function createSqliteDatabaseAdmissionRelay(e){return createOperationAdmission(()=>{throw Error(`Worker format facts do not grant database authority`)},void 0,e)}function createOperationAdmission(e,t,n,r){let{port1:i,port2:a}=runInDetachedAsyncContext(()=>new M),s={admit:e,prepare:r,assertRelayCurrent:n,inOwnerContext:D.snapshot()},c=/* @__PURE__ */ new Map,l,u=createSqliteDatabaseAdmissionReplies(),d=[],f=!1,p=!1,m,h,g,_,v=new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)),recordFailure=(e,t)=>{(!g||g.source===`domain`&&t!==`domain`)&&(g={error:e,source:t})},refuse=(e,t,n)=>{Atomics.compareExchange(e,0,Y,bm)===Y?(recordFailure(t,n),Atomics.notify(e,0)):Atomics.load(e,0)===ym&&d.push(t)},y=createSqliteWorkerNativeReceiptOwner(e=>s?.inOwnerContext(e),e=>recordFailure(e,`protocol`)),receive=e=>{let t=s,n=isRecord(e)?e:void 0;if(m=recordWorkerAuthorityMessage(n,b.requestClass,m),p=!0,n?.kind===`sqlite-database-admissions`){let e=u.receive(n,b,t?.inOwnerContext,e=>recordFailure(e,`protocol`));if(!e)return;let{message:r,decision:i,deadlineAtMs:a,observedLocation:l,assertWaiting:p,publishFacts:m,failFacts:h,finishFacts:g}=e,v,y=!1;try{if(p(),f||!t)throw new SqliteWorkerError(`SQLite worker admission is closed`,`closed`);let e=r.create===`admitted`?t.assertRelayCurrent:void 0;if(r.create===`admitted`&&!e)throw new SqliteWorkerError(`SQLite creation relay is not admitted`,`closed`);let n=readSqliteDatabaseAdmissions(r.admissions);if(!n)throw new SqliteWorkerError(`SQLite admission facts request is invalid`,`unavailable`);installSqliteDatabaseAdmissions(n);let u=_,b=u?.databaseIdentity,x=b&&(r.location===b.databasePath||r.location===u.databasePath)?b:void 0,S=getSqliteDatabaseAdmissionUpstream(),C=!r.create&&(!r.location||vp(r.location,x,l));if(!S&&C){m(n);return}if(!S&&r.location&&(!r.create||u||e)){let a=r.location,b=r.create,assertCurrent=()=>{if(p(),f||s!==t||_!==u)throw new SqliteWorkerError(`SQLite worker admission is closed`,`closed`);t.inOwnerContext(()=>{u?.assertRequest?.(),e?.()})};c.set(i,void 0),y=!0,t.inOwnerContext(async()=>{try{await gp({location:a,expectedIdentity:x,observedLocation:l,assertCurrent,...b?{create:{async authorize(e){if(assertCurrent(),b===`admitted`)return;let n=u?.assertCreate?.bind(u),r=u?.prepareCreate?.bind(u);if(!u||!n)throw new SqliteWorkerError(`SQLite worker file creation requires host authority`,`closed`);u.coldOpenPath&&await resolveIdentityPathViaExistingAncestor(u.coldOpenPath)===e&&(v=u.coldOpenPath),assertCurrent(),t.inOwnerContext(()=>u.assertAccess()),r?await t.inOwnerContext(r,e):t.inOwnerContext(n,e),assertCurrent(),t.inOwnerContext(()=>u.assertAccess()),v=void 0},retain(e){c.set(i,e),e.catch(e=>{d.includes(e)||d.push(e)})}}}:{}}),assertCurrent(),m(n)}catch(e){h(e,v)}finally{c.delete(i),g()}});return}let w=r.location,ee=!1;if(r.location&&r.create&&!yp(r.location)){w=resolveIdentityPathViaExistingAncestorSync(r.location);let e=w,n=_,i=n?.assertCreate?.bind(n);r.create===`admitted`?ee=!0:n&&i&&(n.coldOpenPath&&resolveIdentityPathViaExistingAncestorSync(n.coldOpenPath)===e&&(v=n.coldOpenPath),t.inOwnerContext(()=>{n.assertRequest?.(),n.assertAccess(),i(e)}),v=void 0,ee=!0)}if(ee&&e&&t.inOwnerContext(e),f)throw new SqliteWorkerError(`SQLite worker admission is closed`,`closed`);if(S){if(S.closed)throw new SqliteWorkerError(`SQLite admission upstream is closed`,`closed`);installSqliteDatabaseAdmissions(withSqliteDatabaseAdmissionWait({deadlineAtMs:a,assertActive:p},()=>exchangeDatabaseAdmissions(S.port,n,w,ee?`admitted`:void 0,l)))}else if(w)try{p(),ee&&yp(w,{create:!0});let e=_?.databaseIdentity;_p(w,e&&(w===e.databasePath||w===_?.databasePath)?e:void 0,l)}catch(e){if(!isRecord(e)||e.code!==`ENOENT`)throw e}m(n)}catch(e){h(e,v)}finally{y||g()}return}if(y.receive(e))return;let r=readSqliteWorkerAdmissionDecision(e);if(!r){recordFailure(new SqliteWorkerError(`SQLite worker admission request is invalid`,`unavailable`),`protocol`);return}let{decision:i,expired:a,request:l}=r;if(a())return;c.set(i,void 0);try{h&&t?.inOwnerContext(h,l)}catch(e){refuse(i,e,`domain`);return}if(f||!t){refuse(i,new SqliteWorkerError(`SQLite worker admission is closed`,`closed`),`authority`);return}let grant=e=>{if(f||a()||Atomics.load(i,0)!==Y)return!1;try{t.inOwnerContext(()=>_?.assertAccess())}catch(e){return refuse(i,e,`authority`),!1}if(f||a()||Atomics.load(i,0)!==Y||(e?.(),a()))return!1;let n=Atomics.compareExchange(i,0,Y,ym)===Y;return n&&Atomics.notify(i,0),n},g=!1,finishDecision=()=>{c.delete(i),Atomics.load(i,0)===Y&&refuse(i,new SqliteWorkerError(`SQLite worker admission was not granted`,`closed`),`domain`)},v=`authority`;try{if(t.inOwnerContext(()=>{_?.assertRequest?.()}),l.stage===`prepare`&&isRecord(l.facts)&&l.facts.kind===`schema-maintenance`){let e=_;if(!e||typeof l.facts.databasePath!=`string`||resolveIdentityPathViaExistingAncestorSync(l.facts.databasePath)!==e.databasePath)throw new SqliteWorkerError(`SQLite schema maintenance target differs from its admitted database`,`closed`);t.inOwnerContext(()=>{e.lease??=e.acquireSchema(),e.assertAccess(),e.lease.assertCurrent(),grant()})}else{v=`domain`;let e=t.prepare;if(e){g=!0,(async()=>{try{await t.inOwnerContext(e,l),!f&&!a()&&Atomics.load(i,0)===Y&&t.inOwnerContext(t.admit,l,grant)}catch(e){refuse(i,e,`domain`)}finally{finishDecision()}})();return}t.inOwnerContext(t.admit,l,grant)}}catch(e){e instanceof $p&&_?.coldOpenPath===e.databasePath&&!_.lease&&l.stage===`prepare`&&isRecord(l.facts)&&l.facts.kind===`schema-maintenance`&&typeof l.facts.databasePath==`string`&&resolveIdentityPathViaExistingAncestorSync(l.facts.databasePath)===_.databasePath?Atomics.compareExchange(i,0,Y,4)===Y&&Atomics.notify(i,0):refuse(i,e,v)}finally{g||finishDecision()}};i.on(`message`,e=>s?s.inOwnerContext(receive,e):receive(e)).unref();let drain=e=>{for(let t=e;t;t=Qe(i))receive(t.message)},service=()=>{if(y.observingCommit)return;let e=Qe(i);if(e)return s?s.inOwnerContext(drain,e):drain(e)},b={port:a,attachment:t===void 0?void 0:{value:t},observeRequests(e){if(f||h)throw new SqliteWorkerError(`SQLite request observation is already bound or closed`,`closed`);h=e},bindDatabaseAuthority(e){if(f||_)throw new SqliteWorkerError(`SQLite database authority is already bound or closed`,`closed`);_={...e}},get failure(){return g?.error},get failureSource(){return g?.source},get cleanupFailures(){return d},get committed(){return service(),y.committed},get settlement(){return y.settlement},waitForSettlement(e){for(;;){if(service(),g!==void 0)throw toErrorObject(g.error,`SQLite worker admission failed`);if(y.settlement?.kind===`completed`)return y.settlement;let t=e-performance.now();if(y.settlement?.kind===`unknown`||f||t<=0)throw new SqliteWorkerError(`SQLite worker native settlement is unknown`,`outcome-unknown`);Atomics.wait(v,0,0,Math.min(5,t))}},service,abortConstruction(){if(p)throw new SqliteWorkerError(`SQLite admission construction has already received work`,`closed`);if(b.finish()!==void 0)throw new SqliteWorkerError(`SQLite unstarted admission cleanup did not finish synchronously`,`closed`)},finish(e){if(l)return l;f=!0,service();let t=[...c.values()].filter(e=>e!==void 0);for(let e of c.keys())Atomics.load(e,0)===Y&&refuse(e,new SqliteWorkerError(`SQLite worker admission is closed`,`closed`),`authority`);i.close(),a.close();let release=()=>{if(y.finish(e),h=void 0,_?.lease)try{_.lease.release(),_.lease=void 0}catch(e){d.push(e)}_?.lease||(_=void 0),s=void 0,u.release(b)};if(t.length===0)release();else return l=Promise.allSettled(t).then(release).finally(()=>{l=void 0}),l}};return xm.set(b,e=>{if(f||p)throw new SqliteWorkerError(`SQLite commit observation is closed or started`,`closed`);y.observe(e)}),b}var Y,ym,bm,xm,Sm=__esmMin((()=>{F(),B(),Nt(),R(),em(),mm(),Zp(),am(),pm(),hm(),Zu(),_m(),vm(),Y=0,ym=1,bm=2,xm=/* @__PURE__ */ new WeakMap,resolveGlobalSingleton(Symbol.for(`openclaw.sqliteWorkerExecutionAuthorities`),()=>/* @__PURE__ */ new WeakMap)}));function getSpawnBroker(){let e=Cm.getStore();return wm.startupDisabled||e===null?void 0:e??wm.host}var Cm,wm,Tm=__esmMin((()=>{gr(),Cm=new AsyncContext(Symbol(`spawnBroker`)),wm={startupDisabled:!1}}));function executableIdentity(e){try{return formatExecutableIdentity(ne(e))}catch{return}}function formatExecutableIdentity({dev:e,ino:t,size:n,mtimeMs:r,mode:i}){return`${e}:${t}:${n}:${r}:${i}`}function publishRuntimeViability(e,t){return(T(t,`ENOENT`)||T(t,`ENOTDIR`))&&recordUnavailableRuntime(e,t),{execPath:e,available:!(X.execPath===e&&X.failure)}}async function prepareChildRuntimeViability(e){let t=e?.execPath??process.execPath,n=!(X.execPath===t&&X.failure);if(n)try{let e=await probeChildRuntimeExecutable(t);n=!classifyRuntimeProbe(t,e,await O.stat(t).then(formatExecutableIdentity,()=>void 0),e.error)}catch(e){n=publishRuntimeViability(t,await O.stat(t).then(()=>e,e=>e)).available}return{publish:()=>({execPath:t,available:n&&publishRuntimeViability(t).available})}}function recoverUnavailableRuntime(){if(X.execPath!==process.execPath||!X.failure||!X.recover||X.recoveryStarted)return;X.recoveryStarted=!0;let e=X.recover;runInDetachedAsyncContext(()=>Promise.resolve().then(e).catch(()=>({status:`report-only`,reason:`Automatic runtime recovery is report-only: service or restart preparation failed. Inspect the service runtime and restart through its owner.`})).then(e=>{createSubsystemLogger(`gateway/runtime`).warn(`${e.status}: ${e.reason}`)}))}function runtimeProbeOptions(e={}){return{encoding:`utf8`,cwd:e.cwd??E.parse(process.execPath).root,env:e.env??{...process.env,NODE_OPTIONS:void 0},timeout:1e3,maxBuffer:8192}}async function probeChildRuntimeExecutable(e,t={}){let n=getSpawnBroker();if(n){let r=n.spawnExeca([e,`--version`],{...runtimeProbeOptions(t),extendEnv:!1,stripFinalNewline:!1,stdin:`ignore`});r.child.once(`spawn`,()=>{r.child.stdout?.resume(),r.child.stderr?.resume()});let i=restoreExecaResult(await r.result);return await r.child.waitForClose(),{stdout:typeof i.stdout==`string`?i.stdout:``,stderr:typeof i.stderr==`string`?i.stderr:``,error:i instanceof Error?i:void 0,status:i.exitCode??null,signal:i.signal??null}}return new Promise(n=>{m(e,[`--version`],runtimeProbeOptions(t),(e,t,r)=>n({stdout:t,stderr:r,error:e??void 0,status:e?typeof e.code==`number`?e.code:null:0,signal:e?.signal??null}))})}function formatMissingChildRuntimeWarning(e){return e.available?void 0:`The Node.js runtime this Gateway started with (${sanitizeTerminalText(e.execPath)}) can no longer start worker processes, likely because it was upgraded or removed. Restart the Gateway.`}function assertChildRuntimeAvailable(){if(X.execPath===process.execPath&&X.failure)throw X.failure}function recordUnavailableRuntime(e,t,n){if(X.execPath===e&&X.failure)return X.failure;X.execPath=e;let r=formatMissingChildRuntimeWarning({execPath:e,available:!1}),i=n?.trim();return X.failure=Object.assign(Error(i?`${r}\n${i}`:r,{cause:t}),{code:`NODE_RUNTIME_UNAVAILABLE`}),createSubsystemLogger(`gateway/runtime`).error(X.failure.message),recoverUnavailableRuntime(),X.failure}function needsRuntimeProbe(e){return!!(e.error||e.signal===`SIGABRT`||Dm.test(e.stderr??``))}function classifyRuntimeProbe(e,t,n,r){if(X.execPath===e&&X.failure)return X.failure;let i=e!==X.initialPath||n!==X.initialIdentity;return Em.test(t.stderr)||Dm.test(t.stderr)||T(t.error,`ENOENT`)||T(t.error,`ENOTDIR`)||i&&(t.signal===`SIGABRT`||T(t.error,`ENOEXEC`)||T(t.error,`EACCES`)||T(t.error,`EPERM`))?recordUnavailableRuntime(e,r,t.stderr):void 0}async function prepareChildRuntimeFailure(e){if(e.started)return;let t=e.execPath??process.execPath;if(X.execPath===t&&X.failure)return X.failure;if(Em.test(e.stderr??``)||e.error&&!(await prepareChildRuntimeViability({execPath:t})).publish().available)return recordUnavailableRuntime(t,e.error,e.stderr);if(!e.error&&needsRuntimeProbe(e))return classifyRuntimeProbe(t,await probeChildRuntimeExecutable(t),t===X.initialPath?await O.stat(t).then(formatExecutableIdentity,()=>void 0):void 0,e.error)}var X,Em,Dm,Om=__esmMin((()=>{ra(),Wg(),Tm(),Nt(),R(),L(),X=resolveGlobalSingleton(Symbol.for(`openclaw.childRuntimeViability`),()=>({initialPath:process.execPath,initialIdentity:executableIdentity(process.execPath)})),Em=/(?:dyld[^\n]*:\s*Library not loaded:|error while loading shared libraries:)/i,Dm=/(?:dyld[^\n]*:\s*Symbol not found:|symbol lookup error:|Error loading shared library|version [`'"][^`'"\r\n]+[`'"] not found)/i}));function getSpawnBrokerAdmission(){return km.getStore()??`command`}var km,Am=__esmMin((()=>{km=new D}));function isContinuationByte(e){return e!==void 0&&(e&192)==128}function truncateUtf8Suffix(e,t){if(t<=0)return``;if(e.length<=t&&ot.byteLength(e)<=t)return e;let n=ot.from(Number.isInteger(t)?e.slice(-t-1):e),r=n.byteLength-t;for(;r<n.byteLength&&isContinuationByte(n[r]);)r+=1;return n.subarray(r).toString(`utf8`)}var jm=__esmMin((()=>{}));function observeBrokerChildDiagnostics(e){let t=process.execPath,n=!1;e.once(`message`,()=>{n=!0});let r=``;return e.stderr?.setEncoding(`utf8`).on(`data`,e=>{r=truncateUtf8Suffix(r+e,2048)}),async()=>{let i=redactToolPayloadText(r).trim();return await prepareChildRuntimeFailure({execPath:t,stderr:r,signal:e.signalCode,started:n})??/* @__PURE__ */ Error(`exited with code=${e.exitCode??`null`} signal=${e.signalCode??`none`}${i?`\nstderr:\n${i}`:``}`)}}async function prepareBrokerFailureCause(e,t){try{return await e??t}catch(e){return AggregateError(t?[t,e]:[e],`Spawn broker diagnosis failed`,{cause:t})}}function createBrokerFailureError(e,t){return new SpawnBrokerError(e&&T(e,`NODE_RUNTIME_UNAVAILABLE`)?e.message:t?`Spawn broker exited; command outcome is unavailable`:`Spawn broker failed before readiness: ${e?.message??`channel lost`}`,{cause:e})}var Mm=__esmMin((()=>{Om(),L(),il(),jm(),z()})),BrokerChild,Nm=__esmMin((()=>{F(),I(),z(),BrokerChild=class extends Fe{constructor(e,t,n,r=!1){super(),this.requestId=e,this.transmit=n,this.fileOutputPending=r,this.callbackContext=new _e(`OpenClawSpawnBrokerChild`),this.stdin=null,this.stdout=null,this.stderr=null,this.connected=!1,this.killed=!1,this.exitCode=null,this.signalCode=null,this.stdio=[null,null,null,null,null],this.opened=createDeferredCore(),this.completion=createDeferredCore(),this.pipes=/* @__PURE__ */ new Set,this.sends=/* @__PURE__ */ new Map,this.sendSequence=0,this.spawnReceived=!1,this.eventsReleased=!1,this.pendingEventOverflow=!1,this.pendingEvents=[],this.exited=!1,this.closed=!1,this.processNotStarted=!1,this.spawnfile=t[0],this.spawnargs=[...t],this.opened.promise.catch(()=>{}),this.on(`error`,()=>{})}markNotStarted(){this.processNotStarted=!0}get notStarted(){return this.processNotStarted}ready(){return this.opened.promise}emit(e,...t){return this.callbackContext.runInAsyncScope(()=>super.emit(e,...t))}waitForClose(){return this.completion.promise}settleFileOutput(){this.fileOutputPending=!1,this.finishClose()}attachPipe(e,t){t.emit=this.callbackContext.bind(t.emit.bind(t)),this.stdio[e]=t,e===0&&(this.stdin=t),e===1&&(this.stdout=t),e===2&&(this.stderr=t),this.pipes.add(t);let n=!1,acknowledge=t=>{n||(n=!0,this.transmit({type:`output-drained`,id:this.requestId,fd:e,error:t?serializeBrokerError(t):void 0}).catch(()=>{}))};t.once(e===0?`finish`:`end`,()=>acknowledge()),t.on(`error`,acknowledge),t.once(`close`,()=>{acknowledge(),this.pipes.delete(t),this.finishClose()})}receive(e){if(e.type===`spawned`){if(this.spawnReceived||this.closed)return;for(this.spawnReceived=!0,this.pid=e.pid,this.spawnfile=e.spawnfile,this.spawnargs=e.spawnargs,this.connected=e.connected,this.stdio.splice(e.stdioLength);this.stdio.length<e.stdioLength;)this.stdio.push(null);this.connected&&(this.channel=Object.assign(new Fe,{ref(){},unref(){}})),this.opened.resolve(),setImmediate(()=>{this.closed||(this.emit(`spawn`),setImmediate(()=>{for(let[e,n]of this.stdio.entries())e>0&&n instanceof t&&!n.destroyed&&releasePipe(n);this.eventsReleased=!0;for(let e of this.pendingEvents.splice(0))e()}))})}else!this.eventsReleased&&(this.spawnReceived||e.type!==`error`)?this.deferEvent(()=>this.emitMessage(e)):this.emitMessage(e)}deferEvent(e){this.pendingEventOverflow||(this.pendingEvents.length>=64?(this.pendingEventOverflow=!0,this.pendingEvents.splice(0),this.pendingEvents.push(()=>{this.kill(`SIGKILL`),this.failNow(new SpawnBrokerError(`Spawn broker startup event capacity exceeded`))})):this.pendingEvents.push(e))}emitMessage(e){switch(e.type){case`error`:{let t=Object.assign(Error(e.error.message),e.error);this.opened.reject(t),this.emit(`error`,t),this.pid||(this.exited=!0,this.finishClose());break}case`exit`:this.exited=!0,this.exitCode=e.code,this.signalCode=e.signal,this.stdin?.destroy(),this.emit(`exit`,e.code,e.signal),process.nextTick(()=>{for(let e of this.pipes)e.readable&&e.resume()}),this.finishClose();break;case`ipc-sent`:this.finishSend(e.sequence,e.error?Object.assign(Error(e.error.message),e.error):null);break;case`disconnect`:this.failSends(/* @__PURE__ */ Error(`Child process IPC channel is closed`)),this.connected=!1,this.channel=void 0,this.emit(`disconnect`),this.finishClose();break;case`ipc`:this.emit(`message`,e.message);break;case`closed`:this.finishClose()}}fail(e){this.spawnReceived&&!this.eventsReleased?this.deferEvent(()=>this.failNow(e)):this.failNow(e)}failNow(e){if(this.closed)return;this.opened.reject(e);let t=this.connected;this.connected=!1,this.channel=void 0,this.failSends(e),t&&this.emit(`disconnect`),this.exited||this.emit(`error`,e);for(let t of this.pipes)t.destroy(e);this.exited=!0,this.finishClose()}finishClose(){!this.exited||this.channel||this.pipes.size>0||this.closed||this.fileOutputPending||(this.closed=!0,this.completion.resolve(),this.emit(`close`,this.exitCode,this.signalCode))}kill(e=`SIGTERM`){return!this.exited&&(this.killed=!0,this.transmit({type:`kill`,id:this.requestId,signal:e}).catch(e=>this.fail(toErrorObject(e,`Spawn broker signal delivery failed`))),!0)}send(e,t,n,r,i){let a=typeof t==`function`?t:typeof n==`function`?n:r;if(!this.connected||this.sends.size>=1024){let e=/* @__PURE__ */ Error(this.connected?`Child process IPC capacity exceeded`:`Child process IPC channel is closed`);return queueMicrotask(()=>a?a(e):this.emit(`error`,e)),!1}let s=++this.sendSequence;this.sends.set(s,_e.bind(e=>{a?a(e):e&&this.emit(`error`,e)}));let c=typeof t==`function`?void 0:t;return this.transmit({type:`ipc`,id:this.requestId,sequence:s,message:e},c,i).catch(e=>this.finishSend(s,toErrorObject(e,`Spawn broker IPC delivery failed`))),!0}finishSend(e,t){let n=this.sends.get(e);this.sends.delete(e),n?.(t)}failSends(e){for(let t of this.sends.keys())this.finishSend(t,e)}disconnect(){this.connected&&(this.connected=!1,this.transmit({type:`disconnect`,id:this.requestId}).catch(e=>this.fail(toErrorObject(e,`Spawn broker disconnect failed`))))}ref(){}unref(){}[Symbol.dispose](){this.kill(`SIGTERM`)}}}));function createBrokerCommandRequest(e,t,n){let r=e.type!==`spawn-execa`&&e.outputFile?createDeferredCore():void 0,i=e.type===`spawn-execa`?createDeferredCore():void 0;return r?.promise.catch(()=>{}),i?.promise.catch(()=>{}),{child:new BrokerChild(e.id,e.argv,n,!!r),initiateSpawn:t,result:i,output:r,childClosed:!1,resultSettled:!i&&!r,detached:e.options.detached===!0||e.type===`spawn-execa`&&e.options.killDescendants===!0}}function createBrokerCommands(e){let native=(t,n,r,i,a,s)=>{let c={type:i?`prepare-spawn`:`spawn`,id:e.nextId(),argv:[t,...n],options:r,execCgroup:a};return s&&(c.outputFile=s),e.admit(c,i)};return{spawn:(e,t,n,r,i)=>{let a=brokerSpawnOptions(n);if(!a)throw Error(`Unsupported spawn broker stdio or process options`);return native(e,t,a,r,i).child},spawnToFile:(e,t,n,r,i,a)=>{let s=native(e,t,n,i,a,r);return{child:s.child,output:s.output.promise}},spawnExeca:(t,n,r)=>{let i=e.nextId(),a=e.admit({type:`spawn-execa`,id:i,argv:t,options:n,execCgroup:r});return{child:a.child,result:a.result.promise,cancel:()=>{e.cancel(i).catch(e=>a.child.fail(toErrorObject(e,`Spawn broker cancellation delivery failed`)))}}}}}function receiveBrokerCommandResponse(e,n,r,i){if(n.type===`pipe`){try{if(n.closed&&n.fd===0){let r=new t;e.child.attachPipe(n.fd,r),r.destroy()}else if(r instanceof t)n.fd===0?restoreStdinPipe(r):holdPipe(r),e.child.attachPipe(n.fd,r);else throw new SpawnBrokerError(`Spawn broker pipe transfer failed`)}catch(e){throw r instanceof t&&r.destroy(),e}return i({type:`pipe-received`,id:n.id,fd:n.fd})}if(n.type===`pipe-prefix`){let r=e.child.stdio[n.fd];r instanceof t&&n.bytes.length>0&&r.unshift(n.bytes)}else n.type===`file-output`?(e.nativeClosed=!0,`error`in n?e.output?.reject(Object.assign(Error(n.error.message),n.error)):e.output?.resolve(n.bytes),e.resultSettled=!0,e.child.settleFileOutput()):n.type===`execa-result`?(e.pid===void 0&&n.result.failed&&e.child.markNotStarted(),e.result?.resolve(n.result),e.resultSettled=!0):(n.type===`closed`?e.nativeClosed=!0:n.type===`error`&&n.notStarted&&e.child.markNotStarted(),n.type===`error`&&n.resultUnavailable&&e.output&&(e.output.reject(Object.assign(Error(n.error.message),n.error)),e.resultSettled=!0,e.child.settleFileOutput()),n.type===`error`&&n.resultUnavailable&&e.result&&(e.result.reject(Object.assign(Error(n.error.message),n.error)),e.resultSettled=!0),e.child.receive(n))}var Pm=__esmMin((()=>{F(),I(),Nm(),gn(),z()})),BrokerFileReads,Fm=__esmMin((()=>{I(),z(),BrokerFileReads=class{constructor(e){this.host=e,this.pending=/* @__PURE__ */ new Map,this.sequence=0}get size(){return this.pending.size}async read(e,t){return(await this.request({filePath:e},t)).buffer}async readPage(e,t,n){return this.request({filePath:e,page:t},n)}async request(e,t){if(t?.throwIfAborted(),await this.host.ready(),t?.throwIfAborted(),!this.host.canAdmit())throw new SpawnBrokerError(`Spawn broker cannot admit a raw file read`);let n=++this.sequence,r=createDeferredCore();this.pending.set(n,{chunks:[],result:r});let abort=()=>{r.reject(t?.reason),this.host.send({type:`cancel-read-file`,id:n}).catch(()=>{})};t?.addEventListener(`abort`,abort,{once:!0}),this.host.send({type:`read-file`,id:n,...e}).catch(r.reject);try{return await r.promise}finally{t?.removeEventListener(`abort`,abort),this.pending.delete(n)}}receive(e){if(e.type!==`file-read-chunk`&&e.type!==`file-read-result`)return!1;let t=this.pending.get(e.id);return t&&(e.type===`file-read-chunk`?t.chunks.push(e.bytes):e.error?t.result.reject(Object.assign(e.error,{code:e.code})):t.result.resolve(e.page??{buffer:Buffer.concat(t.chunks)})),!0}fail(e){for(let t of this.pending.values())t.result.reject(e);this.pending.clear()}}}));function fitsBrokerSocketPath(e,t){return process.platform===`win32`||Buffer.byteLength(E.join(e,t))<=103}var Im=__esmMin((()=>{}));function createNativeResourceAuthority(){let e=`oc-br-${he(16).toString(`hex`)}`,t=fe(Ee(),e),n=process.platform===`win32`?void 0:fitsBrokerSocketPath(t,`resource.sock`)?t:fe(`/tmp`,e),r=he(32).toString(`hex`);return{directory:n,secret:r,endpoint:n?fe(n,`resource.sock`):`\\\\.\\pipe\\oc-br-${r}`}}var Lm=__esmMin((()=>{Im()})),BrokerResourceClaims,Rm=__esmMin((()=>{F(),dt(),vn(),I(),mn(),z(),xn(),BrokerResourceClaims=class{constructor(e){this.host=e,this.claims=/* @__PURE__ */ new Map,this.bufferedBytes=0,this.bufferedMessages=0,this.closeSequence=0,this.sealed=!1}get size(){return this.claims.size}get hasOpenClaims(){return[...this.claims.values()].some(e=>!e.closed)}get needsReference(){return[...this.claims.values()].some(e=>!e.closed&&(!e.created||!!(e.failure||e.pending)||e.ownerMessages.size>0))}get admissionClosed(){return this.failure!==void 0||this.sealed}capture(e,t){if(this.admissionClosed)throw this.failure??new SpawnBrokerError(`Native resource source is sealed`);let n=A(e);if(n.length>268435456)throw new SpawnBrokerError(`Native resource input exceeds IPC capacity`);let r=Be(n),i={attachment:r,callbacks:t,inContext:D.snapshot(),attached:createDeferredCore(),ready:!1,created:!1,closed:!1,lastSequence:0,ownerSequence:0,ownerMessages:/* @__PURE__ */ new Map};i.attached.promise.catch(()=>{}),this.claims.set(r.id,i),this.host.refreshReference();let active=()=>{if(this.claims.get(r.id)!==i)throw new SpawnBrokerError(`Native resource claim is released`);if(i.failure)throw i.failure};return{attachment:r,receive:e=>{if(e.id!==r.id)throw new SpawnBrokerError(`Native resource response belongs to another claim`);this.receive(e)},ownerMessage:e=>{if(active(),i.closed)throw new SpawnBrokerError(`Native resource is closed`);let t=i.ownerSequence+1,n=A({type:`resource-owner`,id:r.id,sequence:t,value:e});if(this.bufferedBytes+n.length>268435456||this.bufferedMessages>=1024)throw new SpawnBrokerError(`Native resource owner delivery capacity exceeded`);i.ownerSequence=t;let a=Be(n);return i.ownerMessages.set(t,{request:a,size:n.length}),this.bufferedBytes+=n.length,this.bufferedMessages++,this.host.refreshReference(),(async()=>{await i.attached.promise,active();let e=i.ownerMessages.get(t);!i.closed&&e&&await this.host.transmit(e.request)})().catch(e=>{let t=toErrorObject(e,`Native resource owner delivery failed`);this.claims.get(r.id)===i&&!i.closed&&!i.failure&&i.inContext(()=>i.callbacks.failed(t))}),{sequence:t}},close:()=>{if(i.closed)return Promise.resolve();try{active()}catch(e){return Promise.reject(toErrorObject(e,`Native resource is unavailable`))}if(i.pending)return i.pending.completion.promise;let e=--this.closeSequence,t=createDeferredCore();return t.promise.catch(()=>{}),i.pending={requestId:e,completion:t},this.host.refreshReference(),(async()=>{await i.attached.promise,active(),!i.closed&&i.pending?.requestId===e&&await this.host.transmit({type:`resource-close`,id:r.id,requestId:e})})().catch(n=>{i.pending?.requestId===e&&(i.pending=void 0,this.host.refreshReference(),t.reject(toErrorObject(n,`Native resource close delivery failed`)))}),t.promise},release:()=>{if(this.claims.get(r.id)===i){if(!i.closed)throw new SpawnBrokerError(`Native resource must close before release`);this.host.transmit({type:`resource-release`,id:r.id}).catch(()=>{}),this.remove(i)}},abandonUnattached:()=>{if(this.claims.get(r.id)!==i)return;if(i.ready||i.created)throw new SpawnBrokerError(`Attached native resource cannot be abandoned`);let e=new SpawnBrokerError(`Native resource was never dispatched`);i.attached.reject(e),i.pending?.completion.reject(e),this.remove(i)}}}receive(e){let t=this.claims.get(e.id);if(!(!t||t.failure&&e.type!==`resource-closed`)){if(e.type===`resource-ready`){if(this.host.markReady(e.pid,e.generation),t.ready)return;t.ready=!0,t.attached.resolve()}else if(e.type===`resource-created`){if(t.created)return;t.created=!0,this.host.refreshReference()}else if(e.type===`resource-owner-received`||e.type===`resource-owner-rejected`){let n=t.ownerMessages.get(e.sequence);if(n&&(t.ownerMessages.delete(e.sequence),this.bufferedBytes-=n.size,this.bufferedMessages--,this.host.refreshReference(),e.type===`resource-owner-rejected`)){let n=toErrorObject(decodeNativeWorkerFailure(e.error),`Native resource owner callback failed`);t.inContext(()=>t.callbacks.failed(n))}return}else if(e.type===`resource-owner`){if(e.sequence<=t.lastSequence)return;t.lastSequence=e.sequence,t.inContext(()=>t.callbacks.message(e));return}else if(e.type===`resource-closed`){if(t.closed)return;t.closed=!0,this.clearOwnerMessages(t),t.pending?.completion.resolve(),t.pending=void 0,this.host.refreshReference()}else if(e.type===`resource-close-error`){if(t.pending?.requestId===e.requestId){let n=t.pending;t.pending=void 0,this.host.refreshReference(),n.completion.reject(e.resourceError?new BrokerNativeResourceCloseError(e.error):toErrorObject(decodeNativeWorkerFailure(e.error),`Native resource cleanup failed`))}}else if(e.type===`resource-failed`){let n=toErrorObject(decodeNativeWorkerFailure(e.error),`Native resource failed`);t.inContext(()=>t.callbacks.failed(n));return}t.inContext(()=>t.callbacks.message(e))}}closeAdmission(){this.sealed=!0}seal(){return this.sealPromise||=(this.closeAdmission(),this.host.transmit({type:`resource-seal`}).then(()=>{for(let e of this.claims.values())e.attached.resolve()},e=>{throw materializeErrorStack(e),e})),this.sealPromise}closeBeforeStartup(){for(let e of this.claims.values())this.receive({type:`resource-closed`,id:e.attachment.id,requestId:0})}fail(e){materializeErrorStack(e),this.failure??=e;let t=collectSynchronousErrors([...this.claims.values()].filter(t=>this.rejectClaim(t,e)),t=>t.inContext(()=>t.callbacks.failed(e)));if(t.length)throw AggregateError(t,`Native resource failure callback failed`)}rejectClaim(e,t){return e.failure||e.closed?!1:(e.failure=t,this.host.refreshReference(),e.attached.reject(t),e.pending?.completion.reject(t),e.pending=void 0,!0)}clearOwnerMessages(e){for(let t of e.ownerMessages.values())this.bufferedBytes-=t.size,this.bufferedMessages--;e.ownerMessages.clear()}remove(e){this.clearOwnerMessages(e),this.claims.delete(e.attachment.id),this.host.refreshReference()}}})),zm,Bm,BrokerHost,createSpawnBrokerHost,Vm=__esmMin((()=>{F(),Om(),L(),Cl(),Fl(),Hl(),I(),Am(),Ht(),Mm(),cn(),Pm(),Fm(),mn(),z(),Lm(),Rm(),xn(),zm=[100,250,500,1e3,2e3],Bm=1024,BrokerHost=class{constructor(e={}){if(this.options=e,this.runInContext=D.snapshot(),this.readiness=createDeferredCore(),this.available=!1,this.hasBeenReady=!1,this.closing=!1,this.generation=0,this.consecutiveFailures=0,this.sequence=0,this.requests=/* @__PURE__ */ new Map,this.childAdmissions=/* @__PURE__ */ new Map,this.pendingSpawns=/* @__PURE__ */ new Set,this.fileReads=new BrokerFileReads({ready:()=>this.ready(),send:e=>this.transmit(e),canAdmit:()=>!this.resourceClaims&&!this.closing&&this.pendingSpawns.size+this.fileReads.size<256}),this.cleanups=/* @__PURE__ */ new Set,this.cleanupErrors=[],this.startupDeadline=0,this.onParentExit=()=>{this.process?.connected&&this.process.disconnect();for(let e of this.cleanups)e.force()},this.readFilePage=this.fileReads.readPage.bind(this.fileReads),this.commands=createBrokerCommands({nextId:()=>++this.sequence,admit:(e,t)=>this.admit(e,t),cancel:e=>this.transmit({type:`cancel`,id:e})}),this.spawn=this.commands.spawn,this.spawnExeca=this.commands.spawnExeca,this.spawnToFile=this.commands.spawnToFile,this.workerUrl=e.workerUrl??resolveRuntimeWorkerUrl(Pl.spawnBroker),this.entryPath=j(this.workerUrl),e.nativeResources){let{directory:e,...t}=createNativeResourceAuthority();this.resourceDirectory=e,this.resourceAuthority=t,this.resourceClaims=new BrokerResourceClaims({transmit:async e=>{this.available||await this.ready(),await this.transmit(e)},markReady:(e,t)=>{if(!this.markNativeReady)throw new SpawnBrokerError(`Native resource broker unavailable`);this.markNativeReady(e,t)},refreshReference:()=>this.refreshNativeReference()})}this.readiness.promise.catch(()=>{}),this.start(),this.unregisterExitCleanup=registerProcessExitCleanup(this.onParentExit)}get pid(){return this.process?.pid}get hasOpenNativeResourceClaims(){return this.resourceClaims?.hasOpenClaims??!1}get nativeResourceAdmissionClosed(){return(this.resourceClaims?.admissionClosed??!1)||this.process?.connected===!1}ready(){return this.closing?Promise.reject(new SpawnBrokerError(`Spawn broker is closing`)):this.readiness.promise}readFile(e,t){return this.fileReads.read(e,t)}captureNativeResource(e,t){if(!this.resourceClaims||!this.resourceAuthority||this.closing||this.resourceClaims.size>=256)throw new SpawnBrokerError(`Native resource broker is unavailable or at capacity`);return this.resourceClaims.capture({...e,...e.moduleUrl.startsWith(`file:`)&&runtimeNeedsTypeScriptLoader(j(e.moduleUrl))?{sourceLoaderUrl:import.meta.resolve(`tsx/esm/api`)}:{},...this.resourceAuthority,generation:this.generation-1,startupDeadline:this.available?void 0:this.startupDeadline,id:++this.sequence},t)}sealNativeResources(){return this.resourceClaims&&!this.available?Promise.reject(new SpawnBrokerError(`Native resource broker is not ready for cleanup`)):this.resourceClaims?.seal()??Promise.reject(new SpawnBrokerError(`Native resources are disabled`))}serviceNativeResources(){this.serviceStartup?.()}refreshNativeReference(){this.resourceClaims&&this.process&&(this.closing||this.resourceClaims.needsReference||this.requests.size>0?(this.process.ref(),process.ref(this.process.stderr),this.process.channel?.ref?.()):(this.process.unref(),process.unref(this.process.stderr),this.process.channel?.unref?.()))}admit(e,t){e.admission=getSpawnBrokerAdmission();let n=childCapacityError(this.childAdmissions.values(),e.admission),r=createBrokerCommandRequest(e,t,this.transmit.bind(this)),{child:i,result:a,output:s}=r,fail=e=>{r.resultSettled=!0,a?.reject(e),s?.reject(e),i.settleFileOutput(),i.fail(e)};return!this.available||this.closing||this.pendingSpawns.size+this.fileReads.size>=256||n?(i.markNotStarted(),queueMicrotask(()=>fail(new SpawnBrokerError(this.available&&!this.closing?n??`Spawn broker startup capacity exceeded`:`Spawn broker is unavailable`))),r):(this.childAdmissions.set(e.id,e.admission),this.requests.set(e.id,r),this.pendingSpawns.add(e.id),this.refreshNativeReference(),i.waitForClose().then(()=>{r.childClosed=!0,this.retire(e.id,r)}),this.transmit(e).catch(t=>{if(this.pendingSpawns.delete(e.id),t instanceof BrokerIpcAdmissionError)i.markNotStarted();else if(r.output){this.process?.connected&&this.process.disconnect();return}!r.nativeInitiated&&e.type===`prepare-spawn`&&i.markNotStarted(),fail(new SpawnBrokerError(`Spawn broker request delivery failed`,{cause:t}))}),r)}retire(e,t){if(t.childClosed&&t.resultSettled&&!t.nativeInitiated){if(t.child.notStarted||!t.recovering&&t.nativeClosed)this.childAdmissions.delete(e);else if(!t.recovering||t.pid===void 0)return;this.requests.delete(e),this.refreshNativeReference()}}retainCleanup(e,t){this.cleanups.add(e),e.settled.then(()=>{this.cleanups.delete(e),t!==void 0&&this.childAdmissions.delete(t)},t=>{this.cleanupErrors.push(toErrorObject(t,`Spawn broker cleanup failed`)),this.cleanups.delete(e)})}transmit(e,t,n){return!this.available||!this.sendMessage?Promise.reject(new SpawnBrokerError(`Spawn broker is unavailable`)):this.sendMessage(e,t,n)}start(){if(this.closing)return;try{assertChildRuntimeAvailable()}catch(e){this.readiness.reject(e);return}let e=this.generation++,n={type:`bootstrap`,...this.resourceAuthority?{nativeResource:{...this.resourceAuthority,generation:e}}:{}};if(A(n).byteLength>Bm)throw new SpawnBrokerError(`Spawn broker bootstrap exceeds its IPC bound`);let r=g(process.execPath,resolveRuntimeWorkerArgv(this.workerUrl),{stdio:[`inherit`,`ignore`,`pipe`,`ipc`],detached:!0,serialization:`advanced`});this.process=r;let i=observeBrokerChildDiagnostics(r),a=!1,s=waitForBrokerChildCompletion(r),c,prepareTerminalDiagnosis=()=>c??=p?i():s.then(i),l;this.brokerClosed=s.then(async()=>{await l,a&&r.pid&&(r.exitCode!==0||r.signalCode!==null)&&this.cleanupErrors.push(new SpawnBrokerError(`Spawn broker shutdown failed`,{cause:await prepareTerminalDiagnosis().catch(e=>toErrorObject(e,`Spawn broker exit diagnosis failed`))}))});let u=createBrokerReceiver(),d=createDeferredCore(),f=!1,p=!1;this.startupDeadline=spawnBrokerStartupNowMs()+yn;let checkStartup=()=>{!f&&!p&&spawnBrokerStartupNowMs()>=this.startupDeadline&&fail(/* @__PURE__ */ Error(`readiness deadline exceeded after 15000ms`))},m=this.resourceClaims?void 0:setTimeout(checkStartup,yn);this.serviceStartup=checkStartup;let fail=(e,t=!1)=>{if(f)return;a=this.closing,f=!0,clearTimeout(m),this.markNativeReady=void 0,u.clear(),this.available=!1,this.resourceClaims?.closeAdmission(),this.sendMessage=void 0,r.connected&&r.disconnect();let n=this.readiness;this.readiness=createDeferredCore(),this.readiness.promise.catch(()=>{});let i=this.requests;this.requests=/* @__PURE__ */ new Map,this.pendingSpawns.clear();let c=[];for(let[e,t]of i){if(t.recovering=!0,t.pid&&!t.nativeClosed){let n=t.pid;if(this.closing){let i;this.retainCleanup({force:()=>i?.force(),settled:d.promise.then(async()=>{(r.exitCode!==0||r.signalCode!==null)&&(i=terminateLostBrokerChild(n,t.detached),await i.settled)})},e)}else this.retainCleanup(terminateLostBrokerChild(n,t.detached),e)}else(t.child.notStarted||t.nativeClosed)&&this.childAdmissions.delete(e);t.output&&c.push(t)}if(this.refreshNativeReference(),r.pid&&process.platform!==`win32`){let e=r.pid,t;this.retainCleanup({force:()=>t?.force(),settled:d.promise.then(async()=>{t=terminateBrokerProcessGroup(e),await t.settled})})}l=prepareBrokerFailureCause(t?prepareTerminalDiagnosis():prepareChildRuntimeFailure({error:e,started:p}),e).then(e=>{let t=createBrokerFailureError(e,this.hasBeenReady);n.reject(t),this.fileReads.fail(t);for(let e of i.values())e.result?.reject(t),e.child.fail(t);if(i.clear(),c.length&&Promise.allSettled([s,...[...this.cleanups].map(e=>e.settled)]).then(()=>{for(let e of c)e.output?.reject(t),e.child.settleFileOutput();c.length=0}),this.resourceClaims||this.closing||!this.hasBeenReady||T(e,`NODE_RUNTIME_UNAVAILABLE`)){this.readiness.reject(t),this.resourceClaims?.fail(t);return}let r=zm[this.consecutiveFailures++];r===void 0?this.readiness.reject(t):this.restartTimer=setTimeout(()=>this.start(),r)})},markReady=(t,n)=>{if(f||t!==r.pid||n!==e)throw new SpawnBrokerError(`Native resource readiness does not match the captured broker`);p||(p=!0,clearTimeout(m),this.hasBeenReady=!0,this.consecutiveFailures=0,this.available=!0,this.readiness.resolve(),this.runInContext(()=>this.options.onReady?.(t,e>0)))};this.markNativeReady=markReady,r.once(`error`,fail),r.once(`exit`,()=>{f||(a=this.closing),d.resolve(),fail(void 0,!0)}),r.once(`disconnect`,()=>{p&&fail(/* @__PURE__ */ Error(`IPC channel disconnected`))}),r.on(`message`,(n,r)=>{if(f||this.closing){r instanceof t&&r.destroy();return}let i;try{i=u.receive(n)}catch(e){fail(toErrorObject(e,`Spawn broker receive failed`));return}if(i===void 0)return;let a=i;if(a.type===`startup-failed`){if(!p&&this.resourceClaims){let e=this.resourceClaims;this.brokerClosed?.then(()=>e.closeBeforeStartup()).catch(e=>{this.cleanupErrors.push(toErrorObject(e,`Spawn broker startup cleanup failed`))})}fail(Object.assign(Error(a.error.message),a.error));return}if(a.type===`ready`){try{markReady(a.pid,e)}catch(e){fail(toErrorObject(e,`Spawn broker readiness failed`))}return}if(a.type===`resource-ready`||a.type===`resource-created`||a.type===`resource-target`||a.type===`resource-owner`||a.type===`resource-owner-received`||a.type===`resource-owner-rejected`||a.type===`resource-closed`||a.type===`resource-close-error`||a.type===`resource-failed`){try{this.resourceClaims?.receive(a)}catch(e){fail(toErrorObject(e,`Spawn broker native resource receive failed`))}return}if(this.fileReads.receive(a))return;(a.type===`spawned`||a.type===`error`)&&this.pendingSpawns.delete(a.id);let s=this.requests.get(a.id);if(!s)r instanceof t&&r.destroy(),a.type===`pipe`?this.transmit({type:`pipe-received`,id:a.id,fd:a.fd}).catch(fail):a.type===`prepared`&&this.transmit({type:`launch`,id:a.id,allowed:!1}).catch(fail);else if((a.type===`owned`||a.type===`error`)&&(s.nativeInitiated?.resolve(),s.nativeInitiated=void 0),a.type===`prepared`){let e=s.initiateSpawn;s.initiateSpawn=void 0;let t=this.brokerClosed,n=e?s.nativeInitiated??=createDeferredCore():void 0,r=t&&n?Promise.race([n.promise,t]):Promise.reject(/* @__PURE__ */ Error(`Spawn broker retirement is unavailable`));r.catch(()=>{}),this.transmit({type:`launch`,id:a.id,allowed:!0},void 0,t=>{if(!e||!n||s.childClosed)throw new SpawnBrokerError(`Spawn broker launch grant is unavailable`);return e(t,r)}).catch(()=>{this.transmit({type:`launch`,id:a.id,allowed:!1}).catch(fail)})}else if(a.type===`owned`)s.pid=a.pid,s.childClosed&&(s.recovering=!0,this.retainCleanup(terminateLostBrokerChild(a.pid,s.detached),a.id),this.retire(a.id,s));else{try{receiveBrokerCommandResponse(s,a,r,e=>this.transmit(e))?.catch(fail)}catch(e){fail(toErrorObject(e,`Spawn broker pipe setup failed`));return}this.retire(a.id,s)}});try{r.send(n,e=>{e&&fail(e)})}catch(e){fail(toErrorObject(e,`Spawn broker bootstrap delivery failed`))}f||(this.sendMessage=createBrokerSender((e,t,n)=>r.send(e,t,{keepOpen:!0},n))),this.refreshNativeReference()}async waitForCleanup(){if(await Promise.allSettled([...this.cleanups].map(e=>e.settled)),this.cleanupErrors.length)throw AggregateError(this.cleanupErrors,`Spawn broker cleanup did not complete`)}close(){return this.resourceClaims?.hasOpenClaims?Promise.reject(new SpawnBrokerError(`Native resource claims must close before broker shutdown`)):this.closePromise??=this.closeInternal()}async closeInternal(){this.closing=!0,this.refreshNativeReference(),this.readiness.reject(new SpawnBrokerError(`Spawn broker is closing`)),this.fileReads.fail(new SpawnBrokerError(`Spawn broker is closing`)),clearTimeout(this.restartTimer);try{let e=this.process;e&&e.exitCode===null&&e.signalCode===null&&(this.resourceClaims?this.transmit({type:`shutdown`}).catch(()=>{e.connected&&e.disconnect()}):e.connected&&e.disconnect()),await this.brokerClosed;try{await this.waitForCleanup()}finally{this.resourceDirectory&&this.hasBeenReady&&await Se(this.resourceDirectory,{recursive:!0,force:!0})}}finally{this.unregisterExitCleanup()}this.options.onClosed?.()}},createSpawnBrokerHost=e=>new BrokerHost(e)}));function attachBrokerNativeResource(e,t,r,i){let a=createDeferredCore();a.promise.catch(()=>{});let s,c,l,u=0,d=!1,f=!1,p=!1,m=!1,h,g=!1,_,recordFailure=e=>{if(m)return;let n=h===void 0;materializeErrorStack(e),h??=e,clearTimeout(l),clearTimeout(v),a.reject(e),_?.completion.reject(e),_=void 0,t.close(),n&&i(e)},lose=e=>{m||g||(g=!0,recordFailure(e),s?.close())},transmit=async(e,t=!1)=>{if(h&&(!t||g))throw h;if(!s||m)throw Error(`Native resource attachment is closed`);await s.send(e)},receive=n=>{if(!isRecord(n)||n.id!==e.id||typeof n.type!=`string`){lose(/* @__PURE__ */ Error(`Invalid native resource response identity`));return}let i=n;if(i.type===`resource-target`)t.postMessage(i.value,[]);else if(r(i),i.type===`resource-ready`)d=!0,clearTimeout(v);else if(i.type===`resource-created`)f=!0,c?.unref(),a.resolve();else if(i.type===`resource-closed`)m=!0,clearTimeout(v),_?.completion.resolve(),_=void 0,t.close(),s?.close();else if(i.type===`resource-close-error`){if(_?.id===i.requestId){let e=_;_=void 0,e.completion.reject(i.resourceError?new BrokerNativeResourceCloseError(i.error):toErrorObject(decodeNativeWorkerFailure(i.error),`Native resource close failed`))}}else i.type===`resource-failed`&&recordFailure(toErrorObject(decodeNativeWorkerFailure(i.error),`Native resource failed`))},start=()=>{if(h||m)return;let t;try{t=n(e.endpoint)}catch(e){queueMicrotask(()=>lose(toErrorObject(e,`Native resource attachment failed`)));return}c=t;let r=!1,i;t.once(`error`,e=>{i=e}),s=createBrokerResourceSocket(t,{message:receive,close(t){m||g||(!r&&!d&&e.startupDeadline!==void 0&&spawnBrokerStartupNowMs()<e.startupDeadline?l=setTimeout(start,10):lose(t??i??/* @__PURE__ */ Error(`Native resource attachment lost`)))}}),t.once(`connect`,()=>{r=!0,p=!0,transmit({type:`resource-attach`,attachment:e}).catch(e=>lose(toErrorObject(e,`Native resource attachment failed`)))})},v=e.startupDeadline===void 0?void 0:setTimeout(()=>{d||lose(/* @__PURE__ */ Error(`Spawn broker readiness deadline exceeded`))},Math.max(0,e.startupDeadline-spawnBrokerStartupNowMs()));start();let assertCleanupAvailable=()=>{if(g&&h)throw h},failDelivery=(e,t)=>{let n=toErrorObject(e,t);n!==h&&lose(n)};return a.promise.then(()=>{t.on(`message`,t=>{transmit({type:`resource-target`,id:e.id,value:t}).catch(e=>failDelivery(e,`Native resource input delivery failed`))}),t.unref()},()=>{}),{get dispatched(){return p},ownerMessage(t,n){a.promise.then(()=>transmit({type:`resource-owner`,id:e.id,sequence:n,value:t},!0)).catch(e=>failDelivery(e,`Native resource owner delivery failed`))},async close(){if(m)return;if(assertCleanupAvailable(),!f)try{await a.promise}catch(e){if(!d||g)throw e}if(m)return;assertCleanupAvailable(),c?.ref();let t=_??{id:++u,completion:createDeferredCore()};_||(_=t,t.completion.promise.catch(()=>{}),transmit({type:`resource-close`,id:e.id,requestId:t.id},!0).catch(e=>lose(toErrorObject(e,`Native resource close delivery failed`)))),await t.completion.promise},dispose(){clearTimeout(l),clearTimeout(v),s?.close()}}}var Hm=__esmMin((()=>{F(),B(),dt(),vn(),I(),xn(),Sn()}));function resolveRuntimeWorkerGenerationUrl(e,t){return isEmbeddedStandaloneModule(e.href)?e:t?.resolve(e)??e}function captureRuntimeWorkerSource(e){let t=Um.getStore()?.generation,n=resolveRuntimeWorkerGenerationUrl(e,t);return n.href===e.href?{moduleUrl:e}:{moduleUrl:n,runtimeGeneration:t}}var Um,Wm=__esmMin((()=>{Nl(),ga(),Fi(),R(),Um=resolveGlobalSingleton(Symbol.for(`openclaw.runtimeWorkerGeneration`),()=>new D)}));function nativePortIsOpen(e){if(process.versions.bun){let t=e.hasRef();e.unref(),e.ref();let n=e.hasRef();return t||e.unref(),n}try{structuredClone(Km,{transfer:[e]})}catch(e){if(e===Gm)return!0;if(e instanceof DOMException&&e.name===`DataCloneError`)return!1;throw e}throw Error(`Native port validation did not abort serialization`)}var Gm,Km,qm=__esmMin((()=>{Gm=/* @__PURE__ */ Error(`Native worker port validation reached the live sentinel`),Gm.stack=void 0,Km={get value(){throw Gm}}})),NativeWorkerTaskPort,Jm=__esmMin((()=>{F(),dt(),Qr(),Zu(),qm(),NativeWorkerTaskPort=class{constructor(e,t){this.port=e,this.callbacks=t,this.pending=[],this.readMessage=()=>Qe(this.port),this.started=!1,this.disposed=!1,this.portClosed=!1,this.receive=e=>{observeWorkerMessage(e,`from_worker`),this.pending.push({type:`message`,value:e}),this.drain()},this.receiveError=e=>{this.pending.push({type:`messageerror`,error:e}),this.drain()},this.closed=()=>{this.portClosed=!0,this.drain(),this.fail(/* @__PURE__ */ Error(`Native worker task channel closed`))},e.on(`message`,this.receive),e.on(`messageerror`,this.receiveError),e.on(`close`,this.closed),e.unref()}fail(e){this.disposed||this.failure||(materializeErrorStack(e),this.failure=e,this.callbacks.unavailable())}start(){this.started=!0}drain(){if(!this.disposed&&this.started)for(;;){let e=this.pending.shift();if(e)e.type===`message`?this.callbacks.message(e.value):this.callbacks.messageerror(e.error);else{if(this.portClosed||this.failure)return;let e;try{e=runWithMainThreadTask(`worker:message-decode`,this.readMessage)}catch(e){this.fail(toErrorObject(e,`Native worker task channel observation failed`));return}if(!e)return;observeWorkerMessage(e.message,`from_worker`),this.callbacks.message(e.message)}if(this.disposed)return}}service(){if(this.drain(),this.disposed||this.failure)return;if(this.portClosed){this.fail(/* @__PURE__ */ Error(`Native worker task channel closed`));return}let e;try{e=nativePortIsOpen(this.port)}catch(e){this.fail(toErrorObject(e,`Native worker task channel observation failed`));return}e||(this.portClosed=!0,this.fail(/* @__PURE__ */ Error(`Native worker task channel closed`)))}assertAvailable(){if(this.failure)throw this.failure;if(this.disposed||this.portClosed)throw Error(`Native worker task channel is closed`)}postMessage(e,t){this.assertAvailable();let n=workerMessagePayloadBytes(e);this.port.postMessage(e,t),observeWorkerMessage(e,`to_worker`,`other`,n??null)}close(){this.disposed||(this.disposed=!0,this.pending.length=0,this.port.off(`message`,this.receive),this.port.off(`messageerror`,this.receiveError),this.port.off(`close`,this.closed),this.port.close())}}}));function workerRequestKind(e){return Xm.get(ue(e.pathname).replace(/\.(?:ts|mjs)$/,`.js`))??`extension`}var Ym,Xm,Zm=__esmMin((()=>{Fl(),Ym={"catalog-page.worker.js":`catalog`,"code-mode.worker.js":`codeMode`,"disk-budget.worker.js":`diskBudget`,"document-extractor.worker.js":`document`,"manager-index.worker.js":`memoryIndex`,"manager-search.worker.js":`memorySearch`,"memory-index.worker.js":`memoryIndex`,"memory-search.worker.js":`memorySearch`,"run.worker.js":`teamReports`,"session-history.worker.js":`sessionHistory`},Xm=new Map([...Object.entries(Pl).map(([e,t])=>[ue(t.distWorkerPath),e]),...Object.entries(Ym)])})),NativeWorker,Qm=__esmMin((()=>{F(),Lu(),xn(),dt(),Qr(),Rd(),vn(),Jm(),Zm(),NativeWorker=class extends Fe{get sourcePath(){if(!this.evalSource)return this.filename instanceof URL?this.filename.protocol===`file:`?j(this.filename):void 0:this.filename}get taskChannelFailure(){return this.taskPort?.failure}constructor(e,t,n,r,i,a,s){super(),this.runtime=e,this.id=t,this.filename=n,this.evalSource=r,this.ownsNativeResource=i,this.resourceConnection=a,this.runInContext=D.snapshot(),this.threadId=0,this.started=!1,this.executionStopped=!1,this.referenced=!0,this.stopping=!1,this.joined=!1,this.servicingResource=!1,this.resourceClosed=!1,this.supervisorJoined=!1,this.terminalObserved=!1,this.taskPortLossReported=!1,this.requestId=0,this.stopCompletion=createRetainedOperation(()=>this.service()),this.cpuRequests=/* @__PURE__ */ new Map,this.heapRequests=/* @__PURE__ */ new Map,this.diagnosticName=`worker:${!r&&n instanceof URL?workerRequestKind(n):`other`}`,s&&(this.taskPort=new NativeWorkerTaskPort(s,{message:e=>this.runInContext(()=>runWithMainThreadTask(this.diagnosticName,()=>this.emit(`message`,e))),messageerror:e=>this.runInContext(()=>this.emit(`messageerror`,e)),unavailable:()=>this.observeTaskPortLoss()}))}get needsReference(){return this.referenced||this.stopping||this.executionStopped&&this.ownsNativeResource&&!this.joined||this.cpuRequests.size>0||this.heapRequests.size>0}service(){this.runtime.service()}serviceTaskPort(){let e=this.taskPort;e&&(runWithMainThreadTask(this.diagnosticName,()=>e.service()),this.observeTaskPortLoss())}observeTaskPortLoss(){let e=this.taskPort?.failure;!e||!this.started||!this.referenced||this.taskPortLossReported||this.terminalObserved||this.stopping||this.joined||this.executionStopped||this.runtime.failure||(this.taskPortLossReported=!0,this.runInContext(()=>this.emit(`error`,e)))}serviceResource(){if(!(!this.resourceBinding||this.servicingResource||this.joined)){this.servicingResource=!0;try{this.resourceBinding.service()}catch(e){this.resourceFailed(e)}finally{this.servicingResource=!1}}}attachResource(e){return this.resourceBinding=this.bindResource(e),{workerDataKey:e.workerDataKey,attachment:this.resourceBinding.attachment}}bindResource(e){let t=this.runtime.resourceBroker(),n=this.resourceConnection,r=!1,i=t.captureNativeResource({moduleUrl:e.moduleUrl,input:e.input,ownerPort:!!n},{message:e=>{e.type===`resource-owner`?n?.port.postMessage(e.value,[]):e.type===`resource-closed`&&this.runInContext(()=>{this.resourceClosed=!0,(this.supervisorJoined||this.executionStopped)&&this.finishJoined(this.executionExitCode)})},failed:e=>this.resourceFailed(e)}),forward=e=>{if(!r)try{let t=i.ownerMessage(e);this.runtime.failure||this.runtime.post({type:`resource-owner`,id:this.id,sequence:t.sequence,value:e})}catch(e){this.resourceFailed(toErrorObject(e,`Native resource owner delivery failed`))}};n?.port.on(`message`,forward),n?.port.unref();let dispose=()=>{r||(r=!0,n?.port.off(`message`,forward),n?.port.close(),n?.dispose())};return{attachment:i.attachment,receive(e){i.receive(e)},service(){if(!r&&n)for(n.service();;){let e=Qe(n.port);if(!e)break;forward(e.message)}},async closeAfterSupervisor(){try{await t.sealNativeResources(),await i.close()}catch(e){throw e instanceof BrokerNativeResourceCloseError&&n?.decodeCloseError?n.decodeCloseError(e.payload):e}},release(){i.release(),dispose()},abandonUnattached(){i.abandonUnattached(),dispose()}}}abandonResource(){this.taskPort?.close(),this.resourceBinding?this.resourceBinding.abandonUnattached():this.resourceConnection?.dispose()}resourceFailed(e){this.runInContext(()=>{this.rejectStopCompletion(e),this.emit(`error`,toErrorObject(e,`Native resource observation failed`))})}rejectStopCompletion(e){materializeErrorStack(e),this.stopCompletion.reject(e)}recoverResource(){if(!this.resourceBinding||this.joined||this.resourceRecovery)return;let e=this.resourceBinding.closeAfterSupervisor();this.resourceRecovery=e,e.then(()=>this.runInContext(()=>{this.finishJoined(void 0)}),e=>this.runInContext(()=>{this.stopping=!1,this.rejectStopCompletion(e)}))}postMessage(e,t=[]){if(this.joined||this.stopping||this.executionStopped)throw Error(`Native worker is closing`);if(this.runtime.failure)throw this.runtime.failure;this.taskPort?this.taskPort.postMessage(e,t):this.runtime.post({type:`post`,id:this.id,value:e,transferList:t},t)}ref(){if(this.runtime.failure)throw this.runtime.failure;return this.taskPort?.assertAvailable(),this.referenced=!0,this.runtime.refreshReference(),this}unref(){if(this.referenced=!1,!this.joined&&this.runtime.failure)throw this.runtime.failure;return this.runtime.refreshReference(),this}stop(){if(this.joined)return this.stopCompletion.operation.read().status!==`fulfilled`&&(this.stopCompletion=createRetainedOperation(()=>this.service()),this.stopCompletion.resolve()),this.stopCompletion.operation;if(this.stopCompletion.operation.read().status===`rejected`&&(this.stopCompletion=createRetainedOperation(()=>this.service())),this.supervisorJoined&&this.resourceBinding)return this.rejectStopCompletion(Error(`Native resource cleanup is still retained after supervisor loss`,{cause:this.runtime.failure})),this.recoverResource(),this.stopCompletion.operation;if(!this.stopping){this.stopping=!0;try{this.runtime.post({type:`stop`,id:this.id})}catch(e){this.stopping=!1,this.rejectStopCompletion(e)}this.runtime.refreshReference()}return this.stopCompletion.operation}terminate(){return this.stop().result}cpuUsage(e){return this.requestSample(this.cpuRequests,{type:`cpu`,previous:e})}getHeapStatistics(){return this.requestSample(this.heapRequests,{type:`heap`})}requestSample(e,t){if(this.joined)return Promise.reject(/* @__PURE__ */ Error(`Native worker exited`));let n=createRetainedOperation(()=>this.service()),r=++this.requestId;e.set(r,n);try{this.runtime.post({...t,id:this.id,requestId:r})}catch(t){e.delete(r),n.reject(t)}return this.runtime.refreshReference(),n.operation.result}rejectSamples(e){for(let t of[...this.cpuRequests.values(),...this.heapRequests.values()])t.reject(e);this.cpuRequests.clear(),this.heapRequests.clear()}ownerFailed(e){this.runInContext(()=>{this.terminalFailure??=e,this.taskPort?.close(),this.stopping=!1,this.rejectSamples(e),this.rejectStopCompletion(e),this.emit(`error`,e)})}ownerJoined(e){this.runInContext(()=>{if(this.terminalFailure??=e,this.stopping=!1,this.supervisorJoined=!0,this.rejectSamples(e),this.finishExecution(void 0),this.ownsNativeResource){if(this.resourceClosed){this.finishJoined(void 0);return}this.rejectStopCompletion(Error(`Native resource cleanup outcome is unavailable after owner loss`,{cause:e})),this.recoverResource()}else this.finishJoined(void 0)})}finishJoined(e){this.joined||(this.joined=!0,this.taskPort?.close(),this.threadId=-1,this.stopping=!1,this.referenced=!1,this.rejectSamples(/* @__PURE__ */ Error(`Native worker exited`)),this.stopCompletion.resolve(),this.runtime.handles.delete(this.id),this.runtime.failure||this.runtime.post({type:`release`,id:this.id}),this.runtime.refreshReference(),this.resourceBinding?this.resourceBinding.release():this.resourceConnection?.dispose(),this.finishExecution(e),this.emit(`exit`,e))}finishExecution(e){this.executionStopped||(this.taskPort?.close(),this.executionStopped=!0,this.executionExitCode=e,this.emit(`execution-exit`,e)),this.resourceClosed&&!this.joined&&this.finishJoined(e)}receive(e){this.runInContext(()=>runWithMainThreadTask(this.diagnosticName,()=>{(e.type===`error`||e.type===`messageerror`||e.type===`create-error`||e.type===`execution-exit`||e.type===`stopped`||e.type===`stop-error`)&&(this.terminalObserved=!0,this.taskPort?.drain()),this.receiveOwned(e)}))}receiveOwned(e){if(e.type===`created`)this.started=!0,this.threadId=e.threadId,trackNativeWorkerForCpu(this,this.filename,this.evalSource),this.taskPort?.start(),this.emit(`started`),this.taskPort?.drain(),this.observeTaskPortLoss();else if(e.type===`message`)this.emit(`message`,e.value);else if(e.type===`resource-message`)this.resourceBinding?.receive(e.response);else if(e.type===`error`||e.type===`messageerror`){let t=toErrorObject(decodeNativeWorkerFailure(e.error),`Native worker failed`);this.terminalFailure??=t,this.emit(e.type,t)}else if(e.type===`create-error`){this.joined=!0,this.threadId=-1,this.referenced=!1;let t=toErrorObject(decodeNativeWorkerFailure(e.error),`Native worker creation failed`);this.rejectSamples(t),this.stopCompletion.resolve(),this.runtime.handles.delete(this.id),this.runtime.refreshReference(),this.abandonResource(),this.emit(`error`,t)}else if(e.type===`stopped`)this.finishExecution(e.code),this.finishJoined(e.code);else if(e.type===`execution-exit`)this.finishExecution(e.code);else if(e.type===`stop-error`){let t=this.stopping;this.stopping=!1;let n;try{if(e.resourceError){if(!this.resourceConnection?.decodeCloseError)throw Error(`Native resource cleanup error decoder is unavailable`,{cause:e.error});n=this.resourceConnection.decodeCloseError(e.error)}else n=toErrorObject(decodeNativeWorkerFailure(e.error),`Native worker stop failed`)}catch(e){n=toErrorObject(e,`Native resource cleanup error decoding failed`)}this.rejectStopCompletion(n),t||this.emit(`error`,n)}else if(e.type===`cpu`)this.cpuRequests.get(e.requestId)?.resolve(e.value),this.cpuRequests.delete(e.requestId);else if(e.type===`heap`)this.heapRequests.get(e.requestId)?.resolve(e.value),this.heapRequests.delete(e.requestId);else if(e.type===`request-error`){let t=toErrorObject(decodeNativeWorkerFailure(e.error),`Native worker observation failed`);this.cpuRequests.get(e.requestId)?.reject(t),this.heapRequests.get(e.requestId)?.reject(t),this.cpuRequests.delete(e.requestId),this.heapRequests.delete(e.requestId)}this.runtime.refreshReference()}}})),$m,eh=__esmMin((()=>{$m=Symbol.for(`openclaw.nativeWorkerLifetimes`)}));async function closeDefaultRetainedNativeWorkerSource(){await Z.defaultSource?.close()}function forgetNativeSource(e){e.runtimeGeneration?Z.sources.get(e.runtimeGeneration)===e&&Z.sources.delete(e.runtimeGeneration):Z.defaultSource===e&&(Z.defaultSource=void 0)}function nativeCleanupFailures(e){return e.flatMap(e=>e.status===`rejected`?[e.reason]:[])}function nativeResourceBroker(e){return e.broker.host??=runInDetachedAsyncContext(()=>createSpawnBrokerHost({nativeResources:!0,workerUrl:e.brokerModuleUrl}))}async function retireNativeResourceBroker(e){let t=e.broker;if(await t.closing,e.hasActiveWorkers||t.retainedUntilProcessExit||t.host?.hasOpenNativeResourceClaims)return!1;let n=t.host;return t.host=void 0,await(t.closing=n?.close()),t.closing=void 0,!0}function nativeRuntime(e){if(e.closing)throw Error(`Native worker source is closing`);let t=e.runtime;if(t){if(t.failure)throw t.failure;return t}return runInDetachedAsyncContext(()=>{let{port1:t,port2:n}=new M,r=e.moduleUrl,i=createSqliteDatabaseAdmissionCursor();captureSqliteDatabaseAdmissions(i);let a;try{a=createCpuTrackedWorker(r,{execArgv:resolveRuntimeWorkerThreadExecArgv(r),env:Ye,workerData:{port:n},transferList:[n]})}catch(e){throw t.close(),n.close(),e}let s=/* @__PURE__ */ new Map,c=createDeferredCore();c.promise.catch(()=>void 0);let l=!1,terminateOwner=()=>{if(!l){l=!0,a.ref(),t.ref();try{a.terminate().catch(c.reject)}catch(e){c.reject(e)}}},receive=e=>{observeWorkerMessage(e,`from_worker`,`lifecycle`),s.get(e.id)?.receive(e)},readControlMessage=()=>Qe(t),u={databaseAdmissionCursor:i,handles:s,service(){for(;;){let e=runWithMainThreadTask(`worker:control-decode`,readControlMessage);if(!e)break;receive(e.message)}let n=[...s.values()];for(let e of n)e.serviceTaskPort(),e.serviceResource();if(u.failure)return;let r;try{r=nativePortIsOpen(t)}catch(e){fail(Error(`Native worker lifetime channel observation failed`,{cause:e})),terminateOwner();return}r?e.broker.host?.serviceNativeResources():(fail(/* @__PURE__ */ Error(`Native worker lifetime channel closed`)),terminateOwner())},post(e,n=[]){if(u.failure)throw u.failure;let r=workerMessagePayloadBytes(e);t.postMessage(e,n),observeWorkerMessage(e,`to_worker`,`lifecycle`,r??null)},resourceBroker(){return nativeResourceBroker(e)},refreshReference(){[...s.values()].some(e=>e.needsReference)?(a.ref(),t.ref()):(a.unref(),t.unref())},close(){return u.failure??=/* @__PURE__ */ Error(`Native worker lifetime owner is closing`),materializeErrorStack(u.failure),terminateOwner(),c.promise}},fail=e=>{if(!u.failure){u.failure=toErrorObject(e,`Native worker lifetime owner failed`),materializeErrorStack(u.failure);for(let e of s.values())e.ownerFailed(u.failure)}};return t.on(`message`,receive),t.on(`messageerror`,e=>{try{fail(e)}finally{terminateOwner()}}),a.on(`message`,e=>receiveWorkerMemoryPort(a,e)),a.on(`error`,fail),a.once(`exit`,()=>{setImmediate(()=>{let n=u.failure??/* @__PURE__ */ Error(`Native worker lifetime owner exited`);materializeErrorStack(n),u.failure=n,e.closing=!0;for(let e of s.values())e.ownerJoined(n);t.close(),c.resolve()})}),e.runtime=u,u.refreshReference(),u})}function captureRetainedNativeWorkerSource(e){let t=resolveRuntimeProcessEntrypointUrl(`workerNativeLifecycle`),n=e===void 0?captureRuntimeWorkerSource(t):{moduleUrl:resolveRuntimeWorkerGenerationUrl(t,e.runtimeGeneration),runtimeGeneration:e.runtimeGeneration},r=n.runtimeGeneration?Z.sources.get(n.runtimeGeneration):Z.defaultSource;if(r)return r;!n.runtimeGeneration&&Z.defaultBroker.host?.nativeResourceAdmissionClosed&&(Z.defaultBroker={});let i={...n,broker:n.runtimeGeneration?{}:Z.defaultBroker,brokerModuleUrl:resolveRuntimeWorkerGenerationUrl(resolveRuntimeProcessEntrypointUrl(`spawnBroker`),n.runtimeGeneration),closing:!1,get hasActiveWorkers(){return!!i.runtime?.handles.size},activeWorkerPaths(){return[...i.runtime?.handles.values()??[]].map(e=>e.sourcePath)},retireIdleBroker(){return retireNativeResourceBroker(i)},close(){return s??=Promise.resolve().then(async()=>{try{let e=nativeCleanupFailures(await Promise.allSettled([...a.values()].map(e=>e())));if(e.length)throw AggregateError(e,`Native worker execution owner cleanup failed`);if(i.hasActiveWorkers)throw Error(`Native worker execution owners have not joined`);i.closing=!0,await i.runtime?.close(),await retireNativeResourceBroker(i),forgetNativeSource(i),a.clear()}catch(e){throw i.closing||(s=void 0),materializeErrorStack(e),e}})},create(e,t,n,r){try{return startNativeWorker(nativeRuntime(i),e,t??{},n,r)}catch(e){throw r?.host.close(),r?.worker.close(),e}},async captureIndependentResource(e,t){if(await i.broker.closing,i.closing)throw Error(`Native worker source is closing`);let r=nativeResourceBroker(i),{port1:s,port2:c}=new M,l=createDeferredCore(),fail=e=>{l.reject(e),c.close()},u=r.captureNativeResource({moduleUrl:String(resolveRuntimeWorkerGenerationUrl(e,n.runtimeGeneration)),input:t,ownerPort:!1},{message(e){e.type===`resource-created`&&l.resolve()},failed:fail}),d=attachBrokerNativeResource(u.attachment,s,e=>u.receive(e),fail),f=!1,p={port:c,retainBrokerUntilProcessExit(){i.broker.retainedUntilProcessExit=!0},async close(){f||(d.dispatched?(await d.close(),await u.close(),u.release()):u.abandonUnattached(),d.dispose(),s.close(),c.close(),f=!0,a.delete(p),i.closing&&await retireNativeResourceBroker(i))}};try{return await l.promise,p}catch(e){try{await p.close()}catch(t){throw i.retain(p,()=>p.close()),AggregateError([e,t],`Native resource creation cleanup failed`,{cause:t})}throw e}},captureResource(e,t,r,i){let a=D.snapshot();return Object.freeze({moduleUrl:String(resolveRuntimeWorkerGenerationUrl(e,n.runtimeGeneration)),workerDataKey:t,input:r===void 0?void 0:structuredClone(r),connect:i?()=>a(()=>{let e=i(),t=e.decodeCloseError?.bind(e);return{port:e.port,service:()=>a(()=>e.service()),dispose:()=>a(()=>e.dispose()),decodeCloseError:t?e=>a(()=>t(e)):void 0}}):void 0})},retain(e,t){a.set(e,t),n.runtimeGeneration?.retain(i,()=>i.close())}},a=/* @__PURE__ */ new Map,s;return n.runtimeGeneration?Z.sources.set(n.runtimeGeneration,i):Z.defaultSource=i,i}function createRetainedNativeWorker(e,t={},n,r,i){try{return(n??captureRetainedNativeWorkerSource({runtimeGeneration:void 0})).create(e,t,r,i)}catch(e){throw i?.host.close(),i?.worker.close(),e}}function startNativeWorker(e,t,n,r,i){let a=++Z.nextId,s,c,l=!1;try{s=r?.connect?.(),c=new NativeWorker(e,a,t,n.eval===!0,r!==void 0,s,i?.host);let{env:u,transferList:d=[],...f}=n;e.handles.set(a,c);let p=r?c.attachResource(r):void 0,m=captureSqliteDatabaseAdmissions(e.databaseAdmissionCursor);l=!0,e.post({type:`create`,id:a,filename:{kind:t instanceof URL?`url`:`path`,value:String(t)},environmentData:captureSqliteWorkerEnvironmentData(m),options:{...f,environment:{...u===Ye?process.env:u??process.env},shareEnvironment:u===Ye},transferList:[...d],resource:p,taskPort:i?.worker},i?[...d,i.worker]:d)}catch(t){throw l&&(e.databaseAdmissionCursor=createSqliteDatabaseAdmissionCursor()),e.handles.delete(a),e.refreshReference(),c?c.abandonResource():(i?.host.close(),s?.dispose()),i?.worker.close(),t}return e.refreshReference(),c}var Z,th=__esmMin((()=>{F(),Vm(),Hm(),I(),Nt(),R(),Mf(),dt(),Qr(),Wl(),Wm(),Hl(),Zp(),Rd(),Zu(),Qm(),eh(),qm(),Z=resolveGlobalSingleton($m,()=>({nextId:0,sources:/* @__PURE__ */ new WeakMap,defaultBroker:{}}),closeDefaultRetainedNativeWorkerSource)}));function resolveWorkerComputeLimit(){return Math.max(1,Te()-1)}function resolveWorkerPoolSize(e){return Math.min(e===`reader`||e===`file-reader`?2:e===`compute`?4:1,resolveWorkerComputeLimit())}var nh=__esmMin((()=>{resolveWorkerPoolSize(`reader`)})),rh=/* @__PURE__ */ __exportAll({reportSlowWorkerDelivery:()=>reportSlowWorkerDelivery});function reportSlowWorkerDelivery(e){ih.warn(`slow SQLite worker delivery`,e)}var ih,ah=__esmMin((()=>{Wg(),ih=createSubsystemLogger(`worker/delivery`)}));function captureWorkerStartObserver(e){let t=oh.getStore();return t?()=>t(workerScriptName(e)):void 0}function trackWorkerRequest(e,t,n){let r=normalizeWorkerRequestClass(t),i=e===`sqlite_writer`?lh.getStore():void 0,a=performance.now(),s=e===`sqlite_writer`&&(uh||ch.size>0||hasInternalDiagnosticEventInterest(`worker.request`,!0))?{enqueued:a}:void 0,c,l=!1,u,emit=(t,n,i)=>{if(!areDiagnosticsEnabledForProcess())return;let a=dh.get(e)??0,c=t===`completed`?s:void 0;for(let s of ch)try{s(e,r,t,a,n,i,c)}catch{}hasInternalDiagnosticEventInterest(`worker.request`,!0)&&emitTrustedDiagnosticEvent({type:`worker.request`,kind:e,requestClass:r,phase:t,queueDepth:a,...n===void 0?{}:{queueWaitMs:n},...i===void 0?{}:{durationMs:i},...c?{timing:c}:{}})},dequeue=()=>dh.set(e,(dh.get(e)??0)-1);dh.set(e,(dh.get(e)??0)+1),emit(`queued`);let d={requestClass:r,timing:s,...i?{recordTransactions:e=>{i.transactionCount=(i.transactionCount??0)+e}}:{},started:(e,t)=>{l||c!==void 0||(c=performance.now(),s&&t&&(u={performance:t,atStart:t.eventLoopUtilization(),threadId:e}),i&&(d.startedAt=c,d.threadId=e,i.active=d,i.operations.add(i.operations.has(r)||i.operations.size<8?r:`other`)),s&&(s.dispatched=c),n?.removeEventListener(`abort`,d.completed),dequeue(),emit(`started`,c-a))},completed:()=>{if(!l){if(l=!0,i?.active===d&&(i.active=void 0),n?.removeEventListener(`abort`,d.completed),c===void 0&&dequeue(),u&&s?.posted!==void 0&&s.received!==void 0&&s.received-s.posted>=sh){let e=u.performance.eventLoopUtilization(u.atStart),t=s.executeStarted!==void 0&&s.executeFinished!==void 0?s.executeFinished-s.executeStarted:0,n={requestClass:r,threadId:u.threadId,deliveryMs:Math.round(s.received-s.posted),executeMs:Math.round(t),workerActiveMs:Math.round(e.active),workerIdleMs:Math.round(e.idle),workerActiveOutsideExecuteMs:Math.round(Math.max(0,e.active-t))};Promise.resolve().then(()=>(ah(),rh)).then(({reportSlowWorkerDelivery:e})=>e(n)).catch(e=>{process.emitWarning(e instanceof Error?e:String(e))})}emit(`completed`,void 0,c===void 0?void 0:performance.now()-c)}}};return n?.addEventListener(`abort`,d.completed,{once:!0}),n?.aborted&&d.completed(),d}var oh,sh,ch,lh,uh,dh,fh=__esmMin((()=>{R(),rr(),yi(),Kr(),Yu(),di(),oh=resolveGlobalSingleton(Symbol.for(`openclaw.workerStartObservation`),()=>new D),sh=1e3,ch=resolveGlobalSingleton(Symbol.for(`openclaw.workerRequestMetricsListeners`),()=>/* @__PURE__ */ new Set),lh=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteWorkerReservationObservation`),()=>new D),uh=isDiagnosticFlagEnabled(`sqlite.worker-timing`),dh=resolveGlobalSingleton(Symbol.for(`openclaw.workerRequestQueueDepth`),()=>/* @__PURE__ */ new Map)}));function getWorkerComputeCapacity(){return resolveGlobalSingleton(Symbol.for(`openclaw.workerComputeCapacity`),()=>createWorkerComputeCapacity(resolveWorkerComputeLimit()))}var ph=__esmMin((()=>{hu(),R(),nh()})),mh=__esmMin((()=>{Nt(),R(),resolveGlobalSingleton(Symbol.for(`openclaw.activeStoreWriters`),()=>new D),resolveGlobalSingleton(Symbol.for(`openclaw.storeWriterTurn`),()=>({started:0,startedAt:0,reset:void 0,wait:void 0}))})),hh,gh=__esmMin((()=>{R(),mh(),hh=resolveGlobalSingleton(Symbol.for(`openclaw.agentDatabaseWriteAdmission`),()=>({queues:/* @__PURE__ */ new Map})),hh.queues}));function*reachablePools(){for(let e of _h){let t=e.deref();t?yield{pool:t,reference:e}:_h.delete(e)}}var _h,vh,yh=__esmMin((()=>{hu(),R(),gh(),_h=resolveGlobalSingleton(Symbol.for(`openclaw.workerTaskPools`),()=>/* @__PURE__ */ new Set),vh={register(e){for(let t of reachablePools())if(t.pool===e)return e;return _h.add(new WeakRef(e)),e},async close(e,t,n){await joinOwnedWorkerTasks(t),await n();for(let t of reachablePools())t.pool===e&&_h.delete(t.reference)}}}));async function runBestEffortCleanup(e){try{return await e.cleanup()}catch(t){try{e.onError?.(t)}catch{}return}}var bh=__esmMin((()=>{}));function readDarwinImagePath(e){let t={encoding:`utf8`,timeout:2e3},n=_(`/usr/sbin/lsof`,[`-a`,`-p`,String(e),`-d`,`txt`,`-Fn`],t),r=n.status===0?/^n(\/.+)$/mu.exec(n.stdout)?.[1]:void 0,i=r&&_(`/bin/ps`,[`-o`,`ucomm=`,`-p`,String(e)],t);return i&&i.status===0&&i.stdout.trim()===E.basename(r).slice(0,16)?r:void 0}function isRedactedSystemImage(e){if(!e.startsWith(`/System/`))return!1;let t=_(`/usr/bin/codesign`,[`-d`,`--entitlements`,`-`,e],{encoding:`utf8`,timeout:2e3});return t.status===0&&Sh.test(t.stdout)}function readCommandWithServiceMarker(e){try{return Pe(e,{environmentKeys:[`OPENCLAW_SERVICE_MARKER`]})}catch(t){if(!(t instanceof ie)||t.code!==`incomplete`)throw t;let n=Pe(e);return n&&[n.executable,n.argv[0]??``].some(e=>isNodeRuntime(e)||isBunRuntime(e)||E.basename(e)===`tsx`)?{...n,serviceMarkerUnavailable:!0}:n}}function readDarwinProcessCommand(e,t,n={}){try{let t=n.serviceMarker===!1?Pe(e):readCommandWithServiceMarker(e);if(!t)return;let r=t.environment.OPENCLAW_SERVICE_MARKER;return{argv:[...t.argv],executable:t.executable,...r===void 0?{}:{serviceMarker:r},...`serviceMarkerUnavailable`in t?{serviceMarkerUnavailable:!0}:{}}}catch(n){if(!(n instanceof ie))throw n;if(n.code===`layout-mismatch`||n.code===`incomplete`){let r=readDarwinImagePath(e);if(r&&isRedactedSystemImage(r))return{argvUnavailable:!0,executable:r,...t?{owner:t}:{}};throw n}if(n.code===`unsupported-platform`&&process.platform===`darwin`)throw Error(`Cannot inspect Darwin process arguments under Rosetta; run OpenClaw with native arm64 Node.js.`,{cause:n});if(n.code!==`access-denied`&&n.code!==`operation-failed`)throw n;if(isPidDefinitelyDead(e))return;if(t===`different`)return xh||(xh=!0,createSubsystemLogger(`process/census`).debug(`Unreadable Darwin arguments for another UID do not establish capture custody.`,{pid:e,code:n.code})),{argvUnavailable:!0,owner:t};throw Error(`Could not classify PID ${e}: cannot inspect Darwin arguments (${n.code}).`,{cause:n})}}var xh,Sh,Ch=__esmMin((()=>{Vl(),Wg(),wt(),xh=!1,Sh=/\[Key\] com\.apple\.private\.no-read-procargs\s*\[Value\]\s*\[Bool\] true|<key>com\.apple\.private\.no-read-procargs<\/key>\s*<true\/>/u}));function parseWindowsNativeArguments(e){let t=[],n=0;for(;n<e.length;){for(;/[ \t]/.test(e.charAt(n));)n++;if(n===e.length)break;let r=``,i=!1;for(;n<e.length;){let t=0;for(;e[n]===`\\`;)t++,n++;if(e[n]===`"`)r+=`\\`.repeat(Math.floor(t/2)),t%2==1?(r+=`"`,n++):i&&e[n+1]===`"`?(r+=`"`,n+=2):(i=!i,n++);else{if(r+=`\\`.repeat(t),n===e.length||!i&&/[ \t]/.test(e.charAt(n)))break;r+=e.charAt(n++)}}t.push(r)}return t}function parseWindowsNativeCommandLine(e){if(e.includes(`\0`))return null;let t=0;for(;/[ \t]/.test(e.charAt(t));)t++;if(t===e.length)return[];let n=``,r=!1;for(;t<e.length&&(r||!/[ \t]/.test(e.charAt(t)));){let i=e.charAt(t++);i===`"`?r=!r:n+=i}return r||!n?null:[n,...parseWindowsNativeArguments(e.slice(t))]}var wh=__esmMin((()=>{}));function isRosettaTranslatedProcess(){return process.platform!==`darwin`||process.arch!==`x64`?!1:(Th??=k.cpus()[0]?.model.includes(`Apple`)===!0,Th)}var Th,Eh=__esmMin((()=>{}));function isValueToken(e){return!e||e===`--`?!1:!e.startsWith(`-`)||/^-\d+(?:\.\d+)?$/.test(e)}function consumeRootOptionToken(e,t){let n=e[t];return n?Dh.has(n)||n.startsWith(`--profile=`)||n.startsWith(`--log-level=`)||n.startsWith(`--container=`)?1:Oh.has(n)?isValueToken(e[t+1])?2:1:0:0}function consumeRootCommandOptionToken(e,t){return consumeKnownOptionToken(e,t,Dh,Oh,`command-path`)}function getRootOptionAwareCommandPath(e,t){let n=e.slice(2),r=[],i=!1;for(let e=0;e<n.length;e+=1){let a=n[e];if(!a)break;if(!i&&a===`--`){if(r.length>0)break;i=!0;continue}let s=i?0:consumeRootCommandOptionToken(n,e);if(s>0)e+=s-1;else if((i||!a.startsWith(`-`))&&(r.push(a),r.length>=t))break}return r}function rewriteUpdateFlagArgv(e){let t=e.indexOf(`--update`);if(t===-1)return e;for(let n=2;n<e.length;n++){let r=e[n];if(!r||r===`--`)return e;if(n===t)return[...e.slice(0,t),`update`,...e.slice(t+1)];let i=consumeRootOptionToken(e,n);if(i>0)n+=i-1;else if(!r.startsWith(`-`))return e}return e}function isUpdateCommandArgv(e){return getRootOptionAwareCommandPath(rewriteUpdateFlagArgv(e),1)[0]===`update`}function consumeKnownOptionToken(e,t,n,r,i){let a=e[t];if(!a||a===`--`||!a.startsWith(`-`))return 0;let s=a.indexOf(`=`),c=s===-1?a:a.slice(0,s);return n.has(c)?+(s===-1):r.has(c)?s===-1?i===`command-path`?e[t+1]===void 0?0:2:isValueToken(e[t+1])?2:0:i===`command-path`||a.slice(s+1).trim()?1:0:0}var Dh,Oh,kh=__esmMin((()=>{Dh=/* @__PURE__ */ new Set([`--dev`,`--no-color`]),Oh=/* @__PURE__ */ new Set([`--profile`,`--log-level`,`--container`])})),Ah=__esmMin((()=>{kh()}));function isContainerEnvironment(){return jh??=detectContainerEnvironment()}function detectContainerEnvironment(){if(process.env.FLY_MACHINE_ID?.trim()&&process.env.FLY_APP_NAME?.trim())return!0;for(let e of[`/.dockerenv`,`/run/.containerenv`,`/var/run/.containerenv`])try{return v.accessSync(e,v.constants.F_OK),!0}catch{}try{let e=v.readFileSync(`/proc/1/cgroup`,`utf8`);if(/\/docker\/|cri-containerd-[0-9a-f]|containerd\/[0-9a-f]{64}|\/kubepods[/.]|\blxc\b/.test(e))return!0}catch{}return!1}var jh,Mh=__esmMin((()=>{})),Nh=__esmMin((()=>{Kn()}));function isLegacyPluginSourceCaptureName(e){return e.startsWith(`openclaw-plugin-build-`)||e.startsWith(`openclaw-model-catalog-`)}var Ph=__esmMin((()=>{Nh(),mm(),Qi(),or()}));function normalizeProcArg(e){return normalizeLowercaseStringOrEmpty(e.replaceAll(`\\`,`/`))}function referencesRetainedArtifact(e){return e.split(/[\\/=]/u).some(e=>isLegacyPluginSourceCaptureName(e)||/^openclaw-update-runtime-[A-Za-z0-9]{6}$/u.test(e))}function readProcessPackageIdentity(e,t=!1){for(let n=e;;){let e;try{e=JSON.parse(v.readFileSync(E.join(n,`package.json`),`utf8`))}catch(e){let r=E.dirname(n);if(t&&extractErrorCode(e)===`ENOENT`){if(r===n)return{kind:`absent`};if(E.basename(n)===`node_modules`)return{kind:`unknown`,reason:`could not read package identity`};n=r;continue}return{kind:`unknown`,reason:`could not read package identity`}}return!isRecord(e)||typeof e.name!=`string`||!e.name.trim()||e.name!==e.name.trim()?{kind:`unknown`,reason:`package identity has no valid name`}:{kind:`package`,name:e.name,scripts:isRecord(e.scripts)?e.scripts:{}}}}function readProcessWorkingDirectories(e){let t=new Set(e.filter(e=>Number.isSafeInteger(e)&&e>0)),n=/* @__PURE__ */ new Map;if(t.size===0)return n;if(process.platform===`linux`){for(let e of t)try{n.set(e,v.readlinkSync(`/proc/${e}/cwd`))}catch{}return n}try{if(process.platform===`darwin`){let e=_(`/usr/sbin/lsof`,[`-a`,`-p`,[...t].join(`,`),`-d`,`cwd`,`-F0pn`],{encoding:`utf8`,timeout:5e3,maxBuffer:4194304,env:resolveDiagnosticProcessEnv()});if(e.error||e.status!==0&&e.status!==1)return n;let r=e.stdout.split(`\0`);r.pop();let i=/* @__PURE__ */ new Set,a;for(let e of r){let r=e.replace(/^\n/,``);if(r.startsWith(`p`)){let e=/^p(\d+)$/.exec(r);a=e&&t.has(Number(e[1]))?Number(e[1]):void 0}else a!==void 0&&r.startsWith(`n`)&&E.isAbsolute(r.slice(1))&&(n.delete(a)?i.add(a):i.has(a)||n.set(a,r.slice(1)))}}}catch{}return n}function classifyEntrypoint(e,t={}){let n=normalizeProcArg(e[0]??``).replace(/\.(bat|cmd|exe)$/i,``);if(!t.requirePackageIdentity&&(n.endsWith(`/openclaw`)||n===`openclaw`))return{kind:`openclaw`,entryIndex:0};let r=/(?:^|\/)openclaw\.mjs$/.test(n)?0:resolveRuntimeScriptPosition(e).position;if(typeof r!=`number`)return r.kind===`unclassified`?{kind:`unclassified`,cause:`runtime-syntax`,reason:r.reason}:{kind:`other`};let i=e[r];if(t.inspectPackage&&!t.requirePackageIdentity&&t.cwd&&E.isAbsolute(t.cwd)&&isBunRuntime(e[0]??``)&&!/[\\/]/u.test(i)&&!E.extname(i)){let e=readProcessPackageIdentity(t.cwd,!0);if(e.kind===`unknown`)return{kind:`unclassified`,cause:`package-identity`,reason:e.reason};let n=e.kind===`package`?e.scripts[i]:void 0;if(typeof n==`string`&&n.trim())return e.kind===`package`&&e.name===`openclaw`?{kind:`openclaw`}:{kind:`other`}}let a=classifyOpenClawEntrypointPath(i,t);return a.kind===`openclaw`?{...a,entryIndex:r}:a}function classifyOpenClawEntrypointPath(e,t={}){let n=normalizeProcArg(e);if(!t.requirePackageIdentity&&!t.inspectPackage&&/(?:^|\/)openclaw\.mjs$/.test(n))return{kind:`openclaw`};let r=[...Fh,...t.additionalEntrypoints??[]],i=e;if(!E.isAbsolute(e)){let n=t.cwd??(t.pid===void 0?void 0:readProcessWorkingDirectories([t.pid]).get(t.pid));if(!n||!E.isAbsolute(n))return{kind:`unclassified`,cause:`cwd`,reason:`working directory is unavailable`};i=E.resolve(n,e)}let a,s;try{if(a=v.realpathSync(i),t.inspectPackage&&!t.requirePackageIdentity&&referencesRetainedArtifact(a))return{kind:`openclaw`,artifactPath:a};let n=t.requirePackageIdentity||t.inspectPackage?v.statSync(a):void 0;if(t.requirePackageIdentity&&!n?.isFile())return{kind:`unclassified`,cause:`script`,reason:`entrypoint is not a regular file: ${e}`};s=n?.isDirectory()??!1}catch{return{kind:`unclassified`,cause:`script`,reason:`could not resolve script`}}let c=normalizeProcArg(a);if(!t.requirePackageIdentity&&/(?:^|\/)openclaw\.mjs$/.test(n))return{kind:`openclaw`};let l=s?void 0:r.find(e=>c.endsWith(`/${e}`));if(!l&&(!t.inspectPackage||t.requirePackageIdentity))return{kind:`other`};let u=l?a.slice(0,-l.length):s?a:E.dirname(a),d=readProcessPackageIdentity(u,t.inspectPackage&&!t.requirePackageIdentity||!l&&!s);return d.kind===`unknown`?{kind:`unclassified`,cause:`package-identity`,reason:d.reason}:d.kind===`package`&&d.name===`openclaw`?{kind:`openclaw`,...t.requirePackageIdentity?{packageIdentity:{root:E.resolve(u),entrypoint:a}}:{}}:{kind:`other`}}function classifyOpenClawArgv(e,t={}){let{command:n,owner:r,pid:i,port:a}=t;if(!t.requirePackageIdentity&&n===`gateway`&&r?.pid===i&&r?.state===`live`&&(a===void 0||r.port===a))return{kind:`openclaw`};let s=normalizeProcArg(e[0]??``).split(`/`).at(-1)?.replace(/\.(exe|cmd|bat)$/,``)??``;if(!t.requirePackageIdentity&&/^openclaw-[a-z0-9-]+$/.test(s))return!n||s===`openclaw-${n}`?{kind:`openclaw`}:{kind:`other`};let c=classifyEntrypoint(e,t);if(n)return c.kind===`openclaw`&&normalizeProcArg(getRootOptionAwareCommandPath([`node`,...e.slice(c.entryIndex)],1)[0]??``)!==n?{kind:`other`}:c;if(c.kind===`openclaw`||!t.requirePackageIdentity&&e.some(e=>e.replaceAll(`\\`,`/`).split(`/`).some(isLegacyPluginSourceCaptureName)))return c.kind===`openclaw`?c:{kind:`openclaw`};if(t.serviceMarkerUnavailable&&!t.requirePackageIdentity)return{kind:`unclassified`,cause:`service-marker`,reason:`process environment is unreadable`};let l=t.serviceMarker;if(i!==void 0&&process.platform===`linux`&&(isNodeRuntime(s)||isBunRuntime(s)||s===`tsx`))try{l=v.readFileSync(`/proc/${i}/environ`,`utf8`).split(`\0`).find(e=>e.startsWith(`OPENCLAW_SERVICE_MARKER=`))?.slice(24)}catch(e){return{kind:`unclassified`,cause:`service-marker`,reason:`process identity inspection failed (${extractErrorCode(e)??`unavailable`})`}}return!t.requirePackageIdentity&&l===`openclaw`?{kind:`openclaw`}:c}var Fh,Ih=__esmMin((()=>{F(),B(),Lt(),Vl(),Ph(),Ah(),mt(),Fh=[`openclaw.mjs`,`dist/index.js`,`dist/entry.js`,`scripts/run-node.mjs`,`src/entry.ts`,`src/index.ts`]}));function readWindowsProcessCensus(e){return Ne({timeoutMs:e,includeCommand:!0}).flatMap(({pid:e,owner:t,identity:n,command:r})=>{if(e===0||e===4||n?.exited)return[];let i=r?.executable;if(!r&&n)try{try{var a=_usingCtx();i=a.u(st.open(e,{access:`observe`,expect:{startTimeMicros:n.startTimeMicros}}))?.imagePath}catch(e){a.e=e}finally{a.d()}}catch{}let s;if(t===`unknown`&&!n&&!r)try{oe(e)}catch(e){e instanceof ie&&e.code===`access-denied`&&(s=!0)}return[{pid:e,...n?{parentPid:n.parentPid,startIdentity:String(Math.floor(n.startTimeMicros/1e3))}:{},...r?.commandLine===void 0?{}:{commandLine:r.commandLine},...i?{executable:i}:{},...r?.cwd===void 0?{}:{cwd:r.cwd},...t===`different`?{foreignOwner:!0}:{},...s?{accessDenied:s}:{}}]})}var Lh=__esmMin((()=>{$r()}));function locateWindowsRegExe(){let e=E.win32.join(Rh,`System32`,`reg.exe`);return canAccessSync(e,v.constants.R_OK)?e:null}function trimTrailingSeparators(e){let t=E.win32.parse(e),n=e;for(;n.length>t.root.length&&/[\\/]/.test(n.at(-1)??``);)n=n.slice(0,-1);return n}function normalizeWindowsInstallRoot(e){if(typeof e!=`string`)return null;let t=e.trim();if(!t||t.includes(`\0`)||t.includes(`\r`)||t.includes(`
`)||t.includes(`;`))return null;let n=trimTrailingSeparators(E.win32.normalize(t));if(!E.win32.isAbsolute(n)||n.startsWith(`\\\\`))return null;let r=E.win32.parse(n);return!/^[A-Za-z]:\\$/.test(r.root)||n.length<=r.root.length?null:n}function getEnvValueCaseInsensitive(e,t){let n=e[t];if(n!==void 0)return n;let r=t.toUpperCase(),i=Object.keys(e).find(e=>e.toUpperCase()===r);return i?e[i]:void 0}function queryWindowsRegistryValue(e,t,n){let r=locateWindowsRegExe();if(!r)return null;for(let i of[[`/reg:64`],[]]){let a=n===void 0?Bh:Math.min(Bh,Math.ceil(n-performance.now()));if(a<=0)return null;assertAppContainerSpawnSupported();try{let n=h(r,[`query`,e,`/v`,t,...i],{env:resolveDiagnosticProcessEnv(),encoding:`utf8`,stdio:[`ignore`,`pipe`,`ignore`],timeout:a,windowsHide:!0}),s=RegExp(`^\\s*${escapeRegExp(t)}\\s+REG_[A-Z0-9_]+\\s+(.+)$`,`im`),c=n.match(s)?.[1]?.trim();if(c)return c}catch{}}return null}function resolveSystemRootFromEnv(e){return normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(e,`SystemRoot`))??normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(e,`WINDIR`))??Rh}function getProcessRoots(e){if(!Vh){let t={};for(let e of[`SystemRoot`,`WINDIR`,`ProgramFiles`,`ProgramFiles(x86)`,`ProgramW6432`])t[e]=getEnvValueCaseInsensitive(process.env,e);let n={env:t,systemRoot:normalizeWindowsInstallRoot(queryWindowsRegistryValue(zh,`SystemRoot`,e)??void 0)??resolveSystemRootFromEnv(t)};if(e!==void 0&&performance.now()>=e)return n;Vh=n}return Vh}function getWindowsSystemRoot(e,t){if(e!==process.env)return resolveSystemRootFromEnv(e);let n=getProcessRoots(t);return n.installRoots?.systemRoot??n.systemRoot}function getWindowsPowerShellExePath(e=process.env,t){return E.win32.join(getWindowsSystemRoot(e,t),`System32`,`WindowsPowerShell`,`v1.0`,`powershell.exe`)}var Rh,zh,Bh,Vh,Hh=__esmMin((()=>{pa(),mm(),mt(),Yg(),Rh=`C:\\Windows`,zh=`HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion`,Bh=5e3,Vh=null}));function readWindowsUserSid(){if(process.platform===`win32`)try{let e=_(getWindowsPowerShellExePath(),[`-NoProfile`,`-NonInteractive`,`-Command`,`[Security.Principal.WindowsIdentity]::GetCurrent().User.Value`],{encoding:`utf8`,windowsHide:!0,timeout:5e3}),t=e.stdout?.trim();return!e.error&&e.status===0&&/^S-1-\d+(?:-\d+)+$/.test(t)?t:void 0}catch{return}}var Uh=__esmMin((()=>{Hh()})),Wh=/* @__PURE__ */ __exportAll({inspectOtherOpenClawProcesses:()=>inspectOtherOpenClawProcesses});function isStandardSystemdUserManager(e){let t=e&&`argv`in e?e.argv:[];return t.length<=3&&t[1]===`--user`&&t.slice(2).every(e=>/^--deserialize=\d+$/u.test(e))&&(t[0]===`/usr/lib/systemd/systemd`||t[0]===`/lib/systemd/systemd`)}function isStandardSystemdLoginProcess(e,t,n){return process.platform!==`linux`||n===void 0||e?.uid!==n||!(`argv`in e)?!1:isStandardSystemdUserManager(e)||e.argv.length===1&&e.argv[0]===`(sd-pam)`&&t?.uid===e.uid&&isStandardSystemdUserManager(t)}function isGatewayProcess(e,t){if(E.basename((e[0]??``).replaceAll(`\\`,`/`)).replace(/\.(exe|cmd|bat)$/iu,``)===`openclaw-gateway`)return!0;if(t.kind!==`openclaw`||t.entryIndex===void 0)return!1;let n=(e[t.entryIndex]??``).replaceAll(`\\`,`/`);return Kh.some(e=>n.endsWith(`/${e}`))||getRootOptionAwareCommandPath(rewriteUpdateFlagArgv([`node`,...e.slice(t.entryIndex)]),1)[0]===`gateway`}function classifyProcessArtifactCustody(e,t,n){if(!e)return{kind:`unknown`,reason:`process command is unavailable`};let r=`argv`in e?e.argv:[],i=[...r.map(e=>e.replace(/^--[^=]+=/u,``).replace(/^-r(?=.)/u,``)),n??``,`executable`in e?e.executable??``:``].filter(referencesRetainedArtifact);if(`argvUnavailable`in e||r.length===0)return i.length?{kind:`holder`}:{kind:`not-holder`};let{position:a,operands:s}=resolveRuntimeScriptPosition(r),c={pid:t,cwd:n??``,serviceMarker:e.serviceMarker,serviceMarkerUnavailable:e.serviceMarkerUnavailable,additionalEntrypoints:Gh,inspectPackage:!0},l,u=i.flatMap(e=>{let t=classifyOpenClawEntrypointPath(e,c);return t.kind===`openclaw`&&t.artifactPath?[t.artifactPath]:(l??=t.kind===`unclassified`?t.reason:`runtime path is unresolved`,[])});if(i.length&&s.length===0)return l?{kind:`unknown`,reason:l}:{kind:`holder`,paths:u};let d=classifyOpenClawArgv(r,c),f=process.getuid?.(),p=process.platform===`linux`&&d.kind===`unclassified`&&d.cause===`service-marker`&&e.uid!==void 0&&f!==void 0&&e.uid!==f,m=isGatewayProcess(r,d),h=i.length>0||u.length>0,unscoped=()=>h||!m?{kind:`holder`}:{kind:`holder`,gateway:!0};if(d.kind===`openclaw`){if(!d.artifactPath)return s.some(({module:e})=>e)?{kind:`holder`}:unscoped();u.push(d.artifactPath),h=!0}let g=u.length?{kind:`holder`,paths:u}:void 0;if(l??=d.kind===`unclassified`&&d.cause!==`runtime-syntax`?d.reason:void 0,!n||!E.isAbsolute(n)){if(d.kind===`other`&&typeof a!=`number`&&a.kind===`not-runtime`&&i.length===0)return{kind:`not-holder`};if(!p)return{kind:`unknown`,reason:l??`working directory is unavailable`}}let _=n&&E.isAbsolute(n)&&typeof a!=`number`&&a.kind!==`not-runtime`?readProcessPackageIdentity(n,!0):void 0;_?.kind===`package`&&_.name===`openclaw`&&(g=unscoped());let v=_?.kind===`package`?_.scripts:{};_?.kind===`unknown`&&(l??=_.reason);for(let{value:e,module:t}of s){let n=e;if(t){if(e.startsWith(`file:`))try{n=j(e)}catch(e){l??=String(e);continue}else if(!E.isAbsolute(e)&&!e.startsWith(`./`)&&!e.startsWith(`../`)){l??=`runtime module package identity is unavailable`;continue}}else if(isBunRuntime(r[0]??``)&&!/[\\/]/u.test(e)&&!E.extname(e)&&typeof v[e]==`string`&&v[e].trim())continue;let i=classifyOpenClawEntrypointPath(n,c);i.kind===`unclassified`?l??=i.reason:i.kind===`openclaw`&&(h||=i.artifactPath!==void 0,g=i.artifactPath&&(!g||g.paths)?{kind:`holder`,paths:[...g?.paths??[],i.artifactPath]}:unscoped())}return p&&!h&&!g?{kind:`not-holder`}:l?{kind:`unknown`,reason:l}:g??{kind:`not-holder`}}function classifyOpaqueWindowsCustody(e,t){let n=e.commandLine?parseWindowsNativeCommandLine(e.commandLine):null;if(n?.length)return classifyProcessArtifactCustody({argv:n,...e.executable?{executable:e.executable}:{}},t,e.cwd);if([e.executable,e.cwd].some(e=>e&&referencesRetainedArtifact(e)))return{kind:`holder`};if(e.foreignOwner||e.accessDenied)return{kind:`not-holder`};let r=e.executable;return r&&!isNodeRuntime(r)&&!isBunRuntime(r)&&!/openclaw/iu.test(E.win32.basename(r))?{kind:`not-holder`}:{kind:`unknown`,reason:`process command line is unavailable`}}function classifyWindowsHandoffAncestry(e,t,n){let r=e.startIdentity;if(r&&n.length&&n.every(({startIdentity:e})=>/^\d+$/.test(e)&&BigInt(e)>BigInt(r)))return`unrelated`;let i=/* @__PURE__ */ new Set,a=e;for(;a.startIdentity&&!i.has(a.pid);){let e=a.startIdentity;if(i.add(a.pid),n.some(({pid:t,startIdentity:n})=>t===a.pid&&n===e||t===a.parentPid&&/^\d+$/.test(n)&&BigInt(n)<=BigInt(e)))return`descendant`;if(a.parentPid===0||a.parentPid===4)return`unrelated`;let r=t.get(a.parentPid??0);if(!r?.startIdentity||BigInt(r.startIdentity)>BigInt(e))break;a=r}return`unknown`}function inspectOtherOpenClawProcesses(e){let t=typeof e==`object`?e:void 0,n=typeof e==`string`?e:void 0,r=[],i={matchingPids:[],unverifiedPids:[]};try{if(process.platform===`linux`&&isContainerEnvironment())throw Error(`Host process visibility cannot be established from this container. Run Doctor on the host after stopping OpenClaw containers that share its temporary directory.`);let e=process.platform===`win32`,a=Date.now()+(t?15e3:1e3),s=e?[...readWindowsProcessCensus(15e3)]:void 0,c=new Map(s?.map(e=>[e.pid,e])),l=e&&t?.windowsUserSid!==void 0&&readWindowsUserSid()===t.windowsUserSid,u=s?.map(({pid:e,parentPid:t,commandLine:n})=>{let r=n?parseWindowsNativeCommandLine(n):null;return{pid:e,state:``,command:r?.length&&t!==void 0?{ppid:t,argv:r}:void 0}})??[...readProcessGroupMembers(t?15e3:1e3,{readDarwinCommand:t?(e,t)=>readDarwinProcessCommand(e,t,{serviceMarker:!1}):readDarwinProcessCommand})],d=new Map(u.map(e=>[e.pid,e])),f=d.get(process.pid);if(!f||!t&&(!f.command&&process.platform!==`darwin`||process.platform===`linux`&&u.some(e=>e.command&&!(`argv`in e.command))))throw Error(`OpenClaw process census is incomplete.`);let p=s?new Map(s.map(({pid:e,cwd:t})=>[e,t])):readProcessWorkingDirectories(u.map(({pid:e})=>e)),m=/* @__PURE__ */ new Set,h=!t&&isUpdateCommandArgv(process.argv),g=/* @__PURE__ */ new Set([process.pid]),_=f,v=f.command?.ppid??f.ppid??0;for(;v>0;){let n=d.get(v);if(!n?.command||g.has(v)){if(t||(n?!n.command:e))break;throw Error(`OpenClaw process ancestry is incomplete.`)}let r=c.get(v)?.startIdentity,i=c.get(_.pid)?.startIdentity;if(e&&(!r||!i||BigInt(r)>=BigInt(i)))break;if(g.add(v),`argv`in n.command){let{argv:e,serviceMarker:r,serviceMarkerUnavailable:i}=n.command,a=classifyOpenClawArgv(e,{pid:v,serviceMarker:r,serviceMarkerUnavailable:i,cwd:p.get(v)??``,additionalEntrypoints:Gh}),s=a.kind===`openclaw`&&a.entryIndex!==void 0?getRootOptionAwareCommandPath(rewriteUpdateFlagArgv([`node`,...e.slice(a.entryIndex)]),1)[0]:void 0;(s===(t?`update`:`doctor`)||h&&s===`update`&&v===(f.command?.ppid??f.ppid))&&m.add(v)}_=n,v=n.command.ppid}let normalize=t=>e?t.replaceAll(`\\`,`/`).replace(/\/{2,}\?\/UNC\//gi,`//`).replace(/\/{2,}\?\//g,``).replace(/\/{2,}/g,`/`).toLowerCase():t,literal=e=>escapeRegExp(normalize(e)),referencePattern=n=>{let r=n.flatMap(t=>[t.replace(/[\\/]+$/,``),He(t,{windows:e}).href]);return RegExp(`(?:^|[^\\w-])(?:${t?literal(t.runId):`(?!)`}(?=$|[^\\w-])|(?:${r.map(literal).join(`|`)||`(?!)`})(?=$|[/\\s"'\x60);,\\]]))`)},y=t?.artifactPaths??(n?[n]:[]),b=referencePattern(y),rootKey=e=>normalize(e.replace(/[\\/]+$/,``)),x=new Set(t?.sharedRoots?.map(rootKey)),S=referencePattern(y.filter(e=>!x.has(rootKey(e)))),C=process.getuid?.(),outsideHandoffFamily=(e,t)=>{let n;try{n=ae(e,{throughPid:process.pid})}catch{return!1}return n?.stoppedBy===`through-pid`||t!==void 0&&n?.stoppedBy===`root`&&n.chain.every(e=>{let n=d.get(e.pid)?.command;return e.startTimeMicros>t*1e3||process.platform===`linux`&&n?.uid===C&&isStandardSystemdUserManager(n)})},predatesHandoffDrivers=e=>{if(process.platform!==`linux`||!t?.drivers?.length)return!1;let n=readLinuxProcessStat(e)?.startedAt;return n!==void 0&&t.drivers.every(({startIdentity:e})=>BigInt(e)>BigInt(n))};for(let{pid:s,state:f,command:h}of u){if(t&&Date.now()>=a)throw Error(`Process census deadline exceeded`);if(s===process.pid||m.has(s)||(f?.startsWith(`Z`)||t)&&isPidDefinitelyDead(s))continue;let u=h&&`argv`in h?h.argv:void 0;if(t){if(!e&&u?.length===0)continue;let n=c.get(s),a=p.get(s),f=[...u??[],n?.commandLine??``,n?.executable??``,a??``],m=classifyOpenClawArgv(u??[n?.executable??``],{pid:s,cwd:a??``,serviceMarker:h&&`argv`in h?h.serviceMarker:void 0,additionalEntrypoints:Gh});if(f.some(e=>b.test(normalize(e)))||!t.artifactPathsOnly&&m.kind===`openclaw`){outsideHandoffFamily(s,f.some(e=>S.test(normalize(e)))?void 0:t.familyDeadline)||i.matchingPids.push(s);continue}let g=t.familyExited?`unrelated`:n&&classifyWindowsHandoffAncestry(n,c,t.drivers??[]);if(g===`descendant`){i.matchingPids.push(s);continue}if(g===`unrelated`||l&&n?.accessDenied)continue;let _=n?.foreignOwner||h?.owner===`different`||h?.uid!==void 0&&C!==void 0&&h.uid!==C;if((!u||a===void 0)&&!_&&!isStandardSystemdLoginProcess(h,d.get(h?.ppid??0)?.command,C)&&!outsideHandoffFamily(s)&&!predatesHandoffDrivers(s)){i.unverifiedPids.push(s);let t=n?.executable??u?.[0];r.push(`Could not verify handoff ancestry for PID ${s} (${t?(e?E.win32:E).basename(t):`image unavailable`}).`)}continue}let g=c.get(s),_=g&&!h?classifyOpaqueWindowsCustody(g,s):classifyProcessArtifactCustody(h,s,p.get(s));_.kind!==`not-holder`&&(_.kind===`holder`&&n&&(_.paths?!_.paths.some(e=>b.test(normalize(e))):_.gateway)||(i.matchingPids.push(s),_.kind===`unknown`&&r.push(`Could not verify runtime custody for PID ${s}: ${_.reason}`)))}}catch(e){let n=/Could not classify PID (\d+):/.exec(e instanceof Error?e.message:``);t&&n&&i.unverifiedPids.push(Number(n[1])),i.error=t?isRosettaTranslatedProcess()?`Host process census is unavailable under Rosetta; run openclaw update repair with native arm64 Node.js.`:`Host process census is incomplete; verify process-inspection permissions and retry update repair.`:`Could not inspect OpenClaw processes: ${String(e)}`}return t?{...i,...r.length?{warnings:r}:{}}:i.error?{error:i.error}:{pids:i.matchingPids,...r.length?{warnings:r}:{}}}var Gh,Kh,qh=__esmMin((()=>{Vl(),Ch(),en(),wh(),wt(),pa(),Eh(),Ah(),Mh(),Ih(),Fl(),Lh(),Uh(),Gh=Object.values(Pl).flatMap(e=>[E.posix.normalize(`src/infra/${e.sourceWorkerName}.ts`),`dist/${e.distWorkerPath}`]),Kh=[Pl.spawnBroker,Pl.directoryWatchHost,Pl.serviceChildWindowsJobAnchor].flatMap(e=>[E.posix.normalize(`src/infra/${e.sourceWorkerName}.ts`),`dist/${e.distWorkerPath}`])})),Jh=/* @__PURE__ */ __exportAll({maintainRetainedUpdateRuntimes:()=>maintainRetainedUpdateRuntimes,registerRetainedUpdateRuntime:()=>registerRetainedUpdateRuntime,removeTemporaryArtifacts:()=>removeTemporaryArtifacts,reportRetainedUpdateRuntime:()=>reportRetainedUpdateRuntime,resolveRetainedUpdateRuntimeParents:()=>resolveRetainedUpdateRuntimeParents});function registerRetainedUpdateRuntime(e){return Xh.add(e),()=>void Xh.delete(e)}function reportRetainedUpdateRuntime(e,t){let n=`Runtime retained at ${e}: ${t}`;try{Yh.warn(n)}catch{}return n}function resolveRetainedUpdateRuntimeParents(e,t=[]){let n=e.split(E.sep),r=n.indexOf(`node_modules`),i=[n.slice(0,r>=0?r+1:n.length).join(E.sep),...t],a=E.dirname(e),s=[a];for(;i.some(e=>le(e,a));){let e=E.dirname(a);if(e===a)break;a=e,s.push(a)}return s}async function isRetainedRuntimeMarker(e){if(await O.realpath(e).catch(()=>void 0)!==e)return!1;let t=JSON.parse(await O.readFile(e,`utf8`));return isRecord(t)&&t.name===`openclaw`}async function recognizesRetainedRuntime(e,t){let n=E.parse(t).root,r=E.join(e,`tree`,Buffer.from(n).toString(`hex`)),i=E.join(r,E.relative(n,t));if(await isRetainedRuntimeMarker(E.join(i,`package.json`)))return!0;let a=E.dirname(i),s=E.dirname(a),c=E.dirname(s);if(E.basename(i)!==`openclaw`||E.basename(a)!==`node_modules`||!E.basename(s).startsWith(`openclaw@`)||E.basename(c)!==`.pnpm`||await O.realpath(c).catch(()=>void 0)!==c)return!1;let l=0;for await(let e of await O.opendir(c)){if(++l>4096)throw Error(`retained pnpm version inventory exceeds the bounded lookup; inspect it before manual cleanup`);if(e.isDirectory()&&e.name.startsWith(`openclaw@`)&&await isRetainedRuntimeMarker(E.join(c,e.name,`node_modules/openclaw/package.json`)))return!0}return!1}async function maintainRetainedUpdateRuntimes(e){let t=[],n=e.packageRoots.map(resolveIdentityPathViaExistingAncestorSync),r=new Set([k.tmpdir(),...e.temporaryDirectories??[],...n.flatMap(e=>resolveRetainedUpdateRuntimeParents(e))].map(resolveIdentityPathViaExistingAncestorSync));for(let i of r)try{for(let r of await O.readdir(i,{withFileTypes:!0})){if(!/^openclaw-update-runtime-[A-Za-z0-9]{6}$/u.test(r.name))continue;let a=E.join(i,r.name);try{let r=await O.lstat(a);if(!r.isDirectory()||process.getuid&&r.uid!==process.getuid())throw Error(`directory ownership is unknown; inspect it before manual cleanup`);if(Xh.has(a))throw Error(`the creating update still owns this runtime`);let i=!1;for(let e of n)if(await recognizesRetainedRuntime(a,e)){i=!0;break}if(!i)throw Error(`no recognized runtime marker; inspect it before manual cleanup`);if(!e.repair){t.push(`Runtime retained at ${a}: run \`openclaw doctor --fix\` after its workers stop`);continue}let{inspectOtherOpenClawProcesses:s}=await Promise.resolve().then(()=>(qh(),Wh)),c=await O.lstat(a);if(c.dev!==r.dev||c.ino!==r.ino||c.ctimeMs!==r.ctimeMs||Xh.has(a))throw Error(`directory identity or custody changed`);e.assertCurrent();let l=s(a);if(`error`in l)throw Error(l.error);for(let e of l.warnings??[])t.includes(e)||t.push(e);if(l.pids.length)throw Error(`other OpenClaw processes are still running (PIDs: ${l.pids.join(`, `)}); let these holders finish, then rerun openclaw doctor --fix`);e.assertResourcesSettled?.(a),e.assertCurrent();let u;await removeTemporaryArtifacts(a,`Updater runtime`,e=>{u=`cleanup failed: ${formatErrorMessage(e)}`}),t.push(u?reportRetainedUpdateRuntime(a,u):`Removed abandoned updater runtime: ${a}`)}catch(e){T(e,`ENOENT`)||t.push(reportRetainedUpdateRuntime(a,formatErrorMessage(e)))}}}catch(e){T(e,`ENOENT`)||t.push(`Cannot inspect updater runtimes in ${i}: ${formatErrorMessage(e)}`)}return t}function removeTemporaryArtifacts(e,t,n=n=>Yh.warn(truncateUtf16Safe(formatErrorMessage(`${t} cleanup failed; files may remain in ${e}. After the worker or session stops, check permissions and remove the retained directory: ${formatErrorMessage(n)}`),1024))){return runBestEffortCleanup({cleanup:()=>O.rm(e,{recursive:!0,force:!0}),onError:n})}var Yh,Xh,Zh=__esmMin((()=>{B(),Yn(),Wg(),R(),L(),Nf(),bh(),mm(),Qi(),Yh=createSubsystemLogger(`infra:temp-artifacts`),Xh=resolveGlobalSingleton(Symbol.for(`openclaw.retainedUpdateRuntimes`),()=>/* @__PURE__ */ new Set)}));function createWorkerTaskHost(e={},t){let n=t&&t!==`writer`&&t!==`singleton`,r=e.retainedTransport?e.nativeSource??captureRetainedNativeWorkerSource({runtimeGeneration:void 0}):void 0;return{maxWorkers:t?resolveWorkerPoolSize(t):void 0,requiresReady:e.retainedTransport,createWorker(t,i){let a={execArgv:resolveRuntimeWorkerThreadExecArgv(t),...i};if(a.env===void 0&&(a.env=resolveNodeCompileCacheEnv()),n){let e=a.resourceLimits;a.resourceLimits={maxOldGenerationSizeMb:e?.maxOldGenerationSizeMb??512,maxYoungGenerationSizeMb:e?.maxYoungGenerationSizeMb,codeRangeSizeMb:e?.codeRangeSizeMb,stackSizeMb:e?.stackSizeMb}}if(e.retainedTransport){let{port1:n,port2:i}=new M,s=createRetainedNativeWorker(t,a,r,e.nativeResource,{host:n,worker:i});return{worker:s,native:s}}return{worker:createCpuTrackedWorker(t,a)}},serviceNativeWorkers(e){for(let{owner:e}of eg.values())e.service();e[0]?.service()},prepareResources:$h,async releaseTemporaryDirectory(e){let{removeTemporaryArtifacts:t}=await $h();await t(e,`Worker task`)},captureTaskContext(e){let t=eg.get(e);t||(t={owner:runInDetachedAsyncContext(()=>createSqliteDatabaseAdmissionRelay(()=>{if(eg.get(e)?.retiring!==!1)throw Error(`SQLite creation relay's task worker is retiring`)})),sent:!1,retiring:!1},eg.set(e,t));let n=getDatabaseEngineSelection(),r={collectWorkerMetrics:isWorkerGcObservationEnabled(),...n?{databaseEngineSelection:n}:{},deletedAgentDatabaseFences:captureDeletedAgentDatabaseFences(),databaseAdmissionDeadlineAtMs:readSqliteDatabaseAdmissionDeadline(),...t.sent?{}:{databaseAdmissionPort:t.owner.port}};return t.postgresSent||(r.postgresPool=createPostgresPoolEndpoints(),t.postgresSent=r.postgresPool!==void 0),t.sent=!0,r},taskContextTransferList(e){let t=e,n=postgresPoolTransferList(t.postgresPool);return t.databaseAdmissionPort?[t.databaseAdmissionPort,...n]:n},createTaskObserver(e){let t=workerRequestKind(e);return e=>trackWorkerRequest(t,e===void 0?`task`:classifyWorkerRequest(e))},describeTask(e,t,n){if(n!==void 0){let t=Qh.has(n)?n:classifyWorkerRequest(n);return`${workerRequestKind(e)}.${t}`}let r=typeof t==`object`&&t?Object.getOwnPropertyDescriptor(t,`kind`)?.value:void 0,i=typeof r==`string`&&Qh.has(r)?r:`task`;return`${workerRequestKind(e)}.${i}`},receiveMessage:receiveWorkerMemoryPort,observeResourceReply:()=>recordWorkerMessage(`resource`,`from_worker`),captureWorkerStartObserver,workerStarted(e,n){trackSqliteDatabaseAdmissionWorker(e),attributeWorkerToPool(e,n,t)},workerRetiring(e,t){let n=eg.get(e);n&&(n.retiring=!0),markWorkerRetirement(e,t)},workerStopped(e){let t=eg.get(e);if(t){t.retiring=!0;let n=t.owner.finish();if(n)return n.then(()=>{eg.delete(e)});eg.delete(e)}},flushWorkerDiagnostics,computeCapacity:getWorkerComputeCapacity(),pools:vh}}var Qh,$h,eg,tg=__esmMin((()=>{Nt(),R(),_u(),yu(),Su(),Mu(),Hd(),Hl(),Zp(),pm(),Sm(),Yu(),Rd(),Zu(),th(),nh(),fh(),Zm(),ph(),yh(),Qh=/* @__PURE__ */ new Set([`prepare`,`prepare-session`,`transcript-stats`,`session-entries`,`session-cleanup`,`session-memory-capture`,`history-page`,`historical-eviction-candidates`,`usage-cost`,`model-context`,`context-messages`,`transcript-search`,`session-target-prepare`,`session-store-target`,`session-target-inventory`,`combined-store-topology`]),$h=createLazyRuntimeModule(()=>Promise.resolve().then(()=>(Zh(),Jh))),eg=resolveGlobalSingleton(Symbol.for(`openclaw.workerTaskDatabaseAdmissionChannels`),()=>/* @__PURE__ */ new Map)})),WorkerTaskPool,ng=__esmMin((()=>{hu(),tg(),WorkerTaskPool=class{constructor(e){this.core=new WorkerTaskPoolCore(e,createWorkerTaskHost(void 0,e.workerClass),{close:e=>this.close(e),getSnapshot:()=>this.getSnapshot()})}run(e,t){return this.core.run(e,t)}get isClosed(){return this.core.isClosed}getSnapshot(){return this.core.getSnapshot()}retryFailedRetirements(){return this.core.retryFailedRetirements()}rotate(){return this.core.rotate()}close(e,t){return this.core.close(e,t)}}})),rg=/* @__PURE__ */ __exportAll({runFileLogIOInWorker:()=>runFileLogIOInWorker});async function runFileLogIOInWorker(e,t){let n=resolveGlobalSingleton(Symbol.for(`openclaw.fileLogWorker`),()=>({}),async e=>{await t(),await e.pool?.close(),e.pool=void 0});return await(n.pool??=new WorkerTaskPool({workerUrl:resolveRuntimeProcessEntrypointUrl(`fileLog`),workerClass:`writer`})).run(e,{inputBytes:Buffer.byteLength(e.file)+(e.type===`append`?Buffer.byteLength(e.payload):0)})}var ig=__esmMin((()=>{Wl(),ng(),R()}));async function runFileLogIO(e){if(!N)return await executeFileLogIO(e);let{runFileLogIOInWorker:t}=await Promise.resolve().then(()=>(ig(),rg));return t(e,()=>bg.flush())}function resolveTarget(e,t=!1){let n=e.defaultRoot;if(!n)return t?e.file:Promise.resolve(e.file);if(n.directory!==void 0){let r=E.join(n.directory,e.file);return t?r:Promise.resolve(r)}if(t){let t=resolveDefaultFileLogTarget(e.file,n.options);return n.directory=E.dirname(t),t}return(n.resolution??=runFileLogIO({type:`resolveDefault`,file:e.file,root:n.options}).then(e=>n.directory=E.dirname(e)).catch(e=>{throw n.resolution=void 0,e})).then(t=>E.join(t,e.file))}function prepareTarget(e,t){if(e.prepared)return t?void 0:Promise.resolve();if(t)try{prepareFileLogTarget(resolveTarget(e,!0),e.rolling),e.prepared=!0}catch{}else return e.ready??=resolveTarget(e).then(t=>runFileLogIO({type:`prepare`,file:t,rolling:e.rolling})).then(()=>{e.prepared=!0}).catch(()=>{e.ready=void 0})}function getCurrentLogFileBytesSync(e){try{return v.statSync(e).size}catch{return 0}}function buildDroppedMarker(e,t){let n=/* @__PURE__ */ new Date,r=`[openclaw] file log queue overflow; dropped ${t} oldest record${t===1?``:`s`}`,i={0:r,_meta:{date:n,hostname:e.hostname,logLevelName:`WARN`,name:`openclaw`},time:formatTimestamp(n,{style:`long`}),hostname:e.hostname,message:r,dropped:t};return{...e,payload:`${JSON.stringify(i)}\n`}}function writeFileTransportWarning(e,t){try{let n=`${formatConsoleDiagnosticLine({level:`warn`,message:redactSensitiveText(e)})}\n`;return t?v.writeSync(process.stderr.fd,n):process.stderr.write(n),!0}catch{return!1}}function warnAboutRotationFailure(e,t){_g.get(e.file)!==e.maxFileBytes&&(_g.set(e.file,e.maxFileBytes),writeFileTransportWarning(`[openclaw] log file rotation failed; continuing writes file=${e.file} maxFileBytes=${e.maxFileBytes}`,t))}function warnAboutAppendFailure(e,t){if(vg.has(e.file))return;let n=vg.size>=sg;n&&yg||writeFileTransportWarning(n?`[openclaw] log file append failure diagnostics saturated; suppressing new file targets`:`[openclaw] log file append failed; records dropped; check that the path is a writable regular file; file=${e.file}`,t)&&(n?yg=!0:vg.add(e.file))}function clearAppendFailure(e){vg.delete(e.file)&&(yg=!1)}function claimQueuedEntries(){let e=cg===0?Q:[...Q.slice(cg),...Q.slice(0,cg)];return Q=[],cg=0,dg>0&&fg&&e.unshift(buildDroppedMarker(fg,dg)),dg=0,fg=null,e}function prepareWrite(e,t,n,r,i){let a=Buffer.byteLength(e.payload,`utf8`),s=i+1;if(n)return{payload:e.payload,payloadBytes:a,nextIndex:s};let c=[e.payload];for(;s<r.length;s+=1){let n=r[s];if(!n||n.file!==e.file||n.maxFileBytes!==e.maxFileBytes||n.targetPreparation!==e.targetPreparation)break;let i=Buffer.byteLength(n.payload,`utf8`);if(a+i>og||t+a+i>e.maxFileBytes)break;c.push(n.payload),a+=i}return{payload:c.join(``),payloadBytes:a,nextIndex:s}}async function writeEntries(e){let t=/* @__PURE__ */ new Map;for(let n=0;n<e.length;){if(hg)return;let r=e[n];if(!r)return;let i;try{i=r.targetPreparation?await resolveTarget(r.targetPreparation):r.file}catch{warnAboutAppendFailure(r,!1),r.payload=``,ug=++n;continue}r.targetPreparation&&await prepareTarget(r.targetPreparation,!1);let a=t.get(i);if(!a){if(a={bytes:await runFileLogIO({type:`size`,file:i}).catch(()=>0)},hg)return;t.set(i,a)}let s=a.bytes>0&&a.bytes+Buffer.byteLength(r.payload)>r.maxFileBytes,c=prepareWrite(r,s?0:a.bytes,!1,e,n);ug=c.nextIndex;try{let e=await runFileLogIO({type:`append`,file:i,payload:c.payload,rotate:s});e.rotation===`rotated`?(a.bytes=0,_g.delete(r.file)):e.rotation===`failed`&&warnAboutRotationFailure(r,!1),e.appended?(a.bytes+=c.payloadBytes,clearAppendFailure(r)):warnAboutAppendFailure(r,!1)}catch{t.delete(i),warnAboutAppendFailure(r,!1)}finally{for(let t of e.slice(n,c.nextIndex))t.payload=``;n=c.nextIndex}}}function writeEntriesSync(e){let t=/* @__PURE__ */ new Map;for(let n=0;n<e.length;){let r=e[n];if(!r)return;let i;try{i=r.targetPreparation?resolveTarget(r.targetPreparation,!0):r.file}catch{warnAboutAppendFailure(r,!0),r.payload=``,n++;continue}let a=t.get(i);a||(a={bytes:getCurrentLogFileBytesSync(i)},t.set(i,a)),r.targetPreparation&&prepareTarget(r.targetPreparation,!0),a.bytes>0&&a.bytes+Buffer.byteLength(r.payload)>r.maxFileBytes&&(rotateLogFile(i)?(a.bytes=0,_g.delete(r.file)):warnAboutRotationFailure(r,!0));let s=prepareWrite(r,a.bytes,!0,e,n);try{c({filePath:i,content:s.payload}),a.bytes+=s.payloadBytes,clearAppendFailure(r)}catch{warnAboutAppendFailure(r,!0)}r.payload=``,n=s.nextIndex}}async function runFlushLoop(){for(;;){if(hg)return;let e=claimQueuedEntries();if(e.length===0)return;lg=e,ug=0,await writeEntries(e),lg=null,ug=0}}function startFlush(){if(mg||hg)return;let e=runFlushLoop().catch(()=>void 0);mg=e,e.then(()=>{mg=null,(Q.length>0||dg>0)&&scheduleFlush()})}function scheduleFlush(){pg||mg||hg||(pg=setImmediate(()=>{pg=null,startFlush()}))}function handleProcessBeforeExit(){flushFileLogQueue()}function handleProcessExit(){hg=!0,drainFileLogQueueSync()}function installProcessHooks(){gg||(gg=!0,process.on(`beforeExit`,handleProcessBeforeExit),registerProcessExitCleanup(handleProcessExit))}function enqueueFileLog(e){if(hg)writeEntriesSync([e]);else{if(installProcessHooks(),Q.length>=ag){let t=Q[cg];t&&(t.payload=``,fg??=t,dg+=1),Q[cg]=e,cg=(cg+1)%Q.length}else Q.push(e);scheduleFlush()}}async function flushFileLogQueue(){for(;;){pg&&=(clearImmediate(pg),null),!mg&&(Q.length>0||dg>0)&&startFlush();let e=mg;if(!e)return;await e}}function drainFileLogQueueSync(){pg&&=(clearImmediate(pg),null);let e=lg?lg.slice(ug):[];lg=null,ug=0,e.push(...claimQueuedEntries()),writeEntriesSync(e)}var ag,og,sg,Q,cg,lg,ug,dg,fg,pg,mg,hg,gg,_g,vg,yg,bg,xg=__esmMin((()=>{ua(),Cl(),R(),ul(),El(),il(),ll(),ag=4096,og=65536,sg=64,Q=[],cg=0,lg=null,ug=0,dg=0,fg=null,pg=null,mg=null,hg=!1,gg=!1,_g=/* @__PURE__ */ new Map,vg=/* @__PURE__ */ new Set,yg=!1,bg=resolveGlobalSingleton(Symbol.for(`openclaw.fileLogTransport`),()=>(process.env.VITEST!==`true`&&installProcessHooks(),{prepareTarget:(e,t,n=!1)=>({file:e,rolling:t,prepared:!1,...n?{defaultRoot:typeof n==`boolean`?{options:{stateDir:resolveStateDir()}}:n}:{}}),resolveTarget,drainSync:drainFileLogQueueSync,enqueue:enqueueFileLog,flush:flushFileLogQueue}))}));function encodeLogProfileSegment(e){let t=``;for(let n of e)/^[a-z0-9]$/u.test(n)?t+=n:n===`-`?t+=`--`:n===`_`?t+=`-0`:/^[A-Z]$/u.test(n)?t+=`-1${n.toLowerCase()}`:t+=`-2${n.codePointAt(0)?.toString(16)??`0`}-`;return t}function resolveLogProfileSegment(){let e=process.env.OPENCLAW_PROFILE?.trim();if(!e||e.toLowerCase()==="default")return null;let t=encodeLogProfileSegment(e);return t.length<=Cg?t:`-3${me(`sha256`).update(e).digest(`hex`)}`}function resolveDefaultRollingLogFileName(){let e=/* @__PURE__ */ new Date,t=resolveLogProfileSegment(),n=t?`-${t}`:``;return`${yl}${n}-${formatLocalDate(e)}${bl}`}function isLegacyRollingLogFilePath(e){let t=E.basename(e);return t===`openclaw-YYYY-MM-DD.log`||Sg.exec(t)?.[1]===`openclaw`}function resolveRollingLogFilePathForDate(e,t){let n=Sg.exec(E.basename(e));return n?E.join(E.dirname(e),`${n[1]}-${formatLocalDate(t)}${bl}`):isLegacyRollingLogFilePath(e)?E.join(E.dirname(e),`${yl}-${formatLocalDate(t)}${bl}`):e}var Sg,Cg,wg=__esmMin((()=>{xl(),xg(),Sg=/^(openclaw(?:-[a-z0-9-]+)?)-(\d{4}-\d{2}-\d{2})\.log$/u,Cg=220}));function clampLogText(e,t){return e.length>t?`${truncateUtf16Safe(e,t)}...(truncated)`:e}function sanitizeDiagnosticLogText(e,t){return clampLogText(redactSensitiveText(clampLogText(e,t)),t)}function normalizeDiagnosticLogName(e){if(!e||e.trim().startsWith(`{`))return;let t=sanitizeDiagnosticLogText(e.trim(),Mg);return Pg.test(t)?t:void 0}function assignDiagnosticLogAttribute(e,t,n,r){if(t.count>=Ag)return;let i=n.trim();if(isBlockedObjectKey(i)||redactSensitiveText(i)!==i||!Pg.test(i))return;let a;if(typeof r==`string`)a=sanitizeDiagnosticLogText(r,jg);else if(typeof r==`boolean`||typeof r==`number`&&Number.isFinite(r))a=r;else return;e[i]=a,t.count+=1}function addDiagnosticLogAttributesFrom(e,t,n){if(n)for(let r in n){if(t.count>=Ag)break;Object.hasOwn(n,r)&&r!==`trace`&&assignDiagnosticLogAttribute(e,t,r,n[r])}}function isPlainLogRecordObject(e){if(!isRecord(e))return!1;let t=Object.getPrototypeOf(e);return t===Object.prototype||t===null}function extractTraceContext(e){return normalizeDiagnosticTraceContext(e)??normalizeDiagnosticTraceContext(asOptionalRecord(e)?.trace)}function getSortedNumericLogEntries(e){return Object.entries(e).filter(([e])=>/^\d+$/.test(e)).toSorted((e,t)=>Number(e[0])-Number(t[0]))}function normalizeFileLogContextValue(e){if(typeof e==`string`){let t=e.trim();return t?clampLogText(t,Ng):void 0}if(typeof e==`boolean`||typeof e==`number`&&Number.isFinite(e))return String(e)}function readFirstContextString(e,t){for(let n of e){let e=n?readParsedField(n,t,normalizeFileLogContextValue):void 0;if(e)return e}}function resolveLogHostname(){if(Dg)return Dg;let e=k.hostname().trim();return e?(Dg=e,e):`unknown`}function withResolvedLogMetaHostname(e,t){return isRecord(e)?{...e,hostname:t}:e}function extractLogBindingPrefix(e){if(typeof e[0]==`string`&&e[0].length<=Og&&e[0].trim().startsWith(`{`))try{let t=JSON.parse(e[0]);if(isRecord(t))return{bindings:t,args:e.slice(1)}}catch{}return{args:e}}function resolveLogTraceContext(e,t){for(let n of[e,...t]){let e=extractTraceContext(n);if(e)return{trace:e,trustedTraceContext:!1}}let n=getActiveDiagnosticTraceContext();return n?{trace:n,trustedTraceContext:!0}:{trustedTraceContext:!1}}function prepareFileLogRecord(e){let t=getSortedNumericLogEntries(e),{bindings:n,args:r}=extractLogBindingPrefix(t.map(([,e])=>e)),{trace:i}=resolveLogTraceContext(n,r),a=isPlainLogRecordObject(r[0])?r[0]:void 0,s=[a,n,e],c=a&&typeof a.message!=`string`?1:0,l=t.slice(t.length-r.length+c).map(([e,t])=>{let n={key:e,json:t!=null&&![`string`,`number`,`boolean`,`bigint`].includes(typeof t)&&!(t instanceof Error)&&!(isPlainLogRecordObject(t)&&typeof t.message==`string`)};return typeof t==`number`&&!Number.isFinite(t)&&(n.primitiveText=String(t)),n}),u=readFirstContextString(s,[`agent_id`,`agentId`]),d=readFirstContextString(s,[`session_id`,`sessionId`,`sessionKey`]),f=readFirstContextString(s,[`channel`,`messageProvider`]);return{fields:{hostname:resolveLogHostname(),...u?{agent_id:u}:{},...d?{session_id:d}:{},...f?{channel:f}:{},...i},messageParts:l}}function buildDiagnosticLogRecord(e){let t=e._meta,{bindings:n,args:r}=extractLogBindingPrefix(getSortedNumericLogEntries(e).map(([,e])=>e)),{trace:i,trustedTraceContext:a}=resolveLogTraceContext(n,r),s=r[0],c=isPlainLogRecordObject(s)?s:void 0;c&&r.shift();let l=``;r.length>0&&typeof r[r.length-1]==`string`?l=sanitizeDiagnosticLogText(String(r.pop()),kg):r.length===1&&(typeof r[0]==`number`||typeof r[0]==`boolean`)&&(l=String(r[0]),r.length=0),l||=`log`;let u=Object.create(null),d={count:0};addDiagnosticLogAttributesFrom(u,d,n),addDiagnosticLogAttributesFrom(u,d,c);let f={};if(t?.path?.fileLine){let e=Number(t.path.fileLine);Number.isFinite(e)&&(f.line=e)}t?.path?.method&&(f.functionName=sanitizeDiagnosticLogText(t.path.method,Mg));let p=normalizeDiagnosticLogName(t?.name),m=t?.parentNames?.map(normalizeDiagnosticLogName).filter(e=>!!e);return{event:{type:`log.record`,level:t?.logLevelName??`INFO`,message:l,...p?{loggerName:p}:{},...m?.length?{loggerParents:m}:{},...Object.keys(u).length>0?{attributes:u}:{},...Object.keys(f).length>0?{code:f}:{},...i?{trace:i}:{}},trustedTraceContext:a}}function attachDiagnosticEventTransport(e){e.attachTransport({format:()=>``,write:e=>{if(areDiagnosticsEnabledForProcess()&&hasInternalDiagnosticEventInterest(`log.record`))try{let t=buildDiagnosticLogRecord(redactSecrets(e));(t.trustedTraceContext?emitDiagnosticEventWithTrustedTraceContext:emitDiagnosticEvent)(t.event)}catch{}}})}function canUseSilentVitestFileLogFastPath(e){return process.env.VITEST===`true`&&process.env.OPENCLAW_TEST_FILE_LOG!==`1`&&!e&&!H.overrideSettings}function resolveDefaultActiveLogFile(){return process.env.VITEST===`true`&&process.env.OPENCLAW_TEST_FILE_LOG===`1`?E.join(process.cwd(),`.artifacts`,`test-logs`,`${yl}-vitest-${process.pid}-${formatLocalDate(/* @__PURE__ */ new Date)}${bl}`):resolveDefaultRollingLogFileName()}function resolveSettings(){if(!canUseNodeFs())return{level:`silent`,file:Tg,maxFileBytes:Eg,rolling:!1};let e=resolveEnvLogLevelOverride();if(canUseSilentVitestFileLogFastPath(e))return{level:`silent`,file:resolveDefaultRollingLogFileName(),maxFileBytes:Eg,rolling:!0,defaultRoot:!0};let t=H.overrideSettings??readLoggingConfig(),n=process.env.VITEST===`true`&&process.env.OPENCLAW_TEST_FILE_LOG!==`1`?`silent`:`info`,r=normalizeLogLevel(t?.level,n),i=e??r,a=!t?.file||isLegacyRollingLogFilePath(t.file);return{level:i,file:resolveActiveLogFileWithMode(t?.file??resolveDefaultActiveLogFile(),a),maxFileBytes:resolveMaxLogFileBytes(t?.maxFileBytes),rolling:a,defaultRoot:!t?.file&&(process.env.VITEST!==`true`||process.env.OPENCLAW_TEST_FILE_LOG!==`1`)}}function getRuntimeFileTarget(e){let t=resolveActiveLogFileWithMode(e.file,e.rolling);return e.target?.file!==t&&(e.target=bg.prepareTarget(t,e.rolling,e.target?.defaultRoot??e.defaultRoot)),e.target}function getRuntimeSettings(){let e=H.cachedSettings??resolveSettings();return H.cachedSettings=e,e}function isFileLogLevelEnabled(e){return isLogLevelEnabled(e,getRuntimeSettings().level)}function inheritLogLevel(e,t){let resolveLevel=t;Object.defineProperty(e.settings,"minLevel",{configurable:!0,enumerable:!0,get:()=>resolveLevel(),set:e=>{resolveLevel=()=>e}})}function initializeLoggerSourceMapPolicy(){typeof process<`u`&&process.env&&(process.env.TSLOG_SOURCE_MAPS??=`off`)}function buildLogger(){initializeLoggerSourceMapPolicy();let e=new RuntimeLogger({name:`openclaw`,mask:{keys:[]},meta:{property:`_meta`},minLevel:levelToMinLevel(`fatal`),type:`hidden`});return inheritLogLevel(e,()=>levelToMinLevel(getRuntimeSettings().level)),e.attachTransport({format:()=>``,write:e=>{try{let t=getRuntimeSettings();if(t.level===`silent`)return;let n=getRuntimeFileTarget(t),r=formatTimestamp(e.date??/* @__PURE__ */ new Date,{style:`long`}),{fields:i,messageParts:a}=prepareFileLogRecord(e),s=serializeFileLogRecord({...e,_meta:withResolvedLogMetaHostname(e._meta,i.hostname),time:r,...i},a);bg.enqueue({file:n.file,targetPreparation:n,hostname:i.hostname,maxFileBytes:t.maxFileBytes,payload:`${s}\n`})}catch{}}}),attachDiagnosticEventTransport(e),e}function resolveMaxLogFileBytes(e){return typeof e==`number`&&Number.isFinite(e)&&e>0?Math.floor(e):Eg}function getLogger(){let e=H.cachedLogger;if(e)return e;getRuntimeSettings();let t=buildLogger();return H.cachedLogger=t,t}function getChildLogger(e,t){let n=getLogger(),r=e?JSON.stringify(e):void 0;return n.getSubLogger({name:r,prefix:e?[r??``]:[],...t?.level?{minLevel:levelToMinLevel(t.level)}:{}})}function resolveActiveLogFileWithMode(e,t){let n=expandHomePrefix(e);return t?resolveRollingLogFilePathForDate(n,/* @__PURE__ */ new Date):n}var Tg,Eg,Dg,Og,kg,Ag,jg,Mg,Ng,Pg,RuntimeLogger,Fg=__esmMin((()=>{B(),Yn(),rr(),yi(),Sr(),aa(),wr(),_l(),vl(),Aa(),ml(),pl(),wg(),xl(),eo(),xg(),il(),wi(),ll(),Tg=`${hl}/openclaw.log`,Eg=104857600,Dg=null,Og=8192,kg=4096,Ag=32,jg=2048,Mg=120,Ng=512,Pg=/^[A-Za-z0-9_.:-]{1,64}$/u,RuntimeLogger=class extends tt{getSubLogger(e,t){let n=e?.minLevel??this.settings.minLevel,r=super.getSubLogger({...e,minLevel:n===1/0?levelToMinLevel(`fatal`):n},t);return e?.minLevel==null?inheritLogLevel(r,()=>this.settings.minLevel):n===1/0&&(r.settings.minLevel=n),r}}}));function normalizeConsoleLevel(e){return isVerbose()?`debug`:!e&&process.env.VITEST===`true`&&process.env.OPENCLAW_TEST_CONSOLE!==`1`?`silent`:normalizeLogLevel(e,`info`)}function normalizeConsoleStyle(e){return e===`compact`||e===`json`||e===`pretty`?e:process.stdout.isTTY?`pretty`:`compact`}function resolveConsoleSettings(){let e=resolveEnvLogLevelOverride();if(process.env.VITEST===`true`&&process.env.OPENCLAW_TEST_CONSOLE!==`1`&&!isVerbose()&&!e&&!H.overrideSettings)return{level:`silent`,style:normalizeConsoleStyle(void 0)};let t=H.overrideSettings??readLoggingConfig();return{level:e??normalizeConsoleLevel(t?.consoleLevel),style:normalizeConsoleStyle(t?.consoleStyle)}}function getConsoleSettings(){let e=H.cachedConsoleSettings;if(e)return e;let t=resolveConsoleSettings();return H.cachedConsoleSettings=t,t}function shouldLogSubsystemToConsole(e){let t=H.consoleSubsystemFilter;if(!t||t.length===0)return!0;let n=normalizeOptionalString(e);return n?t.some(e=>n===e||n.startsWith(`${e}/`)):!1}function formatConsoleTimestamp(e){let t=/* @__PURE__ */ new Date;return e===`pretty`?formatTimestamp(t,{style:`short`}).replace(/[+-]\d{2}:\d{2}$/,``):formatTimestamp(t,{style:`long`})}var Ig=__esmMin((()=>{Lt(),Pi(),Fi(),er(),Aa(),ml(),ul(),pl(),Fg(),il(),wi(),ll(),`${process.release.name}${process.pid}`}));function isRichConsoleEnv(){let e=normalizeLowercaseStringOrEmpty(process.env.TERM);return process.env.COLORTERM||process.env.TERM_PROGRAM?!0:e.length>0&&e!==`dumb`}function pickSubsystemColor(e){let t=zg.get(e);if(t)return t;let n=0;for(let t=0;t<e.length;t+=1)n=n*31+e.charCodeAt(t)|0;let r=Math.abs(n)%Rg.length;return expectDefined(Rg[r],`subsystem colors entry at idx`)}function formatSubsystemForConsole(e){let t=e.split(`/`).filter(Boolean),n=t.join(`/`)||e;for(;t[0]!==void 0&&Bg.has(t[0]);)t.shift();let r=t.at(0);return r===void 0?n:Vg.has(normalizeLowercaseStringOrEmpty(r))?r:t.slice(-2).join(`/`)}function stripRedundantSubsystemPrefixForConsole(e,t){if(!t)return e;if(e.startsWith(`[`)){let n=e.indexOf(`]`);if(n>1&&normalizeLowercaseStringOrEmpty(e.slice(1,n))===normalizeLowercaseStringOrEmpty(t))return e.slice(n+1).replace(/^ */,``)}if(normalizeLowercaseStringOrEmpty(e.slice(0,t.length))!==normalizeLowercaseStringOrEmpty(t))return e;let n=e.slice(t.length,t.length+1);return n!==`:`&&n!==` `?e:e.slice(t.length).replace(/^ *:? */,``)}function createConsoleLineFormatter(e){let t=formatSubsystemForConsole(e),n=`[${t}]`,r=pickSubsystemColor(t);return(e,i,a)=>{let s=typeof process.env.FORCE_COLOR==`string`&&process.env.FORCE_COLOR.trim().length>0&&process.env.FORCE_COLOR.trim()!==`0`||!process.env.NO_COLOR&&(process.stdout.isTTY||process.stderr.isTTY||isRichConsoleEnv())?1:0,c=Lg[s]??=new We({level:s}),l=e===`error`||e===`fatal`?c.red:e===`warn`?c.yellow:e===`debug`||e===`trace`?c.gray:c.cyan,u=stripRedundantSubsystemPrefixForConsole(redactSensitiveText(i),t),d=a===`pretty`||H.consoleTimestampPrefix?c.gray(formatConsoleTimestamp(a)):``,f=c[r](n);return`${d?`${d} ${f}`:f} ${l(u)}`}}function writeConsoleLine(e,t,n={}){clearActiveProgressLine();let r=process.platform===`win32`&&process.env.GITHUB_ACTIONS===`true`?t.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,`?`).replace(/[\uD800-\uDFFF]/g,`?`):t,i=n.redacted?r:redactSensitiveText(r),a=H.rawConsole??console;H.forceConsoleToStderr||e===`error`||e===`fatal`?(a.error??console.error)(i):e===`warn`?(a.warn??console.warn)(i):(a.log??console.log)(i)}function shouldSuppressProbeConsoleLine(e){if(isVerbose()||e.level===`error`||e.level===`fatal`)return!1;let t=typeof e.message==`string`?e.message:``;return e.suppressProbeMessages?(typeof e.meta?.runId==`string`?e.meta.runId:typeof e.meta?.sessionId==`string`?e.meta.sessionId:void 0)?.startsWith(`probe-`)?!0:/(sessionId|runId)=probe-/.test(t):!1}function formatConsoleMetaValue(e){if(e!==void 0)return typeof e==`string`?/[\s=\p{Cc}]/u.test(e)||e.length===0?stringifyConsoleMetaValue(e):e:e===null||typeof e==`number`||typeof e==`boolean`?String(e):stringifyConsoleMetaValue(e)}function stringifyConsoleMetaValue(e){return JSON.stringify(e).replace(/[\u007f-\u009f\u2028\u2029]/gu,e=>`\\u${e.charCodeAt(0).toString(16).padStart(4,`0`)}`)}function prepareLogMetaRecord(e,t=!1){let n;for(let[r,i]of Object.entries(e))i instanceof Error&&(n??={...e},n[r]={name:i.name,message:i.message,errorCode:extractErrorCode(i),stack:t?i.stack?.split(`
`).slice(0,6).join(`
`):i.stack});return n??e}function formatConsoleMeta(e){let t;try{t=redactLogRecordForTransport(e)}catch{return``}let n=[];for(let[e,r]of Object.entries(t)){let t=formatConsoleMetaValue(r);t!==void 0&&n.push(`${e}=${t}`)}let r=n.join(` `);return r.length>Ug?`${r.slice(0,Ug)}...(truncated)`:r}function logToFile(e,t,n,r){t!==`silent`&&(r&&Object.keys(r).length>0?e[t](r,n):e[t](n))}function createSubsystemLogger(e){let t=normalizeOptionalString(e)??`unknown`,n=t===`agent/embedded`||t.startsWith(`agent/embedded/`)||t===`model-fallback`||t.startsWith(`model-fallback/`),r,i,a,getFileLogger=e=>(r??=getChildLogger({subsystem:t}),e===`error`||e===`fatal`||e!==`info`&&areDiagnosticsEnabledForProcess()&&hasInternalDiagnosticEventInterest(`log.record`)?r:(i||(i=r.getSubLogger({stack:{capture:`off`}}),i.settings.parentNames=r.settings.parentNames),i)),emitLog=(e,r,i)=>{let s=getConsoleSettings(),c=i?.consoleMessage!==!1&&isLogLevelEnabled(e,s.level)&&shouldLogSubsystemToConsole(t),l=isFileLogLevelEnabled(e);if(!c&&!l)return;let u,d=i,f=i;if(i&&Object.keys(i).length>0){let{consoleMessage:e,...t}=i;typeof e==`string`&&(u=e),d=Object.keys(t).length>0?prepareLogMetaRecord(t):void 0,f=d&&c?prepareLogMetaRecord(t,!0):void 0}if(l&&logToFile(getFileLogger(e),e,r,d),!c)return;let p=s.style!==`json`&&u===void 0&&f&&Hg.has(e)?formatConsoleMeta(f):``,m=u??(p?`${r} ${p}`:r);shouldSuppressProbeConsoleLine({level:e,suppressProbeMessages:n,message:m,meta:f})||writeConsoleLine(e,s.style===`json`?formatJsonConsoleLine({level:e,subsystem:t,message:r,meta:f}):(a??=createConsoleLineFormatter(t))(e,m,s.style),{redacted:!0})};return{subsystem:t,isEnabled(e,n=`any`){let r=isLogLevelEnabled(e,getConsoleSettings().level)&&shouldLogSubsystemToConsole(t),i=isFileLogLevelEnabled(e);return n===`console`?r:n===`file`?i:r||i},trace(e,t){emitLog(`trace`,e,t)},debug(e,t){emitLog(`debug`,e,t)},info(e,t){emitLog(`info`,e,t)},warn(e,t){emitLog(`warn`,e,t)},error(e,t){emitLog(`error`,e,t)},fatal(e,t){emitLog(`fatal`,e,t)},raw(e){isFileLogLevelEnabled(`info`)&&logToFile(getFileLogger(`info`),`info`,e,{raw:!0});let r=getConsoleSettings();if(isLogLevelEnabled(`info`,r.level)&&shouldLogSubsystemToConsole(t)){if(shouldSuppressProbeConsoleLine({level:`info`,suppressProbeMessages:n,message:e}))return;writeConsoleLine(`info`,r.style===`json`?formatJsonConsoleLine({level:`info`,subsystem:t,message:e}):e,{redacted:r.style===`json`})}},child(e){return createSubsystemLogger(`${t}/${e}`)}}}var Lg,Rg,zg,Bg,Vg,Hg,Ug,Wg=__esmMin((()=>{Xn(),F(),Lt(),Qn(),er(),rr(),yi(),Ti(),Ig(),pl(),Fg(),il(),wi(),Lg=[],Rg=[`cyan`,`green`,`yellow`,`blue`,`magenta`,`red`],zg=/* @__PURE__ */ new Map([[`gmail-watcher`,`blue`]]),Bg=/* @__PURE__ */ new Set([`gateway`,`channels`,`providers`]),Vg=/* @__PURE__ */ new Set(/* @__PURE__ */ `clickclack.discord.feishu.googlechat.imessage.irc.line.matrix.mattermost.msteams.nextcloud-talk.nostr.openclaw-weixin.qqbot.signal.slack.synology-chat.telegram.tlon.twitch.webchat.wecom.whatsapp.yuanbao.zalo.zalouser`.split(`.`)),Hg=/* @__PURE__ */ new Set([`warn`,`error`,`fatal`]),Ug=2048})),Gg=/* @__PURE__ */ __exportAll({logAppContainerTokenProbeFailure:()=>logAppContainerTokenProbeFailure});function logAppContainerTokenProbeFailure(e){createSubsystemLogger(`process`).debug(`AppContainer token probe failed; allowing spawn`,{error:String(e)})}var Kg=__esmMin((()=>{Wg()}));function assertAppContainerSpawnSupported(t){if(process.platform===`win32`&&!(t===`ignore`||t===`inherit`||Array.isArray(t)&&t.length>=3&&t.every(e=>e!=null&&e!==`pipe`&&e!==`overlapped`&&e!==`ipc`&&!(typeof e==`number`&&e<0)))){if(!qg){qg=!0;try{let{readCurrentAppContainerSid:t}=e(import.meta.url)(`@openclaw/proc-safe/windows-token`),n=t(),r=process.versions.uv,i=Number(r.split(`.`)[0]),a=Number(r.split(`.`)[1]);n!==null&&(i<1||i===1&&a<53)&&(Jg=new AppContainerSpawnUnsupportedError(r))}catch(e){Promise.resolve().then(()=>(Kg(),Gg)).then(({logAppContainerTokenProbeFailure:t})=>t(e)).catch(()=>{})}}if(Jg)throw Jg}}var AppContainerSpawnUnsupportedError,qg,Jg,Yg=__esmMin((()=>{AppContainerSpawnUnsupportedError=class extends Error{constructor(e){super(`AppContainer: libuv ${e} cannot create child pipes; 1.53.0+ required. Run OpenClaw outside the AppContainer or use a Node build with libuv >= 1.53.0.`),this.code=`APPCONTAINER_SPAWN_UNSUPPORTED`,this.name=`AppContainerSpawnUnsupportedError`}},qg=!1}));function parseWindowsCodePage(e){let t=Number(e.match(/\b(\d{3,5})\b/)?.[1]);return t>0?t:null}function resolveWindowsSystemEncoding(){return process.platform===`win32`?($g===void 0&&($g=probeWindowsEncoding(()=>`powershell.exe`,[`-NoLogo`,`-NoProfile`,`-NonInteractive`,`-Command`,`[Text.Encoding]::Default.CodePage`])),$g):null}function probeWindowsEncoding(e,t){assertAppContainerSpawnSupported();try{let n=_(e(),t,{env:resolveDiagnosticProcessEnv(),windowsHide:!0,encoding:`utf8`,killSignal:`SIGKILL`,stdio:[`ignore`,`pipe`,`pipe`],timeout:Zg}),r=parseWindowsCodePage(`${n.stdout??``}\n${n.stderr??``}`);return r===null?null:Xg[r]??null}catch{return null}}function createWindowsTextFileDecoder(e){let[t,n]=e.prefix;if(t===255&&n===254||t===254&&n===255)return new TextDecoder(t===255?`utf-16le`:`utf-16be`);if((e.platform??process.platform)!==`win32`)return new TextDecoder(`utf-8`,{ignoreBOM:!0});try{return new TextDecoder(`utf-8`,{fatal:!0}).decode(e.prefix,{stream:e.complete===!1}),new TextDecoder(`utf-8`)}catch{let t=e.windowsEncoding??resolveWindowsSystemEncoding();if(t&&normalizeLowercaseStringOrEmpty(t)!==`utf-8`)try{return new TextDecoder(t)}catch{}return new TextDecoder(`utf-8`,{ignoreBOM:!0})}}var Xg,Zg,Qg,$g,e_=__esmMin((()=>{Lt(),mt(),Yg(),Hh(),Xg={65001:`utf-8`,54936:`gb18030`,874:`windows-874`,936:`gbk`,950:`big5`,932:`shift_jis`,949:`euc-kr`,1250:`windows-1250`,1251:`windows-1251`,1252:`windows-1252`,1253:`windows-1253`,1254:`windows-1254`,1255:`windows-1255`,1256:`windows-1256`,1257:`windows-1257`,1258:`windows-1258`},Zg=5e3,Qg={65001:`utf-8`,874:`windows-874`,932:`shift_jis`,936:`gbk`,949:`euc-kr`,950:`big5`,1258:`windows-1258`,437:`cp437`,720:`cp720`,737:`cp737`,775:`cp775`,850:`cp850`,852:`cp852`,855:`cp855`,857:`cp857`,858:`cp858`,860:`cp860`,861:`cp861`,862:`cp862`,863:`cp863`,865:`cp865`,866:`cp866`,869:`cp869`},new Map(Object.entries(Qg).map(([e,t])=>[t,Number.parseInt(e,10)]))}));function detectSupportedImageMimeType(e){return startsWith(e,[255,216,255])?e[3]===247?null:`image/jpeg`:startsWith(e,t_)?isPng(e)&&!isAnimatedPng(e)?`image/png`:null:startsWithAscii(e,0,`GIF`)?`image/gif`:startsWithAscii(e,0,`RIFF`)&&startsWithAscii(e,8,`WEBP`)?`image/webp`:startsWithAscii(e,0,`BM`)&&isBmp(e)?`image/bmp`:null}function isPng(e){return e.length>=16&&readUint32(e,t_.length,`big`)===13&&startsWithAscii(e,12,`IHDR`)}function isAnimatedPng(e){let t=t_.length;for(;t+8<=e.length;){let n=readUint32(e,t,`big`),r=t+4;if(startsWithAscii(e,r,`acTL`))return!0;if(startsWithAscii(e,r,`IDAT`))return!1;let i=t+8+n+4;if(i<=t||i>e.length)return!1;t=i}return!1}function isBmp(e){if(e.length<26)return!1;let t=readUint32(e,2,`little`),n=readUint32(e,10,`little`),r=readUint32(e,14,`little`);if(t!==0&&t<26||n<14+r||t!==0&&n>=t)return!1;let i,a;if(r===12)i=readUint16LE(e,22),a=readUint16LE(e,24);else if(r>=40&&r<=124){if(e.length<30)return!1;i=readUint16LE(e,26),a=readUint16LE(e,28)}else return!1;return i===1&&[1,4,8,16,24,32].includes(a)}function readUint16LE(e,t){return(e[t]??0)+((e[t+1]??0)<<8)}function readUint32(e,t,n){let r=0;for(let i=0;i<4;i++){let a=(n===`little`?i:3-i)*8;r+=(e[t+i]??0)*2**a}return r}function startsWith(e,t){return e.length<t.length?!1:t.every((t,n)=>e[n]===t)}function startsWithAscii(e,t,n){if(e.length<t+n.length)return!1;for(let r=0;r<n.length;r++)if(e[t+r]!==n.charCodeAt(r))return!1;return!0}var t_,n_=__esmMin((()=>{t_=[137,80,78,71,13,10,26,10]}));function createReadTextCapture(e){let t=e.offset-1,n=[],r=0,i=0,a=0,s=0,c=0,l=0,u=!1,d=``,f=0,p=0,m=!0,pageComplete=()=>r>=e.maxChars||s>=t+Math.min(e.limit??1/0,e.maxLines??1/0),selected=()=>s>=t&&(e.limit===void 0||s<t+e.limit),append=t=>{i+=t.length,a+=Buffer.byteLength(t,`utf8`);let s=e.maxChars-r;if(s>0){let e=t.slice(0,s);n.push(e),r+=e.length}},scan=n=>{for(let r=0;r<n.length;){if(e.stopEarly&&pageComplete()){m=!1;break}let i=n.indexOf(`
`,r),a=i===-1?n.length:i,d=n.slice(r,a);if(selected()){if(u||=d.length>0,s===t){let t=e.cursor-1-c,n=e.cursor-c;t>=0&&t<d.length&&(f=d.charCodeAt(t)),n>=0&&n<d.length&&(p=d.charCodeAt(n)),append(d.slice(Math.max(0,e.cursor-c))),l+=d.length}else append(d);i!==-1&&append(`
`)}c+=d.length,i!==-1&&(s+=1,c=0),r=a+1}};return{write(t){let n=d+t;return d=n.endsWith(`\r`)?`\r`:``,d&&(n=n.slice(0,-1)),scan(n.replaceAll(`\r
`,`
`)),!e.stopEarly||!pageComplete()},finish(h=!0){scan(d);let g=s+Number(c>0),_=h&&m?g:void 0,v=Math.max(0,Math.min(g-t,e.limit??g,e.stopEarly?e.maxLines??g:g)),y=n.join(``);v>0&&(_===void 0?s>=t+v:t+v<_)&&(--a,r===i&&(y=y.slice(0,-1)));let b=y.charCodeAt(y.length-1);return r<i&&b>=55296&&b<=56319&&(y=y.slice(0,-1)),{content:y,..._===void 0?{}:{totalLines:_,totalBytes:a},selectedLineCount:v,firstLineLength:l,selectedHasText:u,cursorSplitsSurrogatePair:f>=55296&&f<=56319&&p>=56320&&p<=57343}}}}var r_=__esmMin((()=>{})),i_,a_=__esmMin((()=>{i_=2e3,globalThis.Buffer})),o_=__esmMin((()=>{a_()})),s_=/* @__PURE__ */ __exportAll({captureReadFilePage:()=>captureReadFilePage});async function captureReadFilePage(e,t,n){n?.throwIfAborted();let r=await(await Ue(de(e))).open(ue(e),{symlinks:`follow-parents-within-root`,hardlinks:`allow`});try{let e=Buffer.allocUnsafe(wn),i=await d(r.handle,e,0,{signal:n}),a=e.subarray(0,i);if(a.length<1048576)return{buffer:a};let s=detectSupportedImageMimeType(a),c=s?void 0:await classifyAttachmentBytes({buffer:a});if(s||c?.class===`image`)return{buffer:await r.handle.readFile()};if(c?.class===`document`)return{buffer:a};let l=createWindowsTextFileDecoder({prefix:a,complete:!1}),u=createReadTextCapture({...t,stopEarly:!0,maxLines:i_}),f=!0,decode=e=>{let t=l.decode(e,e===void 0?void 0:{stream:!0});return f&&t.length>0&&(f=!1,t=t.startsWith(`﻿`)?t.slice(1):t),u.write(t)},p=0,m=!0,h=Buffer.allocUnsafe(65536);for(;;){n?.throwIfAborted();let e=p<a.length?a.subarray(p,Math.min(p+65536,a.length)):h.subarray(0,await d(r.handle,h,p,{signal:n}));if(e.length===0){decode();break}if(p+=e.length,!decode(e)){m=!1;break}}return{buffer:a,text:u.finish(m)}}finally{await r.handle.close()}}var c_=__esmMin((()=>{Fn(),An(),e_(),n_(),r_(),o_()}));function setProcessTimeout(e,t){let n,r=setTimeout(()=>{n=setTimeout(e,0)},t);return{clear(){clearTimeout(r),clearTimeout(n)},refresh(){clearTimeout(n),n=void 0,r.refresh()}}}var l_=__esmMin((()=>{})),u_=/* @__PURE__ */ __exportAll({startBrokerExeca:()=>startBrokerExeca});async function createExecaOutput(){let e=await be(E.join(Ee(),`oc-spawn-`));fitsBrokerSocketPath(e,`out`)||(await Se(e,{recursive:!0,force:!0}),e=await be(`/tmp/oc-spawn-`));let t=i({pauseOnConnect:!0}),n,a;try{let i=E.join(e,`out`);t.listen(i),await Ie(t,`listening`);let s=new Promise(e=>{t.once(`connection`,e)});a=r(i),[n]=await Promise.all([s,Ie(a,`connect`)]);let c=n,l=new Le({transform(e,t,n){c.write(e,t=>n(t,e))},flush(e){c.end(e)},destroy(e,t){c.destroy(),t(e)}});return c.on(`error`,e=>l.destroy(e)),c.once(`close`,()=>{c.writableFinished||l.destroy()}),{receiver:a,transform:l}}catch(e){throw n?.destroy(),a?.destroy(),e}finally{t.close(),await Se(e,{recursive:!0,force:!0})}}function outputOption(e,t){let n=t===1?e.stdout:e.stderr;return n===void 0?typeof e.stdio==`string`?e.stdio:e.stdio?.[t]??`pipe`:n}async function startBrokerExeca(e,n,r,i){let a=new AbortController,s=/* @__PURE__ */ new Map;try{for(let e of[1,2]){let t=e===1?`stdout`:`stderr`,r=typeof n.buffer==`boolean`?n.buffer:n.buffer?.[t];outputOption(n,e)===`pipe`&&r!==!1&&s.set(e,await createExecaOutput())}r();let{encoding:c,executionDeadlineMs:l,...u}=n,d={...u,...s.has(1)?{stdout:{transform:s.get(1).transform,objectMode:!1}}:{},...s.has(2)?{stderr:{transform:s.get(2).transform,objectMode:!1}}:{},cancelSignal:a.signal},start=()=>ct(e[0],e.slice(1),{...d,encoding:c}),f;try{f=spawnInAgentExecCgroup(i,start)}catch(e){throw await adoptAbandonedSpawnError(e)}let p=f.nodeChildProcess,m=p.pid&&process.platform!==`win32`&&(n.detached===!0||n.killDescendants===!0)?getProcessInstanceStartTime(p.pid):void 0,h=[0,1,2].map(e=>{if(e===0&&n.input!==void 0||e>0&&outputOption(n,e===1?1:2)!==`pipe`)return null;let r=s.get(e)?.receiver??p.stdio[e];return r instanceof t?(e>0&&holdPipeForTransfer(r),r):null}),g=!1,_=l===void 0?void 0:setProcessTimeout(()=>{p.exitCode===null&&p.signalCode===null&&(g=!0,f.kill())},l),clearDeadline=()=>_?.clear();p.once(`exit`,clearDeadline);let v=f.then(e=>serializeResult(e,g),e=>{if(e instanceof Error&&`failed`in e&&e.failed===!0)return serializeResult(e,g);throw e}).finally(()=>{clearDeadline(),p.removeListener(`exit`,clearDeadline)});return v.catch(()=>{}),{child:p,stdio:h,result:v,groupStartedAt:m,cancel(){clearDeadline(),a.abort()},kill(e){return clearDeadline(),f.kill(e)},outputDrained(e,t){let n=s.get(e);n?(n.receiver.destroy(),t&&n.transform.destroy(t)):e===0&&!t?p.stdin?.end():p.stdio[e]?.destroy(t)}}}catch(e){for(let e of s.values())e.transform.destroy(),e.receiver.destroy();throw e}}async function adoptAbandonedSpawnError(e){return e instanceof TypeError?await new Promise(t=>{let settle=e=>{process.off(`uncaughtException`,onUncaught),clearImmediate(n),t(e)},onUncaught=t=>{if(t instanceof Error){let e=`syscall`in t?t.syscall:void 0,n=`code`in t?t.code:void 0;if(typeof e==`string`&&e.startsWith(`spawn`)&&(n===`EMFILE`||n===`ENFILE`)){settle(t);return}}settle(e),process.nextTick(()=>{throw t})};process.on(`uncaughtException`,onUncaught);let n=setImmediate(()=>settle(e))}):e}function serializeResult(e,t){let n={stdout:byteOrTextOutput(e.stdout),stderr:byteOrTextOutput(e.stderr)},r=e instanceof Error?e:t?/* @__PURE__ */ Error(`Command timed out`):void 0;return{...n,exitCode:e.exitCode,signal:e.signal,failed:e.failed||t,timedOut:e.timedOut||t,isCanceled:e.isCanceled,isGracefullyCanceled:e.isGracefullyCanceled,isMaxBuffer:e.isMaxBuffer,isTerminated:e.isTerminated,isForcefullyTerminated:e.isForcefullyTerminated,shortMessage:e.shortMessage,originalMessage:e.originalMessage,code:e.code,command:e.command,escapedCommand:e.escapedCommand,cwd:e.cwd,durationMs:e.durationMs,signalDescription:e.signalDescription,...r?{error:serializeExecaError(r,n)}:{}}}function byteOrTextOutput(e){if(e===void 0||typeof e==`string`||e instanceof Uint8Array)return e;throw TypeError(`Spawn broker execa output must contain bytes or text`)}var d_=__esmMin((()=>{wt(),l_(),dn(),gn(),Im()}));F(),dt(),I(),wt(),It(),Ht(),cn(),dn(),mn(),gn(),z();const f_=/* @__PURE__ */ new Map,p_=/* @__PURE__ */ new Map,m_=createBrokerReceiver();let $=!1;const h_=/* @__PURE__ */ new Map,g_=/* @__PURE__ */ new Map;let __,v_=`waiting`,y_=Promise.resolve();const b_=/* @__PURE__ */ new Set,x_=/* @__PURE__ */ new Map,S_=createWorkerSender((e,t,n)=>{!process.send||!process.connected?n(/* @__PURE__ */ Error(`Spawn broker parent disconnected`)):process.send(e,t,{keepOpen:!1},n)});function report(e,t){return S_.send(e,t).catch(e=>{throw shutdown(),e})}function forget(e,t){if(t.announced&&t.exited&&t.resultSettled&&t.openPipes.size===0){if(t.groupIdentity&&!t.groupGone){let n=t.groupIdentity;t.groupObservation??=(async()=>{for(;;){if($)return;if(!isBrokerChildGroupAlive(n)){t.groupGone=!0,f_.delete(e),p_.delete(e);return}await s(50,void 0,{ref:!1})}})(),t.groupObservation.catch(()=>{});return}f_.delete(e),p_.delete(e)}}function stopChild(e){return e.stopping??=(async()=>{let{child:t,execa:n}=e;t.connected&&t.disconnect();let r=t.exitCode===null&&t.signalCode===null,i=!e.groupGone&&(e.groupIdentity?isBrokerChildGroupAlive(e.groupIdentity):r),a=t.pid&&i?terminateLostBrokerChild(t.pid,e.detached,e.groupIdentity):void 0;a?.settled.catch(()=>{}),i&&r&&n?.cancel();for(let t of e.openPipes)n?.outputDrained(t,/* @__PURE__ */ Error(`Spawn broker is stopping`));e.openPipes.clear();for(let e of n?.stdio??t.stdio??[])e?.destroy();await Promise.allSettled([e.closed,n?.result,e.output]),await a?.settled,e.groupGone=!0})()}function shutdown(){if($)return;$=!0;for(let e of x_.values())e.controller.abort();for(let e of g_.values())e.resolve(!1);__?.disconnect(),S_.close(/* @__PURE__ */ Error(`Spawn broker parent disconnected`)),m_.clear();let e=[...f_.values()].map(stopChild);for(let t of e)t.catch(()=>{});(async()=>{try{await y_.catch(()=>void 0),await Promise.allSettled(b_),throwSettledAggregate(await Promise.allSettled([...e,...[...f_.values()].map(stopChild),__?.close()]),`Spawn broker native cleanup failed`),await drainCurrentBrokerProcessGroup()}catch(e){process.exitCode=1,process.stderr.write(`Spawn broker cleanup failed: `+String(e)+`
`)}finally{process.stdin.destroy(),process.connected&&process.disconnect?.()}})()}async function readFile$1(e){let t={canceled:!1,controller:new AbortController};try{if(__||h_.size+x_.size>=256)throw new SpawnBrokerError(`Spawn broker cannot admit a raw file read`);x_.set(e.id,t);let n;if(e.page){let{captureReadFilePage:r}=await Promise.resolve().then(()=>(c_(),s_));n=await r(e.filePath,e.page,t.controller.signal)}else{let{buffer:n}=await f({filePath:e.filePath});for(let r=0;r<n.length;r+=524288){if($||t.canceled)return;await report({type:`file-read-chunk`,id:e.id,bytes:n.subarray(r,r+524288)})}}!$&&!t.canceled&&await report({type:`file-read-result`,id:e.id,page:n})}catch(n){if(!$&&!t.canceled){let t=toErrorObject(n,`File read failed`);await report({type:`file-read-result`,id:e.id,error:t,code:serializeBrokerError(t).code})}}finally{x_.delete(e.id)}}async function launch(e){let n=childCapacityError(p_.values(),e.admission??`command`);if($||h_.size+x_.size>=256||n){let t=new SpawnBrokerError(n??`Spawn broker startup capacity exceeded`);await report({type:`execa-result`,id:e.id,result:createBrokerExecaAdmissionFailure(t)}),await report({type:`error`,id:e.id,error:serializeBrokerError(t),resultUnavailable:!0});return}let r={};p_.set(e.id,e.admission??`command`),h_.set(e.id,r);let i,a,s,c,l=e.options.detached===!0||e.type===`spawn-execa`&&e.options.killDescendants===!0,assertActive=()=>{if($||!process.connected||e.type===`prepare-spawn`&&(r.canceled||r.signal))throw Error(`Spawn broker is stopping`)};try{e.type!==`spawn-execa`&&e.outputFile&&(c=await prepareProcessOutputFile(e.outputFile));let n=await S_.reserve(async n=>{if(assertActive(),e.type===`prepare-spawn`){let t=createDeferredCore();g_.set(e.id,t);try{if(await n({type:`prepared`,id:e.id}),!await t.promise)throw Error(`Spawn broker launch authority refused`);assertActive()}finally{g_.delete(e.id)}}let u;if(e.type===`spawn-execa`){let{startBrokerExeca:t}=await Promise.resolve().then(()=>(d_(),u_));assertActive(),u=await t(e.argv,e.options,assertActive,e.execCgroup)}let d=c?.stdio,f=u?.child??(e.type===`spawn-execa`?void 0:spawnInAgentExecCgroup(e.execCgroup,()=>spawnWithInheritedOomScore(e.argv[0],e.argv.slice(1),d===void 0?e.options:{...e.options,stdio:e.options.stdio.map((e,t)=>t===1?d:e)})));if(i=f,!f)throw Error(`Spawn broker command did not start`);a=waitForBrokerChildCompletion(f);let p=c?.start(f,l,a);if(l&&f.pid&&process.platform!==`win32`&&(s={pid:f.pid,startedAt:u?u.groupStartedAt??null:getProcessInstanceStartTime(f.pid),isLeaderAlive:()=>f.exitCode===null&&f.signalCode===null}),!u){if(f.stdio===void 0){let e=a,t=await new Promise(e=>{f.once(`error`,e)});throw await e,t}for(let[e,n]of f.stdio.entries())e>0&&!(c&&e===1)&&n instanceof t&&holdPipeForTransfer(n)}if(u&&!f.pid){for(let[e]of u.stdio.entries())u.outputDrained(e);return disposeFailedChild(f),{type:`failed`,execa:u}}let m={child:f,detached:l,...s?{groupIdentity:s}:{},execa:u,output:p,announced:!1,events:[],exited:!1,resultSettled:!u&&!p,closed:a,openPipes:new Set((u?.stdio??f.stdio).flatMap((e,n)=>e instanceof t&&!(c&&n===1)?[n]:[]))};f_.set(e.id,m),r.canceled&&u?.cancel(),r.signal!==void 0&&(u?.kill??f.kill.bind(f))(r.signal);let event=e=>{m.announced?report(e).catch(()=>{}):m.events.length<32?m.events.push(e):(f.kill(`SIGKILL`),shutdown())};if(f.on(`error`,t=>event({type:`error`,id:e.id,error:serializeBrokerError(t)})),f.on(`message`,t=>event({type:`ipc`,id:e.id,message:t})),f.once(`disconnect`,()=>event({type:`disconnect`,id:e.id})),f.once(`exit`,(t,n)=>event({type:`exit`,id:e.id,code:t,signal:n})),a.then(()=>{p||event({type:`closed`,id:e.id}),m.exited=!0,forget(e.id,m)}),p&&(async()=>{try{event({type:`file-output`,id:e.id,bytes:await p})}catch(t){event({type:`file-output`,id:e.id,error:serializeBrokerError(toErrorObject(t,`Process output failed`))})}finally{m.resultSettled=!0,forget(e.id,m)}})(),u&&u.result.then(async t=>{event({type:`execa-result`,id:e.id,result:t}),m.resultSettled=!0,forget(e.id,m)}).catch(t=>{event({type:`error`,id:e.id,error:serializeBrokerError(toErrorObject(t,`Spawn broker execa result failed`)),resultUnavailable:!0}),m.resultSettled=!0,forget(e.id,m)}),u||await new Promise((e,t)=>{f.once(`spawn`,e),f.once(`error`,t)}),!f.pid)throw Error(`Spawn broker command has no process identifier`);return await n({type:`owned`,id:e.id,pid:f.pid}),{type:`started`,entry:m,pid:f.pid}});if(n.type===`failed`){let t=await n.execa.result;await report({type:`execa-result`,id:e.id,result:t}),await report({type:`error`,id:e.id,error:{message:t.error?.message??t.shortMessage??`Command could not be spawned`,code:t.code}});return}let u=n.entry,{child:d,execa:f}=u;if($){await stopChild(u);return}let p=f?.stdio??d.stdio;for(let[n,r]of p.entries()){if(!(r instanceof t)||c&&n===1)continue;r.pause(),await report({type:`pipe`,id:e.id,fd:n},r);let i=n>0?takePipePrefix(r):void 0;i?.length&&await report({type:`pipe-prefix`,id:e.id,fd:n,bytes:i}),f||r.destroy()}for(await report({type:`spawned`,id:e.id,pid:n.pid,spawnfile:d.spawnfile,spawnargs:d.spawnargs,connected:d.connected,stdioLength:p.length});;){let e=u.events.shift();if(e===void 0)break;await report(e)}u.announced=!0,forget(e.id,u)}catch(t){let n=f_.get(e.id);if(n)await stopChild(n);else{let e=s?terminateLostBrokerChild(s.pid,!0,s):void 0;e?.settled.catch(()=>{}),disposeFailedChild(i),await a,await e?.settled}await c?.close(),p_.delete(e.id),f_.delete(e.id),$||await report({type:`error`,id:e.id,error:serializeBrokerError(t instanceof Error?t:Error(String(t))),resultUnavailable:!0,...i?.pid?{}:{notStarted:!0}})}finally{h_.delete(e.id),!f_.has(e.id)&&!i?.pid&&p_.delete(e.id)}}process.once(`disconnect`,shutdown);const onSupervisorSignal=()=>{process.connected||shutdown()};process.on(`SIGTERM`,onSupervisorSignal),process.on(`SIGINT`,onSupervisorSignal),process.on(`message`,(e,n)=>{if($){n instanceof t&&n.destroy();return}if(v_===`waiting`){v_=`initializing`,y_=initialize(e),y_.catch(shutdown);return}if(v_!==`ready`){shutdown();return}let r;try{r=m_.receive(e)}catch{shutdown();return}if(r===void 0)return;let i=r;if(i.type===`shutdown`){shutdown();return}if(i.type===`launch`){g_.get(i.id)?.resolve(i.allowed);return}if(i.type===`pipe-received`){S_.acknowledge(i.id,i.fd);return}if(i.type===`cancel-read-file`){let e=x_.get(i.id);e&&(e.canceled=!0,e.controller.abort());return}if(i.type===`read-file`){let e=readFile$1(i).catch(shutdown);b_.add(e),e.finally(()=>b_.delete(e));return}if(i.type===`spawn`||i.type===`prepare-spawn`||i.type===`spawn-execa`){let e=launch(i).catch(shutdown);b_.add(e),e.finally(()=>b_.delete(e));return}if(i.type===`resource-seal`||i.type===`resource-target`||i.type===`resource-owner`||i.type===`resource-close`||i.type===`resource-release`){__?.receive(i);return}let a=f_.get(i.id);if(!a){let e=h_.get(i.id);e&&i.type===`cancel`&&(e.canceled=!0,g_.get(i.id)?.resolve(!1)),e&&i.type===`kill`&&(e.signal=i.signal,g_.get(i.id)?.resolve(!1)),i.type===`ipc`&&report({type:`ipc-sent`,id:i.id,sequence:i.sequence,error:{message:`Child process IPC channel is closed`}}).catch(()=>{})}else if(i.type===`kill`)(a.execa?.kill??a.child.kill.bind(a.child))(i.signal);else if(i.type===`cancel`)a.execa?.cancel();else if(i.type===`output-drained`)a.execa?.outputDrained(i.fd,i.error?Object.assign(Error(i.error.message),i.error):void 0),a.openPipes.delete(i.fd),forget(i.id,a);else if(i.type===`disconnect`&&a.child.connected)a.child.disconnect();else if(i.type===`ipc`){let acknowledge=e=>{report({type:`ipc-sent`,id:i.id,sequence:i.sequence,...e?{error:serializeBrokerError(e)}:{}}).catch(()=>{})};if(!a.child.connected)acknowledge(/* @__PURE__ */ Error(`Child process IPC channel is closed`));else try{a.child.send(i.message,n,{keepOpen:!0},acknowledge)}catch(e){acknowledge(e instanceof Error?e:Error(String(e)))}}});async function initialize(e){if(!$&&process.connected){if(e.nativeResource){let t=e.nativeResource;try{__=await createBrokerNativeResourceServer({endpoint:t.endpoint,secret:t.secret,generation:t.generation,reportParent:report,canAdmit:()=>!$&&(__?.size??0)<256})}catch(e){throw await report({type:`startup-failed`,error:serializeBrokerError(toErrorObject(e,`Native resource server startup failed`))}).catch(()=>{}),e}if($){__.disconnect();return}}v_=`ready`,await report({type:`ready`,pid:process.pid})}}export{};