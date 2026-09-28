import { A as resolveExpiresAtMsFromEpochSeconds, T as positiveSecondsToSafeMilliseconds, g as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { Et as _enum, Fn as object, Lt as boolean, Nt as array, Pn as number } from "./schemas-BOYIvvln.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { a as isSqliteLockError, d as sqlitePrimaryResultCode } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { t as redactIdentifier } from "./node-crypto-Df3MIs6V.mjs";
import { i as readDatabasePathIdentitySync, t as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B4o9tqvO.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { c as resolveSharedAuthStorePath, o as resolveSharedAuthStoreOwnership } from "./path-resolve-Bm8Ih2d_.mjs";
import { m as withOpenClawAgentDatabaseAsync } from "./openclaw-agent-db-CaQAStOA.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-b9fAKekK.mjs";
import { c as prepareAuthProfileWriteTransaction, h as resolveAuthProfileDatabasePath, k as resolveLegacyAuthProfileSourceCandidates, m as resolveAuthProfileDatabaseOwnerId } from "./sqlite-BIg_k8qE.mjs";
import { D as authProfilesLog, O as reportCommittedInlineAuthFailure } from "./persisted-B486xwB_.mjs";
import { _ as publishPreparedRuntimeAuthProfileStoreSnapshot, b as readSharedAuthProfileRows, c as getScopedAuthProfileEnv, d as resolvePersistedAuthProfileOwnerAgentDir, f as resolveRuntimeAuthProfileAgentDir, l as getScopedSharedAuthStore, t as applyScopedAuthReadThrough, v as loadPersistedAuthProfileStoreFromRows, y as prepareAgentAuthProfileRowsRead } from "./store-CTvq6MSF.mjs";
import { u as isSettledOAuthRefreshFailure } from "./oauth-refresh-failure-CVji5U1C.mjs";
import { F as getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath, b as noteRuntimeAuthProfileStorePersistedMutation, n as clearRuntimeAuthProfileStoreSnapshotAtDatabasePath, o as getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath, y as listRuntimeAuthProfileStoreSnapshotsForSharedOwner } from "./runtime-snapshots-CBozwlR0.mjs";
import { a as assertAuthProfileMigrationStateAtDatabasePath, r as assertAuthProfileMigrationCandidates } from "./legacy-source-diagnostic-_PHHNz0J.mjs";
import { a as createEmptyAuthProfileStore, c as markRuntimePersistedProfiles, g as runtimeAuthProfileSnapshotSharesOwner, l as mergeLocalAuthProfileStoreWithInheritedStore, o as listRuntimeLocalProfileIds, t as captureRuntimeAuthProfileLegacyCandidates, y as setRuntimeLocalProfileMetadata } from "./runtime-snapshot-owner-BaV0Qukl.mjs";
import { d as resolveProviderRequestHeaders } from "./provider-request-config-DOrVD029.mjs";
import { a as resolveAuthProfileOrder } from "./order-BQhYF772.mjs";
import { a as isBlockedWindowActiveForModel, d as resolveInlineProviderApiKeyUsageId, i as isAuthCooldownBypassedForProvider, o as isCooldownScopedToDifferentModel, r as isActiveUnusableWindow } from "./usage-state-Bm5iXGhR.mjs";
import { l as loadAuthProfileStoreWithoutExternalProfiles, p as updateAuthProfileStoreWithLock } from "./store-runtime-CzCVI_rv.mjs";
import { t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CHHOdVvc.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-DpwCZ9_q.mjs";
import { t as sanitizeForConsole } from "./console-sanitize-CaBHLewO.mjs";
import { n as resolveUsageWindowUntil, t as computeNextProfileUsageStats } from "./usage-failure-state-CmVjUmco.mjs";
import path from "node:path";
//#region src/agents/auth-profiles/inline-usage-publication.ts
/** Reconcile committed facts through the existing snapshot owner, without native host rereads. */
async function publishInlineAuthFailure(owner, receipt, readTarget, assertOwner) {
	const agentDir = path.dirname(owner.databasePath);
	const shared = owner.databasePath === owner.sharedDatabasePath;
	const current = getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath(owner.databasePath);
	const entries = [...current ? [current] : [], ...shared ? listRuntimeAuthProfileStoreSnapshotsForSharedOwner(owner) : []];
	noteRuntimeAuthProfileStorePersistedMutation(agentDir, receipt.publication, owner);
	if (entries.length === 0) return;
	const readers = /* @__PURE__ */ new Set();
	const read = async (databasePath, kind) => {
		const revision = getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(databasePath);
		let assertCurrent;
		let rows;
		if (databasePath === owner.databasePath) {
			rows = await readTarget();
			assertCurrent = assertOwner;
		} else if (kind === "shared-state") {
			const context = captureOpenClawStateWorkerContext({ env: owner.env });
			if (context.admission.databasePath !== databasePath) throw new Error("Auth snapshot changed its captured shared database");
			rows = await readSharedAuthProfileRows(context);
			assertCurrent = () => context.admission.assertCurrent();
		} else {
			const reader = prepareAgentAuthProfileRowsRead({
				databasePath,
				agentId: resolveAuthProfileDatabaseOwnerId(path.dirname(databasePath)),
				env: owner.env
			});
			readers.add(reader);
			rows = await reader.read();
			assertCurrent = reader.assertCurrent;
		}
		const assert = () => {
			assertOwner();
			assertCurrent();
			if (getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(databasePath) !== revision) throw new Error("Auth snapshot changed during committed-state preparation");
		};
		assert();
		return {
			store: markRuntimePersistedProfiles(loadPersistedAuthProfileStoreFromRows(rows, databasePath) ?? createEmptyAuthProfileStore()),
			assertCurrent: assert
		};
	};
	for (const entry of entries) {
		const targetOwner = {
			...owner,
			databasePath: entry.databasePath
		};
		try {
			assertOwner();
			assertAuthProfileMigrationStateAtDatabasePath(targetOwner.databasePath);
			assertAuthProfileMigrationStateAtDatabasePath(targetOwner.sharedDatabasePath);
			const candidates = captureRuntimeAuthProfileLegacyCandidates(targetOwner.databasePath === targetOwner.sharedDatabasePath ? void 0 : entry.agentDir, owner.env);
			const inherited = targetOwner.databasePath === targetOwner.sharedDatabasePath ? void 0 : await read(targetOwner.sharedDatabasePath, owner.location === "state-db" ? "shared-state" : "agent");
			const local = await read(targetOwner.databasePath, "agent");
			inherited?.assertCurrent();
			local.assertCurrent();
			assertAuthProfileMigrationCandidates({
				databasePath: targetOwner.databasePath,
				candidates: targetOwner.databasePath === targetOwner.sharedDatabasePath ? candidates.shared : candidates.local,
				hasCredentials: () => Object.keys(local.store.profiles).length > 0
			});
			if (inherited) assertAuthProfileMigrationCandidates({
				databasePath: targetOwner.sharedDatabasePath,
				candidates: candidates.shared,
				hasCredentials: () => Object.keys(inherited.store.profiles).length > 0
			});
			const refreshed = inherited ? mergeLocalAuthProfileStoreWithInheritedStore(local.store, inherited.store) : setRuntimeLocalProfileMetadata(local.store, listRuntimeLocalProfileIds(local.store));
			const latest = getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath(entry.databasePath);
			if (!latest || !runtimeAuthProfileSnapshotSharesOwner(latest.owner, targetOwner)) continue;
			publishPreparedRuntimeAuthProfileStoreSnapshot(entry.agentDir, latest, targetOwner, refreshed, { candidates });
		} catch (error) {
			try {
				const latest = getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath(entry.databasePath);
				if (latest && runtimeAuthProfileSnapshotSharesOwner(latest.owner, targetOwner)) clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(entry.databasePath, entry.agentDir);
			} catch (invalidationError) {
				reportCommittedInlineAuthFailure("auth usage snapshot invalidation failed", invalidationError);
			}
			reportCommittedInlineAuthFailure("auth usage committed but runtime snapshot publication failed", error);
		} finally {
			const cleanup = await Promise.allSettled([...readers].map((reader) => reader.dispose()));
			readers.clear();
			const errors = cleanup.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (errors.length > 0) reportCommittedInlineAuthFailure("auth snapshot publication finished before reader cleanup failed", errors);
		}
	}
}
//#endregion
//#region src/agents/auth-profiles/inline-usage.ts
function inlineAuthFailureError(payload) {
	const error = /* @__PURE__ */ new Error("Auth usage transaction failed");
	retainOpenClawStateWorkerErrorPayload(error, payload);
	return hydrateOpenClawStateWorkerError(error, { includeOrdinary: true });
}
/** The retry controller's inline failure belongs to its explicit agent database. */
async function persistInlineAuthFailure(agentDir, input) {
	const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
	const prepared = prepareAuthProfileWriteTransaction(effectiveAgentDir, { env: getScopedAuthProfileEnv() });
	const inheritedUsageStats = structuredClone(getScopedSharedAuthStore()?.usageStats);
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
	const execution = captureOpenClawAgentDatabaseExecution(databaseTarget);
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
			return await runOpenClawAgentWriteAdmission(databaseTarget, () => withOpenClawAgentDatabaseAsync(databaseTarget, async (database) => {
				const client = await openOpenClawAgentSqliteWorkerStore(databaseTarget, database.db, {
					moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.authProfileInlineUsage),
					input: {}
				});
				let outcome;
				try {
					outcome = {
						ok: true,
						value: await client.run(async (scope) => {
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
						}, assertCurrent)
					};
				} catch (error) {
					outcome = {
						ok: false,
						error
					};
				}
				try {
					await client.close();
				} catch (cleanupError) {
					if (!outcome.ok) throw new AggregateError([outcome.error, cleanupError], "Auth usage and owner cleanup failed", { cause: cleanupError });
					if (!outcome.value.ok) throw new AggregateError([inlineAuthFailureError(outcome.value.error), cleanupError], "Auth usage refusal and owner cleanup failed", { cause: cleanupError });
					reportCommittedInlineAuthFailure("auth usage committed before owner cleanup failed", cleanupError);
				}
				if (!outcome.ok) throw outcome.error;
				if (!outcome.value.ok) throw inlineAuthFailureError(outcome.value.error);
				return outcome.value.receipt;
			}, assertCurrent), true);
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
				agentDir,
				error: message
			});
			if (!isSqliteLockError(error)) throw error;
			return null;
		}
	};
	const outcome = await runWithAdmission().then((value) => ({
		ok: true,
		value
	}), (error) => ({
		ok: false,
		error
	}));
	let releaseFailure;
	try {
		await execution.release();
	} catch (error) {
		releaseFailure = { error };
	}
	if (releaseFailure) {
		if (durableReceipt) reportCommittedInlineAuthFailure("auth usage committed before captured owner release failed", releaseFailure.error);
		else if (failure) throw new AggregateError([failure.error, releaseFailure.error], "Auth usage and captured owner release failed", { cause: failure.error });
		else throw releaseFailure.error;
	}
	if (!outcome.ok) throw outcome.error;
	return outcome.value;
}
//#endregion
//#region src/agents/auth-profiles/state-observation.ts
/**
* Structured logging for auth profile failure state changes.
* Log payloads keep machine-readable fields while redacting console-facing ids.
*/
const observationLog = createSubsystemLogger("agent/embedded");
/** Logs an auth profile failure/cooldown/disable state transition. */
function logAuthProfileFailureStateChange(params) {
	const windowType = params.reason === "billing" || params.reason === "auth_permanent" ? "disabled" : "cooldown";
	const previousCooldownUntil = params.previous?.cooldownUntil;
	const previousDisabledUntil = params.previous?.disabledUntil;
	const windowReused = windowType === "disabled" ? typeof previousDisabledUntil === "number" && Number.isFinite(previousDisabledUntil) && previousDisabledUntil > params.now && previousDisabledUntil === params.next.disabledUntil : typeof previousCooldownUntil === "number" && Number.isFinite(previousCooldownUntil) && previousCooldownUntil > params.now && previousCooldownUntil === params.next.cooldownUntil;
	const safeProfileId = redactIdentifier(params.profileId, { len: 12 });
	const safeRunId = sanitizeForConsole(params.runId) ?? "-";
	const safeProvider = sanitizeForConsole(params.provider) ?? "-";
	observationLog.warn("auth profile failure state updated", {
		event: "auth_profile_failure_state_updated",
		tags: [
			"error_handling",
			"auth_profiles",
			windowType
		],
		runId: params.runId,
		profileId: safeProfileId,
		provider: params.provider,
		reason: params.reason,
		windowType,
		windowReused,
		previousErrorCount: params.previous?.errorCount,
		errorCount: params.next.errorCount,
		previousCooldownUntil,
		cooldownUntil: params.next.cooldownUntil,
		previousDisabledUntil,
		disabledUntil: params.next.disabledUntil,
		previousDisabledReason: params.previous?.disabledReason,
		disabledReason: params.next.disabledReason,
		failureCounts: params.next.failureCounts,
		consoleMessage: `auth profile failure state updated: runId=${safeRunId} profile=${safeProfileId} provider=${safeProvider} reason=${params.reason} window=${windowType} reused=${String(windowReused)}`
	});
}
//#endregion
//#region src/agents/auth-profiles/usage.ts
/**
* Auth profile usage accounting and cooldown mutation.
* Records failures under the store lock, applies WHAM usage probes for OpenAI
* OAuth profiles, and exposes display helpers for unavailable profiles.
*/
const authProfileUsageLog = createSubsystemLogger("agent/embedded");
const authProfileUsageDeps = { updateAuthProfileStoreWithLock };
/** Test-only dependency injection for usage persistence hooks. */
const testing = {
	setDepsForTest(overrides) {
		authProfileUsageDeps.updateAuthProfileStoreWithLock = overrides?.updateAuthProfileStoreWithLock ?? updateAuthProfileStoreWithLock;
	},
	resetWhamReprobeStateForTest() {
		whamReprobesInFlight.clear();
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.authProfileUsageTestApi")] = testing;
function logDroppedAuthProfileBookkeeping(kind, profileId) {
	authProfileUsageLog.warn("dropped auth profile bookkeeping after locked store update failed", {
		event: "auth_profile_bookkeeping_dropped",
		kind,
		profileId,
		tags: ["auth_profiles", "persistence"]
	});
}
async function updateOwnedAuthProfileUsage(store, profileId, update) {
	let changed = false;
	const updated = await authProfileUsageDeps.updateAuthProfileStoreWithLock({
		...update,
		profileId,
		agentDir: resolvePersistedAuthProfileOwnerAgentDir({
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
	return profile?.type === "oauth" && Boolean(profile.access) && normalizeProviderId(profile.provider) === "openai";
}
function shouldProbeWhamForFailure(profile, reason) {
	return isWhamOAuthProfile(profile) && isFutureDateTimestampMs(profile.expires) && (reason === "rate_limit" || reason === "empty_response" || reason === "no_error_details" || reason === "unclassified" || reason === "unknown");
}
function isSameWhamCredential(expected, current) {
	return expected.type === "oauth" && current?.type === "oauth" && normalizeProviderId(expected.provider) === normalizeProviderId(current.provider) && expected.access === current.access && expected.accountId === current.accountId;
}
function resolveActiveWindowUntil(value, now) {
	const timestampMs = asDateTimestampMs(value);
	return timestampMs !== void 0 && timestampMs > now ? timestampMs : 0;
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
function applyWhamCooldownResult(params) {
	const existingActiveCooldownUntil = resolveActiveWindowUntil(params.existing.cooldownUntil, params.now);
	const existingActiveBlockedUntil = resolveActiveWindowUntil(params.existing.blockedUntil, params.now);
	if (params.whamResult.blockedUntil) return {
		...params.computed,
		lastProbeAt: params.now,
		blockedUntil: Math.max(existingActiveBlockedUntil, params.whamResult.blockedUntil),
		blockedReason: "subscription_limit",
		blockedSource: "wham",
		blockedModel: void 0,
		blockedScope: void 0,
		cooldownUntil: void 0,
		cooldownReason: void 0,
		cooldownClassification: void 0,
		cooldownModel: void 0
	};
	const { cooldownClassification } = params.whamResult;
	if (!cooldownClassification && !params.whamResult.available && (params.computed.cooldownReason === "rate_limit" || params.computed.blockedReason === "subscription_limit" && isBlockedWindowActiveForModel(params.computed, params.now))) return {
		...params.computed,
		lastProbeAt: params.now
	};
	return {
		...params.computed,
		lastProbeAt: params.now,
		cooldownUntil: Math.max(existingActiveCooldownUntil, resolveUsageWindowUntil(params.now, params.whamResult.cooldownMs)),
		cooldownReason: cooldownClassification ? cooldownClassification === "wham_token_expired" ? "auth" : "auth_permanent" : params.computed.cooldownReason,
		cooldownClassification,
		cooldownModel: cooldownClassification ? void 0 : params.computed.cooldownModel
	};
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
				const result = res.status === 401 ? {
					cooldownMs: WHAM_TOKEN_EXPIRED_COOLDOWN_MS,
					cooldownClassification: "wham_token_expired"
				} : {
					cooldownMs: WHAM_DEAD_ACCOUNT_COOLDOWN_MS,
					cooldownClassification: "wham_account_dead"
				};
				authProfileUsageLog.warn("WHAM probe classified auth profile unavailable", {
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
		const parsed = whamUsageSchema.safeParse(await readProviderJsonResponse(res, "WHAM usage probe"));
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
function matchesWhamBlockGeneration(stats, generation) {
	return stats?.blockedUntil === generation?.blockedUntil && stats?.blockedReason === generation?.blockedReason && stats?.blockedSource === generation?.blockedSource && stats?.blockedModel === generation?.blockedModel && stats?.blockedScope === generation?.blockedScope && stats?.lastProbeAt === generation?.lastProbeAt && stats?.lastFailureAt === generation?.lastFailureAt && stats?.failureCounts?.rate_limit === generation?.failureCounts?.rate_limit;
}
function reconcileWhamBlock(stats, result, now) {
	return {
		...stats,
		blockedUntil: result.blockedUntil,
		blockedReason: result.available ? void 0 : "subscription_limit",
		blockedSource: result.available ? void 0 : "wham",
		blockedModel: result.available ? void 0 : stats.blockedModel,
		blockedScope: result.available ? void 0 : stats.blockedScope,
		...stats.cooldownReason === "rate_limit" && isBlockedWindowActiveForModel(stats, now, stats.cooldownModel ?? null) ? {
			cooldownUntil: void 0,
			cooldownReason: void 0,
			cooldownClassification: void 0,
			cooldownModel: void 0
		} : {}
	};
}
async function runWhamHalfOpenReprobe(params) {
	const expectedGeneration = structuredClone(params.store.usageStats?.[params.profileId]);
	let expectedProfile = params.expectedProfile;
	if (!isFutureDateTimestampMs(expectedProfile.expires)) {
		const { resolveApiKeyForProfile } = await import("./oauth-BxxRuYJ3.mjs");
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
		const ownerAgentDir = resolvePersistedAuthProfileOwnerAgentDir({
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
		const settled = loadAuthProfileStoreWithoutExternalProfiles(params.agentDir, { profileId });
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
function updateUsageStatsEntry(store, profileId, updater) {
	store.usageStats = store.usageStats ?? {};
	store.usageStats[profileId] = updater(store.usageStats[profileId]);
}
/**
* Mark a profile as failed for a specific reason. Billing and permanent-auth
* failures are treated as "disabled" (longer backoff) vs the regular cooldown
* window.
*/
async function markAuthProfileFailure(params) {
	const { store, profileId, reason, agentDir, runId, modelId } = params;
	const profile = structuredClone(store.profiles[profileId]);
	if (!profile || profile.setup?.replacement || isAuthCooldownBypassedForProvider(profile.provider)) return;
	const shouldProbeWham = shouldProbeWhamForFailure(profile, reason);
	if (reason === "no_error_details" && !shouldProbeWham) return;
	const observedStore = shouldProbeWham ? loadAuthProfileStoreWithoutExternalProfiles(agentDir, { profileId }) : void 0;
	const blockGeneration = structuredClone(observedStore?.usageStats?.[profileId]);
	const whamResult = shouldProbeWham ? await probeWhamForCooldown(profile, profileId) : null;
	let nextStats;
	let previousStats;
	let updateTime = 0;
	const updated = await updateOwnedAuthProfileUsage(store, profileId, {
		agentDir,
		updater: (freshStore) => {
			const profileValue = freshStore.profiles[profileId];
			if (!profileValue || profileValue.setup?.replacement || isAuthCooldownBypassedForProvider(profileValue.provider)) return false;
			previousStats = freshStore.usageStats?.[profileId];
			const currentWhamResult = whamResult && shouldProbeWhamForFailure(profileValue, reason) && isSameWhamCredential(profile, profileValue) && (!whamResult.available && !whamResult.blockedUntil || observedStore && isSameWhamCredential(profile, observedStore.profiles[profileId]) && matchesWhamBlockGeneration(previousStats, blockGeneration)) ? whamResult : null;
			if (reason === "no_error_details" && !currentWhamResult) return false;
			const now = Date.now();
			updateTime = now;
			const existing = currentWhamResult?.available && previousStats?.blockedReason === "subscription_limit" ? reconcileWhamBlock(previousStats, currentWhamResult, now) : previousStats ?? {};
			const computed = computeNextProfileUsageStats({
				existing,
				now,
				reason,
				modelId
			});
			nextStats = currentWhamResult ? applyWhamCooldownResult({
				existing,
				computed,
				now,
				whamResult: currentWhamResult
			}) : computed;
			updateUsageStatsEntry(freshStore, profileId, () => nextStats ?? computed);
			return true;
		}
	});
	if (updated) {
		if (nextStats) logAuthProfileFailureStateChange({
			runId,
			profileId,
			provider: profile.provider,
			reason,
			previous: previousStats,
			next: nextStats,
			now: updateTime
		});
		return;
	}
	if (updated === null) logDroppedAuthProfileBookkeeping("failure", profileId);
}
function buildBlockedProfileUsageStats(params) {
	const activeBlockedUntil = resolveActiveWindowUntil(params.previousStats?.blockedUntil, params.now);
	const blockedModel = activeBlockedUntil === 0 ? params.modelId : params.previousStats?.blockedScope === "model" && params.previousStats.blockedModel === params.modelId && params.modelId ? params.modelId : void 0;
	return {
		...params.previousStats,
		blockedUntil: Math.max(activeBlockedUntil, params.blockedUntil),
		blockedReason: "subscription_limit",
		blockedSource: params.source,
		blockedModel,
		blockedScope: blockedModel ? "model" : void 0,
		cooldownUntil: void 0,
		cooldownReason: void 0,
		cooldownClassification: void 0,
		cooldownModel: void 0,
		lastFailureAt: params.now,
		failureCounts: {
			...params.previousStats?.failureCounts,
			rate_limit: (params.previousStats?.failureCounts?.rate_limit ?? 0) + 1
		}
	};
}
/** Marks a profile blocked until a provider-reported reset timestamp. */
async function markAuthProfileBlockedUntil(params) {
	const { store, profileId, blockedUntil, agentDir, runId, modelId, source } = params;
	const profile = store.profiles[profileId];
	if (!profile || isAuthCooldownBypassedForProvider(profile.provider) || !isFutureDateTimestampMs(blockedUntil)) return;
	let nextStats;
	let previousStats;
	let updateTime = 0;
	const updated = await updateOwnedAuthProfileUsage(store, profileId, {
		agentDir,
		updater: (freshStore) => {
			const profileLocal = freshStore.profiles[profileId];
			if (!profileLocal || isAuthCooldownBypassedForProvider(profileLocal.provider)) return false;
			const now = asDateTimestampMs(Date.now());
			if (now === void 0) return false;
			previousStats = freshStore.usageStats?.[profileId];
			updateTime = now;
			nextStats = buildBlockedProfileUsageStats({
				previousStats,
				blockedUntil,
				source,
				modelId,
				now
			});
			updateUsageStatsEntry(freshStore, profileId, () => nextStats);
			return true;
		}
	});
	if (updated) {
		if (nextStats) logAuthProfileFailureStateChange({
			runId,
			profileId,
			provider: profile.provider,
			reason: "rate_limit",
			previous: previousStats,
			next: nextStats,
			now: updateTime
		});
		return;
	}
	if (updated === null) logDroppedAuthProfileBookkeeping("blocked_until", profileId);
}
async function markInlineProviderApiKeyFailure(params) {
	const { store, provider, reason, agentDir, runId, modelId } = params;
	if (reason !== "auth" && reason !== "auth_permanent" && reason !== "billing" || isAuthCooldownBypassedForProvider(provider)) return;
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
