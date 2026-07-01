import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { a as getWindowsSystem32ExePath, o as getWindowsWmicExePath, r as getWindowsPowerShellExePath } from "./windows-install-roots-C10Fw_vo.js";
import { t as parseCmdScriptCommandLine } from "./cmd-argv-DYSpLFnE.js";
import { spawnSync } from "node:child_process";
//#region src/infra/gateway-process-argv.ts
function normalizeProcArg(arg) {
	return normalizeLowercaseStringOrEmpty(arg.replaceAll("\\", "/"));
}
function parseProcCmdline(raw) {
	return normalizeStringEntries(raw.split("\0"));
}
function isGatewayArgv(args, opts) {
	const normalized = args.map(normalizeProcArg);
	if (!normalized.includes("gateway")) return false;
	const entryCandidates = [
		"dist/index.js",
		"dist/entry.js",
		"openclaw.mjs",
		"scripts/run-node.mjs",
		"src/entry.ts",
		"src/index.ts"
	];
	if (normalized.some((arg) => entryCandidates.some((entry) => arg.endsWith(entry)))) return true;
	const exe = (normalized[0] ?? "").replace(/\.(bat|cmd|exe)$/i, "");
	return exe.endsWith("/openclaw") || exe === "openclaw" || opts?.allowGatewayBinary === true && exe.endsWith("/openclaw-gateway");
}
//#endregion
//#region src/infra/windows-port-pids.ts
const DEFAULT_TIMEOUT_MS = 5e3;
function readListeningPidsViaPowerShell(port, timeoutMs) {
	const ps = spawnSync(getWindowsPowerShellExePath(), [
		"-NoProfile",
		"-Command",
		`(Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess)`
	], {
		encoding: "utf8",
		timeout: timeoutMs,
		windowsHide: true
	});
	if (ps.error || ps.status !== 0) return null;
	return ps.stdout.split(/\r?\n/).flatMap((line) => parseStrictPositiveInteger(line.trim()) ?? []);
}
function parseListeningPidsFromNetstat(stdout, port) {
	const pids = /* @__PURE__ */ new Set();
	for (const line of stdout.split(/\r?\n/)) {
		const match = line.match(/^\s*TCP\s+(\S+):(\d+)\s+\S+\s+LISTENING\s+(\d+)\s*$/i);
		if (!match) continue;
		const parsedPort = Number.parseInt(match[2] ?? "", 10);
		const pid = Number.parseInt(match[3] ?? "", 10);
		if (parsedPort === port && Number.isFinite(pid) && pid > 0) pids.add(pid);
	}
	return [...pids];
}
function readWindowsListeningPidsOnPortSync(port, timeoutMs = DEFAULT_TIMEOUT_MS) {
	const result = readWindowsListeningPidsResultSync(port, timeoutMs);
	return result.ok ? result.pids : [];
}
function readWindowsListeningPidsResultSync(port, timeoutMs = DEFAULT_TIMEOUT_MS) {
	const powershellPids = readListeningPidsViaPowerShell(port, timeoutMs);
	if (powershellPids != null) return {
		ok: true,
		pids: powershellPids
	};
	const netstat = spawnSync(getWindowsSystem32ExePath("netstat.exe"), [
		"-ano",
		"-p",
		"tcp"
	], {
		encoding: "utf8",
		timeout: timeoutMs,
		windowsHide: true
	});
	if (netstat.error) {
		const code = netstat.error.code;
		return {
			ok: false,
			permanent: code === "ENOENT" || code === "EACCES" || code === "EPERM"
		};
	}
	if (netstat.status !== 0) return {
		ok: false,
		permanent: false
	};
	return {
		ok: true,
		pids: parseListeningPidsFromNetstat(netstat.stdout, port)
	};
}
function decodeWindowsProcessOutput(output) {
	if (!Buffer.isBuffer(output)) return output;
	return output.length >= 2 && output[0] === 255 && output[1] === 254 ? output.toString("utf16le") : output.toString("utf8");
}
function extractWindowsCommandLine(raw) {
	const lines = normalizeStringEntries(decodeWindowsProcessOutput(raw).split(/\r?\n/));
	for (const line of lines) {
		if (!normalizeLowercaseStringOrEmpty(line).startsWith("commandline=")) continue;
		return line.slice(12).trim() || null;
	}
	return lines.find((line) => normalizeLowercaseStringOrEmpty(line) !== "commandline") ?? null;
}
function readWindowsProcessArgsSync(pid, timeoutMs = DEFAULT_TIMEOUT_MS) {
	const result = readWindowsProcessArgsResultSync(pid, timeoutMs);
	return result.ok ? result.args : null;
}
function readWindowsProcessArgsResultSync(pid, timeoutMs = DEFAULT_TIMEOUT_MS) {
	const powershell = spawnSync(getWindowsPowerShellExePath(), [
		"-NoProfile",
		"-Command",
		`(Get-CimInstance Win32_Process -Filter "ProcessId = ${pid}" | Select-Object -ExpandProperty CommandLine)`
	], {
		encoding: "utf8",
		timeout: timeoutMs,
		windowsHide: true
	});
	if (!powershell.error && powershell.status === 0) {
		const command = powershell.stdout.trim();
		return {
			ok: true,
			args: command ? parseCmdScriptCommandLine(command) : null
		};
	}
	const wmic = spawnSync(getWindowsWmicExePath(), [
		"process",
		"where",
		`ProcessId=${pid}`,
		"get",
		"CommandLine",
		"/value"
	], {
		timeout: timeoutMs,
		windowsHide: true,
		stdio: [
			"ignore",
			"pipe",
			"ignore"
		]
	});
	if (!wmic.error && wmic.status === 0) {
		const command = extractWindowsCommandLine(wmic.stdout);
		return {
			ok: true,
			args: command ? parseCmdScriptCommandLine(command) : null
		};
	}
	const code = (wmic.error ?? powershell.error)?.code;
	return {
		ok: false,
		permanent: code === "ENOENT" || code === "EACCES" || code === "EPERM"
	};
}
//#endregion
export { isGatewayArgv as a, readWindowsProcessArgsSync as i, readWindowsListeningPidsResultSync as n, parseProcCmdline as o, readWindowsProcessArgsResultSync as r, readWindowsListeningPidsOnPortSync as t };
