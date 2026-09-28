import { Fn as object, Jn as string, Nt as array, Pn as number, nr as tuple, xn as literal } from "./schemas-BOYIvvln.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/gateway/worker-environments/workspace-hash-memo.ts
const MAX_WORKSPACE_HASH_MEMO_BYTES = 8388608;
const MAX_WORKSPACE_HASH_MEMO_ENTRIES = 25e3;
const remoteWorkspaceManifestEnvelopeSchema = object({
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
/** Parses and validates a memo-v1 capture response from the remote manifest script. */
function parseRemoteWorkspaceManifestEnvelope(stdout) {
	return remoteWorkspaceManifestEnvelopeSchema.parse(JSON.parse(stdout));
}
/** Replaces the memo's worker-owned entries with the latest capture's entries wholesale. */
function replaceWorkerWorkspaceHashMemoEntries(memo, entries) {
	for (const identity of memo.keys()) if (identity.startsWith("worker:")) memo.delete(identity);
	for (const [identity, sha256] of entries) memo.set(identity, sha256);
}
const workspaceHashContext = new AsyncLocalStorage();
function createWorkspaceReconcileMetrics() {
	return {
		gateway: {
			contentHashCount: 0,
			contentHashDurationMs: 0,
			memoHitCount: 0
		},
		remoteManifestCalls: 0,
		remoteContentHashCount: 0,
		remoteMemoHitCount: 0,
		remoteMemoTruncatedCount: 0,
		remoteHashDurationMs: 0,
		remoteManifestDurationMs: 0,
		remoteManifestWallDurationMs: 0,
		localReconciliationDurationMs: 0
	};
}
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
async function withWorkspaceHashContext(operation) {
	const active = workspaceHashContext.getStore();
	return await withWorkspaceHashMemo(active?.memo ?? /* @__PURE__ */ new Map(), operation, active?.metrics);
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
/** Returns the placement-owned memo for a key, pruning it before each reuse. */
function takeWorkspaceHashMemo(store, key) {
	const memo = store.get(key) ?? /* @__PURE__ */ new Map();
	pruneWorkspaceHashMemo(memo);
	store.set(key, memo);
	return memo;
}
/** Self-contained for the node script; preserve the largest hashes within both wire limits. */
function selectWorkerWorkspaceHashMemoEntries(memo, maxEntries, maxBytes) {
	const compareIdentity = ([left], [right]) => left < right ? -1 : left > right ? 1 : 0;
	const candidates = [...memo].filter(([identity]) => identity.startsWith("worker:")).map((entry) => ({
		entry,
		size: Number(entry[0].split(":")[3])
	})).toSorted((left, right) => right.size - left.size || compareIdentity(left.entry, right.entry));
	const selected = [];
	let bytes = 2;
	for (const { entry } of candidates) {
		if (selected.length === maxEntries) break;
		const entryBytes = Buffer.byteLength(JSON.stringify(entry)) + (selected.length > 0 ? 1 : 0);
		if (bytes + entryBytes <= maxBytes) {
			selected.push(entry);
			bytes += entryBytes;
		}
	}
	return selected.toSorted(compareIdentity);
}
function serializeRemoteWorkspaceHashMemo(memo, maxBytes = MAX_WORKSPACE_HASH_MEMO_BYTES) {
	return JSON.stringify(selectWorkerWorkspaceHashMemoEntries(memo, MAX_WORKSPACE_HASH_MEMO_ENTRIES, maxBytes));
}
function recordRemoteWorkspaceHashMetrics(aggregate, metrics) {
	aggregate.remoteContentHashCount += metrics.contentHashCount;
	aggregate.remoteMemoHitCount += metrics.memoHitCount;
	aggregate.remoteMemoTruncatedCount += metrics.memoTruncatedCount;
	aggregate.remoteHashDurationMs += metrics.contentHashDurationMs;
	aggregate.remoteManifestDurationMs += metrics.totalDurationMs;
}
async function measureLocalWorkspaceReconciliation(metrics, operation) {
	const startedAt = performance.now();
	try {
		return await operation();
	} finally {
		metrics.localReconciliationDurationMs += performance.now() - startedAt;
	}
}
function workspaceStatIdentity(owner, stats) {
	return `${owner}:${stats.dev}:${stats.ino}:${stats.size}:${stats.mtimeNs}:${stats.ctimeNs}`;
}
//#endregion
export { workspaceStatIdentity as _, measureLocalWorkspaceReconciliation as a, recordRemoteWorkspaceHashMetrics as c, serializeRemoteWorkspaceHashMemo as d, takeWorkspaceHashMemo as f, withoutWorkspaceHashContext as g, withWorkspaceHashMemo as h, createWorkspaceReconcileMetrics as i, replaceWorkerWorkspaceHashMemoEntries as l, withWorkspaceHashContext as m, MAX_WORKSPACE_HASH_MEMO_ENTRIES as n, parseRemoteWorkspaceManifestEnvelope as o, withWorkerWorkspaceHashMemo as p, activeWorkspaceHashContext as r, pruneWorkspaceHashMemo as s, MAX_WORKSPACE_HASH_MEMO_BYTES as t, selectWorkerWorkspaceHashMemoEntries as u };
