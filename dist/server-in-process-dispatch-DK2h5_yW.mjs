import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as createAbortError, o as racePromiseWithAbortSignal, s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { R as registerDiagnosticToolExecutionDeadline } from "./diagnostic-events-C91J-XX8.mjs";
import { c as resolveSafeTimeoutDelayMs } from "./timeouts-ClVlVfGz.mjs";
import { i as retainGatewayResponsePayload, n as GatewayProtocolRequestTimeoutError } from "./protocol-request-BMUN1re6.mjs";
import { t as GatewayClientRequestError } from "./request-error-CnPCYq3A.mjs";
import { n as bindInProcessRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-in-process-dispatch.ts
function unwrapGatewayMethodDispatchResponse(method, response) {
	if (!response.ok) {
		const requestError = new GatewayClientRequestError({
			code: response.error?.code,
			message: response.error?.message ?? `Gateway method "${method}" failed.`,
			details: response.error?.details,
			retryable: response.error?.retryable,
			retryAfterMs: response.error?.retryAfterMs
		});
		retainGatewayResponsePayload(requestError, response.payload);
		const cause = response.error?.cause;
		if (cause !== void 0) Object.defineProperty(requestError, "cause", { value: cause });
		throw requestError;
	}
	return response.payload;
}
function resolveDispatchDeadline(timeoutMs) {
	if (typeof timeoutMs !== "number" || !Number.isFinite(timeoutMs)) return;
	const safeTimeoutMs = resolveSafeTimeoutDelayMs(timeoutMs);
	return {
		diagnosticDeadlineMs: Date.now() + safeTimeoutMs,
		monotonicDeadlineMs: performance.now() + safeTimeoutMs
	};
}
function resolveDispatchAbortError(method, signal) {
	return signal.reason instanceof Error ? signal.reason : createAbortError(`gateway request aborted for ${method}`, { cause: signal.reason });
}
/** Reject before a cancelled in-process request can invoke method work. */
function throwIfGatewayDispatchAborted(method, signal) {
	if (signal?.aborted) throw resolveDispatchAbortError(method, signal);
}
async function waitForDispatch(method, promise, deadline, signal, onSignalAbort, onTimeout, requestTimeoutMs) {
	let releaseDeadline;
	try {
		const remainingTimeoutMs = deadline === void 0 ? void 0 : resolveSafeTimeoutDelayMs(deadline.monotonicDeadlineMs - performance.now(), { minMs: 0 });
		if (remainingTimeoutMs === void 0 && !signal) return await promise;
		releaseDeadline = deadline === void 0 ? void 0 : registerDiagnosticToolExecutionDeadline(deadline.diagnosticDeadlineMs);
		const abortError = (aborted) => resolveDispatchAbortError(method, aborted);
		return await (remainingTimeoutMs === void 0 || signal?.aborted ? racePromiseWithAbortSignal(promise, signal, abortError) : raceWithTimeout(promise, remainingTimeoutMs, () => {
			onTimeout?.();
			throw new GatewayProtocolRequestTimeoutError({
				method,
				timeoutMs: requestTimeoutMs ?? remainingTimeoutMs,
				requestSent: true
			}, `gateway request timeout for ${method}`);
		}, {
			signal,
			onAbort: (aborted) => {
				throw abortError(aborted);
			}
		}));
	} catch (error) {
		if (signal?.aborted && onSignalAbort) await Promise.resolve().then(onSignalAbort).catch(() => {});
		throw error;
	} finally {
		releaseDeadline?.();
	}
}
/** Applies the same non-cancelling deadline used by in-process Gateway dispatch. */
async function waitForGatewayDispatch(method, promise, timeoutMs, signal, onSignalAbort, onTimeout) {
	return await waitForDispatch(method, promise, resolveDispatchDeadline(timeoutMs), signal, onSignalAbort, onTimeout, timeoutMs);
}
/** Dispatches one request through the ordinary Gateway router without opening a transport. */
async function dispatchGatewayRequestInProcessRaw(method, params, options) {
	throwIfGatewayDispatchAborted(method, options.signal);
	let firstResponse;
	let finalResponse;
	const first = createDeferredCore();
	let final = null;
	let postFirstResponseError;
	const deadline = resolveDispatchDeadline(options.timeoutMs);
	const req = {
		type: "req",
		id: `${options.requestIdPrefix ?? "in-process"}-${randomUUID()}`,
		method,
		params
	};
	const entry = options.context.requestEntryLifetime?.enter({
		req,
		client: options.client,
		context: options.context
	});
	try {
		const { handleGatewayRequest } = await import("./server-methods-Ccl2iWnl.mjs");
		entry?.assertOpen();
		const execution = options.context.trackExecution(() => handleGatewayRequest(bindInProcessRequestMutationAuthority({
			req,
			requestEntry: entry,
			client: options.client,
			isWebchatConnect: options.isWebchatConnect ?? (() => false),
			respond: (ok, payload, error, meta) => {
				const response = {
					ok,
					payload,
					error,
					...meta ? { meta } : {}
				};
				if (!firstResponse) {
					firstResponse = response;
					first.resolve(response);
					return;
				}
				if (!finalResponse) {
					finalResponse = response;
					final?.resolve(response);
				}
			},
			context: options.context,
			methodRegistry: options.methodRegistry,
			prepareDispatchCurrent: options.prepareDispatchCurrent,
			sessionMutationCommitGuard: options.sessionMutationCommitGuard,
			...options.hasCurrentClientAuthority ? { hasCurrentClientAuthority: options.hasCurrentClientAuthority } : {},
			...options.signal ? { signal: options.signal } : {}
		}, options.assertCreatedInputSourceCurrent, options.assertPreparationCurrent, options.questionCallerRead)).then(() => {
			if (!firstResponse) first.reject(/* @__PURE__ */ new Error(`Gateway method "${method}" completed without a response.`));
		}).finally(() => entry?.release())).catch((err) => {
			const error = err instanceof Error ? err : new Error(String(err));
			if (!firstResponse) {
				first.reject(error);
				return;
			}
			postFirstResponseError = error;
			final?.reject(error);
		});
		options.onExecution?.(execution);
	} catch (error) {
		entry?.release();
		throw error;
	}
	const waitForResponse = (response) => waitForDispatch(method, response, deadline, options.signal, options.onSignalAbort, void 0, options.timeoutMs);
	firstResponse = await waitForResponse(first.promise);
	const firstPayload = firstResponse.payload;
	if (!firstResponse.ok || options.expectFinal !== true || firstPayload?.status !== "accepted") return firstResponse;
	options.onAccepted?.(firstResponse.payload);
	if (postFirstResponseError) throw postFirstResponseError;
	if (finalResponse) return finalResponse;
	final = createDeferredCore();
	return await waitForResponse(final.promise);
}
async function dispatchGatewayRequestInProcess(method, params, options) {
	return unwrapGatewayMethodDispatchResponse(method, await dispatchGatewayRequestInProcessRaw(method, params, options));
}
//#endregion
export { waitForGatewayDispatch as a, unwrapGatewayMethodDispatchResponse as i, dispatchGatewayRequestInProcessRaw as n, throwIfGatewayDispatchAborted as r, dispatchGatewayRequestInProcess as t };
