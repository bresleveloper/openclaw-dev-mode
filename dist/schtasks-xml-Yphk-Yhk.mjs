import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { t as resolveServiceManagerEnv } from "./service-process-env-C6isS50W.mjs";
import { i as assertGatewayServiceUpdateCurrent } from "./service-update-authority-CoX8GMUL.mjs";
import { r as publishServiceFile } from "./service-stage-DxRqPldv.mjs";
import { n as escapeXml } from "./xml-mfWEXuUN.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/daemon/schtasks-exec.ts
/** Executes Windows Task Scheduler commands with daemon-friendly timeouts. */
const SCHTASKS_TIMEOUT_MS = 15e3;
const SCHTASKS_NO_OUTPUT_TIMEOUT_MS = 3e4;
/** Runs Windows schtasks with bounded timeouts and normalized process results. */
async function execSchtasks(args) {
	assertGatewayServiceUpdateCurrent();
	const result = await runCommandWithTimeout(["schtasks", ...args], {
		baseEnv: resolveServiceManagerEnv(),
		timeoutMs: SCHTASKS_TIMEOUT_MS,
		noOutputTimeoutMs: SCHTASKS_NO_OUTPUT_TIMEOUT_MS
	});
	const timeoutDetail = result.termination === "timeout" ? `schtasks timed out after ${SCHTASKS_TIMEOUT_MS}ms` : result.termination === "no-output-timeout" ? `schtasks produced no output for ${SCHTASKS_NO_OUTPUT_TIMEOUT_MS}ms` : result.termination !== "exit" ? "schtasks command terminated before confirmed completion" : "";
	return {
		stdout: result.stdout,
		stderr: result.stderr || timeoutDetail,
		code: result.termination === "exit" ? result.code ?? 1 : result.code || 124
	};
}
//#endregion
//#region src/daemon/schtasks-xml.ts
function buildScheduledTaskXml(params) {
	const description = escapeXml(params.taskDescription);
	const command = escapeXml(params.launchPath);
	const principalLogon = params.taskUser ? `\n      <UserId>${escapeXml(params.taskUser)}</UserId>\n      <LogonType>InteractiveToken</LogonType>` : "\n      <GroupId>S-1-5-32-545</GroupId>";
	return `<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>${description}</Description>
  </RegistrationInfo>
  <Triggers>
    <LogonTrigger>
      <Enabled>true</Enabled>${params.taskUser ? `\n      <UserId>${escapeXml(params.taskUser)}</UserId>` : ""}
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
//#endregion
export { writeTaskXmlTempFile as n, execSchtasks as r, buildScheduledTaskXml as t };
