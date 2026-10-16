import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-CsIRv3py.mjs";
import { s as withFileLock } from "./file-lock-CkzOvhYo.mjs";
import "./file-lock-Cl3feKST.mjs";
import { a as insertSandboxRegistryRowInDatabase, c as rowToBrowserEntry, l as rowToContainerEntry, o as readSandboxRegistryEntryInDatabase, r as containerEntryToRow, s as readSandboxRegistryRowInDatabase, t as assertSandboxRegistryReservationCurrent } from "./registry.kernel-CjtYly-h.mjs";
import { isDeepStrictEqual } from "node:util";
import { createHash } from "node:crypto";
//#region src/agents/sandbox/registry.ts
/**
* Persistent sandbox registry storage.
*
* Tracks runtime and browser containers in the shared state DB.
*/
function getSandboxRegistryKysely(db) {
	return getNodeSqliteKysely(db);
}
async function writeRegistry(write, guard, assertCallerCurrent) {
	guard?.assertHost?.();
	guard?.beforeLegacyApply?.();
	const context = captureOpenClawStateWorkerContext();
	const input = structuredClone(write);
	const assertCurrent = () => {
		guard?.assertHost?.();
		context.admission.assertCurrent();
		context.maintenanceScope?.assertAdmission();
		assertCallerCurrent?.();
	};
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	guard?.beforeLegacyApply?.();
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "sandboxRegistry.write",
		input
	}), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	});
}
/** Reads all registered sandbox runtime containers from SQLite. */
async function readRegistry() {
	const reply = await executeExistingOpenClawStateRead({}, { type: "sandboxRegistry.list" });
	if (!reply) return { entries: [] };
	if (!reply.ok || reply.type !== "sandboxRegistry.list") throw new Error("Unexpected sandbox registry list result");
	return { entries: reply.entries };
}
/** Reads one registered sandbox runtime container by container name. */
async function readRegistryEntry(containerName) {
	const reply = await executeExistingOpenClawStateRead({}, {
		type: "sandboxRegistry.get",
		containerName
	});
	if (!reply) return null;
	if (!reply.ok || reply.type !== "sandboxRegistry.get") throw new Error("Unexpected sandbox registry lookup result");
	return reply.entry;
}
/** Reads registered runtime IDs for one backend-owned sandbox scope, newest first. */
async function readRegisteredSandboxRuntimeIds(params) {
	const reply = await executeExistingOpenClawStateRead({}, {
		type: "sandboxRegistry.runtimeIds",
		...params
	});
	if (!reply) return [];
	if (!reply.ok || reply.type !== "sandboxRegistry.runtimeIds") throw new Error("Unexpected sandbox runtime ID result");
	return reply.runtimeIds;
}
/** Creates or updates one sandbox runtime registry entry, preserving immutable creation fields. */
async function updateRegistry(entry, guard) {
	await writeRegistry({
		operation: "update",
		entry
	}, guard);
}
/** Removes one sandbox runtime registry entry by container name. */
async function removeRegistryEntry(containerName, options = {}) {
	await writeRegistry({
		operation: "remove",
		containerName,
		preserveRemovalIntent: options.preserveRemovalIntent
	}, options.guard);
}
/** Atomically select one generation for a backend/scope before provider allocation. */
function reserveSandboxRegistryEntry(candidate) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getSandboxRegistryKysely(db);
		const existing = executeSqliteQuerySync(db, stateDb.selectFrom("sandbox_registry_entries").selectAll().where("registry_kind", "=", "container").where("backend_id", "=", candidate.backendId ?? "docker").where("session_key", "=", candidate.sessionKey).orderBy("last_used_at_ms", "desc").orderBy("container_name", "asc")).rows.map(rowToContainerEntry).find((entry) => entry !== null);
		if (existing) {
			assertSandboxRegistryReservationCurrent(existing, candidate);
			if (!existing.runtimeState || !existing.workspaceDir) {
				existing.runtimeState ??= "pending";
				existing.workspaceDir ??= candidate.workspaceDir;
				insertSandboxRegistryRowInDatabase(db, containerEntryToRow(existing));
			}
			return existing;
		}
		if (readSandboxRegistryRowInDatabase(db, "container", candidate.containerName)) throw new Error(`Sandbox runtime ID "${candidate.containerName}" is already registered.`);
		const entry = {
			...candidate,
			runtimeState: "pending"
		};
		insertSandboxRegistryRowInDatabase(db, containerEntryToRow(entry));
		return entry;
	});
}
/** Validate the exact generation; retained handles cannot outlive removal intent. */
function assertSandboxRegistryEntryCurrent(entry) {
	const current = withExistingOpenClawStateDatabaseReadOnly(({ db }) => readSandboxRegistryEntryInDatabase(db, entry.containerName)) ?? null;
	assertSandboxRegistryReservationCurrent(current, entry);
	if (current.createdAtMs !== entry.createdAtMs || current.workspaceDir !== entry.workspaceDir || current.configHash !== entry.configHash || !isDeepStrictEqual(current.backendTarget, entry.backendTarget)) throw new Error("Sandbox runtime generation changed");
}
/** Publish only a still-current reservation, or forget a provider-confirmed terminal generation. */
async function completeSandboxRegistryReservation(entry, retired = false, guard) {
	await writeRegistry({
		operation: "complete",
		entry,
		retired
	}, guard);
}
/** Serialize provider operations across Gateway/CLI; only dead owners permit lock recovery. */
async function withSandboxRegistryEntryLock(entry, operation) {
	const key = createHash("sha256").update(entry.containerName).digest("hex");
	return await withFileLock(`${resolveOpenClawStateSqlitePath()}.sandbox-${key}`, {
		retries: {
			retries: 9e3,
			factor: 1,
			minTimeout: 100,
			maxTimeout: 100
		},
		stale: 0,
		staleRecovery: "remove-if-definitely-stale"
	}, operation);
}
/** Persist removal intent before waiting for provisioning, and retain failed cleanup for retry. */
async function removeSandboxRegistryRuntime(entry, removeRuntime, options = {}) {
	const assertCurrent = () => {
		options.guard?.assertHost?.();
		options.guard?.beforeLegacyApply?.();
	};
	assertCurrent();
	const selected = runOpenClawStateWriteTransaction(({ db }) => {
		const row = readSandboxRegistryRowInDatabase(db, "container", entry.containerName);
		const current = row ? rowToContainerEntry(row) : null;
		if (!current || current.backendId !== entry.backendId || current.sessionKey !== entry.sessionKey || options.shouldRemove && !options.shouldRemove(current)) return null;
		if (!current.runtimeState && !options.reserveRuntime) return current;
		const next = {
			...current,
			runtimeState: current.runtimeState === "pending" || current.runtimeState === "removing-pending" ? "removing-pending" : "removing"
		};
		insertSandboxRegistryRowInDatabase(db, containerEntryToRow(next, current));
		return next;
	});
	if (!selected) return;
	if (!selected.runtimeState) {
		assertCurrent();
		await removeRuntime(selected);
		await removeRegistryEntry(selected.containerName, { guard: options.guard });
		return;
	}
	const removing = selected;
	await withSandboxRegistryEntryLock(removing, async () => {
		assertCurrent();
		const current = await readRegistryEntry(removing.containerName);
		assertCurrent();
		if (!current || current.runtimeState !== "removing" && current.runtimeState !== "removing-pending" || current.backendId !== removing.backendId || current.sessionKey !== removing.sessionKey || options.shouldRemove && !options.shouldRemove(current)) return;
		await removeRuntime(current);
		await removeRegistryEntry(current.containerName, { guard: options.guard });
	});
}
/** Reads all registered browser sandbox containers from SQLite. */
async function readBrowserRegistry() {
	const reply = await executeExistingOpenClawStateRead({}, { type: "sandboxRegistry.browsers" });
	if (!reply) return { entries: [] };
	if (!reply.ok || reply.type !== "sandboxRegistry.browsers") throw new Error("Unexpected sandbox browser registry result");
	return { entries: reply.entries };
}
/** Validate the exact browser workspace owner before local reconciliation effects. */
function assertSandboxBrowserRegistryEntryCurrent(entry) {
	const current = withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		if (!tableExists(db, "sandbox_registry_entries")) return null;
		const row = readSandboxRegistryRowInDatabase(db, "browser", entry.containerName);
		return row ? rowToBrowserEntry(row) : null;
	});
	if (!current || current.sessionKey !== entry.sessionKey || current.createdAtMs !== entry.createdAtMs || current.workspaceDir !== entry.workspaceDir || current.configHash !== entry.configHash) throw new Error("Sandbox browser workspace owner changed");
}
/** Creates or updates one browser sandbox registry entry, preserving immutable creation fields. */
async function updateBrowserRegistry(entry, assertCurrent) {
	await writeRegistry({
		operation: "updateBrowser",
		entry
	}, void 0, assertCurrent);
}
/** Forget only the inspected allocation, under the caller's still-live settlement lease. */
async function removeSandboxRegistryGeneration(kind, entry, assertCurrent) {
	await writeRegistry({
		operation: "removeGeneration",
		kind,
		entry
	}, void 0, assertCurrent);
}
/** Removes one browser sandbox registry entry by container name. */
async function removeBrowserRegistryEntry(containerName) {
	await writeRegistry({
		operation: "removeBrowser",
		containerName
	});
}
//#endregion
export { readRegisteredSandboxRuntimeIds as a, removeBrowserRegistryEntry as c, removeSandboxRegistryRuntime as d, reserveSandboxRegistryEntry as f, withSandboxRegistryEntryLock as h, readBrowserRegistry as i, removeRegistryEntry as l, updateRegistry as m, assertSandboxRegistryEntryCurrent as n, readRegistry as o, updateBrowserRegistry as p, completeSandboxRegistryReservation as r, readRegistryEntry as s, assertSandboxBrowserRegistryEntryCurrent as t, removeSandboxRegistryGeneration as u };
