import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { n as isErrno, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import "./utils-DgZn2dLu.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { n as captureOpenClawStateReadWorkerContext, r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { m as withSqliteWorkerCleanupFailure } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { s as withFileLock } from "./file-lock-CkzOvhYo.mjs";
import "./file-lock-Cl3feKST.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-15nvbxqy.mjs";
import { a as resolveOAuthRefreshLockPath, c as resolveSharedAuthStorePath, l as resolveSharedMainAuthAgentDir, s as resolveSharedAuthStoreOwnershipAsync } from "./path-resolve-CIRhdX6A.mjs";
import { r as closeAuthProfileReadPool } from "./sqlite-read-pool-B3hiJ5bv.mjs";
import { s as listOpenClawRegisteredAgentDatabases } from "./openclaw-agent-db-registry-listing-BmvvQ59E.mjs";
import { u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { a as inspectPersistedAuthProfileStoreRaw, b as writePersistedAuthProfileStateRaw, g as resolveAuthProfileDatabasePath, h as resolveAuthProfileDatabaseOwnerId, i as inspectPersistedAuthProfileStateRaw, n as deletePersistedAuthProfileStoreRaw, v as runAuthProfileWriteTransaction } from "./sqlite-CW8wNN4G.mjs";
import { d as resetAuthProfileFailureState, v as isUserModelAuthProfileId } from "./profile-usage-stats-BLwxBqRR.mjs";
import { S as OAUTH_REFRESH_LOCK_OPTIONS, a as loadPersistedSharedAuthProfileStore, d as buildPersistedAuthProfileState, h as getRuntimeExternalCliProfileIds, i as loadPersistedAuthProfileStoreAtDatabasePath, r as loadPersistedAuthProfileStore, v as removeRuntimeExternalProfileReferences } from "./persisted-BVyWmvfF.mjs";
import { d as isSameOAuthRefreshGeneration, l as isOAuthRefreshFence, r as hasUsableOAuthCredential, s as createFailedOAuthRefreshFence } from "./credential-state-WXO5HScp.mjs";
import { n as hasMatchingOAuthIdentity, p as isSafeToCopyOAuthRoutingScope, u as hasOAuthIdentity } from "./oauth-shared-CFtD6sCU.mjs";
import { d as resolveRuntimeAuthProfileAgentDir, f as restoreAuthProfileStorePersistenceSnapshot, i as findPersistedAuthProfileCredential, l as isSharedMainAuthProfileAgentDir, n as captureAuthProfileStorePersistenceSnapshot, u as resolvePersistedAuthProfileOwnerAgentDir, w as isPersistedExternalCliAuthProfile, y as normalizeAuthProfileCredential } from "./store-SwwRUDrm.mjs";
import { n as prepareAgentAuthProfileRowsRead } from "./sqlite-read-Ct0XVCT8.mjs";
import { B as isExactOAuthCredential } from "./runtime-snapshots-CSLjByUx.mjs";
import { d as dedupeProfileIds, f as listProfilesForProvider } from "./order-B7W96aON.mjs";
import { d as saveAuthProfileStoreIfPersistenceSnapshotMatches, f as saveAuthProfileStoreWithPreparedOwner, l as loadAuthProfileStoreWithoutExternalProfiles, p as updateAuthProfileStoreWithLock, r as ensureAuthProfileStoreForLocalUpdate, u as saveAuthProfileStore } from "./store-runtime-Qx0DZ2Si.mjs";
import { n as withPluginModelCatalogPublicationLocks, r as withPluginModelCatalogWorker } from "./plugin-model-catalog-execution-BmFwo5ev.mjs";
import { t as preparePersonalAuthProfileUsage } from "./personal-usage-CcltEVj7.mjs";
import path from "node:path";
import fs, { stat } from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/paths.ts
/**
* Public path barrel for auth-profile stores.
* Import through this file for canonical SQLite display and lock paths.
*/
function selectLocalDisplayPath(localPath, status) {
	return status !== void 0 && status !== "missing" ? localPath : void 0;
}
function normalizeDisplayPath(pathname, env = process.env) {
	return pathname.startsWith("~") ? pathname : resolveUserPath(pathname, env);
}
/** Resolve the user-facing path for the database selected by the auth store loader. */
function resolveAuthStorePathForDisplay(agentDir) {
	return normalizeDisplayPath(selectLocalDisplayPath(agentDir ? path.join(resolveUserPath(agentDir), "openclaw-agent.sqlite") : void 0, agentDir ? inspectPersistedAuthProfileStoreRaw(agentDir).status : void 0) ?? resolveSharedAuthStorePath());
}
/** Private model preparation: inspect the original source once before formatting its labels. */
async function withPreparedAuthStorePathForDisplay(agentDir, env, assertCurrent, consume) {
	assertCurrent();
	const capturedEnv = cloneEnvWithPlatformSemantics(env);
	capturedEnv.OPENCLAW_STATE_DIR = resolveStateDir(capturedEnv);
	const localPath = agentDir ? path.join(resolveUserPath(agentDir, capturedEnv), "openclaw-agent.sqlite") : void 0;
	const local = localPath ? prepareAgentAuthProfileRowsRead({
		databasePath: localPath,
		agentId: resolveAuthProfileDatabaseOwnerId(path.dirname(localPath)),
		env: capturedEnv
	}) : void 0;
	const shared = (() => {
		try {
			return {
				ok: true,
				value: captureOpenClawStateWorkerContext({ env: capturedEnv })
			};
		} catch (error) {
			return {
				ok: false,
				error
			};
		}
	})();
	let localUsed = false;
	let sharedUsed = false;
	const assertSources = () => {
		assertCurrent();
		if (localUsed) local?.assertCurrent();
		if (sharedUsed) {
			if (!shared.ok) throw shared.error;
			shared.value.maintenanceScope?.assertAdmission();
			shared.value.admission.assertCurrent();
		}
	};
	let result;
	try {
		let selected;
		if (local) {
			localUsed = true;
			assertSources();
			const rows = await local.read();
			assertSources();
			selected = selectLocalDisplayPath(localPath, rows.store.status);
		}
		if (selected === void 0) {
			sharedUsed = true;
			assertSources();
			if (!shared.ok) throw shared.error;
			await resolveSharedAuthStoreOwnershipAsync(shared.value);
			assertSources();
			selected = resolveSharedAuthStorePath(capturedEnv);
		}
		assertSources();
		result = {
			ok: true,
			value: consume(normalizeDisplayPath(selected, capturedEnv))
		};
		assertSources();
	} catch (error) {
		result = {
			ok: false,
			error
		};
	}
	try {
		await local?.dispose();
	} catch (error) {
		throw result.ok ? error : withSqliteWorkerCleanupFailure(toErrorObject(result.error, "Auth display path read failed"), error);
	}
	if (!result.ok) throw result.error;
	assertSources();
	return result.value;
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
			databasePath: resolveAuthProfileDatabasePath(agentDir),
			configured: false
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
			databasePath: resolveAuthProfileDatabasePath(agentDir),
			configured: true
		});
	}
	sources.push(...await collectStateRootCandidates(env));
	for (const registered of listOpenClawRegisteredAgentDatabases({ env })) {
		const agentId = normalizeAgentId(registered.agentId);
		sources.push({
			agentId,
			databasePath: registered.path,
			configured: false
		});
	}
	const candidates = /* @__PURE__ */ new Map();
	for (const source of sources) {
		const databasePath = canonicalizeDatabasePath(source.databasePath);
		const agentDir = source.agentDir ?? path.dirname(databasePath);
		const existing = candidates.get(databasePath);
		if (!existing) candidates.set(databasePath, {
			agentId: source.agentId,
			agentDir,
			databasePath,
			configured: source.configured,
			env
		});
		else if (source.configured) existing.configured = true;
	}
	return [...candidates.values()].toSorted((left, right) => left.databasePath.localeCompare(right.databasePath));
}
/** Read an already-discovered candidate without creating a missing database. */
function loadCandidateAuthProfileStore(candidate) {
	try {
		return loadPersistedAuthProfileStoreAtDatabasePath(candidate.databasePath, "agent");
	} finally {
		if (!candidate.configured) closeAuthProfileReadPool({
			kind: "database",
			databasePath: candidate.databasePath
		});
	}
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
	}, { operationLabel: "auth-profiles.candidate.update" });
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
	const ownerDatabasePath = resolvePathViaExistingAncestorSync(params.ownerDatabasePath);
	return (await listCandidateAuthProfileStores(params)).filter((candidate) => candidate.databasePath !== ownerDatabasePath);
}
/** All peer transitions compare the captured generation inside the candidate's write lock. */
function updateOAuthRefreshPeer(candidate, profileId, expected, update, preserveProfileState) {
	return updateCandidateAuthProfileStore({
		candidate,
		profileId,
		preserveProfileState,
		updater: (store) => {
			if (!isExactOAuthCredential(store.profiles[profileId], expected)) return false;
			update(store);
			return true;
		}
	});
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
			const original = { ...credential };
			const releaseUnclaimedObservation = params.onFence?.(candidate.databasePath);
			const updated = updateOAuthRefreshPeer(candidate, params.profileId, original, (currentStore) => {
				currentStore.profiles[params.profileId] = { ...params.fence };
			});
			if (!updated.changed) {
				const current = updated.store.profiles[params.profileId];
				if (isExactOAuthCredential(current, params.fence)) {
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
			if (updateOAuthRefreshPeer(claim.candidate, params.profileId, params.fence, (store) => {
				store.profiles[params.profileId] = { ...claim.original };
			}).changed) continue;
		} catch (error) {
			restoreError = toErrorObject(error, "Failed to restore OAuth refresh peer");
		}
		try {
			updateOAuthRefreshPeer(claim.candidate, params.profileId, params.fence, (store) => {
				store.profiles[params.profileId] = createFailedOAuthRefreshFence(params.fence);
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
		updateOAuthRefreshPeer(claim.candidate, params.profileId, params.fence, (store) => {
			const inherited = params.authoritativeSharedCredential;
			if (claim.original !== void 0 && inherited !== void 0 && inherited.provider === claim.original.provider && isSafeToCopyOAuthRoutingScope(claim.original, inherited) && hasUsableOAuthCredential(inherited) && (hasMatchingOAuthIdentity(claim.original, inherited) || !hasOAuthIdentity(claim.original) && isExactOAuthCredential(inherited, params.replacement))) delete store.profiles[params.profileId];
			else store.profiles[params.profileId] = createFailedOAuthRefreshFence(params.fence);
		}, true);
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
		updateOAuthRefreshPeer(claim.candidate, params.profileId, params.fence, (store) => {
			store.profiles[params.profileId] = failed;
		});
	} catch (error) {
		firstError ??= toErrorObject(error, "Failed to fail OAuth refresh peer");
	}
	if (firstError !== void 0) throw firstError;
}
/** Capture exact historical peers before removal updates their config references. */
async function listOAuthRefreshGenerationPeers(params) {
	const peers = [];
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
		peers.push({
			candidate,
			profileId: params.profileId,
			credential,
			generation: params.generation
		});
	}
	return peers;
}
/** Remove only captured generations; a reconnect during config cleanup survives. */
function removeOAuthRefreshGenerationPeers(peers) {
	for (const { candidate, profileId, credential, generation } of peers) updateCandidateAuthProfileStore({
		candidate,
		preserveProfileState: true,
		profileId,
		updater: (currentStore) => {
			const current = currentStore.profiles[profileId];
			if (current?.type !== "oauth") return false;
			if (!isExactOAuthCredential(current, credential) || !isRemovableOAuthRefreshPeer({
				store: currentStore,
				profileId,
				credential: current,
				generation
			})) return false;
			delete currentStore.profiles[profileId];
			return true;
		}
	});
}
//#endregion
//#region src/agents/plugin-model-catalog-credentials.ts
/** Inspect candidates together; only changed catalogs need their canonical agent writer. */
async function removePersistedPluginModelCatalogCredentials(params) {
	if (params.candidates.length === 0 || params.credentials.size === 0) return;
	const credentials = [...params.credentials];
	const env = cloneEnvWithPlatformSemantics(params.env ?? process.env);
	const capturedCandidates = params.candidates.map(({ agentId, databasePath }) => ({
		agentId,
		databasePath: resolvePathViaExistingAncestorSync(databasePath)
	}));
	const candidates = [];
	for (const candidate of capturedCandidates) {
		try {
			await stat(candidate.databasePath);
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) continue;
			throw error;
		}
		candidates.push(candidate);
	}
	if (candidates.length === 0) return;
	const context = captureOpenClawStateReadWorkerContext({ env });
	await withPluginModelCatalogPublicationLocks(candidates.map(({ databasePath }) => databasePath), async () => {
		const requiringCleanup = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "pluginModelCatalogCredentials.candidates",
			input: {
				candidates,
				credentials
			}
		}), { existingOnly: true });
		context.admission.assertCurrent();
		for (const candidate of requiringCleanup ?? candidates) await withPluginModelCatalogWorker({
			agentId: candidate.agentId,
			path: candidate.databasePath,
			env
		}, false, async (scope) => {
			await scope.execute({
				type: "catalog.removeCredentials",
				input: { credentials }
			});
		});
	});
}
//#endregion
//#region src/agents/auth-profiles/upsert-with-lock.ts
/** Locked auth profile writes and attempt-scoped compensation. */
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
				params.validateCurrentCredential?.(profileId, next.profiles[profileId]);
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
	if (!await upsertAuthProfileWithLock(params)) throw new Error("Failed to update auth profile store; the auth store lock may be busy. Wait a moment and retry.");
}
//#endregion
//#region src/agents/auth-profiles/profiles.ts
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
			if (!existing?.length && !params.createIfMissing) return false;
			const next = dedupeProfileIds([params.profileId, ...existing?.length ? existing : params.createFromOrder !== void 0 ? params.createFromOrder : listProfilesForProvider(store, providerKey)]);
			if (existing?.length && next.length === existing.length && next.every((profileId, idx) => profileId === existing[idx]) && matchingOrderEntries.length === 1 && matchingOrderEntries[0]?.[0] === providerKey) return false;
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
		databasePath: resolvePathViaExistingAncestorSync(params.agentDir ? resolveAuthProfileDatabasePath(params.agentDir) : resolveSharedAuthStorePath()),
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
async function prepareAuthProfileRemovalPeers(targets, cfg) {
	const peers = /* @__PURE__ */ new Map();
	for (const target of targets) for (const [profileId, credential] of target.expectedProfiles) {
		if (credential?.type !== "oauth") continue;
		for (const peer of await listOAuthRefreshGenerationPeers({
			cfg,
			ownerDatabasePath: target.databasePath,
			profileId,
			generation: credential
		})) if (!targets.some((owner) => owner.databasePath === peer.candidate.databasePath && owner.profileIds.has(profileId))) peers.set(`${peer.candidate.databasePath}\0${profileId}`, peer);
	}
	return [...peers.values()];
}
function readRemovalProfileState(targets, peers, current = false) {
	const profiles = /* @__PURE__ */ new Map();
	const scopes = /* @__PURE__ */ new Map();
	const add = (owner, profileId, credential) => {
		if (!credential) return;
		profiles.set(profileId, credential);
		let scope = scopes.get(owner.databasePath);
		if (!scope) {
			scope = {
				agentDir: owner.agentDir,
				databasePath: owner.databasePath,
				profileIds: []
			};
			scopes.set(owner.databasePath, scope);
		}
		if (!scope.profileIds.includes(profileId)) scope.profileIds.push(profileId);
	};
	for (const target of targets) {
		const store = current ? loadAuthProfileStoreWithoutExternalProfiles(target.agentDir, {
			allowKeychainPrompt: false,
			inheritedAuthDir: target.agentDir
		}) : void 0;
		for (const profileId of target.profileIds) add(target, profileId, current ? store?.profiles[profileId] : target.expectedProfiles.get(profileId));
	}
	for (const peer of peers) {
		const credential = current ? loadCandidateAuthProfileStore(peer.candidate)?.profiles[peer.profileId] : peer.credential;
		add(peer.candidate, peer.profileId, credential);
	}
	return {
		profiles,
		scopes: [...scopes.values()]
	};
}
async function removeAuthProfileTargetsWithLocks(targets, cfg) {
	const lockKeys = targets.flatMap((target) => [...target.expectedProfiles].flatMap(([profileId, credential]) => credential?.type === "oauth" ? [{
		profileId,
		provider: credential.provider
	}] : []));
	const credentials = /* @__PURE__ */ new Set();
	for (const target of targets) for (const credential of target.expectedProfiles.values()) {
		if (!credential) continue;
		const values = credential.type === "api_key" ? [credential.key] : credential.type === "token" ? [credential.token] : [credential.access, credential.refresh];
		for (const value of values) if (value) credentials.add(value);
	}
	const catalogStores = credentials.size > 0 ? await listCandidateAuthProfileStores({ cfg }) : [];
	return await withOAuthProfileLocks(lockKeys, async () => {
		for (const target of targets) if (!authProfileRemovalTargetMatches(target, loadAuthProfileStoreWithoutExternalProfiles(target.agentDir, {
			allowKeychainPrompt: false,
			inheritedAuthDir: target.agentDir
		}))) return { kind: "retry" };
		const restoreRemovedStores = [];
		const stores = [];
		let result = {
			kind: "updated",
			stores
		};
		let removalFailure;
		try {
			removeOAuthRefreshGenerationPeers(await prepareAuthProfileRemovalPeers(targets, cfg));
			for (const target of targets) {
				let stale = false;
				let publishRemoval;
				const updated = await updateAuthProfileStoreWithLock({
					agentDir: target.agentDir,
					updater: (store) => {
						if (!authProfileRemovalTargetMatches(target, store)) {
							stale = true;
							return false;
						}
						const before = captureAuthProfileStorePersistenceSnapshot(target.agentDir);
						if (!removeProfileReferences(store, target.profileIds, target.provider)) return false;
						const saved = saveAuthProfileStoreIfPersistenceSnapshotMatches({
							store,
							snapshot: before,
							agentDir: target.agentDir
						});
						restoreRemovedStores.push(() => restoreAuthProfileStorePersistenceSnapshot(before, saved.owned, target.agentDir));
						publishRemoval = saved.publishRuntimeSnapshots;
						return false;
					}
				});
				if (updated === null) {
					result = { kind: "contention" };
					break;
				}
				if (stale) {
					result = { kind: "retry" };
					break;
				}
				publishRemoval?.();
				stores.push(updated);
			}
		} catch (error) {
			removalFailure = { error };
		}
		try {
			await removePersistedPluginModelCatalogCredentials({
				candidates: catalogStores,
				credentials
			});
		} catch (error) {
			const failures = removalFailure ? [removalFailure.error, error] : [error];
			for (let index = restoreRemovedStores.length - 1; index >= 0; index -= 1) try {
				restoreRemovedStores[index]?.();
			} catch (restoreError) {
				failures.push(restoreError);
			}
			const restored = targets.every((target) => authProfileRemovalTargetMatches(target, loadAuthProfileStoreWithoutExternalProfiles(target.agentDir, {
				allowKeychainPrompt: false,
				inheritedAuthDir: target.agentDir
			})));
			throw new AggregateError(failures, restored ? "Catalog cleanup failed; saved credentials were restored. Rerun the same `openclaw models auth logout` command to finish removing cached copies." : "Catalog cleanup failed and concurrent auth changes prevented full restoration. Inspect the current auth profiles before retrying logout.", { cause: error });
		}
		if (removalFailure) throw removalFailure.error;
		return result;
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
		const peers = params.beforeRemove || params.onIncomplete ? await prepareAuthProfileRemovalPeers(targets, params.cfg ?? {}) : [];
		const reconcileSurvivors = async () => {
			if (!params.onIncomplete) return;
			const surviving = readRemovalProfileState(targets, peers, true);
			await params.onIncomplete(surviving.profiles, surviving.scopes);
		};
		let result;
		try {
			await params.beforeRemove?.([...new Set(targets.flatMap((target) => [...target.profileIds]))], readRemovalProfileState(targets, peers).scopes);
			result = await removeAuthProfileTargetsWithLocks(targets, params.cfg ?? {});
		} catch (error) {
			await reconcileSurvivors();
			throw error;
		}
		if (result.kind === "updated") {
			if (params.onIncomplete) {
				const surviving = readRemovalProfileState(targets, peers, true);
				if (surviving.profiles.size > 0) await params.onIncomplete(surviving.profiles, surviving.scopes);
			}
			return true;
		}
		if (result.kind === "contention" || params.beforeRemove) {
			await reconcileSurvivors();
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
	const updated = personal ? await preparePersonalAuthProfileUsage(store, profileId).record({
		kind: "success",
		expectedProfile: profile,
		lastUsed
	}).then((result) => result === null ? null : store) : await updateAuthProfileStoreWithLock({
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
export { loadCandidateAuthProfileStore as _, removeProviderAuthProfilesWithLock as a, resolveAuthStorePathForDisplay as b, persistAuthProfileBatch as c, OAuthRefreshPeerFenceError as d, failOAuthRefreshPeerClaims as f, listCandidateAuthProfileStores as g, settleOAuthRefreshPeerClaims as h, removeAuthProfilesAcrossOwnerStores as i, upsertAuthProfileWithLock as l, rollbackOAuthRefreshPeerClaims as m, markAuthProfileSuccess as n, setAuthProfileOrder as o, fenceOAuthRefreshPeers as p, promoteAuthProfileInOrder as r, upsertAuthProfile as s, clearLastGoodProfileWithLock as t, upsertAuthProfileWithLockOrThrow as u, withOAuthProfileLock as v, withPreparedAuthStorePathForDisplay as x, resolveAuthStatePathForDisplay as y };
