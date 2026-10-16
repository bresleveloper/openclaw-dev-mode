import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { D as resolveExpiresAtMsFromDurationMs, d as asPositiveSafeInteger, g as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import "./version-CwNT1gaY.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { r as invalidateGatewayPolicyClient } from "./ws-policy-close-BgtfQbi3.mjs";
import { isDeepStrictEqual } from "node:util";
import { randomBytes } from "node:crypto";
//#region src/gateway/plugin-node-capability.ts
/** Path marker used to scope plugin-hosted node URLs with one-time capabilities. */
const PLUGIN_NODE_CAPABILITY_PATH_PREFIX = "/__openclaw__/cap";
const PLUGIN_NODE_CAPABILITY_QUERY_PARAM = "oc_cap";
const DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS = 6e5;
/** Prepare credentials before publication; the returned commit only swaps owned records. */
function prepareClientPluginNodeCapabilities(params) {
	const client = {
		invalidated: params.client.invalidated,
		pluginSurfaceBaseUrl: params.client.pluginSurfaceBaseUrl,
		pluginSurfaceUrls: { ...params.client.pluginSurfaceUrls },
		pluginNodeCapabilities: { ...params.client.pluginNodeCapabilities }
	};
	const surfaces = indexPluginNodeCapabilitySurfaces(params.surfaces.filter((surface) => !params.allowedSurfaces || params.allowedSurfaces.has(surface.surface)));
	const previousSurfaces = params.client.pluginNodeCapabilitySurfaces ?? {};
	for (const [id, previous] of Object.entries(previousSurfaces)) {
		const next = surfaces[id];
		if (!next || next.scopeKey !== previous.scopeKey || [...params.changedPluginIds].some((pluginId) => previous.scopeKey?.startsWith(`${pluginId}:`))) {
			const key = resolvePluginNodeCapabilityStorageKey(previous);
			if (key) delete client.pluginNodeCapabilities?.[key];
			delete client.pluginSurfaceUrls?.[id];
		}
	}
	client.pluginNodeCapabilitySurfaces = surfaces;
	for (const surface of Object.values(surfaces)) {
		if (client.invalidated || !client.pluginSurfaceBaseUrl || client.pluginSurfaceUrls?.[surface.surface]) continue;
		const capability = mintPluginNodeCapabilityToken();
		const expiresAtMs = resolvePluginNodeCapabilityExpiresAtMs(surface);
		const url = buildPluginNodeCapabilityScopedHostUrl(client.pluginSurfaceBaseUrl, capability);
		if (expiresAtMs === void 0 || !url) continue;
		(client.pluginSurfaceUrls ??= {})[surface.surface] = url;
		setClientPluginNodeCapability({
			client,
			surface,
			capability,
			expiresAtMs
		});
	}
	return () => {
		params.client.pluginNodeCapabilitySurfaces = client.pluginNodeCapabilitySurfaces;
		params.client.pluginNodeCapabilities = client.pluginNodeCapabilities;
		params.client.pluginSurfaceUrls = client.pluginSurfaceUrls;
	};
}
/** Index surfaces by normalized surface id, keeping the strictest TTL per surface. */
function indexPluginNodeCapabilitySurfaces(surfaces) {
	const indexed = {};
	for (const entry of surfaces) {
		const surface = normalizeOptionalString(entry.surface);
		if (!surface) continue;
		const existing = indexed[surface];
		const next = {
			...entry,
			surface
		};
		if (!existing || resolvePluginNodeCapabilityTtlMs(next) < resolvePluginNodeCapabilityTtlMs(existing)) indexed[surface] = next;
	}
	return indexed;
}
/** Reconnect changed nodes so the handshake owns newly scoped URLs and capabilities. */
function reconcileClientPluginNodeCapabilities(client, surfaces, close) {
	if (client.connect.role !== "node" || (client.connect.maxProtocol < 4 ? isDeepStrictEqual(client.pluginNodeCapabilitySurfaces ?? {}, surfaces) : [...client.connect.caps ?? [], ...Object.keys(client.pluginSurfaceUrls ?? {})].every((surface) => isDeepStrictEqual(client.pluginNodeCapabilitySurfaces?.[surface], surfaces[surface])))) return true;
	invalidateGatewayPolicyClient(client, {
		reason: "plugin-node-capabilities-changed",
		code: 1012,
		message: "node capabilities changed",
		close
	});
	return false;
}
function resolvePluginNodeCapabilityStorageKey(surface) {
	const normalizedSurface = normalizeOptionalString(surface.surface);
	if (!normalizedSurface) return;
	const scopeKey = surface.scopeKey?.trim();
	return scopeKey ? `${normalizedSurface}\0${scopeKey}` : normalizedSurface;
}
function resolvePluginNodeCapabilityTtlMs(surface) {
	return asPositiveSafeInteger(surface.ttlMs) ?? 6e5;
}
function resolvePluginNodeCapabilityExpiresAtMs(surface, nowMs = Date.now()) {
	return resolveExpiresAtMsFromDurationMs(resolvePluginNodeCapabilityTtlMs(surface), { nowMs });
}
function mintPluginNodeCapabilityToken() {
	return randomBytes(18).toString("base64url");
}
function buildPluginNodeCapabilityScopedHostUrl(baseUrl, capability) {
	const normalizedCapability = normalizeOptionalString(capability);
	if (!normalizedCapability) return;
	try {
		const url = new URL(baseUrl);
		url.pathname = `${url.pathname.replace(/\/+$/, "")}${`${PLUGIN_NODE_CAPABILITY_PATH_PREFIX}/${encodeURIComponent(normalizedCapability)}`}`;
		url.search = "";
		url.hash = "";
		return url.toString().replace(/\/$/, "");
	} catch {
		return;
	}
}
function replacePluginNodeCapabilityInScopedHostUrl(scopedUrl, capability) {
	const normalizedCapability = normalizeOptionalString(capability);
	if (!normalizedCapability) return;
	try {
		const url = new URL(scopedUrl);
		const prefix = `${PLUGIN_NODE_CAPABILITY_PATH_PREFIX}/`;
		const markerStart = url.pathname.indexOf(prefix);
		if (markerStart < 0) return buildPluginNodeCapabilityScopedHostUrl(scopedUrl, normalizedCapability);
		const capabilityStart = markerStart + prefix.length;
		const nextSlashIndex = url.pathname.indexOf("/", capabilityStart);
		const capabilityEnd = nextSlashIndex >= 0 ? nextSlashIndex : url.pathname.length;
		if (capabilityEnd <= capabilityStart) return;
		url.pathname = url.pathname.slice(0, capabilityStart) + encodeURIComponent(normalizedCapability) + url.pathname.slice(capabilityEnd);
		url.search = "";
		url.hash = "";
		return url.toString().replace(/\/$/, "");
	} catch {
		return;
	}
}
function pluginNodeCapabilityFromScopedHostUrl(rawUrl) {
	try {
		const pathname = new URL(rawUrl).pathname;
		const prefix = `${PLUGIN_NODE_CAPABILITY_PATH_PREFIX}/`;
		const markerStart = pathname.indexOf(prefix);
		if (markerStart < 0) return;
		const capabilityStart = markerStart + prefix.length;
		const nextSlashIndex = pathname.indexOf("/", capabilityStart);
		const capabilityEnd = nextSlashIndex >= 0 ? nextSlashIndex : pathname.length;
		if (capabilityEnd <= capabilityStart) return;
		return normalizeOptionalString(decodeURIComponent(pathname.slice(capabilityStart, capabilityEnd)));
	} catch {
		return;
	}
}
/** Detect conflicting scoped capabilities while allowing transport host rewriting. */
function pluginNodeCapabilityScopedHostUrlsConflict(first, second) {
	const firstCapability = pluginNodeCapabilityFromScopedHostUrl(first);
	const secondCapability = pluginNodeCapabilityFromScopedHostUrl(second);
	return Boolean(firstCapability && secondCapability && !safeEqualSecret(firstCapability, secondCapability));
}
/** Check whether a client's current scoped surface URL still has live authorization. */
function hasAuthorizedClientPluginNodeCapabilityUrl(params) {
	const storageKey = resolvePluginNodeCapabilityStorageKey(params.surface);
	const capability = pluginNodeCapabilityFromScopedHostUrl(params.url);
	if (!storageKey || !capability) return false;
	const entry = params.client.pluginNodeCapabilities?.[storageKey];
	const nowMs = params.nowMs ?? Date.now();
	return Boolean(entry && isFutureDateTimestampMs(entry.expiresAtMs, { nowMs }) && safeEqualSecret(entry.capability, capability));
}
/** Parse and rewrite scoped capability URLs into canonical paths plus query tokens. */
function normalizePluginNodeCapabilityScopedUrl(rawUrl) {
	let url;
	try {
		url = new URL(rawUrl, "http://localhost");
	} catch {
		return {
			pathname: "/",
			scopedPath: false,
			malformedScopedPath: true
		};
	}
	const prefix = `${PLUGIN_NODE_CAPABILITY_PATH_PREFIX}/`;
	let scopedPath = false;
	let malformedScopedPath = false;
	let capabilityFromPath;
	let rewrittenUrl;
	if (url.pathname.startsWith(prefix)) {
		scopedPath = true;
		const remainder = url.pathname.slice(prefix.length);
		const slashIndex = remainder.indexOf("/");
		if (slashIndex <= 0) malformedScopedPath = true;
		else {
			const encodedCapability = remainder.slice(0, slashIndex);
			const canonicalPath = remainder.slice(slashIndex) || "/";
			let decoded;
			try {
				decoded = decodeURIComponent(encodedCapability);
			} catch {
				malformedScopedPath = true;
			}
			capabilityFromPath = normalizeOptionalString(decoded);
			if (!capabilityFromPath || !canonicalPath.startsWith("/")) malformedScopedPath = true;
			else {
				url.pathname = canonicalPath;
				url.searchParams.set(PLUGIN_NODE_CAPABILITY_QUERY_PARAM, capabilityFromPath);
				rewrittenUrl = `${url.pathname}${url.search}`;
			}
		}
	}
	const capability = capabilityFromPath ?? normalizeOptionalString(url.searchParams.get(PLUGIN_NODE_CAPABILITY_QUERY_PARAM));
	return {
		pathname: url.pathname,
		capability,
		rewrittenUrl,
		scopedPath,
		malformedScopedPath
	};
}
function setClientPluginNodeCapability(params) {
	const surface = normalizeOptionalString(params.surface.surface);
	const storageKey = resolvePluginNodeCapabilityStorageKey(params.surface);
	const expiresAtMs = asDateTimestampMs(params.expiresAtMs);
	if (!surface || !storageKey || expiresAtMs === void 0) return;
	params.client.pluginNodeCapabilities ??= {};
	params.client.pluginNodeCapabilities[storageKey] = {
		capability: params.capability,
		expiresAtMs
	};
}
function refreshClientPluginNodeCapability(params) {
	const surface = normalizeOptionalString(params.surface.surface);
	if (!surface) return;
	const existingUrl = params.client.pluginSurfaceUrls?.[surface];
	if (!existingUrl) return;
	const capabilitySurface = params.client.pluginNodeCapabilitySurfaces?.[surface] ?? params.surface;
	const capability = mintPluginNodeCapabilityToken();
	const expiresAtMs = resolvePluginNodeCapabilityExpiresAtMs(capabilitySurface, params.nowMs ?? Date.now());
	if (expiresAtMs === void 0) return;
	const scopedUrl = replacePluginNodeCapabilityInScopedHostUrl(existingUrl, capability);
	if (!scopedUrl) return;
	params.client.pluginSurfaceUrls ??= {};
	params.client.pluginSurfaceUrls[surface] = scopedUrl;
	setClientPluginNodeCapability({
		client: params.client,
		surface: capabilitySurface,
		capability,
		expiresAtMs
	});
	return {
		surface,
		capability,
		expiresAtMs,
		scopedUrl
	};
}
function hasAuthorizedPluginNodeCapability(params) {
	const surface = normalizeOptionalString(params.surface.surface);
	const storageKey = resolvePluginNodeCapabilityStorageKey(params.surface);
	if (!surface || !storageKey) return false;
	const nowMs = params.nowMs ?? Date.now();
	const nextExpiresAtMs = resolvePluginNodeCapabilityExpiresAtMs(params.surface, nowMs);
	if (nextExpiresAtMs === void 0) return false;
	for (const client of params.clients) {
		if (client.invalidated) continue;
		const entry = client.pluginNodeCapabilities?.[storageKey];
		if (!entry || !isFutureDateTimestampMs(entry.expiresAtMs, { nowMs })) continue;
		if (safeEqualSecret(entry.capability, params.capability)) {
			entry.expiresAtMs = nextExpiresAtMs;
			return true;
		}
	}
	return false;
}
//#endregion
export { hasAuthorizedPluginNodeCapability as a, normalizePluginNodeCapabilityScopedUrl as c, reconcileClientPluginNodeCapabilities as d, refreshClientPluginNodeCapability as f, setClientPluginNodeCapability as h, hasAuthorizedClientPluginNodeCapabilityUrl as i, pluginNodeCapabilityScopedHostUrlsConflict as l, resolvePluginNodeCapabilityTtlMs as m, PLUGIN_NODE_CAPABILITY_PATH_PREFIX as n, indexPluginNodeCapabilitySurfaces as o, resolvePluginNodeCapabilityExpiresAtMs as p, buildPluginNodeCapabilityScopedHostUrl as r, mintPluginNodeCapabilityToken as s, DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS as t, prepareClientPluginNodeCapabilities as u };
