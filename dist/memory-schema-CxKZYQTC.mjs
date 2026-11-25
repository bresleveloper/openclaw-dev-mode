import{r as sqlPublicationAnchor}from"./sql-connection-nx8lLUJM.mjs";import{T as publishSqliteDatabaseAdmission,s as getSqliteDatabaseAdmission}from"./sqlite-database-admission-BVeAafOy.mjs";import{s as stageSqliteTransactionState}from"./sqlite-post-commit-B3i080eT.mjs";import{i as canReuseSqliteSchemaInTransaction,o as getAdmittedSqliteSchemaFacts}from"./sqlite-schema-facts-Edd-ttp_.mjs";import{a as tableExists$2}from"./openclaw-state-db-schema-helpers-4Hs1ye38.mjs";import{a as runSqliteImmediateTransactionSync}from"./sqlite-transaction-mUAqxIBY.mjs";import{t as createSqliteTableContractReader}from"./sqlite-schema-catalog-CLvN7hW4.mjs";import{t as readGeneratedSqliteCatalog}from"./sqlite-catalogs-Cqxc9n39.mjs";import{a as MEMORY_INDEX_SOURCES_TABLE,c as backfillMemoryPathFtsRows,d as dropMemoryPathFtsTriggers,f as ensureMemoryChunkFtsTriggers,h as reconcileMemoryChunkFtsRows,i as MEMORY_INDEX_PATHS_FTS_TABLE,l as dropDisabledMemoryFts,m as rebuildMemoryChunkFts,n as MEMORY_INDEX_CHUNKS_TABLE$1,p as ensureMemoryPathFtsTriggers,r as MEMORY_INDEX_FTS_TABLE,s as admitSqliteMemoryTextSearch,t as MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS,u as dropMemoryChunkFtsTriggers}from"./sqlite-search-schema-Dl6KE-j6.mjs";import{t as assertSqliteSchemaContains}from"./sqlite-schema-contract-DWWs0_IS.mjs";import{n as migrateSqliteSchemaToStrict,r as migrateSqliteSchemaToStrictInTransaction}from"./sqlite-strict-sjVHUlvM.mjs";import{t as createSqliteSchemaEnsurer}from"./sqlite-schema-ensure-C9ABVm7H.mjs";import{t as formatErrorMessage}from"./error-utils-Ok9_VTaX.mjs";import{n as encodeMemoryEmbedding,t as decodeMemoryEmbedding}from"./embedding-vector-Nn3j1kf3.mjs";
//!packages/memory-host-sdk/src/host/memory-schema-provenance.ts
const MEMORY_INDEX_CHUNK_PROVENANCE_TABLE=`memory_index_chunk_provenance`;const MEMORY_INDEX_CHUNK_PROVENANCE_SCHEMA_SQL=`
  CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_CHUNK_PROVENANCE_TABLE} (
    chunk_id TEXT PRIMARY KEY,
    origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),
    session_kind TEXT NOT NULL CHECK (session_kind IN ('interactive', 'cron', 'heartbeat', 'subagent', 'unknown')),
    observed_at INTEGER NOT NULL,
    supersedes_key TEXT,
    FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE
  ) STRICT;
`;const ensureProvenanceTable=createSqliteSchemaEnsurer(()=>MEMORY_INDEX_CHUNK_PROVENANCE_SCHEMA_SQL,{tables:[MEMORY_INDEX_CHUNK_PROVENANCE_TABLE]});const retiredProvenanceTrigger=`memory_index_chunk_provenance_after_insert`;const missingChunkIdsSql=`
  SELECT chunk.id
  FROM memory_index_chunks AS chunk
  LEFT JOIN ${MEMORY_INDEX_CHUNK_PROVENANCE_TABLE} AS provenance
    ON provenance.chunk_id = chunk.id
  WHERE provenance.chunk_id IS NULL
`;function ensureMemoryChunkProvenance(e){const ensure=()=>{const t=getAdmittedSqliteSchemaFacts(e);if(t?t.triggers.has(retiredProvenanceTrigger):createSqliteTableContractReader(e)(`memory_index_chunks`)?.triggers.some(({name:e})=>e===retiredProvenanceTrigger))e.exec(`DROP TRIGGER ${retiredProvenanceTrigger}`);ensureProvenanceTable(e);backfillMemoryChunkProvenance(e)};if(e.isTransaction){ensure();return}runSqliteImmediateTransactionSync(e,ensure)}function backfillMemoryChunkProvenance(e){const backfill=()=>{const t=e.prepare(`
      WITH missing AS MATERIALIZED (${missingChunkIdsSql}),
      affected AS MATERIALIZED (
        SELECT chunk.path, chunk.source
        FROM missing
        CROSS JOIN memory_index_chunks AS chunk ON chunk.id = missing.id
      )
      UPDATE memory_index_sources
      SET hash = ''
      WHERE EXISTS (
        SELECT 1
        FROM affected
        WHERE affected.path = memory_index_sources.path
          AND affected.source IS memory_index_sources.source
      )
    `).run().changes;e.exec(`
      WITH missing AS MATERIALIZED (${missingChunkIdsSql})
      INSERT OR IGNORE INTO ${MEMORY_INDEX_CHUNK_PROVENANCE_TABLE} (
        chunk_id, origin_class, session_kind, observed_at
      )
      SELECT chunk.id, 'untrusted', 'unknown', chunk.updated_at
      FROM missing
      JOIN memory_index_chunks AS chunk ON chunk.id = missing.id;
    `);if(t>0)e.exec(`UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1`)};if(e.isTransaction){backfill();return}runSqliteImmediateTransactionSync(e,backfill)}
