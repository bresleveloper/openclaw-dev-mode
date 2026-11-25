import{B as e,H as t,I as n,K as r,Q as i,R as a,U as o,W as s,X as c,et as l,f as u,it as d,j as f,k as p}from"./disk-budget.worker-paths-C-af-IJ6.mjs";import{D as m,E as h,j as g,l as _,u as v}from"./disk-budget.worker-worker-cpu-CQgzgDK0.mjs";import{$ as y,Ct as ee,H as b,M as te,P as ne,X as re,Y as x,Z as S,_ as ie,at as C,c as ae,ct as w,d as oe,dt as T,et as E,f as D,ht as se,it as O,lt as ce,m as le,nt as ue,q as k,rt as de,st as A,tt as j,ut as fe,yt as pe,z as me}from"./disk-budget.worker-sqlite-lifecycle-errors-DgHWI3Bo.mjs";import{I as he,S as ge,Y as _e,_ as ve,b as ye,o as be,s as xe,t as Se}from"./disk-budget.worker-subsystem-D9aLEgRd.mjs";import{r as Ce,t as we}from"./disk-budget.worker-runtime-process-manifest-BNtrgdg-.mjs";import{n as Te,r as Ee,s as De,t as Oe}from"./disk-budget.worker-cli-invocation-CMZa97hk.mjs";import{G as ke,J as Ae,K as je,W as Me,Y as Ne,q as Pe}from"./disk-budget.worker.js";import{createRequire as Fe}from"node:module";import{BroadcastChannel as Ie,MessageChannel as M,Worker as Le,getEnvironmentData as N,isMainThread as Re,receiveMessageOnPort as ze,setEnvironmentData as P,threadId as F}from"node:worker_threads";import{AsyncLocalStorage as I,AsyncResource as Be}from"node:async_hooks";import{createHash as Ve,createHmac as He,randomUUID as Ue}from"node:crypto";import L,{accessSync as We,constants as Ge,existsSync as Ke,readFileSync as qe,readdirSync as Je,readlinkSync as Ye,statSync as Xe}from"node:fs";import R from"node:fs/promises";import Ze,{availableParallelism as Qe}from"node:os";import z,{posix as $e}from"node:path";import{fileURLToPath as B,pathToFileURL as et}from"node:url";import"node:util/types";import{isDeepStrictEqual as tt,stripVTControlCharacters as nt,toUSVString as rt}from"node:util";import"node:v8";import{channel as it}from"node:diagnostics_channel";import at,{execFile as ot,spawnSync as V}from"node:child_process";import{EventEmitter as st}from"node:events";import{readRootJsonObjectSync as ct}from"@openclaw/fs-safe/json";import{parse as lt}from"semver";import{Socket as ut}from"node:net";import"node:timers/promises";import{ProcSafeError as dt}from"@openclaw/proc-safe/errors";import{readProcessIdentity as ft}from"@openclaw/proc-safe/identity";import{listProcesses as pt}from"@openclaw/proc-safe/inspect";const mt=`--openclaw-sqlite-readonly-child`,ht=we(import.meta.url);resolveRuntimeProcessDistRoot(B(import.meta.url));function resolveRuntimeProcessDistRoot(e){let t=e.replaceAll(z.sep,`/`).lastIndexOf(`/dist/`);return t>=0?e.slice(0,t+6):void 0}const gt=/^node(?:-\d+|\d+)(?:\.\d+)*(?:\.exe)?$/;function normalizeRuntimeBasename(e){let t=e.trim().replace(/^["']|["']$/g,``),n=Math.max(t.lastIndexOf(`/`),t.lastIndexOf(`\\`));return(n===-1?t:t.slice(n+1)).trim().toLowerCase()}function isNodeRuntime(e){let t=normalizeRuntimeBasename(e);return/^node(?:js)?(?:\.exe)?$/.test(t)||gt.test(t)}function isBunRuntime(e){let t=normalizeRuntimeBasename(e);return t===`bun`||t===`bun.exe`}const _t=/* @__PURE__ */ new Set([`-r`,`--preload`,`--require`,`--import`,`--loader`,`--experimental-loader`,`--test-reporter`,`--test-global-setup`]),vt=/* @__PURE__ */ new Set([..._t,`-C`,`--env-file`,`--env-file-if-exists`,`--tsconfig`,`--cwd`,`--conditions`,`--icu-data-dir`,`--openssl-config`,`--title`,`--disable-warning`,`--disable-proto`,`--cpu-prof-name`,`--max-old-space-size`,`--max-semi-space-size`]),yt=/* @__PURE__ */ new Set([`--inspect`,`--inspect-brk`,`--inspect-wait`,`--expose-gc`,`--jitless`,`--no-opt`,`--experimental-strip-types`,`--watch`,`--no-warnings`,`--trace-uncaught`,`--bun`]);function resolveRuntimeScriptPosition(e){let t=[],n=e[0]??``,r=n.replaceAll(`\\`,`/`).trim().toLowerCase().split(`/`).at(-1),i=isBunRuntime(n),a=r===`tsx`||r===`tsx.cmd`,o=i?`run`:a?`watch`:void 0,s,c=[];if(!isNodeRuntime(n)&&!i&&!a)return{position:{kind:`not-runtime`},operands:t,sourceIndices:c};for(let n=1;n<e.length;n++){let r=e[n];if(r===`--`){if(!s)return{position:c.length===0&&e[n+1]?n+1:{kind:`other`},operands:t,sourceIndices:c};t.push(...e.slice(n+1).map(e=>({value:e,module:!1})));break}if(r===`-e`||r===`-p`||/^--(?:eval|print|run)(?:=|$)/.test(r)){r.includes(`=`)||n++,c.push(n);continue}let a=r.indexOf(`=`),l=a<0?r:r.slice(0,a);if(r.startsWith(`-r`)&&!r.startsWith(`--`)&&r.length>2)t.push({value:r.slice(2),module:!0});else if(vt.has(l)){let o=a<0?e[++n]??``:r.slice(a+1),s=!i&&l===`--test-reporter`&&/^(?:dot|spec|tap)$/.test(o);!_t.has(l)||s||i&&l===`--loader`||t.push({value:o,module:!0})}else if(r.startsWith(`-`)){let e=`--no-${l.replace(/^--(?:no-)?/,``)}`,n=!i&&process.allowedNodeEnvironmentFlags.has(l),o=yt.has(l)||i&&(l===`--hot`||l===`--no-install`)||n&&process.allowedNodeEnvironmentFlags.has(e);c.length===0&&!o&&!/^--[^=]+=/.test(r)&&(s??={kind:`unclassified`,reason:`unsupported runtime option ${r}`}),a>=0&&!o&&!n&&t.push({value:r.slice(a+1),module:!0})}else if(c.length===0&&r===o)o=void 0;else if(c.length===0){if(!s)return{position:n,operands:t,sourceIndices:c};o=void 0,t.push({value:r,module:!1})}else break}return{position:s??{kind:`other`},operands:t,sourceIndices:s?[]:c}}function resolveRuntimeWorkerUrl(e){if(e.root!==void 0)return et(z.join(e.root,`dist`,e.distWorkerPath));let t=B(e.currentModuleUrl),n=resolveRuntimeProcessDistRoot(t);if(n!==void 0){let t=e.distWorkerPath;if(e.package){let r=z.resolve(n,`..`),i=ct({rootDir:r,relativePath:`package.json`,boundaryLabel:`runtime worker package`,rejectHardlinks:!1});if(!i.ok)throw Error(`Cannot resolve runtime worker package: ${r}/package.json`);i.value.name===e.package.name&&(t=e.package.distWorkerPath)}return et(z.join(n,t))}let r=e.sourceExtension??(z.extname(t)||`.js`);return new URL(`./${e.sourceWorkerName}${r}`,e.currentModuleUrl)}function isBunTargetRuntime(e){return e===process.execPath?!!process.versions.bun:isBunRuntime(e)}function resolveRuntimeArgs(e=process.execPath){return isBunTargetRuntime(e)?[`--no-install`]:[]}function runtimeNeedsTypeScriptLoader(e,t=process.execPath){return/\.[cm]?ts$/.test(e)&&!isBunTargetRuntime(t)}function resolveRuntimeWorkerArgv(e,t=process.execPath){let n=B(e);return runtimeNeedsTypeScriptLoader(n,t)?[`--import`,import.meta.resolve(`tsx`),n]:[...resolveRuntimeArgs(t),n]}function resolveRuntimeWorkerThreadExecArgv(e,t=process.execPath){return typeof SEALED_RUNTIME_BUILD==`boolean`&&SEALED_RUNTIME_BUILD?[]:e.protocol===`file:`&&runtimeNeedsTypeScriptLoader(B(e),t)?[`--import`,import.meta.resolve(`tsx/esm`)]:[]}const bt=/* @__PURE__ */ new Map;function resolveRuntimeProcessEntrypointUrl(e){return bt.get(e)??resolveRuntimeWorkerUrl(ht[e])}function materializeRuntimeProcessScriptFile(e,t={}){let n=L.mkdtempSync(z.join(t.parentDirectory??Ze.tmpdir(),`openclaw-script-`)),r=z.join(n,e.fileName),i=!1,dispose=()=>{if(!i)try{L.rmSync(n,{recursive:!0,force:!0}),i=!0}catch(e){process.emitWarning(`Runtime script cleanup failed at ${n}: ${e instanceof Error?e.message:String(e)}`)}};try{return L.writeFileSync(r,e.source,{mode:384,flag:`wx`}),{url:et(r),dispose}}catch(e){throw dispose(),e}}function probeBunSqliteLibrary(e){let t=materializeRuntimeProcessScriptFile({fileName:Ce.bunSqliteLibraryProbe.fileName,source:`import{createRequire}from"node:module";try{const candidate=process.argv[2];if(!candidate||process.argv.length!==3){throw new Error("Expected one SQLite library path")}const require2=createRequire(import.meta.url);const{Database}=require2("bun:sqlite");Database.setCustomSQLite(candidate);const database=new Database(":memory:");let facts;try{facts=database.query("SELECT sqlite_version() AS version, sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted").get()}finally{database.close()}process.stdout.write(JSON.stringify({protocol:1,version:facts.version,extensionLoadingSupported:facts.omitted===0}))}catch(error){process.stdout.write(JSON.stringify({protocol:1,error:(error instanceof Error?error.message:String(error)).slice(0,512)}));process.exitCode=1}
`});try{let n=B(t.url),r=z.dirname(n),i=z.join(r,`bunfig.toml`);L.writeFileSync(i,``,{mode:384,flag:`wx`});let a={};for(let e of[`SystemRoot`,`SYSTEMROOT`,`WINDIR`,`TEMP`,`TMP`,`TMPDIR`])process.env[e]&&(a[e]=process.env[e]);let o=V(process.execPath,[`--no-install`,`--no-env-file`,`--config=${i}`,n,z.resolve(e)],{cwd:r,env:Te(a),encoding:`utf8`,stdio:[`ignore`,`pipe`,`pipe`],timeout:5e3,killSignal:`SIGKILL`,maxBuffer:4096});if(o.error)throw o.error;let s=parseProbeFacts(o.stdout);if(o.status!==0)throw Error(s&&`error`in s&&typeof s.error==`string`?s.error.slice(0,512):`SQLite library probe failed (${o.signal??o.status})`);if(!s||!(`version`in s)||typeof s.version!=`string`||s.version.length>64||!(`extensionLoadingSupported`in s)||typeof s.extensionLoadingSupported!=`boolean`)throw Error(`SQLite library probe returned invalid output`);return{version:s.version,extensionLoadingSupported:s.extensionLoadingSupported}}finally{t.dispose()}}function parseProbeFacts(e){let t;try{t=JSON.parse(e)}catch{return}return typeof t==`object`&&t&&!Array.isArray(t)&&`protocol`in t&&t.protocol===1?t:void 0}const xt=`openclaw.processMachineIdentity`;function readProcessMachineIdentity(){let e=N(xt);return e?.platform!==process.platform&&(e={platform:process.platform,value:probeMachineIdentity()},P(xt,e)),e.value}function probeMachineIdentity(){try{let e;if(process.platform===`linux`){let t=qe(`/etc/machine-id`,`utf8`).trim();/^[a-f0-9]{32}$/u.test(t)&&(e=t)}else if(process.platform===`darwin`){let t=V(`/usr/sbin/ioreg`,[`-rd1`,`-c`,`IOPlatformExpertDevice`],{encoding:`utf8`,timeout:1e3,maxBuffer:65536,killSignal:`SIGKILL`,stdio:[`ignore`,`pipe`,`ignore`]}),n=[...(t.stdout??``).matchAll(/"IOPlatformUUID"\s*=\s*"([^"]+)"/gu)],r=n.length===1?n[0]?.[1]?.toLowerCase():void 0;!t.error&&t.status===0&&r&&/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/u.test(r)&&(e=r)}return!e||/^0+$/u.test(e.replaceAll(`-`,``))?null:He(`sha256`,`openclaw:state-lease-process-owner:machine:v1`).update(`${process.platform}\0${e}`).digest(`hex`)}catch{return null}}function isSqliteWalResetSafeVersion(e){let t=/^(\d+)\.(\d+)\.(\d+)$/u.exec(e.trim());if(!t)return!1;let[n,r,i]=t.slice(1).map(Number);return[n,r,i].every(Number.isSafeInteger)?n>3||n===3&&(r>51||r===51&&i>=3||r===50&&i>=7||r===44&&i>=6):!1}const St=`openclaw.bunSqliteLibrarySelection`,Ct=`openclaw.sqliteRuntimeCapabilities`,H=`openclaw.sqliteNativeRuntimeAdmission`;function createCapabilities(e){let t,n,r=0,i=Object.freeze({explicitSqliteCloseReleasesNativeResources:!1,decided:!1,reason:`SQLite close capability has not been decided`});function decide(e){return t||(t=Object.freeze(e),P(Ct,t),t.explicitSqliteCloseReleasesNativeResources&&r>0&&process.emitWarning(`SQLite close became capable after ${r} topology owners were created; those owners remain conservative`,{code:`SQLITE_EARLY_TOPOLOGY`})),t}function conservative(e){return{explicitSqliteCloseReleasesNativeResources:!1,decided:!0,reason:e}}function settled(){if(t)return t;if(!process.versions.bun)return decide({explicitSqliteCloseReleasesNativeResources:!0,decided:!0,reason:`Node runtime`});if(process.platform===`win32`)return decide(conservative(`Bun Windows native-close conformance is not qualified`));if(!Re)return decide({...i,reason:`Parent did not complete SQLite close admission`,...N(Ct)})}return{get(){return settled()??i},capture(){let e=settled()??i;return e.decided||(r+=1),e.explicitSqliteCloseReleasesNativeResources},initialize(){return n??=(async()=>{e();let t=settled();if(t)return t;try{if(he(process.env.OPENCLAW_DIAGNOSTICS).flags.some(e=>e.toLowerCase()===`sqlite.close.conservative`))return decide(conservative(`SQLite close optimization disabled by internal diagnostic flag`));let{probeSqliteNativeClose:e}=await import(`./disk-budget.worker-bun-sqlite-close-probe-fSTnHLZd.mjs`);return decide({...await e(),decided:!0})}catch(e){return decide(conservative(`SQLite close check failed: ${String(e)}`))}})(),n}}}function selectLibrary(e){let{Database:t}=Fe(import.meta.url)(`bun:sqlite`);t.setCustomSQLite(e)}function createSelector(){let e,t;return(n={})=>{if(t)throw t;if(e)return e;let r=n.explicitPath??(process.env.OPENCLAW_SQLITE_LIBRARY?.trim()||void 0);if(!process.versions.bun||process.platform!==`darwin`)return e=r?{source:`runtime`,ignoredOverride:`OPENCLAW_SQLITE_LIBRARY requires Bun on macOS`}:{source:`runtime`},e;let i=n.standaloneRoot??Ee(),a=r===void 0&&i!==void 0?$e.join(i,`lib/libsqlite3.dylib`):void 0,o=process.env.HOMEBREW_PREFIX?.trim(),s=r===void 0?[.../* @__PURE__ */ new Set([...a?[a]:[],...o?[$e.join(o,`opt/sqlite/lib/libsqlite3.dylib`)]:[],`/opt/homebrew/opt/sqlite/lib/libsqlite3.dylib`,`/usr/local/opt/sqlite/lib/libsqlite3.dylib`,`/opt/local/lib/libsqlite3.dylib`])]:[r],c=[];for(let n of s){let i=r===void 0?n===a?`bundled`:`discovered`:`env`,o,s=!0;try{try{o=probeBunSqliteLibrary(n)}catch(e){throw s=Ke(n),s?e:Error(`missing file`,{cause:e})}if(!isSqliteWalResetSafeVersion(o.version))throw Error(`SQLite version ${o.version} below the WAL safety floor`);if(!o.extensionLoadingSupported)throw Error(`built with SQLITE_OMIT_LOAD_EXTENSION`)}catch(e){if(r===void 0){(s||n===a)&&c.push(`${n} (${e instanceof Error?e.message:String(e)})`);continue}throw t=selectionError(n,e,i===`bundled`),t}try{selectLibrary(n)}catch(e){throw t=selectionError(n,e,i===`bundled`),t}return e={source:i,path:n,version:o.version,extensionLoadingSupported:!0},e}throw t=/* @__PURE__ */ Error(`No supported SQLite library for Bun on macOS (${process.arch})`+(c.length>0?`; unusable: ${c.join(`, `)}`:``)+`. Apple's system SQLite fails OpenClaw's read-only database connections. `+(a?`Rebuild or replace the complete standalone artifact to restore its bundled SQLite library. `:``)+`Install one with brew install sqlite, or set OPENCLAW_SQLITE_LIBRARY to a libsqlite3.dylib built for ${process.arch}.`),t}}function selectionError(e,t,n=!1){let r=n?`Rebuild or replace the complete standalone artifact (openclaw and runtime/), or set OPENCLAW_SQLITE_LIBRARY to a supported library.`:`Fix or unset OPENCLAW_SQLITE_LIBRARY; install a supported library with brew install sqlite.`;return Error(`Cannot use ${n?`bundled `:``}SQLite library ${e}: ${t instanceof Error?t.message:String(t)}. ${r}`,{cause:t})}function readPublishedSqliteLibrarySelection(){return N(St)}function withSelectedSqliteLibraryEnv(e){if(!process.versions.bun||process.platform!==`darwin`)return e;let t=readPublishedSqliteLibrarySelection();return t&&t.source!==`runtime`&&e.OPENCLAW_SQLITE_LIBRARY!==t.path?{...e,OPENCLAW_SQLITE_LIBRARY:t.path}:e}function createRuntimeSelector(){let e=!!process.versions.bun&&process.platform===`darwin`,t;e&&!Re&&(t=readPublishedSqliteLibrarySelection());let n=createSelector(),r=!1;return i=>{let a=t??n(i);return e&&Re&&!r&&(P(St,Object.freeze({...a})),r=!0),a}}function runtimeSelector(){return d(Symbol.for(`openclaw.bunSqliteLibrarySelection`),createRuntimeSelector)}function capabilities(){let e=runtimeSelector();return e.capabilities??=createCapabilities(e)}function getSqliteRuntimeCapabilities(){return capabilities().get()}function captureSqliteWorkerClosePolicy(){return capabilities().capture()}function captureSqliteWorkerEnvironmentData(e=N(ee)){return[[St,ensureSqliteLibrarySelected()],[Ct,getSqliteRuntimeCapabilities()],[H,N(H)],[ee,e],[xt,N(xt)]]}function ensureSqliteLibrarySelected(e){return runtimeSelector()(e)}function notifyListeners(e,t,n){for(let r of e)try{r(t)}catch(e){n?.(e)}}function registerListener(e,t){return e.add(t),()=>e.delete(t)}function assertSyncTransactionResult(e){if(oe(e))throw Error(`SQLite write transactions must be synchronous; Promise returns are not supported.`)}const wt=Symbol.for(`openclaw.postgres-sync-connection`);function isPostgresSqlConnection(e){return wt in e&&e[wt]===!0}function sqlPublicationAnchor(e){return isPostgresSqlConnection(e)?e.anchor:e}function fileFields(e){return{dev:e.dev.toString(),ino:e.ino.toString(),birthtime:pe(e),size:e.size.toString(),mtimeNs:e.mtimeNs.toString()}}function checksum(e){return Ve(`sha256`).update(e).digest(`hex`).slice(0,16)}function hasNoJournal(e){return[`-wal`,`-journal`].every(t=>{try{let n=L.statSync(`${e}${t}`,{bigint:!0});return n.isFile()&&n.size===0n}catch(e){if(n(e,`ENOENT`))return!0;throw e}})}function decodeSeal(e,t,n){let r=JSON.parse(e);if(!i(r)||typeof r.payload!=`string`||r.checksum!==checksum(r.payload))return n(`malformed-proof`);let a=JSON.parse(r.payload);if(!i(a)||a.version!==1||typeof a.schemaIdentity!=`string`||typeof a.verifiedAt!=`number`||!Number.isSafeInteger(a.verifiedAt)||!(`facts`in a)||!t.isFile())return n(`malformed-proof`);let o=Date.now()-a.verifiedAt;return o<0||o>6048e5?n(`expired-proof`):Object.entries(fileFields(t)).every(([e,t])=>a[e]===t)?{schemaIdentity:a.schemaIdentity,verifiedAt:a.verifiedAt,facts:a.facts,...a.identity===void 0?{}:{identity:a.identity}}:n(`file-mismatch`)}function readSqliteCleanCloseSeal(e,t,r){let refuse=e=>{r?.(e)};try{let n=`${e}.seal`;if(!L.lstatSync(n).isFile())return refuse(`malformed-proof`);let r=decodeSeal(L.readFileSync(n,`utf8`),t,refuse);return r?hasNoJournal(e)?r:refuse(`journal-present`):void 0}catch(e){return refuse(n(e,`ENOENT`)?`no-proof`:`malformed-proof`)}}async function readSqliteCleanCloseSealAsync(e,t,r){let refuse=e=>{r?.(e)};try{let r=`${e}.seal`;if(!(await L.promises.lstat(r)).isFile())return refuse(`malformed-proof`);let i=decodeSeal(await L.promises.readFile(r,`utf8`),t,refuse);if(!i)return;for(let t of[`-wal`,`-journal`])try{let n=await L.promises.stat(`${e}${t}`,{bigint:!0});if(!n.isFile()||n.size!==0n)return refuse(`journal-present`)}catch(e){if(!n(e,`ENOENT`))throw e}return i}catch(e){return refuse(n(e,`ENOENT`)?`no-proof`:`malformed-proof`)}}function invalidateSqliteCleanCloseSeal(e){try{L.unlinkSync(`${e}.seal`)}catch(e){if(!n(e,`ENOENT`))throw e}}function writeSqliteCleanCloseSeal(e,t,n,r){try{let i=`${e}.seal`,a=L.lstatSync(i,{throwIfNoEntry:!1});if(!n.isFile()||a&&!a.isFile()||!hasNoJournal(e))return invalidateSqliteCleanCloseSeal(e),!1;let o=JSON.stringify({version:1,schemaIdentity:t,...fileFields(n),verifiedAt:r.verifiedAt,facts:r.facts,identity:r.identity});return L.writeFileSync(i,JSON.stringify({payload:o,checksum:checksum(o)})),!0}catch{try{invalidateSqliteCleanCloseSeal(e)}catch{}return!1}}function resolveSqliteDatabaseFilePath(e){if(!e.startsWith(`file:`))return e;let[t=``]=e.slice(5).split(/[?#]/u,1);return t.startsWith(`/`)?B(e):decodeURIComponent(t)}function createSqliteDatabaseDescriptorOwner(e){function prepareOwnedSqliteDatabaseAdmission(t){let n=k.descriptorPreparation.then(async()=>{if(F!==0)throw Error(`SQLite descriptor preparation belongs to the host`);t.assertCurrent();let n=await L.promises.stat(t.location,{bigint:!0});T(n,t.expectedIdentity);let r=await L.promises.realpath(t.location);if(t.assertCurrent(),r!==t.location)throw Error(`SQLite private staging location changed before admission`);let i=C(n),a=k.registry.descriptors.get(i);if(retainPreparedSqliteDatabaseAdmissionLocation(t.location,t.expectedIdentity,{identity:i,canonicalPath:r}))return;let o=a?.descriptor??await new Promise((e,n)=>{L.open(t.location,`r`,(t,r)=>t?n(t):e(r))}),s=!1,c=!1;try{let n=await new Promise((e,t)=>{L.fstat(o,{bigint:!0},(n,r)=>n?t(n):e(r))});T(n,t.expectedIdentity),s=a===void 0;let i,l=await readSqliteCleanCloseSealAsync(r,n,e=>{i=e});T(await L.promises.stat(t.location,{bigint:!0}),t.expectedIdentity),t.assertCurrent();let u=k.registry.retainDescriptor(r,o,n);c=!0,e.load(u,{seal:l,refusal:i})}catch(e){if(s&&!c)try{await new Promise((e,t)=>{L.close(o,n=>n?t(n):e())})}catch(t){throw ae([e,t],`SQLite preparation cleanup failed`,e)}throw e}});return k.descriptorPreparation=n.then(()=>{},()=>{}),n}function prepareSqliteDatabaseAdmissionAsync(t){let r=resolveAdmissionTarget(t.location,t.create!==void 0);if(!r)return Promise.resolve(void 0);let{filename:i,create:a}=r,o=t.identity,prepare=async()=>{t.assertCurrent();let r=o??await se(i);if(o=void 0,t.assertCurrent(),!r)return;if(t.expectedIdentity&&(r.key!==t.expectedIdentity.key||t.expectedIdentity.birthtime!==void 0&&r.birthtime!==t.expectedIdentity.birthtime))throw Error(`SQLite Worker path no longer matches its borrowed native owner`);let s=r.key.startsWith(`file:`),c=!s&&a?t.create:void 0;if(!s&&!c)return r;let l=`${r.key.slice(5)}:${r.birthtime}`;if(t.observedLocation&&t.observedLocation.identity!==l)throw Error(`SQLite database changed while retaining its admission identity`);if(F!==0){if(c)throw Error(`SQLite descriptor creation belongs to the host`);return pathAdmission(i,l),t.assertCurrent(),r}let u=s?k.registry.descriptors.get(l):void 0;if(u&&(T(u.file,r),retainPreparedSqliteDatabaseAdmissionLocation(i,void 0,{identity:l,canonicalPath:r.canonicalPath})))return r;let d,f;if(u)d=u.descriptor,f=u.file;else{c&&await c.authorize(r.canonicalPath),t.assertCurrent();let e=c?De():void 0;e&&c?.retain(e.promise);let a;try{a=await new Promise((e,t)=>{L.open(i,c?`wx`:`r`,420,(n,r)=>n?t(n):e(r))}),d=a,f=await new Promise((e,t)=>{L.fstat(d,{bigint:!0},(n,r)=>n?t(n):e(r))}),s&&T(f,r),k.registry.retainDescriptorCustody(r.canonicalPath,d,f),e?.resolve()}catch(t){if(a===void 0){if(e?.resolve(),c&&n(t,`EEXIST`))return prepare()}else e?.reject(t);throw t}}let p=s?r:{key:`file:${f.dev}:${f.ino}`,canonicalPath:r.canonicalPath,birthtime:pe(f)},m,h=s?await readSqliteCleanCloseSealAsync(r.canonicalPath,f,e=>{m=e}):void 0,g=await se(i);if(!g||g.key!==p.key||g.birthtime!==p.birthtime||g.canonicalPath!==p.canonicalPath)throw Error(`SQLite database changed identity during admission`);t.assertCurrent();let _=k.registry.records.get(C(f)),v=_&&!j(_)?_:k.registry.retainDescriptor(p.canonicalPath,d,f);return k.registry.observeLocation(i,v.identity),s?e.load(v,{seal:h,refusal:m}):e.markLoaded(v),p},s=k.descriptorPreparation.then(prepare);return k.descriptorPreparation=s.then(()=>{},()=>{}),s}function retainPreparedSqliteDatabaseAdmissionLocation(t,n,r){let i=!r&&k.registry.forLocation(t),a=i&&k.registry.descriptors.get(i.identity);if(i&&n?.birthtime!==void 0&&i.physicalIdentity.key===n.key&&i.physicalIdentity.birthtime===n.birthtime&&a&&a.descriptor===i.descriptor&&e.isLoaded(a))return e.load(i),!0;let o=r&&k.registry.descriptors.get(r.identity);if(r&&o&&e.isLoaded(o)){n&&T(o.file,n);let i=k.registry.records.get(r.identity),a=i&&!j(i)?i:k.registry.retainDescriptor(r.canonicalPath,o.descriptor,o.file);return k.registry.observeLocation(t,a.identity),e.markLoaded(a),!0}return!1}function retainSqliteDatabaseAdmissionLocation(t,n,r){if(retainPreparedSqliteDatabaseAdmissionLocation(t,n,r))return;let i=L.statSync(t,{bigint:!0});if(!i.isFile())return;let a=C(i),o=k.registry.records.get(a);if(o&&!j(o)){k.registry.observeLocation(t,a),e.load(o);return}if(F!==0)return;let s=k.registry.descriptors.get(a)?.descriptor??L.openSync(t,`r`),c=L.fstatSync(s,{bigint:!0});if(!c.isFile()||C(c)!==a)throw Error(`SQLite database changed while retaining its admission identity`);let l=k.registry.retainDescriptor(L.realpathSync.native(t),s,c);k.registry.observeLocation(t,l.identity),e.load(l)}function pathAdmission(t,r){try{let n=k.registry.forLocation(t);if(!n){let e=r;if(e===void 0&&F!==0){let n=L.statSync(t,{bigint:!0});if(!n.isFile())return;e=C(n)}b(t,void 0,!1,e!==void 0&&F!==0?{identity:e,canonicalPath:L.realpathSync.native(t)}:void 0),n=k.registry.forLocation(t)}return n?(e.load(n),n):(retainSqliteDatabaseAdmissionLocation(t),k.registry.forLocation(t))}catch(e){if(n(e,`ENOENT`))return;throw e}}function resolveAdmissionTarget(e,t){let n=e,r=t;if(n&&n!==`:memory:`){if(n.startsWith(`file:`)){let e=new URL(n);if(e.searchParams.get(`mode`)===`memory`||([`ro`,`rw`].includes(e.searchParams.get(`mode`)??``)&&(r=!1),n=resolveSqliteDatabaseFilePath(n),!n||n===`:memory:`))return}return{filename:n,create:r}}}function prepareSqliteDatabaseAdmission(t,r={}){let i=resolveAdmissionTarget(t,r.create);if(!i)return;let{filename:a,create:o}=i;try{let e=L.statSync(a,{bigint:!0});if(!e.isFile()){k.registry.observeLocation(a,void 0);return}let t=C(e);return k.registry.observeLocation(a,t),t}catch(t){if(n(t,`ENOENT`)){if(k.registry.observeLocation(a,void 0),!o)return;if(F!==0){let e=k.exchange.getStore()!==void 0;b(a,!0);let n=prepareSqliteDatabaseAdmission(a);if(e&&n===void 0)throw Error(`SQLite worker file creation requires host authority: ${a}`,{cause:t});return n}let r;try{r=L.openSync(a,`wx`,420)}catch(e){if(n(e,`EEXIST`))return prepareSqliteDatabaseAdmission(a);throw e}let i=L.fstatSync(r,{bigint:!0}),s=k.registry.retainDescriptor(L.realpathSync.native(a),r,i);if(e.markLoaded(s),prepareSqliteDatabaseAdmission(a)!==s.identity)throw Error(`SQLite database changed identity during file creation`,{cause:t});return s.identity}throw t}}return{prepareOwnedSqliteDatabaseAdmission,prepareSqliteDatabaseAdmissionAsync,retainSqliteDatabaseAdmissionLocation,retainPreparedSqliteDatabaseAdmissionLocation,prepareSqliteDatabaseAdmission,pathAdmission}}const Tt=d(Symbol.for(`openclaw.sqliteNativeAdmissions`),()=>({operations:/* @__PURE__ */ new WeakMap}));function getSqliteNativeAdmissionFacts(e){return Tt.operations.get(e)?.facts}function beginSqliteDatabaseAdmissionOperation(e){let t=Tt.operations.get(e)??{depth:0,facts:/* @__PURE__ */ new Map};return t.depth+=1,Tt.operations.set(e,t),()=>{--t.depth,t.depth===0&&Tt.operations.delete(e)}}function createSqliteDatabaseAdmissionReader(e){let{state:t,admission:n,pathAdmission:r,exchange:i,retain:a,release:o,publishFact:s}=e;function readSqliteDatabaseWriteRevision(e){let r=sqlPublicationAnchor(e);if(!r.isOpen||t.suspended.has(r))return;let i=n(r);if(!i){let e=r.location();return!e||e===`:memory:`?t.localWriteRevisions.get(r)??0:void 0}return w(i,`writeRevision`)}function readSqliteDatabaseSiblingWriteRevision(e){let n=sqlPublicationAnchor(e),r=readSqliteDatabaseWriteRevision(n);return r===void 0?void 0:r-(t.localWriteRevisions.get(n)??0)|0}function readSqliteDatabaseCleanClose(t){let n=e.prepareFileIdentity(t),i=r(t);return i!==void 0&&i.identity===n&&Atomics.load(new Int32Array(i.generation),x.sealPresent)===1}function readSqliteDatabaseIntegrityVerification(t){let n=typeof t==`string`?getOrLoadSqliteDatabaseAdmissionForPath(t,e.integrityVerificationKey,()=>void 0):getSqliteDatabaseAdmission(t,e.integrityVerificationKey);return n===void 0?void 0:{verifiedAt:n}}function readSqliteDatabaseCleanCloseRefusal(e){return n(sqlPublicationAnchor(e))?.cleanCloseRefusal}function retainSqliteDatabaseAdmissionForPath(e){let n=r(e);if(!n)return;try{a(n)}catch(e){throw o(n),e}let i=!1,s=t.registry.prepareLocation(e);return{location:e,identity:{...n.physicalIdentity,canonicalPath:n.location},isCurrent:()=>!i&&s()===n,release(){i||(i=!0,o(n))}}}function withPathAdmission(e,t){let n=r(e);if(!n)return t(void 0);try{return a(n),t(n)}finally{o(n)}}function getSqliteDatabaseAdmission(e,r,a={}){let o=sqlPublicationAnchor(e);if(!o.isOpen||t.suspended.has(o))return;let s=n(o,a.existingOnly!==!0&&!e.isTransaction);if(!s)return;let c=(isPostgresSqlConnection(e)?void 0:getSqliteNativeAdmissionFacts(e))?.get(r.name)??t.local.get(o)?.get(r.name);if(c&&c.revision===A(s,c.schemaDependent)&&(!c.schemaDependent||c.ddlRevision===(t.ddlRevisions.get(o)??0)))return O(c,r);if(r.schemaDependent&&t.schemaDirty.has(o))return;if(t.rolledBack.has(o)){if(e.isTransaction)return;t.rolledBack.delete(o)}let l=s.facts.get(r.name);if(!l||!E(s,l)||a.refresh&&r.writer!==`host`){if(r.writer===`host`)return e.isTransaction||F===0||s.hostRevision===w(s,`hostRevision`)?void 0:(i(s),l=s.facts.get(r.name),l&&E(s,l)?O(l,r):void 0);let n=w(s,`publicationRevision`),o=t.misses.get(s)??/* @__PURE__ */ new Map;t.misses.set(s,o),r.writer!==`connection`&&!e.isTransaction&&(a.refresh||o.get(r.name)!==n)&&(i(s),l=s.facts.get(r.name),o.set(r.name,w(s,`publicationRevision`)))}return l&&E(s,l)?O(l,r):void 0}function getOrLoadSqliteDatabaseAdmissionForPath(e,t,n){let read=e=>{if(!e)return n();let r=e.facts.get(t.name),i=r&&E(e,r)?O(r,t):void 0;if(i!==void 0)return i;let a=A(e,t.schemaDependent),o=n();return o!==void 0&&s(e,t,re(t,o),a),o};return t.lifetime===`process`?withPathAdmission(e,read):read(r(e))}function peekSqliteDatabaseAdmissionForPath(e,n){let r=t.registry.forLocation(e),i=r?.facts.get(n.name);return r&&i&&E(r,i)?O(i,n):void 0}function prepareSqliteDatabaseAdmissionForPath(e,t){let n=r(e);if(!n)return()=>void 0;let i=new Int32Array(n.generation),a=t.schemaDependent?x.schemaRevision:x.factRevision,o=n.facts.get(t.name),s=o&&new Int32Array(o.current);return()=>{if(Atomics.load(i,x.retired)!==0)return;let e=n.facts.get(t.name);return e!==o&&(o=e,s=o&&new Int32Array(o.current)),o&&s&&Atomics.load(s,0)===1&&o.revision===Atomics.load(i,a)?O(o,t):void 0}}function getSqliteDatabaseSchemaRevision(e,r={}){let i=sqlPublicationAnchor(e),a=n(i,r.existingOnly!==!0);if(a)return w(a,`schemaRevision`);let o=t.openedIdentities.get(i);return o?t.localSchemaRevisions.get(o)??0:void 0}function hasSqliteDatabaseSchemaAdmissionForPath(e){return y(r(e))}function getSqliteDatabaseAdmissionIdentityForPath(e){return t.registry.forLocation(e)?.physicalIdentity}function getSqliteDatabaseAdmissionSourceForPath(e){let n=t.registry.forLocation(e);return n&&{identity:n.physicalIdentity,canonicalPath:n.location}}function observeSqliteDatabaseAdmissionLocation(e,n){let r=t.registry.forLocation(n.canonicalPath);r?.physicalIdentity.key===n.key&&r.physicalIdentity.birthtime===n.birthtime&&t.registry.observeLocation(e,r.identity)}function hasSqliteDatabaseSchemaAdmissionForIdentity(e){if(!e.key.startsWith(`file:`)||e.birthtime===void 0)return!1;let n=`${e.key.slice(5)}:${e.birthtime}`;return y(t.registry.records.get(n))}return{readSqliteDatabaseWriteRevision,readSqliteDatabaseSiblingWriteRevision,readSqliteDatabaseCleanClose,readSqliteDatabaseIntegrityVerification,readSqliteDatabaseCleanCloseRefusal,getSqliteDatabaseAdmission,getSqliteDatabaseSchemaRevision,getOrLoadSqliteDatabaseAdmissionForPath,peekSqliteDatabaseAdmissionForPath,prepareSqliteDatabaseAdmissionForPath,hasSqliteDatabaseSchemaAdmissionForPath,getSqliteDatabaseAdmissionIdentityForPath,getSqliteDatabaseAdmissionSourceForPath,observeSqliteDatabaseAdmissionLocation,hasSqliteDatabaseSchemaAdmissionForIdentity,retainSqliteDatabaseAdmissionForPath}}const Et=/* @__PURE__ */ new Set([`CHECK`,`FOREIGN`,`PRIMARY`,`UNIQUE`]);function extractSqliteTableSchema(e,t,n={}){let r=e.indexOf(`CREATE TABLE IF NOT EXISTS ${t} (`),i=n.endMarker??e.slice(r).match(/\n\) STRICT(?:, WITHOUT ROWID)?;/u)?.[0],a=i?e.indexOf(i,r):-1;if(r<0||!i||a<r)throw Error(n.errorMessage??`Canonical schema markers are missing for ${t}`);return e.slice(r,a+(n.includeEndMarker===!1?0:i.length))}function readTableConstraintKeyword(e,t){let n=t;if(n.keyword===`CONSTRAINT`){let t=readSqlToken(e,n.end);n=t?readSqlToken(e,t.end):null}return n?.keyword&&Et.has(n.keyword)?n.keyword:null}function readSqlToken(e,t){let n=t;for(;n<e.length&&/\s/u.test(e[n]??``);)n+=1;let r=e[n];if(!r)return null;if(r===`"`||r==="`"||r===`[`){let t=skipSqlQuoted(e,n,r);return{end:t,keyword:null,raw:e.slice(n,t)}}let i=n;for(;i<e.length&&!/[\s(,]/u.test(e[i]??``);)i+=1;let a=e.slice(n,i);return{end:i,keyword:a.toUpperCase(),raw:a}}function normalizeSqlIdentifier(e){return e.startsWith(`"`)&&e.endsWith(`"`)?e.slice(1,-1).replaceAll(`""`,`"`).toLowerCase():e.startsWith("`")&&e.endsWith("`")?e.slice(1,-1).replaceAll("``","`").toLowerCase():e.startsWith(`[`)&&e.endsWith(`]`)?e.slice(1,-1).toLowerCase():e.toLowerCase()}function normalizeSchemaSql(e){return e===null?null:normalizeSqlWhitespace(e).replace(/;\s*$/u,``).trim().replace(/^(CREATE (?:TABLE|VIRTUAL TABLE|UNIQUE INDEX|INDEX|TRIGGER)) IF NOT EXISTS /iu,`$1 `)}function splitSqlList(e){let t=[],n=0,r=0;for(let i of unquotedSqlIndexes(e,0)){let a=e[i];a===`(`?n+=1:a===`)`?--n:a===`,`&&n===0&&(t.push(e.slice(r,i)),r=i+1)}return t.push(e.slice(r)),t}function findSqlCharacter(e,t){for(let n of unquotedSqlIndexes(e,0))if(e[n]===t)return n;return-1}function hasUnquotedSqlKeyword(e,t){let n=/* @__PURE__ */ new Set;for(let r of e.matchAll(t))n.add(r.index);if(n.size===0)return!1;for(let t of unquotedSqlIndexes(e,0))if(n.has(t))return!0;return!1}function findSqlClosingParenthesis(e,t){let n=0;for(let r of unquotedSqlIndexes(e,t)){let t=e[r];if(t===`(`)n+=1;else if(t===`)`&&(--n,n===0))return r}throw Error(`SQLite schema contains an unterminated table definition.`)}function normalizeSqlWhitespace(e){let t=``,n=!1,r=/[^\s'"`[/-]+|\s+|./gsu,i;for(;i=r.exec(e);){let a=i.index,o=i[0][0]??``,s=skipSqlQuoted(e,a,o),c=i[0];if(s!==a)c=e.slice(a,s),r.lastIndex=s;else{let t=skipSqlComment(e,a);if(t!==a){n=!0,r.lastIndex=t;continue}if(/\s/u.test(o)){n=!0;continue}}n&&t.length>0&&(t+=` `),t+=c,n=!1}return t.trim()}function quoteSqliteIdentifier(e){return`"${e.replaceAll(`"`,`""`)}"`}function*unquotedSqlIndexes(e,t){let n=t;for(;n<e.length;){let t=skipSqlQuoted(e,n,e[n]??``),r=t===n?skipSqlComment(e,n):t;r===n?(yield n,n+=1):n=r}}function skipSqlQuoted(e,t,n){if(n!==`'`&&n!==`"`&&n!=="`"&&n!==`[`)return t;let r=n===`[`?`]`:n,i=t+1;for(;i<e.length;)if(e[i]!==r)i+=1;else if(n!==`[`&&e[i+1]===r)i+=2;else return i+1;return e.length}function skipSqlComment(e,t){if(e.startsWith(`--`,t)){let n=e.indexOf(`
`,t+2);return n===-1?e.length:n+1}if(e.startsWith(`/*`,t)){let n=e.indexOf(`*/`,t+2);return n===-1?e.length:n+2}return t}function createSqliteTableContract(e,t,n,r,i,a,o){let s=i.map(e=>({name:e.name,sql:normalizeSchemaSql(e.sql)})),c=t.sql?.startsWith(`CREATE TABLE `)?null:normalizeSchemaSql(t.sql),l=c!==null&&/^CREATE VIRTUAL TABLE /iu.test(c);return{definition:l?null:parseSqliteTableDefinition(t.sql,e),indexes:r,columns:a,foreignKeys:o,strict:n.strict,triggers:s,virtualTableSql:l?c:null,withoutRowid:n.wr}}function createSqliteIndexContract(e,t,n){let r=n.map(({cid:e,coll:t,desc:n,key:r,name:i,seqno:a})=>({coll:t,desc:n,key:r,kind:e===-2?`expression`:e===-1?`rowid`:`column`,name:i,seqno:a}));return{name:e.name.startsWith(`sqlite_autoindex_`)?null:e.name,origin:e.origin,partial:e.partial,sql:normalizeSchemaSql(t),terms:r,unique:e.unique}}function parseSqliteTableDefinition(e,t){if(e===null)throw Error(`Could not inspect SQLite table definition for ${t}.`);let n=findSqlCharacter(e,`(`);if(n===-1)throw Error(`SQLite table ${t} has no column definition.`);let r=findSqlClosingParenthesis(e,n),i=/* @__PURE__ */ new Map,a=[];for(let o of splitSqlList(e.slice(n+1,r))){let e=normalizeSqlWhitespace(o);if(!e)continue;let n=readSqlToken(e,0);if(!n)throw Error(`SQLite table ${t} contains an unreadable definition.`);if(readTableConstraintKeyword(e,n)){a.push(e);continue}let r=normalizeSqlIdentifier(n.raw);if(i.has(r))throw Error(`SQLite table ${t} contains duplicate column ${r}.`);i.set(r,e)}return{columns:new Map([...i].toSorted(([e],[t])=>e.localeCompare(t))),constraints:a.toSorted()}}const Dt=[{columnName:`owner_actor_type`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_actor_id`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_assigned_by_type`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_assigned_by_id`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_assigned_at`,dataType:`INTEGER`,tableName:`session_nodes`}],Ot={columnName:`legacy_acp_migration_json`,dataType:`TEXT`,tableName:`session_nodes`},kt={columnName:`canonical_ready`,dataType:`TEXT`,tableName:`session_key_contract`},At=[...Dt,Ot,kt],jt=[{tableName:`session_pending_inputs`,columnName:`consumed_event_id`,dataType:`TEXT`},{tableName:`session_transcript_active_events`,columnName:`context_eligible`,dataType:`INTEGER`},{tableName:`session_nodes`,columnName:`project_id`,dataType:`TEXT`},{tableName:`session_windows`,columnName:`row_transcript_json`,dataType:`TEXT`},{tableName:`session_windows`,columnName:`row_transcript_updated_at`,dataType:`INTEGER`},{tableName:`session_conversations`,columnName:`route_context_json`,dataType:`TEXT`}];function hasPendingAgentStartupColumns(e){let t=/* @__PURE__ */ new Map;return jt.some(({tableName:n,columnName:r})=>{if(!e.has(n))return!1;let i=e.get(n);if(!i)return!0;let a=t.get(n);return a||(a=parseSqliteTableDefinition(i,n).columns,t.set(n,a)),!a.has(r)})}function formatErrorMessage(e){return s(e,{redact:ge})}function compareValidSemver(e,t){let n=lt(e),r=lt(t);return n&&r?n.compare(r):null}const Mt=Symbol.for(`openclaw.warning-filter`);function shouldIgnoreWarning(e){return!!(e.code===`DEP0040`&&e.message?.includes(`punycode`)||e.code===`DEP0060`&&e.message?.includes(`util._extend`)||e.name===`ExperimentalWarning`&&e.message?.includes(`SQLite is an experimental feature`))}function normalizeWarningArgs(e){let t=e[0],n=e[1],r=e[2],a,o,s;return t instanceof Error?(a=t.name,s=t.message,o=t.code):typeof t==`string`&&(s=t),i(n)?(typeof n.type==`string`&&(a=n.type),typeof n.code==`string`&&(o=n.code)):(typeof n==`string`&&(a=n),typeof r==`string`&&(o=r)),{name:a,code:o,message:s}}function installProcessWarningFilter(){let e=d(Mt,()=>({installed:!1}));if(e.installed)return;let t=process.emitWarning.bind(process),wrappedEmitWarning=((...e)=>{if(!shouldIgnoreWarning(normalizeWarningArgs(e))){if(e[0]instanceof Error&&i(e[1])){let t=e[0],n=Object.assign(Error(t.message),{name:t.name,code:t.code});process.emit(`warning`,n)}else Reflect.apply(t,process,e)}});process.emitWarning=wrappedEmitWarning,e.installed=!0}const Nt=Fe(import.meta.url);let Pt;function assertSqliteWalResetSafeVersion(e,t){if(isSqliteWalResetSafeVersion(e))return;let n=process.config.variables,r=n.node_shared_sqlite===!0||n.node_shared_sqlite===`true`;throw Error(`OpenClaw requires SQLite 3.51.3+, 3.50.7+ within 3.50.x, or 3.44.6+ within 3.44.x for WAL safety; Node ${t} ${r?`uses shared system`:`embeds`} SQLite ${e}, which is affected by the upstream WAL-reset database corruption bug. ${r?`Upgrade the system SQLite library to one of those safe versions, or use a Node build embedding a safe version.`:`Upgrade to Node 24.22.1+ or 26.12.1+ before retrying.`}`)}function sqliteNativeRuntimeIdentity(){return{pid:process.pid,executable:process.execPath,nodeVersion:process.versions.node,bunVersion:process.versions.bun,library:ensureSqliteLibrarySelected()}}function parseSqliteNativeRuntimeAdmission(e){if(!i(e)||e.format!==1||typeof e.version!=`string`||typeof e.extensionLoadingSupported!=`boolean`)return;let t=sqliteNativeRuntimeIdentity();if(tt(e.runtime,t))return{format:1,runtime:t,version:e.version,storageIdentity:i(e.storageIdentity)&&typeof e.storageIdentity.sourceId==`string`&&typeof e.storageIdentity.compileOptions==`string`?{sourceId:e.storageIdentity.sourceId,compileOptions:e.storageIdentity.compileOptions}:void 0,extensionLoadingSupported:e.extensionLoadingSupported}}function safeSqliteNativeRuntimeAdmission(e){try{let t=parseSqliteNativeRuntimeAdmission(e);return t&&isSqliteWalResetSafeVersion(t.version)?t:void 0}catch{return}}function captureSqliteNativeRuntimeAdmission(){return safeSqliteNativeRuntimeAdmission(N(H))}function installSqliteNativeRuntimeAdmission(e){let t=safeSqliteNativeRuntimeAdmission(e);t&&P(H,t)}function assertSafeSqliteRuntime(e){if(Pt===e)return;let t=parseSqliteNativeRuntimeAdmission(N(H));if(t){assertSqliteWalResetSafeVersion(t.version,process.versions.node),compareValidSemver(t.version,`3.45.0`),t.extensionLoadingSupported,Pt=e;return}let n=new e.DatabaseSync(`:memory:`),r,i,a;try{let e=n.prepare(`SELECT sqlite_version() AS version, sqlite_source_id() AS sourceId, (SELECT group_concat(compile_options, ',') FROM (SELECT compile_options FROM pragma_compile_options ORDER BY compile_options)) AS compileOptions, sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted`).get();r=typeof e?.version==`string`?e.version:`unknown`,assertSqliteWalResetSafeVersion(r,process.versions.node),typeof e?.sourceId==`string`&&e.sourceId&&typeof e.compileOptions==`string`&&(i={sourceId:e.sourceId,compileOptions:e.compileOptions}),a=e?.omitted===0}finally{n.close()}compareValidSemver(r,`3.45.0`),Pt=e,P(H,{format:1,runtime:sqliteNativeRuntimeIdentity(),version:r,storageIdentity:i,extensionLoadingSupported:a})}function requireNodeSqlite(){installProcessWarningFilter();try{ensureSqliteLibrarySelected();let e=Nt("node:sqlite");return assertSafeSqliteRuntime(e),e}catch(e){let t=formatErrorMessage(e);throw Error(`SQLite support is unavailable or unsafe in this Node runtime. ${t}`,{cause:e})}}const Ft=`-- Session storage doctrine: session_nodes.entry_json owns hot logical-session facts;
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
`,It=`

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
`;function sqliteDatabaseSealSchemaFor(e){requireNodeSqlite();let t=captureSqliteNativeRuntimeAdmission(),n=t?.storageIdentity;if(!t||!n)return;let r=[t.runtime.nodeVersion,t.runtime.bunVersion??null],i=JSON.stringify([t.version,n.sourceId,n.compileOptions,...r]),a=Ve(`sha256`).update(JSON.stringify([3,i,e])),o=Ve(`sha256`).update(e);return e!==`state`&&(a.update(`42`),a.update(Ft),o.update(`42`),o.update(Ft)),e!==`agent`&&(a.update(`40`),a.update(It),o.update(`40`),o.update(It)),{schemaIdentity:a.digest(`hex`),identity:{runtime:JSON.stringify(r),sqlite:{version:t.version,sourceId:n.sourceId,compileOptions:n.compileOptions.split(`,`).filter(e=>!e.startsWith(`COMPILER=`)).join(`,`)},schema:o.digest(`hex`),policy:3}}}const Lt={};function sealSchema(e){let t=e.includes(`agent.schema-metadata`),n=t===e.includes(`state.schema-version`)?`other`:t?`agent`:`state`;return Lt[n]??=sqliteDatabaseSealSchemaFor(n)}const U={name:`sqlite.full-verification`,lifetime:`process`,read:e=>typeof e==`number`&&Number.isSafeInteger(e)?e:void 0},Rt={...U,name:`sqlite.quick-verification`},zt=/* @__PURE__ */ new Set([`sqlite-schema`,`sqlite.full-verification`,`sqlite.quick-verification`,`state.schema-version`,`state.runtime-schema`,`state.integrity`,`agent.completed-validation`,`agent.canonical-validation-receipt`,`agent.schema-metadata`]);function isSealedKey(e){return zt.has(e)||e.startsWith(`memory.index-schema:`)}function encodeSealValue(e,t){return t instanceof Map?{sealType:`map`,entries:[...t]}:t instanceof Set?{sealType:`set`,entries:[...t]}:t instanceof SharedArrayBuffer?{sealType:`shared`,entries:[...new Int32Array(t)]}:t}function decodeSealValue(e,t){if(!i(t)||!Array.isArray(t.entries))return t;if(t.sealType===`map`)return new Map(t.entries);if(t.sealType===`set`)return new Set(t.entries);if(t.sealType===`shared`){let e=new SharedArrayBuffer(t.entries.length*Int32Array.BYTES_PER_ELEMENT);return new Int32Array(e).set(t.entries),e}return t}var SqliteDatabaseCleanCloseSeals=class{constructor(e,t){this.publishFact=e,this.references=t,this.loaded=/* @__PURE__ */ new WeakMap}isLoaded(e){return this.loaded.has(e)}markLoaded(e){let t=this.references.descriptor(e)??e,n=this.loaded.get(t);n&&n!==e.generation&&Atomics.store(new Int32Array(e.generation),x.sealPresent,Atomics.load(new Int32Array(n),x.sealPresent)),this.loaded.set(t,e.generation)}load(e,t){if(F!==0)return;let n=this.references.descriptor(e)??e;if(this.loaded.has(n))this.markLoaded(e);else{this.markLoaded(e),e.cleanCloseRefusal=`malformed-proof`;try{t?.refusal&&(e.cleanCloseRefusal=t.refusal);let n=t?t.seal:readSqliteCleanCloseSeal(e.location,L.fstatSync(e.descriptor,{bigint:!0}),t=>{e.cleanCloseRefusal=t});if(!n||typeof n.facts!=`string`)return;let r=JSON.parse(n.facts,decodeSealValue);if(!Array.isArray(r)||!r.every(e=>Array.isArray(e)&&e.length===3&&typeof e[0]==`string`&&isSealedKey(e[0])&&typeof e[1]==`boolean`)||!r.some(([e,,t])=>(e===U.name||e===Rt.name)&&t===n.verifiedAt)||!r.some(([e,,t])=>e===`sqlite-schema`&&i(t)))return;let a=sealSchema(r.map(([e])=>e));if(!a){e.cleanCloseRefusal=`identity-mismatch`;return}let o=n.identity;if(o!==void 0&&(!i(o)||typeof o.runtime!=`string`||typeof o.schema!=`string`||typeof o.policy!=`number`))return;if(i(o)&&typeof o.sqlite!=`string`){if(!i(o.sqlite)||typeof o.sqlite.version!=`string`||typeof o.sqlite.sourceId!=`string`||typeof o.sqlite.compileOptions!=`string`)return;let t=o.schema!==a.identity.schema,n=o.policy!==a.identity.policy,r=o.sqlite.compileOptions!==a.identity.sqlite.compileOptions;if(t||n||r){e.cleanCloseRefusal=t?`schema-mismatch`:n?`policy-mismatch`:`feature-mismatch`;return}}else if(n.schemaIdentity!==a.schemaIdentity){e.cleanCloseRefusal=`identity-mismatch`;return}let s=r.find(([e])=>e===`sqlite-schema`)?.[2];if(!(s.tableSql instanceof Map))return;if(hasPendingAgentStartupColumns(s.tableSql)){e.cleanCloseRefusal=`schema-mismatch`;return}delete e.cleanCloseRefusal;for(let[t,n,i]of r)this.publishFact(e,{name:t,schemaDependent:n,lifetime:`process`},{value:i},A(e,n));Atomics.store(new Int32Array(e.generation),x.sealPresent,1)}catch{}finally{this.references.publish(e)}}}invalidate(e,t){invalidateSqliteCleanCloseSeal(t?.location??e),t&&Atomics.store(new Int32Array(t.generation),x.sealPresent,0)}prepare(e,t,n){let r=this.preparePublication(e,t,n);t&&this.references.retain(t);let i=t;return{publish:()=>i!==void 0&&r(),[Symbol.dispose]:()=>{let e=i;i=void 0,e&&this.references.release(e)}}}preparePublication(e,t,n){if(!t||e.isTransaction||n===void 0)return()=>!1;let r=[...t.facts].filter(([e,n])=>isSealedKey(e)&&E(t,n));if(!r.some(([e])=>e===`sqlite-schema`))return()=>!1;let i=JSON.stringify(r.map(([e,t])=>[e,t.schemaDependent,t.value]),encodeSealValue),a=sealSchema(r.map(([e])=>e));return a?()=>{if(e.isOpen||w(t,`retired`)!==0||r.some(([,e])=>Atomics.load(new Int32Array(e.current),0)!==1||e.revision!==A(t,e.schemaDependent)))return!1;try{let e=L.fstatSync(t.descriptor,{bigint:!0});if(C(L.statSync(t.location,{bigint:!0}))!==t.identity)return!1;let r=writeSqliteCleanCloseSeal(t.location,a.schemaIdentity,e,{verifiedAt:n,facts:i,identity:a.identity});return Atomics.store(new Int32Array(t.generation),x.sealPresent,+!!r),r}catch{return!1}}:()=>!1}};function readOwnErrorDataProperty(e,t){try{return Object.getOwnPropertyDescriptor(e,t)?.value}catch{return}}function isStateDatabaseAdmissionClosedError(e){return t(e).some(e=>{let t=typeof e==`string`?{message:e}:i(e)?e:{},n=readOwnErrorDataProperty(t,`errorCode`)??readOwnErrorDataProperty(t,`code`),r=readOwnErrorDataProperty(t,`errorMessage`)??readOwnErrorDataProperty(t,`message`);return n===`STATE_DATABASE_READ_ADMISSION_INVALIDATED`||typeof r==`string`&&r.includes(`Shared-state worker is retiring`)})}const Bt={source:`opening the source database`,snapshot:`creating its private snapshot`},Vt=d(Symbol.for(`openclaw.sqliteInspectionOperations`),()=>/* @__PURE__ */ new WeakMap),Ht=d(Symbol.for(`openclaw.sqliteNativeOpenFailures`),()=>/* @__PURE__ */ new WeakSet),Ut=d(Symbol.for(`openclaw.sqliteSnapshotFailureScopes`),()=>new I);function recordSqliteSnapshotFailure(e){let t=Ut.getStore();t&&(t.failure??={error:e})}function markSqliteNativeOpenFailure(e){typeof e==`object`&&e&&Ht.add(e)}function withSqliteNativeOpen(e){try{return e()}catch(e){throw markSqliteNativeOpenFailure(e),e}}function isSqliteNativeOpenFailure(e){return typeof e==`object`&&!!e&&Ht.has(e)}function markSqliteInspectionOperation(e,t){return typeof e==`object`&&e&&!Vt.has(e)&&Vt.set(e,t),e}function withSqliteInspectionOperation(e,t){try{return t()}catch(t){throw markSqliteInspectionOperation(t,e)}}function formatSqliteReadOnlyInspectionFailure(t){let n=e(t),{suffix:r,operation:i}=readSqliteErrorDetails(t),a=`${n}${r}`;return i===void 0?a:`failed while ${Bt[i]}: ${a}`}function readSqliteInspectionOperation(e){return readSqliteErrorDetails(e).operation}function readSqliteErrorDetails(e){let t=/* @__PURE__ */ new Set,n;for(let r=e,a=0;a<8&&i(r);a+=1){n=Vt.get(r)??n;let e=o(r);e&&/^[A-Z0-9_]{1,64}$/u.test(e)&&t.add(`code=${e}`);let{errcode:i}=r;typeof i==`number`&&Number.isInteger(i)&&i>=0&&i<=2147483647&&t.add(`errcode=${i}`),r=r.cause}return{suffix:t.size>0?` (${[...t].join(`, `)})`:``,operation:n}}const Wt=/* @__PURE__ */ new Set([`SQLITE_BUSY`,`SQLITE_LOCKED`]);function sqliteErrorCode(e){let t=c(e)?.code;return typeof t==`string`?t:void 0}function sqliteExtendedResultCode(e){let t=c(e)?.errcode;return typeof t==`number`&&Number.isInteger(t)?t:void 0}function sqlitePrimaryResultCode(e){let t=sqliteExtendedResultCode(e);return t===void 0?void 0:t&255}function isSqliteLockError(e){let t=sqliteErrorCode(e);if(t!==void 0&&Wt.has(t))return!0;let n=sqlitePrimaryResultCode(e);return n===5||n===6}function isSqliteCorruptionError(e){let t=sqlitePrimaryResultCode(e);return t===11||t===26}const Gt=Se(`sqlite/publication`);function committedPublicationState(e){return{commit:e.installFacts,prepareObservers:e.installProjection,invalidate:e.invalidate}}function installCommittedState(e,t){let n=/* @__PURE__ */ new Map,install=(e,t)=>{try{t?.()}catch(t){n.set(e,t)}};for(let t of e)install(t,t.commit);let invalidate=()=>{let e=!0;for(let[t,r]of n)try{t.invalidate?t.invalidate(r):e=!1}catch{e=!1}return e};invalidate();for(let t of e)n.has(t)||install(t,t.prepareObservers);let r=invalidate();if(n.size>0)try{Gt.error(`Committed SQLite facts could not be installed`,{count:n.size,fenced:r})}catch{}if(r)for(let e of t)try{e()}catch{try{Gt.error(`SQLite post-commit notification failed`)}catch{}}}function publishSqliteCommittedState(e){let t=`installFacts`in e?[e]:e;installCommittedState(t.map(committedPublicationState),t.map(e=>e.notify))}function stageSqliteCommittedPublication(e,t){return stageSqliteTransactionState(e,committedPublicationState(t))?(deferSqlitePostCommitPublication(e,t.notify),!0):!1}const W=d(Symbol.for(`openclaw.sqlitePostCommitPublications`),()=>/* @__PURE__ */ new WeakMap),G=d(Symbol.for(`openclaw.sqliteTransactionState`),()=>/* @__PURE__ */ new WeakMap);function hasSqlitePostCommitScope(e){return W.has(sqlPublicationAnchor(e))}function deferSqlitePostCommitPublication(e,t){let n=W.get(sqlPublicationAnchor(e));return n?(n.push(t),!0):!1}function stageSqliteTransactionState(e,t){let n=G.get(sqlPublicationAnchor(e));return n?(t.stage?.(),n.push({prepareCommit:t.prepareCommit,commit:t.commit,prepareObservers:t.prepareObservers,invalidate:t.invalidate,rollback:t.rollback}),!0):!1}function prepareSqliteTransactionCommit(e){for(let t of G.get(sqlPublicationAnchor(e))??[])t.prepareCommit?.()}function rollbackTransactionState(e,t,n=`rolled-back`){let r=[];for(let i of e.toReversed())try{n===`unknown`&&i.invalidate?i.invalidate(t):i.rollback?.(t)}catch(e){r.push(e)}if(r.length>0)throw ae([t,...r],`SQLite transaction and rollback observers failed`,t)}function discardSqliteTransactionState(e,t,n=`unknown`){let r=sqlPublicationAnchor(e);W.get(r)?.splice(0);let i=G.get(r)?.splice(0)??[];W.delete(r),G.delete(r),rollbackTransactionState(i,t,n)}function withSqlitePostCommitPublications(e,t){let n=sqlPublicationAnchor(e),r=e.isTransaction||W.has(n),i=r?W.get(n):[],a=r?G.get(n):[],o=i?.length??0,s=a?.length??0;!r&&i&&a&&(W.set(n,i),G.set(n,a));let c;try{c=t()}catch(e){throw i?.splice(o),rollbackTransactionState(a?.splice(s)??[],e),e}finally{r||(W.delete(n),G.delete(n))}return r||installCommittedState(a??[],i??[]),c}function schemaStatement(e){if(/^(?:CREATE|ALTER|DROP|REINDEX|VACUUM)\b/iu.test(e))return!0;let t=/^(?:INSERT(?: OR \w+)? INTO|UPDATE(?: OR \w+)?|DELETE FROM|REPLACE INTO)\s+/iu.exec(e);if(t){let n=readSqlToken(e,t[0].length)?.raw??``,r=n.slice(findSqlCharacter(n,`.`)+1);return[`sqlite_schema`,`sqlite_master`].includes(normalizeSqlIdentifier(r))}if(!/^PRAGMA\b/iu.test(e))return!1;let n=[findSqlCharacter(e,`=`),findSqlCharacter(e,`(`)].filter(e=>e>=0);if(n.length===0)return!1;let r=e.slice(6,Math.min(...n)).trim(),i=r.slice(findSqlCharacter(r,`.`)+1).trim(),a=i.startsWith(`'`)&&i.endsWith(`'`)?i.slice(1,-1).toLowerCase():normalizeSqlIdentifier(i);return[`user_version`,`schema_version`].includes(a)}function changesSchema(e){if(!/\b(?:CREATE|ALTER|DROP|REINDEX|VACUUM|PRAGMA|INSERT|UPDATE|DELETE|REPLACE)\b/iu.test(e))return!1;let t=normalizeSqlWhitespace(e);for(;t;){t=t.replace(/^[\s;]+/u,``);let e=findSqlCharacter(t,`;`);if(schemaStatement(e<0?t:t.slice(0,e)))return!0;t=e<0?``:t.slice(e+1)}return!1}function createsOnlyTemporaryObject(e){let t=normalizeSqlWhitespace(e),n=/^\s*CREATE\s+(?:TEMP|TEMPORARY)\s+(TABLE|TRIGGER)\b/iu.exec(t)?.[1]?.toUpperCase();if(!n)return!1;let r=findSqlCharacter(t,`;`);if(n===`TABLE`)return r<0||t.slice(r+1).trim()===``;for(;r>=0;){t=t.slice(r+1).trim(),r=findSqlCharacter(t,`;`);let e=(r<0?t:t.slice(0,r)).trim();if(/^END$/iu.test(e))return r<0||t.slice(r+1).trim()===``}return!1}function changesOnlyTemporaryTable(e){let t=normalizeSqlWhitespace(e),n=findSqlCharacter(t,`;`);return n>=0&&t.slice(n+1).trim()!==``?!1:/^CREATE\s+(?:TEMP|TEMPORARY)\s+TABLE\b/iu.test(t)||/^DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:temp|"temp"|`temp`|\[temp\])\s*\./iu.test(t)}function changesData(e){return hasUnquotedSqlKeyword(e,/\b(?:INSERT|UPDATE|DELETE|REPLACE)\b/giu)}function temporaryWriteTables(e){let t=[],n=normalizeSqlWhitespace(e);for(;n;){n=n.replace(/^[\s;]+/u,``);let e=findSqlCharacter(n,`;`),r=e<0?n:n.slice(0,e);if(changesData(r)){let e=/^(?:INSERT(?: OR \w+)? INTO|REPLACE INTO|UPDATE(?: OR \w+)?|DELETE FROM)\s+(?:temp|"temp"|`temp`|\[temp\])\s*\.\s*("(?:[^"]|"")+"|`(?:[^`]|``)+`|\[[^\]]+\]|[a-z_]\w*)(?=\s|\(|$)/iu.exec(r)?.[1];if(e===void 0)return;t.push(normalizeSqlIdentifier(e))}n=e<0?``:n.slice(e+1)}return t}const Kt=/^(?:\s|;|--[^\n]*(?:\n|$)|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*/u,qt=/^(BEGIN|SAVEPOINT|COMMIT|END|RELEASE|ROLLBACK)\b/i;function readTransactionControl(e,t){let n,r=!1,i=!1,a=0,o=e;for(;o&&(o=o.replace(Kt,``),o);){a+=1;let e=o.includes(`;`)?findSqlCharacter(o,`;`):-1,s=e<0?o:o.slice(0,e),c=qt.exec(s)?.[1]?.toUpperCase();if(c===`ROLLBACK`?(n=c,i||=r,r=!/^ROLLBACK(?: TRANSACTION)? TO\b/iu.test(normalizeSqlWhitespace(s)),i||=!r):(c||!/^SELECT\b/iu.test(s)&&(changesSchema(s)||changesData(s)))&&(i=!0),n||=c,e<0||t===`statement`)break;o=o.slice(e+1)}return n?{kind:n,single:a===1,outerRollback:r&&!i}:void 0}function canPreserveTransactionSnapshot(e,t){return!(!t||!e?.single||e.kind!==`SAVEPOINT`&&e.kind!==`RELEASE`&&e.kind!==`ROLLBACK`)}function classifySqliteMutation(e,t){let n=changesSchema(e),r=changesData(e),i=n&&changesOnlyTemporaryTable(e);return{schemaChange:n,mainSchemaChange:n&&!i&&!createsOnlyTemporaryObject(e),temporaryTableSchemaChange:i,dataChange:r,temporaryWriteTables:r?temporaryWriteTables(e):void 0,control:readTransactionControl(e,t)}}const K=d(Symbol.for(`openclaw.sqliteNativeExecution`),()=>/* @__PURE__ */ new WeakMap),Jt=d(Symbol.for(`openclaw.sqlitePreparedNativeMutation`),()=>/* @__PURE__ */ new WeakMap);function isPreparingSqliteNativeMutation(e){return Jt.get(e)?.phase===`preparing`}const Yt=new FinalizationRegistry(e=>{for(let t of e)t.finish(!1,!0)});function createIteratorLifetime(e,t){let n={finished:!1,invalidated:!1,pause:()=>n.stopObservation(),invalidate:()=>{n.invalidated=!0,n.finish()},stopObservation:(e=!1,r=!1)=>{let i=n.observed;n.observed=void 0,t.delete(n),i?.finish(e,r)},finish:(t=!1,r=!1)=>{n.finished||(n.finished=!0,e.delete(n),n.stopObservation(t,r))}};return e.add(n),n}const Xt={schemaChange:!1,mainSchemaChange:!1,temporaryTableSchemaChange:!1,dataChange:!1,temporaryWriteTables:void 0,control:void 0};function observeSqliteNativeClose(e,t){for(let n of[`close`,Symbol.dispose]){if(typeof e[n]!=`function`)continue;let r=e[n].bind(e);e[n]=()=>{try{r()}finally{e.isOpen||t()}}}}function callStatement(e,t){return Reflect.apply(e,void 0,t)}function observeSqliteNativeOperations(e,t,n){let begin=(t,r)=>{let i=Jt.get(e);if(i){if(i.phase!==`armed`||r!==`execute`||!t.dataChange||t.schemaChange||t.control)throw Error(`Prepared SQLite mutations must execute exactly one data statement`);i.phase=`observing`}let a=n(t,r);return K.set(e,(K.get(e)??0)+1),{...a,finish(t,n,r){try{a.finish(t,n,r)}finally{let t=(K.get(e)??1)-1;t===0?K.delete(e):K.set(e,t)}}}},r=/* @__PURE__ */ new Set,execute=(t,n,r=`execute`)=>{let i=Jt.get(e),a=begin(n,r),o=!1,s=!1,c=!1;try{i&&(i.phase=`preparing`,i.prepare(),i.phase=`executing`);let e=t();return s=!0,r!==`bind`&&a.stepped?.(),o=!0,e}catch(t){if(c=!(!i||i.phase!==`preparing`&&(s||!isSqliteLockError(t)&&sqlitePrimaryResultCode(t)!==19)),i&&!c){let n=me(`Prepared SQLite mutation outcome is unknown`,`outcome-unknown`,t);throw discardSqliteTransactionState(e,n),n}throw t}finally{i&&(i.phase=`finished`),a.finish(o,!1,c)}};return e.exec=n=>execute(()=>t.DatabaseSync.prototype.exec.call(e,n),classifySqliteMutation(n,`batch`),`exec`),e.prepare=(...n)=>{let i=t.DatabaseSync.prototype.prepare.call(e,...n),a,resolveMutation=()=>a??=classifySqliteMutation(i.sourceSQL,`statement`),o=Object.hasOwn(i,`run`)?i.run.bind(i):void 0,s=Object.hasOwn(i,`get`)?i.get.bind(i):void 0,c=Object.hasOwn(i,`all`)?i.all.bind(i):void 0,l=Object.hasOwn(i,`iterate`)?i.iterate.bind(i):void 0,u=/* @__PURE__ */ new Set,d=!1,reset=(e,t=`reuse`)=>{if(u.size===0)return e();let n=[...u],r=e();for(let e of n)t===`return`?e.pause():e.invalidate();return r},wrap=e=>(...t)=>execute(()=>reset(()=>callStatement(e(),t)),resolveMutation());i.run=wrap(()=>o??t.StatementSync.prototype.run.bind(i)),i.get=wrap(()=>s??t.StatementSync.prototype.get.bind(i)),i.all=wrap(()=>c??t.StatementSync.prototype.all.bind(i)),i.iterate=(...n)=>{d||=(Yt.register(i,u),!0);let a=execute(()=>reset(()=>callStatement(l??t.StatementSync.prototype.iterate.bind(i),n)),Xt,`bind`),o=new WeakRef(a),s=createIteratorLifetime(u,r),c=a.next,f=a.return,p;return a.next=function(...t){if(p&&this===o.deref()&&e.isOpen)return{...p};if(this!==o.deref()||s.invalidated||!e.isOpen)return c.apply(this,t);s.finished&&(s.finished=!1,u.add(s)),s.observed??=begin(resolveMutation(),`iterate`),r.add(s);let n=c.apply(this,t);return n.done?(f?.call(this),p={...n},s.finish(!0)):s.observed?.stepped?.(),n},f&&(a.return=function(...t){if(p&&this===o.deref()&&e.isOpen)return{...p};if(this!==o.deref()||!e.isOpen)return f.apply(this,t);let n=execute(()=>s.finished||s.invalidated?f.apply(this,t):reset(()=>f.apply(this,t),`return`),Xt,`bind`);return n.done&&(p={...n}),s.finish(),n}),a};for(let e of[`close`,Symbol.dispose]){let t=i[e]?.bind(i);t&&(i[e]=()=>reset(t,`finalize`))}return i},observeSqliteNativeClose(e,()=>{for(let e of r)e.invalidate()}),execute}const q=d(Symbol.for(`openclaw.sqliteDatabaseWriteScopes`),()=>({writeScopes:/* @__PURE__ */ new WeakMap,pendingWriteScopes:/* @__PURE__ */ new WeakMap,localScopeRevisions:/* @__PURE__ */ new WeakMap,localUnscopedRevisions:/* @__PURE__ */ new WeakMap}));function createSqliteDatabaseWriteReceipts(e){function onSqliteDatabaseWriteSettled(t,n){let r=sqlPublicationAnchor(t),i=e.admission(r);if(!i)return;let a=e.writeListeners.get(i);return a||(a=/* @__PURE__ */ new Set,e.writeListeners.set(i,a)),registerListener(a,n)}function settleWorker(t,n){let r=n>0?t.references.get(n):void 0;if(r&&Atomics.exchange(new Int32Array(r),1,0)>0){S(t,`writeRevision`),S(t,`unscopedWriteRevision`);let n=e.writeListeners.get(t);n&&notifyListeners(n,void 0)}}function withSqliteDatabaseWriteScope(t,n,r){let i=sqlPublicationAnchor(t),a=e.admission(i);if(!(a?w(a,`writeScopeRevision`)>0:q.localScopeRevisions.has(i))){let e=r();if(oe(e))throw Error(`SQLite write scopes cannot await work`);return e}let o=normalizedWriteScopes(n),s=q.writeScopes.get(i);q.writeScopes.set(i,o);try{let e=r();if(oe(e))throw Error(`SQLite write scopes cannot await work`);return e}finally{s?q.writeScopes.set(i,s):q.writeScopes.delete(i)}}function withoutSqliteDatabaseWriteScope(e,t){let n=sqlPublicationAnchor(e),r=q.writeScopes.get(n);q.writeScopes.delete(n);try{return t()}finally{r&&q.writeScopes.set(n,r)}}function ensureWriteScopes(t,n,r){let i=!1;for(let e of n){let n=t.writeScopes.get(e);(!n||Atomics.load(n.state,1)!==0||r&&!pinWriteScope(n))&&(n=createScopeRevision(),r&&Atomics.store(n.state,2,1),F===0&&S(t,`writeScopeRevision`),i=!0),r&&r.push(n),ce(t,e,n)}i&&(S(t,`publicationRevision`),e.publish(t,n))}function pinWriteScope(e){let t=Atomics.load(e.state,2);for(;t>=0;){let n=Atomics.compareExchange(e.state,2,t,t+1);if(n===t)return!0;t=n}return!1}let t,n=0;function createScopeRevision(){t&&n!==t.byteLength||(t=new SharedArrayBuffer(48*Int32Array.BYTES_PER_ELEMENT),n=0);let e=new Int32Array(t,n,3);return n+=e.byteLength,{identity:Ue(),state:e}}function retainSqliteDatabaseWriteScopesForPath(t,n){let r=e.pathAdmission(t);if(!r||j(r))return;let i=[],a=!1,release=()=>{if(!a){a=!0;try{for(let e of i)Atomics.sub(e.state,2,1);i.length>0&&!j(r)&&ue(r)&&(S(r,`publicationRevision`),e.publish(r,[]))}finally{e.release(r)}}};try{return e.retain(r),ensureWriteScopes(r,normalizedWriteScopes(n),i),release}catch(e){throw release(),e}}function retireSqliteDatabaseWriteScopes(t,n){let r=sqlPublicationAnchor(t),i=normalizedWriteScopes(n),a=e.admission(r),retire=()=>{let t=a?.writeScopes??q.localScopeRevisions.get(r),o=n.flatMap(e=>typeof e!=`string`&&e.partition===void 0?[normalizedWriteScopes([e])[0].slice(0,-1)+`,`]:[]);for(let e of t?.keys()??[])o.some(t=>e.startsWith(t))&&i.push(e);if(!a){let e=q.localScopeRevisions.get(r);for(let t of i)e?.delete(t);return}if(j(a))return;let s=!1;for(let e of i){let t=a.writeScopes.get(e);t&&Atomics.exchange(t.state,1,1)===0&&(s=!0)}s&&(S(a,`writeScopeRevision`),S(a,`publicationRevision`),e.publish(a,i))};!stageSqliteTransactionState(r,{commit:retire})&&!t.isTransaction&&retire()}function prepareSqliteDatabaseScopedWriteRevisionForPath(t,n){let r=retainSqliteDatabaseWriteScopesForPath(t,n);if(!r)return;let i=e.pathAdmission(t);if(!i){r();return}let a=normalizedWriteScopes(n).map(e=>i.writeScopes.get(e)),o=a.map(e=>Atomics.load(e.state,0)),s=/* @__PURE__ */ new WeakMap,c=new Int32Array(i.generation),l=!1,inspectReference=e=>{let t=s.get(e);t||(t=new Int32Array(e),s.set(e,t)),l||=Atomics.load(t,1)>0},u=Atomics.load(c,x.schemaRevision),d=Atomics.load(c,x.unscopedWriteRevision),f=0,p=!1;return{read(){if(p||Atomics.load(c,x.retired)!==0||(l=!1,i.references.forEach(inspectReference),l))return;let e=Atomics.load(c,x.schemaRevision),t=Atomics.load(c,x.unscopedWriteRevision),n=u!==e||d!==t;u=e,d=t;for(let e=0;e<a.length;e++){let t=a[e];if(Atomics.load(t.state,1)!==0)return;let r=Atomics.load(t.state,0);n||=o[e]!==r,o[e]=r}return n&&f++,f},release(){p||(p=!0,r())}}}function scopedWriteToken(e,t,n,r=0){let i=w(e,`schemaRevision`)+r|0,a=[];for(let r of t){let o=e.writeScopes.get(r);if(!o||Atomics.load(o.state,1)!==0)return JSON.stringify([e.identity,e.generationId,i,`database`,w(e,`writeRevision`)+(n===void 0?0:1)|0,t]);a.push([r,o.identity,Atomics.load(o.state,0)+ +!!n?.has(r)|0])}return JSON.stringify([e.identity,e.generationId,i,w(e,`unscopedWriteRevision`)+ +(n===null)|0,a])}function localScopedWriteToken(e,t,n){return JSON.stringify([`memory`,(q.localUnscopedRevisions.get(e)??0)+ +(n===null),t.map(t=>[t,q.localScopeRevisions.get(e).get(t).identity,Atomics.load(q.localScopeRevisions.get(e).get(t).state,0)+ +!!n?.has(t)|0])])}function normalizedWriteScopes(e){return[...new Set((typeof e==`string`?[e]:e).map(e=>JSON.stringify(typeof e==`string`?[`key`,rt(e)]:[`session-id`,rt(e.sessionId),...e.partition===void 0?[]:[rt(e.partition)]])))].toSorted()}function ensureLocalWriteScopes(e,t){let n=q.localScopeRevisions.get(e)??/* @__PURE__ */ new Map;for(let e of t)n.has(e)||n.set(e,createScopeRevision());q.localScopeRevisions.set(e,n)}function readScopedWriteToken(t,n,r,i=0){let a=normalizedWriteScopes(n),o=e.admission(t);if(o?ensureWriteScopes(o,a):ensureLocalWriteScopes(t,a),e.readRevision(t)!==void 0)return o?scopedWriteToken(o,a,r,i):localScopedWriteToken(t,a,r)}function readSqliteDatabaseScopedWriteToken(e,t){return readScopedWriteToken(sqlPublicationAnchor(e),t)}function readSqliteDatabaseScopedWriteTokenForPath(t,n,r){let i=normalizedWriteScopes(n),a=e.pathAdmission(t,r);if(a&&!j(a))return ensureWriteScopes(a,i),scopedWriteToken(a,i)}function readSqliteDatabaseScopedWriteTokensForPath(t,n){let r=e.pathAdmission(t);if(!r||j(r))return;let i=n.map(normalizedWriteScopes);return ensureWriteScopes(r,i.flat()),i.map(e=>scopedWriteToken(r,e))}function readSqliteDatabasePendingScopedWriteToken(t,n){let r=sqlPublicationAnchor(t);return readScopedWriteToken(r,n,q.pendingWriteScopes.get(r),+!!e.hasPendingSchemaMutation(r))}function readSqliteDatabaseWriteTokenForPath(t){let n=e.pathAdmission(t);if(n&&!j(n))return`${n.identity}:${n.generationId}:${w(n,`writeRevision`)}`}function readSqliteDatabasePendingWriteToken(t){let n=sqlPublicationAnchor(t);if(!t.isOpen||!t.isTransaction&&!isPreparingSqliteNativeMutation(n)||!hasSqlitePostCommitScope(n)||e.suspended(n))return;let r=e.writer(n);if(r&&!j(r))return`${r.identity}:${r.generationId}:${w(r,`writeRevision`)+1|0}`}return{cancel(e){q.pendingWriteScopes.delete(e)},begin(e,t){let n=t?void 0:q.writeScopes.get(e),r=q.pendingWriteScopes.get(e);if(!n||r===null)q.pendingWriteScopes.set(e,null);else{let t=r??/* @__PURE__ */ new Set;for(let e of n)t.add(e);q.pendingWriteScopes.set(e,t)}},finish(e,t){let n=q.pendingWriteScopes.get(e);q.pendingWriteScopes.delete(e);let r=!n;if(n){let i=q.localScopeRevisions.get(e);for(let e of n){let n=i?.get(e);n&&Atomics.add(n.state,0,1);let a=t?.writeScopes.get(e);a&&Atomics.load(a.state,1)===0?Atomics.add(a.state,0,1):t&&(a||t.writeScopeRevision!==w(t,`writeScopeRevision`))&&(r=!0)}}r&&(q.localUnscopedRevisions.set(e,(q.localUnscopedRevisions.get(e)??0)+1),t&&S(t,`unscopedWriteRevision`))},settleWorker,onSqliteDatabaseWriteSettled,retireSqliteDatabaseWriteScopes,retainSqliteDatabaseWriteScopesForPath,prepareSqliteDatabaseScopedWriteRevisionForPath,withSqliteDatabaseWriteScope,withoutSqliteDatabaseWriteScope,readSqliteDatabaseScopedWriteToken,readSqliteDatabaseScopedWriteTokenForPath,readSqliteDatabaseScopedWriteTokensForPath,readSqliteDatabasePendingScopedWriteToken,readSqliteDatabaseWriteTokenForPath,readSqliteDatabasePendingWriteToken}}const Zt=d(Symbol.for(`openclaw.postgresReadSnapshots`),()=>/* @__PURE__ */ new WeakMap),Qt=d(Symbol.for(`openclaw.sqliteSchemaFacts`),()=>/* @__PURE__ */ new WeakMap);function observeSqliteTransactionState(e,t){let n=e.isTransaction;t.transactionOpen!==n&&(t.transactionOpen&&(t.mutationRevision+=1),t.transactionOpen=n,t.transactionMutationRevision=void 0,t.transactionSnapshot=void 0,t.transactionRead=!1,t.transactionCatalogBound=!1)}function finishSqliteReadScope(e,t,n,r,i,a){let o=e.isTransaction;!i&&n&&!o&&(t.mutationRevision+=1),t.transactionOpen=o,n&&o||(t.transactionMutationRevision=o?a:void 0),(n!==o||r)&&(t.transactionSnapshot=void 0,t.transactionRead=!1,t.transactionCatalogBound=!1)}const $t=d(Symbol.for(`openclaw.sqliteDatabaseCleanCloseSeals`),()=>new SqliteDatabaseCleanCloseSeals(publishFact,{retain:e=>k.registry.changeReferences(e,1),release:releaseReference,publish:e=>k.registry.publish(e),descriptor:e=>k.registry.descriptors.get(e.identity)})),en=createSqliteDatabaseDescriptorOwner($t),{prepareOwnedSqliteDatabaseAdmission:tn,prepareSqliteDatabaseAdmissionAsync:nn,retainSqliteDatabaseAdmissionLocation:rn,retainPreparedSqliteDatabaseAdmissionLocation:an,prepareSqliteDatabaseAdmission:J}=en,{pathAdmission:Y}=en;function recordSqliteDatabaseIntegrity(e,t=Date.now()){publishSqliteDatabaseAdmission(e,U,t)}function prepareSqliteDatabaseCleanClose(e){return $t.prepare(e,admission(e),dn(e,U)??dn(e,Rt))}const{readSqliteDatabaseCleanClose:on,readSqliteDatabaseWriteRevision:sn,readSqliteDatabaseSiblingWriteRevision:cn,readSqliteDatabaseIntegrityVerification:ln,readSqliteDatabaseCleanCloseRefusal:un,getSqliteDatabaseAdmission:dn,getSqliteDatabaseSchemaRevision:fn,getOrLoadSqliteDatabaseAdmissionForPath:pn,peekSqliteDatabaseAdmissionForPath:mn,prepareSqliteDatabaseAdmissionForPath:hn,hasSqliteDatabaseSchemaAdmissionForPath:gn,getSqliteDatabaseAdmissionIdentityForPath:_n,getSqliteDatabaseAdmissionSourceForPath:vn,observeSqliteDatabaseAdmissionLocation:yn,hasSqliteDatabaseSchemaAdmissionForIdentity:bn,retainSqliteDatabaseAdmissionForPath:xn}=createSqliteDatabaseAdmissionReader({state:k,admission,pathAdmission:Y,prepareFileIdentity:J,integrityVerificationKey:U,exchange:b,publishFact,retain:retainReference,release:releaseReference}),X=createSqliteDatabaseWriteReceipts({admission,pathAdmission:(e,t)=>t?t.key.startsWith(`file:`)?k.registry.records.get(`${t.key.slice(5)}:${t.birthtime}`):void 0:Y(e),retain:retainReference,release:releaseReference,writeListeners:k.writeListeners,readRevision:sn,writer:e=>k.dataWriters.get(e),suspended:e=>k.suspended.has(e),hasPendingSchemaMutation:e=>e.isTransaction&&Qt.get(e)?.transactionalSchema===!0,publish(e,t){k.registry.publish(e,t),b(e)}}),{onSqliteDatabaseWriteSettled:Sn,retireSqliteDatabaseWriteScopes:Cn,retainSqliteDatabaseWriteScopesForPath:wn,prepareSqliteDatabaseScopedWriteRevisionForPath:Tn,withSqliteDatabaseWriteScope:En,withoutSqliteDatabaseWriteScope:Dn,readSqliteDatabaseScopedWriteToken:On,readSqliteDatabaseScopedWriteTokenForPath:kn,readSqliteDatabaseScopedWriteTokensForPath:An,readSqliteDatabasePendingScopedWriteToken:jn,readSqliteDatabaseWriteTokenForPath:Mn,readSqliteDatabasePendingWriteToken:Nn}=X;function settleSqliteDatabaseAdmissionPublication(e){if(e.isTransaction||getSqliteNativeAdmissionFacts(e)||hasSqlitePostCommitScope(e)||k.exchanging)return!1;let t=admission(e);return t&&b(t,void 0,!0),!0}function bindSqliteDatabaseAdmission(e,t){k.connections.delete(e),k.openedIdentities.delete(e),k.unproven.delete(e);let n=e.location();if(!n||n===`:memory:`)return;let r=J(n);if(t!==void 0&&r!==t)throw Error(`SQLite database changed identity during native open`);if(!r)return;if(k.openedIdentities.set(e,r),t===void 0){k.unproven.add(e);return}let i=k.registry.records.get(r);(i&&!j(i)||k.registry.descriptors.get(r)?.facts.size)&&admission(e)}function admission(e,t=!0){let n=k.openedIdentities.get(e);if(!e.isOpen||n===void 0||k.unproven.has(e))return;let r=k.connections.get(e);if(r)return j(r)?void 0:r;let i=e.location();if(!i||i===`:memory:`)return;let a=t&&!e.isTransaction?Y(i,n):k.registry.records.get(n);if(a&&a.identity!==n)throw Error(`SQLite database changed identity before admission`);return a&&!j(a)?retainConnection(e,a):void 0}function retainConnection(e,t){let n=t.identity,r=t;try{for(;;){if(r.identity!==n)throw Error(`SQLite database changed identity during native open`);let t=k.registry.changeReferences(r,1),i=!1;try{t&&b(r);let n=w(r,`retired`);if(n===0)return k.connections.set(e,r),i=!0,r;if(n!==2)throw Error(`SQLite database admission retired during native open`)}finally{i||k.registry.changeReferences(r,-1)}let a=e.location(),o=e.isTransaction?k.registry.records.get(n):a?Y(a,J(a)):void 0;if(!o||j(o))throw Error(`SQLite database admission unavailable during native open`);r=o}}catch(t){throw k.openedIdentities.delete(e),t}}function releaseSqliteDatabaseAdmission(e){let t=k.connections.get(e);k.openedIdentities.delete(e)&&t&&(k.local.delete(e),releaseReference(t))}function retainReference(e){k.registry.changeReferences(e,1)&&b(e)}function releaseReference(e){k.registry.changeReferences(e,-1)&&(k.localSchemaRevisions.delete(e.identity),b(e))}function publishFact(e,t,n,r){if(t.writer===`host`&&F!==0)throw Error(`SQLite host-owned admission facts require the host publisher`);de(e,t,n,r,`${F}:${++k.publication}`)&&(k.registry.publish(e),t.writer!==`connection`&&b(e))}function beginSqliteDatabaseWrite(e,t=!1){let n=admission(e);n&&Atomics.load(new Int32Array(n.generation),x.sealPresent)===1&&$t.invalidate(n.location,n),X.begin(e,t),!k.dataWriters.has(e)&&(k.dataWriters.set(e,n),n&&Atomics.add(new Int32Array(n.references.get(F)),1,1))}function finishSqliteDatabaseWrite(e,t=!1){if(!k.dataWriters.has(e))return;let n=k.dataWriters.get(e);if(k.dataWriters.delete(e),t)X.cancel(e),n&&Atomics.sub(new Int32Array(n.references.get(F)),1,1);else if(k.localWriteRevisions.set(e,(k.localWriteRevisions.get(e)??0)+1),X.finish(e,n),n){S(n,`writeRevision`),Atomics.sub(new Int32Array(n.references.get(F)),1,1);let e=k.writeListeners.get(n);e&&notifyListeners(e,void 0)}}function trackSqliteDatabaseAdmissionWorker(e){let t=e.threadId;e.once(`exit`,()=>{for(let e of k.registry.records.values())X.settleWorker(e,t);k.registry.releaseWorker(t)})}function hasPendingSqliteDatabaseSchemaMutation(e){let t=sqlPublicationAnchor(e);return e.isTransaction&&k.schemaDirty.has(t)}function publishSqliteDatabaseAdmission(e,t,n,r={}){let i=sqlPublicationAnchor(e),a=admission(i,!e.isTransaction);if(!a||j(a)||k.suspended.has(i))return;if(t.writer===`host`&&F!==0)throw Error(`SQLite host-owned admission facts require the host publisher`);let o=(t.schemaDependent?r.schemaRevision:void 0)??A(a,t.schemaDependent),s=isPostgresSqlConnection(e)?void 0:getSqliteNativeAdmissionFacts(e),c=re(t,n);if(!s&&!e.isTransaction&&!hasSqlitePostCommitScope(e)){publishFact(a,t,c,o);return}let l={...c,revision:o,schemaDependent:t.schemaDependent===!0,ddlRevision:k.ddlRevisions.get(i)??0};if(s){s.set(t.name,l);return}let u=k.local.get(i)??/* @__PURE__ */ new Map;k.local.set(i,u);let d=u.get(t.name);stageSqliteTransactionState(i,{stage:()=>u.set(t.name,l),rollback:()=>{k.local.get(i)===u&&(d===void 0?u.delete(t.name):u.set(t.name,d))},commit:()=>{k.local.get(i)===u&&u.get(t.name)===l&&(u.delete(t.name),l.revision!==A(a,l.schemaDependent)||l.schemaDependent&&l.ddlRevision!==(k.ddlRevisions.get(i)??0)||publishFact(a,t,l,l.revision))}})}function invalidateLocalSqliteSchemaAdmissions(e){let t=sqlPublicationAnchor(e),n=k.ddlRevisions.get(t)??0,r=k.schemaDirty.has(t),stage=()=>{k.ddlRevisions.set(t,n+1),k.schemaDirty.add(t)};stageSqliteTransactionState(t,{stage,commit:()=>{},rollback:()=>{k.ddlRevisions.set(t,n),r||k.schemaDirty.delete(t)}})||stage()}function discardSqliteDatabaseTransactionAdmissions(e){let t=sqlPublicationAnchor(e),n=admission(t,!1);for(let r of[isPostgresSqlConnection(e)?void 0:getSqliteNativeAdmissionFacts(e),k.local.get(t)]){for(let e of r?.keys()??[]){let t=n?.facts.get(e);t&&Atomics.store(new Int32Array(t.current),0,0)}r?.clear()}k.local.delete(t),k.rolledBack.add(t),e.isTransaction||k.schemaDirty.delete(t)}function publishSqliteDatabaseSchemaChange(e){let t=sqlPublicationAnchor(e),n=admission(t,!1);if(n){let e=S(n,`schemaRevision`),r=k.ddlRevisions.get(t)??0;for(let n of k.local.get(t)?.values()??[])n.schemaDependent&&n.revision===e&&n.ddlRevision===r&&(n.revision=e+1)}else{let e=k.openedIdentities.get(t);e&&k.localSchemaRevisions.set(e,(k.localSchemaRevisions.get(e)??0)+1)}e.isTransaction||k.schemaDirty.delete(t)}function revoke(e,t=e?.location){t&&$t.invalidate(t,e),fe(e)}function revokeSqliteDatabaseAdmissions(e){revoke(k.connections.get(e)??admission(e)),k.local.delete(e)}function revokeSqliteDatabaseAdmissionsForPath(e){revoke(Y(e),e)}function*captureSqliteDatabaseDescriptorCustodyLocations(){for(let{location:e}of k.registry.descriptors.values())yield e}function retireSqliteDatabaseAdmissionForPath(e,t={}){te(()=>{let n=J(e);if(!n)return;k.localSchemaRevisions.delete(n);let r=F===0?k.registry.records.get(n):Y(e);k.registry.retireDescriptor(n,t)&&r&&b(r)})}function suspendSqliteDatabaseAdmission(e,t){t?k.suspended.add(e):k.suspended.delete(e)}const Pn=new f(Symbol(`spawnBroker`)),Fn={startupDisabled:!1};function getSpawnBroker(){let e=Pn.getStore();return Fn.startupDisabled||e===null?void 0:e??Fn.host}const In=new TextDecoder,Ln=/* @__PURE__ */ new Map([[` `,` `],[`
`,`
`],[`\b`,`\\b`],[`\f`,`\\f`],[`\r`,`\\r`],[`	`,`\\t`]]);function renderOutput(e){let t=typeof e==`string`?e:In.decode(e);return t.endsWith(`
`)&&(t=t.slice(0,t.endsWith(`\r
`)?-2:-1)),nt(t).replace(/[\p{Separator}\p{Other}]/gu,e=>{let t=Ln.get(e);if(t!==void 0)return t;let n=e.codePointAt(0),r=n.toString(16);return n<=65535?`\\u${r.padStart(4,`0`)}`:`\\U${r}`})}function decodeExecaMessage(e,t){return e.messageOutputs?[e.message,...e.messageOutputs.map(e=>renderOutput(t[e]))].join(`

`):e.message}function restoreError(e,t){let n=Error(decodeExecaMessage(e,t),{cause:e.cause?restoreError(e.cause,t):void 0});return Object.assign(n,{name:e.name,code:e.code})}function restoreExecaResult(e){let{error:t,...n}=e,r={...n,stdout:n.stdout,stderr:n.stderr,shortMessage:n.shortMessage,code:n.code};if(t){let e=restoreError(t,r);return Object.assign(e,r,{cause:e.cause})}return{...r,cause:void 0}}const Z=d(Symbol.for(`openclaw.childRuntimeViability`),()=>({initialPath:process.execPath,initialIdentity:executableIdentity(process.execPath)})),Rn=/(?:dyld[^\n]*:\s*Library not loaded:|error while loading shared libraries:)/i,zn=/(?:dyld[^\n]*:\s*Symbol not found:|symbol lookup error:|Error loading shared library|version [`'"][^`'"\r\n]+[`'"] not found)/i;function executableIdentity(e){try{return formatExecutableIdentity(Xe(e))}catch{return}}function formatExecutableIdentity({dev:e,ino:t,size:n,mtimeMs:r,mode:i}){return`${e}:${t}:${n}:${r}:${i}`}function publishRuntimeViability(e,t){return(n(t,`ENOENT`)||n(t,`ENOTDIR`))&&recordUnavailableRuntime(e,t),{execPath:e,available:!(Z.execPath===e&&Z.failure)}}function readChildRuntimeViability(e){let t=e?.execPath??process.execPath;if(Z.execPath===t&&Z.failure)return{execPath:t,available:!1};try{We(t,Ge.X_OK)}catch(e){return publishRuntimeViability(t,e)}return publishRuntimeViability(t)}async function prepareChildRuntimeViability(e){let t=e?.execPath??process.execPath,n=!(Z.execPath===t&&Z.failure);if(n)try{let e=await probeChildRuntimeExecutable(t);n=!classifyRuntimeProbe(t,e,await R.stat(t).then(formatExecutableIdentity,()=>void 0),e.error)}catch(e){n=publishRuntimeViability(t,await R.stat(t).then(()=>e,e=>e)).available}return{publish:()=>({execPath:t,available:n&&publishRuntimeViability(t).available})}}function recoverUnavailableRuntime(){if(Z.execPath!==process.execPath||!Z.failure||!Z.recover||Z.recoveryStarted)return;Z.recoveryStarted=!0;let e=Z.recover;l(()=>Promise.resolve().then(e).catch(()=>({status:`report-only`,reason:`Automatic runtime recovery is report-only: service or restart preparation failed. Inspect the service runtime and restart through its owner.`})).then(e=>{Se(`gateway/runtime`).warn(`${e.status}: ${e.reason}`)}))}function runtimeProbeOptions(e={}){return{encoding:`utf8`,cwd:e.cwd??z.parse(process.execPath).root,env:e.env??{...process.env,NODE_OPTIONS:void 0},timeout:1e3,maxBuffer:8192}}async function probeChildRuntimeExecutable(e,t={}){let n=getSpawnBroker();if(n){let r=n.spawnExeca([e,`--version`],{...runtimeProbeOptions(t),extendEnv:!1,stripFinalNewline:!1,stdin:`ignore`});r.child.once(`spawn`,()=>{r.child.stdout?.resume(),r.child.stderr?.resume()});let i=restoreExecaResult(await r.result);return await r.child.waitForClose(),{stdout:typeof i.stdout==`string`?i.stdout:``,stderr:typeof i.stderr==`string`?i.stderr:``,error:i instanceof Error?i:void 0,status:i.exitCode??null,signal:i.signal??null}}return new Promise(n=>{ot(e,[`--version`],runtimeProbeOptions(t),(e,t,r)=>n({stdout:t,stderr:r,error:e??void 0,status:e?typeof e.code==`number`?e.code:null:0,signal:e?.signal??null}))})}function formatMissingChildRuntimeWarning(e){return e.available?void 0:`The Node.js runtime this Gateway started with (${_e(e.execPath)}) can no longer start worker processes, likely because it was upgraded or removed. Restart the Gateway.`}function assertChildRuntimeAvailable(){if(Z.execPath===process.execPath&&Z.failure)throw Z.failure}function recordUnavailableRuntime(e,t,n){if(Z.execPath===e&&Z.failure)return Z.failure;Z.execPath=e;let r=formatMissingChildRuntimeWarning({execPath:e,available:!1}),i=n?.trim();return Z.failure=Object.assign(Error(i?`${r}\n${i}`:r,{cause:t}),{code:`NODE_RUNTIME_UNAVAILABLE`}),Se(`gateway/runtime`).error(Z.failure.message),recoverUnavailableRuntime(),Z.failure}function needsRuntimeProbe(e){return!!(e.error||e.signal===`SIGABRT`||zn.test(e.stderr??``))}function classifyRuntimeProbe(e,t,r,i){if(Z.execPath===e&&Z.failure)return Z.failure;let a=e!==Z.initialPath||r!==Z.initialIdentity;return Rn.test(t.stderr)||zn.test(t.stderr)||n(t.error,`ENOENT`)||n(t.error,`ENOTDIR`)||a&&(t.signal===`SIGABRT`||n(t.error,`ENOEXEC`)||n(t.error,`EACCES`)||n(t.error,`EPERM`))?recordUnavailableRuntime(e,i,t.stderr):void 0}function classifyChildRuntimeFailure(e){if(e.started)return;let t=e.execPath??process.execPath;if(Z.execPath===t&&Z.failure)return Z.failure;if(Rn.test(e.stderr??``)||e.error&&!readChildRuntimeViability({execPath:t}).available)return recordUnavailableRuntime(t,e.error,e.stderr);if(needsRuntimeProbe(e))return classifyRuntimeProbe(t,V(t,[`--version`],runtimeProbeOptions()),t===Z.initialPath?executableIdentity(t):void 0,e.error)}async function prepareChildRuntimeFailure(e){if(e.started)return;let t=e.execPath??process.execPath;if(Z.execPath===t&&Z.failure)return Z.failure;if(Rn.test(e.stderr??``)||e.error&&!(await prepareChildRuntimeViability({execPath:t})).publish().available)return recordUnavailableRuntime(t,e.error,e.stderr);if(!e.error&&needsRuntimeProbe(e))return classifyRuntimeProbe(t,await probeChildRuntimeExecutable(t),t===Z.initialPath?await R.stat(t).then(formatExecutableIdentity,()=>void 0):void 0,e.error)}function observeChildRuntime(e,t=process.execPath){let n=!1,r,i=``;return e.once(`message`,()=>{n=!0,i=``}),e.on(`error`,e=>{r??=e}),e.stderr?.on(`data`,e=>{n||(i=(i+e.toString()).slice(-8192))}),async()=>e.exitCode===0&&!r?void 0:prepareChildRuntimeFailure({execPath:t,error:r,stderr:i,signal:e.signalCode,started:n})}const Bn=Symbol.for(`openclaw.nodeCompileCacheBase`);function resolveNodeCompileCacheEnv(e=process.env){if(e.NODE_DISABLE_COMPILE_CACHE!==void 0)return e;let t=e.NODE_COMPILE_CACHE??d(Bn,()=>({})).baseDirectory;if(t&&!Me(t)){let t={...e,NODE_DISABLE_COMPILE_CACHE:`1`};return delete t.NODE_COMPILE_CACHE,t}return e.NODE_COMPILE_CACHE===void 0&&t?{...e,NODE_COMPILE_CACHE:t}:e}const Vn=d(Symbol.for(`openclaw.runtimeWorkerGeneration`),()=>new I);function resolveRuntimeWorkerGenerationUrl(e,t){return Oe(e.href)?e:t?.resolve(e)??e}function captureRuntimeWorkerSource(e){let t=Vn.getStore()?.generation,n=resolveRuntimeWorkerGenerationUrl(e,t);return n.href===e.href?{moduleUrl:e}:{moduleUrl:n,runtimeGeneration:t}}const Hn=268435456;function createWorkerComputeCapacity(e){if(!Number.isSafeInteger(e)||e<1)throw RangeError(`compute capacity must be a positive safe integer`);let t=/* @__PURE__ */ new Set,n=/* @__PURE__ */ new Set,r=/* @__PURE__ */ new Set,i=0,a=0,o=!1,canAdmit=e=>i<128&&a+e<=268435456,requestCheckpoints=()=>{let e=n.size;if(e){for(let n of t)if(n.requestCheckpoint()&&--e===0)break}},drain=()=>{if(!o){o=!0;try{for(;t.size<e&&n.size;){let e=n.values().next().value;n.delete(e),e()}}finally{o=!1}requestCheckpoints()}};return{getSnapshot:()=>({limit:e,active:t.size,waitingPools:n.size,pendingTasks:i,pendingBytes:a}),canAdmit,subscribeAdmission(e){return r.add(e),()=>r.delete(e)},admit(e){return canAdmit(e)?(i++,a+=e,!0):!1},finish(e){i--,a-=e;for(let e of r)e()},acquire(r,i){if(t.size>=e||!o&&n.size){n.add(r),requestCheckpoints();return}let a={requestCheckpoint:i};return t.add(a),a},release(e){t.delete(e),drain()},remove(e){n.delete(e)},requestCheckpoints}}var WorkerTaskError=class extends Error{constructor(e,t,n){super(e,n),this.code=t,this.name=`WorkerTaskError`,this.capacityAvailable=n?.capacityAvailable}};function workerTaskUnavailableError(e,t,n,r=e.task){let i=e.ready===!1?`startup`:r?.exchange?`exchange`:`running`;return new WorkerTaskError(t+(r?.diagnosticLabel?` [task=${r.diagnosticLabel} admittedInputBytes=${r.inputBytes} exchanges=${r.exchangeSequence} stage=${i}]`:``),`unavailable`,{cause:n})}function workerTaskRetirementError(e,t){return e?AggregateError([e,t],`Worker retirement failed: ${r(t,`worker retirement failed`).message}; task failed: ${e.message}`,{cause:t}):t}function workerTaskTimeoutError(e,t){let n=e?.sent===!1?e.name:void 0;n===`unknown`&&(n=t.protocol===`file:`?t.pathname.split(`/`).at(-1)?.slice(0,96)||`worker`:`${t.protocol} worker`);let r=new WorkerTaskError(n?`worker task timed out waiting for host callback ${n}`:`worker task timed out`,`timeout`);return n&&process.emitWarning(r.message,{code:`WORKER_HOST_CALLBACK_TIMEOUT`}),r}function enqueueWorkerTask(e,t){let n=t.options.pointRead?e.findIndex(e=>!e.options.pointRead):-1;e.splice(n===-1?e.length:n,0,t)}var WorkerTaskAdmission=class{constructor(e,t,n){this.maxPendingTasks=e,this.maxPendingBytes=t,this.shared=n,this.taskCount=0,this.byteCount=0,this.closed=!1,this.waiters=/* @__PURE__ */ new Map,this.notify=()=>{for(let[e,t]of this.waiters)(this.closed||this.taskCount<this.maxPendingTasks&&this.byteCount+e<=this.maxPendingBytes&&(!this.shared||this.shared.canAdmit(e)))&&(this.waiters.delete(e),t.resolve());this.waiters.size||(this.stopWatchingCapacity?.(),this.stopWatchingCapacity=void 0)};for(let[n,r]of Object.entries({maxPendingTasks:e,maxPendingBytes:t}))if(!Number.isSafeInteger(r)||r<1)throw RangeError(`${n} must be a positive safe integer`)}get pendingTasks(){return this.taskCount}get pendingBytes(){return this.byteCount}admitTask(e,t){let{pointRead:n,onRequest:r,onRequestSync:i}=e.options;if(n)return r||i?/* @__PURE__ */ TypeError(`Point reads carry their facts and cannot call back into the host`):void 0;let a=this.admit(e.inputBytes,t);return e.admitted=a===void 0,a}admit(e,t){let n;if(this.taskCount>=this.maxPendingTasks)n=`pool pending tasks: pendingTasks=${this.taskCount} maxPendingTasks=${this.maxPendingTasks} inputBytes=${e}`;else if(this.byteCount+e>this.maxPendingBytes)n=`pool pending bytes: pendingBytes=${this.byteCount} maxPendingBytes=${this.maxPendingBytes} inputBytes=${e}`;else if(this.shared&&!this.shared.admit(e)){let{pendingTasks:t,pendingBytes:r}=this.shared.getSnapshot();n=t>=128?`shared compute pending tasks: pendingTasks=${t} maxPendingTasks=128 inputBytes=${e}`:`shared compute pending bytes: pendingBytes=${r} maxPendingBytes=${Hn} inputBytes=${e}`}else{this.taskCount++,this.byteCount+=e;return}let r=t();return new WorkerTaskError(`worker task capacity reached [${r?`task=${r} `:``}${n}]`,`overloaded`,{capacityAvailable:this.waitForCapacity(e)})}finish(e){this.taskCount--,this.byteCount-=e,this.shared?.finish(e),this.notify()}close(){this.closed=!0,this.notify()}waitForCapacity(e){if(e>this.maxPendingBytes||this.shared&&e>268435456)return;let t=this.waiters.get(e);if(t)return t.promise;let n=Promise.withResolvers();return this.waiters.set(e,n),this.stopWatchingCapacity??=this.shared?.subscribeAdmission(this.notify),this.notify(),n.promise}};function captureWorkerTaskContext(){let e=new Be(`OpenClaw.WorkerTask`);return t=>e.runInAsyncScope(t)}function serviceNativeWorkerPass(e,t){let n=[];for(let e of t)e.native&&n.push(e.native);e.serviceNativeWorkers(n)}function createWorkerTaskPoolBootstrap(e,t,n){let r,admissionError=()=>r&&![...e].some(e=>e.ready===!0&&!e.retiring&&!e.retirementFailed)?r:void 0,rejectQueued=()=>{let e=admissionError();if(!e)return;let r=t.splice(0);for(let t of r)n(t,e)};return{error:()=>r,get admissionError(){return admissionError()},fail(e){r??=e,rejectQueued()},rejectQueued,reset:()=>{r=void 0}}}function createWorkerHostExchange(e,t){let n=i(t)?t.kind??t.type:t;return e.exchange={id:++e.exchangeSequence,name:typeof n==`string`&&/^[a-zA-Z][a-zA-Z0-9._:-]{0,95}$/.test(n)?n:`unknown`,pressure:new AbortController,sent:!1,onConsumed:void 0}}function dispatchOwnedWorkerRequest(e,t,n,r,i){let a={signal:(e.controller??=new AbortController).signal,yieldSignal:r.pressure.signal},assertCurrent=()=>{if(e.done||t.task!==e)throw new WorkerTaskError(`worker task closed before host dispatch`,`unavailable`)};if(e.options.onRequestSync)try{assertCurrent(),i.accept(e.options.onRequestSync(n,a))}catch(e){i.reject(e)}else Promise.resolve().then(()=>(assertCurrent(),e.options.onRequest(n,a))).then(i.accept).catch(i.reject)}async function joinOwnedWorkerTasks(e){let t=(await Promise.allSettled(e)).flatMap(e=>e.status===`rejected`?[e.reason]:[]);if(t.length===1)throw t[0];if(t.length>1)throw AggregateError(t,`Worker task cleanup failed`)}function joinOwnedWorkerTask(e,t,n=!1){return startJoinOwnedWorkerTask(e,t,n).result}function startJoinOwnedWorkerTask(e,t,n){let r=startCloseOwnedWorkerTask(e,t,n),observe=()=>{let n=r.read();if(n.status===`pending`)return n;if(n.status===`rejected`&&e.owner?.closing===r&&(e.owner.closing=void 0),e.owner?.closed){let n=e.slot;e.slot=void 0,t.release(e,n)}return n},i=r.result.then(()=>{observe()},e=>{throw observe(),e});return i.catch(()=>void 0),{result:i,read:observe,service(){r.service(),observe()}}}function closeOwnedWorkerTask(e,t,n=!1){return startCloseOwnedWorkerTask(e,t,n).result}function startCloseOwnedWorkerTask(e,t,n){let r=e.owner;if(!r||r.closed){if(r?.closing)return r.closing;let e=D(()=>{});return e.resolve(),e.operation}if(r.retire||=n,r.closing)return r.closing;let i,a,o=!1,s=D(()=>{i?.service(),advance()}),advance=()=>{if(!(o||s.operation.read().status!==`pending`)){o=!0;try{if(e.preparation){a!==e.preparation.promise&&(a=e.preparation.promise,a.then(advance,s.reject));return}let n=e.slot;if(n&&r.retire){i||(i=t.retire(n),i.result.then(advance,advance));let e=i.read();if(e.status===`pending`)return;if(e.status===`rejected`)throw e.error}t.detach(e);try{r.complete?.()}finally{r.closed=!0,r.complete=void 0,r.onCloseError=void 0,e.input=void 0,e.options={},e.abort=()=>{}}s.resolve()}catch(e){r.onCloseError?.(e),s.reject(e)}finally{o=!1}}};return r.closing=s.operation,e.done||t.cancel(e),advance(),s.operation}function retainWorkerTask(e,t,n){return{result:e.promise,read:()=>e.read(),service:n,release:r=>{let i=startJoinOwnedWorkerTask(e,t,r?.retire===!0);return{result:i.result,read:()=>i.read(),service:()=>{n(),i.service()}}}}}function prepareWorkerTaskInput(e,t,n,r){let i=e.input;e.input=void 0;let a=Promise.withResolvers();e.preparation=a;let finishPreparation=()=>{a.resolve(),e.preparation===a&&(e.preparation=void 0)},failed=e=>{finishPreparation(),n(e)},o;try{o=typeof i==`function`?i():i}catch(e){failed(e);return}r&&(o=Promise.resolve(o).then(async e=>(await r(),e)));let ready=e=>{finishPreparation(),t(e)};oe(o)?Promise.resolve(o).then(ready,failed):ready(o)}function armWorkerTaskTimeout(e,t,n,r){if(t===void 0||r&&(e.options.timeoutFrom??`enqueue`)!==r)return;clearTimeout(e.timer);let i=performance.now();e.deadline=Math.min(e.options.hostTimeout!==`owner`&&e.options.timeoutMs!==void 0?e.deadline??(e.options.timeoutFrom===`dispatch`?i:e.enqueuedAt)+u(e.options.timeoutMs,6e4):1/0,i+u(t,6e4)),e.timer=setTimeout(n,Math.max(0,e.deadline-i),e)}function expireWorkerTasks(e,t,n){let r=performance.now(),i=[...e,...[...t].flatMap(e=>e.task?[e.task]:[])];for(let e of i)!e.done&&e.deadline!==void 0&&r>=e.deadline&&n(e)}const Un=it(`openclaw.worker.task`);function joinWorkerTaskPreparationCleanups(e,t){return joinOwnedWorkerTasks([...[...e.preparationCleanups].map(([t,n])=>n.finally(()=>{e.preparationCleanups.delete(t)&&e.releaseAdmission(t)})),t.then(()=>void 0)])}function notifyExecutionSettled(e){try{e.executionNotified||(e.executionNotified=!0,e.options.onExecutionSettled?.({retired:e.slot?.retired===!0}))}catch(e){return r(e,`worker settlement receipt failed`)}}function createWorkerTaskCompletion(e,t,n,r){let i=e.slot,a=i?.native,o=a?.taskChannelFailure,s=i&&a&&o&&n&&(n===o||n.cause===o)?()=>{let t=a.terminalFailure;return t?workerTaskUnavailableError(i,String(t),t,e):a.executionStopped?workerTaskUnavailableError(i,`${o.message}; worker exited with code ${a.executionExitCode}`,o,e):n}:void 0;e.owner&&s&&(e.owner.onCloseError=t=>e.reject(workerTaskRetirementError(s(),t)));let c=e.owner?void 0:e.preparation,l,complete=()=>{!e.owner&&!c&&t.releaseAdmission(e);let i=s?.()??n;try{return completeWorkerTask(e,t,i,r,l)}finally{e.owner&&s&&e.reject(i)}};if(!c)return{complete,resolveFailure:s};let u=Promise.withResolvers();return t.preparationCleanups.set(e,u.promise),u.promise.catch(()=>void 0),{resolveFailure:s,complete:()=>{l=e.runInContext(()=>notifyExecutionSettled(e)),n&&e.reject(s?.()??n),c.promise.then(()=>{let n=complete();if(n)throw n;t.preparationCleanups.delete(e),t.releaseAdmission(e),u.resolve()}).catch(u.reject)}}}function completeWorkerTask(e,t,n,i,a){return e.runInContext(()=>{let o=n??a,s=a?[a]:[];try{e.inputConsumed||(e.inputConsumed=!0,e.options.onInputConsumed?.());let t=e.exchange?.onConsumed;e.exchange=void 0,t?.()}catch(e){let t=r(e,`worker input release failed`);s.push(t),o??=t}let c=notifyExecutionSettled(e);c&&(s.push(c),o??=c);let l=e.computePermit;if(e.computePermit=void 0,l&&t.releaseCompute(l),Un.hasSubscribers){let n=performance.now();Un.publish({...t.diagnostics(),outcome:o?`failed`:`ok`,queueMs:(e.startedAt??n)-e.enqueuedAt,preparationMs:e.startedAt===void 0?0:(e.preparedAt??n)-e.startedAt,runMs:e.preparedAt===void 0?0:n-e.preparedAt,transferMs:e.transferMs,hostWaitMs:e.hostWaitMs})}let u=s[0],d=s.length>1?AggregateError(s,`Worker task cleanup failed`,{cause:u}):u;if(e.owner){if(d)throw d}else o?e.reject(o):e.resolve(i);return d})}function startCloseWorkerPoolResources(e,t,n,r,i,a,o){let s=[...e].map(e=>{if(e.retiring)return e.retiring;if(e.native?.executionStopped)return n(e);let s=e.worker;if(!s){let e=D(()=>{});return e.resolve(),e.operation}let c=t.get(s)??{pending:0};return c.pending++,t.set(s,c),s.ref(),startCloseWorkerTaskResources(e,s,c,i,a,n,r,o)}),c=D(()=>{for(let e of s)e.service();advance()}),advance=()=>{let e=s.map(e=>e.read());if(e.some(e=>e.status===`pending`))return;let t=e.flatMap(e=>e.status===`rejected`?[e.error]:[]);t.length?c.reject(AggregateError(t,`Worker resource cleanup failed`)):c.resolve()};for(let e of s)e.result.then(advance,advance);return advance(),c.operation}function observeResourceWorkerExit(e,t,n){let r=t.exit;if(!r){let n=/* @__PURE__ */ new Set;r={waiters:n,receive:()=>{for(let e of n)e()}},t.exit=r,e.once(`exit`,r.receive)}return r.waiters.add(n),()=>{r.waiters.delete(n),r.waiters.size||(e.removeListener(`exit`,r.receive),t.exit===r&&(t.exit=void 0))}}function startCloseWorkerTaskResources(e,t,n,a,o,s,c,l){let{port1:u,port2:d}=c(()=>new M),f=I.snapshot(),p=!1,m=!1,h,g=D(()=>{if(p)return;for(e.native?.service(),e.native?.executionStopped&&(m=!0,h??=e.retiring??s(e));;){let e=ze(u);if(!e||p)break;receive(e.message)}let t=h??e.retiring;if(m&&t){t.service();let e=t.read();e.status===`fulfilled`?finish():e.status===`rejected`&&finish(r(e.error,`Worker resource cleanup retirement failed`))}}),finish=r=>f(()=>{p||(p=!0,_(),u.close(),d.close(),n.pending--,n.pending||e.task||e.retiring||t.unref(),r?g.reject(r):g.resolve(),f=c)}),receive=e=>f(()=>{l?.();try{if(i(e)&&e.ok===!0){finish();return}let t=i(e)&&e.detail!==void 0&&o?.decodeResourceError?o.decodeResourceError(e.detail):Error(i(e)&&typeof e.error==`string`?e.error:`Invalid worker resource cleanup receipt`);finish(t)}catch(e){finish(r(e,`Worker resource cleanup receipt could not be decoded`))}}),_=observeResourceWorkerExit(t,n,()=>finish());u.once(`message`,receive),u.once(`messageerror`,e=>finish(r(e,`Worker resource cleanup receipt could not be decoded`))),u.once(`close`,()=>{if(p)return;let t=e.retiring;t?(m=!0,h=t,t.result.then(()=>finish(),e=>finish(r(e,`Worker resource cleanup retirement failed`)))):finish(/* @__PURE__ */ Error(`Worker resource cleanup closed without a receipt`))});try{t.postMessage({closeResource:!0,key:a,resourcePort:d},[d])}catch(e){finish(r(e,`Worker resource cleanup could not be sent`))}return g.operation}const Wn=3e5;function isWorkerIdleForPressure(e,t=!1){return e!==void 0&&(t||performance.now()-e>=1e3)}function createWorkerIdleTimers(e){let t=setTimeout,n=clearTimeout;return{clear(e){n(e.idleTimer),e.idleTimer=void 0},arm(n,r,i){n.idleTimer||(n.idleTimer=e(()=>t(()=>{n.idleTimer=void 0,i()},r)),n.idleTimer.unref())}}}function createWorkerTaskPoolRetirement({slots:e,options:t,retainOneIdleWorker:n,runInContext:i,dispatch:a,onRotationComplete:o,serviceDeadlines:s,markWorkerRetirement:c,serviceHost:l}){let u=/* @__PURE__ */ new Map,d=-1/0,f,p=-1/0,m,h,g=!1,_=createWorkerIdleTimers(i),v=performance.now.bind(performance),y=n?/* @__PURE__ */ new Set:void 0;function newestIdle(){if(!y)return;let e;for(let t of y)e=t;return e}function clearIdle(e){e.idleSince=void 0,y?.delete(e),_.clear(e)}let isBurstSlot=n=>{if(t.burstIdleTimeoutMs!==void 0){for(let t of e)if(!t.retiring&&!t.retirementFailed)return t!==n}return!1};function startRotate(){if(h)return h;let t=I.snapshot(),n,r,i=!1,c=D(()=>{serviceNativeWorkerPass(l,u),s();for(let e of n??[])e.service();r?.service(),advance()});h=c.operation,g=!1;let u=[...e],f=u.flatMap(e=>e.task?[e.task]:[]),advance=()=>t(()=>{if(!(i||c.operation.read().status!==`pending`)){i=!0;try{if(f.some(e=>e.read().status===`pending`))return;if(!n){n=u.map(e=>startRetire(e,`rotation`));for(let e of n)e.result.then(advance,advance)}for(let e of n){let t=e.read();if(t.status===`rejected`)throw t.error;if(t.status===`pending`)return}r||(r=startJoinArtifacts(),r.result.then(advance,advance));let e=r.read();if(e.status===`pending`)return;if(e.status===`rejected`)throw e.error;d=-1/0,p=-1/0,h=void 0,o(),c.resolve(),a()}catch(e){h=void 0,g=!0,c.reject(e)}finally{i=!1}}});for(let e of f)e.promise.then(advance,advance);return advance(),c.operation}function startRetire(n,r=`closed`){if(r===`idle_timeout`&&(isBurstSlot(n)?p=v():d=v()),f===n&&(f=void 0),m===n&&(m=void 0),n.worker&&c(n.worker,r),clearIdle(n),je(n.nativeSections),n.retiring)return n.retiring;let o=I.snapshot(),s,h,g=!1,_=!1,y=D(()=>{s?.service(),advance()}),advance=()=>o(()=>{if(!(_||y.operation.read().status!==`pending`)){_=!0;try{if(n.creating)return;if(!ke(n.nativeSections)){g||(g=!0,Promise.resolve(Ne(n.nativeSections)).then(advance,y.reject));return}if(n.worker&&!s){c(n.worker,r);try{if(h===void 0&&(h=l.flushWorkerDiagnostics?.(n.worker,r)??null,h?.result.then(advance,advance)),h?.service(),h?.read().status===`pending`)return}catch{h=null}if(n.native)s=n.native.stop();else{let e=D(()=>{});s=e.operation,Promise.resolve().then(()=>n.worker.terminate()).then(()=>e.resolve(),e.reject)}if(l.workerStopped){let e=n.worker;s=le(s,()=>{let t=D(()=>{}),n=l.workerStopped?.(e);return n?n.then(()=>t.resolve(),t.reject):t.resolve(),t.operation})}s.result.then(advance,advance)}let t=s?.read();if(t?.status===`pending`)return;if(t?.status===`rejected`)throw t.error;n.retired=!0;let o=n.releaseResources;o&&i(()=>{let e=(async()=>{try{await o()}catch(e){try{process.emitWarning(`Worker task resource release failed: ${String(e)}`)}catch{}}})(),t=D(()=>{});u.set(e,t.operation),e.then(()=>{u.delete(e),t.resolve()},t.reject)}),n.worker?.removeAllListeners(),e.delete(n);for(let e of n.completions??[])e();n.completions=void 0,a(),y.resolve()}catch(e){try{Promise.resolve(t.onRetirementFailure?.(e)).catch(()=>void 0)}catch{}n.retirementFailed=!0,n.retiring=void 0,y.reject(e)}finally{_=!1}}});return n.retiring=y.operation,Promise.resolve().then(advance),y.operation}function retire(e,t){return startRetire(e,t).result}function startJoinArtifacts(){let e=[...u.values()],t=D(()=>{for(let t of e)t.service();advance()}),advance=()=>{let n=e.map(e=>e.read()),r=n.find(e=>e.status===`rejected`);r?.status===`rejected`?t.reject(r.error):n.every(e=>e.status===`fulfilled`)&&t.resolve()};for(let t of e)t.result.then(advance,advance);return advance(),t.operation}async function retryFailedRetirements(){let t=await Promise.allSettled([...e].filter(e=>e.retirementFailed).map(e=>retire(e)));t.push(...await Promise.allSettled(u.keys()));let n=t.flatMap(e=>e.status===`rejected`?[r(e.reason,`worker retirement retry failed`)]:[]),i=n[0];if(i)throw n.length===1?i:AggregateError(n,`Worker retirement retries failed`,{cause:i})}function idle(e,n=0){let r=isBurstSlot(e),i=(r?t.burstIdleTimeoutMs:t.idleTimeoutMs)??6e4;if(e.idleSince??=v()-n,i<=0)return;if(y&&!y.has(e)){let t=newestIdle();y.add(e),t&&!t.idleTimer&&retire(t,`idle_timeout`).catch(()=>void 0)}!r&&!f&&v()-d<Wn&&(f=e),r&&(!m||!isBurstSlot(m))&&v()-p<Wn&&(m=e);let a=r?v():0,o=r?m===e?i*3:i:f===e?Math.max(i,Wn):i;_.arm(e,Math.max(0,o-n),()=>{newestIdle()!==e&&(r&&!isBurstSlot(e)?idle(e,v()-a):retire(e,`idle_timeout`).catch(()=>void 0))})}return{get preferredIdle(){return newestIdle()},get dispatchAllowed(){return h===void 0&&!g},startRotate,retire,startRetire,service(){let t=[...e];for(let e of t)e.retiring?.service();h?.service()},clearIdle,idle,retireIdle(t,n=!1){for(let r of e)!r.task&&!r.retiring&&!r.retirementFailed&&r.worker&&isWorkerIdleForPressure(r.idleSince,n)&&!t.get(r.worker)?.pending&&retire(r,`memory_pressure`).catch(()=>void 0)},retryFailedRetirements,joinArtifacts:()=>startJoinArtifacts().result}}function sendWorkerTaskInput(e){let{slot:t,task:n,input:r}=e;if(n.done)return;n.preparedAt=performance.now();let i=e.bootstrapError();if(i&&!t.worker)e.refuse(i);else try{let i=t.worker;if(!i){t.creating=!0;try{i=e.createWorker()}catch(t){e.fail(t,!0);return}finally{t.creating=!1}}let a=n.options.transferList?.(r);if(!n.done){let o=e.host.captureTaskContext(i),s=[...a??[],...e.host.taskContextTransferList?.(o)??[]],c=performance.now(),l=n.options.progressSignal;i.postMessage({input:r,taskId:n.id,interactive:!!(n.options.onRequest||n.options.onRequestSync||n.options.onNotification),nativeSections:t.nativeSections.buffer,...l?{progressSignal:l}:{},taskContext:o,sampleMemory:!0},s),n.transferMs+=performance.now()-c}}catch(t){e.fail(t)}}function createWorkerTaskPoolWorker(e){let{slot:t,options:n}=e,r=e.host.captureWorkerStartObserver?.(n.workerUrl),a=e.runInContext(()=>{let r=n.prepareWorker?.();t.releaseResources=r?.releaseResources;let i=r?.temporaryDirectory;if(i){let n=e.host.prepareResources(),r=t.releaseResources;t.releaseResources=async()=>{try{await n,await e.host.releaseTemporaryDirectory(i)}finally{await r?.()}}}let a=n.workerUrl,o={...n.workerOptions,...r?.options};e.host.requiresReady&&(t.ready=!1);let s=e.host.createWorker(a,o);return t.native=s.native,s.worker}),o=!1,started=()=>{o||(o=!0,e.onStarted(a),r?.(),r=void 0)};return t.native?(t.native.on(`started`,started),t.native.on(`execution-exit`,n=>{Ae(t.nativeSections),t.retiring||e.onFailure(e.unavailableError(`worker exited with code ${n}`),!0)})):started(),t.worker=a,a.on(`message`,n=>{if(e.host.receiveMessage(a,n))return;if(t.ready===!1){i(n)&&n.status===`ready`?t.ready=!0:e.onFailure(e.unavailableError(`worker task server did not become ready`),!0);return}let r=t.task;r?r.runInContext(()=>e.onMessage(n)):e.onMessage(n)}),a.on(`error`,t=>e.onFailure(e.unavailableError(String(t),t),!0)),a.on(`messageerror`,t=>e.onFailure(e.unavailableError(String(t),t))),a.once(`exit`,n=>{Ae(t.nativeSections);let r=o;o=!1,e.onExit(n,r)}),a}const Q=I.snapshot(),Gn=it(`openclaw.memory.critical`);var WorkerTaskPoolCore=class{constructor(e,t,n,r={}){if(this.options=e,this.host=t,this.publicDispatch=n,this.ownerOptions=r,this.slots=/* @__PURE__ */ new Set,this.ownedTasks=/* @__PURE__ */ new Set,this.resourceClosures=/* @__PURE__ */ new WeakMap,this.ownedSettlement={cancel:e=>this.cancel(e,new WorkerTaskError(`worker task closed`,`unavailable`)),detach:e=>{e.slot?.task===e&&(e.slot.task=void 0,this.activeTasks--)},retire:e=>this.retirement.startRetire(e),release:(e,t)=>{this.ownedTasks.delete(e)&&(this.releaseAdmission(e),e.runInContext=Q,this.dispatch(),t&&!e.owner?.retire&&!t.task&&!t.retiring&&this.idle(t))}},this.completion={preparationCleanups:/* @__PURE__ */ new Map,releaseAdmission:e=>this.releaseAdmission(e),releaseCompute:e=>this.computeCapacity.release(e),diagnostics:()=>({worker:this.options.workerUrl.pathname.split(`/`).at(-1),...this.publicDispatch?.getSnapshot()??this.getSnapshot(),pendingBytes:this.admission.pendingBytes})},this.queue=[],this.bootstrap=createWorkerTaskPoolBootstrap(this.slots,this.queue,(e,t)=>this.finish(e,t)),this.workers=0,this.workersCreated=0,this.activeTasks=0,this.resumeCompute=()=>this.dispatch(),this.nextTaskId=0,this.retireIdleOnPressure=e=>this.retirement.retireIdle(this.resourceClosures,e===!0),this.expireTasks=()=>expireWorkerTasks(this.queue,this.slots,this.timeout),this.retryFailedRetirements=()=>this.retirement.retryFailedRetirements(),this.timeout=e=>{e.done||this.cancel(e,workerTaskTimeoutError(e.exchange,this.options.workerUrl))},this.observeTask=t.createTaskObserver?.(e.workerUrl),this.maxWorkers=t.maxWorkers??e.maxWorkers??Qe(),!Number.isSafeInteger(this.maxWorkers)||this.maxWorkers<1)throw RangeError(`maxWorkers must be a positive safe integer`);this.computeCapacity=e.sharedCompute?t.computeCapacity:void 0,this.admission=new WorkerTaskAdmission(e.maxPendingTasks??128,e.maxPendingBytes??268435456,this.computeCapacity),this.retirement=createWorkerTaskPoolRetirement({slots:this.slots,options:e,retainOneIdleWorker:r.retainOneIdleWorker,runInContext:Q,dispatch:()=>this.dispatch(),onRotationComplete:()=>{this.bootstrap.reset(),e.onRotationComplete?.()},serviceDeadlines:this.expireTasks,markWorkerRetirement:(e,n)=>t.workerRetiring(e,n),serviceHost:t}),t.pools.register(this)}run(e,t){if(this.closedError)return Promise.reject(this.closedError);let n=t.inputBytes??0;return!Number.isSafeInteger(n)||n<0?Promise.reject(/* @__PURE__ */ RangeError(`inputBytes must be a nonnegative safe integer`)):this.enqueue(e,t,!1,n).promise}runTask(e,t){let n=this.enqueue(e,t,!0);return{result:n.promise,close:e=>joinOwnedWorkerTask(n,this.ownedSettlement,e?.retire===!0)}}startTask(e,t){if(!this.ownerOptions.retainedTransport)throw new WorkerTaskError(`Retained tasks require their native lifetime transport`,`unavailable`);return retainWorkerTask(this.enqueue(e,t,!0),this.ownedSettlement,()=>this.service())}service(){serviceNativeWorkerPass(this.host,this.slots),this.expireTasks(),this.retirement.service();for(let e of Array.from(this.ownedTasks))e.owner?.closing?.service();this.dispatch()}enqueue(e,t,n,i=t.inputBytes??0){let a=D(()=>this.service(),{observeRejection:this.ownerOptions.retainedTransport===!0}),o={promise:a.operation.result,resolve:a.resolve,reject:a.reject,read:()=>a.operation.read(),id:++this.nextTaskId,runInContext:captureWorkerTaskContext(),controller:void 0,inputConsumed:!1,executionNotified:!1,exchangeSequence:0,input:e,options:{...t},abort:()=>this.cancel(o,r(t.signal?.reason,`worker task aborted`)),done:!1,admitted:!1,...n?{owner:{closed:!1,retire:!1}}:{},inputBytes:i,enqueuedAt:performance.now(),transferMs:0,hostWaitMs:0};n&&this.ownedTasks.add(o);let s=this.closedError??this.bootstrap.admissionError;if(s||!Number.isSafeInteger(i)||i<0)return this.finish(o,s??/* @__PURE__ */ RangeError(`inputBytes must be a nonnegative safe integer`)),o;let c=this.admission.admitTask(o,()=>this.host.describeTask?.(this.options.workerUrl,void 0,t.diagnosticOperation));return c?(this.finish(o,c),o):(o.observation=this.observeTask?.(o.options.diagnosticOperation),armWorkerTaskTimeout(o,t.timeoutMs,this.timeout,`enqueue`),t.signal?.addEventListener(`abort`,o.abort,{once:!0}),enqueueWorkerTask(this.queue,o),t.signal?.aborted?o.abort():this.dispatch(),o)}get isClosed(){return this.closedError!==void 0}getSnapshot(){return{maxWorkers:this.maxWorkers,workers:this.workers,workersCreated:this.workersCreated,activeTasks:this.activeTasks,pendingTasks:this.admission.pendingTasks}}startCloseResources(e){return startCloseWorkerPoolResources(this.slots,this.resourceClosures,e=>this.ownedSettlement.retire(e),Q,e,this.ownerOptions,this.host.observeResourceReply)}rotate(){return this.startRotate().result}startRotate(){return this.computeCapacity?.remove(this.resumeCompute),this.retirement.startRotate()}close(e=new WorkerTaskError(`worker task pool closed`,`unavailable`),t=`closed`){this.closedError??=e,this.admission.close(),Gn.unsubscribe(this.retireIdleOnPressure),this.computeCapacity?.remove(this.resumeCompute);for(let e of this.queue.splice(0))this.finish(e,this.closedError);for(let e of this.slots)e.worker&&this.host.workerRetiring(e.worker,t),e.task&&!e.task.owner&&this.finish(e.task,this.closedError,void 0,!0);let n=[...this.ownedTasks],r=new Set(n.flatMap(e=>e.slot?.task===e?[e.slot]:[])),i=n.map(e=>joinOwnedWorkerTask(e,this.ownedSettlement,!0)),a=[...this.slots].filter(e=>!r.has(e)),o=[...i,...a.map(e=>this.retirement.retire(e,t))];return this.host.pools.close(this,o,()=>joinWorkerTaskPreparationCleanups(this.completion,this.retirement.joinArtifacts()))}dispatch(){for(this.slots.size||Gn.unsubscribe(this.retireIdleOnPressure),this.queue.length&&!this.closedError&&this.retirement.dispatchAllowed||this.computeCapacity?.remove(this.resumeCompute);!this.closedError&&this.retirement.dispatchAllowed&&this.queue.length;){let e=this.queue[0],t=this.maxWorkers+Number(e.options.pointRead===!0),n=this.activeTasks<t?this.retirement.preferredIdle:void 0;if(n??=[...this.slots].find(e=>this.activeTasks<t&&!e.task&&!e.retiring&&!e.retirementFailed&&(!this.bootstrap.error()||e.worker)),!n){let e=this.bootstrap.error();if(e&&this.bootstrap.rejectQueued(),e||this.slots.size>=t){let e=this.queue.length;for(let t of this.slots)t.task?.exchange&&!t.task.exchange.sent&&!t.task.exchange.pressure.signal.aborted&&e-->0&&t.task.exchange.pressure.abort();return}}if(this.computeCapacity&&!e.options.pointRead){let t=this.computeCapacity.acquire(this.resumeCompute,()=>e.exchange&&!e.exchange.sent&&!e.exchange.pressure.signal.aborted?(e.runInContext(()=>e.exchange?.pressure.abort()),!0):!1);if(!t)return;e.computePermit=t}n||(n={nativeSections:Pe()},this.slots.add(n)),this.retirement.clearIdle(n);let i=this.queue.shift();n.task=i,this.activeTasks++,i.slot=n,i.startedAt=performance.now(),armWorkerTaskTimeout(i,i.options.timeoutMs,this.timeout,`dispatch`),i.observation?.started(),i.runInContext(()=>{try{n.worker?.ref()}catch(e){this.fail(n,r(e,`worker reference failed`));return}prepareWorkerTaskInput(i,e=>{i.diagnosticLabel=this.host.describeTask?.(this.options.workerUrl,e),sendWorkerTaskInput({slot:n,task:i,input:e,host:this.host,bootstrapError:this.bootstrap.error,createWorker:()=>this.createWorker(n),fail:(e,t)=>this.fail(n,workerTaskUnavailableError(n,String(e),e),t),refuse:e=>this.finish(i,e,void 0,!0)})},e=>this.finish(i,r(e,`worker task preparation failed`)),!n.worker&&this.options.prepareWorker?()=>Q(()=>this.host.prepareResources()):void 0)})}}createWorker(e){return(this.options.idleTimeoutMs??6e4)>0&&(Gn.unsubscribe(this.retireIdleOnPressure),Gn.subscribe(this.retireIdleOnPressure)),createWorkerTaskPoolWorker({slot:e,options:this.options,host:this.host,runInContext:Q,unavailableError:(t,n)=>workerTaskUnavailableError(e,t,n),onStarted:e=>{this.workers++,this.workersCreated++,this.host.workerStarted(e,this)},onMessage:t=>this.receive(e,t),onFailure:(t,n)=>this.fail(e,t,n),onExit:(t,n)=>{n&&this.workers--;let r=workerTaskUnavailableError(e,`worker exited with code ${t}`);this.fail(e,r,!0)}})}receive(e,t){if(e.retiring)return;let n=e.task;if(n&&i(t)&&(t.status===`request`||t.status===`consumed`||t.status===`notification`)){try{this.receiveExchange(e,n,t)}catch(t){this.fail(e,r(t,`worker consumption callback failed`))}return}if(!n||!i(t)||(n.options.onRequest||n.options.onRequestSync||t.taskId!==void 0)&&t.taskId!==n.id||t.status!==`ok`&&t.status!==`failed`){this.fail(e,new WorkerTaskError(`invalid worker task response`,`unavailable`));return}let a=t,o=!!(n.exchange||n.options.onInputConsumed&&!n.inputConsumed);if(a.status===`failed`)this.finish(n,new WorkerTaskError(a.error,`failed`),void 0,o);else{try{this.options.validateResult?.(a.value)}catch(t){this.fail(e,r(t,`worker result validation failed`));return}this.finish(n,void 0,a.value,o)}}receiveExchange(e,t,n){if(n.taskId!==t.id){this.fail(e,new WorkerTaskError(`stale worker exchange`,`unavailable`));return}if(n.status===`notification`){t.options.onNotification?.(n.value);return}if(n.status===`consumed`){if(n.id===0&&!t.inputConsumed){t.inputConsumed=!0;let e=t.options.onInputConsumed;t.options.onInputConsumed=void 0,e?.()}else if(t.exchange?.sent&&n.id===t.exchange.id){let e=t.exchange.onConsumed;t.exchange=void 0,e?.()}else this.fail(e,new WorkerTaskError(`invalid worker consumption receipt`,`unavailable`));return}if(!t.options.onRequest&&!t.options.onRequestSync||t.exchange||!Number.isSafeInteger(n.id)||n.id!==t.exchangeSequence+1){this.fail(e,new WorkerTaskError(`invalid worker exchange`,`unavailable`));return}t.options.hostTimeout===`owner`&&(clearTimeout(t.timer),t.deadline=void 0);let i=createWorkerHostExchange(t,n.value);t.hostWaitStartedAt=performance.now(),this.dispatch(),this.computeCapacity?.requestCheckpoints(),dispatchOwnedWorkerRequest(t,e,n.value,i,{accept:n=>{if(!t.done&&t.deadline!==void 0&&performance.now()>=t.deadline&&this.timeout(t),t.done||e.task!==t||e.retiring){let release=()=>{try{t.runInContext(()=>n.onConsumed?.())}catch{}};this.slots.has(e)?(e.completions??=[]).push(release):release()}else{this.finishHostWait(t),i.onConsumed=n.onConsumed,i.sent=!0,armWorkerTaskTimeout(t,n.timeoutMs,this.timeout);try{e.worker.postMessage({taskId:t.id,responseId:i.id,input:n.input},n.transferList)}catch(t){this.fail(e,r(t,`worker response delivery failed`))}}},reject:n=>{!t.done&&e.task===t&&this.fail(e,r(n,`worker host exchange failed`))}})}cancel(e,t){e.done||(e.slot?(e.slot.worker&&this.host.workerRetiring(e.slot.worker,`cancelled`),e.owner?this.finish(e,t,void 0,!0):this.fail(e.slot,t)):(this.queue.splice(this.queue.indexOf(e),1),this.finish(e,t)))}fail(e,t,n){e.retiring||(n&&e.ready===!1&&this.bootstrap.fail(t),e.worker&&this.host.workerRetiring(e.worker,`failure`),e.task?.owner?e.task.done?e.task.owner.retire||closeOwnedWorkerTask(e.task,this.ownedSettlement,!0).catch(()=>void 0):this.finish(e.task,t,void 0,!0):this.options.restartOnError===!1?(this.publicDispatch?.close(t)??this.close(t)).catch(()=>void 0):e.task?this.finish(e.task,t,void 0,!0):this.retirement.retire(e).catch(()=>void 0))}finishHostWait(e){let t=e.hostWaitStartedAt;t!==void 0&&(e.hostWaitStartedAt=void 0,e.hostWaitMs+=performance.now()-t)}finish(e,t,n,r=!1){if(e.done)return;this.finishHostWait(e),e.done=!0,e.observation?.completed(),e.observation=void 0,e.runInContext(()=>e.controller?.abort(t)),clearTimeout(e.timer),e.deadline=void 0,e.options.signal?.removeEventListener(`abort`,e.abort);let i=e.slot,{complete:a,resolveFailure:o}=createWorkerTaskCompletion(e,this.completion,t,n);e.owner?(e.owner.complete=a,e.owner.retire||=r||!!(t&&e.slot&&e.preparedAt!==void 0),t?(!o||e.preparation)&&e.reject(o?.()??t):e.resolve(n),(t||r)&&closeOwnedWorkerTask(e,this.ownedSettlement).catch(()=>void 0)):i&&(i.task=void 0,this.activeTasks--,r)?((i.completions??=[]).push(a),this.retirement.retire(i,`failure`).catch(n=>e.reject(workerTaskRetirementError(o?.()??t,n)))):(a(),this.dispatch(),i&&!i.task&&!i.retiring&&this.idle(i))}releaseAdmission(e){e.admitted&&(e.admitted=!1,this.admission.finish(e.inputBytes))}idle(e){e.worker&&!this.resourceClosures.get(e.worker)?.pending&&e.worker.unref(),this.retirement.idle(e)}};function childCapacityError(e,t){let n=0,r=0;for(let t of e)n++,t===`mcp`&&r++;if(n>=512)return`Spawn broker child capacity exceeded (512); close running processes before retrying`;if(t===`mcp`&&r>=448)return`Spawn broker MCP child capacity exceeded (448); close unused MCP sessions before retrying`}var SpawnBrokerError=class extends Error{constructor(e,t){super(e,t),this.code=`ERR_SPAWN_BROKER_UNAVAILABLE`,this.name=`SpawnBrokerError`}};function serializeBrokerError(e){return{message:e.message,code:e.code,errno:e.errno,syscall:e.syscall,path:e.path}}function brokerSpawnOptions(e){let t=e.stdio??`pipe`,n=typeof t==`string`?[t,t,t]:[...t],r=[];for(let e=0;e<Math.max(3,n.length);e+=1){let t=n[e]??(e<3?`pipe`:`ignore`);if(t===`inherit`&&e!==0||t!==`pipe`&&t!==`ignore`&&t!==`inherit`&&t!==`ipc`)return;r.push(t)}if(e.signal||e.timeout||e.killSignal)throw Error(`Unsupported spawn broker cancellation options`);return{cwd:e.cwd instanceof URL?B(e.cwd):e.cwd,env:e.env?{...e.env}:{...process.env},argv0:e.argv0,detached:e.detached,shell:e.shell,windowsHide:e.windowsHide,windowsVerbatimArguments:e.windowsVerbatimArguments,serialization:e.serialization,uid:e.uid,gid:e.gid,stdio:r}}const Kn=/* @__PURE__ */ new WeakMap,holdReadable=()=>{};function holdPipe(e){let t={read:e.read.bind(e),resumed:!1,onResume:()=>{t.resumed=!0}};Kn.set(e,t),e.on(`resume`,t.onResume),e.on(`readable`,holdReadable),e.read=()=>null}function restoreStdinPipe(e){let t=Reflect.get(e,`_readableState`);if(!t||typeof t!=`object`||[`ended`,`endEmitted`,`reading`].some(e=>typeof Reflect.get(t,e)!=`boolean`))throw new SpawnBrokerError(`Spawn broker requires a Node readable state for stdin`);stopPipeReads(e),Object.assign(t,{readable:!1,ended:!0,endEmitted:!0,reading:!1})}function stopPipeReads(e){let t=Reflect.get(e,`_handle`);if(!t||typeof t!=`object`||!(`readStop`in t)||typeof t.readStop!=`function`||!(`reading`in t)||typeof t.reading!=`boolean`)throw new SpawnBrokerError(`Spawn broker requires a transferable Node pipe handle`);if(t.readStop()!==0)throw new SpawnBrokerError(`Spawn broker could not stop pipe reads`);t.reading=!1}function releasePipe(e){let t=restoreReader(e);t&&process.nextTick(()=>{e.destroyed||(e.emit(`readable`),t.resumed&&e.resume())})}function restoreReader(e){let t=Kn.get(e);if(t)return e.read=t.read,Kn.delete(e),e.removeListener(`resume`,t.onResume),e.removeListener(`readable`,holdReadable),t}var BrokerChild=class extends st{constructor(e,t,n,r=!1){super(),this.requestId=e,this.transmit=n,this.fileOutputPending=r,this.callbackContext=new Be(`OpenClawSpawnBrokerChild`),this.stdin=null,this.stdout=null,this.stderr=null,this.connected=!1,this.killed=!1,this.exitCode=null,this.signalCode=null,this.stdio=[null,null,null,null,null],this.opened=De(),this.completion=De(),this.pipes=/* @__PURE__ */ new Set,this.sends=/* @__PURE__ */ new Map,this.sendSequence=0,this.spawnReceived=!1,this.eventsReleased=!1,this.pendingEventOverflow=!1,this.pendingEvents=[],this.exited=!1,this.closed=!1,this.processNotStarted=!1,this.spawnfile=t[0],this.spawnargs=[...t],this.opened.promise.catch(()=>{}),this.on(`error`,()=>{})}markNotStarted(){this.processNotStarted=!0}get notStarted(){return this.processNotStarted}ready(){return this.opened.promise}emit(e,...t){return this.callbackContext.runInAsyncScope(()=>super.emit(e,...t))}waitForClose(){return this.completion.promise}settleFileOutput(){this.fileOutputPending=!1,this.finishClose()}attachPipe(e,t){t.emit=this.callbackContext.bind(t.emit.bind(t)),this.stdio[e]=t,e===0&&(this.stdin=t),e===1&&(this.stdout=t),e===2&&(this.stderr=t),this.pipes.add(t);let n=!1,acknowledge=t=>{n||(n=!0,this.transmit({type:`output-drained`,id:this.requestId,fd:e,error:t?serializeBrokerError(t):void 0}).catch(()=>{}))};t.once(e===0?`finish`:`end`,()=>acknowledge()),t.on(`error`,acknowledge),t.once(`close`,()=>{acknowledge(),this.pipes.delete(t),this.finishClose()})}receive(e){if(e.type===`spawned`){if(this.spawnReceived||this.closed)return;for(this.spawnReceived=!0,this.pid=e.pid,this.spawnfile=e.spawnfile,this.spawnargs=e.spawnargs,this.connected=e.connected,this.stdio.splice(e.stdioLength);this.stdio.length<e.stdioLength;)this.stdio.push(null);this.connected&&(this.channel=Object.assign(new st,{ref(){},unref(){}})),this.opened.resolve(),setImmediate(()=>{this.closed||(this.emit(`spawn`),setImmediate(()=>{for(let[e,t]of this.stdio.entries())e>0&&t instanceof ut&&!t.destroyed&&releasePipe(t);this.eventsReleased=!0;for(let e of this.pendingEvents.splice(0))e()}))})}else!this.eventsReleased&&(this.spawnReceived||e.type!==`error`)?this.deferEvent(()=>this.emitMessage(e)):this.emitMessage(e)}deferEvent(e){this.pendingEventOverflow||(this.pendingEvents.length>=64?(this.pendingEventOverflow=!0,this.pendingEvents.splice(0),this.pendingEvents.push(()=>{this.kill(`SIGKILL`),this.failNow(new SpawnBrokerError(`Spawn broker startup event capacity exceeded`))})):this.pendingEvents.push(e))}emitMessage(e){switch(e.type){case`error`:{let t=Object.assign(Error(e.error.message),e.error);this.opened.reject(t),this.emit(`error`,t),this.pid||(this.exited=!0,this.finishClose());break}case`exit`:this.exited=!0,this.exitCode=e.code,this.signalCode=e.signal,this.stdin?.destroy(),this.emit(`exit`,e.code,e.signal),process.nextTick(()=>{for(let e of this.pipes)e.readable&&e.resume()}),this.finishClose();break;case`ipc-sent`:this.finishSend(e.sequence,e.error?Object.assign(Error(e.error.message),e.error):null);break;case`disconnect`:this.failSends(/* @__PURE__ */ Error(`Child process IPC channel is closed`)),this.connected=!1,this.channel=void 0,this.emit(`disconnect`),this.finishClose();break;case`ipc`:this.emit(`message`,e.message);break;case`closed`:this.finishClose()}}fail(e){this.spawnReceived&&!this.eventsReleased?this.deferEvent(()=>this.failNow(e)):this.failNow(e)}failNow(e){if(this.closed)return;this.opened.reject(e);let t=this.connected;this.connected=!1,this.channel=void 0,this.failSends(e),t&&this.emit(`disconnect`),this.exited||this.emit(`error`,e);for(let t of this.pipes)t.destroy(e);this.exited=!0,this.finishClose()}finishClose(){!this.exited||this.channel||this.pipes.size>0||this.closed||this.fileOutputPending||(this.closed=!0,this.completion.resolve(),this.emit(`close`,this.exitCode,this.signalCode))}kill(e=`SIGTERM`){return!this.exited&&(this.killed=!0,this.transmit({type:`kill`,id:this.requestId,signal:e}).catch(e=>this.fail(r(e,`Spawn broker signal delivery failed`))),!0)}send(e,t,n,i,a){let o=typeof t==`function`?t:typeof n==`function`?n:i;if(!this.connected||this.sends.size>=1024){let e=/* @__PURE__ */ Error(this.connected?`Child process IPC capacity exceeded`:`Child process IPC channel is closed`);return queueMicrotask(()=>o?o(e):this.emit(`error`,e)),!1}let s=++this.sendSequence;this.sends.set(s,Be.bind(e=>{o?o(e):e&&this.emit(`error`,e)}));let c=typeof t==`function`?void 0:t;return this.transmit({type:`ipc`,id:this.requestId,sequence:s,message:e},c,a).catch(e=>this.finishSend(s,r(e,`Spawn broker IPC delivery failed`))),!0}finishSend(e,t){let n=this.sends.get(e);this.sends.delete(e),n?.(t)}failSends(e){for(let t of this.sends.keys())this.finishSend(t,e)}disconnect(){this.connected&&(this.connected=!1,this.transmit({type:`disconnect`,id:this.requestId}).catch(e=>this.fail(r(e,`Spawn broker disconnect failed`))))}ref(){}unref(){}[Symbol.dispose](){this.kill(`SIGTERM`)}};const qn=d(Symbol.for(`openclaw.workerStartObservation`),()=>new I);function captureWorkerStartObserver(e){let t=qn.getStore();return t?()=>t(p(e)):void 0}const Jn=d(Symbol.for(`openclaw.workerRequestMetricsListeners`),()=>/* @__PURE__ */ new Set),Yn=d(Symbol.for(`openclaw.sqliteWorkerReservationObservation`),()=>new I),Xn=ve(`sqlite.worker-timing`),$=d(Symbol.for(`openclaw.workerRequestQueueDepth`),()=>/* @__PURE__ */ new Map);function trackWorkerRequest(e,t,n){let r=ie(t),i=e===`sqlite_writer`?Yn.getStore():void 0,a=performance.now(),o=e===`sqlite_writer`&&(Xn||Jn.size>0||ye(`worker.request`,!0))?{enqueued:a}:void 0,s,c=!1,l,emit=(t,n,i)=>{if(!be())return;let a=$.get(e)??0,s=t===`completed`?o:void 0;for(let o of Jn)try{o(e,r,t,a,n,i,s)}catch{}ye(`worker.request`,!0)&&xe({type:`worker.request`,kind:e,requestClass:r,phase:t,queueDepth:a,...n===void 0?{}:{queueWaitMs:n},...i===void 0?{}:{durationMs:i},...s?{timing:s}:{}})},dequeue=()=>$.set(e,($.get(e)??0)-1);$.set(e,($.get(e)??0)+1),emit(`queued`);let u={requestClass:r,timing:o,...i?{recordTransactions:e=>{i.transactionCount=(i.transactionCount??0)+e}}:{},started:(e,t)=>{c||s!==void 0||(s=performance.now(),o&&t&&(l={performance:t,atStart:t.eventLoopUtilization(),threadId:e}),i&&(u.startedAt=s,u.threadId=e,i.active=u,i.operations.add(i.operations.has(r)||i.operations.size<8?r:`other`)),o&&(o.dispatched=s),n?.removeEventListener(`abort`,u.completed),dequeue(),emit(`started`,s-a))},completed:()=>{if(!c){if(c=!0,i?.active===u&&(i.active=void 0),n?.removeEventListener(`abort`,u.completed),s===void 0&&dequeue(),l&&o?.posted!==void 0&&o.received!==void 0&&o.received-o.posted>=1e3){let e=l.performance.eventLoopUtilization(l.atStart),t=o.executeStarted!==void 0&&o.executeFinished!==void 0?o.executeFinished-o.executeStarted:0,n={requestClass:r,threadId:l.threadId,deliveryMs:Math.round(o.received-o.posted),executeMs:Math.round(t),workerActiveMs:Math.round(e.active),workerIdleMs:Math.round(e.idle),workerActiveOutsideExecuteMs:Math.round(Math.max(0,e.active-t))};import(`./disk-budget.worker-worker-request-delivery-report.runtime-CONn3OOq.mjs`).then(({reportSlowWorkerDelivery:e})=>e(n)).catch(e=>{process.emitWarning(e instanceof Error?e:String(e))})}emit(`completed`,void 0,s===void 0?void 0:performance.now()-s)}}};return n?.addEventListener(`abort`,u.completed,{once:!0}),n?.aborted&&u.completed(),u}function resolveEnvironmentValue(e,t,n=process.platform){if(!e)return;if(n!==`win32`)return e[t]??(t===`PATH`?e.Path:void 0);let r=t.toUpperCase(),i=Object.keys(e).toSorted().find(e=>e.toUpperCase()===r);return i===void 0?void 0:e[i]}function mergeProcessEnv(e,t=process.platform){let n=Object.create(null),r=/* @__PURE__ */ new Map;for(let i of e){if(!i)continue;let e=Object.keys(i),a=/* @__PURE__ */ new Set;for(let o of t===`win32`?e.toSorted():e){let e=t===`win32`?o.toUpperCase():void 0;if(e!==void 0){if(a.has(e))continue;a.add(e);let t=r.get(e);t!==void 0&&delete n[t],r.delete(e)}let s=i[o];s===void 0?delete n[o]:(n[o]=s,e!==void 0&&Object.hasOwn(n,o)&&r.set(e,o))}}return n}const Zn=/* @__PURE__ */ new Set(/* @__PURE__ */ `PATH.Path.HOME.USER.LOGNAME.TMPDIR.TMP.TEMP.LANG.LANGUAGE.TZ.LC_ALL.LC_COLLATE.LC_CTYPE.LC_MESSAGES.LC_MONETARY.LC_NUMERIC.LC_TIME.LC_ADDRESS.LC_IDENTIFICATION.LC_MEASUREMENT.LC_NAME.LC_PAPER.LC_TELEPHONE.SYSTEMROOT.WINDIR.COMSPEC.PATHEXT.SYSTEMDRIVE.USERPROFILE.HOMEDRIVE.HOMEPATH.USERNAME.USERDOMAIN.APPDATA.LOCALAPPDATA.PROGRAMDATA.ALLUSERSPROFILE.PROGRAMFILES.PROGRAMFILES(X86).PROGRAMW6432.COMMONPROGRAMFILES.COMMONPROGRAMFILES(X86).COMMONPROGRAMW6432.PSMODULEANALYSISCACHEPATH`.split(`.`));function resolveDiagnosticProcessEnv(e=process.env,t=process.platform){return Object.fromEntries(Object.entries(mergeProcessEnv([e],t)).filter(([e])=>Zn.has(t===`win32`?e.toUpperCase():e)))}const Qn=`C:\\Windows`;function readNativeProcessStartTime(e){if(!(process.platform!==`win32`||typeof SEALED_RUNTIME_BUILD==`boolean`&&SEALED_RUNTIME_BUILD))try{let t=ft(e);return t&&!t.exited?Math.floor(t.startTimeMicros/1e3):null}catch{return}}function windowsSystemRoot(e){let t=resolveEnvironmentValue(e,`SystemRoot`,`win32`)??resolveEnvironmentValue(e,`WINDIR`,`win32`);if(!t)return Qn;let n=z.win32.normalize(t);return/^[A-Za-z]:\\/.test(n)&&!n.startsWith(`\\\\`)?n:Qn}function windowsPowerShellPath(e){return z.win32.join(windowsSystemRoot(e),`System32`,`WindowsPowerShell`,`v1.0`,`powershell.exe`)}function windowsWmicPath(e){return z.win32.join(windowsSystemRoot(e),`System32`,`wbem`,`wmic.exe`)}function decodeWindowsProcessOutput(e){return Buffer.isBuffer(e)?e.length>=2&&e[0]===255&&e[1]===254?e.toString(`utf16le`):e.toString(`utf8`):e}function parseWindowsProcessStartTime(e){let t=decodeWindowsProcessOutput(e).split(/\r?\n/).map(e=>e.trim()).filter(Boolean),n=t.find(e=>e.toLowerCase().startsWith(`creationdate=`))?.slice(13).trim()??t.find(e=>e.toLowerCase()!==`creationdate`)??``,r=Date.parse(n);if(Number.isFinite(r))return r;let i=n.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.(\d{6})([+-])(\d{3})$/);if(!i)return null;let[,a,o,s,c,l,u,d,f,p]=i;return Date.UTC(Number(a),Number(o)-1,Number(s),Number(c),Number(l),Number(u),Math.floor(Number(d)/1e3))-Number(p)*6e4*(f===`+`?1:-1)}function readWindowsProcessStartTimeSync(e,t=1e4,n=process.env){if(!Number.isInteger(e)||e<=0||e>4294967295)return null;let r=performance.now()+t,i=readNativeProcessStartTime(e);if(i!==void 0)return i;let a=Math.ceil(r-performance.now());if(a<=0)return null;let o=V(windowsPowerShellPath(n),[`-NoProfile`,`-NonInteractive`,`-Command`,`$process = [System.Diagnostics.Process]::GetProcessById(${e}); try { [Console]::Out.Write($process.StartTime.ToUniversalTime().ToString("o")) } finally { $process.Dispose() }`],{encoding:`utf8`,env:resolveDiagnosticProcessEnv(n,`win32`),timeout:Math.min(a,5e3),windowsHide:!0});if(!o.error&&o.status===0){let e=parseWindowsProcessStartTime(o.stdout);if(e!==null)return e}let s=Math.ceil(r-performance.now());if(s<=0)return null;let c=V(windowsWmicPath(n),[`process`,`where`,`ProcessId=${e}`,`get`,`CreationDate`,`/value`],{env:resolveDiagnosticProcessEnv(n,`win32`),timeout:s,windowsHide:!0,stdio:[`ignore`,`pipe`,`ignore`]});return!c.error&&c.status===0?parseWindowsProcessStartTime(c.stdout):null}let $n;function loadFreeBsdProcessIdentityNative(){if(typeof SEALED_RUNTIME_BUILD==`boolean`&&SEALED_RUNTIME_BUILD)throw Error(`FreeBSD process identity is unavailable in this sealed runtime`);return $n||=Fe(import.meta.url)(`@openclaw/proc-safe/identity`),$n}function readFreeBsdProcessStartTime(e){if(process.platform!==`freebsd`||!Number.isInteger(e)||e<=0||e>2147483647)return null;try{return loadFreeBsdProcessIdentityNative().readProcessIdentity(e)?.startTimeSinceBootMicros??null}catch{return null}}function readDarwinNativeIdentity(e){if(!(process.platform!==`darwin`||typeof SEALED_RUNTIME_BUILD==`boolean`&&SEALED_RUNTIME_BUILD))try{let t=ft(e);return t&&!t.exited?{startedAt:Math.floor(t.startTimeMicros/1e6),startTimeMicros:t.startTimeMicros}:null}catch{return}}function readNativeLiveness(e){if(!(![`darwin`,`win32`,`freebsd`].includes(process.platform)||typeof SEALED_RUNTIME_BUILD==`boolean`&&SEALED_RUNTIME_BUILD))try{let t=ft(e);return t!==null&&!t.exited}catch(e){return e instanceof dt&&(e.code===`helper-unavailable`||e.code===`unsupported-platform`)?void 0:!0}}let er=null;function isValidPid(e){return Number.isInteger(e)&&e>0}function hasLinuxProcfs(){return process.platform===`linux`||process.platform===`android`}function exitedLinuxStatus(e,t){let n=t.match(/^State:\s+(\S)/m)?.[1],r=t.match(/^Threads:[ \t]+(\d+)[ \t]*$/m)?.[1];if(r===`0`)return;let i=t.match(/^Tgid:[ \t]+(\d+)[ \t]*$/m)?.[1];return i!==void 0&&Number(i)!==e||(n===`Z`||n===`X`)&&r===`1`}function isMissingPid(e){try{process.kill(e,0)}catch(e){return n(e,`ESRCH`)}return!1}function isExitedLinuxProcess(e){if(!hasLinuxProcfs())return!1;try{let t=exitedLinuxStatus(e,L.readFileSync(`/proc/${e}/status`,`utf8`));if(t!==void 0)return t}catch{}return isMissingPid(e)}async function isPidDefinitelyDeadAsync(e){if(!hasLinuxProcfs())return isPidDefinitelyDead(e);if(!isValidPid(e))return!0;try{process.kill(e,0)}catch(e){return n(e,`ESRCH`)}try{let t=exitedLinuxStatus(e,await L.promises.readFile(`/proc/${e}/status`,`utf8`));if(t!==void 0)return t}catch{}return isMissingPid(e)}function isPidAlive(e){if(!isValidPid(e))return!1;try{process.kill(e,0)}catch(t){let n=a(t)?t.code:void 0;if(n!==`EPERM`)return n===`ESRCH`?readNativeLiveness(e)??!1:!1}return readNativeLiveness(e)??!isExitedLinuxProcess(e)}function isPidDefinitelyDead(e){if(!isValidPid(e))return!0;let t=!1;try{process.kill(e,0)}catch(e){let n=a(e)?e.code:void 0;if(n!==`ESRCH`&&(process.platform!==`win32`||n!==`EPERM`))return!1;t=n===`ESRCH`}let n=readNativeLiveness(e);return n===void 0?t&&process.platform!==`freebsd`||isExitedLinuxProcess(e):!n}function getDarwinProcessStartTime(e,t,n){let r=performance.now(),i=readDarwinNativeIdentity(e);if(i!==void 0)return i?.startedAt??null;let a=n===void 0?1e3:Math.ceil(n-(performance.now()-r));if(a<=0)return null;try{let n=at.execFileSync(`/bin/ps`,[`-o`,`lstart=`,`-p`,String(e)],{encoding:`utf8`,env:{...resolveDiagnosticProcessEnv(t),LC_ALL:`C`,TZ:`UTC`},stdio:[`ignore`,`pipe`,`ignore`],timeout:a,killSignal:`SIGKILL`}).trim(),r=Date.parse(`${n} UTC`);return Number.isFinite(r)?Math.floor(r/1e3):null}catch{return null}}function parseLinuxProcessStat(e,t){let n=t.lastIndexOf(`)`);if(n<0||!t.startsWith(`${e} (`))return null;let r=t.slice(n+1).trimStart().split(/\s+/),i=Number(r[19]),a=Number(r[1]);return Number.isSafeInteger(i)&&i>=0&&Number.isSafeInteger(a)&&a>=0?{parentPid:a,startedAt:i}:null}function readLinuxProcessStat(e){if(!isValidPid(e)||!hasLinuxProcfs())return null;try{return parseLinuxProcessStat(e,L.readFileSync(`/proc/${e}/stat`,`utf8`))}catch{return null}}function getProcessStartTime(e){return readLinuxProcessStat(e)?.startedAt??null}function getProcessInstanceStartTime(e){if(!isValidPid(e))return null;if(hasLinuxProcfs()){let t=getProcessStartTime(e);return Number.isSafeInteger(t)?t:null}let t=readDarwinNativeIdentity(e);if(!t)return null;let n=t.startTimeMicros;return Number.isSafeInteger(n)?n:null}function getFileLockProcessStartTime(e,t=process.env,n){if(!isValidPid(e))return null;let r=e===process.pid;if(r&&er!==null)return er;let i=process.platform===`darwin`?getDarwinProcessStartTime(e,t,n):process.platform===`win32`?readWindowsProcessStartTimeSync(e,n,t):process.platform===`freebsd`?readFreeBsdProcessStartTime(e):getProcessStartTime(e);return r&&i!==null&&(er=i),i}var DarwinProcessInspectionError=class extends Error{constructor(e,t){super(`Darwin process inspection ${e}`,t),this.reason=e,this.name=`DarwinProcessInspectionError`,this.code=e===`deadline`?`ETIMEDOUT`:e===`permission`?`EPERM`:`EIO`}};function failure(e){if(e instanceof DarwinProcessInspectionError)return e;let t=e&&typeof e==`object`&&`code`in e?e.code:void 0;return new DarwinProcessInspectionError(t===`ETIMEDOUT`||t===`ABORT_ERR`||t===`timeout`?`deadline`:[`EACCES`,`EPERM`,`ERR_ACCESS_DENIED`,`access-denied`].includes(String(t))?`permission`:`unavailable`,{cause:e})}function remaining(e){let t=Math.floor(e-performance.now());if(t<=0)throw new DarwinProcessInspectionError(`deadline`);return t}const tr={running:`R`,sleeping:`S`,stopped:`T`,zombie:`Z`,idle:`I`,unknown:`?`};function hasReadableTopology(e){if(e.parentPid===void 0||e.processGroupId===void 0||e.state===void 0){if(ft(e.pid)===null)return!1;throw new DarwinProcessInspectionError(`unavailable`)}return!0}function topology(e){return{pid:e.pid,ppid:e.parentPid,pgid:e.processGroupId,state:tr[e.state],owner:e.owner}}function census(e,t){try{let n=pt({timeoutMs:remaining(e),...t?{pids:t}:{}}).filter(hasReadableTopology);return remaining(e),n}catch(t){throw remaining(e),failure(t)}}function*readDarwinProcessCensus(e){let t=performance.now()+e,n=census(t).map(topology);for(let e of n)remaining(t),yield e;remaining(t)}function readLinuxProcessUid(e){try{let t=qe(`/proc/${e}/status`,`utf8`).split(`
`).filter(e=>e.startsWith(`Uid:`)),n=(t.length===1?/^Uid:[ \t]+(\d+)[ \t]+(\d+)[ \t]+(\d+)[ \t]+(\d+)[ \t]*$/.exec(t[0]):null)?.slice(1).map(Number),r=process.getuid?.();return n?.every(e=>Number.isSafeInteger(e)&&e<=4294967295)?n.find(e=>e===r)??n[0]:void 0}catch{return}}function parseLinuxProcessGroupMember(e,t){let n=/^(\d+) \([\s\S]*\) (\S) (\d+) (-1|\d+)(?:\s|$)/.exec(t);if(!n||Number(n[1])!==e)throw Error(`Process group census is unavailable`);return{pid:e,ppid:Number(n[3]),pgid:Number(n[4]),state:n[2]}}async function readLinuxProcessGroupMemberAsync(e){let t=await R.readFile(`/proc/${e}/stat`,`utf8`);return{...parseLinuxProcessGroupMember(e,t),startedAt:parseLinuxProcessStat(e,t)?.startedAt??null}}function*readProcessGroupMembers(e,t){let n=t!==void 0;if(process.platform===`linux`){let t=Date.now()+e;for(let e of Je(`/proc`)){if(Date.now()>=t)throw Error(`Process group census exceeded its deadline`);if(!/^\d+$/.test(e))continue;let r=Number(e),i,a,s,c=!1;try{if(i=qe(`/proc/${e}/stat`,`utf8`),n){s=readLinuxProcessUid(r);try{a=qe(`/proc/${e}/cmdline`,`utf8`).split(`\0`).filter(Boolean)}catch(e){let t=process.getuid?.();if(c=s!==void 0&&t!==void 0&&s!==t&&[`EACCES`,`EPERM`].includes(o(e)??``),!c)throw e}}}catch(e){if(r!==process.pid&&[`ENOENT`,`ESRCH`].includes(o(e)??``))continue;throw Error(`Could not classify PID ${r}: process command inspection failed (${o(e)??`unavailable`}).`,{cause:e})}let l=parseLinuxProcessGroupMember(r,i);if(Date.now()>=t)throw Error(`Process group census is unavailable`);if(a?.length===0){let e=Number(i.slice(i.lastIndexOf(`)`)+2).split(/\s+/)[6]);if(!(Number.isInteger(e)&&e&2097152)&&!isPidDefinitelyDead(r)){let e=process.getuid?.();if(s!==void 0&&e!==void 0&&s!==e)c=!0,a=void 0;else throw Error(`Could not classify PID ${r}: live userspace process has no readable arguments.`)}}yield{pid:r,pgid:l.pgid,state:l.state,...a?{command:{ppid:l.ppid,argv:a,...s===void 0?{}:{uid:s}}}:c&&s!==void 0?{command:{ppid:l.ppid,argvUnavailable:!0,uid:s}}:{}}}if(Date.now()>=t)throw Error(`Process group census exceeded its deadline`);return}if(process.platform===`darwin`){for(let r of readDarwinProcessCensus(e)){let e={pid:r.pid,pgid:r.pgid,state:r.state},i;try{i=n?r.state.startsWith(`Z`)||r.pid===0?{argv:[]}:t?.readDarwinCommand(r.pid,r.owner):void 0}catch(t){if(!(t instanceof dt)||t.code!==`incomplete`&&t.code!==`layout-mismatch`)throw t;yield{...e,ppid:r.ppid};continue}(!n||i)&&(yield{...e,...i?{command:{ppid:r.ppid,owner:r.owner,...i}}:{}})}return}if(n)throw Error(`Exact process command census is unavailable on ${process.platform}.`);let r=Date.now()+e,i=V(`/bin/ps`,[`-A`,`-o`,`pid=,pgid=,stat=`],{encoding:`utf8`,timeout:e,maxBuffer:4194304});if(i.error||i.status!==0)throw Error(`Process group census is unavailable`);for(let e of i.stdout.split(`
`)){if(!e.trim())continue;let t=/^\s*(\d+)\s+(\d+)\s+(\S+)\s*$/.exec(e);if(!t)throw Error(`Process group census is unavailable`);let n=Number(t[1]);n!==i.pid&&(yield{pid:n,pgid:Number(t[2]),state:t[3]})}if(n&&Date.now()>=r)throw Error(`Process group census exceeded its deadline`)}function isLiveCensusMember({pid:e,state:t}){return!t.startsWith(`Z`)||process.platform===`linux`&&!isPidDefinitelyDead(e)}function isOwnProcfs(){if(process.platform!==`linux`)return!0;try{return Ye(`/proc/self`)===String(process.pid)}catch{return!1}}function isProcessGroupGoneByCensus(e){if(!isOwnProcfs())return!1;try{for(let t of readProcessGroupMembers(1e3))if(t.pgid===e&&isLiveCensusMember(t))return!1;return!0}catch{return!1}}async function*readLinuxProcessGroupMembersAsync(e){if(process.platform!==`linux`)throw Error(`Asynchronous Linux process census requires Linux`);let t=Date.now()+e;for(let e of await R.readdir(`/proc`)){if(Date.now()>=t)throw Error(`Process group census exceeded its deadline`);if(!/^\d+$/.test(e))continue;let n=Number(e),r;try{r=await R.readFile(`/proc/${e}/stat`,`utf8`)}catch(e){if(n!==process.pid&&[`ENOENT`,`ESRCH`].includes(o(e)??``))continue;throw e}if(Date.now()>=t)throw Error(`Process group census exceeded its deadline`);yield parseLinuxProcessGroupMember(n,r)}if(Date.now()>=t)throw Error(`Process group census exceeded its deadline`)}async function isOwnProcfsAsync(){if(process.platform!==`linux`)return!0;try{return await R.readlink(`/proc/self`)===String(process.pid)}catch{return!1}}async function isProcessGroupGoneByCensusAsync(e){if(!await isOwnProcfsAsync())return!1;try{for await(let t of readLinuxProcessGroupMembersAsync(1e3))if(t.pgid===e&&(!t.state.startsWith(`Z`)||!await isPidDefinitelyDeadAsync(t.pid)))return!1;return!0}catch{return!1}}const nr=it(`openclaw.postgres.pool.self-root`);function startPool(){if(!Re&&_()){let e={threadId:F,owner:p(process.argv[1]??``)};nr.publish(e);let t=new Ie(`openclaw.postgres.pool.self-root`);t.unref(),t.postMessage(e),t.close(),Se(`postgres`).warn(`PostgreSQL worker ${e.owner} (thread ${F}) has no inherited pool; starting its own four I/O services.`)}let e=new SharedArrayBuffer(4),t=Array.from({length:4},()=>({channel:new M,signal:new SharedArrayBuffer(8),peers:[]}));for(let e=0;e<t.length;e++)for(let n=e+1;n<t.length;n++){let{port1:r,port2:i}=new M;t[e].peers.push({port:r,signal:t[n].signal}),t[n].peers.push({port:i,signal:t[e].signal})}let n={services:t.map(({channel:e,signal:t})=>({port:e.port1,signal:t})),allocation:e,nextStep:m.nextStep},r=resolveRuntimeProcessEntrypointUrl(`postgresBridge`),i=resolveRuntimeWorkerThreadExecArgv(r),a=[];m.endpoints=n,m.workers=a;let launch=e=>{let n=t[e],s=new Int32Array(n.signal),c=!1,l=new Le(r,{workerData:{host:n.channel.port2,signal:n.signal,peers:n.peers},transferList:[n.channel.port2,...n.peers.map(({port:e})=>e)],execArgv:i});v(l,r),l.unref(),n.channel.port1.unref(),a[e]=l;let u=new Promise((e,t)=>{l.once(`error`,t),l.once(`exit`,()=>t(/* @__PURE__ */ Error(`PostgreSQL I/O service exited before readiness.${m.nextStep?` Run ${m.nextStep}.`:``}`))),l.once(`message`,()=>e())});u.catch(()=>{}),m.ready[e]=u,l.on(`error`,()=>{}),l.once(`exit`,()=>{c=!0,Atomics.store(s,1,1),Atomics.notify(s,1),o.add(e)}),Promise.resolve(Atomics.waitAsync(s,1,0).value).then(async()=>{c||await l.terminate()})},o=/* @__PURE__ */ new Set;m.refresh=()=>{for(let e of o){o.delete(e);let r={channel:new M,signal:new SharedArrayBuffer(8),peers:[]};t[e]=r,n.services[e]={port:r.channel.port1,signal:r.signal};for(let n=0;n<t.length;n++){if(n===e)continue;let i=t[n],{port1:o,port2:s}=new M;r.peers.push({port:o,signal:i.signal}),a[n].postMessage({watch:{port:s,signal:r.signal}},[s])}launch(e)}};try{for(let e=0;e<t.length;e++)launch(e)}catch(e){throw h(),e}return n}function getPostgresPool(){return m.nextStep||m.refresh?.(),m.endpoints??startPool()}function createPostgresPoolEndpoints(e=g()){if(!m.endpoints&&(!e||!Object.values(e.effectiveEngines).includes(`postgres`)))return;let t=getPostgresPool();return{...t,services:t.services.map(({port:e,signal:t})=>{let n=new M;return e.postMessage({host:n.port2},[n.port2]),{port:n.port1,signal:t}})}}function postgresPoolTransferList(e){return e?.services.map(({port:e})=>e)??[]}function selectPostgresPoolService(){let e=getPostgresPool(),t=(Atomics.add(new Uint32Array(e.allocation),0,1)>>>0)%4;return{...e.services[t],nextStep:e.nextStep}}function isNativeCommitReceipt(e){return i(e)&&e.version===1&&typeof e.sequence==`number`&&Number.isSafeInteger(e.sequence)&&e.sequence>=1&&Object.hasOwn(e,`facts`)}function isNativeSettlementReceipt(e){return i(e)&&(e.kind===`completed`||e.kind===`unknown`)&&(e.committed===void 0||isNativeCommitReceipt(e.committed))}d(Symbol.for(`openclaw.sqliteWorkerNativeCommitReceipts`),()=>/* @__PURE__ */ new WeakMap);function resolveSqliteWorkerFinishSettlement(e,t,n){return e??(n===`not-entered`&&!t?{kind:`completed`}:void 0)}const rr=d(Symbol.for(`openclaw.sqliteWorkerOperationAdmission`),()=>new I);function createSqliteWorkerNativeReceiptOwner(e,t){let n=[],r=!1,a,o=0,s,invalidProtocol=e=>t(new ne(`SQLite worker ${e} is invalid`,`outcome-unknown`)),installCommitted=i=>{if(i.sequence<=o)return;o=i.sequence;let s={facts:i.facts};a=s,r=!0;try{e(()=>{for(let e of n)e(s)})}catch(e){t(Object.assign(new ne(`SQLite committed facts publication failed`,`outcome-unknown`),{cause:e}))}finally{r=!1}};return{get committed(){return a},get settlement(){return s},get observingCommit(){return r},observe(e){n.push(e)},receive(e){if(i(e)&&e.kind===`native-commit`){let t=e.committed;return isNativeCommitReceipt(t)?(installCommitted(t),!0):(invalidProtocol(`commit receipt`),!0)}if(i(e)&&e.kind===`native-settlement`){let t=e.settlement;return isNativeSettlementReceipt(t)?(t.committed!==void 0&&installCommitted(t.committed),s={kind:t.kind,...a?{committed:a}:{}},!0):(invalidProtocol(`native settlement`),!0)}return!1},finish(e){s=resolveSqliteWorkerFinishSettlement(s,a,e),r?queueMicrotask(()=>{n.length=0}):n.length=0}}}export{fn as $,withSqliteInspectionOperation as $t,childCapacityError as A,captureSqliteWorkerEnvironmentData as An,observeSqliteNativeClose as At,assertChildRuntimeAvailable as B,isBunRuntime as Bn,withSqlitePostCommitPublications as Bt,captureWorkerStartObserver as C,resolveSqliteDatabaseFilePath as Cn,settleSqliteDatabaseAdmissionPublication as Ct,holdPipe as D,notifyListeners as Dn,observeSqliteTransactionState as Dt,brokerSpawnOptions as E,sqlPublicationAnchor as En,finishSqliteReadScope as Et,Hn as F,resolveRuntimeProcessEntrypointUrl as Fn,hasSqlitePostCommitScope as Ft,beginSqliteDatabaseWrite as G,isStateDatabaseAdmissionClosedError as Gt,observeChildRuntime as H,resolveRuntimeScriptPosition as Hn,isSqliteCorruptionError as Ht,createWorkerComputeCapacity as I,resolveRuntimeWorkerArgv as In,prepareSqliteTransactionCommit as It,discardSqliteDatabaseTransactionAdmissions as J,readSqliteInspectionOperation as Jt,bindSqliteDatabaseAdmission as K,markSqliteInspectionOperation as Kt,captureRuntimeWorkerSource as L,resolveRuntimeWorkerThreadExecArgv as Ln,publishSqliteCommittedState as Lt,isWorkerIdleForPressure as M,getSqliteRuntimeCapabilities as Mn,canPreserveTransactionSnapshot as Mt,joinOwnedWorkerTasks as N,withSelectedSqliteLibraryEnv as Nn,deferSqlitePostCommitPublication as Nt,restoreStdinPipe as O,registerListener as On,Zt as Ot,WorkerTaskError as P,readProcessMachineIdentity as Pn,discardSqliteTransactionState as Pt,_n as Q,sqlitePrimaryResultCode as Qt,resolveRuntimeWorkerGenerationUrl as R,resolveRuntimeWorkerUrl as Rn,stageSqliteCommittedPublication as Rt,resolveDiagnosticProcessEnv as S,beginSqliteDatabaseAdmissionOperation as Sn,revokeSqliteDatabaseAdmissionsForPath as St,BrokerChild as T,isPostgresSqlConnection as Tn,trackSqliteDatabaseAdmissionWorker as Tt,prepareChildRuntimeFailure as U,mt as Un,isSqliteLockError as Ut,classifyChildRuntimeFailure as V,isNodeRuntime as Vn,formatSqliteReadOnlyInspectionFailure as Vt,getSpawnBroker as W,ht as Wn,isSqliteNativeOpenFailure as Wt,pn as X,sqliteErrorCode as Xt,finishSqliteDatabaseWrite as Y,recordSqliteSnapshotFailure as Yt,dn as Z,sqliteExtendedResultCode as Zt,isPidDefinitelyDead as _,normalizeSqlWhitespace as _n,an as _t,postgresPoolTransferList as a,formatErrorMessage as an,mn as at,readLinuxProcessStat as b,readTableConstraintKeyword as bn,retireSqliteDatabaseAdmissionForPath as bt,isOwnProcfsAsync as c,createSqliteIndexContract as cn,prepareSqliteDatabaseCleanClose as ct,readLinuxProcessGroupMemberAsync as d,extractSqliteTableSchema as dn,on as dt,withSqliteNativeOpen as en,hasPendingSqliteDatabaseSchemaMutation as et,readLinuxProcessGroupMembersAsync as f,findSqlCharacter as fn,un as ft,isPidAlive as g,normalizeSqlIdentifier as gn,releaseSqliteDatabaseAdmission as gt,getProcessInstanceStartTime as h,normalizeSchemaSql as hn,recordSqliteDatabaseIntegrity as ht,getPostgresPool as i,requireNodeSqlite as in,Sn as it,WorkerTaskPoolCore as j,ensureSqliteLibrarySelected as jn,observeSqliteNativeOperations as jt,SpawnBrokerError as k,captureSqliteWorkerClosePolicy as kn,Qt as kt,isProcessGroupGoneByCensus as l,createSqliteTableContract as ln,publishSqliteDatabaseAdmission as lt,getFileLockProcessStartTime as m,hasUnquotedSqlKeyword as mn,Mn as mt,rr as n,Ft as nn,invalidateLocalSqliteSchemaAdmissions as nt,selectPostgresPoolService as o,At as on,J as ot,readProcessGroupMembers as p,findSqlClosingParenthesis as pn,sn as pt,captureSqliteDatabaseDescriptorCustodyLocations as q,markSqliteNativeOpenFailure as qt,createPostgresPoolEndpoints as r,installSqliteNativeRuntimeAdmission as rn,yn as rt,isOwnProcfs as s,jt as sn,nn as st,createSqliteWorkerNativeReceiptOwner as t,It as tn,bn as tt,isProcessGroupGoneByCensusAsync as u,parseSqliteTableDefinition as un,publishSqliteDatabaseSchemaChange as ut,isPidDefinitelyDeadAsync as v,quoteSqliteIdentifier as vn,xn as vt,trackWorkerRequest as w,assertSyncTransactionResult as wn,suspendSqliteDatabaseAdmission as wt,mergeProcessEnv as x,splitSqlList as xn,revokeSqliteDatabaseAdmissions as xt,parseLinuxProcessStat as y,readSqlToken as yn,rn as yt,resolveNodeCompileCacheEnv as z,runtimeNeedsTypeScriptLoader as zn,stageSqliteTransactionState as zt};