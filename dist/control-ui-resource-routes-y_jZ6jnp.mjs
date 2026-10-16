import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
//#region src/gateway/control-ui-user-avatar-route.ts
const CONTROL_UI_USER_AVATAR_PATH_PREFIX = "/api/users/";
const CONTROL_UI_USER_AVATAR_PATH_SUFFIX = "/avatar";
function buildControlUiUserAvatarPath(profileId, revision, basePath) {
	const path = `${normalizeControlUiBasePath(basePath)}${CONTROL_UI_USER_AVATAR_PATH_PREFIX}${encodeURIComponent(profileId)}${CONTROL_UI_USER_AVATAR_PATH_SUFFIX}`;
	return revision === void 0 ? path : `${path}?v=${encodeURIComponent(String(revision))}`;
}
//#endregion
//#region src/gateway/control-ui-resource-routes.ts
const CONTROL_UI_ASSISTANT_MEDIA_PREFIX = "/__openclaw__/assistant-media";
function resolveAssistantMediaRoutePath(basePath) {
	return `${basePath && basePath !== "/" ? basePath.endsWith("/") ? basePath.slice(0, -1) : basePath : ""}${CONTROL_UI_ASSISTANT_MEDIA_PREFIX}`;
}
const CONTROL_UI_RESOURCE_ROUTES = {
	agentAvatar: {
		prefix: "/avatar",
		suffix: ""
	},
	catalogIcon: {
		prefix: "/__openclaw__/catalog-icon",
		suffix: ""
	},
	channelAvatar: {
		prefix: "/__openclaw__/channel-avatar",
		suffix: ""
	},
	linkFavicon: {
		prefix: "/__openclaw__/link-favicon",
		suffix: ""
	},
	pluginIcon: {
		prefix: "/__openclaw__/plugin-icon",
		suffix: ""
	},
	pluginActivityIcon: {
		prefix: "/__openclaw__/plugin-activity-icon",
		suffix: ""
	},
	pluginThemeArt: {
		prefix: "/__openclaw__/plugin-theme-art",
		suffix: ""
	},
	userAvatar: {
		prefix: CONTROL_UI_USER_AVATAR_PATH_PREFIX.slice(0, -1),
		suffix: CONTROL_UI_USER_AVATAR_PATH_SUFFIX
	},
	workspaceIcon: {
		prefix: "/__openclaw__/workspace-icon",
		suffix: ""
	}
};
/** Builds one canonical, encoded Control UI resource path. */
function buildControlUiResourcePath(route, basePath, value, segments = []) {
	const definition = CONTROL_UI_RESOURCE_ROUTES[route];
	const encoded = [value, ...segments].map(encodeURIComponent).join("/");
	return `${normalizeControlUiBasePath(basePath)}${definition.prefix}/${encoded}${definition.suffix}`;
}
/** Parses exact encoded resource components while retaining malformed-route ownership. */
function parseControlUiResourcePath(route, pathname, basePath) {
	if (!pathname) return { matched: false };
	const definition = CONTROL_UI_RESOURCE_ROUTES[route];
	const prefix = `${normalizeControlUiBasePath(basePath)}${definition.prefix}/`;
	if (!pathname.startsWith(prefix)) return { matched: false };
	const remainder = pathname.slice(prefix.length);
	if (!remainder.endsWith(definition.suffix)) return {
		matched: true,
		value: null
	};
	const parts = (definition.suffix ? remainder.slice(0, -definition.suffix.length) : remainder).split("/");
	if (parts.length !== (route === "pluginThemeArt" ? 4 : 1) || parts.some((part) => !part)) return {
		matched: true,
		value: null
	};
	try {
		const [value, ...segments] = parts.map(decodeURIComponent);
		return {
			matched: true,
			value: value || null,
			...segments.length ? { segments } : {}
		};
	} catch {
		return {
			matched: true,
			value: null
		};
	}
}
function parseControlUiUserAvatarPath(pathname, basePath) {
	const canonical = parseControlUiResourcePath("userAvatar", pathname);
	if (canonical.matched) return canonical;
	return normalizeControlUiBasePath(basePath) ? parseControlUiResourcePath("userAvatar", pathname, basePath) : canonical;
}
/** Builds the authenticated conversation-avatar URL for a session. */
function buildControlUiChannelAvatarUrl(basePath, sessionKey, revision) {
	return `${buildControlUiResourcePath("channelAvatar", basePath, sessionKey)}?v=${encodeURIComponent(revision)}`;
}
/** Matches an exact root-relative same-origin resource URL without parser reinterpretation. */
function matchControlUiResourceUrl(route, value, basePath) {
	if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return;
	try {
		const origin = "http://openclaw.invalid";
		const parsed = new URL(value, origin);
		if (parsed.origin !== origin || `${parsed.pathname}${parsed.search}${parsed.hash}` !== value) return;
		const resource = parseControlUiResourcePath(route, parsed.pathname, basePath);
		return resource.matched && resource.value ? {
			value: resource.value,
			search: parsed.search,
			hash: parsed.hash
		} : void 0;
	} catch {
		return;
	}
}
//#endregion
export { parseControlUiUserAvatarPath as a, parseControlUiResourcePath as i, buildControlUiResourcePath as n, resolveAssistantMediaRoutePath as o, matchControlUiResourceUrl as r, buildControlUiUserAvatarPath as s, buildControlUiChannelAvatarUrl as t };
