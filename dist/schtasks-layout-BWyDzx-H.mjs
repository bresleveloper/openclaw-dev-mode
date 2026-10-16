import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { P as resolvePositiveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { i as WINDOWS_TASK_SUPERVISOR_FLAG, n as WINDOWS_TASK_LAUNCHER_ENV, t as WINDOWS_TASK_LAUNCHER_ACTIVE } from "./windows-task-supervisor-contract-DlaAkrWJ.mjs";
import { g as resolveGatewayWindowsTaskName, l as normalizeWindowsTaskIdentity } from "./constants-BLghGsId.mjs";
import { n as normalizeProfileName } from "./profile-utils-BsmgdpgZ.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as resolveEnvironmentValue } from "./process-env-DlZFJzq6.mjs";
import { n as isErrno, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { t as splitArgsPreservingQuotes } from "./arg-split-CR3xkHmb.mjs";
import { a as parseCmdSetAssignment, i as assertNoCmdLineBreak, n as quoteCmdScriptArg, o as renderCmdSetAssignment, r as stripTrailingCmdRedirections, t as parseCmdScriptCommandLine } from "./cmd-argv-jQQXbWaH.mjs";
import { r as resolveGatewayTaskScriptPath } from "./paths-DMJOvLwv.mjs";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-DoGHpXtD.mjs";
import { r as getWindowsPowerShellExePath, t as getWindowsCmdExePath } from "./windows-install-roots-Qi4d52Il.mjs";
import { a as resolveWindowsOemCodePage, o as resolveWindowsOemCodePageForEncoding, s as resolveWindowsOemEncoding } from "./windows-encoding-DWwh5Rcp.mjs";
import { t as resolveServiceManagerEnv } from "./service-process-env-C6isS50W.mjs";
import { r as ServiceInspectionError } from "./service-inspection-error-Bsltcpi4.mjs";
import { n as GATEWAY_SERVICE_STOP_TIMEOUT_MS } from "./gateway-shutdown-budget-v-vGFkEN.mjs";
import { t as WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS } from "./windows-powershell-spawn-DDmi3G9M.mjs";
import { n as resolveWindowsServiceCommandProfile } from "./service-env-merge-BU8q8IlG.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
import iconv from "iconv-lite";
//#region src/daemon/schtasks-state-probe.ts
/** Locale-independent Task Scheduler registration and runtime facts. */
var ScheduledTaskInspectionError = class extends ServiceInspectionError {
	constructor(probe) {
		super("windows-task-inspection-failed", probe.diagnostic);
		this.name = "ScheduledTaskInspectionError";
		this.timeoutMs = probe.diagnostic.kind === "timeout" ? probe.diagnostic.timeoutMs : void 0;
	}
};
const READ_TASK = [
	"function Read-Task($task) {",
	"$result=@{taskPath=[string]$task.Path;state=$null}",
	"try { $result.state=[int]$task.State } catch {}",
	"try { $enabled=$task.Enabled; if($enabled -is [bool]) { $result.enabled=$enabled } } catch {}",
	"try { $result.lastRunResult=[int]$task.LastTaskResult } catch {}",
	"try { $result.lastRunTime=$task.LastRunTime.ToUniversalTime().ToString('o', [Globalization.CultureInfo]::InvariantCulture) } catch {}",
	"try { $result.actions=@(foreach($action in $task.Definition.Actions) { if([int]$action.Type -eq 0) { @{type=0;path=[string]$action.Path;arguments=[string]$action.Arguments;workingDirectory=[string]$action.WorkingDirectory} } else { @{type=[int]$action.Type;path='';arguments='';workingDirectory=''} } }) } catch {}",
	"$result }"
].join("; ");
function queryTaskScheduler(taskName, timeoutMs) {
	if (timeoutMs !== void 0 && (!Number.isFinite(timeoutMs) || timeoutMs < 1)) return {
		status: "unknown",
		detail: "Scheduled Task inspection deadline expired.",
		timeoutMs: 0,
		diagnostic: {
			kind: "timeout",
			timeoutMs: 0
		}
	};
	const probeTimeoutMs = resolvePositiveTimerTimeoutMs(timeoutMs, WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS);
	const script = [
		"$ErrorActionPreference='Stop'",
		"[Console]::OutputEncoding=[Text.UTF8Encoding]::new($false)",
		`$taskName=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${Buffer.from(taskName ?? "", "utf8").toString("base64")}'))`,
		"$lookup=$false",
		READ_TASK,
		"try { $service=New-Object -ComObject 'Schedule.Service'; $service.Connect() } catch { Write-Output $_.Exception.HResult; exit 2 }",
		taskName === void 0 ? "function Read-Folder($folder) { foreach($task in $folder.GetTasks(1)) { Read-Task $task }; foreach($child in $folder.GetFolders(0)) { Read-Folder $child } }; try { $tasks=@(Read-Folder ($service.GetFolder('\\'))); ConvertTo-Json -InputObject $tasks -Depth 4 -Compress; exit 0 } catch { Write-Output $_.Exception.HResult; exit 2 }" : "try { $lookup=$true; $task=$service.GetFolder('\\').GetTask($taskName); $lookup=$false; Read-Task $task | ConvertTo-Json -Depth 4 -Compress; exit 0 } catch { $exception=$_.Exception; while($null -ne $exception.InnerException){$exception=$exception.InnerException}; Write-Output $exception.HResult; if($lookup){exit 1}; exit 2 }"
	].join("; ");
	const probe = spawnSync(getWindowsPowerShellExePath(), [
		"-NoProfile",
		"-NonInteractive",
		"-EncodedCommand",
		Buffer.from(script, "utf16le").toString("base64")
	], {
		env: resolveServiceManagerEnv(),
		encoding: "utf8",
		timeout: probeTimeoutMs,
		windowsHide: false
	});
	if (probe.error) {
		if (hasErrnoCode(probe.error, "ETIMEDOUT")) return {
			status: "unknown",
			detail: `Scheduled Task probe timed out after ${probeTimeoutMs} ms (ETIMEDOUT).`,
			timeoutMs: probeTimeoutMs,
			diagnostic: {
				kind: "timeout",
				timeoutMs: probeTimeoutMs
			}
		};
		return {
			status: "unknown",
			detail: probe.error.message,
			diagnostic: {
				kind: "spawn",
				...isErrno(probe.error) && typeof probe.error.errno === "number" && Number.isSafeInteger(probe.error.errno) ? { errno: probe.error.errno } : {}
			}
		};
	}
	if (probe.status === 0) {
		try {
			return {
				status: "ok",
				value: JSON.parse(probe.stdout)
			};
		} catch {}
		return {
			status: "unknown",
			detail: "Scheduled Task probe returned invalid JSON.",
			diagnostic: { kind: "invalid-response" }
		};
	}
	const hresult = Number(probe.stdout.trim());
	return probe.status === 1 && (hresult === -2147024894 || hresult === -2147024893) ? { status: "missing" } : {
		status: "unknown",
		detail: `Scheduled Task probe failed (exit ${probe.status}): ${probe.stdout.trim() || probe.stderr.trim() || "no output from PowerShell."}`,
		diagnostic: {
			kind: "native",
			exitCode: probe.status,
			.../^-?\d+$/.test(probe.stdout.trim()) && Number.isInteger(hresult) && hresult >= -2147483648 && hresult <= 2147483647 ? { hresult } : {}
		}
	};
}
function readTaskSnapshot(value) {
	const snapshot = asOptionalRecord(value);
	if (!snapshot) return;
	const { taskPath, actions, state, enabled, lastRunResult, lastRunTime } = snapshot;
	let parsedActions;
	if (Array.isArray(actions)) {
		parsedActions = [];
		for (const rawAction of actions) {
			const { type, path, arguments: args, workingDirectory } = asOptionalRecord(rawAction) ?? {};
			if (typeof type !== "number" || typeof path !== "string" || typeof args !== "string" || typeof workingDirectory !== "string") {
				parsedActions = void 0;
				break;
			}
			parsedActions.push({
				type,
				path,
				arguments: args,
				workingDirectory
			});
		}
	}
	return {
		...typeof taskPath === "string" && taskPath ? { taskPath } : {},
		...parsedActions ? { actions: parsedActions } : {},
		state: typeof state === "number" && Number.isInteger(state) && state >= 0 && state <= 4 ? state : null,
		...typeof enabled === "boolean" ? { enabled } : {},
		...typeof lastRunResult === "number" && Number.isInteger(lastRunResult) ? { lastRunResult: String(lastRunResult) } : {},
		...typeof lastRunTime === "string" ? { lastRunTime } : {}
	};
}
function probeScheduledTaskState(taskName, timeoutMs) {
	const result = queryTaskScheduler(taskName, timeoutMs);
	if (result.status !== "ok") return result;
	const snapshot = readTaskSnapshot(result.value);
	return snapshot ? {
		status: "found",
		...snapshot
	} : {
		status: "unknown",
		detail: "Scheduled Task probe returned invalid JSON.",
		diagnostic: { kind: "invalid-response" }
	};
}
async function isScheduledTaskDefinitionAbsent({ taskName, resolveDefinitionPaths, deadline }) {
	const remainingTimeout = () => deadline === void 0 ? void 0 : deadline - performance.now();
	const expired = () => deadline !== void 0 && performance.now() >= deadline;
	if (expired()) return false;
	const probe = probeScheduledTaskState(taskName, remainingTimeout());
	if (probe.status === "unknown") throw new ScheduledTaskInspectionError(probe);
	if (probe.status !== "missing" || expired()) return false;
	for (const pathname of resolveDefinitionPaths()) {
		if (expired()) return false;
		if (await awaitWithinDeadline(async () => {
			try {
				await fs.lstat(pathname);
				return false;
			} catch (error) {
				return hasErrnoCode(error, "ENOENT");
			}
		}, deadline, () => performance.now()) !== true) return false;
	}
	if (expired()) return false;
	const current = probeScheduledTaskState(taskName, remainingTimeout());
	if (current.status === "unknown") throw new ScheduledTaskInspectionError(current);
	return current.status === "missing" && !expired();
}
function listScheduledTasks(timeoutMs) {
	const result = queryTaskScheduler(void 0, timeoutMs);
	if (result.status === "ok" && Array.isArray(result.value)) {
		const tasks = result.value.map(readTaskSnapshot);
		if (tasks.every((task) => task?.taskPath)) return tasks.filter((task) => task !== void 0);
	}
	if (result.status === "unknown") throw new ScheduledTaskInspectionError(result);
	throw new Error("Scheduled Task inventory could not be inspected.");
}
function probeScheduledTaskExists(taskName, timeoutMs) {
	const probe = probeScheduledTaskState(taskName, timeoutMs);
	return probe.status === "found" ? true : probe.status === "missing" ? false : null;
}
/** Freeze the task run before stop so failed inspection cannot imply replacement. */
function prepareScheduledTaskSettlement(taskName) {
	const initial = probeScheduledTaskState(taskName);
	const runTime = initial.status === "found" ? initial.lastRunTime : void 0;
	if (!runTime) throw new Error(`Task ${taskName} identity unavailable; Gateway preserved.`);
	return async (assertCurrent, end) => {
		let ended = false;
		const deadline = Date.now() + GATEWAY_SERVICE_STOP_TIMEOUT_MS;
		for (;;) {
			const remaining = Math.max(1, deadline - Date.now());
			const task = probeScheduledTaskState(taskName, Math.min(WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS, remaining));
			assertCurrent();
			if (task.status === "found" && task.lastRunTime) {
				if (task.lastRunTime !== runTime) return {
					status: "replaced",
					taskName,
					ended,
					lastRunTime: task.lastRunTime
				};
				const { state, lastRunResult } = task;
				if ((state === 1 || state === 3) && lastRunResult !== void 0) return {
					status: "settled",
					taskName,
					lastRunResult,
					ended
				};
				if ((state === 2 || state === 4) && Date.now() >= deadline - (ended ? 0 : 135e3)) {
					if (ended || Date.now() >= deadline) throw new Error(`Task ${taskName} did not settle; /Run refused.`);
					await end();
					ended = true;
				}
			}
			if (Date.now() >= deadline) return {
				status: "unavailable",
				taskName,
				ended
			};
			await sleep(Math.min(100, deadline - Date.now()));
		}
	};
}
//#endregion
//#region src/infra/windows-launcher-encoding.ts
/** Encodes and decodes generated Windows launcher scripts (`.cmd` / `.vbs`). */
const UTF16LE_BOM = Buffer.from([255, 254]);
const WHATWG_VERIFIABLE_ENCODINGS = /* @__PURE__ */ new Set([
	"gbk",
	"big5",
	"shift_jis",
	"windows-874"
]);
const LAUNCHER_ENCODING_MARKER_PREFIX = "@rem openclaw-launcher-encoding=";
const LAUNCHER_ENCODING_MARKER_RE = /^@rem openclaw-launcher-encoding=(\S+)\s*$/;
const LAUNCHER_CODEPAGE_PREAMBLE_RE = /^@chcp \d+ >nul\s*$/;
/**
* wscript.exe reads .vbs only as ANSI or UTF-16 LE with BOM, and cmd.exe reads
* .cmd in the console (OEM) code page; plain UTF-8 garbles non-ASCII profile
* paths into "file not found" launch failures (#107416, #108774). Do not
* simplify back to utf8.
*/
function encodeWindowsLauncherScript(params) {
	if (params.format === "vbs") return Buffer.concat([UTF16LE_BOM, Buffer.from(params.content, "utf16le")]);
	if (!/[^\p{ASCII}]/u.test(params.content)) {
		if (process.platform === "win32") {
			const codePage = resolveWindowsOemCodePage();
			if (codePage === null || codePage === 864) throw new Error("Windows cmd launcher script cannot be written safely because the Windows OEM code page is unavailable or remaps ASCII syntax.");
		}
		return Buffer.from(params.content, "utf8");
	}
	const encoding = resolveWindowsOemEncoding();
	if (!encoding || !iconv.encodingExists(encoding)) throw new Error("Windows cmd launcher script contains non-ASCII content, but the Windows OEM code page is unavailable or unsupported; writing UTF-8 would make cmd.exe misread the script. Switch Windows to UTF-8 (code page 65001) or remove the non-ASCII content.");
	const codePage = resolveWindowsOemCodePageForEncoding(encoding);
	if (codePage === null) return Buffer.from(params.content, "utf8");
	const marked = `@chcp ${codePage} >nul\r\n${LAUNCHER_ENCODING_MARKER_PREFIX}${encoding}\r\n${params.content}`;
	const encoded = iconv.encode(marked, encoding);
	const decoded = WHATWG_VERIFIABLE_ENCODINGS.has(encoding) ? new TextDecoder(encoding).decode(encoded) : iconv.decode(encoded, encoding);
	const windowsWouldPrecompose = encoding === "windows-1258" && decoded.normalize("NFC") !== decoded;
	if (decoded !== marked || windowsWouldPrecompose) throw new Error(`Windows ${params.format} launcher script contains characters that cannot be represented in the Windows console code page (${encoding}); cmd.exe would misread the script. Remove those characters or switch Windows to UTF-8 (code page 65001).`);
	return encoded;
}
/** Decodes launcher scripts written by any OpenClaw version (UTF-16 LE BOM, marked code page, or UTF-8). */
function decodeWindowsLauncherScript(params) {
	const { buffer } = params;
	if (buffer.length >= 2 && buffer[0] === 255 && buffer[1] === 254) return buffer.subarray(2).toString("utf16le");
	let markerStart = 0;
	let newlineIndex = buffer.indexOf(10);
	if (newlineIndex !== -1 && LAUNCHER_CODEPAGE_PREAMBLE_RE.test(buffer.subarray(0, newlineIndex).toString("latin1"))) {
		markerStart = newlineIndex + 1;
		newlineIndex = buffer.indexOf(10, markerStart);
	}
	if (newlineIndex !== -1) {
		const marker = LAUNCHER_ENCODING_MARKER_RE.exec(buffer.subarray(markerStart, newlineIndex).toString("latin1"));
		if (marker?.[1] && iconv.encodingExists(marker[1])) return iconv.decode(buffer.subarray(newlineIndex + 1), marker[1]);
	}
	return buffer.toString("utf8");
}
//#endregion
//#region src/daemon/schtasks-inspection-deadline.ts
function assertTaskInspectionDeadline(deadline) {
	if (deadline !== void 0 && (!Number.isFinite(deadline) || performance.now() >= deadline)) throw new ScheduledTaskInspectionError({
		status: "unknown",
		detail: "Scheduled Task inspection deadline expired.",
		timeoutMs: 0,
		diagnostic: {
			kind: "timeout",
			timeoutMs: 0
		}
	});
}
async function readTaskFile(filePath, deadline) {
	assertTaskInspectionDeadline(deadline);
	if (deadline === void 0) return decodeWindowsLauncherScript({ buffer: await fs.readFile(filePath) });
	const controller = new AbortController();
	try {
		const buffer = await awaitWithinDeadline(() => fs.readFile(filePath, { signal: controller.signal }), deadline, () => performance.now());
		assertTaskInspectionDeadline(deadline);
		if (buffer === ABSOLUTE_DEADLINE_EXPIRED) throw new Error("Scheduled Task file inspection deadline expired.");
		return decodeWindowsLauncherScript({ buffer });
	} finally {
		controller.abort();
	}
}
//#endregion
//#region src/daemon/schtasks-layout.ts
function resolveTaskName(env) {
	const override = env.OPENCLAW_WINDOWS_TASK_NAME?.trim();
	if (override) return override;
	return resolveGatewayWindowsTaskName(env.OPENCLAW_PROFILE);
}
const STDIN_NUL_REDIRECT = "< NUL";
function shouldFallbackToStartupEntry(params) {
	return params.code === 1 || /(?:access is denied|acceso denegado)/i.test(params.detail) || params.code === 124 || /schtasks timed out/i.test(params.detail) || /schtasks produced no output/i.test(params.detail);
}
function resolveWindowsStartupDir(env) {
	let appData = env.APPDATA?.trim();
	if (!appData) {
		const home = env.USERPROFILE?.trim() || env.HOME?.trim();
		if (!home) throw new Error("Windows startup folder unavailable: APPDATA/USERPROFILE not set");
		appData = path.join(home, "AppData", "Roaming");
	}
	return path.join(appData, "Microsoft", "Windows", "Start Menu", "Programs", "Startup");
}
function sanitizeWindowsFilename(value) {
	return value.replace(/[<>:"/\\|?*]/g, "_").replace(/\p{Cc}/gu, "_");
}
function resolveStartupEntryPath(env, extension) {
	const taskName = resolveTaskName(env);
	const entryExtension = extension ?? (shouldUseHiddenWindowsTaskLauncher(env) ? "vbs" : "cmd");
	return path.join(resolveWindowsStartupDir(env), `${sanitizeWindowsFilename(taskName)}.${entryExtension}`);
}
function resolveStartupEntryPaths(env) {
	const primaryPath = resolveStartupEntryPath(env);
	const legacyCmdPath = resolveStartupEntryPath(env, "cmd");
	const hiddenLauncherPath = resolveStartupEntryPath(env, "vbs");
	return uniqueStrings([
		primaryPath,
		legacyCmdPath,
		hiddenLauncherPath
	]);
}
function quoteSchtasksArg(value) {
	if (!/[ \t"]/g.test(value)) return value;
	return `"${value.replace(/"/g, "\\\"")}"`;
}
function shouldUseHiddenWindowsTaskLauncher(env) {
	const value = normalizeLowercaseStringOrEmpty(env.OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER);
	return value === "1" || value === "true" || value === "yes";
}
function resolveTaskLauncherScriptPath(env, scriptPath) {
	if (!shouldUseHiddenWindowsTaskLauncher(env)) return scriptPath;
	const parsed = path.parse(scriptPath);
	return path.join(parsed.dir, `${parsed.name}.vbs`);
}
function assertStaticTaskPath(value) {
	if (!/^(?:[a-z]:[\\/]|\\\\)/i.test(value) || /[%\r\n"]/.test(value)) throw new Error("Scheduled Task launcher path is not absolute and literal");
}
async function readTaskLauncher(launcherPath, onLauncherContent, startup = false, deadline) {
	assertTaskInspectionDeadline(deadline);
	assertStaticTaskPath(launcherPath);
	if (/\.cmd$/i.test(launcherPath) && !startup) return { scriptPath: launcherPath };
	if (!/\.(?:vbs|cmd)$/i.test(launcherPath)) throw new Error("Unsupported Scheduled Task action");
	const content = await readTaskFile(launcherPath, deadline);
	onLauncherContent?.(content, launcherPath);
	const cmd = /\.cmd$/i.test(launcherPath);
	const lines = content.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !(cmd ? /^rem /i.test(line) : line.startsWith("'")));
	if (cmd && lines[0]?.toLowerCase() === "@echo off") lines.shift();
	const body = lines.join("\n");
	if (cmd) {
		const args = parseCmdScriptCommandLine(/^start "" \/min (.+)$/i.exec(body)?.[1] ?? "");
		const scriptPath = args[3];
		if (args.length !== 4 || ![getWindowsCmdExePath().toLowerCase(), "cmd.exe"].includes(args[0]?.toLowerCase() ?? "") || args[1]?.toLowerCase() !== "/d" || args[2]?.toLowerCase() !== "/c" || !scriptPath || !/\.cmd$/i.test(scriptPath) || stripTrailingCmdRedirections(body) !== body) throw new Error("Unrecognized Startup launcher");
		assertStaticTaskPath(scriptPath);
		return {
			scriptPath,
			content
		};
	}
	const current = /^Set shell = CreateObject\("WScript\.Shell"\)\n(?:shell\.Environment\("Process"\)\("OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER"\) = "wscript"\n)?WScript\.Quit shell\.Run\("((?:""|[^"])*)", 0, True\)$/i.exec(body);
	const synchronous = /^WScript\.Quit CreateObject\("WScript\.Shell"\)\.Run\("((?:""|[^"])*)", 0, True\)$/i.exec(body);
	const legacy = /^CreateObject\("WScript\.Shell"\)\.Run "((?:""|[^"])*)", 0, False$/i.exec(body);
	const quotedPath = (current ?? synchronous ?? legacy)?.[1]?.replaceAll("\"\"", "\"");
	if (!quotedPath || !/^"[^"]+\.cmd"$/i.test(quotedPath)) throw new Error("Unrecognized Scheduled Task launcher");
	const scriptPath = quotedPath.slice(1, -1);
	assertStaticTaskPath(scriptPath);
	return {
		scriptPath,
		content
	};
}
async function readTaskLaunchers(env, actionPath, onLauncherContent, deadline) {
	const launchers = [];
	for (const pathname of actionPath === void 0 ? resolveStartupEntryPaths(env) : [actionPath]) try {
		launchers.push({
			pathname,
			...await readTaskLauncher(pathname, onLauncherContent, actionPath === void 0, deadline)
		});
	} catch (error) {
		if (actionPath !== void 0 || !hasErrnoCode(error, "ENOENT")) throw error;
	}
	if (new Set(launchers.map(({ scriptPath }) => path.win32.normalize(scriptPath).toLowerCase())).size > 1) throw new Error("Startup launchers select different Gateway scripts");
	return launchers;
}
async function readScheduledTaskCommand(env, options) {
	return readWindowsTaskCommand({
		kind: "scheduled-task",
		env
	}, options);
}
async function readStartupEntryCommand(startupEntryPath, options) {
	const command = await readWindowsTaskCommand({
		kind: "startup-entry",
		path: startupEntryPath
	}, {
		...options,
		requireEffective: true
	});
	if (!command) throw new Error("Startup service command could not be inspected.");
	return command;
}
async function readWindowsTaskCommand(target, options) {
	const env = target.kind === "scheduled-task" ? target.env : {};
	const startupEntryPath = target.kind === "startup-entry" ? target.path : void 0;
	const requireEffective = options?.requireEffective || options?.requireLoaded;
	const timeoutDeadline = options?.timeoutMs === void 0 ? void 0 : performance.now() + options.timeoutMs;
	const deadline = options?.deadline === void 0 ? timeoutDeadline : timeoutDeadline === void 0 ? options.deadline : Math.min(options.deadline, timeoutDeadline);
	const remainingTimeout = () => deadline === void 0 ? void 0 : deadline - performance.now();
	const assertInspectionDeadline = () => assertTaskInspectionDeadline(deadline);
	try {
		assertInspectionDeadline();
		const taskName = resolveTaskName(env);
		const registered = target.kind === "scheduled-task" && options?.requireLoaded ? probeScheduledTaskState(taskName, remainingTimeout()) : void 0;
		if (registered?.status === "unknown") throw new ScheduledTaskInspectionError(registered);
		assertInspectionDeadline();
		const assertCommandProfile = (command) => {
			if (!registered || options?.profileScope === "registered") return;
			const profile = resolveWindowsServiceCommandProfile(command);
			if (profile.kind === "unavailable" || profile.profile !== (normalizeProfileName(resolveEnvironmentValue(env, "OPENCLAW_PROFILE", "win32")) ?? "default")) throw new Error("Scheduled Task selector changed during inspection");
		};
		const action = registered?.status === "found" ? registered.actions?.[0] : void 0;
		if (registered?.status === "found" && normalizeWindowsTaskIdentity(registered.taskPath ?? "") === normalizeWindowsTaskIdentity(taskName) && registered.actions && registered.actions.length > 1 && options?.onLauncherContent) for (const candidate of registered.actions) {
			if (candidate.type !== 0) continue;
			const argv = [candidate.path, ...splitArgsPreservingQuotes(candidate.arguments, { escapeMode: "backslash-quote-only" })];
			for (const pathname of argv.filter((arg) => /\.(?:bat|cmd|vbs)$/i.test(arg))) try {
				assertStaticTaskPath(pathname);
				const scriptPath = /\.bat$/i.test(pathname) ? pathname : (await readTaskLauncher(pathname, options.onLauncherContent, false, deadline)).scriptPath;
				options.onLauncherContent(await readTaskFile(scriptPath, deadline), scriptPath);
			} catch {
				assertInspectionDeadline();
			}
		}
		if (registered?.status === "found" && (!registered.taskPath || normalizeWindowsTaskIdentity(registered.taskPath) !== normalizeWindowsTaskIdentity(taskName) || registered.actions?.length !== 1 || action?.type !== 0)) throw new Error("Scheduled Task action cannot be inspected");
		if (action?.workingDirectory) assertStaticTaskPath(action.workingDirectory);
		const directExecutable = action && /\.exe$/i.test(action.path);
		if (action && !directExecutable && action.arguments.trim()) throw new Error("Scheduled Task launcher arguments cannot be inspected");
		const captureLaunchers = async (onContent) => startupEntryPath !== void 0 ? [{
			pathname: startupEntryPath,
			...await readTaskLauncher(startupEntryPath, onContent, true, deadline)
		}] : readTaskLaunchers(env, action?.path, onContent, deadline);
		const launchers = registered && !directExecutable || startupEntryPath !== void 0 ? await captureLaunchers(options?.onLauncherContent) : void 0;
		const assertRegistrationCurrent = async (source) => {
			if (!registered && !launchers) return;
			if (launchers && !isDeepStrictEqual(await captureLaunchers(), launchers) || source && await readTaskFile(source.path, deadline) !== source.content) throw new Error("Task launcher changed during inspection");
			assertInspectionDeadline();
			if (!registered) return;
			const current = probeScheduledTaskState(taskName, remainingTimeout());
			if (current.status === "unknown") throw new ScheduledTaskInspectionError(current);
			assertInspectionDeadline();
			if (current.status !== registered.status || registered.status === "found" && (current.status !== "found" || normalizeWindowsTaskIdentity(current.taskPath ?? "") !== normalizeWindowsTaskIdentity(registered.taskPath ?? "") || !isDeepStrictEqual(current.actions, registered.actions))) throw new Error("Scheduled Task registration changed during inspection");
		};
		if (directExecutable) {
			assertStaticTaskPath(action.path);
			const argumentsText = action.arguments.trim();
			if (/[%\r\n\0]|\\"/.test(argumentsText) || argumentsText && !/^(?:"[^"]+"|[^\s"]+)(?:[ \t]+(?:"[^"]+"|[^\s"]+))*$/.test(argumentsText)) throw new Error("Scheduled Task executable arguments cannot be inspected");
			await assertRegistrationCurrent();
			const command = {
				programArguments: [action.path, ...splitArgsPreservingQuotes(argumentsText)],
				...action.workingDirectory ? { workingDirectory: action.workingDirectory } : {}
			};
			assertCommandProfile(command);
			return command;
		}
		if (launchers?.length === 0) {
			await assertRegistrationCurrent();
			return null;
		}
		const scriptPath = launchers?.[0]?.scriptPath ?? resolveGatewayTaskScriptPath(env);
		const content = await readTaskFile(scriptPath, deadline);
		options?.onLauncherContent?.(content, scriptPath);
		let workingDirectory = action?.workingDirectory ?? "";
		let commandLine = "";
		const environment = {};
		for (const rawLine of content.split(/\r?\n/)) {
			const line = rawLine.trim();
			if (!line) continue;
			const lower = normalizeLowercaseStringOrEmpty(line);
			if (lower.startsWith("rem ")) continue;
			if (commandLine) {
				if (requireEffective) throw new Error("Multiple Scheduled Task launcher commands");
				break;
			}
			if (lower === "@echo off") continue;
			if (lower.startsWith("set ")) {
				const assignment = parseCmdSetAssignment(rawLine.trimStart().slice(4), requireEffective);
				if (!assignment && requireEffective) throw new Error("Invalid Scheduled Task environment assignment");
				if (assignment) environment[assignment.key] = assignment.value;
				continue;
			}
			if (requireEffective && /[%!]/.test(line.replace(/%%|\^!/g, ""))) throw new Error("Dynamic Scheduled Task launcher command");
			if (lower.startsWith("cd /d ")) {
				const cdArguments = parseCmdScriptCommandLine(line);
				if (requireEffective && (stripTrailingCmdRedirections(line) !== line || cdArguments.length !== 3)) throw new Error("Ambiguous Scheduled Task working directory");
				workingDirectory = cdArguments[2] ?? "";
				continue;
			}
			const parsedCommand = stripTrailingCmdRedirections(line);
			if (parsedCommand === null && requireEffective) throw new Error("Ambiguous Scheduled Task launcher command");
			commandLine = parsedCommand ?? line;
		}
		if (!commandLine) throw new Error("Missing Scheduled Task command");
		const programArguments = parseCmdScriptCommandLine(commandLine).filter((argument) => argument !== WINDOWS_TASK_SUPERVISOR_FLAG);
		if (requireEffective && programArguments.length === 0) throw new Error("Missing Scheduled Task command");
		await assertRegistrationCurrent({
			path: scriptPath,
			content
		});
		assertCommandProfile({
			programArguments,
			environment
		});
		if ((registered || startupEntryPath !== void 0) && (registered && environment.OPENCLAW_WINDOWS_TASK_NAME && normalizeWindowsTaskIdentity(environment.OPENCLAW_WINDOWS_TASK_NAME) !== normalizeWindowsTaskIdentity(taskName) || environment.OPENCLAW_TASK_SCRIPT && path.win32.normalize(environment.OPENCLAW_TASK_SCRIPT).toLowerCase() !== path.win32.normalize(scriptPath).toLowerCase())) throw new Error("Scheduled Task selector changed during inspection");
		return {
			programArguments,
			...workingDirectory ? { workingDirectory } : {},
			...Object.keys(environment).length > 0 ? {
				environment,
				environmentValueSources: Object.fromEntries(Object.keys(environment).map((key) => [key, "inline"]))
			} : {},
			sourcePath: scriptPath,
			...startupEntryPath !== void 0 ? { definitionPaths: [startupEntryPath, scriptPath] } : {},
			...registered?.status === "missing" && launchers ? { startupEntryPaths: launchers.map(({ pathname }) => pathname) } : {}
		};
	} catch (error) {
		if (error instanceof ServiceInspectionError) throw error;
		if (!requireEffective) return null;
		const remaining = deadline === void 0 ? void 0 : deadline - performance.now();
		if (target.kind === "scheduled-task" && hasErrnoCode(error, "ENOENT") && (remaining === void 0 || remaining > 0) && await isScheduledTaskDefinitionAbsent({
			taskName: resolveTaskName(env),
			resolveDefinitionPaths: () => [resolveGatewayTaskScriptPath(env), ...resolveStartupEntryPaths(env)],
			deadline
		}).catch((inspectionError) => {
			if (inspectionError instanceof ServiceInspectionError) throw inspectionError;
			return false;
		}) && (deadline === void 0 || performance.now() < deadline)) return null;
	}
	throw new Error(startupEntryPath !== void 0 ? "Startup service command could not be inspected." : "Effective Scheduled Task service command could not be inspected.");
}
function buildTaskScript({ description, programArguments, workingDirectory, environment }) {
	const lines = ["@echo off"];
	const trimmedDescription = description?.trim();
	if (trimmedDescription) {
		assertNoCmdLineBreak(trimmedDescription, "Task description");
		lines.push(`rem ${trimmedDescription}`);
	}
	if (workingDirectory) lines.push(`cd /d ${quoteCmdScriptArg(workingDirectory)}`);
	if (environment) for (const [key, value] of Object.entries(environment)) {
		if (value === void 0 || !value && key.toUpperCase() !== "NODE_OPTIONS" || key.toUpperCase() === "PATH" || key.toUpperCase() === "OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER") continue;
		lines.push(renderCmdSetAssignment(key, value));
	}
	const commandArguments = environment?.OPENCLAW_SERVICE_KIND === "gateway" ? [...programArguments, WINDOWS_TASK_SUPERVISOR_FLAG] : programArguments;
	lines.push(`${commandArguments.map((argument) => quoteCmdScriptArg(argument)).join(" ")} ${STDIN_NUL_REDIRECT}`);
	return `${lines.join("\r\n")}\r\n`;
}
function buildStartupLauncherScript(params) {
	const lines = ["@echo off"];
	const trimmedDescription = params.description?.trim();
	if (trimmedDescription) {
		assertNoCmdLineBreak(trimmedDescription, "Startup launcher description");
		lines.push(`rem ${trimmedDescription}`);
	}
	lines.push(`start "" /min ${quoteCmdScriptArg(getWindowsCmdExePath())} /d /c ${quoteCmdScriptArg(params.scriptPath)}`);
	return `${lines.join("\r\n")}\r\n`;
}
function quoteVbsString(value) {
	return `"${value.replace(/"/g, "\"\"")}"`;
}
function buildHiddenLauncherScript(params) {
	const lines = [];
	const trimmedDescription = params.description?.trim();
	if (trimmedDescription) {
		assertNoCmdLineBreak(trimmedDescription, "Hidden launcher description");
		lines.push(`' ${trimmedDescription}`);
	}
	lines.push("Set shell = CreateObject(\"WScript.Shell\")");
	if (params.taskSupervisor) lines.push(`shell.Environment("Process")("${WINDOWS_TASK_LAUNCHER_ENV}") = "${WINDOWS_TASK_LAUNCHER_ACTIVE}"`);
	lines.push(`WScript.Quit shell.Run(${quoteVbsString(`"${params.scriptPath}"`)}, 0, True)`);
	return `${lines.join("\r\n")}\r\n`;
}
//#endregion
export { listScheduledTasks as _, readScheduledTaskCommand as a, probeScheduledTaskState as b, resolveStartupEntryPaths as c, shouldFallbackToStartupEntry as d, shouldUseHiddenWindowsTaskLauncher as f, ScheduledTaskInspectionError as g, encodeWindowsLauncherScript as h, quoteSchtasksArg as i, resolveTaskLauncherScriptPath as l, decodeWindowsLauncherScript as m, buildStartupLauncherScript as n, readStartupEntryCommand as o, assertTaskInspectionDeadline as p, buildTaskScript as r, resolveStartupEntryPath as s, buildHiddenLauncherScript as t, resolveTaskName as u, prepareScheduledTaskSettlement as v, probeScheduledTaskExists as y };
