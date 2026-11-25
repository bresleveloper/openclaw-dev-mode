import{a as asOptionalRecord}from"./record-coerce-BTbqdJ3-.mjs";import{b as uniqueStrings}from"./string-normalization-D_oBUpO3.mjs";import{n as isPostgresSqlConnection}from"./sql-connection-nx8lLUJM.mjs";import{_ as sql,c as iterateSqliteQuerySync,i as executeSqliteQuerySync,p as sqliteStringSet}from"./kysely-sync-Dl78faM1.mjs";import{t as getSessionKysely}from"./session-accessor.sqlite-scope-helpers-o2D3PVxc.mjs";import{n as parseSessionEntryJson}from"./session-accessor.sqlite-status-CSFHR74t.mjs";import{i as isSessionEntryDiskBudgetEvictable}from"./store-maintenance-CY-0xbtC.mjs";import{toUSVString}from"node:util";
//!src/config/sessions/legacy-compaction-history.ts
function readLegacyCompactionMetrics(e){try{return readLegacyCompactionHistory(e).flatMap(e=>{const t=e.postCompaction.entryId;return t?[{entryId:t,tokensBefore:e.tokensBefore,tokensAfter:e.tokensAfter}]:[]})}catch{return[]}}function readLegacyCompactionSnapshotPaths(e){return readLegacyCompactionHistory(e).flatMap(e=>[e.preCompaction.sessionFile?.trim(),e.postCompaction.sessionFile?.trim()].filter(e=>Boolean(e)))}function readLegacyCompactionHistory(e){const t=asOptionalRecord(e)?.compactionCheckpoints;if(t==null)return[];if(!Array.isArray(t))throw new TypeError(`Invalid legacy compaction history references`);return t.map(e=>{const t=asOptionalRecord(e);const n=asOptionalRecord(t?.preCompaction);const r=asOptionalRecord(t?.postCompaction);if(!t||!n||!r)throw new TypeError(`Invalid legacy compaction history references`);const string=e=>{if(e==null)return;if(typeof e!==`string`)throw new TypeError(`Invalid legacy compaction history reference`);return e};const number=e=>typeof e===`number`&&Number.isFinite(e)?e:void 0;return{sessionId:string(t.sessionId),preCompaction:{sessionId:string(n.sessionId),sessionFile:string(n.sessionFile)},postCompaction:{sessionId:string(r.sessionId),sessionFile:string(r.sessionFile),entryId:string(r.entryId)},tokensBefore:number(t.tokensBefore),tokensAfter:number(t.tokensAfter)}})}
//!src/config/sessions/session-accessor.sqlite-reference-projection.ts
function sessionReferenceProjection(e){return sql`CASE WHEN has_optional_references = 0
      AND current_session_id NOT GLOB '*[^A-Za-z0-9._:@-]*'
      AND length(CAST(current_session_id AS BLOB)) = length(CAST(printf('%s', current_session_id) AS BLOB))
      THEN '{}'
    WHEN json_valid(entry_json) THEN CASE WHEN (SELECT encoding FROM pragma_encoding) = 'UTF-8'
      AND length(CAST(entry_json AS BLOB)) = length(CAST(printf('%s', entry_json) AS BLOB))
      AND instr(entry_json, '\\u') = 0
      AND json_type(entry_json, '$.sessionId') = 'text'
      AND json_extract(entry_json, '$.sessionId') = current_session_id
      AND json_type(entry_json, '$.updatedAt') IN ('integer', 'real')
      AND json_extract(entry_json, '$.updatedAt') BETWEEN ${e??-Number.MAX_VALUE} AND ${e??Number.MAX_VALUE}
      AND NOT EXISTS (
        SELECT 1 FROM json_each(entry_json)
        WHERE key IN ('sessionId', 'updatedAt', 'previousSessionId', 'usageFamilySessionIds', 'compactionCheckpoints')
        GROUP BY key HAVING count(*) > 1
      )
    THEN json_object(
      'sessionId', json_extract(entry_json, '$.sessionId'),
      'previousSessionId', json_extract(entry_json, '$.previousSessionId'),
      'usageFamilySessionIds', json_extract(entry_json, '$.usageFamilySessionIds'),
      'compactionCheckpoints', json_extract(entry_json, '$.compactionCheckpoints')
    ) END END`.as(`reference_json`)}const usableSessionReferenceProjection=sql`CASE WHEN reference_json = '{}' THEN reference_json
    WHEN reference_json IS NOT NULL
    AND json_type(reference_json, '$.previousSessionId') IN ('text', 'null')
    AND json_type(reference_json, '$.usageFamilySessionIds') IN ('array', 'null')
    AND json_type(reference_json, '$.compactionCheckpoints') IN ('array', 'null')
    AND NOT EXISTS (
      SELECT 1 FROM json_each(reference_json, '$.usageFamilySessionIds')
      WHERE type NOT IN ('text', 'null')
    )
    AND NOT EXISTS (
      SELECT 1 FROM json_each(reference_json, '$.compactionCheckpoints')
      WHERE json_type(reference_json, '$.compactionCheckpoints') = 'array'
        AND CASE WHEN type = 'object' THEN
        json_type(value, '$.preCompaction') IS NOT 'object'
        OR json_type(value, '$.postCompaction') IS NOT 'object'
        OR coalesce(json_type(value, '$.sessionId'), 'null') NOT IN ('text', 'null')
        OR coalesce(json_type(value, '$.preCompaction.sessionId'), 'null') NOT IN ('text', 'null')
        OR coalesce(json_type(value, '$.postCompaction.sessionId'), 'null') NOT IN ('text', 'null')
        OR coalesce(json_type(value, '$.preCompaction.sessionFile'), 'null') NOT IN ('text', 'null')
        OR coalesce(json_type(value, '$.postCompaction.sessionFile'), 'null') NOT IN ('text', 'null')
        OR coalesce(json_type(value, '$.postCompaction.entryId'), 'null') NOT IN ('text', 'null')
        ELSE 1 END
    )
    AND NOT EXISTS (
      SELECT 1 FROM json_tree(reference_json)
      WHERE key IS NOT NULL GROUP BY parent, key HAVING count(*) > 1
    )
    THEN reference_json END`.as(`references`);const sessionReferenceAtoms=sql`json_tree("references")`.as(`reference`);const sessionReferenceAtomPath=sql`reference.type = 'text' AND (
    reference.fullkey IN ('$.sessionId', '$.previousSessionId')
    OR reference.fullkey GLOB '$.usageFamilySessionIds[[]*[]]'
    OR reference.fullkey GLOB '$.compactionCheckpoints[[]*[]].sessionId'
    OR reference.fullkey GLOB '$.compactionCheckpoints[[]*[]].preCompaction.sessionId'
    OR reference.fullkey GLOB '$.compactionCheckpoints[[]*[]].postCompaction.sessionId'
  )`;
