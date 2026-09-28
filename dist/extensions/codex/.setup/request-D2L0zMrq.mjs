import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { i as withTimeout, o as CodexAppServerRpcError, r as withAbortableTimeout } from "./timeout-C910MdAB.mjs";
//#region extensions/codex/src/app-server/request.ts
var request_exports = /* @__PURE__ */ __exportAll({
	CodexAppServerScopedRequestRejectedError: () => CodexAppServerScopedRequestRejectedError,
	readCodexAppServerUsage: () => readCodexAppServerUsage,
	requestCodexAppServerClientJson: () => requestCodexAppServerClientJson,
	requestCodexAppServerJson: () => requestCodexAppServerJson,
	withCodexAppServerJsonClient: () => withCodexAppServerJsonClient
});
function observeControlPhase(observation, phase) {
	try {
		observation?.phase(phase);
	} catch {}
}
function observeControlFailure(observation, phase, error, deadlineObserved = false) {
	if (!observation) return;
	try {
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
	observeControlPhase(params.controlObservation, phase);
	try {
		const { resolveCodexAppServerDirectSandboxBypassBlock } = await import("./sandbox-guard-C2sRMOEY.mjs").then((n) => n.r);
		const sandboxBlock = resolveCodexAppServerDirectSandboxBypassBlock({
			method: params.method,
			requestParams: params.requestParams,
			config: params.config,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId
		});
		if (sandboxBlock) throw new Error(sandboxBlock);
		const timeoutMs = params.timeoutMs ?? 6e4;
		const method = params.method;
		const requestParams = params.requestParams;
		const attemptWaiterFinished = method === "thread/list" ? params.controlObservation?.attemptWaiterFinished : void 0;
		const options = {
			timeoutMs,
			signal: params.signal,
			...attemptWaiterFinished ? { attemptWaiterFinished } : {},
			...params.assertCurrent ? { assertCurrent: () => assertRequestOwnerCurrent(params.assertCurrent) } : {}
		};
		phase = "client-request";
		observeControlPhase(params.controlObservation, phase);
		return await withTimeout(params.client.request(method, requestParams, options), timeoutMs, `codex app-server ${params.method} timed out`);
	} catch (error) {
		observeControlFailure(params.controlObservation, phase, error);
		throw error;
	}
}
async function requestCodexAppServerJson(params) {
	observeControlPhase(params.controlObservation, "prepare");
	const { resolveCodexAppServerDirectSandboxBypassBlock } = await import("./sandbox-guard-C2sRMOEY.mjs").then((n) => n.r);
	const sandboxBlock = resolveCodexAppServerDirectSandboxBypassBlock({
		method: params.method,
		requestParams: params.requestParams,
		config: params.config,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId
	});
	if (sandboxBlock) throw new Error(sandboxBlock);
	return await withCodexAppServerJsonClient({
		...params,
		timeoutMessage: `codex app-server ${params.method} timed out`
	}, async (request) => await request({
		method: params.method,
		requestParams: params.requestParams
	}));
}
/** A scoped guard rejected the request before a physical write. */
var CodexAppServerScopedRequestRejectedError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "CodexAppServerScopedRequestRejectedError";
	}
};
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
	let timer;
	const timeout = new Promise((resolve) => {
		timer = setTimeout(() => resolve(void 0), boundMs);
		timer.unref?.();
	});
	try {
		return await Promise.race([read, timeout]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
/**
* Runs several guarded requests over one acquired client (shared lease or
* isolated child) so related reads see the same app-server session. The whole
* callback re-runs once when the client's start selection changed underneath it.
*/
async function withCodexAppServerJsonClient(params, run) {
	const timeoutMs = params.timeoutMs ?? 6e4;
	const timeoutMessage = params.timeoutMessage ?? "codex app-server request timed out";
	let activePhase = "prepare";
	let errorPhase;
	observeControlPhase(params.controlObservation, activePhase);
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
				const { resolveCodexAppServerDirectSandboxBypassBlock } = await import("./sandbox-guard-C2sRMOEY.mjs").then((n) => n.r);
				const { createIsolatedCodexAppServerClient, getLeasedSharedCodexAppServerClient, isCodexAppServerStartSelectionChangedError, releaseLeasedSharedCodexAppServerClient, retireSharedCodexAppServerClientIfCurrent } = await import("./shared-client-DA4VR4Eb.mjs").then((n) => n.y);
				for (let attempt = 0; attempt < 2; attempt += 1) {
					errorPhase = void 0;
					activePhase = "prepare";
					observeControlPhase(params.controlObservation, activePhase);
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
						assertCurrent: params.assertCurrent
					};
					activePhase = "acquire-client";
					observeControlPhase(params.controlObservation, activePhase);
					const client = await acquireClient(acquireOptions);
					let scopeActive = true;
					const assertCurrent = () => {
						throwIfAbandoned();
						if (!scopeActive) throw new CodexAppServerScopedRequestRejectedError("Codex app-server request scope is closed");
						assertRequestOwnerCurrent(params.assertCurrent);
					};
					try {
						activePhase = "prepare";
						observeControlPhase(params.controlObservation, activePhase);
						assertCurrent();
						const scopedRequest = async (request) => {
							activePhase = "prepare";
							observeControlPhase(params.controlObservation, activePhase);
							const sandboxBlock = resolveCodexAppServerDirectSandboxBypassBlock({
								method: request.method,
								requestParams: request.requestParams,
								config: params.config,
								sessionKey: params.sessionKey,
								sessionId: params.sessionId
							});
							if (sandboxBlock) throw new CodexAppServerScopedRequestRejectedError(sandboxBlock);
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
								}
							};
							activePhase = "client-request";
							observeControlPhase(params.controlObservation, activePhase);
							return await client.request(method, requestParams, requestOptions);
						};
						return await run(scopedRequest, client, {
							assertCurrent,
							abort: (reason) => {
								if (scopeActive) timeoutController.abort(reason);
							}
						});
					} catch (error) {
						errorPhase = activePhase;
						if (!isCodexAppServerStartSelectionChangedError(error) || attempt > 0) throw error;
						errorPhase = void 0;
						try {
							if (!params.isolated) {
								activePhase = "release-client";
								observeControlPhase(params.controlObservation, activePhase);
								retireSharedCodexAppServerClientIfCurrent(client);
							}
							activePhase = "prepare";
							observeControlPhase(params.controlObservation, activePhase);
							throwIfAbandoned();
						} catch (retryError) {
							errorPhase = activePhase;
							throw retryError;
						}
					} finally {
						scopeActive = false;
						activePhase = "release-client";
						observeControlPhase(params.controlObservation, activePhase);
						const requestErrorPhase = errorPhase;
						errorPhase = activePhase;
						if (params.isolated) await client.closeAndWait({
							exitTimeoutMs: params.isolatedShutdown?.exitTimeoutMs ?? 2e3,
							forceKillDelayMs: params.isolatedShutdown?.forceKillDelayMs ?? 250
						});
						else releaseLeasedSharedCodexAppServerClient(client);
						errorPhase = requestErrorPhase;
					}
				}
				throw new Error("Codex app-server selection retry loop exited unexpectedly");
			})()
		});
	} catch (error) {
		const deadlineObserved = isPastDeadline();
		observeControlFailure(params.controlObservation, deadlineObserved ? activePhase : errorPhase ?? activePhase, error, deadlineObserved);
		if (deadlineObserved) throw new Error(timeoutMessage, { cause: error });
		throw error;
	} finally {
		params.signal?.removeEventListener("abort", abort);
		timeoutController.abort(createScopeCleanupError(timeoutMessage));
	}
}
//#endregion
export { request_exports as a, requestCodexAppServerJson as i, readCodexAppServerUsage as n, withCodexAppServerJsonClient as o, requestCodexAppServerClientJson as r, CodexAppServerScopedRequestRejectedError as t };
