import { at as expectDefined, ft as toErrorObject, k as isErrno } from "./redact-tYkqLD33.mjs";
import { M as normalizeLowercaseStringOrEmpty, T as parseStrictPositiveInteger } from "./utils-c2rFzEZe.mjs";
import "./errors-CvkendJg.mjs";
import { t as formatCliCommand } from "./command-format-UoyM2uu9.mjs";
import { s as parseWindowsNativeCommandLine, t as classifyOpenClawArgv } from "./gateway-process-argv-5BlLLUnW.mjs";
import net from "node:net";
//#region src/daemon/arg-split.ts
/** Splits service command strings while preserving quoted arguments across platform parsers. */
function splitArgsPreservingQuotes(value, options) {
	const args = [];
	let current = null;
	let quoteChar = null;
	const escapeMode = options?.escapeMode ?? "none";
	const quoteChars = new Set(options?.quoteChars ?? ["\""]);
	const quoteStart = options?.quoteStart ?? "anywhere";
	for (let i = 0; i < value.length; i++) {
		const char = value.charAt(i);
		if (char === "\\" && (escapeMode === "backslash" || escapeMode === "backslash-quote-only" && value[i + 1] === "\"")) {
			if (i + 1 < value.length) {
				current = (current ?? "") + value[i + 1];
				i++;
			}
			continue;
		}
		if (quoteChars.has(char)) {
			if (quoteChar === char) {
				quoteChar = null;
				continue;
			}
			if (!quoteChar && (quoteStart === "anywhere" || !current)) {
				quoteChar = char;
				current ??= "";
				continue;
			}
		}
		if (!quoteChar && /\s/.test(char)) {
			if (current !== null) {
				args.push(current);
				current = null;
			}
			continue;
		}
		current = (current ?? "") + char;
	}
	if (current !== null) args.push(current);
	return args;
}
//#endregion
//#region src/infra/ports-netstat.ts
function normalizeTcpHost(host) {
	const normalized = host.toLowerCase();
	return normalized.startsWith("::ffff:") ? normalized.slice(7) : normalized;
}
function parseTcpPort(raw) {
	if (!raw || !/^\d+$/.test(raw)) return null;
	const port = Number(raw);
	return Number.isSafeInteger(port) && port >= 0 && port <= 65535 ? port : null;
}
function parseTcpEndpoint(raw) {
	const match = /^(?:\[([^\]]+)\]|([\s\S]+)):(\d+)$/.exec(raw.trim());
	if (!match) return null;
	const port = parseTcpPort(match[3]);
	return port === null ? null : {
		host: normalizeTcpHost(expectDefined(match[1] ?? match[2], "bracket match capture group 1")),
		port
	};
}
/** Parses the address field emitted for a TCP listener by lsof or netstat. */
function parseTcpListenerEndpoint(raw) {
	const normalized = raw?.trim().replace(/^tcp6?\s+/i, "").replace(/\s*\(listen\)\s*$/i, "");
	return normalized ? parseTcpEndpoint(normalized) : null;
}
function isWildcardEndpoint(raw) {
	const endpoint = raw?.trim();
	if (!endpoint || endpoint === "*:*") return true;
	const parsed = parseTcpEndpoint(endpoint);
	if (!parsed) return false;
	return parsed.port === 0 && [
		"0.0.0.0",
		"::",
		"*"
	].includes(parsed.host);
}
function parseWindowsNetstatListeners(output, port) {
	const listeners = [];
	for (const rawLine of output.split(/\r?\n/)) {
		const parts = rawLine.trim().split(/\s+/);
		if (parts.length < 5 || parts[0]?.toUpperCase() !== "TCP") continue;
		const localAddress = parts[1];
		const remoteAddress = parts[2];
		if (!localAddress || parseTcpEndpoint(localAddress)?.port !== port) continue;
		if (!isWildcardEndpoint(remoteAddress)) continue;
		const pid = parseStrictPositiveInteger(parts.at(-1));
		if (pid === void 0) continue;
		listeners.push({
			pid,
			address: localAddress
		});
	}
	return listeners;
}
//#endregion
//#region src/infra/ports-format.ts
function classifyPortListener(listener) {
	const command = normalizeLowercaseStringOrEmpty(listener.command ?? "");
	const commandLine = normalizeLowercaseStringOrEmpty(listener.commandLine ?? "");
	if (command === "socat" || command === "socat1" || command === "socat.exe") return "non_gateway";
	const argv = listener.commandLine ? process.platform === "win32" ? parseWindowsNativeCommandLine(listener.commandLine) ?? [] : splitArgsPreservingQuotes(listener.commandLine, { escapeMode: "backslash-quote-only" }) : [listener.command ?? ""];
	if (classifyOpenClawArgv(argv, {
		command: "gateway",
		pid: listener.pid
	}).kind === "openclaw") return "gateway";
	if (/(?:^|[/\\])ssh(?:\.exe)?$/.test(command) || /(?:^|[\s"'])(?:(?:"[^"]*[/\\])|(?:'[^']*[/\\])|(?:\S*[/\\]))?ssh(?:\.exe)?(?:[\s"']|$)/.test(commandLine)) return "ssh";
	if (command === "sshd" || /(?:^|[/\\])sshd(?:\.exe)?$/.test(command) || /(?:^|[/\\])[^/\\\s]*ssh[^/\\\s]*(?:\.exe)?$/.test(command)) return "non_gateway";
	if (/(?:^|[/\\\s])[^/\\\s]*ssh[^/\\\s]*(?:\.exe)?(?:[/\\\s"']|$)/.test(commandLine)) return "non_gateway";
	return "unknown";
}
function classifyLoopbackAddressFamily(host) {
	if (host === "127.0.0.1" || host === "localhost") return "ipv4";
	if (host === "::1" || host === "::ffff:127.0.0.1") return "ipv6";
	return null;
}
function isWildcardAddress(host) {
	return host === "0.0.0.0" || host === "::" || host === "*";
}
function isExpectedGatewayBindAddress(host) {
	return classifyLoopbackAddressFamily(host) !== null || isWildcardAddress(host);
}
function parsePortListeners(listeners, port) {
	const parsedListeners = [];
	for (const listener of listeners) {
		const pid = listener.pid;
		if (typeof pid !== "number" || !Number.isFinite(pid) || typeof listener.address !== "string") return null;
		const address = parseTcpListenerEndpoint(listener.address);
		if (!address || address.port !== port) return null;
		parsedListeners.push({
			pid,
			host: address.host
		});
	}
	return parsedListeners;
}
function parseGatewayListeners(listeners, port) {
	if (listeners.some((listener) => classifyPortListener(listener) !== "gateway")) return null;
	return parsePortListeners(listeners, port);
}
function parsedListenersAreDualStackLoopback(parsed) {
	const pids = new Set(parsed.map(({ pid }) => pid));
	const families = new Set(parsed.map(({ host }) => classifyLoopbackAddressFamily(host)));
	return pids.size === 1 && !families.has(null) && families.has("ipv4") && families.has("ipv6");
}
function parsedListenersOwnSpecificIpv4WithLoopback(parsed) {
	return parsed.every(({ pid }) => pid === parsed[0]?.pid) && parsed.some(({ host }) => host === "127.0.0.1") && parsed.some(({ host }) => host !== "127.0.0.1" && net.isIP(host) === 4 && !isWildcardAddress(host));
}
function isExpectedGatewayListeners(listeners, port) {
	const parsed = parseGatewayListeners(listeners, port);
	if (!parsed) return false;
	if (parsed.length === 1) return Boolean(parsed[0] && isExpectedGatewayBindAddress(parsed[0].host));
	return parsedListenersAreDualStackLoopback(parsed) || parsed.length === 2 && parsedListenersOwnSpecificIpv4WithLoopback(parsed);
}
function buildPortHints(listeners, port) {
	if (listeners.length === 0) return [];
	const kinds = new Set(listeners.map((listener) => classifyPortListener(listener)));
	const hints = [];
	const expectedGatewayListeners = isExpectedGatewayListeners(listeners, port);
	if (kinds.has("gateway") && !expectedGatewayListeners) hints.push(`Gateway already running locally. Stop it (${formatCliCommand("openclaw gateway stop")}) or use a different port.`);
	if (kinds.has("ssh")) hints.push("SSH tunnel already bound to this port. Close the tunnel or use a different local port in -L.");
	if (kinds.has("unknown") || kinds.has("non_gateway")) hints.push("Another process is listening on this port.");
	if (listeners.length > 1 && !expectedGatewayListeners) hints.push("Multiple listeners detected; ensure only one gateway/tunnel per port unless intentionally running isolated profiles.");
	return hints;
}
//#endregion
//#region src/infra/ports-probe.ts
const PORT_PROBE_HOSTS = [
	"127.0.0.1",
	"0.0.0.0",
	"::1",
	"::"
];
async function tryListenOnPort(params) {
	if (params.signal?.aborted) throw params.signal.reason;
	const listenOptions = { port: params.port };
	if (params.host) listenOptions.host = params.host;
	if (typeof params.exclusive === "boolean") listenOptions.exclusive = params.exclusive;
	if (params.signal) listenOptions.signal = params.signal;
	return await new Promise((resolve, reject) => {
		const clearAbort = () => params.signal?.removeEventListener("abort", onAbort);
		const onAbort = () => {
			clearAbort();
			reject(toErrorObject(params.signal?.reason, "Port check aborted"));
		};
		params.signal?.addEventListener("abort", onAbort, { once: true });
		const tester = net.createServer().once("error", (error) => {
			clearAbort();
			reject(error);
		}).once("listening", () => {
			const address = tester.address();
			tester.close(() => {
				clearAbort();
				if (!address || typeof address === "string") reject(/* @__PURE__ */ new Error("expected TCP listener address"));
				else resolve(params.port === 0 ? address.port : void 0);
			});
		}).listen(listenOptions);
	});
}
/** Observe a listener without retaining its socket or cancellation hook. */
async function probeTcpListener(port, host, signal, deadlineMs) {
	signal?.throwIfAborted();
	const timeoutMs = deadlineMs === void 0 ? 250 : deadlineMs - Date.now();
	if (timeoutMs <= 0) return "unknown";
	return await new Promise((resolve) => {
		const socket = net.connect({
			host,
			port
		});
		let result = "unknown";
		const destroy = () => socket.destroy();
		signal?.addEventListener("abort", destroy, { once: true });
		socket.once("connect", () => {
			result = "busy";
			destroy();
		});
		socket.once("error", (error) => {
			result = isErrno(error) && error.code === "ECONNREFUSED" ? "free" : "unknown";
			destroy();
		});
		socket.setTimeout(timeoutMs, destroy);
		socket.once("close", () => {
			signal?.removeEventListener("abort", destroy);
			resolve(result);
		});
	});
}
async function isIpv6LoopbackUnavailable(signal) {
	try {
		await tryListenOnPort({
			port: 0,
			host: "::1",
			...signal ? { signal } : {}
		});
		return false;
	} catch (err) {
		return isErrno(err) && err.code === "EADDRNOTAVAIL";
	}
}
async function probePortOnHost(port, host, signal, deadlineMs) {
	try {
		await tryListenOnPort({
			port,
			host,
			exclusive: true,
			...signal ? { signal } : {}
		});
		const confirmed = await probeTcpListener(port, host, signal, deadlineMs);
		if (confirmed === "unknown" && host === "::" && await isIpv6LoopbackUnavailable(signal)) return "free";
		return confirmed;
	} catch (err) {
		signal?.throwIfAborted();
		if (isErrno(err) && err.code === "EADDRINUSE") return "busy";
		if (isErrno(err) && (err.code === "EADDRNOTAVAIL" || err.code === "EAFNOSUPPORT")) return "skip";
		return "unknown";
	}
}
/** Checks selected local addresses without resolving listener diagnostics. */
async function probePortUsage(port, probeHosts = PORT_PROBE_HOSTS, signal, deadlineMs) {
	signal?.throwIfAborted();
	let sawUnknown = false;
	for (const host of probeHosts) {
		const result = await probePortOnHost(port, host, signal, deadlineMs);
		signal?.throwIfAborted();
		if (result === "busy") return "busy";
		if (result === "unknown") sawUnknown = true;
	}
	return sawUnknown ? "unknown" : "free";
}
//#endregion
export { parseTcpEndpoint as a, buildPortHints as i, probeTcpListener as n, parseTcpListenerEndpoint as o, tryListenOnPort as r, parseWindowsNetstatListeners as s, probePortUsage as t };
