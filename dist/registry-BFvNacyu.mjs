import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { n as captureOpenClawStateReadWorkerContext, r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { s as withFileLock } from "./file-lock-BmWJVvRa.mjs";
import "./file-lock-BMq7QYoB.mjs";
import { n as withSandboxRegistryPublication, t as sandboxRegistryPublication } from "./registry-publication-fWdyCoIh.mjs";
import { r as withSandboxRegistrySettlement, t as finishSandboxRegistryRemoval } from "./registry-lifecycle-COPxA84A.mjs";
import { a as rowToBrowserEntry, o as rowToContainerEntry, s as shouldPruneSandboxRegistryEntry, t as assertSandboxRegistryGenerationCurrent } from "./registry.kernel-DbYv0cl_.mjs";
import { createHash } from "node:crypto";
//#region src/agents/sandbox/registry-currentness.ts
const databases = /* @__PURE__ */ new Map();
const keyFor = (kind, name) => JSON.stringify([kind, name]);
function factsFor(identity) {
	let facts = databases.get(identity);
	if (!facts) {
		facts = {
			revision: 0,
			entries: /* @__PURE__ */ new Map()
		};
		databases.set(identity, facts);
	}
	return facts;
}
sandboxRegistryPublication.subscribeFacts((change) => {
	if ("kind" in change) {
		if (change.kind === "unknown" || change.kind === "settled" && change.outcome === "unknown") {
			const facts = databases.get(String(change.identity));
			if (facts) {
				facts.revision++;
				facts.entries.clear();
			}
		}
		return;
	}
	if (change.facts.size === 0) return;
	const facts = factsFor(String(change.source.identity));
	facts.revision++;
	for (const [key, fact] of change.facts) facts.entries.set(key, fact.kind === "postimage" ? fact.value.registry_kind === "container" ? rowToContainerEntry(fact.value) : rowToBrowserEntry(fact.value) : null);
});
registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
	if (identity) databases.delete(identity.key);
	else databases.clear();
} });
/** Retain read facts for synchronous checks at provider and workspace effects. */
function captureSandboxRegistryFacts(context) {
	const facts = factsFor(context.admission.identity.key);
	const revision = facts.revision;
	return (kind, entries) => {
		const current = factsFor(context.admission.identity.key);
		for (const entry of entries) {
			const key = keyFor(kind, entry.containerName);
			if (current === facts && facts.revision === revision) current.entries.set(key, structuredClone(entry));
		}
		return entries;
	};
}
function assertSandboxRegistryFactsCurrent(entry, kind) {
	const { admission } = captureOpenClawStateReadWorkerContext();
	admission.assertCurrent();
	const current = databases.get(admission.identity.key)?.entries.get(keyFor(kind, entry.containerName));
	if (kind === "container") {
		assertSandboxRegistryGenerationCurrent(current ?? null, entry);
		return;
	}
	if (!current || current.sessionKey !== entry.sessionKey || current.createdAtMs !== entry.createdAtMs || current.workspaceDir !== entry.workspaceDir || current.configHash !== entry.configHash) throw new Error("Sandbox browser workspace owner changed");
}
//#endregion
//#region src/agents/sandbox/registry.ts
/**
* Persistent sandbox registry storage.
*
* Tracks runtime and browser containers in the shared state DB.
*/
async function executeRegistry(command, guard, assertCallerCurrent, context = captureOpenClawStateWorkerContext()) {
	guard?.assertHost?.();
	guard?.beforeLegacyApply?.();
	const input = structuredClone(command.input);
	const assertCurrent = () => {
		guard?.assertHost?.();
		context.admission.assertCurrent();
		context.maintenanceScope?.assertAdmission();
		assertCallerCurrent?.();
	};
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	guard?.beforeLegacyApply?.();
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: command.type,
		input
	}), {
		assertCurrent,
		createAdmission: withSandboxRegistryPublication(createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath]), () => context.admission.identity.key, () => context.admission.assertCurrent())
	});
}
function writeRegistry(write, guard, assertCallerCurrent, context) {
	return executeRegistry({
		type: "sandboxRegistry.write",
		input: write
	}, guard, assertCallerCurrent, context);
}
/** Reads all registered sandbox runtime containers from SQLite. */
async function readRegistry() {
	const context = captureOpenClawStateReadWorkerContext();
	const install = captureSandboxRegistryFacts(context);
	const reply = await executeExistingOpenClawStateRead({}, { type: "sandboxRegistry.list" }, { context });
	if (!reply) return { entries: [] };
	if (!reply.ok || reply.type !== "sandboxRegistry.list") throw new Error("Unexpected sandbox registry list result");
	return { entries: install("container", reply.entries) };
}
/** Reads one registered sandbox runtime container by container name. */
async function readRegistryEntry(containerName) {
	const context = captureOpenClawStateReadWorkerContext();
	const install = captureSandboxRegistryFacts(context);
	const reply = await executeExistingOpenClawStateRead({}, {
		type: "sandboxRegistry.get",
		containerName
	}, { context });
	if (!reply) return null;
	if (!reply.ok || reply.type !== "sandboxRegistry.get") throw new Error("Unexpected sandbox registry lookup result");
	return reply.entry ? install("container", [reply.entry])[0] : null;
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
async function reserveSandboxRegistryEntry(candidate, guard) {
	const context = captureOpenClawStateWorkerContext();
	return captureSandboxRegistryFacts(context)("container", [await executeRegistry({
		type: "sandboxRegistry.reserve",
		input: candidate
	}, guard, void 0, context)])[0];
}
/** Validate the exact generation; retained handles cannot outlive removal intent. */
function assertSandboxRegistryEntryCurrent(entry) {
	assertSandboxRegistryFactsCurrent(entry, "container");
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
async function withSandboxRegistryEntryLock(entry, operation, databasePath = resolveOpenClawStateSqlitePath()) {
	const key = createHash("sha256").update(entry.containerName).digest("hex");
	return await withFileLock(`${databasePath}.sandbox-${key}`, {
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
	const context = captureOpenClawStateWorkerContext();
	const assertCurrent = () => {
		context.admission.assertCurrent();
		options.guard?.assertHost?.();
		options.guard?.beforeLegacyApply?.();
	};
	assertCurrent();
	const input = structuredClone({
		entry,
		reserveRuntime: options.reserveRuntime,
		prune: options.prune
	});
	return withSandboxRegistrySettlement(context, async () => {
		const selected = await executeRegistry({
			type: "sandboxRegistry.beginRemoval",
			input
		}, options.guard, void 0, context);
		assertCurrent();
		if (!selected) return;
		const remove = async (current) => {
			assertCurrent();
			const identity = { ...context.admission.identity };
			const generation = structuredClone(current);
			await removeRuntime(current);
			await finishSandboxRegistryRemoval(context, identity, generation, options.guard);
		};
		if (!selected.runtimeState) {
			await remove(selected);
			return;
		}
		await withSandboxRegistryEntryLock(selected, async () => {
			assertCurrent();
			const reply = await executeExistingOpenClawStateRead({
				path: context.admission.databasePath,
				env: context.environment
			}, {
				type: "sandboxRegistry.get",
				containerName: selected.containerName
			}, {
				context,
				current: true
			});
			assertCurrent();
			if (reply && (!reply.ok || reply.type !== "sandboxRegistry.get")) throw new Error("Unexpected sandbox registry removal lookup result");
			const current = reply?.entry;
			if (!current || current.runtimeState !== "removing" && current.runtimeState !== "removing-pending" || current.backendId !== selected.backendId || current.sessionKey !== selected.sessionKey || current.createdAtMs !== selected.createdAtMs || input.prune && !shouldPruneSandboxRegistryEntry(current, input.prune)) return;
			await remove(current);
		}, context.admission.databasePath);
	});
}
/** Reads all registered browser sandbox containers from SQLite. */
async function readBrowserRegistry() {
	const context = captureOpenClawStateReadWorkerContext();
	const install = captureSandboxRegistryFacts(context);
	const reply = await executeExistingOpenClawStateRead({}, { type: "sandboxRegistry.browsers" }, { context });
	if (!reply) return { entries: [] };
	if (!reply.ok || reply.type !== "sandboxRegistry.browsers") throw new Error("Unexpected sandbox browser registry result");
	return { entries: install("browser", reply.entries) };
}
/** Validate the exact browser workspace owner before local reconciliation effects. */
function assertSandboxBrowserRegistryEntryCurrent(entry) {
	assertSandboxRegistryFactsCurrent(entry, "browser");
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
