import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{n as t,r as n,t as r}from"./worker-chunk-BCTKPxQ7.mjs";import{a as i,i as a}from"./worker-chunk-BhqCEWRE.mjs";import{n as o,t as s}from"./worker-chunk-DbA7os8U.mjs";import{i as c,r as l}from"./worker-chunk-BCJHrUIV.mjs";import{n as u,t as d}from"./worker-chunk-DxpdEy4o.mjs";import{n as f,t as p}from"./worker-chunk-B1OqUdvQ.mjs";import{l as m,o as h}from"./worker-chunk-n2WvwZTY.mjs";import{once as g}from"node:events";function createHandoffLineReader(e){let t=``;return n=>{t=`${t}${n.toString()}`.slice(-1024);let r;for(;(r=t.indexOf(`
`))>=0;){let n=t.slice(0,r+1);if(t=t.slice(r+1),e(n)===!1)return}}}async function resolveHandoffLauncherStartIdentity(e,t){e.pid||await g(e,`spawn`);try{let n=e.pid?(await t.processIdentity(e.pid,e.spawnargs)).startIdentity:null;if(n===null)throw Error(`managed update handoff process start identity is unavailable`);return n}catch(t){throw s(e),t}}function unrefHandoffPipe(e){`unref`in e&&typeof e.unref==`function`&&e.unref()}function waitForHandoffResponse(e,r,i){return new Promise((a,o)=>{let l=e.stdout,u=i===`closed`?`close`:`exit`,d=!1,cancelTimeout=()=>{},finish=t=>{d||(d=!0,cancelTimeout(),e.removeListener(`error`,finish),e.removeListener(u,onExit),l.removeListener(`data`,f),l.removeListener(`error`,onOutputError),e.stdin.removeListener(`error`,finish).removeListener(`close`,onInputClose),t instanceof Error?(i||l.destroy(),o(t)):a(t))},onExit=(e,t)=>{finish(/* @__PURE__ */ Error(`managed update handoff exited before ${i?`responding`:`signaling readiness`} (code=${e??`null`}, signal=${t??`null`})`))},onOutputError=t=>{!i&&e.pid&&s(e),finish(t)},onInputClose=()=>{i!==`closed`&&finish(/* @__PURE__ */ Error(`managed update handoff control input closed`))},f=createHandoffLineReader(e=>{if(e!==`before-park
`&&e!==`park-admitted
`)return finish(e.slice(0,-1)),!1});i!==`closed`&&(cancelTimeout=c(t(r),()=>{onOutputError(/* @__PURE__ */ Error(`managed update handoff did not ${i?`respond`:`signal readiness`} within ${r/1e3} seconds`))},n)),!d&&(e.once(`error`,finish).once(u,onExit),l.once(`error`,onOutputError).on(`data`,f),e.stdin.once(`error`,finish).once(`close`,onInputClose),i&&e.stdin.write(`${i}\n`,e=>{e&&finish(e)}))})}var _,v,y,b,x,S=e((()=>{o(),r(),l(),_=String.raw`
const gateFs = process.getBuiltinModule("fs");
const gate = Buffer.alloc(2);
try {
  if (gateFs.readSync(4, gate) !== 2 || gate.toString() !== "go")
    throw new Error("Managed handoff admission was refused");
} finally { gateFs.closeSync(4); }
`,v=String.raw`
${_}
const { spawn } = require("node:child_process");
const argv = JSON.parse(process.argv[1]);
if (process.platform !== "win32" && typeof process.execve === "function")
  process.execve(argv[0], argv, process.env);
const child = spawn(argv[0], argv.slice(1), { env: process.env, stdio: "inherit" });
child.once("error", () => { process.exitCode = 1; });
child.once("exit", (code, signal) => {
  process.exitCode = typeof code === "number" ? code : signal ? 1 : 0;
});
`,y=String.raw`
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
            ${JSON.stringify(`data:text/javascript,${encodeURIComponent(_)}`)},
            ...commandArgv.slice(1),
          ]
        : ["-e", ${JSON.stringify(v)}, JSON.stringify(commandArgv)],
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
`,b=`before-park
`,x=`park-admitted
`}));async function isCurrentManagedServiceUpdateHandoffProcess(e){let t=e.env??process.env;if(t.OPENCLAW_UPDATE_RUN_HANDOFF!==`1`||!e.runId)return!1;let n=await m(t),r=f(e.root);if(n?.runId!==e.runId||!n.handoffId||!n.root||f(n.root)!==r)return!1;let i=await readManagedServiceUpdateHandoffLease(r,void 0,e.store),a=e.store??d();return i?.owner===n.handoffId&&i.executor.pid===process.pid&&(a.isProcessIdentityCurrent(i.executor)||process.connected&&a.acceptParentBoundExecutor(i))}async function readManagedServiceUpdateHandoffLease(e,t,n){let r=t??C.get(e),i=n??(r?r.leaseStore:d()),a=await i?.read(e);if(!i||a?.kind!==`current`)return a?.kind===`absent`?null:void 0;let o=a.lease;return t?.handoffId===o.owner&&JSON.stringify(t.helper?.helper)===JSON.stringify(o.helper)&&(o.action.kind!==`update`||t.helper?.payload===o.payload)&&(o.action.kind!==`triage`||t.helper?.action.kind===`triage`&&JSON.stringify(t.helper.action.lifetime)===JSON.stringify(o.action.lifetime))&&await i.release(o)?null:o}async function claimManagedServiceUpdateHandoff(e){let t=await currentManagedServiceUpdateHandoff(e);return!t||t.cancelling?!1:(t.claimed=!0,!0)}async function currentManagedServiceUpdateHandoff(e){let t=f(e.installRoot),n=C.get(t),r=n?.launcher,a=n?.helper;if(!n)return;let o=await readManagedServiceUpdateHandoffLease(t);if(e.kind===`managed-update-handoff`&&n?.handoffId===e.handoffId&&n.leaseStore&&r?.pid&&i(r.pid)&&n.launcherStartIdentity!=null&&await n.leaseStore.isProcessIdentityCurrent({pid:r.pid,startIdentity:n.launcherStartIdentity},r.exitCode===null&&r.signalCode===null)&&r.exitCode===null&&r.signalCode===null&&o?.owner===e.handoffId&&a?.owner===e.handoffId&&(n.transferred&&a.action.kind===`update`||o.executor.pid===a.executor.pid&&o.executor.startIdentity===a.executor.startIdentity)&&JSON.stringify(o.helper)===JSON.stringify(a.helper)&&JSON.stringify(o.action)===JSON.stringify(a.action)&&(o.action.kind!==`triage`||o.action.phase===`reserved`)&&i(o.executor.pid)&&await n.leaseStore.isProcessIdentityCurrent(o.executor,o.executor.pid===r.pid&&r.exitCode===null&&r.signalCode===null)&&C.get(t)===n&&r.exitCode===null&&r.signalCode===null)return n}function sendManagedServiceUpdateHandoffCommand(e,t){let n=C.get(f(e.installRoot)),r=n?.launcher;return!n||!r?.stdin||!r.stdout||r.stdin.destroyed?Promise.resolve(null):waitForHandoffResponse(r,t===`park`?n.parentExitTimeoutMs:n.recoveryTimeoutMs,t).catch(()=>null)}var C,w=e((()=>{a(),h(),p(),S(),u(),C=/* @__PURE__ */ new Map}));export{isCurrentManagedServiceUpdateHandoffProcess as a,b as c,createHandoffLineReader as d,S as f,waitForHandoffResponse as h,w as i,y as l,unrefHandoffPipe as m,claimManagedServiceUpdateHandoff as n,readManagedServiceUpdateHandoffLease as o,resolveHandoffLauncherStartIdentity as p,currentManagedServiceUpdateHandoff as r,sendManagedServiceUpdateHandoffCommand as s,C as t,x as u};