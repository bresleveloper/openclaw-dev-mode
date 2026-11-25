import{a as isRecord}from"./record-coerce-DwDZngEy.mjs";import{l as resolveGlobalSingleton}from"./string-coerce-BBqv4GXj.mjs";import{o as wrapSqliteWorkerError}from"./sqlite-worker-error-27MOaEMJ.mjs";import{f as sqlitePrimaryResultCode,r as isSqliteLockError}from"./sqlite-error-diagnostics-BiABvfN9.mjs";import{t as hasErrnoCode}from"./errno-DUBt6SQQ.mjs";import{t as createSubsystemLogger}from"./subsystem-rLS79yG2.mjs";import{t as formatErrorMessage}from"./errors-B4gik7lY.mjs";import{t as createDeferredCore}from"./deferred-QsZCoVH-.mjs";import{a as runtimeProcessScriptEntrypoints}from"./runtime-process-manifest-R14UjMiH.mjs";import{a as registerListener,i as notifyListeners,n as isPostgresSqlConnection,r as sqlPublicationAnchor}from"./sql-connection-Di4IkB2k.mjs";import{t as isPromiseLike}from"./promise-like-OKzBwzLG.mjs";import{a as inspectDatabasePathIdentity,c as normalizeDatabasePath,s as isSoleDatabaseFileDescriptor,t as assertDatabaseFileIdentity,u as readDatabaseIdentityBirthtime}from"./sqlite-worker-identity-gGA4fE_R.mjs";import{l as parseDiagnosticEnvFlags}from"./diagnostic-events-ChHDG7Ru.mjs";import{t as AsyncContext}from"./async-context-BikFC1Fp.mjs";import{c as createSqliteLifecycleAggregateError}from"./sqlite-lifecycle-errors-BKA8AtC6.mjs";import{t as PROCESS_MACHINE_IDENTITY_KEY}from"./current-machine-identity-Cuko3i3v.mjs";import{n as resolveRuntimeScriptEnv,r as resolveStandaloneSidecarRoot}from"./cli-invocation-07_mWkPV.mjs";import{a as normalizeSchemaSql,d as splitSqlList,i as hasUnquotedSqlKeyword,l as readSqlToken,n as findSqlCharacter,o as normalizeSqlIdentifier,r as findSqlClosingParenthesis,s as normalizeSqlWhitespace,u as readTableConstraintKeyword}from"./sqlite-schema-sql-D2HdV_QG.mjs";import{n as compareValidSemver}from"./semver-OLQE-AMj.mjs";import{createRequire}from"node:module";import{AsyncLocalStorage}from"node:async_hooks";import{isPromise}from"node:util/types";import{isDeepStrictEqual,toUSVString}from"node:util";import{spawnSync}from"node:child_process";import fsSync,{existsSync}from"node:fs";import{normalizeWindowsPathForComparison}from"@openclaw/fs-safe/path";import path,{posix}from"node:path";import{fileURLToPath,pathToFileURL}from"node:url";import{createHash,randomUUID}from"node:crypto";import fsPromises from"node:fs/promises";import os from"node:os";import{getEnvironmentData,isMainThread,setEnvironmentData,threadId}from"node:worker_threads";
//!src/infra/sqlite-post-commit.ts
const log=createSubsystemLogger(`sqlite/publication`);function committedPublicationState(e){return{commit:e.installFacts,prepareObservers:e.installProjection,invalidate:e.invalidate}}function installCommittedState(e,t){const n=/* @__PURE__ */ new Map;const install=(e,t)=>{try{t?.()}catch(t){n.set(e,t)}};for(const t of e)install(t,t.commit);const invalidate=()=>{let e=true;for(const[t,r]of n)try{if(t.invalidate)t.invalidate(r);else e=false}catch{e=false}return e};invalidate();for(const t of e)if(!n.has(t))install(t,t.prepareObservers);const r=invalidate();if(n.size>0)try{log.error(`Committed SQLite facts could not be installed`,{count:n.size,fenced:r})}catch{}if(!r)return;for(const e of t)try{e()}catch{try{log.error(`SQLite post-commit notification failed`)}catch{}}}function publishSqliteCommittedState(e){const t=`installFacts`in e?[e]:e;installCommittedState(t.map(committedPublicationState),t.map(e=>e.notify))}function stageSqliteCommittedPublication(e,t){if(!stageSqliteTransactionState(e,committedPublicationState(t)))return false;deferSqlitePostCommitPublication(e,t.notify);return true}const pendingPublications=resolveGlobalSingleton(Symbol.for(`openclaw.sqlitePostCommitPublications`),()=>/* @__PURE__ */ new WeakMap);const pendingTransactionState=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteTransactionState`),()=>/* @__PURE__ */ new WeakMap);function hasSqlitePostCommitScope(e){return pendingPublications.has(sqlPublicationAnchor(e))}function deferSqlitePostCommitPublication(e,t){const n=pendingPublications.get(sqlPublicationAnchor(e));if(!n)return false;n.push(t);return true}function stageSqliteTransactionState(e,t){const n=pendingTransactionState.get(sqlPublicationAnchor(e));if(!n)return false;t.stage?.();n.push({prepareCommit:t.prepareCommit,commit:t.commit,prepareObservers:t.prepareObservers,invalidate:t.invalidate,rollback:t.rollback});return true}function prepareSqliteTransactionCommit(e){for(const t of pendingTransactionState.get(sqlPublicationAnchor(e))??[])t.prepareCommit?.()}function rollbackTransactionState(e,t,n=`rolled-back`){const r=[];for(const i of e.toReversed())try{if(n===`unknown`&&i.invalidate)i.invalidate(t);else i.rollback?.(t)}catch(e){r.push(e)}if(r.length>0)throw createSqliteLifecycleAggregateError([t,...r],`SQLite transaction and rollback observers failed`,t)}function discardSqliteTransactionState(e,t,n=`unknown`){const r=sqlPublicationAnchor(e);pendingPublications.get(r)?.splice(0);const i=pendingTransactionState.get(r)?.splice(0)??[];pendingPublications.delete(r);pendingTransactionState.delete(r);rollbackTransactionState(i,t,n)}function withSqlitePostCommitPublications(e,t){const n=sqlPublicationAnchor(e);const r=e.isTransaction||pendingPublications.has(n);const i=r?pendingPublications.get(n):[];const a=r?pendingTransactionState.get(n):[];const o=i?.length??0;const s=a?.length??0;if(!r&&i&&a){pendingPublications.set(n,i);pendingTransactionState.set(n,a)}let c;try{c=t()}catch(e){i?.splice(o);rollbackTransactionState(a?.splice(s)??[],e);throw e}finally{if(!r){pendingPublications.delete(n);pendingTransactionState.delete(n)}}if(!r)installCommittedState(a??[],i??[]);return c}
//!src/infra/sqlite-reader-lifecycle.ts
const readerOwners=new AsyncContext(Symbol.for(`openclaw.sqliteReaderOwners`));const connections=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteReaderConnections`),()=>({nextId:0,byDatabase:/* @__PURE__ */ new WeakMap,byPath:/* @__PURE__ */ new Map,finalizer:new FinalizationRegistry(e=>forgetConnection(e))}));function sqliteReaderDatabasePathKey(e){const t=path.resolve(e);return process.platform===`win32`?normalizeWindowsPathForComparison(t):t}function boundedOperation(e){return(e.trim()||`sqlite reader`).slice(0,120)}function captureSqliteReaderOwner(){const e=readerOwners.getStore();if(!e)return;const{timing:t,...n}=e;return n}function currentSqliteOperationTiming(){return readerOwners.getStore()?.timing}function readSqliteOperationHoldContext(e,t){const n=currentSqliteOperationTiming();return{...e,...n?.holdContext,...t&&n?.hydrationActiveEvents!==void 0?{activeEvents:n.hydrationActiveEvents,metadataRows:n.hydrationMetadataRows,metadataLimit:n.hydrationMetadataLimit,exhausted:n.hydrationExhausted,dependencyRows:n.hydrationDependencyRows}:{}}}function currentOwner(e,t){const n=t??readerOwners.getStore();return{operation:boundedOperation(n?.operation??e),ownerKind:n?.ownerKind??(isMainThread?`main`:`worker`),...n?.actorId!==void 0?{actorId:n.actorId}:{}}}function connectionFor(e){let t=connections.byDatabase.get(e);if(!t){const n=Date.now();const r=e.location();t={id:++connections.nextId,path:r?sqliteReaderDatabasePathKey(r):void 0,database:new WeakRef(e),owner:currentOwner(`sqlite connection`),openedAtMs:n,readers:/* @__PURE__ */ new Map};connections.byDatabase.set(e,t);connections.finalizer.register(e,t,t)}if(t.path){const e=connections.byPath.get(t.path)??/* @__PURE__ */ new Map;e.set(t.id,t);connections.byPath.set(t.path,e)}return t}function forgetConnection(e){if(e.path){const t=connections.byPath.get(e.path);t?.delete(e.id);if(t?.size===0)connections.byPath.delete(e.path)}}function registerSqliteReaderConnection(e){if(e.isOpen)connectionFor(e)}function retainSqliteReader(e,t,n){const r=connectionFor(e);const i=Date.now();const a={...currentOwner(t,n),kind:`iterator`,connectionId:r.id,threadId,startedAtMs:i,lastProgressAtMs:i};const o=Symbol(a.operation);const s=r.readers;s.set(o,a);return{progress(){if(s.has(o))a.lastProgressAtMs=Date.now()},release(){s.delete(o)}}}function diagnostics(e){const t=Date.now();return[...e].map(({startedAtMs:e,lastProgressAtMs:n,...r})=>Object.assign(r,{ageMs:Math.max(0,t-e),idleMs:Math.max(0,t-n)})).toSorted((e,t)=>t.ageMs-e.ageMs).slice(0,8)}function readSqliteReaderDiagnosticsForPath(e){const t=sqliteReaderDatabasePathKey(e);const n=connections.byPath.get(t);const r=[];const i=[];const a=Date.now();for(const e of n?.values()??[]){const t=e.database.deref();if(!t?.isOpen){forgetConnection(e);continue}i.push(...e.readers.values());r.push({...e.owner,connectionId:e.id,threadId,ageMs:Math.max(0,a-e.openedAtMs),transactionOpen:t.isTransaction,trackedReaders:e.readers.size})}return{scope:`current-thread`,blockingOwner:`unknown`,nativeStatements:`unobserved`,threadId,observedAtMs:a,connectionCount:r.length,readerCount:i.length,connections:r.toSorted((e,t)=>t.trackedReaders-e.trackedReaders||Number(t.transactionOpen)-Number(e.transactionOpen)).slice(0,8),activeReaders:diagnostics(i)}}function assertNoActiveSqliteReaders(e,t){const n=diagnostics(connections.byDatabase.get(e)?.readers.values()??[]);if(n.length===0)return;const r=n[0];throw new Error(`${t} retained ${n.length} active SQLite reader(s); oldest operation=${r.operation} ageMs=${r.ageMs}`)}
//!src/infra/bun-sqlite-library-probe.generated.ts
const BUN_SQLITE_LIBRARY_PROBE_SOURCE=`import{createRequire}from"node:module";try{const candidate=process.argv[2];if(!candidate||process.argv.length!==3){throw new Error("Expected one SQLite library path")}const require2=createRequire(import.meta.url);const{Database}=require2("bun:sqlite");Database.setCustomSQLite(candidate);const database=new Database(":memory:");let facts;try{facts=database.query("SELECT sqlite_version() AS version, sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted").get()}finally{database.close()}process.stdout.write(JSON.stringify({protocol:1,version:facts.version,extensionLoadingSupported:facts.omitted===0}))}catch(error){process.stdout.write(JSON.stringify({protocol:1,error:(error instanceof Error?error.message:String(error)).slice(0,512)}));process.exitCode=1}
`;
//!src/infra/runtime-process-script-file.ts
function materializeRuntimeProcessScriptFile(e,t={}){const n=fsSync.mkdtempSync(path.join(t.parentDirectory??os.tmpdir(),`openclaw-script-`));const r=path.join(n,e.fileName);let i=false;const dispose=()=>{if(i)return;try{fsSync.rmSync(n,{recursive:true,force:true});i=true}catch(e){process.emitWarning(`Runtime script cleanup failed at ${n}: ${e instanceof Error?e.message:String(e)}`)}};try{fsSync.writeFileSync(r,e.source,{mode:384,flag:`wx`});return{url:pathToFileURL(r),dispose}}catch(e){dispose();throw e}}
//!src/infra/bun-sqlite-library-probe.ts
function probeBunSqliteLibrary(e){const t=materializeRuntimeProcessScriptFile({fileName:runtimeProcessScriptEntrypoints.bunSqliteLibraryProbe.fileName,source:BUN_SQLITE_LIBRARY_PROBE_SOURCE});try{const n=fileURLToPath(t.url);const r=path.dirname(n);const i=path.join(r,`bunfig.toml`);fsSync.writeFileSync(i,``,{mode:384,flag:`wx`});const a={};for(const e of[`SystemRoot`,`SYSTEMROOT`,`WINDIR`,`TEMP`,`TMP`,`TMPDIR`])if(process.env[e])a[e]=process.env[e];const o=spawnSync(process.execPath,[`--no-install`,`--no-env-file`,`--config=${i}`,n,path.resolve(e)],{cwd:r,env:resolveRuntimeScriptEnv(a),encoding:`utf8`,stdio:[`ignore`,`pipe`,`pipe`],timeout:5e3,killSignal:`SIGKILL`,maxBuffer:4096});if(o.error)throw o.error;const s=parseProbeFacts(o.stdout);if(o.status!==0)throw new Error(s&&`error`in s&&typeof s.error===`string`?s.error.slice(0,512):`SQLite library probe failed (${o.signal??o.status})`);if(!s||!(`version`in s)||typeof s.version!==`string`||s.version.length>64||!(`extensionLoadingSupported`in s)||typeof s.extensionLoadingSupported!==`boolean`)throw new Error(`SQLite library probe returned invalid output`);return{version:s.version,extensionLoadingSupported:s.extensionLoadingSupported}}finally{t.dispose()}}function parseProbeFacts(e){let t;try{t=JSON.parse(e)}catch{return}return typeof t===`object`&&t!==null&&!Array.isArray(t)&&`protocol`in t&&t.protocol===1?t:void 0}
//!src/infra/sqlite-database-admission-key.ts
const SQLITE_DATABASE_ADMISSIONS_KEY=`openclaw.sqliteDatabaseAdmissions.v1`;function isSqliteWalResetSafeVersion(e){const t=/^(\d+)\.(\d+)\.(\d+)$/u.exec(e.trim());if(!t)return false;const[n,r,i]=t.slice(1).map(Number);if(![n,r,i].every(Number.isSafeInteger))return false;return n>3||n===3&&(r>51||r===51&&i>=3||r===50&&i>=7||r===44&&i>=6)}
//!src/infra/bun-sqlite-library.ts
const WORKER_SELECTION_KEY=`openclaw.bunSqliteLibrarySelection`;const WORKER_CAPABILITIES_KEY=`openclaw.sqliteRuntimeCapabilities`;const SQLITE_NATIVE_RUNTIME_ADMISSION_KEY=`openclaw.sqliteNativeRuntimeAdmission`;function createCapabilities(e){let t;let n;let r=0;const i=Object.freeze({explicitSqliteCloseReleasesNativeResources:false,decided:false,reason:`SQLite close capability has not been decided`});function decide(e){if(!t){t=Object.freeze(e);setEnvironmentData(WORKER_CAPABILITIES_KEY,t);if(t.explicitSqliteCloseReleasesNativeResources&&r>0)process.emitWarning(`SQLite close became capable after ${r} topology owners were created; those owners remain conservative`,{code:`SQLITE_EARLY_TOPOLOGY`})}return t}function conservative(e){return{explicitSqliteCloseReleasesNativeResources:false,decided:true,reason:e}}function settled(){if(t)return t;if(!process.versions.bun)return decide({explicitSqliteCloseReleasesNativeResources:true,decided:true,reason:`Node runtime`});if(process.platform===`win32`)return decide(conservative(`Bun Windows native-close conformance is not qualified`));if(!isMainThread)return decide({...i,reason:`Parent did not complete SQLite close admission`,...getEnvironmentData(WORKER_CAPABILITIES_KEY)})}return{get(){return settled()??i},capture(){const e=settled()??i;if(!e.decided)r+=1;return e.explicitSqliteCloseReleasesNativeResources},initialize(){n??=(async()=>{e();const t=settled();if(t)return t;try{if(parseDiagnosticEnvFlags(process.env.OPENCLAW_DIAGNOSTICS).flags.some(e=>e.toLowerCase()===`sqlite.close.conservative`))return decide(conservative(`SQLite close optimization disabled by internal diagnostic flag`));const{probeSqliteNativeClose:e}=await import(`./bun-sqlite-close-probe-3j9VBakC.mjs`);return decide({...await e(),decided:true})}catch(e){return decide(conservative(`SQLite close check failed: ${String(e)}`))}})();return n}}}function selectLibrary(e){const{Database:t}=createRequire(import.meta.url)(`bun:sqlite`);t.setCustomSQLite(e)}function createSelector(){let e;let t;return(n={})=>{if(t)throw t;if(e)return e;const r=n.explicitPath??(process.env.OPENCLAW_SQLITE_LIBRARY?.trim()||void 0);if(!process.versions.bun||process.platform!==`darwin`){e=r?{source:`runtime`,ignoredOverride:`OPENCLAW_SQLITE_LIBRARY requires Bun on macOS`}:{source:`runtime`};return e}const i=n.standaloneRoot??resolveStandaloneSidecarRoot();const a=r===void 0&&i!==void 0?posix.join(i,`lib/libsqlite3.dylib`):void 0;const o=process.env.HOMEBREW_PREFIX?.trim();const s=r!==void 0?[r]:[.../* @__PURE__ */ new Set([...a?[a]:[],...o?[posix.join(o,`opt/sqlite/lib/libsqlite3.dylib`)]:[],`/opt/homebrew/opt/sqlite/lib/libsqlite3.dylib`,`/usr/local/opt/sqlite/lib/libsqlite3.dylib`,`/opt/local/lib/libsqlite3.dylib`])];const c=[];for(const n of s){const i=r!==void 0?`env`:n===a?`bundled`:`discovered`;let o;let s=true;try{try{o=probeBunSqliteLibrary(n)}catch(e){s=existsSync(n);throw s?e:new Error(`missing file`,{cause:e})}if(!isSqliteWalResetSafeVersion(o.version))throw new Error(`SQLite version ${o.version} below the WAL safety floor`);if(!o.extensionLoadingSupported)throw new Error(`built with SQLITE_OMIT_LOAD_EXTENSION`)}catch(e){if(r===void 0){if(s||n===a)c.push(`${n} (${e instanceof Error?e.message:String(e)})`);continue}t=selectionError(n,e,i===`bundled`);throw t}try{selectLibrary(n)}catch(e){t=selectionError(n,e,i===`bundled`);throw t}e={source:i,path:n,version:o.version,extensionLoadingSupported:true};return e}t=/* @__PURE__ */ new Error(`No supported SQLite library for Bun on macOS (${process.arch})`+(c.length>0?`; unusable: ${c.join(`, `)}`:``)+`. Apple's system SQLite fails OpenClaw's read-only database connections. `+(a?`Rebuild or replace the complete standalone artifact to restore its bundled SQLite library. `:``)+`Install one with brew install sqlite, or set OPENCLAW_SQLITE_LIBRARY to a libsqlite3.dylib built for ${process.arch}.`);throw t}}function selectionError(e,t,n=false){const r=n?`Rebuild or replace the complete standalone artifact (openclaw and runtime/), or set OPENCLAW_SQLITE_LIBRARY to a supported library.`:`Fix or unset OPENCLAW_SQLITE_LIBRARY; install a supported library with brew install sqlite.`;return new Error(`Cannot use ${n?`bundled `:``}SQLite library ${e}: ${t instanceof Error?t.message:String(t)}. ${r}`,{cause:t})}function readPublishedSqliteLibrarySelection(){return getEnvironmentData(WORKER_SELECTION_KEY)}function withSelectedSqliteLibraryEnv(e){if(!process.versions.bun||process.platform!==`darwin`)return e;const t=readPublishedSqliteLibrarySelection();return t&&t.source!==`runtime`&&e.OPENCLAW_SQLITE_LIBRARY!==t.path?{...e,OPENCLAW_SQLITE_LIBRARY:t.path}:e}function createRuntimeSelector(){const e=Boolean(process.versions.bun)&&process.platform===`darwin`;let t;if(e&&!isMainThread)t=readPublishedSqliteLibrarySelection();const n=createSelector();let r=false;return i=>{const a=t??n(i);if(e&&isMainThread&&!r){setEnvironmentData(WORKER_SELECTION_KEY,Object.freeze({...a}));r=true}return a}}function runtimeSelector(){return resolveGlobalSingleton(Symbol.for(`openclaw.bunSqliteLibrarySelection`),createRuntimeSelector)}function capabilities(){const e=runtimeSelector();return e.capabilities??=createCapabilities(e)}function getSqliteRuntimeCapabilities(){return capabilities().get()}function captureSqliteWorkerClosePolicy(){return capabilities().capture()}function captureSqliteWorkerEnvironmentData(e=getEnvironmentData(SQLITE_DATABASE_ADMISSIONS_KEY)){return[[WORKER_SELECTION_KEY,ensureSqliteLibrarySelected()],[WORKER_CAPABILITIES_KEY,getSqliteRuntimeCapabilities()],[SQLITE_NATIVE_RUNTIME_ADMISSION_KEY,getEnvironmentData(SQLITE_NATIVE_RUNTIME_ADMISSION_KEY)],[SQLITE_DATABASE_ADMISSIONS_KEY,e],[PROCESS_MACHINE_IDENTITY_KEY,getEnvironmentData(PROCESS_MACHINE_IDENTITY_KEY)]]}function ensureSqliteLibrarySelected(e){return runtimeSelector()(e)}
//!src/infra/sqlite-database-admission-delta.ts
function changedAdmissionEntries(e,t){const n=/* @__PURE__ */ new Map;for(const[r,i]of e)if(t.get(r)!==i)n.set(r,i);return n}function changedAdmissionWriteScopes(e,t){const n=/* @__PURE__ */ new Map;e.forEach((e,r)=>{if(e!==t[r])e.forEach((e,i)=>{if(t[r].get(i)!==e)n.set(i,e)})});return n}
//!src/infra/sqlite-database-admission-record.ts
function readSqliteDatabaseAdmissionIdentity(e){return`${e.dev}:${e.ino}:${readDatabaseIdentityBirthtime(e)}`}const SqliteDatabaseGenerationSlot={schemaRevision:0,factRevision:1,publicationRevision:2,retired:3,writeRevision:4,hostRevision:5,unscopedWriteRevision:6,writeScopeRevision:7,sealPresent:8};const SQLITE_DATABASE_GENERATION_LENGTH=Object.keys(SqliteDatabaseGenerationSlot).length;const decodedValue=Symbol.for(`openclaw.sqliteDatabaseAdmission.decodedValue`);function readSqliteDatabaseAdmissionFact(e,t){e[decodedValue]??={value:t.read?t.read(e.value):e.value};return e[decodedValue].value}function admitSqliteDatabaseFactValue(e,t){const n={value:t};readSqliteDatabaseAdmissionFact(n,e);return n}const MAX_WRITE_SCOPE_BYTES=1048576;const scopeRetention=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteDatabaseWriteScopeRetention`),()=>/* @__PURE__ */ new WeakMap);const writeScopeBytes=e=>e.length*2+256;function retainSqliteDatabaseWriteScope(e,t,n){const r=e.writeScopes;let i=scopeRetention.get(r);if(!i){i={bytes:[...r.keys()].reduce((e,t)=>e+writeScopeBytes(t),0),retired:/* @__PURE__ */ new Set};scopeRetention.set(r,i)}if(!r.delete(t))i.bytes+=writeScopeBytes(t);r.set(t,n);pruneSqliteDatabaseWriteScopes(e)}function pruneSqliteDatabaseWriteScopes(e){const t=scopeRetention.get(e.writeScopes);if(t.bytes<=MAX_WRITE_SCOPE_BYTES)return false;let n=false;for(const[r,i]of e.writeScopes){if(Atomics.compareExchange(i.state,2,0,-1)>0&&Atomics.load(i.state,1)===0)continue;Atomics.store(i.state,1,1);advanceSqliteDatabaseGeneration(e,`writeScopeRevision`);e.writeScopes.delete(r);t.bytes-=writeScopeBytes(r);t.retired.add(r);n=true;if(t.bytes<=MAX_WRITE_SCOPE_BYTES)break}return n}function readSqliteDatabaseAdmissions(e){return Array.isArray(e)?e:void 0}function isSqliteDatabaseAdmissionRetired(e){return readSqliteDatabaseGeneration(e,`retired`)!==0}function isSqliteDatabaseAdmissionFactCurrent(e,t){return!isSqliteDatabaseAdmissionRetired(e)&&Atomics.load(new Int32Array(t.current),0)===1&&t.revision===readSqliteDatabaseFactRevision(e,t.schemaDependent)}function hasSqliteDatabaseSchemaAdmission(e){const t=e?.facts.get(`sqlite-schema`);return Boolean(e&&t&&isSqliteDatabaseAdmissionFactCurrent(e,t))}function readSqliteDatabaseFactRevision(e,t){return readSqliteDatabaseGeneration(e,t?`schemaRevision`:`factRevision`)}function readSqliteDatabaseGeneration(e,t){return Atomics.load(new Int32Array(e.generation),SqliteDatabaseGenerationSlot[t])}function advanceSqliteDatabaseGeneration(e,t){return Atomics.add(new Int32Array(e.generation),SqliteDatabaseGenerationSlot[t],1)}function publishSqliteDatabaseFact(e,t,n,r,i){if(isSqliteDatabaseAdmissionRetired(e)||r!==readSqliteDatabaseFactRevision(e,t.schemaDependent))return false;if(t.writer===`host`)advanceSqliteDatabaseGeneration(e,`hostRevision`);const a=e.facts.get(t.name);if(a)Atomics.store(new Int32Array(a.current),0,0);const o=new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);Atomics.store(new Int32Array(o),0,1);e.facts.set(t.name,{...n,revision:r,schemaDependent:t.schemaDependent===true,lifetime:t.lifetime,publication:i,current:o});advanceSqliteDatabaseGeneration(e,`publicationRevision`);return true}function revokeSqliteDatabaseAdmissionFacts(e){if(!e)return;for(const t of e.facts.values())Atomics.store(new Int32Array(t.current),0,0);advanceSqliteDatabaseGeneration(e,`schemaRevision`);advanceSqliteDatabaseGeneration(e,`factRevision`)}const EMPTY_WRITE_SCOPE_BUCKETS=Array.from({length:128},()=>/* @__PURE__ */ new Map);function snapshotWriteScopes(e,t=EMPTY_WRITE_SCOPE_BUCKETS,n){let r=t;const i=scopeRetention.get(e);const visit=(n,a)=>{let o=0;for(let e=0;e<a.length;e++)o=o*31+a.charCodeAt(e)|0;const s=o&EMPTY_WRITE_SCOPE_BUCKETS.length-1;const c=!n||Atomics.load(n.state,1)!==0;if(c){if(e.delete(a)&&i)i.bytes-=writeScopeBytes(a)}if(c?!t[s].has(a):t[s].get(a)===n)return;if(r===t)r=t.slice();if(r[s]===t[s])r[s]=new Map(t[s]);if(c)r[s].delete(a);else r[s].set(a,n)};if(n)for(const t of n)visit(e.get(t),t);else e.forEach(visit);for(const t of i?.retired??[])visit(e.get(t),t);i?.retired.clear();return r}function createSqliteDatabaseAdmissionCursor(){return{revision:-1,records:/* @__PURE__ */ new WeakMap}}var SqliteDatabaseAdmissionRegistry=class{constructor(){this.records=/* @__PURE__ */ new Map;this.exchangeCursor=createSqliteDatabaseAdmissionCursor();this.locations=/* @__PURE__ */ new Map;this.published=/* @__PURE__ */ new Map;this.scopeSweeps=/* @__PURE__ */ new WeakMap;this.descriptors=/* @__PURE__ */ new Map;this.revision=0;this.retainProcessFacts=true}useConnectionScopedFacts(){this.retainProcessFacts=false}changeReferences(e,t){let n=e.references.get(threadId);if(!n){n=new SharedArrayBuffer(2*Int32Array.BYTES_PER_ELEMENT);e.references.set(threadId,n)}if(Atomics.add(new Int32Array(n),0,t)+t!==(t===1?1:0))return false;if(t===-1)this.retireUnreferenced(e);this.publish(e);return true}retireUnreferenced(e){if(threadId!==0||isSqliteDatabaseAdmissionRetired(e)||[...e.references.values()].some(e=>Atomics.load(new Int32Array(e),0)>0))return;for(const[t,n]of e.facts)if(!this.retainProcessFacts||n.lifetime!==`process`||!isSqliteDatabaseAdmissionFactCurrent(e,n))e.facts.delete(t);const t=this.descriptors.get(e.identity);if(t)t.facts=e.facts;Atomics.compareExchange(new Int32Array(e.generation),SqliteDatabaseGenerationSlot.retired,0,2);e.writeScopes.clear()}releaseWorker(e){const t=/* @__PURE__ */ new Map;for(const n of this.records.values()){const r=e>0?n.references.get(e):void 0;if(!r)continue;Atomics.compareExchange(n.writerDiagnostic,1,e+1,0);Atomics.store(new Int32Array(r),0,-1);this.retireUnreferenced(n);t.set(n,void 0)}if(t.size>0)this.publish(t)}observeLocation(e,t){const n=normalizeDatabasePath(path.resolve(e));if(t===void 0)this.locations.delete(n);else this.locations.set(n,t)}forLocation(e){return this.forPathname(normalizeDatabasePath(path.resolve(e)))}prepareLocation(e){const t=normalizeDatabasePath(path.resolve(e));return()=>this.forPathname(t)}forPathname(e){const t=this.locations.get(e);const n=t===void 0?void 0:this.records.get(t);return n&&!isSqliteDatabaseAdmissionRetired(n)?n:void 0}forget(e){this.records.delete(e);this.published.delete(e);for(const[t,n]of this.locations)if(n===e)this.locations.delete(t)}retainDescriptorCustody(e,t,n){const r=readSqliteDatabaseAdmissionIdentity(n);const i=this.descriptors.get(r);if(i&&i.descriptor!==t)throw new Error(`SQLite descriptor custody changed during admission`);if(!i)this.descriptors.set(r,{location:e,descriptor:t,file:n,facts:/* @__PURE__ */ new Map})}retainDescriptor(e,t,n){const r=this.descriptors.get(readSqliteDatabaseAdmissionIdentity(n));const i={identity:readSqliteDatabaseAdmissionIdentity(n),physicalIdentity:{key:`file:${n.dev}:${n.ino}`,birthtime:readDatabaseIdentityBirthtime(n)},location:e,descriptor:t,descriptorOwner:0,generationId:randomUUID(),generation:new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT*SQLITE_DATABASE_GENERATION_LENGTH),writerDiagnostic:new Int32Array(new SharedArrayBuffer(125*Int32Array.BYTES_PER_ELEMENT)),writeScopes:/* @__PURE__ */ new Map,writeScopeRevision:0,references:/* @__PURE__ */ new Map,facts:new Map([...r?.facts??[]].filter(([,e])=>Atomics.load(new Int32Array(e.current),0)===1).map(([e,t])=>[e,{...t,revision:0}]))};this.records.set(i.identity,i);const a=r?.descriptor===t?r:{location:e,descriptor:t,file:n,facts:/* @__PURE__ */ new Map};a.location=e;a.file=n;a.facts=/* @__PURE__ */ new Map;this.descriptors.set(i.identity,a);this.observeLocation(e,i.identity);this.publish(i);return i}retireDescriptor(e,t){const n=this.records.get(e);const r=this.descriptors.get(e)?.descriptor??n?.descriptor;if(r===void 0)return false;const i=fsSync.fstatSync(r,{bigint:true});if(i.nlink>1n||t.requireSoleDescriptor&&!isSoleDatabaseFileDescriptor(r,i))return false;if(n)Atomics.store(new Int32Array(n.generation),SqliteDatabaseGenerationSlot.retired,1);fsSync.closeSync(r);this.descriptors.delete(e);this.forget(e);this.publish();return true}publish(e,t){const n=e instanceof Map;if(e&&!n&&this.records.get(e.identity)!==e)return;for(const r of this.records.values()){if(isSqliteDatabaseAdmissionRetired(r)){if(readSqliteDatabaseGeneration(r,`retired`)===1)this.descriptors.delete(r.identity);this.forget(r.identity);continue}if(e&&e!==r&&!(n&&e.has(r)))continue;let i=e===r||n;for(const[e,t]of r.references)if(Atomics.load(new Int32Array(t),0)<0){r.references.delete(e);i=true}const a=this.published.get(r.identity);const o=readSqliteDatabaseGeneration(r,`writeScopeRevision`);const s=a&&e?n?e.get(r):t:void 0;const c=s===void 0&&this.scopeSweeps.get(r)!==o;const l=snapshotWriteScopes(r.writeScopes,a?.writeScopes,s??(c?void 0:[]));if(c)this.scopeSweeps.set(r,o);i||=l!==a?.writeScopes;if(!i)continue;if(threadId===0)r.writeScopeRevision=readSqliteDatabaseGeneration(r,`writeScopeRevision`);const{writeScopes:u,...d}=r;const f={...d,facts:new Map(r.facts),references:new Map(r.references),hostRevision:threadId===0?readSqliteDatabaseGeneration(r,`hostRevision`):r.hostRevision};const p={...f,writeScopes:l.filter(e=>e.size>0)};this.published.set(r.identity,{metadata:f,writeScopes:l,snapshot:p})}this.revision++;setEnvironmentData(SQLITE_DATABASE_ADMISSIONS_KEY,[...this.published.values()].map(e=>e.snapshot))}capture(e,t){const n=t?/* @__PURE__ */ new Set([...t.admissions?.map(e=>e.identity)??[],...t.location===void 0?[]:[this.forLocation(t.location)?.identity].filter(e=>e!==void 0)]):void 0;if(!n&&!e)this.publish();if(!n&&e?.revision===this.revision)return[];const r=n?[...n].flatMap(e=>{const t=this.published.get(e);return t&&!isSqliteDatabaseAdmissionRetired(t.snapshot)?[t]:[]}):[...this.published.values()];if(!e)return r.map(e=>e.snapshot);if(!n)e.revision=this.revision;return r.flatMap(t=>{const n=e.records.get(t.metadata.generation);if(n===t)return[];e.records.set(t.metadata.generation,t);return[n?{...t.metadata,facts:changedAdmissionEntries(t.metadata.facts,n.metadata.facts),writeScopes:[changedAdmissionWriteScopes(t.writeScopes,n.writeScopes)],references:changedAdmissionEntries(t.metadata.references,n.metadata.references)}:t.snapshot]})}captureExchange(e,t){return t&&typeof t!==`string`&&isSqliteDatabaseAdmissionRetired(t)?[{...t,facts:/* @__PURE__ */ new Map,writeScopes:[],references:/* @__PURE__ */ new Map}]:this.capture(this.exchangeCursor,e)}resetExchangeCursor(){this.exchangeCursor=createSqliteDatabaseAdmissionCursor()}install(e){const t=/* @__PURE__ */ new Map;for(const n of e){let e=this.records.get(n.identity);if(n.descriptorOwner!==0||isSqliteDatabaseAdmissionRetired(n)){if(e&&isSqliteDatabaseAdmissionRetired(e))t.set(e,void 0);continue}let r=false;if(e&&isSqliteDatabaseAdmissionRetired(e))e=void 0;if(!e){e={...n,facts:new Map(n.facts),writeScopes:/* @__PURE__ */ new Map,references:new Map(n.references),hostRevision:void 0};this.records.set(n.identity,e);this.observeLocation(n.location,n.identity);r=true}else if(e.generationId!==n.generationId)continue;if(!e.cleanCloseRefusal&&n.cleanCloseRefusal){e.cleanCloseRefusal=n.cleanCloseRefusal;r=true}for(const[t,i]of n.facts)if(isSqliteDatabaseAdmissionFactCurrent(n,i)&&e.facts.get(t)?.publication!==i.publication){e.facts.set(t,i);r=true}const i=t.get(e)??[];for(const t of n.writeScopes)for(const[n,a]of t){if(Atomics.load(a.state,1)!==0)continue;const t=e.writeScopes.get(n);if(t?.identity===a.identity||threadId===0&&t&&Atomics.load(t.state,1)===0)continue;if(threadId===0){const t=advanceSqliteDatabaseGeneration(e,`writeScopeRevision`);if(this.scopeSweeps.get(e)===t)this.scopeSweeps.set(e,t+1|0)}retainSqliteDatabaseWriteScope(e,n,a);i.push(n);r=true}const a=readSqliteDatabaseGeneration(e,`writeScopeRevision`);if(threadId===0||n.writeScopeRevision===a){r||=e.writeScopeRevision!==a;e.writeScopeRevision=a}for(const[t,i]of n.references)if(!e.references.has(t)&&Atomics.load(new Int32Array(i),0)>=0){e.references.set(t,i);r=true}if(threadId!==0&&n.hostRevision!==void 0&&n.hostRevision!==e.hostRevision&&n.hostRevision===readSqliteDatabaseGeneration(e,`hostRevision`)){e.hostRevision=n.hostRevision;r=true}this.retireUnreferenced(e);if(r||isSqliteDatabaseAdmissionRetired(e))t.set(e,i.length>0?i:void 0)}if(t.size>0)this.publish(t);return t.size>0}};
//!src/infra/sqlite-database-admission-context.ts
const state$2=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteDatabaseAdmissions`),()=>({registry:new SqliteDatabaseAdmissionRegistry,descriptorPreparation:Promise.resolve(),connections:/* @__PURE__ */ new WeakMap,openedIdentities:/* @__PURE__ */ new WeakMap,unproven:/* @__PURE__ */ new WeakSet,suspended:/* @__PURE__ */ new WeakSet,local:/* @__PURE__ */ new WeakMap,rolledBack:/* @__PURE__ */ new WeakSet,dataWriters:/* @__PURE__ */ new WeakMap,localWriteRevisions:/* @__PURE__ */ new WeakMap,writeListeners:/* @__PURE__ */ new WeakMap,ddlRevisions:/* @__PURE__ */ new WeakMap,schemaDirty:/* @__PURE__ */ new WeakSet,localSchemaRevisions:/* @__PURE__ */ new Map,misses:/* @__PURE__ */ new WeakMap,exchange:new AsyncLocalStorage,exchanging:false,publication:0}));function sqliteTransactionWriterSlot(e){return state$2.connections.get(e)?.writerDiagnostic}function recordSqliteTransactionWriter(e,t,n){Atomics.add(e,0,1);e[2]=n>>>0;e[3]=Math.floor(n/4294967296);const r=Math.min(t.length,120);e[4]=r;for(let n=0;n<r;n++)e[5+n]=t.charCodeAt(n);Atomics.store(e,1,threadId+1);Atomics.add(e,0,1)}function readSqliteTransactionWriter(e,t){const n=sqliteTransactionWriterSlot(e);if(!n)return;const r=Atomics.load(n,0);const i=Atomics.load(n,1);if(!i||r%2!==0)return;const a=(n[2]>>>0)+n[3]*4294967296;let o=``;for(let e=0;e<n[4];e++)o+=String.fromCharCode(n[5+e]);if(r!==Atomics.load(n,0)||i!==Atomics.load(n,1))return;return{operation:o,threadId:i-1,heldMs:Math.max(0,t-a)}}function captureSqliteDatabaseAdmissions(e,t){return state$2.registry.capture(e,t)}function installSqliteDatabaseAdmissions(e){state$2.registry.install(e)}function exchangeSqliteDatabaseAdmission(e,t,n=false,r){const i=state$2.exchange.getStore();if(!i||state$2.exchanging)return;state$2.exchanging=true;try{const a=typeof e===`string`?{location:e}:{admissions:[e]};const o=state$2.registry.captureExchange(a,e);if(n&&o.length===0)return;installSqliteDatabaseAdmissions(i(o,typeof e===`string`?e:void 0,t,r))}catch(e){state$2.registry.resetExchangeCursor();throw e}finally{state$2.exchanging=false}}function withSqliteDatabaseAdmissionExchange(e,t){return state$2.exchange.run(e,t)}function canShareSqliteDatabaseAdmissions(){return threadId===0||state$2.exchange.getStore()!==void 0}const inherited=readSqliteDatabaseAdmissions(getEnvironmentData(SQLITE_DATABASE_ADMISSIONS_KEY));if(inherited){installSqliteDatabaseAdmissions(inherited);state$2.registry.captureExchange()}
//!src/infra/sqlite-clean-close-seal.ts
const fullVerificationIntervalMs=6048e5;function fileFields(e){return{dev:e.dev.toString(),ino:e.ino.toString(),birthtime:readDatabaseIdentityBirthtime(e),size:e.size.toString(),mtimeNs:e.mtimeNs.toString()}}function checksum(e){return createHash(`sha256`).update(e).digest(`hex`).slice(0,16)}function hasNoJournal(e){return[`-wal`,`-journal`].every(t=>{try{const n=fsSync.statSync(`${e}${t}`,{bigint:true});return n.isFile()&&n.size===0n}catch(e){if(hasErrnoCode(e,`ENOENT`))return true;throw e}})}function decodeSeal(e,t,n){const r=JSON.parse(e);if(!isRecord(r)||typeof r.payload!==`string`||r.checksum!==checksum(r.payload))return n(`malformed-proof`);const i=JSON.parse(r.payload);if(!isRecord(i)||i.version!==1||typeof i.schemaIdentity!==`string`||typeof i.verifiedAt!==`number`||!Number.isSafeInteger(i.verifiedAt)||!(`facts`in i)||!t.isFile())return n(`malformed-proof`);const a=Date.now()-i.verifiedAt;if(a<0||a>fullVerificationIntervalMs)return n(`expired-proof`);if(!Object.entries(fileFields(t)).every(([e,t])=>i[e]===t))return n(`file-mismatch`);return{schemaIdentity:i.schemaIdentity,verifiedAt:i.verifiedAt,facts:i.facts,...i.identity===void 0?{}:{identity:i.identity}}}function readSqliteCleanCloseSeal(e,t,n){const refuse=e=>{n?.(e)};try{const n=`${e}.seal`;if(!fsSync.lstatSync(n).isFile())return refuse(`malformed-proof`);const r=decodeSeal(fsSync.readFileSync(n,`utf8`),t,refuse);if(!r)return;return hasNoJournal(e)?r:refuse(`journal-present`)}catch(e){return refuse(hasErrnoCode(e,`ENOENT`)?`no-proof`:`malformed-proof`)}}async function readSqliteCleanCloseSealAsync(e,t,n){const refuse=e=>{n?.(e)};try{const n=`${e}.seal`;if(!(await fsSync.promises.lstat(n)).isFile())return refuse(`malformed-proof`);const r=decodeSeal(await fsSync.promises.readFile(n,`utf8`),t,refuse);if(!r)return;for(const t of[`-wal`,`-journal`])try{const n=await fsSync.promises.stat(`${e}${t}`,{bigint:true});if(!n.isFile()||n.size!==0n)return refuse(`journal-present`)}catch(e){if(!hasErrnoCode(e,`ENOENT`))throw e}return r}catch(e){return refuse(hasErrnoCode(e,`ENOENT`)?`no-proof`:`malformed-proof`)}}function invalidateSqliteCleanCloseSeal(e){try{fsSync.unlinkSync(`${e}.seal`)}catch(e){if(!hasErrnoCode(e,`ENOENT`))throw e}}function writeSqliteCleanCloseSeal(e,t,n,r){try{const i=`${e}.seal`;const a=fsSync.lstatSync(i,{throwIfNoEntry:false});if(!n.isFile()||a&&!a.isFile()||!hasNoJournal(e)){invalidateSqliteCleanCloseSeal(e);return false}const o=JSON.stringify({version:1,schemaIdentity:t,...fileFields(n),verifiedAt:r.verifiedAt,facts:r.facts,identity:r.identity});fsSync.writeFileSync(i,JSON.stringify({payload:o,checksum:checksum(o)}));return true}catch{try{invalidateSqliteCleanCloseSeal(e)}catch{}return false}}
//!src/infra/sqlite-database-admission-descriptor.ts
function resolveSqliteDatabaseFilePath(e){if(!e.startsWith(`file:`))return e;const[t=``]=e.slice(5).split(/[?#]/u,1);return t.startsWith(`/`)?fileURLToPath(e):decodeURIComponent(t)}function createSqliteDatabaseDescriptorOwner(e){function prepareOwnedSqliteDatabaseAdmission(t){const n=state$2.descriptorPreparation.then(async()=>{if(threadId!==0)throw new Error(`SQLite descriptor preparation belongs to the host`);t.assertCurrent();const n=await fsSync.promises.stat(t.location,{bigint:true});assertDatabaseFileIdentity(n,t.expectedIdentity);const r=await fsSync.promises.realpath(t.location);t.assertCurrent();if(r!==t.location)throw new Error(`SQLite private staging location changed before admission`);const i=readSqliteDatabaseAdmissionIdentity(n);const a=state$2.registry.descriptors.get(i);if(retainPreparedSqliteDatabaseAdmissionLocation(t.location,t.expectedIdentity,{identity:i,canonicalPath:r}))return;const o=a?.descriptor??await new Promise((e,n)=>{fsSync.open(t.location,`r`,(t,r)=>t?n(t):e(r))});let s=false;let c=false;try{const n=await new Promise((e,t)=>{fsSync.fstat(o,{bigint:true},(n,r)=>n?t(n):e(r))});assertDatabaseFileIdentity(n,t.expectedIdentity);s=a===void 0;let i;const l=await readSqliteCleanCloseSealAsync(r,n,e=>{i=e});assertDatabaseFileIdentity(await fsSync.promises.stat(t.location,{bigint:true}),t.expectedIdentity);t.assertCurrent();const u=state$2.registry.retainDescriptor(r,o,n);c=true;e.load(u,{seal:l,refusal:i})}catch(e){if(s&&!c)try{await new Promise((e,t)=>{fsSync.close(o,n=>n?t(n):e())})}catch(t){throw createSqliteLifecycleAggregateError([e,t],`SQLite preparation cleanup failed`,e)}throw e}});state$2.descriptorPreparation=n.then(()=>{},()=>{});return n}function prepareSqliteDatabaseAdmissionAsync(t){const n=resolveAdmissionTarget(t.location,t.create!==void 0);if(!n)return Promise.resolve(void 0);const{filename:r,create:i}=n;let a=t.identity;const prepare=async()=>{t.assertCurrent();const n=a??await inspectDatabasePathIdentity(r);a=void 0;t.assertCurrent();if(!n)return;if(t.expectedIdentity&&(n.key!==t.expectedIdentity.key||t.expectedIdentity.birthtime!==void 0&&n.birthtime!==t.expectedIdentity.birthtime))throw new Error(`SQLite Worker path no longer matches its borrowed native owner`);const o=n.key.startsWith(`file:`);const s=!o&&i?t.create:void 0;if(!o&&!s)return n;const c=`${n.key.slice(5)}:${n.birthtime}`;if(t.observedLocation&&t.observedLocation.identity!==c)throw new Error(`SQLite database changed while retaining its admission identity`);if(threadId!==0){if(s)throw new Error(`SQLite descriptor creation belongs to the host`);pathAdmission(r,c);t.assertCurrent();return n}const l=o?state$2.registry.descriptors.get(c):void 0;if(l){assertDatabaseFileIdentity(l.file,n);if(retainPreparedSqliteDatabaseAdmissionLocation(r,void 0,{identity:c,canonicalPath:n.canonicalPath}))return n}let u;let d;if(l){u=l.descriptor;d=l.file}else{if(s)await s.authorize(n.canonicalPath);t.assertCurrent();const e=s?createDeferredCore():void 0;if(e)s?.retain(e.promise);let i;try{i=await new Promise((e,t)=>{fsSync.open(r,s?`wx`:`r`,420,(n,r)=>n?t(n):e(r))});u=i;d=await new Promise((e,t)=>{fsSync.fstat(u,{bigint:true},(n,r)=>n?t(n):e(r))});if(o)assertDatabaseFileIdentity(d,n);state$2.registry.retainDescriptorCustody(n.canonicalPath,u,d);e?.resolve()}catch(t){if(i===void 0){e?.resolve();if(s&&hasErrnoCode(t,`EEXIST`))return prepare()}else e?.reject(t);throw t}}const f=o?n:{key:`file:${d.dev}:${d.ino}`,canonicalPath:n.canonicalPath,birthtime:readDatabaseIdentityBirthtime(d)};let p;const m=o?await readSqliteCleanCloseSealAsync(n.canonicalPath,d,e=>{p=e}):void 0;const h=await inspectDatabasePathIdentity(r);if(!h||h.key!==f.key||h.birthtime!==f.birthtime||h.canonicalPath!==f.canonicalPath)throw new Error(`SQLite database changed identity during admission`);t.assertCurrent();const g=state$2.registry.records.get(readSqliteDatabaseAdmissionIdentity(d));const _=g&&!isSqliteDatabaseAdmissionRetired(g)?g:state$2.registry.retainDescriptor(f.canonicalPath,u,d);state$2.registry.observeLocation(r,_.identity);if(o)e.load(_,{seal:m,refusal:p});else e.markLoaded(_);return f};const o=state$2.descriptorPreparation.then(prepare);state$2.descriptorPreparation=o.then(()=>{},()=>{});return o}function retainPreparedSqliteDatabaseAdmissionLocation(t,n,r){const i=!r&&state$2.registry.forLocation(t);const a=i&&state$2.registry.descriptors.get(i.identity);if(i&&n?.birthtime!==void 0&&i.physicalIdentity.key===n.key&&i.physicalIdentity.birthtime===n.birthtime&&a&&a.descriptor===i.descriptor&&e.isLoaded(a)){e.load(i);return true}const o=r&&state$2.registry.descriptors.get(r.identity);if(r&&o&&e.isLoaded(o)){if(n)assertDatabaseFileIdentity(o.file,n);const i=state$2.registry.records.get(r.identity);const a=i&&!isSqliteDatabaseAdmissionRetired(i)?i:state$2.registry.retainDescriptor(r.canonicalPath,o.descriptor,o.file);state$2.registry.observeLocation(t,a.identity);e.markLoaded(a);return true}return false}function retainSqliteDatabaseAdmissionLocation(t,n,r){if(retainPreparedSqliteDatabaseAdmissionLocation(t,n,r))return;const i=fsSync.statSync(t,{bigint:true});if(!i.isFile())return;const a=readSqliteDatabaseAdmissionIdentity(i);const o=state$2.registry.records.get(a);if(o&&!isSqliteDatabaseAdmissionRetired(o)){state$2.registry.observeLocation(t,a);e.load(o);return}if(threadId!==0)return;const s=state$2.registry.descriptors.get(a)?.descriptor??fsSync.openSync(t,`r`);const c=fsSync.fstatSync(s,{bigint:true});if(!c.isFile()||readSqliteDatabaseAdmissionIdentity(c)!==a)throw new Error(`SQLite database changed while retaining its admission identity`);const l=state$2.registry.retainDescriptor(fsSync.realpathSync.native(t),s,c);state$2.registry.observeLocation(t,l.identity);e.load(l)}function pathAdmission(t,n){try{let r=state$2.registry.forLocation(t);if(!r){let e=n;if(e===void 0&&threadId!==0){const n=fsSync.statSync(t,{bigint:true});if(!n.isFile())return;e=readSqliteDatabaseAdmissionIdentity(n)}exchangeSqliteDatabaseAdmission(t,void 0,false,e!==void 0&&threadId!==0?{identity:e,canonicalPath:fsSync.realpathSync.native(t)}:void 0);r=state$2.registry.forLocation(t)}if(r){e.load(r);return r}retainSqliteDatabaseAdmissionLocation(t);return state$2.registry.forLocation(t)}catch(e){if(hasErrnoCode(e,`ENOENT`))return;throw e}}function resolveAdmissionTarget(e,t){let n=e;let r=t;if(!n||n===`:memory:`)return;if(n.startsWith(`file:`)){const e=new URL(n);if(e.searchParams.get(`mode`)===`memory`)return;if([`ro`,`rw`].includes(e.searchParams.get(`mode`)??``))r=false;n=resolveSqliteDatabaseFilePath(n);if(!n||n===`:memory:`)return}return{filename:n,create:r}}function prepareSqliteDatabaseAdmission(t,n={}){const r=resolveAdmissionTarget(t,n.create);if(!r)return;const{filename:i,create:a}=r;try{const e=fsSync.statSync(i,{bigint:true});if(!e.isFile()){state$2.registry.observeLocation(i,void 0);return}const t=readSqliteDatabaseAdmissionIdentity(e);state$2.registry.observeLocation(i,t);return t}catch(t){if(hasErrnoCode(t,`ENOENT`)){state$2.registry.observeLocation(i,void 0);if(!a)return;if(threadId!==0){const e=state$2.exchange.getStore()!==void 0;exchangeSqliteDatabaseAdmission(i,true);const n=prepareSqliteDatabaseAdmission(i);if(e&&n===void 0)throw new Error(`SQLite worker file creation requires host authority: ${i}`,{cause:t});return n}let n;try{n=fsSync.openSync(i,`wx`,420)}catch(e){if(hasErrnoCode(e,`EEXIST`))return prepareSqliteDatabaseAdmission(i);throw e}const r=fsSync.fstatSync(n,{bigint:true});const o=state$2.registry.retainDescriptor(fsSync.realpathSync.native(i),n,r);e.markLoaded(o);if(prepareSqliteDatabaseAdmission(i)!==o.identity)throw new Error(`SQLite database changed identity during file creation`,{cause:t});return o.identity}throw t}}return{prepareOwnedSqliteDatabaseAdmission,prepareSqliteDatabaseAdmissionAsync,retainSqliteDatabaseAdmissionLocation,retainPreparedSqliteDatabaseAdmissionLocation,prepareSqliteDatabaseAdmission,pathAdmission}}
//!src/infra/sqlite-native-admission.ts
const state$1=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteNativeAdmissions`),()=>({operations:/* @__PURE__ */ new WeakMap}));function getSqliteNativeAdmissionFacts(e){return state$1.operations.get(e)?.facts}function beginSqliteDatabaseAdmissionOperation(e){const t=state$1.operations.get(e)??{depth:0,facts:/* @__PURE__ */ new Map};t.depth+=1;state$1.operations.set(e,t);return()=>{t.depth-=1;if(t.depth===0)state$1.operations.delete(e)}}
//!src/infra/sqlite-database-admission-read.ts
function createSqliteDatabaseAdmissionReader(e){const{state:t,admission:n,pathAdmission:r,exchange:i,retain:a,release:o,publishFact:s}=e;function readSqliteDatabaseWriteRevision(e){const r=sqlPublicationAnchor(e);if(!r.isOpen||t.suspended.has(r))return;const i=n(r);if(!i){const e=r.location();return!e||e===`:memory:`?t.localWriteRevisions.get(r)??0:void 0}return readSqliteDatabaseGeneration(i,`writeRevision`)}function readSqliteDatabaseSiblingWriteRevision(e){const n=sqlPublicationAnchor(e);const r=readSqliteDatabaseWriteRevision(n);return r===void 0?void 0:r-(t.localWriteRevisions.get(n)??0)|0}function readSqliteDatabaseCleanClose(t){const n=e.prepareFileIdentity(t);const i=r(t);return i!==void 0&&i.identity===n&&Atomics.load(new Int32Array(i.generation),SqliteDatabaseGenerationSlot.sealPresent)===1}function readSqliteDatabaseIntegrityVerification(t){const n=typeof t===`string`?getOrLoadSqliteDatabaseAdmissionForPath(t,e.integrityVerificationKey,()=>void 0):getSqliteDatabaseAdmission(t,e.integrityVerificationKey);return n===void 0?void 0:{verifiedAt:n}}function readSqliteDatabaseCleanCloseRefusal(e){return n(sqlPublicationAnchor(e))?.cleanCloseRefusal}function retainSqliteDatabaseAdmissionForPath(e){const n=r(e);if(!n)return;try{a(n)}catch(e){o(n);throw e}let i=false;const s=t.registry.prepareLocation(e);return{location:e,identity:{...n.physicalIdentity,canonicalPath:n.location},isCurrent:()=>!i&&s()===n,release(){if(!i){i=true;o(n)}}}}function withPathAdmission(e,t){const n=r(e);if(!n)return t(void 0);try{a(n);return t(n)}finally{o(n)}}function getSqliteDatabaseAdmission(e,r,a={}){const o=sqlPublicationAnchor(e);if(!o.isOpen||t.suspended.has(o))return;const s=n(o,a.existingOnly!==true&&!e.isTransaction);if(!s)return;const c=(isPostgresSqlConnection(e)?void 0:getSqliteNativeAdmissionFacts(e))?.get(r.name)??t.local.get(o)?.get(r.name);if(c&&c.revision===readSqliteDatabaseFactRevision(s,c.schemaDependent)&&(!c.schemaDependent||c.ddlRevision===(t.ddlRevisions.get(o)??0)))return readSqliteDatabaseAdmissionFact(c,r);if(r.schemaDependent&&t.schemaDirty.has(o))return;if(t.rolledBack.has(o)){if(e.isTransaction)return;t.rolledBack.delete(o)}let l=s.facts.get(r.name);if(!l||!isSqliteDatabaseAdmissionFactCurrent(s,l)||a.refresh&&r.writer!==`host`){if(r.writer===`host`){if(e.isTransaction||threadId===0||s.hostRevision===readSqliteDatabaseGeneration(s,`hostRevision`))return;i(s);l=s.facts.get(r.name);return l&&isSqliteDatabaseAdmissionFactCurrent(s,l)?readSqliteDatabaseAdmissionFact(l,r):void 0}const n=readSqliteDatabaseGeneration(s,`publicationRevision`);const o=t.misses.get(s)??/* @__PURE__ */ new Map;t.misses.set(s,o);if(r.writer!==`connection`&&!e.isTransaction&&(a.refresh||o.get(r.name)!==n)){i(s);l=s.facts.get(r.name);o.set(r.name,readSqliteDatabaseGeneration(s,`publicationRevision`))}}return l&&isSqliteDatabaseAdmissionFactCurrent(s,l)?readSqliteDatabaseAdmissionFact(l,r):void 0}function getOrLoadSqliteDatabaseAdmissionForPath(e,t,n){const read=e=>{if(!e)return n();const r=e.facts.get(t.name);const i=r&&isSqliteDatabaseAdmissionFactCurrent(e,r)?readSqliteDatabaseAdmissionFact(r,t):void 0;if(i!==void 0)return i;const a=readSqliteDatabaseFactRevision(e,t.schemaDependent);const o=n();if(o!==void 0)s(e,t,admitSqliteDatabaseFactValue(t,o),a);return o};return t.lifetime===`process`?withPathAdmission(e,read):read(r(e))}function peekSqliteDatabaseAdmissionForPath(e,n){const r=t.registry.forLocation(e);const i=r?.facts.get(n.name);return r&&i&&isSqliteDatabaseAdmissionFactCurrent(r,i)?readSqliteDatabaseAdmissionFact(i,n):void 0}function prepareSqliteDatabaseAdmissionForPath(e,t){const n=r(e);if(!n)return()=>void 0;const i=new Int32Array(n.generation);const a=t.schemaDependent?SqliteDatabaseGenerationSlot.schemaRevision:SqliteDatabaseGenerationSlot.factRevision;let o=n.facts.get(t.name);let s=o&&new Int32Array(o.current);return()=>{if(Atomics.load(i,SqliteDatabaseGenerationSlot.retired)!==0)return;const e=n.facts.get(t.name);if(e!==o){o=e;s=o&&new Int32Array(o.current)}return o&&s&&Atomics.load(s,0)===1&&o.revision===Atomics.load(i,a)?readSqliteDatabaseAdmissionFact(o,t):void 0}}function getSqliteDatabaseSchemaRevision(e,r={}){const i=sqlPublicationAnchor(e);const a=n(i,r.existingOnly!==true);if(a)return readSqliteDatabaseGeneration(a,`schemaRevision`);const o=t.openedIdentities.get(i);return o?t.localSchemaRevisions.get(o)??0:void 0}function hasSqliteDatabaseSchemaAdmissionForPath(e){return hasSqliteDatabaseSchemaAdmission(r(e))}function getSqliteDatabaseAdmissionIdentityForPath(e){return t.registry.forLocation(e)?.physicalIdentity}function getSqliteDatabaseAdmissionSourceForPath(e){const n=t.registry.forLocation(e);return n&&{identity:n.physicalIdentity,canonicalPath:n.location}}function observeSqliteDatabaseAdmissionLocation(e,n){const r=t.registry.forLocation(n.canonicalPath);if(r?.physicalIdentity.key===n.key&&r.physicalIdentity.birthtime===n.birthtime)t.registry.observeLocation(e,r.identity)}function hasSqliteDatabaseSchemaAdmissionForIdentity(e){if(!e.key.startsWith(`file:`)||e.birthtime===void 0)return false;const n=`${e.key.slice(5)}:${e.birthtime}`;return hasSqliteDatabaseSchemaAdmission(t.registry.records.get(n))}return{readSqliteDatabaseWriteRevision,readSqliteDatabaseSiblingWriteRevision,readSqliteDatabaseCleanClose,readSqliteDatabaseIntegrityVerification,readSqliteDatabaseCleanCloseRefusal,getSqliteDatabaseAdmission,getSqliteDatabaseSchemaRevision,getOrLoadSqliteDatabaseAdmissionForPath,peekSqliteDatabaseAdmissionForPath,prepareSqliteDatabaseAdmissionForPath,hasSqliteDatabaseSchemaAdmissionForPath,getSqliteDatabaseAdmissionIdentityForPath,getSqliteDatabaseAdmissionSourceForPath,observeSqliteDatabaseAdmissionLocation,hasSqliteDatabaseSchemaAdmissionForIdentity,retainSqliteDatabaseAdmissionForPath}}
//!src/infra/sqlite-schema-contract-assembly.ts
function createSqliteTableContract(e,t,n,r,i,a,o){const s=i.map(e=>({name:e.name,sql:normalizeSchemaSql(e.sql)}));const c=t.sql?.startsWith(`CREATE TABLE `)?null:normalizeSchemaSql(t.sql);const l=c!==null&&/^CREATE VIRTUAL TABLE /iu.test(c);return{definition:l?null:parseSqliteTableDefinition(t.sql,e),indexes:r,columns:a,foreignKeys:o,strict:n.strict,triggers:s,virtualTableSql:l?c:null,withoutRowid:n.wr}}function createSqliteIndexContract(e,t,n){const r=n.map(({cid:e,coll:t,desc:n,key:r,name:i,seqno:a})=>({coll:t,desc:n,key:r,kind:e===-2?`expression`:e===-1?`rowid`:`column`,name:i,seqno:a}));return{name:e.name.startsWith(`sqlite_autoindex_`)?null:e.name,origin:e.origin,partial:e.partial,sql:normalizeSchemaSql(t),terms:r,unique:e.unique}}function parseSqliteTableDefinition(e,t){if(e===null)throw new Error(`Could not inspect SQLite table definition for ${t}.`);const n=findSqlCharacter(e,`(`);if(n===-1)throw new Error(`SQLite table ${t} has no column definition.`);const r=findSqlClosingParenthesis(e,n);const i=/* @__PURE__ */ new Map;const a=[];for(const o of splitSqlList(e.slice(n+1,r))){const e=normalizeSqlWhitespace(o);if(!e)continue;const n=readSqlToken(e,0);if(!n)throw new Error(`SQLite table ${t} contains an unreadable definition.`);if(readTableConstraintKeyword(e,n)){a.push(e);continue}const r=normalizeSqlIdentifier(n.raw);if(i.has(r))throw new Error(`SQLite table ${t} contains duplicate column ${r}.`);i.set(r,e)}return{columns:new Map([...i].toSorted(([e],[t])=>e.localeCompare(t))),constraints:a.toSorted()}}
//!src/state/openclaw-agent-db-additive-columns.ts
const SESSION_OWNER_COLUMN_DEFINITIONS=[{columnName:`owner_actor_type`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_actor_id`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_assigned_by_type`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_assigned_by_id`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_assigned_at`,dataType:`INTEGER`,tableName:`session_nodes`}];const LEGACY_ACP_MIGRATION_COLUMN_DEFINITION={columnName:`legacy_acp_migration_json`,dataType:`TEXT`,tableName:`session_nodes`};const CANONICAL_READY_COLUMN_DEFINITION={columnName:`canonical_ready`,dataType:`TEXT`,tableName:`session_key_contract`};const FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS=[...SESSION_OWNER_COLUMN_DEFINITIONS,LEGACY_ACP_MIGRATION_COLUMN_DEFINITION,CANONICAL_READY_COLUMN_DEFINITION];const STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS=[{tableName:`session_pending_inputs`,columnName:`consumed_event_id`,dataType:`TEXT`},{tableName:`session_transcript_active_events`,columnName:`context_eligible`,dataType:`INTEGER`},{tableName:`session_nodes`,columnName:`project_id`,dataType:`TEXT`},{tableName:`session_windows`,columnName:`row_transcript_json`,dataType:`TEXT`},{tableName:`session_windows`,columnName:`row_transcript_updated_at`,dataType:`INTEGER`},{tableName:`session_conversations`,columnName:`route_context_json`,dataType:`TEXT`}];function hasPendingAgentStartupColumns(e){const t=/* @__PURE__ */ new Map;return STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS.some(({tableName:n,columnName:r})=>{if(!e.has(n))return false;const i=e.get(n);if(!i)return true;let a=t.get(n);if(!a){a=parseSqliteTableDefinition(i,n).columns;t.set(n,a)}return!a.has(r)})}
//!src/infra/warning-filter.ts
const warningFilterKey=Symbol.for(`openclaw.warning-filter`);function shouldIgnoreWarning(e){return Boolean(e.code===`DEP0040`&&e.message?.includes(`punycode`)||e.code===`DEP0060`&&e.message?.includes(`util._extend`)||e.name===`ExperimentalWarning`&&e.message?.includes(`SQLite is an experimental feature`))}function normalizeWarningArgs(e){const t=e[0];const n=e[1];const r=e[2];let i;let a;let o;if(t instanceof Error){i=t.name;o=t.message;a=t.code}else if(typeof t===`string`)o=t;if(isRecord(n)){if(typeof n.type===`string`)i=n.type;if(typeof n.code===`string`)a=n.code}else{if(typeof n===`string`)i=n;if(typeof r===`string`)a=r}return{name:i,code:a,message:o}}function installProcessWarningFilter(){const e=resolveGlobalSingleton(warningFilterKey,()=>({installed:false}));if(e.installed)return;const t=process.emitWarning.bind(process);const wrappedEmitWarning=((...e)=>{if(shouldIgnoreWarning(normalizeWarningArgs(e)))return;if(e[0]instanceof Error&&isRecord(e[1])){const t=e[0];const n=Object.assign(new Error(t.message),{name:t.name,code:t.code});process.emit(`warning`,n);return}Reflect.apply(t,process,e)});process.emitWarning=wrappedEmitWarning;e.installed=true}
//!src/infra/sqlite-native-runtime.ts
const require=createRequire(import.meta.url);let validatedSqliteModule;let extensionLoadingSupported=false;let jsonbSupported=false;function assertSqliteWalResetSafeVersion(e,t){if(isSqliteWalResetSafeVersion(e))return;const n=process.config.variables;const r=n.node_shared_sqlite===true||n.node_shared_sqlite===`true`;throw new Error(`OpenClaw requires SQLite 3.51.3+, 3.50.7+ within 3.50.x, or 3.44.6+ within 3.44.x for WAL safety; Node ${t} ${r?`uses shared system`:`embeds`} SQLite ${e}, which is affected by the upstream WAL-reset database corruption bug. ${r?`Upgrade the system SQLite library to one of those safe versions, or use a Node build embedding a safe version.`:`Upgrade to Node 24.22.1+ or 26.12.1+ before retrying.`}`)}function sqliteNativeRuntimeIdentity(){return{pid:process.pid,executable:process.execPath,nodeVersion:process.versions.node,bunVersion:process.versions.bun,library:ensureSqliteLibrarySelected()}}function parseSqliteNativeRuntimeAdmission(e){if(!isRecord(e)||e.format!==1||typeof e.version!==`string`||typeof e.extensionLoadingSupported!==`boolean`)return;const t=sqliteNativeRuntimeIdentity();if(!isDeepStrictEqual(e.runtime,t))return;return{format:1,runtime:t,version:e.version,storageIdentity:isRecord(e.storageIdentity)&&typeof e.storageIdentity.sourceId===`string`&&typeof e.storageIdentity.compileOptions===`string`?{sourceId:e.storageIdentity.sourceId,compileOptions:e.storageIdentity.compileOptions}:void 0,extensionLoadingSupported:e.extensionLoadingSupported}}function safeSqliteNativeRuntimeAdmission(e){try{const t=parseSqliteNativeRuntimeAdmission(e);return t&&isSqliteWalResetSafeVersion(t.version)?t:void 0}catch{return}}function captureSqliteNativeRuntimeAdmission(){return safeSqliteNativeRuntimeAdmission(getEnvironmentData(SQLITE_NATIVE_RUNTIME_ADMISSION_KEY))}function installSqliteNativeRuntimeAdmission(e){const t=safeSqliteNativeRuntimeAdmission(e);if(t)setEnvironmentData(SQLITE_NATIVE_RUNTIME_ADMISSION_KEY,t)}function assertSafeSqliteRuntime(e){if(validatedSqliteModule===e)return;const t=parseSqliteNativeRuntimeAdmission(getEnvironmentData(SQLITE_NATIVE_RUNTIME_ADMISSION_KEY));if(t){assertSqliteWalResetSafeVersion(t.version,process.versions.node);jsonbSupported=(compareValidSemver(t.version,`3.45.0`)??-1)>=0;extensionLoadingSupported=t.extensionLoadingSupported;validatedSqliteModule=e;return}const n=new e.DatabaseSync(`:memory:`);let r;let i;let a;try{const e=n.prepare(`SELECT sqlite_version() AS version, sqlite_source_id() AS sourceId, (SELECT group_concat(compile_options, ',') FROM (SELECT compile_options FROM pragma_compile_options ORDER BY compile_options)) AS compileOptions, sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted`).get();r=typeof e?.version===`string`?e.version:`unknown`;assertSqliteWalResetSafeVersion(r,process.versions.node);if(typeof e?.sourceId===`string`&&e.sourceId&&typeof e.compileOptions===`string`)i={sourceId:e.sourceId,compileOptions:e.compileOptions};a=e?.omitted===0}finally{n.close()}jsonbSupported=(compareValidSemver(r,`3.45.0`)??-1)>=0;extensionLoadingSupported=a;validatedSqliteModule=e;setEnvironmentData(SQLITE_NATIVE_RUNTIME_ADMISSION_KEY,{format:1,runtime:sqliteNativeRuntimeIdentity(),version:r,storageIdentity:i,extensionLoadingSupported:a})}function requireNodeSqlite(){installProcessWarningFilter();try{ensureSqliteLibrarySelected();const e=require("node:sqlite");assertSafeSqliteRuntime(e);return e}catch(e){const t=formatErrorMessage(e);throw new Error(`SQLite support is unavailable or unsafe in this Node runtime. ${t}`,{cause:e})}}
//!src/state/openclaw-agent-schema.ts
const OPENCLAW_AGENT_SCHEMA_SQL=`-- Session storage doctrine: session_nodes.entry_json owns hot logical-session facts;
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
`;
//!src/state/openclaw-state-schema.ts
const OPENCLAW_STATE_SCHEMA_SQL=`

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
`;
//!src/state/openclaw-database-seal-schema.ts
const integrityPolicyRevision=3;function sqliteDatabaseSealSchemaFor(e){requireNodeSqlite();const t=captureSqliteNativeRuntimeAdmission();const n=t?.storageIdentity;if(!t||!n)return;const r=[t.runtime.nodeVersion,t.runtime.bunVersion??null];const i=JSON.stringify([t.version,n.sourceId,n.compileOptions,...r]);const a=createHash(`sha256`).update(JSON.stringify([integrityPolicyRevision,i,e]));const o=createHash(`sha256`).update(e);if(e!==`state`){a.update(String(42));a.update(OPENCLAW_AGENT_SCHEMA_SQL);o.update(String(42));o.update(OPENCLAW_AGENT_SCHEMA_SQL)}if(e!==`agent`){a.update(String(40));a.update(OPENCLAW_STATE_SCHEMA_SQL);o.update(String(40));o.update(OPENCLAW_STATE_SCHEMA_SQL)}return{schemaIdentity:a.digest(`hex`),identity:{runtime:JSON.stringify(r),sqlite:{version:t.version,sourceId:n.sourceId,compileOptions:n.compileOptions.split(`,`).filter(e=>!e.startsWith(`COMPILER=`)).join(`,`)},schema:o.digest(`hex`),policy:integrityPolicyRevision}}}
//!src/infra/sqlite-database-admission-seal.ts
const sealSchemas={};function sealSchema(e){const t=e.includes(`agent.schema-metadata`);const n=t===e.includes(`state.schema-version`)?`other`:t?`agent`:`state`;return sealSchemas[n]??=sqliteDatabaseSealSchemaFor(n)}const integrityVerificationKey={name:`sqlite.full-verification`,lifetime:`process`,read:e=>typeof e===`number`&&Number.isSafeInteger(e)?e:void 0};const quickIntegrityVerificationKey={...integrityVerificationKey,name:`sqlite.quick-verification`};const sealedKeys=/* @__PURE__ */ new Set([`sqlite-schema`,`sqlite.full-verification`,`sqlite.quick-verification`,`state.schema-version`,`state.runtime-schema`,`state.integrity`,`agent.completed-validation`,`agent.canonical-validation-receipt`,`agent.schema-metadata`]);function isSealedKey(e){return sealedKeys.has(e)||e.startsWith(`memory.index-schema:`)}function encodeSealValue(e,t){if(t instanceof Map)return{sealType:`map`,entries:[...t]};if(t instanceof Set)return{sealType:`set`,entries:[...t]};if(t instanceof SharedArrayBuffer)return{sealType:`shared`,entries:[...new Int32Array(t)]};return t}function decodeSealValue(e,t){if(!isRecord(t)||!Array.isArray(t.entries))return t;if(t.sealType===`map`)return new Map(t.entries);if(t.sealType===`set`)return new Set(t.entries);if(t.sealType===`shared`){const e=new SharedArrayBuffer(t.entries.length*Int32Array.BYTES_PER_ELEMENT);new Int32Array(e).set(t.entries);return e}return t}var SqliteDatabaseCleanCloseSeals=class{constructor(e,t){this.publishFact=e;this.references=t;this.loaded=/* @__PURE__ */ new WeakMap}isLoaded(e){return this.loaded.has(e)}markLoaded(e){const t=this.references.descriptor(e)??e;const n=this.loaded.get(t);if(n&&n!==e.generation)Atomics.store(new Int32Array(e.generation),SqliteDatabaseGenerationSlot.sealPresent,Atomics.load(new Int32Array(n),SqliteDatabaseGenerationSlot.sealPresent));this.loaded.set(t,e.generation)}load(e,t){if(threadId!==0)return;const n=this.references.descriptor(e)??e;if(this.loaded.has(n)){this.markLoaded(e);return}this.markLoaded(e);e.cleanCloseRefusal=`malformed-proof`;try{if(t?.refusal)e.cleanCloseRefusal=t.refusal;const n=t?t.seal:readSqliteCleanCloseSeal(e.location,fsSync.fstatSync(e.descriptor,{bigint:true}),t=>{e.cleanCloseRefusal=t});if(!n||typeof n.facts!==`string`)return;const r=JSON.parse(n.facts,decodeSealValue);if(!Array.isArray(r)||!r.every(e=>Array.isArray(e)&&e.length===3&&typeof e[0]===`string`&&isSealedKey(e[0])&&typeof e[1]===`boolean`)||!r.some(([e,,t])=>(e===integrityVerificationKey.name||e===quickIntegrityVerificationKey.name)&&t===n.verifiedAt)||!r.some(([e,,t])=>e===`sqlite-schema`&&isRecord(t)))return;const i=sealSchema(r.map(([e])=>e));if(!i){e.cleanCloseRefusal=`identity-mismatch`;return}const a=n.identity;if(a!==void 0&&(!isRecord(a)||typeof a.runtime!==`string`||typeof a.schema!==`string`||typeof a.policy!==`number`))return;if(isRecord(a)&&typeof a.sqlite!==`string`){if(!isRecord(a.sqlite)||typeof a.sqlite.version!==`string`||typeof a.sqlite.sourceId!==`string`||typeof a.sqlite.compileOptions!==`string`)return;const t=a.schema!==i.identity.schema;const n=a.policy!==i.identity.policy;const r=a.sqlite.compileOptions!==i.identity.sqlite.compileOptions;if(t||n||r){e.cleanCloseRefusal=t?`schema-mismatch`:n?`policy-mismatch`:`feature-mismatch`;return}}else if(n.schemaIdentity!==i.schemaIdentity){e.cleanCloseRefusal=`identity-mismatch`;return}const o=r.find(([e])=>e===`sqlite-schema`)?.[2];if(!(o.tableSql instanceof Map))return;if(hasPendingAgentStartupColumns(o.tableSql)){e.cleanCloseRefusal=`schema-mismatch`;return}delete e.cleanCloseRefusal;for(const[t,n,i]of r)this.publishFact(e,{name:t,schemaDependent:n,lifetime:`process`},{value:i},readSqliteDatabaseFactRevision(e,n));Atomics.store(new Int32Array(e.generation),SqliteDatabaseGenerationSlot.sealPresent,1)}catch{}finally{this.references.publish(e)}}invalidate(e,t){invalidateSqliteCleanCloseSeal(t?.location??e);if(t)Atomics.store(new Int32Array(t.generation),SqliteDatabaseGenerationSlot.sealPresent,0)}prepare(e,t,n){const r=this.preparePublication(e,t,n);if(t)this.references.retain(t);let i=t;return{publish:()=>i!==void 0&&r(),[Symbol.dispose]:()=>{const e=i;i=void 0;if(e)this.references.release(e)}}}preparePublication(e,t,n){if(!t||e.isTransaction)return()=>false;if(n===void 0)return()=>false;const r=[...t.facts].filter(([e,n])=>isSealedKey(e)&&isSqliteDatabaseAdmissionFactCurrent(t,n));if(!r.some(([e])=>e===`sqlite-schema`))return()=>false;const i=JSON.stringify(r.map(([e,t])=>[e,t.schemaDependent,t.value]),encodeSealValue);const a=sealSchema(r.map(([e])=>e));if(!a)return()=>false;return()=>{if(e.isOpen||readSqliteDatabaseGeneration(t,`retired`)!==0||r.some(([,e])=>Atomics.load(new Int32Array(e.current),0)!==1||e.revision!==readSqliteDatabaseFactRevision(t,e.schemaDependent)))return false;try{const e=fsSync.fstatSync(t.descriptor,{bigint:true});if(readSqliteDatabaseAdmissionIdentity(fsSync.statSync(t.location,{bigint:true}))!==t.identity)return false;const r=writeSqliteCleanCloseSeal(t.location,a.schemaIdentity,e,{verifiedAt:n,facts:i,identity:a.identity});Atomics.store(new Int32Array(t.generation),SqliteDatabaseGenerationSlot.sealPresent,r?1:0);return r}catch{return false}}}};
//!src/infra/sqlite-database-admission-wait.ts
const admissionWait=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteDatabaseAdmissionWait`),()=>new AsyncLocalStorage);function withSqliteDatabaseAdmissionWait(e,t){const n={wait:e,parent:admissionWait.getStore(),active:true};const close=()=>{n.active=false};let r=false;try{const e=admissionWait.run(n,t);if(isPromise(e)){r=true;e.then(close,close)}return e}finally{if(!r)close()}}const SETTLEMENT_GRACE_MS=1e4;function withSqliteDatabaseAdmissionSettlement(e){return withSqliteDatabaseAdmissionWait({settlesCancellation:true,deadlineAtMs:Date.now()+SETTLEMENT_GRACE_MS},e)}function readSqliteDatabaseAdmissionDeadline(){let e;for(let t=admissionWait.getStore();t;t=t.parent){if(!t.active)continue;const n=t.wait.deadlineAtMs;if(n!==void 0)e=Math.min(e??Infinity,n);if(t.wait.settlesCancellation)break}return e}function assertSqliteDatabaseAdmissionWaitActive(){try{for(let e=admissionWait.getStore();e;e=e.parent){if(!e.active)continue;if(e.wait.settlesCancellation)return;e.wait.assertActive?.()}}catch(e){throw wrapSqliteWorkerError(`SQLite admission facts exchange cancelled by its caller`,`unavailable`,e)}}function hasSqliteDatabaseAdmissionWait(){return admissionWait.getStore()!==void 0}
//!src/infra/sqlite-schema-mutation.ts
function schemaStatement(e){if(/^(?:CREATE|ALTER|DROP|REINDEX|VACUUM)\b/iu.test(e))return true;const t=/^(?:INSERT(?: OR \w+)? INTO|UPDATE(?: OR \w+)?|DELETE FROM|REPLACE INTO)\s+/iu.exec(e);if(t){const n=readSqlToken(e,t[0].length)?.raw??``;const r=n.slice(findSqlCharacter(n,`.`)+1);return[`sqlite_schema`,`sqlite_master`].includes(normalizeSqlIdentifier(r))}if(!/^PRAGMA\b/iu.test(e))return false;const n=[findSqlCharacter(e,`=`),findSqlCharacter(e,`(`)].filter(e=>e>=0);if(n.length===0)return false;const r=e.slice(6,Math.min(...n)).trim();const i=r.slice(findSqlCharacter(r,`.`)+1).trim();const a=i.startsWith(`'`)&&i.endsWith(`'`)?i.slice(1,-1).toLowerCase():normalizeSqlIdentifier(i);return[`user_version`,`schema_version`].includes(a)}function changesSchema(e){if(!/\b(?:CREATE|ALTER|DROP|REINDEX|VACUUM|PRAGMA|INSERT|UPDATE|DELETE|REPLACE)\b/iu.test(e))return false;let t=normalizeSqlWhitespace(e);while(t){t=t.replace(/^[\s;]+/u,``);const e=findSqlCharacter(t,`;`);if(schemaStatement(e<0?t:t.slice(0,e)))return true;t=e<0?``:t.slice(e+1)}return false}function createsOnlyTemporaryObject(e){let t=normalizeSqlWhitespace(e);const n=/^\s*CREATE\s+(?:TEMP|TEMPORARY)\s+(TABLE|TRIGGER)\b/iu.exec(t)?.[1]?.toUpperCase();if(!n)return false;let r=findSqlCharacter(t,`;`);if(n===`TABLE`)return r<0||t.slice(r+1).trim()===``;while(r>=0){t=t.slice(r+1).trim();r=findSqlCharacter(t,`;`);const e=(r<0?t:t.slice(0,r)).trim();if(/^END$/iu.test(e))return r<0||t.slice(r+1).trim()===``}return false}function changesOnlyTemporaryTable(e){const t=normalizeSqlWhitespace(e);const n=findSqlCharacter(t,`;`);if(n>=0&&t.slice(n+1).trim()!==``)return false;return/^CREATE\s+(?:TEMP|TEMPORARY)\s+TABLE\b/iu.test(t)||/^DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:temp|"temp"|`temp`|\[temp\])\s*\./iu.test(t)}function changesData(e){return hasUnquotedSqlKeyword(e,/\b(?:INSERT|UPDATE|DELETE|REPLACE)\b/giu)}function temporaryWriteTables(e){const t=[];let n=normalizeSqlWhitespace(e);while(n){n=n.replace(/^[\s;]+/u,``);const e=findSqlCharacter(n,`;`);const r=e<0?n:n.slice(0,e);if(changesData(r)){const e=/^(?:INSERT(?: OR \w+)? INTO|REPLACE INTO|UPDATE(?: OR \w+)?|DELETE FROM)\s+(?:temp|"temp"|`temp`|\[temp\])\s*\.\s*("(?:[^"]|"")+"|`(?:[^`]|``)+`|\[[^\]]+\]|[a-z_]\w*)(?=\s|\(|$)/iu.exec(r)?.[1];if(e===void 0)return;t.push(normalizeSqlIdentifier(e))}n=e<0?``:n.slice(e+1)}return t}const sqlLeadingTrivia=/^(?:\s|;|--[^\n]*(?:\n|$)|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*/u;const transactionControlPrefix=/^(BEGIN|SAVEPOINT|COMMIT|END|RELEASE|ROLLBACK)\b/i;function readTransactionControl(e,t){let n;let r=false;let i=false;let a=0;let o=e;while(o){o=o.replace(sqlLeadingTrivia,``);if(!o)break;a+=1;const e=o.includes(`;`)?findSqlCharacter(o,`;`):-1;const s=e<0?o:o.slice(0,e);const c=transactionControlPrefix.exec(s)?.[1]?.toUpperCase();if(c===`ROLLBACK`){n=c;i||=r;r=!/^ROLLBACK(?: TRANSACTION)? TO\b/iu.test(normalizeSqlWhitespace(s));i||=!r}else if(c||!/^SELECT\b/iu.test(s)&&(changesSchema(s)||changesData(s)))i=true;n||=c;if(e<0||t===`statement`)break;o=o.slice(e+1)}return n?{kind:n,single:a===1,outerRollback:r&&!i}:void 0}function canPreserveTransactionSnapshot(e,t){return Boolean(t&&e?.single&&(e.kind===`SAVEPOINT`||e.kind===`RELEASE`||e.kind===`ROLLBACK`))}function classifySqliteMutation(e,t){const n=changesSchema(e);const r=changesData(e);const i=n&&changesOnlyTemporaryTable(e);return{schemaChange:n,mainSchemaChange:n&&!i&&!createsOnlyTemporaryObject(e),temporaryTableSchemaChange:i,dataChange:r,temporaryWriteTables:r?temporaryWriteTables(e):void 0,control:readTransactionControl(e,t)}}
//!src/infra/sqlite-native-observer.ts
const pending=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteNativeExecution`),()=>/* @__PURE__ */ new WeakMap);const preparedMutations=resolveGlobalSingleton(Symbol.for(`openclaw.sqlitePreparedNativeMutation`),()=>/* @__PURE__ */ new WeakMap);function isPreparingSqliteNativeMutation(e){return preparedMutations.get(e)?.phase===`preparing`}const iteratorFinalizer=new FinalizationRegistry(e=>{for(const t of e)t.finish(false,true)});function createIteratorLifetime(e,t){const n={finished:false,invalidated:false,pause:()=>n.stopObservation(),invalidate:()=>{n.invalidated=true;n.finish()},stopObservation:(e=false,r=false)=>{const i=n.observed;n.observed=void 0;t.delete(n);i?.finish(e,r)},finish:(t=false,r=false)=>{if(!n.finished){n.finished=true;e.delete(n);n.stopObservation(t,r)}}};e.add(n);return n}const bindingMutation={schemaChange:false,mainSchemaChange:false,temporaryTableSchemaChange:false,dataChange:false,temporaryWriteTables:void 0,control:void 0};function observeSqliteNativeClose(e,t){for(const n of[`close`,Symbol.dispose]){if(typeof e[n]!==`function`)continue;const r=e[n].bind(e);e[n]=()=>{try{r()}finally{if(!e.isOpen)t()}}}}function callStatement(e,t){return Reflect.apply(e,void 0,t)}function observeSqliteNativeOperations(e,t,n){const begin=(t,r)=>{const i=preparedMutations.get(e);if(i){if(i.phase!==`armed`||r!==`execute`||!t.dataChange||t.schemaChange||t.control)throw new Error(`Prepared SQLite mutations must execute exactly one data statement`);i.phase=`observing`}const a=n(t,r);pending.set(e,(pending.get(e)??0)+1);return{...a,finish(t,n,r){try{a.finish(t,n,r)}finally{const t=(pending.get(e)??1)-1;if(t===0)pending.delete(e);else pending.set(e,t)}}}};const r=/* @__PURE__ */ new Set;const execute=(t,n,r=`execute`)=>{const i=preparedMutations.get(e);const a=begin(n,r);let o=false;let s=false;let c=false;try{if(i){i.phase=`preparing`;i.prepare();i.phase=`executing`}const e=t();s=true;if(r!==`bind`)a.stepped?.();o=true;return e}catch(t){c=Boolean(i&&(i.phase===`preparing`||!s&&(isSqliteLockError(t)||sqlitePrimaryResultCode(t)===19)));if(i&&!c){const n=wrapSqliteWorkerError(`Prepared SQLite mutation outcome is unknown`,`outcome-unknown`,t);discardSqliteTransactionState(e,n);throw n}throw t}finally{if(i)i.phase=`finished`;a.finish(o,false,c)}};e.exec=n=>execute(()=>t.DatabaseSync.prototype.exec.call(e,n),classifySqliteMutation(n,`batch`),`exec`);e.prepare=(...n)=>{const i=t.DatabaseSync.prototype.prepare.call(e,...n);let a;const resolveMutation=()=>a??=classifySqliteMutation(i.sourceSQL,`statement`);const o=Object.hasOwn(i,`run`)?i.run.bind(i):void 0;const s=Object.hasOwn(i,`get`)?i.get.bind(i):void 0;const c=Object.hasOwn(i,`all`)?i.all.bind(i):void 0;const l=Object.hasOwn(i,`iterate`)?i.iterate.bind(i):void 0;const u=/* @__PURE__ */ new Set;let d=false;const reset=(e,t=`reuse`)=>{if(u.size===0)return e();const n=[...u];const r=e();for(const e of n)if(t===`return`)e.pause();else e.invalidate();return r};const wrap=e=>(...t)=>execute(()=>reset(()=>callStatement(e(),t)),resolveMutation());i.run=wrap(()=>o??t.StatementSync.prototype.run.bind(i));i.get=wrap(()=>s??t.StatementSync.prototype.get.bind(i));i.all=wrap(()=>c??t.StatementSync.prototype.all.bind(i));i.iterate=(...n)=>{if(!d){iteratorFinalizer.register(i,u);d=true}const a=execute(()=>reset(()=>callStatement(l??t.StatementSync.prototype.iterate.bind(i),n)),bindingMutation,`bind`);const o=new WeakRef(a);const s=createIteratorLifetime(u,r);const c=a.next;const f=a.return;let p;a.next=function(...t){if(p&&this===o.deref()&&e.isOpen)return{...p};if(this!==o.deref()||s.invalidated||!e.isOpen)return c.apply(this,t);if(s.finished){s.finished=false;u.add(s)}s.observed??=begin(resolveMutation(),`iterate`);r.add(s);const n=c.apply(this,t);if(n.done){f?.call(this);p={...n};s.finish(true)}else s.observed?.stepped?.();return n};if(f)a.return=function(...t){if(p&&this===o.deref()&&e.isOpen)return{...p};if(this!==o.deref()||!e.isOpen)return f.apply(this,t);const n=execute(()=>s.finished||s.invalidated?f.apply(this,t):reset(()=>f.apply(this,t),`return`),bindingMutation,`bind`);if(n.done)p={...n};s.finish();return n};return a};for(const e of[`close`,Symbol.dispose]){const t=i[e]?.bind(i);if(t)i[e]=()=>reset(t,`finalize`)}return i};observeSqliteNativeClose(e,()=>{for(const e of r)e.invalidate()});return execute}
//!src/infra/sqlite-database-write-receipts.ts
const state=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteDatabaseWriteScopes`),()=>({writeScopes:/* @__PURE__ */ new WeakMap,pendingWriteScopes:/* @__PURE__ */ new WeakMap,localScopeRevisions:/* @__PURE__ */ new WeakMap,localUnscopedRevisions:/* @__PURE__ */ new WeakMap}));function createSqliteDatabaseWriteReceipts(e){function onSqliteDatabaseWriteSettled(t,n){const r=sqlPublicationAnchor(t);const i=e.admission(r);if(!i)return;let a=e.writeListeners.get(i);if(!a){a=/* @__PURE__ */ new Set;e.writeListeners.set(i,a)}return registerListener(a,n)}function settleWorker(t,n){const r=n>0?t.references.get(n):void 0;if(r&&Atomics.exchange(new Int32Array(r),1,0)>0){advanceSqliteDatabaseGeneration(t,`writeRevision`);advanceSqliteDatabaseGeneration(t,`unscopedWriteRevision`);const n=e.writeListeners.get(t);if(n)notifyListeners(n,void 0)}}function withSqliteDatabaseWriteScope(t,n,r){const i=sqlPublicationAnchor(t);const a=e.admission(i);if(!(a?readSqliteDatabaseGeneration(a,`writeScopeRevision`)>0:state.localScopeRevisions.has(i))){const e=r();if(isPromiseLike(e))throw new Error(`SQLite write scopes cannot await work`);return e}const o=normalizedWriteScopes(n);const s=state.writeScopes.get(i);state.writeScopes.set(i,o);try{const e=r();if(isPromiseLike(e))throw new Error(`SQLite write scopes cannot await work`);return e}finally{if(s)state.writeScopes.set(i,s);else state.writeScopes.delete(i)}}function withoutSqliteDatabaseWriteScope(e,t){const n=sqlPublicationAnchor(e);const r=state.writeScopes.get(n);state.writeScopes.delete(n);try{return t()}finally{if(r)state.writeScopes.set(n,r)}}function ensureWriteScopes(t,n,r){let i=false;for(const e of n){let n=t.writeScopes.get(e);if(!n||Atomics.load(n.state,1)!==0||r&&!pinWriteScope(n)){n=createScopeRevision();if(r)Atomics.store(n.state,2,1);if(threadId===0)advanceSqliteDatabaseGeneration(t,`writeScopeRevision`);i=true}if(r)r.push(n);retainSqliteDatabaseWriteScope(t,e,n)}if(i){advanceSqliteDatabaseGeneration(t,`publicationRevision`);e.publish(t,n)}}function pinWriteScope(e){let t=Atomics.load(e.state,2);while(t>=0){const n=Atomics.compareExchange(e.state,2,t,t+1);if(n===t)return true;t=n}return false}let t;let n=0;function createScopeRevision(){if(!t||n===t.byteLength){t=new SharedArrayBuffer(48*Int32Array.BYTES_PER_ELEMENT);n=0}const e=new Int32Array(t,n,3);n+=e.byteLength;return{identity:randomUUID(),state:e}}function retainSqliteDatabaseWriteScopesForPath(t,n){const r=e.pathAdmission(t);if(!r||isSqliteDatabaseAdmissionRetired(r))return;const i=[];let a=false;const release=()=>{if(a)return;a=true;try{for(const e of i)Atomics.sub(e.state,2,1);if(i.length>0&&!isSqliteDatabaseAdmissionRetired(r)&&pruneSqliteDatabaseWriteScopes(r)){advanceSqliteDatabaseGeneration(r,`publicationRevision`);e.publish(r,[])}}finally{e.release(r)}};try{e.retain(r);ensureWriteScopes(r,normalizedWriteScopes(n),i);return release}catch(e){release();throw e}}function retireSqliteDatabaseWriteScopes(t,n){const r=sqlPublicationAnchor(t);const i=normalizedWriteScopes(n);const a=e.admission(r);const retire=()=>{const t=a?.writeScopes??state.localScopeRevisions.get(r);const o=n.flatMap(e=>typeof e!==`string`&&e.partition===void 0?[normalizedWriteScopes([e])[0].slice(0,-1)+`,`]:[]);for(const e of t?.keys()??[])if(o.some(t=>e.startsWith(t)))i.push(e);if(!a){const e=state.localScopeRevisions.get(r);for(const t of i)e?.delete(t);return}if(isSqliteDatabaseAdmissionRetired(a))return;let s=false;for(const e of i){const t=a.writeScopes.get(e);if(t&&Atomics.exchange(t.state,1,1)===0)s=true}if(s){advanceSqliteDatabaseGeneration(a,`writeScopeRevision`);advanceSqliteDatabaseGeneration(a,`publicationRevision`);e.publish(a,i)}};if(!stageSqliteTransactionState(r,{commit:retire})&&!t.isTransaction)retire()}function prepareSqliteDatabaseScopedWriteRevisionForPath(t,n){const r=retainSqliteDatabaseWriteScopesForPath(t,n);if(!r)return;const i=e.pathAdmission(t);if(!i){r();return}const a=normalizedWriteScopes(n).map(e=>i.writeScopes.get(e));const o=a.map(e=>Atomics.load(e.state,0));const s=/* @__PURE__ */ new WeakMap;const c=new Int32Array(i.generation);let l=false;const inspectReference=e=>{let t=s.get(e);if(!t){t=new Int32Array(e);s.set(e,t)}l||=Atomics.load(t,1)>0};let u=Atomics.load(c,SqliteDatabaseGenerationSlot.schemaRevision);let d=Atomics.load(c,SqliteDatabaseGenerationSlot.unscopedWriteRevision);let f=0;let p=false;return{read(){if(p||Atomics.load(c,SqliteDatabaseGenerationSlot.retired)!==0)return;l=false;i.references.forEach(inspectReference);if(l)return;const e=Atomics.load(c,SqliteDatabaseGenerationSlot.schemaRevision);const t=Atomics.load(c,SqliteDatabaseGenerationSlot.unscopedWriteRevision);let n=u!==e||d!==t;u=e;d=t;for(let e=0;e<a.length;e++){const t=a[e];if(Atomics.load(t.state,1)!==0)return;const r=Atomics.load(t.state,0);n||=o[e]!==r;o[e]=r}if(n)f++;return f},release(){if(!p){p=true;r()}}}}function scopedWriteToken(e,t,n,r=0){const i=readSqliteDatabaseGeneration(e,`schemaRevision`)+r|0;const a=[];for(const r of t){const o=e.writeScopes.get(r);if(!o||Atomics.load(o.state,1)!==0)return JSON.stringify([e.identity,e.generationId,i,`database`,readSqliteDatabaseGeneration(e,`writeRevision`)+(n!==void 0?1:0)|0,t]);a.push([r,o.identity,Atomics.load(o.state,0)+(n?.has(r)?1:0)|0])}return JSON.stringify([e.identity,e.generationId,i,readSqliteDatabaseGeneration(e,`unscopedWriteRevision`)+(n===null?1:0)|0,a])}function localScopedWriteToken(e,t,n){return JSON.stringify([`memory`,(state.localUnscopedRevisions.get(e)??0)+(n===null?1:0),t.map(t=>[t,state.localScopeRevisions.get(e).get(t).identity,Atomics.load(state.localScopeRevisions.get(e).get(t).state,0)+(n?.has(t)?1:0)|0])])}function normalizedWriteScopes(e){return[...new Set((typeof e===`string`?[e]:e).map(e=>typeof e===`string`?JSON.stringify([`key`,toUSVString(e)]):JSON.stringify([`session-id`,toUSVString(e.sessionId),...e.partition===void 0?[]:[toUSVString(e.partition)]])))].toSorted()}function ensureLocalWriteScopes(e,t){const n=state.localScopeRevisions.get(e)??/* @__PURE__ */ new Map;for(const e of t)if(!n.has(e))n.set(e,createScopeRevision());state.localScopeRevisions.set(e,n)}function readScopedWriteToken(t,n,r,i=0){const a=normalizedWriteScopes(n);const o=e.admission(t);if(o)ensureWriteScopes(o,a);else ensureLocalWriteScopes(t,a);if(e.readRevision(t)===void 0)return;return o?scopedWriteToken(o,a,r,i):localScopedWriteToken(t,a,r)}function readSqliteDatabaseScopedWriteToken(e,t){return readScopedWriteToken(sqlPublicationAnchor(e),t)}function readSqliteDatabaseScopedWriteTokenForPath(t,n,r){const i=normalizedWriteScopes(n);const a=e.pathAdmission(t,r);if(!a||isSqliteDatabaseAdmissionRetired(a))return;ensureWriteScopes(a,i);return scopedWriteToken(a,i)}function readSqliteDatabaseScopedWriteTokensForPath(t,n){const r=e.pathAdmission(t);if(!r||isSqliteDatabaseAdmissionRetired(r))return;const i=n.map(normalizedWriteScopes);ensureWriteScopes(r,i.flat());return i.map(e=>scopedWriteToken(r,e))}function readSqliteDatabasePendingScopedWriteToken(t,n){const r=sqlPublicationAnchor(t);return readScopedWriteToken(r,n,state.pendingWriteScopes.get(r),e.hasPendingSchemaMutation(r)?1:0)}function readSqliteDatabaseWriteTokenForPath(t){const n=e.pathAdmission(t);if(!n||isSqliteDatabaseAdmissionRetired(n))return;return`${n.identity}:${n.generationId}:${readSqliteDatabaseGeneration(n,`writeRevision`)}`}function readSqliteDatabasePendingWriteToken(t){const n=sqlPublicationAnchor(t);if(!t.isOpen||!t.isTransaction&&!isPreparingSqliteNativeMutation(n)||!hasSqlitePostCommitScope(n)||e.suspended(n))return;const r=e.writer(n);if(!r||isSqliteDatabaseAdmissionRetired(r))return;return`${r.identity}:${r.generationId}:${readSqliteDatabaseGeneration(r,`writeRevision`)+1|0}`}return{cancel(e){state.pendingWriteScopes.delete(e)},begin(e,t){const n=t?void 0:state.writeScopes.get(e);const r=state.pendingWriteScopes.get(e);if(!n||r===null)state.pendingWriteScopes.set(e,null);else{const t=r??/* @__PURE__ */ new Set;for(const e of n)t.add(e);state.pendingWriteScopes.set(e,t)}},finish(e,t){const n=state.pendingWriteScopes.get(e);state.pendingWriteScopes.delete(e);let r=!n;if(n){const i=state.localScopeRevisions.get(e);for(const e of n){const n=i?.get(e);if(n)Atomics.add(n.state,0,1);const a=t?.writeScopes.get(e);if(a&&Atomics.load(a.state,1)===0)Atomics.add(a.state,0,1);else if(t&&(a||t.writeScopeRevision!==readSqliteDatabaseGeneration(t,`writeScopeRevision`)))r=true}}if(r){state.localUnscopedRevisions.set(e,(state.localUnscopedRevisions.get(e)??0)+1);if(t)advanceSqliteDatabaseGeneration(t,`unscopedWriteRevision`)}},settleWorker,onSqliteDatabaseWriteSettled,retireSqliteDatabaseWriteScopes,retainSqliteDatabaseWriteScopesForPath,prepareSqliteDatabaseScopedWriteRevisionForPath,withSqliteDatabaseWriteScope,withoutSqliteDatabaseWriteScope,readSqliteDatabaseScopedWriteToken,readSqliteDatabaseScopedWriteTokenForPath,readSqliteDatabaseScopedWriteTokensForPath,readSqliteDatabasePendingScopedWriteToken,readSqliteDatabaseWriteTokenForPath,readSqliteDatabasePendingWriteToken}}
//!src/infra/sqlite-schema-scope.ts
const postgresReadSnapshots=resolveGlobalSingleton(Symbol.for(`openclaw.postgresReadSnapshots`),()=>/* @__PURE__ */ new WeakMap);const sqliteSchemaOwners=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteSchemaFacts`),()=>/* @__PURE__ */ new WeakMap);function observeSqliteTransactionState(e,t){const n=e.isTransaction;if(t.transactionOpen!==n){if(t.transactionOpen)t.mutationRevision+=1;t.transactionOpen=n;t.transactionMutationRevision=void 0;t.transactionSnapshot=void 0;t.transactionRead=false;t.transactionCatalogBound=false}}function finishSqliteReadScope(e,t,n,r,i,a){const o=e.isTransaction;if(!i&&n&&!o)t.mutationRevision+=1;t.transactionOpen=o;if(!n||!o)t.transactionMutationRevision=o?a:void 0;if(n!==o||r){t.transactionSnapshot=void 0;t.transactionRead=false;t.transactionCatalogBound=false}}
//!src/infra/sqlite-database-admission.ts
const seals=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteDatabaseCleanCloseSeals`),()=>new SqliteDatabaseCleanCloseSeals(publishFact,{retain:e=>state$2.registry.changeReferences(e,1),release:releaseReference,publish:e=>state$2.registry.publish(e),descriptor:e=>state$2.registry.descriptors.get(e.identity)}));const descriptors=createSqliteDatabaseDescriptorOwner(seals);const{prepareOwnedSqliteDatabaseAdmission,prepareSqliteDatabaseAdmissionAsync,retainSqliteDatabaseAdmissionLocation,retainPreparedSqliteDatabaseAdmissionLocation,prepareSqliteDatabaseAdmission}=descriptors;const{pathAdmission}=descriptors;function recordSqliteDatabaseIntegrity(e,t=Date.now()){publishSqliteDatabaseAdmission(e,integrityVerificationKey,t)}function prepareSqliteDatabaseCleanClose(e){return seals.prepare(e,admission(e),getSqliteDatabaseAdmission(e,integrityVerificationKey)??getSqliteDatabaseAdmission(e,quickIntegrityVerificationKey))}const reader=createSqliteDatabaseAdmissionReader({state:state$2,admission,pathAdmission,prepareFileIdentity:prepareSqliteDatabaseAdmission,integrityVerificationKey,exchange:exchangeSqliteDatabaseAdmission,publishFact,retain:retainReference,release:releaseReference});const{readSqliteDatabaseCleanClose,readSqliteDatabaseWriteRevision,readSqliteDatabaseSiblingWriteRevision,readSqliteDatabaseIntegrityVerification,readSqliteDatabaseCleanCloseRefusal,getSqliteDatabaseAdmission,getSqliteDatabaseSchemaRevision,getOrLoadSqliteDatabaseAdmissionForPath,peekSqliteDatabaseAdmissionForPath,prepareSqliteDatabaseAdmissionForPath,hasSqliteDatabaseSchemaAdmissionForPath,getSqliteDatabaseAdmissionIdentityForPath,getSqliteDatabaseAdmissionSourceForPath,observeSqliteDatabaseAdmissionLocation,hasSqliteDatabaseSchemaAdmissionForIdentity,retainSqliteDatabaseAdmissionForPath}=reader;const scopedWrites=createSqliteDatabaseWriteReceipts({admission,pathAdmission:(e,t)=>t?t.key.startsWith(`file:`)?state$2.registry.records.get(`${t.key.slice(5)}:${t.birthtime}`):void 0:pathAdmission(e),retain:retainReference,release:releaseReference,writeListeners:state$2.writeListeners,readRevision:readSqliteDatabaseWriteRevision,writer:e=>state$2.dataWriters.get(e),suspended:e=>state$2.suspended.has(e),hasPendingSchemaMutation:e=>e.isTransaction&&sqliteSchemaOwners.get(e)?.transactionalSchema===true,publish(e,t){state$2.registry.publish(e,t);exchangeSqliteDatabaseAdmission(e)}});const{onSqliteDatabaseWriteSettled,retireSqliteDatabaseWriteScopes,retainSqliteDatabaseWriteScopesForPath,prepareSqliteDatabaseScopedWriteRevisionForPath,withSqliteDatabaseWriteScope,withoutSqliteDatabaseWriteScope,readSqliteDatabaseScopedWriteToken,readSqliteDatabaseScopedWriteTokenForPath,readSqliteDatabaseScopedWriteTokensForPath,readSqliteDatabasePendingScopedWriteToken,readSqliteDatabaseWriteTokenForPath,readSqliteDatabasePendingWriteToken}=scopedWrites;function settleSqliteDatabaseAdmissionPublication(e){if(e.isTransaction||getSqliteNativeAdmissionFacts(e)||hasSqlitePostCommitScope(e)||state$2.exchanging)return false;const t=admission(e);if(t)exchangeSqliteDatabaseAdmission(t,void 0,true);return true}function bindSqliteDatabaseAdmission(e,t){state$2.connections.delete(e);state$2.openedIdentities.delete(e);state$2.unproven.delete(e);const n=e.location();if(!n||n===`:memory:`)return;const r=prepareSqliteDatabaseAdmission(n);if(t!==void 0&&r!==t)throw new Error(`SQLite database changed identity during native open`);if(!r)return;state$2.openedIdentities.set(e,r);if(t===void 0){state$2.unproven.add(e);return}const i=state$2.registry.records.get(r);if(i&&!isSqliteDatabaseAdmissionRetired(i)||state$2.registry.descriptors.get(r)?.facts.size)admission(e)}function admission(e,t=true){const n=state$2.openedIdentities.get(e);if(!e.isOpen||n===void 0||state$2.unproven.has(e))return;const r=state$2.connections.get(e);if(r)return isSqliteDatabaseAdmissionRetired(r)?void 0:r;const i=e.location();if(!i||i===`:memory:`)return;const a=t&&!e.isTransaction?pathAdmission(i,n):state$2.registry.records.get(n);if(a&&a.identity!==n)throw new Error(`SQLite database changed identity before admission`);return a&&!isSqliteDatabaseAdmissionRetired(a)?retainConnection(e,a):void 0}function retainConnection(e,t){const n=t.identity;let r=t;try{for(;;){if(r.identity!==n)throw new Error(`SQLite database changed identity during native open`);const t=state$2.registry.changeReferences(r,1);let i=false;try{if(t)exchangeSqliteDatabaseAdmission(r);const n=readSqliteDatabaseGeneration(r,`retired`);if(n===0){state$2.connections.set(e,r);i=true;return r}if(n!==2)throw new Error(`SQLite database admission retired during native open`)}finally{if(!i)state$2.registry.changeReferences(r,-1)}const a=e.location();const o=e.isTransaction?state$2.registry.records.get(n):a?pathAdmission(a,prepareSqliteDatabaseAdmission(a)):void 0;if(!o||isSqliteDatabaseAdmissionRetired(o))throw new Error(`SQLite database admission unavailable during native open`);r=o}}catch(t){state$2.openedIdentities.delete(e);throw t}}function releaseSqliteDatabaseAdmission(e){const t=state$2.connections.get(e);if(state$2.openedIdentities.delete(e)&&t){state$2.local.delete(e);releaseReference(t)}}function retainReference(e){if(state$2.registry.changeReferences(e,1))exchangeSqliteDatabaseAdmission(e)}function releaseReference(e){if(state$2.registry.changeReferences(e,-1)){state$2.localSchemaRevisions.delete(e.identity);exchangeSqliteDatabaseAdmission(e)}}function publishFact(e,t,n,r){if(t.writer===`host`&&threadId!==0)throw new Error(`SQLite host-owned admission facts require the host publisher`);if(!publishSqliteDatabaseFact(e,t,n,r,`${threadId}:${++state$2.publication}`))return;state$2.registry.publish(e);if(t.writer!==`connection`)exchangeSqliteDatabaseAdmission(e)}function beginSqliteDatabaseWrite(e,t=false){const n=admission(e);if(n&&Atomics.load(new Int32Array(n.generation),SqliteDatabaseGenerationSlot.sealPresent)===1)seals.invalidate(n.location,n);scopedWrites.begin(e,t);if(state$2.dataWriters.has(e))return;state$2.dataWriters.set(e,n);if(n)Atomics.add(new Int32Array(n.references.get(threadId)),1,1)}function finishSqliteDatabaseWrite(e,t=false){if(!state$2.dataWriters.has(e))return;const n=state$2.dataWriters.get(e);state$2.dataWriters.delete(e);if(t){scopedWrites.cancel(e);if(n)Atomics.sub(new Int32Array(n.references.get(threadId)),1,1);return}state$2.localWriteRevisions.set(e,(state$2.localWriteRevisions.get(e)??0)+1);scopedWrites.finish(e,n);if(n){advanceSqliteDatabaseGeneration(n,`writeRevision`);Atomics.sub(new Int32Array(n.references.get(threadId)),1,1);const e=state$2.writeListeners.get(n);if(e)notifyListeners(e,void 0)}}function trackSqliteDatabaseAdmissionWorker(e){const t=e.threadId;e.once(`exit`,()=>{for(const e of state$2.registry.records.values())scopedWrites.settleWorker(e,t);state$2.registry.releaseWorker(t)})}function hasPendingSqliteDatabaseSchemaMutation(e){const t=sqlPublicationAnchor(e);return e.isTransaction&&state$2.schemaDirty.has(t)}function publishSqliteDatabaseAdmission(e,t,n,r={}){const i=sqlPublicationAnchor(e);const a=admission(i,!e.isTransaction);if(!a||isSqliteDatabaseAdmissionRetired(a)||state$2.suspended.has(i))return;if(t.writer===`host`&&threadId!==0)throw new Error(`SQLite host-owned admission facts require the host publisher`);const o=(t.schemaDependent?r.schemaRevision:void 0)??readSqliteDatabaseFactRevision(a,t.schemaDependent);const s=isPostgresSqlConnection(e)?void 0:getSqliteNativeAdmissionFacts(e);const c=admitSqliteDatabaseFactValue(t,n);if(!s&&!e.isTransaction&&!hasSqlitePostCommitScope(e)){publishFact(a,t,c,o);return}const l={...c,revision:o,schemaDependent:t.schemaDependent===true,ddlRevision:state$2.ddlRevisions.get(i)??0};if(s){s.set(t.name,l);return}const u=state$2.local.get(i)??/* @__PURE__ */ new Map;state$2.local.set(i,u);const d=u.get(t.name);const restore=()=>{if(state$2.local.get(i)!==u)return;if(d===void 0)u.delete(t.name);else u.set(t.name,d)};stageSqliteTransactionState(i,{stage:()=>u.set(t.name,l),rollback:restore,commit:()=>{if(state$2.local.get(i)===u&&u.get(t.name)===l){u.delete(t.name);if(l.revision===readSqliteDatabaseFactRevision(a,l.schemaDependent)&&(!l.schemaDependent||l.ddlRevision===(state$2.ddlRevisions.get(i)??0)))publishFact(a,t,l,l.revision)}}})}function invalidateLocalSqliteSchemaAdmissions(e){const t=sqlPublicationAnchor(e);const n=state$2.ddlRevisions.get(t)??0;const r=state$2.schemaDirty.has(t);const stage=()=>{state$2.ddlRevisions.set(t,n+1);state$2.schemaDirty.add(t)};if(!stageSqliteTransactionState(t,{stage,commit:()=>{},rollback:()=>{state$2.ddlRevisions.set(t,n);if(!r)state$2.schemaDirty.delete(t)}}))stage()}function discardSqliteDatabaseTransactionAdmissions(e){const t=sqlPublicationAnchor(e);const n=admission(t,false);for(const r of[isPostgresSqlConnection(e)?void 0:getSqliteNativeAdmissionFacts(e),state$2.local.get(t)]){for(const e of r?.keys()??[]){const t=n?.facts.get(e);if(t)Atomics.store(new Int32Array(t.current),0,0)}r?.clear()}state$2.local.delete(t);state$2.rolledBack.add(t);if(!e.isTransaction)state$2.schemaDirty.delete(t)}function publishSqliteDatabaseSchemaChange(e){const t=sqlPublicationAnchor(e);const n=admission(t,false);if(n){const e=advanceSqliteDatabaseGeneration(n,`schemaRevision`);const r=state$2.ddlRevisions.get(t)??0;for(const n of state$2.local.get(t)?.values()??[])if(n.schemaDependent&&n.revision===e&&n.ddlRevision===r)n.revision=e+1}else{const e=state$2.openedIdentities.get(t);if(e)state$2.localSchemaRevisions.set(e,(state$2.localSchemaRevisions.get(e)??0)+1)}if(!e.isTransaction)state$2.schemaDirty.delete(t)}function revoke(e,t=e?.location){if(t)seals.invalidate(t,e);revokeSqliteDatabaseAdmissionFacts(e)}function revokeSqliteDatabaseAdmissions(e){revoke(state$2.connections.get(e)??admission(e));state$2.local.delete(e)}function revokeSqliteDatabaseAdmissionsForPath(e){revoke(pathAdmission(e),e)}function*captureSqliteDatabaseDescriptorCustodyLocations(){for(const{location:e}of state$2.registry.descriptors.values())yield e}function retireSqliteDatabaseAdmissionForPath(e,t={}){withSqliteDatabaseAdmissionSettlement(()=>{const n=prepareSqliteDatabaseAdmission(e);if(!n)return;state$2.localSchemaRevisions.delete(n);const r=threadId===0?state$2.registry.records.get(n):pathAdmission(e);if(state$2.registry.retireDescriptor(n,t)&&r)exchangeSqliteDatabaseAdmission(r)})}function suspendSqliteDatabaseAdmission(e,t){if(t)state$2.suspended.add(e);else state$2.suspended.delete(e)}export{STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS as $,retireSqliteDatabaseAdmissionForPath as A,hasSqlitePostCommitScope as At,observeSqliteNativeClose as B,readSqliteDatabaseWriteRevision as C,readSqliteOperationHoldContext as Ct,retainPreparedSqliteDatabaseAdmissionLocation as D,sqliteReaderDatabasePathKey as Dt,releaseSqliteDatabaseAdmission as E,retainSqliteReader as Et,trackSqliteDatabaseAdmissionWorker as F,withSqlitePostCommitPublications as Ft,readSqliteDatabaseAdmissionDeadline as G,canPreserveTransactionSnapshot as H,finishSqliteReadScope as I,OPENCLAW_STATE_SCHEMA_SQL as J,withSqliteDatabaseAdmissionSettlement as K,observeSqliteTransactionState as L,revokeSqliteDatabaseAdmissionsForPath as M,publishSqliteCommittedState as Mt,settleSqliteDatabaseAdmissionPublication as N,stageSqliteCommittedPublication as Nt,retainSqliteDatabaseAdmissionForPath as O,deferSqlitePostCommitPublication as Ot,suspendSqliteDatabaseAdmission as P,stageSqliteTransactionState as Pt,FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS as Q,postgresReadSnapshots as R,readSqliteDatabaseCleanCloseRefusal as S,currentSqliteOperationTiming as St,recordSqliteDatabaseIntegrity as T,registerSqliteReaderConnection as Tt,assertSqliteDatabaseAdmissionWaitActive as U,observeSqliteNativeOperations as V,hasSqliteDatabaseAdmissionWait as W,installSqliteNativeRuntimeAdmission as X,OPENCLAW_AGENT_SCHEMA_SQL as Y,requireNodeSqlite as Z,prepareSqliteDatabaseAdmissionAsync as _,ensureSqliteLibrarySelected as _t,finishSqliteDatabaseWrite as a,canShareSqliteDatabaseAdmissions as at,publishSqliteDatabaseSchemaChange as b,assertNoActiveSqliteReaders as bt,getSqliteDatabaseAdmissionIdentityForPath as c,readSqliteTransactionWriter as ct,hasSqliteDatabaseSchemaAdmissionForIdentity as d,withSqliteDatabaseAdmissionExchange as dt,createSqliteIndexContract as et,invalidateLocalSqliteSchemaAdmissions as f,createSqliteDatabaseAdmissionCursor as ft,prepareSqliteDatabaseAdmission as g,captureSqliteWorkerEnvironmentData as gt,peekSqliteDatabaseAdmissionForPath as h,captureSqliteWorkerClosePolicy as ht,discardSqliteDatabaseTransactionAdmissions as i,resolveSqliteDatabaseFilePath as it,revokeSqliteDatabaseAdmissions as j,prepareSqliteTransactionCommit as jt,retainSqliteDatabaseAdmissionLocation as k,discardSqliteTransactionState as kt,getSqliteDatabaseSchemaRevision as l,recordSqliteTransactionWriter as lt,onSqliteDatabaseWriteSettled as m,readSqliteDatabaseAdmissions as mt,bindSqliteDatabaseAdmission as n,parseSqliteTableDefinition as nt,getOrLoadSqliteDatabaseAdmissionForPath as o,captureSqliteDatabaseAdmissions as ot,observeSqliteDatabaseAdmissionLocation as p,readSqliteDatabaseAdmissionIdentity as pt,withSqliteDatabaseAdmissionWait as q,captureSqliteDatabaseDescriptorCustodyLocations as r,beginSqliteDatabaseAdmissionOperation as rt,getSqliteDatabaseAdmission as s,installSqliteDatabaseAdmissions as st,beginSqliteDatabaseWrite as t,createSqliteTableContract as tt,hasPendingSqliteDatabaseSchemaMutation as u,sqliteTransactionWriterSlot as ut,prepareSqliteDatabaseCleanClose as v,getSqliteRuntimeCapabilities as vt,readSqliteDatabaseWriteTokenForPath as w,readSqliteReaderDiagnosticsForPath as wt,readSqliteDatabaseCleanClose as x,captureSqliteReaderOwner as xt,publishSqliteDatabaseAdmission as y,withSelectedSqliteLibraryEnv as yt,sqliteSchemaOwners as z};