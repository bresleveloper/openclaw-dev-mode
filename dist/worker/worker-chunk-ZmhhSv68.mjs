import{n as e}from"./worker-chunk-IQf3eJtA.mjs";import{b as t,d as n,h as r,m as i,o as a,u as o,y as s}from"./worker-chunk-C8nHRcLX.mjs";import{AsyncLocalStorage as c}from"node:async_hooks";import{compileFunction as l}from"node:vm";function activeWorkspaceHashContext(){return f.getStore()}async function withWorkspaceHashMemo(e,t,n){let r=f.getStore(),i=n??r?.metrics;return r?.memo===e&&r.metrics===i?await t():await f.run({memo:e,metrics:i,owner:r?.owner??`gateway`},t)}async function withWorkerWorkspaceHashMemo(e,t,n){return await f.run({memo:e,owner:`worker`,metrics:n},t)}async function withoutWorkspaceHashContext(e){return await f.exit(e)}function pruneWorkspaceHashMemo(e){let t=0;for(let[n,r]of e)if(t+=n.length+r.length,t>8388608){e.clear();return}}var u,d,f,p,m,h,g;function init_workspace_hash_memo(){return(init_workspace_hash_memo=e((()=>{o(),u=8388608,d=25e3,r({version:n(1),manifestRef:s().regex(/^sha256:[a-f0-9]{64}$/u),memo:a(t([s().regex(/^worker:\d+:\d+:\d+:\d+:\d+$/u),s().regex(/^[a-f0-9]{64}$/u)])).max(d),metrics:r({contentHashCount:i().finite().nonnegative(),contentHashDurationMs:i().finite().nonnegative(),memoHitCount:i().finite().nonnegative(),memoTruncatedCount:i().finite().nonnegative(),totalDurationMs:i().finite().nonnegative()}).strict()}).strict(),f=new c,p=String.raw`
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
}`,{workspaceCtimeIsReusable:m,workspaceStatIdentity:h,selectWorkerWorkspaceHashMemoEntries:g}=l(`${p}\nreturn { workspaceCtimeIsReusable, workspaceStatIdentity, selectWorkerWorkspaceHashMemoEntries };`)()})))()}export{init_workspace_hash_memo as a,withWorkspaceHashMemo as c,h as d,activeWorkspaceHashContext as i,withoutWorkspaceHashContext as l,d as n,pruneWorkspaceHashMemo as o,p as r,withWorkerWorkspaceHashMemo as s,u as t,m as u};