//!src/config/sessions/session-accessor.sqlite-references.ts
function collectSessionStateIdsForEntry(e){const t=[];const add=e=>{const n=e?.trim();if(n)t.push(n)};add(e.sessionId);add(e.previousSessionId);for(const t of e.usageFamilySessionIds??[])add(t);for(const t of readLegacyCompactionHistory(e)){add(t.sessionId);add(t.preCompaction.sessionId);add(t.postCompaction.sessionId)}return uniqueStrings(t)}function addRetainedWindowSessionReferences(e,t,n,r,i){let a=getSessionKysely(e.db).selectFrom(`session_windows`).innerJoin(`session_nodes`,`session_nodes.session_key`,`session_windows.session_key`).select([`session_windows.session_id`,`session_nodes.session_key`,`session_nodes.current_session_id`,`session_nodes.updated_at`,`session_nodes.pinned_at`]).$if(i!==void 0,e=>e.select(`session_nodes.entry_json`)).where(e=>e.or([e(`session_nodes.archived_at`,`is not`,null),e(`session_nodes.pinned_at`,`is not`,null)]));if(r)a=a.where(`session_windows.session_id`,`in`,sqliteStringSet(r));for(const r of iterateSqliteQuerySync(e.db,a)){if(n.has(r.session_key))continue;if(i&&r.pinned_at===null&&r.entry_json!==void 0&&isSessionEntryDiskBudgetEvictable({key:r.session_key,entry:parseSessionEntryJson({...r,entry_json:r.entry_json})??void 0,preserveRecentMs:i.preserveRecentMs}))continue;t.add(r.session_id)}}function*readSessionNodeReferences(e,t,n,r=false){const i=getSessionKysely(e.db);const a=isPostgresSqlConnection(e.db);const o=[...t].filter(e=>toUSVString(e)===e&&!e.includes(`\0`)&&!/[\uFFFE\uFFFF]/u.test(e));let s=i.selectFrom(`session_nodes`).select([`current_session_id`,`session_key`]).$if(r,e=>e.select(`updated_at`)).$if(r&&a,e=>e.orderBy(`session_key`,`asc`)).$if(o.length>0,e=>e.where(`session_key`,`not in`,sqliteStringSet(o)));if(n?.length&&n.length<=16&&n.every(e=>toUSVString(e)===e&&!/[\0\uFFFD-\uFFFF]/u.test(e)))s=s.where(e=>e.or([e.or(n.map(e=>a?sql`strpos(current_session_id, ${e}) > 0`:sql`instr(current_session_id, ${e}) > 0`)),e(`has_optional_references`,`=`,1)]));const c=i.with(e=>e(`projected_nodes`).materialized(),()=>s.select(e=>sessionReferenceProjection(r?e.ref(`updated_at`):void 0))).with(e=>e(`reference_nodes`).materialized(),e=>e.selectFrom(`projected_nodes`).selectAll().select(usableSessionReferenceProjection)).selectFrom(`reference_nodes`).leftJoin(sessionReferenceAtoms,e=>e.on(sessionReferenceAtomPath)).select([`current_session_id`,`session_key`,`reference.atom`,`reference.fullkey`]).$if(r,e=>e.select(`updated_at`)).select(sql`CASE WHEN "references" IS NULL THEN (SELECT entry_json FROM session_nodes WHERE session_nodes.session_key = reference_nodes.session_key) END`.as(`entry_json`)).$if(r,e=>e.orderBy(`session_key`,`asc`));const l=iterateSqliteQuerySync(e.db,a?s.select(e=>[`entry_json`,e.val(null).as(`atom`),e.val(null).as(`fullkey`)]):c);for(const e of l){if(t.has(e.session_key))continue;yield{sessionKey:e.session_key,sessionId:e.current_session_id};if(e.entry_json!==null){const t=parseSessionEntryJson({...e,entry_json:e.entry_json});if(t)for(const n of collectSessionStateIdsForEntry(t))yield{sessionKey:e.session_key,sessionId:n}}else if(e.atom!==null&&e.fullkey!==null&&/^\$\.(sessionId|previousSessionId|usageFamilySessionIds\[\d+\]|compactionCheckpoints\[\d+\]\.(sessionId|(?:preCompaction|postCompaction)\.sessionId))$/u.test(e.fullkey)){const t=e.atom.trim();if(t)yield{sessionKey:e.session_key,sessionId:t}}}}function readSessionReferenceOwners(e,t,n){const r=new Set(n);const i=/* @__PURE__ */ new Map;if(r.size===0)return i;for(const{sessionKey:a,sessionId:o}of readSessionNodeReferences(e,t,n,true))if(r.delete(o)){i.set(o,a);if(r.size===0)break}return i}function readReferencedSessionIds(e,t=/* @__PURE__ */ new Set,n,r){if(n?.length===0)return/* @__PURE__ */ new Set;const i=/* @__PURE__ */ new Set;const a=n?new Set(n):void 0;for(const{sessionId:r}of readSessionNodeReferences(e,t,n))if(!a||a.has(r))i.add(r);addRetainedWindowSessionReferences(e,i,t,n,r);return n?new Set(n.filter(e=>i.has(e))):i}function readReferencedSessionIdsAfterTargetMutation(e,t,n){return readReferencedSessionIds(e,new Set(uniqueStrings([t.canonicalKey,...t.storeKeys].map(e=>e.trim()))),n)}function readSessionGenerationIdsForKeys(e,t,n={}){const r=[...t].map(e=>n.exactStoredKeys?e:e.trim());if(r.length===0)return[];const i=getSessionKysely(e.db);return executeSqliteQuerySync(e.db,i.selectFrom(`session_windows`).select(`session_id`).where(`session_key`,`in`,sqliteStringSet(r))).rows.map(e=>e.session_id)}function collectProjectedReferencedSessionIds(e){const t=new Set(e.excludedSessionKeys);const n=readReferencedSessionIds(e.database,t,e.candidateSessionIds);for(const t of Object.values(e.projectedStore))for(const e of collectSessionStateIdsForEntry(t))n.add(e);return n}export{readSessionGenerationIdsForKeys as a,readLegacyCompactionMetrics as c,readReferencedSessionIdsAfterTargetMutation as i,readLegacyCompactionSnapshotPaths as l,collectSessionStateIdsForEntry as n,readSessionReferenceOwners as o,readReferencedSessionIds as r,readLegacyCompactionHistory as s,collectProjectedReferencedSessionIds as t};