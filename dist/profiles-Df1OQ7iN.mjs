import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { n as isErrno, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import "./errors-DPfGDWk1.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { f as readDatabasePathIdentitySync, n as assertDatabasePathIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { _ as withSqliteReadOnlyWorkerScope } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { _ as AuthProfileStoreUnreadableError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as hasMatchingOAuthIdentity, p as isSafeToCopyOAuthRoutingScope, u as hasOAuthIdentity } from "./oauth-shared-CiaJlx_D.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { A as resetAuthProfileFailureState, U as reportCommittedInlineAuthFailure, V as OAUTH_REFRESH_LOCK_OPTIONS, W as isUserModelAuthProfileId, m as getWorkerAuthProfileWrites, v as coerceAuthProfileState } from "./user-model-account-authority-DFFjC5J5.mjs";
import { l as replaceAuthProfileAuthorization, n as continueAuthProfileAuthorizationInheritance, t as continueAuthProfileAuthorization } from "./authorization-lifetime-CLdd1God.mjs";
import { a as isSameOAuthRefreshGeneration, r as isOAuthRefreshFence, t as createFailedOAuthRefreshFence } from "./oauth-refresh-marker-Dio1lCzm.mjs";
import { r as hasUsableOAuthCredential } from "./credential-state-NmgqOc1o.mjs";
import { f as removeRuntimeExternalProfileReferences, i as loadPersistedSharedAuthProfileStore, n as loadPersistedAuthProfileStore, o as mergePersistedAuthProfileState, r as loadPersistedAuthProfileStoreAtDatabasePath } from "./persisted-DbIYEoQ3.mjs";
import { c as listOpenClawRegisteredAgentDatabasesAsync } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { a as inspectPersistedAuthProfileStoreRaw, b as runAuthProfileWriteTransaction, f as readPersistedAuthProfileStateRaw, v as resolveAuthProfileDatabasePath } from "./sqlite-BlFpr2YD.mjs";
import { c as resolveOAuthRefreshLockPath, d as resolveSharedAuthStorePath, f as resolveSharedMainAuthAgentDir, n as getPreparedSharedAuthStoreOwnership, o as prepareSharedAuthStoreOwnership } from "./path-resolve-21Orzn6B.mjs";
import { r as closeAuthProfileReadPool } from "./sqlite-read-pool-DiFi5Ms3.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { _ as invalidateRuntimeAuthProfileStoreSnapshotsForOwner } from "./runtime-snapshots-HRosak4u.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { s as withFileLock } from "./file-lock-BmWJVvRa.mjs";
import "./file-lock-BMq7QYoB.mjs";
import { d as dedupeProfileIds, f as listProfilesForProvider } from "./order-CElLtwMu.mjs";
import { b as runAuthProfileUsage, c as getScopedSharedAuthStore, f as resolveRuntimeAuthProfileAgentDir, g as runAuthProfileStoreUpdate, i as findPersistedAuthProfileCredential, s as getScopedAuthProfileEnv, t as applyScopedAuthReadThrough, u as isSharedMainAuthProfileAgentDir, x as publishAuthProfileStoreUpdate } from "./store-BPXZsh12.mjs";
import { n as isPersistedExternalCliAuthProfile } from "./external-cli-sync-Bmw7gpgm.mjs";
import { i as normalizeAuthProfileCredential } from "./store-save-BIpfhaDX.mjs";
import { n as prepareAgentAuthProfileRowsRead, t as loadPersistedAuthProfileStoreFromRows } from "./sqlite-read-BnaiPHv1.mjs";
import { C as updateAuthProfileStoreWithLock, S as saveAuthProfileStoreWithPreparedOwner, a as ensureAuthProfileStoreForLocalUpdate, b as saveAuthProfileStore, g as loadAuthProfileStoreWithoutExternalProfilesAsync, o as ensureAuthProfileStoreForLocalUpdateAsync, y as resolvePersistedAuthProfileOwnerAgentDirAsync } from "./store-runtime-CwqGD12G.mjs";
import { t as isExactOAuthCredential } from "./oauth-refresh-fence-eL04wGfj.mjs";
import { n as withPluginModelCatalogPublicationLocks, r as withPluginModelCatalogWorker } from "./plugin-model-catalog-execution-D64dZ7z1.mjs";
import { i as preparePersonalAuthProfileUsage, r as logDroppedAuthProfileBookkeeping, t as withAuthProfileUsage } from "./usage-write-Dtj4IDy-.mjs";
import fs, { stat } from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
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
	const env = cloneEnvWithPlatformSemantics(params.env ?? process.env);
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
	for (const registered of await listOpenClawRegisteredAgentDatabasesAsync({ env })) {
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
			databaseIdentity: readDatabasePathIdentitySync(databasePath),
			configured: source.configured,
			env
		});
		else if (source.configured) existing.configured = true;
	}
	return [...candidates.values()].toSorted((left, right) => left.databasePath.localeCompare(right.databasePath));
}
function assertCandidateDatabaseIdentity(candidate) {
	if (candidate.databaseIdentity.key.startsWith("path:")) candidate.databaseIdentity = readDatabasePathIdentitySync(candidate.databasePath);
	else assertDatabasePathIdentity(candidate.databasePath, candidate.databaseIdentity);
}
/** Read an already-discovered candidate without creating a missing database. */
function loadCandidateAuthProfileStore(candidate) {
	try {
		assertCandidateDatabaseIdentity(candidate);
		return loadPersistedAuthProfileStoreAtDatabasePath(candidate.databasePath, "agent");
	} finally {
		if (!candidate.configured) closeAuthProfileReadPool({
			kind: "database",
			databasePath: candidate.databasePath
		});
	}
}
/** Read the captured physical candidate through the existing auth reader. */
async function loadCandidateAuthProfileStoreAsync(candidate) {
	assertCandidateDatabaseIdentity(candidate);
	const reader = prepareAgentAuthProfileRowsRead(candidate);
	try {
		const rows = await reader.read();
		reader.assertCurrent();
		assertCandidateDatabaseIdentity(candidate);
		return loadPersistedAuthProfileStoreFromRows(rows, candidate.databasePath);
	} finally {
		await reader.dispose();
	}
}
/** Skip unrelated generations before write admission; possible matches still use the writer. */
async function fenceCandidateAuthProfileStore(params) {
	const credential = (await loadCandidateAuthProfileStoreAsync(params.candidate))?.profiles[params.profileId];
	if (credential?.type !== "oauth" || !isSameOAuthRefreshGeneration({
		profileId: params.profileId,
		left: credential,
		right: params.generation
	})) return;
	await runCandidateAuthProfileUpdate(params, {
		profileId: params.profileId,
		generation: params.generation
	});
}
/** The existing auth writer compares and updates one exact candidate under its lock. */
async function updateCandidateAuthProfileStore(params) {
	const result = await runCandidateAuthProfileUpdate(params);
	if (!result) throw new Error("Auth candidate update completed without its requested rows");
	return result;
}
async function runCandidateAuthProfileUpdate(params, peerGeneration) {
	const { candidate } = params;
	const saveOptions = {
		filterExternalAuthProfiles: false,
		syncExternalCli: false,
		...params.preserveProfileState ? {
			preserveOrderProfileIds: [params.profileId],
			preserveStateProfileIds: [params.profileId]
		} : {}
	};
	const workerWrites = getWorkerAuthProfileWrites();
	if (workerWrites) {
		const assertCurrent = () => {
			workerWrites.assertOwner(candidate.env);
			assertCandidateDatabaseIdentity(candidate);
		};
		return runAuthProfileUsage(() => workerWrites.run(() => {
			assertCurrent();
			return runAuthProfileWriteTransaction(candidate.agentDir, (database, owner) => {
				assertCurrent();
				const cell = inspectPersistedAuthProfileStoreRaw(candidate.agentDir, database);
				if (cell.status === "unreadable") throw new AuthProfileStoreUnreadableError(candidate.databasePath);
				const state = readPersistedAuthProfileStateRaw(candidate.agentDir, database);
				const loaded = cell.status === "readable" ? mergePersistedAuthProfileState(cell.raw, () => state) : null;
				if (cell.status === "readable" && !loaded) throw new AuthProfileStoreUnreadableError(candidate.databasePath);
				const store = loaded ?? {
					version: 1,
					profiles: {},
					...coerceAuthProfileState(state)
				};
				if (peerGeneration) {
					const credential = store.profiles[peerGeneration.profileId];
					if (credential?.type !== "oauth" || !isSameOAuthRefreshGeneration({
						profileId: peerGeneration.profileId,
						left: credential,
						right: peerGeneration.generation
					})) return;
				}
				const changed = params.updater(store);
				assertCurrent();
				if (changed) saveAuthProfileStoreWithPreparedOwner(store, candidate.agentDir, saveOptions, database, owner);
				return {
					changed,
					store
				};
			}, { existingDatabaseTarget: {
				kind: "agent",
				agentId: candidate.agentId,
				path: candidate.databasePath,
				env: candidate.env,
				identity: candidate.databaseIdentity,
				assertCurrent
			} });
		}));
	}
	let result;
	await runAuthProfileStoreUpdate({
		agentDir: candidate.agentDir,
		existingDatabaseTarget: {
			kind: "agent",
			agentId: candidate.agentId,
			path: candidate.databasePath,
			env: candidate.env
		},
		envOnly: false,
		peerGeneration,
		options: { env: candidate.env },
		assertCurrent: () => assertCandidateDatabaseIdentity(candidate),
		update(prepared) {
			const store = prepared.store;
			const changed = params.updater(store);
			result = {
				changed,
				store
			};
			return changed ? {
				save: true,
				store,
				externalProfiles: [],
				options: saveOptions
			} : { save: false };
		},
		async publish(committed, owner, assertCurrent, nativeCommits, committedIsCurrent) {
			if (committed) try {
				await publishAuthProfileStoreUpdate(owner, committed, assertCurrent, nativeCommits, committedIsCurrent);
			} catch (error) {
				invalidateRuntimeAuthProfileStoreSnapshotsForOwner(owner);
				reportCommittedInlineAuthFailure("Auth candidate committed before publication failed", error);
			}
		}
	});
	return result;
}
//#endregion
//#region src/agents/auth-profiles/oauth-refresh-peers.ts
function mergeOAuthRefreshPeerClaims(existing, discovered) {
	const keyOf = ({ candidate }) => JSON.stringify([
		candidate.databasePath,
		candidate.databaseIdentity.key,
		candidate.databaseIdentity.birthtime
	]);
	const claims = new Map(existing.map((claim) => [keyOf(claim), claim]));
	for (const claim of discovered) {
		const key = keyOf(claim);
		const current = claims.get(key);
		claims.set(key, current?.original ? current : claim);
	}
	return [...claims.values()].toSorted((left, right) => left.candidate.databasePath.localeCompare(right.candidate.databasePath));
}
var OAuthRefreshPeerFenceError = class extends Error {
	constructor(claims, cause) {
		super("Failed to fence every historical OAuth refresh peer.", { cause });
		this.name = "OAuthRefreshPeerFenceError";
		this.claims = claims;
	}
};
function isExternalProfileOwned(store, profileId, credential) {
	if (store.runtimeExternalProfileIds?.includes(profileId) === true) return true;
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
function validateOAuthPeerClaim(params) {
	if (!isSameOAuthRefreshGeneration({
		profileId: params.profileId,
		left: params.credential,
		right: params.generation
	})) return false;
	if (isOAuthRefreshFence(params.credential)) throw new Error(`OAuth refresh generation is already claimed by another owner: ${params.candidate.databasePath}`);
	if (!isExternalProfileOwned(params.store, params.profileId, params.credential)) return isEligibleHistoricalOAuthPeer(params);
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
			if (!candidate.databaseIdentity.key.startsWith("file:")) continue;
			await fenceCandidateAuthProfileStore({
				candidate,
				profileId: params.profileId,
				generation: params.generation,
				updater(store) {
					const credential = store.profiles[params.profileId];
					if (credential?.type !== "oauth") return false;
					if (isExactOAuthCredential(credential, params.fence)) {
						claims.push({ candidate });
						return false;
					}
					if (!validateOAuthPeerClaim({
						candidate,
						store,
						profileId: params.profileId,
						credential,
						generation: params.generation
					})) return false;
					claims.push({
						candidate,
						original: { ...credential }
					});
					store.profiles[params.profileId] = continueAuthProfileAuthorization(credential, { ...params.fence });
					return true;
				}
			});
		}
		return claims;
	} catch (error) {
		if (params.rollbackOnFailure !== false) {
			try {
				await rollbackOAuthRefreshPeerClaims({
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
async function rollbackOAuthRefreshPeerClaims(params) {
	const unresolved = [];
	for (const claim of params.claims.toReversed()) {
		if (!claim.original) continue;
		let restoreError;
		try {
			if ((await updateOAuthRefreshPeer(claim.candidate, params.profileId, params.fence, (store) => {
				store.profiles[params.profileId] = continueAuthProfileAuthorization(params.fence, { ...claim.original });
			})).changed) continue;
		} catch (error) {
			restoreError = toErrorObject(error, "Failed to restore OAuth refresh peer");
			if (hasSqliteWorkerOutcomeUnknown(error)) {
				unresolved.push(restoreError);
				continue;
			}
		}
		try {
			await updateOAuthRefreshPeer(claim.candidate, params.profileId, params.fence, (store) => {
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
async function settleOAuthRefreshPeerClaims(params) {
	let firstError;
	for (const claim of params.claims) try {
		await updateOAuthRefreshPeer(claim.candidate, params.profileId, params.fence, (store) => {
			const inherited = params.authoritativeSharedCredential;
			if (claim.original !== void 0 && inherited !== void 0 && inherited.provider === claim.original.provider && isSafeToCopyOAuthRoutingScope(claim.original, inherited) && hasUsableOAuthCredential(inherited) && (hasMatchingOAuthIdentity(claim.original, inherited) || !hasOAuthIdentity(claim.original) && isExactOAuthCredential(inherited, params.replacement))) {
				continueAuthProfileAuthorizationInheritance(store.profiles, params.profileId, params.fence);
				delete store.profiles[params.profileId];
			} else store.profiles[params.profileId] = createFailedOAuthRefreshFence(params.fence);
		}, true);
	} catch (error) {
		firstError ??= toErrorObject(error, "Failed to settle OAuth refresh peer");
	}
	if (firstError !== void 0) throw firstError;
}
/** Convert every exact peer fence into a terminal no-replay marker. */
async function failOAuthRefreshPeerClaims(params) {
	const failed = createFailedOAuthRefreshFence(params.fence);
	let firstError;
	for (const claim of params.claims) try {
		await updateOAuthRefreshPeer(claim.candidate, params.profileId, params.fence, (store) => {
			store.profiles[params.profileId] = failed;
		});
	} catch (error) {
		firstError ??= toErrorObject(error, "Failed to fail OAuth refresh peer");
	}
	if (firstError !== void 0) throw firstError;
}
/** Capture exact historical peers before removal updates their config references. */
async function listOAuthRefreshGenerationPeers(params) {
	return withSqliteReadOnlyWorkerScope(async () => {
		const peers = [];
		for (const candidate of await listPeerCandidates(params)) {
			const store = await loadCandidateAuthProfileStoreAsync(candidate);
			const credential = store?.profiles[params.profileId];
			if (!store || credential?.type !== "oauth") continue;
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
	});
}
/** Remove only captured generations; a reconnect during config cleanup survives. */
async function removeOAuthRefreshGenerationPeers(peers) {
	for (const { candidate, profileId, credential, generation } of peers) await updateCandidateAuthProfileStore({
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
	} : getScopedAuthProfileEnv() ?? process.env;
}
function loadAuthProfileWriteAuthorities(params, profileIds) {
	if (profileIds.length === 0) return /* @__PURE__ */ new Map();
	const target = loadAuthProfileWriteTarget(params);
	const missingIds = profileIds.filter((profileId) => !target?.profiles[profileId]);
	let inherited;
	if (params.agentDir && missingIds.length > 0) {
		if (params.stateDir) {
			const shared = loadAuthProfileWriteTarget({ stateDir: params.stateDir });
			inherited = new Map(missingIds.map((profileId) => [profileId, shared?.profiles[profileId]]));
		} else inherited = new Map(missingIds.map((profileId) => [profileId, findPersistedAuthProfileCredential({
			agentDir: params.agentDir,
			profileId
		})]));
	}
	return new Map(profileIds.map((profileId) => [profileId, target?.profiles[profileId] ?? inherited?.get(profileId)]));
}
function needsOAuthRefreshAuthority(credential) {
	return credential.type === "oauth" && credential.copyToAgents !== true && !isOAuthRefreshFence(credential);
}
function rejectsOAuthRefreshGenerationReplacement(params) {
	if (!needsOAuthRefreshAuthority(params.incoming)) return false;
	let supersedes;
	if (isDeepStrictEqual(params.current, params.observed)) supersedes = !params.allowOAuthGenerationReplacement && params.current !== void 0 && !(params.current.type === "oauth" && isOAuthRefreshFence(params.current)) && (params.current.type !== "oauth" || !isSameOAuthRefreshGeneration({
		profileId: params.profileId,
		left: params.current,
		right: params.incoming
	}));
	else if (params.observed === void 0) supersedes = params.current !== void 0;
	else supersedes = !params.allowOAuthGenerationReplacement || params.observed.type !== "oauth" || isSameOAuthRefreshGeneration({
		profileId: params.profileId,
		left: params.observed,
		right: params.incoming
	});
	return supersedes || params.local?.type === "oauth" && isOAuthRefreshFence(params.local) && isSameOAuthRefreshGeneration({
		profileId: params.profileId,
		left: params.local,
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
		return { rollback: async () => result };
	}
	const authorityProfileIds = [...profiles.entries()].filter(([, entry]) => needsOAuthRefreshAuthority(entry.credential)).map(([profileId]) => profileId);
	const env = resolveAuthProfileWriteEnv(params);
	if (authorityProfileIds.length > 0 && !getPreparedSharedAuthStoreOwnership(env)) await prepareSharedAuthStoreOwnership(env);
	const readAuthorities = () => loadAuthProfileWriteAuthorities(params, authorityProfileIds);
	const observedProfiles = readAuthorities();
	return await withOAuthProfileLocks([...profiles.entries()].flatMap(([profileId, entry]) => entry.credential.type === "oauth" ? [{
		profileId,
		provider: entry.credential.provider
	}] : []), async () => {
		const previousProfiles = /* @__PURE__ */ new Map();
		const previousOrder = /* @__PURE__ */ new Map();
		const appliedProfiles = /* @__PURE__ */ new Map();
		let storeWasAbsent = false;
		let preparedOwner;
		await runAuthProfileStoreUpdate({
			agentDir: params.agentDir,
			envOnly: false,
			options: {
				sharedStoreWrite: true,
				stateDir: params.stateDir,
				env: params.stateDir ? void 0 : getScopedAuthProfileEnv()
			},
			update(prepared) {
				params.beforeWrite?.();
				storeWasAbsent = !prepared.storePresent;
				const next = prepared.store;
				for (const [profileId, entry] of profiles) {
					params.validateCurrentCredential?.(profileId, next.profiles[profileId]);
					if (!entry.replaceExisting && Object.hasOwn(next.profiles, profileId)) continue;
					if (rejectsOAuthRefreshGenerationReplacement({
						profileId,
						observed: observedProfiles.get(profileId),
						current: next.profiles[profileId] ?? prepared.mainStore?.profiles[profileId],
						local: next.profiles[profileId],
						incoming: entry.credential,
						allowOAuthGenerationReplacement: params.allowOAuthGenerationReplacement === true
					})) throw new Error(`Refused to restore fenced OAuth refresh generation for profile "${profileId}".`);
					previousProfiles.set(profileId, next.profiles[profileId]);
					next.profiles[profileId] = replaceAuthProfileAuthorization(entry.credential);
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
				if (appliedProfiles.size === 0) return { save: false };
				return {
					save: true,
					store: next,
					externalProfiles: [],
					options: {
						filterExternalAuthProfiles: false,
						syncExternalCli: false
					}
				};
			},
			async publish(committed, owner, assertCurrent, nativeCommits, committedIsCurrent) {
				preparedOwner = owner;
				if (committed) await publishAuthProfileStoreUpdate(owner, committed, assertCurrent, nativeCommits, committedIsCurrent);
			}
		});
		let rollbackResult;
		return { rollback: async () => {
			if (rollbackResult) return rollbackResult;
			if (appliedProfiles.size === 0) return { unrevertedProfileIds: /* @__PURE__ */ new Set() };
			rollbackResult = (async () => {
				const unrevertedProfileIds = /* @__PURE__ */ new Set();
				await runAuthProfileStoreUpdate({
					agentDir: params.agentDir,
					envOnly: false,
					options: {
						sharedStoreWrite: true,
						env: preparedOwner?.env
					},
					update(prepared, owner) {
						if (owner.databasePath !== preparedOwner?.databasePath) throw new Error("auth profile batch rollback belongs to another owner");
						if (!prepared.storePresent) return { save: false };
						const current = prepared.store;
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
						return {
							save: true,
							store: current,
							deleteEmptyStore: storeWasAbsent,
							externalProfiles: [],
							options: {
								filterExternalAuthProfiles: false,
								syncExternalCli: false
							}
						};
					},
					async publish(committed, owner, assertCurrent, nativeCommits, committedIsCurrent) {
						if (committed) await publishAuthProfileStoreUpdate(owner, committed, assertCurrent, nativeCommits, committedIsCurrent);
					}
				});
				return { unrevertedProfileIds };
			})().catch((error) => {
				rollbackResult = void 0;
				throw error;
			});
			return rollbackResult;
		} };
	}, { env: resolveAuthProfileWriteEnv(params) });
}
/** Upserts an auth profile under the store lock, returning null on store write failure. */
async function upsertAuthProfileWithLock(params) {
	const credential = normalizeAuthProfileCredential(params.credential);
	if (needsOAuthRefreshAuthority(credential)) await prepareSharedAuthStoreOwnership(resolveAuthProfileWriteEnv(params));
	const observed = needsOAuthRefreshAuthority(credential) ? loadAuthProfileWriteAuthorities(params, [params.profileId]).get(params.profileId) : void 0;
	let rejectedFencedGeneration = false;
	const update = async () => {
		return await updateAuthProfileStoreWithLock({
			agentDir: params.agentDir,
			sharedStoreWrite: true,
			stateDir: params.stateDir,
			assertCurrent: params.assertCurrent,
			saveOptions: {
				filterExternalAuthProfiles: false,
				syncExternalCli: false
			},
			updater: (store, owner, sharedStore) => {
				const currentAuthority = store.profiles[params.profileId] ?? (owner && owner.databasePath !== owner.sharedDatabasePath ? sharedStore?.profiles[params.profileId] : void 0);
				params.validateCurrentCredential?.(store.profiles[params.profileId]);
				if (rejectsOAuthRefreshGenerationReplacement({
					profileId: params.profileId,
					observed,
					current: currentAuthority,
					local: store.profiles[params.profileId],
					incoming: credential,
					allowOAuthGenerationReplacement: false
				})) {
					rejectedFencedGeneration = true;
					return false;
				}
				const existing = store.profiles[params.profileId];
				if (params.preserveApiKeyMetadata && existing?.type === "api_key" && credential.type === "api_key" && normalizeProviderId(existing.provider) === normalizeProviderId(credential.provider)) {
					const { key: _key, keyRef: _keyRef, ...metadata } = existing;
					store.profiles[params.profileId] = replaceAuthProfileAuthorization({
						...metadata,
						...credential
					});
				} else store.profiles[params.profileId] = replaceAuthProfileAuthorization(credential);
				const existingStats = store.usageStats?.[params.profileId];
				if (params.resetFailureState && store.usageStats && existingStats) store.usageStats[params.profileId] = resetAuthProfileFailureState(existingStats);
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
const OAUTH_REMOVAL_MAX_ATTEMPTS = 3;
function listProviderAuthStateEntries(entries, provider) {
	const canonicalProvider = resolveProviderIdForAuth(provider);
	return Object.entries(entries ?? {}).filter(([key]) => resolveProviderIdForAuth(key) === canonicalProvider).toSorted(([left], [right]) => left.localeCompare(right));
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
	const order = deduped.length > 0 ? deduped : void 0;
	return await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		sharedStoreWrite: params.sharedStoreWrite,
		...order ? { saveOptions: { preserveOrderProfileIds: order } } : {},
		updater: (store) => {
			if (!order && listProviderAuthStateEntries(store.order, providerKey).length === 0) return false;
			store.order = replaceProviderAuthState(store.order, providerKey, order);
			return true;
		}
	});
}
/** Promotes across shared-credential/local-order owners; otherwise relogin leaves stale order. */
async function promoteAuthProfileInOrder(params) {
	params.assertCurrent?.();
	const providerKey = resolveProviderIdForAuth(params.provider);
	const effectiveStore = await ensureAuthProfileStoreForLocalUpdateAsync(params.agentDir);
	const updated = await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		assertCurrent: params.assertCurrent,
		saveOptions: { preserveOrderProfileIds: [params.profileId, ...params.createFromOrder ?? []] },
		updater: (store) => {
			const profile = store.profiles[params.profileId] ?? effectiveStore.profiles[params.profileId];
			if (!profile || resolveProviderIdForAuth(profile.provider) !== providerKey) return false;
			const matchingOrderEntries = listProviderAuthStateEntries(store.order, providerKey);
			const existing = matchingOrderEntries.find(([key]) => normalizeProviderId(key) === providerKey)?.[1] ?? matchingOrderEntries[0]?.[1];
			if (!existing?.length && !params.createIfMissing) return false;
			const next = dedupeProfileIds([params.profileId, ...existing?.length ? existing : params.createFromOrder !== void 0 ? params.createFromOrder : listProfilesForProvider(store, providerKey)]);
			if (existing?.length && next.length === existing.length && next.every((profileId, idx) => profileId === existing[idx]) && matchingOrderEntries.length === 1 && matchingOrderEntries[0]?.[0] === providerKey) return false;
			store.order = replaceProviderAuthState(store.order, providerKey, next);
			return true;
		}
	});
	return updated === null ? err("lock-contention") : ok(updated);
}
/** @deprecated Use upsertAuthProfileAsync. Supported through 2026-12-31. */
function upsertAuthProfile(params) {
	warnPluginSdkDeprecation({
		family: "auth-profiles",
		method: "upsertAuthProfile",
		replacement: "upsertAuthProfileAsync"
	});
	const credential = normalizeAuthProfileCredential(params.credential);
	const store = ensureAuthProfileStoreForLocalUpdate(params.agentDir);
	store.profiles[params.profileId] = replaceAuthProfileAuthorization(credential);
	saveAuthProfileStore(store, params.agentDir, {
		filterExternalAuthProfiles: false,
		sharedStoreWrite: true,
		syncExternalCli: false
	});
}
/** Upsert the selected profile in the canonical writer without replacing neighboring profiles. */
async function upsertAuthProfileAsync(params) {
	const credential = normalizeAuthProfileCredential(params.credential);
	if (!await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		sharedStoreWrite: true,
		saveOptions: {
			filterExternalAuthProfiles: false,
			syncExternalCli: false
		},
		updater(store) {
			store.profiles[params.profileId] = credential;
			return true;
		}
	})) throw new Error("Failed to update auth profile store; retry when its writer is available.");
}
function providerAuthStoreOwners(requestedAgentDir) {
	const agentDir = resolveRuntimeAuthProfileAgentDir(requestedAgentDir);
	const owners = [agentDir];
	if (agentDir && !isSharedMainAuthProfileAgentDir(agentDir) && resolveAuthProfileDatabasePath(agentDir) === resolveAuthProfileDatabasePath(resolveSharedMainAuthAgentDir())) owners.unshift(void 0);
	return owners;
}
/** Removes auth profiles and related state for a provider, optionally narrowed to exact IDs. */
async function removeProviderAuthProfilesWithLock(params) {
	await prepareSharedAuthStoreOwnership(getScopedAuthProfileEnv());
	const owners = providerAuthStoreOwners(params.agentDir);
	for (let attempt = 0; attempt < OAUTH_REMOVAL_MAX_ATTEMPTS; attempt += 1) {
		const result = await removeAuthProfileTargetsWithLocks(await Promise.all(owners.map((owner) => createAuthProfileRemovalTarget({
			agentDir: owner,
			...params.profileIds ? { profileIds: new Set(params.profileIds) } : { provider: params.provider }
		}))), params.cfg ?? {});
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
function loadRemovalStore(agentDir) {
	return loadAuthProfileStoreWithoutExternalProfilesAsync(agentDir, {
		allowKeychainPrompt: false,
		inheritedAuthDir: agentDir
	});
}
async function createAuthProfileRemovalTarget(params) {
	const store = await loadAuthProfileStoreWithoutExternalProfilesAsync(params.agentDir, {
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
async function readRemovalProfileState(targets, peers, current = false) {
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
		const store = current ? await loadRemovalStore(target.agentDir) : void 0;
		for (const profileId of target.profileIds) add(target, profileId, current ? store?.profiles[profileId] : target.expectedProfiles.get(profileId));
	}
	for (const peer of peers) {
		const credential = current ? (await loadCandidateAuthProfileStoreAsync(peer.candidate))?.profiles[peer.profileId] : peer.credential;
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
		const restoreRemovedStores = [];
		const stores = [];
		let result = {
			kind: "updated",
			stores
		};
		let removalFailure;
		try {
			await removeOAuthRefreshGenerationPeers(await prepareAuthProfileRemovalPeers(targets, cfg));
			for (const target of targets) {
				let stale = false;
				let updated;
				await runAuthProfileStoreUpdate({
					agentDir: target.agentDir,
					envOnly: false,
					options: { env: getScopedAuthProfileEnv() },
					update(prepared) {
						const store = applyScopedAuthReadThrough(prepared.store);
						updated = store;
						if (!authProfileRemovalTargetMatches(target, store)) {
							stale = true;
							return { save: false };
						}
						if (!removeProfileReferences(store, target.profileIds, target.provider)) return { save: false };
						return {
							save: true,
							store,
							captureCompensation: true,
							externalProfiles: [],
							scopedSharedStore: getScopedSharedAuthStore()
						};
					},
					async publish(committed, owner, assertCurrent, nativeCommits, committedIsCurrent) {
						if (!committed) return;
						const compensation = committed.compensation;
						if (compensation) restoreRemovedStores.push(() => runAuthProfileStoreUpdate({
							agentDir: target.agentDir,
							envOnly: false,
							options: { env: owner.env },
							update(_prepared, currentOwner) {
								if (currentOwner.databasePath !== owner.databasePath) throw new Error("auth profile rollback belongs to another database");
								return {
									save: true,
									restore: compensation
								};
							},
							async publish(restored, restoreOwner, ...publicationArgs) {
								if (restored) await publishAuthProfileStoreUpdate(restoreOwner, restored, ...publicationArgs);
							}
						}));
						updated = committed.store;
						await publishAuthProfileStoreUpdate(owner, committed, assertCurrent, nativeCommits, committedIsCurrent);
					}
				});
				if (stale) {
					result = { kind: "retry" };
					break;
				}
				stores.push(updated);
			}
		} catch (error) {
			if (isSqliteLockError(error)) result = { kind: "contention" };
			else removalFailure = { error };
		}
		try {
			await removePersistedPluginModelCatalogCredentials({
				candidates: catalogStores,
				credentials
			});
		} catch (error) {
			const failures = removalFailure ? [removalFailure.error, error] : [error];
			for (let index = restoreRemovedStores.length - 1; index >= 0; index -= 1) try {
				await restoreRemovedStores[index]?.();
			} catch (restoreError) {
				failures.push(restoreError);
			}
			const restored = (await Promise.all(targets.map(async (target) => authProfileRemovalTargetMatches(target, await loadRemovalStore(target.agentDir))))).every(Boolean);
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
	await prepareSharedAuthStoreOwnership(getScopedAuthProfileEnv());
	for (let attempt = 0; attempt < OAUTH_REMOVAL_MAX_ATTEMPTS; attempt += 1) {
		const owners = params.provider === void 0 ? [params.agentDir] : providerAuthStoreOwners(params.agentDir);
		const profilesByOwner = new Map(owners.map((owner) => [isSharedMainAuthProfileAgentDir(owner) ? void 0 : owner, new Set(profileIds)]));
		for (const profileId of profileIds) {
			const ownerAgentDir = await resolvePersistedAuthProfileOwnerAgentDirAsync({
				agentDir: params.agentDir,
				profileId
			});
			const ownerProfiles = profilesByOwner.get(ownerAgentDir) ?? /* @__PURE__ */ new Set();
			ownerProfiles.add(profileId);
			profilesByOwner.set(ownerAgentDir, ownerProfiles);
		}
		const targets = await Promise.all([...profilesByOwner].map(([agentDir, ownerProfileIds]) => createAuthProfileRemovalTarget({
			agentDir,
			...params.provider !== void 0 ? { provider: params.provider } : { profileIds: ownerProfileIds }
		})));
		const peers = params.beforeRemove || params.onIncomplete ? await prepareAuthProfileRemovalPeers(targets, params.cfg ?? {}) : [];
		const reconcileSurvivors = async (onlyIfPresent = false) => {
			if (!params.onIncomplete) return;
			const surviving = await readRemovalProfileState(targets, peers, true);
			if (!onlyIfPresent || surviving.profiles.size > 0) await params.onIncomplete(surviving.profiles, surviving.scopes);
		};
		let result;
		try {
			await params.beforeRemove?.([...new Set(targets.flatMap((target) => [...target.profileIds]))], (await readRemovalProfileState(targets, peers)).scopes);
			result = await removeAuthProfileTargetsWithLocks(targets, params.cfg ?? {});
		} catch (error) {
			await reconcileSurvivors();
			throw error;
		}
		if (result.kind === "updated") {
			await reconcileSurvivors(true);
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
	const profile = structuredClone(store.profiles[profileId]);
	if (!profile || profile.setup?.replacement || resolveProviderIdForAuth(profile.provider) !== providerKey) return;
	if (await runAuthProfileUsage(async () => {
		const reduction = {
			kind: "success",
			expectedProfile: profile,
			lastUsed: Date.now(),
			modelId: params.modelId
		};
		if (isUserModelAuthProfileId(profileId)) return preparePersonalAuthProfileUsage(store, profileId).record(reduction);
		return withAuthProfileUsage(store, profileId, agentDir, (usage) => usage.record(reduction, providerKey));
	}) === null) logDroppedAuthProfileBookkeeping("success", profileId);
}
//#endregion
export { settleOAuthRefreshPeerClaims as _, removeProviderAuthProfilesWithLock as a, withOAuthProfileLock as b, upsertAuthProfileAsync as c, upsertAuthProfileWithLockOrThrow as d, OAuthRefreshPeerFenceError as f, rollbackOAuthRefreshPeerClaims as g, mergeOAuthRefreshPeerClaims as h, removeAuthProfilesAcrossOwnerStores as i, persistAuthProfileBatch as l, fenceOAuthRefreshPeers as m, markAuthProfileSuccess as n, setAuthProfileOrder as o, failOAuthRefreshPeerClaims as p, promoteAuthProfileInOrder as r, upsertAuthProfile as s, clearLastGoodProfileWithLock as t, upsertAuthProfileWithLock as u, listCandidateAuthProfileStores as v, loadCandidateAuthProfileStore as y };
