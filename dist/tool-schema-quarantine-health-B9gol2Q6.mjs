import { d as createRuntimeHealthRecordEnvelope, f as createRuntimeHealthStore } from "./registry-BIuAP_WM.mjs";
import { i as runtimeToolSchemaIdentityKey, r as normalizeToolSchemaQuarantineRecord } from "./runtime-health-records-BfEYoX08.mjs";
//#region src/agents/tool-schema-quarantine-health.ts
const quarantineStore = createRuntimeHealthStore({
	ownerId: "core:runtime-tool-quarantine-health",
	namespace: "schema-quarantines",
	maxEntries: 128,
	ttlMs: 864e5,
	normalizeRecord: normalizeToolSchemaQuarantineRecord,
	displayKey: (record) => JSON.stringify([record.owner ?? "", record.toolName]),
	pick: "latest"
});
function recordKey(record) {
	return JSON.stringify([
		record.owner ?? "",
		record.toolName,
		record.processId
	]);
}
const submittedQuarantines = /* @__PURE__ */ new Map();
async function recordPersistedRuntimeToolSchemaQuarantine(quarantine) {
	const record = {
		toolName: quarantine.toolName,
		reason: quarantine.reason,
		...createRuntimeHealthRecordEnvelope(quarantine.failedAt),
		...quarantine.owner ? { owner: quarantine.owner } : {}
	};
	submittedQuarantines.set(runtimeToolSchemaIdentityKey(record), Symbol("runtime-tool-quarantine-submission"));
	await quarantineStore.register(recordKey(record), record);
}
/**
* Removes this process's persisted quarantines for tools that now validate
* cleanly. `listHealthyTools` is only invoked when this process has persisted
* quarantines, keeping the common per-run path free of work.
*/
async function clearRecoveredPersistedRuntimeToolSchemaQuarantines(listHealthyTools) {
	if (submittedQuarantines.size === 0) return;
	const recoveredKeys = new Map(listHealthyTools().map(runtimeToolSchemaIdentityKey).flatMap((key) => {
		const submission = submittedQuarantines.get(key);
		return submission ? [[key, submission]] : [];
	}));
	if (recoveredKeys.size === 0) return;
	await Promise.all(Array.from(recoveredKeys, async ([key, submission]) => {
		if (await quarantineStore.clearForProcess(process.pid, {
			kind: "tool-schema",
			keys: [key]
		}, () => {
			if (submittedQuarantines.get(key) !== submission) throw new Error("Runtime tool quarantine changed during recovery");
		}) && submittedQuarantines.get(key) === submission) submittedQuarantines.delete(key);
	}));
}
async function listPersistedRuntimeToolSchemaQuarantines() {
	return (await quarantineStore.list()).map((record) => {
		const quarantine = {
			toolName: record.toolName,
			reason: record.reason,
			failedAt: new Date(record.failedAtMs)
		};
		if (record.owner) quarantine.owner = record.owner;
		return quarantine;
	});
}
//#endregion
export { listPersistedRuntimeToolSchemaQuarantines as n, recordPersistedRuntimeToolSchemaQuarantine as r, clearRecoveredPersistedRuntimeToolSchemaQuarantines as t };
