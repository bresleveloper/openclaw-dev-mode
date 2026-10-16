import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { m as isRfc1918Ipv4Address } from "./ip-jvtZlu_y.mjs";
import { r as safeNetworkInterfaces, t as listExternalInterfaceAddresses } from "./network-interfaces-5_nTDEn5.mjs";
//#region src/infra/advertised-lan-host.ts
const DEFAULT_ROUTE_HINT_TIMEOUT_MS = 3e3;
const DEFAULT_ROUTE_HINT_OUTPUT_BYTES = 16384;
const WINDOWS_DEFAULT_ROUTE_COMMAND = "[Console]::OutputEncoding=[Text.UTF8Encoding]::new($false); Get-NetRoute -AddressFamily IPv4 -DestinationPrefix '0.0.0.0/0' | Select-Object -Property InterfaceAlias,RouteMetric,InterfaceMetric | ConvertTo-Json -Compress";
function normalizeMetric(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && value.trim()) {
		const parsed = Number.parseInt(value, 10);
		return Number.isFinite(parsed) ? parsed : 0;
	}
	return 0;
}
function parseWindowsDefaultRouteHints(stdout) {
	const trimmed = stdout.trim();
	if (!trimmed) return [];
	const parsed = safeParseJson(trimmed);
	const rankedRows = [];
	const rows = Array.isArray(parsed) ? parsed : [parsed];
	for (const [order, row] of rows.entries()) {
		if (!row || typeof row !== "object") continue;
		const route = row;
		const interfaceName = normalizeLowercaseStringOrEmpty(route.InterfaceAlias);
		if (interfaceName) {
			const routeMetric = normalizeMetric(route.RouteMetric);
			const interfaceMetric = normalizeMetric(route.InterfaceMetric);
			rankedRows.push({
				interfaceName,
				effectiveMetric: routeMetric + interfaceMetric,
				routeMetric,
				interfaceMetric,
				order
			});
		}
	}
	rankedRows.sort((a, b) => a.effectiveMetric - b.effectiveMetric || a.routeMetric - b.routeMetric || a.interfaceMetric - b.interfaceMetric || a.order - b.order);
	return rankedRows.map((row) => row.interfaceName);
}
function parseMacOsDefaultRouteHints(stdout) {
	const match = /^\s*interface:\s*(\S+)/m.exec(stdout);
	return match?.[1] ? [match[1]] : [];
}
function parseLinuxDefaultRouteHints(stdout) {
	const hints = [];
	for (const line of stdout.split(/\r?\n/)) {
		if (!line.startsWith("default ")) continue;
		const match = /\bdev\s+(\S+)/.exec(line);
		if (match?.[1]) hints.push(match[1]);
	}
	return hints;
}
async function resolveDefaultRouteHints(params) {
	let argv;
	let parse;
	if (params.platform === "win32") {
		argv = [
			"powershell.exe",
			"-NoProfile",
			"-ExecutionPolicy",
			"Bypass",
			"-Command",
			WINDOWS_DEFAULT_ROUTE_COMMAND
		];
		parse = parseWindowsDefaultRouteHints;
	} else if (params.platform === "darwin") {
		argv = [
			"route",
			"-n",
			"get",
			"default"
		];
		parse = parseMacOsDefaultRouteHints;
	} else if (params.platform === "linux") {
		argv = [
			"ip",
			"-4",
			"route",
			"show",
			"default"
		];
		parse = parseLinuxDefaultRouteHints;
	} else return [];
	let stdout;
	try {
		const runCommandWithTimeout = params.runCommandWithTimeout;
		const result = await runCommandWithTimeout(argv, {
			timeoutMs: params.timeoutMs,
			maxOutputBytes: DEFAULT_ROUTE_HINT_OUTPUT_BYTES
		});
		if (result.code !== 0) return [];
		stdout = result.stdout;
	} catch {
		return [];
	}
	return stdout ? parse(stdout) : [];
}
async function resolveAdvertisedLanHostCore(options = {}) {
	const candidates = listExternalInterfaceAddresses(safeNetworkInterfaces(options.networkInterfaces), "IPv4").filter((entry) => isRfc1918Ipv4Address(entry.address));
	if (candidates.length <= 1) return candidates[0]?.address ?? null;
	const routeHints = await resolveDefaultRouteHints({
		platform: options.platform ?? process.platform,
		runCommandWithTimeout: options.runCommandWithTimeout ?? runCommandWithTimeout,
		timeoutMs: options.timeoutMs ?? DEFAULT_ROUTE_HINT_TIMEOUT_MS
	});
	for (const hint of routeHints) {
		const hintedName = normalizeLowercaseStringOrEmpty(hint);
		if (!hintedName) continue;
		const routed = candidates.find((candidate) => normalizeLowercaseStringOrEmpty(candidate.name) === hintedName);
		if (routed) return routed.address;
	}
	return candidates[0]?.address ?? null;
}
//#endregion
export { resolveAdvertisedLanHostCore as t };
