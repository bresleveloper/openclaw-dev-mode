import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { l as resolveGatewayLaunchAgentLabel, m as resolveGatewayWindowsTaskName, p as resolveGatewaySystemdServiceName } from "./constants-CJCmIHb-.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { n as parseTcpPort, r as parseTcpPortFromArgs } from "./tcp-port-BVV_ljmK.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as cleanStaleGatewayProcessesSync } from "./restart-stale-pids-DjtzhbID.mjs";
import { t as getWindowsCmdExePath } from "./windows-install-roots-DK9gNoYN.mjs";
import { n as quoteCmdScriptArg } from "./cmd-argv-Cqm1e4_m.mjs";
import { n as renderCmdRestartLogSetup } from "./restart-logs-DcfskF2f.mjs";
import { d as resolveTaskScriptPath, y as encodeWindowsLauncherScript } from "./schtasks-layout-ZxN1sGLi.mjs";
import "./schtasks-D2U0K9JA.mjs";
import { t as resolveGatewayRestartDeferralTimeoutMs } from "./restart-budget-4VeKpJhh.mjs";
import { i as normalizeRestartIntentReason } from "./restart-intent-hiIYFAg0.mjs";
import { S as runWithGatewayIndependentRootWorkAdmission, a as getActiveGatewayRootWorkCount, n as beginGatewayRestartSignalAdmission, u as isGatewayRestartDraining, v as rollbackGatewayRestartSignalFence } from "./gateway-work-admission-CHv_0noy.mjs";
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import os from "node:os";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-reload-generation.ts
let currentReloadGeneration = 0;
let abortGeneration;
function nextGatewayReloadGeneration() {
	return ++currentReloadGeneration;
}
function isCurrentGatewayReloadGeneration(generation) {
	return generation === currentReloadGeneration;
}
function isGatewayReloadGenerationAborted(generation) {
	return abortGeneration !== void 0 && generation <= abortGeneration;
}
/** Signal any in-progress deferred channel reload to abort immediately. */
function abortPendingChannelReloads() {
	abortGeneration = currentReloadGeneration;
}
//#endregion
//#region src/infra/restart-request.ts
function summarizeChangedPaths(paths, maxPaths = 6) {
	if (!Array.isArray(paths) || paths.length === 0) return null;
	if (paths.length <= maxPaths) return paths.join(",");
	return `${paths.slice(0, maxPaths).join(",")},+${paths.length - maxPaths} more`;
}
function formatRestartAudit(audit) {
	const actor = typeof audit?.actor === "string" && audit.actor.trim() ? audit.actor.trim() : null;
	const deviceId = typeof audit?.deviceId === "string" && audit.deviceId.trim() ? audit.deviceId.trim() : null;
	const clientIp = typeof audit?.clientIp === "string" && audit.clientIp.trim() ? audit.clientIp.trim() : null;
	const changed = summarizeChangedPaths(audit?.changedPaths);
	const fields = [
		actor && `actor=${actor}`,
		deviceId && `device=${deviceId}`,
		clientIp && `ip=${clientIp}`,
		changed && `changedPaths=${changed}`
	].filter(Boolean);
	return fields.length > 0 ? fields.join(" ") : "actor=<unknown>";
}
function normalizeGatewayRestartDelayMs(delayMs) {
	return typeof delayMs === "number" && Number.isFinite(delayMs) ? Math.min(Math.max(Math.floor(delayMs), 0), 6e4) : 2e3;
}
/** Captures one admitted requester independently of best-effort restart preparation. */
var GatewayRestartRequest = class {
	#assertCurrent;
	#revoked = false;
	constructor(hooks) {
		this.hooks = hooks;
		this.#assertCurrent = hooks?.assertCurrent;
	}
	isCurrent() {
		if (this.#revoked) return false;
		try {
			this.#assertCurrent?.();
			return true;
		} catch {
			this.#revoked = true;
			return false;
		}
	}
};
/** One scheduled cycle retains all accepted requests but only one session's acknowledgement. */
var PendingGatewayRestart = class {
	#requests = [];
	admit(hooks) {
		const request = new GatewayRestartRequest(hooks);
		this.#requests.push(request);
		return request;
	}
	isCurrent() {
		return this.#requests.some((request) => request.isCurrent());
	}
	takeEmitHooks() {
		const request = this.emitHooks;
		this.emitHooks = void 0;
		return request;
	}
};
//#endregion
//#region src/infra/windows-task-restart.ts
const TASK_RESTART_WAIT_SECONDS = 180;
const TASK_RESTART_RETRY_LIMIT = 12;
const TASK_RESTART_RETRY_DELAY_SEC = 1;
function quotePowerShellSingleQuotedLiteral(value) {
	return `'${value.replace(/'/g, "''")}'`;
}
function resolveWindowsTaskName(env) {
	const override = env.OPENCLAW_WINDOWS_TASK_NAME?.trim();
	if (override) return override;
	return resolveGatewayWindowsTaskName(env.OPENCLAW_PROFILE);
}
function buildScheduledTaskRestartScript(params) {
	const { quotedLogPath, setupLines, taskName, taskScriptPath, port } = params;
	const quotedTaskName = quoteCmdScriptArg(taskName);
	const waitForExitCommand = [
		"$ErrorActionPreference = 'Stop'",
		`$old = Get-Process -Id ${process.pid} -ErrorAction SilentlyContinue`,
		`if ($null -ne $old -and -not $old.WaitForExit(${TASK_RESTART_WAIT_SECONDS * 1e3})) { Write-Output 'Outgoing Gateway did not exit within ${TASK_RESTART_WAIT_SECONDS}s'; exit 1 }`,
		"exit 0"
	].join("; ");
	const observeReplacementCommand = [
		"$ErrorActionPreference = 'Stop'",
		`$deadline = [DateTime]::UtcNow.AddSeconds(${TASK_RESTART_WAIT_SECONDS})`,
		`$entry = [regex]::Escape(${quotePowerShellSingleQuotedLiteral(params.entryPath)})`,
		"$boundary = '[\\s' + [char]34 + ']'",
		"do {",
		`$listeners = @(Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue)`,
		"foreach ($listener in $listeners) {",
		`if ($listener.OwningProcess -eq ${process.pid}) { continue }`,
		"$candidate = Get-CimInstance Win32_Process -Filter ('ProcessId = ' + $listener.OwningProcess)",
		`if ($candidate.ExecutablePath -eq ${quotePowerShellSingleQuotedLiteral(process.execPath)} -and $candidate.CommandLine -match ($boundary + $entry + $boundary) -and $candidate.CommandLine -match '(?:^|\\s)gateway(?:\\s|$)') {`,
		`Write-Output ('openclaw restart observed source=windows-task-handoff port=${port} pid=' + $listener.OwningProcess)`,
		"exit 0",
		"}",
		"}",
		"Start-Sleep -Seconds 1",
		"} while ([DateTime]::UtcNow -lt $deadline)",
		`Write-Output 'No matching replacement Gateway listener appeared within ${TASK_RESTART_WAIT_SECONDS}s'`,
		"exit 1"
	].join("; ");
	const lines = [
		"@echo off",
		"setlocal",
		...setupLines,
		`>> ${quotedLogPath} 2>&1 echo [%DATE% %TIME%] openclaw restart attempt source=windows-task-handoff target=${quotedTaskName} previousPid=${process.pid} port=${port}`,
		`powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command ${quoteCmdScriptArg(waitForExitCommand)} >> ${quotedLogPath} 2>&1`,
		"if errorlevel 1 goto failed",
		`schtasks /Query /TN ${quotedTaskName} >> ${quotedLogPath} 2>&1`,
		"if errorlevel 1 goto fallback",
		"set /a attempts=0",
		":retry",
		`timeout /t ${TASK_RESTART_RETRY_DELAY_SEC} /nobreak >nul`,
		"set /a attempts+=1",
		`schtasks /Run /TN ${quotedTaskName} >> ${quotedLogPath} 2>&1`,
		"if not errorlevel 1 goto verify",
		`if %attempts% GEQ ${TASK_RESTART_RETRY_LIMIT} goto fallback`,
		"goto retry",
		":fallback",
		`>> ${quotedLogPath} 2>&1 echo [%DATE% %TIME%] openclaw restart fallback source=windows-task-handoff`
	];
	if (taskScriptPath) {
		const quotedScript = quoteCmdScriptArg(taskScriptPath);
		const quotedCmd = quoteCmdScriptArg(getWindowsCmdExePath());
		lines.push(`if exist ${quotedScript} (`, `  start "" /min ${quotedCmd} /d /c ${quotedScript}`, ")");
	}
	lines.push(":verify", `powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command ${quoteCmdScriptArg(observeReplacementCommand)} >> ${quotedLogPath} 2>&1`, "if errorlevel 1 goto failed", `>> ${quotedLogPath} 2>&1 echo [%DATE% %TIME%] openclaw restart finished source=windows-task-handoff`, "goto cleanup", ":failed", `>> ${quotedLogPath} 2>&1 echo [%DATE% %TIME%] openclaw restart failed source=windows-task-handoff target=${quotedTaskName} previousPid=${process.pid} port=${port}. No replacement listener verified. Run from an external terminal: ${quoteCmdScriptArg(params.recoveryCommand)}`, ":cleanup", "del \"%~f0\" >nul 2>&1");
	return lines.join("\r\n");
}
function relaunchGatewayScheduledTask(env = process.env) {
	const taskName = resolveWindowsTaskName(env);
	const taskScriptPath = resolveTaskScriptPath(env);
	const scriptPath = path.join(resolvePreferredOpenClawTmpDir(), `openclaw-schtasks-restart-${randomUUID()}.cmd`);
	const quotedScriptPath = quoteCmdScriptArg(scriptPath);
	const restartLog = renderCmdRestartLogSetup({
		...process.env,
		...env
	});
	try {
		const port = parseTcpPortFromArgs(process.argv) ?? parseTcpPort(env.OPENCLAW_GATEWAY_PORT);
		const entryPath = process.argv[1];
		if (!port || !entryPath) throw new Error("Cannot identify the Gateway entrypoint and port for restart observation");
		fs.writeFileSync(scriptPath, encodeWindowsLauncherScript({
			format: "cmd",
			content: `${buildScheduledTaskRestartScript({
				quotedLogPath: restartLog.quotedLogPath,
				setupLines: restartLog.lines,
				taskName,
				taskScriptPath,
				port,
				entryPath,
				recoveryCommand: formatCliCommand("openclaw gateway restart --force", env)
			})}\r\n`
		}));
		const cmdExePath = getWindowsCmdExePath();
		spawn(cmdExePath, [
			"/d",
			"/s",
			"/c",
			quotedScriptPath
		], {
			detached: true,
			stdio: "ignore",
			windowsHide: true
		}).unref();
		return {
			ok: true,
			method: "schtasks",
			tried: [`schtasks /Run /TN "${taskName}"`, `${cmdExePath} /d /s /c ${quotedScriptPath}`]
		};
	} catch (err) {
		try {
			fs.unlinkSync(scriptPath);
		} catch {}
		return {
			ok: false,
			method: "schtasks",
			detail: formatErrorMessage(err),
			tried: [`schtasks /Run /TN "${taskName}"`]
		};
	}
}
//#endregion
//#region src/infra/restart-supervisor.ts
const SPAWN_TIMEOUT_MS = 2e3;
const LAUNCHCTL_ALREADY_LOADED_EXIT_CODE = 37;
function formatSpawnDetail(result) {
	const clean = (value) => {
		return (typeof value === "string" ? value : value ? value.toString() : "").replace(/\s+/g, " ").trim();
	};
	if (result.error) {
		if (result.error instanceof Error) return result.error.message;
		if (typeof result.error === "string") return result.error;
		try {
			return JSON.stringify(result.error);
		} catch {
			return "unknown error";
		}
	}
	return clean(result.stderr) || clean(result.stdout) || (typeof result.status === "number" ? `exit ${result.status}` : "unknown error");
}
function normalizeSystemdUnit(raw, profile) {
	const unit = raw?.trim();
	if (!unit) return `${resolveGatewaySystemdServiceName(profile)}.service`;
	return unit.endsWith(".service") ? unit : `${unit}.service`;
}
function restartGatewayViaSupervisor() {
	cleanStaleGatewayProcessesSync();
	const tried = [];
	if (process.platform === "linux") {
		const unit = normalizeSystemdUnit(process.env.OPENCLAW_SYSTEMD_UNIT, process.env.OPENCLAW_PROFILE);
		const userArgs = [
			"--user",
			"restart",
			unit
		];
		tried.push(`systemctl ${userArgs.join(" ")}`);
		const userRestart = spawnSync("systemctl", userArgs, {
			encoding: "utf8",
			timeout: SPAWN_TIMEOUT_MS
		});
		if (!userRestart.error && userRestart.status === 0) return {
			ok: true,
			method: "systemd",
			tried
		};
		const systemArgs = ["restart", unit];
		tried.push(`systemctl ${systemArgs.join(" ")}`);
		const systemRestart = spawnSync("systemctl", systemArgs, {
			encoding: "utf8",
			timeout: SPAWN_TIMEOUT_MS
		});
		if (!systemRestart.error && systemRestart.status === 0) return {
			ok: true,
			method: "systemd",
			tried
		};
		return {
			ok: false,
			method: "systemd",
			detail: [`user: ${formatSpawnDetail(userRestart)}`, `system: ${formatSpawnDetail(systemRestart)}`].join("; "),
			tried
		};
	}
	if (process.platform === "win32") return relaunchGatewayScheduledTask(process.env);
	if (process.platform !== "darwin") return {
		ok: false,
		method: "supervisor",
		detail: "unsupported platform restart"
	};
	const label = process.env.OPENCLAW_LAUNCHD_LABEL || resolveGatewayLaunchAgentLabel(process.env.OPENCLAW_PROFILE);
	const uid = typeof process.getuid === "function" ? process.getuid() : void 0;
	const domain = uid !== void 0 ? `gui/${uid}` : "gui/501";
	const target = `${domain}/${label}`;
	const args = [
		"kickstart",
		"-k",
		target
	];
	tried.push(`launchctl ${args.join(" ")}`);
	const res = spawnSync("launchctl", args, {
		encoding: "utf8",
		timeout: SPAWN_TIMEOUT_MS
	});
	if (!res.error && res.status === 0) return {
		ok: true,
		method: "launchctl",
		tried
	};
	const home = process.env.HOME?.trim() || os.homedir();
	const bootstrapArgs = [
		"bootstrap",
		domain,
		path.join(home, "Library", "LaunchAgents", `${label}.plist`)
	];
	tried.push(`launchctl ${bootstrapArgs.join(" ")}`);
	const boot = spawnSync("launchctl", bootstrapArgs, {
		encoding: "utf8",
		timeout: SPAWN_TIMEOUT_MS
	});
	if (boot.error || boot.status !== 0 && boot.status !== LAUNCHCTL_ALREADY_LOADED_EXIT_CODE && boot.status !== null) return {
		ok: false,
		method: "launchctl",
		detail: formatSpawnDetail(boot),
		tried
	};
	if (boot.status === 0) return {
		ok: true,
		method: "launchctl",
		tried
	};
	const retryArgs = ["kickstart", target];
	tried.push(`launchctl ${retryArgs.join(" ")}`);
	const retry = spawnSync("launchctl", retryArgs, {
		encoding: "utf8",
		timeout: SPAWN_TIMEOUT_MS
	});
	if (!retry.error && retry.status === 0) return {
		ok: true,
		method: "launchctl",
		tried
	};
	return {
		ok: false,
		method: "launchctl",
		detail: formatSpawnDetail(retry),
		tried
	};
}
//#endregion
//#region src/infra/restart.ts
const RESTART_AUTH_GRACE_MS = 5e3;
const DEFAULT_DEFERRAL_POLL_MS = 500;
const DEFAULT_DEFERRAL_STILL_PENDING_WARN_MS = 3e4;
const RESTART_COOLDOWN_MS = 3e4;
const restartLog = createSubsystemLogger("restart");
const monotonicNow = () => performance.now();
let restartAuthorizedCount = 0;
let restartAuthorizedUntil = 0;
let externalRestartAllowed = false;
let preRestartCheck = null;
let restartCycleToken = 0;
let emittedRestartToken = 0;
let consumedRestartToken = 0;
let emittedRestartReason;
let emittedRestartIntent;
let lastRestartEmittedAt = null;
let pendingRestartTimer = null;
let pendingRestartDueAt = 0;
let pendingRestartReason;
let pendingRestartSuccessorOwner;
let pendingRestartRequest;
let pendingRestartSkipDeferral = false;
let pendingRestartPreparing = false;
let pendingRestartSignalAdmission = null;
let restartTransientGeneration = 0;
const activeDeferralPolls = /* @__PURE__ */ new Set();
function shouldPreferRestartReason(next, current) {
	const isUpdateRestart = (reason) => reason === "update.run" || reason === "update.auto";
	return isUpdateRestart(next) && !isUpdateRestart(current);
}
function hasUnconsumedRestartSignal() {
	return emittedRestartToken > consumedRestartToken;
}
function clearPendingScheduledRestart() {
	clearTimeout(pendingRestartTimer ?? void 0);
	pendingRestartTimer = null;
	pendingRestartDueAt = 0;
	pendingRestartReason = void 0;
	pendingRestartSuccessorOwner = void 0;
	pendingRestartRequest = void 0;
	pendingRestartSkipDeferral = false;
	pendingRestartPreparing = false;
}
function clearPendingRestartSignalAdmission() {
	const lease = pendingRestartSignalAdmission;
	pendingRestartSignalAdmission = null;
	if (lease?.rollback()) return true;
	return rollbackGatewayRestartSignalFence();
}
/** Releases a signal fence when the run loop rejects or fails to handle the signal. */
function rollbackGatewayRestartSignalAdmission() {
	return clearPendingRestartSignalAdmission();
}
function armPendingRestartTimer(requestedDueAt, nowMs) {
	pendingRestartTimer = setTimeout(() => {
		const scheduledReason = pendingRestartReason;
		const scheduledSkipDeferral = pendingRestartSkipDeferral;
		const request = pendingRestartRequest;
		pendingRestartTimer = null;
		pendingRestartDueAt = 0;
		pendingRestartReason = void 0;
		pendingRestartSkipDeferral = false;
		pendingRestartPreparing = true;
		const pendingCheck = preRestartCheck;
		if (scheduledSkipDeferral || !pendingCheck) {
			emitPreparedGatewayRestart(void 0, scheduledReason, void 0, { scheduledRequest: request });
			return;
		}
		deferGatewayRestartUntilIdle({
			getPendingCount: pendingCheck,
			maxWaitMs: resolveGatewayRestartDeferralTimeoutMs(),
			reason: scheduledReason,
			timeoutIntent: {
				force: true,
				...scheduledReason ? { reason: scheduledReason } : {}
			}
		}, request);
	}, Math.max(0, requestedDueAt - nowMs));
}
function clearActiveDeferralPolls() {
	for (const poll of activeDeferralPolls) clearInterval(poll);
	activeDeferralPolls.clear();
}
function clearGatewayRestartTransientState() {
	restartTransientGeneration += 1;
	restartAuthorizedCount = 0;
	restartAuthorizedUntil = 0;
	restartCycleToken = 0;
	emittedRestartToken = 0;
	consumedRestartToken = 0;
	emittedRestartReason = void 0;
	emittedRestartIntent = void 0;
	lastRestartEmittedAt = null;
	clearActiveDeferralPolls();
	clearPendingScheduledRestart();
	clearPendingRestartSignalAdmission();
}
function resetGatewayRestartStateForInProcessRestart() {
	clearGatewayRestartTransientState();
	abortPendingChannelReloads();
}
/**
* Register a callback that scheduleGatewayRestart checks before emitting SIGUSR2.
* The callback should return the number of pending items (0 = safe to restart).
*/
function setPreRestartDeferralCheck(fn) {
	preRestartCheck = fn;
}
/** Emit one authorized restart per cycle; refuse unavailable or duplicate delivery. */
function emitGatewayRestart(reasonOverride, intent) {
	if (hasUnconsumedRestartSignal()) {
		clearActiveDeferralPolls();
		clearPendingScheduledRestart();
		return false;
	}
	clearActiveDeferralPolls();
	clearPendingScheduledRestart();
	emittedRestartToken = ++restartCycleToken;
	emittedRestartReason = reasonOverride ?? intent?.reason ?? pendingRestartReason;
	emittedRestartIntent = intent;
	authorizeGatewayRestart();
	try {
		if (process.listenerCount("SIGUSR2") > 0) process.emit("SIGUSR2");
		else if (process.platform === "win32") {
			if (!triggerOpenClawRestart().ok) {
				restartLog.warn("Windows scheduled task restart failed, token rolled back");
				return rollBackGatewayRestartEmission();
			}
			consumeGatewayRestartAuthorization();
			markGatewayRestartHandled();
		} else {
			restartLog.warn("Gateway restart unavailable: no restart handler; restart through the host.");
			return rollBackGatewayRestartEmission();
		}
	} catch {
		return rollBackGatewayRestartEmission();
	}
	lastRestartEmittedAt = monotonicNow();
	return true;
}
/**
* Emits while holding the signal-to-drain admission fence.
*
* The caller must already own root-work admission. Scheduled restarts use the
* independent-root wrapper below; config reloads run inside their reload root.
*/
function emitGatewayRestartWithSignalAdmission(reasonOverride, intent) {
	let signalAdmission = pendingRestartSignalAdmission;
	if (!signalAdmission) {
		if (!hasUnconsumedRestartSignal()) rollbackGatewayRestartSignalFence();
		signalAdmission = beginGatewayRestartSignalAdmission();
		if (!signalAdmission) return false;
		pendingRestartSignalAdmission = signalAdmission;
	}
	const hadUnconsumedRestartSignal = hasUnconsumedRestartSignal();
	const emitted = emitGatewayRestart(reasonOverride, intent);
	if (!emitted && !hadUnconsumedRestartSignal) clearPendingRestartSignalAdmission();
	return emitted;
}
/** Closed restart result for owners that must distinguish coalescing from delivery failure. */
function requestGatewayRestartWithSignalAdmission(reasonOverride, intent) {
	const hadUnconsumedRestartSignal = hasUnconsumedRestartSignal();
	if (emitGatewayRestartWithSignalAdmission(reasonOverride, intent)) return { status: "emitted" };
	return { status: hadUnconsumedRestartSignal ? "coalesced" : "failed" };
}
function resetRestartAuthorizationIfExpired(now = monotonicNow()) {
	if (restartAuthorizedCount <= 0 || now <= restartAuthorizedUntil) return;
	restartAuthorizedCount = 0;
	restartAuthorizedUntil = 0;
}
function setGatewayRestartPolicy(opts) {
	externalRestartAllowed = opts?.allowExternal === true;
}
function isGatewayRestartExternallyAllowed() {
	return externalRestartAllowed;
}
function authorizeGatewayRestart() {
	const expiresAt = monotonicNow() + RESTART_AUTH_GRACE_MS;
	restartAuthorizedCount += 1;
	if (expiresAt > restartAuthorizedUntil) restartAuthorizedUntil = expiresAt;
}
function consumeGatewayRestartAuthorization() {
	resetRestartAuthorizationIfExpired();
	if (restartAuthorizedCount <= 0) return false;
	restartAuthorizedCount -= 1;
	if (restartAuthorizedCount <= 0) restartAuthorizedUntil = 0;
	return true;
}
function peekGatewayRestartReason() {
	return hasUnconsumedRestartSignal() ? emittedRestartReason : void 0;
}
/**
* Reads and clears only the in-memory intent for the current emitted SIGUSR2 cycle.
* The restart reason and cycle token are advanced by markGatewayRestartHandled().
*/
function consumeGatewayRestartIntent() {
	if (!hasUnconsumedRestartSignal()) return null;
	const intent = emittedRestartIntent ?? null;
	emittedRestartIntent = void 0;
	return intent;
}
/**
* Mark the currently emitted SIGUSR2 restart cycle as consumed by the run loop.
* This explicitly advances the cycle state instead of resetting emit guards inside
* consumeGatewayRestartAuthorization().
*/
function markGatewayRestartHandled() {
	if (hasUnconsumedRestartSignal()) {
		consumedRestartToken = emittedRestartToken;
		emittedRestartReason = void 0;
		emittedRestartIntent = void 0;
	}
	clearPendingRestartSignalAdmission();
}
function rollBackGatewayRestartEmission() {
	emittedRestartToken = consumedRestartToken;
	emittedRestartReason = void 0;
	emittedRestartIntent = void 0;
	consumeGatewayRestartAuthorization();
	return false;
}
function canReplacePendingRestartEmitHooks(hooks, sessionKey) {
	return !hooks || pendingRestartRequest?.sessionKey === void 0 || pendingRestartRequest.sessionKey === sessionKey;
}
async function rejectPreparedRestartHook(hooks) {
	try {
		await hooks?.afterEmitRejected?.();
	} catch (err) {
		warnRestartEmitHookFailure("afterEmitRejected", err);
	}
}
async function rejectPreparedRestartHooks(hooksList) {
	for (const hooks of hooksList) await rejectPreparedRestartHook(hooks);
}
function warnRestartEmitHookFailure(hook, err) {
	let error = "Unknown error";
	try {
		error = formatErrorMessage(err);
	} catch {}
	try {
		restartLog.warn("restart hook callback failed; restart will continue", {
			hook,
			error
		});
	} catch {}
}
async function emitPreparedGatewayRestartUnderAdmission(caller, reasonOverride, intent, transientGeneration = restartTransientGeneration, canEmit = () => true, scheduledRequest) {
	const hooks = caller?.hooks;
	const isCurrent = () => transientGeneration === restartTransientGeneration && canEmit();
	if (!isCurrent()) return null;
	let callerPrepared = false;
	if (hooks && caller?.isCurrent()) {
		try {
			await hooks.beforeEmit?.();
			callerPrepared = true;
		} catch (err) {
			restartLog.warn(`restart preparation failed: ${String(err)}`);
		}
		if (!isCurrent()) {
			if (callerPrepared) await rejectPreparedRestartHook(hooks);
			return null;
		}
		if (callerPrepared && !caller.isCurrent()) {
			await rejectPreparedRestartHook(hooks);
			callerPrepared = false;
		}
	}
	let nextParked = pendingRestartRequest?.takeEmitHooks();
	let preparedParked;
	const rejectCallerOnBail = async () => {
		if (hooks && callerPrepared) await rejectPreparedRestartHook(hooks);
	};
	for (;;) {
		if (!isCurrent()) {
			await rejectPreparedRestartHook(preparedParked?.hooks);
			await rejectCallerOnBail();
			return null;
		}
		if (nextParked) {
			if (preparedParked) {
				await rejectPreparedRestartHook(preparedParked.hooks);
				preparedParked = void 0;
				if (!isCurrent()) {
					await rejectCallerOnBail();
					return null;
				}
			}
			if (nextParked.isCurrent()) try {
				await nextParked.hooks?.beforeEmit?.();
				preparedParked = nextParked;
			} catch (err) {
				restartLog.warn(`restart preparation failed: ${String(err)}`);
			}
			nextParked = pendingRestartRequest?.takeEmitHooks();
			continue;
		}
		if (preparedParked && !preparedParked.isCurrent()) {
			await rejectPreparedRestartHook(preparedParked.hooks);
			preparedParked = void 0;
		} else if (caller && callerPrepared && !caller.isCurrent()) {
			await rejectPreparedRestartHook(hooks);
			callerPrepared = false;
		} else break;
		nextParked = pendingRestartRequest?.takeEmitHooks();
	}
	const preparedHooksList = [preparedParked?.hooks, callerPrepared ? hooks : void 0].filter((prepared) => prepared !== void 0);
	const emitOwner = hooks && callerPrepared ? hooks : hooks && caller?.isCurrent() || pendingRestartSuccessorOwner && pendingRestartRequest?.sessionKey === void 0 ? void 0 : preparedParked?.hooks;
	if (pendingRestartRequest) pendingRestartRequest.sessionKey = void 0;
	if (!isCurrent()) {
		await rejectPreparedRestartHooks(preparedHooksList);
		return null;
	}
	if (!caller?.isCurrent() && !scheduledRequest?.isCurrent() && !pendingRestartRequest?.isCurrent()) {
		restartLog.warn("scheduled restart cancelled: requester authority changed");
		clearPendingScheduledRestart();
		await rejectPreparedRestartHooks(preparedHooksList);
		return { status: "failed" };
	}
	const preferredReason = shouldPreferRestartReason(pendingRestartReason, reasonOverride) ? pendingRestartReason : void 0;
	const resolvedReason = preferredReason ?? reasonOverride;
	const successorOwner = pendingRestartSuccessorOwner ?? intent?.successorOwner;
	const resolvedIntent = preferredReason || successorOwner ? {
		...intent,
		...resolvedReason ? { reason: resolvedReason } : {},
		...successorOwner ? { successorOwner } : {}
	} : intent;
	const emitResult = emitOwner?.emitRestart ? emitOwner.emitRestart(resolvedReason, resolvedIntent) : requestGatewayRestartWithSignalAdmission(resolvedReason, resolvedIntent);
	if (emitResult.status !== "emitted") await rejectPreparedRestartHooks(preparedHooksList);
	if (emitResult.status === "failed") for (const prepared of preparedHooksList) try {
		await prepared.afterEmitFailed?.();
	} catch (err) {
		warnRestartEmitHookFailure("afterEmitFailed", err);
	}
	return emitResult;
}
async function emitPreparedGatewayRestart(hooks, reasonOverride, intent, options = {}) {
	const { finalIdleCheck, setFenceRollback, signal, scheduledRequest } = options;
	const transientGeneration = restartTransientGeneration;
	const caller = scheduledRequest ? void 0 : new GatewayRestartRequest(hooks);
	try {
		return await runWithGatewayIndependentRootWorkAdmission(async () => {
			if (signal?.aborted || transientGeneration !== restartTransientGeneration) return false;
			if (hasUnconsumedRestartSignal()) return false;
			let signalAdmission = pendingRestartSignalAdmission;
			let ownsFenceLease = false;
			if (!signalAdmission) {
				rollbackGatewayRestartSignalFence();
				signalAdmission = beginGatewayRestartSignalAdmission();
				if (!signalAdmission) return false;
				pendingRestartSignalAdmission = signalAdmission;
				ownsFenceLease = true;
			}
			let fenceActive = true;
			let keepFenceForRunLoop = false;
			const rollbackFence = () => {
				if (keepFenceForRunLoop || hasUnconsumedRestartSignal()) return;
				if (!ownsFenceLease) {
					fenceActive = false;
					return;
				}
				fenceActive = false;
				signalAdmission.rollback();
				if (pendingRestartSignalAdmission === signalAdmission) pendingRestartSignalAdmission = null;
			};
			setFenceRollback?.(rollbackFence);
			try {
				if (!(finalIdleCheck ? finalIdleCheck() && getActiveGatewayRootWorkCount({ excludeCurrent: true }) === 0 : true)) return false;
				const emitResult = await emitPreparedGatewayRestartUnderAdmission(caller, reasonOverride, intent, transientGeneration, () => fenceActive && !signal?.aborted, scheduledRequest);
				if (emitResult && (emitResult.status === "emitted" || emitResult.status === "coalesced" && hasUnconsumedRestartSignal())) {
					keepFenceForRunLoop = true;
					return true;
				}
				return emitResult !== null;
			} finally {
				if (!keepFenceForRunLoop) rollbackFence();
				setFenceRollback?.(null);
			}
		}, "restart:delayed", signal);
	} catch (err) {
		if (signal?.aborted) return false;
		if (!isGatewayRestartDraining()) throw err;
		return true;
	}
}
/**
* Poll pending work until it drains, then emit one restart signal.
* A positive maxWaitMs keeps the old capped behavior for explicit configs.
* Shared by both the direct RPC restart path and the config watcher path.
*/
function deferGatewayRestartUntilIdle(opts, scheduledRequest) {
	const pollMs = resolveTimerTimeoutMs(opts.pollMs, DEFAULT_DEFERRAL_POLL_MS, 10);
	const maxWaitMs = typeof opts.maxWaitMs === "number" && Number.isFinite(opts.maxWaitMs) && opts.maxWaitMs > 0 ? Math.max(pollMs, Math.floor(opts.maxWaitMs)) : void 0;
	let cancelled = false;
	let activeAttempt = null;
	let poll = null;
	const stopPoll = () => {
		if (poll) {
			clearInterval(poll);
			activeDeferralPolls.delete(poll);
			poll = null;
		}
	};
	const cancelAttempt = () => {
		const attempt = activeAttempt;
		activeAttempt = null;
		attempt?.controller.abort();
		attempt?.rollbackFence?.();
	};
	const handle = { cancel: () => {
		cancelled = true;
		cancelAttempt();
		stopPoll();
	} };
	const startedAt = monotonicNow();
	let nextStillPendingAt = startedAt + DEFAULT_DEFERRAL_STILL_PENDING_WARN_MS;
	let timeoutNotified = false;
	let lastKnownPending;
	const readPendingCount = () => {
		try {
			lastKnownPending = opts.getPendingCount();
			return lastKnownPending;
		} catch (err) {
			opts.hooks?.onCheckError?.(err);
			return;
		}
	};
	const attemptEmission = (timedOut) => {
		if (cancelled || activeAttempt) return;
		const attempt = {
			controller: new AbortController(),
			startedAt: monotonicNow(),
			rollbackFence: null
		};
		activeAttempt = attempt;
		emitPreparedGatewayRestart(opts.emitHooks, opts.reason, timedOut ? {
			...opts.timeoutIntent,
			drainBudgetExhausted: true
		} : void 0, {
			finalIdleCheck: timedOut ? void 0 : () => {
				const current = readPendingCount();
				return current !== void 0 && current <= 0;
			},
			setFenceRollback: (rollback) => {
				if (activeAttempt === attempt) attempt.rollbackFence = rollback;
				else rollback?.();
			},
			signal: attempt.controller.signal,
			scheduledRequest
		}).then((attempted) => {
			if (activeAttempt !== attempt) return;
			activeAttempt = null;
			if (!attempted) return;
			stopPoll();
			if (!timedOut) opts.hooks?.onReady?.();
		}).catch((err) => {
			if (activeAttempt !== attempt) return;
			cancelAttempt();
			opts.hooks?.onCheckError?.(err);
		});
	};
	const inspectPending = () => {
		if (cancelled) return;
		const current = readPendingCount();
		const now = monotonicNow();
		const elapsedMs = now - startedAt;
		if (maxWaitMs !== void 0 && elapsedMs >= maxWaitMs) {
			if (!timeoutNotified) {
				timeoutNotified = true;
				opts.hooks?.onTimeout?.(lastKnownPending, elapsedMs);
			}
			if (activeAttempt && now - activeAttempt.startedAt >= maxWaitMs) cancelAttempt();
			attemptEmission(true);
			return;
		}
		if (current !== void 0 && current <= 0) {
			attemptEmission(false);
			return;
		}
		if (current !== void 0 && current > 0 && now >= nextStillPendingAt) {
			opts.hooks?.onStillPending?.(current, elapsedMs);
			nextStillPendingAt = now + DEFAULT_DEFERRAL_STILL_PENDING_WARN_MS;
		}
	};
	const pending = readPendingCount();
	if (pending !== void 0 && pending > 0) opts.hooks?.onDeferring?.(pending);
	poll = setInterval(inspectPending, pollMs);
	activeDeferralPolls.add(poll);
	if (pending !== void 0 && pending <= 0) attemptEmission(false);
	return handle;
}
function triggerOpenClawRestart() {
	if (process.env.VITEST || false) return {
		ok: true,
		method: "supervisor",
		detail: "test mode"
	};
	return restartGatewayViaSupervisor();
}
function scheduleGatewayRestart(opts) {
	const delayMs = normalizeGatewayRestartDelayMs(opts?.delayMs);
	const reason = normalizeRestartIntentReason(opts?.reason);
	const mode = process.listenerCount("SIGUSR2") > 0 ? "emit" : process.platform === "win32" ? "supervisor" : "signal";
	const nowMs = monotonicNow();
	const cooldownMsApplied = opts?.skipCooldown === true || lastRestartEmittedAt === null ? 0 : Math.max(0, lastRestartEmittedAt + RESTART_COOLDOWN_MS - nowMs);
	const restartResultBase = {
		ok: true,
		pid: process.pid,
		signal: "SIGUSR2",
		reason,
		mode,
		cooldownMsApplied
	};
	const requestedDueAt = nowMs + delayMs + cooldownMsApplied;
	const skipDeferral = opts?.skipDeferral === true;
	let nextPendingSessionKey = opts?.sessionKey;
	let nextPendingReason = reason;
	let nextPendingSuccessorOwner = opts?.successorOwner;
	if (hasUnconsumedRestartSignal()) {
		if (shouldPreferRestartReason(reason, emittedRestartReason)) {
			emittedRestartReason = reason;
			if (emittedRestartIntent) emittedRestartIntent = {
				...emittedRestartIntent,
				reason
			};
		}
		if (opts?.successorOwner) emittedRestartIntent = {
			...emittedRestartIntent,
			...emittedRestartReason ? { reason: emittedRestartReason } : {},
			successorOwner: opts.successorOwner
		};
		restartLog.warn(`restart request coalesced (already in-flight) reason=${reason ?? "unspecified"} ${formatRestartAudit(opts?.audit)}`);
		return {
			...restartResultBase,
			delayMs: 0,
			coalesced: true,
			emitHooksQueued: false
		};
	}
	const requestOwner = pendingRestartRequest ??= new PendingGatewayRestart();
	const requester = requestOwner.admit(opts?.emitHooks);
	let nextPendingEmitHooks = opts?.emitHooks ? requester : void 0;
	if (pendingRestartTimer || pendingRestartPreparing) {
		const remainingMs = pendingRestartPreparing ? 0 : Math.max(0, pendingRestartDueAt - nowMs);
		const preservePendingHooks = opts?.preservePendingEmitHooksOnDeferralBypass === true && opts?.emitHooks === void 0 && requestOwner.sessionKey !== void 0;
		if (pendingRestartPreparing && skipDeferral && activeDeferralPolls.size > 0) {
			restartLog.warn(`restart request bypassed active deferral reason=${reason ?? "unspecified"} pendingReason=${pendingRestartReason ?? "unspecified"} ${formatRestartAudit(opts?.audit)}`);
			clearActiveDeferralPolls();
			pendingRestartReason = reason;
			pendingRestartSuccessorOwner = opts?.successorOwner ?? pendingRestartSuccessorOwner;
			if (!preservePendingHooks) {
				requestOwner.emitHooks = nextPendingEmitHooks;
				requestOwner.sessionKey = opts?.sessionKey;
			}
			emitPreparedGatewayRestart(void 0, reason, void 0, { scheduledRequest: requestOwner });
			return {
				...restartResultBase,
				delayMs: 0,
				coalesced: false,
				emitHooksQueued: opts?.emitHooks !== void 0
			};
		}
		if (!pendingRestartPreparing && (requestedDueAt < pendingRestartDueAt || skipDeferral && !pendingRestartSkipDeferral)) {
			if (shouldPreferRestartReason(pendingRestartReason, reason)) nextPendingReason = pendingRestartReason;
			nextPendingSuccessorOwner ??= pendingRestartSuccessorOwner;
			if (!preservePendingHooks && !canReplacePendingRestartEmitHooks(opts?.emitHooks, opts?.sessionKey)) {
				restartLog.warn(`restart continuation dropped: another session owns the pending restart (callerSessionKey=${opts?.sessionKey ?? "unspecified"} pendingSessionKey=${requestOwner.sessionKey ?? "unspecified"})`);
				clearTimeout(pendingRestartTimer ?? void 0);
				pendingRestartTimer = null;
				pendingRestartDueAt = requestedDueAt;
				pendingRestartReason = nextPendingReason;
				pendingRestartSuccessorOwner = nextPendingSuccessorOwner;
				pendingRestartSkipDeferral = pendingRestartSkipDeferral || skipDeferral;
				armPendingRestartTimer(requestedDueAt, nowMs);
				return {
					...restartResultBase,
					delayMs: Math.max(0, requestedDueAt - nowMs),
					coalesced: true,
					emitHooksQueued: false
				};
			}
			if (preservePendingHooks) {
				nextPendingEmitHooks = requestOwner.emitHooks;
				nextPendingSessionKey = requestOwner.sessionKey;
			}
			restartLog.warn(`restart request rescheduled earlier reason=${reason ?? "unspecified"} pendingReason=${pendingRestartReason ?? "unspecified"} oldDelayMs=${remainingMs} newDelayMs=${Math.max(0, requestedDueAt - nowMs)} ${formatRestartAudit(opts?.audit)}`);
			clearPendingScheduledRestart();
		} else {
			const restartReasonPromoted = shouldPreferRestartReason(reason, pendingRestartReason);
			if (restartReasonPromoted) pendingRestartReason = reason;
			pendingRestartSuccessorOwner = opts?.successorOwner ?? pendingRestartSuccessorOwner;
			pendingRestartSkipDeferral = pendingRestartSkipDeferral || skipDeferral;
			restartLog.warn(`restart request coalesced (already scheduled) reason=${reason ?? "unspecified"} pendingReason=${pendingRestartReason ?? "unspecified"} delayMs=${remainingMs} ${formatRestartAudit(opts?.audit)}`);
			const emitHooksQueued = opts?.emitHooks !== void 0 && canReplacePendingRestartEmitHooks(opts.emitHooks, opts.sessionKey);
			if (emitHooksQueued || !preservePendingHooks && opts?.emitHooks === void 0 && (restartReasonPromoted || opts?.successorOwner !== void 0)) {
				requestOwner.emitHooks = nextPendingEmitHooks;
				requestOwner.sessionKey = opts?.emitHooks ? opts.sessionKey : void 0;
			}
			if (opts?.emitHooks && !emitHooksQueued) restartLog.warn(`restart continuation dropped: another session owns the pending restart (callerSessionKey=${opts.sessionKey ?? "unspecified"} pendingSessionKey=${requestOwner.sessionKey ?? "unspecified"})`);
			return {
				...restartResultBase,
				delayMs: remainingMs,
				coalesced: true,
				emitHooksQueued
			};
		}
	}
	pendingRestartDueAt = requestedDueAt;
	pendingRestartReason = nextPendingReason;
	pendingRestartSuccessorOwner = nextPendingSuccessorOwner;
	pendingRestartRequest = requestOwner;
	requestOwner.emitHooks = nextPendingEmitHooks;
	requestOwner.sessionKey = nextPendingSessionKey;
	pendingRestartSkipDeferral = skipDeferral;
	armPendingRestartTimer(requestedDueAt, nowMs);
	return {
		...restartResultBase,
		delayMs: Math.max(0, requestedDueAt - nowMs),
		coalesced: false,
		emitHooksQueued: opts?.emitHooks !== void 0
	};
}
//#endregion
export { isCurrentGatewayReloadGeneration as _, markGatewayRestartHandled as a, resetGatewayRestartStateForInProcessRestart as c, setGatewayRestartPolicy as d, setPreRestartDeferralCheck as f, abortPendingChannelReloads as g, normalizeGatewayRestartDelayMs as h, isGatewayRestartExternallyAllowed as i, rollbackGatewayRestartSignalAdmission as l, normalizeSystemdUnit as m, consumeGatewayRestartIntent as n, peekGatewayRestartReason as o, triggerOpenClawRestart as p, deferGatewayRestartUntilIdle as r, requestGatewayRestartWithSignalAdmission as s, consumeGatewayRestartAuthorization as t, scheduleGatewayRestart as u, isGatewayReloadGenerationAborted as v, nextGatewayReloadGeneration as y };
