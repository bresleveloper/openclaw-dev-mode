import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as resolveAgentIdentity } from "./identity-uzCeiPuC.mjs";
import { t as resolveAgentAvatar } from "./identity-avatar-dF8y1aAa.mjs";
//#region src/infra/outbound/identity.ts
/** Resolves an agent's configured identity into channel-safe outbound metadata. */
function resolveAgentOutboundIdentity(cfg, agentId) {
	const identity = resolveAgentIdentity(cfg, agentId);
	const avatar = resolveAgentAvatar(cfg, agentId);
	const name = normalizeOptionalString(identity?.name);
	const avatarUrl = normalizeOptionalString(avatar.kind === "remote" ? avatar.url : void 0);
	const emoji = normalizeOptionalString(identity?.emoji);
	const theme = normalizeOptionalString(identity?.theme);
	if (!name && !avatarUrl && !emoji && !theme) return;
	return {
		name,
		avatarUrl,
		emoji,
		theme
	};
}
//#endregion
export { resolveAgentOutboundIdentity as t };
