import{i as isPidAlive}from"./pid-alive-DDtSxW5l.mjs";import{n as monotonicNow,t as monotonicDeadlineAfter}from"./monotonic-time-DjtFTu2s.mjs";import{t as forceKillChildProcessTree}from"./child-process-tree-BCiPXVyu.mjs";import{r as scheduleAbsoluteDeadline}from"./absolute-deadline-CE14TWdo.mjs";import{t as createManagedHandoffLeaseStore}from"./update-managed-service-handoff-lease-BcBFm8dn.mjs";import{t as resolveUpdateInstallRoot}from"./update-install-root-B8m4gTPf.mjs";import{c as readControlPlaneUpdateSentinelMeta}from"./update-control-plane-sentinel-BQTicYS1.mjs";import{once}from"node:events";
//!src/infra/update-managed-service-handoff-control.ts
const HANDOFF_COMMAND_RUNNER_SCRIPT=String.raw`
const gateFs = process.getBuiltinModule("fs");
const gate = Buffer.alloc(2);
try {
  if (gateFs.readSync(4, gate) !== 2 || gate.toString() !== "go")
    throw new Error("Managed handoff admission was refused");
} finally { gateFs.closeSync(4); }
`;const HANDOFF_EXEC_RUNNER_SCRIPT=String.raw`
${HANDOFF_COMMAND_RUNNER_SCRIPT}
const { spawn } = require("node:child_process");
const argv = JSON.parse(process.argv[1]);
if (process.platform !== "win32" && typeof process.execve === "function")
  process.execve(argv[0], argv, process.env);
const child = spawn(argv[0], argv.slice(1), { env: process.env, stdio: "inherit" });
child.once("error", () => { process.exitCode = 1; });
child.once("exit", (code, signal) => {
  process.exitCode = typeof code === "number" ? code : signal ? 1 : 0;
});
`;const HANDOFF_OWNED_COMMAND_SCRIPT=String.raw`
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
            ${JSON.stringify(`data:text/javascript,${encodeURIComponent(HANDOFF_COMMAND_RUNNER_SCRIPT)}`)},
            ...commandArgv.slice(1),
          ]
        : ["-e", ${JSON.stringify(HANDOFF_EXEC_RUNNER_SCRIPT)}, JSON.stringify(commandArgv)],
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
`;const HANDOFF_NOTICE_MARKER=`before-park
`;const HANDOFF_PARK_ADMITTED_MARKER=`park-admitted
`;function createHandoffLineReader(e){let t=``;return n=>{t=`${t}${n.toString()}`.slice(-1024);let r;while((r=t.indexOf(`
`))>=0){const n=t.slice(0,r+1);t=t.slice(r+1);if(e(n)===false)return}}}async function resolveHandoffLauncherStartIdentity(e,t){if(!e.pid)await once(e,`spawn`);try{const n=e.pid?(await t.processIdentity(e.pid,e.spawnargs)).startIdentity:null;if(n===null)throw new Error(`managed update handoff process start identity is unavailable`);return n}catch(t){forceKillChildProcessTree(e);throw t}}function unrefHandoffPipe(e){if(`unref`in e&&typeof e.unref===`function`)e.unref()}function waitForHandoffResponse(e,t,n){return new Promise((r,i)=>{const a=e.stdout;const o=n===`closed`?`close`:`exit`;let s=false;let cancelTimeout=()=>{};const finish=t=>{if(s)return;s=true;cancelTimeout();e.removeListener(`error`,finish);e.removeListener(o,onExit);a.removeListener(`data`,c);a.removeListener(`error`,onOutputError);e.stdin.removeListener(`error`,finish).removeListener(`close`,onInputClose);if(t instanceof Error){if(!n)a.destroy();i(t)}else r(t)};const onExit=(e,t)=>{finish(/* @__PURE__ */ new Error(`managed update handoff exited before ${n?`responding`:`signaling readiness`} (code=${e??`null`}, signal=${t??`null`})`))};const onOutputError=t=>{if(!n&&e.pid)forceKillChildProcessTree(e);finish(t)};const onInputClose=()=>{if(n!==`closed`)finish(/* @__PURE__ */ new Error(`managed update handoff control input closed`))};const c=createHandoffLineReader(e=>{if(e!==`before-park
`&&e!==`park-admitted
`){finish(e.slice(0,-1));return false}});if(n!==`closed`)cancelTimeout=scheduleAbsoluteDeadline(monotonicDeadlineAfter(t),()=>{onOutputError(/* @__PURE__ */ new Error(`managed update handoff did not ${n?`respond`:`signal readiness`} within ${t/1e3} seconds`))},monotonicNow);if(s)return;e.once(`error`,finish).once(o,onExit);a.once(`error`,onOutputError).on(`data`,c);e.stdin.once(`error`,finish).once(`close`,onInputClose);if(n)e.stdin.write(`${n}\n`,e=>{if(e)finish(e)})})}
//!src/infra/update-managed-service-handoff-current.ts
const activeManagedServiceUpdateHandoffs=/* @__PURE__ */ new Map;function waitForSystemServiceUpdateHandoffs(){const e=[...activeManagedServiceUpdateHandoffs.values()].filter(e=>e.operatorRestartWarning&&!e.settled);if(!e.length)return;return(async()=>{await Promise.all(e.map(async e=>{await e.flight;await e.closed;if(!e.settled)throw new Error(`System-service updater settlement could not be confirmed.`)}))})()}async function isCurrentManagedServiceUpdateHandoffProcess(e){const t=e.env??process.env;if(t.OPENCLAW_UPDATE_RUN_HANDOFF!==`1`||!e.runId)return false;const n=await readControlPlaneUpdateSentinelMeta(t);const r=resolveUpdateInstallRoot(e.root);if(n?.runId!==e.runId||!n.handoffId||!n.root||resolveUpdateInstallRoot(n.root)!==r)return false;const i=await readManagedServiceUpdateHandoffLease(r,void 0,e.store);const a=e.store??createManagedHandoffLeaseStore();return i?.owner===n.handoffId&&i.executor.pid===process.pid&&(a.isProcessIdentityCurrent(i.executor)||process.connected&&a.acceptParentBoundExecutor(i))}async function readManagedServiceUpdateHandoffLease(e,t,n){const r=t??activeManagedServiceUpdateHandoffs.get(e);const i=n??(r?r.leaseStore:createManagedHandoffLeaseStore());const a=await i?.read(e);if(!i||a?.kind!==`current`)return a?.kind===`absent`?null:void 0;const o=a.lease;if(t?.handoffId===o.owner&&JSON.stringify(t.helper?.helper)===JSON.stringify(o.helper)&&(o.action.kind!==`update`||t.helper?.payload===o.payload)&&(o.action.kind!==`triage`||t.helper?.action.kind===`triage`&&JSON.stringify(t.helper.action.lifetime)===JSON.stringify(o.action.lifetime))&&await i.release(o))return null;return o}function isForegroundUpdateHandoff(e){const t=activeManagedServiceUpdateHandoffs.get(resolveUpdateInstallRoot(e.installRoot));return t?.handoffId===e.handoffId&&t.foregroundOrigin!==void 0}async function claimManagedServiceUpdateHandoff(e){const t=await currentManagedServiceUpdateHandoff(e);if(!t||t.cancelling)return false;t.claimed=true;return true}async function currentManagedServiceUpdateHandoff(e){const t=resolveUpdateInstallRoot(e.installRoot);const n=activeManagedServiceUpdateHandoffs.get(t);const r=n?.launcher;const i=n?.helper;if(!n)return;const a=await readManagedServiceUpdateHandoffLease(t);if(e.kind!==`managed-update-handoff`||n?.handoffId!==e.handoffId||!n.leaseStore||!r?.pid||!isPidAlive(r.pid)||n.launcherStartIdentity==null||!await n.leaseStore.isProcessIdentityCurrent({pid:r.pid,startIdentity:n.launcherStartIdentity},r.exitCode===null&&r.signalCode===null)||r.exitCode!==null||r.signalCode!==null||a?.owner!==e.handoffId||i?.owner!==e.handoffId||!(n.transferred&&i.action.kind===`update`)&&(a.executor.pid!==i.executor.pid||a.executor.startIdentity!==i.executor.startIdentity)||JSON.stringify(a.helper)!==JSON.stringify(i.helper)||JSON.stringify(a.action)!==JSON.stringify(i.action)||a.action.kind===`triage`&&a.action.phase!==`reserved`||!isPidAlive(a.executor.pid)||!await n.leaseStore.isProcessIdentityCurrent(a.executor,a.executor.pid===r.pid&&r.exitCode===null&&r.signalCode===null)||activeManagedServiceUpdateHandoffs.get(t)!==n||r.exitCode!==null||r.signalCode!==null)return;return n}function captureForegroundUpdateHandoffStop(e){const t=[...activeManagedServiceUpdateHandoffs].filter(([,e])=>e.foregroundOrigin?.pid===process.pid);if(!t.length)return;const canPark=e=>t.some(([t,n])=>n.parkReady&&n.handoffId===e.handoffId&&t===resolveUpdateInstallRoot(e.installRoot)&&activeManagedServiceUpdateHandoffs.get(t)===n&&!n.cancelling&&n.launcher?.exitCode===null&&n.launcher.signalCode===null);return{canPark,settle:async()=>{for(const[n,r]of t){const t={kind:`managed-update-handoff`,installRoot:n,handoffId:r.handoffId};r.closeForStop=()=>{if(canPark(t))e.onPark(t)};r.closeForStop()}if(!(await Promise.allSettled(t.map(async([e,t])=>{await t.flight?.catch(()=>{});await t.closed;const n=t.launcher;if(n&&(n.pid&&n.exitCode===null&&n.signalCode===null||await readManagedServiceUpdateHandoffLease(e,t)!==null))return false;if(!t.parkReady&&activeManagedServiceUpdateHandoffs.get(e)===t)activeManagedServiceUpdateHandoffs.delete(e);return true}))).every(e=>e.status===`fulfilled`&&e.value))return false;for(const[e,n]of t){if(activeManagedServiceUpdateHandoffs.get(e)!==n)await n.leaseStore?.close();delete n.closeForStop}return true}}}function sendManagedServiceUpdateHandoffCommand(e,t){const n=activeManagedServiceUpdateHandoffs.get(resolveUpdateInstallRoot(e.installRoot));const r=n?.launcher;if(!n||!r?.stdin||!r.stdout||r.stdin.destroyed)return Promise.resolve(null);return waitForHandoffResponse(r,t===`park`?n.parentExitTimeoutMs:n.recoveryTimeoutMs,t).catch(()=>null)}export{isCurrentManagedServiceUpdateHandoffProcess as a,sendManagedServiceUpdateHandoffCommand as c,HANDOFF_OWNED_COMMAND_SCRIPT as d,HANDOFF_PARK_ADMITTED_MARKER as f,waitForHandoffResponse as g,unrefHandoffPipe as h,currentManagedServiceUpdateHandoff as i,waitForSystemServiceUpdateHandoffs as l,resolveHandoffLauncherStartIdentity as m,captureForegroundUpdateHandoffStop as n,isForegroundUpdateHandoff as o,createHandoffLineReader as p,claimManagedServiceUpdateHandoff as r,readManagedServiceUpdateHandoffLease as s,activeManagedServiceUpdateHandoffs as t,HANDOFF_NOTICE_MARKER as u};