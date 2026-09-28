import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as isErrno } from "./errno-CkbDOfLk.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { E as listAgentEntries, a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import "./session-key-CBvmC8zz.mjs";
import "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { s as withFileLock } from "./file-lock-BmQQ9PQF.mjs";
import "./file-lock-DJoMQumt.mjs";
import { a as resolveOAuthRefreshLockPath, c as resolveSharedAuthStorePath, l as resolveSharedMainAuthAgentDir } from "./path-resolve-Bm8Ih2d_.mjs";
import { f as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CaQAStOA.mjs";
import { i as listOpenClawRegisteredAgentDatabases } from "./openclaw-agent-db-registry-listing-CHFiKgU_.mjs";
import { _ as runAuthProfileWriteTransaction, a as inspectPersistedAuthProfileStoreRaw, h as resolveAuthProfileDatabasePath, i as inspectPersistedAuthProfileStateRaw, n as deletePersistedAuthProfileStoreRaw, y as writePersistedAuthProfileStateRaw } from "./sqlite-BIg_k8qE.mjs";
import { i as isUserModelAuthProfileId } from "./profile-usage-stats-Uo3hJqOO.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import { E as OAUTH_REFRESH_LOCK_OPTIONS, _ as getRuntimeExternalCliProfileIds, a as loadPersistedAuthProfileStore, b as removeRuntimeExternalProfileReferences, o as loadPersistedAuthProfileStoreAtDatabasePath, p as buildPersistedAuthProfileState, s as loadPersistedSharedAuthProfileStore } from "./persisted-B486xwB_.mjs";
import { d as isSameOAuthRefreshGeneration, l as isOAuthRefreshFence, r as hasUsableOAuthCredential, s as createFailedOAuthRefreshFence } from "./credential-state-CWZ_V0ds.mjs";
import { n as hasMatchingOAuthIdentity, r as hasOAuthIdentity } from "./oauth-shared-CVbJLd-k.mjs";
import { a as findPersistedAuthProfileCredential, d as resolvePersistedAuthProfileOwnerAgentDir, f as resolveRuntimeAuthProfileAgentDir, u as isSharedMainAuthProfileAgentDir, w as isPersistedExternalCliAuthProfile } from "./store-CTvq6MSF.mjs";
import { B as isExactOAuthCredential } from "./runtime-snapshots-CBozwlR0.mjs";
import { f as dedupeProfileIds, p as listProfilesForProvider } from "./order-BQhYF772.mjs";
import { u as resetAuthProfileFailureState } from "./usage-state-Bm5iXGhR.mjs";
import { f as saveAuthProfileStoreWithPreparedOwner, l as loadAuthProfileStoreWithoutExternalProfiles, p as updateAuthProfileStoreWithLock, r as ensureAuthProfileStoreForLocalUpdate, u as saveAuthProfileStore } from "./store-runtime-CzCVI_rv.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/agents/auth-profiles/paths.ts
/**
* Public path barrel for auth-profile stores.
* Import through this file for canonical SQLite display and lock paths.
*/
/** Resolve the user-facing path for the database selected by the auth store loader. */
function resolveAuthStorePathForDisplay(agentDir) {
	const pathname = agentDir && inspectPersistedAuthProfileStoreRaw(agentDir).status !== "missing" ? path.join(resolveUserPath(agentDir), "openclaw-agent.sqlite") : resolveSharedAuthStorePath();
	return pathname.startsWith("~") ? pathname : resolveUserPath(pathname);
}
/** Retained name for callers that present auth runtime state from the same selected store. */
function resolveAuthStatePathForDisplay(agentDir) {
	return resolveAuthStorePathForDisplay(agentDir);
}
//#endregion
//#region src/agents/auth-profiles/oauth-profile-lock.ts
/** Serialize every mutation that can create, consume, or remove one OAuth generation. */
async function withOAuthProfileLock(key, operation, options) {
	return await withFileLock(resolveOAuthRefreshLockPath(key.provider, key.profileId, options?.env), OAUTH_REFRESH_LOCK_OPTIONS, operation);
}
/** Acquire multiple profile locks in stable order to avoid cross-profile deadlocks. */
async function withOAuthProfileLocks(keys, operation, options) {
	const ordered = [...new Map(keys.map((key) => [`${key.provider}\0${key.profileId}`, key])).values()].toSorted((left, right) => left.provider.localeCompare(right.provider) || left.profileId.localeCompare(right.profileId));
	const enter = async (index) => {
		const key = ordered[index];
		return key ? await withOAuthProfileLock(key, async () => await enter(index + 1), options) : await operation();
	};
	return await enter(0);
}
//#endregion
//#region src/agents/auth-profiles/candidate-stores.ts
function canonicalizeDatabasePath(databasePath) {
	return resolvePathViaExistingAncestorSync(path.resolve(databasePath));
}
async function collectStateRootCandidates(env) {
	const agentsRoot = path.join(resolveStateDir(env), "agents");
	let entries;
	try {
		entries = await fs.readdir(agentsRoot, { withFileTypes: true });
	} catch (error) {
		if (isErrno(error) && error.code === "ENOENT") return [];
		throw error;
	}
	return entries.filter((entry) => entry.isDirectory() || entry.isSymbolicLink()).map((entry) => {
		const agentId = normalizeAgentId(entry.name);
		const agentDir = path.join(agentsRoot, entry.name, "agent");
		return {
			agentId,
			agentDir,
			databasePath: resolveAuthProfileDatabasePath(agentDir)
		};
	});
}
/**
* Discover every auth-capable agent database once by canonical filesystem
* identity. Registered paths cover custom database locations that cannot be
* reconstructed from an agent directory.
*/
async function listCandidateAuthProfileStores(params) {
	const env = params.env ?? process.env;
	const sources = [];
	for (const entry of listAgentEntries(params.cfg)) {
		const id = entry.id?.trim();
		if (!id) continue;
		const agentId = normalizeAgentId(id);
		const agentDir = path.resolve(resolveAgentDir(params.cfg, agentId, env));
		sources.push({
			agentId,
			agentDir,
			databasePath: resolveAuthProfileDatabasePath(agentDir)
		});
	}
	sources.push(...await collectStateRootCandidates(env));
	for (const registered of listOpenClawRegisteredAgentDatabases({ env })) sources.push({
		agentId: normalizeAgentId(registered.agentId),
		databasePath: registered.path
	});
	const candidates = /* @__PURE__ */ new Map();
	for (const source of sources) {
		const databasePath = canonicalizeDatabasePath(source.databasePath);
		const agentDir = source.agentDir ?? path.dirname(databasePath);
		if (!candidates.has(databasePath)) candidates.set(databasePath, {
			agentId: source.agentId,
			agentDir,
			databasePath,
			env
		});
	}
	return [...candidates.values()].toSorted((left, right) => left.databasePath.localeCompare(right.databasePath));
}
/** Read an already-discovered candidate without creating a missing database. */
function loadCandidateAuthProfileStore(candidate) {
	return loadPersistedAuthProfileStoreAtDatabasePath(candidate.databasePath, "agent");
}
/**
* Update one exact candidate database in a single synchronous SQLite
* transaction. Callers serialize candidates externally; this never holds two
* database transactions at once.
*/
function updateCandidateAuthProfileStore(params) {
	return runOpenClawAgentWriteTransaction((database) => {
		const store = loadPersistedAuthProfileStore(params.candidate.agentDir, { database }) ?? {
			version: 1,
			profiles: {}
		};
		const changed = params.updater(store);
		if (changed) {
			const profileIds = [params.profileId];
			saveAuthProfileStore(store, params.candidate.agentDir, {
				filterExternalAuthProfiles: false,
				syncExternalCli: false,
				...params.preserveProfileState ? {
					preserveOrderProfileIds: profileIds,
					preserveStateProfileIds: profileIds
				} : {}
			}, database);
		}
		return {
			changed,
			store
		};
	}, {
		agentId: params.candidate.agentId,
		env: params.candidate.env,
		path: params.candidate.databasePath
	});
}
//#endregion
//#region src/agents/auth-profiles/oauth-refresh-peers.ts
var OAuthRefreshPeerFenceError = class extends Error {
	constructor(claims, cause) {
		super("Failed to fence every historical OAuth refresh peer.", { cause });
		this.name = "OAuthRefreshPeerFenceError";
		this.claims = claims;
	}
};
function canonicalDatabasePath(databasePath) {
	return resolvePathViaExistingAncestorSync(databasePath);
}
function isExternalProfileOwned(store, profileId, credential) {
	if (store.runtimeExternalProfileIds?.includes(profileId) === true || getRuntimeExternalCliProfileIds(store).includes(profileId)) return true;
	return isPersistedExternalCliAuthProfile({
		profileId,
		credential
	});
}
function isEligibleHistoricalOAuthPeer(params) {
	return !isUserModelAuthProfileId(params.profileId) && params.credential.provider === params.generation.provider && params.credential.copyToAgents !== true && params.credential.oauthRef === void 0 && !isExternalProfileOwned(params.store, params.profileId, params.credential) && isSameOAuthRefreshGeneration({
		profileId: params.profileId,
		left: params.credential,
		right: params.generation
	});
}
function assertCredentialAllowsClaim(params) {
	if (!isSameOAuthRefreshGeneration({
		profileId: params.profileId,
		left: params.credential,
		right: params.generation
	})) return;
	if (isOAuthRefreshFence(params.credential)) throw new Error(`OAuth refresh generation is already claimed by another owner: ${params.candidate.databasePath}`);
	if (!isExternalProfileOwned(params.store, params.profileId, params.credential)) return;
	throw new Error(`OAuth refresh generation is still owned by an external credential source: ${params.candidate.databasePath}`);
}
function isRemovableOAuthRefreshPeer(params) {
	return isOAuthRefreshFence(params.generation) && isExactOAuthCredential(params.credential, params.generation) || isEligibleHistoricalOAuthPeer(params);
}
async function listPeerCandidates(params) {
	const ownerDatabasePath = canonicalDatabasePath(params.ownerDatabasePath);
	return (await listCandidateAuthProfileStores(params)).filter((candidate) => candidate.databasePath !== ownerDatabasePath);
}
/**
* Replace every provable historical peer generation with the owner's exact
* pending fence. Reads and writes are sequential, so no two databases share a
* transaction.
*/
async function fenceOAuthRefreshPeers(params) {
	const claims = [];
	try {
		for (const candidate of await listPeerCandidates(params)) {
			const store = loadCandidateAuthProfileStore(candidate);
			if (!store) continue;
			const credential = store?.profiles[params.profileId];
			if (credential?.type !== "oauth") continue;
			if (isExactOAuthCredential(credential, params.fence)) {
				params.onFence?.(candidate.databasePath);
				claims.push({ candidate });
				continue;
			}
			assertCredentialAllowsClaim({
				candidate,
				store,
				profileId: params.profileId,
				credential,
				generation: params.generation
			});
			if (!isEligibleHistoricalOAuthPeer({
				store,
				profileId: params.profileId,
				credential,
				generation: params.generation
			})) continue;
			let claimed = false;
			const original = { ...credential };
			const releaseUnclaimedObservation = params.onFence?.(candidate.databasePath);
			const updated = updateCandidateAuthProfileStore({
				candidate,
				profileId: params.profileId,
				updater: (currentStore) => {
					const current = currentStore.profiles[params.profileId];
					if (!isExactOAuthCredential(current?.type === "oauth" ? current : void 0, original)) return false;
					currentStore.profiles[params.profileId] = { ...params.fence };
					claimed = true;
					return true;
				}
			});
			if (!claimed) {
				const current = updated.store.profiles[params.profileId];
				if (isExactOAuthCredential(current?.type === "oauth" ? current : void 0, params.fence)) {
					claims.push({ candidate });
					continue;
				}
				releaseUnclaimedObservation?.();
				if (current?.type === "oauth") {
					assertCredentialAllowsClaim({
						candidate,
						store: updated.store,
						profileId: params.profileId,
						credential: current,
						generation: params.generation
					});
					if (isEligibleHistoricalOAuthPeer({
						store: updated.store,
						profileId: params.profileId,
						credential: current,
						generation: params.generation
					})) throw new Error(`OAuth refresh peer changed before it could be fenced: ${candidate.databasePath}`);
				}
				continue;
			}
			claims.push({
				candidate,
				original
			});
		}
		return claims;
	} catch (error) {
		if (params.rollbackOnFailure !== false) {
			try {
				rollbackOAuthRefreshPeerClaims({
					profileId: params.profileId,
					fence: params.fence,
					claims
				});
			} catch (rollbackError) {
				throw new AggregateError([error, rollbackError], "Failed to fence every historical OAuth refresh peer and roll back partial claims.", { cause: error });
			}
			throw error;
		}
		throw new OAuthRefreshPeerFenceError(claims, error);
	}
}
/** Restore pre-I/O peer claims; a retained fence becomes terminal on restore failure. */
function rollbackOAuthRefreshPeerClaims(params) {
	const unresolved = [];
	for (const claim of params.claims.toReversed()) {
		if (!claim.original) continue;
		let restoreError;
		try {
			let restored = false;
			updateCandidateAuthProfileStore({
				candidate: claim.candidate,
				profileId: params.profileId,
				updater: (store) => {
					const current = store.profiles[params.profileId];
					if (!isExactOAuthCredential(current?.type === "oauth" ? current : void 0, params.fence)) return false;
					store.profiles[params.profileId] = { ...claim.original };
					restored = true;
					return true;
				}
			});
			if (restored) continue;
		} catch (error) {
			restoreError = toErrorObject(error, "Failed to restore OAuth refresh peer");
		}
		try {
			updateCandidateAuthProfileStore({
				candidate: claim.candidate,
				profileId: params.profileId,
				updater: (store) => {
					const current = store.profiles[params.profileId];
					if (!isExactOAuthCredential(current?.type === "oauth" ? current : void 0, params.fence)) return false;
					store.profiles[params.profileId] = createFailedOAuthRefreshFence(params.fence);
					return true;
				}
			});
		} catch (error) {
			const terminalError = toErrorObject(error, "Failed to terminally fence OAuth refresh peer");
			unresolved.push(restoreError ? new AggregateError([restoreError, terminalError], `Failed to resolve OAuth refresh peer rollback: ${claim.candidate.databasePath}`, { cause: restoreError }) : terminalError);
		}
	}
	if (unresolved.length > 0) throw new AggregateError(unresolved, "Failed to roll back every OAuth refresh peer.", { cause: unresolved[0] });
}
/**
* Retire exact peer fences only when their original credential can safely
* inherit the authoritative shared credential. Otherwise leave a terminal
* marker so merged resolution cannot expose another account.
*/
function settleOAuthRefreshPeerClaims(params) {
	let firstError;
	for (const claim of params.claims) try {
		updateCandidateAuthProfileStore({
			candidate: claim.candidate,
			preserveProfileState: true,
			profileId: params.profileId,
			updater: (store) => {
				const current = store.profiles[params.profileId];
				if (!isExactOAuthCredential(current?.type === "oauth" ? current : void 0, params.fence)) return false;
				const inherited = params.authoritativeSharedCredential;
				if (claim.original !== void 0 && inherited !== void 0 && inherited.provider === claim.original.provider && hasUsableOAuthCredential(inherited) && (hasMatchingOAuthIdentity(claim.original, inherited) || !hasOAuthIdentity(claim.original) && isExactOAuthCredential(inherited, params.replacement))) delete store.profiles[params.profileId];
				else store.profiles[params.profileId] = createFailedOAuthRefreshFence(params.fence);
				return true;
			}
		});
	} catch (error) {
		firstError ??= toErrorObject(error, "Failed to settle OAuth refresh peer");
	}
	if (firstError !== void 0) throw firstError;
}
/** Convert every exact peer fence into a terminal no-replay marker. */
function failOAuthRefreshPeerClaims(params) {
	const failed = createFailedOAuthRefreshFence(params.fence);
	let firstError;
	for (const claim of params.claims) try {
		updateCandidateAuthProfileStore({
			candidate: claim.candidate,
			profileId: params.profileId,
			updater: (store) => {
				const current = store.profiles[params.profileId];
				if (!isExactOAuthCredential(current?.type === "oauth" ? current : void 0, params.fence)) return false;
				store.profiles[params.profileId] = failed;
				return true;
			}
		});
	} catch (error) {
		firstError ??= toErrorObject(error, "Failed to fail OAuth refresh peer");
	}
	if (firstError !== void 0) throw firstError;
}
/** Remove one owner generation and its exact nonportable historical peers. */
async function removeOAuthRefreshGenerationPeers(params) {
	for (const candidate of await listPeerCandidates(params)) {
		const store = loadCandidateAuthProfileStore(candidate);
		if (!store) continue;
		const credential = store?.profiles[params.profileId];
		if (credential?.type !== "oauth") continue;
		if (!isRemovableOAuthRefreshPeer({
			store,
			profileId: params.profileId,
			credential,
			generation: params.generation
		})) continue;
		updateCandidateAuthProfileStore({
			candidate,
			preserveProfileState: true,
			profileId: params.profileId,
			updater: (currentStore) => {
				const current = currentStore.profiles[params.profileId];
				if (current?.type !== "oauth") return false;
				if (!isExactOAuthCredential(current, credential) || !isRemovableOAuthRefreshPeer({
					store: currentStore,
					profileId: params.profileId,
					credential: current,
					generation: params.generation
				})) return false;
				delete currentStore.profiles[params.profileId];
				return true;
			}
		});
	}
}
//#endregion
//#region src/agents/auth-profiles/credential-normalize.ts
function normalizeAuthProfileCredential(credential) {
	if (credential.type === "api_key") {
		if (typeof credential.key !== "string") return credential;
		const { key: _key, ...rest } = credential;
		const key = normalizeSecretInput(credential.key);
		return {
			...rest,
			...key ? { key } : {}
		};
	}
	if (credential.type === "token") {
		if (typeof credential.token !== "string") return credential;
		const { token: _token, ...rest } = credential;
		const token = normalizeSecretInput(credential.token);
		return {
			...rest,
			...token ? { token } : {}
		};
	}
	return credential;
}
//#endregion
//#region src/agents/auth-profiles/upsert-with-lock.ts
/** Locked auth profile writes and attempt-scoped compensation. */
function throwAuthProfileUpdateError() {
	throw new Error("Failed to update auth profile store; the auth store lock may be busy. Wait a moment and retry.");
}
function restoresFencedOAuthRefreshGeneration(params) {
	return params.existing?.type === "oauth" && params.incoming.type === "oauth" && params.incoming.copyToAgents !== true && !isOAuthRefreshFence(params.incoming) && isOAuthRefreshFence(params.existing) && isSameOAuthRefreshGeneration({
		profileId: params.profileId,
		left: params.existing,
		right: params.incoming
	});
}
function loadAuthProfileWriteTarget(params) {
	if (params.agentDir || !params.stateDir) return loadPersistedAuthProfileStore(params.agentDir);
	return loadPersistedSharedAuthProfileStore({
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir,
		OPENCLAW_AGENT_DIR: void 0
	});
}
function resolveAuthProfileWriteEnv(params) {
	return params.stateDir ? {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	} : process.env;
}
function loadAuthProfileWriteAuthority(params, profileId) {
	const target = loadAuthProfileWriteTarget(params)?.profiles[profileId];
	if (target || !params.agentDir) return target;
	if (params.stateDir) return loadPersistedSharedAuthProfileStore({
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir,
		OPENCLAW_AGENT_DIR: void 0
	})?.profiles[profileId];
	return findPersistedAuthProfileCredential({
		agentDir: params.agentDir,
		profileId
	});
}
function supersedesOAuthRefreshGenerationObservedAtAdmission(params) {
	if (params.incoming.type !== "oauth" || params.incoming.copyToAgents === true || isOAuthRefreshFence(params.incoming)) return false;
	if (isDeepStrictEqual(params.current, params.observed)) {
		if (params.allowOAuthGenerationReplacement || params.current === void 0 || params.current.type === "oauth" && isOAuthRefreshFence(params.current)) return false;
		return params.current.type !== "oauth" || !isSameOAuthRefreshGeneration({
			profileId: params.profileId,
			left: params.current,
			right: params.incoming
		});
	}
	if (params.observed === void 0) return params.current !== void 0;
	if (!params.allowOAuthGenerationReplacement) return true;
	return params.observed.type !== "oauth" || isSameOAuthRefreshGeneration({
		profileId: params.profileId,
		left: params.observed,
		right: params.incoming
	});
}
/** Atomically persists a batch and returns conditional attempt-scoped compensation. */
async function persistAuthProfileBatch(params) {
	const profiles = new Map(params.profiles.map(({ profileId, credential, replaceExisting }) => [profileId, {
		credential: normalizeAuthProfileCredential(credential),
		replaceExisting: replaceExisting !== false
	}]));
	if (profiles.size === 0) {
		const result = { unrevertedProfileIds: /* @__PURE__ */ new Set() };
		return { rollback: () => result };
	}
	const observedProfiles = new Map([...profiles.keys()].map((profileId) => [profileId, loadAuthProfileWriteAuthority(params, profileId)]));
	return await withOAuthProfileLocks([...profiles.entries()].flatMap(([profileId, entry]) => entry.credential.type === "oauth" ? [{
		profileId,
		provider: entry.credential.provider
	}] : []), async () => {
		const currentAuthorities = new Map([...profiles.keys()].map((profileId) => [profileId, loadAuthProfileWriteAuthority(params, profileId)]));
		const previousProfiles = /* @__PURE__ */ new Map();
		const previousOrder = /* @__PURE__ */ new Map();
		const appliedProfiles = /* @__PURE__ */ new Map();
		let storeWasAbsent = false;
		let stateWasAbsent = false;
		const preparedOwner = runAuthProfileWriteTransaction(params.agentDir, (database, owner) => {
			params.beforeWrite?.();
			storeWasAbsent = inspectPersistedAuthProfileStoreRaw(params.agentDir, database).status === "missing";
			stateWasAbsent = inspectPersistedAuthProfileStateRaw(params.agentDir, database).status === "missing";
			const next = loadPersistedAuthProfileStore(params.agentDir, { database }) ?? {
				version: 1,
				profiles: {}
			};
			for (const [profileId, entry] of profiles) {
				if (!entry.replaceExisting && Object.hasOwn(next.profiles, profileId)) continue;
				if (supersedesOAuthRefreshGenerationObservedAtAdmission({
					profileId,
					observed: observedProfiles.get(profileId),
					current: currentAuthorities.get(profileId),
					incoming: entry.credential,
					allowOAuthGenerationReplacement: params.allowOAuthGenerationReplacement === true
				}) || restoresFencedOAuthRefreshGeneration({
					profileId,
					existing: next.profiles[profileId],
					incoming: entry.credential
				})) throw new Error(`Refused to restore fenced OAuth refresh generation for profile "${profileId}".`);
				previousProfiles.set(profileId, next.profiles[profileId]);
				next.profiles[profileId] = entry.credential;
				const existingStats = next.usageStats?.[profileId];
				if (params.resetFailureState && existingStats) next.usageStats[profileId] = resetAuthProfileFailureState(existingStats);
				appliedProfiles.set(profileId, entry.credential);
			}
			for (const [provider, profileIds] of Object.entries(params.order ?? {})) {
				previousOrder.set(provider, next.order?.[provider]);
				const existing = next.order?.[provider] ?? [];
				const additions = [...new Set(profileIds)].filter((profileId) => appliedProfiles.has(profileId) && !existing.includes(profileId));
				if (additions.length > 0) next.order = {
					...next.order,
					[provider]: [...existing, ...additions]
				};
			}
			if (appliedProfiles.size > 0) saveAuthProfileStoreWithPreparedOwner(next, params.agentDir, {
				filterExternalAuthProfiles: false,
				syncExternalCli: false
			}, database, owner);
			return owner;
		}, {
			sharedStoreWrite: true,
			stateDir: params.stateDir
		});
		let rollbackResult;
		return { rollback: () => {
			if (rollbackResult) return rollbackResult;
			const unrevertedProfileIds = /* @__PURE__ */ new Set();
			runAuthProfileWriteTransaction(params.agentDir, (database, owner) => {
				if (database.path !== preparedOwner.databasePath) throw new Error("auth profile batch rollback belongs to another owner");
				const current = loadPersistedAuthProfileStore(params.agentDir, { database });
				if (!current) return;
				const ownedProfiles = /* @__PURE__ */ new Set();
				for (const [profileId, credential] of appliedProfiles) {
					if (!isDeepStrictEqual(current.profiles[profileId], credential)) {
						unrevertedProfileIds.add(profileId);
						continue;
					}
					const previous = previousProfiles.get(profileId);
					if (previous?.type === "oauth" && previous.copyToAgents !== true) {
						unrevertedProfileIds.add(profileId);
						continue;
					}
					ownedProfiles.add(profileId);
					if (previous) current.profiles[profileId] = previous;
					else delete current.profiles[profileId];
				}
				for (const [provider, profileIds] of Object.entries(params.order ?? {})) {
					const existing = current.order?.[provider];
					if (!existing) continue;
					const preexisting = new Set(previousOrder.get(provider) ?? []);
					const introduced = new Set(profileIds.filter((profileId) => !preexisting.has(profileId)));
					const remaining = existing.filter((profileId) => !introduced.has(profileId) || !ownedProfiles.has(profileId));
					if (remaining.length === existing.length) continue;
					if (remaining.length > 0) current.order = {
						...current.order,
						[provider]: remaining
					};
					else if (current.order) {
						delete current.order[provider];
						if (Object.keys(current.order).length === 0) delete current.order;
					}
				}
				saveAuthProfileStoreWithPreparedOwner(current, params.agentDir, {
					filterExternalAuthProfiles: false,
					syncExternalCli: false
				}, database, owner);
				if (storeWasAbsent && Object.keys(current.profiles).length === 0) deletePersistedAuthProfileStoreRaw(params.agentDir, database);
				if (stateWasAbsent && buildPersistedAuthProfileState(current) === null) writePersistedAuthProfileStateRaw(null, params.agentDir, database);
			}, {
				sharedStoreWrite: true,
				env: preparedOwner.env
			});
			rollbackResult = { unrevertedProfileIds };
			return rollbackResult;
		} };
	}, { env: resolveAuthProfileWriteEnv(params) });
}
/** Upserts an auth profile under the store lock, returning null on store write failure. */
async function upsertAuthProfileWithLock(params) {
	const credential = normalizeAuthProfileCredential(params.credential);
	const observed = loadAuthProfileWriteAuthority(params, params.profileId);
	let rejectedFencedGeneration = false;
	const update = async () => {
		return await updateAuthProfileStoreWithLock({
			agentDir: params.agentDir,
			sharedStoreWrite: true,
			stateDir: params.stateDir,
			saveOptions: {
				filterExternalAuthProfiles: false,
				syncExternalCli: false
			},
			updater: (store, owner) => {
				const currentAuthority = store.profiles[params.profileId] ?? (owner && owner.databasePath !== owner.sharedDatabasePath ? loadPersistedAuthProfileStoreAtDatabasePath(owner.sharedDatabasePath, owner.location === "state-db" ? "shared-state" : "agent")?.profiles[params.profileId] : void 0);
				params.validateCurrentCredential?.(store.profiles[params.profileId]);
				if (supersedesOAuthRefreshGenerationObservedAtAdmission({
					profileId: params.profileId,
					observed,
					current: currentAuthority,
					incoming: credential,
					allowOAuthGenerationReplacement: false
				}) || restoresFencedOAuthRefreshGeneration({
					profileId: params.profileId,
					existing: store.profiles[params.profileId],
					incoming: credential
				})) {
					rejectedFencedGeneration = true;
					return false;
				}
				const existing = store.profiles[params.profileId];
				if (params.preserveApiKeyMetadata && existing?.type === "api_key" && credential.type === "api_key" && normalizeProviderId(existing.provider) === normalizeProviderId(credential.provider)) {
					const { key: _key, keyRef: _keyRef, ...metadata } = existing;
					store.profiles[params.profileId] = {
						...metadata,
						...credential
					};
				} else store.profiles[params.profileId] = credential;
				return true;
			}
		});
	};
	const updated = credential.type === "oauth" ? await withOAuthProfileLock({
		profileId: params.profileId,
		provider: credential.provider
	}, update, { env: resolveAuthProfileWriteEnv(params) }) : await update();
	return rejectedFencedGeneration ? null : updated;
}
/** Upserts an auth profile under the store lock, failing when the store cannot be written. */
async function upsertAuthProfileWithLockOrThrow(params) {
	if (!await upsertAuthProfileWithLock(params)) throwAuthProfileUpdateError();
}
//#endregion
//#region src/agents/auth-profiles/profiles.ts
/**
* Auth profile mutation helpers.
* Updates profile order, last-good state, usage stats, and provider profile
* records through locked or immediate store writes.
*/
const authProfileProfilesLog = createSubsystemLogger("agent/embedded");
const OAUTH_REMOVAL_MAX_ATTEMPTS = 3;
function listProviderAuthStateEntries(entries, provider) {
	const canonicalProvider = resolveProviderIdForAuth(provider);
	return Object.entries(entries ?? {}).filter(([key]) => resolveProviderIdForAuth(key) === canonicalProvider).toSorted(([left], [right]) => left.localeCompare(right));
}
function readProviderAuthState(entries, provider) {
	const canonicalProvider = resolveProviderIdForAuth(provider);
	const matches = listProviderAuthStateEntries(entries, canonicalProvider);
	return matches.find(([key]) => normalizeProviderId(key) === canonicalProvider)?.[1] ?? matches[0]?.[1];
}
function replaceProviderAuthState(entries, provider, value) {
	const canonicalProvider = resolveProviderIdForAuth(provider);
	const next = Object.fromEntries(Object.entries(entries ?? {}).filter(([key]) => resolveProviderIdForAuth(key) !== canonicalProvider));
	if (value !== void 0) next[canonicalProvider] = value;
	return Object.keys(next).length > 0 ? next : void 0;
}
/** Sets or clears explicit auth profile order for a provider. */
async function setAuthProfileOrder(params) {
	const providerKey = resolveProviderIdForAuth(params.provider);
	const sanitized = params.order && Array.isArray(params.order) ? normalizeStringEntries(params.order) : [];
	const deduped = dedupeProfileIds(sanitized);
	return await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		sharedStoreWrite: params.sharedStoreWrite,
		...deduped.length > 0 ? { saveOptions: { preserveOrderProfileIds: deduped } } : {},
		updater: (store) => {
			if (deduped.length === 0) {
				if (listProviderAuthStateEntries(store.order, providerKey).length === 0) return false;
				store.order = replaceProviderAuthState(store.order, providerKey);
				return true;
			}
			store.order = replaceProviderAuthState(store.order, providerKey, deduped);
			return true;
		}
	});
}
/** Promotes across shared-credential/local-order owners; otherwise relogin leaves stale order. */
async function promoteAuthProfileInOrder(params) {
	const providerKey = resolveProviderIdForAuth(params.provider);
	const effectiveStore = ensureAuthProfileStoreForLocalUpdate(params.agentDir);
	const updated = await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		saveOptions: { preserveOrderProfileIds: [params.profileId, ...params.createFromOrder ?? []] },
		updater: (store) => {
			const profile = store.profiles[params.profileId] ?? effectiveStore.profiles[params.profileId];
			if (!profile || resolveProviderIdForAuth(profile.provider) !== providerKey) return false;
			const matchingOrderEntries = listProviderAuthStateEntries(store.order, providerKey);
			const existing = readProviderAuthState(store.order, providerKey);
			if (!existing || existing.length === 0) {
				if (!params.createIfMissing) return false;
				const providerProfiles = dedupeProfileIds(params.createFromOrder !== void 0 ? params.createFromOrder : listProfilesForProvider(store, providerKey));
				const next = dedupeProfileIds([params.profileId, ...providerProfiles.filter((profileId) => profileId !== params.profileId)]);
				store.order = replaceProviderAuthState(store.order, providerKey, next);
				return true;
			}
			const next = dedupeProfileIds([params.profileId, ...existing.filter((profileId) => profileId !== params.profileId)]);
			if (next.length === existing.length && next.every((profileId, idx) => profileId === existing[idx]) && matchingOrderEntries.length === 1 && matchingOrderEntries[0]?.[0] === providerKey) return false;
			store.order = replaceProviderAuthState(store.order, providerKey, next);
			return true;
		}
	});
	return updated === null ? err("lock-contention") : ok(updated);
}
/** Upserts an auth profile immediately into the local store. */
function upsertAuthProfile(params) {
	const credential = normalizeAuthProfileCredential(params.credential);
	const store = ensureAuthProfileStoreForLocalUpdate(params.agentDir);
	store.profiles[params.profileId] = credential;
	saveAuthProfileStore(store, params.agentDir, {
		filterExternalAuthProfiles: false,
		sharedStoreWrite: true,
		syncExternalCli: false
	});
}
function providerAuthStoreOwners(requestedAgentDir) {
	const agentDir = resolveRuntimeAuthProfileAgentDir(requestedAgentDir);
	const owners = [agentDir];
	if (agentDir && !isSharedMainAuthProfileAgentDir(agentDir) && resolveAuthProfileDatabasePath(agentDir) === resolveAuthProfileDatabasePath(resolveSharedMainAuthAgentDir())) owners.unshift(void 0);
	return owners;
}
/** Removes auth profiles and related state for a provider, optionally narrowed to exact IDs. */
async function removeProviderAuthProfilesWithLock(params) {
	const owners = providerAuthStoreOwners(params.agentDir);
	for (let attempt = 0; attempt < OAUTH_REMOVAL_MAX_ATTEMPTS; attempt += 1) {
		const result = await removeAuthProfileTargetsWithLocks(owners.map((owner) => createAuthProfileRemovalTarget({
			agentDir: owner,
			...params.profileIds ? { profileIds: new Set(params.profileIds) } : { provider: params.provider }
		})), params.cfg ?? {});
		if (result.kind === "updated") return result.stores.at(-1) ?? null;
		if (result.kind === "contention") return null;
	}
	return null;
}
function removeProfileReferences(store, profileIds, provider) {
	const next = { ...removeRuntimeExternalProfileReferences({
		store,
		profileIds
	}) };
	if (provider !== void 0 && next.order) next.order = replaceProviderAuthState(next.order, provider);
	if (provider !== void 0 && next.lastGood) next.lastGood = replaceProviderAuthState(next.lastGood, provider);
	if (isDeepStrictEqual(store, next)) return false;
	Object.assign(store, next);
	return true;
}
function createAuthProfileRemovalTarget(params) {
	const store = loadAuthProfileStoreWithoutExternalProfiles(params.agentDir, {
		allowKeychainPrompt: false,
		inheritedAuthDir: params.agentDir
	});
	const profileIds = params.profileIds ?? new Set(listProfilesForProvider(store, params.provider ?? ""));
	return {
		agentDir: params.agentDir,
		profileIds,
		...params.provider ? { provider: params.provider } : {},
		expectedProfiles: new Map([...profileIds].map((profileId) => [profileId, store.profiles[profileId]]))
	};
}
function authProfileRemovalTargetMatches(target, store) {
	if (target.provider) {
		const currentProfileIds = new Set(listProfilesForProvider(store, target.provider));
		if (currentProfileIds.size !== target.profileIds.size || [...currentProfileIds].some((profileId) => !target.profileIds.has(profileId))) return false;
	}
	return [...target.expectedProfiles].every(([profileId, expected]) => isDeepStrictEqual(store.profiles[profileId], expected));
}
function readSurvivingRemovalProfiles(targets) {
	const surviving = /* @__PURE__ */ new Map();
	for (const target of targets) {
		const store = loadAuthProfileStoreWithoutExternalProfiles(target.agentDir, {
			allowKeychainPrompt: false,
			inheritedAuthDir: target.agentDir
		});
		for (const profileId of target.profileIds) {
			const credential = store.profiles[profileId];
			if (credential) surviving.set(profileId, credential);
		}
	}
	return surviving;
}
async function removeAuthProfileTargetsWithLocks(targets, cfg) {
	return await withOAuthProfileLocks(targets.flatMap((target) => [...target.expectedProfiles].flatMap(([profileId, credential]) => credential?.type === "oauth" ? [{
		profileId,
		provider: credential.provider
	}] : [])), async () => {
		for (const target of targets) if (!authProfileRemovalTargetMatches(target, loadAuthProfileStoreWithoutExternalProfiles(target.agentDir, {
			allowKeychainPrompt: false,
			inheritedAuthDir: target.agentDir
		}))) return { kind: "retry" };
		for (const target of targets) for (const [profileId, credential] of target.expectedProfiles) {
			if (credential?.type !== "oauth") continue;
			await removeOAuthRefreshGenerationPeers({
				cfg,
				ownerDatabasePath: target.agentDir ? resolveAuthProfileDatabasePath(target.agentDir) : resolveSharedAuthStorePath(),
				profileId,
				generation: credential
			});
		}
		const stores = [];
		for (const target of targets) {
			let stale = false;
			const updated = await updateAuthProfileStoreWithLock({
				agentDir: target.agentDir,
				updater: (store) => {
					if (!authProfileRemovalTargetMatches(target, store)) {
						stale = true;
						return false;
					}
					return removeProfileReferences(store, target.profileIds, target.provider);
				}
			});
			if (updated === null) return { kind: "contention" };
			if (stale) return { kind: "retry" };
			stores.push(updated);
		}
		return {
			kind: "updated",
			stores
		};
	});
}
/**
* Removes profiles from every store that owns them. Auth profiles can be
* adopted by a provider-specific owner agent dir, so removing only the caller's
* store lets the profile reappear on the next status read and auth warmup.
*/
async function removeAuthProfilesAcrossOwnerStores(params) {
	const profileIds = new Set(params.profileIds);
	if ([...profileIds].some(isUserModelAuthProfileId)) throw new Error("Personal model accounts are managed in Settings → Profile → Connected accounts. Clearing a default keeps the credential; revoke access with the provider instead of removing a shared auth profile.");
	for (let attempt = 0; attempt < OAUTH_REMOVAL_MAX_ATTEMPTS; attempt += 1) {
		const owners = params.provider === void 0 ? [params.agentDir] : providerAuthStoreOwners(params.agentDir);
		const profilesByOwner = new Map(owners.map((owner) => [isSharedMainAuthProfileAgentDir(owner) ? void 0 : owner, new Set(profileIds)]));
		for (const profileId of profileIds) {
			const ownerAgentDir = resolvePersistedAuthProfileOwnerAgentDir({
				agentDir: params.agentDir,
				profileId
			});
			const ownerProfiles = profilesByOwner.get(ownerAgentDir) ?? /* @__PURE__ */ new Set();
			ownerProfiles.add(profileId);
			profilesByOwner.set(ownerAgentDir, ownerProfiles);
		}
		const targets = [...profilesByOwner].map(([agentDir, ownerProfileIds]) => createAuthProfileRemovalTarget({
			agentDir,
			...params.provider !== void 0 ? { provider: params.provider } : { profileIds: ownerProfileIds }
		}));
		let result;
		try {
			await params.beforeRemove?.([...new Set(targets.flatMap((target) => [...target.profileIds]))]);
			result = await removeAuthProfileTargetsWithLocks(targets, params.cfg ?? {});
		} catch (error) {
			await params.onIncomplete?.(readSurvivingRemovalProfiles(targets));
			throw error;
		}
		if (result.kind === "updated") return true;
		if (result.kind === "contention" || params.beforeRemove) {
			await params.onIncomplete?.(readSurvivingRemovalProfiles(targets));
			return false;
		}
	}
	return false;
}
/** Clear the last-good profile pointer for a provider under the store lock. */
async function clearLastGoodProfileWithLock(params) {
	const providerKey = resolveProviderIdForAuth(params.provider);
	return await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		profileId: params.profileId,
		updater: (store) => {
			if (!listProviderAuthStateEntries(store.lastGood, providerKey).some(([, profileId]) => profileId === params.profileId)) return false;
			store.lastGood = replaceProviderAuthState(store.lastGood, providerKey);
			return true;
		}
	});
}
/** Mark a profile as successfully used and update ordering/usage metadata. */
async function markAuthProfileSuccess(params) {
	const { store, provider, profileId, agentDir } = params;
	const providerKey = resolveProviderIdForAuth(provider);
	const profile = store.profiles[profileId];
	if (!profile || profile.setup?.replacement || resolveProviderIdForAuth(profile.provider) !== providerKey) return;
	const ownerAgentDir = resolvePersistedAuthProfileOwnerAgentDir({
		agentDir,
		profileId
	});
	const personal = isUserModelAuthProfileId(profileId);
	const inherited = !personal && ownerAgentDir === void 0 && !isSharedMainAuthProfileAgentDir(agentDir);
	const updatesSelection = !inherited && !personal;
	const lastUsed = Date.now();
	let applied = false;
	const updated = await updateAuthProfileStoreWithLock({
		agentDir: ownerAgentDir,
		profileId,
		updater: (freshStore) => {
			const freshProfile = freshStore.profiles[profileId];
			if (!freshProfile || freshProfile.setup?.replacement || resolveProviderIdForAuth(freshProfile.provider) !== providerKey) return false;
			if (updatesSelection) freshStore.lastGood = replaceProviderAuthState(freshStore.lastGood, providerKey, profileId);
			freshStore.usageStats ??= {};
			freshStore.usageStats[profileId] = resetAuthProfileFailureState(freshStore.usageStats[profileId] ?? {}, {
				lastProbeAt: Date.now(),
				...inherited ? {} : { lastUsed }
			});
			applied = true;
			return true;
		}
	});
	if (updated && applied) {
		const usage = updated.usageStats?.[profileId];
		if (usage) store.usageStats = {
			...store.usageStats,
			[profileId]: usage
		};
		if (updatesSelection) store.lastGood = replaceProviderAuthState(store.lastGood, providerKey, profileId);
		return;
	}
	if (updated === null) authProfileProfilesLog.warn("dropped auth profile bookkeeping after locked store update failed", {
		event: "auth_profile_bookkeeping_dropped",
		kind: "success",
		profileId,
		tags: ["auth_profiles", "persistence"]
	});
}
//#endregion
export { loadCandidateAuthProfileStore as _, removeProviderAuthProfilesWithLock as a, resolveAuthStorePathForDisplay as b, persistAuthProfileBatch as c, OAuthRefreshPeerFenceError as d, failOAuthRefreshPeerClaims as f, listCandidateAuthProfileStores as g, settleOAuthRefreshPeerClaims as h, removeAuthProfilesAcrossOwnerStores as i, upsertAuthProfileWithLock as l, rollbackOAuthRefreshPeerClaims as m, markAuthProfileSuccess as n, setAuthProfileOrder as o, fenceOAuthRefreshPeers as p, promoteAuthProfileInOrder as r, upsertAuthProfile as s, clearLastGoodProfileWithLock as t, upsertAuthProfileWithLockOrThrow as u, withOAuthProfileLock as v, resolveAuthStatePathForDisplay as y };
