import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{i as t,l as n,o as r,u as i}from"./worker-chunk-DFiswJd8.mjs";import{n as a,r as o}from"./worker-chunk-BoninU0c.mjs";import{n as s,r as c,t as l}from"./worker-chunk-R8kHvqGK.mjs";import{n as u,o as d,t as f}from"./worker-chunk-DbD6egYP.mjs";import{c as ee,n as p}from"./worker-chunk-CKI60oUP.mjs";import{i as m}from"./worker-chunk-C8NysGTN.mjs";import{m as h,n as g,s as _}from"./worker-chunk-CHXXUV6W.mjs";import{l as v,y}from"./worker-chunk-Cv5ZALVS.mjs";import{h as b,o as x}from"./worker-chunk-uw49siUx.mjs";import{i as S}from"./worker-chunk-Cb82E_9i.mjs";import{n as te,r as C}from"./worker-chunk-B5LehZZO.mjs";import{n as w,t as T}from"./worker-chunk-CRIcLrL2.mjs";import{a as ne,i as E}from"./worker-chunk-BhqCEWRE.mjs";import{d as D,l as re,t as ie}from"./worker-chunk-DgCZhY-C.mjs";import{n as O,t as k}from"./worker-chunk-CNpQrPFS.mjs";import{c as A,n as j,o as M,r as N}from"./worker-chunk-Ystv7m43.mjs";import{c as ae,r as P}from"./worker-chunk-D46xuc6s.mjs";import{n as F,r as oe}from"./worker-chunk-D6ZfNQ_j.mjs";import{a as se,t as ce}from"./worker-chunk-CPTKFXyU.mjs";import{d as le,l as ue}from"./worker-chunk-DoR-JIhT.mjs";import{n as de,t as fe}from"./worker-chunk-DbA7os8U.mjs";import{n as pe,r as me}from"./worker-chunk-DJijE4Xu.mjs";import{n as he,t as ge}from"./worker-chunk-Ckke-3c-.mjs";import{a as _e,t as ve}from"./worker-chunk-4t9B5rIe.mjs";import{n as ye,r as be}from"./worker-chunk-CJ7Vhlhw.mjs";import{f as xe,t as Se}from"./worker-chunk-CWtg9tSF.mjs";import{a as Ce,n as we}from"./worker-chunk-DUZXYN04.mjs";import{n as Te,t as Ee}from"./worker-chunk-CfQi3p0R.mjs";import{a as De,o as Oe}from"./worker-chunk-DxpdEy4o.mjs";import{a as ke,r as Ae}from"./worker-chunk-DsqlXm2k.mjs";import{r as je,t as Me}from"./worker-chunk-DJPHX2dL.mjs";import{n as Ne,r as Pe}from"./worker-chunk-UvjWej_c.mjs";import{i as Fe,s as Ie}from"./worker-chunk-Dfflbe1N.mjs";import{j as Le,k as Re,l as ze,t as Be}from"./worker-chunk-Bf4i7dmx.mjs";import{i as Ve,n as He}from"./worker-chunk-DnA3QChz.mjs";import{a as I,i as Ue,o as We}from"./worker-chunk-dJ3_OLtv.mjs";import{a as L,i as Ge,r as Ke}from"./worker-chunk-CdQAWyRs.mjs";import{n as R,t as z}from"./worker-chunk-B1OqUdvQ.mjs";import{l as qe,n as Je}from"./worker-chunk-D9Ol0Enf.mjs";import{n as Ye,r as Xe}from"./worker-chunk-D-emyzw-.mjs";import{n as Ze,t as Qe}from"./worker-chunk-M1qW6YUK.mjs";import{a as $e,s as et}from"./worker-chunk-BbMh1EiX.mjs";import{a as tt,o as nt}from"./worker-chunk-Bra5FWRR.mjs";import{n as rt,t as it}from"./worker-chunk-BA0DId4E.mjs";import{n as at,p as ot,s as st}from"./worker-chunk-C1JoYphU.mjs";import{i as ct,l as lt,n as ut,o as dt}from"./worker-chunk-n2WvwZTY.mjs";import{a as ft}from"./worker-chunk-DiCNFvTn.mjs";import{r as pt,t as mt}from"./worker-chunk-Di55X8SZ.mjs";import{d as ht,f as gt}from"./worker-chunk-B_GxxV5W.mjs";import{c as _t,g as vt,v as yt}from"./worker-chunk-Clo6B-rV.mjs";import{n as bt,t as B}from"./worker-chunk-yCnkNVZH.mjs";import{n as xt,t as St}from"./worker-chunk-BQk1pGbc.mjs";import{c as Ct,n as wt}from"./worker-chunk-CuN3Zg8h.mjs";import{n as Tt,t as V}from"./worker-chunk-CFfTDVUG.mjs";import{a as Et,c as Dt,d as Ot,f as kt,h as At,i as jt,l as Mt,m as Nt,n as Pt,o as H,p as Ft,r as It,s as Lt,t as U,u as Rt}from"./worker-chunk-D9vEfFmN.mjs";import{n as zt,r as Bt,t as Vt}from"./worker-chunk-Bbpsijbd.mjs";import{i as Ht,n as Ut}from"./worker-chunk-vhNIlwOA.mjs";import Wt from"node:os";import W from"node:path";import G from"node:fs/promises";import{randomUUID as K}from"node:crypto";import{fileURLToPath as Gt}from"node:url";import{spawn as Kt}from"node:child_process";import qt from"node:process";var Jt,Yt=e((()=>{Ze(),Jt=String.raw`
// Elapsed-time budget: survives wall-clock steps, unlike an epoch deadline read back
// with Date.now(). Spawn deadlines stay epoch-valued for the cross-process contract.
function createMonotonicBudget(timeoutMs) {
  const startedAt = performance.now();
  const remainingMs = () => Math.max(0, Math.floor(timeoutMs - (performance.now() - startedAt)));
  return { remainingMs, commandDeadlineAt: () => Date.now() + remainingMs() };
}

function runServiceCommand(command, args, onSpawn, deadline, timeoutCap) {
  if (!hasManagedUpdateLease()) return Promise.resolve({ code: 1, stdout: "", stderr: "" });
  return new Promise((resolve) => {
    const remaining = deadline === undefined ? params.recoveryTimeoutMs : deadline - Date.now();
    if (remaining <= 0) return resolve({ code: 1, stdout: "", stderr: "" });
    const scheduledTask = command === "schtasks.exe";
    const timeoutMs = Math.min(timeoutCap ?? remaining, remaining,
      scheduledTask ? ${Qe} : Infinity);
    const output = { stdout: "", stderr: "" };
    const launchdInspection = command === "launchctl" && args[0] === "print";
    let inspectionOverflow = false;
    const child = spawn(command, args, {
      env: params.serviceManagerEnv,
      stdio: ["ignore", "pipe", "pipe"],
      killSignal: "SIGKILL",
      timeout: timeoutMs,
    });
    for (const stream of ["stdout", "stderr"]) {
      child[stream]?.on("data", (chunk) => {
        // Job parsing needs the header and all root fields; a tail can admit a nested PID.
        if (launchdInspection && stream === "stdout") {
          if (!inspectionOverflow) {
            output.stdout += chunk;
            if (output.stdout.length > 1024 * 1024) {
              output.stdout = "";
              inspectionOverflow = true;
            }
          }
        } else output[stream] = (output[stream] + chunk).slice(-8192);
      });
    }
    child.once("spawn", () => onSpawn?.());
    child.once("error", (error) => {
      output.stderr = String(error);
    });
    child.once("close", (code) => {
      // This private child is killed only by spawn's timeout, not helper cancellation.
      if (scheduledTask && child.killed) {
        const detail = "schtasks " + args[0] + " timed out after " + timeoutMs + "ms";
        appendLog(detail);
        output.stderr = [detail, output.stderr].filter(Boolean).join("\n");
        code = 124;
      }
      if (inspectionOverflow) {
        output.stderr = ["launchctl print exceeded the inspection output limit", output.stderr].filter(Boolean).join("\n");
        code = 1;
      }
      resolve({ code: typeof code === "number" ? code : 1, ...output });
    });
  });
}
`.trim()}));function resolveUpdateCliArgv(e){return resolveManagedServiceCliArgv(e,[`update`,`--yes`,`--json`,...e.reapplyLocalOverrides?[`--reapply-local-overrides`]:[],...e.acceptCapabilities?[`--accept-capabilities`]:[],...e.fullIntegrityCheck?[`--full-integrity-check`]:[],...e.admission?[`--admission`,e.admission]:[],...e.channel?[`--channel`,e.channel]:[],...e.tag?[`--tag`,e.tag]:[],...typeof e.timeoutMs==`number`&&Number.isFinite(e.timeoutMs)?[`--timeout`,String(Math.max(1,Math.ceil(e.timeoutMs/1e3)))]:[]])}function resolveManagedServiceCliArgv(e,t){let i=e.execPath?.trim(),a=i?e.argv1?.trim():void 0,o=i&&(a||r(i)||!c(i)&&!s(i))?i:`openclaw`,l=n({execPath:o,entryPath:a||null,execArgv:a?u(o):[],args:t});return[l.command,...l.args]}function formatManagedServiceUpdateCommand(e,t=process.env){return T(resolveUpdateCliArgv(e??{}).toSpliced(3,1).join(` `),t)}function buildManagedServiceHandoffUnavailableMessage(e){return[`OpenClaw updates cannot safely run inside the live gateway process without a managed-service handoff.`,`Stop the foreground Gateway, run \`${e}\` from a shell, then launch the Gateway again. For a managed deployment, use its host's stop, update, and restart workflow.`].join(`
`)}var Xt=e((()=>{t(),w(),l(),f()}));async function readHandoffStartupFailure(e,t,n){let r;try{let e=await G.open(t,`r`);try{let{size:t}=await e.stat(),n=Buffer.alloc(Math.min(t,8192)),{bytesRead:i}=await e.read(n,0,n.length,t-n.length);if(r=n.toString(`utf8`,0,i),t>n.length){let e=r.indexOf(`
`);r=e<0?``:r.slice(e+1)}}finally{await e.close()}}catch{return e}let i=xe(r).split(/\r?\n/u).map(e=>e.trim()).filter(e=>e&&!/^at |^Node\.js v|(?:^|\] )managed update helper completed/u.test(e)),a=i.find(e=>/\b(?:\w*Error(?::| \[)|Node \S+ is unsupported)/u.test(e)),o=[.../* @__PURE__ */ new Set([...a?[a]:[],...i.slice(-2)])].map(e=>we(`managed-service`,Error(e),n));if(!o.length)return e;let s=we(`managed-service`,e,n);return new B(`managed-service-handoff-failed`,[s.message,...o.map(e=>e.message)].join(`
`),{cause:e,failureFacts:[s,...o]})}async function describeManagedHandoffBlocker(e,t,n,r,i=`handoff settlement is pending`){let a=i,o=`Check \`${T(`openclaw update status`,r)}\`. If the updater has exited, run \`${T(`openclaw update repair`,r)}\` from a terminal outside the Gateway; repair verifies owners and children before releasing custody. Do not delete the update lock.`;try{let t=await n?.read(e);if(n&&t?.kind===`current`){let e=t.lease,r=e.version===4?`cancelled update custody`:e.version===3?`retained native custody`:e.action.kind===`triage`?`triage/repair lease (${e.action.phase})`:`update lease`,identity=async t=>{let r=await n.inspectProcessIdentity(e[t]),i=r===`mismatch`?`identity changed`:r===`unknown`?`unverified`:r;return`${t} PID ${e[t].pid} (${i})`};return`Update blocked by ${r}: owner ${e.owner}, lease version ${e.version}, ${await identity(`helper`)}, ${await identity(`executor`)}, last activity ${new Date(e.updatedAt).toISOString()}. ${o}`}t?.kind===`unreadable`&&(a=`the retained lease could not be read; its custody is unverified`)}catch{a=`the retained lease or its process identities could not be verified`}return`Update blocked by managed handoff ${t||`(owner unavailable)`}: ${a}. ${o}`}var Zt=e((()=>{w(),Se(),Ce(),bt()}));function resolveSystemdHandoffLauncher(e){let t=M(`systemd-run`,[e.serviceEnv.PATH??``,`/usr/bin`,`/bin`].join(W.delimiter),e.serviceEnv);if(!t)throw Error(`systemd-run is required to launch a transient user unit`);let n=e.handoffId.trim().replace(/[^A-Za-z0-9_.:@-]+/gu,`-`).replace(/^-+|-+$/gu,``).slice(0,80)||`${process.pid}-${Date.now()}`,r=`openclaw-${e.triage?`triage`:`update`}-${n}.${e.triage?`scope`:`service`}`;return{command:t,unit:r,args:[`--user`,...e.triage?[`--scope`]:[`--pipe`,`--wait`,`--service-type=exec`,`--slice=app-openclaw-update.slice`,`--property=KillMode=control-group`,`--property=OOMPolicy=stop`,`--property=EnvironmentFile=${Pe(e.environmentPath)}`,`--working-directory=${e.directory}`],`--collect`,`--unit=${r}`,...e.triage?[`--property=PartOf=${ze(e.serviceEnv)}.service`]:[],e.executable,...e.args]}}async function writeSystemdHandoffEnvironment(e,t){let n={};for(let[e,r]of Object.entries(t))r!==void 0&&(n[e]=r);await G.writeFile(e,Le(n),{mode:384,flag:`wx`})}var Qt,$t=e((()=>{Ne(),Re(),Be(),j(),Qt=String.raw`
const params = JSON.parse(fs.readFileSync(process.argv[2], "utf-8"));
if (params.environmentPath) {
  try { fs.rmSync(params.environmentPath, { force: true }); }
  catch { appendLog("could not remove the private handoff environment file; terminal cleanup will retry"); }
}
// A transient service has its own systemd identity; it is not the Gateway being updated.
for (const key of ["INVOCATION_ID", "SYSTEMD_EXEC_PID", "JOURNAL_STREAM"]) delete process.env[key];
const requiresRequesterAcknowledgement = params.requester?.authorizationSource?.startsWith("profile:") === true;

function appendLog(line) {
  try {
    fs.mkdirSync(path.dirname(params.logPath), { recursive: true, mode: 0o700 });
    fs.appendFileSync(params.logPath, "[" + new Date().toISOString() + "] " + line + "\n", {
      mode: 0o600,
    });
  } catch {
    // Best effort only.
  }
}
`})),en,tn=e((()=>{en=String.raw`
function initialTriageAction() {
  return { kind: "triage", phase: "reserved", lifetime: { kind: "native", unit: params.serviceRecovery.unit, scope: params.scopeUnit, placement: { kind: "pending" } } };
}
function acquireManagedUpdateLease() {
  const result = leaseStore.acquire(params.updateLeaseKey, params.updateLeaseOwner,
    params.action === "triage" ? initialTriageAction() : { kind: "update" }, params.triageTransition);
  if (result.kind === "acquired") {
    managedUpdateLease = result.lease;
    if (params.action === "triage") nativePlacement = result.lease;
  }
  return { acquired: result.kind === "acquired", owner: result.owner };
}
function bindManagedUpdateLeaseToProcess(pid, expectedPayload, action, argv) {
  if (!managedUpdateLease || expectedPayload && managedUpdateLease.payload !== expectedPayload) return false;
  const next = leaseStore.bind(managedUpdateLease, pid, action, argv);
  if (!next) return false;
  managedUpdateLease = next;
  return true;
}
function hasManagedUpdateLease() { return managedUpdateLease && leaseStore.owns(managedUpdateLease); }
function ownsManagedUpdateLease() {
  return hasManagedUpdateLease() && (managedUpdateLease.executor.pid === process.pid ||
    (activeCommand?.pid === managedUpdateLease.executor.pid &&
      leaseStore.isProcessIdentityCurrent(managedUpdateLease.executor, activeCommand.exitCode === null && activeCommand.signalCode === null)));
}
function releaseManagedUpdateLease() {
  const lease = managedUpdateLease;
  if (!lease) return;
  try {
    if (lease.action.kind === "triage") leaseStore.settle(lease, "closing");
    else leaseStore.release(lease);
  } catch (error) { appendLog("managed handoff release failed: " + String(error)); }
  managedUpdateLease = null;
}
`.trim()})),nn,rn=e((()=>{nn=String.raw`
async function inspectSystemdService(unit, deadline) {
  const result = await runServiceCommand(
    "systemctl",
    [
      "--user",
      "show",
      unit,
      "--property=Id,LoadState,ActiveState,MainPID,ExecMainStartTimestampMonotonic,InvocationID,FragmentPath",
    ],
    undefined,
    deadline,
  );
  if (result.code !== 0) return null;
  return parseSystemdProperties(result.stdout);
}

async function inspectTriageScope() {
  const result = await runServiceCommand("systemctl", [
    "--user",
    "show",
    params.scopeUnit,
    "--property=Id,LoadState,ActiveState,PartOf,CanStart,KillMode,ControlGroup,InvocationID",
  ]);
  const scope = parseSystemdProperties(result.stdout);
  const membership = fs.readFileSync("/proc/self/cgroup", "utf8");
  if (
    result.code !== 0 ||
    scope.Id !== params.scopeUnit ||
    scope.LoadState !== "loaded" ||
    scope.ActiveState !== "active" ||
    scope.CanStart !== "no" ||
    scope.KillMode !== "control-group" ||
    !scope.PartOf?.split(/\s+/).includes(params.serviceRecovery.unit) ||
    !/^[a-f0-9]{32}$/i.test(scope.InvocationID || "") ||
    !scope.ControlGroup ||
    !procCgroupMembershipMatches(membership, scope.ControlGroup) ||
    !hasManagedUpdateLease()
  ) {
    throw new Error("automatic triage native scope ownership could not be verified");
  }
  const action = managedUpdateLease.action;
  if (action.lifetime.placement.kind === "attached" && action.lifetime.placement.invocation !== scope.InvocationID) {
    throw new Error("automatic triage native scope was replaced");
  }
  return scope;
}

let nativePlacement;
async function admitTriageScope() {
  const primary = await inspectSystemdService(params.serviceRecovery.unit);
  if (
    !primary ||
    primary.Id !== params.serviceRecovery.unit ||
    primary.LoadState !== "loaded" ||
    (params.triageTransition
      ? !params.primaryFragment || primary.FragmentPath !== params.primaryFragment
      : primary.ActiveState !== "active" ||
        primary.MainPID !== String(params.parentPid) ||
        !parentIdentityCurrent())
  ) {
    throw new Error(
      "automatic triage primary ownership changed before native admission; run openclaw triage manually",
    );
  }
  const scope = await inspectTriageScope();
  if (
    (!params.triageTransition &&
      !parentIdentityCurrent()) ||
    !bindManagedUpdateLeaseToProcess(
      process.pid,
      undefined,
      { ...managedUpdateLease.action, lifetime: { ...managedUpdateLease.action.lifetime, placement: { kind: "attached", invocation: scope.InvocationID } } },
    )
  ) {
    throw new Error("automatic triage owner changed during admission");
  }
  nativePlacement = managedUpdateLease;
}

let triageClosing = false;
function stopTriageScope() {
  if (params.action !== "triage") return;
  if (triageClosing) return;
  triageClosing = true;
  // Retain the captured native placement when a stale lease is replaced. Native
  // membership plus invocation fencing must never stop the replacement's scope.
  const placement = nativePlacement ?? managedUpdateLease;
  releaseManagedUpdateLease();
  if (placement) {
    try { leaseStore.stopNative(placement, true); }
    catch (error) { appendLog("automatic triage native cleanup failed: " + String(error)); }
  }

}
`.trim()}));function isForegroundGmailRunArgv(e){return He(e,3).join(` `)===`webhooks gmail run`}function isNativeHookRelayArgv(e){let{commandPath:t}=I(e);return t[0]===`hooks`&&t[1]===`relay`}function shouldKeepNativeHookRelayInProcess(e,t){return t!==`win32`&&isNativeHookRelayArgv(e)}function isTerminalInteractiveRespawnArgv(e){let t=I(e);return t.hasHelpOrVersion?!1:t.primary===null||q.has(t.primary)}function shouldSkipRespawnForArgv(e,t=process.platform){let n=I(e),r=n.commandPath.length===2&&n.commandPath[0]===`gateway`&&n.commandPath[1]===`status`;return shouldSkipStartupEnvironmentRespawnForArgv(e,t)||n.primary!==null&&q.has(n.primary)||r}function shouldSkipStartupEnvironmentRespawnForArgv(e,t=process.platform){let n=I(e);return n.hasHelpOrVersion||isForegroundGmailRunArgv(e)||shouldKeepNativeHookRelayInProcess(e,t)||n.primary===`gateway`&&m(e)}var q,an=e((()=>{Ue(),Ve(),We(),q=/* @__PURE__ */ new Set([`tui`,`terminal`,`chat`])}));function normalizeWindowsArgv(e,t={}){if((t.platform??process.platform)!==`win32`||e.length<2)return e;let normalizeCandidate=e=>e.replace(on,``).replace(/^['"]+|['"]+$/g,``).trim().replace(/^\\\\\\?\\/,``),basename=e=>e.split(/[\\/]/).pop()??e,n=normalizeCandidate(t.execPath??process.execPath),r=_(n),i=_(basename(n)),isExecPath=e=>{if(!e)return!1;let t=normalizeCandidate(e);if(!t)return!1;let n=_(t),a=basename(n);return n===r||a===i||a===`node.exe`},a=[...e];for(;isExecPath(a[1]);)a.splice(1,1);return a}var on,sn=e((()=>{g(),on=new RegExp(String.raw`[\u0000-\u001f\u007f]`,`g`)})),cn=e((()=>{qt.platform})),ln=e((()=>{cn()}));function pathModuleForPlatform(e){return e===`win32`?W.win32:W.posix}function resolveCliRespawnCommand(e){let t=pathModuleForPlatform(e.platform??process.platform).basename(e.execPath).toLowerCase();return t===`volta-shim`||t===`volta-shim.exe`?`node`:e.execPath}function buildCliRespawnPlan(e={}){let t=e.argv??process.argv,n=e.env??process.env,a=e.execArgv??process.execArgv,o=e.execPath??process.execPath,s=e.platform??process.platform,c=s===`win32`?normalizeWindowsArgv(t,{platform:s,execPath:o}):t,invocation=e=>i({execPath:resolveCliRespawnCommand({execPath:o,platform:s}),entryPath:c[1],args:c.slice(2),execArgv:e,env:l});if(shouldSkipStartupEnvironmentRespawnForArgv(c,s)||C(n.OPENCLAW_NO_RESPAWN))return null;let l={...n};h(l.NODE_EXTRA_CA_CERTS)||delete l.NODE_EXTRA_CA_CERTS;let u=[...a],d=!1;if(s===`win32`)u.some(e=>e===`--stack-size`||e.startsWith(`--stack-size=`)||e===`--stack_size`||e.startsWith(`--stack_size=`))||(u.unshift(un),d=!0);else{let i=e.autoNodeExtraCaCerts??rt({env:n,execPath:o,includeDarwinDefaults:!1}).NODE_EXTRA_CA_CERTS;if(i&&!C(n[X])&&!l.NODE_EXTRA_CA_CERTS&&(l.NODE_EXTRA_CA_CERTS=i,l[X]=`1`,d=!0),!shouldSkipRespawnForArgv(t,s)&&!C(n[Y])){let e=n.NODE_OPTIONS??``;e.includes(J)||e.includes(`--no-warnings`)||a.some(e=>e===J||e===`--no-warnings`)||(l[Y]=`1`,r(o)?l.NODE_OPTIONS=[l.NODE_OPTIONS,J].filter(Boolean).join(` `):u.unshift(J),d=!0)}}if(!d)return null;let f=invocation(u);return{command:f.command,argv:f.args,env:f.env,detachForProcessTree:s!==`win32`&&!isTerminalInteractiveRespawnArgv(t)}}var J,Y,X,un,dn=e((()=>{g(),t(),it(),an(),sn(),te(),ln(),J=`--disable-warning=ExperimentalWarning`,Y=`OPENCLAW_NODE_OPTIONS_READY`,X=`OPENCLAW_NODE_EXTRA_CA_CERTS_READY`,un=`--stack-size=8192`}));async function assertManagedHandoffServiceRuntime(e,t){if(!e)return;let n;try{n=e===`launchd`?await(await import(`./worker-chunk-uh-REIZS.mjs`)).readLaunchAgentProgramArguments(t,{requireEffective:!0}):e===`systemd`?await(await import(`./worker-chunk-CKtRjIJA.mjs`)).readSystemdServiceExecStart(t,{requireEffective:!0}):await(await import(`./worker-chunk-s_14glG0.mjs`)).readScheduledTaskCommand(t,{requireEffective:!0})}catch(e){console.warn(`[update] Could not inspect the managed service: ${String(e)}`),n=null}let r=n?.programArguments??[],i=r[0],a=r.indexOf(`gateway`),o=r[a-1];if(!i||!c(i)||a<2||!o||!W.isAbsolute(o)||!/\.(?:[cm]?js|ts)$/iu.test(o))throw new B(`managed-service-handoff-failed`,`The Gateway's saved Node executable ${JSON.stringify(process.execPath)} is unavailable. Automatic runtime replacement requires a directly launched Node service; wrapper recovery requires its installation owner to repair the wrapper's runtime first. ${Z}`);let s=A(i,{env:t,useCache:!1});if(s&&(await st(s,t)).status!==`supported`)throw new ManagedHandoffServiceRuntimeUnavailableError(s);return s}async function resolveManagedHandoffNodeExecutable(e,t){if(N(process.execPath,{env:e}))return process.execPath;let n=await assertManagedHandoffServiceRuntime(t,e);if(n)return n;let r=await ot({env:e});if(r?.status===`supported`&&r.path)return r.path;for(let t of(e.PATH??``).split(W.delimiter).filter(W.isAbsolute)){let n=M(`node`,t,e,{useCache:!1});if(n&&(await st(n,e)).status===`supported`)return n}throw new ManagedHandoffNodeUnavailableError}function prepareManagedHandoffCliRuntime(e,t,n){let r=e[0]===n||/^(?:node|bun)(?:\.exe)?$/iu.test(W.basename(e[0]??``)),i=r?[e[0],...e.slice(1+u(e[0]).length)]:e,a=r?buildCliRespawnPlan({argv:i,env:t,execArgv:[],execPath:e[0]}):null,o=r?a?.argv.slice(0,a.argv.length-i.length+1)??[]:void 0;return a&&(e[0]=a.command),{nodeExecArgv:o,readyEnv:a?.env??t}}var Z,ManagedHandoffNodeUnavailableError,ManagedHandoffServiceRuntimeUnavailableError,fn=e((()=>{ft(),l(),at(),dn(),j(),f(),Z="Inspect the service with `openclaw gateway status --deep` and refresh its definition under the installation owner (for a standard OpenClaw-managed service: `openclaw gateway install --force`). Then retry the update. The serving Gateway has not been stopped.",ManagedHandoffNodeUnavailableError=class extends B{constructor(){super(`managed-service-handoff-failed`,`The Gateway's Node executable ${JSON.stringify(process.execPath)} was removed and no compatible replacement was found. Install a supported Node. ${Z}`),this.name=`ManagedHandoffNodeUnavailableError`}},ManagedHandoffServiceRuntimeUnavailableError=class extends B{constructor(e){super(`managed-service-handoff-failed`,`The Gateway's service executable ${JSON.stringify(e)} is unavailable. ${Z}`),this.name=`ManagedHandoffServiceRuntimeUnavailableError`}}}));function hasForegroundUpdatePaths(e,t){return O(ae(t))===e.stateDatabasePath&&O(b(t,S(t)))===e.configPath}var pn=e((()=>{x(),P(),k()})),mn,hn=e((()=>{mn=String.raw`
function parentIdentityState() {
  return leaseStore.inspectProcessIdentity({ pid: params.parentPid, startIdentity: params.parentStartIdentity }, params.parentPid === process.ppid && !process.stdin.destroyed && !process.stdin.readableEnded);
}
function parentIdentityCurrent() {
  return parentIdentityState() === "live";
}

async function activateTransferredGateway() {
  await waitForTransferredRestartDelay();
  // Validation has its own budget. The shutdown reserve starts only at activation.
  params.parentExitDeadlineAt = Date.now() + params.parentExitTimeoutMs;
  await parkGatewayService();
  if (requiresRequesterAcknowledgement && !transferPrepared)
    throw new Error("Profile update has no accepted park operation");
  while (isPidAlive(params.parentPid)) {
    if (!ownsManagedUpdateLease()) throw new Error("managed update activation ownership lost");
    const parentState = parentIdentityState();
    if (parentState === "dead") break;
    if (parentState !== "live") {
      if (!isPidAlive(params.parentPid)) break;
      throw new Error("managed update parent identity changed during activation");
    }
    if (Date.now() >= params.parentExitDeadlineAt) {
      try { process.kill(params.parentPid, "SIGKILL"); } catch {}
      throw new Error("managed update parent exit exceeded the activation deadline");
    }
    await sleep(Math.min(25, Math.max(0, params.parentExitDeadlineAt - Date.now())));
  }
  await finishGatewayServicePark();
}
`})),gn,_n=e((()=>{gn=String.raw`async function restoreGatewayService(reason, decision = params.recovery, childStatus, previousGeneration = false, updaterStopped = false, beforeStart = () => {}) {
  if (managedUpdateLease?.action.kind !== "update" || !ownsManagedUpdateLease()) return false;
  let expectedRevision;
  const record = (restored) => recordManagedUpdateOutcome(
    restored ? reason : "managed-service-handoff-restore-failed", restored, childStatus, expectedRevision,
  );
  const refuse = async (message) => {
    if (message) appendLog(message);
    await record(false);
    return false;
  };
  if (decision?.serviceRestartSafe !== true || !decision.version) {
    return refuse("recovery refused: original runtime identity could not be verified");
  }
  const expectedVersion = decision.version;
  const expectedBuildId = decision.buildId;
  const recovery = params.serviceRecovery;
  let restored = false;
  let serviceRunning;
  let servicePid;
  const ownsRecovery = () => {
    try { return ownsManagedUpdateLease() && fs.realpathSync(params.updateLeaseKey) === params.updateLeaseKey; }
    catch { return false; }
  };
  const runOwned = (...args) => ownsRecovery()
    ? runServiceCommand(...args) : Promise.resolve({ code: 1, stdout: "", stderr: "recovery ownership lost" });
  const restart = () => runOwnedUpdateCommand("recovery", params.recoveryCommandArgv,
    params.recoveryTimeoutMs, params.cwd, previousGeneration
      ? { ...process.env, OPENCLAW_ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS: "1" } : process.env);
  if (!ownsRecovery()) return false;
  // Activation may consume or replace the notification. Annotate only the
  // observed revision; notification persistence never decides recovery safety.
  if (updaterStopped) {
    const stop = readGatewayStop();
    if (stop?.runId !== params.runId || stop.started)
      return refuse("recovery refused: Gateway stop intent was superseded");
  }
  if (childStatus) expectedRevision = await recordManagedUpdateOutcome(reason, undefined, childStatus);
  if (recovery?.kind === "systemd") {
    if (!updaterStopped && (!pendingServiceStop || (await pendingServiceStop).code !== 0)) {
      return refuse("recovery refused: exact systemd stop did not complete");
    }
    const parked = await inspectSystemdService(recovery.unit);
    // A Gateway that exits non-zero during the stop (KillMode=mixed) settles the unit
    // into ActiveState=failed with the parked identity retained; that is still the
    // exact parked generation and recovery stays safe. An owned candidate boot can
    // advance inactive-unit metadata. Only a verified full-generation rollback
    // permits recovering that later stopped invocation.
    if (!parked || parked.Id !== recovery.unit || parked.LoadState !== "loaded" ||
      (parked.ActiveState !== "inactive" && parked.ActiveState !== "failed") ||
      parked.MainPID !== "0" || !(updaterStopped || previousGeneration || isParkedSystemdGeneration(parked, true)) ||
      !ownsRecovery()) {
      return refuse("recovery refused: parked systemd service identity changed or stop is incomplete");
    }
    beforeStart();
    const started = childStatus
      ? await restart()
      : await runOwned("systemctl", ["--user", "start", recovery.unit]);
    const current = ownsRecovery() && await inspectSystemdService(recovery.unit);
    const pid = /^[1-9]\d*$/.test(current?.MainPID || "") ? Number(current.MainPID) : undefined;
    serviceRunning = current && current.Id === recovery.unit
      ? current.ActiveState === "active" && isPidAlive(pid) : undefined;
    servicePid = serviceRunning ? pid : undefined;
    restored = !started.signal && started.code === 0 && Boolean(current && current.Id === recovery.unit &&
      current.LoadState === "loaded" && current.ActiveState === "active" &&
      /^[1-9]\d*$/.test(current.MainPID || "") && current.MainPID !== String(params.parentPid) &&
      isPidAlive(Number(current.MainPID)) &&
      /^[1-9]\d*$/.test(current.ExecMainStartTimestampMonotonic || "") &&
      current.ExecMainStartTimestampMonotonic !== parkedServiceGeneration);
  } else if (recovery?.kind === "launchd") {
    try {
      const target = "gui/" + recovery.uid + "/" + recovery.label;
      // The recovery budget is elapsed time; a wall-clock step must not extend or
      // truncate it. Spawns still receive an epoch deadline because they share the
      // cross-process parent-exit contract consumed by runServiceCommand.
      const recoveryBudget = createMonotonicBudget(params.recoveryTimeoutMs);
      const run = (args) =>
        runOwned("launchctl", args, undefined, recoveryBudget.commandDeadlineAt());
      const before = await run(["print", target]);
      if (before.code === 0) {
        const pid = parseLaunchctlJob(before.stdout, target).runtime.pid;
        if (pid && pid !== params.parentPid) {
          return refuse("recovery refused: launchd service has another process generation");
        }
      } else if (!isLaunchdNotLoaded(before)) {
        return refuse();
      }
      beforeStart();
      if (childStatus) {
        const restarted = await restart();
        // The guarded CLI owns its restart deadline; identity inspection gets a fresh probe budget.
        const current = ownsRecovery()
          ? await runOwned("launchctl", ["print", target]) : null;
        const pid = current?.code === 0
          ? parseLaunchctlJob(current.stdout, target).runtime.pid : 0;
        serviceRunning = current?.code === 0 ? Boolean(pid && isPidAlive(pid)) : undefined;
        servicePid = serviceRunning ? pid : undefined;
        restored = !restarted.signal && restarted.code === 0 && Boolean(pid && pid !== params.parentPid && serviceRunning);
      } else {
        const enabled = await run(["enable", target]);
        let kickstarted = false;
        for (let inspection = enabled; enabled.code === 0 && recoveryBudget.remainingMs() > 0;) {
          inspection = await run(["print", target]);
          if (inspection.code === 0) {
            const pid = parseLaunchctlJob(inspection.stdout, target).runtime.pid;
            if (pid !== params.parentPid && isPidAlive(pid)) {
              restored = true;
              servicePid = pid;
              break;
            }
            // launchd retains the old label until its ExitTimeOut-bounded teardown completes.
            if (pid === params.parentPid) {
              await sleep(Math.min(500, recoveryBudget.remainingMs()));
              continue;
            }
            if (kickstarted) break;
            kickstarted = true;
            beforeStart();
            inspection = await run(["kickstart", target]);
          } else if (isLaunchdNotLoaded(inspection)) {
            beforeStart();
            inspection = await run(["bootstrap", "gui/" + recovery.uid, recovery.plistPath]);
          } else break;
          if (inspection.code === 0) continue;
          const detail = inspection.stderr || inspection.stdout;
          if (inspection.code === 130 ||
            /already exists in domain|operation already in progress|bootstrap failed: 37/i.test(detail)) continue;
          if (kickstarted && isLaunchdNotLoaded(inspection)) continue;
          if (!/bootstrap failed: 5|input\/output error/i.test(detail)) break;
          await sleep(Math.min(500, recoveryBudget.remainingMs()));
        }
        serviceRunning = restored;
      }
    } catch (error) {
      // Invalid native identity must refuse recovery, never retry it through the outer failure handler.
      return refuse("recovery refused: " + (error instanceof Error ? error.message : String(error)));
    }
  } else if (recovery?.kind === "schtasks") {
    beforeStart();
    restored = (updaterStopped ? await restart() : await runOwned("schtasks.exe", ["/Run", "/TN", recovery.taskName])).code === 0;
  }
  // Manager liveness survives a failed readiness probe, but version facts require
  // the new process to answer; never reuse the pre-activation runtime identity.
  runLedger?.recordUpdateRunVerification(params.runId, {
    serviceRunning, pid: servicePid, runningVersion: undefined, runningBuildId: undefined, versionMatch: undefined,
    readyz: undefined, coreReady: undefined, settled: undefined, channelsReady: undefined, pluginErrors: undefined,
  });
  if (restored) {
    try {
      const { waitForGatewayUpdateRecovery } = await import(pathToFileURL(params.recoveryModulePath).href);
      if (!ownsRecovery()) throw new Error("managed update recovery ownership was lost");
      const health = await waitForGatewayUpdateRecovery(expectedVersion, expectedBuildId, params.recoveryTimeoutMs);
      restored = ownsRecovery() && health.healthy === true &&
        health.runtime?.status === "running" && health.gatewayVersion === expectedVersion &&
        (!expectedBuildId || health.gatewayBuildId === expectedBuildId);
      if (restored && serviceStoppedAtMs !== undefined) serviceDowntimeMs = Math.max(0, Date.now() - serviceStoppedAtMs);
      runLedger?.recordUpdateRunVerification(params.runId, {
        serviceRunning: health.runtime?.status === "running",
        pid: typeof health.runtime?.pid === "number" ? health.runtime.pid : undefined,
        runningVersion: health.gatewayVersion ?? undefined,
        runningBuildId: health.gatewayBuildId ?? undefined,
        versionMatch: health.gatewayVersion === expectedVersion && (!expectedBuildId || health.gatewayBuildId === expectedBuildId),
        settled: health.healthy === true,
        channelsReady: health.healthy === true && !health.channelProbeErrors?.length,
        pluginErrors: health.activatedPluginErrors?.map((error) => JSON.stringify(error)) ?? [],
      });
    } catch (error) {
      appendLog("Gateway recovery readiness failed: " + String(error));
      restored = false;
    }
  }
  appendLog("gateway service recovery " + (restored ? "succeeded (readiness and runtime identity verified)" : "failed"));
  const recorded = await record(restored);
  if (!recorded) {
    appendLog("managed update restoration result could not be durably recorded");
  }
  return restored;
}
`})),Q,vn=e((()=>{a(),Q=`managed-handoff-runtime.mjs`,o.managedHandoffRuntime,o.managedHandoffPostgresBridge})),yn,bn=e((()=>{yn=String.raw`
let sentinelRequestId = 0;
let pendingSentinel;
process.on("message", (message) => {
  if (!pendingSentinel || message?.type !== "handoff-sentinel" || message.requestId !== pendingSentinel.id) return;
  const pending = pendingSentinel;
  pendingSentinel = undefined;
  clearTimeout(pending.timer);
  if (message.error) pending.reject(new Error(message.error));
  else pending.resolve(message.result);
});
process.on("disconnect", () => {
  if (!pendingSentinel) return;
  const pending = pendingSentinel;
  pendingSentinel = undefined;
  clearTimeout(pending.timer);
  pending.reject(new Error("Parent sentinel owner disconnected before its reply"));
});
process.channel?.unref();

async function runSentinelOperation(operation) {
  if (!ownsManagedUpdateLease()) throw new Error("Managed handoff sentinel lease lost");
  if (params.stateEngine !== "postgres") {
    const db = openStateDatabase();
    // Unavailable inspection adds no context; a failed query still ends triage.
    if (!db && operation.kind === "inspect") return { kind: "unavailable" };
    if (!db) throw new Error("Managed handoff sentinel database unavailable");
    try {
      if (operation.kind === "inspect") return inspectManagedHandoffSentinelRowSync(db, operation.input);
      return leaseStore.transact(db, () => {
        assertStateDatabaseWriteAllowed(db);
        if (!ownsManagedUpdateLease()) throw new Error("Managed handoff sentinel lease lost");
        return recordManagedHandoffSentinelOutcomeRowSync(db, operation.input);
      });
    } finally {
      db.close();
    }
  }
  const request = { operation, databaseIdentity: params.updateLeaseDatabaseIdentity, helper: managedUpdateLease.helper };
  if (process.connected && parentIdentityCurrent()) {
    return new Promise((resolve, reject) => {
      const id = ++sentinelRequestId;
      pendingSentinel = { id, resolve, reject, timer: setTimeout(() => {
        pendingSentinel = undefined;
        reject(new Error("Parent sentinel owner did not reply"));
      }, 10000) };
      process.send({ type: "handoff-sentinel", requestId: id, request });
    });
  }
  const inputPath = path.join(params.cwd, "sentinel-operation.json");
  const resultPath = path.join(params.cwd, "sentinel-result.json");
  try {
    fs.writeFileSync(inputPath, JSON.stringify({ modulePath: terminalRuntimePath, request, resultPath }), { mode: 0o600 });
    const exit = await runOwnedUpdateCommand("sentinel", [process.execPath, ...params.runtimeArgs, "--input-type=module", "-e",
      'import fs from "node:fs"; import { pathToFileURL } from "node:url"; try { const { modulePath, request, resultPath } = JSON.parse(fs.readFileSync(process.argv[1], "utf8")); const { runManagedHandoffSentinelChild } = await import(pathToFileURL(modulePath).href); const result = await runManagedHandoffSentinelChild(request); fs.writeFileSync(resultPath, JSON.stringify(result), { mode: 0o600 }); } catch { console.error("Shared-state sentinel operation unavailable; inspect PostgreSQL and Gateway availability."); process.exitCode = 1; }', inputPath], params.recoveryTimeoutMs);
    if (exit.signal || exit.code !== 0) throw new Error("Installed runtime could not record the shared-state notice");
    return JSON.parse(fs.readFileSync(resultPath, "utf8"));
  } finally {
    fs.rmSync(inputPath, { force: true });
    fs.rmSync(resultPath, { force: true });
  }
}

function sentinelIdentity() {
  return { handoffId: params.handoffId, runId: params.runId, root: params.updateLeaseKey };
}

`})),xn,Sn=e((()=>{vn(),bn(),xn=yn+String.raw`
let triageFailure;
let runLedger;
let runOutcome;
let closedUpdateResult;
let handoffFailure;
let terminalRuntimePath = params.recoveryModulePath;
let serviceStoppedAtMs, serviceDowntimeMs;
let recoveryObservation;

// Child JSON is untyped. Keep malformed supplied reasons reportable before
// typed classification, sentinel publication, and terminal recording consume them.
function parseManagedUpdateResult(output) {
  let result;
  try { result = JSON.parse(output); } catch { return null; }
  if (Object.hasOwn(result ?? {}, "reason") && typeof result.reason !== "string") result.reason = "managed-service-handoff-failed";
  return result;
}

async function observeUnrecordedRecovery() {
  if (!triageFailure || typeof triageFailure.restored === "boolean" || !ownsManagedUpdateLease()) return;
  const previous = closedUpdateResult?.steps?.findLast((step) => step.name === "gateway recovery verification");
  if (previous) {
    triageFailure.restored = previous.exitCode === 0 && !previous.failureFacts?.length;
    return;
  }
  const startedAt = Date.now();
  let verified = false;
  let code = "gateway-probe-failed";
  let detail = terminationRequested ? "Gateway recovery verification was cancelled."
    : !params.serviceRecovery ? (params.foregroundOrigin
      ? "Foreground Gateway serving health remains unverified by its current owner."
      : "Gateway serving health remains unverified by its external service owner.")
    : closedUpdateResult?.recovery?.reason || "Recovery runtime identity is unavailable.";
  let verification;
  // A pre-activation refusal leaves the original service untouched. Observe that
  // generation without granting restart authority or claiming candidate activation.
  if (!terminationRequested && params.serviceRecovery && !restorationArmed && params.recovery?.version) {
    try {
      const { waitForGatewayUpdateRecovery } = await import(pathToFileURL(params.recoveryModulePath).href);
      if (!ownsManagedUpdateLease()) return;
      const health = await waitForGatewayUpdateRecovery(params.recovery.version, params.recovery.buildId, Math.min(params.recoveryTimeoutMs, 3000));
      if (!ownsManagedUpdateLease()) return;
      const running = health.runtime?.status === "running";
      const versionMatch = health.gatewayVersion === params.recovery.version &&
        (!params.recovery.buildId || health.gatewayBuildId === params.recovery.buildId);
      verified = running && versionMatch && health.healthy === true;
      verification = {
        serviceRunning: running ? true : health.runtime?.status === "stopped" ? false : undefined,
        pid: typeof health.runtime?.pid === "number" ? health.runtime.pid : undefined,
        runningVersion: health.gatewayVersion ?? undefined,
        runningBuildId: health.gatewayBuildId ?? undefined,
        versionMatch, settled: health.healthy === true, coreReady: health.healthy === true,
      };
      code = health.runtime?.status === "stopped" ? "service-not-running"
        : !running ? "gateway-probe-failed" : !versionMatch ? "version-mismatch" : "gateway-readiness-unverified";
      detail = verified ? "Original Gateway is verified serving." : "Original Gateway serving health was not verified: " + code;
    } catch (error) {
      detail = "Original Gateway recovery probe failed.";
      appendLog(detail + " " + String(error));
    }
  }
  triageFailure.restored = verified;
  triageFailure.recoveryReason = verified ? undefined : detail;
  recoveryObservation = {
    verification,
    step: {
      name: "gateway recovery verification", command: "gateway verification", cwd: params.updateLeaseKey,
      durationMs: Math.max(0, Date.now() - startedAt), exitCode: verified ? 0 : 1,
      ...(!verified ? { failureFacts: [{ check: "gateway-recovery", code, message: detail }] } : {}),
    },
  };
}

async function finishManagedUpdateRun() {
  try { await observeUnrecordedRecovery(); }
  catch (error) {
    appendLog("Gateway recovery observation could not complete: " + String(error));
  }
  if (!runLedger || !runOutcome) return;
  if (foregroundParked && runOutcome.status === "succeeded") return;
  if (!ownsManagedUpdateLease()) throw new Error("managed update terminal writer lost its current claim");
  const childFailure = closedUpdateResult?.steps?.find((step) => step.exitCode !== 0 && !step.advisory);
  const childDetail = childFailure?.failureFacts?.find((fact) => fact.message)?.message ?? childFailure?.diagnostics?.[0];
  const failureDetail = closedUpdateResult?.reason
    ? closedUpdateResult.reason + (childDetail ? ": " + childDetail : "")
    : handoffFailure;
  const terminalResult = {
    ...runOutcome,
    ...(closedUpdateResult ? { reason: closedUpdateResult.reason ?? runOutcome.reason, after: closedUpdateResult.after } : {}),
    diagnostics: {
      steps: [...(closedUpdateResult?.steps ?? []), ...(recoveryObservation ? [recoveryObservation.step] : [])],
      recovery: closedUpdateResult?.recovery,
      verification: recoveryObservation?.verification ?? closedUpdateResult?.verification,
      ...(handoffFailure && runOutcome.status === "failed" ? { failure: { step: "managed-service-handoff", detail: failureDetail, exitCode: 1 } } : {}),
    },
    ...(serviceDowntimeMs !== undefined ? { downtimeMs: serviceDowntimeMs } : {}),
  };
  if (!updaterStarted) { recordRunWarnings(runLedger); await runLedger.finishUpdateRun(params.runId, terminalResult); }
  else {
    // Doctor may have advanced the schema. A new process loads the candidate's
    // entire module graph; a cache-busted import would retain old DB readers.
    const leaseRuntime = path.join(params.cwd, "runtime", ${JSON.stringify(Q)});
    const payload = JSON.stringify([fs.existsSync(terminalRuntimePath) ? terminalRuntimePath : leaseRuntime, params.runId, terminalResult, [...runWarnings],
      leaseRuntime,
      params.updateLeaseDatabaseIdentity, params.updateLeaseKey, params.handoffId, managedUpdateLease.helper]);
    // Child diagnostics can exceed argv limits. The private helper directory owns
    // this short-lived transfer file, which terminal cleanup removes with its inputs.
    const terminalPath = path.join(params.cwd, "terminal-result.json");
    fs.writeFileSync(terminalPath, payload, { mode: 0o600 });
    const exit = await runOwnedUpdateCommand("finalize", [process.execPath, ...params.runtimeArgs, "--input-type=module", "-e",
      'import { readFileSync } from "node:fs"; import { pathToFileURL } from "node:url"; const [modulePath, runId, result, warnings, leaseRuntime, databaseIdentity, root, owner, helper] = JSON.parse(readFileSync(process.argv[1], "utf8")); const { finishUpdateRun, recordUpdateRunDiagnostic, recordUpdateRunStep } = await import(pathToFileURL(modulePath).href); const { createManagedHandoffLeaseStore } = await import(pathToFileURL(leaseRuntime).href); const store = createManagedHandoffLeaseStore({ databasePath: databaseIdentity.databasePath, existingIdentity: databaseIdentity }); const current = store.read(root); const lease = current.kind === "current" ? current.lease : null; if (!lease || lease.owner !== owner || lease.executor.pid !== process.pid || JSON.stringify(lease.helper) !== JSON.stringify(helper) || !(store.isProcessIdentityCurrent(lease.executor) || (process.connected && store.acceptParentBoundExecutor(lease)))) throw new Error("managed update terminal writer lost its current claim"); for (const [step, detail] of warnings) { try { if (recordUpdateRunDiagnostic) recordUpdateRunDiagnostic(runId, detail, undefined, step); else recordUpdateRunStep(runId, {step,status:"completed",detail,endedAtMs:Date.now()}); } catch {} } await finishUpdateRun(runId, result);',
      terminalPath], params.recoveryTimeoutMs);
    if (exit.signal || exit.code !== 0) throw new Error("recovery runtime could not finalize the update run");
  }
  runOutcome = undefined;
}

async function captureManagedUpdateResult() {
  if (fs.existsSync(params.triageContextPath)) {
    triageFailure = { ...triageFailure, reason: closedUpdateResult?.reason ?? "managed-service-handoff-failed" };
    return true;
  }
  try {
    const result = await runSentinelOperation({ kind: "inspect", input: sentinelIdentity() });
    if (!result.sentinel) return false;
    const payload = result.sentinel.payload;
    triageFailure = { ...triageFailure, payload, reason: payload.stats?.reason || "managed-service-handoff-failed" };
    return true;
  } catch (error) {
    // SQLite read failures end diagnostics at their cleanup boundary. Remote
    // transport failure keeps the direct child's bounded diagnostic context.
    if (params.stateEngine !== "postgres") throw error;
    appendLog("Update notice could not be inspected; service recovery retains its local lease.");
    return false;
  }
}

async function recordManagedUpdateOutcome(reason, restored, completedStatus, expectedRevision) {
  if (!ownsManagedUpdateLease()) return false;
  handoffFailure = reason;
  reason = closedUpdateResult?.reason ?? reason;
  let metaFile;
  try { metaFile = JSON.parse(fs.readFileSync(params.metaPath, "utf8")); } catch {}
  let run;
  try { run = runLedger?.getUpdateRun(params.runId); } catch {}
  if (reason === "managed-service-handoff-cancelled" && run?.reason &&
      run.steps.some((step) => step.step === "requested" && step.status === "failed")) reason = run.reason;
  const meta = resolveUpdateRestartNoticeMeta(run, metaFile?.version === 1 ? metaFile.meta : {});
  const status = (reason === "managed-service-handoff-cancelled" || completedStatus === "skipped") && restored !== false ? "skipped" : "error";
  runOutcome = { status: status === "error" ? "failed" : "skipped", reason };
  const fallbackPayload = {
    kind: "update", status, ts: Date.now(), message: meta.note,
    stats: { mode: "unknown", root: params.updateLeaseKey, handoffId: params.handoffId,
      ...(params.runId ? { runId: params.runId } : {}), reason, steps: [], durationMs: 0 },
    ...(meta.sessionKey ? { sessionKey: meta.sessionKey } : {}),
    ...(meta.threadId ? { threadId: meta.threadId } : {}),
    ...(meta.deliveryContext ? { deliveryContext: meta.deliveryContext } : {}),
  };
  if (status === "error") triageFailure ??= { payload: fallbackPayload, reason };
  if (triageFailure && typeof restored === "boolean") triageFailure.restored = restored;
  if (!shouldPublishUpdateRestartNotice(run, meta)) return true;
  try {
    const result = await runSentinelOperation({ kind: "record", input: {
      ...sentinelIdentity(), reason, restored, completedStatus,
      expectedRevision: typeof expectedRevision === "number" ? expectedRevision : undefined,
      foreground: Boolean(params.foregroundOrigin), fallbackPayload, triageHint: params.triageHint,
      serviceKind: params.serviceRecovery?.kind ?? "foreground", handoffFailure,
    } });
    if (result.kind === "refused") {
      appendLog("Update notice changed or belongs to another handoff; it was not replaced.");
      return false;
    }
    if (result.sentinel && triageFailure) triageFailure.payload = result.sentinel.payload;
    return result.sentinel?.revision ?? true;
  } catch (error) {
    // Remote transport errors can contain connection details; keep those private.
    appendLog(params.stateEngine === "postgres"
      ? "Update notice could not be recorded; service recovery retains its local lease. Inspect PostgreSQL and Gateway availability."
      : "failed to write update sentinel failure: " + (error && error.stack ? error.stack : String(error)));
    return null;
  }
}

function stagedRuntimePath() {
  return path.join(params.cwd, "runtime", ${JSON.stringify(Q)});
}

function shouldRecoverInterruptedUpdater() {
  if (!params.runId || params.foregroundOrigin) return false;
  return restorationArmed || readManagedHandoffGatewayStop()?.runId === params.runId;
}

// Post-core repair may advance the state schema past this helper's staged reader.
// A fresh process loads the installed candidate's whole module graph per call.
function createInstalledRuntimeLedger(modulePath) {
  const call = (name, args) => {
    const out = require("node:child_process").spawnSync(process.execPath, [...params.runtimeArgs, "--input-type=module", "-e",
      'import { pathToFileURL } from "node:url"; const [modulePath, name, args] = JSON.parse(process.argv[1]); const value = await (await import(pathToFileURL(modulePath).href))[name](...args); process.stdout.write(JSON.stringify(value ?? null));',
      JSON.stringify([modulePath, name, args])], { encoding: "utf8", timeout: params.recoveryTimeoutMs, maxBuffer: 16 * 1024 * 1024 });
    if (out.status !== 0) throw new Error("installed runtime ledger " + name + " failed: " + String(out.stderr || out.error || "").slice(-400));
    return JSON.parse(out.stdout || "null") ?? undefined;
  };
  return Object.fromEntries(["adoptUpdateRun", "finishUpdateRun", "getUpdateRun", "listUpdateRuns", "recordUpdateRunStep", "recordUpdateRunVerification"]
    .map((name) => [name, (...args) => call(name, args)]));
}

function readGatewayStop() {
  // Only the installed-runtime ledger lists runs; before post-core repair the staged reader
  // matches the schema. An older installed candidate may not export the listing.
  if (!runLedger?.listUpdateRuns) return readManagedHandoffGatewayStop();
  try { return findUpdateGatewayStop(runLedger.listUpdateRuns({ limit: 100 })); }
  catch (error) {
    appendLog("installed runtime could not list update history; using the staged reader: " + String(error));
    return readManagedHandoffGatewayStop();
  }
}

async function recoverInterruptedUpdater() {
  const reason = "managed-service-handoff-interrupted";
  terminalRuntimePath = stagedRuntimePath();
  try {
    const assertCurrent = () => {
      if (!ownsManagedUpdateLease()) throw new Error("managed update recovery ownership was lost");
    };
    const updaterStopped = !restorationArmed;
    const assertPendingStop = () => {
      const stop = readGatewayStop();
      if (stop?.runId !== params.runId || stop.started)
        throw new Error("Gateway stop intent was superseded by a later running service");
    };
    assertPendingStop();
    const recovered = await recoverInterruptedManagedUpdate({
      root: params.updateLeaseKey, runId: params.runId, owner: params.updateLeaseOwner,
      databaseIdentity: params.updateLeaseDatabaseIdentity, original: params.recovery,
      originalIdentity: originalInstallationIdentity, timeoutMs: params.recoveryTimeoutMs,
      assertCurrent,
      finalize: async () => {
        // Recovery verified this installation before finalization. Repair can
        // advance its schema even when it fails, so terminal writes must follow it.
        terminalRuntimePath = params.recoveryModulePath;
        const repair = await runOwnedUpdateCommand("repair", params.finalizeCommandArgv,
          params.recoveryTimeoutMs, params.cwd, { ...process.env, OPENCLAW_UPDATE_RUN_HANDOFF: "1" });
        let repaired;
        try { repaired = JSON.parse(repair.updaterOutput); } catch {}
        assertCurrent();
        if (repair.signal || repair.code !== 0 || repaired?.coreUpdate !== "completed" ||
          !["ok", "warning"].includes(repaired.status)) {
          throw new Error("Interrupted update post-core repair did not complete");
        }
        runLedger = createInstalledRuntimeLedger(params.recoveryModulePath);
        return runLedger.getUpdateRun(params.runId);
      },
    });
    terminalRuntimePath = params.recoveryModulePath;
    const restored = await restoreGatewayService(
      recovered.status === "rolled-back" ? "managed-service-handoff-cancelled" : reason,
      recovered.recovery, updaterStopped || recovered.status === "succeeded" ? "error" : undefined,
      false, updaterStopped, assertPendingStop,
    );
    if (!restored) throw new Error("Recovered runtime could not restore Gateway readiness and identity");
    runOutcome = { status: recovered.status, reason: recovered.status === "succeeded"
      ? "managed-service-handoff-recovered" : reason,
      after: { version: recovered.recovery.version, buildId: recovered.recovery.buildId } };
    if (recovered.warning) {
      appendLog(recovered.warning);
      runWarnings.set("warning:plugin-cohort-recovery", recovered.warning);
      runOutcome.nextAction = "openclaw update repair";
    }
    runLedger.recordUpdateRunStep(params.runId, { step: "managed-service-handoff-recovery", status: "completed",
      detail: recovered.status === "succeeded" ? "Succeeded with recovery after the updater exited without a result." : "Cancelled activation; original Gateway restored.", endedAtMs: Date.now() });
    triageFailure = undefined;
    finalExitCode = recovered.status === "succeeded" ? 0 : 1;
  } catch (error) {
    const detail = String(error) + "; run openclaw update repair and openclaw gateway status --deep";
    appendLog(detail);
    runWarnings.set("warning:gateway-availability", detail);
    await recordManagedUpdateOutcome(reason, false);
    if (runOutcome) runOutcome.nextAction = "openclaw update repair; openclaw gateway status --deep";
    finalExitCode = 1;
  }
}

`}));function resolveManagedHandoffCommandEnv(e,t,n){let r={...e,...Ge(L(e)),[ut]:t,OPENCLAW_UPDATE_RUN_HANDOFF:`1`,...n?{[ct]:n}:{}};for(let e of ve)Cn.has(e)||delete r[e];return Ct({processEnv:r,invocationCwd:process.cwd()})}async function admitManagedHandoffSupervisor(e,t,n=process.env){if(e===`schtasks`)throw new B(`managed-service-handoff-failed`,`This Gateway runs as a Windows Scheduled Task, and updates started from the Gateway (Control UI, chat, or automatic updates) cannot finish there yet: stopping the task also ends the updater, which would leave the task disabled and the Gateway stopped. Nothing was changed. Update from a PowerShell or Command Prompt window that you opened yourself, not one started by the Gateway: ${T(`openclaw update`,n)}`);return e===`systemd`?admitSystemdUpdate(t,n):void 0}async function admitSystemdUpdate(e,t=process.env,r){let i=r===void 0?await $e(t):r;if(i?.kind!==`system`&&i?.kind!==`dueling`)return;let a=i.system.unitName,o=`sudo systemctl restart ${he(a)}`,s=R(e);try{await G.access(s,G.constants.W_OK|G.constants.X_OK)}catch(e){let{uid:r}=await G.stat(s),i=n({entryPath:W.join(s,`openclaw.mjs`),execArgv:[],args:[`update`,`--yes`,`--no-restart`]}),a=V([i.command,...i.args],L(t),{env:t});throw new B(`managed-service-handoff-failed`,`System-scope Gateway package update cannot write its install root ${s}. Install as its owning account: sudo -u ${he(`#${r}`)} -- ${a}. Then run: ${o}`,{cause:e})}return`System-scope Gateway service ${a} requires an operator restart. Package updates do not stop or restart this service. After the update, run: ${o}`}function observeManagedServiceUpdateHandoffClose(e,t){let n=!1,r=Ot(e=>{e===`system-update-settled
`&&(n=!0)});return t.stdout.on(`data`,r),new Promise(i=>{t.once(`close`,()=>{t.stdout.off(`data`,r),e.settled=n&&t.exitCode!==null&&t.signalCode===null,i()})})}function resolveGatewayServiceRecovery(e,t){if(e===`systemd`)return{kind:`systemd`,unit:`${ze(t)}.service`};if(e===`launchd`){let e=Xe(t);return{kind:`launchd`,uid:typeof process.getuid==`function`?process.getuid():501,label:e,plistPath:qe(t)}}if(e===`schtasks`)return{kind:`schtasks`,taskName:t.OPENCLAW_WINDOWS_TASK_NAME?.trim()||y(t.OPENCLAW_PROFILE)}}var Cn,wn,Tn=e((()=>{t(),w(),Tt(),ge(),ft(),wt(),v(),Ye(),Je(),et(),Be(),Ke(),_e(),dt(),z(),kt(),Cn=/* @__PURE__ */ new Set([`OPENCLAW_LAUNCHD_LABEL`,`OPENCLAW_SYSTEMD_UNIT`,`OPENCLAW_WINDOWS_TASK_NAME`]),wn=`system-update-settled
`})),En,Dn=e((()=>{En=String.raw`function assertStateDatabaseWriteAllowed(database) {
  if (
    !params.stateDatabasePath ||
    typeof params.stateDatabasePath !== "string" ||
    (!database && !fs.existsSync(params.stateDatabasePath))
  ) {
    return;
  }
  const ownsDatabase = !database;
  let db = database;
  if (!db) {
    const sqlite = require("node:sqlite");
    db = new sqlite.DatabaseSync(resolveImmutableSqliteFileUri(params.stateDatabasePath), {
      readOnly: true,
    });
  }
  try {
    if (ownsDatabase) {
      db.exec("PRAGMA query_only = ON; PRAGMA trusted_schema = OFF;");
    }
    assertOpenClawStateWriteAllowed({ database: db, databasePath: params.stateDatabasePath });
  } finally {
    if (ownsDatabase) {
      db.close();
    }
  }
}

function openStateDatabase() {
  if (!params.stateDatabasePath || typeof params.stateDatabasePath !== "string") {
    return null;
  }
  let db = null;
  try {
    assertStateDatabaseWriteAllowed();
    const sqlite = require("node:sqlite");
    fs.mkdirSync(path.dirname(params.stateDatabasePath), { recursive: true, mode: 0o700 });
    db = new sqlite.DatabaseSync(params.nodeSqliteLocation);
    db.exec("PRAGMA busy_timeout = 5000;");
    leaseStore.transact(db, () => {
      assertStateDatabaseWriteAllowed(db);
      db.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "gateway_restart_sentinel", {
        endMarker: "ON gateway_restart_sentinel(ts DESC, sentinel_key);",
      }));
      const columns = new Set(
        db
          .prepare("PRAGMA table_info(gateway_restart_sentinel)")
          .all()
          .map((row) => row.name),
      );
      for (const column of [
        "delivery_channel",
        "delivery_to",
        "delivery_account_id",
        "message",
        "continuation_json",
        "doctor_hint",
        "stats_json",
      ]) {
        if (!columns.has(column))
          db.exec("ALTER TABLE gateway_restart_sentinel ADD COLUMN " + column + " TEXT;");
      }
      for (const suffix of ["", "-wal", "-shm"]) {
        try {
          fs.chmodSync(params.stateDatabasePath + suffix, 0o600);
        } catch {}
      }
    });
    return db;
  } catch (err) {
    try {
      db?.close();
    } catch {}
    appendLog(
      "failed to open restart sentinel database: " + (err && err.stack ? err.stack : String(err)),
    );
    return null;
  }
}


`}));async function prepareManagedHandoffParentStore(e){let t=F(d(o.managedHandoffEngine)),n=pe({workerUrl:t.moduleUrl,maxWorkers:1,idleTimeoutMs:0,restartOnError:!1}),close=()=>n.close();t.runtimeGeneration?.retain(n,async()=>close);let run=async t=>{let r=n.runTask(t,{}),i;try{i=await r.result}finally{await r.close()}for(let t of i.warnings)try{e.onProcessIdentityWarning?.(t.pid,t.message)}catch{}if(`failure`in i)throw ue(i.failure);return i.result};try{let{onProcessIdentityWarning:t,...n}=e,r=await run({kind:`prepare`,options:n});if(r.kind!==`prepare`)throw Error(`Invalid handoff preparation reply`);return{databaseIdentity:r.value,close,async stageRuntime(e){let t=await run({kind:`stageRuntime`,directory:e});if(t.kind!==`stageRuntime`)throw Error(`Invalid handoff runtime staging reply`);return t.value},async assertCurrent(){if((await run({kind:`assertCurrent`})).kind!==`assertCurrent`)throw Error(`Invalid handoff identity reply`)},async read(...e){let t=await run({kind:`read`,args:e});if(t.kind!==`read`)throw Error(`Invalid handoff read reply`);return t.value},async release(...e){let t=await run({kind:`release`,args:e});if(t.kind!==`release`)throw Error(`Invalid handoff release reply`);return t.value},async stopNative(...e){let t=await run({kind:`stopNative`,args:e});if(t.kind!==`stopNative`)throw Error(`Invalid handoff stop reply`);return t.value},async processIdentity(...e){let t=await run({kind:`processIdentity`,args:e});if(t.kind!==`processIdentity`)throw Error(`Invalid handoff process identity reply`);return t.value},async isProcessIdentityCurrent(...e){let t=await run({kind:`isProcessIdentityCurrent`,args:e});if(t.kind!==`isProcessIdentityCurrent`)throw Error(`Invalid handoff identity check reply`);return t.value},async inspectProcessIdentity(...e){let t=await run({kind:`inspectProcessIdentity`,args:e});if(t.kind!==`inspectProcessIdentity`)throw Error(`Invalid handoff identity inspection reply`);return t.value}}}catch(e){throw await close(),e}}var On=e((()=>{a(),oe(),f(),le(),me()}));async function assertManagedServiceUpdateHandoffRoot(e){let t=R(e.expectedRoot),n=e.executingRoot?R(e.executingRoot):null,r=n!==null&&R(e.root)===n;if(!(r&&t===n)){if(r&&e.postCore){let[e,r]=await Promise.all([vt(t),vt(n)]);if(e&&r&&e.ownerRoot===r.ownerRoot&&R(r.packageRoot)===n)return}throw Error(`Managed update handoff root mismatch: expected ${e.expectedRoot}, running from ${e.root}.`)}}var kn=e((()=>{_t(),z()}));async function spawnManagedServiceUpdateHandoff(e,t,n){let r=e.parentPid??process.pid,i=e.env??process.env;if(e.foregroundOrigin){if(e.action||e.foregroundOrigin.pid!==r||r!==process.pid||e.meta.completionOwner!==`gateway-restart`)throw Error(`Foreground update requires the current Gateway's completion owner`);await assertForegroundUpdateOrigin(e.foregroundOrigin,!1,i)}let a=e.execPath??await resolveManagedHandoffNodeExecutable(i,e.supervisor),o=u(a);n.requesterAuthority?.assertCurrent(),n.requesterAuthority?.signal?.throwIfAborted();let s=await prepareManagedHandoffParentStore({databasePath:n.leaseDatabaseIdentity?.databasePath,installRoot:t,existingIdentity:n.leaseDatabaseIdentity,serviceManagerEnv:Te(i),onProcessIdentityWarning:Ut(e.runId,i)});n.leaseStore=s,n.requesterAuthority?.assertCurrent(),n.requesterAuthority?.signal?.throwIfAborted();let c=s.databaseIdentity;n.leaseDatabaseIdentity=c;let l=(await s.processIdentity(r)).startIdentity,d=await G.mkdtemp(W.join(Wt.tmpdir(),De)),f=Gt(ee(`managedUpdateHandoff`,d)),p=W.join(d,`handoff.json`),m=W.join(d,`handoff.env`),h=W.join(d,`sentinel-meta.json`),g=W.join(d,`update-failure.json`),_=L(i),v=W.join(_.stateDir,`logs`,`support`,`openclaw-update-failure-${K()}.json`),y=W.join(d,`handoff.log`),b={acceptCapabilities:e.acceptCapabilities,fullIntegrityCheck:e.fullIntegrityCheck,admission:e.admission,reapplyLocalOverrides:e.reapplyLocalOverrides,timeoutMs:e.timeoutMs,channel:e.channel,tag:e.tag},x={execPath:a,argv1:je(e.argv1??process.argv[1])},S=e.action?resolveManagedServiceCliArgv({execPath:e.action.nodeRunner,argv1:e.action.entrypoint},[`triage`]):resolveUpdateCliArgv({...b,...x});n.operatorRestartWarning&&S.push(`--no-restart`);let te=e.action?`openclaw triage (automatic)`:formatManagedServiceUpdateCommand(b,e.env)+(n.operatorRestartWarning?` --no-restart`:``),C={version:1,meta:{...e.meta,...e.runId?{runId:e.runId}:{},root:t,triageContextPath:v,...e.foregroundOrigin?{foregroundOrigin:e.foregroundOrigin}:{}}},w=[...o,f,p],T;!e.foregroundOrigin&&e.supervisor===`systemd`&&!n.operatorRestartWarning&&(T=resolveSystemdHandoffLauncher({serviceEnv:i,handoffId:e.handoffId,triage:!!e.action,directory:d,environmentPath:m,executable:a,args:w}));let E=ae(i),{nodeExecArgv:re,readyEnv:O}=prepareManagedHandoffCliRuntime(S,resolveManagedHandoffCommandEnv(i,h,C.meta.runId),a),k=e.devTarget?mt(O,e.devTarget):O,A={...T&&!e.action?{environmentPath:m}:{},operatorRestartWarning:n.operatorRestartWarning,runId:C.meta.runId,beforePark:!!e.beforePark,requester:nt(e.requester),serviceManagerEnv:Te(i),nodeExecArgv:re,runtimeArgs:o,action:e.action?.kind??`update`,failure:e.action?.failure,scopeUnit:T?.unit,systemdRun:T?.command,parentPid:r,parentStartIdentity:l,parentExitTimeoutMs:n.parentExitTimeoutMs,restartDelayMs:Math.max(0,Math.min(6e4,e.restartDelayMs??0)),parentExitDeadlineAt:Date.now()+n.parentExitTimeoutMs,cwd:d,invocationCwd:e.invocationCwd,commandArgv:S,recoveryCommandArgv:resolveManagedServiceCliArgv(x,[`gateway`,`restart`,`--preserve-definition`,`--json`]),finalizeCommandArgv:resolveManagedServiceCliArgv(x,[`update`,`finalize`,`--yes`,`--json`]),recoveryTimeoutMs:n.recoveryTimeoutMs,triageCommandArgv:resolveManagedServiceCliArgv(x,[`triage`,`--json`,`--non-interactive`]),triageContextPath:v,triageInputPath:g,triageContextCommand:V([`openclaw`,`triage`,`--run`,`--update-result`,v],_,{env:i}),triageRecoveryCommand:V([`openclaw`,`triage`],_,{env:i}),triageHint:`Update triage runs after service recovery; see the managed update helper log for the outcome and the installation-specific openclaw triage command.`,commandLabel:te,handoffId:e.handoffId,logPath:y,metaPath:h,stateDatabasePath:E,stateEngine:await zt(i),nodeSqliteLocation:se(E),updateLeaseDatabasePath:c.databasePath,updateLeaseDatabaseIdentity:c,updateLeaseKey:t,updateLeaseOwner:e.handoffId,sensitivePaths:[f,p,m,h,g,W.join(d,`terminal-result.json`),W.join(d,`sentinel-operation.json`),W.join(d,`sentinel-result.json`)],foregroundOrigin:e.foregroundOrigin,serviceRecovery:e.foregroundOrigin||n.operatorRestartWarning?void 0:resolveGatewayServiceRecovery(e.supervisor,i),recovery:await(await gt(t)?xt(t,n.recoveryTimeoutMs):yt(t)),recoveryModulePath:W.join(t,`dist`,`cli`,`daemon-cli.js`)},j,M,N,onExit=()=>{n.exited=!0,n.releaseRequesterObserver?.()};try{if(A.environmentPath&&await writeSystemdHandoffEnvironment(A.environmentPath,k),A.sensitivePaths.push(...await s.stageRuntime(d)),await G.writeFile(f,`${Mn}\n`,{mode:448}),await G.writeFile(p,`${JSON.stringify(A,null,2)}\n`,{mode:384}),await G.writeFile(h,`${JSON.stringify(C,null,2)}\n`,{mode:384}),M=await G.open(y,`a`,384).catch(()=>void 0),await s.assertCurrent(),n.requesterAuthority?.assertCurrent(),n.requesterAuthority?.signal?.throwIfAborted(),e.foregroundOrigin&&D())throw new ie;let r={cwd:d,env:k,detached:!0,stdio:A.stateEngine===`postgres`&&(!T||e.action)?[`pipe`,`pipe`,M?.fd??`ignore`,`ipc`]:[`pipe`,`pipe`,M?.fd??`ignore`]},i=T?Kt(T.command,T.args,r):Kt(a,w,r),{stdin:o,stdout:c}=i;if(!o||!c)throw Error(`Managed handoff control pipes are unavailable`);if(j=Object.assign(i,{stdin:o,stdout:c}),j.on(`message`,n=>{if(n?.type!==`handoff-sentinel`||!Number.isSafeInteger(n.requestId)||!n.request)return;let r=n.request;(async()=>{try{if(r.operation.input.root!==t||r.operation.input.handoffId!==e.handoffId||r.operation.input.runId!==e.runId)throw Error(`Handoff identity changed`);let i=await Bt(r,k);j.connected&&j.send({type:`handoff-sentinel`,requestId:n.requestId,result:i},()=>{})}catch{j.connected&&j.send({type:`handoff-sentinel`,requestId:n.requestId,error:`Shared-state sentinel operation unavailable`},()=>{})}})()}),n.launcher=j,n.closed=observeManagedServiceUpdateHandoffClose(n,j).then(async()=>{n.settled&&U.get(t)===n&&(U.delete(t),await s.close())}),j.stdin.on(`error`,()=>j.stdin.destroy()).once(`close`,()=>j.stdin.destroy()),j.once(`exit`,onExit),[N]=await Promise.all([At(j,n.recoveryTimeoutMs),Ft(j,s).then(e=>{n.launcherStartIdentity=e})]),`${N}\n`!==$&&!N.startsWith(jn))throw Error(`managed update handoff returned an invalid readiness response`);if(`${N}\n`===$){let r=await H(t);if(r?.owner!==e.handoffId||r.executor.pid!==r.helper.pid||r.executor.startIdentity!==r.helper.startIdentity||r.action.kind!==(e.action?.kind??`update`)||r.action.kind===`triage`&&(r.action.lifetime.kind!==`native`||r.action.lifetime.placement.kind!==`attached`||r.action.phase!==`reserved`)||!ne(r.executor.pid)||!await s.isProcessIdentityCurrent(r.executor,r.executor.pid===j.pid&&j.exitCode===null&&j.signalCode===null))throw fe(j),Error(`managed update handoff helper lease identity is unavailable`);n.helper=r}}catch(e){j?.removeListener(`exit`,onExit),j?.stdin.destroy(),j?.stdout.destroy();let t=await readHandoffStartupFailure(e,y,i);throw await M?.close().catch(()=>{}),M=void 0,await G.rm(d,{recursive:!0,force:!0}).catch(()=>{}),t}finally{await M?.close().catch(()=>{})}if(e.beforePark){let r=!1,i=e.requester?.authorizationSource?.startsWith(`profile:`)===!0,a={kind:`managed-update-handoff`,installRoot:t,handoffId:n.handoffId},isCurrentOwner=async()=>{try{return await It(a)===n&&n.transferred&&!n.exited}catch{return!1}},isCurrent=async()=>await isCurrentOwner()&&!n.cancelling,o=Ot(e=>{e===`park-admitted
`&&i?(async()=>{await isCurrentOwner()&&(n.parkAdmitted=!0,n.releaseRequesterObserver?.(),n.parkReady=!0,n.closeForStop?.())})():e!==`before-park
`||r||(r=!0,(async()=>{await isCurrent()&&(n.requesterAuthority?.assertCurrent(),await n.beforePark?.(),await isCurrent()&&(n.requesterAuthority?.assertCurrent(),n.requesterAuthority?.signal?.throwIfAborted(),i||(n.parkReady=!0,n.closeForStop?.()),j.stdin.write(`noticed
`)))})().catch(async()=>{await isCurrent()&&j.stdin.write(`notice-failed
`)}))});j.stdout.on(`data`,o),j.once(`exit`,()=>j.stdout.off(`data`,o))}let P={command:te,logPath:y},F=N.slice(13).trim();return`${N}\n`===$?{...P,status:`started`,...j.pid?{pid:j.pid}:{},handoffId:e.handoffId,installRoot:t}:{...P,status:`joined`,message:await describeManagedHandoffBlocker(t,F,s,i),...F?{handoffId:F}:{}}}async function startManagedServiceUpdateHandoff(e){if(e.requester?.authorizationSource?.startsWith(`profile:`)&&(!e.requesterAuthority||!e.beforePark))throw Error(`Profile update requires its original Gateway admission and park owner.`);if(e.requesterAuthority?.assertCurrent(),e.requesterAuthority?.signal?.throwIfAborted(),e.action&&e.supervisor!==`systemd`)throw Error(`Automatic managed triage requires a Linux user-systemd scope; run openclaw triage manually.`);if(!Number.isFinite(e.restartDrainTimeoutMs)||!Number.isFinite(e.restartDelayMs??0))throw Error(`managed update handoff requires a finite restart deadline`);let t=e.foregroundOrigin?void 0:await admitManagedHandoffSupervisor(e.supervisor,e.root,e.env);if(t&&e.action)throw Error(`Automatic managed triage requires a Linux user-systemd scope; run openclaw triage manually.`);let n=R(e.root),r=U.get(n),i;for(;r?.exited&&r.transferred&&!r.cancelling;){let e=r.leaseStore,t=await e?.read(n).catch(e=>{if(U.get(n)===r)throw e});if(U.get(n)!==r)r=U.get(n);else{if(!e||!t||t.kind===`unreadable`)throw Error(`The previous managed update lease is unavailable; check it before retrying.`);if(t.kind===`current`&&!await e.release(t.lease).catch(e=>{if(U.get(n)!==r)return!1;throw e})&&(i=t.lease.owner),U.get(n)!==r)r=U.get(n),i=void 0;else break}}if(r?.flight&&(!r.exited||r.cancelling||r.claimed&&!r.transferred||i)){let t=await r.flight,a=i??t.handoffId;return{status:`joined`,message:await describeManagedHandoffBlocker(n,a,r.leaseStore,e.env??process.env,r.cancelling?`cancellation settlement is pending`:r.claimed&&!r.transferred?`the Gateway still holds an untransferred handoff claim`:`helper exit or settlement has not been confirmed`),command:t.command,logPath:t.logPath,...t.pid?{pid:t.pid}:{},...a?{handoffId:a}:{}}}if(e.foregroundOrigin&&D())throw new ie;let a={handoffId:e.handoffId??K(),operatorRestartWarning:t,recoveryTimeoutMs:e.recoveryTimeoutMs??e.timeoutMs??18e5,parentExitTimeoutMs:Math.min(2147483647,Math.max(0,e.restartDrainTimeoutMs)+An),...e.beforePark?{beforePark:e.beforePark}:{},...e.requesterAuthority?{requesterAuthority:e.requesterAuthority}:{},...e.foregroundOrigin?{foregroundOrigin:{...e.foregroundOrigin}}:{},...r?.leaseDatabaseIdentity?{leaseDatabaseIdentity:r.leaseDatabaseIdentity}:{}};U.set(n,a);let o=a.requesterAuthority?.signal;if(o){let cancelRevokedRequester=()=>{a.flight?.then(async()=>{!a.parkAdmitted&&U.get(n)===a&&await cancelManagedServiceUpdateHandoff({kind:`managed-update-handoff`,handoffId:a.handoffId,installRoot:n})},()=>{})};o.addEventListener(`abort`,cancelRevokedRequester,{once:!0}),a.releaseRequesterObserver=()=>o.removeEventListener(`abort`,cancelRevokedRequester)}let s=Promise.resolve().then(async()=>(await r?.leaseStore?.close(),spawnManagedServiceUpdateHandoff({...e,handoffId:a.handoffId,meta:{...e.meta,handoffId:e.meta.handoffId??a.handoffId}},n,a)));a.flight=s;try{return await s}catch(e){throw a.releaseRequesterObserver?.(),U.get(n)===a&&U.delete(n),a.closeForStop||await a.leaseStore?.close(),e}}async function assertForegroundUpdateOrigin(e,t,n=process.env){let matchesOwner=async()=>{let r=await ke({env:n});return hasForegroundUpdatePaths(e,n)?t?r===void 0:r?.mode===`foreground`&&r.state===`live`&&r.owner===e.owner&&r.pid===e.pid&&r.host===e.host&&r.startedAt===e.startedAt&&r.port===e.port:!1};if(!await matchesOwner())throw Error(`Foreground Gateway owner or paths changed`);let r=await Ie({env:n,requireInspection:!0});if(t?r!==void 0:r?.pid!==e.pid||r.startTime!==e.startedAt||r.port!==e.port)throw Error(`Foreground Gateway locks do not match its handoff phase`);if(t&&await be(e.port)!==`free`)throw Error(`Foreground Gateway port is not verified free`);if(!await matchesOwner())throw Error(`Foreground Gateway owner or paths changed during inspection`)}async function exchangeForegroundUpdateHandoff(e,t){let n=e.env??process.env,r=await lt(n);if(r?.completionOwner!==`gateway-restart`||!r.foregroundOrigin||!hasForegroundUpdatePaths(r.foregroundOrigin,n)||!process.connected||!process.send||!await Et(e))return!1;let i=await H(R(e.root)),a=K(),o=await new Promise(e=>{let finish=t=>{clearTimeout(n),process.off(`message`,onMessage).off(`disconnect`,onDisconnect),e(t)},onDisconnect=()=>finish(!1),onMessage=e=>{typeof e==`object`&&e&&`requestId`in e&&e.requestId===a&&finish(`type`in e&&e.type===t&&`version`in e&&e.version===2&&`ok`in e&&e.ok===!0)},n=setTimeout(()=>finish(!1),t===`foreground-park`?18e5:3e4);process.on(`message`,onMessage).once(`disconnect`,onDisconnect),process.send({type:t,version:2,requestId:a},e=>{e&&finish(!1)})}),s=await H(R(e.root));return o&&s?.payload===i?.payload&&hasForegroundUpdatePaths(r.foregroundOrigin,n)&&await Et(e)}async function isCurrentForegroundUpdateHandoffProcess(e){return exchangeForegroundUpdateHandoff(e,`foreground-inspect`)}async function parkForegroundUpdateHandoff(e){if(!await exchangeForegroundUpdateHandoff({root:e.root,runId:e.run.runId,env:e.run.env},`foreground-park`))throw Error(`Foreground update helper could not verify Gateway closure`);e.run.gatewayRestartRequired=!0}async function transferManagedServiceUpdateHandoff(e){let t=U.get(R(e.installRoot)),n=t?.launcher;return t?.foregroundOrigin&&D()||!t||!n?.stdin||!n.stdout||!await Pt(e)||U.get(R(e.installRoot))!==t?!1:(t.requesterAuthority?.assertCurrent(),t.requesterAuthority?.signal?.throwIfAborted(),t.transferred=!0,await Lt(e,`transfer`)===`transferred`?(n.unref(),Nt(n.stdin),Nt(n.stdout),n.channel?.unref(),!0):(t.transferred=!1,!1))}async function cancelManagedServiceUpdateHandoff(e){let t=R(e.installRoot),n=U.get(t);if(e.kind!==`managed-update-handoff`||n?.handoffId!==e.handoffId||!n.leaseStore||n.cancelling)return!1;n.cancelling=!0;try{let r=await H(t);if(r?.action.kind===`triage`&&(r.owner!==n.handoffId||JSON.stringify(r.helper)!==JSON.stringify(n.helper?.helper)||JSON.stringify({...r.action,phase:`reserved`})!==JSON.stringify(n.helper?.action)||!await n.leaseStore.stopNative(r)))return!1;let i=n.launcher;if(i&&!n.exited&&i.exitCode===null&&i.signalCode===null){let t=new Promise(e=>{i.once(`exit`,()=>e())}),r=await Lt(e,`cancel`);if(r===`restore-after-exit`)return`restart-after-exit`;if(r!==`cancelled`&&!n.exited&&!i.stdin.destroyed)return!1;await t}return await H(t,n)!==null||U.get(t)!==n?!1:(U.delete(t),n.closeForStop||await n.leaseStore.close(),`restored-in-process`)}catch{return!1}finally{n.cancelling=!1,n.parkAdmitted&&n.closeForStop?.()}}var An,$,jn,Mn,Nn=e((()=>{Tt(),Ee(),de(),re(),E(),P(),Fe(),Ae(),Ke(),ce(),Me(),ye(),p(),f(),dt(),pt(),_t(),z(),Oe(),Yt(),Xt(),kt(),jt(),Zt(),$t(),tn(),rn(),fn(),pn(),hn(),_n(),Sn(),vn(),Vt(),Tn(),Dn(),On(),tt(),Ht(),St(),ht(),kn(),An=3e4,$=`OPENCLAW_UPDATE_HANDOFF_READY
`,jn=`HANDOFF_BUSY `,Mn=String.raw`
const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

${Qt}

const { formatErrorMessage, parseLaunchctlJob, classifyUpdateOutcome, OPENCLAW_STATE_SCHEMA_SQL, assertOpenClawStateWriteAllowed, prepareManagedHandoffLeaseStore, extractSqliteTableSchema, inspectManagedHandoffSentinelRowSync, recordManagedHandoffSentinelOutcomeRowSync, resolveImmutableSqliteFileUri, resolveUpdateRestartNoticeMeta, shouldPublishUpdateRestartNotice, procCgroupMembershipMatches, prepareManagedHandoffLedger, packageActivationIdentity, resolveUpdateInstallRoot, recoverInterruptedManagedUpdate, readManagedHandoffGatewayStop, findUpdateGatewayStop } =
  require("./runtime/${Q}");
if (!params.updateLeaseDatabaseIdentity) {
  throw new Error("Managed handoff requires its prepared lease database identity");
}
let leaseStore;
let isPidAlive, parseSystemdProperties, validTriageFailure;
const runWarnings = new Map();
if (params.operatorRestartWarning) runWarnings.set("warning:managed-service-reconciliation", params.operatorRestartWarning);
function recordRunWarnings(ledger) {
  if (!params.runId) return;
  for (const [step, detail] of runWarnings) {
    try {
      ledger.recordUpdateRunStep(params.runId, { step, status: "completed", detail, endedAtMs: Date.now() });
      runWarnings.delete(step);
    } catch { /* The candidate runtime records warnings after state migration. */ }
  }
}
let managedUpdateLease = null;
let triageRequesterAuthority;
function assertTriageRequester() {
  if (triageRequesterAuthority && !triageRequesterAuthority.isCurrent())
    throw new Error("requester-revoked");
}
let activeCommand;
let finalExitCode = 0;
let updateCancelled = false;
let terminationRequested = false;
let wakeTermination;
let transferred = false;
let updateRequesterIdentity;
let activationRejected;
${en}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanupSensitiveFiles() {
  for (const filePath of params.sensitivePaths || []) {
    try {
      fs.rmSync(filePath, { force: true });
    } catch {
      // Best effort only.
    }
  }
}


${En}
${xn}

${Jt}

${nn}

process.on("SIGTERM", () => {
  if (terminationRequested) return;
  terminationRequested = true;
  appendLog("managed handoff termination requested; waiting for owned command settlement");
  if (params.action === "triage") {
    if (managedUpdateLease) leaseStore.settle(managedUpdateLease, "closing");
    appendLog("automatic triage cancelled by termination signal; no Gateway restoration");
    stopTriageScope();
  } else if (activeCommand && activeCommand.exitCode === null && activeCommand.signalCode === null) {
    // The updater owns rollback and accepted writes. Signal only its direct process,
    // then join its result before releasing the lease or deciding native recovery.
    activeCommand.kill("SIGTERM");
  }
  finishBeforeParkNotice?.("disconnected");
  wakeTermination?.();
});

function isLaunchdNotLoaded(result) {
  return /no such process|could not find service|not found/i.test(result.stderr || result.stdout);
}

let parkedServiceGeneration = null;
let parkedServiceInvocation = null;
let parkedServiceFragment = null;
let restorationArmed = false;
let updaterStarted = false;
let originalInstallationIdentity;
let pendingServiceStop;
let finishBeforeParkNotice;

function isParkedSystemdGeneration(current, allowCleared = false) {
  return (current?.ExecMainStartTimestampMonotonic === parkedServiceGeneration &&
    current?.InvocationID === parkedServiceInvocation) ||
    (allowCleared && current?.ExecMainStartTimestampMonotonic === "0" && !current?.InvocationID);
}

function recordServiceStop() {
  serviceStoppedAtMs ??= Date.now();
  // Both native stop observations retain the updater phase; they do not own activation.
  pendingServiceStop?.then((stopped) => {
    runLedger?.recordUpdateRunStep(params.runId, {
      step: "service-stop", status: stopped.code === 0 || (params.serviceRecovery?.kind === "launchd" && isLaunchdNotLoaded(stopped)) ? "completed" : "failed", endedAtMs: Date.now(),
    });
  }).catch((error) => appendLog("could not record service stop completion: " + String(error)));
  try {
    const metaFile = JSON.parse(fs.readFileSync(params.metaPath, "utf-8"));
    metaFile.meta.serviceStoppedAtMs ??= serviceStoppedAtMs;
    fs.writeFileSync(params.metaPath, JSON.stringify(metaFile), { mode: 0o600 });
    runLedger?.recordUpdateRunStep(params.runId, {
      step: "service-stop", status: "in_progress", startedAtMs: metaFile.meta.serviceStoppedAtMs,
    });
  } catch (error) {
    appendLog("could not record service stop time: " + String(error));
  }
}

function assertGatewayParkOwner() {
  if (terminationRequested || updateCancelled || (params.foregroundOrigin && activationRejected) || !ownsManagedUpdateLease() ||
    !parentIdentityCurrent()) {
    throw new Error("managed update activation no longer owns the serving gateway");
  }
}

async function parkGatewayService() {
  if (params.operatorRestartWarning) throw new Error(params.operatorRestartWarning);
  const recovery = params.serviceRecovery;
  if (!recovery) return;
  assertGatewayParkOwner();
  if (recovery.kind === "schtasks") {
    await prepareTransferredGateway();
    assertGatewayParkOwner();
    pendingServiceStop = runServiceCommand("schtasks.exe", ["/End", "/TN", recovery.taskName], () => {
      restorationArmed = true;
      recordServiceStop();
    }, params.parentExitDeadlineAt, params.parentExitTimeoutMs);
    if ((await pendingServiceStop).code !== 0) throw new Error("scheduled task stop failed");
    return;
  }
  const systemd = recovery.kind === "systemd";
  let target;
  if (systemd) {
    const current = await inspectSystemdService(recovery.unit, params.parentExitDeadlineAt);
    if (
      !current ||
      current.Id !== recovery.unit ||
      current.LoadState !== "loaded" ||
      current.ActiveState !== "active" ||
      current.MainPID !== String(params.parentPid) ||
      !/^[1-9]\d*$/.test(current.ExecMainStartTimestampMonotonic || "") ||
      !/^[a-f0-9]{32}$/i.test(current.InvocationID || "")) {
      throw new Error("systemd service does not match the exact active gateway parent");
    }
    assertGatewayParkOwner();
    parkedServiceGeneration = current.ExecMainStartTimestampMonotonic;
    parkedServiceInvocation = current.InvocationID;
    parkedServiceFragment = current.FragmentPath;
  } else {
    if (recovery.kind !== "launchd") throw new Error("unsupported managed update supervisor");
    target = "gui/" + recovery.uid + "/" + recovery.label;
    const inspection = await runServiceCommand("launchctl", ["print", target], undefined, params.parentExitDeadlineAt);
    if (inspection.code !== 0 || parseLaunchctlJob(inspection.stdout, target).runtime.pid !== params.parentPid) {
      throw new Error("launchd service does not match the exact active gateway parent");
    }
    assertGatewayParkOwner();
  }
  await prepareTransferredGateway();
  assertGatewayParkOwner();
  if (!systemd) {
    restorationArmed = true;
    const disabled = await runServiceCommand("launchctl", ["disable", target], undefined, params.parentExitDeadlineAt);
    if (disabled.code !== 0) throw new Error("launchctl disable failed: " + disabled.stderr);
    assertGatewayParkOwner();
  }
  // Accepted spawn acknowledges parking; the exact stop stays open through parent exit.
  await new Promise((resolve, reject) => {
    pendingServiceStop = runServiceCommand(
      systemd ? "systemctl" : "launchctl",
      systemd ? ["--user", "stop", recovery.unit] : ["bootout", target],
      () => {
        if (systemd) restorationArmed = true;
        recordServiceStop();
        resolve();
      },
      params.parentExitDeadlineAt,
      systemd ? params.parentExitTimeoutMs : undefined,
    );
    pendingServiceStop.then((result) => {
      if (systemd ? !restorationArmed : result.code !== 0 && !isLaunchdNotLoaded(result)) {
        reject(new Error((systemd ? "systemd stop" : "launchctl bootout") + " failed: " + result.stderr));
      }
    });
  });
}

${gn}
async function finishGatewayServicePark() {
  const stopped = pendingServiceStop ? await pendingServiceStop : null;
  if (stopped && stopped.code !== 0 && params.serviceRecovery?.kind === "launchd" &&
    !isLaunchdNotLoaded(stopped)) {
    throw new Error("launchctl bootout failed: " + stopped.stderr);
  }
  if (params.serviceRecovery?.kind === "systemd") {
    if (!stopped || stopped.code !== 0 || Date.now() >= params.parentExitDeadlineAt) {
      throw new Error("systemd stop failed or exceeded the parent-exit deadline");
    }
    const unit = params.serviceRecovery.unit;
    for (;;) {
      const current = await inspectSystemdService(unit, params.parentExitDeadlineAt);
      if (!current || current.Id !== unit || current.LoadState !== "loaded" ||
        Date.now() >= params.parentExitDeadlineAt) {
        throw new Error("systemd service remained active or changed execution generation");
      }
      // KillMode=mixed may settle a non-zero Gateway exit as failed. Both settled
      // states accept the parked generation or its collected inactive metadata.
      const settled = current.ActiveState === "inactive" || current.ActiveState === "failed";
      if ((!settled && current.ActiveState !== "deactivating") || current.MainPID !== "0" ||
        !isParkedSystemdGeneration(current, settled)) {
        throw new Error("systemd service remained active or changed execution generation");
      }
      if (settled) break;
      // The exact stop job has completed; systemd may publish inactive a moment later.
      await sleep(Math.min(25, Math.max(0, params.parentExitDeadlineAt - Date.now())));
    }
  }
  if (params.serviceRecovery?.kind === "launchd") {
    const target = "gui/" + params.serviceRecovery.uid + "/" + params.serviceRecovery.label;
    const deadline = params.parentExitDeadlineAt;
    for (;;) {
      const result = await runServiceCommand("launchctl", ["print", target], undefined, deadline);
      if (result.code !== 0) {
        if (!isLaunchdNotLoaded(result)) throw new Error("launchctl print failed: " + result.stderr);
        break;
      }
      if (Date.now() >= deadline) throw new Error("launchd service remained loaded after parent exit");
      await sleep(Math.min(500, Math.max(0, deadline - Date.now())));
    }
  }
  runLedger?.recordUpdateRunVerification(params.runId, { serviceRunning: false });
}

let transferPrepared = false;
let foregroundClosed = false;
let foregroundParked = false;
let foregroundParkFlight;
let foregroundRespawn = false;
async function assertForegroundOrigin(closed = false) {
  assertGatewayParkOwner();
  // Parking precedes the updater, so the installed runtime still owns origin checks.
  const { assertForegroundUpdateOrigin } = await import(pathToFileURL(params.recoveryModulePath).href);
  await assertForegroundUpdateOrigin(params.foregroundOrigin, closed);
  assertGatewayParkOwner();
}
async function parkForegroundGateway() {
  await waitForTransferredRestartDelay();
  await assertForegroundOrigin();
  await prepareTransferredGateway();
  const deadline = Date.now() + params.parentExitTimeoutMs;
  while (!foregroundClosed) {
    assertGatewayParkOwner();
    if (Date.now() >= deadline) throw new Error("foreground Gateway did not close before activation deadline");
    await sleep(Math.min(25, Math.max(0, deadline - Date.now())));
  }
  await assertForegroundOrigin(true);
  await assertUpdateRequester();
  foregroundParked = true;
}
async function waitForTransferredRestartDelay() {
  const delayedUntil = Date.now() + params.restartDelayMs;
  while (Date.now() < delayedUntil) {
    if (terminationRequested || updateCancelled || !ownsManagedUpdateLease()) throw new Error("managed update activation cancelled");
    await sleep(Math.min(250, Math.max(0, delayedUntil - Date.now())));
  }
}

function assertPreparedProfileRequester() {
  if (!updateRequesterIdentity?.isCurrentIdentity())
    throw Object.assign(new Error("owner_required: original update requester is no longer authorized"), { code: "owner_required" });
}

async function assertUpdateRequester() {
  if (!params.requester) return;
  if (requiresRequesterAcknowledgement) {
    if (!transferred || updateCancelled || !ownsManagedUpdateLease())
      throw new Error("Profile requester requires its current transferred update owner");
    if (!updateRequesterIdentity) {
      const { prepareManagedUpdateRequesterIdentity } = await import(pathToFileURL(params.recoveryModulePath).href);
      if (!transferred || updateCancelled || !ownsManagedUpdateLease())
        throw new Error("Profile update owner changed during requester preparation");
      updateRequesterIdentity = await prepareManagedUpdateRequesterIdentity(params.requester);
    }
    if (updateCancelled || !ownsManagedUpdateLease()) throw new Error("Profile update owner changed");
    assertPreparedProfileRequester();
    return;
  }
  const { isManagedUpdateRequesterOwner } = await import(pathToFileURL(params.recoveryModulePath).href);
  if (!(await isManagedUpdateRequesterOwner(params.requester)))
    throw Object.assign(new Error("owner_required: chat requester is no longer a configured command owner"), { code: "owner_required" });
}

async function prepareTransferredGateway() {
  if (transferPrepared) return;
  await assertUpdateRequester();
  assertGatewayParkOwner();
  if (requiresRequesterAcknowledgement && (!params.beforePark || process.stdin.destroyed || process.stdin.readableEnded))
    throw Object.assign(new Error("owner_required: original Gateway park acknowledgement is unavailable"), { code: "owner_required" });
  // The existing pipe joins the final notice and original grant check before
  // native stop. Profile admission requires an affirmative reply within this bound.
  if (params.beforePark && !process.stdin.destroyed) {
    const notice = await new Promise((resolve) => {
      const finish = (outcome) => { clearTimeout(timer); finishBeforeParkNotice = undefined; resolve(outcome); };
      const timer = setTimeout(() => {
        appendLog("pre-park notice timed out after 10 seconds");
        finish("timeout");
      }, 10_000);
      finishBeforeParkNotice = finish;
      fs.writeSync(1, ${JSON.stringify(Dt)});
    });
    if (requiresRequesterAcknowledgement && notice !== "noticed")
      throw Object.assign(new Error("owner_required: original Gateway did not authorize parking"), { code: "owner_required" });
  }
  if (requiresRequesterAcknowledgement) {
    assertPreparedProfileRequester();
    assertGatewayParkOwner();
    const receipt = ${JSON.stringify(Rt)};
    if (fs.writeSync(1, receipt) !== Buffer.byteLength(receipt))
      throw new Error("Managed update park acceptance receipt was incomplete");
  } else {
    await assertUpdateRequester();
    assertGatewayParkOwner();
  }
  transferPrepared = true;
}

${mn}

function killOwnedCommand(child) {
  if (process.platform === "win32") {
    spawnSync("taskkill.exe", ["/PID", String(child.pid), "/T", "/F"], {
      env: params.serviceManagerEnv, stdio: "ignore", windowsHide: true, timeout: 5000,
    });
  } else {
    try { process.kill(-child.pid, "SIGKILL"); } catch {}
  }
  try { child.kill("SIGKILL"); } catch {}
}


${Mt}

async function collectUpdateFailureTriage() {
  try {
    if (!triageFailure || !ownsManagedUpdateLease()) return;
    // Diagnostic reads share this boundary so they cannot bypass terminal cleanup.
    await captureManagedUpdateResult();
    appendLog("If triage is unavailable, run " + params.triageRecoveryCommand + " on the Gateway host.");
    if (terminalRuntimePath === stagedRuntimePath() || !fs.existsSync(terminalRuntimePath)) {
      appendLog("Installed runtime remains unavailable or unverified; run openclaw update repair before triage.");
      return;
    }
    // The helper and outer updater start from the same installation. Preserve
    // its complete export; absent exports have only the helper's observed failure.
    const recordedFailure = fs.existsSync(params.triageContextPath);
    if (recordedFailure) {
      appendLog("Saved update failure: " + params.triageContextPath);
      appendLog("Reuse this diagnostic context on the Gateway host: " + params.triageContextCommand);
    }
    const failure = recordedFailure
      ? JSON.parse(fs.readFileSync(params.triageContextPath, "utf8"))
      : { error: "Managed update failed: " + (triageFailure.payload?.stats?.reason || triageFailure.reason) };
    const recovery = typeof triageFailure.restored === "boolean"
      ? "Service recovery " + (triageFailure.restored ? "succeeded." : "failed.")
      : "Service recovery outcome was not recorded; inspect the handoff log before restarting.";
    failure.error = [failure.error, recovery, triageFailure.recoveryReason].filter(Boolean).join("\n");
    // Keep the canonical export intact even when installed triage cannot start.
    // Only this private annotated input is removed with the helper's other files.
    fs.writeFileSync(params.triageInputPath, JSON.stringify(failure), { mode: 0o600, flag: "wx" });
    appendLog("starting diagnostic-only update triage after service recovery settled");
    const exit = await runOwnedUpdateCommand(
      "diagnostic",
      [...params.triageCommandArgv, "--update-result", params.triageInputPath],
      Math.min(params.recoveryTimeoutMs, 60_000),
    );
    appendLog(!exit.signal && exit.code === 0
      ? "update triage completed; diagnostic report is above"
      : "update triage could not complete; " + params.triageHint);
  } catch (error) {
    appendLog("update triage could not complete: " + String(error) + "; " + params.triageHint);
  }
}


(async () => {
  leaseStore = await prepareManagedHandoffLeaseStore({
    databasePath: params.updateLeaseDatabasePath,
    serviceManagerEnv: params.serviceManagerEnv,
    existingIdentity: params.updateLeaseDatabaseIdentity,
    onProcessIdentityWarning: (pid, message) => {
      appendLog(message);
      runWarnings.set("warning:process-start-identity:" + pid, message);
      if (runLedger && !updaterStarted) recordRunWarnings(runLedger);
    },
  }, { warn: (message, metadata) => appendLog(message + " " + JSON.stringify(metadata)) });
  ({ isPidAlive, properties: parseSystemdProperties, validFailure: validTriageFailure } = leaseStore);
  if (
    !params.triageTransition &&
    (!Number.isInteger(params.parentPid) ||
      params.parentPid <= 0 ||
      typeof params.parentStartIdentity !== "string" ||
      !params.parentStartIdentity)
  ) {
    throw new Error("managed update parent process identity is unavailable");
  }
  if (
    !params.triageTransition &&
    isPidAlive(params.parentPid) &&
    !parentIdentityCurrent()
  ) {
    throw new Error("managed update parent process identity changed");
  }
  if (
    !["update", "triage"].includes(params.action) ||
    !Number.isFinite(params.parentExitTimeoutMs) ||
    params.parentExitTimeoutMs < 0 ||
    !Number.isFinite(params.parentExitDeadlineAt)
  ) {
    throw new Error("managed update parent exit deadline is unavailable");
  }
  const lease = acquireManagedUpdateLease();
  if (!lease.acquired) {
    appendLog("managed update handoff joined active owner=" + (lease.owner || "unknown"));
    cleanupSensitiveFiles();
    fs.writeSync(1, ${JSON.stringify(jn)} + (lease.owner || "") + "\n");
    await sleep(25);
    return;
  }
  let outcome = params.triageTransition ? "triage" : undefined;
  let wake;
  wakeTermination = () => wake?.();
  let controlDeadlinePending = true;
  const controlDeadlineAt = performance.now() + params.parentExitTimeoutMs;
  try {
    if (params.action === "update" && params.runId) {
      // Refuse before ownership transfer when the installation it would update is incomplete.
      if (!fs.existsSync(params.recoveryModulePath)) throw new Error("installed runtime is unavailable: " + params.recoveryModulePath);
      // Bookkeeping, including lazy fs-safe loads, must survive a missing install.
      // Terminal writes prefer the fresh candidate after any schema migration.
      runLedger = await prepareManagedHandoffLedger(ownsManagedUpdateLease);
      // A release link is read through: the release it names is the installed runtime.
      originalInstallationIdentity = packageActivationIdentity(fs.realpathSync(params.updateLeaseKey), true);
      for (const name of ["adoptUpdateRun", "finishUpdateRun", "getUpdateRun", "recordUpdateRunStep", "recordUpdateRunVerification"]) {
        if (typeof runLedger[name] !== "function") throw new Error("managed update ledger writer is unavailable");
      }
      if (!ownsManagedUpdateLease()) throw new Error("managed update lease no longer owns the helper");
      // Retain prior drivers while recording this helper's independent lifetime.
      // Windows launcher attribution is not a ledger birth identity.
      const managedHandoffParent = /^\d+$/.test(params.parentStartIdentity)
        ? { pid: params.parentPid, startIdentity: params.parentStartIdentity, host: require("node:os").hostname() }
        : undefined;
      if (!managedHandoffParent) runWarnings.set("warning:managed-handoff-parent-identity",
        "Parent has launcher attribution only; automatic orphan recovery is unavailable.");
      runLedger.adoptUpdateRun(params.runId, {
        managedHandoffParent,
      });
      recordRunWarnings(runLedger);
      if (params.foregroundOrigin) await assertForegroundOrigin();
    }
    if (params.action === "triage") {
      await admitTriageScope();
      if (params.requester) {
        const { createManagedUpdateRequesterAuthority } = await import(pathToFileURL(path.join(params.updateLeaseKey, "dist", "cli", "daemon-cli.js")).href);
        triageRequesterAuthority = await createManagedUpdateRequesterAuthority(params.requester);
        assertTriageRequester();
      }
    }
    if (terminationRequested) return;
    if (!params.triageTransition) fs.writeSync(1, ${JSON.stringify($)});
    const commands = [];
    let input = "";
    let disconnected = false;
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      if (terminationRequested) return;
      input += chunk;
      if (input.length > 64) return process.stdin.destroy();
      let newline;
      while ((newline = input.indexOf("\n")) >= 0) {
        if (commands.length >= 4) return process.stdin.destroy();
        const command = input.slice(0, newline);
        input = input.slice(newline + 1);
        if (transferred && (command === "noticed" || command === "notice-failed")) {
          if (command === "notice-failed") {
            appendLog("pre-park notice failed");
            if (params.foregroundOrigin || requiresRequesterAcknowledgement) activationRejected ??= "managed-service-handoff-helper-failed";
          }
          finishBeforeParkNotice?.(command);
        } else if (transferred && params.foregroundOrigin && command === "closed") {
          if (!foregroundParkFlight || !parentIdentityCurrent() || !ownsManagedUpdateLease())
            return process.stdin.destroy();
          foregroundClosed = true;
        } else if (command === "cancel" && transferred) {
          // Cancellation can discard staging before park admission. After admission,
          // only the orchestrator may decide whether the installed tree can restart.
          if (!restorationArmed && !foregroundClosed && !(requiresRequesterAcknowledgement && transferPrepared) &&
              !(params.operatorRestartWarning && updaterStarted)) {
            updateCancelled = true;
            if (activeCommand) killOwnedCommand(activeCommand);
            reply("cancelled");
          } else reply("cancel-unavailable");
        } else commands.push(command);
      }
      wake?.();
    });
    const onDisconnect = () => { disconnected = true; finishBeforeParkNotice?.("disconnected"); wake?.(); };
    process.stdin.once("end", onDisconnect).once("close", onDisconnect);
    const reply = (line) => fs.writeSync(1, line + "\n");
    let parked = false;
    while (outcome !== "triage" && isPidAlive(params.parentPid)) {
      if (terminationRequested) { outcome = "restore"; break; }
      if (!ownsManagedUpdateLease())
        throw new Error("managed update lease no longer owns the helper");
      if (!parentIdentityCurrent()) {
        if (isPidAlive(params.parentPid))
          throw new Error("managed update parent process identity changed");
        await new Promise((resolve) => setImmediate(resolve));
        if (!commands.length) break;
      }
      if (controlDeadlinePending && performance.now() >= controlDeadlineAt) {
        controlDeadlinePending = false;
        if (outcome !== "update" && outcome !== "triage") outcome = "restore";
        if (params.action === "triage") throw new Error("automatic triage admission expired");
        if (!parked) {
          await recordManagedUpdateOutcome("managed-service-handoff-cancelled");
          return;
        }
        if (
          ownsManagedUpdateLease() &&
          parentIdentityCurrent()
        ) {
          try {
            process.kill(params.parentPid, "SIGKILL");
          } catch {}
        }
      }
      const command = commands.shift();
      if (command === "transfer" && params.action === "update" && !parked && !transferred) {
        transferred = true;
        appendLog("managed update ownership transferred; validating while the gateway serves");
        reply("transferred");
        outcome = "update";
        break;
      } else if (command === "commit" && params.action === "triage") {
        await inspectTriageScope();
        if (!ownsManagedUpdateLease()) throw new Error("automatic triage admission lost its lease");
        outcome = "triage";
        reply("committed");
        break;
      } else if (command === "park" && params.action !== "triage") {

        try {
          if (!parked) await parkGatewayService();
          parked = true;
          reply("parked");
        } catch (error) {
          appendLog("managed service parking failed: " + String(error));
          if (restorationArmed) {
            outcome = "restore";
            reply("restore-after-exit");
          } else {
            await recordManagedUpdateOutcome("managed-service-handoff-cancelled");
            reply("cancelled");
            return;
          }
        }
      } else if (command === "commit" && parked) {
        const restoring = outcome === "restore" || Date.now() >= params.parentExitDeadlineAt;
        outcome = restoring ? "restore" : "update";
        reply(restoring ? "restore-after-exit" : "committed");
      } else if (command === "cancel" || (disconnected && outcome !== "update")) {
        if (!restorationArmed) {
          if (params.action === "update")
            await recordManagedUpdateOutcome("managed-service-handoff-cancelled");
          if (command) reply("cancelled");
          return;
        }
        outcome = "restore";
        if (command) reply("restore-after-exit");
      } else if (command === "restore-commit" && outcome === "restore") {
        reply("committed");
      } else if (command) {
        throw new Error("invalid managed update control command");
      }
      await Promise.race([
        sleep(25),
        new Promise((resolve) => {
          wake = resolve;
        }),
      ]);
    }
    if (outcome !== "update" && outcome !== "triage") {
      if (restorationArmed) await restoreGatewayService("managed-service-handoff-cancelled");
      else if (params.action === "update")
        await recordManagedUpdateOutcome("managed-service-handoff-cancelled");
      return;
    }
    if (restorationArmed) await finishGatewayServicePark();

    if (params.action === "update") await assertUpdateRequester();
    if (terminationRequested || updateCancelled) {
      if (restorationArmed) await restoreGatewayService("managed-service-handoff-cancelled");
      else await recordManagedUpdateOutcome("managed-service-handoff-cancelled");
      return;
    }
    appendLog("starting managed update command: " + params.commandLabel);
    // Update inputs retain shell-relative paths; recovery keeps the durable helper cwd.
    const exit = await runOwnedUpdateCommand(params.action, params.commandArgv, undefined, params.action === "update" ? params.invocationCwd : params.cwd);
    if (params.action === "triage") {
      if (exit.signal || exit.code !== 0) finalExitCode = exit.code || 1;
      return;
    }
    if (updateCancelled || activationRejected) {
      const reason = updateCancelled ? "managed-service-handoff-cancelled" : activationRejected;
      // No parked acknowledgement authorized a swap. Recovery waits for any
      // dispatched stop, even when cancellation overlaps the parent's drain.
      if (restorationArmed) {
        if (!(await restoreGatewayService(reason))) finalExitCode = 1;
      } else await recordManagedUpdateOutcome(reason);
      if (!updateCancelled) finalExitCode = 1;
      return;
    }
    const { updaterOutput, outputOverflow } = exit;
    // Only this invocation's direct child result carries the producer decision.
    // Success may change install roots; only recovery requires the original root.
    // Sentinels and diagnostic exports never authorize activation.
    const result = outputOverflow ? null : parseManagedUpdateResult(updaterOutput);
    if ((exit.signal || !result) && shouldRecoverInterruptedUpdater()) {
      await recoverInterruptedUpdater();
      return;
    }
    if (!exit.signal && ownsManagedUpdateLease() && result?.status === "skipped" &&
      result.reason === "update-ledger-busy" && result.root === undefined && result.runId === undefined &&
      ((result.mode === "unknown" && exit.code === 0) || (result.mode === "finalize" && exit.code === 1))) {
      // Admission never acquired an install/run result. Preserve its deferral without
      // turning the missing root into either recovery or successor authority.
      runOutcome = { status: "skipped", reason: result.reason };
      finalExitCode = exit.code;
      return;
    }
    let resultRoot;
    // The lease key of a release link is the link itself, which outlives a switch.
    try { fs.realpathSync(result?.root); resultRoot = resolveUpdateInstallRoot(result.root); } catch {}
    if (result?.status === "ok" && resultRoot && resultRoot !== params.updateLeaseKey) {
      terminalRuntimePath = path.join(resultRoot, "dist", "cli", "daemon-cli.js");
    }
    const reportedFailure = classifyUpdateOutcome(result ?? {}) === "failed";
    if (!exit.signal && exit.code === 0 && resultRoot && result?.status === "ok") {
      runOutcome = { status: "succeeded", after: result.after };
    } else if (resultRoot && ["error", "skipped"].includes(result?.status)) {
      runOutcome = { status: result.status === "skipped" && !exit.signal && exit.code === 0 ? "skipped" : "failed", reason: result.reason, after: result.after };
    }
    if (reportedFailure) triageFailure ??= { reason: result?.reason || "managed-service-handoff-failed" };
    const childStatus = !exit.signal && resultRoot === params.updateLeaseKey && ["error", "skipped"].includes(result?.status) ? result.status : undefined;
    if (childStatus) closedUpdateResult = result;
    const recovery = childStatus ? result.recovery : null;
    if (triageFailure && recovery?.service) triageFailure.restored = recovery.service === "healthy";
    const safe = !exit.signal && recovery?.serviceRestartSafe === true &&
      typeof recovery.version === "string" && recovery.version.trim() &&
      (recovery.buildId === undefined ? result.mode !== "git" :
        typeof recovery.buildId === "string" && recovery.buildId.trim() && recovery.buildId.length <= 96) &&
      ownsManagedUpdateLease();
    if (params.foregroundOrigin) {
      const succeeded = !exit.signal && exit.code === 0 && resultRoot && result?.status === "ok";
      // The updater's pending readiness result permits a fresh process without
      // turning unverified startup into a successful update.
      const readinessPending = !exit.signal && exit.code === 0 && resultRoot === params.updateLeaseKey &&
        result?.status === "skipped" && result.reason === "gateway-readiness-unverified" &&
        result.recovery?.serviceRestartSafe !== false;
      foregroundRespawn = foregroundParked && ownsManagedUpdateLease() && parentIdentityCurrent() &&
        (succeeded || readinessPending || (safe && recovery.service !== "failed" &&
          exit.code !== ${79}));
      if (!runOutcome || (foregroundParked && succeeded && !foregroundRespawn))
        runOutcome = { status: "failed", reason: "managed-service-handoff-failed" };
      if (runOutcome.status !== "succeeded")
        finalExitCode = exit.code || (runOutcome.status === "skipped" && !reportedFailure && !exit.signal ? 0 : 1);
      return;
    }
    const recoveryRun = safe && recovery.packageRollbackVerified === true && runLedger?.getUpdateRun(params.runId);
    // The rollback owner restores the generation and grants restart authority. The
    // same-run receipt corroborates it; exit 79 alone never permits a recovery start.
    const previousGeneration = restorationArmed && recoveryRun?.status === "running" &&
      recoveryRun.runId === params.runId && recoveryRun.before.version === recovery.version &&
      recoveryRun.after.version === recovery.version && result.before?.version === recovery.version &&
      result.after?.version === recovery.version && (!recovery.buildId ||
        [recoveryRun.before, recoveryRun.after, result.before, result.after].every((version) => version.buildId === recovery.buildId)) && recoveryRun.steps.some((step) =>
        step.step === "previous generation restoration" && step.status === "completed");
    if (exit.code === ${79} && !previousGeneration) {
      appendLog(recovery?.dataAtRisk ? "gateway left stopped: data at risk (" + recovery.dataAtRisk + ") recorded and not yet verified; run openclaw update repair to verify the state and restart the gateway" : "managed update recovery failed (" + (recovery?.reason || result?.reason || "unverified recovery") + "); run openclaw update repair and openclaw gateway status --deep");
      await recordManagedUpdateOutcome("managed-service-handoff-unsafe-recovery");
      finalExitCode = exit.code;
    } else if (!resultRoot || result?.status !== "ok" ||
      exit.signal || exit.code !== 0) {
      let restored = !restorationArmed || (safe && recovery.service === "healthy");
      if (restorationArmed && safe && recovery.service === undefined) {
        restored = await restoreGatewayService(previousGeneration ? result.reason : "managed-service-handoff-failed", recovery, childStatus, previousGeneration);
      } else {
        appendLog("managed update recovery not attempted: " +
          (recovery?.serviceRestartSafe === false ? "updater explicitly rejected activation" :
            recovery?.service === "healthy" ? "updater already verified recovery" :
              recovery?.service === "failed" ? "updater recovery failed; no automatic retry" :
                "no verified recovery result; inspect the installation before restarting"));
        if (restorationArmed && !restored) { const alarm = "Gateway recovery failed after the update. OpenClaw stopped automatic recovery because it could not safely verify the installed runtime. Recovery details were saved with the update result."; appendLog(alarm); runWarnings.set("warning:gateway-availability", alarm); }
        if (childStatus !== "skipped" || !restored) {
          await recordManagedUpdateOutcome("managed-service-handoff-failed", undefined, childStatus === "skipped" ? "error" : childStatus);
        }
      }
      if (previousGeneration && restored) {
        runOutcome = { status: "rolled-back", reason: result.reason, after: result.after };
      }
      finalExitCode = previousGeneration && restored ? 1 : exit.code ||
        (childStatus === "skipped" && restored && !exit.signal && !reportedFailure ? 0 : 1);
    }
  } catch (err) {
    appendLog("handoff failed: " + formatErrorMessage(err, { includeCode: true }) + "\n" + (err && err.stack ? err.stack : String(err)));
    const reason = err?.code === "owner_required" ? "owner_required" : "managed-service-handoff-helper-failed";
    if (params.action === "update") runOutcome = { status: "failed", reason };
    if (hasManagedUpdateLease()) {
      if (params.action !== "triage") bindManagedUpdateLeaseToProcess(process.pid);
      if (restorationArmed && !updaterStarted) await restoreGatewayService(reason);
      else if (params.action === "update") await recordManagedUpdateOutcome(reason);
    }
    finalExitCode = 1;
  } finally {
    try { await finishManagedUpdateRun(); }
    catch (error) {
      appendLog("failed to finalize update run: " + String(error));
      foregroundRespawn = false;
      finalExitCode = 1;
    }
    if (params.action === "update" && !terminationRequested) await collectUpdateFailureTriage();
    releaseManagedUpdateLease();
    cleanupSensitiveFiles();
    stopTriageScope();
    wakeTermination = undefined;
    if (terminationRequested) finalExitCode = 143;
    appendLog("managed update helper completed code=" + (finalExitCode || 0));
    if (params.operatorRestartWarning) fs.writeSync(1, ${JSON.stringify(wn)});
    if (foregroundClosed && parentIdentityCurrent())
      fs.writeSync(1, "foreground-settled:" + (foregroundRespawn ? "respawn" : "stopped") + "\n");
    process.stdin.destroy();
    process.exitCode = finalExitCode;
  }
})().catch((err) => {
  appendLog("handoff setup failed: " + formatErrorMessage(err, { includeCode: true }) + "\n" + (err && err.stack ? err.stack : String(err)));
  cleanupSensitiveFiles();
  stopTriageScope();
  process.stdin.destroy();
  process.exitCode = terminationRequested ? 143 : 1;
});
`}));export{parkForegroundUpdateHandoff as a,assertManagedServiceUpdateHandoffRoot as c,Tn as d,buildManagedServiceHandoffUnavailableMessage as f,isCurrentForegroundUpdateHandoffProcess as i,kn as l,Xt as m,cancelManagedServiceUpdateHandoff as n,startManagedServiceUpdateHandoff as o,formatManagedServiceUpdateCommand as p,Nn as r,transferManagedServiceUpdateHandoff as s,assertForegroundUpdateOrigin as t,admitSystemdUpdate as u};