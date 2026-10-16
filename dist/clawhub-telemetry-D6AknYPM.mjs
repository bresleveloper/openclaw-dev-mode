import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { _ as resolveClawHubAuthToken, a as isClawHubTelemetryDisabled, b as withClawHubResponse, n as createClawHubError } from "./clawhub-client-D-mEumEV.mjs";
//#region src/infra/clawhub-telemetry.ts
async function reportClawHubInstallTelemetry(params, buildEvent) {
	const token = normalizeOptionalString(params.token) ?? await resolveClawHubAuthToken();
	if (!token || isClawHubTelemetryDisabled()) return;
	const json = buildEvent();
	if (!json) return;
	await withClawHubResponse({
		baseUrl: params.baseUrl,
		path: "/api/cli/telemetry/install",
		method: "POST",
		token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		json
	}, async ({ response, url, hasToken }) => {
		if (!response.ok) throw await createClawHubError(response, url, hasToken, params.timeoutMs);
	});
}
//#endregion
export { reportClawHubInstallTelemetry as t };
