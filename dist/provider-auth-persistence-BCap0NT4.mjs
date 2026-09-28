import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { h as resolveDefaultSecretProviderAlias, l as isValidEnvSecretRefId } from "./ref-contract-BVi3ykLT.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import "./errors-DnjwnOju.mjs";
import { r as acquireFileLock } from "./file-lock-BmQQ9PQF.mjs";
import "./file-lock-DJoMQumt.mjs";
import { d as writeSecretStoreEntryWithRollback } from "./secret-store-BjhT4Kcc.mjs";
import { E as OAUTH_REFRESH_LOCK_OPTIONS } from "./persisted-B486xwB_.mjs";
import { c as persistAuthProfileBatch } from "./profiles-B-MkhBI8.mjs";
import "./auth-profiles-BFAOd5yW.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/plugins/provider-auth-persistence.ts
const STORE_SCOPE = { kind: "team" };
const STORE_NAME_DIGEST_LENGTH = 24;
const PROVIDER_AUTH_LOCK_OPTIONS = {
	...OAUTH_REFRESH_LOCK_OPTIONS,
	staleRecovery: "fail-closed"
};
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
function rollbackStoreWrites(writes, retainProfileIds) {
	const errors = [];
	for (const write of writes.toReversed()) {
		if (retainProfileIds.has(write.profileId)) continue;
		try {
			if (!write.rollback()) errors.push(/* @__PURE__ */ new Error(`Protected credential rollback lost ownership for profile "${write.profileId}".`));
		} catch (error) {
			errors.push(error);
		}
	}
	if (errors.length > 0) throw new AggregateError(errors, "Could not confirm rollback of protected provider credentials; run openclaw doctor --fix before retrying.");
}
function materializeProviderAuthProfiles(params) {
	const database = { env: params.env };
	const writes = [];
	let outcome = "pending";
	let rollbackFailure;
	const rollback = (retainProfileIds = /* @__PURE__ */ new Set()) => {
		if (outcome === "rolled-back") return;
		if (outcome === "rollback-failed") {
			if (rollbackFailure) throw rollbackFailure;
			throw new Error("Provider auth rollback failed without a recorded error.");
		}
		try {
			rollbackStoreWrites(writes, retainProfileIds);
			outcome = "rolled-back";
		} catch (error) {
			rollbackFailure = toErrorObject(error, "Protected credential rollback failed");
			outcome = "rollback-failed";
			throw rollbackFailure;
		}
	};
	try {
		return {
			profiles: params.profiles.map((profile) => {
				if (!profile.secretStorage) return profile;
				const name = resolveStoreName(profile);
				const credential = profile.credential;
				const value = credential.type === "token" ? credential.token : credential.type === "api_key" ? credential.key : void 0;
				if (typeof value !== "string") throw new Error(`Provider auth profile "${profile.profileId}" requested protected storage without an inline static credential.`);
				registerSecretValueForRedaction(value);
				let write;
				try {
					write = writeSecretStoreEntryWithRollback({
						scope: STORE_SCOPE,
						name,
						value,
						kind: "secret",
						updatedBy: "provider-auth",
						database
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
				return {
					...persistentProfile,
					credential: buildStoredCredential(profile, ref)
				};
			}),
			rollback
		};
	} catch (error) {
		try {
			rollback();
		} catch (rollbackError) {
			throw new AggregateError([error, rollbackError], "Provider credential persistence failed and protected-store rollback could not be confirmed.", { cause: error });
		}
		throw error;
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
async function throwAfterStageFailure(params) {
	const errors = [params.error];
	try {
		await releaseProviderAuthLocks(params.locks);
	} catch (error) {
		errors.push(error);
	}
	if (errors.length > 1) throw new AggregateError(errors, "Provider auth persistence failed and staged state could not be fully released.", { cause: params.error });
	throw params.error;
}
/** Stages protected provider credentials while retaining their per-profile writer locks. */
async function stageProviderAuthProfilesForPersistence(params) {
	const env = resolvePersistenceEnv(params);
	const locks = await acquireProviderAuthLocks(params.profiles, env);
	let prepared;
	try {
		params.beforeWrite?.();
		prepared = materializeProviderAuthProfiles({
			profiles: params.profiles,
			config: params.config,
			env
		});
	} catch (error) {
		return await throwAfterStageFailure({
			error,
			locks
		});
	}
	let outcome = "pending";
	let rollbackFailure;
	let released = false;
	let releaseFailure;
	const release = async () => {
		if (released) {
			if (releaseFailure) throw releaseFailure;
			return;
		}
		released = true;
		try {
			await releaseProviderAuthLocks(locks);
		} catch (error) {
			releaseFailure = toErrorObject(error, "Provider auth persistence lock release failed");
			throw releaseFailure;
		}
	};
	return {
		profiles: prepared.profiles,
		commit: async () => {
			if (outcome === "rolled-back") throw new Error("Cannot commit rolled-back provider auth persistence.");
			if (outcome === "rollback-failed") throw new Error("Cannot commit provider auth persistence after rollback failed.");
			outcome = "committed";
			await release();
		},
		rollback: async (retainProfileIds = /* @__PURE__ */ new Set()) => {
			if (outcome === "committed") {
				await release();
				return;
			}
			if (outcome === "rollback-failed") {
				if (rollbackFailure) throw rollbackFailure;
				throw new Error("Provider auth rollback failed without a recorded error.");
			}
			if (outcome === "pending") {
				let rollbackError;
				try {
					prepared.rollback(retainProfileIds);
				} catch (error) {
					rollbackError = error;
				}
				let releaseError;
				try {
					await release();
				} catch (error) {
					releaseError = error;
				}
				if (rollbackError || releaseError) {
					rollbackFailure = rollbackError && releaseError ? new AggregateError([rollbackError, releaseError], "Protected provider auth rollback failed and its locks could not all be released.", { cause: rollbackError }) : toErrorObject(rollbackError ?? releaseError, "Protected provider auth rollback failed");
					outcome = "rollback-failed";
					throw rollbackFailure;
				}
				outcome = "rolled-back";
				return;
			}
			await release();
		}
	};
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
			beforeWrite: params.beforeWrite
		});
	} catch (error) {
		try {
			await prepared.rollback();
		} catch (rollbackError) {
			throw new AggregateError([error, rollbackError], "Provider auth persistence failed and staged state could not be fully released.", { cause: error });
		}
		throw error;
	}
	let outcome = "pending";
	let rollbackFailure;
	return {
		profiles: prepared.profiles,
		commit: async () => {
			if (outcome === "rolled-back") throw new Error("Cannot commit rolled-back provider auth persistence.");
			if (outcome === "rollback-failed") throw new Error("Cannot commit provider auth persistence after rollback failed.");
			outcome = "committed";
			await prepared.commit();
		},
		rollback: async () => {
			if (outcome === "committed") {
				await prepared.commit();
				return;
			}
			if (outcome === "rollback-failed") {
				if (rollbackFailure) throw rollbackFailure;
				throw new Error("Provider auth rollback failed without a recorded error.");
			}
			if (outcome === "pending") {
				let profileRollbackError;
				let rollbackResult;
				try {
					rollbackResult = persisted.rollback();
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
				if (profileRollbackError && protectedRollbackError) rollbackFailure = new AggregateError([profileRollbackError, protectedRollbackError], "Provider auth profile rollback failed and its protected persistence could not be released.", { cause: profileRollbackError });
				else {
					const failure = profileRollbackError ?? protectedRollbackError;
					rollbackFailure = failure ? toErrorObject(failure, "Provider auth rollback failed") : void 0;
				}
				if (rollbackFailure) {
					outcome = "rollback-failed";
					throw rollbackFailure;
				}
				outcome = "rolled-back";
				return;
			}
			await prepared.rollback();
		}
	};
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
