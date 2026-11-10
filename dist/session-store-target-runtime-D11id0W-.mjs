import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { j as readSqliteDatabaseWriteTokenForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { C as listConfiguredSessionStoreAgentIds } from "./openclaw-state-db-BtDOU_3j.mjs";
import { d as readOpenClawAgentDatabaseRegistryToken, u as prepareOpenClawAgentDatabaseRegistrySnapshotRead } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-ugPrOKRi.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-Blrs2q29.mjs";
import { t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { g as targetDiscoveryLane, v as withSessionHistoryWorkerReadCandidates } from "./session-transcript-worker-resources-D1956Oac.mjs";
//#region src/config/sessions/session-store-target-runtime.ts
const targetSelections = /* @__PURE__ */ new Map();
const targetInventories = /* @__PURE__ */ new Map();
const MAX_SELECTIONS = 128;
/** Registry receipts and physical replacement invalidate locator facts, never caller authority. */
function captureSelectionMemo(selections, request, selection, includeRows = false) {
	const registry = readOpenClawAgentDatabaseRegistryToken({ env: request.env });
	const key = () => {
		try {
			return JSON.stringify([selection, request.candidates.map((candidate) => {
				const identity = readDatabasePathIdentitySync(candidate.path);
				return [
					candidate,
					identity.key,
					identity.birthtime,
					includeRows ? readSqliteDatabaseWriteTokenForPath(candidate.path) : void 0
				];
			})]);
		} catch {
			return;
		}
	};
	const captured = includeRows && request.candidates.some((candidate) => candidate.scope) ? void 0 : key();
	return {
		read() {
			if (!captured) return;
			const cached = selections.get(captured);
			if (!cached || cached.registry !== registry) return;
			selections.delete(captured);
			selections.set(captured, cached);
			return structuredClone(cached.value);
		},
		install(value) {
			if (!captured) return;
			selections.delete(captured);
			selections.set(captured, {
				registry,
				value: structuredClone(value)
			});
			while (selections.size > MAX_SELECTIONS) selections.delete(selections.keys().next().value);
		}
	};
}
function prepareSessionStoreTargetInventoryRead(request, unchangedBy, registeredDatabases) {
	const { candidates, ...prepared } = request;
	const registry = prepareOpenClawAgentDatabaseRegistrySnapshotRead({ env: request.env }, unchangedBy);
	const assertRegistryCurrent = unchangedBy ? registry.assertCurrent : registry.assertAdmissionCurrent;
	return {
		assertRegistryCurrent,
		followRegistration: registry.followRegistration,
		withRead(operation, assertCallerCurrent) {
			return withSessionHistoryWorkerReadCandidates(candidates, async (discovery) => {
				const assertCurrent = () => {
					assertCallerCurrent?.();
					discovery.assertCurrent();
					assertRegistryCurrent();
				};
				const memo = captureSelectionMemo(targetInventories, request, [
					request.selection,
					request.agentIds,
					request.config.session?.store,
					request.config.agents?.defaults?.sessionStore?.agentId,
					resolveSessionStoreCompatibilityAgentId(request.config),
					listConfiguredSessionStoreAgentIds(request.config),
					[...request.paths],
					request.registryDiscovery
				], !isPerAgentSessionStoreConfig(request.config.session?.store));
				let inventory = memo.read() ?? await discovery.readTargetInventory({
					...prepared,
					registeredDatabases: registeredDatabases ?? { status: "deferred" }
				});
				if (inventory.kind === "session-target-registry-required") {
					const { result } = await registry.read();
					inventory = await discovery.readTargetInventory({
						...prepared,
						registeredDatabases: result.status === "available" ? result.entries : { status: "unavailable" }
					});
				}
				assertCurrent();
				if (inventory.kind !== "session-target-inventory") throw new Error("Session store inventory requested registry rows twice");
				if (inventory.agents.every((agent) => agent.result.available)) memo.install(inventory);
				return operation(inventory, assertCurrent);
			}, targetDiscoveryLane);
		}
	};
}
async function withSessionStoreTarget(request, operation, assertCallerCurrent, onReadError) {
	assertCallerCurrent?.();
	const { candidates, ...targetRequest } = request;
	const registry = prepareOpenClawAgentDatabaseRegistrySnapshotRead({ env: request.env });
	return withSessionHistoryWorkerReadCandidates(candidates, async (discovery) => {
		const assertCurrent = () => {
			assertCallerCurrent?.();
			registry.assertAdmissionCurrent();
			discovery.assertCurrent();
		};
		const memo = captureSelectionMemo(targetSelections, request, [
			request.agentId,
			request.defaultAgentId,
			request.storePath
		]);
		const cached = memo.read();
		let read = cached ? {
			ok: true,
			value: cached
		} : await discovery.readStoreTargetResult({
			...targetRequest,
			registeredDatabases: { status: "deferred" }
		});
		if (read.ok && read.value.kind === "session-target-registry-required") {
			const { result } = await registry.read();
			read = await discovery.readStoreTargetResult({
				...targetRequest,
				registeredDatabases: result.status === "available" ? result.entries : { status: "unavailable" }
			});
		}
		assertCurrent();
		if (!read.ok) {
			if (onReadError) return onReadError(read.error, assertCurrent);
			throw read.error;
		}
		if (read.value.kind === "session-target-registry-required") throw new Error("Session store target requested registry rows twice");
		memo.install(read.value);
		const target = read.value;
		const assertTargetCurrent = () => {
			assertCurrent();
			assertSessionStoreReadCandidate(target.sourcePath, candidates);
		};
		return operation(target, {
			assertCurrent: assertTargetCurrent,
			onRegistryChange: registry.assertAdmissionCurrent,
			async refreshBeforeDispatch(assertRetainedTarget) {
				assertRetainedTarget();
				assertTargetCurrent();
			},
			async revalidateTarget() {
				assertTargetCurrent();
			}
		});
	}, targetDiscoveryLane);
}
//#endregion
export { withSessionStoreTarget as n, prepareSessionStoreTargetInventoryRead as t };
