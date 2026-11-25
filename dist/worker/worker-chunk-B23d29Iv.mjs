import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{l as t,s as n}from"./worker-chunk-CVUJAyi8.mjs";import{d as r,n as i}from"./worker-chunk-BPHvrlkH.mjs";import{n as a,r as o}from"./worker-chunk-BELuyL3Z.mjs";import{i as s}from"./worker-chunk-BT-IOQFW.mjs";import{Lt as c,Mt as l,Pt as u,Rt as d,bt as f,kt as p,m as ee,xt as m}from"./worker-chunk-CEZYAk4y.mjs";import{o as h,t as g}from"./worker-chunk-DBPe0gM1.mjs";import"./worker-chunk-DhldO1WL.mjs";import{i as te,o as _,u as ne}from"./worker-chunk-Cb_C8ZGK.mjs";import{i as v,n as re,o as y,s as ie}from"./worker-chunk-BPAboNOm.mjs";import{n as b,o as x}from"./worker-chunk-Cah9p62j.mjs";import{t as ae}from"./worker-chunk-BvmZfG86.mjs";import{i as oe,r as se}from"./worker-chunk-BHRVh8Hf.mjs";import{a as S,c as ce,d as le,f as ue,i as C,l as de,n as fe,o as pe,p as me,r as he,t as ge,u as _e}from"./worker-chunk-BJkfZ3pb.mjs";import{l as ve,t as ye}from"./worker-chunk-_Aeyyloa.mjs";import{n as be,r as w}from"./worker-chunk-BXmh_BAZ.mjs";import{n as xe}from"./worker-chunk-DZyAHTvS.mjs";import{n as T,t as E}from"./worker-chunk-CzVmoVEk.mjs";import{A as Se,E as Ce,F as we,G as Te,I as Ee,K as De,T as Oe,V as ke,X as Ae,Z as je,g as Me,k as Ne,p as Pe,x as Fe,y as Ie,z as Le}from"./worker-chunk-C45OPGga.mjs";var D=e((()=>{xe(),se(),ve(),ne(),T(),ee(),b(),s(),v(),ue()}));function ensureMemoryChunkProvenance(e){let ensure=()=>{let t=_(e);(t?t.triggers.has(k):ae(e)(`memory_index_chunks`)?.triggers.some(({name:e})=>e===k))&&e.exec(`DROP TRIGGER ${k}`),ze(e),backfillMemoryChunkProvenance(e)};e.isTransaction?ensure():x(e,ensure)}function backfillMemoryChunkProvenance(e){let backfill=()=>{let t=e.prepare(`
      WITH missing AS MATERIALIZED (${Be}),
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
      WITH missing AS MATERIALIZED (${Be})
      INSERT OR IGNORE INTO ${O} (
        chunk_id, origin_class, session_kind, observed_at
      )
      SELECT chunk.id, 'untrusted', 'unknown', chunk.updated_at
      FROM missing
      JOIN memory_index_chunks AS chunk ON chunk.id = missing.id;
    `),t>0&&e.exec(`UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1`)};e.isTransaction?backfill():x(e,backfill)}var O,Re,ze,k,Be,A=e((()=>{D(),O=`memory_index_chunk_provenance`,Re=`
  CREATE TABLE IF NOT EXISTS ${O} (
    chunk_id TEXT PRIMARY KEY,
    origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),
    session_kind TEXT NOT NULL CHECK (session_kind IN ('interactive', 'cron', 'heartbeat', 'subagent', 'unknown')),
    observed_at INTEGER NOT NULL,
    supersedes_key TEXT,
    FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE
  ) STRICT;
`,ze=E(()=>Re,{tables:[O]}),k=`memory_index_chunk_provenance_after_insert`,Be=`
  SELECT chunk.id
  FROM memory_index_chunks AS chunk
  LEFT JOIN ${O} AS provenance
    ON provenance.chunk_id = chunk.id
  WHERE provenance.chunk_id IS NULL
`}));function readMemoryChunkColumns(e){let t=e.prepare(`PRAGMA table_info(${j})`).all();return new Set(t.flatMap(e=>typeof e.name==`string`?[e.name]:[]))}function tableExists$1(e,t){return!!e.prepare(`SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ? LIMIT 1`).get(t)}function legacyRecallMetadataColumns(e){let t=readMemoryChunkColumns(e);return[`importance`,`triggers`,`project_key`].filter(e=>t.has(e))}function hasLegacyMemoryRecallMetadataColumns(e){return legacyRecallMetadataColumns(e).length>0}function ensureMemoryRecallMetadataSchema(e){if(legacyRecallMetadataColumns(e).length===0&&tableExists$1(e,`memory_index_chunk_recall_metadata`))return;let ensure=()=>{e.exec(Ve);let t=new Set(legacyRecallMetadataColumns(e));if(t.size===0)return;let n=t.has(`importance`)?`importance`:`NULL`,r=t.has(`triggers`)?`triggers`:`NULL`,i=t.has(`project_key`)?`project_key`:`NULL`;e.exec(`
      INSERT INTO ${M} (
        chunk_id, importance, triggers, project_key
      )
      SELECT id, ${n}, ${r}, ${i}
      FROM ${j}
      WHERE ${n} IS NOT NULL
         OR ${r} IS NOT NULL
         OR ${i} IS NOT NULL
      ON CONFLICT(chunk_id) DO UPDATE SET
        importance=excluded.importance,
        triggers=excluded.triggers,
        project_key=excluded.project_key;
    `);for(let n of[`project_key`,`triggers`,`importance`])t.has(n)&&e.exec(`ALTER TABLE ${j} DROP COLUMN ${n}`)};e.isTransaction?ensure():x(e,ensure)}var j,M,Ve,N=e((()=>{D(),j=`memory_index_chunks`,M=`memory_index_chunk_recall_metadata`,Ve=`
  CREATE TABLE IF NOT EXISTS ${M} (
    chunk_id TEXT PRIMARY KEY,
    importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10),
    triggers TEXT,
    project_key TEXT,
    FOREIGN KEY (chunk_id) REFERENCES ${j}(id) ON DELETE CASCADE
  ) STRICT;
`}));function formatErrorMessage(e){return n(e,{redact:r})}var He=e((()=>{t(),i()}));function buildMemoryEmbeddingCacheSchema(e){return`
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
  `}function legacyCacheSchema(e){return`CREATE TABLE IF NOT EXISTS ${e} (
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    provider_key TEXT NOT NULL,
    hash TEXT NOT NULL,
    embedding TEXT NOT NULL,
    dims INTEGER,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (provider, model, provider_key, hash)
  ) STRICT;`}function buildMemoryStorageSchema(e){let t=e.chunks?e.legacy?Ke:I:e.legacy?legacyCacheSchema(e.table):buildMemoryEmbeddingCacheSchema(e.table),n=L.filter(([t])=>e.inlineRecallColumns?.includes(t));return e.chunks&&n.length>0&&(t=t.replace(`updated_at INTEGER NOT NULL`,`updated_at INTEGER NOT NULL,\n${n.map(([,e])=>e).join(`,
`)}`)),e.strict||(t=t.replace(`) STRICT;`,`);`)),t+memoryStorageIndexes(e.table,e.chunks).map(t=>`CREATE INDEX ${t.name} ON ${e.table}(${t.columns});`).join(`
`)}function memoryStorageIndexes(e,t){return t?qe:[{name:e===`memory_embedding_cache`?`idx_memory_embedding_cache_updated_at`:`idx_embedding_cache_updated_at`,columns:`updated_at`}]}var P,F,Ue,We,I,Ge,Ke,qe,L,R=e((()=>{A(),N(),D(),P=`memory_index_meta`,F=`memory_embedding_cache`,Ue=`memory_index_state`,We=`memory_index_chunks_vec`,I=`
  CREATE TABLE IF NOT EXISTS ${fe} (
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
`,Ge=[We,he,C,M,O,fe,S,P,F,Ue],Ke=`
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
`,qe=[{name:`idx_memory_index_chunks_path_source`,columns:`path, source`},{name:`idx_memory_index_chunks_path`,columns:`path`},{name:`idx_memory_index_chunks_source`,columns:`source`}],L=[[`importance`,`importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10)`],[`triggers`,`triggers TEXT`],[`project_key`,`project_key TEXT`]]}));function memorySchemaSource(e,t){if(t===`memory_embedding_cache`)return e;let n=oe(e);if(!n)throw Error(`Memory schema has no generated catalog; run pnpm db:postgres:gen.`);let rename=e=>e.replaceAll(F,t);return{views:n.views,tables:n.tables.map(e=>e.name===`memory_embedding_cache`?{...e,name:t,sql:e.sql===null?null:rename(e.sql),indexes:e.indexes.map(e=>({...e,name:e.name===`idx_memory_embedding_cache_updated_at`?`idx_embedding_cache_updated_at`:rename(e.name),sql:e.sql===null?null:rename(e.sql).replace(`idx_${t}_updated_at`,`idx_embedding_cache_updated_at`)}))}:e)}}var Je=e((()=>{R(),D()}));function encodeMemoryEmbedding(e){let t=new Uint8Array(e.length*8),n=new DataView(t.buffer);for(let t=0;t<e.length;t+=1){let r=e[t];if(typeof r!=`number`||!Number.isFinite(r))throw Error(`Memory embeddings require finite numeric coordinates`);n.setFloat64(t*8,r,!0)}return t}function decodeMemoryEmbedding(e){if(e.byteLength%8!=0)return[];let t=new DataView(e.buffer,e.byteOffset,e.byteLength),n=[];for(let r=0;r<e.byteLength;r+=8){let e=t.getFloat64(r,!0);if(!Number.isFinite(e))return[];n.push(e)}return n}var Ye=e((()=>{}));function storageShape(e,t,n,r){let i=columns(e,t);if(i.size===0)return`absent`;let a=i.get(`embedding`)===`TEXT`?`legacy`:i.get(`embedding`)===`BLOB`?`binary`:void 0;if(!a||n&&i.has(`chunk_rowid`)!==(a===`binary`))throw Error(`Unsupported partial memory storage schema: ${t}`);let o=a!==`legacy`||e.prepare(`SELECT strict FROM pragma_table_list WHERE schema = 'main' AND name = ?`).get(t)?.strict!==0,s=memoryStorageIndexes(t,n),c=buildMemoryStorageSchema({table:n?t:F,chunks:n,legacy:a===`legacy`,strict:o,inlineRecallColumns:L.filter(([e])=>i.has(e)).map(([e])=>e)});return ye(e,`memory storage ${t}`,memorySchemaSource(c,n?F:t),{allowCompatibleAdditiveColumns:a===`binary`,allowedMissingIndexes:s.map(e=>e.name),optionalCanonicalTriggerGroups:n?[{tableName:t,triggers:z},{tableName:t,triggers:ge}]:[]},r),a===`legacy`&&assertKnownRebuildDependents(e,t,s.map(e=>e.name),n?[...z.map(e=>e.name),...ge.map(e=>e.name)]:[]),a}function assertKnownRebuildDependents(e,t,n,r){let i=/* @__PURE__ */ new Set([...n,...r]),a=e.prepare(`
    SELECT type, name, tbl_name FROM main.sqlite_schema
    WHERE (type IN ('trigger', 'index') AND tbl_name = ? AND sql IS NOT NULL)
       OR (type IN ('view', 'trigger') AND instr(lower(sql), ?) > 0)
  `).all(t,t).find(e=>e.tbl_name!==t||!i.has(String(e.name)));if(a)throw Error(`Memory storage migration cannot rebuild unknown ${String(a.type)} ${String(a.name)} on ${t}`);for(let n of e.prepare(`SELECT name FROM main.sqlite_schema WHERE type = 'table'`).all()){let r=String(n.name),i=e.prepare(`PRAGMA main.foreign_key_list("${r.replaceAll(`"`,`""`)}")`).all().filter(e=>e.table===t),a=t===`memory_index_chunks`&&[`memory_index_chunk_provenance`,`memory_index_chunk_recall_metadata`].includes(r);if(i.some(e=>!a||e.from!==`chunk_id`||e.to!==`id`||e.on_delete!==`CASCADE`||e.on_update!==`NO ACTION`))throw Error(`Memory storage migration cannot rebuild ${t} referenced by an unknown foreign key in ${r}`)}}function storageShapes(e,t){let n=te(e)?ae(e):void 0;return{chunks:storageShape(e,`memory_index_chunks`,!0,n),cache:storageShape(e,t,!1,n)}}function assertBinaryEmbeddings(e,t){let n=e.prepare(`SELECT openclaw_memory_embedding_blob_valid(embedding) AS valid FROM ${t}`);for(let e of n.iterate())if(e.valid===0)throw Error(`Memory storage migration found invalid binary embeddings in ${t}`)}function copyMemoryStorageRows(e,t,n){let r=e.prepare(`SELECT rowid AS storage_rowid FROM ${t}`);r.setReadBigInts(!0);let i=e.prepare(n);i.setReadBigInts(!0);for(let e of r.iterate()){if(typeof e.storage_rowid!=`bigint`)throw Error(`Invalid memory storage identity during migration`);i.run(e.storage_rowid)}}function markInvalidMemoryEmbeddings(e,t){let n=e.prepare(t);n.setReadBigInts(!0);let r=e.prepare(`
    UPDATE main.memory_index_sources SET hash = ''
    WHERE (path, source) IN (
      SELECT path, source FROM main.memory_index_chunks WHERE rowid = ?
    )`);r.setReadBigInts(!0);let i=!1;for(let e of n.iterate())if(e.valid===0){if(typeof e.storage_rowid!=`bigint`)throw Error(`Invalid memory storage identity during migration`);r.run(e.storage_rowid),i=!0}i&&(e.exec(`
      INSERT INTO main.memory_index_meta (key, value)
      VALUES ('memory_vector_rebuild_v1', '1')
      ON CONFLICT(key) DO UPDATE SET value = excluded.value;
    `),y(e,`memory_index_state`)&&e.exec(`UPDATE main.memory_index_state SET revision = revision + 1 WHERE id = 1`))}function legacyEmbedding(e){if(typeof e==`string`)try{let t=JSON.parse(e);return Array.isArray(t)&&t.every(e=>typeof e==`number`&&Number.isFinite(e))?t:void 0}catch{return}}function copyLegacyMemoryEmbeddingCache(e,t,n,r){let i=1048576,a=e.prepare(`
    SELECT rowid AS storage_rowid,
      CASE WHEN length(CAST(embedding AS BLOB)) <= ${i}
        THEN embedding ELSE NULL END AS embedding
    FROM ${t} WHERE rowid >= ? ORDER BY rowid LIMIT 128
  `);a.setReadBigInts(!0);let o=e.prepare(`
    INSERT INTO ${n} (rowid, provider, model, provider_key, hash, embedding, dims, updated_at)
    SELECT rowid, provider, model, provider_key, hash, ?, dims, updated_at
    FROM ${t} WHERE rowid = ?
  `);o.setReadBigInts(!0);let s=-9223372036854775808n,c=0,l=[];for(;s<=9223372036854775807n;){let e=0;for(let t of a.iterate(s)){if(typeof t.storage_rowid!=`bigint`)throw Error(`Invalid memory storage identity during migration`);r(),s=t.storage_rowid+1n,e+=1;let n=legacyEmbedding(t.embedding??null);n===void 0?(c+=1,l.length<8&&l.push(String(t.storage_rowid))):o.run(encodeMemoryEmbedding(n),t.storage_rowid)}if(e<128)break}return c>0?`Skipped ${c} ${t} rows with invalid embeddings or embeddings larger than ${i} bytes (first rowids: ${l.join(`, `)}). These cache entries will be rebuilt on demand.`:void 0}function registerMemoryEmbeddingMigrationFunctions(e,t){let n=-1/0,renew=()=>{t&&performance.now()-n>=1e3&&(t(),n=performance.now())};return e.function(`openclaw_memory_embedding_from_json`,{deterministic:!0},e=>(renew(),encodeMemoryEmbedding(legacyEmbedding(e)??[]))),e.function(`openclaw_memory_embedding_json_valid`,{deterministic:!0},e=>(renew(),Number(legacyEmbedding(e)!==void 0))),e.function(`openclaw_memory_embedding_blob_valid`,{deterministic:!0},e=>(renew(),Number(e instanceof Uint8Array&&e.byteLength%8==0&&decodeMemoryEmbedding(e).length*8===e.byteLength))),renew}function existingStorageObjects(e,t){return e.prepare(`SELECT sql FROM main.sqlite_schema
    WHERE tbl_name = ? AND type IN ('index', 'trigger') AND sql IS NOT NULL
    ORDER BY type, name`).all(t).map(e=>String(e.sql))}function replaceStorageTable(e,t,n){e.exec(`
    DROP TABLE ${t};
    ALTER TABLE ${t}_storage_migration RENAME TO ${t};
  `);for(let t of n)e.exec(t)}function columns(e,t){return new Map(e.prepare(`SELECT name, type FROM pragma_table_info(?)`).all(t).map(e=>[String(e.name),String(e.type).toUpperCase()]))}function migrateMemoryIndexStorage(e,t={}){let n=t.embeddingCacheTable??`memory_embedding_cache`;if(!/^[A-Za-z_][A-Za-z0-9_]*$/u.test(n))throw Error(`Invalid memory embedding cache table identifier`);let r=storageShapes(e,n),i=r.chunks===`legacy`,a=r.cache===`legacy`;if(!i&&!a)return;let o=Number(e.prepare(`PRAGMA foreign_keys`).get()?.foreign_keys)!==0;if(i&&o&&e.isTransaction)throw Error(`Memory storage migration requires foreign keys disabled before BEGIN`);i&&o&&e.exec(`PRAGMA foreign_keys = OFF`);let s;try{x(e,()=>{let o=registerMemoryEmbeddingMigrationFunctions(e,t.renewAuthority),c=i?existingStorageObjects(e,`memory_index_chunks`):[],l=a?existingStorageObjects(e,n):[];if(r.chunks===`binary`&&assertBinaryEmbeddings(e,`memory_index_chunks`),r.cache===`binary`&&assertBinaryEmbeddings(e,n),i&&(ce(e),ensureMemoryRecallMetadataSchema(e),markInvalidMemoryEmbeddings(e,`
          SELECT rowid AS storage_rowid,
                 openclaw_memory_embedding_json_valid(embedding) AS valid
          FROM memory_index_chunks
        `),e.exec(I.replace(`CREATE TABLE IF NOT EXISTS`,`CREATE TABLE`).replace(`memory_index_chunks`,`memory_index_chunks_storage_migration`)),copyMemoryStorageRows(e,`memory_index_chunks`,`
          INSERT INTO memory_index_chunks_storage_migration (
            chunk_rowid, id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
          )
          SELECT rowid, id, path, source, start_line, end_line, hash, model, text,
                 openclaw_memory_embedding_from_json(embedding), updated_at
          FROM memory_index_chunks WHERE rowid = ?
        `),replaceStorageTable(e,`memory_index_chunks`,c),e.prepare(`SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?`).get(`memory_index_chunks_fts`)&&(me(e,he),_e(e))),a){let t=`${n}_storage_migration`;e.exec(buildMemoryEmbeddingCacheSchema(t).replace(`CREATE TABLE IF NOT EXISTS`,`CREATE TABLE`)),s=copyLegacyMemoryEmbeddingCache(e,n,t,o),replaceStorageTable(e,n,l)}if(i){for(let t of[`memory_index_chunk_provenance`,`memory_index_chunk_recall_metadata`])if(columns(e,t).size>0&&e.prepare(`PRAGMA foreign_key_check(${t})`).all().length>0)throw Error(`Memory storage migration failed foreign key validation`)}})}finally{t.renewAuthority&&registerMemoryEmbeddingMigrationFunctions(e),i&&o&&e.exec(`PRAGMA foreign_keys = ON`)}s&&(t.onWarning?t.onWarning(s):process.emitWarning(s))}var z,Xe=e((()=>{Ye(),R(),Je(),N(),D(),z=[`insert`,`update`,`delete`].map(e=>({name:`memory_index_chunks_revision_after_${e}`,sql:`CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_${e}
    AFTER ${e.toUpperCase()} ON memory_index_chunks
    BEGIN UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1; END;`}))}));function tableColumnInfo(e,t){let n=_(e);return n&&![...n.tables,...n.views].some(e=>e.toLowerCase()===t.toLowerCase())?[]:e.prepare(`PRAGMA main.table_xinfo(${t})`).all().flatMap(e=>typeof e.name==`string`&&typeof e.type==`string`?[{name:e.name,type:e.type.toUpperCase(),notnull:Number(e.notnull??0),pk:Number(e.pk??0),defaultValue:typeof e.dflt_value==`string`?e.dflt_value:null,hidden:Number(e.hidden??0)}]:[])}function tableHasExactColumns(e,t,n,r){let i=new Set((r??tableColumnInfo(e,t)).map(e=>e.name));return i.size===n.length&&n.every(e=>i.has(e))}function tableHasPrimaryKey(e,t,n,r){let i=(r??tableColumnInfo(e,t)).filter(e=>e.pk>0).toSorted((e,t)=>e.pk-t.pk).map(e=>e.name);return i.length===n.length&&i.every((e,t)=>e===n[t])}function tableHasUniqueIndex(e,t,n){let r=e.prepare(`SELECT name, partial FROM pragma_index_list(?) WHERE "unique" = 1`).all(t);return r.length===1&&r.some(t=>{if(typeof t.name!=`string`||Number(t.partial??0)!==0)return!1;let r=e.prepare(`SELECT cid, name, coll, "desc" AS sort_desc, key FROM pragma_index_xinfo(?) ORDER BY seqno`).all(t.name).filter(e=>Number(e.key??0)===1);return r.length===n.length&&r.every((e,t)=>Number(e.cid??-1)>=0&&e.name===n[t]&&e.coll===`BINARY`&&Number(e.sort_desc??0)===0)})}function tableHasNoDeclaredCollations(e,t){let n=e.prepare(`SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = ?`).get(t);return typeof n?.sql==`string`&&!/\bCOLLATE\b/iu.test(n.sql)}function tableHasSourceColumnContract(e,t,n){return(n??tableColumnInfo(e,`memory_index_sources`)).every(e=>(e.type===Qe.get(e.name)||e.name===`mtime`&&e.type===`INTEGER`)&&e.defaultValue===(e.name===`source`?`'memory'`:null)&&e.hidden===0&&(e.name===t||e.notnull===1))}function tableHasIntegerRowIdPrimaryKey(e,t){return(t??tableColumnInfo(e,`memory_index_sources`)).find(e=>e.name===`id`)?.type!==`INTEGER`||!tableHasPrimaryKey(e,`memory_index_sources`,[`id`],t)?!1:e.prepare(`SELECT 1 AS found FROM pragma_index_list(?) WHERE origin = 'pk' LIMIT 1`).get(S)?.found!==1}function tableExists(e,t){let n=_(e);return n?n.tables.has(t):e.prepare(`SELECT 1 AS found FROM sqlite_master WHERE type = 'table' AND name = ?`).get(t)?.found===1}function migrateMemoryIndexSourcesIdentity(e){if(!tableExists(e,`memory_index_sources`))return;let t=te(e)?tableColumnInfo(e,S):void 0;if(tableHasExactColumns(e,`memory_index_sources`,Ze,t)){if(tableHasSourceColumnContract(e,`id`,t)&&tableHasIntegerRowIdPrimaryKey(e,t)&&tableHasNoDeclaredCollations(e,`memory_index_sources`)&&tableHasUniqueIndex(e,`memory_index_sources`,[`path`,`source`]))return;throw Error(`canonical memory source identity schema is invalid`)}if(!tableHasExactColumns(e,`memory_index_sources`,B,t))throw Error(`canonical memory source identity schema is invalid`);let n=tableHasPrimaryKey(e,S,[`path`],t),r=tableHasPrimaryKey(e,S,[`path`,`source`],t);if(!n&&!r||!tableHasSourceColumnContract(e,n?`path`:void 0,t))throw Error(`canonical memory source identity schema is invalid`);let i=tableExists(e,C);e.exec(`SAVEPOINT migrate_memory_index_sources_identity`);try{de(e),e.exec(`
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_insert;
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_update;
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_delete;

      ALTER TABLE ${S}
        RENAME TO memory_index_sources_identity_migration;
      CREATE TABLE ${S} (
        id INTEGER PRIMARY KEY,
        path TEXT NOT NULL,
        source TEXT NOT NULL DEFAULT 'memory',
        hash TEXT NOT NULL,
        mtime REAL NOT NULL,
        size INTEGER NOT NULL,
        UNIQUE (path, source)
      ) STRICT;
      INSERT INTO ${S} (id, path, source, hash, mtime, size)
      SELECT rowid, path, source, hash, mtime, size
      FROM memory_index_sources_identity_migration;
      DROP TABLE memory_index_sources_identity_migration;
    `),i&&(e.exec(`
        DELETE FROM ${C};
        INSERT INTO ${C} (rowid, path, source)
        SELECT id, path, source FROM ${S};
      `),le(e)),e.exec(`RELEASE migrate_memory_index_sources_identity`)}catch(t){throw e.exec(`ROLLBACK TO migrate_memory_index_sources_identity`),e.exec(`RELEASE migrate_memory_index_sources_identity`),t}}var B,Ze,Qe,$e=e((()=>{He(),R(),Je(),A(),N(),Xe(),D(),B=[`path`,`source`,`hash`,`mtime`,`size`],Ze=[`id`,...B],Qe=/* @__PURE__ */ new Map([[`id`,`INTEGER`],[`path`,`TEXT`],[`source`,`TEXT`],[`hash`,`TEXT`],[`mtime`,`REAL`],[`size`,`INTEGER`]])})),V,et=e((()=>{T(),h(),m(),V=`context_engine_turn_outbox`,E(()=>g(f,V,{endMarker:`CREATE TABLE IF NOT EXISTS cache_entries (`,includeEndMarker:!1,errorMessage:`OpenClaw context-engine turn outbox schema markers are missing.`}),{tables:[V],indexes:[`idx_agent_context_engine_turn_outbox_engine`]})}));function ensureSessionGoalOperationsSchema(e){o(e)||tt(e)}var H,tt,nt=e((()=>{a(),T(),h(),m(),H=`session_goal_operations`,tt=E(()=>g(f,H,{endMarker:`CREATE TABLE IF NOT EXISTS transcript_events (`,includeEndMarker:!1,errorMessage:`OpenClaw Goal operation schema markers are missing.`}),{tables:[H],indexes:[`idx_agent_session_goal_operations_expiry`]})}));function interruptHistoricalPendingInputs(e,t){t===24&&ie(e,`session_pending_inputs`,`recovery_intent_json`)&&e.exec(`UPDATE session_pending_inputs SET state = 'interrupted' WHERE state = 'queued'`)}function hasSessionPendingInputsSchema(e){return y(e,U)}function ensureSessionPendingInputsSchema(e){o(e)||(rt(e),hasPendingInputConsumptionColumn(e)||x(e,()=>ensurePendingInputConsumptionColumn(e)))}function ensureSessionInputCompletionsSchema(e){o(e)||it(e)}function ensurePendingInputConsumptionColumn(e){re(e,U,`consumed_event_id TEXT`)}function hasPendingInputConsumptionColumn(e){let t=_(e);if(t){let e=t.tableSql.get(U);return e!=null&&d(e,`session_pending_inputs`).columns.has(`consumed_event_id`)}return ie(e,U,`consumed_event_id`)}var U,W,rt,it,at=e((()=>{a(),c(),T(),ne(),h(),b(),m(),v(),U=`session_pending_inputs`,W=`session_input_completions`,rt=E(()=>g(f,U,{endMarker:`-- Processing completion`,includeEndMarker:!1,errorMessage:`OpenClaw pending-input schema marker is missing.`}),{tables:[U],indexes:[`idx_agent_session_pending_inputs_session`]}),it=E(()=>g(f,W,{endMarker:`ON session_input_completions(session_key);`,errorMessage:`OpenClaw input-completion schema marker is missing.`}),{tables:[W],indexes:[`idx_agent_session_input_completions_session_key`]})}));function sessionEntrySnapshotsSchemaSql(e){return g(e,`session_entry_snapshots`,{endMarker:`CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_updated_at`,includeEndMarker:!1})}function withoutSessionEntrySnapshotsSchema(e){return e.includes(`CREATE TABLE IF NOT EXISTS session_entry_snapshots (`)?e.replace(`  snapshot_revision INTEGER NOT NULL DEFAULT 0,
`,``).replace(sessionEntrySnapshotsSchemaSql(e),``):e}var G=e((()=>{h()}));function withDeployedTranscriptFtsRowSchema(e){let t=g(e,`session_transcript_index_state`);return e.replace(t,t.replace(`  updated_at INTEGER NOT NULL,`,`  fts_row_count INTEGER,
  updated_at INTEGER NOT NULL,`)).replace(`CREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(`,`${K}\nCREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(`)}var K,ot=e((()=>{h(),K=`CREATE TABLE IF NOT EXISTS session_transcript_fts_rows (
  session_id TEXT NOT NULL,
  fts_rowid INTEGER NOT NULL PRIMARY KEY
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_transcript_fts_rows_session
  ON session_transcript_fts_rows(session_id);
`}));function withLegacyAgentStorageSchema(e,t=21){let n=withoutSessionEntrySnapshotsSchema(e);for(let[e,t]of Object.entries(st))n=n.replace(g(n,e),t);return n.includes(`CREATE TABLE IF NOT EXISTS session_transcript_fts_rows (`)&&(n=n.replace(g(n,`session_transcript_fts_rows`,{endMarker:`INSERT OR IGNORE INTO memory_index_state`,includeEndMarker:!1}),``)),t===22?withDeployedTranscriptFtsRowSchema(n):n}var st,ct=e((()=>{h(),w(),G(),ot(),st={transcript_events:`CREATE TABLE IF NOT EXISTS transcript_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE
) STRICT;`,memory_index_chunks:`CREATE TABLE IF NOT EXISTS memory_index_chunks (
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
) STRICT;`,memory_embedding_cache:`CREATE TABLE IF NOT EXISTS memory_embedding_cache (
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  provider_key TEXT NOT NULL,
  hash TEXT NOT NULL,
  embedding TEXT NOT NULL,
  dims INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (provider, model, provider_key, hash)
) STRICT;`}}));function withLegacyCanonicalSessionValidationTriggers(e){return e.replace(`CREATE TABLE IF NOT EXISTS session_windows (`,`${q}\nCREATE TABLE IF NOT EXISTS session_windows (`).replace(`CREATE TABLE IF NOT EXISTS conversations (`,`${J}\nCREATE TABLE IF NOT EXISTS conversations (`)}function canonicalSessionValidationSchemaSql(e=f){return g(e,`session_canonical_validation_pending`,{endMarker:`CREATE TABLE IF NOT EXISTS conversations (`,includeEndMarker:!1})}function withoutCanonicalSessionValidationSchema(e){return e.includes(`CREATE TABLE IF NOT EXISTS session_canonical_validation_pending (`)?e.replace(canonicalSessionValidationSchemaSql(e),``):e}function withoutAgentJsonPredicateColumns(e){let t=e;for(let[e,n]of Object.entries(dt))t=t.replace(`  ${e} ${n},\n`,``);return t}function sessionParticipantsSchemaSql(){return g(f,be,{endMarker:`CREATE TABLE IF NOT EXISTS session_key_contract (`,includeEndMarker:!1,errorMessage:`OpenClaw session participant schema markers are missing.`})}function withLegacySessionParticipantsSchema(e){return withoutCanonicalSessionValidationSchema(e).replace(sessionParticipantsSchemaSql().trim(),ft)}function withoutOutboxEnqueueSequence(e){return e.replace(`  enqueue_sequence INTEGER PRIMARY KEY,
  advancement_key TEXT NOT NULL UNIQUE,`,`  advancement_key TEXT NOT NULL PRIMARY KEY,`)}function withLegacyAgentWriteLayout(e){return e.replace(/(CREATE TABLE IF NOT EXISTS memory_entry_origins \([\s\S]*?\n\) STRICT), WITHOUT ROWID;/u,`$1;`).replace(`ON session_windows(primary_conversation_id)`,`ON session_windows(primary_conversation_id, updated_at DESC, session_id)`).replace(`CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_sequence`,`${ht}CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_sequence`)}function getOpenClawAgentMigrationSchema(e){let t=e<39?yt:e<40?vt:e<41?_t:e<42?gt:f,n=e<39?ke(t):t,r=e<37?De(n):n,i=e<31?Ce(r):r,a=e<30?Me(i):i,o=e<29?Se(a):a,s=e<28?withLegacyAgentWriteLayout(o):o,c=e<27?withoutOutboxEnqueueSequence(s):s,l=e<26?withoutAgentJsonPredicateColumns(c):c,u=e<25?withLegacyCanonicalSessionValidationTriggers(l):l,d=e<24?withoutSessionEntrySnapshotsSchema(u):u,p=e<23?withLegacyAgentStorageSchema(d,e):d;return e<18?withLegacySessionParticipantsSchema(p):e<21?withoutCanonicalSessionValidationSchema(p):p}var q,J,lt,ut,dt,ft,pt,mt,ht,gt,_t,vt,yt,Y,bt,xt,St,X,Ct,wt,Z,Q,Tt,Et,Dt,Ot=e((()=>{if(h(),Ae(),Te(),Le(),we(),w(),Ne(),Oe(),m(),G(),ct(),Ie(),Pe(),q=`
CREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_insert
AFTER INSERT ON session_nodes
BEGIN
  UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;
END;

CREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_entry_update
AFTER UPDATE OF entry_json ON session_nodes
BEGIN
  UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;
END;

CREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_identity_update
AFTER UPDATE OF current_session_id, updated_at ON session_nodes
BEGIN
  UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;
END;
`,J=`
-- Avoid trigger-local conflict clauses: SQLite inherits the outer writer's
-- conflict policy, including writers that predate this validation projection.
CREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_insert
AFTER INSERT ON session_nodes
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT NEW.session_key
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending WHERE session_key = NEW.session_key
  );
END;

CREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_update
AFTER UPDATE OF session_key, current_session_id, entry_json, entry_valid,
  parent_session_key, spawned_by, fork_source_session_key ON session_nodes
WHEN OLD.session_key IS NOT NEW.session_key
  OR OLD.current_session_id IS NOT NEW.current_session_id
  OR OLD.entry_json IS NOT NEW.entry_json
  OR OLD.entry_valid IS NOT NEW.entry_valid
  OR OLD.parent_session_key IS NOT NEW.parent_session_key
  OR OLD.spawned_by IS NOT NEW.spawned_by
  OR OLD.fork_source_session_key IS NOT NEW.fork_source_session_key
BEGIN
  DELETE FROM session_canonical_validation_pending
  WHERE session_key = OLD.session_key AND OLD.session_key IS NOT NEW.session_key;
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT NEW.session_key
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending WHERE session_key = NEW.session_key
  );
END;

CREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_delete
AFTER DELETE ON session_nodes
BEGIN
  DELETE FROM session_canonical_validation_pending WHERE session_key = OLD.session_key;
END;

CREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_insert
AFTER INSERT ON session_windows
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE node.current_session_id = NEW.session_id
    AND NOT EXISTS (
      SELECT 1 FROM session_canonical_validation_pending AS pending
      WHERE pending.session_key = node.session_key
    );
END;

CREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_update
AFTER UPDATE OF session_id, session_key ON session_windows
WHEN OLD.session_id IS NOT NEW.session_id OR OLD.session_key IS NOT NEW.session_key
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE node.current_session_id IN (OLD.session_id, NEW.session_id)
    AND NOT EXISTS (
      SELECT 1 FROM session_canonical_validation_pending AS pending
      WHERE pending.session_key = node.session_key
    );
END;

CREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_delete
AFTER DELETE ON session_windows
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE node.current_session_id = OLD.session_id
    AND NOT EXISTS (
      SELECT 1 FROM session_canonical_validation_pending AS pending
      WHERE pending.session_key = node.session_key
    );
END;

CREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_insert
AFTER INSERT ON session_key_contract
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending AS pending
    WHERE pending.session_key = node.session_key
  );
END;

CREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_update
AFTER UPDATE OF main_key ON session_key_contract
WHEN OLD.main_key IS NOT NEW.main_key
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending AS pending
    WHERE pending.session_key = node.session_key
  );
END;

CREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_delete
AFTER DELETE ON session_key_contract
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending AS pending
    WHERE pending.session_key = node.session_key
  );
END;
`,lt=Object.freeze([...`${q}\n${J}`.matchAll(/CREATE TRIGGER IF NOT EXISTS (\w+)/gu)].map(e=>e[1])),ut={session_nodes:[`session_started_at`,`has_optional_references`],transcript_events:[`navigation_type`,`navigation_custom_type`,`navigation_display`,`message_role`,`navigation_last_type`,`navigation_last_custom_type`,`navigation_valid`],context_engine_turn_outbox:[`payload_state`]},dt={session_started_at:`INTEGER`,has_optional_references:`INTEGER NOT NULL DEFAULT 0`,payload_state:`TEXT`,navigation_type:`TEXT`,navigation_custom_type:`TEXT`,navigation_display:`INTEGER NOT NULL DEFAULT 0`,message_role:`TEXT`,navigation_last_type:`TEXT`,navigation_last_custom_type:`TEXT`,navigation_valid:`INTEGER NOT NULL DEFAULT 1`},ft=`CREATE TABLE IF NOT EXISTS session_participants (
  session_key TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_source TEXT,
  contribution_count INTEGER,
  first_prompted_at INTEGER NOT NULL,
  last_prompted_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, actor_type, actor_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;`,pt=[`session_participants.actor_source`,`session_participants.contribution_count`],mt=`
CREATE TABLE state_leases (
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
`,ht=`CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_parent
  ON transcript_event_identities(session_id, parent_id)
  WHERE parent_id IS NOT NULL;

`,gt=Fe(f),_t=je(gt),vt=Ee(_t),yt=vt.replace(/\nCREATE INDEX IF NOT EXISTS idx_agent_(?:session_input_completions_session_key|conversation_deliveries_source_session)\b[^;]*;\n/gu,``),Y=g(f,`board_tabs`,{endMarker:`CREATE TABLE IF NOT EXISTS session_progress_cards (`,includeEndMarker:!1,errorMessage:`OpenClaw agent board schema markers are missing from the canonical schema.`}),bt=Y,xt=Se(Me(Ce(De(yt)))).replace(Y,``),St=`session_progress_cards`,X=g(xt,St,{endMarker:`CREATE TABLE IF NOT EXISTS heartbeat_outcomes (`,includeEndMarker:!1,errorMessage:`OpenClaw agent progress-card schema markers are missing.`}),Ct=xt.replace(X,``),wt=`CREATE TABLE IF NOT EXISTS session_suggestions (`,Z=g(Ct,`session_members`,{endMarker:`CREATE TABLE IF NOT EXISTS heartbeat_outcomes (`,includeEndMarker:!1,errorMessage:`OpenClaw agent session-sharing schema markers are missing.`}),Q=Z.indexOf(wt),Q===-1)throw Error(`OpenClaw agent session-suggestions schema marker is missing.`);Tt=Z.slice(0,Q),Et=Z.slice(Q),Dt=withLegacySessionParticipantsSchema(withLegacyAgentStorageSchema(withLegacyCanonicalSessionValidationTriggers(withoutAgentJsonPredicateColumns(withoutOutboxEnqueueSequence(withLegacyAgentWriteLayout(Ct.replace(Z,``)))))))}));function ensureOpenClawAgentProgressCardSchemaInTransaction(e){if(!e.isTransaction)throw Error(`progress-card schema ensure requires an active transaction`);o(e)||y(e,`session_progress_cards`)||e.exec(X)}var kt=e((()=>{a(),Ot(),v()}));function ensureSessionTranscriptArchiveSchema(e){o(e)||At(e)}var $,At,jt=e((()=>{a(),T(),h(),m(),$=`session_transcript_archives`,At=E(()=>g(f,$,{endMarker:`CREATE TABLE IF NOT EXISTS transcript_rewrite_watermarks (`,includeEndMarker:!1,errorMessage:`OpenClaw session transcript archive schema markers are missing.`}),{tables:[$,`session_transcript_cold_archives`],indexes:[`idx_agent_session_transcript_archives_pending`,`idx_agent_session_transcript_archives_retention`]})})),Mt,Nt,Pt,Ft=e((()=>{ne(),b(),Mt=`standing_intents`,Nt=`standing_intents_fts`,Pt=[`standing_intents_fts_config`,`standing_intents_fts_data`,`standing_intents_fts_docsize`,`standing_intents_fts_idx`]})),It,Lt=e((()=>{A(),N(),$e(),et(),u(),w(),nt(),at(),kt(),jt(),Ft(),It={allowCompatibleAdditiveColumns:!0,allowedMissingTables:[`session_reactions`,`memory_entry_origins`,`memory_session_tombstones`,O,M,V,`message_tool_run_outcomes`,H,U,W,be,St,$,Mt,Nt,...Pt],allowedMissingColumns:[...l.map(({columnName:e,tableName:t})=>`${t}.${e}`),`standing_intents.creator_sender`,...p.map(({columnName:e,tableName:t})=>`${t}.${e}`)],allowedColumnDefinitions:{"session_pending_inputs.recovery_intent_json":[`recovery_intent_json TEXT`],"conversations.delivery_target":[`delivery_target TEXT NOT NULL DEFAULT ''`]},allowedMissingIndexes:[`idx_agent_transcript_context_pending`,`idx_agent_session_nodes_label`,`idx_agent_session_nodes_entry_not_valid`,`idx_agent_session_input_completions_session_key`,`idx_agent_conversation_deliveries_source_session`],optionalCanonicalTriggerGroups:[{tableName:`memory_index_chunks`,triggers:ge},{tableName:S,triggers:pe}]}}));export{ensureMemoryRecallMetadataSchema as $,G as A,H as B,getOpenClawAgentMigrationSchema as C,withLegacyAgentStorageSchema as D,ct as E,ensureSessionInputCompletionsSchema as F,Xe as G,nt as H,ensureSessionPendingInputsSchema as I,Ge as J,migrateMemoryIndexStorage as K,hasSessionPendingInputsSchema as L,withoutSessionEntrySnapshotsSchema as M,W as N,K as O,U as P,He as Q,at as R,canonicalSessionValidationSchemaSql as S,sessionParticipantsSchemaSql as T,$e as U,ensureSessionGoalOperationsSchema as V,migrateMemoryIndexSourcesIdentity as W,R as X,P as Y,formatErrorMessage as Z,q as _,ensureSessionTranscriptArchiveSchema as a,Y as b,kt as c,X as d,hasLegacyMemoryRecallMetadataColumns as et,Et as f,lt as g,Tt as h,$ as i,sessionEntrySnapshotsSchemaSql as j,ot as k,ut as l,Dt as m,Lt as n,ensureMemoryChunkProvenance as nt,jt as o,bt as p,F as q,Ft as r,A as rt,ensureOpenClawAgentProgressCardSchemaInTransaction as s,It as t,N as tt,dt as u,ft as v,Ot as w,mt as x,pt as y,interruptHistoricalPendingInputs as z};