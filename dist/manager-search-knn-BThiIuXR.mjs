import{r as truncateUtf16Safe}from"./utf16-slice-DA3Mllbx.mjs";import{_ as sql}from"./kysely-sync-Dl78faM1.mjs";import{i as admitStoreSearch}from"./adapters-CDoWDd-a.mjs";import{i as matchesVectorRow}from"./sqlite-vector-CJMUOiow.mjs";import{g as MEMORY_INDEX_VECTOR_TABLE}from"./memory-schema-CxKZYQTC.mjs";import"./memory-core-host-engine-knn-KmyS7SDU.mjs";import"./memory-core-host-engine-schema-BULkTj2F.mjs";
//!extensions/memory-core/src/memory/manager-search-shared.ts
function projectMemorySearchRow(e,t,n){return{id:e.id,path:e.path,startLine:e.start_line,endLine:e.end_line,score:n,snippet:truncateUtf16Safe(e.text,t),source:e.source}}function buildMemoryModelFilter(e,t){return t.length===1?`${e} = ?`:`${e} IN (${t.map(()=>`?`).join(`, `)})`}function resolveSnippetProjection(e,t){const n=Number.isSafeInteger(t)&&t>0?t*4:void 0;return{sql:n===void 0?e:`COALESCE(CAST(substr(CAST(${e} AS BLOB), 1, ?) AS TEXT), ${e})`,params:n===void 0?[]:[n]}}
//!extensions/memory-core/src/memory/source-filter.ts
function buildMemorySourceFilter(e,t,n){const r=e?`${e}.source`:`source`;const i=t.map(()=>`?`).join(`, `);return{sql:t.length?` AND ${r} IN (${i})`:``,params:[...t],...n?.length?{excludedSessionPaths:n}:{}}}function buildSqliteMemorySourceFilter(e,t){if(!e.excludedSessionPaths?.length)return e;const n=t?`${t}.source`:`source`;const r=t?`${t}.path`:`path`;return{sql:`${e.sql} AND (${n} != 'sessions' OR ${r} NOT IN (SELECT value FROM json_each(?)))`,params:[...e.params,JSON.stringify(e.excludedSessionPaths)]}}
//!extensions/memory-core/src/memory/manager-search-knn.ts
const MEMORY_VECTOR_INDEX={chunks:{table:MEMORY_INDEX_VECTOR_TABLE,alias:`v`,rowShape:{id:`string`,path:`string`,start_line:`number`,end_line:`number`,text:`string`,source:[`memory`,`sessions`],dist:`finite-number`}}};function admitMemoryVectorIndex(e,t=MEMORY_INDEX_VECTOR_TABLE){const n=admitStoreSearch(e,{vector:{chunks:{...MEMORY_VECTOR_INDEX.chunks,table:t}}});const r=n.vectors.chunks;if(!n.vector||!r)throw new Error(n.diagnostics.join(`; `));return{capability:n.vector,index:r}}async function searchMemoryVectorIndex(e,t,n,r={}){const i=buildMemoryModelFilter(`c.model`,n.providerModels);const a=buildSqliteMemorySourceFilter(n.sourceFilter,`c`);const o=`${i}${a.sql}`.split(`?`);const s=sql(Object.assign(o,{raw:o}),...n.providerModels,...a.params);const c=n.snippetMaxChars*4;return await e.nearest({index:t,vector:n.queryVec,limit:n.limit,textPrefix:{column:`text`,maxChars:n.snippetMaxChars},...r,isRow:e=>matchesVectorRow(e,MEMORY_VECTOR_INDEX.chunks.rowShape),query:({match:e,distance:r})=>sql`SELECT c.id, c.path, c.start_line, c.end_line,
       CASE WHEN instr(substr(CAST(c.text AS BLOB), 1, ${c}), x'00') > 0
            THEN CAST(substr(CAST(c.text AS BLOB), 1, ${c}) AS TEXT)
            ELSE substr(c.text, 1, ${n.snippetMaxChars}) END AS text,
       c.source,
       ${r} AS dist
  FROM ${sql.raw(t.table)} v
  CROSS JOIN memory_index_chunks c ON c.id = v.id
 WHERE ${e} AND ${s}
 ORDER BY dist ASC
 LIMIT ${n.limit}`,scopeCount:sql`SELECT COUNT(*) AS count FROM (
  SELECT 1 FROM memory_index_chunks c WHERE ${s} LIMIT ${n.limit}
)`})}export{buildMemoryModelFilter as a,buildSqliteMemorySourceFilter as i,searchMemoryVectorIndex as n,projectMemorySearchRow as o,buildMemorySourceFilter as r,resolveSnippetProjection as s,admitMemoryVectorIndex as t};