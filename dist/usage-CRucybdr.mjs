import { A as resolveExpiresAtMsFromEpochSeconds, T as positiveSecondsToSafeMilliseconds, g as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { Et as _enum, Fn as object, Lt as boolean, Nt as array, Pn as number } from "./schemas-BOYIvvln.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { a as isSqliteLockError, d as sqlitePrimaryResultCode } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { C as isAuthCooldownBypassedForProvider, H as authProfilesLog, S as isActiveUnusableWindow, T as isCooldownScopedToDifferentModel, U as reportCommittedInlineAuthFailure, W as isUserModelAuthProfileId, j as resolveInlineProviderApiKeyUsageId, w as isBlockedWindowActiveForModel } from "./user-model-account-authority-DFFjC5J5.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { L as resolveLegacyAuthProfileSourceCandidates, _ as resolveAuthProfileDatabaseOwnerId, c as prepareAuthProfileWriteEnvironment, u as prepareAuthProfileWriteTransactionAsync, v as resolveAuthProfileDatabasePath } from "./sqlite-BlFpr2YD.mjs";
import { d as resolveSharedAuthStorePath, l as resolveSharedAuthStoreOwnership } from "./path-resolve-21Orzn6B.mjs";
import { a as assertAuthProfileMigrationStateAtDatabasePath, r as assertAuthProfileMigrationCandidates } from "./legacy-source-diagnostic-CLlkIevG.mjs";
import { t as clearRuntimeAuthProfileStoreSnapshotAtDatabasePath } from "./runtime-snapshots-HRosak4u.mjs";
import { o as resolveProviderModelAuthPolicy } from "./model-runtime-policy-DSkspt0X.mjs";
import { u as isSettledOAuthRefreshFailure } from "./oauth-refresh-failure-H1_-S915.mjs";
import { n as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import { a as resolveAuthProfileOrder } from "./order-CElLtwMu.mjs";
import "./http-body-DZQjJc2J.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-B70cE6fn.mjs";
import { S as publishInlineAuthFailure, _ as captureAuthProfileWriteExecution, b as runAuthProfileUsage, c as getScopedSharedAuthStore, f as resolveRuntimeAuthProfileAgentDir, s as getScopedAuthProfileEnv, t as applyScopedAuthReadThrough, y as reserveAuthProfileUsagePreparation } from "./store-BPXZsh12.mjs";
import { t as loadPersistedAuthProfileStoreFromRows } from "./sqlite-read-BnaiPHv1.mjs";
import { a as withAuthProfileCleanup } from "./source-check--zMBJ43Q.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-CjVOxCE5.mjs";
import { d as resolveProviderRequestHeaders } from "./provider-request-config-WdycwKIG.mjs";
import { C as updateAuthProfileStoreWithLock, g as loadAuthProfileStoreWithoutExternalProfilesAsync, y as resolvePersistedAuthProfileOwnerAgentDirAsync } from "./store-runtime-CwqGD12G.mjs";
import { i as preparePersonalAuthProfileUsage, n as logAuthProfileFailureStateChange, r as logDroppedAuthProfileBookkeeping, t as withAuthProfileUsage } from "./usage-write-Dtj4IDy-.mjs";
import { a as resolveActiveWindowUntil, n as matchesWhamBlockGeneration, r as reconcileWhamBlock, s as resolveUsageWindowUntil, t as isSameWhamCredential } from "./usage-reduction-CowLLP6a.mjs";
//#region src/agents/auth-profiles/inline-usage.ts
function inlineAuthFailureError(payload) {
	const error = /* @__PURE__ */ new Error("Auth usage transaction failed");
	retainOpenClawStateWorkerErrorPayload(error, payload);
	return hydrateOpenClawStateWorkerError(error, { includeOrdinary: true });
}
/** The retry controller's inline failure belongs to its explicit agent database. */
async function persistInlineAuthFailure(agentDir, input) {
	const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
	const env = prepareAuthProfileWriteEnvironment({ env: getScopedAuthProfileEnv() });
	if (!effectiveAgentDir) throw new Error("Inline auth failure requires its selected agent directory");
	const databasePath = resolveAuthProfileDatabasePath(effectiveAgentDir);
	return runAuthProfileUsage(async () => {
		const execution = captureAuthProfileWriteExecution({
			path: databasePath,
			agentId: resolveAuthProfileDatabaseOwnerId(effectiveAgentDir),
			env
		});
		const inheritedUsageStats = structuredClone(getScopedSharedAuthStore()?.usageStats);
		let transferred = false;
		const reservation = reserveAuthProfileUsagePreparation([resolveOpenClawStateSqlitePath(env), databasePath]);
		try {
			await reservation.ready;
			const prepared = await prepareAuthProfileWriteTransactionAsync(effectiveAgentDir, { env }, () => execution.assertCurrent());
			transferred = true;
			return await persistPreparedInlineAuthFailure(effectiveAgentDir, input, prepared, execution, inheritedUsageStats);
		} finally {
			if (!transferred) await execution.release();
			reservation.release();
		}
	});
}
async function persistPreparedInlineAuthFailure(effectiveAgentDir, input, prepared, execution, inheritedUsageStats) {
	const { databaseTarget, sharedOwner } = prepared;
	if (databaseTarget.kind !== "agent") throw new Error("Inline auth failure requires its selected agent database");
	const owner = {
		...sharedOwner,
		databasePath: databaseTarget.path
	};
	const candidates = resolveLegacyAuthProfileSourceCandidates({
		agentDir: effectiveAgentDir,
		env: owner.env
	});
	const identity = readDatabasePathIdentitySync(databaseTarget.path);
	let durableReceipt;
	let failure;
	let hasCredentials;
	const assertCurrent = () => {
		execution.assertCurrent();
		if (identity.key.startsWith("file:")) assertExistingDatabaseIdentity(databaseTarget.path, identity.key);
		else if (readDatabasePathIdentitySync(databaseTarget.path).canonicalPath !== identity.canonicalPath) throw new Error("Auth database path changed before inline-failure admission");
		if (resolveSharedAuthStorePath(owner.env) !== owner.sharedDatabasePath || resolveSharedAuthStoreOwnership(owner.env).location !== owner.location) throw new Error("Auth profile shared owner changed before write admission");
		assertAuthProfileMigrationStateAtDatabasePath(owner.databasePath);
		if (hasCredentials !== void 0) assertAuthProfileMigrationCandidates({
			databasePath: owner.databasePath,
			candidates,
			hasCredentials: () => hasCredentials === true
		});
	};
	const runWithAdmission = async () => {
		try {
			return await runOpenClawAgentWriteAdmission(databaseTarget, async () => {
				const client = await openOpenClawAgentSqliteWorkerStore(databaseTarget, { execution }, {
					moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.authProfileInlineUsage),
					input: {}
				});
				const executionResult = await withAuthProfileCleanup(() => client.run(async (scope) => {
					const readTarget = () => scope.execute({
						type: "authProfiles.inlineSnapshot",
						input: void 0
					});
					const rows = await readTarget();
					const store = loadPersistedAuthProfileStoreFromRows(rows, owner.databasePath);
					hasCredentials = Object.keys(store?.profiles ?? {}).length > 0;
					assertCurrent();
					const result = await scope.execute({
						type: "authProfiles.inlineFailure",
						input: {
							...input,
							inheritedUsageStats,
							expectedCredentials: rows.store.status === "readable" ? rows.store.raw : null
						}
					});
					if (!result.ok) return result;
					const { receipt } = result;
					durableReceipt = receipt;
					try {
						await publishInlineAuthFailure(owner, receipt, readTarget, assertCurrent);
					} catch (error) {
						clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(owner.databasePath, effectiveAgentDir);
						reportCommittedInlineAuthFailure("auth usage committed but publication failed", error);
					}
					return result;
				}, assertCurrent), async (outcome) => {
					try {
						await client.close();
					} catch (cleanupError) {
						if (!outcome.ok) throw new AggregateError([outcome.error, cleanupError], "Auth usage and owner cleanup failed", { cause: cleanupError });
						if (!outcome.value.ok) throw new AggregateError([inlineAuthFailureError(outcome.value.error), cleanupError], "Auth usage refusal and owner cleanup failed", { cause: cleanupError });
						reportCommittedInlineAuthFailure("auth usage committed before owner cleanup failed", cleanupError);
					}
				});
				if (!executionResult.ok) throw inlineAuthFailureError(executionResult.error);
				return executionResult.receipt;
			}, true);
		} catch (error) {
			if (durableReceipt) {
				try {
					clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(owner.databasePath, effectiveAgentDir);
				} catch (invalidationError) {
					reportCommittedInlineAuthFailure("auth usage snapshot invalidation failed", invalidationError);
				}
				reportCommittedInlineAuthFailure("auth usage committed before publication or cleanup failed", error);
				return durableReceipt;
			}
			failure = { error };
			const message = error instanceof Error ? error.message : String(error);
			authProfilesLog.warn(`auth profile store update failed: ${message}`, {
				agentDir: effectiveAgentDir,
				error: message
			});
			if (!isSqliteLockError(error)) throw error;
			return null;
		}
	};
	return withAuthProfileCleanup(runWithAdmission, async () => {
		try {
			await execution.release();
		} catch (error) {
			if (durableReceipt) reportCommittedInlineAuthFailure("auth usage committed before captured owner release failed", error);
			else if (failure) throw createSqliteLifecycleAggregateError([failure.error, error], "Auth usage and captured owner release failed", failure.error);
			else throw error;
		}
	});
}
//#endregion
//#region src/agents/auth-profiles/usage.ts
/**
* Auth profile usage accounting and cooldown mutation.
* Records failures under the store lock, applies WHAM usage probes for Codex
* subscription OAuth profiles, and exposes display helpers for unavailable profiles.
*/
const authProfileUsageLog = createSubsystemLogger("agent/embedded");
const testing = { resetWhamReprobeStateForTest() {
	whamReprobesInFlight.clear();
} };
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.authProfileUsageTestApi")] = testing;
async function updateOwnedAuthProfileUsage(store, profileId, update) {
	let changed = false;
	const updated = await updateAuthProfileStoreWithLock({
		...update,
		profileId,
		agentDir: await resolvePersistedAuthProfileOwnerAgentDirAsync({
			agentDir: update.agentDir,
			profileId
		}),
		updater: (freshStore) => {
			changed = update.updater(freshStore);
			return changed;
		}
	});
	const usage = changed ? updated?.usageStats?.[profileId] : void 0;
	if (usage) store.usageStats = {
		...store.usageStats,
		[profileId]: usage
	};
	return updated;
}
const WHAM_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage";
const WHAM_TIMEOUT_MS = 3e3;
const WHAM_BURST_COOLDOWN_MS = 15e3;
const WHAM_PROBE_FAILURE_COOLDOWN_MS = 3e4;
const WHAM_HTTP_ERROR_COOLDOWN_MS = 3e5;
const WHAM_TOKEN_EXPIRED_COOLDOWN_MS = 432e5;
const WHAM_DEAD_ACCOUNT_COOLDOWN_MS = 864e5;
const WHAM_HALF_OPEN_REPROBE_INTERVAL_MS = 3e5;
const whamReprobesInFlight = /* @__PURE__ */ new Map();
const whamUsageWindowSchema = object({
	used_percent: number().optional(),
	reset_at: number().optional(),
	reset_after_seconds: number().optional()
});
const whamRateLimitSchema = object({
	limit_reached: boolean().optional(),
	primary_window: whamUsageWindowSchema.nullish(),
	secondary_window: whamUsageWindowSchema.nullish()
});
const whamUsageSchema = object({
	rate_limit: whamRateLimitSchema,
	additional_rate_limits: array(object({ rate_limit: whamRateLimitSchema.nullish() })).nullish(),
	spend_control: object({ reached: boolean() }).nullish(),
	rate_limit_reached_type: object({ type: _enum([
		"rate_limit_reached",
		"workspace_owner_credits_depleted",
		"workspace_member_credits_depleted",
		"workspace_owner_usage_limit_reached",
		"workspace_member_usage_limit_reached",
		"unknown"
	]) }).nullish()
});
function isWhamOAuthProfile(profile) {
	return profile?.type === "oauth" && Boolean(profile.access) && normalizeProviderId(profile.provider) === "openai" && resolveProviderModelAuthPolicy({
		provider: profile.provider,
		mode: profile.type,
		authFlow: profile.authFlow
	}).authRequirement === "subscription";
}
function shouldProbeWhamForFailure(profile, reason) {
	return isWhamOAuthProfile(profile) && isFutureDateTimestampMs(profile.expires) && (reason === "rate_limit" || reason === "empty_response" || reason === "no_error_details" || reason === "unclassified" || reason === "unknown");
}
function resolveWhamResetMs(window, now) {
	if (window.reset_after_seconds !== void 0 && window.reset_after_seconds > 0) return positiveSecondsToSafeMilliseconds(window.reset_after_seconds) ?? null;
	if (window.reset_at !== void 0 && window.reset_at > 0) {
		const resetAtMs = resolveExpiresAtMsFromEpochSeconds(window.reset_at);
		return resetAtMs === void 0 ? null : Math.max(0, resetAtMs - now);
	}
	return null;
}
function isWhamWindowExhausted(window) {
	return window?.used_percent !== void 0 && window.used_percent >= 100;
}
async function probeWhamForCooldown(profile, profileId) {
	try {
		const version = process.env.OPENCLAW_VERSION?.trim();
		const defaultHeaders = {
			Authorization: `Bearer ${profile.access}`,
			Accept: "application/json",
			originator: "openclaw",
			...version ? { version } : {},
			"User-Agent": `openclaw/${version || "dev"}`
		};
		if (profile.accountId) defaultHeaders["ChatGPT-Account-Id"] = profile.accountId;
		const headers = resolveProviderRequestHeaders({
			provider: "openai",
			baseUrl: WHAM_USAGE_URL,
			capability: "other",
			transport: "http",
			defaultHeaders
		}) ?? defaultHeaders;
		const res = await fetch(WHAM_USAGE_URL, {
			method: "GET",
			headers,
			signal: AbortSignal.timeout(WHAM_TIMEOUT_MS)
		});
		if (!res.ok) {
			await cancelUnreadResponseBody(res);
			if (res.status === 401 || res.status === 403) {
				const tokenExpired = res.status === 401;
				const result = {
					cooldownMs: tokenExpired ? WHAM_TOKEN_EXPIRED_COOLDOWN_MS : WHAM_DEAD_ACCOUNT_COOLDOWN_MS,
					cooldownClassification: tokenExpired ? "wham_token_expired" : "wham_account_dead"
				};
				authProfileUsageLog.warn("WHAM check classified auth profile unavailable", {
					event: "auth_profile_wham_auth_classification",
					profileId,
					status: res.status,
					cooldownClassification: result.cooldownClassification,
					cooldownMs: result.cooldownMs,
					tags: ["auth_profiles", "provider_probe"]
				});
				return result;
			}
			return { cooldownMs: WHAM_HTTP_ERROR_COOLDOWN_MS };
		}
		const parsed = whamUsageSchema.safeParse(await readProviderJsonResponse(res, "WHAM usage check"));
		const failedProbe = { cooldownMs: WHAM_PROBE_FAILURE_COOLDOWN_MS };
		if (!parsed.success || parsed.data.spend_control?.reached) return failedProbe;
		const limits = [parsed.data.rate_limit, ...(parsed.data.additional_rate_limits ?? []).flatMap((entry) => entry.rate_limit ? [entry.rate_limit] : [])];
		const now = Date.now();
		let resetMs = 0;
		for (const limit of limits) {
			const windows = [limit.primary_window, limit.secondary_window].filter(isWhamWindowExhausted);
			if (limit.limit_reached === false && windows.length === 0) continue;
			if (windows.length === 0 && limit.primary_window && !limit.secondary_window) windows.push(limit.primary_window);
			if (windows.length === 0) return failedProbe;
			for (const window of windows) {
				const remainingMs = resolveWhamResetMs(window, now);
				if (remainingMs === null || remainingMs <= 0) return failedProbe;
				resetMs = Math.max(resetMs, remainingMs);
			}
		}
		const reachedType = parsed.data.rate_limit_reached_type?.type;
		if (resetMs === 0 && reachedType && reachedType !== "unknown") return failedProbe;
		return resetMs > 0 ? {
			cooldownMs: WHAM_BURST_COOLDOWN_MS,
			blockedUntil: resolveUsageWindowUntil(now, resetMs)
		} : {
			available: true,
			cooldownMs: WHAM_BURST_COOLDOWN_MS
		};
	} catch {
		return { cooldownMs: WHAM_PROBE_FAILURE_COOLDOWN_MS };
	}
}
function shouldHalfOpenProbeWhamBlock(params) {
	const profile = params.store.profiles[params.profileId];
	const stats = params.store.usageStats?.[params.profileId];
	if (!stats || stats.blockedReason !== "subscription_limit" || !isBlockedWindowActiveForModel(stats, params.now, params.forModel) || isActiveUnusableWindow(stats.cooldownUntil, params.now) && !isCooldownScopedToDifferentModel(stats, params.forModel) && !(stats.cooldownReason === "rate_limit" && isBlockedWindowActiveForModel(stats, params.now, stats.cooldownModel ?? null)) || isActiveUnusableWindow(stats.disabledUntil, params.now) || !isWhamOAuthProfile(profile)) return false;
	return params.now - (stats.lastProbeAt ?? 0) >= WHAM_HALF_OPEN_REPROBE_INTERVAL_MS;
}
async function runWhamHalfOpenReprobe(params) {
	const expectedGeneration = structuredClone(params.store.usageStats?.[params.profileId]);
	let expectedProfile = params.expectedProfile;
	if (!isFutureDateTimestampMs(expectedProfile.expires)) {
		const { resolveApiKeyForProfile } = await import("./oauth-DalQEbRJ.mjs");
		const resolved = await resolveApiKeyForProfile({
			store: params.store,
			profileId: params.profileId,
			agentDir: params.agentDir,
			cfg: params.cfg,
			allowProfileFallback: false
		});
		if (!shouldProbeWhamForFailure(resolved?.credential, "rate_limit")) return { requiresAuthPreparation: true };
		expectedProfile = resolved.credential;
	}
	let didClaim = false;
	const claimed = await updateOwnedAuthProfileUsage(params.store, params.profileId, {
		agentDir: params.agentDir,
		updater: (freshStore) => {
			const currentProfile = freshStore.profiles[params.profileId];
			const currentStats = freshStore.usageStats?.[params.profileId];
			if (!currentStats || !matchesWhamBlockGeneration(currentStats, expectedGeneration) || !isSameWhamCredential(expectedProfile, currentProfile) || !shouldProbeWhamForFailure(currentProfile, "rate_limit") || !shouldHalfOpenProbeWhamBlock({
				store: freshStore,
				profileId: params.profileId,
				forModel: params.forModel,
				now: params.startedAt
			})) return false;
			currentStats.lastProbeAt = params.startedAt;
			didClaim = true;
			return true;
		}
	});
	if (claimed === null) logDroppedAuthProfileBookkeeping("wham_half_open_claim", params.profileId);
	const claimedStats = claimed?.usageStats?.[params.profileId];
	if (!didClaim || !claimedStats) return;
	const blockGeneration = structuredClone(claimedStats);
	const result = await probeWhamForCooldown(expectedProfile, params.profileId);
	if (!result.available && !result.blockedUntil) return;
	if (await updateOwnedAuthProfileUsage(params.store, params.profileId, {
		agentDir: params.agentDir,
		updater: (freshStore) => {
			const currentProfile = freshStore.profiles[params.profileId];
			const currentStats = freshStore.usageStats?.[params.profileId];
			if (!currentStats || currentStats.blockedReason !== "subscription_limit" || !matchesWhamBlockGeneration(currentStats, blockGeneration) || !isSameWhamCredential(expectedProfile, currentProfile)) return false;
			Object.assign(currentStats, reconcileWhamBlock(currentStats, result, params.startedAt));
			return true;
		}
	}) === null) logDroppedAuthProfileBookkeeping("wham_half_open_reprobe", params.profileId);
}
/** Reconciles subscription blocks before the caller decides whether to admit a turn. */
async function maybeReprobeWhamBlockedProfiles(params) {
	const now = params.now ?? Date.now();
	const results = await Promise.allSettled(params.profileIds.map(async (profileId) => {
		const shouldProbe = shouldHalfOpenProbeWhamBlock({
			...params,
			profileId,
			now
		});
		if (!shouldProbe && whamReprobesInFlight.size === 0) return;
		const profile = params.store.profiles[profileId];
		if (!isWhamOAuthProfile(profile)) return;
		const ownerAgentDir = await resolvePersistedAuthProfileOwnerAgentDirAsync({
			agentDir: params.agentDir,
			profileId
		});
		const probeKey = `${ownerAgentDir ? resolveAuthProfileDatabasePath(ownerAgentDir) : resolveSharedAuthStorePath()}\u0000${profileId}`;
		let task = whamReprobesInFlight.get(probeKey);
		if (!task) {
			if (!shouldProbe) return;
			task = runWhamHalfOpenReprobe({
				...params,
				profileId,
				expectedProfile: structuredClone(profile),
				startedAt: now
			}).catch((error) => {
				const code = sqlitePrimaryResultCode(error);
				if (code !== 8 && code !== 10 && code !== 13) throw error;
			}).finally(() => {
				whamReprobesInFlight.delete(probeKey);
			});
			whamReprobesInFlight.set(probeKey, task);
		}
		let outcome;
		try {
			outcome = await task;
		} catch (error) {
			if (!isSettledOAuthRefreshFailure(error)) throw error;
			authProfileUsageLog.debug("Quota credential refresh failed before auth preparation", { error: formatErrorMessage(error) });
			outcome = { requiresAuthPreparation: true };
		}
		const settled = await loadAuthProfileStoreWithoutExternalProfilesAsync(params.agentDir, { profileId });
		const credential = settled.profiles[profileId];
		if (credential) params.store.profiles[profileId] = credential;
		else delete params.store.profiles[profileId];
		const usage = settled.usageStats?.[profileId];
		if (usage) params.store.usageStats = {
			...params.store.usageStats,
			[profileId]: usage
		};
		else delete params.store.usageStats?.[profileId];
		return outcome;
	}));
	const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (failures.length > 0) throw failures.length === 1 ? failures[0] : new AggregateError(failures, "Quota reconciliation failed", { cause: failures[0] });
	return results.some((result) => result.status === "fulfilled" && result.value) ? { requiresAuthPreparation: true } : void 0;
}
/** Refreshes the selected provider's quota facts before direct runtime admission. */
async function reconcileAuthProfileQuotaBlocks(params) {
	const store = params.authProfileStore;
	if (!store || normalizeProviderId(params.provider) !== "openai") return;
	const lockedProfileId = params.sessionAuthProfileSource === "user" || params.sessionAuthProfileSource === "user-link" ? params.sessionAuthProfileId : void 0;
	await maybeReprobeWhamBlockedProfiles({
		store,
		agentDir: params.agentDir,
		cfg: params.config,
		forModel: params.modelId,
		profileIds: lockedProfileId ? [lockedProfileId] : resolveAuthProfileOrder({
			store,
			cfg: params.config,
			provider: params.provider,
			preferredProfile: params.sessionAuthProfileId,
			forModel: params.modelId,
			includePendingOAuthRefresh: true
		})
	});
}
/**
* Mark a profile as failed for a specific reason. Billing and permanent-auth
* failures are treated as "disabled" (longer backoff) vs the regular cooldown
* window.
*/
async function markAuthProfileFailure(params) {
	const { store, profileId, reason, agentDir, runId, modelId } = params;
	const profile = structuredClone(store.profiles[profileId]);
	if (!profile || profile.setup?.replacement || isAuthCooldownBypassedForProvider(profile.provider, reason)) return;
	const shouldProbeWham = shouldProbeWhamForFailure(profile, reason);
	if (reason === "no_error_details" && !shouldProbeWham) return;
	const result = await runAuthProfileUsage(async () => {
		const personal = isUserModelAuthProfileId(profileId) ? preparePersonalAuthProfileUsage(store, profileId) : void 0;
		const record = async (observed, persist) => {
			const blockGeneration = structuredClone(observed?.usageStats);
			const whamResult = shouldProbeWham ? await probeWhamForCooldown(profile, profileId) : null;
			return persist({
				kind: "failure",
				expectedProfile: profile,
				reason,
				modelId,
				retryAfterMs: params.retryAfterMs,
				whamResult,
				probeEligible: shouldProbeWham,
				observedProfile: observed?.credential,
				blockGeneration
			});
		};
		if (personal) return record(shouldProbeWham ? await personal.read() : void 0, (reduction) => personal.record(reduction));
		return withAuthProfileUsage(store, profileId, agentDir, (usage) => record({
			credential: usage.observed.profiles[profileId],
			usageStats: usage.observed.usageStats?.[profileId]
		}, async (reduction) => {
			const receipt = await usage.record(reduction);
			return receipt === null ? null : receipt.result;
		}));
	});
	if (result) logAuthProfileFailureStateChange({
		runId,
		profileId,
		provider: profile.provider,
		reason,
		...result
	});
	else if (result === null) logDroppedAuthProfileBookkeeping("failure", profileId);
}
/** Marks a profile blocked until a provider-reported reset timestamp. */
async function markAuthProfileBlockedUntil(params) {
	const { store, profileId, blockedUntil, agentDir, runId, modelId, source } = params;
	const profile = store.profiles[profileId];
	if (!profile || !isFutureDateTimestampMs(blockedUntil)) return;
	let result;
	const updated = await updateOwnedAuthProfileUsage(store, profileId, {
		agentDir,
		updater: (freshStore) => {
			if (!freshStore.profiles[profileId]) return false;
			const now = asDateTimestampMs(Date.now());
			if (now === void 0) return false;
			const previousStats = freshStore.usageStats?.[profileId];
			const activeBlockedUntil = resolveActiveWindowUntil(previousStats?.blockedUntil, now);
			const blockedModel = activeBlockedUntil === 0 ? modelId : previousStats?.blockedScope === "model" && previousStats.blockedModel === modelId && modelId ? modelId : void 0;
			const nextStats = {
				...previousStats,
				blockedUntil: Math.max(activeBlockedUntil, blockedUntil),
				blockedReason: "subscription_limit",
				blockedSource: source,
				blockedModel,
				blockedScope: blockedModel ? "model" : void 0,
				cooldownUntil: void 0,
				cooldownReason: void 0,
				cooldownClassification: void 0,
				cooldownModel: void 0,
				lastFailureAt: now,
				lastRateLimitAt: now
			};
			freshStore.usageStats ??= {};
			freshStore.usageStats[profileId] = nextStats;
			result = {
				previous: previousStats,
				next: nextStats,
				now
			};
			return true;
		}
	});
	if (updated && result) logAuthProfileFailureStateChange({
		runId,
		profileId,
		provider: profile.provider,
		reason: "rate_limit",
		...result
	});
	else if (updated === null) logDroppedAuthProfileBookkeeping("blocked_until", profileId);
}
async function markInlineProviderApiKeyFailure(params) {
	const { store, provider, reason, agentDir, runId, modelId } = params;
	if (reason !== "auth" && reason !== "auth_permanent" && reason !== "billing") return;
	const usageId = resolveInlineProviderApiKeyUsageId(provider);
	const receipt = await persistInlineAuthFailure(agentDir, {
		provider,
		reason,
		modelId
	});
	if (receipt) {
		store.usageStats = applyScopedAuthReadThrough(receipt.store).usageStats;
		logAuthProfileFailureStateChange({
			runId,
			profileId: usageId,
			provider,
			reason,
			previous: receipt.previousStats,
			next: receipt.nextStats,
			now: receipt.now
		});
		return;
	}
	logDroppedAuthProfileBookkeeping("inline_api_key_failure", usageId);
}
//#endregion
export { reconcileAuthProfileQuotaBlocks as a, maybeReprobeWhamBlockedProfiles as i, markAuthProfileFailure as n, markInlineProviderApiKeyFailure as r, markAuthProfileBlockedUntil as t };
