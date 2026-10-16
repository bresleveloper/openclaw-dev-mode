import { n as readCodexRuntimeModelId } from "./model-runtime-BdqzOMkU.mjs";
import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { m as sessionBindingIdentity } from "./session-binding-record-BZB8RgcF.mjs";
import { E as waitForCodexAppServerClientExit, S as retainSharedCodexAppServerClientByInstanceId } from "./auth-cache-key-SXYawyhG.mjs";
import { t as CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS } from "./session-binding-meta-Lkm5Lpf4.mjs";
import { i as CodexAppServerScopedRequestRejectedError, r as CodexAppServerRpcError } from "./rpc-error-hmWM21RB.mjs";
import { i as resolveCodexBindingAppServerConnection } from "./binding-connection-C-08ez1w.mjs";
import { F as consumeCodexAppServerLiveThread, J as revertCodexAppServerLiveThreadInstructions, M as getCodexInferenceThreadQualification, W as protectCodexAppServerLiveThread, _ as retainSharedCodexAppServerClientIfCurrent, q as retainCodexAppServerLiveThread, s as createIsolatedCodexAppServerClient } from "./shared-client-r9NcV_GJ.mjs";
import "./responses-oauth-twnuTaAa.mjs";
import { a as isCodexAppServerIndeterminateRequestCancellationError, s as isCodexAppServerPrewriteRequestCancellationError } from "./client-BM1XpAkE.mjs";
import { o as readCodexNotificationThreadId, s as readCodexNotificationTurnId } from "./turn-router-DLqce1id.mjs";
import { c as isCodexNoActiveTurnInterruptError, f as unsubscribeCodexThreadBestEffort, o as closeCodexStartupClientBestEffort, r as CodexAppServerUnsafeSubscriptionError } from "./attempt-client-cleanup-DNfVb5SC.mjs";
import { n as readCodexThreadContextSnapshot, s as readCodexNotificationItem } from "./event-projector-usage-03R0I2dM.mjs";
import { r as resolveCodexSessionBinding } from "./session-binding-Ce7BqiPN.mjs";
import { t as codexNativeSubagentMonitorRuntime } from "./native-subagent-monitor-BXClJlaW.mjs";
import { i as assertCodexSupervisionThreadLineage } from "./thread-policy-DQ1pRnpX.mjs";
import { t as resumeCodexAppServerThread } from "./thread-resume-D27gNXZE.mjs";
import { s as withCodexAppServerThreadMutationHold, t as isSameCodexAppServerThreadOwner } from "./thread-ownership-B1z1lAmI.mjs";
import { t as resolveCodexNativeExecutionBlock } from "./sandbox-guard-WqE8yPge.mjs";
import { t as persistCodexContextCompactionActivity } from "./context-compaction-activity-CMla5FPJ.mjs";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { coerceErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { isIncognitoSessionKey } from "openclaw/plugin-sdk/session-key-runtime";
import { AsyncLocalStorage } from "node:async_hooks";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { AgentHarnessSessionSupersededError, embeddedAgentLog, resolveCompactionTimeoutMs } from "openclaw/plugin-sdk/agent-harness-runtime";
import { resolveAgentDir as resolveAgentDir$1 } from "openclaw/plugin-sdk/agent-runtime";
import { runWithAsyncWorkResources } from "openclaw/plugin-sdk/agent-harness-tool-runtime";
import { createNativeSessionBindingAuthority } from "openclaw/plugin-sdk/agent-harness-session-runtime";
import { createDedupeCache } from "openclaw/plugin-sdk/dedupe-runtime";
//#region extensions/codex/src/app-server/compact-helpers.ts
/** Settles the consumed subscription without returning stale ownership to the next turn. */
async function settleCodexCompactionSubscription(params) {
	let retained = false;
	try {
		if (params.compacted) await params.authority.withCurrent(() => revertCodexAppServerLiveThreadInstructions(params.client, params.binding.threadId));
		const ownership = params.ownership;
		if (ownership) retained = await params.bindingStore.withLease(params.identity, async () => {
			let pendingRetention;
			try {
				await params.authority.withCurrent(() => {
					if (!isSameCodexAppServerThreadOwner(params.bindingStore.read(params.identity), params.binding)) return;
					pendingRetention = retainCodexAppServerLiveThread(params.client, params.binding.threadId, ownership.release, ownership.configFingerprint, ownership.serviceTier, ownership.ephemeralPolicy && params.compacted ? {
						...ownership.ephemeralPolicy,
						refreshableInstructions: ownership.ephemeralPolicy.nativeRefreshableInstructions
					} : ownership.ephemeralPolicy);
				});
			} catch (error) {
				await pendingRetention;
				throw error;
			}
			return pendingRetention ? await pendingRetention : false;
		}, { authority: params.authority });
	} catch (error) {
		if (!(error instanceof AgentHarnessSessionSupersededError)) throw error;
	} finally {
		if (!retained) await params.release?.();
	}
}
async function clearContextEngineProjectionBeforeNativeCompaction(params) {
	const contextEngineBinding = params.binding.contextEngine;
	if (!contextEngineBinding?.projection) return;
	await params.bindingStore.mutate(params.identity, {
		kind: "patch",
		threadId: params.binding.threadId,
		patch: { contextEngine: {
			...contextEngineBinding,
			projection: void 0
		} }
	}, params.assertCurrent, params.authority);
	embeddedAgentLog.info("cleared codex context-engine projection before native compaction", {
		sessionId: params.sessionId,
		threadId: params.binding.threadId,
		previousEpoch: contextEngineBinding.projection.epoch,
		previousFingerprint: contextEngineBinding.projection.fingerprint
	});
}
function isSameNativeCompactionBinding(current, expected) {
	return isSameCodexAppServerThreadOwner(current, expected) && current.authProfileId === expected.authProfileId && current.contextEngine?.engineId === expected.contextEngine?.engineId && current.contextEngine?.policyFingerprint === expected.contextEngine?.policyFingerprint && current.contextEngine?.projection?.mode === expected.contextEngine?.projection?.mode && current.contextEngine?.projection?.epoch === expected.contextEngine?.projection?.epoch && current.contextEngine?.projection?.fingerprint === expected.contextEngine?.projection?.fingerprint;
}
function isCodexThreadNotFoundError(error) {
	return coerceErrorMessage(error).toLowerCase().includes("thread not found");
}
const warnedIgnoredCompactionOverrides = createDedupeCache({
	ttlMs: 0,
	maxSize: 4096
});
function warnIfIgnoringOpenClawCompactionOverrides(params) {
	const ignoredConfig = readIgnoredCompactionOverridePaths(params);
	if (ignoredConfig.length === 0) return;
	const warningKey = ignoredConfig.join("\0");
	if (warnedIgnoredCompactionOverrides.check(warningKey)) return;
	embeddedAgentLog.warn("ignoring OpenClaw compaction overrides for Codex app-server compaction; Codex uses native server-side compaction", {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		ignoredConfig
	});
}
function readIgnoredCompactionOverridePaths(params) {
	const compaction = asOptionalRecord(params.config?.agents?.defaults?.compaction);
	return [
		"model",
		"thinkingLevel",
		"provider"
	].flatMap((field) => {
		const value = compaction?.[field];
		return typeof value === "string" && value.trim() ? [`agents.defaults.compaction.${field}`] : [];
	});
}
function resolveCodexCompactionExecutionBlock(params) {
	return resolveCodexNativeExecutionBlock({
		config: params.config,
		sessionKey: params.sandboxSessionKey ?? params.sessionKey,
		sessionId: params.sessionId,
		agentId: params.sandboxAgentId ?? params.agentId,
		sandbox: params.sandbox,
		surface: "native compaction"
	});
}
//#endregion
//#region extensions/codex/src/app-server/compact-lifecycle.ts
function watchCodexNativeCompactionCompletion(params) {
	const runOutsideBindingLease = AsyncLocalStorage.snapshot();
	let settled = false;
	let requestStarted = false;
	let abortRequested = false;
	let interruptRequested = false;
	let retirementStarted = false;
	let compactionTurnId;
	let compactionItemId;
	let compactionItemCompleted = false;
	let tokensAfter;
	let admissionFailure;
	const { promise: completion, resolve: resolveCompletion } = createDeferred();
	let removeNotificationHandler = () => {};
	let removeCloseHandler = () => {};
	let removeAbortHandler = () => {};
	let completionTimeout;
	let interruptGraceTimeout;
	const finish = (result) => {
		if (settled) return;
		settled = true;
		removeNotificationHandler();
		removeCloseHandler();
		removeAbortHandler();
		clearTimeout(completionTimeout);
		clearTimeout(interruptGraceTimeout);
		resolveCompletion(result);
	};
	const complete = () => finish({
		completed: true,
		...compactionTurnId ? { turnId: compactionTurnId } : {},
		...compactionItemId ? { itemId: compactionItemId } : {},
		...tokensAfter !== void 0 ? { tokensAfter } : {}
	});
	const fail = (reason) => finish({
		completed: false,
		reason
	});
	const retireUnconfirmed = (reason) => {
		if (settled || retirementStarted) return;
		retirementStarted = true;
		runOutsideBindingLease(() => params.retireUnconfirmed()).then(() => fail(reason)).catch((error) => {
			embeddedAgentLog.error("failed to retire unconfirmed codex app-server compaction", {
				threadId: params.threadId,
				turnId: compactionTurnId,
				reason: coerceErrorMessage(error)
			});
		});
	};
	const requestInterrupt = () => {
		if (settled || !requestStarted || !abortRequested || !compactionTurnId || interruptRequested) return;
		interruptRequested = true;
		params.client.request("turn/interrupt", {
			threadId: params.threadId,
			turnId: compactionTurnId
		}, { timeoutMs: Math.max(1, params.interruptGraceMs) }).catch((error) => {
			if (isCodexNoActiveTurnInterruptError(error)) return;
			embeddedAgentLog.warn("codex app-server compaction interrupt request failed", {
				threadId: params.threadId,
				turnId: compactionTurnId,
				reason: coerceErrorMessage(error)
			});
		});
	};
	const beginInterruptGrace = () => {
		if (settled || !requestStarted || interruptGraceTimeout) return;
		requestInterrupt();
		interruptGraceTimeout = setTimeout(() => {
			embeddedAgentLog.warn("codex app-server compaction did not reach terminal state after interruption", {
				threadId: params.threadId,
				turnId: compactionTurnId,
				interruptGraceMs: params.interruptGraceMs
			});
			retireUnconfirmed("codex app-server compaction did not reach terminal state after interruption");
		}, Math.max(1, params.interruptGraceMs));
		interruptGraceTimeout.unref?.();
	};
	const beginCompletionTimeout = () => {
		completionTimeout = setTimeout(() => {
			abortRequested = true;
			beginInterruptGrace();
			embeddedAgentLog.warn("codex app-server compaction exceeded its completion budget", {
				threadId: params.threadId,
				timeoutMs: params.timeoutMs,
				interruptRequested
			});
		}, Math.max(1, params.timeoutMs));
		completionTimeout.unref?.();
	};
	removeNotificationHandler = params.client.addNotificationHandler((notification) => {
		if (!requestStarted || !isJsonObject(notification.params)) return;
		if (readCodexNotificationThreadId(notification.params) !== params.threadId) return;
		const notificationTurnId = readCodexNotificationTurnId(notification.params);
		if (notification.method === "turn/started") {
			compactionTurnId = notificationTurnId;
			requestInterrupt();
			return;
		}
		if (compactionTurnId && notificationTurnId !== compactionTurnId) return;
		if (notification.method === "thread/tokenUsage/updated") {
			tokensAfter = readCodexThreadContextSnapshot(notification.params).activeContextTokens ?? tokensAfter;
			return;
		}
		const item = readCodexNotificationItem(notification.params);
		if (item?.type === "contextCompaction") {
			if (notification.method === "item/started") {
				compactionTurnId = compactionTurnId ?? notificationTurnId;
				if (!compactionItemId && compactionTurnId) try {
					params.onCompactionTurn?.(compactionTurnId);
				} catch (error) {
					admissionFailure = coerceErrorMessage(error);
					abortRequested = true;
					beginInterruptGrace();
				}
				compactionItemId = item.id;
				requestInterrupt();
				return;
			}
			if (notification.method === "item/completed" && compactionItemId === item.id) {
				compactionItemCompleted = true;
				return;
			}
		}
		if (notification.method !== "turn/completed" || !compactionTurnId || notificationTurnId !== compactionTurnId) return;
		const turn = isJsonObject(notification.params.turn) ? notification.params.turn : void 0;
		const status = typeof turn?.status === "string" ? turn.status : void 0;
		if (admissionFailure) {
			fail(admissionFailure);
			return;
		}
		if (status !== "completed") {
			fail(`codex app-server compaction turn ended with status ${status ?? "unknown"}`);
			return;
		}
		const incompleteReason = !compactionItemId ? "codex app-server compaction turn completed without a compaction item" : !compactionItemCompleted ? "codex app-server compaction turn completed before its compaction item" : void 0;
		if (incompleteReason) {
			fail(incompleteReason);
			return;
		}
		complete();
	});
	removeCloseHandler = params.client.addCloseHandler(() => {
		retireUnconfirmed("codex app-server closed before native compaction completed");
	});
	if (params.signal) {
		const onAbort = () => {
			abortRequested = true;
			beginInterruptGrace();
		};
		params.signal.addEventListener("abort", onAbort, { once: true });
		removeAbortHandler = () => params.signal?.removeEventListener("abort", onAbort);
		if (params.signal.aborted) onAbort();
	}
	return {
		completion,
		beginRequest: () => {
			requestStarted = true;
			beginCompletionTimeout();
			if (abortRequested) beginInterruptGrace();
		},
		confirmRequestRejected: () => fail("codex app-server rejected the compaction request"),
		retireUnconfirmedRequest: async (reason) => {
			retireUnconfirmed(reason);
			return await completion;
		},
		cancel: () => {
			if (!requestStarted) fail("compaction request did not start");
		}
	};
}
//#endregion
//#region extensions/codex/src/app-server/compact-result.ts
function codexNativeCompactionResult(params, outcome) {
	return {
		ok: true,
		compacted: outcome.compacted,
		...outcome.reason ? { reason: outcome.reason } : {},
		result: {
			summary: "",
			firstKeptEntryId: "",
			tokensBefore: params.currentTokenCount ?? 0,
			...outcome.tokensAfter !== void 0 ? { tokensAfter: outcome.tokensAfter } : {},
			details: outcome.details
		}
	};
}
function skippedCodexNativeCompactionResult(params, skipped) {
	return codexNativeCompactionResult(params, {
		compacted: false,
		reason: skipped.reason,
		details: {
			backend: "codex-app-server",
			skipped: true,
			reason: skipped.code,
			request: skipped.request ?? "after_context_engine",
			trigger: params.trigger ?? "unknown",
			...skipped.expectedThreadId ? { expectedThreadId: skipped.expectedThreadId } : {},
			...skipped.currentThreadId ? { currentThreadId: skipped.currentThreadId } : {}
		}
	});
}
function failedCodexThreadBindingCompactionResult(params, recovery) {
	embeddedAgentLog.warn("codex app-server compaction could not use thread binding", {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		threadId: recovery.threadId,
		reason: recovery.reason,
		recovery: recovery.recovery
	});
	return {
		ok: false,
		compacted: false,
		reason: recovery.reason,
		failure: {
			reason: recovery.recovery,
			rawError: recovery.reason
		}
	};
}
//#endregion
//#region extensions/codex/src/app-server/compact.ts
const CODEX_NATIVE_COMPACTION_INTERRUPT_GRACE_MS = 3e4;
/**
* Starts native Codex compaction for a manually requested bound session, or
* reports why Codex-owned automatic compaction should handle the trigger.
*/
async function maybeCompactCodexAppServerSession(params, options) {
	params.hostCapabilities.assertActive();
	warnIfIgnoringOpenClawCompactionOverrides(params);
	if (params.trigger !== "manual" && !options.allowNonManualNativeRequest) {
		embeddedAgentLog.info("skipping codex app-server compaction for non-manual trigger", {
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			trigger: params.trigger
		});
		return codexNativeCompactionResult(params, {
			compacted: false,
			reason: "codex app-server owns automatic compaction",
			details: {
				backend: "codex-app-server",
				skipped: true,
				reason: "non_manual_trigger",
				trigger: params.trigger ?? "unknown"
			}
		});
	}
	const nativeExecutionBlock = resolveCodexCompactionExecutionBlock(params);
	if (nativeExecutionBlock) return {
		ok: false,
		compacted: false,
		reason: nativeExecutionBlock
	};
	const bindingIdentity = sessionBindingIdentity({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		config: params.config
	});
	const abortedResult = (attempt, expectedThreadId, currentThreadId = expectedThreadId) => options.allowNonManualNativeRequest ? skippedCodexNativeCompactionResult(attempt, {
		reason: "codex app-server compaction aborted before native compaction",
		code: "aborted_before_native_compaction",
		request: options.nativeCompactionRequest ?? "after_context_engine",
		...expectedThreadId ? {
			expectedThreadId,
			currentThreadId
		} : {}
	}) : {
		ok: false,
		compacted: false,
		reason: "codex app-server compaction aborted while waiting to start"
	};
	let resolvedBinding;
	try {
		resolvedBinding = await resolveCodexSessionBinding({
			bindingStore: options.bindingStore,
			identity: bindingIdentity,
			config: params.config,
			storePath: params.sessionTarget?.storePath,
			signal: params.abortSignal
		});
	} catch (error) {
		if (!params.abortSignal?.aborted) throw error;
		return abortedResult(params, options.bindingStore.read(bindingIdentity)?.threadId);
	}
	const { binding: initialBinding, authority } = resolvedBinding;
	const assertCurrent = authority.assertCurrent;
	const settlementAuthority = createNativeSessionBindingAuthority(authority.lineage, () => {});
	const assertSettlementCurrent = settlementAuthority.assertCurrent;
	if (!initialBinding?.threadId) return failedCodexThreadBindingCompactionResult(params, {
		reason: "no codex app-server thread binding",
		recovery: "missing_thread_binding"
	});
	if (initialBinding.modelProvider === "openclaw_token_sharing") return {
		ok: false,
		compacted: false,
		reason: "Manual compaction is unavailable with ChatGPT subscription sharing. Automatic compaction runs during normal turns; continue the conversation or start a new session."
	};
	if (params.nativeToolSurface === "host-isolated" || initialBinding.nativeToolPolicyRestricted === true || initialBinding.ringZeroConfigFingerprint !== void 0) return codexNativeCompactionResult(params, {
		compacted: false,
		reason: "native compaction is unavailable for a host-isolated Codex session",
		details: {
			backend: "codex-app-server",
			skipped: true,
			reason: "native_tool_policy_restricted",
			expectedThreadId: initialBinding.threadId
		}
	});
	let binding = initialBinding;
	const requestedAuthProfileId = params.authProfileId?.trim() || void 0;
	let connection;
	try {
		const config = params.config ?? {};
		connection = await resolveCodexBindingAppServerConnection({
			binding,
			authProfileId: requestedAuthProfileId ?? binding.authProfileId,
			pluginConfig: options.pluginConfig,
			config,
			assertCurrent,
			agentDir: resolveAgentDir$1(config, bindingIdentity.agentId)
		});
	} catch (error) {
		return {
			ok: false,
			compacted: false,
			reason: coerceErrorMessage(error)
		};
	}
	const { appServer, usesSupervisionConnection } = connection;
	if (!usesSupervisionConnection && requestedAuthProfileId && binding.authProfileId && binding.authProfileId !== requestedAuthProfileId) return {
		ok: false,
		compacted: false,
		reason: "auth profile mismatch for session binding"
	};
	const shouldReleaseDefaultLease = !options.clientFactory;
	const clientFactory = options.clientFactory ?? createIsolatedCodexAppServerClient;
	const runtimeAuthPlan = usesSupervisionConnection ? void 0 : params.runtimeAuthPlan ?? params.runtimePlan?.auth;
	const usesPreparedApiKey = appServer.start.homeScope !== "user" && runtimeAuthPlan?.modelRoute?.authRequirement === "api-key";
	const preparedApiKey = usesPreparedApiKey ? params.resolvedApiKey?.trim() : void 0;
	if (usesPreparedApiKey && !preparedApiKey) return {
		ok: false,
		compacted: false,
		reason: "Prepared Codex Platform compaction route is missing its resolved API key."
	};
	return await runWithAsyncWorkResources(async (onAcquired) => {
		const modelSource = params.hostCapabilities.retainSourceAuthority();
		let modelSourceTransferred = false;
		onAcquired({
			release: () => {
				if (!modelSourceTransferred) modelSource?.release();
			},
			releaseBeforeResultWhenIdle: true
		});
		const modelCancellation = new AbortController();
		const signals = [
			params.abortSignal,
			modelSource?.signal,
			modelCancellation.signal
		].filter((signal) => signal !== void 0);
		const attempt = {
			...params,
			abortSignal: AbortSignal.any(signals)
		};
		const assertAdmissionCurrent = () => {
			attempt.hostCapabilities.assertActive();
			assertCurrent();
		};
		try {
			return await withCodexAppServerThreadMutationHold(binding.threadId, async (hold, start) => {
				await authority.withCurrent(assertAdmissionCurrent);
				const boundClientLease = await retainSharedCodexAppServerClientByInstanceId(binding.clientId);
				try {
					await authority.withCurrent(assertAdmissionCurrent);
					attempt.abortSignal.throwIfAborted();
				} catch (error) {
					await boundClientLease?.release();
					throw error;
				}
				const client = boundClientLease?.client ?? await clientFactory({
					startOptions: appServer.start,
					...preparedApiKey ? { preparedAuth: {
						kind: "api-key",
						apiKey: preparedApiKey
					} } : { authProfileId: connection.clientAuthProfileId },
					authRequirement: runtimeAuthPlan?.modelRoute?.authRequirement,
					agentDir: attempt.agentDir,
					config: attempt.config,
					assertCurrent: assertAdmissionCurrent
				});
				start();
				embeddedAgentLog.info("selected codex app-server compaction client", {
					clientId: client.getInstanceId(),
					recordedOwnerReused: Boolean(boundClientLease),
					threadId: binding.threadId
				});
				let releaseThreadSubscription;
				let retainedThreadOwnership;
				let canRetainThreadOwnership = false;
				let compactionSucceeded = false;
				let temporaryClientExited = true;
				let compactionRequestDefinitelyRejected = false;
				let nativeRequestNeedsSettlement = false;
				const leaseAuthority = createNativeSessionBindingAuthority(authority.lineage, () => {
					if (!nativeRequestNeedsSettlement && !compactionRequestDefinitelyRejected) assertAdmissionCurrent();
				});
				let tokensAfter;
				let modelOwner;
				const releaseCompactionThread = async (threadId) => {
					if (await unsubscribeCodexThreadBestEffort(client, {
						threadId,
						timeoutMs: 5e3
					})) return;
					await closeCodexStartupClientBestEffort(client);
					throw new CodexAppServerUnsafeSubscriptionError(`Codex compaction thread subscription could not be released: ${threadId}`);
				};
				const completionWatch = watchCodexNativeCompactionCompletion({
					client,
					threadId: binding.threadId,
					signal: attempt.abortSignal,
					timeoutMs: options.nativeCompletionTimeoutMs ?? resolveCompactionTimeoutMs(attempt.config),
					interruptGraceMs: options.nativeInterruptGraceMs ?? CODEX_NATIVE_COMPACTION_INTERRUPT_GRACE_MS,
					onCompactionTurn: (turnId) => {
						assertAdmissionCurrent();
						const runtimeModel = attempt.runtimeModel;
						const mapping = !usesSupervisionConnection && attempt.provider && attempt.model && runtimeModel?.provider === attempt.provider && runtimeModel.id === attempt.model ? {
							nativeModel: {
								provider: attempt.provider,
								model: readCodexRuntimeModelId(runtimeModel, attempt.model)
							},
							authorizedModel: {
								provider: attempt.provider,
								model: attempt.model
							}
						} : void 0;
						modelOwner?.bindTurn(turnId, mapping);
					},
					retireUnconfirmed: async () => {
						releaseThreadSubscription = void 0;
						const transportStopped = await client.closeAndWait({
							exitTimeoutMs: 5e3,
							forceKillDelayMs: 250
						});
						temporaryClientExited = transportStopped.exited;
						if (appServer.start.transport === "stdio") {
							if (transportStopped.exited) return;
							throw new Error("failed to stop unconfirmed codex app-server process");
						}
						if (usesSupervisionConnection) throw new Error("cannot detach an unconfirmed supervised codex thread");
						if (await options.bindingStore.mutate(bindingIdentity, {
							kind: "clear",
							threadId: binding.threadId,
							clientId: binding.clientId
						}, assertSettlementCurrent, settlementAuthority)) return;
						const currentBinding = options.bindingStore.read(bindingIdentity);
						if (currentBinding?.threadId !== binding.threadId || currentBinding.clientId !== binding.clientId) return;
						throw new Error("failed to detach unconfirmed codex app-server thread binding");
					}
				});
				const acquireThreadSubscription = async (timeoutMs) => {
					if (!isIncognitoSessionKey(attempt.sessionKey)) {
						retainedThreadOwnership = await consumeCodexAppServerLiveThread(client, binding.threadId);
						if (!retainedThreadOwnership) {
							const resumed = await resumeCodexAppServerThread({
								client,
								abandonClient: async () => closeCodexStartupClientBestEffort(client),
								request: {
									threadId: binding.threadId,
									excludeTurns: true
								},
								timeoutMs: timeoutMs ?? appServer.requestTimeoutMs,
								assertCurrent: assertAdmissionCurrent,
								withCurrent: authority.withCurrent,
								signal: attempt.abortSignal
							});
							releaseThreadSubscription = async () => releaseCompactionThread(binding.threadId);
							assertCodexSupervisionThreadLineage(binding, resumed.thread);
						} else if (binding.connectionScope === "supervision") {
							releaseThreadSubscription = async () => retainedThreadOwnership?.release(binding.threadId);
							const { thread } = await client.request("thread/read", {
								threadId: binding.threadId,
								includeTurns: false
							}, {
								assertCurrent: assertAdmissionCurrent,
								withCurrent: authority.withCurrent
							});
							retainedThreadOwnership.assertCurrent();
							assertCodexSupervisionThreadLineage(binding, thread);
							canRetainThreadOwnership = true;
							assertAdmissionCurrent();
						}
						releaseThreadSubscription ??= async () => releaseCompactionThread(binding.threadId);
					}
				};
				try {
					const guardedResult = await options.bindingStore.withLease(bindingIdentity, async () => {
						const currentBinding = options.bindingStore.read(bindingIdentity);
						if (attempt.abortSignal.aborted) {
							if (!options.allowNonManualNativeRequest) attempt.abortSignal.throwIfAborted();
							return {
								started: false,
								result: skippedCodexNativeCompactionResult(attempt, {
									reason: "codex app-server compaction aborted before native compaction",
									code: "aborted_before_native_compaction",
									request: options.nativeCompactionRequest ?? "after_context_engine",
									expectedThreadId: binding.threadId,
									currentThreadId: currentBinding?.threadId
								})
							};
						}
						assertCurrent();
						if (!currentBinding || !isSameNativeCompactionBinding(currentBinding, binding)) {
							embeddedAgentLog.warn("codex app-server compaction could not use the thread binding because it changed", {
								sessionId: attempt.sessionId,
								sessionKey: attempt.sessionKey,
								expectedThreadId: binding.threadId,
								currentThreadId: currentBinding?.threadId
							});
							const isRequiredPreflight = options.nativeCompactionRequest === "required_preflight";
							return {
								started: false,
								result: options.allowNonManualNativeRequest && !isRequiredPreflight ? skippedCodexNativeCompactionResult(attempt, {
									reason: "codex app-server binding changed before native compaction",
									code: "binding_changed_before_native_compaction",
									request: options.nativeCompactionRequest ?? "after_context_engine",
									expectedThreadId: binding.threadId,
									currentThreadId: currentBinding?.threadId
								}) : failedCodexThreadBindingCompactionResult(attempt, {
									threadId: currentBinding?.threadId ?? binding.threadId,
									reason: "codex app-server binding changed before native compaction",
									recovery: "stale_thread_binding"
								})
							};
						}
						binding = currentBinding;
						const guardedRequestTimeoutMs = options.allowNonManualNativeRequest ? Math.min(appServer.requestTimeoutMs, CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS) : void 0;
						assertAdmissionCurrent();
						await acquireThreadSubscription(guardedRequestTimeoutMs);
						canRetainThreadOwnership = true;
						attempt.abortSignal.throwIfAborted();
						const configurationQualification = getCodexInferenceThreadQualification(client, binding.threadId);
						modelOwner = await codexNativeSubagentMonitorRuntime.register({
							client,
							parentThreadId: binding.threadId,
							modelSource,
							configurationQualification,
							unqualifiedModelExecution: modelSource && !configurationQualification ? true : void 0,
							onUnqualifiedModelCancelled: (reason) => modelCancellation.abort(reason),
							requesterSessionKey: attempt.sessionKey,
							agentId: bindingIdentity.agentId,
							assertCurrent: assertAdmissionCurrent,
							retainClient: () => retainSharedCodexAppServerClientIfCurrent(client),
							retainParentThread: (threadId) => protectCodexAppServerLiveThread(client, threadId)
						});
						modelSourceTransferred = true;
						assertAdmissionCurrent();
						attempt.abortSignal.throwIfAborted();
						await clearContextEngineProjectionBeforeNativeCompaction({
							sessionId: attempt.sessionId,
							bindingStore: options.bindingStore,
							identity: bindingIdentity,
							binding,
							assertCurrent: assertAdmissionCurrent,
							authority
						});
						assertAdmissionCurrent();
						try {
							canRetainThreadOwnership = false;
							completionWatch.beginRequest();
							nativeRequestNeedsSettlement = true;
							await client.request("thread/compact/start", { threadId: binding.threadId }, {
								...guardedRequestTimeoutMs === void 0 ? {} : { timeoutMs: guardedRequestTimeoutMs },
								signal: attempt.abortSignal,
								withCurrent: authority.withCurrent,
								assertCurrent: assertAdmissionCurrent
							});
							return {
								started: true,
								accepted: true
							};
						} catch (error) {
							compactionRequestDefinitelyRejected ||= error instanceof CodexAppServerScopedRequestRejectedError || isCodexAppServerPrewriteRequestCancellationError(error) || error instanceof CodexAppServerRpcError;
							if (compactionRequestDefinitelyRejected) {
								canRetainThreadOwnership = !isCodexThreadNotFoundError(error);
								completionWatch.confirmRequestRejected();
								nativeRequestNeedsSettlement = false;
								if (error instanceof CodexAppServerRpcError || binding.contextEngine?.projection) await options.bindingStore.mutate(bindingIdentity, {
									kind: "set",
									binding
								}, assertSettlementCurrent, settlementAuthority);
							}
							return {
								started: true,
								accepted: false,
								error
							};
						}
					}, {
						assertCurrent: () => nativeRequestNeedsSettlement || compactionRequestDefinitelyRejected ? assertSettlementCurrent() : assertAdmissionCurrent(),
						authority: leaseAuthority
					});
					if (!guardedResult.started) return guardedResult.result;
					if (!guardedResult.accepted) {
						if (compactionRequestDefinitelyRejected) throw guardedResult.error;
						if (!attempt.abortSignal.aborted || !isCodexAppServerIndeterminateRequestCancellationError(guardedResult.error)) {
							await completionWatch.retireUnconfirmedRequest(`codex app-server compaction start was unconfirmed: ${coerceErrorMessage(guardedResult.error)}`);
							nativeRequestNeedsSettlement = false;
							throw guardedResult.error;
						}
					}
					embeddedAgentLog.info("waiting for codex app-server compaction completion", {
						sessionId: attempt.sessionId,
						threadId: binding.threadId
					});
					const completion = await completionWatch.completion;
					nativeRequestNeedsSettlement = false;
					await settlementAuthority.withCurrent(assertSettlementCurrent);
					if (!completion.completed) throw new Error(completion.reason);
					compactionSucceeded = true;
					tokensAfter = completion.tokensAfter;
					if (completion.turnId && completion.itemId) await persistCodexContextCompactionActivity({
						sessionTarget: attempt.sessionTarget,
						config: attempt.config,
						cwd: attempt.workspaceDir,
						runId: attempt.runId,
						threadId: binding.threadId,
						turnId: completion.turnId,
						itemId: completion.itemId,
						timestamp: Date.now()
					});
					await settlementAuthority.withCurrent(assertSettlementCurrent);
					embeddedAgentLog.info("completed codex app-server compaction", {
						sessionId: attempt.sessionId,
						threadId: binding.threadId
					});
					canRetainThreadOwnership = true;
				} catch (error) {
					if (nativeRequestNeedsSettlement) {
						await completionWatch.retireUnconfirmedRequest(`codex app-server compaction ownership failed after request admission: ${coerceErrorMessage(error)}`);
						nativeRequestNeedsSettlement = false;
					}
					if (isCodexThreadNotFoundError(error)) return failedCodexThreadBindingCompactionResult(attempt, {
						threadId: binding.threadId,
						reason: coerceErrorMessage(error),
						recovery: "stale_thread_binding"
					});
					embeddedAgentLog.warn("codex app-server compaction failed", {
						sessionId: attempt.sessionId,
						sessionKey: attempt.sessionKey,
						threadId: binding.threadId,
						reason: coerceErrorMessage(error)
					});
					return {
						ok: false,
						compacted: false,
						reason: coerceErrorMessage(error)
					};
				} finally {
					completionWatch.cancel();
					try {
						await settleCodexCompactionSubscription({
							client,
							bindingStore: options.bindingStore,
							identity: bindingIdentity,
							binding,
							authority: settlementAuthority,
							ownership: canRetainThreadOwnership ? retainedThreadOwnership : void 0,
							compacted: compactionSucceeded,
							release: releaseThreadSubscription
						});
					} finally {
						try {
							await modelOwner?.unregister();
						} finally {
							const ownerExit = boundClientLease?.release();
							if (ownerExit && appServer.start.transport === "stdio") hold(ownerExit);
							else if (!boundClientLease && shouldReleaseDefaultLease) {
								if (appServer.start.transport === "stdio") hold(waitForCodexAppServerClientExit(client));
								temporaryClientExited = temporaryClientExited && (await client.closeAndWait()).exited;
							}
						}
					}
				}
				if (!temporaryClientExited) throw new CodexAppServerUnsafeSubscriptionError(`Codex compaction client did not exit: ${binding.threadId}`);
				const details = {
					backend: "codex-app-server",
					threadId: binding.threadId,
					signal: "thread/compact/start",
					pending: false,
					completed: true,
					...options.allowNonManualNativeRequest ? {
						request: options.nativeCompactionRequest ?? "after_context_engine",
						trigger: attempt.trigger ?? "unknown"
					} : {}
				};
				return codexNativeCompactionResult(attempt, {
					compacted: true,
					tokensAfter,
					details
				});
			}, attempt.abortSignal);
		} catch (error) {
			if (attempt.abortSignal.aborted) return abortedResult(attempt, initialBinding.threadId, binding.threadId);
			throw error;
		}
	});
}
//#endregion
export { maybeCompactCodexAppServerSession };
