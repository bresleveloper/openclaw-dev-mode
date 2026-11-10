import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { _ as secretRefKey } from "./ref-contract-Bfd9_-Lp.mjs";
import { f as normalizeSecretInputString, h as parseSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { s as retainCurrentWorkerNativeSection } from "./worker-task-native-sections-DVlyZQtL.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { _ as observeCanonicalAuthProfileCredentials, a as isSafeToAdoptBootstrapOAuthIdentity, i as isSafeOAuthPostClaimSettlement, m as shouldMirrorRefreshedOAuthCredential, n as hasMatchingOAuthIdentity, o as isSafeToAdoptMainStoreOAuthIdentity, r as isSafeOAuthOwnerRefreshResult } from "./oauth-shared-CiaJlx_D.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { B as OAUTH_REFRESH_CALL_TIMEOUT_MS, H as authProfilesLog, W as isUserModelAuthProfileId } from "./user-model-account-authority-DFFjC5J5.mjs";
import { t as continueAuthProfileAuthorization } from "./authorization-lifetime-CLdd1God.mjs";
import "./profile-ids-B9fFWPvP.mjs";
import { a as isSameOAuthRefreshGeneration, i as isPendingOAuthRefreshFence, n as createOAuthRefreshFence, r as isOAuthRefreshFence, t as createFailedOAuthRefreshFence } from "./oauth-refresh-marker-Dio1lCzm.mjs";
import { a as resolveTokenExpiryState, n as evaluateStoredCredentialEligibility, r as hasUsableOAuthCredential } from "./credential-state-NmgqOc1o.mjs";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { v as resolveAuthProfileDatabasePath } from "./sqlite-BlFpr2YD.mjs";
import { c as resolveOAuthRefreshLockPath, d as resolveSharedAuthStorePath } from "./path-resolve-21Orzn6B.mjs";
import { M as updateRuntimeAuthProfileStoreSnapshot, d as getRuntimeAuthProfileStoreSnapshotCore } from "./runtime-snapshots-HRosak4u.mjs";
import { c as findActiveDegradedSecretOwner, n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-SptB0g_t.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import "./file-lock-BmWJVvRa.mjs";
import "./file-lock-BMq7QYoB.mjs";
import { d as markOAuthRefreshFailureSettled, n as OAuthRefreshFailureError, r as appendOAuthRefreshCleanupErrors, t as OAuthManagerRefreshError, u as isSettledOAuthRefreshFailure } from "./oauth-refresh-failure-H1_-S915.mjs";
import "./config-B3oiWDlr.mjs";
import { c as isSetupCredentialAccessible, s as getSetupCredentialRuntimeProfile } from "./order-CElLtwMu.mjs";
import { c as resolveProviderOAuthRefreshCapabilityWithPlugin, n as buildProviderAuthDoctorHintWithPlugin, r as formatProviderAuthProfileApiKeyWithPlugin, s as resolveProviderOAuthCredentialWithPlugin } from "./provider-runtime.runtime.js";
import { C as withPersonalAuthProfileStore, b as runAuthProfileUsage, f as resolveRuntimeAuthProfileAgentDir } from "./store-BPXZsh12.mjs";
import { i as readExternalCliBootstrapCredential, n as isPersistedExternalCliAuthProfile } from "./external-cli-sync-Bmw7gpgm.mjs";
import { C as updateAuthProfileStoreWithLock, _ as prepareAuthProfileCredentialRead, c as ensureAuthProfileStoreWithoutExternalProfilesAsync, f as loadAuthProfileStoreForRuntimeAsync, g as loadAuthProfileStoreWithoutExternalProfilesAsync, y as resolvePersistedAuthProfileOwnerAgentDirAsync } from "./store-runtime-CwqGD12G.mjs";
import { i as getOAuthProviders, r as getOAuthApiKey, t as OAuthProviderConfiguredUnavailableError } from "./provider-runtime.errors-VKEdQVPy.mjs";
import { n as resolveAuthProfileSecretOwnerId } from "./runtime-auth-profile-owner-VtWriAt2.mjs";
import { n as resolveEffectiveOAuthCredentialCore } from "./effective-oauth-CUElNQ2u.mjs";
import { i as observeOAuthRefreshSettlement, r as observeOAuthRefreshFenceSettlement, t as isExactOAuthCredential } from "./oauth-refresh-fence-eL04wGfj.mjs";
import { _ as settleOAuthRefreshPeerClaims, b as withOAuthProfileLock, f as OAuthRefreshPeerFenceError, g as rollbackOAuthRefreshPeerClaims, h as mergeOAuthRefreshPeerClaims, m as fenceOAuthRefreshPeers, p as failOAuthRefreshPeerClaims, t as clearLastGoodProfileWithLock } from "./profiles-Df1OQ7iN.mjs";
import "./worker-DKr4WoBi.mjs";
import { t as assertNoOAuthSecretRefPolicyViolations } from "./policy-CamhZ068.mjs";
import { n as suggestOAuthProfileIdForLegacyDefault } from "./repair-WSbxspnm.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/doctor.ts
/**
* Provider-specific auth doctor hints.
* Adds local migration guidance for known legacy profiles before falling back
* to provider plugin doctor copy.
*/
const QWEN_PORTAL_OAUTH_MIGRATION_HINT = "Legacy Qwen Portal OAuth profiles are not refreshable. Re-authenticate with a current Qwen API key: openclaw onboard --auth-choice qwen-api-key.";
function hasLegacyQwenPortalOAuthProfile(store, profileId) {
	return (profileId ? [store.profiles[profileId]] : Object.values(store.profiles)).some((profile) => profile?.type === "oauth" && normalizeProviderId(profile.provider) === "qwen-portal");
}
/** Formats provider-specific auth doctor guidance for a profile/store. */
async function formatAuthDoctorHint(params) {
	const normalizedProvider = normalizeProviderId(params.provider);
	if (normalizedProvider === "qwen-portal" && hasLegacyQwenPortalOAuthProfile(params.store, params.profileId)) return QWEN_PORTAL_OAUTH_MIGRATION_HINT;
	const pluginHint = await buildProviderAuthDoctorHintWithPlugin({
		provider: normalizedProvider,
		context: {
			config: params.cfg,
			store: params.store,
			provider: normalizedProvider,
			profileId: params.profileId
		}
	});
	return typeof pluginHint === "string" && pluginHint.trim() ? pluginHint : "";
}
//#endregion
//#region src/agents/auth-profiles/oauth-refresh-lock-errors.ts
function isGlobalRefreshLockTimeoutError(error, lockPath) {
	const candidate = typeof error === "object" && error !== null ? error : void 0;
	return candidate?.code === "file_lock_timeout" && candidate.lockPath === `${lockPath}.lock`;
}
function buildRefreshContentionError(params) {
	return Object.assign(new Error(`OAuth refresh failed (refresh_contention): another process is already refreshing ${params.provider} for ${params.profileId}. Please wait for the in-flight refresh to finish and retry.`, { cause: params.cause }), {
		code: "refresh_contention",
		cause: params.cause
	});
}
//#endregion
//#region src/agents/auth-profiles/oauth-refresh-observation.ts
/** Keep the refresh owner alive until its durable claim settles or rolls back. */
function beginOAuthRefreshObservation() {
	return { finish: retainCurrentWorkerNativeSection() };
}
//#endregion
//#region src/agents/auth-profiles/oauth-store.ts
function canReuseOAuthCredentialAfterRefreshFailure(params) {
	return !params.forceRefresh || params.attempted.provider === params.candidate.provider && params.attempted.access !== params.candidate.access && hasMatchingOAuthIdentity(params.attempted, params.candidate);
}
async function loadStoredOAuthRefreshStore(agentDir, profileId, personalStore) {
	if (personalStore) return personalStore.read();
	return loadAuthProfileStoreWithoutExternalProfilesAsync(agentDir, {
		allowKeychainPrompt: true,
		profileId
	});
}
async function updateOAuthStore(params) {
	return params.personalStore ? params.personalStore.update(params.updater, params.assertCurrent) : updateAuthProfileStoreWithLock(params);
}
/** Claim against the persisted credential, which may differ from an adopted bootstrap token. */
async function persistOAuthRefreshClaim(params) {
	let claimed = false;
	return await updateOAuthStore({
		personalStore: params.personalStore,
		agentDir: params.agentDir,
		profileId: params.profileId,
		assertCurrent: params.assertCurrent,
		updater: (store) => {
			if (!isExactOAuthCredential(store.profiles[params.profileId], params.expected)) return false;
			store.profiles[params.profileId] = continueAuthProfileAuthorization(params.expected, params.fence);
			claimed = true;
			return true;
		}
	}) !== null && claimed;
}
async function settleOAuthRefreshClaim(params) {
	const current = (await loadStoredOAuthRefreshStore(params.agentDir, params.profileId, params.personalStore)).profiles[params.profileId];
	if (current?.type === "oauth" && !isExactOAuthCredential(current, params.fence) && isSafeOAuthPostClaimSettlement(params.generation, current)) return {
		credential: current,
		persisted: false
	};
	let credential = null;
	let persisted = false;
	return await updateOAuthStore({
		personalStore: params.personalStore,
		assertCurrent: () => params.validateCredential?.(params.refreshed),
		agentDir: params.agentDir,
		profileId: params.profileId,
		updater: (store) => {
			const existing = store.profiles[params.profileId];
			if (existing?.type !== "oauth") return false;
			if (isExactOAuthCredential(existing, params.fence)) {
				store.profiles[params.profileId] = continueAuthProfileAuthorization(existing, { ...params.refreshed });
				credential = params.refreshed;
				persisted = true;
				return true;
			}
			credential = isSafeOAuthPostClaimSettlement(params.generation, existing) ? existing : null;
			return false;
		}
	}) === null || !credential ? null : {
		credential,
		persisted
	};
}
async function markOAuthRefreshClaimFailed(params) {
	if (await updateOAuthStore({
		personalStore: params.personalStore,
		agentDir: params.agentDir,
		profileId: params.profileId,
		updater: (store) => {
			const existing = store.profiles[params.profileId];
			if (!isExactOAuthCredential(existing, params.settledCredential ?? params.fence)) return false;
			store.profiles[params.profileId] = createFailedOAuthRefreshFence(params.fence);
			return true;
		}
	}) === null) throw new Error("Failed to persist terminal OAuth refresh fence");
}
async function rollbackOAuthRefreshOwnerClaim(params) {
	let restored = false;
	if (await updateOAuthStore({
		personalStore: params.personalStore,
		agentDir: params.ownerAgentDir,
		profileId: params.profileId,
		updater: (store) => {
			const existing = store.profiles[params.profileId];
			if (!isExactOAuthCredential(existing, params.fence)) return false;
			store.profiles[params.profileId] = continueAuthProfileAuthorization(params.fence, { ...params.original });
			restored = true;
			return true;
		}
	}) !== null && restored) return;
	await markOAuthRefreshClaimFailed({
		personalStore: params.personalStore,
		agentDir: params.ownerAgentDir,
		profileId: params.profileId,
		fence: params.fence
	});
}
//#endregion
//#region src/agents/auth-profiles/oauth-manager.ts
const oauthRefreshRecoveryBuildFailures = /* @__PURE__ */ new WeakSet();
/** Create an OAuth manager bound to provider-specific build/refresh adapters. */
function createOAuthManager(adapter) {
	async function buildValidatedAccess(credential, context) {
		context.validateCredential?.(credential);
		return {
			apiKey: await adapter.buildApiKey(credential.provider, context.personalStore ? structuredClone(credential) : credential, {
				cfg: context.cfg,
				agentDir: context.agentDir
			}),
			credential: context.personalStore ? await context.personalStore.accept(credential, (current) => context.validateCredential?.(current)) : credential
		};
	}
	async function adoptNewerMainOAuthCredential(params) {
		if (!params.agentDir || isUserModelAuthProfileId(params.profileId)) return null;
		try {
			const mainCred = (await ensureAuthProfileStoreWithoutExternalProfilesAsync(void 0, { allowKeychainPrompt: false })).profiles[params.profileId];
			if (mainCred?.type !== "oauth") return null;
			const mainExpires = asDateTimestampMs(mainCred.expires);
			const localExpires = asDateTimestampMs(params.credential.expires);
			if (mainCred.provider === params.credential.provider && hasUsableOAuthCredential(mainCred) && mainExpires !== void 0 && (localExpires === void 0 || mainExpires > localExpires) && isSafeToAdoptMainStoreOAuthIdentity(params.credential, mainCred)) return mainCred;
		} catch (err) {
			authProfilesLog.debug("adoptNewerMainOAuthCredential failed", {
				profileId: params.profileId,
				error: formatErrorMessage(err)
			});
		}
		return null;
	}
	let refreshQueue = new KeyedAsyncQueue();
	class OAuthSettlementCredentialValidationError extends Error {
		constructor(cause, cleanupErrors = []) {
			const error = toErrorObject(cause, "OAuth credential validation failed");
			super(error.message, { cause: appendOAuthRefreshCleanupErrors(error, cleanupErrors) });
			this.name = "OAuthSettlementCredentialValidationError";
		}
	}
	function validateSettlementCredential(validateCredential, credential) {
		try {
			validateCredential?.(credential);
		} catch (error) {
			throw new OAuthSettlementCredentialValidationError(error);
		}
	}
	async function resolveAuthoritativeSharedOAuthCredentialUnderLock(params) {
		let validatedAuthoritative = false;
		const acceptAuthoritative = (credential) => {
			try {
				validateSettlementCredential(params.validateCredential, credential);
				validatedAuthoritative = true;
				return true;
			} catch {
				authProfilesLog.warn("refused shared OAuth credential during settlement: credential validation failed", { profileId: params.profileId });
				return false;
			}
		};
		const updated = await updateAuthProfileStoreWithLock({
			agentDir: void 0,
			profileId: params.profileId,
			sharedStoreWrite: true,
			updater: (store) => {
				const existing = store.profiles[params.profileId];
				const decision = shouldMirrorRefreshedOAuthCredential({
					existing,
					refreshed: params.candidate
				});
				if (!decision.shouldMirror) {
					if (decision.reason === "identity-mismatch-or-regression") authProfilesLog.warn("refused to mirror OAuth credential: identity mismatch or regression", { profileId: params.profileId });
					if (decision.reason === "incoming-not-fresher" && existing?.type === "oauth") acceptAuthoritative(existing);
					return false;
				}
				if (existing?.type === "oauth" && !acceptAuthoritative(existing)) return false;
				store.profiles[params.profileId] = { ...params.candidate };
				validatedAuthoritative = true;
				authProfilesLog.debug("mirrored refreshed OAuth credential to main agent store", {
					profileId: params.profileId,
					expires: Number.isFinite(params.candidate.expires) ? new Date(params.candidate.expires).toISOString() : void 0
				});
				return true;
			}
		});
		if (updated === null) throw new Error("Failed to read authoritative shared OAuth credential");
		if (!validatedAuthoritative) return;
		const authoritative = updated.profiles[params.profileId];
		return authoritative?.type === "oauth" ? authoritative : void 0;
	}
	async function settlePeerClaimsUnderRefreshLock(params) {
		validateSettlementCredential(params.validateCredential, params.replacement);
		if (params.claim.personalStore) return;
		const authoritativeSharedCredential = params.claim.authPath === resolveSharedAuthStorePath() ? params.replacement : await resolveAuthoritativeSharedOAuthCredentialUnderLock({
			profileId: params.claim.profileId,
			candidate: params.replacement,
			validateCredential: params.validateCredential
		});
		await settleOAuthRefreshPeerClaims({
			profileId: params.claim.profileId,
			fence: params.claim.fence,
			claims: params.claims,
			authoritativeSharedCredential,
			replacement: params.replacement
		});
	}
	async function claimOAuthRefresh(params) {
		const personalProfile = isUserModelAuthProfileId(params.profileId);
		const ownerAgentDir = personalProfile ? void 0 : await resolvePersistedAuthProfileOwnerAgentDirAsync(params);
		const authPath = params.personalStore?.databasePath ?? (ownerAgentDir ? resolveAuthProfileDatabasePath(ownerAgentDir) : resolveSharedAuthStorePath());
		const globalRefreshLockPath = resolveOAuthRefreshLockPath(params.provider, params.profileId);
		const peerConfig = params.cfg ?? {};
		const failTerminalPeers = async (credential) => {
			const claims = personalProfile ? [] : await fenceOAuthRefreshPeers({
				cfg: peerConfig,
				ownerDatabasePath: authPath,
				profileId: params.profileId,
				generation: credential,
				fence: credential
			});
			await failOAuthRefreshPeerClaims({
				profileId: params.profileId,
				fence: credential,
				claims
			});
		};
		let observation;
		let observationTransferred = false;
		try {
			const claim = await withOAuthProfileLock({
				provider: params.provider,
				profileId: params.profileId
			}, async () => {
				params.signal?.throwIfAborted();
				const cred = (await loadStoredOAuthRefreshStore(ownerAgentDir, params.profileId, params.personalStore)).profiles[params.profileId];
				if (!cred || cred.type !== "oauth" || cred.provider !== params.provider) return { kind: "unavailable" };
				const storedFence = isOAuthRefreshFence(cred);
				if (!storedFence) params.validateCredential?.(cred);
				let credentialToRefresh = cred;
				if (!storedFence && !personalProfile && isPersistedExternalCliAuthProfile({
					profileId: params.profileId,
					credential: cred
				})) {
					authProfilesLog.warn("refused native OAuth refresh for an externally owned credential", {
						profileId: params.profileId,
						provider: cred.provider
					});
					return { kind: "unavailable" };
				}
				if (params.forceRefresh && hasUsableOAuthCredential(cred) && canReuseOAuthCredentialAfterRefreshFailure({
					forceRefresh: true,
					attempted: params.attemptedCredential,
					candidate: cred
				})) return {
					kind: "use",
					credential: cred
				};
				if (!storedFence && !params.forceRefresh && hasUsableOAuthCredential(cred)) return {
					kind: "use",
					credential: cred
				};
				if (!storedFence && params.agentDir && !personalProfile) try {
					const mainCred = (await loadStoredOAuthRefreshStore(void 0)).profiles[params.profileId];
					if (ownerAgentDir && mainCred?.type === "oauth" && isSameOAuthRefreshGeneration({
						profileId: params.profileId,
						left: cred,
						right: mainCred
					})) return { kind: "unavailable" };
					if (mainCred?.type === "oauth" && mainCred.provider === cred.provider && hasUsableOAuthCredential(mainCred) && !params.forceRefresh && isSafeToAdoptMainStoreOAuthIdentity(cred, mainCred)) {
						params.validateCredential?.(mainCred);
						authProfilesLog.info("adopted fresh OAuth credential from main store (under refresh lock)", {
							profileId: params.profileId,
							agentDir: params.agentDir,
							expires: new Date(mainCred.expires).toISOString()
						});
						return {
							kind: "use",
							credential: mainCred
						};
					} else if (mainCred?.type === "oauth" && mainCred.provider === cred.provider && hasUsableOAuthCredential(mainCred) && !isSafeToAdoptMainStoreOAuthIdentity(cred, mainCred)) authProfilesLog.warn("refused to adopt fresh main-store OAuth credential: identity mismatch", {
						profileId: params.profileId,
						agentDir: params.agentDir
					});
				} catch (err) {
					authProfilesLog.debug("inside-lock main-store adoption failed; proceeding to refresh", {
						profileId: params.profileId,
						error: formatErrorMessage(err)
					});
				}
				const externallyManaged = !personalProfile && params.bootstrapCredential && params.bootstrapBaseCredential && isExactOAuthCredential(cred, params.bootstrapBaseCredential) ? params.bootstrapCredential : null;
				if (externallyManaged) {
					if (externallyManaged.provider !== cred.provider) authProfilesLog.warn("refused external oauth bootstrap credential: provider mismatch", {
						profileId: params.profileId,
						provider: cred.provider
					});
					else if (storedFence || !isSafeToAdoptBootstrapOAuthIdentity(cred, externallyManaged)) authProfilesLog.warn("refused external oauth bootstrap credential: fenced or identity mismatch", {
						profileId: params.profileId,
						provider: cred.provider
					});
					else {
						credentialToRefresh = externallyManaged;
						params.validateCredential?.(credentialToRefresh);
						if (!params.forceRefresh && hasUsableOAuthCredential(externallyManaged)) return {
							kind: "use",
							credential: externallyManaged
						};
					}
				}
				if (storedFence && credentialToRefresh === cred) {
					if (isPendingOAuthRefreshFence(cred)) return {
						kind: "observe",
						ownerAgentDir,
						generation: cred
					};
					await failTerminalPeers(cred);
					return { kind: "unavailable" };
				}
				if (normalizeSecretInputString(credentialToRefresh.refresh) === void 0) return { kind: "unavailable" };
				if (!await adapter.canRefreshCredential(personalProfile ? structuredClone(credentialToRefresh) : credentialToRefresh, {
					cfg: params.cfg,
					agentDir: params.agentDir
				})) return { kind: "unavailable" };
				const fence = createOAuthRefreshFence({
					profileId: params.profileId,
					credential: credentialToRefresh
				});
				observation = beginOAuthRefreshObservation();
				if (!await persistOAuthRefreshClaim({
					personalStore: params.personalStore,
					assertCurrent: () => {
						params.signal?.throwIfAborted();
						params.validateCredential?.(credentialToRefresh);
					},
					agentDir: ownerAgentDir,
					profileId: params.profileId,
					expected: cred,
					fence
				})) {
					const current = (await loadStoredOAuthRefreshStore(ownerAgentDir, params.profileId, params.personalStore)).profiles[params.profileId];
					if (current?.type !== "oauth" || current.provider !== params.provider) return { kind: "unavailable" };
					if (!isOAuthRefreshFence(current)) params.validateCredential?.(current);
					if (isPendingOAuthRefreshFence(current)) return {
						kind: "observe",
						ownerAgentDir,
						generation: current
					};
					if (isOAuthRefreshFence(current)) {
						await failTerminalPeers(current);
						return { kind: "unavailable" };
					}
					return hasUsableOAuthCredential(current) ? {
						kind: "use",
						credential: current
					} : { kind: "unavailable" };
				}
				let peerClaims = [];
				const peerGeneration = !personalProfile && credentialToRefresh === cred ? cred : void 0;
				try {
					if (!personalProfile && peerGeneration) peerClaims = await fenceOAuthRefreshPeers({
						cfg: peerConfig,
						ownerDatabasePath: authPath,
						profileId: params.profileId,
						generation: peerGeneration,
						fence,
						rollbackOnFailure: false
					});
				} catch (error) {
					if (error instanceof OAuthRefreshPeerFenceError) peerClaims = mergeOAuthRefreshPeerClaims(peerClaims, error.claims);
					const cleanupErrors = [];
					try {
						await rollbackOAuthRefreshPeerClaims({
							profileId: params.profileId,
							fence,
							claims: peerClaims
						});
					} catch (cleanupError) {
						cleanupErrors.push(cleanupError);
					}
					try {
						await rollbackOAuthRefreshOwnerClaim({
							personalStore: params.personalStore,
							ownerAgentDir,
							profileId: params.profileId,
							fence,
							original: cred
						});
					} catch (cleanupError) {
						cleanupErrors.push(cleanupError);
					}
					if (cleanupErrors.length > 0) throw new AggregateError([error, ...cleanupErrors], "Failed to claim OAuth refresh ownership and roll back partial claims.", { cause: error });
					throw error;
				}
				return {
					kind: "claimed",
					personalStore: params.personalStore,
					profileId: params.profileId,
					credential: credentialToRefresh,
					fence,
					ownerAgentDir,
					authPath,
					peerClaims,
					...peerGeneration ? { peerGeneration } : {},
					observation
				};
			});
			observationTransferred = claim.kind === "claimed";
			return claim;
		} catch (error) {
			if (isGlobalRefreshLockTimeoutError(error, globalRefreshLockPath)) throw buildRefreshContentionError({
				provider: params.provider,
				profileId: params.profileId,
				cause: error
			});
			throw error;
		} finally {
			if (!observationTransferred) observation?.finish();
		}
	}
	async function refreshOAuthTokenWithLock(params) {
		params.signal?.throwIfAborted();
		const claim = await claimOAuthRefresh(params);
		if (claim.kind === "unavailable") return null;
		if (claim.kind === "observe") return await observeOAuthRefreshFenceSettlement({
			label: `refreshOAuthCredential(${params.provider})`,
			timeoutMs: OAUTH_REFRESH_CALL_TIMEOUT_MS,
			signal: params.signal,
			read: async () => (await loadStoredOAuthRefreshStore(claim.ownerAgentDir, params.profileId, params.personalStore)).profiles[params.profileId],
			isPending: (credential) => credential?.type === "oauth" && credential.provider === claim.generation.provider && isPendingOAuthRefreshFence(credential),
			resolve: async (credential) => {
				if (credential?.type !== "oauth" || !isSafeOAuthPostClaimSettlement(claim.generation, credential)) return null;
				return await buildValidatedAccess(credential, params);
			}
		});
		if (claim.kind === "use") return await buildValidatedAccess(claim.credential, params);
		params.attemptedCredentials?.push(claim.credential);
		const peerConfig = params.cfg ?? {};
		let activePeerClaims = claim.peerClaims;
		const failPeers = async (onFailure) => {
			try {
				await failOAuthRefreshPeerClaims({
					profileId: params.profileId,
					fence: claim.fence,
					claims: activePeerClaims
				});
			} catch (error) {
				onFailure(error);
			}
		};
		const rediscoverPeerClaims = async (generation) => {
			try {
				activePeerClaims = mergeOAuthRefreshPeerClaims(activePeerClaims, await fenceOAuthRefreshPeers({
					cfg: peerConfig,
					ownerDatabasePath: claim.authPath,
					profileId: params.profileId,
					generation,
					fence: claim.fence,
					rollbackOnFailure: false
				}));
			} catch (error) {
				if (error instanceof OAuthRefreshPeerFenceError) activePeerClaims = mergeOAuthRefreshPeerClaims(activePeerClaims, error.claims);
				throw error;
			}
		};
		const failClaim = async (rediscoverPeers) => {
			let result = {
				supersedingOwner: null,
				validationError: null,
				cleanupErrors: []
			};
			try {
				await withOAuthProfileLock({
					provider: params.provider,
					profileId: params.profileId
				}, async () => {
					const cleanupErrors = [];
					let supersedingOwner = null;
					let validationError = null;
					try {
						const owner = rediscoverPeers ? (await loadStoredOAuthRefreshStore(claim.ownerAgentDir, params.profileId, params.personalStore)).profiles[params.profileId] : void 0;
						supersedingOwner = owner?.type === "oauth" && !isExactOAuthCredential(owner, claim.fence) && isSafeOAuthPostClaimSettlement(claim.credential, owner) && canReuseOAuthCredentialAfterRefreshFailure({
							forceRefresh: params.forceRefresh,
							attempted: claim.credential,
							candidate: owner
						}) ? owner : null;
					} catch (error) {
						cleanupErrors.push(error);
					}
					if (rediscoverPeers && claim.peerGeneration) try {
						await rediscoverPeerClaims(claim.peerGeneration);
					} catch (error) {
						cleanupErrors.push(error);
					}
					if (supersedingOwner && cleanupErrors.length === 0) try {
						await settlePeerClaimsUnderRefreshLock({
							claim,
							claims: activePeerClaims,
							replacement: supersedingOwner,
							validateCredential: params.validateCredential
						});
						result = {
							supersedingOwner,
							validationError,
							cleanupErrors
						};
						return;
					} catch (error) {
						if (error instanceof OAuthSettlementCredentialValidationError) validationError = error;
						else cleanupErrors.push(error);
					}
					await failPeers((error) => cleanupErrors.push(error));
					try {
						await markOAuthRefreshClaimFailed({
							personalStore: params.personalStore,
							agentDir: claim.ownerAgentDir,
							profileId: params.profileId,
							fence: claim.fence
						});
					} catch (error) {
						cleanupErrors.push(error);
					}
					result = {
						supersedingOwner: null,
						validationError,
						cleanupErrors
					};
				});
				return result;
			} catch (error) {
				return {
					supersedingOwner: null,
					validationError: result.validationError,
					cleanupErrors: [...result.cleanupErrors, error]
				};
			}
		};
		const settleFailure = async (failure) => {
			const initiatingError = failure ? toErrorObject(failure.error, "OAuth refresh failed") : void 0;
			const { supersedingOwner, validationError, cleanupErrors } = await failClaim(failure?.rediscoverPeers !== false);
			if (validationError) throw new OAuthSettlementCredentialValidationError(validationError, cleanupErrors);
			if (supersedingOwner) try {
				return await buildValidatedAccess(supersedingOwner, params);
			} catch (error) {
				const combinedFailure = initiatingError !== void 0 ? appendOAuthRefreshCleanupErrors(initiatingError, [...cleanupErrors, error]) : appendOAuthRefreshCleanupErrors(error, cleanupErrors);
				oauthRefreshRecoveryBuildFailures.add(combinedFailure);
				throw combinedFailure;
			}
			if (initiatingError !== void 0) {
				const error = appendOAuthRefreshCleanupErrors(initiatingError, cleanupErrors);
				if (failure?.externalRefresh && cleanupErrors.length === 0) {
					const settled = new OAuthRefreshFailureError({
						provider: params.provider,
						profileId: params.profileId,
						message: error.message,
						cause: error
					});
					markOAuthRefreshFailureSettled(settled, error);
					throw settled;
				}
				throw error;
			}
			if (cleanupErrors.length === 0) return null;
			throw appendOAuthRefreshCleanupErrors(cleanupErrors[0], cleanupErrors.slice(1));
		};
		const settlement = runAuthProfileUsage(async () => {
			let refreshed;
			try {
				refreshed = await adapter.refreshCredential(params.personalStore ? structuredClone(claim.credential) : claim.credential, {
					cfg: params.cfg,
					agentDir: params.agentDir
				});
			} catch (error) {
				return await settleFailure({
					error,
					externalRefresh: true
				});
			}
			if (!refreshed) return await settleFailure();
			try {
				const rotated = {
					...claim.credential,
					...params.personalStore ? structuredClone(refreshed) : refreshed,
					type: "oauth"
				};
				if (!hasUsableOAuthCredential(rotated, { refreshMarginMs: 0 })) throw new Error("OAuth refresh returned an unusable credential");
				if (!isSafeOAuthOwnerRefreshResult(claim.credential, rotated)) throw new Error("OAuth refresh returned credentials for a different OAuth account");
				params.validateCredential?.(rotated);
				const settled = await withOAuthProfileLock({
					provider: params.provider,
					profileId: params.profileId
				}, async () => {
					if (claim.peerGeneration) await rediscoverPeerClaims(claim.peerGeneration);
					const claimSettlement = await settleOAuthRefreshClaim({
						personalStore: params.personalStore,
						agentDir: claim.ownerAgentDir,
						profileId: params.profileId,
						generation: claim.credential,
						fence: claim.fence,
						refreshed: rotated,
						validateCredential: params.validateCredential
					});
					if (!claimSettlement) return null;
					try {
						await settlePeerClaimsUnderRefreshLock({
							claim,
							claims: activePeerClaims,
							replacement: claimSettlement.credential,
							validateCredential: params.validateCredential
						});
					} catch (peerSettlementError) {
						if (peerSettlementError instanceof OAuthSettlementCredentialValidationError) {
							const cleanupErrors = [];
							await failPeers((error) => cleanupErrors.push(error));
							if (claimSettlement.persisted) try {
								await markOAuthRefreshClaimFailed({
									personalStore: params.personalStore,
									agentDir: claim.ownerAgentDir,
									profileId: params.profileId,
									fence: claim.fence,
									settledCredential: claimSettlement.credential
								});
							} catch (error) {
								cleanupErrors.push(error);
							}
							throw new OAuthSettlementCredentialValidationError(peerSettlementError, cleanupErrors);
						}
						await failPeers((error) => {
							authProfilesLog.warn("failed to terminally fence an OAuth refresh peer", {
								profileId: params.profileId,
								error: formatErrorMessage(error)
							});
						});
						authProfilesLog.warn("OAuth refresh peer settlement degraded", {
							profileId: params.profileId,
							error: formatErrorMessage(peerSettlementError)
						});
					}
					return claimSettlement;
				});
				if (!settled) throw new Error("Failed to persist refreshed OAuth credential");
				if (!params.personalStore) observeCanonicalAuthProfileCredentials(claim.authPath, { [params.profileId]: settled.credential });
				return await buildValidatedAccess(settled.credential, params);
			} catch (error) {
				if (error instanceof OAuthRefreshPeerFenceError && hasSqliteWorkerOutcomeUnknown(error)) return await settleFailure({
					error,
					rediscoverPeers: false
				});
				if (error instanceof OAuthSettlementCredentialValidationError || hasSqliteWorkerOutcomeUnknown(error)) throw error;
				return await settleFailure({ error });
			}
		});
		settlement.then(claim.observation.finish, claim.observation.finish);
		return await observeOAuthRefreshSettlement(`refreshOAuthCredential(${claim.credential.provider})`, OAUTH_REFRESH_CALL_TIMEOUT_MS, settlement, params.signal);
	}
	async function resolveOAuthAccess(params) {
		params.signal?.throwIfAborted();
		if (!isUserModelAuthProfileId(params.profileId)) return resolveOwnedOAuthAccess(params);
		const validateCredential = params.validateCredential;
		const prepared = {
			...params,
			validateCredential: validateCredential ? (credential) => validateCredential(structuredClone(credential)) : void 0
		};
		const resolve = (personalStore) => resolveOwnedOAuthAccess({
			...prepared,
			personalStore
		});
		return prepared.personalStore ? resolve(prepared.personalStore) : await withPersonalAuthProfileStore(prepared.profileId, async (owner) => {
			await owner.read();
			return resolve(owner);
		}) ?? null;
	}
	async function resolveOwnedOAuthAccess(params) {
		params.signal?.throwIfAborted();
		const personalProfile = isUserModelAuthProfileId(params.profileId);
		let credential = params.credential;
		if (params.personalStore) {
			const owned = params.personalStore.readCurrentCredential();
			if (owned?.type !== "oauth") return null;
			credential = owned;
		}
		const newerMainCredential = await adoptNewerMainOAuthCredential({
			profileId: params.profileId,
			agentDir: params.agentDir,
			credential
		});
		if (newerMainCredential) {
			params.validateCredential?.(newerMainCredential);
			params.store.profiles[params.profileId] = { ...newerMainCredential };
			authProfilesLog.info("adopted newer OAuth credentials from main agent", {
				profileId: params.profileId,
				agentDir: params.agentDir,
				expires: new Date(newerMainCredential.expires).toISOString()
			});
		}
		const adoptedCredential = newerMainCredential ?? credential;
		const bootstrapCredential = personalProfile ? null : adapter.readBootstrapCredential({
			profileId: params.profileId,
			credential: adoptedCredential
		});
		const effectiveCredential = resolveEffectiveOAuthCredentialCore({
			profileId: params.profileId,
			credential: adoptedCredential,
			readBootstrapCredential: () => bootstrapCredential
		});
		const attemptedCredentials = [];
		if (!params.forceRefresh && !isOAuthRefreshFence(adoptedCredential) && hasUsableOAuthCredential(effectiveCredential)) return await buildValidatedAccess(effectiveCredential, params);
		try {
			const queued = runAuthProfileUsage(() => refreshQueue.enqueue(`${credential.provider}\u0000${params.profileId}`, () => refreshOAuthTokenWithLock({
				...params,
				provider: credential.provider,
				attemptedCredential: effectiveCredential,
				attemptedCredentials,
				bootstrapCredential,
				bootstrapBaseCredential: adoptedCredential
			})));
			const resolved = await racePromiseWithAbortSignal(queued, params.signal);
			params.signal?.throwIfAborted();
			return resolved;
		} catch (error) {
			params.signal?.throwIfAborted();
			if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
			let refreshError = error;
			let recoveryBuildFailed = refreshError instanceof OAuthSettlementCredentialValidationError || refreshError instanceof Error && oauthRefreshRecoveryBuildFailures.has(refreshError);
			let refreshedStore = params.store;
			let recoveryStoreLoaded = false;
			const buildRecoveryAccess = async (candidate) => {
				try {
					return await buildValidatedAccess(candidate, params);
				} catch (cleanupError) {
					refreshError = appendOAuthRefreshCleanupErrors(refreshError, [cleanupError]);
					recoveryBuildFailed = true;
					return null;
				}
			};
			try {
				refreshedStore = await loadStoredOAuthRefreshStore(params.agentDir, params.profileId, params.personalStore);
				recoveryStoreLoaded = true;
			} catch (cleanupError) {
				refreshError = appendOAuthRefreshCleanupErrors(refreshError, [cleanupError]);
			}
			const claimedGeneration = attemptedCredentials.at(-1) ?? effectiveCredential;
			const canRecover = (candidate) => candidate?.type === "oauth" && isSafeOAuthPostClaimSettlement(claimedGeneration, candidate) && canReuseOAuthCredentialAfterRefreshFailure({
				forceRefresh: params.forceRefresh,
				attempted: claimedGeneration,
				candidate
			});
			const refreshed = refreshedStore.profiles[params.profileId];
			if (recoveryStoreLoaded && !recoveryBuildFailed && canRecover(refreshed)) {
				const recovered = await buildRecoveryAccess(refreshed);
				if (recovered) return recovered;
			}
			if (recoveryStoreLoaded && params.agentDir && !personalProfile && !recoveryBuildFailed) try {
				const mainCred = (await ensureAuthProfileStoreWithoutExternalProfilesAsync(void 0, { allowKeychainPrompt: false })).profiles[params.profileId];
				if (canRecover(mainCred)) {
					params.validateCredential?.(mainCred);
					refreshedStore.profiles[params.profileId] = { ...mainCred };
					authProfilesLog.info("inherited fresh OAuth credentials from main agent", {
						profileId: params.profileId,
						agentDir: params.agentDir,
						expires: new Date(mainCred.expires).toISOString()
					});
					const recovered = await buildRecoveryAccess(mainCred);
					if (recovered) return recovered;
				}
			} catch (cleanupError) {
				refreshError = appendOAuthRefreshCleanupErrors(refreshError, [cleanupError]);
			}
			throw new OAuthManagerRefreshError({
				credential,
				attemptedCredentials: [effectiveCredential, ...attemptedCredentials],
				profileId: params.profileId,
				refreshedStore,
				cause: refreshError
			});
		}
	}
	function resetRefreshQueuesForTest() {
		refreshQueue = new KeyedAsyncQueue();
	}
	return {
		resolveOAuthAccess,
		resetRefreshQueuesForTest
	};
}
//#endregion
//#region src/agents/auth-profiles/oauth.ts
/**
* Auth profile API-key/OAuth runtime resolver.
* Converts selected auth profiles into provider API keys, refreshes OAuth
* credentials, resolves SecretRefs, and maintains runtime store snapshots.
*/
const OAUTH_PROVIDER_IDS = new Set(getOAuthProviders().map((provider) => provider.id));
function isProfileConfigCompatible(params) {
	const profileConfig = params.cfg?.auth?.profiles?.[params.profileId];
	return !profileConfig || profileConfig.provider === params.provider && (profileConfig.mode === params.mode || (profileConfig.mode === "oauth" || profileConfig.mode === "token") && (params.mode === "oauth" || params.mode === "token"));
}
function buildApiKeyProfileResult(params) {
	const result = {
		apiKey: params.apiKey,
		provider: params.provider,
		email: params.email
	};
	for (const key of [
		"profileId",
		"profileType",
		"credential",
		"readCurrentCredential"
	]) Object.defineProperty(result, key, {
		value: key === "readCurrentCredential" ? params[key] ?? null : params[key],
		enumerable: false
	});
	return result;
}
/** Detect provider errors caused by single-use OAuth refresh token races. */
function isRefreshTokenReusedError(error) {
	const message = normalizeLowercaseStringOrEmpty(formatErrorMessage(error));
	return message.includes("refresh_token_reused") || message.includes("refresh token has already been used") || message.includes("already been used to generate a new access token");
}
async function refreshOAuthCredential(credential, context = {}) {
	const pluginResult = await resolveProviderOAuthCredentialWithPlugin({
		provider: credential.provider,
		config: context.cfg,
		credential,
		refresh: true
	});
	if (pluginResult.status === "available") return pluginResult.credential;
	if (pluginResult.status === "configured-unavailable") throw new OAuthProviderConfiguredUnavailableError(credential.provider);
	if (!OAUTH_PROVIDER_IDS.has(credential.provider)) return null;
	return (await getOAuthApiKey(credential.provider, { [credential.provider]: credential }))?.newCredentials ?? null;
}
/** Refresh one OAuth credential and merge provider-returned token fields. */
async function refreshOAuthCredentialForRuntime(params) {
	const refreshed = await refreshOAuthCredential(params.credential, { cfg: params.cfg });
	return refreshed ? {
		...params.credential,
		...refreshed,
		type: "oauth"
	} : null;
}
const oauthManager = createOAuthManager({
	async buildApiKey(provider, credentials, context) {
		const formatted = await formatProviderAuthProfileApiKeyWithPlugin({
			provider,
			config: context.cfg,
			context: credentials
		});
		return typeof formatted === "string" && formatted.length > 0 ? formatted : credentials.access;
	},
	refreshCredential: refreshOAuthCredential,
	async canRefreshCredential(credential, context) {
		const pluginCapability = await resolveProviderOAuthRefreshCapabilityWithPlugin({
			provider: credential.provider,
			config: context.cfg
		});
		if (pluginCapability.status === "available") return true;
		if (pluginCapability.status === "configured-unavailable") throw new OAuthProviderConfiguredUnavailableError(credential.provider);
		return OAUTH_PROVIDER_IDS.has(credential.provider);
	},
	readBootstrapCredential: readExternalCliBootstrapCredential
});
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.oauthTestApi")] = {
	isRefreshTokenReusedError,
	resetOAuthRefreshQueuesForTest: oauthManager.resetRefreshQueuesForTest
};
async function resolveOAuthProfileAccess(params, credential, personalStore) {
	const readCurrentCredential = !personalStore && credential.authFlow === "chatgpt-token-sharing" ? await prepareAuthProfileCredentialRead(params) : null;
	const resolved = await oauthManager.resolveOAuthAccess({
		personalStore,
		store: params.store,
		profileId: params.profileId,
		credential,
		agentDir: params.agentDir,
		cfg: params.cfg,
		forceRefresh: params.forceRefresh,
		validateCredential: params.validateOAuthCredential,
		signal: params.signal
	});
	return resolved ? buildApiKeyProfileResult({
		apiKey: resolved.apiKey,
		provider: resolved.credential.provider,
		email: resolved.credential.email ?? credential.email,
		profileId: params.profileId,
		profileType: credential.type,
		credential: resolved.credential,
		readCurrentCredential: personalStore?.readCurrentCredential ?? readCurrentCredential
	}) : null;
}
async function tryResolveOAuthProfile(params) {
	const { cfg, store, profileId } = params;
	if (profileId === "anthropic:claude-cli") return null;
	const cred = store.profiles[profileId];
	if (!cred || cred.type !== "oauth" || !isSetupCredentialAccessible({
		profileId,
		credential: cred,
		agentDir: params.agentDir
	})) return null;
	if (!isProfileConfigCompatible({
		cfg,
		profileId,
		provider: cred.provider,
		mode: cred.type
	})) return null;
	const resolved = await resolveOAuthProfileAccess(params, cred);
	params.signal?.throwIfAborted();
	return resolved;
}
function authProfileSecretRefKey(profile, defaults) {
	const ref = profile.type === "api_key" ? parseSecretRef(profile.keyRef, defaults) ?? parseSecretRef(profile.key, defaults) : profile.type === "token" ? parseSecretRef(profile.tokenRef, defaults) ?? parseSecretRef(profile.token, defaults) : null;
	return ref ? secretRefKey(ref) : void 0;
}
function resolveRuntimeAuthProfile(params) {
	const setupProfile = getSetupCredentialRuntimeProfile(params);
	const runtimeProfile = setupProfile === void 0 ? getRuntimeAuthProfileStoreSnapshotCore(params.agentDir)?.profiles[params.profileId] : setupProfile;
	const inputRefKey = authProfileSecretRefKey(params.profile, params.defaults);
	const runtimeRefKey = runtimeProfile ? authProfileSecretRefKey(runtimeProfile, params.defaults) : void 0;
	const published = Boolean(runtimeProfile && (isDeepStrictEqual(runtimeProfile, params.profile) || inputRefKey && runtimeRefKey === inputRefKey && runtimeProfile.type === params.profile.type && runtimeProfile.provider === params.profile.provider));
	let profile = params.profile;
	if (published && runtimeProfile?.type === "api_key" && params.profile.type === "api_key") {
		const value = runtimeProfile.key;
		profile = {
			...params.profile,
			key: value
		};
	} else if (published && runtimeProfile?.type === "token" && params.profile.type === "token") {
		const value = runtimeProfile.token;
		profile = {
			...params.profile,
			token: value
		};
	}
	return {
		profile,
		published
	};
}
/** Resolve a selected auth profile into the provider API key string. */
async function resolveApiKeyForProfile(params) {
	const scopedParams = {
		...params,
		agentDir: resolveRuntimeAuthProfileAgentDir(params.agentDir)
	};
	params.signal?.throwIfAborted();
	const resolved = isUserModelAuthProfileId(params.profileId) ? await withPersonalAuthProfileStore(params.profileId, (owner) => resolveApiKeyForProfileOwned(scopedParams, owner)) ?? null : await resolveApiKeyForProfileOwned(scopedParams);
	params.signal?.throwIfAborted();
	return resolved;
}
async function resolveApiKeyForProfileOwned(params, personalStore) {
	params.signal?.throwIfAborted();
	const { cfg, store, profileId } = params;
	const storedProfile = personalStore ? (await personalStore.read()).profiles[profileId] : store.profiles[profileId];
	params.signal?.throwIfAborted();
	if (!storedProfile || !isSetupCredentialAccessible({
		profileId,
		credential: storedProfile,
		agentDir: params.agentDir
	})) return null;
	if (profileId === "anthropic:claude-cli") return null;
	const configForRefResolution = cfg ?? readRuntimeConfig();
	const refDefaults = configForRefResolution.secrets?.defaults;
	const runtimeProfile = resolveRuntimeAuthProfile({
		agentDir: params.agentDir,
		profileId,
		profile: storedProfile,
		defaults: refDefaults
	});
	const cred = runtimeProfile.profile;
	if (!isProfileConfigCompatible({
		cfg,
		profileId,
		provider: cred.provider,
		mode: cred.type
	})) return null;
	assertNoOAuthSecretRefPolicyViolations({
		store,
		cfg: configForRefResolution,
		profileIds: [profileId],
		context: `auth profile ${profileId}`
	});
	if (cred.type === "api_key" || cred.type === "token") {
		if (cred.type === "api_key") {
			if (!evaluateStoredCredentialEligibility({ credential: cred }).eligible) return null;
		} else {
			const expiryState = resolveTokenExpiryState(cred.expires);
			if (expiryState === "expired" || expiryState === "invalid_expires") return null;
		}
		const ownerId = resolveAuthProfileSecretOwnerId(params);
		const degraded = findActiveDegradedSecretOwner("account", ownerId);
		if (degraded && runtimeProfile.published) throw new SecretSurfaceUnavailableError(degraded);
		const inlineValue = cred.type === "api_key" ? cred.key : cred.token;
		const refKey = authProfileSecretRefKey(cred, refDefaults);
		const apiKey = normalizeOptionalSecretInput(inlineValue);
		if (refKey && (!runtimeProfile.published || !apiKey)) throw new SecretSurfaceUnavailableError({
			ownerKind: "account",
			ownerId,
			state: "unavailable",
			paths: [`auth-profiles.${profileId}.${cred.type === "api_key" ? "key" : "token"}`],
			refKeys: [refKey],
			reason: "secret reference was not materialized by the active runtime"
		});
		if (!apiKey) return null;
		return buildApiKeyProfileResult({
			apiKey,
			provider: cred.provider,
			email: cred.email,
			profileId,
			profileType: cred.type,
			readCurrentCredential: personalStore?.readCurrentCredential
		});
	}
	try {
		const resolved = await resolveOAuthProfileAccess(params, cred, personalStore);
		params.signal?.throwIfAborted();
		return resolved;
	} catch (error) {
		params.signal?.throwIfAborted();
		if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
		let settlementComplete = isSettledOAuthRefreshFailure(error);
		let refreshedStore = error instanceof OAuthManagerRefreshError ? error.getRefreshedStore() : personalStore ? await personalStore.read() : await loadAuthProfileStoreForRuntimeAsync(params.agentDir, {
			profileId,
			readOnly: true,
			allowKeychainPrompt: false
		});
		const surfacedCause = error instanceof OAuthManagerRefreshError && error.cause ? error.cause : error;
		if (isRefreshTokenReusedError(surfacedCause)) {
			const ownerAgentDir = await resolvePersistedAuthProfileOwnerAgentDirAsync({
				agentDir: params.agentDir,
				profileId
			});
			let clearedLastGood = false;
			try {
				await clearLastGoodProfileWithLock({
					provider: cred.provider,
					profileId,
					agentDir: ownerAgentDir
				});
				clearedLastGood = true;
			} catch (cleanupError) {
				settlementComplete = false;
				authProfilesLog.warn("failed to clear stale OAuth last-good state after refresh failure", { error: formatErrorMessage(cleanupError) });
			}
			const snapshot = params.agentDir !== ownerAgentDir ? getRuntimeAuthProfileStoreSnapshotCore(params.agentDir) : void 0;
			if (snapshot) {
				const providerKey = resolveProviderIdForAuth(cred.provider);
				if (snapshot.lastGood?.[providerKey] === profileId) {
					delete snapshot.lastGood[providerKey];
					if (Object.keys(snapshot.lastGood).length === 0) snapshot.lastGood = void 0;
					updateRuntimeAuthProfileStoreSnapshot(snapshot, params.agentDir);
				}
			}
			if (clearedLastGood) refreshedStore = personalStore ? await personalStore.read() : await loadAuthProfileStoreForRuntimeAsync(params.agentDir, {
				profileId,
				readOnly: true,
				allowKeychainPrompt: false
			});
		}
		const fallbackProfileId = params.allowProfileFallback === false ? null : suggestOAuthProfileIdForLegacyDefault({
			cfg,
			store: refreshedStore,
			provider: cred.provider,
			legacyProfileId: profileId
		});
		if (fallbackProfileId && fallbackProfileId !== profileId) try {
			const fallbackResolved = await tryResolveOAuthProfile({
				cfg,
				store: refreshedStore,
				profileId: fallbackProfileId,
				agentDir: params.agentDir,
				forceRefresh: params.forceRefresh,
				validateOAuthCredential: params.validateOAuthCredential,
				signal: params.signal
			});
			params.signal?.throwIfAborted();
			if (fallbackResolved) return fallbackResolved;
		} catch {
			params.signal?.throwIfAborted();
		}
		const message = formatErrorMessage(surfacedCause);
		const hint = await formatAuthDoctorHint({
			cfg,
			store: refreshedStore,
			provider: cred.provider,
			profileId
		});
		const failure = new OAuthRefreshFailureError({
			provider: cred.provider,
			profileId,
			message: `OAuth token refresh failed for ${cred.provider}: ${message}. Please try again or re-authenticate.` + (hint ? `\n\n${hint}` : ""),
			cause: error
		});
		if (settlementComplete) markOAuthRefreshFailureSettled(failure);
		throw failure;
	}
}
//#endregion
export { resolveApiKeyForProfile as n, formatAuthDoctorHint as r, refreshOAuthCredentialForRuntime as t };
