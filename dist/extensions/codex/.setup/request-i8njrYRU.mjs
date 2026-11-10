import { i as CodexAppServerScopedRequestRejectedError, r as CodexAppServerRpcError } from "./rpc-error-CrpIS8O9.mjs";
import { t as CODEX_CONTROL_METHODS } from "./capabilities-Cul-h11D.mjs";
import { i as withTimeout$1, r as withAbortableTimeout } from "./timeout-D0mEWSGG.mjs";
import { t as __exportAll } from "./session-binding-sidecars-D0c8mmZ9.mjs";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-registration";
import { raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
import { areDiagnosticsEnabledForProcess } from "openclaw/plugin-sdk/diagnostic-runtime";
//#region extensions/codex/src/app-server/request-diagnostics.ts
const DIAGNOSTIC_METHODS = /* @__PURE__ */ new Set([
	...Object.values(CODEX_CONTROL_METHODS),
	"model/list",
	"thread/start",
	"plugin/installed",
	"plugin/read",
	"config/read",
	"config/value/write",
	"config/batchWrite",
	"configRequirements/read",
	"experimentalFeature/list"
]);
const MAX_METHODS = 8;
/** Counts awaited APIs, not native execution or proof that a request was written. */
function createCodexRequestTimeoutDiagnostics(timeoutMs) {
	if (!areDiagnosticsEnabledForProcess() || !embeddedAgentLog.isEnabled("warn")) return;
	const startedAt = performance.now();
	let attempt = createAttempt(0);
	function createAttempt(ordinal) {
		return {
			ordinal,
			phase: "prepare",
			started: 0,
			methods: /* @__PURE__ */ new Map()
		};
	}
	return {
		beginAttempt(ordinal) {
			attempt = createAttempt(ordinal);
			attempt.phase = "acquire-client";
			const current = attempt;
			return {
				onAcquireObservation(observation) {
					if (attempt !== current || current.phase !== "acquire-client") return;
					if (observation.boundary === "cleanup") {
						if (current.acquireLastObservedBoundary !== "cleanup") {
							current.acquireBoundaryBeforeCleanup = current.acquireLastObservedBoundary;
							const snapshot = current.initializeSnapshot?.();
							current.initializeBeforeCleanup = snapshot?.clientClosed ? current.initializeSnapshot?.(true) : snapshot;
							current.initializeBeforeCleanupSource = current.initializeBeforeCleanup ? snapshot?.clientClosed ? "before-client-close" : "at-cleanup" : void 0;
						}
					} else {
						current.acquireBoundaryBeforeCleanup = void 0;
						current.initializeBeforeCleanup = void 0;
						current.initializeBeforeCleanupSource = void 0;
					}
					current.acquireLastObservedBoundary = observation.boundary;
					if (observation.startup) current.acquireStartup = observation.startup;
				},
				onStartedClient(client) {
					if (attempt !== current || current.phase !== "acquire-client") return;
					current.initializeBeforeCleanup = void 0;
					current.initializeBeforeCleanupSource = void 0;
					current.lastStartedClientInstanceId = client.getInstanceId();
					current.initializeSnapshot = (beforeClose) => client.getInitializeDiagnostic(beforeClose);
					const identity = client.getRegisteredTransportIdentity();
					current.lastStartedTransportIdentity = identity;
				}
			};
		},
		acquired(client) {
			attempt.phase = "callback";
			attempt.clientInstanceId = client.getInstanceId();
		},
		request(method) {
			const current = attempt;
			const label = DIAGNOSTIC_METHODS.has(method) ? method : "other";
			current.started++;
			current.methods.set(label, (current.methods.get(label) ?? 0) + 1);
			return () => {
				const remaining = (current.methods.get(label) ?? 1) - 1;
				if (remaining === 0) current.methods.delete(label);
				else current.methods.set(label, remaining);
			};
		},
		release() {
			attempt.phase = "release-client";
		},
		timeout() {
			try {
				if (!areDiagnosticsEnabledForProcess() || !embeddedAgentLog.isEnabled("warn")) return;
				const methods = [...attempt.methods].toSorted(([a], [b]) => a.localeCompare(b));
				const pending = methods.reduce((count, [, active]) => count + active, 0);
				const initialize = attempt.initializeSnapshot?.();
				embeddedAgentLog.warn("codex app-server scope timed out", {
					phase: attempt.phase === "callback" && pending > 0 ? "client-request" : attempt.phase,
					timeoutMs,
					elapsedMs: Math.round(performance.now() - startedAt),
					scopeAttemptOrdinal: attempt.ordinal,
					...attempt.acquireLastObservedBoundary ? { acquireLastObservedBoundary: attempt.acquireLastObservedBoundary } : {},
					...attempt.acquireStartup ? { acquireStartup: attempt.acquireStartup } : {},
					...attempt.acquireBoundaryBeforeCleanup ? { acquireBoundaryBeforeCleanup: attempt.acquireBoundaryBeforeCleanup } : {},
					...attempt.lastStartedClientInstanceId ? {
						lastStartedClientInstanceId: attempt.lastStartedClientInstanceId,
						lastStartedTransportIdentity: attempt.lastStartedTransportIdentity ? JSON.stringify(attempt.lastStartedTransportIdentity) : "unavailable"
					} : {},
					...attempt.clientInstanceId ? { clientInstanceId: attempt.clientInstanceId } : {},
					...initialize ? { initializeSnapshot: JSON.stringify(initialize) } : {},
					...attempt.initializeBeforeCleanup ? {
						initializeBeforeCleanup: JSON.stringify(attempt.initializeBeforeCleanup),
						initializeBeforeCleanupSource: attempt.initializeBeforeCleanupSource
					} : {},
					requestStartedCount: attempt.started,
					currentRequestCount: pending,
					currentMethods: JSON.stringify(methods.slice(0, MAX_METHODS)),
					omittedMethodCount: Math.max(0, methods.length - MAX_METHODS)
				});
			} catch {}
		}
	};
}
//#endregion
//#region extensions/codex/src/app-server/request.ts
var request_exports = /* @__PURE__ */ __exportAll({
	readCodexAppServerUsage: () => readCodexAppServerUsage,
	requestCodexAppServerClientJson: () => requestCodexAppServerClientJson,
	requestCodexAppServerJson: () => requestCodexAppServerJson,
	withCodexAppServerJsonClient: () => withCodexAppServerJsonClient
});
function observeControl(observation, phase, failure) {
	if (!observation) return;
	try {
		if (!failure) {
			observation.phase(phase);
			return;
		}
		const { error, deadlineObserved } = failure;
		const category = deadlineObserved ? "deadline-observed" : error instanceof CodexAppServerScopedRequestRejectedError ? "scoped-rejection" : error instanceof CodexAppServerRpcError ? error.code === -32601 ? "rpc-method-unavailable" : "rpc-error" : "other";
		observation.failed({
			phase,
			category
		});
	} catch {}
}
/** Sends one guarded request over a client lease owned by the caller. */
async function requestCodexAppServerClientJson(params) {
	let phase = "prepare";
	observeControl(params.controlObservation, phase);
	try {
		const { prepareCodexAppServerDirectSandboxBypassBlock } = await import("./sandbox-guard-CM3mdNZp.mjs").then((n) => n.a);
		const sandboxGuard = await prepareCodexAppServerDirectSandboxBypassBlock(params);
		try {
			if (sandboxGuard.block) throw new Error(sandboxGuard.block);
			const timeoutMs = params.timeoutMs ?? 6e4;
			const method = params.method;
			const requestParams = params.requestParams;
			const attemptWaiterFinished = method === "thread/list" ? params.controlObservation?.attemptWaiterFinished : void 0;
			const options = {
				timeoutMs,
				signal: params.signal,
				withCurrent: async (write) => {
					await params.assertCurrentAsync?.();
					await sandboxGuard.assertCurrent();
					if (params.withCurrent) await params.withCurrent(write);
					else write();
				},
				assertCurrent: () => {
					params.assertCurrent?.();
				},
				...attemptWaiterFinished ? { attemptWaiterFinished } : {}
			};
			phase = "client-request";
			observeControl(params.controlObservation, phase);
			return await withTimeout$1(params.client.request(method, requestParams, options), timeoutMs, `codex app-server ${params.method} timed out`);
		} finally {
			sandboxGuard.release();
		}
	} catch (error) {
		observeControl(params.controlObservation, phase, { error });
		throw error;
	}
}
async function requestCodexAppServerJson(params) {
	observeControl(params.controlObservation, "prepare");
	const { prepareCodexAppServerDirectSandboxBypassBlock } = await import("./sandbox-guard-CM3mdNZp.mjs").then((n) => n.a);
	const sandboxGuard = await prepareCodexAppServerDirectSandboxBypassBlock(params);
	try {
		if (sandboxGuard.block) throw new Error(sandboxGuard.block);
		return await withCodexAppServerJsonClient({
			...params,
			timeoutMessage: `codex app-server ${params.method} timed out`
		}, async (request) => await request({
			method: params.method,
			requestParams: params.requestParams
		}));
	} finally {
		sandboxGuard.release();
	}
}
function createScopeCleanupError(message) {
	const stackTraceLimit = Error.stackTraceLimit;
	try {
		Error.stackTraceLimit = 0;
		return new CodexAppServerScopedRequestRejectedError(message);
	} finally {
		Error.stackTraceLimit = stackTraceLimit;
	}
}
function assertRequestOwnerCurrent(assertCurrent) {
	try {
		assertCurrent?.();
	} catch (cause) {
		throw new CodexAppServerScopedRequestRejectedError(cause instanceof Error ? cause.message : String(cause), { cause });
	}
}
const CODEX_USAGE_ISOLATED_SHUTDOWN = {
	forceKillDelayMs: 200,
	exitTimeoutMs: 300
};
const CODEX_ACCOUNT_READ_MAX_TIMEOUT_MS = 4e3;
const CODEX_USAGE_DEADLINE_RESERVE_MS = CODEX_USAGE_ISOLATED_SHUTDOWN.forceKillDelayMs + CODEX_USAGE_ISOLATED_SHUTDOWN.exitTimeoutMs + 250;
/** Reads rate limits and best-effort account identity from one isolated app-server session. */
async function readCodexAppServerUsage(options) {
	const deadline = performance.now() + options.timeoutMs;
	return await withCodexAppServerJsonClient({
		timeoutMs: options.timeoutMs,
		signal: options.signal,
		timeoutMessage: "codex app-server usage read timed out",
		agentDir: options.agentDir,
		...options.authProfileId ? { authProfileId: options.authProfileId } : {},
		config: options.config,
		startOptions: options.startOptions,
		preparedAuth: options.preparedAuth,
		authRequirement: options.authRequirement,
		assertCurrent: options.assertCurrent,
		isolated: true,
		isolatedShutdown: CODEX_USAGE_ISOLATED_SHUTDOWN
	}, async (request) => {
		const rateLimits = await request({ method: "account/rateLimits/read" });
		const accountEmail = await readCodexAccountEmailBestEffort(request, deadline);
		return {
			rateLimits,
			...accountEmail ? { accountEmail } : {}
		};
	});
}
async function readCodexAccountEmailBestEffort(request, deadline) {
	const boundMs = Math.min(CODEX_ACCOUNT_READ_MAX_TIMEOUT_MS, deadline - performance.now() - CODEX_USAGE_DEADLINE_RESERVE_MS);
	if (boundMs <= 0) return;
	const read = request({
		method: "account/read",
		requestParams: {}
	}).then(({ account }) => account?.type === "chatgpt" ? account.email?.trim() || void 0 : void 0, () => void 0);
	return await raceWithTimeout(read, boundMs, () => void 0, { ref: false });
}
/**
* Runs several guarded requests over one acquired client (shared lease or
* isolated child) so related reads see the same app-server session. The whole
* callback re-runs once when the client's start selection changed underneath it.
*/
async function withCodexAppServerJsonClient(params, run) {
	const timeoutMs = params.timeoutMs ?? 6e4;
	const timeoutMessage = params.timeoutMessage ?? "codex app-server request timed out";
	const timeoutDiagnostics = createCodexRequestTimeoutDiagnostics(timeoutMs);
	let activePhase = "prepare";
	let errorPhase;
	const setPhase = (phase) => {
		activePhase = phase;
		observeControl(params.controlObservation, phase);
	};
	setPhase("prepare");
	const timeoutController = new AbortController();
	const abort = () => timeoutController.abort(params.signal?.reason);
	params.signal?.addEventListener("abort", abort, { once: true });
	if (params.signal?.aborted) abort();
	const deadline = Number.isFinite(timeoutMs) && timeoutMs > 0 ? performance.now() + timeoutMs : void 0;
	const isPastDeadline = () => deadline !== void 0 && performance.now() >= deadline;
	const throwIfAbandoned = () => {
		if (timeoutController.signal.aborted && timeoutController.signal.reason instanceof Error) throw timeoutController.signal.reason;
		if (timeoutController.signal.aborted || isPastDeadline()) throw new CodexAppServerScopedRequestRejectedError(timeoutMessage);
	};
	const remainingTimeoutMs = () => {
		throwIfAbandoned();
		return deadline === void 0 ? timeoutMs : Math.max(1, deadline - performance.now());
	};
	try {
		throwIfAbandoned();
		return await withAbortableTimeout({
			signal: timeoutController.signal,
			timeoutMs,
			timeoutMessage,
			promise: (async () => {
				const { prepareCodexAppServerDirectSandboxBypassBlock } = await import("./sandbox-guard-CM3mdNZp.mjs").then((n) => n.a);
				const { createIsolatedCodexAppServerClient, getLeasedSharedCodexAppServerClient, releaseLeasedSharedCodexAppServerClient } = await import("./shared-client-BEHXwqz5.mjs").then((n) => n.h);
				errorPhase = void 0;
				setPhase("prepare");
				throwIfAbandoned();
				const acquireClient = params.isolated ? createIsolatedCodexAppServerClient : getLeasedSharedCodexAppServerClient;
				const acquireObservation = timeoutDiagnostics?.beginAttempt(1);
				const acquireOptions = {
					startOptions: params.startOptions,
					pluginConfig: params.pluginConfig,
					timeoutMs: remainingTimeoutMs(),
					authProfileId: params.authProfileId,
					authProfileStore: params.authProfileStore,
					authBindingFingerprint: params.authBindingFingerprint,
					preparedAuth: params.preparedAuth,
					authRequirement: params.authRequirement,
					agentDir: params.agentDir,
					config: params.config,
					abandonSignal: timeoutController.signal,
					assertCurrent: params.assertCurrent,
					assertCurrentAsync: params.assertCurrentAsync,
					...acquireObservation
				};
				setPhase("acquire-client");
				const client = await acquireClient(acquireOptions);
				timeoutDiagnostics?.acquired(client);
				let scopeActive = true;
				const assertCurrent = () => {
					throwIfAbandoned();
					if (!scopeActive) throw new CodexAppServerScopedRequestRejectedError("Codex app-server request scope is closed");
					assertRequestOwnerCurrent(params.assertCurrent);
				};
				try {
					setPhase("prepare");
					assertCurrent();
					const scopedRequest = async (request) => {
						setPhase("prepare");
						const sandboxGuard = await prepareCodexAppServerDirectSandboxBypassBlock({
							method: request.method,
							requestParams: request.requestParams,
							config: params.config,
							sessionKey: params.sessionKey,
							sessionId: params.sessionId,
							agentId: params.agentId,
							storePath: params.storePath
						});
						try {
							if (sandboxGuard.block) throw new CodexAppServerScopedRequestRejectedError(sandboxGuard.block);
							assertCurrent();
							const method = request.method;
							const requestParams = request.requestParams;
							const attemptWaiterFinished = method === "thread/list" ? params.controlObservation?.attemptWaiterFinished : void 0;
							const requestOptions = {
								timeoutMs: remainingTimeoutMs(),
								signal: timeoutController.signal,
								...attemptWaiterFinished ? { attemptWaiterFinished } : {},
								...params.catalogPreview ? {
									catalogPreview: true,
									catalogPreviewCache: params.catalogPreviewCache,
									catalogRows: params.catalogRows
								} : {},
								assertCurrent: () => {
									assertCurrent();
									request.assertCurrent?.();
								},
								withCurrent: async (write) => {
									await params.assertCurrentAsync?.();
									await request.assertCurrentAsync?.();
									await sandboxGuard.assertCurrent();
									assertCurrent();
									request.assertCurrent?.();
									write();
								}
							};
							setPhase("client-request");
							const settled = timeoutDiagnostics?.request(method);
							try {
								return await client.request(method, requestParams, requestOptions);
							} finally {
								settled?.();
							}
						} finally {
							sandboxGuard.release();
						}
					};
					return await run(scopedRequest, client, {
						assertCurrent,
						abort: (reason) => {
							if (scopeActive) timeoutController.abort(reason);
						}
					});
				} catch (error) {
					errorPhase = activePhase;
					throw error;
				} finally {
					scopeActive = false;
					setPhase("release-client");
					timeoutDiagnostics?.release();
					const requestErrorPhase = errorPhase;
					errorPhase = activePhase;
					if (params.isolated) await client.closeAndWait({
						exitTimeoutMs: params.isolatedShutdown?.exitTimeoutMs ?? 2e3,
						forceKillDelayMs: params.isolatedShutdown?.forceKillDelayMs ?? 250
					});
					else releaseLeasedSharedCodexAppServerClient(client);
					errorPhase = requestErrorPhase;
				}
			})()
		});
	} catch (error) {
		const deadlineObserved = isPastDeadline();
		observeControl(params.controlObservation, deadlineObserved ? activePhase : errorPhase ?? activePhase, {
			error,
			deadlineObserved
		});
		if (deadlineObserved) {
			timeoutDiagnostics?.timeout();
			throw new Error(timeoutMessage, { cause: error });
		}
		throw error;
	} finally {
		params.signal?.removeEventListener("abort", abort);
		timeoutController.abort(createScopeCleanupError(timeoutMessage));
	}
}
//#endregion
export { withCodexAppServerJsonClient as a, request_exports as i, requestCodexAppServerClientJson as n, requestCodexAppServerJson as r, readCodexAppServerUsage as t };