//!packages/memory-host-sdk/src/host/memory-schema-recall.ts
const MEMORY_INDEX_CHUNKS_TABLE=`memory_index_chunks`;const MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE=`memory_index_chunk_recall_metadata`;const MEMORY_INDEX_CHUNK_RECALL_METADATA_SCHEMA_SQL=`
  CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE} (
    chunk_id TEXT PRIMARY KEY,
    importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10),
    triggers TEXT,
    project_key TEXT,
    FOREIGN KEY (chunk_id) REFERENCES ${MEMORY_INDEX_CHUNKS_TABLE}(id) ON DELETE CASCADE
  ) STRICT;
`;function readMemoryChunkColumns(e){const t=e.prepare(`PRAGMA table_info(${MEMORY_INDEX_CHUNKS_TABLE})`).all();return new Set(t.flatMap(e=>typeof e.name===`string`?[e.name]:[]))}function tableExists$1(e,t){return Boolean(e.prepare(`SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ? LIMIT 1`).get(t))}function legacyRecallMetadataColumns(e){const t=readMemoryChunkColumns(e);return[`importance`,`triggers`,`project_key`].filter(e=>t.has(e))}function hasLegacyMemoryRecallMetadataColumns(e){return legacyRecallMetadataColumns(e).length>0}function ensureMemoryRecallMetadataSchema(e){if(legacyRecallMetadataColumns(e).length===0&&tableExists$1(e,`memory_index_chunk_recall_metadata`))return;const ensure=()=>{e.exec(MEMORY_INDEX_CHUNK_RECALL_METADATA_SCHEMA_SQL);const t=new Set(legacyRecallMetadataColumns(e));if(t.size===0)return;const n=t.has(`importance`)?`importance`:`NULL`;const r=t.has(`triggers`)?`triggers`:`NULL`;const i=t.has(`project_key`)?`project_key`:`NULL`;e.exec(`
      INSERT INTO ${MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE} (
        chunk_id, importance, triggers, project_key
      )
      SELECT id, ${n}, ${r}, ${i}
      FROM ${MEMORY_INDEX_CHUNKS_TABLE}
      WHERE ${n} IS NOT NULL
         OR ${r} IS NOT NULL
         OR ${i} IS NOT NULL
      ON CONFLICT(chunk_id) DO UPDATE SET
        importance=excluded.importance,
        triggers=excluded.triggers,
        project_key=excluded.project_key;
    `);for(const n of[`project_key`,`triggers`,`importance`])if(t.has(n))e.exec(`ALTER TABLE ${MEMORY_INDEX_CHUNKS_TABLE} DROP COLUMN ${n}`)};if(e.isTransaction){ensure();return}runSqliteImmediateTransactionSync(e,ensure)}
