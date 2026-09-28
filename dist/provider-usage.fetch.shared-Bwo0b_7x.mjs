import { F as resolveTimerTimeoutMs, y as parseDateStringTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { o as providerUsageLabel } from "./provider-usage.shared-DA20vxhR.mjs";
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
/** Parses a provider reset-time string without leaking an invalid Date timestamp. */
function parseUsageResetAt(value) {
	return parseDateStringTimestampMs(value);
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
export { parseUsageResetAt as a, fetchUsageJson as i, buildUsageHttpErrorSnapshot as n, readUsageJson as o, fetchJson as r, buildUsageErrorSnapshot as t };
