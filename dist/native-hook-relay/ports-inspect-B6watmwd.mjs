import { g as normalizeLowercaseStringOrEmpty, u as parseStrictPositiveInteger } from "./number-coercion-CmpLVzZ6.mjs";
import { n as resolveDiagnosticProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { a as getWindowsSystem32ExePath, o as getWindowsWmicExePath, r as getWindowsPowerShellExePath } from "./windows-install-roots-DqZZsEhJ.mjs";
import { t as runCommandWithTimeout } from "./exec-B7W00oZE.mjs";
import { a as parseTcpEndpoint, i as buildPortHints, o as parseTcpListenerEndpoint, s as parseWindowsNetstatListeners, t as probePortUsage } from "./ports-probe-CXbhZtRc.mjs";
import fsSync from "node:fs";
import "node:os";
import fs from "node:fs/promises";
import net from "node:net";
import pMap from "p-map";
//#region src/infra/ports-lsof-listeners.ts
function parseLsofListenerFieldRecords(output) {
	const records = [];
	let processFields = {};
	let processLines = [];
	let fileLines = [];
	for (const rawLine of output.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line) continue;
		if (line.startsWith("p")) {
			const pid = parseStrictPositiveInteger(line.slice(1));
			processFields = pid !== void 0 ? { pid } : {};
			processLines = [line];
			fileLines = [];
			continue;
		}
		if (line.startsWith("c")) {
			processFields.command = line.slice(1);
			processLines.push(line);
			continue;
		}
		if (line.startsWith("f")) {
			fileLines = [line];
			continue;
		}
		if (line.startsWith("n")) {
			records.push({
				listener: {
					...processFields,
					address: line.slice(1)
				},
				detail: [
					...processLines,
					...fileLines,
					line
				].join("\n")
			});
			fileLines = [];
		}
	}
	return records;
}
function parseLsofListenerPort(address) {
	const normalized = address?.replace(/^tcp\s+/i, "").replace(/\s*\([^)]*\)\s*$/i, "").trim();
	if (!normalized || normalized.includes("->")) return null;
	return parseTcpEndpoint(normalized)?.port ?? null;
}
function parseLsofListenerRecordsByPort(output) {
	const recordsByPort = /* @__PURE__ */ new Map();
	for (const record of parseLsofListenerFieldRecords(output)) {
		const port = parseLsofListenerPort(record.listener.address);
		if (port === null) continue;
		const records = recordsByPort.get(port) ?? [];
		records.push(record);
		recordsByPort.set(port, records);
	}
	return recordsByPort;
}
function listenerIdentity(listener) {
	return `${listener.pid ?? ""}\0${listener.command ?? ""}\0${listener.address ?? ""}`;
}
function readLsofListenersForPort(recordsByPort, port) {
	const records = recordsByPort.get(port) ?? [];
	const seen = /* @__PURE__ */ new Set();
	const listeners = [];
	const detailLines = [];
	for (const record of records) {
		const key = listenerIdentity(record.listener);
		if (seen.has(key)) continue;
		seen.add(key);
		listeners.push(record.listener);
		detailLines.push(record.detail);
	}
	return {
		listeners,
		detail: detailLines.join("\n") || void 0
	};
}
//#endregion
//#region src/infra/ports-lsof.ts
const LSOF_CANDIDATES = process.platform === "darwin" ? ["/usr/sbin/lsof", "/usr/bin/lsof"] : ["/usr/bin/lsof", "/usr/sbin/lsof"];
async function canExecute(path) {
	try {
		await fs.access(path, fsSync.constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
async function resolveLsofCommand(signal) {
	for (const candidate of LSOF_CANDIDATES) {
		signal?.throwIfAborted();
		const executable = await canExecute(candidate);
		signal?.throwIfAborted();
		if (executable) return candidate;
	}
	return "lsof";
}
//#endregion
//#region src/infra/ports-inspect.ts
const PORT_PROCESS_ENRICHMENT_CONCURRENCY = 20;
async function runCommandSafe(argv, signal) {
	signal?.throwIfAborted();
	try {
		const res = await runCommandWithTimeout(argv, {
			timeoutMs: 5e3,
			baseEnv: resolveDiagnosticProcessEnv(),
			...signal ? { signal } : {}
		});
		signal?.throwIfAborted();
		return {
			stdout: res.stdout,
			stderr: res.stderr,
			code: res.code ?? 1
		};
	} catch (err) {
		signal?.throwIfAborted();
		return {
			stdout: "",
			stderr: "",
			code: 1,
			error: String(err)
		};
	}
}
function* parseSsRows(output) {
	for (const rawLine of output.split(/\r?\n/)) {
		const line = rawLine.trim();
		const processIndex = line.indexOf("users:");
		const socketFields = (processIndex < 0 ? line : line.slice(0, processIndex)).trim().split(/\s+/);
		const [local, remote] = socketFields.slice(-2);
		if (!local || !remote) continue;
		const processText = processIndex < 0 ? "" : line.slice(processIndex);
		const pid = Number.parseInt(processText.match(/pid=(\d+)/)?.[1] ?? "", 10);
		const command = processText.match(/users:\(\("([^"]+)"/)?.[1];
		yield {
			local,
			remote,
			listening: socketFields.includes("LISTEN"),
			process: {
				...Number.isFinite(pid) ? { pid } : {},
				...command ? { command } : {}
			}
		};
	}
}
async function enrichUnixListenerProcessInfo(listeners, signal) {
	const pids = [...new Set(listeners.flatMap(({ pid }) => pid ? [pid] : []))];
	const metadata = new Map(await pMap(pids, async (pid) => [pid, await resolveUnixProcessInfo(pid, signal)], {
		concurrency: PORT_PROCESS_ENRICHMENT_CONCURRENCY,
		signal
	}));
	for (const listener of listeners) if (listener.pid) Object.assign(listener, metadata.get(listener.pid));
}
async function readUnixSocketOutput(argv, signal) {
	const res = await runCommandSafe(argv, signal);
	if (res.code === 0) return {
		stdout: res.stdout,
		errors: [],
		unavailable: false
	};
	const stderr = res.stderr.trim();
	if (res.code === 1 && !res.error && !stderr) return {
		errors: [],
		unavailable: false
	};
	const detail = [stderr, res.stdout.trim()].filter(Boolean).join("\n");
	return {
		errors: [...res.error ? [res.error] : [], ...detail ? [detail] : []],
		unavailable: true
	};
}
async function readUnixSocketEntries(argv, parse, signal) {
	const result = await readUnixSocketOutput(argv, signal);
	return {
		entries: result.stdout === void 0 ? [] : parse(result.stdout),
		detail: result.stdout?.trim() || void 0,
		errors: result.errors,
		unavailable: result.unavailable
	};
}
async function resolveUnixProcessInfo(pid, signal) {
	const res = await runCommandSafe([
		"ps",
		"-p",
		String(pid),
		"-ww",
		"-o",
		"ppid=",
		"-o",
		"command="
	], signal);
	const userResult = await runCommandSafe([
		"ps",
		"-p",
		String(pid),
		"-o",
		"user="
	], signal);
	const fields = res.code === 0 ? /^\s*(\S+)(?:\s+([\s\S]*))?$/.exec(res.stdout) : null;
	const parentPid = Number.parseInt(fields?.[1] ?? "", 10);
	const commandLine = fields?.[2]?.trim();
	const user = userResult.code === 0 ? userResult.stdout.trim() : "";
	return {
		...user ? { user } : {},
		...commandLine ? { commandLine } : {},
		...Number.isFinite(parentPid) && parentPid > 0 ? { ppid: parentPid } : {}
	};
}
function parseSsListeners(output, port) {
	const listeners = [];
	for (const row of parseSsRows(output)) if (row.listening && parseTcpEndpoint(row.local)?.port === port) listeners.push({
		...row.process,
		address: row.local
	});
	return listeners;
}
async function readUnixListenerSnapshot(port, signal) {
	const result = await readUnixSocketOutput([
		await resolveLsofCommand(signal),
		"-nP",
		port === void 0 ? "-iTCP" : `-iTCP:${port}`,
		"-sTCP:LISTEN",
		"-FpFcn"
	], signal);
	return {
		recordsByPort: result.stdout === void 0 ? /* @__PURE__ */ new Map() : parseLsofListenerRecordsByPort(result.stdout),
		errors: result.errors,
		lsofUnavailable: result.unavailable
	};
}
async function readUnixListeners(port, snapshot, signal) {
	const listenerSnapshot = snapshot ?? await readUnixListenerSnapshot(port, signal);
	if (!listenerSnapshot.lsofUnavailable) {
		const { listeners, detail } = readLsofListenersForPort(listenerSnapshot.recordsByPort, port);
		return {
			entries: listeners,
			detail,
			errors: listenerSnapshot.errors
		};
	}
	const fallback = await readUnixSocketEntries([
		"ss",
		"-H",
		"-ltnp",
		`sport = :${port}`
	], (output) => parseSsListeners(output, port), signal);
	return {
		entries: fallback.entries,
		detail: fallback.entries.length > 0 ? fallback.detail : void 0,
		errors: fallback.entries.length > 0 ? fallback.errors : [...listenerSnapshot.errors, ...fallback.errors]
	};
}
async function resolveWindowsImageName(pid, signal) {
	signal?.throwIfAborted();
	const res = await runCommandSafe([
		getWindowsSystem32ExePath("tasklist.exe"),
		"/FI",
		`PID eq ${pid}`,
		"/FO",
		"CSV",
		"/NH"
	], signal);
	if (res.code !== 0) return;
	for (const rawLine of res.stdout.split(/\r?\n/)) {
		const match = rawLine.trim().match(/^"([^"]+)","(\d+)",/);
		if (match?.[1] && match[2] === String(pid)) return match[1];
	}
}
async function resolveWindowsCommandLine(pid, signal) {
	signal?.throwIfAborted();
	const powershell = await runCommandSafe([
		getWindowsPowerShellExePath(),
		"-NoProfile",
		"-Command",
		`(Get-CimInstance Win32_Process -Filter "ProcessId = ${pid}" | Select-Object -ExpandProperty CommandLine)`
	], signal);
	if (powershell.code === 0) {
		const value = powershell.stdout.trim();
		if (value) return value;
	}
	const wmic = await runCommandSafe([
		getWindowsWmicExePath(),
		"process",
		"where",
		`ProcessId=${pid}`,
		"get",
		"CommandLine",
		"/value"
	], signal);
	if (wmic.code !== 0) return;
	for (const rawLine of wmic.stdout.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!normalizeLowercaseStringOrEmpty(line).startsWith("commandline=")) continue;
		return line.slice(12).trim() || void 0;
	}
}
async function readWindowsNetstatEntries(port, parse, signal) {
	signal?.throwIfAborted();
	const errors = [];
	const res = await runCommandSafe([getWindowsSystem32ExePath("netstat.exe"), "-ano"], signal);
	if (res.code !== 0) {
		if (res.error) errors.push(res.error);
		const detail = [res.stderr.trim(), res.stdout.trim()].filter(Boolean).join("\n");
		if (detail) errors.push(detail);
		return {
			entries: [],
			errors
		};
	}
	const entries = parse(res.stdout, port);
	await pMap(entries, async (entry) => {
		if (!entry.pid) return;
		const [imageName, commandLine] = await Promise.all([resolveWindowsImageName(entry.pid, signal), resolveWindowsCommandLine(entry.pid, signal)]);
		if (imageName) entry.command = imageName;
		if (commandLine) entry.commandLine = commandLine;
	}, {
		concurrency: PORT_PROCESS_ENRICHMENT_CONCURRENCY,
		signal
	});
	return {
		entries,
		detail: res.stdout.trim() || void 0,
		errors
	};
}
async function inspectPortUsage(port, options) {
	const signal = options?.signal;
	signal?.throwIfAborted();
	const result = process.platform === "win32" ? await readWindowsNetstatEntries(port, parseWindowsNetstatListeners, signal) : await readUnixListeners(port, void 0, signal);
	if (process.platform !== "win32") await enrichUnixListenerProcessInfo(result.entries, signal);
	return buildPortUsage(port, result, options?.probeHosts, signal);
}
async function buildPortUsage(port, result, probeHosts, signal) {
	signal?.throwIfAborted();
	let listeners = result.entries;
	const status = probeHosts ? await probePortUsage(port, probeHosts, signal) : listeners.length > 0 ? "busy" : await probePortUsage(port, void 0, signal);
	signal?.throwIfAborted();
	if (status !== "busy") listeners = [];
	else if (probeHosts) listeners = listeners.filter((listener) => isListenerRelevantToProbeHosts(listener, port, probeHosts));
	const hints = buildPortHints(listeners, port);
	if (status === "busy" && listeners.length === 0) hints.push("Port is in use but process details are unavailable (install lsof or run as an admin user).");
	return {
		port,
		status,
		listeners,
		hints,
		detail: result.detail,
		errors: result.errors.length > 0 ? [...result.errors] : void 0
	};
}
function isWildcardTcpHost(host) {
	return host === "0.0.0.0" || host === "::" || host === "*";
}
function isSameTcpAddressFamily(leftHost, rightHost) {
	const leftFamily = net.isIP(leftHost);
	const rightFamily = net.isIP(rightHost);
	return leftFamily === 0 || rightFamily === 0 || leftFamily === rightFamily;
}
function isListenerRelevantToProbeHosts(listener, port, probeHosts) {
	const endpoint = parseTcpListenerEndpoint(listener.address);
	if (!endpoint || endpoint.port !== port) return false;
	return probeHosts.some((probeHost) => {
		const normalizedProbeHost = normalizeLowercaseStringOrEmpty(probeHost);
		if (isWildcardTcpHost(endpoint.host)) return isSameTcpAddressFamily(endpoint.host, normalizedProbeHost);
		if (isWildcardTcpHost(normalizedProbeHost)) return isSameTcpAddressFamily(normalizedProbeHost, endpoint.host);
		return normalizedProbeHost === endpoint.host;
	});
}
//#endregion
export { inspectPortUsage };
