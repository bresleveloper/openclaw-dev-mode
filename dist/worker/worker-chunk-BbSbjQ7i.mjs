import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{n as t,o as n}from"./worker-chunk-CCW8mP6B.mjs";import{d as r,s as i}from"./worker-chunk-z04j10rr.mjs";import{c as a,l as o}from"./worker-chunk-D-pM6VZQ.mjs";import{t as s}from"./worker-chunk-DHn5u9kO.mjs";import{n as c,o as l}from"./worker-chunk-BnH37bnM.mjs";import{t as u}from"./worker-chunk-ChUvdBnT.mjs";import{n as ee,t as te}from"./worker-chunk-DSs5sVn4.mjs";import{A as ne,D as re}from"./worker-chunk-2YU_cJ4H.mjs";import{n as ie,t as ae}from"./worker-chunk-BPRtk9Jm.mjs";import{n as oe,t as se}from"./worker-chunk-9eOBldsQ.mjs";import{n as ce,t as le}from"./worker-chunk-BMxJDIbs.mjs";import{l as ue,r as de,u as d}from"./worker-chunk-RPQH-49S.mjs";import{r as fe,t as pe}from"./worker-chunk-D3C_QfoA.mjs";import{a as me,c as f,o as he}from"./worker-chunk-CR5jHKwv.mjs";import{a as ge,i as _e}from"./worker-chunk-CGHm3o3r.mjs";import{n as ve,t as p}from"./worker-chunk-Dpfm-ucS.mjs";import{c as ye,r as be}from"./worker-chunk-D69ZNQsR.mjs";import{a as xe,d as Se,n as Ce,s as we}from"./worker-chunk-DCksv-a3.mjs";import{a as Te,f as Ee,h as De,i as m,l as Oe,r as ke,t as Ae,u as h}from"./worker-chunk-DNqLbMlg.mjs";import{c as je,o as Me}from"./worker-chunk-DlpqH9XP.mjs";import{a as Ne,i as Pe,u as Fe,v as Ie,y as Le}from"./worker-chunk-Cc9_TFmE.mjs";import{a as Re,l as ze,t as Be,u as Ve}from"./worker-chunk-BbD_gH8B.mjs";import{f as g,g as _,l as v,n as He,p as Ue,r as We,s as Ge,t as Ke}from"./worker-chunk-CUrtmFkF.mjs";import{i as qe,n as y,t as b}from"./worker-chunk-Bg-ZeVgV.mjs";import{a as Je,d as Ye,i as Xe,p as Ze,r as Qe}from"./worker-chunk-Dp3NELwY.mjs";import{C as $e,S as et,c as tt,f as nt,p as rt,r as it,t as at,u as ot,v as st,x as ct,y as lt}from"./worker-chunk-DUCME8Gg.mjs";import{n as x,o as S}from"./worker-chunk-Epl24hFw.mjs";import{C as ut,E as dt,a as ft,i as pt,r as mt,w as ht}from"./worker-chunk-DgFmVOlu.mjs";import{a as gt,c as _t,l as vt,n as yt,o as bt,r as xt}from"./worker-chunk-DOqYgXHu.mjs";import{a as C,i as St,o as Ct,r as w}from"./worker-chunk-DmByjxfp.mjs";import{a as wt,i as Tt,o as Et}from"./worker-chunk-DUr_gRO4.mjs";import{h as Dt,m as Ot,n as kt,o as At,r as jt,u as Mt}from"./worker-chunk-dAobKEER.mjs";import{i as Nt,n as Pt,o as Ft}from"./worker-chunk-DlM5E89b.mjs";import{n as It,t as Lt}from"./worker-chunk-DA9m_w42.mjs";import{a as Rt,c as zt,s as T}from"./worker-chunk-B3mg6UMH.mjs";import{i as Bt,n as Vt}from"./worker-chunk-CvrIfKU-.mjs";import{o as Ht,s as Ut}from"./worker-chunk-B9ezsUVm.mjs";import{a as Wt,r as Gt,t as Kt}from"./worker-chunk-BD2Syxc0.mjs";import{existsSync as E,mkdirSync as qt,realpathSync as Jt,statSync as D}from"node:fs";import O from"node:path";import{AsyncLocalStorage as Yt}from"node:async_hooks";import{randomUUID as Xt}from"node:crypto";import{isMainThread as Zt}from"node:worker_threads";function generationMatchesPath(e,t){try{return et(t,ct(e))}catch{return!1}}function createSqliteTerminalOpenLatch(e){let t=/* @__PURE__ */ new Map;return{peek:e=>t.get(O.resolve(e))?.error,get:e=>{let n=O.resolve(e),r=t.get(n);if(r){if(r.generation&&!generationMatchesPath(n,r.generation)){t.delete(n);return}return r.error}},async getAsync(e,n){let r=O.resolve(e);for(;;){let e=t.get(r);if(!e?.generation)return e?.error;let i=await n(r,e.generation);if(t.get(r)===e){if(!i){t.delete(r);return}return e.error}}},record:(n,r,i)=>{let a=O.resolve(n);return i&&!generationMatchesPath(a,i)?!1:(t.set(a,{error:r,...i?{generation:i}:{}}),e.closeByPath(a,r),i&&!generationMatchesPath(a,i)?(t.delete(a),!1):!0)},clear:e=>{t.delete(O.resolve(e))},clearAll:e=>{for(let r of t.keys())(e===void 0||n(e,r))&&t.delete(r)}}}var Qt=e((()=>{u(),st()}));function readMainTableList(e){return e.prepare(`PRAGMA table_list`).all().filter(e=>e.schema===`main`&&typeof e.name==`string`&&!e.name.startsWith(`sqlite_`))}function readTableColumns(e,t){return e.prepare(`PRAGMA table_xinfo(${_(t)})`).all()}function readVisibleColumns(e,t){return readTableColumns(e,t).filter(e=>Number(e.hidden??0)===0).map(e=>{if(typeof e.name!=`string`||e.name.length===0)throw Error(`SQLite table ${t} has an invalid column name`);return e.name})}function readTableRowidModel(e,t,n){if(Number(n.wr??0)===1)return{alias:null,storage:`without-rowid`};let r=readTableColumns(e,t),i=r.filter(e=>Number(e.pk??0)>0),a=e.prepare(`SELECT 1 AS found FROM pragma_index_list(?) WHERE origin = 'pk' LIMIT 1`).get(t),o=i[0]?.type;if(i.length===1&&typeof o==`string`&&o.toUpperCase()===`INTEGER`&&!a)return{alias:null,storage:`integer-primary-key`};let s=new Set(r.flatMap(e=>typeof e.name==`string`?[e.name.toLowerCase()]:[])),c=tn.find(e=>!s.has(e))??null;if(!c)throw Error(`SQLite table ${t} shadows every rowid alias; its implicit rowids cannot be migrated safely`);return{alias:c,storage:`implicit`}}function readCanonicalStrictTables(e){let t=y(`:memory:`);try{t.exec(e);let n=readMainTableList(t).filter(e=>e.type===`table`),r=n.filter(e=>Number(e.strict??0)!==1).map(e=>e.name);if(r.length>0)throw Error(`Canonical SQLite schema contains non-STRICT tables: ${r.toSorted().join(`, `)}`);return n.map(e=>{let n=t.prepare(`SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = ?`).get(e.name);if(typeof n?.sql!=`string`)throw Error(`Canonical SQLite table ${e.name} has no CREATE statement`);let r=readTableRowidModel(t,e.name,e);return{columns:readVisibleColumns(t,e.name),createSql:n.sql,name:e.name,rowidAlias:r.alias,rowidStorage:r.storage,usesAutoincrement:/\bAUTOINCREMENT\b/iu.test(n.sql)}}).toSorted((e,t)=>e.name.localeCompare(t.name))}finally{t.close()}}function rewriteCreateTableName(e,t){let n=e.indexOf(`(`);if(n===-1)throw Error(`Canonical SQLite table CREATE statement has no column list`);return`CREATE TABLE ${_(t)} ${e.slice(n)}`}function readPreservedSchemaObjects(e,t){return e.prepare(`SELECT type, name, tbl_name, sql FROM sqlite_schema WHERE type IN ('index', 'trigger', 'view')`).all().flatMap(e=>e.type!==`index`&&e.type!==`trigger`&&e.type!==`view`||typeof e.name!=`string`||typeof e.tbl_name!=`string`||typeof e.sql!=`string`||e.type===`index`&&!t.has(e.tbl_name)?[]:[{name:e.name,sql:e.sql,type:e.type}]).toSorted((e,t)=>{let n={view:0,index:1,trigger:2};return n[e.type]-n[t.type]||e.name.localeCompare(t.name)})}function readAutoincrementHighWater(e,t){if(!e.prepare(`SELECT 1 AS found FROM sqlite_schema WHERE type = 'table' AND name = 'sqlite_sequence'`).get())return null;let n=e.prepare(`SELECT CAST(seq AS TEXT) AS seq FROM sqlite_sequence WHERE name = ?`).get(t);if(n===void 0)return null;let r=typeof n.seq==`string`?/^(\d+)(?:\.0+)?$/u.exec(n.seq)?.[1]:null;if(!r)throw Error(`SQLite table ${t} has an invalid AUTOINCREMENT high-water mark (${typeof n.seq}: ${String(n.seq)})`);return r}function restoreAutoincrementHighWater(e,t,n){if(n===null)return;let r=readAutoincrementHighWater(e,t),i=r===null||BigInt(n)>BigInt(r)?n:r;e.prepare(`DELETE FROM sqlite_sequence WHERE name = ?`).run(t),e.prepare(`INSERT INTO sqlite_sequence (name, seq) VALUES (?, CAST(? AS INTEGER))`).run(t,i)}function assertMatchingColumns(e,t,n){let r=new Set(t),i=new Set(n),a=n.filter(e=>!r.has(e)),o=t.filter(e=>!i.has(e));if(a.length===0&&o.length===0)return;let s=[a.length>0?`missing ${a.join(`, `)}`:``,o.length>0?`extra ${o.join(`, `)}`:``].filter(Boolean).join(`; `);throw Error(`SQLite table ${e} does not match its canonical columns (${s})`)}function readForeignKeysEnabled(e){let t=e.prepare(`PRAGMA foreign_keys`).get();return Number(t?.foreign_keys??0)===1}function migrateSqliteSchemaToStrictInTransaction(e,t,n={}){if(!e.isTransaction)throw Error(`SQLite STRICT schema migration requires an active transaction`);let r=readCanonicalStrictTables(t);e.exec(t);let i=new Map(readMainTableList(e).filter(e=>e.type===`table`).map(e=>[e.name,e])),a=r.filter(e=>Number(i.get(e.name)?.strict??0)!==1);if(a.length===0)return{migratedTables:[]};if(readForeignKeysEnabled(e))throw Error(`SQLite STRICT schema migration requires foreign_keys=OFF before BEGIN`);let o=readPreservedSchemaObjects(e,new Set(a.map(e=>e.name)));for(let t of o)t.type===`trigger`&&e.exec(`DROP TRIGGER ${_(t.name)};`);for(let t of o)t.type===`view`&&e.exec(`DROP VIEW ${_(t.name)};`);for(let[t,n]of a.entries()){let r=`${en}${t}_${n.name}`;if(i.has(r))throw Error(`SQLite STRICT migration table already exists: ${r}`);let a=readVisibleColumns(e,n.name);assertMatchingColumns(n.name,a,n.columns);let o=i.get(n.name);if(!o)throw Error(`SQLite table ${n.name} disappeared during STRICT migration`);let s=readTableRowidModel(e,n.name,o);if(s.storage!==n.rowidStorage)throw Error(`SQLite table ${n.name} changes rowid storage from ${s.storage} to ${n.rowidStorage}; refusing an identity-changing STRICT migration`);let c=n.usesAutoincrement?readAutoincrementHighWater(e,n.name):null;e.exec(rewriteCreateTableName(n.createSql,r));let l=n.columns.map(_);n.rowidAlias&&l.unshift(_(n.rowidAlias));let u=l.join(`, `);try{e.exec(`INSERT INTO ${_(r)} (${u}) SELECT ${u} FROM ${_(n.name)};`)}catch(e){throw Error(`Failed migrating SQLite table ${n.name} to STRICT`,{cause:e})}e.exec(`DROP TABLE ${_(n.name)};`),e.exec(`ALTER TABLE ${_(r)} RENAME TO ${_(n.name)};`),restoreAutoincrementHighWater(e,n.name,c)}e.exec(t);let s=e.prepare(`SELECT 1 AS found FROM sqlite_schema WHERE type = ? AND name = ? LIMIT 1`);for(let t of o)s.get(t.type,t.name)||e.exec(t.sql);return ot(e,n.databaseLabel??`SQLite STRICT schema migration`),{migratedTables:a.map(e=>e.name)}}function migrateSqliteSchemaToStrict(e,t,n={}){if(e.isTransaction)throw Error(`SQLite STRICT schema migration cannot start inside a transaction`);let r=readForeignKeysEnabled(e);r&&e.exec(`PRAGMA foreign_keys = OFF;`);try{return S(e,()=>migrateSqliteSchemaToStrictInTransaction(e,t,n),{busyTimeoutMs:n.busyTimeoutMs??$t,databaseLabel:n.databaseLabel,operationLabel:`sqlite.strict-schema-migration`})}finally{r&&e.exec(`PRAGMA foreign_keys = ON;`)}}var $t,en,tn,nn=e((()=>{b(),rt(),g(),x(),$t=5e3,en=`__openclaw_strict_migration_`,tn=[`_rowid_`,`rowid`,`oid`]})),rn=e((()=>{nn(),Ot(),x()}));function ensureMemoryChunkProvenance(e){let ensure=()=>{e.exec(`DROP TRIGGER IF EXISTS memory_index_chunk_provenance_after_insert`),e.exec(an),e.exec(`
      WITH missing AS MATERIALIZED (${on}),
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
      );

      WITH missing AS MATERIALIZED (${on})
      INSERT OR IGNORE INTO ${k} (
        chunk_id, origin_class, session_kind, observed_at
      )
      SELECT chunk.id, 'untrusted', 'unknown', chunk.updated_at
      FROM missing
      JOIN memory_index_chunks AS chunk ON chunk.id = missing.id;
    `)};if(e.isTransaction){ensure();return}S(e,ensure)}var k,an,on,sn=e((()=>{rn(),k=`memory_index_chunk_provenance`,an=`
  CREATE TABLE IF NOT EXISTS ${k} (
    chunk_id TEXT PRIMARY KEY,
    origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),
    session_kind TEXT NOT NULL CHECK (session_kind IN ('interactive', 'cron', 'heartbeat', 'subagent', 'unknown')),
    observed_at INTEGER NOT NULL,
    supersedes_key TEXT,
    FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE
  ) STRICT;
`,on=`
  SELECT chunk.id
  FROM memory_index_chunks AS chunk
  LEFT JOIN ${k} AS provenance
    ON provenance.chunk_id = chunk.id
  WHERE provenance.chunk_id IS NULL
`}));function readMemoryChunkColumns(e){let t=e.prepare(`PRAGMA table_info(${A})`).all();return new Set(t.flatMap(e=>typeof e.name==`string`?[e.name]:[]))}function tableExists$1(e,t){return!!e.prepare(`SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ? LIMIT 1`).get(t)}function legacyRecallMetadataColumns(e){let t=readMemoryChunkColumns(e);return[`importance`,`triggers`,`project_key`].filter(e=>t.has(e))}function hasLegacyMemoryRecallMetadataColumns(e){return legacyRecallMetadataColumns(e).length>0}function ensureMemoryRecallMetadataSchema(e){if(legacyRecallMetadataColumns(e).length===0&&tableExists$1(e,`memory_index_chunk_recall_metadata`))return;let ensure=()=>{e.exec(ln);let t=new Set(legacyRecallMetadataColumns(e));if(t.size===0)return;let n=t.has(`importance`)?`importance`:`NULL`,r=t.has(`triggers`)?`triggers`:`NULL`,i=t.has(`project_key`)?`project_key`:`NULL`;e.exec(`
      INSERT INTO ${cn} (
        chunk_id, importance, triggers, project_key
      )
      SELECT id, ${n}, ${r}, ${i}
      FROM ${A}
      WHERE ${n} IS NOT NULL
         OR ${r} IS NOT NULL
         OR ${i} IS NOT NULL
      ON CONFLICT(chunk_id) DO UPDATE SET
        importance=excluded.importance,
        triggers=excluded.triggers,
        project_key=excluded.project_key;
    `);for(let n of[`project_key`,`triggers`,`importance`])t.has(n)&&e.exec(`ALTER TABLE ${A} DROP COLUMN ${n}`)};if(e.isTransaction){ensure();return}S(e,ensure)}var A,cn,ln,j=e((()=>{rn(),A=`memory_index_chunks`,cn=`memory_index_chunk_recall_metadata`,ln=`
  CREATE TABLE IF NOT EXISTS ${cn} (
    chunk_id TEXT PRIMARY KEY,
    importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10),
    triggers TEXT,
    project_key TEXT,
    FOREIGN KEY (chunk_id) REFERENCES ${A}(id) ON DELETE CASCADE
  ) STRICT;
`}));function dropMemoryChunkFtsTriggers(e){for(let t of I)e.exec(`DROP TRIGGER IF EXISTS main.${t.name}`)}function ensureMemoryChunkFtsTriggers(e){for(let t of I)e.exec(t.sql)}function rebuildMemoryChunkFts(e,t){e.exec(`
    DELETE FROM ${t};
    INSERT INTO ${t} (
      rowid, text, id, path, source, model, start_line, end_line
    )
    SELECT chunk_rowid, text, id, path, source, model, start_line, end_line
    FROM ${N};
  `)}function dropMemoryPathFtsTriggers(e){for(let t of un)e.exec(`DROP TRIGGER IF EXISTS main.${t.name}`)}function ensureMemoryPathFtsTriggers(e){for(let t of un)e.exec(t.sql)}var M,N,P,F,un,I,dn=e((()=>{M=`memory_index_sources`,N=`memory_index_chunks`,P=`memory_index_chunks_fts`,F=`memory_index_paths_fts`,un=[{name:`memory_index_paths_fts_after_insert`,sql:`
      CREATE TRIGGER IF NOT EXISTS main.memory_index_paths_fts_after_insert
      AFTER INSERT ON ${M}
      BEGIN
        INSERT INTO ${F} (rowid, path, source)
        VALUES (NEW.id, NEW.path, NEW.source);
      END;
    `},{name:`memory_index_paths_fts_after_update`,sql:`
      CREATE TRIGGER IF NOT EXISTS main.memory_index_paths_fts_after_update
      AFTER UPDATE OF id, path, source ON ${M}
      BEGIN
        DELETE FROM ${F}
        WHERE rowid = OLD.id;
        INSERT INTO ${F} (rowid, path, source)
        VALUES (NEW.id, NEW.path, NEW.source);
      END;
    `},{name:`memory_index_paths_fts_after_delete`,sql:`
      CREATE TRIGGER IF NOT EXISTS main.memory_index_paths_fts_after_delete
      AFTER DELETE ON ${M}
      BEGIN
        DELETE FROM ${F}
        WHERE rowid = OLD.id;
      END;
    `}],I=[{name:`memory_index_chunks_fts_after_insert`,sql:`
      CREATE TRIGGER IF NOT EXISTS main.memory_index_chunks_fts_after_insert
      AFTER INSERT ON ${N}
      BEGIN
        INSERT INTO ${P} (rowid, text, id, path, source, model, start_line, end_line)
        VALUES (NEW.chunk_rowid, NEW.text, NEW.id, NEW.path, NEW.source, NEW.model, NEW.start_line, NEW.end_line);
      END;
    `},{name:`memory_index_chunks_fts_after_update`,sql:`
      CREATE TRIGGER IF NOT EXISTS main.memory_index_chunks_fts_after_update
      AFTER UPDATE OF chunk_rowid, text, id, path, source, model, start_line, end_line ON ${N}
      BEGIN
        DELETE FROM ${P} WHERE rowid = OLD.chunk_rowid;
        INSERT INTO ${P} (rowid, text, id, path, source, model, start_line, end_line)
        VALUES (NEW.chunk_rowid, NEW.text, NEW.id, NEW.path, NEW.source, NEW.model, NEW.start_line, NEW.end_line);
      END;
    `},{name:`memory_index_chunks_fts_after_delete`,sql:`
      CREATE TRIGGER IF NOT EXISTS main.memory_index_chunks_fts_after_delete
      AFTER DELETE ON ${N}
      BEGIN
        DELETE FROM ${P} WHERE rowid = OLD.chunk_rowid;
      END;
    `}]}));function buildMemoryEmbeddingCacheSchema(e){return`
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
  `}var fn,pn=e((()=>{dn(),sn(),j(),fn=`
  CREATE TABLE IF NOT EXISTS ${N} (
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
`}));function encodeMemoryEmbedding(e){let t=new Uint8Array(e.length*8),n=new DataView(t.buffer);for(let t=0;t<e.length;t+=1){let r=e[t];if(typeof r!=`number`||!Number.isFinite(r))throw Error(`Memory embeddings require finite numeric coordinates`);n.setFloat64(t*8,r,!0)}return t}function decodeMemoryEmbedding(e){if(e.byteLength%8!=0)return[];let t=new DataView(e.buffer,e.byteOffset,e.byteLength),n=[];for(let r=0;r<e.byteLength;r+=8){let e=t.getFloat64(r,!0);if(!Number.isFinite(e))return[];n.push(e)}return n}var mn=e((()=>{}));function legacyCacheSchema(e){return`CREATE TABLE IF NOT EXISTS ${e} (
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    provider_key TEXT NOT NULL,
    hash TEXT NOT NULL,
    embedding TEXT NOT NULL,
    dims INTEGER,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (provider, model, provider_key, hash)
  ) STRICT;`}function storageShape(e,t,n){let r=columns(e,t);if(r.size===0)return`absent`;let i=r.get(`embedding`)===`TEXT`?`legacy`:r.get(`embedding`)===`BLOB`?`binary`:void 0;if(!i||n&&r.has(`chunk_rowid`)!==(i===`binary`))throw Error(`Unsupported partial memory storage schema: ${t}`);let a=n?i===`legacy`?hn:fn:i===`legacy`?legacyCacheSchema(t):buildMemoryEmbeddingCacheSchema(t);if(n){let e=vn.filter(([e])=>r.has(e));e.length>0&&(a=a.replace(`updated_at INTEGER NOT NULL`,`updated_at INTEGER NOT NULL,\n${e.map(([,e])=>e).join(`,
`)}`))}i===`legacy`&&e.prepare(`SELECT strict FROM pragma_table_list WHERE schema = 'main' AND name = ?`).get(t)?.strict===0&&(a=a.replace(`) STRICT;`,`);`));let o=n?gn:[{name:t===`memory_embedding_cache`?`idx_memory_embedding_cache_updated_at`:`idx_embedding_cache_updated_at`,columns:`updated_at`}];return a+=o.map(e=>`CREATE INDEX ${e.name} ON ${t}(${e.columns});`).join(`
`),At(e,`memory storage ${t}`,a,{allowCompatibleAdditiveColumns:i===`binary`,allowedMissingIndexes:o.map(e=>e.name),optionalCanonicalTriggerGroups:n?[{tableName:t,triggers:_n},...i===`binary`?[{tableName:t,triggers:I}]:[]]:[]}),i===`legacy`&&assertKnownRebuildDependents(e,t,o.map(e=>e.name),n?_n.map(e=>e.name):[]),i}function assertKnownRebuildDependents(e,t,n,r){let i=/* @__PURE__ */ new Set([...n,...r]),a=e.prepare(`
    SELECT type, name, tbl_name FROM main.sqlite_schema
    WHERE (type IN ('trigger', 'index') AND tbl_name = ? AND sql IS NOT NULL)
       OR (type IN ('view', 'trigger') AND instr(lower(sql), ?) > 0)
  `).all(t,t).find(e=>e.tbl_name!==t||!i.has(String(e.name)));if(a)throw Error(`Memory storage migration cannot rebuild unknown ${String(a.type)} ${String(a.name)} on ${t}`);for(let n of e.prepare(`SELECT name FROM main.sqlite_schema WHERE type = 'table'`).all()){let r=String(n.name),i=e.prepare(`PRAGMA main.foreign_key_list("${r.replaceAll(`"`,`""`)}")`).all().filter(e=>e.table===t),a=t===`memory_index_chunks`&&[`memory_index_chunk_provenance`,`memory_index_chunk_recall_metadata`].includes(r);if(i.some(e=>!a||e.from!==`chunk_id`||e.to!==`id`||e.on_delete!==`CASCADE`||e.on_update!==`NO ACTION`))throw Error(`Memory storage migration cannot rebuild ${t} referenced by an unknown foreign key in ${r}`)}}function storageShapes(e,t){return{chunks:storageShape(e,`memory_index_chunks`,!0),cache:storageShape(e,t,!1)}}function assertBinaryEmbeddings(e,t){let n=e.prepare(`SELECT openclaw_memory_embedding_blob_valid(embedding) AS valid FROM ${t}`);for(let e of n.iterate())if(e.valid===0)throw Error(`Memory storage migration found invalid binary embeddings in ${t}`)}function copyMemoryStorageRows(e,t,n){let r=e.prepare(`SELECT rowid AS storage_rowid FROM ${t}`);r.setReadBigInts(!0);let i=e.prepare(n);i.setReadBigInts(!0);for(let e of r.iterate()){if(typeof e.storage_rowid!=`bigint`)throw Error(`Invalid memory storage identity during migration`);i.run(e.storage_rowid)}}function markInvalidMemoryEmbeddings(e,t){let n=e.prepare(t);n.setReadBigInts(!0);let r=e.prepare(`
    UPDATE main.memory_index_sources SET hash = ''
    WHERE (path, source) IN (
      SELECT path, source FROM main.memory_index_chunks WHERE rowid = ?
    )`);r.setReadBigInts(!0);let i=!1;for(let e of n.iterate())if(e.valid===0){if(typeof e.storage_rowid!=`bigint`)throw Error(`Invalid memory storage identity during migration`);r.run(e.storage_rowid),i=!0}i&&e.exec(`
      INSERT INTO main.memory_index_meta (key, value)
      VALUES ('memory_vector_rebuild_v1', '1')
      ON CONFLICT(key) DO UPDATE SET value = excluded.value;
    `)}function legacyEmbedding(e){if(typeof e==`string`)try{let t=JSON.parse(e);return Array.isArray(t)&&t.every(e=>typeof e==`number`&&Number.isFinite(e))?t:void 0}catch{return}}function copyLegacyMemoryEmbeddingCache(e,t,n,r){let i=1048576,a=e.prepare(`
    SELECT rowid AS storage_rowid,
      CASE WHEN length(CAST(embedding AS BLOB)) <= ${i}
        THEN embedding ELSE NULL END AS embedding
    FROM ${t} WHERE rowid >= ? ORDER BY rowid LIMIT 128
  `);a.setReadBigInts(!0);let o=e.prepare(`
    INSERT INTO ${n} (rowid, provider, model, provider_key, hash, embedding, dims, updated_at)
    SELECT rowid, provider, model, provider_key, hash, ?, dims, updated_at
    FROM ${t} WHERE rowid = ?
  `);o.setReadBigInts(!0);let s=-9223372036854775808n,c=0,l=[];for(;s<=9223372036854775807n;){let e=0;for(let t of a.iterate(s)){if(typeof t.storage_rowid!=`bigint`)throw Error(`Invalid memory storage identity during migration`);r(),s=t.storage_rowid+1n,e+=1;let n=legacyEmbedding(t.embedding??null);if(n===void 0){c+=1,l.length<8&&l.push(String(t.storage_rowid));continue}o.run(encodeMemoryEmbedding(n),t.storage_rowid)}if(e<128)break}return c>0?`Skipped ${c} ${t} rows with invalid embeddings or embeddings larger than ${i} bytes (first rowids: ${l.join(`, `)}). These cache entries will be rebuilt on demand.`:void 0}function registerMemoryEmbeddingMigrationFunctions(e,t){let n=-1/0,renew=()=>{if(!t)return;let e=performance.now();e-n>=1e3&&(t(),n=e)};return e.function(`openclaw_memory_embedding_from_json`,{deterministic:!0},e=>(renew(),encodeMemoryEmbedding(legacyEmbedding(e)??[]))),e.function(`openclaw_memory_embedding_json_valid`,{deterministic:!0},e=>(renew(),Number(legacyEmbedding(e)!==void 0))),e.function(`openclaw_memory_embedding_blob_valid`,{deterministic:!0},e=>(renew(),Number(e instanceof Uint8Array&&e.byteLength%8==0&&decodeMemoryEmbedding(e).length*8===e.byteLength))),renew}function existingStorageObjects(e,t){return e.prepare(`SELECT sql FROM main.sqlite_schema
    WHERE tbl_name = ? AND type IN ('index', 'trigger') AND sql IS NOT NULL
    ORDER BY type, name`).all(t).map(e=>String(e.sql))}function columns(e,t){return new Map(e.prepare(`SELECT name, type FROM pragma_table_info(?)`).all(t).map(e=>[String(e.name),String(e.type).toUpperCase()]))}function migrateMemoryIndexStorage(e,t={}){let n=t.embeddingCacheTable??`memory_embedding_cache`;if(!/^[A-Za-z_][A-Za-z0-9_]*$/u.test(n))throw Error(`Invalid memory embedding cache table identifier`);let r=storageShapes(e,n),i=r.chunks===`legacy`,a=r.cache===`legacy`;if(!i&&!a)return;let o=Number(e.prepare(`PRAGMA foreign_keys`).get()?.foreign_keys)!==0;if(i&&o&&e.isTransaction)throw Error(`Memory storage migration requires foreign keys disabled before BEGIN`);i&&o&&e.exec(`PRAGMA foreign_keys = OFF`);let s;try{S(e,()=>{let o=storageShapes(e,n);if(o.chunks!==r.chunks||o.cache!==r.cache)throw Error(`Memory storage schema changed before migration admission`);let c=registerMemoryEmbeddingMigrationFunctions(e,t.renewAuthority),l=i?existingStorageObjects(e,`memory_index_chunks`):[],u=a?existingStorageObjects(e,n):[];if(o.chunks===`binary`&&assertBinaryEmbeddings(e,`memory_index_chunks`),o.cache===`binary`&&assertBinaryEmbeddings(e,n),i){ensureMemoryRecallMetadataSchema(e),markInvalidMemoryEmbeddings(e,`
          SELECT rowid AS storage_rowid,
                 openclaw_memory_embedding_json_valid(embedding) AS valid
          FROM memory_index_chunks
        `),dropMemoryChunkFtsTriggers(e),e.exec(fn.replace(`CREATE TABLE IF NOT EXISTS`,`CREATE TABLE`).replace(`memory_index_chunks`,`memory_index_chunks_storage_migration`)),copyMemoryStorageRows(e,`memory_index_chunks`,`
          INSERT INTO memory_index_chunks_storage_migration (
            chunk_rowid, id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
          )
          SELECT rowid, id, path, source, start_line, end_line, hash, model, text,
                 openclaw_memory_embedding_from_json(embedding), updated_at
          FROM memory_index_chunks WHERE rowid = ?
        `),e.exec(`
          DROP TABLE memory_index_chunks;
          ALTER TABLE memory_index_chunks_storage_migration RENAME TO memory_index_chunks;
        `);for(let t of l)e.exec(t);e.prepare(`SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?`).get(`memory_index_chunks_fts`)&&(rebuildMemoryChunkFts(e,P),ensureMemoryChunkFtsTriggers(e))}if(a){let t=`${n}_storage_migration`;e.exec(buildMemoryEmbeddingCacheSchema(t).replace(`CREATE TABLE IF NOT EXISTS`,`CREATE TABLE`)),s=copyLegacyMemoryEmbeddingCache(e,n,t,c),e.exec(`
          DROP TABLE ${n};
          ALTER TABLE ${t} RENAME TO ${n};
        `);for(let t of u)e.exec(t)}if(i){for(let t of[`memory_index_chunk_provenance`,`memory_index_chunk_recall_metadata`])if(columns(e,t).size>0&&e.prepare(`PRAGMA foreign_key_check(${t})`).all().length>0)throw Error(`Memory storage migration failed foreign key validation`)}})}finally{t.renewAuthority&&registerMemoryEmbeddingMigrationFunctions(e),i&&o&&e.exec(`PRAGMA foreign_keys = ON`)}s&&(t.onWarning?t.onWarning(s):process.emitWarning(s))}var hn,gn,_n,vn,yn=e((()=>{mn(),pn(),dn(),j(),rn(),hn=`
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
`,gn=[{name:`idx_memory_index_chunks_path_source`,columns:`path, source`},{name:`idx_memory_index_chunks_path`,columns:`path`},{name:`idx_memory_index_chunks_source`,columns:`source`}],_n=[`insert`,`update`,`delete`].map(e=>({name:`memory_index_chunks_revision_after_${e}`,sql:`CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_${e}
    AFTER ${e.toUpperCase()} ON memory_index_chunks
    BEGIN UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1; END;`})),vn=[[`importance`,`importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10)`],[`triggers`,`triggers TEXT`],[`project_key`,`project_key TEXT`]]}));function tableColumnInfo(e,t){return e.prepare(`PRAGMA main.table_xinfo(${t})`).all().flatMap(e=>typeof e.name==`string`&&typeof e.type==`string`?[{name:e.name,type:e.type.toUpperCase(),notnull:Number(e.notnull??0),pk:Number(e.pk??0),defaultValue:typeof e.dflt_value==`string`?e.dflt_value:null,hidden:Number(e.hidden??0)}]:[])}function tableHasExactColumns(e,t,n){let r=new Set(tableColumnInfo(e,t).map(e=>e.name));return r.size===n.length&&n.every(e=>r.has(e))}function tablePrimaryKeyColumns(e,t){return tableColumnInfo(e,t).filter(e=>e.pk>0).toSorted((e,t)=>e.pk-t.pk).map(e=>e.name)}function tableHasPrimaryKey(e,t,n){let r=tablePrimaryKeyColumns(e,t);return r.length===n.length&&r.every((e,t)=>e===n[t])}function tableHasUniqueIndex(e,t,n){let r=e.prepare(`SELECT name, partial FROM pragma_index_list(?) WHERE "unique" = 1`).all(t);return r.length===1&&r.some(t=>{if(typeof t.name!=`string`||Number(t.partial??0)!==0)return!1;let r=e.prepare(`SELECT cid, name, coll, "desc" AS sort_desc, key FROM pragma_index_xinfo(?) ORDER BY seqno`).all(t.name).filter(e=>Number(e.key??0)===1);return r.length===n.length&&r.every((e,t)=>Number(e.cid??-1)>=0&&e.name===n[t]&&e.coll===`BINARY`&&Number(e.sort_desc??0)===0)})}function tableHasNoDeclaredCollations(e,t){let n=e.prepare(`SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = ?`).get(t);return typeof n?.sql==`string`&&!/\bCOLLATE\b/iu.test(n.sql)}function tableHasSourceColumnContract(e,t){return tableColumnInfo(e,M).every(e=>(e.type===Sn.get(e.name)||e.name===`mtime`&&e.type===`INTEGER`)&&e.defaultValue===(e.name===`source`?`'memory'`:null)&&e.hidden===0&&(e.name===t||e.notnull===1))}function tableHasIntegerRowIdPrimaryKey(e){return tableColumnInfo(e,`memory_index_sources`).find(e=>e.name===`id`)?.type!==`INTEGER`||!tableHasPrimaryKey(e,`memory_index_sources`,[`id`])?!1:e.prepare(`SELECT 1 AS found FROM pragma_index_list(?) WHERE origin = 'pk' LIMIT 1`).get(M)?.found!==1}function tableExists(e,t){return e.prepare(`SELECT 1 AS found FROM sqlite_master WHERE type = 'table' AND name = ?`).get(t)?.found===1}function migrateMemoryIndexSourcesIdentity(e){if(!tableExists(e,`memory_index_sources`))return;if(tableHasExactColumns(e,`memory_index_sources`,xn)){if(tableHasSourceColumnContract(e,`id`)&&tableHasIntegerRowIdPrimaryKey(e)&&tableHasNoDeclaredCollations(e,`memory_index_sources`)&&tableHasUniqueIndex(e,`memory_index_sources`,[`path`,`source`]))return;throw Error(`canonical memory source identity schema is invalid`)}if(!tableHasExactColumns(e,`memory_index_sources`,bn))throw Error(`canonical memory source identity schema is invalid`);let t=tableHasPrimaryKey(e,M,[`path`]),n=tableHasPrimaryKey(e,M,[`path`,`source`]);if(!t&&!n||!tableHasSourceColumnContract(e,t?`path`:void 0))throw Error(`canonical memory source identity schema is invalid`);let r=tableExists(e,F);e.exec(`SAVEPOINT migrate_memory_index_sources_identity`);try{dropMemoryPathFtsTriggers(e),e.exec(`
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_insert;
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_update;
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_delete;

      ALTER TABLE ${M}
        RENAME TO memory_index_sources_identity_migration;
      CREATE TABLE ${M} (
        id INTEGER PRIMARY KEY,
        path TEXT NOT NULL,
        source TEXT NOT NULL DEFAULT 'memory',
        hash TEXT NOT NULL,
        mtime REAL NOT NULL,
        size INTEGER NOT NULL,
        UNIQUE (path, source)
      ) STRICT;
      INSERT INTO ${M} (id, path, source, hash, mtime, size)
      SELECT rowid, path, source, hash, mtime, size
      FROM memory_index_sources_identity_migration;
      DROP TABLE memory_index_sources_identity_migration;
    `),r&&(e.exec(`
        DELETE FROM ${F};
        INSERT INTO ${F} (rowid, path, source)
        SELECT id, path, source FROM ${M};
      `),ensureMemoryPathFtsTriggers(e)),e.exec(`RELEASE migrate_memory_index_sources_identity`)}catch(t){throw e.exec(`ROLLBACK TO migrate_memory_index_sources_identity`),e.exec(`RELEASE migrate_memory_index_sources_identity`),t}}var bn,xn,Sn,Cn=e((()=>{tt(),pn(),dn(),sn(),j(),yn(),rn(),bn=[`path`,`source`,`hash`,`mtime`,`size`],xn=[`id`,...bn],Sn=/* @__PURE__ */ new Map([[`id`,`INTEGER`],[`path`,`TEXT`],[`source`,`TEXT`],[`hash`,`TEXT`],[`mtime`,`REAL`],[`size`,`INTEGER`]])}));function createSqliteSchemaEnsurer(e){let t=/* @__PURE__ */ new WeakSet;return{recordCommitted(e){t.add(e)},ensure(n){if(t.has(n))return!1;let install=()=>{n.exec(e())};return n.isTransaction?(install(),!0):(S(n,install),t.add(n),!1)}}}var wn=e((()=>{x()})),L,R=e((()=>{L=`-- Session storage doctrine: session_nodes.entry_json owns hot logical-session facts;
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

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_last_interaction_at
  ON session_nodes(last_interaction_at DESC, session_key);

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

CREATE TABLE IF NOT EXISTS session_windows (
  session_id TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  previous_session_id TEXT,
  reason TEXT CHECK (reason IS NULL OR reason IN ('initial', 'reset', 'rollover', 'fork', 'rewind', 'switch', 'recovery', 'compaction')),
  session_scope TEXT NOT NULL DEFAULT 'conversation' CHECK (session_scope IN ('conversation', 'shared-main', 'group', 'channel')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  transcript_updated_at INTEGER DEFAULT NULL,
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
  ON session_windows(primary_conversation_id, updated_at DESC, session_id)
  WHERE primary_conversation_id IS NOT NULL;

-- No foreign key: node triggers settle key renames and deletion even while a
-- maintenance owner has disabled foreign-key enforcement.
CREATE TABLE IF NOT EXISTS session_canonical_validation_pending (
  session_key TEXT NOT NULL PRIMARY KEY
) STRICT;

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

CREATE INDEX IF NOT EXISTS idx_agent_session_reactions_message
  ON session_reactions(session_key, session_id, message_id);

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
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_trajectory_runtime_run
  ON trajectory_runtime_events(session_id, run_id, seq)
  WHERE run_id IS NOT NULL;

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

CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_parent
  ON transcript_event_identities(session_id, parent_id)
  WHERE parent_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_sequence
  ON transcript_event_identities(session_id, event_type, seq DESC);

CREATE TABLE IF NOT EXISTS context_engine_turn_outbox (
  advancement_key TEXT NOT NULL PRIMARY KEY,
  engine_id TEXT NOT NULL,
  owner_plugin_id TEXT,
  session_id TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER,
  last_error TEXT,
  created_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_context_engine_turn_outbox_engine
  ON context_engine_turn_outbox(engine_id, created_at);

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
) STRICT;

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

CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_insert
AFTER INSERT ON memory_index_sources
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_update
AFTER UPDATE ON memory_index_sources
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_delete
AFTER DELETE ON memory_index_sources
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_insert
AFTER INSERT ON memory_index_chunks
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_update
AFTER UPDATE ON memory_index_chunks
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_delete
AFTER DELETE ON memory_index_chunks
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE INDEX IF NOT EXISTS idx_memory_embedding_cache_updated_at
  ON memory_embedding_cache(updated_at);

CREATE INDEX IF NOT EXISTS idx_memory_index_sources_source
  ON memory_index_sources(source);

CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path_source
  ON memory_index_chunks(path, source);

CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path
  ON memory_index_chunks(path);

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
`}));function ensureContextEngineTurnOutboxSchema(e){En.ensure(e)}var Tn,En,Dn,On=e((()=>{wn(),g(),R(),Tn=`context_engine_turn_outbox`,En=createSqliteSchemaEnsurer(()=>v(L,Tn,{endMarker:`CREATE TABLE IF NOT EXISTS cache_entries (`,includeEndMarker:!1,errorMessage:`OpenClaw context-engine turn outbox schema markers are missing.`})),Dn=En.recordCommitted})),kn,An,jn,Mn,Nn=e((()=>{kn=[{columnName:`owner_actor_type`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_actor_id`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_assigned_by_type`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_assigned_by_id`,dataType:`TEXT`,tableName:`session_nodes`},{columnName:`owner_assigned_at`,dataType:`INTEGER`,tableName:`session_nodes`}],An={columnName:`legacy_acp_migration_json`,dataType:`TEXT`,tableName:`session_nodes`},jn={columnName:`canonical_ready`,dataType:`TEXT`,tableName:`session_key_contract`},Mn=[...kn,An,jn]}));function ensureSessionGoalOperationsSchema(e){if(Fn.has(e))return;let t=v(L,Pn,{endMarker:`CREATE TABLE IF NOT EXISTS transcript_events (`,includeEndMarker:!1,errorMessage:`OpenClaw Goal operation schema markers are missing.`});S(e,()=>{e.exec(t)}),Fn.add(e)}var Pn,Fn,In=e((()=>{g(),x(),R(),Pn=`session_goal_operations`,Fn=/* @__PURE__ */ new WeakSet}));function ensureMessageToolRunOutcomeSchema(e,t){Rn.has(e)||(S(e,()=>{t?.(`transaction`),e.exec(v(L,Ln,{endMarker:`CREATE TABLE IF NOT EXISTS session_goal_operations (`,includeEndMarker:!1,errorMessage:`OpenClaw message-tool run outcome schema markers are missing.`}))},{withCommit(e){t?.(`commit`),e()}}),Rn.add(e))}var Ln,Rn,zn=e((()=>{g(),x(),R(),Ln=`message_tool_run_outcomes`,Rn=/* @__PURE__ */ new WeakSet}));function hasSessionPendingInputsSchema(e){if(Vn.has(e))return!0;if(!e.isTransaction&&Wn.has(e))return!1;let t=!!e.prepare(`SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?`).get(z);return e.isTransaction||(t?Vn:Wn).add(e),t}function ensureSessionPendingInputsSchema(e){if(Hn.has(e))return;let t=L.indexOf(`CREATE TABLE IF NOT EXISTS ${z} (`);if(t<0)throw Error(`OpenClaw pending-input schema marker is missing.`);let n=e.isTransaction;S(e,()=>{e.exec(L.slice(t,L.indexOf(`-- Processing completion`))),Pt(e,z,`consumed_event_id TEXT`)}),Wn=/* @__PURE__ */ new WeakSet,n||(Vn.add(e),Hn.add(e))}function ensureSessionInputCompletionsSchema(e){if(Un.has(e))return;let t=L.indexOf(`CREATE TABLE IF NOT EXISTS session_input_completions (`);if(t<0)throw Error(`OpenClaw input-completion schema marker is missing.`);let n=e.isTransaction;S(e,()=>{e.exec(L.slice(t))}),n||Un.add(e)}function hasPendingInputConsumptionColumnMigration(e){return hasSessionPendingInputsSchema(e)&&!Ft(e,`session_pending_inputs`,`consumed_event_id`)}function ensurePendingInputConsumptionColumn(e){Pt(e,z,`consumed_event_id TEXT`)}var z,Bn,Vn,Hn,Un,Wn,Gn=e((()=>{x(),R(),Nt(),z=`session_pending_inputs`,Bn=`session_input_completions`,Vn=/* @__PURE__ */ new WeakSet,Hn=/* @__PURE__ */ new WeakSet,Un=/* @__PURE__ */ new WeakSet,Wn=/* @__PURE__ */ new WeakSet}));function canonicalBoardWidgetsCreateSql(){return v(V,`board_widgets`,{endMarker:`CREATE INDEX IF NOT EXISTS idx_agent_board_widgets_tab_position`,includeEndMarker:!1,errorMessage:`OpenClaw agent board widget schema markers are missing.`}).trim()}function legacyBoardWidgetsCreateSql(){let e=canonicalBoardWidgetsCreateSql(),t=e.replace(qn,`content_kind IN ('html', 'mcp-app')`).replace(Jn,``);if(t===e)throw Error(`OpenClaw agent board widget legacy schema derivation failed.`);return t}function normalizeBoardWidgetsCreateSql(e){return e.replace(/^CREATE TABLE(?: IF NOT EXISTS)?\s+(?:board_widgets|"board_widgets"|`board_widgets`|\[board_widgets\])\s*\(/iu,`CREATE TABLE board_widgets (`).replace(/\s+/gu,` `).replace(/;\s*$/u,``).trim()}function ensureOpenClawAgentBoardSchemaInTransaction(e){if(!e.isTransaction)throw Error(`board schema ensure requires an active transaction`);e.exec(V);let t=e.prepare(`SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = 'board_widgets'`).get();if(typeof t?.sql!=`string`)throw Error(`OpenClaw agent board widget schema is missing after ensure.`);let n=normalizeBoardWidgetsCreateSql(t.sql);if(n===normalizeBoardWidgetsCreateSql(canonicalBoardWidgetsCreateSql()))return;if(n!==normalizeBoardWidgetsCreateSql(legacyBoardWidgetsCreateSql()))throw Error(`OpenClaw agent board widget schema has an unsupported content-kind constraint.`);if(e.prepare(`SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?`).get(B))throw Error(`OpenClaw agent board migration table already exists: ${B}`);let r=canonicalBoardWidgetsCreateSql().replace(Kn,`CREATE TABLE ${B} (`);e.exec(`
    ${r}
    INSERT INTO ${B} (
      session_key, name, tab_id, title, content_kind, html, descriptor_json, sha256,
      view_generation, revision, size_w, size_h, position, manifest, grant_state,
      granted_sha, created_by, created_at, updated_at
    )
    SELECT
      session_key, name, tab_id, title, content_kind, html, descriptor_json, sha256,
      view_generation, revision, size_w, size_h, position, manifest, grant_state,
      granted_sha, created_by, created_at, updated_at
    FROM board_widgets;
    DROP TABLE board_widgets;
    ALTER TABLE ${B} RENAME TO board_widgets;
  `),e.exec(V)}var Kn,B,qn,Jn,V,Yn,Xn,Zn=e((()=>{g(),R(),Kn=`CREATE TABLE IF NOT EXISTS board_widgets (`,B=`board_widgets_plugin_kind_migration_new`,qn=/content_kind\s+IN\s*\(\s*'html'\s*,\s*'mcp-app'\s*,\s*'plugin'\s*\)/iu,Jn=/\s+OR\s+\(content_kind\s*=\s*'plugin'\s+AND\s+html\s+IS\s+NULL\s+AND\s+descriptor_json\s+IS\s+NOT\s+NULL\s+AND\s+view_generation\s+IS\s+NULL\)/iu,V=v(L,`board_tabs`,{endMarker:`CREATE TABLE IF NOT EXISTS session_progress_cards (`,includeEndMarker:!1,errorMessage:`OpenClaw agent board schema markers are missing from the canonical schema.`}),Yn=V,Xn=L.replace(V,``)}));function ensureOpenClawAgentProgressCardSchemaInTransaction(e){if(!e.isTransaction)throw Error(`progress-card schema ensure requires an active transaction`);e.exec($n)}var Qn,$n,er,tr=e((()=>{g(),Zn(),Qn=`session_progress_cards`,$n=v(Xn,Qn,{endMarker:`CREATE TABLE IF NOT EXISTS heartbeat_outcomes (`,includeEndMarker:!1,errorMessage:`OpenClaw agent progress-card schema markers are missing.`}),er=Xn.replace($n,``)}));function ensureSessionTranscriptArchiveSchema(e){rr.ensure(e)}var nr,rr,ir=e((()=>{wn(),g(),R(),nr=`session_transcript_archives`,rr=createSqliteSchemaEnsurer(()=>v(L,nr,{endMarker:`CREATE TABLE IF NOT EXISTS transcript_rewrite_watermarks (`,includeEndMarker:!1,errorMessage:`OpenClaw session transcript archive schema markers are missing.`}))})),ar,or,sr,cr=e((()=>{_e(),Ot(),We(),x(),Nt(),ar=`standing_intents`,or=`standing_intents_fts`,sr=[`standing_intents_fts_config`,`standing_intents_fts_data`,`standing_intents_fts_docsize`,`standing_intents_fts_idx`]})),lr,ur=e((()=>{sn(),j(),Cn(),On(),Nn(),It(),In(),zn(),Gn(),tr(),ir(),cr(),lr={allowCompatibleAdditiveColumns:!0,allowedMissingTables:[`session_reactions`,`memory_entry_origins`,`memory_session_tombstones`,k,cn,Tn,Ln,Pn,z,Bn,Lt,Qn,nr,ar,or,...sr],allowedMissingColumns:[`session_pending_inputs.consumed_event_id`,`session_transcript_active_events.context_eligible`,`session_conversations.route_context_json`,`standing_intents.creator_sender`,...Mn.map(({columnName:e,tableName:t})=>`${t}.${e}`)],allowedColumnDefinitions:{"conversations.delivery_target":[`delivery_target TEXT NOT NULL DEFAULT ''`]},allowedMissingIndexes:[`idx_agent_transcript_context_pending`,`idx_agent_session_nodes_label`,`idx_agent_session_nodes_entry_not_valid`],optionalCanonicalTriggerGroups:[{tableName:`memory_index_chunks`,triggers:I},{tableName:M,triggers:un}]}}));function recordOpenClawAgentDatabaseReadOpenFailure(e){typeof e==`object`&&e&&Ye(e)!==void 0&&dr.add(e)}function isOpenClawAgentDatabaseReadOpenFailure(e){return typeof e==`object`&&!!e&&dr.has(e)}function classifyOpenClawAgentDatabaseReadError(e,t){try{let n=Mt(e,L,lr).filter(e=>e.code===`missing-table`).map(e=>e.objectName);return n.length>0?new gt(`table-missing`,{cause:t},n):t}catch{return t}}var dr,fr=e((()=>{Qe(),Ot(),c(),ur(),R(),bt(),dr=l(Symbol.for(`openclaw.agentDatabaseSettledReadOpenFailures`),()=>/* @__PURE__ */ new WeakSet)}));function readDefinitions(e){let t=/* @__PURE__ */ new Map,n=e.prepare(pr).all();for(let e of n){if(typeof e.name!=`string`||typeof e.sql!=`string`)throw Error(`Session canonical validation schema has an unreadable definition`);t.set(e.name,Ue(e.sql))}return t}function expectedDefinitions(){return l(Symbol.for(`openclaw.agentCanonicalValidationSchemaDefinitions`),()=>{let e=y(`:memory:`);try{return e.exec([v(L,`session_nodes`),v(L,`session_windows`),v(L,`session_key_contract`,{endMarker:`CREATE TABLE IF NOT EXISTS session_windows (`,includeEndMarker:!1}),canonicalSessionValidationSchemaSql()].join(`
`)),readDefinitions(e)}finally{e.close()}})}function assertCanonicalSessionValidationSchema(e){let t=He(e),n=t?.schemaVersion??Dt(e);if(typeof n!=`number`)throw Error(`Session canonical validation schema version is unavailable`);let r=H.get(e);if(r&&(t?r.schema===t:!r.schema&&r.cookie===n))return;r?.unregister(),H.delete(e);let i=expectedDefinitions(),a=readDefinitions(e);for(let t of/* @__PURE__ */ new Set([...i.keys(),...a.keys()]))if(i.get(t)!==a.get(t))throw classifyOpenClawAgentDatabaseReadError(e,/* @__PURE__ */ Error(`Session canonical validation schema is missing or drifted: ${t}; run openclaw doctor --fix with the compatible build.`));if(!t&&Dt(e)!==n)throw Error(`Session canonical validation schema changed during admission; retry the read`);if(t||!e.isTransaction){let r=ze(e,()=>{H.delete(e),r()});H.set(e,{cookie:n,schema:t,unregister:r})}}function canonicalSessionValidationSchemaSql(e=L){return v(e,`session_canonical_validation_pending`,{endMarker:`CREATE TABLE IF NOT EXISTS conversations (`,includeEndMarker:!1})}function withoutCanonicalSessionValidationSchema(e){return e.includes(`CREATE TABLE IF NOT EXISTS session_canonical_validation_pending (`)?e.replace(canonicalSessionValidationSchemaSql(e),``):e}var pr,H,mr=e((()=>{Re(),b(),Ot(),We(),g(),c(),fr(),R(),pr=`SELECT name, sql FROM main.sqlite_schema
  WHERE name = 'session_canonical_validation_pending'
    OR (type = 'trigger' AND tbl_name IN (
      'session_nodes', 'session_windows', 'session_key_contract', 'session_canonical_validation_pending'
    ))`,H=l(Symbol.for(`openclaw.agentCanonicalValidationSchemas`),()=>/* @__PURE__ */ new WeakMap)}));function registerOpenClawAgentDatabaseIdentity(e){let t=we(e.location()??``),n=t?Se(t):void 0;if(n&&!n.key.startsWith(`file:`))throw Error(`OpenClaw agent database disappeared before identity registration`);let r=n?n.key.slice(5):Symbol(`incognito-agent-database`);hr.set(e,{identity:r,birthtime:n?.birthtime,incarnation:Xt(),filename:t,canonicalPath:n?.canonicalPath??t})}function readOpenClawAgentDatabaseIdentity(e){let t=findOpenClawAgentDatabaseIdentity(e);if(t===void 0)throw Error(`OpenClaw agent database identity was not prepared at open`);return t}function findOpenClawAgentDatabaseIdentity(e){return hr.get(e.db)}function isOpenClawAgentDatabasePathCurrent(e){if(!e.db.isOpen)return!1;let{identity:t,filename:n}=readOpenClawAgentDatabaseIdentity(e);if(typeof t==`symbol`)return!0;if(we(e.db.location()??``)!==n)return!1;let r=D(e.path,{bigint:!0,throwIfNoEntry:!1});return r!==void 0&&t===`${r.dev}:${r.ino}`}function assertOpenClawAgentDatabaseIdentity(e,t){let n=readOpenClawAgentDatabaseIdentity(e);if(`file:${String(n.identity)}`!==t.key||t.birthtime!==void 0&&n.birthtime!==t.birthtime||!isOpenClawAgentDatabasePathCurrent(e))throw Error(`Agent database changed during repair admission`)}function createOpenClawAgentDatabaseClaim(e,t){let n=!1,isCurrent=()=>!n&&e.db.isOpen,{identity:r,incarnation:i}=readOpenClawAgentDatabaseIdentity(e);return{identity:r,incarnation:i,isCurrent,assertCurrent:()=>{if(!isCurrent())throw Error(`OpenClaw agent database claim is no longer current`)},release:()=>{n||(n=!0,t())}}}var hr,gr=e((()=>{xe(),c(),hr=l(Symbol.for(`openclaw.agentDatabaseIdentities`),()=>/* @__PURE__ */ new WeakMap)}));function hasReceiptColumn(e){if(_r.has(e))return!0;let{tableName:t,columnName:n}=jn,r=Ft(e,t,n);return r&&!e.isTransaction&&_r.add(e),r}function physicalReceipt(e){let t=findOpenClawAgentDatabaseIdentity(e);if(t&&typeof t.identity==`string`&&isOpenClawAgentDatabasePathCurrent({...e,path:t.filename}))return JSON.stringify([1,e.agentId,t.identity,t.birthtime])}function hasPersistedOpenClawAgentCanonicalValidation(e){let t=physicalReceipt(e);return!t||!hasReceiptColumn(e.db)?!1:(assertCanonicalSessionValidationSchema(e.db),St(e.db,C(e.db).selectFrom(`session_key_contract`).select(`canonical_ready`).where(`id`,`=`,1))?.canonical_ready===t)}var _r,vr=e((()=>{Ct(),_e(),mr(),Nn(),gr(),Nt(),_r=/* @__PURE__ */ new WeakSet}));function captureAgentDatabaseCloseFence(e){let t={agentId:fe(e.agentId),path:O.resolve(e.path)},n=[...U.selections].flatMap(([e,n])=>matchesAgentDatabaseClose(e,t)?[n]:[]);return n.length?Promise.all(n).then(()=>void 0):void 0}function matchesAgentDatabaseClose(e,t){return(e.path===void 0||e.path===t.path||t.ownership===`unresolved`&&T(t,e.path))&&(e.rootPath===void 0||n(e.rootPath,t.path)||t.ownership===`unresolved`&&T(t,e.rootPath))&&(e.agentId===void 0||t.ownership===`unresolved`||e.agentId===t.agentId)}function registerOpenClawAgentDatabaseAsyncResource(e){return registerAgentDatabaseResource({...e,ownership:`known`,agentId:fe(e.agentId)})}function registerOpenClawAgentDatabaseSyncResource(e){return registerAgentDatabaseResource({...e,ownership:`known`,agentId:fe(e.agentId),close:async()=>e.close(),closeSync:e.close})}function registerOpenClawAgentDatabaseReadCandidateResource(e){return registerAgentDatabaseResource({...e,ownership:`unresolved`})}function registerAgentDatabaseResource(e){let t={...e,path:O.resolve(e.path)};if([...U.selections.keys()].some(e=>matchesAgentDatabaseClose(e,t))||[...U.closing.keys()].some(e=>(e.path===t.path||e.ownership===`unresolved`&&T(e,t.path)||t.ownership===`unresolved`&&T(t,e.path))&&(e.ownership===`unresolved`||t.ownership===`unresolved`||e.agentId===t.agentId)))throw Error(`Agent database resources are closing: ${t.path}`);let unregister=()=>U.active.delete(t);return h()?.own(unregister,`agent-resources`,()=>closeAgentDatabaseResource(t)),U.active.add(t),unregister}function closeAgentDatabaseResource(e,t){if(e.ownership===`known`&&e.closeSync){U.closing.set(e,void 0);try{return e.revoke(),e.closeSync(),U.active.delete(e),U.closing.delete(e),Promise.resolve()}catch(n){t&&t(e.path,n);let i=Promise.reject(r(n,`Agent database cleanup failed`));return i.catch(()=>{}),i}}let n=U.closing.get(e);return n||(n=Promise.resolve().then(()=>e.close()),U.closing.set(e,n),n.then(()=>{U.active.delete(e),U.closing.delete(e)},()=>{U.closing.set(e,void 0)}).catch(()=>{})),t&&n.catch(n=>t(e.path,n)).catch(()=>{}),e.revoke(),n}function revokeAgentDatabaseResources(e,t){let n=/* @__PURE__ */ new Set([...U.active,...U.closing.keys()]),r=[];for(let i of n)matchesAgentDatabaseClose(e,i)&&r.push(closeAgentDatabaseResource(i,t));return r}async function drainAgentDatabaseResources(e,t){let n={...e},r=se();r.promise.catch(()=>{}),U.selections.set(n,r.promise);try{let e=(await Promise.allSettled(revokeAgentDatabaseResources(n))).flatMap(e=>e.status===`rejected`?[e.reason]:[]);if(e.length>0)throw AggregateError(e,`Agent database resource drainage failed`);let i=await t();return r.resolve(),i}catch(e){throw r.reject(e),e}finally{U.selections.delete(n)}}var U,yr=e((()=>{pe(),i(),Rt(),u(),oe(),c(),m(),U=l(Symbol.for(`openclaw.agentDatabaseAsyncResources`),()=>({active:/* @__PURE__ */ new Set,closing:/* @__PURE__ */ new Map,selections:/* @__PURE__ */ new Map})),zt(async e=>{let t=(await Promise.allSettled([.../* @__PURE__ */ new Set([...U.active,...U.closing.keys()])].filter(t=>e.some(e=>T(e,t.path))).map(e=>closeAgentDatabaseResource(e)))).flatMap(e=>e.status===`rejected`?[e.reason]:[]);if(t.length>0)throw AggregateError(t,`Agent database resource cleanup failed`)})}));function bindValidationLifetime(e,t){let n=br.get(e.db);if(!e.db.isOpen||n?.validation===t)return;n?.unregister();let r=ze(e.db,n=>{n===`replace`&&Atomics.store(new Int32Array(t.valid),0,0),br.delete(e.db),r()});br.set(e.db,{validation:t,unregister:r})}function matchesValidation(e,t){return t.agentId===e.agentId&&t.identity===findOpenClawAgentDatabaseIdentity(e)?.identity&&Atomics.load(new Int32Array(t.valid),0)===1}function hasRevokedOpenClawAgentDatabaseValidation(e,t){let n=W.get(O.resolve(e));return t!==void 0&&Atomics.load(new Int32Array(t.valid),0)!==1||n?.revoked===!0||n?.validation!==void 0&&Atomics.load(new Int32Array(n.validation.valid),0)!==1}function getOpenClawAgentDatabaseValidation(e){let t=W.get(O.resolve(e.path));if(!t?.integrityVerified||!t.validation||!matchesValidation(e,t.validation))return;let n=t.validation;return bindValidationLifetime(e,n),n}function getOpenClawAgentDatabaseValidationForTransfer(e){let t=W.get(O.resolve(e.path));if(t?.integrityVerified&&t.validation&&t.validation.agentId===e.agentId&&Atomics.load(new Int32Array(t.validation.valid),0)===1)return t.validation}function captureOpenClawAgentDatabaseValidationTransfer(e){let t=O.resolve(e.path),n=W.get(t),r=n?.agentId===e.agentId?n:{...n,agentId:e.agentId,integrityVerified:n?.integrityVerified??!1};W.set(t,r);let i=r.validation,a=i?Atomics.load(new Int32Array(i.valid),0):void 0;return(n,s)=>{if(W.get(t)!==r||i&&a===1&&Atomics.load(new Int32Array(i.valid),0)!==1||!o(s)||s.agentId!==e.agentId||s.identity!==n||!(s.valid instanceof SharedArrayBuffer)||s.valid.byteLength!==Int32Array.BYTES_PER_ELEMENT||Atomics.load(new Int32Array(s.valid),0)!==1||!(s.canonicalReady instanceof SharedArrayBuffer)||s.canonicalReady.byteLength!==Int32Array.BYTES_PER_ELEMENT)return!1;if(a===1&&r.integrityVerified&&r.validation?.agentId===e.agentId&&r.validation?.identity===n)return!0;let c={agentId:e.agentId,identity:n,valid:s.valid,canonicalReady:s.canonicalReady};return hasRevokedOpenClawAgentDatabaseValidation(t)&&Atomics.store(new Int32Array(c.canonicalReady),0,0),invalidateOpenClawAgentDatabaseValidation(t),W.set(t,{validation:c,integrityVerified:!0}),!0}}function canonicalValidationReceipt(e){if(!e.db.isOpen||!findOpenClawAgentDatabaseIdentity(e))return;let t=e.path??e.db.location();if(!t)return;let n=W.get(O.resolve(t))?.validation;if(n&&matchesValidation({...e,path:t},n))return bindValidationLifetime({...e,path:t},n),n}function hasOpenClawAgentCanonicalValidation(e){let t=canonicalValidationReceipt(e);if(t)return Atomics.load(new Int32Array(t.canonicalReady),0)===1&&Atomics.load(new Int32Array(t.valid),0)===1;let n=e.path??findOpenClawAgentDatabaseIdentity(e)?.filename;if(!n||e.db.isTransaction||W.get(O.resolve(n))?.validation!==void 0||hasRevokedOpenClawAgentDatabaseValidation(n)||!hasPersistedOpenClawAgentCanonicalValidation(e))return!1;let r=createValidationReceipt({...e,path:n},!0);return W.set(O.resolve(n),{validation:r,integrityVerified:!1}),bindValidationLifetime({...e,path:n},r),!0}function markOpenClawAgentCanonicalValidation(e){let t=canonicalValidationReceipt(e);if(!t)return!1;let publish=()=>{Atomics.load(new Int32Array(t.valid),0)===1&&Atomics.store(new Int32Array(t.canonicalReady),0,1)};return e.db.isTransaction?ge(e.db,{stage:()=>{},rollback:()=>{},commit:publish}):(publish(),Atomics.load(new Int32Array(t.valid),0)===1)}function adoptOpenClawAgentDatabaseValidation(e,t){return matchesValidation(e,t)?getOpenClawAgentDatabaseValidation(e)?!0:(hasRevokedOpenClawAgentDatabaseValidation(e.path)&&Atomics.store(new Int32Array(t.canonicalReady),0,0),invalidateOpenClawAgentDatabaseValidation(e.path),W.set(O.resolve(e.path),{validation:t,integrityVerified:!0}),bindValidationLifetime(e,t),!0):!1}function isOpenClawAgentCanonicalStoreEmpty(e){return e.db.isTransaction||Et(e.db)<21?!1:(assertCanonicalSessionValidationSchema(e.db),e.db.prepare(`SELECT
    EXISTS(SELECT 1 FROM session_nodes) OR
    EXISTS(SELECT 1 FROM session_canonical_validation_pending) AS populated`).get()?.populated===0)}function createValidationReceipt(e,t){let{identity:n}=readOpenClawAgentDatabaseIdentity(e);if(typeof n!=`string`)throw Error(`Only persistent agent databases retain integrity validation`);let r={agentId:e.agentId,identity:n,valid:new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT),canonicalReady:new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)};return t&&Atomics.store(new Int32Array(r.canonicalReady),0,1),Atomics.store(new Int32Array(r.valid),0,1),r}function setOpenClawAgentDatabaseValidation(e){let t=hasRevokedOpenClawAgentDatabaseValidation(e.path),n=createValidationReceipt(e,isOpenClawAgentCanonicalStoreEmpty(e)||!t&&!e.db.isTransaction&&hasPersistedOpenClawAgentCanonicalValidation(e));return invalidateOpenClawAgentDatabaseValidation(e.path),W.set(O.resolve(e.path),{validation:n,integrityVerified:!0}),bindValidationLifetime(e,n),n}function invalidateOpenClawAgentDatabaseValidation(e,t=W.get(O.resolve(e))?.validation?.identity){let n=O.resolve(e),r=/* @__PURE__ */ new Set([n]);if(t)for(let[e,n]of W)n.validation?.identity===t&&r.add(e);for(let e of r){let t=W.get(e),n=t?.validation;n&&Atomics.store(new Int32Array(n.valid),0,0),W.set(e,{agentId:t?.agentId,validation:n,integrityVerified:!1,revoked:!0})}}function invalidateOpenClawAgentDatabaseValidationsForAgent(e,t){for(let e of t)invalidateOpenClawAgentDatabaseValidation(e);for(let[t,n]of W)(n.validation?.agentId===e||n.agentId===e)&&invalidateOpenClawAgentDatabaseValidation(t)}function clearOpenClawAgentDatabaseValidationCache(e){for(let t of W.keys())(e===void 0||n(e,t))&&(invalidateOpenClawAgentDatabaseValidation(t),W.delete(t))}var W,br,xr=e((()=>{a(),Re(),u(),_e(),Tt(),c(),vr(),mr(),It(),gr(),yr(),W=l(Symbol.for(`openclaw.agentDatabaseValidatedPaths`),()=>/* @__PURE__ */ new Map,()=>clearOpenClawAgentDatabaseValidationCache()),br=l(Symbol.for(`openclaw.agentDatabaseValidationBindings`),()=>/* @__PURE__ */ new WeakMap)}));function resolveAgentIntegrityPath(e){try{return Jt.native(e)}catch(n){if(!t(n,`ENOENT`))throw n;return O.resolve(e)}}function readOpenClawAgentIntegrityVerification(e,t=process.env,n=!1){let read=t=>{let r=C(t),i=St(t,r.selectFrom(`agent_integrity_verifications`).selectAll().where(`path`,`=`,resolveAgentIntegrityPath(e)));if(n){let n=D(e,{bigint:!0,throwIfNoEntry:!1});w(t,r.updateTable(`agent_integrity_verifications`).set({clean_close:0}).where(t=>t.or([t(`path`,`=`,resolveAgentIntegrityPath(e)),...n?[t.and([t(`dev`,`=`,String(n.dev)),t(`ino`,`=`,String(n.ino))])]:[]])))}return i};if(n)return withQuarantineWriter(t,e=>S(e,()=>read(e),{databaseLabel:d(t),operationLabel:`quarantine.integrity.consume`}));let r=d(t);if(!E(r))return;let i;try{return i=y(r,{readOnly:!0}),read(i)}catch{return}finally{i?.close()}}function canReuseOpenClawAgentIntegrityVerification(e,t,n){if(n||!t||t.clean_close!==1||t.app_version!==p||t.path!==resolveAgentIntegrityPath(e))return!1;let r=D(e,{bigint:!0,throwIfNoEntry:!1});return r!==void 0&&t.dev===String(r.dev)&&t.ino===String(r.ino)}function recordOpenClawAgentIntegrityVerification(e,t,n){let r=D(e,{bigint:!0,throwIfNoEntry:!1});if(!r||n!==`${r.dev}:${r.ino}`)return;let i=String(r.dev),a=String(r.ino);withQuarantineWriter(t,t=>{let n=C(t);w(t,n.insertInto(`agent_integrity_verifications`).values({path:resolveAgentIntegrityPath(e),dev:i,ino:a,app_version:p,verified_at:Date.now(),clean_close:0}).onConflict(e=>e.column(`path`).doUpdateSet({dev:i,ino:a,app_version:p,verified_at:Date.now(),clean_close:0})))})}function clearOpenClawAgentIntegrityVerification(e,t=process.env,n=`revoke`){n===`revoke`&&invalidateOpenClawAgentDatabaseValidation(e),withQuarantineWriter(t,r=>S(r,()=>invalidateAgentIntegrityVerification(r,e,n),{databaseLabel:d(t),operationLabel:`quarantine.integrity.invalidate`}))}function invalidateAgentIntegrityVerification(e,t,n=`revoke`){let r=C(e),i=St(e,r.selectFrom(`agent_integrity_verifications`).select([`dev`,`ino`]).where(`path`,`=`,resolveAgentIntegrityPath(t))),a=D(t,{bigint:!0,throwIfNoEntry:!1});if(n===`revoke`)for(let e of[i,a])e&&invalidateOpenClawAgentDatabaseValidation(t,`${e.dev}:${e.ino}`);let matchesFile=e=>e.or([e(`path`,`=`,resolveAgentIntegrityPath(t)),...[i,a].flatMap(t=>t?[e.and([e(`dev`,`=`,String(t.dev)),e(`ino`,`=`,String(t.ino))])]:[])]);n===`retain`?w(e,r.updateTable(`agent_integrity_verifications`).set({clean_close:0}).where(matchesFile)):w(e,r.deleteFrom(`agent_integrity_verifications`).where(matchesFile))}function markOpenClawAgentIntegrityClean(e,t,n){let r=D(e,{bigint:!0,throwIfNoEntry:!1});return!r||n!==`${r.dev}:${r.ino}`?`file-changed`:withQuarantineWriter(t,t=>{let n=C(t);return w(t,n.updateTable(`agent_integrity_verifications`).set({clean_close:1}).where(`path`,`=`,resolveAgentIntegrityPath(e)).where(`dev`,`=`,String(r.dev)).where(`ino`,`=`,String(r.ino)).where(`app_version`,`=`,p)).numAffectedRows===1n?`written`:`verification-missing`})}function createOpenClawDatabaseVerificationError(e,t,n){let r=/* @__PURE__ */ Error(`OpenClaw ${e} database ${t} is quarantined after integrity verification failed: ${n??`unknown integrity error`}. Restore the database from a backup or repair it, then run openclaw doctor --fix to clear the quarantine. See ${Me}.`);return r.name=`SqliteIntegrityError`,r}function ensureQuarantineStoreDirectory(e){let t=O.dirname(e);qt(t,{recursive:!0,mode:Cr}),Ie(t,Cr)}function configureQuarantineWriter(e,t){e.exec(`
    PRAGMA busy_timeout = ${Sr};
    PRAGMA journal_mode = DELETE;
    PRAGMA synchronous = FULL;
  `);let n=readQuarantineSchemaVersion(e,t);if(n>G)throw Error(`OpenClaw quarantine store ${t} uses newer schema version ${n}.`);if(n!==G){if(n===1){e.exec(`
      BEGIN IMMEDIATE;
      ALTER TABLE quarantined_databases ADD COLUMN verified_generation TEXT;
      PRAGMA user_version = ${G};
      COMMIT;
    `);return}e.exec(`
    BEGIN IMMEDIATE;
    CREATE TABLE IF NOT EXISTS quarantined_databases (
      path TEXT NOT NULL PRIMARY KEY,
      kind TEXT NOT NULL,
      reason TEXT NOT NULL,
      quarantined_at INTEGER NOT NULL,
      writer_app_version TEXT,
      verified_generation TEXT
    ) STRICT;
    PRAGMA user_version = ${G};
    COMMIT;
  `)}}function readQuarantineSchemaVersion(e,t){let n=e.prepare(`PRAGMA user_version`).get()?.user_version;if(typeof n!=`number`||!Number.isInteger(n))throw Error(`OpenClaw quarantine store ${t} has an invalid schema version.`);return n}function withQuarantineWriter(e,t){let n=d(e),r=E(n);ensureQuarantineStoreDirectory(n);let i=y(n),a=!1;try{r||Ie(n,wr),configureQuarantineWriter(i,n),i.exec(`CREATE TABLE IF NOT EXISTS agent_integrity_verifications (
      path TEXT NOT NULL PRIMARY KEY, dev TEXT NOT NULL, ino TEXT NOT NULL,
      app_version TEXT NOT NULL, verified_at INTEGER NOT NULL,
      clean_close INTEGER NOT NULL CHECK (clean_close IN (0, 1))
    ) STRICT;`);let e=t(i);return a=!0,e}finally{i.isOpen&&i.close(),(a||!r)&&Ie(n,wr)}}function readOpenClawDatabaseQuarantine(e,t={}){let n=d(t.env??process.env);if(!E(n))return;let r=y(n),i;try{i={value:readQuarantineDecision(r,e,n)}}catch(e){i={error:e}}try{r.close()}catch(e){throw new _t(`error`in i?[i.error,e]:[e],`value`in i?i.value:void 0)}if(`error`in i)throw i.error;return i.value}function readQuarantineDecision(e,t,n){e.exec(`PRAGMA busy_timeout = ${Sr};`);let r=readQuarantineSchemaVersion(e,n);if(r===0)return;if(r>G)throw Error(`OpenClaw quarantine store ${n} uses newer schema version ${r}.`);let i=r>=2?`, verified_generation`:``,a=e.prepare(`SELECT kind, reason, quarantined_at${i} FROM quarantined_databases WHERE path = ? LIMIT 1`).get(O.resolve(t));if(a){if(a.kind!==`agent`&&a.kind!==`state`||typeof a.reason!=`string`||typeof a.quarantined_at!=`number`||!Number.isInteger(a.quarantined_at)||a.verified_generation!==void 0&&a.verified_generation!==null&&typeof a.verified_generation!=`string`)throw Error(`OpenClaw quarantine store ${n} contains an invalid row.`);if(typeof a.verified_generation==`string`){let e;try{e=lt(a.verified_generation)}catch{throw Error(`OpenClaw quarantine store ${n} contains an invalid row.`)}try{let n=ct(O.resolve(t));if(!et(e,n))return}catch{return}}return{kind:a.kind,quarantinedAt:a.quarantined_at,reason:a.reason}}}function readOpenClawDatabaseQuarantineFailure(e,t,n={}){let r,i;try{r=readOpenClawDatabaseQuarantine(t,n)}catch(e){if(!(e instanceof _t))return;if(!e.quarantine)throw e;r=e.quarantine,i=e}if(!r)return;let a=createOpenClawDatabaseVerificationError(e,t,r.reason);return i&&(a.cause=i),a}function recordOpenClawDatabaseQuarantine(e){let t=e.generation?$e(e.generation):null;try{return withQuarantineWriter(e.env??process.env,n=>S(n,()=>(n.prepare(`
              INSERT INTO quarantined_databases (
                path, kind, reason, quarantined_at, writer_app_version, verified_generation
              ) VALUES (?, ?, ?, ?, ?, ?)
              ON CONFLICT(path) DO UPDATE SET
                kind = excluded.kind,
                reason = excluded.reason,
                quarantined_at = excluded.quarantined_at,
                writer_app_version = excluded.writer_app_version,
                verified_generation = excluded.verified_generation
            `).run(O.resolve(e.path),e.kind,e.reason,Date.now(),p,t),e.kind===`agent`&&invalidateAgentIntegrityVerification(n,e.path),!0),{databaseLabel:d(e.env??process.env),operationLabel:`quarantine.record`}))}catch{return!1}}function clearOpenClawDatabaseQuarantine(e,t={}){let n=t.env??process.env;if(!E(d(n)))return!0;try{return withQuarantineWriter(n,t=>S(t,()=>(t.prepare(`DELETE FROM quarantined_databases WHERE path = ?`).run(O.resolve(e)),invalidateAgentIntegrityVerification(t,e),!0),{databaseLabel:d(n),operationLabel:`quarantine.clear`}))}catch{return!1}}var G,Sr,Cr,wr,Tr=e((()=>{s(),Ct(),b(),Le(),st(),x(),ve(),xr(),vt(),je(),de(),G=2,Sr=5e3,Cr=448,wr=384}));function createStateDatabaseRetainer(e,t){let admit=(e,n)=>{let r=h();return n===`cached-read`?r?.assertReadAdmission():r?.assertAdmission(),t.assertOpen(e,n),r},retain=(n,r,i=!1)=>{if(t.capture(n.path).assertCurrent(),e.cachedDatabases.get(n.path)!==n||!n.db.isOpen)throw Error(`OpenClaw state database borrow requires its current canonical handle`);let a=e.borrowers.get(n.db)??{references:/* @__PURE__ */ new Set,retiring:!1,cleanupComplete:!1};if(a.retiring)throw Error(`OpenClaw state database native owner is retiring`);i||De(n.db),e.borrowers.set(n.db,a);let isCurrent=()=>!r||Ee(n.db,r),o=retainStateDatabaseReference({owner:a,retirement:i?void 0:{ordinary:r===void 0,isCurrent,retire:()=>{if(!isCurrent()){a.retiring=!1;return}t.retire(n,r===void 0)}},stopBeforeRetirement:()=>n.walMaintenance.stop(),retainFailedClose:()=>t.retainFailed(n),ownRetirement:e=>t.ownRetirement(n,e),onIdle:()=>t.touch(n)});return r?.own(o,`shared-references`,()=>o.releaseAsync()),o},findReadDatabase=(t,n)=>{let r=admit(t,n),i=e.cachedDatabases.get(O.resolve(t));return{database:i?.db.isOpen?i:void 0,scope:r}},retainReadReference=(t,n)=>{let r=retain(t,n,!0),assertCurrent=()=>{if(e.cachedDatabases.get(t.path)!==t||!t.db.isOpen)throw Error(`Shared-state read lost its original native owner`)};return{assertCurrent,observe(){assertCurrent(),De(t.db)},release:()=>r.release()}};return{retain:e=>retain(e,admit(e.path)),retainForIndependentRead(e,t){let{database:n,scope:r}=findReadDatabase(e,t);return n?retainReadReference(n,r):void 0},borrowForRead(e,t){let{database:n,scope:r}=findReadDatabase(e,t);if(n){if(n.db.isTransaction)throw Error(`Asynchronous shared-state reads cannot run inside a native transaction`);return{database:n,...retainReadReference(n,r)}}}}}function assertStateDatabaseBorrowersReleased(e,t){if(e?.references.size)throw Error(`OpenClaw state database still has active native borrowers: ${t}`)}function retainStateDatabaseReference(e){let{owner:t}=e,n={};t.references.add(n);let r=!1,release=()=>{if(r||t.cleanupComplete){r=!0;return}if(r=!0,t.references.delete(n),t.retirement&&!t.retirement.isCurrent()&&(t.retirement=void 0,t.asyncRetirement=void 0,t.retiring=!1),e.retirement?.isCurrent()&&!t.retirement?.ordinary&&(t.retirement=e.retirement),!(t.references.size>0)){if(!t.retirement){e.onIdle();return}if(t.retiring=!0,t.asyncRetirement){t.asyncRetirement.start();return}try{t.retirement.retire()}catch(t){throw r=!1,e.retainFailedClose(),t}t.retirement=void 0,e.onIdle()}};return{release,async releaseAsync(){t.cleanupComplete||((e.retirement?.isCurrent()&&!t.retirement?.ordinary?e.retirement:t.retirement)?.isCurrent()&&(t.asyncRetirement??=createAsyncStateDatabaseRetirement(e)),release(),await t.asyncRetirement?.close())}}}function createAsyncStateDatabaseRetirement(e){let{owner:t}=e,n={},r,i,finish=r=>{t.references.delete(n),r?.isCurrent()?r.retire():t.retiring=!1,t.retirement=void 0,t.asyncRetirement=void 0,i?.(),i=void 0,e.onIdle()},run=()=>r||(t.cleanupComplete||t.references.size>+!!t.references.has(n)?Promise.resolve():t.retirement?.isCurrent()?(t.retiring=!0,t.references.add(n),i??=e.ownRetirement(close),r=Promise.resolve().then(async()=>{await e.stopBeforeRetirement(),finish(t.retirement)}).catch(r=>{throw t.references.add(n),e.retainFailedClose(),r}),r.catch(()=>{}),r):(finish(),Promise.resolve()));function close(){let e=run();return e.catch(t=>{throw r===e&&(r=void 0),t})}return{start:()=>void run(),close}}var Er=e((()=>{m()})),Dr,Or=e((()=>{Dr=18e5}));function createStateDatabaseIdleRetirement({cachedDatabases:e,retainedDatabaseHandles:t,idleTimers:n,idleReferences:r,borrowers:i},a){let touch=o=>{if(!(e.get(o.path)===o&&o.db.isOpen)&&t.get(o.db)!==o)return;let s=n.get(o.db);if(s){s.refresh();return}let c=ft(()=>setTimeout(()=>{n.delete(o.db);try{o.db.isOpen&&o.db.isTransaction?touch(o):!i.get(o.db)?.references.size&&!r.get(o.db)?.size&&a(o,!1,{busyTimeoutMs:0,checkpointMode:`PASSIVE`})}catch(e){kr.warn(`Idle shared-state database cleanup failed`,{path:o.path,error:e}),touch(o)}},Dr));c.unref(),n.set(o.db,c)};return{touch,retain(t){if(e.get(t.path)!==t||!t.db.isOpen||i.get(t.db)?.retiring)throw Error(`OpenClaw state database idle retention requires its current canonical handle`);let n=r.get(t.db)??/* @__PURE__ */ new Set,a={};return n.add(a),r.set(t.db,n),()=>{n.delete(a)&&e.get(t.path)===t&&t.db.isOpen&&touch(t)}}}}var kr,Ar=e((()=>{Or(),mt(),ie(),kr=ae(`state/db`)}));function captureOpenClawStateReadContextWithAdmission(e,t){let n=Gt(e),r=t(e),i=r.assertCurrent,a=r,runInCapturedSchemaScope;if(n){let e=Yt.snapshot();a={databasePath:r.databasePath,coordinationKey:r.coordinationKey,get identity(){return r.identity},assertCurrent(){r.assertCurrent(),n.assertCurrent()}},runInCapturedSchemaScope=t=>e(()=>(a.assertCurrent(),t()))}return{maintenanceScope:h(),admission:a,assertPublicationCurrent:i,existingSchemaPath:n?.path,runInCapturedSchemaScope}}function captureOpenClawStateReadWorkerContextWithAdmission(e,t){let n=e.env??process.env,r=process.platform===`win32`?be(n):n,i={OPENCLAW_STATE_DIR:ne(r),...Ut(r)?{OPENCLAW_SUPERVISOR_MODE:`external`}:{}};return{...captureOpenClawStateReadContextWithAdmission(e.path??ue(i),t),environment:i}}function captureOpenClawStateWorkerContextWithAdmission(e,t){let n=captureOpenClawStateReadWorkerContextWithAdmission(e,t);return{...n,initializationEnvironment:ce([e.env??process.env,{OPENCLAW_STATE_DIR:void 0,OPENCLAW_SUPERVISOR_MODE:void 0},n.environment]),...e.initializationAgentPaths?{initializationAgentPaths:e.initializationAgentPaths.map(e=>O.resolve(e))}:{}}}var jr=e((()=>{ye(),re(),Ht(),le(),m(),Wt(),de()}));function createStateDatabaseWalOwner({cachedDatabases:e,retainedDatabaseHandles:t,databaseIdentities:n,asyncResources:r},i,a){return{ownRetirement(e,t){let n=a(e),i={async close(e){(!e||e.key===n.key)&&await t()}},o=r.register(i);return Oe(e.db)?.own(i,`shared-references`,()=>i.close()),o},async stop(r,i){let a=/* @__PURE__ */ new Set([...t.values(),...e.values()]);await Promise.all([...a].filter(e=>r===void 0||e.path===r||i!==void 0&&n.get(e.db)?.key===i.key).flatMap(({walMaintenance:e})=>e?[e.stop()]:[]))},register(t,n,a,o){if(!Zt)return;let s=captureOpenClawStateWorkerContextWithAdmission({path:t.path,env:o},()=>a),c=new AbortController,l,cancel=()=>{if(c.abort(),!l){u();return}return l.then(()=>void 0,()=>void 0)},u=r.register({async close(e){e&&e.key!==n.key||(cancel(),await t.walMaintenance.stop(),u())}}),run=async r=>{let a=Oe(t.db),o={...s,maintenanceScope:a},assertCurrent=()=>{if(c.signal.throwIfAborted(),o.admission.assertCurrent(),a?.assertAdmission(),Oe(t.db)!==a||e.get(t.path)!==t||!t.db.isOpen)throw new Ae(`Shared-state WAL maintenance owner changed`);Ce(t.path,n.key,n.birthtime)},l,u=!1;try{assertCurrent(),l=i(t);let{runOpenClawStateWorkerOperation:e}=await import(`./worker-chunk-DZ2vpI_O.mjs`);assertCurrent();let a=await e(o,e=>e.execute({type:`database.walMaintenance`,input:r},{signal:c.signal}),{existingOnly:!0,assertCurrent,createAdmission:()=>({nativeLocations:[t.path,n.canonicalPath],admission:Vt((e,t)=>{if(assertCurrent(),!t())throw new Ae(`Shared-state WAL maintenance authority expired`);u=!0})})});return assertCurrent(),a}catch(e){if(!u&&(Te(e)||c.signal.aborted&&ee(e)))return;throw e}finally{l?.()}};dt(t.db,e=>{if(c.signal.aborted)return Promise.resolve(void 0);let t=run(e);return l=t,t.finally(()=>{l===t&&(l=void 0),c.signal.aborted&&u()})},cancel)},readHealth(){let t=e.get(O.resolve(ue()));return t?.db.isOpen?t.walMaintenance.health:void 0}}}var Mr=e((()=>{te(),ht(),xe(),Bt(),m(),de(),jr()}));function openTrackedStateDatabase(e,t){let n=openTrackedStateDatabaseResult(e,t);if(n.status===`unavailable`)throw n.error;return n.database}function openTrackedStateDatabaseResult(e,t){Pe(e);try{t?.expectedIdentity!==void 0&&Ce(e,t.expectedIdentity);let n=t?.existingOnly||t?.expectedIdentity!==void 0?qe(e):e,r=t?.readOnly?{readOnly:!0,timeout:t.timeout}:{enableForeignKeyConstraints:t?.enableForeignKeyConstraints},i=Ze(()=>y(n,r));try{Pe(e)}catch(e){throw i.close(),e}return{status:`available`,database:i}}catch(e){return{status:`unavailable`,error:e}}}function closeTrackedStateDatabase(e){e.isOpen&&e.close()}var Nr=e((()=>{Fe(),b(),Qe(),xe()}));function createOpenClawStateDatabaseRuntimeFailureOwner(e){return{closeTerminalFailure(t,n){xt(n,t),e.invalidate(t);let r=e.cachedDatabases.get(t),i=[];try{r&&e.evict(r)}catch(e){i.push(e)}try{e.notifyTerminalFailure(t,n)}catch(e){i.push(e)}f(i,`Terminal shared-state failure cleanup failed`)},get:t=>{let n=O.resolve(t),r=e.latch.get(n);if(r)return r;let i=e.cachedDatabases.get(n);if(i?.db.isOpen)try{Ge(i.db,()=>{let e=He(i.db);(!e||e!==i.schemaFacts)&&(kt(i.db,n),i.schemaFacts=e)});return}catch(t){let r=t instanceof Error?t:Error(String(t));if(Xe(r)){e.evict(i);return}return wt(r)&&e.recordSchemaFailure(n,r),r}}}}var Pr=e((()=>{Qe(),he(),We(),Tt(),yt(),jt()}));function createOpenClawStateSnapshotOwnerRegistry(){let e=/* @__PURE__ */ new WeakMap;return{register(t,n){e.set(t.db,it({database:t.db,databasePath:t.path,owner:`openclaw-state`,assertCurrent:()=>{if(n()!==t||!t.db.isOpen)throw Error(`OpenClaw state snapshot owner is no longer current`)}}))},release(t){e.get(t)?.(),e.delete(t)}}}var Fr,Ir=e((()=>{at(),c(),Fr=l(Symbol.for(`openclaw.stateSnapshotOwners`),createOpenClawStateSnapshotOwnerRegistry)}));function notifyOpenClawStateDatabaseLifecycle(e){let t=e.kind===`open-error`?{...e,identity:e.identity??Q.knownIdentity(e.path)}:e;for(let e of zr)e(t)}function notifyOpenClawStateDatabaseClosed(e){notifyOpenClawStateDatabaseLifecycle({kind:`closed`,path:e.path,identity:requireOpenClawStateDatabaseIdentity(e)})}function requireOpenClawStateDatabaseIdentity(e){let t=Y.get(e.db);if(!t)throw Error(`Published shared-state owner has no recorded database identity`);return t}function registerOpenClawStateDatabaseLifecycleListener(e){zr.add(e);for(let t of q.values())t.db.isOpen&&e({kind:`opened`,database:t,identity:requireOpenClawStateDatabaseIdentity(t)});return()=>zr.delete(e)}function retainStateDatabaseClose(e){J.set(e.db,e),K.unregisterRetainedExitClose??=pt(closeOpenClawStateDatabase)}function ownMaintenanceStateDatabaseHandle(e){h()?.own(e.db,`shared-handles`,async()=>{let t=h();t&&Ee(e.db,t)&&(q.get(e.path)===e||J.get(e.db)===e)&&(await e.walMaintenance?.stop(),Ee(e.db,t)&&(q.get(e.path)===e||J.get(e.db)===e)&&retireOpenClawStateDatabaseHandle(e,!1))})}function closeUnpublishedOpenClawStateDatabaseHandle(e){let t=closeOpenClawStateDatabaseHandle(e);return J.get(e.db)===e&&ownMaintenanceStateDatabaseHandle(e),t}function closeOpenClawStateDatabaseHandle(e,t){clearTimeout(Lr.get(e.db)),Lr.delete(e.db);try{assertStateDatabaseBorrowersReleased(X.get(e.db),e.path)}catch(n){let r=X.get(e.db);return r&&(r.retiring=!0,r.retirement={ordinary:!0,isCurrent:()=>!0,retire:()=>{f(closeOpenClawStateDatabaseHandle(e,t),`OpenClaw state database cleanup failed for ${e.path}.`),r.cleanupComplete=!0,X.delete(e.db)}}),retainStateDatabaseClose(e),[n]}Rr.delete(e.db);let n=[];Fr.release(e.db);try{ut(e.db),e.walMaintenance?.close(t)}catch(e){n.push(e)}try{Be(e.db)}catch(e){n.push(e)}try{closeTrackedStateDatabase(e.db)}catch(e){n.push(e)}let r=!1;if(!e.db.isOpen)try{e.afterClose?.()}catch(e){n.push(e),r=!0}return e.db.isOpen||r?retainStateDatabaseClose(e):J.delete(e.db),q.get(e.path)?.db===e.db&&q.delete(e.path),J.size===0&&(K.unregisterRetainedExitClose?.(),K.unregisterRetainedExitClose=void 0),n}function evictCachedOpenClawStateDatabase(e){return q.get(e.path)===e&&(Q.invalidate(e.path),q.delete(e.path),notifyOpenClawStateDatabaseClosed(e),closeOpenClawStateDatabaseHandle(e,{checkpointMode:`PASSIVE`}),!0)}function evictOpenClawStateDatabaseAfterCorruption(e,t){return Xe(t)&&evictCachedOpenClawStateDatabase(e)}function publishOpenClawStateDatabase(e,t){let{db:n,path:r}=e;Ke(n);let i=Ge(n,()=>(kt(n,r),He(n))),{identity:a,admission:o}=Q.publish(r);return Y.set(n,a),q.set(r,Object.assign(e,{schemaFacts:i})),Vr(e,a,o,t),$(e),Fr.register(e,()=>q.get(r)),ownMaintenanceStateDatabaseHandle(e),notifyOpenClawStateDatabaseLifecycle({kind:`opened`,database:e,identity:a}),Ve(n,t=>{!n.isTransaction&&Xe(t)&&evictCachedOpenClawStateDatabase(e)}),Z.clear(r),e}function getCachedOpenClawStateDatabase(e,t){let n=h();t?.readOnly?n?.assertReadAdmission():n?.assertAdmission(),Kt(e,K);let r=Gr.get(e);if(r)throw r;let i=q.get(O.resolve(e));if(i&&X.get(i.db)?.retiring)throw Error(`OpenClaw state database native borrower cleanup is pending: ${e}`);return i&&$(i),i}function getOpenClawStateDatabaseIfOpenAtPath(e){let t=getCachedOpenClawStateDatabase(e);return De(t?.db.isOpen?t.db:void 0),t?.db.isOpen?t:void 0}function closeStaleCachedOpenClawStateDatabase(e){if(q.get(e.path)!==e)return;Q.invalidate(e.path);let t=closeOpenClawStateDatabaseHandle(e);notifyOpenClawStateDatabaseClosed(e),f(t,`Stale OpenClaw state database cleanup failed for ${e.path}.`)}function recordOpenClawStateDatabaseOpenFailure(e,t,n){return Z.record(e,t,n)}function clearOpenClawStateDatabaseOpenFailure(e){let t=O.resolve(e);Z.clear(t),Q.invalidate(t),notifyOpenClawStateDatabaseLifecycle({kind:`failure-cleared`,path:t,identity:Q.knownIdentity(t)})}async function getOpenClawStateDatabaseTerminalFailureAsync(e,t){e.admission.assertCurrent();let n=await Z.getAsync(e.admission.databasePath,async(n,r)=>{let{inspectOpenClawStateDatabaseGeneration:i}=await import(`./worker-chunk-DZ2vpI_O.mjs`),a=await i(e,r,t);if(a===void 0)throw Error(`Recorded shared-state database generation is unavailable`);return a});return e.admission.assertCurrent(),n}function assertOpenClawStateDatabaseOpenAllowed(e,t){t===`cached-read`?Ne(e):Pe(e);let{identity:n}=Q.capture(e),r=Z.get(e);if(r)throw r;let i=O.resolve(e);for(let t of J.values())if(X.get(t.db)?.retiring&&(t.path===i||Y.get(t.db)?.key===n.key))throw Error(`OpenClaw state database native borrower cleanup is pending: ${e}`)}function recordOpenClawStateDatabaseLifecycleOpenError(e,t){notifyOpenClawStateDatabaseLifecycle({kind:`open-error`,path:O.resolve(e),error:t})}function assertOpenClawStateDatabaseFreshOpenAllowedAtPath(e,t,n){assertOpenClawStateDatabaseOpenAllowed(e);let r;try{r=readOpenClawDatabaseQuarantineFailure(`state`,e,{env:t})}catch(e){if(!(e instanceof _t))throw e;n?.(e);return}if(r?.cause instanceof _t&&n?.(r.cause),r)throw Gr.closeTerminalFailure(e,r),r}function retireOpenClawStateDatabaseHandle(e,t=!0,n){assertStateDatabaseBorrowersReleased(X.get(e.db),e.path);let r=X.get(e.db);try{let r=q.get(e.path)?.db===e.db;t&&Q.invalidate(e.path);let i=closeOpenClawStateDatabaseHandle(e,n);if(r&&t)try{notifyOpenClawStateDatabaseClosed(e)}catch(e){i.push(e)}f(i,`OpenClaw state database cleanup failed for ${e.path}.`)}catch(t){throw r&&retainStateDatabaseClose(e),t}r&&(r.cleanupComplete=!0,X.delete(e.db))}function retireOpenClawStateDatabaseHandles(e,t,n){let r=/* @__PURE__ */ new Set([...J.values(),...q.values()]),i=[],a=!1;for(let o of r)if(e===void 0||o.path===e||n!==void 0&&Y.get(o.db)?.key===n.key){a=!0;try{retireOpenClawStateDatabaseHandle(o,!0,t)}catch(e){i.push(e)}}return f(i,`OpenClaw state database cleanup failed.`),a}function closeOpenClawStateDatabaseByPath(e,t){return retireOpenClawStateDatabaseHandles(O.resolve(e),t,Q.identity(e))}function closeOpenClawStateDatabase(e){retireOpenClawStateDatabaseHandles(void 0,e)}function registerOpenClawStateDatabaseAsyncResource(e){return Q.register(e)}function publishOpenClawStateDatabaseWorkerAdmission(e){Q.publish(e.databasePath),e.assertCurrent()}function closeOpenClawStateDatabaseByPathAsync(e,t){let n=O.resolve(e);return Q.close(n,async e=>(await Wr(n,e),retireOpenClawStateDatabaseHandles(n,t,e)))}async function closeOpenClawStateDatabaseAsync(e){await Q.close(void 0,async()=>(await Wr(),retireOpenClawStateDatabaseHandles(void 0,e)))}function isOpenClawStateDatabaseOpen(e){return e===void 0?Array.from(q.values()).some(e=>e.db.isOpen):q.get(O.resolve(e))?.db.isOpen===!0}function closeOpenClawStateDatabaseForTest(){closeOpenClawStateDatabase(),Z.clearAll()}async function prepareOpenClawStateDatabaseRemoval(e,t){let n=O.resolve(e),r=h();if(!r?.ownsSchemaMaintenance)throw Error(`State removal requires the installation's maintenance owner`);r.assertAdmission();let i=Q.holdExclusion(n);try{await closeOpenClawStateDatabaseByPathAsync(n),r.assertOwnerCurrent(),retainSqliteDatabaseRemovalExclusion(n,r),r.assertOwnerCurrent()}catch(e){throw i(),e}let a=!0;return{assertCurrent(){if(!a)throw Error(`State removal admission has been released`);t()},release(){a&&(a=!1,i())}}}function retainSqliteDatabaseRemovalExclusion(e,t){if(!E(e))return;let n=y(qe(e)),close=()=>{if(!n.isOpen)return;let e=[];try{n.isTransaction&&n.exec(`ROLLBACK`)}catch(t){e.push(t)}try{n.close()}catch(t){e.push(t)}f(e,`SQLite state removal exclusion cleanup failed.`)};try{t.own(n,`shared-handles`,close),n.exec(`PRAGMA busy_timeout = 0; PRAGMA locking_mode = EXCLUSIVE; BEGIN EXCLUSIVE;`)}catch(e){try{close()}catch(t){throw me([e,t],`SQLite state removal admission and cleanup both failed.`,e)}if(Je(e))throw Error(`Cannot remove OpenClaw state directory while another SQLite connection is active`,{cause:e});let t=Ye(e);if(t!==11&&t!==26)throw e;return}process.platform===`win32`&&close()}async function confirmOpenClawStateDatabaseIntegrity(e){let t=O.resolve(e);return await closeOpenClawStateDatabaseByPathAsync(t),nt(t,t)}var K,q,J,Lr,Rr,Y,X,zr,Z,Q,$,Br,Vr,Hr,Ur,Wr,Gr,Kr,qr,Jr,Yr,Xr,Zr=e((()=>{Fe(),Re(),b(),Qe(),rt(),he(),We(),Qt(),ht(),mt(),c(),vt(),Tr(),m(),Er(),Ar(),Mr(),Nr(),Pr(),Wt(),jt(),Ir(),K=l(Symbol.for(`openclaw.stateDatabaseLifecycle`),()=>({cachedDatabases:/* @__PURE__ */ new Map,retainedDatabaseHandles:/* @__PURE__ */ new Map,idleTimers:/* @__PURE__ */ new WeakMap,idleReferences:/* @__PURE__ */ new WeakMap,unregisterRetainedExitClose:void 0,databaseIdentities:/* @__PURE__ */ new WeakMap,borrowers:/* @__PURE__ */ new WeakMap,databaseLifecycleListeners:/* @__PURE__ */ new Set,terminalOpenLatch:createSqliteTerminalOpenLatch({closeByPath:(e,t)=>Gr.closeTerminalFailure(e,t)}),asyncResources:ke()}),()=>closeOpenClawStateDatabaseAsync()),{cachedDatabases:q,retainedDatabaseHandles:J,idleTimers:Lr,idleReferences:Rr,databaseIdentities:Y,borrowers:X,databaseLifecycleListeners:zr,terminalOpenLatch:Z,asyncResources:Q}=K,{touch:$,retain:Br}=createStateDatabaseIdleRetirement(K,retireOpenClawStateDatabaseHandle),{register:Vr,readHealth:Hr,ownRetirement:Ur,stop:Wr}=createStateDatabaseWalOwner(K,Br,requireOpenClawStateDatabaseIdentity),Gr=createOpenClawStateDatabaseRuntimeFailureOwner({cachedDatabases:q,latch:Z,evict:evictCachedOpenClawStateDatabase,invalidate:e=>Q.invalidate(e),notifyTerminalFailure:(e,t)=>notifyOpenClawStateDatabaseLifecycle({kind:`terminal-failure`,path:e,error:t,identity:Q.knownIdentity(e)}),recordSchemaFailure:(e,t)=>{Z.record(e,t),notifyOpenClawStateDatabaseLifecycle({kind:`open-error`,path:e,error:t})}}),{retain:Kr,borrowForRead:qr,retainForIndependentRead:Jr}=createStateDatabaseRetainer(K,{assertOpen(e,t){assertOpenClawStateDatabaseOpenAllowed(e,t),Kt(e,K)},capture:e=>Q.capture(e),retire:retireOpenClawStateDatabaseHandle,retainFailed:retainStateDatabaseClose,ownRetirement:Ur,touch:$}),Yr=Q.capture,Xr={assertOpenClawStateDatabaseFreshOpenAllowedAtPath,assertOpenClawStateDatabaseOpenAllowed,clearOpenClawStateDatabaseOpenFailure,closeOpenClawStateDatabase,closeOpenClawStateDatabaseByPath,closeOpenClawStateDatabaseForTest,closeOpenClawStateDatabaseHandle,closeUnpublishedOpenClawStateDatabaseHandle,closeStaleCachedOpenClawStateDatabase,evictCachedOpenClawStateDatabase,evictOpenClawStateDatabaseAfterCorruption,getCachedOpenClawStateDatabase,getOpenClawStateDatabaseRuntimeFailure:Gr.get,getOpenClawStateDatabaseRecordedFailure:Z.peek,getOpenClawStateDatabaseIfOpenAtPath,getKnownOpenClawStateDatabaseIdentity:Q.knownIdentity,isOpenClawStateDatabaseOpen,isOpenClawStateDatabaseSchemaReady:e=>q.get(e.path)===e&&e.db.isOpen,publishOpenClawStateDatabase,recordOpenClawStateDatabaseOpenFailure,recordOpenClawStateDatabaseLifecycleOpenError,touchStateDatabase:$}}));export{setOpenClawAgentDatabaseValidation as $,On as $t,jr as A,er as At,recordOpenClawAgentIntegrityVerification as B,ensureSessionPendingInputsSchema as Bt,closeTrackedStateDatabase as C,lr as Ct,captureOpenClawStateReadContextWithAdmission as D,ensureSessionTranscriptArchiveSchema as Dt,openTrackedStateDatabaseResult as E,nr as Et,clearOpenClawDatabaseQuarantine as F,Zn as Ft,getOpenClawAgentDatabaseValidation as G,zn as Gt,adoptOpenClawAgentDatabaseValidation as H,hasSessionPendingInputsSchema as Ht,Tr as I,Bn as It,hasRevokedOpenClawAgentDatabaseValidation as J,In as Jt,getOpenClawAgentDatabaseValidationForTransfer as K,Pn as Kt,markOpenClawAgentIntegrityClean as L,z as Lt,Or as M,tr as Mt,canReuseOpenClawAgentIntegrityVerification as N,Yn as Nt,captureOpenClawStateReadWorkerContextWithAdmission as O,ir as Ot,clearOpenClawAgentIntegrityVerification as P,ensureOpenClawAgentBoardSchemaInTransaction as Pt,markOpenClawAgentCanonicalValidation as Q,ensureContextEngineTurnOutboxSchema as Qt,readOpenClawAgentIntegrityVerification as R,ensurePendingInputConsumptionColumn as Rt,Jr as S,recordOpenClawAgentDatabaseReadOpenFailure as St,openTrackedStateDatabase as T,cr as Tt,captureOpenClawAgentDatabaseValidationTransfer as U,Gn as Ut,recordOpenClawDatabaseQuarantine as V,hasPendingInputConsumptionColumnMigration as Vt,clearOpenClawAgentDatabaseValidationCache as W,ensureMessageToolRunOutcomeSchema as Wt,invalidateOpenClawAgentDatabaseValidation as X,kn as Xt,xr as Y,An as Yt,invalidateOpenClawAgentDatabaseValidationsForAgent as Z,Nn as Zt,recordOpenClawStateDatabaseOpenFailure as _,createSqliteTerminalOpenLatch as _n,mr as _t,closeOpenClawStateDatabaseAsync as a,Cn as an,registerOpenClawAgentDatabaseReadCandidateResource as at,requireOpenClawStateDatabaseIdentity as b,fr as bt,closeOpenClawStateDatabaseForTest as c,migrateMemoryIndexStorage as cn,assertOpenClawAgentDatabaseIdentity as ct,Zr as d,j as dn,gr as dt,Dn as en,captureAgentDatabaseCloseFence as et,isOpenClawStateDatabaseOpen as f,ensureMemoryChunkProvenance as fn,isOpenClawAgentDatabasePathCurrent as ft,Hr as g,migrateSqliteSchemaToStrictInTransaction as gn,canonicalSessionValidationSchemaSql as gt,publishOpenClawStateDatabaseWorkerAdmission as h,migrateSqliteSchemaToStrict as hn,assertCanonicalSessionValidationSchema as ht,closeOpenClawStateDatabase as i,wn as in,registerOpenClawAgentDatabaseAsyncResource as it,Dr as j,ensureOpenClawAgentProgressCardSchemaInTransaction as jt,captureOpenClawStateWorkerContextWithAdmission as k,$n as kt,confirmOpenClawStateDatabaseIntegrity as l,ensureMemoryRecallMetadataSchema as ln,createOpenClawAgentDatabaseClaim as lt,prepareOpenClawStateDatabaseRemoval as m,nn as mn,registerOpenClawAgentDatabaseIdentity as mt,Yr as n,R as nn,yr as nt,closeOpenClawStateDatabaseByPath as o,migrateMemoryIndexSourcesIdentity as on,registerOpenClawAgentDatabaseSyncResource as ot,Xr as p,sn as pn,readOpenClawAgentDatabaseIdentity as pt,hasOpenClawAgentCanonicalValidation as q,ensureSessionGoalOperationsSchema as qt,clearOpenClawStateDatabaseOpenFailure as r,createSqliteSchemaEnsurer as rn,matchesAgentDatabaseClose as rt,closeOpenClawStateDatabaseByPathAsync as s,yn as sn,revokeAgentDatabaseResources as st,qr as t,L as tn,drainAgentDatabaseResources as tt,getOpenClawStateDatabaseTerminalFailureAsync as u,hasLegacyMemoryRecallMetadataColumns as un,findOpenClawAgentDatabaseIdentity as ut,registerOpenClawStateDatabaseAsyncResource as v,Qt as vn,withoutCanonicalSessionValidationSchema as vt,Nr as w,ur as wt,Br as x,isOpenClawAgentDatabaseReadOpenFailure as xt,registerOpenClawStateDatabaseLifecycleListener as y,classifyOpenClawAgentDatabaseReadError as yt,readOpenClawDatabaseQuarantineFailure as z,ensureSessionInputCompletionsSchema as zt};