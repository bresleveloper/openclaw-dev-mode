import{h as e,i as t,m as n,n as r,u as i}from"./plugin-preparation-record-coerce-CWNcHDAn.mjs";import{n as a,t as o}from"./plugin-preparation-error-graph-internal-3EGECs5H.mjs";import{$ as s,K as c,X as l,Y as u,h as d,q as f}from"./plugin-preparation-diagnostic-events-BBFkxUw0.mjs";import{c as p,k as ee,m,r as h,t as g}from"./plugin-preparation-subsystem-DCCMxG-8.mjs";import{p as _}from"./plugin-preparation-sleep-CRBpn7C6.mjs";import{r as v}from"./plugin-preparation-runtime-process-manifest-BNtrgdg-.mjs";import{n as te,t as ne}from"./plugin-preparation-utf8-truncate-DvnUPaRb.mjs";import{t as y}from"./plugin-preparation-deferred-B75K7ut7.mjs";import"./plugin-preparation-src-f3atoZzb.mjs";import{i as re,r as ie,t as ae}from"./plugin-preparation-cli-invocation-CQPKFT_h.mjs";import{n as oe}from"./plugin-preparation-runtime-process-entrypoints-NpKqpXJf.mjs";import{i as se,n as ce,r as le,t as ue}from"./plugin-preparation-runtime-worker-url-D-YZ5wuH.mjs";import{t as de}from"./plugin-preparation-errors-CAYZ0uwP.mjs";import{_ as fe,a as pe,c as me,d as he,g as ge,h as _e,i as ve,l as ye,m as b,n as be,p as xe,r as Se,t as Ce,u as x}from"./plugin-preparation-child-DTA443pF.mjs";import{a as we,d as S,f as C,l as Te,n as Ee,o as De,s as Oe,t as ke}from"./plugin-preparation-service-child-group-ownership-BBRv0PXM.mjs";import{createRequire as Ae}from"node:module";import{MessageChannel as je,MessagePort as Me,SHARE_ENV as Ne,Worker as w,getEnvironmentData as T,isMainThread as E,receiveMessageOnPort as D,setEnvironmentData as O,threadId as k}from"node:worker_threads";import{AsyncLocalStorage as A}from"node:async_hooks";import{createHash as Pe,createHmac as Fe,randomBytes as Ie,randomUUID as Le}from"node:crypto";import j,{accessSync as Re,constants as ze,existsSync as Be,fstatSync as Ve,readFileSync as He,readdirSync as Ue,realpathSync as We,statSync as Ge}from"node:fs";import Ke,{realpath as qe,rm as Je,stat as Ye}from"node:fs/promises";import Xe,{tmpdir as Ze}from"node:os";import M,{basename as Qe,join as $e,posix as et}from"node:path";import{fileURLToPath as N,pathToFileURL as tt}from"node:url";import{normalizeWindowsPathForComparison as nt}from"@openclaw/fs-safe/path";import{isPromise as rt}from"node:util/types";import{isDeepStrictEqual as it,toUSVString as at,types as ot}from"node:util";import{deserialize as P,serialize as F,setFlagsFromString as st}from"node:v8";import{channel as ct}from"node:diagnostics_channel";import{execFile as lt,spawn as ut,spawnSync as dt}from"node:child_process";import{parse as ft}from"semver";import{Socket as I,connect as pt}from"node:net";import{setTimeout as mt}from"node:timers/promises";import{EventEmitter as ht}from"node:events";const L=`openclaw.sqliteDatabaseAdmissions.v1`;function changedAdmissionEntries(e,t){let n=/* @__PURE__ */ new Map;for(let[r,i]of e)t.get(r)!==i&&n.set(r,i);return n}function changedAdmissionWriteScopes(e,t){let n=/* @__PURE__ */ new Map;return e.forEach((e,r)=>{e!==t[r]&&e.forEach((e,i)=>{t[r].get(i)!==e&&n.set(i,e)})}),n}const gt=process.platform!==`linux`&&process.platform!==`android`;function databaseFileIdentityKey(e){return`${e.dev}:${e.ino}`}function readDatabaseIdentityBirthtime(e){return gt?e.birthtimeNs.toString():`0`}function normalizeDatabasePath(e){let t=process.platform===`win32`?ee(e):e;return process.platform===`win32`&&!/^(?:[a-z]:[\\/]|[\\/]{2})/iu.test(t)?e:t}function readDatabaseFileIdentity(e){if(!e||typeof e!=`object`||Array.isArray(e)||!(`key`in e)||typeof e.key!=`string`||!/^file:(?:0|[1-9]\d{0,19}):(?:0|[1-9]\d{0,19})$/.test(e.key)||`birthtime`in e&&e.birthtime!==void 0&&(typeof e.birthtime!=`string`||!/^-?(?:0|[1-9]\d{0,29})$/.test(e.birthtime)))throw Error(`SQLite snapshot requires a captured physical file identity`);return{key:e.key,...`birthtime`in e&&typeof e.birthtime==`string`?{birthtime:e.birthtime}:{}}}function assertDatabaseFileIdentity(e,t){if(!e.isFile()||`file:${databaseFileIdentityKey(e)}`!==t.key||t.birthtime!==void 0&&readDatabaseIdentityBirthtime(e)!==t.birthtime)throw Error(`SQLite database file identity changed before existing-only open`)}function existingIdentity(e,t,n){if(!e.isFile())throw Error(`SQLite worker database path must identify a regular file`);if(e.dev!==t.dev||e.ino!==t.ino||readDatabaseIdentityBirthtime(e)!==readDatabaseIdentityBirthtime(t))throw Error(`SQLite database pathname changed during admission`);return{key:`file:${databaseFileIdentityKey(e)}`,canonicalPath:normalizeDatabasePath(n),birthtime:readDatabaseIdentityBirthtime(e)}}function missingAncestorParent(e,t,n){if(!_(n,`ENOENT`))throw n;t.unshift(M.basename(e));let r=M.dirname(e);if(r===e)throw n;return r}function resolveDatabasePathKey(e){let t=M.resolve(e),n=[];for(;;)try{return normalizeDatabasePath(M.join(We.native(t),...n))}catch(e){t=missingAncestorParent(t,n,e)}}function inspectDatabasePathIdentitySync(e){let t=M.resolve(e),n;try{n=Ge(t,{bigint:!0})}catch(e){if(!_(e,`ENOENT`))throw e}if(n){if(!n.isFile())return;let e=resolveDatabasePathKey(t);return existingIdentity(n,Ge(e,{bigint:!0}),e)}let r=resolveDatabasePathKey(t);return{key:`path:${r}`,canonicalPath:r}}function readDatabasePathIdentitySync(e){let t=inspectDatabasePathIdentitySync(e);if(!t)throw Error(`SQLite worker database path must identify a regular file`);return t}function findChangedDatabasePaths(e,t){return[...e].filter(e=>inspectDatabasePathIdentitySync(e)?.key!==t.key)}async function readDatabasePathIdentity(e){let t=await inspectDatabasePathIdentity(e);if(!t)throw Error(`SQLite worker database path must identify a regular file`);return t}async function inspectDatabasePathIdentity(e){let t=await Ye(e,{bigint:!0}).catch(e=>{if(!_(e,`ENOENT`))throw e});if(t){if(!t.isFile())return;try{let n=await qe(e);return existingIdentity(t,await Ye(n,{bigint:!0}),n)}catch(e){throw _(e,`ENOENT`)?Error(`SQLite database pathname changed during admission`,{cause:e}):e}}let n=await resolveDatabasePathKeyAsync(e);return{key:`path:${n}`,canonicalPath:n}}async function resolveDatabasePathKeyAsync(e){let t=[],n=M.resolve(e);for(;;)try{return normalizeDatabasePath(M.join(await qe(n),...t))}catch(e){n=missingAncestorParent(n,t,e)}}function isSoleDatabaseFileDescriptor(e,t){if(process.platform!==`linux`)return!1;try{for(let n of Ue(`/proc/self/fd`))if(/^\d+$/u.test(n)&&Number(n)!==e)try{let e=Ve(Number(n),{bigint:!0});if(e.dev===t.dev&&e.ino===t.ino)return!1}catch(e){if(!_(e,`EBADF`))return!1}return!0}catch{return!1}}function readSqliteDatabaseAdmissionIdentity(e){return`${e.dev}:${e.ino}:${readDatabaseIdentityBirthtime(e)}`}const R={schemaRevision:0,factRevision:1,publicationRevision:2,retired:3,writeRevision:4,hostRevision:5,unscopedWriteRevision:6,writeScopeRevision:7,sealPresent:8},_t=Object.keys(R).length,vt=Symbol.for(`openclaw.sqliteDatabaseAdmission.decodedValue`);function readSqliteDatabaseAdmissionFact(e,t){return e[vt]??={value:t.read?t.read(e.value):e.value},e[vt].value}function admitSqliteDatabaseFactValue(e,t){let n={value:t};return readSqliteDatabaseAdmissionFact(n,e),n}const yt=1048576,bt=s(Symbol.for(`openclaw.sqliteDatabaseWriteScopeRetention`),()=>/* @__PURE__ */ new WeakMap),writeScopeBytes=e=>e.length*2+256;function retainSqliteDatabaseWriteScope(e,t,n){let r=e.writeScopes,i=bt.get(r);i||(i={bytes:[...r.keys()].reduce((e,t)=>e+writeScopeBytes(t),0),retired:/* @__PURE__ */ new Set},bt.set(r,i)),r.delete(t)||(i.bytes+=writeScopeBytes(t)),r.set(t,n),pruneSqliteDatabaseWriteScopes(e)}function pruneSqliteDatabaseWriteScopes(e){let t=bt.get(e.writeScopes);if(t.bytes<=yt)return!1;let n=!1;for(let[r,i]of e.writeScopes)if(!(Atomics.compareExchange(i.state,2,0,-1)>0&&Atomics.load(i.state,1)===0)&&(Atomics.store(i.state,1,1),advanceSqliteDatabaseGeneration(e,`writeScopeRevision`),e.writeScopes.delete(r),t.bytes-=writeScopeBytes(r),t.retired.add(r),n=!0,t.bytes<=yt))break;return n}function readSqliteDatabaseAdmissions(e){return Array.isArray(e)?e:void 0}function isSqliteDatabaseAdmissionRetired(e){return readSqliteDatabaseGeneration(e,`retired`)!==0}function isSqliteDatabaseAdmissionFactCurrent(e,t){return!isSqliteDatabaseAdmissionRetired(e)&&Atomics.load(new Int32Array(t.current),0)===1&&t.revision===readSqliteDatabaseFactRevision(e,t.schemaDependent)}function hasSqliteDatabaseSchemaAdmission(e){let t=e?.facts.get(`sqlite-schema`);return!!(e&&t&&isSqliteDatabaseAdmissionFactCurrent(e,t))}function readSqliteDatabaseFactRevision(e,t){return readSqliteDatabaseGeneration(e,t?`schemaRevision`:`factRevision`)}function readSqliteDatabaseGeneration(e,t){return Atomics.load(new Int32Array(e.generation),R[t])}function advanceSqliteDatabaseGeneration(e,t){return Atomics.add(new Int32Array(e.generation),R[t],1)}function publishSqliteDatabaseFact(e,t,n,r,i){if(isSqliteDatabaseAdmissionRetired(e)||r!==readSqliteDatabaseFactRevision(e,t.schemaDependent))return!1;t.writer===`host`&&advanceSqliteDatabaseGeneration(e,`hostRevision`);let a=e.facts.get(t.name);a&&Atomics.store(new Int32Array(a.current),0,0);let o=new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);return Atomics.store(new Int32Array(o),0,1),e.facts.set(t.name,{...n,revision:r,schemaDependent:t.schemaDependent===!0,lifetime:t.lifetime,publication:i,current:o}),advanceSqliteDatabaseGeneration(e,`publicationRevision`),!0}function revokeSqliteDatabaseAdmissionFacts(e){if(e){for(let t of e.facts.values())Atomics.store(new Int32Array(t.current),0,0);advanceSqliteDatabaseGeneration(e,`schemaRevision`),advanceSqliteDatabaseGeneration(e,`factRevision`)}}const xt=Array.from({length:128},()=>/* @__PURE__ */ new Map);function snapshotWriteScopes(e,t=xt,n){let r=t,i=bt.get(e),visit=(n,a)=>{let o=0;for(let e=0;e<a.length;e++)o=o*31+a.charCodeAt(e)|0;let s=o&xt.length-1,c=!n||Atomics.load(n.state,1)!==0;c&&e.delete(a)&&i&&(i.bytes-=writeScopeBytes(a)),!(c?!t[s].has(a):t[s].get(a)===n)&&(r===t&&(r=t.slice()),r[s]===t[s]&&(r[s]=new Map(t[s])),c?r[s].delete(a):r[s].set(a,n))};if(n)for(let t of n)visit(e.get(t),t);else e.forEach(visit);for(let t of i?.retired??[])visit(e.get(t),t);return i?.retired.clear(),r}function createSqliteDatabaseAdmissionCursor(){return{revision:-1,records:/* @__PURE__ */ new WeakMap}}var SqliteDatabaseAdmissionRegistry=class{constructor(){this.records=/* @__PURE__ */ new Map,this.exchangeCursor=createSqliteDatabaseAdmissionCursor(),this.locations=/* @__PURE__ */ new Map,this.published=/* @__PURE__ */ new Map,this.scopeSweeps=/* @__PURE__ */ new WeakMap,this.descriptors=/* @__PURE__ */ new Map,this.revision=0,this.retainProcessFacts=!0}useConnectionScopedFacts(){this.retainProcessFacts=!1}changeReferences(e,t){let n=e.references.get(k);return n||(n=new SharedArrayBuffer(2*Int32Array.BYTES_PER_ELEMENT),e.references.set(k,n)),Atomics.add(new Int32Array(n),0,t)+t===+(t===1)&&(t===-1&&this.retireUnreferenced(e),this.publish(e),!0)}retireUnreferenced(e){if(k!==0||isSqliteDatabaseAdmissionRetired(e)||[...e.references.values()].some(e=>Atomics.load(new Int32Array(e),0)>0))return;for(let[t,n]of e.facts)this.retainProcessFacts&&n.lifetime===`process`&&isSqliteDatabaseAdmissionFactCurrent(e,n)||e.facts.delete(t);let t=this.descriptors.get(e.identity);t&&(t.facts=e.facts),Atomics.compareExchange(new Int32Array(e.generation),R.retired,0,2),e.writeScopes.clear()}releaseWorker(e){let t=/* @__PURE__ */ new Map;for(let n of this.records.values()){let r=e>0?n.references.get(e):void 0;r&&(Atomics.compareExchange(n.writerDiagnostic,1,e+1,0),Atomics.store(new Int32Array(r),0,-1),this.retireUnreferenced(n),t.set(n,void 0))}t.size>0&&this.publish(t)}observeLocation(e,t){let n=normalizeDatabasePath(M.resolve(e));t===void 0?this.locations.delete(n):this.locations.set(n,t)}forLocation(e){return this.forPathname(normalizeDatabasePath(M.resolve(e)))}prepareLocation(e){let t=normalizeDatabasePath(M.resolve(e));return()=>this.forPathname(t)}forPathname(e){let t=this.locations.get(e),n=t===void 0?void 0:this.records.get(t);return n&&!isSqliteDatabaseAdmissionRetired(n)?n:void 0}forget(e){this.records.delete(e),this.published.delete(e);for(let[t,n]of this.locations)n===e&&this.locations.delete(t)}retainDescriptorCustody(e,t,n){let r=readSqliteDatabaseAdmissionIdentity(n),i=this.descriptors.get(r);if(i&&i.descriptor!==t)throw Error(`SQLite descriptor custody changed during admission`);i||this.descriptors.set(r,{location:e,descriptor:t,file:n,facts:/* @__PURE__ */ new Map})}retainDescriptor(e,t,n){let r=this.descriptors.get(readSqliteDatabaseAdmissionIdentity(n)),i={identity:readSqliteDatabaseAdmissionIdentity(n),physicalIdentity:{key:`file:${n.dev}:${n.ino}`,birthtime:readDatabaseIdentityBirthtime(n)},location:e,descriptor:t,descriptorOwner:0,generationId:Le(),generation:new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT*_t),writerDiagnostic:new Int32Array(new SharedArrayBuffer(125*Int32Array.BYTES_PER_ELEMENT)),writeScopes:/* @__PURE__ */ new Map,writeScopeRevision:0,references:/* @__PURE__ */ new Map,facts:new Map([...r?.facts??[]].filter(([,e])=>Atomics.load(new Int32Array(e.current),0)===1).map(([e,t])=>[e,{...t,revision:0}]))};this.records.set(i.identity,i);let a=r?.descriptor===t?r:{location:e,descriptor:t,file:n,facts:/* @__PURE__ */ new Map};return a.location=e,a.file=n,a.facts=/* @__PURE__ */ new Map,this.descriptors.set(i.identity,a),this.observeLocation(e,i.identity),this.publish(i),i}retireDescriptor(e,t){let n=this.records.get(e),r=this.descriptors.get(e)?.descriptor??n?.descriptor;if(r===void 0)return!1;let i=j.fstatSync(r,{bigint:!0});return i.nlink>1n||t.requireSoleDescriptor&&!isSoleDatabaseFileDescriptor(r,i)?!1:(n&&Atomics.store(new Int32Array(n.generation),R.retired,1),j.closeSync(r),this.descriptors.delete(e),this.forget(e),this.publish(),!0)}publish(e,t){let n=e instanceof Map;if(!e||n||this.records.get(e.identity)===e){for(let r of this.records.values()){if(isSqliteDatabaseAdmissionRetired(r)){readSqliteDatabaseGeneration(r,`retired`)===1&&this.descriptors.delete(r.identity),this.forget(r.identity);continue}if(e&&e!==r&&!(n&&e.has(r)))continue;let i=e===r||n;for(let[e,t]of r.references)Atomics.load(new Int32Array(t),0)<0&&(r.references.delete(e),i=!0);let a=this.published.get(r.identity),o=readSqliteDatabaseGeneration(r,`writeScopeRevision`),s=a&&e?n?e.get(r):t:void 0,c=s===void 0&&this.scopeSweeps.get(r)!==o,l=snapshotWriteScopes(r.writeScopes,a?.writeScopes,s??(c?void 0:[]));if(c&&this.scopeSweeps.set(r,o),i||=l!==a?.writeScopes,!i)continue;k===0&&(r.writeScopeRevision=readSqliteDatabaseGeneration(r,`writeScopeRevision`));let{writeScopes:u,...d}=r,f={...d,facts:new Map(r.facts),references:new Map(r.references),hostRevision:k===0?readSqliteDatabaseGeneration(r,`hostRevision`):r.hostRevision},p={...f,writeScopes:l.filter(e=>e.size>0)};this.published.set(r.identity,{metadata:f,writeScopes:l,snapshot:p})}this.revision++,O(L,[...this.published.values()].map(e=>e.snapshot))}}capture(e,t){let n=t?/* @__PURE__ */ new Set([...t.admissions?.map(e=>e.identity)??[],...t.location===void 0?[]:[this.forLocation(t.location)?.identity].filter(e=>e!==void 0)]):void 0;if(!n&&!e&&this.publish(),!n&&e?.revision===this.revision)return[];let r=n?[...n].flatMap(e=>{let t=this.published.get(e);return t&&!isSqliteDatabaseAdmissionRetired(t.snapshot)?[t]:[]}):[...this.published.values()];return e?(n||(e.revision=this.revision),r.flatMap(t=>{let n=e.records.get(t.metadata.generation);return n===t?[]:(e.records.set(t.metadata.generation,t),[n?{...t.metadata,facts:changedAdmissionEntries(t.metadata.facts,n.metadata.facts),writeScopes:[changedAdmissionWriteScopes(t.writeScopes,n.writeScopes)],references:changedAdmissionEntries(t.metadata.references,n.metadata.references)}:t.snapshot])})):r.map(e=>e.snapshot)}captureExchange(e,t){return t&&typeof t!=`string`&&isSqliteDatabaseAdmissionRetired(t)?[{...t,facts:/* @__PURE__ */ new Map,writeScopes:[],references:/* @__PURE__ */ new Map}]:this.capture(this.exchangeCursor,e)}resetExchangeCursor(){this.exchangeCursor=createSqliteDatabaseAdmissionCursor()}install(e){let t=/* @__PURE__ */ new Map;for(let n of e){let e=this.records.get(n.identity);if(n.descriptorOwner!==0||isSqliteDatabaseAdmissionRetired(n)){e&&isSqliteDatabaseAdmissionRetired(e)&&t.set(e,void 0);continue}let r=!1;if(e&&isSqliteDatabaseAdmissionRetired(e)&&(e=void 0),!e)e={...n,facts:new Map(n.facts),writeScopes:/* @__PURE__ */ new Map,references:new Map(n.references),hostRevision:void 0},this.records.set(n.identity,e),this.observeLocation(n.location,n.identity),r=!0;else if(e.generationId!==n.generationId)continue;!e.cleanCloseRefusal&&n.cleanCloseRefusal&&(e.cleanCloseRefusal=n.cleanCloseRefusal,r=!0);for(let[t,i]of n.facts)isSqliteDatabaseAdmissionFactCurrent(n,i)&&e.facts.get(t)?.publication!==i.publication&&(e.facts.set(t,i),r=!0);let i=t.get(e)??[];for(let t of n.writeScopes)for(let[n,a]of t){if(Atomics.load(a.state,1)!==0)continue;let t=e.writeScopes.get(n);if(!(t?.identity===a.identity||k===0&&t&&Atomics.load(t.state,1)===0)){if(k===0){let t=advanceSqliteDatabaseGeneration(e,`writeScopeRevision`);this.scopeSweeps.get(e)===t&&this.scopeSweeps.set(e,t+1|0)}retainSqliteDatabaseWriteScope(e,n,a),i.push(n),r=!0}}let a=readSqliteDatabaseGeneration(e,`writeScopeRevision`);(k===0||n.writeScopeRevision===a)&&(r||=e.writeScopeRevision!==a,e.writeScopeRevision=a);for(let[t,i]of n.references)!e.references.has(t)&&Atomics.load(new Int32Array(i),0)>=0&&(e.references.set(t,i),r=!0);k!==0&&n.hostRevision!==void 0&&n.hostRevision!==e.hostRevision&&n.hostRevision===readSqliteDatabaseGeneration(e,`hostRevision`)&&(e.hostRevision=n.hostRevision,r=!0),this.retireUnreferenced(e),(r||isSqliteDatabaseAdmissionRetired(e))&&t.set(e,i.length>0?i:void 0)}return t.size>0&&this.publish(t),t.size>0}};const z=s(Symbol.for(`openclaw.sqliteDatabaseAdmissions`),()=>({registry:new SqliteDatabaseAdmissionRegistry,descriptorPreparation:Promise.resolve(),connections:/* @__PURE__ */ new WeakMap,openedIdentities:/* @__PURE__ */ new WeakMap,unproven:/* @__PURE__ */ new WeakSet,suspended:/* @__PURE__ */ new WeakSet,local:/* @__PURE__ */ new WeakMap,rolledBack:/* @__PURE__ */ new WeakSet,dataWriters:/* @__PURE__ */ new WeakMap,localWriteRevisions:/* @__PURE__ */ new WeakMap,writeListeners:/* @__PURE__ */ new WeakMap,ddlRevisions:/* @__PURE__ */ new WeakMap,schemaDirty:/* @__PURE__ */ new WeakSet,localSchemaRevisions:/* @__PURE__ */ new Map,misses:/* @__PURE__ */ new WeakMap,exchange:new A,exchanging:!1,publication:0}));function captureSqliteDatabaseAdmissions(e,t){return z.registry.capture(e,t)}function installSqliteDatabaseAdmissions(e){z.registry.install(e)}function exchangeSqliteDatabaseAdmission(e,t,n=!1,r){let i=z.exchange.getStore();if(i&&!z.exchanging){z.exchanging=!0;try{let a=typeof e==`string`?{location:e}:{admissions:[e]},o=z.registry.captureExchange(a,e);if(n&&o.length===0)return;installSqliteDatabaseAdmissions(i(o,typeof e==`string`?e:void 0,t,r))}catch(e){throw z.registry.resetExchangeCursor(),e}finally{z.exchanging=!1}}}function withSqliteDatabaseAdmissionExchange(e,t){return z.exchange.run(e,t)}function canShareSqliteDatabaseAdmissions(){return k===0||z.exchange.getStore()!==void 0}const St=readSqliteDatabaseAdmissions(T(L));St&&(installSqliteDatabaseAdmissions(St),z.registry.captureExchange());const Ct=Symbol.for(`openclaw.sqliteWorkerErrorCode`);var SqliteWorkerError=class extends Error{constructor(e,t){super(e),this.code=t,this.name=`SqliteWorkerError`,Object.defineProperty(this,Ct,{value:t})}};function wrapSqliteWorkerError(t,n,...r){let i=r.filter(e=>e!==void 0).map(n=>e(n,t)).filter((e,t,n)=>n.findIndex(t=>it(t,e))===t);return Object.assign(n===void 0?Error(t):new SqliteWorkerError(t,n),{cause:i.length>1?AggregateError(i,t):i[0]})}function retainSqliteWorkerErrorCode(e,t){let n;try{n=Object.getOwnPropertyDescriptor(t,Ct)?.value}catch{return e}return(n===`closed`||n===`overloaded`||n===`unavailable`||n===`outcome-unknown`)&&(Object.defineProperty(e,Ct,{value:n}),Object.assign(e,{code:n})),e}const B=s(Symbol.for(`openclaw.sqliteDatabaseAdmissionWait`),()=>new A);function withSqliteDatabaseAdmissionWait(e,t){let n={wait:e,parent:B.getStore(),active:!0},close=()=>{n.active=!1},r=!1;try{let e=B.run(n,t);return rt(e)&&(r=!0,e.then(close,close)),e}finally{r||close()}}function withSqliteDatabaseAdmissionSettlement(e){return withSqliteDatabaseAdmissionWait({settlesCancellation:!0,deadlineAtMs:Date.now()+1e4},e)}function readSqliteDatabaseAdmissionDeadline(){let e;for(let t=B.getStore();t;t=t.parent){if(!t.active)continue;let n=t.wait.deadlineAtMs;if(n!==void 0&&(e=Math.min(e??1/0,n)),t.wait.settlesCancellation)break}return e}function assertSqliteDatabaseAdmissionWaitActive(){try{for(let e=B.getStore();e;e=e.parent)if(e.active){if(e.wait.settlesCancellation)return;e.wait.assertActive?.()}}catch(e){throw wrapSqliteWorkerError(`SQLite admission facts exchange cancelled by its caller`,`unavailable`,e)}}function hasSqliteDatabaseAdmissionWait(){return B.getStore()!==void 0}const V=s(Symbol.for(`openclaw.sqliteReaderMetrics`),()=>({counters:/* @__PURE__ */ new Map,listeners:/* @__PURE__ */ new Set,workers:/* @__PURE__ */ new Map,operations:/* @__PURE__ */ new Set,retired:/* @__PURE__ */ new Map}));function observeSqliteReaderCounters(e){V.listeners.add(e);for(let t of V.counters.values())e(t);return()=>V.listeners.delete(e)}function accumulateSqliteReaderCounters(e,t){for(let n of t){let t=n.operation,r=e.get(t);r||(r={operation:t,count:0,readBytes:0},e.set(t,r)),r.count+=Number(Atomics.load(n.values,0)),r.readBytes+=Number(Atomics.load(n.values,1))}}function receive(e,t){let{operation:n,values:r}=t,i=V.operations.has(n)||V.operations.size<256?n:`other`;V.operations.add(i);let a=V.workers.get(e);a||(a=/* @__PURE__ */ new Map,V.workers.set(e,a)),a.set(n,{operation:i,values:r})}function retire(e){let t=V.workers.get(e);t&&(accumulateSqliteReaderCounters(V.retired,t.values()),V.workers.delete(e))}const wt=new u(Symbol.for(`openclaw.sqliteReaderOwners`)),H=s(Symbol.for(`openclaw.sqliteReaderConnections`),()=>({nextId:0,byDatabase:/* @__PURE__ */ new WeakMap,byPath:/* @__PURE__ */ new Map,finalizer:new FinalizationRegistry(e=>forgetConnection(e))}));function sqliteReaderDatabasePathKey(e){let t=M.resolve(e);return process.platform===`win32`?nt(t):t}function boundedOperation(e){return(e.trim()||`sqlite reader`).slice(0,120)}function currentSqliteOperationTiming(){return wt.getStore()?.timing}function currentOwner(e,t){let n=t??wt.getStore();return{operation:boundedOperation(n?.operation??e),ownerKind:n?.ownerKind??(E?`main`:`worker`),...n?.actorId===void 0?{}:{actorId:n.actorId}}}function connectionFor(e){let t=H.byDatabase.get(e);if(!t){let n=Date.now(),r=e.location();t={id:++H.nextId,path:r?sqliteReaderDatabasePathKey(r):void 0,database:new WeakRef(e),owner:currentOwner(`sqlite connection`),openedAtMs:n,readers:/* @__PURE__ */ new Map},H.byDatabase.set(e,t),H.finalizer.register(e,t,t)}if(t.path){let e=H.byPath.get(t.path)??/* @__PURE__ */ new Map;e.set(t.id,t),H.byPath.set(t.path,e)}return t}function forgetConnection(e){if(e.path){let t=H.byPath.get(e.path);t?.delete(e.id),t?.size===0&&H.byPath.delete(e.path)}}function registerSqliteReaderConnection(e){e.isOpen&&connectionFor(e)}const Tt=/* @__PURE__ */ `admit,audit.events.list,audit.writer.process,audit.writer.prune,database.domain.bind,database.domain.close,database.domain.publish,database.prepareWrite,database.walMaintenance,localWorkspace.prepare,localWorkspace.pruneLegacy,localWorkspace.beginSweep,localWorkspace.finishSweep,localWorkspace.sweepBatch,localWorkspace.mutate,localWorkspace.manifest,localWorkspace.readBacking,localWorkspace.sweepCandidates,localWorkspace.reviewBase,localWorkspace.byProjectionPath,localWorkspace.exists,localWorkspace.get,stateLease.acquire,stateLease.release,stateLease.renew,stateLease.verify,worktrees.assertPredicates,worktrees.delete,worktrees.slotCount,worktrees.pendingSlots,worktrees.reservePending,worktrees.releasePending,worktrees.insert,worktrees.update,worktrees.claimRemoval,worktrees.finalizeRemoval,worktrees.abortRemoval,worktrees.findLiveByOwner,worktrees.get,worktrees.sessionBinding,worktrees.findLiveByPath,worktrees.list,worktrees.liveIds,worktrees.provisionedPaths,worktrees.provisionedState,worktrees.provisionedChunk,worktrees.writeProvisionedSnapshot,worktrees.retireMissing,worktrees.deferCleanup,worktrees.admitRunLease,worktrees.releaseRunLease,worktrees.reapRunLeases,worktrees.reserveCapacity,worktrees.recoverPending,worktrees.templates.read,worktrees.templates.has,worktrees.templates.list,worktrees.templates.reserve,worktrees.templates.ready,worktrees.templates.delete,worktrees.templates.retainReader,worktrees.templates.releaseReader,worktrees.templates.hasReaders`.split(`,`),Et=/* @__PURE__ */ `acp.acpSessions.agentDatabaseDeletion.agentDatabaseRegistry.agentDatabases.agentDeletionJournal.agentProvenance.apns.audit.authProfiles.backup.bootstrap.capture.channelIngress.templates.config.conversation.conversationBindings.database.deliveryQueue.deviceAuth.deviceIdentity.devicePairing.diagnostic.doctor.exec-approvals.execApprovals.generatedHtmlProvenance.githubPublication.githubRepository.legacyMcpOAuth.localWorkspace.managedImages.mcpOAuth.mentions.modelCatalog.nativeHookRelay.node.nodeHost.nodeWorker.onboardingRecommendations.operator.operatorApprovals.pairing.placementJournals.placementTools.placementTranscript.placementTurns.pluginBlob.pluginModelCatalogCredentials.plugins.preparedPoolPresence.projects.promotions.repositoryWorkspaces.restartSentinel.sandboxRegistry.secrets.sessionDelivery.sessionGroups.sessionRepositoryWorkspaces.sessionState.sessionUpstream.skillLibrary.skillUploads.skills.stateLease.subagents.telemetry.tts.tui.updateRuns.usageCache.userModelAccounts.userPreferences.userProfiles.webPush.workerEnvironments.workerInference.workerPlacements.workers.workspace.workshop.worktrees`.split(`.`),Dt=/* @__PURE__ */ new Set([...Tt,...Et]);function classifySqliteWorkerExecute(e){if(Dt.has(e))return e;let t=e.indexOf(`.`),n=t===-1?e:e.slice(0,t);return Dt.has(n)?n:`execute`}const Ot=/* @__PURE__ */ new Set(/* @__PURE__ */ `abortedPartial,acceptIntent,add,append,appendChunk,assistant,batch,boards.applyOps,boards.grant,boards.putWidget,cache.clear,cache.prune,cache.read,cache.retire,cache.stage.start,cache.write,cache.write.inline,cancel,catalog.pruneRemovedProviders,catalog.removeCredentials,catalog.replace,category.apply,category.prepare,claim,complete,connection.inspect,create,delete,deleteChunk,discardIntent,discover,enqueueIntent,finalize,finish,forget.mark,forget.purge,hasPending,index.facts,index.upgradeProviderKey,index.writeMetadata,involvement,list,listPendingSessions,match,owner.assign,participant,preflight,prepare,prepareRun,prune,publishClosedTurn,put,readNextPending,record,recordFailure,remove,reserve,schema.admit,source.chunks,source.delete,source.hash,source.refresh,source.replace,source.replace.group,source.replace.inline,source.state,stage.append,stage.discard,stage.start,suggestion.add,suggestion.claim,suggestion.finalize,suggestion.release,sweep,vector.ensure,vector.prepare,devicePairing.ensureToken,devicePairing.list,devicePairing.lookup,devicePairing.updateMetadata,devicePairing.updatePresence,devicePairing.verifyToken,session.actor.acceptInput,session.actor.adoptRun,session.actor.appendToolResult,session.actor.appendTranscriptEvent,session.actor.completeTurn,session.actor.deliveryPending,session.actor.deliverySettled,session.actor.patch,session.actor.read,session.agentPurge.commit,session.agentPurge.prepare,session.archivePruning.deletePublished,session.archivePruning.pruneRetention,session.archivePruning.reclaimPages,session.archivePruning.removeLegacy,session.archives.preparePublication,session.archives.recordPublication,session.entries.replace,session.entry.acp,session.entry.patch.commit,session.entry.patch.prepare,session.entry.read,session.entry.readResult,session.entry.replacements.commit,session.entry.replacements.prepare,session.goal.mutate,session.lifecycle.delete,session.lifecycle.deletePlan,session.lifecycle.project,session.lifecycle.reset,session.maintenance.finalize,session.maintenance.metadata,session.maintenance.prepare,session.maintenance.size,session.messageCut.commit,session.messageCut.fork,session.messageCut.preflight,session.messageRewrite.commit,session.messageRewrite.modelPrompt,session.messageRewrite.prepare,session.metadata.append,session.metadata.initialize,session.metadata.mutation,session.nativeBindings.delete,session.parentFork.commit,session.parentFork.prepare,session.parentFork.source,session.pendingInputs.mutate,session.pendingInputs.read,session.pendingInputs.withdraw,session.providerReview.compare,session.reaction.set,session.rowTranscript.backfill,session.turn.commit,session.turn.prepare,trajectory.events.append,trajectory.retention.begin,trajectory.retention.delete,transcript.commit,transcript.prepare,usageCache.prune,usageCache.writeQuarters,usageCache.writeRollup`.split(`,`)),kt=/* @__PURE__ */ new Map([[`preflight`,`transcript-projection.preflight`],[`sweep`,`transcript-projection.sweep`],[`claim`,`transcript-projection.claim`],[`deleteChunk`,`transcript-projection.deleteChunk`],[`appendChunk`,`transcript-projection.appendChunk`],[`finalize`,`transcript-projection.finalize`]]),At=[`/config/sessions/session-transcript-projection-publication.worker.js`,`/config/sessions/session-transcript-projection-publication.worker.ts`],jt=[[`pluginState.`,`plugin_state`],[`session.history.`,`transcript_read`],[`trajectory.`,`transcripts`],[`session.transcript.`,`transcripts`],[`transcripts.`,`transcripts`],[`session.`,`sessions`],[`cron.`,`cron`]];function classifyWorkerRequest(e,n){if(typeof e!=`string`)return`execute`;if(Ot.has(e))return e;if(e===`auth-profile-rows`)return`auth_profiles`;if(e===`database.domain.execute`||e===`database.domain.publish`){let r=t(n)?n:void 0,i=r&&t(r.command)?r.command:void 0,a=r?.moduleUrl;if(e===`database.domain.publish`&&typeof a==`string`&&typeof i?.type==`string`&&At.some(e=>a.endsWith(e))){let e=kt.get(i.type);if(e)return e}let o=i?classifyWorkerRequest(i.type):`execute`;return o===`execute`?`domain_execute`:o}for(let[t,n]of jt)if(e.startsWith(t))return n;return classifySqliteWorkerExecute(e)}const Mt=/* @__PURE__ */ new Set([...Ot,...kt.values(),...Dt,...jt.map(([,e])=>e),`task`,`open`,`close`,`execute`,`domain_execute`,`auth_profiles`]);function normalizeWorkerRequestClass(e){return e!==void 0&&Mt.has(e)?e:`other`}function sampleWorkerAuthorityOperation(e){return E&&normalizeWorkerRequestClass(e).startsWith(`session.actor.`)&&Math.random()<1/128}function recordWorkerAuthorityMessage(e,t,n=sampleWorkerAuthorityOperation(t)){return recordWorkerMessage(e?.kind===`sqlite-database-admissions`?`admission`:`authority`,`from_worker`,typeof e?.payloadBytes==`number`?e.payloadBytes:void 0,t,n?e:void 0),n}function withoutField(e,n){if(!t(e)||!Object.hasOwn(e,n))return e;let r={...e};return delete r[n],r}function recordAuthorityPayload(e,n,r){let i=normalizeWorkerRequestClass(r);if(!i.startsWith(`session.actor.`))return;let a=n.kind===`native-settlement`&&t(n.settlement)?n.settlement.committed:n.committed,o=t(a);if(!o&&!Object.hasOwn(n,`facts`))return;let s=o?[`receipt_entry`,`receipt_events`,`receipt_value`,`receipt_other`]:[`admission_entry`,`admission_other`],c=(e.payloadComponents??={})[i]??={},l,u=o&&typeof n.payloadBytes==`number`?n.payloadBytes:void 0;try{let e=o?a.facts:n.facts;if(u??=F(e).byteLength,o&&t(e)&&t(e.receipt)){let t={...e.receipt,postimage:withoutField(e.receipt.postimage,`entry`)};delete t.entryMetadata;let n={...e,receipt:t},r=Math.min(u,F(n).byteLength),i={...n,receipt:{...n.receipt,transcript:withoutField(withoutField(e.receipt.transcript,`appendedEvents`),`authorityReceipts`)}},a=Math.min(r,F(i).byteLength),o=Math.min(a,F({...i,value:void 0,receipt:{...i.receipt,transcript:withoutField(i.receipt.transcript,`append`)}}).byteLength);l=[u-r,r-a,a-o,o]}else if(!o&&t(e)&&t(e.publication)&&e.publication.kind===`session-actor-admission`){let t=F({...e,publication:{...e.publication,snapshot:withoutField(e.publication.snapshot,`entry`)}}).byteLength;l=[u-t,t]}else l=o?[0,0,0,u]:[0,u];l.some(e=>e<0)&&(l=void 0)}catch{}for(let[e,t]of s.entries()){let n=c[t]??={bytes:0,samples:0,unmeasured:0};l?(n.bytes+=l[e]??0,n.samples++):(n.unmeasured++,t===`receipt_other`&&u!==void 0&&(n.bytes+=u))}}const Nt=s(Symbol.for(`openclaw.workerMessageMetrics`),()=>/* @__PURE__ */ new Map);function recordWorkerMessage(e,t,n,r,i){if(!E)return;let a=Nt.get(e);a||(a={},Nt.set(e,a));let o=a[t]??={kind:e,direction:t,messages:0,payloadBytes:0,unmeasuredMessages:0};if(o.messages++,n===void 0)o.unmeasuredMessages++;else if(o.payloadBytes+=n,e===`sqlite_request`||e===`sqlite_reply`||e===`authority`){let e=o.payloadBytesByRequestClass??={},t=normalizeWorkerRequestClass(r);e[t]=(e[t]??0)+n}i&&e===`authority`&&t===`from_worker`&&recordAuthorityPayload(o,i,r)}function messageData(e){return t(e)&&!ot.isProxy(e)?e:void 0}function dataProperty(e,t){return Object.getOwnPropertyDescriptor(e,t)?.value}function messageBody(e){let t=messageData(e),n=t&&dataProperty(t,`type`);return t&&(n===`post`||n===`message`)?dataProperty(t,`value`):e}function workerMessagePayloadBytes(e){if(!E)return;let t=messageBody(e),n=messageData(t),r=n&&(Object.getOwnPropertyDescriptor(n,`value`)??Object.getOwnPropertyDescriptor(n,`input`));if(r&&!(`value`in r))return;let i=r?r.value:t;if(!ot.isProxy(i)){if(ArrayBuffer.isView(i)||i instanceof ArrayBuffer){let e=n&&dataProperty(n,`type`)===`open`?dataProperty(n,`preparation`):void 0;return i.byteLength+(ArrayBuffer.isView(e)?e.byteLength:0)}if(typeof i==`string`)return i.length*2;if(i==null)return 0}}function messageKind(e,t){let n=messageData(messageBody(e));if(!n)return t;switch(dataProperty(n,`status`)){case`ok`:case`failed`:return`task_reply`;case`request`:return`task_request`;case`notification`:return`task_notification`;case`consumed`:return`task_consumed`;case`memory`:return`memory`;case`ready`:return`lifecycle`}if(typeof dataProperty(n,`taskId`)==`number`)return`task_input`;if(typeof dataProperty(n,`actor`)==`number`)return`sqlite_request`;if(typeof dataProperty(n,`id`)==`number`&&typeof dataProperty(n,`ok`)==`boolean`)return`sqlite_reply`;if(typeof dataProperty(n,`operationId`)==`number`)switch(dataProperty(n,`type`)){case`prepare`:case`reclaim`:case`canonical-validation`:return`sqlite_request`;case`reclaimed`:case`refused`:case`checkpoint`:return`sqlite_reply`;case`admission`:case`admission-request`:case`admission-release`:return`admission`;case`commit-request`:return`authority`}switch(dataProperty(n,`type`)){case`resource-owner`:case`resource-message`:case`resource-closed`:return`resource`;case`cpu`:case`heap`:return`memory`;case`create`:case`created`:case`stop`:case`stopped`:case`close`:case`closed`:case`release`:case`execution-exit`:case`error`:case`messageerror`:case`create-error`:case`stop-error`:case`request-error`:return`lifecycle`}return dataProperty(n,`closeResource`)===!0?`resource`:t}function observeWorkerMessage(e,t,n=`other`,r,i){E&&recordWorkerMessage(messageKind(e,n),t,r===void 0?workerMessagePayloadBytes(e):r??void 0,i)}function canObserveWorkerMessages(e){if(!Object.isExtensible(e))return!1;for(let t of[`postMessage`,`emit`]){let n=e;for(;n;){let e=Object.getOwnPropertyDescriptor(n,t);if(e){if(!e.writable||typeof e.value!=`function`)return!1;break}n=Reflect.getPrototypeOf(n)}if(!n)return!1}return!0}const Pt=`${process.execArgv.join(` `)} ${process.env.NODE_OPTIONS??``}`;E&&!process.versions.bun&&/--max[-_](?:old[-_]space[-_]size(?:[-_]percentage)?|heap[-_]size)(?:=|\s)/u.test(Pt)&&(/--(?:freeze[-_]flags[-_]after[-_]init|(?:abort|exit)[-_]on[-_]contradictory[-_]flags)(?:=(?:true|1))?(?:\s|$)/u.test(Pt)?process.emitWarning(`V8 startup flags prevent enforcing per-worker heap limits.`):st(`--max-old-space-size=0 --max-heap-size=0`));function createRetainedOperation(e,t={}){let n=Promise.withResolvers(),r=Object.freeze({status:`pending`});return t.observeRejection!==!1&&n.promise.catch(()=>void 0),{operation:{result:n.promise,read:()=>r,service:e},resolve(e){r.status===`pending`&&(r=Object.freeze({status:`fulfilled`,value:e}),n.resolve(e))},reject(e){r.status===`pending`&&(r=Object.freeze({status:`rejected`,error:e}),n.reject(e))}}}function driveRetainedOperation(e,t,n){let r=A.snapshot(),i=!1,serviceInContext=()=>r(service),a=createRetainedOperation(serviceInContext);function service(){if(!(i||a.operation.read().status!==`pending`)){i=!0;try{t(a,serviceInContext)}catch(e){try{a.reject(n?n(e):e)}catch(e){a.reject(e)}}finally{i=!1}}}return e.result.then(serviceInContext,serviceInContext),a.operation.service(),a.operation}function mapRetainedOperation(e,t){return driveRetainedOperation(e,n=>{e.service();let r=e.read();r.status===`fulfilled`?n.resolve(t(r.value)):r.status===`rejected`&&n.reject(r.error)})}function flatMapRetainedOperation(e,t){let n;return driveRetainedOperation(e,(r,i)=>{if(!n){e.service();let r=e.read();if(r.status===`pending`)return;if(r.status===`rejected`)throw r.error;n=t(r.value),n.result.then(i,i)}n.service();let a=n.read();a.status===`fulfilled`?r.resolve(a.value):a.status===`rejected`&&r.reject(a.error)})}function readPostgresBridgeCounters(e){return Array.isArray(e)?e.filter(e=>t(e)&&typeof e.threadId==`number`&&Number.isSafeInteger(e.threadId)&&e.threadId!==k&&e.count instanceof Int32Array&&e.count.length===1&&e.count.buffer instanceof SharedArrayBuffer&&(e.selfRootCount===void 0||e.selfRootCount instanceof Int32Array&&e.selfRootCount.length===1&&e.selfRootCount.buffer instanceof SharedArrayBuffer)):[]}function collectPostgresBridgeCounters(e,t,n){let r=/* @__PURE__ */ new Map([[k,{threadId:k,count:e,selfRootCount:n}]]);for(let e of t)for(let t of e.postgresBridgeCounters??[])r.set(t.threadId,t);return[...r.values()]}const Ft=ct(`openclaw.code-mode.gc-storm`),U=s(Symbol.for(`openclaw.workerCpuSources`),()=>(process.on(`worker`,trackWorker),{gcObserver:void 0,postgresBridgeCount:new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)),postgresPoolSelfRootCount:new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)),postgresBridgeObservers:/* @__PURE__ */ new Set,revision:0,cpuSources:void 0,nextPoolId:0,poolIds:/* @__PURE__ */ new WeakMap,workers:/* @__PURE__ */ new Map,lifecycle:/* @__PURE__ */ new Map,taskMetrics:/* @__PURE__ */ new Map}));function createCpuTrackedWorker(e,t,n){let r=f(`worker:${c(e,t?.eval)}`,()=>new w(e,t));return trackNativeWorkerForCpu(r,e,t?.eval),Object.assign(U.workers.get(r),{internalMessages:!0,requestClass:n}),r}function trackNativeWorkerForCpu(e,t,n=!1){trackWorker(e);let r=U.workers.get(e),i=c(t,n);if(r.script!==i&&(r.script===`bridge.worker.js`&&Atomics.sub(U.postgresBridgeCount,0,1),i===`bridge.worker.js`&&Atomics.add(U.postgresBridgeCount,0,1),r.script=i),r.script===`sqlite-store.worker.js`&&attributeWorkerMetrics(r,`writer`),r.script===`code-mode-node.worker.js`&&r.workerSlot===void 0){let e=new Set([...U.workers.values()].map(e=>e.workerSlot));for(let t=1;t<=64;t++)if(!e.has(t)){r.workerSlot=t;break}}r.lifecycleMessages=r.script===`openclaw-state-lease-heartbeat.worker.js`||r.script===`gateway-state-owner-heartbeat.worker.js`}function getTrackedPostgresBridgeCounters(){return collectPostgresBridgeCounters(U.postgresBridgeCount,U.workers.values(),U.postgresPoolSelfRootCount)}function recordPostgresPoolSelfRoot(){return Atomics.compareExchange(U.postgresPoolSelfRootCount,0,0,1)===0}function observeTrackedPostgresBridgeCounters(e){return U.postgresBridgeObservers.add(e),()=>U.postgresBridgeObservers.delete(e)}function publishPostgresBridgeCounters(){for(let e of U.postgresBridgeObservers)e()}function receivePostgresBridgeCounters(e,t){let n=readPostgresBridgeCounters(t),r=e.postgresBridgeCounters;n.length===(r?.length??0)&&n.every((e,t)=>e.threadId===r?.[t]?.threadId)||(e.postgresBridgeCounters=n,publishPostgresBridgeCounters())}function attributeWorkerToPool(e,t,n){let r=U.workers.get(e);if(!r)return;let i=U.poolIds.get(t);i===void 0&&(i=++U.nextPoolId,U.poolIds.set(t,i)),r.poolId=i,attributeWorkerMetrics(r,n,0)}function attributeWorkerMetrics(e,t,n){let r=t===`reader`||t===`file-reader`||t===`compute`||t===`writer`||t===`singleton`?t:`other`,i=`${r}:${e.script}`,a=U.taskMetrics.get(i);a||(a={workerClass:r,script:e.script,tasksCompleted:n,heapUsedHighWaterBytes:0,gc:[]},U.taskMetrics.set(i,a)),e.taskMetrics=a}function forgetWorker(e){let t=U.workers.get(e);if(!t)return;let n=countWorkerStart(t),r=t.retirementReason??`exit`;n.retired.set(r,(n.retired.get(r)??0)+1),t.script===`bridge.worker.js`&&Atomics.sub(U.postgresBridgeCount,0,1),t.memoryFlush?.resolve(),drainWorkerMemoryPort(t),retire(t),t.memoryPort?.close(),U.workers.delete(e),U.revision++,U.cpuSources=void 0,t.postgresBridgeCounters&&publishPostgresBridgeCounters()}function countWorkerStart(e){let t=U.lifecycle.get(e.script);return t||(t={started:0,retired:/* @__PURE__ */ new Map},U.lifecycle.set(e.script,t)),e.started||(e.started=!0,t.started++),t}function markWorkerRetirement(e,t){let n=U.workers.get(e);n&&(n.retirementReason??=t)}function flushWorkerDiagnostics(e,t){let n=U.workers.get(e);if(n?.memoryFlush)return n.memoryFlush.operation;let r=n?.memoryPort;if(!n?.taskMetrics||!r||!U.gcObserver||[`failure`,`cancelled`,`crash`,`gc-thrash`,`gc-storm`,`exit`].includes(t))return;let i=performance.now()+100,a=createRetainedOperation(()=>{drainWorkerMemoryPort(n),performance.now()>=i&&a.resolve()});n.memoryFlush=a;let o=setTimeout(()=>a.resolve(),100);a.operation.result.then(()=>clearTimeout(o));try{r.postMessage({flush:!0}),recordWorkerMessage(`memory`,`to_worker`,1)}catch{a.resolve()}return a.operation}function trackWorker(e){if(U.workers.has(e))return;if(E&&e instanceof w&&recordWorkerMessage(`lifecycle`,`to_worker`),E&&e instanceof w&&canObserveWorkerMessages(e)){let n=Object.getPrototypeOf(e)===w.prototype,i=!n||Object.hasOwn(e,`postMessage`)?e.postMessage:void 0;e.postMessage=function(e,t){let n=r.internalMessages?workerMessagePayloadBytes(e):void 0;(i??w.prototype.postMessage).call(this,e,t),r.lifecycleMessages?recordWorkerMessage(`lifecycle`,`to_worker`,n):r.internalMessages?observeWorkerMessage(e,`to_worker`,`other`,n??null,r.requestClass?.()):recordWorkerMessage(`other`,`to_worker`)};let a=!n||Object.hasOwn(e,`emit`)?e.emit:void 0;e.emit=function(e,...n){if(e===`error`&&r.script===`code-mode-node.worker.js`){let e=n[0];r.retirementReason??=t(e)&&e.code===`ERR_CODE_MODE_GC_THRASH`?`gc-thrash`:`crash`}return e===`message`&&(r.lifecycleMessages?recordWorkerMessage(`lifecycle`,`from_worker`,workerMessagePayloadBytes(n[0])):r.internalMessages?observeWorkerMessage(n[0],`from_worker`,`other`,void 0,r.requestClass?.()):recordWorkerMessage(`other`,`from_worker`)),(a??w.prototype.emit).call(this,e,...n)}}let n=!1,finishCpuUsage=e=>(n=!1,e),failCpuUsage=()=>finishCpuUsage(void 0),r={script:`other`,cpuUsage(){if(n)return Promise.resolve(void 0);n=!0;try{return e.cpuUsage().then(finishCpuUsage,failCpuUsage)}catch{return Promise.resolve(failCpuUsage())}}};U.workers.set(e,r),queueMicrotask(()=>countWorkerStart(r)),U.revision++,U.cpuSources=void 0,e.once(`exit`,()=>forgetWorker(e))}function recordWorkerHeap({taskMetrics:e},t){e&&(e.heapUsedHighWaterBytes=Math.max(e.heapUsedHighWaterBytes,t))}function isWorkerGcObservationEnabled(){return!!U.gcObserver}function recordWorkerGc(e,t){let n=e.taskMetrics;if(n)for(let e of t){if(!e||![`scavenge`,`mark_sweep_compact`,`incremental`,`weak_processing`].includes(e.kind)||!Number.isFinite(e.durationMs)||e.durationMs<0)continue;let t=n.gc.find(t=>t.kind===e.kind);t||(t={kind:e.kind,count:0,durationMs:0,reclaimedBytes:0},n.gc.push(t)),t.count++,t.durationMs+=e.durationMs,Number.isFinite(e.reclaimedBytes)&&e.reclaimedBytes>=0&&(t.reclaimedBytes+=e.reclaimedBytes),n.heapUsedHighWaterBytes=Math.max(n.heapUsedHighWaterBytes,Number.isFinite(e.heapUsedBeforeBytes)?e.heapUsedBeforeBytes:0)}U.gcObserver?.(t,e.script,e.workerSlot)}function drainWorkerMemoryPort({memoryPort:e,memoryReceive:t}){if(e&&t)for(let n=D(e);n;n=D(e))t(n.message)}function receiveWorkerMemoryPort(e,n){if(t(n)&&(n.status===`ok`||n.status===`failed`)&&n.diagnostics===!0){let t=U.workers.get(e);return t?.taskMetrics?.tasksCompleted!==void 0&&t.taskMetrics.tasksCompleted++,!1}if(!t(n)||n.status!==`memory`||!(n.port instanceof Me))return!1;let r=n.port,i=U.workers.get(e);if(!i||i.memoryPort||e.threadId===-1)return r.close(),!0;receivePostgresBridgeCounters(i,n.postgresBridgeCounters),i.memoryPort=r,i.memoryPending=!0;let close=()=>{i.memoryPort=void 0,i.memoryReceive=void 0,i.memoryPending=!1,i.memoryUnavailable=!0,i.memoryFlush?.resolve(),r.close()};return i.memoryReceive=t=>{if(`sqliteReaderCounter`in t)receive(i,t.sqliteReaderCounter),recordWorkerMessage(`memory`,`from_worker`,16);else if(`postgresBridgeCounters`in t)receivePostgresBridgeCounters(i,t.postgresBridgeCounters),recordWorkerMessage(`memory`,`from_worker`);else if(`flushed`in t)recordWorkerMessage(`memory`,`from_worker`,8),recordWorkerHeap(i,t.heapUsed),i.memoryFlush?.resolve();else if(`retireWorkerId`in t)recordWorkerMessage(`memory`,`from_worker`),Ft.publish(t.retireWorkerId);else if(`gcStorm`in t){recordWorkerMessage(`memory`,`from_worker`);let n=e.threadId,a=i.workerSlot;import(`./plugin-preparation-diagnostic-worker-gc-profile-CQLTTD9b.mjs`).then(async({reportWorkerGcStorm:e})=>{let o=await e(t.gcStorm,n,a);o&&i.memoryPort===r&&r.postMessage({captureGcProfile:o})})}else recordWorkerMessage(`memory`,`from_worker`,(`heapUsed`in t?32+(t.heapSizeLimitBytes===void 0?0:8):0)+(`heapUsed`in t&&t.oldGenerationAfterGcBytes!==void 0?8:0)+(`heapUsed`in t?(t.heapSpaces?.length??0)*8:0)+(`heapUsed`in t?t.retainedData?.reduce((e,t)=>e+16+(t.stringBytes===void 0?0:8)+(t.objects===void 0?0:8)+(t.generations===void 0?0:8)+(t.providers===void 0?0:8)+(t.accounts===void 0?0:8)+(t.truncated===void 0?0:1),0)??0:0)+(t.gc?.length??0)*8),t.gc&&recordWorkerGc(i,t.gc),`heapUsed`in t&&(recordWorkerHeap(i,t.heapUsed),delete t.gc,i.heap={value:t,sampledAt:performance.now()},i.memoryPending=!1,i.memoryUnavailable=!1)},r.on(`message`,i.memoryReceive),r.once(`close`,close),r.once(`messageerror`,close),r.unref(),U.gcObserver&&(r.postMessage({gc:!0}),recordWorkerMessage(`memory`,`to_worker`,1)),!0}var SqliteSnapshotCleanupError=class extends Error{},SqliteSnapshotDirectoryBusyError=class extends SqliteSnapshotCleanupError{constructor(...e){super(...e),this.name=`SqliteSnapshotDirectoryBusyError`}};function classifyRetiredSqliteSnapshotRemovalError(e,t){let n=i(t);return t instanceof Error&&`syscall`in t&&(t.syscall===`rmdir`||t.syscall===`unlink`)&&(n===`EBUSY`||n===`ENOTEMPTY`)?new SqliteSnapshotDirectoryBusyError(`SQLite retired snapshot directory removal is busy: ${e}`,{cause:t}):t}var OpenClawStateOwnershipError=class extends Error{},OpenClawStateOwnershipMetadataError=class extends OpenClawStateOwnershipError{constructor(e,t){super(`OpenClaw shared state ownership metadata is invalid at ${e}: ${t}. Repair it with OPENCLAW_SUPERVISOR_MODE=external openclaw database ownership claim --manager <manager-id>.`),this.databasePath=e,this.name=`OpenClawStateOwnershipMetadataError`}},OpenClawStateExternalOwnershipError=class extends OpenClawStateOwnershipError{constructor(e,t){super(`OpenClaw shared state database ${e} is externally supervised by ${t}. Use that external supervisor with OPENCLAW_SUPERVISOR_MODE=external for writable operations.`),this.databasePath=e,this.managerId=t,this.name=`OpenClawStateExternalOwnershipError`}};const It=s(Symbol.for(`openclaw.sqliteCoordinatorError`),()=>class extends Error{constructor(e,t){super(e),this.cause=t,this.name=`SqliteCoordinatorError`}});function createSqliteLifecycleAggregateError(e,t,n){return AggregateError(e,t,{cause:n})}function throwSqliteLifecycleErrors(e,t){if(e.length===1)throw e[0];if(e.length>1)throw createSqliteLifecycleAggregateError(e,t,e[0])}function runWithSqliteCleanup(e,t,n){let r;try{if(r=n(),te(r))throw new It(`${t} must remain synchronous`)}catch(n){try{e.release()}catch(e){throw createSqliteLifecycleAggregateError([n,e],`${t} and resource release both failed`,n)}throw n}try{e.release()}catch(e){throw new It(`${t} completed, but releasing its resource failed`,e)}return r}const Lt=/* @__PURE__ */ new Map;function resolveRuntimeProcessEntrypointUrl(e){return Lt.get(e)??le(oe[e])}const Rt=new Map([EvalError,RangeError,ReferenceError,SyntaxError,TypeError,URIError,Error].map(e=>[e.name,e]));function encodeNativeWorkerFailure(e){let t=/* @__PURE__ */ new Map,encode=e=>{if(!(e instanceof Error))return{kind:`value`,value:e==null||typeof e==`string`||typeof e==`number`||typeof e==`boolean`||typeof e==`bigint`?e:n(e)};let r=t.get(e);if(r)return r;let i={kind:`error`,constructorName:e instanceof AggregateError?`AggregateError`:e instanceof SuppressedError?`SuppressedError`:[...Rt].find(([,t])=>e instanceof t)?.[0]??`Error`,name:e.name,message:e.message,stack:e.stack};t.set(e,i);for(let t=e;t;t=Object.getPrototypeOf(t)){let e=Object.getOwnPropertyDescriptor(t,`code`);if(e){let t=e.value;(typeof t==`string`||typeof t==`number`)&&(i.code=t);break}}for(let t of[`errcode`,`errno`]){let n=Object.getOwnPropertyDescriptor(e,t)?.value;typeof n==`number`&&(i[t]=n)}Object.hasOwn(e,`cause`)&&(i.cause=encode(e.cause));let a=Object.getOwnPropertyDescriptor(e,`errors`)?.value;if(Array.isArray(a)&&(i.errors=a.map(encode)),e instanceof SuppressedError||e.name===`SuppressedError`)for(let t of[`error`,`suppressed`]){let n=Object.getOwnPropertyDescriptor(e,t);n&&`value`in n&&(i[t]=encode(n.value))}return i};return encode(e)}function decodeNativeWorkerFailure(e){let t=/* @__PURE__ */ new Map,decode=e=>{if(e.kind===`value`)return e.value;let n=t.get(e);if(n)return n;let r=Rt.get(e.constructorName)??Error,i=e.constructorName===`AggregateError`?AggregateError([],e.message):e.constructorName===`SuppressedError`?new SuppressedError(void 0,void 0,e.message):new r(e.message);t.set(e,i),i.name=e.name,i.stack=e.stack;let defineField=(e,t,n=!1)=>{Object.defineProperty(i,e,{value:t,writable:!0,configurable:!0,enumerable:n})};for(let t of[`code`,`errcode`,`errno`])e[t]!==void 0&&defineField(t,e[t],!0);e.cause&&defineField(`cause`,decode(e.cause)),e.errors&&defineField(`errors`,e.errors.map(decode));for(let t of[`error`,`suppressed`]){let n=e[t];n&&defineField(t,decode(n))}return i};return decode(e)}const zt=/* @__PURE__ */ Error(`Native worker port validation reached the live sentinel`);zt.stack=void 0;const Bt={get value(){throw zt}};function nativePortIsOpen(e){if(process.versions.bun){let t=e.hasRef();e.unref(),e.ref();let n=e.hasRef();return t||e.unref(),n}try{structuredClone(Bt,{transfer:[e]})}catch(e){if(e===zt)return!0;if(e instanceof DOMException&&e.name===`DataCloneError`)return!1;throw e}throw Error(`Native port validation did not abort serialization`)}const Vt=s(Symbol.for(`openclaw.sqliteInspectionOperations`),()=>/* @__PURE__ */ new WeakMap),Ht=s(Symbol.for(`openclaw.sqliteNativeOpenFailures`),()=>/* @__PURE__ */ new WeakSet);s(Symbol.for(`openclaw.sqliteSnapshotFailureScopes`),()=>new A);function markSqliteNativeOpenFailure(e){typeof e==`object`&&e&&Ht.add(e)}function withSqliteNativeOpen(e){try{return e()}catch(e){throw markSqliteNativeOpenFailure(e),e}}function markSqliteInspectionOperation(e,t){return typeof e==`object`&&e&&!Vt.has(e)&&Vt.set(e,t),e}function readSqliteInspectionOperation(e){return readSqliteErrorDetails(e).operation}function readSqliteErrorDetails(e){let n=/* @__PURE__ */ new Set,r;for(let a=e,o=0;o<8&&t(a);o+=1){r=Vt.get(a)??r;let e=i(a);e&&/^[A-Z0-9_]{1,64}$/u.test(e)&&n.add(`code=${e}`);let{errcode:t}=a;typeof t==`number`&&Number.isInteger(t)&&t>=0&&t<=2147483647&&n.add(`errcode=${t}`),a=a.cause}return{suffix:n.size>0?` (${[...n].join(`, `)})`:``,operation:r}}const Ut=/* @__PURE__ */ new Set([`SQLITE_BUSY`,`SQLITE_LOCKED`]);function sqliteErrorCode(e){let t=r(e)?.code;return typeof t==`string`?t:void 0}function sqliteExtendedResultCode(e){let t=r(e)?.errcode;return typeof t==`number`&&Number.isInteger(t)?t:void 0}function sqlitePrimaryResultCode(e){let t=sqliteExtendedResultCode(e);return t===void 0?void 0:t&255}function isSqliteLockError(e){let t=sqliteErrorCode(e);if(t!==void 0&&Ut.has(t))return!0;let n=sqlitePrimaryResultCode(e);return n===5||n===6}function isSqliteCorruptionError(e){let t=sqlitePrimaryResultCode(e);return t===11||t===26}function notifyListeners(e,t,n){for(let r of e)try{r(t)}catch(e){n?.(e)}}function registerListener(e,t){return e.add(t),()=>e.delete(t)}const Wt=Symbol.for(`openclaw.postgres-sync-connection`);function isPostgresSqlConnection(e){return Wt in e&&e[Wt]===!0}function sqlPublicationAnchor(e){return isPostgresSqlConnection(e)?e.anchor:e}function materializeRuntimeProcessScriptFile(e,t={}){let n=j.mkdtempSync(M.join(t.parentDirectory??Xe.tmpdir(),`openclaw-script-`)),r=M.join(n,e.fileName),i=!1,dispose=()=>{if(!i)try{j.rmSync(n,{recursive:!0,force:!0}),i=!0}catch(e){process.emitWarning(`Runtime script cleanup failed at ${n}: ${e instanceof Error?e.message:String(e)}`)}};try{return j.writeFileSync(r,e.source,{mode:384,flag:`wx`}),{url:tt(r),dispose}}catch(e){throw dispose(),e}}function probeBunSqliteLibrary(e){let t=materializeRuntimeProcessScriptFile({fileName:v.bunSqliteLibraryProbe.fileName,source:`import{createRequire}from"node:module";try{const candidate=process.argv[2];if(!candidate||process.argv.length!==3){throw new Error("Expected one SQLite library path")}const require2=createRequire(import.meta.url);const{Database}=require2("bun:sqlite");Database.setCustomSQLite(candidate);const database=new Database(":memory:");let facts;try{facts=database.query("SELECT sqlite_version() AS version, sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted").get()}finally{database.close()}process.stdout.write(JSON.stringify({protocol:1,version:facts.version,extensionLoadingSupported:facts.omitted===0}))}catch(error){process.stdout.write(JSON.stringify({protocol:1,error:(error instanceof Error?error.message:String(error)).slice(0,512)}));process.exitCode=1}
`});try{let n=N(t.url),r=M.dirname(n),i=M.join(r,`bunfig.toml`);j.writeFileSync(i,``,{mode:384,flag:`wx`});let a={};for(let e of[`SystemRoot`,`SYSTEMROOT`,`WINDIR`,`TEMP`,`TMP`,`TMPDIR`])process.env[e]&&(a[e]=process.env[e]);let o=dt(process.execPath,[`--no-install`,`--no-env-file`,`--config=${i}`,n,M.resolve(e)],{cwd:r,env:ie(a),encoding:`utf8`,stdio:[`ignore`,`pipe`,`pipe`],timeout:5e3,killSignal:`SIGKILL`,maxBuffer:4096});if(o.error)throw o.error;let s=parseProbeFacts(o.stdout);if(o.status!==0)throw Error(s&&`error`in s&&typeof s.error==`string`?s.error.slice(0,512):`SQLite library probe failed (${o.signal??o.status})`);if(!s||!(`version`in s)||typeof s.version!=`string`||s.version.length>64||!(`extensionLoadingSupported`in s)||typeof s.extensionLoadingSupported!=`boolean`)throw Error(`SQLite library probe returned invalid output`);return{version:s.version,extensionLoadingSupported:s.extensionLoadingSupported}}finally{t.dispose()}}function parseProbeFacts(e){let t;try{t=JSON.parse(e)}catch{return}return typeof t==`object`&&t&&!Array.isArray(t)&&`protocol`in t&&t.protocol===1?t:void 0}const Gt=`openclaw.processMachineIdentity`;function readProcessMachineIdentity(){let e=T(Gt);return e?.platform!==process.platform&&(e={platform:process.platform,value:probeMachineIdentity()},O(Gt,e)),e.value}function probeMachineIdentity(){try{let e;if(process.platform===`linux`){let t=He(`/etc/machine-id`,`utf8`).trim();/^[a-f0-9]{32}$/u.test(t)&&(e=t)}else if(process.platform===`darwin`){let t=dt(`/usr/sbin/ioreg`,[`-rd1`,`-c`,`IOPlatformExpertDevice`],{encoding:`utf8`,timeout:1e3,maxBuffer:65536,killSignal:`SIGKILL`,stdio:[`ignore`,`pipe`,`ignore`]}),n=[...(t.stdout??``).matchAll(/"IOPlatformUUID"\s*=\s*"([^"]+)"/gu)],r=n.length===1?n[0]?.[1]?.toLowerCase():void 0;!t.error&&t.status===0&&r&&/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/u.test(r)&&(e=r)}return!e||/^0+$/u.test(e.replaceAll(`-`,``))?null:Fe(`sha256`,`openclaw:state-lease-process-owner:machine:v1`).update(`${process.platform}\0${e}`).digest(`hex`)}catch{return null}}function isSqliteWalResetSafeVersion(e){let t=/^(\d+)\.(\d+)\.(\d+)$/u.exec(e.trim());if(!t)return!1;let[n,r,i]=t.slice(1).map(Number);return[n,r,i].every(Number.isSafeInteger)?n>3||n===3&&(r>51||r===51&&i>=3||r===50&&i>=7||r===44&&i>=6):!1}const Kt=`openclaw.bunSqliteLibrarySelection`,qt=`openclaw.sqliteRuntimeCapabilities`,W=`openclaw.sqliteNativeRuntimeAdmission`;function createCapabilities(e){let t,n,r=0,i=Object.freeze({explicitSqliteCloseReleasesNativeResources:!1,decided:!1,reason:`SQLite close capability has not been decided`});function decide(e){return t||(t=Object.freeze(e),O(qt,t),t.explicitSqliteCloseReleasesNativeResources&&r>0&&process.emitWarning(`SQLite close became capable after ${r} topology owners were created; those owners remain conservative`,{code:`SQLITE_EARLY_TOPOLOGY`})),t}function conservative(e){return{explicitSqliteCloseReleasesNativeResources:!1,decided:!0,reason:e}}function settled(){if(t)return t;if(!process.versions.bun)return decide({explicitSqliteCloseReleasesNativeResources:!0,decided:!0,reason:`Node runtime`});if(process.platform===`win32`)return decide(conservative(`Bun Windows native-close conformance is not qualified`));if(!E)return decide({...i,reason:`Parent did not complete SQLite close admission`,...T(qt)})}return{get(){return settled()??i},capture(){let e=settled()??i;return e.decided||(r+=1),e.explicitSqliteCloseReleasesNativeResources},initialize(){return n??=(async()=>{e();let t=settled();if(t)return t;try{if(d(process.env.OPENCLAW_DIAGNOSTICS).flags.some(e=>e.toLowerCase()===`sqlite.close.conservative`))return decide(conservative(`SQLite close optimization disabled by internal diagnostic flag`));let{probeSqliteNativeClose:e}=await import(`./plugin-preparation-bun-sqlite-close-probe-DAb9SEGL.mjs`);return decide({...await e(),decided:!0})}catch(e){return decide(conservative(`SQLite close check failed: ${String(e)}`))}})(),n}}}function selectLibrary(e){let{Database:t}=Ae(import.meta.url)(`bun:sqlite`);t.setCustomSQLite(e)}function createSelector(){let e,t;return(n={})=>{if(t)throw t;if(e)return e;let r=n.explicitPath??(process.env.OPENCLAW_SQLITE_LIBRARY?.trim()||void 0);if(!process.versions.bun||process.platform!==`darwin`)return e=r?{source:`runtime`,ignoredOverride:`OPENCLAW_SQLITE_LIBRARY requires Bun on macOS`}:{source:`runtime`},e;let i=n.standaloneRoot??re(),a=r===void 0&&i!==void 0?et.join(i,`lib/libsqlite3.dylib`):void 0,o=process.env.HOMEBREW_PREFIX?.trim(),s=r===void 0?[.../* @__PURE__ */ new Set([...a?[a]:[],...o?[et.join(o,`opt/sqlite/lib/libsqlite3.dylib`)]:[],`/opt/homebrew/opt/sqlite/lib/libsqlite3.dylib`,`/usr/local/opt/sqlite/lib/libsqlite3.dylib`,`/opt/local/lib/libsqlite3.dylib`])]:[r],c=[];for(let n of s){let i=r===void 0?n===a?`bundled`:`discovered`:`env`,o,s=!0;try{try{o=probeBunSqliteLibrary(n)}catch(e){throw s=Be(n),s?e:Error(`missing file`,{cause:e})}if(!isSqliteWalResetSafeVersion(o.version))throw Error(`SQLite version ${o.version} below the WAL safety floor`);if(!o.extensionLoadingSupported)throw Error(`built with SQLITE_OMIT_LOAD_EXTENSION`)}catch(e){if(r===void 0){(s||n===a)&&c.push(`${n} (${e instanceof Error?e.message:String(e)})`);continue}throw t=selectionError(n,e,i===`bundled`),t}try{selectLibrary(n)}catch(e){throw t=selectionError(n,e,i===`bundled`),t}return e={source:i,path:n,version:o.version,extensionLoadingSupported:!0},e}throw t=/* @__PURE__ */ Error(`No supported SQLite library for Bun on macOS (${process.arch})`+(c.length>0?`; unusable: ${c.join(`, `)}`:``)+`. Apple's system SQLite fails OpenClaw's read-only database connections. `+(a?`Rebuild or replace the complete standalone artifact to restore its bundled SQLite library. `:``)+`Install one with brew install sqlite, or set OPENCLAW_SQLITE_LIBRARY to a libsqlite3.dylib built for ${process.arch}.`),t}}function selectionError(e,t,n=!1){let r=n?`Rebuild or replace the complete standalone artifact (openclaw and runtime/), or set OPENCLAW_SQLITE_LIBRARY to a supported library.`:`Fix or unset OPENCLAW_SQLITE_LIBRARY; install a supported library with brew install sqlite.`;return Error(`Cannot use ${n?`bundled `:``}SQLite library ${e}: ${t instanceof Error?t.message:String(t)}. ${r}`,{cause:t})}function readPublishedSqliteLibrarySelection(){return T(Kt)}function withSelectedSqliteLibraryEnv(e){if(!process.versions.bun||process.platform!==`darwin`)return e;let t=readPublishedSqliteLibrarySelection();return t&&t.source!==`runtime`&&e.OPENCLAW_SQLITE_LIBRARY!==t.path?{...e,OPENCLAW_SQLITE_LIBRARY:t.path}:e}function createRuntimeSelector(){let e=!!process.versions.bun&&process.platform===`darwin`,t;e&&!E&&(t=readPublishedSqliteLibrarySelection());let n=createSelector(),r=!1;return i=>{let a=t??n(i);return e&&E&&!r&&(O(Kt,Object.freeze({...a})),r=!0),a}}function runtimeSelector(){return s(Symbol.for(`openclaw.bunSqliteLibrarySelection`),createRuntimeSelector)}function capabilities(){let e=runtimeSelector();return e.capabilities??=createCapabilities(e)}function getSqliteRuntimeCapabilities(){return capabilities().get()}function captureSqliteWorkerClosePolicy(){return capabilities().capture()}function captureSqliteWorkerEnvironmentData(e=T(L)){return[[Kt,ensureSqliteLibrarySelected()],[qt,getSqliteRuntimeCapabilities()],[W,T(W)],[L,e],[Gt,T(Gt)]]}function ensureSqliteLibrarySelected(e){return runtimeSelector()(e)}function fileFields(e){return{dev:e.dev.toString(),ino:e.ino.toString(),birthtime:readDatabaseIdentityBirthtime(e),size:e.size.toString(),mtimeNs:e.mtimeNs.toString()}}function checksum(e){return Pe(`sha256`).update(e).digest(`hex`).slice(0,16)}function hasNoJournal(e){return[`-wal`,`-journal`].every(t=>{try{let n=j.statSync(`${e}${t}`,{bigint:!0});return n.isFile()&&n.size===0n}catch(e){if(_(e,`ENOENT`))return!0;throw e}})}function decodeSeal(e,n,r){let i=JSON.parse(e);if(!t(i)||typeof i.payload!=`string`||i.checksum!==checksum(i.payload))return r(`malformed-proof`);let a=JSON.parse(i.payload);if(!t(a)||a.version!==1||typeof a.schemaIdentity!=`string`||typeof a.verifiedAt!=`number`||!Number.isSafeInteger(a.verifiedAt)||!(`facts`in a)||!n.isFile())return r(`malformed-proof`);let o=Date.now()-a.verifiedAt;return o<0||o>6048e5?r(`expired-proof`):Object.entries(fileFields(n)).every(([e,t])=>a[e]===t)?{schemaIdentity:a.schemaIdentity,verifiedAt:a.verifiedAt,facts:a.facts,...a.identity===void 0?{}:{identity:a.identity}}:r(`file-mismatch`)}function readSqliteCleanCloseSeal(e,t,n){let refuse=e=>{n?.(e)};try{let n=`${e}.seal`;if(!j.lstatSync(n).isFile())return refuse(`malformed-proof`);let r=decodeSeal(j.readFileSync(n,`utf8`),t,refuse);return r?hasNoJournal(e)?r:refuse(`journal-present`):void 0}catch(e){return refuse(_(e,`ENOENT`)?`no-proof`:`malformed-proof`)}}async function readSqliteCleanCloseSealAsync(e,t,n){let refuse=e=>{n?.(e)};try{let n=`${e}.seal`;if(!(await j.promises.lstat(n)).isFile())return refuse(`malformed-proof`);let r=decodeSeal(await j.promises.readFile(n,`utf8`),t,refuse);if(!r)return;for(let t of[`-wal`,`-journal`])try{let n=await j.promises.stat(`${e}${t}`,{bigint:!0});if(!n.isFile()||n.size!==0n)return refuse(`journal-present`)}catch(e){if(!_(e,`ENOENT`))throw e}return r}catch(e){return refuse(_(e,`ENOENT`)?`no-proof`:`malformed-proof`)}}function invalidateSqliteCleanCloseSeal(e){try{j.unlinkSync(`${e}.seal`)}catch(e){if(!_(e,`ENOENT`))throw e}}function writeSqliteCleanCloseSeal(e,t,n,r){try{let i=`${e}.seal`,a=j.lstatSync(i,{throwIfNoEntry:!1});if(!n.isFile()||a&&!a.isFile()||!hasNoJournal(e))return invalidateSqliteCleanCloseSeal(e),!1;let o=JSON.stringify({version:1,schemaIdentity:t,...fileFields(n),verifiedAt:r.verifiedAt,facts:r.facts,identity:r.identity});return j.writeFileSync(i,JSON.stringify({payload:o,checksum:checksum(o)})),!0}catch{try{invalidateSqliteCleanCloseSeal(e)}catch{}return!1}}function resolveSqliteDatabaseFilePath(e){if(!e.startsWith(`file:`))return e;let[t=``]=e.slice(5).split(/[?#]/u,1);return t.startsWith(`/`)?N(e):decodeURIComponent(t)}function createSqliteDatabaseDescriptorOwner(e){function prepareOwnedSqliteDatabaseAdmission(t){let n=z.descriptorPreparation.then(async()=>{if(k!==0)throw Error(`SQLite descriptor preparation belongs to the host`);t.assertCurrent();let n=await j.promises.stat(t.location,{bigint:!0});assertDatabaseFileIdentity(n,t.expectedIdentity);let r=await j.promises.realpath(t.location);if(t.assertCurrent(),r!==t.location)throw Error(`SQLite private staging location changed before admission`);let i=readSqliteDatabaseAdmissionIdentity(n),a=z.registry.descriptors.get(i);if(retainPreparedSqliteDatabaseAdmissionLocation(t.location,t.expectedIdentity,{identity:i,canonicalPath:r}))return;let o=a?.descriptor??await new Promise((e,n)=>{j.open(t.location,`r`,(t,r)=>t?n(t):e(r))}),s=!1,c=!1;try{let n=await new Promise((e,t)=>{j.fstat(o,{bigint:!0},(n,r)=>n?t(n):e(r))});assertDatabaseFileIdentity(n,t.expectedIdentity),s=a===void 0;let i,l=await readSqliteCleanCloseSealAsync(r,n,e=>{i=e});assertDatabaseFileIdentity(await j.promises.stat(t.location,{bigint:!0}),t.expectedIdentity),t.assertCurrent();let u=z.registry.retainDescriptor(r,o,n);c=!0,e.load(u,{seal:l,refusal:i})}catch(e){if(s&&!c)try{await new Promise((e,t)=>{j.close(o,n=>n?t(n):e())})}catch(t){throw createSqliteLifecycleAggregateError([e,t],`SQLite preparation cleanup failed`,e)}throw e}});return z.descriptorPreparation=n.then(()=>{},()=>{}),n}function prepareSqliteDatabaseAdmissionAsync(t){let n=resolveAdmissionTarget(t.location,t.create!==void 0);if(!n)return Promise.resolve(void 0);let{filename:r,create:i}=n,a=t.identity,prepare=async()=>{t.assertCurrent();let n=a??await inspectDatabasePathIdentity(r);if(a=void 0,t.assertCurrent(),!n)return;if(t.expectedIdentity&&(n.key!==t.expectedIdentity.key||t.expectedIdentity.birthtime!==void 0&&n.birthtime!==t.expectedIdentity.birthtime))throw Error(`SQLite Worker path no longer matches its borrowed native owner`);let o=n.key.startsWith(`file:`),s=!o&&i?t.create:void 0;if(!o&&!s)return n;let c=`${n.key.slice(5)}:${n.birthtime}`;if(t.observedLocation&&t.observedLocation.identity!==c)throw Error(`SQLite database changed while retaining its admission identity`);if(k!==0){if(s)throw Error(`SQLite descriptor creation belongs to the host`);return pathAdmission(r,c),t.assertCurrent(),n}let l=o?z.registry.descriptors.get(c):void 0;if(l&&(assertDatabaseFileIdentity(l.file,n),retainPreparedSqliteDatabaseAdmissionLocation(r,void 0,{identity:c,canonicalPath:n.canonicalPath})))return n;let u,d;if(l)u=l.descriptor,d=l.file;else{s&&await s.authorize(n.canonicalPath),t.assertCurrent();let e=s?y():void 0;e&&s?.retain(e.promise);let i;try{i=await new Promise((e,t)=>{j.open(r,s?`wx`:`r`,420,(n,r)=>n?t(n):e(r))}),u=i,d=await new Promise((e,t)=>{j.fstat(u,{bigint:!0},(n,r)=>n?t(n):e(r))}),o&&assertDatabaseFileIdentity(d,n),z.registry.retainDescriptorCustody(n.canonicalPath,u,d),e?.resolve()}catch(t){if(i===void 0){if(e?.resolve(),s&&_(t,`EEXIST`))return prepare()}else e?.reject(t);throw t}}let f=o?n:{key:`file:${d.dev}:${d.ino}`,canonicalPath:n.canonicalPath,birthtime:readDatabaseIdentityBirthtime(d)},p,ee=o?await readSqliteCleanCloseSealAsync(n.canonicalPath,d,e=>{p=e}):void 0,m=await inspectDatabasePathIdentity(r);if(!m||m.key!==f.key||m.birthtime!==f.birthtime||m.canonicalPath!==f.canonicalPath)throw Error(`SQLite database changed identity during admission`);t.assertCurrent();let h=z.registry.records.get(readSqliteDatabaseAdmissionIdentity(d)),g=h&&!isSqliteDatabaseAdmissionRetired(h)?h:z.registry.retainDescriptor(f.canonicalPath,u,d);return z.registry.observeLocation(r,g.identity),o?e.load(g,{seal:ee,refusal:p}):e.markLoaded(g),f},o=z.descriptorPreparation.then(prepare);return z.descriptorPreparation=o.then(()=>{},()=>{}),o}function retainPreparedSqliteDatabaseAdmissionLocation(t,n,r){let i=!r&&z.registry.forLocation(t),a=i&&z.registry.descriptors.get(i.identity);if(i&&n?.birthtime!==void 0&&i.physicalIdentity.key===n.key&&i.physicalIdentity.birthtime===n.birthtime&&a&&a.descriptor===i.descriptor&&e.isLoaded(a))return e.load(i),!0;let o=r&&z.registry.descriptors.get(r.identity);if(r&&o&&e.isLoaded(o)){n&&assertDatabaseFileIdentity(o.file,n);let i=z.registry.records.get(r.identity),a=i&&!isSqliteDatabaseAdmissionRetired(i)?i:z.registry.retainDescriptor(r.canonicalPath,o.descriptor,o.file);return z.registry.observeLocation(t,a.identity),e.markLoaded(a),!0}return!1}function retainSqliteDatabaseAdmissionLocation(t,n,r){if(retainPreparedSqliteDatabaseAdmissionLocation(t,n,r))return;let i=j.statSync(t,{bigint:!0});if(!i.isFile())return;let a=readSqliteDatabaseAdmissionIdentity(i),o=z.registry.records.get(a);if(o&&!isSqliteDatabaseAdmissionRetired(o)){z.registry.observeLocation(t,a),e.load(o);return}if(k!==0)return;let s=z.registry.descriptors.get(a)?.descriptor??j.openSync(t,`r`),c=j.fstatSync(s,{bigint:!0});if(!c.isFile()||readSqliteDatabaseAdmissionIdentity(c)!==a)throw Error(`SQLite database changed while retaining its admission identity`);let l=z.registry.retainDescriptor(j.realpathSync.native(t),s,c);z.registry.observeLocation(t,l.identity),e.load(l)}function pathAdmission(t,n){try{let r=z.registry.forLocation(t);if(!r){let e=n;if(e===void 0&&k!==0){let n=j.statSync(t,{bigint:!0});if(!n.isFile())return;e=readSqliteDatabaseAdmissionIdentity(n)}exchangeSqliteDatabaseAdmission(t,void 0,!1,e!==void 0&&k!==0?{identity:e,canonicalPath:j.realpathSync.native(t)}:void 0),r=z.registry.forLocation(t)}return r?(e.load(r),r):(retainSqliteDatabaseAdmissionLocation(t),z.registry.forLocation(t))}catch(e){if(_(e,`ENOENT`))return;throw e}}function resolveAdmissionTarget(e,t){let n=e,r=t;if(n&&n!==`:memory:`){if(n.startsWith(`file:`)){let e=new URL(n);if(e.searchParams.get(`mode`)===`memory`||([`ro`,`rw`].includes(e.searchParams.get(`mode`)??``)&&(r=!1),n=resolveSqliteDatabaseFilePath(n),!n||n===`:memory:`))return}return{filename:n,create:r}}}function prepareSqliteDatabaseAdmission(t,n={}){let r=resolveAdmissionTarget(t,n.create);if(!r)return;let{filename:i,create:a}=r;try{let e=j.statSync(i,{bigint:!0});if(!e.isFile()){z.registry.observeLocation(i,void 0);return}let t=readSqliteDatabaseAdmissionIdentity(e);return z.registry.observeLocation(i,t),t}catch(t){if(_(t,`ENOENT`)){if(z.registry.observeLocation(i,void 0),!a)return;if(k!==0){let e=z.exchange.getStore()!==void 0;exchangeSqliteDatabaseAdmission(i,!0);let n=prepareSqliteDatabaseAdmission(i);if(e&&n===void 0)throw Error(`SQLite worker file creation requires host authority: ${i}`,{cause:t});return n}let n;try{n=j.openSync(i,`wx`,420)}catch(e){if(_(e,`EEXIST`))return prepareSqliteDatabaseAdmission(i);throw e}let r=j.fstatSync(n,{bigint:!0}),o=z.registry.retainDescriptor(j.realpathSync.native(i),n,r);if(e.markLoaded(o),prepareSqliteDatabaseAdmission(i)!==o.identity)throw Error(`SQLite database changed identity during file creation`,{cause:t});return o.identity}throw t}}return{prepareOwnedSqliteDatabaseAdmission,prepareSqliteDatabaseAdmissionAsync,retainSqliteDatabaseAdmissionLocation,retainPreparedSqliteDatabaseAdmissionLocation,prepareSqliteDatabaseAdmission,pathAdmission}}const Jt=s(Symbol.for(`openclaw.sqliteNativeAdmissions`),()=>({operations:/* @__PURE__ */ new WeakMap}));function getSqliteNativeAdmissionFacts(e){return Jt.operations.get(e)?.facts}function beginSqliteDatabaseAdmissionOperation(e){let t=Jt.operations.get(e)??{depth:0,facts:/* @__PURE__ */ new Map};return t.depth+=1,Jt.operations.set(e,t),()=>{--t.depth,t.depth===0&&Jt.operations.delete(e)}}function createSqliteDatabaseAdmissionReader(e){let{state:t,admission:n,pathAdmission:r,exchange:i,retain:a,release:o,publishFact:s}=e;function readSqliteDatabaseWriteRevision(e){let r=sqlPublicationAnchor(e);if(!r.isOpen||t.suspended.has(r))return;let i=n(r);if(!i){let e=r.location();return!e||e===`:memory:`?t.localWriteRevisions.get(r)??0:void 0}return readSqliteDatabaseGeneration(i,`writeRevision`)}function readSqliteDatabaseSiblingWriteRevision(e){let n=sqlPublicationAnchor(e),r=readSqliteDatabaseWriteRevision(n);return r===void 0?void 0:r-(t.localWriteRevisions.get(n)??0)|0}function readSqliteDatabaseCleanClose(t){let n=e.prepareFileIdentity(t),i=r(t);return i!==void 0&&i.identity===n&&Atomics.load(new Int32Array(i.generation),R.sealPresent)===1}function readSqliteDatabaseIntegrityVerification(t){let n=typeof t==`string`?getOrLoadSqliteDatabaseAdmissionForPath(t,e.integrityVerificationKey,()=>void 0):getSqliteDatabaseAdmission(t,e.integrityVerificationKey);return n===void 0?void 0:{verifiedAt:n}}function readSqliteDatabaseCleanCloseRefusal(e){return n(sqlPublicationAnchor(e))?.cleanCloseRefusal}function retainSqliteDatabaseAdmissionForPath(e){let n=r(e);if(!n)return;try{a(n)}catch(e){throw o(n),e}let i=!1,s=t.registry.prepareLocation(e);return{location:e,identity:{...n.physicalIdentity,canonicalPath:n.location},isCurrent:()=>!i&&s()===n,release(){i||(i=!0,o(n))}}}function withPathAdmission(e,t){let n=r(e);if(!n)return t(void 0);try{return a(n),t(n)}finally{o(n)}}function getSqliteDatabaseAdmission(e,r,a={}){let o=sqlPublicationAnchor(e);if(!o.isOpen||t.suspended.has(o))return;let s=n(o,a.existingOnly!==!0&&!e.isTransaction);if(!s)return;let c=(isPostgresSqlConnection(e)?void 0:getSqliteNativeAdmissionFacts(e))?.get(r.name)??t.local.get(o)?.get(r.name);if(c&&c.revision===readSqliteDatabaseFactRevision(s,c.schemaDependent)&&(!c.schemaDependent||c.ddlRevision===(t.ddlRevisions.get(o)??0)))return readSqliteDatabaseAdmissionFact(c,r);if(r.schemaDependent&&t.schemaDirty.has(o))return;if(t.rolledBack.has(o)){if(e.isTransaction)return;t.rolledBack.delete(o)}let l=s.facts.get(r.name);if(!l||!isSqliteDatabaseAdmissionFactCurrent(s,l)||a.refresh&&r.writer!==`host`){if(r.writer===`host`)return e.isTransaction||k===0||s.hostRevision===readSqliteDatabaseGeneration(s,`hostRevision`)?void 0:(i(s),l=s.facts.get(r.name),l&&isSqliteDatabaseAdmissionFactCurrent(s,l)?readSqliteDatabaseAdmissionFact(l,r):void 0);let n=readSqliteDatabaseGeneration(s,`publicationRevision`),o=t.misses.get(s)??/* @__PURE__ */ new Map;t.misses.set(s,o),r.writer!==`connection`&&!e.isTransaction&&(a.refresh||o.get(r.name)!==n)&&(i(s),l=s.facts.get(r.name),o.set(r.name,readSqliteDatabaseGeneration(s,`publicationRevision`)))}return l&&isSqliteDatabaseAdmissionFactCurrent(s,l)?readSqliteDatabaseAdmissionFact(l,r):void 0}function getOrLoadSqliteDatabaseAdmissionForPath(e,t,n){let read=e=>{if(!e)return n();let r=e.facts.get(t.name),i=r&&isSqliteDatabaseAdmissionFactCurrent(e,r)?readSqliteDatabaseAdmissionFact(r,t):void 0;if(i!==void 0)return i;let a=readSqliteDatabaseFactRevision(e,t.schemaDependent),o=n();return o!==void 0&&s(e,t,admitSqliteDatabaseFactValue(t,o),a),o};return t.lifetime===`process`?withPathAdmission(e,read):read(r(e))}function peekSqliteDatabaseAdmissionForPath(e,n){let r=t.registry.forLocation(e),i=r?.facts.get(n.name);return r&&i&&isSqliteDatabaseAdmissionFactCurrent(r,i)?readSqliteDatabaseAdmissionFact(i,n):void 0}function prepareSqliteDatabaseAdmissionForPath(e,t){let n=r(e);if(!n)return()=>void 0;let i=new Int32Array(n.generation),a=t.schemaDependent?R.schemaRevision:R.factRevision,o=n.facts.get(t.name),s=o&&new Int32Array(o.current);return()=>{if(Atomics.load(i,R.retired)!==0)return;let e=n.facts.get(t.name);return e!==o&&(o=e,s=o&&new Int32Array(o.current)),o&&s&&Atomics.load(s,0)===1&&o.revision===Atomics.load(i,a)?readSqliteDatabaseAdmissionFact(o,t):void 0}}function getSqliteDatabaseSchemaRevision(e,r={}){let i=sqlPublicationAnchor(e),a=n(i,r.existingOnly!==!0);if(a)return readSqliteDatabaseGeneration(a,`schemaRevision`);let o=t.openedIdentities.get(i);return o?t.localSchemaRevisions.get(o)??0:void 0}function hasSqliteDatabaseSchemaAdmissionForPath(e){return hasSqliteDatabaseSchemaAdmission(r(e))}function getSqliteDatabaseAdmissionIdentityForPath(e){return t.registry.forLocation(e)?.physicalIdentity}function getSqliteDatabaseAdmissionSourceForPath(e){let n=t.registry.forLocation(e);return n&&{identity:n.physicalIdentity,canonicalPath:n.location}}function observeSqliteDatabaseAdmissionLocation(e,n){let r=t.registry.forLocation(n.canonicalPath);r?.physicalIdentity.key===n.key&&r.physicalIdentity.birthtime===n.birthtime&&t.registry.observeLocation(e,r.identity)}function hasSqliteDatabaseSchemaAdmissionForIdentity(e){if(!e.key.startsWith(`file:`)||e.birthtime===void 0)return!1;let n=`${e.key.slice(5)}:${e.birthtime}`;return hasSqliteDatabaseSchemaAdmission(t.registry.records.get(n))}return{readSqliteDatabaseWriteRevision,readSqliteDatabaseSiblingWriteRevision,readSqliteDatabaseCleanClose,readSqliteDatabaseIntegrityVerification,readSqliteDatabaseCleanCloseRefusal,getSqliteDatabaseAdmission,getSqliteDatabaseSchemaRevision,getOrLoadSqliteDatabaseAdmissionForPath,peekSqliteDatabaseAdmissionForPath,prepareSqliteDatabaseAdmissionForPath,hasSqliteDatabaseSchemaAdmissionForPath,getSqliteDatabaseAdmissionIdentityForPath,getSqliteDatabaseAdmissionSourceForPath,observeSqliteDatabaseAdmissionLocation,hasSqliteDatabaseSchemaAdmissionForIdentity,retainSqliteDatabaseAdmissionForPath}}const Yt=/* @__PURE__ */ new Set([`CHECK`,`FOREIGN`,`PRIMARY`,`UNIQUE`]);function readTableConstraintKeyword(e,t){let n=t;if(n.keyword===`CONSTRAINT`){let t=readSqlToken(e,n.end);n=t?readSqlToken(e,t.end):null}return n?.keyword&&Yt.has(n.keyword)?n.keyword:null}function readSqlToken(e,t){let n=t;for(;n<e.length&&/\s/u.test(e[n]??``);)n+=1;let r=e[n];if(!r)return null;if(r===`"`||r==="`"||r===`[`){let t=skipSqlQuoted(e,n,r);return{end:t,keyword:null,raw:e.slice(n,t)}}let i=n;for(;i<e.length&&!/[\s(,]/u.test(e[i]??``);)i+=1;let a=e.slice(n,i);return{end:i,keyword:a.toUpperCase(),raw:a}}function normalizeSqlIdentifier(e){return e.startsWith(`"`)&&e.endsWith(`"`)?e.slice(1,-1).replaceAll(`""`,`"`).toLowerCase():e.startsWith("`")&&e.endsWith("`")?e.slice(1,-1).replaceAll("``","`").toLowerCase():e.startsWith(`[`)&&e.endsWith(`]`)?e.slice(1,-1).toLowerCase():e.toLowerCase()}function normalizeSchemaSql(e){return e===null?null:normalizeSqlWhitespace(e).replace(/;\s*$/u,``).trim().replace(/^(CREATE (?:TABLE|VIRTUAL TABLE|UNIQUE INDEX|INDEX|TRIGGER)) IF NOT EXISTS /iu,`$1 `)}function splitSqlList(e){let t=[],n=0,r=0;for(let i of unquotedSqlIndexes(e,0)){let a=e[i];a===`(`?n+=1:a===`)`?--n:a===`,`&&n===0&&(t.push(e.slice(r,i)),r=i+1)}return t.push(e.slice(r)),t}function findSqlCharacter(e,t){for(let n of unquotedSqlIndexes(e,0))if(e[n]===t)return n;return-1}function hasUnquotedSqlKeyword(e,t){let n=/* @__PURE__ */ new Set;for(let r of e.matchAll(t))n.add(r.index);if(n.size===0)return!1;for(let t of unquotedSqlIndexes(e,0))if(n.has(t))return!0;return!1}function findSqlClosingParenthesis(e,t){let n=0;for(let r of unquotedSqlIndexes(e,t)){let t=e[r];if(t===`(`)n+=1;else if(t===`)`&&(--n,n===0))return r}throw Error(`SQLite schema contains an unterminated table definition.`)}function normalizeSqlWhitespace(e){let t=``,n=!1,r=/[^\s'"`[/-]+|\s+|./gsu,i;for(;i=r.exec(e);){let a=i.index,o=i[0][0]??``,s=skipSqlQuoted(e,a,o),c=i[0];if(s!==a)c=e.slice(a,s),r.lastIndex=s;else{let t=skipSqlComment(e,a);if(t!==a){n=!0,r.lastIndex=t;continue}if(/\s/u.test(o)){n=!0;continue}}n&&t.length>0&&(t+=` `),t+=c,n=!1}return t.trim()}function quoteSqliteIdentifier(e){return`"${e.replaceAll(`"`,`""`)}"`}function*unquotedSqlIndexes(e,t){let n=t;for(;n<e.length;){let t=skipSqlQuoted(e,n,e[n]??``),r=t===n?skipSqlComment(e,n):t;r===n?(yield n,n+=1):n=r}}function skipSqlQuoted(e,t,n){if(n!==`'`&&n!==`"`&&n!=="`"&&n!==`[`)return t;let r=n===`[`?`]`:n,i=t+1;for(;i<e.length;)if(e[i]!==r)i+=1;else if(n!==`[`&&e[i+1]===r)i+=2;else return i+1;return e.length}function skipSqlComment(e,t){if(e.startsWith(`--`,t)){let n=e.indexOf(`
`,t+2);return n===-1?e.length:n+1}if(e.startsWith(`/*`,t)){let n=e.indexOf(`*/`,t+2);return n===-1?e.length:n+2}return t}function parseSqliteTableDefinition(e,t){if(e===null)throw Error(`Could not inspect SQLite table definition for ${t}.`);let n=findSqlCharacter(e,`(`);if(n===-1)throw Error(`SQLite table ${t} has no column definition.`);let r=findSqlClosingParenthesis(e,n),i=/* @__PURE__ */ new Map,a=[];for(let o of splitSqlList(e.slice(n+1,r))){let e=normalizeSqlWhitespace(o);if(!e)continue;let n=readSqlToken(e,0);if(!n)throw Error(`SQLite table ${t} contains an unreadable definition.`);if(readTableConstraintKeyword(e,n)){a.push(e);continue}let r=normalizeSqlIdentifier(n.raw);if(i.has(r))throw Error(`SQLite table ${t} contains duplicate column ${r}.`);i.set(r,e)}return{columns:new Map([...i].toSorted(([e],[t])=>e.localeCompare(t))),constraints:a.toSorted()}}const Xt=[{tableName:`session_pending_inputs`,columnName:`consumed_event_id`,dataType:`TEXT`},{tableName:`session_transcript_active_events`,columnName:`context_eligible`,dataType:`INTEGER`},{tableName:`session_nodes`,columnName:`project_id`,dataType:`TEXT`},{tableName:`session_windows`,columnName:`row_transcript_json`,dataType:`TEXT`},{tableName:`session_windows`,columnName:`row_transcript_updated_at`,dataType:`INTEGER`},{tableName:`session_conversations`,columnName:`route_context_json`,dataType:`TEXT`}];function hasPendingAgentStartupColumns(e){let t=/* @__PURE__ */ new Map;return Xt.some(({tableName:n,columnName:r})=>{if(!e.has(n))return!1;let i=e.get(n);if(!i)return!0;let a=t.get(n);return a||(a=parseSqliteTableDefinition(i,n).columns,t.set(n,a)),!a.has(r)})}function compareValidSemver(e,t){let n=ft(e),r=ft(t);return n&&r?n.compare(r):null}const Zt=Symbol.for(`openclaw.warning-filter`);function shouldIgnoreWarning(e){return!!(e.code===`DEP0040`&&e.message?.includes(`punycode`)||e.code===`DEP0060`&&e.message?.includes(`util._extend`)||e.name===`ExperimentalWarning`&&e.message?.includes(`SQLite is an experimental feature`))}function normalizeWarningArgs(e){let n=e[0],r=e[1],i=e[2],a,o,s;return n instanceof Error?(a=n.name,s=n.message,o=n.code):typeof n==`string`&&(s=n),t(r)?(typeof r.type==`string`&&(a=r.type),typeof r.code==`string`&&(o=r.code)):(typeof r==`string`&&(a=r),typeof i==`string`&&(o=i)),{name:a,code:o,message:s}}function installProcessWarningFilter(){let e=s(Zt,()=>({installed:!1}));if(e.installed)return;let n=process.emitWarning.bind(process),wrappedEmitWarning=((...e)=>{if(!shouldIgnoreWarning(normalizeWarningArgs(e))){if(e[0]instanceof Error&&t(e[1])){let t=e[0],n=Object.assign(Error(t.message),{name:t.name,code:t.code});process.emit(`warning`,n)}else Reflect.apply(n,process,e)}});process.emitWarning=wrappedEmitWarning,e.installed=!0}const Qt=Ae(import.meta.url);let $t;function assertSqliteWalResetSafeVersion(e,t){if(isSqliteWalResetSafeVersion(e))return;let n=process.config.variables,r=n.node_shared_sqlite===!0||n.node_shared_sqlite===`true`;throw Error(`OpenClaw requires SQLite 3.51.3+, 3.50.7+ within 3.50.x, or 3.44.6+ within 3.44.x for WAL safety; Node ${t} ${r?`uses shared system`:`embeds`} SQLite ${e}, which is affected by the upstream WAL-reset database corruption bug. ${r?`Upgrade the system SQLite library to one of those safe versions, or use a Node build embedding a safe version.`:`Upgrade to Node 24.22.1+ or 26.12.1+ before retrying.`}`)}function sqliteNativeRuntimeIdentity(){return{pid:process.pid,executable:process.execPath,nodeVersion:process.versions.node,bunVersion:process.versions.bun,library:ensureSqliteLibrarySelected()}}function parseSqliteNativeRuntimeAdmission(e){if(!t(e)||e.format!==1||typeof e.version!=`string`||typeof e.extensionLoadingSupported!=`boolean`)return;let n=sqliteNativeRuntimeIdentity();if(it(e.runtime,n))return{format:1,runtime:n,version:e.version,storageIdentity:t(e.storageIdentity)&&typeof e.storageIdentity.sourceId==`string`&&typeof e.storageIdentity.compileOptions==`string`?{sourceId:e.storageIdentity.sourceId,compileOptions:e.storageIdentity.compileOptions}:void 0,extensionLoadingSupported:e.extensionLoadingSupported}}function safeSqliteNativeRuntimeAdmission(e){try{let t=parseSqliteNativeRuntimeAdmission(e);return t&&isSqliteWalResetSafeVersion(t.version)?t:void 0}catch{return}}function captureSqliteNativeRuntimeAdmission(){return safeSqliteNativeRuntimeAdmission(T(W))}function installSqliteNativeRuntimeAdmission(e){let t=safeSqliteNativeRuntimeAdmission(e);t&&O(W,t)}function assertSafeSqliteRuntime(e){if($t===e)return;let t=parseSqliteNativeRuntimeAdmission(T(W));if(t){assertSqliteWalResetSafeVersion(t.version,process.versions.node),compareValidSemver(t.version,`3.45.0`),t.extensionLoadingSupported,$t=e;return}let n=new e.DatabaseSync(`:memory:`),r,i,a;try{let e=n.prepare(`SELECT sqlite_version() AS version, sqlite_source_id() AS sourceId, (SELECT group_concat(compile_options, ',') FROM (SELECT compile_options FROM pragma_compile_options ORDER BY compile_options)) AS compileOptions, sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted`).get();r=typeof e?.version==`string`?e.version:`unknown`,assertSqliteWalResetSafeVersion(r,process.versions.node),typeof e?.sourceId==`string`&&e.sourceId&&typeof e.compileOptions==`string`&&(i={sourceId:e.sourceId,compileOptions:e.compileOptions}),a=e?.omitted===0}finally{n.close()}compareValidSemver(r,`3.45.0`),$t=e,O(W,{format:1,runtime:sqliteNativeRuntimeIdentity(),version:r,storageIdentity:i,extensionLoadingSupported:a})}function requireNodeSqlite(){installProcessWarningFilter();try{ensureSqliteLibrarySelected();let e=Qt("node:sqlite");return assertSafeSqliteRuntime(e),e}catch(e){let t=de(e);throw Error(`SQLite support is unavailable or unsafe in this Node runtime. ${t}`,{cause:e})}}const en=`-- Session storage doctrine: session_nodes.entry_json owns hot logical-session facts;
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
`,tn=`

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
`;function sqliteDatabaseSealSchemaFor(e){requireNodeSqlite();let t=captureSqliteNativeRuntimeAdmission(),n=t?.storageIdentity;if(!t||!n)return;let r=[t.runtime.nodeVersion,t.runtime.bunVersion??null],i=JSON.stringify([t.version,n.sourceId,n.compileOptions,...r]),a=Pe(`sha256`).update(JSON.stringify([3,i,e])),o=Pe(`sha256`).update(e);return e!==`state`&&(a.update(`42`),a.update(en),o.update(`42`),o.update(en)),e!==`agent`&&(a.update(`40`),a.update(tn),o.update(`40`),o.update(tn)),{schemaIdentity:a.digest(`hex`),identity:{runtime:JSON.stringify(r),sqlite:{version:t.version,sourceId:n.sourceId,compileOptions:n.compileOptions.split(`,`).filter(e=>!e.startsWith(`COMPILER=`)).join(`,`)},schema:o.digest(`hex`),policy:3}}}const nn={};function sealSchema(e){let t=e.includes(`agent.schema-metadata`),n=t===e.includes(`state.schema-version`)?`other`:t?`agent`:`state`;return nn[n]??=sqliteDatabaseSealSchemaFor(n)}const rn={name:`sqlite.full-verification`,lifetime:`process`,read:e=>typeof e==`number`&&Number.isSafeInteger(e)?e:void 0},an={...rn,name:`sqlite.quick-verification`},on=/* @__PURE__ */ new Set([`sqlite-schema`,`sqlite.full-verification`,`sqlite.quick-verification`,`state.schema-version`,`state.runtime-schema`,`state.integrity`,`agent.completed-validation`,`agent.canonical-validation-receipt`,`agent.schema-metadata`]);function isSealedKey(e){return on.has(e)||e.startsWith(`memory.index-schema:`)}function encodeSealValue(e,t){return t instanceof Map?{sealType:`map`,entries:[...t]}:t instanceof Set?{sealType:`set`,entries:[...t]}:t instanceof SharedArrayBuffer?{sealType:`shared`,entries:[...new Int32Array(t)]}:t}function decodeSealValue(e,n){if(!t(n)||!Array.isArray(n.entries))return n;if(n.sealType===`map`)return new Map(n.entries);if(n.sealType===`set`)return new Set(n.entries);if(n.sealType===`shared`){let e=new SharedArrayBuffer(n.entries.length*Int32Array.BYTES_PER_ELEMENT);return new Int32Array(e).set(n.entries),e}return n}var SqliteDatabaseCleanCloseSeals=class{constructor(e,t){this.publishFact=e,this.references=t,this.loaded=/* @__PURE__ */ new WeakMap}isLoaded(e){return this.loaded.has(e)}markLoaded(e){let t=this.references.descriptor(e)??e,n=this.loaded.get(t);n&&n!==e.generation&&Atomics.store(new Int32Array(e.generation),R.sealPresent,Atomics.load(new Int32Array(n),R.sealPresent)),this.loaded.set(t,e.generation)}load(e,n){if(k!==0)return;let r=this.references.descriptor(e)??e;if(this.loaded.has(r))this.markLoaded(e);else{this.markLoaded(e),e.cleanCloseRefusal=`malformed-proof`;try{n?.refusal&&(e.cleanCloseRefusal=n.refusal);let r=n?n.seal:readSqliteCleanCloseSeal(e.location,j.fstatSync(e.descriptor,{bigint:!0}),t=>{e.cleanCloseRefusal=t});if(!r||typeof r.facts!=`string`)return;let i=JSON.parse(r.facts,decodeSealValue);if(!Array.isArray(i)||!i.every(e=>Array.isArray(e)&&e.length===3&&typeof e[0]==`string`&&isSealedKey(e[0])&&typeof e[1]==`boolean`)||!i.some(([e,,t])=>(e===rn.name||e===an.name)&&t===r.verifiedAt)||!i.some(([e,,n])=>e===`sqlite-schema`&&t(n)))return;let a=sealSchema(i.map(([e])=>e));if(!a){e.cleanCloseRefusal=`identity-mismatch`;return}let o=r.identity;if(o!==void 0&&(!t(o)||typeof o.runtime!=`string`||typeof o.schema!=`string`||typeof o.policy!=`number`))return;if(t(o)&&typeof o.sqlite!=`string`){if(!t(o.sqlite)||typeof o.sqlite.version!=`string`||typeof o.sqlite.sourceId!=`string`||typeof o.sqlite.compileOptions!=`string`)return;let n=o.schema!==a.identity.schema,r=o.policy!==a.identity.policy,i=o.sqlite.compileOptions!==a.identity.sqlite.compileOptions;if(n||r||i){e.cleanCloseRefusal=n?`schema-mismatch`:r?`policy-mismatch`:`feature-mismatch`;return}}else if(r.schemaIdentity!==a.schemaIdentity){e.cleanCloseRefusal=`identity-mismatch`;return}let s=i.find(([e])=>e===`sqlite-schema`)?.[2];if(!(s.tableSql instanceof Map))return;if(hasPendingAgentStartupColumns(s.tableSql)){e.cleanCloseRefusal=`schema-mismatch`;return}delete e.cleanCloseRefusal;for(let[t,n,r]of i)this.publishFact(e,{name:t,schemaDependent:n,lifetime:`process`},{value:r},readSqliteDatabaseFactRevision(e,n));Atomics.store(new Int32Array(e.generation),R.sealPresent,1)}catch{}finally{this.references.publish(e)}}}invalidate(e,t){invalidateSqliteCleanCloseSeal(t?.location??e),t&&Atomics.store(new Int32Array(t.generation),R.sealPresent,0)}prepare(e,t,n){let r=this.preparePublication(e,t,n);t&&this.references.retain(t);let i=t;return{publish:()=>i!==void 0&&r(),[Symbol.dispose]:()=>{let e=i;i=void 0,e&&this.references.release(e)}}}preparePublication(e,t,n){if(!t||e.isTransaction||n===void 0)return()=>!1;let r=[...t.facts].filter(([e,n])=>isSealedKey(e)&&isSqliteDatabaseAdmissionFactCurrent(t,n));if(!r.some(([e])=>e===`sqlite-schema`))return()=>!1;let i=JSON.stringify(r.map(([e,t])=>[e,t.schemaDependent,t.value]),encodeSealValue),a=sealSchema(r.map(([e])=>e));return a?()=>{if(e.isOpen||readSqliteDatabaseGeneration(t,`retired`)!==0||r.some(([,e])=>Atomics.load(new Int32Array(e.current),0)!==1||e.revision!==readSqliteDatabaseFactRevision(t,e.schemaDependent)))return!1;try{let e=j.fstatSync(t.descriptor,{bigint:!0});if(readSqliteDatabaseAdmissionIdentity(j.statSync(t.location,{bigint:!0}))!==t.identity)return!1;let r=writeSqliteCleanCloseSeal(t.location,a.schemaIdentity,e,{verifiedAt:n,facts:i,identity:a.identity});return Atomics.store(new Int32Array(t.generation),R.sealPresent,+!!r),r}catch{return!1}}:()=>!1}};g(`sqlite/publication`);const sn=s(Symbol.for(`openclaw.sqlitePostCommitPublications`),()=>/* @__PURE__ */ new WeakMap),cn=s(Symbol.for(`openclaw.sqliteTransactionState`),()=>/* @__PURE__ */ new WeakMap);function hasSqlitePostCommitScope(e){return sn.has(sqlPublicationAnchor(e))}function stageSqliteTransactionState(e,t){let n=cn.get(sqlPublicationAnchor(e));return n?(t.stage?.(),n.push({prepareCommit:t.prepareCommit,commit:t.commit,prepareObservers:t.prepareObservers,invalidate:t.invalidate,rollback:t.rollback}),!0):!1}function rollbackTransactionState(e,t,n=`rolled-back`){let r=[];for(let i of e.toReversed())try{n===`unknown`&&i.invalidate?i.invalidate(t):i.rollback?.(t)}catch(e){r.push(e)}if(r.length>0)throw createSqliteLifecycleAggregateError([t,...r],`SQLite transaction and rollback observers failed`,t)}function discardSqliteTransactionState(e,t,n=`unknown`){let r=sqlPublicationAnchor(e);sn.get(r)?.splice(0);let i=cn.get(r)?.splice(0)??[];sn.delete(r),cn.delete(r),rollbackTransactionState(i,t,n)}function schemaStatement(e){if(/^(?:CREATE|ALTER|DROP|REINDEX|VACUUM)\b/iu.test(e))return!0;let t=/^(?:INSERT(?: OR \w+)? INTO|UPDATE(?: OR \w+)?|DELETE FROM|REPLACE INTO)\s+/iu.exec(e);if(t){let n=readSqlToken(e,t[0].length)?.raw??``,r=n.slice(findSqlCharacter(n,`.`)+1);return[`sqlite_schema`,`sqlite_master`].includes(normalizeSqlIdentifier(r))}if(!/^PRAGMA\b/iu.test(e))return!1;let n=[findSqlCharacter(e,`=`),findSqlCharacter(e,`(`)].filter(e=>e>=0);if(n.length===0)return!1;let r=e.slice(6,Math.min(...n)).trim(),i=r.slice(findSqlCharacter(r,`.`)+1).trim(),a=i.startsWith(`'`)&&i.endsWith(`'`)?i.slice(1,-1).toLowerCase():normalizeSqlIdentifier(i);return[`user_version`,`schema_version`].includes(a)}function changesSchema(e){if(!/\b(?:CREATE|ALTER|DROP|REINDEX|VACUUM|PRAGMA|INSERT|UPDATE|DELETE|REPLACE)\b/iu.test(e))return!1;let t=normalizeSqlWhitespace(e);for(;t;){t=t.replace(/^[\s;]+/u,``);let e=findSqlCharacter(t,`;`);if(schemaStatement(e<0?t:t.slice(0,e)))return!0;t=e<0?``:t.slice(e+1)}return!1}function createsOnlyTemporaryObject(e){let t=normalizeSqlWhitespace(e),n=/^\s*CREATE\s+(?:TEMP|TEMPORARY)\s+(TABLE|TRIGGER)\b/iu.exec(t)?.[1]?.toUpperCase();if(!n)return!1;let r=findSqlCharacter(t,`;`);if(n===`TABLE`)return r<0||t.slice(r+1).trim()===``;for(;r>=0;){t=t.slice(r+1).trim(),r=findSqlCharacter(t,`;`);let e=(r<0?t:t.slice(0,r)).trim();if(/^END$/iu.test(e))return r<0||t.slice(r+1).trim()===``}return!1}function changesOnlyTemporaryTable(e){let t=normalizeSqlWhitespace(e),n=findSqlCharacter(t,`;`);return n>=0&&t.slice(n+1).trim()!==``?!1:/^CREATE\s+(?:TEMP|TEMPORARY)\s+TABLE\b/iu.test(t)||/^DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:temp|"temp"|`temp`|\[temp\])\s*\./iu.test(t)}function changesData(e){return hasUnquotedSqlKeyword(e,/\b(?:INSERT|UPDATE|DELETE|REPLACE)\b/giu)}function temporaryWriteTables(e){let t=[],n=normalizeSqlWhitespace(e);for(;n;){n=n.replace(/^[\s;]+/u,``);let e=findSqlCharacter(n,`;`),r=e<0?n:n.slice(0,e);if(changesData(r)){let e=/^(?:INSERT(?: OR \w+)? INTO|REPLACE INTO|UPDATE(?: OR \w+)?|DELETE FROM)\s+(?:temp|"temp"|`temp`|\[temp\])\s*\.\s*("(?:[^"]|"")+"|`(?:[^`]|``)+`|\[[^\]]+\]|[a-z_]\w*)(?=\s|\(|$)/iu.exec(r)?.[1];if(e===void 0)return;t.push(normalizeSqlIdentifier(e))}n=e<0?``:n.slice(e+1)}return t}const ln=/^(?:\s|;|--[^\n]*(?:\n|$)|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*/u,un=/^(BEGIN|SAVEPOINT|COMMIT|END|RELEASE|ROLLBACK)\b/i;function readTransactionControl(e,t){let n,r=!1,i=!1,a=0,o=e;for(;o&&(o=o.replace(ln,``),o);){a+=1;let e=o.includes(`;`)?findSqlCharacter(o,`;`):-1,s=e<0?o:o.slice(0,e),c=un.exec(s)?.[1]?.toUpperCase();if(c===`ROLLBACK`?(n=c,i||=r,r=!/^ROLLBACK(?: TRANSACTION)? TO\b/iu.test(normalizeSqlWhitespace(s)),i||=!r):(c||!/^SELECT\b/iu.test(s)&&(changesSchema(s)||changesData(s)))&&(i=!0),n||=c,e<0||t===`statement`)break;o=o.slice(e+1)}return n?{kind:n,single:a===1,outerRollback:r&&!i}:void 0}function canPreserveTransactionSnapshot(e,t){return!(!t||!e?.single||e.kind!==`SAVEPOINT`&&e.kind!==`RELEASE`&&e.kind!==`ROLLBACK`)}function classifySqliteMutation(e,t){let n=changesSchema(e),r=changesData(e),i=n&&changesOnlyTemporaryTable(e);return{schemaChange:n,mainSchemaChange:n&&!i&&!createsOnlyTemporaryObject(e),temporaryTableSchemaChange:i,dataChange:r,temporaryWriteTables:r?temporaryWriteTables(e):void 0,control:readTransactionControl(e,t)}}const G=s(Symbol.for(`openclaw.sqliteNativeExecution`),()=>/* @__PURE__ */ new WeakMap),dn=s(Symbol.for(`openclaw.sqlitePreparedNativeMutation`),()=>/* @__PURE__ */ new WeakMap);function isPreparingSqliteNativeMutation(e){return dn.get(e)?.phase===`preparing`}const fn=new FinalizationRegistry(e=>{for(let t of e)t.finish(!1,!0)});function createIteratorLifetime(e,t){let n={finished:!1,invalidated:!1,pause:()=>n.stopObservation(),invalidate:()=>{n.invalidated=!0,n.finish()},stopObservation:(e=!1,r=!1)=>{let i=n.observed;n.observed=void 0,t.delete(n),i?.finish(e,r)},finish:(t=!1,r=!1)=>{n.finished||(n.finished=!0,e.delete(n),n.stopObservation(t,r))}};return e.add(n),n}const pn={schemaChange:!1,mainSchemaChange:!1,temporaryTableSchemaChange:!1,dataChange:!1,temporaryWriteTables:void 0,control:void 0};function observeSqliteNativeClose(e,t){for(let n of[`close`,Symbol.dispose]){if(typeof e[n]!=`function`)continue;let r=e[n].bind(e);e[n]=()=>{try{r()}finally{e.isOpen||t()}}}}function callStatement(e,t){return Reflect.apply(e,void 0,t)}function observeSqliteNativeOperations(e,t,n){let begin=(t,r)=>{let i=dn.get(e);if(i){if(i.phase!==`armed`||r!==`execute`||!t.dataChange||t.schemaChange||t.control)throw Error(`Prepared SQLite mutations must execute exactly one data statement`);i.phase=`observing`}let a=n(t,r);return G.set(e,(G.get(e)??0)+1),{...a,finish(t,n,r){try{a.finish(t,n,r)}finally{let t=(G.get(e)??1)-1;t===0?G.delete(e):G.set(e,t)}}}},r=/* @__PURE__ */ new Set,execute=(t,n,r=`execute`)=>{let i=dn.get(e),a=begin(n,r),o=!1,s=!1,c=!1;try{i&&(i.phase=`preparing`,i.prepare(),i.phase=`executing`);let e=t();return s=!0,r!==`bind`&&a.stepped?.(),o=!0,e}catch(t){if(c=!(!i||i.phase!==`preparing`&&(s||!isSqliteLockError(t)&&sqlitePrimaryResultCode(t)!==19)),i&&!c){let n=wrapSqliteWorkerError(`Prepared SQLite mutation outcome is unknown`,`outcome-unknown`,t);throw discardSqliteTransactionState(e,n),n}throw t}finally{i&&(i.phase=`finished`),a.finish(o,!1,c)}};return e.exec=n=>execute(()=>t.DatabaseSync.prototype.exec.call(e,n),classifySqliteMutation(n,`batch`),`exec`),e.prepare=(...n)=>{let i=t.DatabaseSync.prototype.prepare.call(e,...n),a,resolveMutation=()=>a??=classifySqliteMutation(i.sourceSQL,`statement`),o=Object.hasOwn(i,`run`)?i.run.bind(i):void 0,s=Object.hasOwn(i,`get`)?i.get.bind(i):void 0,c=Object.hasOwn(i,`all`)?i.all.bind(i):void 0,l=Object.hasOwn(i,`iterate`)?i.iterate.bind(i):void 0,u=/* @__PURE__ */ new Set,d=!1,reset=(e,t=`reuse`)=>{if(u.size===0)return e();let n=[...u],r=e();for(let e of n)t===`return`?e.pause():e.invalidate();return r},wrap=e=>(...t)=>execute(()=>reset(()=>callStatement(e(),t)),resolveMutation());i.run=wrap(()=>o??t.StatementSync.prototype.run.bind(i)),i.get=wrap(()=>s??t.StatementSync.prototype.get.bind(i)),i.all=wrap(()=>c??t.StatementSync.prototype.all.bind(i)),i.iterate=(...n)=>{d||=(fn.register(i,u),!0);let a=execute(()=>reset(()=>callStatement(l??t.StatementSync.prototype.iterate.bind(i),n)),pn,`bind`),o=new WeakRef(a),s=createIteratorLifetime(u,r),c=a.next,f=a.return,p;return a.next=function(...t){if(p&&this===o.deref()&&e.isOpen)return{...p};if(this!==o.deref()||s.invalidated||!e.isOpen)return c.apply(this,t);s.finished&&(s.finished=!1,u.add(s)),s.observed??=begin(resolveMutation(),`iterate`),r.add(s);let n=c.apply(this,t);return n.done?(f?.call(this),p={...n},s.finish(!0)):s.observed?.stepped?.(),n},f&&(a.return=function(...t){if(p&&this===o.deref()&&e.isOpen)return{...p};if(this!==o.deref()||!e.isOpen)return f.apply(this,t);let n=execute(()=>s.finished||s.invalidated?f.apply(this,t):reset(()=>f.apply(this,t),`return`),pn,`bind`);return n.done&&(p={...n}),s.finish(),n}),a};for(let e of[`close`,Symbol.dispose]){let t=i[e]?.bind(i);t&&(i[e]=()=>reset(t,`finalize`))}return i},observeSqliteNativeClose(e,()=>{for(let e of r)e.invalidate()}),execute}const K=s(Symbol.for(`openclaw.sqliteDatabaseWriteScopes`),()=>({writeScopes:/* @__PURE__ */ new WeakMap,pendingWriteScopes:/* @__PURE__ */ new WeakMap,localScopeRevisions:/* @__PURE__ */ new WeakMap,localUnscopedRevisions:/* @__PURE__ */ new WeakMap}));function createSqliteDatabaseWriteReceipts(e){function onSqliteDatabaseWriteSettled(t,n){let r=sqlPublicationAnchor(t),i=e.admission(r);if(!i)return;let a=e.writeListeners.get(i);return a||(a=/* @__PURE__ */ new Set,e.writeListeners.set(i,a)),registerListener(a,n)}function settleWorker(t,n){let r=n>0?t.references.get(n):void 0;if(r&&Atomics.exchange(new Int32Array(r),1,0)>0){advanceSqliteDatabaseGeneration(t,`writeRevision`),advanceSqliteDatabaseGeneration(t,`unscopedWriteRevision`);let n=e.writeListeners.get(t);n&&notifyListeners(n,void 0)}}function withSqliteDatabaseWriteScope(t,n,r){let i=sqlPublicationAnchor(t),a=e.admission(i);if(!(a?readSqliteDatabaseGeneration(a,`writeScopeRevision`)>0:K.localScopeRevisions.has(i))){let e=r();if(te(e))throw Error(`SQLite write scopes cannot await work`);return e}let o=normalizedWriteScopes(n),s=K.writeScopes.get(i);K.writeScopes.set(i,o);try{let e=r();if(te(e))throw Error(`SQLite write scopes cannot await work`);return e}finally{s?K.writeScopes.set(i,s):K.writeScopes.delete(i)}}function withoutSqliteDatabaseWriteScope(e,t){let n=sqlPublicationAnchor(e),r=K.writeScopes.get(n);K.writeScopes.delete(n);try{return t()}finally{r&&K.writeScopes.set(n,r)}}function ensureWriteScopes(t,n,r){let i=!1;for(let e of n){let n=t.writeScopes.get(e);(!n||Atomics.load(n.state,1)!==0||r&&!pinWriteScope(n))&&(n=createScopeRevision(),r&&Atomics.store(n.state,2,1),k===0&&advanceSqliteDatabaseGeneration(t,`writeScopeRevision`),i=!0),r&&r.push(n),retainSqliteDatabaseWriteScope(t,e,n)}i&&(advanceSqliteDatabaseGeneration(t,`publicationRevision`),e.publish(t,n))}function pinWriteScope(e){let t=Atomics.load(e.state,2);for(;t>=0;){let n=Atomics.compareExchange(e.state,2,t,t+1);if(n===t)return!0;t=n}return!1}let t,n=0;function createScopeRevision(){t&&n!==t.byteLength||(t=new SharedArrayBuffer(48*Int32Array.BYTES_PER_ELEMENT),n=0);let e=new Int32Array(t,n,3);return n+=e.byteLength,{identity:Le(),state:e}}function retainSqliteDatabaseWriteScopesForPath(t,n){let r=e.pathAdmission(t);if(!r||isSqliteDatabaseAdmissionRetired(r))return;let i=[],a=!1,release=()=>{if(!a){a=!0;try{for(let e of i)Atomics.sub(e.state,2,1);i.length>0&&!isSqliteDatabaseAdmissionRetired(r)&&pruneSqliteDatabaseWriteScopes(r)&&(advanceSqliteDatabaseGeneration(r,`publicationRevision`),e.publish(r,[]))}finally{e.release(r)}}};try{return e.retain(r),ensureWriteScopes(r,normalizedWriteScopes(n),i),release}catch(e){throw release(),e}}function retireSqliteDatabaseWriteScopes(t,n){let r=sqlPublicationAnchor(t),i=normalizedWriteScopes(n),a=e.admission(r),retire=()=>{let t=a?.writeScopes??K.localScopeRevisions.get(r),o=n.flatMap(e=>typeof e!=`string`&&e.partition===void 0?[normalizedWriteScopes([e])[0].slice(0,-1)+`,`]:[]);for(let e of t?.keys()??[])o.some(t=>e.startsWith(t))&&i.push(e);if(!a){let e=K.localScopeRevisions.get(r);for(let t of i)e?.delete(t);return}if(isSqliteDatabaseAdmissionRetired(a))return;let s=!1;for(let e of i){let t=a.writeScopes.get(e);t&&Atomics.exchange(t.state,1,1)===0&&(s=!0)}s&&(advanceSqliteDatabaseGeneration(a,`writeScopeRevision`),advanceSqliteDatabaseGeneration(a,`publicationRevision`),e.publish(a,i))};!stageSqliteTransactionState(r,{commit:retire})&&!t.isTransaction&&retire()}function prepareSqliteDatabaseScopedWriteRevisionForPath(t,n){let r=retainSqliteDatabaseWriteScopesForPath(t,n);if(!r)return;let i=e.pathAdmission(t);if(!i){r();return}let a=normalizedWriteScopes(n).map(e=>i.writeScopes.get(e)),o=a.map(e=>Atomics.load(e.state,0)),s=/* @__PURE__ */ new WeakMap,c=new Int32Array(i.generation),l=!1,inspectReference=e=>{let t=s.get(e);t||(t=new Int32Array(e),s.set(e,t)),l||=Atomics.load(t,1)>0},u=Atomics.load(c,R.schemaRevision),d=Atomics.load(c,R.unscopedWriteRevision),f=0,p=!1;return{read(){if(p||Atomics.load(c,R.retired)!==0||(l=!1,i.references.forEach(inspectReference),l))return;let e=Atomics.load(c,R.schemaRevision),t=Atomics.load(c,R.unscopedWriteRevision),n=u!==e||d!==t;u=e,d=t;for(let e=0;e<a.length;e++){let t=a[e];if(Atomics.load(t.state,1)!==0)return;let r=Atomics.load(t.state,0);n||=o[e]!==r,o[e]=r}return n&&f++,f},release(){p||(p=!0,r())}}}function scopedWriteToken(e,t,n,r=0){let i=readSqliteDatabaseGeneration(e,`schemaRevision`)+r|0,a=[];for(let r of t){let o=e.writeScopes.get(r);if(!o||Atomics.load(o.state,1)!==0)return JSON.stringify([e.identity,e.generationId,i,`database`,readSqliteDatabaseGeneration(e,`writeRevision`)+(n===void 0?0:1)|0,t]);a.push([r,o.identity,Atomics.load(o.state,0)+ +!!n?.has(r)|0])}return JSON.stringify([e.identity,e.generationId,i,readSqliteDatabaseGeneration(e,`unscopedWriteRevision`)+ +(n===null)|0,a])}function localScopedWriteToken(e,t,n){return JSON.stringify([`memory`,(K.localUnscopedRevisions.get(e)??0)+ +(n===null),t.map(t=>[t,K.localScopeRevisions.get(e).get(t).identity,Atomics.load(K.localScopeRevisions.get(e).get(t).state,0)+ +!!n?.has(t)|0])])}function normalizedWriteScopes(e){return[...new Set((typeof e==`string`?[e]:e).map(e=>JSON.stringify(typeof e==`string`?[`key`,at(e)]:[`session-id`,at(e.sessionId),...e.partition===void 0?[]:[at(e.partition)]])))].toSorted()}function ensureLocalWriteScopes(e,t){let n=K.localScopeRevisions.get(e)??/* @__PURE__ */ new Map;for(let e of t)n.has(e)||n.set(e,createScopeRevision());K.localScopeRevisions.set(e,n)}function readScopedWriteToken(t,n,r,i=0){let a=normalizedWriteScopes(n),o=e.admission(t);if(o?ensureWriteScopes(o,a):ensureLocalWriteScopes(t,a),e.readRevision(t)!==void 0)return o?scopedWriteToken(o,a,r,i):localScopedWriteToken(t,a,r)}function readSqliteDatabaseScopedWriteToken(e,t){return readScopedWriteToken(sqlPublicationAnchor(e),t)}function readSqliteDatabaseScopedWriteTokenForPath(t,n,r){let i=normalizedWriteScopes(n),a=e.pathAdmission(t,r);if(a&&!isSqliteDatabaseAdmissionRetired(a))return ensureWriteScopes(a,i),scopedWriteToken(a,i)}function readSqliteDatabaseScopedWriteTokensForPath(t,n){let r=e.pathAdmission(t);if(!r||isSqliteDatabaseAdmissionRetired(r))return;let i=n.map(normalizedWriteScopes);return ensureWriteScopes(r,i.flat()),i.map(e=>scopedWriteToken(r,e))}function readSqliteDatabasePendingScopedWriteToken(t,n){let r=sqlPublicationAnchor(t);return readScopedWriteToken(r,n,K.pendingWriteScopes.get(r),+!!e.hasPendingSchemaMutation(r))}function readSqliteDatabaseWriteTokenForPath(t){let n=e.pathAdmission(t);if(n&&!isSqliteDatabaseAdmissionRetired(n))return`${n.identity}:${n.generationId}:${readSqliteDatabaseGeneration(n,`writeRevision`)}`}function readSqliteDatabasePendingWriteToken(t){let n=sqlPublicationAnchor(t);if(!t.isOpen||!t.isTransaction&&!isPreparingSqliteNativeMutation(n)||!hasSqlitePostCommitScope(n)||e.suspended(n))return;let r=e.writer(n);if(r&&!isSqliteDatabaseAdmissionRetired(r))return`${r.identity}:${r.generationId}:${readSqliteDatabaseGeneration(r,`writeRevision`)+1|0}`}return{cancel(e){K.pendingWriteScopes.delete(e)},begin(e,t){let n=t?void 0:K.writeScopes.get(e),r=K.pendingWriteScopes.get(e);if(!n||r===null)K.pendingWriteScopes.set(e,null);else{let t=r??/* @__PURE__ */ new Set;for(let e of n)t.add(e);K.pendingWriteScopes.set(e,t)}},finish(e,t){let n=K.pendingWriteScopes.get(e);K.pendingWriteScopes.delete(e);let r=!n;if(n){let i=K.localScopeRevisions.get(e);for(let e of n){let n=i?.get(e);n&&Atomics.add(n.state,0,1);let a=t?.writeScopes.get(e);a&&Atomics.load(a.state,1)===0?Atomics.add(a.state,0,1):t&&(a||t.writeScopeRevision!==readSqliteDatabaseGeneration(t,`writeScopeRevision`))&&(r=!0)}}r&&(K.localUnscopedRevisions.set(e,(K.localUnscopedRevisions.get(e)??0)+1),t&&advanceSqliteDatabaseGeneration(t,`unscopedWriteRevision`))},settleWorker,onSqliteDatabaseWriteSettled,retireSqliteDatabaseWriteScopes,retainSqliteDatabaseWriteScopesForPath,prepareSqliteDatabaseScopedWriteRevisionForPath,withSqliteDatabaseWriteScope,withoutSqliteDatabaseWriteScope,readSqliteDatabaseScopedWriteToken,readSqliteDatabaseScopedWriteTokenForPath,readSqliteDatabaseScopedWriteTokensForPath,readSqliteDatabasePendingScopedWriteToken,readSqliteDatabaseWriteTokenForPath,readSqliteDatabasePendingWriteToken}}const mn=s(Symbol.for(`openclaw.postgresReadSnapshots`),()=>/* @__PURE__ */ new WeakMap),hn=s(Symbol.for(`openclaw.sqliteSchemaFacts`),()=>/* @__PURE__ */ new WeakMap);function observeSqliteTransactionState(e,t){let n=e.isTransaction;t.transactionOpen!==n&&(t.transactionOpen&&(t.mutationRevision+=1),t.transactionOpen=n,t.transactionMutationRevision=void 0,t.transactionSnapshot=void 0,t.transactionRead=!1,t.transactionCatalogBound=!1)}function finishSqliteReadScope(e,t,n,r,i,a){let o=e.isTransaction;!i&&n&&!o&&(t.mutationRevision+=1),t.transactionOpen=o,n&&o||(t.transactionMutationRevision=o?a:void 0),(n!==o||r)&&(t.transactionSnapshot=void 0,t.transactionRead=!1,t.transactionCatalogBound=!1)}const gn=s(Symbol.for(`openclaw.sqliteDatabaseCleanCloseSeals`),()=>new SqliteDatabaseCleanCloseSeals(publishFact,{retain:e=>z.registry.changeReferences(e,1),release:releaseReference,publish:e=>z.registry.publish(e),descriptor:e=>z.registry.descriptors.get(e.identity)})),_n=createSqliteDatabaseDescriptorOwner(gn),{prepareOwnedSqliteDatabaseAdmission:vn,prepareSqliteDatabaseAdmissionAsync:yn,retainSqliteDatabaseAdmissionLocation:bn,retainPreparedSqliteDatabaseAdmissionLocation:xn,prepareSqliteDatabaseAdmission:q}=_n,{pathAdmission:J}=_n;function prepareSqliteDatabaseCleanClose(e){return gn.prepare(e,admission$1(e),Dn(e,rn)??Dn(e,an))}const{readSqliteDatabaseCleanClose:Sn,readSqliteDatabaseWriteRevision:Cn,readSqliteDatabaseSiblingWriteRevision:wn,readSqliteDatabaseIntegrityVerification:Tn,readSqliteDatabaseCleanCloseRefusal:En,getSqliteDatabaseAdmission:Dn,getSqliteDatabaseSchemaRevision:On,getOrLoadSqliteDatabaseAdmissionForPath:kn,peekSqliteDatabaseAdmissionForPath:An,prepareSqliteDatabaseAdmissionForPath:jn,hasSqliteDatabaseSchemaAdmissionForPath:Mn,getSqliteDatabaseAdmissionIdentityForPath:Nn,getSqliteDatabaseAdmissionSourceForPath:Pn,observeSqliteDatabaseAdmissionLocation:Fn,hasSqliteDatabaseSchemaAdmissionForIdentity:In,retainSqliteDatabaseAdmissionForPath:Ln}=createSqliteDatabaseAdmissionReader({state:z,admission:admission$1,pathAdmission:J,prepareFileIdentity:q,integrityVerificationKey:rn,exchange:exchangeSqliteDatabaseAdmission,publishFact,retain:retainReference,release:releaseReference}),Y=createSqliteDatabaseWriteReceipts({admission:admission$1,pathAdmission:(e,t)=>t?t.key.startsWith(`file:`)?z.registry.records.get(`${t.key.slice(5)}:${t.birthtime}`):void 0:J(e),retain:retainReference,release:releaseReference,writeListeners:z.writeListeners,readRevision:Cn,writer:e=>z.dataWriters.get(e),suspended:e=>z.suspended.has(e),hasPendingSchemaMutation:e=>e.isTransaction&&hn.get(e)?.transactionalSchema===!0,publish(e,t){z.registry.publish(e,t),exchangeSqliteDatabaseAdmission(e)}}),{onSqliteDatabaseWriteSettled:Rn,retireSqliteDatabaseWriteScopes:zn,retainSqliteDatabaseWriteScopesForPath:Bn,prepareSqliteDatabaseScopedWriteRevisionForPath:Vn,withSqliteDatabaseWriteScope:Hn,withoutSqliteDatabaseWriteScope:Un,readSqliteDatabaseScopedWriteToken:Wn,readSqliteDatabaseScopedWriteTokenForPath:Gn,readSqliteDatabaseScopedWriteTokensForPath:Kn,readSqliteDatabasePendingScopedWriteToken:qn,readSqliteDatabaseWriteTokenForPath:Jn,readSqliteDatabasePendingWriteToken:Yn}=Y;function settleSqliteDatabaseAdmissionPublication(e){if(e.isTransaction||getSqliteNativeAdmissionFacts(e)||hasSqlitePostCommitScope(e)||z.exchanging)return!1;let t=admission$1(e);return t&&exchangeSqliteDatabaseAdmission(t,void 0,!0),!0}function bindSqliteDatabaseAdmission(e,t){z.connections.delete(e),z.openedIdentities.delete(e),z.unproven.delete(e);let n=e.location();if(!n||n===`:memory:`)return;let r=q(n);if(t!==void 0&&r!==t)throw Error(`SQLite database changed identity during native open`);if(!r)return;if(z.openedIdentities.set(e,r),t===void 0){z.unproven.add(e);return}let i=z.registry.records.get(r);(i&&!isSqliteDatabaseAdmissionRetired(i)||z.registry.descriptors.get(r)?.facts.size)&&admission$1(e)}function admission$1(e,t=!0){let n=z.openedIdentities.get(e);if(!e.isOpen||n===void 0||z.unproven.has(e))return;let r=z.connections.get(e);if(r)return isSqliteDatabaseAdmissionRetired(r)?void 0:r;let i=e.location();if(!i||i===`:memory:`)return;let a=t&&!e.isTransaction?J(i,n):z.registry.records.get(n);if(a&&a.identity!==n)throw Error(`SQLite database changed identity before admission`);return a&&!isSqliteDatabaseAdmissionRetired(a)?retainConnection(e,a):void 0}function retainConnection(e,t){let n=t.identity,r=t;try{for(;;){if(r.identity!==n)throw Error(`SQLite database changed identity during native open`);let t=z.registry.changeReferences(r,1),i=!1;try{t&&exchangeSqliteDatabaseAdmission(r);let n=readSqliteDatabaseGeneration(r,`retired`);if(n===0)return z.connections.set(e,r),i=!0,r;if(n!==2)throw Error(`SQLite database admission retired during native open`)}finally{i||z.registry.changeReferences(r,-1)}let a=e.location(),o=e.isTransaction?z.registry.records.get(n):a?J(a,q(a)):void 0;if(!o||isSqliteDatabaseAdmissionRetired(o))throw Error(`SQLite database admission unavailable during native open`);r=o}}catch(t){throw z.openedIdentities.delete(e),t}}function releaseSqliteDatabaseAdmission(e){let t=z.connections.get(e);z.openedIdentities.delete(e)&&t&&(z.local.delete(e),releaseReference(t))}function retainReference(e){z.registry.changeReferences(e,1)&&exchangeSqliteDatabaseAdmission(e)}function releaseReference(e){z.registry.changeReferences(e,-1)&&(z.localSchemaRevisions.delete(e.identity),exchangeSqliteDatabaseAdmission(e))}function publishFact(e,t,n,r){if(t.writer===`host`&&k!==0)throw Error(`SQLite host-owned admission facts require the host publisher`);publishSqliteDatabaseFact(e,t,n,r,`${k}:${++z.publication}`)&&(z.registry.publish(e),t.writer!==`connection`&&exchangeSqliteDatabaseAdmission(e))}function beginSqliteDatabaseWrite(e,t=!1){let n=admission$1(e);n&&Atomics.load(new Int32Array(n.generation),R.sealPresent)===1&&gn.invalidate(n.location,n),Y.begin(e,t),!z.dataWriters.has(e)&&(z.dataWriters.set(e,n),n&&Atomics.add(new Int32Array(n.references.get(k)),1,1))}function finishSqliteDatabaseWrite(e,t=!1){if(!z.dataWriters.has(e))return;let n=z.dataWriters.get(e);if(z.dataWriters.delete(e),t)Y.cancel(e),n&&Atomics.sub(new Int32Array(n.references.get(k)),1,1);else if(z.localWriteRevisions.set(e,(z.localWriteRevisions.get(e)??0)+1),Y.finish(e,n),n){advanceSqliteDatabaseGeneration(n,`writeRevision`),Atomics.sub(new Int32Array(n.references.get(k)),1,1);let e=z.writeListeners.get(n);e&&notifyListeners(e,void 0)}}function trackSqliteDatabaseAdmissionWorker(e){let t=e.threadId;e.once(`exit`,()=>{for(let e of z.registry.records.values())Y.settleWorker(e,t);z.registry.releaseWorker(t)})}function hasPendingSqliteDatabaseSchemaMutation(e){let t=sqlPublicationAnchor(e);return e.isTransaction&&z.schemaDirty.has(t)}function publishSqliteDatabaseAdmission(e,t,n,r={}){let i=sqlPublicationAnchor(e),a=admission$1(i,!e.isTransaction);if(!a||isSqliteDatabaseAdmissionRetired(a)||z.suspended.has(i))return;if(t.writer===`host`&&k!==0)throw Error(`SQLite host-owned admission facts require the host publisher`);let o=(t.schemaDependent?r.schemaRevision:void 0)??readSqliteDatabaseFactRevision(a,t.schemaDependent),s=isPostgresSqlConnection(e)?void 0:getSqliteNativeAdmissionFacts(e),c=admitSqliteDatabaseFactValue(t,n);if(!s&&!e.isTransaction&&!hasSqlitePostCommitScope(e)){publishFact(a,t,c,o);return}let l={...c,revision:o,schemaDependent:t.schemaDependent===!0,ddlRevision:z.ddlRevisions.get(i)??0};if(s){s.set(t.name,l);return}let u=z.local.get(i)??/* @__PURE__ */ new Map;z.local.set(i,u);let d=u.get(t.name);stageSqliteTransactionState(i,{stage:()=>u.set(t.name,l),rollback:()=>{z.local.get(i)===u&&(d===void 0?u.delete(t.name):u.set(t.name,d))},commit:()=>{z.local.get(i)===u&&u.get(t.name)===l&&(u.delete(t.name),l.revision!==readSqliteDatabaseFactRevision(a,l.schemaDependent)||l.schemaDependent&&l.ddlRevision!==(z.ddlRevisions.get(i)??0)||publishFact(a,t,l,l.revision))}})}function invalidateLocalSqliteSchemaAdmissions(e){let t=sqlPublicationAnchor(e),n=z.ddlRevisions.get(t)??0,r=z.schemaDirty.has(t),stage=()=>{z.ddlRevisions.set(t,n+1),z.schemaDirty.add(t)};stageSqliteTransactionState(t,{stage,commit:()=>{},rollback:()=>{z.ddlRevisions.set(t,n),r||z.schemaDirty.delete(t)}})||stage()}function discardSqliteDatabaseTransactionAdmissions(e){let t=sqlPublicationAnchor(e),n=admission$1(t,!1);for(let r of[isPostgresSqlConnection(e)?void 0:getSqliteNativeAdmissionFacts(e),z.local.get(t)]){for(let e of r?.keys()??[]){let t=n?.facts.get(e);t&&Atomics.store(new Int32Array(t.current),0,0)}r?.clear()}z.local.delete(t),z.rolledBack.add(t),e.isTransaction||z.schemaDirty.delete(t)}function publishSqliteDatabaseSchemaChange(e){let t=sqlPublicationAnchor(e),n=admission$1(t,!1);if(n){let e=advanceSqliteDatabaseGeneration(n,`schemaRevision`),r=z.ddlRevisions.get(t)??0;for(let n of z.local.get(t)?.values()??[])n.schemaDependent&&n.revision===e&&n.ddlRevision===r&&(n.revision=e+1)}else{let e=z.openedIdentities.get(t);e&&z.localSchemaRevisions.set(e,(z.localSchemaRevisions.get(e)??0)+1)}e.isTransaction||z.schemaDirty.delete(t)}function revoke(e,t=e?.location){t&&gn.invalidate(t,e),revokeSqliteDatabaseAdmissionFacts(e)}function revokeSqliteDatabaseAdmissions(e){revoke(z.connections.get(e)??admission$1(e)),z.local.delete(e)}function revokeSqliteDatabaseAdmissionsForPath(e){revoke(J(e),e)}function*captureSqliteDatabaseDescriptorCustodyLocations(){for(let{location:e}of z.registry.descriptors.values())yield e}function retireSqliteDatabaseAdmissionForPath(e,t={}){withSqliteDatabaseAdmissionSettlement(()=>{let n=q(e);if(!n)return;z.localSchemaRevisions.delete(n);let r=k===0?z.registry.records.get(n):J(e);z.registry.retireDescriptor(n,t)&&r&&exchangeSqliteDatabaseAdmission(r)})}function suspendSqliteDatabaseAdmission(e,t){t?z.suspended.add(e):z.suspended.delete(e)}function createLazyPromiseLoader(e,t={}){let n,createPromise=()=>{let r=Promise.resolve().then(e);return t.cacheRejections!==!0&&r.catch(()=>{n===r&&(n=void 0)}),r};return{load(){return n??=createPromise(),n},peek(){return n},clear(){n=void 0}}}function createLazyRuntimeSurface(e,t){let n=createLazyPromiseLoader(()=>e().then(t),{cacheRejections:!0});return Object.assign(n.load,{peek:n.peek,clear:n.clear})}function createLazyRuntimeModule(e){return createLazyRuntimeSurface(e,e=>e)}const X=s(Symbol.for(`openclaw.childRuntimeViability`),()=>({initialPath:process.execPath,initialIdentity:executableIdentity(process.execPath)})),Xn=/(?:dyld[^\n]*:\s*Library not loaded:|error while loading shared libraries:)/i,Zn=/(?:dyld[^\n]*:\s*Symbol not found:|symbol lookup error:|Error loading shared library|version [`'"][^`'"\r\n]+[`'"] not found)/i;function executableIdentity(e){try{return formatExecutableIdentity(Ge(e))}catch{return}}function formatExecutableIdentity({dev:e,ino:t,size:n,mtimeMs:r,mode:i}){return`${e}:${t}:${n}:${r}:${i}`}function publishRuntimeViability(e,t){return(_(t,`ENOENT`)||_(t,`ENOTDIR`))&&recordUnavailableRuntime(e,t),{execPath:e,available:!(X.execPath===e&&X.failure)}}function readChildRuntimeViability(e){let t=e?.execPath??process.execPath;if(X.execPath===t&&X.failure)return{execPath:t,available:!1};try{Re(t,ze.X_OK)}catch(e){return publishRuntimeViability(t,e)}return publishRuntimeViability(t)}async function prepareChildRuntimeViability(e){let t=e?.execPath??process.execPath,n=!(X.execPath===t&&X.failure);if(n)try{let e=await probeChildRuntimeExecutable(t);n=!classifyRuntimeProbe(t,e,await Ke.stat(t).then(formatExecutableIdentity,()=>void 0),e.error)}catch(e){n=publishRuntimeViability(t,await Ke.stat(t).then(()=>e,e=>e)).available}return{publish:()=>({execPath:t,available:n&&publishRuntimeViability(t).available})}}function recoverUnavailableRuntime(){if(X.execPath!==process.execPath||!X.failure||!X.recover||X.recoveryStarted)return;X.recoveryStarted=!0;let e=X.recover;l(()=>Promise.resolve().then(e).catch(()=>({status:`report-only`,reason:`Automatic runtime recovery is report-only: service or restart preparation failed. Inspect the service runtime and restart through its owner.`})).then(e=>{g(`gateway/runtime`).warn(`${e.status}: ${e.reason}`)}))}function runtimeProbeOptions(e={}){return{encoding:`utf8`,cwd:e.cwd??M.parse(process.execPath).root,env:e.env??{...process.env,NODE_OPTIONS:void 0},timeout:1e3,maxBuffer:8192}}async function probeChildRuntimeExecutable(e,t={}){let n=fe();if(n){let r=n.spawnExeca([e,`--version`],{...runtimeProbeOptions(t),extendEnv:!1,stripFinalNewline:!1,stdin:`ignore`});r.child.once(`spawn`,()=>{r.child.stdout?.resume(),r.child.stderr?.resume()});let i=ge(await r.result);return await r.child.waitForClose(),{stdout:typeof i.stdout==`string`?i.stdout:``,stderr:typeof i.stderr==`string`?i.stderr:``,error:i instanceof Error?i:void 0,status:i.exitCode??null,signal:i.signal??null}}return new Promise(n=>{lt(e,[`--version`],runtimeProbeOptions(t),(e,t,r)=>n({stdout:t,stderr:r,error:e??void 0,status:e?typeof e.code==`number`?e.code:null:0,signal:e?.signal??null}))})}function formatMissingChildRuntimeWarning(e){return e.available?void 0:`The Node.js runtime this Gateway started with (${m(e.execPath)}) can no longer start worker processes, likely because it was upgraded or removed. Restart the Gateway.`}function assertChildRuntimeAvailable(){if(X.execPath===process.execPath&&X.failure)throw X.failure}function recordUnavailableRuntime(e,t,n){if(X.execPath===e&&X.failure)return X.failure;X.execPath=e;let r=formatMissingChildRuntimeWarning({execPath:e,available:!1}),i=n?.trim();return X.failure=Object.assign(Error(i?`${r}\n${i}`:r,{cause:t}),{code:`NODE_RUNTIME_UNAVAILABLE`}),g(`gateway/runtime`).error(X.failure.message),recoverUnavailableRuntime(),X.failure}function needsRuntimeProbe(e){return!!(e.error||e.signal===`SIGABRT`||Zn.test(e.stderr??``))}function classifyRuntimeProbe(e,t,n,r){if(X.execPath===e&&X.failure)return X.failure;let i=e!==X.initialPath||n!==X.initialIdentity;return Xn.test(t.stderr)||Zn.test(t.stderr)||_(t.error,`ENOENT`)||_(t.error,`ENOTDIR`)||i&&(t.signal===`SIGABRT`||_(t.error,`ENOEXEC`)||_(t.error,`EACCES`)||_(t.error,`EPERM`))?recordUnavailableRuntime(e,r,t.stderr):void 0}function classifyChildRuntimeFailure(e){if(e.started)return;let t=e.execPath??process.execPath;if(X.execPath===t&&X.failure)return X.failure;if(Xn.test(e.stderr??``)||e.error&&!readChildRuntimeViability({execPath:t}).available)return recordUnavailableRuntime(t,e.error,e.stderr);if(needsRuntimeProbe(e))return classifyRuntimeProbe(t,dt(t,[`--version`],runtimeProbeOptions()),t===X.initialPath?executableIdentity(t):void 0,e.error)}async function prepareChildRuntimeFailure(e){if(e.started)return;let t=e.execPath??process.execPath;if(X.execPath===t&&X.failure)return X.failure;if(Xn.test(e.stderr??``)||e.error&&!(await prepareChildRuntimeViability({execPath:t})).publish().available)return recordUnavailableRuntime(t,e.error,e.stderr);if(!e.error&&needsRuntimeProbe(e))return classifyRuntimeProbe(t,await probeChildRuntimeExecutable(t),t===X.initialPath?await Ke.stat(t).then(formatExecutableIdentity,()=>void 0):void 0,e.error)}const Qn=new A;function getSpawnBrokerAdmission(){return Qn.getStore()??`command`}function waitForBrokerChildCompletion(e){return new Promise(t=>{let n=e.exitCode!=null||e.signalCode!=null,r=!e.connected,i=0,finish=()=>{n&&r&&i===0&&(e.removeListener(`exit`,onExit),e.removeListener(`error`,onError),e.removeListener(`disconnect`,onDisconnect),t())},onExit=()=>{n=!0,finish()},onError=()=>{e.pid===void 0&&(n=!0,r=!0,finish())},onDisconnect=()=>{r=!0,finish()};e.once(`exit`,onExit),e.on(`error`,onError),e.once(`disconnect`,onDisconnect);for(let t of e.stdio??[])t&&!t.closed&&(i++,t.once(`close`,()=>{i--,finish()}));finish()})}function observeBrokerChildDiagnostics(e){let t=process.execPath,n=!1;e.once(`message`,()=>{n=!0});let r=``;return e.stderr?.setEncoding(`utf8`).on(`data`,e=>{r=ne(r+e,2048)}),async()=>{let i=p(r).trim();return await prepareChildRuntimeFailure({execPath:t,stderr:r,signal:e.signalCode,started:n})??/* @__PURE__ */ Error(`exited with code=${e.exitCode??`null`} signal=${e.signalCode??`none`}${i?`\nstderr:\n${i}`:``}`)}}async function prepareBrokerFailureCause(e,t){try{return await e??t}catch(e){return AggregateError(t?[t,e]:[e],`Spawn broker diagnosis failed`,{cause:t})}}function createBrokerFailureError(e,t){return new b(e&&_(e,`NODE_RUNTIME_UNAVAILABLE`)?e.message:t?`Spawn broker exited; command outcome is unavailable`:`Spawn broker failed before readiness: ${e?.message??`channel lost`}`,{cause:e})}const Z=5e3;function isBrokerChildGroupAlive(e){if(ye(e.pid))return!1;let t=Te(e.pid);if(e.isLeaderAlive)return e.isLeaderAlive()||S(e.pid)?e.startedAt===null||t===null||t===e.startedAt:!1;if(e.startedAt===null||t===null&&!S(e.pid))throw new b(`Spawn broker group leader identity is unavailable for pid=${e.pid}`);return t===null||t===e.startedAt}function signalRevalidatedGroupMembers(e,t,{snapshot:n,signaled:r}){if(!ke())throw new b(`Spawn broker cannot verify the process table belongs to its PID namespace`);let a=n.filter(t=>t.pid!==process.pid&&t.pgid===e&&!S(t.pid));if(!a.length)return 0;let o=new Map(a.map(e=>[e.pid,Te(e.pid)])),s;for(let n of Oe(1e3)){if(n.pid===process.pid||n.pgid!==e||!o.has(n.pid))continue;let a=o.get(n.pid);if(a===null){if(!S(n.pid))throw new b(`Spawn broker cannot identify remaining group member pid=${n.pid}`);continue}if(Te(n.pid)!==a)continue;let c=`${n.pid}:${a}`;if(r.get(c)!==t){try{process.kill(n.pid,t)}catch(e){if(i(e)!==`ESRCH`){s??={error:e};continue}}r.set(c,t)}}if(s)throw s.error;return a.length}async function signalRevalidatedGroupMembersAsync(e,t,{snapshot:n,signaled:r}){if(!await Ee())throw new b(`Spawn broker cannot verify the process table belongs to its PID namespace`);let a=/* @__PURE__ */ new Map;for(let t of n)t.pid!==process.pid&&t.pgid===e&&!await C(t.pid)&&a.set(t.pid,await pe(t.pid,{instance:!0}));if(!a.size)return 0;let o;for await(let n of De(1e3)){if(n.pid===process.pid||n.pgid!==e||!a.has(n.pid))continue;let s=a.get(n.pid);if(s===null){if(!await C(n.pid))throw new b(`Spawn broker cannot identify remaining group member pid=${n.pid}`);continue}let c=await we(n.pid).catch(()=>void 0),l=t();if(!l)return a.size;if(!c||c.pgid!==e||c.startedAt!==s)continue;let u=`${n.pid}:${s}`;if(r.get(u)!==l){try{process.kill(n.pid,l)}catch(e){if(i(e)!==`ESRCH`){o??={error:e};continue}}r.set(u,l)}}if(o)throw o.error;return a.size}function terminateRetainedBrokerChildGroup(e){let t=!1,n=!1,r,a,o=`SIGTERM`,s=/* @__PURE__ */ new Map,signalMembers=()=>{try{signalRevalidatedGroupMembers(e.pid,o,{snapshot:[...Oe(1e3)],signaled:s})}catch(e){r=e}},signal=n=>{if(!t){if(!isBrokerChildGroupAlive(e))t=!0;else{o=n;try{process.kill(-e.pid,n)}catch(e){if(me(e,n))a=e,signalMembers();else if(i(e)===`ESRCH`)t=!0;else throw e}}}},force=()=>{t||n||(n=!0,signal(`SIGKILL`))};return{force,settled:(async()=>{let n=performance.now()+Z,i=n+2e3;try{for(signal(`SIGTERM`);!t&&isBrokerChildGroupAlive(e);){if(performance.now()>=n&&force(),a&&!t&&signalMembers(),performance.now()>=i)throw new b(`Spawn broker child cleanup could not be confirmed for pid=${e.pid}`,{cause:r??a});await mt(50)}}finally{t=!0}})()}}function terminateLostBrokerChild(e,t,n){if(t&&n){if(n.pid!==e)throw new b(`Spawn broker cleanup identity changed`);return terminateRetainedBrokerChildGroup(n)}let r=xe(e,{detached:t,graceMs:Z}),i=performance.now()+Z+2e3;return{force:()=>r?.force(),settled:(async()=>{for(;;){if(t){if(r?.exited(),await C(e)&&await x(e))break}else if(await C(e)&&(r?.exited()??!0))break;if(performance.now()>=i)throw new b(`Spawn broker child cleanup could not be confirmed for pid=${e}`);await mt(50)}})()}}function terminateBrokerProcessGroup(e){let t=!1,n,r,a=`SIGTERM`,o=/* @__PURE__ */ new Map,s,retire=()=>{t=!0,clearTimeout(s)},signalMembers=async()=>{try{let n=[];for await(let e of De(1e3))n.push(e);await signalRevalidatedGroupMembersAsync(e,()=>t?void 0:a,{snapshot:n,signaled:o})}catch(e){n=e}},signal=async o=>{if(t||he(e))retire();else{a=o;try{process.kill(-e,o)}catch(e){me(e,o)?(r=e,await signalMembers()):i(e)!==`ESRCH`&&(n=e)}}},force=()=>{if(!t){if(ye(e))retire();else{a=`SIGKILL`,clearTimeout(s);try{process.kill(-e,a)}catch(t){if(me(t,a)){r=t;try{signalRevalidatedGroupMembers(e,a,{snapshot:[...Oe(1e3)],signaled:o})}catch(e){n=e}}else i(t)!==`ESRCH`&&(n=t)}}}},c,escalate=()=>{t||c||(a=`SIGKILL`,c=(async()=>{await x(e)?retire():t||await signal(`SIGKILL`)})().catch(e=>{n=e}))};return{force,settled:(async()=>{try{if(await x(e))return;await signal(a),!t&&a===`SIGTERM`&&(s=setTimeout(escalate,Z));let i=performance.now()+Z+2e3;for(;await c,!(t||await x(e));){if(performance.now()>=i)throw new b(`Spawn broker group cleanup could not be confirmed for pgid=${e}`,{cause:n??r});r&&await signalMembers(),await mt(50)}}finally{retire(),await c}})()}}function createBrokerCommandRequest(e,t,n){let r=e.type!==`spawn-execa`&&e.outputFile?y():void 0,i=e.type===`spawn-execa`?y():void 0;return r?.promise.catch(()=>{}),i?.promise.catch(()=>{}),{child:new Ce(e.id,e.argv,n,!!r),initiateSpawn:t,result:i,output:r,childClosed:!1,resultSettled:!i&&!r,detached:e.options.detached===!0||e.type===`spawn-execa`&&e.options.killDescendants===!0}}function createBrokerCommands(t){let native=(e,n,r,i,a,o)=>{let s={type:i?`prepare-spawn`:`spawn`,id:t.nextId(),argv:[e,...n],options:r,execCgroup:a};return o&&(s.outputFile=o),t.admit(s,i)};return{spawn:(e,t,n,r,i)=>{let a=be(n);if(!a)throw Error(`Unsupported spawn broker stdio or process options`);return native(e,t,a,r,i).child},spawnToFile:(e,t,n,r,i,a)=>{let o=native(e,t,n,i,a,r);return{child:o.child,output:o.output.promise}},spawnExeca:(n,r,i)=>{let a=t.nextId(),o=t.admit({type:`spawn-execa`,id:a,argv:n,options:r,execCgroup:i});return{child:o.child,result:o.result.promise,cancel:()=>{t.cancel(a).catch(t=>o.child.fail(e(t,`Spawn broker cancellation delivery failed`)))}}}}}function receiveBrokerCommandResponse(e,t,n,r){if(t.type===`pipe`){try{if(t.closed&&t.fd===0){let n=new I;e.child.attachPipe(t.fd,n),n.destroy()}else if(n instanceof I)t.fd===0?ve(n):Se(n),e.child.attachPipe(t.fd,n);else throw new b(`Spawn broker pipe transfer failed`)}catch(e){throw n instanceof I&&n.destroy(),e}return r({type:`pipe-received`,id:t.id,fd:t.fd})}if(t.type===`pipe-prefix`){let n=e.child.stdio[t.fd];n instanceof I&&t.bytes.length>0&&n.unshift(t.bytes)}else t.type===`file-output`?(e.nativeClosed=!0,`error`in t?e.output?.reject(Object.assign(Error(t.error.message),t.error)):e.output?.resolve(t.bytes),e.resultSettled=!0,e.child.settleFileOutput()):t.type===`execa-result`?(e.pid===void 0&&t.result.failed&&e.child.markNotStarted(),e.result?.resolve(t.result),e.resultSettled=!0):(t.type===`closed`?e.nativeClosed=!0:t.type===`error`&&t.notStarted&&e.child.markNotStarted(),t.type===`error`&&t.resultUnavailable&&e.output&&(e.output.reject(Object.assign(Error(t.error.message),t.error)),e.resultSettled=!0,e.child.settleFileOutput()),t.type===`error`&&t.resultUnavailable&&e.result&&(e.result.reject(Object.assign(Error(t.error.message),t.error)),e.resultSettled=!0),e.child.receive(t))}var BrokerFileReads=class{constructor(e){this.host=e,this.pending=/* @__PURE__ */ new Map,this.sequence=0}get size(){return this.pending.size}async read(e,t){return(await this.request({filePath:e},t)).buffer}async readPage(e,t,n){return this.request({filePath:e,page:t},n)}async request(e,t){if(t?.throwIfAborted(),await this.host.ready(),t?.throwIfAborted(),!this.host.canAdmit())throw new b(`Spawn broker cannot admit a raw file read`);let n=++this.sequence,r=y();this.pending.set(n,{chunks:[],result:r});let abort=()=>{r.reject(t?.reason),this.host.send({type:`cancel-read-file`,id:n}).catch(()=>{})};t?.addEventListener(`abort`,abort,{once:!0}),this.host.send({type:`read-file`,id:n,...e}).catch(r.reject);try{return await r.promise}finally{t?.removeEventListener(`abort`,abort),this.pending.delete(n)}}receive(e){if(e.type!==`file-read-chunk`&&e.type!==`file-read-result`)return!1;let t=this.pending.get(e.id);return t&&(e.type===`file-read-chunk`?t.chunks.push(e.bytes):e.error?t.result.reject(Object.assign(e.error,{code:e.code})):t.result.resolve(e.page??{buffer:Buffer.concat(t.chunks)})),!0}fail(e){for(let t of this.pending.values())t.result.reject(e);this.pending.clear()}};const Q=1048576,$n=`openclaw-spawn-broker-frame`;var BrokerIpcAdmissionError=class extends b{};function createBrokerSender(t){let n=0,r=0,i=0,a=Promise.resolve(),write=(n,r,i)=>new Promise((a,o)=>{try{let launch=()=>t(n,r,e=>e?o(e):a());i?i(launch):launch()}catch(t){o(e(t,`Spawn broker IPC write failed`))}}),enqueue=(e,t)=>{if(n+e>268435456||r>=1024)return Promise.reject(new BrokerIpcAdmissionError(`Spawn broker IPC capacity exceeded`));n+=e,r+=1;let i=a.then(t);return a=i.then(()=>{},()=>{}),i.finally(()=>{n-=e,--r})};return Object.assign((e,t,n)=>{let r=F(e),a=r.byteLength;if(a>Q&&t)return Promise.reject(new BrokerIpcAdmissionError(`Spawn broker handle metadata exceeds one IPC frame`));let o=++i;return enqueue(a,async()=>{if(a<=Q)await write(e,t,n);else for(let e=0;e<a;e+=Q){let t={kind:$n,id:o,total:a,offset:e,bytes:r.subarray(e,e+Q)};await write(t,void 0,e+Q>=a?n:void 0)}})},{reserve(e){return enqueue(Q,()=>e(async e=>{if(F(e).byteLength>Q)throw new b(`Spawn broker reserved publication exceeds one IPC frame`);await write(e)}))}})}function createBrokerReceiver(){let e,clear=()=>{e=void 0};return{receive(t){if(!t||typeof t!=`object`||!(`kind`in t)||t.kind!==$n)return clear(),t;let n=t;if(!Number.isSafeInteger(n.id)||!Number.isSafeInteger(n.total)||n.total<=Q||n.total>268435456||!Number.isSafeInteger(n.offset)||!Buffer.isBuffer(n.bytes)||n.bytes.length===0||n.bytes.length>Q)throw new b(`Invalid spawn broker IPC frame`);let r=e?.id===n.id?e:void 0;if(!r){if(n.offset!==0)throw new b(`Spawn broker receive capacity exceeded`);e=r={id:n.id,total:n.total,received:0,chunks:[]}}if(r.total!==n.total||r.received!==n.offset||r.received+n.bytes.length>r.total)throw new b(`Out-of-order spawn broker IPC frame`);if(r.chunks.push(n.bytes),r.received+=n.bytes.length,!(r.received<r.total))return clear(),P(Buffer.concat(r.chunks,r.total))},clear}}function fitsBrokerSocketPath(e,t){return process.platform===`win32`||Buffer.byteLength(M.join(e,t))<=103}function createNativeResourceAuthority(){let e=`oc-br-${Ie(16).toString(`hex`)}`,t=$e(Ze(),e),n=process.platform===`win32`?void 0:fitsBrokerSocketPath(t,`resource.sock`)?t:$e(`/tmp`,e),r=Ie(32).toString(`hex`);return{directory:n,secret:r,endpoint:n?$e(n,`resource.sock`):`\\\\.\\pipe\\oc-br-${r}`}}const er=15e3,tr=process.hrtime.bigint.bind(process.hrtime);function spawnBrokerStartupNowMs(){return Number(tr()/1000000n)}var BrokerNativeResourceCloseError=class extends Error{constructor(e){super(`Native resource cleanup failed`),this.payload=e,this.name=`BrokerNativeResourceCloseError`}},BrokerResourceClaims=class{constructor(e){this.host=e,this.claims=/* @__PURE__ */ new Map,this.bufferedBytes=0,this.bufferedMessages=0,this.closeSequence=0,this.sealed=!1}get size(){return this.claims.size}get hasOpenClaims(){return[...this.claims.values()].some(e=>!e.closed)}get needsReference(){return[...this.claims.values()].some(e=>!e.closed&&(!e.created||!!(e.failure||e.pending)||e.ownerMessages.size>0))}get admissionClosed(){return this.failure!==void 0||this.sealed}capture(t,n){if(this.admissionClosed)throw this.failure??new b(`Native resource source is sealed`);let r=F(t);if(r.length>268435456)throw new b(`Native resource input exceeds IPC capacity`);let i=P(r),a={attachment:i,callbacks:n,inContext:A.snapshot(),attached:y(),ready:!1,created:!1,closed:!1,lastSequence:0,ownerSequence:0,ownerMessages:/* @__PURE__ */ new Map};a.attached.promise.catch(()=>{}),this.claims.set(i.id,a),this.host.refreshReference();let active=()=>{if(this.claims.get(i.id)!==a)throw new b(`Native resource claim is released`);if(a.failure)throw a.failure};return{attachment:i,receive:e=>{if(e.id!==i.id)throw new b(`Native resource response belongs to another claim`);this.receive(e)},ownerMessage:t=>{if(active(),a.closed)throw new b(`Native resource is closed`);let n=a.ownerSequence+1,r=F({type:`resource-owner`,id:i.id,sequence:n,value:t});if(this.bufferedBytes+r.length>268435456||this.bufferedMessages>=1024)throw new b(`Native resource owner delivery capacity exceeded`);a.ownerSequence=n;let o=P(r);return a.ownerMessages.set(n,{request:o,size:r.length}),this.bufferedBytes+=r.length,this.bufferedMessages++,this.host.refreshReference(),(async()=>{await a.attached.promise,active();let e=a.ownerMessages.get(n);!a.closed&&e&&await this.host.transmit(e.request)})().catch(t=>{let n=e(t,`Native resource owner delivery failed`);this.claims.get(i.id)===a&&!a.closed&&!a.failure&&a.inContext(()=>a.callbacks.failed(n))}),{sequence:n}},close:()=>{if(a.closed)return Promise.resolve();try{active()}catch(t){return Promise.reject(e(t,`Native resource is unavailable`))}if(a.pending)return a.pending.completion.promise;let t=--this.closeSequence,n=y();return n.promise.catch(()=>{}),a.pending={requestId:t,completion:n},this.host.refreshReference(),(async()=>{await a.attached.promise,active(),!a.closed&&a.pending?.requestId===t&&await this.host.transmit({type:`resource-close`,id:i.id,requestId:t})})().catch(r=>{a.pending?.requestId===t&&(a.pending=void 0,this.host.refreshReference(),n.reject(e(r,`Native resource close delivery failed`)))}),n.promise},release:()=>{if(this.claims.get(i.id)===a){if(!a.closed)throw new b(`Native resource must close before release`);this.host.transmit({type:`resource-release`,id:i.id}).catch(()=>{}),this.remove(a)}},abandonUnattached:()=>{if(this.claims.get(i.id)!==a)return;if(a.ready||a.created)throw new b(`Attached native resource cannot be abandoned`);let e=new b(`Native resource was never dispatched`);a.attached.reject(e),a.pending?.completion.reject(e),this.remove(a)}}}receive(t){let n=this.claims.get(t.id);if(!(!n||n.failure&&t.type!==`resource-closed`)){if(t.type===`resource-ready`){if(this.host.markReady(t.pid,t.generation),n.ready)return;n.ready=!0,n.attached.resolve()}else if(t.type===`resource-created`){if(n.created)return;n.created=!0,this.host.refreshReference()}else if(t.type===`resource-owner-received`||t.type===`resource-owner-rejected`){let r=n.ownerMessages.get(t.sequence);if(r&&(n.ownerMessages.delete(t.sequence),this.bufferedBytes-=r.size,this.bufferedMessages--,this.host.refreshReference(),t.type===`resource-owner-rejected`)){let r=e(decodeNativeWorkerFailure(t.error),`Native resource owner callback failed`);n.inContext(()=>n.callbacks.failed(r))}return}else if(t.type===`resource-owner`){if(t.sequence<=n.lastSequence)return;n.lastSequence=t.sequence,n.inContext(()=>n.callbacks.message(t));return}else if(t.type===`resource-closed`){if(n.closed)return;n.closed=!0,this.clearOwnerMessages(n),n.pending?.completion.resolve(),n.pending=void 0,this.host.refreshReference()}else if(t.type===`resource-close-error`){if(n.pending?.requestId===t.requestId){let r=n.pending;n.pending=void 0,this.host.refreshReference(),r.completion.reject(t.resourceError?new BrokerNativeResourceCloseError(t.error):e(decodeNativeWorkerFailure(t.error),`Native resource cleanup failed`))}}else if(t.type===`resource-failed`){let r=e(decodeNativeWorkerFailure(t.error),`Native resource failed`);n.inContext(()=>n.callbacks.failed(r));return}n.inContext(()=>n.callbacks.message(t))}}closeAdmission(){this.sealed=!0}seal(){return this.sealPromise||=(this.closeAdmission(),this.host.transmit({type:`resource-seal`}).then(()=>{for(let e of this.claims.values())e.attached.resolve()},e=>{throw a(e),e})),this.sealPromise}closeBeforeStartup(){for(let e of this.claims.values())this.receive({type:`resource-closed`,id:e.attachment.id,requestId:0})}fail(e){a(e),this.failure??=e;let t=[...this.claims.values()].filter(t=>this.rejectClaim(t,e)),n=o(t,t=>t.inContext(()=>t.callbacks.failed(e)));if(n.length)throw AggregateError(n,`Native resource failure callback failed`)}rejectClaim(e,t){return e.failure||e.closed?!1:(e.failure=t,this.host.refreshReference(),e.attached.reject(t),e.pending?.completion.reject(t),e.pending=void 0,!0)}clearOwnerMessages(e){for(let t of e.ownerMessages.values())this.bufferedBytes-=t.size,this.bufferedMessages--;e.ownerMessages.clear()}remove(e){this.clearOwnerMessages(e),this.claims.delete(e.attachment.id),this.host.refreshReference()}};const nr=[100,250,500,1e3,2e3];var BrokerHost=class{constructor(e={}){if(this.options=e,this.runInContext=A.snapshot(),this.readiness=y(),this.available=!1,this.hasBeenReady=!1,this.closing=!1,this.generation=0,this.consecutiveFailures=0,this.sequence=0,this.requests=/* @__PURE__ */ new Map,this.childAdmissions=/* @__PURE__ */ new Map,this.pendingSpawns=/* @__PURE__ */ new Set,this.fileReads=new BrokerFileReads({ready:()=>this.ready(),send:e=>this.transmit(e),canAdmit:()=>!this.resourceClaims&&!this.closing&&this.pendingSpawns.size+this.fileReads.size<256}),this.cleanups=/* @__PURE__ */ new Set,this.cleanupErrors=[],this.startupDeadline=0,this.onParentExit=()=>{this.process?.connected&&this.process.disconnect();for(let e of this.cleanups)e.force()},this.readFilePage=this.fileReads.readPage.bind(this.fileReads),this.commands=createBrokerCommands({nextId:()=>++this.sequence,admit:(e,t)=>this.admit(e,t),cancel:e=>this.transmit({type:`cancel`,id:e})}),this.spawn=this.commands.spawn,this.spawnExeca=this.commands.spawnExeca,this.spawnToFile=this.commands.spawnToFile,this.workerUrl=e.workerUrl??le(oe.spawnBroker),this.entryPath=N(this.workerUrl),e.nativeResources){let{directory:e,...t}=createNativeResourceAuthority();this.resourceDirectory=e,this.resourceAuthority=t,this.resourceClaims=new BrokerResourceClaims({transmit:async e=>{this.available||await this.ready(),await this.transmit(e)},markReady:(e,t)=>{if(!this.markNativeReady)throw new b(`Native resource broker unavailable`);this.markNativeReady(e,t)},refreshReference:()=>this.refreshNativeReference()})}this.readiness.promise.catch(()=>{}),this.start(),this.unregisterExitCleanup=h(this.onParentExit)}get pid(){return this.process?.pid}get hasOpenNativeResourceClaims(){return this.resourceClaims?.hasOpenClaims??!1}get nativeResourceAdmissionClosed(){return(this.resourceClaims?.admissionClosed??!1)||this.process?.connected===!1}ready(){return this.closing?Promise.reject(new b(`Spawn broker is closing`)):this.readiness.promise}readFile(e,t){return this.fileReads.read(e,t)}captureNativeResource(e,t){if(!this.resourceClaims||!this.resourceAuthority||this.closing||this.resourceClaims.size>=256)throw new b(`Native resource broker is unavailable or at capacity`);return this.resourceClaims.capture({...e,...e.moduleUrl.startsWith(`file:`)&&se(N(e.moduleUrl))?{sourceLoaderUrl:import.meta.resolve(`tsx/esm/api`)}:{},...this.resourceAuthority,generation:this.generation-1,startupDeadline:this.available?void 0:this.startupDeadline,id:++this.sequence},t)}sealNativeResources(){return this.resourceClaims&&!this.available?Promise.reject(new b(`Native resource broker is not ready for cleanup`)):this.resourceClaims?.seal()??Promise.reject(new b(`Native resources are disabled`))}serviceNativeResources(){this.serviceStartup?.()}refreshNativeReference(){this.resourceClaims&&this.process&&(this.closing||this.resourceClaims.needsReference||this.requests.size>0?(this.process.ref(),process.ref(this.process.stderr),this.process.channel?.ref?.()):(this.process.unref(),process.unref(this.process.stderr),this.process.channel?.unref?.()))}admit(e,t){e.admission=getSpawnBrokerAdmission();let n=_e(this.childAdmissions.values(),e.admission),r=createBrokerCommandRequest(e,t,this.transmit.bind(this)),{child:i,result:a,output:o}=r,fail=e=>{r.resultSettled=!0,a?.reject(e),o?.reject(e),i.settleFileOutput(),i.fail(e)};return!this.available||this.closing||this.pendingSpawns.size+this.fileReads.size>=256||n?(i.markNotStarted(),queueMicrotask(()=>fail(new b(this.available&&!this.closing?n??`Spawn broker startup capacity exceeded`:`Spawn broker is unavailable`))),r):(this.childAdmissions.set(e.id,e.admission),this.requests.set(e.id,r),this.pendingSpawns.add(e.id),this.refreshNativeReference(),i.waitForClose().then(()=>{r.childClosed=!0,this.retire(e.id,r)}),this.transmit(e).catch(t=>{if(this.pendingSpawns.delete(e.id),t instanceof BrokerIpcAdmissionError)i.markNotStarted();else if(r.output){this.process?.connected&&this.process.disconnect();return}!r.nativeInitiated&&e.type===`prepare-spawn`&&i.markNotStarted(),fail(new b(`Spawn broker request delivery failed`,{cause:t}))}),r)}retire(e,t){if(t.childClosed&&t.resultSettled&&!t.nativeInitiated){if(t.child.notStarted||!t.recovering&&t.nativeClosed)this.childAdmissions.delete(e);else if(!t.recovering||t.pid===void 0)return;this.requests.delete(e),this.refreshNativeReference()}}retainCleanup(t,n){this.cleanups.add(t),t.settled.then(()=>{this.cleanups.delete(t),n!==void 0&&this.childAdmissions.delete(n)},n=>{this.cleanupErrors.push(e(n,`Spawn broker cleanup failed`)),this.cleanups.delete(t)})}transmit(e,t,n){return!this.available||!this.sendMessage?Promise.reject(new b(`Spawn broker is unavailable`)):this.sendMessage(e,t,n)}start(){if(this.closing)return;try{assertChildRuntimeAvailable()}catch(e){this.readiness.reject(e);return}let t=this.generation++,n={type:`bootstrap`,...this.resourceAuthority?{nativeResource:{...this.resourceAuthority,generation:t}}:{}};if(F(n).byteLength>1024)throw new b(`Spawn broker bootstrap exceeds its IPC bound`);let r=ut(process.execPath,ue(this.workerUrl),{stdio:[`inherit`,`ignore`,`pipe`,`ipc`],detached:!0,serialization:`advanced`});this.process=r;let i=observeBrokerChildDiagnostics(r),a=!1,o=waitForBrokerChildCompletion(r),s,prepareTerminalDiagnosis=()=>s??=f?i():o.then(i),c;this.brokerClosed=o.then(async()=>{await c,a&&r.pid&&(r.exitCode!==0||r.signalCode!==null)&&this.cleanupErrors.push(new b(`Spawn broker shutdown failed`,{cause:await prepareTerminalDiagnosis().catch(t=>e(t,`Spawn broker exit diagnosis failed`))}))});let l=createBrokerReceiver(),u=y(),d=!1,f=!1;this.startupDeadline=spawnBrokerStartupNowMs()+er;let checkStartup=()=>{!d&&!f&&spawnBrokerStartupNowMs()>=this.startupDeadline&&fail(/* @__PURE__ */ Error(`readiness deadline exceeded after 15000ms`))},p=this.resourceClaims?void 0:setTimeout(checkStartup,er);this.serviceStartup=checkStartup;let fail=(e,t=!1)=>{if(d)return;a=this.closing,d=!0,clearTimeout(p),this.markNativeReady=void 0,l.clear(),this.available=!1,this.resourceClaims?.closeAdmission(),this.sendMessage=void 0,r.connected&&r.disconnect();let n=this.readiness;this.readiness=y(),this.readiness.promise.catch(()=>{});let i=this.requests;this.requests=/* @__PURE__ */ new Map,this.pendingSpawns.clear();let s=[];for(let[e,t]of i){if(t.recovering=!0,t.pid&&!t.nativeClosed){let n=t.pid;if(this.closing){let i;this.retainCleanup({force:()=>i?.force(),settled:u.promise.then(async()=>{(r.exitCode!==0||r.signalCode!==null)&&(i=terminateLostBrokerChild(n,t.detached),await i.settled)})},e)}else this.retainCleanup(terminateLostBrokerChild(n,t.detached),e)}else(t.child.notStarted||t.nativeClosed)&&this.childAdmissions.delete(e);t.output&&s.push(t)}if(this.refreshNativeReference(),r.pid&&process.platform!==`win32`){let e=r.pid,t;this.retainCleanup({force:()=>t?.force(),settled:u.promise.then(async()=>{t=terminateBrokerProcessGroup(e),await t.settled})})}c=prepareBrokerFailureCause(t?prepareTerminalDiagnosis():prepareChildRuntimeFailure({error:e,started:f}),e).then(e=>{let t=createBrokerFailureError(e,this.hasBeenReady);n.reject(t),this.fileReads.fail(t);for(let e of i.values())e.result?.reject(t),e.child.fail(t);if(i.clear(),s.length&&Promise.allSettled([o,...[...this.cleanups].map(e=>e.settled)]).then(()=>{for(let e of s)e.output?.reject(t),e.child.settleFileOutput();s.length=0}),this.resourceClaims||this.closing||!this.hasBeenReady||_(e,`NODE_RUNTIME_UNAVAILABLE`)){this.readiness.reject(t),this.resourceClaims?.fail(t);return}let r=nr[this.consecutiveFailures++];r===void 0?this.readiness.reject(t):this.restartTimer=setTimeout(()=>this.start(),r)})},markReady=(e,n)=>{if(d||e!==r.pid||n!==t)throw new b(`Native resource readiness does not match the captured broker`);f||(f=!0,clearTimeout(p),this.hasBeenReady=!0,this.consecutiveFailures=0,this.available=!0,this.readiness.resolve(),this.runInContext(()=>this.options.onReady?.(e,t>0)))};this.markNativeReady=markReady,r.once(`error`,fail),r.once(`exit`,()=>{d||(a=this.closing),u.resolve(),fail(void 0,!0)}),r.once(`disconnect`,()=>{f&&fail(/* @__PURE__ */ Error(`IPC channel disconnected`))}),r.on(`message`,(n,r)=>{if(d||this.closing){r instanceof I&&r.destroy();return}let i;try{i=l.receive(n)}catch(t){fail(e(t,`Spawn broker receive failed`));return}if(i===void 0)return;let a=i;if(a.type===`startup-failed`){if(!f&&this.resourceClaims){let t=this.resourceClaims;this.brokerClosed?.then(()=>t.closeBeforeStartup()).catch(t=>{this.cleanupErrors.push(e(t,`Spawn broker startup cleanup failed`))})}fail(Object.assign(Error(a.error.message),a.error));return}if(a.type===`ready`){try{markReady(a.pid,t)}catch(t){fail(e(t,`Spawn broker readiness failed`))}return}if(a.type===`resource-ready`||a.type===`resource-created`||a.type===`resource-target`||a.type===`resource-owner`||a.type===`resource-owner-received`||a.type===`resource-owner-rejected`||a.type===`resource-closed`||a.type===`resource-close-error`||a.type===`resource-failed`){try{this.resourceClaims?.receive(a)}catch(t){fail(e(t,`Spawn broker native resource receive failed`))}return}if(this.fileReads.receive(a))return;(a.type===`spawned`||a.type===`error`)&&this.pendingSpawns.delete(a.id);let o=this.requests.get(a.id);if(!o)r instanceof I&&r.destroy(),a.type===`pipe`?this.transmit({type:`pipe-received`,id:a.id,fd:a.fd}).catch(fail):a.type===`prepared`&&this.transmit({type:`launch`,id:a.id,allowed:!1}).catch(fail);else if((a.type===`owned`||a.type===`error`)&&(o.nativeInitiated?.resolve(),o.nativeInitiated=void 0),a.type===`prepared`){let e=o.initiateSpawn;o.initiateSpawn=void 0;let t=this.brokerClosed,n=e?o.nativeInitiated??=y():void 0,r=t&&n?Promise.race([n.promise,t]):Promise.reject(/* @__PURE__ */ Error(`Spawn broker retirement is unavailable`));r.catch(()=>{}),this.transmit({type:`launch`,id:a.id,allowed:!0},void 0,t=>{if(!e||!n||o.childClosed)throw new b(`Spawn broker launch grant is unavailable`);return e(t,r)}).catch(()=>{this.transmit({type:`launch`,id:a.id,allowed:!1}).catch(fail)})}else if(a.type===`owned`)o.pid=a.pid,o.childClosed&&(o.recovering=!0,this.retainCleanup(terminateLostBrokerChild(a.pid,o.detached),a.id),this.retire(a.id,o));else{try{receiveBrokerCommandResponse(o,a,r,e=>this.transmit(e))?.catch(fail)}catch(t){fail(e(t,`Spawn broker pipe setup failed`));return}this.retire(a.id,o)}});try{r.send(n,e=>{e&&fail(e)})}catch(t){fail(e(t,`Spawn broker bootstrap delivery failed`))}d||(this.sendMessage=createBrokerSender((e,t,n)=>r.send(e,t,{keepOpen:!0},n))),this.refreshNativeReference()}async waitForCleanup(){if(await Promise.allSettled([...this.cleanups].map(e=>e.settled)),this.cleanupErrors.length)throw AggregateError(this.cleanupErrors,`Spawn broker cleanup did not complete`)}close(){return this.resourceClaims?.hasOpenClaims?Promise.reject(new b(`Native resource claims must close before broker shutdown`)):this.closePromise??=this.closeInternal()}async closeInternal(){this.closing=!0,this.refreshNativeReference(),this.readiness.reject(new b(`Spawn broker is closing`)),this.fileReads.fail(new b(`Spawn broker is closing`)),clearTimeout(this.restartTimer);try{let e=this.process;e&&e.exitCode===null&&e.signalCode===null&&(this.resourceClaims?this.transmit({type:`shutdown`}).catch(()=>{e.connected&&e.disconnect()}):e.connected&&e.disconnect()),await this.brokerClosed;try{await this.waitForCleanup()}finally{this.resourceDirectory&&this.hasBeenReady&&await Je(this.resourceDirectory,{recursive:!0,force:!0})}}finally{this.unregisterExitCleanup()}this.options.onClosed?.()}};const createSpawnBrokerHost=e=>new BrokerHost(e);function createBrokerResourceSocket(t,n){let r=createBrokerReceiver(),i=Buffer.alloc(4),o=0,s,c=0,l=!1,u,d,stop=e=>{l||(l=!0,a(e),u=e,r.clear(),s=void 0,d?.(e??new b(`Spawn broker resource socket closed`)),t.destroy())},f=createBrokerSender((n,r,i)=>{if(l||t.destroyed){i(u??new b(`Spawn broker resource socket closed`));return}let a=F(n);if(a.length>268435456){i(new b(`Spawn broker resource frame exceeds capacity`));return}let o=Buffer.allocUnsafe(4+a.length);o.writeUInt32BE(a.length),a.copy(o,4);let complete=e=>{d===complete&&(d=void 0,i(e),e&&stop(e))};d=complete;try{t.write(o,e=>complete(e??null))}catch(t){complete(e(t,`Spawn broker resource write failed`))}});return t.on(`data`,t=>{try{let e=0;for(;e<t.length&&!l;){if(!s){let n=Math.min(4-o,t.length-e);if(t.copy(i,o,e,e+n),o+=n,e+=n,o!==4)continue;let r=i.readUInt32BE();if(r===0||r>268435456)throw new b(`Invalid spawn broker resource frame length`);s=Buffer.allocUnsafe(r),o=0}let a=Math.min(s.length-c,t.length-e);if(t.copy(s,c,e,e+a),c+=a,e+=a,c!==s.length)continue;let l=r.receive(P(s));if(s=void 0,c=0,l!==void 0){if(!l||typeof l!=`object`||!(`value`in l))throw new b(`Invalid spawn broker resource message`);n.message(l.value)}}}catch(t){stop(e(t,`Spawn broker resource read failed`))}}),t.once(`end`,()=>stop(s||o?new b(`Spawn broker resource socket ended during a frame`):void 0)),t.once(`error`,stop),t.once(`close`,()=>{stop(),n.close(u)}),{async send(e){if(l||t.destroyed)throw u??new b(`Spawn broker resource socket closed`);await f({value:e})},close:()=>stop()}}function attachBrokerNativeResource(n,r,i,o){let s=y();s.promise.catch(()=>{});let c,l,u,d=0,f=!1,p=!1,ee=!1,m=!1,h,g=!1,_,recordFailure=e=>{if(m)return;let t=h===void 0;a(e),h??=e,clearTimeout(u),clearTimeout(v),s.reject(e),_?.completion.reject(e),_=void 0,r.close(),t&&o(e)},lose=e=>{m||g||(g=!0,recordFailure(e),c?.close())},transmit=async(e,t=!1)=>{if(h&&(!t||g))throw h;if(!c||m)throw Error(`Native resource attachment is closed`);await c.send(e)},receive=a=>{if(!t(a)||a.id!==n.id||typeof a.type!=`string`){lose(/* @__PURE__ */ Error(`Invalid native resource response identity`));return}let o=a;if(o.type===`resource-target`)r.postMessage(o.value,[]);else if(i(o),o.type===`resource-ready`)f=!0,clearTimeout(v);else if(o.type===`resource-created`)p=!0,l?.unref(),s.resolve();else if(o.type===`resource-closed`)m=!0,clearTimeout(v),_?.completion.resolve(),_=void 0,r.close(),c?.close();else if(o.type===`resource-close-error`){if(_?.id===o.requestId){let t=_;_=void 0,t.completion.reject(o.resourceError?new BrokerNativeResourceCloseError(o.error):e(decodeNativeWorkerFailure(o.error),`Native resource close failed`))}}else o.type===`resource-failed`&&recordFailure(e(decodeNativeWorkerFailure(o.error),`Native resource failed`))},start=()=>{if(h||m)return;let t;try{t=pt(n.endpoint)}catch(t){queueMicrotask(()=>lose(e(t,`Native resource attachment failed`)));return}l=t;let r=!1,i;t.once(`error`,e=>{i=e}),c=createBrokerResourceSocket(t,{message:receive,close(e){m||g||(!r&&!f&&n.startupDeadline!==void 0&&spawnBrokerStartupNowMs()<n.startupDeadline?u=setTimeout(start,10):lose(e??i??/* @__PURE__ */ Error(`Native resource attachment lost`)))}}),t.once(`connect`,()=>{r=!0,ee=!0,transmit({type:`resource-attach`,attachment:n}).catch(t=>lose(e(t,`Native resource attachment failed`)))})},v=n.startupDeadline===void 0?void 0:setTimeout(()=>{f||lose(/* @__PURE__ */ Error(`Spawn broker readiness deadline exceeded`))},Math.max(0,n.startupDeadline-spawnBrokerStartupNowMs()));start();let assertCleanupAvailable=()=>{if(g&&h)throw h},failDelivery=(t,n)=>{let r=e(t,n);r!==h&&lose(r)};return s.promise.then(()=>{r.on(`message`,e=>{transmit({type:`resource-target`,id:n.id,value:e}).catch(e=>failDelivery(e,`Native resource input delivery failed`))}),r.unref()},()=>{}),{get dispatched(){return ee},ownerMessage(e,t){s.promise.then(()=>transmit({type:`resource-owner`,id:n.id,sequence:t,value:e},!0)).catch(e=>failDelivery(e,`Native resource owner delivery failed`))},async close(){if(m)return;if(assertCleanupAvailable(),!p)try{await s.promise}catch(e){if(!f||g)throw e}if(m)return;assertCleanupAvailable(),l?.ref();let t=_??{id:++d,completion:y()};_||(_=t,t.completion.promise.catch(()=>{}),transmit({type:`resource-close`,id:n.id,requestId:t.id},!0).catch(t=>lose(e(t,`Native resource close delivery failed`)))),await t.completion.promise},dispose(){clearTimeout(u),clearTimeout(v),c?.close()}}}const rr=s(Symbol.for(`openclaw.runtimeWorkerGeneration`),()=>new A);function resolveRuntimeWorkerGenerationUrl(e,t){return ae(e.href)?e:t?.resolve(e)??e}function captureRuntimeWorkerSource(e){let t=rr.getStore()?.generation,n=resolveRuntimeWorkerGenerationUrl(e,t);return n.href===e.href?{moduleUrl:e}:{moduleUrl:n,runtimeGeneration:t}}var NativeWorkerTaskPort=class{constructor(e,t){this.port=e,this.callbacks=t,this.pending=[],this.readMessage=()=>D(this.port),this.started=!1,this.disposed=!1,this.portClosed=!1,this.receive=e=>{observeWorkerMessage(e,`from_worker`),this.pending.push({type:`message`,value:e}),this.drain()},this.receiveError=e=>{this.pending.push({type:`messageerror`,error:e}),this.drain()},this.closed=()=>{this.portClosed=!0,this.drain(),this.fail(/* @__PURE__ */ Error(`Native worker task channel closed`))},e.on(`message`,this.receive),e.on(`messageerror`,this.receiveError),e.on(`close`,this.closed),e.unref()}fail(e){this.disposed||this.failure||(a(e),this.failure=e,this.callbacks.unavailable())}start(){this.started=!0}drain(){if(!this.disposed&&this.started)for(;;){let t=this.pending.shift();if(t)t.type===`message`?this.callbacks.message(t.value):this.callbacks.messageerror(t.error);else{if(this.portClosed||this.failure)return;let t;try{t=f(`worker:message-decode`,this.readMessage)}catch(t){this.fail(e(t,`Native worker task channel observation failed`));return}if(!t)return;observeWorkerMessage(t.message,`from_worker`),this.callbacks.message(t.message)}if(this.disposed)return}}service(){if(this.drain(),this.disposed||this.failure)return;if(this.portClosed){this.fail(/* @__PURE__ */ Error(`Native worker task channel closed`));return}let t;try{t=nativePortIsOpen(this.port)}catch(t){this.fail(e(t,`Native worker task channel observation failed`));return}t||(this.portClosed=!0,this.fail(/* @__PURE__ */ Error(`Native worker task channel closed`)))}assertAvailable(){if(this.failure)throw this.failure;if(this.disposed||this.portClosed)throw Error(`Native worker task channel is closed`)}postMessage(e,t){this.assertAvailable();let n=workerMessagePayloadBytes(e);this.port.postMessage(e,t),observeWorkerMessage(e,`to_worker`,`other`,n??null)}close(){this.disposed||(this.disposed=!0,this.pending.length=0,this.port.off(`message`,this.receive),this.port.off(`messageerror`,this.receiveError),this.port.off(`close`,this.closed),this.port.close())}};const ir={"catalog-page.worker.js":`catalog`,"code-mode.worker.js":`codeMode`,"disk-budget.worker.js":`diskBudget`,"document-extractor.worker.js":`document`,"manager-index.worker.js":`memoryIndex`,"manager-search.worker.js":`memorySearch`,"memory-index.worker.js":`memoryIndex`,"memory-search.worker.js":`memorySearch`,"run.worker.js":`teamReports`,"session-history.worker.js":`sessionHistory`},ar=new Map([...Object.entries(oe).map(([e,t])=>[Qe(t.distWorkerPath),e]),...Object.entries(ir)]);function workerRequestKind(e){return ar.get(Qe(e.pathname).replace(/\.(?:ts|mjs)$/,`.js`))??`extension`}var NativeWorker=class extends ht{get sourcePath(){if(!this.evalSource)return this.filename instanceof URL?this.filename.protocol===`file:`?N(this.filename):void 0:this.filename}get taskChannelFailure(){return this.taskPort?.failure}constructor(e,t,n,r,i,a,o){super(),this.runtime=e,this.id=t,this.filename=n,this.evalSource=r,this.ownsNativeResource=i,this.resourceConnection=a,this.runInContext=A.snapshot(),this.threadId=0,this.started=!1,this.executionStopped=!1,this.referenced=!0,this.stopping=!1,this.joined=!1,this.servicingResource=!1,this.resourceClosed=!1,this.supervisorJoined=!1,this.terminalObserved=!1,this.taskPortLossReported=!1,this.requestId=0,this.stopCompletion=createRetainedOperation(()=>this.service()),this.cpuRequests=/* @__PURE__ */ new Map,this.heapRequests=/* @__PURE__ */ new Map,this.diagnosticName=`worker:${!r&&n instanceof URL?workerRequestKind(n):`other`}`,o&&(this.taskPort=new NativeWorkerTaskPort(o,{message:e=>this.runInContext(()=>f(this.diagnosticName,()=>this.emit(`message`,e))),messageerror:e=>this.runInContext(()=>this.emit(`messageerror`,e)),unavailable:()=>this.observeTaskPortLoss()}))}get needsReference(){return this.referenced||this.stopping||this.executionStopped&&this.ownsNativeResource&&!this.joined||this.cpuRequests.size>0||this.heapRequests.size>0}service(){this.runtime.service()}serviceTaskPort(){let e=this.taskPort;e&&(f(this.diagnosticName,()=>e.service()),this.observeTaskPortLoss())}observeTaskPortLoss(){let e=this.taskPort?.failure;!e||!this.started||!this.referenced||this.taskPortLossReported||this.terminalObserved||this.stopping||this.joined||this.executionStopped||this.runtime.failure||(this.taskPortLossReported=!0,this.runInContext(()=>this.emit(`error`,e)))}serviceResource(){if(!(!this.resourceBinding||this.servicingResource||this.joined)){this.servicingResource=!0;try{this.resourceBinding.service()}catch(e){this.resourceFailed(e)}finally{this.servicingResource=!1}}}attachResource(e){return this.resourceBinding=this.bindResource(e),{workerDataKey:e.workerDataKey,attachment:this.resourceBinding.attachment}}bindResource(t){let n=this.runtime.resourceBroker(),r=this.resourceConnection,i=!1,a=n.captureNativeResource({moduleUrl:t.moduleUrl,input:t.input,ownerPort:!!r},{message:e=>{e.type===`resource-owner`?r?.port.postMessage(e.value,[]):e.type===`resource-closed`&&this.runInContext(()=>{this.resourceClosed=!0,(this.supervisorJoined||this.executionStopped)&&this.finishJoined(this.executionExitCode)})},failed:e=>this.resourceFailed(e)}),forward=t=>{if(!i)try{let e=a.ownerMessage(t);this.runtime.failure||this.runtime.post({type:`resource-owner`,id:this.id,sequence:e.sequence,value:t})}catch(t){this.resourceFailed(e(t,`Native resource owner delivery failed`))}};r?.port.on(`message`,forward),r?.port.unref();let dispose=()=>{i||(i=!0,r?.port.off(`message`,forward),r?.port.close(),r?.dispose())};return{attachment:a.attachment,receive(e){a.receive(e)},service(){if(!i&&r)for(r.service();;){let e=D(r.port);if(!e)break;forward(e.message)}},async closeAfterSupervisor(){try{await n.sealNativeResources(),await a.close()}catch(e){throw e instanceof BrokerNativeResourceCloseError&&r?.decodeCloseError?r.decodeCloseError(e.payload):e}},release(){a.release(),dispose()},abandonUnattached(){a.abandonUnattached(),dispose()}}}abandonResource(){this.taskPort?.close(),this.resourceBinding?this.resourceBinding.abandonUnattached():this.resourceConnection?.dispose()}resourceFailed(t){this.runInContext(()=>{this.rejectStopCompletion(t),this.emit(`error`,e(t,`Native resource observation failed`))})}rejectStopCompletion(e){a(e),this.stopCompletion.reject(e)}recoverResource(){if(!this.resourceBinding||this.joined||this.resourceRecovery)return;let e=this.resourceBinding.closeAfterSupervisor();this.resourceRecovery=e,e.then(()=>this.runInContext(()=>{this.finishJoined(void 0)}),e=>this.runInContext(()=>{this.stopping=!1,this.rejectStopCompletion(e)}))}postMessage(e,t=[]){if(this.joined||this.stopping||this.executionStopped)throw Error(`Native worker is closing`);if(this.runtime.failure)throw this.runtime.failure;this.taskPort?this.taskPort.postMessage(e,t):this.runtime.post({type:`post`,id:this.id,value:e,transferList:t},t)}ref(){if(this.runtime.failure)throw this.runtime.failure;return this.taskPort?.assertAvailable(),this.referenced=!0,this.runtime.refreshReference(),this}unref(){if(this.referenced=!1,!this.joined&&this.runtime.failure)throw this.runtime.failure;return this.runtime.refreshReference(),this}stop(){if(this.joined)return this.stopCompletion.operation.read().status!==`fulfilled`&&(this.stopCompletion=createRetainedOperation(()=>this.service()),this.stopCompletion.resolve()),this.stopCompletion.operation;if(this.stopCompletion.operation.read().status===`rejected`&&(this.stopCompletion=createRetainedOperation(()=>this.service())),this.supervisorJoined&&this.resourceBinding)return this.rejectStopCompletion(Error(`Native resource cleanup is still retained after supervisor loss`,{cause:this.runtime.failure})),this.recoverResource(),this.stopCompletion.operation;if(!this.stopping){this.stopping=!0;try{this.runtime.post({type:`stop`,id:this.id})}catch(e){this.stopping=!1,this.rejectStopCompletion(e)}this.runtime.refreshReference()}return this.stopCompletion.operation}terminate(){return this.stop().result}cpuUsage(e){return this.requestSample(this.cpuRequests,{type:`cpu`,previous:e})}getHeapStatistics(){return this.requestSample(this.heapRequests,{type:`heap`})}requestSample(e,t){if(this.joined)return Promise.reject(/* @__PURE__ */ Error(`Native worker exited`));let n=createRetainedOperation(()=>this.service()),r=++this.requestId;e.set(r,n);try{this.runtime.post({...t,id:this.id,requestId:r})}catch(t){e.delete(r),n.reject(t)}return this.runtime.refreshReference(),n.operation.result}rejectSamples(e){for(let t of[...this.cpuRequests.values(),...this.heapRequests.values()])t.reject(e);this.cpuRequests.clear(),this.heapRequests.clear()}ownerFailed(e){this.runInContext(()=>{this.terminalFailure??=e,this.taskPort?.close(),this.stopping=!1,this.rejectSamples(e),this.rejectStopCompletion(e),this.emit(`error`,e)})}ownerJoined(e){this.runInContext(()=>{if(this.terminalFailure??=e,this.stopping=!1,this.supervisorJoined=!0,this.rejectSamples(e),this.finishExecution(void 0),this.ownsNativeResource){if(this.resourceClosed){this.finishJoined(void 0);return}this.rejectStopCompletion(Error(`Native resource cleanup outcome is unavailable after owner loss`,{cause:e})),this.recoverResource()}else this.finishJoined(void 0)})}finishJoined(e){this.joined||(this.joined=!0,this.taskPort?.close(),this.threadId=-1,this.stopping=!1,this.referenced=!1,this.rejectSamples(/* @__PURE__ */ Error(`Native worker exited`)),this.stopCompletion.resolve(),this.runtime.handles.delete(this.id),this.runtime.failure||this.runtime.post({type:`release`,id:this.id}),this.runtime.refreshReference(),this.resourceBinding?this.resourceBinding.release():this.resourceConnection?.dispose(),this.finishExecution(e),this.emit(`exit`,e))}finishExecution(e){this.executionStopped||(this.taskPort?.close(),this.executionStopped=!0,this.executionExitCode=e,this.emit(`execution-exit`,e)),this.resourceClosed&&!this.joined&&this.finishJoined(e)}receive(e){this.runInContext(()=>f(this.diagnosticName,()=>{(e.type===`error`||e.type===`messageerror`||e.type===`create-error`||e.type===`execution-exit`||e.type===`stopped`||e.type===`stop-error`)&&(this.terminalObserved=!0,this.taskPort?.drain()),this.receiveOwned(e)}))}receiveOwned(t){if(t.type===`created`)this.started=!0,this.threadId=t.threadId,trackNativeWorkerForCpu(this,this.filename,this.evalSource),this.taskPort?.start(),this.emit(`started`),this.taskPort?.drain(),this.observeTaskPortLoss();else if(t.type===`message`)this.emit(`message`,t.value);else if(t.type===`resource-message`)this.resourceBinding?.receive(t.response);else if(t.type===`error`||t.type===`messageerror`){let n=e(decodeNativeWorkerFailure(t.error),`Native worker failed`);this.terminalFailure??=n,this.emit(t.type,n)}else if(t.type===`create-error`){this.joined=!0,this.threadId=-1,this.referenced=!1;let n=e(decodeNativeWorkerFailure(t.error),`Native worker creation failed`);this.rejectSamples(n),this.stopCompletion.resolve(),this.runtime.handles.delete(this.id),this.runtime.refreshReference(),this.abandonResource(),this.emit(`error`,n)}else if(t.type===`stopped`)this.finishExecution(t.code),this.finishJoined(t.code);else if(t.type===`execution-exit`)this.finishExecution(t.code);else if(t.type===`stop-error`){let n=this.stopping;this.stopping=!1;let r;try{if(t.resourceError){if(!this.resourceConnection?.decodeCloseError)throw Error(`Native resource cleanup error decoder is unavailable`,{cause:t.error});r=this.resourceConnection.decodeCloseError(t.error)}else r=e(decodeNativeWorkerFailure(t.error),`Native worker stop failed`)}catch(t){r=e(t,`Native resource cleanup error decoding failed`)}this.rejectStopCompletion(r),n||this.emit(`error`,r)}else if(t.type===`cpu`)this.cpuRequests.get(t.requestId)?.resolve(t.value),this.cpuRequests.delete(t.requestId);else if(t.type===`heap`)this.heapRequests.get(t.requestId)?.resolve(t.value),this.heapRequests.delete(t.requestId);else if(t.type===`request-error`){let n=e(decodeNativeWorkerFailure(t.error),`Native worker observation failed`);this.cpuRequests.get(t.requestId)?.reject(n),this.heapRequests.get(t.requestId)?.reject(n),this.cpuRequests.delete(t.requestId),this.heapRequests.delete(t.requestId)}this.runtime.refreshReference()}};const $=s(Symbol.for(`openclaw.nativeWorkerLifetimes`),()=>({nextId:0,sources:/* @__PURE__ */ new WeakMap,defaultBroker:{}}),closeDefaultRetainedNativeWorkerSource);async function closeDefaultRetainedNativeWorkerSource(){await $.defaultSource?.close()}function forgetNativeSource(e){e.runtimeGeneration?$.sources.get(e.runtimeGeneration)===e&&$.sources.delete(e.runtimeGeneration):$.defaultSource===e&&($.defaultSource=void 0)}function nativeCleanupFailures(e){return e.flatMap(e=>e.status===`rejected`?[e.reason]:[])}function nativeResourceBroker(e){return e.broker.host??=l(()=>createSpawnBrokerHost({nativeResources:!0,workerUrl:e.brokerModuleUrl}))}async function retireNativeResourceBroker(e){let t=e.broker;if(await t.closing,e.hasActiveWorkers||t.retainedUntilProcessExit||t.host?.hasOpenNativeResourceClaims)return!1;let n=t.host;return t.host=void 0,await(t.closing=n?.close()),t.closing=void 0,!0}function nativeRuntime(t){if(t.closing)throw Error(`Native worker source is closing`);let n=t.runtime;if(n){if(n.failure)throw n.failure;return n}return l(()=>{let{port1:n,port2:r}=new je,i=t.moduleUrl,o=createSqliteDatabaseAdmissionCursor();captureSqliteDatabaseAdmissions(o);let s;try{s=createCpuTrackedWorker(i,{execArgv:ce(i),env:Ne,workerData:{port:r},transferList:[r]})}catch(e){throw n.close(),r.close(),e}let c=/* @__PURE__ */ new Map,l=y();l.promise.catch(()=>void 0);let u=!1,terminateOwner=()=>{if(!u){u=!0,s.ref(),n.ref();try{s.terminate().catch(l.reject)}catch(e){l.reject(e)}}},receive=e=>{observeWorkerMessage(e,`from_worker`,`lifecycle`),c.get(e.id)?.receive(e)},readControlMessage=()=>D(n),d={databaseAdmissionCursor:o,handles:c,service(){for(;;){let e=f(`worker:control-decode`,readControlMessage);if(!e)break;receive(e.message)}let e=[...c.values()];for(let t of e)t.serviceTaskPort(),t.serviceResource();if(d.failure)return;let r;try{r=nativePortIsOpen(n)}catch(e){fail(Error(`Native worker lifetime channel observation failed`,{cause:e})),terminateOwner();return}r?t.broker.host?.serviceNativeResources():(fail(/* @__PURE__ */ Error(`Native worker lifetime channel closed`)),terminateOwner())},post(e,t=[]){if(d.failure)throw d.failure;let r=workerMessagePayloadBytes(e);n.postMessage(e,t),observeWorkerMessage(e,`to_worker`,`lifecycle`,r??null)},resourceBroker(){return nativeResourceBroker(t)},refreshReference(){[...c.values()].some(e=>e.needsReference)?(s.ref(),n.ref()):(s.unref(),n.unref())},close(){return d.failure??=/* @__PURE__ */ Error(`Native worker lifetime owner is closing`),a(d.failure),terminateOwner(),l.promise}},fail=t=>{if(!d.failure){d.failure=e(t,`Native worker lifetime owner failed`),a(d.failure);for(let e of c.values())e.ownerFailed(d.failure)}};return n.on(`message`,receive),n.on(`messageerror`,e=>{try{fail(e)}finally{terminateOwner()}}),s.on(`message`,e=>receiveWorkerMemoryPort(s,e)),s.on(`error`,fail),s.once(`exit`,()=>{setImmediate(()=>{let e=d.failure??/* @__PURE__ */ Error(`Native worker lifetime owner exited`);a(e),d.failure=e,t.closing=!0;for(let t of c.values())t.ownerJoined(e);n.close(),l.resolve()})}),t.runtime=d,d.refreshReference(),d})}function captureRetainedNativeWorkerSource(e){let t=resolveRuntimeProcessEntrypointUrl(`workerNativeLifecycle`),n=e===void 0?captureRuntimeWorkerSource(t):{moduleUrl:resolveRuntimeWorkerGenerationUrl(t,e.runtimeGeneration),runtimeGeneration:e.runtimeGeneration},r=n.runtimeGeneration?$.sources.get(n.runtimeGeneration):$.defaultSource;if(r)return r;!n.runtimeGeneration&&$.defaultBroker.host?.nativeResourceAdmissionClosed&&($.defaultBroker={});let i={...n,broker:n.runtimeGeneration?{}:$.defaultBroker,brokerModuleUrl:resolveRuntimeWorkerGenerationUrl(resolveRuntimeProcessEntrypointUrl(`spawnBroker`),n.runtimeGeneration),closing:!1,get hasActiveWorkers(){return!!i.runtime?.handles.size},activeWorkerPaths(){return[...i.runtime?.handles.values()??[]].map(e=>e.sourcePath)},retireIdleBroker(){return retireNativeResourceBroker(i)},close(){return s??=Promise.resolve().then(async()=>{try{let e=nativeCleanupFailures(await Promise.allSettled([...o.values()].map(e=>e())));if(e.length)throw AggregateError(e,`Native worker execution owner cleanup failed`);if(i.hasActiveWorkers)throw Error(`Native worker execution owners have not joined`);i.closing=!0,await i.runtime?.close(),await retireNativeResourceBroker(i),forgetNativeSource(i),o.clear()}catch(e){throw i.closing||(s=void 0),a(e),e}})},create(e,t,n,r){try{return startNativeWorker(nativeRuntime(i),e,t??{},n,r)}catch(e){throw r?.host.close(),r?.worker.close(),e}},async captureIndependentResource(e,t){if(await i.broker.closing,i.closing)throw Error(`Native worker source is closing`);let r=nativeResourceBroker(i),{port1:a,port2:s}=new je,c=y(),fail=e=>{c.reject(e),s.close()},l=r.captureNativeResource({moduleUrl:String(resolveRuntimeWorkerGenerationUrl(e,n.runtimeGeneration)),input:t,ownerPort:!1},{message(e){e.type===`resource-created`&&c.resolve()},failed:fail}),u=attachBrokerNativeResource(l.attachment,a,e=>l.receive(e),fail),d=!1,f={port:s,retainBrokerUntilProcessExit(){i.broker.retainedUntilProcessExit=!0},async close(){d||(u.dispatched?(await u.close(),await l.close(),l.release()):l.abandonUnattached(),u.dispose(),a.close(),s.close(),d=!0,o.delete(f),i.closing&&await retireNativeResourceBroker(i))}};try{return await c.promise,f}catch(e){try{await f.close()}catch(t){throw i.retain(f,()=>f.close()),AggregateError([e,t],`Native resource creation cleanup failed`,{cause:t})}throw e}},captureResource(e,t,r,i){let a=A.snapshot();return Object.freeze({moduleUrl:String(resolveRuntimeWorkerGenerationUrl(e,n.runtimeGeneration)),workerDataKey:t,input:r===void 0?void 0:structuredClone(r),connect:i?()=>a(()=>{let e=i(),t=e.decodeCloseError?.bind(e);return{port:e.port,service:()=>a(()=>e.service()),dispose:()=>a(()=>e.dispose()),decodeCloseError:t?e=>a(()=>t(e)):void 0}}):void 0})},retain(e,t){o.set(e,t),n.runtimeGeneration?.retain(i,()=>i.close())}},o=/* @__PURE__ */ new Map,s;return n.runtimeGeneration?$.sources.set(n.runtimeGeneration,i):$.defaultSource=i,i}function createRetainedNativeWorker(e,t={},n,r,i){try{return(n??captureRetainedNativeWorkerSource({runtimeGeneration:void 0})).create(e,t,r,i)}catch(e){throw i?.host.close(),i?.worker.close(),e}}function startNativeWorker(e,t,n,r,i){let a=++$.nextId,o,s,c=!1;try{o=r?.connect?.(),s=new NativeWorker(e,a,t,n.eval===!0,r!==void 0,o,i?.host);let{env:l,transferList:u=[],...d}=n;e.handles.set(a,s);let f=r?s.attachResource(r):void 0,p=captureSqliteDatabaseAdmissions(e.databaseAdmissionCursor);c=!0,e.post({type:`create`,id:a,filename:{kind:t instanceof URL?`url`:`path`,value:String(t)},environmentData:captureSqliteWorkerEnvironmentData(p),options:{...d,environment:{...l===Ne?process.env:l??process.env},shareEnvironment:l===Ne},transferList:[...u],resource:f,taskPort:i?.worker},i?[...u,i.worker]:u)}catch(t){throw c&&(e.databaseAdmissionCursor=createSqliteDatabaseAdmissionCursor()),e.handles.delete(a),e.refreshReference(),s?s.abandonResource():(i?.host.close(),o?.dispose()),i?.worker.close(),t}return e.refreshReference(),s}export{getSqliteRuntimeCapabilities as $,SqliteWorkerError as $t,bn as A,flushWorkerDiagnostics as At,hn as B,mapRetainedOperation as Bt,q as C,SqliteSnapshotCleanupError as Ct,publishSqliteDatabaseSchemaChange as D,throwSqliteLifecycleErrors as Dt,publishSqliteDatabaseAdmission as E,runWithSqliteCleanup as Et,suspendSqliteDatabaseAdmission as F,receiveWorkerMemoryPort as Ft,installSqliteNativeRuntimeAdmission as G,currentSqliteOperationTiming as Gt,observeSqliteNativeOperations as H,recordWorkerMessage as Ht,trackSqliteDatabaseAdmissionWorker as I,recordPostgresPoolSelfRoot as It,quoteSqliteIdentifier as J,assertSqliteDatabaseAdmissionWaitActive as Jt,requireNodeSqlite as K,registerSqliteReaderConnection as Kt,finishSqliteReadScope as L,trackNativeWorkerForCpu as Lt,revokeSqliteDatabaseAdmissions as M,isWorkerGcObservationEnabled as Mt,revokeSqliteDatabaseAdmissionsForPath as N,markWorkerRetirement as Nt,releaseSqliteDatabaseAdmission as O,attributeWorkerToPool as Ot,settleSqliteDatabaseAdmissionPublication as P,observeTrackedPostgresBridgeCounters as Pt,ensureSqliteLibrarySelected as Q,withSqliteDatabaseAdmissionWait as Qt,observeSqliteTransactionState as R,createRetainedOperation as Rt,Fn as S,It as St,prepareSqliteDatabaseCleanClose as T,createSqliteLifecycleAggregateError as Tt,canPreserveTransactionSnapshot as U,classifyWorkerRequest as Ut,observeSqliteNativeClose as V,recordWorkerAuthorityMessage as Vt,stageSqliteTransactionState as W,normalizeWorkerRequestClass as Wt,resolveSqliteDatabaseFilePath as X,readSqliteDatabaseAdmissionDeadline as Xt,beginSqliteDatabaseAdmissionOperation as Y,hasSqliteDatabaseAdmissionWait as Yt,captureSqliteWorkerClosePolicy as Z,withSqliteDatabaseAdmissionSettlement as Zt,Nn as _,encodeNativeWorkerFailure as _t,resolveRuntimeWorkerGenerationUrl as a,createSqliteDatabaseAdmissionCursor as an,registerListener as at,In as b,OpenClawStateOwnershipError as bt,prepareChildRuntimeFailure as c,assertDatabaseFileIdentity as cn,markSqliteInspectionOperation as ct,bindSqliteDatabaseAdmission as d,normalizeDatabasePath as dn,sqliteErrorCode as dt,retainSqliteWorkerErrorCode as en,withSelectedSqliteLibraryEnv as et,captureSqliteDatabaseDescriptorCustodyLocations as f,readDatabaseFileIdentity as fn,sqliteExtendedResultCode as ft,Dn as g,decodeNativeWorkerFailure as gt,kn as h,readDatabasePathIdentitySync as hn,nativePortIsOpen as ht,captureRuntimeWorkerSource as i,withSqliteDatabaseAdmissionExchange as in,notifyListeners as it,retireSqliteDatabaseAdmissionForPath as j,getTrackedPostgresBridgeCounters as jt,xn as k,createCpuTrackedWorker as kt,createLazyRuntimeModule as l,findChangedDatabasePaths as ln,markSqliteNativeOpenFailure as lt,finishSqliteDatabaseWrite as m,readDatabasePathIdentity as mn,withSqliteNativeOpen as mt,createRetainedNativeWorker as n,captureSqliteDatabaseAdmissions as nn,isPostgresSqlConnection as nt,assertChildRuntimeAvailable as o,readSqliteDatabaseAdmissionIdentity as on,isSqliteCorruptionError as ot,discardSqliteDatabaseTransactionAdmissions as p,readDatabaseIdentityBirthtime as pn,sqlitePrimaryResultCode as pt,normalizeSchemaSql as q,observeSqliteReaderCounters as qt,workerRequestKind as r,installSqliteDatabaseAdmissions as rn,sqlPublicationAnchor as rt,classifyChildRuntimeFailure as s,readSqliteDatabaseAdmissions as sn,isSqliteLockError as st,captureRetainedNativeWorkerSource as t,canShareSqliteDatabaseAdmissions as tn,readProcessMachineIdentity as tt,beginSqliteDatabaseWrite as u,inspectDatabasePathIdentitySync as un,readSqliteInspectionOperation as ut,On as v,resolveRuntimeProcessEntrypointUrl as vt,yn as w,classifyRetiredSqliteSnapshotRemovalError as wt,invalidateLocalSqliteSchemaAdmissions as x,OpenClawStateOwnershipMetadataError as xt,hasPendingSqliteDatabaseSchemaMutation as y,OpenClawStateExternalOwnershipError as yt,mn as z,flatMapRetainedOperation as zt};