import { r as normalizeControlUiBasePath } from "./grammar-Dp605oVy.mjs";
import { i as buildControlUiSessionPath } from "./src-Da9425In.mjs";
import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.mjs";
//#region src/config/control-ui-link-base.ts
function resolveControlUiLinkLocation(cfg) {
	if (cfg?.gateway?.controlUi?.enabled === false) return;
	const origin = resolveGatewayPublicOrigin(cfg);
	if (!origin) return;
	return {
		origin,
		basePath: normalizeControlUiBasePath(cfg?.gateway?.controlUi?.basePath)
	};
}
function resolveControlUiSessionLinkBase(cfg) {
	const location = resolveControlUiLinkLocation(cfg);
	if (!location) return;
	const sessionLinkBase = `${location.origin}${location.basePath}`;
	return sessionLinkBase.length <= 200 ? sessionLinkBase : void 0;
}
function resolveControlUiAutomationRunUrl(cfg, params) {
	const location = resolveControlUiLinkLocation(cfg);
	if (!location) return;
	const query = new URLSearchParams({ job: params.jobId });
	if (params.runId) query.set("run", params.runId);
	return `${location.origin}${location.basePath}/automations?${query}`;
}
function resolveControlUiSessionUrl(cfg, params) {
	const location = resolveControlUiLinkLocation(cfg);
	if (!location) return;
	const path = buildControlUiSessionPath({
		namespace: "chat",
		sessionKey: params.sessionKey ?? "",
		fallbackAgentId: params.fallbackAgentId,
		basePath: location.basePath,
		exactKey: params.exactKey
	});
	if (!path) return;
	const url = new URL(location.origin);
	url.pathname = path;
	return url.toString();
}
//#endregion
export { resolveControlUiSessionUrl as i, resolveControlUiLinkLocation as n, resolveControlUiSessionLinkBase as r, resolveControlUiAutomationRunUrl as t };
