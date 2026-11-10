import { d as toErrorObject, t as ProviderAuthPersistenceError } from "./error-coercion-BwMr25F8.mjs";
import { h as resolveDefaultSecretProviderAlias, l as isValidEnvSecretRefId } from "./ref-contract-Bfd9_-Lp.mjs";
import "./types.secrets-Dgbd2kyP.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import "./errors-DPfGDWk1.mjs";
import { V as OAUTH_REFRESH_LOCK_OPTIONS } from "./user-model-account-authority-DFFjC5J5.mjs";
import { r as acquireFileLock } from "./file-lock-BmWJVvRa.mjs";
import "./file-lock-BMq7QYoB.mjs";
import { p as writeSecretStoreEntryWithRollback } from "./secret-store-d5UF_g7X.mjs";
import { l as persistAuthProfileBatch } from "./profiles-Df1OQ7iN.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { createHash } from "node:crypto";
import path from "node:path";
//#region src/plugins/provider-auth-persistence.ts
const STORE_SCOPE = { kind: "team" };
const STORE_NAME_DIGEST_LENGTH = 24;
const PROVIDER_AUTH_LOCK_OPTIONS = {
	...OAUTH_REFRESH_LOCK_OPTIONS,
	staleRecovery: "fail-closed"
};
/** Own commit fencing and one-shot compensation for both persistence stages. */
function createProviderAuthPersistenceReceipt(profiles, commit, rollback) {
	let outcome = "pending";
	let rollbackPromise;
	return {
		profiles,
		commit: async () => {
			if (rollbackPromise) await rollbackPromise.catch(() => void 0);
			if (outcome === "rolled-back") throw new Error("Cannot commit rolled-back provider auth persistence.");
			if (outcome === "rollback-failed") throw new Error("Cannot commit provider auth persistence after rollback failed.");
			outcome = "committed";
			await commit();
		},
		rollback: (retainProfileIds) => rollbackPromise ??= outcome === "committed" ? commit() : rollback(retainProfileIds).then(() => {
			outcome = "rolled-back";
		}, (error) => {
			outcome = "rollback-failed";
			throw error;
		})
	};
}
async function failProviderAuthPersistence(error, cleanup, message) {
	try {
		await cleanup();
	} catch (cause) {
		throw new ProviderAuthPersistenceError(message, error, { cause });
	}
	throw error;
}
function resolveProfileDigest(profile) {
	return createHash("sha256").update(profile.credential.provider).update("\0").update(profile.profileId).digest("hex");
}
function resolveStoreName(profile) {
	const storage = profile.secretStorage;
	if (!storage) throw new Error("Provider auth profile does not request protected secret storage.");
	const name = `${storage.namePrefix.trim()}_${resolveProfileDigest(profile).slice(0, STORE_NAME_DIGEST_LENGTH).toUpperCase()}`;
	if (!isValidEnvSecretRefId(name)) throw new Error("Provider auth secret-store name prefix must produce a valid environment-style name.");
	return name;
}
function buildStoredCredential(profile, ref) {
	const credential = profile.credential;
	if (credential.type === "token" && typeof credential.token === "string") {
		const { token: _token, ...withoutToken } = credential;
		return {
			...withoutToken,
			tokenRef: ref
		};
	}
	if (credential.type === "api_key" && typeof credential.key === "string") {
		const { key: _key, ...withoutKey } = credential;
		return {
			...withoutKey,
			keyRef: ref
		};
	}
	throw new Error(`Provider auth profile "${profile.profileId}" requested protected storage without an inline static credential.`);
}
async function rollbackStoreWrites(writes, retainProfileIds) {
	const errors = [];
	for (const write of writes.toReversed()) {
		if (retainProfileIds.has(write.profileId)) continue;
		try {
			if (!await write.rollback()) errors.push(/* @__PURE__ */ new Error(`Protected credential rollback lost ownership for profile "${write.profileId}".`));
		} catch (error) {
			errors.push(error);
		}
	}
	if (errors.length > 0) throw new AggregateError(errors, "Could not confirm rollback of protected provider credentials; run openclaw doctor --fix before retrying.");
}
async function materializeProviderAuthProfiles(params) {
	const database = { env: params.env };
	const writes = [];
	const rollback = (retainProfileIds = /* @__PURE__ */ new Set()) => rollbackStoreWrites(writes, retainProfileIds);
	try {
		const profiles = [];
		for (const profile of params.profiles) {
			if (!profile.secretStorage) {
				profiles.push(profile);
				continue;
			}
			const name = resolveStoreName(profile);
			const credential = profile.credential;
			const value = credential.type === "token" ? credential.token : credential.type === "api_key" ? credential.key : void 0;
			if (typeof value !== "string") throw new Error(`Provider auth profile "${profile.profileId}" requested protected storage without an inline static credential.`);
			registerSecretValueForRedaction(value);
			let write;
			try {
				write = await writeSecretStoreEntryWithRollback({
					scope: STORE_SCOPE,
					name,
					value,
					kind: "secret",
					updatedBy: "provider-auth",
					database,
					assertCurrent: params.beforeWrite
				});
			} catch (error) {
				throw new Error("Could not write the protected secret store. Check the OpenClaw state-directory permissions and retry; the auth profile was not changed.", { cause: error });
			}
			writes.push({
				profileId: profile.profileId,
				rollback: write.rollback
			});
			const ref = {
				source: "store",
				provider: resolveDefaultSecretProviderAlias(params.config, "store", { preferFirstProviderForSource: true }),
				id: name
			};
			const { secretStorage: _secretStorage, ...persistentProfile } = profile;
			profiles.push({
				...persistentProfile,
				credential: buildStoredCredential(profile, ref)
			});
		}
		return {
			profiles,
			rollback
		};
	} catch (error) {
		return await failProviderAuthPersistence(error, rollback, "Provider credential persistence failed and protected-store rollback could not be confirmed.");
	}
}
function resolvePersistenceEnv(params) {
	return params.stateDir ? {
		...params.env ?? process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	} : params.env ?? process.env;
}
async function acquireProviderAuthLocks(profiles, env) {
	const lockTargets = [...new Map(profiles.map((profile) => [`${profile.credential.provider}\0${profile.profileId}`, path.join(resolveStateDir(env), "locks", "provider-auth-persistence", `lock-${resolveProfileDigest(profile)}`)])).values()].toSorted((left, right) => left.localeCompare(right));
	const locks = [];
	try {
		for (const target of lockTargets) locks.push(await acquireFileLock(target, PROVIDER_AUTH_LOCK_OPTIONS));
		return locks;
	} catch (error) {
		const releaseErrors = [];
		for (const lock of locks.toReversed()) try {
			await lock.release();
		} catch (releaseError) {
			releaseErrors.push(releaseError);
		}
		if (releaseErrors.length > 0) throw new AggregateError([error, ...releaseErrors], "Provider auth lock acquisition failed and acquired locks could not all be released.", { cause: error });
		throw error;
	}
}
async function releaseProviderAuthLocks(locks) {
	const errors = [];
	for (const lock of locks.toReversed()) try {
		await lock.release();
	} catch (error) {
		errors.push(error);
	}
	if (errors.length > 0) throw new AggregateError(errors, "Provider auth persistence locks could not all be released.");
}
/** Stages protected provider credentials while retaining their per-profile writer locks. */
async function stageProviderAuthProfilesForPersistence(params) {
	const env = { ...resolvePersistenceEnv(params) };
	const locks = await acquireProviderAuthLocks(params.profiles, env);
	let prepared;
	try {
		params.beforeWrite?.();
		prepared = await materializeProviderAuthProfiles({
			profiles: params.profiles,
			config: params.config,
			env,
			beforeWrite: params.beforeWrite
		});
	} catch (error) {
		return await failProviderAuthPersistence(error, () => releaseProviderAuthLocks(locks), "Provider auth persistence failed and staged state could not be fully released.");
	}
	let releasePromise;
	const release = () => releasePromise ??= releaseProviderAuthLocks(locks);
	return createProviderAuthPersistenceReceipt(prepared.profiles, release, async (retainProfileIds) => {
		let rollbackError;
		try {
			await prepared.rollback(retainProfileIds);
		} catch (error) {
			rollbackError = error;
		}
		let releaseError;
		try {
			await release();
		} catch (error) {
			releaseError = error;
		}
		if (rollbackError || releaseError) throw rollbackError && releaseError ? new AggregateError([rollbackError, releaseError], "Protected provider auth rollback failed and its locks could not all be released.", { cause: rollbackError }) : toErrorObject(rollbackError ?? releaseError, "Protected provider auth rollback failed");
	});
}
async function stageProviderAuthProfileBatchCore(params) {
	const prepared = await stageProviderAuthProfilesForPersistence(params);
	let persisted;
	try {
		persisted = await persistAuthProfileBatch({
			profiles: prepared.profiles,
			...params.order ? { order: params.order } : {},
			...params.agentDir ? { agentDir: params.agentDir } : {},
			...params.stateDir ? { stateDir: params.stateDir } : {},
			...params.resetFailureState ? { resetFailureState: true } : {},
			allowOAuthGenerationReplacement: true,
			beforeWrite: params.beforeWrite,
			validateCurrentCredential: params.validateCurrentCredential
		});
	} catch (error) {
		return await failProviderAuthPersistence(error, prepared.rollback, "Provider auth persistence failed and staged state could not be fully released.");
	}
	return createProviderAuthPersistenceReceipt(prepared.profiles, prepared.commit, async () => {
		let profileRollbackError;
		let rollbackResult;
		try {
			rollbackResult = await persisted.rollback();
		} catch (error) {
			profileRollbackError = error;
		}
		let protectedRollbackError;
		try {
			if (rollbackResult) await prepared.rollback(rollbackResult.unrevertedProfileIds);
			else await prepared.commit();
		} catch (error) {
			protectedRollbackError = error;
		}
		if (profileRollbackError && protectedRollbackError) throw new AggregateError([profileRollbackError, protectedRollbackError], "Provider auth profile rollback failed and its protected persistence could not be released.", { cause: profileRollbackError });
		const failure = profileRollbackError ?? protectedRollbackError;
		if (failure) throw toErrorObject(failure, "Provider auth rollback failed");
	});
}
/** Stages provider auth until its owning config publication commits or rolls back. */
async function stageProviderAuthProfileBatch(params) {
	return await stageProviderAuthProfileBatchCore(params);
}
/** Persists provider auth with no later config-coupled rollback boundary. */
async function persistProviderAuthProfileBatch(params) {
	const staged = await stageProviderAuthProfileBatchCore(params);
	await staged.commit();
	return staged.profiles;
}
/** Commits completed login credentials and clears only those profiles' failure state. */
async function persistProviderAuthProfilesAfterLogin(params) {
	const staged = await stageProviderAuthProfileBatchCore({
		...params,
		resetFailureState: true
	});
	await staged.commit();
	return staged.profiles;
}
//#endregion
export { persistProviderAuthProfilesAfterLogin as n, stageProviderAuthProfileBatch as r, persistProviderAuthProfileBatch as t };
