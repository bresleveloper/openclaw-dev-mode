import{l as e,m as t,n,o as r,p as i,u as a}from"./git-operation.worker-schemas-6aIgnnYb.mjs";import{AsyncLocalStorage as o}from"node:async_hooks";import{compileFunction as s}from"node:vm";a({version:r(1),manifestRef:i().regex(/^sha256:[a-f0-9]{64}$/u),memo:n(t([i().regex(/^worker:\d+:\d+:\d+:\d+:\d+$/u),i().regex(/^[a-f0-9]{64}$/u)])).max(25e3),metrics:a({contentHashCount:e().finite().nonnegative(),memoHitCount:e().finite().nonnegative(),memoTruncatedCount:e().finite().nonnegative()}).strict()}).strict();const c=new o;function activeWorkspaceHashContext(){return c.getStore()}async function withWorkspaceHashMemo(e,t,n){let r=c.getStore(),i=n??r?.metrics;return r?.memo===e&&r.metrics===i?await t():await c.run({memo:e,metrics:i,owner:r?.owner??`gateway`},t)}async function withWorkerWorkspaceHashMemo(e,t,n){return await c.run({memo:e,owner:`worker`,metrics:n},t)}async function withoutWorkspaceHashContext(e){return await c.exit(e)}function pruneWorkspaceHashMemo(e){let t=0;e.forEach((e,n)=>{t+=n.length+e.length});for(let[n,r]of e){if(t<=8388608)break;e.delete(n),t-=n.length+r.length}}const l=String.raw`
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
}`,{workspaceCtimeIsReusable:u,workspaceStatIdentity:d,selectWorkerWorkspaceHashMemoEntries:f}=s(`${l}\nreturn { workspaceCtimeIsReusable, workspaceStatIdentity, selectWorkerWorkspaceHashMemoEntries };`)();export{withoutWorkspaceHashContext as a,withWorkspaceHashMemo as i,pruneWorkspaceHashMemo as n,u as o,withWorkerWorkspaceHashMemo as r,d as s,activeWorkspaceHashContext as t};