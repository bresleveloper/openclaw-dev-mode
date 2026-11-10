import { c as registryAuthorityChanged } from "./errors-WYf-uyBk.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { i as captureWorktreeRunEndContext, l as worktreeOwnerSelectionKey, n as captureWorktreeRegistryAuthority, t as WORKTREE_UNKNOWN_OWNER_SELECTION } from "./run-end-lifecycle-DPl2TsZ4.mjs";
//#region src/agents/worktrees/registry-read.ts
function predicateFields(kind) {
	switch (kind) {
		case "activity": return ["activity", "identity"];
		case "removal-claim":
		case "removal-claims": return ["leases"];
		case "session-owner":
		case "projection": return ["identity"];
		case "source-record": return ["identity", "fingerprint"];
		case "source-owner":
		case "lifecycle": return ["identity", "removal"];
		case "publication":
		case "live-binding": return [
			"identity",
			"fingerprint",
			"removal"
		];
		case "exact-owner": return [
			"identity",
			"activity",
			"removal"
		];
		case "binding": return [
			"identity",
			"fingerprint",
			"activity",
			"removal"
		];
		case "exact-snapshot": return [
			"identity",
			"fingerprint",
			"activity",
			"removal",
			"snapshot"
		];
		case "record": return [
			"identity",
			"fingerprint",
			"activity",
			"removal",
			"snapshot",
			"cleanup"
		];
		case "snapshot-retirement": return [
			"identity",
			"fingerprint",
			"activity",
			"removal",
			"snapshot",
			"cleanup",
			"provisioned",
			"leases"
		];
	}
	throw new Error(`Unknown worktree predicate: ${String(kind)}`);
}
function predicateRevisions(predicate) {
	const fields = predicateFields(predicate.kind);
	return [...(predicate.kind === "removal-claims" ? predicate.ids : ["record" in predicate ? predicate.record.id : predicate.id]).map((id) => ({
		id,
		fields
	})), ...predicate.kind === "source-owner" ? [{
		id: worktreeOwnerSelectionKey("session", predicate.ownerId),
		fields: ["identity"]
	}, {
		id: WORKTREE_UNKNOWN_OWNER_SELECTION,
		fields: ["identity"]
	}] : []];
}
/** Capture before a row read, then narrow the unchanged owner witness to its returned ID. */
function captureWorktreeRegistryReadGuard(context, kind) {
	const fields = predicateFields(kind);
	const assertRead = captureWorktreeRegistryAuthority(context, [{
		id: "*",
		fields
	}]);
	const verify = (assertCurrent) => {
		try {
			assertCurrent();
		} catch {
			throw registryAuthorityChanged(kind);
		}
	};
	return (record) => {
		context.admission.assertCurrent();
		verify(assertRead);
		const assertRow = record ? captureWorktreeRegistryAuthority(context, [{
			id: record.id,
			fields
		}, ...(kind === "source-owner" || kind === "publication") && record.ownerId !== void 0 ? [{
			id: worktreeOwnerSelectionKey(record.ownerKind, record.ownerId),
			fields: ["identity"]
		}, {
			id: WORKTREE_UNKNOWN_OWNER_SELECTION,
			fields: ["identity"]
		}] : []]) : assertRead;
		return () => {
			context.admission.assertCurrent();
			verify(assertRow);
		};
	};
}
/** One exact-row read prepares a SQL-free guard retained through filesystem and Git waits. */
async function prepareWorktreeRegistryGuard(context, authority) {
	const predicates = structuredClone(authority.predicates ?? []);
	const assertCaller = authority.assertCurrent;
	const generations = predicates.map((predicate) => ({
		kind: predicate.kind,
		assertCurrent: captureWorktreeRegistryAuthority(context, predicateRevisions(predicate))
	}));
	const assertCurrent = () => {
		context.admission.assertCurrent();
		assertCaller?.();
		for (const generation of generations) try {
			generation.assertCurrent();
		} catch {
			throw registryAuthorityChanged(generation.kind);
		}
	};
	assertCurrent();
	if (predicates.length > 0) {
		const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
		await executeOpenClawStateWorker(context, {
			type: "worktrees.assertPredicates",
			input: { predicates }
		});
		assertCurrent();
	}
	return assertCurrent;
}
async function readLiveRegistryWorktreeByOwner(context, ownerKind, ownerId) {
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "worktrees.findLiveByOwner",
		input: {
			ownerKind,
			ownerId
		}
	});
}
async function readRegistryWorktree(context, id) {
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "worktrees.get",
		input: { id }
	});
}
async function readSessionWorktreeBinding(context, boundId, ownerId) {
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "worktrees.sessionBinding",
		input: {
			boundId,
			ownerId
		}
	});
}
async function readLiveRegistryWorktreeByPath(context, path) {
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "worktrees.findLiveByPath",
		input: { path }
	});
}
/** Resolve the exact target before lock admission without borrowing Gateway-thread SQLite. */
async function readRegistryWorktreeForMutation(params) {
	const assertCurrent = () => {
		params.signal?.throwIfAborted();
		params.commitGuard?.();
	};
	assertCurrent();
	const record = await readRegistryWorktree(captureWorktreeRunEndContext(params.env), params.id);
	assertCurrent();
	return record;
}
function requireActiveWorktreeRecord(id, record) {
	if (!record || record.removedAt !== void 0) throw new Error(`unknown active worktree: ${id}`);
	return record;
}
async function readRegistryWorktrees(env, options = {}, context = captureWorktreeRunEndContext(env)) {
	const input = { liveOnly: options.liveOnly };
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "worktrees.list",
		input
	});
}
async function readLiveRegistryWorktreeIds(env) {
	const context = captureWorktreeRunEndContext(env);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "worktrees.liveIds",
		input: void 0
	});
}
async function getRegistryWorktreeProvisionedPaths(env, id) {
	const context = captureWorktreeRunEndContext(env);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "worktrees.provisionedPaths",
		input: { id }
	});
}
async function getRegistryWorktreeProvisionedState(env, id) {
	const context = captureWorktreeRunEndContext(env);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "worktrees.provisionedState",
		input: { id }
	});
}
async function getRegistryWorktreeProvisionedChunk(env, params) {
	const context = captureWorktreeRunEndContext(env);
	const input = { ...params };
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "worktrees.provisionedChunk",
		input
	});
}
async function readWorktreeCleanupState(env) {
	const reply = await executeExistingOpenClawStateRead({ env }, { type: "worktrees.cleanupState" }, { current: true });
	if (!reply) return {
		records: [],
		leases: {
			liveScopes: [],
			staleScopes: []
		}
	};
	if (!reply.ok || reply.type !== "worktrees.cleanupState") throw new Error("Worktree cleanup state read failed");
	return reply;
}
/** Foreign CLI inspection never admits a writer or repairs lifecycle state. */
async function readExistingRegistryWorktrees(env, signal) {
	const context = captureOpenClawStateReadWorkerContext({ env });
	const reply = await executeExistingOpenClawStateRead({
		env,
		path: context.admission.databasePath
	}, { type: "worktrees.list" }, {
		context,
		current: true,
		signal
	});
	context.admission.assertCurrent();
	if (!reply) return [];
	if (!reply.ok || reply.type !== "worktrees.list") throw new Error("Worktree registry inspection failed");
	return reply.records;
}
//#endregion
export { prepareWorktreeRegistryGuard as a, readLiveRegistryWorktreeByPath as c, readRegistryWorktreeForMutation as d, readRegistryWorktrees as f, requireActiveWorktreeRecord as h, getRegistryWorktreeProvisionedState as i, readLiveRegistryWorktreeIds as l, readWorktreeCleanupState as m, getRegistryWorktreeProvisionedChunk as n, readExistingRegistryWorktrees as o, readSessionWorktreeBinding as p, getRegistryWorktreeProvisionedPaths as r, readLiveRegistryWorktreeByOwner as s, captureWorktreeRegistryReadGuard as t, readRegistryWorktree as u };
