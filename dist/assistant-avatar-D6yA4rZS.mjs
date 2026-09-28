import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, S as tryResolveLegacyCompatibilityAgentId, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import "./legacy.default-agent-owner-B5Sofm47.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as AVATAR_MAX_DATA_URL_CHARS, o as isRenderableAvatarImageDataUrl } from "./avatar-limits-2506OuP3.mjs";
import { n as isAvatarDataUrl, o as isWindowsAbsolutePath, r as isAvatarHttpUrl, s as looksLikeAvatarPath, t as hasAvatarUriScheme } from "./avatar-policy-I2uW2Cs8.mjs";
import { n as resolveAgentIdentity } from "./identity-DdUdpaIE.mjs";
import { t as openLocalAgentAvatarFile } from "./identity-avatar-file-DbxXI2gj.mjs";
import { n as gatewayAvatarImageRevision, t as createGatewayAvatarDataUrlCache } from "./assistant-avatar-cache-bW5LAJaD.mjs";
import { i as loadAgentIdentityFromWorkspace } from "./identity-file-By55_88F.mjs";
import { n as buildControlUiResourcePath, r as matchControlUiResourceUrl } from "./control-ui-resource-routes-DVy_LnYu.mjs";
import "./control-ui-contract-Dup6xL62.mjs";
import fs from "node:fs";
//#region src/gateway/assistant-identity.ts
const ASSISTANT_IDENTITY_LIMITS = {
	name: 50,
	emoji: 16
};
const DEFAULT_ASSISTANT_IDENTITY = {
	name: "Assistant",
	avatar: "A"
};
function normalizeIdentityValue(field, value) {
	const trimmed = normalizeOptionalString(value);
	return trimmed ? truncateUtf16Safe(trimmed, ASSISTANT_IDENTITY_LIMITS[field]) : void 0;
}
function isAvatarUrl(value) {
	return isAvatarHttpUrl(value) || isRenderableAvatarImageDataUrl(value);
}
function normalizeAvatarValue(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed || trimmed.length > AVATAR_MAX_DATA_URL_CHARS) return;
	if (isAvatarUrl(trimmed)) return trimmed;
	if (hasAvatarUriScheme(trimmed) && !isWindowsAbsolutePath(trimmed)) return;
	if (looksLikeAvatarPath(trimmed)) return trimmed;
	if (!/\s/.test(trimmed) && trimmed.length <= 4) return trimmed;
}
function normalizeEmojiValue(value) {
	if (!value) return;
	let hasNonAscii = false;
	for (let i = 0; i < value.length; i += 1) if (value.charCodeAt(i) > 127) {
		hasNonAscii = true;
		break;
	}
	if (!hasNonAscii) return;
	if (isAvatarUrl(value) || hasAvatarUriScheme(value) && !isWindowsAbsolutePath(value) || looksLikeAvatarPath(value)) return;
	return value;
}
function resolveAssistantAgentId(cfg, agentId) {
	return normalizeAgentId(agentId ?? tryResolveLegacyCompatibilityAgentId(cfg) ?? listAgentEntries(cfg)[0]?.id ?? "main");
}
/** Resolve the display name/avatar/emoji for an agent-facing assistant identity. */
function resolveAssistantIdentity(params) {
	const agentId = resolveAssistantAgentId(params.cfg, params.agentId);
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.cfg, agentId);
	const agentIdentity = resolveAgentIdentity(params.cfg, agentId);
	const fileIdentity = workspaceDir ? loadAgentIdentityFromWorkspace(workspaceDir) : null;
	const agentName = normalizeIdentityValue("name", agentIdentity?.name);
	const fileName = normalizeIdentityValue("name", fileIdentity?.name);
	const [name, nameSource] = (agentName ? [agentName, "agent"] : fileName ? [fileName, "workspace"] : void 0) ?? [DEFAULT_ASSISTANT_IDENTITY.name, "default"];
	return {
		agentId,
		name,
		nameSource,
		avatar: [
			normalizeAvatarValue(agentIdentity?.avatar),
			normalizeAvatarValue(agentIdentity?.emoji),
			normalizeAvatarValue(fileIdentity?.avatar),
			normalizeAvatarValue(fileIdentity?.emoji)
		].find(Boolean) ?? DEFAULT_ASSISTANT_IDENTITY.avatar,
		emoji: [
			normalizeIdentityValue("emoji", agentIdentity?.emoji),
			normalizeIdentityValue("emoji", fileIdentity?.emoji),
			normalizeIdentityValue("emoji", agentIdentity?.avatar),
			normalizeIdentityValue("emoji", fileIdentity?.avatar)
		].map((candidate) => normalizeEmojiValue(candidate)).find(Boolean)
	};
}
//#endregion
//#region src/gateway/assistant-avatar.ts
const gatewayAvatarDataUrlCache = createGatewayAvatarDataUrlCache();
function gatewayAssistantAvatarUrl(projection, basePath, agentId) {
	const source = projection.openedFile ? { file: projection.openedFile } : projection.resolution?.kind === "data" ? { dataUrl: projection.resolution.url } : void 0;
	return source ? `${buildControlUiResourcePath("agentAvatar", basePath, agentId)}?v=${gatewayAvatarImageRevision(source)}` : void 0;
}
function resolveSameOriginAvatarUrl(basePath, source) {
	const unbased = matchControlUiResourceUrl("agentAvatar", source);
	if (unbased) return `${buildControlUiResourcePath("agentAvatar", basePath, unbased.value)}${unbased.search}${unbased.hash}`;
	return matchControlUiResourceUrl("agentAvatar", source, basePath) ? source : void 0;
}
/**
* Resolve and open a selected local avatar for route delivery.
* A projection with `openedFile` transfers fd ownership to the caller.
*/
function openGatewayAssistantAvatar(params) {
	const { cfg, identity } = params;
	const source = identity.avatar;
	if (isAvatarHttpUrl(source)) return { resolution: {
		kind: "remote",
		url: source,
		source
	} };
	if (isRenderableAvatarImageDataUrl(source)) return { resolution: {
		kind: "data",
		url: source,
		source
	} };
	if (isAvatarDataUrl(source)) return { resolution: {
		kind: "none",
		reason: "unsupported_data_url",
		source
	} };
	if (hasAvatarUriScheme(source) && !isWindowsAbsolutePath(source)) return { resolution: {
		kind: "none",
		reason: "unsupported_uri",
		source
	} };
	if (resolveSameOriginAvatarUrl(cfg.gateway?.controlUi?.basePath, source)) return { resolution: null };
	if (!looksLikeAvatarPath(source)) return { resolution: null };
	const opened = openLocalAgentAvatarFile({
		cfg,
		agentId: identity.agentId,
		source
	});
	if (!opened.ok) return { resolution: {
		kind: "none",
		reason: opened.reason,
		source
	} };
	return {
		resolution: {
			kind: "local",
			filePath: opened.file.path,
			source
		},
		openedFile: opened.file
	};
}
/** Resolve one selected identity avatar and its matching public metadata. */
function resolveGatewayAssistantAvatar(params) {
	const { cfg, identity } = params;
	const source = identity.avatar;
	const sameOriginAvatarUrl = resolveSameOriginAvatarUrl(params.httpBasePath ?? cfg.gateway?.controlUi?.basePath, source);
	if (sameOriginAvatarUrl) return {
		avatar: sameOriginAvatarUrl,
		resolution: null
	};
	const opened = openGatewayAssistantAvatar(params);
	if (opened.resolution?.kind === "none") return {
		avatar: identity.emoji ?? DEFAULT_ASSISTANT_IDENTITY.avatar,
		resolution: opened.resolution
	};
	if (params.httpBasePath !== void 0) {
		if (opened.openedFile) fs.closeSync(opened.openedFile.fd);
		return {
			avatar: gatewayAssistantAvatarUrl(opened, params.httpBasePath, identity.agentId) ?? source,
			resolution: opened.resolution
		};
	}
	if (!opened.openedFile) return {
		avatar: source,
		resolution: opened.resolution
	};
	const dataUrl = gatewayAvatarDataUrlCache.read(opened.openedFile);
	if (!dataUrl) return {
		avatar: identity.emoji ?? DEFAULT_ASSISTANT_IDENTITY.avatar,
		resolution: {
			kind: "none",
			reason: "unreadable",
			source
		}
	};
	return {
		avatar: dataUrl,
		resolution: opened.resolution
	};
}
//#endregion
export { resolveAssistantAgentId as a, DEFAULT_ASSISTANT_IDENTITY as i, openGatewayAssistantAvatar as n, resolveAssistantIdentity as o, resolveGatewayAssistantAvatar as r, gatewayAssistantAvatarUrl as t };
