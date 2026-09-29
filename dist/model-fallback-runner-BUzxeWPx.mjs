import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as emitFailoverEvent } from "./diagnostic-events-CVabF32H.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as hasAnyAuthProfileStoreSource } from "./source-check-BkR4BMBU.mjs";
import { i as externalCliDiscoveryScoped } from "./external-cli-discovery-BbOBKQM3.mjs";
import { m as resolveSubscriptionAuthModeForProfiles } from "./order-BQhYF772.mjs";
import { r as isActiveUnusableWindow } from "./usage-state-Bm5iXGhR.mjs";
import { a as isFailoverError, t as FailoverError } from "./error-ON38hPhx.mjs";
import { n as resolveModelCandidateChain } from "./model-fallback-candidates-BSWa_fLA.mjs";
import { a as isMissingAgentHarnessError, i as isAgentHarnessPreflightError, s as resolveAgentHarnessPreflightOwner } from "./errors-Bd6GQRkh.mjs";
import { a as isLikelyContextOverflowError } from "./classify-DO9EO_30.mjs";
import { c as hasProviderRequestSizeCeiling, d as isNonProviderRuntimeCoordinationError, i as describeFailoverError, n as buildProviderReauthCommand, r as coerceToFailoverError } from "./failover-error-C3SnWYBJ.mjs";
import { a as recordFailedCandidateAttempt, c as resolveLiveSessionModelSwitchRedirectIndex, d as resolveNextFallbackCandidateIndex, f as runFallbackAttempt, g as logModelFallbackDecision, h as isModelFallbackDecisionLogEnabled, i as isTranscriptNotContinuableError, l as resolveModelFallbackCandidateAgentRuntime, m as throwFallbackFailureSummary, n as hasDifferentLiveSessionRuntimeSelection, o as resolveFallbackAuthScope, p as shouldDiscardDeferredSessionSuspension, s as resolveFallbackSoonestCooldownExpiry, t as appendFailedCandidateAttempt, u as resolveModelFallbackCandidateHarnessAuthPrecheck } from "./model-fallback-attempt-Dz9Ct0BI.mjs";
import { o as suspendSession, r as resolveSessionSuspensionReason } from "./session-suspension-DbQ3XvjC.mjs";
import { f as getFallbackCandidateSkipReason, m as markFallbackCandidateSkipped, p as isFallbackCandidateSkipped } from "./result-fallback-classifier-BENPsKcd.mjs";
//#region src/agents/live-model-switch-error.ts
/** Control-flow error used to request a live session model switch. */
var LiveSessionModelSwitchError = class extends Error {
	constructor(selection) {
		super(`Live session model switch requested: ${selection.provider}/${selection.model}`);
		this.name = "LiveSessionModelSwitchError";
		this.provider = selection.provider;
		this.model = selection.model;
		this.agentRuntimeOverride = selection.agentRuntimeOverride;
		this.authProfileId = selection.authProfileId;
		this.authProfileIdSource = selection.authProfileIdSource;
	}
};
//#endregion
//#region src/agents/failover-policy.ts
/** Returns true when a failed model can be probed during cooldown. */
function shouldAllowCooldownProbeForReason(reason) {
	return reason === "billing" || shouldUseTransientCooldownProbeSlot(reason);
}
/** Returns true when a transient failure should consume a cooldown probe slot. */
function shouldUseTransientCooldownProbeSlot(reason) {
	return reason === "rate_limit" || reason === "overloaded" || reason === "unknown" || reason === "empty_response" || reason === "no_error_details" || reason === "unclassified" || reason === "timeout";
}
/** Returns true when a non-transient failure should leave transient probe budget intact. */
function shouldPreserveTransientCooldownProbeSlot(reason) {
	return reason === "model_not_found" || reason === "format" || reason === "auth" || reason === "auth_permanent" || reason === "session_expired" || reason === "tls_certificate";
}
//#endregion
//#region src/agents/model-fallback-cooldown.ts
const lastProbeAttempt = /* @__PURE__ */ new Map();
const MIN_PROBE_INTERVAL_MS = 3e4;
const PROBE_MARGIN_MS = 12e4;
const PROBE_SCOPE_DELIMITER = "::";
const PROBE_STATE_TTL_MS = 864e5;
const MAX_PROBE_KEYS = 256;
function resolveProbeThrottleKey(provider, agentDir) {
	const scope = normalizeOptionalString(agentDir) ?? "";
	return scope ? `${scope}${PROBE_SCOPE_DELIMITER}${provider}` : provider;
}
function pruneProbeState(now) {
	for (const [key, ts] of lastProbeAttempt) if (!Number.isFinite(ts) || ts <= 0 || now - ts > PROBE_STATE_TTL_MS) lastProbeAttempt.delete(key);
}
function enforceProbeStateCap() {
	while (lastProbeAttempt.size > MAX_PROBE_KEYS) {
		let oldestKey = null;
		let oldestTs = Number.POSITIVE_INFINITY;
		for (const [key, ts] of lastProbeAttempt) if (ts < oldestTs) {
			oldestKey = key;
			oldestTs = ts;
		}
		if (!oldestKey) break;
		lastProbeAttempt.delete(oldestKey);
	}
}
function isProbeThrottleOpen(now, throttleKey) {
	pruneProbeState(now);
	return now - (lastProbeAttempt.get(throttleKey) ?? 0) >= MIN_PROBE_INTERVAL_MS;
}
function markProbeAttempt(now, throttleKey) {
	pruneProbeState(now);
	lastProbeAttempt.set(throttleKey, now);
	enforceProbeStateCap();
}
function hasActiveProviderRateLimitResetWindow(params) {
	return params.profileIds.some((profileId) => {
		const stats = params.authStore.usageStats?.[profileId];
		if (!stats || !isActiveUnusableWindow(stats.blockedUntil, params.now)) return false;
		if (stats.blockedReason !== "subscription_limit" || !stats.blockedSource) return false;
		return !stats.blockedModel || stats.blockedModel === params.model;
	});
}
function shouldProbePrimaryDuringCooldown(params) {
	if (!params.isPrimary || !isProbeThrottleOpen(params.now, params.throttleKey)) return false;
	if (!params.hasFallbackCandidates) return true;
	const soonest = params.authRuntime.getSoonestCooldownExpiry(params.authStore, params.profileIds, {
		now: params.now,
		forModel: params.model
	});
	if (params.reason === "rate_limit" && !hasActiveProviderRateLimitResetWindow({
		authStore: params.authStore,
		profileIds: params.profileIds,
		now: params.now,
		model: params.model
	})) return true;
	if (soonest === null || !Number.isFinite(soonest)) return true;
	return params.now >= soonest - PROBE_MARGIN_MS;
}
function resolveCooldownDecision(params) {
	const inferredReason = params.authRuntime.resolveProfilesUnavailableReason({
		store: params.authStore,
		profileIds: params.profileIds,
		now: params.now
	}) ?? "unknown";
	const shouldProbe = shouldProbePrimaryDuringCooldown({
		isPrimary: params.isPrimary,
		hasFallbackCandidates: params.hasFallbackCandidates,
		reason: inferredReason,
		now: params.now,
		throttleKey: params.probeThrottleKey,
		authRuntime: params.authRuntime,
		authStore: params.authStore,
		profileIds: params.profileIds,
		model: params.candidate.model
	});
	if (inferredReason === "auth" || inferredReason === "auth_permanent") return {
		type: "skip",
		reason: inferredReason,
		error: `Provider ${params.candidate.provider} has ${inferredReason} issue (skipping all models)`
	};
	if (inferredReason === "billing") {
		if (params.isPrimary && shouldProbe) return {
			type: "attempt",
			reason: inferredReason,
			markProbe: true
		};
		return {
			type: "suspend_session",
			reason: inferredReason
		};
	}
	if (!(params.isPrimary && (!params.requestedModel || shouldProbe) || !params.isPrimary && shouldUseTransientCooldownProbeSlot(inferredReason))) return {
		type: "suspend_session",
		reason: inferredReason
	};
	return {
		type: "attempt",
		reason: inferredReason,
		markProbe: params.isPrimary && shouldProbe
	};
}
//#endregion
//#region src/agents/model-fallback.types.ts
const MODEL_FALLBACK_SKIPPED_CODE = "MODEL_FALLBACK_SKIPPED";
//#endregion
//#region src/agents/model-fallback-runner.ts
const log = createSubsystemLogger("model-fallback");
const modelFallbackAuthRuntimeLoader = createLazyImportLoader(() => import("./agents/auth-profiles.runtime.js"));
function flushDeferredSessionSuspension(state) {
	const pending = state.pending;
	if (!pending) return;
	state.pending = void 0;
	suspendSession(pending);
}
async function runWithModelFallback(params) {
	const deferredSuspension = {};
	try {
		const result = await runWithModelFallbackInternal(params, deferredSuspension);
		if (result.outcome === "exhausted") flushDeferredSessionSuspension(deferredSuspension);
		return result;
	} catch (err) {
		if (!shouldDiscardDeferredSessionSuspension({
			error: err,
			abortSignal: params.abortSignal
		})) flushDeferredSessionSuspension(deferredSuspension);
		throw err;
	}
}
async function runWithModelFallbackInternal(params, deferredSuspension) {
	const candidates = resolveModelCandidateChain({
		cfg: params.cfg,
		agentId: params.agentId,
		provider: params.provider,
		model: params.model,
		fallbacksOverride: params.fallbacksOverride,
		requestedRouteResolution: params.requestedRouteResolution,
		manifestPlugins: params.manifestPlugins
	});
	await params.prepareCandidateChain?.(candidates);
	const userLockedAuthProfileId = params.userLockedAuthProfileId?.trim() || void 0;
	const authRuntime = !params.skipAuthProfileRuntime && params.cfg && (userLockedAuthProfileId || hasAnyAuthProfileStoreSource(params.agentDir)) ? await modelFallbackAuthRuntimeLoader.load() : null;
	const authStore = authRuntime ? authRuntime.ensureAuthProfileStore(params.agentDir, {
		profileId: userLockedAuthProfileId,
		externalCli: externalCliDiscoveryScoped({
			config: params.cfg,
			allowKeychainPrompt: false,
			providerIds: candidates.map((candidate) => candidate.provider),
			...userLockedAuthProfileId ? { profileIds: [userLockedAuthProfileId] } : {}
		})
	}) : null;
	const attempts = [];
	const profileIdsByCandidate = /* @__PURE__ */ new Map();
	let lastError;
	let latestClassifiedResult;
	let exhaustionResult;
	const cooldownProbeUsedProviders = /* @__PURE__ */ new Set();
	const tlsFailedProviders = /* @__PURE__ */ new Set();
	const notifyFallbackStep = async (step) => {
		try {
			await params.onFallbackStep?.(step);
		} catch {
			log.warn("Model fallback observer failed; preserving execution outcome.");
		}
	};
	const observeDecision = async (decision) => {
		if (!params.onFallbackStep && !isModelFallbackDecisionLogEnabled()) return;
		const fallbackStep = logModelFallbackDecision(decision);
		if (fallbackStep) await notifyFallbackStep(fallbackStep);
	};
	const observeFailedCandidate = async (failedAttempt) => {
		if (!params.onFallbackStep && !isModelFallbackDecisionLogEnabled()) appendFailedCandidateAttempt(failedAttempt);
		else {
			const fallbackStep = recordFailedCandidateAttempt(failedAttempt);
			if (fallbackStep) await notifyFallbackStep(fallbackStep);
		}
		if (params.sessionId && failedAttempt.nextCandidate) {
			const described = describeFailoverError(failedAttempt.error);
			emitFailoverEvent({
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				lane: params.lane,
				fromProvider: failedAttempt.candidate.provider,
				fromModel: failedAttempt.candidate.model,
				toProvider: failedAttempt.nextCandidate.provider,
				toModel: failedAttempt.nextCandidate.model,
				reason: described.reason ?? "unknown",
				cascadeDepth: failedAttempt.attempt - 1,
				suspended: false
			});
		}
	};
	const hasFallbackCandidates = candidates.length > 1;
	const requestedCandidate = candidates.find((candidate) => candidate.routeOrigin === "requested");
	const runAttribution = {
		sessionId: params.sessionId,
		lane: params.lane
	};
	const runObs = {
		runId: params.runId,
		...runAttribution,
		requestedProvider: params.provider,
		requestedModel: params.model,
		fallbackConfigured: hasFallbackCandidates
	};
	for (let i = 0; i < candidates.length; i += 1) {
		const candidate = candidates.at(i);
		if (!candidate) throw new Error(`Missing model fallback candidate at index ${i}`);
		if (tlsFailedProviders.has(candidate.provider)) continue;
		const candidateRef = {
			provider: candidate.provider,
			model: candidate.model
		};
		const nextCandidate = candidates[resolveNextFallbackCandidateIndex({
			candidates,
			currentIndex: i,
			excludedProviders: tlsFailedProviders
		})];
		const hasRemainingCandidate = nextCandidate !== void 0;
		const candidateHarnessAuth = await resolveModelFallbackCandidateHarnessAuthPrecheck({
			cfg: params.cfg,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			resolveAgentHarnessRuntimeOverride: params.resolveAgentHarnessRuntimeOverride,
			prepareAgentHarnessRuntime: params.prepareAgentHarnessRuntime,
			...candidate
		});
		const isPrimary = candidate.routeOrigin === "requested";
		const requestedModel = requestedCandidate !== void 0 && candidate.provider === requestedCandidate.provider && candidate.model === requestedCandidate.model;
		const attemptContext = {
			attempt: i + 1,
			total: candidates.length
		};
		const candObs = {
			...runObs,
			candidate,
			...attemptContext,
			nextCandidate,
			isPrimary,
			requestedModelMatched: requestedModel
		};
		const observeCandidateDecision = (decision, extra = {}) => observeDecision({
			decision,
			...candObs,
			...extra
		});
		const pushSkippedAttempt = (error, reason, authMode) => attempts.push({
			...candidateRef,
			error,
			reason,
			code: MODEL_FALLBACK_SKIPPED_CODE,
			authMode
		});
		const recordFailure = async (error, next) => {
			await observeFailedCandidate({
				attempts,
				...candObs,
				error,
				nextCandidate: next
			});
			await params.onError?.({
				...candidateRef,
				error,
				...attemptContext
			});
		};
		let candidateAuthProfileIds;
		let quotaRequiresAuthPreparation = false;
		let userLockedAuthProfileEligible = false;
		if (authRuntime && authStore) {
			userLockedAuthProfileEligible = userLockedAuthProfileId !== void 0 && authRuntime.resolveAuthProfileEligibility({
				cfg: params.cfg,
				store: authStore,
				provider: candidate.provider,
				profileId: userLockedAuthProfileId,
				includePendingOAuthRefresh: true
			}).eligible;
			let profileIds = authRuntime.resolveAuthProfileOrder({
				cfg: params.cfg,
				store: authStore,
				provider: candidate.provider,
				forModel: candidate.model,
				includePendingOAuthRefresh: true
			});
			if (userLockedAuthProfileEligible && userLockedAuthProfileId) profileIds = [.../* @__PURE__ */ new Set([userLockedAuthProfileId, ...profileIds])];
			quotaRequiresAuthPreparation = (await authRuntime.maybeReprobeWhamBlockedProfiles({
				store: authStore,
				profileIds,
				agentDir: params.agentDir,
				cfg: params.cfg,
				forModel: candidate.model
			}))?.requiresAuthPreparation === true;
			if (!candidateHarnessAuth.skipsProviderAuthCooldown) {
				candidateAuthProfileIds = profileIds;
				profileIdsByCandidate.set(candidate, candidateAuthProfileIds);
			}
		}
		const candidateAuthScope = resolveFallbackAuthScope({
			userLockedAuthProfileId: userLockedAuthProfileEligible ? userLockedAuthProfileId : void 0,
			profileIds: candidateAuthProfileIds
		});
		if (!isPrimary && params.sessionId) {
			if (isFallbackCandidateSkipped({
				sessionId: params.sessionId,
				...candidateRef,
				authScope: candidateAuthScope
			})) {
				const skipReason = getFallbackCandidateSkipReason({
					sessionId: params.sessionId,
					...candidateRef,
					authScope: candidateAuthScope
				}) ?? "auth";
				const reauthCommand = buildProviderReauthCommand(candidate.provider);
				const reauthHint = reauthCommand ? `run \`${reauthCommand}\` to re-authenticate` : "re-authenticate that provider";
				const error = `Skipping ${candidate.provider}/${candidate.model}: recent ${skipReason} failure in this session (${reauthHint})`;
				pushSkippedAttempt(error, skipReason);
				await observeCandidateDecision("skip_candidate", {
					reason: skipReason,
					error
				});
				continue;
			}
		}
		let runOptions;
		let attemptedDuringCooldown = false;
		let transientProbeProviderForAttempt = null;
		if (authRuntime && authStore && candidateAuthProfileIds && !quotaRequiresAuthPreparation && !candidateHarnessAuth.skipsProviderAuthCooldown) {
			const profileIds = candidateAuthProfileIds;
			const isAnyProfileAvailable = profileIds.some((id) => !authRuntime.isProfileInCooldown(authStore, id, void 0, candidate.model));
			if (profileIds.length > 0 && !isAnyProfileAvailable) {
				const now = Date.now();
				const probeThrottleKey = resolveProbeThrottleKey(candidate.provider, params.agentDir);
				const decision = resolveCooldownDecision({
					candidate,
					isPrimary,
					requestedModel,
					hasFallbackCandidates,
					now,
					probeThrottleKey,
					authRuntime,
					authStore,
					profileIds
				});
				const authMode = decision.reason === "billing" || decision.reason === "auth" || decision.reason === "auth_permanent" || decision.reason === "session_expired" ? resolveSubscriptionAuthModeForProfiles({
					store: authStore,
					profileIds
				}) : void 0;
				if (decision.type !== "attempt") {
					const error = decision.type === "skip" ? decision.error : `Provider ${candidate.provider} is in cooldown`;
					pushSkippedAttempt(error, decision.reason, authMode);
					if (decision.type === "suspend_session" && params.sessionId) {
						emitFailoverEvent({
							sessionId: params.sessionId,
							lane: params.lane,
							fromProvider: candidate.provider,
							fromModel: candidate.model,
							reason: decision.reason,
							suspended: !hasRemainingCandidate
						});
						if (!hasRemainingCandidate) {
							deferredSuspension.pending = void 0;
							suspendSession({
								cfg: params.cfg,
								agentId: params.agentId,
								agentDir: params.agentDir,
								sessionId: params.sessionId,
								reason: resolveSessionSuspensionReason(decision.reason),
								failedProvider: candidate.provider,
								failedModel: candidate.model
							});
						}
					}
					await observeCandidateDecision("skip_candidate", {
						reason: decision.reason,
						error,
						profileCount: profileIds.length
					});
					continue;
				}
				if (decision.markProbe) markProbeAttempt(now, probeThrottleKey);
				if (shouldAllowCooldownProbeForReason(decision.reason)) {
					const isTransientCooldownReason = shouldUseTransientCooldownProbeSlot(decision.reason);
					if (isTransientCooldownReason && cooldownProbeUsedProviders.has(candidate.provider)) {
						const error = `Provider ${candidate.provider} is in cooldown (probe already attempted this run)`;
						pushSkippedAttempt(error, decision.reason, authMode);
						await observeCandidateDecision("skip_candidate", {
							reason: decision.reason,
							error,
							profileCount: profileIds.length
						});
						continue;
					}
					runOptions = { allowTransientCooldownProbe: true };
					if (isTransientCooldownReason) transientProbeProviderForAttempt = candidate.provider;
				}
				attemptedDuringCooldown = true;
				await observeCandidateDecision("probe_cooldown_candidate", {
					reason: decision.reason,
					allowTransientCooldownProbe: runOptions?.allowTransientCooldownProbe,
					profileCount: profileIds.length
				});
			}
		}
		const attemptRun = await runFallbackAttempt({
			run: params.run,
			...candidate,
			attempts,
			captureHarnessPreflight: true,
			options: {
				...runOptions,
				isFinalFallbackAttempt: !hasRemainingCandidate,
				modelRoutingProvenance: {
					requestedProvider: params.provider,
					requestedModel: params.model,
					stage: isPrimary ? "initial" : "fallback",
					fallbackReason: isPrimary ? void 0 : attempts.at(-1)?.reason
				}
			},
			deferSessionSuspension: hasRemainingCandidate,
			onDeferredSessionSuspension: (suspension) => {
				deferredSuspension.pending = suspension;
			},
			classifyResult: params.classifyResult,
			...attemptContext,
			attribution: runAttribution,
			abortSignal: params.abortSignal
		});
		if ("success" in attemptRun) {
			if (!attemptRun.stopped && (i > 0 || attempts.length > 0 || attemptedDuringCooldown)) {
				await observeCandidateDecision("candidate_succeeded", { previousAttempts: attempts });
				const notFoundAttempt = i > 0 ? attempts.find((a) => a.reason === "model_not_found") : void 0;
				if (notFoundAttempt) log.warn(`Model "${sanitizeForLog(notFoundAttempt.provider)}/${sanitizeForLog(notFoundAttempt.model)}" not found. Fell back to "${sanitizeForLog(candidate.provider)}/${sanitizeForLog(candidate.model)}".`);
			}
			return attemptRun.success;
		}
		const err = attemptRun.error;
		if (isAgentHarnessPreflightError(err)) {
			const failedHarnessId = resolveAgentHarnessPreflightOwner(err);
			if (!failedHarnessId) throw err;
			let nextEligibleIndex = candidates.length;
			for (let index = i + 1; index < candidates.length; index += 1) {
				const next = candidates[index];
				if (!next || tlsFailedProviders.has(next.provider)) continue;
				if (resolveModelFallbackCandidateAgentRuntime({
					cfg: params.cfg,
					agentId: params.agentId,
					sessionKey: params.sessionKey,
					resolveAgentHarnessRuntimeOverride: params.resolveAgentHarnessRuntimeOverride,
					...next
				}).runtime !== failedHarnessId) {
					nextEligibleIndex = index;
					break;
				}
			}
			const nextEligibleCandidate = candidates[nextEligibleIndex];
			if (!nextEligibleCandidate) throw err;
			lastError = err;
			await recordFailure(err, nextEligibleCandidate);
			i = nextEligibleIndex - 1;
			continue;
		}
		if (!attemptRun.classifiedResult && params.canFallbackAfterError && !await params.canFallbackAfterError({
			...candidateRef,
			error: err,
			...attemptContext
		})) throw err;
		if (attemptRun.classifiedResult) latestClassifiedResult = attemptRun.classifiedResult;
		if (attemptRun.exhaustionResult && (!exhaustionResult || attemptRun.exhaustionResult.priority >= exhaustionResult.priority)) exhaustionResult = attemptRun.exhaustionResult;
		if (isNonProviderRuntimeCoordinationError(err) || isTranscriptNotContinuableError(err)) throw err;
		if (transientProbeProviderForAttempt) {
			const probeFailureReason = describeFailoverError(err).reason;
			if (!shouldPreserveTransientCooldownProbeSlot(probeFailureReason)) cooldownProbeUsedProviders.add(transientProbeProviderForAttempt);
		}
		const errMessage = formatErrorMessage(err);
		if (isLikelyContextOverflowError(errMessage) && !hasProviderRequestSizeCeiling(err)) throw err;
		if (isMissingAgentHarnessError(err)) throw err;
		const normalized = coerceToFailoverError(err, {
			...candidateRef,
			...runAttribution
		}) ?? err;
		if (err instanceof LiveSessionModelSwitchError) {
			if (hasDifferentLiveSessionRuntimeSelection({
				error: err,
				currentAgentHarnessRuntimeOverride: candidateHarnessAuth.agentHarnessRuntimeOverride
			})) throw err;
			const liveSwitchTargetIndex = resolveLiveSessionModelSwitchRedirectIndex({
				error: err,
				candidates,
				currentIndex: i
			});
			if (liveSwitchTargetIndex !== null) {
				i = liveSwitchTargetIndex - 1;
				continue;
			}
			const switchMsg = err.message;
			const switchNormalized = new FailoverError(switchMsg, {
				reason: "unknown",
				...candidateRef,
				...runAttribution
			});
			lastError = switchNormalized;
			await observeFailedCandidate({
				attempts,
				...candObs,
				error: switchNormalized
			});
			continue;
		}
		const isKnownFailover = isFailoverError(normalized);
		if (!isKnownFailover && !hasRemainingCandidate) throw err;
		if (isKnownFailover && !isPrimary && params.sessionId && (normalized.reason === "auth" || normalized.reason === "auth_permanent")) markFallbackCandidateSkipped({
			sessionId: params.sessionId,
			...candidateRef,
			authScope: normalized.profileId?.trim() || candidateAuthScope,
			reason: normalized.reason
		});
		if (isKnownFailover && normalized.reason === "tls_certificate") tlsFailedProviders.add(candidate.provider);
		const failedNextCandidateIndex = resolveNextFallbackCandidateIndex({
			candidates,
			currentIndex: i,
			excludedProviders: tlsFailedProviders
		});
		lastError = normalized;
		await recordFailure(normalized, candidates[failedNextCandidateIndex]);
		if (failedNextCandidateIndex > i + 1) i = failedNextCandidateIndex - 1;
	}
	if (exhaustionResult) {
		const selected = latestClassifiedResult && params.mergeExhaustedResult ? {
			...latestClassifiedResult,
			result: params.mergeExhaustedResult({
				latestResult: latestClassifiedResult.result,
				preferredResult: exhaustionResult.result
			})
		} : exhaustionResult;
		return {
			outcome: "exhausted",
			result: selected.result,
			provider: selected.provider,
			model: selected.model,
			attempts
		};
	}
	return throwFallbackFailureSummary({
		attempts,
		candidates,
		lastError,
		label: "models",
		formatAttempt: (attempt) => `${attempt.provider}/${attempt.model}: ${attempt.error}${attempt.reason ? ` (${attempt.reason})` : ""}`,
		soonestCooldownExpiry: resolveFallbackSoonestCooldownExpiry({
			authRuntime,
			userLockedAuthProfileId,
			agentDir: params.agentDir,
			cfg: params.cfg,
			profileIdsByCandidate
		}),
		attribution: {
			sessionId: params.sessionId,
			lane: params.lane
		},
		cfg: params.cfg,
		agentId: params.agentId,
		agentDir: params.agentDir
	});
}
//#endregion
export { LiveSessionModelSwitchError as i, MODEL_FALLBACK_SKIPPED_CODE as n, shouldUseTransientCooldownProbeSlot as r, runWithModelFallback as t };
