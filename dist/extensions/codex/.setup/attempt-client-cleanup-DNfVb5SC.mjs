import { w as retireSharedCodexAppServerClientIfCurrent } from "./auth-cache-key-SXYawyhG.mjs";
import { a as codexPrewriteRejectionCause, o as isCodexAppServerOverloadError, r as CodexAppServerRpcError } from "./rpc-error-hmWM21RB.mjs";
import { Y as unsubscribeCodexAppServerLiveThread, pt as isCodexAppServerStartupError, u as isCodexAppServerStartSelectionChangedError } from "./shared-client-r9NcV_GJ.mjs";
import { V as isCodexAppServerBrokenPipeError, c as isCodexAppServerRequestTimeoutError } from "./client-BM1XpAkE.mjs";
import { n as getCodexAppServerTurnRouter } from "./turn-router-DLqce1id.mjs";
import { t as __exportAll } from "./session-binding-sidecars-BrdV95Fg.mjs";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { AgentHarnessPreflightError, embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-runtime";
//#region extensions/codex/src/app-server/attempt-client-cleanup.ts
var attempt_client_cleanup_exports = /* @__PURE__ */ __exportAll({
	CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS: () => CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS,
	CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS: () => CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS,
	CodexAppServerUnsafeSubscriptionError: () => CodexAppServerUnsafeSubscriptionError,
	assertCodexThreadResumeSubscription: () => assertCodexThreadResumeSubscription,
	closeCodexStartupClientBestEffort: () => closeCodexStartupClientBestEffort,
	interruptCodexTurnAndWaitBestEffort: () => interruptCodexTurnAndWaitBestEffort,
	isCodexNoActiveTurnInterruptError: () => isCodexNoActiveTurnInterruptError,
	retireUnsafeCodexTurnClientBestEffort: () => retireUnsafeCodexTurnClientBestEffort,
	shouldRetireCodexStartupClient: () => shouldRetireCodexStartupClient,
	terminateCodexBackgroundTerminals: () => terminateCodexBackgroundTerminals,
	unsubscribeCodexThreadBestEffort: () => unsubscribeCodexThreadBestEffort
});
const CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS = 5e3;
const CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS = 5e3;
const CODEX_NO_ACTIVE_TURN_ERROR_CODE = -32600;
const CODEX_NO_ACTIVE_TURN_ERROR_MESSAGE = "no active turn to interrupt";
/** Codex also reports this before an accepted turn publishes its start event. */
function isCodexNoActiveTurnInterruptError(error) {
	return error instanceof CodexAppServerRpcError && error.code === CODEX_NO_ACTIVE_TURN_ERROR_CODE && error.message === CODEX_NO_ACTIVE_TURN_ERROR_MESSAGE;
}
/** Raised when a thread subscription may be live on a client OpenClaw no longer controls. */
var CodexAppServerUnsafeSubscriptionError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "CodexAppServerUnsafeSubscriptionError";
	}
};
function assertCodexThreadResumeSubscription(requestedThreadId, returnedThreadId) {
	if (returnedThreadId !== requestedThreadId) throw new CodexAppServerUnsafeSubscriptionError(`Codex thread/resume returned ${returnedThreadId} for ${requestedThreadId}`);
}
async function closeCodexStartupClientBestEffort(client) {
	if (!client) return;
	const retiredSharedClient = retireSharedCodexAppServerClientIfCurrent(client);
	if (!retiredSharedClient || retiredSharedClient.closed) await client.closeAndWait();
}
/** Retires an unsafe turn client without replacing an already-authoritative failure. */
async function retireUnsafeCodexTurnClientBestEffort(client, operation) {
	try {
		await closeCodexStartupClientBestEffort(client);
	} catch (error) {
		embeddedAgentLog.debug("codex app-server unsafe turn client retirement failed", {
			operation,
			error
		});
		try {
			client.close();
		} catch (closeError) {
			embeddedAgentLog.debug("codex app-server unsafe turn client close failed", {
				operation,
				error: closeError
			});
		}
	}
}
/** Sends a bounded turn interrupt and waits for Codex to confirm terminal abort handling. */
async function interruptCodexTurnAndWaitBestEffort(client, params) {
	const timeoutMs = params.timeoutMs && Number.isFinite(params.timeoutMs) && params.timeoutMs > 0 ? params.timeoutMs : CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS;
	const requestParams = {
		threadId: params.threadId,
		turnId: params.turnId
	};
	let cancelWatch;
	try {
		if (!params.turnId) {
			await client.request("turn/interrupt", requestParams, { timeoutMs });
			return true;
		}
		const deadline = performance.now() + timeoutMs;
		const started = createDeferred();
		const completion = getCodexAppServerTurnRouter(client).watchNativeTurnCompletion({
			threadId: params.threadId,
			turnId: params.turnId,
			timeoutMs,
			onStarted: () => started.resolve(true)
		});
		cancelWatch = completion.cancel;
		if (completion.state !== "pending") return await completion.completion;
		const requestInterrupt = async () => {
			try {
				await client.request("turn/interrupt", requestParams, {
					timeoutMs: Math.max(1, deadline - performance.now()),
					signal: completion.settledSignal
				});
				return true;
			} catch (error) {
				if (completion.state === "confirmed") return true;
				if (isCodexNoActiveTurnInterruptError(error)) return false;
				throw error;
			}
		};
		if (!await requestInterrupt()) {
			if (await Promise.race([completion.completion.then(() => false), started.promise]) && completion.state === "pending" && performance.now() < deadline) await requestInterrupt();
		}
		return await completion.completion;
	} catch (error) {
		embeddedAgentLog.debug("codex app-server turn interrupt failed during abort", { error });
		return false;
	} finally {
		cancelWatch?.();
	}
}
/** Stops native terminals on the cancelled thread without retiring peer threads. */
async function terminateCodexBackgroundTerminals(client, threadId, oneShotCliRun = false, waitForNativeItems) {
	const options = {
		timeoutMs: CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS,
		signal: AbortSignal.timeout(CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS)
	};
	try {
		const { data } = await client.request("thread/backgroundTerminals/list", { threadId }, options);
		for (const { processId } of data) await client.request("thread/backgroundTerminals/terminate", {
			threadId,
			processId
		}, options);
		if (data.length > 0) {
			if ((await client.request("thread/backgroundTerminals/list", {
				threadId,
				limit: 1
			}, options)).data.length > 0) throw new Error("native background terminals remain running");
			if (oneShotCliRun) throw new Error("native terminal termination did not confirm process cleanup");
		}
		await waitForNativeItems?.(options.signal);
	} catch (cause) {
		throw new Error("Codex background-terminal cleanup failed; inspect the thread's running terminals before starting more work.", { cause });
	}
}
async function unsubscribeCodexThreadBestEffort(client, params) {
	try {
		await unsubscribeCodexAppServerLiveThread(client, params.threadId, params.timeoutMs, params.assertCurrent, params.withCurrent);
		return true;
	} catch (error) {
		params.assertCurrent?.();
		embeddedAgentLog.debug("codex app-server thread unsubscribe cleanup failed", {
			threadId: params.threadId,
			error
		});
		return false;
	}
}
function shouldRetireCodexStartupClient(error, spawnedBy, signal) {
	const cause = codexPrewriteRejectionCause(error);
	if (signal.aborted || isCodexAppServerStartupError(cause) || isCodexAppServerRequestTimeoutError(cause)) return true;
	return !isCodexAppServerStartSelectionChangedError(cause) && !isCodexAppServerOverloadError(cause) && !(cause instanceof AgentHarnessPreflightError && cause.scope === void 0) && (isCodexAppServerBrokenPipeError(cause) || !spawnedBy);
}
//#endregion
export { attempt_client_cleanup_exports as a, isCodexNoActiveTurnInterruptError as c, terminateCodexBackgroundTerminals as d, unsubscribeCodexThreadBestEffort as f, assertCodexThreadResumeSubscription as i, retireUnsafeCodexTurnClientBestEffort as l, CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS as n, closeCodexStartupClientBestEffort as o, CodexAppServerUnsafeSubscriptionError as r, interruptCodexTurnAndWaitBestEffort as s, CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS as t, shouldRetireCodexStartupClient as u };
