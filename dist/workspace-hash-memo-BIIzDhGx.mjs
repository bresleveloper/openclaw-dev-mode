import{Fn as object,Jn as string,Nt as array,Pn as number,nr as tuple,xn as literal}from"./schemas-DuCQi-Qb.mjs";import{AsyncLocalStorage}from"node:async_hooks";import{compileFunction}from"node:vm";
//!src/gateway/worker-environments/workspace-hash-memo.ts
const MAX_WORKSPACE_HASH_MEMO_BYTES=8388608;const MAX_WORKSPACE_HASH_MEMO_ENTRIES=25e3;const remoteWorkspaceManifestEnvelopeSchema=object({version:literal(1),manifestRef:string().regex(/^sha256:[a-f0-9]{64}$/u),memo:array(tuple([string().regex(/^worker:\d+:\d+:\d+:\d+:\d+$/u),string().regex(/^[a-f0-9]{64}$/u)])).max(MAX_WORKSPACE_HASH_MEMO_ENTRIES),metrics:object({contentHashCount:number().finite().nonnegative(),memoHitCount:number().finite().nonnegative(),memoTruncatedCount:number().finite().nonnegative()}).strict()}).strict();function parseRemoteWorkspaceManifestEnvelope(e){return remoteWorkspaceManifestEnvelopeSchema.parse(JSON.parse(e))}function replaceWorkerWorkspaceHashMemoEntries(e,t){for(const t of e.keys())if(t.startsWith(`worker:`))e.delete(t);for(const[n,r]of t)e.set(n,r)}const workspaceHashContext=new AsyncLocalStorage;function activeWorkspaceHashContext(){return workspaceHashContext.getStore()}async function withWorkspaceHashMemo(e,t,n){const r=workspaceHashContext.getStore();const i=n??r?.metrics;if(r?.memo===e&&r.metrics===i)return await t();return await workspaceHashContext.run({memo:e,metrics:i,owner:r?.owner??`gateway`},t)}async function withWorkerWorkspaceHashMemo(e,t,n){return await workspaceHashContext.run({memo:e,owner:`worker`,metrics:n},t)}async function withWorkspaceHashContext(e){const t=workspaceHashContext.getStore();return await withWorkspaceHashMemo(t?.memo??/* @__PURE__ */ new Map,e,t?.metrics)}async function withoutWorkspaceHashContext(e){return await workspaceHashContext.exit(e)}function pruneWorkspaceHashMemo(e){let t=0;e.forEach((e,n)=>{t+=n.length+e.length});for(const[n,r]of e){if(t<=8388608)break;e.delete(n);t-=n.length+r.length}}function takeWorkspaceHashMemo(e,t){const n=e.get(t)??/* @__PURE__ */ new Map;pruneWorkspaceHashMemo(n);e.set(t,n);return n}const WORKSPACE_HASH_MEMO_JS=String.raw`
const WORKSPACE_CTIME_SAFETY_MARGIN_MS = 2000;
function workspaceCtimeIsReusable(ctimeNs, startedAtMs) {
  // Recent files cost another hash; a backwards clock keeps them outside the reuse window.
  return ctimeNs >= 0n && ctimeNs < BigInt(startedAtMs - WORKSPACE_CTIME_SAFETY_MARGIN_MS) * 1000000n;
}
function workspaceStatIdentity(owner, stats) {
  return [owner, stats.dev, stats.ino, stats.size, stats.mtimeNs, stats.ctimeNs].join(":");
}
function selectWorkerWorkspaceHashMemoEntries(memo, maxEntries, maxBytes) {
  const compareIdentity = ([left], [right]) =>
    left < right ? -1 : left > right ? 1 : 0;
  const candidates = [...memo]
    .filter(([identity]) => identity.startsWith("worker:"))
    .map((entry) => ({ entry, size: Number(entry[0].split(":")[3]) }))
    .toSorted((left, right) => right.size - left.size || compareIdentity(left.entry, right.entry));
  const selected = [];
  let bytes = 2;
  for (const { entry } of candidates) {
    if (selected.length === maxEntries) {
      break;
    }
    const entryBytes = Buffer.byteLength(JSON.stringify(entry)) + (selected.length > 0 ? 1 : 0);
    if (bytes + entryBytes <= maxBytes) {
      selected.push(entry);
      bytes += entryBytes;
    }
  }
  return selected.toSorted(compareIdentity);
}`;const{workspaceCtimeIsReusable,workspaceStatIdentity,selectWorkerWorkspaceHashMemoEntries}=compileFunction(`${WORKSPACE_HASH_MEMO_JS}\nreturn { workspaceCtimeIsReusable, workspaceStatIdentity, selectWorkerWorkspaceHashMemoEntries };`)();function serializeRemoteWorkspaceHashMemo(e,t=MAX_WORKSPACE_HASH_MEMO_BYTES){return JSON.stringify(selectWorkerWorkspaceHashMemoEntries(e,MAX_WORKSPACE_HASH_MEMO_ENTRIES,t))}export{parseRemoteWorkspaceManifestEnvelope as a,serializeRemoteWorkspaceHashMemo as c,withWorkspaceHashContext as d,withWorkspaceHashMemo as f,workspaceStatIdentity as h,activeWorkspaceHashContext as i,takeWorkspaceHashMemo as l,workspaceCtimeIsReusable as m,MAX_WORKSPACE_HASH_MEMO_ENTRIES as n,pruneWorkspaceHashMemo as o,withoutWorkspaceHashContext as p,WORKSPACE_HASH_MEMO_JS as r,replaceWorkerWorkspaceHashMemoEntries as s,MAX_WORKSPACE_HASH_MEMO_BYTES as t,withWorkerWorkspaceHashMemo as u};