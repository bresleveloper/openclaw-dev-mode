import { m as sessionBindingIdentity } from "./session-binding-record-BGoz8wOK.mjs";
import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { n as withCodexAppServerThreadMutation, t as isIncognitoSessionKey } from "./incognito-session-uhrBF6wJ.mjs";
import { o as CodexAppServerRpcError } from "./timeout-C910MdAB.mjs";
import { i as resolveCodexBindingAppServerConnection } from "./binding-connection-ThoatDcb.mjs";
import { N as consumeCodexAppServerLiveThread, W as retainCodexAppServerLiveThread, c as getLeasedSharedCodexAppServerClient, h as releaseLeasedSharedCodexAppServerClient } from "./shared-client-DA4VR4Eb.mjs";
import { u as isCodexAppServerPrewriteRequestCancellationError } from "./client-Cs08OXVQ.mjs";
import { b as readCodexNotificationTurnId, l as isCodexNoActiveTurnInterruptError, o as closeCodexStartupClientBestEffort, p as unsubscribeCodexThreadBestEffort, r as CodexAppServerUnsafeSubscriptionError, y as readCodexNotificationThreadId } from "./attempt-client-cleanup-CEv1cKwF.mjs";
import { c as readCodexNotificationItem, n as readCodexThreadContextSnapshot } from "./event-projector-usage-CnBS8Wa3.mjs";
import { o as resolveCodexSessionBinding, t as CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS } from "./session-binding-Cm0apEbd.mjs";
import { i as assertCodexSupervisionThreadLineage } from "./thread-policy-DGuQsuFC.mjs";
import { t as resumeCodexAppServerThread } from "./thread-resume-DIBXwOpE.mjs";
import { t as isSameCodexAppServerThreadOwner } from "./thread-ownership-DcTtAcXj.mjs";
import { t as persistCodexContextCompactionActivity } from "./context-compaction-activity-CMla5FPJ.mjs";
import { t as resolveCodexNativeExecutionBlock } from "./sandbox-guard-C2sRMOEY.mjs";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { coerceErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { AsyncLocalStorage } from "node:async_hooks";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { resolveAgentDir } from "openclaw/plugin-sdk/agent-runtime";
import { embeddedAgentLog, resolveCompactionTimeoutMs } from "openclaw/plugin-sdk/agent-harness-runtime";
import { createDedupeCache } from "openclaw/plugin-sdk/dedupe-runtime";
//#region extensions/codex/src/app-server/compact.ts
const warnedIgnoredCompactionOverrides = createDedupeCache({
	ttlMs: 0,
	maxSize: 4096
});
const CODEX_NATIVE_COMPACTION_INTERRUPT_GRACE_MS = 3e4;
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
		if (!requestStarted) return;
		if (!isJsonObject(notification.params)) return;
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
async function runExclusiveCodexNativeCompaction(threadId, signal, run) {
	signal?.throwIfAborted();
	let started = false;
	const queued = withCodexAppServerThreadMutation(threadId, async () => {
		started = true;
		signal?.throwIfAborted();
		return run();
	});
	if (!signal) return queued;
	let removeAbortListener = () => {};
	const aborted = new Promise((_, reject) => {
		const onAbort = () => {
			if (!started) reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("compaction aborted"));
		};
		removeAbortListener = () => signal.removeEventListener("abort", onAbort);
		signal.addEventListener("abort", onAbort, { once: true });
	});
	try {
		return await Promise.race([queued, aborted]);
	} finally {
		removeAbortListener();
	}
}
/**
* Starts native Codex compaction for a manually requested bound session, or
* reports why Codex-owned automatic compaction should handle the trigger.
*/
async function maybeCompactCodexAppServerSession(params, options) {
	warnIfIgnoringOpenClawCompactionOverrides(params);
	return compactCodexNativeThread(params, options);
}
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
async function compactCodexNativeThread(params, options) {
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
	const sandbox = params.sandbox;
	const nativeExecutionBlock = resolveCodexNativeExecutionBlock({
		config: params.config,
		sessionKey: params.sandboxSessionKey ?? params.sessionKey,
		sessionId: params.sessionId,
		agentId: params.sandboxAgentId ?? params.agentId,
		sandbox,
		surface: "native compaction"
	});
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
	const abortedResult = (expectedThreadId, currentThreadId = expectedThreadId) => options.allowNonManualNativeRequest ? skippedCodexNativeCompactionResult(params, {
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
		return abortedResult(options.bindingStore.read(bindingIdentity)?.threadId);
	}
	const { binding: initialBinding, assertCurrent } = resolvedBinding;
	if (!initialBinding?.threadId) return failedCodexThreadBindingCompactionResult(params, {
		reason: "no codex app-server thread binding",
		recovery: "missing_thread_binding"
	});
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
			agentDir: resolveAgentDir(config, bindingIdentity.agentId)
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
	const clientFactory = options.clientFactory ?? getLeasedSharedCodexAppServerClient;
	const runtimeAuthPlan = params.runtimeAuthPlan ?? params.runtimePlan?.auth;
	const usesPreparedApiKey = !usesSupervisionConnection && appServer.start.homeScope !== "user" && runtimeAuthPlan?.modelRoute?.authRequirement === "api-key";
	const preparedApiKey = usesPreparedApiKey ? params.resolvedApiKey?.trim() : void 0;
	if (usesPreparedApiKey && !preparedApiKey) return {
		ok: false,
		compacted: false,
		reason: "Prepared Codex Platform compaction route is missing its resolved API key."
	};
	try {
		return await runExclusiveCodexNativeCompaction(binding.threadId, params.abortSignal, async () => {
			assertCurrent();
			const client = await clientFactory({
				startOptions: appServer.start,
				...preparedApiKey ? { preparedAuth: {
					kind: "api-key",
					apiKey: preparedApiKey
				} } : { authProfileId: connection.clientAuthProfileId },
				agentDir: params.agentDir,
				config: params.config,
				assertCurrent
			});
			let releaseThreadSubscription;
			let retainedThreadOwnership;
			let compactionSucceeded = false;
			let compactionRequestDefinitelyRejected = false;
			let tokensAfter;
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
				signal: params.abortSignal,
				timeoutMs: options.nativeCompletionTimeoutMs ?? resolveCompactionTimeoutMs(params.config),
				interruptGraceMs: options.nativeInterruptGraceMs ?? CODEX_NATIVE_COMPACTION_INTERRUPT_GRACE_MS,
				retireUnconfirmed: async () => {
					releaseThreadSubscription = void 0;
					const transportStopped = await client.closeAndWait({
						exitTimeoutMs: 5e3,
						forceKillDelayMs: 250
					});
					if (appServer.start.transport === "stdio") {
						if (transportStopped.exited) return;
						throw new Error("failed to stop unconfirmed codex app-server process");
					}
					if (usesSupervisionConnection) throw new Error("cannot detach an unconfirmed supervised codex thread");
					if (await options.bindingStore.mutate(bindingIdentity, {
						kind: "clear",
						threadId: binding.threadId
					}, assertCurrent)) return;
					if (options.bindingStore.read(bindingIdentity)?.threadId !== binding.threadId) return;
					throw new Error("failed to detach unconfirmed codex app-server thread binding");
				}
			});
			const acquireThreadSubscription = async (timeoutMs) => {
				if (!isIncognitoSessionKey(params.sessionKey)) {
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
							assertCurrent,
							...params.abortSignal ? { signal: params.abortSignal } : {}
						});
						releaseThreadSubscription = async () => releaseCompactionThread(binding.threadId);
						assertCodexSupervisionThreadLineage(binding, resumed.thread);
					} else if (binding.connectionScope === "supervision") {
						releaseThreadSubscription = async () => retainedThreadOwnership?.release(binding.threadId);
						const { thread } = await client.request("thread/read", {
							threadId: binding.threadId,
							includeTurns: false
						}, { assertCurrent });
						assertCurrent();
						retainedThreadOwnership.assertCurrent();
						assertCodexSupervisionThreadLineage(binding, thread);
					}
					releaseThreadSubscription ??= async () => releaseCompactionThread(binding.threadId);
				}
			};
			try {
				const guardedResult = await options.bindingStore.withLease(bindingIdentity, async () => {
					const currentBinding = options.bindingStore.read(bindingIdentity);
					if (params.abortSignal?.aborted) {
						if (!options.allowNonManualNativeRequest) params.abortSignal.throwIfAborted();
						return {
							started: false,
							result: skippedCodexNativeCompactionResult(params, {
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
							sessionId: params.sessionId,
							sessionKey: params.sessionKey,
							expectedThreadId: binding.threadId,
							currentThreadId: currentBinding?.threadId
						});
						const isRequiredPreflight = options.nativeCompactionRequest === "required_preflight";
						return {
							started: false,
							result: options.allowNonManualNativeRequest && !isRequiredPreflight ? skippedCodexNativeCompactionResult(params, {
								reason: "codex app-server binding changed before native compaction",
								code: "binding_changed_before_native_compaction",
								request: options.nativeCompactionRequest ?? "after_context_engine",
								expectedThreadId: binding.threadId,
								currentThreadId: currentBinding?.threadId
							}) : failedCodexThreadBindingCompactionResult(params, {
								threadId: currentBinding?.threadId ?? binding.threadId,
								reason: "codex app-server binding changed before native compaction",
								recovery: "stale_thread_binding"
							})
						};
					}
					binding = currentBinding;
					const guardedRequestTimeoutMs = options.allowNonManualNativeRequest ? Math.min(appServer.requestTimeoutMs, CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS) : void 0;
					await acquireThreadSubscription(guardedRequestTimeoutMs);
					await clearContextEngineProjectionBeforeNativeCompaction({
						sessionId: params.sessionId,
						bindingStore: options.bindingStore,
						identity: bindingIdentity,
						binding,
						assertCurrent
					});
					assertCurrent();
					try {
						completionWatch.beginRequest();
						await client.request("thread/compact/start", { threadId: binding.threadId }, {
							...guardedRequestTimeoutMs === void 0 ? {} : { timeoutMs: guardedRequestTimeoutMs },
							assertCurrent: () => {
								try {
									assertCurrent();
								} catch (error) {
									compactionRequestDefinitelyRejected = true;
									throw error;
								}
							}
						});
						return {
							started: true,
							accepted: true
						};
					} catch (error) {
						compactionRequestDefinitelyRejected ||= isCodexAppServerPrewriteRequestCancellationError(error);
						if (compactionRequestDefinitelyRejected || error instanceof CodexAppServerRpcError) {
							completionWatch.confirmRequestRejected();
							if (!compactionRequestDefinitelyRejected) {
								await options.bindingStore.mutate(bindingIdentity, {
									kind: "set",
									binding
								}, assertCurrent);
								compactionRequestDefinitelyRejected = !isCodexThreadNotFoundError(error);
							}
						}
						return {
							started: true,
							accepted: false,
							error
						};
					}
				});
				if (!guardedResult.started) return guardedResult.result;
				if (!guardedResult.accepted) {
					if (!compactionRequestDefinitelyRejected && !(guardedResult.error instanceof CodexAppServerRpcError)) await completionWatch.retireUnconfirmedRequest(`codex app-server compaction start was unconfirmed: ${coerceErrorMessage(guardedResult.error)}`);
					throw guardedResult.error;
				}
				embeddedAgentLog.info("started codex app-server compaction", {
					sessionId: params.sessionId,
					threadId: binding.threadId
				});
				const completion = await completionWatch.completion;
				assertCurrent();
				if (!completion.completed) throw new Error(completion.reason);
				tokensAfter = completion.tokensAfter;
				if (completion.turnId && completion.itemId) await persistCodexContextCompactionActivity({
					sessionTarget: params.sessionTarget,
					config: params.config,
					cwd: params.workspaceDir,
					runId: params.runId,
					threadId: binding.threadId,
					turnId: completion.turnId,
					itemId: completion.itemId,
					timestamp: Date.now()
				});
				assertCurrent();
				embeddedAgentLog.info("completed codex app-server compaction", {
					sessionId: params.sessionId,
					threadId: binding.threadId
				});
				compactionSucceeded = true;
			} catch (error) {
				if (isCodexThreadNotFoundError(error)) return failedCodexThreadBindingCompactionResult(params, {
					threadId: binding.threadId,
					reason: coerceErrorMessage(error),
					recovery: "stale_thread_binding"
				});
				embeddedAgentLog.warn("codex app-server compaction failed", {
					sessionId: params.sessionId,
					sessionKey: params.sessionKey,
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
					if ((compactionSucceeded || compactionRequestDefinitelyRejected) && retainedThreadOwnership) {
						const ownership = retainedThreadOwnership;
						const currentBinding = options.bindingStore.read(bindingIdentity);
						if (!(isSameCodexAppServerThreadOwner(currentBinding, binding) && await options.bindingStore.withLease(bindingIdentity, async () => {
							const leasedBinding = options.bindingStore.read(bindingIdentity);
							if (!isSameCodexAppServerThreadOwner(leasedBinding, binding)) return false;
							return await retainCodexAppServerLiveThread(client, binding.threadId, ownership.release, ownership.configFingerprint, ownership.serviceTier);
						}))) await releaseThreadSubscription?.();
					} else await releaseThreadSubscription?.();
				} finally {
					if (shouldReleaseDefaultLease) releaseLeasedSharedCodexAppServerClient(client);
				}
			}
			const details = {
				backend: "codex-app-server",
				threadId: binding.threadId,
				signal: "thread/compact/start",
				pending: false,
				completed: true,
				...options.allowNonManualNativeRequest ? {
					request: options.nativeCompactionRequest ?? "after_context_engine",
					trigger: params.trigger ?? "unknown"
				} : {}
			};
			return codexNativeCompactionResult(params, {
				compacted: true,
				tokensAfter,
				details
			});
		});
	} catch (error) {
		if (params.abortSignal?.aborted) return abortedResult(initialBinding.threadId, binding.threadId);
		throw error;
	}
}
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
	}, params.assertCurrent);
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
//#endregion
export { maybeCompactCodexAppServerSession };
