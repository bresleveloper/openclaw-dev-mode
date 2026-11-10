import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as splitArgsPreservingQuotes } from "./arg-split-B0qvCDwd.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { t as classifyOpenClawArgv } from "./gateway-process-argv-BLh8C227.mjs";
import { t as parseWindowsNativeCommandLine } from "./windows-command-line-BrVAurm9.mjs";
import { n as parseTcpListenerEndpoint } from "./ports-netstat-DLtHL75K.mjs";
import net from "node:net";
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
function isDualStackLoopbackGatewayListeners(listeners, port) {
	if (listeners.length < 2) return false;
	const parsed = parseGatewayListeners(listeners, port);
	return parsed !== null && parsedListenersAreDualStackLoopback(parsed);
}
function parsedListenersAreDualStackLoopback(parsed) {
	const pids = new Set(parsed.map(({ pid }) => pid));
	const families = new Set(parsed.map(({ host }) => classifyLoopbackAddressFamily(host)));
	return pids.size === 1 && !families.has(null) && families.has("ipv4") && families.has("ipv6");
}
function parsedListenersOwnSpecificIpv4WithLoopback(parsed) {
	return parsed.every(({ pid }) => pid === parsed[0]?.pid) && parsed.some(({ host }) => host === "127.0.0.1") && parsed.some(({ host }) => host !== "127.0.0.1" && net.isIP(host) === 4 && !isWildcardAddress(host));
}
function isSameProcessSpecificIpv4WithLoopbackListeners(listeners, port, expectedSpecificHost) {
	if (listeners.length !== 2) return false;
	const parsed = parsePortListeners(listeners, port);
	return Boolean(parsed && parsedListenersOwnSpecificIpv4WithLoopback(parsed) && parsed.some(({ host }) => host === expectedSpecificHost));
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
function formatPortDiagnostics(diagnostics) {
	if (diagnostics.status === "free") return [`Port ${diagnostics.port} is free.`];
	if (diagnostics.status === "unknown") return [`Port ${diagnostics.port} availability could not be determined.`];
	return [
		`Port ${diagnostics.port} is already in use.`,
		...diagnostics.listeners.map((listener) => {
			return `- ${listener.pid ? `pid ${listener.pid}` : "pid ?"}${listener.user ? ` ${listener.user}` : ""}: ${listener.commandLine || listener.command || "unknown"}${listener.address ? ` (${listener.address})` : ""}`;
		}),
		...diagnostics.hints.map((hint) => `- ${hint}`)
	];
}
//#endregion
export { isExpectedGatewayListeners as a, isDualStackLoopbackGatewayListeners as i, classifyPortListener as n, isSameProcessSpecificIpv4WithLoopbackListeners as o, formatPortDiagnostics as r, buildPortHints as t };
