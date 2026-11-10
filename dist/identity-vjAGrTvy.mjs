import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as resolveAgentIdentity } from "./identity-VQc9B4RO.mjs";
import { t as resolveAgentAvatar } from "./identity-avatar-B5Z875Ch.mjs";
//#region src/infra/outbound/identity.ts
/** Resolves an agent's configured identity into channel-safe outbound metadata. */
function resolveAgentOutboundIdentity(cfg, agentId) {
	const identity = resolveAgentIdentity(cfg, agentId);
	const avatar = resolveAgentAvatar(cfg, agentId);
	const name = normalizeOptionalString(identity?.name);
	const avatarUrl = normalizeOptionalString(avatar.kind === "remote" ? avatar.url : void 0);
	const emoji = normalizeOptionalString(identity?.emoji);
	const theme = normalizeOptionalString(identity?.theme);
	return name || avatarUrl || emoji || theme ? {
		name,
		avatarUrl,
		emoji,
		theme
	} : void 0;
}
//#endregion
export { resolveAgentOutboundIdentity as t };