//!packages/memory-host-sdk/src/host/memory-schema-base.ts
const MEMORY_INDEX_META_TABLE=`memory_index_meta`;const MEMORY_EMBEDDING_CACHE_TABLE=`memory_embedding_cache`;const MEMORY_INDEX_STATE_TABLE=`memory_index_state`;const MEMORY_INDEX_VECTOR_TABLE=`memory_index_chunks_vec`;const MEMORY_INDEX_CHUNKS_SCHEMA_SQL=`
  CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_CHUNKS_TABLE$1} (
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
`;function buildMemoryEmbeddingCacheSchema(e){return`
    CREATE TABLE IF NOT EXISTS ${e} (
      provider TEXT NOT NULL,
      model TEXT NOT NULL,
      provider_key TEXT NOT NULL,
      hash TEXT NOT NULL,
      embedding BLOB NOT NULL,
      dims INTEGER,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (provider, model, provider_key, hash)
    ) STRICT;
  `}const MEMORY_INDEX_DERIVED_TABLES=[MEMORY_INDEX_VECTOR_TABLE,MEMORY_INDEX_FTS_TABLE,MEMORY_INDEX_PATHS_FTS_TABLE,MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE,MEMORY_INDEX_CHUNK_PROVENANCE_TABLE,MEMORY_INDEX_CHUNKS_TABLE$1,MEMORY_INDEX_SOURCES_TABLE,MEMORY_INDEX_META_TABLE,MEMORY_EMBEDDING_CACHE_TABLE,MEMORY_INDEX_STATE_TABLE];function buildMemoryIndexStrictSchema(e){const t=e.includeEmbeddingCache?buildMemoryEmbeddingCacheSchema(e.embeddingCacheTable):``;return`
    CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_META_TABLE} (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    ) STRICT;
    CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_SOURCES_TABLE} (
      id INTEGER PRIMARY KEY,
      path TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'memory',
      hash TEXT NOT NULL,
      mtime REAL NOT NULL,
      size INTEGER NOT NULL,
      UNIQUE (path, source)
    ) STRICT;
    ${MEMORY_INDEX_CHUNKS_SCHEMA_SQL}
    ${MEMORY_INDEX_CHUNK_RECALL_METADATA_SCHEMA_SQL}
    ${MEMORY_INDEX_CHUNK_PROVENANCE_SCHEMA_SQL}
    CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_STATE_TABLE} (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      revision INTEGER NOT NULL
    ) STRICT;
    ${t}
  `}const LEGACY_CHUNK_SCHEMA=`
  CREATE TABLE IF NOT EXISTS memory_index_chunks (
    id TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'memory',
    start_line INTEGER NOT NULL,
    end_line INTEGER NOT NULL,
    hash TEXT NOT NULL,
    model TEXT NOT NULL,
    text TEXT NOT NULL,
    embedding TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  ) STRICT;
`;function legacyCacheSchema(e){return`CREATE TABLE IF NOT EXISTS ${e} (
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    provider_key TEXT NOT NULL,
    hash TEXT NOT NULL,
    embedding TEXT NOT NULL,
    dims INTEGER,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (provider, model, provider_key, hash)
  ) STRICT;`}const MEMORY_CHUNK_STORAGE_INDEXES=[{name:`idx_memory_index_chunks_path_source`,columns:`path, source`},{name:`idx_memory_index_chunks_path`,columns:`path`},{name:`idx_memory_index_chunks_source`,columns:`source`}];const MEMORY_INLINE_RECALL_COLUMNS=[[`importance`,`importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10)`],[`triggers`,`triggers TEXT`],[`project_key`,`project_key TEXT`]];function buildMemoryStorageSchema(e){let t=e.chunks?e.legacy?LEGACY_CHUNK_SCHEMA:MEMORY_INDEX_CHUNKS_SCHEMA_SQL:e.legacy?legacyCacheSchema(e.table):buildMemoryEmbeddingCacheSchema(e.table);const n=MEMORY_INLINE_RECALL_COLUMNS.filter(([t])=>e.inlineRecallColumns?.includes(t));if(e.chunks&&n.length>0)t=t.replace(`updated_at INTEGER NOT NULL`,`updated_at INTEGER NOT NULL,\n${n.map(([,e])=>e).join(`,
`)}`);if(!e.strict)t=t.replace(`) STRICT;`,`);`);return t+memoryStorageIndexes(e.table,e.chunks).map(t=>`CREATE INDEX ${t.name} ON ${e.table}(${t.columns});`).join(`
`)}function memoryStorageIndexes(e,t){return t?MEMORY_CHUNK_STORAGE_INDEXES:[{name:e===`memory_embedding_cache`?`idx_memory_embedding_cache_updated_at`:`idx_embedding_cache_updated_at`,columns:`updated_at`}]}
//!packages/memory-host-sdk/src/host/memory-schema-catalog.ts
function memorySchemaSource(e,t){if(t===`memory_embedding_cache`)return e;const n=readGeneratedSqliteCatalog(e);if(!n)throw new Error(`Memory schema has no generated catalog; run pnpm db:postgres:gen.`);const rename=e=>e.replaceAll(MEMORY_EMBEDDING_CACHE_TABLE,t);return{views:n.views,tables:n.tables.map(e=>e.name!==`memory_embedding_cache`?e:{...e,name:t,sql:e.sql===null?null:rename(e.sql),indexes:e.indexes.map(e=>({...e,name:e.name===`idx_memory_embedding_cache_updated_at`?`idx_embedding_cache_updated_at`:rename(e.name),sql:e.sql===null?null:rename(e.sql).replace(`idx_${t}_updated_at`,`idx_embedding_cache_updated_at`)}))})}}
//!packages/memory-host-sdk/src/host/memory-schema-storage-migration.ts
const LEGACY_CHUNK_REVISION_TRIGGERS=[`insert`,`update`,`delete`].map(e=>({name:`memory_index_chunks_revision_after_${e}`,sql:`CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_${e}
    AFTER ${e.toUpperCase()} ON memory_index_chunks
    BEGIN UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1; END;`}));function storageShape(e,t,n,r){const i=columns(e,t);if(i.size===0)return`absent`;const a=i.get(`embedding`)===`TEXT`?`legacy`:i.get(`embedding`)===`BLOB`?`binary`:void 0;if(!a||n&&i.has(`chunk_rowid`)!==(a===`binary`))throw new Error(`Unsupported partial memory storage schema: ${t}`);const o=a!==`legacy`||e.prepare(`SELECT strict FROM pragma_table_list WHERE schema = 'main' AND name = ?`).get(t)?.strict!==0;const s=memoryStorageIndexes(t,n);const c=buildMemoryStorageSchema({table:n?t:MEMORY_EMBEDDING_CACHE_TABLE,chunks:n,legacy:a===`legacy`,strict:o,inlineRecallColumns:MEMORY_INLINE_RECALL_COLUMNS.filter(([e])=>i.has(e)).map(([e])=>e)});assertSqliteSchemaContains(e,`memory storage ${t}`,memorySchemaSource(c,n?MEMORY_EMBEDDING_CACHE_TABLE:t),{allowCompatibleAdditiveColumns:a===`binary`,allowedMissingIndexes:s.map(e=>e.name),optionalCanonicalTriggerGroups:n?[{tableName:t,triggers:LEGACY_CHUNK_REVISION_TRIGGERS},{tableName:t,triggers:MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS}]:[]},r);if(a===`legacy`)assertKnownRebuildDependents(e,t,s.map(e=>e.name),n?[...LEGACY_CHUNK_REVISION_TRIGGERS.map(e=>e.name),...MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS.map(e=>e.name)]:[]);return a}function assertKnownRebuildDependents(e,t,n,r){const i=/* @__PURE__ */ new Set([...n,...r]);const a=e.prepare(`
    SELECT type, name, tbl_name FROM main.sqlite_schema
    WHERE (type IN ('trigger', 'index') AND tbl_name = ? AND sql IS NOT NULL)
       OR (type IN ('view', 'trigger') AND instr(lower(sql), ?) > 0)
  `).all(t,t).find(e=>e.tbl_name!==t||!i.has(String(e.name)));if(a)throw new Error(`Memory storage migration cannot rebuild unknown ${String(a.type)} ${String(a.name)} on ${t}`);for(const n of e.prepare(`SELECT name FROM main.sqlite_schema WHERE type = 'table'`).all()){const r=String(n.name);const i=e.prepare(`PRAGMA main.foreign_key_list("${r.replaceAll(`"`,`""`)}")`).all().filter(e=>e.table===t);const a=t===`memory_index_chunks`&&[`memory_index_chunk_provenance`,`memory_index_chunk_recall_metadata`].includes(r);if(i.some(e=>!a||e.from!==`chunk_id`||e.to!==`id`||e.on_delete!==`CASCADE`||e.on_update!==`NO ACTION`))throw new Error(`Memory storage migration cannot rebuild ${t} referenced by an unknown foreign key in ${r}`)}}function storageShapes(e,t){const n=canReuseSqliteSchemaInTransaction(e)?createSqliteTableContractReader(e):void 0;return{chunks:storageShape(e,`memory_index_chunks`,true,n),cache:storageShape(e,t,false,n)}}function assertBinaryEmbeddings(e,t){const n=e.prepare(`SELECT openclaw_memory_embedding_blob_valid(embedding) AS valid FROM ${t}`);for(const e of n.iterate())if(e.valid===0)throw new Error(`Memory storage migration found invalid binary embeddings in ${t}`)}function copyMemoryStorageRows(e,t,n){const r=e.prepare(`SELECT rowid AS storage_rowid FROM ${t}`);r.setReadBigInts(true);const i=e.prepare(n);i.setReadBigInts(true);for(const e of r.iterate()){if(typeof e.storage_rowid!==`bigint`)throw new Error(`Invalid memory storage identity during migration`);i.run(e.storage_rowid)}}function markInvalidMemoryEmbeddings(e,t){const n=e.prepare(t);n.setReadBigInts(true);const r=e.prepare(`
    UPDATE main.memory_index_sources SET hash = ''
    WHERE (path, source) IN (
      SELECT path, source FROM main.memory_index_chunks WHERE rowid = ?
    )`);r.setReadBigInts(true);let i=false;for(const e of n.iterate())if(e.valid===0){if(typeof e.storage_rowid!==`bigint`)throw new Error(`Invalid memory storage identity during migration`);r.run(e.storage_rowid);i=true}if(i){e.exec(`
      INSERT INTO main.memory_index_meta (key, value)
      VALUES ('memory_vector_rebuild_v1', '1')
      ON CONFLICT(key) DO UPDATE SET value = excluded.value;
    `);if(tableExists$2(e,`memory_index_state`))e.exec(`UPDATE main.memory_index_state SET revision = revision + 1 WHERE id = 1`)}}function legacyEmbedding(e){if(typeof e!==`string`)return;try{const t=JSON.parse(e);return Array.isArray(t)&&t.every(e=>typeof e===`number`&&Number.isFinite(e))?t:void 0}catch{return}}function copyLegacyMemoryEmbeddingCache(e,t,n,r){const i=1048576;const a=e.prepare(`
    SELECT rowid AS storage_rowid,
      CASE WHEN length(CAST(embedding AS BLOB)) <= ${i}
        THEN embedding ELSE NULL END AS embedding
    FROM ${t} WHERE rowid >= ? ORDER BY rowid LIMIT 128
  `);a.setReadBigInts(true);const o=e.prepare(`
    INSERT INTO ${n} (rowid, provider, model, provider_key, hash, embedding, dims, updated_at)
    SELECT rowid, provider, model, provider_key, hash, ?, dims, updated_at
    FROM ${t} WHERE rowid = ?
  `);o.setReadBigInts(true);let s=-9223372036854775808n;let c=0;const l=[];while(s<=9223372036854775807n){let e=0;for(const t of a.iterate(s)){if(typeof t.storage_rowid!==`bigint`)throw new Error(`Invalid memory storage identity during migration`);r();s=t.storage_rowid+1n;e+=1;const n=legacyEmbedding(t.embedding??null);if(n===void 0){c+=1;if(l.length<8)l.push(String(t.storage_rowid));continue}o.run(encodeMemoryEmbedding(n),t.storage_rowid)}if(e<128)break}return c>0?`Skipped ${c} ${t} rows with invalid embeddings or embeddings larger than ${i} bytes (first rowids: ${l.join(`, `)}). These cache entries will be rebuilt on demand.`:void 0}function registerMemoryEmbeddingMigrationFunctions(e,t){let n=Number.NEGATIVE_INFINITY;const renew=()=>{if(!t)return;if(performance.now()-n>=1e3){t();n=performance.now()}};e.function(`openclaw_memory_embedding_from_json`,{deterministic:true},e=>{renew();return encodeMemoryEmbedding(legacyEmbedding(e)??[])});e.function(`openclaw_memory_embedding_json_valid`,{deterministic:true},e=>{renew();return Number(legacyEmbedding(e)!==void 0)});e.function(`openclaw_memory_embedding_blob_valid`,{deterministic:true},e=>{renew();return Number(e instanceof Uint8Array&&e.byteLength%8===0&&decodeMemoryEmbedding(e).length*8===e.byteLength)});return renew}function existingStorageObjects(e,t){return e.prepare(`SELECT sql FROM main.sqlite_schema
    WHERE tbl_name = ? AND type IN ('index', 'trigger') AND sql IS NOT NULL
    ORDER BY type, name`).all(t).map(e=>String(e.sql))}function replaceStorageTable(e,t,n){e.exec(`
    DROP TABLE ${t};
    ALTER TABLE ${t}_storage_migration RENAME TO ${t};
  `);for(const t of n)e.exec(t)}function markInvalidImportedMemoryEmbeddings(e,t){if(!/^[A-Za-z_][A-Za-z0-9_]*$/u.test(t))throw new Error(`Invalid legacy memory schema identifier`);runSqliteImmediateTransactionSync(e,()=>markInvalidMemoryEmbeddings(e,`
    SELECT chunk.rowid AS storage_rowid,
           openclaw_memory_embedding_json_valid(legacy.embedding) AS valid
    FROM ${t}.chunks AS legacy
    JOIN main.memory_index_chunks AS chunk ON chunk.id = legacy.id
    WHERE length(chunk.embedding) = 0
  `))}function columns(e,t){return new Map(e.prepare(`SELECT name, type FROM pragma_table_info(?)`).all(t).map(e=>[String(e.name),String(e.type).toUpperCase()]))}function migrateMemoryIndexStorage(e,t={}){const n=t.embeddingCacheTable??`memory_embedding_cache`;if(!/^[A-Za-z_][A-Za-z0-9_]*$/u.test(n))throw new Error(`Invalid memory embedding cache table identifier`);const r=storageShapes(e,n);const i=r.chunks===`legacy`;const a=r.cache===`legacy`;if(!i&&!a)return;const o=Number(e.prepare(`PRAGMA foreign_keys`).get()?.foreign_keys)!==0;if(i&&o&&e.isTransaction)throw new Error(`Memory storage migration requires foreign keys disabled before BEGIN`);if(i&&o)e.exec(`PRAGMA foreign_keys = OFF`);let s;try{runSqliteImmediateTransactionSync(e,()=>{const o=registerMemoryEmbeddingMigrationFunctions(e,t.renewAuthority);const c=i?existingStorageObjects(e,`memory_index_chunks`):[];const l=a?existingStorageObjects(e,n):[];if(r.chunks===`binary`)assertBinaryEmbeddings(e,`memory_index_chunks`);if(r.cache===`binary`)assertBinaryEmbeddings(e,n);if(i){dropMemoryChunkFtsTriggers(e);ensureMemoryRecallMetadataSchema(e);markInvalidMemoryEmbeddings(e,`
          SELECT rowid AS storage_rowid,
                 openclaw_memory_embedding_json_valid(embedding) AS valid
          FROM memory_index_chunks
        `);e.exec(MEMORY_INDEX_CHUNKS_SCHEMA_SQL.replace(`CREATE TABLE IF NOT EXISTS`,`CREATE TABLE`).replace(`memory_index_chunks`,`memory_index_chunks_storage_migration`));copyMemoryStorageRows(e,`memory_index_chunks`,`
          INSERT INTO memory_index_chunks_storage_migration (
            chunk_rowid, id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
          )
          SELECT rowid, id, path, source, start_line, end_line, hash, model, text,
                 openclaw_memory_embedding_from_json(embedding), updated_at
          FROM memory_index_chunks WHERE rowid = ?
        `);replaceStorageTable(e,`memory_index_chunks`,c);if(e.prepare(`SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?`).get(`memory_index_chunks_fts`)){rebuildMemoryChunkFts(e,MEMORY_INDEX_FTS_TABLE);ensureMemoryChunkFtsTriggers(e)}}if(a){const t=`${n}_storage_migration`;e.exec(buildMemoryEmbeddingCacheSchema(t).replace(`CREATE TABLE IF NOT EXISTS`,`CREATE TABLE`));s=copyLegacyMemoryEmbeddingCache(e,n,t,o);replaceStorageTable(e,n,l)}if(i){for(const t of[`memory_index_chunk_provenance`,`memory_index_chunk_recall_metadata`])if(columns(e,t).size>0&&e.prepare(`PRAGMA foreign_key_check(${t})`).all().length>0)throw new Error(`Memory storage migration failed foreign key validation`)}})}finally{if(t.renewAuthority)registerMemoryEmbeddingMigrationFunctions(e);if(i&&o)e.exec(`PRAGMA foreign_keys = ON`)}if(s){if(t.onWarning)t.onWarning(s);else process.emitWarning(s)}}
//!packages/memory-host-sdk/src/host/memory-search-schema.ts
function memoryTextSearchSchema(e){const t=e===`trigram`?{mode:`trigram`}:{};return{text:{body:{table:`memory_index_chunks`,fields:[`text`],postgres:{identity:`chunk_rowid`,...t}},paths:{table:`memory_index_sources`,fields:[`path`],postgres:{identity:`id`,...t}}}}}function memoryVectorSearchSchema(e){return{vector:{chunks:{table:`memory_index_chunks_vec`,alias:`v`,rowShape:{id:`string`,path:`string`,start_line:`number`,end_line:`number`,text:`string`,source:[`memory`,`sessions`],dist:`finite-number`},postgres:{source:`memory_index_chunks`,key:`id`,embedding:`embedding`,dimensions:e}}}}}const memoryStandingIntentSearchSchema={text:{intents:{table:`standing_intents`,alias:`intent`,fields:[`trigger_keywords`],postgres:{identity:`intent_key`}}}};
//!packages/memory-host-sdk/src/host/memory-schema.ts
const LEGACY_MEMORY_INDEX_SOURCE_COLUMNS=[`path`,`source`,`hash`,`mtime`,`size`];const MEMORY_INDEX_SOURCE_COLUMNS=[`id`,...LEGACY_MEMORY_INDEX_SOURCE_COLUMNS];const MEMORY_INDEX_SOURCE_COLUMN_TYPES=/* @__PURE__ */ new Map([[`id`,`INTEGER`],[`path`,`TEXT`],[`source`,`TEXT`],[`hash`,`TEXT`],[`mtime`,`REAL`],[`size`,`INTEGER`]]);const memoryIndexSchemaAdmissionKeys=/* @__PURE__ */ new WeakMap;function stageMemoryIndexSchemaExtension(e,t){const n=memoryIndexSchemaAdmissionKeys.get(sqlPublicationAnchor(e));const r=n&&getSqliteDatabaseAdmission(e,n);if(!n||!r||t&&t.ftsAvailable!==r.ftsAvailable)return;if(!stageSqliteTransactionState(sqlPublicationAnchor(e),{stage:()=>{},rollback:()=>{},commit:()=>publishSqliteDatabaseAdmission(e,n,r)}))throw new Error(`Memory schema extensions require a managed transaction`)}function readMemoryIndexSchemaAdmission(e){if(typeof e!==`object`||e===null||!(`ftsAvailable`in e)||typeof e.ftsAvailable!==`boolean`)return;return{ftsAvailable:e.ftsAvailable,...`repairWriteToken`in e&&typeof e.repairWriteToken===`string`?{repairWriteToken:e.repairWriteToken}:{}}}function memoryIndexSchemaAdmissionKey(e){return{name:`memory.index-schema:${JSON.stringify([e.embeddingCacheTable??`memory_embedding_cache`,e.cacheEnabled,e.ftsTable??`memory_index_chunks_fts`,e.ftsEnabled,e.ftsTokenizer??`unicode61`])}`,schemaDependent:true,lifetime:`process`,read:readMemoryIndexSchemaAdmission}}function readRepairedMemoryIndexSchema(e,t){const n=memoryIndexSchemaAdmissionKey(e);const r=getSqliteDatabaseAdmission(e.db,n);if(t===void 0||r?.repairWriteToken!==t)return;memoryIndexSchemaAdmissionKeys.set(sqlPublicationAnchor(e.db),n);return{ftsAvailable:r.ftsAvailable}}function publishRepairedMemoryIndexSchema(e,t){const n=memoryIndexSchemaAdmissionKey(e);const r=getSqliteDatabaseAdmission(e.db,n);if(t!==void 0&&r)publishSqliteDatabaseAdmission(e.db,n,{...r,repairWriteToken:t})}function tableColumnInfo(e,t){const n=getAdmittedSqliteSchemaFacts(e);if(n&&![...n.tables,...n.views].some(e=>e.toLowerCase()===t.toLowerCase()))return[];return e.prepare(`PRAGMA main.table_xinfo(${t})`).all().flatMap(e=>typeof e.name===`string`&&typeof e.type===`string`?[{name:e.name,type:e.type.toUpperCase(),notnull:Number(e.notnull??0),pk:Number(e.pk??0),defaultValue:typeof e.dflt_value===`string`?e.dflt_value:null,hidden:Number(e.hidden??0)}]:[])}function tableHasExactColumns(e,t,n,r){const i=new Set((r??tableColumnInfo(e,t)).map(e=>e.name));return i.size===n.length&&n.every(e=>i.has(e))}function tableHasPrimaryKey(e,t,n,r){const i=(r??tableColumnInfo(e,t)).filter(e=>e.pk>0).toSorted((e,t)=>e.pk-t.pk).map(e=>e.name);return i.length===n.length&&i.every((e,t)=>e===n[t])}function tableHasUniqueIndex(e,t,n){const r=e.prepare(`SELECT name, partial FROM pragma_index_list(?) WHERE "unique" = 1`).all(t);if(r.length!==1)return false;return r.some(t=>{if(typeof t.name!==`string`||Number(t.partial??0)!==0)return false;const r=e.prepare(`SELECT cid, name, coll, "desc" AS sort_desc, key FROM pragma_index_xinfo(?) ORDER BY seqno`).all(t.name).filter(e=>Number(e.key??0)===1);return r.length===n.length&&r.every((e,t)=>Number(e.cid??-1)>=0&&e.name===n[t]&&e.coll===`BINARY`&&Number(e.sort_desc??0)===0)})}function tableHasNoDeclaredCollations(e,t){const n=e.prepare(`SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = ?`).get(t);return typeof n?.sql===`string`&&!/\bCOLLATE\b/iu.test(n.sql)}function tableHasSourceColumnContract(e,t,n){return(n??tableColumnInfo(e,`memory_index_sources`)).every(e=>(e.type===MEMORY_INDEX_SOURCE_COLUMN_TYPES.get(e.name)||e.name===`mtime`&&e.type===`INTEGER`)&&e.defaultValue===(e.name===`source`?`'memory'`:null)&&e.hidden===0&&(e.name===t||e.notnull===1))}function tableHasIntegerRowIdPrimaryKey(e,t){if((t??tableColumnInfo(e,`memory_index_sources`)).find(e=>e.name===`id`)?.type!==`INTEGER`||!tableHasPrimaryKey(e,`memory_index_sources`,[`id`],t))return false;return e.prepare(`SELECT 1 AS found FROM pragma_index_list(?) WHERE origin = 'pk' LIMIT 1`).get(MEMORY_INDEX_SOURCES_TABLE)?.found!==1}function tableExists(e,t){const n=getAdmittedSqliteSchemaFacts(e);if(n)return n.tables.has(t);return e.prepare(`SELECT 1 AS found FROM sqlite_master WHERE type = 'table' AND name = ?`).get(t)?.found===1}function migrateMemoryIndexSourcesIdentity(e){if(!tableExists(e,`memory_index_sources`))return;const t=canReuseSqliteSchemaInTransaction(e)?tableColumnInfo(e,MEMORY_INDEX_SOURCES_TABLE):void 0;if(tableHasExactColumns(e,`memory_index_sources`,MEMORY_INDEX_SOURCE_COLUMNS,t)){if(tableHasSourceColumnContract(e,`id`,t)&&tableHasIntegerRowIdPrimaryKey(e,t)&&tableHasNoDeclaredCollations(e,`memory_index_sources`)&&tableHasUniqueIndex(e,`memory_index_sources`,[`path`,`source`]))return;throw new Error(`canonical memory source identity schema is invalid`)}if(!tableHasExactColumns(e,`memory_index_sources`,LEGACY_MEMORY_INDEX_SOURCE_COLUMNS,t))throw new Error(`canonical memory source identity schema is invalid`);const n=tableHasPrimaryKey(e,MEMORY_INDEX_SOURCES_TABLE,[`path`],t);const r=tableHasPrimaryKey(e,MEMORY_INDEX_SOURCES_TABLE,[`path`,`source`],t);if(!n&&!r)throw new Error(`canonical memory source identity schema is invalid`);if(!tableHasSourceColumnContract(e,n?`path`:void 0,t))throw new Error(`canonical memory source identity schema is invalid`);const i=tableExists(e,MEMORY_INDEX_PATHS_FTS_TABLE);e.exec(`SAVEPOINT migrate_memory_index_sources_identity`);try{dropMemoryPathFtsTriggers(e);e.exec(`
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_insert;
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_update;
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_delete;

      ALTER TABLE ${MEMORY_INDEX_SOURCES_TABLE}
        RENAME TO memory_index_sources_identity_migration;
      CREATE TABLE ${MEMORY_INDEX_SOURCES_TABLE} (
        id INTEGER PRIMARY KEY,
        path TEXT NOT NULL,
        source TEXT NOT NULL DEFAULT 'memory',
        hash TEXT NOT NULL,
        mtime REAL NOT NULL,
        size INTEGER NOT NULL,
        UNIQUE (path, source)
      ) STRICT;
      INSERT INTO ${MEMORY_INDEX_SOURCES_TABLE} (id, path, source, hash, mtime, size)
      SELECT rowid, path, source, hash, mtime, size
      FROM memory_index_sources_identity_migration;
      DROP TABLE memory_index_sources_identity_migration;
    `);if(i){e.exec(`
        DELETE FROM ${MEMORY_INDEX_PATHS_FTS_TABLE};
        INSERT INTO ${MEMORY_INDEX_PATHS_FTS_TABLE} (rowid, path, source)
        SELECT id, path, source FROM ${MEMORY_INDEX_SOURCES_TABLE};
      `);ensureMemoryPathFtsTriggers(e)}e.exec(`RELEASE migrate_memory_index_sources_identity`)}catch(t){e.exec(`ROLLBACK TO migrate_memory_index_sources_identity`);e.exec(`RELEASE migrate_memory_index_sources_identity`);throw t}}function ensureMemoryIndexSchema(e){const t=e.embeddingCacheTable??`memory_embedding_cache`;const n=e.ftsTable??`memory_index_chunks_fts`;const r=e.ftsTokenizer??`unicode61`;const i=memoryIndexSchemaAdmissionKey(e);memoryIndexSchemaAdmissionKeys.set(sqlPublicationAnchor(e.db),i);const a=getSqliteDatabaseAdmission(e.db,i);if(a){backfillMemoryChunkProvenance(e.db);if(a.ftsAvailable)try{const reconcile=()=>{reconcileMemoryChunkFtsRows(e.db,n);if(n===`memory_index_chunks_fts`)backfillMemoryPathFtsRows(e.db)};if(e.db.isTransaction)reconcile();else runSqliteImmediateTransactionSync(e.db,reconcile)}catch(t){if(n===`memory_index_chunks_fts`){dropMemoryChunkFtsTriggers(e.db);dropMemoryPathFtsTriggers(e.db)}return{ftsAvailable:false,ftsError:formatErrorMessage(t)}}return{ftsAvailable:a.ftsAvailable}}if(!e.fresh&&tableHasExactColumns(e.db,`meta`,[`key`,`value`])&&tableHasExactColumns(e.db,`files`,[`path`,`source`,`hash`,`mtime`,`size`])&&tableHasExactColumns(e.db,`chunks`,[`id`,`path`,`source`,`start_line`,`end_line`,`hash`,`model`,`text`,`embedding`,`updated_at`]))throw new Error(`Retired memory index format detected. Preserve a complete copy of your state and configuration, then use OpenClaw 2026.9.7 to migrate a compatible copy of this index before retrying the upgrade.`);const o=e.fresh?void 0:getAdmittedSqliteSchemaFacts(e.db)?.tables;if(![`memory_index_meta`,`memory_index_sources`,`memory_index_chunks`,`memory_index_chunk_recall_metadata`,`memory_index_chunk_provenance`,`memory_index_state`,...e.cacheEnabled?[t]:[]].every(e=>o?.has(e)))e.db.exec(buildMemoryIndexStrictSchema({embeddingCacheTable:t,includeEmbeddingCache:e.cacheEnabled}));if(!e.fresh){migrateMemoryIndexStorage(e.db,{embeddingCacheTable:t});ensureMemoryRecallMetadataSchema(e.db)}e.db.exec(`
    INSERT OR IGNORE INTO ${MEMORY_INDEX_STATE_TABLE} (id, revision) VALUES (1, 0);
  `);if(!e.fresh)migrateMemoryIndexSourcesIdentity(e.db);const s=e.fresh?void 0:getAdmittedSqliteSchemaFacts(e.db)?.indexes;if(!e.fresh&&s?.has(`idx_memory_index_chunks_path`)!==false)e.db.exec(`DROP INDEX IF EXISTS idx_memory_index_chunks_path;`);if(![`idx_memory_index_sources_source`,`idx_memory_index_chunks_path_source`,`idx_memory_index_chunks_source`].every(e=>s?.has(e)))e.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_memory_index_sources_source
        ON ${MEMORY_INDEX_SOURCES_TABLE}(source);
      CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path_source
        ON ${MEMORY_INDEX_CHUNKS_TABLE$1}(path, source);
      CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_source
        ON ${MEMORY_INDEX_CHUNKS_TABLE$1}(source);
    `);if(!e.fresh)ensureMemoryChunkProvenance(e.db);dropDisabledMemoryFts(e.db,n,e.ftsEnabled);if(e.cacheEnabled){const n=t===`memory_embedding_cache`?`idx_memory_embedding_cache_updated_at`:`idx_embedding_cache_updated_at`;if(!s?.has(n))e.db.exec(`
        CREATE INDEX IF NOT EXISTS ${n}
          ON ${t}(updated_at);
      `)}if(!e.fresh){const n=e.db.isTransaction?migrateSqliteSchemaToStrictInTransaction:migrateSqliteSchemaToStrict;const r=e.cacheEnabled||tableExists(e.db,t);n(e.db,buildMemoryIndexStrictSchema({embeddingCacheTable:t,includeEmbeddingCache:r}),{databaseLabel:`memory index`,expectedSchema:memorySchemaSource(buildMemoryIndexStrictSchema({embeddingCacheTable:MEMORY_EMBEDDING_CACHE_TABLE,includeEmbeddingCache:r}),t)})}let c=false;let l;if(e.ftsEnabled)try{const t=memoryTextSearchSchema(r);if(n!==`memory_index_chunks_fts`)t.text={body:{...t.text.body,table:n}};admitSqliteMemoryTextSearch(e.db,t,{fresh:e.fresh});c=true}catch(t){if(n===`memory_index_chunks_fts`){dropMemoryChunkFtsTriggers(e.db);dropMemoryPathFtsTriggers(e.db)}l=formatErrorMessage(t)}if(!e.ftsEnabled||c)publishSqliteDatabaseAdmission(e.db,i,{ftsAvailable:c});return{ftsAvailable:c,...l?{ftsError:l}:{}}}export{MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE as _,stageMemoryIndexSchemaExtension as a,MEMORY_INDEX_CHUNK_PROVENANCE_TABLE as b,memoryVectorSearchSchema as c,registerMemoryEmbeddingMigrationFunctions as d,MEMORY_EMBEDDING_CACHE_TABLE as f,MEMORY_INDEX_VECTOR_TABLE as g,MEMORY_INDEX_STATE_TABLE as h,readRepairedMemoryIndexSchema as i,markInvalidImportedMemoryEmbeddings as l,MEMORY_INDEX_META_TABLE as m,migrateMemoryIndexSourcesIdentity as n,memoryStandingIntentSearchSchema as o,MEMORY_INDEX_DERIVED_TABLES as p,publishRepairedMemoryIndexSchema as r,memoryTextSearchSchema as s,ensureMemoryIndexSchema as t,migrateMemoryIndexStorage as u,ensureMemoryRecallMetadataSchema as v,ensureMemoryChunkProvenance as x,hasLegacyMemoryRecallMetadataColumns as y};