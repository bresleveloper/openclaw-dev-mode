import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{n as t}from"./worker-chunk-CCKYVIGs.mjs";import{l as n,t as r}from"./worker-chunk-Cv5ZALVS.mjs";import{o as i}from"./worker-chunk-uw49siUx.mjs";import{i as a}from"./worker-chunk-Cb82E_9i.mjs";import{i as o}from"./worker-chunk-C_Zfi3Hc.mjs";import{n as s,t as c}from"./worker-chunk-BzEJpX8O.mjs";import{n as l,t as u}from"./worker-chunk-DTHUxFC6.mjs";import{a as d,r as f}from"./worker-chunk-Dh15Rmz2.mjs";import{a as p,c as ee,o as m,s as h}from"./worker-chunk-Ba9i2f3Y.mjs";import{t as g}from"./worker-chunk-Ca0Xwy_g.mjs";import{c as _,n as v}from"./worker-chunk-Ystv7m43.mjs";import{n as y,t as b}from"./worker-chunk-fnMJJG0a.mjs";import{n as te}from"./worker-chunk-BCayKjPf.mjs";import{u as ne}from"./worker-chunk-D5HIXpZv.mjs";import{n as re}from"./worker-chunk-TnSJweYc.mjs";import{c as ie}from"./worker-chunk-0SEMnZfQ.mjs";import{i as ae}from"./worker-chunk-BPAboNOm.mjs";import{s as oe}from"./worker-chunk-DjuK_SqH.mjs";import{i as se}from"./worker-chunk-Cy57x2iC.mjs";import{n as ce,t as le}from"./worker-chunk-DoEXAJ3w.mjs";import{a as ue}from"./worker-chunk-DEg8xDZo.mjs";import{n as de}from"./worker-chunk-BzFAGbQj.mjs";import{s as fe}from"./worker-chunk-Du7XIXf7.mjs";import{E as pe,d as me,p as x,r as S}from"./worker-chunk-BpZ9KP2G.mjs";import{t as C}from"./worker-chunk-Py1xH8Kq.mjs";import{a as w,t as T}from"./worker-chunk-DCWNwHIu.mjs";import{n as E}from"./worker-chunk-DMR__E4n.mjs";import{n as D,r as O}from"./worker-chunk-B7hMN3WL.mjs";import{n as k}from"./worker-chunk-Dhvk_EI-.mjs";import{n as A,s as j}from"./worker-chunk-BUNPeVFd.mjs";import{t as M}from"./worker-chunk-DSm8NkMR.mjs";import{n as N,t as P}from"./worker-chunk-DTH4Xv7y.mjs";import F from"node:os";import I from"node:path";import{chmod as L,mkdir as R,open as z,readFile as he,rm as ge,unlink as _e,writeFile as B}from"node:fs/promises";import{createHash as V}from"node:crypto";import{setTimeout as ve}from"node:timers/promises";import{StringDecoder as ye}from"node:string_decoder";var be=e((()=>{ie(),ue(),oe(),ae(),ce(),se(),le({table:`durable_background_processes`,operationLabel:`durable-process.schema.ensure`})})),xe=e((()=>{E(),ne(),de(),te(),C(),fe()}));async function runDurableControlCommand(e,t,n){try{let r=_(e[0],{env:process.env,cwd:process.cwd()});if(!r)throw n();let i=await(await b().spawn({mode:`child`,argv:[r,...e.slice(1)],env:process.env,exactEnv:!0,cleanupOwnership:`external`,stdinMode:`pipe-closed`,timeoutMs:15e3,maxCapturedOutputChars:H,...t})).wait();if(i.reason!==`exit`||i.stdout.length>=H)throw n();return i}catch{throw n()}}var H,U=e((()=>{v(),y(),H=256e3})),W,Se=e((()=>{W=String.raw`"use strict";
const fs = require("node:fs");
const { spawn } = require("node:child_process");
const specPath = process.argv[2];
const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
fs.unlinkSync(specPath);
const startedAt = Date.now();
const save = (value) => {
  const temp = spec.statusPath + ".tmp";
  fs.writeFileSync(temp, JSON.stringify(value), { mode: 0o600 });
  fs.renameSync(temp, spec.statusPath);
};
let pgid, exit, timedOut = false, finished = false, killTimer;
const finish = (result) => {
  if (finished) return;
  finished = true;
  save({ phase: "exited", ...result, durationMs: Date.now() - startedAt });
  process.exit(0);
};
// EPERM proves a process still holds the group; only ESRCH proves it empty.
const groupAlive = () => {
  try {
    process.kill(-pgid, 0);
    return true;
  } catch (error) {
    return error.code !== "ESRCH";
  }
};
const signalGroup = (signal) => {
  try {
    process.kill(-pgid, signal);
  } catch {}
};
const stop = () => {
  if (pgid === undefined) return;
  signalGroup("SIGTERM");
  killTimer ??= setTimeout(() => signalGroup("SIGKILL"), spec.killGraceMs);
};
for (const signal of ["SIGTERM", "SIGINT", "SIGHUP"]) process.on(signal, stop);
const drain = () => {
  if (groupAlive()) {
    setTimeout(drain, 200);
    return;
  }
  finish({
    exitCode: exit.code,
    exitSignal: exit.signal,
    reason: timedOut ? "overall-timeout" : exit.signal ? "signal" : "exit",
  });
};
const failStart = (error) => {
  try {
    fs.appendFileSync(spec.logPath, "Durable process failed to start: " + error.message + "\n");
  } catch {}
  finish({ exitCode: null, exitSignal: null, reason: "spawn-error" });
};
let child;
try {
  const log = fs.openSync(spec.logPath, "a");
  try {
    child = spawn(spec.argv[0], spec.argv.slice(1), {
      cwd: spec.cwd,
      env: spec.env,
      stdio: ["ignore", log, log],
      detached: true,
    });
  } finally {
    fs.closeSync(log);
  }
} catch (error) {
  failStart(error);
}
child.once("error", (error) => {
  if (pgid === undefined) failStart(error);
});
if (child.pid !== undefined) {
  pgid = child.pid;
  // Accepted edge case: if this write fails (disk full), the wrapper dies and the command
  // runs on unsupervised; the Gateway reports its outcome as unknown.
  save({ phase: "running", pgid, startedAt });
  child.once("exit", (code, signal) => {
    exit = { code, signal };
    drain();
  });
  if (spec.timeoutMs > 0) {
    setTimeout(() => {
      timedOut = true;
      stop();
    }, spec.timeoutMs);
  }
}
`}));function durableProcessUnitName$1(e){return`${r}${V(`sha256`).update(e).digest(`hex`)}`}function assertLabel(e){if(!(/* @__PURE__ */ RegExp(`^ai\\.openclaw\\.durable-proc\\.[a-f0-9]{64}$`)).test(e))throw Error(`Invalid durable process job identity.`)}async function requireDurableProcessHost$1(){try{if(process.platform!==`darwin`||typeof process.getuid!=`function`)throw failure$1();let e=await command$1([`launchctl`,`managername`]);if(e.exitCode!==0||e.stdout.trim()!==`Aqua`)throw failure$1()}catch{throw Error(G)}}async function readStatus(e){let n;try{n=await he(file(e,`.status.json`),`utf8`)}catch(e){if(t(e,`ENOENT`))return;throw e}return JSON.parse(n)}async function listJob(e){let t=await command$1([`launchctl`,`list`]),[n,...r]=t.stdout.split(`
`);if(t.exitCode!==0||n?.trim().split(/\s+/).join(` `)!==`PID Status Label`)throw failure$1();for(let t of r){let n=t.split(`	`);if(n[2]!==e)continue;let r=n[0]===`-`?void 0:Number(n[0]),i=Number(n[1]);if(r!==void 0&&!(Number.isInteger(r)&&r>0)||!Number.isInteger(i))throw failure$1();return{pid:r,status:i}}}function groupAlive({pgid:e,startedAt:n}){if(Date.now()-F.uptime()*1e3>n)return!1;try{return process.kill(-e,0),!0}catch(e){return!t(e,`ESRCH`)}}function exited(e){return{state:`exited`,exitCode:e.exitCode,exitSignal:e.exitSignal,reason:e.reason,result:e.reason,durationMs:e.durationMs}}async function readDurableProcess$1(e){assertLabel(e);let t=await readStatus(e);if(t?.phase===`exited`)return exited(t);let n=await listJob(e),r=await readStatus(e);return r?.phase===`exited`?exited(r):n?.pid?{state:`running`,pid:n.pid}:r?.phase===`running`?t?.phase!==`running`||groupAlive(r)?{state:`running`}:{state:`exited`,exitCode:null,exitSignal:null,reason:`spawn-error`,result:`supervisor-lost`,note:q}:n?n.status===0?{state:`running`}:{state:`exited`,exitCode:null,exitSignal:null,reason:`spawn-error`,result:`launchd-status-${n.status}`,note:q}:{state:`missing`}}async function launchDurableProcess$1(e){let n=durableProcessUnitName$1(e.id),r=V(`sha256`).update(W).digest(`hex`),i=I.join(directory(),`durable-wrapper-${r.slice(0,16)}.cjs`);await B(i,W,{flag:`wx`,mode:384}).catch(e=>{if(!t(e,`EEXIST`))throw e});let a=file(n,`.spec.json`),o={argv:e.argv,cwd:e.cwd,env:e.env,logPath:e.logPath,statusPath:file(n,`.status.json`),timeoutMs:e.timeoutMs??0,killGraceMs:K};await B(a,JSON.stringify(o),{flag:`wx`,mode:384});let strings=e=>e.map(e=>`<string>${D(e)}</string>`).join(``),s=file(n,`.plist`);if(await B(s,`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>Label</key><string>${n}</string>
<key>ProgramArguments</key><array>${strings([process.execPath,i,a])}</array>
<key>WorkingDirectory</key>${strings([directory()])}
<key>RunAtLoad</key><true/>
<key>KeepAlive</key><false/>
<key>ProcessType</key><string>Interactive</string>
<key>ExitTimeOut</key><integer>15</integer>
<key>SoftResourceLimits</key><dict><key>Core</key><integer>0</integer></dict>
<key>HardResourceLimits</key><dict><key>Core</key><integer>0</integer></dict>
<key>StandardOutPath</key>${strings([e.logPath])}
<key>StandardErrorPath</key>${strings([e.logPath])}
</dict></plist>
`,{flag:`wx`}),await L(s,420),(await command$1([`launchctl`,`bootstrap`,domain(),s],{assertCurrent:e.assertCurrent,initiateSpawn:e.initiateSpawn})).exitCode!==0)throw failure$1();return{unitName:n}}async function stopDurableProcess$1(e,t={}){assertLabel(e);let n=Date.now()+K+5e3,r=!1,i=await readDurableProcess$1(e);for(;i.state===`running`;){if(i.pid&&!r&&(r=(await command$1([`launchctl`,`kill`,`SIGTERM`,`${domain()}/${e}`],t)).exitCode===0),Date.now()>n)throw failure$1();await ve(250),i=await readDurableProcess$1(e)}}async function cleanupDurableProcess$1(e,t){if(assertLabel(e),(await command$1([`launchctl`,`bootout`,`${domain()}/${e}`],t)).exitCode!==0&&await listJob(e))throw failure$1();for(let t of[`.plist`,`.spec.json`,`.status.json`,`.status.json.tmp`])await ge(file(e,t),{force:!0})}var G,K,failure$1,q,command$1,domain,directory,file,J,Ce=e((()=>{i(),n(),o(),O(),U(),Se(),G=`Durable exec requires Gateway-host execution on Linux with systemd 250 or newer, or on macOS from a logged-in user's GUI (Aqua) session. Use ordinary background exec on unsupported hosts.`,K=1e4,failure$1=()=>/* @__PURE__ */ Error("Durable process control was not confirmed; inspect process status and `launchctl list` before retrying."),q=`
Durable process supervisor ended before recording the outcome; outcome unknown. Check saved output and side effects before repeating work.
`,command$1=(e,t={})=>runDurableControlCommand(e,t,failure$1),domain=()=>`gui/${process.getuid()}`,directory=()=>I.join(a(),`processes`),file=(e,t)=>I.join(directory(),`${e}${t}`),J={unitName:durableProcessUnitName$1,requireHost:requireDurableProcessHost$1,launch:launchDurableProcess$1,read:readDurableProcess$1,stop:stopDurableProcess$1,cleanup:cleanupDurableProcess$1}}));function durableProcessUnitName(e){return`openclaw-proc-${V(`sha256`).update(e).digest(`hex`)}.service`}function control(e,t,n){if(!/^openclaw-proc-[a-f0-9]{64}\.service$/.test(t))throw Error(`Invalid durable process unit identity.`);return command([`systemctl`,`--user`,`--no-ask-password`,...e,`--`,t],n)}async function requireDurableProcessHost(e=process.env){if(process.platform!==`linux`||!X.some(e=>process.env[e]))throw Error(Y);if(X.some(t=>e[t]!==void 0&&e[t]!==process.env[t]))throw Error(`${Y} Remove user-manager environment overrides.`);try{let e=await(we??=command([`systemctl`,`--user`,`--version`]).then(e=>Number(/^systemd (\d+)/m.exec(e.stdout)?.[1]))),t=await command([`systemctl`,`--user`,`show`,`--property=Version`]);if(!(e>=250)||t.exitCode!==0||!(Number(/^Version=(\d+)/m.exec(t.stdout)?.[1])>=250))throw failure()}catch{throw Error(Y)}}async function launchDurableProcess(e){let t=durableProcessUnitName(e.id),n=await command([`systemctl`,`--user`,`show-environment`]);if(n.exitCode!==0)throw failure();let r=n.stdout.split(`
`).map(e=>/^([A-Za-z_][A-Za-z0-9_]*)=/.exec(e)?.[1]).filter(t=>t&&!(t in e.env)),i=p(),a={Type:`exec`,ExitType:`cgroup`,RemainAfterExit:`yes`,KillMode:`control-group`,TimeoutStopSec:`10s`,LimitCORE:0,StandardInput:`null`,StandardOutput:`append:${e.logPath}`,StandardError:`inherit`,RuntimeMaxSec:e.timeoutMs?`${e.timeoutMs/1e3}s`:`infinity`,MemoryMax:i?.memoryBytes??`infinity`,...i?{MemorySwapMax:i.swapBytes,OOMPolicy:`kill`}:{},UnsetEnvironment:r.join(` `)},o={...e.env};for(let e of X)o[e]=process.env[e];if((await command([`systemd-run`,`--user`,`--quiet`,`--no-ask-password`,`--unit=${t}`,`--description=OpenClaw durable process`,`--working-directory=${e.cwd}`,...Object.entries(a).map(([e,t])=>`--property=${e}=${t}`),...Object.keys(e.env).map(e=>`--setenv=${e}`),`--`,...e.argv.map(e=>e.replaceAll(`$`,()=>`$$`))],{env:o,initiateSpawn:e.initiateSpawn,assertCurrent:e.assertCurrent})).exitCode!==0)throw failure();return{unitName:t}}async function readDurableProcess(e){let t=await control([`show`,`--property=LoadState,ActiveState,SubState,MainPID,ControlGroup,ExecMainCode,ExecMainStatus,Result`],e),n=N(t.stdout,`=`);if(n.loadstate===`not-found`)return{state:`missing`};if(t.exitCode!==0||n.loadstate!==`loaded`)throw failure();if([`activating`,`deactivating`,`reloading`].includes(n.activestate??``)||n.activestate===`active`&&n.substate!==`exited`){let e=n.controlgroup,t=e?.startsWith(`/`)&&!e.split(`/`).includes(`..`)?I.join(`/sys/fs/cgroup`,e):void 0;return{state:`running`,pid:Number(n.mainpid)||void 0,...t?{cgroupDirectory:t}:{}}}let r=Number(n.execmaincode),i=Number(n.execmainstatus),a=r===2||r===3,o=Z[n.result??``]??(a?`signal`:r===1?`exit`:`spawn-error`);return{state:`exited`,exitCode:r===1?i:null,exitSignal:a?i:null,reason:o,result:n.result??`unknown`}}async function stopDurableProcess(e,t){if((await control([`stop`],e,t)).exitCode!==0)throw failure()}async function cleanupDurableProcess(e,t){for(let n of[`stop`,`reset-failed`])if((await control([n],e,t)).exitCode!==0&&(await readDurableProcess(e)).state!==`missing`)throw failure()}var Y,X,Z,we,failure,command,Q,Te=e((()=>{P(),m(),U(),Y=`Durable exec requires Gateway-host execution on Linux, systemd 250 or newer, and a reachable Gateway user's systemd manager (XDG_RUNTIME_DIR or DBUS_SESSION_BUS_ADDRESS). Use ordinary background exec on unsupported hosts.`,X=[`XDG_RUNTIME_DIR`,`DBUS_SESSION_BUS_ADDRESS`],Z={timeout:`overall-timeout`,"oom-kill":`memory-limit`},failure=()=>/* @__PURE__ */ Error(`Durable process control was not confirmed; inspect process status and the systemd user manager before retrying.`),command=(e,t={})=>runDurableControlCommand(e,t,failure),Q={unitName:durableProcessUnitName,requireHost:requireDurableProcessHost,launch:launchDurableProcess,read:readDurableProcess,stop:stopDurableProcess,cleanup:cleanupDurableProcess}}));async function forgetLog(e){await _e(e).catch(e=>{if(!t(e,`ENOENT`))throw e})}async function observe(){for(let e of sessions())await e.durable.observe().catch(warn)}async function startDurableExecProcess(e,t,n={}){if(!$||!e.agentId||!e.sessionKey||t.mode!==`child`)throw Error(`Durable exec requires a Gateway-host session on Linux with systemd 250 or newer and a reachable user manager, or on macOS in a logged-in GUI session; sandbox, node, worker, and one-shot execution are unsupported.`);let r=$;await supervisor().requireHost(t.env);let i=supervisor().unitName(e.id),o=I.join(a(),`processes`,`${i}.log`);await R(I.dirname(o),{recursive:!0,mode:448}),await(await z(o,`wx`,384)).close();let s={id:e.id,agentId:e.agentId,sessionKey:e.sessionKey,scopeKey:e.scopeKey,unitName:i,logPath:o,command:`Durable background exec`,cwd:e.cwd,startedAt:e.startedAt,cleanupMs:e.cleanupMs,maxOutputChars:e.maxOutputChars,notifyOnExit:n.notifyOnExit??e.notifyOnExit,notifyOnExitEmptySuccess:n.notifyOnExitEmptySuccess??e.notifyOnExitEmptySuccess},assertCurrent=()=>{r.assertCurrent(),t.assertCurrent?.(),t.beforeSpawn?.()};await r.upsert(s,assertCurrent);let c=Object.fromEntries(Object.entries(t.env??{}).filter(e=>e[1]!==void 0));try{await supervisor().launch({id:e.id,argv:t.argv,cwd:t.cwd,env:c,logPath:o,timeoutMs:t.timeoutMs,assertCurrent,initiateSpawn:t.initiateSpawn})}catch{S(e,`stderr`,`Durable launch was not confirmed. Check this process and the systemd user manager or launchd before repeating work.
`)}let l=bind(e,s,r);return pe(observe),l}function bind(e,n,r){let i=f(),a=c(),o=Promise.resolve(),s=0,u=!1,p,m,g=new ye(`utf8`),_=A(),enqueue=e=>o=o.catch(warn).then(()=>d(i,e)),observeUnit=async()=>{if(u)return;let i=n.result?{state:`missing`}:await supervisor().read(n.unitName),o=await z(n.logPath,`r`).catch(e=>{if(!t(e,`ENOENT`))throw e});if(o)try{let t=(await o.stat()).size,n=Math.max(s,t-e.maxOutputChars*4);e.truncated||=n>s,e.totalOutputChars+=n-s;let r=Buffer.alloc(Math.max(0,t-n)),{bytesRead:i}=await o.read(r,0,r.length,n);s=n+i,S(e,`stdout`,_(g.write(r.subarray(0,i))))}finally{await o.close()}if(!n.result){if(i.state===`running`){e.pid=i.pid,m=i.cgroupDirectory;return}i.state===`missing`&&!p&&S(e,`stderr`,`
Durable process unit is missing; outcome unknown. Check saved output and side effects before repeating work.
`),i.state===`exited`&&i.note&&S(e,`stderr`,i.note);let t={reason:p??(i.state===`exited`?i.reason:`spawn-error`),exitCode:i.state===`exited`?i.exitCode:null,exitSignal:i.state===`exited`?i.exitSignal:null,durationMs:(i.state===`exited`?i.durationMs:void 0)??Date.now()-n.startedAt},a=Date.now();await r.upsert({...n,result:t,endedAt:a}),n.result=t,n.endedAt=a}await supervisor().cleanup(n.unitName,{assertCurrent:r.assertCurrent}),e.endedAt=n.endedAt,S(e,`stdout`,_(g.end())),u=!0,v(),a.resolve({...n.result,stdout:``,stderr:``,timedOut:n.result.reason===`overall-timeout`,noOutputTimedOut:!1})},cancel=(e,t)=>{let assertCurrent=()=>{r.assertCurrent(),t?.()};return enqueue(async()=>{u||(e===`manual-cancel`&&(n.cancellationRequested=!0),await r.upsert(n,assertCurrent),await supervisor().stop(n.unitName,{assertCurrent}),p??=e,await observeUnit())})},v=l(()=>ee({readUsage:async()=>{if(!m&&!u&&await enqueue(observeUnit),u)return{memoryBytes:0,swapBytes:0};if(!m)throw Error(`Durable process cgroup usage is unavailable`);try{return await h(m)}catch(e){if(!t(e,`ENOENT`))throw e;if(await enqueue(observeUnit),u)return{memoryBytes:0,swapBytes:0};throw e}},onLimit:()=>cancel(`memory-limit`),onDiagnostic:t=>S(e,`stderr`,t)}));e.durable={observe:()=>enqueue(observeUnit),cancel:e=>{cancel(`manual-cancel`,e).catch(warn)},remove:()=>{enqueue(async()=>{await r.remove(n.id),await forgetLog(n.logPath)}).catch(warn)},finalize:()=>enqueue(async()=>{n.notificationSettled=!0,await r.upsert(n)}),drain:()=>(v(),o)};let y={get resultSettled(){return u},lastOutputAtMs:n.startedAt};return e.processActivity=y,{runId:e.id,startedAtMs:n.startedAt,activity:y,wait:()=>a.promise,cancel:(e=`manual-cancel`)=>{cancel(e).catch(warn)}}}var $,supervisor,warn,sessions;e((()=>{i(),o(),T(),m(),g(),s(),u(),re(),be(),xe(),Ce(),me(),Te(),k(),M(),j(),supervisor=()=>process.platform===`darwin`?J:Q,warn=()=>w(`exec: durable process observation or persistence failed; inspect process status and the systemd user manager or launchd.`),sessions=()=>x().filter(e=>e.durable)}))();export{startDurableExecProcess};