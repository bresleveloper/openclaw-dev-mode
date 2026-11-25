import{I as getPluginExecutionFrame,J as MAX_TIMER_TIMEOUT_MS,Q as parseDateStringTimestampMs,X as asPositiveSafeInteger,Y as asFiniteNumber,Z as asSafeIntegerInRange,at as hasErrnoCode,f as resolveStateDir,gt as asNullableRecord,it as resolveGlobalSingleton,pt as normalizeNullableString,vt as asOptionalRecord,yt as isRecord,z as runInDetachedAsyncContext}from"./paths-B1tj13JF.js";import{l as runWithMainThreadTask,r as registerProcessExitCleanup,t as createSubsystemLogger}from"./subsystem-DpZ9wPI4.js";import{i as statIfExists,r as resolveIdentityPathViaExistingAncestorSync}from"./path-existence-B3MCCp92.js";import{D as isStartupConfigStateRead,E as isLiveStateRead,O as withArtifactPreservingStateReads,R as normalizeAgentId,T as isArtifactPreservingStateRead,a as runSqliteReadOnlyOperation,w as artifactPreservingReads}from"./sqlite-readonly-worker-DQkQ_BE1.js";import"./directory-durability-D2Y6jCCs.js";import"./agent-database-admission-BvJuINEI.js";import{t as isDeeplyFrozenPlainData}from"./immutable-data-Dwp_pJgG.js";import{r as materializeErrorStack,t as createDeferredCore}from"./deferred-BFM38QHJ.js";import{c as sleepWithAbort}from"./runtime-process-manifest-DnVEqV6G.js";import{n as getAsyncWorkSignal,r as runOutsideAsyncWorkScope,t as AsyncWorkScope}from"./async-work-scope-CoLpEO3C.js";import{A as captureOpenClawStateReadContextWithAdmission,B as tablePrimaryKeyColumns,C as publishStateSchemaVersionAdmission,Ct as isSqliteSnapshotReuseActive,D as openTrackedStateDatabase,F as classifySqliteTableReadError,I as ensureColumn,J as isExistingOpenClawStateSchema,L as readTableColumns,O as openTrackedStateDatabaseResult,P as stateCronIdentityMigration,Q as isGatewayExternallySupervised,R as tableExists,S as publishStateRuntimeSchemaAdmission,St as captureReusableSqliteSource,T as rememberStateSchemaVersionAdmission,Tt as publishReusableSqliteSnapshot,W as getSqliteWorkerStateIntegrityAdmission,X as jsonPathValue,Z as jsonValid,_ as invalidateOpenClawStateRuntimeIntegrity,b as getStateRuntimeSchemaAdmission,d as registerOpenClawStateDatabaseLifecycleListener,f as registerOpenClawStatePathAsyncResource,ft as prepareSqliteReadOnlyLocation,gt as isUpdateRehearsalPrivateDatabase,h as assertOpenClawStateRuntimeIntegrity,ht as startSqliteReadOnlyLocationAsync,it as isSqliteWalWorkerMaintained,j as captureOpenClawStateReadWorkerContextWithAdmission,k as readTrackedStateDatabaseIdentity,lt as assertSqliteTableIntegrity,m as retainOpenClawStateDatabaseForIndependentRead,mt as prepareSqliteReadOnlyLocationSync,n as borrowOpenClawStateDatabaseForAsyncRead,nt as cancelSqliteWalWriteAdmission,o as openClawStateDatabaseCache,p as requireOpenClawStateDatabaseIdentity,pt as prepareSqliteReadOnlyLocationAwaited,r as captureOpenClawStateDatabaseReadAdmission,rt as createSqliteWalMaintenanceScheduler,tt as cloneEnvWithPlatformSemantics,u as registerOpenClawStateDatabaseAsyncResource,v as adoptPeerPublishedStateSchemaVersion,wt as leaseReusableSqliteSnapshot,x as getStateSchemaVersionAdmission,xt as resolveSqliteDatabaseFilePaths,z as tableHasColumn}from"./openclaw-state-db-cache-Dndux4ay.js";import{A as getSqliteDatabaseAdmission,Bn as getSqliteRuntimeCapabilities,F as invalidateLocalSqliteSchemaAdmissions,Gt as OPENCLAW_AGENT_SCHEMA_SQL,H as publishSqliteDatabaseAdmission,It as readSqliteDatabaseAdmissionDeadline,K as readSqliteDatabaseWriteRevision,L as onSqliteDatabaseWriteSettled,Mn as isPostgresSqlConnection,Nn as sqlPublicationAnchor,Pn as isPromiseLike,Pt as assertSqliteDatabaseAdmissionWaitActive,Qt as parseSqliteTableDefinition,R as peekSqliteDatabaseAdmissionForPath,Rt as withSqliteDatabaseAdmissionWait,Sn as assertExistingDatabaseIdentity,St as isSqliteLockError,Tn as normalizeDatabasePath,U as publishSqliteDatabaseSchemaChange,Un as resolveRuntimeProcessEntrypointUrl,W as readSqliteDatabaseCleanClose,Wt as OPENCLAW_STATE_SCHEMA_SQL,Yt as STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS,Z as retainSqliteDatabaseAdmissionForPath,bn as assertDatabaseFileIdentity,cn as createSqliteLifecycleAggregateError,en as resolveSqliteDatabaseFilePath,ft as deferSqlitePostCommitPublication,in as SqliteCoordinatorError,kn as readDatabasePathIdentitySync,ln as runWithSqliteCleanup,nn as OpenClawStateOwnershipError,r as captureRuntimeWorkerSource,rn as OpenClawStateOwnershipMetadataError,tn as OpenClawStateExternalOwnershipError,un as throwSqliteLifecycleErrors,v as readSqliteReaderDiagnosticsForPath,vt as stageSqliteTransactionState,x as sqliteReaderDatabasePathKey,xt as isSqliteCorruptionError,yt as withSqlitePostCommitPublications,zn as ensureSqliteLibrarySelected}from"./sqlite-worker-request-class-DPiQUnSS.js";import{Bt as allowsMaintenanceLiveAuthorityReads,Ct as normalizeSqliteNonNegativeInteger,Et as setSqliteBusyTimeout,H as openNodeSqliteDatabase,Kt as observeOpenClawDatabaseMaintenanceResource,Mt as enableNodeSqliteKyselyStatementCache,O as retainSnapshotTempDirectory,Rt as registerNodeSqliteDisposeGuard,St as assertPostgresCatalog,Tt as runWithSqliteBusyTimeout,Ut as getOpenClawDatabaseMaintenanceScope,Wt as hasAdmittedMaintenanceLiveAuthorityReads,X as invalidateSqliteSchemaFacts,Y as getAdmittedSqliteSchemaFacts,a as existingPathOrUndefined,c as resolveOpenClawRegisteredAgentDatabasePath,ct as requireNativeDatabaseFile,et as runSqliteReadOperationSync,k as retainSnapshotWork,l as resolveOpenClawStateDirForDatabasePath,nt as readSqliteSchemaObjects,o as resolveDatabasePath,ot as admitPostgresPhysicalFacts,q as admitSqliteSchema,rt as schemaAdmission,s as resolveOpenClawAgentDatabaseStoredPath,st as getPostgresPhysicalFacts,t as StateDatabaseReadAdmissionInvalidatedError,tt as captureSqliteSchemaFacts,u as resolveOpenClawStateSqlitePath}from"./openclaw-state-db-async-lifecycle-CGQ0ypyu.js";import{a as normalizeSchemaSql,c as quoteSqliteIdentifier,d as splitSqlList,n as findSqlCharacter,r as findSqlClosingParenthesis,t as extractSqliteTableSchema}from"./sqlite-schema-sql-D2HdV_QG.js";import{t as formatErrorMessage}from"./errors-BIWVPEVq.js";import{a as collectSqliteSchemaIssues,d as openEngineStore,g as runUpdateSqliteMigration,i as collectSqliteNamedIndexContract,n as assertSqliteSchemaContains,o as getCanonicalSqliteNamedIndexContracts,r as assertSqliteSchemaTablesPresent,s as getCanonicalSqliteNamedIndexNames,u as readSqliteSchemaCookie}from"./sqlite-source-handle-B3p4sZ2p.js";import{A as getDatabaseEngineSelection,C as GatewayStateOwnerContentionError,T as StateDatabaseAdmissionPendingError,c as getPostgresPool,k as getDatabaseEngineInput}from"./sqlite-worker-operation-settlement-BKv8dJkB.js";import{$ as string,A as getStateDatabaseSchemaLease,B as parseGatewayLockPayload,C as runSqliteSingleStatementSync,D as assertStateDatabaseAccessAllowed,E as acquireStateDatabaseSchemaLease,H as _enum,I as GatewayLockNamespaceError,K as discriminatedUnion,L as GatewayProcessNamespaceSchema,M as resolveGatewayStateOwnerPath,P as readOwnerPaths,Q as record,R as MachineIdentitySchema,S as runSqliteReadSnapshotSync,U as array,V as createManagedHandoffBootIdentityReader,W as boolean,X as number,Z as object,_ as withEngineStoreAdmission,a as throwSqliteSchemaMismatches,b as runSqliteDeferredTransactionSync,c as executeSqliteQueryTakeFirstSync,ct as prepareSqliteReadOnlyLocationFromOwnedDatabase,d as prepareSqliteQuerySync,dt as acquireSqliteSnapshotReadToken,et as union,g as getDatabaseProcessRole,j as prepareStateDatabaseReadAccess,l as getNodeSqliteKysely,nt as createSqliteTableContractReader,o as createSqliteQueryCache,p as SQLITE_IDLE_HANDLE_TTL_MS,q as literal$1,s as executeSqliteQuerySync,t as SqliteSchemaMismatchError,u as iterateSqliteQuerySync,v as assertTransactionUsable,x as runSqliteImmediateTransactionSync,z as classifyGatewayOwnerProcessNamespace}from"./sqlite-schema-issues-a8r7vGNK.js";import{g as DEFAULT_WORKER_PENDING_BYTES,h as WorkerTaskError}from"./worker-request-diagnostics-CwUlD9BI.js";import{c as createNewerSqliteSchemaVersionError,f as readSqliteUserVersion,g as VERSION,i as OpenClawStateDatabaseSchemaMigrationRequiredError,n as hydrateOpenClawStateWorkerError,o as normalizeOpenClawStateSchemaReadError,p as readSqliteWriterAppVersion,r as retainOpenClawStateWorkerErrorPayload}from"./sqlite-snapshot-staging-owner-CYVNHwkY.js";import{a as LAZY_ADDITIVE_STATE_TABLES,i as LAZY_ADDITIVE_STATE_INDEXES,l as STATE_MIGRATION_VERSIONS,n as FIRST_USE_STATE_INDEXES,r as FIRST_USE_STATE_TABLES,s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,t as DOCTOR_OWNED_STATE_TABLES}from"./openclaw-state-db-contract-lz-66XzZ.js";import{g as captureRetainedNativeWorkerSource,l as SqliteDatabaseAdmissionTimeoutError,m as resolveStateReadWorkerCount,n as createOwnedWorkerTaskPool,o as requestSqliteWorkerSchemaMaintenance}from"./worker-task-pool-Bejt7BxR.js";import{i as isPidDefinitelyDead,t as getFileLockProcessStartTime}from"./pid-alive-DKo0INea.js";import{u as sha256Base64Url}from"./gateway-process-argv-Bndv1s3N.js";import{t as acquireSqliteDatabaseAdmissionTurn}from"./sqlite-database-admission-turn-DCY0sz8P.js";import{r as runPluginSharedStateWork,t as acquireWithWait}from"./acquire-with-wait-CvD8BrsD.js";import path from"node:path";import fsPromises,{stat}from"node:fs/promises";import fs,{existsSync,lstatSync,readlinkSync,statSync}from"node:fs";import{isDeepStrictEqual,promisify}from"node:util";import{sameFileIdentity}from"@openclaw/fs-safe/advanced";import{createHash,randomUUID}from"node:crypto";import{hostname}from"node:os";import{AsyncLocalStorage}from"node:async_hooks";import{getEnvironmentData,isMainThread}from"node:worker_threads";import{performance as performance$1}from"node:perf_hooks";import{parse}from"semver";import JSON5 from"json5";import{probeTreeClone}from"@openclaw/fs-safe/copy";
//!packages/normalization-core/src/json-coercion.ts
function safeParseJson(e){try{return JSON.parse(e)}catch{return}}function safeParseJsonRecord(e){return/^[\t\n\r ]*\{/.test(e)?asOptionalRecord(safeParseJson(e)):void 0}
//!src/state/openclaw-agent-db-identity.ts
const identities=resolveGlobalSingleton(Symbol.for(`openclaw.agentDatabaseIdentities`),()=>/* @__PURE__ */ new WeakMap);function readOpenClawAgentDatabaseIdentity(e){const t=findOpenClawAgentDatabaseIdentity(e);if(t===void 0)throw new Error(`OpenClaw agent database identity was not prepared at open`);return t}function findOpenClawAgentDatabaseIdentity(e){return identities.get(sqlPublicationAnchor(e.db))}function currentConnectionIdentity(e){const t=sqlPublicationAnchor(e.db);if(!e.db.isOpen||!t.isOpen)return;const n=readOpenClawAgentDatabaseIdentity(e);return normalizeDatabasePath(t.location()??``)===n.filename?n:void 0}function isOpenClawAgentDatabasePathCurrent(e){const t=currentConnectionIdentity(e);if(!t)return false;const n=statSync(e.path,{bigint:true,throwIfNoEntry:false});return n!==void 0&&t.identity===`${n.dev}:${n.ino}`}
//!src/state/openclaw-agent-db-borrower.ts
const agentDatabaseBorrowers=resolveGlobalSingleton(Symbol.for(`openclaw.agentDatabaseBorrowers`),()=>({databases:/* @__PURE__ */ new Map,borrowers:/* @__PURE__ */ new WeakMap,idleTimers:/* @__PURE__ */ new WeakMap,failures:/* @__PURE__ */ new Map}));
//!src/infra/database-engine/postgres-index-ordering.ts
const generatedIndexes=/CREATE (?:UNIQUE )?INDEX ("(?:[^"]|"")+") ON ("(?:[^"]|"")+") (?:'(?:[^']|'')*'|"(?:[^"]|"")*"|[^;'"])*;/g;const orderedKeys=/'(?:[^']|'')*'|"(?:[^"]|"")*"|\) (ASC|DESC)(?=,|\))/g;function withLegacyPostgresIndexOrdering(e,t=`sqlite`,n=e){const r=/* @__PURE__ */ new Map;if(t===`schema-nullability`)for(const[,e,t]of n.matchAll(/CREATE TABLE ("(?:[^"]|"")+") \(\n([\s\S]*?)\n\);/g))r.set(e,new Set([...t.matchAll(/^ {2}("(?:[^"]|"")+") (?:text|bigint|bytea|double precision)([^\n]*)/gm)].filter(e=>!/\bNOT NULL\b/.test(e[2].replace(`GENERATED BY DEFAULT AS IDENTITY`,``).split(/\bDEFAULT\b/)[0])).map(([,e])=>e)));return e.replace(generatedIndexes,(e,n,i)=>{if(t===`schema-nullability`)return e.replace(/'(?:[^']|'')*'|"(?:[^"]|"")*"|\(("(?:[^"]|"")+")\) (ASC|DESC)(?=,|\))/g,(e,t,n)=>t&&r.get(i)?.has(t)?`${e} NULLS ${n===`DESC`?`LAST`:`FIRST`}`:e);return e.replace(orderedKeys,(e,t)=>t?`${e} NULLS ${t===`DESC`?`LAST`:`FIRST`}`:e)})}function postgresIndexOrderingMigration(e,t=`sqlite`){const n=withLegacyPostgresIndexOrdering(e,t);const r=new Map([...n.matchAll(generatedIndexes)].map(([e,t])=>[t,e]));return[...e.matchAll(generatedIndexes)].filter(([e,t])=>r.get(t)!==e).map(([e,t,n])=>`DO $index_order$
BEGIN
  IF to_regclass('${n.replaceAll(`'`,`''`)}') IS NOT NULL THEN
    DROP INDEX ${t};
    ${e}
  END IF;
END $index_order$;`).join(`
`)}
//!src/state/openclaw-agent-active-event-facts-schema.ts
const AGENT_ACTIVE_EVENT_FACTS_SQL=extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,`session_transcript_active_event_facts`,{endMarker:`-- END ACTIVE EVENT FACTS`,includeEndMarker:false});function withoutAgentActiveEventFacts(e){return e.replace(`${AGENT_ACTIVE_EVENT_FACTS_SQL}-- END ACTIVE EVENT FACTS\n\n`,``)}const postgresObjects$1=/CREATE TABLE "session_transcript_active_event_facts" \([\s\S]*?\n\);|ALTER TABLE "session_transcript_active_event_facts"[^;]+;/gu;function withoutAgentPostgresActiveEventFacts(e){return e.replace(new RegExp(`(?:${postgresObjects$1.source})\\n\\n`,`gu`),``)}function agentActiveEventFactsPostgresMigration(e){const t=e.match(postgresObjects$1);if(t?.length!==2)throw new Error(`Active event facts table or foreign key is missing`);return t.join(`

`)}
//!src/state/openclaw-agent-cold-archive-chunks-schema.ts
const AGENT_COLD_ARCHIVE_CHUNKS_SQL=extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,`session_transcript_cold_archive_chunks`);function withoutAgentColdArchiveChunks(e){return e.replace(`${AGENT_COLD_ARCHIVE_CHUNKS_SQL}\n\n`,``)}function withoutAgentPostgresColdArchiveChunks(e){return e.replace(/CREATE TABLE "session_transcript_cold_archive_chunks" \([\s\S]*?\n\);\n\n/gu,``).replace(/ALTER TABLE "session_transcript_cold_archive_chunks" [^\n]+\n\n/gu,``)}function agentColdArchiveChunksPostgresMigration(e){return(e.match(/CREATE TABLE "session_transcript_cold_archive_chunks" \([\s\S]*?\n\);|ALTER TABLE "session_transcript_cold_archive_chunks" [^\n]+/gu)??[]).join(`

`)}
//!src/state/openclaw-agent-cold-navigation-schema.ts
function withoutAgentPostgresColdNavigation(e){return e.replace(` OR ("event_json" IS NULL AND "event_zstd" IS NULL AND "event_utf8_bytes" IS NOT NULL AND ("event_utf8_bytes" BETWEEN 1 AND 4194304) AND "navigation_json" IS NOT NULL)`,``)}function agentColdNavigationPostgresMigration(e){const t=e.match(/ {2}CHECK \([^\n]*"event_zstd" IS NOT NULL[^\n]+/u)?.[0];if(!t)throw new Error(`Cold navigation payload constraint is missing`);return`ALTER TABLE "transcript_events" DROP CONSTRAINT "transcript_events_check";
    ALTER TABLE "transcript_events" ADD CONSTRAINT "transcript_events_check" ${t.trim().replace(/,$/u,``)};`}
//!src/state/openclaw-agent-creation-operations-schema.ts
const SESSION_CREATION_OPERATIONS_TABLE=`session_creation_operations`;const AGENT_CREATION_OPERATIONS_SQL=extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,SESSION_CREATION_OPERATIONS_TABLE,{endMarker:`-- END SESSION CREATION OPERATIONS`,includeEndMarker:false});function withoutAgentCreationOperations(e){return e.replace(`${AGENT_CREATION_OPERATIONS_SQL}-- END SESSION CREATION OPERATIONS\n\n`,``)}const postgresObjects=/CREATE TABLE "session_creation_operations" \([\s\S]*?\n\);|CREATE INDEX "idx_agent_(?:session_creation_operations_expiry|session_input_completions_session_key|conversation_deliveries_source_session)"[^;]+;/gu;function withoutAgentPostgresCreationOperations(e){return e.replace(new RegExp(`(?:${postgresObjects.source})\\n\\n`,`gu`),``)}function agentCreationOperationsPostgresMigration(e){const t=e.match(postgresObjects);if(t?.length!==4)throw new Error(`Session creation receipt table or schema-40 index is missing`);return t.join(`

`)}
//!src/state/openclaw-agent-db-contract.ts
const SESSION_PARTICIPANTS_TABLE=`session_participants`;
//!src/state/openclaw-agent-db-maintenance-authority.ts
const agentDatabaseMaintenanceAuthority=new AsyncLocalStorage;var AgentDatabaseMaintenanceRequiredError=class extends Error{constructor(...e){super(...e);this.name=`AgentDatabaseMaintenanceRequiredError`}};function assertAgentDatabaseMaintenanceAuthority(e){const t=agentDatabaseMaintenanceAuthority.getStore()?.authority;if(!t||e&&t!==e)throw new(t?Error:AgentDatabaseMaintenanceRequiredError)(`Agent database migration requires stopped-writer maintenance; stop active agents and run openclaw doctor --fix.`);t.assertOwned();agentDatabaseMaintenanceAuthority.getStore()?.assertScopeCurrent?.()}
//!src/state/openclaw-agent-db-metadata.ts
const agentSchemaMetadataKey={name:`agent.schema-metadata`,lifetime:`process`,schemaDependent:true,read(e){if(typeof e!==`object`||e===null||!(`agentId`in e)||e.agentId!==null&&typeof e.agentId!==`string`||!(`role`in e)||e.role!==null&&typeof e.role!==`string`||!(`schemaVersion`in e)||e.schemaVersion!==null&&typeof e.schemaVersion!==`number`)return;return{agentId:e.agentId,role:e.role,schemaVersion:e.schemaVersion}}};function schemaMetadataKey(e){return{name:`agent.schema-metadata:${e}`,read:agentSchemaMetadataKey.read}}function publishAgentSchemaMetadata(e,t){publishSqliteDatabaseAdmission(e,agentSchemaMetadataKey,t);const n=getAdmittedSqliteSchemaFacts(e);if(n)publishSqliteDatabaseAdmission(e,schemaMetadataKey(n.admissionId),t)}function readExistingAgentSchemaMeta(e){const t=getAdmittedSqliteSchemaFacts(e);const n=t&&getSqliteDatabaseAdmission(e,schemaMetadataKey(t.admissionId));if(n)return n;const r=!t||getSqliteDatabaseAdmission(e,schemaAdmission)?.admissionId===t.admissionId?getSqliteDatabaseAdmission(e,agentSchemaMetadataKey):void 0;if(r){if(t)publishSqliteDatabaseAdmission(e,schemaMetadataKey(t.admissionId),r);return r}if(!tableExists(e,`schema_meta`))return null;let i;try{i=e.prepare(`SELECT role, schema_version, agent_id FROM schema_meta WHERE meta_key = 'primary'`).get()}catch(t){throw classifySqliteTableReadError(e,`schema_meta`,[`meta_key`,`role`,`schema_version`,`agent_id`],t)}if(!i)return null;const a={agentId:normalizeNullableString(i.agent_id),role:typeof i.role===`string`?i.role:null,schemaVersion:typeof i.schema_version===`number`?i.schema_version:null};const o=t&&getAdmittedSqliteSchemaFacts(e)===t;if(isPostgresSqlConnection(e)||o&&getSqliteDatabaseAdmission(e,schemaAdmission)?.admissionId===t.admissionId)publishAgentSchemaMetadata(e,a);else if(o)publishSqliteDatabaseAdmission(e,schemaMetadataKey(t.admissionId),a);return a}
//!src/state/openclaw-agent-db-schema-read.ts
function readAgentDatabaseSchemaVersion(e){if(isPostgresSqlConnection(e)){const t=getPostgresPhysicalFacts(e);if(!t)throw new Error(`Agent database has no PostgreSQL schema admission`);return t.version}return getAdmittedSqliteSchemaFacts(e)?.userVersion??readSqliteUserVersion(e)}function assertSupportedAgentSchemaVersion(e,t,n=readAgentDatabaseSchemaVersion(e)){if(n>42)throw createNewerSqliteSchemaVersionError(`OpenClaw agent database`,t,n,42,readSqliteWriterAppVersion(e));return n}function assertExistingAgentSchemaOwner(e,t,n){if(!e)return;if(e.role!==`agent`)throw new SqliteSchemaMismatchError(`OpenClaw agent database ${n} has schema role ${e.role??`unknown`}; expected agent. Run openclaw doctor --fix to inspect and repair its ownership.`);if(!e.agentId)throw new SqliteSchemaMismatchError(`OpenClaw agent database ${n} has no agent owner. Run openclaw doctor --fix to inspect and repair its ownership.`);if(normalizeAgentId(e.agentId)!==t)throw new SqliteSchemaMismatchError(`OpenClaw agent database ${n} belongs to agent ${e.agentId}; requested agent ${t}.`)}function assertCurrentAgentSchemaMetadata(e,t,n,r=42){if(!e)throw new SqliteSchemaMismatchError(`OpenClaw agent database ${n} has no schema ownership metadata. Run openclaw doctor --fix to inspect and repair its ownership.`);assertExistingAgentSchemaOwner(e,t,n);if(e.schemaVersion!==r)throw new SqliteSchemaMismatchError(`OpenClaw agent database ${n} metadata schema version ${e.schemaVersion??`invalid`} does not match ${r}; run openclaw doctor --fix before using it.`)}
//!src/state/openclaw-agent-index-retirement-migration.ts
function withLegacyAgentIndexes(e){return e.replace(`CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_label`,`CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_last_interaction_at
  ON session_nodes(last_interaction_at DESC, session_key);

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_label`).replace(`CREATE TABLE IF NOT EXISTS board_tabs (`,`CREATE INDEX IF NOT EXISTS idx_agent_session_reactions_message
  ON session_reactions(session_key, session_id, message_id);

CREATE TABLE IF NOT EXISTS board_tabs (`)}function withLegacyAgentPostgresIndexes(e){return`${e}
    ALTER FUNCTION openclaw_transcript_navigation_check(text)
      CALLED ON NULL INPUT RESET search_path;
    CREATE INDEX "idx_agent_session_nodes_last_interaction_at"
      ON "session_nodes" (("last_interaction_at") DESC NULLS LAST,
        ("session_key") ASC NULLS FIRST);
    CREATE INDEX "idx_agent_session_reactions_message"
      ON "session_reactions" (("session_key") ASC NULLS FIRST,
        ("session_id") ASC NULLS FIRST, ("message_id") ASC NULLS FIRST);
  `}const AGENT_INDEX_RETIREMENT_SQL=`
  DROP INDEX IF EXISTS idx_agent_session_nodes_last_interaction_at;
  DROP INDEX IF EXISTS idx_agent_session_reactions_message;
`;
//!src/state/openclaw-agent-memory-revision-migration.ts
const revisionTables=[`memory_index_sources`,`memory_index_chunks`];const revisionEvents=[`insert`,`update`,`delete`];const LEGACY_MEMORY_REVISION_SQLITE_TRIGGERS=revisionTables.flatMap(e=>revisionEvents.map(t=>({name:`${e}_revision_after_${t}`,table:e,sql:`CREATE TRIGGER IF NOT EXISTS ${e}_revision_after_${t}
AFTER ${t.toUpperCase()} ON ${e}
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;`})));const LEGACY_MEMORY_REVISION_TRIGGER_NAMES=LEGACY_MEMORY_REVISION_SQLITE_TRIGGERS.map(e=>e.name);function withLegacyAgentMemoryRevisionTriggers(e){const t=LEGACY_MEMORY_REVISION_SQLITE_TRIGGERS.map(e=>e.sql).join(`

`);return e.replace(`CREATE INDEX IF NOT EXISTS idx_memory_embedding_cache_updated_at`,`${t}\n\nCREATE INDEX IF NOT EXISTS idx_memory_embedding_cache_updated_at`)}function withLegacyAgentPostgresMemoryRevisionTriggers(e){return`${e}\n${revisionTables.map(e=>`CREATE FUNCTION "openclaw_${e}_trigger"() RETURNS trigger LANGUAGE plpgsql SET search_path FROM CURRENT AS $trigger$
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
  RETURN NULL;
END;
$trigger$;
${revisionEvents.map(t=>`CREATE TRIGGER "${e}_revision_after_${t}" AFTER ${t.toUpperCase()} ON "${e}" FOR EACH ROW EXECUTE FUNCTION "openclaw_${e}_trigger"();`).join(`
`)}`).join(`

`)}`}const AGENT_MEMORY_REVISION_SQL=revisionTables.flatMap(e=>revisionEvents.map(t=>`DROP TRIGGER IF EXISTS ${e}_revision_after_${t};`)).join(`
`);const AGENT_MEMORY_REVISION_POSTGRES_SQL=revisionTables.map(e=>`${revisionEvents.map(t=>`DROP TRIGGER IF EXISTS ${e}_revision_after_${t} ON ${e};`).join(`
`)}
DROP FUNCTION IF EXISTS openclaw_${e}_trigger();`).join(`
`);
//!src/state/openclaw-agent-tool-usage-schema.ts
const AGENT_TOOL_USAGE_SQL=extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,`agent_tool_usage`,{endMarker:`-- END AGENT TOOL USAGE`,includeEndMarker:false});function withoutAgentToolUsage(e){return e.replace(`${AGENT_TOOL_USAGE_SQL}-- END AGENT TOOL USAGE\n\n`,``)}const postgresTable=/CREATE TABLE "agent_tool_usage" \([\s\S]*?\n\);/u;function withoutAgentPostgresToolUsage(e){return e.replace(new RegExp(`${postgresTable.source}\\n\\n`,`u`),``)}function agentToolUsagePostgresMigration(e){const t=e.match(postgresTable)?.[0];if(!t)throw new Error(`Agent tool usage table is missing`);return t}
//!src/state/openclaw-agent-trajectory-storage-migration.ts
function withoutTrajectoryPayloadColumns(e){return e.replace(`  event_utf8_bytes INTEGER,
  event_payload BLOB,
  event_codec TEXT,
`,``).replace(`COALESCE(event_utf8_bytes, octet_length(event_json))`,`octet_length(event_json)`)}function withLegacyAgentPostgresTrajectoryStorage(e){return e.replace(`  "event_utf8_bytes" bigint,
  "event_payload" bytea,
  "event_codec" text COLLATE "C",
`,``).replaceAll(`coalesce("event_utf8_bytes", octet_length("event_json"))`,`octet_length("event_json")`)}const AGENT_TRAJECTORY_STORAGE_POSTGRES_MIGRATION_SQL=`
  ALTER TABLE "trajectory_runtime_events" ADD COLUMN "event_utf8_bytes" bigint;
  ALTER TABLE "trajectory_runtime_events" ADD COLUMN "event_payload" bytea;
  ALTER TABLE "trajectory_runtime_events" ADD COLUMN "event_codec" text COLLATE "C";
  DROP INDEX "idx_agent_trajectory_runtime_run";
  CREATE INDEX "idx_agent_trajectory_runtime_run"
    ON "trajectory_runtime_events" (("session_id") ASC NULLS FIRST,
      ("run_id") ASC NULLS FIRST, ("created_at") ASC NULLS FIRST,
      (COALESCE("event_utf8_bytes", octet_length("event_json"))) ASC NULLS FIRST);
`;
//!src/state/sqlite-table-layout-migration.ts
function migrateSqliteTableWithoutRowid(e,t){const n=getAdmittedSqliteSchemaFacts(e)??captureSqliteSchemaFacts(e);const r=n.tableSql.get(t);if(!r)return false;const i=findSqlCharacter(r,`(`);const a=findSqlClosingParenthesis(r,i);const o=r.slice(a+1).replace(/;\s*$/u,``).trim();if(/\bWITHOUT\s+ROWID\b/iu.test(o))return false;const s=quoteSqliteIdentifier(t);const c=quoteSqliteIdentifier(`${t}_without_rowid_migration`);const l=[...readTableColumns(e,t)].map(quoteSqliteIdentifier).join(`, `);e.exec(`CREATE TABLE ${c} ${r.slice(i,a+1)}
      ${o?`${o}, `:``}WITHOUT ROWID;
    INSERT INTO ${c} (${l}) SELECT ${l} FROM ${s};
    DROP TABLE ${s};
    ALTER TABLE ${c} RENAME TO ${s};`);for(const r of[...n.indexDefinitions.values(),...n.triggers.values()])if(r.table===t&&typeof r.sql===`string`)e.exec(r.sql);return true}
//!src/state/openclaw-state-db-audit-migration.ts
const AUDIT_EVENT_STATE_SCHEMA_VERSION=2;const CANONICAL_AUDIT_TABLES=[`audit_events`,`audit_identity_keys`].map(e=>({name:e,sql:normalizeSchemaSql(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL,e))}));const AUDIT_EVENT_LEGACY_COLUMNS=[`sequence`,`event_id`,`source_id`,`source_sequence`,`occurred_at`,`kind`,`action`,`status`,`error_code`,`actor_type`,`actor_id`,`agent_id`,`session_key`,`session_id`,`run_id`,`tool_call_id`,`tool_name`];const AUDIT_EVENT_MIGRATED_COLUMNS=AUDIT_EVENT_LEGACY_COLUMNS.flatMap(e=>e===`source_id`?[e,`schema_version`]:[e]);const AUDIT_EVENT_V2_COLUMNS=[...AUDIT_EVENT_MIGRATED_COLUMNS,`direction`,`channel`,`conversation_kind`,`message_outcome`,`reason_code`,`delivery_kind`,`failure_stage`,`duration_ms`,`result_count`,`account_ref`,`conversation_ref`,`message_ref`,`target_ref`];function tableHasCanonicalColumns(e,t,n,r,i){const a=e.prepare(`PRAGMA table_info(${t})`).all();const o=a.filter(e=>Number(e.pk??0)>0);return a.length===n.length&&a.every((e,t)=>e.name===n[t])&&o.length===1&&o[0]?.name===r&&i.every(e=>a.some(t=>t.name===e&&Number(t.notnull??0)===1))}function tableSql$1(e,t){const n=e.prepare(`SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?`).get(t);return typeof n?.sql===`string`?n.sql:void 0}function tableHasUniqueColumns(e,t,n){const r=e.prepare(`PRAGMA index_list(${t})`).all();return n.every(t=>r.some(n=>{if(Number(n.unique??0)!==1||typeof n.name!==`string`)return false;const r=n.name.replaceAll(`'`,`''`);const i=e.prepare(`PRAGMA index_info('${r}')`).all();return i.length===1&&i[0]?.name===t}))}function hasCanonicalAuditEventTable(e,t,n){const r=tableSql$1(e,`audit_events`)?.toLowerCase();return tableHasCanonicalColumns(e,`audit_events`,t,`sequence`,n)&&typeof r===`string`&&/\bsequence\s+integer\s+primary\s+key\s+autoincrement\b/.test(r)&&tableHasUniqueColumns(e,`audit_events`,[`event_id`,`source_id`])}function hasCanonicalAuditIdentityKeyTable(e){if(!tableExists(e,`audit_identity_keys`))return false;const t=tableSql$1(e,`audit_identity_keys`)?.toLowerCase();return tableHasCanonicalColumns(e,`audit_identity_keys`,[`id`,`key_id`,`key`,`created_at`],`id`,[`id`,`key_id`,`key`,`created_at`])&&typeof t===`string`&&/\bcheck\s*\(\s*id\s*=\s*1\s*\)/.test(t)}function hasCanonicalAuditEventsSchema(e){const t=getAdmittedSqliteSchemaFacts(e);if(t&&CANONICAL_AUDIT_TABLES.every(({name:e,sql:n})=>normalizeSchemaSql(t.tableSql.get(e)??null)===n))return true;if(!tableExists(e,`audit_events`))return readSqliteUserVersion(e)<AUDIT_EVENT_STATE_SCHEMA_VERSION&&!tableExists(e,`audit_identity_keys`);return hasCanonicalAuditEventTable(e,AUDIT_EVENT_V2_COLUMNS,[`event_id`,`source_id`,`schema_version`,`source_sequence`,`occurred_at`,`kind`,`action`,`status`,`actor_type`,`actor_id`])&&hasCanonicalAuditIdentityKeyTable(e)}function canRepairLegacyAuditEventsSchema(e){if(!tableExists(e,`audit_events`)||tableExists(e,`audit_events_migration_new`)||tableHasColumn(e,`audit_events`,`schema_version`))return false;return(!tableExists(e,`audit_identity_keys`)||hasCanonicalAuditIdentityKeyTable(e))&&hasCanonicalAuditEventTable(e,AUDIT_EVENT_LEGACY_COLUMNS,[`event_id`,`source_id`,`source_sequence`,`occurred_at`,`kind`,`action`,`status`,`actor_type`,`actor_id`,`agent_id`,`run_id`])}
//!src/state/openclaw-state-db-operator-approval-migration.ts
function tableSql(e){const t=getAdmittedSqliteSchemaFacts(e);if(t)return t.tableSql.get(`operator_approvals`)??void 0;const n=e.prepare(`SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'operator_approvals'`).get();return typeof n?.sql===`string`?n.sql:void 0}function hasCanonicalOperatorApprovalKinds(e){if(!tableExists(e,`operator_approvals`))return true;return/kind\s+text\s+not\s+null\s+check\s*\(\s*kind\s+in\s*\(\s*'exec'\s*,\s*'plugin'\s*,\s*'system-agent'\s*\)\s*\)/.test(tableSql(e)?.toLowerCase()??``)}function assertCanonicalOperatorApprovalKinds(e,t){if(!hasCanonicalOperatorApprovalKinds(e))throw new SqliteSchemaMismatchError(`OpenClaw state database ${t} has a legacy operator approval schema; run openclaw doctor --fix to migrate it.`)}function isCanonicalOperatorApprovalKind(e){return e===`exec`||e===`plugin`||e===`system-agent`}function detectOperatorApprovalSchemaMigration(e,t){return hasCanonicalOperatorApprovalKinds(e)?[]:[{kind:`operator-approvals-system-agent`,path:t}]}
//!src/state/openclaw-state-db-schema-v12-foldin.ts
const FOLDED_SINGLETON_STATE_TABLES_V12=[`skill_curator_state`,`update_check_state`,`clawhub_promotions_feed_state`,`model_catalog_remote`,`voicewake_triggers`,`voicewake_routing_routes`,`voicewake_routing_config`,`onboarding_recommendations`,`cron_store_epochs`,`tui_last_sessions`,`sidebar_sections`,`node_host_config`,`web_push_vapid_keys`];function createStateConfigMachineTable(e){e.exec(`
    CREATE TABLE IF NOT EXISTS config_machine_state (
      state_key TEXT NOT NULL PRIMARY KEY,
      value_json TEXT NOT NULL,
      updated_at_ms INTEGER NOT NULL
    ) STRICT;
  `)}function migrateSingletonStateFoldInV12(e,t){if(t>=12)return false;createStateConfigMachineTable(e);const n=e.prepare(`INSERT INTO config_machine_state (state_key, value_json, updated_at_ms) VALUES (?, ?, ?) ON CONFLICT(state_key) DO NOTHING`);if(tableExists(e,`update_check_state`)){const t=e.prepare(`SELECT * FROM update_check_state WHERE state_key = 'default'`).get();if(t)n.run(`update.checkState`,JSON.stringify({lastCheckedAt:t.last_checked_at??void 0,lastNotifiedVersion:t.last_notified_version??void 0,lastNotifiedTag:t.last_notified_tag??void 0,lastAvailableVersion:t.last_available_version??void 0,lastAvailableTag:t.last_available_tag??void 0,autoInstallId:t.auto_install_id??void 0,autoFirstSeenVersion:t.auto_first_seen_version??void 0,autoFirstSeenTag:t.auto_first_seen_tag??void 0,autoFirstSeenAt:t.auto_first_seen_at??void 0,autoLastAttemptVersion:t.auto_last_attempt_version??void 0,autoLastAttemptAt:t.auto_last_attempt_at??void 0,autoLastSuccessVersion:t.auto_last_success_version??void 0,autoLastSuccessAt:t.auto_last_success_at??void 0}),Number(t.updated_at_ms))}if(tableExists(e,`voicewake_triggers`)){const t=e.prepare(`SELECT trigger, updated_at_ms FROM voicewake_triggers WHERE config_key = 'default' ORDER BY position`).all();if(t.length>0)n.run(`voicewake.triggers`,JSON.stringify(t.map(e=>e.trigger)),Math.max(...t.map(e=>Number(e.updated_at_ms))))}if(tableExists(e,`voicewake_routing_config`)){const t=e.prepare(`SELECT * FROM voicewake_routing_config WHERE config_key = 'default'`).get();if(t){const r=tableExists(e,`voicewake_routing_routes`)?e.prepare(`SELECT trigger, target_mode, target_agent_id, target_session_key FROM voicewake_routing_routes WHERE config_key = 'default' ORDER BY position`).all():[];const targetFromColumns=(e,t,n)=>e===`agent`&&typeof t===`string`&&t?{agentId:t}:e===`session`&&typeof n===`string`&&n?{sessionKey:n}:{mode:`current`};n.run(`voicewake.routing`,JSON.stringify({version:1,defaultTarget:targetFromColumns(t.default_target_mode,t.default_target_agent_id,t.default_target_session_key),routes:r.map(e=>({trigger:e.trigger,target:targetFromColumns(e.target_mode,e.target_agent_id,e.target_session_key)})),updatedAtMs:t.updated_at_ms}),Number(t.updated_at_ms))}}if(tableExists(e,`onboarding_recommendations`)){const t=e.prepare(`SELECT * FROM onboarding_recommendations`).all();for(const e of t)n.run(`onboarding.recommendations.${String(e.config_key)}`,JSON.stringify({inventoryHash:e.inventory_hash,matches:JSON.parse(String(e.matches_json)),offeredAt:e.offered_at_ms,acceptedAt:e.accepted_at_ms,updatedAt:e.updated_at_ms}),Number(e.updated_at_ms))}if(tableExists(e,`sidebar_sections`)){const t=e.prepare(`SELECT section_id FROM sidebar_sections ORDER BY position, section_id`).all();if(t.length>0)n.run(`sidebar.sectionOrder`,JSON.stringify(t.map(e=>e.section_id)),Date.now())}if(tableExists(e,`node_host_config`)){const t=e.prepare(`SELECT * FROM node_host_config WHERE config_key = 'current'`).get();if(t){const e={host:t.gateway_host??void 0,port:t.gateway_port??void 0,tls:t.gateway_tls==null?void 0:t.gateway_tls===1,tlsFingerprint:t.gateway_tls_fingerprint??void 0,contextPath:t.gateway_context_path??void 0,cloudflareAccess:t.gateway_cloudflare_access_json==null?void 0:JSON.parse(String(t.gateway_cloudflare_access_json))};n.run(`nodeHost.config`,JSON.stringify({version:t.version,nodeId:t.node_id,...t.display_name==null?{}:{displayName:t.display_name},gateway:Object.values(e).some(e=>e!==void 0)?e:void 0,installedAppsSharing:t.installed_apps_sharing===1}),Number(t.updated_at_ms))}}if(tableExists(e,`web_push_vapid_keys`)){const t=e.prepare(`SELECT * FROM web_push_vapid_keys WHERE key_id = 'default'`).get();if(t)n.run(`webPush.vapidKeys`,JSON.stringify({publicKey:t.public_key,privateKey:t.private_key,subject:t.subject}),Number(t.updated_at_ms))}let r=false;for(const t of FOLDED_SINGLETON_STATE_TABLES_V12)if(tableExists(e,t)){e.exec(`DROP TABLE IF EXISTS ${t};`);r=true}return r}
//!src/state/openclaw-state-db-schema-v22-columns.ts
const STATE_CURSOR_TABLES_V22=[`operator_approvals`,`cron_run_receipts`,`execution_decision_facts`,`skill_workshop_changes`];function migratePortableIdentityColumnsV22(e,t){if(t>=22)return false;let n=false;const r=getAdmittedSqliteSchemaFacts(e)??captureSqliteSchemaFacts(e);for(const t of STATE_CURSOR_TABLES_V22){if(!tableExists(e,t)||tableHasColumn(e,t,`cursor_id`))continue;const i=r.tableSql.get(t);if(typeof i!==`string`)throw new Error(`Missing v22 cursor migration schema: ${t}`);const a=quoteSqliteIdentifier(`${t}_migration_v22`);const o=quoteSqliteIdentifier(t);const s=[...readTableColumns(e,t)].map(quoteSqliteIdentifier).join(`, `);e.exec(`CREATE TABLE ${a} (cursor_id INTEGER NOT NULL, ${i.slice(i.indexOf(`(`)+1)};
      INSERT INTO ${a} (rowid, ${s}, cursor_id) SELECT rowid, ${s}, rowid FROM ${o} ORDER BY rowid;
      DROP TABLE ${o};
      ALTER TABLE ${a} RENAME TO ${o};`);for(const n of[...r.indexDefinitions.values(),...r.triggers.values()])if(n.table===t&&typeof n.sql===`string`)e.exec(n.sql);n=true}if(tableExists(e,`acp_sessions`)){n=ensureColumn(e,`acp_sessions`,`resume_agent_session_id TEXT`)||n;n=ensureColumn(e,`acp_sessions`,`resume_acpx_session_id TEXT`)||n;const t=`CASE WHEN json_valid(identity_json) THEN identity_json END`;const r=`char(9,10,11,12,13,32,160,5760,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,65279)`;e.exec(`UPDATE acp_sessions SET
      resume_agent_session_id = CASE WHEN json_type(${t}, '$.agentSessionId') = 'text'
        THEN trim(json_extract(${t}, '$.agentSessionId'), ${r}) END,
      resume_acpx_session_id = CASE WHEN json_type(${t}, '$.acpxSessionId') = 'text'
        THEN trim(json_extract(${t}, '$.acpxSessionId'), ${r}) END;
      DROP INDEX IF EXISTS idx_acp_sessions_resume_agent;
      DROP INDEX IF EXISTS idx_acp_sessions_resume_acpx;`)}return n}
//!src/state/openclaw-state-db-schema-v28-publication.ts
const publicationDraftTables=[`github_publication_requests`,`github_personal_publication_requests`,`github_repository_publication_requests`];function needsPublicationDraftMigration(e){return publicationDraftTables.some(t=>tableExists(e,t)&&!tableHasColumn(e,t,`draft`))}const statePublicationDraftMigration={version:28,tables:publicationDraftTables,columns:publicationDraftTables.map(e=>`${e}.draft`),migrate:e=>{let t=false;for(const n of publicationDraftTables)t=ensureColumn(e,n,`draft INTEGER`)||t;return t},applied:`Retained the requested GitHub PR draft choice (v28)`};function withLegacyPublicationDraft(e){return e.replace(/(CREATE TABLE(?: IF NOT EXISTS)? "?github_(?:personal_|repository_)?publication_requests"? \([\s\S]*?)\n {2}(?:"draft" bigint|draft INTEGER),/gu,`$1`)}
//!src/state/openclaw-state-db-additive-columns.ts
const lazyColumns=[[`workspace_setup_state`,`bootstrap_deferred`,`INTEGER`,true],[`agent_deletion_journal`,`phase`,`TEXT`,true],[`agent_database_leases`,`provenance`,`TEXT`,true],[`user_profile_identities`,`canonical_login`,`TEXT`],[`user_profile_identities`,`authorization_id`,`TEXT`],[`user_profile_identities`,`authorization_basis_json`,`TEXT`],[`user_profile_identities`,`verified_email_json`,`TEXT`,true],[`template_installs`,`bootstrap_content_digest`,`TEXT`],[`template_installs`,`bootstrap_source_path`,`TEXT`],[`worker_environments`,`desktop_json`,`TEXT`],[`worker_environments`,`bootstrap_install_kind`,`TEXT`],[`worker_environments`,`preparation_purpose`,`TEXT`],[`template_package_refs`,`extension_adapter_identity`,`TEXT`],[`template_package_refs`,`extension_detected_format`,`TEXT`],[`template_package_refs`,`extension_format`,`TEXT`],[`template_package_refs`,`extension_id`,`TEXT`],[`template_package_refs`,`extension_mapped_json`,`TEXT`],[`template_package_refs`,`extension_unavailable_json`,`TEXT`],[`worker_environments`,`shared_host`,`INTEGER`],[`worker_environments`,`node_setup_id`,`TEXT`],[`worker_environments`,`node_device_id`,`TEXT`],[`worker_session_placements`,`terminal_reason`,`TEXT`],[`worker_session_placements`,`terminal_at_ms`,`INTEGER`],[`worker_workspace_pending_results`,`repository_workspace_id`,`TEXT`,true],[`worker_session_placement_moves`,`abandon_source`,`INTEGER`,true],[`worker_session_placement_moves`,`target_machine_class`,`TEXT`,true],[`worker_session_placement_moves`,`target_os`,`TEXT`,true],[`worktrees`,`run_end_cleanup_json`,`TEXT`],[`worktrees`,`gc_protection_json`,`TEXT`],[`device_bootstrap_tokens`,`setup_id`,`TEXT`,true],[`session_groups`,`cwd`,`TEXT`,true],[`session_groups`,`worktree`,`INTEGER`,true],[`secret_store_entries`,`allowed_hosts`,`TEXT`],[`web_push_subscriptions`,`device_id`,`TEXT`,true],[`web_push_subscriptions`,`user_profile_id`,`TEXT`,true],[`web_push_subscriptions`,`preferences_json`,`TEXT`,true],[`task_runs`,`execution_owner_host`,`TEXT`,true],[`task_runs`,`execution_owner_pid`,`INTEGER`,true],[`task_runs`,`execution_owner_start_identity`,`INTEGER`,true],[`session_watch_cursors`,`watcher_store_path`,`TEXT`,true],[`subagent_runs`,`requester_store_path`,`TEXT`,true],[`subagent_runs`,`controller_store_path`,`TEXT`,true],[`cron_jobs`,`grant_definition_revision`,`TEXT`],[`cron_jobs`,`grant_definition_generation`,`INTEGER`],[`cron_jobs`,`grant_definition_updated_at`,`INTEGER`]];function lazyColumnDefinitions(e){return lazyColumns.filter(t=>e===void 0||Boolean(t[3])===e).map(([e,t,n])=>({columnName:t,dataType:n,tableName:e}))}const CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS=lazyColumnDefinitions();const CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS=lazyColumnDefinitions(false);const CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS=lazyColumnDefinitions(true);const ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS={packageUpdatedAt:[[`template_package_refs`,`updated_at_ms INTEGER NOT NULL DEFAULT 0`]],packageIntegrity:[[`template_package_refs`,`package_integrity TEXT NOT NULL DEFAULT 'sha256:0000000000000000000000000000000000000000000000000000000000000000'`]],diagnosticSequence:[[`diagnostic_events`,`sequence INTEGER NOT NULL DEFAULT 0`]],cronRunLogs:[[`worktrees`,`provisioned_paths_json TEXT`],[`apns_registrations`,`relay_origin TEXT`],[`device_pairing_pending`,`refreshed_at_ms INTEGER`],[`device_pairing_pending`,`browser_origin TEXT`],[`device_pairing_paired`,`approved_via TEXT`],[`device_pairing_paired`,`browser_origin TEXT`],[`device_pairing_paired`,`operator_label TEXT`],[`device_pairing_paired`,`node_surface_json TEXT`],[`device_pairing_paired`,`pending_node_surface_json TEXT`],[`cron_run_logs`,`status TEXT`],[`cron_run_logs`,`error TEXT`],[`cron_run_logs`,`summary TEXT`],[`cron_run_logs`,`diagnostics_summary TEXT`],[`cron_run_logs`,`delivery_status TEXT`],[`cron_run_logs`,`delivery_error TEXT`],[`cron_run_logs`,`delivered INTEGER`],[`cron_run_logs`,`session_id TEXT`],[`cron_run_logs`,`session_key TEXT`],[`cron_run_logs`,`run_id TEXT`],[`cron_run_logs`,`run_at_ms INTEGER`],[`cron_run_logs`,`duration_ms INTEGER`],[`cron_run_logs`,`next_run_at_ms INTEGER`],[`cron_run_logs`,`model TEXT`],[`cron_run_logs`,`provider TEXT`],[`cron_run_logs`,`total_tokens INTEGER`],[`cron_run_logs`,`entry_json TEXT NOT NULL DEFAULT '{}'`],[`cron_run_logs`,`created_at INTEGER NOT NULL DEFAULT 0`]],acpReplay:[[`acp_replay_events`,`estimated_bytes INTEGER NOT NULL DEFAULT 0`],[`acp_replay_sessions`,`estimated_bytes INTEGER NOT NULL DEFAULT 0`]],cronJobs:[[`cron_jobs`,`description TEXT`],[`cron_jobs`,`declaration_key TEXT`],[`cron_jobs`,`owner_agent_id TEXT`],[`cron_jobs`,`name TEXT NOT NULL DEFAULT ''`],[`cron_jobs`,`enabled INTEGER NOT NULL DEFAULT 1`],[`cron_jobs`,`agent_id TEXT`],[`cron_jobs`,`payload_kind TEXT NOT NULL DEFAULT 'message'`],[`cron_jobs`,`state_json TEXT NOT NULL DEFAULT '{}'`],[`cron_jobs`,`runtime_updated_at_ms INTEGER`],[`cron_jobs`,`schedule_identity TEXT`],[`cron_jobs`,`sort_order INTEGER NOT NULL DEFAULT 0`]],deliveryQueue:[[`sandbox_registry_entries`,`session_key TEXT`],[`sandbox_registry_entries`,`backend_id TEXT`],[`sandbox_registry_entries`,`runtime_label TEXT`],[`sandbox_registry_entries`,`image TEXT`],[`sandbox_registry_entries`,`created_at_ms INTEGER`],[`sandbox_registry_entries`,`last_used_at_ms INTEGER`],[`sandbox_registry_entries`,`config_label_kind TEXT`],[`sandbox_registry_entries`,`config_hash TEXT`],[`sandbox_registry_entries`,`cdp_port INTEGER`],[`sandbox_registry_entries`,`no_vnc_port INTEGER`],[`delivery_queue_entries`,`entry_kind TEXT`],[`delivery_queue_entries`,`session_key TEXT`],[`delivery_queue_entries`,`channel TEXT`],[`delivery_queue_entries`,`target TEXT`],[`delivery_queue_entries`,`account_id TEXT`],[`delivery_queue_entries`,`retry_count INTEGER NOT NULL DEFAULT 0`],[`delivery_queue_entries`,`last_attempt_at INTEGER`],[`delivery_queue_entries`,`last_error TEXT`],[`delivery_queue_entries`,`recovery_state TEXT`],[`delivery_queue_entries`,`platform_send_started_at INTEGER`]],originalMediaRoot:[[`managed_outgoing_image_records`,`original_media_root TEXT NOT NULL DEFAULT ''`]],beforeTaskAttribution:[[`managed_outgoing_image_records`,`agent_id TEXT`],[`managed_outgoing_image_records`,`cleanup_pending INTEGER NOT NULL DEFAULT 0 CHECK (cleanup_pending IN (0, 1))`],[`current_conversation_bindings`,`conversation_kind TEXT NOT NULL DEFAULT 'channel'`],[`device_bootstrap_tokens`,`pending_profile_json TEXT`],[`gateway_restart_handoff`,`restart_trace_started_at INTEGER`],[`gateway_restart_handoff`,`restart_trace_last_at INTEGER`],[`gateway_restart_intent`,`reason TEXT`],[`gateway_restart_sentinel`,`delivery_channel TEXT`],[`gateway_restart_sentinel`,`delivery_to TEXT`],[`gateway_restart_sentinel`,`delivery_account_id TEXT`],[`gateway_restart_sentinel`,`message TEXT`],[`gateway_restart_sentinel`,`continuation_json TEXT`],[`gateway_restart_sentinel`,`doctor_hint TEXT`],[`gateway_restart_sentinel`,`stats_json TEXT`],[`gateway_boot_lifecycle`,`startup_reason TEXT`],[`official_external_plugin_catalog_snapshots`,`trust_mode TEXT`],[`official_external_plugin_catalog_snapshots`,`trust_key_id TEXT`],[`official_external_plugin_catalog_snapshots`,`trust_signature_count INTEGER`],[`official_external_plugin_catalog_snapshots`,`trust_threshold INTEGER`],[`official_external_plugin_catalog_snapshots`,`trust_verified_at TEXT`]],taskRequester:[[`task_runs`,`requester_agent_id TEXT`]],taskRunDetails:[[`task_runs`,`tool_use_count INTEGER`],[`task_runs`,`last_tool_name TEXT`],[`task_runs`,`detail_json TEXT`]],workerEnvironments:[[`worker_environments`,`bootstrap_bundle_hash TEXT`],[`worker_environments`,`bootstrap_openclaw_version TEXT`],[`worker_environments`,`bootstrap_protocol_features_json TEXT`],[`worker_environments`,`bootstrap_install_kind TEXT`],[`worker_environments`,`owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0)`],[`worker_environments`,`ssh_host_key TEXT`],[`worker_workspace_pending_results`,`staged_result_ref TEXT`],[`worker_environments`,`teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed'))`]]};
//!src/state/openclaw-state-db-schema-v36-template-names.ts
const TEMPLATE_STATE_TABLE_RENAMES=[[`claw_installs`,`template_installs`],[`claw_workspace_files`,`template_workspace_files`],[`claw_package_refs`,`template_package_refs`],[`claw_cron_refs`,`template_cron_refs`],[`claw_mcp_server_refs`,`template_mcp_server_refs`]];const columns=[[`template_installs`,`claw_name`,`template_name`],[`template_installs`,`claw_version`,`template_version`],[`template_package_refs`,`claw_name`,`template_name`]];const targetTables=new Set(TEMPLATE_STATE_TABLE_RENAMES.map(([,e])=>e));const additiveColumns=CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS.filter(({tableName:e})=>targetTables.has(e));const orderedColumns=[...ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.packageUpdatedAt,...ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.packageIntegrity];const TEMPLATE_RECORD_VERSIONS=[[`template_installs`,[1,2,3].map(e=>[`openclaw.clawInstallRecord.v${e}`,`openclaw.templateInstallRecord.v${e}`])],[`template_workspace_files`,[[`openclaw.clawWorkspaceFileRecord.v1`,`openclaw.templateWorkspaceFileRecord.v1`]]],[`template_package_refs`,[[`openclaw.clawPackageRef.v1`,`openclaw.templatePackageRef.v1`]]],[`template_cron_refs`,[[`openclaw.clawCronRef.v1`,`openclaw.templateCronRef.v1`]]],[`template_mcp_server_refs`,[[`openclaw.clawMcpServerRef.v1`,`openclaw.templateMcpServerRef.v1`]]]];const literal=e=>`'${e.replaceAll(`'`,`''`)}'`;function legacyTemplateStateIdentifier(e){for(const[t,n]of[...TEMPLATE_STATE_TABLE_RENAMES,...columns.map(([,e,t])=>[e,t])])if(e===n)return t;return e}function withLegacyTemplateStateSchema(e){return e.replace(/\btemplate_(?:installs|workspace_files|package_refs|cron_refs|mcp_server_refs|name|version)\b/gu,legacyTemplateStateIdentifier).replaceAll(`'template-introduced'`,`'claw-introduced'`).replaceAll(`'template'`,`'claw'`)}function withLegacyTemplateStateCompatibility(e){return{...e,excludedTables:e.excludedTables?.map(withLegacyTemplateStateSchema),allowedMissingTables:e.allowedMissingTables?.map(withLegacyTemplateStateSchema),allowedMissingColumns:e.allowedMissingColumns?.map(withLegacyTemplateStateSchema),allowedColumnDefinitions:e.allowedColumnDefinitions&&Object.fromEntries(Object.entries(e.allowedColumnDefinitions).map(([e,t])=>[withLegacyTemplateStateSchema(e),t.map(withLegacyTemplateStateSchema)]))}}function versionUpdates(e,t){return`UPDATE ${quoteSqliteIdentifier(e)} SET schema_version = CASE schema_version
    ${t.map(([e,t])=>`WHEN ${literal(e)} THEN ${literal(t)}`).join(`
`)}
    ELSE schema_version END WHERE schema_version IN (${t.map(([e])=>literal(e)).join(`, `)});`}function migrateTemplateStateNames(e,t){if(t>=36)return false;const n=captureSqliteSchemaFacts(e);const r=new Set(n.tables);const i=/* @__PURE__ */ new Set([...TEMPLATE_STATE_TABLE_RENAMES.flat(),`agent_provenance`]);const a=new Map([...n.tableSql].flatMap(([e,t])=>t&&i.has(e)?[[e,new Set(parseSqliteTableDefinition(t,e).columns.keys())]]:[]));const addColumn=(t,n)=>{const r=n.trim().split(/\s+/,1)[0];const i=a.get(t);if(!r||!i||i.has(r))return false;e.exec(`ALTER TABLE ${quoteSqliteIdentifier(t)} ADD COLUMN ${n};`);i.add(r);return true};let o=false;for(const[t,n]of TEMPLATE_STATE_TABLE_RENAMES)if(r.has(t)){if(r.has(n))throw new Error(`Both ${t} and ${n} exist; preserve the store for Doctor inspection.`);e.exec(`ALTER TABLE ${quoteSqliteIdentifier(t)} RENAME TO ${quoteSqliteIdentifier(n)};`);r.delete(t);r.add(n);const i=a.get(t);if(!i)throw new Error(`Missing predecessor column contract for ${t}`);a.set(n,i);a.delete(t);o=true}for(const[t,n,r]of columns)if(a.get(t)?.has(n)){e.exec(`ALTER TABLE ${quoteSqliteIdentifier(t)} RENAME COLUMN ${quoteSqliteIdentifier(n)} TO ${quoteSqliteIdentifier(r)};`);a.get(t)?.delete(n);a.get(t)?.add(r);o=true}for(const{tableName:e,columnName:t,dataType:n}of additiveColumns)addColumn(e,`${t} ${n}`);const s=getNodeSqliteKysely(e);if(addColumn(...ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.packageUpdatedAt[0]))executeSqliteQuerySync(e,s.updateTable(`template_package_refs`).set(e=>({updated_at_ms:e.ref(`installed_at_ms`)})));for(const[e,t]of ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.packageIntegrity)addColumn(e,t);const c=captureSqliteSchemaFacts(e);const l={template_package_refs:[`origin`,`claw-introduced`,`template-introduced`],template_mcp_server_refs:[`origin`,`claw-introduced`,`template-introduced`],agent_provenance:[`created_via`,`claw`,`template`]};for(const t of[`template_installs`,...Object.keys(l)]){const n=c.tableSql.get(t);if(!n)continue;const r=n.slice(n.indexOf(`(`));let i=r;for(const[e,,n]of columns)if(e===t)i=i.replaceAll(quoteSqliteIdentifier(n),n);const a=l[t];if(a)i=i.replaceAll(literal(a[1]),literal(a[2]));if(i===r)continue;const s=quoteSqliteIdentifier(`${t}_migration_v36`);const u=[...parseSqliteTableDefinition(n,t).columns.keys()];const d=/\bWITHOUT\s+ROWID\b/iu.test(n)?[]:[`rowid`];const f=[...d,...u].map(quoteSqliteIdentifier).join(`, `);const p=[...d.map(quoteSqliteIdentifier),...u.map(e=>a&&e===a[0]?`CASE ${quoteSqliteIdentifier(e)} WHEN ${literal(a[1])} THEN ${literal(a[2])} ELSE ${quoteSqliteIdentifier(e)} END`:quoteSqliteIdentifier(e))].join(`, `);e.exec(`CREATE TABLE ${s} ${i};
      INSERT INTO ${s} (${f}) SELECT ${p} FROM ${quoteSqliteIdentifier(t)};
      DROP TABLE ${quoteSqliteIdentifier(t)};
      ALTER TABLE ${s} RENAME TO ${quoteSqliteIdentifier(t)};`);for(const n of[...c.indexDefinitions.values(),...c.triggers.values()])if(n.table===t&&typeof n.sql===`string`)e.exec(n.sql);o=true}for(const[t,n]of TEMPLATE_RECORD_VERSIONS)if(r.has(t))for(const[r,i]of n)executeSqliteQuerySync(e,s.updateTable(t).set({schema_version:i}).where(`schema_version`,`=`,r));return o}const stateTemplateNamesMigration={version:36,tables:[...TEMPLATE_STATE_TABLE_RENAMES.flat(),`agent_provenance`,`sqlite_stat1`,`sqlite_stat4`],columns:[...additiveColumns.map(({tableName:e,columnName:t})=>`${e}.${t}`),...orderedColumns.map(([e,t])=>`${e}.${t.split(` `,1)[0]}`)],migrate:migrateTemplateStateNames,applied:`Migrated released starter tables and provenance to canonical Template names (v36)`};const TEMPLATE_STATE_POSTGRES_MIGRATION_SQL=`DO $template_names_v36$
DECLARE item record; column_item record; constraint_name text; next_constraint_name text;
BEGIN
  FOR item IN SELECT * FROM (VALUES
    ${TEMPLATE_STATE_TABLE_RENAMES.map(([e,t])=>`(${literal(e)}, ${literal(t)})`).join(`,
`)}
  ) AS names(old_name, new_name) LOOP
    EXECUTE format('ALTER TABLE %I RENAME TO %I', item.old_name, item.new_name);
    FOR column_item IN SELECT * FROM (VALUES
      ${columns.map(([e,t,n])=>`(${literal(e)}, ${literal(t)}, ${literal(n)})`).join(`,
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
    ALTER TABLE ${quoteSqliteIdentifier(e)} DROP CONSTRAINT ${quoteSqliteIdentifier(`${e}_origin_check`)};
    UPDATE ${quoteSqliteIdentifier(e)} SET origin = 'template-introduced' WHERE origin = 'claw-introduced';
    ALTER TABLE ${quoteSqliteIdentifier(e)} ADD CONSTRAINT ${quoteSqliteIdentifier(`${e}_origin_check`)}
      CHECK (origin IN ('template-introduced', 'pre-existing'));`).join(`
`)}
  IF to_regclass('agent_provenance') IS NOT NULL THEN
    ALTER TABLE agent_provenance DROP CONSTRAINT agent_provenance_created_via_check;
    UPDATE agent_provenance SET created_via = 'template' WHERE created_via = 'claw';
    ALTER TABLE agent_provenance ADD CONSTRAINT agent_provenance_created_via_check
      CHECK (created_via IN ('operator', 'agent', 'template'));
  END IF;
  ${TEMPLATE_RECORD_VERSIONS.map(([e,t])=>versionUpdates(e,t)).join(`
`)}
END $template_names_v36$;`;
//!src/state/openclaw-state-db-schema-version.ts
const CONTENT_VERSION_KEY=`state.schema.contentVersion`;var PostgresSchemaAdmissionUnavailableError=class extends Error{};const contentVersionQuery=createSqliteQueryCache(e=>prepareSqliteQuerySync(e,()=>getNodeSqliteKysely(e).selectFrom(`config_machine_state`).select(`value_json`).where(`state_key`,`=`,CONTENT_VERSION_KEY)));function readStateSchemaContentVersion(e,t,n=readStateSchemaContentVersionRow,r){if(isPostgresSqlConnection(e)){const n=getStateSchemaVersionAdmission(e);if(!n)throw new PostgresSchemaAdmissionUnavailableError(`Missing PostgreSQL state schema admission; use the matching OpenClaw version or restore the matching PostgreSQL schema and anchor.`);return Math.max(t??n.userVersion,n.contentVersion)}const i=getStateSchemaVersionAdmission(e);if(i)return Math.max(t??i.userVersion,i.contentVersion);const a=r??getAdmittedSqliteSchemaFacts(e)?.userVersion??readSqliteUserVersion(e);const o=parseStateSchemaContentVersion(tableExists(e,`config_machine_state`)?n(e)?.value_json:void 0);rememberStateSchemaVersionAdmission(e,{userVersion:a,contentVersion:o});return Math.max(t??a,o)}function readStateSchemaContentVersionRow(e){return contentVersionQuery(e)().rows[0]}function parseStateSchemaContentVersion(e){if(e===void 0)return 0;let t;try{t=e===null?null:JSON.parse(e)}catch(e){throw new SqliteSchemaMismatchError(`Invalid shared state schema content version in ${CONTENT_VERSION_KEY}.`,{cause:e})}if(typeof t!==`number`||!Number.isSafeInteger(t)||t<0)throw new SqliteSchemaMismatchError(`Invalid shared state schema content version in ${CONTENT_VERSION_KEY}.`);return t}function admitStateSchemaFacts(e,t,n=`runtime`){if(isPostgresSqlConnection(e)){if(!getPostgresPhysicalFacts(e))throw new PostgresSchemaAdmissionUnavailableError(`Missing PostgreSQL physical schema admission`);return}try{admitSqliteSchema(e,r=>assertSupportedStateSchemaVersion(e,t,{userVersion:r,contentVersion:r},void 0,n))}catch(r){let i;try{i=readSqliteUserVersion(e)}catch{throw normalizeOpenClawStateSchemaReadError(r,t)}if(i>40)throw createNewerSqliteSchemaVersionError(`OpenClaw state database`,t,i,40,readSqliteWriterAppVersion(e),n);throw normalizeOpenClawStateSchemaReadError(r,t)}}function assertSupportedStateSchemaVersion(e,t,n,r,i=`runtime`){if(isPostgresSqlConnection(e))return readStateSchemaContentVersion(e);try{const a=n?.userVersion??getStateSchemaVersionAdmission(e)?.userVersion??getAdmittedSqliteSchemaFacts(e)?.userVersion??readSqliteUserVersion(e);const o=n?.contentVersion??(a>40?a:readStateSchemaContentVersion(e,a,r,a));if(o>40)throw createNewerSqliteSchemaVersionError(`OpenClaw state database`,t,o,40,readSqliteWriterAppVersion(e),i);return a}catch(e){throw normalizeOpenClawStateSchemaReadError(e,t)}}
//!src/state/session-watch-cursor-provenance.ts
const SESSION_WATCH_PROVENANCE_EXPLICIT=`explicit`;const SESSION_WATCH_PROVENANCE_AMBIENT_GROUP=`ambient-group`;
//!src/state/openclaw-state-db-session-watch-migration.ts
const SESSION_WATCH_PROVENANCE_SCHEMA_VERSION=4;const LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX=`ambient-group-watch:`;const LEGACY_AMBIENT_GROUP_WATCH_MARKER_END=`ambient-group-watch;`;const SESSION_WATCH_PROVENANCE_COLUMN_SQL=`provenance TEXT NOT NULL DEFAULT '${SESSION_WATCH_PROVENANCE_EXPLICIT}' CHECK (provenance IN ('${SESSION_WATCH_PROVENANCE_EXPLICIT}', '${SESSION_WATCH_PROVENANCE_AMBIENT_GROUP}'))`;function getSessionWatchCursorKysely(e){return getNodeSqliteKysely(e)}function hasLegacyAmbientWatchSentinels(e){return executeSqliteQueryTakeFirstSync(e,getSessionWatchCursorKysely(e).selectFrom(`session_watch_cursors`).select(`watcher_session_key`).where(`watcher_session_key`,`>=`,LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX).where(`watcher_session_key`,`<`,LEGACY_AMBIENT_GROUP_WATCH_MARKER_END).limit(1))!==void 0}function needsSessionWatchCursorProvenanceMigration(e,t){if(!tableExists(e,`session_watch_cursors`))return false;return t<SESSION_WATCH_PROVENANCE_SCHEMA_VERSION||!tableHasColumn(e,`session_watch_cursors`,`provenance`)||hasLegacyAmbientWatchSentinels(e)}function decodeLegacyAmbientWatchMarkerKey(e){const t=e.slice(20);if(!t||t.length%2!==0||!/^[0-9a-f]+$/.test(t))return;try{return new TextDecoder(`utf-8`,{fatal:true,ignoreBOM:true}).decode(Buffer.from(t,`hex`))}catch{return}}function migrateSessionWatchCursorProvenance(e){if(!tableExists(e,`session_watch_cursors`))return{migratedAmbientWatches:0,removedLegacySentinels:0};ensureColumn(e,`session_watch_cursors`,SESSION_WATCH_PROVENANCE_COLUMN_SQL);const t=getSessionWatchCursorKysely(e);const n=executeSqliteQuerySync(e,t.selectFrom(`session_watch_cursors`).select([`watcher_session_key`,`target_session_key`,`updated_at`]).where(`watcher_session_key`,`>=`,LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX).where(`watcher_session_key`,`<`,LEGACY_AMBIENT_GROUP_WATCH_MARKER_END)).rows;let r=0;for(const i of n){const n=decodeLegacyAmbientWatchMarkerKey(i.watcher_session_key);if(n){const a=executeSqliteQueryTakeFirstSync(e,t.selectFrom(`session_watch_cursors`).select(`updated_at`).where(`watcher_session_key`,`=`,n).where(`target_session_key`,`=`,i.target_session_key));if(a){const o=executeSqliteQuerySync(e,t.updateTable(`session_watch_cursors`).set({provenance:SESSION_WATCH_PROVENANCE_AMBIENT_GROUP,updated_at:Math.max(a.updated_at,i.updated_at)}).where(`watcher_session_key`,`=`,n).where(`target_session_key`,`=`,i.target_session_key));r+=Number(o.numAffectedRows??0n)}}executeSqliteQuerySync(e,t.deleteFrom(`session_watch_cursors`).where(`watcher_session_key`,`=`,i.watcher_session_key).where(`target_session_key`,`=`,i.target_session_key))}return{migratedAmbientWatches:r,removedLegacySentinels:n.length}}
//!src/state/openclaw-state-schema-retired.ts
const RETIRED_COMMITMENTS_COLUMNS_SQL=`
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
`;const RETIRED_COMMITMENTS_BASE_INDEXES_SQL=`CREATE INDEX idx_commitments_scope_due
  ON commitments(agent_id, session_key, status, due_earliest_ms, due_latest_ms);
CREATE INDEX idx_commitments_status_due
  ON commitments(status, due_earliest_ms, due_latest_ms);
CREATE INDEX idx_commitments_scope_dedupe
  ON commitments(agent_id, session_key, channel, dedupe_key, status);`;const RETIRED_COMMITMENTS_SCHEMA_SQL=`
CREATE TABLE commitments (${RETIRED_COMMITMENTS_COLUMNS_SQL.slice(1,-1)}
) STRICT;
${RETIRED_COMMITMENTS_BASE_INDEXES_SQL}
CREATE INDEX idx_commitments_agent_due
  ON commitments(agent_id, status, due_earliest_ms, due_latest_ms, session_key);
CREATE INDEX idx_commitments_agent_sent
  ON commitments(agent_id, status, sent_at_ms, session_key);
`;const SHIPPED_RETIRED_COMMITMENTS_SCHEMA_SQL=`
CREATE TABLE commitments (${RETIRED_COMMITMENTS_COLUMNS_SQL.slice(1,-1)}
);
${RETIRED_COMMITMENTS_BASE_INDEXES_SQL}
`;
//!src/state/openclaw-state-db-table-retirements.ts
const stateDbLog=createSubsystemLogger(`state/db`);const logRetiredStateTableMigration=e=>stateDbLog.info(e);const RETIRED_COMMITMENTS_SCHEMA_VERSION=7;const RETIRED_DEAD_STATE_TABLES_V10=[`agent_model_catalogs`,`android_notification_recent_packages`,`command_log_entries`,`diagnostic_stability_bundles`,`media_blobs`,`model_capability_cache`];const RETIRED_COMMITMENTS_ADDITIVE_COLUMNS=[`commitments.account_id`,`commitments.recipient_id`,`commitments.thread_id`,`commitments.sender_id`,`commitments.kind`,`commitments.sensitivity`,`commitments.source`,`commitments.reason`,`commitments.suggested_text`,`commitments.dedupe_key`,`commitments.confidence`,`commitments.due_timezone`,`commitments.source_message_id`,`commitments.source_run_id`,`commitments.created_at_ms`,`commitments.attempts`,`commitments.last_attempt_at_ms`,`commitments.sent_at_ms`,`commitments.dismissed_at_ms`,`commitments.snoozed_until_ms`,`commitments.expired_at_ms`];function deriveRetiredCommitmentsContract(){const e=new Map(getCanonicalSqliteNamedIndexContracts(RETIRED_COMMITMENTS_SCHEMA_SQL).map(({fingerprint:e,name:t})=>[t,JSON.stringify(e)]));return{indexFingerprints:e,compatibility:{allowedColumnDefinitions:{"commitments.attempts":[`attempts INTEGER NOT NULL DEFAULT 0`],"commitments.confidence":[`confidence REAL NOT NULL DEFAULT 0`],"commitments.created_at_ms":[`created_at_ms INTEGER NOT NULL DEFAULT 0`],"commitments.dedupe_key":[`dedupe_key TEXT NOT NULL DEFAULT ''`],"commitments.due_timezone":[`due_timezone TEXT NOT NULL DEFAULT 'UTC'`],"commitments.kind":[`kind TEXT NOT NULL DEFAULT 'followup'`],"commitments.reason":[`reason TEXT NOT NULL DEFAULT ''`],"commitments.sensitivity":[`sensitivity TEXT NOT NULL DEFAULT 'normal'`],"commitments.source":[`source TEXT NOT NULL DEFAULT 'unknown'`],"commitments.suggested_text":[`suggested_text TEXT NOT NULL DEFAULT ''`]},allowedMissingColumns:RETIRED_COMMITMENTS_ADDITIVE_COLUMNS,allowedMissingIndexes:[...e.keys()]}}}function hasSupportedRetiredCommitmentsSchema(e,t,{compatibility:n,indexFingerprints:r}){if(collectSqliteSchemaIssues(e,t,n).length>0)return false;return e.prepare(`SELECT type, name
           FROM sqlite_schema
          WHERE type IN ('index', 'trigger')
            AND tbl_name = 'commitments'
            AND sql IS NOT NULL
          ORDER BY type, name`).all().every(t=>t.type===`index`&&JSON.stringify(collectSqliteNamedIndexContract(e,t.name))===r.get(t.name))}function assertRecognizedRetiredCommitmentsSchema(e){if(hasRecognizedRetiredCommitmentsSchema(e))return;assertSqliteSchemaContains(e,`retired OpenClaw commitments schema`,RETIRED_COMMITMENTS_SCHEMA_SQL,deriveRetiredCommitmentsContract().compatibility);throw new Error(`Retired OpenClaw commitments schema has unsupported additional indexes; refusing destructive migration.`)}function hasRecognizedRetiredCommitmentsSchema(e){const t=deriveRetiredCommitmentsContract();return hasSupportedRetiredCommitmentsSchema(e,RETIRED_COMMITMENTS_SCHEMA_SQL,t)||hasSupportedRetiredCommitmentsSchema(e,SHIPPED_RETIRED_COMMITMENTS_SCHEMA_SQL,t)}function assertNoRetiredCommitmentsForeignKeys(e){const t=e.prepare(`SELECT name
         FROM sqlite_schema
        WHERE type = 'table' AND name <> 'commitments'
        ORDER BY name`).all();for(const n of t)if(e.prepare(`PRAGMA foreign_key_list(${quoteSqliteIdentifier(n.name)})`).all().some(e=>typeof e.table===`string`&&e.table.toLowerCase()===`commitments`))throw new Error(`Retired OpenClaw commitments schema is referenced by table ${n.name}; refusing destructive migration.`)}function collectRetainedSchemaSql(e){return new Map(e.prepare(`SELECT type, name, sql
             FROM sqlite_schema
            WHERE type IN ('trigger', 'view')
              AND tbl_name <> 'commitments'
              AND sql IS NOT NULL
            ORDER BY type, name`).all().map(e=>[`${e.type}:${e.name}`,e.sql]))}function assertNoRetiredCommitmentsSchemaDependencies(e){const t=`__openclaw_retired_commitments_probe`;if(tableExists(e,t))throw new Error(`OpenClaw state database already contains ${t}; refusing destructive migration.`);const n=collectRetainedSchemaSql(e);const r=`openclaw_probe_commitments_dependencies`;e.exec(`SAVEPOINT ${r};`);let i;try{e.exec(`ALTER TABLE commitments RENAME TO ${quoteSqliteIdentifier(t)};`);const r=collectRetainedSchemaSql(e);i=[...n].find(([e,t])=>r.get(e)!==t)?.[0]}catch(t){e.exec(`ROLLBACK TO ${r}; RELEASE ${r};`);throw new Error(`Could not prove retained SQLite views and triggers independent of commitments; refusing destructive migration.`,{cause:t})}e.exec(`ROLLBACK TO ${r}; RELEASE ${r};`);if(i){const[e,t]=i.split(`:`,2);throw new Error(`Retired OpenClaw commitments schema is referenced by ${e} ${t}; refusing destructive migration.`)}}function assertVirtualTablesUsable(e,t){const n=e.prepare(`SELECT name
         FROM sqlite_schema
        WHERE type = 'table' AND lower(sql) LIKE 'create virtual table%'
        ORDER BY name`).all();for(const r of n)try{e.prepare(`SELECT * FROM ${quoteSqliteIdentifier(r.name)} LIMIT 1`).all()}catch(e){throw new Error(`SQLite virtual table ${r.name} is unusable ${t} commitments retirement.`,{cause:e})}}function migrateRetiredCommitmentsSchema(e,t){if(t>=7)return false;if(!tableExists(e,`commitments`))return false;assertRecognizedRetiredCommitmentsSchema(e);assertNoRetiredCommitmentsForeignKeys(e);assertNoRetiredCommitmentsSchemaDependencies(e);assertVirtualTablesUsable(e,`before`);const n=`openclaw_retire_commitments_v7`;e.exec(`SAVEPOINT ${n};`);try{e.exec(`DROP TABLE commitments;`);assertVirtualTablesUsable(e,`after`);e.exec(`RELEASE ${n};`);return true}catch(t){e.exec(`ROLLBACK TO ${n}; RELEASE ${n};`);throw t}}function migrateRetiredDeadStateTablesV10(e,t){if(t>=10)return false;let n=false;for(const t of RETIRED_DEAD_STATE_TABLES_V10)if(tableExists(e,t)){e.exec(`DROP TABLE IF EXISTS ${t};`);n=true}return n}const RETIRED_SKILL_CURATOR_TABLES_V11=[`skill_lifecycle`,`skill_workshop_proposal_origin_runs`];function migrateRetiredSkillCuratorTablesV11(e,t){if(t>=11)return false;const n=RETIRED_SKILL_CURATOR_TABLES_V11.filter(t=>tableExists(e,t));if(n.length===0)return false;if(n.includes(`skill_lifecycle`)){const t=Number(e.prepare(`SELECT COUNT(*) AS archived_count FROM skill_lifecycle WHERE state = 'archived'`).get()?.archived_count);if(t>0)stateDbLog.info(`${t} previously archived workshop skills are live again; archive any you no longer want`)}for(const t of n)e.exec(`DROP TABLE IF EXISTS ${t};`);return true}function runRetiredStateTableMigrations(e,t){const n=[];if(migrateRetiredCommitmentsSchema(e,t))n.push(`Discarded retired shared-state commitments rows, table, and indexes`);if(migrateRetiredDeadStateTablesV10(e,t))n.push(`Retired six dead shared-state tables (v10)`);if(migrateRetiredSkillCuratorTablesV11(e,t))n.push(`Retired legacy skill curator lifecycle and proposal origin-run tables`);return n}
//!src/state/openclaw-state-db-schema-repair.ts
const STATE_SCHEMA_MIGRATION_READ_TABLES={"agent-databases-composite-primary-key":[`agent_databases`],"audit-events-v2":[`audit_events`,`audit_identity_keys`],"commitments-retirement-v7":[`commitments`],"worker-placement-execution-mode-v8":[`worker_session_placements`],"agent-databases-relative-paths-v9":[`agent_databases`],"state-table-retirement-v10":RETIRED_DEAD_STATE_TABLES_V10,"state-table-retirement-v11":RETIRED_SKILL_CURATOR_TABLES_V11,"singleton-state-foldin-v12":[`config_machine_state`,...FOLDED_SINGLETON_STATE_TABLES_V12],"state-consolidation-v13":[`cron_jobs`,`subagent_runs`,`workspace_setup_state`,`workspace_attestations`,`workspace_generated_bootstrap_hashes`,`auth_profile_stores`,`auth_profile_state`,`installed_plugin_index`,`config_machine_state`,`diagnostic_events`],"creator-namespace-v14":[`cron_jobs`],"conversation-binding-targets-v15":[`current_conversation_bindings`],"prepared-worker-ownership-v17":[`worker_environments`],"github-publication-requester-authority-v18":[`github_publication_session_lifecycles`,`github_repository_publication_requests`],"meeting-transcript-start-time":[`meeting_transcript_sessions`],"portable-identity-columns-v22":[`acp_sessions`,...STATE_CURSOR_TABLES_V22],"task-run-indexes-v24":[],"subagent-operator-recovery-v25":[],"session-state-head-layout-v26":[],"state-write-indexes-v27":[],"github-publication-draft-v28":[`github_publication_requests`,`github_personal_publication_requests`,`github_repository_publication_requests`],"local-client-credentials-v29":[`device_identities`,`device_auth_tokens`,`gateway_origin_device_tokens`,`exec_approvals_config`],"predicate-columns-v21":[`meeting_transcript_sessions`,`meeting_transcript_summaries`,`delivery_queue_entries`],"automation-policy-fence-v30":[`cron_jobs`],"local-workspace-manifests-v31":[`local_workspace_projections`,`local_workspace_manifest_nodes`],"local-workspace-cas-v35":[`local_workspace_projections`,`local_workspace_tree_packs`,`local_workspace_source_path_sets`],"template-names-v36":[...TEMPLATE_STATE_TABLE_RENAMES.flat(),`agent_provenance`],"worker-resource-receipts-v37":[`worker_environments`],"repository-disk-authority-v38":[`session_repository_workspaces`,`worker_workspace_pending_results`],"operator-approvals-system-agent":[`operator_approvals`],"session-watch-cursor-provenance-v4":[`session_watch_cursors`],"strict-tables-v3":OPENCLAW_STATE_SCHEMA_SQL.split(`
`).flatMap(e=>{const t=/^CREATE TABLE IF NOT EXISTS (\w+) \(/u.exec(e)?.[1];return t?[t]:[]})};function dropLegacyStateTables(e){const t=[`database`,`verifications`].join(`_`);e.exec(`DROP TABLE IF EXISTS ${t};`);e.exec(`DROP TABLE IF EXISTS node_pairing_pending; DROP TABLE IF EXISTS node_pairing_paired;`)}function migrateWorkerPlacementExecutionModeSchema(e,t){if(t>=8||!tableExists(e,`worker_session_placements`))return false;for(const t of[`execution_mode TEXT`,`terminal_reason TEXT`,`terminal_at_ms INTEGER`])ensureColumn(e,`worker_session_placements`,t);const n=extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL,`worker_session_placements`,{errorMessage:`Canonical worker placement schema block is missing`});const r=openNodeSqliteDatabase(`:memory:`);let i;try{r.exec(n);i=r.prepare(`PRAGMA table_xinfo(worker_session_placements)`).all().filter(e=>e.hidden===0).map(e=>e.name)}finally{r.close()}const a=e.prepare(`PRAGMA table_xinfo(worker_session_placements)`).all().filter(e=>e.hidden===0).map(e=>e.name);const o=new Set(i);if(a.length!==i.length||a.some(e=>!o.has(e)))throw new Error(`OpenClaw v7 worker placement columns are not canonical`);if(e.prepare(`SELECT type, name
         FROM sqlite_schema
        WHERE tbl_name = 'worker_session_placements'
          AND type IN ('index', 'trigger')
          AND sql IS NOT NULL
          AND name NOT IN (
            'idx_worker_session_placements_session_key',
            'idx_worker_session_placements_reconcile',
            'idx_worker_session_placements_environment'
          )`).all().length>0)throw new Error(`OpenClaw v7 worker placement schema has unsupported attached objects`);const s=`worker_session_placements_migration_v8`;if(tableExists(e,s))throw new Error(`OpenClaw worker placement migration table already exists: ${s}`);const c=n.replace(`CREATE TABLE IF NOT EXISTS worker_session_placements`,`CREATE TABLE ${s}`);const l=i.map(quoteSqliteIdentifier).join(`, `);e.exec(c);e.exec(`INSERT INTO ${s} (${l}) SELECT ${l} FROM worker_session_placements;`);e.exec(`DROP TABLE worker_session_placements;`);e.exec(`ALTER TABLE ${s} RENAME TO worker_session_placements;`);return true}function isDefaultAgentDatabasePath(e,t){const n=path.dirname(e);const r=path.dirname(n);return path.basename(e)===`openclaw-agent.sqlite`&&path.basename(n)===`agent`&&path.basename(r)===t&&path.basename(path.dirname(r))===`agents`}function migrateAgentDatabaseRelativePaths(e,t,n){if(t>=9||!tableExists(e,`agent_databases`))return{relativized:0,reanchored:[],deleted:[],preserved:0};const r=e.prepare(`SELECT agent_id, path FROM agent_databases`).all();const i=e.prepare(`UPDATE agent_databases SET path = ? WHERE agent_id = ? AND path = ?`);const a=e.prepare(`DELETE FROM agent_databases WHERE agent_id = ? AND path = ?`);const o=e.prepare(`SELECT 1 FROM agent_databases WHERE agent_id = ? AND path = ? LIMIT 1`);const s=e.prepare(`
    UPDATE agent_databases AS canonical
       SET schema_version = source.schema_version,
           last_seen_at = source.last_seen_at,
           size_bytes = source.size_bytes
      FROM agent_databases AS source
     WHERE canonical.agent_id = ? AND canonical.path = ?
       AND source.agent_id = canonical.agent_id AND source.path = ?
       AND source.last_seen_at > canonical.last_seen_at
  `);let c=0;const l=[];const u=[];for(const e of r){const t=e.agent_id;const r=e.path;if(typeof t!==`string`||typeof r!==`string`)throw new Error(`OpenClaw v8 agent database registry paths are not canonical`);if(!path.isAbsolute(r))continue;const l=resolveOpenClawAgentDatabaseStoredPath(n,r);if(!path.isAbsolute(l)){if(o.get(t,l)){s.run(t,l,r);a.run(t,r);u.push(r)}else{i.run(l,t,r);c+=1}}}const d=resolveOpenClawStateDirForDatabasePath(n);for(const e of r){const t=e.agent_id;const r=e.path;if(typeof t!==`string`||typeof r!==`string`||!path.isAbsolute(r)||!path.isAbsolute(resolveOpenClawAgentDatabaseStoredPath(n,r)))continue;if(isDefaultAgentDatabasePath(path.resolve(r),t)){const e=path.join(d,`agents`,t,`agent`,`openclaw-agent.sqlite`);const s=resolveOpenClawAgentDatabaseStoredPath(n,e);if(o.get(t,s)){a.run(t,r);u.push(r)}else if(existsSync(e)){i.run(s,t,r);l.push(r)}}}return{relativized:c,reanchored:l,deleted:u,preserved:r.length-c-l.length-u.length}}function assertCanonicalAgentDatabasesPrimaryKey(e,t){if(!tableExists(e,`agent_databases`))return;const n=tablePrimaryKeyColumns(e,`agent_databases`);if(n.length!==2||n[0]!==`agent_id`||n[1]!==`path`)throw new SqliteSchemaMismatchError(`OpenClaw state database ${t} has an unsupported agent database registry schema. Upgrades from pre-July-2026 state are no longer migrated; restore a backup produced by a July 2026 or newer release before retrying.`)}function repairLegacyGatewayRestartHandoffsForStrictMigration(e){if(!tableExists(e,`gateway_restart_handoff`))return;e.prepare(`DELETE FROM gateway_restart_handoff WHERE expires_at <= ?`).run(Date.now());e.exec(`
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
  `)}function assertCanonicalStateSchemaShape(e,t){assertCanonicalOperatorApprovalKinds(e,t);assertCanonicalAgentDatabasesPrimaryKey(e,t);if(!hasCanonicalAuditEventsSchema(e)){if(canRepairLegacyAuditEventsSchema(e))throw new OpenClawStateDatabaseSchemaMigrationRequiredError(`audit-events-v2`,t);throw new SqliteSchemaMismatchError(`OpenClaw state database ${t} has a noncanonical audit event schema that cannot be repaired automatically; restore the canonical audit_events shape before retrying.`)}}function detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(e,t){assertCanonicalAgentDatabasesPrimaryKey(e,t);const n=[];const r=readStateSchemaContentVersion(e);if(r<7&&tableExists(e,`commitments`)&&hasRecognizedRetiredCommitmentsSchema(e))n.push({kind:`commitments-retirement-v7`,path:t});if(r===7&&tableExists(e,`worker_session_placements`))n.push({kind:`worker-placement-execution-mode-v8`,path:t});if(r===8&&tableExists(e,`agent_databases`))n.push({kind:`agent-databases-relative-paths-v9`,path:t});if(r<10&&RETIRED_DEAD_STATE_TABLES_V10.some(t=>tableExists(e,t)))n.push({kind:`state-table-retirement-v10`,path:t});if(r<11&&RETIRED_SKILL_CURATOR_TABLES_V11.some(t=>tableExists(e,t)))n.push({kind:`state-table-retirement-v11`,path:t});if(r<12&&FOLDED_SINGLETON_STATE_TABLES_V12.some(t=>tableExists(e,t)))n.push({kind:`singleton-state-foldin-v12`,path:t});if(r<13&&(tableHasColumn(e,`cron_jobs`,`schedule_kind`)||tableHasColumn(e,`subagent_runs`,`task`)||tableExists(e,`workspace_attestations`)||tableExists(e,`installed_plugin_index`)||tableExists(e,`auth_profile_stores`)))n.push({kind:`state-consolidation-v13`,path:t});if(r<14&&tableExists(e,`cron_jobs`))n.push({kind:`creator-namespace-v14`,path:t});if(r<15&&(tableHasColumn(e,`current_conversation_bindings`,`target_agent_id`)||tableHasColumn(e,`current_conversation_bindings`,`target_session_id`)))n.push({kind:`conversation-binding-targets-v15`,path:t});if(r<17&&tableExists(e,`worker_environments`)&&!tableHasColumn(e,`worker_environments`,`preparation_consumed_at_ms`))n.push({kind:`prepared-worker-ownership-v17`,path:t});if(r<18&&[`github_publication_session_lifecycles`,`github_repository_publication_requests`].some(t=>tableExists(e,t)&&!tableHasColumn(e,t,`requester_authority_json`)))n.push({kind:`github-publication-requester-authority-v18`,path:t});if(r<21&&[`meeting_transcript_sessions`,`meeting_transcript_summaries`,`delivery_queue_entries`].some(t=>tableExists(e,t)))n.push({kind:`predicate-columns-v21`,path:t});if(r<22&&[`acp_sessions`,...STATE_CURSOR_TABLES_V22].some(t=>tableExists(e,t)))n.push({kind:`portable-identity-columns-v22`,path:t});if(r<23&&tableExists(e,`meeting_transcript_sessions`))n.push({kind:`meeting-transcript-start-time`,path:t});if(r<24&&tableExists(e,`task_runs`))n.push({kind:`task-run-indexes-v24`,path:t});if(r<25)n.push({kind:`subagent-operator-recovery-v25`,path:t});if(r<26&&tableExists(e,`session_state_heads`))n.push({kind:`session-state-head-layout-v26`,path:t});if(r<27)n.push({kind:`state-write-indexes-v27`,path:t});if(r<28||needsPublicationDraftMigration(e))n.push({kind:`github-publication-draft-v28`,path:t});if(r<29)n.push({kind:`local-client-credentials-v29`,path:t});if(r<30)n.push({kind:`automation-policy-fence-v30`,path:t});if(r<31)n.push({kind:`local-workspace-manifests-v31`,path:t});if(r<35)n.push({kind:`local-workspace-cas-v35`,path:t});if(r<36)n.push({kind:`template-names-v36`,path:t});if(r<37)n.push({kind:`worker-resource-receipts-v37`,path:t});if(r<38)n.push({kind:`repository-disk-authority-v38`,path:t});if(!hasCanonicalAuditEventsSchema(e))n.push({kind:`audit-events-v2`,path:t});if(tableExists(e,`audit_events`)&&r<3)n.push({kind:`strict-tables-v3`,path:t});if(needsSessionWatchCursorProvenanceMigration(e,r))n.push({kind:`session-watch-cursor-provenance-v4`,path:t});n.push(...detectOperatorApprovalSchemaMigration(e,t));return n}
//!src/state/openclaw-agent-db-registry.read.ts
const readableSchemas=/* @__PURE__ */ new WeakSet;function hasUnavailableMissingSqlitePath(e){for(const t of resolveSqliteDatabaseFilePaths(e))try{lstatSync(t);return true}catch(e){if(!hasErrnoCode(e,`ENOENT`))return true}let t=path.dirname(e);while(true){try{const e=lstatSync(t);if(!e.isSymbolicLink())return!e.isDirectory();try{return!statSync(t).isDirectory()}catch{return true}}catch(e){if(!hasErrnoCode(e,`ENOENT`))return true}const e=path.dirname(t);if(e===t)return false;t=e}}function readOpenClawAgentDatabaseRegistryRows(e,t){const n=getNodeSqliteKysely(e);const r=getAdmittedSqliteSchemaFacts(e);const i=isPostgresSqlConnection(e)?tableExists(e,`agent_databases`)?{type:`table`}:void 0:r?r.tables.has(`agent_databases`)?{type:`table`}:r.views.has(`agent_databases`)||r.indexes.has(`agent_databases`)||r.triggers.has(`agent_databases`)?{type:`invalid`}:void 0:executeSqliteQueryTakeFirstSync(e,n.selectFrom(`sqlite_master`).select(`type`).where(`name`,`=`,`agent_databases`));if(!i)return[];if(i.type!==`table`)throw new Error(`OpenClaw state database ${t} has an invalid agent registry.`);return executeSqliteQuerySync(e,n.selectFrom(`agent_databases`).selectAll().orderBy(`agent_id`,`asc`).orderBy(`path`,`asc`)).rows}function readAgentDatabasePreflightTargets(e,t){return readOpenClawAgentDatabaseRegistryRows(e,t).flatMap(e=>typeof e.agent_id===`string`&&typeof e.path===`string`?[{agentId:e.agent_id,path:resolveOpenClawRegisteredAgentDatabasePath(t,e.path)}]:[])}function readRegisteredAgentDatabaseRows(e,t,n){if(isPostgresSqlConnection(e)){if(n)requireNativeDatabaseFile(`postgres`,`file-snapshot`)}else if(!getStateRuntimeSchemaAdmission(e)){if(n)assertCanonicalAgentDatabasesPrimaryKey(e,t);else{const n=getAdmittedSqliteSchemaFacts(e);if(!n||!readableSchemas.has(n)){if(detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(e,t).some(({kind:e})=>STATE_SCHEMA_MIGRATION_READ_TABLES[e].includes(`agent_databases`)))throw new Error(`OpenClaw state database ${t} has a legacy agent database registry schema; run openclaw doctor --fix to migrate it.`);if(n)readableSchemas.add(n)}}}return readOpenClawAgentDatabaseRegistryRows(e,t).map(e=>({agentId:normalizeAgentId(e.agent_id),path:resolveOpenClawRegisteredAgentDatabasePath(t,e.path),schemaVersion:e.schema_version,lastSeenAt:e.last_seen_at,sizeBytes:e.size_bytes}))}
//!src/infra/state-lease-process-owner.ts
function parseStateLeaseProcessOwner(e){const t=safeParseJsonRecord(e??``)?.owner;if(!isRecord(t))return null;const{pid:n,host:r,startedAt:i}=t;if(typeof n!==`number`||!Number.isSafeInteger(n)||n<=0||typeof r!==`string`||!r||i!==null&&(typeof i!==`number`||!Number.isSafeInteger(i)||i<0))return null;return{pid:n,host:r,startedAt:i,...t.machineIdentity===void 0?{}:{machineIdentity:MachineIdentitySchema.safeParse(t.machineIdentity).data??null},...t.processNamespace===void 0?{}:{processNamespace:GatewayProcessNamespaceSchema.safeParse(t.processNamespace).data??null}}}function readStateLeaseProcessOwnerStatus(e,t){if(!e)return`unknown`;const n=classifyGatewayOwnerProcessNamespace(e.processNamespace,{ownerHost:e.host,machineIdentity:e.machineIdentity});if(n!==`same`)return n;return readSameNamespaceProcessOwnerStatus(e)}function readSameNamespaceProcessOwnerStatus(e){if(isPidDefinitelyDead(e.pid))return`dead`;const t=getFileLockProcessStartTime(e.pid);if(e.startedAt===null||t===null)return`unknown`;return t===e.startedAt?`live`:`dead`}
//!src/infra/sqlite-live-owner.ts
function hasVerifiedLiveSqliteOwner(e){if(readOwnerPaths.get(path.resolve(e))?.accepting)return true;const t=resolveGatewayStateOwnerPath(e);let n;try{n=parseGatewayLockPayload(fs.readFileSync(t,`utf8`))}catch{return false}if(!n||n.role&&n.role!==`gateway`&&n.role!==`agent-embedded`)return false;const r=readStateLeaseProcessOwnerStatus({pid:n.pid,host:n.processNamespace?.host??hostname(),startedAt:n.startTime??null,processNamespace:n.processNamespace,machineIdentity:n.machineIdentity});if(r===`unknown`)throw new GatewayLockNamespaceError(n,t);return r===`live`}
//!src/state/openclaw-state-db-engine-input.ts
function stateEngineInput(){if(getDatabaseEngineSelection())return getDatabaseEngineInput(`state`)}
//!src/state/openclaw-state-db-schema-v35-workspace-cas.ts
const WORKSPACE_CAS_TABLES=[`local_workspace_tree_packs`,`local_workspace_source_path_sets`];const WORKSPACE_CAS_COLUMNS=[`tree_root_digest`,`source_paths_digest`,`canonical_fingerprints`,`projection_fingerprints`];function migrateLocalWorkspaceCas(e,t){if(t>=35||!tableExists(e,`local_workspace_projections`))return false;for(const t of WORKSPACE_CAS_COLUMNS)ensureColumn(e,`local_workspace_projections`,`${t} BLOB`);for(const t of WORKSPACE_CAS_TABLES)e.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL,t));return true}const stateLocalWorkspaceCasMigration={version:35,tables:[`local_workspace_projections`,...WORKSPACE_CAS_TABLES],columns:WORKSPACE_CAS_COLUMNS.map(e=>`local_workspace_projections.${e}`),migrate:migrateLocalWorkspaceCas,applied:`Prepared shared content-addressed workspace trees and compact scan fingerprints (v35)`};function withLegacyLocalWorkspaceCas(e){return e.replace(/\n {2}(?:tree_root_digest|source_paths_digest|canonical_fingerprints|projection_fingerprints) BLOB,/gu,``).replace(/\n {2}"(?:tree_root_digest|source_paths_digest|canonical_fingerprints|projection_fingerprints)" bytea,/gu,``).replace(/CREATE TABLE(?: IF NOT EXISTS)? "?local_workspace_(?:tree_packs|source_path_sets)"? \([\s\S]*?\n\)(?: STRICT(?:, WITHOUT ROWID)?)?;\n?/gu,``)}
//!src/state/openclaw-state-db-schema-v31-workspace-manifests.ts
const projectionTable=`local_workspace_projections`;const nodeTable=`local_workspace_manifest_nodes`;const legacyBaselineCheck=`CHECK ((baseline_json IS NULL) = (baseline_ref IS NULL))`;const incrementalBaselineCheck=`CHECK (baseline_json IS NULL OR baseline_ref IS NOT NULL)`;function migrateLocalWorkspaceManifests(e,t){if(t>=31||!tableExists(e,projectionTable))return false;ensureColumn(e,projectionTable,`checkpoint_json TEXT`);const n=getAdmittedSqliteSchemaFacts(e)??captureSqliteSchemaFacts(e);const r=n.tableSql.get(projectionTable);if(typeof r!==`string`)throw new Error(`Local workspace projection migration schema is missing`);if(r.includes(legacyBaselineCheck)){const t=quoteSqliteIdentifier(`${projectionTable}_migration_v31`);const i=quoteSqliteIdentifier(projectionTable);const a=[...readTableColumns(e,projectionTable)].map(quoteSqliteIdentifier).join(`, `);const o=r.slice(r.indexOf(`(`)).replace(legacyBaselineCheck,incrementalBaselineCheck);e.exec(`CREATE TABLE ${t} ${o};
      INSERT INTO ${t} (rowid, ${a}) SELECT rowid, ${a} FROM ${i};
      DROP TABLE ${i};
      ALTER TABLE ${t} RENAME TO ${i};`);for(const t of[...n.indexDefinitions.values(),...n.triggers.values()])if(t.table===projectionTable&&typeof t.sql===`string`)e.exec(t.sql)}else if(!r.includes(incrementalBaselineCheck))throw new Error(`Local workspace baseline constraint is not recognized; preserve it for Doctor`);e.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL,nodeTable));return true}const stateLocalWorkspaceManifestMigration={version:31,tables:[projectionTable,nodeTable],columns:[`${projectionTable}.checkpoint_json`],migrate:migrateLocalWorkspaceManifests,applied:`Prepared resumable per-path local workspace baselines and checkpoint deltas (v31)`};function withLegacyLocalWorkspaceManifests(e){return withLegacyLocalWorkspaceCas(e).replace(/\n {2}(?:checkpoint_json TEXT|"checkpoint_json" text COLLATE "C"),/gu,``).replace(/^ {2}CHECK \([^\n]*baseline_json[^\n]*baseline_ref[^\n]*\),$/gmu,e=>e.includes(`"`)?`  CHECK ((("baseline_json" IS NULL) = ("baseline_ref" IS NULL))),`:`  ${legacyBaselineCheck},`).replace(/CREATE TABLE(?: IF NOT EXISTS)? "?local_workspace_manifest_nodes"? \([\s\S]*?\n\)(?: STRICT)?;\n?/gu,``).replace(/ALTER TABLE "local_workspace_manifest_nodes" ADD FOREIGN KEY[^;]*;\n?/gu,``)}
//!src/state/openclaw-state-db-schema-v37-resource-receipts.ts
const stateWorkerResourceReceiptMigration={version:37,tables:[`worker_environments`],columns:[`worker_environments.resource_receipt_json`],migrate(e,t){if(t>=37)return false;return ensureColumn(e,`worker_environments`,`resource_receipt_json TEXT`)},applied:`Retained immutable worker provider resource receipts (v37)`};function withLegacyWorkerResourceReceipts(e){return e.replace(/,\n {2}resource_receipt_json TEXT(?=\n\))|\n {2}"resource_receipt_json" text COLLATE "C",/gu,``)}
//!src/state/openclaw-state-db-schema-v38-repository-disk.ts
const stateRepositoryDiskAuthorityMigration={version:38,tables:[`session_repository_workspaces`,`worker_workspace_pending_results`],columns:[`session_repository_workspaces.disk_authority_json`,`worker_workspace_pending_results.repository_disk_authority_json`],migrate(e,t){if(t>=38)return false;const n=ensureColumn(e,`session_repository_workspaces`,`disk_authority_json TEXT`);const r=ensureColumn(e,`worker_workspace_pending_results`,`repository_disk_authority_json TEXT`);return n||r},applied:`Retained repository disk authority and original pending-result authority (v38)`};const stateWorkerDiskMigrations=[stateWorkerResourceReceiptMigration,stateRepositoryDiskAuthorityMigration];function withLegacyRepositoryDiskAuthority(e){return e.replace(/\n {2}(?:(?:disk_authority_json|repository_disk_authority_json) TEXT|"(?:disk_authority_json|repository_disk_authority_json)" text COLLATE "C"),/gu,``)}
//!src/state/openclaw-state-db-schema-v39-worker-retention.ts
const stateWorkerRetentionMigration={version:39,tables:[`worker_environments`],columns:[`worker_environments.retention_json`],migrate(e,t){if(t>=39)return false;return ensureColumn(e,`worker_environments`,`retention_json TEXT`)},applied:`Retained worker acquisition policy, unfinished operation, and observations (v39)`};function withLegacyWorkerRetention(e){return e.replace(/,\n {2}retention_json TEXT(?=\n\))|\n {2}"retention_json" text COLLATE "C",/gu,``)}
//!src/state/openclaw-state-db-schema-v40-lazy-additions.ts
function withLegacyWorkspaceBootstrapDeferred(e){return e.replace(`  bootstrap_deferred INTEGER,
`,``).replace(`  "bootstrap_deferred" bigint,
`,``)}function withLegacyStateV40Additions(e){return withLegacyWorkspaceBootstrapDeferred(e).replace(/CREATE TABLE IF NOT EXISTS device_pairing_browser_requests \([\s\S]*?\) STRICT;\n\n/u,``)}
//!src/state/openclaw-state-db-schema-v40-worker-provision-source.ts
const stateWorkerProvisionSourceMigration={version:40,tables:[`worker_environments`],columns:[`worker_environments.provision_source_json`],migrate(e,t){if(t>=40||!tableExists(e,`worker_environments`))return false;const n=ensureColumn(e,`worker_environments`,`provision_source_json TEXT`);const r=e.prepare(`UPDATE worker_environments
      SET provision_source_json = '{"kind":"unavailable"}'
      WHERE (state IN ('requested', 'provisioning') AND lease_id IS NULL
        OR state = 'bootstrapping' AND owner_epoch = 0)
        AND provision_source_json IS NULL`).run();return n||Number(r.changes)>0},applied:`Original worker provisioning source retained across recovery (v40)`};function withLegacyWorkerProvisionSource(e){return e.replace(/,\n {2}provision_source_json TEXT(?=\n\))|\n {2}"provision_source_json" text COLLATE "C",/gu,``)}
//!src/state/openclaw-state-postgres-admission.ts
function withPostgresSchemaAdmissionRetry(e,t,n){try{return t()}catch(r){if(!(r instanceof PostgresSchemaAdmissionUnavailableError)||!isPostgresSqlConnection(e)||n?.()===false||!e.isOpen||e.isTransaction)throw r;const i=Math.min(Date.now()+1e3,readSqliteDatabaseAdmissionDeadline()??Infinity);const a=performance.now()+Math.max(0,i-Date.now());const o=new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));return withSqliteDatabaseAdmissionWait({deadlineAtMs:i},()=>{for(let s=10;;s=Math.min(s*2,100)){assertSqliteDatabaseAdmissionWaitActive();const c=Math.min(a-performance.now(),i-Date.now());if(c<=0)throw r;Atomics.wait(o,0,0,Math.min(s,c));assertSqliteDatabaseAdmissionWaitActive();if(performance.now()>=a||Date.now()>=i)throw r;if(n?.()===false||!e.isOpen||e.isTransaction)throw r;try{if(!getPostgresPhysicalFacts(e,{refresh:true}))continue;return t()}catch(t){if(t instanceof SqliteDatabaseAdmissionTimeoutError&&(performance.now()>=a||Date.now()>=i))throw r;if(!(t instanceof PostgresSchemaAdmissionUnavailableError)||n?.()===false||!e.isOpen||e.isTransaction)throw t}}})}}
//!src/infra/update-run-timeouts.ts
const ABANDONED_UPDATE_RUN_MS=18e5;
//!src/state/openclaw-state-schema-publication.ts
const TERMINAL_GRACE_MS=3e5;function isUnfencedUpdateDriver(e){const t=typeof e===`string`?parse(e):null;return t!==null&&`${t.major}.${t.minor}.${t.patch}`===`2026.9.2`}function readStateSchemaPublicationBlocker(e,t=Date.now()){if(!tableExists(e,`update_runs`))return;const n=executeSqliteQuerySync(e,getNodeSqliteKysely(e).selectFrom(`update_runs`).select([`run_id`,`before_json`,`status`,`updated_at_ms`,`finished_at_ms`]).where(e=>e.or([e.and([e(`status`,`=`,`running`),e(`updated_at_ms`,`>=`,t-ABANDONED_UPDATE_RUN_MS)]),e.and([e(`status`,`!=`,`running`),e.or([e(`finished_at_ms`,`>`,t-TERMINAL_GRACE_MS),e(`finished_at_ms`,`is`,null)])])])).orderBy(`run_id`)).rows;let r;for(const e of n){const t=JSON.parse(e.before_json);if(!isRecord(t)||typeof t.version!==`string`||!isUnfencedUpdateDriver(t.version))continue;const n=e.status===`running`?e.updated_at_ms+ABANDONED_UPDATE_RUN_MS+1:e.finished_at_ms===null?null:e.finished_at_ms+TERMINAL_GRACE_MS;if(!r||n===null||r.publishAfterMs!==null&&n>r.publishAfterMs)r={runId:e.run_id,updaterVersion:t.version,publishAfterMs:n}}return r}function resolveStateSchemaVersionToPublish(e){const t=readSqliteUserVersion(e);if(t>=40||!readStateSchemaPublicationBlocker(e))return 40;if(!tableExists(e,`config_machine_state`))throw new Error(`Shared state schema publication cannot be deferred without config_machine_state.`);writeStateSchemaContentVersion(e);invalidateSqliteSchemaFacts(e);return t}function writeStateSchemaContentVersion(e){executeSqliteQuerySync(e,getNodeSqliteKysely(e).insertInto(`config_machine_state`).values({state_key:CONTENT_VERSION_KEY,value_json:String(40),updated_at_ms:Date.now()}).onConflict(e=>e.column(`state_key`).doUpdateSet({value_json:String(40),updated_at_ms:Date.now()}).where(`config_machine_state.value_json`,`!=`,String(40))))}function advanceStateSchemaContentVersion(e,t){executeSqliteQuerySync(e,getNodeSqliteKysely(e).updateTable(`config_machine_state`).set({value_json:String(t.toVersion)}).where(`state_key`,`=`,CONTENT_VERSION_KEY).where(`value_json`,`=`,String(t.fromVersion)))}
//!src/state/postgres-schema.generated/runtime.ts
const statePostgresRuntime={get eagerSql(){const e=`-- Generated runtime DDL; the owner supplies search_path and the transaction.

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
`;Object.defineProperty(this,"eagerSql",{value:e,enumerable:true,configurable:true,writable:true});return e},get operatorRecoveryV25Sql(){const e=`-- Generated v24-to-v25 metadata-only transition; the engine owner publishes openclaw_schema_meta.
-- Subagent operator recovery requires the new reader; catalog and retained rows are unchanged.
UPDATE schema_meta SET schema_version = 25 WHERE meta_key = 'primary' AND schema_version = 24;
UPDATE config_machine_state SET value_json = '25' WHERE state_key = 'state.schema.contentVersion' AND value_json = '24';
`;Object.defineProperty(this,"operatorRecoveryV25Sql",{value:e,enumerable:true,configurable:true,writable:true});return e},get preWriteIndexesV27Sql(){const e={acp_replay_events:`CREATE INDEX "idx_acp_replay_events_session_seq" ON "acp_replay_events" (("session_id") ASC NULLS FIRST, ("seq") ASC NULLS FIRST);`,skill_usage:`CREATE INDEX "idx_skill_usage_key" ON "skill_usage" (("skill_key") ASC NULLS FIRST, ("skill_file") ASC NULLS FIRST);`,state_leases:`CREATE INDEX "idx_state_leases_owner" ON "state_leases" (("owner") ASC NULLS FIRST, ("updated_at") DESC NULLS LAST);`};Object.defineProperty(this,"preWriteIndexesV27Sql",{value:e,enumerable:true,configurable:true,writable:true});return e},get writeIndexesV27Sql(){const e=`
  DROP INDEX IF EXISTS idx_acp_replay_events_session_seq;
  DROP INDEX IF EXISTS idx_skill_usage_key;
  DROP INDEX IF EXISTS idx_state_leases_owner;

CREATE INDEX "idx_state_leases_owner" ON "state_leases" (("owner") ASC NULLS FIRST);`;Object.defineProperty(this,"writeIndexesV27Sql",{value:e,enumerable:true,configurable:true,writable:true});return e},get clientCredentialV29Sql(){const e=`-- Generated v28-to-v29 publication after the local credential owner has verified and retired source rows.
UPDATE schema_meta SET schema_version = 29 WHERE meta_key = 'primary' AND schema_version = 28;
`;Object.defineProperty(this,"clientCredentialV29Sql",{value:e,enumerable:true,configurable:true,writable:true});return e},get workspaceCasV35Sql(){const e=`-- Generated DDL-only v34-to-v35 transition; reconciliation converts retained rows online.
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
`;Object.defineProperty(this,"workspaceCasV35Sql",{value:e,enumerable:true,configurable:true,writable:true});return e},get clientCredentialSource(){const e={sql:`CREATE TABLE "device_auth_tokens" (
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

CREATE INDEX "idx_device_identities_device" ON "device_identities" (("device_id") ASC NULLS FIRST, ("updated_at_ms") DESC NULLS LAST);`,preData:[0,926],postData:[926,1225],tables:[{name:`device_auth_tokens`,identities:[]},{name:`device_identities`,identities:[]},{name:`gateway_origin_device_tokens`,identities:[]}],expectedCatalog:[{table:`device_auth_tokens`,kind:`table`,value:null},{table:`device_auth_tokens`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`device_auth_tokens`,kind:`column`,value:{name:`role`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`device_auth_tokens`,kind:`column`,value:{name:`token`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`device_auth_tokens`,kind:`column`,value:{name:`scopes_json`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`device_auth_tokens`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`device_auth_tokens`,kind:`primaryKey`,value:[`device_id`,`role`]},{table:`device_auth_tokens`,kind:`indexes`,value:2},{table:`device_auth_tokens`,kind:`checks`,value:0},{table:`device_identities`,kind:`table`,value:null},{table:`device_identities`,kind:`column`,value:{name:`identity_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`device_identities`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`device_identities`,kind:`column`,value:{name:`public_key_pem`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`device_identities`,kind:`column`,value:{name:`private_key_pem`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`device_identities`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`device_identities`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`device_identities`,kind:`primaryKey`,value:[`identity_key`]},{table:`device_identities`,kind:`indexes`,value:2},{table:`device_identities`,kind:`checks`,value:0},{table:`gateway_origin_device_tokens`,kind:`table`,value:null},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`gateway_scope`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`role`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`token`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`scopes_json`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`gateway_origin_device_tokens`,kind:`primaryKey`,value:[`gateway_scope`,`device_id`,`role`]},{table:`gateway_origin_device_tokens`,kind:`indexes`,value:1},{table:`gateway_origin_device_tokens`,kind:`checks`,value:0}]};Object.defineProperty(this,"clientCredentialSource",{value:e,enumerable:true,configurable:true,writable:true});return e},get fragments(){const e=[{id:`local_workspace_projections`,tables:[`local_workspace_projections`,`local_workspace_manifest_nodes`,`local_workspace_tree_packs`,`local_workspace_source_path_sets`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

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
`}];Object.defineProperty(this,"fragments",{value:e,enumerable:true,configurable:true,writable:true});return e},get expectedCatalog(){const e=[{table:`acp_replay_events`,kind:`table`,value:null},{table:`acp_replay_events`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`acp_replay_events`,kind:`column`,value:{name:`seq`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`acp_replay_events`,kind:`column`,value:{name:`at`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`acp_replay_events`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`acp_replay_events`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`acp_replay_events`,kind:`column`,value:{name:`update_json`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`acp_replay_events`,kind:`column`,value:{name:`estimated_bytes`,type:`bigint`,nullable:false,identity:false,default:`0`,position:7}},{table:`acp_replay_events`,kind:`primaryKey`,value:[`session_id`,`seq`]},{table:`acp_replay_events`,kind:`foreignKey`,value:{columns:[`session_id`],target:`acp_replay_sessions`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`acp_replay_events`,kind:`indexes`,value:1},{table:`acp_replay_events`,kind:`checks`,value:0},{table:`acp_replay_sessions`,kind:`table`,value:null},{table:`acp_replay_sessions`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`cwd`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`complete`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`next_seq`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`estimated_bytes`,type:`bigint`,nullable:false,identity:false,default:`0`,position:8}},{table:`acp_replay_sessions`,kind:`primaryKey`,value:[`session_id`]},{table:`acp_replay_sessions`,kind:`indexes`,value:3},{table:`acp_replay_sessions`,kind:`checks`,value:0},{table:`acp_sessions`,kind:`table`,value:null},{table:`acp_sessions`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`acp_sessions`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:true,identity:false,default:null,position:2}},{table:`acp_sessions`,kind:`column`,value:{name:`backend`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`acp_sessions`,kind:`column`,value:{name:`agent`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`acp_sessions`,kind:`column`,value:{name:`runtime_session_name`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`acp_sessions`,kind:`column`,value:{name:`identity_json`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`acp_sessions`,kind:`column`,value:{name:`resume_agent_session_id`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`acp_sessions`,kind:`column`,value:{name:`resume_acpx_session_id`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`acp_sessions`,kind:`column`,value:{name:`mode`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`acp_sessions`,kind:`column`,value:{name:`runtime_options_json`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`acp_sessions`,kind:`column`,value:{name:`cwd`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`acp_sessions`,kind:`column`,value:{name:`state`,type:`text`,nullable:false,identity:false,default:null,position:12}},{table:`acp_sessions`,kind:`column`,value:{name:`last_activity_at`,type:`bigint`,nullable:false,identity:false,default:null,position:13}},{table:`acp_sessions`,kind:`column`,value:{name:`last_error`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`acp_sessions`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:false,identity:false,default:null,position:15}},{table:`acp_sessions`,kind:`primaryKey`,value:[`session_key`]},{table:`acp_sessions`,kind:`indexes`,value:5},{table:`acp_sessions`,kind:`checks`,value:0},{table:`agent_database_leases`,kind:`table`,value:null},{table:`agent_database_leases`,kind:`column`,value:{name:`lease_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`agent_database_leases`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`agent_database_leases`,kind:`column`,value:{name:`path`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`agent_database_leases`,kind:`column`,value:{name:`owner_pid`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`agent_database_leases`,kind:`column`,value:{name:`owner_start_time`,type:`bigint`,nullable:true,identity:false,default:null,position:5}},{table:`agent_database_leases`,kind:`column`,value:{name:`opened_at`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`agent_database_leases`,kind:`column`,value:{name:`provenance`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`agent_database_leases`,kind:`primaryKey`,value:[`lease_id`]},{table:`agent_database_leases`,kind:`indexes`,value:1},{table:`agent_database_leases`,kind:`checks`,value:0},{table:`agent_databases`,kind:`table`,value:null},{table:`agent_databases`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`agent_databases`,kind:`column`,value:{name:`path`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`agent_databases`,kind:`column`,value:{name:`schema_version`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`agent_databases`,kind:`column`,value:{name:`last_seen_at`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`agent_databases`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:true,identity:false,default:null,position:5}},{table:`agent_databases`,kind:`primaryKey`,value:[`agent_id`,`path`]},{table:`agent_databases`,kind:`indexes`,value:1},{table:`agent_databases`,kind:`checks`,value:0},{table:`agent_deletion_journal`,kind:`table`,value:null},{table:`agent_deletion_journal`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`operation_id`,type:`text`,nullable:false,identity:false,default:`''`,position:2}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`phase`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`agent_dir`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`workspace_dir`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`sessions_dir`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`database_paths_json`,type:`text`,nullable:false,identity:false,default:`'[]'`,position:7}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`cleanup_paths_json`,type:`text`,nullable:false,identity:false,default:`'[]'`,position:8}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:9}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`cleanup_completed`,type:`bigint`,nullable:false,identity:false,default:`0`,position:10}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`delete_files`,type:`bigint`,nullable:false,identity:false,default:`1`,position:11}},{table:`agent_deletion_journal`,kind:`primaryKey`,value:[`agent_id`]},{table:`agent_deletion_journal`,kind:`indexes`,value:1},{table:`agent_deletion_journal`,kind:`checks`,value:0},{table:`agent_provenance`,kind:`table`,value:null},{table:`agent_provenance`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`agent_provenance`,kind:`column`,value:{name:`created_via`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`agent_provenance`,kind:`column`,value:{name:`creator_agent_id`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`agent_provenance`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`agent_provenance`,kind:`primaryKey`,value:[`agent_id`]},{table:`agent_provenance`,kind:`indexes`,value:1},{table:`agent_provenance`,kind:`checks`,value:1},{table:`apns_registration_tombstones`,kind:`table`,value:null},{table:`apns_registration_tombstones`,kind:`column`,value:{name:`node_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`apns_registration_tombstones`,kind:`column`,value:{name:`deleted_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`apns_registration_tombstones`,kind:`primaryKey`,value:[`node_id`]},{table:`apns_registration_tombstones`,kind:`indexes`,value:1},{table:`apns_registration_tombstones`,kind:`checks`,value:0},{table:`apns_registrations`,kind:`table`,value:null},{table:`apns_registrations`,kind:`column`,value:{name:`node_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`apns_registrations`,kind:`column`,value:{name:`transport`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`apns_registrations`,kind:`column`,value:{name:`token`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`apns_registrations`,kind:`column`,value:{name:`relay_handle`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`apns_registrations`,kind:`column`,value:{name:`send_grant`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`apns_registrations`,kind:`column`,value:{name:`installation_id`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`apns_registrations`,kind:`column`,value:{name:`relay_origin`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`apns_registrations`,kind:`column`,value:{name:`topic`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`apns_registrations`,kind:`column`,value:{name:`environment`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`apns_registrations`,kind:`column`,value:{name:`distribution`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`apns_registrations`,kind:`column`,value:{name:`token_debug_suffix`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`apns_registrations`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:12}},{table:`apns_registrations`,kind:`primaryKey`,value:[`node_id`]},{table:`apns_registrations`,kind:`indexes`,value:2},{table:`apns_registrations`,kind:`checks`,value:0},{table:`audit_events`,kind:`table`,value:null},{table:`audit_events`,kind:`column`,value:{name:`sequence`,type:`bigint`,nullable:false,identity:true,default:null,position:1}},{table:`audit_events`,kind:`column`,value:{name:`event_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`audit_events`,kind:`column`,value:{name:`source_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`audit_events`,kind:`column`,value:{name:`schema_version`,type:`bigint`,nullable:false,identity:false,default:`1`,position:4}},{table:`audit_events`,kind:`column`,value:{name:`source_sequence`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`audit_events`,kind:`column`,value:{name:`occurred_at`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`audit_events`,kind:`column`,value:{name:`kind`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`audit_events`,kind:`column`,value:{name:`action`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`audit_events`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`audit_events`,kind:`column`,value:{name:`error_code`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`audit_events`,kind:`column`,value:{name:`actor_type`,type:`text`,nullable:false,identity:false,default:null,position:11}},{table:`audit_events`,kind:`column`,value:{name:`actor_id`,type:`text`,nullable:false,identity:false,default:null,position:12}},{table:`audit_events`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:true,identity:false,default:null,position:13}},{table:`audit_events`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`audit_events`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:true,identity:false,default:null,position:15}},{table:`audit_events`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:true,identity:false,default:null,position:16}},{table:`audit_events`,kind:`column`,value:{name:`tool_call_id`,type:`text`,nullable:true,identity:false,default:null,position:17}},{table:`audit_events`,kind:`column`,value:{name:`tool_name`,type:`text`,nullable:true,identity:false,default:null,position:18}},{table:`audit_events`,kind:`column`,value:{name:`direction`,type:`text`,nullable:true,identity:false,default:null,position:19}},{table:`audit_events`,kind:`column`,value:{name:`channel`,type:`text`,nullable:true,identity:false,default:null,position:20}},{table:`audit_events`,kind:`column`,value:{name:`conversation_kind`,type:`text`,nullable:true,identity:false,default:null,position:21}},{table:`audit_events`,kind:`column`,value:{name:`message_outcome`,type:`text`,nullable:true,identity:false,default:null,position:22}},{table:`audit_events`,kind:`column`,value:{name:`reason_code`,type:`text`,nullable:true,identity:false,default:null,position:23}},{table:`audit_events`,kind:`column`,value:{name:`delivery_kind`,type:`text`,nullable:true,identity:false,default:null,position:24}},{table:`audit_events`,kind:`column`,value:{name:`failure_stage`,type:`text`,nullable:true,identity:false,default:null,position:25}},{table:`audit_events`,kind:`column`,value:{name:`duration_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:26}},{table:`audit_events`,kind:`column`,value:{name:`result_count`,type:`bigint`,nullable:true,identity:false,default:null,position:27}},{table:`audit_events`,kind:`column`,value:{name:`account_ref`,type:`text`,nullable:true,identity:false,default:null,position:28}},{table:`audit_events`,kind:`column`,value:{name:`conversation_ref`,type:`text`,nullable:true,identity:false,default:null,position:29}},{table:`audit_events`,kind:`column`,value:{name:`message_ref`,type:`text`,nullable:true,identity:false,default:null,position:30}},{table:`audit_events`,kind:`column`,value:{name:`target_ref`,type:`text`,nullable:true,identity:false,default:null,position:31}},{table:`audit_events`,kind:`primaryKey`,value:[`sequence`]},{table:`audit_events`,kind:`unique`,value:[`event_id`]},{table:`audit_events`,kind:`unique`,value:[`source_id`]},{table:`audit_events`,kind:`indexes`,value:11},{table:`audit_events`,kind:`checks`,value:0},{table:`audit_identity_keys`,kind:`table`,value:null},{table:`audit_identity_keys`,kind:`column`,value:{name:`id`,type:`bigint`,nullable:false,identity:true,default:null,position:1}},{table:`audit_identity_keys`,kind:`column`,value:{name:`key_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`audit_identity_keys`,kind:`column`,value:{name:`key`,type:`bytea`,nullable:false,identity:false,default:null,position:3}},{table:`audit_identity_keys`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`audit_identity_keys`,kind:`primaryKey`,value:[`id`]},{table:`audit_identity_keys`,kind:`indexes`,value:1},{table:`audit_identity_keys`,kind:`checks`,value:1},{table:`backup_runs`,kind:`table`,value:null},{table:`backup_runs`,kind:`column`,value:{name:`id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`backup_runs`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`backup_runs`,kind:`column`,value:{name:`archive_path`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`backup_runs`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`backup_runs`,kind:`column`,value:{name:`manifest_json`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`backup_runs`,kind:`primaryKey`,value:[`id`]},{table:`backup_runs`,kind:`indexes`,value:2},{table:`backup_runs`,kind:`checks`,value:0},{table:`capture_blobs`,kind:`table`,value:null},{table:`capture_blobs`,kind:`column`,value:{name:`blob_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`capture_blobs`,kind:`column`,value:{name:`content_type`,type:`text`,nullable:true,identity:false,default:null,position:2}},{table:`capture_blobs`,kind:`column`,value:{name:`encoding`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`capture_blobs`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`capture_blobs`,kind:`column`,value:{name:`sha256`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`capture_blobs`,kind:`column`,value:{name:`data`,type:`bytea`,nullable:false,identity:false,default:null,position:6}},{table:`capture_blobs`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`capture_blobs`,kind:`primaryKey`,value:[`blob_id`]},{table:`capture_blobs`,kind:`indexes`,value:1},{table:`capture_blobs`,kind:`checks`,value:0},{table:`capture_events`,kind:`table`,value:null},{table:`capture_events`,kind:`column`,value:{name:`id`,type:`bigint`,nullable:false,identity:true,default:null,position:1}},{table:`capture_events`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`capture_events`,kind:`column`,value:{name:`ts`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`capture_events`,kind:`column`,value:{name:`source_scope`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`capture_events`,kind:`column`,value:{name:`source_process`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`capture_events`,kind:`column`,value:{name:`protocol`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`capture_events`,kind:`column`,value:{name:`direction`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`capture_events`,kind:`column`,value:{name:`kind`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`capture_events`,kind:`column`,value:{name:`flow_id`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`capture_events`,kind:`column`,value:{name:`method`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`capture_events`,kind:`column`,value:{name:`host`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`capture_events`,kind:`column`,value:{name:`path`,type:`text`,nullable:true,identity:false,default:null,position:12}},{table:`capture_events`,kind:`column`,value:{name:`status`,type:`bigint`,nullable:true,identity:false,default:null,position:13}},{table:`capture_events`,kind:`column`,value:{name:`close_code`,type:`bigint`,nullable:true,identity:false,default:null,position:14}},{table:`capture_events`,kind:`column`,value:{name:`content_type`,type:`text`,nullable:true,identity:false,default:null,position:15}},{table:`capture_events`,kind:`column`,value:{name:`headers_json`,type:`text`,nullable:true,identity:false,default:null,position:16}},{table:`capture_events`,kind:`column`,value:{name:`data_text`,type:`text`,nullable:true,identity:false,default:null,position:17}},{table:`capture_events`,kind:`column`,value:{name:`data_blob_id`,type:`text`,nullable:true,identity:false,default:null,position:18}},{table:`capture_events`,kind:`column`,value:{name:`data_sha256`,type:`text`,nullable:true,identity:false,default:null,position:19}},{table:`capture_events`,kind:`column`,value:{name:`error_text`,type:`text`,nullable:true,identity:false,default:null,position:20}},{table:`capture_events`,kind:`column`,value:{name:`meta_json`,type:`text`,nullable:true,identity:false,default:null,position:21}},{table:`capture_events`,kind:`primaryKey`,value:[`id`]},{table:`capture_events`,kind:`foreignKey`,value:{columns:[`data_blob_id`],target:`capture_blobs`,targetColumns:[`blob_id`],onUpdate:`NO ACTION`,onDelete:`SET NULL`,deferrable:false,deferred:false}},{table:`capture_events`,kind:`foreignKey`,value:{columns:[`session_id`],target:`capture_sessions`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`capture_events`,kind:`indexes`,value:3},{table:`capture_events`,kind:`checks`,value:0},{table:`capture_sessions`,kind:`table`,value:null},{table:`capture_sessions`,kind:`column`,value:{name:`id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`capture_sessions`,kind:`column`,value:{name:`started_at`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`capture_sessions`,kind:`column`,value:{name:`ended_at`,type:`bigint`,nullable:true,identity:false,default:null,position:3}},{table:`capture_sessions`,kind:`column`,value:{name:`mode`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`capture_sessions`,kind:`column`,value:{name:`source_scope`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`capture_sessions`,kind:`column`,value:{name:`source_process`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`capture_sessions`,kind:`column`,value:{name:`proxy_url`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`capture_sessions`,kind:`primaryKey`,value:[`id`]},{table:`capture_sessions`,kind:`indexes`,value:1},{table:`capture_sessions`,kind:`checks`,value:0},{table:`channel_ingress_events`,kind:`table`,value:null},{table:`channel_ingress_events`,kind:`column`,value:{name:`queue_name`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`channel_ingress_events`,kind:`column`,value:{name:`event_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`channel_ingress_events`,kind:`column`,value:{name:`channel_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`channel_ingress_events`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`channel_ingress_events`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`channel_ingress_events`,kind:`column`,value:{name:`lane_key`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`channel_ingress_events`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`channel_ingress_events`,kind:`column`,value:{name:`metadata_json`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`channel_ingress_events`,kind:`column`,value:{name:`received_at`,type:`bigint`,nullable:false,identity:false,default:null,position:9}},{table:`channel_ingress_events`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`channel_ingress_events`,kind:`column`,value:{name:`claim_token`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`channel_ingress_events`,kind:`column`,value:{name:`claim_owner`,type:`text`,nullable:true,identity:false,default:null,position:12}},{table:`channel_ingress_events`,kind:`column`,value:{name:`claimed_at`,type:`bigint`,nullable:true,identity:false,default:null,position:13}},{table:`channel_ingress_events`,kind:`column`,value:{name:`attempts`,type:`bigint`,nullable:false,identity:false,default:`0`,position:14}},{table:`channel_ingress_events`,kind:`column`,value:{name:`last_attempt_at`,type:`bigint`,nullable:true,identity:false,default:null,position:15}},{table:`channel_ingress_events`,kind:`column`,value:{name:`last_error`,type:`text`,nullable:true,identity:false,default:null,position:16}},{table:`channel_ingress_events`,kind:`column`,value:{name:`failed_reason`,type:`text`,nullable:true,identity:false,default:null,position:17}},{table:`channel_ingress_events`,kind:`column`,value:{name:`failed_at`,type:`bigint`,nullable:true,identity:false,default:null,position:18}},{table:`channel_ingress_events`,kind:`column`,value:{name:`completed_at`,type:`bigint`,nullable:true,identity:false,default:null,position:19}},{table:`channel_ingress_events`,kind:`column`,value:{name:`completed_metadata_json`,type:`text`,nullable:true,identity:false,default:null,position:20}},{table:`channel_ingress_events`,kind:`primaryKey`,value:[`queue_name`,`event_id`]},{table:`channel_ingress_events`,kind:`indexes`,value:4},{table:`channel_ingress_events`,kind:`checks`,value:0},{table:`channel_pairing_allow_entries`,kind:`table`,value:null},{table:`channel_pairing_allow_entries`,kind:`column`,value:{name:`channel_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`channel_pairing_allow_entries`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`channel_pairing_allow_entries`,kind:`column`,value:{name:`entry`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`channel_pairing_allow_entries`,kind:`column`,value:{name:`sort_order`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`channel_pairing_allow_entries`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`channel_pairing_allow_entries`,kind:`primaryKey`,value:[`channel_key`,`account_id`,`entry`]},{table:`channel_pairing_allow_entries`,kind:`indexes`,value:2},{table:`channel_pairing_allow_entries`,kind:`checks`,value:0},{table:`channel_pairing_requests`,kind:`table`,value:null},{table:`channel_pairing_requests`,kind:`column`,value:{name:`channel_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`code`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`created_at`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`last_seen_at`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`meta_json`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`channel_pairing_requests`,kind:`primaryKey`,value:[`channel_key`,`account_id`,`request_id`]},{table:`channel_pairing_requests`,kind:`indexes`,value:3},{table:`channel_pairing_requests`,kind:`checks`,value:0},{table:`clawhub_promotion_claims`,kind:`table`,value:null},{table:`clawhub_promotion_claims`,kind:`column`,value:{name:`slug`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`clawhub_promotion_claims`,kind:`column`,value:{name:`provider`,type:`text`,nullable:true,identity:false,default:null,position:2}},{table:`clawhub_promotion_claims`,kind:`column`,value:{name:`model_keys_json`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`clawhub_promotion_claims`,kind:`column`,value:{name:`ends_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`clawhub_promotion_claims`,kind:`column`,value:{name:`claimed_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`clawhub_promotion_claims`,kind:`primaryKey`,value:[`slug`]},{table:`clawhub_promotion_claims`,kind:`indexes`,value:1},{table:`clawhub_promotion_claims`,kind:`checks`,value:0},{table:`config_health_entries`,kind:`table`,value:null},{table:`config_health_entries`,kind:`column`,value:{name:`config_path`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`config_health_entries`,kind:`column`,value:{name:`last_known_good_json`,type:`text`,nullable:true,identity:false,default:null,position:2}},{table:`config_health_entries`,kind:`column`,value:{name:`last_promoted_good_json`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`config_health_entries`,kind:`column`,value:{name:`last_observed_suspicious_signature`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`config_health_entries`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`config_health_entries`,kind:`primaryKey`,value:[`config_path`]},{table:`config_health_entries`,kind:`indexes`,value:1},{table:`config_health_entries`,kind:`checks`,value:0},{table:`config_machine_state`,kind:`table`,value:null},{table:`config_machine_state`,kind:`column`,value:{name:`state_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`config_machine_state`,kind:`column`,value:{name:`value_json`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`config_machine_state`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`config_machine_state`,kind:`primaryKey`,value:[`state_key`]},{table:`config_machine_state`,kind:`indexes`,value:1},{table:`config_machine_state`,kind:`checks`,value:0},{table:`config_revision_keys`,kind:`table`,value:null},{table:`config_revision_keys`,kind:`column`,value:{name:`id`,type:`bigint`,nullable:false,identity:true,default:null,position:1}},{table:`config_revision_keys`,kind:`column`,value:{name:`hmac_key`,type:`bytea`,nullable:false,identity:false,default:null,position:2}},{table:`config_revision_keys`,kind:`primaryKey`,value:[`id`]},{table:`config_revision_keys`,kind:`indexes`,value:1},{table:`config_revision_keys`,kind:`checks`,value:2},{table:`cron_job_runtime_authorities`,kind:`table`,value:null},{table:`cron_job_runtime_authorities`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`cron_job_runtime_authorities`,kind:`column`,value:{name:`job_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`cron_job_runtime_authorities`,kind:`column`,value:{name:`authority_json`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`cron_job_runtime_authorities`,kind:`column`,value:{name:`authority_input_fingerprint`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`cron_job_runtime_authorities`,kind:`column`,value:{name:`recovery_required`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`cron_job_runtime_authorities`,kind:`primaryKey`,value:[`store_key`,`job_id`]},{table:`cron_job_runtime_authorities`,kind:`foreignKey`,value:{columns:[`store_key`,`job_id`],target:`cron_jobs`,targetColumns:[`store_key`,`job_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`cron_job_runtime_authorities`,kind:`indexes`,value:1},{table:`cron_job_runtime_authorities`,kind:`checks`,value:2},{table:`cron_job_scratch`,kind:`table`,value:null},{table:`cron_job_scratch`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`cron_job_scratch`,kind:`column`,value:{name:`job_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`cron_job_scratch`,kind:`column`,value:{name:`content`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`cron_job_scratch`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`cron_job_scratch`,kind:`column`,value:{name:`source_sha256`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`cron_job_scratch`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`cron_job_scratch`,kind:`primaryKey`,value:[`store_key`,`job_id`]},{table:`cron_job_scratch`,kind:`indexes`,value:2},{table:`cron_job_scratch`,kind:`checks`,value:2},{table:`cron_jobs`,kind:`table`,value:null},{table:`cron_jobs`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`cron_jobs`,kind:`column`,value:{name:`job_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`cron_jobs`,kind:`column`,value:{name:`declaration_key`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`cron_jobs`,kind:`column`,value:{name:`owner_agent_id`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`cron_jobs`,kind:`column`,value:{name:`name`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`cron_jobs`,kind:`column`,value:{name:`description`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`cron_jobs`,kind:`column`,value:{name:`enabled`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`cron_jobs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`cron_jobs`,kind:`column`,value:{name:`payload_kind`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`cron_jobs`,kind:`column`,value:{name:`job_json`,type:`text`,nullable:false,identity:false,default:null,position:10}},{table:`cron_jobs`,kind:`column`,value:{name:`grant_definition_revision`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`cron_jobs`,kind:`column`,value:{name:`grant_definition_generation`,type:`bigint`,nullable:true,identity:false,default:null,position:12}},{table:`cron_jobs`,kind:`column`,value:{name:`grant_definition_updated_at`,type:`bigint`,nullable:true,identity:false,default:null,position:13}},{table:`cron_jobs`,kind:`column`,value:{name:`state_json`,type:`text`,nullable:false,identity:false,default:`'{}'`,position:14}},{table:`cron_jobs`,kind:`column`,value:{name:`runtime_updated_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:15}},{table:`cron_jobs`,kind:`column`,value:{name:`schedule_identity`,type:`text`,nullable:true,identity:false,default:null,position:16}},{table:`cron_jobs`,kind:`column`,value:{name:`sort_order`,type:`bigint`,nullable:false,identity:false,default:`0`,position:17}},{table:`cron_jobs`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:false,identity:false,default:null,position:18}},{table:`cron_jobs`,kind:`primaryKey`,value:[`store_key`,`job_id`]},{table:`cron_jobs`,kind:`indexes`,value:2},{table:`cron_jobs`,kind:`checks`,value:0},{table:`cron_run_receipts`,kind:`table`,value:null},{table:`cron_run_receipts`,kind:`column`,value:{name:`cursor_id`,type:`bigint`,nullable:false,identity:false,default:null,position:1}},{table:`cron_run_receipts`,kind:`column`,value:{name:`receipt_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`cron_run_receipts`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`cron_run_receipts`,kind:`column`,value:{name:`job_id`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`cron_run_receipts`,kind:`column`,value:{name:`config_revision`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`cron_run_receipts`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`cron_run_receipts`,kind:`column`,value:{name:`request_run_id`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`cron_run_receipts`,kind:`column`,value:{name:`delivery_attempt_state`,type:`text`,nullable:false,identity:false,default:`'unknown'`,position:8}},{table:`cron_run_receipts`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`cron_run_receipts`,kind:`column`,value:{name:`owner_pid`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`cron_run_receipts`,kind:`column`,value:{name:`owner_start_time`,type:`bigint`,nullable:true,identity:false,default:null,position:11}},{table:`cron_run_receipts`,kind:`column`,value:{name:`started_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:12}},{table:`cron_run_receipts`,kind:`column`,value:{name:`finished_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:13}},{table:`cron_run_receipts`,kind:`column`,value:{name:`error_text`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`cron_run_receipts`,kind:`primaryKey`,value:[`receipt_id`]},{table:`cron_run_receipts`,kind:`indexes`,value:4},{table:`cron_run_receipts`,kind:`checks`,value:3},{table:`cron_run_trigger_state_retirements`,kind:`table`,value:null},{table:`cron_run_trigger_state_retirements`,kind:`column`,value:{name:`receipt_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`cron_run_trigger_state_retirements`,kind:`primaryKey`,value:[`receipt_id`]},{table:`cron_run_trigger_state_retirements`,kind:`foreignKey`,value:{columns:[`receipt_id`],target:`cron_run_receipts`,targetColumns:[`receipt_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`cron_run_trigger_state_retirements`,kind:`indexes`,value:1},{table:`cron_run_trigger_state_retirements`,kind:`checks`,value:0},{table:`current_conversation_bindings`,kind:`table`,value:null},{table:`current_conversation_bindings`,kind:`column`,value:{name:`binding_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`binding_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`target_session_key`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`channel`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`conversation_kind`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`parent_conversation_id`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`conversation_id`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`target_kind`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:10}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`bound_at`,type:`bigint`,nullable:false,identity:false,default:null,position:11}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:true,identity:false,default:null,position:12}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`metadata_json`,type:`text`,nullable:true,identity:false,default:null,position:13}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`record_json`,type:`text`,nullable:false,identity:false,default:null,position:14}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:false,identity:false,default:null,position:15}},{table:`current_conversation_bindings`,kind:`primaryKey`,value:[`binding_key`]},{table:`current_conversation_bindings`,kind:`indexes`,value:4},{table:`current_conversation_bindings`,kind:`checks`,value:0},{table:`delivery_queue_entries`,kind:`table`,value:null},{table:`delivery_queue_entries`,kind:`column`,value:{name:`queue_name`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`entry_kind`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`channel`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`target`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`retry_count`,type:`bigint`,nullable:false,identity:false,default:`0`,position:9}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`last_attempt_at`,type:`bigint`,nullable:true,identity:false,default:null,position:10}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`last_error`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`recovery_state`,type:`text`,nullable:true,identity:false,default:null,position:12}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`platform_send_started_at`,type:`bigint`,nullable:true,identity:false,default:null,position:13}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`entry_json`,type:`text`,nullable:false,identity:false,default:null,position:14}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`retention_id_prefix`,type:`text`,nullable:true,identity:false,default:null,position:15}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`retention_max_age_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:16}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`retention_max_entries`,type:`bigint`,nullable:true,identity:false,default:null,position:17}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`enqueued_at`,type:`bigint`,nullable:false,identity:false,default:null,position:18}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:false,identity:false,default:null,position:19}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`failed_at`,type:`bigint`,nullable:true,identity:false,default:null,position:20}},{table:`delivery_queue_entries`,kind:`primaryKey`,value:[`queue_name`,`id`]},{table:`delivery_queue_entries`,kind:`indexes`,value:6},{table:`delivery_queue_entries`,kind:`checks`,value:0},{table:`device_bootstrap_tokens`,kind:`table`,value:null},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`token_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`token`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`setup_id`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`ts`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`public_key`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`profile_json`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`redeemed_profile_json`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`pending_profile_json`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`issued_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`last_used_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:11}},{table:`device_bootstrap_tokens`,kind:`primaryKey`,value:[`token_key`]},{table:`device_bootstrap_tokens`,kind:`indexes`,value:2},{table:`device_bootstrap_tokens`,kind:`checks`,value:0},{table:`device_pair_setup_completions`,kind:`table`,value:null},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`setup_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`device_name`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`access`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`completed_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`delivery_state`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`retain_until_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`device_pair_setup_completions`,kind:`primaryKey`,value:[`setup_id`]},{table:`device_pair_setup_completions`,kind:`indexes`,value:1},{table:`device_pair_setup_completions`,kind:`checks`,value:1},{table:`device_pairing_browser_requests`,kind:`table`,value:null},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`code`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`public_key`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`remote_ip`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`user_agent`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`origin`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`approved_token_sha256`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:11}},{table:`device_pairing_browser_requests`,kind:`primaryKey`,value:[`request_id`]},{table:`device_pairing_browser_requests`,kind:`unique`,value:[`code`]},{table:`device_pairing_browser_requests`,kind:`unique`,value:[`device_id`]},{table:`device_pairing_browser_requests`,kind:`indexes`,value:3},{table:`device_pairing_browser_requests`,kind:`checks`,value:1},{table:`device_pairing_join_codes`,kind:`table`,value:null},{table:`device_pairing_join_codes`,kind:`column`,value:{name:`shortcode`,type:`text`,nullable:true,identity:false,default:null,position:1}},{table:`device_pairing_join_codes`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:true,identity:false,default:null,position:2}},{table:`device_pairing_join_codes`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:3}},{table:`device_pairing_join_codes`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:4}},{table:`device_pairing_join_codes`,kind:`indexes`,value:0},{table:`device_pairing_join_codes`,kind:`checks`,value:0},{table:`device_pairing_paired`,kind:`table`,value:null},{table:`device_pairing_paired`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`device_pairing_paired`,kind:`column`,value:{name:`public_key`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`device_pairing_paired`,kind:`column`,value:{name:`display_name`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`device_pairing_paired`,kind:`column`,value:{name:`operator_label`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`device_pairing_paired`,kind:`column`,value:{name:`platform`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`device_pairing_paired`,kind:`column`,value:{name:`device_family`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`device_pairing_paired`,kind:`column`,value:{name:`client_id`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`device_pairing_paired`,kind:`column`,value:{name:`client_mode`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`device_pairing_paired`,kind:`column`,value:{name:`browser_origin`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`device_pairing_paired`,kind:`column`,value:{name:`role`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`device_pairing_paired`,kind:`column`,value:{name:`roles_json`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`device_pairing_paired`,kind:`column`,value:{name:`scopes_json`,type:`text`,nullable:true,identity:false,default:null,position:12}},{table:`device_pairing_paired`,kind:`column`,value:{name:`approved_scopes_json`,type:`text`,nullable:true,identity:false,default:null,position:13}},{table:`device_pairing_paired`,kind:`column`,value:{name:`remote_ip`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`device_pairing_paired`,kind:`column`,value:{name:`tokens_json`,type:`text`,nullable:true,identity:false,default:null,position:15}},{table:`device_pairing_paired`,kind:`column`,value:{name:`approved_via`,type:`text`,nullable:true,identity:false,default:null,position:16}},{table:`device_pairing_paired`,kind:`column`,value:{name:`node_surface_json`,type:`text`,nullable:true,identity:false,default:null,position:17}},{table:`device_pairing_paired`,kind:`column`,value:{name:`pending_node_surface_json`,type:`text`,nullable:true,identity:false,default:null,position:18}},{table:`device_pairing_paired`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:19}},{table:`device_pairing_paired`,kind:`column`,value:{name:`approved_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:20}},{table:`device_pairing_paired`,kind:`column`,value:{name:`last_seen_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:21}},{table:`device_pairing_paired`,kind:`column`,value:{name:`last_seen_reason`,type:`text`,nullable:true,identity:false,default:null,position:22}},{table:`device_pairing_paired`,kind:`primaryKey`,value:[`device_id`]},{table:`device_pairing_paired`,kind:`indexes`,value:2},{table:`device_pairing_paired`,kind:`checks`,value:0},{table:`device_pairing_pending`,kind:`table`,value:null},{table:`device_pairing_pending`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`device_pairing_pending`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`device_pairing_pending`,kind:`column`,value:{name:`public_key`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`device_pairing_pending`,kind:`column`,value:{name:`display_name`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`device_pairing_pending`,kind:`column`,value:{name:`platform`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`device_pairing_pending`,kind:`column`,value:{name:`device_family`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`device_pairing_pending`,kind:`column`,value:{name:`client_id`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`device_pairing_pending`,kind:`column`,value:{name:`client_mode`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`device_pairing_pending`,kind:`column`,value:{name:`browser_origin`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`device_pairing_pending`,kind:`column`,value:{name:`role`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`device_pairing_pending`,kind:`column`,value:{name:`roles_json`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`device_pairing_pending`,kind:`column`,value:{name:`scopes_json`,type:`text`,nullable:true,identity:false,default:null,position:12}},{table:`device_pairing_pending`,kind:`column`,value:{name:`remote_ip`,type:`text`,nullable:true,identity:false,default:null,position:13}},{table:`device_pairing_pending`,kind:`column`,value:{name:`silent`,type:`bigint`,nullable:true,identity:false,default:null,position:14}},{table:`device_pairing_pending`,kind:`column`,value:{name:`is_repair`,type:`bigint`,nullable:true,identity:false,default:null,position:15}},{table:`device_pairing_pending`,kind:`column`,value:{name:`ts`,type:`bigint`,nullable:false,identity:false,default:null,position:16}},{table:`device_pairing_pending`,kind:`column`,value:{name:`refreshed_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:17}},{table:`device_pairing_pending`,kind:`primaryKey`,value:[`request_id`]},{table:`device_pairing_pending`,kind:`indexes`,value:2},{table:`device_pairing_pending`,kind:`checks`,value:0},{table:`diagnostic_events`,kind:`table`,value:null},{table:`diagnostic_events`,kind:`column`,value:{name:`scope`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`diagnostic_events`,kind:`column`,value:{name:`event_key`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`diagnostic_events`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`diagnostic_events`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`diagnostic_events`,kind:`column`,value:{name:`sequence`,type:`bigint`,nullable:false,identity:false,default:`0`,position:5}},{table:`diagnostic_events`,kind:`primaryKey`,value:[`scope`,`event_key`]},{table:`diagnostic_events`,kind:`indexes`,value:2},{table:`diagnostic_events`,kind:`checks`,value:0},{table:`durable_background_processes`,kind:`table`,value:null},{table:`durable_background_processes`,kind:`column`,value:{name:`id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`durable_background_processes`,kind:`column`,value:{name:`record_json`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`durable_background_processes`,kind:`primaryKey`,value:[`id`]},{table:`durable_background_processes`,kind:`indexes`,value:1},{table:`durable_background_processes`,kind:`checks`,value:0},{table:`exec_approvals_config`,kind:`table`,value:null},{table:`exec_approvals_config`,kind:`column`,value:{name:`config_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`exec_approvals_config`,kind:`column`,value:{name:`raw_json`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`exec_approvals_config`,kind:`column`,value:{name:`socket_path`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`exec_approvals_config`,kind:`column`,value:{name:`has_socket_token`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`exec_approvals_config`,kind:`column`,value:{name:`default_security`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`exec_approvals_config`,kind:`column`,value:{name:`default_ask`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`exec_approvals_config`,kind:`column`,value:{name:`default_ask_fallback`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`exec_approvals_config`,kind:`column`,value:{name:`auto_allow_skills`,type:`bigint`,nullable:true,identity:false,default:null,position:8}},{table:`exec_approvals_config`,kind:`column`,value:{name:`agent_count`,type:`bigint`,nullable:false,identity:false,default:null,position:9}},{table:`exec_approvals_config`,kind:`column`,value:{name:`allowlist_count`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`exec_approvals_config`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:11}},{table:`exec_approvals_config`,kind:`primaryKey`,value:[`config_key`]},{table:`exec_approvals_config`,kind:`indexes`,value:1},{table:`exec_approvals_config`,kind:`checks`,value:0},{table:`execution_decision_facts`,kind:`table`,value:null},{table:`execution_decision_facts`,kind:`column`,value:{name:`cursor_id`,type:`bigint`,nullable:false,identity:false,default:null,position:1}},{table:`execution_decision_facts`,kind:`column`,value:{name:`receipt_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`execution_decision_facts`,kind:`column`,value:{name:`context_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`execution_decision_facts`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`execution_decision_facts`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`execution_decision_facts`,kind:`column`,value:{name:`action_id`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`execution_decision_facts`,kind:`column`,value:{name:`action_family`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`execution_decision_facts`,kind:`column`,value:{name:`decision_outcome`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`execution_decision_facts`,kind:`column`,value:{name:`coverage_state`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`execution_decision_facts`,kind:`column`,value:{name:`reason_code`,type:`text`,nullable:false,identity:false,default:null,position:10}},{table:`execution_decision_facts`,kind:`column`,value:{name:`owner`,type:`text`,nullable:false,identity:false,default:null,position:11}},{table:`execution_decision_facts`,kind:`column`,value:{name:`source_ref`,type:`text`,nullable:false,identity:false,default:null,position:12}},{table:`execution_decision_facts`,kind:`column`,value:{name:`occurred_at`,type:`bigint`,nullable:false,identity:false,default:null,position:13}},{table:`execution_decision_facts`,kind:`column`,value:{name:`receipt_bytes`,type:`bigint`,nullable:false,identity:false,default:null,position:14}},{table:`execution_decision_facts`,kind:`column`,value:{name:`receipt_json`,type:`text`,nullable:false,identity:false,default:null,position:15}},{table:`execution_decision_facts`,kind:`primaryKey`,value:[`receipt_id`]},{table:`execution_decision_facts`,kind:`unique`,value:[`occurred_at`,`receipt_id`]},{table:`execution_decision_facts`,kind:`indexes`,value:5},{table:`execution_decision_facts`,kind:`checks`,value:14},{table:`execution_identity_contexts`,kind:`table`,value:null},{table:`execution_identity_contexts`,kind:`column`,value:{name:`context_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`coverage_state`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`context_bytes`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`context_json`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`execution_identity_contexts`,kind:`primaryKey`,value:[`context_id`]},{table:`execution_identity_contexts`,kind:`unique`,value:[`execution_id`]},{table:`execution_identity_contexts`,kind:`unique`,value:[`created_at`,`context_id`]},{table:`execution_identity_contexts`,kind:`indexes`,value:4},{table:`execution_identity_contexts`,kind:`checks`,value:7},{table:`execution_owner_lifecycle_bindings`,kind:`table`,value:null},{table:`execution_owner_lifecycle_bindings`,kind:`column`,value:{name:`owner_kind`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`execution_owner_lifecycle_bindings`,kind:`column`,value:{name:`owner_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`execution_owner_lifecycle_bindings`,kind:`column`,value:{name:`context_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`execution_owner_lifecycle_bindings`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`execution_owner_lifecycle_bindings`,kind:`primaryKey`,value:[`owner_kind`,`owner_id`]},{table:`execution_owner_lifecycle_bindings`,kind:`indexes`,value:1},{table:`execution_owner_lifecycle_bindings`,kind:`checks`,value:0},{table:`flow_runs`,kind:`table`,value:null},{table:`flow_runs`,kind:`column`,value:{name:`flow_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`flow_runs`,kind:`column`,value:{name:`shape`,type:`text`,nullable:true,identity:false,default:null,position:2}},{table:`flow_runs`,kind:`column`,value:{name:`sync_mode`,type:`text`,nullable:false,identity:false,default:`'managed'`,position:3}},{table:`flow_runs`,kind:`column`,value:{name:`owner_key`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`flow_runs`,kind:`column`,value:{name:`requester_origin_json`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`flow_runs`,kind:`column`,value:{name:`controller_id`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`flow_runs`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:false,identity:false,default:`0`,position:7}},{table:`flow_runs`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`flow_runs`,kind:`column`,value:{name:`notify_policy`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`flow_runs`,kind:`column`,value:{name:`goal`,type:`text`,nullable:false,identity:false,default:null,position:10}},{table:`flow_runs`,kind:`column`,value:{name:`current_step`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`flow_runs`,kind:`column`,value:{name:`blocked_task_id`,type:`text`,nullable:true,identity:false,default:null,position:12}},{table:`flow_runs`,kind:`column`,value:{name:`blocked_summary`,type:`text`,nullable:true,identity:false,default:null,position:13}},{table:`flow_runs`,kind:`column`,value:{name:`state_json`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`flow_runs`,kind:`column`,value:{name:`wait_json`,type:`text`,nullable:true,identity:false,default:null,position:15}},{table:`flow_runs`,kind:`column`,value:{name:`cancel_requested_at`,type:`bigint`,nullable:true,identity:false,default:null,position:16}},{table:`flow_runs`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:17}},{table:`flow_runs`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:false,identity:false,default:null,position:18}},{table:`flow_runs`,kind:`column`,value:{name:`ended_at`,type:`bigint`,nullable:true,identity:false,default:null,position:19}},{table:`flow_runs`,kind:`primaryKey`,value:[`flow_id`]},{table:`flow_runs`,kind:`indexes`,value:4},{table:`flow_runs`,kind:`checks`,value:0},{table:`gateway_boot_lifecycle`,kind:`table`,value:null},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`boot_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`pid`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`started_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`completed_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:4}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`outcome`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`startup_reason`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`reason`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`gateway_boot_lifecycle`,kind:`primaryKey`,value:[`boot_id`]},{table:`gateway_boot_lifecycle`,kind:`indexes`,value:2},{table:`gateway_boot_lifecycle`,kind:`checks`,value:0},{table:`gateway_restart_handoff`,kind:`table`,value:null},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`handoff_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`kind`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`version`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`intent_id`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`pid`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`process_instance_id`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:false,identity:false,default:null,position:8}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`reason`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`restart_trace_started_at`,type:`bigint`,nullable:true,identity:false,default:null,position:10}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`restart_trace_last_at`,type:`bigint`,nullable:true,identity:false,default:null,position:11}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`source`,type:`text`,nullable:false,identity:false,default:null,position:12}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`restart_kind`,type:`text`,nullable:false,identity:false,default:null,position:13}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`supervisor_mode`,type:`text`,nullable:false,identity:false,default:null,position:14}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:15}},{table:`gateway_restart_handoff`,kind:`primaryKey`,value:[`handoff_key`]},{table:`gateway_restart_handoff`,kind:`indexes`,value:2},{table:`gateway_restart_handoff`,kind:`checks`,value:0},{table:`gateway_restart_intent`,kind:`table`,value:null},{table:`gateway_restart_intent`,kind:`column`,value:{name:`intent_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`kind`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`pid`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`reason`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`force`,type:`bigint`,nullable:true,identity:false,default:null,position:6}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`wait_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:7}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:8}},{table:`gateway_restart_intent`,kind:`primaryKey`,value:[`intent_key`]},{table:`gateway_restart_intent`,kind:`indexes`,value:1},{table:`gateway_restart_intent`,kind:`checks`,value:0},{table:`gateway_restart_sentinel`,kind:`table`,value:null},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`sentinel_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`version`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`kind`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`ts`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`thread_id`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`delivery_channel`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`delivery_to`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`delivery_account_id`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`message`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`continuation_json`,type:`text`,nullable:true,identity:false,default:null,position:12}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`doctor_hint`,type:`text`,nullable:true,identity:false,default:null,position:13}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`stats_json`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:false,identity:false,default:null,position:15}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:16}},{table:`gateway_restart_sentinel`,kind:`primaryKey`,value:[`sentinel_key`]},{table:`gateway_restart_sentinel`,kind:`indexes`,value:2},{table:`gateway_restart_sentinel`,kind:`checks`,value:0},{table:`github_personal_publication_requests`,kind:`table`,value:null},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`owner_profile_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`connection_generation`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`idempotency_key`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`request_digest`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`worktree_id`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`repository_fingerprint`,type:`text`,nullable:false,identity:false,default:null,position:10}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`identity_source`,type:`text`,nullable:false,identity:false,default:null,position:11}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`identity_profile_id`,type:`text`,nullable:false,identity:false,default:null,position:12}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`identity_account_id`,type:`bigint`,nullable:false,identity:false,default:null,position:13}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`identity_login`,type:`text`,nullable:false,identity:false,default:null,position:14}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`title`,type:`text`,nullable:true,identity:false,default:null,position:15}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`body`,type:`text`,nullable:true,identity:false,default:null,position:16}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:17}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`gateway_instance_id`,type:`text`,nullable:true,identity:false,default:null,position:18}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:true,identity:false,default:null,position:19}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`last_effect`,type:`text`,nullable:true,identity:false,default:null,position:20}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`effect_state`,type:`text`,nullable:true,identity:false,default:null,position:21}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`push_repository`,type:`text`,nullable:false,identity:false,default:null,position:22}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`repository`,type:`text`,nullable:false,identity:false,default:null,position:23}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`branch`,type:`text`,nullable:false,identity:false,default:null,position:24}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`base_branch`,type:`text`,nullable:false,identity:false,default:null,position:25}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`source_head_commit`,type:`text`,nullable:false,identity:false,default:null,position:26}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`source_index_tree`,type:`text`,nullable:false,identity:false,default:null,position:27}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`workspace_tree`,type:`text`,nullable:false,identity:false,default:null,position:28}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`head_commit`,type:`text`,nullable:true,identity:false,default:null,position:29}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`pull_request_url`,type:`text`,nullable:true,identity:false,default:null,position:30}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`error_code`,type:`text`,nullable:true,identity:false,default:null,position:31}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`next_action`,type:`text`,nullable:true,identity:false,default:null,position:32}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:33}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:34}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`reported_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:35}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`draft`,type:`bigint`,nullable:true,identity:false,default:null,position:36}},{table:`github_personal_publication_requests`,kind:`primaryKey`,value:[`request_id`]},{table:`github_personal_publication_requests`,kind:`unique`,value:[`owner_profile_id`,`session_id`,`idempotency_key`]},{table:`github_personal_publication_requests`,kind:`indexes`,value:4},{table:`github_personal_publication_requests`,kind:`checks`,value:37},{table:`github_publication_requests`,kind:`table`,value:null},{table:`github_publication_requests`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`github_publication_requests`,kind:`column`,value:{name:`idempotency_key`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`github_publication_requests`,kind:`column`,value:{name:`request_digest`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`github_publication_requests`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`github_publication_requests`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`github_publication_requests`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`github_publication_requests`,kind:`column`,value:{name:`worktree_id`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`github_publication_requests`,kind:`column`,value:{name:`repository_fingerprint`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`github_publication_requests`,kind:`column`,value:{name:`claim_id`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`github_publication_requests`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`github_publication_requests`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`github_publication_requests`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:true,identity:false,default:null,position:12}},{table:`github_publication_requests`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:true,identity:false,default:null,position:13}},{table:`github_publication_requests`,kind:`column`,value:{name:`identity_source`,type:`text`,nullable:false,identity:false,default:null,position:14}},{table:`github_publication_requests`,kind:`column`,value:{name:`identity_profile_id`,type:`text`,nullable:true,identity:false,default:null,position:15}},{table:`github_publication_requests`,kind:`column`,value:{name:`identity_account_id`,type:`bigint`,nullable:false,identity:false,default:null,position:16}},{table:`github_publication_requests`,kind:`column`,value:{name:`identity_login`,type:`text`,nullable:false,identity:false,default:null,position:17}},{table:`github_publication_requests`,kind:`column`,value:{name:`title`,type:`text`,nullable:true,identity:false,default:null,position:18}},{table:`github_publication_requests`,kind:`column`,value:{name:`body`,type:`text`,nullable:true,identity:false,default:null,position:19}},{table:`github_publication_requests`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:20}},{table:`github_publication_requests`,kind:`column`,value:{name:`gateway_instance_id`,type:`text`,nullable:true,identity:false,default:null,position:21}},{table:`github_publication_requests`,kind:`column`,value:{name:`repository`,type:`text`,nullable:true,identity:false,default:null,position:22}},{table:`github_publication_requests`,kind:`column`,value:{name:`branch`,type:`text`,nullable:false,identity:false,default:null,position:23}},{table:`github_publication_requests`,kind:`column`,value:{name:`base_branch`,type:`text`,nullable:true,identity:false,default:null,position:24}},{table:`github_publication_requests`,kind:`column`,value:{name:`source_head_commit`,type:`text`,nullable:true,identity:false,default:null,position:25}},{table:`github_publication_requests`,kind:`column`,value:{name:`source_index_tree`,type:`text`,nullable:true,identity:false,default:null,position:26}},{table:`github_publication_requests`,kind:`column`,value:{name:`workspace_tree`,type:`text`,nullable:true,identity:false,default:null,position:27}},{table:`github_publication_requests`,kind:`column`,value:{name:`head_commit`,type:`text`,nullable:true,identity:false,default:null,position:28}},{table:`github_publication_requests`,kind:`column`,value:{name:`pull_request_url`,type:`text`,nullable:true,identity:false,default:null,position:29}},{table:`github_publication_requests`,kind:`column`,value:{name:`error_code`,type:`text`,nullable:true,identity:false,default:null,position:30}},{table:`github_publication_requests`,kind:`column`,value:{name:`next_action`,type:`text`,nullable:true,identity:false,default:null,position:31}},{table:`github_publication_requests`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:32}},{table:`github_publication_requests`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:33}},{table:`github_publication_requests`,kind:`column`,value:{name:`reported_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:34}},{table:`github_publication_requests`,kind:`column`,value:{name:`draft`,type:`bigint`,nullable:true,identity:false,default:null,position:35}},{table:`github_publication_requests`,kind:`primaryKey`,value:[`request_id`]},{table:`github_publication_requests`,kind:`unique`,value:[`session_id`,`idempotency_key`]},{table:`github_publication_requests`,kind:`indexes`,value:3},{table:`github_publication_requests`,kind:`checks`,value:9},{table:`github_publication_session_lifecycles`,kind:`table`,value:null},{table:`github_publication_session_lifecycles`,kind:`column`,value:{name:`publication_kind`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`github_publication_session_lifecycles`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`github_publication_session_lifecycles`,kind:`column`,value:{name:`lifecycle_revision`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`github_publication_session_lifecycles`,kind:`column`,value:{name:`requester_authority_json`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`github_publication_session_lifecycles`,kind:`primaryKey`,value:[`publication_kind`,`request_id`]},{table:`github_publication_session_lifecycles`,kind:`indexes`,value:1},{table:`github_publication_session_lifecycles`,kind:`checks`,value:1},{table:`github_repository_publication_requests`,kind:`table`,value:null},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`owner_profile_id`,type:`text`,nullable:true,identity:false,default:null,position:2}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`connection_generation`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`idempotency_key`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`request_digest`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`session_lifecycle_revision`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`requester_authority_json`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:10}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`workspace_id`,type:`text`,nullable:false,identity:false,default:null,position:11}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`checkpoint_ref`,type:`text`,nullable:true,identity:false,default:null,position:12}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`checkpoint_digest`,type:`text`,nullable:true,identity:false,default:null,position:13}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`claim_id`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:true,identity:false,default:null,position:15}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:true,identity:false,default:null,position:16}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:true,identity:false,default:null,position:17}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:true,identity:false,default:null,position:18}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`identity_source`,type:`text`,nullable:false,identity:false,default:null,position:19}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`identity_profile_id`,type:`text`,nullable:true,identity:false,default:null,position:20}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`identity_account_id`,type:`bigint`,nullable:false,identity:false,default:null,position:21}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`identity_login`,type:`text`,nullable:false,identity:false,default:null,position:22}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`title`,type:`text`,nullable:true,identity:false,default:null,position:23}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`body`,type:`text`,nullable:true,identity:false,default:null,position:24}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:25}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`gateway_instance_id`,type:`text`,nullable:true,identity:false,default:null,position:26}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:true,identity:false,default:null,position:27}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`last_effect`,type:`text`,nullable:true,identity:false,default:null,position:28}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`effect_state`,type:`text`,nullable:true,identity:false,default:null,position:29}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`push_repository`,type:`text`,nullable:true,identity:false,default:null,position:30}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`repository`,type:`text`,nullable:true,identity:false,default:null,position:31}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`branch`,type:`text`,nullable:false,identity:false,default:null,position:32}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`base_branch`,type:`text`,nullable:true,identity:false,default:null,position:33}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`source_head_commit`,type:`text`,nullable:true,identity:false,default:null,position:34}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`source_index_tree`,type:`text`,nullable:true,identity:false,default:null,position:35}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`workspace_tree`,type:`text`,nullable:true,identity:false,default:null,position:36}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`previous_head_commit`,type:`text`,nullable:true,identity:false,default:null,position:37}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`pushed_head_commit`,type:`text`,nullable:true,identity:false,default:null,position:38}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`head_commit`,type:`text`,nullable:true,identity:false,default:null,position:39}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`pull_request_url`,type:`text`,nullable:true,identity:false,default:null,position:40}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`error_code`,type:`text`,nullable:true,identity:false,default:null,position:41}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`next_action`,type:`text`,nullable:true,identity:false,default:null,position:42}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:43}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:44}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`reported_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:45}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`draft`,type:`bigint`,nullable:true,identity:false,default:null,position:46}},{table:`github_repository_publication_requests`,kind:`primaryKey`,value:[`request_id`]},{table:`github_repository_publication_requests`,kind:`indexes`,value:3},{table:`github_repository_publication_requests`,kind:`checks`,value:7},{table:`local_workspace_manifest_nodes`,kind:`table`,value:null},{table:`local_workspace_manifest_nodes`,kind:`column`,value:{name:`worktree_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`local_workspace_manifest_nodes`,kind:`column`,value:{name:`path`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`local_workspace_manifest_nodes`,kind:`column`,value:{name:`node_json`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`local_workspace_manifest_nodes`,kind:`primaryKey`,value:[`worktree_id`,`path`]},{table:`local_workspace_manifest_nodes`,kind:`foreignKey`,value:{columns:[`worktree_id`],target:`local_workspace_projections`,targetColumns:[`worktree_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`local_workspace_manifest_nodes`,kind:`indexes`,value:1},{table:`local_workspace_manifest_nodes`,kind:`checks`,value:0},{table:`local_workspace_projections`,kind:`table`,value:null},{table:`local_workspace_projections`,kind:`column`,value:{name:`worktree_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`local_workspace_projections`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`local_workspace_projections`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`local_workspace_projections`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`local_workspace_projections`,kind:`column`,value:{name:`lifecycle_revision`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`local_workspace_projections`,kind:`column`,value:{name:`projection_path`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`local_workspace_projections`,kind:`column`,value:{name:`base_commit`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`local_workspace_projections`,kind:`column`,value:{name:`source_paths_json`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`local_workspace_projections`,kind:`column`,value:{name:`baseline_json`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`local_workspace_projections`,kind:`column`,value:{name:`baseline_ref`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`local_workspace_projections`,kind:`column`,value:{name:`pending_ref`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`local_workspace_projections`,kind:`column`,value:{name:`pending_target`,type:`text`,nullable:true,identity:false,default:null,position:12}},{table:`local_workspace_projections`,kind:`column`,value:{name:`paused_runtimes_json`,type:`text`,nullable:true,identity:false,default:null,position:13}},{table:`local_workspace_projections`,kind:`column`,value:{name:`journal_json`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`local_workspace_projections`,kind:`column`,value:{name:`journal_pack`,type:`bytea`,nullable:true,identity:false,default:null,position:15}},{table:`local_workspace_projections`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:false,identity:false,default:`0`,position:16}},{table:`local_workspace_projections`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:17}},{table:`local_workspace_projections`,kind:`column`,value:{name:`checkpoint_json`,type:`text`,nullable:true,identity:false,default:null,position:18}},{table:`local_workspace_projections`,kind:`column`,value:{name:`tree_root_digest`,type:`bytea`,nullable:true,identity:false,default:null,position:19}},{table:`local_workspace_projections`,kind:`column`,value:{name:`source_paths_digest`,type:`bytea`,nullable:true,identity:false,default:null,position:20}},{table:`local_workspace_projections`,kind:`column`,value:{name:`canonical_fingerprints`,type:`bytea`,nullable:true,identity:false,default:null,position:21}},{table:`local_workspace_projections`,kind:`column`,value:{name:`projection_fingerprints`,type:`bytea`,nullable:true,identity:false,default:null,position:22}},{table:`local_workspace_projections`,kind:`primaryKey`,value:[`worktree_id`]},{table:`local_workspace_projections`,kind:`unique`,value:[`projection_path`]},{table:`local_workspace_projections`,kind:`indexes`,value:2},{table:`local_workspace_projections`,kind:`checks`,value:5},{table:`local_workspace_source_path_sets`,kind:`table`,value:null},{table:`local_workspace_source_path_sets`,kind:`column`,value:{name:`path_digest`,type:`bytea`,nullable:false,identity:false,default:null,position:1}},{table:`local_workspace_source_path_sets`,kind:`column`,value:{name:`paths_zstd`,type:`bytea`,nullable:false,identity:false,default:null,position:2}},{table:`local_workspace_source_path_sets`,kind:`column`,value:{name:`sweep_epoch`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`local_workspace_source_path_sets`,kind:`primaryKey`,value:[`path_digest`]},{table:`local_workspace_source_path_sets`,kind:`indexes`,value:1},{table:`local_workspace_source_path_sets`,kind:`checks`,value:1},{table:`local_workspace_tree_packs`,kind:`table`,value:null},{table:`local_workspace_tree_packs`,kind:`column`,value:{name:`tree_digest`,type:`bytea`,nullable:false,identity:false,default:null,position:1}},{table:`local_workspace_tree_packs`,kind:`column`,value:{name:`records_json`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`local_workspace_tree_packs`,kind:`column`,value:{name:`children_json`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`local_workspace_tree_packs`,kind:`column`,value:{name:`sweep_epoch`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`local_workspace_tree_packs`,kind:`primaryKey`,value:[`tree_digest`]},{table:`local_workspace_tree_packs`,kind:`indexes`,value:1},{table:`local_workspace_tree_packs`,kind:`checks`,value:1},{table:`macos_port_guardian_records`,kind:`table`,value:null},{table:`macos_port_guardian_records`,kind:`column`,value:{name:`pid`,type:`bigint`,nullable:false,identity:true,default:null,position:1}},{table:`macos_port_guardian_records`,kind:`column`,value:{name:`port`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`macos_port_guardian_records`,kind:`column`,value:{name:`command`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`macos_port_guardian_records`,kind:`column`,value:{name:`mode`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`macos_port_guardian_records`,kind:`column`,value:{name:`timestamp`,type:`double precision`,nullable:false,identity:false,default:null,position:5}},{table:`macos_port_guardian_records`,kind:`primaryKey`,value:[`pid`]},{table:`macos_port_guardian_records`,kind:`indexes`,value:2},{table:`macos_port_guardian_records`,kind:`checks`,value:0},{table:`managed_outgoing_image_records`,kind:`table`,value:null},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`attachment_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`message_id`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`created_at`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`updated_at`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`retention_class`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`alt`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_media_root`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_media_id`,type:`text`,nullable:false,identity:false,default:null,position:10}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_media_subdir`,type:`text`,nullable:false,identity:false,default:null,position:11}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_content_type`,type:`text`,nullable:false,identity:false,default:null,position:12}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_width`,type:`bigint`,nullable:true,identity:false,default:null,position:13}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_height`,type:`bigint`,nullable:true,identity:false,default:null,position:14}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_size_bytes`,type:`bigint`,nullable:true,identity:false,default:null,position:15}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_filename`,type:`text`,nullable:true,identity:false,default:null,position:16}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`record_json`,type:`text`,nullable:false,identity:false,default:null,position:17}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`cleanup_pending`,type:`bigint`,nullable:false,identity:false,default:`0`,position:18}},{table:`managed_outgoing_image_records`,kind:`primaryKey`,value:[`attachment_id`]},{table:`managed_outgoing_image_records`,kind:`indexes`,value:5},{table:`managed_outgoing_image_records`,kind:`checks`,value:1},{table:`mcp_oauth_pending_authorizations`,kind:`table`,value:null},{table:`mcp_oauth_pending_authorizations`,kind:`column`,value:{name:`state`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`mcp_oauth_pending_authorizations`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`mcp_oauth_pending_authorizations`,kind:`column`,value:{name:`create_time`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`mcp_oauth_pending_authorizations`,kind:`primaryKey`,value:[`state`]},{table:`mcp_oauth_pending_authorizations`,kind:`indexes`,value:1},{table:`mcp_oauth_pending_authorizations`,kind:`checks`,value:0},{table:`mcp_oauth_stores`,kind:`table`,value:null},{table:`mcp_oauth_stores`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`mcp_oauth_stores`,kind:`column`,value:{name:`format_version`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`mcp_oauth_stores`,kind:`column`,value:{name:`store_json`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`mcp_oauth_stores`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`mcp_oauth_stores`,kind:`primaryKey`,value:[`store_key`]},{table:`mcp_oauth_stores`,kind:`indexes`,value:1},{table:`mcp_oauth_stores`,kind:`checks`,value:1},{table:`meeting_transcript_sessions`,kind:`table`,value:null},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`started_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:1}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`started_at`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`selector`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`export_key`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`session_slug`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`provider_id`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`title`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_json`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_account_id`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_guild_id`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_channel_id`,type:`text`,nullable:true,identity:false,default:null,position:12}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_meeting_url`,type:`text`,nullable:true,identity:false,default:null,position:13}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_thread_ts`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_file_id`,type:`text`,nullable:true,identity:false,default:null,position:15}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`stopped_at`,type:`text`,nullable:true,identity:false,default:null,position:16}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`metadata_json`,type:`text`,nullable:true,identity:false,default:null,position:17}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`metadata_agent_id`,type:`text`,nullable:true,identity:false,default:null,position:18}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`export_manifest_json`,type:`text`,nullable:false,identity:false,default:`'{}'`,position:19}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`export_pending_json`,type:`text`,nullable:false,identity:false,default:`'[]'`,position:20}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`next_utterance_seq`,type:`bigint`,nullable:false,identity:false,default:`0`,position:21}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:22}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:23}},{table:`meeting_transcript_sessions`,kind:`primaryKey`,value:[`session_id`,`started_at`]},{table:`meeting_transcript_sessions`,kind:`unique`,value:[`selector`]},{table:`meeting_transcript_sessions`,kind:`indexes`,value:10},{table:`meeting_transcript_sessions`,kind:`checks`,value:3},{table:`meeting_transcript_summaries`,kind:`table`,value:null},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`session_started_at`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`generated_at`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`summary_json`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`overview`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`markdown`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`utterance_count`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`meeting_transcript_summaries`,kind:`primaryKey`,value:[`session_id`,`session_started_at`]},{table:`meeting_transcript_summaries`,kind:`foreignKey`,value:{columns:[`session_id`,`session_started_at`],target:`meeting_transcript_sessions`,targetColumns:[`session_id`,`started_at`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`meeting_transcript_summaries`,kind:`indexes`,value:1},{table:`meeting_transcript_summaries`,kind:`checks`,value:2},{table:`meeting_transcript_utterances`,kind:`table`,value:null},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`session_started_at`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`sequence`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`utterance_id`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`started_at`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`ended_at`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`speaker_id`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`speaker_label`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`text`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`final`,type:`bigint`,nullable:true,identity:false,default:null,position:10}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`metadata_json`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`meeting_transcript_utterances`,kind:`primaryKey`,value:[`session_id`,`session_started_at`,`sequence`]},{table:`meeting_transcript_utterances`,kind:`foreignKey`,value:{columns:[`session_id`,`session_started_at`],target:`meeting_transcript_sessions`,targetColumns:[`session_id`,`started_at`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`meeting_transcript_utterances`,kind:`indexes`,value:2},{table:`meeting_transcript_utterances`,kind:`checks`,value:2},{table:`migration_runs`,kind:`table`,value:null},{table:`migration_runs`,kind:`column`,value:{name:`id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`migration_runs`,kind:`column`,value:{name:`started_at`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`migration_runs`,kind:`column`,value:{name:`finished_at`,type:`bigint`,nullable:true,identity:false,default:null,position:3}},{table:`migration_runs`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`migration_runs`,kind:`column`,value:{name:`report_json`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`migration_runs`,kind:`primaryKey`,value:[`id`]},{table:`migration_runs`,kind:`indexes`,value:2},{table:`migration_runs`,kind:`checks`,value:0},{table:`migration_sources`,kind:`table`,value:null},{table:`migration_sources`,kind:`column`,value:{name:`source_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`migration_sources`,kind:`column`,value:{name:`migration_kind`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`migration_sources`,kind:`column`,value:{name:`source_path`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`migration_sources`,kind:`column`,value:{name:`target_table`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`migration_sources`,kind:`column`,value:{name:`source_sha256`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`migration_sources`,kind:`column`,value:{name:`source_size_bytes`,type:`bigint`,nullable:true,identity:false,default:null,position:6}},{table:`migration_sources`,kind:`column`,value:{name:`source_record_count`,type:`bigint`,nullable:true,identity:false,default:null,position:7}},{table:`migration_sources`,kind:`column`,value:{name:`last_run_id`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`migration_sources`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`migration_sources`,kind:`column`,value:{name:`imported_at`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`migration_sources`,kind:`column`,value:{name:`removed_source`,type:`bigint`,nullable:false,identity:false,default:`0`,position:11}},{table:`migration_sources`,kind:`column`,value:{name:`report_json`,type:`text`,nullable:false,identity:false,default:null,position:12}},{table:`migration_sources`,kind:`primaryKey`,value:[`source_key`]},{table:`migration_sources`,kind:`foreignKey`,value:{columns:[`last_run_id`],target:`migration_runs`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`migration_sources`,kind:`indexes`,value:3},{table:`migration_sources`,kind:`checks`,value:0},{table:`native_hook_relay_bridges`,kind:`table`,value:null},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`relay_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`pid`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`hostname`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`port`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`token`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`native_hook_relay_bridges`,kind:`primaryKey`,value:[`relay_id`]},{table:`native_hook_relay_bridges`,kind:`indexes`,value:2},{table:`native_hook_relay_bridges`,kind:`checks`,value:0},{table:`node_worker_launch_boots`,kind:`table`,value:null},{table:`node_worker_launch_boots`,kind:`column`,value:{name:`launch_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`node_worker_launch_boots`,kind:`column`,value:{name:`boot_id`,type:`text`,nullable:true,identity:false,default:null,position:2}},{table:`node_worker_launch_boots`,kind:`primaryKey`,value:[`launch_id`]},{table:`node_worker_launch_boots`,kind:`foreignKey`,value:{columns:[`launch_id`],target:`node_worker_launches`,targetColumns:[`launch_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`node_worker_launch_boots`,kind:`indexes`,value:1},{table:`node_worker_launch_boots`,kind:`checks`,value:1},{table:`node_worker_launch_cleanup`,kind:`table`,value:null},{table:`node_worker_launch_cleanup`,kind:`column`,value:{name:`launch_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`node_worker_launch_cleanup`,kind:`column`,value:{name:`cleanup_mode`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`node_worker_launch_cleanup`,kind:`column`,value:{name:`lineage_settled`,type:`bigint`,nullable:true,identity:false,default:null,position:3}},{table:`node_worker_launch_cleanup`,kind:`primaryKey`,value:[`launch_id`]},{table:`node_worker_launch_cleanup`,kind:`foreignKey`,value:{columns:[`launch_id`],target:`node_worker_launches`,targetColumns:[`launch_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`node_worker_launch_cleanup`,kind:`indexes`,value:1},{table:`node_worker_launch_cleanup`,kind:`checks`,value:2},{table:`node_worker_launch_containers`,kind:`table`,value:null},{table:`node_worker_launch_containers`,kind:`column`,value:{name:`launch_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`node_worker_launch_containers`,kind:`column`,value:{name:`container_json`,type:`text`,nullable:true,identity:false,default:null,position:2}},{table:`node_worker_launch_containers`,kind:`primaryKey`,value:[`launch_id`]},{table:`node_worker_launch_containers`,kind:`indexes`,value:1},{table:`node_worker_launch_containers`,kind:`checks`,value:0},{table:`node_worker_launch_process_scopes`,kind:`table`,value:null},{table:`node_worker_launch_process_scopes`,kind:`column`,value:{name:`launch_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`node_worker_launch_process_scopes`,kind:`column`,value:{name:`scope_kind`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`node_worker_launch_process_scopes`,kind:`column`,value:{name:`descendants_reaped`,type:`bigint`,nullable:true,identity:false,default:null,position:3}},{table:`node_worker_launch_process_scopes`,kind:`primaryKey`,value:[`launch_id`]},{table:`node_worker_launch_process_scopes`,kind:`foreignKey`,value:{columns:[`launch_id`],target:`node_worker_launches`,targetColumns:[`launch_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`node_worker_launch_process_scopes`,kind:`indexes`,value:1},{table:`node_worker_launch_process_scopes`,kind:`checks`,value:2},{table:`node_worker_launches`,kind:`table`,value:null},{table:`node_worker_launches`,kind:`column`,value:{name:`launch_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`node_worker_launches`,kind:`column`,value:{name:`plan_hash`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`node_worker_launches`,kind:`column`,value:{name:`gateway_namespace`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`node_worker_launches`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`node_worker_launches`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`node_worker_launches`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`node_worker_launches`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`node_worker_launches`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`node_worker_launches`,kind:`column`,value:{name:`state`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`node_worker_launches`,kind:`column`,value:{name:`supervisor_pid`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`node_worker_launches`,kind:`column`,value:{name:`supervisor_start_time`,type:`bigint`,nullable:false,identity:false,default:null,position:11}},{table:`node_worker_launches`,kind:`column`,value:{name:`worker_pid`,type:`bigint`,nullable:true,identity:false,default:null,position:12}},{table:`node_worker_launches`,kind:`column`,value:{name:`worker_start_time`,type:`bigint`,nullable:true,identity:false,default:null,position:13}},{table:`node_worker_launches`,kind:`column`,value:{name:`result_json`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`node_worker_launches`,kind:`column`,value:{name:`error_text`,type:`text`,nullable:true,identity:false,default:null,position:15}},{table:`node_worker_launches`,kind:`column`,value:{name:`completed_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:16}},{table:`node_worker_launches`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:17}},{table:`node_worker_launches`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:18}},{table:`node_worker_launches`,kind:`primaryKey`,value:[`launch_id`]},{table:`node_worker_launches`,kind:`indexes`,value:2},{table:`node_worker_launches`,kind:`checks`,value:20},{table:`node_worker_prepared_workspaces`,kind:`table`,value:null},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`preparation_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`cache_key`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`gateway_namespace`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`workspace_dir`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`home_dir`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`source_manifest_ref`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`prepared_manifest_ref`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`state`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:true,identity:false,default:null,position:12}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:13}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`bound_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:14}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`retired_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:15}},{table:`node_worker_prepared_workspaces`,kind:`primaryKey`,value:[`preparation_key`]},{table:`node_worker_prepared_workspaces`,kind:`unique`,value:[`workspace_dir`]},{table:`node_worker_prepared_workspaces`,kind:`indexes`,value:2},{table:`node_worker_prepared_workspaces`,kind:`checks`,value:15},{table:`node_worker_turns`,kind:`table`,value:null},{table:`node_worker_turns`,kind:`column`,value:{name:`turn_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`node_worker_turns`,kind:`column`,value:{name:`owner_launch_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`node_worker_turns`,kind:`column`,value:{name:`plan_hash`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`node_worker_turns`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`node_worker_turns`,kind:`column`,value:{name:`state`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`node_worker_turns`,kind:`column`,value:{name:`result_json`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`node_worker_turns`,kind:`column`,value:{name:`error_text`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`node_worker_turns`,kind:`column`,value:{name:`completed_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:8}},{table:`node_worker_turns`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:9}},{table:`node_worker_turns`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`node_worker_turns`,kind:`primaryKey`,value:[`turn_id`]},{table:`node_worker_turns`,kind:`foreignKey`,value:{columns:[`owner_launch_id`],target:`node_worker_launches`,targetColumns:[`launch_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`node_worker_turns`,kind:`indexes`,value:3},{table:`node_worker_turns`,kind:`checks`,value:10},{table:`official_external_plugin_catalog_snapshots`,kind:`table`,value:null},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`feed_url`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`body`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`status`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`etag`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`last_modified`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`checksum`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`saved_at`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`trust_mode`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`trust_key_id`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`trust_signature_count`,type:`bigint`,nullable:true,identity:false,default:null,position:10}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`trust_threshold`,type:`bigint`,nullable:true,identity:false,default:null,position:11}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`trust_verified_at`,type:`text`,nullable:true,identity:false,default:null,position:12}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:13}},{table:`official_external_plugin_catalog_snapshots`,kind:`primaryKey`,value:[`feed_url`]},{table:`official_external_plugin_catalog_snapshots`,kind:`indexes`,value:2},{table:`official_external_plugin_catalog_snapshots`,kind:`checks`,value:0},{table:`operator_approval_execution_identities`,kind:`table`,value:null},{table:`operator_approval_execution_identities`,kind:`column`,value:{name:`approval_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`operator_approval_execution_identities`,kind:`column`,value:{name:`source_context_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`operator_approval_execution_identities`,kind:`column`,value:{name:`source_execution_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`operator_approval_execution_identities`,kind:`primaryKey`,value:[`approval_id`]},{table:`operator_approval_execution_identities`,kind:`foreignKey`,value:{columns:[`approval_id`],target:`operator_approvals`,targetColumns:[`approval_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`operator_approval_execution_identities`,kind:`indexes`,value:1},{table:`operator_approval_execution_identities`,kind:`checks`,value:2},{table:`operator_approval_standing_grant_generations`,kind:`table`,value:null},{table:`operator_approval_standing_grant_generations`,kind:`column`,value:{name:`grant_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`operator_approval_standing_grant_generations`,kind:`column`,value:{name:`job_definition_generation`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`operator_approval_standing_grant_generations`,kind:`primaryKey`,value:[`grant_id`]},{table:`operator_approval_standing_grant_generations`,kind:`foreignKey`,value:{columns:[`grant_id`],target:`operator_approval_standing_grants`,targetColumns:[`grant_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`operator_approval_standing_grant_generations`,kind:`indexes`,value:1},{table:`operator_approval_standing_grant_generations`,kind:`checks`,value:1},{table:`operator_approval_standing_grants`,kind:`table`,value:null},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`grant_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`minted_by_approval_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`cron_job_id`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`job_config_revision`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`operation_binding`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:8}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`revoked_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:9}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`revoked_by`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`last_used_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:11}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`use_count`,type:`bigint`,nullable:false,identity:false,default:`0`,position:12}},{table:`operator_approval_standing_grants`,kind:`primaryKey`,value:[`grant_id`]},{table:`operator_approval_standing_grants`,kind:`foreignKey`,value:{columns:[`minted_by_approval_id`],target:`operator_approvals`,targetColumns:[`approval_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`operator_approval_standing_grants`,kind:`indexes`,value:2},{table:`operator_approval_standing_grants`,kind:`checks`,value:6},{table:`operator_approvals`,kind:`table`,value:null},{table:`operator_approvals`,kind:`column`,value:{name:`cursor_id`,type:`bigint`,nullable:false,identity:false,default:null,position:1}},{table:`operator_approvals`,kind:`column`,value:{name:`approval_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`operator_approvals`,kind:`column`,value:{name:`resolution_ref`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`operator_approvals`,kind:`column`,value:{name:`kind`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`operator_approvals`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`operator_approvals`,kind:`column`,value:{name:`presentation_json`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`operator_approvals`,kind:`column`,value:{name:`requested_by_device_id`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`operator_approvals`,kind:`column`,value:{name:`requested_by_client_id`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`operator_approvals`,kind:`column`,value:{name:`requested_by_device_token_auth`,type:`bigint`,nullable:false,identity:false,default:`0`,position:9}},{table:`operator_approvals`,kind:`column`,value:{name:`reviewer_device_ids_json`,type:`text`,nullable:false,identity:false,default:null,position:10}},{table:`operator_approvals`,kind:`column`,value:{name:`source_agent_id`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`operator_approvals`,kind:`column`,value:{name:`source_session_key`,type:`text`,nullable:true,identity:false,default:null,position:12}},{table:`operator_approvals`,kind:`column`,value:{name:`source_session_id`,type:`text`,nullable:true,identity:false,default:null,position:13}},{table:`operator_approvals`,kind:`column`,value:{name:`source_run_id`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`operator_approvals`,kind:`column`,value:{name:`source_tool_call_id`,type:`text`,nullable:true,identity:false,default:null,position:15}},{table:`operator_approvals`,kind:`column`,value:{name:`source_tool_name`,type:`text`,nullable:true,identity:false,default:null,position:16}},{table:`operator_approvals`,kind:`column`,value:{name:`audience_session_keys_json`,type:`text`,nullable:false,identity:false,default:null,position:17}},{table:`operator_approvals`,kind:`column`,value:{name:`runtime_epoch`,type:`text`,nullable:false,identity:false,default:null,position:18}},{table:`operator_approvals`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:19}},{table:`operator_approvals`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:20}},{table:`operator_approvals`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:21}},{table:`operator_approvals`,kind:`column`,value:{name:`decision`,type:`text`,nullable:true,identity:false,default:null,position:22}},{table:`operator_approvals`,kind:`column`,value:{name:`terminal_reason`,type:`text`,nullable:true,identity:false,default:null,position:23}},{table:`operator_approvals`,kind:`column`,value:{name:`resolved_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:24}},{table:`operator_approvals`,kind:`column`,value:{name:`resolver_kind`,type:`text`,nullable:true,identity:false,default:null,position:25}},{table:`operator_approvals`,kind:`column`,value:{name:`resolver_id`,type:`text`,nullable:true,identity:false,default:null,position:26}},{table:`operator_approvals`,kind:`column`,value:{name:`consumed_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:27}},{table:`operator_approvals`,kind:`column`,value:{name:`consumed_by`,type:`text`,nullable:true,identity:false,default:null,position:28}},{table:`operator_approvals`,kind:`primaryKey`,value:[`approval_id`]},{table:`operator_approvals`,kind:`indexes`,value:8},{table:`operator_approvals`,kind:`checks`,value:16},{table:`outbound_media_provenance`,kind:`table`,value:null},{table:`outbound_media_provenance`,kind:`column`,value:{name:`realpath`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`outbound_media_provenance`,kind:`column`,value:{name:`kind`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`outbound_media_provenance`,kind:`column`,value:{name:`version`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`outbound_media_provenance`,kind:`column`,value:{name:`sha256`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`outbound_media_provenance`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`outbound_media_provenance`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`outbound_media_provenance`,kind:`primaryKey`,value:[`realpath`]},{table:`outbound_media_provenance`,kind:`indexes`,value:1},{table:`outbound_media_provenance`,kind:`checks`,value:0},{table:`outbound_message_execution_bindings`,kind:`table`,value:null},{table:`outbound_message_execution_bindings`,kind:`column`,value:{name:`event_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`outbound_message_execution_bindings`,kind:`column`,value:{name:`context_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`outbound_message_execution_bindings`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`outbound_message_execution_bindings`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`outbound_message_execution_bindings`,kind:`primaryKey`,value:[`event_id`]},{table:`outbound_message_execution_bindings`,kind:`foreignKey`,value:{columns:[`event_id`],target:`audit_events`,targetColumns:[`event_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`outbound_message_execution_bindings`,kind:`indexes`,value:2},{table:`outbound_message_execution_bindings`,kind:`checks`,value:3},{table:`outbound_message_progress`,kind:`table`,value:null},{table:`outbound_message_progress`,kind:`column`,value:{name:`sequence`,type:`bigint`,nullable:false,identity:true,default:null,position:1}},{table:`outbound_message_progress`,kind:`column`,value:{name:`progress_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`outbound_message_progress`,kind:`column`,value:{name:`source_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`outbound_message_progress`,kind:`column`,value:{name:`source_sequence`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`outbound_message_progress`,kind:`column`,value:{name:`schema_version`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`outbound_message_progress`,kind:`column`,value:{name:`occurred_at`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`outbound_message_progress`,kind:`column`,value:{name:`action`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`outbound_message_progress`,kind:`column`,value:{name:`outcome`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`outbound_message_progress`,kind:`column`,value:{name:`actor_type`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`outbound_message_progress`,kind:`column`,value:{name:`actor_id`,type:`text`,nullable:false,identity:false,default:null,position:10}},{table:`outbound_message_progress`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`outbound_message_progress`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:true,identity:false,default:null,position:12}},{table:`outbound_message_progress`,kind:`column`,value:{name:`context_id`,type:`text`,nullable:true,identity:false,default:null,position:13}},{table:`outbound_message_progress`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`outbound_message_progress`,kind:`column`,value:{name:`channel`,type:`text`,nullable:false,identity:false,default:null,position:15}},{table:`outbound_message_progress`,kind:`column`,value:{name:`conversation_kind`,type:`text`,nullable:false,identity:false,default:null,position:16}},{table:`outbound_message_progress`,kind:`column`,value:{name:`duration_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:17}},{table:`outbound_message_progress`,kind:`column`,value:{name:`account_ref`,type:`text`,nullable:true,identity:false,default:null,position:18}},{table:`outbound_message_progress`,kind:`column`,value:{name:`conversation_ref`,type:`text`,nullable:true,identity:false,default:null,position:19}},{table:`outbound_message_progress`,kind:`column`,value:{name:`target_ref`,type:`text`,nullable:true,identity:false,default:null,position:20}},{table:`outbound_message_progress`,kind:`primaryKey`,value:[`sequence`]},{table:`outbound_message_progress`,kind:`unique`,value:[`progress_id`]},{table:`outbound_message_progress`,kind:`unique`,value:[`source_id`]},{table:`outbound_message_progress`,kind:`unique`,value:[`occurred_at`,`progress_id`]},{table:`outbound_message_progress`,kind:`indexes`,value:6},{table:`outbound_message_progress`,kind:`checks`,value:14},{table:`plugin_binding_approvals`,kind:`table`,value:null},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`plugin_root`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`channel`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`plugin_id`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`plugin_name`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`approved_at`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`plugin_binding_approvals`,kind:`primaryKey`,value:[`plugin_root`,`channel`,`account_id`]},{table:`plugin_binding_approvals`,kind:`indexes`,value:2},{table:`plugin_binding_approvals`,kind:`checks`,value:0},{table:`plugin_blob_entries`,kind:`table`,value:null},{table:`plugin_blob_entries`,kind:`column`,value:{name:`plugin_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`namespace`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`entry_key`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`metadata_json`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`blob`,type:`bytea`,nullable:false,identity:false,default:null,position:5}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:true,identity:false,default:null,position:7}},{table:`plugin_blob_entries`,kind:`primaryKey`,value:[`plugin_id`,`namespace`,`entry_key`]},{table:`plugin_blob_entries`,kind:`indexes`,value:3},{table:`plugin_blob_entries`,kind:`checks`,value:0},{table:`plugin_state_entries`,kind:`table`,value:null},{table:`plugin_state_entries`,kind:`column`,value:{name:`plugin_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`plugin_state_entries`,kind:`column`,value:{name:`namespace`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`plugin_state_entries`,kind:`column`,value:{name:`entry_key`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`plugin_state_entries`,kind:`column`,value:{name:`value_json`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`plugin_state_entries`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`plugin_state_entries`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:true,identity:false,default:null,position:6}},{table:`plugin_state_entries`,kind:`primaryKey`,value:[`plugin_id`,`namespace`,`entry_key`]},{table:`plugin_state_entries`,kind:`indexes`,value:3},{table:`plugin_state_entries`,kind:`checks`,value:0},{table:`projects`,kind:`table`,value:null},{table:`projects`,kind:`column`,value:{name:`id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`projects`,kind:`column`,value:{name:`display_name`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`projects`,kind:`column`,value:{name:`repo_root`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`projects`,kind:`column`,value:{name:`origin_url`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`projects`,kind:`column`,value:{name:`source`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`projects`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`projects`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`projects`,kind:`primaryKey`,value:[`id`]},{table:`projects`,kind:`indexes`,value:1},{table:`projects`,kind:`checks`,value:1},{table:`sandbox_persistent_execs`,kind:`table`,value:null},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`owner_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`source_identity`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`attempt_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`owner_json`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`backend_id`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`backend_target_json`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`workspace_binding_json`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`container_id`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`container_name`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`container_started_at`,type:`text`,nullable:false,identity:false,default:null,position:10}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:false,identity:false,default:null,position:11}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`phase`,type:`text`,nullable:false,identity:false,default:null,position:12}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`receipt_json`,type:`text`,nullable:true,identity:false,default:null,position:13}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`error`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:15}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:16}},{table:`sandbox_persistent_execs`,kind:`primaryKey`,value:[`owner_key`]},{table:`sandbox_persistent_execs`,kind:`unique`,value:[`attempt_id`]},{table:`sandbox_persistent_execs`,kind:`indexes`,value:5},{table:`sandbox_persistent_execs`,kind:`checks`,value:4},{table:`sandbox_registry_entries`,kind:`table`,value:null},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`registry_kind`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`container_name`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`backend_id`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`runtime_label`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`image`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:7}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`last_used_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:8}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`config_label_kind`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`config_hash`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`cdp_port`,type:`bigint`,nullable:true,identity:false,default:null,position:11}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`no_vnc_port`,type:`bigint`,nullable:true,identity:false,default:null,position:12}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`entry_json`,type:`text`,nullable:false,identity:false,default:null,position:13}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:false,identity:false,default:null,position:14}},{table:`sandbox_registry_entries`,kind:`primaryKey`,value:[`registry_kind`,`container_name`]},{table:`sandbox_registry_entries`,kind:`indexes`,value:4},{table:`sandbox_registry_entries`,kind:`checks`,value:0},{table:`schema_meta`,kind:`table`,value:null},{table:`schema_meta`,kind:`column`,value:{name:`meta_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`schema_meta`,kind:`column`,value:{name:`role`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`schema_meta`,kind:`column`,value:{name:`schema_version`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`schema_meta`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`schema_meta`,kind:`column`,value:{name:`app_version`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`schema_meta`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`schema_meta`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`schema_meta`,kind:`primaryKey`,value:[`meta_key`]},{table:`schema_meta`,kind:`indexes`,value:1},{table:`schema_meta`,kind:`checks`,value:0},{table:`secret_store_entries`,kind:`table`,value:null},{table:`secret_store_entries`,kind:`column`,value:{name:`scope_kind`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`secret_store_entries`,kind:`column`,value:{name:`scope_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`secret_store_entries`,kind:`column`,value:{name:`name`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`secret_store_entries`,kind:`column`,value:{name:`value`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`secret_store_entries`,kind:`column`,value:{name:`kind`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`secret_store_entries`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`secret_store_entries`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`secret_store_entries`,kind:`column`,value:{name:`updated_by`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`secret_store_entries`,kind:`column`,value:{name:`deleted_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:9}},{table:`secret_store_entries`,kind:`column`,value:{name:`allowed_hosts`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`secret_store_entries`,kind:`primaryKey`,value:[`scope_kind`,`scope_id`,`name`]},{table:`secret_store_entries`,kind:`indexes`,value:2},{table:`secret_store_entries`,kind:`checks`,value:5},{table:`session_groups`,kind:`table`,value:null},{table:`session_groups`,kind:`column`,value:{name:`name`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`session_groups`,kind:`column`,value:{name:`position`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`session_groups`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`session_groups`,kind:`column`,value:{name:`cwd`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`session_groups`,kind:`column`,value:{name:`worktree`,type:`bigint`,nullable:true,identity:false,default:null,position:5}},{table:`session_groups`,kind:`primaryKey`,value:[`name`]},{table:`session_groups`,kind:`indexes`,value:1},{table:`session_groups`,kind:`checks`,value:0},{table:`session_repository_workspaces`,kind:`table`,value:null},{table:`session_repository_workspaces`,kind:`column`,value:{name:`workspace_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`url`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`requested_ref`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`run_setup_script`,type:`bigint`,nullable:false,identity:false,default:`0`,position:6}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`base_commit`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`base_manifest_hash`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`branch`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`checkpoint_ref`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`manifest_hash`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:false,identity:false,default:null,position:12}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:13}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:14}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`disk_authority_json`,type:`text`,nullable:true,identity:false,default:null,position:15}},{table:`session_repository_workspaces`,kind:`primaryKey`,value:[`workspace_id`]},{table:`session_repository_workspaces`,kind:`unique`,value:[`agent_id`,`session_key`]},{table:`session_repository_workspaces`,kind:`indexes`,value:2},{table:`session_repository_workspaces`,kind:`checks`,value:11},{table:`session_state_events`,kind:`table`,value:null},{table:`session_state_events`,kind:`column`,value:{name:`sequence`,type:`bigint`,nullable:false,identity:true,default:null,position:1}},{table:`session_state_events`,kind:`column`,value:{name:`dedupe_key`,type:`text`,nullable:true,identity:false,default:null,position:2}},{table:`session_state_events`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`session_state_events`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`session_state_events`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`session_state_events`,kind:`column`,value:{name:`kind`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`session_state_events`,kind:`column`,value:{name:`actor_type`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`session_state_events`,kind:`column`,value:{name:`actor_id`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`session_state_events`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`session_state_events`,kind:`column`,value:{name:`occurred_at`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`session_state_events`,kind:`column`,value:{name:`summary`,type:`text`,nullable:false,identity:false,default:null,position:11}},{table:`session_state_events`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:true,identity:false,default:null,position:12}},{table:`session_state_events`,kind:`primaryKey`,value:[`sequence`]},{table:`session_state_events`,kind:`unique`,value:[`dedupe_key`]},{table:`session_state_events`,kind:`indexes`,value:4},{table:`session_state_events`,kind:`checks`,value:0},{table:`session_state_heads`,kind:`table`,value:null},{table:`session_state_heads`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`session_state_heads`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`session_state_heads`,kind:`column`,value:{name:`last_sequence`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`session_state_heads`,kind:`column`,value:{name:`pruned_max_sequence`,type:`bigint`,nullable:false,identity:false,default:`0`,position:4}},{table:`session_state_heads`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`session_state_heads`,kind:`primaryKey`,value:[`session_key`,`agent_id`]},{table:`session_state_heads`,kind:`indexes`,value:1},{table:`session_state_heads`,kind:`checks`,value:0},{table:`session_upstream_links`,kind:`table`,value:null},{table:`session_upstream_links`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`session_upstream_links`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`session_upstream_links`,kind:`column`,value:{name:`catalog_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`session_upstream_links`,kind:`column`,value:{name:`host_id`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`session_upstream_links`,kind:`column`,value:{name:`thread_id`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`session_upstream_links`,kind:`column`,value:{name:`upstream_kind`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`session_upstream_links`,kind:`column`,value:{name:`upstream_ref_json`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`session_upstream_links`,kind:`column`,value:{name:`last_marker_json`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`session_upstream_links`,kind:`column`,value:{name:`last_scanned_at`,type:`bigint`,nullable:true,identity:false,default:null,position:9}},{table:`session_upstream_links`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`session_upstream_links`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:false,identity:false,default:null,position:11}},{table:`session_upstream_links`,kind:`primaryKey`,value:[`session_key`,`agent_id`]},{table:`session_upstream_links`,kind:`indexes`,value:2},{table:`session_upstream_links`,kind:`checks`,value:0},{table:`session_watch_cursors`,kind:`table`,value:null},{table:`session_watch_cursors`,kind:`column`,value:{name:`watcher_session_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`session_watch_cursors`,kind:`column`,value:{name:`watcher_store_path`,type:`text`,nullable:true,identity:false,default:null,position:2}},{table:`session_watch_cursors`,kind:`column`,value:{name:`target_session_key`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`session_watch_cursors`,kind:`column`,value:{name:`last_seen_sequence`,type:`bigint`,nullable:false,identity:false,default:`0`,position:4}},{table:`session_watch_cursors`,kind:`column`,value:{name:`notified_sequence`,type:`bigint`,nullable:false,identity:false,default:`0`,position:5}},{table:`session_watch_cursors`,kind:`column`,value:{name:`material_sequence`,type:`bigint`,nullable:false,identity:false,default:`0`,position:6}},{table:`session_watch_cursors`,kind:`column`,value:{name:`provenance`,type:`text`,nullable:false,identity:false,default:`'explicit'`,position:7}},{table:`session_watch_cursors`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:false,identity:false,default:null,position:8}},{table:`session_watch_cursors`,kind:`primaryKey`,value:[`watcher_session_key`,`target_session_key`]},{table:`session_watch_cursors`,kind:`indexes`,value:2},{table:`session_watch_cursors`,kind:`checks`,value:1},{table:`skill_library_entries`,kind:`table`,value:null},{table:`skill_library_entries`,kind:`column`,value:{name:`skill_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`skill_library_entries`,kind:`column`,value:{name:`owner_profile_id`,type:`text`,nullable:true,identity:false,default:null,position:2}},{table:`skill_library_entries`,kind:`column`,value:{name:`author_profile_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`skill_library_entries`,kind:`column`,value:{name:`slug`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`skill_library_entries`,kind:`column`,value:{name:`current_revision`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`skill_library_entries`,kind:`column`,value:{name:`shared`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`skill_library_entries`,kind:`column`,value:{name:`enabled`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`skill_library_entries`,kind:`column`,value:{name:`removed`,type:`bigint`,nullable:false,identity:false,default:null,position:8}},{table:`skill_library_entries`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:9}},{table:`skill_library_entries`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`skill_library_entries`,kind:`primaryKey`,value:[`skill_id`]},{table:`skill_library_entries`,kind:`indexes`,value:1},{table:`skill_library_entries`,kind:`checks`,value:0},{table:`skill_library_events`,kind:`table`,value:null},{table:`skill_library_events`,kind:`column`,value:{name:`event_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`skill_library_events`,kind:`column`,value:{name:`skill_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`skill_library_events`,kind:`column`,value:{name:`revision`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`skill_library_events`,kind:`column`,value:{name:`action`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`skill_library_events`,kind:`column`,value:{name:`actor_profile_id`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`skill_library_events`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`skill_library_events`,kind:`primaryKey`,value:[`event_id`]},{table:`skill_library_events`,kind:`indexes`,value:1},{table:`skill_library_events`,kind:`checks`,value:0},{table:`skill_library_revisions`,kind:`table`,value:null},{table:`skill_library_revisions`,kind:`column`,value:{name:`skill_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`skill_library_revisions`,kind:`column`,value:{name:`revision`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`skill_library_revisions`,kind:`column`,value:{name:`description`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`skill_library_revisions`,kind:`column`,value:{name:`files_json`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`skill_library_revisions`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`skill_library_revisions`,kind:`primaryKey`,value:[`skill_id`,`revision`]},{table:`skill_library_revisions`,kind:`indexes`,value:1},{table:`skill_library_revisions`,kind:`checks`,value:0},{table:`skill_library_uploads`,kind:`table`,value:null},{table:`skill_library_uploads`,kind:`column`,value:{name:`upload_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`skill_library_uploads`,kind:`column`,value:{name:`owner_profile_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`skill_library_uploads`,kind:`column`,value:{name:`slug`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`skill_library_uploads`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`skill_library_uploads`,kind:`column`,value:{name:`sha256`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`skill_library_uploads`,kind:`column`,value:{name:`archive_blob`,type:`bytea`,nullable:false,identity:false,default:null,position:6}},{table:`skill_library_uploads`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`skill_library_uploads`,kind:`column`,value:{name:`published_skill_id`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`skill_library_uploads`,kind:`primaryKey`,value:[`upload_id`]},{table:`skill_library_uploads`,kind:`indexes`,value:1},{table:`skill_library_uploads`,kind:`checks`,value:0},{table:`skill_upload_chunks`,kind:`table`,value:null},{table:`skill_upload_chunks`,kind:`column`,value:{name:`upload_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`skill_upload_chunks`,kind:`column`,value:{name:`byte_offset`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`skill_upload_chunks`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`skill_upload_chunks`,kind:`column`,value:{name:`chunk_blob`,type:`bytea`,nullable:false,identity:false,default:null,position:4}},{table:`skill_upload_chunks`,kind:`primaryKey`,value:[`upload_id`,`byte_offset`]},{table:`skill_upload_chunks`,kind:`foreignKey`,value:{columns:[`upload_id`],target:`skill_uploads`,targetColumns:[`upload_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`skill_upload_chunks`,kind:`indexes`,value:1},{table:`skill_upload_chunks`,kind:`checks`,value:3},{table:`skill_uploads`,kind:`table`,value:null},{table:`skill_uploads`,kind:`column`,value:{name:`upload_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`skill_uploads`,kind:`column`,value:{name:`kind`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`skill_uploads`,kind:`column`,value:{name:`slug`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`skill_uploads`,kind:`column`,value:{name:`force`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`skill_uploads`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`skill_uploads`,kind:`column`,value:{name:`sha256`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`skill_uploads`,kind:`column`,value:{name:`actual_sha256`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`skill_uploads`,kind:`column`,value:{name:`received_bytes`,type:`bigint`,nullable:false,identity:false,default:null,position:8}},{table:`skill_uploads`,kind:`column`,value:{name:`archive_blob`,type:`bytea`,nullable:false,identity:false,default:null,position:9}},{table:`skill_uploads`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`skill_uploads`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:false,identity:false,default:null,position:11}},{table:`skill_uploads`,kind:`column`,value:{name:`committed`,type:`bigint`,nullable:false,identity:false,default:null,position:12}},{table:`skill_uploads`,kind:`column`,value:{name:`committed_at`,type:`bigint`,nullable:true,identity:false,default:null,position:13}},{table:`skill_uploads`,kind:`column`,value:{name:`idempotency_key_hash`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`skill_uploads`,kind:`primaryKey`,value:[`upload_id`]},{table:`skill_uploads`,kind:`unique`,value:[`idempotency_key_hash`]},{table:`skill_uploads`,kind:`indexes`,value:4},{table:`skill_uploads`,kind:`checks`,value:0},{table:`skill_usage`,kind:`table`,value:null},{table:`skill_usage`,kind:`column`,value:{name:`skill_file`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`skill_usage`,kind:`column`,value:{name:`skill_key`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`skill_usage`,kind:`column`,value:{name:`skill_name`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`skill_usage`,kind:`column`,value:{name:`skill_source`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`skill_usage`,kind:`column`,value:{name:`first_used_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`skill_usage`,kind:`column`,value:{name:`last_used_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`skill_usage`,kind:`column`,value:{name:`use_count`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`skill_usage`,kind:`column`,value:{name:`last_agent_id`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`skill_usage`,kind:`primaryKey`,value:[`skill_file`]},{table:`skill_usage`,kind:`indexes`,value:1},{table:`skill_usage`,kind:`checks`,value:0},{table:`skill_workshop_changes`,kind:`table`,value:null},{table:`skill_workshop_changes`,kind:`column`,value:{name:`cursor_id`,type:`bigint`,nullable:false,identity:false,default:null,position:1}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`change_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`skill_name`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`action`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`actor`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`summary`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`version_id`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:11}},{table:`skill_workshop_changes`,kind:`primaryKey`,value:[`change_id`]},{table:`skill_workshop_changes`,kind:`indexes`,value:3},{table:`skill_workshop_changes`,kind:`checks`,value:2},{table:`state_leases`,kind:`table`,value:null},{table:`state_leases`,kind:`column`,value:{name:`scope`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`state_leases`,kind:`column`,value:{name:`lease_key`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`state_leases`,kind:`column`,value:{name:`owner`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`state_leases`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:true,identity:false,default:null,position:4}},{table:`state_leases`,kind:`column`,value:{name:`heartbeat_at`,type:`bigint`,nullable:true,identity:false,default:null,position:5}},{table:`state_leases`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`state_leases`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`state_leases`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:false,identity:false,default:null,position:8}},{table:`state_leases`,kind:`primaryKey`,value:[`scope`,`lease_key`]},{table:`state_leases`,kind:`indexes`,value:3},{table:`state_leases`,kind:`checks`,value:0},{table:`subagent_runs`,kind:`table`,value:null},{table:`subagent_runs`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`subagent_runs`,kind:`column`,value:{name:`child_session_key`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`subagent_runs`,kind:`column`,value:{name:`controller_session_key`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`subagent_runs`,kind:`column`,value:{name:`controller_store_path`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`subagent_runs`,kind:`column`,value:{name:`requester_session_key`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`subagent_runs`,kind:`column`,value:{name:`requester_store_path`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`subagent_runs`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`subagent_runs`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:false,identity:false,default:`'{}'`,position:8}},{table:`subagent_runs`,kind:`primaryKey`,value:[`run_id`]},{table:`subagent_runs`,kind:`indexes`,value:4},{table:`subagent_runs`,kind:`checks`,value:0},{table:`task_delivery_state`,kind:`table`,value:null},{table:`task_delivery_state`,kind:`column`,value:{name:`task_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`task_delivery_state`,kind:`column`,value:{name:`requester_origin_json`,type:`text`,nullable:true,identity:false,default:null,position:2}},{table:`task_delivery_state`,kind:`column`,value:{name:`last_notified_event_at`,type:`bigint`,nullable:true,identity:false,default:null,position:3}},{table:`task_delivery_state`,kind:`primaryKey`,value:[`task_id`]},{table:`task_delivery_state`,kind:`foreignKey`,value:{columns:[`task_id`],target:`task_runs`,targetColumns:[`task_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`task_delivery_state`,kind:`indexes`,value:1},{table:`task_delivery_state`,kind:`checks`,value:0},{table:`task_runs`,kind:`table`,value:null},{table:`task_runs`,kind:`column`,value:{name:`task_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`task_runs`,kind:`column`,value:{name:`runtime`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`task_runs`,kind:`column`,value:{name:`task_kind`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`task_runs`,kind:`column`,value:{name:`source_id`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`task_runs`,kind:`column`,value:{name:`requester_session_key`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`task_runs`,kind:`column`,value:{name:`owner_key`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`task_runs`,kind:`column`,value:{name:`scope_kind`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`task_runs`,kind:`column`,value:{name:`child_session_key`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`task_runs`,kind:`column`,value:{name:`parent_flow_id`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`task_runs`,kind:`column`,value:{name:`parent_task_id`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`task_runs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`task_runs`,kind:`column`,value:{name:`requester_agent_id`,type:`text`,nullable:true,identity:false,default:null,position:12}},{table:`task_runs`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:true,identity:false,default:null,position:13}},{table:`task_runs`,kind:`column`,value:{name:`execution_owner_host`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`task_runs`,kind:`column`,value:{name:`execution_owner_pid`,type:`bigint`,nullable:true,identity:false,default:null,position:15}},{table:`task_runs`,kind:`column`,value:{name:`execution_owner_start_identity`,type:`bigint`,nullable:true,identity:false,default:null,position:16}},{table:`task_runs`,kind:`column`,value:{name:`label`,type:`text`,nullable:true,identity:false,default:null,position:17}},{table:`task_runs`,kind:`column`,value:{name:`task`,type:`text`,nullable:false,identity:false,default:null,position:18}},{table:`task_runs`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:19}},{table:`task_runs`,kind:`column`,value:{name:`delivery_status`,type:`text`,nullable:false,identity:false,default:null,position:20}},{table:`task_runs`,kind:`column`,value:{name:`notify_policy`,type:`text`,nullable:false,identity:false,default:null,position:21}},{table:`task_runs`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:22}},{table:`task_runs`,kind:`column`,value:{name:`started_at`,type:`bigint`,nullable:true,identity:false,default:null,position:23}},{table:`task_runs`,kind:`column`,value:{name:`ended_at`,type:`bigint`,nullable:true,identity:false,default:null,position:24}},{table:`task_runs`,kind:`column`,value:{name:`last_event_at`,type:`bigint`,nullable:true,identity:false,default:null,position:25}},{table:`task_runs`,kind:`column`,value:{name:`cleanup_after`,type:`bigint`,nullable:true,identity:false,default:null,position:26}},{table:`task_runs`,kind:`column`,value:{name:`tool_use_count`,type:`bigint`,nullable:true,identity:false,default:null,position:27}},{table:`task_runs`,kind:`column`,value:{name:`last_tool_name`,type:`text`,nullable:true,identity:false,default:null,position:28}},{table:`task_runs`,kind:`column`,value:{name:`error`,type:`text`,nullable:true,identity:false,default:null,position:29}},{table:`task_runs`,kind:`column`,value:{name:`progress_summary`,type:`text`,nullable:true,identity:false,default:null,position:30}},{table:`task_runs`,kind:`column`,value:{name:`terminal_summary`,type:`text`,nullable:true,identity:false,default:null,position:31}},{table:`task_runs`,kind:`column`,value:{name:`terminal_outcome`,type:`text`,nullable:true,identity:false,default:null,position:32}},{table:`task_runs`,kind:`column`,value:{name:`detail_json`,type:`text`,nullable:true,identity:false,default:null,position:33}},{table:`task_runs`,kind:`primaryKey`,value:[`task_id`]},{table:`task_runs`,kind:`indexes`,value:4},{table:`task_runs`,kind:`checks`,value:0},{table:`template_cron_refs`,kind:`table`,value:null},{table:`template_cron_refs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`template_cron_refs`,kind:`column`,value:{name:`manifest_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`template_cron_refs`,kind:`column`,value:{name:`schema_version`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`template_cron_refs`,kind:`column`,value:{name:`declaration_key`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`template_cron_refs`,kind:`column`,value:{name:`scheduler_job_id`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`template_cron_refs`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`template_cron_refs`,kind:`column`,value:{name:`job_json`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`template_cron_refs`,kind:`column`,value:{name:`error`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`template_cron_refs`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:9}},{table:`template_cron_refs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`template_cron_refs`,kind:`primaryKey`,value:[`agent_id`,`manifest_id`]},{table:`template_cron_refs`,kind:`unique`,value:[`declaration_key`]},{table:`template_cron_refs`,kind:`unique`,value:[`scheduler_job_id`]},{table:`template_cron_refs`,kind:`indexes`,value:3},{table:`template_cron_refs`,kind:`checks`,value:0},{table:`template_installs`,kind:`table`,value:null},{table:`template_installs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`template_installs`,kind:`column`,value:{name:`schema_version`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`template_installs`,kind:`column`,value:{name:`source_kind`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`template_installs`,kind:`column`,value:{name:`template_name`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`template_installs`,kind:`column`,value:{name:`template_version`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`template_installs`,kind:`column`,value:{name:`package_root`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`template_installs`,kind:`column`,value:{name:`manifest_path`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`template_installs`,kind:`column`,value:{name:`integrity_kind`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`template_installs`,kind:`column`,value:{name:`integrity`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`template_installs`,kind:`column`,value:{name:`source_byte_length`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`template_installs`,kind:`column`,value:{name:`manifest_schema_version`,type:`bigint`,nullable:false,identity:false,default:null,position:11}},{table:`template_installs`,kind:`column`,value:{name:`plan_integrity`,type:`text`,nullable:false,identity:false,default:null,position:12}},{table:`template_installs`,kind:`column`,value:{name:`workspace`,type:`text`,nullable:false,identity:false,default:null,position:13}},{table:`template_installs`,kind:`column`,value:{name:`agent_config_digest`,type:`text`,nullable:false,identity:false,default:null,position:14}},{table:`template_installs`,kind:`column`,value:{name:`agent_owned_paths_json`,type:`text`,nullable:false,identity:false,default:null,position:15}},{table:`template_installs`,kind:`column`,value:{name:`bootstrap_source_path`,type:`text`,nullable:true,identity:false,default:null,position:16}},{table:`template_installs`,kind:`column`,value:{name:`bootstrap_content_digest`,type:`text`,nullable:true,identity:false,default:null,position:17}},{table:`template_installs`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:18}},{table:`template_installs`,kind:`column`,value:{name:`added_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:19}},{table:`template_installs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:20}},{table:`template_installs`,kind:`primaryKey`,value:[`agent_id`]},{table:`template_installs`,kind:`unique`,value:[`workspace`]},{table:`template_installs`,kind:`indexes`,value:2},{table:`template_installs`,kind:`checks`,value:1},{table:`template_mcp_server_refs`,kind:`table`,value:null},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`name`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`schema_version`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`config_digest`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`relationship`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`origin`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`independent_owner`,type:`bigint`,nullable:false,identity:false,default:`0`,position:7}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`error`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:11}},{table:`template_mcp_server_refs`,kind:`primaryKey`,value:[`agent_id`,`name`]},{table:`template_mcp_server_refs`,kind:`indexes`,value:1},{table:`template_mcp_server_refs`,kind:`checks`,value:3},{table:`template_package_refs`,kind:`table`,value:null},{table:`template_package_refs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`template_package_refs`,kind:`column`,value:{name:`package_kind`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`template_package_refs`,kind:`column`,value:{name:`package_source`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`template_package_refs`,kind:`column`,value:{name:`package_ref`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`template_package_refs`,kind:`column`,value:{name:`package_version`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`template_package_refs`,kind:`column`,value:{name:`package_integrity`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`template_package_refs`,kind:`column`,value:{name:`schema_version`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`template_package_refs`,kind:`column`,value:{name:`template_name`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`template_package_refs`,kind:`column`,value:{name:`package_status`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`template_package_refs`,kind:`column`,value:{name:`relationship`,type:`text`,nullable:false,identity:false,default:null,position:10}},{table:`template_package_refs`,kind:`column`,value:{name:`origin`,type:`text`,nullable:false,identity:false,default:null,position:11}},{table:`template_package_refs`,kind:`column`,value:{name:`independent_owner`,type:`bigint`,nullable:false,identity:false,default:null,position:12}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_id`,type:`text`,nullable:true,identity:false,default:null,position:13}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_format`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_detected_format`,type:`text`,nullable:true,identity:false,default:null,position:15}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_mapped_json`,type:`text`,nullable:true,identity:false,default:null,position:16}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_unavailable_json`,type:`text`,nullable:true,identity:false,default:null,position:17}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_adapter_identity`,type:`text`,nullable:true,identity:false,default:null,position:18}},{table:`template_package_refs`,kind:`column`,value:{name:`installed_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:19}},{table:`template_package_refs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:20}},{table:`template_package_refs`,kind:`primaryKey`,value:[`agent_id`,`package_kind`,`package_source`,`package_ref`,`package_version`]},{table:`template_package_refs`,kind:`indexes`,value:1},{table:`template_package_refs`,kind:`checks`,value:3},{table:`template_workspace_files`,kind:`table`,value:null},{table:`template_workspace_files`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`template_workspace_files`,kind:`column`,value:{name:`target_path`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`template_workspace_files`,kind:`column`,value:{name:`schema_version`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`template_workspace_files`,kind:`column`,value:{name:`workspace`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`template_workspace_files`,kind:`column`,value:{name:`source_path`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`template_workspace_files`,kind:`column`,value:{name:`content_digest`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`template_workspace_files`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`template_workspace_files`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:8}},{table:`template_workspace_files`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:9}},{table:`template_workspace_files`,kind:`primaryKey`,value:[`agent_id`,`target_path`]},{table:`template_workspace_files`,kind:`indexes`,value:1},{table:`template_workspace_files`,kind:`checks`,value:0},{table:`update_runs`,kind:`table`,value:null},{table:`update_runs`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`update_runs`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`update_runs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`update_runs`,kind:`column`,value:{name:`trigger`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`update_runs`,kind:`column`,value:{name:`phase`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`update_runs`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`update_runs`,kind:`column`,value:{name:`reason`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`update_runs`,kind:`column`,value:{name:`origin_json`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`update_runs`,kind:`column`,value:{name:`target_json`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`update_runs`,kind:`column`,value:{name:`before_json`,type:`text`,nullable:false,identity:false,default:null,position:10}},{table:`update_runs`,kind:`column`,value:{name:`after_json`,type:`text`,nullable:false,identity:false,default:null,position:11}},{table:`update_runs`,kind:`column`,value:{name:`steps_json`,type:`text`,nullable:false,identity:false,default:null,position:12}},{table:`update_runs`,kind:`column`,value:{name:`verification_json`,type:`text`,nullable:false,identity:false,default:null,position:13}},{table:`update_runs`,kind:`column`,value:{name:`repair_json`,type:`text`,nullable:false,identity:false,default:null,position:14}},{table:`update_runs`,kind:`column`,value:{name:`confirmed_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:15}},{table:`update_runs`,kind:`column`,value:{name:`finished_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:16}},{table:`update_runs`,kind:`column`,value:{name:`downtime_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:17}},{table:`update_runs`,kind:`primaryKey`,value:[`run_id`]},{table:`update_runs`,kind:`indexes`,value:3},{table:`update_runs`,kind:`checks`,value:11},{table:`user_background_images`,kind:`table`,value:null},{table:`user_background_images`,kind:`column`,value:{name:`profile_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`user_background_images`,kind:`column`,value:{name:`asset_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`user_background_images`,kind:`column`,value:{name:`image`,type:`bytea`,nullable:false,identity:false,default:null,position:3}},{table:`user_background_images`,kind:`column`,value:{name:`width`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`user_background_images`,kind:`column`,value:{name:`height`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`user_background_images`,kind:`primaryKey`,value:[`profile_id`]},{table:`user_background_images`,kind:`unique`,value:[`asset_id`]},{table:`user_background_images`,kind:`foreignKey`,value:{columns:[`profile_id`],target:`user_profiles`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`user_background_images`,kind:`indexes`,value:2},{table:`user_background_images`,kind:`checks`,value:3},{table:`user_preferences`,kind:`table`,value:null},{table:`user_preferences`,kind:`column`,value:{name:`profile_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`user_preferences`,kind:`column`,value:{name:`pref_key`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`user_preferences`,kind:`column`,value:{name:`value_json`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`user_preferences`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`user_preferences`,kind:`primaryKey`,value:[`profile_id`,`pref_key`]},{table:`user_preferences`,kind:`indexes`,value:1},{table:`user_preferences`,kind:`checks`,value:0},{table:`user_profile_emails`,kind:`table`,value:null},{table:`user_profile_emails`,kind:`column`,value:{name:`email`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`user_profile_emails`,kind:`column`,value:{name:`profile_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`user_profile_emails`,kind:`column`,value:{name:`binding_id`,type:`text`,nullable:true,identity:false,default:null,position:3}},{table:`user_profile_emails`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`user_profile_emails`,kind:`primaryKey`,value:[`email`]},{table:`user_profile_emails`,kind:`indexes`,value:2},{table:`user_profile_emails`,kind:`checks`,value:0},{table:`user_profile_identities`,kind:`table`,value:null},{table:`user_profile_identities`,kind:`column`,value:{name:`provider`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`user_profile_identities`,kind:`column`,value:{name:`subject`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`user_profile_identities`,kind:`column`,value:{name:`profile_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`user_profile_identities`,kind:`column`,value:{name:`canonical_login`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`user_profile_identities`,kind:`column`,value:{name:`verified_email_json`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`user_profile_identities`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`user_profile_identities`,kind:`column`,value:{name:`authorization_id`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`user_profile_identities`,kind:`column`,value:{name:`authorization_basis_json`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`user_profile_identities`,kind:`primaryKey`,value:[`provider`,`subject`]},{table:`user_profile_identities`,kind:`indexes`,value:3},{table:`user_profile_identities`,kind:`checks`,value:0},{table:`user_profiles`,kind:`table`,value:null},{table:`user_profiles`,kind:`column`,value:{name:`id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`user_profiles`,kind:`column`,value:{name:`display_name`,type:`text`,nullable:true,identity:false,default:null,position:2}},{table:`user_profiles`,kind:`column`,value:{name:`primary_github_account_id`,type:`bigint`,nullable:true,identity:false,default:null,position:3}},{table:`user_profiles`,kind:`column`,value:{name:`avatar`,type:`bytea`,nullable:true,identity:false,default:null,position:4}},{table:`user_profiles`,kind:`column`,value:{name:`avatar_mime`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`user_profiles`,kind:`column`,value:{name:`avatar_sha256`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`user_profiles`,kind:`column`,value:{name:`merged_into`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`user_profiles`,kind:`column`,value:{name:`role`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`user_profiles`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:9}},{table:`user_profiles`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`user_profiles`,kind:`primaryKey`,value:[`id`]},{table:`user_profiles`,kind:`indexes`,value:1},{table:`user_profiles`,kind:`checks`,value:0},{table:`web_push_approval_deliveries`,kind:`table`,value:null},{table:`web_push_approval_deliveries`,kind:`column`,value:{name:`approval_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`web_push_approval_deliveries`,kind:`column`,value:{name:`subscription_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`web_push_approval_deliveries`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`web_push_approval_deliveries`,kind:`column`,value:{name:`user_profile_id`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`web_push_approval_deliveries`,kind:`column`,value:{name:`prepared_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`web_push_approval_deliveries`,kind:`primaryKey`,value:[`approval_id`,`subscription_id`]},{table:`web_push_approval_deliveries`,kind:`foreignKey`,value:{columns:[`subscription_id`],target:`web_push_subscriptions`,targetColumns:[`subscription_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`web_push_approval_deliveries`,kind:`foreignKey`,value:{columns:[`approval_id`],target:`operator_approvals`,targetColumns:[`approval_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`web_push_approval_deliveries`,kind:`indexes`,value:2},{table:`web_push_approval_deliveries`,kind:`checks`,value:0},{table:`web_push_subscriptions`,kind:`table`,value:null},{table:`web_push_subscriptions`,kind:`column`,value:{name:`endpoint_hash`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`subscription_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`endpoint`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`p256dh`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`auth`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`user_profile_id`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`preferences_json`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:9}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`web_push_subscriptions`,kind:`primaryKey`,value:[`endpoint_hash`]},{table:`web_push_subscriptions`,kind:`unique`,value:[`subscription_id`]},{table:`web_push_subscriptions`,kind:`indexes`,value:3},{table:`web_push_subscriptions`,kind:`checks`,value:0},{table:`worker_environment_credentials`,kind:`table`,value:null},{table:`worker_environment_credentials`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`credential_hash`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`bundle_hash`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`rpc_set_version`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`delivered_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:8}},{table:`worker_environment_credentials`,kind:`primaryKey`,value:[`environment_id`]},{table:`worker_environment_credentials`,kind:`unique`,value:[`credential_hash`]},{table:`worker_environment_credentials`,kind:`foreignKey`,value:{columns:[`environment_id`],target:`worker_environments`,targetColumns:[`environment_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`worker_environment_credentials`,kind:`indexes`,value:2},{table:`worker_environment_credentials`,kind:`checks`,value:4},{table:`worker_environment_session_attachments`,kind:`table`,value:null},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`session_lifecycle_revision`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`generation`,type:`bigint`,nullable:false,identity:false,default:null,position:6}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`last_used_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:8}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`closed_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:9}},{table:`worker_environment_session_attachments`,kind:`primaryKey`,value:[`session_id`]},{table:`worker_environment_session_attachments`,kind:`unique`,value:[`environment_id`]},{table:`worker_environment_session_attachments`,kind:`foreignKey`,value:{columns:[`environment_id`],target:`worker_environments`,targetColumns:[`environment_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`worker_environment_session_attachments`,kind:`indexes`,value:3},{table:`worker_environment_session_attachments`,kind:`checks`,value:1},{table:`worker_environment_ssh_fallback_ports`,kind:`table`,value:null},{table:`worker_environment_ssh_fallback_ports`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`worker_environment_ssh_fallback_ports`,kind:`column`,value:{name:`position`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`worker_environment_ssh_fallback_ports`,kind:`column`,value:{name:`port`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`worker_environment_ssh_fallback_ports`,kind:`primaryKey`,value:[`environment_id`,`position`]},{table:`worker_environment_ssh_fallback_ports`,kind:`unique`,value:[`environment_id`,`port`]},{table:`worker_environment_ssh_fallback_ports`,kind:`foreignKey`,value:{columns:[`environment_id`],target:`worker_environments`,targetColumns:[`environment_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`worker_environment_ssh_fallback_ports`,kind:`indexes`,value:2},{table:`worker_environment_ssh_fallback_ports`,kind:`checks`,value:2},{table:`worker_environments`,kind:`table`,value:null},{table:`worker_environments`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`worker_environments`,kind:`column`,value:{name:`provider_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`worker_environments`,kind:`column`,value:{name:`profile_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`worker_environments`,kind:`column`,value:{name:`profile_snapshot_json`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`worker_environments`,kind:`column`,value:{name:`last_activated_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:5}},{table:`worker_environments`,kind:`column`,value:{name:`preparation_key`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`worker_environments`,kind:`column`,value:{name:`preparation_purpose`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`worker_environments`,kind:`column`,value:{name:`preparation_demand_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:8}},{table:`worker_environments`,kind:`column`,value:{name:`preparation_expires_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:9}},{table:`worker_environments`,kind:`column`,value:{name:`preparation_consumed_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:10}},{table:`worker_environments`,kind:`column`,value:{name:`provision_operation_id`,type:`text`,nullable:false,identity:false,default:null,position:11}},{table:`worker_environments`,kind:`column`,value:{name:`lease_id`,type:`text`,nullable:true,identity:false,default:null,position:12}},{table:`worker_environments`,kind:`column`,value:{name:`node_setup_id`,type:`text`,nullable:true,identity:false,default:null,position:13}},{table:`worker_environments`,kind:`column`,value:{name:`node_device_id`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`worker_environments`,kind:`column`,value:{name:`ssh_host`,type:`text`,nullable:true,identity:false,default:null,position:15}},{table:`worker_environments`,kind:`column`,value:{name:`ssh_port`,type:`bigint`,nullable:true,identity:false,default:null,position:16}},{table:`worker_environments`,kind:`column`,value:{name:`ssh_user`,type:`text`,nullable:true,identity:false,default:null,position:17}},{table:`worker_environments`,kind:`column`,value:{name:`ssh_host_key`,type:`text`,nullable:true,identity:false,default:null,position:18}},{table:`worker_environments`,kind:`column`,value:{name:`ssh_key_ref_json`,type:`text`,nullable:true,identity:false,default:null,position:19}},{table:`worker_environments`,kind:`column`,value:{name:`desktop_json`,type:`text`,nullable:true,identity:false,default:null,position:20}},{table:`worker_environments`,kind:`column`,value:{name:`state`,type:`text`,nullable:false,identity:false,default:null,position:21}},{table:`worker_environments`,kind:`column`,value:{name:`bootstrap_bundle_hash`,type:`text`,nullable:true,identity:false,default:null,position:22}},{table:`worker_environments`,kind:`column`,value:{name:`bootstrap_openclaw_version`,type:`text`,nullable:true,identity:false,default:null,position:23}},{table:`worker_environments`,kind:`column`,value:{name:`bootstrap_protocol_features_json`,type:`text`,nullable:true,identity:false,default:null,position:24}},{table:`worker_environments`,kind:`column`,value:{name:`bootstrap_install_kind`,type:`text`,nullable:true,identity:false,default:null,position:25}},{table:`worker_environments`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:false,identity:false,default:`0`,position:26}},{table:`worker_environments`,kind:`column`,value:{name:`teardown_terminal_state`,type:`text`,nullable:true,identity:false,default:null,position:27}},{table:`worker_environments`,kind:`column`,value:{name:`attached_session_ids_json`,type:`text`,nullable:false,identity:false,default:`'[]'`,position:28}},{table:`worker_environments`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:29}},{table:`worker_environments`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:30}},{table:`worker_environments`,kind:`column`,value:{name:`state_changed_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:31}},{table:`worker_environments`,kind:`column`,value:{name:`idle_since_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:32}},{table:`worker_environments`,kind:`column`,value:{name:`destroy_requested_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:33}},{table:`worker_environments`,kind:`column`,value:{name:`last_error`,type:`text`,nullable:true,identity:false,default:null,position:34}},{table:`worker_environments`,kind:`column`,value:{name:`shared_host`,type:`bigint`,nullable:true,identity:false,default:null,position:35}},{table:`worker_environments`,kind:`column`,value:{name:`resource_receipt_json`,type:`text`,nullable:true,identity:false,default:null,position:36}},{table:`worker_environments`,kind:`column`,value:{name:`retention_json`,type:`text`,nullable:true,identity:false,default:null,position:37}},{table:`worker_environments`,kind:`column`,value:{name:`provision_source_json`,type:`text`,nullable:true,identity:false,default:null,position:38}},{table:`worker_environments`,kind:`primaryKey`,value:[`environment_id`]},{table:`worker_environments`,kind:`unique`,value:[`provision_operation_id`]},{table:`worker_environments`,kind:`indexes`,value:4},{table:`worker_environments`,kind:`checks`,value:5},{table:`worker_inference_turns`,kind:`table`,value:null},{table:`worker_inference_turns`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`worker_inference_turns`,kind:`column`,value:{name:`run_epoch`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`worker_inference_turns`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`worker_inference_turns`,kind:`column`,value:{name:`turn_id`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`worker_inference_turns`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`worker_inference_turns`,kind:`column`,value:{name:`request_hash`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`worker_inference_turns`,kind:`column`,value:{name:`state`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`worker_inference_turns`,kind:`column`,value:{name:`terminal_json`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`worker_inference_turns`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:9}},{table:`worker_inference_turns`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:10}},{table:`worker_inference_turns`,kind:`primaryKey`,value:[`session_id`,`run_epoch`,`run_id`,`turn_id`]},{table:`worker_inference_turns`,kind:`foreignKey`,value:{columns:[`environment_id`],target:`worker_environments`,targetColumns:[`environment_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`worker_inference_turns`,kind:`indexes`,value:2},{table:`worker_inference_turns`,kind:`checks`,value:5},{table:`worker_session_placement_moves`,kind:`table`,value:null},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`operation_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`source_generation`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`source_environment_id`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`source_owner_epoch`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`target_kind`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`target_id`,type:`text`,nullable:true,identity:false,default:null,position:7}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`target_machine_class`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`target_os`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`abandon_source`,type:`bigint`,nullable:true,identity:false,default:null,position:10}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`last_error`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:12}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:13}},{table:`worker_session_placement_moves`,kind:`primaryKey`,value:[`operation_id`]},{table:`worker_session_placement_moves`,kind:`unique`,value:[`session_id`]},{table:`worker_session_placement_moves`,kind:`foreignKey`,value:{columns:[`session_id`],target:`worker_session_placements`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`worker_session_placement_moves`,kind:`indexes`,value:2},{table:`worker_session_placement_moves`,kind:`checks`,value:5},{table:`worker_session_placements`,kind:`table`,value:null},{table:`worker_session_placements`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`worker_session_placements`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`worker_session_placements`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`worker_session_placements`,kind:`column`,value:{name:`execution_mode`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`worker_session_placements`,kind:`column`,value:{name:`state`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`worker_session_placements`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`worker_session_placements`,kind:`column`,value:{name:`transition_generation`,type:`bigint`,nullable:false,identity:false,default:`0`,position:7}},{table:`worker_session_placements`,kind:`column`,value:{name:`active_owner_epoch`,type:`bigint`,nullable:true,identity:false,default:null,position:8}},{table:`worker_session_placements`,kind:`column`,value:{name:`workspace_base_manifest_ref`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`worker_session_placements`,kind:`column`,value:{name:`remote_workspace_dir`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`worker_session_placements`,kind:`column`,value:{name:`worker_bundle_hash`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`worker_session_placements`,kind:`column`,value:{name:`last_transcript_ack_cursor`,type:`bigint`,nullable:true,identity:false,default:null,position:12}},{table:`worker_session_placements`,kind:`column`,value:{name:`last_live_event_ack_cursor`,type:`bigint`,nullable:true,identity:false,default:null,position:13}},{table:`worker_session_placements`,kind:`column`,value:{name:`recovery_error`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`worker_session_placements`,kind:`column`,value:{name:`turn_claim_owner`,type:`text`,nullable:true,identity:false,default:null,position:15}},{table:`worker_session_placements`,kind:`column`,value:{name:`turn_claim_id`,type:`text`,nullable:true,identity:false,default:null,position:16}},{table:`worker_session_placements`,kind:`column`,value:{name:`turn_claim_run_id`,type:`text`,nullable:true,identity:false,default:null,position:17}},{table:`worker_session_placements`,kind:`column`,value:{name:`turn_claim_generation`,type:`bigint`,nullable:true,identity:false,default:null,position:18}},{table:`worker_session_placements`,kind:`column`,value:{name:`turn_claim_owner_epoch`,type:`bigint`,nullable:true,identity:false,default:null,position:19}},{table:`worker_session_placements`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:20}},{table:`worker_session_placements`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:21}},{table:`worker_session_placements`,kind:`column`,value:{name:`state_changed_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:22}},{table:`worker_session_placements`,kind:`column`,value:{name:`terminal_reason`,type:`text`,nullable:true,identity:false,default:null,position:23}},{table:`worker_session_placements`,kind:`column`,value:{name:`terminal_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:24}},{table:`worker_session_placements`,kind:`primaryKey`,value:[`session_id`]},{table:`worker_session_placements`,kind:`indexes`,value:4},{table:`worker_session_placements`,kind:`checks`,value:12},{table:`worker_session_tool_operations`,kind:`table`,value:null},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`source_session_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`source_claim_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`tool_call_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`tool_name`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`request_digest`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`operation_seed`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`child_session_key`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`result_json`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`gateway_instance_id`,type:`text`,nullable:false,identity:false,default:null,position:10}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:11}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:12}},{table:`worker_session_tool_operations`,kind:`primaryKey`,value:[`source_session_id`,`source_claim_id`,`tool_call_id`]},{table:`worker_session_tool_operations`,kind:`foreignKey`,value:{columns:[`source_session_id`],target:`worker_session_placements`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`worker_session_tool_operations`,kind:`indexes`,value:1},{table:`worker_session_tool_operations`,kind:`checks`,value:2},{table:`worker_transcript_commit_heads`,kind:`table`,value:null},{table:`worker_transcript_commit_heads`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`worker_transcript_commit_heads`,kind:`column`,value:{name:`run_epoch`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`worker_transcript_commit_heads`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`worker_transcript_commit_heads`,kind:`column`,value:{name:`next_seq`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`worker_transcript_commit_heads`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`worker_transcript_commit_heads`,kind:`primaryKey`,value:[`session_id`,`run_epoch`]},{table:`worker_transcript_commit_heads`,kind:`indexes`,value:1},{table:`worker_transcript_commit_heads`,kind:`checks`,value:3},{table:`worker_transcript_commits`,kind:`table`,value:null},{table:`worker_transcript_commits`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`run_epoch`,type:`bigint`,nullable:false,identity:false,default:null,position:2}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`seq`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`request_hash`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`state`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`result_json`,type:`text`,nullable:true,identity:false,default:null,position:6}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:7}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:8}},{table:`worker_transcript_commits`,kind:`primaryKey`,value:[`session_id`,`run_epoch`,`seq`]},{table:`worker_transcript_commits`,kind:`foreignKey`,value:{columns:[`session_id`,`run_epoch`],target:`worker_transcript_commit_heads`,targetColumns:[`session_id`,`run_epoch`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`worker_transcript_commits`,kind:`indexes`,value:1},{table:`worker_transcript_commits`,kind:`checks`,value:6},{table:`worker_turn_tool_authorities`,kind:`table`,value:null},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`claim_id`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`tool_names_json`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:8}},{table:`worker_turn_tool_authorities`,kind:`primaryKey`,value:[`session_id`]},{table:`worker_turn_tool_authorities`,kind:`foreignKey`,value:{columns:[`session_id`],target:`worker_session_placements`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`worker_turn_tool_authorities`,kind:`indexes`,value:1},{table:`worker_turn_tool_authorities`,kind:`checks`,value:2},{table:`worker_workspace_pending_results`,kind:`table`,value:null},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`claim_id`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`gateway_instance_id`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`recovery_requested_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:8}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`workspace_accepted_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:9}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`staged_result_ref`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`repository_workspace_id`,type:`text`,nullable:true,identity:false,default:null,position:11}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:12}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`repository_disk_authority_json`,type:`text`,nullable:true,identity:false,default:null,position:13}},{table:`worker_workspace_pending_results`,kind:`primaryKey`,value:[`session_id`]},{table:`worker_workspace_pending_results`,kind:`foreignKey`,value:{columns:[`session_id`],target:`worker_session_placements`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`worker_workspace_pending_results`,kind:`indexes`,value:1},{table:`worker_workspace_pending_results`,kind:`checks`,value:2},{table:`worker_workspace_reconciliations`,kind:`table`,value:null},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:false,identity:false,default:null,position:4}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`base_manifest_ref`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`current_manifest_ref`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`plan_json`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`base_pack`,type:`bytea`,nullable:false,identity:false,default:null,position:8}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:9}},{table:`worker_workspace_reconciliations`,kind:`primaryKey`,value:[`session_id`]},{table:`worker_workspace_reconciliations`,kind:`foreignKey`,value:{columns:[`session_id`],target:`worker_session_placements`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`worker_workspace_reconciliations`,kind:`indexes`,value:1},{table:`worker_workspace_reconciliations`,kind:`checks`,value:3},{table:`workspace_generated_bootstrap_hashes`,kind:`table`,value:null},{table:`workspace_generated_bootstrap_hashes`,kind:`column`,value:{name:`workspace_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`workspace_generated_bootstrap_hashes`,kind:`column`,value:{name:`filename`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`workspace_generated_bootstrap_hashes`,kind:`column`,value:{name:`sha256`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`workspace_generated_bootstrap_hashes`,kind:`primaryKey`,value:[`workspace_key`,`filename`]},{table:`workspace_generated_bootstrap_hashes`,kind:`foreignKey`,value:{columns:[`workspace_key`],target:`workspace_setup_state`,targetColumns:[`workspace_key`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:false,deferred:false}},{table:`workspace_generated_bootstrap_hashes`,kind:`indexes`,value:1},{table:`workspace_generated_bootstrap_hashes`,kind:`checks`,value:0},{table:`workspace_path_aliases`,kind:`table`,value:null},{table:`workspace_path_aliases`,kind:`column`,value:{name:`alias_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`workspace_path_aliases`,kind:`column`,value:{name:`alias_path`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`workspace_path_aliases`,kind:`column`,value:{name:`workspace_key`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`workspace_path_aliases`,kind:`column`,value:{name:`workspace_path`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`workspace_path_aliases`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:false,identity:false,default:null,position:5}},{table:`workspace_path_aliases`,kind:`primaryKey`,value:[`alias_key`]},{table:`workspace_path_aliases`,kind:`indexes`,value:2},{table:`workspace_path_aliases`,kind:`checks`,value:0},{table:`workspace_setup_state`,kind:`table`,value:null},{table:`workspace_setup_state`,kind:`column`,value:{name:`workspace_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`workspace_setup_state`,kind:`column`,value:{name:`workspace_path`,type:`text`,nullable:true,identity:false,default:null,position:2}},{table:`workspace_setup_state`,kind:`column`,value:{name:`version`,type:`bigint`,nullable:true,identity:false,default:null,position:3}},{table:`workspace_setup_state`,kind:`column`,value:{name:`bootstrap_seeded_at`,type:`text`,nullable:true,identity:false,default:null,position:4}},{table:`workspace_setup_state`,kind:`column`,value:{name:`setup_completed_at`,type:`text`,nullable:true,identity:false,default:null,position:5}},{table:`workspace_setup_state`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:true,identity:false,default:null,position:6}},{table:`workspace_setup_state`,kind:`column`,value:{name:`attested_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:7}},{table:`workspace_setup_state`,kind:`column`,value:{name:`attestation_updated_at_ms`,type:`bigint`,nullable:true,identity:false,default:null,position:8}},{table:`workspace_setup_state`,kind:`column`,value:{name:`bootstrap_deferred`,type:`bigint`,nullable:true,identity:false,default:null,position:9}},{table:`workspace_setup_state`,kind:`primaryKey`,value:[`workspace_key`]},{table:`workspace_setup_state`,kind:`indexes`,value:2},{table:`workspace_setup_state`,kind:`checks`,value:1},{table:`worktree_provisioned_file_chunks`,kind:`table`,value:null},{table:`worktree_provisioned_file_chunks`,kind:`column`,value:{name:`worktree_id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`worktree_provisioned_file_chunks`,kind:`column`,value:{name:`path`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`worktree_provisioned_file_chunks`,kind:`column`,value:{name:`chunk_index`,type:`bigint`,nullable:false,identity:false,default:null,position:3}},{table:`worktree_provisioned_file_chunks`,kind:`column`,value:{name:`data`,type:`bytea`,nullable:false,identity:false,default:null,position:4}},{table:`worktree_provisioned_file_chunks`,kind:`primaryKey`,value:[`worktree_id`,`path`,`chunk_index`]},{table:`worktree_provisioned_file_chunks`,kind:`indexes`,value:1},{table:`worktree_provisioned_file_chunks`,kind:`checks`,value:1},{table:`worktree_templates`,kind:`table`,value:null},{table:`worktree_templates`,kind:`column`,value:{name:`cache_key`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`worktree_templates`,kind:`column`,value:{name:`id`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`worktree_templates`,kind:`column`,value:{name:`repo_root`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`worktree_templates`,kind:`column`,value:{name:`common_dir`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`worktree_templates`,kind:`column`,value:{name:`worktree_root`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`worktree_templates`,kind:`column`,value:{name:`path`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`worktree_templates`,kind:`column`,value:{name:`backend`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`worktree_templates`,kind:`column`,value:{name:`source_commit`,type:`text`,nullable:false,identity:false,default:null,position:8}},{table:`worktree_templates`,kind:`column`,value:{name:`content_key`,type:`text`,nullable:false,identity:false,default:null,position:9}},{table:`worktree_templates`,kind:`column`,value:{name:`status`,type:`text`,nullable:false,identity:false,default:null,position:10}},{table:`worktree_templates`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:11}},{table:`worktree_templates`,kind:`column`,value:{name:`last_used_at`,type:`bigint`,nullable:false,identity:false,default:null,position:12}},{table:`worktree_templates`,kind:`primaryKey`,value:[`cache_key`]},{table:`worktree_templates`,kind:`unique`,value:[`id`]},{table:`worktree_templates`,kind:`indexes`,value:2},{table:`worktree_templates`,kind:`checks`,value:1},{table:`worktrees`,kind:`table`,value:null},{table:`worktrees`,kind:`column`,value:{name:`id`,type:`text`,nullable:false,identity:false,default:null,position:1}},{table:`worktrees`,kind:`column`,value:{name:`repo_fingerprint`,type:`text`,nullable:false,identity:false,default:null,position:2}},{table:`worktrees`,kind:`column`,value:{name:`repo_root`,type:`text`,nullable:false,identity:false,default:null,position:3}},{table:`worktrees`,kind:`column`,value:{name:`path`,type:`text`,nullable:false,identity:false,default:null,position:4}},{table:`worktrees`,kind:`column`,value:{name:`branch`,type:`text`,nullable:false,identity:false,default:null,position:5}},{table:`worktrees`,kind:`column`,value:{name:`base_ref`,type:`text`,nullable:false,identity:false,default:null,position:6}},{table:`worktrees`,kind:`column`,value:{name:`owner_kind`,type:`text`,nullable:false,identity:false,default:null,position:7}},{table:`worktrees`,kind:`column`,value:{name:`owner_id`,type:`text`,nullable:true,identity:false,default:null,position:8}},{table:`worktrees`,kind:`column`,value:{name:`snapshot_ref`,type:`text`,nullable:true,identity:false,default:null,position:9}},{table:`worktrees`,kind:`column`,value:{name:`provisioned_paths_json`,type:`text`,nullable:true,identity:false,default:null,position:10}},{table:`worktrees`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:false,identity:false,default:null,position:11}},{table:`worktrees`,kind:`column`,value:{name:`last_active_at`,type:`bigint`,nullable:false,identity:false,default:null,position:12}},{table:`worktrees`,kind:`column`,value:{name:`removed_at`,type:`bigint`,nullable:true,identity:false,default:null,position:13}},{table:`worktrees`,kind:`column`,value:{name:`run_end_cleanup_json`,type:`text`,nullable:true,identity:false,default:null,position:14}},{table:`worktrees`,kind:`column`,value:{name:`gc_protection_json`,type:`text`,nullable:true,identity:false,default:null,position:15}},{table:`worktrees`,kind:`primaryKey`,value:[`id`]},{table:`worktrees`,kind:`indexes`,value:3},{table:`worktrees`,kind:`checks`,value:1}];Object.defineProperty(this,"expectedCatalog",{value:e,enumerable:true,configurable:true,writable:true});return e}};
//!src/state/openclaw-state-db-engine.ts
const recovery=`Use the matching OpenClaw version or restore the matching PostgreSQL schema and anchor.`;function isStatePostgres(){return stateEngineInput()!==void 0}function assertStateFileSnapshotAllowed(){if(stateEngineInput())requireNativeDatabaseFile(`postgres`,`file-snapshot`)}function inspectStateSqlite(e){const t=getAdmittedSqliteSchemaFacts(e)??captureSqliteSchemaFacts(e);return{hasEngineAnchor:t.tables.has(`openclaw_engine_anchor`),hasExistingData:[...t.tables,...t.views,...t.triggers.keys()].some(e=>e!==`openclaw_engine_anchor`&&!e.startsWith(`sqlite_`))}}function admitStatePostgres(e,t){if(!t&&getStateRuntimeSchemaAdmission(e)?.startupReady)return;const n=withPostgresSchemaAdmissionRetry(e,()=>{const t=getPostgresPhysicalFacts(e);if(!t)throw new PostgresSchemaAdmissionUnavailableError(`Missing PostgreSQL state admission. ${recovery}`);return t});const r=new Set(n.catalog.filter(e=>e.kind===`table`).map(e=>e.table));const i=new Set(statePostgresRuntime.fragments.flatMap(e=>e.tables.some(e=>r.has(e))?[]:e.tables));if(n.version===40)assertPostgresCatalog(n.catalog.filter(e=>!e.kind.endsWith(`Definition`)&&e.table!==`openclaw_schema_meta`),statePostgresRuntime.expectedCatalog.filter(e=>!i.has(e.table)));if(t){const t=Date.now();e.prepare(`INSERT INTO schema_meta
        (meta_key, role, schema_version, agent_id, app_version, created_at, updated_at)
        VALUES ('primary', 'global', ?, NULL, ?, ?, ?)`).run(40,VERSION,t,t);writeStateSchemaContentVersion(e)}const a=e.prepare(`SELECT schema_version, role, agent_id FROM schema_meta WHERE meta_key = 'primary'`).get();const o=e.prepare(`SELECT value_json FROM config_machine_state WHERE state_key = 'state.schema.contentVersion'`).get();let s;try{const e=o?.value_json;if(e!==void 0&&e!==null&&typeof e!==`string`)throw new Error(`Invalid PostgreSQL state content marker`);s=parseStateSchemaContentVersion(e)}catch{throw new Error(`PostgreSQL state metadata mismatch. ${recovery}`)}if(a?.schema_version!==n.version||a.role!==`global`||a.agent_id!==null||s>n.version)throw new Error(`PostgreSQL state metadata mismatch. ${recovery}`);publishStateSchemaVersionAdmission(e,{userVersion:n.version,contentVersion:n.version});publishStateRuntimeSchemaAdmission(e,true)}function statePostgresVersionSql(e){return`UPDATE schema_meta
        SET schema_version = ${e},
          app_version = '${VERSION.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';
        INSERT INTO config_machine_state (state_key, value_json, updated_at_ms)
        VALUES ('state.schema.contentVersion', '${e}',
          CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint))
        ON CONFLICT (state_key) DO UPDATE
          SET value_json = EXCLUDED.value_json, updated_at_ms = EXCLUDED.updated_at_ms;`}function createStatePostgresMigrations(){const e={postgres:stateEngineSchema.postgres,postgresFragments:stateEngineSchema.postgresFragments};const t=withLegacyWorkerProvisionSource(e.postgres);const n=withLegacyWorkspaceBootstrapDeferred(t);const r={...e,postgres:t,postgresWithoutOptionalColumn:{table:`workspace_setup_state`,column:`bootstrap_deferred`,sql:n}};const i={...e,postgres:withLegacyWorkerRetention(n)};const a={postgres:withLegacyRepositoryDiskAuthority(i.postgres),postgresFragments:i.postgresFragments.map(e=>({...e,sql:withLegacyRepositoryDiskAuthority(e.sql)}))};const o={postgres:withLegacyWorkerResourceReceipts(a.postgres),postgresFragments:a.postgresFragments};const s={postgres:withLegacyTemplateStateSchema(o.postgres),postgresFragments:o.postgresFragments.map(e=>({...e,tables:e.tables.map(legacyTemplateStateIdentifier),sql:withLegacyTemplateStateSchema(e.sql)}))};const c={postgres:withLegacyLocalWorkspaceCas(s.postgres),postgresFragments:s.postgresFragments.map(e=>({...e,tables:e.tables.filter(e=>!WORKSPACE_CAS_TABLES.some(t=>t===e)),sql:withLegacyLocalWorkspaceCas(e.sql)}))};const l={postgres:withLegacyPostgresIndexOrdering(c.postgres,`schema-nullability`),postgresFragments:c.postgresFragments.map(e=>({...e,sql:withLegacyPostgresIndexOrdering(e.sql,`schema-nullability`)}))};const u={postgres:withLegacyPostgresIndexOrdering(l.postgres),postgresFragments:l.postgresFragments.map(e=>({...e,sql:withLegacyPostgresIndexOrdering(e.sql)}))};const d={postgres:withLegacyLocalWorkspaceManifests(u.postgres),postgresFragments:u.postgresFragments.map(e=>({...e,tables:e.tables.filter(e=>e!==`local_workspace_manifest_nodes`),sql:withLegacyLocalWorkspaceManifests(e.sql)}))};const f={...d,postgres:`${d.postgres}\n${statePostgresRuntime.clientCredentialSource.sql}`};const p={postgres:withLegacyPublicationDraft(f.postgres),postgresFragments:f.postgresFragments.map(e=>({...e,sql:withLegacyPublicationDraft(e.sql)}))};const m={...p,postgres:p.postgres.replace(/CREATE INDEX "idx_state_leases_owner"[^;]*;/u,statePostgresRuntime.preWriteIndexesV27Sql.state_leases)+statePostgresRuntime.preWriteIndexesV27Sql.skill_usage+statePostgresRuntime.preWriteIndexesV27Sql.acp_replay_events,postgresFragments:p.postgresFragments};return[{version:25,sql:statePostgresRuntime.operatorRecoveryV25Sql,fromSchema:m,schema:m},{version:26,fromSchema:m,schema:m,sql:statePostgresVersionSql(26)},{version:27,fromSchema:m,schema:p,sql:`${statePostgresRuntime.writeIndexesV27Sql}
        ${statePostgresVersionSql(27)}`},{version:28,fromSchema:p,schema:f,sql:`ALTER TABLE IF EXISTS github_publication_requests ADD COLUMN draft bigint;
        ALTER TABLE IF EXISTS github_personal_publication_requests ADD COLUMN draft bigint;
        ALTER TABLE IF EXISTS github_repository_publication_requests ADD COLUMN draft bigint;
        ${statePostgresVersionSql(28)}`},{version:29,fromSchema:f,schema:d,sql:statePostgresRuntime.clientCredentialV29Sql},{version:30,fromSchema:d,schema:d,sql:statePostgresVersionSql(30)},{version:31,fromSchema:d,schema:u,sql:`DO $workspace$
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
        ${statePostgresVersionSql(33)}`},{version:34,fromSchema:c,schema:c,sql:statePostgresVersionSql(34)},{version:35,fromSchema:c,schema:s,sql:`${statePostgresRuntime.workspaceCasV35Sql}\n${statePostgresVersionSql(35)}`},{version:36,fromSchema:s,schema:o,sql:`${TEMPLATE_STATE_POSTGRES_MIGRATION_SQL}\n${statePostgresVersionSql(36)}`},{version:37,fromSchema:o,schema:a,sql:`ALTER TABLE worker_environments ADD COLUMN resource_receipt_json text COLLATE "C";
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
        ${statePostgresVersionSql(40)}`}]}const stateEngineSchema={id:`state`,version:40,sqlite:``,get postgres(){const e=statePostgresRuntime.eagerSql;Object.defineProperty(this,"postgres",{value:e,enumerable:true,configurable:true,writable:true});return e},get postgresFragments(){const e=statePostgresRuntime.fragments.map(e=>{const{activation:t}=e;if(t!==`first-use`&&t!==`version-additive`)throw new Error(`Unknown PostgreSQL state fragment activation: ${t}`);return{id:e.id,tables:e.tables,sql:e.sql,dependencies:e.dependencies,activation:t}});Object.defineProperty(this,"postgresFragments",{value:e,enumerable:true,configurable:true,writable:true});return e},get postgresMigrations(){const e=createStatePostgresMigrations();Object.defineProperty(this,"postgresMigrations",{value:e,enumerable:true,configurable:true,writable:true});return e}};function ensureStatePostgresFragment(e,t){const n=getPostgresPhysicalFacts(e);if(!n)throw new PostgresSchemaAdmissionUnavailableError(`Missing PostgreSQL state admission. ${recovery}`);const r=statePostgresRuntime.fragments.find(e=>e.tables.includes(t));if(!r){if(statePostgresRuntime.expectedCatalog.some(e=>e.kind===`table`&&e.table===t)&&n.catalog.some(e=>e.kind===`table`&&e.table===t))return;throw new Error(`No PostgreSQL state fragment owns ${t}`)}if(r.tables.filter(e=>n.version>=35||!WORKSPACE_CAS_TABLES.some(t=>t===e)).every(e=>n.catalog.some(t=>t.kind===`table`&&t.table===e)))return;for(const t of r.dependencies){const n=statePostgresRuntime.fragments.find(e=>e.id===t);if(!n)throw new Error(`Unknown state fragment dependency ${t}`);ensureStatePostgresFragment(e,n.tables[0])}if(!stageSqliteTransactionState(e,{commit:()=>publishSqliteDatabaseSchemaChange(e),invalidate:()=>publishSqliteDatabaseSchemaChange(e)}))throw new Error(`PostgreSQL state fragments require the owner's transaction`);invalidateLocalSqliteSchemaAdmissions(e);const i=n.version<38?withLegacyRepositoryDiskAuthority(r.sql):r.sql;const a=n.version<36?withLegacyTemplateStateSchema(i):i;const o=n.version<35?withLegacyLocalWorkspaceCas(a):a;e.exec(n.version<33?withLegacyPostgresIndexOrdering(o,n.version<32?`sqlite`:`schema-nullability`):o);admitPostgresPhysicalFacts({db:e,namespace:n.namespace,storeId:n.storeId,store:n.store,version:n.version,schema:stateEngineSchema,recordSchema:true});admitStatePostgres(e,false)}function openExistingStatePostgresConnection(e,t){if(!stateEngineInput())return;return openExistingStatePostgresConnectionFromAnchor(openTrackedStateDatabase(e,{existingOnly:true,expectedIdentity:t}),e)}function openExistingStatePostgresConnectionFromAnchor(e,t){let n;try{const r=stateEngineInput();if(!r)throw new Error(`PostgreSQL state inspection requires the configured state connection.`);admitStateSchemaFacts(e,t);const i=openEngineStore({anchor:e,schema:stateEngineSchema,input:r,inspectSqlite:()=>inspectStateSqlite(e),prepareAnchor:()=>{},openSqlite:()=>{},existingOnly:true,reusePostgresConnection:true,existingVersion:true,admitPostgres:admitStatePostgres,closeOnFailure:(e,t)=>{n=e;throw t}});if(!isPostgresSqlConnection(i))throw new Error(`Expected PostgreSQL state connection`);n=i;return{database:{db:n,path:t},close(){throwSqliteLifecycleErrors(openClawStateDatabaseCache.closeUnpublishedOpenClawStateDatabaseHandle({db:i,path:t}),`PostgreSQL state connection cleanup failed.`);return!i.isOpen&&!e.isOpen}}}catch(r){const i=openClawStateDatabaseCache.closeUnpublishedOpenClawStateDatabaseHandle({db:n??e,path:t});if(i.length)throw createSqliteLifecycleAggregateError([r,...i],`PostgreSQL state connection acquisition and cleanup failed.`,r);throw r}}
//!src/infra/sqlite-wal-reclamation.ts
const VACUUM_UNIT_TARGET_MS=25;const vacuumPageBudgets=/* @__PURE__ */ new WeakMap;function createSqliteWalReclamationResult(){return{checkpointCompleted:false,freePagesBefore:null,remainingFreePages:null,checkpointCalls:0,checkpointIncomplete:0,checkpointMs:0,checkpointMaxMs:0,queryMs:0,vacuumMs:0,vacuumPasses:0,vacuumPagesRequested:0}}function readSqliteFreePageCount(e,t){const n=t?performance$1.now():0;try{return Number(e.prepare(`PRAGMA freelist_count`).get()?.freelist_count??0)}finally{if(t)t.queryMs+=performance$1.now()-n}}function reclaimSqliteWalFreePages(e,t,n){const r=createSqliteWalReclamationResult();const checkpoint=()=>{n.beforeMutation?.();const e=performance$1.now();try{const e=n.checkpointMode??`TRUNCATE`;let i=t(e);r.checkpointCalls++;if(!i&&e===`TRUNCATE`){n.beforeMutation?.();i=t(`PASSIVE`);r.checkpointCalls++}r.checkpointCompleted=i;r.checkpointIncomplete+=Number(!i);return i}finally{const t=performance$1.now()-e;r.checkpointMs+=t;r.checkpointMaxMs=Math.max(r.checkpointMaxMs,t)}};if(n.maxPages===0&&n.checkpointMode===`PASSIVE`){checkpoint();return r}return runWithSqliteBusyTimeout(e,0,()=>{if(!checkpoint()||n.maxPages===0)return r;const t=readSqliteFreePageCount(e,r);r.freePagesBefore=t;r.remainingFreePages=t;if(!Number.isSafeInteger(t)||t<=0)return r;const i=Math.min(vacuumPageBudgets.get(e)??8,t,n.maxPages??512);if(!Number.isSafeInteger(i)||i<=0)throw new Error(`SQLite page reclamation requires a positive integer page limit`);const a=performance$1.now();let o=false;let s=false;try{runSqliteImmediateTransactionSync(e,()=>{o=true;n.beforeMutation?.();r.vacuumPasses++;r.vacuumPagesRequested+=i;e.exec(`PRAGMA incremental_vacuum(${i});`);n.onCommit?.()},{beginLockFailureReporting:`suppress`,busyTimeoutMs:0,operationLabel:`incremental-vacuum`});s=true}catch(e){if(o||!isSqliteLockError(e))throw e;return r}finally{const t=performance$1.now()-a;r.vacuumMs+=t;if(s)vacuumPageBudgets.set(e,Math.max(1,Math.min(512,i*2,Math.floor(i*VACUUM_UNIT_TARGET_MS/Math.max(t,.001)))))}n.afterCommit?.();if(checkpoint())r.remainingFreePages=readSqliteFreePageCount(e,r);return r})}
//!src/shared/state-lease-loss.ts
const milliseconds=number().int().min(0).max(Number.MAX_SAFE_INTEGER);const StateLeaseLossSchema=discriminatedUnion(`reason`,[object({reason:literal$1(`expired`),expiresAt:milliseconds,expiredByMs:milliseconds,heartbeatAgeMs:milliseconds,renewalTimerLateByMs:milliseconds.optional()}),object({reason:literal$1(`replaced`),owner:literal$1(`[redacted]`)}),object({reason:literal$1(`missing`)}),object({reason:literal$1(`storage-failed`)}),object({reason:literal$1(`admission-failed`)})]);
//!src/state/openclaw-state-lease-store.ts
function readOpenClawStateLease(e,t){return executeSqliteQueryTakeFirstSync(e,getNodeSqliteKysely(e).selectFrom(`state_leases`).select([`owner`,`created_at as createdAt`,`expires_at as expiresAt`,`heartbeat_at as heartbeatAt`,`payload_json as payloadJson`]).where(`scope`,`=`,t.scope).where(`lease_key`,`=`,t.key))}
//!src/infra/gateway-owner-lease.read.ts
const gatewayOwnerKey={scope:`gateway-owner`,key:`global`};function parseSupervisor(e){if(e===null)return null;if(!isRecord(e)||e.kind!==`launchd`&&e.kind!==`systemd`&&e.kind!==`schtasks`&&e.kind!==`external`||e.name!==null&&(typeof e.name!==`string`||!e.name.trim()))throw new Error(`Gateway owner lease supervisor could not be verified`);return{kind:e.kind,name:e.name}}function readGatewayOwnerLeaseFromDatabase(e,t){if(!tableExists(e,`state_leases`))return;return decodeGatewayOwnerLease(readOpenClawStateLease(e,gatewayOwnerKey),t)}function decodeGatewayOwnerLease(e,t){if(!e)return;const n=parseStateLeaseProcessOwner(e.payloadJson);const r=safeParseJsonRecord(e.payloadJson??``);if(!n||!r||typeof r.port!==`number`||!Number.isInteger(r.port)||r.port<=0||r.port>65535||r.mode!==`foreground`&&r.mode!==`supervised`)throw new Error(`Gateway owner lease identity could not be verified`);if(t!==void 0&&r.port!==t)return;const i=parseSupervisor(r.supervisor);if(r.mode===`foreground`!==(i===null))throw new Error(`Gateway owner lease supervisor does not match its listener mode`);return{...n,owner:e.owner,heartbeatAt:e.heartbeatAt??e.createdAt,port:r.port,mode:r.mode,supervisor:i,...typeof r.listeningAt===`number`?{listeningAt:r.listeningAt}:{},...typeof r.stateDatabaseProvenance===`string`?{stateDatabaseProvenance:r.stateDatabaseProvenance}:{},state:readStateLeaseProcessOwnerStatus(n,e.heartbeatAt??e.createdAt),expired:e.expiresAt===null||e.expiresAt<=Date.now()}}
//!src/infra/state-legacy-cron-presence.ts
function hasLegacyCronRunLogs(e){const t=getAdmittedSqliteSchemaFacts(e);if(t)return t.tables.has(`cron_run_logs`);return Boolean(e.prepare(`SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'cron_run_logs' LIMIT 1`).get())}
//!src/state/openclaw-agent-db-lease-provenance.ts
let boot;function mayShareAgentDatabaseFile(e,t){if(e===t)return true;try{const n=fs.statSync(e,{bigint:true,throwIfNoEntry:false});const r=fs.statSync(t,{bigint:true,throwIfNoEntry:false});return!n||!r||n.dev===r.dev&&n.ino===r.ino}catch{return true}}function readAgentDatabaseLeaseProvenance(e){try{if(boot===void 0){boot=null;if([`linux`,`darwin`,`win32`].includes(process.platform)){const e=createManagedHandoffBootIdentityReader(process.env)();const t=e.platform===`linux`?fs.readlinkSync(`/proc/self/ns/pid`):e.platform;boot=[hostname(),e.identity,t,VERSION].join(`\0`)}}if(!boot)return null;const t=fs.statSync(e,{bigint:true});return t.isFile()?`process-v1:${createHash(`sha256`).update(`${boot}\0${t.dev}:${t.ino}`).digest(`hex`)}`:null}catch{return null}}
//!src/gateway/worker-environments/environment-recipe.ts
const ProcessString=string().refine(e=>!e.includes(`\0`),`Must not contain NUL`);const Command=union([ProcessString,array(ProcessString).min(1).refine(e=>Boolean(e[0]?.length),`Executable must not be empty`)]);const Lifecycle=union([Command,record(string(),Command)]);const Blob=string().regex(/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u);const SecretName=string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/u);const SecretRequests=record(SecretName,object({description:string().optional(),documentationUrl:string().optional()}).passthrough()).refine(e=>Object.keys(e).length<=16,`At most 16 setup secrets may be requested`);const Environment=record(string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/u),ProcessString);const EnvironmentRecipeSchema=object({source:_enum([`devcontainer`,`script`,`detected`,`none`]),identity:Blob.optional(),inputs:record(string(),Blob),env:record(string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/u),ProcessString.nullable()),secretNames:array(SecretName).max(16).optional(),ignoredPropertiesNote:string().optional(),onCreate:Lifecycle.optional(),updateContent:Lifecycle.optional(),postCreate:Lifecycle.optional(),postStart:Lifecycle.optional(),detectedInstall:Lifecycle.optional()}).strict();const Devcontainer=object({onCreateCommand:Lifecycle.optional(),updateContentCommand:Lifecycle.optional(),postCreateCommand:Lifecycle.optional(),postStartCommand:Lifecycle.optional(),secrets:SecretRequests.optional(),containerEnv:Environment.optional(),remoteEnv:record(string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/u),ProcessString.nullable()).optional()}).passthrough();
//!src/gateway/worker-environments/preparation-identity.schema.ts
const Digest=string().regex(/^[a-f0-9]{64}$/u);const WorkerPreparationArtifactsSchema=object({nodeBootstrapSha256:Digest,enabledPluginIds:array(string().min(1).max(256)).max(256),workerBundleHash:Digest,workerArchiveSha256:Digest,openclawVersion:string().min(1).max(128),protocolFeatures:array(string().min(1).max(128)).max(64)}).strict();const WorkerPreparationTargetSchema=object({machineClass:string().min(1).max(256),platform:string().min(1).max(64),arch:string().min(1).max(64).optional(),profileKey:Digest.optional()}).strict();const Preparation=object({key:Digest,cacheKey:Digest,contractVersion:union([literal$1(1),literal$1(2)]),setupRecipe:string().regex(/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u).optional(),runSetupScript:boolean().optional(),recipe:EnvironmentRecipeSchema.optional(),target:WorkerPreparationTargetSchema,artifacts:WorkerPreparationArtifactsSchema}).strict();const RuntimePreparation=Preparation.omit({setupRecipe:true,runSetupScript:true,recipe:true}).extend({source:_enum([`empty`,`image`])});function readWorkerProjectPreparation(e){if(!isRecord(e)||e.preparation===void 0)return;const t=Preparation.safeParse(e.preparation);if(!t.success)throw new Error(`Worker project preparation identity is invalid`);return t.data}function readWorkerPreparation(e){if(e.runtimePreparation===void 0)return readWorkerProjectPreparation(e.project);const t=RuntimePreparation.safeParse(e.runtimePreparation);if(!t.success||e.project!==void 0)throw new Error(`Worker runtime preparation identity is invalid`);return t.data}
//!src/state/openclaw-state-db-image-snapshot-migration.ts
function historicalImageQuery(e){return getNodeSqliteKysely(e).selectFrom(`worker_environments`).select([`environment_id`,`profile_snapshot_json`]).where(t=>t(jsonValid(e,t.ref(`profile_snapshot_json`)),`=`,1)).where(t=>t(jsonPathValue(e,t.ref(`profile_snapshot_json`),t.val(`$.project.kind`)),`=`,`image`))}function migrateHistoricalImageReserveSnapshots(e){if(!tableExists(e,`worker_environments`))return[];const t=executeSqliteQuerySync(e,historicalImageQuery(e)).rows;for(const n of t){if(typeof n.profile_snapshot_json!==`string`||typeof n.environment_id!==`string`)throw new Error(`Historical image reserve row is invalid`);const t=JSON.parse(n.profile_snapshot_json);const r=isRecord(t)?t.project:void 0;if(!isRecord(t)||!isRecord(r)||r.kind!==`image`||typeof r.key!==`string`||!/^[a-f0-9]{64}$/u.test(r.key)||!isRecord(r.preparation)||t.runtimePreparation!==void 0||t.historicalProfileSnapshotJson!==void 0)throw new Error(`Historical image reserve snapshot has conflicting or invalid preparation`);t.runtimePreparation={...r.preparation,source:`empty`};delete t.project;readWorkerPreparation(t);t.historicalProfileSnapshotJson=n.profile_snapshot_json;executeSqliteQuerySync(e,getNodeSqliteKysely(e).updateTable(`worker_environments`).set({profile_snapshot_json:JSON.stringify(t)}).where(`environment_id`,`=`,n.environment_id))}return t.length>0?[`Migrated historical image reserves with original snapshot evidence retained`]:[]}
//!src/infra/client-credential-schema.ts
const CLIENT_CREDENTIAL_SOURCE_TABLES=[`device_identities`,`device_auth_tokens`,`gateway_origin_device_tokens`,`exec_approvals_config`];const CLIENT_CREDENTIAL_LEGACY_TABLES_SQL=`CREATE TABLE device_identities (
  identity_key TEXT NOT NULL PRIMARY KEY,
  device_id TEXT NOT NULL,
  public_key_pem TEXT NOT NULL,
  private_key_pem TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;
CREATE INDEX idx_device_identities_device
  ON device_identities(device_id, updated_at_ms DESC);
CREATE TABLE device_auth_tokens (
  device_id TEXT NOT NULL,
  role TEXT NOT NULL,
  token TEXT NOT NULL,
  scopes_json TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (device_id, role)
) STRICT;
CREATE INDEX idx_device_auth_tokens_updated
  ON device_auth_tokens(updated_at_ms DESC, device_id, role);
CREATE TABLE gateway_origin_device_tokens (
  gateway_scope TEXT NOT NULL,
  device_id TEXT NOT NULL,
  role TEXT NOT NULL,
  token TEXT NOT NULL,
  scopes_json TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (gateway_scope, device_id, role)
) STRICT;`;const CLIENT_CREDENTIAL_SCHEMA_SQL=`${CLIENT_CREDENTIAL_LEGACY_TABLES_SQL}
CREATE TABLE native_exec_socket_credentials (
  socket_key TEXT NOT NULL PRIMARY KEY CHECK (socket_key = 'current'),
  socket_path TEXT,
  socket_token TEXT,
  updated_at_ms INTEGER NOT NULL
) STRICT;
CREATE TABLE client_credential_migration (
  version INTEGER PRIMARY KEY CHECK (version = 1),
  source_store TEXT NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('copied', 'complete')),
  updated_at_ms INTEGER NOT NULL
) STRICT;`;
//!src/state/openclaw-state-db-cron-delivery-migration.ts
function migrateCronDeliveryAttemptState(e,t){return t<20&&tableExists(e,`cron_run_receipts`)?ensureColumn(e,`cron_run_receipts`,`delivery_attempt_state TEXT NOT NULL DEFAULT 'unknown' CHECK (delivery_attempt_state IN ('unknown', 'not-started', 'started'))`):false}
//!src/state/openclaw-state-db-schema-v21-columns.ts
const statePredicateColumnMigration={version:21,tables:[`meeting_transcript_sessions`,`meeting_transcript_summaries`,`delivery_queue_entries`],columns:[...[`source_account_id`,`source_guild_id`,`source_channel_id`,`source_meeting_url`,`source_thread_ts`,`source_file_id`,`metadata_agent_id`].map(e=>`meeting_transcript_sessions.${e}`),`meeting_transcript_summaries.overview`,`delivery_queue_entries.retention_id_prefix`,`delivery_queue_entries.retention_max_age_ms`,`delivery_queue_entries.retention_max_entries`],migrate:migratePredicateColumnsV21,applied:`Derived meeting transcript selectors and bounded delivery retention columns (v21)`};function migratePredicateColumnsV21(e,t){const n=t===21&&statePredicateColumnMigration.columns.some(t=>{const n=t.indexOf(`.`);const r=t.slice(0,n);return tableExists(e,r)&&!tableHasColumn(e,r,t.slice(n+1))});if(t>=21&&!n)return false;let r=false;const text=(e,t)=>`CASE WHEN json_valid(${e}) THEN CASE WHEN json_type(${e}, '${t}') = 'text' THEN json_extract(${e}, '${t}') END END`;if(tableExists(e,`meeting_transcript_sessions`)){const t=[`accountId`,`guildId`,`channelId`,`meetingUrl`,`threadTs`,`fileId`];const n=[`source_account_id`,`source_guild_id`,`source_channel_id`,`source_meeting_url`,`source_thread_ts`,`source_file_id`];for(const t of[...n,`metadata_agent_id`])r=ensureColumn(e,`meeting_transcript_sessions`,`${t} TEXT`)||r;e.exec(`UPDATE meeting_transcript_sessions SET
      ${n.map((e,n)=>`${e} = ${text(`source_json`,`$.${t[n]}`)}`).join(`,`)},
      metadata_agent_id = ${text(`metadata_json`,`$.agentId`)}`)}if(tableExists(e,`meeting_transcript_summaries`)){r=ensureColumn(e,`meeting_transcript_summaries`,`overview TEXT`)||r;e.exec(`UPDATE meeting_transcript_summaries SET overview = ${text(`summary_json`,`$.overview`)}`)}if(tableExists(e,`delivery_queue_entries`)){r=ensureColumn(e,`delivery_queue_entries`,`retention_id_prefix TEXT`)||r;r=ensureColumn(e,`delivery_queue_entries`,`retention_max_age_ms INTEGER`)||r;r=ensureColumn(e,`delivery_queue_entries`,`retention_max_entries INTEGER`)||r;e.exec(`UPDATE delivery_queue_entries SET
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
      )`)}return r}
//!src/state/openclaw-state-db-historical-imports.ts
const table=`worker_session_placements`;const archivalColumn=`repository_preparation TEXT`;function migrateHistoricalRepositoryPreparation(e){if(!tableHasColumn(e,table,`repository_preparation`))return false;const t=extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL,table).replace(`  remote_workspace_dir TEXT,`,`  `+archivalColumn+`,
  remote_workspace_dir TEXT,`);const n=createSqliteTableContractReader(e)(table);const r=parseSqliteTableDefinition(t,table);if(n?.strict===1&&n.withoutRowid===0&&isDeepStrictEqual(n.definition,r))return false;const i=t.replace(archivalColumn+`,`,archivalColumn+` CHECK (repository_preparation IN ('pending', 'ready', 'failed')),`).replace(`  CHECK (
    (state IN`,`  CHECK (repository_preparation IS NULL OR (repository_preparation = 'ready' AND workspace_base_manifest_ref IS NOT NULL) OR (repository_preparation = 'failed' AND state IN ('starting', 'active', 'draining', 'reconciling', 'reclaimed', 'failed')) OR (repository_preparation = 'pending' AND workspace_base_manifest_ref IS NULL AND state IN ('starting', 'active', 'draining', 'reconciling', 'reclaimed', 'failed'))),
  CHECK (
    (state IN`).replaceAll(`AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir`,`AND (workspace_base_manifest_ref IS NOT NULL OR repository_preparation IS 'pending' OR repository_preparation IS 'failed') AND remote_workspace_dir`);if(!n||n.strict!==1||n.withoutRowid!==0||!isDeepStrictEqual(n.definition,parseSqliteTableDefinition(i,table)))throw new Error(`Unrecognized historical worker placement schema; preserve the store for explicit recovery.`);if(e.prepare(`SELECT 1 FROM worker_session_placements WHERE repository_preparation IN ('pending', 'failed') AND turn_claim_owner = 'worker' LIMIT 1`).get())throw new Error(`Historical repository preparation retains a worker turn claim; reconcile its owned cleanup before migrating.`);const a=readSqliteSchemaObjects(e).filter(e=>e.tbl_name===table&&(e.type===`index`||e.type===`trigger`)&&e.sql!==null);const o=n.columns.map(e=>e.name);const s=o.map(e=>{if(e===`state`)return`CASE WHEN repository_preparation IN ('pending', 'failed') THEN 'failed' ELSE state END`;if(e===`recovery_error`)return`CASE WHEN repository_preparation IN ('pending', 'failed') THEN 'Historical repository preparation ' || repository_preparation || ' (previous placement ' || state || '); owned cleanup required before recovery.' || CASE WHEN recovery_error IS NULL THEN '' ELSE ' ' || recovery_error END ELSE recovery_error END`;return quoteSqliteIdentifier(e)});e.exec(t.replace(`CREATE TABLE IF NOT EXISTS `+table,`CREATE TABLE worker_session_placements_historical_migration`)+` INSERT INTO worker_session_placements_historical_migration (rowid, `+o.map(quoteSqliteIdentifier).join(`, `)+`) SELECT rowid, `+s.join(`, `)+` FROM worker_session_placements; DROP TABLE worker_session_placements; ALTER TABLE worker_session_placements_historical_migration RENAME TO worker_session_placements;`);for(const t of a){if(typeof t.sql!==`string`)throw new Error(`Historical worker placement schema object is invalid`);e.exec(t.sql)}return true}function migrateHistoricalStateImports(e,t,n=`version`){if(n===`version`&&t>22)return[];const r=[];const i=t===21&&migrateHistoricalRepositoryPreparation(e);if(i)r.push(`Preserved historical worker placement evidence and fenced incomplete repository preparation`);if((t===21||i)&&migratePredicateColumnsV21(e,21))r.push(statePredicateColumnMigration.applied);if(n===`doctor`||t<=22)r.push(...migrateHistoricalImageReserveSnapshots(e));return r}
//!src/state/openclaw-state-db-index-ordering-migrations.ts
const stateIndexOrderingMigrations=[{version:32,tables:[],columns:[],migrate:()=>false,applied:`Aligned PostgreSQL non-null index ordering (v32)`},{version:33,tables:[],columns:[],migrate:()=>false,applied:`Aligned PostgreSQL partial-index ordering (v33)`}];
//!src/state/openclaw-state-db-meeting-chronology-migration.ts
function migrateMeetingTranscriptStartTime(e,t){if(t>=23||!tableExists(e,`meeting_transcript_sessions`))return false;let n=ensureColumn(e,`meeting_transcript_sessions`,`started_at_ms INTEGER`);const r=iterateSqliteQuerySync(e,getNodeSqliteKysely(e).selectFrom(`meeting_transcript_sessions`).select([`session_id`,`started_at`]));const i=e.prepare(`UPDATE meeting_transcript_sessions SET started_at_ms = ? WHERE session_id = ? AND started_at = ?`);for(const e of r){i.run(parseDateStringTimestampMs(e.started_at)??null,e.session_id,e.started_at);n=true}return n}
//!src/infra/sqlite-number.ts
const MAX_SAFE_INTEGER_BIGINT=BigInt(Number.MAX_SAFE_INTEGER);function coerceRequiredSqliteNumber(e){return typeof e===`bigint`?Number(e):e}function normalizeSqliteNumber(e){if(typeof e===`bigint`){if(e>MAX_SAFE_INTEGER_BIGINT||e<-MAX_SAFE_INTEGER_BIGINT)return;return Number(e)}return typeof e===`number`?e:void 0}
//!src/infra/sqlite-audit-record.kernel.ts
const LEGACY_AUDIT_SEQUENCE_BASE=Number.MIN_SAFE_INTEGER;function getAuditRecordKysely(e){return getNodeSqliteKysely(e)}function parseAuditRecord(e){return{key:e.event_key,value:JSON.parse(e.payload_json),createdAt:e.created_at,sequence:e.sequence}}function readAuditWriteState(e){const t=executeSqliteQueryTakeFirstSync(e.database,getAuditRecordKysely(e.database).selectFrom(`diagnostic_events`).select(t=>[t.fn.max(`sequence`).filterWhere(`sequence`,e.legacy?`<`:`>=`,0).as(`sequence`),t.fn.countAll().as(`count`),t.fn.countAll().filterWhere(`event_key`,`=`,e.key??``).as(`keyCount`)]).where(`scope`,`=`,e.scope));const n=(t?.sequence??(e.legacy?LEGACY_AUDIT_SEQUENCE_BASE:0))+1;if(!Number.isSafeInteger(n)||e.legacy&&n>=0)throw new Error(`Audit sequence exhausted for scope ${e.scope}`);return{nextSequence:n,count:coerceRequiredSqliteNumber(t?.count??0),keyExists:coerceRequiredSqliteNumber(t?.keyCount??0)>0}}function pruneAuditRecords(e){const t=e.count-e.maxEntries;if(t<=0)return;const n=e.protectedKey;const r=getAuditRecordKysely(e.database).selectFrom(`diagnostic_events`).select(`event_key`).where(`scope`,`=`,e.scope);const i=(n===void 0?r:r.where(`event_key`,`!=`,n)).orderBy(`sequence`,`asc`).limit(t);executeSqliteQuerySync(e.database,getAuditRecordKysely(e.database).deleteFrom(`diagnostic_events`).where(`scope`,`=`,e.scope).where(`event_key`,`in`,i))}function prepareSqliteAuditRecord(e,t){const n=JSON.stringify(t.value);if(n===void 0)throw new Error(`Audit record ${e}/${t.key} is not JSON-serializable`);return{event_key:t.key,payload_json:n,created_at:t.createdAt}}function createAuditRecordInsert(e){return prepareSqliteQuerySync(e,t=>getAuditRecordKysely(e).insertInto(`diagnostic_events`).values({scope:t(e=>e.scope),event_key:t(e=>e.event_key),payload_json:t(e=>e.payload_json),created_at:t(e=>e.created_at),sequence:t(e=>e.sequence)}).onConflict(e=>e.columns([`scope`,`event_key`]).doNothing()))}const auditRecordInsert=createSqliteQueryCache(createAuditRecordInsert);function createSqliteAuditRecordKernel(e,t){const n=t.scope;const r=t.maxEntries;const prune=(t,i)=>pruneAuditRecords({database:e,scope:n,maxEntries:r,count:t,protectedKey:i});const selectEntries=()=>getAuditRecordKysely(e).selectFrom(`diagnostic_events`).select([`event_key`,`payload_json`,`created_at`,`sequence`]).where(`scope`,`=`,n);function insertRecord(t){return Number(auditRecordInsert(e)({...t,scope:n}).numAffectedRows??0)}function upsertPreparedRecord(t){const r=readAuditWriteState({database:e,scope:n,legacy:false,key:t.event_key});executeSqliteQuerySync(e,getAuditRecordKysely(e).insertInto(`diagnostic_events`).values({scope:n,event_key:t.event_key,payload_json:t.payload_json,created_at:t.created_at,sequence:r.nextSequence}).onConflict(e=>e.columns([`scope`,`event_key`]).doUpdateSet({payload_json:t.payload_json,created_at:t.created_at})));prune(r.count+(r.keyExists?0:1),t.event_key)}function deleteRecord(t){executeSqliteQuerySync(e,getAuditRecordKysely(e).deleteFrom(`diagnostic_events`).where(`scope`,`=`,n).where(`event_key`,`=`,t))}return{register(t){const r=readAuditWriteState({database:e,scope:n,legacy:false});const i=insertRecord({...t,sequence:r.nextSequence});prune(r.count+i,t.event_key)},upsert:upsertPreparedRecord,delete:deleteRecord,compareAndSet(t,r,i){if((executeSqliteQueryTakeFirstSync(e,getAuditRecordKysely(e).selectFrom(`diagnostic_events`).select(`payload_json`).where(`scope`,`=`,n).where(`event_key`,`=`,t))?.payload_json??null)!==r)return false;if(i)upsertPreparedRecord(i);else deleteRecord(t);return true},registerLegacyMany(t){const r=readAuditWriteState({database:e,scope:n,legacy:true});let i=r.nextSequence;let a=r.count;for(const e of t){a+=insertRecord({...e,sequence:i});i+=1}prune(a)},entries(){return executeSqliteQuerySync(e,selectEntries().orderBy(`sequence`,`asc`)).rows.map(e=>{const{sequence:t,...n}=parseAuditRecord(e);return n})},latest(t){const n=selectEntries();const r=t.beforeSequence===void 0?n:n.where(`sequence`,`<`,t.beforeSequence);return executeSqliteQuerySync(e,r.orderBy(`sequence`,`desc`).limit(t.limit)).rows.map(e=>parseAuditRecord(e))}}}
//!src/acp/event-ledger-bytes.ts
function estimateAcpSessionRowBytes(e){return Buffer.byteLength(e.sessionId,`utf8`)+Buffer.byteLength(e.sessionKey,`utf8`)+Buffer.byteLength(e.cwd,`utf8`)+32}function estimateAcpEventRowBytes(e){return Buffer.byteLength(e.sessionId,`utf8`)+Buffer.byteLength(e.sessionKey,`utf8`)+Buffer.byteLength(e.runId??``,`utf8`)+Buffer.byteLength(e.updateJson,`utf8`)+32}
//!src/infra/approval-resolution-ref.ts
function buildApprovalResolutionRef(e){return sha256Base64Url(`${e.approvalKind}\0${e.approvalId}`)}
//!src/infra/json-object-members.ts
function readJsonObjectMembers(e){JSON.parse(e);const t=[];for(let n=0;n<e.length;){const r=e[n];if(/\s/u.test(r)){n++;continue}const i=n++;if(r===`"`)while(n<e.length){const t=e[n++];if(t===`\\`)n++;else if(t===`"`)break}else if(!`{}[],:`.includes(r))while(n<e.length&&!/[\s{}[\],:]/u.test(e[n]))n++;t.push(e.slice(i,n))}const n=/* @__PURE__ */ new Map;if(t[0]!==`{`)return n;for(let e=1;;){const r=t[e];if(r===void 0||r===`}`)break;const i=JSON.parse(r);e+=2;const a=e;let o=0;do{const n=t[e++];if(n===`{`||n===`[`)o++;else if(n===`}`||n===`]`)o--}while(o>0);if(typeof i===`string`&&!n.has(i))n.set(i,t.slice(a,e).join(``));if(t[e]===`,`)e++}return n}
//!src/infra/delivery-queue-retention-columns.ts
function deriveDeliveryQueueRetentionColumns(e,t){const n={retention_id_prefix:null,retention_max_age_ms:null,retention_max_entries:null};try{const r=readJsonObjectMembers(t).get(`completionRetention`);if(!r?.startsWith(`{`))return n;const i=readJsonObjectMembers(r);const a=i.get(`idPrefix`);const o=a?.startsWith(`"`)?JSON.parse(a):a?.startsWith(`[`)||a?.startsWith(`{`)?a:void 0;const s=typeof o===`string`?o:void 0;const integer=e=>{const t=e===`true`?1:e&&/^-?\d+$/u.test(e)?Number(e):NaN;return Number.isSafeInteger(t)&&t>=1?t:void 0};const c=integer(i.get(`maxAgeMs`));const l=integer(i.get(`maxEntries`));return s&&!s.includes(`\0`)&&e.startsWith(s)&&c!==void 0&&l!==void 0?{retention_id_prefix:s,retention_max_age_ms:c,retention_max_entries:l}:n}catch{return n}}
//!src/infra/delivery-queue-cache.ts
const outboundDeliveryNotifications=resolveGlobalSingleton(Symbol.for(`openclaw.outboundDeliveryEnqueued`),()=>({onEnqueued:e=>{}}));const failedDeliveryQueueHealthAdmission={name:`state.failed-delivery-queue-health`,read:e=>e};
//!src/infra/delivery-queue-sqlite-bound.ts
const COMPLETED_TOMBSTONE_RETENTION_MS=2592e6;function boundedDeliveryReceipts(e){return getNodeSqliteKysely(e).selectFrom(`delivery_queue_entries`).select([`queue_name`,`id`,`enqueued_at`,`retention_id_prefix as id_prefix`,`retention_max_age_ms as max_age_ms`,`retention_max_entries as max_entries`]).where(`status`,`in`,[`completed`,`failed`]).where(`recovery_state`,`=`,`completed_bounded`).where(`retention_id_prefix`,`is not`,null)}function pruneDeliveryQueueTombstones(e,t,n){let r=boundedDeliveryReceipts(e);if(n)r=r.where(`queue_name`,`=`,n.queueName).where(`retention_id_prefix`,`=`,n.idPrefix);const i=getNodeSqliteKysely(e);const a=executeSqliteQuerySync(e,i.with(`policies`,()=>r).with(`ranked`,e=>e.selectFrom(`policies`).selectAll().select(e=>e.fn.agg(`row_number`,[]).over(e=>e.partitionBy([`queue_name`,`id_prefix`]).orderBy(`enqueued_at`,`desc`).orderBy(`id`,`desc`)).as(`retention_rank`))).deleteFrom(`delivery_queue_entries`).where(e=>e(e.refTuple(`queue_name`,`id`),`in`,e.selectFrom(`ranked`).select([`queue_name`,`id`]).where(e=>e.or([e(`enqueued_at`,`<`,e(e.val(t),`-`,e.ref(`max_age_ms`))),e(`retention_rank`,`>`,e.ref(`max_entries`))])).$asTuple(`queue_name`,`id`))));if((a.numAffectedRows??0n)>0n)publishSqliteDatabaseAdmission(e,failedDeliveryQueueHealthAdmission,void 0);const o=n?false:pruneOrdinaryDeliveryReceipts(e,t);return(a.numAffectedRows??0n)>0n||o}function pruneOrdinaryDeliveryReceipts(e,t){return(executeSqliteQuerySync(e,getNodeSqliteKysely(e).deleteFrom(`delivery_queue_entries`).where(`status`,`=`,`completed`).where(`enqueued_at`,`<`,t-COMPLETED_TOMBSTONE_RETENTION_MS).where(e=>e.or([e(`recovery_state`,`is`,null),e(`recovery_state`,`not in`,[`completed_permanent`,`completed_bounded`])]))).numAffectedRows??0n)>0n}const deliveryQueueUpserts=createSqliteQueryCache(()=>({}));const deliveryQueueReads=createSqliteQueryCache(()=>({}));
//!src/infra/delivery-queue-sqlite.types.ts
function parseDeliveryQueueCompletionRetention(e,t){if(e===`permanent`)return e;const n=asNullableRecord(e);if(!n)return;const r=typeof n.idPrefix===`string`?n.idPrefix:``;const i=asPositiveSafeInteger(n.maxAgeMs);const a=asPositiveSafeInteger(n.maxEntries);if(!r||!t.startsWith(r)||i===void 0||a===void 0)return;return{idPrefix:r,maxAgeMs:i,maxEntries:a}}const finite=e=>typeof e===`number`&&Number.isFinite(e);function inferDeliveryQueueFailureRetention(e,t,n,r=false){const i=parseDeliveryQueueCompletionRetention(e.completionRetention,t)??parseDeliveryQueueCompletionRetention(e.failureRetention,t);if(i)return i;const a=asNullableRecord(asNullableRecord(e.terminalPolicy)?.fence);if(a?.kind===`none`)return;const o=a?.kind===`permanent`?`permanent`:parseDeliveryQueueCompletionRetention(a,t);if(o)return o;const s=n===`outbound-preparing-v1`||n===`outbound-legacy-preparing-v1`||n===`outbound-prepared-migration-v1`||e.retainOnFailure===true||asNullableRecord(e.deliveryCompletion)!==null||n===`session`&&finite(e.availableAt);const c=r&&(typeof e.platformSendAttemptId===`string`&&e.platformSendAttemptId.length>0||finite(e.platformSendStartedAt)||e.recoveryState===`send_attempt_started`||e.recoveryState===`unknown_after_send`||n===`session`&&(finite(e.deliveryStartedAt)||typeof e.settlementOutcome===`string`&&e.settlementOutcome.length>0||finite(e.acknowledgedAt)));return s||c?`permanent`:void 0}function projectDeliveryQueueTerminalEntry(e,t,n,r){const i=Number.isSafeInteger(e.retryCount)&&e.retryCount>=0?e.retryCount:0;const a=r===`permanent`?`completed_permanent`:r?`completed_bounded`:void 0;return{id:e.id,enqueuedAt:t,retryCount:i,...n===`completed`?{acknowledgedAt:t}:{failedAt:t},...r?{completionRetention:r}:{},...a?{recoveryState:a}:{}}}
//!src/state/openclaw-state-db-delivery-queue-backfill.ts
function nonNegativeSafeInteger(e){const t=typeof e===`bigint`?Number(e):e;return typeof t===`number`&&Number.isSafeInteger(t)&&t>=0?t:void 0}function compactLegacyDeliveryQueueFailures(e){const t=Date.now();const n=e.prepare(`UPDATE delivery_queue_entries SET entry_json = @entryJson,
      retention_id_prefix = @retention_id_prefix, retention_max_age_ms = @retention_max_age_ms,
      retention_max_entries = @retention_max_entries
      WHERE queue_name = @queueName AND id = @id AND status = 'pending' AND entry_json = @previousJson`);const r=e.prepare(`SELECT queue_name, id, status, retry_count, entry_json, updated_at, failed_at, recovery_state
       FROM delivery_queue_entries WHERE status IN ('pending', 'failed')`);r.setReadBigInts(true);const i=r.all();const a=e.prepare(`DELETE FROM delivery_queue_entries WHERE queue_name = ? AND id = ? AND status = 'failed'`);const o=e.prepare(`UPDATE delivery_queue_entries
        SET entry_kind = NULL, session_key = NULL, channel = NULL, target = NULL,
            account_id = NULL, retry_count = @retryCount, last_attempt_at = NULL,
            last_error = NULL, platform_send_started_at = NULL, entry_json = @entryJson,
            retention_id_prefix = @retention_id_prefix, retention_max_age_ms = @retention_max_age_ms,
            retention_max_entries = @retention_max_entries,
            enqueued_at = @failedAt, failed_at = @failedAt, recovery_state = @recoveryState
      WHERE queue_name = @queueName AND id = @id AND status = 'failed'`);for(const e of i){if(e.recovery_state===`settlement_pending`)continue;const r=safeParseJsonRecord(String(e.entry_json));const i=r??{};const s=String(e.queue_name);const c=String(e.id);if(e.status===`pending`){if(i.retainOnFailure!==true&&inferDeliveryQueueFailureRetention(i,c,s,true)){const t=JSON.stringify({...i,retainOnFailure:true});n.run({entryJson:t,queueName:s,id:c,previousJson:String(e.entry_json),...deriveDeliveryQueueRetentionColumns(c,t)})}continue}const l=nonNegativeSafeInteger(e.failed_at)??nonNegativeSafeInteger(e.updated_at)??t;const u=Math.max(nonNegativeSafeInteger(e.retry_count)??0,nonNegativeSafeInteger(i.retryCount)??0);const d=r?inferDeliveryQueueFailureRetention(i,c,s,true):`permanent`;if(!d){a.run(s,c);continue}const f=projectDeliveryQueueTerminalEntry({id:c,retryCount:u},l,`failed`,d);const p=JSON.stringify(f);o.run({retryCount:u,entryJson:p,...deriveDeliveryQueueRetentionColumns(c,p),failedAt:l,recoveryState:f.recoveryState??null,queueName:s,id:c})}pruneDeliveryQueueTombstones(e,t)}
//!src/state/openclaw-state-db-legacy-backfills.ts
function ensureOperatorApprovalResolutionRefs(e){if(!tableExists(e,`operator_approvals`))return;runSqliteImmediateTransactionSync(e,()=>{ensureColumn(e,`operator_approvals`,`resolution_ref TEXT`);const t=e.prepare(`SELECT approval_id, kind, resolution_ref FROM operator_approvals`).all();const n=e.prepare(`UPDATE operator_approvals SET resolution_ref = ? WHERE approval_id = ?`);for(const e of t){if(typeof e.approval_id!==`string`||!isCanonicalOperatorApprovalKind(e.kind))throw new Error(`operator approval row cannot be assigned a transport reference`);const t=buildApprovalResolutionRef({approvalId:e.approval_id,approvalKind:e.kind});if(e.resolution_ref!==t)n.run(t,e.approval_id)}if(e.prepare(`SELECT canonical.approval_id
         FROM operator_approvals AS canonical
         JOIN operator_approvals AS referenced
           ON canonical.approval_id = referenced.resolution_ref
         WHERE canonical.approval_id <> referenced.approval_id
         LIMIT 1`).get())throw new Error(`operator approval ids conflict with durable transport references`);e.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref
        ON operator_approvals(resolution_ref);
    `)})}function nullableTextValue(e,t){if(!e||!Object.hasOwn(e,t))return;const n=e[t];return typeof n===`string`||n===null?n:void 0}function repairLegacySubagentRetainedResults(e){if(!tableExists(e,`subagent_runs`))return;const repair=()=>{const t=tableHasColumn(e,`subagent_runs`,`pending_final_delivery_payload_json`);const n=e.prepare(t?`SELECT run_id, payload_json, pending_final_delivery_payload_json FROM subagent_runs`:`SELECT run_id, payload_json FROM subagent_runs`).all();const r=e.prepare(`UPDATE subagent_runs
          SET payload_json = ?
        WHERE run_id = ?`);for(const e of n){const t=safeParseJsonRecord(e.payload_json)??null;const n=t?asNullableRecord(t.parentCompletion):null;const i=n?.completionTarget===`parent`?n:t;const a=i?asNullableRecord(i.completion):null;if(!i||!a)continue;const o=asNullableRecord(i.delivery);const s=o?asNullableRecord(o.payload):null;const c=e.pending_final_delivery_payload_json?safeParseJsonRecord(e.pending_final_delivery_payload_json)??null:null;if(!Boolean(s&&(Object.hasOwn(s,`frozenResultText`)||Object.hasOwn(s,`fallbackFrozenResultText`))||c&&(Object.hasOwn(c,`frozenResultText`)||Object.hasOwn(c,`fallbackFrozenResultText`))))continue;const l=nullableTextValue(s,`frozenResultText`)??nullableTextValue(c,`frozenResultText`);const u=nullableTextValue(s,`fallbackFrozenResultText`)??nullableTextValue(c,`fallbackFrozenResultText`);if(nullableTextValue(a,`resultText`)==null&&l!==void 0)a.resultText=l;if(nullableTextValue(a,`fallbackResultText`)==null&&u!==void 0)a.fallbackResultText=u;delete s?.frozenResultText;delete s?.fallbackFrozenResultText;r.run(JSON.stringify(t),e.run_id)}};if(e.isTransaction){repair();return}runSqliteImmediateTransactionSync(e,repair)}function repairLegacySubagentExecutionPayloads(e){if(!tableExists(e,`subagent_runs`))return;e.exec(`
    UPDATE subagent_runs
    SET payload_json = json_remove(
      CASE
        WHEN json_extract(payload_json, '$.pauseReason') = 'sessions_yield'
          AND json_extract(payload_json, '$.execution.status') <> 'terminal'
          AND json_type(payload_json, '$.endedAt') IN ('integer', 'real')
        THEN json_remove(json_set(
          payload_json,
          '$.execution.status', 'terminal',
          '$.execution.endedAt', json_extract(payload_json, '$.endedAt')
        ), '$.execution.outcome')
        WHEN (json_type(payload_json, '$.killReconciliation') = 'object'
          OR json_extract(payload_json, '$.endedReason') = 'subagent-killed')
          AND json_extract(payload_json, '$.execution.status') <> 'terminal'
          AND json_type(payload_json, '$.endedAt') IN ('integer', 'real')
          AND json_type(payload_json, '$.outcome') = 'object'
        THEN json_set(
          payload_json,
          '$.execution.status', 'terminal',
          '$.execution.endedAt', json_extract(payload_json, '$.endedAt'),
          '$.execution.outcome', json_extract(payload_json, '$.outcome')
        )
        ELSE payload_json
      END,
      '$.startedAt', '$.endedAt', '$.outcome'
    )
    WHERE json_valid(payload_json)
      AND (json_type(payload_json, '$.startedAt') IS NOT NULL
        OR json_type(payload_json, '$.endedAt') IS NOT NULL
        OR json_type(payload_json, '$.outcome') IS NOT NULL);
  `)}function backfillAcpReplayEstimatedBytes(e,t=false){if(!tableExists(e,`acp_replay_events`)||!tableHasColumn(e,`acp_replay_events`,`estimated_bytes`))return;const n=`state.repair.acpReplayUtf8Accounting`;const r=tableExists(e,`config_machine_state`)?getNodeSqliteKysely(e):void 0;if(!t&&r&&executeSqliteQueryTakeFirstSync(e,r.selectFrom(`config_machine_state`).select(`state_key`).where(`state_key`,`=`,n)))return;const i=getNodeSqliteKysely(e);const a=e.prepare(`UPDATE acp_replay_events SET estimated_bytes = ? WHERE session_id = ? AND seq = ?`);for(const t of iterateSqliteQuerySync(e,i.selectFrom(`acp_replay_events`).select([`session_id`,`seq`,`session_key`,`run_id`,`update_json`,`estimated_bytes`]))){const e=estimateAcpEventRowBytes({sessionId:t.session_id,sessionKey:t.session_key,runId:t.run_id,updateJson:t.update_json});if(coerceRequiredSqliteNumber(t.estimated_bytes)!==e)a.run(e,t.session_id,t.seq)}const o=e.prepare(`UPDATE acp_replay_sessions SET estimated_bytes = ? WHERE session_id = ?`);for(const t of iterateSqliteQuerySync(e,i.selectFrom(`acp_replay_sessions as s`).select([`s.session_id`,`s.session_key`,`s.cwd`,`s.estimated_bytes`]).select(e=>e.fn.coalesce(e.selectFrom(`acp_replay_events as e`).select(e=>e.fn.sum(`e.estimated_bytes`).as(`total`)).whereRef(`e.session_id`,`=`,`s.session_id`),e.val(0)).as(`event_bytes`)))){const e=estimateAcpSessionRowBytes({sessionId:t.session_id,sessionKey:t.session_key,cwd:t.cwd})+coerceRequiredSqliteNumber(t.event_bytes);if(coerceRequiredSqliteNumber(t.estimated_bytes)!==e)o.run(e,t.session_id)}if(r)executeSqliteQuerySync(e,r.insertInto(`config_machine_state`).values({state_key:n,value_json:`true`,updated_at_ms:Date.now()}).onConflict(e=>e.column(`state_key`).doNothing()))}function backfillCronRunLogEntryJson(e){if(!tableExists(e,`cron_run_logs`)||!tableHasColumn(e,`cron_run_logs`,`entry_json`))return;const t=e.prepare(`SELECT store_key, job_id, seq, ts
         FROM cron_run_logs
        WHERE entry_json = '{}'`).all();if(t.length===0)return;const n=e.prepare(`UPDATE cron_run_logs
        SET entry_json = ?
      WHERE store_key = ? AND job_id = ? AND seq = ?`);for(const e of t)n.run(JSON.stringify({ts:coerceRequiredSqliteNumber(e.ts),jobId:e.job_id,action:`finished`}),e.store_key,e.job_id,e.seq)}function textField(e,t){const n=e?.[t];return typeof n===`string`&&n.trim()?n:null}function backfillCronJobsFromJobJson(e){if(!tableExists(e,`cron_jobs`)||!tableHasColumn(e,`cron_jobs`,`job_json`)||!tableHasColumn(e,`cron_jobs`,`payload_kind`))return;const t=e.prepare(`SELECT store_key, job_id, job_json, updated_at
         FROM cron_jobs
        WHERE payload_kind = 'message'
           OR name = ''`).all();if(t.length===0)return;const n=e.prepare(`UPDATE cron_jobs
        SET name = ?,
            enabled = ?,
            agent_id = ?,
            payload_kind = ?,
            runtime_updated_at_ms = ?
      WHERE store_key = ?
        AND job_id = ?`);for(const e of t){const t=safeParseJsonRecord(e.job_json)??null;if(!t)continue;const r=asNullableRecord(t.schedule);const i=asNullableRecord(t.payload);const a=textField(r,`kind`);const o=textField(i,`kind`);const s=a===`at`&&textField(r,`at`);const c=a===`every`&&asFiniteNumber(r?.everyMs)!=null;const l=a===`cron`&&textField(r,`expr`);const u=o===`systemEvent`&&textField(i,`text`);const d=o===`agentTurn`&&textField(i,`message`);if(!r||!i||!s&&!c&&!l||!u&&!d)continue;n.run(textField(t,`name`)??e.job_id,t.enabled===false?0:1,textField(t,`agentId`),o,asFiniteNumber(t.updatedAtMs)??(coerceRequiredSqliteNumber(e.updated_at)||0),e.store_key,e.job_id)}}function backfillDeliveryQueueEntriesFromEntryJson(e){if(!tableExists(e,`delivery_queue_entries`)||!tableHasColumn(e,`delivery_queue_entries`,`entry_json`)||!tableHasColumn(e,`delivery_queue_entries`,`retry_count`))return;compactLegacyDeliveryQueueFailures(e);const t=e.prepare(`SELECT queue_name, id, entry_json
         FROM delivery_queue_entries
        WHERE status = 'pending'
          AND (retry_count = 0
            OR last_attempt_at IS NULL
            OR last_error IS NULL
            OR recovery_state IS NULL
            OR platform_send_started_at IS NULL
            OR entry_kind IS NULL
            OR session_key IS NULL
            OR channel IS NULL
            OR target IS NULL
            OR account_id IS NULL)`).all();if(t.length===0)return;const n=e.prepare(`UPDATE delivery_queue_entries
        SET entry_kind = COALESCE(?, entry_kind),
            session_key = COALESCE(?, session_key),
            channel = COALESCE(?, channel),
            target = COALESCE(?, target),
            account_id = COALESCE(?, account_id),
            retry_count = ?,
            last_attempt_at = COALESCE(?, last_attempt_at),
            last_error = COALESCE(?, last_error),
            recovery_state = COALESCE(?, recovery_state),
            platform_send_started_at = COALESCE(?, platform_send_started_at)
      WHERE queue_name = ?
        AND id = ?`);for(const e of t){const t=safeParseJsonRecord(e.entry_json)??null;if(!t)continue;const r=asNullableRecord(t.session);const i=asNullableRecord(t.route);const a=asNullableRecord(t.deliveryContext);n.run(textField(t,`kind`),textField(t,`sessionKey`)??textField(r,`key`),textField(t,`channel`)??textField(i,`channel`)??textField(a,`channel`),textField(t,`to`)??textField(i,`to`)??textField(a,`to`),textField(t,`accountId`)??textField(i,`accountId`)??textField(a,`accountId`),asSafeIntegerInRange(t.retryCount,{min:0})??0,asSafeIntegerInRange(t.lastAttemptAt,{min:0})??null,textField(t,`lastError`),textField(t,`recoveryState`),asSafeIntegerInRange(t.platformSendStartedAt,{min:0})??null,e.queue_name,e.id)}}
//!src/state/openclaw-state-db-schema-v13-widerow.ts
const FAILURE_DESTINATION_COLUMNS=[[`failure_delivery_mode`,`mode`],[`failure_delivery_channel`,`channel`],[`failure_delivery_to`,`to`],[`failure_delivery_account_id`,`accountId`]];function reprojectLegacyCronJson(e){const t=FAILURE_DESTINATION_COLUMNS.map(([t])=>tableHasColumn(e,`cron_jobs`,t)?quoteSqliteIdentifier(t):`NULL AS ${quoteSqliteIdentifier(t)}`);const n=tableHasColumn(e,`cron_jobs`,`last_run_status`)?`last_run_status`:`NULL AS last_run_status`;const r=e.prepare(`SELECT store_key, job_id, enabled, job_json, state_json, ${n}, ${t.join(`, `)}
         FROM cron_jobs`).all();const i=e.prepare(`UPDATE cron_jobs SET job_json = ?, state_json = ? WHERE store_key = ? AND job_id = ?`);for(const e of r){if(typeof e.store_key!==`string`||typeof e.job_id!==`string`||typeof e.job_json!==`string`||typeof e.state_json!==`string`)throw new Error(`OpenClaw v12 cron job row is not canonical`);const t=asNullableRecord(safeParseJson(e.job_json));const n=asNullableRecord(safeParseJson(e.state_json));if(!t||!n)continue;let r=false;const a=asNullableRecord(t.delivery);const o=asNullableRecord(a?.failureDestination);if((!Object.hasOwn(t,`delivery`)||a!==null)&&(!a||!Object.hasOwn(a,`failureDestination`)||o!==null)){const n=a??{};const i=o??{};for(const[t,n]of FAILURE_DESTINATION_COLUMNS){const a=e[t];if(typeof a!==`string`||Object.hasOwn(i,n))continue;i[n]=a===``?null:a;r=true}if(r){n.failureDestination=i;t.delivery=n}}if(typeof t.enabled!==`boolean`){t.enabled=e.enabled!==0;r=true}const s=Object.hasOwn(n,`lastStatus`);if(!Object.hasOwn(n,`lastRunStatus`)&&(s||typeof e.last_run_status===`string`)){n.lastRunStatus=s?n.lastStatus:e.last_run_status;r=true}if(r)i.run(JSON.stringify(t),JSON.stringify(n),e.store_key,e.job_id)}}function rebuildJsonCanonicalTable(e,t){const n=`${t}_migration_v13`;if(tableExists(e,n))throw new Error(`OpenClaw v13 migration table already exists: ${n}`);const r=extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL,t,{errorMessage:`Canonical ${t} schema block is missing`}).replace(`CREATE TABLE IF NOT EXISTS ${t} (`,`CREATE TABLE ${n} (`);e.exec(r);const i=e.prepare(`PRAGMA table_xinfo(${n})`).all().flatMap(e=>e.hidden===0&&typeof e.name===`string`?[e.name]:[]);const a=i.map(n=>{return CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS.some(e=>e.tableName===t&&e.columnName===n)&&!tableHasColumn(e,t,n)?`NULL`:quoteSqliteIdentifier(n)});e.exec(`INSERT INTO ${n} (${i.map(quoteSqliteIdentifier).join(`, `)}) SELECT ${a.join(`, `)} FROM ${t};`);e.exec(`DROP TABLE ${t};`);e.exec(`ALTER TABLE ${n} RENAME TO ${t};`)}function migrateJsonCanonicalWideRowsV13(e,t){if(t>=13)return false;let n=false;if(tableExists(e,`cron_jobs`)&&tableHasColumn(e,`cron_jobs`,`schedule_kind`)){reprojectLegacyCronJson(e);rebuildJsonCanonicalTable(e,`cron_jobs`);n=true}const r=tableExists(e,`workspace_setup_state`);const i=tableExists(e,`workspace_attestations`);if(r&&!tableHasColumn(e,`workspace_setup_state`,`attested_at_ms`)){e.exec(`ALTER TABLE workspace_setup_state ADD COLUMN attested_at_ms INTEGER;`);e.exec(`ALTER TABLE workspace_setup_state ADD COLUMN attestation_updated_at_ms INTEGER;`);rebuildJsonCanonicalTable(e,`workspace_setup_state`);n=true}if(i){e.exec(`
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
    `);const t=tableExists(e,`workspace_path_aliases`)?`(SELECT alias.workspace_path FROM workspace_path_aliases alias
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
    `);e.exec(`DROP TABLE workspace_attestations;`);n=true}if((r||i)&&tableExists(e,`workspace_generated_bootstrap_hashes`)){rebuildJsonCanonicalTable(e,`workspace_generated_bootstrap_hashes`);e.exec(`
      DELETE FROM workspace_generated_bootstrap_hashes
       WHERE workspace_key NOT IN (SELECT workspace_key FROM workspace_setup_state);
    `)}for(const[t,r,i]of[[`auth_profile_stores`,`store_json`,`authProfiles.store`],[`auth_profile_state`,`state_json`,`authProfiles.state`]]){if(!tableExists(e,t))continue;e.prepare(`INSERT INTO config_machine_state (state_key, value_json, updated_at_ms)
       SELECT ?, ${r}, updated_at FROM ${t} WHERE store_key = 'shared'
       ON CONFLICT(state_key) DO NOTHING`).run(i);e.exec(`DROP TABLE ${t};`);n=true}if(tableExists(e,`installed_plugin_index`)){const t=e.prepare(`SELECT * FROM installed_plugin_index WHERE index_key = 'installed-plugin-index'`).get();if(t){const n=asNullableRecord(safeParseJson(String(t.install_records_json)));const r=safeParseJson(String(t.plugins_json));const i=safeParseJson(String(t.diagnostics_json));if(!n||!Array.isArray(r)||!Array.isArray(i)){const n=`plugins.installedIndex.quarantine`;const r=`Preserved invalid legacy installed_plugin_index row in diagnostic_events (${n}). Run openclaw doctor --fix or openclaw plugins registry --refresh to repair the plugin index; inspect the preserved row if install records need recovery.`;createSqliteAuditRecordKernel(e,{scope:n,maxEntries:Number.MAX_SAFE_INTEGER}).register(prepareSqliteAuditRecord(n,{key:createHash(`sha256`).update(JSON.stringify(t)).digest(`hex`),value:{level:`warn`,message:r,raw:t},createdAt:Date.now()}));deferSqlitePostCommitPublication(e,()=>createSubsystemLogger(`state/db`).warn(r))}const a={version:Number(t.version),...typeof t.warning===`string`&&t.warning?{warning:t.warning}:{},hostContractVersion:t.host_contract_version,compatRegistryVersion:t.compat_registry_version,migrationVersion:Number(t.migration_version),policyHash:t.policy_hash,generatedAtMs:Number(t.generated_at_ms),...typeof t.workspace_dir===`string`?{workspaceDir:t.workspace_dir}:{},...typeof t.refresh_reason===`string`&&t.refresh_reason?{refreshReason:t.refresh_reason}:{},installRecords:n,plugins:r,diagnostics:i};e.prepare(`INSERT INTO config_machine_state (state_key, value_json, updated_at_ms)
         VALUES (?, ?, ?) ON CONFLICT(state_key) DO NOTHING`).run(`plugins.installedIndex`,JSON.stringify({revision:Number(t.updated_at_ms),index:a}),Number(t.updated_at_ms))}e.exec(`DROP TABLE installed_plugin_index;`);n=true}if(tableExists(e,`subagent_runs`)&&tableHasColumn(e,`subagent_runs`,`task`)){repairLegacySubagentRetainedResults(e);rebuildJsonCanonicalTable(e,`subagent_runs`);n=true}return n}
//!src/state/openclaw-state-db-schema-v24-indexes.ts
const TASK_RUN_INDEX_RETIREMENT_V24_SQL=`
    DROP INDEX IF EXISTS idx_task_runs_run_id;
    DROP INDEX IF EXISTS idx_task_runs_status;
    DROP INDEX IF EXISTS idx_task_runs_runtime_status;
    DROP INDEX IF EXISTS idx_task_runs_cleanup_after;
    DROP INDEX IF EXISTS idx_task_runs_last_event_at;
    DROP INDEX IF EXISTS idx_task_runs_owner_key;
    DROP INDEX IF EXISTS idx_task_runs_parent_flow_id;
    DROP INDEX IF EXISTS idx_task_runs_child_session_key;
    DROP INDEX IF EXISTS idx_task_runs_requester_session_key;
    DROP INDEX IF EXISTS idx_task_runs_runtime_source_ended;
    DROP INDEX IF EXISTS idx_task_runs_runtime_ended;
`;function migrateTaskRunIndexesV24(e,t){if(t>=24)return false;e.exec(TASK_RUN_INDEX_RETIREMENT_V24_SQL);return true}
//!src/state/openclaw-state-db-schema-v26-layout.ts
function withLegacyStateHeadLayout(e){return e.replace(/(CREATE TABLE IF NOT EXISTS session_state_heads \([\s\S]*?\n\) STRICT), WITHOUT ROWID;/u,`$1;`)}function migrateSessionStateHeadLayoutV26(e,t){return t<26&&migrateSqliteTableWithoutRowid(e,`session_state_heads`)}
//!src/state/openclaw-state-db-schema-v27-indexes.ts
function withLegacyStateWriteIndexes(e){return`${e.replace(/ON state_leases\(owner\);/u,`ON state_leases(owner, updated_at DESC);`)}
CREATE INDEX IF NOT EXISTS idx_skill_usage_key
  ON skill_usage(skill_key, skill_file);
CREATE INDEX IF NOT EXISTS idx_acp_replay_events_session_seq
  ON acp_replay_events(session_id, seq);
`}const STATE_WRITE_INDEX_RETIREMENT_V27_SQL=`
  DROP INDEX IF EXISTS idx_acp_replay_events_session_seq;
  DROP INDEX IF EXISTS idx_skill_usage_key;
  DROP INDEX IF EXISTS idx_state_leases_owner;
`;function migrateStateWriteIndexesV27(e,t){if(t>=27)return false;e.exec(STATE_WRITE_INDEX_RETIREMENT_V27_SQL);return true}
//!src/infra/state-database-maintenance.ts
const StateSchemaMutationConflictError=resolveGlobalSingleton(Symbol.for(`openclaw.stateSchemaMutationConflictError`),()=>class SchemaMutationConflictError extends Error{constructor(e,t){super(`OpenClaw refused shared state schema mutation at ${e} because another Gateway owns that state directory. Stop that Gateway or perform the update through its managed restart path, then retry.`,{cause:t});this.name=`StateSchemaMutationConflictError`}});function acquireSchemaMaintenanceLease({databasePath:e,busyTimeoutMs:t}){if(requestSqliteWorkerSchemaMaintenance(e))return;const n=resolveIdentityPathViaExistingAncestorSync(e);const r=getStateDatabaseSchemaLease(n);if(r){r.assertCurrent();return}try{return acquireStateDatabaseSchemaLease(n,{busyTimeoutMs:t})}catch(e){if(e instanceof GatewayStateOwnerContentionError)throw new StateSchemaMutationConflictError(n,e);throw e}}function withStateDatabaseSchemaMaintenance(e,t){const n=acquireSchemaMaintenanceLease(e);if(!n)return t();return runWithSqliteCleanup(n,`state schema mutation`,()=>n.run(t))}async function withStateDatabaseSchemaMaintenanceAsync(e,t){const n=acquireSchemaMaintenanceLease(e);if(!n)return await t();let r;try{r={value:await n.run(t)}}catch(e){r={error:e}}try{n.release()}catch(e){if(`error`in r)throw createSqliteLifecycleAggregateError([r.error,e],`state schema mutation and resource release both failed`,r.error);throw new SqliteCoordinatorError(`state schema mutation completed, but releasing its resource failed`,e)}if(`error`in r)throw r.error;return r.value}
//!src/state/openclaw-state-ownership.ts
const STATE_SUPERVISION_KEY=`gateway.supervision`;const MAX_OWNERSHIP_TIMESTAMP_MS=864e13;const MANAGER_ID_PATTERN=/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u;const ownershipAdmission={name:`state.external-ownership`,read(e){if(e===null)return null;if(isRecord(e)&&e.version===1&&e.mode===`external`&&typeof e.managerId===`string`&&typeof e.claimedAt===`number`)return{version:1,mode:`external`,managerId:e.managerId,claimedAt:e.claimedAt}}};function isOpenClawStateWriteContentionError(e){return e instanceof GatewayStateOwnerContentionError||e instanceof StateSchemaMutationConflictError||isSqliteLockError(e)}function parseExternalOwnership(e,t){let n;try{n=JSON.parse(e)}catch{throw new OpenClawStateOwnershipMetadataError(t,`reserved value is not valid JSON`)}const r=isRecord(n)?n:void 0;const i=r?Object.keys(r).toSorted().join(`,`):``;const a=r?.managerId;const o=r?.claimedAt;if(i!==`claimedAt,managerId,mode,version`||r?.version!==1||r?.mode!==`external`||typeof a!==`string`||!MANAGER_ID_PATTERN.test(a)||typeof o!==`number`||!Number.isSafeInteger(o)||o<0||o>MAX_OWNERSHIP_TIMESTAMP_MS)throw new OpenClawStateOwnershipMetadataError(t,`reserved value does not match the version 1 external ownership contract`);return{version:1,mode:`external`,managerId:a,claimedAt:o}}function inspectOpenClawStateOwnershipFromDatabase(e,t,n=false){try{if(!n&&!tableExists(e,`config_machine_state`))return null;const r=n||isPostgresSqlConnection(e)?`SELECT value_json FROM config_machine_state WHERE state_key = ? LIMIT 1`:`SELECT value_json FROM config_machine_state NOT INDEXED WHERE state_key = ? LIMIT 1`;const i=e.prepare(r).get(STATE_SUPERVISION_KEY);if(!i)return null;if(typeof i.value_json!==`string`)throw new OpenClawStateOwnershipMetadataError(t,`reserved value is not text`);return parseExternalOwnership(i.value_json,t)}catch(e){throw normalizeOpenClawStateSchemaReadError(e,t)}}function assertOwnershipAllowsWrite(e,t,n){if(e&&!isGatewayExternallySupervised(n))throw new OpenClawStateExternalOwnershipError(t,e.managerId)}function assertOpenClawStateWriteAllowed(e){const t=path.resolve(e.databasePath);assertStateDatabaseAccessAllowed(t);let n=e.inspectOwnership?void 0:getSqliteDatabaseAdmission(e.database,ownershipAdmission);if(n===void 0){const r=inspectOpenClawStateOwnershipFromDatabase(e.database,t,e.schemaReady);n=e.inspectOwnership?void 0:getSqliteDatabaseAdmission(e.database,ownershipAdmission);if(n===void 0){n=r;publishSqliteDatabaseAdmission(e.database,ownershipAdmission,n)}}assertOwnershipAllowsWrite(n,t,e.env??process.env)}
//!src/state/openclaw-state-schema-runtime.ts
const runtimeSchemaCache=/* @__PURE__ */ new Map;function getOpenClawStateRuntimeSchema(e,t=OPENCLAW_STATE_SCHEMA_SQL){const{includeVersionLazyAdditiveTables:n,includeAgentDeletionJournal:r=true}=e;const i=`${n}:${r}:${t===OPENCLAW_STATE_SCHEMA_SQL?`current`:t}`;const a=runtimeSchemaCache.get(i);if(a!==void 0)return a;let o=t;const s=[...n?FIRST_USE_STATE_TABLES:LAZY_ADDITIVE_STATE_TABLES,...r?[]:DOCTOR_OWNED_STATE_TABLES];const c=n?FIRST_USE_STATE_INDEXES:LAZY_ADDITIVE_STATE_INDEXES;for(const e of s){if(t!==OPENCLAW_STATE_SCHEMA_SQL&&!o.includes(`CREATE TABLE IF NOT EXISTS ${e} (`))continue;o=o.replace(extractSqliteTableSchema(o,e,{errorMessage:`lazy additive state schema block is missing for ${e}`}),``)}for(const e of c){const t=o.indexOf(`CREATE INDEX IF NOT EXISTS ${e}`);const n=o.indexOf(`CREATE UNIQUE INDEX IF NOT EXISTS ${e}`);const r=t>=0?t:n;const i=r>=0?o.indexOf(`;`,r):-1;if(r<0||i<0)throw new Error(`lazy additive state schema index is missing for ${e}`);o=`${o.slice(0,r)}${o.slice(i+1)}`}runtimeSchemaCache.set(i,o);return o}function getOpenClawStatePredecessorSchema(e){let t=OPENCLAW_STATE_SCHEMA_SQL;for(const[n,r]of[[40,withLegacyWorkerProvisionSource],[40,withLegacyStateV40Additions],[39,withLegacyWorkerRetention],[38,withLegacyRepositoryDiskAuthority],[37,withLegacyWorkerResourceReceipts],[36,withLegacyTemplateStateSchema],[35,withLegacyLocalWorkspaceCas],[31,withLegacyLocalWorkspaceManifests],[27,withLegacyStateWriteIndexes],[26,withLegacyStateHeadLayout]])if(e<n)t=r(t);return t}
//!src/state/openclaw-state-schema-compatibility.ts
const STATE_V6_ADDITIVE_TABLES=[...LAZY_ADDITIVE_STATE_TABLES,`worker_session_tool_operations`,`worker_turn_tool_authorities`];const STATE_V5_ADDITIVE_TABLES=[`agent_database_leases`,`agent_deletion_journal`,`claw_cron_refs`,`claw_installs`,`claw_mcp_server_refs`,`claw_package_refs`,`claw_workspace_files`,`config_machine_state`,`cron_job_scratch`,`meeting_transcript_sessions`,`meeting_transcript_summaries`,`meeting_transcript_utterances`,`outbound_media_provenance`,`worker_environment_credentials`,`worker_transcript_commit_heads`,`worker_transcript_commits`,...STATE_V6_ADDITIVE_TABLES];const CLAW_LAZY_ADDITIVE_STATE_COLUMNS=CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS.map(({columnName:e,tableName:t})=>`${t}.${e}`);const CLAW_FIRST_USE_ADDITIVE_STATE_COLUMNS=CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS.map(({columnName:e,tableName:t})=>`${t}.${e}`);const CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_SET=new Set(CLAW_FIRST_USE_ADDITIVE_STATE_COLUMNS);const CLAW_STARTUP_ADDITIVE_STATE_COLUMN_SET=/* @__PURE__ */ new Set([...CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS.map(({columnName:e,tableName:t})=>`${t}.${e}`),...Object.values(ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS).flat().map(([e,t])=>`${e}.${t.split(` `,1)[0]}`)]);const CLAW_STARTUP_ADDITIVE_STATE_TABLES=[`worker_session_tool_operations`,`worker_turn_tool_authorities`];const CLAW_STARTUP_ADDITIVE_STATE_TABLE_SET=new Set(CLAW_STARTUP_ADDITIVE_STATE_TABLES);const CLAW_READONLY_OPTIONAL_STATE_INDEXES=[`idx_meeting_transcript_utterances_id`,`idx_operator_approvals_source_run_resolved`,`idx_worker_session_placements_environment`];let openClawStateCanonicalNamedIndexSet;function getOpenClawStateCanonicalNamedIndexSet(){openClawStateCanonicalNamedIndexSet??=new Set(getCanonicalSqliteNamedIndexNames(OPENCLAW_STATE_SCHEMA_SQL));return openClawStateCanonicalNamedIndexSet}const RETAINED_STATE_TABLES=[`fleet_cells`];const STATE_PERSISTENT_SCHEMA_COMPATIBILITY={excludedTables:RETAINED_STATE_TABLES,allowCompatibleAdditiveColumns:true,allowedMissingTables:DOCTOR_OWNED_STATE_TABLES,allowedMissingColumns:CLAW_FIRST_USE_ADDITIVE_STATE_COLUMNS,allowedColumnDefinitions:{"diagnostic_events.sequence":[`sequence INTEGER NOT NULL DEFAULT 0`],"template_package_refs.package_integrity":[`package_integrity TEXT NOT NULL DEFAULT 'sha256:0000000000000000000000000000000000000000000000000000000000000000'`],"template_package_refs.updated_at_ms":[`updated_at_ms INTEGER NOT NULL DEFAULT 0`],"cron_jobs.enabled":[`enabled INTEGER NOT NULL DEFAULT 1`],"cron_jobs.name":[`name TEXT NOT NULL DEFAULT ''`],"cron_jobs.payload_kind":[`payload_kind TEXT NOT NULL DEFAULT 'message'`],"current_conversation_bindings.conversation_kind":[`conversation_kind TEXT NOT NULL DEFAULT 'channel'`],"operator_approvals.resolution_ref":[`resolution_ref TEXT`],"worker_environments.desktop_json":[`desktop_json TEXT`],"worker_environments.bootstrap_install_kind":[`bootstrap_install_kind TEXT`],"worker_environments.shared_host":[`shared_host INTEGER CHECK (shared_host IN (0, 1))`],"worker_environments.node_setup_id":[`node_setup_id TEXT`],"worker_environments.node_device_id":[`node_device_id TEXT`],"worker_session_placements.terminal_reason":[`terminal_reason TEXT`],"worker_session_placements.terminal_at_ms":[`terminal_at_ms INTEGER`]}};const STATE_RUNTIME_SCHEMA_COMPATIBILITY={...STATE_PERSISTENT_SCHEMA_COMPATIBILITY,excludedTables:[...RETAINED_STATE_TABLES,...LAZY_ADDITIVE_STATE_TABLES],excludedIndexes:LAZY_ADDITIVE_STATE_INDEXES};function findMissingLazyStateStartupColumn(e){for(const{tableName:t,columnName:n}of CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS){if(!STATE_RUNTIME_SCHEMA_COMPATIBILITY.excludedTables?.includes(t))continue;const r=e(t);if(r&&!r.columns.some(e=>e.name===n))return{tableName:t,columnName:n}}}const OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY={...STATE_PERSISTENT_SCHEMA_COMPATIBILITY,allowedMissingTables:[...LAZY_ADDITIVE_STATE_TABLES,...CLAW_STARTUP_ADDITIVE_STATE_TABLES,...DOCTOR_OWNED_STATE_TABLES],allowedMissingIndexes:CLAW_READONLY_OPTIONAL_STATE_INDEXES,allowedMissingColumns:CLAW_LAZY_ADDITIVE_STATE_COLUMNS};function isOpenClawStateStartupRepairableSchemaIssue(e){if(e.code===`missing-table`)return CLAW_STARTUP_ADDITIVE_STATE_TABLE_SET.has(e.objectName);if(e.code===`missing-column`)return CLAW_STARTUP_ADDITIVE_STATE_COLUMN_SET.has(e.objectName);return e.code===`missing-or-drifted-index`&&getOpenClawStateCanonicalNamedIndexSet().has(e.objectName)}function isOpenClawStateFirstUseSchemaIssue(e){return e.code===`missing-column`&&CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_SET.has(e.objectName)}
//!src/state/openclaw-update-schema-refusal.ts
var UpdateSchemaRefusalError=class extends Error{constructor(e,t,n){const{targetVersion:r}=n;const i=n.recovery?.commands??[`openclaw gateway stop`,`npm install -g openclaw@${r} --allow-scripts=openclaw`,`openclaw doctor --fix`,`openclaw gateway start`];const a=n.cause===void 0?``:` Deferral failed: ${formatErrorMessage(n.cause).slice(0,600)}.`;const o=`Doctor refused update-time schema repair driven by OpenClaw ${t}: this updater reopens the ledger with old code after migration, and version publication could not be deferred safely.`;const s=`${e.map(e=>`${e.kind} database ${e.path}: on-disk schema ${e.foundVersion}, this build's schema ${e.supportedVersion}.`).join(` `)}${a} The blocked schema change was not applied.`;super(n.recovery?`${o} ${s}\n${n.recovery.message}`:[o,s,`Let the updater restore the previous package and exit. Then use an independent shell with the original service account, package prefix, profile, and state/config overrides.`,`Manual update: ${i.join(` && `)}.`,`Use the package manager that owns this install (pnpm: pnpm add -g --allow-build=openclaw openclaw@${r}; Bun: bun add -g --trust openclaw@${r}). On npm 11.15 and earlier, omit --allow-scripts=openclaw.`].join(`
`),n);this.databases=e;this.updaterVersion=t;this.code=`update-schema-bump-unfenced`;this.name=`UpdateSchemaRefusalError`;this.targetVersion=r;this.commands=i}};
//!src/state/schema-migration-backup-tables.ts
const SCHEMA_MIGRATION_BACKUP_TABLES={agent:{[30]:[`trajectory_runtime_events`,`sqlite_stat1`,`sqlite_stat4`],27:[`context_engine_turn_outbox`,`sqlite_stat1`,`sqlite_stat4`],28:[`transcript_event_identities`,`session_windows`,`memory_entry_origins`,`sqlite_stat1`,`sqlite_stat4`],29:[`session_nodes`,`session_reactions`,`sqlite_stat1`,`sqlite_stat4`],31:[`memory_index_sources`,`memory_index_chunks`],32:[],33:[],34:[],35:[],36:[],37:[`session_transcript_cold_archive_chunks`],38:[],39:[`transcript_events`],40:[`session_creation_operations`],41:[`session_transcript_active_event_facts`],42:[`agent_tool_usage`]},state:{[29]:[...CLIENT_CREDENTIAL_SOURCE_TABLES,`sqlite_stat1`,`sqlite_stat4`],[23]:[`meeting_transcript_sessions`,`worker_environments`],26:[`session_state_heads`,`sqlite_stat1`,`sqlite_stat4`],27:[`acp_replay_events`,`skill_usage`,`state_leases`,`sqlite_stat1`,`sqlite_stat4`],28:[`github_publication_requests`,`github_personal_publication_requests`,`github_repository_publication_requests`],30:[],31:[`local_workspace_projections`,`local_workspace_manifest_nodes`,`sqlite_stat1`,`sqlite_stat4`],32:[],33:[],34:[`config_machine_state`],35:[`local_workspace_projections`,`local_workspace_manifest_nodes`,`local_workspace_tree_packs`,`local_workspace_source_path_sets`],36:[`claw_installs`,`template_installs`,`claw_workspace_files`,`template_workspace_files`,`claw_package_refs`,`template_package_refs`,`claw_cron_refs`,`template_cron_refs`,`claw_mcp_server_refs`,`template_mcp_server_refs`,`agent_provenance`,`sqlite_stat1`,`sqlite_stat4`],37:[`worker_environments`],38:[`session_repository_workspaces`,`worker_workspace_pending_results`],39:[`worker_environments`],40:[`worker_environments`]}};
//!src/state/schema-migration-integrity-tables.ts
const indexStatistics=[`sqlite_stat1`,`sqlite_stat4`];const SCHEMA_MIGRATION_HISTORICAL_REPAIR_TABLES={agent:[`auth_profile_store`,`auth_profile_state`,`session_nodes`,`session_entry_snapshots`,`session_windows`,`session_key_contract`,`session_canonical_validation_pending`,`memory_index_chunks`,`memory_index_chunk_recall_metadata`,`memory_index_chunk_provenance`,`memory_index_sources`,`memory_index_paths_fts`,`memory_index_state`,...indexStatistics],state:[...CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS.map(({tableName:e})=>e),...Object.values(ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS).flatMap(e=>e.map(([e])=>e)),`audit_events`,`audit_identity_keys`,`operator_approvals`,`session_watch_cursors`,`subagent_runs`,`worker_session_placements`,`meeting_transcript_sessions`,`meeting_transcript_summaries`,`delivery_queue_entries`,`worker_turn_tool_authorities`,`worker_session_tool_operations`,`migration_runs`,`sqlite_sequence`,...indexStatistics]};const migrationTables={agent:{...SCHEMA_MIGRATION_BACKUP_TABLES.agent,39:[],10:[`session_transcript_active_events`,`session_transcript_index_state`],11:[`sessions`,`conversations`,`session_conversations`],13:[`transcript_rewrite_watermarks`],14:[`sessions`,`session_entries`,`session_routes`,`session_nodes`,`session_windows`,`session_transcript_generations`,`transcript_rewrite_watermarks`,`board_tabs`,`board_widgets`,`heartbeat_outcomes`,`session_members`,`session_transcript_index_state`],17:[`state_leases`],18:[`session_participants`],19:[`session_nodes`],21:[`session_key_contract`,`session_canonical_validation_pending`],22:[`session_transcript_fts_rows`],23:[`transcript_events`,`session_transcript_fts`,`session_transcript_fts_rows`,`session_transcript_index_state`,`memory_index_sources`,`memory_index_chunks`,`memory_index_chunks_fts`,`memory_index_chunk_recall_metadata`,`memory_embedding_cache`,`memory_index_meta`,`memory_index_state`,`cache_entries`],24:[`session_nodes`,`session_entry_snapshots`],25:[`session_pending_inputs`,`session_nodes`,`session_windows`,`session_key_contract`,`session_canonical_validation_pending`],26:[`session_nodes`,`context_engine_turn_outbox`,`transcript_events`]},state:{...SCHEMA_MIGRATION_BACKUP_TABLES.state,2:[`audit_events`,`audit_identity_keys`,`sqlite_sequence`],4:[`session_watch_cursors`],7:[`commitments`],8:[`worker_session_placements`],9:[`agent_databases`],10:[`agent_model_catalogs`,`android_notification_recent_packages`,`command_log_entries`,`diagnostic_stability_bundles`,`media_blobs`,`model_capability_cache`],11:[`skill_lifecycle`,`skill_workshop_proposal_origin_runs`],12:[`config_machine_state`,`skill_curator_state`,`update_check_state`,`clawhub_promotions_feed_state`,`model_catalog_remote`,`voicewake_triggers`,`voicewake_routing_routes`,`voicewake_routing_config`,`onboarding_recommendations`,`cron_store_epochs`,`tui_last_sessions`,`sidebar_sections`,`node_host_config`,`web_push_vapid_keys`],13:[`cron_jobs`,`subagent_runs`,`workspace_setup_state`,`workspace_attestations`,`workspace_generated_bootstrap_hashes`,`auth_profile_stores`,`auth_profile_state`,`installed_plugin_index`,`config_machine_state`,`diagnostic_events`],14:[`cron_jobs`],15:[`current_conversation_bindings`],17:[`worker_environments`],18:[`github_publication_session_lifecycles`,`github_repository_publication_requests`],20:[`cron_run_receipts`],21:[`meeting_transcript_sessions`,`meeting_transcript_summaries`,`delivery_queue_entries`,...indexStatistics],22:[`worker_session_placements`,`meeting_transcript_sessions`,`meeting_transcript_summaries`,`delivery_queue_entries`,`acp_sessions`,`operator_approvals`,`cron_run_receipts`,`execution_decision_facts`,`skill_workshop_changes`,...indexStatistics],24:[`task_runs`,...indexStatistics],25:[]}};function resolveSchemaMigrationIntegrityTables(e){if(e.kind===`agent`&&e.foundVersion>=38&&e.foundVersion<e.supportedVersion&&e.supportedVersion<=40)return[`schema_meta`];if(e.kind===`agent`&&e.foundVersion>=40&&e.foundVersion<e.supportedVersion&&e.supportedVersion<=42)return[`schema_meta`,...e.foundVersion<41?[`session_transcript_active_event_facts`]:[],...e.supportedVersion>=42?[`agent_tool_usage`]:[]];const t=/* @__PURE__ */ new Set([`schema_meta`]);if(e.foundVersion===e.supportedVersion)for(const n of SCHEMA_MIGRATION_HISTORICAL_REPAIR_TABLES[e.kind])t.add(n);for(let n=e.foundVersion+1;n<=e.supportedVersion;n++)for(const r of migrationTables[e.kind][n]??[])t.add(r);if(e.kind===`agent`){for(const{tableName:e}of STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS)t.add(e);if(e.foundVersion<20){t.add(`board_widgets`);t.add(`memory_index_sources`);t.add(`memory_index_paths_fts`)}if(e.foundVersion<25)for(const e of SCHEMA_MIGRATION_HISTORICAL_REPAIR_TABLES.agent)t.add(e)}else{t.add(`config_machine_state`);if(e.foundVersion<20)for(const e of SCHEMA_MIGRATION_HISTORICAL_REPAIR_TABLES.state)t.add(e)}return[...t].toSorted()}
//!src/state/openclaw-state-db-maintenance.ts
function assertMigratedStateTableIntegrity(e,t,n,r=false){const i=resolveSchemaMigrationIntegrityTables({kind:`state`,foundVersion:n,supportedVersion:40});const a=r?/* @__PURE__ */ new Set([...i,...SCHEMA_MIGRATION_HISTORICAL_REPAIR_TABLES.state]):i;for(const n of a)if(tableExists(e,n))assertSqliteTableIntegrity(e,t,n)}function assertOpenClawStateDatabaseOwner(e,t){const n=getStateSchemaVersionAdmission(e);if(n&&getStateRuntimeSchemaAdmission(e))return{schema_version:n.userVersion};const r=tableExists(e,`schema_meta`);let i;try{i=r?e.prepare(`SELECT role, schema_version FROM schema_meta WHERE meta_key = 'primary' LIMIT 1`).get():void 0}catch(t){throw classifySqliteTableReadError(e,`schema_meta`,[`meta_key`,`role`,`schema_version`],t)}if(i?.role!==`global`){const e=typeof i?.role===`string`?i.role:`missing`;throw new SqliteSchemaMismatchError(`OpenClaw state database ${t.pathname} has schema role ${e}; expected global. Run openclaw doctor --fix to inspect and repair its ownership.`)}return i}function assertOpenClawStateDatabaseForMaintenance(e,t,n){if(isPostgresSqlConnection(e))requireNativeDatabaseFile(`postgres`,`repair`);const r=assertSupportedStateSchemaVersion(e,t.pathname,t.schemaVersions);if((t.schemaVersions?.contentVersion??readStateSchemaContentVersion(e))!==40)throw new SqliteSchemaMismatchError(`OpenClaw state database ${t.pathname} uses schema version ${r}; run openclaw doctor --fix before compacting it.`);const i=assertOpenClawStateDatabaseOwner(e,t);if(i?.schema_version!==r&&!adoptPeerPublishedStateSchemaVersion(e,i)){const e=typeof i?.schema_version===`number`?i.schema_version:`invalid`;throw new SqliteSchemaMismatchError(`OpenClaw state database ${t.pathname} metadata schema version ${e} does not match ${r}; run openclaw doctor --fix before compacting it.`)}assertSqliteSchemaContains(e,t.pathname,OPENCLAW_STATE_SCHEMA_SQL,OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY,n)}function assertOpenClawStateDatabaseVersionForMigration(e,t){const n=readSqliteUserVersion(e);if(readStateSchemaContentVersion(e)!==t.version)throw new SqliteSchemaMismatchError(`OpenClaw state database ${t.pathname} uses schema version ${n}; expected ${t.version} before migrating it.`);const r=assertOpenClawStateDatabaseOwner(e,t);if(r?.schema_version!==n){const e=typeof r?.schema_version===`number`?r.schema_version:`invalid`;throw new SqliteSchemaMismatchError(`OpenClaw state database ${t.pathname} metadata schema version ${e} does not match ${n}; repair the ownership metadata before migrating it.`)}assertSqliteSchemaTablesPresent(e,t.pathname,getOpenClawStatePredecessorSchema(t.version),{allowedMissingTables:[...t.version===5?STATE_V5_ADDITIVE_TABLES:t.version<13?STATE_V6_ADDITIVE_TABLES:LAZY_ADDITIVE_STATE_TABLES,...DOCTOR_OWNED_STATE_TABLES]})}const openClawStateMigrationAssertions=new Map(STATE_MIGRATION_VERSIONS.map(e=>[e,(t,n)=>assertOpenClawStateDatabaseVersionForMigration(t,{...n,version:e})]));function markCurrentStateSchemaVersion(e,t={}){if(!tableExists(e,`audit_events`))return;const n=resolveStateSchemaVersionToPublish(e);if(readSqliteUserVersion(e)!==n)e.exec(`PRAGMA user_version = ${n};`);publishStateSchemaVersionAdmission(e,{userVersion:n,contentVersion:40});if(tableExists(e,`schema_meta`)&&[`meta_key`,`schema_version`,`updated_at`].every(t=>tableHasColumn(e,`schema_meta`,t))){const r=Date.now();if(t.createMetadataIfMissing){e.prepare(`INSERT INTO schema_meta (
           meta_key, role, schema_version, agent_id, app_version, created_at, updated_at
         ) VALUES ('primary', 'global', ?, NULL, NULL, ?, ?)
         ON CONFLICT(meta_key) DO UPDATE SET
           schema_version = excluded.schema_version,
           updated_at = excluded.updated_at
         WHERE schema_meta.schema_version IS NOT excluded.schema_version`).run(n,r,r);return}e.prepare(`UPDATE schema_meta SET schema_version = ?, updated_at = ? WHERE meta_key = 'primary' AND schema_version IS NOT ?`).run(n,r,n)}}function migrateCronCreatorNamespaces(e,t){if(t>=14||!tableExists(e,`cron_jobs`))return false;e.exec(`
    UPDATE cron_jobs
       SET job_json = json_set(job_json, '$.createdActor.source', 'unknown')
     WHERE json_valid(job_json)
       AND json_extract(job_json, '$.createdActor.type') = 'human';
  `);return true}function migrateConversationBindingTargets(e,t){if(t>=15)return false;const n=[`target_agent_id`,`target_session_id`].filter(t=>tableHasColumn(e,`current_conversation_bindings`,t));if(n.length===0)return false;e.exec(`DROP INDEX IF EXISTS idx_current_conversation_bindings_target;`);for(const t of n)e.exec(`ALTER TABLE current_conversation_bindings DROP COLUMN ${t};`);return true}function migratePreparedWorkerOwnership(e,t){if(t>=17||!tableExists(e,`worker_environments`))return false;const n=OPENCLAW_STATE_SCHEMA_SQL.indexOf(`CREATE TABLE IF NOT EXISTS worker_environments (`);const r=OPENCLAW_STATE_SCHEMA_SQL.indexOf(`
) STRICT;`,n);if(n<0||r<n)throw new Error(`OpenClaw worker environment schema marker is missing.`);const i=splitSqlList(OPENCLAW_STATE_SCHEMA_SQL.slice(n+48,r)).map(e=>e.trim()).filter(e=>e.startsWith(`last_activated_at_ms `)||e.startsWith(`preparation_`));let a=false;for(const t of i)a=ensureColumn(e,`worker_environments`,t)||a;return a}function migrateGitHubPublicationRequesterAuthority(e,t){if(t>=18)return false;let n=false;for(const t of[`github_publication_session_lifecycles`,`github_repository_publication_requests`])n=ensureColumn(e,t,`requester_authority_json TEXT`)||n;return n}const statePortableIdentityMigration={version:22,tables:[`acp_sessions`,...STATE_CURSOR_TABLES_V22],columns:[`acp_sessions.resume_agent_session_id`,`acp_sessions.resume_acpx_session_id`,...STATE_CURSOR_TABLES_V22.map(e=>`${e}.cursor_id`)],migrate:migratePortableIdentityColumnsV22,applied:`Promoted portable ACP resume keys and cursor identities (v22)`};const stateMeetingChronologyMigration={version:23,tables:[`meeting_transcript_sessions`],columns:[`meeting_transcript_sessions.started_at_ms`],migrate:migrateMeetingTranscriptStartTime,applied:`Persisted normalized meeting transcript start times`};const stateTaskIndexMigration={version:24,tables:[`task_runs`],columns:[],migrate:migrateTaskRunIndexesV24,applied:`Replaced retained task indexes with ordered cron history indexes (v24)`};const stateSubagentOperatorRecoveryMigration={version:25,tables:[],columns:[],migrate:()=>false,applied:`Required original operator authority for subagent recovery (v25)`};const stateHeadLayoutMigration={version:26,tables:[`session_state_heads`],columns:[],migrate:migrateSessionStateHeadLayoutV26,applied:`Stored session state heads in their composite primary-key tree (v26)`};const stateWriteIndexMigration={version:27,tables:[`acp_replay_events`,`skill_usage`,`state_leases`],columns:[],migrate:migrateStateWriteIndexesV27,applied:`Removed redundant replay and skill indexes and narrowed the lease-owner index (v27)`};const stateClientCredentialMigration={version:29,tables:CLIENT_CREDENTIAL_SOURCE_TABLES,columns:[],migrate:()=>false,applied:`Moved client credentials and native socket material to the local owner (v29)`};const stateAutomationPolicyMigration={version:30,tables:[],columns:[],migrate:()=>false,applied:`Fenced ordinary automation timing and delivery policies from older schedulers (v30)`};const versionedStateMigrations=[statePortableIdentityMigration,stateMeetingChronologyMigration,{migrate:migrateJsonCanonicalWideRowsV13,applied:`Consolidated shared state tables (v13)`},{migrate:migrateCronCreatorNamespaces,applied:`Qualified historical cron creator attribution as unknown (v14)`},{migrate:migrateConversationBindingTargets,applied:`Removed redundant conversation binding target projections (v15)`},{migrate:migratePreparedWorkerOwnership,applied:`Recorded prepared worker ownership and one-use lifecycle (v17)`},{migrate:migrateGitHubPublicationRequesterAuthority,applied:`Added original requester authority to GitHub publication receipts (v18)`},{migrate:migrateCronDeliveryAttemptState,applied:`Recorded cron completion delivery attempt uncertainty (v20)`},stateTaskIndexMigration,stateHeadLayoutMigration,stateWriteIndexMigration,statePublicationDraftMigration,stateLocalWorkspaceManifestMigration,stateCronIdentityMigration,stateLocalWorkspaceCasMigration,stateTemplateNamesMigration,...stateWorkerDiskMigrations,stateWorkerRetentionMigration,stateWorkerProvisionSourceMigration];function migrateBoundedStateSchema(e,t,n){const r=[statePredicateColumnMigration,statePortableIdentityMigration,stateMeetingChronologyMigration,stateTaskIndexMigration,stateSubagentOperatorRecoveryMigration,stateHeadLayoutMigration,stateWriteIndexMigration,statePublicationDraftMigration,stateClientCredentialMigration,stateAutomationPolicyMigration,stateLocalWorkspaceManifestMigration,...stateIndexOrderingMigrations,stateCronIdentityMigration,stateLocalWorkspaceCasMigration,stateTemplateNamesMigration,...stateWorkerDiskMigrations,stateWorkerRetentionMigration,stateWorkerProvisionSourceMigration].filter(({version:e})=>e>t);if(t>=40||r.length!==40-t)return;const i=new Set(r.flatMap(e=>e.tables));const a=getCanonicalSqliteNamedIndexContracts(OPENCLAW_STATE_SCHEMA_SQL).filter(e=>i.has(e.tableName));const o=getOpenClawStatePredecessorSchema(t);if(!n.versionMigrationOnly&&(tableExists(e,`cron_run_logs`)||!r.includes(statePublicationDraftMigration)&&needsPublicationDraftMigration(e)||findMissingLazyStateStartupColumn(createSqliteTableContractReader(e))!==void 0||collectSqliteSchemaIssues(e,o,{...withLegacyTemplateStateCompatibility(STATE_RUNTIME_SCHEMA_COMPATIBILITY),allowedMissingColumns:[...STATE_RUNTIME_SCHEMA_COMPATIBILITY.allowedMissingColumns??[],...r.flatMap(e=>e.columns)].map(withLegacyTemplateStateSchema),allowedMissingIndexes:[...STATE_RUNTIME_SCHEMA_COMPATIBILITY.allowedMissingIndexes??[],...a.map(e=>e.name),`idx_acp_replay_events_session_seq`,`idx_skill_usage_key`],excludedIndexes:[...STATE_RUNTIME_SCHEMA_COMPATIBILITY.excludedIndexes??[],`idx_acp_sessions_resume_agent`,`idx_acp_sessions_resume_acpx`]}).length>0))return;const s=migrateHistoricalStateImports(e,t);for(const i of r){i.migrate(e,t,n);s.push(i.applied)}for(const t of a)if(tableExists(e,t.tableName)){const n=t.unique?`CREATE UNIQUE INDEX`:`CREATE INDEX`;e.exec(`${n} IF NOT EXISTS ${t.name} ${t.definition};`)}return s}function runStateSchemaMigrationTransaction(e,t,n,r,i){return runUpdateSqliteMigration(e,t,()=>{const a=Number(e.prepare(`PRAGMA foreign_keys`).get()?.foreign_keys)===1;if(a)e.exec(`PRAGMA foreign_keys = OFF;`);try{return runSqliteImmediateTransactionSync(e,()=>{i?.();const r=readSqliteUserVersion(e);const a=r<40?readStateSchemaPublicationBlocker(e):void 0;if(!a)return n();try{if(!tableExists(e,`config_machine_state`))throw new Error(`Shared state schema publication requires config_machine_state.`);return n()}catch(e){if(e instanceof OpenClawStateOwnershipError)throw e;throw new UpdateSchemaRefusalError([{kind:`state`,path:t,foundVersion:r,supportedVersion:40}],a.updaterVersion,{targetVersion:VERSION,cause:e})}},r)}finally{if(a&&e.isOpen)e.exec(`PRAGMA foreign_keys = ON;`)}})}function writeCurrentStateSchemaMetadata(e,t){const n=getNodeSqliteKysely(e);const r=resolveStateSchemaVersionToPublish(e);if(readSqliteUserVersion(e)!==r)e.exec(`PRAGMA user_version = ${r};`);publishStateSchemaVersionAdmission(e,{userVersion:r,contentVersion:40});executeSqliteQuerySync(e,n.insertInto(`schema_meta`).values({meta_key:`primary`,role:`global`,schema_version:r,agent_id:null,app_version:VERSION,created_at:t,updated_at:t}).onConflict(e=>e.column(`meta_key`).doUpdateSet({role:`global`,schema_version:r,agent_id:null,app_version:VERSION,updated_at:t}).where(e=>e.or([e(`schema_meta.schema_version`,`!=`,r),e(`schema_meta.app_version`,`is not`,VERSION),e(`schema_meta.role`,`!=`,`global`)]))))}function executeCanonicalStateSchema(e,t){e.exec(getOpenClawStateRuntimeSchema({...t,includeAgentDeletionJournal:t.includeAgentDeletionJournal??tableExists(e,`agent_deletion_journal`)}))}
//!src/state/openclaw-state-db-fast-path.ts
function assertCurrentStateRuntimeSchema(e,t,n=createSqliteTableContractReader(e)){const r=findMissingLazyStateStartupColumn(n);if(r)throwSqliteSchemaMismatches(t,[`missing column `+r.tableName+`.`+r.columnName]);assertCanonicalStateSchemaShape(e,t);assertOpenClawStateDatabaseForMaintenance(e,{pathname:t},n);assertSqliteSchemaContains(e,t,OPENCLAW_STATE_SCHEMA_SQL,STATE_RUNTIME_SCHEMA_COMPATIBILITY,n)}function assertNoLegacyStateRuntimeRepair(e,t){if(hasLegacyCronRunLogs(e))throw new OpenClawStateDatabaseSchemaMigrationRequiredError(`legacy-cron-run-logs`,t)}function isOpenClawStateSchemaFastPathEligible(e,t,n){const r=getStateRuntimeSchemaAdmission(e);if(r)return r.startupReady;let i;const a=withSqlitePostCommitPublications(e,()=>runSqliteDeferredTransactionSync(e,()=>{const r=assertSupportedStateSchemaVersion(e,t);if(readStateSchemaContentVersion(e)!==40)return false;const a=readSqliteSchemaCookie(e);if(typeof a!==`number`)throw new Error(`Shared-state database ${t} schema version is unavailable.`);assertCurrentStateRuntimeSchema(e,t,createSqliteTableContractReader(e));assertNoLegacyStateRuntimeRepair(e,t);const o=readGatewayOwnerLeaseFromDatabase(e);if(!(o?.state===`live`&&o.pid!==process.pid&&Boolean(o.stateDatabaseProvenance)&&o.stateDatabaseProvenance===readAgentDatabaseLeaseProvenance(t)))i=assertOpenClawStateRuntimeIntegrity(e,t,{schemaVersion:a,userVersion:r},n);return true},{operationLabel:`state.admission.fast-path`}));i?.();if(a)publishStateRuntimeSchemaAdmission(e,true);return a}
//!src/state/openclaw-state-db-existing-schema.ts
function assertExistingOpenClawStateRuntimeMetadata(e,t,n){if(getStateRuntimeSchemaAdmission(e)){const t=getStateSchemaVersionAdmission(e)?.userVersion;if(t!==void 0)return t}const r=assertSupportedStateSchemaVersion(e,t,void 0,void 0,n);if(readStateSchemaContentVersion(e)!==40)throw new Error(`Existing shared-state database ${t} requires schema migration by its owning installation; run openclaw doctor --fix there before using it.`);let i;try{i=executeSqliteQueryTakeFirstSync(e,getNodeSqliteKysely(e).selectFrom(`schema_meta`).select([`role`,`schema_version`]).where(`meta_key`,`=`,`primary`).limit(1))}catch(t){throw classifySqliteTableReadError(e,`schema_meta`,[`meta_key`,`role`,`schema_version`],t)}if(i?.role!==`global`||i.schema_version!==r)throw new Error(`Existing shared-state database ${t} has inconsistent ownership or schema metadata.`);return r}function assertExistingOpenClawStateRuntimeSchema(e,t,n,r,i=`runtime`){const a=getStateRuntimeSchemaAdmission(e)?getAdmittedSqliteSchemaFacts(e):void 0;if(a){assertOpenClawStateRuntimeIntegrity(e,t,a,n,r)?.();return}let o;runSqliteReadSnapshotSync(e,()=>{const a=assertExistingOpenClawStateRuntimeMetadata(e,t,i);const s=readSqliteSchemaCookie(e);if(typeof s!==`number`)throw new Error(`Existing shared-state database ${t} schema version is unavailable.`);o=assertOpenClawStateRuntimeIntegrity(e,t,{schemaVersion:s,userVersion:a},n,r);const c=createSqliteTableContractReader(e);assertCurrentStateRuntimeSchema(e,t,c);assertNoLegacyStateRuntimeRepair(e,t)},{operationLabel:`state.admission.existing-schema`});o?.();publishStateRuntimeSchemaAdmission(e,true)}function assertStateDatabaseSchemaAdmission(e){if(isExistingOpenClawStateSchema(e.path,e.db)){const t=readTrackedStateDatabaseIdentity(e.db)?.canonicalPath;if(!t)throw new Error(`Existing shared-state schema admission requires a filesystem-backed database.`);if(!isExistingOpenClawStateSchema(t,e.db))throw new Error(`Existing shared-state schema admission requires its selected physical database.`);if(isPostgresSqlConnection(e.db)){assertSupportedStateSchemaVersion(e.db,e.path);return}assertExistingOpenClawStateRuntimeSchema(e.db,e.path)}}
//!src/state/openclaw-state-db-read-schema.ts
function assertStateReadSchemaForPolicy(e,t,n,r,i,a=`runtime`){if(isPostgresSqlConnection(e)){if(r!==void 0)requireNativeDatabaseFile(`postgres`,`integrity`);assertSupportedStateSchemaVersion(e,t,void 0,i,a);return}if(n)assertExistingOpenClawStateRuntimeSchema(e,t,getSqliteWorkerStateIntegrityAdmission(),r,a);else assertSupportedStateSchemaVersion(e,t,void 0,i,a)}
//!src/state/openclaw-state-postgres-snapshot-context.ts
const postgresStateReadSnapshot=resolveGlobalSingleton(Symbol.for(`openclaw.postgresStateReadSnapshot`),()=>new AsyncLocalStorage);
//!src/state/openclaw-state-db-read-connection.ts
const retainedReaders=/* @__PURE__ */ new Map;const corruptedReaders=/* @__PURE__ */ new WeakSet;let unregisterExitClose;function retireReader(e){if(retainedReaders.get(e.identity.key)!==e)return;clearTimeout(e.idleTimer);e.idleTimer=void 0;e.retiring=true;e.connection.close();e.quarantineAdmission?.release();retainedReaders.delete(e.identity.key);if(!retainedReaders.size){unregisterExitClose?.();unregisterExitClose=void 0}}function scheduleReaderRetirement(e){if(!getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources||retainedReaders.get(e.identity.key)!==e)return;e.idleTimer??=runInDetachedAsyncContext(()=>setTimeout(()=>{try{retireReader(e)}catch(t){process.emitWarning(`Idle shared-state reader cleanup failed: ${String(t)}`);scheduleReaderRetirement(e)}},SQLITE_IDLE_HANDLE_TTL_MS).unref());e.idleTimer.refresh()}function closeRetainedOpenClawStateReadConnections(e){const t=[];for(const n of retainedReaders.values())if(e===void 0||n.identity.key===e)try{retireReader(n)}catch(e){t.push(e)}throwSqliteLifecycleErrors(t,`Retained shared-state reader cleanup failed.`)}function borrowStateReadConnection(e,t,n){if(isStatePostgres())return openStateReadConnectionResult(e,e,t,void 0,true);isExistingOpenClawStateSchema(e);const r=readDatabasePathIdentitySync(e);if(t!==void 0)assertExistingDatabaseIdentity(e,t);for(const e of retainedReaders.values())if(e.identity.canonicalPath===r.canonicalPath&&e.identity.key!==r.key)retireReader(e);if(!r.key.startsWith(`file:`))return openStateReadConnectionResult(e,e,t);let i=retainedReaders.get(r.key);if(i?.retiring||i&&!i.connection.database.db.isOpen){retireReader(i);i=void 0}if(i?.borrowed)return openStateReadConnectionResult(e,e,r.key);if(!i){const t=openStateReadConnectionResult(e,e,r.key);if(t.status===`unavailable`)return t;i={connection:t.value,identity:r,retiring:false,borrowed:false};retainedReaders.set(r.key,i);unregisterExitClose??=registerProcessExitCleanup(closeRetainedOpenClawStateReadConnections)}const a=i;if(a.quarantineAdmission?.location!==n||!a.quarantineAdmission?.isCurrent()){a.quarantineAdmission?.release();a.quarantineAdmission=void 0;try{a.quarantineAdmission=n?retainSqliteDatabaseAdmissionForPath(n):void 0}catch{}}observeOpenClawDatabaseMaintenanceResource(a);a.borrowed=true;return{status:`available`,value:{database:{db:a.connection.database.db,path:e},close(e){a.borrowed=false;if(e&&a.connection.database.db.isOpen&&!a.connection.database.db.isTransaction)scheduleReaderRetirement(a);else retireReader(a);return true}}}}var SnapshotCleanupIncompleteError=class extends Error{};function assertStateReadSchema(e,t,n,r=`runtime`){assertStateReadSchemaForPolicy(e,t,isExistingOpenClawStateSchema(t,e),n,void 0,r)}function withOpenClawStateReadOnlyLocation(e,t,n,r,i,a,o=false,s,c){const l=readOpenClawStateReadOnlyLocation(e,t,n,r,i,a,o,s,c);if(l.status===`unavailable`)throw l.error;return l.value}function readOpenClawStateReadOnlyLocation(e,t,n,r,i,a,o=false,s,c){const l=typeof n!==`string`&&`connection`in n?n.connection:void 0;const u=typeof n!==`string`&&`connection`in n?n.location:n;const d=l?{status:`available`,value:l}:o&&u===t&&!a?borrowStateReadConnection(t,i,c):openStateReadConnectionResult(t,u,i,a,true);if(d.status===`unavailable`)return d;const f=d.value;const p=[];let m;let h;try{if(r&&!isPostgresSqlConnection(f.database.db))m=r(f.database.db);const n=isExistingOpenClawStateSchema(t,f.database.db);const i=r?`doctor-maintenance`:`runtime`;try{let r=false;const a=postgresStateReadSnapshot.getStore();const read=()=>runSqliteReadOperationSync(f.database.db,()=>{admitStateSchemaFacts(f.database.db,t,i);assertStateReadSchemaForPolicy(f.database.db,t,n,void 0,s,i);r=true;const a=e(f.database);if(u===t&&isPromiseLike(a))throw new SqliteCoordinatorError(`SQLite source read must remain synchronous`);return a});const readTransaction=()=>isPostgresSqlConnection(f.database.db)?f.database.db.runTransaction(()=>{if(a?.path===t)f.database.db.exec(`SET TRANSACTION SNAPSHOT '${a.snapshot.replaceAll(`'`,`''`)}'`);return read()},void 0,true):l&&u===t?runSqliteReadSnapshotSync(f.database.db,read):read();h={status:`available`,value:withPostgresSchemaAdmissionRetry(f.database.db,readTransaction,()=>!r&&a?.path!==t)}}catch(e){if(!isPostgresSqlConnection(f.database.db)&&isSqliteCorruptionError(e)){invalidateOpenClawStateRuntimeIntegrity(f.database.db);corruptedReaders.add(f.database.db)}h={status:`unavailable`,error:e}}assertTransactionUsable(f.database.db)}catch(e){p.push(e)}try{m?.()}catch(e){p.push(e)}try{const e=typeof n!==`string`&&p.length===0&&h?.status===`available`&&!getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources;if(!l&&!f.close(p.length===0&&h?.status===`available`&&!corruptedReaders.has(f.database.db))&&!e)throw new SnapshotCleanupIncompleteError(`Shared-state snapshot cleanup is incomplete.`)}catch(e){p.push(e)}if(p.length){if(h?.status===`unavailable`&&!p.includes(h.error))p.unshift(h.error);throwSqliteLifecycleErrors(p,`Shared-state read and reader cleanup failed.`)}return h}function openOpenClawStateReadOnlyLocation(e,t){const n=openOpenClawStateReadConnection(e,t);try{runSqliteReadOperationSync(n.database.db,()=>{admitStateSchemaFacts(n.database.db,e);assertStateReadSchema(n.database.db,e)})}catch(e){try{n.close()}catch(t){throwSqliteLifecycleErrors([e,t],`Shared-state reader admission and cleanup failed.`)}throw e}return n}function openOpenClawStateReadConnection(e,t,n,r){const i=openStateReadConnectionResult(e,t,n,r);if(i.status===`unavailable`)throw i.error;return i.value}function openStateReadConnectionResult(e,t,n,r,i=false){const a=typeof t===`string`?void 0:t;const o=typeof t===`string`?t:t.location;const s=resolveSqliteDatabaseFilePath(o);const c={readOnly:true,timeout:OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};let l;const cleanupFailedOpen=e=>{const t=[e];try{l?.()}catch(e){t.push(e)}try{if(a&&!a.cleanup())t.push(new SnapshotCleanupIncompleteError(`Shared-state snapshot cleanup is incomplete.`))}catch(e){t.push(e)}if(t.length>1)throw createSqliteLifecycleAggregateError(t,`Shared-state reader open and cleanup failed.`,e)};let u;try{if(isStatePostgres()){if(t!==e||r)assertStateFileSnapshotAllowed();if(i)isExistingOpenClawStateSchema(e);const a=openExistingStatePostgresConnection(e,n);if(a)return{status:`available`,value:a}}if(n!==void 0)assertExistingDatabaseIdentity(s,n);l=r?acquireSqliteSnapshotReadToken(r):void 0;if(i)isExistingOpenClawStateSchema(e);if(o===e)u=openTrackedStateDatabaseResult(e,c);else try{u={status:`available`,database:openNodeSqliteDatabase(o,c)}}catch(e){u={status:`unavailable`,error:e}}}catch(e){cleanupFailedOpen(e);throw e}if(u.status===`unavailable`){cleanupFailedOpen(u.error);return u}const d=u.database;let f=false;let p=false;let m=0;const h={db:d,path:e,afterClose:()=>{l?.();if(a&&m===0&&!a.cleanup())throw new SnapshotCleanupIncompleteError(`Shared-state snapshot cleanup is incomplete.`)}};const g={database:{db:d,path:e},snapshotSource:a?{retain(){if(p||f)throw new Error(`Shared-state snapshot source is closing or closed`);const e=retainSnapshotTempDirectory(a.cleanupRoot??path.dirname(a.location));m++;let t=false;return{location:a.location,cleanupRoot:a.cleanupRoot,async release(){if(!t){t=true;e();m--}if(f&&m===0&&!await a.cleanupAsync())throw new SnapshotCleanupIncompleteError(`Shared-state snapshot cleanup is incomplete.`)}}}}:void 0,close(){if(f)return false;p=true;const e=openClawStateDatabaseCache.closeOpenClawStateDatabaseHandle(h);if(e.length===1&&e[0]instanceof SnapshotCleanupIncompleteError)return false;throwSqliteLifecycleErrors(e,`Shared-state reader cleanup failed.`);f=true;return true}};try{enableNodeSqliteKyselyStatementCache(d);if(n!==void 0)assertExistingDatabaseIdentity(s,n)}catch(e){try{if(!g.close())throw new SnapshotCleanupIncompleteError(`Shared-state snapshot cleanup is incomplete.`)}catch(t){throw createSqliteLifecycleAggregateError([e,t],`Shared-state reader identity and cleanup failed.`,e)}throw e}return{status:`available`,value:g}}function readOnlyStateDatabase(e,t){return{...e,walMaintenance:{checkpoint:()=>false,stop:async()=>{},reclaimFreePages:createSqliteWalReclamationResult,close:t}}}
//!src/state/openclaw-state-db-transaction.ts
const managedStateTransactions=resolveGlobalSingleton(Symbol.for(`openclaw.managedStateTransactions`),()=>/* @__PURE__ */ new WeakSet);function isManagedStateTransaction(e){return e.isTransaction&&managedStateTransactions.has(e)}function runManagedStateTransaction(e,t,n){if(e.isTransaction&&!managedStateTransactions.has(e))throw new Error(`Cannot join an unmanaged shared-state transaction; enter through runOpenClawStateWriteTransaction before BEGIN.`);const transaction=()=>withSqlitePostCommitPublications(e,()=>{const r=!e.isTransaction;if(r)managedStateTransactions.add(e);try{return n.singleStatement?runSqliteSingleStatementSync(e,t):runSqliteImmediateTransactionSync(e,t,n)}finally{if(r)managedStateTransactions.delete(e)}});return n.busyTimeoutMs===void 0||isPostgresSqlConnection(e)?transaction():runWithSqliteBusyTimeout(e,n.busyTimeoutMs,transaction)}
//!src/state/openclaw-state-db-readonly-reuse.ts
const maintenanceReaders=/* @__PURE__ */ new WeakMap;function withMaintenanceOpenClawStateDatabaseReadOnly(e,t){const n=getOpenClawDatabaseMaintenanceScope();if(!n||!allowsMaintenanceLiveAuthorityReads(n,t))return{reused:false};n.assertReadAdmission();let r=maintenanceReaders.get(n);if(!r){r=/* @__PURE__ */ new Map;maintenanceReaders.set(n,r)}let i=r.get(t);if(!i){const e=captureOpenClawStateDatabaseReadAdmission(t);assertExistingDatabaseIdentity(t,e.identity.key,e.identity.birthtime);const a=openOpenClawStateReadOnlyLocation(t,t);let o=false;const close=()=>{if(o)return;if(!a.close())throw new Error(`Maintenance authority reader cleanup is incomplete`);o=true;r.delete(t);s()};const s=registerOpenClawStatePathAsyncResource(e,async()=>{close()});n.own(a,`shared-handles`,close);i={read(n){e.assertCurrent();assertExistingDatabaseIdentity(t,e.identity.key,e.identity.birthtime);const r=runSqliteReadOperationSync(a.database.db,()=>{assertStateReadSchema(a.database.db,t);return n(a.database)});if(isPromiseLike(r))throw new SqliteCoordinatorError(`SQLite maintenance authority read must remain synchronous`);return r}};r.set(t,i)}return{reused:true,value:i.read(e)}}function withCachedOpenClawStateDatabaseReadOnly(e,t,n){return openClawStateDatabaseCache.withCachedOpenClawStateDatabase(t,{readOnly:true},r=>{if(!r.db.isOpen)return{reused:false};const i=n&&isManagedStateTransaction(r.db);if(r.db.isTransaction&&!i)return{reused:false};try{assertStateReadSchema(r.db,t);observeOpenClawDatabaseMaintenanceResource(r.db);const n=e(r);if(i&&isPromiseLike(n))throw new SqliteCoordinatorError(`SQLite current-authority read must remain synchronous`);return{reused:true,value:n}}catch(e){openClawStateDatabaseCache.evictOpenClawStateDatabaseAfterCorruption(r,e);throw e}})??{reused:false}}function canReadWarmNativeSourceIndependently(e,t,n){const r=requireOpenClawStateDatabaseIdentity(e);if(r.key!==n)return false;try{assertExistingDatabaseIdentity(t,r.key);return true}catch{return false}}
//!src/infra/update-run-admission.types.ts
function isUpdateRunAdmissionReadCommand(e){return e.type===`updateRuns.recoveryAdmission`||e.type===`updateRuns.reconciliationCandidates`||e.type===`updateRuns.reconciliationCandidate`}
//!src/state/openclaw-state-read-pool.ts
function stateReadPools(e){return[e.pool,e.awaitedPool].filter(e=>e!==void 0)}function createStateReadPool(e,t){ensureSqliteLibrarySelected();return createOwnedWorkerTaskPool({workerUrl:e,workerOptions:{resourceLimits:{maxOldGenerationSizeMb:512}},maxWorkers:resolveStateReadWorkerCount(),idleTimeoutMs:SQLITE_IDLE_HANDLE_TTL_MS,burstIdleTimeoutMs:3e4,maxPendingTasks:128,maxPendingBytes:DEFAULT_WORKER_PENDING_BYTES},t?{retainedTransport:true,nativeSource:t,databaseAccess:`read-only`}:{databaseAccess:`read-only`})}function closeReadResources(e,t){return getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources?e.closeResources(t):e.rotate()}
//!src/state/openclaw-state-read-request.ts
const jsonEscapes=/["\\\u0000-\u001f\ud800-\udfff]/u;function quotedStringBytes(e){let t=Buffer.byteLength(e,`utf8`)+2;if(!jsonEscapes.test(e))return t;for(let n=0;n<e.length;n++){const r=e.codePointAt(n);if(r<32)t+=r===8||r===9||r===10||r===12||r===13?1:5;else if(r===34||r===92)t++;else if(r>=55296&&r<=57343)t+=3;else if(r>65535)n++}return t}function commandBytes(e,t=false){if(typeof e===`string`)return t?Buffer.byteLength(e,`utf8`):quotedStringBytes(e);if(typeof e===`number`||typeof e===`bigint`)return 8;if(typeof e===`boolean`)return 1;if(e===null||e===void 0)return 0;if(Array.isArray(e))return e.reduce((e,n)=>e+(t?0:8)+commandBytes(n,t),0);let n=0;const r=e;for(const e in r)if(Object.hasOwn(r,e))n+=Buffer.byteLength(e,`utf8`)+(t?0:8)+commandBytes(r[e],t);return n}function requestBytes(e){return commandBytes(e.command)+commandBytes(e.context.databaseEngineSelection)+commandBytes(e.context.environment,true)+commandBytes([e.context.existingSchemaPath,e.databasePath,e.location,e.expectedIdentity,e.snapshotRoot,e.postgresSnapshot],true)}
//!src/state/openclaw-state-read-worker.ts
function decodeOpenClawStateReadReply(e){if(e.ok)return{value:e};const t=new Error(e.message);retainOpenClawStateWorkerErrorPayload(t,e.error);return{error:hydrateOpenClawStateWorkerError(t,{includeOrdinary:true}),sourceAdmitted:e.sourceAdmitted===true}}async function closeReadPool(e){if(e.closing)return await e.closing;const t=stateReadPools(e);if(!t.length)return;const n=(async()=>{const n=await Promise.allSettled(t.map(async e=>{await closeReadResources(e);await e.close()}));throwSqliteLifecycleErrors(n.flatMap(e=>e.status===`rejected`?[e.reason]:[]),`Shared-state reader pools cleanup failed`);e.pool=void 0;e.awaitedPool=void 0})();e.closing=n;try{await n}finally{e.closing=void 0}}function readRuntimes(){return resolveGlobalSingleton(Symbol.for(`openclaw.stateReadWorkers`),()=>{const e=/* @__PURE__ */ new Map;registerOpenClawStateDatabaseAsyncResource({phase:`after-resources`,async close(t){const n=await Promise.allSettled([...e.values()].map(async e=>{if(t){const n=await Promise.allSettled(stateReadPools(e).map(e=>closeReadResources(e,t.key)));throwSqliteLifecycleErrors(n.flatMap(e=>e.status===`rejected`?[e.reason]:[]),`Shared-state reader resources cleanup failed`)}else await closeReadPool(e)}));throwSqliteLifecycleErrors(n.flatMap(e=>e.status===`rejected`?[e.reason]:[]),`Shared-state reader source cleanup failed`)}});registerOpenClawStateDatabaseLifecycleListener(t=>{if(t.kind!==`opened`&&t.identity){const n=t.identity;for(const t of e.values())Promise.allSettled(stateReadPools(t).map(e=>closeReadResources(e,n.key))).then(e=>throwSqliteLifecycleErrors(e.flatMap(e=>e.status===`rejected`?[e.reason]:[]),`Shared-state reader invalidation failed`)).catch(e=>{process.emitWarning(`Shared-state reader invalidation failed: ${String(e)}`)})}});return e})}function readPool(e,t,n){if(e.sealed&&!t||e.closing)throw new WorkerTaskError(`Shared-state readers are closing`,`unavailable`);const r=!n||e.pool!==void 0||getDatabaseProcessRole()===`gateway`;const i=r?`pool`:`awaitedPool`;if(!e[i])e[i]=createStateReadPool(e.workerUrl,r?e.nativeSource:void 0);return{pool:e[i],retained:r}}function captureOpenClawStateReadSource(){const e=captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl(`stateRead`));const t=captureRetainedNativeWorkerSource({runtimeGeneration:e.runtimeGeneration});const n=readRuntimes();let r=n.get(t);if(!r){const i={nativeSource:t,workerUrl:e.moduleUrl,operations:/* @__PURE__ */ new Set,sealed:false};t.retain(i,()=>{i.sealed=true;if(!i.stopping)i.stopping=Promise.resolve().then(async()=>{const e=await Promise.allSettled([...i.operations].map(e=>Promise.resolve().then(()=>e.close())));throwSqliteLifecycleErrors(e.flatMap(e=>e.status===`rejected`?[e.reason]:[]),`Shared-state reader source cleanup failed`);await closeReadPool(i);n.delete(t)}).finally(()=>{i.stopping=void 0});return i.stopping});n.set(t,i);r=i}return new StateReadSource(r)}var StateReadSource=class{constructor(e){this.state=e;this.admitted=/* @__PURE__ */ new Set}createTransport(e,t,n,r=false){return new StateReadTransport(e,this,t,n,r)}ownsAdmission(){return this.admitted.size>0}own(e){const{state:t,admitted:n}=this;if(t.sealed||t.closing)throw new WorkerTaskError(`Shared-state readers are closing`,`unavailable`);const r=AsyncLocalStorage.snapshot();const i={close:()=>r(e)};t.operations.add(i);n.add(i);return()=>{t.operations.delete(i);n.delete(i)}}};var StateReadTransport=class{constructor(e,t,n,r,i=false){this.source=t;this.onChunk=n;this.onChunkAsync=r;this.awaitedOnly=i;this.tasks=/* @__PURE__ */ new Map;this.closed=false;this.pendingChunks=0;this.capturedCommand=isDeeplyFrozenPlainData(e)?e:structuredClone(e)}async closeTask(e){await e.close(this.tasks.get(e)?.retire?{retire:true}:void 0);this.tasks.delete(e)}startRun(e,t,n,r,i,a,o,s){const{onChunk:c,onChunkAsync:l}=this;let u;const d={retire:true};try{if(this.closed)throw new WorkerTaskError(`Shared-state read transport is closed`,`unavailable`);if(e.databaseEngineSelection&&Object.values(e.databaseEngineSelection.effectiveEngines).includes(`postgres`))getPostgresPool();const f={context:{databaseEngineSelection:e.databaseEngineSelection,environment:{...e.environment},existingSchemaPath:e.existingSchemaPath,stateIntegrity:e.stateIntegrity,liveStateReads:e.liveStateReads},databasePath:e.admission.databasePath,location:t,checkFreshAdmission:n,expectedIdentity:a,snapshotRoot:o,postgresSnapshot:s,command:r};const p=readPool(this.source.state,this.source.ownsAdmission(),this.awaitedOnly);if(getDatabaseProcessRole()===`gateway`&&!getPluginExecutionFrame()?.canUseInteractiveStateReadCapacity){const{pendingTasks:e,maxWorkers:t}=p.pool.getSnapshot();if(e>=128-2*t)throw new WorkerTaskError(`worker task capacity reached (shared-state interactive reserve)`,`overloaded`)}const m=!p.retained&&!e.maintenanceScope&&r.type!==`admit`;const h=isStartupConfigStateRead();const prepareDispatch=async()=>{const n=resolveSqliteDatabaseFilePath(t);if(!h)await i.acquire(()=>void 0);try{const t=acquireSqliteDatabaseAdmissionTurn(n,[],void 0,()=>{i.signal.throwIfAborted();e.admission.assertCurrent()});if(t)u=await t;const validateDispatch=async()=>{if(a!==void 0){assertDatabaseFileIdentity(await stat(n,{bigint:true}),{key:a});i.assertCurrent()}return f};if(h){i.assertCurrent();return await validateDispatch()}return await i.acquire(validateDispatch)}catch(e){u?.();u=void 0;throw e}};const g=p.pool.runTask(h?async()=>await i.acquire(prepareDispatch):prepareDispatch,{signal:i.signal,inputBytes:requestBytes(f),diagnosticOperation:r.type,...l?{onRequest:async(e,{signal:t})=>{i.assertCurrent();const n=AbortSignal.any([i.signal,t]);n.throwIfAborted();this.pendingChunks+=1;try{await l(e,n);n.throwIfAborted();i.assertCurrent();return{input:null,timeoutMs:3e5}}finally{this.pendingChunks-=1;if(this.pendingChunks===0)this.chunksDrained?.()}}}:c?{onRequestSync(e){i.assertCurrent();c(e);return{input:null,timeoutMs:3e5}}}:{}});this.tasks.set(g,d);return{task:g,result:(async()=>{let e;try{const t=await g.result;d.retire=m||Boolean(t.nativeCleanupFailure);e=decodeOpenClawStateReadReply(t)}catch(t){e={error:t}}u?.();u=void 0;d.retire||=`error`in e;return e})()}}catch(e){u?.();u=void 0;throw e}}async startValidateFresh(e,t){const n=this.startRun(e,e.admission.databasePath,true,{type:`admit`},t);const r=await n.result;if(`error`in r)throw r.error;t.assertCurrent();await this.closeTask(n.task)}async startRead(e,t){return this.startRun(e.context,e.location,e.checkFreshAdmission,this.capturedCommand,t,e.expectedIdentity,e.snapshotRoot,e.postgresSnapshot).result}startClose(){this.closed=true;if(this.closing)return this.closing;this.closing=(async()=>{const e=await Promise.allSettled([...this.tasks.keys()].map(e=>this.closeTask(e)));if(this.pendingChunks>0)await new Promise(e=>{this.chunksDrained=e});throwSqliteLifecycleErrors(e.flatMap(e=>e.status===`rejected`?[e.reason]:[]),`Shared-state reader task cleanup failed`)})().finally(()=>{this.chunksDrained=void 0;this.closing=void 0});return this.closing}};
//!src/state/openclaw-state-read-operation.ts
function isStateReadReply(e,t){return e.ok&&e.type===t}async function prepareOwnedStateReadImage(e,t,n,r,i){const a=n&&!e.isTransaction?leaseReusableSqliteSnapshot(t,n,{logicalReader:true}):void 0;if(a)return a;const o=n?captureReusableSqliteSource(t):void 0;const s=await prepareSqliteReadOnlyLocationFromOwnedDatabase(e,r.assertCurrent,i,`async`);return o?publishReusableSqliteSnapshot(t,o,s,()=>s.cleanupAsync(),{logicalOnly:true}):s}function startOpenClawStateReadOperation(e,t){const{pathname:n,snapshot:r,scopes:i,context:a,preserveArtifacts:o,controller:s,signal:c,receipt:l}=t;let u;let d;let f;let p;let m;let h;let g;let _;let startSnapshotCleanup;let v;let y;let b;let x=false;let S;const isPendingAdmission=e=>e instanceof StateDatabaseAdmissionPendingError&&e.databasePath===n;const C={signal:c,assertCurrent(){c.throwIfAborted();a.maintenanceScope?.assertAdmission();a.admission.assertCurrent();openClawStateDatabaseCache.assertOpenClawStateDatabaseOpenAllowed(n,`cached-read`,b)},async acquire(e){const acquire=()=>{C.assertCurrent();return e()};try{return await acquire()}catch(e){if(!isPendingAdmission(e))throw e}S??=performance.now()+OPENCLAW_SQLITE_BUSY_TIMEOUT_MS;return acquireWithWait({acquire,shouldRetry:isPendingAdmission,deadlineMs:S,pollIntervalMs:10,sleep:e=>sleepWithAbort(e,c)})}};const closeTransport=async()=>{if(!u)return;h??=u.startClose();try{await h}catch(e){h=void 0;throw e}};const cleanup=()=>{if(x)return Promise.resolve();return y??=(async()=>{await closeTransport();v?.();v=void 0;if(p){_=startSnapshotCleanup?.();if(!(_?await _.result:await p.cleanupAsync()))throw new Error(`Shared-state read snapshot cleanup failed: ${p.cleanupRoot??n}`);p=void 0;_=void 0}if(m){g??=m.startClose();try{await g.result}catch(e){g=void 0;throw e}m=void 0;g=void 0}f?.release();await r?.release?.();x=true;T();d?.();for(const e of i)e.resources.delete(w)})().finally(()=>{y=void 0})};const w={async close(){s.abort(/* @__PURE__ */ new Error(`Shared-state read admission closed`));if(!p)g??=m?.startClose();await closeTransport();await E.catch(()=>void 0);await cleanup()}};const T=registerOpenClawStateDatabaseAsyncResource({async close(e){if(!e||e.key===a.admission.identity.key||e.canonicalPath===a.admission.identity.canonicalPath)await w.close()}});a.maintenanceScope?.own(w,`shared-resources`,()=>w.close());for(const e of i)e.resources.add(w);function consume(e){const t=`error`in e?e.sourceAdmitted:e.value.type!==`admit`&&e.value.sourceAdmitted;if(t===true)l.phase=`read`;else if(t===false&&l.phase!==`read`)l.phase=`before-read`;if(`error`in e)throw e.error;if(t===true)f?.observe();return e.value}async function query(t){if(p)v=retainSnapshotTempDirectory(p.cleanupRoot??path.dirname(p.location));l.phase=e.type===`admit`?`before-read`:`unobserved`;return consume(await t.startRead({context:a,location:p?.location??r?.location??n,checkFreshAdmission:!f,expectedIdentity:!r&&!p||r?.location===n?a.admission.identity.key:void 0,snapshotRoot:p?.cleanupRoot??r?.cleanupRoot,postgresSnapshot:r?.postgresSnapshot},C))}async function run(){const i=captureOpenClawStateReadSource();const s=i.createTransport(e,t.onChunk,t.onChunkAsync,t.snapshotPreparation===`awaited`);u=s;d=i.own(()=>w.close());b=await prepareStateDatabaseReadAccess(a.admission);c.throwIfAborted();a.maintenanceScope?.assertAdmission();a.admission.assertCurrent();if(e.type===`admit`)return query(s);const l=!r?C.acquire(()=>{const e=o?borrowOpenClawStateDatabaseForAsyncRead(n,`cached-read`,b):void 0;return{native:e,borrowed:e??(!o?retainOpenClawStateDatabaseForIndependentRead(n,`cached-read`,b):void 0)}}):void 0;const h=l instanceof Promise?await l:l;const g=h?.native;f=h?.borrowed;const _=g&&t.preferIndependentWarmRead&&canReadWarmNativeSourceIndependently(g.database,n,a.admission.identity.key);if(!r&&!f&&!await statIfExists(n)){C.assertCurrent();return}if(!r&&!_){const t=(e.type===`plugins.metadata.read`||e.type===`config.health.read`||isUpdateRunAdmissionReadCommand(e))&&!a.existingSchemaPath&&!a.maintenanceScope&&!getStateDatabaseSchemaLease(n)&&(!g||!isPostgresSqlConnection(g.database.db)&&canReadWarmNativeSourceIndependently(g.database,n,a.admission.identity.key))&&(hasVerifiedLiveSqliteOwner(n)||readSqliteDatabaseCleanClose(n));if(o&&(!g||t))await s.startValidateFresh(a,C);if(t){C.assertCurrent();const t=await runSqliteReadOnlyOperation(n,{type:`startupMetadata.readCurrent`,input:e},{source:`canonical`,expectedIdentity:a.admission.identity.key,env:a.environment,signal:c});C.assertCurrent();if(t){const e=t.value;if(!e.ok){const t=/* @__PURE__ */ new Error(`Startup metadata inspection failed`);retainOpenClawStateWorkerErrorPayload(t,e.error);return consume({error:hydrateOpenClawStateWorkerError(t,{includeOrdinary:true}),sourceAdmitted:e.sourceAdmitted})}return consume({value:{ok:true,sourceAdmitted:true,...e.result}})}}}if(g&&!_){if(isPostgresSqlConnection(g.database.db))requireNativeDatabaseFile(`postgres`,`file-snapshot`);p=await prepareOwnedStateReadImage(g.database.db,n,canReadWarmNativeSourceIndependently(g.database,n,a.admission.identity.key)?a.admission.identity:void 0,C,c)}else if(!r&&o&&!_){const r={key:a.admission.identity.key};if(t.snapshotPreparation===`awaited`||isSqliteSnapshotReuseActive())p=await prepareSqliteReadOnlyLocationAwaited(n,{signal:c,expectedSourceIdentity:r,reuse:true,allowLiveOwner:t.snapshotPreparation===`awaited`&&e.type===`plugins.metadata.read`&&a.maintenanceScope?.ownsSchemaMaintenance!==true&&!getStateDatabaseSchemaLease(n)});else{m=startSqliteReadOnlyLocationAsync(n,{preserveSourceArtifacts:true,signal:c,expectedSourceIdentity:r,reuse:true});const e=await m.result;p=e;startSnapshotCleanup=()=>e.startCleanup()}}return query(s)}const E=run();return(async()=>{let e;const n=[];try{e=await E}catch(e){n.push(e)}try{await cleanup()}catch(e){n.push(e)}throwSqliteLifecycleErrors(n,`Shared-state read and cleanup failed`);t.callerSignal?.throwIfAborted();return e})().catch(e=>{throw t.mapError?t.mapError(e,l.phase):e})}
//!src/sessions/session-controller.cleanup-context.ts
const cleanupContext=resolveGlobalSingleton(Symbol.for(`openclaw.sessionControllerCleanupContext`),()=>({}));function runWithSessionControllerCleanup(e){return cleanupContext.exit?cleanupContext.exit(e):e()}
//!src/infra/gateway-scheduler.ts
const log$3=createSubsystemLogger(`gateway/scheduler`);const hostClock={now:()=>Date.now(),monotonicNow:()=>performance.now(),arm:(e,t)=>{const n=setTimeout(()=>{runWithMainThreadTask(`scheduler:wake`,()=>{e()})},t);n.unref();return()=>clearTimeout(n)}};function nextMaintenanceSlot(e,t,n){return e+(Math.floor(Math.max(0,t-e)/n)+1)*n}var GatewayScheduler=class{constructor(e={}){this.jobs=/* @__PURE__ */ new Map;this.pending=/* @__PURE__ */ new Set;this.dispatching=false;this.fenced=false;this.controller=new AbortController;this.clock=e.clock??hostClock}get signal(){return this.controller.signal}now(){return this.clock.now()}get nextWakeAtMs(){const e=this.now();const t=this.clock.monotonicNow();let n=null;for(const r of this.jobs.values()){if(r.running)continue;const i=e+this.remaining(r,e,t);n=n===null?i:Math.min(n,i)}return n}scope(){const e=new AbortController;const t={signal:AbortSignal.any([this.signal,e.signal]),jobs:/* @__PURE__ */ new Set};const beginClose=()=>{e.abort();materializeErrorStack(e.signal.reason);materializeErrorStack(t.signal.reason);for(const e of t.jobs)this.cancel(e)};const close=()=>{beginClose();const e=[...t.jobs].flatMap(e=>e.running??[]);return e.length>0?Promise.all(e).then(()=>void 0):void 0};return{signal:t.signal,now:()=>this.now(),schedule:e=>this.scheduleOwned(e,t),beginClose,close,stop:async()=>{await close()}}}schedule(e){return this.scheduleOwned(e)}scheduleOwned(e,t){const n=`delayMs`in e;const r=this.now();const i=n?r+e.delayMs:e.atMs;const a=e.phase===`maintenance`?Math.max(r,Math.floor(i/1e4)*1e4):i;if(!Number.isFinite(a)||e.everyMs!==void 0&&(!Number.isFinite(e.everyMs)||e.everyMs<=0))throw new Error(`Invalid Gateway schedule: ${e.id}`);const o=this.fenced||t?.signal.aborted===true;const s=o?void 0:this.jobs.get(e.id);const c={id:e.id,diagnosticName:`scheduler:${e.id.startsWith(`maintenance:`)?e.id.split(`:`).slice(0,3).join(`:`):e.id.split(/[:/]/u,1)[0]}`,run:e.run,everyMs:e.everyMs,phase:e.phase,atMs:a,elapsedAtMs:e.phase!==`maintenance`&&(n||e.everyMs!==void 0)?this.clock.monotonicNow()+Math.max(0,a-r):void 0,context:runOutsideAsyncWorkScope(()=>runWithSessionControllerCleanup(()=>AsyncLocalStorage.snapshot())),cancelled:o,owner:t};if(e.mode===`earliest`&&s&&!s.running){c.atMs=Math.min(c.atMs,s.atMs);if(e.phase!==`maintenance`&&s.elapsedAtMs!==void 0)c.elapsedAtMs=c.elapsedAtMs===void 0?s.elapsedAtMs:Math.min(c.elapsedAtMs,s.elapsedAtMs)}const cancel=()=>this.cancel(c);if(!o){t?.jobs.add(c);this.jobs.set(c.id,c);if(s)this.cancel(s);this.arm()}return{get atMs(){return c.atMs},cancel,stop:async()=>{cancel();await c.running}}}cancel(e){e.cancelled=true;if(!e.running)e.owner?.jobs.delete(e);if(this.jobs.get(e.id)===e){this.jobs.delete(e.id);this.arm()}}fence(){this.fenced=true;this.cancelTimer?.();this.cancelTimer=void 0;for(const e of this.jobs.values())this.cancel(e);this.jobs.clear()}beginClose(){this.fence();this.controller.abort();materializeErrorStack(this.controller.signal.reason)}async stop(){this.beginClose();await Promise.all(this.pending)}remaining(e,t,n){const r=e.atMs-t;return e.elapsedAtMs===void 0?r:Math.min(r,e.elapsedAtMs-n)}arm(){if(this.fenced||this.dispatching)return;this.cancelTimer?.();this.cancelTimer=void 0;const e=this.nextWakeAtMs;if(e!==null){const t=this.now();const n=Math.min(2147483647,Math.max(0,Math.ceil(e-t)));this.cancelTimer=runInDetachedAsyncContext(()=>this.clock.arm(()=>this.wake(t+n),n))}}wake(e){this.cancelTimer=void 0;if(this.fenced)return;const t=this.now();const n=this.clock.monotonicNow();const r=[...this.jobs.values()].filter(e=>!e.running&&this.remaining(e,t,n)<=0).toSorted((e,r)=>this.remaining(e,t,n)-this.remaining(r,t,n));let i;if(t-e>6e4)log$3.debug(`late wake by ${t-e}ms; coalescing ${r.length} due jobs`);this.dispatching=true;try{for(const e of r){if(this.fenced||e.cancelled||e.owner?.signal.aborted||this.jobs.get(e.id)!==e)continue;if(e.everyMs===void 0)this.jobs.delete(e.id);const t=this.run(e);if(t)(i??=[]).push(t)}}finally{this.dispatching=false;this.arm()}return i?Promise.all(i).then(()=>void 0):void 0}run(e){log$3[e.everyMs===void 0?`debug`:`trace`](`running ${e.id}`);const t=createDeferredCore();const n=new AsyncWorkScope;e.running=t.promise;this.pending.add(t.promise);const finish=()=>{e.running=void 0;this.pending.delete(t.promise);if(e.everyMs!==void 0&&!e.cancelled&&!this.fenced){if(e.phase===`maintenance`){e.atMs=Math.floor(e.atMs/1e4)*1e4;e.atMs=nextMaintenanceSlot(e.atMs,this.now(),e.everyMs)}else{e.atMs=this.now()+e.everyMs;e.elapsedAtMs=this.clock.monotonicNow()+e.everyMs}}else e.owner?.jobs.delete(e);t.resolve();this.arm()};let r=void 0;try{r=e.context(()=>runWithMainThreadTask(e.diagnosticName,()=>n.run(e.run)))}catch(t){log$3.error(`${e.id} failed: ${String(t)}`)}if(!r&&!n.hasPendingWork){finish();return}Promise.resolve(r).catch(t=>log$3.error(`${e.id} failed: ${String(t)}`)).then(()=>AsyncWorkScope.runWhenAllIdle(()=>[n],()=>n.drain())).finally(finish);return t.promise}};
//!src/infra/sqlite-wal-checkpoint.ts
const checkpointListeners=resolveGlobalSingleton(Symbol.for(`openclaw.sqliteWalCheckpointListeners`),()=>/* @__PURE__ */ new Set);function observeSqliteWalCheckpointHealth(e,t){const{activeReaders:n,readerDiagnostics:r,...i}=t;if(t.state===`complete`)return i;const{activeReaders:a,...o}=readSqliteReaderDiagnosticsForPath(e);return{...i,activeReaders:[...(n??[]).filter(e=>e.threadId!==o.threadId),...a].toSorted((e,t)=>t.ageMs-e.ageMs).slice(0,8),readerDiagnostics:[...(r??[]).filter(e=>e.threadId!==o.threadId),o].slice(-8)}}function notifyCheckpoint(e,t){for(const n of checkpointListeners)try{n({databasePath:sqliteReaderDatabasePathKey(e),health:structuredClone(t.health),observedAtNs:t.observedAtNs,lastCompletedAtNs:t.lastCompletedAtNs})}catch{}}function sqliteFileBytes(e){try{return fs.statSync(e).size}catch(e){if(hasErrnoCode(e,`ENOENT`))return 0;throw e}}function readCheckpointResult(e){const[t,n,r]=Object.values(e??{}).map(e=>normalizeSqliteNumber(typeof e===`number`||typeof e===`bigint`?e:null));if(t===void 0||n===void 0||r===void 0)throw new Error(`SQLite returned an invalid WAL checkpoint result`);return{busy:t,logFrames:n,checkpointedFrames:r}}function checkpoint(e,t){return e.prepare(`PRAGMA wal_checkpoint(${t});`).get()}function createSqliteWalCheckpoint(e,t,n){let r;const checkpointObservation=()=>({state:`error`,observedAtMs:Date.now(),walBytes:null,databaseBytes:null,logFrames:null,checkpointedFrames:null,lastCompletedAtMs:r?.health.lastCompletedAtMs??null,consecutiveBlocked:0,warning:true});const recordCheckpointError=(e,n=checkpointObservation())=>{const i={...n,observedAtMs:Date.now(),state:`error`,consecutiveBlocked:0,warning:true,error:formatErrorMessage(e)};r={observedAtNs:process.hrtime.bigint(),lastCompletedAtNs:r?.lastCompletedAtNs,health:t.databasePath?observeSqliteWalCheckpointHealth(t.databasePath,i):i};if(t.databasePath)notifyCheckpoint(t.databasePath,r);t.onCheckpointError?.(e)};const recordCheckpoint=(e,i,a)=>{const o=process.hrtime.bigint();const s=checkpointObservation();let c;let l;try{const{busy:e,logFrames:a,checkpointedFrames:u}=readCheckpointResult(i);c=e!==0;s.logFrames=a;s.checkpointedFrames=u;s.state=c||u<a?`blocked`:`complete`;if(s.state===`complete`)s.lastCompletedAtMs=s.observedAtMs;else s.consecutiveBlocked=(r?.health.consecutiveBlocked??0)+1;if(t.databasePath)try{s.databaseBytes=sqliteFileBytes(t.databasePath);s.walBytes=sqliteFileBytes(`${t.databasePath}-wal`)}catch(e){l=e;s.error=formatErrorMessage(e)}s.warning=s.state===`blocked`&&(s.consecutiveBlocked>=2||s.walBytes!==null&&s.databaseBytes!==null&&s.walBytes>Math.max(2*s.databaseBytes,n));r={observedAtNs:o,lastCompletedAtNs:s.state===`complete`?o:r?.lastCompletedAtNs,health:t.databasePath?observeSqliteWalCheckpointHealth(t.databasePath,s):s};if(t.databasePath)notifyCheckpoint(t.databasePath,r)}catch(e){recordCheckpointError(e,s);return false}if(s.error!==void 0)t.onCheckpointError?.(l);if(s.warning&&!a){const n=t.databaseLabel??`sqlite database`;t.onCheckpointError?.(/* @__PURE__ */ new Error(`${n} WAL checkpoint ${e} ${c?`remained busy`:`blocked by a reader`}`))}return s.state===`complete`};return{adopt(e){if(r&&r.observedAtNs>=e.observedAtNs&&(r.lastCompletedAtNs??0n)>=(e.lastCompletedAtNs??0n))return;const n=(r?.lastCompletedAtNs??0n)>(e.lastCompletedAtNs??0n)?r:e;if(!r||e.observedAtNs>r.observedAtNs)r=structuredClone(e);r.lastCompletedAtNs=n?.lastCompletedAtNs;r.health.lastCompletedAtMs=n?.health.lastCompletedAtMs??null;if(t.databasePath){r.health=observeSqliteWalCheckpointHealth(t.databasePath,r.health);notifyCheckpoint(t.databasePath,r)}},checkpoint(t,n={}){try{return recordCheckpoint(t,checkpoint(e,t),n.quiet===true)}catch(e){recordCheckpointError(e);return false}},recordError:recordCheckpointError,inspectIdle(){const{busy:t,logFrames:n,checkpointedFrames:r}=readCheckpointResult(checkpoint(e,`PASSIVE`));return t===0&&n>=0&&r>=0&&r<=n},get health(){return r?structuredClone(r.health):void 0},get snapshot(){return r?structuredClone(r):void 0}}}
//!packages/normalization-core/src/mountinfo-path.ts
const MOUNT_PATH_OCTAL_ESCAPE_RE=/\\([0-7]{3})/g;function decodeMountInfoPath(e){return e.replace(MOUNT_PATH_OCTAL_ESCAPE_RE,(e,t)=>String.fromCharCode(Number.parseInt(t,8)))}
//!src/infra/sqlite-wal-filesystem.ts
const NETWORK_FILESYSTEM_MAGIC=/* @__PURE__ */ new Set([26985,20859,4283649346,4266872130]);const ROLLBACK_FILESYSTEM_MAGIC=/* @__PURE__ */ new Set([...NETWORK_FILESYSTEM_MAGIC,16914839]);const LINUX_BTRFS_SUPER_MAGIC=2435016766;const PROC_MOUNTINFO_PATH=`/proc/self/mountinfo`;const MOUNT_COMMAND_TIMEOUT_MS=1e3;const NETWORK_FILESYSTEM_TYPES=/* @__PURE__ */ new Set([`cifs`,`smbfs`,`smb2`,`smb3`]);const CROSS_VM_FILESYSTEM_TYPES=/* @__PURE__ */ new Set([`virtiofs`,`fuse.virtiofs`,`9p`,`9p2000.l`]);const log$2=createSubsystemLogger(`infra/sqlite-wal`);let warnedNoCow=false;function findExistingVolumePaths(e){let t=path.resolve(e);while(true){let e;try{e=fs.statSync(t)}catch{const e=path.dirname(t);if(e===t)return null;t=e;continue}const n=fs.realpathSync(t);return{canonicalPath:e.isDirectory()?n:path.dirname(n),originalPath:e.isDirectory()?t:path.dirname(t)}}}function parseProcMountInfoEntries(e){const t=[];for(const n of e.split(`
`)){const e=n.indexOf(` - `);if(e===-1)continue;const r=n.slice(0,e).split(` `);const i=n.slice(e+3).split(` `);const a=r[4];const o=i[0];if(a&&o)t.push({mountPoint:decodeMountInfoPath(a),fsType:o,...i[1]?{source:decodeMountInfoPath(i[1])}:{}})}return t}function parseMountCommandEntries(e){const t=[];for(const n of e.split(`
`)){const e=/^(.+) on (.+) type ([^,\s)]+) \(/.exec(n)??/^(.+) on (.+) \(([^,\s)]+)/.exec(n);if(e){const[,n,r,i]=e;if(n&&r&&i)t.push({source:n,mountPoint:r,fsType:i})}}return t}function readMountEntries(){try{return{ok:true,value:parseProcMountInfoEntries(fs.readFileSync(PROC_MOUNTINFO_PATH,`utf8`))}}catch{}try{return{ok:true,value:parseMountCommandEntries(String(process.getBuiltinModule(`node:child_process`).execFileSync(`mount`,[],{killSignal:`SIGKILL`,timeout:MOUNT_COMMAND_TIMEOUT_MS})))}}catch(e){return hasErrnoCode(e,`ETIMEDOUT`)?{ok:false,error:`timeout`}:{ok:true,value:[]}}}function isPathWithinMount(e,t){const n=path.resolve(e);const r=path.resolve(t);return n===r||r===path.parse(r).root||n.startsWith(`${r}${path.sep}`)}function isSshfsMountSource(e){if(!e)return false;const t=e.toLowerCase();return t===`sshfs`||t.startsWith(`sshfs#`)||t.startsWith(`sshfs@`)||/^(?:[^/\s:]+@)?[^/\s:]+:.*/u.test(e)}function resolveNetworkMountJournalPolicy(e){const t=e.fsType.toLowerCase();if(t.startsWith(`nfs`)||NETWORK_FILESYSTEM_TYPES.has(t))return`rollback`;if(t===`fuse.sshfs`)return`unsupported`;if((t===`macfuse`||t===`osxfuse`)&&isSshfsMountSource(e.source))return`unsupported`}function resolveMountTypeJournalPolicy(e){const t=e.fsType.toLowerCase();return resolveNetworkMountJournalPolicy(e)??(CROSS_VM_FILESYSTEM_TYPES.has(t)||t.startsWith(`9p`)?`rollback`:`wal`)}function findMountEntry(e,t){return t.filter(t=>isPathWithinMount(e,t.mountPoint)).toSorted((e,t)=>t.mountPoint.length-e.mountPoint.length)[0]}function resolveMountEntryJournalPolicy(e,t){const n=findMountEntry(e,t);return n?resolveMountTypeJournalPolicy(n):`wal`}function isSqlitePathOnBtrfs(e){if(process.platform!==`linux`)return false;const t=findExistingVolumePaths(e);if(!t)return false;try{return fs.statfsSync(t.canonicalPath).type===LINUX_BTRFS_SUPER_MAGIC}catch{const e=readMountEntries();return e.ok&&findMountEntry(t.canonicalPath,e.value)?.fsType.toLowerCase()===`btrfs`}}function setSqliteDirectoryNoCow(e){if(!fs.statSync(e).isDirectory())throw new Error(`SQLite NOCOW target is not a directory: ${e}`);const t=process.getBuiltinModule(`node:child_process`).spawnSync(`chattr`,[`+C`,e],{encoding:`utf8`,killSignal:`SIGKILL`,timeout:MOUNT_COMMAND_TIMEOUT_MS,maxBuffer:4096});if(t.error||t.status!==0)throw t.error??/* @__PURE__ */ new Error(`chattr +C failed: ${t.stderr.trim()||t.signal||t.status}`)}function prepareSqliteDatabaseDirectory(e){if(process.platform!==`linux`||fs.existsSync(e))return;try{if(isSqlitePathOnBtrfs(e))setSqliteDirectoryNoCow(path.dirname(e))}catch(t){if(!warnedNoCow){warnedNoCow=true;log$2.warn(`Could not enable SQLite directory NOCOW; continuing with filesystem defaults`,{databasePath:e,error:t instanceof Error?t.message:String(t)})}}}function combineMountEntryJournalPolicies(e){const[t,n]=e;if(process.platform===`darwin`&&t===n)try{if(probeTreeClone(n)===`apfs`)return`wal`}catch{}const r=readMountEntries();if(!r.ok)return`rollback`;const i=new Set(e.map(e=>resolveMountEntryJournalPolicy(e,r.value)));if(i.has(`unsupported`))return`unsupported`;return i.has(`rollback`)?`rollback`:`wal`}function isWindowsUncPath(e){return/^\\\\\?\\UNC\\[^\\]+\\[^\\]+/i.test(e)||/^\\\\(?![?.]\\)[^\\]+\\[^\\]+/.test(e)}function isWindowsDrivePath(e){return/^[A-Za-z]:[\\/]/.test(e)||/^\\\\\?\\[A-Za-z]:[\\/]/i.test(e)}function resolvePathJournalPolicy(e){if(process.platform===`win32`){const t=path.win32.normalize(e);if(isWindowsUncPath(t))return`rollback`;if(isWindowsDrivePath(t))try{return isWindowsUncPath(path.win32.normalize(fs.realpathSync.native(e)))?`rollback`:`wal`}catch{return`rollback`}}const t=findExistingVolumePaths(e);if(!t)return`wal`;const n=[t.originalPath,t.canonicalPath];try{if(ROLLBACK_FILESYSTEM_MAGIC.has(fs.statfsSync(t.canonicalPath).type))return`rollback`}catch{}return combineMountEntryJournalPolicies(n)}
//!src/infra/sqlite-wal-split-brain.ts
const PROC_SELF_FD_PATH=`/proc/self/fd`;const SQLITE_WAL_SPLIT_BRAIN_FATAL_MESSAGE=`SQLite WAL sidecar identity mismatch; terminating without SQLite cleanup`;async function readUnlessMissing(e,t=false){try{return await e()}catch(e){if(t&&hasErrnoCode(e,`EBADF`)||hasErrnoCode(e,`ENOENT`))return;throw e}}function isSqliteWalSidecarSplitBrain(e,t){return e.nlink===0n||!t||e.dev!==t.dev||e.ino!==t.ino}async function detectSqliteWalSplitBrain(e){const t=await readUnlessMissing(()=>fs.promises.readdir(PROC_SELF_FD_PATH));const n=[`${e}-wal`,`${e}-shm`];for(const r of t??[]){const t=path.join(PROC_SELF_FD_PATH,r);const i=await readUnlessMissing(()=>fs.promises.readlink(t));if(i===void 0)continue;const a=n.find(e=>i===e||i===`${e} (deleted)`);if(!a)continue;const o=await readUnlessMissing(()=>promisify(fs.fstat)(Number(r),{bigint:true}),true);if(o===void 0||await readUnlessMissing(()=>fs.promises.readlink(t))!==i)continue;const s=await readUnlessMissing(()=>fs.promises.stat(a,{bigint:true}));if(!isSqliteWalSidecarSplitBrain(o,s))continue;const c=await readUnlessMissing(()=>promisify(fs.fstat)(Number(r),{bigint:true}),true);if(!c||c.dev!==o.dev||c.ino!==o.ino||await readUnlessMissing(()=>fs.promises.readlink(t))!==i)continue;return{event:`sqlite_wal_sidecar_identity_mismatch`,databasePath:e,descriptorDevice:o.dev.toString(),descriptorInode:o.ino.toString(),sidecarPath:a,...s?{targetDevice:s.dev.toString(),targetInode:s.ino.toString()}:{}}}}function terminateForSqliteWalSplitBrain(e,t){try{fs.writeSync(2,`${JSON.stringify({level:`fatal`,subsystem:`infra/sqlite-wal`,message:SQLITE_WAL_SPLIT_BRAIN_FATAL_MESSAGE,...e,databaseLabel:t,pid:process.pid})}\n`)}catch{}try{process.kill(process.pid,`SIGKILL`)}finally{process.abort()}}
//!src/infra/sqlite-wal.ts
const DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES=16384;const DEFAULT_SQLITE_WAL_CHECKPOINT_TICK_MS=1e4;const DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS=18e5;const DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES=67108864;const JOURNAL_MODE_RETRY_INTERVAL_MS=10;const JOURNAL_MODE_RETRY_SLEEP=new Int32Array(new SharedArrayBuffer(4));const log$1=createSubsystemLogger(`infra/sqlite-wal`);const maintenanceScheduler=new GatewayScheduler;let nextMaintenanceId=0;const completedCheckpointKey={name:`sqlite-wal-completed-write-revision`,read:e=>e instanceof SharedArrayBuffer&&e.byteLength===Int32Array.BYTES_PER_ELEMENT?e:void 0};function sharedCompletedCheckpoint(e,t){let n=getSqliteDatabaseAdmission(e,completedCheckpointKey);if(!n){n=new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);Atomics.store(new Int32Array(n),0,t-1|0);publishSqliteDatabaseAdmission(e,completedCheckpointKey,n);n=getSqliteDatabaseAdmission(e,completedCheckpointKey)}return n?new Int32Array(n):void 0}function enableIncrementalAutoVacuumForFreshDatabase(e){const t=e.location();const n=t?peekSqliteDatabaseAdmissionForPath(t,schemaAdmission):void 0;if(n&&(n.userVersion>0||n.tables.size>0||n.views.size>0))return;if(e.prepare(`PRAGMA page_count`).get()?.page_count===0)e.exec(`PRAGMA auto_vacuum = INCREMENTAL;`)}function configureSqlitePreSchemaPragmas(e,t={}){if(t.busyTimeoutMs!==void 0)setSqliteBusyTimeout(e,t.busyTimeoutMs);enableIncrementalAutoVacuumForFreshDatabase(e)}function readJournalModeResult(e){if(!e||typeof e!==`object`)return null;const t=e;const n=t.journal_mode??Object.values(t)[0];return typeof n===`string`?n.toLowerCase():null}function hasInMemoryMainDatabase(e){return e.prepare(`PRAGMA database_list;`).all().find(e=>e.name===`main`)?.file===``}function requireRollbackJournalMode(e,t){const n=readJournalModeResult(e.prepare(`PRAGMA journal_mode = DELETE;`).get());if(n!==`delete`){const e=t.databaseLabel??`sqlite database`;const r=t.databasePath?` at ${t.databasePath}`:``;throw new Error(`${e}${r} is on a network-backed volume but SQLite kept journal_mode=${n??`unknown`}; refusing to continue with WAL on network storage.`)}}function enableSqliteWalJournalMode(e,t,n){const r=performance$1.now()+t;let i=false;try{while(true)try{const t=readJournalModeResult(e.prepare(`PRAGMA journal_mode = WAL;`).get());if(t===`wal`)return true;if(t===`memory`&&hasInMemoryMainDatabase(e))return false;const r=n.databaseLabel??`sqlite database`;const i=n.databasePath?` at ${n.databasePath}`:``;throw new Error(`${r}${i} could not enable WAL; SQLite kept journal_mode=${t??`unknown`}.`)}catch(t){const n=Math.max(0,r-performance$1.now());if(!isSqliteLockError(t)||n<=0)throw t;if(!i){setSqliteBusyTimeout(e,0);i=true}Atomics.wait(JOURNAL_MODE_RETRY_SLEEP,0,0,Math.min(JOURNAL_MODE_RETRY_INTERVAL_MS,n))}}finally{if(i)setSqliteBusyTimeout(e,t)}}function enableMacosCheckpointFullfsync(e){if(process.platform!==`darwin`)return;try{e.exec(`PRAGMA checkpoint_fullfsync = 1;`)}catch{}}function refuseUnsupportedFilesystem(e){const t=e.databaseLabel??`sqlite database`;const n=e.databasePath?` at ${e.databasePath}`:``;throw new Error(`${t}${n} is on SSHFS, which cannot safely coordinate SQLite writes across mounts; refusing to open the database.`)}function configureSqliteWalMaintenance(e,t={}){const n=t.busyTimeoutMs??0;if(t.busyTimeoutMs!==void 0)setSqliteBusyTimeout(e,t.busyTimeoutMs);const r=normalizeSqliteNonNegativeInteger(t.autoCheckpointPages??DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES,`autoCheckpointPages`);const i=normalizeSqliteNonNegativeInteger(t.checkpointIntervalMs??DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS,`checkpointIntervalMs`);const a=Math.min(i,MAX_TIMER_TIMEOUT_MS);const o=i>DEFAULT_SQLITE_WAL_CHECKPOINT_TICK_MS?DEFAULT_SQLITE_WAL_CHECKPOINT_TICK_MS:0;const s=t.checkpointMode??`TRUNCATE`;const c=t.checkpointMode??`PASSIVE`;const l=t.databasePath?resolvePathJournalPolicy(t.databasePath):`wal`;if(l===`unsupported`)refuseUnsupportedFilesystem(t);if(l===`rollback`)requireRollbackJournalMode(e,t);if(l===`rollback`||!enableSqliteWalJournalMode(e,n,t))return{checkpoint:()=>true,reclaimFreePages:(t={})=>reclaimSqliteWalFreePages(e,()=>true,t),stop:async()=>{},close:()=>true};enableMacosCheckpointFullfsync(e);e.exec(`PRAGMA wal_autocheckpoint = ${isSqliteWalWorkerMaintained(e)?0:r};`);e.exec(`PRAGMA journal_size_limit = ${DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES};`);const u=process.platform===`linux`&&t.databasePath&&fs.existsSync(t.databasePath)?fs.realpathSync.native(t.databasePath):void 0;let d=false;let f=false;let p=Boolean(u);const m=createSqliteWalCheckpoint(e,t,DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES);const h=m.checkpoint;const runMaintenance=e=>{if(d||f)return false;try{return t.runMaintenance?t.runMaintenance(e):e()}catch(e){m.recordError(e);return false}};const checkpoint=()=>runMaintenance(()=>h(s));const reclaimFreePages=(t={})=>{let n;let r;runMaintenance(()=>{try{n=reclaimSqliteWalFreePages(e,h,t);return n.checkpointCompleted}catch(e){r={error:e};throw e}});if(r)throw r.error;if(!n)throw new Error(`SQLite page reclamation owner is unavailable`);return{...n,checkpoint:m.snapshot}};const g=maintenanceScheduler.scope();const _=`sqlite-wal:${++nextMaintenanceId}`;let v=0;let y;const maintainPeriodic=(t,n,r)=>{if(d)return{reclaimedPages:0};if(t.checkpoint)m.adopt(t.checkpoint);let i=0;const a=t.maxPages===0;const o=a&&t.checkpointMode===`PASSIVE`;const s=o?readSqliteDatabaseWriteRevision(e):void 0;const c=s===void 0?void 0:sharedCompletedCheckpoint(e,s);const l=c!==void 0&&Atomics.load(c,0)===s;if(s!==void 0&&(l||s===y&&m.health?.state===`complete`))return{reclaimedPages:0,checkpoint:m.health?.state===`complete`?m.snapshot:void 0};const runTickCheckpoint=e=>m.checkpoint(e,{quiet:a});y=runMaintenance(()=>{let a;if(o){n?.(`transaction`);a=runTickCheckpoint(`PASSIVE`)}else{const r=reclaimSqliteWalFreePages(e,runTickCheckpoint,{checkpointMode:t.checkpointMode,maxPages:t.maxPages,beforeMutation:()=>n?.(`transaction`),onCommit:()=>n?.(`commit`)});a=r.checkpointCompleted;if(a&&r.freePagesBefore!==null&&r.remainingFreePages!==null)i=Math.min(r.vacuumPagesRequested,r.freePagesBefore-r.remainingFreePages)}if(a&&t.checkpointMode===`PASSIVE`&&(m.health?.walBytes??0)>DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES){n?.(`transaction`);runWithSqliteBusyTimeout(e,0,()=>runTickCheckpoint(`TRUNCATE`))}if(a&&t.maxPages>0&&!t.continuation)try{r?.()}catch(e){if(!isSqliteLockError(e))throw e}return a})&&m.health?.state===`complete`?s:void 0;if(c&&y!==void 0)Atomics.store(c,0,y);return{reclaimedPages:i,checkpoint:m.snapshot}};let stopCheckpointTick;const b=createSqliteWalMaintenanceScheduler(e,maintainPeriodic,e=>a>0&&!g.signal.aborted&&!d&&!f&&!t.isScheduledMaintenanceSuspended?.()?{maxPages:e,checkpointMode:c,checkpoint:m.snapshot}:void 0,m.adopt,e=>m.recordError(e),()=>{const e=v;v=0;return e},()=>stopCheckpointTick?.());const schedule=(e,n,r)=>runInDetachedAsyncContext(()=>g.schedule({id:`${_}:${e}`,delayMs:e===`periodic`&&t.checkpointIntervalMs===void 0?n+Math.floor(Math.random()*n):n,everyMs:n,run:r}));if(a>0)schedule(`periodic`,a,async()=>{if(u&&p){f=true;const n=registerNodeSqliteDisposeGuard(e,()=>{throw new Error(`SQLite WAL inspection is pending; await maintenance.stop() before close`)});try{let e;try{e=await detectSqliteWalSplitBrain(u)}catch(e){p=false;log$1.warn(`SQLite WAL split-brain detection disabled`,{databaseLabel:t.databaseLabel,databasePath:u,error:e instanceof Error?e.message:String(e)})}if(e){d=true;g.beginClose();terminateForSqliteWalSplitBrain(e,t.databaseLabel)}}finally{n();f=false}if(g.signal.aborted)return}v=512;return b()});if(o>0&&!isSqliteWalWorkerMaintained(e)){let t=false;let n;const cancelTick=()=>{n?.cancel();n=void 0};const armTick=()=>{if(!t&&!n&&!g.signal.aborted&&!d)n=runInDetachedAsyncContext(()=>g.schedule({id:`${_}:tick`,delayMs:o,run:runTick}))};const runTick=async()=>{n=void 0;await b();if(t)return;const r=readSqliteDatabaseWriteRevision(e);const i=r===void 0?void 0:sharedCompletedCheckpoint(e,r);if(i&&Atomics.load(i,0)===r)cancelTick();else armTick()};const r=c===`PASSIVE`?onSqliteDatabaseWriteSettled(e,armTick):void 0;if(r){stopCheckpointTick=()=>{t=true;r();cancelTick()};armTick()}else stopCheckpointTick=schedule(`tick`,o,b).cancel}const beginClose=()=>{stopCheckpointTick?.();runInDetachedAsyncContext(()=>g.beginClose());return cancelSqliteWalWriteAdmission(e)};return{get health(){return m.health},checkpoint,maintainPeriodic,reclaimFreePages,inspectIdle:()=>runMaintenance(m.inspectIdle)?`healthy`:`retire`,stop:async()=>{try{await beginClose()}finally{await runInDetachedAsyncContext(()=>g.stop())}},close:t=>{beginClose();if(d||isSqliteWalWorkerMaintained(e))return false;return runMaintenance(()=>h(t?.checkpointMode??s))}}}function configureSqliteConnectionPragmas(e,t={}){const{foreignKeys:n,synchronous:r,...i}=t;const a=configureSqliteWalMaintenance(e,i);try{if(r)e.exec(`PRAGMA synchronous = ${r};`);if(n)e.exec(`PRAGMA foreign_keys = ON;`);return a}catch(e){try{a.close()}catch(t){throw createSqliteLifecycleAggregateError([e,t],`SQLite connection pragma configuration and WAL maintenance cleanup both failed.`,e)}throw e}}
//!src/infra/sqlite-snapshot.ts
function configureSqliteSnapshotReadCache(e){e.exec(`PRAGMA cache_size = -16384; PRAGMA mmap_size = 268435456;`)}
//!src/state/openclaw-state-read-scope.ts
function readRetainedStateSnapshot(e,t,n){const{location:r}=t;if(isStatePostgres())return withOpenClawStateReadOnlyLocation(n,e.path,r);if(!e.reader){const t=openOpenClawStateReadOnlyLocation(e.path,r);let n=false;e.resources.add({async close(){if(!n){if(!t.close())throw new Error(`Shared-state report reader cleanup is incomplete`);n=true}}});if(!isPostgresSqlConnection(t.database.db))configureSqliteSnapshotReadCache(t.database.db);e.reader=t}return withOpenClawStateReadOnlyLocation(n,e.path,{location:r,connection:e.reader})}function assertRetainedReadScopeAdmission(e,t){if(t.some(t=>t?.path===e&&(!t.active||t.work.isClosing)))throw new StateDatabaseReadAdmissionInvalidatedError(`Shared-state read scope is closing or closed; retry the operation in a current scope.`)}
//!src/state/openclaw-state-worker-context.ts
function captureOpenClawStateReadContext(e=resolveOpenClawStateSqlitePath(),t){return captureOpenClawStateReadContextWithAdmission(e,captureOpenClawStateDatabaseReadAdmission,openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity,t)}function captureOpenClawStateReadWorkerContext(e={}){return captureOpenClawStateReadWorkerContextWithAdmission(e,captureOpenClawStateDatabaseReadAdmission,openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity)}
//!src/state/openclaw-state-read-snapshot-source.ts
const log=createSubsystemLogger(`state/db`);
//!src/state/openclaw-state-db-readonly.ts
const REUSE_IMAGE={reuse:true};const disposableStateReads=resolveGlobalSingleton(Symbol.for(`openclaw.disposableStateReads`),()=>new AsyncLocalStorage);const stateSnapshotReads=resolveGlobalSingleton(Symbol.for(`openclaw.stateSnapshotReads`),()=>new AsyncLocalStorage);function exitStateReadSnapshot(e){return stateSnapshotReads.exit(()=>postgresStateReadSnapshot.exit(e))}function resolveStateReadCallerSignal(){const e=getAsyncWorkSignal();const t=stateSnapshotReads.getStore();return t&&e===t.work.signal?t.callerSignal:e}function getActiveOpenClawStateDatabaseReadSnapshot(e={}){const t=stateSnapshotReads.getStore();return t?.path===resolveOpenClawStateReadPath(e)?t.readSource():void 0}async function getActiveOpenClawStateDatabaseReadSnapshotAsync(e={}){const t=stateSnapshotReads.getStore();if(t?.path!==resolveOpenClawStateReadPath(e))return;return t.work.track(async()=>{await t.prepareSource?.();resolveStateReadCallerSignal()?.throwIfAborted();return getActiveOpenClawStateDatabaseReadSnapshot(e)})}function requiresArtifactPreservingSnapshot(e){if(isStatePostgres()||isLiveStateRead())return false;const t=getOpenClawDatabaseMaintenanceScope();if(t&&hasAdmittedMaintenanceLiveAuthorityReads(t,e))return false;let n=isArtifactPreservingStateRead(`shared`,e)&&!isUpdateRehearsalPrivateDatabase(e,process.env)&&!disposableStateReads.getStore()?.some(t=>t.active&&t.path===e);try{n&&=!hasVerifiedLiveSqliteOwner(e)}catch(e){if(!(e instanceof GatewayLockNamespaceError))throw e}if(n)assertStateFileSnapshotAllowed();return n}const synchronousReadSnapshots=resolveGlobalSingleton(Symbol.for(`openclaw.synchronousStateReadSnapshots`),()=>({current:void 0}));function resolveOpenClawStateReadPath(e){const t=resolveDatabasePath(e);assertOpenClawStateReadPathCurrent(t);return t}function assertOpenClawStateReadPathCurrent(e){const t=stateSnapshotReads.getStore();const n=disposableStateReads.getStore();if(t||n?.length)assertRetainedReadScopeAdmission(e,[t,...n??[]]);isExistingOpenClawStateSchema(e)}function withOpenClawStateDatabaseReadOnlyIfOpen(e,t,n=false){const r=stateSnapshotReads.getStore();if(r?.active&&r.path===t){openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(t,r.env);const n=r.readSource();if(n)return{reused:true,value:readRetainedStateSnapshot(r,n,e)}}if(isArtifactPreservingStateRead(`agent`,t)&&(requiresArtifactPreservingSnapshot(t)||isUpdateRehearsalPrivateDatabase(t,process.env))||isStatePostgres()&&!n)return{reused:false};return withCachedOpenClawStateDatabaseReadOnly(e,t,n||synchronousReadSnapshots.currentAuthorityPath===t)}function withFreshOpenClawStateDatabaseReadOnly(e,t,n){const r=t.env??process.env;openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(n,r);if(synchronousReadSnapshots.currentAuthorityPath===n){const t=withMaintenanceOpenClawStateDatabaseReadOnly(e,n);if(t.reused)return t.value}const i=synchronousReadSnapshots.current;if(i&&requiresArtifactPreservingSnapshot(n)){let t=i.get(n);if(!t){t=openOpenClawStateReadOnlyLocation(n,prepareSqliteReadOnlyLocationSync(n,void 0,REUSE_IMAGE));i.set(n,t)}assertStateReadSchema(t.database.db,n);const r=e(t.database);if(isPromiseLike(r))throw new SqliteCoordinatorError(`SQLite metadata snapshot read must remain synchronous`);return r}const a=requiresArtifactPreservingSnapshot(n)?prepareSqliteReadOnlyLocationSync(n,void 0,REUSE_IMAGE):void 0;return withOpenClawStateReadOnlyLocation(e,n,a??n,void 0,void 0,void 0,!isMainThread&&!getOpenClawDatabaseMaintenanceScope())}function withExistingOpenClawStateDatabaseReadOnly(e,t={}){const n=resolveOpenClawStateReadPath(t);if(synchronousReadSnapshots.current?.has(n))return withFreshOpenClawStateDatabaseReadOnly(e,t,n);const r=withOpenClawStateDatabaseReadOnlyIfOpen(e,n);if(r.reused)return r.value;const i=existingPathOrUndefined(n);return i===void 0?void 0:withFreshOpenClawStateDatabaseReadOnly(e,t,i)}function executeExistingOpenClawStateRead(e,t,n={}){const r=t.type;const{context:i,current:a,live:o,mapError:s}=n;const c={phase:`before-read`};let l;try{i?.admission.assertCurrent();const execute=()=>startRetainedOpenClawStateRead(e,t,c,n);const r=o?()=>artifactPreservingReads.run(false,()=>exitStateReadSnapshot(execute)):a?()=>exitStateReadSnapshot(execute):execute;l=runPluginSharedStateWork(()=>i?.runInCapturedSchemaScope?i.runInCapturedSchemaScope(r):r())}catch(e){throw s?s(e,c.phase):e}return l.then(e=>{if(!e||isStateReadReply(e,r))return e;throw new Error(`Unexpected shared-state read reply for ${r}`)})}function startRetainedOpenClawStateRead(e,t,n,{context:r,signal:i,current:a,live:o,mapError:s,preferIndependentWarmRead:c,snapshotPreparation:l,onChunk:u,onChunkAsync:d}){const f=a||o;const p=resolveOpenClawStateReadPath(e);const m=stateSnapshotReads.getStore();const h=m?.active&&m.path===p?m:void 0;const g=[...h?[h]:[],...(disposableStateReads.getStore()??[]).filter(e=>e.active&&e.path===p)];const _=h?.env??e.env;const v=r??captureOpenClawStateReadWorkerContext({path:p,env:_});if(r){if(v.admission.databasePath!==p)throw new Error(`Shared-state read context does not match its selected source`);v.maintenanceScope?.assertAdmission();v.admission.assertCurrent()}const y=requiresArtifactPreservingSnapshot(p);const b=new AbortController;const x=i??(isArtifactPreservingStateRead()?resolveStateReadCallerSignal():h?.callerSignal);const S=x?AbortSignal.any([x,b.signal]):b.signal;const run=()=>{const e=f?void 0:synchronousReadSnapshots.current?.get(p)?.snapshotSource?.retain();const start=()=>startOpenClawStateReadOperation(t,{pathname:p,snapshot:e??h?.readSource(),scopes:g,context:v,preserveArtifacts:y,preferIndependentWarmRead:c,snapshotPreparation:l,onChunk:u,onChunkAsync:d,controller:b,signal:S,callerSignal:x,receipt:n,mapError:s});if(h?.prepareSource&&!e){S.throwIfAborted();return h.prepareSource().then(()=>{if(S.aborted)throw s?s(S.reason,n.phase):S.reason;return start()},e=>{throw s?s(e,n.phase):e})}return start()};const C=g.reduceRight((e,t)=>()=>t.work.run(()=>{const n=e();t.work.track(()=>n).catch(()=>void 0);return n}),run);const w=v.maintenanceScope;let T;if(w)w.run(()=>{const e=C();T=e;return e});else T=C();if(!T)throw new Error(`Shared-state read maintenance scope did not start its operation`);retainSnapshotWork(T,()=>b.abort(/* @__PURE__ */ new Error(`Shared-state read admission closed`)));return T}function withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync(e,t={}){return withArtifactPreservingStateReads(async()=>{const n=resolveOpenClawStateReadPath(t);const r=stateSnapshotReads.getStore();if(r?.path===n&&r.prepareSource&&!isStatePostgres())return r.work.track(async()=>{await r.prepareSource();resolveStateReadCallerSignal()?.throwIfAborted();const t=withEngineStoreAdmission(()=>withOpenClawStateDatabaseReadOnlyIfOpen(e,n));return t.reused?t.value:void 0});const i=withEngineStoreAdmission(()=>withOpenClawStateDatabaseReadOnlyIfOpen(e,n));if(i.reused)return i.value;if(existingPathOrUndefined(n)===void 0)return;const a=t.env??process.env;openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(n,a);if(!requiresArtifactPreservingSnapshot(n))return withEngineStoreAdmission(()=>withOpenClawStateReadOnlyLocation(e,n,n));const o=await prepareSqliteReadOnlyLocation(n,{preserveSourceArtifacts:true,reuse:true});try{openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(n,a)}catch(e){o.cleanup();throw e}return withEngineStoreAdmission(()=>withOpenClawStateReadOnlyLocation(e,n,o))})}
//!src/state/openclaw-agent-db-registry-listing.ts
const registry=resolveGlobalSingleton(Symbol.for(`openclaw.agentDatabaseRegistryMemo`),()=>({pending:/* @__PURE__ */ new Map,publications:/* @__PURE__ */ new WeakSet}));function activateRegisteredAgentDatabasesMemo(e){const t=resolveDatabasePath(e);if(registry.memo?.pathname!==t)registry.memo={pathname:t,token:Symbol(t)};return registry.memo}function cloneRegisteredAgentDatabases(e,t){const n=e.map(e=>({...e}));return t.includeIncompatibleSchemaVersions?n:n.filter(e=>e.schemaVersion===42)}var AgentDatabaseRegistryChangedError=class extends Error{constructor(e=`Agent database registry changed during discovery; retry the read.`){super(e);this.name=`AgentDatabaseRegistryChangedError`}};function readRegisteredAgentDatabases(e,t){const n=resolveDatabasePath(e);const read=({db:e})=>readRegisteredAgentDatabaseRows(e,n,t);const finish=t=>{if(t===void 0){if(hasUnavailableMissingSqlitePath(n))throw new Error(`OpenClaw state database ${n} is unavailable.`);return[]}return e.includeIncompatibleSchemaVersions?t:t.filter(e=>e.schemaVersion===42)};return t?withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync(read,e).then(finish):finish(withExistingOpenClawStateDatabaseReadOnly(read,e))}function listOpenClawRegisteredAgentDatabases(e={}){const t=activateRegisteredAgentDatabasesMemo(e);return cloneRegisteredAgentDatabases(t.entries??=readRegisteredAgentDatabases({...e,includeIncompatibleSchemaVersions:true},false),e)}function createRegistrySnapshotReader(e,t,n,r){const i=AsyncLocalStorage.snapshot();return async a=>{for(;;){a?.throwIfAborted();const o=n();const{memo:s,assertCurrent:c,followRegistration:l}=o;const u=t?c:r;u();let d=e.fresh?void 0:s.entries;if(!d){const n=(await i(()=>executeExistingOpenClawStateRead(e,{type:`agentDatabaseRegistry.read`},{signal:a,current:e.fresh})))?.result;if(!t&&s.next)continue;o.acceptEntries(n?.status===`available`?n.entries:[]);u();if(n?.status===`unavailable`||n===void 0&&hasUnavailableMissingSqlitePath(e.path))return{result:{status:`unavailable`},assertCurrent:c,followRegistration:l};d=e.fresh?n?.entries??[]:s.entries??=n?.entries??[]}return{result:{status:`available`,entries:cloneRegisteredAgentDatabases(d,e)},assertCurrent:c,followRegistration:l}}}}function prepareOpenClawAgentDatabaseRegistrySnapshotRead(e={},t){try{const n=cloneEnvWithPlatformSemantics(e.env??process.env);n.OPENCLAW_STATE_DIR=resolveStateDir(n);const r={...e,env:n,path:resolveDatabasePath({...e,env:n})};const i=captureOpenClawStateReadContext(r.path).admission.assertCurrent;const captureWitness=()=>{const e=activateRegisteredAgentDatabasesMemo(r);let n=e;let a=false;let o=e.entries;const s=/* @__PURE__ */ new Set;const unchanged=e=>{if(!e||!t)return false;return t(e,o)};const assertCurrent=()=>{i();const e=registry.memo;if(a)throw new AgentDatabaseRegistryChangedError;if((t?[...registry.pending.values()].filter(e=>e.pathname===r.path&&!s.has(e.operation)&&!unchanged(e.mutation)):[]).length>0)throw new AgentDatabaseRegistryChangedError(`Agent database registry ownership is changing during discovery`);while(n!==e){const e=n.next;if(!t||!e?.transition||e.transition.phase===`commit`&&!unchanged(e.transition.mutation)){a=true;throw new AgentDatabaseRegistryChangedError}n=e}};const followRegistration=e=>{i();if(a||registry.memo?.pathname!==n.pathname){a=true;throw new Error(`Agent registration cannot replace an invalidated registry read`)}let t=n;while(t.token!==e.current&&t.next)t=t.next;if(t.token===e.current)while(n.token!==e.previous&&n.token!==e.current){const e=n.next;if(!e?.transition||e.transition.phase===`commit`&&!unchanged(e.transition.mutation)){a=true;throw new Error(`Agent registration cannot replace an invalidated registry read`)}n=e}const r=n.token===e.current?n:n.next;if(n.token!==e.previous&&n.token!==e.current||r?.token!==e.current){if(e.current!==registry.memo.token)return;a=true;throw new Error(`Agent registration cannot replace an invalidated registry read`)}const o=r.transition?.operation;if(o)s.add(o);n=r};return{memo:e,assertCurrent,followRegistration,acceptEntries(e){o=e}}};const a=t?captureWitness():void 0;let o=a;return{assertAdmissionCurrent:i,assertCurrent:()=>(o?.assertCurrent??i)(),followRegistration(e){if(!o)throw new Error(`Agent registration requires a captured registry witness`);o.followRegistration(e)},read:createRegistrySnapshotReader(r,a,()=>{return o=a??captureWitness()},i)}}catch(e){const rethrow=()=>{throw e};return{assertAdmissionCurrent:rethrow,assertCurrent:rethrow,followRegistration:rethrow,read:async()=>rethrow()}}}export{createSqliteWalReclamationResult as $,agentColdArchiveChunksPostgresMigration as $t,isOpenClawStateStartupRepairableSchemaIssue as A,withoutTrajectoryPayloadColumns as At,backfillCronRunLogEntryJson as B,assertCurrentAgentSchemaMetadata as Bt,runStateSchemaMigrationTransaction as C,CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS as Ct,OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY as D,migrateSingletonStateFoldInV12 as Dt,resolveSchemaMigrationIntegrityTables as E,createStateConfigMachineTable as Et,StateSchemaMutationConflictError as F,withLegacyAgentMemoryRevisionTriggers as Ft,coerceRequiredSqliteNumber as G,agentDatabaseMaintenanceAuthority as Gt,ensureOperatorApprovalResolutionRefs as H,agentSchemaMetadataKey as Ht,withStateDatabaseSchemaMaintenance as I,withLegacyAgentPostgresMemoryRevisionTriggers as It,migratePredicateColumnsV21 as J,agentCreationOperationsPostgresMigration as Jt,normalizeSqliteNumber as K,assertAgentDatabaseMaintenanceAuthority as Kt,withStateDatabaseSchemaMaintenanceAsync as L,AGENT_INDEX_RETIREMENT_SQL as Lt,assertOpenClawStateWriteAllowed as M,withoutAgentPostgresToolUsage as Mt,inspectOpenClawStateOwnershipFromDatabase as N,withoutAgentToolUsage as Nt,STATE_RUNTIME_SCHEMA_COMPATIBILITY as O,AGENT_TRAJECTORY_STORAGE_POSTGRES_MIGRATION_SQL as Ot,isOpenClawStateWriteContentionError as P,AGENT_MEMORY_REVISION_POSTGRES_SQL as Pt,hasLegacyCronRunLogs as Q,withoutAgentPostgresColdNavigation as Qt,backfillAcpReplayEstimatedBytes as R,withLegacyAgentIndexes as Rt,openClawStateMigrationAssertions as S,readStateSchemaContentVersion as St,writeCurrentStateSchemaMetadata as T,ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS as Tt,repairLegacySubagentExecutionPayloads as U,publishAgentSchemaMetadata as Ut,backfillDeliveryQueueEntriesFromEntryJson as V,assertSupportedAgentSchemaVersion as Vt,repairLegacySubagentRetainedResults as W,readExistingAgentSchemaMeta as Wt,CLIENT_CREDENTIAL_SOURCE_TABLES as X,withoutAgentPostgresCreationOperations as Xt,CLIENT_CREDENTIAL_SCHEMA_SQL as Y,withoutAgentCreationOperations as Yt,mayShareAgentDatabaseFile as Z,agentColdNavigationPostgresMigration as Zt,assertOpenClawStateDatabaseForMaintenance as _,logRetiredStateTableMigration as _t,withExistingOpenClawStateDatabaseReadOnly as a,postgresIndexOrderingMigration as an,openExistingStatePostgresConnection as at,markCurrentStateSchemaVersion as b,admitStateSchemaFacts as bt,prepareSqliteDatabaseDirectory as c,isOpenClawAgentDatabasePathCurrent as cn,readStateSchemaPublicationBlocker as ct,assertExistingOpenClawStateRuntimeSchema as d,safeParseJsonRecord as dn,readRegisteredAgentDatabaseRows as dt,withoutAgentColdArchiveChunks as en,admitStatePostgres as et,assertStateDatabaseSchemaAdmission as f,assertCanonicalStateSchemaShape as ft,assertMigratedStateTableIntegrity as g,repairLegacyGatewayRestartHandoffsForStrictMigration as gt,isOpenClawStateSchemaFastPathEligible as h,migrateWorkerPlacementExecutionModeSchema as ht,getActiveOpenClawStateDatabaseReadSnapshotAsync as i,withoutAgentPostgresActiveEventFacts as in,isStatePostgres as it,getOpenClawStateRuntimeSchema as j,agentToolUsagePostgresMigration as jt,isOpenClawStateFirstUseSchemaIssue as k,withLegacyAgentPostgresTrajectoryStorage as kt,runManagedStateTransaction as l,readOpenClawAgentDatabaseIdentity as ln,stateEngineInput as lt,assertNoLegacyStateRuntimeRepair as m,migrateAgentDatabaseRelativePaths as mt,prepareOpenClawAgentDatabaseRegistrySnapshotRead as n,agentActiveEventFactsPostgresMigration as nn,ensureStatePostgresFragment as nt,configureSqliteConnectionPragmas as o,withLegacyPostgresIndexOrdering as on,stateEngineSchema as ot,assertCurrentStateRuntimeSchema as p,dropLegacyStateTables as pt,migrateHistoricalStateImports as q,SESSION_PARTICIPANTS_TABLE as qt,executeExistingOpenClawStateRead as r,withoutAgentActiveEventFacts as rn,inspectStateSqlite as rt,configureSqlitePreSchemaPragmas as s,agentDatabaseBorrowers as sn,advanceStateSchemaContentVersion as st,listOpenClawRegisteredAgentDatabases as t,withoutAgentPostgresColdArchiveChunks as tn,assertStateFileSnapshotAllowed as tt,readOnlyStateDatabase as u,safeParseJson as un,readAgentDatabasePreflightTargets as ut,assertOpenClawStateDatabaseOwner as v,runRetiredStateTableMigrations as vt,versionedStateMigrations as w,CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS as wt,migrateBoundedStateSchema as x,assertSupportedStateSchemaVersion as xt,executeCanonicalStateSchema as y,migrateSessionWatchCursorProvenance as yt,backfillCronJobsFromJobJson as z,withLegacyAgentPostgresIndexes as zt};