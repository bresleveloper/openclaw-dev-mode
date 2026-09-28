import { c as isRecord, i as normalizeOptionalString, t as normalizeLowercaseStringOrEmpty } from "./string-coerce-Dyy0qgLy.js";
import { d as resolveAccountKey, f as DEFAULT_ACCOUNT_ID, p as normalizeAccountId, s as defineChannelAliasMigration } from "./runtime-doctor-migrations-8XPPImoy.js";
import "./string-coerce-runtime-BSQ-eR6f.js";
import "./session-key-BEdxOeE4.js";
import "./utils-CROxhhxU.js";
import path from "node:path";
import { isIP } from "node:net";
import "node:url";
//#region extensions/signal/src/account-selection.ts
function resolveSignalAccountKey(accounts, accountId) {
	return resolveAccountKey(accounts, normalizeAccountId(accountId), void 0, void 0, { channelId: "signal" });
}
//#endregion
//#region extensions/signal/src/account-key-repair.ts
function repairSignalAccountKeys({ cfg }) {
	const signal = cfg.channels?.signal;
	const accounts = signal?.accounts;
	if (!accounts) return {
		config: cfg,
		changes: []
	};
	const groups = /* @__PURE__ */ new Map();
	for (const key of Object.keys(accounts)) if (key) {
		const id = normalizeAccountId(key);
		groups.set(id, [...groups.get(id) ?? [], key]);
	}
	const moves = /* @__PURE__ */ new Map();
	const warnings = [];
	for (const [id, keys] of groups) {
		if (keys.length > 1) {
			warnings.push(`Signal account keys ${keys.map((key) => JSON.stringify(key)).join(", ")} resolve to "${id}". Doctor preserved them; rename them so each account has a unique normalized key.`);
			continue;
		}
		for (const key of keys) if (normalizeLowercaseStringOrEmpty(key) !== id) {
			if (resolveSignalAccountKey(accounts, id) !== key) {
				warnings.push(`Signal account "${key}" is listed as "${id}" but currently uses the channel defaults. Doctor preserved it to avoid changing a working account; check its settings before renaming the key to "${id}".`);
				continue;
			}
			moves.set(key, id);
		}
	}
	const repaired = Object.fromEntries(Object.entries(accounts).map(([key, entry]) => [moves.get(key) ?? key, entry]));
	return {
		config: moves.size ? {
			...cfg,
			channels: {
				...cfg.channels,
				signal: {
					...signal,
					accounts: repaired
				}
			}
		} : cfg,
		changes: [...moves].map(([from, to]) => `Moved Signal account "${from}" to channels.signal.accounts.${to}.`),
		warnings
	};
}
//#endregion
//#region extensions/signal/src/transport-url.ts
function normalizeSignalTransportUrl(value) {
	const trimmed = value.trim();
	if (!trimmed) throw new Error("Signal transport URL is required");
	if (/^https?:/i.test(trimmed) && !/^https?:\/\/[^/]/i.test(trimmed)) throw new Error("Signal transport URL has a malformed HTTP scheme");
	const explicitScheme = /^([a-z][a-z0-9+.-]*):\/\//i.exec(trimmed)?.[1]?.toLowerCase();
	if (explicitScheme && explicitScheme !== "http" && explicitScheme !== "https") throw new Error(`Signal transport URL unsupported protocol: ${explicitScheme}:`);
	const parsed = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`);
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error(`Signal transport URL unsupported protocol: ${parsed.protocol}`);
	if (parsed.username || parsed.password) throw new Error("Signal transport URL must not include credentials");
	const pathname = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/+$/, "");
	return `${parsed.protocol}//${parsed.host}${pathname}`;
}
function normalizeSignalTransportHost(host) {
	const trimmedHost = host.trim();
	const hasOpeningBracket = trimmedHost.startsWith("[");
	if (hasOpeningBracket !== trimmedHost.endsWith("]")) throw new Error("Signal transport host has mismatched IPv6 brackets");
	const normalizedHost = hasOpeningBracket ? trimmedHost.slice(1, -1) : trimmedHost;
	if (!normalizedHost || /[\s/\\?#@]/.test(normalizedHost)) throw new Error("Signal transport host must be a hostname or IP address");
	if (isIP(normalizedHost) === 0) {
		const hostname = normalizedHost.endsWith(".") ? normalizedHost.slice(0, -1) : normalizedHost;
		const labels = hostname.split(".");
		if (hostname.length > 253 || labels.some((label) => !label || label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label))) throw new Error("Signal transport host must be a hostname or IP address");
	}
	return normalizedHost;
}
function buildSignalTransportHttpUrl(host, port) {
	const normalizedHost = normalizeSignalTransportHost(host);
	return normalizeSignalTransportUrl(`http://${normalizedHost.includes(":") ? `[${normalizedHost}]` : normalizedHost}:${port}`);
}
/** Validate the opt-in shape without filesystem side effects during config resolution. */
function assertSignalSocketTransport(transport) {
	if (transport.socketPath === void 0) return;
	if (typeof transport.socketPath !== "string" || !/^\/(?!\/)[^\0]+$/.test(transport.socketPath) || transport.socketPath.endsWith("/") || path.posix.normalize(transport.socketPath) !== transport.socketPath || Buffer.byteLength(transport.socketPath, "utf8") > 103) throw new Error("Signal transport.socketPath must be a normalized absolute POSIX socket file path of at most 103 UTF-8 bytes.");
	if (transport.url !== void 0 || transport.httpHost !== void 0 || transport.httpPort !== void 0) throw new Error("Signal transport.socketPath cannot be combined with url, httpHost, or httpPort.");
	if (transport.receiveMode === "on-start") throw new Error("Signal socket transport requires receiveMode manual (or omitted).");
}
//#endregion
//#region extensions/signal/src/transport-policy.ts
const DEFAULT_SIGNAL_MANAGED_NATIVE_PORT = 8080;
const SIGNAL_LOOPBACK_HOST_ALIASES = /* @__PURE__ */ new Set([
	"localhost",
	"127.0.0.1",
	"::1"
]);
function normalizeSignalEndpointHost(hostname) {
	const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, "");
	return normalized.endsWith(".") ? normalized.slice(0, -1) : normalized;
}
function isSignalLocalEndpointHost(hostname) {
	return hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "::1" || hostname === "::" || hostname === "0.0.0.0" || /^127(?:\.\d{1,3}){3}$/.test(hostname) || /^::ffff:(?:127(?:\.\d{1,3}){3}|7f[0-9a-f]{2}:[0-9a-f]{1,4})$/.test(hostname);
}
function isValidSignalManagedNativePort(value) {
	return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 65535;
}
function allocateSignalManagedNativePort(params) {
	if (params.preferredPort !== void 0) {
		if (!isValidSignalManagedNativePort(params.preferredPort)) throw new Error("Signal managed native port must be an integer between 1 and 65535.");
		if (!params.reservedPorts.has(params.preferredPort)) return params.preferredPort;
	}
	let port = DEFAULT_SIGNAL_MANAGED_NATIVE_PORT;
	while (port <= 65535 && params.reservedPorts.has(port)) port += 1;
	if (port > 65535) throw new Error("No available Signal managed native port remains.");
	return port;
}
function resolveLocalSignalTransportPort(baseUrl) {
	try {
		const parsed = new URL(baseUrl);
		if (!isSignalLocalEndpointHost(normalizeSignalEndpointHost(parsed.hostname))) return;
		if (parsed.port) return Number.parseInt(parsed.port, 10);
		return parsed.protocol === "https:" ? 443 : 80;
	} catch {
		return;
	}
}
function isSignalManagedNativeConnectionUrlForBind(transport) {
	if (transport.kind !== "managed-native" || !transport.url) return false;
	const connectionUrl = new URL(transport.url);
	if (connectionUrl.protocol !== "http:") return false;
	if ((connectionUrl.port ? Number.parseInt(connectionUrl.port, 10) : 80) !== (transport.httpPort ?? 8080)) return false;
	const connectionHost = normalizeSignalEndpointHost(connectionUrl.hostname);
	const bindHost = normalizeSignalEndpointHost(transport.httpHost ?? "127.0.0.1");
	if (connectionHost === bindHost) return true;
	if (bindHost === "0.0.0.0") return connectionHost === "localhost" || /^127(?:\.\d{1,3}){3}$/.test(connectionHost);
	if (bindHost === "::") return connectionHost === "localhost" || connectionHost === "::1";
	return bindHost === "localhost" && SIGNAL_LOOPBACK_HOST_ALIASES.has(connectionHost) || connectionHost === "localhost" && SIGNAL_LOOPBACK_HOST_ALIASES.has(bindHost);
}
function assignSignalManagedNativePort(transport, httpPort) {
	if (!isValidSignalManagedNativePort(httpPort)) throw new Error("Signal managed native port must be an integer between 1 and 65535.");
	const connectionUrlValue = transport.url;
	if (!connectionUrlValue || !isSignalManagedNativeConnectionUrlForBind(transport)) return {
		...transport,
		httpPort
	};
	const connectionUrl = new URL(connectionUrlValue);
	connectionUrl.port = String(httpPort);
	return {
		...transport,
		url: normalizeSignalTransportUrl(connectionUrl.toString()),
		httpPort
	};
}
//#endregion
//#region extensions/signal/src/config-compat.ts
const LEGACY_TRANSPORT_FIELDS = [
	"configPath",
	"httpUrl",
	"httpHost",
	"httpPort",
	"cliPath",
	"autoStart",
	"startupTimeoutMs",
	"receiveMode",
	"ignoreStories"
];
const PENDING_LEGACY_TRANSPORT_WARNING = "- channels.signal: legacy auto transport is ambiguous while its endpoint is unavailable; bring the endpoint online and rerun openclaw doctor --fix, or replace the retired fields with an explicit account-owned transport in openclaw.json.";
const PENDING_LEGACY_INVALID_URL_WARNING = "- channels.signal: legacy httpUrl is invalid; keep the current config, correct httpUrl, then run openclaw doctor --fix.";
const PENDING_LEGACY_INVALID_HOST_WARNING = "- channels.signal: legacy httpHost is invalid; keep the current config, correct httpHost, then run openclaw doctor --fix.";
const PENDING_LEGACY_INVALID_PORT_WARNING = "- channels.signal: legacy httpPort must be an integer between 1 and 65535; correct httpPort, then run openclaw doctor --fix.";
const PENDING_LEGACY_CONTAINER_ACCOUNT_WARNING = "- channels.signal: legacy container transport requires an account number; add channels.signal.account (or the relevant channels.signal.accounts.*.account) and rerun openclaw doctor --fix.";
function isSignalTransportConfig(value) {
	if (!isRecord(value)) return false;
	if (value.kind === "managed-native") {
		try {
			assertSignalSocketTransport(value);
		} catch {
			return false;
		}
		if (value.httpPort !== void 0 && !isValidSignalManagedNativePort(value.httpPort)) return false;
		if (value.url === void 0) return true;
		if (typeof value.url !== "string") return false;
		try {
			normalizeSignalTransportUrl(value.url);
			return true;
		} catch {
			return false;
		}
	}
	if (value.kind !== "external-native" && value.kind !== "container" || typeof value.url !== "string") return false;
	try {
		normalizeSignalTransportUrl(value.url);
		return true;
	} catch {
		return false;
	}
}
function inherited(entry, parent, key) {
	return Object.hasOwn(entry, key) ? entry[key] : parent[key];
}
function legacyBaseUrl(entry, parent) {
	const url = normalizeOptionalString(inherited(entry, parent, "httpUrl"));
	if (url) return normalizeSignalTransportUrl(url);
	const host = normalizeOptionalString(inherited(entry, parent, "httpHost")) ?? "127.0.0.1";
	const rawPort = inherited(entry, parent, "httpPort");
	return buildSignalTransportHttpUrl(host, typeof rawPort === "number" ? rawPort : 8080);
}
function hasLegacyFields(entry) {
	return LEGACY_TRANSPORT_FIELDS.some((field) => Object.hasOwn(entry, field));
}
function wasLegacySignalAccountConfigured(entry, parent) {
	return Boolean(normalizeOptionalString(inherited(entry, parent, "account")) || normalizeOptionalString(inherited(entry, parent, "configPath")) || normalizeOptionalString(inherited(entry, parent, "httpUrl")) || normalizeOptionalString(inherited(entry, parent, "httpHost")) || normalizeOptionalString(inherited(entry, parent, "cliPath")) || typeof inherited(entry, parent, "httpPort") === "number" || typeof inherited(entry, parent, "autoStart") === "boolean");
}
function hasInvalidLegacyHttpUrl(entries, parent) {
	return entries.some((entry) => {
		const httpUrl = normalizeOptionalString(inherited(entry, parent, "httpUrl"));
		if (!httpUrl) return false;
		try {
			normalizeSignalTransportUrl(httpUrl);
			return false;
		} catch {
			return true;
		}
	});
}
function findInvalidLegacyDerivedEndpoint(entries, parent) {
	for (const entry of entries) {
		if (normalizeOptionalString(inherited(entry, parent, "httpUrl"))) continue;
		const rawPort = inherited(entry, parent, "httpPort");
		if (rawPort !== void 0 && !isValidSignalManagedNativePort(rawPort)) return "port";
		const host = normalizeOptionalString(inherited(entry, parent, "httpHost")) ?? "127.0.0.1";
		try {
			buildSignalTransportHttpUrl(host, typeof rawPort === "number" ? rawPort : 8080);
		} catch {
			return "host";
		}
	}
}
function hasInvalidManagedTransportPort(transports) {
	return transports.some((transport) => transport?.kind === "managed-native" && transport.httpPort !== void 0 && !isValidSignalManagedNativePort(transport.httpPort));
}
function requiresDetection(entry, parent, apiMode) {
	if (apiMode !== void 0 && apiMode !== "auto") return false;
	return Boolean(normalizeOptionalString(inherited(entry, parent, "httpUrl"))) || !resolveLegacyAutoStart(entry, parent);
}
function resolveLegacyAutoStart(entry, parent) {
	const autoStart = inherited(entry, parent, "autoStart");
	if (typeof autoStart === "boolean") return autoStart;
	return !normalizeOptionalString(inherited(entry, parent, "httpUrl"));
}
function resolveManagedConnectionUrl(entry, parent) {
	const httpUrl = normalizeOptionalString(inherited(entry, parent, "httpUrl"));
	if (!httpUrl) return;
	const normalizedUrl = normalizeSignalTransportUrl(httpUrl);
	const endpoint = new URL(normalizedUrl);
	const bindHost = (normalizeOptionalString(inherited(entry, parent, "httpHost")) ?? "127.0.0.1").replace(/^\[|\]$/g, "").toLowerCase();
	const rawBindPort = inherited(entry, parent, "httpPort");
	const bindPort = typeof rawBindPort === "number" ? rawBindPort : 8080;
	const endpointHost = endpoint.hostname.replace(/^\[|\]$/g, "").toLowerCase();
	const endpointPort = endpoint.port ? Number.parseInt(endpoint.port, 10) : endpoint.protocol === "https:" ? 443 : 80;
	return endpoint.protocol === "http:" && endpointHost === bindHost && endpointPort === bindPort ? void 0 : normalizedUrl;
}
function buildManagedNativeTransport(entry, parent) {
	const value = (key) => inherited(entry, parent, key);
	const configPath = normalizeOptionalString(value("configPath"));
	const cliPath = normalizeOptionalString(value("cliPath"));
	const url = resolveManagedConnectionUrl(entry, parent);
	const httpHost = normalizeOptionalString(value("httpHost"));
	const httpPort = value("httpPort");
	const startupTimeoutMs = value("startupTimeoutMs");
	const receiveMode = value("receiveMode");
	const ignoreStories = value("ignoreStories");
	return {
		kind: "managed-native",
		...configPath ? { configPath } : {},
		...cliPath ? { cliPath } : {},
		...url ? { url } : {},
		...httpHost ? { httpHost } : {},
		...typeof httpPort === "number" ? { httpPort } : {},
		...typeof startupTimeoutMs === "number" ? { startupTimeoutMs } : {},
		...receiveMode === "on-start" || receiveMode === "manual" ? { receiveMode } : {},
		...typeof ignoreStories === "boolean" ? { ignoreStories } : {}
	};
}
function resolveLegacyTransportWithoutDetection(params) {
	if (isSignalTransportConfig(params.entry.transport)) return params.entry.transport;
	const baseUrl = legacyBaseUrl(params.entry, params.parent);
	const autoStart = inherited(params.entry, params.parent, "autoStart");
	if (params.apiMode === "container") return {
		kind: "container",
		url: baseUrl
	};
	if (params.apiMode === "native") return resolveLegacyAutoStart(params.entry, params.parent) ? buildManagedNativeTransport(params.entry, params.parent) : {
		kind: "external-native",
		url: baseUrl
	};
	if (requiresDetection(params.entry, params.parent, params.apiMode)) return;
	if (autoStart === false) return {
		kind: "external-native",
		url: baseUrl
	};
	return buildManagedNativeTransport(params.entry, params.parent);
}
function clearLegacyTransportFields(entry) {
	for (const field of LEGACY_TRANSPORT_FIELDS) delete entry[field];
}
function hasRootSignalAccount(entries) {
	const root = entries[0];
	return entries.length === 1 || Boolean(normalizeOptionalString(root?.account)) || isSignalTransportConfig(root?.transport);
}
function signalAccountIds(entries) {
	const accounts = isRecord(entries[0]?.accounts) ? entries[0].accounts : {};
	return Object.entries(accounts).filter(([, entry]) => isRecord(entry)).map(([accountId]) => accountId);
}
function resolveNestedDefaultEntryIndex(entries) {
	const key = resolveSignalAccountKey(isRecord(entries[0]?.accounts) ? entries[0].accounts : {}, DEFAULT_ACCOUNT_ID);
	const offset = signalAccountIds(entries).findIndex((accountId) => accountId === key);
	return offset >= 0 ? offset + 1 : void 0;
}
function isDefaultSignalAccountId(accountId) {
	return Boolean(accountId?.trim()) && normalizeAccountId(accountId) === "default";
}
function nestedDefaultOwnsEffectiveTransport(entries) {
	const accounts = isRecord(entries[0]?.accounts) ? entries[0].accounts : {};
	const nestedDefaultKey = resolveSignalAccountKey(accounts, DEFAULT_ACCOUNT_ID);
	const nestedDefault = nestedDefaultKey ? accounts[nestedDefaultKey] : void 0;
	return isRecord(nestedDefault) && (isSignalTransportConfig(nestedDefault.transport) || hasLegacyFields(nestedDefault));
}
function isDiscardedTransportEntry(entries, index) {
	if (index === 0) return !hasRootSignalAccount(entries) || nestedDefaultOwnsEffectiveTransport(entries);
	return index === resolveNestedDefaultEntryIndex(entries) && isSignalTransportConfig(entries[0]?.transport);
}
function shouldMaterializeTransport(entries, index) {
	if (isDiscardedTransportEntry(entries, index)) return false;
	const entry = entries[index];
	const parent = entries[0];
	return Boolean(entry && parent && (isSignalTransportConfig(entry.transport) || wasLegacySignalAccountConfigured(entry, parent)));
}
function allocateMigratedManagedPorts(params) {
	const reservedPorts = /* @__PURE__ */ new Set();
	const rootIsAccount = hasRootSignalAccount(params.entries);
	const nestedDefaultIndex = resolveNestedDefaultEntryIndex(params.entries);
	const canonicalDefaultIndex = isSignalTransportConfig(params.entries[0]?.transport) ? 0 : nestedDefaultIndex !== void 0 ? nestedDefaultIndex : rootIsAccount ? 0 : void 0;
	for (const [index, transport] of params.transports.entries()) {
		if (!transport || index === 0 && canonicalDefaultIndex !== 0) continue;
		if (transport.kind === "managed-native" && transport.socketPath !== void 0) continue;
		if (transport.kind !== "managed-native") {
			const localPort = resolveLocalSignalTransportPort(transport.url);
			if (localPort !== void 0) reservedPorts.add(localPort);
			continue;
		}
		if (transport.url && !isSignalManagedNativeConnectionUrlForBind(transport)) {
			const localConnectionPort = resolveLocalSignalTransportPort(transport.url);
			if (localConnectionPort !== void 0) reservedPorts.add(localConnectionPort);
		}
		if (index === canonicalDefaultIndex || isRecord(params.entries[index]?.transport)) reservedPorts.add(transport.httpPort ?? 8080);
	}
	return params.transports.map((transport, index) => {
		if (!transport || index === 0 && canonicalDefaultIndex !== 0) return transport;
		if (transport.kind !== "managed-native" || transport.socketPath !== void 0) return transport;
		if (isRecord(params.entries[index]?.transport) || index === canonicalDefaultIndex) return transport;
		const rawPreferredPort = params.entries[index]?.httpPort;
		const preferredPort = typeof rawPreferredPort === "number" ? rawPreferredPort : transport.httpPort;
		const httpPort = allocateSignalManagedNativePort({
			reservedPorts,
			...typeof preferredPort === "number" ? { preferredPort } : {}
		});
		reservedPorts.add(httpPort);
		return assignSignalManagedNativePort(transport, httpPort);
	});
}
function applyMigratedSignalTransports(params) {
	const next = structuredClone(params.cfg);
	const nextSignal = next.channels?.signal;
	if (!isRecord(nextSignal)) return;
	const nestedDefaultIndex = resolveNestedDefaultEntryIndex(params.entries);
	const nextAccounts = isRecord(nextSignal.accounts) ? nextSignal.accounts : {};
	const nextEntries = [nextSignal, ...Object.values(nextAccounts).filter(isRecord)];
	const rootIsAccount = hasRootSignalAccount(params.entries);
	const canonicalRootTransport = isSignalTransportConfig(params.entries[0]?.transport) ? params.entries[0].transport : void 0;
	for (const [index, entry] of nextEntries.entries()) {
		if (index === nestedDefaultIndex) {
			const defaultTransport = canonicalRootTransport ?? params.transports[index];
			if (defaultTransport) nextSignal.transport = defaultTransport;
			else delete nextSignal.transport;
			delete entry.transport;
		} else if (index === 0 && !rootIsAccount) delete entry.transport;
		else if (params.transports[index]) entry.transport = params.transports[index];
		else delete entry.transport;
		clearLegacyTransportFields(entry);
	}
	delete nextSignal.apiMode;
	return next;
}
function hasContainerTransportWithoutEffectiveAccount(cfg) {
	const signal = cfg.channels?.signal;
	if (!isRecord(signal)) return false;
	const accounts = isRecord(signal.accounts) ? signal.accounts : {};
	const rootTransport = isSignalTransportConfig(signal.transport) ? signal.transport : void 0;
	const defaultKey = resolveSignalAccountKey(accounts, DEFAULT_ACCOUNT_ID);
	const defaultEntry = defaultKey ? accounts[defaultKey] : void 0;
	const defaultAccount = isRecord(defaultEntry) && defaultEntry.account !== void 0 ? normalizeOptionalString(defaultEntry.account) : normalizeOptionalString(signal.account);
	const channelEnabled = signal.enabled !== false;
	const defaultEnabled = !isRecord(defaultEntry) || defaultEntry.enabled !== false;
	if (rootTransport?.kind === "container" && channelEnabled && defaultEnabled && !defaultAccount) return true;
	for (const [accountId, entry] of Object.entries(accounts)) {
		if (!isRecord(entry)) continue;
		if (!channelEnabled || entry.enabled === false) continue;
		const isDefaultAccount = isDefaultSignalAccountId(accountId);
		if ((isDefaultAccount && rootTransport ? rootTransport : isSignalTransportConfig(entry.transport) ? entry.transport : void 0)?.kind !== "container" || isDefaultAccount && rootTransport) continue;
		if (!(entry.account === void 0 ? normalizeOptionalString(signal.account) : normalizeOptionalString(entry.account))) return true;
	}
	return false;
}
function prepareLegacySignalTransportMigration(cfg) {
	const signal = cfg.channels?.signal;
	if (!isRecord(signal)) return {
		config: cfg,
		changes: []
	};
	const accounts = isRecord(signal.accounts) ? signal.accounts : {};
	if (!(Object.hasOwn(signal, "apiMode") || hasLegacyFields(signal) || Object.values(accounts).some((entry) => isRecord(entry) && hasLegacyFields(entry)))) return {
		config: cfg,
		changes: []
	};
	const apiMode = signal.apiMode;
	const entries = [signal, ...Object.values(accounts).filter(isRecord)];
	if (entries.some((entry) => isRecord(entry.transport) && Object.hasOwn(entry.transport, "socketPath") && (entry.transport.kind !== "managed-native" || !isSignalTransportConfig(entry.transport)))) return {
		config: cfg,
		changes: [],
		warnings: ["- channels.signal: invalid transport.socketPath configuration; correct the socket path and remove conflicting HTTP or receiveMode on-start options, then run openclaw doctor --fix."]
	};
	const legacyResolutionEntries = entries.filter((_, index) => shouldMaterializeTransport(entries, index)).filter((entry) => !isSignalTransportConfig(entry.transport));
	const invalidDerivedEndpoint = findInvalidLegacyDerivedEndpoint(legacyResolutionEntries, signal);
	if (invalidDerivedEndpoint) return {
		config: cfg,
		changes: [],
		warnings: [invalidDerivedEndpoint === "port" ? PENDING_LEGACY_INVALID_PORT_WARNING : PENDING_LEGACY_INVALID_HOST_WARNING]
	};
	if (hasInvalidLegacyHttpUrl(legacyResolutionEntries, signal)) return {
		config: cfg,
		changes: [],
		warnings: [PENDING_LEGACY_INVALID_URL_WARNING]
	};
	return {
		signal,
		apiMode,
		entries,
		legacyResolutionEntries
	};
}
function finishLegacySignalTransportMigration(cfg, entries, resolvedTransports) {
	if (hasInvalidManagedTransportPort(resolvedTransports)) return {
		config: cfg,
		changes: [],
		warnings: [PENDING_LEGACY_INVALID_PORT_WARNING]
	};
	const transports = allocateMigratedManagedPorts({
		entries,
		transports: resolvedTransports
	});
	if (transports.some((transport, index) => shouldMaterializeTransport(entries, index) && !transport)) return {
		config: cfg,
		changes: [],
		warnings: [PENDING_LEGACY_TRANSPORT_WARNING]
	};
	const next = applyMigratedSignalTransports({
		cfg,
		entries,
		transports
	});
	if (!next) return {
		config: cfg,
		changes: []
	};
	if (hasContainerTransportWithoutEffectiveAccount(next)) return {
		config: cfg,
		changes: [],
		warnings: [PENDING_LEGACY_CONTAINER_ACCOUNT_WARNING]
	};
	return {
		config: next,
		changes: ["Migrated channels.signal transport settings to concrete account-owned transport objects."]
	};
}
function migrateLegacySignalTransportConfigSync(cfg) {
	const prepared = prepareLegacySignalTransportMigration(cfg);
	if ("config" in prepared) return prepared;
	const { signal, apiMode, entries } = prepared;
	return finishLegacySignalTransportMigration(cfg, entries, entries.map((entry, index) => {
		if (!shouldMaterializeTransport(entries, index)) return;
		return resolveLegacyTransportWithoutDetection({
			entry,
			parent: signal,
			apiMode
		});
	}));
}
//#endregion
//#region extensions/signal/config-doctor-api.ts
const RETIRED_SIGNAL_ACCOUNT_TRANSPORT_FIELDS = [
	"configPath",
	"httpUrl",
	"httpHost",
	"httpPort",
	"cliPath",
	"autoStart",
	"startupTimeoutMs",
	"receiveMode",
	"ignoreStories"
];
function hasRetiredSignalAccountTransportFields(value) {
	return isRecord(value) && RETIRED_SIGNAL_ACCOUNT_TRANSPORT_FIELDS.some((field) => Object.hasOwn(value, field));
}
function hasRetiredSignalAccountMapTransportFields(value) {
	return isRecord(value) && Object.values(value).some(hasRetiredSignalAccountTransportFields);
}
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "signal",
	streaming: {
		defaultMode: "partial",
		deliveryOnly: true
	},
	accountStreamingReplacesRoot: true
});
const legacyConfigRules = [
	...streamingAliasMigration.legacyConfigRules,
	{
		path: ["channels", "signal"],
		message: "Signal transport config is now account-owned; run \"openclaw doctor --fix\" to migrate retired channels.signal transport fields.",
		match: (value) => isRecord(value) && (Object.hasOwn(value, "apiMode") || hasRetiredSignalAccountTransportFields(value))
	},
	{
		path: [
			"channels",
			"signal",
			"accounts"
		],
		message: "Signal transport config is now account-owned; run \"openclaw doctor --fix\" to migrate retired per-account transport fields.",
		match: hasRetiredSignalAccountMapTransportFields
	}
];
function normalizeCompatibilityConfig({ cfg }) {
	const accountKeys = repairSignalAccountKeys({ cfg });
	const streaming = streamingAliasMigration.normalizeChannelConfig({ cfg: accountKeys.config });
	const transport = migrateLegacySignalTransportConfigSync(streaming.config);
	return {
		config: transport.config,
		changes: [
			...accountKeys.changes,
			...streaming.changes,
			...transport.changes
		],
		...transport.warnings?.length ? { warnings: transport.warnings } : {}
	};
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
