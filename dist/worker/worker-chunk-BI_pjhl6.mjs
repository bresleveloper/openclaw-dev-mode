import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{r as t,s as n,t as r}from"./worker-chunk-BHuxdRYS.mjs";import{r as i}from"./worker-chunk-BuovFRdN.mjs";import{t as a}from"./worker-chunk-DU1mxazv.mjs";import{n as o,t as s}from"./worker-chunk-CfQi3p0R.mjs";import{n as c,r as l}from"./worker-chunk-B7hMN3WL.mjs";import{c as u,n as d,o as f,t as p}from"./worker-chunk-7jKo-3Ha.mjs";import{n as m,r as h,t as g}from"./worker-chunk-D3Ixhh-X.mjs";import{a as _,n as v}from"./worker-chunk-D2fuJyEN.mjs";import{n as y,t as b}from"./worker-chunk-M1qW6YUK.mjs";import x from"node:os";import S from"node:path";import C from"node:fs/promises";async function execSchtasks(e){f();let t=await i([`schtasks`,...e],{baseEnv:o(),timeoutMs:b}),n=[e[0],e.find(e=>/^\/(?:DISABLE|ENABLE)$/i.test(e))].filter(Boolean).join(` `),r=t.termination===`timeout`?`schtasks ${n} timed out after ${b}ms`:t.termination===`exit`?``:`schtasks ${n} terminated before confirmed completion`;return{stdout:t.stdout,stderr:[r,t.stderr].filter(Boolean).join(`
`),code:t.termination===`exit`?t.code??1:t.code||124}}async function execScheduledTaskEnabledChange(e,n){let r=[`$ErrorActionPreference='Stop'`,`[Console]::OutputEncoding=[Text.UTF8Encoding]::new($false)`,`$taskName=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${Buffer.from(e,`utf8`).toString(`base64`)}'))`,`try {`,`$service=New-Object -ComObject 'Schedule.Service'`,`$service.Connect()`,`$task=$service.GetFolder('\\').GetTask($taskName)`,`$task.Enabled=$${n?`true`:`false`}`,`exit 0`,`} catch {`,`$exception=$_.Exception`,`while($null -ne $exception.InnerException){$exception=$exception.InnerException}`,`[Console]::Out.WriteLine($exception.HResult.ToString([Globalization.CultureInfo]::InvariantCulture))`,`[Console]::Error.WriteLine($exception.Message)`,`exit 1`,`}`].join(`
`),i=await p(t(),m(r),{timeout:g}),a=i.stdout.trim(),o=Number(a);return{stdout:i.stdout,stderr:i.stderr,code:i.code,...i.termination===`exit`&&i.code===1&&/^-?\d+$/u.test(a)&&Number.isInteger(o)&&o>=-2147483648&&o<=2147483647?{hresult:o}:{}}}var w=e((()=>{n(),h(),a(),d(),y(),s(),u()}));function buildScheduledTaskXml(e){let t=c(e.taskDescription),n=!(!e.taskUser||e.interactive),i=c(n?r():e.launchPath),a=n?`\n      <Arguments>${c(`/d /s /c ""${e.launchPath}""`)}</Arguments>\n      <WorkingDirectory>${c(S.dirname(e.launchPath))}</WorkingDirectory>`:``,o=e.taskUser?`\n      <UserId>${c(e.taskUser)}</UserId>\n      <LogonType>${n?`S4U`:`InteractiveToken`}</LogonType>`:`
      <GroupId>S-1-5-32-545</GroupId>`,s=e.taskUser?`\n      <UserId>${c(e.taskUser)}</UserId>`:``;return`<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>${t}</Description>
  </RegistrationInfo>
  <Triggers>${n?`
    <BootTrigger><Enabled>true</Enabled></BootTrigger>`:``}
    <LogonTrigger>
      <Enabled>true</Enabled>${s}
    </LogonTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">${o}
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
      <Command>${i}</Command>${a}
    </Exec>
  </Actions>
</Task>`}async function writeTaskXmlTempFile(e){let t=await C.mkdtemp(S.join(x.tmpdir(),`openclaw-task-xml-`)),n=S.join(t,`task.xml`),r=Buffer.from([255,254]),i=Buffer.from(e,`utf16le`);return await _({filePath:n,contents:Buffer.concat([r,i]),mode:384}),n}var T=e((()=>{n(),l(),v()}));export{execSchtasks as a,execScheduledTaskEnabledChange as i,T as n,w as o,writeTaskXmlTempFile as r,buildScheduledTaskXml as t};