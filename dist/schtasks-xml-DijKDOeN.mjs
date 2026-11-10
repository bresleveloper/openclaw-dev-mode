import { t as resolveServiceManagerEnv } from "./service-process-env-BITMm5ft.mjs";
import { r as getWindowsPowerShellExePath, t as getWindowsCmdExePath } from "./windows-install-roots-BWNEWHjx.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { i as assertGatewayServiceUpdateCurrent } from "./service-update-authority-Ddw1lcTH.mjs";
import { t as execFileUtf8 } from "./exec-file-CvWTTVXI.mjs";
import { n as buildEncodedPowerShellArgs, t as WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS } from "./windows-powershell-spawn-DDmi3G9M.mjs";
import { t as SCHTASKS_TIMEOUT_MS } from "./schtasks-budget-TJJW76pm.mjs";
import { n as escapeXml } from "./xml-mfWEXuUN.mjs";
import { i as publishServiceFile } from "./service-stage-DFb_R12g.mjs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
//#region src/daemon/schtasks-exec.ts
/** Executes Windows Task Scheduler commands with daemon-friendly timeouts. */
const SCHTASKS_NO_OUTPUT_TIMEOUT_MS = 3e4;
/** Runs Windows schtasks with bounded timeouts and normalized process results. */
async function execSchtasks(args) {
	assertGatewayServiceUpdateCurrent();
	const result = await runCommandWithTimeout(["schtasks", ...args], {
		baseEnv: resolveServiceManagerEnv(),
		timeoutMs: SCHTASKS_TIMEOUT_MS,
		noOutputTimeoutMs: SCHTASKS_NO_OUTPUT_TIMEOUT_MS
	});
	const operation = [args[0], args.find((arg) => /^\/(?:DISABLE|ENABLE)$/i.test(arg))].filter(Boolean).join(" ");
	const timeoutDetail = result.termination === "timeout" ? `schtasks ${operation} timed out after ${SCHTASKS_TIMEOUT_MS}ms` : result.termination === "no-output-timeout" ? `schtasks ${operation} produced no output for ${SCHTASKS_NO_OUTPUT_TIMEOUT_MS}ms` : result.termination !== "exit" ? `schtasks ${operation} terminated before confirmed completion` : "";
	return {
		stdout: result.stdout,
		stderr: [timeoutDetail, result.stderr].filter(Boolean).join("\n"),
		code: result.termination === "exit" ? result.code ?? 1 : result.code || 124
	};
}
/** schtasks.exe discards the HRESULT; COM preserves it without parsing translated diagnostics. */
async function execScheduledTaskEnabledChange(taskName, enabled) {
	const script = [
		"$ErrorActionPreference='Stop'",
		"[Console]::OutputEncoding=[Text.UTF8Encoding]::new($false)",
		`$taskName=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${Buffer.from(taskName, "utf8").toString("base64")}'))`,
		"try {",
		"$service=New-Object -ComObject 'Schedule.Service'",
		"$service.Connect()",
		"$task=$service.GetFolder('\\').GetTask($taskName)",
		`$task.Enabled=$${enabled ? "true" : "false"}`,
		"exit 0",
		"} catch {",
		"$exception=$_.Exception",
		"while($null -ne $exception.InnerException){$exception=$exception.InnerException}",
		"[Console]::Out.WriteLine($exception.HResult.ToString([Globalization.CultureInfo]::InvariantCulture))",
		"[Console]::Error.WriteLine($exception.Message)",
		"exit 1",
		"}"
	].join("\n");
	const result = await execFileUtf8(getWindowsPowerShellExePath(), buildEncodedPowerShellArgs(script), { timeout: WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS });
	const nativeCode = result.stdout.trim();
	const hresult = Number(nativeCode);
	return {
		stdout: result.stdout,
		stderr: result.stderr,
		code: result.code,
		...result.termination === "exit" && result.code === 1 && /^-?\d+$/u.test(nativeCode) && Number.isInteger(hresult) && hresult >= -2147483648 && hresult <= 2147483647 ? { hresult } : {}
	};
}
//#endregion
//#region src/daemon/schtasks-xml.ts
function buildScheduledTaskXml(params) {
	const description = escapeXml(params.taskDescription);
	const unattended = Boolean(params.taskUser && !params.interactive);
	const command = escapeXml(unattended ? getWindowsCmdExePath() : params.launchPath);
	const action = unattended ? `\n      <Arguments>${escapeXml(`/d /s /c ""${params.launchPath}""`)}</Arguments>\n      <WorkingDirectory>${escapeXml(path.dirname(params.launchPath))}</WorkingDirectory>` : "";
	const principalLogon = params.taskUser ? `\n      <UserId>${escapeXml(params.taskUser)}</UserId>\n      <LogonType>${unattended ? "S4U" : "InteractiveToken"}</LogonType>` : "\n      <GroupId>S-1-5-32-545</GroupId>";
	const triggerUser = params.taskUser ? `\n      <UserId>${escapeXml(params.taskUser)}</UserId>` : "";
	return `<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>${description}</Description>
  </RegistrationInfo>
  <Triggers>${unattended ? "\n    <BootTrigger><Enabled>true</Enabled></BootTrigger>" : ""}
    <LogonTrigger>
      <Enabled>true</Enabled>${triggerUser}
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
      <Command>${command}</Command>${action}
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
//#endregion
export { execSchtasks as i, writeTaskXmlTempFile as n, execScheduledTaskEnabledChange as r, buildScheduledTaskXml as t };
