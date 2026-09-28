import { P as resolvePositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { i as WINDOWS_TASK_SUPERVISOR_FLAG, n as WINDOWS_TASK_LAUNCHER_ENV, t as WINDOWS_TASK_LAUNCHER_ACTIVE } from "./windows-task-supervisor-contract-DlaAkrWJ.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { m as resolveGatewayWindowsTaskName } from "./constants-CJCmIHb-.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as resolveServiceManagerEnv } from "./service-process-env-B2RAsQsF.mjs";
import { r as getWindowsPowerShellExePath, t as getWindowsCmdExePath } from "./windows-install-roots-DK9gNoYN.mjs";
import { a as resolveWindowsOemCodePage, o as resolveWindowsOemCodePageForEncoding, s as resolveWindowsOemEncoding } from "./windows-encoding-zGMz1ieM.mjs";
import { r as resolveGatewayTaskScriptPath } from "./paths-B1MX98Zs.mjs";
import { a as renderCmdSetAssignment, i as parseCmdSetAssignment, n as quoteCmdScriptArg, r as assertNoCmdLineBreak, t as parseCmdScriptCommandLine } from "./cmd-argv-Cqm1e4_m.mjs";
import { n as publishServiceFile } from "./service-stage-CuqWOVHS.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { spawnSync } from "node:child_process";
import os from "node:os";
import iconv from "iconv-lite";
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
function isAsciiOnly(value) {
	for (let index = 0; index < value.length; index += 1) if (value.charCodeAt(index) > 127) return false;
	return true;
}
/**
* wscript.exe reads .vbs only as ANSI or UTF-16 LE with BOM, and cmd.exe reads
* .cmd in the console (OEM) code page; plain UTF-8 garbles non-ASCII profile
* paths into "file not found" launch failures (#107416, #108774). Do not
* simplify back to utf8.
*/
function encodeWindowsLauncherScript(params) {
	if (params.format === "vbs") return Buffer.concat([UTF16LE_BOM, Buffer.from(params.content, "utf16le")]);
	if (isAsciiOnly(params.content)) {
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
//#region src/daemon/schtasks-state-probe.ts
/** Locale-independent Task Scheduler registration and runtime facts. */
function probeScheduledTaskState(taskName, timeoutMs) {
	const probeTimeoutMs = resolvePositiveTimerTimeoutMs(timeoutMs, 5e3);
	const script = [
		"$ErrorActionPreference='Stop'",
		`$taskName=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${Buffer.from(taskName, "utf8").toString("base64")}'))`,
		"$lookup=$false",
		"try { $service=New-Object -ComObject 'Schedule.Service'; $service.Connect(); $lookup=$true; $task=$service.GetFolder('\\').GetTask($taskName); $lookup=$false } catch { $exception=$_.Exception; while($null -ne $exception.InnerException){$exception=$exception.InnerException}; Write-Output $exception.HResult; if($lookup){exit 1}; exit 2 }",
		"$result=@{state=$null}",
		"try { $result.state=[int]$task.State } catch {}",
		"try { $enabled=$task.Enabled; if($enabled -is [bool]) { $result.enabled=$enabled } } catch {}",
		"try { $result.lastRunResult=[int]$task.LastTaskResult } catch {}",
		"try { $result.lastRunTime=$task.LastRunTime.ToUniversalTime().ToString('o', [Globalization.CultureInfo]::InvariantCulture) } catch {}",
		"$result | ConvertTo-Json -Compress; exit 0"
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
			timeoutMs: probeTimeoutMs
		};
		return {
			status: "unknown",
			detail: probe.error.message
		};
	}
	if (probe.status === 0) {
		let snapshot;
		try {
			snapshot = asOptionalRecord(JSON.parse(probe.stdout));
		} catch {}
		if (!snapshot) return {
			status: "unknown",
			detail: "Scheduled Task probe returned invalid JSON."
		};
		const { state, enabled, lastRunResult, lastRunTime } = snapshot;
		return {
			status: "found",
			state: typeof state === "number" && Number.isInteger(state) && state >= 0 && state <= 4 ? state : null,
			...typeof enabled === "boolean" ? { enabled } : {},
			...typeof lastRunResult === "number" && Number.isInteger(lastRunResult) ? { lastRunResult: String(lastRunResult) } : {},
			...typeof lastRunTime === "string" ? { lastRunTime } : {}
		};
	}
	const hresult = Number(probe.stdout.trim());
	return probe.status === 1 && (hresult === -2147024894 || hresult === -2147024893) ? { status: "missing" } : {
		status: "unknown",
		detail: `Scheduled Task probe failed (exit ${probe.status}): ${probe.stdout.trim() || probe.stderr.trim() || "no output from PowerShell."}`
	};
}
function probeScheduledTaskExists(taskName, timeoutMs) {
	const probe = probeScheduledTaskState(taskName, timeoutMs);
	return probe.status === "found" ? true : probe.status === "missing" ? false : null;
}
//#endregion
//#region src/daemon/schtasks-layout.ts
function resolveTaskName(env) {
	const override = env.OPENCLAW_WINDOWS_TASK_NAME?.trim();
	if (override) return override;
	return resolveGatewayWindowsTaskName(env.OPENCLAW_PROFILE);
}
const STDIN_NUL_REDIRECT = "< NUL";
function stripTrailingCmdRedirections(commandLine) {
	const tokens = [];
	for (let index = 0; index < commandLine.length;) {
		if (/[ \t]/.test(commandLine.charAt(index))) {
			index++;
			continue;
		}
		let start = index;
		const operator = commandLine[index];
		if (operator === ">" || operator === "<") {
			const previous = tokens.at(-1);
			if (previous && !previous.redirect && previous.end === index) {
				const word = commandLine.slice(previous.start, previous.end);
				if (/\d$/.test(word)) {
					if (!/^\d$/.test(word)) return commandLine;
					start = previous.start;
					tokens.pop();
				}
			}
			index++;
			let redirect = operator;
			if (operator === ">" && commandLine[index] === ">") {
				redirect = ">>";
				index++;
			}
			if (redirect === ">" && commandLine[index] === "&") {
				if (!/[0-9]/.test(commandLine[index + 1] ?? "")) return commandLine;
				redirect = ">&";
				index += 2;
			}
			tokens.push({
				start,
				end: index,
				redirect
			});
			continue;
		}
		let quoted = false;
		while (index < commandLine.length) {
			const char = commandLine.charAt(index);
			if (char === "\r" || char === "\n" || char === "\\" && commandLine[index + 1] === "\"" || char === "^" && (!quoted || commandLine[index + 1] === "\"")) return commandLine;
			if (char === "\"") quoted = !quoted;
			else if (!quoted) {
				if ("&|()".includes(char)) return commandLine;
				if (/[ \t<>]/.test(char)) break;
			}
			index++;
		}
		if (quoted) return commandLine;
		tokens.push({
			start,
			end: index
		});
	}
	const firstRedirect = tokens.findIndex((token) => token.redirect !== void 0);
	const firstToken = tokens[firstRedirect];
	if (!firstToken) return commandLine;
	for (let index = firstRedirect; index < tokens.length; index++) {
		const token = tokens[index];
		if (!token?.redirect) return commandLine;
		if (token.redirect === ">&") continue;
		const target = tokens[++index];
		if (!target || target.redirect) return commandLine;
		const value = commandLine.slice(target.start, target.end);
		if (value.includes("\"") && !/^"[^"]+"$/.test(value) || !value.includes("\"") && /[,;=%!]/.test(value) || token.redirect === "<" && !/^(?:NUL|"NUL")$/i.test(value)) return commandLine;
	}
	return commandLine.slice(0, firstToken.start);
}
function shouldFallbackToStartupEntry(params) {
	return params.code === 1 || /(?:access is denied|acceso denegado)/i.test(params.detail) || params.code === 124 || /schtasks timed out/i.test(params.detail) || /schtasks produced no output/i.test(params.detail);
}
function resolveTaskScriptPath(env) {
	return resolveGatewayTaskScriptPath(env);
}
function resolveWindowsStartupDir(env) {
	const appData = env.APPDATA?.trim();
	if (appData) return path.join(appData, "Microsoft", "Windows", "Start Menu", "Programs", "Startup");
	const home = env.USERPROFILE?.trim() || env.HOME?.trim();
	if (!home) throw new Error("Windows startup folder unavailable: APPDATA/USERPROFILE not set");
	return path.join(home, "AppData", "Roaming", "Microsoft", "Windows", "Start Menu", "Programs", "Startup");
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
function escapeXmlText(value) {
	return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function buildScheduledTaskXml(params) {
	const description = escapeXmlText(params.taskDescription);
	const command = escapeXmlText(params.launchPath);
	const principalLogon = params.taskUser ? `\n      <UserId>${escapeXmlText(params.taskUser)}</UserId>\n      <LogonType>InteractiveToken</LogonType>` : "\n      <GroupId>S-1-5-32-545</GroupId>";
	return `<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>${description}</Description>
  </RegistrationInfo>
  <Triggers>
    <LogonTrigger>
      <Enabled>true</Enabled>${params.taskUser ? `\n      <UserId>${escapeXmlText(params.taskUser)}</UserId>` : ""}
    </LogonTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">${principalLogon}
      <RunLevel>LeastPrivilege</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <AllowHardTerminate>true</AllowHardTerminate>
    <StartWhenAvailable>false</StartWhenAvailable>
    <RunOnlyIfNetworkAvailable>false</RunOnlyIfNetworkAvailable>
    <IdleSettings>
      <StopOnIdleEnd>false</StopOnIdleEnd>
      <RestartOnIdle>false</RestartOnIdle>
    </IdleSettings>
    <AllowStartOnDemand>true</AllowStartOnDemand>
    <Enabled>true</Enabled>
    <Hidden>false</Hidden>
    <RunOnlyIfIdle>false</RunOnlyIfIdle>
    <WakeToRun>false</WakeToRun>
    <ExecutionTimeLimit>PT0S</ExecutionTimeLimit>
    <RestartOnFailure>
      <Interval>PT1M</Interval>
      <Count>3</Count>
    </RestartOnFailure>
    <Priority>7</Priority>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>${command}</Command>
    </Exec>
  </Actions>
</Task>`;
}
async function writeTaskXmlTempFile(xml) {
	const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-task-xml-"));
	const xmlPath = path.join(tmpDir, "task.xml");
	const bom = Buffer.from([255, 254]);
	const body = Buffer.from(xml, "utf16le");
	await publishServiceFile({
		filePath: xmlPath,
		contents: Buffer.concat([bom, body]),
		mode: 384
	});
	return xmlPath;
}
function resolveTaskUser(env) {
	const username = env.USERNAME || env.USER || env.LOGNAME;
	if (!username) return null;
	if (username.includes("\\")) return username;
	const domain = env.USERDOMAIN;
	if (normalizeLowercaseStringOrEmpty(domain) === "workgroup") return username;
	if (domain) return `${domain}\\${username}`;
	return username;
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
async function readScheduledTaskCommand(env, options) {
	const scriptPath = resolveTaskScriptPath(env);
	try {
		const content = decodeWindowsLauncherScript({ buffer: await fs.readFile(scriptPath) });
		let workingDirectory = "";
		let commandLine = "";
		const environment = {};
		for (const rawLine of content.split(/\r?\n/)) {
			const line = rawLine.trim();
			if (!line) continue;
			const lower = normalizeLowercaseStringOrEmpty(line);
			if (line.startsWith("@echo") || lower.startsWith("rem ")) continue;
			if (lower.startsWith("set ")) {
				const assignment = parseCmdSetAssignment(rawLine.trimStart().slice(4), options?.requireEffective);
				if (!assignment && options?.requireEffective) throw new Error("Invalid Scheduled Task environment assignment");
				if (assignment) environment[assignment.key] = assignment.value;
				continue;
			}
			if (lower.startsWith("cd /d ")) {
				workingDirectory = line.slice(6).trim().replace(/^"|"$/g, "");
				continue;
			}
			commandLine = stripTrailingCmdRedirections(line);
			break;
		}
		if (!commandLine) throw new Error("Missing Scheduled Task command");
		const programArguments = parseCmdScriptCommandLine(commandLine).filter((argument) => argument !== WINDOWS_TASK_SUPERVISOR_FLAG);
		if (options?.requireEffective && programArguments.length === 0) throw new Error("Missing Scheduled Task command");
		const hasEnvironment = Object.keys(environment).length > 0;
		return {
			programArguments,
			...workingDirectory ? { workingDirectory } : {},
			...hasEnvironment ? { environment } : {},
			...hasEnvironment ? { environmentValueSources: Object.fromEntries(Object.keys(environment).map((key) => [key, "inline"])) } : {},
			sourcePath: scriptPath
		};
	} catch (error) {
		if (!options?.requireEffective) return null;
		if (hasErrnoCode(error, "ENOENT") && await isScheduledTaskDefinitionAbsent(env, options.timeoutMs).catch(() => false)) return null;
	}
	throw new Error("Effective Scheduled Task service command could not be inspected.");
}
async function isScheduledTaskDefinitionAbsent(env, timeoutMs) {
	if (probeScheduledTaskExists(resolveTaskName(env), timeoutMs) !== false) return false;
	for (const pathname of [resolveTaskScriptPath(env), ...resolveStartupEntryPaths(env)]) try {
		await fs.lstat(pathname);
		return false;
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) return false;
	}
	return true;
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
function renderStartupLaunchCommand(scriptPath) {
	return `start "" /min ${quoteCmdScriptArg(getWindowsCmdExePath())} /d /c ${quoteCmdScriptArg(scriptPath)}`;
}
function buildStartupLauncherScript(params) {
	const lines = ["@echo off"];
	const trimmedDescription = params.description?.trim();
	if (trimmedDescription) {
		assertNoCmdLineBreak(trimmedDescription, "Startup launcher description");
		lines.push(`rem ${trimmedDescription}`);
	}
	lines.push(renderStartupLaunchCommand(params.scriptPath));
	return `${lines.join("\r\n")}\r\n`;
}
function quoteVbsString(value) {
	return `"${value.replace(/"/g, "\"\"")}"`;
}
function quoteVbsRunCommand(scriptPath) {
	return quoteVbsString(`"${scriptPath}"`);
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
	lines.push(`WScript.Quit shell.Run(${quoteVbsRunCommand(params.scriptPath)}, 0, True)`);
	return `${lines.join("\r\n")}\r\n`;
}
//#endregion
export { probeScheduledTaskState as _, quoteSchtasksArg as a, resolveStartupEntryPaths as c, resolveTaskScriptPath as d, resolveTaskUser as f, probeScheduledTaskExists as g, writeTaskXmlTempFile as h, buildTaskScript as i, resolveTaskLauncherScriptPath as l, shouldUseHiddenWindowsTaskLauncher as m, buildScheduledTaskXml as n, readScheduledTaskCommand as o, shouldFallbackToStartupEntry as p, buildStartupLauncherScript as r, resolveStartupEntryPath as s, buildHiddenLauncherScript as t, resolveTaskName as u, decodeWindowsLauncherScript as v, encodeWindowsLauncherScript as y };
