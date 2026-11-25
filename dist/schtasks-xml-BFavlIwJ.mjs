import{t as getWindowsCmdExePath}from"./windows-install-roots-DhwMsIDT.mjs";import{n as escapeXml}from"./xml-CHe3sJCs.mjs";import{i as publishServiceFile}from"./service-stage-CXefWaf5.mjs";import path from"node:path";import fs from"node:fs/promises";import os from"node:os";
//!src/daemon/schtasks-xml.ts
function buildScheduledTaskXml(e){const t=escapeXml(e.taskDescription);const n=Boolean(e.taskUser&&!e.interactive);const r=escapeXml(n?getWindowsCmdExePath():e.launchPath);const i=n?`\n      <Arguments>${escapeXml(`/d /s /c ""${e.launchPath}""`)}</Arguments>\n      <WorkingDirectory>${escapeXml(path.dirname(e.launchPath))}</WorkingDirectory>`:``;const a=e.taskUser?`\n      <UserId>${escapeXml(e.taskUser)}</UserId>\n      <LogonType>${n?`S4U`:`InteractiveToken`}</LogonType>`:`
      <GroupId>S-1-5-32-545</GroupId>`;const o=e.taskUser?`\n      <UserId>${escapeXml(e.taskUser)}</UserId>`:``;return`<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>${t}</Description>
  </RegistrationInfo>
  <Triggers>${n?`
    <BootTrigger><Enabled>true</Enabled></BootTrigger>`:``}
    <LogonTrigger>
      <Enabled>true</Enabled>${o}
    </LogonTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">${a}
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
      <Command>${r}</Command>${i}
    </Exec>
  </Actions>
</Task>`}async function writeTaskXmlTempFile(e){const t=await fs.mkdtemp(path.join(os.tmpdir(),`openclaw-task-xml-`));const n=path.join(t,`task.xml`);const r=Buffer.from([255,254]);const i=Buffer.from(e,`utf16le`);await publishServiceFile({filePath:n,contents:Buffer.concat([r,i]),mode:384});return n}export{writeTaskXmlTempFile as n,buildScheduledTaskXml as t};