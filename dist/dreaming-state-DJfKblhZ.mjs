import path from "node:path";
import { setImmediate } from "node:timers/promises";
import { createHash } from "node:crypto";
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
const SESSION_SEEN_HASHES_PER_CHUNK = 512;
let configuredOpenKeyedStore;
function configureMemoryCoreDreamingState(openKeyedStore) {
	configuredOpenKeyedStore = openKeyedStore;
}
function openMemoryCoreStateStore(options) {
	if (!configuredOpenKeyedStore) throw new Error("memory-core dreaming SQLite state store is not configured");
	return configuredOpenKeyedStore(options);
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
async function readMemoryCoreWorkspaceEntries(params) {
	const workspaceKey = memoryCoreWorkspaceStateKey(params.workspaceDir);
	const prefix = `${workspaceKey}:`;
	return (await openWorkspaceStore(params.namespace).entries()).filter((entry) => entry.key.startsWith(prefix) && entry.value.workspaceKey === workspaceKey).map((entry) => ({
		key: entry.value.key,
		value: entry.value.value
	}));
}
async function writeMemoryCoreWorkspaceEntries(params) {
	const store = openWorkspaceStore(params.namespace);
	const workspaceKey = memoryCoreWorkspaceStateKey(params.workspaceDir);
	const prefix = `${workspaceKey}:`;
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
	for (const entry of await store.entries()) if (entry.key.startsWith(prefix) && !replacementKeys.has(entry.key)) {
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
	const prefix = `${memoryCoreWorkspaceStateKey(params.workspaceDir)}:`;
	let completed = 0;
	for (const entry of await store.entries()) if (entry.key.startsWith(prefix)) {
		await store.delete(entry.key);
		if (++completed % WORKSPACE_STATE_YIELD_EVERY === 0) await setImmediate();
	}
}
async function deleteMemoryCoreWorkspaceEntry(params) {
	await openWorkspaceStore(params.namespace).delete(memoryCoreWorkspaceEntryKey(params.workspaceDir, params.key));
}
//#endregion
export { normalizeMemoryCoreWorkspaceKey as _, SESSION_BACKFILL_REWIND_NAMESPACE as a, writeMemoryCoreWorkspaceEntries as b, SHORT_TERM_LOCK_NAMESPACE as c, SHORT_TERM_RECALL_NAMESPACE as d, clearMemoryCoreWorkspaceNamespace as f, memoryCoreWorkspaceStateKey as g, memoryCoreStateReference as h, DREAMING_SESSION_INGESTION_SEEN_NAMESPACE as i, SHORT_TERM_META_NAMESPACE as l, deleteMemoryCoreWorkspaceEntry as m, DREAMING_MEMORY_BACKUP_NAMESPACE as n, SESSION_SEEN_HASHES_PER_CHUNK as o, configureMemoryCoreDreamingState as p, DREAMING_SESSION_INGESTION_FILES_NAMESPACE as r, SHORT_TERM_LOCK_MAX_ENTRIES as s, DREAMING_DAILY_INGESTION_NAMESPACE as t, SHORT_TERM_PHASE_SIGNAL_NAMESPACE as u, openMemoryCoreStateStore as v, writeMemoryCoreWorkspaceEntry as x, readMemoryCoreWorkspaceEntries as y };
