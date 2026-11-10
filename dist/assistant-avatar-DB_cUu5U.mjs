import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { E as tryResolveLegacyCompatibilityAgentId, f as resolveAgentWorkspaceDir, y as resolveMutableAgentEntry } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import "./legacy.default-agent-owner-Blrs2q29.mjs";
import { n as AVATAR_MAX_DATA_URL_CHARS, o as isRenderableAvatarImageDataUrl } from "./avatar-limits-2506OuP3.mjs";
import { c as resolveAvatarMime, n as isAvatarDataUrl, o as isWindowsAbsolutePath, r as isAvatarHttpUrl, s as looksLikeAvatarPath, t as hasAvatarUriScheme } from "./avatar-policy-DiIdI6oM.mjs";
import { n as prepareLocalAgentAvatarFile } from "./identity-avatar-file-B-RTE8eg.mjs";
import { a as loadAgentIdentityFromWorkspaceAsync } from "./identity-file-BFsBDRA6.mjs";
import { n as buildControlUiResourcePath, r as matchControlUiResourceUrl } from "./control-ui-resource-routes-B42sqIG-.mjs";
import "./control-ui-contract-IX_0OA0h.mjs";
import { n as resolveAgentIdentity } from "./identity-VQc9B4RO.mjs";
import { n as resolvePublicAgentAvatarSource } from "./identity-avatar-B5Z875Ch.mjs";
//#region src/gateway/assistant-avatar-cache.ts
const fileSources = /* @__PURE__ */ new WeakMap();
const inlineFiles = /* @__PURE__ */ new WeakMap();
const dataSources = /* @__PURE__ */ new WeakMap();
function prepareGatewayAvatarFile(file) {
	let source = fileSources.get(file);
	if (!source) {
		source = {
			file,
			revision: sha256HexPrefixCore(`thumbnail-128-png-v1:${JSON.stringify([file.path, file.stat])}`, 16)
		};
		fileSources.set(file, source);
	}
	return source;
}
function prepareGatewayAvatarDataUrl(cfg, agentId, dataUrl) {
	const owner = resolveMutableAgentEntry(cfg, agentId) ?? cfg;
	const cached = dataSources.get(owner);
	if (cached?.dataUrl === dataUrl) return cached;
	if (!isRenderableAvatarImageDataUrl(dataUrl)) {
		dataSources.delete(owner);
		return;
	}
	const source = {
		dataUrl,
		revision: sha256HexPrefixCore(`thumbnail-128-png-v1:${dataUrl}`, 16)
	};
	dataSources.set(owner, source);
	return source;
}
function gatewayAvatarFileDataUrl(file) {
	if (!file.body) return;
	let dataUrl = inlineFiles.get(file);
	if (!dataUrl) {
		dataUrl = `data:${resolveAvatarMime(file.path)};base64,${file.body.toString("base64")}`;
		inlineFiles.set(file, dataUrl);
	}
	return dataUrl;
}
//#endregion
//#region src/gateway/assistant-identity.ts
const ASSISTANT_IDENTITY_LIMITS = {
	name: 50,
	emoji: 16
};
const preparedIdentities = /* @__PURE__ */ new WeakMap();
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
	if (!value || !/\P{ASCII}/u.test(value)) return;
	if (isAvatarUrl(value) || hasAvatarUriScheme(value) && !isWindowsAbsolutePath(value) || looksLikeAvatarPath(value)) return;
	return value;
}
function resolveAssistantAgentId(cfg, agentId) {
	return normalizeAgentId(agentId ?? tryResolveLegacyCompatibilityAgentId(cfg) ?? listAgentEntries(cfg)[0]?.id ?? "main");
}
/** Resolve the display name/avatar/emoji for an agent-facing assistant identity. */
async function resolveAssistantIdentity(params) {
	const agentId = resolveAssistantAgentId(params.cfg, params.agentId);
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.cfg, agentId);
	const { name: configuredName, emoji: configuredEmoji, avatar: configuredAvatar } = resolveAgentIdentity(params.cfg, agentId) ?? {};
	const agentName = normalizeIdentityValue("name", configuredName);
	const agentAvatar = normalizeAvatarValue(configuredAvatar) ?? normalizeAvatarValue(configuredEmoji);
	const agentEmoji = normalizeEmojiValue(normalizeIdentityValue("emoji", configuredEmoji));
	const fileIdentity = workspaceDir && (!agentName || !agentAvatar || !agentEmoji) ? await loadAgentIdentityFromWorkspaceAsync(workspaceDir) : null;
	let prepared = preparedIdentities.get(params.cfg);
	if (!prepared) {
		prepared = /* @__PURE__ */ new Map();
		preparedIdentities.set(params.cfg, prepared);
	}
	const key = JSON.stringify([agentId, workspaceDir]);
	const cached = prepared.get(key);
	if (cached && cached.file === fileIdentity && cached.name === configuredName && cached.emoji === configuredEmoji && cached.avatar === configuredAvatar) {
		prepared.delete(key);
		prepared.set(key, cached);
		return cached.identity;
	}
	const fileName = normalizeIdentityValue("name", fileIdentity?.name);
	const [name, nameSource] = (agentName ? [agentName, "agent"] : fileName ? [fileName, "workspace"] : void 0) ?? [DEFAULT_ASSISTANT_IDENTITY.name, "default"];
	const avatar = [
		agentAvatar,
		normalizeAvatarValue(fileIdentity?.avatar),
		normalizeAvatarValue(fileIdentity?.emoji)
	].find(Boolean) ?? DEFAULT_ASSISTANT_IDENTITY.avatar;
	const emojiCandidates = [
		normalizeIdentityValue("emoji", fileIdentity?.emoji),
		normalizeIdentityValue("emoji", configuredAvatar),
		normalizeIdentityValue("emoji", fileIdentity?.avatar)
	];
	const identity = {
		agentId,
		name,
		nameSource,
		avatar,
		emoji: agentEmoji ?? emojiCandidates.map((candidate) => normalizeEmojiValue(candidate)).find(Boolean)
	};
	prepared.set(key, {
		file: fileIdentity,
		name: configuredName,
		emoji: configuredEmoji,
		avatar: configuredAvatar,
		identity
	});
	pruneMapToMaxSize(prepared, 4);
	return identity;
}
//#endregion
//#region src/gateway/assistant-avatar.ts
function controlUiAvatarResolutionMeta(resolved) {
	if (!resolved) return {
		avatarSource: null,
		avatarStatus: null,
		avatarReason: null
	};
	return {
		avatarSource: resolvePublicAgentAvatarSource(resolved) ?? null,
		avatarStatus: resolved.kind,
		avatarReason: resolved.kind === "none" ? resolved.reason : null
	};
}
function gatewayAssistantAvatarUrl(projection, basePath, agentId) {
	return projection.image ? `${buildControlUiResourcePath("agentAvatar", basePath, agentId)}?v=${projection.image.revision}` : void 0;
}
function resolveSameOriginAvatarUrl(basePath, source) {
	const unbased = matchControlUiResourceUrl("agentAvatar", source);
	if (unbased) return `${buildControlUiResourcePath("agentAvatar", basePath, unbased.value)}${unbased.search}${unbased.hash}`;
	return matchControlUiResourceUrl("agentAvatar", source, basePath) ? source : void 0;
}
/** Prepare a selected source; the file owner retains descriptor custody in its worker. */
async function prepareGatewayAssistantAvatar(params) {
	const { cfg, identity } = params;
	const source = identity.avatar;
	const image = prepareGatewayAvatarDataUrl(cfg, identity.agentId, source);
	if (isAvatarHttpUrl(source)) return { resolution: {
		kind: "remote",
		url: source,
		source
	} };
	if (isAvatarDataUrl(source)) return image ? {
		resolution: {
			kind: "data",
			url: source,
			source
		},
		image
	} : { resolution: {
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
	const prepared = await prepareLocalAgentAvatarFile({
		cfg,
		agentId: identity.agentId,
		source,
		readBody: params.readBody
	});
	if (!prepared.ok) return { resolution: {
		kind: "none",
		reason: prepared.reason,
		source
	} };
	return {
		resolution: {
			kind: "local",
			filePath: prepared.file.path,
			source
		},
		file: prepared.file,
		image: prepareGatewayAvatarFile(prepared.file)
	};
}
/** Resolve one selected identity avatar and its matching public metadata. */
async function resolveGatewayAssistantAvatar(params) {
	const { cfg, identity } = params;
	const source = identity.avatar;
	const sameOriginAvatarUrl = resolveSameOriginAvatarUrl(params.httpBasePath ?? cfg.gateway?.controlUi?.basePath, source);
	if (sameOriginAvatarUrl) return {
		avatar: sameOriginAvatarUrl,
		resolution: null
	};
	const prepared = await prepareGatewayAssistantAvatar({
		...params,
		readBody: params.httpBasePath === void 0
	});
	if (prepared.resolution?.kind === "none") return {
		avatar: identity.emoji ?? DEFAULT_ASSISTANT_IDENTITY.avatar,
		resolution: prepared.resolution
	};
	if (params.httpBasePath !== void 0) return {
		avatar: gatewayAssistantAvatarUrl(prepared, params.httpBasePath, identity.agentId) ?? source,
		resolution: prepared.resolution
	};
	if (!prepared.file) return {
		avatar: source,
		resolution: prepared.resolution
	};
	const dataUrl = gatewayAvatarFileDataUrl(prepared.file);
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
		resolution: prepared.resolution
	};
}
//#endregion
export { DEFAULT_ASSISTANT_IDENTITY as a, resolveGatewayAssistantAvatar as i, gatewayAssistantAvatarUrl as n, resolveAssistantAgentId as o, prepareGatewayAssistantAvatar as r, resolveAssistantIdentity as s, controlUiAvatarResolutionMeta as t };
