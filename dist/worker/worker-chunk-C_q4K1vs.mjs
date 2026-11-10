import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{r as t,t as n}from"./worker-chunk-B1VtYv8U.mjs";import{a as r,n as i,t as a}from"./worker-chunk-Dw-4PAmJ.mjs";import{i as o}from"./worker-chunk-Bqyo9fIb.mjs";import{h as s,n as c,s as l}from"./worker-chunk-Beu5zrK3.mjs";import{_ as u,c as d}from"./worker-chunk-B1aBsI2P.mjs";import{h as f,o as p}from"./worker-chunk-Cp0IHMVk.mjs";import{i as m}from"./worker-chunk-GpXIZijZ.mjs";import{n as h,r as g}from"./worker-chunk-Cq0h1kUR.mjs";import{r as _,t as v}from"./worker-chunk-BBlBFPic.mjs";import{n as y,t as b}from"./worker-chunk-DtKuWxDT.mjs";import{a as ee,i as te}from"./worker-chunk-Drlilhrw.mjs";import{d as x,p as ne,t as re}from"./worker-chunk-CCUJzS5D.mjs";import{n as S,o as C,r as w,s as T}from"./worker-chunk-B4KjGwxg.mjs";import{l as ie,r as E}from"./worker-chunk-B6G-O0_t.mjs";import{n as D,r as ae}from"./worker-chunk-BqxdELtY.mjs";import{c as oe,n as O}from"./worker-chunk-xlua9rtZ.mjs";import{n as k,t as A}from"./worker-chunk-DPQOA3pj.mjs";import{d as j,t as se}from"./worker-chunk-yESgat-W.mjs";import{n as ce,t as M}from"./worker-chunk-CteKiDDu.mjs";import{n as N,t as P}from"./worker-chunk-DAybOFDl.mjs";import{a as le,i as ue,n as F,r as de,s as fe}from"./worker-chunk-BTNiZTXX.mjs";import{n as pe,o as me,u as he}from"./worker-chunk-DulKatmr.mjs";import{i as ge,r as _e}from"./worker-chunk-LJ22Ay6C.mjs";import{i as ve,r as ye}from"./worker-chunk-DnLk9BBL.mjs";import{n as be,r as xe}from"./worker-chunk-AMCqKuN2.mjs";import{i as Se,s as Ce}from"./worker-chunk-XL6eANcw.mjs";import{a as we,t as Te}from"./worker-chunk-B3qy_RZe.mjs";import{a as I,i as Ee,r as De}from"./worker-chunk-CFhskdoc.mjs";import{r as Oe,t as ke}from"./worker-chunk-DtLffxnZ.mjs";import{n as L,t as R}from"./worker-chunk-FVtR8erD.mjs";import{j as Ae,k as je,l as Me,t as Ne}from"./worker-chunk-qIiVSo2e.mjs";import{i as Pe,n as Fe,s as Ie}from"./worker-chunk-C5BH_Zr1.mjs";import{a as z,i as Le}from"./worker-chunk-DzVd-LZX.mjs";import{n as Re,t as ze}from"./worker-chunk-BALQVN8x.mjs";import{n as Be,r as Ve}from"./worker-chunk-BgonhZof.mjs";import{r as He,u as Ue}from"./worker-chunk-kc9qmcGD.mjs";import{a as We,s as Ge}from"./worker-chunk-BItpedsB.mjs";import{a as Ke,i as qe}from"./worker-chunk-BVSUVAAO.mjs";import{f as Je,n as Ye,s as Xe}from"./worker-chunk-BMQ9yGi1.mjs";import{n as Ze,t as Qe}from"./worker-chunk-BEU_4XCn.mjs";import{i as $e,l as et,n as tt,o as nt}from"./worker-chunk-DIO21Lb3.mjs";import{r as rt,t as it}from"./worker-chunk-Dt4ijxxf.mjs";import{C as B,g as at,m as ot,s as st}from"./worker-chunk-DQ5yu1Sm.mjs";import{f as ct,p as lt}from"./worker-chunk-C9KrVxmW.mjs";import{i as ut}from"./worker-chunk-DbCNsA68.mjs";import{n as dt,t as ft}from"./worker-chunk-BccHoRaC.mjs";import{c as pt,n as mt}from"./worker-chunk-CFMl3dgE.mjs";import{n as ht,t as V}from"./worker-chunk-D5y8QIMY.mjs";import{i as H,n as gt,r as _t,t as U}from"./worker-chunk-DWGYJxjl.mjs";import{i as vt,n as yt}from"./worker-chunk-DDgDYCO8.mjs";import{createRequire as W}from"node:module";import G from"node:fs";import bt from"node:os";import K from"node:path";import{randomUUID as q}from"node:crypto";import J from"node:fs/promises";import{spawn as xt}from"node:child_process";import St from"node:process";import{once as Ct}from"node:events";var wt,Tt=e((()=>{Re(),wt=String.raw`
function runServiceCommand(command, args, onSpawn, deadline, timeoutCap) {
  if (!hasManagedUpdateLease()) return Promise.resolve({ code: 1, stdout: "", stderr: "" });
  return new Promise((resolve) => {
    const remaining = deadline === undefined ? params.recoveryTimeoutMs : deadline - Date.now();
    if (remaining <= 0) return resolve({ code: 1, stdout: "", stderr: "" });
    const scheduledTask = command === "schtasks.exe";
    const timeoutMs = Math.min(timeoutCap ?? remaining, remaining,
      scheduledTask ? ${ze} : Infinity);
    const output = { stdout: "", stderr: "" };
    const child = spawn(command, args, {
      env: params.serviceManagerEnv,
      stdio: ["ignore", "pipe", "pipe"],
      killSignal: "SIGKILL",
      timeout: timeoutMs,
    });
    for (const stream of ["stdout", "stderr"]) {
      child[stream]?.on("data", (chunk) => {
        output[stream] = (output[stream] + chunk).slice(-8192);
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
      resolve({ code: typeof code === "number" ? code : 1, ...output });
    });
  });
}
`.trim()}));function resolveUpdateCliArgv(e){return resolveManagedServiceCliArgv(e,[`update`,`--yes`,`--json`,...e.reapplyLocalOverrides?[`--reapply-local-overrides`]:[],...e.acceptCapabilities?[`--accept-capabilities`]:[],...e.admission?[`--admission`,e.admission]:[],...e.channel?[`--channel`,e.channel]:[],...e.tag?[`--tag`,e.tag]:[],...typeof e.timeoutMs==`number`&&Number.isFinite(e.timeoutMs)?[`--timeout`,String(Math.max(1,Math.ceil(e.timeoutMs/1e3)))]:[]])}function resolveManagedServiceCliArgv(e,t){let n=e.execPath?.trim(),r=e.argv1?.trim();return n&&r?[n,...i(n),r,...t]:n&&!/^(?:node|bun)(?:\.exe)?$/iu.test(K.basename(n))?[n,...t]:[`openclaw`,...t]}function formatManagedServiceUpdateCommand(e,t=process.env){return b(resolveUpdateCliArgv(e??{}).toSpliced(3,1).join(` `),t)}function buildManagedServiceHandoffUnavailableMessage(e){return[`OpenClaw updates cannot safely run inside the live gateway process without a managed-service handoff.`,`Stop the foreground Gateway, run \`${e}\` from a shell, then launch the Gateway again. For a managed deployment, use its host's stop, update, and restart workflow.`].join(`
`)}var Et=e((()=>{y(),a()}));function createHandoffLineReader(e){let t=``;return n=>{t=`${t}${n.toString()}`.slice(-1024);let r;for(;(r=t.indexOf(`
`))>=0;){let n=t.slice(0,r+1);if(t=t.slice(r+1),e(n)===!1)return}}}function unrefHandoffPipe(e){`unref`in e&&typeof e.unref==`function`&&e.unref()}function waitForHandoffResponse(e,t,n){return new Promise((r,i)=>{let a=e.stdout,o=n===`closed`?`close`:`exit`,s=!1,cancelTimeout=()=>{},finish=t=>{s||(s=!0,cancelTimeout(),e.removeListener(`error`,finish),e.removeListener(o,onExit),a.removeListener(`data`,c),a.removeListener(`error`,onOutputError),e.stdin.removeListener(`error`,finish).removeListener(`close`,onInputClose),t instanceof Error?(n||a.destroy(),i(t)):r(t))},onExit=(e,t)=>{finish(/* @__PURE__ */ Error(`managed update handoff exited before ${n?`responding`:`signaling readiness`} (code=${e??`null`}, signal=${t??`null`})`))},onOutputError=t=>{!n&&e.pid&&P(e),finish(t)},onInputClose=()=>{n!==`closed`&&finish(/* @__PURE__ */ Error(`managed update handoff control input closed`))},c=createHandoffLineReader(e=>{if(e!==`before-park
`&&e!==`park-admitted
`)return finish(e.slice(0,-1)),!1});n!==`closed`&&(cancelTimeout=ve(Date.now()+t,()=>{onOutputError(/* @__PURE__ */ Error(`managed update handoff did not ${n?`respond`:`signal readiness`} within ${t/1e3} seconds`))})),!s&&(e.once(`error`,finish).once(o,onExit),a.once(`error`,onOutputError).on(`data`,c),e.stdin.once(`error`,finish).once(`close`,onInputClose),n&&e.stdin.write(`${n}\n`,e=>{e&&finish(e)}))})}var Y,Dt,Ot,kt,At,jt=e((()=>{N(),ye(),Y=String.raw`
const gateFs = process.getBuiltinModule("fs");
const gate = Buffer.alloc(2);
try {
  if (gateFs.readSync(4, gate) !== 2 || gate.toString() !== "go")
    throw new Error("Managed handoff admission was refused");
} finally { gateFs.closeSync(4); }
`,Dt=String.raw`
${Y}
const { spawn } = require("node:child_process");
const argv = JSON.parse(process.argv[1]);
if (process.platform !== "win32" && typeof process.execve === "function")
  process.execve(argv[0], argv, process.env);
const child = spawn(argv[0], argv.slice(1), { env: process.env, stdio: "inherit" });
child.once("error", () => { process.exitCode = 1; });
child.once("exit", (code, signal) => {
  process.exitCode = typeof code === "number" ? code : signal ? 1 : 0;
});
`,Ot=String.raw`
async function runOwnedUpdateCommand(phase, commandArgv, timeoutMs, cwd = params.cwd, env = process.env) {
  const updaterChunks = [];
  let updaterBytes = 0;
  let outputOverflow = false;
  let outputFd;
  let timeout;
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
            ${JSON.stringify(`data:text/javascript,${encodeURIComponent(Y)}`)},
            ...commandArgv.slice(1),
          ]
        : ["-e", ${JSON.stringify(Dt)}, JSON.stringify(commandArgv)],
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

      });
      child.on("message", async (message) => {
        try {
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
          } else throw new Error("invalid or repeated managed handoff continuation");
        } catch (error) {
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
      // An interrupted updater requires the helper to inspect durable recovery state.
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
      finalExitCode = 1;
    }
    return { ...exit, updaterOutput: Buffer.concat(updaterChunks).toString(), outputOverflow };
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
`,kt=`before-park
`,At=`park-admitted
`}));function describeManagedHandoffBlocker(e,t,n,r,i=`handoff settlement is pending`){let a=i,o=`Check \`${b(`openclaw update status`,r)}\`. If the updater has exited, run \`${b(`openclaw update repair`,r)}\` from a terminal outside the Gateway; repair verifies owners and children before releasing custody. Do not delete the update lock.`;try{let t=n?.read(e);if(n&&t?.kind===`current`){let e=t.lease,r=e.version===4?`cancelled update custody`:e.version===3?`retained native custody`:e.action.kind===`triage`?`triage/repair lease (${e.action.phase})`:`update lease`,identity=t=>{let r=n.inspectProcessIdentity(e[t]),i=r===`mismatch`?`identity changed`:r===`unknown`?`unverified`:r;return`${t} PID ${e[t].pid} (${i})`};return`Update blocked by ${r}: owner ${e.owner}, lease version ${e.version}, ${identity(`helper`)}, ${identity(`executor`)}, last activity ${new Date(e.updatedAt).toISOString()}. ${o}`}t?.kind===`unreadable`&&(a=`the retained lease could not be read; its custody is unverified`)}catch{a=`the retained lease or its process identities could not be verified`}return`Update blocked by managed handoff ${t||`(owner unavailable)`}: ${a}. ${o}`}var Mt=e((()=>{y()}));function resolveSystemdHandoffLauncher(e){let t=C(`systemd-run`,[e.serviceEnv.PATH??``,`/usr/bin`,`/bin`].join(K.delimiter),e.serviceEnv);if(!t)throw Error(`systemd-run is required to launch a transient user unit`);let n=e.handoffId.trim().replace(/[^A-Za-z0-9_.:@-]+/gu,`-`).replace(/^-+|-+$/gu,``).slice(0,80)||`${process.pid}-${Date.now()}`,r=`openclaw-${e.triage?`triage`:`update`}-${n}.${e.triage?`scope`:`service`}`;return{command:t,unit:r,args:[`--user`,...e.triage?[`--scope`]:[`--pipe`,`--wait`,`--service-type=exec`,`--slice=app-openclaw-update.slice`,`--property=KillMode=control-group`,`--property=OOMPolicy=stop`,`--property=EnvironmentFile=${xe(e.environmentPath)}`,`--working-directory=${e.directory}`],`--collect`,`--unit=${r}`,...e.triage?[`--property=PartOf=${Me(e.serviceEnv)}.service`]:[],e.executable,...e.args]}}async function writeSystemdHandoffEnvironment(e,t){let n={};for(let[e,r]of Object.entries(t))r!==void 0&&(n[e]=r);await J.writeFile(e,Ae(n),{mode:384,flag:`wx`})}var Nt,Pt=e((()=>{be(),je(),Ne(),S(),Nt=String.raw`
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
`})),Ft,It=e((()=>{Ft=String.raw`
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
`.trim()})),Lt,Rt=e((()=>{Lt=String.raw`
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
`.trim()}));function isForegroundGmailRunArgv(e){return Fe(e,3).join(` `)===`webhooks gmail run`}function isNativeHookRelayArgv(e){let{commandPath:t}=z(e);return t[0]===`hooks`&&t[1]===`relay`}function shouldKeepNativeHookRelayInProcess(e,t){return t!==`win32`&&isNativeHookRelayArgv(e)}function isTerminalInteractiveRespawnArgv(e){let t=z(e);return t.hasHelpOrVersion?!1:t.primary===null||zt.has(t.primary)}function shouldSkipRespawnForArgv(e,t=process.platform){let n=z(e),r=n.commandPath.length===2&&n.commandPath[0]===`gateway`&&n.commandPath[1]===`status`;return shouldSkipStartupEnvironmentRespawnForArgv(e,t)||n.primary!==null&&zt.has(n.primary)||r}function shouldSkipStartupEnvironmentRespawnForArgv(e,t=process.platform){let n=z(e);return n.hasHelpOrVersion||isForegroundGmailRunArgv(e)||shouldKeepNativeHookRelayInProcess(e,t)||n.primary===`gateway`&&o(e)}var zt,Bt=e((()=>{Le(),Pe(),Ie(),zt=/* @__PURE__ */ new Set([`tui`,`terminal`,`chat`])}));function normalizeWindowsArgv(e,t={}){if((t.platform??process.platform)!==`win32`||e.length<2)return e;let normalizeCandidate=e=>e.replace(Vt,``).replace(/^['"]+|['"]+$/g,``).trim().replace(/^\\\\\\?\\/,``),basename=e=>e.split(/[\\/]/).pop()??e,n=normalizeCandidate(t.execPath??process.execPath),r=l(n),i=l(basename(n)),isExecPath=e=>{if(!e)return!1;let t=normalizeCandidate(e);if(!t)return!1;let n=l(t),a=basename(n);return n===r||a===i||a===`node.exe`},a=[...e];for(;isExecPath(a[1]);)a.splice(1,1);return a}var Vt,Ht=e((()=>{c(),Vt=new RegExp(String.raw`[\u0000-\u001f\u007f]`,`g`)})),Ut=e((()=>{St.platform}));function pathModuleForPlatform(e){return e===`win32`?K.win32:K.posix}function resolveCliRespawnCommand(e){let t=pathModuleForPlatform(e.platform??process.platform).basename(e.execPath).toLowerCase();return t===`volta-shim`||t===`volta-shim.exe`?`node`:e.execPath}function hasExperimentalWarningSuppressed(e={}){let t=e.env??process.env,n=e.execArgv??process.execArgv,r=t.NODE_OPTIONS??``;return r.includes(X)||r.includes(`--no-warnings`)?!0:n.some(e=>e===X||e===`--no-warnings`)}function hasStackSizeConfigured(e){return e.some(e=>e===`--stack-size`||e.startsWith(`--stack-size=`)||e===`--stack_size`||e.startsWith(`--stack_size=`))}function buildCliRespawnPlan(e={}){let t=e.argv??process.argv,n=e.env??process.env,r=e.execArgv??process.execArgv,i=e.execPath??process.execPath,a=e.platform??process.platform,o=a===`win32`?normalizeWindowsArgv(t,{platform:a,execPath:i}):t;if(shouldSkipStartupEnvironmentRespawnForArgv(o,a)||g(n.OPENCLAW_NO_RESPAWN))return null;let c={...n};s(c.NODE_EXTRA_CA_CERTS)||delete c.NODE_EXTRA_CA_CERTS;let l=[...r],u=!1;if(a===`win32`)return hasStackSizeConfigured(l)||(l.unshift(Kt),u=!0),u?{command:resolveCliRespawnCommand({execPath:i,platform:a}),argv:[...l,...o.slice(1)],env:c,detachForProcessTree:!1}:null;let d=e.autoNodeExtraCaCerts??Ze({env:n,execPath:i,includeDarwinDefaults:!1}).NODE_EXTRA_CA_CERTS;return d&&!g(n[Gt])&&!c.NODE_EXTRA_CA_CERTS&&(c.NODE_EXTRA_CA_CERTS=d,c[Gt]=`1`,u=!0),!shouldSkipRespawnForArgv(t,a)&&!g(n[Wt])&&!hasExperimentalWarningSuppressed({env:n,execArgv:r})&&(c[Wt]=`1`,l.unshift(X),u=!0),u?{command:resolveCliRespawnCommand({execPath:i,platform:a}),argv:[...l,...t.slice(1)],env:c,detachForProcessTree:!isTerminalInteractiveRespawnArgv(t)}:null}var X,Wt,Gt,Kt,qt=e((()=>{c(),Qe(),Bt(),Ht(),h(),Ut(),X=`--disable-warning=ExperimentalWarning`,Wt=`OPENCLAW_NODE_OPTIONS_READY`,Gt=`OPENCLAW_NODE_EXTRA_CA_CERTS_READY`,Kt=`--stack-size=8192`}));async function assertManagedHandoffServiceRuntime(e,n){if(!e)return;let r;try{r=e===`launchd`?await(await import(`./worker-chunk-BwoDQaxa.mjs`)).readLaunchAgentProgramArguments(n,{requireEffective:!0}):e===`systemd`?await(await import(`./worker-chunk-qCOVMZ3G.mjs`)).readSystemdServiceExecStart(n,{requireEffective:!0}):await(await import(`./worker-chunk-D1zwQDK0.mjs`)).readScheduledTaskCommand(n,{requireEffective:!0})}catch(e){console.warn(`[update] Could not inspect the managed service: ${String(e)}`),r=null}let i=r?.programArguments??[],a=i[0],o=i.indexOf(`gateway`),s=i[o-1];if(!a||!t(a)||o<2||!s||!K.isAbsolute(s)||!/\.(?:[cm]?js|ts)$/iu.test(s))throw new B(`managed-service-handoff-failed`,`The Gateway's saved Node executable ${JSON.stringify(process.execPath)} is unavailable. Automatic runtime replacement requires a directly launched Node service; wrapper recovery requires its installation owner to repair the wrapper's runtime first. ${Z}`);let c=T(a,{env:n,useCache:!1});if(c&&(await Xe(c,n)).status!==`supported`)throw new ManagedHandoffServiceRuntimeUnavailableError(c);return c}async function resolveManagedHandoffNodeExecutable(e,t){if(w(process.execPath,{env:e}))return process.execPath;let n=await assertManagedHandoffServiceRuntime(t,e);if(n)return n;let r=await Je({env:e});if(r?.status===`supported`&&r.path)return r.path;for(let t of(e.PATH??``).split(K.delimiter).filter(K.isAbsolute)){let n=C(`node`,t,e,{useCache:!1});if(n&&(await Xe(n,e)).status===`supported`)return n}throw new ManagedHandoffNodeUnavailableError}function prepareManagedHandoffCliRuntime(e,t,n){let r=e[0]===n||/^(?:node|bun)(?:\.exe)?$/iu.test(K.basename(e[0]??``)),a=r?[e[0],...e.slice(1+i(e[0]).length)]:e,o=r?buildCliRespawnPlan({argv:a,env:t,execArgv:[],execPath:e[0]}):null,s=r?o?.argv.slice(0,o.argv.length-a.length+1)??[]:void 0;return o&&(e[0]=o.command),{nodeExecArgv:s,readyEnv:o?.env??t}}var Z,ManagedHandoffNodeUnavailableError,ManagedHandoffServiceRuntimeUnavailableError,Jt=e((()=>{ut(),n(),Ye(),qt(),S(),a(),Z="Inspect the service with `openclaw gateway status --deep` and refresh its definition under the installation owner (for a standard OpenClaw-managed service: `openclaw gateway install --force`). Then retry the update. The serving Gateway has not been stopped.",ManagedHandoffNodeUnavailableError=class extends B{constructor(){super(`managed-service-handoff-failed`,`The Gateway's Node executable ${JSON.stringify(process.execPath)} was removed and no compatible replacement was found. Install a supported Node. ${Z}`),this.name=`ManagedHandoffNodeUnavailableError`}},ManagedHandoffServiceRuntimeUnavailableError=class extends B{constructor(e){super(`managed-service-handoff-failed`,`The Gateway's service executable ${JSON.stringify(e)} is unavailable. ${Z}`),this.name=`ManagedHandoffServiceRuntimeUnavailableError`}}})),Yt,Xt=e((()=>{Yt=String.raw`
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
`})),Q,Zt,Qt=e((()=>{Q=`managed-handoff-runtime.mjs`,Zt={currentModuleUrl:import.meta.url,sourceWorkerName:`update-managed-service-handoff-sealed`,distWorkerPath:Q}})),$t,en=e((()=>{Qt(),$t=String.raw`
let triageFailure;
let runLedger;
let runOutcome;
let closedUpdateResult;
let handoffFailure;
let terminalRuntimePath = params.recoveryModulePath;
let serviceStoppedAtMs, serviceDowntimeMs;
let recoveryObservation;

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
  const terminalResult = {
    ...runOutcome,
    ...(closedUpdateResult ? { reason: closedUpdateResult.reason ?? runOutcome.reason, after: closedUpdateResult.after } : {}),
    diagnostics: {
      steps: [...(closedUpdateResult?.steps ?? []), ...(recoveryObservation ? [recoveryObservation.step] : [])],
      recovery: closedUpdateResult?.recovery,
      verification: recoveryObservation?.verification ?? closedUpdateResult?.verification,
      ...(handoffFailure && runOutcome.status === "failed" ? { failure: { step: "managed-service-handoff", detail: handoffFailure, exitCode: 1 } } : {}),
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
      'import { readFileSync } from "node:fs"; import { pathToFileURL } from "node:url"; const [modulePath, runId, result, warnings, leaseRuntime, databaseIdentity, root, owner, helper] = JSON.parse(readFileSync(process.argv[1], "utf8")); const runtime = await import(pathToFileURL(modulePath).href); const { finishUpdateRun, recordUpdateRunDiagnostic, recordUpdateRunStep } = runtime.handoffLedger ?? runtime; const { createManagedHandoffLeaseStore } = await import(pathToFileURL(leaseRuntime).href); const store = createManagedHandoffLeaseStore({ databasePath: databaseIdentity.databasePath, existingIdentity: databaseIdentity }); const current = store.read(root); const lease = current.kind === "current" ? current.lease : null; if (!lease || lease.owner !== owner || lease.executor.pid !== process.pid || JSON.stringify(lease.helper) !== JSON.stringify(helper) || !(store.isProcessIdentityCurrent(lease.executor) || (process.connected && store.acceptParentBoundExecutor(lease)))) throw new Error("managed update terminal writer lost its current claim"); for (const [step, detail] of warnings) { try { if (recordUpdateRunDiagnostic) recordUpdateRunDiagnostic(runId, detail, undefined, step); else recordUpdateRunStep(runId, {step,status:"completed",detail,endedAtMs:Date.now()}); } catch {} } await finishUpdateRun(runId, result);',
      terminalPath], params.recoveryTimeoutMs);
    if (exit.signal || exit.code !== 0) throw new Error("recovery runtime could not finalize the update run");
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
    triageFailure = { ...triageFailure, reason: closedUpdateResult?.reason ?? "managed-service-handoff-failed" };
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
  handoffFailure = reason;
  reason = closedUpdateResult?.reason ?? reason;
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
      if (typeof restored === "boolean") {
        payload.stats.steps = [
          ...(payload.stats.steps || []),
          { name: "service-restore", command: params.serviceRecovery.kind,
            log: { exitCode: restored ? 0 : 1, ...(completedStatus && !restored ? { stderrTail: handoffFailure } : {}) } },
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

function stagedRuntimePath() {
  return path.join(params.cwd, "runtime", ${JSON.stringify(Q)});
}

function shouldRecoverInterruptedUpdater() {
  if (!params.runId || params.foregroundOrigin) return false;
  if (restorationArmed) return true;
  // An unreadable history must not bypass the existing failure handling below.
  try { return readGatewayStop()?.runId === params.runId; }
  catch (error) { appendLog("could not read update history for interrupted recovery: " + String(error)); return false; }
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

let installedRuntimeLedger;
function useInstalledRuntimeLedger() {
  installedRuntimeLedger ??= createInstalledRuntimeLedger(params.recoveryModulePath);
  runLedger = installedRuntimeLedger;
  return installedRuntimeLedger;
}

// The killed updater's candidate Doctor can advance the shared schema past this staged
// reader; only the installed candidate can then read or record this run's history.
function readUpdateHistory(readStaged, readInstalled) {
  try { return readStaged(); }
  catch (error) {
    if (!isSqliteSchemaVersionError(error)) throw error;
    appendLog("staged runtime cannot open the advanced state schema; using the installed runtime: " + String(error).split("\n")[0]);
    return readInstalled(useInstalledRuntimeLedger());
  }
}

function readGatewayStop() {
  // Only the installed-runtime ledger lists runs. The staged reader serves until the schema
  // advances; an older installed candidate may not export the listing.
  if (!runLedger?.listUpdateRuns) return readUpdateHistory(readManagedHandoffGatewayStop,
    (ledger) => findUpdateGatewayStop(ledger.listUpdateRuns({ limit: 100 })));
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
    const assertPendingStop = () => {
      assertCurrent();
      const stop = readGatewayStop();
      // A completed start retires this stop even if the helper originally parked it.
      if (stop?.runId !== params.runId || stop.started)
        throw new Error("Gateway stop intent was superseded by a later running service");
    };
    const updaterStopped = !restorationArmed;
    assertPendingStop();
    const recovered = await recoverInterruptedManagedUpdate({
      root: params.updateLeaseKey, runId: params.runId, owner: params.updateLeaseOwner,
      databaseIdentity: params.updateLeaseDatabaseIdentity, original: params.recovery,
      originalIdentity: originalInstallationIdentity, timeoutMs: params.recoveryTimeoutMs,
      assertCurrent,
      readRun: (runId) => readUpdateHistory(() => handoffLedger.getUpdateRun(runId),
        (ledger) => ledger.getUpdateRun(runId)),
      finalize: async () => {
        // The recovery owner verified the installed candidate before entering here.
        // Post-core work can advance its schema even when finalization fails.
        terminalRuntimePath = params.recoveryModulePath;
        useInstalledRuntimeLedger();
        const repair = await runOwnedUpdateCommand("repair", params.finalizeCommandArgv,
          params.recoveryTimeoutMs, params.cwd, { ...process.env, OPENCLAW_UPDATE_RUN_HANDOFF: "1" });
        let repaired;
        try { repaired = JSON.parse(repair.updaterOutput); } catch {}
        assertCurrent();
        if (repair.signal || repair.code !== 0 || repaired?.mode !== "finalize" ||
          !["ok", "warning"].includes(repaired.status)) {
          throw new Error("Interrupted update post-core repair did not complete");
        }
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
    runLedger.recordUpdateRunStep(params.runId, { step: "managed-service-handoff-recovery", status: "completed",
      detail: recovered.status === "succeeded" ? "Succeeded with recovery after the updater exited without a result." : "Cancelled activation; original Gateway restored.", endedAtMs: Date.now() });
    triageFailure = undefined;
    finalExitCode = recovered.status === "succeeded" ? 0 : 1;
  } catch (error) {
    const detail = String(error) + "; run openclaw update repair and openclaw gateway status --deep";
    appendLog(detail);
    runWarnings.set("warning:gateway-availability", detail);
    await recordUpdateHandoffOutcome(reason, false);
    if (runOutcome) runOutcome.nextAction = "openclaw update repair; openclaw gateway status --deep";
    finalExitCode = 1;
  }
}

`}));function packageMetadata(e,t){let n=JSON.parse(G.readFileSync(K.join(e,`package.json`),`utf8`));if(n.name!==t||typeof n.version!=`string`||!n.version)throw Error(`Managed handoff FreeBSD native runtime has invalid package metadata`);return{version:n.version,optionalDependencies:n.optionalDependencies}}function loadedNativeFile(e,t){let n=K.join(t,`proc-safe-native.node`);if(!G.lstatSync(n).isFile())throw Error(`Managed handoff FreeBSD native runtime requires regular package files`);let r=G.realpathSync(n),i=e.cache[r];if(!i?.loaded||i.filename!==r)throw Error(`Managed handoff could not identify the loaded FreeBSD native runtime`);return r}function runtimeFiles(e,t=`dist`){let n=K.join(e,t);if(!G.lstatSync(n).isDirectory())throw Error(`Managed handoff FreeBSD native runtime requires regular package directories`);return G.readdirSync(n).toSorted().flatMap(n=>{let r=K.join(t,n),i=G.lstatSync(K.join(e,r));if(i.isDirectory())return runtimeFiles(e,r);if(!i.isFile())throw Error(`Managed handoff FreeBSD native runtime requires regular package files`);return n.endsWith(`.js`)?[r]:[]})}function stageFreeBsdManagedHandoffNativeRuntime(e){if(process.platform!==`freebsd`)return[];if(process.arch!==`x64`&&process.arch!==`arm64`)throw Error(`Managed handoff requires a supported FreeBSD native architecture`);if(process.resourcesPath!==void 0)throw Error(`Managed handoff cannot use an external FreeBSD native resource path`);let t=W(import.meta.url),n=K.dirname(t.resolve(`@openclaw/proc-safe/package.json`)),r=t.resolve(`@openclaw/proc-safe/identity`);if(r!==K.join(n,`dist`,`identity.js`)||G.realpathSync(r)!==r)throw Error(`Managed handoff FreeBSD identity entry has an unexpected package path`);let i=[`package.json`,`LICENSE`,...runtimeFiles(n)];for(let e of i)if(!G.lstatSync(K.join(n,e)).isFile())throw Error(`Managed handoff FreeBSD native runtime requires regular package files`);let a=W(r),o=`@openclaw/proc-safe-freebsd-${process.arch}`,s=a.resolve(o),c=K.dirname(a.resolve(`${o}/package.json`));if(s!==K.join(c,`proc-safe-native.node`)||!G.lstatSync(s).isFile())throw Error(`Managed handoff FreeBSD native runtime has an unexpected package path`);let l=packageMetadata(n,`@openclaw/proc-safe`),u=packageMetadata(c,o);if(l.optionalDependencies?.[o]!==u.version)throw Error(`Managed handoff FreeBSD native runtime version does not match its package`);let d=a(r).readProcessIdentity(process.pid);if(d?.startTimeSinceBootMicros===void 0)throw Error(`Managed handoff could not read its FreeBSD process identity`);loadedNativeFile(a,c);let f=K.resolve(e,`runtime`,`node_modules`),p=[...i.map(e=>({source:K.join(n,e),destination:K.join(f,`@openclaw`,`proc-safe`,e)})),...[`package.json`,`proc-safe-native.node`].map(e=>({source:K.join(c,e),destination:K.join(f,o,e)}))].map(({source:e,destination:t})=>{if(!G.lstatSync(e).isFile())throw Error(`Managed handoff FreeBSD native runtime requires regular package files`);return G.mkdirSync(K.dirname(t),{recursive:!0,mode:448}),G.writeFileSync(t,G.readFileSync(e),{mode:384,flag:`wx`}),t}),m=K.join(f,`@openclaw`,`proc-safe`,`dist`,`identity.js`),h=W(m);if(h(m).readProcessIdentity(process.pid)?.startTimeSinceBootMicros!==d.startTimeSinceBootMicros||loadedNativeFile(h,K.join(f,o))!==G.realpathSync(K.join(f,o,`proc-safe-native.node`)))throw Error(`Managed handoff did not load its private FreeBSD native runtime`);return p}var tn=e((()=>{}));function stageManagedHandoffRuntime(e){let t=r(Zt);if(!t.pathname.endsWith(`.mjs`))throw Error(`Managed handoff requires its sealed runtime; use the repository test runner or the dist-backed pnpm openclaw CLI.`);let n=K.join(e,`runtime`,Q);G.mkdirSync(K.dirname(n),{recursive:!0,mode:448}),G.writeFileSync(n,G.readFileSync(t),{mode:384,flag:`wx`});let i=[n];if(process.platform===`win32`){let e=K.join(K.dirname(n),`windows-security-helper.exe`);G.writeFileSync(e,G.readFileSync(new URL(`./windows-security-helper.exe`,t)),{mode:448,flag:`wx`}),i.push(e)}return[...i,...stageFreeBsdManagedHandoffNativeRuntime(e)]}var nn=e((()=>{a(),tn(),Qt()}));function resolveManagedHandoffCommandEnv(e,t,n){let r={...e,...Ee(I(e)),[tt]:t,OPENCLAW_UPDATE_RUN_HANDOFF:`1`,...n?{[$e]:n}:{}};for(let e of Te)rn.has(e)||delete r[e];return pt({processEnv:r,invocationCwd:process.cwd()})}async function admitSystemdUpdate(e,t=process.env,n){let r=n===void 0?await We(t):n;if(r?.kind!==`system`&&r?.kind!==`dueling`)return;let i=r.system.unitName,a=`sudo systemctl restart ${k(i)}`,o=L(e);try{await J.access(o,J.constants.W_OK|J.constants.X_OK)}catch(e){let{uid:n}=await J.stat(o),r=V([process.execPath,K.join(o,`openclaw.mjs`),`update`,`--yes`,`--no-restart`],I(t),{env:t});throw new B(`managed-service-handoff-failed`,`System-scope Gateway package update cannot write its install root ${o}. Install as its owning account: sudo -u ${k(`#${n}`)} -- ${r}. Then run: ${a}`,{cause:e})}return`System-scope Gateway service ${i} requires an operator restart. Package updates do not stop or restart this service. After the update, run: ${a}`}function observeManagedServiceUpdateHandoffClose(e,t){let n=!1,r=createHandoffLineReader(e=>{e===`system-update-settled
`&&(n=!0)});return t.stdout.on(`data`,r),new Promise(i=>{t.once(`close`,()=>{t.stdout.off(`data`,r),e.settled=n&&t.exitCode!==null&&t.signalCode===null,i()})})}function resolveGatewayServiceRecovery(e,t){if(e===`systemd`)return{kind:`systemd`,unit:`${Me(t)}.service`};if(e===`launchd`){let e=Ve(t);return{kind:`launchd`,uid:typeof process.getuid==`function`?process.getuid():501,label:e,plistPath:Ue(t)}}if(e===`schtasks`)return{kind:`schtasks`,taskName:t.OPENCLAW_WINDOWS_TASK_NAME?.trim()||u(t.OPENCLAW_PROFILE)}}var rn,an,on=e((()=>{ht(),A(),ut(),mt(),d(),Be(),He(),Ge(),Ne(),De(),we(),nt(),R(),jt(),rn=/* @__PURE__ */ new Set([`OPENCLAW_LAUNCHD_LABEL`,`OPENCLAW_SYSTEMD_UNIT`,`OPENCLAW_WINDOWS_TASK_NAME`]),an=`system-update-settled
`}));async function assertManagedServiceUpdateHandoffRoot(e){let t=L(e.expectedRoot),n=e.executingRoot?L(e.executingRoot):null,r=n!==null&&L(e.root)===n;if(!(r&&t===n)){if(r&&e.postCore){let[e,r]=await Promise.all([ot(t),ot(n)]);if(e&&r&&e.ownerRoot===r.ownerRoot&&L(r.packageRoot)===n)return}throw Error(`Managed update handoff root mismatch: expected ${e.expectedRoot}, running from ${e.root}.`)}}var sn=e((()=>{st(),R()}));async function spawnManagedServiceUpdateHandoff(e,t,n){let r=e.parentPid??process.pid,a=e.env??process.env;if(e.foregroundOrigin){if(e.action||e.foregroundOrigin.pid!==r||r!==process.pid||e.meta.completionOwner!==`gateway-restart`)throw Error(`Foreground update requires the current Gateway's completion owner`);await assertForegroundUpdateOrigin(e.foregroundOrigin,!1,a)}let o=e.execPath??await resolveManagedHandoffNodeExecutable(a,e.supervisor),s=i(o),c=n.leaseDatabaseIdentity?.databasePath??ue(),l=n.leaseDatabaseIdentity??await he(c,()=>{n.requesterAuthority?.assertCurrent(),n.requesterAuthority?.signal?.throwIfAborted()});n.leaseDatabaseIdentity=l;let u=await de({databasePath:l.databasePath,existingIdentity:l,serviceManagerEnv:ce(a),onProcessIdentityWarning:yt(e.runId,a)});n.leaseStore=u;let d=u.processIdentity(r).startIdentity,f=await J.mkdtemp(K.join(bt.tmpdir(),le)),p=K.join(f,`handoff.cjs`),m=K.join(f,`handoff.json`),h=K.join(f,`handoff.env`),g=K.join(f,`sentinel-meta.json`),_=K.join(f,`update-failure.json`),v=I(a),y=K.join(v.stateDir,`logs`,`support`,`openclaw-update-failure-${q()}.json`),b=K.join(f,`handoff.log`),te={acceptCapabilities:e.acceptCapabilities,admission:e.admission,reapplyLocalOverrides:e.reapplyLocalOverrides,timeoutMs:e.timeoutMs,channel:e.channel,tag:e.tag},x={execPath:o,argv1:Oe(e.argv1??process.argv[1])},S=e.action?[e.action.nodeRunner,...i(e.action.nodeRunner),e.action.entrypoint,`triage`]:resolveUpdateCliArgv({...te,...x});n.operatorRestartWarning&&S.push(`--no-restart`);let C=e.action?`openclaw triage (automatic)`:formatManagedServiceUpdateCommand(te,e.env)+(n.operatorRestartWarning?` --no-restart`:``),w={version:1,meta:{...e.meta,...e.runId?{runId:e.runId}:{},root:t,triageContextPath:y,...e.foregroundOrigin?{foregroundOrigin:e.foregroundOrigin}:{}}},T=[...s,p,m],E;!e.foregroundOrigin&&e.supervisor===`systemd`&&!n.operatorRestartWarning&&(E=resolveSystemdHandoffLauncher({serviceEnv:a,handoffId:e.handoffId,triage:!!e.action,directory:f,environmentPath:h,executable:o,args:T}));let D=ie(a),{nodeExecArgv:ae,readyEnv:O}=prepareManagedHandoffCliRuntime(S,resolveManagedHandoffCommandEnv(a,g,w.meta.runId),o),k=e.devTarget?it(O,e.devTarget):O,A={...E&&!e.action?{environmentPath:h}:{},operatorRestartWarning:n.operatorRestartWarning,runId:w.meta.runId,beforePark:!!e.beforePark,requester:Ke(e.requester),serviceManagerEnv:ce(a),nodeExecArgv:ae,runtimeArgs:s,action:e.action?.kind??`update`,failure:e.action?.failure,scopeUnit:E?.unit,systemdRun:E?.command,parentPid:r,parentStartIdentity:d,parentExitTimeoutMs:n.parentExitTimeoutMs,restartDelayMs:Math.max(0,Math.min(6e4,e.restartDelayMs??0)),parentExitDeadlineAt:Date.now()+n.parentExitTimeoutMs,cwd:f,invocationCwd:e.invocationCwd,commandArgv:S,recoveryCommandArgv:resolveManagedServiceCliArgv(x,[`gateway`,`restart`,`--preserve-definition`,`--json`]),finalizeCommandArgv:resolveManagedServiceCliArgv(x,[`update`,`finalize`,`--yes`,`--json`]),recoveryTimeoutMs:n.recoveryTimeoutMs,triageCommandArgv:resolveManagedServiceCliArgv(x,[`triage`,`--json`,`--non-interactive`]),triageContextPath:y,triageInputPath:_,triageContextCommand:V([`openclaw`,`triage`,`--run`,`--update-result`,y],v,{env:a}),triageRecoveryCommand:V([`openclaw`,`triage`],v,{env:a}),triageHint:`Update triage runs after service recovery; see the managed update helper log for the outcome and the installation-specific openclaw triage command.`,commandLabel:C,handoffId:e.handoffId,nonFailureSkippedReasons:Object.keys(se),logPath:b,metaPath:g,stateDatabasePath:D,nodeSqliteLocation:oe(D),updateLeaseDatabasePath:l.databasePath,updateLeaseDatabaseIdentity:l,updateLeaseKey:t,updateLeaseOwner:e.handoffId,sensitivePaths:[p,m,h,g,_,K.join(f,`terminal-result.json`)],foregroundOrigin:e.foregroundOrigin,serviceRecovery:e.foregroundOrigin||n.operatorRestartWarning?void 0:resolveGatewayServiceRecovery(e.supervisor,a),recovery:await(await lt(t)?dt(t,n.recoveryTimeoutMs):at(t)),recoveryModulePath:K.join(t,`dist`,`cli`,`daemon-cli.js`)},j,M,onExit=()=>{n.exited=!0,n.releaseRequesterObserver?.()};try{if(A.environmentPath&&await writeSystemdHandoffEnvironment(A.environmentPath,k),A.sensitivePaths.push(...stageManagedHandoffRuntime(f)),await J.writeFile(p,`${un}\n`,{mode:448}),await J.writeFile(m,`${JSON.stringify(A,null,2)}\n`,{mode:384}),await J.writeFile(g,`${JSON.stringify(w,null,2)}\n`,{mode:384}),pe(l),n.requesterAuthority?.assertCurrent(),n.requesterAuthority?.signal?.throwIfAborted(),e.foregroundOrigin&&ne())throw new re;let r={cwd:f,env:k,detached:!0,stdio:[`pipe`,`pipe`,`ignore`]};j=E?xt(E.command,E.args,r):xt(o,T,r),n.launcher=j,n.closed=observeManagedServiceUpdateHandoffClose(n,j),j.stdin.on(`error`,()=>j.stdin.destroy()).once(`close`,()=>j.stdin.destroy()),j.pid||await Ct(j,`spawn`);try{n.launcherStartIdentity=j.pid?u.processIdentity(j.pid,j.spawnargs).startIdentity:null}catch(e){throw P(j),e}if(n.launcherStartIdentity==null)throw P(j),Error(`managed update handoff process start identity is unavailable`);if(j.once(`exit`,onExit),M=await waitForHandoffResponse(j,n.recoveryTimeoutMs),`${M}\n`!==$&&!M.startsWith(ln))throw Error(`managed update handoff returned an invalid readiness response`);if(`${M}\n`===$){let r=H(t);if(r?.owner!==e.handoffId||r.executor.pid!==r.helper.pid||r.executor.startIdentity!==r.helper.startIdentity||r.action.kind!==(e.action?.kind??`update`)||r.action.kind===`triage`&&(r.action.lifetime.kind!==`native`||r.action.lifetime.placement.kind!==`attached`||r.action.phase!==`reserved`)||!ee(r.executor.pid)||!u.isProcessIdentityCurrent(r.executor,r.executor.pid===j.pid&&j.exitCode===null&&j.signalCode===null))throw P(j),Error(`managed update handoff helper lease identity is unavailable`);n.helper=r}}catch(e){throw j?.removeListener(`exit`,onExit),j?.stdin.destroy(),j?.stdout.destroy(),await J.rm(f,{recursive:!0,force:!0}).catch(()=>{}),e}if(e.beforePark){let r=!1,i=e.requester?.authorizationSource?.startsWith(`profile:`)===!0,a={kind:`managed-update-handoff`,installRoot:t,handoffId:n.handoffId},isCurrentOwner=()=>{try{return currentManagedServiceUpdateHandoff(a)===n&&n.transferred&&!n.exited}catch{return!1}},isCurrent=()=>isCurrentOwner()&&!n.cancelling,o=createHandoffLineReader(e=>{if(e===`park-admitted
`&&i&&isCurrentOwner()){n.parkAdmitted=!0,n.releaseRequesterObserver?.(),n.parkReady=!0,n.closeForStop?.();return}e===`before-park
`&&!r&&isCurrent()&&(r=!0,(async()=>{n.requesterAuthority?.assertCurrent(),await n.beforePark?.(),n.requesterAuthority?.assertCurrent(),n.requesterAuthority?.signal?.throwIfAborted(),isCurrent()&&(i||(n.parkReady=!0,n.closeForStop?.()),j.stdin.write(`noticed
`))})().catch(()=>{isCurrent()&&j.stdin.write(`notice-failed
`)}))});j.stdout.on(`data`,o),j.once(`exit`,()=>j.stdout.off(`data`,o))}let N={command:C,logPath:b},F=M.slice(13).trim();return`${M}\n`===$?{...N,status:`started`,...j.pid?{pid:j.pid}:{},handoffId:e.handoffId,installRoot:t}:{...N,status:`joined`,message:describeManagedHandoffBlocker(t,F,u,a),...F?{handoffId:F}:{}}}async function startManagedServiceUpdateHandoff(e){if(e.requester?.authorizationSource?.startsWith(`profile:`)&&(!e.requesterAuthority||!e.beforePark))throw Error(`Profile update requires its original Gateway admission and park owner.`);if(e.requesterAuthority?.assertCurrent(),e.requesterAuthority?.signal?.throwIfAborted(),e.action&&e.supervisor!==`systemd`)throw Error(`Automatic managed triage requires a Linux user-systemd scope; run openclaw triage manually.`);if(!Number.isFinite(e.restartDrainTimeoutMs)||!Number.isFinite(e.restartDelayMs??0))throw Error(`managed update handoff requires a finite restart deadline`);let t=!e.foregroundOrigin&&e.supervisor===`systemd`?await admitSystemdUpdate(e.root,e.env):void 0;if(t&&e.action)throw Error(`Automatic managed triage requires a Linux user-systemd scope; run openclaw triage manually.`);let n=L(e.root),r=U.get(n),i;if(r?.exited&&r.transferred&&!r.cancelling){let e=r.leaseStore,t=e?.read(n);if(!e||!t||t.kind===`unreadable`)throw Error(`The previous managed update lease is unavailable; check it before retrying.`);t.kind===`current`&&!e.release(t.lease)&&(i=t.lease.owner)}if(r?.flight&&(!r.exited||r.cancelling||r.claimed&&!r.transferred||i)){let t=await r.flight,a=i??t.handoffId;return{status:`joined`,message:describeManagedHandoffBlocker(n,a,r.leaseStore,e.env??process.env,r.cancelling?`cancellation settlement is pending`:r.claimed&&!r.transferred?`the Gateway still holds an untransferred handoff claim`:`helper exit or settlement has not been confirmed`),command:t.command,logPath:t.logPath,...t.pid?{pid:t.pid}:{},...a?{handoffId:a}:{}}}if(e.foregroundOrigin&&ne())throw new re;let a={handoffId:e.handoffId??q(),operatorRestartWarning:t,recoveryTimeoutMs:e.recoveryTimeoutMs??e.timeoutMs??18e5,parentExitTimeoutMs:Math.min(2147483647,Math.max(0,e.restartDrainTimeoutMs)+cn),...e.beforePark?{beforePark:e.beforePark}:{},...e.requesterAuthority?{requesterAuthority:e.requesterAuthority}:{},...e.foregroundOrigin?{foregroundOrigin:{...e.foregroundOrigin}}:{},...r?.leaseDatabaseIdentity?{leaseDatabaseIdentity:r.leaseDatabaseIdentity}:{}};U.set(n,a);let o=a.requesterAuthority?.signal;if(o){let cancelRevokedRequester=()=>{a.flight?.then(async()=>{!a.parkAdmitted&&U.get(n)===a&&await cancelManagedServiceUpdateHandoff({kind:`managed-update-handoff`,handoffId:a.handoffId,installRoot:n})},()=>{})};o.addEventListener(`abort`,cancelRevokedRequester,{once:!0}),a.releaseRequesterObserver=()=>o.removeEventListener(`abort`,cancelRevokedRequester)}let s=Promise.resolve().then(()=>spawnManagedServiceUpdateHandoff({...e,handoffId:a.handoffId,meta:{...e.meta,handoffId:e.meta.handoffId??a.handoffId}},n,a));a.flight=s;try{return await s}catch(e){throw a.releaseRequesterObserver?.(),U.get(n)===a&&U.delete(n),e}}function claimManagedServiceUpdateHandoff(e){let t=currentManagedServiceUpdateHandoff(e);return!t||t.cancelling?!1:(t.claimed=!0,!0)}function currentManagedServiceUpdateHandoff(e){let t=L(e.installRoot),n=U.get(t),r=n?.launcher,i=n?.helper,a=H(t);if(e.kind===`managed-update-handoff`&&n?.handoffId===e.handoffId&&n.leaseStore&&r?.pid&&ee(r.pid)&&n.launcherStartIdentity!=null&&n.leaseStore.isProcessIdentityCurrent({pid:r.pid,startIdentity:n.launcherStartIdentity},r.exitCode===null&&r.signalCode===null)&&r.exitCode===null&&r.signalCode===null&&a?.owner===e.handoffId&&i?.owner===e.handoffId&&(n.transferred&&i.action.kind===`update`||a.executor.pid===i.executor.pid&&a.executor.startIdentity===i.executor.startIdentity)&&JSON.stringify(a.helper)===JSON.stringify(i.helper)&&JSON.stringify(a.action)===JSON.stringify(i.action)&&(a.action.kind!==`triage`||a.action.phase===`reserved`)&&ee(a.executor.pid)&&n.leaseStore.isProcessIdentityCurrent(a.executor,a.executor.pid===r.pid&&r.exitCode===null&&r.signalCode===null))return n}function hasForegroundUpdatePaths(e,t){return _(ie(t))===e.stateDatabasePath&&_(f(t,m(t)))===e.configPath}async function assertForegroundUpdateOrigin(e,t,n=process.env){let matchesOwner=()=>{if(!hasForegroundUpdatePaths(e,n))return!1;let r=ge({env:n,current:!0});return t?r===void 0:r?.mode===`foreground`&&r.state===`live`&&r.owner===e.owner&&r.pid===e.pid&&r.host===e.host&&r.startedAt===e.startedAt&&r.port===e.port};if(!matchesOwner())throw Error(`Foreground Gateway owner or paths changed`);let r=await Ce({env:n,requireInspection:!0});if(t?r!==void 0:r?.pid!==e.pid||r.startTime!==e.startedAt||r.port!==e.port)throw Error(`Foreground Gateway locks do not match its handoff phase`);if(t&&await ae(e.port)!==`free`)throw Error(`Foreground Gateway port is not verified free`);if(!matchesOwner())throw Error(`Foreground Gateway owner or paths changed during inspection`)}async function exchangeForegroundUpdateHandoff(e,t){let n=e.env??process.env,r=await et(n);if(r?.completionOwner!==`gateway-restart`||!r.foregroundOrigin||!hasForegroundUpdatePaths(r.foregroundOrigin,n)||!process.connected||!process.send||!await _t(e))return!1;let i=H(L(e.root)),a=q(),o=await new Promise(e=>{let finish=t=>{clearTimeout(n),process.off(`message`,onMessage).off(`disconnect`,onDisconnect),e(t)},onDisconnect=()=>finish(!1),onMessage=e=>{typeof e==`object`&&e&&`requestId`in e&&e.requestId===a&&finish(`type`in e&&e.type===t&&`version`in e&&e.version===2&&`ok`in e&&e.ok===!0)},n=setTimeout(()=>finish(!1),t===`foreground-park`?18e5:3e4);process.on(`message`,onMessage).once(`disconnect`,onDisconnect),process.send({type:t,version:2,requestId:a},e=>{e&&finish(!1)})}),s=H(L(e.root));return o&&s?.payload===i?.payload&&hasForegroundUpdatePaths(r.foregroundOrigin,n)&&await _t(e)}async function isCurrentForegroundUpdateHandoffProcess(e){return exchangeForegroundUpdateHandoff(e,`foreground-inspect`)}async function parkForegroundUpdateHandoff(e){if(!await exchangeForegroundUpdateHandoff({root:e.root,runId:e.run.runId,env:e.run.env},`foreground-park`))throw Error(`Foreground update helper could not verify Gateway closure`);e.run.gatewayRestartRequired=!0}function sendManagedServiceUpdateHandoffCommand(e,t){let n=U.get(L(e.installRoot)),r=n?.launcher;return!n||!r?.stdin||!r.stdout||r.stdin.destroyed?Promise.resolve(null):waitForHandoffResponse(r,t===`park`?n.parentExitTimeoutMs:n.recoveryTimeoutMs,t).catch(()=>null)}async function transferManagedServiceUpdateHandoff(e){let t=U.get(L(e.installRoot)),n=t?.launcher;return t?.foregroundOrigin&&ne()||!t||!n?.stdin||!n.stdout||!claimManagedServiceUpdateHandoff(e)?!1:(t.requesterAuthority?.assertCurrent(),t.requesterAuthority?.signal?.throwIfAborted(),t.transferred=!0,await sendManagedServiceUpdateHandoffCommand(e,`transfer`)===`transferred`?(n.unref(),unrefHandoffPipe(n.stdin),unrefHandoffPipe(n.stdout),!0):(t.transferred=!1,!1))}async function cancelManagedServiceUpdateHandoff(e){let t=L(e.installRoot),n=U.get(t);if(e.kind!==`managed-update-handoff`||n?.handoffId!==e.handoffId||!n.leaseStore||n.cancelling)return!1;n.cancelling=!0;try{let r=H(t);if(r?.action.kind===`triage`&&(r.owner!==n.handoffId||JSON.stringify(r.helper)!==JSON.stringify(n.helper?.helper)||JSON.stringify({...r.action,phase:`reserved`})!==JSON.stringify(n.helper?.action)||!n.leaseStore.stopNative(r)))return!1;let i=n.launcher;if(i&&!n.exited&&i.exitCode===null&&i.signalCode===null){let t=new Promise(e=>{i.once(`exit`,()=>e())}),r=await sendManagedServiceUpdateHandoffCommand(e,`cancel`);if(r===`restore-after-exit`)return`restart-after-exit`;if(r!==`cancelled`&&!n.exited&&!i.stdin.destroyed)return!1;await t}return H(t,n)!==null||U.get(t)!==n?!1:(U.delete(t),`restored-in-process`)}catch{return!1}finally{n.cancelling=!1,n.parkAdmitted&&n.closeForStop?.()}}var cn,$,ln,un,dn=e((()=>{ht(),p(),M(),N(),x(),te(),j(),E(),v(),Se(),_e(),De(),O(),ke(),D(),a(),nt(),rt(),st(),R(),fe(),Tt(),Et(),jt(),gt(),me(),Mt(),Pt(),It(),F(),Rt(),Jt(),Xt(),en(),Qt(),nn(),on(),qe(),vt(),ft(),ct(),sn(),cn=3e4,$=`OPENCLAW_UPDATE_HANDOFF_READY
`,ln=`HANDOFF_BUSY `,un=String.raw`
const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

${Nt}

const { OPENCLAW_STATE_SCHEMA_SQL, assertOpenClawStateWriteAllowed, prepareManagedHandoffLeaseStore, extractSqliteTableSchema, readRestartSentinelRowSync, writeRestartSentinelRowIfRevisionSync, resolveImmutableSqliteFileUri, resolveUpdateRestartNoticeMeta, shouldPublishUpdateRestartNotice, procCgroupMembershipMatches, handoffLedger, packageActivationIdentity, recoverInterruptedManagedUpdate, readManagedHandoffGatewayStop, findUpdateGatewayStop, isSqliteSchemaVersionError } =
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
${Ft}

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


${$t}

${wt}

${Lt}

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

const parseLaunchdPid = (stdout) => Number(/^\s*pid\s*=\s*([1-9]\d*)\s*$/im.exec(stdout)?.[1]);

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
    if (inspection.code !== 0 || parseLaunchdPid(inspection.stdout) !== params.parentPid) {
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

async function restoreGatewayService(reason, decision = params.recovery, childStatus, previousGeneration = false, updaterStopped = false, beforeStart = () => {}) {
  if (managedUpdateLease?.action.kind !== "update" || !ownsManagedUpdateLease()) return false;
  let expectedRevision;
  const record = (restored) => recordUpdateHandoffOutcome(
    restored ? reason : "managed-service-handoff-restore-failed", restored, childStatus, expectedRevision,
  );
  const refuse = (message) => {
    if (message) appendLog(message);
    record(false);
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
  const stop = params.runId ? readGatewayStop() : undefined;
  if ((stop?.runId === params.runId && stop?.started) || (updaterStopped && stop?.runId !== params.runId))
    return refuse("recovery refused: Gateway stop intent was superseded");
  if (childStatus) expectedRevision = recordUpdateHandoffOutcome(reason, undefined, childStatus);
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
    const target = "gui/" + recovery.uid + "/" + recovery.label;
    const deadline = Date.now() + params.recoveryTimeoutMs;
    const run = (args) => runOwned("launchctl", args, undefined, deadline);
    const before = await run(["print", target]);
    if (before.code === 0) {
      const pid = parseLaunchdPid(before.stdout);
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
      await sleep(Math.min(500, Math.max(0, deadline - Date.now())));
    }
    serviceRunning = restored;
    }
  } else if (recovery?.kind === "schtasks") {
    beforeStart();
    restored = (await runOwned("schtasks.exe", ["/Run", "/TN", recovery.taskName])).code === 0;
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
      fs.writeSync(1, ${JSON.stringify(kt)});
    });
    if (requiresRequesterAcknowledgement && notice !== "noticed")
      throw Object.assign(new Error("owner_required: original Gateway did not authorize parking"), { code: "owner_required" });
  }
  if (requiresRequesterAcknowledgement) {
    assertPreparedProfileRequester();
    assertGatewayParkOwner();
    const receipt = ${JSON.stringify(At)};
    if (fs.writeSync(1, receipt) !== Buffer.byteLength(receipt))
      throw new Error("Managed update park acceptance receipt was incomplete");
  } else {
    await assertUpdateRequester();
    assertGatewayParkOwner();
  }
  transferPrepared = true;
}

${Yt}

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


${Ot}

async function collectUpdateFailureTriage() {
  try {
    if (!triageFailure || !ownsManagedUpdateLease()) return;
    // Diagnostic reads share this boundary so they cannot bypass terminal cleanup.
    captureFailedUpdateResult();
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
    fs.writeSync(1, ${JSON.stringify(ln)} + (lease.owner || "") + "\n");
    await sleep(25);
    return;
  }
  let outcome = params.triageTransition ? "triage" : undefined;
  let wake;
  wakeTermination = () => wake?.();
  let deadlineExpired = false;
  const parentExitDeadline = setTimeout(() => {
    deadlineExpired = true;
    if (outcome !== "update" && outcome !== "triage") outcome = "restore";
    wake?.();
  }, params.parentExitTimeoutMs);
  try {
    if (params.action === "update" && params.runId) {
      // Refuse before ownership transfer when the installation it would update is incomplete.
      if (!fs.existsSync(params.recoveryModulePath)) throw new Error("installed runtime is unavailable: " + params.recoveryModulePath);
      // Bookkeeping, including lazy fs-safe loads, must survive a missing install.
      // Terminal writes prefer the fresh candidate after any schema migration.
      runLedger = handoffLedger;
      originalInstallationIdentity = packageActivationIdentity(params.updateLeaseKey, true);
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
    if (terminationRequested || updateCancelled) {
      if (restorationArmed) await restoreGatewayService("managed-service-handoff-cancelled");
      else recordUpdateHandoffOutcome("managed-service-handoff-cancelled");
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
      } else recordUpdateHandoffOutcome(reason);
      if (!updateCancelled) finalExitCode = 1;
      return;
    }
    const { updaterOutput, outputOverflow } = exit;
    // Only this invocation's direct child result carries the producer decision.
    // Success may change install roots; only recovery requires the original root.
    // Sentinels and diagnostic exports never authorize activation.
    let result = null;
    try { if (!outputOverflow) result = JSON.parse(updaterOutput); } catch {}
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
    if (childStatus) closedUpdateResult = result;
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
      appendLog("managed update reported unsafe recovery; keep the gateway stopped until the installation is repaired and update succeeds");
      recordUpdateHandoffOutcome("managed-service-handoff-unsafe-recovery");
      finalExitCode = exit.code;
    } else if (!resultRoot || result?.status !== "ok" ||
      exit.signal || exit.code !== 0) {
      let restored = !restorationArmed || (safe && recovery.service === "healthy");
      if (restorationArmed && safe && recovery.service === undefined) {
        restored = await restoreGatewayService(previousGeneration ? result.reason : "managed-service-handoff-failed", recovery, childStatus, previousGeneration);
      } else {
        if (restorationArmed && restored && triageFailure) triageFailure.restored = true;
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
      finalExitCode = previousGeneration && restored ? 1 : exit.code ||
        (childStatus === "skipped" && restored && !exit.signal && !reportedFailure ? 0 : 1);
    }
  } catch (err) {
    appendLog("handoff failed: " + (err && err.stack ? err.stack : String(err)));
    const reason = err?.code === "owner_required" ? "owner_required" : "managed-service-handoff-helper-failed";
    if (params.action === "update") runOutcome = { status: "failed", reason };
    if (hasManagedUpdateLease()) {
      if (params.action !== "triage") bindManagedUpdateLeaseToProcess(process.pid);
      if (restorationArmed && !updaterStarted) await restoreGatewayService(reason);
      else if (params.action === "update") recordUpdateHandoffOutcome(reason);
    }
    finalExitCode = 1;
  } finally {
    clearTimeout(parentExitDeadline);
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
    if (params.operatorRestartWarning) fs.writeSync(1, ${JSON.stringify(an)});
    if (foregroundClosed && parentIdentityCurrent())
      fs.writeSync(1, "foreground-settled:" + (foregroundRespawn ? "respawn" : "stopped") + "\n");
    process.stdin.destroy();
    process.exitCode = finalExitCode;
  }
})().catch((err) => {
  appendLog("handoff setup failed: " + (err && err.stack ? err.stack : String(err)));
  cleanupSensitiveFiles();
  stopTriageScope();
  process.stdin.destroy();
  process.exitCode = terminationRequested ? 143 : 1;
});
`}));export{isCurrentForegroundUpdateHandoffProcess as a,transferManagedServiceUpdateHandoff as c,admitSystemdUpdate as d,on as f,Et as h,dn as i,assertManagedServiceUpdateHandoffRoot as l,formatManagedServiceUpdateCommand as m,cancelManagedServiceUpdateHandoff as n,parkForegroundUpdateHandoff as o,buildManagedServiceHandoffUnavailableMessage as p,claimManagedServiceUpdateHandoff as r,startManagedServiceUpdateHandoff as s,assertForegroundUpdateOrigin as t,sn as u};