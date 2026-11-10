import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { g as coercePersistedAuthProfileStore } from "./user-model-account-authority-DFFjC5J5.mjs";
import { n as evaluateStoredCredentialEligibility } from "./credential-state-NmgqOc1o.mjs";
import "./persisted-DbIYEoQ3.mjs";
import { p as withSqliteWorkerCleanupFailure } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { _ as resolveAuthProfileDatabaseOwnerId, a as inspectPersistedAuthProfileStoreRaw, f as readPersistedAuthProfileStateRaw, v as resolveAuthProfileDatabasePath, z as prepareSharedAuthStoreOwnershipForNative } from "./sqlite-BlFpr2YD.mjs";
import { d as resolveSharedAuthStorePath, f as resolveSharedMainAuthAgentDir, u as resolveSharedAuthStoreOwnershipAsync } from "./path-resolve-21Orzn6B.mjs";
import { s as hasLegacyAuthProfileCredentialSource } from "./legacy-source-diagnostic-CLlkIevG.mjs";
import { d as getRuntimeAuthProfileStoreSnapshotCore, g as hasRuntimeAuthProfileStoreSource, h as hasAnyRuntimeAuthProfileStoreSource } from "./runtime-snapshots-HRosak4u.mjs";
import { i as readSharedAuthProfileRows, n as prepareAgentAuthProfileRowsRead } from "./sqlite-read-BnaiPHv1.mjs";
import path from "node:path";
//#region src/agents/auth-profiles/operation-cleanup.ts
/** Settle owned work before cleanup; the caller retains its failure and commit policy. */
async function withAuthProfileCleanup(operation, cleanup) {
	let outcome;
	try {
		outcome = {
			ok: true,
			value: await operation()
		};
	} catch (error) {
		outcome = {
			ok: false,
			error
		};
	}
	await cleanup(outcome);
	if (!outcome.ok) throw outcome.error;
	return outcome.value;
}
//#endregion
//#region src/agents/auth-profiles/source-check.ts
/**
* Auth-profile source probes for runtime and persisted stores.
* Source presence selects the canonical loader; it does not resolve credentials.
*/
function storeHasProviderProfile(store, provider, profileIds) {
	const profiles = store?.profiles;
	if (!profiles) return false;
	const expected = normalizeLowercaseStringOrEmpty(provider);
	return (profileIds?.map((profileId) => profiles[profileId]) ?? Object.values(profiles)).some((credential) => credential !== void 0 && normalizeLowercaseStringOrEmpty(credential.provider) === expected && evaluateStoredCredentialEligibility({ credential }).eligible);
}
function canonicalStoreOwnsProviderRoute(agentDir, provider, profileIds) {
	const inspection = inspectPersistedAuthProfileStoreRaw(agentDir);
	if (inspection.status === "missing") return false;
	const store = inspection.status === "readable" ? coercePersistedAuthProfileStore(inspection.raw) : null;
	return !store || storeHasProviderProfile(store, provider, profileIds);
}
/** Synchronous Doctor/CLI and released coding-tool construction compatibility. */
function hasAnyAuthProfileStoreSource(agentDir) {
	prepareSharedAuthStoreOwnershipForNative();
	if (hasLocalAuthProfileStoreSource(agentDir) || hasAnyRuntimeAuthProfileStoreSource(agentDir)) return true;
	const authPath = agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath();
	const mainAuthPath = resolveSharedAuthStorePath();
	return Boolean(agentDir && authPath !== mainAuthPath && (hasLegacyAuthProfileCredentialSource(void 0) || inspectPersistedAuthProfileStoreRaw(void 0).status !== "missing" || readPersistedAuthProfileStateRaw(void 0)));
}
/** Runtime source detection retains the existing readers through classification and cleanup. */
async function hasAnyAuthProfileStoreSourceAsync(agentDir, reader) {
	const env = cloneEnvWithPlatformSemantics(process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const localPath = agentDir ? resolveAuthProfileDatabasePath(agentDir) : void 0;
	const localDir = localPath ? path.dirname(localPath) : void 0;
	if (localDir && (hasRuntimeAuthProfileStoreSource(localDir, env) || hasLegacyAuthProfileCredentialSource(localDir, env))) return true;
	const context = captureOpenClawStateWorkerContext({ env });
	const legacySharedPath = resolveAuthProfileDatabasePath(resolveSharedMainAuthAgentDir(env));
	const paths = [.../* @__PURE__ */ new Set([legacySharedPath, ...localPath ? [localPath] : []])];
	const cohortPath = reader && path.resolve(resolveStateDir(reader.database.env)) === path.resolve(resolveStateDir(env)) ? paths.find((databasePath) => path.resolve(databasePath) === path.resolve(reader.database.path) && resolveAuthProfileDatabaseOwnerId(path.dirname(databasePath)) === reader.database.agentId) : void 0;
	const readers = new Map(paths.filter((databasePath) => databasePath !== cohortPath).map((databasePath) => [databasePath, prepareAgentAuthProfileRowsRead({
		databasePath,
		agentId: resolveAuthProfileDatabaseOwnerId(path.dirname(databasePath)),
		env
	})]));
	const usedReaders = /* @__PURE__ */ new Set();
	let usedShared = false;
	let usedCohort = false;
	const hasSource = (rows) => rows.store.status !== "missing" || rows.state.status === "readable" && Boolean(rows.state.raw);
	const assertCohortCurrent = () => {
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
		reader?.assertCurrent();
	};
	const readAgentSource = async (databasePath) => {
		if (reader && databasePath === cohortPath) {
			usedCohort = true;
			return reader.withRead({
				sessionKeys: [reader.sessionKey],
				snapshotFields: [],
				includeAuthProfileSource: true
			}, assertCohortCurrent, (read) => {
				if (typeof read.authProfileSource !== "boolean") throw new Error("Session cohort returned no auth source presence");
				return read.authProfileSource;
			});
		}
		const source = readers.get(databasePath);
		usedReaders.add(source);
		return hasSource(await source.read());
	};
	const readSource = async () => {
		if (localPath && await readAgentSource(localPath)) return true;
		usedShared = true;
		const ownership = await resolveSharedAuthStoreOwnershipAsync(context);
		if (localDir && hasRuntimeAuthProfileStoreSource(localDir, env) || hasRuntimeAuthProfileStoreSource(void 0, env)) return true;
		const sharedPath = ownership.location === "state-db" ? context.admission.databasePath : legacySharedPath;
		if (localPath === sharedPath) return false;
		if (hasLegacyAuthProfileCredentialSource(void 0, env)) return true;
		return ownership.location === "state-db" ? hasSource(await readSharedAuthProfileRows(context)) : readAgentSource(sharedPath);
	};
	const result = await withAuthProfileCleanup(readSource, async (outcome) => {
		const failures = (await Promise.allSettled([...readers.values()].map((source) => source.dispose()))).flatMap((entry) => entry.status === "rejected" ? [entry.reason] : []);
		if (failures.length) {
			const error = failures.length === 1 ? failures[0] : new AggregateError(failures, "Auth source reader cleanup failed", { cause: failures[0] });
			throw outcome.ok ? error : withSqliteWorkerCleanupFailure(toErrorObject(outcome.error, "Auth source read failed"), error);
		}
	});
	for (const source of usedReaders) source.assertCurrent();
	if (usedCohort) assertCohortCurrent();
	if (usedShared) {
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
	}
	return result;
}
/** Returns true when the requested agent dir has a local auth profile source. */
function hasLocalAuthProfileStoreSource(agentDir) {
	prepareSharedAuthStoreOwnershipForNative();
	return hasRuntimeAuthProfileStoreSource(agentDir) || hasLegacyAuthProfileCredentialSource(agentDir) || inspectPersistedAuthProfileStoreRaw(agentDir).status !== "missing" || Boolean(readPersistedAuthProfileStateRaw(agentDir));
}
/** Returns true when a read-only auth-profile source contains a profile for a provider. */
function hasAuthProfileStoreSourceForProvider(provider, agentDir, options) {
	if (!normalizeLowercaseStringOrEmpty(provider)) return false;
	const profileIds = options?.profileIds;
	if (profileIds?.length === 0) return false;
	prepareSharedAuthStoreOwnershipForNative();
	const ownsProvider = (ownerAgentDir) => storeHasProviderProfile(coercePersistedAuthProfileStore(getRuntimeAuthProfileStoreSnapshotCore(ownerAgentDir)), provider, profileIds) || hasLegacyAuthProfileCredentialSource(ownerAgentDir) || canonicalStoreOwnsProviderRoute(ownerAgentDir, provider, profileIds);
	return ownsProvider(agentDir) || Boolean(agentDir) && ownsProvider(void 0);
}
//#endregion
export { withAuthProfileCleanup as a, hasLocalAuthProfileStoreSource as i, hasAnyAuthProfileStoreSourceAsync as n, hasAuthProfileStoreSourceForProvider as r, hasAnyAuthProfileStoreSource as t };
