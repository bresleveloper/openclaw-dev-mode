import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as createAbortError } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { R as registerDiagnosticToolExecutionDeadline } from "./diagnostic-events-BADdmgZf.mjs";
import { c as resolveSafeTimeoutDelayMs } from "./timeouts-Th9Axx4o.mjs";
import { i as retainGatewayResponsePayload, n as GatewayProtocolRequestTimeoutError } from "./protocol-request-BMUN1re6.mjs";
import { t as GatewayClientRequestError } from "./request-error-Clu0Uyey.mjs";
import { t as bindCreatedInputMutationAuthority } from "./session-mutation-guards-CxCbIrod.mjs";
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
function resolveDispatchDeadlineMs(timeoutMs) {
	if (typeof timeoutMs !== "number" || !Number.isFinite(timeoutMs)) return;
	return Date.now() + resolveSafeTimeoutDelayMs(timeoutMs);
}
function resolveRemainingDispatchTimeoutMs(deadlineMs) {
	return deadlineMs === void 0 ? void 0 : resolveSafeTimeoutDelayMs(deadlineMs - Date.now(), { minMs: 0 });
}
function resolveDispatchAbortError(method, signal) {
	return signal.reason instanceof Error ? signal.reason : createAbortError(`gateway request aborted for ${method}`, { cause: signal.reason });
}
/** Reject before a cancelled in-process request can invoke method work. */
function throwIfGatewayDispatchAborted(method, signal) {
	if (signal?.aborted) throw resolveDispatchAbortError(method, signal);
}
async function waitForDispatch(method, promise, deadlineMs, signal, onSignalAbort, onTimeout, requestTimeoutMs) {
	let timeout;
	let onAbort;
	let releaseDeadline;
	try {
		if (signal?.aborted) throw resolveDispatchAbortError(method, signal);
		const remainingTimeoutMs = resolveRemainingDispatchTimeoutMs(deadlineMs);
		if (remainingTimeoutMs === void 0 && !signal) return await promise;
		releaseDeadline = deadlineMs === void 0 ? void 0 : registerDiagnosticToolExecutionDeadline(deadlineMs);
		const cancellation = new Promise((_resolve, reject) => {
			if (remainingTimeoutMs !== void 0) timeout = setTimeout(() => {
				onTimeout?.();
				reject(new GatewayProtocolRequestTimeoutError({
					method,
					timeoutMs: requestTimeoutMs ?? remainingTimeoutMs,
					requestSent: true
				}, `gateway request timeout for ${method}`));
			}, remainingTimeoutMs);
			if (signal) {
				onAbort = () => reject(resolveDispatchAbortError(method, signal));
				signal.addEventListener("abort", onAbort, { once: true });
				if (signal.aborted) onAbort();
			}
		});
		return await Promise.race([promise, cancellation]);
	} catch (error) {
		if (signal?.aborted && onSignalAbort) await Promise.resolve().then(onSignalAbort).catch(() => {});
		throw error;
	} finally {
		releaseDeadline?.();
		if (timeout) clearTimeout(timeout);
		if (signal && onAbort) signal.removeEventListener("abort", onAbort);
	}
}
/** Applies the same non-cancelling deadline used by in-process Gateway dispatch. */
async function waitForGatewayDispatch(method, promise, timeoutMs, signal, onSignalAbort, onTimeout) {
	return await waitForDispatch(method, promise, resolveDispatchDeadlineMs(timeoutMs), signal, onSignalAbort, onTimeout, timeoutMs);
}
/** Dispatches one request through the ordinary Gateway router without opening a transport. */
async function dispatchGatewayRequestInProcessRaw(method, params, options) {
	throwIfGatewayDispatchAborted(method, options.signal);
	let firstResponse;
	let finalResponse;
	const first = createDeferredCore();
	let final = null;
	let postFirstResponseError;
	const deadlineMs = resolveDispatchDeadlineMs(options.timeoutMs);
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
		const { handleGatewayRequest } = await import("./server-methods-Brtp6VFQ.mjs");
		entry?.assertOpen();
		const execution = options.context.trackExecution(() => handleGatewayRequest(bindCreatedInputMutationAuthority({
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
		}, options.assertCreatedInputSourceCurrent)).then(() => {
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
	firstResponse = await waitForDispatch(method, first.promise, deadlineMs, options.signal, options.onSignalAbort, void 0, options.timeoutMs);
	const firstPayload = firstResponse.payload;
	if (!firstResponse.ok || options.expectFinal !== true || firstPayload?.status !== "accepted") return firstResponse;
	options.onAccepted?.(firstResponse.payload);
	if (postFirstResponseError) throw postFirstResponseError;
	if (finalResponse) return finalResponse;
	final = createDeferredCore();
	return await waitForDispatch(method, final.promise, deadlineMs, options.signal, options.onSignalAbort, void 0, options.timeoutMs);
}
async function dispatchGatewayRequestInProcess(method, params, options) {
	return unwrapGatewayMethodDispatchResponse(method, await dispatchGatewayRequestInProcessRaw(method, params, options));
}
//#endregion
export { waitForGatewayDispatch as a, unwrapGatewayMethodDispatchResponse as i, dispatchGatewayRequestInProcessRaw as n, throwIfGatewayDispatchAborted as r, dispatchGatewayRequestInProcess as t };
