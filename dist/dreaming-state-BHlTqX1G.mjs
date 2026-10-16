import { t as createPluginRuntimeStore } from "./runtime-store-USWE9VtE.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
import { setImmediate } from "node:timers/promises";
//#region extensions/memory-core/src/dreaming-state.ts
const MEMORY_CORE_PLUGIN_ID = "memory-core";
const DREAMING_DAILY_INGESTION_NAMESPACE = "dreaming-daily-ingestion";
const DREAMING_SESSION_INGESTION_FILES_NAMESPACE = "dreaming-session-ingestion-files";
const DREAMING_SESSION_INGESTION_SEEN_NAMESPACE = "dreaming-session-ingestion-seen";
const SESSION_BACKFILL_REWIND_NAMESPACE = "session-backfill-rewind";
const DREAMING_MEMORY_BACKUP_NAMESPACE = "dreaming-memory-backups";
const SHORT_TERM_RECALL_NAMESPACE = "short-term-recall";
const SHORT_TERM_PHASE_SIGNAL_NAMESPACE = "short-term-phase-signals";
const SHORT_TERM_META_NAMESPACE = "short-term-meta";
const SHORT_TERM_LOCK_NAMESPACE = "short-term-locks";
const DREAMING_WORKSPACE_STATE_MAX_ENTRIES = 5e4;
const WORKSPACE_STATE_YIELD_EVERY = 10;
const SHORT_TERM_LOCK_MAX_ENTRIES = 4096;
const dreamingState = createPluginRuntimeStore({
	key: "memory-core:dreaming-state",
	errorMessage: "memory-core dreaming SQLite state store is not configured"
});
const configureMemoryCoreDreamingState = dreamingState.setRuntime;
function openMemoryCoreStateStore(options) {
	return dreamingState.getRuntime()(options);
}
function normalizeMemoryCoreWorkspaceKey(workspaceDir) {
	const resolved = path.resolve(workspaceDir).replace(/\\/g, "/");
	return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
function memoryCoreWorkspaceStateKey(workspaceDir) {
	return createHash("sha256").update(normalizeMemoryCoreWorkspaceKey(workspaceDir)).digest("hex");
}
function memoryCoreWorkspaceEntryKey(workspaceDir, logicalKey) {
	return `${memoryCoreWorkspaceStateKey(workspaceDir)}:${createHash("sha256").update(logicalKey).digest("hex")}`;
}
function memoryCoreStateReference(namespace, workspaceDir) {
	return `plugin-state:${MEMORY_CORE_PLUGIN_ID}/${namespace}/${memoryCoreWorkspaceStateKey(workspaceDir)}`;
}
function openWorkspaceStore(namespace) {
	return openMemoryCoreStateStore({
		namespace,
		maxEntries: DREAMING_WORKSPACE_STATE_MAX_ENTRIES
	});
}
async function readWorkspaceStoreEntries(store, workspaceKey) {
	const prefix = `${workspaceKey}:`;
	if (!store.entriesInKeyRange) return (await store.entries()).filter((entry) => entry.key.startsWith(prefix));
	return (await store.entriesInKeyRange({
		keyStartInclusive: prefix,
		keyEndExclusive: `${workspaceKey};`,
		limit: Number.MAX_SAFE_INTEGER,
		order: "asc"
	})).toSorted((left, right) => left.createdAt - right.createdAt);
}
async function readMemoryCoreWorkspaceEntries(params) {
	const workspaceKey = memoryCoreWorkspaceStateKey(params.workspaceDir);
	return (await readWorkspaceStoreEntries(openWorkspaceStore(params.namespace), workspaceKey)).filter((entry) => entry.value.workspaceKey === workspaceKey).map((entry) => ({
		key: entry.value.key,
		value: entry.value.value
	}));
}
async function writeMemoryCoreWorkspaceEntries(params) {
	const store = openWorkspaceStore(params.namespace);
	const workspaceKey = memoryCoreWorkspaceStateKey(params.workspaceDir);
	const replacementKeys = /* @__PURE__ */ new Set();
	let completed = 0;
	for (const entry of params.entries) {
		const stateKey = memoryCoreWorkspaceEntryKey(params.workspaceDir, entry.key);
		replacementKeys.add(stateKey);
		await store.register(stateKey, {
			version: 1,
			workspaceKey,
			workspaceDir: path.resolve(params.workspaceDir),
			key: entry.key,
			value: entry.value
		});
		if (++completed % WORKSPACE_STATE_YIELD_EVERY === 0) await setImmediate();
	}
	for (const entry of await readWorkspaceStoreEntries(store, workspaceKey)) if (!replacementKeys.has(entry.key)) {
		await store.delete(entry.key);
		if (++completed % WORKSPACE_STATE_YIELD_EVERY === 0) await setImmediate();
	}
}
async function writeMemoryCoreWorkspaceEntry(params) {
	const workspaceKey = memoryCoreWorkspaceStateKey(params.workspaceDir);
	await openWorkspaceStore(params.namespace).register(memoryCoreWorkspaceEntryKey(params.workspaceDir, params.key), {
		version: 1,
		workspaceKey,
		workspaceDir: path.resolve(params.workspaceDir),
		key: params.key,
		value: params.value
	});
}
async function clearMemoryCoreWorkspaceNamespace(params) {
	const store = openWorkspaceStore(params.namespace);
	const workspaceKey = memoryCoreWorkspaceStateKey(params.workspaceDir);
	let completed = 0;
	for (const entry of await readWorkspaceStoreEntries(store, workspaceKey)) {
		await store.delete(entry.key);
		if (++completed % WORKSPACE_STATE_YIELD_EVERY === 0) await setImmediate();
	}
}
async function deleteMemoryCoreWorkspaceEntry(params) {
	await openWorkspaceStore(params.namespace).delete(memoryCoreWorkspaceEntryKey(params.workspaceDir, params.key));
}
//#endregion
export { openMemoryCoreStateStore as _, SESSION_BACKFILL_REWIND_NAMESPACE as a, writeMemoryCoreWorkspaceEntry as b, SHORT_TERM_META_NAMESPACE as c, clearMemoryCoreWorkspaceNamespace as d, configureMemoryCoreDreamingState as f, normalizeMemoryCoreWorkspaceKey as g, memoryCoreWorkspaceStateKey as h, DREAMING_SESSION_INGESTION_SEEN_NAMESPACE as i, SHORT_TERM_PHASE_SIGNAL_NAMESPACE as l, memoryCoreStateReference as m, DREAMING_MEMORY_BACKUP_NAMESPACE as n, SHORT_TERM_LOCK_MAX_ENTRIES as o, deleteMemoryCoreWorkspaceEntry as p, DREAMING_SESSION_INGESTION_FILES_NAMESPACE as r, SHORT_TERM_LOCK_NAMESPACE as s, DREAMING_DAILY_INGESTION_NAMESPACE as t, SHORT_TERM_RECALL_NAMESPACE as u, readMemoryCoreWorkspaceEntries as v, writeMemoryCoreWorkspaceEntries as y };
