import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { m as resolveGatewayWindowsTaskName, p as resolveGatewaySystemdServiceName } from "./constants-CJCmIHb-.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { n as DEFAULT_GATEWAY_PORT } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { o as readGatewayOwnerLease } from "./windows-port-pids-Bid_Huck.mjs";
import { i as terminateStaleGatewayPids } from "./restart-stale-pids-DjtzhbID.mjs";
import { a as getWindowsSystem32ExePath } from "./windows-install-roots-DK9gNoYN.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-i3x9UrUR.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { o as spawnCommand } from "./exec-spawn-B7redWCL.mjs";
import { _ as renderSystemLaunchDaemonOwnershipShellProbe } from "./launchd-service-files-Cv2FPjBf.mjs";
import { r as resolveGatewayTaskScriptPath } from "./paths-B1MX98Zs.mjs";
import { a as resolveGatewayRestartLogPath, r as renderPosixRestartLogSetup, s as shellEscapeRestartLogValue } from "./restart-logs-DcfskF2f.mjs";
import { t as buildHiddenLauncherScript, y as encodeWindowsLauncherScript } from "./schtasks-layout-ZxN1sGLi.mjs";
import { f as recordUpdateRunPhase } from "./update-run-ledger-CwAEg-5V.mjs";
import { a as resolveGatewayService, i as readGatewayServiceState } from "./service-BCULlL85.mjs";
import { n as waitForGatewayHealthyRestart } from "./restart-health-By4lclzW.mjs";
import { i as resolveServiceRefreshEnv } from "./update-command-service-env-a79RyIGw.mjs";
import { d as UpdateCommandRecoveryPendingError } from "./update-command-executor-DDhDn9_F.mjs";
import { _ as tryWriteCompletionCache } from "./shared-Ca2ebFXK.mjs";
import { o as installCompletion } from "./completion-runtime-DXXgSrrB.mjs";
import { t as createUpdateConfigSnapshot } from "./update-command-config-snapshot-BI95iCNP.mjs";
import { a as hasLoadedLaunchdKeepAliveSupervisor } from "./update-command-readiness-uqvgjv5Q.mjs";
import { a as verifyUpdatedGateway, c as recoverLaunchAgentAndRecheckGatewayHealth, d as GatewayRestartHealthError, f as isPackageManagerUpdateMode, m as runUpdatedInstallGatewayCommand, n as recordFailedUpdateGatewayState, r as recordUpdateGatewayHealth, u as DEFINITION_DENIAL } from "./update-command-verification-DaTCD33B.mjs";
import { t as CLI_NAME } from "./cli-name-Dp_huZBR.mjs";
import { n as stylePromptMessage } from "./prompt-style-zarsDmI2.mjs";
import { a as gatewayServiceCommandUsesRoot, i as assertGatewayServiceManagementAllowedForUpdate, p as resolveUpdatedGatewayRestartPort, u as resolveGatewayServiceManagementBlockMessageForUpdate } from "./update-command-service-plan-B89pDfz8.mjs";
import { s as revalidateManagedGatewayServiceAfterUpdate } from "./update-command-service-maintenance-DeciiZGR.mjs";
import { f as recordServiceReconciliationWarning, p as recordServiceReconciliationWarnings } from "./update-command-result-BL-5x2xq.mjs";
import { r as ensureCompletionCacheExists, t as checkShellCompletionStatus } from "./doctor-completion-shHFSS_8.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { confirm, isCancel } from "@clack/prompts";
//#region src/cli/update-cli/restart-helper.ts
/**
* Shell-escape a string for embedding in single-quoted shell arguments.
* Replaces every `'` with `'\''` (end quote, escaped quote, resume quote).
* For batch scripts, validates against special characters instead.
*/
function shellEscape(value) {
	return value.replace(/'/g, "'\\''");
}
/** Validates a task name is safe for embedding in Windows restart scripts. */
function isWindowsTaskNameSafe(value) {
	return /^[A-Za-z0-9 _\-().]+$/.test(value);
}
function powerShellSingleQuote(value) {
	if (/[^\x20-\x7e]/u.test(value)) return `([Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${Buffer.from(value, "utf8").toString("base64")}')))`;
	return `'${value.replace(/'/g, "''")}'`;
}
function resolveSystemdUnit(env) {
	const override = normalizeOptionalString(env.OPENCLAW_SYSTEMD_UNIT);
	if (override) return override.endsWith(".service") ? override : `${override}.service`;
	return `${resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE)}.service`;
}
function resolveWindowsTaskName(env) {
	const override = env.OPENCLAW_WINDOWS_TASK_NAME?.trim();
	if (override) return override;
	return resolveGatewayWindowsTaskName(env.OPENCLAW_PROFILE);
}
function resolveLinuxFilesystemBusUid(busAddress) {
	const encodedBusPath = (busAddress?.match(/^unix:([^;]+)$/u)?.[1])?.split(",").find((parameter) => parameter.startsWith("path="))?.slice(5);
	if (encodedBusPath === void 0) return;
	try {
		return decodeURIComponent(encodedBusPath).match(/^\/run\/user\/(\d+)\/bus$/u)?.[1];
	} catch {
		return;
	}
}
async function renderLinuxUserBusRepair(env) {
	const uid = typeof process.geteuid === "function" ? process.geteuid() : 0;
	if (uid <= 0) return "";
	const expectedRuntimeDir = `/run/user/${uid}`;
	const expectedBusAddress = `unix:path=${expectedRuntimeDir}/bus`;
	const runtimeDir = normalizeOptionalString(env.XDG_RUNTIME_DIR);
	const busAddress = normalizeOptionalString(env.DBUS_SESSION_BUS_ADDRESS);
	const runtimeUid = (runtimeDir ? path.posix.normalize(runtimeDir) : void 0)?.match(/^\/run\/user\/(\d+)\/?$/)?.[1];
	const busUid = resolveLinuxFilesystemBusUid(busAddress);
	const repairRuntimeDir = !runtimeDir || runtimeUid !== void 0 && runtimeUid !== String(uid);
	const preserveCustomRuntimeDir = Boolean(runtimeDir) && runtimeUid === void 0;
	const repairBusAddress = !preserveCustomRuntimeDir && (!busAddress || busUid !== void 0 && busUid !== String(uid));
	const clearEmptyCustomBusAddress = preserveCustomRuntimeDir && env.DBUS_SESSION_BUS_ADDRESS !== void 0 && !busAddress;
	if (!repairRuntimeDir && !repairBusAddress && !clearEmptyCustomBusAddress) return "";
	try {
		const socketRuntimeDir = clearEmptyCustomBusAddress && runtimeDir ? runtimeDir : expectedRuntimeDir;
		if (!(await fs.stat(path.join(socketRuntimeDir, "bus"))).isSocket()) return "";
	} catch {
		return "";
	}
	return `# Repair missing or cross-user D-Bus values inherited by the updater.
${[
		repairRuntimeDir ? `export XDG_RUNTIME_DIR='${shellEscape(expectedRuntimeDir)}'` : "",
		repairBusAddress ? `export DBUS_SESSION_BUS_ADDRESS='${shellEscape(expectedBusAddress)}'` : "",
		clearEmptyCustomBusAddress ? "unset DBUS_SESSION_BUS_ADDRESS" : ""
	].filter(Boolean).join("\n")}
`;
}
/**
* Prepares a standalone script to restart the gateway service.
* This script is written to a temporary directory and does not depend on
* the installed package files, ensuring restart capability even if the
* update process temporarily removes or corrupts installation files.
*/
async function prepareRestartScript(env = process.env, gatewayPort = DEFAULT_GATEWAY_PORT, windowsGatewayArgv = []) {
	const timestamp = Date.now();
	const platform = process.platform;
	let scriptContent;
	let filename;
	let windowsWrapper;
	try {
		if (platform === "linux") {
			const escaped = shellEscape(resolveSystemdUnit(env));
			const logSetup = renderPosixRestartLogSetup({
				...process.env,
				...env
			});
			const userBusRepair = await renderLinuxUserBusRepair({
				...process.env,
				...env
			});
			filename = `openclaw-restart-${timestamp}.sh`;
			scriptContent = `#!/bin/sh
# Standalone restart script — survives parent process termination.
# Wait briefly to ensure file locks are released after update.
sleep 1
exec 3>&2
${logSetup}
${userBusRepair}
printf '[%s] openclaw restart attempt source=update target=%s\\n' "$(date -u +%FT%TZ)" '${escaped}' >&2
if systemctl --user is-active --quiet '${escaped}' || systemctl --user is-enabled --quiet '${escaped}'; then
  if systemctl --user restart '${escaped}'; then
    status=0
    printf '[%s] openclaw restart done source=update\\n' "$(date -u +%FT%TZ)" >&2
  else
    status=$?
    printf '[%s] openclaw restart failed source=update status=%s\\n' "$(date -u +%FT%TZ)" "$status" >&2
  fi
elif systemctl is-active --quiet '${escaped}' || systemctl is-enabled --quiet '${escaped}'; then
  status=78
  printf '[%s] system-scoped openclaw gateway unit detected; update cannot restart it without sudo. Run: sudo systemctl restart %s\\n' "$(date -u +%FT%TZ)" '${escaped}' >&2
  printf '[%s] system-scoped openclaw gateway unit detected; update cannot restart it without sudo. Run: sudo systemctl restart %s\\n' "$(date -u +%FT%TZ)" '${escaped}' >&3 2>/dev/null || true
else
  if systemctl --user restart '${escaped}'; then
    status=0
    printf '[%s] openclaw restart done source=update\\n' "$(date -u +%FT%TZ)" >&2
  else
    status=$?
    printf '[%s] openclaw restart failed source=update status=%s\\n' "$(date -u +%FT%TZ)" "$status" >&2
  fi
fi
# Self-cleanup
script_dir=$(dirname "$0")
exec 3>&-
rm -f "$0"
rmdir "$script_dir" 2>/dev/null || true
exit "$status"
`;
		} else if (platform === "darwin") {
			const label = resolveLaunchAgentLabel(env);
			const escaped = shellEscape(label);
			const uid = process.getuid ? process.getuid() : 501;
			const home = normalizeOptionalString(env.HOME) || process.env.HOME || os.homedir();
			const escapedPlistPath = shellEscape(path.join(home, "Library", "LaunchAgents", `${label}.plist`));
			const logSetup = renderPosixRestartLogSetup({
				...process.env,
				...env
			});
			const systemOwnershipProbe = renderSystemLaunchDaemonOwnershipShellProbe(label);
			filename = `openclaw-restart-${timestamp}.sh`;
			scriptContent = `#!/bin/sh
# Standalone restart script — survives parent process termination.
# Wait briefly to ensure file locks are released after update.
sleep 1
# Capture launchctl output so bootstrap/kickstart failures leave a durable
# audit trail. Log setup is best-effort: restart must still run if the log path
# is temporarily unavailable.
${logSetup}
printf '[%s] openclaw restart attempt source=update target=%s\\n' "$(date -u +%FT%TZ)" '${shellEscapeRestartLogValue(label)}' >&2
${systemOwnershipProbe}
# Try kickstart first (works when the service is still registered).
# If it fails (e.g. after bootout), clear any persisted disabled state,
# then re-register via bootstrap. Bootstrap loads RunAtLoad agents, so the
# fallback must not immediately kickstart -k the freshly spawned gateway.
# The final status is captured
# before self-cleanup so a genuine failure remains observable.
status=0
if [ -n "$openclaw_system_launchd_conflict" ]; then
  status=78
  printf '[%s] openclaw restart blocked source=update reason=%s\n' "$(date -u +%FT%TZ)" "$openclaw_system_launchd_detail" >&2
elif ! launchctl kickstart -k 'gui/${uid}/${escaped}'; then
  launchctl enable 'gui/${uid}/${escaped}'
  if launchctl bootstrap 'gui/${uid}' '${escapedPlistPath}'; then
    status=0
  else
    launchctl kickstart -k 'gui/${uid}/${escaped}'
    status=$?
  fi
fi
if [ "$status" -eq 0 ]; then
  printf '[%s] openclaw restart done source=update\\n' "$(date -u +%FT%TZ)" >&2
else
  printf '[%s] openclaw restart failed source=update status=%s\\n' "$(date -u +%FT%TZ)" "$status" >&2
fi
# Self-cleanup (log is retained under the OpenClaw state logs directory).
script_dir=$(dirname "$0")
rm -f "$0"
rmdir "$script_dir" 2>/dev/null || true
exit "$status"
`;
		} else if (platform === "win32") {
			const taskName = resolveWindowsTaskName(env);
			if (!isWindowsTaskNameSafe(taskName)) return null;
			const port = Number.isFinite(gatewayPort) && gatewayPort > 0 ? gatewayPort : DEFAULT_GATEWAY_PORT;
			const quotedLogPath = powerShellSingleQuote(resolveGatewayRestartLogPath({
				...process.env,
				...env
			}));
			const quotedTaskName = powerShellSingleQuote(taskName);
			const quotedGatewayScriptPath = powerShellSingleQuote(resolveGatewayTaskScriptPath({
				...process.env,
				...env
			}));
			const expectedGatewayArgv = windowsGatewayArgv.map(powerShellSingleQuote).join(", ");
			filename = `openclaw-restart-${timestamp}.cmd`;
			windowsWrapper = `@echo off
REM Standalone restart script - survives parent process termination.
REM Read fixed commands from stdin so Group Policy file-signing restrictions
REM do not prevent recovery. The companion contains ASCII-only script text.
setlocal
set "OPENCLAW_RESTART_SCRIPT_DIR=%~dp0."
powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command - < "%~dpn0.ps1" > "%~dpn0.out"
set "status=%ERRORLEVEL%"
REM PowerShell can exit zero for malformed or incomplete stdin without running it.
findstr /x /c:"OPENCLAW_RESTART_COMPLETE" "%~dpn0.out" >nul 2>&1
if errorlevel 1 set "status=1"
REM This dedicated cmd process must exit instead of returning to a deleted batch file.
(
del "%~dpn0.out" >nul 2>&1
del "%~dpn0.ps1" >nul 2>&1
del "%~f0.vbs" >nul 2>&1
del "%~f0" >nul 2>&1
rmdir "%OPENCLAW_RESTART_SCRIPT_DIR%" >nul 2>&1
exit %status%
)
`;
			scriptContent = `
# Wait briefly to ensure file locks are released after update.
$ErrorActionPreference = "Continue"
Start-Sleep -Seconds 2

$logPath = ${quotedLogPath}
try {
  $logDir = Split-Path -Parent $logPath
  New-Item -ItemType Directory -Path $logDir -Force | Out-Null
  Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format o)] openclaw restart log initialized"
} catch {
  # Restart should still run if log setup is unavailable.
}

function Write-RestartLog {
  param([string]$Message)
  try {
    Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format o)] $Message"
  } catch {
  }
}

function Join-OpenClawProcessArguments {
  param([string[]]$Arguments)
  ($Arguments | ForEach-Object {
    if ($_ -match "\\s") {
      '"' + $_ + '"'
    } else {
      $_
    }
  }) -join " "
}

function Invoke-OpenClawSchtasksWithTimeout {
  param(
    [string[]]$Arguments,
    [int]$TimeoutSeconds
  )
  $process = $null
  try {
    $startInfo = [System.Diagnostics.ProcessStartInfo]::new()
    $startInfo.FileName = "schtasks.exe"
    $startInfo.Arguments = Join-OpenClawProcessArguments -Arguments $Arguments
    $startInfo.UseShellExecute = $false
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true
    $process = [System.Diagnostics.Process]::Start($startInfo)
    if (-not $process.WaitForExit($TimeoutSeconds * 1000)) {
      try {
        $process.Kill()
      } catch {
      }
      Write-RestartLog "openclaw restart schtasks timeout source=update args=$($Arguments -join ' ')"
      return 124
    }
    $stdout = $process.StandardOutput.ReadToEnd()
    $stderr = $process.StandardError.ReadToEnd()
    if ($stdout) {
      Write-RestartLog $stdout.Trim()
    }
    if ($stderr) {
      Write-RestartLog $stderr.Trim()
    }
    return $process.ExitCode
  } catch {
    Write-RestartLog "openclaw restart schtasks failed source=update args=$($Arguments -join ' ') error=$($_.Exception.Message)"
    return 1
  }
}

function Get-OpenClawScheduledTaskState {
  param([string]$TaskName)
  try {
    $task = Get-ScheduledTask -TaskName $TaskName -ErrorAction Stop
    if ($task -and $task.State) {
      return [string]$task.State
    }
  } catch {
  }

  try {
    $queryOutput = & schtasks.exe /Query /TN $TaskName /FO LIST 2>$null
    foreach ($line in $queryOutput) {
      if ($line -match "^\\s*Status:\\s*(.+?)\\s*$") {
        return $Matches[1]
      }
    }
  } catch {
  }

  return "Unknown"
}

# OPENCLAW_RESTART_KILL_POLICY_BEGIN
function Split-OpenClawWindowsCommandLine {
  param([string]$CommandLine)
  if (-not $CommandLine) { return @() }
  $arguments = [Collections.Generic.List[string]]::new()
  $index = 0
  # Shell32 treats argv[0] as a path, without backslash/quote escapes.
  if ($CommandLine[0] -eq '"') {
    $end = $CommandLine.IndexOf('"', 1)
    if ($end -lt 0) { $end = $CommandLine.Length }
    $arguments.Add($CommandLine.Substring(1, $end - 1))
    $index = [Math]::Min($end + 1, $CommandLine.Length)
  } else {
    while ($index -lt $CommandLine.Length -and $CommandLine[$index] -ne ' ' -and [int]$CommandLine[$index] -ne 9) { $index++ }
    $arguments.Add($CommandLine.Substring(0, $index))
  }
  while ($index -lt $CommandLine.Length) {
    while ($index -lt $CommandLine.Length -and ($CommandLine[$index] -eq ' ' -or [int]$CommandLine[$index] -eq 9)) { $index++ }
    if ($index -eq $CommandLine.Length) { break }
    $argument = [Text.StringBuilder]::new()
    $quoted = 0
    while ($index -lt $CommandLine.Length) {
      $character = $CommandLine[$index]
      if ($quoted -eq 0 -and ($character -eq ' ' -or [int]$character -eq 9)) { break }
      $slashes = 0
      while ($index -lt $CommandLine.Length -and $CommandLine[$index] -eq '\\') { $slashes++; $index++ }
      if ($index -lt $CommandLine.Length -and $CommandLine[$index] -eq '"') {
        [void]$argument.Append(('\\' * [int][Math]::Floor($slashes / 2)))
        if ($slashes % 2 -eq 1) {
          [void]$argument.Append('"')
          $index++
        }
        # Consecutive unescaped quotes produce one literal quote per three;
        # only a remainder of one leaves the argument quoted.
        $quotes = $quoted
        while ($index -lt $CommandLine.Length -and $CommandLine[$index] -eq '"') { $quotes++; $index++ }
        [void]$argument.Append(('"' * [int][Math]::Floor($quotes / 3)))
        $quoted = [int]($quotes % 3 -eq 1)
      } else {
        [void]$argument.Append(('\\' * $slashes))
        if ($index -eq $CommandLine.Length) { break }
        $character = $CommandLine[$index]
        if ($quoted -eq 0 -and ($character -eq ' ' -or [int]$character -eq 9)) { break }
        [void]$argument.Append($character)
        $index++
      }
    }
    $arguments.Add($argument.ToString())
  }
  return $arguments.ToArray()
}

function Get-OpenClawListenerSnapshot {
  param([int]$Port)

  try {
    if (Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue) {
      $listenerPids = @(
        Get-NetTCPConnection -State Listen -ErrorAction Stop |
          Where-Object { [int]$_.LocalPort -eq $Port } |
          ForEach-Object { [int]$_.OwningProcess } |
          Sort-Object -Unique
      )
      return [pscustomobject]@{ Known = $true; Pids = $listenerPids }
    }
  } catch {
    Write-RestartLog "openclaw restart Get-NetTCPConnection query failed source=update error=$($_.Exception.Message)"
  }

  try {
    $netstatOutput = @(& netstat.exe -ano -p tcp 2>$null)
    if ($LASTEXITCODE -ne 0) {
      return [pscustomobject]@{ Known = $false; Pids = @() }
    }

    $listenerPids = @()
    $localPortPattern = ":" + [regex]::Escape([string]$Port) + '$'
    foreach ($line in $netstatOutput) {
      $tokens = @($line.Trim() -split '\\s+' | Where-Object { $_ })
      if ($tokens.Count -lt 5 -or $tokens[0] -ine "TCP") {
        continue
      }
      # Listening rows use a wildcard foreign endpoint with port zero. Avoid the
      # localized state column entirely; protocol/endpoints/PID stay numeric.
      if ($tokens[1] -notmatch $localPortPattern -or $tokens[2] -notmatch ':0$') {
        continue
      }
      $listenerPid = 0
      if ([int]::TryParse($tokens[-1], [ref]$listenerPid) -and $listenerPid -gt 0) {
        $listenerPids += $listenerPid
      }
    }
    return [pscustomobject]@{
      Known = $true
      Pids = @($listenerPids | Sort-Object -Unique)
    }
  } catch {
    Write-RestartLog "openclaw restart netstat query failed source=update error=$($_.Exception.Message)"
    return [pscustomobject]@{ Known = $false; Pids = @() }
  }
}

function Get-OpenClawProcessFacts {
  param([int]$ProcessId)

  try {
    $process = Get-CimInstance Win32_Process -Filter "ProcessId = $ProcessId" -ErrorAction Stop
    if (-not $process -or -not $process.CommandLine -or -not $process.CreationDate) {
      return $null
    }
    $creationDate = if ($process.CreationDate -is [datetime]) {
      [datetime]$process.CreationDate
    } else {
      [System.Management.ManagementDateTimeConverter]::ToDateTime([string]$process.CreationDate)
    }
    $creationTimeFileTime = [long]$creationDate.ToUniversalTime().ToFileTimeUtc()
    $creationTimeFileTime -= $creationTimeFileTime % 10
    return [pscustomobject]@{
      ProcessId = [int]$process.ProcessId
      CreationTimeFileTime = [string]$creationTimeFileTime
      Argv = @(Split-OpenClawWindowsCommandLine -CommandLine ([string]$process.CommandLine))
    }
  } catch {
    Write-RestartLog "openclaw restart process query failed source=update pid=$ProcessId error=$($_.Exception.Message)"
    return $null
  }
}

function Test-OpenClawArgvEqual {
  param([string[]]$Actual, [string[]]$Expected)
  if ($Actual.Count -ne $Expected.Count) {
    return $false
  }
  for ($index = 0; $index -lt $Actual.Count; $index++) {
    $actualArg = $Actual[$index]
    $expectedArg = $Expected[$index]
    # Windows may expand a bare launcher executable in the process command line.
    # Qualified paths and every non-executable argument remain exact.
    if ($index -eq 0 -and $expectedArg -notmatch '[\\\\/]') {
      $actualArg = [IO.Path]::GetFileName($actualArg)
      if (-not $actualArg.EndsWith('.exe', [StringComparison]::OrdinalIgnoreCase)) {
        $actualArg += '.exe'
      }
      if (-not $expectedArg.EndsWith('.exe', [StringComparison]::OrdinalIgnoreCase)) {
        $expectedArg += '.exe'
      }
    }
    if (-not [string]::Equals($actualArg, $expectedArg, [StringComparison]::OrdinalIgnoreCase)) {
      return $false
    }
  }
  return $true
}

function Test-OpenClawSameProcess {
  param($Expected, $Actual)
  return (
    $null -ne $Actual -and
    $Actual.ProcessId -eq $Expected.ProcessId -and
    $Actual.CreationTimeFileTime -eq $Expected.CreationTimeFileTime -and
    (Test-OpenClawArgvEqual -Actual $Actual.Argv -Expected $Expected.Argv)
  )
}

function Get-OpenClawListenerKillDecision {
  param(
    [int]$CandidatePid,
    [string[]]$ExpectedArgv,
    $ObservedProcess,
    [string]$HeldProcessCreationTimeFileTime,
    $RecheckedListeners,
    $RecheckedProcess
  )
  if ($ExpectedArgv.Count -eq 0) {
    return "expected-command-unavailable"
  }
  if ($null -eq $ObservedProcess -or $ObservedProcess.ProcessId -ne $CandidatePid) {
    return "process-unavailable"
  }
  if (-not (Test-OpenClawArgvEqual -Actual $ObservedProcess.Argv -Expected $ExpectedArgv)) {
    return "command-mismatch"
  }
  if ($HeldProcessCreationTimeFileTime -ne $ObservedProcess.CreationTimeFileTime) {
    return "process-replaced"
  }
  if (-not $RecheckedListeners.Known) {
    return "listener-query-unavailable"
  }
  if ($RecheckedListeners.Pids -notcontains $CandidatePid) {
    return "no-longer-listening"
  }
  if (-not (Test-OpenClawSameProcess -Expected $ObservedProcess -Actual $RecheckedProcess)) {
    return "process-replaced"
  }
  return "kill"
}

function Invoke-OpenClawVerifiedListenerKill {
  param(
    [int]$ProcessId,
    [int]$Port,
    [string[]]$ExpectedArgv,
    [scriptblock]$ProcessQuery = { param([int]$QueryPid) Get-OpenClawProcessFacts -ProcessId $QueryPid },
    [scriptblock]$ListenerQuery = { param([int]$QueryPort) Get-OpenClawListenerSnapshot -Port $QueryPort },
    [scriptblock]$ProcessOpen = { param([int]$QueryPid) [Diagnostics.Process]::GetProcessById($QueryPid) }
  )

  $observedProcess = & $ProcessQuery $ProcessId
  if ($null -eq $observedProcess) {
    Write-RestartLog "openclaw restart skipped listener source=update pid=$ProcessId decision=process-unavailable"
    return
  }
  if ($ExpectedArgv.Count -eq 0) {
    Write-RestartLog "openclaw restart skipped listener source=update pid=$ProcessId decision=expected-command-unavailable"
    return
  }
  if (-not (Test-OpenClawArgvEqual -Actual $observedProcess.Argv -Expected $ExpectedArgv)) {
    Write-RestartLog "openclaw restart skipped listener source=update pid=$ProcessId decision=command-mismatch"
    return
  }

  $lease = $null
  try {
    $lease = & $ProcessOpen $ProcessId
    if ($null -eq $lease) {
      Write-RestartLog "openclaw restart skipped listener source=update pid=$ProcessId decision=process-handle-unavailable"
      return
    }

    # Force the Process object to retain its handle before reading identity.
    # StartTime and Kill then use that handle, including if the PID is recycled.
    [void]$lease.Handle
    $heldCreationTime = [long]$lease.StartTime.ToUniversalTime().ToFileTimeUtc()
    $heldCreationTime -= $heldCreationTime % 10
    $recheckedListeners = & $ListenerQuery $Port
    $recheckedProcess = & $ProcessQuery $ProcessId
    $decisionParams = @{
      CandidatePid = $ProcessId
      ExpectedArgv = $ExpectedArgv
      ObservedProcess = $observedProcess
      HeldProcessCreationTimeFileTime = [string]$heldCreationTime
      RecheckedListeners = $recheckedListeners
      RecheckedProcess = $recheckedProcess
    }
    $decision = Get-OpenClawListenerKillDecision @decisionParams
    if ($decision -ne "kill") {
      Write-RestartLog "openclaw restart skipped listener source=update pid=$ProcessId decision=$decision"
      return
    }

    $lease.Kill()
    Write-RestartLog "openclaw restart killed stale listener source=update pid=$ProcessId"
  } catch {
    Write-RestartLog "openclaw restart ownership verification failed source=update pid=$ProcessId error=$($_.Exception.Message)"
  } finally {
    if ($null -ne $lease) {
      $lease.Dispose()
    }
  }
}
# OPENCLAW_RESTART_KILL_POLICY_END

function Invoke-OpenClawStartupLauncher {
  param([string]$LauncherPath)
  $launcherPath = $LauncherPath
  if (-not (Test-Path -LiteralPath $launcherPath)) {
    Write-RestartLog "openclaw restart startup launcher missing source=update path=$launcherPath"
    return 1
  }

  try {
    Start-Process -FilePath $launcherPath -WindowStyle Hidden | Out-Null
    Write-RestartLog "openclaw restart launched startup fallback source=update path=$launcherPath"
    return 0
  } catch {
    Write-RestartLog "openclaw restart startup fallback failed source=update error=$($_.Exception.Message)"
    return 1
  }
}

$taskName = ${quotedTaskName}
$port = ${port}
$gatewayScriptPath = ${quotedGatewayScriptPath}
$expectedGatewayArgv = @(${expectedGatewayArgv})
Write-RestartLog "openclaw restart attempt source=update target=$taskName"

$taskState = Get-OpenClawScheduledTaskState -TaskName $taskName
if ($taskState -eq "Running") {
  $endStatus = Invoke-OpenClawSchtasksWithTimeout -Arguments @("/End", "/TN", $taskName) -TimeoutSeconds 10
  if ($endStatus -ne 0) {
    Write-RestartLog "openclaw restart schtasks end did not complete cleanly source=update status=$endStatus"
  }
} else {
  Write-RestartLog "openclaw restart skipped schtasks end source=update state=$taskState"
}

for ($attempt = 1; $attempt -le 10; $attempt++) {
  $listenerSnapshot = Get-OpenClawListenerSnapshot -Port $port
  if (-not $listenerSnapshot.Known) {
    if ($attempt -eq 10) {
      Write-RestartLog "openclaw restart listener ownership unavailable source=update; refusing force-kill"
      break
    }
    Start-Sleep -Seconds 1
    continue
  }

  $listeners = @($listenerSnapshot.Pids)
  if ($listeners.Count -eq 0) {
    break
  }

  if ($attempt -eq 10) {
    foreach ($listenerPid in $listeners) {
      Invoke-OpenClawVerifiedListenerKill -ProcessId $listenerPid -Port $port -ExpectedArgv $expectedGatewayArgv
    }
    break
  }

  Start-Sleep -Seconds 1
}

$status = Invoke-OpenClawSchtasksWithTimeout -Arguments @("/Run", "/TN", $taskName) -TimeoutSeconds 30
if ($status -ne 0) {
  $status = Invoke-OpenClawStartupLauncher -LauncherPath $gatewayScriptPath
}
if ($status -eq 0) {
  Write-RestartLog "openclaw restart done source=update"
} else {
  Write-RestartLog "openclaw restart failed source=update status=$status"
}

[Console]::Out.WriteLine("OPENCLAW_RESTART_COMPLETE")
exit $status
`;
		} else return null;
		const scriptDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-restart-"));
		const scriptPath = path.join(scriptDir, filename);
		try {
			if (windowsWrapper) {
				await fs.writeFile(scriptPath.replace(/\.cmd$/u, ".ps1"), `& {\n${scriptContent}\n}\n\n`, {
					mode: 448,
					flag: "wx"
				});
				await fs.writeFile(`${scriptPath}.vbs`, encodeWindowsLauncherScript({
					format: "vbs",
					content: buildHiddenLauncherScript({ scriptPath })
				}), {
					mode: 448,
					flag: "wx"
				});
			}
			await fs.writeFile(scriptPath, windowsWrapper ?? scriptContent, {
				mode: 493,
				flag: "wx"
			});
		} catch (error) {
			await fs.rm(scriptDir, {
				recursive: true,
				force: true
			}).catch(() => {});
			throw error;
		}
		return scriptPath;
	} catch {
		return null;
	}
}
/** Observe native acceptance separately from the caller's subsequent health check. */
async function runRestartScript(scriptPath, timeoutMs) {
	const isWindows = process.platform === "win32";
	const file = isWindows ? getWindowsSystem32ExePath("wscript.exe") : "/bin/sh";
	const args = isWindows ? [
		"//B",
		"//Nologo",
		`${scriptPath}.vbs`
	] : [scriptPath];
	try {
		await spawnCommand([file, ...args], {
			detached: true,
			stdio: "ignore",
			timeout: timeoutMs,
			forceKillAfterDelay: 300
		});
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region src/cli/update-cli/update-command-service.ts
function shouldPrepareUpdatedInstallRestart(params) {
	return params.requiresInstallRootRefresh === true || isPackageManagerUpdateMode(params.updateMode) || params.updateMode === "git" && params.serviceStoppedForUpdate ? params.serviceInstalled : params.serviceLoaded && (params.updateMode !== "git" || params.serviceMatchesUpdateRoot === true);
}
function resolvePostUpdateServiceStateReadEnv(params) {
	const fallbackEnv = params.processEnv ?? process.env;
	return params.updateMode === "git" || isPackageManagerUpdateMode(params.updateMode) ? params.preManagedServiceEnv ?? fallbackEnv : fallbackEnv;
}
async function tryInstallShellCompletion(opts) {
	try {
		await tryWriteCompletionCache(opts.root, opts.jsonMode);
	} catch (err) {
		if (!opts.jsonMode) {
			const completionCacheRefreshCommand = formatCliCommand("openclaw completion --write-state");
			defaultRuntime.log(theme.warn(`Completion cache update failed: ${formatErrorMessage(err)}. Update will continue; retry with: ${completionCacheRefreshCommand}`));
		}
	}
	if (opts.jsonMode || !process.stdin.isTTY) return;
	try {
		const status = await checkShellCompletionStatus(CLI_NAME);
		const generationOptions = { generationMode: "core-only" };
		if (status.usesSlowPattern) {
			defaultRuntime.log(theme.muted("Upgrading shell completion to cached version..."));
			if (!await ensureCompletionCacheExists("openclaw", generationOptions)) throw new Error("completion cache generation failed");
			await installCompletion(status.shell, true, CLI_NAME);
			return;
		}
		if (status.profileInstalled && !status.cacheExists) {
			defaultRuntime.log(theme.muted("Regenerating shell completion cache..."));
			if (!await ensureCompletionCacheExists("openclaw", generationOptions)) throw new Error("completion cache generation failed");
			return;
		}
		if (!status.profileInstalled && !opts.skipPrompt) {
			defaultRuntime.log("");
			defaultRuntime.log(theme.heading("Shell completion"));
			const shouldInstall = await confirm({
				message: stylePromptMessage(`Enable ${status.shell} shell completion for ${CLI_NAME}?`),
				initialValue: true
			});
			if (isCancel(shouldInstall) || !shouldInstall) {
				defaultRuntime.log(theme.muted(`Skipped. Run \`${formatCliCommand("openclaw completion --install")}\` later to enable.`));
				return;
			}
			if (!await ensureCompletionCacheExists("openclaw", generationOptions)) throw new Error("completion cache generation failed");
			await installCompletion(status.shell, false, CLI_NAME);
		}
	} catch (err) {
		const message = formatErrorMessage(err);
		defaultRuntime.log(theme.warn(`Shell completion refresh failed: ${message}. Update will continue. Resolve the reported error before retrying: ${formatCliCommand("openclaw completion --write-state --install")}`));
	}
}
async function maybeRestartService(params) {
	const run = params.opts.run;
	const executor = run?.executorFence;
	const assertCurrent = () => {
		if (params.opts.run !== run || run?.executorFence !== executor) throw new Error("Native restart lost its original update executor.");
		executor?.assertCurrent();
	};
	assertCurrent();
	const invocationEnv = resolveServiceRefreshEnv(process.env, params.invocationCwd);
	const serviceEnv = resolveServiceRefreshEnv(params.serviceEnv ?? invocationEnv, params.invocationCwd);
	const recordPhase = (phase) => {
		assertCurrent();
		if (params.opts.run) recordUpdateRunPhase(params.opts.run.runId, phase, void 0, { env: params.opts.run.env });
	};
	const failed = async (outcome = "failed") => {
		recordPhase("verifying");
		await recordFailedUpdateGatewayState(params.opts.run, serviceEnv, assertCurrent);
		assertCurrent();
		return outcome;
	};
	if (params.shouldRestart) {
		const message = resolveGatewayServiceManagementBlockMessageForUpdate(invocationEnv) ?? resolveGatewayServiceManagementBlockMessageForUpdate(serviceEnv);
		if (message) {
			defaultRuntime.error(message);
			return await failed();
		}
	}
	let activation = {
		...params,
		invocationEnv,
		serviceEnv,
		assertCurrent,
		onWarnings: (warnings) => recordServiceReconciliationWarnings(params.result, warnings, run, assertCurrent)
	};
	const verdict = activation.serviceUpdateVerdict;
	let preserveDefinition = verdict?.kind === "unresolved" || verdict?.kind === "owned" && !verdict.refreshDefinition;
	if (params.definitionRecovery?.backup || params.definitionRecovery?.preserved) {
		activation.refreshServiceEnv = false;
		activation.serviceRuntimeRefreshRequired = false;
		preserveDefinition = true;
	}
	const requiresInstallRootRefresh = verdict?.kind === "owned" && verdict.requiresInstallRootRefresh;
	const isPackageUpdate = isPackageManagerUpdateMode(activation.result.mode);
	const canRestartUpdatedInstall = () => preserveDefinition || isPackageUpdate && (activation.refreshServiceEnv || activation.serviceInstallEnv === null || activation.requireRunningServiceAfterRestart);
	if (preserveDefinition && !params.definitionRecovery?.backup) defaultRuntime.error("Gateway service definition left unchanged; ask its deployment owner to repair stale metadata if needed.");
	if (activation.serviceMutationSkipMessage) {
		recordServiceReconciliationWarning(activation.result, activation.serviceEnv, activation.serviceMutationSkipMessage);
		return "ok";
	}
	const reconciliationPending = async () => {
		if (activation.requireRunningServiceAfterRestart) recordServiceReconciliationWarning(activation.result, activation.serviceEnv, `The previous service installation was not restarted automatically because update state may have changed. Inspect \`${formatCliCommand("openclaw gateway status --deep", activation.serviceEnv)}\` before choosing a recovery installation.`);
		await recordFailedUpdateGatewayState(params.opts.run, activation.serviceEnv, assertCurrent);
		assertCurrent();
		return "reconciliation-pending";
	};
	let activationAccepted = false;
	let childReadinessPending = false;
	let updatedInstallRestartNeedsServiceRootProof = false;
	const verifyRestartedGateway = async (expectedGatewayVersion, expectedGatewayBuildId, opts = {}) => {
		recordPhase("verifying");
		const verification = await verifyUpdatedGateway({
			result: activation.result,
			opts: activation.opts,
			serviceEnv: activation.serviceEnv,
			gatewayPort: activation.gatewayPort,
			timeoutMs: activation.timeoutMs,
			nodeRunner: activation.nodeRunner,
			expectedVersion: expectedGatewayVersion,
			expectedBuildId: expectedGatewayBuildId,
			requireRunningService: opts.requireRunningService,
			health: opts.health,
			onVerified: params.onVerified,
			assertCurrent,
			recoverHealth: async (initialHealth, reinspect) => {
				assertCurrent();
				if (childReadinessPending || opts.recoverHealth === false) return {
					health: initialHealth,
					launchAgentRecovery: null
				};
				let health = initialHealth;
				if (!health.healthy && health.staleGatewayPids.length > 0) {
					if (!activation.opts.json) defaultRuntime.log(theme.warn(`Found stale gateway process(es) after restart: ${health.staleGatewayPids.join(", ")}. Cleaning up...`));
					const terminated = await terminateStaleGatewayPids(health.staleGatewayPids, {
						env: activation.serviceEnv,
						assertCurrent
					});
					assertCurrent();
					const currentOwner = readGatewayOwnerLease({ env: activation.serviceEnv });
					if (terminated.length > 0 && (!currentOwner || currentOwner.state === "dead") && (canRestartUpdatedInstall() || !isPackageUpdate)) activationAccepted = await runUpdatedInstallGatewayCommand(activation, "restart") === "accepted";
					health = await reinspect();
				}
				const recovery = await recoverLaunchAgentAndRecheckGatewayHealth({
					updateRun: params.opts.run,
					assertCurrent,
					preserveDefinition,
					health,
					service: resolveGatewayService(),
					port: activation.gatewayPort,
					timeoutMs: activation.timeoutMs,
					expectedVersion: expectedGatewayVersion,
					...expectedGatewayBuildId ? { expectedBuildId: expectedGatewayBuildId } : {},
					requirePluginHealth: false,
					env: activation.serviceEnv
				});
				assertCurrent();
				if (recovery.launchAgentRecovery?.attempted) activationAccepted = recovery.launchAgentRecovery.recovered;
				return recovery;
			}
		});
		assertCurrent();
		if (verification.stopReason === "still-starting" && activation.result.status !== "error") activation.result.reason = "still-starting";
		if (verification.stopReason === "gateway-readiness-pending" || verification.stopReason === "still-starting") return "readiness-pending";
		if (!verification.ok) params.onVerificationFailure?.(verification.summary);
		else if (verification.pluginWarnings?.length) params.onPluginWarnings?.(verification.pluginWarnings);
		return verification.ok ? "ok" : void 0;
	};
	if (activation.shouldRestart) {
		if ((requiresInstallRootRefresh || activation.serviceRuntimeRefreshRequired) && (!activation.refreshServiceEnv || activation.serviceInstallEnv === null)) {
			defaultRuntime.error("The updated installation requires a writable gateway service definition.");
			return await failed();
		}
		if (!activation.opts.json) {
			defaultRuntime.log("");
			defaultRuntime.log(theme.heading("Restarting service..."));
		}
		try {
			const expectedIdentity = activation.expectedGatewayIdentity ?? activation.result.after;
			let expectedGatewayVersion = normalizeOptionalString(expectedIdentity?.version);
			const expectedGatewayBuildId = normalizeOptionalString(expectedIdentity?.buildId);
			const canVerifyUpdatedGatewayByVersion = expectedGatewayVersion !== void 0 && expectedGatewayVersion !== normalizeOptionalString(activation.result.before?.version);
			let restarted = false;
			let restartInitiated = false;
			let refreshedGatewayHealth;
			let restartScriptPath = preserveDefinition ? null : activation.restartScriptPath;
			if (activation.refreshServiceEnv && activation.serviceInstallEnv !== null) {
				try {
					recordPhase("restarting");
					await runUpdatedInstallGatewayCommand(activation, "install");
					if (expectedGatewayVersion && (isPackageUpdate || expectedGatewayBuildId) && !(process.platform === "win32" && requiresInstallRootRefresh)) {
						recordPhase("verifying");
						const service = resolveGatewayService();
						const supervisorKeepsAlive = await hasLoadedLaunchdKeepAliveSupervisor({
							service,
							env: activation.serviceEnv
						});
						assertCurrent();
						const health = await waitForGatewayHealthyRestart({
							service,
							port: activation.gatewayPort,
							timeoutMs: activation.timeoutMs,
							expectedVersion: expectedGatewayVersion,
							...expectedGatewayBuildId ? { expectedBuildId: expectedGatewayBuildId } : {},
							requirePluginHealth: false,
							env: activation.serviceEnv,
							requireRunningService: true,
							settle: { probes: 12 },
							supervisorKeepsAlive
						});
						assertCurrent();
						refreshedGatewayHealth = health.healthy || health.waitOutcome === "timeout" || health.waitOutcome === "still-starting" ? health : void 0;
						recordUpdateGatewayHealth(params.opts.run, health, activation.gatewayPort);
					}
				} catch (err) {
					if (hasCommandProcessCleanupError(err)) throw err;
					assertCurrent();
					if (err instanceof UpdateCommandRecoveryPendingError) throw err;
					const warning = `Failed to reconcile gateway service with ${activation.result.root ?? "the updated install"}: ${String(err)}. Run \`${formatCliCommand("openclaw gateway install --force", activation.serviceEnv)}\`, then \`${formatCliCommand("openclaw gateway restart", activation.serviceEnv)}\`.`;
					recordServiceReconciliationWarning(activation.result, activation.serviceEnv, warning);
					if (activation.serviceRuntimeRefreshRequired) {
						params.onVerificationFailure?.("service-runtime-refresh-failed");
						throw err;
					}
					if (activation.definitionRecovery?.unverified) {
						params.onVerificationFailure?.("service-definition-rollback-unverified");
						throw err;
					}
					if (requiresInstallRootRefresh) return await reconciliationPending();
					if (DEFINITION_DENIAL.test(String(err))) {
						preserveDefinition = true;
						if (verdict?.kind !== "owned") throw err;
						const state = await readGatewayServiceState(resolveGatewayService(), {
							env: activation.serviceEnv,
							requireEffective: true,
							requireLoadedCommand: true,
							validateEnvBeforeStatusRead: assertGatewayServiceManagementAllowedForUpdate,
							timeoutMs: activation.timeoutMs
						});
						assertCurrent();
						await revalidateManagedGatewayServiceAfterUpdate({
							state,
							root: activation.result.root ?? verdict.root,
							preManagedServiceStop: {
								serviceManagerUid: activation.serviceManagerUid,
								serviceEnv: activation.serviceEnv,
								serviceUpdateVerdict: {
									...verdict,
									refreshDefinition: false
								}
							}
						});
						assertCurrent();
						activation = {
							...activation,
							serviceEnv: state.env,
							gatewayPort: await resolveUpdatedGatewayRestartPort({
								serviceEnv: state.env,
								serviceCommand: state.command
							})
						};
						assertCurrent();
						expectedGatewayVersion = normalizeOptionalString(activation.result.after?.version);
						restartScriptPath = null;
					}
					if (isPackageUpdate) {
						restartScriptPath = null;
						updatedInstallRestartNeedsServiceRootProof = !canVerifyUpdatedGatewayByVersion;
					}
				}
				if (requiresInstallRootRefresh && await gatewayServiceCommandUsesRoot({
					root: activation.result.root,
					env: activation.serviceEnv
				}) !== true) {
					recordServiceReconciliationWarning(activation.result, activation.serviceEnv, `Gateway service still points outside the updated install ${activation.result.root}. Run \`${formatCliCommand("openclaw gateway install --force", activation.serviceEnv)}\`, then \`${formatCliCommand("openclaw gateway restart", activation.serviceEnv)}\`.`);
					return await reconciliationPending();
				}
			}
			if (refreshedGatewayHealth) return await verifyRestartedGateway(expectedGatewayVersion, expectedGatewayBuildId, {
				requireRunningService: true,
				health: refreshedGatewayHealth
			}) ?? await failed("restart-health-failed");
			if (restartScriptPath) {
				if (!preserveDefinition) await createUpdateConfigSnapshot();
				recordPhase("restarting");
				activationAccepted = await runRestartScript(restartScriptPath, activation.timeoutMs);
				assertCurrent();
				restartInitiated = true;
			} else if (canRestartUpdatedInstall() || !isPackageUpdate && !activation.skipLegacyServiceRestart) {
				if (!preserveDefinition) await createUpdateConfigSnapshot();
				recordPhase("restarting");
				const restart = await runUpdatedInstallGatewayCommand(activation, "restart").catch((error) => {
					if (!(error instanceof GatewayRestartHealthError)) throw error;
					childReadinessPending = true;
					defaultRuntime.error("Gateway is not ready yet; continuing update readiness verification.");
					return "accepted";
				});
				restarted = true;
				activationAccepted = restart === "accepted";
				if (updatedInstallRestartNeedsServiceRootProof && await gatewayServiceCommandUsesRoot({
					root: activation.result.root,
					env: activation.serviceEnv
				}) !== true) {
					if (!activation.opts.json) defaultRuntime.log(theme.warn("Gateway service did not point at the updated install after restart."));
					return await failed();
				}
			} else if (!activation.opts.json) defaultRuntime.log(theme.muted("Gateway: restart skipped (no installed service found)."));
			if (restartInitiated || restarted && (preserveDefinition || expectedGatewayVersion !== void 0 || activation.result.mode === "git") || activation.requireRunningServiceAfterRestart) {
				const requireRunningService = updatedInstallRestartNeedsServiceRootProof || activation.requireRunningServiceAfterRestart;
				const restartHealthy = await verifyRestartedGateway(expectedGatewayVersion, expectedGatewayBuildId, { requireRunningService });
				if (!restartHealthy) {
					if (!activation.opts.json) defaultRuntime.log("");
					return await failed(activationAccepted ? "restart-health-failed" : "failed");
				}
				if (restartHealthy === "readiness-pending") return restartHealthy;
				if (!activation.opts.json && restartInitiated) {
					defaultRuntime.log(theme.success("Daemon restart completed."));
					defaultRuntime.log("");
				}
			}
			if (!activation.opts.json && restarted && !preserveDefinition) {
				defaultRuntime.log(theme.success("Daemon restarted successfully."));
				defaultRuntime.log("");
			}
		} catch (err) {
			if (hasCommandProcessCleanupError(err)) throw err;
			assertCurrent();
			if (err instanceof UpdateCommandRecoveryPendingError) throw err;
			if (err instanceof GatewayRestartHealthError && !updatedInstallRestartNeedsServiceRootProof) return await verifyRestartedGateway(normalizeOptionalString((activation.expectedGatewayIdentity ?? activation.result.after)?.version), normalizeOptionalString((activation.expectedGatewayIdentity ?? activation.result.after)?.buildId), {
				requireRunningService: true,
				recoverHealth: false
			}) ?? await failed("restart-health-failed");
			defaultRuntime.error(`Gateway: restart failed: ${String(err)}. Code update remains installed; a service stopped for update may still be stopped. Run \`${formatCliCommand("openclaw gateway status --deep", activation.serviceEnv)}\` and ask its service owner to restart it manually.`);
			return await failed();
		}
	} else if (!activation.opts.json) {
		defaultRuntime.log("");
		defaultRuntime.log(theme.muted("Gateway: restart skipped (--no-restart)."));
		if (activation.result.mode === "npm" || activation.result.mode === "pnpm") defaultRuntime.log(theme.muted(`Tip: Run \`${formatCliCommand("openclaw doctor", activation.serviceEnv)}\`, then \`${formatCliCommand("openclaw gateway restart", activation.serviceEnv)}\` to apply updates to a running gateway.`));
		else defaultRuntime.log(theme.muted(`Tip: Run \`${formatCliCommand("openclaw gateway restart", activation.serviceEnv)}\` to apply updates to a running gateway.`));
	}
	return "ok";
}
//#endregion
export { prepareRestartScript as a, tryInstallShellCompletion as i, resolvePostUpdateServiceStateReadEnv as n, shouldPrepareUpdatedInstallRestart as r, maybeRestartService as t };
