import { t as buildAgentSessionKey } from "./resolve-route-DvaXhzgP.mjs";
//#region src/infra/outbound/base-session-key.ts
/** Outbound-only sends use the routing owner's session scopes and identity links. */
function buildOutboundBaseSessionKey(params) {
	const { cfg, ...route } = params;
	return buildAgentSessionKey({
		...route,
		mainKey: cfg.session?.mainKey,
		dmScope: cfg.session?.dmScope ?? "main",
		groupScope: cfg.session?.groupScope ?? "per-group",
		identityLinks: cfg.session?.identityLinks
	});
}
//#endregion
export { buildOutboundBaseSessionKey as t };
