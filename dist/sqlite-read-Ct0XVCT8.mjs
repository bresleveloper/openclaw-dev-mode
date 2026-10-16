import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as inspectDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { f as runSqliteReadOnlyWorker } from "./sqlite-readonly-worker-TSy0m8v6.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { r as isArtifactPreservingStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { s as mergePersistedAuthProfileState, u as AuthProfileStoreUnreadableError } from "./persisted-BVyWmvfF.mjs";
import { u as registerUserModelAuthProfileSecrets } from "./user-model-accounts-sYn17idc.mjs";
import path from "node:path";
//#region src/agents/auth-profiles/sqlite-read.ts
/** Decode worker-read facts with the same store/state coercion as synchronous reads. */
function loadPersistedAuthProfileStoreFromRows(rows, databasePath) {
	const store = mergePersistedAuthProfileState(rows.store.status === "readable" ? rows.store.raw : null, () => rows.state.status === "readable" ? rows.state.raw : null);
	if (!store && rows.store.status !== "missing") throw new AuthProfileStoreUnreadableError(databasePath);
	return store;
}
const missing = {
	store: {
		status: "missing",
		reason: "database"
	},
	state: {
		status: "missing",
		reason: "database"
	},
	cacheable: false
};
function isInspection(value) {
	return isRecord(value) && (value.status === "unreadable" || value.status === "readable" && Object.hasOwn(value, "raw") || value.status === "missing" && (value.reason === "database" || value.reason === "table" || value.reason === "row"));
}
/** Captured read authority survives all awaits until the runtime composition releases it. */
function prepareAgentAuthProfileRowsRead(options) {
	const databasePath = path.resolve(options.databasePath);
	const agentId = options.agentId;
	const env = cloneEnvWithPlatformSemantics(options.env);
	let identity;
	try {
		identity = inspectDatabasePathIdentitySync(databasePath);
	} catch {
		identity = void 0;
	}
	const captured = (() => {
		try {
			return {
				ok: true,
				value: captureOpenClawStateWorkerContext({ env })
			};
		} catch (error) {
			return {
				ok: false,
				error
			};
		}
	})();
	const controller = new AbortController();
	const pending = /* @__PURE__ */ new Set();
	let closed = false;
	let revoked = false;
	let closing;
	let unregisterAgent;
	let unregisterRoot;
	const revoke = () => {
		revoked = true;
		controller.abort(/* @__PURE__ */ new Error("Auth profile read owner was revoked"));
	};
	const assertCurrent = () => {
		if (revoked) throw new Error("Auth profile read owner was revoked");
		if (!captured.ok) throw captured.error;
		captured.value.admission.assertCurrent();
		captured.value.maintenanceScope?.assertAdmission();
		if (identity && inspectDatabasePathIdentitySync(databasePath)?.key !== identity.key) throw new Error("Auth profile database file identity changed during its read");
		if (!closed) register();
	};
	const dispose = () => {
		closed = true;
		controller.abort(/* @__PURE__ */ new Error("Auth profile read owner closed"));
		closing ??= (async () => {
			await Promise.allSettled(pending);
			unregisterRoot?.();
			unregisterAgent?.();
		})().catch((error) => {
			closing = void 0;
			throw error;
		});
		return closing;
	};
	const register = () => {
		if (unregisterAgent || !captured.ok) return;
		const root = captured.value;
		const registerOwners = () => {
			unregisterAgent = registerOpenClawAgentDatabaseAsyncResource({
				agentId,
				path: databasePath,
				revoke,
				close: dispose
			});
			try {
				unregisterRoot = registerOpenClawStateDatabaseAsyncResource({ close: async (closedIdentity) => {
					if (!closedIdentity || closedIdentity.key === root.admission.identity.key) {
						revoke();
						await dispose();
					}
				} });
			} catch (error) {
				unregisterAgent();
				unregisterAgent = void 0;
				throw error;
			}
		};
		if (root.maintenanceScope) root.maintenanceScope.run(registerOwners);
		else registerOwners();
	};
	const read = () => {
		if (closed) return Promise.reject(/* @__PURE__ */ new Error("Auth profile read owner closed"));
		const operation = (async () => {
			assertCurrent();
			if (!identity) return {
				store: { status: "unreadable" },
				state: { status: "unreadable" },
				cacheable: false
			};
			if (!identity.key.startsWith("file:")) return missing;
			const rows = await runSqliteReadOnlyWorker(databasePath, {
				mode: "auth-profile-rows",
				source: "canonical",
				expectedIdentity: identity.key,
				env,
				signal: controller.signal
			});
			controller.signal.throwIfAborted();
			assertCurrent();
			if (!isInspection(rows.store) || !isInspection(rows.state)) throw new Error("Auth profile reader returned invalid inspection rows");
			return {
				store: rows.store,
				state: rows.state,
				cacheable: rows.cacheable
			};
		})();
		pending.add(operation);
		operation.finally(() => pending.delete(operation)).catch(() => void 0);
		return operation;
	};
	return {
		read,
		assertCurrent,
		dispose
	};
}
/** Shared auth reads reuse the canonical actor and never request a writable open. */
async function readSharedAuthProfileRows(context) {
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "authProfiles.read",
		input: { artifactPreserving: isArtifactPreservingStateRead() }
	}), { existingOnly: true });
	context.admission.assertCurrent();
	return result ?? missing;
}
/** Read one selected account on the canonical actor; redaction remains caller-owned. */
async function readUserModelAuthProfileAsync(authProfileId, context) {
	const profile = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "authProfiles.personal",
		input: {
			profileId: authProfileId,
			artifactPreserving: isArtifactPreservingStateRead()
		}
	}), { existingOnly: true });
	context.admission.assertCurrent();
	if (profile) registerUserModelAuthProfileSecrets(profile.credential);
	return profile;
}
//#endregion
export { readUserModelAuthProfileAsync as i, prepareAgentAuthProfileRowsRead as n, readSharedAuthProfileRows as r, loadPersistedAuthProfileStoreFromRows as t };
