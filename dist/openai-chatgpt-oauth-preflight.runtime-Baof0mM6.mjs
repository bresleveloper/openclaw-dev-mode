import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import "./number-runtime-CGwowceO.mjs";
import { t as inspectTlsCertificateError } from "./provider-http-Dn9NddwC.mjs";
//#region extensions/openai/openai-chatgpt-oauth-preflight.runtime.ts
const OPENAI_AUTH_PROBE_URL = "https://auth.openai.com/oauth/authorize?response_type=code&client_id=openclaw-preflight&redirect_uri=http%3A%2F%2Flocalhost%3A1455%2Fauth%2Fcallback&scope=openid+profile+email";
function getErrorRecord(error) {
	return error && typeof error === "object" ? error : null;
}
function extractFailure(error) {
	const tlsFailure = inspectTlsCertificateError(error);
	if (tlsFailure) return {
		code: tlsFailure.code,
		message: tlsFailure.message,
		kind: "tls-cert"
	};
	const root = getErrorRecord(error);
	const rootCause = getErrorRecord(root?.cause);
	return {
		code: typeof rootCause?.code === "string" ? rootCause.code : void 0,
		message: typeof rootCause?.message === "string" ? rootCause.message : typeof root?.message === "string" ? root.message : String(error),
		kind: "network"
	};
}
async function runOpenAIOAuthTlsPreflight(options) {
	const timeoutMs = resolveTimerTimeoutMs(options?.timeoutMs, 5e3);
	const fetchImpl = options?.fetchImpl ?? fetch;
	options?.signal?.throwIfAborted();
	options?.assertCurrent?.();
	let response;
	try {
		response = await fetchImpl(OPENAI_AUTH_PROBE_URL, {
			method: "GET",
			redirect: "manual",
			signal: options?.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(timeoutMs)]) : AbortSignal.timeout(timeoutMs)
		});
		return { ok: true };
	} catch (error) {
		options?.signal?.throwIfAborted();
		options?.assertCurrent?.();
		const failure = extractFailure(error);
		return {
			ok: false,
			kind: failure.kind,
			code: failure.code,
			message: failure.message
		};
	} finally {
		if (response?.bodyUsed !== true) await response?.body?.cancel().catch(() => void 0);
	}
}
//#endregion
export { runOpenAIOAuthTlsPreflight as t };
