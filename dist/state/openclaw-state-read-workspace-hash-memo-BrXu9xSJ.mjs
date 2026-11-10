import { _ as tuple, c as literal, d as number, f as object, g as string, i as array } from "./openclaw-state-read-schemas-D2seJkFD.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { compileFunction } from "node:vm";
//#region src/gateway/worker-environments/workspace-hash-memo.ts
const MAX_WORKSPACE_HASH_MEMO_BYTES = 8388608;
const MAX_WORKSPACE_HASH_MEMO_ENTRIES = 25e3;
object({
	version: literal(1),
	manifestRef: string().regex(/^sha256:[a-f0-9]{64}$/u),
	memo: array(tuple([string().regex(/^worker:\d+:\d+:\d+:\d+:\d+$/u), string().regex(/^[a-f0-9]{64}$/u)])).max(MAX_WORKSPACE_HASH_MEMO_ENTRIES),
	metrics: object({
		contentHashCount: number().finite().nonnegative(),
		contentHashDurationMs: number().finite().nonnegative(),
		memoHitCount: number().finite().nonnegative(),
		memoTruncatedCount: number().finite().nonnegative(),
		totalDurationMs: number().finite().nonnegative()
	}).strict()
}).strict();
const workspaceHashContext = new AsyncLocalStorage();
function activeWorkspaceHashContext() {
	return workspaceHashContext.getStore();
}
async function withWorkspaceHashMemo(memo, operation, metrics) {
	const active = workspaceHashContext.getStore();
	const inheritedMetrics = metrics ?? active?.metrics;
	if (active?.memo === memo && active.metrics === inheritedMetrics) return await operation();
	return await workspaceHashContext.run({
		memo,
		metrics: inheritedMetrics,
		owner: active?.owner ?? "gateway"
	}, operation);
}
/** Shares hashes validated on the node with its final manifest capture. */
async function withWorkerWorkspaceHashMemo(memo, operation, metrics) {
	return await workspaceHashContext.run({
		memo,
		owner: "worker",
		metrics
	}, operation);
}
async function withoutWorkspaceHashContext(operation) {
	return await workspaceHashContext.exit(operation);
}
function pruneWorkspaceHashMemo(memo) {
	let bytes = 0;
	for (const [identity, sha256] of memo) {
		bytes += identity.length + sha256.length;
		if (bytes > 8388608) {
			memo.clear();
			return;
		}
	}
}
const WORKSPACE_HASH_MEMO_JS = String.raw`
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
}`;
const { workspaceCtimeIsReusable, workspaceStatIdentity, selectWorkerWorkspaceHashMemoEntries } = compileFunction(`${WORKSPACE_HASH_MEMO_JS}\nreturn { workspaceCtimeIsReusable, workspaceStatIdentity, selectWorkerWorkspaceHashMemoEntries };`)();
//#endregion
export { pruneWorkspaceHashMemo as a, withoutWorkspaceHashContext as c, activeWorkspaceHashContext as i, workspaceCtimeIsReusable as l, MAX_WORKSPACE_HASH_MEMO_ENTRIES as n, withWorkerWorkspaceHashMemo as o, WORKSPACE_HASH_MEMO_JS as r, withWorkspaceHashMemo as s, MAX_WORKSPACE_HASH_MEMO_BYTES as t, workspaceStatIdentity as u };
