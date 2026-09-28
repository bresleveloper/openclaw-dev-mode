import { pathToFileURL } from "node:url";
import { normalizeAccountId, resolveAccountKey } from "openclaw/plugin-sdk/account-resolution";
import { isIP } from "node:net";
import path from "node:path";
//#region extensions/signal/src/account-selection.ts
function resolveSignalAccountKey(accounts, accountId) {
	return resolveAccountKey(accounts, normalizeAccountId(accountId), void 0, void 0, { channelId: "signal" });
}
function resolveSignalAccountEntry(accounts, accountId) {
	const key = resolveSignalAccountKey(accounts, accountId);
	return key === void 0 ? void 0 : accounts?.[key];
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
function buildSignalSocketUrl(socketPath) {
	return `unix://${pathToFileURL(socketPath).pathname}`;
}
//#endregion
export { normalizeSignalTransportUrl as a, normalizeSignalTransportHost as i, buildSignalSocketUrl as n, resolveSignalAccountEntry as o, buildSignalTransportHttpUrl as r, resolveSignalAccountKey as s, assertSignalSocketTransport as t };
