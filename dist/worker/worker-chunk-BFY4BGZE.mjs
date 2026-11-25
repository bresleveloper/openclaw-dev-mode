import{n as e}from"./worker-chunk-DyeIuPEC.mjs";import{f as t}from"./worker-chunk-C8YAgWk7.mjs";import{Et as n,Tt as r,jt as i}from"./worker-chunk-BiR9J-j2.mjs";import{I as a,L as o,b as s,z as c}from"./worker-chunk-Ch6xgBQK.mjs";import{C as l,g as u,y as d}from"./worker-chunk-Zs-2p5WZ.mjs";import{A as f,Dt as p,E as ee,Et as m,Ft as te,Lt as ne,Pt as re,Q as ie,S as ae,_n as h,lt as oe,on as se,p as g,s as _,un as ce,zt as le}from"./worker-chunk-fE-Yh9a5.mjs";import{v as ue}from"./worker-chunk-CqoiIGWo.mjs";import{t as de}from"./worker-chunk-6ldbtv0b.mjs";import{o as v}from"./worker-chunk-NJiGoVJN.mjs";import{c as fe,d as y,f as b,i as pe,p as me}from"./worker-chunk-sUsEgEcj.mjs";import{d as he,s as ge}from"./worker-chunk-D6u-BY9Q.mjs";import{a as x,o as _e,t as S}from"./worker-chunk-BcMZz5w9.mjs";import{_ as ve,c as ye,d as C,f as be,g as xe,h as Se,l as Ce,m as we,p as Te,s as Ee,u as De,v as Oe}from"./worker-chunk-DCuYxPwB.mjs";import{D as ke,O as Ae,h as je,i as Me,n as Ne,o as w,u as T}from"./worker-chunk-CGuIMHsb.mjs";import{a as E,n as Pe}from"./worker-chunk-DywbUfLq.mjs";import{a as Fe,i as Ie,o as Le}from"./worker-chunk-CgWjIJzl.mjs";import{c as Re,i as D,s as ze}from"./worker-chunk-BnC9_7ll.mjs";import{c as Be,s as Ve}from"./worker-chunk-De5KBNIz.mjs";import{n as He,r as Ue}from"./worker-chunk-B6Nt93nv.mjs";import{t as We}from"./worker-chunk-io93nSde.mjs";import{i as Ge,l as Ke,m as qe,p as Je,t as Ye,u as Xe}from"./worker-chunk-CPx0t9fo.mjs";import{n as O,t as Ze}from"./worker-chunk-C20Wb4uM.mjs";import{m as Qe,p as $e}from"./worker-chunk-bKacM27u.mjs";import{i as et,o as k,r as A}from"./worker-chunk-D8P70tLP.mjs";import{B as tt,E as nt,H as rt,I as it,K as at,L as ot,Q as st,T as ct,Z as lt,_ as ut,a as dt,c as ft,m as pt,n as mt,p as ht,q as gt,u as _t,v as vt}from"./worker-chunk-CKcNZCxe.mjs";import{n as j,t as M}from"./worker-chunk-Bo574kZt.mjs";import{n as yt}from"./worker-chunk-Bp5ZlNnG.mjs";import bt from"node:path";import{stat as xt}from"node:fs/promises";import{randomUUID as St}from"node:crypto";function init_openclaw_runtime_sqlite(){return(init_openclaw_runtime_sqlite=e((()=>{yt(),Je(),Ke(),T(),j(),g(),Pe(),pe(),D(),ve()})))()}function ensureMemoryChunkProvenance(e){let ensure=()=>{let t=w(e);(t?t.triggers.has(P):We(e)(`memory_index_chunks`)?.triggers.some(({name:e})=>e===P))&&e.exec(`DROP TRIGGER ${P}`),wt(e),backfillMemoryChunkProvenance(e)};e.isTransaction?ensure():E(e,ensure)}function backfillMemoryChunkProvenance(e){let backfill=()=>{let t=e.prepare(`
      WITH missing AS MATERIALIZED (${Tt}),
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
      WITH missing AS MATERIALIZED (${Tt})
      INSERT OR IGNORE INTO ${N} (
        chunk_id, origin_class, session_kind, observed_at
      )
      SELECT chunk.id, 'untrusted', 'unknown', chunk.updated_at
      FROM missing
      JOIN memory_index_chunks AS chunk ON chunk.id = missing.id;
    `),t>0&&e.exec(`UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1`)};e.isTransaction?backfill():E(e,backfill)}var N,Ct,wt,P,Tt;function init_memory_schema_provenance(){return(init_memory_schema_provenance=e((()=>{init_openclaw_runtime_sqlite(),N=`memory_index_chunk_provenance`,Ct=`
  CREATE TABLE IF NOT EXISTS ${N} (
    chunk_id TEXT PRIMARY KEY,
    origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),
    session_kind TEXT NOT NULL CHECK (session_kind IN ('interactive', 'cron', 'heartbeat', 'subagent', 'unknown')),
    observed_at INTEGER NOT NULL,
    supersedes_key TEXT,
    FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE
  ) STRICT;
`,wt=M(()=>Ct,{tables:[N]}),P=`memory_index_chunk_provenance_after_insert`,Tt=`
  SELECT chunk.id
  FROM memory_index_chunks AS chunk
  LEFT JOIN ${N} AS provenance
    ON provenance.chunk_id = chunk.id
  WHERE provenance.chunk_id IS NULL
`})))()}function readMemoryChunkColumns(e){let t=e.prepare(`PRAGMA table_info(${F})`).all();return new Set(t.flatMap(e=>typeof e.name==`string`?[e.name]:[]))}function tableExists$1(e,t){return!!e.prepare(`SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ? LIMIT 1`).get(t)}function legacyRecallMetadataColumns(e){let t=readMemoryChunkColumns(e);return[`importance`,`triggers`,`project_key`].filter(e=>t.has(e))}function hasLegacyMemoryRecallMetadataColumns(e){return legacyRecallMetadataColumns(e).length>0}function ensureMemoryRecallMetadataSchema(e){if(legacyRecallMetadataColumns(e).length===0&&tableExists$1(e,`memory_index_chunk_recall_metadata`))return;let ensure=()=>{e.exec(Et);let t=new Set(legacyRecallMetadataColumns(e));if(t.size===0)return;let n=t.has(`importance`)?`importance`:`NULL`,r=t.has(`triggers`)?`triggers`:`NULL`,i=t.has(`project_key`)?`project_key`:`NULL`;e.exec(`
      INSERT INTO ${I} (
        chunk_id, importance, triggers, project_key
      )
      SELECT id, ${n}, ${r}, ${i}
      FROM ${F}
      WHERE ${n} IS NOT NULL
         OR ${r} IS NOT NULL
         OR ${i} IS NOT NULL
      ON CONFLICT(chunk_id) DO UPDATE SET
        importance=excluded.importance,
        triggers=excluded.triggers,
        project_key=excluded.project_key;
    `);for(let n of[`project_key`,`triggers`,`importance`])t.has(n)&&e.exec(`ALTER TABLE ${F} DROP COLUMN ${n}`)};e.isTransaction?ensure():E(e,ensure)}var F,I,Et;function init_memory_schema_recall(){return(init_memory_schema_recall=e((()=>{init_openclaw_runtime_sqlite(),F=`memory_index_chunks`,I=`memory_index_chunk_recall_metadata`,Et=`
  CREATE TABLE IF NOT EXISTS ${I} (
    chunk_id TEXT PRIMARY KEY,
    importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10),
    triggers TEXT,
    project_key TEXT,
    FOREIGN KEY (chunk_id) REFERENCES ${F}(id) ON DELETE CASCADE
  ) STRICT;
`})))()}function init_error_utils(){return(init_error_utils=e((()=>{ue()})))()}function buildMemoryEmbeddingCacheSchema(e){return`
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
  ) STRICT;`}function buildMemoryStorageSchema(e){let t=e.chunks?e.legacy?Ot:Dt:e.legacy?legacyCacheSchema(e.table):buildMemoryEmbeddingCacheSchema(e.table),n=At.filter(([t])=>e.inlineRecallColumns?.includes(t));return e.chunks&&n.length>0&&(t=t.replace(`updated_at INTEGER NOT NULL`,`updated_at INTEGER NOT NULL,\n${n.map(([,e])=>e).join(`,
`)}`)),e.strict||(t=t.replace(`) STRICT;`,`);`)),t+memoryStorageIndexes(e.table,e.chunks).map(t=>`CREATE INDEX ${t.name} ON ${e.table}(${t.columns});`).join(`
`)}function memoryStorageIndexes(e,t){return t?kt:[{name:e===`memory_embedding_cache`?`idx_memory_embedding_cache_updated_at`:`idx_embedding_cache_updated_at`,columns:`updated_at`}]}var L,Dt,Ot,kt,At;function init_memory_schema_base(){return(init_memory_schema_base=e((()=>{init_memory_schema_provenance(),init_memory_schema_recall(),init_openclaw_runtime_sqlite(),L=`memory_embedding_cache`,Dt=`
  CREATE TABLE IF NOT EXISTS ${ye} (
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
`,Ot=`
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
`,kt=[{name:`idx_memory_index_chunks_path_source`,columns:`path, source`},{name:`idx_memory_index_chunks_path`,columns:`path`},{name:`idx_memory_index_chunks_source`,columns:`source`}],At=[[`importance`,`importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10)`],[`triggers`,`triggers TEXT`],[`project_key`,`project_key TEXT`]]})))()}function memorySchemaSource(e,t){if(t===`memory_embedding_cache`)return e;let n=qe(e);if(!n)throw Error(`Memory schema has no generated catalog; run pnpm db:postgres:gen.`);let rename=e=>e.replaceAll(L,t);return{views:n.views,tables:n.tables.map(e=>e.name===`memory_embedding_cache`?{...e,name:t,sql:e.sql===null?null:rename(e.sql),indexes:e.indexes.map(e=>({...e,name:e.name===`idx_memory_embedding_cache_updated_at`?`idx_embedding_cache_updated_at`:rename(e.name),sql:e.sql===null?null:rename(e.sql).replace(`idx_${t}_updated_at`,`idx_embedding_cache_updated_at`)}))}:e)}}function init_memory_schema_catalog(){return(init_memory_schema_catalog=e((()=>{init_memory_schema_base(),init_openclaw_runtime_sqlite()})))()}function encodeMemoryEmbedding(e){let t=new Uint8Array(e.length*8),n=new DataView(t.buffer);for(let t=0;t<e.length;t+=1){let r=e[t];if(typeof r!=`number`||!Number.isFinite(r))throw Error(`Memory embeddings require finite numeric coordinates`);n.setFloat64(t*8,r,!0)}return t}function decodeMemoryEmbedding(e){if(e.byteLength%8!=0)return[];let t=new DataView(e.buffer,e.byteOffset,e.byteLength),n=[];for(let r=0;r<e.byteLength;r+=8){let e=t.getFloat64(r,!0);if(!Number.isFinite(e))return[];n.push(e)}return n}function storageShape(e,t,n,r){let i=columns(e,t);if(i.size===0)return`absent`;let a=i.get(`embedding`)===`TEXT`?`legacy`:i.get(`embedding`)===`BLOB`?`binary`:void 0;if(!a||n&&i.has(`chunk_rowid`)!==(a===`binary`))throw Error(`Unsupported partial memory storage schema: ${t}`);let o=a!==`legacy`||e.prepare(`SELECT strict FROM pragma_table_list WHERE schema = 'main' AND name = ?`).get(t)?.strict!==0,s=memoryStorageIndexes(t,n),c=buildMemoryStorageSchema({table:n?t:L,chunks:n,legacy:a===`legacy`,strict:o,inlineRecallColumns:At.filter(([e])=>i.has(e)).map(([e])=>e)});return Ye(e,`memory storage ${t}`,memorySchemaSource(c,n?L:t),{allowCompatibleAdditiveColumns:a===`binary`,allowedMissingIndexes:s.map(e=>e.name),optionalCanonicalTriggerGroups:n?[{tableName:t,triggers:jt},{tableName:t,triggers:Ee}]:[]},r),a===`legacy`&&assertKnownRebuildDependents(e,t,s.map(e=>e.name),n?[...jt.map(e=>e.name),...Ee.map(e=>e.name)]:[]),a}function assertKnownRebuildDependents(e,t,n,r){let i=/* @__PURE__ */ new Set([...n,...r]),a=e.prepare(`
    SELECT type, name, tbl_name FROM main.sqlite_schema
    WHERE (type IN ('trigger', 'index') AND tbl_name = ? AND sql IS NOT NULL)
       OR (type IN ('view', 'trigger') AND instr(lower(sql), ?) > 0)
  `).all(t,t).find(e=>e.tbl_name!==t||!i.has(String(e.name)));if(a)throw Error(`Memory storage migration cannot rebuild unknown ${String(a.type)} ${String(a.name)} on ${t}`);for(let n of e.prepare(`SELECT name FROM main.sqlite_schema WHERE type = 'table'`).all()){let r=String(n.name),i=e.prepare(`PRAGMA main.foreign_key_list("${r.replaceAll(`"`,`""`)}")`).all().filter(e=>e.table===t),a=t===`memory_index_chunks`&&[`memory_index_chunk_provenance`,`memory_index_chunk_recall_metadata`].includes(r);if(i.some(e=>!a||e.from!==`chunk_id`||e.to!==`id`||e.on_delete!==`CASCADE`||e.on_update!==`NO ACTION`))throw Error(`Memory storage migration cannot rebuild ${t} referenced by an unknown foreign key in ${r}`)}}function storageShapes(e,t){let n=Me(e)?We(e):void 0;return{chunks:storageShape(e,`memory_index_chunks`,!0,n),cache:storageShape(e,t,!1,n)}}function assertBinaryEmbeddings(e,t){let n=e.prepare(`SELECT openclaw_memory_embedding_blob_valid(embedding) AS valid FROM ${t}`);for(let e of n.iterate())if(e.valid===0)throw Error(`Memory storage migration found invalid binary embeddings in ${t}`)}function copyMemoryStorageRows(e,t,n){let r=e.prepare(`SELECT rowid AS storage_rowid FROM ${t}`);r.setReadBigInts(!0);let i=e.prepare(n);i.setReadBigInts(!0);for(let e of r.iterate()){if(typeof e.storage_rowid!=`bigint`)throw Error(`Invalid memory storage identity during migration`);i.run(e.storage_rowid)}}function markInvalidMemoryEmbeddings(e,t){let n=e.prepare(t);n.setReadBigInts(!0);let r=e.prepare(`
    UPDATE main.memory_index_sources SET hash = ''
    WHERE (path, source) IN (
      SELECT path, source FROM main.memory_index_chunks WHERE rowid = ?
    )`);r.setReadBigInts(!0);let i=!1;for(let e of n.iterate())if(e.valid===0){if(typeof e.storage_rowid!=`bigint`)throw Error(`Invalid memory storage identity during migration`);r.run(e.storage_rowid),i=!0}i&&(e.exec(`
      INSERT INTO main.memory_index_meta (key, value)
      VALUES ('memory_vector_rebuild_v1', '1')
      ON CONFLICT(key) DO UPDATE SET value = excluded.value;
    `),ze(e,`memory_index_state`)&&e.exec(`UPDATE main.memory_index_state SET revision = revision + 1 WHERE id = 1`))}function legacyEmbedding(e){if(typeof e==`string`)try{let t=JSON.parse(e);return Array.isArray(t)&&t.every(e=>typeof e==`number`&&Number.isFinite(e))?t:void 0}catch{return}}function copyLegacyMemoryEmbeddingCache(e,t,n,r){let i=1048576,a=e.prepare(`
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
  `);for(let t of n)e.exec(t)}function columns(e,t){return new Map(e.prepare(`SELECT name, type FROM pragma_table_info(?)`).all(t).map(e=>[String(e.name),String(e.type).toUpperCase()]))}function migrateMemoryIndexStorage(e,t={}){let n=t.embeddingCacheTable??`memory_embedding_cache`;if(!/^[A-Za-z_][A-Za-z0-9_]*$/u.test(n))throw Error(`Invalid memory embedding cache table identifier`);let r=storageShapes(e,n),i=r.chunks===`legacy`,a=r.cache===`legacy`;if(!i&&!a)return;let o=Number(e.prepare(`PRAGMA foreign_keys`).get()?.foreign_keys)!==0;if(i&&o&&e.isTransaction)throw Error(`Memory storage migration requires foreign keys disabled before BEGIN`);i&&o&&e.exec(`PRAGMA foreign_keys = OFF`);let s;try{E(e,()=>{let o=registerMemoryEmbeddingMigrationFunctions(e,t.renewAuthority),c=i?existingStorageObjects(e,`memory_index_chunks`):[],l=a?existingStorageObjects(e,n):[];if(r.chunks===`binary`&&assertBinaryEmbeddings(e,`memory_index_chunks`),r.cache===`binary`&&assertBinaryEmbeddings(e,n),i&&(Te(e),ensureMemoryRecallMetadataSchema(e),markInvalidMemoryEmbeddings(e,`
          SELECT rowid AS storage_rowid,
                 openclaw_memory_embedding_json_valid(embedding) AS valid
          FROM memory_index_chunks
        `),e.exec(Dt.replace(`CREATE TABLE IF NOT EXISTS`,`CREATE TABLE`).replace(`memory_index_chunks`,`memory_index_chunks_storage_migration`)),copyMemoryStorageRows(e,`memory_index_chunks`,`
          INSERT INTO memory_index_chunks_storage_migration (
            chunk_rowid, id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
          )
          SELECT rowid, id, path, source, start_line, end_line, hash, model, text,
                 openclaw_memory_embedding_from_json(embedding), updated_at
          FROM memory_index_chunks WHERE rowid = ?
        `),replaceStorageTable(e,`memory_index_chunks`,c),e.prepare(`SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?`).get(`memory_index_chunks_fts`)&&(Oe(e,Ce),Se(e))),a){let t=`${n}_storage_migration`;e.exec(buildMemoryEmbeddingCacheSchema(t).replace(`CREATE TABLE IF NOT EXISTS`,`CREATE TABLE`)),s=copyLegacyMemoryEmbeddingCache(e,n,t,o),replaceStorageTable(e,n,l)}if(i){for(let t of[`memory_index_chunk_provenance`,`memory_index_chunk_recall_metadata`])if(columns(e,t).size>0&&e.prepare(`PRAGMA foreign_key_check(${t})`).all().length>0)throw Error(`Memory storage migration failed foreign key validation`)}})}finally{t.renewAuthority&&registerMemoryEmbeddingMigrationFunctions(e),i&&o&&e.exec(`PRAGMA foreign_keys = ON`)}s&&(t.onWarning?t.onWarning(s):process.emitWarning(s))}var jt;function init_memory_schema_storage_migration(){return(init_memory_schema_storage_migration=e((()=>{init_memory_schema_base(),init_memory_schema_catalog(),init_memory_schema_recall(),init_openclaw_runtime_sqlite(),jt=[`insert`,`update`,`delete`].map(e=>({name:`memory_index_chunks_revision_after_${e}`,sql:`CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_${e}
    AFTER ${e.toUpperCase()} ON memory_index_chunks
    BEGIN UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1; END;`}))})))()}function tableColumnInfo(e,t){let n=w(e);return n&&![...n.tables,...n.views].some(e=>e.toLowerCase()===t.toLowerCase())?[]:e.prepare(`PRAGMA main.table_xinfo(${t})`).all().flatMap(e=>typeof e.name==`string`&&typeof e.type==`string`?[{name:e.name,type:e.type.toUpperCase(),notnull:Number(e.notnull??0),pk:Number(e.pk??0),defaultValue:typeof e.dflt_value==`string`?e.dflt_value:null,hidden:Number(e.hidden??0)}]:[])}function tableHasExactColumns(e,t,n,r){let i=new Set((r??tableColumnInfo(e,t)).map(e=>e.name));return i.size===n.length&&n.every(e=>i.has(e))}function tableHasPrimaryKey(e,t,n,r){let i=(r??tableColumnInfo(e,t)).filter(e=>e.pk>0).toSorted((e,t)=>e.pk-t.pk).map(e=>e.name);return i.length===n.length&&i.every((e,t)=>e===n[t])}function tableHasUniqueIndex(e,t,n){let r=e.prepare(`SELECT name, partial FROM pragma_index_list(?) WHERE "unique" = 1`).all(t);return r.length===1&&r.some(t=>{if(typeof t.name!=`string`||Number(t.partial??0)!==0)return!1;let r=e.prepare(`SELECT cid, name, coll, "desc" AS sort_desc, key FROM pragma_index_xinfo(?) ORDER BY seqno`).all(t.name).filter(e=>Number(e.key??0)===1);return r.length===n.length&&r.every((e,t)=>Number(e.cid??-1)>=0&&e.name===n[t]&&e.coll===`BINARY`&&Number(e.sort_desc??0)===0)})}function tableHasNoDeclaredCollations(e,t){let n=e.prepare(`SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = ?`).get(t);return typeof n?.sql==`string`&&!/\bCOLLATE\b/iu.test(n.sql)}function tableHasSourceColumnContract(e,t,n){return(n??tableColumnInfo(e,`memory_index_sources`)).every(e=>(e.type===Pt.get(e.name)||e.name===`mtime`&&e.type===`INTEGER`)&&e.defaultValue===(e.name===`source`?`'memory'`:null)&&e.hidden===0&&(e.name===t||e.notnull===1))}function tableHasIntegerRowIdPrimaryKey(e,t){return(t??tableColumnInfo(e,`memory_index_sources`)).find(e=>e.name===`id`)?.type!==`INTEGER`||!tableHasPrimaryKey(e,`memory_index_sources`,[`id`],t)?!1:e.prepare(`SELECT 1 AS found FROM pragma_index_list(?) WHERE origin = 'pk' LIMIT 1`).get(C)?.found!==1}function tableExists(e,t){let n=w(e);return n?n.tables.has(t):e.prepare(`SELECT 1 AS found FROM sqlite_master WHERE type = 'table' AND name = ?`).get(t)?.found===1}function migrateMemoryIndexSourcesIdentity(e){if(!tableExists(e,`memory_index_sources`))return;let t=Me(e)?tableColumnInfo(e,C):void 0;if(tableHasExactColumns(e,`memory_index_sources`,Nt,t)){if(tableHasSourceColumnContract(e,`id`,t)&&tableHasIntegerRowIdPrimaryKey(e,t)&&tableHasNoDeclaredCollations(e,`memory_index_sources`)&&tableHasUniqueIndex(e,`memory_index_sources`,[`path`,`source`]))return;throw Error(`canonical memory source identity schema is invalid`)}if(!tableHasExactColumns(e,`memory_index_sources`,Mt,t))throw Error(`canonical memory source identity schema is invalid`);let n=tableHasPrimaryKey(e,C,[`path`],t),r=tableHasPrimaryKey(e,C,[`path`,`source`],t);if(!n&&!r||!tableHasSourceColumnContract(e,n?`path`:void 0,t))throw Error(`canonical memory source identity schema is invalid`);let i=tableExists(e,De);e.exec(`SAVEPOINT migrate_memory_index_sources_identity`);try{we(e),e.exec(`
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_insert;
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_update;
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_delete;

      ALTER TABLE ${C}
        RENAME TO memory_index_sources_identity_migration;
      CREATE TABLE ${C} (
        id INTEGER PRIMARY KEY,
        path TEXT NOT NULL,
        source TEXT NOT NULL DEFAULT 'memory',
        hash TEXT NOT NULL,
        mtime REAL NOT NULL,
        size INTEGER NOT NULL,
        UNIQUE (path, source)
      ) STRICT;
      INSERT INTO ${C} (id, path, source, hash, mtime, size)
      SELECT rowid, path, source, hash, mtime, size
      FROM memory_index_sources_identity_migration;
      DROP TABLE memory_index_sources_identity_migration;
    `),i&&(e.exec(`
        DELETE FROM ${De};
        INSERT INTO ${De} (rowid, path, source)
        SELECT id, path, source FROM ${C};
      `),xe(e)),e.exec(`RELEASE migrate_memory_index_sources_identity`)}catch(t){throw e.exec(`ROLLBACK TO migrate_memory_index_sources_identity`),e.exec(`RELEASE migrate_memory_index_sources_identity`),t}}var Mt,Nt,Pt;function init_memory_schema(){return(init_memory_schema=e((()=>{init_error_utils(),init_memory_schema_base(),init_memory_schema_catalog(),init_memory_schema_provenance(),init_memory_schema_recall(),init_memory_schema_storage_migration(),init_openclaw_runtime_sqlite(),Mt=[`path`,`source`,`hash`,`mtime`,`size`],Nt=[`id`,...Mt],Pt=/* @__PURE__ */ new Map([[`id`,`INTEGER`],[`path`,`TEXT`],[`source`,`TEXT`],[`hash`,`TEXT`],[`mtime`,`REAL`],[`size`,`INTEGER`]])})))()}var R;function init_openclaw_agent_context_engine_turn_outbox_schema(){return(init_openclaw_agent_context_engine_turn_outbox_schema=e((()=>{j(),x(),p(),R=`context_engine_turn_outbox`,M(()=>S(m,R,{endMarker:`CREATE TABLE IF NOT EXISTS cache_entries (`,includeEndMarker:!1,errorMessage:`OpenClaw context-engine turn outbox schema markers are missing.`}),{tables:[R],indexes:[`idx_agent_context_engine_turn_outbox_engine`]})})))()}var z;function init_openclaw_agent_goal_operations_schema(){return(init_openclaw_agent_goal_operations_schema=e((()=>{j(),x(),p(),z=`session_goal_operations`,M(()=>S(m,z,{endMarker:`CREATE TABLE IF NOT EXISTS transcript_events (`,includeEndMarker:!1,errorMessage:`OpenClaw Goal operation schema markers are missing.`}),{tables:[z],indexes:[`idx_agent_session_goal_operations_expiry`]})})))()}function interruptHistoricalPendingInputs(e,t){t===24&&Re(e,`session_pending_inputs`,`recovery_intent_json`)&&e.exec(`UPDATE session_pending_inputs SET state = 'interrupted' WHERE state = 'queued'`)}var B,V;function init_openclaw_agent_pending_inputs_schema(){return(init_openclaw_agent_pending_inputs_schema=e((()=>{j(),T(),x(),Pe(),p(),D(),B=`session_pending_inputs`,V=`session_input_completions`,M(()=>S(m,B,{endMarker:`-- Processing completion`,includeEndMarker:!1,errorMessage:`OpenClaw pending-input schema marker is missing.`}),{tables:[B],indexes:[`idx_agent_session_pending_inputs_session`]}),M(()=>S(m,V,{endMarker:`ON session_input_completions(session_key);`,errorMessage:`OpenClaw input-completion schema marker is missing.`}),{tables:[V],indexes:[`idx_agent_session_input_completions_session_key`]})})))()}function sessionEntrySnapshotsSchemaSql(e){return S(e,`session_entry_snapshots`,{endMarker:`CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_updated_at`,includeEndMarker:!1})}function withoutSessionEntrySnapshotsSchema(e){return e.includes(`CREATE TABLE IF NOT EXISTS session_entry_snapshots (`)?e.replace(`  snapshot_revision INTEGER NOT NULL DEFAULT 0,
`,``).replace(sessionEntrySnapshotsSchemaSql(e),``):e}function init_openclaw_agent_session_snapshots_schema(){return(init_openclaw_agent_session_snapshots_schema=e((()=>{x()})))()}function withDeployedTranscriptFtsRowSchema(e){let t=S(e,`session_transcript_index_state`);return e.replace(t,t.replace(`  updated_at INTEGER NOT NULL,`,`  fts_row_count INTEGER,
  updated_at INTEGER NOT NULL,`)).replace(`CREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(`,`${Ft}\nCREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(`)}var Ft;function init_openclaw_agent_transcript_fts_schema_source(){return(init_openclaw_agent_transcript_fts_schema_source=e((()=>{x(),Ft=`CREATE TABLE IF NOT EXISTS session_transcript_fts_rows (
  session_id TEXT NOT NULL,
  fts_rowid INTEGER NOT NULL PRIMARY KEY
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_transcript_fts_rows_session
  ON session_transcript_fts_rows(session_id);
`})))()}function withLegacyAgentStorageSchema(e,t=21){let n=withoutSessionEntrySnapshotsSchema(e);for(let[e,t]of Object.entries(It))n=n.replace(S(n,e),t);return n.includes(`CREATE TABLE IF NOT EXISTS session_transcript_fts_rows (`)&&(n=n.replace(S(n,`session_transcript_fts_rows`,{endMarker:`INSERT OR IGNORE INTO memory_index_state`,includeEndMarker:!1}),``)),t===22?withDeployedTranscriptFtsRowSchema(n):n}var It;function init_openclaw_agent_storage_schema(){return(init_openclaw_agent_storage_schema=e((()=>{x(),O(),init_openclaw_agent_session_snapshots_schema(),init_openclaw_agent_transcript_fts_schema_source(),It={transcript_events:`CREATE TABLE IF NOT EXISTS transcript_events (
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
) STRICT;`}})))()}function withLegacyCanonicalSessionValidationTriggers(e){return e.replace(`CREATE TABLE IF NOT EXISTS session_windows (`,`${H}\nCREATE TABLE IF NOT EXISTS session_windows (`).replace(`CREATE TABLE IF NOT EXISTS conversations (`,`${Lt}\nCREATE TABLE IF NOT EXISTS conversations (`)}function canonicalSessionValidationSchemaSql(e=m){return S(e,`session_canonical_validation_pending`,{endMarker:`CREATE TABLE IF NOT EXISTS conversations (`,includeEndMarker:!1})}function withoutCanonicalSessionValidationSchema(e){return e.includes(`CREATE TABLE IF NOT EXISTS session_canonical_validation_pending (`)?e.replace(canonicalSessionValidationSchemaSql(e),``):e}function withoutAgentJsonPredicateColumns(e){let t=e;for(let[e,n]of Object.entries(Bt))t=t.replace(`  ${e} ${n},\n`,``);return t}function sessionParticipantsSchemaSql(){return S(m,Ze,{endMarker:`CREATE TABLE IF NOT EXISTS session_key_contract (`,includeEndMarker:!1,errorMessage:`OpenClaw session participant schema markers are missing.`})}function withLegacySessionParticipantsSchema(e){return withoutCanonicalSessionValidationSchema(e).replace(sessionParticipantsSchemaSql().trim(),Vt)}function withoutOutboxEnqueueSequence(e){return e.replace(`  enqueue_sequence INTEGER PRIMARY KEY,
  advancement_key TEXT NOT NULL UNIQUE,`,`  advancement_key TEXT NOT NULL PRIMARY KEY,`)}function withLegacyAgentWriteLayout(e){return e.replace(/(CREATE TABLE IF NOT EXISTS memory_entry_origins \([\s\S]*?\n\) STRICT), WITHOUT ROWID;/u,`$1;`).replace(`ON session_windows(primary_conversation_id)`,`ON session_windows(primary_conversation_id, updated_at DESC, session_id)`).replace(`CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_sequence`,`${Wt}CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_sequence`)}function getOpenClawAgentMigrationSchema(e){let t=e<39?Jt:e<40?qt:e<41?Kt:e<42?Gt:m,n=e<39?rt(t):t,r=e<37?gt(n):n,i=e<31?pt(r):r,a=e<30?dt(i):i,o=e<29?vt(a):a,s=e<28?withLegacyAgentWriteLayout(o):o,c=e<27?withoutOutboxEnqueueSequence(s):s,l=e<26?withoutAgentJsonPredicateColumns(c):c,u=e<25?withLegacyCanonicalSessionValidationTriggers(l):l,d=e<24?withoutSessionEntrySnapshotsSchema(u):u,f=e<23?withLegacyAgentStorageSchema(d,e):d;return e<18?withLegacySessionParticipantsSchema(f):e<21?withoutCanonicalSessionValidationSchema(f):f}var H,Lt,Rt,zt,Bt,Vt,Ht,Ut,Wt,Gt,Kt,qt,Jt,U,Yt,Xt,Zt,W,Qt,$t,G,K,en,tn,nn;function init_openclaw_agent_schema_history(){return(init_openclaw_agent_schema_history=e((()=>{if(x(),lt(),at(),tt(),it(),O(),ut(),ht(),p(),init_openclaw_agent_session_snapshots_schema(),init_openclaw_agent_storage_schema(),ft(),mt(),H=`
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
`,Lt=`
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
`,Rt=Object.freeze([...`${H}\n${Lt}`.matchAll(/CREATE TRIGGER IF NOT EXISTS (\w+)/gu)].map(e=>e[1])),zt={session_nodes:[`session_started_at`,`has_optional_references`],transcript_events:[`navigation_type`,`navigation_custom_type`,`navigation_display`,`message_role`,`navigation_last_type`,`navigation_last_custom_type`,`navigation_valid`],context_engine_turn_outbox:[`payload_state`]},Bt={session_started_at:`INTEGER`,has_optional_references:`INTEGER NOT NULL DEFAULT 0`,payload_state:`TEXT`,navigation_type:`TEXT`,navigation_custom_type:`TEXT`,navigation_display:`INTEGER NOT NULL DEFAULT 0`,message_role:`TEXT`,navigation_last_type:`TEXT`,navigation_last_custom_type:`TEXT`,navigation_valid:`INTEGER NOT NULL DEFAULT 1`},Vt=`CREATE TABLE IF NOT EXISTS session_participants (
  session_key TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_source TEXT,
  contribution_count INTEGER,
  first_prompted_at INTEGER NOT NULL,
  last_prompted_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, actor_type, actor_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;`,Ht=[`session_participants.actor_source`,`session_participants.contribution_count`],Ut=`
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
`,Wt=`CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_parent
  ON transcript_event_identities(session_id, parent_id)
  WHERE parent_id IS NOT NULL;

`,Gt=_t(m),Kt=st(Gt),qt=ot(Kt),Jt=qt.replace(/\nCREATE INDEX IF NOT EXISTS idx_agent_(?:session_input_completions_session_key|conversation_deliveries_source_session)\b[^;]*;\n/gu,``),U=S(m,`board_tabs`,{endMarker:`CREATE TABLE IF NOT EXISTS session_progress_cards (`,includeEndMarker:!1,errorMessage:`OpenClaw agent board schema markers are missing from the canonical schema.`}),Yt=U,Xt=vt(dt(pt(gt(Jt)))).replace(U,``),Zt=`session_progress_cards`,W=S(Xt,Zt,{endMarker:`CREATE TABLE IF NOT EXISTS heartbeat_outcomes (`,includeEndMarker:!1,errorMessage:`OpenClaw agent progress-card schema markers are missing.`}),Qt=Xt.replace(W,``),$t=`CREATE TABLE IF NOT EXISTS session_suggestions (`,G=S(Qt,`session_members`,{endMarker:`CREATE TABLE IF NOT EXISTS heartbeat_outcomes (`,includeEndMarker:!1,errorMessage:`OpenClaw agent session-sharing schema markers are missing.`}),K=G.indexOf($t),K===-1)throw Error(`OpenClaw agent session-suggestions schema marker is missing.`);en=G.slice(0,K),tn=G.slice(K),nn=withLegacySessionParticipantsSchema(withLegacyAgentStorageSchema(withLegacyCanonicalSessionValidationTriggers(withoutAgentJsonPredicateColumns(withoutOutboxEnqueueSequence(withLegacyAgentWriteLayout(Qt.replace(G,``)))))))})))()}function ensureOpenClawAgentProgressCardSchemaInTransaction(e){if(!e.isTransaction)throw Error(`progress-card schema ensure requires an active transaction`);b(e)||ze(e,`session_progress_cards`)||e.exec(W)}function init_openclaw_agent_progress_card_schema(){return(init_openclaw_agent_progress_card_schema=e((()=>{y(),init_openclaw_agent_schema_history(),D()})))()}var q;function init_openclaw_agent_session_transcript_archive_schema(){return(init_openclaw_agent_session_transcript_archive_schema=e((()=>{j(),x(),p(),q=`session_transcript_archives`,M(()=>S(m,q,{endMarker:`CREATE TABLE IF NOT EXISTS transcript_rewrite_watermarks (`,includeEndMarker:!1,errorMessage:`OpenClaw session transcript archive schema markers are missing.`}),{tables:[q,`session_transcript_cold_archives`],indexes:[`idx_agent_session_transcript_archives_pending`,`idx_agent_session_transcript_archives_retention`]})})))()}var rn,an,on;function init_openclaw_agent_standing_intents_schema(){return(init_openclaw_agent_standing_intents_schema=e((()=>{T(),Pe(),rn=`standing_intents`,an=`standing_intents_fts`,on=[`standing_intents_fts_config`,`standing_intents_fts_data`,`standing_intents_fts_docsize`,`standing_intents_fts_idx`]})))()}var sn;function init_openclaw_agent_db_schema_compatibility(){return(init_openclaw_agent_db_schema_compatibility=e((()=>{init_memory_schema_provenance(),init_memory_schema_recall(),init_memory_schema(),init_openclaw_agent_context_engine_turn_outbox_schema(),le(),O(),init_openclaw_agent_goal_operations_schema(),init_openclaw_agent_pending_inputs_schema(),init_openclaw_agent_progress_card_schema(),init_openclaw_agent_session_transcript_archive_schema(),init_openclaw_agent_standing_intents_schema(),sn={allowCompatibleAdditiveColumns:!0,allowedMissingTables:[`session_reactions`,`memory_entry_origins`,`memory_session_tombstones`,N,I,R,`message_tool_run_outcomes`,z,B,V,Ze,Zt,q,rn,an,...on],allowedMissingColumns:[...ne.map(({columnName:e,tableName:t})=>`${t}.${e}`),`standing_intents.creator_sender`,...te.map(({columnName:e,tableName:t})=>`${t}.${e}`)],allowedColumnDefinitions:{"session_pending_inputs.recovery_intent_json":[`recovery_intent_json TEXT`],"conversations.delivery_target":[`delivery_target TEXT NOT NULL DEFAULT ''`]},allowedMissingIndexes:[`idx_agent_transcript_context_pending`,`idx_agent_session_nodes_label`,`idx_agent_session_nodes_entry_not_valid`,`idx_agent_session_input_completions_session_key`,`idx_agent_conversation_deliveries_source_session`],optionalCanonicalTriggerGroups:[{tableName:`memory_index_chunks`,triggers:Ee},{tableName:C,triggers:be}]}})))()}function recordOpenClawAgentDatabaseReadOpenFailure(e){typeof e==`object`&&e&&oe(e)!==void 0&&cn.add(e)}function classifyOpenClawAgentDatabaseReadError(e,t){if(b(e))return t;try{let n=Ge(e,m,sn).filter(e=>e.code===`missing-table`).map(e=>e.objectName);return n.length>0?new Ve(`table-missing`,{cause:t},n):t}catch{return t}}var cn;function init_openclaw_agent_db_read_error(){return(init_openclaw_agent_db_read_error=e((()=>{y(),ie(),Ke(),d(),init_openclaw_agent_db_schema_compatibility(),p(),Be(),cn=l(Symbol.for(`openclaw.agentDatabaseSettledReadOpenFailures`),()=>/* @__PURE__ */ new WeakSet)})))()}function readDefinitions(e,t){let n=/* @__PURE__ */ new Map,r=`session_canonical_validation_pending`,i=t?[...t.tableSql.has(r)?[{name:r,sql:t.tableSql.get(r)}]:[],...Array.from(t.triggers).flatMap(([e,t])=>e===r||ln.has(t.table)?[{name:e,sql:t.sql}]:[])]:e.prepare(un).all();for(let e of i){if(typeof e.name!=`string`||typeof e.sql!=`string`)throw Error(`Session canonical validation schema has an unreadable definition`);n.set(e.name,_e(e.sql))}return n}function assertCanonicalSessionValidationSchema(e){if(b(e)){let t=ke(e);if(t?.store!==`agent`||t.version<21)throw Error(`Session canonical validation requires current PostgreSQL agent admission`);return}let t=w(e),n=t?.schemaVersion??Xe(e);if(typeof n!=`number`)throw Error(`Session canonical validation schema version is unavailable`);let r=J.get(e);if(r&&(t?r.schema===t:!r.schema&&r.cookie===n))return;J.delete(e);let i=readDefinitions(e,t);for(let t of/* @__PURE__ */ new Set([...dn.keys(),...i.keys()]))if(dn.get(t)!==i.get(t))throw classifyOpenClawAgentDatabaseReadError(e,/* @__PURE__ */ Error(`Session canonical validation schema is missing or drifted: ${t}; run openclaw doctor --fix with the compatible build.`));(t||!e.isTransaction)&&J.set(e,{cookie:n,schema:t})}function adoptCanonicalSessionValidationSchema(e){if(b(e)){assertCanonicalSessionValidationSchema(e);return}let t=w(e);if(!t)throw Error(`Canonical schema handoff requires admitted schema facts`);J.set(e,{cookie:t.schemaVersion,schema:t})}var ln,un,J,dn;function init_openclaw_agent_canonical_validation_schema(){return(init_openclaw_agent_canonical_validation_schema=e((()=>{Ae(),y(),Ke(),T(),x(),d(),O(),init_openclaw_agent_db_read_error(),p(),init_openclaw_agent_schema_history(),ln=/* @__PURE__ */ new Set([`session_nodes`,`session_windows`,`session_key_contract`,`session_canonical_validation_pending`]),un=`SELECT name, sql FROM main.sqlite_schema
  WHERE name = 'session_canonical_validation_pending'
    OR (type = 'trigger' AND tbl_name IN (
      'session_nodes', 'session_windows', 'session_key_contract', 'session_canonical_validation_pending'
    ))`,J=l(Symbol.for(`openclaw.agentCanonicalValidationSchemas`),()=>/* @__PURE__ */ new WeakMap),dn=/* @__PURE__ */ new Map([[`session_canonical_validation_pending`,_e(S(m,`session_canonical_validation_pending`))]])})))()}function hasOpenClawAgentCanonicalValidationReceiptColumn(e){let{tableName:t,columnName:n}=re;return Re(e,t,n)}function physicalReceipt(e){let t=A(e);if(t&&typeof t.identity==`string`)return JSON.stringify([1,e.agentId,t.identity,t.birthtime])}function hasPersistedOpenClawAgentCanonicalValidation(e){let t=physicalReceipt(e);return t!==void 0&&_(e.db,fn)===t}function loadOpenClawAgentCanonicalValidationReceipt(e,t){let n=physicalReceipt(e);if(!n)return!1;let r=_(e.db,fn);if(r===void 0){if(!hasOpenClawAgentCanonicalValidationReceiptColumn(e.db))return!1;assertCanonicalSessionValidationSchema(e.db),r=t?t.canonicalReady:Ie(e.db,Fe(e.db).selectFrom(`session_key_contract`).select(`canonical_ready`).where(`id`,`=`,1))?.canonical_ready??null,ae(e.db,fn,r)}return r===n}var fn;function init_openclaw_agent_canonical_validation_receipt(){return(init_openclaw_agent_canonical_validation_receipt=e((()=>{Le(),g(),init_openclaw_agent_canonical_validation_schema(),le(),et(),D(),fn={name:`agent.canonical-validation-receipt`,lifetime:`process`,schemaDependent:!0,read:e=>e===null||typeof e==`string`?e:void 0}})))()}function matchesAgentDatabaseValidation(e,t){let n=A(e);return t.agentId===e.agentId&&t.identity===n?.identity&&t.birthtime===n?.birthtime&&Atomics.load(new Int32Array(t.valid),0)===1}function createOpenClawAgentDatabaseValidationReceipt(e,t){let{identity:n,birthtime:r}=k(e);if(typeof n!=`string`||r===void 0)throw Error(`Only persistent agent databases retain integrity validation`);let i={agentId:e.agentId,identity:n,birthtime:r,receiptId:St(),integrityVerifiedAt:b(e.db)?void 0:ee(e.db)?.verifiedAt,valid:new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT),canonicalReady:new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)};return t&&Atomics.store(new Int32Array(i.canonicalReady),0,1),Atomics.store(new Int32Array(i.valid),0,1),i}var Y;function init_openclaw_agent_db_validation_facts(){return(init_openclaw_agent_db_validation_facts=e((()=>{y(),g(),et(),Y={name:`agent.completed-validation`,lifetime:`process`,read(e){return v(e)?e:void 0}}})))()}function createAgentValidationObservation(e,t){function releaseValidationObservation(e){X.get(e)?.close()}function observeValidationPath(n,r){let i=X.get(n);if(i)return r?i.revalidate():i.ready;let revalidate=async()=>{let r=e(n);if(r&&Atomics.load(new Int32Array(r.valid),0)===1)try{se(await xt(n,{bigint:!0}),{key:`file:${r.identity}`,birthtime:r.birthtime})}catch{e(n)===r&&t(n,r.identity)}},a=Qe(bt.dirname(n),(e,t)=>{(t!==`change`||e===void 0)&&(e===void 0||(process.platform===`win32`?e.toLowerCase()===bt.basename(n).toLowerCase():e===bt.basename(n)))&&revalidate()}),o=revalidate();return X.set(n,{revalidate,ready:o,close(){a.close(),X.delete(n)}}),o.finally(()=>{let e=X.get(n);e?.ready===o&&delete e.ready})}return{observe:observeValidationPath,release:releaseValidationObservation}}var X;function init_openclaw_agent_db_validation_observation(){return(init_openclaw_agent_db_validation_observation=e((()=>{$e(),ce(),d(),X=l(Symbol.for(`openclaw.agentDatabaseValidationObservations`),()=>/* @__PURE__ */ new Map)})))()}function adoptAgentValidationSchema(e,t,n,r){let i=t?.schema,a=n&&i&&!e.db.isTransaction?w(e.db):void 0,o=n&&i?.postgres&&!e.db.isTransaction?ke(e.db):void 0,s=!!(n&&i&&Atomics.load(new Int32Array(i.valid),0)===1&&(i.postgres?o?.storeId===i.postgres.storeId&&o.namespace===i.postgres.namespace&&o.version===i.postgres.version:!b(e.db)&&(a?.schemaVersion===i.facts.schemaVersion&&a.userVersion===i.facts.userVersion||Ne(e.db,i.facts)))&&Atomics.load(new Int32Array(i.valid),0)===1);if(r&&!s)throw Error(`Agent schema admission changed before handle adoption; retry the operation`);return s&&(adoptCanonicalSessionValidationSchema(e.db),t?.integrityVerifiedAt!==void 0&&!b(e.db)&&(ee(e.db)===void 0&&f(e.db,t.integrityVerifiedAt),_(e.db,Y)?.receiptId!==t.receiptId&&ae(e.db,Y,t))),s}function matchesValidationSchema(e,t){return e.postgres||t.postgres?!!(e.postgres&&t.postgres&&e.postgres.storeId===t.postgres.storeId&&e.postgres.namespace===t.postgres.namespace&&e.postgres.version===t.postgres.version):e.facts.schemaVersion===t.facts.schemaVersion&&e.facts.userVersion===t.facts.userVersion}function publishAgentValidationSchema(e,t){let n=w(e.db),r=b(e.db)?ke(e.db):void 0;if(t&&(n||r)&&!e.db.isTransaction){let i=t.schema?.valid;i&&Atomics.load(new Int32Array(i),0)===1||(i=new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT),Atomics.store(new Int32Array(i),0,1)),r?t.schema={postgres:r,valid:i}:n&&(t.schema={facts:n,valid:i}),ae(e.db,Y,t)}}function init_openclaw_agent_db_validation_schema(){return(init_openclaw_agent_db_validation_schema=e((()=>{Ae(),y(),g(),T(),init_openclaw_agent_canonical_validation_schema(),init_openclaw_agent_db_validation_facts()})))()}function bindValidationLifetime(e,t){let n=Q.get(e.db);if(!e.db.isOpen||n?.validation===t)return;n?.unregister();let r=k(e).canonicalPath,i=me(e.db),a=je(i,e=>{let revoke=t=>{t&&(!e||t.postgres||t.facts.schemaVersion!==e.schemaVersion||t.facts.userVersion!==e.userVersion)&&Atomics.store(new Int32Array(t.valid),0,0)};revoke(t.schema);let n=Z.get(r)?.validation;n?.schema&&n.agentId===t.agentId&&n.identity===t.identity&&revoke(n.schema)}),o=he(i,n=>{n===`replace`&&Atomics.store(new Int32Array(t.valid),0,0),Q.delete(e.db),a(),o()});Q.set(e.db,{validation:t,unregister:()=>{a(),o()}})}function adoptOpenClawAgentDatabaseSchema(e,t=!0,n=!1){return adoptAgentValidationSchema(e,getOpenClawAgentDatabaseValidation(e),t,n)}function hasRevokedOpenClawAgentDatabaseValidation(e,t){let n=Z.get(typeof e==`string`?h(e):e.canonicalPath);return t!==void 0&&Atomics.load(new Int32Array(t.valid),0)!==1||n?.revoked===!0||n?.validation!==void 0&&Atomics.load(new Int32Array(n.validation.valid),0)!==1}function getOpenClawAgentDatabaseValidation(e){let t=k(e).canonicalPath,n=Z.get(t);if(!n?.revoked){if(!n?.integrityVerified||!n.validation||n.validation.schema&&Atomics.load(new Int32Array(n.validation.schema.valid),0)!==1||!matchesAgentDatabaseValidation(e,n.validation)){let r=_(e.db,Y);r&&matchesAgentDatabaseValidation(e,r)&&(n&&(n.agentId===void 0||n.agentId===e.agentId)&&(!n.validation||matchesAgentDatabaseValidation(e,n.validation))?(n.agentId=e.agentId,n.validation&&n.validation.receiptId===r.receiptId?n.validation.schema=r.schema:n.validation=r,n.integrityVerified=!0):(n={agentId:e.agentId,validation:r,integrityVerified:!0},Z.set(t,n)))}if(n?.integrityVerified&&n.validation&&matchesAgentDatabaseValidation(e,n.validation))return bindValidationLifetime(e,n.validation),n.validation}}function getOpenClawAgentDatabaseValidationForTransfer(e){return readPathValidation(e.canonicalPath??(Z.has(e.path)?e.path:h(e.path)),e.agentId)}function readPathValidation(e,t){let n=Z.get(e);if(n?.integrityVerified&&n.validation?.agentId===t&&Atomics.load(new Int32Array(n.validation.valid),0)===1)return n.validation}function retireReplacedAgentValidation(e,t,n){if(!n)return;let r=getOpenClawAgentDatabaseValidationForTransfer({agentId:e,path:t,canonicalPath:t});r&&r.identity!==n.physicalIdentity&&invalidatePathValidation(t,r.identity)}function captureValidationTransfer(e,t){let n=e.canonicalPath??h(e.path),r=Z.get(n),i=r&&(r.agentId??r.validation?.agentId)===e.agentId?r:{...r,agentId:e.agentId,integrityVerified:r?.integrityVerified??!1};Z.set(n,i);let a=i.validation,o=a?Atomics.load(new Int32Array(a.valid),0):void 0;return(r,s)=>{let c=Y.read(s);if(!c||c.agentId!==e.agentId||c.identity!==r||typeof c.birthtime!=`string`||typeof c.receiptId!=`string`||c.receiptId.length===0)return`invalid`;let l=c.schema,u=Atomics.load(new Int32Array(c.valid),0),d=l&&Atomics.load(new Int32Array(l.valid),0);if(u!==0&&u!==1||t&&(!l||d!==0&&d!==1))return`invalid`;if(t&&d!==1||Z.get(n)!==i||a&&o===1&&Atomics.load(new Int32Array(a.valid),0)!==1||i.validation!==a&&i.validation&&(i.validation.identity!==r||Atomics.load(new Int32Array(i.validation.valid),0)!==1)||Atomics.load(new Int32Array(c.valid),0)!==1)return t&&Z.get(n)?.revoked&&Atomics.store(new Int32Array(c.valid),0,0),`stale`;if(i.integrityVerified&&i.validation?.agentId===e.agentId&&i.validation.identity===r&&i.validation.birthtime===c.birthtime&&Atomics.load(new Int32Array(i.validation.valid),0)===1){i.validation.integrityVerifiedAt??=c.integrityVerifiedAt;let e=i.validation.schema;return e&&l&&d===1&&Atomics.load(new Int32Array(e.valid),0)===1&&matchesValidationSchema(e,l)||(e&&Atomics.store(new Int32Array(e.valid),0,0),i.validation.schema=l),`accepted`}hasRevokedOpenClawAgentDatabaseValidation({canonicalPath:n})&&Atomics.store(new Int32Array(c.canonicalReady),0,0);let f=i.validation?.identity===r?[...Z].flatMap(([t,i])=>t!==n&&i.validation?.agentId===e.agentId&&i.validation.identity===r?[t]:[]):[];if(o!==0&&i.integrityVerified)invalidatePathValidation(n);else if(o===0)for(let e of f){let t=Z.get(e)?.validation;t&&t.receiptId!==c.receiptId&&Atomics.store(new Int32Array(t.valid),0,0)}Object.assign(i,{validation:c,integrityVerified:!0,revoked:void 0}),Z.set(n,i);for(let e of f)Z.set(e,{validation:c,integrityVerified:!0});return`accepted`}}function captureOpenClawAgentDatabaseAdmissionPublication(e){let t=captureValidationTransfer(e,!0);return(n,r)=>{let i=t(n,r);if(i===`invalid`)throw new o;let s=getOpenClawAgentDatabaseValidationForTransfer(e)?.schema;if(i===`stale`||!s||Atomics.load(new Int32Array(s.valid),0)!==1)throw new a}}function captureOpenClawAgentDatabaseAliasPublication(e){let t=captureOpenClawAgentDatabaseAdmissionPublication(e);return(n,r)=>{let i=getOpenClawAgentDatabaseValidationForTransfer(e);v(r)&&r.agentId===e.agentId&&r.identity===n&&i?.identity===n&&typeof r.receiptId==`string`&&r.receiptId.length>0&&i.receiptId===r.receiptId&&i.valid===r.valid&&i.schema&&v(r.schema)&&i.schema.valid===r.schema.valid&&Atomics.load(new Int32Array(i.schema.valid),0)===1||t(n,r)}}function canonicalValidationReceipt(e){let t=A(e)?.canonicalPath;if(!e.db.isOpen||!t)return;let n=Z.get(t)?.validation;if(n&&matchesAgentDatabaseValidation(e,n))return bindValidationLifetime({...e,path:t},n),n}function hasOpenClawAgentCanonicalValidation(e){let t=canonicalValidationReceipt(e);if(t)return Atomics.load(new Int32Array(t.canonicalReady),0)===1&&Atomics.load(new Int32Array(t.valid),0)===1;let n=A(e)?.canonicalPath;if(!n||e.db.isTransaction||Z.get(n)?.validation!==void 0||hasRevokedOpenClawAgentDatabaseValidation(n)||!hasPersistedOpenClawAgentCanonicalValidation(e))return!1;let r=createOpenClawAgentDatabaseValidationReceipt(e,!0),i=Z.get(n)??{integrityVerified:!1};return i.validation=r,Z.set(n,i),bindValidationLifetime({...e,path:n},r),!0}function markOpenClawAgentCanonicalValidation(e){let t=canonicalValidationReceipt(e);if(!t)return!1;let publish=()=>{Atomics.load(new Int32Array(t.valid),0)===1&&Atomics.store(new Int32Array(t.canonicalReady),0,1)};return e.db.isTransaction?fe(e.db,{stage:()=>{},rollback:()=>{},commit:publish}):(publish(),Atomics.load(new Int32Array(t.valid),0)===1)}function adoptOpenClawAgentDatabaseValidation(e,t){if(!matchesAgentDatabaseValidation(e,t))return!1;if(getOpenClawAgentDatabaseValidation(e))return!0;let n=k(e).canonicalPath;return hasRevokedOpenClawAgentDatabaseValidation(n)&&Atomics.store(new Int32Array(t.canonicalReady),0,0),invalidateOpenClawAgentDatabaseValidation(n),Z.set(n,{validation:t,integrityVerified:!0}),bindValidationLifetime(e,t),!0}function isOpenClawAgentCanonicalStoreEmpty(e){return e.db.isTransaction||nt(e.db)<21?!1:(assertCanonicalSessionValidationSchema(e.db),e.db.prepare(`SELECT
    EXISTS(SELECT 1 FROM session_nodes) OR
    EXISTS(SELECT 1 FROM session_canonical_validation_pending) AS populated`).get()?.populated===0)}function setOpenClawAgentDatabaseValidation(e){let t=k(e).canonicalPath,n=hasRevokedOpenClawAgentDatabaseValidation(t),r=createOpenClawAgentDatabaseValidationReceipt(e,isOpenClawAgentCanonicalStoreEmpty(e)||!n&&!e.db.isTransaction&&loadOpenClawAgentCanonicalValidationReceipt(e)),i=Z.get(t);return!n&&i&&(i.agentId===void 0||i.agentId===e.agentId)&&(!i.validation||matchesAgentDatabaseValidation(e,i.validation))?(i.validation&&(r.integrityVerifiedAt!==void 0&&(i.validation.integrityVerifiedAt=r.integrityVerifiedAt),Atomics.store(new Int32Array(i.validation.canonicalReady),0,Atomics.load(new Int32Array(r.canonicalReady),0)),r=i.validation),i.validation=r,i.integrityVerified=!0):(invalidateOpenClawAgentDatabaseValidation(t),Z.set(t,{validation:r,integrityVerified:!0})),bindValidationLifetime(e,r),publishOpenClawAgentDatabaseSchema(e),r}function publishOpenClawAgentDatabaseSchema(e){publishAgentValidationSchema(e,getOpenClawAgentDatabaseValidation(e))}function invalidateOpenClawAgentDatabaseValidation(e,t){invalidatePathValidation(typeof e==`string`?h(e):e.canonicalPath,t)}function invalidatePathValidation(e,t=Z.get(e)?.validation?.identity){let n=/* @__PURE__ */ new Set([e]);if(t)for(let[e,r]of Z)r.validation?.identity===t&&n.add(e);for(let e of n){pn.release(e);let t=Z.get(e),n=t?.validation;n&&Atomics.store(new Int32Array(n.valid),0,0),Z.set(e,{agentId:t?.agentId,validation:n,integrityVerified:!1,revoked:!0})}}function clearOpenClawAgentDatabaseValidationCache(e){let n=e===void 0?void 0:h(e);for(let e of Z.keys())(n===void 0||t(n,e))&&(invalidateOpenClawAgentDatabaseValidation(e),Z.delete(e))}var Z,pn,Q;function init_openclaw_agent_db_validation_cache(){return(init_openclaw_agent_db_validation_cache=e((()=>{ge(),de(),y(),g(),pe(),T(),ce(),d(),c(),init_openclaw_agent_canonical_validation_receipt(),init_openclaw_agent_canonical_validation_schema(),O(),et(),s(),ct(),init_openclaw_agent_db_validation_facts(),init_openclaw_agent_db_validation_observation(),init_openclaw_agent_db_validation_schema(),Z=l(Symbol.for(`openclaw.agentDatabaseValidatedPaths`),()=>/* @__PURE__ */ new Map,()=>clearOpenClawAgentDatabaseValidationCache()),pn=createAgentValidationObservation(e=>Z.get(e)?.validation,invalidatePathValidation),Q=l(Symbol.for(`openclaw.agentDatabaseValidationBindings`),()=>/* @__PURE__ */ new WeakMap)})))()}var SessionStoreMigrationRequiredError;function init_migration_required(){return(init_migration_required=e((()=>{Ue(),SessionStoreMigrationRequiredError=class extends He{constructor(e){super(`legacy-session-store`,e),this.name=`SessionStoreMigrationRequiredError`}}})))()}function projectSessionEntryNumericSnapshot(e){let t={};for(let n of mn){if(!Object.hasOwn(e,n))continue;let i=e[n],a=r(i);if(i!==void 0&&a===void 0)throw new SessionStoreMigrationRequiredError(`Session field "${n}" must be a finite number; stop the Gateway and run openclaw doctor --fix to repair legacy numeric strings. Unusable values require offline repair or restoration.`);t[n]=a}return t}var mn;function init_session_entry_numeric_snapshot(){return(init_session_entry_numeric_snapshot=e((()=>{i(),init_migration_required(),mn=/* @__PURE__ */ `lastHeartbeatSentAt.archivedAt.pinnedAt.snoozedAt.lastReadAt.markedUnreadAt.lastActivityAt.createdAt.spawnDepth.sessionStartedAt.lastInteractionAt.startedAt.endedAt.runtimeMs.abortCutoffTimestamp.lastTtsReadLatestAt.authProfileOverrideCompactionCount.queueDebounceMs.queueCap.inputTokens.outputTokens.totalTokens.estimatedCostUsd.cacheRead.cacheWrite.contextTokens.compactionCount`.split(`.`)})))()}function skipSvgPrologueWhitespace(e,t){return $.lastIndex=t,$.exec(e),$.lastIndex}function startsWithToken(e,t,n){return e.slice(t,t+n.length).toLowerCase()===n}function startsWithSvgRootElement(e){let t=skipSvgPrologueWhitespace(e,0);if(startsWithToken(e,t,`<?xml`)){let n=e.indexOf(`>`,t);if(n<0)return!1;t=skipSvgPrologueWhitespace(e,n+1)}for(;startsWithToken(e,t,`<!--`);){let n=e.indexOf(`-->`,t+4);if(n<0)return!1;t=skipSvgPrologueWhitespace(e,n+3)}if(!startsWithToken(e,t,`<svg`))return!1;let n=e[t+4];return n===`>`||n===`/`&&e[t+5]===`>`||n!==void 0&&/\s/u.test(n)}function isSelfContainedSvg(e){return!e.includes(`\0`)&&!/<!doctype|<!entity/iu.test(e)&&!/<\s*(?:script|foreignObject|image|use|iframe)\b/iu.test(e)&&!/\b(?:href|xlink:href|src)\s*=/iu.test(e)&&startsWithSvgRootElement(e)}var $;function init_svg_image(){return(init_svg_image=e((()=>{$=/\s*/y})))()}function normalizeSessionColorValue(e){let t=e.trim().toLowerCase();return hn.find(e=>e===t)??null}function normalizeSessionSvgIcon(e){if(e.length>49216)return null;let t=yn.exec(e),n=e;try{if(t){let r=e.slice(t[0].length);n=t[1]?new TextDecoder(`utf-8`,{fatal:!0}).decode(Uint8Array.from(atob(r),e=>e.charCodeAt(0))):decodeURIComponent(r)}return n=n.trim(),new TextEncoder().encode(n).byteLength>16384||!isSelfContainedSvg(n)?null:`${vn}${encodeURIComponent(n)}`}catch{return null}}function normalizeSessionIconValue(e){let t=e.trim();return t?_n.has(t)?t:t.startsWith(`<`)||/^data:/iu.test(t)?normalizeSessionSvgIcon(t):bn.test(t)?t:null:null}var hn,gn,_n,vn,yn,bn;function init_session_agent_status(){return(init_session_agent_status=e((()=>{init_svg_image(),hn=[`red`,`blue`,`green`,`yellow`,`purple`,`orange`,`pink`,`cyan`],gn=[`braces`,`book`,`monitor`,`bot`,`kanban`,`coins`],_n=new Set(gn),vn=`data:image/svg+xml,`,yn=/^data:image\/svg\+xml(?:;charset=utf-8)?(;base64)?,/iu,bn=/* @__PURE__ */ RegExp(`^\\p{RGI_Emoji}$`,`v`)})))()}function isCanonicalSessionDeliveryState(e){return v(e)?e.kind===`none`||e.kind===`internal`||e.kind===`external`&&!!(e.route&&typeof e.route==`object`)&&!!(e.context&&typeof e.context==`object`)&&!!(e.origin&&typeof e.origin==`object`):!1}function hasLegacySessionProviderState(e){return v(e)&&!isCanonicalSessionDeliveryState(e.delivery)&&xn.some(([t,n])=>typeof e[t]==`string`&&typeof e[n]!=`string`)}function hasLegacySessionEntryState(e){return`status`in e&&(e.status===`running`||e.status===`queued`)||`pendingFinalDelivery`in e&&typeof e.pendingFinalDelivery==`boolean`||hasLegacySessionProviderState(e)||Sn.some(t=>Object.hasOwn(e,t))}var xn,Sn;function init_session_entry_state_format(){return(init_session_entry_state_format=e((()=>{xn=[[`provider`,`channel`],[`lastProvider`,`lastChannel`]],Sn=[`pendingFinalDeliveryCreatedAt`,`pendingFinalDeliveryLastAttemptAt`,`pendingFinalDeliveryAttemptCount`,`pendingFinalDeliveryLastError`,`pendingFinalDeliveryText`,`pendingFinalDeliveryContext`,`pendingFinalDeliveryIntentId`,`fallbackNoticeSelectedModel`,`fallbackNoticeActiveModel`,`fallbackNoticeReason`,`memoryFlushAt`,`memoryFlushCompactionCount`,`memoryFlushContextHash`,`memoryFlushFailureCount`,`memoryFlushLastFailedAt`,`memoryFlushLastFailureError`]})))()}function assertSupportedSessionStoreEntry(e){if(v(e)&&typeof e.room==`string`&&typeof e.groupChannel!=`string`)throw new SessionStoreMigrationRequiredError(`Session field "room" predates July 2026 and is no longer supported. Preserve the original state, install OpenClaw 2026.9.5 and run "openclaw doctor --fix", then upgrade again.`)}function init_supported_session_store(){return(init_supported_session_store=e((()=>{init_migration_required()})))()}function normalizeSessionEntryArchiveReason(e){return e===`manual`||e===`active-session-cap`||e===`age-retention`||e===`stale-dashboard`||e===`restart-recovery`?e:void 0}function normalizeOptionalTimestamp(e){return e===void 0?void 0:n(e)??0}function projectCanonicalSessionEntryShape(e){if(assertSupportedSessionStoreEntry(e),hasLegacySessionEntryState(e))throw new SessionStoreMigrationRequiredError(`Legacy session entry state requires migration; stop the Gateway and run openclaw doctor --fix.`);let{sessionFile:t,transcriptPath:n,conversationLink:r,titleRefinement:i,owner:a,participants:o,participantCount:s,...c}=e,l=c.mainRestartRecovery;v(l)&&typeof l.cycleId==`string`&&l.cycleId.length>0&&!l.tombstone?c.mainRestartRecovery={cycleId:l.cycleId}:delete c.mainRestartRecovery;for(let e of Object.keys(c))(e===`pendingExecNotifications`||e===`subagentRecovery`||e.startsWith(`restartRecovery`))&&Reflect.deleteProperty(c,e);let setOptionalField=(e,t)=>{t?c[e]=t:delete c[e]};setOptionalField(`clientCapabilities`,Array.isArray(c.clientCapabilities)?[...new Set(c.clientCapabilities.filter(e=>typeof e==`string`))].toSorted():void 0),setOptionalField(`icon`,typeof c.icon==`string`?normalizeSessionIconValue(c.icon):null),setOptionalField(`color`,typeof c.color==`string`?normalizeSessionColorValue(c.color):null),setOptionalField(`pendingFinalDelivery`,normalizePendingFinalDelivery(c.pendingFinalDelivery)),setOptionalField(`pendingDeliveryNotice`,normalizePendingDeliveryNotice(c.pendingDeliveryNotice)),setOptionalField(`pendingTranscriptRepair`,normalizePendingTranscriptRepair(c.pendingTranscriptRepair)),setOptionalField(`fallbackNotice`,normalizeFallbackNotice(c.fallbackNotice)),setOptionalField(`memoryFlush`,normalizeMemoryFlush(c.memoryFlush));let u=normalizeSessionEntryArchiveReason(c.archiveReason);return c.archivedAt===void 0?(delete c.archivedBy,delete c.archiveReason):setOptionalField(`archiveReason`,u),(c.archivedAt!==void 0||typeof c.snoozedUntil!=`number`||!Number.isFinite(c.snoozedUntil)||c.snoozedUntil<=0)&&(delete c.snoozedUntil,delete c.snoozedAt),c}function normalizePendingFinalDelivery(e){if(!v(e))return;let t=normalizeOptionalTimestamp(e.createdAt);if(t===void 0)return;let n=u(e.intentId),r=u(e.sourceRunId),i=normalizePendingFinalDeliveries(e.deliveries),a={createdAt:t,...v(e.context)?{context:e.context}:{},...n?{intentId:n}:{},...r?{sourceRunId:r}:{},...i?{deliveries:i}:{}};if(e.kind===`transport-only`)return{kind:`transport-only`,...a};let o=u(e.text);return e.kind===`replayable`&&o?{kind:`replayable`,text:o,...a}:void 0}function normalizePendingFinalDeliveries(e){if(!Array.isArray(e))return;let t=e.flatMap(e=>{let t=v(e)?u(e.id):void 0,n=v(e)?e.state:void 0,r=v(e)&&v(e.receipt)?e.receipt:void 0,i=u(r?.platformMessageId),a=r?.resultCount;return t&&(n===`prepared`||n===`queued`||n===`delivered`||n===`suppressed`||n===`unknown`)?[{id:t,state:n,...i&&Number.isSafeInteger(a)&&Number(a)>0?{receipt:{platformMessageId:i,resultCount:Number(a)}}:{}}]:[]});return t.length>0?t:void 0}function normalizePendingDeliveryNotice(e){if(!v(e)||!v(e.context))return;let t=normalizeOptionalTimestamp(e.createdAt),n=u(e.intentId);return t!==void 0&&n&&(e.state===`owed`||e.state===`unresolved`||e.state===`acknowledged`)?{createdAt:t,context:e.context,intentId:n,state:e.state}:void 0}function normalizePendingTranscriptRepair(e){if(!Array.isArray(e)||e.length===0)return;let t=[];for(let n of e){let e=normalizePendingTranscriptRepairRecord(n);e&&t.push(e)}return t.length>0?t:void 0}function normalizePendingTranscriptRepairRecord(e){if(!v(e))return;let t=u(e.id),n=u(e.text),r=normalizeOptionalTimestamp(e.createdAt);if(!t||!n||r===void 0)return;let i=u(e.provider),a=u(e.model);return{id:t,text:n,...i?{provider:i}:{},...a?{model:a}:{},createdAt:r}}function normalizeFallbackNotice(e){if(!v(e)||e.kind!==`active`)return;let t=u(e.selectedModel),n=u(e.activeModel),r=u(e.reason);return t&&n?{kind:`active`,selectedModel:t,activeModel:n,...r?{reason:r}:{}}:void 0}function normalizeMemoryFlush(e){if(!v(e))return;let t=normalizeCount(e.compactionCount);if(e.kind===`succeeded`&&t!==void 0)return{kind:`succeeded`,compactionCount:t};let n=normalizeCount(e.failureCount);if(e.kind===`failed`&&n)return{kind:`failed`,...t===void 0?{}:{compactionCount:t},failureCount:n}}function normalizeCount(e){let t=n(e);return t===void 0?void 0:Math.floor(t)}function init_store_entry_shape(){return(init_store_entry_shape=e((()=>{i(),init_session_agent_status(),init_migration_required(),init_session_entry_state_format(),init_supported_session_store()})))()}function hasValidSessionEntryIdentity(e){return typeof e.sessionId==`string`&&typeof e.updatedAt==`number`&&Number.isFinite(e.updatedAt)}function parseSqliteSessionEntryRecord(e){let t;try{t=JSON.parse(e.entry_json)}catch{return null}return!v(t)||!hasValidSessionEntryIdentity(t)||e.current_session_id!==void 0&&e.current_session_id!==t.sessionId||e.updated_at!==void 0&&e.updated_at!==t.updatedAt?null:t}function admitCanonicalSessionEntry(e){let t=projectCanonicalSessionEntryShape(e);return{...t,...projectSessionEntryNumericSnapshot(t)}}function parseCanonicalSqliteSessionEntry(e){let t=parseSqliteSessionEntryRecord(e);return t?admitCanonicalSessionEntry(t):null}function init_session_entry_json(){return(init_session_entry_json=e((()=>{i(),init_session_entry_numeric_snapshot(),init_store_entry_shape()})))()}export{Ft as $,sn as A,en as B,loadOpenClawAgentCanonicalValidationReceipt as C,classifyOpenClawAgentDatabaseReadError as D,init_openclaw_agent_canonical_validation_schema as E,Bt as F,U as G,H,W as I,getOpenClawAgentMigrationSchema as J,Ut as K,tn as L,ensureOpenClawAgentProgressCardSchemaInTransaction as M,init_openclaw_agent_progress_card_schema as N,init_openclaw_agent_db_read_error as O,zt as P,withLegacyAgentStorageSchema as Q,Yt as R,init_openclaw_agent_canonical_validation_receipt as S,assertCanonicalSessionValidationSchema as T,Vt as U,Rt as V,Ht as W,sessionParticipantsSchemaSql as X,init_openclaw_agent_schema_history as Y,init_openclaw_agent_storage_schema as Z,retireReplacedAgentValidation as _,adoptOpenClawAgentDatabaseSchema as a,interruptHistoricalPendingInputs as at,init_openclaw_agent_db_validation_facts as b,captureOpenClawAgentDatabaseAliasPublication as c,init_memory_schema_storage_migration as ct,hasOpenClawAgentCanonicalValidation as d,hasLegacyMemoryRecallMetadataColumns as dt,init_openclaw_agent_transcript_fts_schema_source as et,hasRevokedOpenClawAgentDatabaseValidation as f,init_memory_schema_recall as ft,publishOpenClawAgentDatabaseSchema as g,markOpenClawAgentCanonicalValidation as h,init_store_entry_shape as i,init_openclaw_agent_pending_inputs_schema as it,init_openclaw_agent_db_schema_compatibility as j,recordOpenClawAgentDatabaseReadOpenFailure as k,getOpenClawAgentDatabaseValidation as l,migrateMemoryIndexStorage as lt,invalidateOpenClawAgentDatabaseValidation as m,init_memory_schema_provenance as mt,parseCanonicalSqliteSessionEntry as n,sessionEntrySnapshotsSchemaSql as nt,adoptOpenClawAgentDatabaseValidation as o,init_memory_schema as ot,init_openclaw_agent_db_validation_cache as p,ensureMemoryChunkProvenance as pt,canonicalSessionValidationSchemaSql as q,parseSqliteSessionEntryRecord as r,withoutSessionEntrySnapshotsSchema as rt,captureOpenClawAgentDatabaseAdmissionPublication as s,migrateMemoryIndexSourcesIdentity as st,init_session_entry_json as t,init_openclaw_agent_session_snapshots_schema as tt,getOpenClawAgentDatabaseValidationForTransfer as u,ensureMemoryRecallMetadataSchema as ut,setOpenClawAgentDatabaseValidation as v,adoptCanonicalSessionValidationSchema as w,hasOpenClawAgentCanonicalValidationReceiptColumn as x,Y as y,nn as z};