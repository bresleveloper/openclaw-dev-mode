import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{B as t,H as n,N as r,P as i,k as a,x as o}from"./worker-chunk-D-t5pbdl.mjs";import{t as s}from"./worker-chunk-uKvqOJn0.mjs";import{AsyncLocalStorage as c}from"node:async_hooks";import{compileFunction as l}from"node:vm";function parseRemoteWorkspaceManifestEnvelope(e){return f.parse(JSON.parse(e))}function replaceWorkerWorkspaceHashMemoEntries(e,t){for(let t of e.keys())t.startsWith(`worker:`)&&e.delete(t);for(let[n,r]of t)e.set(n,r)}function createWorkspaceReconcileMetrics(){return{gateway:{contentHashCount:0,contentHashDurationMs:0,memoHitCount:0},remoteManifestCalls:0,remoteContentHashCount:0,remoteMemoHitCount:0,remoteMemoTruncatedCount:0,remoteHashDurationMs:0,remoteManifestDurationMs:0,remoteManifestWallDurationMs:0,localReconciliationDurationMs:0}}function activeWorkspaceHashContext(){return p.getStore()}async function withWorkspaceHashMemo(e,t,n){let r=p.getStore(),i=n??r?.metrics;return r?.memo===e&&r.metrics===i?await t():await p.run({memo:e,metrics:i,owner:r?.owner??`gateway`},t)}async function withWorkerWorkspaceHashMemo(e,t,n){return await p.run({memo:e,owner:`worker`,metrics:n},t)}async function withWorkspaceHashContext(e){let t=p.getStore();return await withWorkspaceHashMemo(t?.memo??/* @__PURE__ */ new Map,e,t?.metrics)}async function withoutWorkspaceHashContext(e){return await p.exit(e)}function pruneWorkspaceHashMemo(e){let t=0;for(let[n,r]of e)if(t+=n.length+r.length,t>8388608){e.clear();return}}function serializeRemoteWorkspaceHashMemo(e,t=u){return JSON.stringify(_(e,d,t))}function recordRemoteWorkspaceHashMetrics(e,t){e.remoteContentHashCount+=t.contentHashCount,e.remoteMemoHitCount+=t.memoHitCount,e.remoteMemoTruncatedCount+=t.memoTruncatedCount,e.remoteHashDurationMs+=t.contentHashDurationMs,e.remoteManifestDurationMs+=t.totalDurationMs}async function measureLocalWorkspaceReconciliation(e,t){let n=performance.now();try{return await t()}finally{e.localReconciliationDurationMs+=performance.now()-n}}var u,d,f,p,m,h,g,_,v=e((()=>{s(),u=8388608,d=25e3,f=i({version:a(1),manifestRef:t().regex(/^sha256:[a-f0-9]{64}$/u),memo:o(n([t().regex(/^worker:\d+:\d+:\d+:\d+:\d+$/u),t().regex(/^[a-f0-9]{64}$/u)])).max(d),metrics:i({contentHashCount:r().finite().nonnegative(),contentHashDurationMs:r().finite().nonnegative(),memoHitCount:r().finite().nonnegative(),memoTruncatedCount:r().finite().nonnegative(),totalDurationMs:r().finite().nonnegative()}).strict()}).strict(),p=new c,m=String.raw`
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
}`,{workspaceCtimeIsReusable:h,workspaceStatIdentity:g,selectWorkerWorkspaceHashMemoEntries:_}=l(`${m}\nreturn { workspaceCtimeIsReusable, workspaceStatIdentity, selectWorkerWorkspaceHashMemoEntries };`)()}));export{h as _,createWorkspaceReconcileMetrics as a,parseRemoteWorkspaceManifestEnvelope as c,replaceWorkerWorkspaceHashMemoEntries as d,serializeRemoteWorkspaceHashMemo as f,withoutWorkspaceHashContext as g,withWorkspaceHashMemo as h,activeWorkspaceHashContext as i,pruneWorkspaceHashMemo as l,withWorkspaceHashContext as m,d as n,v as o,withWorkerWorkspaceHashMemo as p,m as r,measureLocalWorkspaceReconciliation as s,u as t,recordRemoteWorkspaceHashMetrics as u,g as v};