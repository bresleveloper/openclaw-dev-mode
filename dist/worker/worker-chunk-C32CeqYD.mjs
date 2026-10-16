import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{r as t,t as n}from"./worker-chunk-BzE0FhlZ.mjs";import{a as r,n as i,t as a}from"./worker-chunk-BznV15BX.mjs";import{r as o,t as s}from"./worker-chunk-Plg2Ords.mjs";import{_ as c,c as l}from"./worker-chunk-B1aBsI2P.mjs";import{A as u,h as d,o as f}from"./worker-chunk-2YU_cJ4H.mjs";import{n as p,t as m}from"./worker-chunk-DG8Xglej.mjs";import{a as h,o as ee}from"./worker-chunk-DvoldfJr.mjs";import{n as g,o as te,r as _,s as v}from"./worker-chunk-Ci6f1nVt.mjs";import{l as ne,r as y}from"./worker-chunk-RPQH-49S.mjs";import{n as b,r as x}from"./worker-chunk-jjE1O2Np.mjs";import{o as re,t as S}from"./worker-chunk-Bg-ZeVgV.mjs";import{d as C,t as ie}from"./worker-chunk-Cg0HCAEF.mjs";import{n as ae,t as w}from"./worker-chunk-Bm4E9FUt.mjs";import{n as T,t as E}from"./worker-chunk-BoHLqv45.mjs";import{i as oe,n as se,o as D,r as ce,t as le}from"./worker-chunk-Ct37njaD.mjs";import{a as ue,i as de,n as fe,o as O}from"./worker-chunk-BN92WEPJ.mjs";import{i as k,r as A}from"./worker-chunk-CW2HCj2j.mjs";import{i as pe,r as j}from"./worker-chunk-DOiZYC2y.mjs";import{n as M,t as N}from"./worker-chunk-DPQOA3pj.mjs";import{d as P,l as F,t as me}from"./worker-chunk-DIq_-BoX.mjs";import{i as I,s as L}from"./worker-chunk-JyEFwEby.mjs";import{a as R,t as he}from"./worker-chunk-CvdUGtK6.mjs";import{a as z,i as ge,r as _e}from"./worker-chunk-CpQQpBc3.mjs";import{n as B,t as ve}from"./worker-chunk-BDONxkll.mjs";import{l as ye,t as be}from"./worker-chunk-CFFlkKMi.mjs";import{n as xe,r as Se}from"./worker-chunk-D1OZWrqw.mjs";import{l as Ce,r as we}from"./worker-chunk-E1G-WRA4.mjs";import{a as Te,s as Ee}from"./worker-chunk-kSbTsRHi.mjs";import{a as De,i as Oe}from"./worker-chunk-B64nkfas.mjs";import{f as ke,n as Ae,s as je}from"./worker-chunk-Bpt14scM.mjs";import{i as Me,l as Ne,n as Pe,o as Fe}from"./worker-chunk-XZA7NZYF.mjs";import{o as Ie,u as Le}from"./worker-chunk-CwUX7vs0.mjs";import{f as Re,p as ze}from"./worker-chunk-YkgAe8Sb.mjs";import{_ as Be,c as Ve,h as He}from"./worker-chunk-N5uOc1ZV.mjs";import{a as Ue,n as V}from"./worker-chunk-B6ycSIUH.mjs";import{n as We,t as Ge}from"./worker-chunk-Dyi6CPTX.mjs";import{c as Ke,n as qe}from"./worker-chunk-z7e4CGTv.mjs";import{n as Je,t as H}from"./worker-chunk-Bx8-_66A.mjs";import{r as Ye,t as Xe}from"./worker-chunk-DW4U6_NZ.mjs";import{i as U,n as Ze,r as Qe,t as W}from"./worker-chunk-YJSoMOrN.mjs";import{n as $e,t as et}from"./worker-chunk-CcJCn3V5.mjs";import{createRequire as G}from"node:module";import K from"node:fs";import tt from"node:os";import q from"node:path";import{randomUUID as J}from"node:crypto";import Y from"node:fs/promises";import{spawn as nt}from"node:child_process";import{once as rt}from"node:events";function resolveUpdateCliArgv(e){return resolveManagedServiceCliArgv(e,[`update`,`--yes`,`--json`,...e.reapplyLocalOverrides?[`--reapply-local-overrides`]:[],...e.acceptCapabilities?[`--accept-capabilities`]:[],...e.admission?[`--admission`,e.admission]:[],...e.channel?[`--channel`,e.channel]:[],...e.tag?[`--tag`,e.tag]:[],...typeof e.timeoutMs==`number`&&Number.isFinite(e.timeoutMs)?[`--timeout`,String(Math.max(1,Math.ceil(e.timeoutMs/1e3)))]:[]])}function resolveManagedServiceCliArgv(e,t){let n=e.execPath?.trim(),r=e.argv1?.trim();return n&&r?[n,...i(n),r,...t]:n&&!/^(?:node|bun)(?:\.exe)?$/iu.test(q.basename(n))?[n,...t]:[`openclaw`,...t]}function formatManagedServiceUpdateCommand(e,t=process.env){return m(resolveUpdateCliArgv(e??{}).toSpliced(3,1).join(` `),t)}function buildManagedServiceHandoffUnavailableMessage(e){return[`OpenClaw updates cannot safely run inside the live gateway process without a managed-service handoff.`,`Stop the foreground Gateway, run \`${e}\` from a shell, then launch the Gateway again. For a managed deployment, use its host's stop, update, and restart workflow.`].join(`
`)}var it=e((()=>{p(),a()}));function createHandoffLineReader(e){let t=``;return n=>{t=`${t}${n.toString()}`.slice(-1024);let r;for(;(r=t.indexOf(`
`))>=0;){let n=t.slice(0,r+1);if(t=t.slice(r+1),e(n)===!1)return}}}function unrefHandoffPipe(e){`unref`in e&&typeof e.unref==`function`&&e.unref()}function waitForHandoffResponse(e,t,n){return new Promise((r,i)=>{let a=e.stdout,o=n===`closed`?`close`:`exit`,s=!1,cancelTimeout=()=>{},finish=t=>{s||(s=!0,cancelTimeout(),e.removeListener(`error`,finish),e.removeListener(o,onExit),a.removeListener(`data`,c),a.removeListener(`error`,onOutputError),e.stdin.removeListener(`error`,finish).removeListener(`close`,onInputClose),t instanceof Error?(n||a.destroy(),i(t)):r(t))},onExit=(e,t)=>{finish(/* @__PURE__ */ Error(`managed update handoff exited before ${n?`responding`:`signaling readiness`} (code=${e??`null`}, signal=${t??`null`})`))},onOutputError=t=>{!n&&e.pid&&E(e),finish(t)},onInputClose=()=>{n!==`closed`&&finish(/* @__PURE__ */ Error(`managed update handoff control input closed`))},c=createHandoffLineReader(e=>{if(e!==`before-park
`&&e!==`park-admitted
`)return finish(e.slice(0,-1)),!1});n!==`closed`&&(cancelTimeout=pe(Date.now()+t,()=>{onOutputError(/* @__PURE__ */ Error(`managed update handoff did not ${n?`respond`:`signal readiness`} within ${t/1e3} seconds`))})),!s&&(e.once(`error`,finish).once(o,onExit),a.once(`error`,onOutputError).on(`data`,c),e.stdin.once(`error`,finish).once(`close`,onInputClose),n&&e.stdin.write(`${n}\n`,e=>{e&&finish(e)}))})}var X,at,ot,st,ct,lt=e((()=>{T(),j(),X=String.raw`
const gateFs = process.getBuiltinModule("fs");
const gate = Buffer.alloc(2);
try {
  if (gateFs.readSync(4, gate) !== 2 || gate.toString() !== "go")
    throw new Error("Managed handoff admission was refused");
} finally { gateFs.closeSync(4); }
`,at=String.raw`
${X}
const { spawn } = require("node:child_process");
const argv = JSON.parse(process.argv[1]);
if (process.platform !== "win32" && typeof process.execve === "function")
  process.execve(argv[0], argv, process.env);
const child = spawn(argv[0], argv.slice(1), { env: process.env, stdio: "inherit" });
child.once("error", () => { process.exitCode = 1; });
child.once("exit", (code, signal) => {
  process.exitCode = typeof code === "number" ? code : signal ? 1 : 0;
});
`,ot=String.raw`
async function runOwnedUpdateCommand(phase, commandArgv, timeoutMs, cwd = params.cwd, env = process.env) {
  const updaterChunks = [];
  let updaterBytes = 0;
  let outputOverflow = false;
  let outputFd;
  let timeout;
  let continuation;
  let stagedContinuation;
  let continuationCancelled = false;
  let triageAdmitted = false;
  let leaseWatch;
  let admissionDeadline;
  let activation;
  let activationAcknowledged = false;
  let outputPrefix = Buffer.alloc(0);
  let controlPending = phase === "update" && !restorationArmed;
  try {
    outputFd = fs.openSync(params.logPath, "a", 0o600);
    const retainedIpc = Array.isArray(params.nodeExecArgv);
    const child = spawn(
      retainedIpc ? commandArgv[0] : process.execPath,
      retainedIpc
        ? [
            ...params.nodeExecArgv,
            "--import",
            ${JSON.stringify(`data:text/javascript,${encodeURIComponent(X)}`)},
            ...commandArgv.slice(1),
          ]
        : ["-e", ${JSON.stringify(at)}, JSON.stringify(commandArgv)],
      {
        cwd,
        env:
          params.action === "triage"
            ? { ...env, NODE_DISABLE_COMPILE_CACHE: "1" }
            : phase === "update" ? { ...env, OPENCLAW_UPDATE_RUN_HANDOFF: "1" } : env,
        detached: true,
        stdio: ["pipe", "pipe", outputFd, "ipc", "pipe"],
      },
    );
    const rejectActivation = (error) => {
      if (!activationAcknowledged) activationRejected = error?.code === "owner_required" ? "owner_required" : "managed-service-handoff-helper-failed";
      appendLog("managed update activation failed: " + String(error));
      child.stdin.end("cancelled\n");
      if (child.exitCode === null && child.signalCode === null) killOwnedCommand(child);
    };
    child.stdout.on("data", (chunk) => {
      if (controlPending) {
        outputPrefix = Buffer.concat([outputPrefix, chunk]);
        const marker = Buffer.from("park\n");
        if (outputPrefix.length < marker.length && marker.subarray(0, outputPrefix.length).equals(outputPrefix)) return;
        controlPending = false;
        if (outputPrefix.subarray(0, marker.length).equals(marker)) {
          chunk = outputPrefix.subarray(marker.length);
          activation = (async () => {
            try {
              await activateTransferredGateway();
            } finally {
              // Join a dispatched stop even when parent-exit verification failed.
              await pendingServiceStop;
            }
            await assertUpdateRequester();
            if (!ownsManagedUpdateLease()) throw new Error("managed update activation ownership lost");
            activationAcknowledged = true;
            child.stdin.end("parked\n");
          })().catch(rejectActivation);
        } else {
          chunk = outputPrefix;
        }
        outputPrefix = Buffer.alloc(0);
      }
      try { fs.writeSync(outputFd, chunk); } catch {}
      updaterBytes += chunk.length;
      if (updaterBytes > 4 * 1024 * 1024) {
        outputOverflow = true;
        updaterChunks.length = 0;
      } else updaterChunks.push(chunk);
    });
    let childError;
    const exited = new Promise((resolve) => {
      child.once("error", (error) => { childError = error; });
      child.once("close", (code, signal) => resolve({ code, signal, error: childError }));
    });
    // Descendants can retain stdio and IPC after their executor exits.
    child.once("exit", (code, signal) => {
      if (params.action === "triage") {
        appendLog("automatic triage executor exited code=" + code + " signal=" + signal + "; retiring native scope");
        stopTriageScope();
      }
    });
    child.stdin.on("error", () => {});
    const gate = child.stdio[4];
    gate.on("error", () => {});
    let runnerIdentity = managedUpdateLease?.payload;
    activeCommand = child;
    try {
      // Errors before the gate still own this runner and its pipe/IPC handles.
      await new Promise((resolve, reject) => child.once("spawn", resolve).once("error", reject));
      if (!bindManagedUpdateLeaseToProcess(child.pid, undefined, undefined, child.spawnargs)) {
        throw new Error("managed update runner lease binding failed");
      }
      runnerIdentity = managedUpdateLease.payload;
      assertTriageRequester();
      if (phase === "update") await assertUpdateRequester();
      child.once("disconnect", () => {
        if (params.action === "triage" && !triageClosing) {
          const completion = managedUpdateLease && leaseStore.readGeneration(managedUpdateLease);
          if (completion?.action.phase !== "closed") {
            appendLog("automatic triage executor disconnected without cleanup; retiring native scope");
            stopTriageScope();
          }
        }
        if (stagedContinuation) {
          appendLog("automatic triage skipped: updater disconnected before committing its request");
          stagedContinuation = undefined;
        }
      });
      child.on("message", async (message) => {
        try {
          if (phase === "update" && message?.version === 2 &&
            message.type === "triage-request-cancel" && Object.keys(message).length === 2 &&
            !continuation) {
            stagedContinuation = undefined;
            continuationCancelled = true;
            appendLog("automatic triage request cancelled before handoff");
            return;
          }
          if (
            !message ||
            message.version !== 2 ||
            !hasManagedUpdateLease() ||
            managedUpdateLease.payload !== runnerIdentity ||
            child.exitCode !== null ||
            child.signalCode !== null
          ) {
            throw new Error("managed handoff child lost its current claim");
          }
          if (phase === "update" && params.foregroundOrigin &&
            ["foreground-inspect", "foreground-park"].includes(message.type) &&
            typeof message.requestId === "string" && message.requestId.length <= 64 &&
            Object.keys(message).length === 3) {
            try {
              if (message.type === "foreground-park") {
                foregroundParkFlight ??= parkForegroundGateway();
                activation = foregroundParkFlight.catch(() => {});
                await foregroundParkFlight;
              } else if (!foregroundParked) await assertForegroundOrigin();
              assertGatewayParkOwner();
              if (!hasManagedUpdateLease() || managedUpdateLease.payload !== runnerIdentity ||
                !child.connected || child.exitCode !== null || child.signalCode !== null)
                throw new Error("foreground updater lost its current claim");
              child.send({ type: message.type, version: 2, requestId: message.requestId, ok: true }, () => {});
            } catch (error) {
              if (child.connected) child.send({ type: message.type, version: 2, requestId: message.requestId, ok: false }, () => {});
              if (message.type === "foreground-park") rejectActivation(error);
            }
            return;
          }
          const triageCommandIndex = Array.isArray(message.commandArgv) &&
            message.commandArgv[1] === "--no-install" ? 3 : 2;
          if (
            params.action === "triage" &&
            message.type === "triage-ready" &&
            !triageAdmitted &&
            Object.keys(message).length === 2
          ) {
            // Claim the one admission before awaiting native inspection; duplicate
            // messages cannot both pass the same current runner lease.
            triageAdmitted = true;
            const scope = await inspectTriageScope();
            if (
              !hasManagedUpdateLease() ||
              managedUpdateLease.payload !== runnerIdentity ||
              !procCgroupMembershipMatches(
                fs.readFileSync("/proc/" + child.pid + "/cgroup", "utf8"),
                scope.ControlGroup,
              )
            ) {
              throw new Error("automatic triage executor lost its native placement");
            }
            if (!child.connected || child.exitCode !== null || child.signalCode !== null) throw new Error("automatic triage child disconnected");
            assertTriageRequester();
            const admitted = leaseStore.activate(managedUpdateLease);
            if (!admitted) throw new Error("automatic triage activation lost its claim");
            managedUpdateLease = admitted;
            runnerIdentity = admitted.payload;
            clearTimeout(admissionDeadline);
            child.send(
              {
                type: "triage",
                version: 2,
                failure: params.failure,
                installRoot: params.updateLeaseKey,
                owner: managedUpdateLease.owner,
                requester: params.requester,
              },
              () => {},
            );
          } else if (
            phase === "update" &&
            message.type === "triage-request" &&
            !stagedContinuation && !continuation && !continuationCancelled &&
            Object.keys(message).length === 4 &&
            Array.isArray(message.commandArgv) &&
            (message.commandArgv.length === triageCommandIndex + 1 ||
              (message.commandArgv.length === triageCommandIndex + 3 &&
                message.commandArgv[triageCommandIndex + 1] === "--update-result")) &&
            message.commandArgv.every((arg) => typeof arg === "string" && arg.length < 4096) &&
            message.commandArgv[triageCommandIndex] === "triage" &&
            validTriageFailure(message.failure) &&
            message.failure.kind === "update" &&
            params.serviceRecovery?.kind === "systemd" &&
            Buffer.byteLength(JSON.stringify(message)) <= 16384
          ) {
            stagedContinuation = message;
            child.send({ type: "triage-queued", version: 2 }, () => {});
          } else if (phase === "update" && message.type === "triage-commit" &&
            Object.keys(message).length === 2 && stagedContinuation &&
            !continuation && !continuationCancelled) {
            // The same live updater transfers its request only after the queue ACK.
            // Never infer this decision from its exit code or disconnected IPC.
            continuation = stagedContinuation;
            stagedContinuation = undefined;
            // The updater stays alive until it receives this accepted transfer.
            child.send({ type: "triage-committed", version: 2 }, () => {});
          } else throw new Error("invalid or repeated managed handoff continuation");
        } catch (error) {
          if (!continuation) {
            stagedContinuation = undefined;
            continuationCancelled = true;
          }
          appendLog("automatic triage admission failed: " + String(error));
          if (params.action === "triage") stopTriageScope();
          else if (child.connected) child.send({ type: "triage-refused", version: 2 }, () => {});
        }
      });
      if (params.action === "triage") {
        admissionDeadline = setTimeout(() => {
          appendLog("The installed update did not start diagnostics. Run openclaw triage manually.");
          stopTriageScope();
        }, 30000);
        leaseWatch = setInterval(() => {
          try {
            assertTriageRequester();
            if (!hasManagedUpdateLease()) throw new Error("lease lost or replaced");
          } catch (error) {
            clearInterval(leaseWatch);
            appendLog("automatic triage cancelled: " + String(error));
            stopTriageScope();
          }
        }, 250);
      }
      // Sending the gate can start mutation even if its write callback fails.
      // From here, only the updater can authorize recovery of this installation.
      if (phase === "update") updaterStarted = true;
      if (timeoutMs !== undefined) {
        timeout = setTimeout(() => {
          appendLog("verified recovery command exceeded its update timeout");
          killOwnedCommand(child);
        }, timeoutMs);
      }
      await new Promise((resolve, reject) => {
        gate.once("error", reject);
        gate.once("close", () => reject(new Error("managed update runner admission closed")));
        child.once("exit", () =>
          reject(new Error("managed update runner exited before its gate")),
        );
        gate.end("go", (error) => (error ? reject(error) : resolve()));
      });
      if (!controlPending) child.stdin.end();
    } catch (error) {
      // A rejected spawn has no signalable process, but still needs its close join.
      if (child.pid) killOwnedCommand(child);
      await exited;
      try {
        if (runnerIdentity) bindManagedUpdateLeaseToProcess(process.pid, runnerIdentity);
      } catch (rebindError) {
        appendLog("managed update runner cleanup could not rebind helper: " + String(rebindError));
      }
      throw error;
    }
    appendLog("managed update " + phase + " command pid=" + (child.pid || "unknown"));
    const exit = await exited;
    await activation;
    clearInterval(leaseWatch);
    clearTimeout(admissionDeadline);
    if (params.action !== "triage" && !bindManagedUpdateLeaseToProcess(process.pid, runnerIdentity)) {
      throw new Error("managed update command lease binding was lost");
    }
    if (exit.error) throw exit.error;
    appendLog(
      "managed update " + phase + " command exited code=" +
        (exit && exit.code !== null && exit.code !== undefined ? exit.code : "null") +
        " signal=" +
        (exit && exit.signal ? exit.signal : "null"),
    );
    if (params.action === "triage" && !triageAdmitted) {
      appendLog(
        "The installed update does not support automatic diagnostics. Run openclaw triage manually.",
      );
      process.exitCode = 1;
    }
    return { ...exit, continuation, updaterOutput: Buffer.concat(updaterChunks).toString(), outputOverflow };
  } finally {
    activeCommand = undefined;
    clearTimeout(timeout);
    clearInterval(leaseWatch);
    clearTimeout(admissionDeadline);
    if (outputFd !== undefined) {
      try {
        fs.closeSync(outputFd);
      } catch {
        // Ignore close failures.
      }
    }
  }
}
`,st=`before-park
`,ct=`park-admitted
`})),ut,dt=e((()=>{ut=String.raw`
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

function procCgroupMembershipMatches(cgroupFile, controlGroup) {
  if (!controlGroup) return false;
  // v1/hybrid membership can span controllers. Only the systemd hierarchy
  // or the unified v2 hierarchy proves placement, with an exact scope path.
  return cgroupFile.split("\n").some((line) => {
    const systemd = /^[1-9][0-9]*:name=systemd:(.*)$/.exec(line);
    return line === "0::" + controlGroup || systemd?.[1] === controlGroup;
  });
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
`.trim()}));async function assertManagedHandoffServiceRuntime(e,n){if(!e)return;let r;try{r=e===`launchd`?await(await import(`./worker-chunk-_bcDHt3M.mjs`)).readLaunchAgentProgramArguments(n,{requireEffective:!0}):e===`systemd`?await(await import(`./worker-chunk-BAoInI3w.mjs`)).readSystemdServiceExecStart(n,{requireEffective:!0}):await(await import(`./worker-chunk-Czi3YpUd.mjs`)).readScheduledTaskCommand(n,{requireEffective:!0})}catch(e){console.warn(`[update] Could not inspect the managed service: ${String(e)}`),r=null}let i=r?.programArguments??[],a=i[0],o=i.indexOf(`gateway`),s=i[o-1];if(!a||!t(a)||o<2||!s||!q.isAbsolute(s)||!/\.(?:[cm]?js|ts)$/iu.test(s))throw new V(`managed-service-handoff-failed`,`The Gateway's saved Node executable ${JSON.stringify(process.execPath)} is unavailable. Automatic runtime replacement requires a directly launched Node service; wrapper recovery requires its installation owner to repair the wrapper's runtime first. ${Z}`);let c=v(a,{env:n,useCache:!1});if(c&&(await je(c,n)).status!==`supported`)throw new ManagedHandoffServiceRuntimeUnavailableError(c);return c}async function resolveManagedHandoffNodeExecutable(e,t){if(_(process.execPath,{env:e}))return process.execPath;let n=await assertManagedHandoffServiceRuntime(t,e);if(n)return n;let r=await ke({env:e});if(r?.status===`supported`&&r.path)return r.path;for(let t of(e.PATH??``).split(q.delimiter).filter(q.isAbsolute)){let n=te(`node`,t,e,{useCache:!1});if(n&&(await je(n,e)).status===`supported`)return n}throw new ManagedHandoffNodeUnavailableError}function prepareManagedHandoffCliRuntime(e,t,n){let r=e[0]===n||/^(?:node|bun)(?:\.exe)?$/iu.test(q.basename(e[0]??``)),a=r?[e[0],...e.slice(1+i(e[0]).length)]:e,o=r?et({argv:a,env:t,execArgv:[],execPath:e[0]}):null,s=r?o?.argv.slice(0,o.argv.length-a.length+1)??[]:void 0;return o&&(e[0]=o.command),{nodeExecArgv:s,readyEnv:o?.env??t}}var Z,ManagedHandoffNodeUnavailableError,ManagedHandoffServiceRuntimeUnavailableError,ft=e((()=>{Ue(),n(),Ae(),$e(),g(),a(),Z="Inspect the service with `openclaw gateway status --deep` and refresh its definition under the installation owner (for a standard OpenClaw-managed service: `openclaw gateway install --force`). Then retry the update. The serving Gateway has not been stopped.",ManagedHandoffNodeUnavailableError=class extends V{constructor(){super(`managed-service-handoff-failed`,`The Gateway's Node executable ${JSON.stringify(process.execPath)} was removed and no compatible replacement was found. Install a supported Node. ${Z}`),this.name=`ManagedHandoffNodeUnavailableError`}},ManagedHandoffServiceRuntimeUnavailableError=class extends V{constructor(e){super(`managed-service-handoff-failed`,`The Gateway's service executable ${JSON.stringify(e)} is unavailable. ${Z}`),this.name=`ManagedHandoffServiceRuntimeUnavailableError`}}})),pt,mt=e((()=>{pt=String.raw`
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
`})),Q,ht,gt=e((()=>{Q=`managed-handoff-runtime.mjs`,ht={currentModuleUrl:import.meta.url,sourceWorkerName:`update-managed-service-handoff-sealed`,distWorkerPath:Q}}));function loadedNativeFile(e,t){let n=Object.values(e.cache).filter(e=>e?.loaded&&e.filename.endsWith(`.node`)&&e.exports===t.default);if(n.length!==1)throw Error(`Managed handoff could not identify the loaded FreeBSD native runtime`);return K.realpathSync(n[0].filename)}function stageFreeBsdManagedHandoffNativeRuntime(e){if(process.platform!==`freebsd`)return[];if(process.arch!==`x64`&&process.arch!==`arm64`)throw Error(`Managed handoff requires a supported FreeBSD native architecture`);if(process.resourcesPath!==void 0)throw Error(`Managed handoff cannot use an external FreeBSD native resource path`);let t=G(import.meta.url),n=K.realpathSync(t.resolve(`koffi/indirect`)),r=q.dirname(n),i=G(n),a=i(n),o=JSON.parse(K.readFileSync(q.join(r,`package.json`),`utf8`));if(o.name!==`koffi`||typeof o.version!=`string`||!o.version||a.version!==o.version)throw Error(`Managed handoff FreeBSD native runtime version does not match its package`);let s=loadedNativeFile(i,a),c=`freebsd_${process.arch}`,l=q.join(`build`,`koffi`,c,`koffi.node`);if(s!==q.join(r,l)){let e=q.dirname(K.realpathSync(i.resolve(`@koromix/koffi-freebsd-${process.arch}`)));if(s!==q.join(e,c,`koffi.node`))throw Error(`Managed handoff FreeBSD native runtime has an unexpected package path`)}let u=[...[`package.json`,`indirect.cjs`,`src/koffi/indirect.cjs`,`LICENSE.txt`].map(e=>({source:q.join(r,e),relative:e})),{source:s,relative:l}],d=q.resolve(e,`runtime`,`node_modules`,`koffi`),f=u.map(({source:e,relative:t})=>{if(!K.lstatSync(e).isFile())throw Error(`Managed handoff FreeBSD native runtime requires regular package files`);let n=q.join(d,t);return K.mkdirSync(q.dirname(n),{recursive:!0,mode:448}),K.writeFileSync(n,K.readFileSync(e),{mode:384,flag:`wx`}),n}),p=q.join(d,`indirect.cjs`),m=G(p),h=m(p);if(h.version!==o.version||loadedNativeFile(m,h)!==K.realpathSync(q.join(d,l)))throw Error(`Managed handoff did not load its private FreeBSD native runtime`);return f}var _t=e((()=>{}));function stageManagedHandoffRuntime(e){let t=r(ht);if(!t.pathname.endsWith(`.mjs`))throw Error(`Managed handoff requires its sealed runtime; use the repository test runner or the dist-backed pnpm openclaw CLI.`);let n=q.join(e,`runtime`,Q);return K.mkdirSync(q.dirname(n),{recursive:!0,mode:448}),K.writeFileSync(n,K.readFileSync(t),{mode:384,flag:`wx`}),[n,...stageFreeBsdManagedHandoffNativeRuntime(e)]}var vt=e((()=>{a(),_t(),gt()}));function resolveManagedHandoffCommandEnv(e,t,n){let r={...e,...ge(z(e)),[Pe]:t,OPENCLAW_UPDATE_RUN_HANDOFF:`1`,...n?{[Me]:n}:{}};for(let e of he)yt.has(e)||delete r[e];return Ke({processEnv:r,invocationCwd:process.cwd()})}async function admitSystemdUpdate(e,t=process.env,n){let r=n===void 0?await Te(t):n;if(r?.kind!==`system`&&r?.kind!==`dueling`)return;let i=r.system.unitName,a=`sudo systemctl restart ${M(i)}`,o=B(e);try{await Y.access(o,Y.constants.W_OK|Y.constants.X_OK)}catch(e){let{uid:n}=await Y.stat(o),r=H([process.execPath,q.join(o,`openclaw.mjs`),`update`,`--yes`,`--no-restart`],z(t),{env:t});throw new V(`managed-service-handoff-failed`,`System-scope Gateway package update cannot write its install root ${o}. Install as its owning account: sudo -u ${M(`#${n}`)} -- ${r}. Then run: ${a}`,{cause:e})}return`System-scope Gateway service ${i} requires an operator restart. Package updates do not stop or restart this service. After the update, run: ${a}`}function observeManagedServiceUpdateHandoffClose(e,t){let n=!1,r=createHandoffLineReader(e=>{e===`system-update-settled
`&&(n=!0)});return t.stdout.on(`data`,r),new Promise(i=>{t.once(`close`,()=>{t.stdout.off(`data`,r),e.settled=n&&t.exitCode!==null&&t.signalCode===null,i()})})}function resolveGatewayServiceRecovery(e,t){if(e===`systemd`)return{kind:`systemd`,unit:`${ye(t)}.service`};if(e===`launchd`){let e=Se(t);return{kind:`launchd`,uid:typeof process.getuid==`function`?process.getuid():501,label:e,plistPath:Ce(t)}}if(e===`schtasks`)return{kind:`schtasks`,taskName:t.OPENCLAW_WINDOWS_TASK_NAME?.trim()||c(t.OPENCLAW_PROFILE)}}var yt,bt,xt=e((()=>{Je(),N(),Ue(),qe(),l(),xe(),we(),Ee(),be(),_e(),R(),Fe(),ve(),lt(),yt=/* @__PURE__ */ new Set([`OPENCLAW_LAUNCHD_LABEL`,`OPENCLAW_SYSTEMD_UNIT`,`OPENCLAW_WINDOWS_TASK_NAME`]),bt=`system-update-settled
`}));async function spawnManagedServiceUpdateHandoff(e,t,n){let r=e.parentPid??process.pid,a=e.env??process.env;if(e.foregroundOrigin){if(e.action||e.foregroundOrigin.pid!==r||r!==process.pid||e.meta.completionOwner!==`gateway-restart`)throw Error(`Foreground update requires the current Gateway's completion owner`);await assertForegroundUpdateOrigin(e.foregroundOrigin,!1,a)}let o=e.execPath??await resolveManagedHandoffNodeExecutable(a,e.supervisor),s=i(o),c=n.leaseDatabaseIdentity?.databasePath??ce(),l=n.leaseDatabaseIdentity??ue(c)(!0,()=>de(c));n.leaseDatabaseIdentity=l;let u=le({databasePath:l.databasePath,existingIdentity:l,serviceManagerEnv:ae(a),onProcessIdentityWarning:(t,n)=>{if(console.warn(`[update] ${n}`),e.runId)try{Le(e.runId,{step:`warning:process-start-identity:${t}`,status:`completed`,detail:n,endedAtMs:Date.now()},{env:a})}catch{}}});n.leaseStore=u;let d=u.processIdentity(r).startIdentity,f=await Y.mkdtemp(q.join(tt.tmpdir(),oe)),p=q.join(f,`handoff.cjs`),m=q.join(f,`handoff.json`),h=q.join(f,`sentinel-meta.json`),g=q.join(f,`update-failure.json`),_=z(a),v=q.join(_.stateDir,`logs`,`support`,`openclaw-update-failure-${J()}.json`),y=q.join(f,`handoff.log`),b={acceptCapabilities:e.acceptCapabilities,admission:e.admission,reapplyLocalOverrides:e.reapplyLocalOverrides,timeoutMs:e.timeoutMs,channel:e.channel,tag:e.tag},x={execPath:o,argv1:e.argv1??process.argv[1]},S=e.action?[e.action.nodeRunner,...i(e.action.nodeRunner),e.action.entrypoint,`triage`]:resolveUpdateCliArgv({...b,...x});n.operatorRestartWarning&&S.push(`--no-restart`);let C=e.action?`openclaw triage (automatic)`:formatManagedServiceUpdateCommand(b,e.env)+(n.operatorRestartWarning?` --no-restart`:``),w={version:1,meta:{...e.meta,...e.runId?{runId:e.runId}:{},root:t,triageContextPath:v,...e.foregroundOrigin?{foregroundOrigin:e.foregroundOrigin}:{}}},T=o,se=[...s,p,m],D,O;if(!e.foregroundOrigin&&e.supervisor===`systemd`&&!n.operatorRestartWarning){let t=te(`systemd-run`,[a.PATH??``,`/usr/bin`,`/bin`].join(q.delimiter),a);if(!t)throw Error(`systemd-run is required to launch a transient user scope`);O=t;let n=e.handoffId.trim().replace(/[^A-Za-z0-9_.:@-]+/gu,`-`).replace(/^-+|-+$/gu,``).slice(0,80)||`${process.pid}-${Date.now()}`;D=`openclaw-${e.action?`triage`:`update`}-${n}.scope`,se.unshift(`--user`,`--scope`,`--collect`,`--unit=${D}`,...e.action?[`--property=PartOf=${ye(a)}.service`]:[],T),T=t}let k=ne(a),A=n.parentExitTimeoutMs,{nodeExecArgv:pe,readyEnv:j}=prepareManagedHandoffCliRuntime(S,resolveManagedHandoffCommandEnv(a,h,w.meta.runId),o),M=e.devTarget?Xe(j,e.devTarget):j,N={operatorRestartWarning:n.operatorRestartWarning,runId:w.meta.runId,beforePark:!!e.beforePark,requester:De(e.requester),serviceManagerEnv:ae(a),nodeExecArgv:pe,runtimeArgs:s,action:e.action?.kind??`update`,failure:e.action?.failure,scopeUnit:D,systemdRun:O,parentPid:r,parentStartIdentity:d,parentExitTimeoutMs:A,restartDelayMs:Math.max(0,Math.min(6e4,e.restartDelayMs??0)),parentExitDeadlineAt:Date.now()+A,cwd:f,invocationCwd:e.invocationCwd,commandArgv:S,recoveryCommandArgv:resolveManagedServiceCliArgv(x,[`gateway`,`restart`,`--preserve-definition`,`--json`]),recoveryTimeoutMs:n.recoveryTimeoutMs,triageCommandArgv:resolveManagedServiceCliArgv(x,[`triage`,`--json`,`--non-interactive`]),triageContextPath:v,triageInputPath:g,triageContextCommand:H([`openclaw`,`triage`,`--update-result`,v],_,{env:a}),triageRecoveryCommand:H([`openclaw`,`triage`],_,{env:a}),triageHint:`Update triage runs after service recovery; see the managed update helper log for the outcome and the installation-specific openclaw triage command.`,commandLabel:C,handoffId:e.handoffId,nonFailureSkippedReasons:Object.keys(ie),logPath:y,metaPath:h,stateDatabasePath:k,nodeSqliteLocation:re(k),updateLeaseDatabasePath:l.databasePath,updateLeaseDatabaseIdentity:l,updateLeaseKey:t,updateLeaseOwner:e.handoffId,sensitivePaths:[p,m,h,g],foregroundOrigin:e.foregroundOrigin,serviceRecovery:e.foregroundOrigin||n.operatorRestartWarning?void 0:resolveGatewayServiceRecovery(e.supervisor,a),recovery:await(await ze(t)?We(t,n.recoveryTimeoutMs):Be(t)),recoveryModulePath:q.join(t,`dist`,`cli`,`daemon-cli.js`)},F,I,onExit=()=>{n.exited=!0,n.releaseRequesterObserver?.()};try{if(N.sensitivePaths.push(...stageManagedHandoffRuntime(f)),await Y.writeFile(p,`${wt}\n`,{mode:448}),await Y.writeFile(m,`${JSON.stringify(N,null,2)}\n`,{mode:384}),await Y.writeFile(h,`${JSON.stringify(w,null,2)}\n`,{mode:384}),fe(l),n.requesterAuthority?.assertCurrent(),n.requesterAuthority?.signal?.throwIfAborted(),e.foregroundOrigin&&P())throw new me;F=nt(T,se,{cwd:f,env:M,detached:!0,stdio:[`pipe`,`pipe`,`ignore`]}),n.launcher=F,n.closed=observeManagedServiceUpdateHandoffClose(n,F),F.stdin.on(`error`,()=>F.stdin.destroy()).once(`close`,()=>F.stdin.destroy()),F.pid||await rt(F,`spawn`);try{n.launcherStartIdentity=F.pid?u.processIdentity(F.pid,F.spawnargs).startIdentity:null}catch(e){throw E(F),e}if(n.launcherStartIdentity==null)throw E(F),Error(`managed update handoff process start identity is unavailable`);if(F.once(`exit`,onExit),I=await waitForHandoffResponse(F,n.recoveryTimeoutMs),`${I}\n`!==$&&!I.startsWith(Ct))throw Error(`managed update handoff returned an invalid readiness response`);if(`${I}\n`===$){let r=U(t);if(r?.owner!==e.handoffId||r.executor.pid!==r.helper.pid||r.executor.startIdentity!==r.helper.startIdentity||r.action.kind!==(e.action?.kind??`update`)||r.action.kind===`triage`&&(r.action.lifetime.kind!==`native`||r.action.lifetime.placement.kind!==`attached`||r.action.phase!==`reserved`)||!ee(r.executor.pid)||!u.isProcessIdentityCurrent(r.executor,r.executor.pid===F.pid&&F.exitCode===null&&F.signalCode===null))throw E(F),Error(`managed update handoff helper lease identity is unavailable`);n.helper=r}}catch(e){throw F?.removeListener(`exit`,onExit),F?.stdin.destroy(),F?.stdout.destroy(),await Y.rm(f,{recursive:!0,force:!0}).catch(()=>{}),e}if(e.beforePark){let r=!1,i=e.requester?.authorizationSource?.startsWith(`profile:`)===!0,a={kind:`managed-update-handoff`,installRoot:t,handoffId:n.handoffId},isCurrentOwner=()=>{try{return currentManagedServiceUpdateHandoff(a)===n&&n.transferred&&!n.exited}catch{return!1}},isCurrent=()=>isCurrentOwner()&&!n.cancelling,o=createHandoffLineReader(e=>{if(e===`park-admitted
`&&i&&isCurrentOwner()){n.parkAdmitted=!0,n.releaseRequesterObserver?.(),n.parkReady=!0,n.closeForStop?.();return}e===`before-park
`&&!r&&isCurrent()&&(r=!0,(async()=>{n.requesterAuthority?.assertCurrent(),await n.beforePark?.(),n.requesterAuthority?.assertCurrent(),n.requesterAuthority?.signal?.throwIfAborted(),isCurrent()&&(i||(n.parkReady=!0,n.closeForStop?.()),F.stdin.write(`noticed
`))})().catch(()=>{isCurrent()&&F.stdin.write(`notice-failed
`)}))});F.stdout.on(`data`,o),F.once(`exit`,()=>F.stdout.off(`data`,o))}let L={command:C,logPath:y},R=I.slice(13).trim();return`${I}\n`===$?{...L,status:`started`,...F.pid?{pid:F.pid}:{},handoffId:e.handoffId,installRoot:t}:{...L,status:`joined`,...R?{handoffId:R}:{}}}async function assertManagedServiceUpdateHandoffRoot(e){let t=B(e.expectedRoot),n=e.executingRoot?B(e.executingRoot):null,r=n!==null&&B(e.root)===n;if(!(r&&t===n)){if(r&&e.postCore){let[e,r]=await Promise.all([He(t),He(n)]);if(e&&r&&e.ownerRoot===r.ownerRoot&&B(r.packageRoot)===n)return}throw Error(`Managed update handoff root mismatch: expected ${e.expectedRoot}, running from ${e.root}.`)}}async function startManagedServiceUpdateHandoff(e){if(e.requester?.authorizationSource?.startsWith(`profile:`)&&(!e.requesterAuthority||!e.beforePark))throw Error(`Profile update requires its original Gateway admission and park owner.`);if(e.requesterAuthority?.assertCurrent(),e.requesterAuthority?.signal?.throwIfAborted(),e.action&&e.supervisor!==`systemd`)throw Error(`Automatic managed triage requires a Linux user-systemd scope; run openclaw triage manually.`);if(!Number.isFinite(e.restartDrainTimeoutMs)||!Number.isFinite(e.restartDelayMs??0))throw Error(`managed update handoff requires a finite restart deadline`);let t=!e.foregroundOrigin&&e.supervisor===`systemd`?await admitSystemdUpdate(e.root,e.env):void 0;if(t&&e.action)throw Error(`Automatic managed triage requires a Linux user-systemd scope; run openclaw triage manually.`);let n=B(e.root),r=W.get(n),i;if(r?.exited&&r.transferred&&!r.cancelling){let e=r.leaseStore,t=e?.read(n);if(!e||!t||t.kind===`unreadable`)throw Error(`The previous managed update lease is unavailable; check it before retrying.`);t.kind===`current`&&!e.release(t.lease)&&(i=t.lease.owner)}if(r?.flight&&(!r.exited||r.cancelling||r.claimed&&!r.transferred||i)){let e=await r.flight,t=i??e.handoffId;return{status:`joined`,command:e.command,logPath:e.logPath,...e.pid?{pid:e.pid}:{},...t?{handoffId:t}:{}}}if(e.foregroundOrigin&&P())throw new me;let a={handoffId:e.handoffId??J(),operatorRestartWarning:t,recoveryTimeoutMs:e.recoveryTimeoutMs??e.timeoutMs??18e5,parentExitTimeoutMs:Math.min(2147483647,Math.max(0,e.restartDrainTimeoutMs)+St),...e.beforePark?{beforePark:e.beforePark}:{},...e.requesterAuthority?{requesterAuthority:e.requesterAuthority}:{},...e.foregroundOrigin?{foregroundOrigin:{...e.foregroundOrigin}}:{},...r?.leaseDatabaseIdentity?{leaseDatabaseIdentity:r.leaseDatabaseIdentity}:{}};W.set(n,a);let o=a.requesterAuthority?.signal;if(o){let cancelRevokedRequester=()=>{a.flight?.then(async()=>{!a.parkAdmitted&&W.get(n)===a&&await cancelManagedServiceUpdateHandoff({kind:`managed-update-handoff`,handoffId:a.handoffId,installRoot:n})},()=>{})};o.addEventListener(`abort`,cancelRevokedRequester,{once:!0}),a.releaseRequesterObserver=()=>o.removeEventListener(`abort`,cancelRevokedRequester)}let s=Promise.resolve().then(()=>spawnManagedServiceUpdateHandoff({...e,handoffId:a.handoffId,meta:{...e.meta,handoffId:e.meta.handoffId??a.handoffId}},n,a));a.flight=s;try{return await s}catch(e){throw a.releaseRequesterObserver?.(),W.get(n)===a&&W.delete(n),e}}function claimManagedServiceUpdateHandoff(e){let t=currentManagedServiceUpdateHandoff(e);return!t||t.cancelling?!1:(t.claimed=!0,!0)}function currentManagedServiceUpdateHandoff(e){let t=B(e.installRoot),n=W.get(t),r=n?.launcher,i=n?.helper,a=U(t);if(e.kind===`managed-update-handoff`&&n?.handoffId===e.handoffId&&n.leaseStore&&r?.pid&&ee(r.pid)&&n.launcherStartIdentity!=null&&n.leaseStore.isProcessIdentityCurrent({pid:r.pid,startIdentity:n.launcherStartIdentity},r.exitCode===null&&r.signalCode===null)&&r.exitCode===null&&r.signalCode===null&&a?.owner===e.handoffId&&i?.owner===e.handoffId&&(n.transferred&&i.action.kind===`update`||a.executor.pid===i.executor.pid&&a.executor.startIdentity===i.executor.startIdentity)&&JSON.stringify(a.helper)===JSON.stringify(i.helper)&&JSON.stringify(a.action)===JSON.stringify(i.action)&&(a.action.kind!==`triage`||a.action.phase===`reserved`)&&ee(a.executor.pid)&&n.leaseStore.isProcessIdentityCurrent(a.executor,a.executor.pid===r.pid&&r.exitCode===null&&r.signalCode===null))return n}function hasForegroundUpdatePaths(e,t){return o(ne(t))===e.stateDatabasePath&&o(d(t,u(t)))===e.configPath}async function assertForegroundUpdateOrigin(e,t,n=process.env){let matchesOwner=()=>{if(!hasForegroundUpdatePaths(e,n))return!1;let r=k({env:n,current:!0});return t?r===void 0:r?.mode===`foreground`&&r.state===`live`&&r.owner===e.owner&&r.pid===e.pid&&r.host===e.host&&r.startedAt===e.startedAt&&r.port===e.port};if(!matchesOwner())throw Error(`Foreground Gateway owner or paths changed`);let r=await L({env:n,requireInspection:!0});if(t?r!==void 0:r?.pid!==e.pid||r.startTime!==e.startedAt||r.port!==e.port)throw Error(`Foreground Gateway locks do not match its handoff phase`);if(t&&await x(e.port)!==`free`)throw Error(`Foreground Gateway port is not verified free`);if(!matchesOwner())throw Error(`Foreground Gateway owner or paths changed during inspection`)}async function exchangeForegroundUpdateHandoff(e,t){let n=e.env??process.env,r=await Ne(n);if(r?.completionOwner!==`gateway-restart`||!r.foregroundOrigin||!hasForegroundUpdatePaths(r.foregroundOrigin,n)||!process.connected||!process.send||!await Qe(e))return!1;let i=U(B(e.root)),a=J(),o=await new Promise(e=>{let finish=t=>{clearTimeout(n),process.off(`message`,onMessage).off(`disconnect`,onDisconnect),e(t)},onDisconnect=()=>finish(!1),onMessage=e=>{typeof e==`object`&&e&&`requestId`in e&&e.requestId===a&&finish(`type`in e&&e.type===t&&`version`in e&&e.version===2&&`ok`in e&&e.ok===!0)},n=setTimeout(()=>finish(!1),t===`foreground-park`?18e5:3e4);process.on(`message`,onMessage).once(`disconnect`,onDisconnect),process.send({type:t,version:2,requestId:a},e=>{e&&finish(!1)})}),s=U(B(e.root));return o&&s?.payload===i?.payload&&hasForegroundUpdatePaths(r.foregroundOrigin,n)&&await Qe(e)}async function isCurrentForegroundUpdateHandoffProcess(e){return exchangeForegroundUpdateHandoff(e,`foreground-inspect`)}async function parkForegroundUpdateHandoff(e){if(!await exchangeForegroundUpdateHandoff({root:e.root,runId:e.run.runId,env:e.run.env},`foreground-park`))throw Error(`Foreground update helper could not verify Gateway closure`);e.run.gatewayRestartRequired=!0}function sendManagedServiceUpdateHandoffCommand(e,t){let n=W.get(B(e.installRoot)),r=n?.launcher;return!n||!r?.stdin||!r.stdout||r.stdin.destroyed?Promise.resolve(null):waitForHandoffResponse(r,t===`park`?n.parentExitTimeoutMs:n.recoveryTimeoutMs,t).catch(()=>null)}async function commitManagedServiceUpdateHandoff(e,t=`update`){return claimManagedServiceUpdateHandoff(e)&&await sendManagedServiceUpdateHandoffCommand(e,t===`update`?`commit`:`restore-commit`)===`committed`}async function transferManagedServiceUpdateHandoff(e){let t=W.get(B(e.installRoot)),n=t?.launcher;return t?.foregroundOrigin&&P()||!t||!n?.stdin||!n.stdout||!claimManagedServiceUpdateHandoff(e)?!1:(t.requesterAuthority?.assertCurrent(),t.requesterAuthority?.signal?.throwIfAborted(),t.transferred=!0,await sendManagedServiceUpdateHandoffCommand(e,`transfer`)===`transferred`?(n.unref(),unrefHandoffPipe(n.stdin),unrefHandoffPipe(n.stdout),!0):(t.transferred=!1,!1))}async function cancelManagedServiceUpdateHandoff(e){let t=B(e.installRoot),n=W.get(t);if(e.kind!==`managed-update-handoff`||n?.handoffId!==e.handoffId||!n.leaseStore||n.cancelling)return!1;n.cancelling=!0;try{let r=U(t);if(r?.action.kind===`triage`&&(r.owner!==n.handoffId||JSON.stringify(r.helper)!==JSON.stringify(n.helper?.helper)||JSON.stringify({...r.action,phase:`reserved`})!==JSON.stringify(n.helper?.action)||!n.leaseStore.stopNative(r)))return!1;let i=n.launcher;if(i&&!n.exited&&i.exitCode===null&&i.signalCode===null){let t=new Promise(e=>{i.once(`exit`,()=>e())}),r=await sendManagedServiceUpdateHandoffCommand(e,`cancel`);if(r===`restore-after-exit`)return`restart-after-exit`;if(r!==`cancelled`&&!n.exited&&!i.stdin.destroyed)return!1;await t}return U(t,n)!==null||W.get(t)!==n?!1:(W.delete(t),`restored-in-process`)}catch{return!1}finally{n.cancelling=!1,n.parkAdmitted&&n.closeForStop?.()}}var St,$,Ct,wt,Tt=e((()=>{Je(),f(),w(),be(),T(),F(),h(),C(),y(),s(),g(),I(),A(),_e(),S(),b(),a(),Fe(),Ye(),Ve(),ve(),D(),it(),lt(),Ze(),O(),se(),dt(),ft(),mt(),gt(),vt(),xt(),Oe(),Ie(),Ge(),Re(),St=3e4,$=`OPENCLAW_UPDATE_HANDOFF_READY
`,Ct=`HANDOFF_BUSY `,wt=String.raw`
const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const params = JSON.parse(fs.readFileSync(process.argv[2], "utf-8"));
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

const { OPENCLAW_STATE_SCHEMA_SQL, assertOpenClawStateWriteAllowed, createManagedHandoffLeaseStore, extractSqliteTableSchema, readRestartSentinelRowSync, writeRestartSentinelRowIfRevisionSync, resolveImmutableSqliteFileUri, resolveUpdateRestartNoticeMeta, shouldPublishUpdateRestartNotice } =
  require("./runtime/${Q}");
if (!params.updateLeaseDatabaseIdentity) {
  throw new Error("Managed handoff requires its prepared lease database identity");
}
const leaseStore = createManagedHandoffLeaseStore({
  databasePath: params.updateLeaseDatabasePath,
  serviceManagerEnv: params.serviceManagerEnv,
  existingIdentity: params.updateLeaseDatabaseIdentity,
  onProcessIdentityWarning: (pid, message) => {
    appendLog(message);
    runWarnings.set("warning:process-start-identity:" + pid, message);
    if (runLedger && !updaterStarted) recordRunWarnings(runLedger);
  },
}, { warn: (message, metadata) => appendLog(message + " " + JSON.stringify(metadata)) });
const { isPidAlive, properties: parseSystemdProperties, validFailure: validTriageFailure } = leaseStore;
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
let updateCancelled = false;
let transferred = false;
let updateRequesterIdentity;
let activationRejected;
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


function assertStateDatabaseWriteAllowed(database) {
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


let triageFailure;
let runLedger;
let runOutcome;
let terminalRuntimePath = params.recoveryModulePath;
let serviceStoppedAtMs, serviceDowntimeMs;

async function finishManagedUpdateRun() {
  if (!runLedger || !runOutcome) return;
  if (foregroundParked && runOutcome.status === "succeeded") return;
  if (!ownsManagedUpdateLease()) throw new Error("managed update terminal writer lost its current claim");
  const terminalResult = { ...runOutcome, ...(serviceDowntimeMs !== undefined ? { downtimeMs: serviceDowntimeMs } : {}) };
  if (!updaterStarted) { recordRunWarnings(runLedger); await runLedger.finishUpdateRun(params.runId, terminalResult); }
  else {
    // Doctor may have advanced the schema. A new process loads the candidate's
    // entire module graph; a cache-busted import would retain old DB readers.
    const payload = JSON.stringify([terminalRuntimePath, params.runId, terminalResult, [...runWarnings],
      path.join(params.cwd, "runtime", ${JSON.stringify(Q)}),
      params.updateLeaseDatabaseIdentity, params.updateLeaseKey, params.handoffId, managedUpdateLease.helper]);
    if (Buffer.byteLength(payload) > 64 * 1024) throw new Error("managed update terminal result exceeds the command payload limit");
    const exit = await runOwnedUpdateCommand("finalize", [process.execPath, ...params.runtimeArgs, "--input-type=module", "-e",
      'import { pathToFileURL } from "node:url"; const [modulePath, runId, result, warnings, leaseRuntime, databaseIdentity, root, owner, helper] = JSON.parse(process.argv[1]); const { finishUpdateRun, recordUpdateRunDiagnostic, recordUpdateRunStep } = await import(pathToFileURL(modulePath).href); const { createManagedHandoffLeaseStore } = await import(pathToFileURL(leaseRuntime).href); const store = createManagedHandoffLeaseStore({ databasePath: databaseIdentity.databasePath, existingIdentity: databaseIdentity }); const current = store.read(root); const lease = current.kind === "current" ? current.lease : null; if (!lease || lease.owner !== owner || lease.executor.pid !== process.pid || JSON.stringify(lease.helper) !== JSON.stringify(helper) || !(store.isProcessIdentityCurrent(lease.executor) || (process.connected && store.acceptParentBoundExecutor(lease)))) throw new Error("managed update terminal writer lost its current claim"); for (const [step, detail] of warnings) { try { if (recordUpdateRunDiagnostic) recordUpdateRunDiagnostic(runId, detail, undefined, step); else recordUpdateRunStep(runId, {step,status:"completed",detail,endedAtMs:Date.now()}); } catch {} } await finishUpdateRun(runId, result);',
      payload], params.recoveryTimeoutMs);
    if (exit.signal || exit.code !== 0) throw new Error("installed runtime could not finalize the update run");
  }
  runOutcome = undefined;
}

function isFailedUpdateOutcome(status, reason) {
  return status === "error" || (status === "skipped" &&
    !params.nonFailureSkippedReasons.includes(reason));
}

function captureFailedUpdateResult() {
  // Enrich an already recorded failure; diagnostic artifacts never decide the
  // update outcome or permission to restart the service.
  if (fs.existsSync(params.triageContextPath)) {
    triageFailure = { ...triageFailure, reason: "managed-service-handoff-failed" };
    return true;
  }
  const db = openStateDatabase();
  if (!db) return false;
  try {
    const current = readRestartSentinelRowSync(db);
    const payload = current.kind === "valid" ? current.sentinel.payload : undefined;
    if (payload?.kind !== "update" || payload.stats?.handoffId !== params.handoffId ||
      !isFailedUpdateOutcome(payload.status, payload.stats?.reason)) return false;
    triageFailure = { ...triageFailure, payload, reason: payload.stats.reason || "managed-service-handoff-failed" };
    return true;
  } finally {
    db.close();
  }
}

function recordUpdateHandoffOutcome(reason, restored, completedStatus, expectedRevision) {
  if (!ownsManagedUpdateLease()) return false;
  let metaFile;
  try {
    metaFile = JSON.parse(fs.readFileSync(params.metaPath, "utf-8"));
  } catch {}
  const run = runLedger?.getUpdateRun(params.runId);
  // Cancellation must preserve a refusal already recorded by the Gateway.
  if (reason === "managed-service-handoff-cancelled" && run?.reason &&
      run.steps.some((step) => step.step === "requested" && step.status === "failed")) reason = run.reason;
  const meta = resolveUpdateRestartNoticeMeta(run, metaFile && metaFile.version === 1 && metaFile.meta ? metaFile.meta : {});
  const status = (reason === "managed-service-handoff-cancelled" || completedStatus === "skipped") && restored !== false
    ? "skipped" : "error";
  runOutcome = { status: status === "error" ? "failed" : "skipped", reason };
  const fallbackPayload = {
    kind: "update",
    status,
    ts: Date.now(),
    message: typeof meta.note === "string" ? meta.note : null,
    stats: {
      mode: "unknown",
      ...(typeof meta.runId === "string" && meta.runId.trim() ? { runId: meta.runId } : {}),
      ...(typeof meta.root === "string" && meta.root.trim() ? { root: meta.root } : {}),
      ...(meta.completionOwner !== "gateway-restart" && typeof meta.handoffId === "string" && meta.handoffId.trim()
        ? { handoffId: meta.handoffId }
        : {}),
      reason,
      steps: [],
      durationMs: 0,
    },
  };
  for (const key of ["sessionKey", "threadId"]) {
    if (typeof meta[key] === "string" && meta[key].trim()) fallbackPayload[key] = meta[key];
  }
  if (meta.deliveryContext && typeof meta.deliveryContext === "object") {
    fallbackPayload.deliveryContext = meta.deliveryContext;
  }
  if (status === "error") triageFailure ??= { payload: fallbackPayload, reason };
  if (triageFailure && typeof restored === "boolean") triageFailure.restored = restored;
  // The direct child verdict, native lease and original run still own settlement.
  // Do not synthesize a notice that an older restored runtime would turn into work.
  if (!shouldPublishUpdateRestartNotice(run, meta)) return true;
  const db = openStateDatabase();
  if (!db) return null;
  let recorded = null;
  try {
    leaseStore.transact(db, () => {
      assertStateDatabaseWriteAllowed(db);
      const row = readRestartSentinelRowSync(db);
      if (row.kind === "invalid") return;
      const current = row.kind === "valid" ? row.sentinel : null;
      if (expectedRevision !== undefined && (!current || current.revision !== expectedRevision)) {
        recorded = true;
        return;
      }
      let payload = current && current.payload;
      // A completed child attempts publication before recovery. A missing row
      // may already be consumed; do not retry its best-effort notification here.
      if (completedStatus && !payload) { recorded = true; return; }
      const handoffId = typeof params.handoffId === "string" ? params.handoffId.trim() : "";
      if (
        (payload && (payload.kind !== "update" || (!isFailedUpdateOutcome(payload.status, payload.stats?.reason) &&
          (payload.status !== "skipped" || (completedStatus !== "skipped" &&
            !["managed-service-handoff-started", "restart-health-pending", "managed-service-handoff-cancelled"].includes(payload.stats?.reason)))))) ||
        (payload && handoffId && (!payload.stats || payload.stats.handoffId !== handoffId)) ||
        (payload?.stats?.root && payload.stats.root !== params.updateLeaseKey)
      ) {
        return;
      }
      if (payload) {
        const failed = isFailedUpdateOutcome(payload.status, payload.stats?.reason);
        const preserveChildStatus = completedStatus === payload.status && restored !== false;
        // A failed attempt keeps its reason when recovery turns a skipped status into an error.
        payload = {
          ...payload,
          status: payload.status === "error" || preserveChildStatus ? payload.status : status,
          stats: { ...(payload.stats || {}), reason: failed || preserveChildStatus ? payload.stats?.reason ?? reason : reason },
        };
        delete payload.continuation;
      } else {
        payload = fallbackPayload;
      }
      if (isFailedUpdateOutcome(payload.status, payload.stats?.reason)) {
        payload.doctorHint = params.triageHint;
        triageFailure ??= { reason };
        triageFailure.payload = payload;
      }
      if (params.foregroundOrigin) delete payload.stats.handoffId;
      runOutcome = { status: payload.status === "error" ? "failed" : "skipped", reason: payload.stats?.reason ?? reason };
      if (typeof restored === "boolean") {
        payload.stats.steps = [
          ...(payload.stats.steps || []),
          { name: "service-restore", command: params.serviceRecovery.kind,
            log: { exitCode: restored ? 0 : 1, ...(completedStatus && !restored ? { stderrTail: reason } : {}) } },
        ];
      }
      recorded = writeRestartSentinelRowIfRevisionSync(db, payload, current ? current.revision : null)?.revision ?? null;
      if (recorded === null) {
        throw new Error("restart sentinel changed before guarded failure write");
      }
      if (triageFailure) triageFailure.payload = payload;
    });
  } catch (err) {
    recorded = null;
    appendLog("failed to write update sentinel failure: " + (err && err.stack ? err.stack : String(err)));
  } finally {
    try {
      db.close();
    } catch {}
  }
  return recorded;
}



function runServiceCommand(command, args, onSpawn, deadline, timeoutCap) {
  if (!hasManagedUpdateLease()) return Promise.resolve({ code: 1, stdout: "", stderr: "" });
  return new Promise((resolve) => {
    const remaining = deadline === undefined ? params.recoveryTimeoutMs : deadline - Date.now();
    if (remaining <= 0) return resolve({ code: 1, stdout: "", stderr: "" });
    let stdout = "",
      stderr = "";
    const child = spawn(command, args, {
      env: params.serviceManagerEnv,
      stdio: ["ignore", "pipe", "pipe"],
      killSignal: "SIGKILL",
      timeout: Math.min(timeoutCap ?? remaining, remaining),
    });
    child.stdout?.on("data", (chunk) => {
      stdout = (stdout + chunk).slice(-8192);
    });
    child.stderr?.on("data", (chunk) => {
      stderr = (stderr + chunk).slice(-8192);
    });
    child.once("spawn", () => onSpawn?.());
    child.once("error", (error) => {
      stderr = String(error);
    });
    child.once("close", (code) =>
      resolve({ code: typeof code === "number" ? code : 1, stdout, stderr }),
    );
  });
}

${ut}

process.once("SIGTERM", () => {
  if (params.action !== "triage") return process.exit(143);
  if (managedUpdateLease) leaseStore.settle(managedUpdateLease, "closing");
  appendLog("automatic triage cancelled by termination signal; no Gateway restoration");
  cleanupSensitiveFiles();
  releaseManagedUpdateLease();
  stopTriageScope();
  process.exit(143);
});

async function enterTriageAfterUpdate(continuation) {
  if (
    !ownsManagedUpdateLease() ||
    managedUpdateLease.action.kind !== "update" ||
    params.serviceRecovery?.kind !== "systemd" ||
    typeof process.execve !== "function"
  ) {
    appendLog("automatic triage continuation unavailable; run openclaw triage manually");
    return;
  }
  const primary = await inspectSystemdService(params.serviceRecovery.unit);
  if (
    primary?.Id !== params.serviceRecovery.unit ||
    primary.LoadState !== "loaded" ||
    !parkedServiceFragment ||
    primary.FragmentPath !== parkedServiceFragment ||
    !ownsManagedUpdateLease()
  ) {
    appendLog(
      "automatic triage could not verify the installed service after update restoration; run openclaw triage manually",
    );
    return;
  }
  const scopeUnit = params.scopeUnit.replace(/^openclaw-update-/, "openclaw-triage-");
  const action = {
    kind: "triage", phase: "reserved",
    lifetime: { kind: "native", unit: params.serviceRecovery.unit, scope: scopeUnit, placement: { kind: "pending" } },
  };
  // execve replaces this process without running its finally; finish the
  // original update before transferring installation ownership to triage.
  await finishManagedUpdateRun();
  let retargeted;
  try {
    retargeted = leaseStore.retarget(managedUpdateLease, continuation.failure.installationRoot, action);
  } catch (error) {
    appendLog("automatic triage destination admission failed: " + String(error) + "; run openclaw triage manually");
    return;
  }
  if (!retargeted) {
    appendLog("automatic triage lost its completed update owner; run openclaw triage manually");
    return;
  }
  if (retargeted.kind === "busy") {
    appendLog("automatic triage already owned for the installed destination; retaining the original update failure");
    return;
  }
  managedUpdateLease = retargeted.lease;
  params.updateLeaseKey = retargeted.lease.key;
  // Pre-attachment work keeps update semantics; no past STOP is inferred. Native
  // attachment starts triage cancellation, before readiness or any fixing action.
  // Close this outer restoration permanently before entering that revocable scope.
  restorationArmed = false;
  Object.assign(params, {
    action: "triage",
    runId: undefined,
    triageTransition: true,
    failure: continuation.failure,
    commandArgv: continuation.commandArgv,
    commandLabel: "openclaw triage (automatic)",
    scopeUnit,
    primaryFragment: primary.FragmentPath,
  });
  fs.writeFileSync(process.argv[2], JSON.stringify(params), { mode: 0o600 });
  const command = params.systemdRun;
  const argv = [
    command,
    "--user",
    "--scope",
    "--collect",
    "--unit=" + scopeUnit,
    "--property=PartOf=" + params.serviceRecovery.unit,
    process.execPath,
    ...params.runtimeArgs,
    process.argv[1],
    process.argv[2],
  ];
  const triageEnv = { ...process.env };
  delete triageEnv[${JSON.stringify(Me)}];
  process.execve(command, argv, triageEnv);
}

function isLaunchdNotLoaded(result) {
  return /no such process|could not find service|not found/i.test(result.stderr || result.stdout);
}

const parseLaunchdPid = (stdout) => Number(/^\s*pid\s*=\s*([1-9]\d*)\s*$/im.exec(stdout)?.[1]);

let parkedServiceGeneration = null;
let parkedServiceInvocation = null;
let parkedServiceFragment = null;
let restorationArmed = false;
let updaterStarted = false;
let pendingServiceStop;
let finishBeforeParkNotice;

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
  if (updateCancelled || (params.foregroundOrigin && activationRejected) || !ownsManagedUpdateLease() ||
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
  if (recovery.kind === "systemd") {
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
    await prepareTransferredGateway();
    assertGatewayParkOwner();
    // Keep the exact stop job open across parent exit; its completion is the
    // authoritative systemd fact, even after inactive-unit metadata is collected.
    await new Promise((resolve, reject) => {
      pendingServiceStop = runServiceCommand(
        "systemctl",
        ["--user", "stop", recovery.unit],
        () => {
          restorationArmed = true;
          recordServiceStop();
          resolve();
        },
        params.parentExitDeadlineAt,
        params.parentExitTimeoutMs,
      );
      pendingServiceStop.then((result) => {
        if (!restorationArmed) reject(new Error("systemd stop failed: " + result.stderr));
      });
    });
    return;
  }
  if (recovery.kind !== "launchd") throw new Error("unsupported managed update supervisor");
  const target = "gui/" + recovery.uid + "/" + recovery.label;
  const inspection = await runServiceCommand("launchctl", ["print", target], undefined, params.parentExitDeadlineAt);
  if (inspection.code !== 0 || parseLaunchdPid(inspection.stdout) !== params.parentPid) {
    throw new Error("launchd service does not match the exact active gateway parent");
  }
  assertGatewayParkOwner();
  await prepareTransferredGateway();
  assertGatewayParkOwner();
  restorationArmed = true;
  const disabled = await runServiceCommand("launchctl", ["disable", target], undefined, params.parentExitDeadlineAt);
  if (disabled.code !== 0) throw new Error("launchctl disable failed: " + disabled.stderr);
  assertGatewayParkOwner();
  // bootout shares the activation deadline; its accepted spawn acknowledges parking.
  await new Promise((resolve, reject) => {
    pendingServiceStop = runServiceCommand("launchctl", ["bootout", target], () => { recordServiceStop(); resolve(); }, params.parentExitDeadlineAt);
    pendingServiceStop.then((result) => {
      if (result.code !== 0 && !isLaunchdNotLoaded(result)) {
        reject(new Error("launchctl bootout failed: " + result.stderr));
      }
    });
  });
}

async function restoreGatewayService(reason, decision = params.recovery, childStatus, previousGeneration = false) {
  if (managedUpdateLease?.action.kind !== "update" || !ownsManagedUpdateLease()) return false;
  let expectedRevision;
  const record = (restored) => recordUpdateHandoffOutcome(
    restored ? reason : "managed-service-handoff-restore-failed", restored, childStatus, expectedRevision,
  );
  if (decision?.serviceRestartSafe !== true || !decision.version) {
    appendLog("recovery refused: original runtime identity could not be verified");
    record(false);
    return false;
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
  if (childStatus) expectedRevision = recordUpdateHandoffOutcome(reason, undefined, childStatus);
  if (recovery?.kind === "systemd") {
    if (!pendingServiceStop || (await pendingServiceStop).code !== 0) {
      appendLog("recovery refused: exact systemd stop did not complete");
      record(false);
      return false;
    }
    const parked = await inspectSystemdService(recovery.unit);
    const retained = parked?.ExecMainStartTimestampMonotonic === parkedServiceGeneration &&
      parked?.InvocationID === parkedServiceInvocation;
    const cleared = parked?.ExecMainStartTimestampMonotonic === "0" && !parked?.InvocationID;
    // A Gateway that exits non-zero during the stop (KillMode=mixed) settles the unit
    // into ActiveState=failed with the parked identity retained; that is still the
    // exact parked generation and recovery stays safe. An owned candidate boot can
    // advance inactive-unit metadata. Only a verified full-generation rollback
    // permits recovering that later stopped invocation.
    if (!parked || parked.Id !== recovery.unit || parked.LoadState !== "loaded" ||
      (parked.ActiveState !== "inactive" && parked.ActiveState !== "failed") ||
      parked.MainPID !== "0" || !(previousGeneration || retained || cleared) ||
      !ownsRecovery()) {
      appendLog("recovery refused: parked systemd service identity changed or stop is incomplete");
      record(false);
      return false;
    }
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
    const target = "gui/" + recovery.uid + "/" + recovery.label;
    const deadline = Date.now() + params.recoveryTimeoutMs;
    const run = (args) => runOwned("launchctl", args, undefined, deadline);
    const before = await run(["print", target]);
    if (before.code === 0) {
      const pid = parseLaunchdPid(before.stdout);
      if (pid && pid !== params.parentPid) {
        appendLog("recovery refused: launchd service has another process generation");
        record(false);
        return false;
      }
    } else if (!isLaunchdNotLoaded(before)) {
      record(false);
      return false;
    }
    if (childStatus) {
      const restarted = await restart();
      // The guarded CLI owns its restart deadline; identity inspection gets a fresh probe budget.
      const current = ownsRecovery()
        ? await runOwned("launchctl", ["print", target]) : null;
      const pid = current?.code === 0
        ? parseLaunchdPid(current.stdout) : 0;
      serviceRunning = current?.code === 0 ? Boolean(pid && isPidAlive(pid)) : undefined;
      servicePid = serviceRunning ? pid : undefined;
      restored = !restarted.signal && restarted.code === 0 && Boolean(pid && pid !== params.parentPid && serviceRunning);
    } else {
    const enabled = await run(["enable", target]);
    let kickstarted = false;
    for (let inspection = enabled; enabled.code === 0 && Date.now() < deadline;) {
      inspection = await run(["print", target]);
      if (inspection.code === 0) {
        const pid = parseLaunchdPid(inspection.stdout);
        if (pid !== params.parentPid && isPidAlive(pid)) {
          restored = true;
          servicePid = pid;
          break;
        }
        // launchd retains the old label until its ExitTimeOut-bounded teardown completes.
        if (pid === params.parentPid) {
          await sleep(Math.min(500, Math.max(0, deadline - Date.now())));
          continue;
        }
        if (kickstarted) break;
        kickstarted = true;
        inspection = await run(["kickstart", target]);
      } else if (isLaunchdNotLoaded(inspection)) {
        inspection = await run(["bootstrap", "gui/" + recovery.uid, recovery.plistPath]);
      } else break;
      if (inspection.code === 0) continue;
      const detail = inspection.stderr || inspection.stdout;
      if (inspection.code === 130 ||
        /already exists in domain|operation already in progress|bootstrap failed: 37/i.test(detail)) continue;
      if (kickstarted && isLaunchdNotLoaded(inspection)) continue;
      if (!/bootstrap failed: 5|input\/output error/i.test(detail)) break;
      await sleep(Math.min(500, Math.max(0, deadline - Date.now())));
    }
    serviceRunning = restored;
    }
  } else if (recovery?.kind === "schtasks") {
    restored = (await runOwned("schtasks.exe", ["/Run", "/TN", recovery.taskName])).code === 0;
  }
  // Manager liveness survives a failed readiness probe, but version facts require
  // the new process to answer; never reuse the pre-activation runtime identity.
  runLedger?.recordUpdateRunVerification(params.runId, {
    serviceRunning, pid: servicePid, runningVersion: undefined, runningBuildId: undefined, versionMatch: undefined,
    readyz: undefined, settled: undefined, channelsReady: undefined, pluginErrors: undefined,
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
  const recorded = record(restored);
  if (!recorded) {
    appendLog("managed update restoration result could not be durably recorded");
  }
  return restored;
}

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
      if ((current.ActiveState === "inactive" || current.ActiveState === "failed") &&
        current.MainPID === "0") {
        // KillMode=mixed units settle into ActiveState=failed instead of inactive
        // when the Gateway main process exits non-zero during the stop. The parked
        // generation/invocation stays retained in that state, so it is still the
        // exact parked unit and activation may proceed.
        const retainedIdentity =
          current.ExecMainStartTimestampMonotonic === parkedServiceGeneration &&
          current.InvocationID === parkedServiceInvocation;
        const clearedIdentity =
          current.ExecMainStartTimestampMonotonic === "0" && !current.InvocationID;
        if (!retainedIdentity && !clearedIdentity) {
          throw new Error("systemd service remained active or changed execution generation");
        }
        break;
      }
      if (current.ActiveState !== "deactivating" || current.MainPID !== "0" ||
        current.ExecMainStartTimestampMonotonic !== parkedServiceGeneration ||
        current.InvocationID !== parkedServiceInvocation) {
        throw new Error("systemd service remained active or changed execution generation");
      }
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
  await runLedger.assertForegroundUpdateOrigin(params.foregroundOrigin, closed);
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
    if (updateCancelled || !ownsManagedUpdateLease()) throw new Error("managed update activation cancelled");
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
      fs.writeSync(1, ${JSON.stringify(st)});
    });
    if (requiresRequesterAcknowledgement && notice !== "noticed")
      throw Object.assign(new Error("owner_required: original Gateway did not authorize parking"), { code: "owner_required" });
  }
  if (requiresRequesterAcknowledgement) {
    assertPreparedProfileRequester();
    assertGatewayParkOwner();
    const receipt = ${JSON.stringify(ct)};
    if (fs.writeSync(1, receipt) !== Buffer.byteLength(receipt))
      throw new Error("Managed update park acceptance receipt was incomplete");
  } else {
    await assertUpdateRequester();
    assertGatewayParkOwner();
  }
  transferPrepared = true;
}

${pt}

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


${ot}

async function collectUpdateFailureTriage() {
  try {
    if (!triageFailure || !ownsManagedUpdateLease()) return;
    // Diagnostic reads share this boundary so they cannot bypass terminal cleanup.
    captureFailedUpdateResult();
    appendLog("If triage is unavailable, run " + params.triageRecoveryCommand + " on the Gateway host.");
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
    failure.error = [failure.error, recovery].filter(Boolean).join("\n");
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

let automaticRequested = false;

(async () => {
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
    fs.writeSync(1, ${JSON.stringify(Ct)} + (lease.owner || "") + "\n");
    await sleep(25);
    return;
  }
  let outcome = params.triageTransition ? "triage" : undefined;
  let wake;
  let deadlineExpired = false;
  const parentExitDeadline = setTimeout(() => {
    deadlineExpired = true;
    if (outcome !== "update" && outcome !== "triage") outcome = "restore";
    wake?.();
  }, params.parentExitTimeoutMs);
  try {
    if (params.action === "update" && params.runId) {
      // Admission and stop recording use the serving runtime. Terminal writes after
      // the updater starts must load the installed runtime in a fresh process.
      runLedger = await import(pathToFileURL(params.recoveryModulePath).href);
      for (const name of ["adoptUpdateRun", "finishUpdateRun", "getUpdateRun", "recordUpdateRunStep", "recordUpdateRunVerification"]) {
        if (typeof runLedger[name] !== "function") throw new Error("managed update ledger writer is unavailable");
      }
      if (!ownsManagedUpdateLease()) throw new Error("managed update lease no longer owns the helper");
      // Retain prior drivers while recording this helper's independent lifetime.
      runLedger.adoptUpdateRun(params.runId);
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
    if (!params.triageTransition) fs.writeSync(1, ${JSON.stringify($)});
    const commands = [];
    let input = "";
    let disconnected = false;
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
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
      if (!ownsManagedUpdateLease())
        throw new Error("managed update lease no longer owns the helper");
      if (!parentIdentityCurrent()) {
        if (isPidAlive(params.parentPid))
          throw new Error("managed update parent process identity changed");
        await new Promise((resolve) => setImmediate(resolve));
        if (!commands.length) break;
      }
      if (deadlineExpired) {
        if (params.action === "triage") throw new Error("automatic triage admission expired");
        deadlineExpired = false;
        if (!parked) {
          recordUpdateHandoffOutcome("managed-service-handoff-cancelled");
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
            recordUpdateHandoffOutcome("managed-service-handoff-cancelled");
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
            recordUpdateHandoffOutcome("managed-service-handoff-cancelled");
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
    clearTimeout(parentExitDeadline);
    if (outcome !== "update" && outcome !== "triage") {
      if (restorationArmed) await restoreGatewayService("managed-service-handoff-cancelled");
      else if (params.action === "update")
        recordUpdateHandoffOutcome("managed-service-handoff-cancelled");
      return;
    }
    if (restorationArmed) await finishGatewayServicePark();

    if (params.action === "update") await assertUpdateRequester();
    if (updateCancelled) {
      recordUpdateHandoffOutcome("managed-service-handoff-cancelled");
      return;
    }
    appendLog("starting managed update command: " + params.commandLabel);
    // Update inputs retain shell-relative paths; recovery keeps the durable helper cwd.
    const exit = await runOwnedUpdateCommand(params.action, params.commandArgv, undefined, params.action === "update" ? params.invocationCwd : params.cwd);
    if (params.action === "triage") {
      if (exit.signal || exit.code !== 0) process.exitCode = exit.code || 1;
      return;
    }
    automaticRequested = Boolean(exit.continuation);
    if (updateCancelled || activationRejected) {
      const reason = updateCancelled ? "managed-service-handoff-cancelled" : activationRejected;
      // No parked acknowledgement authorized a swap. Recovery waits for any
      // dispatched stop, even when cancellation overlaps the parent's drain.
      if (restorationArmed) {
        if (!(await restoreGatewayService(reason))) process.exitCode = 1;
      } else recordUpdateHandoffOutcome(reason);
      if (!updateCancelled) process.exitCode = 1;
      return;
    }
    const { updaterOutput, outputOverflow } = exit;
    // Only this invocation's direct child result carries the producer decision.
    // Success may change install roots; only recovery requires the original root.
    // Sentinels and diagnostic exports never authorize activation.
    let result = null;
    try { if (!outputOverflow) result = JSON.parse(updaterOutput); } catch {}
    if (!exit.signal && ownsManagedUpdateLease() && result?.status === "skipped" &&
      result.reason === "update-ledger-busy" && result.root === undefined && result.runId === undefined &&
      ((result.mode === "unknown" && exit.code === 0) || (result.mode === "finalize" && exit.code === 1))) {
      // Admission never acquired an install/run result. Preserve its deferral without
      // turning the missing root into either recovery or successor authority.
      runOutcome = { status: "skipped", reason: result.reason };
      process.exitCode = exit.code;
      return;
    }
    let resultRoot;
    try { resultRoot = fs.realpathSync(result?.root); } catch {}
    if (result?.status === "ok" && resultRoot && resultRoot !== params.updateLeaseKey) {
      terminalRuntimePath = path.join(resultRoot, "dist", "cli", "daemon-cli.js");
    }
    const reportedFailure = isFailedUpdateOutcome(result?.status, result?.reason);
    if (!exit.signal && exit.code === 0 && resultRoot && result?.status === "ok") {
      runOutcome = { status: "succeeded", after: result.after };
    } else if (resultRoot && ["error", "skipped"].includes(result?.status)) {
      runOutcome = { status: result.status === "skipped" && !exit.signal && exit.code === 0 ? "skipped" : "failed", reason: result.reason, after: result.after };
    }
    if (reportedFailure) triageFailure ??= { reason: result?.reason || "managed-service-handoff-failed" };
    const childStatus = !exit.signal && resultRoot === params.updateLeaseKey && ["error", "skipped"].includes(result?.status) ? result.status : undefined;
    const recovery = childStatus ? result.recovery : null;
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
        process.exitCode = exit.code || (runOutcome.status === "skipped" && !reportedFailure && !exit.signal ? 0 : 1);
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
      appendLog("managed update reported unsafe recovery; keep the gateway stopped until the installation is repaired and update succeeds");
      recordUpdateHandoffOutcome("managed-service-handoff-unsafe-recovery");
      process.exitCode = exit.code;
    } else if (!resultRoot || result?.status !== "ok" ||
      exit.signal || exit.code !== 0) {
      let restored = !restorationArmed || (safe && recovery.service === "healthy");
      if (restorationArmed && safe && recovery.service === undefined) {
        restored = await restoreGatewayService(previousGeneration ? result.reason : "managed-service-handoff-failed", recovery, childStatus, previousGeneration);
      } else {
        if (restored && triageFailure) triageFailure.restored = true;
        appendLog("managed update recovery not attempted: " +
          (recovery?.serviceRestartSafe === false ? "updater explicitly rejected activation" :
            recovery?.service === "healthy" ? "updater already verified recovery" :
              recovery?.service === "failed" ? "updater recovery failed; no automatic retry" :
                "no verified recovery result; inspect the installation before restarting"));
        if (restorationArmed && !restored) { const alarm = "Gateway recovery failed after the update. OpenClaw stopped automatic recovery because it could not safely verify the installed runtime. Recovery details were saved with the update result."; appendLog(alarm); runWarnings.set("warning:gateway-availability", alarm); }
        if (childStatus !== "skipped" || !restored) {
          recordUpdateHandoffOutcome("managed-service-handoff-failed", undefined, childStatus === "skipped" ? "error" : childStatus);
        }
      }
      if (previousGeneration && restored) {
        runOutcome = { status: "rolled-back", reason: result.reason, after: result.after };
      }
      process.exitCode = previousGeneration && restored ? 1 : exit.code ||
        (childStatus === "skipped" && restored && !exit.signal && !reportedFailure ? 0 : 1);
    }
    if (exit.continuation && !exit.signal) await enterTriageAfterUpdate(exit.continuation);
  } catch (err) {
    appendLog("handoff failed: " + (err && err.stack ? err.stack : String(err)));
    const reason = err?.code === "owner_required" ? "owner_required" : "managed-service-handoff-helper-failed";
    if (params.action === "update") runOutcome = { status: "failed", reason };
    if (hasManagedUpdateLease()) {
      if (params.action !== "triage") bindManagedUpdateLeaseToProcess(process.pid);
      if (restorationArmed && !updaterStarted) await restoreGatewayService(reason);
      else if (params.action === "update") recordUpdateHandoffOutcome(reason);
    }
    process.exitCode = 1;
  } finally {
    clearTimeout(parentExitDeadline);
    try { await finishManagedUpdateRun(); }
    catch (error) {
      appendLog("failed to finalize update run: " + String(error));
      foregroundRespawn = false;
      process.exitCode = 1;
    }
    if (params.action === "update" && !automaticRequested) await collectUpdateFailureTriage();
    releaseManagedUpdateLease();
    cleanupSensitiveFiles();
    stopTriageScope();
    appendLog("managed update helper completed code=" + (process.exitCode || 0));
    if (params.operatorRestartWarning) fs.writeSync(1, ${JSON.stringify(bt)});
    if (foregroundClosed && parentIdentityCurrent())
      fs.writeSync(1, "foreground-settled:" + (foregroundRespawn ? "respawn" : "stopped") + "\n");
    process.stdin.destroy();
  }
})().catch((err) => {
  appendLog("handoff setup failed: " + (err && err.stack ? err.stack : String(err)));
  cleanupSensitiveFiles();
  stopTriageScope();
  process.exitCode = 1;
});
`}));export{commitManagedServiceUpdateHandoff as a,parkForegroundUpdateHandoff as c,admitSystemdUpdate as d,xt as f,it as h,claimManagedServiceUpdateHandoff as i,startManagedServiceUpdateHandoff as l,formatManagedServiceUpdateCommand as m,assertManagedServiceUpdateHandoffRoot as n,Tt as o,buildManagedServiceHandoffUnavailableMessage as p,cancelManagedServiceUpdateHandoff as r,isCurrentForegroundUpdateHandoffProcess as s,assertForegroundUpdateOrigin as t,transferManagedServiceUpdateHandoff as u};