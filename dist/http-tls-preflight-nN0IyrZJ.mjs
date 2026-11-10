import { F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { n as asNullableObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-B70cE6fn.mjs";
import { inspectTlsCertificateError } from "@openclaw/ai/internal/shared";
//#region src/infra/http-tls-preflight.ts
/** Probe reachability without following redirects or consuming the response body. */
async function runHttpTlsPreflight(url, options = {}) {
	const timeoutMs = resolveTimerTimeoutMs(options.timeoutMs, 5e3);
	const fetchImpl = options.fetchImpl ?? fetch;
	options.signal?.throwIfAborted();
	options.assertCurrent?.();
	let response;
	try {
		response = await fetchImpl(url, {
			method: "GET",
			redirect: "manual",
			signal: options.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(timeoutMs)]) : AbortSignal.timeout(timeoutMs)
		});
		return { ok: true };
	} catch (error) {
		options.signal?.throwIfAborted();
		options.assertCurrent?.();
		const tlsFailure = inspectTlsCertificateError(error);
		if (tlsFailure) return {
			ok: false,
			kind: "tls-cert",
			code: tlsFailure.code,
			message: tlsFailure.message
		};
		const root = asNullableObjectRecord(error);
		const cause = asNullableObjectRecord(root?.cause);
		return {
			ok: false,
			kind: "network",
			code: typeof cause?.code === "string" ? cause.code : void 0,
			message: typeof cause?.message === "string" ? cause.message : typeof root?.message === "string" ? root.message : String(error)
		};
	} finally {
		await cancelUnreadResponseBody(response);
	}
}
//#endregion
export { runHttpTlsPreflight as t };
