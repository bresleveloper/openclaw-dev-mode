import { t as buildAgentSessionKey } from "./resolve-route-Bzb6opva.mjs";
//#region src/infra/outbound/base-session-key.ts
/** Outbound-only sends use the routing owner's session scopes and identity links. */
function buildOutboundBaseSessionKey(params) {
	return buildAgentSessionKey({
		agentId: params.agentId,
		mainKey: params.cfg.session?.mainKey,
		channel: params.channel,
		accountId: params.accountId,
		peer: params.peer,
		dmScope: params.cfg.session?.dmScope ?? "main",
		groupScope: params.cfg.session?.groupScope ?? "per-group",
		identityLinks: params.cfg.session?.identityLinks
	});
}
//#endregion
export { buildOutboundBaseSessionKey as t };
