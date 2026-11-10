import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { o as inspectDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { p as runSqliteReadOnlyWorker } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { _ as AuthProfileStoreUnreadableError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { n as getActiveOpenClawStateDatabaseReadSnapshot, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { i as captureAuthProfileFileIdentity } from "./file-state-CTXmtyL_.mjs";
import { r as captureAuthProfileCredentialAuthority } from "./user-model-account-authority-DFFjC5J5.mjs";
import { o as mergePersistedAuthProfileState } from "./persisted-DbIYEoQ3.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as runtimeAuthProfileRowsCache } from "./runtime-persisted-rows-B3SUt7CF.mjs";
import { p as registerUserModelAuthProfileSecrets } from "./user-model-accounts-CrjNQiMH.mjs";
import { t as receiveAuthProfileUpdateValue } from "./store-update-transfer-2J4RGKmB.mjs";
import path from "node:path";
import { MessagePort, isMainThread } from "node:worker_threads";
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
	const uncached = options.databaseIdentity !== void 0 || isArtifactPreservingStateRead() || captured.ok && Boolean(captured.value.maintenanceScope);
	let fileState;
	let identity;
	try {
		fileState = uncached ? void 0 : captureAuthProfileFileIdentity(databasePath);
		identity = options.databaseIdentity ?? (fileState ? fileState.identity : inspectDatabasePathIdentitySync(databasePath));
	} catch {
		identity = void 0;
	}
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
		if (identity?.key.startsWith("file:")) {
			if (fileState) fileState.assertCurrent();
			else {
				const current = inspectDatabasePathIdentitySync(databasePath);
				if (current?.key !== identity.key || current.birthtime !== identity.birthtime) throw new Error("Auth profile database file identity changed");
			}
		}
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
	const readRows = async () => {
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
	};
	const cachedReader = isMainThread && options.source !== "canonical" && !uncached && !getActiveOpenClawStateDatabaseReadSnapshot({ env }) ? runtimeAuthProfileRowsCache.prepare(databasePath, {
		identity: identity && `${identity.key}:${identity.birthtime ?? ""}`,
		read: readRows,
		assertCurrent
	}) : { read: readRows };
	const read = () => {
		if (closed) return Promise.reject(/* @__PURE__ */ new Error("Auth profile read owner closed"));
		const operation = cachedReader.read();
		pending.add(operation);
		operation.finally(() => pending.delete(operation)).catch(() => void 0);
		return operation;
	};
	return {
		identity: identity && `${identity.key}:${identity.birthtime ?? ""}`,
		captureCredentialAuthority(profileId) {
			if (!captured.ok) throw captured.error;
			return identity ? captureAuthProfileCredentialAuthority(captured.value, {
				identity: `${identity.key}:${identity.birthtime ?? ""}`,
				databasePath
			}, profileId) : void 0;
		},
		read,
		assertCurrent,
		dispose
	};
}
/** Shared auth reads reuse the canonical actor and never request a writable open. */
async function readSharedAuthProfileRows(context, artifactPreserving = isArtifactPreservingStateRead(), source = "runtime") {
	const read = () => readSharedAuthProfileRowsUncached(context, artifactPreserving);
	if (!isMainThread || source === "canonical" || artifactPreserving || context.maintenanceScope || getActiveOpenClawStateDatabaseReadSnapshot({ env: context.environment })) return read();
	return runtimeAuthProfileRowsCache.prepare(context.admission.databasePath, {
		identity: `${context.admission.identity.key}:${context.admission.identity.birthtime ?? ""}`,
		read,
		assertCurrent: () => context.admission.assertCurrent()
	}).read();
}
async function readSharedAuthProfileRowsUncached(context, artifactPreserving) {
	let rows;
	const assertCurrent = () => {
		context.admission.assertCurrent();
		context.maintenanceScope?.assertAdmission();
	};
	const result = await runOpenClawStateWorkerOperation(context, async (scope) => {
		await scope.execute({
			type: "authProfiles.read",
			input: { artifactPreserving }
		});
		return true;
	}, {
		existingOnly: true,
		createAdmission: () => ({
			nativeLocations: [context.admission.databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				const facts = request.facts;
				if (!isRecord(facts) || !(facts.port instanceof MessagePort)) throw new Error("Auth profile read returned no field transport");
				try {
					assertCurrent();
					if (request.stage !== "prepare" || facts.kind !== "auth-store-read" || rows) throw new Error("Auth profile read requested an invalid field transfer");
					const value = receiveAuthProfileUpdateValue(facts.port);
					if (!isRecord(value) || !isInspection(value.store) || !isInspection(value.state) || typeof value.cacheable !== "boolean") throw new Error("Auth profile reader returned invalid inspection rows");
					rows = {
						store: value.store,
						state: value.state,
						cacheable: value.cacheable
					};
					assertCurrent();
					if (!grant()) throw new Error("Auth profile read authority expired");
				} finally {
					facts.port.close();
				}
			})
		})
	});
	assertCurrent();
	if (result && !rows) throw new Error("Auth profile read completed without its rows");
	return rows ?? missing;
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
/** Read links and their selected credentials with one shared-reader freshness probe. */
async function readPersonalCatalogProfiles(selection, context) {
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "userModelAccounts.catalog",
		selection
	}, {
		context,
		current: true,
		preferIndependentWarmRead: true
	});
	context.admission.assertCurrent();
	const result = reply?.catalog;
	for (const profile of Object.values(result?.profiles ?? {})) registerUserModelAuthProfileSecrets(profile.credential);
	return result ?? {
		links: [],
		profiles: {}
	};
}
//#endregion
export { readUserModelAuthProfileAsync as a, readSharedAuthProfileRows as i, prepareAgentAuthProfileRowsRead as n, readPersonalCatalogProfiles as r, loadPersistedAuthProfileStoreFromRows as t };
