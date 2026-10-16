import { F as resolveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-umfRGZ-E.mjs";
import "./http-body-CgfQBa7S.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-DmewLLH7.mjs";
import { o as providerUsageLabel } from "./provider-usage.shared-B2Q7uCr7.mjs";
//#region src/infra/provider-usage.fetch.shared.ts
/** Fetches JSON-compatible provider usage endpoints with an abort timeout. */
async function fetchJson(url, init, timeoutMs, fetchFn) {
	const safeTimeoutMs = resolveTimerTimeoutMs(timeoutMs, 1);
	const timeoutSignal = AbortSignal.timeout(safeTimeoutMs);
	const signal = init.signal ? AbortSignal.any([init.signal, timeoutSignal]) : timeoutSignal;
	return await fetchFn(url, {
		...init,
		signal
	});
}
/** Builds a provider usage snapshot for non-HTTP fetch or parse failures. */
function buildUsageErrorSnapshot(provider, error) {
	return {
		provider,
		displayName: providerUsageLabel(provider) ?? provider,
		windows: [],
		error
	};
}
function buildUsageHttpErrorSnapshot(options) {
	if ((options.tokenExpiredStatuses ?? []).includes(options.status)) return buildUsageErrorSnapshot(options.provider, "Token expired");
	const suffix = options.message?.trim() ? `: ${options.message.trim()}` : "";
	return buildUsageErrorSnapshot(options.provider, `HTTP ${options.status}${suffix}`);
}
async function readUsageJson(provider, response, malformedResponseError = "Malformed usage response") {
	try {
		return {
			ok: true,
			data: await readProviderJsonResponse(response, `${provider} usage`)
		};
	} catch {
		return {
			ok: false,
			snapshot: buildUsageErrorSnapshot(provider, malformedResponseError)
		};
	}
}
async function fetchUsageJson(options) {
	const response = await fetchJson(options.url, options.init, options.timeoutMs, options.fetchFn);
	if (!response.ok) {
		await cancelUnreadResponseBody(response);
		return {
			ok: false,
			snapshot: buildUsageHttpErrorSnapshot({
				provider: options.provider,
				status: response.status,
				tokenExpiredStatuses: options.tokenExpiredStatuses
			})
		};
	}
	return await readUsageJson(options.provider, response, options.malformedResponseError);
}
//#endregion
export { readUsageJson as a, fetchUsageJson as i, buildUsageHttpErrorSnapshot as n, fetchJson as r, buildUsageErrorSnapshot as t };
