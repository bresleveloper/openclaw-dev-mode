import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{B as t,H as n,N as r,O as i,P as a,b as o}from"./worker-chunk-D2K_jjRS.mjs";import{t as s}from"./worker-chunk-CFioHTQa.mjs";import{AsyncLocalStorage as c}from"node:async_hooks";import{compileFunction as l}from"node:vm";function parseRemoteWorkspaceManifestEnvelope(e){return f.parse(JSON.parse(e))}function replaceWorkerWorkspaceHashMemoEntries(e,t){for(let t of e.keys())t.startsWith(`worker:`)&&e.delete(t);for(let[n,r]of t)e.set(n,r)}function createWorkspaceReconcileMetrics(){return{gateway:{contentHashCount:0,contentHashDurationMs:0,memoHitCount:0},remoteManifestCalls:0,remoteContentHashCount:0,remoteMemoHitCount:0,remoteMemoTruncatedCount:0,remoteHashDurationMs:0,remoteManifestDurationMs:0,remoteManifestWallDurationMs:0,localReconciliationDurationMs:0}}function activeWorkspaceHashContext(){return p.getStore()}async function withWorkspaceHashMemo(e,t,n){let r=p.getStore(),i=n??r?.metrics;return r?.memo===e&&r.metrics===i?await t():await p.run({memo:e,metrics:i,owner:r?.owner??`gateway`},t)}async function withWorkerWorkspaceHashMemo(e,t,n){return await p.run({memo:e,owner:`worker`,metrics:n},t)}async function withWorkspaceHashContext(e){let t=p.getStore();return await withWorkspaceHashMemo(t?.memo??/* @__PURE__ */ new Map,e,t?.metrics)}async function withoutWorkspaceHashContext(e){return await p.exit(e)}function pruneWorkspaceHashMemo(e){let t=0;for(let[n,r]of e)if(t+=n.length+r.length,t>8388608){e.clear();return}}function serializeRemoteWorkspaceHashMemo(e,t=u){return JSON.stringify(g(e,d,t))}function recordRemoteWorkspaceHashMetrics(e,t){e.remoteContentHashCount+=t.contentHashCount,e.remoteMemoHitCount+=t.memoHitCount,e.remoteMemoTruncatedCount+=t.memoTruncatedCount,e.remoteHashDurationMs+=t.contentHashDurationMs,e.remoteManifestDurationMs+=t.totalDurationMs}async function measureLocalWorkspaceReconciliation(e,t){let n=performance.now();try{return await t()}finally{e.localReconciliationDurationMs+=performance.now()-n}}var u,d,f,p,m,h,g,_=e((()=>{s(),u=8388608,d=25e3,f=a({version:i(1),manifestRef:t().regex(/^sha256:[a-f0-9]{64}$/u),memo:o(n([t().regex(/^worker:\d+:\d+:\d+:\d+:\d+$/u),t().regex(/^[a-f0-9]{64}$/u)])).max(d),metrics:a({contentHashCount:r().finite().nonnegative(),contentHashDurationMs:r().finite().nonnegative(),memoHitCount:r().finite().nonnegative(),memoTruncatedCount:r().finite().nonnegative(),totalDurationMs:r().finite().nonnegative()}).strict()}).strict(),p=new c,m=String.raw`
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
}`,{workspaceStatIdentity:h,selectWorkerWorkspaceHashMemoEntries:g}=l(`${m}\nreturn { workspaceStatIdentity, selectWorkerWorkspaceHashMemoEntries };`)()}));export{h as _,createWorkspaceReconcileMetrics as a,parseRemoteWorkspaceManifestEnvelope as c,replaceWorkerWorkspaceHashMemoEntries as d,serializeRemoteWorkspaceHashMemo as f,withoutWorkspaceHashContext as g,withWorkspaceHashMemo as h,activeWorkspaceHashContext as i,pruneWorkspaceHashMemo as l,withWorkspaceHashContext as m,d as n,_ as o,withWorkerWorkspaceHashMemo as p,m as r,measureLocalWorkspaceReconciliation as s,u as t,recordRemoteWorkspaceHashMetrics as u};