import{n as e}from"./worker-chunk-DyeIuPEC.mjs";import{T as t,c as n,f as r,h as i,v as a,w as o,y as s}from"./worker-chunk-DKfoQBql.mjs";import{AsyncLocalStorage as c}from"node:async_hooks";import{compileFunction as l}from"node:vm";function activeWorkspaceHashContext(){return d.getStore()}async function withWorkspaceHashMemo(e,t,n){let r=d.getStore(),i=n??r?.metrics;return r?.memo===e&&r.metrics===i?await t():await d.run({memo:e,metrics:i,owner:r?.owner??`gateway`},t)}async function withWorkerWorkspaceHashMemo(e,t,n){return await d.run({memo:e,owner:`worker`,metrics:n},t)}async function withoutWorkspaceHashContext(e){return await d.exit(e)}function pruneWorkspaceHashMemo(e){let t=0;e.forEach((e,n)=>{t+=n.length+e.length});for(let[n,r]of e){if(t<=8388608)break;e.delete(n),t-=n.length+r.length}}var u,d,f,p,m,h;function init_workspace_hash_memo(){return(init_workspace_hash_memo=e((()=>{r(),u=25e3,s({version:i(1),manifestRef:o().regex(/^sha256:[a-f0-9]{64}$/u),memo:n(t([o().regex(/^worker:\d+:\d+:\d+:\d+:\d+$/u),o().regex(/^[a-f0-9]{64}$/u)])).max(u),metrics:s({contentHashCount:a().finite().nonnegative(),memoHitCount:a().finite().nonnegative(),memoTruncatedCount:a().finite().nonnegative()}).strict()}).strict(),d=new c,f=String.raw`
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
}`,{workspaceCtimeIsReusable:p,workspaceStatIdentity:m,selectWorkerWorkspaceHashMemoEntries:h}=l(`${f}\nreturn { workspaceCtimeIsReusable, workspaceStatIdentity, selectWorkerWorkspaceHashMemoEntries };`)()})))()}export{withWorkspaceHashMemo as a,m as c,withWorkerWorkspaceHashMemo as i,init_workspace_hash_memo as n,withoutWorkspaceHashContext as o,pruneWorkspaceHashMemo as r,p as s,activeWorkspaceHashContext as t};