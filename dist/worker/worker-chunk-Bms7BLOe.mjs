import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{n as t,t as n}from"./worker-chunk-Bm4E9FUt.mjs";import{o as r,t as i}from"./worker-chunk-D9mUvWOb.mjs";import{n as a,r as o}from"./worker-chunk-C4y8pKOu.mjs";import{c as s,o as c}from"./worker-chunk-DpPqVcJi.mjs";import{i as l,n as u}from"./worker-chunk-14wQ-8uT.mjs";import d from"node:os";import f from"node:path";import p from"node:fs/promises";async function execSchtasks(e){c();let n=await r([`schtasks`,...e],{baseEnv:t(),timeoutMs:m,noOutputTimeoutMs:h}),i=n.termination===`timeout`?`schtasks timed out after ${m}ms`:n.termination===`no-output-timeout`?`schtasks produced no output for ${h}ms`:n.termination===`exit`?``:`schtasks command terminated before confirmed completion`;return{stdout:n.stdout,stderr:n.stderr||i,code:n.termination===`exit`?n.code??1:n.code||124}}var m,h,g=e((()=>{i(),n(),s(),m=15e3,h=3e4}));function buildScheduledTaskXml(e){let t=a(e.taskDescription),n=a(e.launchPath),r=e.taskUser?`\n      <UserId>${a(e.taskUser)}</UserId>\n      <LogonType>InteractiveToken</LogonType>`:`
      <GroupId>S-1-5-32-545</GroupId>`;return`<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>${t}</Description>
  </RegistrationInfo>
  <Triggers>
    <LogonTrigger>
      <Enabled>true</Enabled>${e.taskUser?`\n      <UserId>${a(e.taskUser)}</UserId>`:``}
    </LogonTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">${r}
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
      <Command>${n}</Command>
    </Exec>
  </Actions>
</Task>`}async function writeTaskXmlTempFile(e){let t=await p.mkdtemp(f.join(d.tmpdir(),`openclaw-task-xml-`)),n=f.join(t,`task.xml`),r=Buffer.from([255,254]),i=Buffer.from(e,`utf16le`);return await l({filePath:n,contents:Buffer.concat([r,i]),mode:384}),n}var _=e((()=>{o(),u()}));export{g as a,execSchtasks as i,_ as n,writeTaskXmlTempFile as r,buildScheduledTaskXml as t};