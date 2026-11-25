import { a as resolveCodexAppServerRequestTimeoutMs } from "./config-options-ZyoXdPOW.mjs";
import { i as withTimeout$1, r as withAbortableTimeout } from "./timeout-5P9AqqoE.mjs";
import { d as CodexAppServerRpcError, f as CodexAppServerScopedRequestRejectedError, o as isCodexAppServerStartupError, s as resolveCodexStartupTimeoutMs } from "./attempt-timeouts-m7WOwoeF.mjs";
import { t as __exportAll } from "./session-binding-sidecars-DPQAWL9D.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { AgentHarnessPreflightError, embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-registration";
import { raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
import { areDiagnosticsEnabledForProcess } from "openclaw/plugin-sdk/diagnostic-runtime";
import { isNativeError } from "node:util/types";
// extensions/codex/src/app-server/request.ts
var request_exports = /* @__PURE__ */ __exportAll({
	CodexAppServerScopedRequestRejectedError: () => CodexAppServerScopedRequestRejectedError,
	readCodexAppServerUsage: () => readCodexAppServerUsage,
	requestCodexAppServerClientJson: () => requestCodexAppServerClientJson,
	requestCodexAppServerJson: () => requestCodexAppServerJson,
	withCodexAppServerJsonClient: () => withCodexAppServerJsonClient
});
const loadSandboxGuard = createLazyRuntimeModule(() => import("./sandbox-guard-Wor0ENTv.mjs").then((n) => n.a));
const loadSharedClient = createLazyRuntimeModule(() => import("./shared-client-DhJ31S_8.mjs").then((n) => n.g));
const loadSharedClientUsage = createLazyRuntimeModule(() => import("./shared-client-usage-zWnGUdYS.mjs"));
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
		const { prepareCodexAppServerDirectSandboxBypassBlock } = await loadSandboxGuard();
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
	const { prepareCodexAppServerDirectSandboxBypassBlock } = await loadSandboxGuard();
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
/** Reuses live quota notifications, falling back to an isolated read-only app-server session. */
async function readCodexAppServerUsage(options) {
	const deadline = performance.now() + options.timeoutMs;
	options.signal?.throwIfAborted();
	options.assertCurrent?.();
	const { readSharedCodexAppServerUsage } = await loadSharedClientUsage();
	const cached = await withAbortableTimeout({
		timeoutMs: options.timeoutMs,
		signal: options.signal,
		timeoutMessage: "codex app-server usage read timed out",
		promise: readSharedCodexAppServerUsage({
			...options,
			abandonSignal: options.signal
		}, options.config?.models?.usage?.cacheTtlMs ?? 6e4)
	});
	options.signal?.throwIfAborted();
	options.assertCurrent?.();
	if (cached) return cached;
	const remainingMs = deadline - performance.now();
	if (remainingMs <= 0) throw new Error("codex app-server usage read timed out");
	return await withCodexAppServerJsonClient({
		timeoutMs: remainingMs,
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
* isolated child) so related reads see the same app-server session. Shared
* startup has its own budget; the callback shares the caller's request budget.
*/
async function withCodexAppServerJsonClient(params, run) {
	const timeoutMs = params.timeoutMs ?? 6e4;
	const acquireTimeoutMs = params.isolated ? timeoutMs : resolveCodexStartupTimeoutMs({ requestTimeoutMs: resolveCodexAppServerRequestTimeoutMs(params.pluginConfig) });
	const timeoutMessage = params.timeoutMessage ?? "codex app-server request timed out";
	const startedAt = performance.now();
	const scopePhase = { current: "prepare" };
	let errorPhase;
	let deadlinePhase;
	const setPhase = (phase) => {
		scopePhase.current = phase;
		observeControl(params.controlObservation, phase);
	};
	setPhase("prepare");
	const timeoutController = new AbortController();
	const abort = () => timeoutController.abort(params.signal?.reason);
	params.signal?.addEventListener("abort", abort, { once: true });
	if (params.signal?.aborted) abort();
	let deadline = Number.isFinite(acquireTimeoutMs) && acquireTimeoutMs > 0 ? performance.now() + acquireTimeoutMs : void 0;
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
			timeoutMs: params.isolated ? timeoutMs : acquireTimeoutMs + timeoutMs,
			timeoutMessage,
			promise: (async () => {
				const { prepareCodexAppServerDirectSandboxBypassBlock } = await loadSandboxGuard();
				const { createIsolatedCodexAppServerClient, getLeasedSharedCodexAppServerClient, releaseLeasedSharedCodexAppServerClient } = await loadSharedClient();
				errorPhase = void 0;
				setPhase("prepare");
				throwIfAbandoned();
				const acquireClient = params.isolated ? createIsolatedCodexAppServerClient : getLeasedSharedCodexAppServerClient;
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
					assertCurrentAsync: params.assertCurrentAsync
				};
				setPhase("acquire-client");
				const client = await acquireClient(acquireOptions);
				let scopeActive = true;
				const assertCurrent = () => {
					throwIfAbandoned();
					if (!scopeActive) throw new CodexAppServerScopedRequestRejectedError("Codex app-server request scope is closed");
					assertRequestOwnerCurrent(params.assertCurrent);
				};
				try {
					throwIfAbandoned();
					if (!params.isolated) deadline = Number.isFinite(timeoutMs) && timeoutMs > 0 ? performance.now() + timeoutMs : void 0;
					setPhase("prepare");
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
									await params.assertDispatchCurrentAsync?.();
									write();
								}
							};
							setPhase("client-request");
							return await client.request(method, requestParams, requestOptions);
						} finally {
							sandboxGuard.release();
						}
					};
					return await withAbortableTimeout({
						timeoutMs: remainingTimeoutMs(),
						timeoutMessage,
						signal: timeoutController.signal,
						promise: run(scopedRequest, client, {
							assertCurrent,
							abort: (reason) => {
								if (scopeActive) timeoutController.abort(reason);
							}
						})
					});
				} catch (error) {
					errorPhase = scopePhase.current;
					if (isPastDeadline()) deadlinePhase = errorPhase;
					throw error;
				} finally {
					scopeActive = false;
					setPhase("release-client");
					const requestErrorPhase = errorPhase;
					const requestDeadlinePhase = deadlinePhase;
					errorPhase = scopePhase.current;
					deadlinePhase = void 0;
					if (params.isolated) await client.closeAndWait({
						exitTimeoutMs: params.isolatedShutdown?.exitTimeoutMs ?? 2e3,
						forceKillDelayMs: params.isolatedShutdown?.forceKillDelayMs ?? 250
					});
					else releaseLeasedSharedCodexAppServerClient(client);
					errorPhase = requestErrorPhase;
					deadlinePhase = requestDeadlinePhase;
				}
			})()
		});
	} catch (error) {
		const deadlineObserved = isPastDeadline();
		observeControl(params.controlObservation, deadlinePhase ?? (deadlineObserved ? scopePhase.current : errorPhase ?? scopePhase.current), {
			error,
			deadlineObserved
		});
		if (deadlineObserved) try {
			if (areDiagnosticsEnabledForProcess() && embeddedAgentLog.isEnabled("warn")) {
				const phase = deadlinePhase ?? errorPhase ?? scopePhase.current;
				embeddedAgentLog.warn("codex app-server scope timed out", {
					phase,
					timeoutMs: phase === "acquire-client" ? acquireTimeoutMs : timeoutMs,
					elapsedMs: Math.round(performance.now() - startedAt)
				});
			}
		} catch {}
		if ((errorPhase ?? scopePhase.current) === "acquire-client" && (deadlineObserved || isNativeError(error) && isCodexAppServerStartupError(error, "timed_out"))) {
			const message = "Codex app-server startup exceeded its wait budget. Retry this request; if it persists, check the Gateway logs.";
			throw new AgentHarnessPreflightError(message, {
				cause: error,
				userMessage: message,
				scope: "harness"
			});
		}
		if (deadlineObserved) throw new Error(timeoutMessage, { cause: error });
		throw error;
	} finally {
		params.signal?.removeEventListener("abort", abort);
		timeoutController.abort(createScopeCleanupError(timeoutMessage));
	}
}
export { withCodexAppServerJsonClient as a, request_exports as i, requestCodexAppServerClientJson as n, requestCodexAppServerJson as r, readCodexAppServerUsage as t };
