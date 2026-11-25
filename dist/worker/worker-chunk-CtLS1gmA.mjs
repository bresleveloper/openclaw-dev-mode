import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{a as t,l as n}from"./worker-chunk-EAEbv0hu.mjs";import{b as r,r as i}from"./worker-chunk-DjzV__aU.mjs";import{n as a,r as o}from"./worker-chunk-BELuyL3Z.mjs";import{b as s,c,g as l,i as u,l as d,m as f}from"./worker-chunk-0SEMnZfQ.mjs";import{n as p,t as m}from"./worker-chunk-BciE9pGu.mjs";import{r as h,t as g}from"./worker-chunk-Cf_GZd_H.mjs";import{a as _,i as v}from"./worker-chunk-Zd4U_VZt.mjs";import{toUSVString as y}from"node:util";function readLegacyCompactionMetrics(e){try{return readLegacyCompactionHistory(e).flatMap(e=>{let t=e.postCompaction.entryId;return t?[{entryId:t,tokensBefore:e.tokensBefore,tokensAfter:e.tokensAfter}]:[]})}catch{return[]}}function readLegacyCompactionSnapshotPaths(e){return readLegacyCompactionHistory(e).flatMap(e=>[e.preCompaction.sessionFile?.trim(),e.postCompaction.sessionFile?.trim()].filter(e=>!!e))}function readLegacyCompactionHistory(e){let n=t(e)?.compactionCheckpoints;if(n==null)return[];if(!Array.isArray(n))throw TypeError(`Invalid legacy compaction history references`);return n.map(e=>{let n=t(e),r=t(n?.preCompaction),i=t(n?.postCompaction);if(!n||!r||!i)throw TypeError(`Invalid legacy compaction history references`);let string=e=>{if(e!=null){if(typeof e!=`string`)throw TypeError(`Invalid legacy compaction history reference`);return e}},number=e=>typeof e==`number`&&Number.isFinite(e)?e:void 0;return{sessionId:string(n.sessionId),preCompaction:{sessionId:string(r.sessionId),sessionFile:string(r.sessionFile)},postCompaction:{sessionId:string(i.sessionId),sessionFile:string(i.sessionFile),entryId:string(i.entryId)},tokensBefore:number(n.tokensBefore),tokensAfter:number(n.tokensAfter)}})}var b=e((()=>{n()}));function sessionReferenceProjection(e){return s`CASE WHEN has_optional_references = 0
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
    ) END END`.as(`reference_json`)}var x,S,C,w=e((()=>{l(),x=s`CASE WHEN reference_json = '{}' THEN reference_json
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
    THEN reference_json END`.as(`references`),S=s`json_tree("references")`.as(`reference`),C=s`reference.type = 'text' AND (
    reference.fullkey IN ('$.sessionId', '$.previousSessionId')
    OR reference.fullkey GLOB '$.usageFamilySessionIds[[]*[]]'
    OR reference.fullkey GLOB '$.compactionCheckpoints[[]*[]].sessionId'
    OR reference.fullkey GLOB '$.compactionCheckpoints[[]*[]].preCompaction.sessionId'
    OR reference.fullkey GLOB '$.compactionCheckpoints[[]*[]].postCompaction.sessionId'
  )`}));function collectSessionStateIdsForEntry(e){let t=[],add=e=>{let n=e?.trim();n&&t.push(n)};add(e.sessionId),add(e.previousSessionId);for(let t of e.usageFamilySessionIds??[])add(t);for(let t of readLegacyCompactionHistory(e))add(t.sessionId),add(t.preCompaction.sessionId),add(t.postCompaction.sessionId);return r(t)}function addRetainedWindowSessionReferences(e,t,n,r,i){let a=m(e.db).selectFrom(`session_windows`).innerJoin(`session_nodes`,`session_nodes.session_key`,`session_windows.session_key`).select([`session_windows.session_id`,`session_nodes.session_key`,`session_nodes.current_session_id`,`session_nodes.updated_at`,`session_nodes.pinned_at`]).$if(i!==void 0,e=>e.select(`session_nodes.entry_json`)).where(e=>e.or([e(`session_nodes.archived_at`,`is not`,null),e(`session_nodes.pinned_at`,`is not`,null)]));r&&(a=a.where(`session_windows.session_id`,`in`,f(r)));for(let r of d(e.db,a))n.has(r.session_key)||i&&r.pinned_at===null&&r.entry_json!==void 0&&_({key:r.session_key,entry:h({...r,entry_json:r.entry_json})??void 0,preserveRecentMs:i.preserveRecentMs})||t.add(r.session_id)}function*readSessionNodeReferences(e,t,n,r=!1){let i=m(e.db),a=o(e.db),c=[...t].filter(e=>y(e)===e&&!e.includes(`\0`)&&!/[\uFFFE\uFFFF]/u.test(e)),l=i.selectFrom(`session_nodes`).select([`current_session_id`,`session_key`]).$if(r,e=>e.select(`updated_at`)).$if(r&&a,e=>e.orderBy(`session_key`,`asc`)).$if(c.length>0,e=>e.where(`session_key`,`not in`,f(c)));n?.length&&n.length<=16&&n.every(e=>y(e)===e&&!/[\0\uFFFD-\uFFFF]/u.test(e))&&(l=l.where(e=>e.or([e.or(n.map(e=>a?s`strpos(current_session_id, ${e}) > 0`:s`instr(current_session_id, ${e}) > 0`)),e(`has_optional_references`,`=`,1)])));let u=i.with(e=>e(`projected_nodes`).materialized(),()=>l.select(e=>sessionReferenceProjection(r?e.ref(`updated_at`):void 0))).with(e=>e(`reference_nodes`).materialized(),e=>e.selectFrom(`projected_nodes`).selectAll().select(x)).selectFrom(`reference_nodes`).leftJoin(S,e=>e.on(C)).select([`current_session_id`,`session_key`,`reference.atom`,`reference.fullkey`]).$if(r,e=>e.select(`updated_at`)).select(s`CASE WHEN "references" IS NULL THEN (SELECT entry_json FROM session_nodes WHERE session_nodes.session_key = reference_nodes.session_key) END`.as(`entry_json`)).$if(r,e=>e.orderBy(`session_key`,`asc`)),p=d(e.db,a?l.select(e=>[`entry_json`,e.val(null).as(`atom`),e.val(null).as(`fullkey`)]):u);for(let e of p)if(!t.has(e.session_key)){if(yield{sessionKey:e.session_key,sessionId:e.current_session_id},e.entry_json!==null){let t=h({...e,entry_json:e.entry_json});if(t)for(let n of collectSessionStateIdsForEntry(t))yield{sessionKey:e.session_key,sessionId:n}}else if(e.atom!==null&&e.fullkey!==null&&/^\$\.(sessionId|previousSessionId|usageFamilySessionIds\[\d+\]|compactionCheckpoints\[\d+\]\.(sessionId|(?:preCompaction|postCompaction)\.sessionId))$/u.test(e.fullkey)){let t=e.atom.trim();t&&(yield{sessionKey:e.session_key,sessionId:t})}}}function readSessionReferenceOwners(e,t,n){let r=new Set(n),i=/* @__PURE__ */ new Map;if(r.size===0)return i;for(let{sessionKey:a,sessionId:o}of readSessionNodeReferences(e,t,n,!0))if(r.delete(o)&&(i.set(o,a),r.size===0))break;return i}function readReferencedSessionIds(e,t=/* @__PURE__ */ new Set,n,r){if(n?.length===0)return/* @__PURE__ */ new Set;let i=/* @__PURE__ */ new Set,a=n?new Set(n):void 0;for(let{sessionId:r}of readSessionNodeReferences(e,t,n))(!a||a.has(r))&&i.add(r);return addRetainedWindowSessionReferences(e,i,t,n,r),n?new Set(n.filter(e=>i.has(e))):i}function readReferencedSessionIdsAfterTargetMutation(e,t,n){return readReferencedSessionIds(e,new Set(r([t.canonicalKey,...t.storeKeys].map(e=>e.trim()))),n)}function readSessionGenerationIdsForKeys(e,t,n={}){let r=[...t].map(e=>n.exactStoredKeys?e:e.trim());if(r.length===0)return[];let i=m(e.db);return u(e.db,i.selectFrom(`session_windows`).select(`session_id`).where(`session_key`,`in`,f(r))).rows.map(e=>e.session_id)}function collectProjectedReferencedSessionIds(e){let t=new Set(e.excludedSessionKeys),n=readReferencedSessionIds(e.database,t,e.candidateSessionIds);for(let t of Object.values(e.projectedStore))for(let e of collectSessionStateIdsForEntry(t))n.add(e);return n}var T=e((()=>{i(),l(),c(),a(),b(),w(),p(),g(),v()}));export{readReferencedSessionIdsAfterTargetMutation as a,b as c,readReferencedSessionIds as i,readLegacyCompactionMetrics as l,collectSessionStateIdsForEntry as n,readSessionGenerationIdsForKeys as o,T as r,readSessionReferenceOwners as s,collectProjectedReferencedSessionIds as t,readLegacyCompactionSnapshotPaths as u};