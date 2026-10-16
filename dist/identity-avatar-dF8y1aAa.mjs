import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { n as isAvatarDataUrl, o as isWindowsAbsolutePath, r as isAvatarHttpUrl, t as hasAvatarUriScheme } from "./avatar-policy-DiIdI6oM.mjs";
import { a as resolveLocalAgentAvatarPath } from "./identity-avatar-file-CzAdV6tU.mjs";
import { i as loadAgentIdentityFromWorkspace } from "./identity-file-DQ9_U4uO.mjs";
import { n as resolveAgentIdentity } from "./identity-uzCeiPuC.mjs";
import path from "node:path";
//#region src/agents/identity-avatar.ts
/**
* Resolves public avatar sources for configured agent identities.
*/
const PUBLIC_AVATAR_SOURCE_MAX_CHARS = 256;
const PUBLIC_DATA_AVATAR_HEADER_MAX_CHARS = 64;
function resolveAvatarSource(cfg, agentId) {
	const normalizedAgentId = normalizeAgentId(agentId);
	const fromConfig = normalizeOptionalString(resolveAgentIdentity(cfg, normalizedAgentId)?.avatar) ?? null;
	if (fromConfig) return fromConfig;
	const workspace = resolveAgentWorkspaceDir(cfg, normalizedAgentId);
	return normalizeOptionalString(loadAgentIdentityFromWorkspace(workspace)?.avatar) ?? null;
}
function isSafeRelativeAvatarSource(source) {
	if (source.length > PUBLIC_AVATAR_SOURCE_MAX_CHARS || source.startsWith("~") || path.isAbsolute(source) || isWindowsAbsolutePath(source) || hasAvatarUriScheme(source) || source.includes("\0")) return false;
	return source.replace(/\\/g, "/").split("/").every((part) => part !== "..");
}
/** Return a safe public description of the configured avatar source. */
function resolvePublicAgentAvatarSource(resolved) {
	const source = normalizeOptionalString(resolved.source) ?? null;
	if (!source) return;
	if (isAvatarDataUrl(source)) {
		const commaIndex = source.indexOf(",");
		return `${commaIndex > 0 ? source.slice(0, Math.min(commaIndex, PUBLIC_DATA_AVATAR_HEADER_MAX_CHARS)) : source.slice(0, PUBLIC_DATA_AVATAR_HEADER_MAX_CHARS)},...`;
	}
	if (isAvatarHttpUrl(source)) return "remote URL";
	return isSafeRelativeAvatarSource(source) ? source : void 0;
}
/** Resolve the effective avatar for an agent, including config and IDENTITY.md. */
function resolveAgentAvatar(cfg, agentId) {
	const source = resolveAvatarSource(cfg, agentId);
	if (!source) return {
		kind: "none",
		reason: "missing"
	};
	if (isAvatarHttpUrl(source)) return {
		kind: "remote",
		url: source,
		source
	};
	if (isAvatarDataUrl(source)) return {
		kind: "data",
		url: source,
		source
	};
	const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
	const resolved = resolveLocalAgentAvatarPath({
		raw: source,
		workspaceDir
	});
	if (!resolved.ok) return {
		kind: "none",
		reason: resolved.reason,
		source
	};
	return {
		kind: "local",
		filePath: resolved.value.filePath,
		source
	};
}
//#endregion
export { resolvePublicAgentAvatarSource as n, resolveAgentAvatar as t };
