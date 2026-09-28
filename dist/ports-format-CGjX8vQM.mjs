import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { n as parseTcpListenerEndpoint } from "./ports-netstat-D4bISZ36.mjs";
import net from "node:net";
//#region src/infra/ports-format.ts
/** Classifies a listener as OpenClaw Gateway, SSH tunnel, known non-gateway, or unknown. */
function classifyPortListener(listener, _port) {
	const command = normalizeLowercaseStringOrEmpty(listener.command ?? "");
	const commandLine = normalizeLowercaseStringOrEmpty(listener.commandLine ?? "");
	if (command === "socat" || command === "socat1" || command === "socat.exe") return "non_gateway";
	if (`${commandLine} ${command}`.includes("openclaw")) return "gateway";
	const hasSshCommand = /(?:^|[/\\])ssh(?:\.exe)?$/.test(command);
	const hasSshExecutable = hasSshCommand || /(?:^|[\s"'])(?:(?:"[^"]*[/\\])|(?:'[^']*[/\\])|(?:\S*[/\\]))?ssh(?:\.exe)?(?:[\s"']|$)/.test(commandLine);
	if (hasSshCommand) return "ssh";
	if (hasSshExecutable) return "ssh";
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
	if (listeners.some((listener) => classifyPortListener(listener, port) !== "gateway")) return null;
	return parsePortListeners(listeners, port);
}
/** Returns true for one Gateway process represented by separate IPv4 and IPv6 loopback rows. */
function isDualStackLoopbackGatewayListeners(listeners, port) {
	if (listeners.length < 2) return false;
	const parsed = parseGatewayListeners(listeners, port);
	if (!parsed) return false;
	return parsedListenersAreDualStackLoopback(parsed);
}
function parsedListenersAreDualStackLoopback(parsed) {
	const pids = new Set(parsed.map(({ pid }) => pid));
	const families = new Set(parsed.map(({ host }) => classifyLoopbackAddressFamily(host)));
	return pids.size === 1 && !families.has(null) && families.has("ipv4") && families.has("ipv6");
}
function parsedListenersOwnSpecificIpv4WithLoopback(parsed) {
	return parsed.every(({ pid }) => pid === parsed[0]?.pid) && parsed.some(({ host }) => host === "127.0.0.1") && parsed.some(({ host }) => host !== "127.0.0.1" && net.isIP(host) === 4 && !isWildcardAddress(host));
}
/** Checks one PID owns an expected IPv4 interface and canonical loopback. */
function isSameProcessSpecificIpv4WithLoopbackListeners(listeners, port, expectedSpecificHost) {
	if (listeners.length !== 2) return false;
	const parsed = parsePortListeners(listeners, port);
	return Boolean(parsed && parsedListenersOwnSpecificIpv4WithLoopback(parsed) && parsed.some(({ host }) => host === expectedSpecificHost));
}
/** Returns true when listener rows describe a benign Gateway bind pattern. */
function isExpectedGatewayListeners(listeners, port) {
	const parsed = parseGatewayListeners(listeners, port);
	if (!parsed) return false;
	if (parsed.length === 1) return Boolean(parsed[0] && isExpectedGatewayBindAddress(parsed[0].host));
	return parsedListenersAreDualStackLoopback(parsed) || parsed.length === 2 && parsedListenersOwnSpecificIpv4WithLoopback(parsed);
}
/** Builds user-facing remediation hints for processes occupying a port. */
function buildPortHints(listeners, port) {
	if (listeners.length === 0) return [];
	const kinds = new Set(listeners.map((listener) => classifyPortListener(listener, port)));
	const hints = [];
	const expectedGatewayListeners = isExpectedGatewayListeners(listeners, port);
	if (kinds.has("gateway") && !expectedGatewayListeners) hints.push(`Gateway already running locally. Stop it (${formatCliCommand("openclaw gateway stop")}) or use a different port.`);
	if (kinds.has("ssh")) hints.push("SSH tunnel already bound to this port. Close the tunnel or use a different local port in -L.");
	if (kinds.has("unknown") || kinds.has("non_gateway")) hints.push("Another process is listening on this port.");
	if (listeners.length > 1 && !expectedGatewayListeners) hints.push("Multiple listeners detected; ensure only one gateway/tunnel per port unless intentionally running isolated profiles.");
	return hints;
}
/** Formats one listener row for CLI diagnostics. */
function formatPortListener(listener) {
	return `${listener.pid ? `pid ${listener.pid}` : "pid ?"}${listener.user ? ` ${listener.user}` : ""}: ${listener.commandLine || listener.command || "unknown"}${listener.address ? ` (${listener.address})` : ""}`;
}
/** Formats port diagnostics into CLI output lines. */
function formatPortDiagnostics(diagnostics) {
	if (diagnostics.status === "free") return [`Port ${diagnostics.port} is free.`];
	if (diagnostics.status === "unknown") return [`Port ${diagnostics.port} availability could not be determined.`];
	const lines = [`Port ${diagnostics.port} is already in use.`];
	for (const listener of diagnostics.listeners) lines.push(`- ${formatPortListener(listener)}`);
	for (const hint of diagnostics.hints) lines.push(`- ${hint}`);
	return lines;
}
//#endregion
export { isExpectedGatewayListeners as a, isDualStackLoopbackGatewayListeners as i, classifyPortListener as n, isSameProcessSpecificIpv4WithLoopbackListeners as o, formatPortDiagnostics as r, buildPortHints as t };
