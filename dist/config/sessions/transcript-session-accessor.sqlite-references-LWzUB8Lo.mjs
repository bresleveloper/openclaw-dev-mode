import{s as e}from"./transcript-string-readers-D1-IC7yv.mjs";import{n as t}from"./transcript-sql-connection-DLZo1Z6N.mjs";import{m as n,o as r,u as i}from"./transcript-kysely-sync-BLR5Zy5p.mjs";import{t as a}from"./transcript-session-accessor.sqlite-scope-helpers-D6DPbKDy.mjs";import{t as o}from"./transcript-session-accessor.sqlite-status-CqF81Ak0.mjs";import{i as s}from"./transcript-store-maintenance-IZo5IfXv.mjs";import{t as c}from"./transcript-legacy-compaction-history-Dmv_9QLR.mjs";import{toUSVString as l}from"node:util";function sessionReferenceProjection(e){return n`CASE WHEN has_optional_references = 0
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
    ) END END`.as(`reference_json`)}const u=n`CASE WHEN reference_json = '{}' THEN reference_json
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
    THEN reference_json END`.as(`references`),d=n`json_tree("references")`.as(`reference`),f=n`reference.type = 'text' AND (
    reference.fullkey IN ('$.sessionId', '$.previousSessionId')
    OR reference.fullkey GLOB '$.usageFamilySessionIds[[]*[]]'
    OR reference.fullkey GLOB '$.compactionCheckpoints[[]*[]].sessionId'
    OR reference.fullkey GLOB '$.compactionCheckpoints[[]*[]].preCompaction.sessionId'
    OR reference.fullkey GLOB '$.compactionCheckpoints[[]*[]].postCompaction.sessionId'
  )`;function collectSessionStateIdsForEntry(t){let n=[],add=e=>{let t=e?.trim();t&&n.push(t)};add(t.sessionId),add(t.previousSessionId);for(let e of t.usageFamilySessionIds??[])add(e);for(let e of c(t))add(e.sessionId),add(e.preCompaction.sessionId),add(e.postCompaction.sessionId);return e(n)}function addRetainedWindowSessionReferences(e,t,n,c,l){let u=a(e.db).selectFrom(`session_windows`).innerJoin(`session_nodes`,`session_nodes.session_key`,`session_windows.session_key`).select([`session_windows.session_id`,`session_nodes.session_key`,`session_nodes.current_session_id`,`session_nodes.updated_at`,`session_nodes.pinned_at`]).$if(l!==void 0,e=>e.select(`session_nodes.entry_json`)).where(e=>e.or([e(`session_nodes.archived_at`,`is not`,null),e(`session_nodes.pinned_at`,`is not`,null)]));c&&(u=u.where(`session_windows.session_id`,`in`,i(c)));for(let i of r(e.db,u))n.has(i.session_key)||l&&i.pinned_at===null&&i.entry_json!==void 0&&s({key:i.session_key,entry:o({...i,entry_json:i.entry_json})??void 0,preserveRecentMs:l.preserveRecentMs})||t.add(i.session_id)}function*readSessionNodeReferences(e,s,c,p=!1){let m=a(e.db),h=t(e.db),g=[...s].filter(e=>l(e)===e&&!e.includes(`\0`)&&!/[\uFFFE\uFFFF]/u.test(e)),_=m.selectFrom(`session_nodes`).select([`current_session_id`,`session_key`]).$if(p,e=>e.select(`updated_at`)).$if(p&&h,e=>e.orderBy(`session_key`,`asc`)).$if(g.length>0,e=>e.where(`session_key`,`not in`,i(g)));c?.length&&c.length<=16&&c.every(e=>l(e)===e&&!/[\0\uFFFD-\uFFFF]/u.test(e))&&(_=_.where(e=>e.or([e.or(c.map(e=>h?n`strpos(current_session_id, ${e}) > 0`:n`instr(current_session_id, ${e}) > 0`)),e(`has_optional_references`,`=`,1)])));let v=m.with(e=>e(`projected_nodes`).materialized(),()=>_.select(e=>sessionReferenceProjection(p?e.ref(`updated_at`):void 0))).with(e=>e(`reference_nodes`).materialized(),e=>e.selectFrom(`projected_nodes`).selectAll().select(u)).selectFrom(`reference_nodes`).leftJoin(d,e=>e.on(f)).select([`current_session_id`,`session_key`,`reference.atom`,`reference.fullkey`]).$if(p,e=>e.select(`updated_at`)).select(n`CASE WHEN "references" IS NULL THEN (SELECT entry_json FROM session_nodes WHERE session_nodes.session_key = reference_nodes.session_key) END`.as(`entry_json`)).$if(p,e=>e.orderBy(`session_key`,`asc`)),y=r(e.db,h?_.select(e=>[`entry_json`,e.val(null).as(`atom`),e.val(null).as(`fullkey`)]):v);for(let e of y)if(!s.has(e.session_key)){if(yield{sessionKey:e.session_key,sessionId:e.current_session_id},e.entry_json!==null){let t=o({...e,entry_json:e.entry_json});if(t)for(let n of collectSessionStateIdsForEntry(t))yield{sessionKey:e.session_key,sessionId:n}}else if(e.atom!==null&&e.fullkey!==null&&/^\$\.(sessionId|previousSessionId|usageFamilySessionIds\[\d+\]|compactionCheckpoints\[\d+\]\.(sessionId|(?:preCompaction|postCompaction)\.sessionId))$/u.test(e.fullkey)){let t=e.atom.trim();t&&(yield{sessionKey:e.session_key,sessionId:t})}}}function readReferencedSessionIds(e,t=/* @__PURE__ */ new Set,n,r){if(n?.length===0)return/* @__PURE__ */ new Set;let i=/* @__PURE__ */ new Set,a=n?new Set(n):void 0;for(let{sessionId:r}of readSessionNodeReferences(e,t,n))(!a||a.has(r))&&i.add(r);return addRetainedWindowSessionReferences(e,i,t,n,r),n?new Set(n.filter(e=>i.has(e))):i}export{readReferencedSessionIds as n,collectSessionStateIdsForEntry as t};