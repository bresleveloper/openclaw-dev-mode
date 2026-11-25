import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{F as t,H as n,I as r,S as i,W as a,j as o}from"./worker-chunk-NLl7b0Cm.mjs";import{t as s}from"./worker-chunk-yj5UkYJA.mjs";import{AsyncLocalStorage as c}from"node:async_hooks";import{compileFunction as l}from"node:vm";function activeWorkspaceHashContext(){return d.getStore()}async function withWorkspaceHashMemo(e,t,n){let r=d.getStore(),i=n??r?.metrics;return r?.memo===e&&r.metrics===i?await t():await d.run({memo:e,metrics:i,owner:r?.owner??`gateway`},t)}async function withWorkerWorkspaceHashMemo(e,t,n){return await d.run({memo:e,owner:`worker`,metrics:n},t)}async function withWorkspaceHashContext(e){let t=d.getStore();return await withWorkspaceHashMemo(t?.memo??/* @__PURE__ */ new Map,e,t?.metrics)}async function withoutWorkspaceHashContext(e){return await d.exit(e)}function pruneWorkspaceHashMemo(e){let t=0;e.forEach((e,n)=>{t+=n.length+e.length});for(let[n,r]of e){if(t<=8388608)break;e.delete(n),t-=n.length+r.length}}var u,d,f,p,m,h,g=e((()=>{s(),u=25e3,r({version:o(1),manifestRef:n().regex(/^sha256:[a-f0-9]{64}$/u),memo:i(a([n().regex(/^worker:\d+:\d+:\d+:\d+:\d+$/u),n().regex(/^[a-f0-9]{64}$/u)])).max(u),metrics:r({contentHashCount:t().finite().nonnegative(),memoHitCount:t().finite().nonnegative(),memoTruncatedCount:t().finite().nonnegative()}).strict()}).strict(),d=new c,f=String.raw`
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
}`,{workspaceCtimeIsReusable:p,workspaceStatIdentity:m,selectWorkerWorkspaceHashMemoEntries:h}=l(`${f}\nreturn { workspaceCtimeIsReusable, workspaceStatIdentity, selectWorkerWorkspaceHashMemoEntries };`)()}));export{withWorkspaceHashContext as a,p as c,withWorkerWorkspaceHashMemo as i,m as l,g as n,withWorkspaceHashMemo as o,pruneWorkspaceHashMemo as r,withoutWorkspaceHashContext as s,activeWorkspaceHashContext as t};