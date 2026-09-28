import { d as resolveCodexAppServerHomeDir, f as resolveCodexAppServerLocalHomeDir, p as resolveCodexAppServerUserHomeDir } from "./config-security-BEReZ6go.mjs";
import { createRequire } from "node:module";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import { OPENCLAW_VERSION, embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-registration";
import { isFutureDateTimestampMs, resolveDateTimestampMs, resolveExpiresAtMsFromDurationMs } from "openclaw/plugin-sdk/number-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { readPluginPackageVersion } from "openclaw/plugin-sdk/extension-shared";
//#region extensions/codex/src/app-server/app-identity.ts
/**
* Apps SDK manifests and installed Codex connections can name the same app
* with asdk_app_ and legacy connector_ prefixes. Only the shared 128-bit ID
* establishes equivalence; display names never establish app ownership.
* Keep the installed ID for native config and calls. This comparison bridge
* can retire when installed inventories consistently return Apps SDK IDs.
*/
function codexAppIdentityKey(id) {
	return id.replace(/^connector_([a-f0-9]{32})$/, "asdk_app_$1");
}
/** Resolves a declared app against account-authorized runtime metadata. */
function findCodexAppById(apps, id) {
	return apps.find((app) => app.id === id) ?? apps.find((app) => codexAppIdentityKey(app.id) === codexAppIdentityKey(id));
}
//#endregion
//#region extensions/codex/src/app-server/app-inventory-cache.ts
/**
* Process-local cache for Codex app-server app inventories, keyed by runtime
* identity and safe to refresh in the background.
*/
/** Default app inventory cache freshness window. */
const CODEX_APP_INVENTORY_CACHE_TTL_MS = 36e5;
const CODEX_APP_READ_BATCH_LIMIT = 100;
const MAX_SERIALIZED_ERROR_MESSAGE_LENGTH = 500;
/** In-memory app inventory cache with coalesced refreshes per key. */
var CodexAppInventoryCache = class {
	constructor(options = {}) {
		this.entries = /* @__PURE__ */ new Map();
		this.inFlight = /* @__PURE__ */ new Map();
		this.refreshTokens = /* @__PURE__ */ new Map();
		this.diagnostics = /* @__PURE__ */ new Map();
		this.revision = 0;
		this.ttlMs = options.ttlMs ?? CODEX_APP_INVENTORY_CACHE_TTL_MS;
	}
	/** Reads a snapshot and schedules refresh when missing, stale, or forced. */
	read(params) {
		const nowMs = resolveDateTimestampMs(params.nowMs);
		const entry = this.entries.get(params.key);
		if (!entry) {
			const refreshScheduled = params.suppressRefresh ? false : this.scheduleRefresh(params);
			return {
				state: "missing",
				key: params.key,
				revision: this.revision,
				refreshScheduled,
				...this.diagnostics.get(params.key) ? { diagnostic: this.diagnostics.get(params.key) } : {}
			};
		}
		const state = entry.invalidated || !isFutureDateTimestampMs(entry.expiresAtMs, { nowMs }) ? "stale" : "fresh";
		const refreshScheduled = state === "fresh" && !params.forceRefetch ? false : this.scheduleRefresh(params);
		return {
			state,
			key: params.key,
			revision: entry.revision,
			snapshot: stripEntryState(entry),
			refreshScheduled,
			...entry.lastError ? { diagnostic: entry.lastError } : {}
		};
	}
	/** Forces or joins an immediate refresh for a cache key. */
	refreshNow(params) {
		return this.refresh(params);
	}
	/**
	* Marks a key stale and records the reason as a diagnostic. A scope names
	* the app ids the invalidation concerns so a covering targeted refresh can
	* clear it; without one, only a complete refresh revalidates the entry.
	*/
	invalidate(key, reason, nowMs = Date.now(), invalidatedAppIds) {
		this.revision += 1;
		this.refreshTokens.set(key, (this.refreshTokens.get(key) ?? 0) + 1);
		this.inFlight.delete(key);
		const diagnostic = {
			message: reason,
			atMs: nowMs
		};
		const entry = this.entries.get(key);
		if (entry) {
			const scope = invalidatedAppIds?.filter(Boolean).map(codexAppIdentityKey) ?? [];
			if (!entry.invalidated) entry.invalidatedAppIds = scope.length ? [...scope].toSorted() : void 0;
			else if (entry.invalidatedAppIds && scope.length) entry.invalidatedAppIds = Array.from(/* @__PURE__ */ new Set([...entry.invalidatedAppIds, ...scope])).toSorted();
			else entry.invalidatedAppIds = void 0;
			entry.invalidated = true;
			entry.lastError = diagnostic;
			entry.revision = this.revision;
		} else this.diagnostics.set(key, diagnostic);
		return this.revision;
	}
	/** Clears all cached snapshots, diagnostics, in-flight requests, and revision state. */
	clear() {
		this.entries.clear();
		this.inFlight.clear();
		this.refreshTokens.clear();
		this.diagnostics.clear();
		this.revision = 0;
	}
	/** Returns the monotonically increasing cache revision. */
	getRevision() {
		return this.revision;
	}
	scheduleRefresh(params) {
		const existing = this.inFlight.get(params.key);
		if (existing && !params.forceRefetch && doesInFlightRefreshCover(existing, params)) return true;
		this.refresh(params).catch(() => void 0);
		return true;
	}
	async refresh(params) {
		const existing = this.inFlight.get(params.key);
		if (existing && !params.forceRefetch && doesInFlightRefreshCover(existing, params)) return existing.promise;
		const refreshToken = (this.refreshTokens.get(params.key) ?? 0) + 1;
		this.refreshTokens.set(params.key, refreshToken);
		const previousRefresh = params.forceRefetch ? void 0 : existing?.promise;
		const promise = this.refreshUncoalesced(params, refreshToken, previousRefresh);
		const currentRefresh = {
			promise,
			targetAppIds: new Set(params.targetAppIds?.filter(Boolean).map(codexAppIdentityKey) ?? [])
		};
		this.inFlight.set(params.key, currentRefresh);
		try {
			return await promise;
		} finally {
			if (this.inFlight.get(params.key) === currentRefresh) this.inFlight.delete(params.key);
		}
	}
	async refreshUncoalesced(params, refreshToken, previousRefresh) {
		const nowMs = resolveDateTimestampMs(params.nowMs);
		try {
			let previousRefreshSucceeded = false;
			if (previousRefresh) try {
				await previousRefresh;
				previousRefreshSucceeded = true;
			} catch {}
			const inventory = await readInstalledApps(params.request, {
				forceRefresh: params.forceRefetch === true || !this.entries.has(params.key) && !previousRefreshSucceeded,
				targetAppIds: params.targetAppIds
			});
			this.revision += 1;
			const expiresAtMs = resolveExpiresAtMsFromDurationMs(this.ttlMs, { nowMs }) ?? 0;
			const snapshot = {
				key: params.key,
				apps: inventory.apps,
				installedApps: inventory.installedApps,
				...params.targetAppIds?.some(Boolean) ? { targetAppIds: Array.from(new Set(params.targetAppIds.filter(Boolean).map(codexAppIdentityKey))).toSorted() } : {},
				fetchedAtMs: nowMs,
				expiresAtMs,
				revision: this.revision
			};
			if (this.refreshTokens.get(params.key) === refreshToken) {
				const existingEntry = this.entries.get(params.key);
				const published = resolvePublishedInventorySnapshot(existingEntry, snapshot, nowMs);
				const remaining = resolveRemainingInvalidationScope(existingEntry, snapshot);
				this.entries.set(params.key, {
					...published,
					...remaining,
					...remaining.invalidated && existingEntry?.lastError ? { lastError: existingEntry.lastError } : {}
				});
				this.diagnostics.delete(params.key);
			}
			return snapshot;
		} catch (error) {
			const diagnostic = {
				message: sanitizeErrorMessage(error instanceof Error ? error.message : String(error)),
				atMs: nowMs
			};
			this.diagnostics.set(params.key, diagnostic);
			const entry = this.entries.get(params.key);
			if (entry) entry.lastError = diagnostic;
			embeddedAgentLog.warn("codex app inventory refresh failed", {
				forceRefetch: params.forceRefetch === true,
				keyFingerprint: fingerprintInventoryCacheKey(params.key),
				error: serializeCodexAppInventoryError(error)
			});
			throw error;
		}
	}
};
/**
* Publish policy for refreshed snapshots. A complete refresh replaces the
* entry, but a targeted refresh only rewrites its own target rows in place —
* replacing the whole entry with a narrow snapshot makes agents that share
* the runtime identity see each other's plugin apps vanish and force a hosted
* connector refresh per turn. The refreshed snapshot stays authoritative for
* its target set, so target rows it no longer returns are deleted.
*/
function resolvePublishedInventorySnapshot(existing, snapshot, nowMs) {
	if (!snapshot.targetAppIds?.length || !existing) return snapshot;
	if (!isFutureDateTimestampMs(existing.expiresAtMs, { nowMs })) return snapshot;
	const refreshedTargetIds = new Set(snapshot.targetAppIds);
	const { targetAppIds: snapshotTargetAppIds, ...snapshotBase } = snapshot;
	return {
		...snapshotBase,
		fetchedAtMs: existing.fetchedAtMs,
		expiresAtMs: existing.expiresAtMs,
		apps: mergeRefreshedRows(existing.apps, snapshot.apps, refreshedTargetIds),
		installedApps: mergeRefreshedRows(existing.installedApps, snapshot.installedApps, refreshedTargetIds),
		...existing.targetAppIds?.length ? { targetAppIds: Array.from(/* @__PURE__ */ new Set([...existing.targetAppIds, ...snapshotTargetAppIds])).toSorted() } : {}
	};
}
/** Replaces refreshed target rows in place, deletes vanished ones, appends new ones. */
function mergeRefreshedRows(existingRows, refreshedRows, refreshedTargetIds) {
	const refreshedById = new Map(refreshedRows.map((row) => [codexAppIdentityKey(row.id), row]));
	const existingIds = new Set(existingRows.map((row) => codexAppIdentityKey(row.id)));
	return [...existingRows.flatMap((row) => {
		if (!refreshedTargetIds.has(codexAppIdentityKey(row.id))) return [row];
		const refreshed = refreshedById.get(codexAppIdentityKey(row.id));
		return refreshed ? [refreshed] : [];
	}), ...refreshedRows.filter((row) => !existingIds.has(codexAppIdentityKey(row.id)))];
}
/**
* A refresh retires exactly the invalidation scope it re-read: a complete
* refresh clears everything; a targeted one subtracts its target ids so
* separate covering refreshes accumulate until no scope remains. Unscoped
* invalidations require a complete refresh.
*/
function resolveRemainingInvalidationScope(existing, snapshot) {
	if (!existing?.invalidated || !snapshot.targetAppIds?.length) return { invalidated: false };
	if (!existing.invalidatedAppIds) return { invalidated: true };
	const refreshedTargetIds = new Set(snapshot.targetAppIds);
	const remaining = existing.invalidatedAppIds.filter((appId) => !refreshedTargetIds.has(appId));
	return remaining.length > 0 ? {
		invalidated: true,
		invalidatedAppIds: remaining
	} : { invalidated: false };
}
function doesInFlightRefreshCover(existing, params) {
	if (existing.targetAppIds.size === 0) return true;
	const requestedAppIds = new Set(params.targetAppIds?.filter(Boolean).map(codexAppIdentityKey) ?? []);
	return requestedAppIds.size > 0 && Array.from(requestedAppIds).every((appId) => existing.targetAppIds.has(appId));
}
/** Serializes a refresh failure without leaking large or sensitive error data. */
function serializeCodexAppInventoryError(error) {
	const record = isRecord(error) ? error : void 0;
	const data = record && "data" in record ? redactErrorData(record.data) : void 0;
	return {
		name: error instanceof Error ? error.name : typeof record?.name === "string" ? record.name : void 0,
		message: sanitizeErrorMessage(error instanceof Error ? error.message : String(error)),
		...typeof record?.code === "number" ? { code: record.code } : {},
		...data !== void 0 ? { data } : {}
	};
}
/** Shared app inventory cache used by Codex app-server runtime paths. */
const defaultCodexAppInventoryCache = new CodexAppInventoryCache();
/** Builds a stable cache key from build versions and runtime identity fields. */
function buildCodexAppInventoryCacheKey(input, openClawVersion, codexPluginVersion) {
	return JSON.stringify({
		openClawVersion,
		codexPluginVersion,
		codexHome: input.codexHome ?? null,
		endpoint: input.endpoint ?? null,
		runtimeIdentity: normalizeRuntimeIdentityForCacheKey(input.runtimeIdentity),
		authProfileId: input.authProfileId ?? null,
		accountId: input.accountId ?? null,
		envApiKeyFingerprint: input.envApiKeyFingerprint ?? null,
		appServerVersion: input.appServerVersion ?? null
	});
}
function normalizeRuntimeIdentityForCacheKey(value) {
	if (!value) return null;
	const entries = Object.entries(value).flatMap(([key, rawValue]) => {
		const normalized = rawValue?.trim();
		return normalized ? [[key, normalized]] : [];
	}).toSorted(([left], [right]) => left.localeCompare(right));
	return entries.length > 0 ? Object.fromEntries(entries) : null;
}
async function readInstalledApps(request, options) {
	const installed = await request("app/installed", { forceRefresh: options.forceRefresh });
	const targetIds = new Set((options.targetAppIds ?? []).filter(Boolean).map(codexAppIdentityKey));
	const apps = targetIds.size === 0 ? installed.apps : installed.apps.filter((app) => targetIds.has(codexAppIdentityKey(app.id)));
	if (apps.length === 0) return {
		apps: [],
		installedApps: []
	};
	const metadataResponses = await Promise.all(Array.from({ length: Math.ceil(apps.length / CODEX_APP_READ_BATCH_LIMIT) }, (_, index) => request("app/read", {
		appIds: apps.slice(index * CODEX_APP_READ_BATCH_LIMIT, (index + 1) * CODEX_APP_READ_BATCH_LIMIT).map((app) => app.id),
		includeTools: true
	})));
	const metadataById = new Map(metadataResponses.flatMap((response) => response.apps).map((metadata) => [metadata.id, metadata]));
	return {
		apps: apps.flatMap((installedApp) => {
			const metadata = metadataById.get(installedApp.id);
			return metadata ? [metadata] : [];
		}),
		installedApps: apps
	};
}
function stripEntryState(entry) {
	const { invalidated: _invalidated, invalidatedAppIds: _invalidatedAppIds, ...snapshot } = entry;
	return snapshot;
}
function fingerprintInventoryCacheKey(key) {
	let hash = 0;
	for (let index = 0; index < key.length; index += 1) hash = hash * 31 + key.charCodeAt(index) >>> 0;
	return hash.toString(16).padStart(8, "0");
}
function truncateSerializedErrorText(value) {
	return value.length > MAX_SERIALIZED_ERROR_MESSAGE_LENGTH ? `${truncateUtf16Safe(value, MAX_SERIALIZED_ERROR_MESSAGE_LENGTH)}...` : value;
}
function redactErrorData(value, depth = 0) {
	if (value === void 0) return;
	if (value === null || typeof value === "boolean" || typeof value === "number") return value;
	if (depth > 6) return "[truncated]";
	if (Array.isArray(value)) return value.map((entry) => redactErrorData(entry, depth + 1) ?? null);
	if (isRecord(value)) {
		const redacted = {};
		for (const [key, entry] of Object.entries(value)) redacted[key] = isSensitiveErrorDataKey(key) ? "<redacted>" : redactErrorData(entry, depth + 1) ?? null;
		return redacted;
	}
	if (typeof value === "string") return truncateSerializedErrorText(value);
	if (typeof value === "bigint") return value.toString();
	if (typeof value === "symbol") return value.description ? `Symbol(${value.description})` : "Symbol()";
	if (typeof value === "function") return value.name ? `[function ${value.name}]` : "[function]";
	return "[unserializable]";
}
function sanitizeErrorMessage(message) {
	const htmlStart = message.search(/<html[\s>]/i);
	return truncateSerializedErrorText((htmlStart >= 0 ? `${message.slice(0, htmlStart).trimEnd()} [HTML response body omitted]` : message).replace(/([?&][^=\s"'<>]*(?:api[_-]?key|authorization|cookie|credential|password|secret|token|tk)[^=\s"'<>]*=)[^&\s"'<>]+/gi, "$1<redacted>"));
}
function isSensitiveErrorDataKey(key) {
	return /api[_-]?key|authorization|cookie|credential|password|secret|token/i.test(key);
}
//#endregion
//#region extensions/codex/src/app-server/plugin-app-cache-key.ts
/**
* Builds stable Codex plugin/app inventory cache keys from app-server startup,
* auth, account, and version inputs without storing secret material.
*/
const require = createRequire(import.meta.url);
const CODEX_PLUGIN_VERSION = readPluginPackageVersion({ require });
/** Builds the full app inventory cache key for Codex plugin/app discovery. */
function buildCodexPluginAppCacheKey(params) {
	return buildCodexAppInventoryCacheKey({
		codexHome: params.runtimeIdentity?.codexHome ?? resolveCodexPluginAppCacheCodexHome(params.appServer, params.agentDir),
		endpoint: resolveCodexPluginAppCacheEndpoint(params.appServer),
		authProfileId: params.authProfileId,
		accountId: params.accountId,
		envApiKeyFingerprint: params.envApiKeyFingerprint,
		appServerVersion: params.appServerVersion ?? params.runtimeIdentity?.serverVersion,
		runtimeIdentity: params.desktopGenerationFingerprint ? {
			...params.runtimeIdentity,
			desktopGeneration: params.desktopGenerationFingerprint
		} : params.runtimeIdentity
	}, OPENCLAW_VERSION, CODEX_PLUGIN_VERSION);
}
/** Builds a durable thread-binding fingerprint for one initialized app-server runtime. */
function buildCodexAppServerRuntimeFingerprint(params) {
	return JSON.stringify({
		endpoint: resolveCodexPluginAppCacheEndpoint(params.appServer),
		connectionClass: params.appServer.connectionClass,
		remoteWorkspaceRoot: params.appServer.remoteWorkspaceRoot ?? null,
		appServerVersion: params.appServerVersion ?? params.runtimeIdentity?.serverVersion ?? null,
		runtimeIdentity: params.runtimeIdentity ?? null
	});
}
/** Fingerprints the configured connection that owns a supervised source thread. */
function buildCodexAppServerConnectionFingerprint(appServer, agentDir) {
	return JSON.stringify({
		endpoint: resolveCodexPluginAppCacheEndpoint(appServer),
		connectionClass: appServer.connectionClass,
		remoteWorkspaceRoot: appServer.remoteWorkspaceRoot ?? null,
		homeScope: appServer.start.homeScope ?? null,
		codexHome: resolveCodexAppServerConnectionHome(appServer.start, agentDir),
		cwd: appServer.start.cwd ?? null
	});
}
function resolveCodexAppServerConnectionHome(start, agentDir) {
	const configured = start.codexHome ?? start.env?.CODEX_HOME?.trim();
	if (configured) return configured;
	if (start.transport === "unix" && (!start.url || start.url === "unix://")) return resolveCodexAppServerUserHomeDir(start.env ?? process.env);
	if (start.transport !== "stdio") return null;
	if (start.homeScope === "user") return resolveCodexAppServerUserHomeDir(process.env);
	return agentDir ? resolveCodexAppServerLocalHomeDir(start, agentDir) : null;
}
/** Serializes app-server endpoint identity, including credential fingerprints. */
function resolveCodexPluginAppCacheEndpoint(appServer) {
	return JSON.stringify({
		transport: appServer.start.transport,
		command: appServer.start.command,
		args: appServer.start.args,
		url: appServer.start.url ?? null,
		credentialFingerprint: fingerprintCodexPluginAppCacheCredentials(appServer.start)
	});
}
/** Resolves the CODEX_HOME value that scopes local app-server inventory. */
function resolveCodexPluginAppCacheCodexHome(appServer, agentDir) {
	const configuredCodexHome = appServer.start.codexHome ?? appServer.start.env?.CODEX_HOME?.trim();
	if (configuredCodexHome) return configuredCodexHome;
	return appServer.start.transport === "stdio" && agentDir ? resolveCodexAppServerHomeDir(agentDir) : void 0;
}
function fingerprintCodexPluginAppCacheCredentials(startOptions) {
	const authToken = startOptions.authToken ?? "";
	const headers = Object.entries(startOptions.headers).map(([key, value]) => [key.toLowerCase(), value]).toSorted(([left], [right]) => left.localeCompare(right));
	if (!authToken && headers.length === 0) return null;
	const hash = createHash("sha256");
	hash.update("openclaw:codex:plugin-app-cache-credentials:v1");
	hash.update("\0");
	hash.update(authToken);
	for (const [key, value] of headers) {
		hash.update("\0");
		hash.update(key);
		hash.update("\0");
		hash.update(value);
	}
	return `sha256:${hash.digest("hex")}`;
}
//#endregion
export { defaultCodexAppInventoryCache as a, findCodexAppById as c, CodexAppInventoryCache as i, buildCodexAppServerRuntimeFingerprint as n, serializeCodexAppInventoryError as o, buildCodexPluginAppCacheKey as r, codexAppIdentityKey as s, buildCodexAppServerConnectionFingerprint as t };
