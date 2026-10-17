import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { c as trackAsyncWork } from "./async-work-scope-BYeX3gh6.mjs";
import { _ as secretRefKey } from "./ref-contract-D0kWy5jy.mjs";
import { f as normalizeSecretInputString, h as parseSecretRef } from "./types.secrets-DsPRn9Dz.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import "./file-lock-CkzOvhYo.mjs";
import "./file-lock-Cl3feKST.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-15nvbxqy.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import "./profile-ids-B9fFWPvP.mjs";
import { i as getOAuthProviders, r as getOAuthApiKey, t as OAuthProviderConfiguredUnavailableError } from "./provider-runtime.errors-DQLUNCYE.mjs";
import { c as resolveProviderOAuthRefreshCapabilityWithPlugin, n as buildProviderAuthDoctorHintWithPlugin, r as formatProviderAuthProfileApiKeyWithPlugin, s as resolveProviderOAuthCredentialWithPlugin } from "./provider-runtime.runtime.js";
import { a as resolveOAuthRefreshLockPath, c as resolveSharedAuthStorePath } from "./path-resolve-CIRhdX6A.mjs";
import { g as resolveAuthProfileDatabasePath } from "./sqlite-CW8wNN4G.mjs";
import { n as resolveAuthProfileSecretOwnerId } from "./runtime-auth-profile-owner-lkATIqd6.mjs";
import { c as findActiveDegradedSecretOwner, n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-oevwKU3u.mjs";
import { v as isUserModelAuthProfileId } from "./profile-usage-stats-BLwxBqRR.mjs";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { C as authProfilesLog, x as OAUTH_REFRESH_CALL_TIMEOUT_MS } from "./persisted-BVyWmvfF.mjs";
import { a as resolveTokenExpiryState, c as createOAuthRefreshFence, d as isSameOAuthRefreshGeneration, f as readOAuthRefreshGenerationDigest, l as isOAuthRefreshFence, n as evaluateStoredCredentialEligibility, p as readPendingOAuthRefreshClaimId, r as hasUsableOAuthCredential, s as createFailedOAuthRefreshFence, u as isPendingOAuthRefreshFence } from "./credential-state-WXO5HScp.mjs";
import { a as isSafeToAdoptBootstrapOAuthIdentity, b as observeCanonicalAuthProfileCredentials, c as shouldBootstrapFromExternalCliCredential, g as shouldMirrorRefreshedOAuthCredential, i as isSafeOAuthPostClaimSettlement, n as hasMatchingOAuthIdentity, o as isSafeToAdoptMainStoreOAuthIdentity, r as isSafeOAuthOwnerRefreshResult } from "./oauth-shared-CFtD6sCU.mjs";
import { E as readExternalCliBootstrapCredential, i as findPersistedAuthProfileCredential, u as resolvePersistedAuthProfileOwnerAgentDir, w as isPersistedExternalCliAuthProfile } from "./store-SwwRUDrm.mjs";
import { d as OAuthRefreshPeerFenceError, f as failOAuthRefreshPeerClaims, h as settleOAuthRefreshPeerClaims, m as rollbackOAuthRefreshPeerClaims, p as fenceOAuthRefreshPeers, t as clearLastGoodProfileWithLock, v as withOAuthProfileLock } from "./profiles-Dk53jI-3.mjs";
import { d as markOAuthRefreshFailureSettled, n as OAuthRefreshFailureError, r as appendOAuthRefreshCleanupErrors, t as OAuthManagerRefreshError, u as isSettledOAuthRefreshFailure } from "./oauth-refresh-failure-B2gKOXl5.mjs";
import { B as isExactOAuthCredential, H as observeOAuthRefreshFenceSettlement, O as updateRuntimeAuthProfileStoreSnapshot, R as beginOAuthRefreshObservation, U as observeOAuthRefreshSettlement, d as getRuntimeAuthProfileStoreSnapshotCore, g as hasRuntimeAuthProfileStoreSnapshot } from "./runtime-snapshots-CSLjByUx.mjs";
import { c as isSetupCredentialAccessible, s as getSetupCredentialRuntimeProfile } from "./order-B7W96aON.mjs";
import { c as loadAuthProfileStoreForSecretsRuntime, i as ensureAuthProfileStoreWithoutExternalProfiles, l as loadAuthProfileStoreWithoutExternalProfiles, p as updateAuthProfileStoreWithLock } from "./store-runtime-Qx0DZ2Si.mjs";
import { t as assertNoOAuthSecretRefPolicyViolations } from "./policy-BLyaiMEH.mjs";
import { n as suggestOAuthProfileIdForLegacyDefault } from "./repair-CkThvU-e.mjs";
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
	if (typeof pluginHint === "string" && pluginHint.trim()) return pluginHint;
	return "";
}
//#endregion
//#region src/agents/auth-profiles/effective-oauth.ts
/**
* Effective OAuth credential resolver.
* Allows external CLI bootstrap credentials to fill unusable local profile state.
*/
/** Select local OAuth unless a safe external bootstrap credential should win. */
function resolveEffectiveOAuthCredentialCore(params) {
	if (isUserModelAuthProfileId(params.profileId)) return params.credential;
	const imported = params.readBootstrapCredential({
		store: params.store,
		profileId: params.profileId,
		credential: params.credential
	});
	if (!imported) return params.credential;
	if (hasUsableOAuthCredential(params.credential)) {
		authProfilesLog.debug("resolved oauth credential from canonical local store", {
			profileId: params.profileId,
			provider: params.credential.provider,
			localExpires: params.credential.expires,
			externalExpires: imported.expires
		});
		return params.credential;
	}
	if (!isSafeToAdoptBootstrapOAuthIdentity(params.credential, imported)) {
		authProfilesLog.warn("refused external oauth bootstrap credential: identity mismatch or missing binding", {
			profileId: params.profileId,
			provider: params.credential.provider
		});
		return params.credential;
	}
	if (shouldBootstrapFromExternalCliCredential({
		existing: params.credential,
		imported
	})) {
		authProfilesLog.debug("resolved oauth credential from external cli bootstrap", {
			profileId: params.profileId,
			provider: imported.provider,
			localExpires: params.credential.expires,
			externalExpires: imported.expires
		});
		return imported;
	}
	return params.credential;
}
/** Resolves the effective OAuth credential, optionally reading external CLI bootstrap state. */
function resolveEffectiveOAuthCredential(params) {
	return resolveEffectiveOAuthCredentialCore({
		store: params.store,
		profileId: params.profileId,
		credential: params.credential,
		readBootstrapCredential: ({ store, profileId, credential }) => readExternalCliBootstrapCredential({
			store,
			profileId,
			credential,
			allowKeychainPrompt: params.allowKeychainPrompt ?? false
		})
	});
}
//#endregion
//#region src/agents/auth-profiles/oauth-refresh-lock-errors.ts
/**
* OAuth refresh lock error helpers.
* Distinguishes global refresh-lock contention from auth-store lock timeouts
* and builds the user-facing contention error.
*/
/** Returns true when an error came from the global OAuth refresh lock. */
function isGlobalRefreshLockTimeoutError(error, lockPath) {
	const candidate = typeof error === "object" && error !== null ? error : void 0;
	return candidate?.code === "file_lock_timeout" && candidate.lockPath === `${lockPath}.lock`;
}
/** Builds the user-facing OAuth refresh contention error. */
function buildRefreshContentionError(params) {
	return Object.assign(new Error(`OAuth refresh failed (refresh_contention): another process is already refreshing ${params.provider} for ${params.profileId}. Please wait for the in-flight refresh to finish and retry.`, { cause: params.cause }), {
		code: "refresh_contention",
		cause: params.cause
	});
}
//#endregion
//#region src/agents/auth-profiles/oauth-manager.ts
const oauthRefreshRecoveryBuildFailures = /* @__PURE__ */ new WeakSet();
function canReuseOAuthCredentialAfterRefreshFailure(params) {
	return !params.forceRefresh || params.attempted.provider === params.candidate.provider && params.attempted.access !== params.candidate.access && hasMatchingOAuthIdentity(params.attempted, params.candidate);
}
function loadStoredOAuthRefreshStore(agentDir, profileId) {
	return loadAuthProfileStoreWithoutExternalProfiles(agentDir, {
		allowKeychainPrompt: true,
		profileId
	});
}
/** Create an OAuth manager bound to provider-specific build/refresh adapters. */
function createOAuthManager(adapter) {
	async function buildValidatedAccess(credential, context) {
		context.validateCredential?.(credential);
		return {
			apiKey: await adapter.buildApiKey(credential.provider, credential, {
				cfg: context.cfg,
				agentDir: context.agentDir
			}),
			credential
		};
	}
	function adoptNewerMainOAuthCredential(params) {
		if (!params.agentDir || isUserModelAuthProfileId(params.profileId)) return null;
		try {
			const mainCred = ensureAuthProfileStoreWithoutExternalProfiles(void 0, { allowKeychainPrompt: false }).profiles[params.profileId];
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
		const authoritativeSharedCredential = params.claim.authPath === resolveSharedAuthStorePath() ? params.replacement : await resolveAuthoritativeSharedOAuthCredentialUnderLock({
			profileId: params.claim.profileId,
			candidate: params.replacement,
			validateCredential: params.validateCredential
		});
		settleOAuthRefreshPeerClaims({
			profileId: params.claim.profileId,
			fence: params.claim.fence,
			claims: params.claims,
			authoritativeSharedCredential,
			replacement: params.replacement
		});
	}
	async function settleOAuthRefreshClaim(params) {
		const current = loadStoredOAuthRefreshStore(params.agentDir, params.profileId).profiles[params.profileId];
		if (current?.type === "oauth" && !isExactOAuthCredential(current, params.fence) && isSafeOAuthPostClaimSettlement(params.generation, current)) return {
			credential: current,
			persisted: false
		};
		let credential = null;
		let persisted = false;
		return await updateAuthProfileStoreWithLock({
			agentDir: params.agentDir,
			profileId: params.profileId,
			updater: (store) => {
				const existing = store.profiles[params.profileId];
				if (existing?.type !== "oauth") return false;
				if (isExactOAuthCredential(existing, params.fence)) {
					store.profiles[params.profileId] = { ...params.refreshed };
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
		if (await updateAuthProfileStoreWithLock({
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
		if (await updateAuthProfileStoreWithLock({
			agentDir: params.ownerAgentDir,
			profileId: params.profileId,
			updater: (store) => {
				const existing = store.profiles[params.profileId];
				if (!isExactOAuthCredential(existing, params.fence)) return false;
				store.profiles[params.profileId] = { ...params.original };
				restored = true;
				return true;
			}
		}) !== null && restored) return;
		await markOAuthRefreshClaimFailed({
			agentDir: params.ownerAgentDir,
			profileId: params.profileId,
			fence: params.fence
		});
	}
	function mergePeerClaims(existing, discovered) {
		const claims = new Map(existing.map((claim) => [claim.candidate.databasePath, claim]));
		for (const claim of discovered) {
			const current = claims.get(claim.candidate.databasePath);
			claims.set(claim.candidate.databasePath, current?.original ? current : claim);
		}
		return [...claims.values()].toSorted((left, right) => left.candidate.databasePath.localeCompare(right.candidate.databasePath));
	}
	async function claimOAuthRefresh(params) {
		const personalProfile = isUserModelAuthProfileId(params.profileId);
		const ownerAgentDir = personalProfile ? void 0 : resolvePersistedAuthProfileOwnerAgentDir(params);
		const authPath = ownerAgentDir ? resolveAuthProfileDatabasePath(ownerAgentDir) : resolveSharedAuthStorePath();
		const globalRefreshLockPath = resolveOAuthRefreshLockPath(params.provider, params.profileId);
		const peerConfig = params.cfg ?? {};
		const fenceTerminalPeers = (credential) => fenceOAuthRefreshPeers({
			cfg: peerConfig,
			ownerDatabasePath: authPath,
			profileId: params.profileId,
			generation: credential,
			fence: credential
		});
		let observation;
		let observationTransferred = false;
		try {
			const claim = await withOAuthProfileLock({
				provider: params.provider,
				profileId: params.profileId
			}, async () => {
				params.signal?.throwIfAborted();
				const cred = loadStoredOAuthRefreshStore(ownerAgentDir, params.profileId).profiles[params.profileId];
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
					const mainCred = loadStoredOAuthRefreshStore(void 0).profiles[params.profileId];
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
					const peerClaims = personalProfile ? [] : await fenceTerminalPeers(cred);
					failOAuthRefreshPeerClaims({
						profileId: params.profileId,
						fence: cred,
						claims: peerClaims
					});
					return { kind: "unavailable" };
				}
				if (normalizeSecretInputString(credentialToRefresh.refresh) === void 0) return { kind: "unavailable" };
				if (!await adapter.canRefreshCredential(credentialToRefresh, {
					cfg: params.cfg,
					agentDir: params.agentDir
				})) return { kind: "unavailable" };
				const fence = createOAuthRefreshFence({
					profileId: params.profileId,
					credential: credentialToRefresh
				});
				const claimId = readPendingOAuthRefreshClaimId(fence);
				if (!claimId) throw new Error("OAuth refresh fence is missing its claim identity");
				observation = beginOAuthRefreshObservation({
					databasePath: authPath,
					profileId: params.profileId,
					provider: params.provider,
					claimId,
					generation: readOAuthRefreshGenerationDigest({
						profileId: params.profileId,
						credential: fence
					})
				});
				let claimed = false;
				if (await updateAuthProfileStoreWithLock({
					agentDir: ownerAgentDir,
					profileId: params.profileId,
					updater: (authoritative) => {
						const existing = authoritative.profiles[params.profileId];
						params.signal?.throwIfAborted();
						if (!isExactOAuthCredential(existing, cred)) return false;
						authoritative.profiles[params.profileId] = fence;
						claimed = true;
						return true;
					}
				}) === null || !claimed) {
					const current = loadStoredOAuthRefreshStore(ownerAgentDir, params.profileId).profiles[params.profileId];
					if (current?.type !== "oauth" || current.provider !== params.provider) return { kind: "unavailable" };
					if (!isOAuthRefreshFence(current)) params.validateCredential?.(current);
					if (isPendingOAuthRefreshFence(current)) return {
						kind: "observe",
						ownerAgentDir,
						generation: current
					};
					if (isOAuthRefreshFence(current)) {
						const peerClaims = personalProfile ? [] : await fenceTerminalPeers(current);
						failOAuthRefreshPeerClaims({
							profileId: params.profileId,
							fence: current,
							claims: peerClaims
						});
						return { kind: "unavailable" };
					}
					return hasUsableOAuthCredential(current) ? {
						kind: "use",
						credential: current
					} : { kind: "unavailable" };
				}
				let peerClaims = [];
				const peerGeneration = credentialToRefresh === cred ? cred : void 0;
				try {
					if (!personalProfile && peerGeneration) peerClaims = await fenceOAuthRefreshPeers({
						cfg: peerConfig,
						ownerDatabasePath: authPath,
						profileId: params.profileId,
						generation: peerGeneration,
						fence,
						rollbackOnFailure: false,
						onFence: observation.includeDatabase
					});
				} catch (error) {
					observation.beginSettlement();
					if (error instanceof OAuthRefreshPeerFenceError) peerClaims = mergePeerClaims(peerClaims, error.claims);
					const cleanupErrors = [];
					try {
						rollbackOAuthRefreshPeerClaims({
							profileId: params.profileId,
							fence,
							claims: peerClaims
						});
					} catch (cleanupError) {
						cleanupErrors.push(cleanupError);
					}
					try {
						await rollbackOAuthRefreshOwnerClaim({
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
			read: () => loadStoredOAuthRefreshStore(claim.ownerAgentDir, params.profileId).profiles[params.profileId],
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
		const rediscoverPeerClaims = async (generation) => {
			try {
				activePeerClaims = mergePeerClaims(activePeerClaims, await fenceOAuthRefreshPeers({
					cfg: peerConfig,
					ownerDatabasePath: claim.authPath,
					profileId: params.profileId,
					generation,
					fence: claim.fence,
					rollbackOnFailure: false,
					onFence: claim.observation.includeDatabase
				}));
			} catch (error) {
				if (error instanceof OAuthRefreshPeerFenceError) activePeerClaims = mergePeerClaims(activePeerClaims, error.claims);
				throw error;
			}
		};
		const failClaim = async () => {
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
						const owner = loadStoredOAuthRefreshStore(claim.ownerAgentDir, params.profileId).profiles[params.profileId];
						supersedingOwner = owner?.type === "oauth" && !isExactOAuthCredential(owner, claim.fence) && isSafeOAuthPostClaimSettlement(claim.credential, owner) && canReuseOAuthCredentialAfterRefreshFailure({
							forceRefresh: params.forceRefresh,
							attempted: claim.credential,
							candidate: owner
						}) ? owner : null;
					} catch (error) {
						cleanupErrors.push(error);
					}
					if (claim.peerGeneration) try {
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
					try {
						failOAuthRefreshPeerClaims({
							profileId: params.profileId,
							fence: claim.fence,
							claims: activePeerClaims
						});
					} catch (error) {
						cleanupErrors.push(error);
					}
					try {
						await markOAuthRefreshClaimFailed({
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
			claim.observation.beginSettlement();
			const initiatingError = failure ? toErrorObject(failure.error, "OAuth refresh failed") : void 0;
			const { supersedingOwner, validationError, cleanupErrors } = await failClaim();
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
		const settlement = trackAsyncWork(async () => {
			let refreshed;
			try {
				refreshed = await adapter.refreshCredential(claim.credential, {
					cfg: params.cfg,
					agentDir: params.agentDir
				});
			} catch (error) {
				return await settleFailure({
					error,
					externalRefresh: true
				});
			}
			claim.observation.beginSettlement();
			if (!refreshed) return await settleFailure();
			try {
				const rotated = {
					...claim.credential,
					...refreshed,
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
						agentDir: claim.ownerAgentDir,
						profileId: params.profileId,
						generation: claim.credential,
						fence: claim.fence,
						refreshed: rotated
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
							try {
								failOAuthRefreshPeerClaims({
									profileId: params.profileId,
									fence: claim.fence,
									claims: activePeerClaims
								});
							} catch (error) {
								cleanupErrors.push(error);
							}
							if (claimSettlement.persisted) try {
								await markOAuthRefreshClaimFailed({
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
						try {
							failOAuthRefreshPeerClaims({
								profileId: params.profileId,
								fence: claim.fence,
								claims: activePeerClaims
							});
						} catch (error) {
							authProfilesLog.warn("failed to terminally fence an OAuth refresh peer", {
								profileId: params.profileId,
								error: formatErrorMessage(error)
							});
						}
						authProfilesLog.warn("OAuth refresh peer settlement degraded", {
							profileId: params.profileId,
							error: formatErrorMessage(peerSettlementError)
						});
					}
					return claimSettlement;
				});
				if (!settled) throw new Error("Failed to persist refreshed OAuth credential");
				observeCanonicalAuthProfileCredentials(claim.authPath, { [params.profileId]: settled.credential });
				return await buildValidatedAccess(settled.credential, params);
			} catch (error) {
				if (error instanceof OAuthSettlementCredentialValidationError) throw error;
				return await settleFailure({ error });
			}
		});
		settlement.then(claim.observation.finish, claim.observation.finish);
		return await observeOAuthRefreshSettlement(`refreshOAuthCredential(${claim.credential.provider})`, OAUTH_REFRESH_CALL_TIMEOUT_MS, settlement, params.signal);
	}
	async function resolveOAuthAccess(params) {
		params.signal?.throwIfAborted();
		const personalProfile = isUserModelAuthProfileId(params.profileId);
		let credential = params.credential;
		if (personalProfile) {
			const owned = loadStoredOAuthRefreshStore(params.agentDir, params.profileId).profiles[params.profileId];
			if (owned?.type !== "oauth") return null;
			credential = owned;
		}
		const newerMainCredential = adoptNewerMainOAuthCredential({
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
			store: params.store,
			profileId: params.profileId,
			credential: adoptedCredential
		});
		const effectiveCredential = resolveEffectiveOAuthCredentialCore({
			store: params.store,
			profileId: params.profileId,
			credential: adoptedCredential,
			readBootstrapCredential: () => bootstrapCredential
		});
		const attemptedCredentials = [];
		if (!params.forceRefresh && !isOAuthRefreshFence(adoptedCredential) && hasUsableOAuthCredential(effectiveCredential)) return await buildValidatedAccess(effectiveCredential, params);
		try {
			const queued = trackAsyncWork(() => refreshQueue.enqueue(`${credential.provider}\u0000${params.profileId}`, () => refreshOAuthTokenWithLock({
				profileId: params.profileId,
				provider: credential.provider,
				agentDir: params.agentDir,
				cfg: params.cfg,
				signal: params.signal,
				forceRefresh: params.forceRefresh,
				attemptedCredential: effectiveCredential,
				attemptedCredentials,
				bootstrapCredential,
				bootstrapBaseCredential: adoptedCredential,
				validateCredential: params.validateCredential
			})));
			const resolved = await racePromiseWithAbortSignal(queued, params.signal);
			params.signal?.throwIfAborted();
			return resolved;
		} catch (error) {
			params.signal?.throwIfAborted();
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
				refreshedStore = loadStoredOAuthRefreshStore(params.agentDir, params.profileId);
				recoveryStoreLoaded = true;
			} catch (cleanupError) {
				refreshError = appendOAuthRefreshCleanupErrors(refreshError, [cleanupError]);
			}
			const claimedGeneration = attemptedCredentials.at(-1) ?? effectiveCredential;
			const refreshed = refreshedStore.profiles[params.profileId];
			if (recoveryStoreLoaded && !recoveryBuildFailed) {
				if (refreshed?.type === "oauth" && isSafeOAuthPostClaimSettlement(claimedGeneration, refreshed) && canReuseOAuthCredentialAfterRefreshFailure({
					forceRefresh: params.forceRefresh,
					attempted: claimedGeneration,
					candidate: refreshed
				})) {
					const recovered = await buildRecoveryAccess(refreshed);
					if (recovered) return recovered;
				}
			}
			if (recoveryStoreLoaded && params.agentDir && !personalProfile && !recoveryBuildFailed) try {
				const mainCred = ensureAuthProfileStoreWithoutExternalProfiles(void 0, { allowKeychainPrompt: false }).profiles[params.profileId];
				if (mainCred?.type === "oauth" && isSafeOAuthPostClaimSettlement(claimedGeneration, mainCred) && canReuseOAuthCredentialAfterRefreshFailure({
					forceRefresh: params.forceRefresh,
					attempted: claimedGeneration,
					candidate: mainCred
				})) {
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
/** Bearer-token auth modes that are interchangeable (oauth tokens and raw tokens). */
const BEARER_AUTH_MODES = /* @__PURE__ */ new Set(["oauth", "token"]);
const isCompatibleModeType = (mode, type) => {
	if (!mode || !type) return false;
	if (mode === type) return true;
	return BEARER_AUTH_MODES.has(mode) && BEARER_AUTH_MODES.has(type);
};
function isProfileConfigCompatible(params) {
	const profileConfig = params.cfg?.auth?.profiles?.[params.profileId];
	if (profileConfig && profileConfig.provider !== params.provider) return false;
	if (profileConfig && !isCompatibleModeType(profileConfig.mode, params.mode)) return false;
	return true;
}
async function buildOAuthApiKey(provider, credentials, context) {
	const formatted = await formatProviderAuthProfileApiKeyWithPlugin({
		provider,
		config: context.cfg,
		context: credentials
	});
	return typeof formatted === "string" && formatted.length > 0 ? formatted : credentials.access;
}
function buildApiKeyProfileResult(params) {
	const result = {
		apiKey: params.apiKey,
		provider: params.provider,
		email: params.email
	};
	Object.defineProperties(result, {
		profileId: {
			value: params.profileId,
			enumerable: false
		},
		profileType: {
			value: params.profileType,
			enumerable: false
		},
		credential: {
			value: params.credential,
			enumerable: false
		}
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
async function canRefreshOAuthCredential(credential, context = {}) {
	const pluginCapability = await resolveProviderOAuthRefreshCapabilityWithPlugin({
		provider: credential.provider,
		config: context.cfg
	});
	if (pluginCapability.status === "available") return true;
	if (pluginCapability.status === "configured-unavailable") throw new OAuthProviderConfiguredUnavailableError(credential.provider);
	return OAUTH_PROVIDER_IDS.has(credential.provider);
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
	buildApiKey: buildOAuthApiKey,
	refreshCredential: refreshOAuthCredential,
	canRefreshCredential: canRefreshOAuthCredential,
	readBootstrapCredential: readExternalCliBootstrapCredential
});
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.oauthTestApi")] = {
	isRefreshTokenReusedError,
	resetOAuthRefreshQueuesForTest: oauthManager.resetRefreshQueuesForTest
};
async function resolveOAuthProfileAccess(params, credential) {
	const resolved = await oauthManager.resolveOAuthAccess({
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
		credential: resolved.credential
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
function assertRuntimeAuthProfileSecretOwnerAvailable(params) {
	const degraded = findActiveDegradedSecretOwner("account", resolveAuthProfileSecretOwnerId(params));
	if (degraded && params.published) throw new SecretSurfaceUnavailableError(degraded);
}
function throwUnmaterializedAuthProfileSecretRef(params) {
	throw new SecretSurfaceUnavailableError({
		ownerKind: "account",
		ownerId: resolveAuthProfileSecretOwnerId(params),
		state: "unavailable",
		paths: [`auth-profiles.${params.profileId}.${params.pathSuffix}`],
		refKeys: [secretRefKey(params.ref)],
		reason: "secret reference was not materialized by the active runtime"
	});
}
/** Resolve a selected auth profile into the provider API key string. */
async function resolveApiKeyForProfile(params) {
	params.signal?.throwIfAborted();
	const { cfg, store, profileId } = params;
	const storedProfile = isUserModelAuthProfileId(profileId) ? findPersistedAuthProfileCredential({
		agentDir: params.agentDir,
		profileId
	}) : store.profiles[profileId];
	if (!storedProfile || !isSetupCredentialAccessible({
		profileId,
		credential: storedProfile,
		agentDir: params.agentDir
	})) return null;
	if (profileId === "anthropic:claude-cli") return null;
	const configForRefResolution = cfg ?? getRuntimeConfig();
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
		assertRuntimeAuthProfileSecretOwnerAvailable({
			agentDir: params.agentDir,
			profileId,
			published: runtimeProfile.published
		});
		const inlineValue = cred.type === "api_key" ? cred.key : cred.token;
		const ref = parseSecretRef(cred.type === "api_key" ? cred.keyRef : cred.tokenRef, refDefaults) ?? parseSecretRef(inlineValue, refDefaults);
		const apiKey = normalizeOptionalSecretInput(inlineValue);
		if (ref && (!runtimeProfile.published || !apiKey)) throwUnmaterializedAuthProfileSecretRef({
			agentDir: params.agentDir,
			profileId,
			pathSuffix: cred.type === "api_key" ? "key" : "token",
			ref
		});
		if (!apiKey) return null;
		return buildApiKeyProfileResult({
			apiKey,
			provider: cred.provider,
			email: cred.email,
			profileId,
			profileType: cred.type
		});
	}
	try {
		const resolved = await resolveOAuthProfileAccess(params, cred);
		params.signal?.throwIfAborted();
		return resolved;
	} catch (error) {
		params.signal?.throwIfAborted();
		let settlementComplete = isSettledOAuthRefreshFailure(error);
		let refreshedStore = error instanceof OAuthManagerRefreshError ? error.getRefreshedStore() : loadAuthProfileStoreForSecretsRuntime(params.agentDir, { profileId });
		const surfacedCause = error instanceof OAuthManagerRefreshError && error.cause ? error.cause : error;
		if (isRefreshTokenReusedError(surfacedCause)) {
			const ownerAgentDir = resolvePersistedAuthProfileOwnerAgentDir({
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
			if (params.agentDir !== ownerAgentDir && hasRuntimeAuthProfileStoreSnapshot(params.agentDir)) {
				const snapshot = getRuntimeAuthProfileStoreSnapshotCore(params.agentDir);
				const providerKey = resolveProviderIdForAuth(cred.provider);
				if (snapshot?.lastGood?.[providerKey] === profileId) {
					delete snapshot.lastGood[providerKey];
					if (Object.keys(snapshot.lastGood).length === 0) snapshot.lastGood = void 0;
					updateRuntimeAuthProfileStoreSnapshot(snapshot, params.agentDir);
				}
			}
			if (clearedLastGood) refreshedStore = loadAuthProfileStoreForSecretsRuntime(params.agentDir, { profileId });
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
export { formatAuthDoctorHint as i, resolveApiKeyForProfile as n, resolveEffectiveOAuthCredential as r, refreshOAuthCredentialForRuntime as t };
