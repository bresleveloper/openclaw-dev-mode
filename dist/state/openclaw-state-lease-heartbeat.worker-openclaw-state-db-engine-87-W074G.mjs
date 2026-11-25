import{$ as e,B as t,D as n,G as r,I as i,J as a,L as o,M as s,T as c,X as l,Y as u,Z as d,_ as f,a as p,at as m,b as h,c as ee,et as g,f as te,g as ne,h as _,i as v,j as re,m as ie,n as ae,r as y,rt as b,t as x,tt as oe,u as se}from"./openclaw-state-lease-heartbeat.worker-subsystem-Dmi3VKXB.mjs";import{$ as ce,An as le,D as ue,E as de,Et as fe,Fn as pe,Hn as S,It as me,Jt as he,Kn as C,L as ge,Ln as _e,M as ve,O as ye,Pn as be,Q as xe,R as Se,S as Ce,Tt as we,Un as Te,Ut as Ee,Wn as De,Yn as Oe,Z as ke,_ as Ae,_n as je,_t as Me,b as Ne,bn as w,dt as Pe,et as Fe,fn as Ie,ft as Le,gn as Re,h as ze,hn as Be,ht as Ve,it as He,j as T,jt as E,ln as Ue,lt as We,mn as Ge,mt as Ke,nt as qe,ot as Je,pt as Ye,sn as Xe,t as Ze,tt as Qe,ut as $e,vn as et,w as tt,x as D,y as nt,yn as O,z as rt}from"./openclaw-state-lease-heartbeat.worker-sqlite-worker-database-admission-relay-D013cqC4.mjs";import{i as it,n as at,r as ot,t as st}from"./openclaw-state-lease-heartbeat.worker-error-graph-internal-FDtbVW0L.mjs";import{r as ct}from"./openclaw-state-lease-heartbeat.worker-path-existence-DOD8NqC3.mjs";import{c as lt}from"./openclaw-state-lease-heartbeat.worker-pid-alive-9soy0jb2.mjs";import{a as ut}from"./openclaw-state-lease-heartbeat.worker-runtime-process-manifest-CA_3_-Eh.mjs";import{i as dt}from"./openclaw-state-lease-heartbeat.worker-runtime-binary-BtqhQ2a2.mjs";import{t as ft}from"./openclaw-state-lease-heartbeat.worker-runtime-worker-url-C56mpH2M.mjs";import{t as pt}from"./openclaw-state-lease-heartbeat.worker-errors-BiAyeLHR.mjs";import{A as k,B as mt,C as ht,Ct as A,D as gt,F as _t,G as vt,H as yt,I as j,J as bt,K as xt,L as St,M as Ct,N as wt,O as Tt,P as Et,Q as Dt,R as Ot,S as M,St as kt,T as At,Tt as jt,U as Mt,V as Nt,W as Pt,Y as Ft,Z as It,_ as Lt,_t as Rt,a as zt,b as Bt,bt as Vt,d as N,dt as Ht,f as Ut,ft as Wt,g as Gt,gt as Kt,h as qt,ht as Jt,i as Yt,j as Xt,k as Zt,lt as Qt,m as $t,mt as en,o as tn,p as nn,q as rn,r as an,s as on,u as sn,ut as cn,v as ln,vt as un,w as dn,wt as fn,x as pn,xt as mn,y as hn,yt as P,z as gn}from"./openclaw-state-lease-heartbeat.worker.js";import{_ as _n,b as vn,g as yn,h as bn,m as F,p as xn,r as Sn,s as Cn,u as wn,v as Tn,x as En,y as Dn}from"./openclaw-state-lease-heartbeat.worker-worker-task-pool-BGdVlDC3.mjs";import"./openclaw-state-lease-heartbeat.worker-windows-appcontainer-spawn-D4Mm-aCu.mjs";import{MessageChannel as On,isMainThread as kn,receiveMessageOnPort as An,threadId as jn}from"node:worker_threads";import{AsyncLocalStorage as I}from"node:async_hooks";import{createHash as Mn,randomUUID as Nn}from"node:crypto";import L from"node:path";import R,{existsSync as Pn,readFile as Fn,realpathSync as In}from"node:fs";import"node:os";import"node:fs/promises";import{isPathInside as Ln}from"@openclaw/fs-safe/path";import Rn from"node:child_process";import"@openclaw/fs-safe/durability";import{deserialize as zn,serialize as Bn}from"node:v8";import{channel as Vn}from"node:diagnostics_channel";import"node:perf_hooks";import{promisify as Hn,toUSVString as Un}from"node:util";import{createDirectorySync as Wn,sameFileIdentity as Gn}from"@openclaw/fs-safe/advanced";import{FsSafeError as Kn}from"@openclaw/fs-safe/errors";import"semver";import{Socket as qn}from"node:net";function toStringifiedError(e){return e instanceof Error?e:Error(String(e))}const Jn=`ai.openclaw.node`,Yn=`OpenClaw Node`;function normalizeGatewayProfile(e){let t=e?.trim();return t&&d(t)!=="default"?t:null}function resolveGatewayProfileSuffix(e){let t=normalizeGatewayProfile(e);return t?`-${t}`:``}function resolveNodeLaunchAgentLabel(e){let t=normalizeGatewayProfile(e);return t?`${Jn}.${t}`:Jn}function resolveNodeSystemdServiceName(e){return`openclaw-node${resolveGatewayProfileSuffix(e)}`}function resolveNodeWindowsTaskName(e){let t=normalizeGatewayProfile(e);return t?`${Yn} (${t})`:Yn}function resolveNodeServiceIdentityEnvironment(e={}){let t=e.OPENCLAW_PROFILE;return{OPENCLAW_PROFILE:t,OPENCLAW_LAUNCHD_LABEL:resolveNodeLaunchAgentLabel(t),OPENCLAW_SYSTEMD_UNIT:resolveNodeSystemdServiceName(t),OPENCLAW_WINDOWS_TASK_NAME:resolveNodeWindowsTaskName(t),OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER:`1`,OPENCLAW_TASK_SCRIPT_NAME:`node.cmd`,OPENCLAW_LOG_PREFIX:`node${resolveGatewayProfileSuffix(t)}`,OPENCLAW_SERVICE_MARKER:`openclaw`,OPENCLAW_SERVICE_KIND:`node`}}const Xn=[`byte`,`kilo`,`mega`,`giga`,`tera`],Zn={iec:{base:1024,labels:[`B`,`KiB`,`MiB`,`GiB`,`TiB`]},"legacy-binary":{base:1024,labels:[`B`,`KB`,`MB`,`GB`,`TB`]}};function formatByteSize(e,t){let{base:r,labels:i}=Zn[t.style],a=Xn.indexOf(t.maxUnit),o=0,s=e;for(;s>=r&&o<a;)s/=r,o+=1;for(;;){let e=n(Xn[o],`byte-size unit`),c=n(i[o],`byte-size label`),l=typeof t.fractionDigits==`function`?t.fractionDigits(s,e):t.fractionDigits;if(l===null)return`${s}${t.separator}${c}`;let u=t.floorUnits?.includes(e)?Math.floor(s*10**l)/10**l:s;if(o<a&&Number(u.toFixed(l))>=r)s/=r,o+=1;else return`${u.toFixed(l)}${t.separator}${c}`}}function finiteNonNegativeNumber(e){let t=Number(e);return Number.isFinite(t)&&t>=0?t:null}function findExistingDiskSpacePath(e){let t=L.resolve(e);for(;;)try{return R.statSync(t).isDirectory()?t:L.dirname(t)}catch{let e=L.dirname(t);if(e===t)return null;t=e}}function tryReadDiskSpace(e){let t=findExistingDiskSpacePath(e);if(!t)return null;try{let n=R.statfsSync(t),r=finiteNonNegativeNumber(n.bsize),i=finiteNonNegativeNumber(n.bavail);if(r===null||i===null)return null;let a=finiteNonNegativeNumber(n.blocks);return{targetPath:e,checkedPath:t,availableBytes:r*i,totalBytes:a===null?null:r*a}}catch{return null}}function preparePostgresQuery(e){let t=``,n=0,r=!0,i,a;for(let o=0;o<e.length;){let s=e.slice(o),c=/^(?:[eE]'(?:\\[\s\S]|''|[^'\\])*'|'(?:''|[^'])*'|"(?:""|[^"])*"|`(?:``|[^`])*`|\[[^\]]*\]|--[^\n]*(?:\n|$))/.exec(s),l=/^\$(?:[A-Za-z_][A-Za-z_0-9]*)?\$/.exec(s)?.[0];if(s.startsWith(`/*`)){let n=o+2,r=1;for(;n<e.length&&r>0;)e.startsWith(`/*`,n)?(r++,n+=2):e.startsWith(`*/`,n)?(r--,n+=2):n++;t+=e.slice(o,n),o=n}else if(l){let n=e.indexOf(l,o+l.length),a=n<0?e.length:n+l.length;t+=e.slice(o,a),o=a,i=void 0,r=!1}else if(c)t+=c[0],o+=c[0].length,c[0].startsWith(`--`)||(i=void 0,r=!1);else{if(r&&/^pragma\b/i.test(s))throw Error(`The PostgreSQL engine does not support PRAGMA statements`);let c=/^(?:\d[\d_]*(?:\.[\d_]*)?|\.[\d_]+)(?:[eE][+-]?[\d_]+)?/.exec(s)?.[0];if(c){t+=c,o+=c.length,i=void 0,r=!1;continue}let l=/^[A-Za-z_][A-Za-z_0-9$]*/.exec(s)?.[0];if(l){let e=l.toUpperCase();i!==`AS`&&i!==`.`&&(e===`INTO`&&i!==`INSERT`&&i!==`MERGE`?a=`unscoped`:a===void 0&&/^(?:INSERT|UPDATE|DELETE|MERGE)$/.test(e)&&(e!==`UPDATE`||i!==`FOR`&&i!==`KEY`)&&(a=`scoped`)),i=e,t+=l,o+=l.length,r=!1;continue}let u=e.charAt(o);/\s/.test(u)||(i=u),u===`?`&&e[o+1]===`?`?(t+=`?`,o+=2):u===`?`?(t+=`$${++n}`,o++):(t+=u,o++),u===`;`?r=!0:/\s/.test(u)||(r=!1)}}return{sql:t,mutation:a}}function validatePostgresBindings(e){for(let t of e)if(t!==null&&typeof t!=`string`&&typeof t!=`number`&&typeof t!=`bigint`&&!ArrayBuffer.isView(t))throw TypeError(`SQL bindings must be null, numbers, bigints, strings, or ArrayBuffer views`)}function decodePostgresRows(e,t){return e.rows.map(n=>Object.fromEntries(e.fields.map(e=>{let r=n[e.name],i;if(r===null)i=null;else if(e.dataTypeID===20){if(typeof r!=`string`)throw TypeError(`PostgreSQL int8 results must be text`);let e=BigInt(r);if(t)i=e;else{let t=Number(e);if(!Number.isSafeInteger(t))throw RangeError(`PostgreSQL int8 ${e} cannot be represented safely as a number`);i=t}}else if(r instanceof Uint8Array)i=new Uint8Array(r);else if(typeof r==`boolean`)i=Number(r);else if(typeof r==`string`||typeof r==`number`||typeof r==`bigint`)i=r;else throw TypeError(`Unsupported PostgreSQL result type for column ${e.name}`);return[e.name,i]})))}function isPostgresConnectionError(e){return!e||e.startsWith(`08`)||/^57P0[123]$/.test(e)}function decodePostgresError(e){let t=Object.assign(Error(e.message),e);if(e.code===`57014`&&(t.name=`PostgresQueryCanceledError`),e.code===`55P03`||e.code===`40P01`||e.code===`40001`)return Object.assign(Error(e.message,{cause:t}),{code:`ERR_SQLITE_ERROR`,errcode:5});let n={23505:[2067,`UNIQUE`],23503:[787,`FOREIGN KEY`],23502:[1299,`NOT NULL`],23514:[275,`CHECK`]}[e.code??``];return n?Object.assign(Error(`${n[1]} constraint failed: ${e.constraint??e.column??`unknown`}`,{cause:t}),{code:`ERR_SQLITE_ERROR`,errcode:n[0]}):t}function sameFileStatFingerprint(e,t){return Gn(e,t)&&e.size===t.size}const Qn=[`owner.sqlite`,`owner.sqlite-journal`,`owner.sqlite-wal`,`owner.sqlite-shm`];var SqliteStagingRetiredError=class extends Error{constructor(){super(`SQLite snapshot parent retired; aborting snapshot allocation`)}};function acquireSqliteStagingToken(e,t,n={}){let r=Ye,acquire=()=>acquireStagingToken(e,t,n),i=t===`create`?acquire():r(acquire),a=Object.assign(e=>r(()=>i(e)),{beginRetirement:()=>(r(()=>i.beginRetirement()),a)});return a}function acquireStagingToken(e,t,n){let r=L.join(e,Qn[0]),readIdentity=(e,t)=>{let n=R.lstatSync(e,{bigint:!0});if(!(t===`directory`?n.isDirectory():n.isFile())||process.platform===`win32`&&(n.dev===0n||n.ino===0n))throw Error(`SQLite staging ownership is unknown`);return n},a=readIdentity(e,`directory`),o=Qn.map(t=>R.lstatSync(L.join(e,t),{throwIfNoEntry:!1})),s=o[0];if(o.some(e=>e&&(!e.isFile()||process.getuid&&e.uid!==process.getuid()))||!s&&t!==`create`&&!n.allowMissing)throw Error(`SQLite snapshot token ownership is unknown`);t===`create`&&!s&&R.writeFileSync(r,``,{flag:`wx`,mode:420});let c=s!==void 0||t===`create`,l=c?readIdentity(r,`file`):void 0;if(n.expectedIdentity){if(!l)throw Error(`SQLite staging ownership is unknown`);le(l,n.expectedIdentity)}let u=$e(()=>M(c?ht(r):r,{timeout:0},l&&Ee(l))),d,read=e=>cn(u,e,[],e=>e.get()),f=t===`reclaim`||t===`create`&&n.exclusiveCreate===!0,p=!1,assertIdentity=()=>{let t=readIdentity(e,`directory`);if(a.dev!==t.dev||a.ino!==t.ino)throw Error(`SQLite staging ownership changed before retirement`);let n=readIdentity(r,`file`);if(d.dev!==n.dev||d.ino!==n.ino)throw Error(`SQLite staging ownership changed before retirement`)},beginRetirement=()=>(assertIdentity(),u.isTransaction&&f||(u.isTransaction&&u.exec(`ROLLBACK`),u.exec(`BEGIN EXCLUSIVE`),f=!0),m),release=(e=!1)=>{u.isOpen&&(e?(beginRetirement(),p||u.exec(`PRAGMA user_version=1`),u.exec(`COMMIT`),p=!0):u.isTransaction&&u.exec(`ROLLBACK`),u.close(),e&&ge(r))},m=Object.assign(release,{beginRetirement});try{if(d=l??readIdentity(r,`file`),f?u.exec(`BEGIN EXCLUSIVE`):t===`create`?u.exec(`BEGIN IMMEDIATE`):u.exec(`BEGIN`),t!==`create`||s){let e=read(`PRAGMA journal_mode`);if(!i(e)||e.journal_mode!==`delete`)throw Error(`SQLite snapshot token journal mode is unknown`);let n=read(`PRAGMA user_version`),r=i(n)?n.user_version:void 0;if(r!==0&&(t!==`reclaim`||r!==1))throw new SqliteStagingRetiredError;p=r===1}return assertIdentity(),m}catch(e){throw release(),e}}const $n=`openclaw-sqlite-readonly-v2-`,er=`(?:[A-Za-z0-9]{6}|[\\da-f]{8}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{12})$`,tr=RegExp(`^openclaw-sqlite-readonly-[1-9]\\d*-${er}`,`u`),nr=RegExp(`^${$n}${er}`,`u`),rr=/^\.fs-safe-[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}\.tmp$/u;function releaseTokens(e){let t=st(e,e=>e());if(t.length)throw AggregateError(t,`SQLite snapshot retirement token release failed`)}const isSqliteSnapshotStagingName=e=>tr.test(e)||nr.test(e);function acquireSqliteSnapshotToken(e,t){return acquireSqliteStagingToken(e,t,{allowMissing:tr.test(L.basename(e))})}function beginSqliteSnapshotRetirement(e,t={}){let n=[],r=[],release=()=>releaseTokens(n.filter(e=>e!==t.token));if(!R.existsSync(e))return t.token?.(),{bytes:0,payload:r,release,retire:()=>{}};function inspect(i,a,o=``,s=!0){let c=R.lstatSync(i);if(!c.isDirectory()||process.getuid&&c.uid!==process.getuid())throw Error(`Snapshot directory ownership is unknown`);let l=!o&&tr.test(L.basename(i));if(!o&&t.allowLegacy===!1&&!nr.test(L.basename(i)))throw Error(`Legacy or unrecognized snapshot requires offline operator cleanup`);let u=t.cutoff!==void 0&&l?Math.min(a,Date.now()-864e5):a,d=l?`Legacy snapshot contains activity newer than 24 hours`:`Snapshot contains activity within the reclamation grace period`;if(c.mtimeMs>=u)throw Error(d);l&&s&&t.cutoff!==void 0&&inspect(i,u,o,!1),!o&&s&&n.push(i===e&&t.token?t.token.beginRetirement():acquireSqliteSnapshotToken(i,`reclaim`));let f=0,p=c.mtimeMs;for(let e of R.readdirSync(i,{withFileTypes:!0})){let n=L.join(i,e.name),a=R.lstatSync(n);if(process.getuid&&a.uid!==process.getuid())throw Error(`Snapshot file ownership is unknown`);if(o&&t.cutoff!==void 0||!a.isFile()||!Qn.some(t=>t===e.name)){if(p=Math.max(p,a.mtimeMs),a.isDirectory()){let r=isSqliteSnapshotStagingName(e.name),i=r?``:[o,e.name].filter(Boolean).join(`/`);if(t.cutoff!==void 0&&(!r&&![`openclaw`,`openclaw-state`,`openclaw-state/state`].includes(i)&&!/^openclaw\/sqlite-[a-f0-9]{24}$/u.test(i)||r&&o!==``&&o!==`openclaw`&&!/^openclaw\/sqlite-[a-f0-9]{24}$/u.test(o)))throw Error(`Unrecognized snapshot directory`);let a=inspect(n,u,i,s);f+=a.bytes,p=Math.max(p,a.newest)}else if(t.cutoff===void 0||a.isFile()&&(o===`openclaw-state/state`?/^openclaw\.sqlite(?:-wal|-shm|-journal)?$/u.test(e.name):!o&&(/^(?:first|database\.sqlite(?:\.partial)?(?:-wal|-shm|-journal)?)$/u.test(e.name)||e.name===`schema-discovery-ownership.json`||rr.test(e.name)||/^inspection-result-[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}\.json$/u.test(e.name))))f+=a.size,s&&r.push(n);else throw Error(`Unrecognized snapshot artifact`)}}if(p>=u)throw Error(d);return{bytes:f,newest:p}}try{let{bytes:i}=inspect(e,t.cutoff??1/0);return{bytes:i,payload:r,release,retire:()=>{for(let e of n)e(!0)}}}catch(e){throw release(),e}}const z=g(Symbol.for(`openclaw.sqliteSnapshotCleanup`),()=>({directories:/* @__PURE__ */ new Map,activeWork:/* @__PURE__ */ new Map,exitHandlerInstalled:!1,pendingSignalCleanup:void 0,signalCleanup:cleanupSnapshotOperations})),B=z.directories,V=z.activeWork;function snapshotDirectory(e){let t=B.get(e);return t||(t={readers:/* @__PURE__ */ new Set},B.set(e,t)),t}function completeSnapshotDirectoryRemoval(e){return B.delete(e),!0}function cleanupSnapshotOperations(){return z.pendingSignalCleanup??=(async()=>{let e=B.entries();for(;;){for(;V.size>0;){for(let e of V.values())e();await Promise.allSettled(V.keys())}let t=e.next();if(t.done)break;let[n]=t.value;await removeTempDirectoryAsync(n,e=>emitSnapshotCleanupFailure({cleanupRoot:n,operation:`rm`,code:b(e)}))}})().finally(()=>{z.pendingSignalCleanup=void 0}),z.pendingSignalCleanup}function retainSnapshotWork(e,t=()=>{}){registerSnapshotCleanup(),V.set(e,t);let release=()=>V.delete(e);return e.then(release,release),e}function registerSnapshotTempDirectory(e,t){let n=snapshotDirectory(e);n.release=t??n.release,registerSnapshotCleanup()}function registerSnapshotCleanup(){z.exitHandlerInstalled||(z.exitHandlerInstalled=!0,y(()=>{for(let e of V.values())e();if(V.size===0)for(let e of B.keys())removeTempDirectory(e)})),re(z.signalCleanup)}function retainSnapshotTempDirectory(e){registerSnapshotTempDirectory(e);let t=snapshotDirectory(e);if(t.retirementStarted)throw new S(`SQLite snapshot retirement has started`);let n=Symbol(`sqlite.snapshot.reader`);return t.readers.add(n),()=>t.readers.delete(n)}const ir={force:!0,maxRetries:3,recursive:!0,retryDelay:20};function emitSnapshotCleanupFailure(e,t){if(t)try{t(e);return}catch{}try{ae({subsystem:`infra/sqlite-snapshot`}).warn({path:e.cleanupRoot,operation:e.operation,errorCode:e.code},`SQLite read-only snapshot cleanup failed. Check directory permissions and available storage before retrying.`)}catch{}}function assertSnapshotReadersRetired(e){if(e?.readers.size)throw new S(`SQLite snapshot still belongs to an active reader`)}function prepareSnapshotRetirement(e,t){if(assertSnapshotReadersRetired(t),t?.releaseRetained)throw new S(`SQLite snapshot requires asynchronous cleanup`);if(!(t?.retired||!t?.release&&!R.existsSync(L.join(e,Qn[0]))))return t&&(t.retirementStarted=!0),beginSqliteSnapshotRetirement(e,{token:t?.release})}function*shrinkSnapshotPayload(e){let t=R.lstatSync(e,{throwIfNoEntry:!1});if(t?.isDirectory())for(let t of R.readdirSync(e))yield*shrinkSnapshotPayload(L.join(e,t));else if(t?.isFile()&&t.nlink>1)R.unlinkSync(e);else if(t?.isFile()&&t.nlink===1&&t.size>64*1024**2){let n=R.openSync(e,R.constants.O_RDWR|R.constants.O_NOFOLLOW);try{for(let e=t.size;e>64*1024**2;)e-=64*1024**2,yield{fd:n,size:e}}finally{R.closeSync(n)}}}async function shrinkSnapshotPayloadAsync(e){for(let{fd:t,size:n}of shrinkSnapshotPayload(e))await retainSnapshotWork(new Promise((e,r)=>{R.ftruncate(t,n,t=>t?r(t):e())}))}function*retireSqliteSnapshotPayload(e){for(let t of e.payload){ge(t);for(let{fd:e,size:n}of shrinkSnapshotPayload(t))R.ftruncateSync(e,n),yield;R.rmSync(t,ir)}e.retire()}function removeTempDirectory(e,t){let n=B.get(e);n&&(n.cleanupFailure=void 0);try{let t=prepareSnapshotRetirement(e,n);try{if(t){for(let e of retireSqliteSnapshotPayload(t));n=snapshotDirectory(e),n.release=void 0,n.retired=!0}else if(!n?.retired)for(let{fd:t,size:n}of shrinkSnapshotPayload(e))R.ftruncateSync(t,n);try{R.rmSync(e,ir)}catch(t){throw Te(e,t)}}finally{t?.release()}return completeSnapshotDirectoryRemoval(e)}catch(n){return registerSnapshotTempDirectory(e),snapshotDirectory(e).cleanupFailure=n,t?.(n),!1}}async function removeTempDirectoryAsync(e,t){let n=B.get(e);if(n?.releaseRetained){let r=await startRemoveTempDirectory(e,t,n).result;return r&&B.delete(e),r}n&&(n.cleanupFailure=void 0);try{let t=prepareSnapshotRetirement(e,n);try{for(let e of t?.payload??[])ge(e),await shrinkSnapshotPayloadAsync(e),await retainSnapshotWork(R.promises.rm(e,ir));t?(t.retire(),n=snapshotDirectory(e),n.release=void 0,n.retired=!0):n?.retired||await shrinkSnapshotPayloadAsync(e);try{await retainSnapshotWork(R.promises.rm(e,ir))}catch(t){throw Te(e,t)}}finally{t?.release()}return completeSnapshotDirectoryRemoval(e)}catch(n){return registerSnapshotTempDirectory(e),snapshotDirectory(e).cleanupFailure=n,t?.(n),!1}}function startRemoveTempDirectory(e,t,n=B.get(e)){if(n?.retiringRetained)return n.retiringRetained;let r,i=Ie(()=>{if(!r||i.operation.read().status!==`pending`)return;r.service();let a=r.read();a.status!==`pending`&&(n&&(n.retiringRetained=void 0),a.status===`rejected`?(snapshotDirectory(e).cleanupFailure=a.error,t?.(a.error),i.resolve(!1)):i.resolve(completeSnapshotDirectoryRemoval(e)))});try{if(n&&(n.cleanupFailure=void 0),sealRetainedSnapshotTempDirectory(e),!n?.releaseRetained)throw new S(`SQLite snapshot has no retained cleanup owner`);n.retiringRetained=i.operation,r=n.releaseRetained(),r.result.then(()=>i.operation.service(),()=>i.operation.service()),i.operation.service()}catch(r){snapshotDirectory(e).cleanupFailure=r,n&&(n.retiringRetained=void 0),t?.(r),i.resolve(!1)}return i.operation}function sealRetainedSnapshotTempDirectory(e,t){let n=B.get(e);if(!n?.releaseRetained)throw new S(`SQLite snapshot has no retained cleanup owner`);if(t?.requireRequested&&!n.retirementStarted)throw new S(`SQLite snapshot is still owned; cleanup has not been requested`);let r=[...B].filter(([t])=>o(e,t));for(let[,e]of r)assertSnapshotReadersRetired(e);for(let[,e]of r)e.retirementStarted=!0;let i=/* @__PURE__ */ new Set([...me().map(({location:e})=>e),...Ae()]);for(let t of i)o(e,t)&&ge(t)}function adoptPreparedLocation(e,t,n=!1,r){let i=t??L.dirname(e);registerSnapshotTempDirectory(i);let a=!0,o,s,c=!1,reportFailure=e=>{!n&&!c&&(c=!0,emitSnapshotCleanupFailure({cleanupRoot:i,operation:`rm`,code:b(e)},r))},complete=e=>{if(e)a=!1,B.delete(i);else if(n)throw new S(`SQLite read-only worker snapshot cleanup failed: ${i}`,{cause:B.get(i)?.cleanupFailure});return e},startCleanup=()=>{if(s?.read().status===`pending`)return s;if(!a){let e=Ie(()=>{});return e.resolve(complete(!0)),s=e.operation}return s=Ge(startRemoveTempDirectory(i,reportFailure),complete)};return{location:e,cleanupRoot:i,cleanup:()=>o||s?.read().status===`pending`?n?complete(!1):!1:complete(!a||removeTempDirectory(i,reportFailure)),cleanupAsync:()=>B.get(i)?.releaseRetained||s?startCleanup().result:o||(a?(o=Promise.resolve().then(()=>removeTempDirectoryAsync(i,reportFailure)).then(complete).finally(()=>{o=void 0}),o):Promise.resolve(complete(!0))),startCleanup}}const ar=/* @__PURE__ */ new Set([`--no-maglev`,`--maglev`,`--no-concurrent-sparkplug`,`--concurrent-sparkplug`]);function resolveForwardedNodeCompilerArgs(){return process.execArgv.filter(e=>ar.has(e.replaceAll(`_`,`-`)))}const or=g(Symbol.for(`openclaw.artifactPreservingStateReads`),()=>new I),sr=g(Symbol.for(`openclaw.liveStateReads`),()=>new I);function isLiveStateRead(){return sr.getStore()!==void 0}function isArtifactPreservingStateRead(e=`shared`,t){let n=or.getStore();return!(!n||e!==`shared`&&!n.agentDatabases||t&&[...n.privateRoots].some(e=>Ln(e,t)))}const cr=new h(Symbol(`sqliteReadOnlyWorkerScope`)),lr=Vn(`openclaw.memory.critical`);function createStateWorkerMemoryPressureSubscription(e,t){let n=!1,onPressure=e=>t(e===!0);return()=>{let t=e();t!==n&&(n=t,t?lr.subscribe(onPressure):lr.unsubscribe(onPressure))}}const ur={"startupMetadata.readCurrent":`retire-after-result`,"startupMetadata.rollbackRecoveryRequired":`retire-after-result`};function sqliteReadOnlyOperationRequiresProcessRetirement(e){return e in ur}const dr=/* @__PURE__ */ new Set([`-lc`,`-c`,`--command`,`--commands`,`--cmdline`]);[...dr];function expandPowerShellSwitchPrefixForms(e,t){let n=[];for(let r=t.length;r<=e.length;r+=1){let t=e.slice(0,r);n.push(`-${t}`,`--${t}`,`/${t}`)}return n}function expandPowerShellSwitchForms(e){return e.flatMap(e=>{let t=d(e);return[`-${t}`,`--${t}`,`/${t}`]})}const fr=[...expandPowerShellSwitchPrefixForms(`command`,`c`),...expandPowerShellSwitchPrefixForms(`commandwithargs`,`cwa`),...expandPowerShellSwitchForms([`cwa`])],pr=expandPowerShellSwitchPrefixForms(`file`,`f`),mr=new Set(pr);new Set(expandPowerShellSwitchPrefixForms(`noprofile`,`nop`)),[...expandPowerShellSwitchPrefixForms(`configurationfile`,`conf`),...expandPowerShellSwitchPrefixForms(`configurationname`,`config`),...expandPowerShellSwitchPrefixForms(`custompipename`,`cus`),...expandPowerShellSwitchPrefixForms(`encodedarguments`,`encodeda`),...expandPowerShellSwitchForms([`ea`]),...expandPowerShellSwitchPrefixForms(`interactive`,`i`),...expandPowerShellSwitchPrefixForms(`login`,`l`),...expandPowerShellSwitchPrefixForms(`namedpipeservermode`,`nam`),...expandPowerShellSwitchPrefixForms(`noexit`,`noe`),...expandPowerShellSwitchPrefixForms(`psconsolefile`,`pscf`),...expandPowerShellSwitchForms([`pscf`]),...expandPowerShellSwitchPrefixForms(`servermode`,`s`),...expandPowerShellSwitchPrefixForms(`settingsfile`,`settings`),...expandPowerShellSwitchPrefixForms(`socketservermode`,`so`),...expandPowerShellSwitchPrefixForms(`sshservermode`,`ssh`),...expandPowerShellSwitchPrefixForms(`v2socketservermode`,`v2so`)];const hr=/* @__PURE__ */ new Set([...expandPowerShellSwitchPrefixForms(`encodedcommand`,`e`),...expandPowerShellSwitchPrefixForms(`ec`,`e`)]),gr=/* @__PURE__ */ new Set([...fr,...pr,...hr]),_r=new Set(fr),vr=/* @__PURE__ */ new Set([...expandPowerShellSwitchPrefixForms(`configurationfile`,`conf`),...expandPowerShellSwitchPrefixForms(`configurationname`,`config`),...expandPowerShellSwitchPrefixForms(`custompipename`,`cus`),...expandPowerShellSwitchPrefixForms(`encodedarguments`,`encodeda`),...expandPowerShellSwitchPrefixForms(`executionpolicy`,`ex`),...expandPowerShellSwitchPrefixForms(`inputformat`,`inp`),...expandPowerShellSwitchPrefixForms(`outputformat`,`o`),...expandPowerShellSwitchPrefixForms(`psconsolefile`,`pscf`),...expandPowerShellSwitchPrefixForms(`settingsfile`,`settings`),...expandPowerShellSwitchPrefixForms(`token`,`to`),...expandPowerShellSwitchPrefixForms(`utctimestamp`,`utc`),...expandPowerShellSwitchPrefixForms(`version`,`v`),...expandPowerShellSwitchPrefixForms(`windowstyle`,`w`),...expandPowerShellSwitchPrefixForms(`workingdirectory`,`w`),...expandPowerShellSwitchForms([`ea`,`ep`,`if`,`of`,`pscf`,`wd`])]),yr=/* @__PURE__ */ new Set([`--init-file`,`--rcfile`,`-O`,`-o`,`+O`,`+o`]);function countSeparateValueOptionChars(e){let t=0;for(let n=1;n<e.length;n+=1){let r=e[n];(r===`o`||r===`O`)&&(t+=1)}return t}function parseCombinedCommandFlag(e){if(e.length<2||e[0]!==`-`||e[1]===`-`)return null;let t=e.slice(1),n=t.indexOf(`c`);if(n===-1||t.includes(`-`))return null;let r=t.slice(n+1);return r&&!/^[A-Za-z]+$/.test(r)?{attachedCommand:r,separateValueCount:0}:{attachedCommand:null,separateValueCount:countSeparateValueOptionChars(e)}}function combinedSeparateValueOptionCount(e){return e.length<2||e[0]!==`-`&&e[0]!==`+`||e[1]===`-`||e.slice(1).includes(`-`)?0:countSeparateValueOptionChars(e)}function advancePosixInlineOptionScan(e){let t=combinedSeparateValueOptionCount(e);return t>0?1+t:yr.has(e)?2:1}function isPowerShellOptionToken(e){return e.startsWith(`-`)||/^\/[A-Za-z][A-Za-z0-9]*$/.test(e)}function resolveInlineCommandMatch(e,t,n={}){for(let r=1;r<e.length;){let i=e[r]?.trim();if(!i){r+=1;continue}let a=d(i);if(a===`--`)break;let o=n.allowCombinedC?i:a,s=t.has(o),c=!s&&n.allowCombinedC?parseCombinedCommandFlag(i):null;if(s||c){if(c&&c.attachedCommand!==null)return{command:c.attachedCommand.trim()||null,valueTokenIndex:r};let t=r+1+(c?.separateValueCount??0),i=!c&&t>=e.length?null:t;return{command:(s&&n.restValueFlags?.has(o)?e.slice(r+1).map(e=>e.trim()).join(` `).trim():e[t]?.trim())||null,valueTokenIndex:i}}if(n.valueOptions?.has(a)){r+=2;continue}let l=n.isOptionToken?.(i)??(i.startsWith(`-`)||i.startsWith(`+`));if(n.stopAtFirstNonOption&&!l||n.allowCombinedC&&!i.startsWith(`-`)&&!i.startsWith(`+`))break;r+=n.allowCombinedC?advancePosixInlineOptionScan(i):1}return{command:null,valueTokenIndex:null}}function resolvePowerShellInlineCommandMatch(e){return resolveInlineCommandMatch(e,gr,{isOptionToken:isPowerShellOptionToken,restValueFlags:_r,stopAtFirstNonOption:!0,valueOptions:vr})}function isPowerShellInlineFileCommandFlag(e){return mr.has(d(e))}function resolveOomScoreWrappedCommand(e,t){return e===`/bin/sh`&&t[0]===`-c`&&(t[1]===`echo 1000 > /proc/self/oom_score_adj 2>/dev/null; exec "$0" "$@"`||t[1]==='echo 1000 > /proc/self/oom_score_adj 2>/dev/null; if [ "${OC_INTERNAL_OOM_EXEC_BASH_ENV+x}" = x ]; then BASH_ENV="$OC_INTERNAL_OOM_EXEC_BASH_ENV"; export BASH_ENV; fi; unset OC_INTERNAL_OOM_EXEC_BASH_ENV; if [ "${OC_INTERNAL_OOM_EXEC_ENV+x}" = x ]; then ENV="$OC_INTERNAL_OOM_EXEC_ENV"; export ENV; fi; unset OC_INTERNAL_OOM_EXEC_ENV; if [ "${OC_INTERNAL_OOM_EXEC_CDPATH+x}" = x ]; then CDPATH="$OC_INTERNAL_OOM_EXEC_CDPATH"; export CDPATH; fi; unset OC_INTERNAL_OOM_EXEC_CDPATH; if [ "${OC_INTERNAL_OOM_EXEC_PS4+x}" = x ]; then PS4="$OC_INTERNAL_OOM_EXEC_PS4"; export PS4; fi; unset OC_INTERNAL_OOM_EXEC_PS4; exec "$0" "$@"')&&t[2]?t[2]:void 0}const br=g(Symbol.for(`openclaw.childProcessSpawnCounts`),()=>({counts:/* @__PURE__ */ new Map,sampledAt:performance.now()})),xr=/^(node|bun|git|ps|pgrep|lsof|sh|bash|zsh|cmd|powershell|pwsh|npm|pnpm|python|python3|uv|ssh|openclaw)$/,Sr=g(Symbol.for(`openclaw.gitSpawnOperation`),()=>new I),Cr=g(Symbol.for(`openclaw.childSpawnOperation`),()=>new I);function unscopedProcessOperation(e,t,n){if(n[0]===`--version`||n[0]===`-v`&&(e===`node`||e===`bun`||t===`gh`))return`unscoped.version`;if(e===`powershell`||e===`pwsh`){let e=[t,...n],{command:r,valueTokenIndex:i}=resolvePowerShellInlineCommandMatch(e);return r!==null&&i!==null&&!isPowerShellInlineFileCommandFlag(e[i-1]??``)?`unscoped.shell-command`:`unscoped.shell`}return/^(sh|bash|zsh)$/.test(e)?resolveInlineCommandMatch([t,...n],dr,{allowCombinedC:!0}).command===null?`unscoped.shell`:`unscoped.shell-command`:e===`cmd`?n.some(e=>/^-[a-z]*c$/.test(e)||/^\/(?:c|k)$/i.test(e))?`unscoped.shell-command`:`unscoped.shell`:e===`node`||e===`bun`?`unscoped.runtime`:e===`other`&&/^(gh|docker|podman|which|uname|sw_vers|sysctl|curl|tar)$/.test(t)?`unscoped.${t}`:`unscoped.command`}function unscopedGitOperation(e){let t=0;for(;t<e.length;){let n=e[t];if([`-C`,`-c`,`--git-dir`,`--work-tree`,`--namespace`,`--config-env`].includes(n))t+=2;else if(/^--(?:git-dir|work-tree|namespace|config-env|attr-source)=/u.test(n))t++;else if([`--no-pager`,`--no-optional-locks`,`--no-lazy-fetch`,`--literal-pathspecs`,`--bare`].includes(n))t++;else break}let n=e[t]??``;return/^(config|rev-parse|status|diff|ls-files|rev-list|merge-base|cat-file|symbolic-ref|for-each-ref|show-ref|remote|log|show|hash-object|update-ref|worktree|branch|fetch|clone|init|checkout|read-tree|write-tree|commit-tree|pack-objects|index-pack|maintenance|multi-pack-index|gc|fast-import|add|commit|push|reset|clean|merge|tag|describe|switch|ls-tree|update-index|check-ref-format|diff-tree|diff-index|diff-files|sparse-checkout|checkout-index|check-attr|mktree|var|apply|fsck|ls-remote|rebase|reflog)$/u.test(n)?`unscoped.${n}`:n===`--version`||n===`version`?`unscoped.version`:`unscoped.other`}function prepareChildProcessSpawnRecorder(e,t=[],n){if(!te())return;let r=resolveOomScoreWrappedCommand(e,t),i=r?t.slice(3):t,a=L.win32.basename(r??e).toLowerCase().replace(/\.(exe|cmd)$/,``),o=xr.test(a)?a:`other`,s=o===`git`?Sr.getStore()??Cr.getStore()??unscopedGitOperation(i):n??Cr.getStore()??unscopedProcessOperation(o,a,i),c=`${o}:${s}`;return()=>{if(te()){let e=br.counts.get(c);br.counts.set(c,{family:o,operation:s,count:(e?.count??0)+1})}}}function recordChildProcessSpawn(e,t,n,r=[]){let i=prepareChildProcessSpawnRecorder(e,r,n);i&&t.once(`spawn`,i)}function ok(e){return{ok:!0,value:e}}function err(e){return{ok:!1,error:e}}const wr=/^[a-z0-9][a-z0-9_-]{0,63}$/i,Tr=/[^a-z0-9_-]+/g,Er=/^-+/,Dr=/-+$/;function normalizeAgentId(e){let t=normalizeAgentIdStrict(e);return t.ok?t.value:`main`}function normalizeAgentIdStrict(e){let t=(e??``).trim(),n=t.toLowerCase();if(wr.test(t))return ok(n);let r=n.replace(Tr,`-`).replace(Er,``).replace(Dr,``).slice(0,64);return r?ok(r):err(`unrepresentable`)}const Or=`incognito-openclaw-agent.sqlite`;(/* @__PURE__ */ new Map()).keys();const kr=g(Symbol.for(`openclaw.agentCreationClaim`),()=>new I),Ar=g(Symbol.for(`openclaw.agentCreationClaimResources`),()=>/* @__PURE__ */ new Map);function getActiveAgentCreationClaim(e,t){let n=kr.getStore();if(n&&n.kind===`host`&&n.isActive()&&n.agentId===normalizeAgentId(e)&&n.statePath===L.resolve(t))return n}function reserveAgentCreationClaimAdmission(e,t,n){let r=getActiveAgentCreationClaim(t.agentId,fn(t.env??process.env));if(r)return Ar.set(e,r),r.registerClose(async()=>{Ar.get(e)===r&&(await n(),Ar.delete(e))}),()=>{Ar.delete(e)}}const jr=g(Symbol.for(`openclaw.agentDatabaseExecutionAdmissionClosedError`),()=>class extends Error{});g(Symbol.for(`openclaw.agentDatabaseSchemaAdmissionChangedError`),()=>class extends Error{constructor(){super(`Agent schema admission changed before publication; retry the operation`)}}),g(Symbol.for(`openclaw.agentDatabaseSchemaAdmissionInvalidError`),()=>class extends Error{constructor(){super(`Invalid agent schema admission receipt`)}}),g(Symbol.for(`openclaw.agentDatabaseStartupPublicationError`),()=>class extends Error{constructor(e){super(pt(e),{cause:e})}});const Mr=g(Symbol.for(`openclaw.agentDeletionDatabaseCleanup`),()=>new I);g(Symbol.for(`openclaw.agentDeletionDatabaseCleanupHandles`),()=>/* @__PURE__ */ new Map),g(Symbol.for(`openclaw.agentDeletionDatabaseCleanupExecutions`),()=>/* @__PURE__ */ new Map);function captureAgentDeletionResourceOwner(e){let t=Mr.getStore();if(t?.ownsDatabase&&(e(t)||t.canonicalPath&&e({agentId:t.agentId,path:t.canonicalPath})))return t.assertCurrentHost(),t}const H=g(Symbol.for(`openclaw.agentDatabaseAsyncResources`),()=>({active:/* @__PURE__ */ new Set,closing:/* @__PURE__ */ new Map,selections:/* @__PURE__ */ new Map}));bn(async(e,t)=>{let n=(await Promise.allSettled([.../* @__PURE__ */ new Set([...H.active,...H.closing.keys()])].filter(n=>!t?.has(L.resolve(n.path))&&e.some(e=>F(e,n.path))).map(e=>closeAgentDatabaseResource(e)))).flatMap(e=>e.status===`rejected`?[e.reason]:[]);if(n.length>0)throw AggregateError(n,`Agent database resource cleanup failed`)});function matchesAgentDatabaseClose(e,t){return(e.path===void 0||e.path===t.path||t.ownership===`unresolved`&&F(t,e.path))&&(e.rootPath===void 0||o(e.rootPath,t.path)||t.ownership===`unresolved`&&F(t,e.rootPath))&&(e.agentId===void 0||t.ownership===`unresolved`||e.agentId===t.agentId)}function registerOpenClawAgentDatabaseReadCandidateResource(e){return registerAgentDatabaseResource({...e,ownership:`unresolved`})}function registerAgentDatabaseResource(e,t){let n={...e,path:L.resolve(e.path)};n.cleanupOwner=captureAgentDeletionResourceOwner(e=>matchesAgentDatabaseClose(e,n)),assertAgentDatabaseResourceAdmission(n);let r=t&&n.ownership===`known`?reserveAgentCreationClaimAdmission(n,t,()=>closeAgentDatabaseResource(n)):void 0,unregister=()=>{H.active.delete(n),r?.(),H.onRelease?.(n)};return P()?.own(unregister,`agent-resources`,()=>closeAgentDatabaseResource(n)),H.active.add(n),unregister}function assertAgentDatabaseResourceAdmission(e){if([...H.selections.keys()].some(t=>matchesAgentDatabaseClose(t,e))||[...H.closing.keys()].some(t=>(t.path===e.path||t.ownership===`unresolved`&&F(t,e.path)||e.ownership===`unresolved`&&F(e,t.path))&&(t.ownership===`unresolved`||e.ownership===`unresolved`||t.agentId===e.agentId)))throw new jr(`Agent database resources are closing: ${e.path}`)}function closeAgentDatabaseResource(e,t){if(e.ownership===`known`&&e.closeSync){H.closing.set(e,void 0);try{return e.revoke(),e.closeSync(),H.active.delete(e),H.closing.delete(e),H.onRelease?.(e),Promise.resolve()}catch(n){t&&t(e.path,n);let r=Promise.reject(m(n,`Agent database cleanup failed`));return r.catch(()=>{}),r}}let n=H.closing.get(e);return n||(n=Promise.resolve().then(()=>e.close()),H.closing.set(e,n),n.then(()=>{H.active.delete(e),H.closing.delete(e),H.onRelease?.(e)},()=>{H.closing.set(e,void 0)}).catch(()=>{})),t&&n.catch(n=>t(e.path,n)).catch(()=>{}),e.revoke(),n}function captureSqliteAuthSchema(e,t){if(Ce(e)?.key!==t)return;let n=Ne(e,Et,()=>void 0);if(!n)return;let kind=e=>n.tables.has(e)?`table`:n.views.has(e)||n.indexes.has(e)||n.triggers.has(e)?`other`:`missing`;return{userVersion:n.userVersion,store:kind(`auth_profile_store`),state:kind(`auth_profile_state`)}}function isJsonTransferField(e){return i(e)?e.kind===`object`||e.kind===`array`||e.kind===`end`||(e.kind===`key`||e.kind===`value`)&&(e.append===void 0||e.append===!0&&typeof e.value==`string`)&&(typeof e.value==`string`||e.kind===`value`&&(e.value===null||typeof e.value==`boolean`||typeof e.value==`number`)):!1}function createJsonFieldReceiver(){let e,t=!1,n=[],r,write=r=>{let i=n.at(-1);if(i){if(i.key===void 0)throw Error(`JSON field has no property key`);Object.defineProperty(i.container,i.key,{value:r,writable:!0,enumerable:!0,configurable:!0}),i.key=void 0}else{if(t)throw Error(`JSON transfer has more than one root`);e=r,t=!0}},flush=()=>{if(!r)return;let e=r.chunks.join(``);if(r.kind===`key`){let t=n.at(-1);if(!t||t.key!==void 0)throw Error(`JSON property key has no value or container`);t.key=e}else write(e);r=void 0};return{accept(e){if(!isJsonTransferField(e))throw Error(`Invalid JSON transfer field`);if(e.kind===`key`||e.kind===`value`){if(e.append){if(!r||r.kind!==e.kind||typeof e.value!=`string`)throw Error(`Invalid JSON string continuation`);r.chunks.push(e.value);return}flush(),typeof e.value==`string`?r={kind:e.kind,chunks:[e.value]}:write(e.value)}else if(flush(),e.kind===`end`){let e=n.pop();if(!e||e.key!==void 0)throw Error(`JSON container ended with an incomplete field`)}else{let t=e.kind===`array`?[]:{};write(t),n.push({container:t})}},finish(){if(flush(),n.length)throw Error(`JSON transfer ended with an incomplete container`);return e}}}function createSqliteWorkerTransferOwner(){let e=0,t,cleanup=e=>{let t=[];for(let[n,r]of[[`iteratorClosed`,()=>e.iterator.return?.()],[`cleaned`,()=>e.cleanup?.()]])if(!e[n])try{r(),e[n]=!0}catch(e){t.push(e)}C(t,`SQLite read transfer cleanup failed`)},cancel=()=>{t&&=(cleanup(t),void 0)},requireTransfer=e=>{if(!t||t.id!==e)throw Error(`SQLite read transfer is no longer active`);return t};return{start(n,r){if(t)throw Error(`The preceding SQLite read transfer was not released`);return t={id:++e,iterator:n,cleanup:r.cleanup,iteratorClosed:!1,cleaned:!1,counts:new Map(r.kinds.map(e=>[e,0])),sequence:0,finished:!1},{id:t.id,kinds:[...t.counts.keys()]}},next(e){let t=requireTransfer(e);if(t.finished)throw Error(`SQLite read transfer has already reached its end`);if(t.record&&t.record.offset===t.record.bytes.byteLength&&(t.record=void 0),!t.record){let n=t.iterator.next();if(n.done)return cleanup(t),t.finished=!0,{id:e,sequence:t.sequence++,done:!0,counts:[...t.counts]};let{kind:r}=n.value,i=t.counts.get(r);if(i===void 0)throw Error(`SQLite read transfer returned an unexpected record kind`);t.record={kind:r,bytes:`serialized`in n.value?n.value.serialized:Bn(n.value.value),offset:0},t.counts.set(r,i+1)}let n=t.record,r=n.offset,i=Math.min(n.bytes.byteLength,r+8388608);return n.offset=i,{id:e,sequence:t.sequence++,done:!1,kind:n.kind,recordBytes:n.bytes.byteLength,offset:r,recordDone:i===n.bytes.byteLength,bytes:new Uint8Array(n.bytes.subarray(r,i))}},end(e){if(!requireTransfer(e).finished)throw Error(`SQLite read transfer ended before its complete result`);cancel()},cancel,close:cancel}}function createSqliteWorkerTransferReceiver(e,t){let n=new Map(e.kinds.map(e=>[e,0])),r=0,i=!1,a;return{accept(o){try{if(i||o.id!==e.id||o.sequence!==r++)throw Error(`SQLite read transfer frame is out of order`);if(o.done){if(a||o.counts.length!==n.size||o.counts.some(([e,t])=>n.get(e)!==t)||new Set(o.counts.map(([e])=>e)).size!==n.size)throw Error(`SQLite read transfer ended with an incomplete result`);return i=!0,o.counts}let s=n.get(o.kind);if(s===void 0||!Number.isSafeInteger(o.recordBytes)||o.recordBytes<1||!Number.isSafeInteger(o.offset)||o.offset<0||o.bytes.byteLength<1||o.bytes.byteLength>8388608)throw Error(`SQLite read transfer returned an invalid frame`);if(!a){if(o.offset!==0)throw Error(`SQLite read transfer omitted the start of a record`);a={kind:o.kind,bytes:o.recordDone?o.bytes:new Uint8Array(o.recordBytes),offset:0}}let c=o.offset+o.bytes.byteLength;if(a.kind!==o.kind||a.bytes.byteLength!==o.recordBytes||a.offset!==o.offset||c>o.recordBytes||o.recordDone!==(c===o.recordBytes))throw Error(`SQLite read transfer returned a discontinuous record`);if(a.bytes!==o.bytes&&a.bytes.set(o.bytes,o.offset),a.offset=c,o.recordDone){let e=zn(a.bytes),r=a.kind;a=void 0,t({kind:r,value:e}),n.set(r,s+1)}return}catch(e){throw a=void 0,i=!0,e}}}}function decodeFrame(e,t){if(e.done)return e;if(e.bytes.length>11184812)throw Error(`Invalid ${t} transfer bytes`);let n=Buffer.from(e.bytes,`base64`);if(n.toString(`base64`)!==e.bytes)throw Error(`Invalid ${t} transfer encoding`);return{...e,bytes:n}}function createSqliteReadOnlyTransferReceiver(e){let t,n,r=!1,i=!1;return{accept(a){if(i)throw Error(`Invalid ${e.label} transfer response`);if(a.type===`start`&&!t){let r=a.handle;if(!Number.isSafeInteger(r.id)||r.id<1||r.kinds.length!==e.kinds.length||r.kinds.some((t,n)=>t!==e.kinds[n]))throw Error(`Invalid ${e.label} transfer handle`);return n=r.id,t=createSqliteWorkerTransferReceiver({id:n,kinds:e.kinds},({kind:t,value:n})=>e.acceptRecord(t,n)),{request:{type:`next`,transferId:n}}}if(!t||n===void 0)throw Error(`${e.label.charAt(0).toUpperCase()}${e.label.slice(1)} transfer has not started`);if(a.type===`frame`&&!r){let i=decodeFrame(a.frame,e.label);if(!i.done&&e.maxRecordBytes&&i.recordBytes>e.maxRecordBytes)throw Error(`${e.label} transfer record exceeds its bound`);let o=t.accept(i);if(o){if(o.length!==e.kinds.length||o.some(([,e])=>e<1))throw Error(`Incomplete ${e.label} transfer result`);r=!0}return{request:{type:r?`end`:`next`,transferId:n}}}if(a.type===`complete`&&r)return i=!0,{value:e.readResult()};throw Error(`${e.label.charAt(0).toUpperCase()}${e.label.slice(1)} transfer response is out of order`)}}}function createSqliteAuthTransferReceiver(){let e=createJsonFieldReceiver();return createSqliteReadOnlyTransferReceiver({kinds:[`fields`],label:`auth profile`,maxRecordBytes:65536,acceptRecord(t,n){if(!Array.isArray(n))throw Error(`Invalid auth profile field batch`);for(let t of n)e.accept(t)},readResult(){let t=e.finish();if(!i(t)||!(`store`in t)||!(`state`in t)||typeof t.cacheable!=`boolean`)throw Error(`Invalid auth profile transfer rows`);return{store:t.store,state:t.state,cacheable:t.cacheable}}})}function createSqliteOperationTransferReceiver(e){let t;return createSqliteReadOnlyTransferReceiver({kinds:[`result`],label:`SQLite operation`,acceptRecord(n,r){if(t||!i(r)||r.operation!==e||!(`value`in r))throw Error(`SQLite read-only worker returned a different or duplicate operation`);t={operation:e,value:r.value}},readResult(){if(!t)throw Error(`SQLite read-only worker returned no operation`);return t}})}const Nr=/* @__PURE__ */ new WeakSet;function markPrivateDirectoryCreationRefused(e){return typeof e==`object`&&e&&Nr.add(e),e}function isPrivateDirectoryCreationRefused(e){return typeof e==`object`&&!!e&&Nr.has(e)}var SqliteSnapshotCapacityError=class extends Error{constructor(e,t){super(e,t),this.name=`SqliteSnapshotCapacityError`}};function hasSqliteSnapshotCapacityCode(e){let{code:t,errcode:n}=e;return t===`ENOSPC`||t===`EDQUOT`||n===13}function isSqliteSnapshotStagingMode(e){return e===`staging-create`||e===`staging-create-legacy`||e===`staging-reconcile`||e===`staging-retire`}var SqliteReadOnlyInspectionContentionError=class extends Error{};function sqliteReadOnlyWorkerRequestArgs(e,t){let n=[t.mode,L.resolve(e)];if(t.mode===`task-delivery-recovery`)return[...n,L.resolve(t.recoveryDirectory),L.resolve(t.sourcePath)];let r=t.stagingRoot&&L.resolve(t.stagingRoot);if(t.mode===`private-fork`)return[...n,r??``,JSON.stringify(t.family)];let i=t.mode===`auth-profile-rows`||t.mode===`operation`?void 0:t.expectedSourceIdentity;if(i!==void 0){if(t.mode!==`sync`&&t.mode!==`staged-sync`&&t.mode!==`metadata`)throw Error(`SQLite source identity is supported only for sync or metadata snapshots`);n.push(r??``,JSON.stringify(pe(i)))}else r&&n.push(r);return n}function isSqliteReadOnlyWorkerResult(e){return!e||typeof e!=`object`||Array.isArray(e)?!1:`ok`in e&&e.ok===!1&&`message`in e&&typeof e.message==`string`?Object.keys(e).length===2||Object.keys(e).length===3&&`errcode`in e&&typeof e.errcode==`number`&&Number.isInteger(e.errcode)&&e.errcode>=0&&e.errcode<=2147483647:Object.keys(e).length!==2||!(`ok`in e)?!1:e.ok===!0&&`engine`in e&&i(e.engine)&&(e.engine.engine===`sqlite`||e.engine.engine===`postgres`&&typeof e.engine.storeId==`string`&&typeof e.engine.namespace==`string`)||e.ok===!0&&`reclamation`in e&&i(e.reclamation)&&[e.reclamation.removed,e.reclamation.bytes,e.reclamation.skipped].every(e=>typeof e==`number`&&Number.isFinite(e)&&e>=0)||e.ok===!0&&`hasExistingData`in e&&typeof e.hasExistingData==`boolean`||e.ok===!0&&`location`in e&&typeof e.location==`string`||e.ok===!0&&`contentVersion`in e&&typeof e.contentVersion==`string`&&/^(?:[a-f0-9]{64})?$/.test(e.contentVersion)||e.ok===!0&&`generation`in e&&typeof e.generation==`string`||e.ok===!0&&`taskDeliveryRecovery`in e&&i(e.taskDeliveryRecovery)&&Object.keys(e.taskDeliveryRecovery).length===2&&typeof e.taskDeliveryRecovery.count==`number`&&Number.isSafeInteger(e.taskDeliveryRecovery.count)&&e.taskDeliveryRecovery.count>0&&typeof e.taskDeliveryRecovery.payloadSha256==`string`&&/^[a-f0-9]{64}$/u.test(e.taskDeliveryRecovery.payloadSha256)}function createSqliteReadOnlyWorkerError(e,t,n){let r=Un(c(t.trim(),-4e3));return Error(`SQLite read-only worker ${e}${r?`\nstderr (tail): ${r}`:``}`,n)}function parseSqliteReadOnlyWorkerResult(e,t){if(!e.trim())throw createSqliteReadOnlyWorkerError(`returned no JSON result`,t);let n;try{n=JSON.parse(e)}catch{throw createSqliteReadOnlyWorkerError(`returned invalid JSON`,t)}if(!isSqliteReadOnlyWorkerResult(n))throw createSqliteReadOnlyWorkerError(`returned an invalid result`,t);return n}function readSqliteReadOnlyWorkerValue(e,t){if(e.kind===`launch-failed`)throw e.error;let n;try{n=parseSqliteReadOnlyWorkerResult(e.stdout,e.stderr)}catch(t){throw e.failure?createSqliteReadOnlyWorkerError(e.failure,e.stderr,{cause:e.cause}):t}if(e.status!==0||e.failure||!n.ok){let r=!n.ok&&(e.status===0||e.status===1)&&n.message.startsWith(`SQLite snapshot capacity unavailable: `),i=n.ok?e.failure??`exited with code ${e.status}`:r?n.message.slice(38):n.message,a=!n.ok&&i.startsWith(`Retryable SQLite inspection contention: `),o=a?i.slice(40):i,s=e.failure===void 0&&!n.ok&&(t===`staging-create`||t===`staging-create-legacy`)&&o.startsWith(`SQLite snapshot directory creation refused: `),c=createSqliteReadOnlyWorkerError(s?o.slice(44):o,e.stderr,{cause:e.cause});if(n.ok||n.errcode===void 0||t!==`backup-engine`&&t!==`backup-engine-preserving`&&t!==`state-sqlite-populated`||e.status!==0&&e.status!==1||Object.assign(c,{errcode:n.errcode}),r)throw new SqliteSnapshotCapacityError(c.message,{cause:e.cause});if(a){let e=new SqliteReadOnlyInspectionContentionError(c.message);throw s?markPrivateDirectoryCreationRefused(e):e}throw c}if((t===`sync`||t===`private-fork`||t===`async`||t===`staged-sync`||t===`staged-async`||t===`metadata`||t===`consolidated`||isSqliteSnapshotStagingMode(t))&&`location`in n)return n.location;if(t===`staging-sweep`&&`reclamation`in n)return n.reclamation;if((t===`backup-engine`||t===`backup-engine-preserving`)&&`engine`in n)return n.engine;if(t===`state-sqlite-populated`&&`hasExistingData`in n)return n.hasExistingData;if(t===`content-version`&&`contentVersion`in n)return n.contentVersion;if((t===`file-generation`||t===`update-generation`)&&`generation`in n)return n.generation;if(t===`task-delivery-recovery`&&`taskDeliveryRecovery`in n)return n.taskDeliveryRecovery;throw createSqliteReadOnlyWorkerError(`returned a result for a different operation`,e.stderr)}function isSameSqliteReadOnlyWorkerLaunch(e,t){let n=Object.keys(t.env);return e.runtimeGeneration===t.runtimeGeneration&&e.transport.kind===t.transport.kind&&(e.transport.kind===`native`||t.transport.kind===`broker`&&e.transport.owner===t.transport.owner)&&t.cwd===e.cwd&&n.length===Object.keys(e.env).length&&n.every(n=>t.env[n]===e.env[n])}function createSqliteReadOnlyWorkerSession(e){Dn();let t={...e.env},n=e.cwd,r=process.execPath,i=e.transport.kind===`broker`?{kind:`broker`,owner:e.transport.owner}:{kind:`native`},a={env:t,cwd:n,transport:i,runtimeGeneration:e.runtimeGeneration},o=[...e.argv],u={env:t,...i.kind===`native`&&n===l()?{}:{cwd:n},stdio:[`ignore`,`pipe`,`pipe`,`ipc`],windowsHide:!0},d=i.kind===`broker`?i.owner.spawn(r,o,u):Rn.spawn(r,o,u);recordChildProcessSpawn(r,d,e.pooledRead?`sqlite.scoped-read.${i.kind}`:`sqlite.session.${i.kind}`);let setIdle=e=>{if(i.kind!==`native`)return;let t=e?`unref`:`ref`;d[t](),d.channel?.[t]?.();for(let e of[d.stdout,d.stderr])e instanceof qn&&e[t]()},f=!1,p=0,m,h=``,ee=0,g,{promise:te,resolve:ne}=it(),_=/* @__PURE__ */ new Map,v=te.then(async()=>{i.kind===`broker`&&d instanceof yn&&!d.notStarted&&d.exitCode===null&&d.signalCode===null&&await i.owner.waitForCleanup();for(let e of _.values())e();_.clear()}),retire=e=>{setIdle(!1),f=!0,g&&e!==void 0&&(g.failure??=e),d.kill(`SIGKILL`)},sendMessage=e=>d.send(e,e=>{e&&retire(e)}),releasePending=t=>{if(g=void 0,m=void 0,t.cleanup(),e.pooledRead){for(let e of _.values())e();_.clear()}return t};e.retainLifetime!==!1&&retainSnapshotWork(v,()=>retire(/* @__PURE__ */ Error(`SQLite snapshot owner stopped`)));let re=!1,ie=!1,ae=!1;d.once(`spawn`,()=>{ie=!0}),d.on(`error`,e=>retire(ie?e:Object.assign(Error([[`EACCES`,`ENOENT`,`EPERM`].includes(e.code??``)?`SQLite read-only worker runtime binary not executable: ${r} (${e.code}, cwd ${n}). Check runtime execute permissions and access to the working directory`:`SQLite read-only worker failed to start (executable ${r}, cwd ${n})`,e.message].join(`: `),{cause:e}),{code:e.code,path:e.path})));let finishClose=async(e,t)=>{ae=!0,f=!0;let n=g?.failure??createSqliteReadOnlyWorkerError(`exited with ${t?`signal ${t}`:`code ${e}`}`,h),i=await En({execPath:r,error:n,stderr:h,signal:t,started:re}).catch(toStringifiedError);if(g){let e=releasePending(g);e.reject(i??e.failure??n)}ne()};d.once(`close`,(e,t)=>{finishClose(e,t)});let captureOutput=(e,t)=>{ee+=e.length,t&&(h=c(h+e.toString(`utf8`),-4e3)),ee>1048576&&retire(createSqliteReadOnlyWorkerError(`exceeded its output buffer`,h))},attachOutput=()=>{d.stdout?.on(`data`,e=>captureOutput(e,!1)),d.stderr?.on(`data`,e=>captureOutput(e,!0))},y=d instanceof yn?d.ready().then(attachOutput).catch(retire):void 0;y||attachOutput(),d.on(`message`,t=>{if(re=!0,!f){if(!g||!t||typeof t!=`object`||Object.keys(t).length!==2||!(`id`in t)||t.id!==g.id||!(`result`in t))retire(createSqliteReadOnlyWorkerError(`returned an unexpected response`,h));else try{let e;if(g.transfer&&`type`in t.result){let n=g.transfer.accept(t.result);if(`request`in n){sendMessage({id:g.id,transfer:n.request});return}e=n.value}else e=readSqliteReadOnlyWorkerValue({kind:`launched`,stdout:JSON.stringify(t.result),stderr:h,status:0},g.mode);releasePending(g).resolve(e)}catch(n){if(g&&e.retainOnOperationError&&isSqliteSnapshotStagingMode(g.mode)&&isSqliteReadOnlyWorkerResult(t.result)&&!t.result.ok){releasePending(g).reject(n);return}retire(n)}}});let b={closed:v,isRetired(){return f},get notStarted(){return d instanceof yn?d.notStarted:ae&&!ie},createNativeReplacement(){return s(()=>createSqliteReadOnlyWorkerSession({...e,env:t,cwd:n,argv:o,transport:{kind:`native`}}))},compatible(e){return!f&&isSameSqliteReadOnlyWorkerLaunch(a,e)},run(t,n){if(f)return Promise.reject(/* @__PURE__ */ Error(`SQLite read-only worker is closed`));if(n.mode===`auth-profile-rows`&&n.source===`canonical`&&!n.artifactPreserving){let e=L.resolve(t);_.has(e)||_.set(e,registerOpenClawAgentDatabaseReadCandidateResource({path:e,revoke:()=>retire(/* @__PURE__ */ Error(`Auth profile reader owner was revoked`)),close:()=>b.close()}))}return m=new Promise((r,i)=>{h=``,ee=0;let abort=()=>retire(n.signal?.reason),a,o=++p;g={id:o,mode:n.mode,...n.mode===`auth-profile-rows`?{transfer:createSqliteAuthTransferReceiver()}:n.mode===`operation`?{transfer:createSqliteOperationTransferReceiver(n.command.type)}:{},resolve:r,reject:i,cleanup:()=>{clearTimeout(a),n.signal?.removeEventListener(`abort`,abort)}},n.signal?.addEventListener(`abort`,abort,{once:!0}),n.signal?.aborted?abort():(async()=>{try{if(!e.deadlineOwnedByCaller()){let{timeoutMs:n,size:r}=await e.readBudget(t);if(f)return;a=setTimeout(()=>retire(e.timeoutError(t,n,r)),n)}if(y&&(await y,f))return;let r={id:o,args:e.requestArgs(t,n),...n.mode===`auth-profile-rows`||n.mode===`operation`?{[n.mode===`operation`?`operation`:`auth`]:{expectedIdentity:n.expectedIdentity,expectedBirthtime:n.expectedBirthtime,artifactPreserving:n.artifactPreserving,...n.mode===`operation`?{command:Bn(n.command).toString(`base64`)}:{immutable:n.immutable,retainReader:!e.pooledRead&&n.source===`canonical`&&!n.artifactPreserving,schema:n.source===`canonical`&&!n.artifactPreserving?captureSqliteAuthSchema(t,n.expectedIdentity):void 0}}}:{}};if(n.mode===`operation`&&Buffer.byteLength(JSON.stringify(r))>1048576)throw Error(`SQLite read-only operation exceeded its request buffer`);sendMessage(r)}catch(e){retire(e)}})()})},setIdle,async close(){if(b.setIdle(!1),f){await v;return}f=!0;let t=setTimeout(()=>retire(),e.closeTimeoutMs);try{sendMessage(`close`)}catch(e){retire(e)}try{await v}finally{clearTimeout(t)}}};return e.runtimeGeneration?.retain(b,async()=>(await m?.catch(()=>void 0),()=>b.close())),b}const Pr=x(`state/sqlite`);function trackSqliteRead(e){return xn(`sqlite_read`,Ue(e.mode===`operation`?e.command.type:e.mode),e.signal)}function createSqliteReadOnlyWorkerPool(e){let t=[],n=/* @__PURE__ */ new WeakMap,r=/* @__PURE__ */ new Set,i=/* @__PURE__ */ new WeakSet,a=createStateWorkerMemoryPressureSubscription(()=>t.some(e=>e.idleSince!==void 0&&!e.session?.isRetired()),e=>{for(let n of t)n.session&&!n.leased&&!n.quarantined&&n.queued===0&&_n(n.idleSince,e)&&retireIdleSlot(n)}),assertBrokerOpen=e=>{if(e.transport.kind===`broker`&&i.has(e.transport.owner))throw Error(`SQLite read-only worker broker is closing`)};async function closeSlot(e){let t=e.session;try{await t?.close(),e.session=void 0}catch(t){e.quarantined={error:t};for(let e of r)e();throw t}}async function selectScopedReadWorker(e,i){assertBrokerOpen(i);let a=e.mode===`operation`&&(e.command.type===`pageCache.begin`||e.command.type===`pageCache.step`),o=cr.getStore();if(a){if(!o?.active)throw Error(`Database page-cache warm requires an active read-only worker scope`);let t=n.get(o);if(t){if(!isSameSqliteReadOnlyWorkerLaunch(t.launch,i))throw Error(`Database page-cache warm worker launch changed during its scope`);return t}if(e.command.type===`pageCache.step`)throw Error(`Database page-cache warm is no longer active`)}for(;;){assertBrokerOpen(i),e.signal?.throwIfAborted();let c=t.filter(e=>!e.leased&&!e.quarantined),l=c.find(e=>isSameSqliteReadOnlyWorkerLaunch(e.launch,i));if(!l&&t.length<4&&(l={launch:i,tail:Promise.resolve(),queued:0},t.push(l)),l??=c.find(e=>e.queued===0&&!e.session),l??=c.reduce((e,t)=>!e||t.queued<e.queued?t:e,void 0),l){if(a&&o){let e=l,t={started:!1};e.leased=t,n.set(o,e),o.releaseReadWorker=async()=>{try{t.started&&(await e.tail,await closeSlot(e))}finally{e.leased=void 0,n.delete(o),o.releaseReadWorker=void 0,!e.quarantined&&e.queued===0&&e.session&&!e.session.isRetired()&&(e.session.setIdle(!0),armScopedReadWorkerIdle(e));for(let e of r)e()}}}return l}if(t.every(e=>e.quarantined))throw AggregateError(t.map(e=>e.quarantined?.error),`SQLite read-only worker capacity is held by unconfirmed cleanup`);let u,d=s(()=>new Promise(e=>{u=e}));r.add(u);try{await ut(d,e.signal,e=>e.reason)}finally{r.delete(u)}}}function retireIdleSlot(e){clearTimeout(e.idle),e.idleSince=void 0,a();let t=s(()=>closeSlot(e));return e.tail=t.catch(()=>{Pr.warn(`Idle SQLite read-only worker cleanup failed`)}),t}function armScopedReadWorkerIdle(e){e.launch.transport.kind===`broker`&&i.has(e.launch.transport.owner)?retireIdleSlot(e):(e.idleSince=performance.now(),a(),e.idle=s(()=>setTimeout(()=>{retireIdleSlot(e)},6e4)),e.idle.unref())}return{run:async function(t,n,r,i=trackSqliteRead(n)){let o=n.mode===`operation`&&(n.command.type===`pageCache.begin`||n.command.type===`pageCache.step`),c;try{c=await selectScopedReadWorker(n,r),assertBrokerOpen(r)}catch(e){throw i.completed(),e}clearTimeout(c.idle),c.idleSince=void 0,a(),c.queued++;let l=c.tail,u=s(()=>ut(l,n.signal,e=>e.reason)).then(async()=>{if(n.signal?.throwIfAborted(),c.quarantined)throw c.quarantined.error;if(i.started(),c.leased&&n.mode===`operation`&&n.command.type===`pageCache.begin`&&(c.leased.started=!0),(!isSameSqliteReadOnlyWorkerLaunch(c.launch,r)||c.session?.isRetired())&&await closeSlot(c),n.signal?.throwIfAborted(),c.launch=r,!c.session){c.session=e({...r,pooledRead:!0});let{closed:t}=c.session;s(()=>t.then(a,a))}let l=c.session;l.setIdle(!1);try{let e=await l.run(t,n);return n.signal?.throwIfAborted(),!o&&(n.mode===`operation`&&sqliteReadOnlyOperationRequiresProcessRetirement(n.command.type)||!we().explicitSqliteCloseReleasesNativeResources)&&await closeSlot(c),e}catch(e){try{await closeSlot(c)}catch(t){throw De([e,t],`SQLite read and child cleanup failed`,e)}throw e}}).finally(()=>{i.completed(),c.queued--,!c.leased&&!c.quarantined&&c.queued===0&&c.session&&!c.session.isRetired()&&(c.session?.setIdle(!0),armScopedReadWorkerIdle(c))});return c.tail=s(()=>Promise.allSettled([l,u]).then(()=>{})),u},async closeBroker(e){i.add(e);let n=await Promise.allSettled(t.filter(t=>t.launch.transport.kind===`broker`&&t.launch.transport.owner===e&&t.session&&t.queued===0&&!t.leased&&!t.quarantined).map(retireIdleSlot));ot(n,`SQLite read-only broker worker cleanup failed`)}}}const Fr=3e5,Ir=x(`state/sqlite`);function resolveSqliteInspectionBudget(e,t,n){let r=a(Fr+Math.ceil(40*Number(n??0)/33554432)*1e3,Fr),i=n===void 0?`unknown size`:formatByteSize(Number(n),{style:`iec`,maxUnit:`giga`,separator:` `,fractionDigits:n<1024n?0:1});return r>Fr&&Ir.debug(`SQLite ${e} for ${t}: ${i}, budget ${r/1e3} seconds`),{timeoutMs:r,size:i}}function readSqliteInspectionBudget(e,n,r){let i=r;try{i??=R.statSync(n,{bigint:!0}).size;for(let e of[`-wal`,`-shm`,`-journal`])try{i+=R.statSync(n+e,{bigint:!0}).size}catch(e){if(!t(e,`ENOENT`))throw e}}catch{}return resolveSqliteInspectionBudget(e,n,i)}async function readSqliteInspectionBudgetAsync(e,n,r){let i=r;try{i??=(await R.promises.stat(n,{bigint:!0})).size;for(let e of[`-wal`,`-shm`,`-journal`])try{i+=(await R.promises.stat(n+e,{bigint:!0})).size}catch(e){if(!t(e,`ENOENT`))throw e}}catch{}return resolveSqliteInspectionBudget(e,n,i)}function sqliteInspectionTimeoutError(e,t,n,r){return/* @__PURE__ */ Error(`SQLite ${e} timed out after ${n/1e3} seconds (budget for ${r}) for ${t}. Stop the Gateway service and other OpenClaw processes using this database, then retry; if already stopped, check storage performance.`)}function isSqliteInspectionDeadlineOwnedByCaller(){return cr.getStore()?.deadlineOwnedByCaller===!0}function sqliteReadOnlyWorkerArgv(e){let{moduleUrl:t,runtimeGeneration:n}=Be(je(e[0]===`content-version`||e[0]===`file-generation`?`sqliteSourceRevision`:`sqliteReadOnly`));return{runtimeGeneration:n,argv:[...resolveForwardedNodeCompilerArgs(),...ft(t),dt,...e]}}function createScopedSqliteReadOnlyWorker(e){let t=je(`sqliteReadOnly`);return s(()=>createSqliteReadOnlyWorkerSession({...e,argv:[...resolveForwardedNodeCompilerArgs(),...ft(Re(t,e.runtimeGeneration)),dt,`session`],requestArgs:sqliteReadOnlyWorkerRequestArgs,readBudget:e=>readSqliteInspectionBudgetAsync(`read-only snapshot`,e),deadlineOwnedByCaller:e.retainLifetime===!1?()=>!1:isSqliteInspectionDeadlineOwnedByCaller,timeoutError:(e,t,n)=>sqliteInspectionTimeoutError(`read-only snapshot`,e,t,n),closeTimeoutMs:Fr}))}createSqliteReadOnlyWorkerPool(createScopedSqliteReadOnlyWorker);function runSqliteReadOnlyWorkerSync(e,n,r=`sync`,i){Dn();let{timeoutMs:a,size:o}=readSqliteInspectionBudget(`read-only snapshot`,e),s=Rn.spawnSync(process.execPath,sqliteReadOnlyWorkerArgv(sqliteReadOnlyWorkerRequestArgs(e,{mode:r,stagingRoot:n,expectedSourceIdentity:i})).argv,{encoding:`utf8`,windowsHide:!0,stdio:`pipe`,env:fe(Tn()),maxBuffer:1048576,timeout:a,killSignal:`SIGKILL`}),c=vn({error:s.error,stderr:s.stderr,signal:s.signal,started:!!s.stdout});if(c)throw c;return readSqliteReadOnlyWorkerValue(s.error?{kind:`launch-failed`,error:Error(t(s.error,`ETIMEDOUT`)?sqliteInspectionTimeoutError(`read-only snapshot`,e,a,o).message:`SQLite read-only worker failed to start for ${e}: ${s.error.message}`,{cause:s.error})}:{kind:`launched`,stdout:s.stdout,stderr:s.stderr,status:s.status,failure:s.status===0?void 0:`exited with ${s.signal?`signal ${s.signal}`:`code ${s.status}`}`},r)}function createSqliteTerminalOpenLatch(e){let t=/* @__PURE__ */ new Map;return{peek:e=>t.get(L.resolve(e)),get:e=>t.get(L.resolve(e)),record:(n,r)=>{let i=L.resolve(n);at(r),t.set(i,r),e.closeByPath(i,r)},clear:e=>{t.delete(L.resolve(e))},clearAll:e=>{for(let n of t.keys())(e===void 0||o(e,n))&&t.delete(n)}}}function sameFileFingerprint(e,t){return e.dev===t.dev&&e.ino===t.ino&&sameFileStatFingerprint(e,t)&&e.sha256===t.sha256}function sameOptionalFileFingerprint(e,t){return e===void 0?t===void 0:t!==void 0&&sameFileFingerprint(e,t)}function sameSqliteFileGeneration(e,t){return sameFileFingerprint(e.database,t.database)&&sameOptionalFileFingerprint(e.journal,t.journal)&&sameOptionalFileFingerprint(e.wal?.size===0n?void 0:e.wal,t.wal?.size===0n?void 0:t.wal)}function parseFileFingerprint(e){if(!i(e))throw Error(`SQLite file fingerprint must be an object`);for(let t of[`birthtimeNs`,`ctimeNs`,`dev`,`ino`,`mtimeNs`,`size`])if(typeof e[t]!=`string`||!/^-?\d+$/u.test(e[t]))throw Error(`SQLite file fingerprint ${t} is invalid`);if(typeof e.sha256!=`string`||!/^[a-f0-9]{64}$/u.test(e.sha256))throw Error(`SQLite file fingerprint sha256 is invalid`);return{birthtimeNs:BigInt(e.birthtimeNs),ctimeNs:BigInt(e.ctimeNs),dev:BigInt(e.dev),ino:BigInt(e.ino),mtimeNs:BigInt(e.mtimeNs),sha256:e.sha256,size:BigInt(e.size)}}function parseSqliteFileGeneration(e){let t=JSON.parse(e);if(!i(t))throw Error(`SQLite file generation must be an object`);return{database:parseFileFingerprint(t.database),...t.journal===void 0?{}:{journal:parseFileFingerprint(t.journal)},...t.wal===void 0?{}:{wal:parseFileFingerprint(t.wal)}}}function readSqliteFileGenerationSync(e){return parseSqliteFileGeneration(runSqliteReadOnlyWorkerSync(e,void 0,`file-generation`))}function createPrivateWindowsDirectory(e){let t=!1;try{Wn(L.resolve(e),{private:!0,assertBeforeMutation(){t=!0}})}catch(e){throw!t||e instanceof Kn&&e.code===`already-exists`?markPrivateDirectoryCreationRefused(e):e}}function resolvePrivateSqliteSnapshotStagingRoot(e=process.env){try{return resolveSnapshotStagingRoot(e)}catch(e){throw e instanceof Error&&hasSqliteSnapshotCapacityCode(e)?new SqliteSnapshotCapacityError(`SQLite snapshot staging root is unavailable: ${e.message}; free disk space/quota`,{cause:e}):e}}function resolveSnapshotStagingRoot(e){let t=e.OPENCLAW_UPDATE_IN_PROGRESS===`1`?e.TMPDIR?.trim():void 0;if(t&&L.isAbsolute(t))return v({preferredDir:L.join(t,`openclaw`),tmpdir:()=>t});let n=process.platform===`win32`?e.LOCALAPPDATA?.trim():void 0,i=process.platform===`win32`?`AppData/Local`:`.cache`,a=process.platform===`darwin`?`Library/Caches`:i,o=[e.XDG_CACHE_HOME?.trim(),n].find(e=>e&&L.isAbsolute(e))??L.join(u(e),a),s=r(e),c=Mn(`sha256`).update(s).digest(`hex`).slice(0,24);R.mkdirSync(o,{recursive:!0,mode:448});let l=v({preferredDir:L.join(o,`openclaw`),tmpdir:()=>o}),[d=``,...f]=L.relative(l,s).split(L.sep),p=f.length>0&&/^sqlite-[a-f0-9]{24}$/u.test(d)?d:`sqlite-${c}`,m=L.join(l,p);R.mkdirSync(m,{recursive:!0,mode:448});let h=R.lstatSync(m);if(!h.isDirectory()||process.getuid&&h.uid!==process.getuid()||process.platform!==`win32`&&h.mode&63)throw Error(`SQLite snapshot namespace must be a private user-owned directory`);return m}function createPrivateSqliteTempDirectorySync(e,t){if(process.platform!==`win32`)try{return R.mkdtempSync(L.join(e,t))}catch(e){throw markPrivateDirectoryCreationRefused(e)}let n=L.join(e,`${t}${Nn()}`);return createPrivateWindowsDirectory(n),n}function sqliteSnapshotSourceFileSize(e){try{let t=R.statSync(e);return t.isFile()?t.size:0}catch(e){if(t(e,`ENOENT`))return 0;throw e}}function sqliteSnapshotStagingError(e,t,n=!1,r){He(t,`snapshot`);let i=n,a=!1,o=!1,s;for(let n=0,r=t;n<8&&r instanceof Error;n+=1){o||=r instanceof AggregateError||r instanceof S;let{errcode:t,path:n}=r;a||=hasSqliteSnapshotCapacityCode(r),(a||typeof t==`number`&&[13,778,1034,1290].includes(t)||`${n??``}${L.sep}`.startsWith(`${e}${L.sep}`))&&(i=!0,typeof t==`number`&&(s=t)),r=r.cause}if(!i)return t;let c=a?`free disk space/quota`:`check filesystem health and write permissions`,l=``;if(a&&r)try{let t=sqliteSnapshotSourceFileSize(r)+sqliteSnapshotSourceFileSize(`${r}-wal`)+sqliteSnapshotSourceFileSize(`${r}-journal`),n=tryReadDiskSpace(e)?.availableBytes,i=R.existsSync(`${r}-wal`)&&R.existsSync(`${r}-shm`);l=`; estimated ${t} bytes needed; ${n===void 0?`available bytes unknown`:`${n} bytes available`}; source ${i?`has live WAL sidecars`:`has no live WAL sidecars`}`}catch{}let u=process.env.OPENCLAW_UPDATE_IN_PROGRESS===`1`?`TMPDIR`:`XDG_CACHE_HOME`,d=`${t instanceof Error?t.message:String(t)}${s===void 0?``:` (SQLite errcode=${s})`}; snapshot staging root ${n?e:L.dirname(e)}${l}: ${c} or set ${u} to a writable filesystem`,f=a&&!o&&Je(t)!==`source`?new SqliteSnapshotCapacityError(d,{cause:t}):Error(d,{cause:t});return isPrivateDirectoryCreationRefused(t)?markPrivateDirectoryCreationRefused(f):f}function createSqliteSnapshotStagingDirectorySync(e=resolvePrivateSqliteSnapshotStagingRoot(),t=!1){let n=createSqliteSnapshotStagingTokenSync(e,t);return registerSnapshotTempDirectory(n.directory,n.release),n.directory}function createSqliteSnapshotStagingTokenSync(e=resolvePrivateSqliteSnapshotStagingRoot(),t=!1){let n;try{try{n=createPrivateSqliteTempDirectorySync(e,t?`openclaw-sqlite-readonly-${process.pid}-`:$n)}catch(t){throw sqliteSnapshotStagingError(e,t,!0)}return{directory:n,release:acquireSqliteSnapshotToken(n,`create`)}}catch(e){throw n&&removeTempDirectory(n),e}}Buffer.from([217,213,5,249,32,161,99,215]),g(Symbol.for(`openclaw.sqliteSnapshotFlights`),()=>({unscoped:/* @__PURE__ */ new Map,scoped:/* @__PURE__ */ new WeakMap}));const Lr=g(Symbol.for(`openclaw.sqliteLiveSnapshotOwners`),()=>/* @__PURE__ */ new Map);function registerLiveSqliteSnapshotOwner(e){let t=_e(e.databasePath),n={assertCurrent:e.assertCurrent,database:e.database};return Lr.set(t.key,n),()=>{Lr.get(t.key)===n&&Lr.delete(t.key)}}function fingerprint(e){return[e.dev,e.ino,e.birthtimeNs,e.ctimeNs,e.mtimeNs,e.size].join(`:`)}function walFingerprint(e){return[e.dev,e.ino,e.mtimeNs,e.size].join(`:`)}function readFile$1(e){let t=R.lstatSync(e,{bigint:!0,throwIfNoEntry:!1});if(t){if(!t.isFile()||t.nlink!==1n)throw Error(`Private SQLite snapshot must be an independent regular file: ${e}`);return t}}function captureSqlitePrivateSnapshotFamily(e,t){if(R.lstatSync(`${e}-journal`,{throwIfNoEntry:!1}))return;let n=readFile$1(e),r=readFile$1(`${e}-wal`);return n?{root:t,main:fingerprint(n),wal:r&&r.size>32n?walFingerprint(r):null}:void 0}const U=g(Symbol.for(`openclaw.sqliteReusableSnapshots`),()=>/* @__PURE__ */ new Map),Rr=g(Symbol.for(`openclaw.sqliteReusableSnapshotScopes`),()=>({depth:0,retiring:/* @__PURE__ */ new Set}));function completed(e){let t=Ie(()=>{});return t.resolve(e),t.operation}function readSource(e){try{let t=R.statSync(e,{bigint:!0,throwIfNoEntry:!1});if(!t?.isFile()||R.statSync(`${e}-journal`,{throwIfNoEntry:!1}))return;let n=R.statSync(`${e}-wal`,{bigint:!0,throwIfNoEntry:!1}),r=n&&n.size>0n?n:void 0;return{fingerprint:[`${t.dev}:${t.ino}:${t.size}:${t.mtimeNs}:${t.ctimeNs}`,r?`${r.dev}:${r.ino}:${r.size}:${r.mtimeNs}`:`none`].join(`|`),main:t,newestMs:Math.max(Number(t.mtimeMs),Number(r?.mtimeMs??0)),quiescentMs:[t,r].some(e=>e&&e.mtimeNs%1000000000n==0n)?2e3:50}}catch{return}}function canonicalKey(e){try{return R.realpathSync.native(e)}catch{return}}function retire(e,t){U.get(e)===t&&U.delete(e),t.retired=!0,t.leases===0&&settleRetirement(t.retire)}function settleRetirement(e){let t=new Promise(t=>{t(e())}).catch(reportRetirementFailure).finally(()=>Rr.retiring.delete(t));Rr.retiring.add(t)}function reportRetirementFailure(e){ae({subsystem:`infra/sqlite-snapshot`}).warn({error:String(e)},`Retiring a reusable SQLite snapshot failed.`)}function lend(e,t){t.leases+=1;let n=!1,release=()=>(n||(n=!0,--t.leases,t.leases===0&&t.retired&&retire(e,t)),!0);return{location:t.location,cleanupRoot:t.cleanupRoot,privateFamily:t.privateFamily,cleanup:release,cleanupAsync:async()=>release(),startCleanup:()=>completed(release())}}function leaseReusableSqliteSnapshot(e,t,n={}){let r=canonicalKey(e),i=r?U.get(r):void 0;if(r&&i){if(readSource(r)?.fingerprint!==i.fingerprint||!R.existsSync(i.location))retire(r,i);else if(!i.logicalOnly||n.logicalReader){if(t)try{le(i.main,t)}catch{return}return lend(r,i)}}}function captureReusableSqliteSource(e){let t=Rr.depth>0?canonicalKey(e):void 0,n=t?readSource(t):void 0;return n&&Date.now()-n.newestMs>=n.quiescentMs?n:void 0}function captureFamily(e){try{return captureSqlitePrivateSnapshotFamily(e.location,e.cleanupRoot??L.dirname(e.location))}catch{return}}g(Symbol.for(`openclaw.sqliteReusableSnapshotSources`),()=>/* @__PURE__ */ new Map);function publishReusableSqliteSnapshot(e,t,n,r,i={}){let a=canonicalKey(e)??L.resolve(e),o=U.get(a);if(o?.location===n.location&&o.fingerprint===t.fingerprint)return settleRetirement(r),lend(a,o);o&&retire(a,o);let s={...t,logicalOnly:i.logicalOnly===!0,location:n.location,cleanupRoot:n.cleanupRoot,privateFamily:n.privateFamily??captureFamily(n),leases:0,retired:!1,retire:r};return U.set(a,s),lend(a,s)}const zr=[``,`-wal`,`-shm`,`-journal`];zr.slice(1),Buffer.from([0,5,22,7]),x(`state/sqlite`);function resolveSqliteDatabaseFilePaths(e){return zr.map(t=>`${e}${t}`)}function buildUpdateRehearsalPathEnv(e){return{HOME:e,USERPROFILE:e,TMPDIR:e,TMP:e,TEMP:e,XDG_CONFIG_HOME:L.join(e,`config`),XDG_CACHE_HOME:L.join(e,`cache`),XDG_DATA_HOME:L.join(e,`data`),XDG_STATE_HOME:L.join(e,`state`),OPENCLAW_HOME:e,OPENCLAW_STATE_DIR:e,OPENCLAW_CONFIG_PATH:L.join(e,`openclaw.json`),OPENCLAW_WORKSPACE_DIR:L.join(e,`workspace`),OPENCLAW_SKIP_CHANNELS:`1`,OPENCLAW_SKIP_PROVIDERS:`1`,OPENCLAW_SKIP_CRON:`1`,OPENCLAW_SKIP_GMAIL_WATCHER:`1`,OPENCLAW_SKIP_CANVAS_HOST:`1`,OPENCLAW_SKIP_BROWSER_CONTROL_SERVER:`1`,OPENCLAW_SKIP_STARTUP_MODEL_PREWARM:`1`,OPENCLAW_NO_AUTO_UPDATE:`1`,NODE_DISABLE_COMPILE_CACHE:`1`}}function resolveUpdateRehearsalRoot(e){let t=e.OPENCLAW_STATE_DIR;if(t&&L.isAbsolute(t)&&[`0`,`1`].includes(e.OPENCLAW_UPDATE_IN_PROGRESS??``)&&!Object.entries(buildUpdateRehearsalPathEnv(t)).some(([t,n])=>e[t]!==n)&&e.OPENCLAW_SERVICE_REPAIR_POLICY===`external`&&e.OPENCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR===`0`&&e.OPENCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION===`0`&&!e.OPENCLAW_COMPATIBILITY_HOST_VERSION)return L.resolve(t)}function isUpdateRehearsalReadOnlyPath(e,t){let n=resolveUpdateRehearsalRoot(t);if(!n)return!1;let r=L.resolve(e);return!o(n,r)||!o(ct(n),ct(r))}function isUpdateRehearsalPrivateDatabase(e,t){return resolveUpdateRehearsalRoot(t)!==void 0&&resolveSqliteDatabaseFilePaths(e).every(e=>!isUpdateRehearsalReadOnlyPath(e,t))}function findArtifactSnapshot(e,t){let n=e.snapshots.get(t.canonicalPath);if(n&&(n.sourceIdentity.key!==t.key||n.sourceIdentity.birthtime!==t.birthtime))throw Error(`SQLite database file identity changed during inspection`);return n}function retainArtifactSnapshot(e,t,n){let r=retainSnapshotTempDirectory(t.cleanupRoot??L.dirname(t.location));e.privateRoots.add(t.cleanupRoot??L.dirname(t.location));let i={...t,sourceIdentity:n,cleanup:()=>(r(),t.cleanup()),cleanupAsync:()=>(r(),t.cleanupAsync())};return e.snapshots.set(n.canonicalPath,i),i}function assertCustodiedSourceUnchanged(e,t){let n=R.statSync(e,{bigint:!0,throwIfNoEntry:!1});if(!n||n.ino!==t.ino||n.size!==t.size||n.mtimeNs!==t.mtimeNs||kt(e)===void 0)throw Error(`SQLite source changed during in-place inspection: ${e}`)}function openSqliteReadOnlyDatabase(e,t={}){let n=or.getStore();if(!n||!isArtifactPreservingStateRead(`agent`,e))return M(e,{...t,readOnly:!0});let r=_e(e),i=findArtifactSnapshot(n,r),a=i?void 0:kt(r.canonicalPath);i||a||isUpdateRehearsalPrivateDatabase(e,process.env)||(i=retainArtifactSnapshot(n,prepareSqliteReadOnlyLocationSync(e),r));let o=i?retainSnapshotTempDirectory(i.cleanupRoot??L.dirname(i.location)):void 0,s={},close=()=>{s.close?.(),o?.(),n.readers.delete(close)};n.readers.add(close);let c=i?.location??(a?dn(r.canonicalPath):e),l=M(c,{...t,readOnly:!0}),u=l.close.bind(l);return s.close=()=>{l.isOpen&&(u(),a&&assertCustodiedSourceUnchanged(r.canonicalPath,a))},l.close=close,l}function prepareSqliteReadOnlyLocationSync(e,t,n={}){let r=n.reuse?leaseReusableSqliteSnapshot(e,t):void 0;if(r)return r;let i=n.reuse?captureReusableSqliteSource(e):void 0,a=createSqliteSnapshotStagingDirectorySync();try{let n=adoptPreparedLocation(runSqliteReadOnlyWorkerSync(e,a,`sync`,t),a);return i?publishReusableSqliteSnapshot(e,i,n,()=>n.cleanup()):n}catch(e){throw removeTempDirectory(a)?e:new S(`${oe(e)}; SQLite snapshot cleanup failed: ${a}`,{cause:e})}}const Br={name:`openclaw.quarantine.schema`,lifetime:`process`,schemaDependent:!0,read(e){if(typeof e==`object`&&e&&`version`in e&&typeof e.version==`number`)return{version:e.version}}};function quarantineDecisionAdmission(e){return{name:`openclaw.quarantine.decision:${L.resolve(e)}`,lifetime:`process`,read:e=>e===null||isQuarantineDecision(e)?e:void 0}}function isQuarantineDecision(e){return i(e)&&(e.kind===`agent`||e.kind===`state`)&&typeof e.reason==`string`&&typeof e.quarantinedAt==`number`&&(e.verifiedGenerationJson===null||typeof e.verifiedGenerationJson==`string`)}function readQuarantineSchemaVersion(e,t,n=!1){let r=n?void 0:D(e,Br);if(r)return r.version;let i=e.prepare(`PRAGMA user_version`).get()?.user_version;if(typeof i!=`number`||!Number.isInteger(i))throw Error(`OpenClaw quarantine store ${t} has an invalid schema version.`);if(i>2)throw Error(`OpenClaw quarantine store ${t} uses newer schema version ${i}.`);return i!==0&&T(e,Br,{version:i}),i}function readOpenClawDatabaseQuarantine(e,t={}){let n=jt(t.env??process.env);t.refreshIdentity&&ye(n);let load=()=>readPersistedQuarantineDecision(e,n,t.fresh)??null,r=t.fresh?load():Ne(n,quarantineDecisionAdmission(e),load);return r?resolveQuarantineDecision(r,e,n):void 0}function readPersistedQuarantineDecision(e,t,n=!1){if(!Pn(t))return;let r=openSqliteReadOnlyDatabase(t,{timeout:5e3}),i;try{i={value:readQuarantineDecision(r,e,t,n)}}catch(e){i={error:e}}try{r.close()}catch(n){let r,a=`error`in i?i.error:void 0;if(`value`in i&&i.value)try{r=resolveQuarantineDecision(i.value,e,t)}catch(e){a=e}throw new N(a===void 0?[n]:[a,n],r)}if(`error`in i)throw i.error;return i.value}function readQuarantineDecision(e,t,n,r=!1){let i=readQuarantineSchemaVersion(e,n,r);if(i===0)return;let a=i>=2?`, verified_generation`:``,o=e.prepare(`SELECT kind, reason, quarantined_at${a} FROM quarantined_databases WHERE path = ? LIMIT 1`).get(L.resolve(t));if(!o)return;let s=i>=2?o.verified_generation:void 0;if(o.kind!==`agent`&&o.kind!==`state`||typeof o.reason!=`string`||typeof o.quarantined_at!=`number`||!Number.isInteger(o.quarantined_at)||s!=null&&typeof s!=`string`)throw Error(`OpenClaw quarantine store ${n} contains an invalid row.`);return{kind:o.kind,quarantinedAt:o.quarantined_at,reason:o.reason,verifiedGenerationJson:typeof s==`string`?s:null}}function resolveQuarantineDecision(e,t,n){if(e.verifiedGenerationJson!==null){let r;try{r=parseSqliteFileGeneration(e.verifiedGenerationJson)}catch{throw Error(`OpenClaw quarantine store ${n} contains an invalid row.`)}try{let e=readSqliteFileGenerationSync(L.resolve(t));if(!sameSqliteFileGeneration(r,e))return}catch{return}}return{kind:e.kind,quarantinedAt:e.quarantinedAt,reason:e.reason}}function readOpenClawDatabaseQuarantineFailure(e,t,n={}){let r,i;try{r=readOpenClawDatabaseQuarantine(t,n)}catch(e){if(!(e instanceof N))return;if(!e.quarantine)throw e;r=e.quarantine,i=e}if(!r)return;let a=/* @__PURE__ */ Error(`OpenClaw ${e} database ${t} is quarantined after integrity verification failed: ${r.reason??`unknown integrity error`}. Restore the database from a backup or repair it, then run openclaw doctor --fix to clear the quarantine. See ${Wt}.`);return a.name=`SqliteIntegrityError`,i&&(a.cause=i),a}function createStateDatabaseRetainer(e,t){let admit=(e,n,r)=>{let i=P();return n===`cached-read`?i?.assertReadAdmission():i?.assertAdmission(),t.assertOpen(e,n,r),i},retain=(n,r,i=!1)=>{if(t.capture(n.path).assertCurrent(),e.cachedDatabases.get(n.path)!==n||!n.db.isOpen)throw Error(`OpenClaw state database borrow requires its current canonical handle`);let a=e.borrowers.get(n.db)??{references:/* @__PURE__ */ new Set,retiring:!1,cleanupComplete:!1};if(a.retiring)throw Error(`OpenClaw state database native owner is retiring`);i||mn(n.db),e.borrowers.set(n.db,a);let isCurrent=()=>!r||Vt(n.db,r),o=i?void 0:{ordinary:r===void 0,isCurrent,retire:()=>{isCurrent()?t.retire(n,r===void 0):a.retiring=!1}};function createAsyncStateDatabaseRetirement(){let e={},r,i,finish=r=>{a.references.delete(e),r?.isCurrent()?r.retire():a.retiring=!1,a.retirement=void 0,a.asyncRetirement=void 0,i?.(),i=void 0,t.touch(n)},run=()=>r||(a.cleanupComplete||a.references.size>+!!a.references.has(e)?Promise.resolve():a.retirement?.isCurrent()?(a.retiring=!0,a.references.add(e),i??=t.ownRetirement(n,close),r=Promise.resolve().then(async()=>{await n.walMaintenance.stop(),finish(a.retirement)}).catch(r=>{throw a.references.add(e),t.retainFailed(n),r}),r.catch(()=>{}),r):(finish(),Promise.resolve()));function close(){let e=run();return e.catch(t=>{throw r===e&&(r=void 0),t})}return{start:()=>void run(),close}}let s={};a.references.add(s);let c=!1,release=()=>{if(c||a.cleanupComplete)c=!0;else if(c=!0,a.references.delete(s),a.retirement&&!a.retirement.isCurrent()&&(a.retirement=void 0,a.asyncRetirement=void 0,a.retiring=!1),o?.isCurrent()&&!a.retirement?.ordinary&&(a.retirement=o),!(a.references.size>0)){if(!a.retirement)t.touch(n);else if(a.retiring=!0,a.asyncRetirement)a.asyncRetirement.start();else{try{a.retirement.retire()}catch(e){throw c=!1,t.retainFailed(n),e}a.retirement=void 0,t.touch(n)}}},l={release,async releaseAsync(){a.cleanupComplete||((o?.isCurrent()&&!a.retirement?.ordinary?o:a.retirement)?.isCurrent()&&(a.asyncRetirement??=createAsyncStateDatabaseRetirement()),release(),await a.asyncRetirement?.close())}};return r?.own(l,`shared-references`,()=>l.releaseAsync()),l},findReadDatabase=(t,n,r)=>{let i=A({path:t}),a=e.cachedDatabases.get(i);return a?.db.isOpen?{database:a,scope:admit(i,n,r)}:{database:void 0,scope:void 0}},retainReadReference=(t,n)=>{let r=retain(t,n,!0),assertCurrent=()=>{if(e.cachedDatabases.get(t.path)!==t||!t.db.isOpen)throw Error(`Shared-state read lost its original native owner`)};return{assertCurrent,observe(){assertCurrent(),mn(t.db)},release:()=>r.release()}};return{retain:e=>retain(e,admit(e.path)),retainForIndependentRead(e,t,n){let{database:r,scope:i}=findReadDatabase(e,t,n);return r?retainReadReference(r,i):void 0},borrowForRead(e,t,n){let{database:r,scope:i}=findReadDatabase(e,t,n);if(r){if(r.db.isTransaction)throw Error(`Asynchronous shared-state reads cannot run inside a native transaction`);return{database:r,...retainReadReference(r,i)}}}}}function assertStateDatabaseBorrowersReleased(e,t){if(e?.references.size)throw Error(`OpenClaw state database still has active native borrowers: ${t}`)}function createStateDatabaseCacheAdmission(e){return{closeTerminalFailure(t,n){sn(n,t),rt(t),e.invalidate(t);let r=e.cachedDatabases.get(t),i=[];try{r&&e.evict(r)}catch(e){i.push(e)}try{e.notifyTerminalFailure(t,n)}catch(e){i.push(e)}C(i,`Terminal shared-state failure cleanup failed`)},read(t,n){if(!t.db.isOpen)return n(t);let r=!1;try{return Ct(t.db,()=>(r=!0,n(t)))}catch(n){if(r)throw n;let i=n instanceof Error?n:Error(String(n));if(Qe(i)){e.evict(t);return}throw i}}}}const Vr=g(Symbol.for(`openclaw.databaseProcessRole`),()=>({}));function assertEngineStoreExecutionAllowed(){if(jn===0&&Vr.role!==`cli-oneshot`)throw Error(`PostgreSQL connections must run in a worker; only synchronous admission, migrations, and CLI one-shots may run on the main thread`)}const Hr=18e5,Ur=x(`state/db`);function createStateDatabaseIdleRetirement({cachedDatabases:e,retainedDatabaseHandles:t,idleTimers:n,idleReferences:r,borrowers:i},a){let touch=o=>{if(!(e.get(o.path)===o&&o.db.isOpen)&&t.get(o.db)!==o)return;let c=n.get(o.db);if(c){c.refresh();return}let l=s(()=>setTimeout(()=>{n.delete(o.db);try{o.db.isOpen&&o.db.isTransaction?touch(o):!i.get(o.db)?.references.size&&!r.get(o.db)?.size&&a(o,!1,{busyTimeoutMs:0,checkpointMode:`PASSIVE`})}catch(e){Ur.warn(`Idle shared-state database cleanup failed`,{path:o.path,error:e}),touch(o)}},Hr));l.unref(),n.set(o.db,l)};return{touch,retain(t){if(e.get(t.path)!==t||!t.db.isOpen||i.get(t.db)?.retiring)throw Error(`OpenClaw state database idle retention requires its current canonical handle`);let n=r.get(t.db)??/* @__PURE__ */ new Set,a={};return n.add(a),r.set(t.db,n),()=>{n.delete(a)&&e.get(t.path)===t&&t.db.isOpen&&touch(t)}}}}var Wr={blockedEverywhereKeys:/* @__PURE__ */ `NODE_OPTIONS.NODE_PATH.NODE_REDIRECT_WARNINGS.NODE_REPL_EXTERNAL_MODULE.NODE_REPL_HISTORY.NODE_V8_COVERAGE.PYTHONHOME.PYTHONPATH.PERL5LIB.PERL5OPT.PERL5SHELL.PERLLIB.RUBYLIB.RUBYOPT.BASHOPTS.BASH_ENV.ENV.KSH_ENV.BROWSER.GIT_ALLOW_PROTOCOL.GIT_EDITOR.GIT_EXTERNAL_DIFF.GIT_DIR.GIT_WORK_TREE.GIT_COMMON_DIR.GIT_EXEC_PATH.GIT_INDEX_FILE.GIT_OBJECT_DIRECTORY.GIT_ALTERNATE_OBJECT_DIRECTORIES.GIT_NAMESPACE.GIT_PROTOCOL_FROM_USER.GIT_SEQUENCE_EDITOR.GIT_TEMPLATE_DIR.GIT_SSL_NO_VERIFY.GIT_SSL_CAINFO.GIT_SSL_CAPATH.CC.CPP.CXX.CXXCPP.CARGO_BUILD_RUSTC.CARGO_BUILD_RUSTC_WRAPPER.CARGO_BUILD_RUSTC_WORKSPACE_WRAPPER.CARGO_BUILD_RUSTDOC.RUSTC.RUSTC_WRAPPER.RUSTC_WORKSPACE_WRAPPER.RUSTDOC.CMAKE_C_COMPILER.CMAKE_CXX_COMPILER.SHELL.SHELLOPTS.PS4.GCONV_PATH.IFS.SSLKEYLOGFILE.JAVA_OPTS.JAVA_TOOL_OPTIONS._JAVA_OPTIONS.JDK_JAVA_OPTIONS.PYTHONBREAKPOINT.DOTNET_STARTUP_HOOKS.DOTNET_ADDITIONAL_DEPS.FPATH.GLIBC_TUNABLES.MAVEN_OPTS.MAKE.MAKEFLAGS.MFLAGS.SBT_OPTS.GRADLE_OPTS.ANT_OPTS.HGRCPATH.HGEDITOR.HGMERGE.EXINIT.VIMINIT.MYVIMRC.GVIMINIT.LUA_INIT.LUA_INIT_5_1.LUA_INIT_5_2.LUA_INIT_5_3.LUA_INIT_5_4.EMACSLOADPATH.RUBYSHELL.GIT_HOOK_PATH.SVN_EDITOR.SVN_SSH.BZR_EDITOR.BZR_SSH.BZR_PLUGIN_PATH.SUDO_ASKPASS.JULIA_EDITOR.CONFIG_SITE.CONFIG_SHELL.CMAKE_TOOLCHAIN_FILE.CATALINA_OPTS.CORECLR_PROFILER.HELM_PLUGINS.PACKER_PLUGIN_PATH.VAGRANT_VAGRANTFILE.ERL_AFLAGS.ERL_FLAGS.ERL_ZFLAGS.ELIXIR_ERL_OPTIONS.R_ENVIRON.R_PROFILE.R_ENVIRON_USER.R_PROFILE_USER.TCLLIBPATH.HOSTALIASES`.split(`.`),blockedOverrideOnlyKeys:/* @__PURE__ */ `HOME.GRADLE_USER_HOME.ZDOTDIR.GIT_DIR.GIT_WORK_TREE.GIT_COMMON_DIR.GIT_INDEX_FILE.GIT_OBJECT_DIRECTORY.GIT_ALTERNATE_OBJECT_DIRECTORIES.GIT_NAMESPACE.GIT_SSH_COMMAND.GIT_SSH.GIT_PROXY_COMMAND.GIT_ASKPASS.GIT_SSL_NO_VERIFY.GIT_SSL_CAINFO.GIT_SSL_CAPATH.SSH_ASKPASS.LESSOPEN.LESSCLOSE.PAGER.MANPAGER.GIT_PAGER.EDITOR.VISUAL.FCEDIT.SUDO_EDITOR.PROMPT_COMMAND.HISTFILE.PERL5DB.PERL5DBCMD.OPENSSL_CONF.OPENSSL_ENGINES.PYTHONSTARTUP.WGETRC.CURL_HOME.CLASSPATH.CFLAGS.CGO_CFLAGS.CGO_LDFLAGS.GOFLAGS.MAKEFLAGS.MFLAGS.CORECLR_PROFILER_PATH.PHPRC.PHP_INI_SCAN_DIR.DENO_DIR.BUN_CONFIG_REGISTRY.YARN_RC_FILENAME.HTTP_PROXY.HTTPS_PROXY.ALL_PROXY.NO_PROXY.NODE_TLS_REJECT_UNAUTHORIZED.NODE_EXTRA_CA_CERTS.SSL_CERT_FILE.SSL_CERT_DIR.REQUESTS_CA_BUNDLE.CURL_CA_BUNDLE.DOCKER_HOST.DOCKER_TLS_VERIFY.DOCKER_CERT_PATH.PIP_INDEX_URL.PIP_PYPI_URL.PIP_EXTRA_INDEX_URL.PIP_CONFIG_FILE.PIP_FIND_LINKS.PIP_TRUSTED_HOST.UV_INDEX.UV_INDEX_URL.UV_PYTHON.UV_EXTRA_INDEX_URL.UV_DEFAULT_INDEX.DOCKER_CONTEXT.LIBRARY_PATH.LDFLAGS.CPATH.C_INCLUDE_PATH.CPLUS_INCLUDE_PATH.OBJC_INCLUDE_PATH.GOPROXY.GONOSUMCHECK.GONOSUMDB.GONOPROXY.GOPRIVATE.GOENV.GOPATH.HGRCPATH.PYTHONUSERBASE.RUSTC_WRAPPER.RUSTFLAGS.RUSTUP_DIST_ROOT.RUSTUP_DIST_SERVER.RUSTUP_HOME.RUSTUP_TOOLCHAIN.RUSTUP_UPDATE_ROOT.CARGO_HOME.VIRTUAL_ENV.LUA_PATH.LUA_CPATH.GEM_HOME.GEM_PATH.BUNDLE_GEMFILE.COMPOSER_HOME.CONDA_DEFAULT_ENV.CONDA_PREFIX.CARGO_BUILD_RUSTC_WRAPPER.XDG_CACHE_HOME.XDG_CONFIG_DIRS.XDG_CONFIG_HOME.XDG_DATA_DIRS.XDG_DATA_HOME.XDG_RUNTIME_DIR.XDG_STATE_HOME.AWS_CONFIG_FILE.KUBECONFIG.GOOGLE_APPLICATION_CREDENTIALS.AWS_SHARED_CREDENTIALS_FILE.AWS_WEB_IDENTITY_TOKEN_FILE.AZURE_AUTH_LOCATION.HELM_HOME.ANSIBLE_CONFIG.ANSIBLE_LIBRARY.ANSIBLE_CALLBACK_PLUGINS.ANSIBLE_COLLECTIONS_PATH.ANSIBLE_CONNECTION_PLUGINS.ANSIBLE_FILTER_PLUGINS.ANSIBLE_INVENTORY_PLUGINS.ANSIBLE_LOOKUP_PLUGINS.ANSIBLE_MODULE_UTILS.ANSIBLE_REMOTE_TEMP.ANSIBLE_ROLES_PATH.ANSIBLE_STRATEGY_PLUGINS.R_LIBS_USER.TF_CLI_CONFIG_FILE.TF_PLUGIN_CACHE_DIR.AMQP_URL.AWS_ACCESS_KEY_ID.AWS_CONTAINER_CREDENTIALS_FULL_URI.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI.AWS_SECRET_ACCESS_KEY.AWS_SECURITY_TOKEN.AWS_SESSION_TOKEN.AZURE_CLIENT_ID.AZURE_CLIENT_SECRET.DATABASE_URL.GH_TOKEN.GITHUB_TOKEN.GITLAB_TOKEN.MONGODB_URI.NODE_AUTH_TOKEN.NPM_TOKEN.REDIS_URL.SSH_AUTH_SOCK.SYSTEMROOT.WINDIR`.split(`.`),allowedInheritedOverrideOnlyKeys:/* @__PURE__ */ `ALL_PROXY.AWS_CONFIG_FILE.AWS_SHARED_CREDENTIALS_FILE.AWS_WEB_IDENTITY_TOKEN_FILE.AZURE_AUTH_LOCATION.CURL_CA_BUNDLE.DOCKER_CERT_PATH.DOCKER_CONTEXT.DOCKER_HOST.DOCKER_TLS_VERIFY.GIT_PAGER.GOOGLE_APPLICATION_CREDENTIALS.GRADLE_USER_HOME.HISTFILE.HOME.HTTPS_PROXY.HTTP_PROXY.KUBECONFIG.MANPAGER.NODE_EXTRA_CA_CERTS.NODE_TLS_REJECT_UNAUTHORIZED.NO_PROXY.PAGER.REQUESTS_CA_BUNDLE.RUSTUP_DIST_ROOT.RUSTUP_DIST_SERVER.RUSTUP_HOME.RUSTUP_TOOLCHAIN.RUSTUP_UPDATE_ROOT.SSH_AUTH_SOCK.SSL_CERT_DIR.SSL_CERT_FILE.SYSTEMROOT.WINDIR.XDG_CACHE_HOME.XDG_CONFIG_DIRS.XDG_CONFIG_HOME.XDG_DATA_DIRS.XDG_DATA_HOME.XDG_RUNTIME_DIR.XDG_STATE_HOME.ZDOTDIR`.split(`.`),blockedOverridePrefixes:[`GIT_CONFIG_`,`NPM_CONFIG_`,`CARGO_REGISTRIES_`,`TF_VAR_`],blockedPrefixes:[`DYLD_`,`LD_`,`BASH_FUNC_`]};function sortUniqueUppercase(e){return Object.freeze(Array.from(new Set(e.map(e=>e.toUpperCase()))).toSorted((e,t)=>e<t?-1:+(e>t)))}function derivePolicyArrays(e){let t=e.blockedEverywhereKeys??[],n=e.blockedOverrideOnlyKeys??[],r=e.allowedInheritedOverrideOnlyKeys??[],i=new Set(r.map(e=>e.toUpperCase())),a=e.blockedPrefixes??[],o=e.blockedOverridePrefixes??[],s=e.blockedInheritedPrefixes??a;return{blockedInheritedKeys:sortUniqueUppercase([...t,...n.filter(e=>!i.has(e.toUpperCase()))]),blockedInheritedPrefixes:sortUniqueUppercase(s),blockedKeys:sortUniqueUppercase(t),blockedOverrideKeys:sortUniqueUppercase(n),blockedPrefixes:sortUniqueUppercase(a),blockedOverridePrefixes:sortUniqueUppercase(o)}}function loadHostEnvSecurityPolicy(e=Wr){let t=derivePolicyArrays(e);return Object.freeze({blockedEverywhereKeys:Object.freeze(e.blockedEverywhereKeys??[]),blockedOverrideOnlyKeys:Object.freeze(e.blockedOverrideOnlyKeys??[]),allowedInheritedOverrideOnlyKeys:Object.freeze(e.allowedInheritedOverrideOnlyKeys??[]),blockedInheritedKeys:t.blockedInheritedKeys,blockedInheritedPrefixes:t.blockedInheritedPrefixes,blockedPrefixes:t.blockedPrefixes,blockedOverridePrefixes:t.blockedOverridePrefixes,blockedKeys:t.blockedKeys,blockedOverrideKeys:t.blockedOverrideKeys})}const Gr=loadHostEnvSecurityPolicy();new Set(Gr.blockedKeys),new Set(Gr.blockedInheritedKeys),new Set(Gr.blockedOverrideKeys),(/* @__PURE__ */ new Set([...Object.keys(resolveNodeServiceIdentityEnvironment()),`OPENCLAW_GATEWAY_SERVICE_PID`])).delete(`OPENCLAW_PROFILE`),new I;function findCaseInsensitiveEnvKey(e,t){if(Object.hasOwn(e,t))return t;let n=t.toUpperCase();return Object.keys(e).find(e=>e.toUpperCase()===n)}const Kr=/* @__PURE__ */ new WeakMap;function resolveAppliedConfigEnvOwnership(e){return{...Kr.get(f(e)),...e===process.env?qr.ownedEnv:{}}}new I;function cloneEnvWithPlatformSemantics(e){let t={...ie(e)};return process.platform===`win32`&&(t=new Proxy(t,{deleteProperty(e,t){if(typeof t!=`string`)return Reflect.deleteProperty(e,t);let n=findCaseInsensitiveEnvKey(e,t);return!n||Reflect.deleteProperty(e,n)},get(e,t,n){if(typeof t!=`string`)return Reflect.get(e,t,n);let r=findCaseInsensitiveEnvKey(e,t);return r?e[r]:Reflect.get(e,t,n)},getOwnPropertyDescriptor(e,t){if(typeof t!=`string`)return Reflect.getOwnPropertyDescriptor(e,t);let n=findCaseInsensitiveEnvKey(e,t);if(n)return{configurable:!0,enumerable:!0,value:e[n],writable:!0}},has(e,t){return typeof t==`string`?findCaseInsensitiveEnvKey(e,t)!==void 0:Reflect.has(e,t)},set(e,t,n){return typeof t==`string`?(e[findCaseInsensitiveEnvKey(e,t)??t]=n,!0):Reflect.set(e,t,n)}})),Kr.set(ne(t),resolveAppliedConfigEnvOwnership(e)),_(t),t}let qr={ownedEnv:{},sourceConfig:null};const Jr=g(Symbol.for(`openclaw.gatewayServiceInstallation`),()=>new I);function getGatewayServiceInstallation(){return Jr.getStore()?.installation}function isGatewayExternallySupervised(e=process.env){return e.OPENCLAW_SUPERVISOR_MODE?.trim().toLowerCase()===`external`}const W=g(Symbol.for(`openclaw.stateDatabaseSchemaPolicies`),()=>({scopes:new I,existingDatabases:/* @__PURE__ */ new WeakMap,hasAdmittedExistingDatabase:!1}));function canonicalPath(e){let n=A({path:e});try{return be(In.native(n))}catch(e){if(t(e,`ENOENT`))return n;throw e}}function assertSchemaScopeActive(e){if(e&&!e.active)throw Error(`Existing shared-state schema admission has ended.`)}function getExistingOpenClawStateSchemaPath(){let e=W.scopes.getStore();return assertSchemaScopeActive(e),e?.path}function captureOpenClawStateSchemaReadAdmission(e){let t=W.scopes.getStore();if(t)return isExistingOpenClawStateSchema(e),{path:t.path,assertCurrent:()=>assertSchemaScopeActive(t)}}function isExistingOpenClawStateSchema(e,t){let n=getExistingOpenClawStateSchemaPath(),r=W.scopes.getStore(),i=t&&W.existingDatabases.get(t);if(!r&&!i)return!1;let a=A({path:e}),o=n!==void 0&&(n===a||r?.canonicalPath===a||r?.canonicalPath===canonicalPath(a));if(n&&!o)throw Error(`Existing shared-state schema admission is bound to ${n}, not ${e}.`);if(i&&(!o||i!==r?.canonicalPath))throw Error(`Shared-state database ${e} was admitted without schema repair; close its existing handle before ordinary admission.`);return o}function assertExistingOpenClawStateSchemaCacheAdmission(e,t){let n=getExistingOpenClawStateSchemaPath();if(!W.hasAdmittedExistingDatabase)return;let r=W.scopes.getStore(),i=r?A({path:e}):void 0,a=r&&(n===i||r.canonicalPath===i)?r.canonicalPath:void 0;for(let n of[t.cachedDatabases,t.retainedDatabaseHandles])for(let{db:t}of n.values()){let n=W.existingDatabases.get(t);n&&t.isOpen&&(a??=canonicalPath(e),n===a&&isExistingOpenClawStateSchema(e,t))}}function captureSqliteWorkerStateContext(e){return{databaseEngineSelection:e.databaseEngineSelection??Oe(),environment:{...e.environment},initializationCronDefaultStoreKey:e.initializationCronDefaultStoreKey,...e.initializationEnvironment?{initializationEnvironment:{...e.initializationEnvironment}}:{},...e.initializationAgentPaths?{initializationAgentPaths:[...e.initializationAgentPaths]}:{},existingSchemaPath:e.existingSchemaPath,gatewayServiceInstallation:e.gatewayServiceInstallation,...e.stateIntegrity?{stateIntegrity:e.stateIntegrity}:{},artifactPreservingReads:e.artifactPreservingReads,liveStateReads:e.liveStateReads,...e.scheduledMaintenanceSuspension?{scheduledMaintenanceSuspension:e.scheduledMaintenanceSuspension}:{}}}function sqliteWorkerRequestBytes(e,t,n){let r=t?.initializationAgentPaths?.reduce((e,t)=>e+Buffer.byteLength(t,`utf8`),0)??0;return[t?.environment,t?.initializationEnvironment].reduce((e,t)=>Object.entries(t??{}).reduce((e,[t,n])=>e+Buffer.byteLength(t,`utf8`)+Buffer.byteLength(n??``,`utf8`),e),e.byteLength+Buffer.byteLength(JSON.stringify(t?.databaseEngineSelection)??``,`utf8`)+Buffer.byteLength(JSON.stringify(t?.gatewayServiceInstallation)??``,`utf8`)+(n?.byteLength??0)+r+Buffer.byteLength(t?.initializationCronDefaultStoreKey??``,`utf8`)+(t?.scheduledMaintenanceSuspension?.byteLength??0))}g(Symbol.for(`openclaw.sqliteWorkerStateContext`),()=>new I);var SqliteSchemaMismatchError=class extends Error{constructor(...e){super(...e),this.name=`SqliteSchemaMismatchError`}};function tableExists(e,t){if(O(e))return j(e)?.catalog.some(e=>e.table===t&&e.kind===`table`)??!1;let n=k(e);return n?n.tables.has(t):cn(e,`SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?`,[t],e=>e.get(t))?.ok===1}function resolveLegacyCronDefaultStoreKey(e){return L.resolve(se(e),`cron`,`jobs.json`)}function captureOpenClawStateReadContextWithAdmission(e,t,n,r){let i=captureOpenClawStateSchemaReadAdmission(e),a=t(e,r),o=getGatewayServiceInstallation(),s=a.captureIntegrity?.(),c=a.assertCurrent,l=a,runInCapturedSchemaScope;if(i){let e=I.snapshot();l={databasePath:a.databasePath,coordinationKey:a.coordinationKey,get identity(){return a.identity},captureIntegrity:a.captureIntegrity,assertCurrent(){a.assertCurrent(),i.assertCurrent()}},runInCapturedSchemaScope=t=>e(()=>(l.assertCurrent(),t()))}return{databaseEngineSelection:Oe(),maintenanceScope:P(),admission:l,assertPublicationCurrent:c,existingSchemaPath:i?.path,gatewayServiceInstallation:o&&n(o.databasePath)?.key===a.identity.key?o:void 0,stateIntegrity:s,runInCapturedSchemaScope,artifactPreservingReads:isArtifactPreservingStateRead(`agent`,e)||void 0,liveStateReads:isLiveStateRead()||void 0}}function captureOpenClawStateReadWorkerContextWithAdmission(e,t,n){let i=e.env??process.env,a=process.platform===`win32`?cloneEnvWithPlatformSemantics(i):i,o={OPENCLAW_STATE_DIR:r(a),...isGatewayExternallySupervised(a)?{OPENCLAW_SUPERVISOR_MODE:`external`}:{}};return{...captureOpenClawStateReadContextWithAdmission(e.path??fn(o),t,n),environment:o}}function captureOpenClawStateWorkerContextWithAdmission(e,t,n){let r=captureOpenClawStateReadWorkerContextWithAdmission(e,t,n);return{...r,initializationCronDefaultStoreKey:resolveLegacyCronDefaultStoreKey(e.env??process.env),initializationEnvironment:lt([e.env??process.env,{OPENCLAW_STATE_DIR:void 0,OPENCLAW_SUPERVISOR_MODE:void 0},r.environment]),...e.initializationAgentPaths?{initializationAgentPaths:e.initializationAgentPaths.map(e=>L.resolve(e))}:{}}}function createStateDatabaseWalOwner({cachedDatabases:e,retainedDatabaseHandles:t,databaseIdentities:n,asyncResources:r},i,a){return{ownRetirement(e,t){let n={admission:{identity:a(e)},close:t},i=r.register(n);return un(e.db)?.own(n,`shared-references`,()=>n.close()),i},async stop(r,i){let a=/* @__PURE__ */ new Set([...t.values(),...e.values()]);await Promise.all([...a].filter(e=>r===void 0||e.path===r||i!==void 0&&n.get(e.db)?.key===i.key).flatMap(({walMaintenance:e})=>e?[e.stop()]:[]))},register(t,n,a,o){if(!kn||O(t.db))return;let s=captureOpenClawStateWorkerContextWithAdmission({path:t.path,env:o},()=>a,r.knownIdentity),c=new AbortController,l,cancel=()=>{if(c.abort(),!l)d();else return l.then(()=>void 0,()=>void 0)},u={admission:{identity:n},async close(){cancel(),await t.walMaintenance.stop(),d()}},d=r.register(u),run=async r=>{let a=un(t.db),o={...s,maintenanceScope:a},assertCurrent=()=>{if(c.signal.throwIfAborted(),o.admission.assertCurrent(),a?.assertAdmission(),un(t.db)!==a||e.get(t.path)!==t||!t.db.isOpen)throw new Jt(`Shared-state WAL maintenance owner changed`)},l,u=!1;try{assertCurrent(),l=i(t);let{runOpenClawStateWorkerOperation:e}=await import(`./openclaw-state-lease-heartbeat.worker-openclaw-state-worker-store-C5cbvQc0.mjs`);return assertCurrent(),await e(o,e=>e.execute({type:`database.walMaintenance`,input:r},{signal:c.signal}),{existingOnly:!0,assertCurrent,createAdmission:()=>({nativeLocations:[t.path,n.canonicalPath],databaseIdentity:{databasePath:t.path,key:n.key,birthtime:n.birthtime},admission:Sn((e,t)=>{if(assertCurrent(),!t())throw new Jt(`Shared-state WAL maintenance authority expired`);u=!0})})})}catch(e){if(!u&&(Rt(e)||c.signal.aborted&&ee(e)))return;throw e}finally{l?.()}};pn(t.db,e=>{if(c.signal.aborted)return Promise.resolve(void 0);let t=run(e);return l=t,t.finally(()=>{l===t&&(l=void 0),c.signal.aborted&&d()})},cancel)},readHealth(){let t=e.get(L.resolve(fn()));return t?.db.isOpen?t.walMaintenance.health:void 0}}}function getStateSchemaFacts(e){return O(e)?j(e):k(e)}const Yr={name:`state.schema-version`,lifetime:`process`,schemaDependent:!0,read(e){if(typeof e==`object`&&e&&`userVersion`in e&&typeof e.userVersion==`number`&&`contentVersion`in e&&typeof e.contentVersion==`number`)return{userVersion:e.userVersion,contentVersion:e.contentVersion}}};function createStateSchemaAdmission(e,t,n){let r={name:e,lifetime:n,schemaDependent:!0,read(e){if(typeof e!=`object`||!e||!(`value`in e)||!(`admissionId`in e)||typeof e.admissionId!=`string`)return;let n=t(e.value);return n===void 0?void 0:{value:n,admissionId:e.admissionId}}};return{get(e){if(tt(e))return;let t=D(e,r);if(!t)return;let n=getStateSchemaFacts(e);return t.admissionId===n?.admissionId?t.value:void 0},publish(e,t){!O(e)&&Xt(e)&&Tt(e);let n=getStateSchemaFacts(e);if(!n||!O(e)&&D(e,Et)?.admissionId!==n.admissionId)return;getStateSchemaVersionAdmission(e);let i={value:t,admissionId:n.admissionId};T(e,r,i)}}}const Xr=createStateSchemaAdmission(`state.runtime-schema`,e=>typeof e==`object`&&e&&`startupReady`in e&&typeof e.startupReady==`boolean`?{startupReady:e.startupReady}:void 0,`process`),Zr=/* @__PURE__ */ new WeakMap;function rememberConnectionVersion(e,t){let n=Zr.get(e),install=t=>{t?Zr.set(e,t):Zr.delete(e)};ce(e,{stage:()=>install(t),commit:()=>{},rollback:()=>install(n)})||install(t)}function schemaVersionKey(e){return{name:`state.schema-version:${e}`,read:Yr.read}}function getStateSchemaVersionAdmission(e){let t=getStateSchemaFacts(e);if(!t)return;let n=Zr.get(e);if(n?.schema===t)return n.facts;let r=D(e,schemaVersionKey(t.admissionId)),i=r?void 0:D(e,Et);if(!r&&!O(e)&&i?.admissionId!==t.admissionId)return;let a=r??D(e,Yr);return a&&(rememberConnectionVersion(e,{schema:t,facts:a}),r||T(e,schemaVersionKey(t.admissionId),a)),a}function rememberStateSchemaVersionAdmission(e,t){let n=getStateSchemaFacts(e);if(!n)return;rememberConnectionVersion(e,{schema:n,facts:t});let r=D(e,Et);(O(e)||r?.admissionId===n.admissionId)&&(T(e,schemaVersionKey(n.admissionId),t),T(e,Yr,t))}function publishStateSchemaVersionAdmission(e,t){T(e,Yr,t);let n=getStateSchemaFacts(e);n?(rememberConnectionVersion(e,{schema:n,facts:t}),T(e,schemaVersionKey(n.admissionId),t)):rememberConnectionVersion(e)}function getStateRuntimeSchemaAdmission(e){return Xr.get(e)}function publishStateRuntimeSchemaAdmission(e,t){Xr.publish(e,{startupReady:t})}const Qr=g(Symbol.for(`openclaw.stateIntegrityBindings`),()=>/* @__PURE__ */ new WeakMap);function invalidate(e){let t=Atomics.load(e,0);for(;t>=0n;){let n=Atomics.compareExchange(e,0,t,t+1n);if(n===t)return;t=n}}function invalidateOpenClawStateRuntimeIntegrity(e){Se(e);let t=Qr.get(e);t&&(invalidate(new BigInt64Array(t.revision)),invalidate(new BigInt64Array(t.lifetimeRevision)))}function retainSqliteDatabaseRemovalExclusion(e,t){if(!Pn(e))return;let n=M(ht(e)),close=()=>{if(!n.isOpen)return;let e=[];try{n.isTransaction&&n.exec(`ROLLBACK`)}catch(t){e.push(t)}try{n.close()}catch(t){e.push(t)}C(e,`SQLite state removal exclusion cleanup failed.`)};try{t.own(n,`shared-handles`,close),n.exec(`PRAGMA busy_timeout = 0; PRAGMA locking_mode = EXCLUSIVE; BEGIN EXCLUSIVE;`)}catch(e){try{close()}catch(t){throw De([e,t],`SQLite state removal admission and cleanup both failed.`,e)}if(qe(e))throw Error(`Cannot remove OpenClaw state directory while another SQLite connection is active`,{cause:e});let t=We(e);if(t!==11&&t!==26)throw e;return}process.platform===`win32`&&close()}function createOpenClawStateSnapshotOwnerRegistry(){let e=/* @__PURE__ */ new WeakMap;return{register(t,n){O(t.db)||e.set(t.db,registerLiveSqliteSnapshotOwner({database:t.db,databasePath:t.path,assertCurrent:()=>{if(n()!==t||!t.db.isOpen)throw Error(`OpenClaw state snapshot owner is no longer current`)}}))},release(t){O(t)||(e.get(t)?.(),e.delete(t))}}}const $r=g(Symbol.for(`openclaw.stateSnapshotOwners`),createOpenClawStateSnapshotOwnerRegistry),G=g(en,()=>({cachedDatabases:/* @__PURE__ */ new Map,retainedDatabaseHandles:/* @__PURE__ */ new Map,idleTimers:/* @__PURE__ */ new WeakMap,idleReferences:/* @__PURE__ */ new WeakMap,unregisterRetainedExitClose:void 0,databaseIdentities:/* @__PURE__ */ new WeakMap,borrowers:/* @__PURE__ */ new WeakMap,databaseLifecycleListeners:/* @__PURE__ */ new Set,terminalOpenLatch:createSqliteTerminalOpenLatch({closeByPath:(e,t)=>ui.closeTerminalFailure(e,t)}),asyncResources:Kt()}),()=>closeOpenClawStateDatabaseAsync(),`shared-state`),{cachedDatabases:K,retainedDatabaseHandles:q,idleTimers:ei,idleReferences:ti,databaseIdentities:ni,borrowers:J,databaseLifecycleListeners:ri,terminalOpenLatch:Y,asyncResources:X}=G,{touch:ii,retain:ai}=createStateDatabaseIdleRetirement(G,retireOpenClawStateDatabaseHandle),{register:oi,readHealth:si,ownRetirement:ci,stop:li}=createStateDatabaseWalOwner(G,ai,requireOpenClawStateDatabaseIdentity);function notifyOpenClawStateDatabaseLifecycle(e){let t=e.kind===`open-error`?{...e,identity:e.identity??X.knownIdentity(e.path)}:e;for(let e of ri)e(t)}function notifyOpenClawStateDatabaseClosed(e){notifyOpenClawStateDatabaseLifecycle({kind:`closed`,path:e.path,identity:requireOpenClawStateDatabaseIdentity(e)})}function requireOpenClawStateDatabaseIdentity(e){let t=ni.get(e.db);if(!t)throw Error(`Published shared-state owner has no recorded database identity`);return t}const ui=createStateDatabaseCacheAdmission({cachedDatabases:K,evict:evictCachedOpenClawStateDatabase,invalidate:e=>X.invalidate(e),notifyTerminalFailure:(e,t)=>notifyOpenClawStateDatabaseLifecycle({kind:`terminal-failure`,path:e,error:t,identity:X.knownIdentity(e)})});function registerOpenClawStateDatabaseLifecycleListener(e){ri.add(e);for(let t of K.values())t.db.isOpen&&e({kind:`opened`,database:t,identity:requireOpenClawStateDatabaseIdentity(t)});return()=>ri.delete(e)}function registerOpenClawStatePathCacheInvalidation(e){return registerOpenClawStateDatabaseLifecycleListener(t=>{if(t.kind!==`opened`)for(let[n,r]of e)r.path===(t.identity?.canonicalPath??t.path)&&e.delete(n)})}function retainStateDatabaseClose(e){q.set(e.db,e),G.unregisterRetainedExitClose??=y(closeOpenClawStateDatabase)}function ownMaintenanceStateDatabaseHandle(e){P()?.own(e.db,`shared-handles`,async()=>{let t=P();t&&Vt(e.db,t)&&(K.get(e.path)===e||q.get(e.db)===e)&&(await e.walMaintenance?.stop(),Vt(e.db,t)&&(K.get(e.path)===e||q.get(e.db)===e)&&retireOpenClawStateDatabaseHandle(e,!1))})}function closeUnpublishedOpenClawStateDatabaseHandle(e){let t=closeOpenClawStateDatabaseHandle(e);return q.get(e.db)===e&&ownMaintenanceStateDatabaseHandle(e),t}const{retain:di,borrowForRead:fi,retainForIndependentRead:pi}=createStateDatabaseRetainer(G,{assertOpen(e,t,n){assertOpenClawStateDatabaseOpenAllowed(e,t,n),assertExistingOpenClawStateSchemaCacheAdmission(e,G)},capture:e=>X.capture(e),retire:retireOpenClawStateDatabaseHandle,retainFailed:retainStateDatabaseClose,ownRetirement:ci,touch:ii});function closeOpenClawStateDatabaseHandle(e,t){clearTimeout(ei.get(e.db)),ei.delete(e.db);try{assertStateDatabaseBorrowersReleased(J.get(e.db),e.path)}catch(n){let r=J.get(e.db);return r&&(r.retiring=!0,r.retirement={ordinary:!0,isCurrent:()=>!0,retire:()=>{C(closeOpenClawStateDatabaseHandle(e,t),`OpenClaw state database cleanup failed for ${e.path}.`),r.cleanupComplete=!0,J.delete(e.db)}}),retainStateDatabaseClose(e),[n]}ti.delete(e.db),$r.release(e.db);let{errors:n,cleanupPending:r}=ln(e,t);return e.db.isOpen||r?retainStateDatabaseClose(e):q.delete(e.db),K.get(e.path)?.db===e.db&&K.delete(e.path),q.size===0&&(G.unregisterRetainedExitClose?.(),G.unregisterRetainedExitClose=void 0),n}function evictCachedOpenClawStateDatabase(e){return O(e.db)||invalidateOpenClawStateRuntimeIntegrity(e.db),K.get(e.path)===e&&(X.invalidate(e.path),K.delete(e.path),notifyOpenClawStateDatabaseClosed(e),closeOpenClawStateDatabaseHandle(e,{checkpointMode:`PASSIVE`}),!0)}function evictOpenClawStateDatabaseAfterCorruption(e,t){return Qe(t)&&evictCachedOpenClawStateDatabase(e)}function publishOpenClawStateDatabase(e,t){let{db:n,path:r}=e,{identity:i,admission:a}=X.publish(r);return ni.set(n,Bt(n)??i),K.set(r,e),oi(e,i,a,t),ii(e),$r.register(e,()=>K.get(r)),ownMaintenanceStateDatabaseHandle(e),notifyOpenClawStateDatabaseLifecycle({kind:`opened`,database:e,identity:i}),O(n)||Ht(n,t=>{!n.isTransaction&&Qe(t)&&evictCachedOpenClawStateDatabase(e)}),Y.clear(r),e}function getCachedOpenClawStateDatabase(e,t){let n=A({path:e}),r=Y.get(n);if(r)throw r;let i=readCachedOpenClawStateDatabase(n,t?.readOnly===!0);return i&&ii(i),i}function readCachedOpenClawStateDatabase(e,t){let n=P();t?n?.assertReadAdmission():n?.assertAdmission(),assertExistingOpenClawStateSchemaCacheAdmission(e,G);let r=K.get(e);if(r&&J.get(r.db)?.retiring)throw Error(`OpenClaw state database native borrower cleanup is pending: ${e}`);return r}function prepareOpenClawStateCachedRead(e){let t=A({path:e});getCachedOpenClawStateDatabase(t,{readOnly:!0});let n=X.capture(t);return()=>(n.assertCurrent(),readCachedOpenClawStateDatabase(t,!0))}function withCachedOpenClawStateDatabase(e,t,n){let r=getCachedOpenClawStateDatabase(e,t);return r&&ui.read(r,n)}function getOpenClawStateDatabaseIfOpenAtPath(e){let t=getCachedOpenClawStateDatabase(e);return mn(t?.db.isOpen?t.db:void 0),t?.db.isOpen?t:void 0}function closeStaleCachedOpenClawStateDatabase(e){if(K.get(e.path)!==e)return;X.invalidate(e.path);let t=closeOpenClawStateDatabaseHandle(e);notifyOpenClawStateDatabaseClosed(e),C(t,`Stale OpenClaw state database cleanup failed for ${e.path}.`)}function recordOpenClawStateDatabaseOpenFailure(e,t){Y.record(A({path:e}),t)}function clearOpenClawStateDatabaseOpenFailure(e){let t=A({path:e});Y.clear(t),X.invalidate(t),notifyOpenClawStateDatabaseLifecycle({kind:`failure-cleared`,path:t,identity:X.knownIdentity(t)})}async function getOpenClawStateDatabaseTerminalFailureAsync(e,t){return e.admission.assertCurrent(),t?.throwIfAborted(),Y.get(e.admission.databasePath)}function assertOpenClawStateDatabaseOpenAllowed(e,t,n){let r=A({path:e});t===`cached-read`&&n?n.assertReadAllowed():(t===`cached-read`?Dt:It)(e);let{identity:i}=X.capture(r),a=Y.get(r);if(a)throw a;for(let t of q.values())if(J.get(t.db)?.retiring&&(t.path===r||ni.get(t.db)?.key===i.key))throw Error(`OpenClaw state database native borrower cleanup is pending: ${e}`)}function recordOpenClawStateDatabaseLifecycleOpenError(e,t){notifyOpenClawStateDatabaseLifecycle({kind:`open-error`,path:A({path:e}),error:t})}function assertOpenClawStateDatabaseFreshOpenAllowedAtPath(e,t,n,r){assertOpenClawStateDatabaseOpenAllowed(e);let i;try{i=readOpenClawDatabaseQuarantineFailure(`state`,e,{env:t,refreshIdentity:r})}catch(e){if(!(e instanceof N))throw e;n?.(e)}if(i?.cause instanceof N&&n?.(i.cause),i)throw ui.closeTerminalFailure(e,i),i}function retireOpenClawStateDatabaseHandle(e,t=!0,n){assertStateDatabaseBorrowersReleased(J.get(e.db),e.path);let r=J.get(e.db);try{let r=K.get(e.path)?.db===e.db;t&&X.invalidate(e.path);let i=closeOpenClawStateDatabaseHandle(e,n);if(r&&t)try{notifyOpenClawStateDatabaseClosed(e)}catch(e){i.push(e)}C(i,`OpenClaw state database cleanup failed for ${e.path}.`)}catch(t){throw r&&retainStateDatabaseClose(e),t}r&&(r.cleanupComplete=!0,J.delete(e.db))}function stateDatabaseHandlesAt(e,t){return[.../* @__PURE__ */ new Set([...q.values(),...K.values()])].filter(n=>e===void 0||n.path===e||t!==void 0&&ni.get(n.db)?.key===t.key)}function retireOpenClawStateDatabaseHandles(e,t,n){let r=stateDatabaseHandlesAt(e,n),i=[];for(let e of r)try{retireOpenClawStateDatabaseHandle(e,!0,t)}catch(e){i.push(e)}return C(i,`OpenClaw state database cleanup failed.`),r.length>0}function closeOpenClawStateDatabaseByPath(e,t){return retireOpenClawStateDatabaseHandles(A({path:e}),t,X.identity(e))}function sealOpenClawStateDatabaseByPath(e){let t=A({path:e}),n=X.identity(e);return!stateDatabaseHandlesAt(t,n).some(e=>J.get(e.db)?.references.size)&&retireOpenClawStateDatabaseHandles(t,void 0,n)}function closeOpenClawStateDatabase(e){retireOpenClawStateDatabaseHandles(void 0,e)}const mi=X.register;function registerOpenClawStatePathAsyncResource(e,t){return mi({close(n){return!n||n.key===e.identity.key||n.canonicalPath===e.identity.canonicalPath?t():Promise.resolve()}})}const hi=X.capture,gi=X.integrity;function publishOpenClawStateDatabaseWorkerAdmission(e,t){t&&e.assertCurrent(),X.publish(e.databasePath,t),e.assertCurrent(),ue(e.databasePath,e.identity)}function closeOpenClawStateDatabaseByPathAsync(e,t){let n=A({path:e});return X.close(n,async e=>(await li(n,e),retireOpenClawStateDatabaseHandles(n,t,e)))}function closeOpenClawStateDatabaseWorkersByPathAsync(e){return X.close(A({path:e}),()=>!1)}async function closeOpenClawStateDatabaseAsync(e){await X.close(void 0,async()=>(await li(),retireOpenClawStateDatabaseHandles(void 0,e)))}function isOpenClawStateDatabaseOpen(e){return e===void 0?Array.from(K.values()).some(e=>e.db.isOpen):K.get(A({path:e}))?.db.isOpen===!0}function closeOpenClawStateDatabaseForTest(){closeOpenClawStateDatabase(),Y.clearAll()}function assertPublishedOpenClawStateDatabaseLifecycle(){if(e(en)!==G)throw Error(`OpenClaw state database lifecycle is retired; its owners cannot serve the published lifecycle`)}const _i={assertOpenClawStateDatabaseFreshOpenAllowedAtPath,assertOpenClawStateDatabaseOpenAllowed,clearOpenClawStateDatabaseOpenFailure,closeOpenClawStateDatabase,closeOpenClawStateDatabaseByPath,sealOpenClawStateDatabaseByPath,closeOpenClawStateDatabaseForTest,closeOpenClawStateDatabaseHandle,closeUnpublishedOpenClawStateDatabaseHandle,closeStaleCachedOpenClawStateDatabase,evictCachedOpenClawStateDatabase,evictOpenClawStateDatabaseAfterCorruption,getCachedOpenClawStateDatabase,peekOpenClawStateDatabaseConnection:e=>K.get(A({path:e}))?.db,withCachedOpenClawStateDatabase,getOpenClawStateDatabaseRecordedFailure:Y.peek,getOpenClawStateDatabaseIfOpenAtPath,getKnownOpenClawStateDatabaseIdentity:X.knownIdentity,isOpenClawStateDatabaseOpen,isOpenClawStateDatabaseSchemaReady:e=>K.get(e.path)===e&&e.db.isOpen,publishOpenClawStateDatabase,recordOpenClawStateDatabaseOpenFailure,recordOpenClawStateDatabaseLifecycleOpenError,async reconcileFailedWorkerAdmission(e){await X.retireChangedAdmission(e),e.assertCurrent()},touchStateDatabase:ii};async function prepareOpenClawStateDatabaseRemoval(e,t){let n=A({path:e}),r=P();if(!r?.ownsSchemaMaintenance)throw Error(`State removal requires the installation's maintenance owner`);r.assertAdmission();let i=X.holdExclusion(n);try{await closeOpenClawStateDatabaseByPathAsync(n),r.assertOwnerCurrent(),retainSqliteDatabaseRemovalExclusion(n,r),r.assertOwnerCurrent()}catch(e){throw i(),e}let a=!0;return{assertCurrent(){if(!a)throw Error(`State removal admission has been released`);t()},release(){a&&(a=!1,i())}}}const vi=new I;function hasUpdateDoctorMigrationCapture(){return vi.getStore()?.capture!==void 0}function capturedAttribution(){if(hasUpdateDoctorMigrationCapture())throw Error(`Update migration capture is active without its attribution owner.`)}function beginUpdatePostgresMigration(e,t){return capturedAttribution()?.beginPostgres(e,t)}const yi=36e5,Z=/* @__PURE__ */ new Map;function closeBridge(e){e.port.close()}function closeIdleBridges(){let e=[...Z.values()];Z.clear(),unwatch();for(let{bridge:t,timeout:n}of e)clearTimeout(n),closeBridge(t)}function unwatch(){Z.size||(process.off(`beforeExit`,closeIdleBridges),process.off(`exit`,closeIdleBridges))}function removeIdleBridge(e){let t=Z.get(e);return Z.delete(e),t&&clearTimeout(t.timeout),unwatch(),t}function takeIdlePostgresBridge(e){let t=removeIdleBridge(e);if(t){if(Atomics.load(t.bridge.service,1))closeBridge(t.bridge);else return{bridge:t.bridge,validate:Date.now()-t.releasedAt>=1e3}}}function retainIdlePostgresBridge(e,t){let n=removeIdleBridge(e);if(n&&closeBridge(n.bridge),Z.size===2){let e=Z.keys().next().value;closeBridge(removeIdleBridge(e).bridge)}Z.size||(process.once(`beforeExit`,closeIdleBridges),process.once(`exit`,closeIdleBridges));let r=setTimeout(()=>{let t=removeIdleBridge(e);t&&closeBridge(t.bridge)},18e4);r.unref(),Z.set(e,{bridge:t,timeout:r,releasedAt:Date.now()})}function postgresBridgeReuseKey(e){return Qt(JSON.stringify([e.url,e.lockTimeoutMs??6e4,e.statementTimeoutMs??9e4,e.readOnly===!0]))}function preparedBridgeKey(e){return JSON.stringify([postgresBridgeReuseKey(e),e.schema,e.storeId])}function createPostgresBridge(e){let{port1:t,port2:n}=new On,r=new SharedArrayBuffer(8),i=new Int32Array(r),{port:a,signal:o,nextStep:s}=wn(),c=new Int32Array(o);if(Atomics.load(c,1)){t.close(),n.close();let e=/* @__PURE__ */ Error(`PostgreSQL I/O service is unavailable.${s?` Run ${s}.`:``}`);throw he(e),e}try{a.postMessage({connection:{port:n,signal:r,url:e.url,schema:e.schema,connectTimeoutMs:6e4,lockTimeoutMs:e.lockTimeoutMs??6e4,statementTimeoutMs:e.statementTimeoutMs??9e4,readOnly:e.readOnly===!0}},[n])}catch(e){throw t.close(),n.close(),e}return t.unref(),{port:t,control:i,service:c,nextStep:s,requestId:0}}const bi=new I;function findPreparedBridge(e){let t=bi.getStore();for(;t;){if(t.key===e&&t.bridge&&!Atomics.load(t.bridge.service,1))return t;t=t.parent}}function takePreparedPostgresBridge(e){let t=findPreparedBridge(preparedBridgeKey(e)),n=t?.bridge;return t&&n&&(t.bridge=void 0,t.detachAbort()),n}function assertPostgresOperationCurrent(){let e=Cn.getStore();if(e&&(!e.active||e.owner.refusal))throw e.owner.refusal??/* @__PURE__ */ Error(`PostgreSQL worker operation is no longer active`)}function runPostgresTransactionSync(e,t,n,r=!1,i=!1){assertPostgresOperationCurrent();let a=w(e);return Fe(a,()=>{let a=e.isTransaction&&!i,o=!1,s;try{r&&!a&&(s=Zt(e)),a?e.exec(`SAVEPOINT openclaw_tx_nested`):e.isTransaction||e.exec(r?`BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY`:`BEGIN ISOLATION LEVEL READ COMMITTED; SELECT pg_advisory_xact_lock(${e.advisoryLockKey})`);let i=n?.maintenance&&a?String(e.prepare(`SHOW statement_timeout`).get().statement_timeout):void 0;n?.maintenance&&e.exec(`SET LOCAL statement_timeout = '${yi}ms'`);let c=t();if(et(c),a)i!==void 0&&e.prepare(`SELECT set_config('statement_timeout', ?, true)`).get(i),e.exec(`RELEASE SAVEPOINT openclaw_tx_nested`);else{let commit=()=>{assertPostgresOperationCurrent(),r||xe(e),e.exec(r?`ROLLBACK`:`COMMIT`),o=!r};n?.withCommit?et(n.withCommit(commit)):commit()}return c}catch(t){let n=Me(t)||o;if(!n)try{a?(e.exec(`ROLLBACK TO SAVEPOINT openclaw_tx_nested`),e.exec(`RELEASE SAVEPOINT openclaw_tx_nested`)):e.isTransaction&&e.exec(`ROLLBACK`)}catch{n=!0}if(n)try{ke(e,t,`unknown`)}finally{try{e.close()}catch{}}throw t}finally{s?.()}})}var PostgresSyncConnection=class{constructor(e,t,n,r,i){this.schema=t,this.anchor=n,this.storeId=r,this.isOpen=!0,this.isTransaction=!1,this.mutationRevision=0,this.lastResponseAt=Date.now(),this.outcomeUnknown=!0,this.readOnlyTransaction=!1,this.pendingWrite=!1,this.mainThread=jn===0,this.maintenance=!1,assertEngineStoreExecutionAllowed(),this.admissionReadOnly=i?.readOnly===!0,Object.defineProperty(this,Symbol.for(`openclaw.postgres-sync-connection`),{value:!0}),this.advisoryLockKey=Mn(`sha256`).update(r).digest().readBigInt64BE(),this.bridgeParameters={url:e,schema:t,storeId:r,...i},this.reuseKey=i?.reuse?postgresBridgeReuseKey(this.bridgeParameters):void 0,this.connect()}connect(){let e=this.reuseKey?takeIdlePostgresBridge(this.reuseKey):void 0,t=e?.bridge??takePreparedPostgresBridge(this.bridgeParameters)??createPostgresBridge(this.bridgeParameters);if(this.bridge=t,this.idleCheckout=e?e.validate?`validate`:`reconnect`:void 0,t.port.unref(),e)return t;try{this.request({operation:`connect`,schema:this.schema})}catch(e){throw this.isOpen=!1,this.isTransaction=!1,this.bridge=void 0,t.port.close(),e}return t}runTransaction(e,t,...n){let r=this.maintenance;this.maintenance=r||t?.maintenance===!0;try{return runPostgresTransactionSync(this,e,t,this.admissionReadOnly||n[0],n[1])}finally{this.maintenance=r}}readRecoveryGeneration(e=!1){return this.request({operation:`recovery-generation`,schema:this.schema,storeId:this.storeId,lock:e},!1)}loseConnection(){!this.failure&&this.outcomeUnknown&&(this.pendingWrite=!0,ze(w(this),!0)),this.finishWrite(),this.failure??=this.outcomeUnknown?new Ve(`PostgreSQL connection lost; outcome unknown`,`outcome-unknown`):/* @__PURE__ */ Error(`PostgreSQL connection lost; transaction rolled back`);let e=this.bridge;return e?.nextStep&&!this.failure.message.includes(e.nextStep)&&(this.failure.message+=` Run ${e.nextStep}.`),e&&Atomics.load(e.service,1)&&he(this.failure),this.isOpen=!1,this.isTransaction=!1,e?.port.close(),this.bridge=void 0,this.failure}finishWrite(){this.pendingWrite&&(this.pendingWrite=!1,nt(w(this)))}assertOpen(){if(this.failure)throw this.failure;if(!this.isOpen)throw Error(`PostgreSQL connection is closed`)}request(e,t=!0){this.mainThread&&e.operation!==`close`&&e.operation!==`release`&&assertEngineStoreExecutionAllowed(),this.assertOpen();let n=this.bridge??this.connect();this.outcomeUnknown=t;let r=++n.requestId;if(r>2147483647)throw this.loseConnection();let i=(this.maintenance?yi:this.bridgeParameters.statementTimeoutMs??9e4)+3e4,a=performance.now()+i,o=n.inTransaction===!1,s=(this.idleCheckout!==void 0||o)&&(e.operation===`query`||e.operation===`recovery-generation`),c=s&&(this.idleCheckout===`validate`||o&&Date.now()-this.lastResponseAt>=1e3);n.inTransaction=void 0,this.idleCheckout=void 0,n.port.postMessage({...e,...s?{reconnectIfIdle:s}:{},...c?{validateIfIdle:c}:{},id:r,deadlineMs:i},[]),Xe(`sqlite_request`,`to_worker`);for(let e=Atomics.load(n.control,0);e!==r;e=Atomics.load(n.control,0)){if(Atomics.load(n.service,1))throw this.loseConnection();let t=a-performance.now();if(t<=0)throw Atomics.store(n.service,1,1),Atomics.notify(n.service,1),this.loseConnection();Atomics.wait(n.control,0,e,Math.min(t,50))}let l=An(n.port)?.message;if(l&&Xe(`sqlite_reply`,`from_worker`),!l||l.id!==r)throw this.loseConnection();if(`error`in l)throw e.operation===`connect`?decodePostgresError(l.error):isPostgresConnectionError(l.error.code)?this.loseConnection():(e.operation===`query`&&/^\s*COMMIT\b/i.test(e.sql)&&(this.isTransaction=!1,this.finishWrite()),decodePostgresError(l.error));return this.lastResponseAt=Date.now(),`reusable`in l?(n.inTransaction=!l.reusable,l.reusable):(n.inTransaction=`generation`in l?l.inTransaction:l.result.inTransaction,`generation`in l?l.generation:l.result)}query(e,t=[],n=!1){return Ft(`postgres`,`statement`,e,()=>this.execute(preparePostgresQuery(e),t,n))}execute({sql:e,mutation:t},n,r){validatePostgresBindings(n);let i=this.isTransaction;/^\s*BEGIN\b/i.test(e)&&(this.isTransaction=!0);let a=this.request({operation:`query`,schema:this.schema,sql:e,parameters:n},!i||/^\s*COMMIT\b/i.test(e)),o=this.readOnlyTransaction;if(this.isTransaction=a.inTransaction,this.readOnlyTransaction=this.isTransaction&&(o||/^\s*BEGIN\b[^;]*\bREAD\s+ONLY\b/i.test(e)),/^\s*COMMIT\s*;?\s*$/i.test(e)&&a.command!==`COMMIT`)throw this.finishWrite(),Error(`PostgreSQL transaction rolled back instead of committing`);let s=a.mutation===`unscoped`||t===`unscoped`?`unscoped`:a.mutation??t,c=s!==void 0;if(c){if(o||this.readOnlyTransaction)throw Error(`PostgreSQL read snapshot cannot execute a mutation`);this.mutationRevision++,this.pendingWrite=!0,ze(w(this),s===`unscoped`)}return!this.isTransaction&&(c||i)&&Fe(w(this),()=>{this.finishWrite()}),this.outcomeUnknown=!this.isTransaction,{rows:decodePostgresRows(a,r),rowCount:a.rowCount,columns:a.fields.map(({name:e})=>({name:e}))}}exec(e){this.query(e)}prepare(e){this.assertOpen();let t=preparePostgresQuery(e),n=!1,r=[],execute=i=>{let a=Ft(`postgres`,`statement`,e,()=>this.execute(t,i,n));return r=a.columns,a};return{get:(...e)=>execute(e).rows[0],all:(...e)=>execute(e).rows,iterate:(...e)=>execute(e).rows[Symbol.iterator](),run:(...e)=>({changes:execute(e).rowCount,lastInsertRowid:0}),columns:()=>r,setReadBigInts:e=>{n=e}}}releaseIdleTransport(){let e=this.bridge;if(!this.isOpen||!e||!this.reuseKey||this.isTransaction)return;let t=!1;try{e.inTransaction===!1||this.request({operation:`release`})?(retainIdlePostgresBridge(this.reuseKey,e),t=!0):(this.isOpen=!1,this.finishWrite())}finally{this.bridge=void 0,t||e.port.close()}}close(){if(this.isOpen)try{this.reuseKey&&!this.isTransaction?this.releaseIdleTransport():this.bridge&&this.request({operation:`close`})}finally{this.finishWrite(),this.isOpen=!1,this.isTransaction=!1,this.bridge?.port.close(),this.bridge=void 0}}};Buffer.from(`
VmRSS:`),Buffer.from(`
VmSwap:`);const Q=Gt(process.versions.node);!process.versions.bun&&Q&&(Q.major===24&&Q.minor>=19||Q.major===26&&Q.minor>=4&&Q.minor),Hn(Fn),g(Symbol.for(`openclaw.hostExecMemory`),()=>({watches:/* @__PURE__ */ new Set,sampling:!1,assessmentPending:!1})),new Lt;const xi=`memory_index_chunks_fts`,Si=`memory_index_paths_fts`;function buildMemoryFtsTriggers(e,t,n,r,i){let trigger=(n,r,i)=>({name:`${e}_after_${n}`,sql:`
      CREATE TRIGGER IF NOT EXISTS main.${e}_after_${n}
      AFTER ${r} ON ${t}
      BEGIN
${i}
      END;
    `});return[trigger(`insert`,`INSERT`,r),trigger(`update`,`UPDATE OF ${n}`,`${i}
${r}`),trigger(`delete`,`DELETE`,i)]}buildMemoryFtsTriggers(Si,`memory_index_sources`,`id, path, source`,`        INSERT INTO ${Si} (rowid, path, source)
        VALUES (NEW.id, NEW.path, NEW.source);`,`        DELETE FROM ${Si}
        WHERE rowid = OLD.id;`),buildMemoryFtsTriggers(xi,`memory_index_chunks`,`chunk_rowid, text, id, path, source, model, start_line, end_line`,`        INSERT INTO ${xi} (rowid, text, id, path, source, model, start_line, end_line)
        VALUES (NEW.chunk_rowid, NEW.text, NEW.id, NEW.path, NEW.source, NEW.model, NEW.start_line, NEW.end_line);`,`        DELETE FROM ${xi} WHERE rowid = OLD.chunk_rowid;`);const Ci={sqlite:{openConnection:({anchor:e})=>bt(e),schema:{bootstrap:e=>e.openSqlite()}},postgres:{openConnection:e=>{if(!e.input||!e.storeId||!e.namespace)throw Error(`PostgreSQL store is not admitted`);try{return new PostgresSyncConnection(e.input.connection,e.namespace,e.anchor,e.storeId,{reuse:e.reusePostgresConnection,readOnly:e.input.readOnly,lockTimeoutMs:6e4,statementTimeoutMs:9e4})}catch(t){let n=t instanceof Error&&`code`in t&&typeof t.code==`string`?`${t.code}: `:``,r=p(`${n}${t instanceof Error?t.message:String(t)}`.replaceAll(e.input.connection,`[REDACTED]`),{mode:`tools`});throw Error(`Cannot open PostgreSQL connection: ${r}; verify database.postgres.connection and server availability.`,{cause:t})}},schema:{bootstrap:(e,t)=>{if(!e.schema.postgres)throw Error(`Store has no PostgreSQL schema`);t.exec(mt(e.schema,e.namespace)),t.prepare(`INSERT INTO openclaw_schema_meta (store, version, store_id) VALUES (?, ?, ?)`).run(e.schema.id,e.schema.version,e.storeId)},migrate:(e,t,n)=>{if(t>e.schema.version)throw Error(`PostgreSQL ${e.schema.id} schema ${t} is newer than this build (expected ${e.schema.version}); use a compatible binary, or reverse-port with a compatible binary before downgrading.`);for(let r=t+1;r<=e.schema.version;r++){let t=e.schema.postgresMigrations?.find(e=>e.version===r);if(!t)throw Error(`Missing PostgreSQL ${e.schema.id} migration to version ${r}; use a compatible binary or restore a matching backup.`);let i=yt(n,e.namespace,e.schema.id),a=vt(e.schema,i);if(Pt(n,e.namespace,{...a,version:r-1,postgres:t.fromSchema.postgres,postgresFragments:t.fromSchema.postgresFragments,postgresWithoutOptionalColumn:t.fromSchema.postgresWithoutOptionalColumn,postgresVectorDecoderVersion:t.fromSchema.postgresVectorDecoderVersion,postgresVectorSearchVersion:t.fromSchema.postgresVectorSearchVersion,postgresTextSearchVersion:t.fromSchema.postgresTextSearchVersion},i),t.schema.postgresVectorSearchVersion===2&&t.fromSchema.postgresVectorSearchVersion!==2)for(let t of[a.search,...Object.values(a.searchExtensions??{})])t&&xt(n,t,e.namespace,2);e.beforeMigrate?.(n,r-1,new Set(i.catalog.filter(e=>e.kind===`table`).map(e=>e.table))),n.exec(t.sql),n.prepare(`UPDATE openclaw_schema_meta SET version = ? WHERE store = ?`).run(r,e.schema.id),Mt(n,e.namespace,{...a,version:r,postgres:t.schema.postgres,postgresFragments:t.schema.postgresFragments,postgresWithoutOptionalColumn:t.schema.postgresWithoutOptionalColumn,postgresVectorDecoderVersion:t.schema.postgresVectorDecoderVersion,postgresVectorSearchVersion:t.schema.postgresVectorSearchVersion,postgresTextSearchVersion:t.schema.postgresTextSearchVersion})}}}}},wi={name:`database.engine`};function readEngineAnchor(e,t=`identity`,n=!1){try{return t===`schema`?[e.prepare(`SELECT schema FROM openclaw_engine_anchor LIMIT 1`).get()]:e.prepare(`SELECT store_id, engine, schema FROM openclaw_engine_anchor`).all()}catch(e){if(n||!(e instanceof Error)||e.message!==`no such table: openclaw_engine_anchor`)throw e;return}}function familySetting(e){return`database.families.${e.id===`team_reports`?`team-reports`:e.id}.engine`}function refusePostgresAnchor(e,t){let n=readEngineAnchor(e,`schema`);if(n)throw Error(`This store lives in PostgreSQL schema ${String(n[0]?.schema??`unknown`)}; set ${familySetting(t)} to postgres and configure database.postgres.connection.`)}function openEngineStore(e){let{anchor:t}=e,n=e.schema;bt(t);let r=e.input!==void 0&&n.postgres!==void 0,i=D(t,wi);if(!r){if(i?.engine===`postgres`)throw Error(`This store lives in PostgreSQL schema ${i.namespace}; set ${familySetting(n)} to postgres and configure database.postgres.connection.`);return!i&&e.inspectSqlite().hasEngineAnchor&&refusePostgresAnchor(t,n),e.prepareAnchor(),Ci.sqlite.schema.bootstrap({...e,input:e.input},t),T(t,wi,{engine:`sqlite`}),Ci.sqlite.openConnection({...e,input:e.input})}if(i?.engine===`sqlite`)throw Error(`Existing SQLite ${n.id} data cannot switch engines; stop the Gateway and use openclaw database port for a supported store family before changing ${familySetting(n)}.`);let a=e.input?.readOnly===!0;a||e.prepareAnchor();let readOrCreateAnchor=()=>{let r=e.inspectSqlite();if(r.hasExistingData)throw Error(`Existing SQLite ${n.id} data cannot switch engines; stop the Gateway and use openclaw database port for a supported store family before changing ${familySetting(n)}.`);if(!r.hasEngineAnchor&&(e.existingOnly||a))throw Error(`Missing PostgreSQL anchor; restore the matching PostgreSQL schema and anchor.`);r.hasEngineAnchor||t.exec(`CREATE TABLE IF NOT EXISTS openclaw_engine_anchor (store_id TEXT NOT NULL, engine TEXT NOT NULL CHECK (engine = 'postgres'), schema TEXT NOT NULL)`);let i=readEngineAnchor(t,`identity`,!0)??[];if(i.length>1||r.hasEngineAnchor&&i.length===0)throw Error(`Invalid engine anchor: expected exactly one identity. Restore a matching backup.`);let o=i[0];if(o){if(typeof o.store_id!=`string`||o.engine!==`postgres`||typeof o.schema!=`string`)throw Error(`Invalid PostgreSQL anchor identity. Restore a matching backup.`);return{storeId:o.store_id,namespace:o.schema}}let s=Nn(),c=Nt(e.input.schemaPrefix,n.id,s);return t.prepare(`INSERT INTO openclaw_engine_anchor (store_id, engine, schema) VALUES (?, 'postgres', ?)`).run(s,c),e.onFreshAnchor?.(t),{storeId:s,namespace:c}},o=i?.engine===`postgres`?i:e.existingOnly||a?readOrCreateAnchor():gt(t,readOrCreateAnchor),s={...e,input:e.input,...o},c=Ci.postgres,l=c.openConnection(s),admit=t=>{_t({db:l,namespace:o.namespace,storeId:o.storeId,store:n.id,version:n.version,schema:n,recordSchema:t,preserveSchemaSeal:e.existingVersion,requireSealedSchema:a}),e.admitPostgres?.(l,t)};try{let r=n.search?xt(l,n.search,o.namespace,e.existingVersion?1:n.postgresVectorSearchVersion):void 0;if(a)l.runTransaction(()=>admit(!1),void 0,!0);else if(!i||i.engine===`postgres`&&i.version!==n.version){St(l);let t,r;l.runTransaction(()=>{let i=!l.prepare(`SELECT 1 FROM pg_catalog.pg_namespace WHERE nspname = ?`).get(o.namespace);i&&!e.existingOnly&&(l.exec(`CREATE SCHEMA IF NOT EXISTS "${o.namespace.replaceAll(`"`,`""`)}"`),l.exec(gn));let a;try{a=l.prepare(`SELECT version, store_id FROM openclaw_schema_meta WHERE store = ?`).get(n.id)}catch(e){throw Error(`Missing PostgreSQL metadata; use the matching OpenClaw version or restore the matching PostgreSQL schema and anchor.`,{cause:e})}if(a){if(a.store_id!==o.storeId)throw Error(`PostgreSQL database identity mismatch: expected ${o.storeId}, found ${String(a.store_id)}. Restore the matching anchor and PostgreSQL backup.`);if(a.version!==n.version){if(e.existingVersion){let e=n.postgresMigrations?.find(e=>e.version===Number(a.version)+1)?.fromSchema;if(!e)throw Error(`Missing PostgreSQL source schema for inspection`);n={...n,...e,postgresVectorDecoderVersion:e.postgresVectorDecoderVersion,postgresVectorSearchVersion:e.postgresVectorSearchVersion,postgresTextSearchVersion:e.postgresTextSearchVersion,version:Number(a.version)}}else{r=e.assertMigrationCurrent,r?.(),t=beginUpdatePostgresMigration(l,r),de(l),ce(l,{stage:()=>{},rollback:()=>{},commit:()=>ve(l),invalidate:()=>ve(l)});let migrate=()=>c.schema.migrate(s,Number(a.version),l);t?t.run(migrate):migrate()}}}else{if(e.existingOnly||!i)throw Error(`Missing PostgreSQL metadata; restore the matching PostgreSQL schema and anchor.`);c.schema.bootstrap(s,l)}admit(!a)},{maintenance:!0,withCommit(e){r?.(),t?.beforeCommit(),e()}},!1),t?.committed()}else admit(!1);(!i||i.engine===`postgres`&&i.version!==n.version)&&T(t,wi,{engine:`postgres`,...o,version:n.version}),r?.();for(let e of Object.values(Ot(l)?.searchExtensions??{}))xt(l,e,o.namespace,n.postgresVectorSearchVersion)?.();return l}catch(t){if(e.closeOnFailure)return e.closeOnFailure(l,t);throw l.close(),t}}const Ti=/CREATE (?:UNIQUE )?INDEX ("(?:[^"]|"")+") ON ("(?:[^"]|"")+") (?:'(?:[^']|'')*'|"(?:[^"]|"")*"|[^;'"])*;/g,Ei=/'(?:[^']|'')*'|"(?:[^"]|"")*"|\) (ASC|DESC)(?=,|\))/g;function withLegacyPostgresIndexOrdering(e,t=`sqlite`,n=e){let r=/* @__PURE__ */ new Map;if(t===`schema-nullability`)for(let[,e,t]of n.matchAll(/CREATE TABLE ("(?:[^"]|"")+") \(\n([\s\S]*?)\n\);/g))r.set(e,new Set([...t.matchAll(/^ {2}("(?:[^"]|"")+") (?:text|bigint|bytea|double precision)([^\n]*)/gm)].filter(e=>!/\bNOT NULL\b/.test(e[2].replace(`GENERATED BY DEFAULT AS IDENTITY`,``).split(/\bDEFAULT\b/)[0])).map(([,e])=>e)));return e.replace(Ti,(e,n,i)=>t===`schema-nullability`?e.replace(/'(?:[^']|'')*'|"(?:[^"]|"")*"|\(("(?:[^"]|"")+")\) (ASC|DESC)(?=,|\))/g,(e,t,n)=>t&&r.get(i)?.has(t)?`${e} NULLS ${n===`DESC`?`LAST`:`FIRST`}`:e):e.replace(Ei,(e,t)=>t?`${e} NULLS ${t===`DESC`?`LAST`:`FIRST`}`:e))}function postgresIndexOrderingMigration(e,t=`sqlite`){let n=withLegacyPostgresIndexOrdering(e,t),r=new Map([...n.matchAll(Ti)].map(([e,t])=>[t,e]));return[...e.matchAll(Ti)].filter(([e,t])=>r.get(t)!==e).map(([e,t,n])=>`DO $index_order$
BEGIN
  IF to_regclass('${n.replaceAll(`'`,`''`)}') IS NOT NULL THEN
    DROP INDEX ${t};
    ${e}
  END IF;
END $index_order$;`).join(`
`)}[`github_publication_requests`,`github_personal_publication_requests`,`github_repository_publication_requests`].map(e=>`${e}.draft`);function withLegacyPublicationDraft(e){return e.replace(/(CREATE TABLE(?: IF NOT EXISTS)? "?github_(?:personal_|repository_)?publication_requests"? \([\s\S]*?)\n {2}(?:"draft" bigint|draft INTEGER),/gu,`$1`)}const Di=[`local_workspace_tree_packs`,`local_workspace_source_path_sets`],Oi=[`tree_root_digest`,`source_paths_digest`,`canonical_fingerprints`,`projection_fingerprints`];[...Di],Oi.map(e=>`local_workspace_projections.${e}`);function withLegacyLocalWorkspaceCas(e){return e.replace(/\n {2}(?:tree_root_digest|source_paths_digest|canonical_fingerprints|projection_fingerprints) BLOB,/gu,``).replace(/\n {2}"(?:tree_root_digest|source_paths_digest|canonical_fingerprints|projection_fingerprints)" bytea,/gu,``).replace(/CREATE TABLE(?: IF NOT EXISTS)? "?local_workspace_(?:tree_packs|source_path_sets)"? \([\s\S]*?\n\)(?: STRICT(?:, WITHOUT ROWID)?)?;\n?/gu,``)}function withLegacyLocalWorkspaceManifests(e){return withLegacyLocalWorkspaceCas(e).replace(/\n {2}(?:checkpoint_json TEXT|"checkpoint_json" text COLLATE "C"),/gu,``).replace(/^ {2}CHECK \([^\n]*baseline_json[^\n]*baseline_ref[^\n]*\),$/gmu,e=>e.includes(`"`)?`  CHECK ((("baseline_json" IS NULL) = ("baseline_ref" IS NULL))),`:`  CHECK ((baseline_json IS NULL) = (baseline_ref IS NULL)),`).replace(/CREATE TABLE(?: IF NOT EXISTS)? "?local_workspace_manifest_nodes"? \([\s\S]*?\n\)(?: STRICT)?;\n?/gu,``).replace(/ALTER TABLE "local_workspace_manifest_nodes" ADD FOREIGN KEY[^;]*;\n?/gu,``)}const ki=[[`workspace_setup_state`,`bootstrap_deferred`,`INTEGER`,!0],[`agent_deletion_journal`,`phase`,`TEXT`,!0],[`agent_database_leases`,`provenance`,`TEXT`,!0],[`user_profile_identities`,`canonical_login`,`TEXT`],[`user_profile_identities`,`authorization_id`,`TEXT`],[`user_profile_identities`,`authorization_basis_json`,`TEXT`],[`user_profile_identities`,`verified_email_json`,`TEXT`,!0],[`template_installs`,`bootstrap_content_digest`,`TEXT`],[`template_installs`,`bootstrap_source_path`,`TEXT`],[`worker_environments`,`desktop_json`,`TEXT`],[`worker_environments`,`bootstrap_install_kind`,`TEXT`],[`worker_environments`,`preparation_purpose`,`TEXT`],[`template_package_refs`,`extension_adapter_identity`,`TEXT`],[`template_package_refs`,`extension_detected_format`,`TEXT`],[`template_package_refs`,`extension_format`,`TEXT`],[`template_package_refs`,`extension_id`,`TEXT`],[`template_package_refs`,`extension_mapped_json`,`TEXT`],[`template_package_refs`,`extension_unavailable_json`,`TEXT`],[`worker_environments`,`shared_host`,`INTEGER`],[`worker_environments`,`node_setup_id`,`TEXT`],[`worker_environments`,`node_device_id`,`TEXT`],[`worker_session_placements`,`terminal_reason`,`TEXT`],[`worker_session_placements`,`terminal_at_ms`,`INTEGER`],[`worker_workspace_pending_results`,`repository_workspace_id`,`TEXT`,!0],[`worker_session_placement_moves`,`abandon_source`,`INTEGER`,!0],[`worker_session_placement_moves`,`target_machine_class`,`TEXT`,!0],[`worker_session_placement_moves`,`target_os`,`TEXT`,!0],[`worktrees`,`run_end_cleanup_json`,`TEXT`],[`worktrees`,`gc_protection_json`,`TEXT`],[`device_bootstrap_tokens`,`setup_id`,`TEXT`,!0],[`session_groups`,`cwd`,`TEXT`,!0],[`session_groups`,`worktree`,`INTEGER`,!0],[`secret_store_entries`,`allowed_hosts`,`TEXT`],[`web_push_subscriptions`,`device_id`,`TEXT`,!0],[`web_push_subscriptions`,`user_profile_id`,`TEXT`,!0],[`web_push_subscriptions`,`preferences_json`,`TEXT`,!0],[`task_runs`,`execution_owner_host`,`TEXT`,!0],[`task_runs`,`execution_owner_pid`,`INTEGER`,!0],[`task_runs`,`execution_owner_start_identity`,`INTEGER`,!0],[`session_watch_cursors`,`watcher_store_path`,`TEXT`,!0],[`subagent_runs`,`requester_store_path`,`TEXT`,!0],[`subagent_runs`,`controller_store_path`,`TEXT`,!0],[`cron_jobs`,`grant_definition_revision`,`TEXT`],[`cron_jobs`,`grant_definition_generation`,`INTEGER`],[`cron_jobs`,`grant_definition_updated_at`,`INTEGER`]];function lazyColumnDefinitions(e){return ki.filter(t=>e===void 0||!!t[3]===e).map(([e,t,n])=>({columnName:t,dataType:n,tableName:e}))}lazyColumnDefinitions();const Ai=lazyColumnDefinitions(!1);lazyColumnDefinitions(!0);const ji={packageUpdatedAt:[[`template_package_refs`,`updated_at_ms INTEGER NOT NULL DEFAULT 0`]],packageIntegrity:[[`template_package_refs`,`package_integrity TEXT NOT NULL DEFAULT 'sha256:0000000000000000000000000000000000000000000000000000000000000000'`]],diagnosticSequence:[[`diagnostic_events`,`sequence INTEGER NOT NULL DEFAULT 0`]],cronRunLogs:[[`worktrees`,`provisioned_paths_json TEXT`],[`apns_registrations`,`relay_origin TEXT`],[`device_pairing_pending`,`refreshed_at_ms INTEGER`],[`device_pairing_pending`,`browser_origin TEXT`],[`device_pairing_paired`,`approved_via TEXT`],[`device_pairing_paired`,`browser_origin TEXT`],[`device_pairing_paired`,`operator_label TEXT`],[`device_pairing_paired`,`node_surface_json TEXT`],[`device_pairing_paired`,`pending_node_surface_json TEXT`],[`cron_run_logs`,`status TEXT`],[`cron_run_logs`,`error TEXT`],[`cron_run_logs`,`summary TEXT`],[`cron_run_logs`,`diagnostics_summary TEXT`],[`cron_run_logs`,`delivery_status TEXT`],[`cron_run_logs`,`delivery_error TEXT`],[`cron_run_logs`,`delivered INTEGER`],[`cron_run_logs`,`session_id TEXT`],[`cron_run_logs`,`session_key TEXT`],[`cron_run_logs`,`run_id TEXT`],[`cron_run_logs`,`run_at_ms INTEGER`],[`cron_run_logs`,`duration_ms INTEGER`],[`cron_run_logs`,`next_run_at_ms INTEGER`],[`cron_run_logs`,`model TEXT`],[`cron_run_logs`,`provider TEXT`],[`cron_run_logs`,`total_tokens INTEGER`],[`cron_run_logs`,`entry_json TEXT NOT NULL DEFAULT '{}'`],[`cron_run_logs`,`created_at INTEGER NOT NULL DEFAULT 0`]],acpReplay:[[`acp_replay_events`,`estimated_bytes INTEGER NOT NULL DEFAULT 0`],[`acp_replay_sessions`,`estimated_bytes INTEGER NOT NULL DEFAULT 0`]],cronJobs:[[`cron_jobs`,`description TEXT`],[`cron_jobs`,`declaration_key TEXT`],[`cron_jobs`,`owner_agent_id TEXT`],[`cron_jobs`,`name TEXT NOT NULL DEFAULT ''`],[`cron_jobs`,`enabled INTEGER NOT NULL DEFAULT 1`],[`cron_jobs`,`agent_id TEXT`],[`cron_jobs`,`payload_kind TEXT NOT NULL DEFAULT 'message'`],[`cron_jobs`,`state_json TEXT NOT NULL DEFAULT '{}'`],[`cron_jobs`,`runtime_updated_at_ms INTEGER`],[`cron_jobs`,`schedule_identity TEXT`],[`cron_jobs`,`sort_order INTEGER NOT NULL DEFAULT 0`]],deliveryQueue:[[`sandbox_registry_entries`,`session_key TEXT`],[`sandbox_registry_entries`,`backend_id TEXT`],[`sandbox_registry_entries`,`runtime_label TEXT`],[`sandbox_registry_entries`,`image TEXT`],[`sandbox_registry_entries`,`created_at_ms INTEGER`],[`sandbox_registry_entries`,`last_used_at_ms INTEGER`],[`sandbox_registry_entries`,`config_label_kind TEXT`],[`sandbox_registry_entries`,`config_hash TEXT`],[`sandbox_registry_entries`,`cdp_port INTEGER`],[`sandbox_registry_entries`,`no_vnc_port INTEGER`],[`delivery_queue_entries`,`entry_kind TEXT`],[`delivery_queue_entries`,`session_key TEXT`],[`delivery_queue_entries`,`channel TEXT`],[`delivery_queue_entries`,`target TEXT`],[`delivery_queue_entries`,`account_id TEXT`],[`delivery_queue_entries`,`retry_count INTEGER NOT NULL DEFAULT 0`],[`delivery_queue_entries`,`last_attempt_at INTEGER`],[`delivery_queue_entries`,`last_error TEXT`],[`delivery_queue_entries`,`recovery_state TEXT`],[`delivery_queue_entries`,`platform_send_started_at INTEGER`]],originalMediaRoot:[[`managed_outgoing_image_records`,`original_media_root TEXT NOT NULL DEFAULT ''`]],beforeTaskAttribution:[[`managed_outgoing_image_records`,`agent_id TEXT`],[`managed_outgoing_image_records`,`cleanup_pending INTEGER NOT NULL DEFAULT 0 CHECK (cleanup_pending IN (0, 1))`],[`current_conversation_bindings`,`conversation_kind TEXT NOT NULL DEFAULT 'channel'`],[`device_bootstrap_tokens`,`pending_profile_json TEXT`],[`gateway_restart_handoff`,`restart_trace_started_at INTEGER`],[`gateway_restart_handoff`,`restart_trace_last_at INTEGER`],[`gateway_restart_intent`,`reason TEXT`],[`gateway_restart_sentinel`,`delivery_channel TEXT`],[`gateway_restart_sentinel`,`delivery_to TEXT`],[`gateway_restart_sentinel`,`delivery_account_id TEXT`],[`gateway_restart_sentinel`,`message TEXT`],[`gateway_restart_sentinel`,`continuation_json TEXT`],[`gateway_restart_sentinel`,`doctor_hint TEXT`],[`gateway_restart_sentinel`,`stats_json TEXT`],[`gateway_boot_lifecycle`,`startup_reason TEXT`],[`official_external_plugin_catalog_snapshots`,`trust_mode TEXT`],[`official_external_plugin_catalog_snapshots`,`trust_key_id TEXT`],[`official_external_plugin_catalog_snapshots`,`trust_signature_count INTEGER`],[`official_external_plugin_catalog_snapshots`,`trust_threshold INTEGER`],[`official_external_plugin_catalog_snapshots`,`trust_verified_at TEXT`]],taskRequester:[[`task_runs`,`requester_agent_id TEXT`]],taskRunDetails:[[`task_runs`,`tool_use_count INTEGER`],[`task_runs`,`last_tool_name TEXT`],[`task_runs`,`detail_json TEXT`]],workerEnvironments:[[`worker_environments`,`bootstrap_bundle_hash TEXT`],[`worker_environments`,`bootstrap_openclaw_version TEXT`],[`worker_environments`,`bootstrap_protocol_features_json TEXT`],[`worker_environments`,`bootstrap_install_kind TEXT`],[`worker_environments`,`owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0)`],[`worker_environments`,`ssh_host_key TEXT`],[`worker_workspace_pending_results`,`staged_result_ref TEXT`],[`worker_environments`,`teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed'))`]]},Mi=[[`claw_installs`,`template_installs`],[`claw_workspace_files`,`template_workspace_files`],[`claw_package_refs`,`template_package_refs`],[`claw_cron_refs`,`template_cron_refs`],[`claw_mcp_server_refs`,`template_mcp_server_refs`]],Ni=[[`template_installs`,`claw_name`,`template_name`],[`template_installs`,`claw_version`,`template_version`],[`template_package_refs`,`claw_name`,`template_name`]],Pi=new Set(Mi.map(([,e])=>e)),Fi=Ai.filter(({tableName:e})=>Pi.has(e)),Ii=[...ji.packageUpdatedAt,...ji.packageIntegrity],Li=[[`template_installs`,[1,2,3].map(e=>[`openclaw.clawInstallRecord.v${e}`,`openclaw.templateInstallRecord.v${e}`])],[`template_workspace_files`,[[`openclaw.clawWorkspaceFileRecord.v1`,`openclaw.templateWorkspaceFileRecord.v1`]]],[`template_package_refs`,[[`openclaw.clawPackageRef.v1`,`openclaw.templatePackageRef.v1`]]],[`template_cron_refs`,[[`openclaw.clawCronRef.v1`,`openclaw.templateCronRef.v1`]]],[`template_mcp_server_refs`,[[`openclaw.clawMcpServerRef.v1`,`openclaw.templateMcpServerRef.v1`]]]],literal=e=>`'${e.replaceAll(`'`,`''`)}'`;function legacyTemplateStateIdentifier(e){for(let[t,n]of[...Mi,...Ni.map(([,e,t])=>[e,t])])if(e===n)return t;return e}function withLegacyTemplateStateSchema(e){return e.replace(/\btemplate_(?:installs|workspace_files|package_refs|cron_refs|mcp_server_refs|name|version)\b/gu,legacyTemplateStateIdentifier).replaceAll(`'template-introduced'`,`'claw-introduced'`).replaceAll(`'template'`,`'claw'`)}function versionUpdates(e,t){return`UPDATE ${E(e)} SET schema_version = CASE schema_version
    ${t.map(([e,t])=>`WHEN ${literal(e)} THEN ${literal(t)}`).join(`
`)}
    ELSE schema_version END WHERE schema_version IN (${t.map(([e])=>literal(e)).join(`, `)});`}[...Mi.flat()],[...Fi.map(({tableName:e,columnName:t})=>`${e}.${t}`),...Ii.map(([e,t])=>`${e}.${t.split(` `,1)[0]}`)];const Ri=`DO $template_names_v36$
DECLARE item record; column_item record; constraint_name text; next_constraint_name text;
BEGIN
  FOR item IN SELECT * FROM (VALUES
    ${Mi.map(([e,t])=>`(${literal(e)}, ${literal(t)})`).join(`,
`)}
  ) AS names(old_name, new_name) LOOP
    EXECUTE format('ALTER TABLE %I RENAME TO %I', item.old_name, item.new_name);
    FOR column_item IN SELECT * FROM (VALUES
      ${Ni.map(([e,t,n])=>`(${literal(e)}, ${literal(t)}, ${literal(n)})`).join(`,
`)}
    ) AS columns(table_name, old_name, new_name) WHERE table_name = item.new_name LOOP
      EXECUTE format('ALTER TABLE %I RENAME COLUMN %I TO %I', item.new_name, column_item.old_name, column_item.new_name);
    END LOOP;
    FOR constraint_name IN SELECT conname FROM pg_constraint
      WHERE conrelid = to_regclass(item.new_name) LOOP
      next_constraint_name := constraint_name;
      IF left(constraint_name, length(item.old_name) + 1) = item.old_name || '_' THEN
        next_constraint_name := item.new_name || substr(constraint_name, length(item.old_name) + 1);
      END IF;
      next_constraint_name := replace(replace(next_constraint_name, '_claw_name_', '_template_name_'), '_claw_version_', '_template_version_');
      IF next_constraint_name <> constraint_name THEN
        EXECUTE format('ALTER TABLE %I RENAME CONSTRAINT %I TO %I', item.new_name, constraint_name, next_constraint_name);
      END IF;
    END LOOP;
  END LOOP;
  ${[`template_package_refs`,`template_mcp_server_refs`].map(e=>`
    ALTER TABLE ${E(e)} DROP CONSTRAINT ${E(`${e}_origin_check`)};
    UPDATE ${E(e)} SET origin = 'template-introduced' WHERE origin = 'claw-introduced';
    ALTER TABLE ${E(e)} ADD CONSTRAINT ${E(`${e}_origin_check`)}
      CHECK (origin IN ('template-introduced', 'pre-existing'));`).join(`
`)}
  IF to_regclass('agent_provenance') IS NOT NULL THEN
    ALTER TABLE agent_provenance DROP CONSTRAINT agent_provenance_created_via_check;
    UPDATE agent_provenance SET created_via = 'template' WHERE created_via = 'claw';
    ALTER TABLE agent_provenance ADD CONSTRAINT agent_provenance_created_via_check
      CHECK (created_via IN ('operator', 'agent', 'template'));
  END IF;
  ${Li.map(([e,t])=>versionUpdates(e,t)).join(`
`)}
END $template_names_v36$;`;function withLegacyWorkerResourceReceipts(e){return e.replace(/,\n {2}resource_receipt_json TEXT(?=\n\))|\n {2}"resource_receipt_json" text COLLATE "C",/gu,``)}function withLegacyRepositoryDiskAuthority(e){return e.replace(/\n {2}(?:(?:disk_authority_json|repository_disk_authority_json) TEXT|"(?:disk_authority_json|repository_disk_authority_json)" text COLLATE "C"),/gu,``)}function withLegacyWorkerRetention(e){return e.replace(/,\n {2}retention_json TEXT(?=\n\))|\n {2}"retention_json" text COLLATE "C",/gu,``)}function withLegacyWorkspaceBootstrapDeferred(e){return e.replace(`  bootstrap_deferred INTEGER,
`,``).replace(`  "bootstrap_deferred" bigint,
`,``)}function withLegacyWorkerProvisionSource(e){return e.replace(/,\n {2}provision_source_json TEXT(?=\n\))|\n {2}"provision_source_json" text COLLATE "C",/gu,``)}const zi=`state.schema.contentVersion`;var PostgresSchemaAdmissionUnavailableError=class extends Error{};const Bi=Ut(e=>qt(e,()=>$t(e).selectFrom(`config_machine_state`).select(`value_json`).where(`state_key`,`=`,zi)));function readStateSchemaContentVersion(e,t,n=readStateSchemaContentVersionRow,r){if(O(e)){let n=getStateSchemaVersionAdmission(e);if(!n)throw new PostgresSchemaAdmissionUnavailableError(`Missing PostgreSQL state schema admission; use the matching OpenClaw version or restore the matching PostgreSQL schema and anchor.`);return Math.max(t??n.userVersion,n.contentVersion)}let i=getStateSchemaVersionAdmission(e);if(i)return Math.max(t??i.userVersion,i.contentVersion);let a=r??k(e)?.userVersion??zt(e),o=parseStateSchemaContentVersion(tableExists(e,`config_machine_state`)?n(e)?.value_json:void 0);return rememberStateSchemaVersionAdmission(e,{userVersion:a,contentVersion:o}),Math.max(t??a,o)}function readStateSchemaContentVersionRow(e){return Bi(e)().rows[0]}function parseStateSchemaContentVersion(e){if(e===void 0)return 0;let t;try{t=e===null?null:JSON.parse(e)}catch(e){throw new SqliteSchemaMismatchError(`Invalid shared state schema content version in ${zi}.`,{cause:e})}if(typeof t!=`number`||!Number.isSafeInteger(t)||t<0)throw new SqliteSchemaMismatchError(`Invalid shared state schema content version in ${zi}.`);return t}function admitStateSchemaFacts(e,t,n=`runtime`){if(O(e)){if(!j(e))throw new PostgresSchemaAdmissionUnavailableError(`Missing PostgreSQL physical schema admission`)}else try{Tt(e,r=>assertSupportedStateSchemaVersion(e,t,{userVersion:r,contentVersion:r},void 0,n))}catch(r){let i;try{i=zt(e)}catch{throw an(r,t)}throw i>40?Yt(`OpenClaw state database`,t,i,40,tn(e),n):an(r,t)}}function assertSupportedStateSchemaVersion(e,t,n,r,i=`runtime`){if(O(e))return readStateSchemaContentVersion(e);try{let a=n?.userVersion??getStateSchemaVersionAdmission(e)?.userVersion??k(e)?.userVersion??zt(e),o=n?.contentVersion??(a>40?a:readStateSchemaContentVersion(e,a,r,a));if(o>40)throw Yt(`OpenClaw state database`,t,o,40,tn(e),i);return a}catch(e){throw an(e,t)}}function withPostgresSchemaAdmissionRetry(e,t,n){try{return t()}catch(r){if(!(r instanceof PostgresSchemaAdmissionUnavailableError)||!O(e)||n?.()===!1||!e.isOpen||e.isTransaction)throw r;let i=Math.min(Date.now()+1e3,Le()??1/0),a=performance.now()+Math.max(0,i-Date.now()),o=new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));return Ke({deadlineAtMs:i},()=>{for(let s=10;;s=Math.min(s*2,100)){Pe();let c=Math.min(a-performance.now(),i-Date.now());if(c<=0||(Atomics.wait(o,0,0,Math.min(s,c)),Pe(),performance.now()>=a||Date.now()>=i)||n?.()===!1||!e.isOpen||e.isTransaction)throw r;try{if(!j(e,{refresh:!0}))continue;return t()}catch(t){if(t instanceof Ze&&(performance.now()>=a||Date.now()>=i))throw r;if(!(t instanceof PostgresSchemaAdmissionUnavailableError)||n?.()===!1||!e.isOpen||e.isTransaction)throw t}}})}}function writeStateSchemaContentVersion(e){nn(e,$t(e).insertInto(`config_machine_state`).values({state_key:zi,value_json:`40`,updated_at_ms:Date.now()}).onConflict(e=>e.column(`state_key`).doUpdateSet({value_json:`40`,updated_at_ms:Date.now()}).where(`config_machine_state.value_json`,`!=`,`40`)))}const $={get eagerSql(){let e=`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "acp_replay_events" (
  "session_id" text COLLATE "C" NOT NULL,
  "seq" bigint NOT NULL,
  "at" bigint NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "run_id" text COLLATE "C",
  "update_json" text COLLATE "C" NOT NULL,
  "estimated_bytes" bigint NOT NULL DEFAULT 0,
  PRIMARY KEY ("session_id", "seq")
);

CREATE TABLE "acp_replay_sessions" (
  "session_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "cwd" text COLLATE "C" NOT NULL,
  "complete" bigint NOT NULL,
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  "next_seq" bigint NOT NULL,
  "estimated_bytes" bigint NOT NULL DEFAULT 0,
  PRIMARY KEY ("session_id")
);

CREATE TABLE "acp_sessions" (
  "session_key" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C",
  "backend" text COLLATE "C" NOT NULL,
  "agent" text COLLATE "C" NOT NULL,
  "runtime_session_name" text COLLATE "C" NOT NULL,
  "identity_json" text COLLATE "C",
  "resume_agent_session_id" text COLLATE "C",
  "resume_acpx_session_id" text COLLATE "C",
  "mode" text COLLATE "C" NOT NULL,
  "runtime_options_json" text COLLATE "C",
  "cwd" text COLLATE "C",
  "state" text COLLATE "C" NOT NULL,
  "last_activity_at" bigint NOT NULL,
  "last_error" text COLLATE "C",
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("session_key")
);

CREATE TABLE "agent_database_leases" (
  "lease_id" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "path" text COLLATE "C" NOT NULL,
  "owner_pid" bigint NOT NULL,
  "owner_start_time" bigint,
  "opened_at" bigint NOT NULL,
  "provenance" text COLLATE "C",
  PRIMARY KEY ("lease_id")
);

CREATE TABLE "agent_databases" (
  "agent_id" text COLLATE "C" NOT NULL,
  "path" text COLLATE "C" NOT NULL,
  "schema_version" bigint NOT NULL,
  "last_seen_at" bigint NOT NULL,
  "size_bytes" bigint,
  PRIMARY KEY ("agent_id", "path")
);

CREATE TABLE "apns_registration_tombstones" (
  "node_id" text COLLATE "C" NOT NULL,
  "deleted_at_ms" bigint NOT NULL,
  PRIMARY KEY ("node_id")
);

CREATE TABLE "apns_registrations" (
  "node_id" text COLLATE "C" NOT NULL,
  "transport" text COLLATE "C" NOT NULL,
  "token" text COLLATE "C",
  "relay_handle" text COLLATE "C",
  "send_grant" text COLLATE "C",
  "installation_id" text COLLATE "C",
  "relay_origin" text COLLATE "C",
  "topic" text COLLATE "C" NOT NULL,
  "environment" text COLLATE "C" NOT NULL,
  "distribution" text COLLATE "C",
  "token_debug_suffix" text COLLATE "C",
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("node_id")
);

CREATE TABLE "audit_events" (
  "sequence" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "event_id" text COLLATE "C" NOT NULL,
  "source_id" text COLLATE "C" NOT NULL,
  "schema_version" bigint NOT NULL DEFAULT 1,
  "source_sequence" bigint NOT NULL,
  "occurred_at" bigint NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "action" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "error_code" text COLLATE "C",
  "actor_type" text COLLATE "C" NOT NULL,
  "actor_id" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C",
  "session_key" text COLLATE "C",
  "session_id" text COLLATE "C",
  "run_id" text COLLATE "C",
  "tool_call_id" text COLLATE "C",
  "tool_name" text COLLATE "C",
  "direction" text COLLATE "C",
  "channel" text COLLATE "C",
  "conversation_kind" text COLLATE "C",
  "message_outcome" text COLLATE "C",
  "reason_code" text COLLATE "C",
  "delivery_kind" text COLLATE "C",
  "failure_stage" text COLLATE "C",
  "duration_ms" bigint,
  "result_count" bigint,
  "account_ref" text COLLATE "C",
  "conversation_ref" text COLLATE "C",
  "message_ref" text COLLATE "C",
  "target_ref" text COLLATE "C",
  PRIMARY KEY ("sequence"),
  UNIQUE ("event_id"),
  UNIQUE ("source_id")
);

CREATE TABLE "audit_identity_keys" (
  "id" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "key_id" text COLLATE "C" NOT NULL,
  "key" bytea NOT NULL,
  "created_at" bigint NOT NULL,
  PRIMARY KEY ("id"),
  CHECK (("id" = 1))
);

CREATE TABLE "backup_runs" (
  "id" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  "archive_path" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "manifest_json" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("id")
);

CREATE TABLE "capture_blobs" (
  "blob_id" text COLLATE "C" NOT NULL,
  "content_type" text COLLATE "C",
  "encoding" text COLLATE "C" NOT NULL,
  "size_bytes" bigint NOT NULL,
  "sha256" text COLLATE "C" NOT NULL,
  "data" bytea NOT NULL,
  "created_at" bigint NOT NULL,
  PRIMARY KEY ("blob_id")
);

CREATE TABLE "capture_events" (
  "id" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "ts" bigint NOT NULL,
  "source_scope" text COLLATE "C" NOT NULL,
  "source_process" text COLLATE "C" NOT NULL,
  "protocol" text COLLATE "C" NOT NULL,
  "direction" text COLLATE "C" NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "flow_id" text COLLATE "C" NOT NULL,
  "method" text COLLATE "C",
  "host" text COLLATE "C",
  "path" text COLLATE "C",
  "status" bigint,
  "close_code" bigint,
  "content_type" text COLLATE "C",
  "headers_json" text COLLATE "C",
  "data_text" text COLLATE "C",
  "data_blob_id" text COLLATE "C",
  "data_sha256" text COLLATE "C",
  "error_text" text COLLATE "C",
  "meta_json" text COLLATE "C",
  PRIMARY KEY ("id")
);

CREATE TABLE "capture_sessions" (
  "id" text COLLATE "C" NOT NULL,
  "started_at" bigint NOT NULL,
  "ended_at" bigint,
  "mode" text COLLATE "C" NOT NULL,
  "source_scope" text COLLATE "C" NOT NULL,
  "source_process" text COLLATE "C" NOT NULL,
  "proxy_url" text COLLATE "C",
  PRIMARY KEY ("id")
);

CREATE TABLE "channel_ingress_events" (
  "queue_name" text COLLATE "C" NOT NULL,
  "event_id" text COLLATE "C" NOT NULL,
  "channel_id" text COLLATE "C" NOT NULL,
  "account_id" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "lane_key" text COLLATE "C",
  "payload_json" text COLLATE "C" NOT NULL,
  "metadata_json" text COLLATE "C",
  "received_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  "claim_token" text COLLATE "C",
  "claim_owner" text COLLATE "C",
  "claimed_at" bigint,
  "attempts" bigint NOT NULL DEFAULT 0,
  "last_attempt_at" bigint,
  "last_error" text COLLATE "C",
  "failed_reason" text COLLATE "C",
  "failed_at" bigint,
  "completed_at" bigint,
  "completed_metadata_json" text COLLATE "C",
  PRIMARY KEY ("queue_name", "event_id")
);

CREATE TABLE "channel_pairing_allow_entries" (
  "channel_key" text COLLATE "C" NOT NULL,
  "account_id" text COLLATE "C" NOT NULL,
  "entry" text COLLATE "C" NOT NULL,
  "sort_order" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("channel_key", "account_id", "entry")
);

CREATE TABLE "channel_pairing_requests" (
  "channel_key" text COLLATE "C" NOT NULL,
  "account_id" text COLLATE "C" NOT NULL,
  "request_id" text COLLATE "C" NOT NULL,
  "code" text COLLATE "C" NOT NULL,
  "created_at" text COLLATE "C" NOT NULL,
  "last_seen_at" text COLLATE "C" NOT NULL,
  "meta_json" text COLLATE "C",
  PRIMARY KEY ("channel_key", "account_id", "request_id")
);

CREATE TABLE "clawhub_promotion_claims" (
  "slug" text COLLATE "C" NOT NULL,
  "provider" text COLLATE "C",
  "model_keys_json" text COLLATE "C" NOT NULL,
  "ends_at_ms" bigint NOT NULL,
  "claimed_at_ms" bigint NOT NULL,
  PRIMARY KEY ("slug")
);

CREATE TABLE "config_health_entries" (
  "config_path" text COLLATE "C" NOT NULL,
  "last_known_good_json" text COLLATE "C",
  "last_promoted_good_json" text COLLATE "C",
  "last_observed_suspicious_signature" text COLLATE "C",
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("config_path")
);

CREATE TABLE "config_machine_state" (
  "state_key" text COLLATE "C" NOT NULL,
  "value_json" text COLLATE "C" NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("state_key")
);

CREATE TABLE "cron_job_scratch" (
  "store_key" text COLLATE "C" NOT NULL,
  "job_id" text COLLATE "C" NOT NULL,
  "content" text COLLATE "C",
  "revision" bigint NOT NULL,
  "source_sha256" text COLLATE "C",
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("store_key", "job_id"),
  CHECK (("revision" >= 1)),
  CHECK ("content" IS NULL OR (octet_length(convert_to("content", 'UTF8')) <= 262144))
);

CREATE TABLE "cron_jobs" (
  "store_key" text COLLATE "C" NOT NULL,
  "job_id" text COLLATE "C" NOT NULL,
  "declaration_key" text COLLATE "C",
  "owner_agent_id" text COLLATE "C",
  "name" text COLLATE "C" NOT NULL,
  "description" text COLLATE "C",
  "enabled" bigint NOT NULL,
  "agent_id" text COLLATE "C",
  "payload_kind" text COLLATE "C" NOT NULL,
  "job_json" text COLLATE "C" NOT NULL,
  "grant_definition_revision" text COLLATE "C",
  "grant_definition_generation" bigint,
  "grant_definition_updated_at" bigint,
  "state_json" text COLLATE "C" NOT NULL DEFAULT '{}',
  "runtime_updated_at_ms" bigint,
  "schedule_identity" text COLLATE "C",
  "sort_order" bigint NOT NULL DEFAULT 0,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("store_key", "job_id")
);

CREATE TABLE "current_conversation_bindings" (
  "binding_key" text COLLATE "C" NOT NULL,
  "binding_id" text COLLATE "C" NOT NULL,
  "target_session_key" text COLLATE "C" NOT NULL,
  "channel" text COLLATE "C" NOT NULL,
  "account_id" text COLLATE "C" NOT NULL,
  "conversation_kind" text COLLATE "C" NOT NULL,
  "parent_conversation_id" text COLLATE "C",
  "conversation_id" text COLLATE "C" NOT NULL,
  "target_kind" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "bound_at" bigint NOT NULL,
  "expires_at" bigint,
  "metadata_json" text COLLATE "C",
  "record_json" text COLLATE "C" NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("binding_key")
);

CREATE TABLE "delivery_queue_entries" (
  "queue_name" text COLLATE "C" NOT NULL,
  "id" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "entry_kind" text COLLATE "C",
  "session_key" text COLLATE "C",
  "channel" text COLLATE "C",
  "target" text COLLATE "C",
  "account_id" text COLLATE "C",
  "retry_count" bigint NOT NULL DEFAULT 0,
  "last_attempt_at" bigint,
  "last_error" text COLLATE "C",
  "recovery_state" text COLLATE "C",
  "platform_send_started_at" bigint,
  "entry_json" text COLLATE "C" NOT NULL,
  "retention_id_prefix" text COLLATE "C",
  "retention_max_age_ms" bigint,
  "retention_max_entries" bigint,
  "enqueued_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  "failed_at" bigint,
  PRIMARY KEY ("queue_name", "id")
);

CREATE TABLE "device_bootstrap_tokens" (
  "token_key" text COLLATE "C" NOT NULL,
  "token" text COLLATE "C" NOT NULL,
  "setup_id" text COLLATE "C",
  "ts" bigint NOT NULL,
  "device_id" text COLLATE "C",
  "public_key" text COLLATE "C",
  "profile_json" text COLLATE "C",
  "redeemed_profile_json" text COLLATE "C",
  "pending_profile_json" text COLLATE "C",
  "issued_at_ms" bigint NOT NULL,
  "last_used_at_ms" bigint,
  PRIMARY KEY ("token_key")
);

CREATE TABLE "device_pairing_paired" (
  "device_id" text COLLATE "C" NOT NULL,
  "public_key" text COLLATE "C" NOT NULL,
  "display_name" text COLLATE "C",
  "operator_label" text COLLATE "C",
  "platform" text COLLATE "C",
  "device_family" text COLLATE "C",
  "client_id" text COLLATE "C",
  "client_mode" text COLLATE "C",
  "browser_origin" text COLLATE "C",
  "role" text COLLATE "C",
  "roles_json" text COLLATE "C",
  "scopes_json" text COLLATE "C",
  "approved_scopes_json" text COLLATE "C",
  "remote_ip" text COLLATE "C",
  "tokens_json" text COLLATE "C",
  "approved_via" text COLLATE "C",
  "node_surface_json" text COLLATE "C",
  "pending_node_surface_json" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "approved_at_ms" bigint NOT NULL,
  "last_seen_at_ms" bigint,
  "last_seen_reason" text COLLATE "C",
  PRIMARY KEY ("device_id")
);

CREATE TABLE "device_pairing_pending" (
  "request_id" text COLLATE "C" NOT NULL,
  "device_id" text COLLATE "C" NOT NULL,
  "public_key" text COLLATE "C" NOT NULL,
  "display_name" text COLLATE "C",
  "platform" text COLLATE "C",
  "device_family" text COLLATE "C",
  "client_id" text COLLATE "C",
  "client_mode" text COLLATE "C",
  "browser_origin" text COLLATE "C",
  "role" text COLLATE "C",
  "roles_json" text COLLATE "C",
  "scopes_json" text COLLATE "C",
  "remote_ip" text COLLATE "C",
  "silent" bigint,
  "is_repair" bigint,
  "ts" bigint NOT NULL,
  "refreshed_at_ms" bigint,
  PRIMARY KEY ("request_id")
);

CREATE TABLE "diagnostic_events" (
  "scope" text COLLATE "C" NOT NULL,
  "event_key" text COLLATE "C" NOT NULL,
  "payload_json" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  "sequence" bigint NOT NULL DEFAULT 0,
  PRIMARY KEY ("scope", "event_key")
);

CREATE TABLE "exec_approvals_config" (
  "config_key" text COLLATE "C" NOT NULL,
  "raw_json" text COLLATE "C" NOT NULL,
  "socket_path" text COLLATE "C",
  "has_socket_token" bigint NOT NULL,
  "default_security" text COLLATE "C",
  "default_ask" text COLLATE "C",
  "default_ask_fallback" text COLLATE "C",
  "auto_allow_skills" bigint,
  "agent_count" bigint NOT NULL,
  "allowlist_count" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("config_key")
);

CREATE TABLE "flow_runs" (
  "flow_id" text COLLATE "C" NOT NULL,
  "shape" text COLLATE "C",
  "sync_mode" text COLLATE "C" NOT NULL DEFAULT 'managed',
  "owner_key" text COLLATE "C" NOT NULL,
  "requester_origin_json" text COLLATE "C",
  "controller_id" text COLLATE "C",
  "revision" bigint NOT NULL DEFAULT 0,
  "status" text COLLATE "C" NOT NULL,
  "notify_policy" text COLLATE "C" NOT NULL,
  "goal" text COLLATE "C" NOT NULL,
  "current_step" text COLLATE "C",
  "blocked_task_id" text COLLATE "C",
  "blocked_summary" text COLLATE "C",
  "state_json" text COLLATE "C",
  "wait_json" text COLLATE "C",
  "cancel_requested_at" bigint,
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  "ended_at" bigint,
  PRIMARY KEY ("flow_id")
);

CREATE TABLE "gateway_boot_lifecycle" (
  "boot_id" text COLLATE "C" NOT NULL,
  "pid" bigint NOT NULL,
  "started_at_ms" bigint NOT NULL,
  "completed_at_ms" bigint,
  "outcome" text COLLATE "C",
  "startup_reason" text COLLATE "C",
  "reason" text COLLATE "C",
  PRIMARY KEY ("boot_id")
);

CREATE TABLE "gateway_restart_handoff" (
  "handoff_key" text COLLATE "C" NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "version" bigint NOT NULL,
  "intent_id" text COLLATE "C" NOT NULL,
  "pid" bigint NOT NULL,
  "process_instance_id" text COLLATE "C",
  "created_at" bigint NOT NULL,
  "expires_at" bigint NOT NULL,
  "reason" text COLLATE "C",
  "restart_trace_started_at" bigint,
  "restart_trace_last_at" bigint,
  "source" text COLLATE "C" NOT NULL,
  "restart_kind" text COLLATE "C" NOT NULL,
  "supervisor_mode" text COLLATE "C" NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("handoff_key")
);

CREATE TABLE "gateway_restart_intent" (
  "intent_key" text COLLATE "C" NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "pid" bigint NOT NULL,
  "created_at" bigint NOT NULL,
  "reason" text COLLATE "C",
  "force" bigint,
  "wait_ms" bigint,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("intent_key")
);

CREATE TABLE "gateway_restart_sentinel" (
  "sentinel_key" text COLLATE "C" NOT NULL,
  "version" bigint NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "ts" bigint NOT NULL,
  "session_key" text COLLATE "C",
  "thread_id" text COLLATE "C",
  "delivery_channel" text COLLATE "C",
  "delivery_to" text COLLATE "C",
  "delivery_account_id" text COLLATE "C",
  "message" text COLLATE "C",
  "continuation_json" text COLLATE "C",
  "doctor_hint" text COLLATE "C",
  "stats_json" text COLLATE "C",
  "payload_json" text COLLATE "C" NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("sentinel_key")
);

CREATE TABLE "macos_port_guardian_records" (
  "pid" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "port" bigint NOT NULL,
  "command" text COLLATE "C" NOT NULL,
  "mode" text COLLATE "C" NOT NULL,
  "timestamp" double precision NOT NULL,
  PRIMARY KEY ("pid")
);

CREATE TABLE "managed_outgoing_image_records" (
  "attachment_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C",
  "message_id" text COLLATE "C",
  "created_at" text COLLATE "C" NOT NULL,
  "updated_at" text COLLATE "C",
  "retention_class" text COLLATE "C",
  "alt" text COLLATE "C" NOT NULL,
  "original_media_root" text COLLATE "C" NOT NULL,
  "original_media_id" text COLLATE "C" NOT NULL,
  "original_media_subdir" text COLLATE "C" NOT NULL,
  "original_content_type" text COLLATE "C" NOT NULL,
  "original_width" bigint,
  "original_height" bigint,
  "original_size_bytes" bigint,
  "original_filename" text COLLATE "C",
  "record_json" text COLLATE "C" NOT NULL,
  "cleanup_pending" bigint NOT NULL DEFAULT 0,
  PRIMARY KEY ("attachment_id"),
  CHECK (("cleanup_pending" IN (0, 1)))
);

CREATE TABLE "mcp_oauth_stores" (
  "store_key" text COLLATE "C" NOT NULL,
  "format_version" bigint NOT NULL,
  "store_json" text COLLATE "C" NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("store_key"),
  CHECK (("format_version" = 1))
);

CREATE TABLE "meeting_transcript_sessions" (
  "started_at_ms" bigint,
  "session_id" text COLLATE "C" NOT NULL,
  "started_at" text COLLATE "C" NOT NULL,
  "selector" text COLLATE "C" NOT NULL,
  "export_key" text COLLATE "C" NOT NULL,
  "session_slug" text COLLATE "C" NOT NULL,
  "provider_id" text COLLATE "C" NOT NULL,
  "title" text COLLATE "C",
  "source_json" text COLLATE "C" NOT NULL,
  "source_account_id" text COLLATE "C",
  "source_guild_id" text COLLATE "C",
  "source_channel_id" text COLLATE "C",
  "source_meeting_url" text COLLATE "C",
  "source_thread_ts" text COLLATE "C",
  "source_file_id" text COLLATE "C",
  "stopped_at" text COLLATE "C",
  "metadata_json" text COLLATE "C",
  "metadata_agent_id" text COLLATE "C",
  "export_manifest_json" text COLLATE "C" NOT NULL DEFAULT '{}',
  "export_pending_json" text COLLATE "C" NOT NULL DEFAULT '[]',
  "next_utterance_seq" bigint NOT NULL DEFAULT 0,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("session_id", "started_at"),
  CHECK (("next_utterance_seq" >= 0)),
  CHECK (("created_at_ms" >= 0)),
  CHECK (("updated_at_ms" >= 0)),
  UNIQUE ("selector")
);

CREATE TABLE "meeting_transcript_summaries" (
  "session_id" text COLLATE "C" NOT NULL,
  "session_started_at" text COLLATE "C" NOT NULL,
  "generated_at" text COLLATE "C",
  "summary_json" text COLLATE "C",
  "overview" text COLLATE "C",
  "markdown" text COLLATE "C",
  "utterance_count" bigint NOT NULL,
  PRIMARY KEY ("session_id", "session_started_at"),
  CHECK (("utterance_count" >= 0)),
  CHECK ("summary_json" IS NOT NULL OR "markdown" IS NOT NULL)
);

CREATE TABLE "meeting_transcript_utterances" (
  "session_id" text COLLATE "C" NOT NULL,
  "session_started_at" text COLLATE "C" NOT NULL,
  "sequence" bigint NOT NULL,
  "utterance_id" text COLLATE "C",
  "started_at" text COLLATE "C",
  "ended_at" text COLLATE "C",
  "speaker_id" text COLLATE "C",
  "speaker_label" text COLLATE "C",
  "text" text COLLATE "C" NOT NULL,
  "final" bigint,
  "metadata_json" text COLLATE "C",
  PRIMARY KEY ("session_id", "session_started_at", "sequence"),
  CHECK (("sequence" >= 0)),
  CHECK (("final" IN (0, 1)))
);

CREATE TABLE "migration_runs" (
  "id" text COLLATE "C" NOT NULL,
  "started_at" bigint NOT NULL,
  "finished_at" bigint,
  "status" text COLLATE "C" NOT NULL,
  "report_json" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("id")
);

CREATE TABLE "migration_sources" (
  "source_key" text COLLATE "C" NOT NULL,
  "migration_kind" text COLLATE "C" NOT NULL,
  "source_path" text COLLATE "C" NOT NULL,
  "target_table" text COLLATE "C" NOT NULL,
  "source_sha256" text COLLATE "C",
  "source_size_bytes" bigint,
  "source_record_count" bigint,
  "last_run_id" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "imported_at" bigint NOT NULL,
  "removed_source" bigint NOT NULL DEFAULT 0,
  "report_json" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("source_key")
);

CREATE TABLE "native_hook_relay_bridges" (
  "relay_id" text COLLATE "C" NOT NULL,
  "pid" bigint NOT NULL,
  "hostname" text COLLATE "C" NOT NULL,
  "port" bigint NOT NULL,
  "token" text COLLATE "C" NOT NULL,
  "expires_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("relay_id")
);

CREATE TABLE "official_external_plugin_catalog_snapshots" (
  "feed_url" text COLLATE "C" NOT NULL,
  "body" text COLLATE "C" NOT NULL,
  "status" bigint NOT NULL,
  "etag" text COLLATE "C",
  "last_modified" text COLLATE "C",
  "checksum" text COLLATE "C" NOT NULL,
  "saved_at" text COLLATE "C" NOT NULL,
  "trust_mode" text COLLATE "C",
  "trust_key_id" text COLLATE "C",
  "trust_signature_count" bigint,
  "trust_threshold" bigint,
  "trust_verified_at" text COLLATE "C",
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("feed_url")
);

CREATE TABLE "operator_approvals" (
  "cursor_id" bigint NOT NULL,
  "approval_id" text COLLATE "C" NOT NULL,
  "resolution_ref" text COLLATE "C" NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "presentation_json" text COLLATE "C" NOT NULL,
  "requested_by_device_id" text COLLATE "C",
  "requested_by_client_id" text COLLATE "C",
  "requested_by_device_token_auth" bigint NOT NULL DEFAULT 0,
  "reviewer_device_ids_json" text COLLATE "C" NOT NULL,
  "source_agent_id" text COLLATE "C",
  "source_session_key" text COLLATE "C",
  "source_session_id" text COLLATE "C",
  "source_run_id" text COLLATE "C",
  "source_tool_call_id" text COLLATE "C",
  "source_tool_name" text COLLATE "C",
  "audience_session_keys_json" text COLLATE "C" NOT NULL,
  "runtime_epoch" text COLLATE "C" NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "expires_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "decision" text COLLATE "C",
  "terminal_reason" text COLLATE "C",
  "resolved_at_ms" bigint,
  "resolver_kind" text COLLATE "C",
  "resolver_id" text COLLATE "C",
  "consumed_at_ms" bigint,
  "consumed_by" text COLLATE "C",
  PRIMARY KEY ("approval_id"),
  CHECK ((char_length("approval_id") > 0) AND ("approval_id" NOT IN ('.', '..'))),
  CHECK ((char_length("resolution_ref") = 43) AND ("resolution_ref" COLLATE "C" !~ '\\A.*[^A-Za-z0-9_-].*\\Z')),
  CHECK (("kind" IN ('exec', 'plugin', 'system-agent'))),
  CHECK (("status" IN ('pending', 'allowed', 'denied', 'expired', 'cancelled'))),
  CHECK (("decision" IN ('allow-once', 'allow-always', 'deny'))),
  CHECK (("terminal_reason" IN ('user', 'timeout', 'malformed-verdict', 'no-route', 'run-aborted', 'gateway-restart', 'storage-corrupt'))),
  CHECK (("resolver_kind" IN ('device', 'channel', 'runtime', 'system'))),
  CHECK (("expires_at_ms" >= "created_at_ms")),
  CHECK (("updated_at_ms" >= "created_at_ms")),
  CHECK ("resolved_at_ms" IS NULL OR ("resolved_at_ms" >= "created_at_ms")),
  CHECK ("resolved_at_ms" IS NULL OR ("resolved_at_ms" <= "updated_at_ms")),
  CHECK ("consumed_at_ms" IS NULL OR ("consumed_at_ms" >= "resolved_at_ms")),
  CHECK ("consumed_at_ms" IS NULL OR ("consumed_at_ms" <= "updated_at_ms")),
  CHECK (("requested_by_device_token_auth" IN (0, 1))),
  CHECK ((("status" = 'pending') AND "decision" IS NULL AND "terminal_reason" IS NULL AND "resolved_at_ms" IS NULL AND "resolver_kind" IS NULL AND "resolver_id" IS NULL AND "consumed_at_ms" IS NULL AND "consumed_by" IS NULL) OR (("status" = 'allowed') AND ("decision" IN ('allow-once', 'allow-always')) AND ("terminal_reason" = 'user') AND "resolved_at_ms" IS NOT NULL AND "resolver_kind" IS NOT NULL) OR (("status" = 'denied') AND ("decision" = 'deny') AND ("terminal_reason" IN ('user', 'malformed-verdict', 'no-route', 'storage-corrupt')) AND "resolved_at_ms" IS NOT NULL AND "resolver_kind" IS NOT NULL AND "consumed_at_ms" IS NULL AND "consumed_by" IS NULL) OR (("status" = 'expired') AND ("decision" = 'deny') AND ("terminal_reason" = 'timeout') AND "resolved_at_ms" IS NOT NULL AND "resolver_kind" IS NOT NULL AND "consumed_at_ms" IS NULL AND "consumed_by" IS NULL) OR (("status" = 'cancelled') AND ("decision" = 'deny') AND ("terminal_reason" IN ('run-aborted', 'gateway-restart')) AND "resolved_at_ms" IS NOT NULL AND "resolver_kind" IS NOT NULL AND "consumed_at_ms" IS NULL AND "consumed_by" IS NULL)),
  CHECK (("consumed_at_ms" IS NULL AND "consumed_by" IS NULL) OR (("status" = 'allowed') AND ("decision" = 'allow-once') AND "consumed_at_ms" IS NOT NULL AND "consumed_by" IS NOT NULL))
);

CREATE TABLE "outbound_media_provenance" (
  "realpath" text COLLATE "C" NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "version" bigint NOT NULL,
  "sha256" text COLLATE "C" NOT NULL,
  "size_bytes" bigint NOT NULL,
  "created_at_ms" bigint NOT NULL,
  PRIMARY KEY ("realpath")
);

CREATE TABLE "plugin_binding_approvals" (
  "plugin_root" text COLLATE "C" NOT NULL,
  "channel" text COLLATE "C" NOT NULL,
  "account_id" text COLLATE "C" NOT NULL,
  "plugin_id" text COLLATE "C" NOT NULL,
  "plugin_name" text COLLATE "C",
  "approved_at" bigint NOT NULL,
  PRIMARY KEY ("plugin_root", "channel", "account_id")
);

CREATE TABLE "plugin_blob_entries" (
  "plugin_id" text COLLATE "C" NOT NULL,
  "namespace" text COLLATE "C" NOT NULL,
  "entry_key" text COLLATE "C" NOT NULL,
  "metadata_json" text COLLATE "C" NOT NULL,
  "blob" bytea NOT NULL,
  "created_at" bigint NOT NULL,
  "expires_at" bigint,
  PRIMARY KEY ("plugin_id", "namespace", "entry_key")
);

CREATE TABLE "plugin_state_entries" (
  "plugin_id" text COLLATE "C" NOT NULL,
  "namespace" text COLLATE "C" NOT NULL,
  "entry_key" text COLLATE "C" NOT NULL,
  "value_json" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  "expires_at" bigint,
  PRIMARY KEY ("plugin_id", "namespace", "entry_key")
);

CREATE TABLE "sandbox_registry_entries" (
  "registry_kind" text COLLATE "C" NOT NULL,
  "container_name" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C",
  "backend_id" text COLLATE "C",
  "runtime_label" text COLLATE "C",
  "image" text COLLATE "C",
  "created_at_ms" bigint,
  "last_used_at_ms" bigint,
  "config_label_kind" text COLLATE "C",
  "config_hash" text COLLATE "C",
  "cdp_port" bigint,
  "no_vnc_port" bigint,
  "entry_json" text COLLATE "C" NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("registry_kind", "container_name")
);

CREATE TABLE "schema_meta" (
  "meta_key" text COLLATE "C" NOT NULL,
  "role" text COLLATE "C" NOT NULL,
  "schema_version" bigint NOT NULL,
  "agent_id" text COLLATE "C",
  "app_version" text COLLATE "C",
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("meta_key")
);

CREATE TABLE "session_groups" (
  "name" text COLLATE "C" NOT NULL,
  "position" bigint NOT NULL,
  "created_at" bigint NOT NULL,
  "cwd" text COLLATE "C",
  "worktree" bigint,
  PRIMARY KEY ("name")
);

CREATE TABLE "session_state_events" (
  "sequence" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "dedupe_key" text COLLATE "C",
  "session_key" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C",
  "agent_id" text COLLATE "C" NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "actor_type" text COLLATE "C" NOT NULL,
  "actor_id" text COLLATE "C",
  "run_id" text COLLATE "C",
  "occurred_at" bigint NOT NULL,
  "summary" text COLLATE "C" NOT NULL,
  "payload_json" text COLLATE "C",
  PRIMARY KEY ("sequence"),
  UNIQUE ("dedupe_key")
);

CREATE TABLE "session_state_heads" (
  "session_key" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "last_sequence" bigint NOT NULL,
  "pruned_max_sequence" bigint NOT NULL DEFAULT 0,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("session_key", "agent_id")
);

CREATE TABLE "session_upstream_links" (
  "session_key" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "catalog_id" text COLLATE "C" NOT NULL,
  "host_id" text COLLATE "C" NOT NULL,
  "thread_id" text COLLATE "C" NOT NULL,
  "upstream_kind" text COLLATE "C" NOT NULL,
  "upstream_ref_json" text COLLATE "C",
  "last_marker_json" text COLLATE "C",
  "last_scanned_at" bigint,
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("session_key", "agent_id")
);

CREATE TABLE "session_watch_cursors" (
  "watcher_session_key" text COLLATE "C" NOT NULL,
  "watcher_store_path" text COLLATE "C",
  "target_session_key" text COLLATE "C" NOT NULL,
  "last_seen_sequence" bigint NOT NULL DEFAULT 0,
  "notified_sequence" bigint NOT NULL DEFAULT 0,
  "material_sequence" bigint NOT NULL DEFAULT 0,
  "provenance" text COLLATE "C" NOT NULL DEFAULT 'explicit',
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("watcher_session_key", "target_session_key"),
  CHECK (("provenance" IN ('explicit', 'ambient-group')))
);

CREATE TABLE "skill_upload_chunks" (
  "upload_id" text COLLATE "C" NOT NULL,
  "byte_offset" bigint NOT NULL,
  "size_bytes" bigint NOT NULL,
  "chunk_blob" bytea NOT NULL,
  PRIMARY KEY ("upload_id", "byte_offset"),
  CHECK (("byte_offset" >= 0)),
  CHECK (("size_bytes" > 0)),
  CHECK ((octet_length("chunk_blob") = "size_bytes"))
);

CREATE TABLE "skill_uploads" (
  "upload_id" text COLLATE "C" NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "slug" text COLLATE "C" NOT NULL,
  "force" bigint NOT NULL,
  "size_bytes" bigint NOT NULL,
  "sha256" text COLLATE "C",
  "actual_sha256" text COLLATE "C",
  "received_bytes" bigint NOT NULL,
  "archive_blob" bytea NOT NULL,
  "created_at" bigint NOT NULL,
  "expires_at" bigint NOT NULL,
  "committed" bigint NOT NULL,
  "committed_at" bigint,
  "idempotency_key_hash" text COLLATE "C",
  PRIMARY KEY ("upload_id"),
  UNIQUE ("idempotency_key_hash")
);

CREATE TABLE "skill_usage" (
  "skill_file" text COLLATE "C" NOT NULL,
  "skill_key" text COLLATE "C" NOT NULL,
  "skill_name" text COLLATE "C" NOT NULL,
  "skill_source" text COLLATE "C" NOT NULL,
  "first_used_at_ms" bigint NOT NULL,
  "last_used_at_ms" bigint NOT NULL,
  "use_count" bigint NOT NULL,
  "last_agent_id" text COLLATE "C",
  PRIMARY KEY ("skill_file")
);

CREATE TABLE "state_leases" (
  "scope" text COLLATE "C" NOT NULL,
  "lease_key" text COLLATE "C" NOT NULL,
  "owner" text COLLATE "C" NOT NULL,
  "expires_at" bigint,
  "heartbeat_at" bigint,
  "payload_json" text COLLATE "C",
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("scope", "lease_key")
);

CREATE TABLE "subagent_runs" (
  "run_id" text COLLATE "C" NOT NULL,
  "child_session_key" text COLLATE "C" NOT NULL,
  "controller_session_key" text COLLATE "C",
  "controller_store_path" text COLLATE "C",
  "requester_session_key" text COLLATE "C" NOT NULL,
  "requester_store_path" text COLLATE "C",
  "created_at" bigint NOT NULL,
  "payload_json" text COLLATE "C" NOT NULL DEFAULT '{}',
  PRIMARY KEY ("run_id")
);

CREATE TABLE "task_delivery_state" (
  "task_id" text COLLATE "C" NOT NULL,
  "requester_origin_json" text COLLATE "C",
  "last_notified_event_at" bigint,
  PRIMARY KEY ("task_id")
);

CREATE TABLE "task_runs" (
  "task_id" text COLLATE "C" NOT NULL,
  "runtime" text COLLATE "C" NOT NULL,
  "task_kind" text COLLATE "C",
  "source_id" text COLLATE "C",
  "requester_session_key" text COLLATE "C",
  "owner_key" text COLLATE "C" NOT NULL,
  "scope_kind" text COLLATE "C" NOT NULL,
  "child_session_key" text COLLATE "C",
  "parent_flow_id" text COLLATE "C",
  "parent_task_id" text COLLATE "C",
  "agent_id" text COLLATE "C",
  "requester_agent_id" text COLLATE "C",
  "run_id" text COLLATE "C",
  "execution_owner_host" text COLLATE "C",
  "execution_owner_pid" bigint,
  "execution_owner_start_identity" bigint,
  "label" text COLLATE "C",
  "task" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "delivery_status" text COLLATE "C" NOT NULL,
  "notify_policy" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  "started_at" bigint,
  "ended_at" bigint,
  "last_event_at" bigint,
  "cleanup_after" bigint,
  "tool_use_count" bigint,
  "last_tool_name" text COLLATE "C",
  "error" text COLLATE "C",
  "progress_summary" text COLLATE "C",
  "terminal_summary" text COLLATE "C",
  "terminal_outcome" text COLLATE "C",
  "detail_json" text COLLATE "C",
  PRIMARY KEY ("task_id")
);

CREATE TABLE "template_cron_refs" (
  "agent_id" text COLLATE "C" NOT NULL,
  "manifest_id" text COLLATE "C" NOT NULL,
  "schema_version" text COLLATE "C" NOT NULL,
  "declaration_key" text COLLATE "C" NOT NULL,
  "scheduler_job_id" text COLLATE "C",
  "status" text COLLATE "C" NOT NULL,
  "job_json" text COLLATE "C" NOT NULL,
  "error" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("agent_id", "manifest_id"),
  UNIQUE ("declaration_key"),
  UNIQUE ("scheduler_job_id")
);

CREATE TABLE "template_installs" (
  "agent_id" text COLLATE "C" NOT NULL,
  "schema_version" text COLLATE "C" NOT NULL,
  "source_kind" text COLLATE "C" NOT NULL,
  "template_name" text COLLATE "C" NOT NULL,
  "template_version" text COLLATE "C" NOT NULL,
  "package_root" text COLLATE "C" NOT NULL,
  "manifest_path" text COLLATE "C" NOT NULL,
  "integrity_kind" text COLLATE "C" NOT NULL,
  "integrity" text COLLATE "C" NOT NULL,
  "source_byte_length" bigint NOT NULL,
  "manifest_schema_version" bigint NOT NULL,
  "plan_integrity" text COLLATE "C" NOT NULL,
  "workspace" text COLLATE "C" NOT NULL,
  "agent_config_digest" text COLLATE "C" NOT NULL,
  "agent_owned_paths_json" text COLLATE "C" NOT NULL,
  "bootstrap_source_path" text COLLATE "C",
  "bootstrap_content_digest" text COLLATE "C",
  "status" text COLLATE "C" NOT NULL,
  "added_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("agent_id"),
  CHECK (("status" IN ('pending', 'workspace_ready', 'config_committed', 'complete', 'partial'))),
  UNIQUE ("workspace")
);

CREATE TABLE "template_mcp_server_refs" (
  "agent_id" text COLLATE "C" NOT NULL,
  "name" text COLLATE "C" NOT NULL,
  "schema_version" text COLLATE "C" NOT NULL,
  "config_digest" text COLLATE "C" NOT NULL,
  "relationship" text COLLATE "C" NOT NULL,
  "origin" text COLLATE "C" NOT NULL,
  "independent_owner" bigint NOT NULL DEFAULT 0,
  "status" text COLLATE "C" NOT NULL,
  "error" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("agent_id", "name"),
  CHECK (("relationship" IN ('managed', 'referenced'))),
  CHECK (("origin" IN ('template-introduced', 'pre-existing'))),
  CHECK (("independent_owner" IN (0, 1)))
);

CREATE TABLE "template_package_refs" (
  "agent_id" text COLLATE "C" NOT NULL,
  "package_kind" text COLLATE "C" NOT NULL,
  "package_source" text COLLATE "C" NOT NULL,
  "package_ref" text COLLATE "C" NOT NULL,
  "package_version" text COLLATE "C" NOT NULL,
  "package_integrity" text COLLATE "C" NOT NULL,
  "schema_version" text COLLATE "C" NOT NULL,
  "template_name" text COLLATE "C" NOT NULL,
  "package_status" text COLLATE "C" NOT NULL,
  "relationship" text COLLATE "C" NOT NULL,
  "origin" text COLLATE "C" NOT NULL,
  "independent_owner" bigint NOT NULL,
  "extension_id" text COLLATE "C",
  "extension_format" text COLLATE "C",
  "extension_detected_format" text COLLATE "C",
  "extension_mapped_json" text COLLATE "C",
  "extension_unavailable_json" text COLLATE "C",
  "extension_adapter_identity" text COLLATE "C",
  "installed_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("agent_id", "package_kind", "package_source", "package_ref", "package_version"),
  CHECK (("relationship" IN ('managed', 'referenced'))),
  CHECK (("origin" IN ('template-introduced', 'pre-existing'))),
  CHECK (("independent_owner" IN (0, 1)))
);

CREATE TABLE "template_workspace_files" (
  "agent_id" text COLLATE "C" NOT NULL,
  "target_path" text COLLATE "C" NOT NULL,
  "schema_version" text COLLATE "C" NOT NULL,
  "workspace" text COLLATE "C" NOT NULL,
  "source_path" text COLLATE "C" NOT NULL,
  "content_digest" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("agent_id", "target_path")
);

CREATE TABLE "web_push_subscriptions" (
  "endpoint_hash" text COLLATE "C" NOT NULL,
  "subscription_id" text COLLATE "C" NOT NULL,
  "endpoint" text COLLATE "C" NOT NULL,
  "p256dh" text COLLATE "C" NOT NULL,
  "auth" text COLLATE "C" NOT NULL,
  "device_id" text COLLATE "C",
  "user_profile_id" text COLLATE "C",
  "preferences_json" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("endpoint_hash"),
  UNIQUE ("subscription_id")
);

CREATE TABLE "worker_environment_credentials" (
  "environment_id" text COLLATE "C" NOT NULL,
  "credential_hash" text COLLATE "C" NOT NULL,
  "bundle_hash" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C",
  "rpc_set_version" bigint NOT NULL,
  "owner_epoch" bigint NOT NULL,
  "expires_at_ms" bigint NOT NULL,
  "delivered_at_ms" bigint,
  PRIMARY KEY ("environment_id"),
  CHECK (("rpc_set_version" >= 1)),
  CHECK (("owner_epoch" >= 0)),
  CHECK (("expires_at_ms" >= 0)),
  CHECK (("delivered_at_ms" >= 0)),
  UNIQUE ("credential_hash")
);

CREATE TABLE "worker_environments" (
  "environment_id" text COLLATE "C" NOT NULL,
  "provider_id" text COLLATE "C" NOT NULL,
  "profile_id" text COLLATE "C" NOT NULL,
  "profile_snapshot_json" text COLLATE "C" NOT NULL,
  "last_activated_at_ms" bigint,
  "preparation_key" text COLLATE "C",
  "preparation_purpose" text COLLATE "C",
  "preparation_demand_at_ms" bigint,
  "preparation_expires_at_ms" bigint,
  "preparation_consumed_at_ms" bigint,
  "provision_operation_id" text COLLATE "C" NOT NULL,
  "lease_id" text COLLATE "C",
  "node_setup_id" text COLLATE "C",
  "node_device_id" text COLLATE "C",
  "ssh_host" text COLLATE "C",
  "ssh_port" bigint,
  "ssh_user" text COLLATE "C",
  "ssh_host_key" text COLLATE "C",
  "ssh_key_ref_json" text COLLATE "C",
  "desktop_json" text COLLATE "C",
  "state" text COLLATE "C" NOT NULL,
  "bootstrap_bundle_hash" text COLLATE "C",
  "bootstrap_openclaw_version" text COLLATE "C",
  "bootstrap_protocol_features_json" text COLLATE "C",
  "bootstrap_install_kind" text COLLATE "C",
  "owner_epoch" bigint NOT NULL DEFAULT 0,
  "teardown_terminal_state" text COLLATE "C",
  "attached_session_ids_json" text COLLATE "C" NOT NULL DEFAULT '[]',
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "state_changed_at_ms" bigint NOT NULL,
  "idle_since_at_ms" bigint,
  "destroy_requested_at_ms" bigint,
  "last_error" text COLLATE "C",
  "shared_host" bigint,
  "resource_receipt_json" text COLLATE "C",
  "retention_json" text COLLATE "C",
  "provision_source_json" text COLLATE "C",
  PRIMARY KEY ("environment_id"),
  CHECK (("preparation_key" IS NULL AND "preparation_demand_at_ms" IS NULL AND "preparation_expires_at_ms" IS NULL AND "preparation_consumed_at_ms" IS NULL) OR ("preparation_key" IS NOT NULL AND (char_length("preparation_key") = 64) AND ("preparation_key" COLLATE "C" !~ '\\A.*[^0-9a-f].*\\Z') AND "preparation_demand_at_ms" IS NOT NULL AND ("preparation_demand_at_ms" BETWEEN 0 AND 9007199254740991) AND "preparation_expires_at_ms" IS NOT NULL AND ("preparation_expires_at_ms" > "preparation_demand_at_ms") AND ("preparation_expires_at_ms" <= 9007199254740991) AND ("preparation_consumed_at_ms" IS NULL OR (("preparation_consumed_at_ms" >= "preparation_demand_at_ms") AND ("preparation_consumed_at_ms" < "preparation_expires_at_ms"))))),
  CHECK ("ssh_port" IS NULL OR (("ssh_port" >= 1) AND ("ssh_port" <= 65535))),
  CHECK (("state" IN ('requested', 'provisioning', 'bootstrapping', 'ready', 'attached', 'idle', 'draining', 'destroying', 'destroyed', 'failed', 'orphaned'))),
  CHECK (("owner_epoch" >= 0)),
  CHECK (("teardown_terminal_state" IN ('destroyed', 'failed'))),
  UNIQUE ("provision_operation_id")
);

CREATE TABLE "worker_inference_turns" (
  "session_id" text COLLATE "C" NOT NULL,
  "run_epoch" bigint NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "turn_id" text COLLATE "C" NOT NULL,
  "environment_id" text COLLATE "C" NOT NULL,
  "request_hash" text COLLATE "C" NOT NULL,
  "state" text COLLATE "C" NOT NULL,
  "terminal_json" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("session_id", "run_epoch", "run_id", "turn_id"),
  CHECK (("run_epoch" >= 0)),
  CHECK (("state" IN ('pending', 'terminal'))),
  CHECK (("created_at_ms" >= 0)),
  CHECK (("updated_at_ms" >= 0)),
  CHECK ((("state" = 'pending') AND "terminal_json" IS NULL) OR (("state" = 'terminal') AND "terminal_json" IS NOT NULL))
);

CREATE TABLE "worker_session_placements" (
  "session_id" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "execution_mode" text COLLATE "C",
  "state" text COLLATE "C" NOT NULL,
  "environment_id" text COLLATE "C",
  "transition_generation" bigint NOT NULL DEFAULT 0,
  "active_owner_epoch" bigint,
  "workspace_base_manifest_ref" text COLLATE "C",
  "remote_workspace_dir" text COLLATE "C",
  "worker_bundle_hash" text COLLATE "C",
  "last_transcript_ack_cursor" bigint,
  "last_live_event_ack_cursor" bigint,
  "recovery_error" text COLLATE "C",
  "turn_claim_owner" text COLLATE "C",
  "turn_claim_id" text COLLATE "C",
  "turn_claim_run_id" text COLLATE "C",
  "turn_claim_generation" bigint,
  "turn_claim_owner_epoch" bigint,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "state_changed_at_ms" bigint NOT NULL,
  "terminal_reason" text COLLATE "C",
  "terminal_at_ms" bigint,
  PRIMARY KEY ("session_id"),
  CHECK (("execution_mode" IN ('worker-turn', 'remote-exec'))),
  CHECK (("state" IN ('local', 'requested', 'provisioning', 'syncing', 'starting', 'active', 'draining', 'reconciling', 'reclaimed', 'failed'))),
  CHECK (("transition_generation" >= 0)),
  CHECK ("active_owner_epoch" IS NULL OR ("active_owner_epoch" >= 1)),
  CHECK ("last_transcript_ack_cursor" IS NULL OR ("last_transcript_ack_cursor" >= 0)),
  CHECK ("last_live_event_ack_cursor" IS NULL OR ("last_live_event_ack_cursor" >= 0)),
  CHECK (("turn_claim_owner" IN ('local', 'worker'))),
  CHECK ("turn_claim_generation" IS NULL OR ("turn_claim_generation" >= 0)),
  CHECK ("turn_claim_owner_epoch" IS NULL OR ("turn_claim_owner_epoch" >= 1)),
  CHECK ((("state" IN ('local', 'requested')) AND "environment_id" IS NULL AND "active_owner_epoch" IS NULL AND "workspace_base_manifest_ref" IS NULL AND "remote_workspace_dir" IS NULL AND "worker_bundle_hash" IS NULL AND "last_transcript_ack_cursor" IS NULL AND "last_live_event_ack_cursor" IS NULL AND "recovery_error" IS NULL) OR ("state" IS NOT DISTINCT FROM 'provisioning' AND "active_owner_epoch" IS NULL AND "workspace_base_manifest_ref" IS NULL AND "remote_workspace_dir" IS NULL AND "worker_bundle_hash" IS NULL AND "last_transcript_ack_cursor" IS NULL AND "last_live_event_ack_cursor" IS NULL AND "recovery_error" IS NULL) OR ("state" IS NOT DISTINCT FROM 'syncing' AND "environment_id" IS NOT NULL AND "active_owner_epoch" IS NULL AND "workspace_base_manifest_ref" IS NULL AND "remote_workspace_dir" IS NULL AND "worker_bundle_hash" IS NOT NULL AND "last_transcript_ack_cursor" IS NULL AND "last_live_event_ack_cursor" IS NULL AND "recovery_error" IS NULL) OR ("state" IS NOT DISTINCT FROM 'starting' AND "environment_id" IS NOT NULL AND "active_owner_epoch" IS NULL AND "workspace_base_manifest_ref" IS NOT NULL AND "remote_workspace_dir" IS NOT NULL AND "worker_bundle_hash" IS NOT NULL AND "last_transcript_ack_cursor" IS NULL AND "last_live_event_ack_cursor" IS NULL AND "recovery_error" IS NULL) OR (("state" IN ('active', 'draining', 'reconciling')) AND "environment_id" IS NOT NULL AND "active_owner_epoch" IS NOT NULL AND "workspace_base_manifest_ref" IS NOT NULL AND "remote_workspace_dir" IS NOT NULL AND "worker_bundle_hash" IS NOT NULL AND "recovery_error" IS NULL) OR ("state" IS NOT DISTINCT FROM 'reclaimed' AND "environment_id" IS NOT NULL AND "active_owner_epoch" IS NOT NULL AND "workspace_base_manifest_ref" IS NOT NULL AND "remote_workspace_dir" IS NOT NULL AND "worker_bundle_hash" IS NOT NULL AND "recovery_error" IS NULL AND "turn_claim_owner" IS NULL AND "turn_claim_id" IS NULL AND "turn_claim_run_id" IS NULL AND "turn_claim_generation" IS NULL AND "turn_claim_owner_epoch" IS NULL) OR ("state" IS NOT DISTINCT FROM 'failed' AND "recovery_error" IS NOT NULL)),
  CHECK (("turn_claim_owner" IS NULL AND "turn_claim_id" IS NULL AND "turn_claim_run_id" IS NULL AND "turn_claim_generation" IS NULL AND "turn_claim_owner_epoch" IS NULL) OR ("turn_claim_owner" IS NOT DISTINCT FROM 'local' AND "turn_claim_id" IS NOT NULL AND "turn_claim_run_id" IS NOT NULL AND "turn_claim_generation" IS NOT NULL AND "turn_claim_owner_epoch" IS NULL) OR ("turn_claim_owner" IS NOT DISTINCT FROM 'worker' AND "turn_claim_id" IS NOT NULL AND "turn_claim_run_id" IS NOT NULL AND "turn_claim_generation" IS NOT NULL AND "turn_claim_owner_epoch" IS NOT NULL)),
  CHECK ("turn_claim_owner" IS NULL OR ("turn_claim_owner" IS NOT DISTINCT FROM 'local' AND (("state" IN ('local', 'requested', 'failed')) OR (("state" IN ('active', 'draining')) AND "execution_mode" IS NOT DISTINCT FROM 'remote-exec'))) OR ("turn_claim_owner" IS NOT DISTINCT FROM 'worker' AND ("state" IN ('active', 'draining')) AND ("execution_mode" IS NULL OR "execution_mode" IS NOT DISTINCT FROM 'worker-turn') AND "turn_claim_owner_epoch" IS NOT DISTINCT FROM "active_owner_epoch"))
);

CREATE TABLE "worker_session_tool_operations" (
  "source_session_id" text COLLATE "C" NOT NULL,
  "source_claim_id" text COLLATE "C" NOT NULL,
  "tool_call_id" text COLLATE "C" NOT NULL,
  "tool_name" text COLLATE "C" NOT NULL,
  "request_digest" text COLLATE "C" NOT NULL,
  "operation_seed" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "child_session_key" text COLLATE "C",
  "result_json" text COLLATE "C",
  "gateway_instance_id" text COLLATE "C" NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("source_session_id", "source_claim_id", "tool_call_id"),
  CHECK (("tool_name" IN ('sessions_spawn', 'sessions_send'))),
  CHECK (("status" IN ('running', 'succeeded', 'failed', 'unknown')))
);

CREATE TABLE "worker_transcript_commit_heads" (
  "session_id" text COLLATE "C" NOT NULL,
  "run_epoch" bigint NOT NULL,
  "environment_id" text COLLATE "C" NOT NULL,
  "next_seq" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("session_id", "run_epoch"),
  CHECK (("run_epoch" >= 0)),
  CHECK (("next_seq" >= 1)),
  CHECK (("updated_at_ms" >= 0))
);

CREATE TABLE "worker_transcript_commits" (
  "session_id" text COLLATE "C" NOT NULL,
  "run_epoch" bigint NOT NULL,
  "seq" bigint NOT NULL,
  "request_hash" text COLLATE "C" NOT NULL,
  "state" text COLLATE "C" NOT NULL,
  "result_json" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("session_id", "run_epoch", "seq"),
  CHECK (("run_epoch" >= 0)),
  CHECK (("seq" >= 1)),
  CHECK (("state" IN ('pending', 'terminal'))),
  CHECK (("created_at_ms" >= 0)),
  CHECK (("updated_at_ms" >= 0)),
  CHECK ((("state" = 'pending') AND "result_json" IS NULL) OR (("state" = 'terminal') AND "result_json" IS NOT NULL))
);

CREATE TABLE "worker_turn_tool_authorities" (
  "session_id" text COLLATE "C" NOT NULL,
  "environment_id" text COLLATE "C" NOT NULL,
  "owner_epoch" bigint NOT NULL,
  "placement_generation" bigint NOT NULL,
  "claim_id" text COLLATE "C" NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "tool_names_json" text COLLATE "C" NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("session_id"),
  CHECK (("owner_epoch" >= 1)),
  CHECK (("placement_generation" >= 0))
);

CREATE TABLE "worker_workspace_pending_results" (
  "session_id" text COLLATE "C" NOT NULL,
  "environment_id" text COLLATE "C" NOT NULL,
  "owner_epoch" bigint NOT NULL,
  "placement_generation" bigint NOT NULL,
  "claim_id" text COLLATE "C" NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "gateway_instance_id" text COLLATE "C" NOT NULL,
  "recovery_requested_at_ms" bigint,
  "workspace_accepted_at_ms" bigint,
  "staged_result_ref" text COLLATE "C",
  "repository_workspace_id" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "repository_disk_authority_json" text COLLATE "C",
  PRIMARY KEY ("session_id"),
  CHECK (("owner_epoch" >= 1)),
  CHECK (("placement_generation" >= 0))
);

CREATE TABLE "worker_workspace_reconciliations" (
  "session_id" text COLLATE "C" NOT NULL,
  "environment_id" text COLLATE "C" NOT NULL,
  "owner_epoch" bigint NOT NULL,
  "placement_generation" bigint NOT NULL,
  "base_manifest_ref" text COLLATE "C" NOT NULL,
  "current_manifest_ref" text COLLATE "C" NOT NULL,
  "plan_json" text COLLATE "C" NOT NULL,
  "base_pack" bytea NOT NULL,
  "created_at_ms" bigint NOT NULL,
  PRIMARY KEY ("session_id"),
  CHECK (("owner_epoch" >= 1)),
  CHECK (("placement_generation" >= 0)),
  CHECK ((octet_length("base_pack") <= 268435456))
);

CREATE TABLE "workspace_generated_bootstrap_hashes" (
  "workspace_key" text COLLATE "C" NOT NULL,
  "filename" text COLLATE "C" NOT NULL,
  "sha256" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("workspace_key", "filename")
);

CREATE TABLE "workspace_path_aliases" (
  "alias_key" text COLLATE "C" NOT NULL,
  "alias_path" text COLLATE "C" NOT NULL,
  "workspace_key" text COLLATE "C" NOT NULL,
  "workspace_path" text COLLATE "C" NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("alias_key")
);

CREATE TABLE "workspace_setup_state" (
  "workspace_key" text COLLATE "C" NOT NULL,
  "workspace_path" text COLLATE "C",
  "version" bigint,
  "bootstrap_seeded_at" text COLLATE "C",
  "setup_completed_at" text COLLATE "C",
  "updated_at" bigint,
  "attested_at_ms" bigint,
  "attestation_updated_at_ms" bigint,
  "bootstrap_deferred" bigint,
  PRIMARY KEY ("workspace_key"),
  CHECK ("version" IS NULL OR "workspace_path" IS NOT NULL)
);

CREATE TABLE "worktree_provisioned_file_chunks" (
  "worktree_id" text COLLATE "C" NOT NULL,
  "path" text COLLATE "C" NOT NULL,
  "chunk_index" bigint NOT NULL,
  "data" bytea NOT NULL,
  PRIMARY KEY ("worktree_id", "path", "chunk_index"),
  CHECK (("chunk_index" >= 0))
);

CREATE TABLE "worktrees" (
  "id" text COLLATE "C" NOT NULL,
  "repo_fingerprint" text COLLATE "C" NOT NULL,
  "repo_root" text COLLATE "C" NOT NULL,
  "path" text COLLATE "C" NOT NULL,
  "branch" text COLLATE "C" NOT NULL,
  "base_ref" text COLLATE "C" NOT NULL,
  "owner_kind" text COLLATE "C" NOT NULL,
  "owner_id" text COLLATE "C",
  "snapshot_ref" text COLLATE "C",
  "provisioned_paths_json" text COLLATE "C",
  "created_at" bigint NOT NULL,
  "last_active_at" bigint NOT NULL,
  "removed_at" bigint,
  "run_end_cleanup_json" text COLLATE "C",
  "gc_protection_json" text COLLATE "C",
  PRIMARY KEY ("id"),
  CHECK (("owner_kind" IN ('manual', 'workboard', 'session')))
);

CREATE INDEX "idx_acp_replay_sessions_key_updated" ON "acp_replay_sessions" (("session_key") ASC, ("complete") ASC, ("updated_at") DESC, ("session_id") ASC);

CREATE INDEX "idx_acp_replay_sessions_updated" ON "acp_replay_sessions" (("updated_at") DESC, ("session_id") ASC);

CREATE INDEX "idx_acp_sessions_agent_activity" ON "acp_sessions" (("agent") ASC, ("last_activity_at") DESC, ("session_key") ASC);

CREATE INDEX "idx_acp_sessions_resume_acpx" ON "acp_sessions" (("resume_acpx_session_id") ASC NULLS FIRST);

CREATE INDEX "idx_acp_sessions_resume_agent" ON "acp_sessions" (("resume_agent_session_id") ASC NULLS FIRST);

CREATE INDEX "idx_acp_sessions_state_activity" ON "acp_sessions" (("state") ASC, ("last_activity_at") DESC, ("session_key") ASC);

CREATE INDEX "idx_apns_registrations_updated" ON "apns_registrations" (("updated_at_ms") DESC, ("node_id") ASC);

CREATE INDEX "idx_audit_events_agent_sequence" ON "audit_events" (("agent_id") ASC NULLS FIRST, ("sequence") DESC);

CREATE INDEX "idx_audit_events_channel_sequence" ON "audit_events" (("channel") ASC NULLS FIRST, ("sequence") DESC);

CREATE INDEX "idx_audit_events_direction_sequence" ON "audit_events" (("direction") ASC NULLS FIRST, ("sequence") DESC);

CREATE INDEX "idx_audit_events_kind_sequence" ON "audit_events" (("kind") ASC, ("sequence") DESC);

CREATE INDEX "idx_audit_events_run_sequence" ON "audit_events" (("run_id") ASC NULLS FIRST, ("sequence") DESC);

CREATE INDEX "idx_audit_events_session_sequence" ON "audit_events" (("session_key") ASC NULLS FIRST, ("sequence") DESC);

CREATE INDEX "idx_audit_events_status_sequence" ON "audit_events" (("status") ASC, ("sequence") DESC);

CREATE INDEX "idx_audit_events_time" ON "audit_events" (("occurred_at") DESC, ("sequence") DESC);

CREATE INDEX "idx_backup_runs_created" ON "backup_runs" (("created_at") DESC, ("id") ASC);

CREATE INDEX "capture_events_flow_idx" ON "capture_events" (("flow_id") ASC, ("ts") ASC);

CREATE INDEX "capture_events_session_ts_idx" ON "capture_events" (("session_id") ASC, ("ts") ASC);

CREATE INDEX "idx_channel_ingress_claims" ON "channel_ingress_events" (("queue_name") ASC, ("status") ASC, ("claimed_at") ASC NULLS FIRST);

CREATE INDEX "idx_channel_ingress_lane" ON "channel_ingress_events" (("queue_name") ASC, ("status") ASC, ("lane_key") ASC NULLS FIRST);

CREATE INDEX "idx_channel_ingress_pending" ON "channel_ingress_events" (("queue_name") ASC, ("status") ASC, ("received_at") ASC, ("event_id") ASC);

CREATE INDEX "idx_channel_pairing_allow_account" ON "channel_pairing_allow_entries" (("channel_key") ASC, ("account_id") ASC, ("sort_order") ASC, ("entry") ASC);

CREATE INDEX "idx_channel_pairing_requests_code" ON "channel_pairing_requests" (("channel_key") ASC, ("code") ASC);

CREATE INDEX "idx_channel_pairing_requests_created" ON "channel_pairing_requests" (("channel_key") ASC, ("created_at") ASC, ("request_id") ASC);

CREATE INDEX "idx_cron_job_scratch_store_updated" ON "cron_job_scratch" (("store_key") ASC, ("updated_at_ms") DESC, ("job_id") ASC);

CREATE INDEX "idx_cron_jobs_store_order" ON "cron_jobs" (("store_key") ASC, ("sort_order") ASC, ("updated_at") ASC, ("job_id") ASC);

CREATE INDEX "idx_current_conversation_bindings_conversation" ON "current_conversation_bindings" (("channel") ASC, ("account_id") ASC, ("conversation_kind") ASC, ("conversation_id") ASC);

CREATE INDEX "idx_current_conversation_bindings_expires" ON "current_conversation_bindings" (("expires_at") ASC NULLS FIRST, ("binding_key") ASC);

CREATE INDEX "idx_current_conversation_bindings_target" ON "current_conversation_bindings" (("target_session_key") ASC, ("updated_at") DESC, ("binding_key") ASC);

CREATE INDEX "idx_delivery_queue_bounded_retention" ON "delivery_queue_entries" (("queue_name") ASC, ("retention_id_prefix") ASC, ("enqueued_at") DESC, ("id") DESC) WHERE ("status" IN ('completed', 'failed')) AND ("recovery_state" = 'completed_bounded') AND "retention_id_prefix" IS NOT NULL;

CREATE INDEX "idx_delivery_queue_failed" ON "delivery_queue_entries" (("status") ASC, ("queue_name") ASC, ("failed_at") ASC NULLS FIRST, ("id") ASC);

CREATE INDEX "idx_delivery_queue_pending" ON "delivery_queue_entries" (("queue_name") ASC, ("status") ASC, ("enqueued_at") ASC, ("id") ASC);

CREATE INDEX "idx_delivery_queue_session" ON "delivery_queue_entries" (("queue_name") ASC, ("status") ASC, ("session_key") ASC, ("enqueued_at") ASC, ("id") ASC) WHERE "session_key" IS NOT NULL;

CREATE INDEX "idx_delivery_queue_target" ON "delivery_queue_entries" (("queue_name") ASC, ("status") ASC, ("channel") ASC, ("target") ASC, ("enqueued_at") ASC, ("id") ASC) WHERE "channel" IS NOT NULL AND "target" IS NOT NULL;

CREATE INDEX "idx_device_bootstrap_tokens_ts" ON "device_bootstrap_tokens" (("ts") ASC);

CREATE INDEX "idx_device_pairing_paired_approved" ON "device_pairing_paired" (("approved_at_ms") DESC, ("device_id") ASC);

CREATE INDEX "idx_device_pairing_pending_device" ON "device_pairing_pending" (("device_id") ASC, ("ts") DESC);

CREATE INDEX "idx_diagnostic_events_scope_sequence" ON "diagnostic_events" (("scope") ASC, ("sequence") ASC, ("event_key") ASC);

CREATE INDEX "idx_flow_runs_owner_key" ON "flow_runs" (("owner_key") ASC);

CREATE INDEX "idx_flow_runs_status" ON "flow_runs" (("status") ASC);

CREATE INDEX "idx_flow_runs_updated_at" ON "flow_runs" (("updated_at") ASC);

CREATE INDEX "idx_gateway_boot_lifecycle_started" ON "gateway_boot_lifecycle" (("started_at_ms") ASC);

CREATE INDEX "idx_gateway_restart_handoff_expiry" ON "gateway_restart_handoff" (("expires_at") ASC, ("pid") ASC);

CREATE INDEX "idx_gateway_restart_sentinel_ts" ON "gateway_restart_sentinel" (("ts") DESC, ("sentinel_key") ASC);

CREATE INDEX "idx_macos_port_guardian_records_port" ON "macos_port_guardian_records" (("port") ASC, ("timestamp") DESC);

CREATE INDEX "idx_managed_outgoing_images_agent_message" ON "managed_outgoing_image_records" (("session_key") ASC, ("agent_id") ASC NULLS FIRST, ("message_id") ASC, ("attachment_id") ASC) WHERE "message_id" IS NOT NULL;

CREATE INDEX "idx_managed_outgoing_images_agent_session" ON "managed_outgoing_image_records" (("session_key") ASC, ("agent_id") ASC NULLS FIRST, ("created_at") DESC, ("attachment_id") ASC);

CREATE INDEX "idx_managed_outgoing_images_message" ON "managed_outgoing_image_records" (("session_key") ASC, ("message_id") ASC, ("attachment_id") ASC) WHERE "message_id" IS NOT NULL;

CREATE INDEX "idx_managed_outgoing_images_session" ON "managed_outgoing_image_records" (("session_key") ASC, ("created_at") DESC, ("attachment_id") ASC);

CREATE INDEX "idx_meeting_transcript_sessions_account" ON "meeting_transcript_sessions" (("source_account_id") ASC NULLS FIRST);

CREATE INDEX "idx_meeting_transcript_sessions_agent" ON "meeting_transcript_sessions" (("metadata_agent_id") ASC NULLS FIRST);

CREATE INDEX "idx_meeting_transcript_sessions_chronology" ON "meeting_transcript_sessions" (("started_at_ms") DESC NULLS LAST, ("session_id") ASC, ("started_at") ASC);

CREATE INDEX "idx_meeting_transcript_sessions_export_key" ON "meeting_transcript_sessions" (("export_key") ASC);

CREATE INDEX "idx_meeting_transcript_sessions_id" ON "meeting_transcript_sessions" (("session_id") ASC, ("started_at") DESC);

CREATE INDEX "idx_meeting_transcript_sessions_slug" ON "meeting_transcript_sessions" (("session_slug") ASC, ("started_at") DESC);

CREATE INDEX "idx_meeting_transcript_sessions_source" ON "meeting_transcript_sessions" (("provider_id") ASC, ("source_account_id") ASC NULLS FIRST, ("source_guild_id") ASC NULLS FIRST, ("source_channel_id") ASC NULLS FIRST, ("source_meeting_url") ASC NULLS FIRST, ("source_thread_ts") ASC NULLS FIRST, ("source_file_id") ASC NULLS FIRST, ("stopped_at") DESC NULLS LAST, ("started_at") DESC, ("session_id") ASC);

CREATE INDEX "idx_meeting_transcript_sessions_started" ON "meeting_transcript_sessions" (("started_at") DESC, ("session_id") ASC);

CREATE INDEX "idx_meeting_transcript_utterances_id" ON "meeting_transcript_utterances" (("session_id") ASC, ("session_started_at") ASC, ("utterance_id") ASC) WHERE "utterance_id" IS NOT NULL;

CREATE INDEX "idx_migration_runs_started" ON "migration_runs" (("started_at") DESC, ("id") ASC);

CREATE INDEX "idx_migration_sources_path" ON "migration_sources" (("source_path") ASC, ("migration_kind") ASC, ("target_table") ASC);

CREATE INDEX "idx_migration_sources_run" ON "migration_sources" (("last_run_id") ASC, ("source_path") ASC);

CREATE INDEX "idx_native_hook_relay_bridges_expires" ON "native_hook_relay_bridges" (("expires_at_ms") ASC, ("relay_id") ASC);

CREATE INDEX "idx_official_external_plugin_catalog_snapshots_updated" ON "official_external_plugin_catalog_snapshots" (("updated_at_ms") DESC, ("feed_url") ASC);

CREATE UNIQUE INDEX "idx_operator_approvals_cursor_id" ON "operator_approvals" (("cursor_id") ASC);

CREATE UNIQUE INDEX "idx_operator_approvals_resolution_ref" ON "operator_approvals" (("resolution_ref") ASC);

CREATE INDEX "idx_operator_approvals_resolved" ON "operator_approvals" (("resolved_at_ms") ASC, ("approval_id") ASC) WHERE "resolved_at_ms" IS NOT NULL;

CREATE INDEX "idx_operator_approvals_runtime_pending" ON "operator_approvals" (("runtime_epoch") ASC, ("approval_id") ASC) WHERE ("status" = 'pending');

CREATE INDEX "idx_operator_approvals_source_run_resolved" ON "operator_approvals" (("source_run_id") ASC, ("resolved_at_ms") ASC, ("approval_id") ASC) WHERE "source_run_id" IS NOT NULL AND "resolved_at_ms" IS NOT NULL;

CREATE INDEX "idx_operator_approvals_source_session_created" ON "operator_approvals" (("source_session_key") ASC NULLS FIRST, ("created_at_ms") DESC, ("approval_id") ASC);

CREATE INDEX "idx_operator_approvals_status_expiry" ON "operator_approvals" (("status") ASC, ("expires_at_ms") ASC, ("approval_id") ASC);

CREATE INDEX "idx_plugin_binding_approvals_plugin" ON "plugin_binding_approvals" (("plugin_id") ASC, ("approved_at") DESC);

CREATE INDEX "idx_plugin_blob_expiry" ON "plugin_blob_entries" (("expires_at") ASC) WHERE "expires_at" IS NOT NULL;

CREATE INDEX "idx_plugin_blob_listing" ON "plugin_blob_entries" (("plugin_id") ASC, ("namespace") ASC, ("created_at") ASC, ("entry_key") ASC);

CREATE INDEX "idx_plugin_state_expiry" ON "plugin_state_entries" (("expires_at") ASC) WHERE "expires_at" IS NOT NULL;

CREATE INDEX "idx_plugin_state_listing" ON "plugin_state_entries" (("plugin_id") ASC, ("namespace") ASC, ("created_at") ASC, ("entry_key") ASC, ("expires_at") ASC NULLS FIRST);

CREATE INDEX "idx_sandbox_registry_last_used" ON "sandbox_registry_entries" (("registry_kind") ASC, ("last_used_at_ms") DESC, ("container_name") ASC) WHERE "last_used_at_ms" IS NOT NULL;

CREATE INDEX "idx_sandbox_registry_session" ON "sandbox_registry_entries" (("registry_kind") ASC, ("session_key") ASC, ("last_used_at_ms") DESC NULLS LAST, ("container_name") ASC) WHERE "session_key" IS NOT NULL;

CREATE INDEX "idx_sandbox_registry_updated" ON "sandbox_registry_entries" (("registry_kind") ASC, ("updated_at") DESC, ("container_name") ASC);

CREATE INDEX "idx_session_state_events_session_sequence" ON "session_state_events" (("session_key") ASC, ("sequence") DESC);

CREATE INDEX "idx_session_state_events_time" ON "session_state_events" (("occurred_at") DESC, ("sequence") DESC);

CREATE INDEX "idx_session_upstream_links_catalog_id" ON "session_upstream_links" (("catalog_id") ASC);

CREATE INDEX "idx_session_watch_cursors_target" ON "session_watch_cursors" (("target_session_key") ASC);

CREATE INDEX "idx_skill_uploads_expiry" ON "skill_uploads" (("expires_at") ASC);

CREATE INDEX "idx_skill_uploads_idempotency" ON "skill_uploads" (("idempotency_key_hash") ASC) WHERE "idempotency_key_hash" IS NOT NULL;

CREATE INDEX "idx_state_leases_expiry" ON "state_leases" (("expires_at") ASC, ("scope") ASC, ("lease_key") ASC) WHERE "expires_at" IS NOT NULL;

CREATE INDEX "idx_state_leases_owner" ON "state_leases" (("owner") ASC);

CREATE INDEX "idx_subagent_runs_child_session_key" ON "subagent_runs" (("child_session_key") ASC, ("created_at") DESC, ("run_id") ASC);

CREATE INDEX "idx_subagent_runs_controller_session_key" ON "subagent_runs" (("controller_session_key") ASC NULLS FIRST, ("created_at") DESC, ("run_id") ASC);

CREATE INDEX "idx_subagent_runs_requester_session_key" ON "subagent_runs" (("requester_session_key") ASC, ("created_at") DESC, ("run_id") ASC);

CREATE INDEX "idx_task_runs_cron_runtime_order" ON "task_runs" (("runtime") ASC, ("created_at") ASC, ("task_id") ASC) WHERE ("runtime" = 'cron');

CREATE INDEX "idx_task_runs_cron_source_order" ON "task_runs" (("source_id") ASC NULLS FIRST, ("created_at") ASC, ("task_id") ASC) WHERE ("runtime" = 'cron');

CREATE INDEX "idx_task_runs_runtime_run" ON "task_runs" (("runtime") ASC, ("run_id") ASC NULLS FIRST, ("source_id") ASC NULLS FIRST, ("created_at") ASC, ("task_id") ASC);

CREATE INDEX "idx_web_push_subscriptions_updated" ON "web_push_subscriptions" (("updated_at_ms") DESC, ("subscription_id") ASC);

CREATE UNIQUE INDEX "idx_worker_environments_provider_lease" ON "worker_environments" (("provider_id") ASC, ("lease_id") ASC) WHERE "lease_id" IS NOT NULL;

CREATE INDEX "idx_worker_environments_terminal_changed" ON "worker_environments" (("state_changed_at_ms") ASC, ("environment_id") ASC);

CREATE UNIQUE INDEX "idx_worker_inference_turns_pending_run" ON "worker_inference_turns" (("session_id") ASC, ("run_epoch") ASC, ("run_id") ASC) WHERE ("state" = 'pending');

CREATE INDEX "idx_worker_session_placements_environment" ON "worker_session_placements" (("environment_id") ASC) WHERE "environment_id" IS NOT NULL;

CREATE INDEX "idx_worker_session_placements_reconcile" ON "worker_session_placements" (("updated_at_ms") ASC, ("session_id") ASC);

CREATE INDEX "idx_worker_session_placements_session_key" ON "worker_session_placements" (("agent_id") ASC, ("session_key") ASC);

CREATE INDEX "idx_workspace_path_aliases_workspace" ON "workspace_path_aliases" (("workspace_key") ASC);

CREATE INDEX "idx_workspace_setup_state_path" ON "workspace_setup_state" (("workspace_path") ASC NULLS FIRST);

CREATE INDEX "idx_worktrees_removed_at" ON "worktrees" (("removed_at") ASC NULLS FIRST);

CREATE INDEX "idx_worktrees_repo_fingerprint" ON "worktrees" (("repo_fingerprint") ASC);

ALTER TABLE "acp_replay_events" ADD FOREIGN KEY ("session_id") REFERENCES "acp_replay_sessions" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "capture_events" ADD FOREIGN KEY ("data_blob_id") REFERENCES "capture_blobs" ("blob_id") ON UPDATE NO ACTION ON DELETE SET NULL NOT DEFERRABLE;

ALTER TABLE "capture_events" ADD FOREIGN KEY ("session_id") REFERENCES "capture_sessions" ("id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "meeting_transcript_summaries" ADD FOREIGN KEY ("session_id", "session_started_at") REFERENCES "meeting_transcript_sessions" ("session_id", "started_at") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "meeting_transcript_utterances" ADD FOREIGN KEY ("session_id", "session_started_at") REFERENCES "meeting_transcript_sessions" ("session_id", "started_at") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "migration_sources" ADD FOREIGN KEY ("last_run_id") REFERENCES "migration_runs" ("id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "skill_upload_chunks" ADD FOREIGN KEY ("upload_id") REFERENCES "skill_uploads" ("upload_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "task_delivery_state" ADD FOREIGN KEY ("task_id") REFERENCES "task_runs" ("task_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "worker_environment_credentials" ADD FOREIGN KEY ("environment_id") REFERENCES "worker_environments" ("environment_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "worker_inference_turns" ADD FOREIGN KEY ("environment_id") REFERENCES "worker_environments" ("environment_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "worker_session_tool_operations" ADD FOREIGN KEY ("source_session_id") REFERENCES "worker_session_placements" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "worker_transcript_commits" ADD FOREIGN KEY ("session_id", "run_epoch") REFERENCES "worker_transcript_commit_heads" ("session_id", "run_epoch") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "worker_turn_tool_authorities" ADD FOREIGN KEY ("session_id") REFERENCES "worker_session_placements" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "worker_workspace_pending_results" ADD FOREIGN KEY ("session_id") REFERENCES "worker_session_placements" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "worker_workspace_reconciliations" ADD FOREIGN KEY ("session_id") REFERENCES "worker_session_placements" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "workspace_generated_bootstrap_hashes" ADD FOREIGN KEY ("workspace_key") REFERENCES "workspace_setup_state" ("workspace_key") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`;return Object.defineProperty(this,"eagerSql",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get operatorRecoveryV25Sql(){let e=`-- Generated v24-to-v25 metadata-only transition; the engine owner publishes openclaw_schema_meta.
-- Subagent operator recovery requires the new reader; catalog and retained rows are unchanged.
UPDATE schema_meta SET schema_version = 25 WHERE meta_key = 'primary' AND schema_version = 24;
UPDATE config_machine_state SET value_json = '25' WHERE state_key = 'state.schema.contentVersion' AND value_json = '24';
`;return Object.defineProperty(this,"operatorRecoveryV25Sql",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get preWriteIndexesV27Sql(){let e={acp_replay_events:`CREATE INDEX "idx_acp_replay_events_session_seq" ON "acp_replay_events" (("session_id") ASC NULLS FIRST, ("seq") ASC NULLS FIRST);`,skill_usage:`CREATE INDEX "idx_skill_usage_key" ON "skill_usage" (("skill_key") ASC NULLS FIRST, ("skill_file") ASC NULLS FIRST);`,state_leases:`CREATE INDEX "idx_state_leases_owner" ON "state_leases" (("owner") ASC NULLS FIRST, ("updated_at") DESC NULLS LAST);`};return Object.defineProperty(this,"preWriteIndexesV27Sql",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get writeIndexesV27Sql(){let e=`
  DROP INDEX IF EXISTS idx_acp_replay_events_session_seq;
  DROP INDEX IF EXISTS idx_skill_usage_key;
  DROP INDEX IF EXISTS idx_state_leases_owner;

CREATE INDEX "idx_state_leases_owner" ON "state_leases" (("owner") ASC NULLS FIRST);`;return Object.defineProperty(this,"writeIndexesV27Sql",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get clientCredentialV29Sql(){let e=`-- Generated v28-to-v29 publication after the local credential owner has verified and retired source rows.
UPDATE schema_meta SET schema_version = 29 WHERE meta_key = 'primary' AND schema_version = 28;
`;return Object.defineProperty(this,"clientCredentialV29Sql",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get workspaceCasV35Sql(){let e=`-- Generated DDL-only v34-to-v35 transition; reconciliation converts retained rows online.
DO $workspace_cas$ BEGIN
IF to_regclass('local_workspace_projections') IS NOT NULL THEN
ALTER TABLE "local_workspace_projections" ADD COLUMN "tree_root_digest" bytea;
ALTER TABLE "local_workspace_projections" ADD COLUMN "source_paths_digest" bytea;
ALTER TABLE "local_workspace_projections" ADD COLUMN "canonical_fingerprints" bytea;
ALTER TABLE "local_workspace_projections" ADD COLUMN "projection_fingerprints" bytea;
CREATE TABLE "local_workspace_source_path_sets" (
  "path_digest" bytea NOT NULL,
  "paths_zstd" bytea NOT NULL,
  "sweep_epoch" bigint NOT NULL,
  PRIMARY KEY ("path_digest"),
  CHECK ((octet_length("path_digest") = 32))
);
CREATE TABLE "local_workspace_tree_packs" (
  "tree_digest" bytea NOT NULL,
  "records_json" text COLLATE "C" NOT NULL,
  "children_json" text COLLATE "C" NOT NULL,
  "sweep_epoch" bigint NOT NULL,
  PRIMARY KEY ("tree_digest"),
  CHECK ((octet_length("tree_digest") = 32))
);
END IF; END $workspace_cas$;
`;return Object.defineProperty(this,"workspaceCasV35Sql",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get clientCredentialSource(){let e={sql:`CREATE TABLE "device_auth_tokens" (
  "device_id" text COLLATE "C" NOT NULL,
  "role" text COLLATE "C" NOT NULL,
  "token" text COLLATE "C" NOT NULL,
  "scopes_json" text COLLATE "C" NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("device_id", "role")
);

CREATE TABLE "device_identities" (
  "identity_key" text COLLATE "C" NOT NULL,
  "device_id" text COLLATE "C" NOT NULL,
  "public_key_pem" text COLLATE "C" NOT NULL,
  "private_key_pem" text COLLATE "C" NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("identity_key")
);

CREATE TABLE "gateway_origin_device_tokens" (
  "gateway_scope" text COLLATE "C" NOT NULL,
  "device_id" text COLLATE "C" NOT NULL,
  "role" text COLLATE "C" NOT NULL,
  "token" text COLLATE "C" NOT NULL,
  "scopes_json" text COLLATE "C" NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("gateway_scope", "device_id", "role")
);

CREATE INDEX "idx_device_auth_tokens_updated" ON "device_auth_tokens" (("updated_at_ms") DESC NULLS LAST, ("device_id") ASC NULLS FIRST, ("role") ASC NULLS FIRST);

CREATE INDEX "idx_device_identities_device" ON "device_identities" (("device_id") ASC NULLS FIRST, ("updated_at_ms") DESC NULLS LAST);`,preData:[0,926],postData:[926,1225],tables:[{name:`device_auth_tokens`,identities:[]},{name:`device_identities`,identities:[]},{name:`gateway_origin_device_tokens`,identities:[]}],expectedCatalog:[{table:`device_auth_tokens`,kind:`table`,value:null},{table:`device_auth_tokens`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`device_auth_tokens`,kind:`column`,value:{name:`role`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`device_auth_tokens`,kind:`column`,value:{name:`token`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`device_auth_tokens`,kind:`column`,value:{name:`scopes_json`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`device_auth_tokens`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`device_auth_tokens`,kind:`primaryKey`,value:[`device_id`,`role`]},{table:`device_auth_tokens`,kind:`indexes`,value:2},{table:`device_auth_tokens`,kind:`checks`,value:0},{table:`device_identities`,kind:`table`,value:null},{table:`device_identities`,kind:`column`,value:{name:`identity_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`device_identities`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`device_identities`,kind:`column`,value:{name:`public_key_pem`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`device_identities`,kind:`column`,value:{name:`private_key_pem`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`device_identities`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`device_identities`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`device_identities`,kind:`primaryKey`,value:[`identity_key`]},{table:`device_identities`,kind:`indexes`,value:2},{table:`device_identities`,kind:`checks`,value:0},{table:`gateway_origin_device_tokens`,kind:`table`,value:null},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`gateway_scope`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`role`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`token`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`scopes_json`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`gateway_origin_device_tokens`,kind:`primaryKey`,value:[`gateway_scope`,`device_id`,`role`]},{table:`gateway_origin_device_tokens`,kind:`indexes`,value:1},{table:`gateway_origin_device_tokens`,kind:`checks`,value:0}]};return Object.defineProperty(this,"clientCredentialSource",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get fragments(){let e=[{id:`local_workspace_projections`,tables:[`local_workspace_projections`,`local_workspace_manifest_nodes`,`local_workspace_tree_packs`,`local_workspace_source_path_sets`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "local_workspace_manifest_nodes" (
  "worktree_id" text COLLATE "C" NOT NULL,
  "path" text COLLATE "C" NOT NULL,
  "node_json" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("worktree_id", "path")
);

CREATE TABLE "local_workspace_projections" (
  "worktree_id" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "lifecycle_revision" text COLLATE "C",
  "projection_path" text COLLATE "C" NOT NULL,
  "base_commit" text COLLATE "C" NOT NULL,
  "source_paths_json" text COLLATE "C" NOT NULL,
  "baseline_json" text COLLATE "C",
  "baseline_ref" text COLLATE "C",
  "pending_ref" text COLLATE "C",
  "pending_target" text COLLATE "C",
  "paused_runtimes_json" text COLLATE "C",
  "journal_json" text COLLATE "C",
  "journal_pack" bytea,
  "revision" bigint NOT NULL DEFAULT 0,
  "created_at_ms" bigint NOT NULL,
  "checkpoint_json" text COLLATE "C",
  "tree_root_digest" bytea,
  "source_paths_digest" bytea,
  "canonical_fingerprints" bytea,
  "projection_fingerprints" bytea,
  PRIMARY KEY ("worktree_id"),
  CHECK (("pending_target" IN ('canonical', 'projection'))),
  CHECK ("journal_pack" IS NULL OR (octet_length("journal_pack") <= 268435456)),
  CHECK (("revision" >= 0)),
  CHECK ("baseline_json" IS NULL OR "baseline_ref" IS NOT NULL),
  CHECK ((("journal_json" IS NULL) = ("journal_pack" IS NULL))),
  UNIQUE ("projection_path")
);

CREATE TABLE "local_workspace_source_path_sets" (
  "path_digest" bytea NOT NULL,
  "paths_zstd" bytea NOT NULL,
  "sweep_epoch" bigint NOT NULL,
  PRIMARY KEY ("path_digest"),
  CHECK ((octet_length("path_digest") = 32))
);

CREATE TABLE "local_workspace_tree_packs" (
  "tree_digest" bytea NOT NULL,
  "records_json" text COLLATE "C" NOT NULL,
  "children_json" text COLLATE "C" NOT NULL,
  "sweep_epoch" bigint NOT NULL,
  PRIMARY KEY ("tree_digest"),
  CHECK ((octet_length("tree_digest") = 32))
);

ALTER TABLE "local_workspace_manifest_nodes" ADD FOREIGN KEY ("worktree_id") REFERENCES "local_workspace_projections" ("worktree_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`user_profiles`,tables:[`user_profiles`,`user_profile_emails`,`user_profile_identities`],indexes:[`idx_user_profile_emails_profile_id`,`idx_user_profile_identities_profile_id`,`idx_user_profile_identities_authorization`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "user_profile_emails" (
  "email" text COLLATE "C" NOT NULL,
  "profile_id" text COLLATE "C" NOT NULL,
  "binding_id" text COLLATE "C",
  "created_at" bigint NOT NULL,
  PRIMARY KEY ("email")
);

CREATE TABLE "user_profile_identities" (
  "provider" text COLLATE "C" NOT NULL,
  "subject" text COLLATE "C" NOT NULL,
  "profile_id" text COLLATE "C" NOT NULL,
  "canonical_login" text COLLATE "C",
  "verified_email_json" text COLLATE "C",
  "created_at" bigint NOT NULL,
  "authorization_id" text COLLATE "C",
  "authorization_basis_json" text COLLATE "C",
  PRIMARY KEY ("provider", "subject")
);

CREATE TABLE "user_profiles" (
  "id" text COLLATE "C" NOT NULL,
  "display_name" text COLLATE "C",
  "primary_github_account_id" bigint,
  "avatar" bytea,
  "avatar_mime" text COLLATE "C",
  "avatar_sha256" text COLLATE "C",
  "merged_into" text COLLATE "C",
  "role" text COLLATE "C",
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX "idx_user_profile_emails_profile_id" ON "user_profile_emails" (("profile_id") ASC);

CREATE UNIQUE INDEX "idx_user_profile_identities_authorization" ON "user_profile_identities" (("authorization_id") ASC NULLS FIRST);

CREATE INDEX "idx_user_profile_identities_profile_id" ON "user_profile_identities" (("profile_id") ASC);
`},{id:`skill_library_entries`,tables:[`skill_library_entries`,`skill_library_revisions`,`skill_library_events`,`skill_library_uploads`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "skill_library_entries" (
  "skill_id" text COLLATE "C" NOT NULL,
  "owner_profile_id" text COLLATE "C",
  "author_profile_id" text COLLATE "C" NOT NULL,
  "slug" text COLLATE "C" NOT NULL,
  "current_revision" text COLLATE "C" NOT NULL,
  "shared" bigint NOT NULL,
  "enabled" bigint NOT NULL,
  "removed" bigint NOT NULL,
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("skill_id")
);

CREATE TABLE "skill_library_events" (
  "event_id" text COLLATE "C" NOT NULL,
  "skill_id" text COLLATE "C" NOT NULL,
  "revision" text COLLATE "C" NOT NULL,
  "action" text COLLATE "C" NOT NULL,
  "actor_profile_id" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  PRIMARY KEY ("event_id")
);

CREATE TABLE "skill_library_revisions" (
  "skill_id" text COLLATE "C" NOT NULL,
  "revision" text COLLATE "C" NOT NULL,
  "description" text COLLATE "C" NOT NULL,
  "files_json" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  PRIMARY KEY ("skill_id", "revision")
);

CREATE TABLE "skill_library_uploads" (
  "upload_id" text COLLATE "C" NOT NULL,
  "owner_profile_id" text COLLATE "C" NOT NULL,
  "slug" text COLLATE "C" NOT NULL,
  "size_bytes" bigint NOT NULL,
  "sha256" text COLLATE "C" NOT NULL,
  "archive_blob" bytea NOT NULL,
  "expires_at" bigint NOT NULL,
  "published_skill_id" text COLLATE "C",
  PRIMARY KEY ("upload_id")
);
`},{id:`operator_approval_standing_grants`,tables:[`operator_approval_standing_grants`,`operator_approval_standing_grant_generations`],indexes:[`idx_operator_approval_standing_grants_binding`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "operator_approval_standing_grant_generations" (
  "grant_id" text COLLATE "C" NOT NULL,
  "job_definition_generation" bigint NOT NULL,
  PRIMARY KEY ("grant_id"),
  CHECK (("job_definition_generation" >= 1))
);

CREATE TABLE "operator_approval_standing_grants" (
  "grant_id" text COLLATE "C" NOT NULL,
  "minted_by_approval_id" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "cron_job_id" text COLLATE "C" NOT NULL,
  "job_config_revision" text COLLATE "C" NOT NULL,
  "operation_binding" text COLLATE "C" NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "expires_at_ms" bigint,
  "revoked_at_ms" bigint,
  "revoked_by" text COLLATE "C",
  "last_used_at_ms" bigint,
  "use_count" bigint NOT NULL DEFAULT 0,
  PRIMARY KEY ("grant_id"),
  CHECK ((char_length("grant_id") > 0)),
  CHECK ((char_length("agent_id") > 0)),
  CHECK ((char_length("cron_job_id") > 0)),
  CHECK ((char_length("job_config_revision") > 0)),
  CHECK ((char_length("operation_binding") > 0)),
  CHECK ("expires_at_ms" IS NULL OR ("expires_at_ms" >= "created_at_ms"))
);

CREATE INDEX "idx_operator_approval_standing_grants_binding" ON "operator_approval_standing_grants" (("agent_id") ASC, ("cron_job_id") ASC, ("operation_binding") ASC, ("created_at_ms") DESC);

ALTER TABLE "operator_approval_standing_grant_generations" ADD FOREIGN KEY ("grant_id") REFERENCES "operator_approval_standing_grants" ("grant_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "operator_approval_standing_grants" ADD FOREIGN KEY ("minted_by_approval_id") REFERENCES "operator_approvals" ("approval_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`worker_environment_session_attachments`,tables:[`worker_environment_session_attachments`],indexes:[`worker_environment_session_attachments_session_key`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "worker_environment_session_attachments" (
  "session_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "session_lifecycle_revision" text COLLATE "C",
  "environment_id" text COLLATE "C" NOT NULL,
  "generation" bigint NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "last_used_at_ms" bigint NOT NULL,
  "closed_at_ms" bigint,
  PRIMARY KEY ("session_id"),
  CHECK (("generation" >= 1)),
  UNIQUE ("environment_id")
);

CREATE INDEX "worker_environment_session_attachments_session_key" ON "worker_environment_session_attachments" (("agent_id") ASC, ("session_key") ASC);

ALTER TABLE "worker_environment_session_attachments" ADD FOREIGN KEY ("environment_id") REFERENCES "worker_environments" ("environment_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`durable_background_processes`,tables:[`durable_background_processes`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "durable_background_processes" (
  "id" text COLLATE "C" NOT NULL,
  "record_json" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("id")
);
`},{id:`sandbox_persistent_execs`,tables:[`sandbox_persistent_execs`],indexes:[`idx_sandbox_persistent_execs_container`,`idx_sandbox_persistent_execs_container_name`,`idx_sandbox_persistent_execs_source`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "sandbox_persistent_execs" (
  "owner_key" text COLLATE "C" NOT NULL,
  "source_identity" text COLLATE "C" NOT NULL,
  "attempt_id" text COLLATE "C" NOT NULL,
  "owner_json" text COLLATE "C" NOT NULL,
  "backend_id" text COLLATE "C" NOT NULL,
  "backend_target_json" text COLLATE "C" NOT NULL,
  "workspace_binding_json" text COLLATE "C" NOT NULL,
  "container_id" text COLLATE "C" NOT NULL,
  "container_name" text COLLATE "C" NOT NULL,
  "container_started_at" text COLLATE "C" NOT NULL,
  "revision" bigint NOT NULL,
  "phase" text COLLATE "C" NOT NULL,
  "receipt_json" text COLLATE "C",
  "error" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("owner_key"),
  CHECK (("backend_id" = 'docker')),
  CHECK (("revision" > 0)),
  CHECK (("phase" IN ('reserved', 'prepared', 'running', 'stopping', 'uncertain', 'stopped'))),
  CHECK (("phase" NOT IN ('prepared', 'running')) OR "receipt_json" IS NOT NULL),
  UNIQUE ("attempt_id")
);

CREATE INDEX "idx_sandbox_persistent_execs_container" ON "sandbox_persistent_execs" (("container_id") ASC, ("owner_key") ASC);

CREATE INDEX "idx_sandbox_persistent_execs_container_name" ON "sandbox_persistent_execs" (("container_name") ASC, ("owner_key") ASC);

CREATE INDEX "idx_sandbox_persistent_execs_source" ON "sandbox_persistent_execs" (("source_identity") ASC, ("owner_key") ASC);
`},{id:`user_background_images`,tables:[`user_background_images`],indexes:[],dependencies:[`user_profiles`],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "user_background_images" (
  "profile_id" text COLLATE "C" NOT NULL,
  "asset_id" text COLLATE "C" NOT NULL,
  "image" bytea NOT NULL,
  "width" bigint NOT NULL,
  "height" bigint NOT NULL,
  PRIMARY KEY ("profile_id"),
  CHECK ((octet_length("image") BETWEEN 1 AND 2097152)),
  CHECK (("width" BETWEEN 1 AND 2560)),
  CHECK (("height" BETWEEN 1 AND 2560)),
  UNIQUE ("asset_id")
);

ALTER TABLE "user_background_images" ADD FOREIGN KEY ("profile_id") REFERENCES "user_profiles" ("id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`update_runs`,tables:[`update_runs`],indexes:[`idx_update_runs_created`,`idx_update_runs_active`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "update_runs" (
  "run_id" text COLLATE "C" NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "trigger" text COLLATE "C" NOT NULL,
  "phase" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "reason" text COLLATE "C",
  "origin_json" text COLLATE "C" NOT NULL,
  "target_json" text COLLATE "C" NOT NULL,
  "before_json" text COLLATE "C" NOT NULL,
  "after_json" text COLLATE "C" NOT NULL,
  "steps_json" text COLLATE "C" NOT NULL,
  "verification_json" text COLLATE "C" NOT NULL,
  "repair_json" text COLLATE "C" NOT NULL,
  "confirmed_at_ms" bigint,
  "finished_at_ms" bigint,
  "downtime_ms" bigint,
  PRIMARY KEY ("run_id"),
  CHECK (("trigger" IN ('chat', 'control-ui', 'cli', 'campaign', 'mac-app', 'api'))),
  CHECK (("phase" IN ('requested', 'staging', 'validating', 'repairing', 'activating', 'restarting', 'verifying', 'finished'))),
  CHECK (("status" IN ('running', 'succeeded', 'failed', 'rolled-back', 'skipped'))),
  CHECK ((octet_length(convert_to("origin_json", 'UTF8')) <= 16384)),
  CHECK ((octet_length(convert_to("target_json", 'UTF8')) <= 16384)),
  CHECK ((octet_length(convert_to("before_json", 'UTF8')) <= 16384)),
  CHECK ((octet_length(convert_to("after_json", 'UTF8')) <= 16384)),
  CHECK ((octet_length(convert_to("steps_json", 'UTF8')) <= 16384)),
  CHECK ((octet_length(convert_to("verification_json", 'UTF8')) <= 16384)),
  CHECK ((octet_length(convert_to("repair_json", 'UTF8')) <= 16384)),
  CHECK ((("status" = 'running') AND ("phase" != 'finished') AND "finished_at_ms" IS NULL) OR (("status" != 'running') AND ("phase" = 'finished') AND "finished_at_ms" IS NOT NULL))
);

CREATE INDEX "idx_update_runs_active" ON "update_runs" (("status") ASC, ("created_at_ms") DESC, ("run_id") ASC);

CREATE INDEX "idx_update_runs_created" ON "update_runs" (("created_at_ms") DESC, ("run_id") ASC);
`},{id:`session_repository_workspaces`,tables:[`session_repository_workspaces`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "session_repository_workspaces" (
  "workspace_id" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "url" text COLLATE "C" NOT NULL,
  "requested_ref" text COLLATE "C",
  "run_setup_script" bigint NOT NULL DEFAULT 0,
  "base_commit" text COLLATE "C",
  "base_manifest_hash" text COLLATE "C",
  "branch" text COLLATE "C" NOT NULL,
  "checkpoint_ref" text COLLATE "C",
  "manifest_hash" text COLLATE "C",
  "revision" bigint NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "disk_authority_json" text COLLATE "C",
  PRIMARY KEY ("workspace_id"),
  CHECK ((char_length("workspace_id") = 36)),
  CHECK ((char_length("agent_id") BETWEEN 1 AND 128)),
  CHECK ((char_length("session_key") BETWEEN 1 AND 1024)),
  CHECK ((char_length("url") BETWEEN 1 AND 4096)),
  CHECK ("requested_ref" IS NULL OR (char_length("requested_ref") BETWEEN 1 AND 1024)),
  CHECK (("run_setup_script" IN (0, 1))),
  CHECK ("base_commit" IS NULL OR (char_length("base_commit") IN (40, 64))),
  CHECK ((char_length("branch") BETWEEN 1 AND 256)),
  CHECK (("revision" >= 0)),
  CHECK ("base_manifest_hash" IS NULL OR "base_commit" IS NOT NULL),
  CHECK (("checkpoint_ref" IS NULL AND "manifest_hash" IS NULL) OR ("checkpoint_ref" IS NOT NULL AND "manifest_hash" IS NOT NULL AND "base_manifest_hash" IS NOT NULL)),
  UNIQUE ("agent_id", "session_key")
);
`},{id:`github_repository_publication_requests`,tables:[`github_repository_publication_requests`],indexes:[`idx_github_repository_publication_shared_request`,`idx_github_repository_publication_personal_request`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "github_repository_publication_requests" (
  "request_id" text COLLATE "C" NOT NULL,
  "owner_profile_id" text COLLATE "C",
  "connection_generation" text COLLATE "C",
  "idempotency_key" text COLLATE "C" NOT NULL,
  "request_digest" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "session_lifecycle_revision" text COLLATE "C",
  "requester_authority_json" text COLLATE "C",
  "session_key" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "workspace_id" text COLLATE "C" NOT NULL,
  "checkpoint_ref" text COLLATE "C",
  "checkpoint_digest" text COLLATE "C",
  "claim_id" text COLLATE "C",
  "run_id" text COLLATE "C",
  "environment_id" text COLLATE "C",
  "owner_epoch" bigint,
  "placement_generation" bigint,
  "identity_source" text COLLATE "C" NOT NULL,
  "identity_profile_id" text COLLATE "C",
  "identity_account_id" bigint NOT NULL,
  "identity_login" text COLLATE "C" NOT NULL,
  "title" text COLLATE "C",
  "body" text COLLATE "C",
  "status" text COLLATE "C" NOT NULL,
  "gateway_instance_id" text COLLATE "C",
  "execution_id" text COLLATE "C",
  "last_effect" text COLLATE "C",
  "effect_state" text COLLATE "C",
  "push_repository" text COLLATE "C",
  "repository" text COLLATE "C",
  "branch" text COLLATE "C" NOT NULL,
  "base_branch" text COLLATE "C",
  "source_head_commit" text COLLATE "C",
  "source_index_tree" text COLLATE "C",
  "workspace_tree" text COLLATE "C",
  "previous_head_commit" text COLLATE "C",
  "pushed_head_commit" text COLLATE "C",
  "head_commit" text COLLATE "C",
  "pull_request_url" text COLLATE "C",
  "error_code" text COLLATE "C",
  "next_action" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "reported_at_ms" bigint,
  "draft" bigint,
  PRIMARY KEY ("request_id"),
  CHECK (("identity_source" IN ('system-detected', 'system-configured', 'agent-override', 'personal'))),
  CHECK (("status" IN ('requested', 'publishing', 'needs_confirmation', 'published', 'failed'))),
  CHECK (("last_effect" IN ('push', 'pull_request'))),
  CHECK (("effect_state" IN ('dispatched', 'observed'))),
  CHECK ((("identity_source" = 'personal') AND "owner_profile_id" IS NOT NULL AND "connection_generation" IS NOT NULL) OR (("identity_source" <> 'personal') AND "owner_profile_id" IS NULL AND "connection_generation" IS NULL)),
  CHECK (("checkpoint_ref" IS NULL AND "checkpoint_digest" IS NULL) OR ("checkpoint_ref" IS NOT NULL AND "checkpoint_digest" IS NOT NULL)),
  CHECK (("last_effect" IS NULL AND "effect_state" IS NULL) OR ("last_effect" IS NOT NULL AND "effect_state" IS NOT NULL))
);

CREATE UNIQUE INDEX "idx_github_repository_publication_personal_request" ON "github_repository_publication_requests" (("owner_profile_id") ASC, ("session_id") ASC, ("idempotency_key") ASC) WHERE "owner_profile_id" IS NOT NULL;

CREATE UNIQUE INDEX "idx_github_repository_publication_shared_request" ON "github_repository_publication_requests" (("session_id") ASC, ("idempotency_key") ASC) WHERE "owner_profile_id" IS NULL;
`},{id:`github_publication_session_lifecycles`,tables:[`github_publication_session_lifecycles`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "github_publication_session_lifecycles" (
  "publication_kind" text COLLATE "C" NOT NULL,
  "request_id" text COLLATE "C" NOT NULL,
  "lifecycle_revision" text COLLATE "C",
  "requester_authority_json" text COLLATE "C",
  PRIMARY KEY ("publication_kind", "request_id"),
  CHECK (("publication_kind" IN ('shared', 'personal')))
);
`},{id:`github_personal_publication_requests`,tables:[`github_personal_publication_requests`],indexes:[`idx_github_personal_publication_owner_session`,`idx_github_personal_publication_pending`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "github_personal_publication_requests" (
  "request_id" text COLLATE "C" NOT NULL,
  "owner_profile_id" text COLLATE "C" NOT NULL,
  "connection_generation" text COLLATE "C" NOT NULL,
  "idempotency_key" text COLLATE "C" NOT NULL,
  "request_digest" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "worktree_id" text COLLATE "C" NOT NULL,
  "repository_fingerprint" text COLLATE "C" NOT NULL,
  "identity_source" text COLLATE "C" NOT NULL,
  "identity_profile_id" text COLLATE "C" NOT NULL,
  "identity_account_id" bigint NOT NULL,
  "identity_login" text COLLATE "C" NOT NULL,
  "title" text COLLATE "C",
  "body" text COLLATE "C",
  "status" text COLLATE "C" NOT NULL,
  "gateway_instance_id" text COLLATE "C",
  "execution_id" text COLLATE "C",
  "last_effect" text COLLATE "C",
  "effect_state" text COLLATE "C",
  "push_repository" text COLLATE "C" NOT NULL,
  "repository" text COLLATE "C" NOT NULL,
  "branch" text COLLATE "C" NOT NULL,
  "base_branch" text COLLATE "C" NOT NULL,
  "source_head_commit" text COLLATE "C" NOT NULL,
  "source_index_tree" text COLLATE "C" NOT NULL,
  "workspace_tree" text COLLATE "C" NOT NULL,
  "head_commit" text COLLATE "C",
  "pull_request_url" text COLLATE "C",
  "error_code" text COLLATE "C",
  "next_action" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "reported_at_ms" bigint,
  "draft" bigint,
  PRIMARY KEY ("request_id"),
  CHECK ((char_length("request_id") = 36)),
  CHECK ((char_length("owner_profile_id") BETWEEN 1 AND 128)),
  CHECK ((char_length("connection_generation") = 36)),
  CHECK ((char_length("idempotency_key") BETWEEN 1 AND 128)),
  CHECK ((char_length("request_digest") = 64)),
  CHECK ((char_length("session_id") BETWEEN 1 AND 128)),
  CHECK ((char_length("session_key") BETWEEN 1 AND 1024)),
  CHECK ((char_length("agent_id") BETWEEN 1 AND 128)),
  CHECK ((char_length("worktree_id") BETWEEN 1 AND 128)),
  CHECK ((char_length("repository_fingerprint") BETWEEN 1 AND 256)),
  CHECK (("identity_source" = 'personal')),
  CHECK ((char_length("identity_profile_id") = 36)),
  CHECK (("identity_account_id" >= 1)),
  CHECK ((char_length("identity_login") BETWEEN 1 AND 39)),
  CHECK ("title" IS NULL OR (char_length("title") BETWEEN 1 AND 256)),
  CHECK ("body" IS NULL OR (char_length("body") BETWEEN 1 AND 8192)),
  CHECK (("status" IN ('requested', 'publishing', 'needs_confirmation', 'published', 'failed'))),
  CHECK ("gateway_instance_id" IS NULL OR (char_length("gateway_instance_id") BETWEEN 1 AND 128)),
  CHECK ("execution_id" IS NULL OR (char_length("execution_id") = 36)),
  CHECK ("last_effect" IS NULL OR ("last_effect" IN ('push', 'pull_request'))),
  CHECK ("effect_state" IS NULL OR ("effect_state" IN ('dispatched', 'observed'))),
  CHECK ((char_length("push_repository") BETWEEN 3 AND 256)),
  CHECK ((char_length("repository") BETWEEN 3 AND 256)),
  CHECK ((char_length("branch") BETWEEN 1 AND 256)),
  CHECK ((char_length("base_branch") BETWEEN 1 AND 256)),
  CHECK ((char_length("source_head_commit") IN (40, 64))),
  CHECK ((char_length("source_index_tree") IN (40, 64))),
  CHECK ((char_length("workspace_tree") IN (40, 64))),
  CHECK ("head_commit" IS NULL OR (char_length("head_commit") IN (40, 64))),
  CHECK ("pull_request_url" IS NULL OR (char_length("pull_request_url") BETWEEN 1 AND 2048)),
  CHECK ("error_code" IS NULL OR (char_length("error_code") BETWEEN 1 AND 64)),
  CHECK ("next_action" IS NULL OR (char_length("next_action") BETWEEN 1 AND 1024)),
  CHECK (("created_at_ms" >= 0)),
  CHECK (("updated_at_ms" >= "created_at_ms")),
  CHECK ((("status" = 'publishing') AND "gateway_instance_id" IS NOT NULL AND "execution_id" IS NOT NULL) OR ("status" <> 'publishing')),
  CHECK (("last_effect" IS NULL AND "effect_state" IS NULL) OR ("last_effect" IS NOT NULL AND "effect_state" IS NOT NULL)),
  CHECK ((("status" = 'published') AND "pull_request_url" IS NOT NULL AND "head_commit" IS NOT NULL AND "error_code" IS NULL AND "next_action" IS NULL) OR (("status" = 'failed') AND "error_code" IS NOT NULL AND "next_action" IS NOT NULL) OR (("status" IN ('requested', 'publishing', 'needs_confirmation')) AND "error_code" IS NULL AND "next_action" IS NULL)),
  UNIQUE ("owner_profile_id", "session_id", "idempotency_key")
);

CREATE INDEX "idx_github_personal_publication_owner_session" ON "github_personal_publication_requests" (("owner_profile_id") ASC, ("session_id") ASC, ("created_at_ms") ASC);

CREATE INDEX "idx_github_personal_publication_pending" ON "github_personal_publication_requests" (("status") ASC, ("updated_at_ms") ASC, ("request_id") ASC);
`},{id:`cron_job_runtime_authorities`,tables:[`cron_job_runtime_authorities`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "cron_job_runtime_authorities" (
  "store_key" text COLLATE "C" NOT NULL,
  "job_id" text COLLATE "C" NOT NULL,
  "authority_json" text COLLATE "C",
  "authority_input_fingerprint" text COLLATE "C",
  "recovery_required" bigint NOT NULL,
  PRIMARY KEY ("store_key", "job_id"),
  CHECK (("recovery_required" IN (0, 1))),
  CHECK ((("recovery_required" = 0) AND "authority_json" IS NOT NULL AND "authority_input_fingerprint" IS NOT NULL) OR (("recovery_required" = 1) AND "authority_json" IS NULL AND "authority_input_fingerprint" IS NULL))
);

ALTER TABLE "cron_job_runtime_authorities" ADD FOREIGN KEY ("store_key", "job_id") REFERENCES "cron_jobs" ("store_key", "job_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`cron_run_trigger_state_retirements`,tables:[`cron_run_trigger_state_retirements`],indexes:[],dependencies:[`cron_run_receipts`],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "cron_run_trigger_state_retirements" (
  "receipt_id" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("receipt_id")
);

ALTER TABLE "cron_run_trigger_state_retirements" ADD FOREIGN KEY ("receipt_id") REFERENCES "cron_run_receipts" ("receipt_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`execution_identity_contexts`,tables:[`execution_identity_contexts`],indexes:[`execution_identity_contexts_run_created_idx`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "execution_identity_contexts" (
  "context_id" text COLLATE "C" NOT NULL,
  "execution_id" text COLLATE "C" NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  "coverage_state" text COLLATE "C" NOT NULL,
  "context_bytes" bigint NOT NULL,
  "context_json" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("context_id"),
  CHECK ((char_length("context_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("execution_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("run_id") BETWEEN 1 AND 256)),
  CHECK (("created_at" >= 0)),
  CHECK (("coverage_state" IN ('attribution-only', 'unattributed', 'unknown', 'unsupported'))),
  CHECK (("context_bytes" BETWEEN 1 AND 16384)),
  CHECK ((char_length("context_json") > 0)),
  UNIQUE ("execution_id"),
  UNIQUE ("created_at", "context_id")
);

CREATE INDEX "execution_identity_contexts_run_created_idx" ON "execution_identity_contexts" (("run_id") ASC, ("created_at") ASC, ("execution_id") ASC);
`},{id:`mcp_oauth_pending_authorizations`,tables:[`mcp_oauth_pending_authorizations`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "mcp_oauth_pending_authorizations" (
  "state" text COLLATE "C" NOT NULL,
  "store_key" text COLLATE "C" NOT NULL,
  "create_time" bigint NOT NULL,
  PRIMARY KEY ("state")
);
`},{id:`node_worker_launch_containers`,tables:[`node_worker_launch_containers`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "node_worker_launch_containers" (
  "launch_id" text COLLATE "C" NOT NULL,
  "container_json" text COLLATE "C",
  PRIMARY KEY ("launch_id")
);
`},{id:`node_worker_launch_boots`,tables:[`node_worker_launch_boots`],indexes:[],dependencies:[`node_worker_launches`],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "node_worker_launch_boots" (
  "launch_id" text COLLATE "C" NOT NULL,
  "boot_id" text COLLATE "C",
  PRIMARY KEY ("launch_id"),
  CHECK ("boot_id" IS NULL OR (char_length("boot_id") BETWEEN 1 AND 128))
);

ALTER TABLE "node_worker_launch_boots" ADD FOREIGN KEY ("launch_id") REFERENCES "node_worker_launches" ("launch_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`node_worker_launch_cleanup`,tables:[`node_worker_launch_cleanup`],indexes:[],dependencies:[`node_worker_launches`],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "node_worker_launch_cleanup" (
  "launch_id" text COLLATE "C" NOT NULL,
  "cleanup_mode" text COLLATE "C" NOT NULL,
  "lineage_settled" bigint,
  PRIMARY KEY ("launch_id"),
  CHECK (("cleanup_mode" IN ('process-group', 'owned-anchor'))),
  CHECK ("lineage_settled" IS NULL OR ("lineage_settled" = 1))
);

ALTER TABLE "node_worker_launch_cleanup" ADD FOREIGN KEY ("launch_id") REFERENCES "node_worker_launches" ("launch_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`node_worker_launch_process_scopes`,tables:[`node_worker_launch_process_scopes`],indexes:[],dependencies:[`node_worker_launches`],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "node_worker_launch_process_scopes" (
  "launch_id" text COLLATE "C" NOT NULL,
  "scope_kind" text COLLATE "C" NOT NULL,
  "descendants_reaped" bigint,
  PRIMARY KEY ("launch_id"),
  CHECK (("scope_kind" = 'linux-subreaper')),
  CHECK ("descendants_reaped" IS NULL OR ("descendants_reaped" = 1))
);

ALTER TABLE "node_worker_launch_process_scopes" ADD FOREIGN KEY ("launch_id") REFERENCES "node_worker_launches" ("launch_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`node_worker_launches`,tables:[`node_worker_launches`],indexes:[`idx_node_worker_launches_terminal_completed`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "node_worker_launches" (
  "launch_id" text COLLATE "C" NOT NULL,
  "plan_hash" text COLLATE "C" NOT NULL,
  "gateway_namespace" text COLLATE "C" NOT NULL,
  "environment_id" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "owner_epoch" bigint NOT NULL,
  "placement_generation" bigint NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "state" text COLLATE "C" NOT NULL,
  "supervisor_pid" bigint NOT NULL,
  "supervisor_start_time" bigint NOT NULL,
  "worker_pid" bigint,
  "worker_start_time" bigint,
  "result_json" text COLLATE "C",
  "error_text" text COLLATE "C",
  "completed_at_ms" bigint,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("launch_id"),
  CHECK ((char_length("launch_id") BETWEEN 1 AND 256) AND ("launch_id" IS NOT NULL OR NULL)),
  CHECK ((char_length("plan_hash") = 64) AND ("plan_hash" COLLATE "C" !~ '\\A.*[^0-9a-f].*\\Z')),
  CHECK ((char_length("gateway_namespace") BETWEEN 1 AND 128) AND ("gateway_namespace" COLLATE "C" !~ '\\A.*[^A-Za-z0-9._-].*\\Z') AND ("gateway_namespace" COLLATE "C" ~ '\\A[A-Za-z0-9].*\\Z')),
  CHECK ((char_length("environment_id") BETWEEN 1 AND 256) AND ("environment_id" IS NOT NULL OR NULL)),
  CHECK ((char_length("session_id") BETWEEN 1 AND 256) AND ("session_id" IS NOT NULL OR NULL)),
  CHECK (("owner_epoch" BETWEEN 1 AND 9007199254740991)),
  CHECK (("placement_generation" BETWEEN 0 AND 9007199254740991)),
  CHECK ((char_length("run_id") BETWEEN 1 AND 256) AND ("run_id" IS NOT NULL OR NULL)),
  CHECK (("state" IN ('pending', 'running', 'completed', 'failed', 'interrupted', 'cancelled'))),
  CHECK (("supervisor_pid" BETWEEN 1 AND 2147483647)),
  CHECK (("supervisor_start_time" BETWEEN 0 AND 9007199254740991)),
  CHECK ("worker_pid" IS NULL OR ("worker_pid" BETWEEN 1 AND 2147483647)),
  CHECK ("worker_start_time" IS NULL OR ("worker_start_time" BETWEEN 0 AND 9007199254740991)),
  CHECK ("result_json" IS NULL OR ((octet_length(convert_to("result_json", 'UTF8')) BETWEEN 1 AND 65536) AND ("result_json" IS NOT NULL OR NULL) AND ("result_json" IS JSON))),
  CHECK ("error_text" IS NULL OR ((octet_length(convert_to("error_text", 'UTF8')) BETWEEN 1 AND 4096) AND ("error_text" IS NOT NULL OR NULL) AND (strpos("error_text", '
') = 0) AND (strpos("error_text", '\r') = 0))),
  CHECK ("completed_at_ms" IS NULL OR ("completed_at_ms" BETWEEN 0 AND 9007199254740991)),
  CHECK (("created_at_ms" BETWEEN 0 AND 9007199254740991)),
  CHECK (("updated_at_ms" BETWEEN "created_at_ms" AND 9007199254740991)),
  CHECK ((("worker_pid" IS NULL) = ("worker_start_time" IS NULL))),
  CHECK ((("state" = 'pending') AND "worker_pid" IS NULL AND "result_json" IS NULL AND "error_text" IS NULL AND "completed_at_ms" IS NULL) OR (("state" = 'running') AND "worker_pid" IS NOT NULL AND "result_json" IS NULL AND "error_text" IS NULL AND "completed_at_ms" IS NULL) OR (("state" = 'completed') AND "result_json" IS NOT NULL AND "error_text" IS NULL AND ("completed_at_ms" BETWEEN "created_at_ms" AND "updated_at_ms")) OR (("state" IN ('failed', 'interrupted', 'cancelled')) AND "result_json" IS NULL AND "error_text" IS NOT NULL AND ("completed_at_ms" BETWEEN "created_at_ms" AND "updated_at_ms")))
);

CREATE INDEX "idx_node_worker_launches_terminal_completed" ON "node_worker_launches" (("completed_at_ms") ASC, ("launch_id") ASC) WHERE "completed_at_ms" IS NOT NULL;
`},{id:`node_worker_prepared_workspaces`,tables:[`node_worker_prepared_workspaces`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "node_worker_prepared_workspaces" (
  "preparation_key" text COLLATE "C" NOT NULL,
  "cache_key" text COLLATE "C" NOT NULL,
  "gateway_namespace" text COLLATE "C" NOT NULL,
  "workspace_dir" text COLLATE "C" NOT NULL,
  "home_dir" text COLLATE "C" NOT NULL,
  "source_manifest_ref" text COLLATE "C" NOT NULL,
  "prepared_manifest_ref" text COLLATE "C" NOT NULL,
  "state" text COLLATE "C" NOT NULL,
  "environment_id" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C",
  "session_key" text COLLATE "C",
  "owner_epoch" bigint,
  "created_at_ms" bigint NOT NULL,
  "bound_at_ms" bigint,
  "retired_at_ms" bigint,
  PRIMARY KEY ("preparation_key"),
  CHECK ((char_length("preparation_key") = 64) AND ("preparation_key" COLLATE "C" !~ '\\A.*[^0-9a-f].*\\Z')),
  CHECK ((char_length("cache_key") = 64) AND ("cache_key" COLLATE "C" !~ '\\A.*[^0-9a-f].*\\Z')),
  CHECK ((char_length("gateway_namespace") > 0)),
  CHECK ((char_length("workspace_dir") > 0)),
  CHECK ((char_length("home_dir") > 0)),
  CHECK ((char_length("source_manifest_ref") = 71) AND (substr("source_manifest_ref", 1, 7) = 'sha256:') AND (substr("source_manifest_ref", 8) COLLATE "C" !~ '\\A.*[^0-9a-f].*\\Z')),
  CHECK ((char_length("prepared_manifest_ref") = 71) AND (substr("prepared_manifest_ref", 1, 7) = 'sha256:') AND (substr("prepared_manifest_ref", 8) COLLATE "C" !~ '\\A.*[^0-9a-f].*\\Z')),
  CHECK (("state" IN ('available', 'bound', 'retiring', 'retired'))),
  CHECK ((char_length("environment_id") > 0)),
  CHECK (("owner_epoch" BETWEEN 1 AND 9007199254740991)),
  CHECK (("created_at_ms" BETWEEN 0 AND 9007199254740991)),
  CHECK (("bound_at_ms" BETWEEN "created_at_ms" AND 9007199254740991)),
  CHECK (("retired_at_ms" BETWEEN coalesce("bound_at_ms", "created_at_ms") AND 9007199254740991)),
  CHECK (("session_id" IS NULL AND "session_key" IS NULL AND "owner_epoch" IS NULL AND "bound_at_ms" IS NULL) OR ("session_id" IS NOT NULL AND (char_length("session_id") > 0) AND "session_key" IS NOT NULL AND (char_length("session_key") > 0) AND "owner_epoch" IS NOT NULL AND "bound_at_ms" IS NOT NULL)),
  CHECK ((("state" = 'available') AND "bound_at_ms" IS NULL AND "retired_at_ms" IS NULL) OR (("state" = 'bound') AND "bound_at_ms" IS NOT NULL AND "retired_at_ms" IS NULL) OR (("state" = 'retiring') AND "retired_at_ms" IS NULL) OR (("state" = 'retired') AND "retired_at_ms" IS NOT NULL)),
  UNIQUE ("workspace_dir")
);
`},{id:`node_worker_turns`,tables:[`node_worker_turns`],indexes:[`idx_node_worker_turns_terminal_completed`,`idx_node_worker_turns_active_owner`],dependencies:[`node_worker_launches`],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "node_worker_turns" (
  "turn_id" text COLLATE "C" NOT NULL,
  "owner_launch_id" text COLLATE "C" NOT NULL,
  "plan_hash" text COLLATE "C" NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "state" text COLLATE "C" NOT NULL,
  "result_json" text COLLATE "C",
  "error_text" text COLLATE "C",
  "completed_at_ms" bigint,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("turn_id"),
  CHECK ((char_length("turn_id") BETWEEN 1 AND 256) AND ("turn_id" IS NOT NULL OR NULL)),
  CHECK ((char_length("plan_hash") = 64) AND ("plan_hash" COLLATE "C" !~ '\\A.*[^0-9a-f].*\\Z')),
  CHECK ((char_length("run_id") BETWEEN 1 AND 256) AND ("run_id" IS NOT NULL OR NULL)),
  CHECK (("state" IN ('running', 'completed', 'failed', 'interrupted', 'cancelled'))),
  CHECK ("result_json" IS NULL OR ((octet_length(convert_to("result_json", 'UTF8')) BETWEEN 1 AND 65536) AND ("result_json" IS NOT NULL OR NULL) AND ("result_json" IS JSON))),
  CHECK ("error_text" IS NULL OR ((octet_length(convert_to("error_text", 'UTF8')) BETWEEN 1 AND 4096) AND ("error_text" IS NOT NULL OR NULL) AND (strpos("error_text", '
') = 0) AND (strpos("error_text", '\r') = 0))),
  CHECK ("completed_at_ms" IS NULL OR ("completed_at_ms" BETWEEN 0 AND 9007199254740991)),
  CHECK (("created_at_ms" BETWEEN 0 AND 9007199254740991)),
  CHECK (("updated_at_ms" BETWEEN "created_at_ms" AND 9007199254740991)),
  CHECK ((("state" = 'running') AND "result_json" IS NULL AND "error_text" IS NULL AND "completed_at_ms" IS NULL) OR (("state" = 'completed') AND "result_json" IS NOT NULL AND "error_text" IS NULL AND ("completed_at_ms" BETWEEN "created_at_ms" AND "updated_at_ms")) OR (("state" IN ('failed', 'interrupted', 'cancelled')) AND "result_json" IS NULL AND "error_text" IS NOT NULL AND ("completed_at_ms" BETWEEN "created_at_ms" AND "updated_at_ms")))
);

CREATE UNIQUE INDEX "idx_node_worker_turns_active_owner" ON "node_worker_turns" (("owner_launch_id") ASC) WHERE ("state" = 'running');

CREATE INDEX "idx_node_worker_turns_terminal_completed" ON "node_worker_turns" (("completed_at_ms") ASC, ("turn_id") ASC) WHERE "completed_at_ms" IS NOT NULL;

ALTER TABLE "node_worker_turns" ADD FOREIGN KEY ("owner_launch_id") REFERENCES "node_worker_launches" ("launch_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`operator_approval_execution_identities`,tables:[`operator_approval_execution_identities`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "operator_approval_execution_identities" (
  "approval_id" text COLLATE "C" NOT NULL,
  "source_context_id" text COLLATE "C" NOT NULL,
  "source_execution_id" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("approval_id"),
  CHECK ((char_length("source_context_id") BETWEEN 1 AND 256) AND ("source_context_id" = btrim("source_context_id"))),
  CHECK ((char_length("source_execution_id") BETWEEN 1 AND 256) AND ("source_execution_id" = btrim("source_execution_id")))
);

ALTER TABLE "operator_approval_execution_identities" ADD FOREIGN KEY ("approval_id") REFERENCES "operator_approvals" ("approval_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`web_push_approval_deliveries`,tables:[`web_push_approval_deliveries`],indexes:[`idx_web_push_approval_deliveries_subscription`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "web_push_approval_deliveries" (
  "approval_id" text COLLATE "C" NOT NULL,
  "subscription_id" text COLLATE "C" NOT NULL,
  "device_id" text COLLATE "C" NOT NULL,
  "user_profile_id" text COLLATE "C",
  "prepared_at_ms" bigint NOT NULL,
  PRIMARY KEY ("approval_id", "subscription_id")
);

CREATE INDEX "idx_web_push_approval_deliveries_subscription" ON "web_push_approval_deliveries" (("subscription_id") ASC, ("approval_id") ASC);

ALTER TABLE "web_push_approval_deliveries" ADD FOREIGN KEY ("subscription_id") REFERENCES "web_push_subscriptions" ("subscription_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "web_push_approval_deliveries" ADD FOREIGN KEY ("approval_id") REFERENCES "operator_approvals" ("approval_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`execution_decision_facts`,tables:[`execution_decision_facts`],indexes:[`execution_decision_facts_cursor_id_idx`,`execution_decision_facts_context_occurred_idx`,`execution_decision_facts_run_occurred_idx`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "execution_decision_facts" (
  "cursor_id" bigint NOT NULL,
  "receipt_id" text COLLATE "C" NOT NULL,
  "context_id" text COLLATE "C" NOT NULL,
  "execution_id" text COLLATE "C" NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "action_id" text COLLATE "C",
  "action_family" text COLLATE "C" NOT NULL,
  "decision_outcome" text COLLATE "C" NOT NULL,
  "coverage_state" text COLLATE "C" NOT NULL,
  "reason_code" text COLLATE "C" NOT NULL,
  "owner" text COLLATE "C" NOT NULL,
  "source_ref" text COLLATE "C" NOT NULL,
  "occurred_at" bigint NOT NULL,
  "receipt_bytes" bigint NOT NULL,
  "receipt_json" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("receipt_id"),
  CHECK ((char_length("receipt_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("context_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("execution_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("run_id") BETWEEN 1 AND 256)),
  CHECK ("action_id" IS NULL OR (char_length("action_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("action_family") BETWEEN 1 AND 256)),
  CHECK (("decision_outcome" IN ('allowed', 'denied', 'not-applicable', 'unknown'))),
  CHECK (("coverage_state" IN ('enforced', 'attribution-only', 'unattributed', 'unknown', 'unsupported'))),
  CHECK ((char_length("reason_code") BETWEEN 1 AND 256)),
  CHECK ((char_length("owner") BETWEEN 1 AND 256)),
  CHECK ((char_length("source_ref") BETWEEN 1 AND 256)),
  CHECK (("occurred_at" >= 0)),
  CHECK (("receipt_bytes" BETWEEN 1 AND 16384)),
  CHECK ((char_length("receipt_json") > 0)),
  UNIQUE ("occurred_at", "receipt_id")
);

CREATE INDEX "execution_decision_facts_context_occurred_idx" ON "execution_decision_facts" (("context_id") ASC, ("occurred_at") ASC, ("receipt_id") ASC);

CREATE UNIQUE INDEX "execution_decision_facts_cursor_id_idx" ON "execution_decision_facts" (("cursor_id") ASC);

CREATE INDEX "execution_decision_facts_run_occurred_idx" ON "execution_decision_facts" (("run_id") ASC, ("occurred_at") ASC, ("receipt_id") ASC);
`},{id:`execution_owner_lifecycle_bindings`,tables:[`execution_owner_lifecycle_bindings`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "execution_owner_lifecycle_bindings" (
  "owner_kind" text COLLATE "C" NOT NULL,
  "owner_id" text COLLATE "C" NOT NULL,
  "context_id" text COLLATE "C" NOT NULL,
  "execution_id" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("owner_kind", "owner_id")
);
`},{id:`outbound_message_execution_bindings`,tables:[`outbound_message_execution_bindings`],indexes:[`outbound_message_execution_bindings_execution_event_idx`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "outbound_message_execution_bindings" (
  "event_id" text COLLATE "C" NOT NULL,
  "context_id" text COLLATE "C" NOT NULL,
  "execution_id" text COLLATE "C" NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("event_id"),
  CHECK ((char_length("context_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("execution_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("run_id") BETWEEN 1 AND 256))
);

CREATE INDEX "outbound_message_execution_bindings_execution_event_idx" ON "outbound_message_execution_bindings" (("context_id") ASC, ("execution_id") ASC, ("run_id") ASC, ("event_id") ASC);

ALTER TABLE "outbound_message_execution_bindings" ADD FOREIGN KEY ("event_id") REFERENCES "audit_events" ("event_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`outbound_message_progress`,tables:[`outbound_message_progress`],indexes:[`outbound_message_progress_occurred_idx`,`outbound_message_progress_run_occurred_idx`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "outbound_message_progress" (
  "sequence" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "progress_id" text COLLATE "C" NOT NULL,
  "source_id" text COLLATE "C" NOT NULL,
  "source_sequence" bigint NOT NULL,
  "schema_version" bigint NOT NULL,
  "occurred_at" bigint NOT NULL,
  "action" text COLLATE "C" NOT NULL,
  "outcome" text COLLATE "C" NOT NULL,
  "actor_type" text COLLATE "C" NOT NULL,
  "actor_id" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C",
  "run_id" text COLLATE "C",
  "context_id" text COLLATE "C",
  "execution_id" text COLLATE "C",
  "channel" text COLLATE "C" NOT NULL,
  "conversation_kind" text COLLATE "C" NOT NULL,
  "duration_ms" bigint,
  "account_ref" text COLLATE "C",
  "conversation_ref" text COLLATE "C",
  "target_ref" text COLLATE "C",
  PRIMARY KEY ("sequence"),
  CHECK ((char_length("progress_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("source_id") BETWEEN 1 AND 512)),
  CHECK (("source_sequence" >= 1)),
  CHECK (("schema_version" = 1)),
  CHECK (("occurred_at" >= 0)),
  CHECK (("action" IN ('message.outbound.queued', 'message.outbound.platform-started'))),
  CHECK (("outcome" IN ('queued', 'platform_started'))),
  CHECK (("actor_type" IN ('agent', 'system'))),
  CHECK ((char_length("actor_id") BETWEEN 1 AND 256)),
  CHECK ("agent_id" IS NULL OR (char_length("agent_id") BETWEEN 1 AND 256)),
  CHECK ("run_id" IS NULL OR (char_length("run_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("channel") BETWEEN 1 AND 256)),
  CHECK (("conversation_kind" IN ('direct', 'group', 'channel', 'unknown'))),
  CHECK ("duration_ms" IS NULL OR ("duration_ms" >= 0)),
  UNIQUE ("progress_id"),
  UNIQUE ("source_id"),
  UNIQUE ("occurred_at", "progress_id")
);

CREATE INDEX "outbound_message_progress_occurred_idx" ON "outbound_message_progress" (("occurred_at") ASC, ("sequence") ASC);

CREATE INDEX "outbound_message_progress_run_occurred_idx" ON "outbound_message_progress" (("run_id") ASC NULLS FIRST, ("occurred_at") ASC, ("sequence") ASC);
`},{id:`agent_provenance`,tables:[`agent_provenance`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "agent_provenance" (
  "agent_id" text COLLATE "C" NOT NULL,
  "created_via" text COLLATE "C" NOT NULL,
  "creator_agent_id" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  PRIMARY KEY ("agent_id"),
  CHECK (("created_via" IN ('operator', 'agent', 'template')))
);
`},{id:`cron_run_receipts`,tables:[`cron_run_receipts`],indexes:[`cron_run_receipts_cursor_id_idx`,`idx_cron_run_receipts_active_job`,`idx_cron_run_receipts_job_history`],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "cron_run_receipts" (
  "cursor_id" bigint NOT NULL,
  "receipt_id" text COLLATE "C" NOT NULL,
  "store_key" text COLLATE "C" NOT NULL,
  "job_id" text COLLATE "C" NOT NULL,
  "config_revision" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "request_run_id" text COLLATE "C",
  "delivery_attempt_state" text COLLATE "C" NOT NULL DEFAULT 'unknown',
  "status" text COLLATE "C" NOT NULL,
  "owner_pid" bigint NOT NULL,
  "owner_start_time" bigint,
  "started_at_ms" bigint NOT NULL,
  "finished_at_ms" bigint,
  "error_text" text COLLATE "C",
  PRIMARY KEY ("receipt_id"),
  CHECK (("delivery_attempt_state" IN ('unknown', 'not-started', 'started'))),
  CHECK (("status" IN ('running', 'ok', 'error', 'skipped', 'interrupted', 'superseded'))),
  CHECK ((("status" = 'running') AND "finished_at_ms" IS NULL) OR (("status" != 'running') AND "finished_at_ms" IS NOT NULL))
);

CREATE UNIQUE INDEX "cron_run_receipts_cursor_id_idx" ON "cron_run_receipts" (("cursor_id") ASC);

CREATE UNIQUE INDEX "idx_cron_run_receipts_active_job" ON "cron_run_receipts" (("store_key") ASC, ("job_id") ASC) WHERE ("status" = 'running');

CREATE INDEX "idx_cron_run_receipts_job_history" ON "cron_run_receipts" (("store_key") ASC, ("job_id") ASC, ("started_at_ms") DESC, ("receipt_id") DESC);
`},{id:`config_revision_keys`,tables:[`config_revision_keys`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "config_revision_keys" (
  "id" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "hmac_key" bytea NOT NULL,
  PRIMARY KEY ("id"),
  CHECK (("id" = 1)),
  CHECK ((octet_length("hmac_key") = 32))
);
`},{id:`secret_store_entries`,tables:[`secret_store_entries`],indexes:[`secret_store_entries_live_idx`],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "secret_store_entries" (
  "scope_kind" text COLLATE "C" NOT NULL,
  "scope_id" text COLLATE "C" NOT NULL,
  "name" text COLLATE "C" NOT NULL,
  "value" text COLLATE "C" NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "updated_by" text COLLATE "C",
  "deleted_at_ms" bigint,
  "allowed_hosts" text COLLATE "C",
  PRIMARY KEY ("scope_kind", "scope_id", "name"),
  CHECK (("scope_kind" IN ('team', 'identity'))),
  CHECK (("kind" IN ('secret', 'env'))),
  CHECK (("created_at_ms" >= 0)),
  CHECK (("updated_at_ms" >= 0)),
  CHECK ((("scope_kind" = 'team') AND ("scope_id" = '')) OR (("scope_kind" = 'identity') AND (char_length("scope_id") > 0)))
);

CREATE INDEX "secret_store_entries_live_idx" ON "secret_store_entries" (("scope_kind") ASC, ("scope_id") ASC, ("name") ASC) WHERE "deleted_at_ms" IS NULL;
`},{id:`projects`,tables:[`projects`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "projects" (
  "id" text COLLATE "C" NOT NULL,
  "display_name" text COLLATE "C" NOT NULL,
  "repo_root" text COLLATE "C" NOT NULL,
  "origin_url" text COLLATE "C",
  "source" text COLLATE "C" NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("id"),
  CHECK (("source" IN ('registered', 'cloned')))
);
`},{id:`worktree_templates`,tables:[`worktree_templates`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "worktree_templates" (
  "cache_key" text COLLATE "C" NOT NULL,
  "id" text COLLATE "C" NOT NULL,
  "repo_root" text COLLATE "C" NOT NULL,
  "common_dir" text COLLATE "C" NOT NULL,
  "worktree_root" text COLLATE "C" NOT NULL,
  "path" text COLLATE "C" NOT NULL,
  "backend" text COLLATE "C" NOT NULL,
  "source_commit" text COLLATE "C" NOT NULL,
  "content_key" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  "last_used_at" bigint NOT NULL,
  PRIMARY KEY ("cache_key"),
  CHECK (("status" IN ('preparing', 'ready'))),
  UNIQUE ("id")
);
`},{id:`user_preferences`,tables:[`user_preferences`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "user_preferences" (
  "profile_id" text COLLATE "C" NOT NULL,
  "pref_key" text COLLATE "C" NOT NULL,
  "value_json" text COLLATE "C" NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("profile_id", "pref_key")
);
`},{id:`device_pair_setup_completions`,tables:[`device_pair_setup_completions`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "device_pair_setup_completions" (
  "setup_id" text COLLATE "C" NOT NULL,
  "device_id" text COLLATE "C" NOT NULL,
  "device_name" text COLLATE "C",
  "access" text COLLATE "C" NOT NULL,
  "completed_at_ms" bigint NOT NULL,
  "delivery_state" text COLLATE "C" NOT NULL,
  "retain_until_ms" bigint NOT NULL,
  PRIMARY KEY ("setup_id"),
  CHECK (("delivery_state" IN ('uncertain', 'confirmed')))
);
`},{id:`github_publication_requests`,tables:[`github_publication_requests`],indexes:[`idx_github_publication_requests_pending`],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "github_publication_requests" (
  "request_id" text COLLATE "C" NOT NULL,
  "idempotency_key" text COLLATE "C" NOT NULL,
  "request_digest" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "worktree_id" text COLLATE "C" NOT NULL,
  "repository_fingerprint" text COLLATE "C" NOT NULL,
  "claim_id" text COLLATE "C",
  "run_id" text COLLATE "C",
  "environment_id" text COLLATE "C",
  "owner_epoch" bigint,
  "placement_generation" bigint,
  "identity_source" text COLLATE "C" NOT NULL,
  "identity_profile_id" text COLLATE "C",
  "identity_account_id" bigint NOT NULL,
  "identity_login" text COLLATE "C" NOT NULL,
  "title" text COLLATE "C",
  "body" text COLLATE "C",
  "status" text COLLATE "C" NOT NULL,
  "gateway_instance_id" text COLLATE "C",
  "repository" text COLLATE "C",
  "branch" text COLLATE "C" NOT NULL,
  "base_branch" text COLLATE "C",
  "source_head_commit" text COLLATE "C",
  "source_index_tree" text COLLATE "C",
  "workspace_tree" text COLLATE "C",
  "head_commit" text COLLATE "C",
  "pull_request_url" text COLLATE "C",
  "error_code" text COLLATE "C",
  "next_action" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "reported_at_ms" bigint,
  "draft" bigint,
  PRIMARY KEY ("request_id"),
  CHECK ("owner_epoch" IS NULL OR ("owner_epoch" >= 1)),
  CHECK ("placement_generation" IS NULL OR ("placement_generation" >= 0)),
  CHECK (("identity_source" IN ('system-detected', 'system-configured', 'agent-override'))),
  CHECK (("identity_account_id" >= 1)),
  CHECK (("status" IN ('requested', 'publishing', 'published', 'failed'))),
  CHECK (("claim_id" IS NULL AND "run_id" IS NULL AND "environment_id" IS NULL AND "owner_epoch" IS NULL AND "placement_generation" IS NULL) OR ("claim_id" IS NOT NULL AND "run_id" IS NOT NULL AND "placement_generation" IS NOT NULL AND (("environment_id" IS NULL AND "owner_epoch" IS NULL) OR ("environment_id" IS NOT NULL AND "owner_epoch" IS NOT NULL)))),
  CHECK (("identity_source" IS NOT DISTINCT FROM 'system-detected' AND "identity_profile_id" IS NULL) OR (("identity_source" IN ('system-configured', 'agent-override')) AND "identity_profile_id" IS NOT NULL)),
  CHECK (("source_head_commit" IS NULL AND "source_index_tree" IS NULL AND "workspace_tree" IS NULL) OR ("source_head_commit" IS NOT NULL AND "workspace_tree" IS NOT NULL)),
  CHECK (("status" IS NOT DISTINCT FROM 'published' AND "pull_request_url" IS NOT NULL AND "error_code" IS NULL AND "next_action" IS NULL) OR ("status" IS NOT DISTINCT FROM 'failed' AND "pull_request_url" IS NULL AND "error_code" IS NOT NULL AND "next_action" IS NOT NULL) OR (("status" IN ('requested', 'publishing')) AND "pull_request_url" IS NULL AND "error_code" IS NULL AND "next_action" IS NULL)),
  UNIQUE ("session_id", "idempotency_key")
);

CREATE INDEX "idx_github_publication_requests_pending" ON "github_publication_requests" (("status") ASC, ("updated_at_ms") ASC, ("request_id") ASC);
`},{id:`device_pairing_join_codes`,tables:[`device_pairing_join_codes`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "device_pairing_join_codes" (
  "shortcode" text COLLATE "C",
  "payload_json" text COLLATE "C",
  "created_at_ms" bigint,
  "expires_at_ms" bigint
);
`},{id:`device_pairing_browser_requests`,tables:[`device_pairing_browser_requests`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "device_pairing_browser_requests" (
  "request_id" text COLLATE "C" NOT NULL,
  "code" text COLLATE "C" NOT NULL,
  "device_id" text COLLATE "C" NOT NULL,
  "public_key" text COLLATE "C" NOT NULL,
  "remote_ip" text COLLATE "C",
  "user_agent" text COLLATE "C",
  "origin" text COLLATE "C",
  "status" text COLLATE "C" NOT NULL,
  "approved_token_sha256" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "expires_at_ms" bigint NOT NULL,
  PRIMARY KEY ("request_id"),
  CHECK (("status" IN ('pending', 'approved', 'rejected'))),
  UNIQUE ("code"),
  UNIQUE ("device_id")
);
`},{id:`skill_workshop_changes`,tables:[`skill_workshop_changes`],indexes:[`skill_workshop_changes_cursor_id_idx`,`idx_skill_workshop_changes_agent_time`],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "skill_workshop_changes" (
  "cursor_id" bigint NOT NULL,
  "change_id" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "skill_name" text COLLATE "C" NOT NULL,
  "action" text COLLATE "C" NOT NULL,
  "actor" text COLLATE "C" NOT NULL,
  "summary" text COLLATE "C" NOT NULL,
  "version_id" text COLLATE "C",
  "session_key" text COLLATE "C",
  "run_id" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  PRIMARY KEY ("change_id"),
  CHECK (("action" IN ('create', 'patch', 'write_file', 'remove_file', 'archive', 'restore'))),
  CHECK (("actor" IN ('agent', 'review', 'curator', 'user')))
);

CREATE INDEX "idx_skill_workshop_changes_agent_time" ON "skill_workshop_changes" (("agent_id") ASC, ("created_at_ms") ASC);

CREATE UNIQUE INDEX "skill_workshop_changes_cursor_id_idx" ON "skill_workshop_changes" (("cursor_id") ASC);
`},{id:`worker_environment_ssh_fallback_ports`,tables:[`worker_environment_ssh_fallback_ports`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "worker_environment_ssh_fallback_ports" (
  "environment_id" text COLLATE "C" NOT NULL,
  "position" bigint NOT NULL,
  "port" bigint NOT NULL,
  PRIMARY KEY ("environment_id", "position"),
  CHECK (("position" >= 0) AND ("position" <= 9)),
  CHECK (("port" >= 1) AND ("port" <= 65535)),
  UNIQUE ("environment_id", "port")
);

ALTER TABLE "worker_environment_ssh_fallback_ports" ADD FOREIGN KEY ("environment_id") REFERENCES "worker_environments" ("environment_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`worker_session_placement_moves`,tables:[`worker_session_placement_moves`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "worker_session_placement_moves" (
  "operation_id" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "source_generation" bigint NOT NULL,
  "source_environment_id" text COLLATE "C" NOT NULL,
  "source_owner_epoch" bigint NOT NULL,
  "target_kind" text COLLATE "C" NOT NULL,
  "target_id" text COLLATE "C",
  "target_machine_class" text COLLATE "C",
  "target_os" text COLLATE "C",
  "abandon_source" bigint,
  "last_error" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("operation_id"),
  CHECK (("source_generation" >= 0)),
  CHECK ((char_length("source_environment_id") BETWEEN 1 AND 256) AND ("source_environment_id" = btrim("source_environment_id"))),
  CHECK (("source_owner_epoch" >= 1)),
  CHECK (("target_kind" IN ('gateway', 'profile', 'device'))),
  CHECK (("target_kind" IS NOT DISTINCT FROM 'gateway' AND "target_id" IS NULL) OR (("target_kind" IN ('profile', 'device')) AND "target_id" IS NOT NULL AND (char_length("target_id") BETWEEN 1 AND 256) AND ("target_id" = btrim("target_id")))),
  UNIQUE ("session_id")
);

ALTER TABLE "worker_session_placement_moves" ADD FOREIGN KEY ("session_id") REFERENCES "worker_session_placements" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`agent_deletion_journal`,tables:[`agent_deletion_journal`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "agent_deletion_journal" (
  "agent_id" text COLLATE "C" NOT NULL,
  "operation_id" text COLLATE "C" NOT NULL DEFAULT '',
  "phase" text COLLATE "C",
  "agent_dir" text COLLATE "C" NOT NULL,
  "workspace_dir" text COLLATE "C" NOT NULL,
  "sessions_dir" text COLLATE "C" NOT NULL,
  "database_paths_json" text COLLATE "C" NOT NULL DEFAULT '[]',
  "cleanup_paths_json" text COLLATE "C" NOT NULL DEFAULT '[]',
  "created_at" bigint NOT NULL,
  "cleanup_completed" bigint NOT NULL DEFAULT 0,
  "delete_files" bigint NOT NULL DEFAULT 1,
  PRIMARY KEY ("agent_id")
);
`}];return Object.defineProperty(this,"fragments",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get expectedCatalog(){let e=[{table:`acp_replay_events`,kind:`table`,value:null},{table:`acp_replay_events`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`acp_replay_events`,kind:`column`,value:{name:`seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`acp_replay_events`,kind:`column`,value:{name:`at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`acp_replay_events`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`acp_replay_events`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`acp_replay_events`,kind:`column`,value:{name:`update_json`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`acp_replay_events`,kind:`column`,value:{name:`estimated_bytes`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:7}},{table:`acp_replay_events`,kind:`primaryKey`,value:[`session_id`,`seq`]},{table:`acp_replay_events`,kind:`foreignKey`,value:{columns:[`session_id`],target:`acp_replay_sessions`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`acp_replay_events`,kind:`indexes`,value:1},{table:`acp_replay_events`,kind:`checks`,value:0},{table:`acp_replay_sessions`,kind:`table`,value:null},{table:`acp_replay_sessions`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`cwd`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`complete`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`next_seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`estimated_bytes`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:8}},{table:`acp_replay_sessions`,kind:`primaryKey`,value:[`session_id`]},{table:`acp_replay_sessions`,kind:`indexes`,value:3},{table:`acp_replay_sessions`,kind:`checks`,value:0},{table:`acp_sessions`,kind:`table`,value:null},{table:`acp_sessions`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`acp_sessions`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`acp_sessions`,kind:`column`,value:{name:`backend`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`acp_sessions`,kind:`column`,value:{name:`agent`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`acp_sessions`,kind:`column`,value:{name:`runtime_session_name`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`acp_sessions`,kind:`column`,value:{name:`identity_json`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`acp_sessions`,kind:`column`,value:{name:`resume_agent_session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`acp_sessions`,kind:`column`,value:{name:`resume_acpx_session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`acp_sessions`,kind:`column`,value:{name:`mode`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`acp_sessions`,kind:`column`,value:{name:`runtime_options_json`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`acp_sessions`,kind:`column`,value:{name:`cwd`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`acp_sessions`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`acp_sessions`,kind:`column`,value:{name:`last_activity_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:13}},{table:`acp_sessions`,kind:`column`,value:{name:`last_error`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`acp_sessions`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:15}},{table:`acp_sessions`,kind:`primaryKey`,value:[`session_key`]},{table:`acp_sessions`,kind:`indexes`,value:5},{table:`acp_sessions`,kind:`checks`,value:0},{table:`agent_database_leases`,kind:`table`,value:null},{table:`agent_database_leases`,kind:`column`,value:{name:`lease_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`agent_database_leases`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`agent_database_leases`,kind:`column`,value:{name:`path`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`agent_database_leases`,kind:`column`,value:{name:`owner_pid`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`agent_database_leases`,kind:`column`,value:{name:`owner_start_time`,type:`bigint`,nullable:!0,identity:!1,default:null,position:5}},{table:`agent_database_leases`,kind:`column`,value:{name:`opened_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`agent_database_leases`,kind:`column`,value:{name:`provenance`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`agent_database_leases`,kind:`primaryKey`,value:[`lease_id`]},{table:`agent_database_leases`,kind:`indexes`,value:1},{table:`agent_database_leases`,kind:`checks`,value:0},{table:`agent_databases`,kind:`table`,value:null},{table:`agent_databases`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`agent_databases`,kind:`column`,value:{name:`path`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`agent_databases`,kind:`column`,value:{name:`schema_version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`agent_databases`,kind:`column`,value:{name:`last_seen_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`agent_databases`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:!0,identity:!1,default:null,position:5}},{table:`agent_databases`,kind:`primaryKey`,value:[`agent_id`,`path`]},{table:`agent_databases`,kind:`indexes`,value:1},{table:`agent_databases`,kind:`checks`,value:0},{table:`agent_deletion_journal`,kind:`table`,value:null},{table:`agent_deletion_journal`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`operation_id`,type:`text`,nullable:!1,identity:!1,default:`''`,position:2}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`phase`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`agent_dir`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`workspace_dir`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`sessions_dir`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`database_paths_json`,type:`text`,nullable:!1,identity:!1,default:`'[]'`,position:7}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`cleanup_paths_json`,type:`text`,nullable:!1,identity:!1,default:`'[]'`,position:8}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`cleanup_completed`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:10}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`delete_files`,type:`bigint`,nullable:!1,identity:!1,default:`1`,position:11}},{table:`agent_deletion_journal`,kind:`primaryKey`,value:[`agent_id`]},{table:`agent_deletion_journal`,kind:`indexes`,value:1},{table:`agent_deletion_journal`,kind:`checks`,value:0},{table:`agent_provenance`,kind:`table`,value:null},{table:`agent_provenance`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`agent_provenance`,kind:`column`,value:{name:`created_via`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`agent_provenance`,kind:`column`,value:{name:`creator_agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`agent_provenance`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`agent_provenance`,kind:`primaryKey`,value:[`agent_id`]},{table:`agent_provenance`,kind:`indexes`,value:1},{table:`agent_provenance`,kind:`checks`,value:1},{table:`apns_registration_tombstones`,kind:`table`,value:null},{table:`apns_registration_tombstones`,kind:`column`,value:{name:`node_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`apns_registration_tombstones`,kind:`column`,value:{name:`deleted_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`apns_registration_tombstones`,kind:`primaryKey`,value:[`node_id`]},{table:`apns_registration_tombstones`,kind:`indexes`,value:1},{table:`apns_registration_tombstones`,kind:`checks`,value:0},{table:`apns_registrations`,kind:`table`,value:null},{table:`apns_registrations`,kind:`column`,value:{name:`node_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`apns_registrations`,kind:`column`,value:{name:`transport`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`apns_registrations`,kind:`column`,value:{name:`token`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`apns_registrations`,kind:`column`,value:{name:`relay_handle`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`apns_registrations`,kind:`column`,value:{name:`send_grant`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`apns_registrations`,kind:`column`,value:{name:`installation_id`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`apns_registrations`,kind:`column`,value:{name:`relay_origin`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`apns_registrations`,kind:`column`,value:{name:`topic`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`apns_registrations`,kind:`column`,value:{name:`environment`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`apns_registrations`,kind:`column`,value:{name:`distribution`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`apns_registrations`,kind:`column`,value:{name:`token_debug_suffix`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`apns_registrations`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`apns_registrations`,kind:`primaryKey`,value:[`node_id`]},{table:`apns_registrations`,kind:`indexes`,value:2},{table:`apns_registrations`,kind:`checks`,value:0},{table:`audit_events`,kind:`table`,value:null},{table:`audit_events`,kind:`column`,value:{name:`sequence`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`audit_events`,kind:`column`,value:{name:`event_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`audit_events`,kind:`column`,value:{name:`source_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`audit_events`,kind:`column`,value:{name:`schema_version`,type:`bigint`,nullable:!1,identity:!1,default:`1`,position:4}},{table:`audit_events`,kind:`column`,value:{name:`source_sequence`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`audit_events`,kind:`column`,value:{name:`occurred_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`audit_events`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`audit_events`,kind:`column`,value:{name:`action`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`audit_events`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`audit_events`,kind:`column`,value:{name:`error_code`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`audit_events`,kind:`column`,value:{name:`actor_type`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`audit_events`,kind:`column`,value:{name:`actor_id`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`audit_events`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`audit_events`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`audit_events`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`audit_events`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`audit_events`,kind:`column`,value:{name:`tool_call_id`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`audit_events`,kind:`column`,value:{name:`tool_name`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`audit_events`,kind:`column`,value:{name:`direction`,type:`text`,nullable:!0,identity:!1,default:null,position:19}},{table:`audit_events`,kind:`column`,value:{name:`channel`,type:`text`,nullable:!0,identity:!1,default:null,position:20}},{table:`audit_events`,kind:`column`,value:{name:`conversation_kind`,type:`text`,nullable:!0,identity:!1,default:null,position:21}},{table:`audit_events`,kind:`column`,value:{name:`message_outcome`,type:`text`,nullable:!0,identity:!1,default:null,position:22}},{table:`audit_events`,kind:`column`,value:{name:`reason_code`,type:`text`,nullable:!0,identity:!1,default:null,position:23}},{table:`audit_events`,kind:`column`,value:{name:`delivery_kind`,type:`text`,nullable:!0,identity:!1,default:null,position:24}},{table:`audit_events`,kind:`column`,value:{name:`failure_stage`,type:`text`,nullable:!0,identity:!1,default:null,position:25}},{table:`audit_events`,kind:`column`,value:{name:`duration_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:26}},{table:`audit_events`,kind:`column`,value:{name:`result_count`,type:`bigint`,nullable:!0,identity:!1,default:null,position:27}},{table:`audit_events`,kind:`column`,value:{name:`account_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:28}},{table:`audit_events`,kind:`column`,value:{name:`conversation_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:29}},{table:`audit_events`,kind:`column`,value:{name:`message_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:30}},{table:`audit_events`,kind:`column`,value:{name:`target_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:31}},{table:`audit_events`,kind:`primaryKey`,value:[`sequence`]},{table:`audit_events`,kind:`unique`,value:[`event_id`]},{table:`audit_events`,kind:`unique`,value:[`source_id`]},{table:`audit_events`,kind:`indexes`,value:11},{table:`audit_events`,kind:`checks`,value:0},{table:`audit_identity_keys`,kind:`table`,value:null},{table:`audit_identity_keys`,kind:`column`,value:{name:`id`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`audit_identity_keys`,kind:`column`,value:{name:`key_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`audit_identity_keys`,kind:`column`,value:{name:`key`,type:`bytea`,nullable:!1,identity:!1,default:null,position:3}},{table:`audit_identity_keys`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`audit_identity_keys`,kind:`primaryKey`,value:[`id`]},{table:`audit_identity_keys`,kind:`indexes`,value:1},{table:`audit_identity_keys`,kind:`checks`,value:1},{table:`backup_runs`,kind:`table`,value:null},{table:`backup_runs`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`backup_runs`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`backup_runs`,kind:`column`,value:{name:`archive_path`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`backup_runs`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`backup_runs`,kind:`column`,value:{name:`manifest_json`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`backup_runs`,kind:`primaryKey`,value:[`id`]},{table:`backup_runs`,kind:`indexes`,value:2},{table:`backup_runs`,kind:`checks`,value:0},{table:`capture_blobs`,kind:`table`,value:null},{table:`capture_blobs`,kind:`column`,value:{name:`blob_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`capture_blobs`,kind:`column`,value:{name:`content_type`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`capture_blobs`,kind:`column`,value:{name:`encoding`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`capture_blobs`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`capture_blobs`,kind:`column`,value:{name:`sha256`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`capture_blobs`,kind:`column`,value:{name:`data`,type:`bytea`,nullable:!1,identity:!1,default:null,position:6}},{table:`capture_blobs`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`capture_blobs`,kind:`primaryKey`,value:[`blob_id`]},{table:`capture_blobs`,kind:`indexes`,value:1},{table:`capture_blobs`,kind:`checks`,value:0},{table:`capture_events`,kind:`table`,value:null},{table:`capture_events`,kind:`column`,value:{name:`id`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`capture_events`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`capture_events`,kind:`column`,value:{name:`ts`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`capture_events`,kind:`column`,value:{name:`source_scope`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`capture_events`,kind:`column`,value:{name:`source_process`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`capture_events`,kind:`column`,value:{name:`protocol`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`capture_events`,kind:`column`,value:{name:`direction`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`capture_events`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`capture_events`,kind:`column`,value:{name:`flow_id`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`capture_events`,kind:`column`,value:{name:`method`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`capture_events`,kind:`column`,value:{name:`host`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`capture_events`,kind:`column`,value:{name:`path`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`capture_events`,kind:`column`,value:{name:`status`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`capture_events`,kind:`column`,value:{name:`close_code`,type:`bigint`,nullable:!0,identity:!1,default:null,position:14}},{table:`capture_events`,kind:`column`,value:{name:`content_type`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`capture_events`,kind:`column`,value:{name:`headers_json`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`capture_events`,kind:`column`,value:{name:`data_text`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`capture_events`,kind:`column`,value:{name:`data_blob_id`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`capture_events`,kind:`column`,value:{name:`data_sha256`,type:`text`,nullable:!0,identity:!1,default:null,position:19}},{table:`capture_events`,kind:`column`,value:{name:`error_text`,type:`text`,nullable:!0,identity:!1,default:null,position:20}},{table:`capture_events`,kind:`column`,value:{name:`meta_json`,type:`text`,nullable:!0,identity:!1,default:null,position:21}},{table:`capture_events`,kind:`primaryKey`,value:[`id`]},{table:`capture_events`,kind:`foreignKey`,value:{columns:[`data_blob_id`],target:`capture_blobs`,targetColumns:[`blob_id`],onUpdate:`NO ACTION`,onDelete:`SET NULL`,deferrable:!1,deferred:!1}},{table:`capture_events`,kind:`foreignKey`,value:{columns:[`session_id`],target:`capture_sessions`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`capture_events`,kind:`indexes`,value:3},{table:`capture_events`,kind:`checks`,value:0},{table:`capture_sessions`,kind:`table`,value:null},{table:`capture_sessions`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`capture_sessions`,kind:`column`,value:{name:`started_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`capture_sessions`,kind:`column`,value:{name:`ended_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:3}},{table:`capture_sessions`,kind:`column`,value:{name:`mode`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`capture_sessions`,kind:`column`,value:{name:`source_scope`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`capture_sessions`,kind:`column`,value:{name:`source_process`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`capture_sessions`,kind:`column`,value:{name:`proxy_url`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`capture_sessions`,kind:`primaryKey`,value:[`id`]},{table:`capture_sessions`,kind:`indexes`,value:1},{table:`capture_sessions`,kind:`checks`,value:0},{table:`channel_ingress_events`,kind:`table`,value:null},{table:`channel_ingress_events`,kind:`column`,value:{name:`queue_name`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`channel_ingress_events`,kind:`column`,value:{name:`event_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`channel_ingress_events`,kind:`column`,value:{name:`channel_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`channel_ingress_events`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`channel_ingress_events`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`channel_ingress_events`,kind:`column`,value:{name:`lane_key`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`channel_ingress_events`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`channel_ingress_events`,kind:`column`,value:{name:`metadata_json`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`channel_ingress_events`,kind:`column`,value:{name:`received_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`channel_ingress_events`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`channel_ingress_events`,kind:`column`,value:{name:`claim_token`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`channel_ingress_events`,kind:`column`,value:{name:`claim_owner`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`channel_ingress_events`,kind:`column`,value:{name:`claimed_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`channel_ingress_events`,kind:`column`,value:{name:`attempts`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:14}},{table:`channel_ingress_events`,kind:`column`,value:{name:`last_attempt_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:15}},{table:`channel_ingress_events`,kind:`column`,value:{name:`last_error`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`channel_ingress_events`,kind:`column`,value:{name:`failed_reason`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`channel_ingress_events`,kind:`column`,value:{name:`failed_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:18}},{table:`channel_ingress_events`,kind:`column`,value:{name:`completed_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:19}},{table:`channel_ingress_events`,kind:`column`,value:{name:`completed_metadata_json`,type:`text`,nullable:!0,identity:!1,default:null,position:20}},{table:`channel_ingress_events`,kind:`primaryKey`,value:[`queue_name`,`event_id`]},{table:`channel_ingress_events`,kind:`indexes`,value:4},{table:`channel_ingress_events`,kind:`checks`,value:0},{table:`channel_pairing_allow_entries`,kind:`table`,value:null},{table:`channel_pairing_allow_entries`,kind:`column`,value:{name:`channel_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`channel_pairing_allow_entries`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`channel_pairing_allow_entries`,kind:`column`,value:{name:`entry`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`channel_pairing_allow_entries`,kind:`column`,value:{name:`sort_order`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`channel_pairing_allow_entries`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`channel_pairing_allow_entries`,kind:`primaryKey`,value:[`channel_key`,`account_id`,`entry`]},{table:`channel_pairing_allow_entries`,kind:`indexes`,value:2},{table:`channel_pairing_allow_entries`,kind:`checks`,value:0},{table:`channel_pairing_requests`,kind:`table`,value:null},{table:`channel_pairing_requests`,kind:`column`,value:{name:`channel_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`code`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`created_at`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`last_seen_at`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`meta_json`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`channel_pairing_requests`,kind:`primaryKey`,value:[`channel_key`,`account_id`,`request_id`]},{table:`channel_pairing_requests`,kind:`indexes`,value:3},{table:`channel_pairing_requests`,kind:`checks`,value:0},{table:`clawhub_promotion_claims`,kind:`table`,value:null},{table:`clawhub_promotion_claims`,kind:`column`,value:{name:`slug`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`clawhub_promotion_claims`,kind:`column`,value:{name:`provider`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`clawhub_promotion_claims`,kind:`column`,value:{name:`model_keys_json`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`clawhub_promotion_claims`,kind:`column`,value:{name:`ends_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`clawhub_promotion_claims`,kind:`column`,value:{name:`claimed_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`clawhub_promotion_claims`,kind:`primaryKey`,value:[`slug`]},{table:`clawhub_promotion_claims`,kind:`indexes`,value:1},{table:`clawhub_promotion_claims`,kind:`checks`,value:0},{table:`config_health_entries`,kind:`table`,value:null},{table:`config_health_entries`,kind:`column`,value:{name:`config_path`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`config_health_entries`,kind:`column`,value:{name:`last_known_good_json`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`config_health_entries`,kind:`column`,value:{name:`last_promoted_good_json`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`config_health_entries`,kind:`column`,value:{name:`last_observed_suspicious_signature`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`config_health_entries`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`config_health_entries`,kind:`primaryKey`,value:[`config_path`]},{table:`config_health_entries`,kind:`indexes`,value:1},{table:`config_health_entries`,kind:`checks`,value:0},{table:`config_machine_state`,kind:`table`,value:null},{table:`config_machine_state`,kind:`column`,value:{name:`state_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`config_machine_state`,kind:`column`,value:{name:`value_json`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`config_machine_state`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`config_machine_state`,kind:`primaryKey`,value:[`state_key`]},{table:`config_machine_state`,kind:`indexes`,value:1},{table:`config_machine_state`,kind:`checks`,value:0},{table:`config_revision_keys`,kind:`table`,value:null},{table:`config_revision_keys`,kind:`column`,value:{name:`id`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`config_revision_keys`,kind:`column`,value:{name:`hmac_key`,type:`bytea`,nullable:!1,identity:!1,default:null,position:2}},{table:`config_revision_keys`,kind:`primaryKey`,value:[`id`]},{table:`config_revision_keys`,kind:`indexes`,value:1},{table:`config_revision_keys`,kind:`checks`,value:2},{table:`cron_job_runtime_authorities`,kind:`table`,value:null},{table:`cron_job_runtime_authorities`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`cron_job_runtime_authorities`,kind:`column`,value:{name:`job_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`cron_job_runtime_authorities`,kind:`column`,value:{name:`authority_json`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`cron_job_runtime_authorities`,kind:`column`,value:{name:`authority_input_fingerprint`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`cron_job_runtime_authorities`,kind:`column`,value:{name:`recovery_required`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`cron_job_runtime_authorities`,kind:`primaryKey`,value:[`store_key`,`job_id`]},{table:`cron_job_runtime_authorities`,kind:`foreignKey`,value:{columns:[`store_key`,`job_id`],target:`cron_jobs`,targetColumns:[`store_key`,`job_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`cron_job_runtime_authorities`,kind:`indexes`,value:1},{table:`cron_job_runtime_authorities`,kind:`checks`,value:2},{table:`cron_job_scratch`,kind:`table`,value:null},{table:`cron_job_scratch`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`cron_job_scratch`,kind:`column`,value:{name:`job_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`cron_job_scratch`,kind:`column`,value:{name:`content`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`cron_job_scratch`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`cron_job_scratch`,kind:`column`,value:{name:`source_sha256`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`cron_job_scratch`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`cron_job_scratch`,kind:`primaryKey`,value:[`store_key`,`job_id`]},{table:`cron_job_scratch`,kind:`indexes`,value:2},{table:`cron_job_scratch`,kind:`checks`,value:2},{table:`cron_jobs`,kind:`table`,value:null},{table:`cron_jobs`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`cron_jobs`,kind:`column`,value:{name:`job_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`cron_jobs`,kind:`column`,value:{name:`declaration_key`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`cron_jobs`,kind:`column`,value:{name:`owner_agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`cron_jobs`,kind:`column`,value:{name:`name`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`cron_jobs`,kind:`column`,value:{name:`description`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`cron_jobs`,kind:`column`,value:{name:`enabled`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`cron_jobs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`cron_jobs`,kind:`column`,value:{name:`payload_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`cron_jobs`,kind:`column`,value:{name:`job_json`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`cron_jobs`,kind:`column`,value:{name:`grant_definition_revision`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`cron_jobs`,kind:`column`,value:{name:`grant_definition_generation`,type:`bigint`,nullable:!0,identity:!1,default:null,position:12}},{table:`cron_jobs`,kind:`column`,value:{name:`grant_definition_updated_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`cron_jobs`,kind:`column`,value:{name:`state_json`,type:`text`,nullable:!1,identity:!1,default:`'{}'`,position:14}},{table:`cron_jobs`,kind:`column`,value:{name:`runtime_updated_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:15}},{table:`cron_jobs`,kind:`column`,value:{name:`schedule_identity`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`cron_jobs`,kind:`column`,value:{name:`sort_order`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:17}},{table:`cron_jobs`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:18}},{table:`cron_jobs`,kind:`primaryKey`,value:[`store_key`,`job_id`]},{table:`cron_jobs`,kind:`indexes`,value:2},{table:`cron_jobs`,kind:`checks`,value:0},{table:`cron_run_receipts`,kind:`table`,value:null},{table:`cron_run_receipts`,kind:`column`,value:{name:`cursor_id`,type:`bigint`,nullable:!1,identity:!1,default:null,position:1}},{table:`cron_run_receipts`,kind:`column`,value:{name:`receipt_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`cron_run_receipts`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`cron_run_receipts`,kind:`column`,value:{name:`job_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`cron_run_receipts`,kind:`column`,value:{name:`config_revision`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`cron_run_receipts`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`cron_run_receipts`,kind:`column`,value:{name:`request_run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`cron_run_receipts`,kind:`column`,value:{name:`delivery_attempt_state`,type:`text`,nullable:!1,identity:!1,default:`'unknown'`,position:8}},{table:`cron_run_receipts`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`cron_run_receipts`,kind:`column`,value:{name:`owner_pid`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`cron_run_receipts`,kind:`column`,value:{name:`owner_start_time`,type:`bigint`,nullable:!0,identity:!1,default:null,position:11}},{table:`cron_run_receipts`,kind:`column`,value:{name:`started_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`cron_run_receipts`,kind:`column`,value:{name:`finished_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`cron_run_receipts`,kind:`column`,value:{name:`error_text`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`cron_run_receipts`,kind:`primaryKey`,value:[`receipt_id`]},{table:`cron_run_receipts`,kind:`indexes`,value:4},{table:`cron_run_receipts`,kind:`checks`,value:3},{table:`cron_run_trigger_state_retirements`,kind:`table`,value:null},{table:`cron_run_trigger_state_retirements`,kind:`column`,value:{name:`receipt_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`cron_run_trigger_state_retirements`,kind:`primaryKey`,value:[`receipt_id`]},{table:`cron_run_trigger_state_retirements`,kind:`foreignKey`,value:{columns:[`receipt_id`],target:`cron_run_receipts`,targetColumns:[`receipt_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`cron_run_trigger_state_retirements`,kind:`indexes`,value:1},{table:`cron_run_trigger_state_retirements`,kind:`checks`,value:0},{table:`current_conversation_bindings`,kind:`table`,value:null},{table:`current_conversation_bindings`,kind:`column`,value:{name:`binding_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`binding_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`target_session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`channel`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`conversation_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`parent_conversation_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`conversation_id`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`target_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`bound_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:12}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`metadata_json`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`record_json`,type:`text`,nullable:!1,identity:!1,default:null,position:14}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:15}},{table:`current_conversation_bindings`,kind:`primaryKey`,value:[`binding_key`]},{table:`current_conversation_bindings`,kind:`indexes`,value:4},{table:`current_conversation_bindings`,kind:`checks`,value:0},{table:`delivery_queue_entries`,kind:`table`,value:null},{table:`delivery_queue_entries`,kind:`column`,value:{name:`queue_name`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`entry_kind`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`channel`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`target`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`retry_count`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:9}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`last_attempt_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:10}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`last_error`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`recovery_state`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`platform_send_started_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`entry_json`,type:`text`,nullable:!1,identity:!1,default:null,position:14}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`retention_id_prefix`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`retention_max_age_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:16}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`retention_max_entries`,type:`bigint`,nullable:!0,identity:!1,default:null,position:17}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`enqueued_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:18}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:19}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`failed_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:20}},{table:`delivery_queue_entries`,kind:`primaryKey`,value:[`queue_name`,`id`]},{table:`delivery_queue_entries`,kind:`indexes`,value:6},{table:`delivery_queue_entries`,kind:`checks`,value:0},{table:`device_bootstrap_tokens`,kind:`table`,value:null},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`token_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`token`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`setup_id`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`ts`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`public_key`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`profile_json`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`redeemed_profile_json`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`pending_profile_json`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`issued_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`last_used_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:11}},{table:`device_bootstrap_tokens`,kind:`primaryKey`,value:[`token_key`]},{table:`device_bootstrap_tokens`,kind:`indexes`,value:2},{table:`device_bootstrap_tokens`,kind:`checks`,value:0},{table:`device_pair_setup_completions`,kind:`table`,value:null},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`setup_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`device_name`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`access`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`completed_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`delivery_state`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`retain_until_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`device_pair_setup_completions`,kind:`primaryKey`,value:[`setup_id`]},{table:`device_pair_setup_completions`,kind:`indexes`,value:1},{table:`device_pair_setup_completions`,kind:`checks`,value:1},{table:`device_pairing_browser_requests`,kind:`table`,value:null},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`code`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`public_key`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`remote_ip`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`user_agent`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`origin`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`approved_token_sha256`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`device_pairing_browser_requests`,kind:`primaryKey`,value:[`request_id`]},{table:`device_pairing_browser_requests`,kind:`unique`,value:[`code`]},{table:`device_pairing_browser_requests`,kind:`unique`,value:[`device_id`]},{table:`device_pairing_browser_requests`,kind:`indexes`,value:3},{table:`device_pairing_browser_requests`,kind:`checks`,value:1},{table:`device_pairing_join_codes`,kind:`table`,value:null},{table:`device_pairing_join_codes`,kind:`column`,value:{name:`shortcode`,type:`text`,nullable:!0,identity:!1,default:null,position:1}},{table:`device_pairing_join_codes`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`device_pairing_join_codes`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:3}},{table:`device_pairing_join_codes`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:4}},{table:`device_pairing_join_codes`,kind:`indexes`,value:0},{table:`device_pairing_join_codes`,kind:`checks`,value:0},{table:`device_pairing_paired`,kind:`table`,value:null},{table:`device_pairing_paired`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`device_pairing_paired`,kind:`column`,value:{name:`public_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`device_pairing_paired`,kind:`column`,value:{name:`display_name`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`device_pairing_paired`,kind:`column`,value:{name:`operator_label`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`device_pairing_paired`,kind:`column`,value:{name:`platform`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`device_pairing_paired`,kind:`column`,value:{name:`device_family`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`device_pairing_paired`,kind:`column`,value:{name:`client_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`device_pairing_paired`,kind:`column`,value:{name:`client_mode`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`device_pairing_paired`,kind:`column`,value:{name:`browser_origin`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`device_pairing_paired`,kind:`column`,value:{name:`role`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`device_pairing_paired`,kind:`column`,value:{name:`roles_json`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`device_pairing_paired`,kind:`column`,value:{name:`scopes_json`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`device_pairing_paired`,kind:`column`,value:{name:`approved_scopes_json`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`device_pairing_paired`,kind:`column`,value:{name:`remote_ip`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`device_pairing_paired`,kind:`column`,value:{name:`tokens_json`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`device_pairing_paired`,kind:`column`,value:{name:`approved_via`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`device_pairing_paired`,kind:`column`,value:{name:`node_surface_json`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`device_pairing_paired`,kind:`column`,value:{name:`pending_node_surface_json`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`device_pairing_paired`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:19}},{table:`device_pairing_paired`,kind:`column`,value:{name:`approved_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:20}},{table:`device_pairing_paired`,kind:`column`,value:{name:`last_seen_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:21}},{table:`device_pairing_paired`,kind:`column`,value:{name:`last_seen_reason`,type:`text`,nullable:!0,identity:!1,default:null,position:22}},{table:`device_pairing_paired`,kind:`primaryKey`,value:[`device_id`]},{table:`device_pairing_paired`,kind:`indexes`,value:2},{table:`device_pairing_paired`,kind:`checks`,value:0},{table:`device_pairing_pending`,kind:`table`,value:null},{table:`device_pairing_pending`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`device_pairing_pending`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`device_pairing_pending`,kind:`column`,value:{name:`public_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`device_pairing_pending`,kind:`column`,value:{name:`display_name`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`device_pairing_pending`,kind:`column`,value:{name:`platform`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`device_pairing_pending`,kind:`column`,value:{name:`device_family`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`device_pairing_pending`,kind:`column`,value:{name:`client_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`device_pairing_pending`,kind:`column`,value:{name:`client_mode`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`device_pairing_pending`,kind:`column`,value:{name:`browser_origin`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`device_pairing_pending`,kind:`column`,value:{name:`role`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`device_pairing_pending`,kind:`column`,value:{name:`roles_json`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`device_pairing_pending`,kind:`column`,value:{name:`scopes_json`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`device_pairing_pending`,kind:`column`,value:{name:`remote_ip`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`device_pairing_pending`,kind:`column`,value:{name:`silent`,type:`bigint`,nullable:!0,identity:!1,default:null,position:14}},{table:`device_pairing_pending`,kind:`column`,value:{name:`is_repair`,type:`bigint`,nullable:!0,identity:!1,default:null,position:15}},{table:`device_pairing_pending`,kind:`column`,value:{name:`ts`,type:`bigint`,nullable:!1,identity:!1,default:null,position:16}},{table:`device_pairing_pending`,kind:`column`,value:{name:`refreshed_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:17}},{table:`device_pairing_pending`,kind:`primaryKey`,value:[`request_id`]},{table:`device_pairing_pending`,kind:`indexes`,value:2},{table:`device_pairing_pending`,kind:`checks`,value:0},{table:`diagnostic_events`,kind:`table`,value:null},{table:`diagnostic_events`,kind:`column`,value:{name:`scope`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`diagnostic_events`,kind:`column`,value:{name:`event_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`diagnostic_events`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`diagnostic_events`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`diagnostic_events`,kind:`column`,value:{name:`sequence`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:5}},{table:`diagnostic_events`,kind:`primaryKey`,value:[`scope`,`event_key`]},{table:`diagnostic_events`,kind:`indexes`,value:2},{table:`diagnostic_events`,kind:`checks`,value:0},{table:`durable_background_processes`,kind:`table`,value:null},{table:`durable_background_processes`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`durable_background_processes`,kind:`column`,value:{name:`record_json`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`durable_background_processes`,kind:`primaryKey`,value:[`id`]},{table:`durable_background_processes`,kind:`indexes`,value:1},{table:`durable_background_processes`,kind:`checks`,value:0},{table:`exec_approvals_config`,kind:`table`,value:null},{table:`exec_approvals_config`,kind:`column`,value:{name:`config_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`exec_approvals_config`,kind:`column`,value:{name:`raw_json`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`exec_approvals_config`,kind:`column`,value:{name:`socket_path`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`exec_approvals_config`,kind:`column`,value:{name:`has_socket_token`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`exec_approvals_config`,kind:`column`,value:{name:`default_security`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`exec_approvals_config`,kind:`column`,value:{name:`default_ask`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`exec_approvals_config`,kind:`column`,value:{name:`default_ask_fallback`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`exec_approvals_config`,kind:`column`,value:{name:`auto_allow_skills`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`exec_approvals_config`,kind:`column`,value:{name:`agent_count`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`exec_approvals_config`,kind:`column`,value:{name:`allowlist_count`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`exec_approvals_config`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`exec_approvals_config`,kind:`primaryKey`,value:[`config_key`]},{table:`exec_approvals_config`,kind:`indexes`,value:1},{table:`exec_approvals_config`,kind:`checks`,value:0},{table:`execution_decision_facts`,kind:`table`,value:null},{table:`execution_decision_facts`,kind:`column`,value:{name:`cursor_id`,type:`bigint`,nullable:!1,identity:!1,default:null,position:1}},{table:`execution_decision_facts`,kind:`column`,value:{name:`receipt_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`execution_decision_facts`,kind:`column`,value:{name:`context_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`execution_decision_facts`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`execution_decision_facts`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`execution_decision_facts`,kind:`column`,value:{name:`action_id`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`execution_decision_facts`,kind:`column`,value:{name:`action_family`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`execution_decision_facts`,kind:`column`,value:{name:`decision_outcome`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`execution_decision_facts`,kind:`column`,value:{name:`coverage_state`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`execution_decision_facts`,kind:`column`,value:{name:`reason_code`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`execution_decision_facts`,kind:`column`,value:{name:`owner`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`execution_decision_facts`,kind:`column`,value:{name:`source_ref`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`execution_decision_facts`,kind:`column`,value:{name:`occurred_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:13}},{table:`execution_decision_facts`,kind:`column`,value:{name:`receipt_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:14}},{table:`execution_decision_facts`,kind:`column`,value:{name:`receipt_json`,type:`text`,nullable:!1,identity:!1,default:null,position:15}},{table:`execution_decision_facts`,kind:`primaryKey`,value:[`receipt_id`]},{table:`execution_decision_facts`,kind:`unique`,value:[`occurred_at`,`receipt_id`]},{table:`execution_decision_facts`,kind:`indexes`,value:5},{table:`execution_decision_facts`,kind:`checks`,value:14},{table:`execution_identity_contexts`,kind:`table`,value:null},{table:`execution_identity_contexts`,kind:`column`,value:{name:`context_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`coverage_state`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`context_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`context_json`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`execution_identity_contexts`,kind:`primaryKey`,value:[`context_id`]},{table:`execution_identity_contexts`,kind:`unique`,value:[`execution_id`]},{table:`execution_identity_contexts`,kind:`unique`,value:[`created_at`,`context_id`]},{table:`execution_identity_contexts`,kind:`indexes`,value:4},{table:`execution_identity_contexts`,kind:`checks`,value:7},{table:`execution_owner_lifecycle_bindings`,kind:`table`,value:null},{table:`execution_owner_lifecycle_bindings`,kind:`column`,value:{name:`owner_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`execution_owner_lifecycle_bindings`,kind:`column`,value:{name:`owner_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`execution_owner_lifecycle_bindings`,kind:`column`,value:{name:`context_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`execution_owner_lifecycle_bindings`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`execution_owner_lifecycle_bindings`,kind:`primaryKey`,value:[`owner_kind`,`owner_id`]},{table:`execution_owner_lifecycle_bindings`,kind:`indexes`,value:1},{table:`execution_owner_lifecycle_bindings`,kind:`checks`,value:0},{table:`flow_runs`,kind:`table`,value:null},{table:`flow_runs`,kind:`column`,value:{name:`flow_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`flow_runs`,kind:`column`,value:{name:`shape`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`flow_runs`,kind:`column`,value:{name:`sync_mode`,type:`text`,nullable:!1,identity:!1,default:`'managed'`,position:3}},{table:`flow_runs`,kind:`column`,value:{name:`owner_key`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`flow_runs`,kind:`column`,value:{name:`requester_origin_json`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`flow_runs`,kind:`column`,value:{name:`controller_id`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`flow_runs`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:7}},{table:`flow_runs`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`flow_runs`,kind:`column`,value:{name:`notify_policy`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`flow_runs`,kind:`column`,value:{name:`goal`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`flow_runs`,kind:`column`,value:{name:`current_step`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`flow_runs`,kind:`column`,value:{name:`blocked_task_id`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`flow_runs`,kind:`column`,value:{name:`blocked_summary`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`flow_runs`,kind:`column`,value:{name:`state_json`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`flow_runs`,kind:`column`,value:{name:`wait_json`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`flow_runs`,kind:`column`,value:{name:`cancel_requested_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:16}},{table:`flow_runs`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:17}},{table:`flow_runs`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:18}},{table:`flow_runs`,kind:`column`,value:{name:`ended_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:19}},{table:`flow_runs`,kind:`primaryKey`,value:[`flow_id`]},{table:`flow_runs`,kind:`indexes`,value:4},{table:`flow_runs`,kind:`checks`,value:0},{table:`gateway_boot_lifecycle`,kind:`table`,value:null},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`boot_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`pid`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`started_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`completed_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:4}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`outcome`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`startup_reason`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`reason`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`gateway_boot_lifecycle`,kind:`primaryKey`,value:[`boot_id`]},{table:`gateway_boot_lifecycle`,kind:`indexes`,value:2},{table:`gateway_boot_lifecycle`,kind:`checks`,value:0},{table:`gateway_restart_handoff`,kind:`table`,value:null},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`handoff_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`intent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`pid`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`process_instance_id`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`reason`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`restart_trace_started_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:10}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`restart_trace_last_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:11}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`source`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`restart_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:13}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`supervisor_mode`,type:`text`,nullable:!1,identity:!1,default:null,position:14}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:15}},{table:`gateway_restart_handoff`,kind:`primaryKey`,value:[`handoff_key`]},{table:`gateway_restart_handoff`,kind:`indexes`,value:2},{table:`gateway_restart_handoff`,kind:`checks`,value:0},{table:`gateway_restart_intent`,kind:`table`,value:null},{table:`gateway_restart_intent`,kind:`column`,value:{name:`intent_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`pid`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`reason`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`force`,type:`bigint`,nullable:!0,identity:!1,default:null,position:6}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`wait_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:7}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`gateway_restart_intent`,kind:`primaryKey`,value:[`intent_key`]},{table:`gateway_restart_intent`,kind:`indexes`,value:1},{table:`gateway_restart_intent`,kind:`checks`,value:0},{table:`gateway_restart_sentinel`,kind:`table`,value:null},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`sentinel_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`ts`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`thread_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`delivery_channel`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`delivery_to`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`delivery_account_id`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`message`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`continuation_json`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`doctor_hint`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`stats_json`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:!1,identity:!1,default:null,position:15}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:16}},{table:`gateway_restart_sentinel`,kind:`primaryKey`,value:[`sentinel_key`]},{table:`gateway_restart_sentinel`,kind:`indexes`,value:2},{table:`gateway_restart_sentinel`,kind:`checks`,value:0},{table:`github_personal_publication_requests`,kind:`table`,value:null},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`owner_profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`connection_generation`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`idempotency_key`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`request_digest`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`worktree_id`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`repository_fingerprint`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`identity_source`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`identity_profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`identity_account_id`,type:`bigint`,nullable:!1,identity:!1,default:null,position:13}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`identity_login`,type:`text`,nullable:!1,identity:!1,default:null,position:14}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`title`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`body`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:17}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`gateway_instance_id`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:!0,identity:!1,default:null,position:19}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`last_effect`,type:`text`,nullable:!0,identity:!1,default:null,position:20}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`effect_state`,type:`text`,nullable:!0,identity:!1,default:null,position:21}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`push_repository`,type:`text`,nullable:!1,identity:!1,default:null,position:22}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`repository`,type:`text`,nullable:!1,identity:!1,default:null,position:23}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`branch`,type:`text`,nullable:!1,identity:!1,default:null,position:24}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`base_branch`,type:`text`,nullable:!1,identity:!1,default:null,position:25}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`source_head_commit`,type:`text`,nullable:!1,identity:!1,default:null,position:26}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`source_index_tree`,type:`text`,nullable:!1,identity:!1,default:null,position:27}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`workspace_tree`,type:`text`,nullable:!1,identity:!1,default:null,position:28}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`head_commit`,type:`text`,nullable:!0,identity:!1,default:null,position:29}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`pull_request_url`,type:`text`,nullable:!0,identity:!1,default:null,position:30}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`error_code`,type:`text`,nullable:!0,identity:!1,default:null,position:31}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`next_action`,type:`text`,nullable:!0,identity:!1,default:null,position:32}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:33}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:34}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`reported_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:35}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`draft`,type:`bigint`,nullable:!0,identity:!1,default:null,position:36}},{table:`github_personal_publication_requests`,kind:`primaryKey`,value:[`request_id`]},{table:`github_personal_publication_requests`,kind:`unique`,value:[`owner_profile_id`,`session_id`,`idempotency_key`]},{table:`github_personal_publication_requests`,kind:`indexes`,value:4},{table:`github_personal_publication_requests`,kind:`checks`,value:37},{table:`github_publication_requests`,kind:`table`,value:null},{table:`github_publication_requests`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`github_publication_requests`,kind:`column`,value:{name:`idempotency_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`github_publication_requests`,kind:`column`,value:{name:`request_digest`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`github_publication_requests`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`github_publication_requests`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`github_publication_requests`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`github_publication_requests`,kind:`column`,value:{name:`worktree_id`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`github_publication_requests`,kind:`column`,value:{name:`repository_fingerprint`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`github_publication_requests`,kind:`column`,value:{name:`claim_id`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`github_publication_requests`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`github_publication_requests`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`github_publication_requests`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!0,identity:!1,default:null,position:12}},{table:`github_publication_requests`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`github_publication_requests`,kind:`column`,value:{name:`identity_source`,type:`text`,nullable:!1,identity:!1,default:null,position:14}},{table:`github_publication_requests`,kind:`column`,value:{name:`identity_profile_id`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`github_publication_requests`,kind:`column`,value:{name:`identity_account_id`,type:`bigint`,nullable:!1,identity:!1,default:null,position:16}},{table:`github_publication_requests`,kind:`column`,value:{name:`identity_login`,type:`text`,nullable:!1,identity:!1,default:null,position:17}},{table:`github_publication_requests`,kind:`column`,value:{name:`title`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`github_publication_requests`,kind:`column`,value:{name:`body`,type:`text`,nullable:!0,identity:!1,default:null,position:19}},{table:`github_publication_requests`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:20}},{table:`github_publication_requests`,kind:`column`,value:{name:`gateway_instance_id`,type:`text`,nullable:!0,identity:!1,default:null,position:21}},{table:`github_publication_requests`,kind:`column`,value:{name:`repository`,type:`text`,nullable:!0,identity:!1,default:null,position:22}},{table:`github_publication_requests`,kind:`column`,value:{name:`branch`,type:`text`,nullable:!1,identity:!1,default:null,position:23}},{table:`github_publication_requests`,kind:`column`,value:{name:`base_branch`,type:`text`,nullable:!0,identity:!1,default:null,position:24}},{table:`github_publication_requests`,kind:`column`,value:{name:`source_head_commit`,type:`text`,nullable:!0,identity:!1,default:null,position:25}},{table:`github_publication_requests`,kind:`column`,value:{name:`source_index_tree`,type:`text`,nullable:!0,identity:!1,default:null,position:26}},{table:`github_publication_requests`,kind:`column`,value:{name:`workspace_tree`,type:`text`,nullable:!0,identity:!1,default:null,position:27}},{table:`github_publication_requests`,kind:`column`,value:{name:`head_commit`,type:`text`,nullable:!0,identity:!1,default:null,position:28}},{table:`github_publication_requests`,kind:`column`,value:{name:`pull_request_url`,type:`text`,nullable:!0,identity:!1,default:null,position:29}},{table:`github_publication_requests`,kind:`column`,value:{name:`error_code`,type:`text`,nullable:!0,identity:!1,default:null,position:30}},{table:`github_publication_requests`,kind:`column`,value:{name:`next_action`,type:`text`,nullable:!0,identity:!1,default:null,position:31}},{table:`github_publication_requests`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:32}},{table:`github_publication_requests`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:33}},{table:`github_publication_requests`,kind:`column`,value:{name:`reported_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:34}},{table:`github_publication_requests`,kind:`column`,value:{name:`draft`,type:`bigint`,nullable:!0,identity:!1,default:null,position:35}},{table:`github_publication_requests`,kind:`primaryKey`,value:[`request_id`]},{table:`github_publication_requests`,kind:`unique`,value:[`session_id`,`idempotency_key`]},{table:`github_publication_requests`,kind:`indexes`,value:3},{table:`github_publication_requests`,kind:`checks`,value:9},{table:`github_publication_session_lifecycles`,kind:`table`,value:null},{table:`github_publication_session_lifecycles`,kind:`column`,value:{name:`publication_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`github_publication_session_lifecycles`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`github_publication_session_lifecycles`,kind:`column`,value:{name:`lifecycle_revision`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`github_publication_session_lifecycles`,kind:`column`,value:{name:`requester_authority_json`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`github_publication_session_lifecycles`,kind:`primaryKey`,value:[`publication_kind`,`request_id`]},{table:`github_publication_session_lifecycles`,kind:`indexes`,value:1},{table:`github_publication_session_lifecycles`,kind:`checks`,value:1},{table:`github_repository_publication_requests`,kind:`table`,value:null},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`owner_profile_id`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`connection_generation`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`idempotency_key`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`request_digest`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`session_lifecycle_revision`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`requester_authority_json`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`workspace_id`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`checkpoint_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`checkpoint_digest`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`claim_id`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!0,identity:!1,default:null,position:17}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:!0,identity:!1,default:null,position:18}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`identity_source`,type:`text`,nullable:!1,identity:!1,default:null,position:19}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`identity_profile_id`,type:`text`,nullable:!0,identity:!1,default:null,position:20}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`identity_account_id`,type:`bigint`,nullable:!1,identity:!1,default:null,position:21}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`identity_login`,type:`text`,nullable:!1,identity:!1,default:null,position:22}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`title`,type:`text`,nullable:!0,identity:!1,default:null,position:23}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`body`,type:`text`,nullable:!0,identity:!1,default:null,position:24}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:25}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`gateway_instance_id`,type:`text`,nullable:!0,identity:!1,default:null,position:26}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:!0,identity:!1,default:null,position:27}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`last_effect`,type:`text`,nullable:!0,identity:!1,default:null,position:28}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`effect_state`,type:`text`,nullable:!0,identity:!1,default:null,position:29}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`push_repository`,type:`text`,nullable:!0,identity:!1,default:null,position:30}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`repository`,type:`text`,nullable:!0,identity:!1,default:null,position:31}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`branch`,type:`text`,nullable:!1,identity:!1,default:null,position:32}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`base_branch`,type:`text`,nullable:!0,identity:!1,default:null,position:33}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`source_head_commit`,type:`text`,nullable:!0,identity:!1,default:null,position:34}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`source_index_tree`,type:`text`,nullable:!0,identity:!1,default:null,position:35}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`workspace_tree`,type:`text`,nullable:!0,identity:!1,default:null,position:36}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`previous_head_commit`,type:`text`,nullable:!0,identity:!1,default:null,position:37}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`pushed_head_commit`,type:`text`,nullable:!0,identity:!1,default:null,position:38}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`head_commit`,type:`text`,nullable:!0,identity:!1,default:null,position:39}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`pull_request_url`,type:`text`,nullable:!0,identity:!1,default:null,position:40}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`error_code`,type:`text`,nullable:!0,identity:!1,default:null,position:41}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`next_action`,type:`text`,nullable:!0,identity:!1,default:null,position:42}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:43}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:44}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`reported_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:45}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`draft`,type:`bigint`,nullable:!0,identity:!1,default:null,position:46}},{table:`github_repository_publication_requests`,kind:`primaryKey`,value:[`request_id`]},{table:`github_repository_publication_requests`,kind:`indexes`,value:3},{table:`github_repository_publication_requests`,kind:`checks`,value:7},{table:`local_workspace_manifest_nodes`,kind:`table`,value:null},{table:`local_workspace_manifest_nodes`,kind:`column`,value:{name:`worktree_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`local_workspace_manifest_nodes`,kind:`column`,value:{name:`path`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`local_workspace_manifest_nodes`,kind:`column`,value:{name:`node_json`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`local_workspace_manifest_nodes`,kind:`primaryKey`,value:[`worktree_id`,`path`]},{table:`local_workspace_manifest_nodes`,kind:`foreignKey`,value:{columns:[`worktree_id`],target:`local_workspace_projections`,targetColumns:[`worktree_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`local_workspace_manifest_nodes`,kind:`indexes`,value:1},{table:`local_workspace_manifest_nodes`,kind:`checks`,value:0},{table:`local_workspace_projections`,kind:`table`,value:null},{table:`local_workspace_projections`,kind:`column`,value:{name:`worktree_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`local_workspace_projections`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`local_workspace_projections`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`local_workspace_projections`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`local_workspace_projections`,kind:`column`,value:{name:`lifecycle_revision`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`local_workspace_projections`,kind:`column`,value:{name:`projection_path`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`local_workspace_projections`,kind:`column`,value:{name:`base_commit`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`local_workspace_projections`,kind:`column`,value:{name:`source_paths_json`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`local_workspace_projections`,kind:`column`,value:{name:`baseline_json`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`local_workspace_projections`,kind:`column`,value:{name:`baseline_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`local_workspace_projections`,kind:`column`,value:{name:`pending_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`local_workspace_projections`,kind:`column`,value:{name:`pending_target`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`local_workspace_projections`,kind:`column`,value:{name:`paused_runtimes_json`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`local_workspace_projections`,kind:`column`,value:{name:`journal_json`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`local_workspace_projections`,kind:`column`,value:{name:`journal_pack`,type:`bytea`,nullable:!0,identity:!1,default:null,position:15}},{table:`local_workspace_projections`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:16}},{table:`local_workspace_projections`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:17}},{table:`local_workspace_projections`,kind:`column`,value:{name:`checkpoint_json`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`local_workspace_projections`,kind:`column`,value:{name:`tree_root_digest`,type:`bytea`,nullable:!0,identity:!1,default:null,position:19}},{table:`local_workspace_projections`,kind:`column`,value:{name:`source_paths_digest`,type:`bytea`,nullable:!0,identity:!1,default:null,position:20}},{table:`local_workspace_projections`,kind:`column`,value:{name:`canonical_fingerprints`,type:`bytea`,nullable:!0,identity:!1,default:null,position:21}},{table:`local_workspace_projections`,kind:`column`,value:{name:`projection_fingerprints`,type:`bytea`,nullable:!0,identity:!1,default:null,position:22}},{table:`local_workspace_projections`,kind:`primaryKey`,value:[`worktree_id`]},{table:`local_workspace_projections`,kind:`unique`,value:[`projection_path`]},{table:`local_workspace_projections`,kind:`indexes`,value:2},{table:`local_workspace_projections`,kind:`checks`,value:5},{table:`local_workspace_source_path_sets`,kind:`table`,value:null},{table:`local_workspace_source_path_sets`,kind:`column`,value:{name:`path_digest`,type:`bytea`,nullable:!1,identity:!1,default:null,position:1}},{table:`local_workspace_source_path_sets`,kind:`column`,value:{name:`paths_zstd`,type:`bytea`,nullable:!1,identity:!1,default:null,position:2}},{table:`local_workspace_source_path_sets`,kind:`column`,value:{name:`sweep_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`local_workspace_source_path_sets`,kind:`primaryKey`,value:[`path_digest`]},{table:`local_workspace_source_path_sets`,kind:`indexes`,value:1},{table:`local_workspace_source_path_sets`,kind:`checks`,value:1},{table:`local_workspace_tree_packs`,kind:`table`,value:null},{table:`local_workspace_tree_packs`,kind:`column`,value:{name:`tree_digest`,type:`bytea`,nullable:!1,identity:!1,default:null,position:1}},{table:`local_workspace_tree_packs`,kind:`column`,value:{name:`records_json`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`local_workspace_tree_packs`,kind:`column`,value:{name:`children_json`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`local_workspace_tree_packs`,kind:`column`,value:{name:`sweep_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`local_workspace_tree_packs`,kind:`primaryKey`,value:[`tree_digest`]},{table:`local_workspace_tree_packs`,kind:`indexes`,value:1},{table:`local_workspace_tree_packs`,kind:`checks`,value:1},{table:`macos_port_guardian_records`,kind:`table`,value:null},{table:`macos_port_guardian_records`,kind:`column`,value:{name:`pid`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`macos_port_guardian_records`,kind:`column`,value:{name:`port`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`macos_port_guardian_records`,kind:`column`,value:{name:`command`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`macos_port_guardian_records`,kind:`column`,value:{name:`mode`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`macos_port_guardian_records`,kind:`column`,value:{name:`timestamp`,type:`double precision`,nullable:!1,identity:!1,default:null,position:5}},{table:`macos_port_guardian_records`,kind:`primaryKey`,value:[`pid`]},{table:`macos_port_guardian_records`,kind:`indexes`,value:2},{table:`macos_port_guardian_records`,kind:`checks`,value:0},{table:`managed_outgoing_image_records`,kind:`table`,value:null},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`attachment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`message_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`created_at`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`updated_at`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`retention_class`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`alt`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_media_root`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_media_id`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_media_subdir`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_content_type`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_width`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_height`,type:`bigint`,nullable:!0,identity:!1,default:null,position:14}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_size_bytes`,type:`bigint`,nullable:!0,identity:!1,default:null,position:15}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_filename`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`record_json`,type:`text`,nullable:!1,identity:!1,default:null,position:17}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`cleanup_pending`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:18}},{table:`managed_outgoing_image_records`,kind:`primaryKey`,value:[`attachment_id`]},{table:`managed_outgoing_image_records`,kind:`indexes`,value:5},{table:`managed_outgoing_image_records`,kind:`checks`,value:1},{table:`mcp_oauth_pending_authorizations`,kind:`table`,value:null},{table:`mcp_oauth_pending_authorizations`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`mcp_oauth_pending_authorizations`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`mcp_oauth_pending_authorizations`,kind:`column`,value:{name:`create_time`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`mcp_oauth_pending_authorizations`,kind:`primaryKey`,value:[`state`]},{table:`mcp_oauth_pending_authorizations`,kind:`indexes`,value:1},{table:`mcp_oauth_pending_authorizations`,kind:`checks`,value:0},{table:`mcp_oauth_stores`,kind:`table`,value:null},{table:`mcp_oauth_stores`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`mcp_oauth_stores`,kind:`column`,value:{name:`format_version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`mcp_oauth_stores`,kind:`column`,value:{name:`store_json`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`mcp_oauth_stores`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`mcp_oauth_stores`,kind:`primaryKey`,value:[`store_key`]},{table:`mcp_oauth_stores`,kind:`indexes`,value:1},{table:`mcp_oauth_stores`,kind:`checks`,value:1},{table:`meeting_transcript_sessions`,kind:`table`,value:null},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`started_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:1}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`started_at`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`selector`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`export_key`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`session_slug`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`provider_id`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`title`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_json`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_account_id`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_guild_id`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_channel_id`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_meeting_url`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_thread_ts`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_file_id`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`stopped_at`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`metadata_json`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`metadata_agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`export_manifest_json`,type:`text`,nullable:!1,identity:!1,default:`'{}'`,position:19}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`export_pending_json`,type:`text`,nullable:!1,identity:!1,default:`'[]'`,position:20}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`next_utterance_seq`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:21}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:22}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:23}},{table:`meeting_transcript_sessions`,kind:`primaryKey`,value:[`session_id`,`started_at`]},{table:`meeting_transcript_sessions`,kind:`unique`,value:[`selector`]},{table:`meeting_transcript_sessions`,kind:`indexes`,value:10},{table:`meeting_transcript_sessions`,kind:`checks`,value:3},{table:`meeting_transcript_summaries`,kind:`table`,value:null},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`session_started_at`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`generated_at`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`summary_json`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`overview`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`markdown`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`utterance_count`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`meeting_transcript_summaries`,kind:`primaryKey`,value:[`session_id`,`session_started_at`]},{table:`meeting_transcript_summaries`,kind:`foreignKey`,value:{columns:[`session_id`,`session_started_at`],target:`meeting_transcript_sessions`,targetColumns:[`session_id`,`started_at`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`meeting_transcript_summaries`,kind:`indexes`,value:1},{table:`meeting_transcript_summaries`,kind:`checks`,value:2},{table:`meeting_transcript_utterances`,kind:`table`,value:null},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`session_started_at`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`sequence`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`utterance_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`started_at`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`ended_at`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`speaker_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`speaker_label`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`text`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`final`,type:`bigint`,nullable:!0,identity:!1,default:null,position:10}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`metadata_json`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`meeting_transcript_utterances`,kind:`primaryKey`,value:[`session_id`,`session_started_at`,`sequence`]},{table:`meeting_transcript_utterances`,kind:`foreignKey`,value:{columns:[`session_id`,`session_started_at`],target:`meeting_transcript_sessions`,targetColumns:[`session_id`,`started_at`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`meeting_transcript_utterances`,kind:`indexes`,value:2},{table:`meeting_transcript_utterances`,kind:`checks`,value:2},{table:`migration_runs`,kind:`table`,value:null},{table:`migration_runs`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`migration_runs`,kind:`column`,value:{name:`started_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`migration_runs`,kind:`column`,value:{name:`finished_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:3}},{table:`migration_runs`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`migration_runs`,kind:`column`,value:{name:`report_json`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`migration_runs`,kind:`primaryKey`,value:[`id`]},{table:`migration_runs`,kind:`indexes`,value:2},{table:`migration_runs`,kind:`checks`,value:0},{table:`migration_sources`,kind:`table`,value:null},{table:`migration_sources`,kind:`column`,value:{name:`source_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`migration_sources`,kind:`column`,value:{name:`migration_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`migration_sources`,kind:`column`,value:{name:`source_path`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`migration_sources`,kind:`column`,value:{name:`target_table`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`migration_sources`,kind:`column`,value:{name:`source_sha256`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`migration_sources`,kind:`column`,value:{name:`source_size_bytes`,type:`bigint`,nullable:!0,identity:!1,default:null,position:6}},{table:`migration_sources`,kind:`column`,value:{name:`source_record_count`,type:`bigint`,nullable:!0,identity:!1,default:null,position:7}},{table:`migration_sources`,kind:`column`,value:{name:`last_run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`migration_sources`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`migration_sources`,kind:`column`,value:{name:`imported_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`migration_sources`,kind:`column`,value:{name:`removed_source`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:11}},{table:`migration_sources`,kind:`column`,value:{name:`report_json`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`migration_sources`,kind:`primaryKey`,value:[`source_key`]},{table:`migration_sources`,kind:`foreignKey`,value:{columns:[`last_run_id`],target:`migration_runs`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`migration_sources`,kind:`indexes`,value:3},{table:`migration_sources`,kind:`checks`,value:0},{table:`native_hook_relay_bridges`,kind:`table`,value:null},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`relay_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`pid`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`hostname`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`port`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`token`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`native_hook_relay_bridges`,kind:`primaryKey`,value:[`relay_id`]},{table:`native_hook_relay_bridges`,kind:`indexes`,value:2},{table:`native_hook_relay_bridges`,kind:`checks`,value:0},{table:`node_worker_launch_boots`,kind:`table`,value:null},{table:`node_worker_launch_boots`,kind:`column`,value:{name:`launch_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`node_worker_launch_boots`,kind:`column`,value:{name:`boot_id`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`node_worker_launch_boots`,kind:`primaryKey`,value:[`launch_id`]},{table:`node_worker_launch_boots`,kind:`foreignKey`,value:{columns:[`launch_id`],target:`node_worker_launches`,targetColumns:[`launch_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`node_worker_launch_boots`,kind:`indexes`,value:1},{table:`node_worker_launch_boots`,kind:`checks`,value:1},{table:`node_worker_launch_cleanup`,kind:`table`,value:null},{table:`node_worker_launch_cleanup`,kind:`column`,value:{name:`launch_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`node_worker_launch_cleanup`,kind:`column`,value:{name:`cleanup_mode`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`node_worker_launch_cleanup`,kind:`column`,value:{name:`lineage_settled`,type:`bigint`,nullable:!0,identity:!1,default:null,position:3}},{table:`node_worker_launch_cleanup`,kind:`primaryKey`,value:[`launch_id`]},{table:`node_worker_launch_cleanup`,kind:`foreignKey`,value:{columns:[`launch_id`],target:`node_worker_launches`,targetColumns:[`launch_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`node_worker_launch_cleanup`,kind:`indexes`,value:1},{table:`node_worker_launch_cleanup`,kind:`checks`,value:2},{table:`node_worker_launch_containers`,kind:`table`,value:null},{table:`node_worker_launch_containers`,kind:`column`,value:{name:`launch_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`node_worker_launch_containers`,kind:`column`,value:{name:`container_json`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`node_worker_launch_containers`,kind:`primaryKey`,value:[`launch_id`]},{table:`node_worker_launch_containers`,kind:`indexes`,value:1},{table:`node_worker_launch_containers`,kind:`checks`,value:0},{table:`node_worker_launch_process_scopes`,kind:`table`,value:null},{table:`node_worker_launch_process_scopes`,kind:`column`,value:{name:`launch_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`node_worker_launch_process_scopes`,kind:`column`,value:{name:`scope_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`node_worker_launch_process_scopes`,kind:`column`,value:{name:`descendants_reaped`,type:`bigint`,nullable:!0,identity:!1,default:null,position:3}},{table:`node_worker_launch_process_scopes`,kind:`primaryKey`,value:[`launch_id`]},{table:`node_worker_launch_process_scopes`,kind:`foreignKey`,value:{columns:[`launch_id`],target:`node_worker_launches`,targetColumns:[`launch_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`node_worker_launch_process_scopes`,kind:`indexes`,value:1},{table:`node_worker_launch_process_scopes`,kind:`checks`,value:2},{table:`node_worker_launches`,kind:`table`,value:null},{table:`node_worker_launches`,kind:`column`,value:{name:`launch_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`node_worker_launches`,kind:`column`,value:{name:`plan_hash`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`node_worker_launches`,kind:`column`,value:{name:`gateway_namespace`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`node_worker_launches`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`node_worker_launches`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`node_worker_launches`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`node_worker_launches`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`node_worker_launches`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`node_worker_launches`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`node_worker_launches`,kind:`column`,value:{name:`supervisor_pid`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`node_worker_launches`,kind:`column`,value:{name:`supervisor_start_time`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`node_worker_launches`,kind:`column`,value:{name:`worker_pid`,type:`bigint`,nullable:!0,identity:!1,default:null,position:12}},{table:`node_worker_launches`,kind:`column`,value:{name:`worker_start_time`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`node_worker_launches`,kind:`column`,value:{name:`result_json`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`node_worker_launches`,kind:`column`,value:{name:`error_text`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`node_worker_launches`,kind:`column`,value:{name:`completed_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:16}},{table:`node_worker_launches`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:17}},{table:`node_worker_launches`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:18}},{table:`node_worker_launches`,kind:`primaryKey`,value:[`launch_id`]},{table:`node_worker_launches`,kind:`indexes`,value:2},{table:`node_worker_launches`,kind:`checks`,value:20},{table:`node_worker_prepared_workspaces`,kind:`table`,value:null},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`preparation_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`cache_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`gateway_namespace`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`workspace_dir`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`home_dir`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`source_manifest_ref`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`prepared_manifest_ref`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!0,identity:!1,default:null,position:12}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:13}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`bound_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:14}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`retired_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:15}},{table:`node_worker_prepared_workspaces`,kind:`primaryKey`,value:[`preparation_key`]},{table:`node_worker_prepared_workspaces`,kind:`unique`,value:[`workspace_dir`]},{table:`node_worker_prepared_workspaces`,kind:`indexes`,value:2},{table:`node_worker_prepared_workspaces`,kind:`checks`,value:15},{table:`node_worker_turns`,kind:`table`,value:null},{table:`node_worker_turns`,kind:`column`,value:{name:`turn_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`node_worker_turns`,kind:`column`,value:{name:`owner_launch_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`node_worker_turns`,kind:`column`,value:{name:`plan_hash`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`node_worker_turns`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`node_worker_turns`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`node_worker_turns`,kind:`column`,value:{name:`result_json`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`node_worker_turns`,kind:`column`,value:{name:`error_text`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`node_worker_turns`,kind:`column`,value:{name:`completed_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`node_worker_turns`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`node_worker_turns`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`node_worker_turns`,kind:`primaryKey`,value:[`turn_id`]},{table:`node_worker_turns`,kind:`foreignKey`,value:{columns:[`owner_launch_id`],target:`node_worker_launches`,targetColumns:[`launch_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`node_worker_turns`,kind:`indexes`,value:3},{table:`node_worker_turns`,kind:`checks`,value:10},{table:`official_external_plugin_catalog_snapshots`,kind:`table`,value:null},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`feed_url`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`body`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`status`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`etag`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`last_modified`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`checksum`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`saved_at`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`trust_mode`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`trust_key_id`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`trust_signature_count`,type:`bigint`,nullable:!0,identity:!1,default:null,position:10}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`trust_threshold`,type:`bigint`,nullable:!0,identity:!1,default:null,position:11}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`trust_verified_at`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:13}},{table:`official_external_plugin_catalog_snapshots`,kind:`primaryKey`,value:[`feed_url`]},{table:`official_external_plugin_catalog_snapshots`,kind:`indexes`,value:2},{table:`official_external_plugin_catalog_snapshots`,kind:`checks`,value:0},{table:`operator_approval_execution_identities`,kind:`table`,value:null},{table:`operator_approval_execution_identities`,kind:`column`,value:{name:`approval_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`operator_approval_execution_identities`,kind:`column`,value:{name:`source_context_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`operator_approval_execution_identities`,kind:`column`,value:{name:`source_execution_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`operator_approval_execution_identities`,kind:`primaryKey`,value:[`approval_id`]},{table:`operator_approval_execution_identities`,kind:`foreignKey`,value:{columns:[`approval_id`],target:`operator_approvals`,targetColumns:[`approval_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`operator_approval_execution_identities`,kind:`indexes`,value:1},{table:`operator_approval_execution_identities`,kind:`checks`,value:2},{table:`operator_approval_standing_grant_generations`,kind:`table`,value:null},{table:`operator_approval_standing_grant_generations`,kind:`column`,value:{name:`grant_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`operator_approval_standing_grant_generations`,kind:`column`,value:{name:`job_definition_generation`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`operator_approval_standing_grant_generations`,kind:`primaryKey`,value:[`grant_id`]},{table:`operator_approval_standing_grant_generations`,kind:`foreignKey`,value:{columns:[`grant_id`],target:`operator_approval_standing_grants`,targetColumns:[`grant_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`operator_approval_standing_grant_generations`,kind:`indexes`,value:1},{table:`operator_approval_standing_grant_generations`,kind:`checks`,value:1},{table:`operator_approval_standing_grants`,kind:`table`,value:null},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`grant_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`minted_by_approval_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`cron_job_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`job_config_revision`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`operation_binding`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`revoked_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:9}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`revoked_by`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`last_used_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:11}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`use_count`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:12}},{table:`operator_approval_standing_grants`,kind:`primaryKey`,value:[`grant_id`]},{table:`operator_approval_standing_grants`,kind:`foreignKey`,value:{columns:[`minted_by_approval_id`],target:`operator_approvals`,targetColumns:[`approval_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`operator_approval_standing_grants`,kind:`indexes`,value:2},{table:`operator_approval_standing_grants`,kind:`checks`,value:6},{table:`operator_approvals`,kind:`table`,value:null},{table:`operator_approvals`,kind:`column`,value:{name:`cursor_id`,type:`bigint`,nullable:!1,identity:!1,default:null,position:1}},{table:`operator_approvals`,kind:`column`,value:{name:`approval_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`operator_approvals`,kind:`column`,value:{name:`resolution_ref`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`operator_approvals`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`operator_approvals`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`operator_approvals`,kind:`column`,value:{name:`presentation_json`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`operator_approvals`,kind:`column`,value:{name:`requested_by_device_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`operator_approvals`,kind:`column`,value:{name:`requested_by_client_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`operator_approvals`,kind:`column`,value:{name:`requested_by_device_token_auth`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:9}},{table:`operator_approvals`,kind:`column`,value:{name:`reviewer_device_ids_json`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`operator_approvals`,kind:`column`,value:{name:`source_agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`operator_approvals`,kind:`column`,value:{name:`source_session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`operator_approvals`,kind:`column`,value:{name:`source_session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`operator_approvals`,kind:`column`,value:{name:`source_run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`operator_approvals`,kind:`column`,value:{name:`source_tool_call_id`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`operator_approvals`,kind:`column`,value:{name:`source_tool_name`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`operator_approvals`,kind:`column`,value:{name:`audience_session_keys_json`,type:`text`,nullable:!1,identity:!1,default:null,position:17}},{table:`operator_approvals`,kind:`column`,value:{name:`runtime_epoch`,type:`text`,nullable:!1,identity:!1,default:null,position:18}},{table:`operator_approvals`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:19}},{table:`operator_approvals`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:20}},{table:`operator_approvals`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:21}},{table:`operator_approvals`,kind:`column`,value:{name:`decision`,type:`text`,nullable:!0,identity:!1,default:null,position:22}},{table:`operator_approvals`,kind:`column`,value:{name:`terminal_reason`,type:`text`,nullable:!0,identity:!1,default:null,position:23}},{table:`operator_approvals`,kind:`column`,value:{name:`resolved_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:24}},{table:`operator_approvals`,kind:`column`,value:{name:`resolver_kind`,type:`text`,nullable:!0,identity:!1,default:null,position:25}},{table:`operator_approvals`,kind:`column`,value:{name:`resolver_id`,type:`text`,nullable:!0,identity:!1,default:null,position:26}},{table:`operator_approvals`,kind:`column`,value:{name:`consumed_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:27}},{table:`operator_approvals`,kind:`column`,value:{name:`consumed_by`,type:`text`,nullable:!0,identity:!1,default:null,position:28}},{table:`operator_approvals`,kind:`primaryKey`,value:[`approval_id`]},{table:`operator_approvals`,kind:`indexes`,value:8},{table:`operator_approvals`,kind:`checks`,value:16},{table:`outbound_media_provenance`,kind:`table`,value:null},{table:`outbound_media_provenance`,kind:`column`,value:{name:`realpath`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`outbound_media_provenance`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`outbound_media_provenance`,kind:`column`,value:{name:`version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`outbound_media_provenance`,kind:`column`,value:{name:`sha256`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`outbound_media_provenance`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`outbound_media_provenance`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`outbound_media_provenance`,kind:`primaryKey`,value:[`realpath`]},{table:`outbound_media_provenance`,kind:`indexes`,value:1},{table:`outbound_media_provenance`,kind:`checks`,value:0},{table:`outbound_message_execution_bindings`,kind:`table`,value:null},{table:`outbound_message_execution_bindings`,kind:`column`,value:{name:`event_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`outbound_message_execution_bindings`,kind:`column`,value:{name:`context_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`outbound_message_execution_bindings`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`outbound_message_execution_bindings`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`outbound_message_execution_bindings`,kind:`primaryKey`,value:[`event_id`]},{table:`outbound_message_execution_bindings`,kind:`foreignKey`,value:{columns:[`event_id`],target:`audit_events`,targetColumns:[`event_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`outbound_message_execution_bindings`,kind:`indexes`,value:2},{table:`outbound_message_execution_bindings`,kind:`checks`,value:3},{table:`outbound_message_progress`,kind:`table`,value:null},{table:`outbound_message_progress`,kind:`column`,value:{name:`sequence`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`outbound_message_progress`,kind:`column`,value:{name:`progress_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`outbound_message_progress`,kind:`column`,value:{name:`source_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`outbound_message_progress`,kind:`column`,value:{name:`source_sequence`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`outbound_message_progress`,kind:`column`,value:{name:`schema_version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`outbound_message_progress`,kind:`column`,value:{name:`occurred_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`outbound_message_progress`,kind:`column`,value:{name:`action`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`outbound_message_progress`,kind:`column`,value:{name:`outcome`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`outbound_message_progress`,kind:`column`,value:{name:`actor_type`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`outbound_message_progress`,kind:`column`,value:{name:`actor_id`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`outbound_message_progress`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`outbound_message_progress`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`outbound_message_progress`,kind:`column`,value:{name:`context_id`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`outbound_message_progress`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`outbound_message_progress`,kind:`column`,value:{name:`channel`,type:`text`,nullable:!1,identity:!1,default:null,position:15}},{table:`outbound_message_progress`,kind:`column`,value:{name:`conversation_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:16}},{table:`outbound_message_progress`,kind:`column`,value:{name:`duration_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:17}},{table:`outbound_message_progress`,kind:`column`,value:{name:`account_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`outbound_message_progress`,kind:`column`,value:{name:`conversation_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:19}},{table:`outbound_message_progress`,kind:`column`,value:{name:`target_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:20}},{table:`outbound_message_progress`,kind:`primaryKey`,value:[`sequence`]},{table:`outbound_message_progress`,kind:`unique`,value:[`progress_id`]},{table:`outbound_message_progress`,kind:`unique`,value:[`source_id`]},{table:`outbound_message_progress`,kind:`unique`,value:[`occurred_at`,`progress_id`]},{table:`outbound_message_progress`,kind:`indexes`,value:6},{table:`outbound_message_progress`,kind:`checks`,value:14},{table:`plugin_binding_approvals`,kind:`table`,value:null},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`plugin_root`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`channel`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`plugin_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`plugin_name`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`approved_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`plugin_binding_approvals`,kind:`primaryKey`,value:[`plugin_root`,`channel`,`account_id`]},{table:`plugin_binding_approvals`,kind:`indexes`,value:2},{table:`plugin_binding_approvals`,kind:`checks`,value:0},{table:`plugin_blob_entries`,kind:`table`,value:null},{table:`plugin_blob_entries`,kind:`column`,value:{name:`plugin_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`namespace`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`entry_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`metadata_json`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`blob`,type:`bytea`,nullable:!1,identity:!1,default:null,position:5}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:7}},{table:`plugin_blob_entries`,kind:`primaryKey`,value:[`plugin_id`,`namespace`,`entry_key`]},{table:`plugin_blob_entries`,kind:`indexes`,value:3},{table:`plugin_blob_entries`,kind:`checks`,value:0},{table:`plugin_state_entries`,kind:`table`,value:null},{table:`plugin_state_entries`,kind:`column`,value:{name:`plugin_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`plugin_state_entries`,kind:`column`,value:{name:`namespace`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`plugin_state_entries`,kind:`column`,value:{name:`entry_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`plugin_state_entries`,kind:`column`,value:{name:`value_json`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`plugin_state_entries`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`plugin_state_entries`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:6}},{table:`plugin_state_entries`,kind:`primaryKey`,value:[`plugin_id`,`namespace`,`entry_key`]},{table:`plugin_state_entries`,kind:`indexes`,value:3},{table:`plugin_state_entries`,kind:`checks`,value:0},{table:`projects`,kind:`table`,value:null},{table:`projects`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`projects`,kind:`column`,value:{name:`display_name`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`projects`,kind:`column`,value:{name:`repo_root`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`projects`,kind:`column`,value:{name:`origin_url`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`projects`,kind:`column`,value:{name:`source`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`projects`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`projects`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`projects`,kind:`primaryKey`,value:[`id`]},{table:`projects`,kind:`indexes`,value:1},{table:`projects`,kind:`checks`,value:1},{table:`sandbox_persistent_execs`,kind:`table`,value:null},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`owner_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`source_identity`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`attempt_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`owner_json`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`backend_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`backend_target_json`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`workspace_binding_json`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`container_id`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`container_name`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`container_started_at`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`phase`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`receipt_json`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`error`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:15}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:16}},{table:`sandbox_persistent_execs`,kind:`primaryKey`,value:[`owner_key`]},{table:`sandbox_persistent_execs`,kind:`unique`,value:[`attempt_id`]},{table:`sandbox_persistent_execs`,kind:`indexes`,value:5},{table:`sandbox_persistent_execs`,kind:`checks`,value:4},{table:`sandbox_registry_entries`,kind:`table`,value:null},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`registry_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`container_name`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`backend_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`runtime_label`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`image`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:7}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`last_used_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`config_label_kind`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`config_hash`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`cdp_port`,type:`bigint`,nullable:!0,identity:!1,default:null,position:11}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`no_vnc_port`,type:`bigint`,nullable:!0,identity:!1,default:null,position:12}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`entry_json`,type:`text`,nullable:!1,identity:!1,default:null,position:13}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:14}},{table:`sandbox_registry_entries`,kind:`primaryKey`,value:[`registry_kind`,`container_name`]},{table:`sandbox_registry_entries`,kind:`indexes`,value:4},{table:`sandbox_registry_entries`,kind:`checks`,value:0},{table:`schema_meta`,kind:`table`,value:null},{table:`schema_meta`,kind:`column`,value:{name:`meta_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`schema_meta`,kind:`column`,value:{name:`role`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`schema_meta`,kind:`column`,value:{name:`schema_version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`schema_meta`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`schema_meta`,kind:`column`,value:{name:`app_version`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`schema_meta`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`schema_meta`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`schema_meta`,kind:`primaryKey`,value:[`meta_key`]},{table:`schema_meta`,kind:`indexes`,value:1},{table:`schema_meta`,kind:`checks`,value:0},{table:`secret_store_entries`,kind:`table`,value:null},{table:`secret_store_entries`,kind:`column`,value:{name:`scope_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`secret_store_entries`,kind:`column`,value:{name:`scope_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`secret_store_entries`,kind:`column`,value:{name:`name`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`secret_store_entries`,kind:`column`,value:{name:`value`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`secret_store_entries`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`secret_store_entries`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`secret_store_entries`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`secret_store_entries`,kind:`column`,value:{name:`updated_by`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`secret_store_entries`,kind:`column`,value:{name:`deleted_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:9}},{table:`secret_store_entries`,kind:`column`,value:{name:`allowed_hosts`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`secret_store_entries`,kind:`primaryKey`,value:[`scope_kind`,`scope_id`,`name`]},{table:`secret_store_entries`,kind:`indexes`,value:2},{table:`secret_store_entries`,kind:`checks`,value:5},{table:`session_groups`,kind:`table`,value:null},{table:`session_groups`,kind:`column`,value:{name:`name`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_groups`,kind:`column`,value:{name:`position`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_groups`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_groups`,kind:`column`,value:{name:`cwd`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`session_groups`,kind:`column`,value:{name:`worktree`,type:`bigint`,nullable:!0,identity:!1,default:null,position:5}},{table:`session_groups`,kind:`primaryKey`,value:[`name`]},{table:`session_groups`,kind:`indexes`,value:1},{table:`session_groups`,kind:`checks`,value:0},{table:`session_repository_workspaces`,kind:`table`,value:null},{table:`session_repository_workspaces`,kind:`column`,value:{name:`workspace_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`url`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`requested_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`run_setup_script`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:6}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`base_commit`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`base_manifest_hash`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`branch`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`checkpoint_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`manifest_hash`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:13}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:14}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`disk_authority_json`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`session_repository_workspaces`,kind:`primaryKey`,value:[`workspace_id`]},{table:`session_repository_workspaces`,kind:`unique`,value:[`agent_id`,`session_key`]},{table:`session_repository_workspaces`,kind:`indexes`,value:2},{table:`session_repository_workspaces`,kind:`checks`,value:11},{table:`session_state_events`,kind:`table`,value:null},{table:`session_state_events`,kind:`column`,value:{name:`sequence`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`session_state_events`,kind:`column`,value:{name:`dedupe_key`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`session_state_events`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_state_events`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`session_state_events`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`session_state_events`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`session_state_events`,kind:`column`,value:{name:`actor_type`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`session_state_events`,kind:`column`,value:{name:`actor_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`session_state_events`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`session_state_events`,kind:`column`,value:{name:`occurred_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`session_state_events`,kind:`column`,value:{name:`summary`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`session_state_events`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`session_state_events`,kind:`primaryKey`,value:[`sequence`]},{table:`session_state_events`,kind:`unique`,value:[`dedupe_key`]},{table:`session_state_events`,kind:`indexes`,value:4},{table:`session_state_events`,kind:`checks`,value:0},{table:`session_state_heads`,kind:`table`,value:null},{table:`session_state_heads`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_state_heads`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_state_heads`,kind:`column`,value:{name:`last_sequence`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_state_heads`,kind:`column`,value:{name:`pruned_max_sequence`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:4}},{table:`session_state_heads`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`session_state_heads`,kind:`primaryKey`,value:[`session_key`,`agent_id`]},{table:`session_state_heads`,kind:`indexes`,value:1},{table:`session_state_heads`,kind:`checks`,value:0},{table:`session_upstream_links`,kind:`table`,value:null},{table:`session_upstream_links`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_upstream_links`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_upstream_links`,kind:`column`,value:{name:`catalog_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_upstream_links`,kind:`column`,value:{name:`host_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`session_upstream_links`,kind:`column`,value:{name:`thread_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`session_upstream_links`,kind:`column`,value:{name:`upstream_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`session_upstream_links`,kind:`column`,value:{name:`upstream_ref_json`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`session_upstream_links`,kind:`column`,value:{name:`last_marker_json`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`session_upstream_links`,kind:`column`,value:{name:`last_scanned_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:9}},{table:`session_upstream_links`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`session_upstream_links`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`session_upstream_links`,kind:`primaryKey`,value:[`session_key`,`agent_id`]},{table:`session_upstream_links`,kind:`indexes`,value:2},{table:`session_upstream_links`,kind:`checks`,value:0},{table:`session_watch_cursors`,kind:`table`,value:null},{table:`session_watch_cursors`,kind:`column`,value:{name:`watcher_session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_watch_cursors`,kind:`column`,value:{name:`watcher_store_path`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`session_watch_cursors`,kind:`column`,value:{name:`target_session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_watch_cursors`,kind:`column`,value:{name:`last_seen_sequence`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:4}},{table:`session_watch_cursors`,kind:`column`,value:{name:`notified_sequence`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:5}},{table:`session_watch_cursors`,kind:`column`,value:{name:`material_sequence`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:6}},{table:`session_watch_cursors`,kind:`column`,value:{name:`provenance`,type:`text`,nullable:!1,identity:!1,default:`'explicit'`,position:7}},{table:`session_watch_cursors`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`session_watch_cursors`,kind:`primaryKey`,value:[`watcher_session_key`,`target_session_key`]},{table:`session_watch_cursors`,kind:`indexes`,value:2},{table:`session_watch_cursors`,kind:`checks`,value:1},{table:`skill_library_entries`,kind:`table`,value:null},{table:`skill_library_entries`,kind:`column`,value:{name:`skill_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`skill_library_entries`,kind:`column`,value:{name:`owner_profile_id`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`skill_library_entries`,kind:`column`,value:{name:`author_profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`skill_library_entries`,kind:`column`,value:{name:`slug`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`skill_library_entries`,kind:`column`,value:{name:`current_revision`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`skill_library_entries`,kind:`column`,value:{name:`shared`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`skill_library_entries`,kind:`column`,value:{name:`enabled`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`skill_library_entries`,kind:`column`,value:{name:`removed`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`skill_library_entries`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`skill_library_entries`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`skill_library_entries`,kind:`primaryKey`,value:[`skill_id`]},{table:`skill_library_entries`,kind:`indexes`,value:1},{table:`skill_library_entries`,kind:`checks`,value:0},{table:`skill_library_events`,kind:`table`,value:null},{table:`skill_library_events`,kind:`column`,value:{name:`event_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`skill_library_events`,kind:`column`,value:{name:`skill_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`skill_library_events`,kind:`column`,value:{name:`revision`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`skill_library_events`,kind:`column`,value:{name:`action`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`skill_library_events`,kind:`column`,value:{name:`actor_profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`skill_library_events`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`skill_library_events`,kind:`primaryKey`,value:[`event_id`]},{table:`skill_library_events`,kind:`indexes`,value:1},{table:`skill_library_events`,kind:`checks`,value:0},{table:`skill_library_revisions`,kind:`table`,value:null},{table:`skill_library_revisions`,kind:`column`,value:{name:`skill_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`skill_library_revisions`,kind:`column`,value:{name:`revision`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`skill_library_revisions`,kind:`column`,value:{name:`description`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`skill_library_revisions`,kind:`column`,value:{name:`files_json`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`skill_library_revisions`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`skill_library_revisions`,kind:`primaryKey`,value:[`skill_id`,`revision`]},{table:`skill_library_revisions`,kind:`indexes`,value:1},{table:`skill_library_revisions`,kind:`checks`,value:0},{table:`skill_library_uploads`,kind:`table`,value:null},{table:`skill_library_uploads`,kind:`column`,value:{name:`upload_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`skill_library_uploads`,kind:`column`,value:{name:`owner_profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`skill_library_uploads`,kind:`column`,value:{name:`slug`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`skill_library_uploads`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`skill_library_uploads`,kind:`column`,value:{name:`sha256`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`skill_library_uploads`,kind:`column`,value:{name:`archive_blob`,type:`bytea`,nullable:!1,identity:!1,default:null,position:6}},{table:`skill_library_uploads`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`skill_library_uploads`,kind:`column`,value:{name:`published_skill_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`skill_library_uploads`,kind:`primaryKey`,value:[`upload_id`]},{table:`skill_library_uploads`,kind:`indexes`,value:1},{table:`skill_library_uploads`,kind:`checks`,value:0},{table:`skill_upload_chunks`,kind:`table`,value:null},{table:`skill_upload_chunks`,kind:`column`,value:{name:`upload_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`skill_upload_chunks`,kind:`column`,value:{name:`byte_offset`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`skill_upload_chunks`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`skill_upload_chunks`,kind:`column`,value:{name:`chunk_blob`,type:`bytea`,nullable:!1,identity:!1,default:null,position:4}},{table:`skill_upload_chunks`,kind:`primaryKey`,value:[`upload_id`,`byte_offset`]},{table:`skill_upload_chunks`,kind:`foreignKey`,value:{columns:[`upload_id`],target:`skill_uploads`,targetColumns:[`upload_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`skill_upload_chunks`,kind:`indexes`,value:1},{table:`skill_upload_chunks`,kind:`checks`,value:3},{table:`skill_uploads`,kind:`table`,value:null},{table:`skill_uploads`,kind:`column`,value:{name:`upload_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`skill_uploads`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`skill_uploads`,kind:`column`,value:{name:`slug`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`skill_uploads`,kind:`column`,value:{name:`force`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`skill_uploads`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`skill_uploads`,kind:`column`,value:{name:`sha256`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`skill_uploads`,kind:`column`,value:{name:`actual_sha256`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`skill_uploads`,kind:`column`,value:{name:`received_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`skill_uploads`,kind:`column`,value:{name:`archive_blob`,type:`bytea`,nullable:!1,identity:!1,default:null,position:9}},{table:`skill_uploads`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`skill_uploads`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`skill_uploads`,kind:`column`,value:{name:`committed`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`skill_uploads`,kind:`column`,value:{name:`committed_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`skill_uploads`,kind:`column`,value:{name:`idempotency_key_hash`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`skill_uploads`,kind:`primaryKey`,value:[`upload_id`]},{table:`skill_uploads`,kind:`unique`,value:[`idempotency_key_hash`]},{table:`skill_uploads`,kind:`indexes`,value:4},{table:`skill_uploads`,kind:`checks`,value:0},{table:`skill_usage`,kind:`table`,value:null},{table:`skill_usage`,kind:`column`,value:{name:`skill_file`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`skill_usage`,kind:`column`,value:{name:`skill_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`skill_usage`,kind:`column`,value:{name:`skill_name`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`skill_usage`,kind:`column`,value:{name:`skill_source`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`skill_usage`,kind:`column`,value:{name:`first_used_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`skill_usage`,kind:`column`,value:{name:`last_used_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`skill_usage`,kind:`column`,value:{name:`use_count`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`skill_usage`,kind:`column`,value:{name:`last_agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`skill_usage`,kind:`primaryKey`,value:[`skill_file`]},{table:`skill_usage`,kind:`indexes`,value:1},{table:`skill_usage`,kind:`checks`,value:0},{table:`skill_workshop_changes`,kind:`table`,value:null},{table:`skill_workshop_changes`,kind:`column`,value:{name:`cursor_id`,type:`bigint`,nullable:!1,identity:!1,default:null,position:1}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`change_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`skill_name`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`action`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`actor`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`summary`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`version_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`skill_workshop_changes`,kind:`primaryKey`,value:[`change_id`]},{table:`skill_workshop_changes`,kind:`indexes`,value:3},{table:`skill_workshop_changes`,kind:`checks`,value:2},{table:`state_leases`,kind:`table`,value:null},{table:`state_leases`,kind:`column`,value:{name:`scope`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`state_leases`,kind:`column`,value:{name:`lease_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`state_leases`,kind:`column`,value:{name:`owner`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`state_leases`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:4}},{table:`state_leases`,kind:`column`,value:{name:`heartbeat_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:5}},{table:`state_leases`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`state_leases`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`state_leases`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`state_leases`,kind:`primaryKey`,value:[`scope`,`lease_key`]},{table:`state_leases`,kind:`indexes`,value:3},{table:`state_leases`,kind:`checks`,value:0},{table:`subagent_runs`,kind:`table`,value:null},{table:`subagent_runs`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`subagent_runs`,kind:`column`,value:{name:`child_session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`subagent_runs`,kind:`column`,value:{name:`controller_session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`subagent_runs`,kind:`column`,value:{name:`controller_store_path`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`subagent_runs`,kind:`column`,value:{name:`requester_session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`subagent_runs`,kind:`column`,value:{name:`requester_store_path`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`subagent_runs`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`subagent_runs`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:!1,identity:!1,default:`'{}'`,position:8}},{table:`subagent_runs`,kind:`primaryKey`,value:[`run_id`]},{table:`subagent_runs`,kind:`indexes`,value:4},{table:`subagent_runs`,kind:`checks`,value:0},{table:`task_delivery_state`,kind:`table`,value:null},{table:`task_delivery_state`,kind:`column`,value:{name:`task_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`task_delivery_state`,kind:`column`,value:{name:`requester_origin_json`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`task_delivery_state`,kind:`column`,value:{name:`last_notified_event_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:3}},{table:`task_delivery_state`,kind:`primaryKey`,value:[`task_id`]},{table:`task_delivery_state`,kind:`foreignKey`,value:{columns:[`task_id`],target:`task_runs`,targetColumns:[`task_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`task_delivery_state`,kind:`indexes`,value:1},{table:`task_delivery_state`,kind:`checks`,value:0},{table:`task_runs`,kind:`table`,value:null},{table:`task_runs`,kind:`column`,value:{name:`task_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`task_runs`,kind:`column`,value:{name:`runtime`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`task_runs`,kind:`column`,value:{name:`task_kind`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`task_runs`,kind:`column`,value:{name:`source_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`task_runs`,kind:`column`,value:{name:`requester_session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`task_runs`,kind:`column`,value:{name:`owner_key`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`task_runs`,kind:`column`,value:{name:`scope_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`task_runs`,kind:`column`,value:{name:`child_session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`task_runs`,kind:`column`,value:{name:`parent_flow_id`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`task_runs`,kind:`column`,value:{name:`parent_task_id`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`task_runs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`task_runs`,kind:`column`,value:{name:`requester_agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`task_runs`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`task_runs`,kind:`column`,value:{name:`execution_owner_host`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`task_runs`,kind:`column`,value:{name:`execution_owner_pid`,type:`bigint`,nullable:!0,identity:!1,default:null,position:15}},{table:`task_runs`,kind:`column`,value:{name:`execution_owner_start_identity`,type:`bigint`,nullable:!0,identity:!1,default:null,position:16}},{table:`task_runs`,kind:`column`,value:{name:`label`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`task_runs`,kind:`column`,value:{name:`task`,type:`text`,nullable:!1,identity:!1,default:null,position:18}},{table:`task_runs`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:19}},{table:`task_runs`,kind:`column`,value:{name:`delivery_status`,type:`text`,nullable:!1,identity:!1,default:null,position:20}},{table:`task_runs`,kind:`column`,value:{name:`notify_policy`,type:`text`,nullable:!1,identity:!1,default:null,position:21}},{table:`task_runs`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:22}},{table:`task_runs`,kind:`column`,value:{name:`started_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:23}},{table:`task_runs`,kind:`column`,value:{name:`ended_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:24}},{table:`task_runs`,kind:`column`,value:{name:`last_event_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:25}},{table:`task_runs`,kind:`column`,value:{name:`cleanup_after`,type:`bigint`,nullable:!0,identity:!1,default:null,position:26}},{table:`task_runs`,kind:`column`,value:{name:`tool_use_count`,type:`bigint`,nullable:!0,identity:!1,default:null,position:27}},{table:`task_runs`,kind:`column`,value:{name:`last_tool_name`,type:`text`,nullable:!0,identity:!1,default:null,position:28}},{table:`task_runs`,kind:`column`,value:{name:`error`,type:`text`,nullable:!0,identity:!1,default:null,position:29}},{table:`task_runs`,kind:`column`,value:{name:`progress_summary`,type:`text`,nullable:!0,identity:!1,default:null,position:30}},{table:`task_runs`,kind:`column`,value:{name:`terminal_summary`,type:`text`,nullable:!0,identity:!1,default:null,position:31}},{table:`task_runs`,kind:`column`,value:{name:`terminal_outcome`,type:`text`,nullable:!0,identity:!1,default:null,position:32}},{table:`task_runs`,kind:`column`,value:{name:`detail_json`,type:`text`,nullable:!0,identity:!1,default:null,position:33}},{table:`task_runs`,kind:`primaryKey`,value:[`task_id`]},{table:`task_runs`,kind:`indexes`,value:4},{table:`task_runs`,kind:`checks`,value:0},{table:`template_cron_refs`,kind:`table`,value:null},{table:`template_cron_refs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`template_cron_refs`,kind:`column`,value:{name:`manifest_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`template_cron_refs`,kind:`column`,value:{name:`schema_version`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`template_cron_refs`,kind:`column`,value:{name:`declaration_key`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`template_cron_refs`,kind:`column`,value:{name:`scheduler_job_id`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`template_cron_refs`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`template_cron_refs`,kind:`column`,value:{name:`job_json`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`template_cron_refs`,kind:`column`,value:{name:`error`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`template_cron_refs`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`template_cron_refs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`template_cron_refs`,kind:`primaryKey`,value:[`agent_id`,`manifest_id`]},{table:`template_cron_refs`,kind:`unique`,value:[`declaration_key`]},{table:`template_cron_refs`,kind:`unique`,value:[`scheduler_job_id`]},{table:`template_cron_refs`,kind:`indexes`,value:3},{table:`template_cron_refs`,kind:`checks`,value:0},{table:`template_installs`,kind:`table`,value:null},{table:`template_installs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`template_installs`,kind:`column`,value:{name:`schema_version`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`template_installs`,kind:`column`,value:{name:`source_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`template_installs`,kind:`column`,value:{name:`template_name`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`template_installs`,kind:`column`,value:{name:`template_version`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`template_installs`,kind:`column`,value:{name:`package_root`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`template_installs`,kind:`column`,value:{name:`manifest_path`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`template_installs`,kind:`column`,value:{name:`integrity_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`template_installs`,kind:`column`,value:{name:`integrity`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`template_installs`,kind:`column`,value:{name:`source_byte_length`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`template_installs`,kind:`column`,value:{name:`manifest_schema_version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`template_installs`,kind:`column`,value:{name:`plan_integrity`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`template_installs`,kind:`column`,value:{name:`workspace`,type:`text`,nullable:!1,identity:!1,default:null,position:13}},{table:`template_installs`,kind:`column`,value:{name:`agent_config_digest`,type:`text`,nullable:!1,identity:!1,default:null,position:14}},{table:`template_installs`,kind:`column`,value:{name:`agent_owned_paths_json`,type:`text`,nullable:!1,identity:!1,default:null,position:15}},{table:`template_installs`,kind:`column`,value:{name:`bootstrap_source_path`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`template_installs`,kind:`column`,value:{name:`bootstrap_content_digest`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`template_installs`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:18}},{table:`template_installs`,kind:`column`,value:{name:`added_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:19}},{table:`template_installs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:20}},{table:`template_installs`,kind:`primaryKey`,value:[`agent_id`]},{table:`template_installs`,kind:`unique`,value:[`workspace`]},{table:`template_installs`,kind:`indexes`,value:2},{table:`template_installs`,kind:`checks`,value:1},{table:`template_mcp_server_refs`,kind:`table`,value:null},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`name`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`schema_version`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`config_digest`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`relationship`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`origin`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`independent_owner`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:7}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`error`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`template_mcp_server_refs`,kind:`primaryKey`,value:[`agent_id`,`name`]},{table:`template_mcp_server_refs`,kind:`indexes`,value:1},{table:`template_mcp_server_refs`,kind:`checks`,value:3},{table:`template_package_refs`,kind:`table`,value:null},{table:`template_package_refs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`template_package_refs`,kind:`column`,value:{name:`package_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`template_package_refs`,kind:`column`,value:{name:`package_source`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`template_package_refs`,kind:`column`,value:{name:`package_ref`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`template_package_refs`,kind:`column`,value:{name:`package_version`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`template_package_refs`,kind:`column`,value:{name:`package_integrity`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`template_package_refs`,kind:`column`,value:{name:`schema_version`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`template_package_refs`,kind:`column`,value:{name:`template_name`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`template_package_refs`,kind:`column`,value:{name:`package_status`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`template_package_refs`,kind:`column`,value:{name:`relationship`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`template_package_refs`,kind:`column`,value:{name:`origin`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`template_package_refs`,kind:`column`,value:{name:`independent_owner`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_id`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_format`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_detected_format`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_mapped_json`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_unavailable_json`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_adapter_identity`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`template_package_refs`,kind:`column`,value:{name:`installed_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:19}},{table:`template_package_refs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:20}},{table:`template_package_refs`,kind:`primaryKey`,value:[`agent_id`,`package_kind`,`package_source`,`package_ref`,`package_version`]},{table:`template_package_refs`,kind:`indexes`,value:1},{table:`template_package_refs`,kind:`checks`,value:3},{table:`template_workspace_files`,kind:`table`,value:null},{table:`template_workspace_files`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`template_workspace_files`,kind:`column`,value:{name:`target_path`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`template_workspace_files`,kind:`column`,value:{name:`schema_version`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`template_workspace_files`,kind:`column`,value:{name:`workspace`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`template_workspace_files`,kind:`column`,value:{name:`source_path`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`template_workspace_files`,kind:`column`,value:{name:`content_digest`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`template_workspace_files`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`template_workspace_files`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`template_workspace_files`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`template_workspace_files`,kind:`primaryKey`,value:[`agent_id`,`target_path`]},{table:`template_workspace_files`,kind:`indexes`,value:1},{table:`template_workspace_files`,kind:`checks`,value:0},{table:`update_runs`,kind:`table`,value:null},{table:`update_runs`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`update_runs`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`update_runs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`update_runs`,kind:`column`,value:{name:`trigger`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`update_runs`,kind:`column`,value:{name:`phase`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`update_runs`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`update_runs`,kind:`column`,value:{name:`reason`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`update_runs`,kind:`column`,value:{name:`origin_json`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`update_runs`,kind:`column`,value:{name:`target_json`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`update_runs`,kind:`column`,value:{name:`before_json`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`update_runs`,kind:`column`,value:{name:`after_json`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`update_runs`,kind:`column`,value:{name:`steps_json`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`update_runs`,kind:`column`,value:{name:`verification_json`,type:`text`,nullable:!1,identity:!1,default:null,position:13}},{table:`update_runs`,kind:`column`,value:{name:`repair_json`,type:`text`,nullable:!1,identity:!1,default:null,position:14}},{table:`update_runs`,kind:`column`,value:{name:`confirmed_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:15}},{table:`update_runs`,kind:`column`,value:{name:`finished_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:16}},{table:`update_runs`,kind:`column`,value:{name:`downtime_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:17}},{table:`update_runs`,kind:`primaryKey`,value:[`run_id`]},{table:`update_runs`,kind:`indexes`,value:3},{table:`update_runs`,kind:`checks`,value:11},{table:`user_background_images`,kind:`table`,value:null},{table:`user_background_images`,kind:`column`,value:{name:`profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`user_background_images`,kind:`column`,value:{name:`asset_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`user_background_images`,kind:`column`,value:{name:`image`,type:`bytea`,nullable:!1,identity:!1,default:null,position:3}},{table:`user_background_images`,kind:`column`,value:{name:`width`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`user_background_images`,kind:`column`,value:{name:`height`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`user_background_images`,kind:`primaryKey`,value:[`profile_id`]},{table:`user_background_images`,kind:`unique`,value:[`asset_id`]},{table:`user_background_images`,kind:`foreignKey`,value:{columns:[`profile_id`],target:`user_profiles`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`user_background_images`,kind:`indexes`,value:2},{table:`user_background_images`,kind:`checks`,value:3},{table:`user_preferences`,kind:`table`,value:null},{table:`user_preferences`,kind:`column`,value:{name:`profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`user_preferences`,kind:`column`,value:{name:`pref_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`user_preferences`,kind:`column`,value:{name:`value_json`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`user_preferences`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`user_preferences`,kind:`primaryKey`,value:[`profile_id`,`pref_key`]},{table:`user_preferences`,kind:`indexes`,value:1},{table:`user_preferences`,kind:`checks`,value:0},{table:`user_profile_emails`,kind:`table`,value:null},{table:`user_profile_emails`,kind:`column`,value:{name:`email`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`user_profile_emails`,kind:`column`,value:{name:`profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`user_profile_emails`,kind:`column`,value:{name:`binding_id`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`user_profile_emails`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`user_profile_emails`,kind:`primaryKey`,value:[`email`]},{table:`user_profile_emails`,kind:`indexes`,value:2},{table:`user_profile_emails`,kind:`checks`,value:0},{table:`user_profile_identities`,kind:`table`,value:null},{table:`user_profile_identities`,kind:`column`,value:{name:`provider`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`user_profile_identities`,kind:`column`,value:{name:`subject`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`user_profile_identities`,kind:`column`,value:{name:`profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`user_profile_identities`,kind:`column`,value:{name:`canonical_login`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`user_profile_identities`,kind:`column`,value:{name:`verified_email_json`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`user_profile_identities`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`user_profile_identities`,kind:`column`,value:{name:`authorization_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`user_profile_identities`,kind:`column`,value:{name:`authorization_basis_json`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`user_profile_identities`,kind:`primaryKey`,value:[`provider`,`subject`]},{table:`user_profile_identities`,kind:`indexes`,value:3},{table:`user_profile_identities`,kind:`checks`,value:0},{table:`user_profiles`,kind:`table`,value:null},{table:`user_profiles`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`user_profiles`,kind:`column`,value:{name:`display_name`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`user_profiles`,kind:`column`,value:{name:`primary_github_account_id`,type:`bigint`,nullable:!0,identity:!1,default:null,position:3}},{table:`user_profiles`,kind:`column`,value:{name:`avatar`,type:`bytea`,nullable:!0,identity:!1,default:null,position:4}},{table:`user_profiles`,kind:`column`,value:{name:`avatar_mime`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`user_profiles`,kind:`column`,value:{name:`avatar_sha256`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`user_profiles`,kind:`column`,value:{name:`merged_into`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`user_profiles`,kind:`column`,value:{name:`role`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`user_profiles`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`user_profiles`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`user_profiles`,kind:`primaryKey`,value:[`id`]},{table:`user_profiles`,kind:`indexes`,value:1},{table:`user_profiles`,kind:`checks`,value:0},{table:`web_push_approval_deliveries`,kind:`table`,value:null},{table:`web_push_approval_deliveries`,kind:`column`,value:{name:`approval_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`web_push_approval_deliveries`,kind:`column`,value:{name:`subscription_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`web_push_approval_deliveries`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`web_push_approval_deliveries`,kind:`column`,value:{name:`user_profile_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`web_push_approval_deliveries`,kind:`column`,value:{name:`prepared_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`web_push_approval_deliveries`,kind:`primaryKey`,value:[`approval_id`,`subscription_id`]},{table:`web_push_approval_deliveries`,kind:`foreignKey`,value:{columns:[`subscription_id`],target:`web_push_subscriptions`,targetColumns:[`subscription_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`web_push_approval_deliveries`,kind:`foreignKey`,value:{columns:[`approval_id`],target:`operator_approvals`,targetColumns:[`approval_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`web_push_approval_deliveries`,kind:`indexes`,value:2},{table:`web_push_approval_deliveries`,kind:`checks`,value:0},{table:`web_push_subscriptions`,kind:`table`,value:null},{table:`web_push_subscriptions`,kind:`column`,value:{name:`endpoint_hash`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`subscription_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`endpoint`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`p256dh`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`auth`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`user_profile_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`preferences_json`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`web_push_subscriptions`,kind:`primaryKey`,value:[`endpoint_hash`]},{table:`web_push_subscriptions`,kind:`unique`,value:[`subscription_id`]},{table:`web_push_subscriptions`,kind:`indexes`,value:3},{table:`web_push_subscriptions`,kind:`checks`,value:0},{table:`worker_environment_credentials`,kind:`table`,value:null},{table:`worker_environment_credentials`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`credential_hash`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`bundle_hash`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`rpc_set_version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`delivered_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`worker_environment_credentials`,kind:`primaryKey`,value:[`environment_id`]},{table:`worker_environment_credentials`,kind:`unique`,value:[`credential_hash`]},{table:`worker_environment_credentials`,kind:`foreignKey`,value:{columns:[`environment_id`],target:`worker_environments`,targetColumns:[`environment_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_environment_credentials`,kind:`indexes`,value:2},{table:`worker_environment_credentials`,kind:`checks`,value:4},{table:`worker_environment_session_attachments`,kind:`table`,value:null},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`session_lifecycle_revision`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`generation`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`last_used_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`closed_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:9}},{table:`worker_environment_session_attachments`,kind:`primaryKey`,value:[`session_id`]},{table:`worker_environment_session_attachments`,kind:`unique`,value:[`environment_id`]},{table:`worker_environment_session_attachments`,kind:`foreignKey`,value:{columns:[`environment_id`],target:`worker_environments`,targetColumns:[`environment_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_environment_session_attachments`,kind:`indexes`,value:3},{table:`worker_environment_session_attachments`,kind:`checks`,value:1},{table:`worker_environment_ssh_fallback_ports`,kind:`table`,value:null},{table:`worker_environment_ssh_fallback_ports`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_environment_ssh_fallback_ports`,kind:`column`,value:{name:`position`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_environment_ssh_fallback_ports`,kind:`column`,value:{name:`port`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_environment_ssh_fallback_ports`,kind:`primaryKey`,value:[`environment_id`,`position`]},{table:`worker_environment_ssh_fallback_ports`,kind:`unique`,value:[`environment_id`,`port`]},{table:`worker_environment_ssh_fallback_ports`,kind:`foreignKey`,value:{columns:[`environment_id`],target:`worker_environments`,targetColumns:[`environment_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_environment_ssh_fallback_ports`,kind:`indexes`,value:2},{table:`worker_environment_ssh_fallback_ports`,kind:`checks`,value:2},{table:`worker_environments`,kind:`table`,value:null},{table:`worker_environments`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_environments`,kind:`column`,value:{name:`provider_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_environments`,kind:`column`,value:{name:`profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_environments`,kind:`column`,value:{name:`profile_snapshot_json`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_environments`,kind:`column`,value:{name:`last_activated_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:5}},{table:`worker_environments`,kind:`column`,value:{name:`preparation_key`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`worker_environments`,kind:`column`,value:{name:`preparation_purpose`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`worker_environments`,kind:`column`,value:{name:`preparation_demand_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`worker_environments`,kind:`column`,value:{name:`preparation_expires_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:9}},{table:`worker_environments`,kind:`column`,value:{name:`preparation_consumed_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:10}},{table:`worker_environments`,kind:`column`,value:{name:`provision_operation_id`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`worker_environments`,kind:`column`,value:{name:`lease_id`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`worker_environments`,kind:`column`,value:{name:`node_setup_id`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`worker_environments`,kind:`column`,value:{name:`node_device_id`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`worker_environments`,kind:`column`,value:{name:`ssh_host`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`worker_environments`,kind:`column`,value:{name:`ssh_port`,type:`bigint`,nullable:!0,identity:!1,default:null,position:16}},{table:`worker_environments`,kind:`column`,value:{name:`ssh_user`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`worker_environments`,kind:`column`,value:{name:`ssh_host_key`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`worker_environments`,kind:`column`,value:{name:`ssh_key_ref_json`,type:`text`,nullable:!0,identity:!1,default:null,position:19}},{table:`worker_environments`,kind:`column`,value:{name:`desktop_json`,type:`text`,nullable:!0,identity:!1,default:null,position:20}},{table:`worker_environments`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:21}},{table:`worker_environments`,kind:`column`,value:{name:`bootstrap_bundle_hash`,type:`text`,nullable:!0,identity:!1,default:null,position:22}},{table:`worker_environments`,kind:`column`,value:{name:`bootstrap_openclaw_version`,type:`text`,nullable:!0,identity:!1,default:null,position:23}},{table:`worker_environments`,kind:`column`,value:{name:`bootstrap_protocol_features_json`,type:`text`,nullable:!0,identity:!1,default:null,position:24}},{table:`worker_environments`,kind:`column`,value:{name:`bootstrap_install_kind`,type:`text`,nullable:!0,identity:!1,default:null,position:25}},{table:`worker_environments`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:26}},{table:`worker_environments`,kind:`column`,value:{name:`teardown_terminal_state`,type:`text`,nullable:!0,identity:!1,default:null,position:27}},{table:`worker_environments`,kind:`column`,value:{name:`attached_session_ids_json`,type:`text`,nullable:!1,identity:!1,default:`'[]'`,position:28}},{table:`worker_environments`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:29}},{table:`worker_environments`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:30}},{table:`worker_environments`,kind:`column`,value:{name:`state_changed_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:31}},{table:`worker_environments`,kind:`column`,value:{name:`idle_since_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:32}},{table:`worker_environments`,kind:`column`,value:{name:`destroy_requested_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:33}},{table:`worker_environments`,kind:`column`,value:{name:`last_error`,type:`text`,nullable:!0,identity:!1,default:null,position:34}},{table:`worker_environments`,kind:`column`,value:{name:`shared_host`,type:`bigint`,nullable:!0,identity:!1,default:null,position:35}},{table:`worker_environments`,kind:`column`,value:{name:`resource_receipt_json`,type:`text`,nullable:!0,identity:!1,default:null,position:36}},{table:`worker_environments`,kind:`column`,value:{name:`retention_json`,type:`text`,nullable:!0,identity:!1,default:null,position:37}},{table:`worker_environments`,kind:`column`,value:{name:`provision_source_json`,type:`text`,nullable:!0,identity:!1,default:null,position:38}},{table:`worker_environments`,kind:`primaryKey`,value:[`environment_id`]},{table:`worker_environments`,kind:`unique`,value:[`provision_operation_id`]},{table:`worker_environments`,kind:`indexes`,value:4},{table:`worker_environments`,kind:`checks`,value:5},{table:`worker_inference_turns`,kind:`table`,value:null},{table:`worker_inference_turns`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_inference_turns`,kind:`column`,value:{name:`run_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_inference_turns`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_inference_turns`,kind:`column`,value:{name:`turn_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_inference_turns`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_inference_turns`,kind:`column`,value:{name:`request_hash`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`worker_inference_turns`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`worker_inference_turns`,kind:`column`,value:{name:`terminal_json`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`worker_inference_turns`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`worker_inference_turns`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`worker_inference_turns`,kind:`primaryKey`,value:[`session_id`,`run_epoch`,`run_id`,`turn_id`]},{table:`worker_inference_turns`,kind:`foreignKey`,value:{columns:[`environment_id`],target:`worker_environments`,targetColumns:[`environment_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_inference_turns`,kind:`indexes`,value:2},{table:`worker_inference_turns`,kind:`checks`,value:5},{table:`worker_session_placement_moves`,kind:`table`,value:null},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`operation_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`source_generation`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`source_environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`source_owner_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`target_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`target_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`target_machine_class`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`target_os`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`abandon_source`,type:`bigint`,nullable:!0,identity:!1,default:null,position:10}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`last_error`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:13}},{table:`worker_session_placement_moves`,kind:`primaryKey`,value:[`operation_id`]},{table:`worker_session_placement_moves`,kind:`unique`,value:[`session_id`]},{table:`worker_session_placement_moves`,kind:`foreignKey`,value:{columns:[`session_id`],target:`worker_session_placements`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_session_placement_moves`,kind:`indexes`,value:2},{table:`worker_session_placement_moves`,kind:`checks`,value:5},{table:`worker_session_placements`,kind:`table`,value:null},{table:`worker_session_placements`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_session_placements`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_session_placements`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_session_placements`,kind:`column`,value:{name:`execution_mode`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`worker_session_placements`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_session_placements`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`worker_session_placements`,kind:`column`,value:{name:`transition_generation`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:7}},{table:`worker_session_placements`,kind:`column`,value:{name:`active_owner_epoch`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`worker_session_placements`,kind:`column`,value:{name:`workspace_base_manifest_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`worker_session_placements`,kind:`column`,value:{name:`remote_workspace_dir`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`worker_session_placements`,kind:`column`,value:{name:`worker_bundle_hash`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`worker_session_placements`,kind:`column`,value:{name:`last_transcript_ack_cursor`,type:`bigint`,nullable:!0,identity:!1,default:null,position:12}},{table:`worker_session_placements`,kind:`column`,value:{name:`last_live_event_ack_cursor`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`worker_session_placements`,kind:`column`,value:{name:`recovery_error`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`worker_session_placements`,kind:`column`,value:{name:`turn_claim_owner`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`worker_session_placements`,kind:`column`,value:{name:`turn_claim_id`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`worker_session_placements`,kind:`column`,value:{name:`turn_claim_run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`worker_session_placements`,kind:`column`,value:{name:`turn_claim_generation`,type:`bigint`,nullable:!0,identity:!1,default:null,position:18}},{table:`worker_session_placements`,kind:`column`,value:{name:`turn_claim_owner_epoch`,type:`bigint`,nullable:!0,identity:!1,default:null,position:19}},{table:`worker_session_placements`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:20}},{table:`worker_session_placements`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:21}},{table:`worker_session_placements`,kind:`column`,value:{name:`state_changed_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:22}},{table:`worker_session_placements`,kind:`column`,value:{name:`terminal_reason`,type:`text`,nullable:!0,identity:!1,default:null,position:23}},{table:`worker_session_placements`,kind:`column`,value:{name:`terminal_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:24}},{table:`worker_session_placements`,kind:`primaryKey`,value:[`session_id`]},{table:`worker_session_placements`,kind:`indexes`,value:4},{table:`worker_session_placements`,kind:`checks`,value:12},{table:`worker_session_tool_operations`,kind:`table`,value:null},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`source_session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`source_claim_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`tool_call_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`tool_name`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`request_digest`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`operation_seed`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`child_session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`result_json`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`gateway_instance_id`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`worker_session_tool_operations`,kind:`primaryKey`,value:[`source_session_id`,`source_claim_id`,`tool_call_id`]},{table:`worker_session_tool_operations`,kind:`foreignKey`,value:{columns:[`source_session_id`],target:`worker_session_placements`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_session_tool_operations`,kind:`indexes`,value:1},{table:`worker_session_tool_operations`,kind:`checks`,value:2},{table:`worker_transcript_commit_heads`,kind:`table`,value:null},{table:`worker_transcript_commit_heads`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_transcript_commit_heads`,kind:`column`,value:{name:`run_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_transcript_commit_heads`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_transcript_commit_heads`,kind:`column`,value:{name:`next_seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_transcript_commit_heads`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_transcript_commit_heads`,kind:`primaryKey`,value:[`session_id`,`run_epoch`]},{table:`worker_transcript_commit_heads`,kind:`indexes`,value:1},{table:`worker_transcript_commit_heads`,kind:`checks`,value:3},{table:`worker_transcript_commits`,kind:`table`,value:null},{table:`worker_transcript_commits`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`run_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`request_hash`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`result_json`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`worker_transcript_commits`,kind:`primaryKey`,value:[`session_id`,`run_epoch`,`seq`]},{table:`worker_transcript_commits`,kind:`foreignKey`,value:{columns:[`session_id`,`run_epoch`],target:`worker_transcript_commit_heads`,targetColumns:[`session_id`,`run_epoch`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_transcript_commits`,kind:`indexes`,value:1},{table:`worker_transcript_commits`,kind:`checks`,value:6},{table:`worker_turn_tool_authorities`,kind:`table`,value:null},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`claim_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`tool_names_json`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`worker_turn_tool_authorities`,kind:`primaryKey`,value:[`session_id`]},{table:`worker_turn_tool_authorities`,kind:`foreignKey`,value:{columns:[`session_id`],target:`worker_session_placements`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_turn_tool_authorities`,kind:`indexes`,value:1},{table:`worker_turn_tool_authorities`,kind:`checks`,value:2},{table:`worker_workspace_pending_results`,kind:`table`,value:null},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`claim_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`gateway_instance_id`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`recovery_requested_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`workspace_accepted_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:9}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`staged_result_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`repository_workspace_id`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`repository_disk_authority_json`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`worker_workspace_pending_results`,kind:`primaryKey`,value:[`session_id`]},{table:`worker_workspace_pending_results`,kind:`foreignKey`,value:{columns:[`session_id`],target:`worker_session_placements`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_workspace_pending_results`,kind:`indexes`,value:1},{table:`worker_workspace_pending_results`,kind:`checks`,value:2},{table:`worker_workspace_reconciliations`,kind:`table`,value:null},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`base_manifest_ref`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`current_manifest_ref`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`plan_json`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`base_pack`,type:`bytea`,nullable:!1,identity:!1,default:null,position:8}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`worker_workspace_reconciliations`,kind:`primaryKey`,value:[`session_id`]},{table:`worker_workspace_reconciliations`,kind:`foreignKey`,value:{columns:[`session_id`],target:`worker_session_placements`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_workspace_reconciliations`,kind:`indexes`,value:1},{table:`worker_workspace_reconciliations`,kind:`checks`,value:3},{table:`workspace_generated_bootstrap_hashes`,kind:`table`,value:null},{table:`workspace_generated_bootstrap_hashes`,kind:`column`,value:{name:`workspace_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`workspace_generated_bootstrap_hashes`,kind:`column`,value:{name:`filename`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`workspace_generated_bootstrap_hashes`,kind:`column`,value:{name:`sha256`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`workspace_generated_bootstrap_hashes`,kind:`primaryKey`,value:[`workspace_key`,`filename`]},{table:`workspace_generated_bootstrap_hashes`,kind:`foreignKey`,value:{columns:[`workspace_key`],target:`workspace_setup_state`,targetColumns:[`workspace_key`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`workspace_generated_bootstrap_hashes`,kind:`indexes`,value:1},{table:`workspace_generated_bootstrap_hashes`,kind:`checks`,value:0},{table:`workspace_path_aliases`,kind:`table`,value:null},{table:`workspace_path_aliases`,kind:`column`,value:{name:`alias_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`workspace_path_aliases`,kind:`column`,value:{name:`alias_path`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`workspace_path_aliases`,kind:`column`,value:{name:`workspace_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`workspace_path_aliases`,kind:`column`,value:{name:`workspace_path`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`workspace_path_aliases`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`workspace_path_aliases`,kind:`primaryKey`,value:[`alias_key`]},{table:`workspace_path_aliases`,kind:`indexes`,value:2},{table:`workspace_path_aliases`,kind:`checks`,value:0},{table:`workspace_setup_state`,kind:`table`,value:null},{table:`workspace_setup_state`,kind:`column`,value:{name:`workspace_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`workspace_setup_state`,kind:`column`,value:{name:`workspace_path`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`workspace_setup_state`,kind:`column`,value:{name:`version`,type:`bigint`,nullable:!0,identity:!1,default:null,position:3}},{table:`workspace_setup_state`,kind:`column`,value:{name:`bootstrap_seeded_at`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`workspace_setup_state`,kind:`column`,value:{name:`setup_completed_at`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`workspace_setup_state`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:6}},{table:`workspace_setup_state`,kind:`column`,value:{name:`attested_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:7}},{table:`workspace_setup_state`,kind:`column`,value:{name:`attestation_updated_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`workspace_setup_state`,kind:`column`,value:{name:`bootstrap_deferred`,type:`bigint`,nullable:!0,identity:!1,default:null,position:9}},{table:`workspace_setup_state`,kind:`primaryKey`,value:[`workspace_key`]},{table:`workspace_setup_state`,kind:`indexes`,value:2},{table:`workspace_setup_state`,kind:`checks`,value:1},{table:`worktree_provisioned_file_chunks`,kind:`table`,value:null},{table:`worktree_provisioned_file_chunks`,kind:`column`,value:{name:`worktree_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worktree_provisioned_file_chunks`,kind:`column`,value:{name:`path`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worktree_provisioned_file_chunks`,kind:`column`,value:{name:`chunk_index`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`worktree_provisioned_file_chunks`,kind:`column`,value:{name:`data`,type:`bytea`,nullable:!1,identity:!1,default:null,position:4}},{table:`worktree_provisioned_file_chunks`,kind:`primaryKey`,value:[`worktree_id`,`path`,`chunk_index`]},{table:`worktree_provisioned_file_chunks`,kind:`indexes`,value:1},{table:`worktree_provisioned_file_chunks`,kind:`checks`,value:1},{table:`worktree_templates`,kind:`table`,value:null},{table:`worktree_templates`,kind:`column`,value:{name:`cache_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worktree_templates`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worktree_templates`,kind:`column`,value:{name:`repo_root`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worktree_templates`,kind:`column`,value:{name:`common_dir`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`worktree_templates`,kind:`column`,value:{name:`worktree_root`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worktree_templates`,kind:`column`,value:{name:`path`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`worktree_templates`,kind:`column`,value:{name:`backend`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`worktree_templates`,kind:`column`,value:{name:`source_commit`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`worktree_templates`,kind:`column`,value:{name:`content_key`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`worktree_templates`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`worktree_templates`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`worktree_templates`,kind:`column`,value:{name:`last_used_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`worktree_templates`,kind:`primaryKey`,value:[`cache_key`]},{table:`worktree_templates`,kind:`unique`,value:[`id`]},{table:`worktree_templates`,kind:`indexes`,value:2},{table:`worktree_templates`,kind:`checks`,value:1},{table:`worktrees`,kind:`table`,value:null},{table:`worktrees`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worktrees`,kind:`column`,value:{name:`repo_fingerprint`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worktrees`,kind:`column`,value:{name:`repo_root`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worktrees`,kind:`column`,value:{name:`path`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`worktrees`,kind:`column`,value:{name:`branch`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worktrees`,kind:`column`,value:{name:`base_ref`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`worktrees`,kind:`column`,value:{name:`owner_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`worktrees`,kind:`column`,value:{name:`owner_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`worktrees`,kind:`column`,value:{name:`snapshot_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`worktrees`,kind:`column`,value:{name:`provisioned_paths_json`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`worktrees`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`worktrees`,kind:`column`,value:{name:`last_active_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`worktrees`,kind:`column`,value:{name:`removed_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`worktrees`,kind:`column`,value:{name:`run_end_cleanup_json`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`worktrees`,kind:`column`,value:{name:`gc_protection_json`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`worktrees`,kind:`primaryKey`,value:[`id`]},{table:`worktrees`,kind:`indexes`,value:3},{table:`worktrees`,kind:`checks`,value:1}];return Object.defineProperty(this,"expectedCatalog",{value:e,enumerable:!0,configurable:!0,writable:!0}),e}},Vi=`Use the matching OpenClaw version or restore the matching PostgreSQL schema and anchor.`;function inspectStateSqlite(e){let t=k(e)??wt(e);return{hasEngineAnchor:t.tables.has(`openclaw_engine_anchor`),hasExistingData:[...t.tables,...t.views,...t.triggers.keys()].some(e=>e!==`openclaw_engine_anchor`&&!e.startsWith(`sqlite_`))}}function admitStatePostgres(e,t){if(!t&&getStateRuntimeSchemaAdmission(e)?.startupReady)return;let n=withPostgresSchemaAdmissionRetry(e,()=>{let t=j(e);if(!t)throw new PostgresSchemaAdmissionUnavailableError(`Missing PostgreSQL state admission. ${Vi}`);return t}),r=new Set(n.catalog.filter(e=>e.kind===`table`).map(e=>e.table)),i=new Set($.fragments.flatMap(e=>e.tables.some(e=>r.has(e))?[]:e.tables));if(n.version===40&&rn(n.catalog.filter(e=>!e.kind.endsWith(`Definition`)&&e.table!==`openclaw_schema_meta`),$.expectedCatalog.filter(e=>!i.has(e.table))),t){let t=Date.now();e.prepare(`INSERT INTO schema_meta
        (meta_key, role, schema_version, agent_id, app_version, created_at, updated_at)
        VALUES ('primary', 'global', ?, NULL, ?, ?, ?)`).run(40,on,t,t),writeStateSchemaContentVersion(e)}let a=e.prepare(`SELECT schema_version, role, agent_id FROM schema_meta WHERE meta_key = 'primary'`).get(),o=e.prepare(`SELECT value_json FROM config_machine_state WHERE state_key = 'state.schema.contentVersion'`).get(),s;try{let e=o?.value_json;if(e!=null&&typeof e!=`string`)throw Error(`Invalid PostgreSQL state content marker`);s=parseStateSchemaContentVersion(e)}catch{throw Error(`PostgreSQL state metadata mismatch. ${Vi}`)}if(a?.schema_version!==n.version||a.role!==`global`||a.agent_id!==null||s>n.version)throw Error(`PostgreSQL state metadata mismatch. ${Vi}`);publishStateSchemaVersionAdmission(e,{userVersion:n.version,contentVersion:n.version}),publishStateRuntimeSchemaAdmission(e,!0)}function statePostgresVersionSql(e){return`UPDATE schema_meta
        SET schema_version = ${e},
          app_version = '${on.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';
        INSERT INTO config_machine_state (state_key, value_json, updated_at_ms)
        VALUES ('state.schema.contentVersion', '${e}',
          CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint))
        ON CONFLICT (state_key) DO UPDATE
          SET value_json = EXCLUDED.value_json, updated_at_ms = EXCLUDED.updated_at_ms;`}function createStatePostgresMigrations(){let e={postgres:Hi.postgres,postgresFragments:Hi.postgresFragments},t=withLegacyWorkerProvisionSource(e.postgres),n=withLegacyWorkspaceBootstrapDeferred(t),r={...e,postgres:t,postgresWithoutOptionalColumn:{table:`workspace_setup_state`,column:`bootstrap_deferred`,sql:n}},i={...e,postgres:withLegacyWorkerRetention(n)},a={postgres:withLegacyRepositoryDiskAuthority(i.postgres),postgresFragments:i.postgresFragments.map(e=>({...e,sql:withLegacyRepositoryDiskAuthority(e.sql)}))},o={postgres:withLegacyWorkerResourceReceipts(a.postgres),postgresFragments:a.postgresFragments},s={postgres:withLegacyTemplateStateSchema(o.postgres),postgresFragments:o.postgresFragments.map(e=>({...e,tables:e.tables.map(legacyTemplateStateIdentifier),sql:withLegacyTemplateStateSchema(e.sql)}))},c={postgres:withLegacyLocalWorkspaceCas(s.postgres),postgresFragments:s.postgresFragments.map(e=>({...e,tables:e.tables.filter(e=>!Di.some(t=>t===e)),sql:withLegacyLocalWorkspaceCas(e.sql)}))},l={postgres:withLegacyPostgresIndexOrdering(c.postgres,`schema-nullability`),postgresFragments:c.postgresFragments.map(e=>({...e,sql:withLegacyPostgresIndexOrdering(e.sql,`schema-nullability`)}))},u={postgres:withLegacyPostgresIndexOrdering(l.postgres),postgresFragments:l.postgresFragments.map(e=>({...e,sql:withLegacyPostgresIndexOrdering(e.sql)}))},d={postgres:withLegacyLocalWorkspaceManifests(u.postgres),postgresFragments:u.postgresFragments.map(e=>({...e,tables:e.tables.filter(e=>e!==`local_workspace_manifest_nodes`),sql:withLegacyLocalWorkspaceManifests(e.sql)}))},f={...d,postgres:`${d.postgres}\n${$.clientCredentialSource.sql}`},p={postgres:withLegacyPublicationDraft(f.postgres),postgresFragments:f.postgresFragments.map(e=>({...e,sql:withLegacyPublicationDraft(e.sql)}))},m={...p,postgres:p.postgres.replace(/CREATE INDEX "idx_state_leases_owner"[^;]*;/u,$.preWriteIndexesV27Sql.state_leases)+$.preWriteIndexesV27Sql.skill_usage+$.preWriteIndexesV27Sql.acp_replay_events,postgresFragments:p.postgresFragments};return[{version:25,sql:$.operatorRecoveryV25Sql,fromSchema:m,schema:m},{version:26,fromSchema:m,schema:m,sql:statePostgresVersionSql(26)},{version:27,fromSchema:m,schema:p,sql:`${$.writeIndexesV27Sql}
        ${statePostgresVersionSql(27)}`},{version:28,fromSchema:p,schema:f,sql:`ALTER TABLE IF EXISTS github_publication_requests ADD COLUMN draft bigint;
        ALTER TABLE IF EXISTS github_personal_publication_requests ADD COLUMN draft bigint;
        ALTER TABLE IF EXISTS github_repository_publication_requests ADD COLUMN draft bigint;
        ${statePostgresVersionSql(28)}`},{version:29,fromSchema:f,schema:d,sql:$.clientCredentialV29Sql},{version:30,fromSchema:d,schema:d,sql:statePostgresVersionSql(30)},{version:31,fromSchema:d,schema:u,sql:`DO $workspace$
        DECLARE baseline_constraint text;
        BEGIN
          IF to_regclass('local_workspace_projections') IS NOT NULL THEN
            SELECT conname INTO STRICT baseline_constraint FROM pg_constraint
              WHERE conrelid = 'local_workspace_projections'::regclass AND contype = 'c'
                AND pg_get_constraintdef(oid) LIKE '%baseline_json%baseline_ref%';
            EXECUTE format('ALTER TABLE local_workspace_projections DROP CONSTRAINT %I', baseline_constraint);
            ALTER TABLE local_workspace_projections
              ADD COLUMN checkpoint_json text COLLATE "C",
              ADD CHECK (baseline_json IS NULL OR baseline_ref IS NOT NULL);
            CREATE TABLE local_workspace_manifest_nodes (
              worktree_id text COLLATE "C" NOT NULL,
              path text COLLATE "C" NOT NULL,
              node_json text COLLATE "C" NOT NULL,
              PRIMARY KEY (worktree_id, path),
              FOREIGN KEY (worktree_id) REFERENCES local_workspace_projections(worktree_id)
                ON DELETE CASCADE
            );
          END IF;
        END $workspace$;
        ${statePostgresVersionSql(31)}`},{version:32,fromSchema:u,schema:l,sql:`${postgresIndexOrderingMigration([l.postgres,...l.postgresFragments.map(e=>e.sql)].join(`
`))}
        ${statePostgresVersionSql(32)}`},{version:33,fromSchema:l,schema:c,sql:`${postgresIndexOrderingMigration([c.postgres,...c.postgresFragments.map(e=>e.sql)].join(`
`),`schema-nullability`)}
        ${statePostgresVersionSql(33)}`},{version:34,fromSchema:c,schema:c,sql:statePostgresVersionSql(34)},{version:35,fromSchema:c,schema:s,sql:`${$.workspaceCasV35Sql}\n${statePostgresVersionSql(35)}`},{version:36,fromSchema:s,schema:o,sql:`${Ri}\n${statePostgresVersionSql(36)}`},{version:37,fromSchema:o,schema:a,sql:`ALTER TABLE worker_environments ADD COLUMN resource_receipt_json text COLLATE "C";
        ${statePostgresVersionSql(37)}`},{version:38,fromSchema:a,schema:i,sql:`ALTER TABLE IF EXISTS session_repository_workspaces ADD COLUMN disk_authority_json text COLLATE "C";
        ALTER TABLE worker_workspace_pending_results ADD COLUMN repository_disk_authority_json text COLLATE "C";
        ${statePostgresVersionSql(38)}`},{version:39,fromSchema:i,schema:r,sql:`ALTER TABLE worker_environments ADD COLUMN retention_json text COLLATE "C";
        ${statePostgresVersionSql(39)}`},{version:40,fromSchema:r,schema:e,sql:`ALTER TABLE workspace_setup_state ADD COLUMN IF NOT EXISTS bootstrap_deferred bigint;
        ALTER TABLE worker_environments ADD COLUMN provision_source_json text COLLATE "C";
        UPDATE worker_environments
        SET provision_source_json = '{"kind":"unavailable"}'
        WHERE (state IN ('requested', 'provisioning') AND lease_id IS NULL
          OR state = 'bootstrapping' AND owner_epoch = 0)
          AND provision_source_json IS NULL;
        ${statePostgresVersionSql(40)}`}]}const Hi={id:`state`,version:40,sqlite:``,get postgres(){let e=$.eagerSql;return Object.defineProperty(this,"postgres",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get postgresFragments(){let e=$.fragments.map(e=>{let{activation:t}=e;if(t!==`first-use`&&t!==`version-additive`)throw Error(`Unknown PostgreSQL state fragment activation: ${t}`);return{id:e.id,tables:e.tables,sql:e.sql,dependencies:e.dependencies,activation:t}});return Object.defineProperty(this,"postgresFragments",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get postgresMigrations(){let e=createStatePostgresMigrations();return Object.defineProperty(this,"postgresMigrations",{value:e,enumerable:!0,configurable:!0,writable:!0}),e}};function openExistingStatePostgresConnection(e,t){if(At())return openExistingStatePostgresConnectionFromAnchor(hn(e,{existingOnly:!0,expectedIdentity:t}),e)}function openExistingStatePostgresConnectionFromAnchor(e,t){let n;try{let r=At();if(!r)throw Error(`PostgreSQL state inspection requires the configured state connection.`);admitStateSchemaFacts(e,t);let i=openEngineStore({anchor:e,schema:Hi,input:r,inspectSqlite:()=>inspectStateSqlite(e),prepareAnchor:()=>{},openSqlite:()=>{},existingOnly:!0,reusePostgresConnection:!0,existingVersion:!0,admitPostgres:admitStatePostgres,closeOnFailure:(e,t)=>{throw n=e,t}});if(!O(i))throw Error(`Expected PostgreSQL state connection`);return n=i,{database:{db:n,path:t},close(){return C(_i.closeUnpublishedOpenClawStateDatabaseHandle({db:i,path:t}),`PostgreSQL state connection cleanup failed.`),!i.isOpen&&!e.isOpen}}}catch(r){let i=_i.closeUnpublishedOpenClawStateDatabaseHandle({db:n??e,path:t});throw i.length?De([r,...i],`PostgreSQL state connection acquisition and cleanup failed.`,r):r}}export{getExistingOpenClawStateSchemaPath as A,registerOpenClawStatePathCacheInvalidation as C,pi as D,ai as E,Or as F,createStateWorkerMemoryPressureSubscription as I,Hr as M,createSqliteWorkerTransferOwner as N,captureSqliteWorkerStateContext as O,createSqliteWorkerTransferReceiver as P,registerOpenClawStatePathAsyncResource as S,di as T,publishOpenClawStateDatabaseWorkerAdmission as _,clearOpenClawStateDatabaseOpenFailure as a,mi as b,closeOpenClawStateDatabaseByPath as c,closeOpenClawStateDatabaseWorkersByPathAsync as d,getOpenClawStateDatabaseTerminalFailureAsync as f,prepareOpenClawStateDatabaseRemoval as g,prepareOpenClawStateCachedRead as h,gi as i,isExistingOpenClawStateSchema as j,sqliteWorkerRequestBytes as k,closeOpenClawStateDatabaseByPathAsync as l,_i as m,fi as n,closeOpenClawStateDatabase as o,openExistingStatePostgresConnection,isOpenClawStateDatabaseOpen as p,hi as r,closeOpenClawStateDatabaseAsync as s,assertPublishedOpenClawStateDatabaseLifecycle as t,closeOpenClawStateDatabaseForTest as u,si as v,requireOpenClawStateDatabaseIdentity as w,registerOpenClawStateDatabaseLifecycleListener as x,recordOpenClawStateDatabaseOpenFailure as y};