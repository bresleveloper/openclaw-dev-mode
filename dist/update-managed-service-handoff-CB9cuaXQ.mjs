import { n as isNodeRuntime } from "./runtime-binary-GM6c0Hou.mjs";
import { g as resolveGatewayWindowsTaskName } from "./constants-BLghGsId.mjs";
import { t as buildCliRespawnPlan } from "./entry.respawn-Cmajum_1.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { m as resolveConfigPath } from "./paths-orClZ-2Z.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { i as resolveRuntimeWorkerUrl, t as resolveRuntimeArgs } from "./runtime-worker-url-CvMrvFI1.mjs";
import { r as resolveOpenClawCliEntryPath } from "./openclaw-cli-invocation-DF2fY0bT.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { i as isPidAlive } from "./pid-alive-dd7OR8F6.mjs";
import { s as resolveNodeSqliteLocation } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as resolveExecutableFromPathEnv, n as isExecutableFile, o as resolveExecutablePath } from "./executable-path-hXcbMo0b.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { p as isGatewayRestartDraining, t as GatewayDrainingError } from "./gateway-work-admission-FWbk4b3p.mjs";
import { r as scheduleAbsoluteDeadline } from "./absolute-deadline-DaL1xmcH.mjs";
import { t as SKIPPED_UPDATE_OUTCOMES } from "./update-outcome-DLbo5ecI.mjs";
import { t as resolveServiceManagerEnv } from "./service-process-env-BITMm5ft.mjs";
import { t as forceKillChildProcessTree } from "./child-process-tree-D-7VKvs_.mjs";
import { a as MANAGED_SERVICE_UPDATE_HANDOFF_TEMP_PREFIX, n as prepareManagedHandoffLeaseStore, r as resolveManagedUpdateLeaseDatabasePath } from "./update-managed-service-handoff-lease-CPNRSilB.mjs";
import { l as prepareManagedHandoffLeaseDatabaseIdentity, n as assertManagedUpdateLeaseDatabaseIdentity } from "./update-managed-service-handoff-database-DQAEU12_.mjs";
import { r as readGatewayOwnerLease } from "./gateway-owner-lease-KxvFWleW.mjs";
import { E as serializeSystemdEnvironmentFile, c as resolveSystemdServiceName } from "./systemd-service-files-C3V-PDoO.mjs";
import { o as readActiveGatewayLockIdentity } from "./gateway-lock-OT1e72lx.mjs";
import { n as probePortUsage } from "./ports-probe-FuJ7VYyD.mjs";
import { t as SCHTASKS_TIMEOUT_MS } from "./schtasks-budget-TJJW76pm.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-DxyNaz_g.mjs";
import { l as resolveLaunchAgentPlistPath } from "./launchd-service-files-CqGEulnB.mjs";
import { t as applyDevUpdateTargetEnv } from "./update-dev-target-yMMMhCo4.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-Nv-hNWki.mjs";
import { b as UpdatePreMutationError, h as verifyPackageUpdateRecovery, p as resolvePnpmGlobalInstallOwner } from "./update-global-BlXQRfes.mjs";
import { d as looksLikeGitCheckout } from "./update-check-hpRujh0z.mjs";
import { i as resolveInstallationTarget, r as installationTargetEnv } from "./installation-target-context-B9ZDUs_O.mjs";
import { o as resolveManagedUpdateRequester } from "./update-requester-authority-BP771TSP.mjs";
import { d as resolveSystemNodeInfo, o as resolveNodeRuntimeInfo } from "./runtime-paths-v6m7qRRF.mjs";
import { c as readControlPlaneUpdateSentinelMeta, i as UPDATE_RUN_ID_ENV, n as CONTROL_PLANE_UPDATE_SENTINEL_META_ENV } from "./update-control-plane-sentinel-BOyIUo0V.mjs";
import "./shared-DRiGAorf.mjs";
import { a as findSystemdGatewayInstallation } from "./systemd-scope-CccFXVqT.mjs";
import { t as SUPERVISOR_HINT_ENV_VARS } from "./supervisor-markers-D4rfU3wJ.mjs";
import { n as isCurrentManagedServiceUpdateHandoffProcess, r as readManagedServiceUpdateHandoffLease, t as activeManagedServiceUpdateHandoffs } from "./update-managed-service-handoff-current-DZkgiu_S.mjs";
import { t as formatInstallationTargetCommand } from "./installation-target-format-CiRghKkr.mjs";
import { s as resolveUpdatedInstallCommandEnv } from "./update-command-service-env-Bq_QrqHd.mjs";
import { n as createUpdateRunProcessIdentityWarning } from "./update-run-write.async-c2y7GgO-.mjs";
import { t as readCurrentGitUpdateRecovery } from "./update-runner-git-recovery-BaoznbwZ.mjs";
import { createRequire } from "node:module";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { escape } from "minimatch";
//#region src/infra/update-managed-service-handoff-control.ts
const HANDOFF_COMMAND_RUNNER_SCRIPT = String.raw`
const gateFs = process.getBuiltinModule("fs");
const gate = Buffer.alloc(2);
try {
  if (gateFs.readSync(4, gate) !== 2 || gate.toString() !== "go")
    throw new Error("Managed handoff admission was refused");
} finally { gateFs.closeSync(4); }
`;
const HANDOFF_EXEC_RUNNER_SCRIPT = String.raw`
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
`;
const HANDOFF_OWNED_COMMAND_SCRIPT = String.raw`
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
`;
const HANDOFF_NOTICE_MARKER = "before-park\n";
const HANDOFF_PARK_ADMITTED_MARKER = "park-admitted\n";
function createHandoffLineReader(onLine) {
	let buffered = "";
	return (chunk) => {
		buffered = `${buffered}${chunk.toString()}`.slice(-1024);
		let newline;
		while ((newline = buffered.indexOf("\n")) >= 0) {
			const line = buffered.slice(0, newline + 1);
			buffered = buffered.slice(newline + 1);
			if (onLine(line) === false) return;
		}
	};
}
function unrefHandoffPipe(pipe) {
	if ("unref" in pipe && typeof pipe.unref === "function") pipe.unref();
}
function waitForHandoffResponse(child, timeoutMs, command) {
	return new Promise((resolve, reject) => {
		const output = child.stdout;
		const exitEvent = command === "closed" ? "close" : "exit";
		let settled = false;
		let cancelTimeout = () => {};
		const finish = (result) => {
			if (settled) return;
			settled = true;
			cancelTimeout();
			child.removeListener("error", finish);
			child.removeListener(exitEvent, onExit);
			output.removeListener("data", onData);
			output.removeListener("error", onOutputError);
			child.stdin.removeListener("error", finish).removeListener("close", onInputClose);
			if (result instanceof Error) {
				if (!command) output.destroy();
				reject(result);
			} else resolve(result);
		};
		const onExit = (code, signal) => {
			finish(/* @__PURE__ */ new Error(`managed update handoff exited before ${command ? "responding" : "signaling readiness"} (code=${code ?? "null"}, signal=${signal ?? "null"})`));
		};
		const onOutputError = (err) => {
			if (!command && child.pid) forceKillChildProcessTree(child);
			finish(err);
		};
		const onInputClose = () => {
			if (command !== "closed") finish(/* @__PURE__ */ new Error("managed update handoff control input closed"));
		};
		const onData = createHandoffLineReader((line) => {
			if (line !== "before-park\n" && line !== "park-admitted\n") {
				finish(line.slice(0, -1));
				return false;
			}
		});
		if (command !== "closed") cancelTimeout = scheduleAbsoluteDeadline(Date.now() + timeoutMs, () => {
			onOutputError(/* @__PURE__ */ new Error(`managed update handoff did not ${command ? "respond" : "signal readiness"} within ${timeoutMs / 1e3} seconds`));
		});
		if (settled) return;
		child.once("error", finish).once(exitEvent, onExit);
		output.once("error", onOutputError).on("data", onData);
		child.stdin.once("error", finish).once("close", onInputClose);
		if (command) child.stdin.write(`${command}\n`, (error) => {
			if (error) finish(error);
		});
	});
}
//#endregion
//#region src/infra/update-managed-service-handoff-service.ts
const SERVICE_IDENTITY_ENV_VARS = /* @__PURE__ */ new Set([
	"OPENCLAW_LAUNCHD_LABEL",
	"OPENCLAW_SYSTEMD_UNIT",
	"OPENCLAW_WINDOWS_TASK_NAME"
]);
function resolveManagedHandoffCommandEnv(serviceEnv, metaPath, runId) {
	const childEnv = {
		...serviceEnv,
		...installationTargetEnv(resolveInstallationTarget(serviceEnv)),
		[CONTROL_PLANE_UPDATE_SENTINEL_META_ENV]: metaPath,
		OPENCLAW_UPDATE_RUN_HANDOFF: "1",
		...runId ? { [UPDATE_RUN_ID_ENV]: runId } : {}
	};
	for (const key of SUPERVISOR_HINT_ENV_VARS) if (!SERVICE_IDENTITY_ENV_VARS.has(key)) delete childEnv[key];
	return resolveUpdatedInstallCommandEnv({
		processEnv: childEnv,
		invocationCwd: process.cwd()
	});
}
/** Package ownership permits installation, not control of an operator's system unit. */
async function admitSystemdUpdate(root, env = process.env, installation) {
	const installed = installation === void 0 ? await findSystemdGatewayInstallation(env) : installation;
	if (installed?.kind !== "system" && installed?.kind !== "dueling") return;
	const unit = installed.system.unitName;
	const restartCommand = `sudo systemctl restart ${quoteCliArg(unit)}`;
	const installRoot = resolveUpdateInstallRoot(root);
	try {
		await fs$1.access(installRoot, fs$1.constants.W_OK | fs$1.constants.X_OK);
	} catch (cause) {
		const { uid } = await fs$1.stat(installRoot);
		const updateCommand = formatInstallationTargetCommand([
			process.execPath,
			path.join(installRoot, "openclaw.mjs"),
			"update",
			"--yes",
			"--no-restart"
		], resolveInstallationTarget(env), { env });
		throw new UpdatePreMutationError("managed-service-handoff-failed", `System-scope Gateway package update cannot write its install root ${installRoot}. Install as its owning account: sudo -u ${quoteCliArg(`#${uid}`)} -- ${updateCommand}. Then run: ${restartCommand}`, { cause });
	}
	return `System-scope Gateway service ${unit} requires an operator restart. Package updates do not stop or restart this service. After the update, run: ${restartCommand}`;
}
const SYSTEM_SERVICE_UPDATE_SETTLED_MARKER = "system-update-settled\n";
/** Helper exit alone cannot prove that its detached updater has stopped. */
function observeManagedServiceUpdateHandoffClose(owner, child) {
	let cleanupSettled = false;
	const onData = createHandoffLineReader((line) => {
		if (line === "system-update-settled\n") cleanupSettled = true;
	});
	child.stdout.on("data", onData);
	return new Promise((resolve) => {
		child.once("close", () => {
			child.stdout.off("data", onData);
			owner.settled = cleanupSettled && child.exitCode !== null && child.signalCode === null;
			resolve();
		});
	});
}
function resolveGatewayServiceRecovery(supervisor, env) {
	if (supervisor === "systemd") return {
		kind: "systemd",
		unit: `${resolveSystemdServiceName(env)}.service`
	};
	if (supervisor === "launchd") {
		const label = resolveLaunchAgentLabel(env);
		return {
			kind: "launchd",
			uid: typeof process.getuid === "function" ? process.getuid() : 501,
			label,
			plistPath: resolveLaunchAgentPlistPath(env)
		};
	}
	if (supervisor === "schtasks") return {
		kind: "schtasks",
		taskName: env.OPENCLAW_WINDOWS_TASK_NAME?.trim() || resolveGatewayWindowsTaskName(env.OPENCLAW_PROFILE)
	};
}
//#endregion
//#region src/infra/update-managed-service-handoff-command-source.ts
const MANAGED_HANDOFF_COMMAND_SOURCE = String.raw`
function runServiceCommand(command, args, onSpawn, deadline, timeoutCap) {
  if (!hasManagedUpdateLease()) return Promise.resolve({ code: 1, stdout: "", stderr: "" });
  return new Promise((resolve) => {
    const remaining = deadline === undefined ? params.recoveryTimeoutMs : deadline - Date.now();
    if (remaining <= 0) return resolve({ code: 1, stdout: "", stderr: "" });
    const scheduledTask = command === "schtasks.exe";
    const timeoutMs = Math.min(timeoutCap ?? remaining, remaining,
      scheduledTask ? ${SCHTASKS_TIMEOUT_MS} : Infinity);
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
`.trim();
//#endregion
//#region src/infra/update-managed-service-handoff-command.ts
function resolveUpdateCliArgv(params) {
	return resolveManagedServiceCliArgv(params, [
		"update",
		"--yes",
		"--json",
		...params.reapplyLocalOverrides ? ["--reapply-local-overrides"] : [],
		...params.acceptCapabilities ? ["--accept-capabilities"] : [],
		...params.admission ? ["--admission", params.admission] : [],
		...params.channel ? ["--channel", params.channel] : [],
		...params.tag ? ["--tag", params.tag] : [],
		...typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs) ? ["--timeout", String(Math.max(1, Math.ceil(params.timeoutMs / 1e3)))] : []
	]);
}
function resolveManagedServiceCliArgv(params, args) {
	const execPath = params.execPath?.trim();
	const argv1 = params.argv1?.trim();
	if (execPath && argv1) return [
		execPath,
		...resolveRuntimeArgs(execPath),
		argv1,
		...args
	];
	if (execPath && !/^(?:node|bun)(?:\.exe)?$/iu.test(path.basename(execPath))) return [execPath, ...args];
	return ["openclaw", ...args];
}
function formatManagedServiceUpdateCommand(params, env = process.env) {
	return formatCliCommand(resolveUpdateCliArgv(params ?? {}).toSpliced(3, 1).join(" "), env);
}
function buildManagedServiceHandoffUnavailableMessage(command) {
	return ["OpenClaw updates cannot safely run inside the live gateway process without a managed-service handoff.", `Stop the foreground Gateway, run \`${command}\` from a shell, then launch the Gateway again. For a managed deployment, use its host's stop, update, and restart workflow.`].join("\n");
}
//#endregion
//#region src/infra/update-managed-service-handoff-diagnostics.ts
/** A busy lease is custody, not proof that its updater is still running. */
function describeManagedHandoffBlocker(root, owner, store, env, pending = "handoff settlement is pending") {
	let detail = pending;
	const guidance = `Check \`${formatCliCommand("openclaw update status", env)}\`. If the updater has exited, run \`${formatCliCommand("openclaw update repair", env)}\` from a terminal outside the Gateway; repair verifies owners and children before releasing custody. Do not delete the update lock.`;
	try {
		const held = store?.read(root);
		if (store && held?.kind === "current") {
			const lease = held.lease;
			const custody = lease.version === 4 ? "cancelled update custody" : lease.version === 3 ? "retained native custody" : lease.action.kind === "triage" ? `triage/repair lease (${lease.action.phase})` : "update lease";
			const identity = (role) => {
				const status = store.inspectProcessIdentity(lease[role]);
				const stateLabel = status === "mismatch" ? "identity changed" : status === "unknown" ? "unverified" : status;
				return `${role} PID ${lease[role].pid} (${stateLabel})`;
			};
			return `Update blocked by ${custody}: owner ${lease.owner}, lease version ${lease.version}, ${identity("helper")}, ${identity("executor")}, last activity ${new Date(lease.updatedAt).toISOString()}. ${guidance}`;
		}
		if (held?.kind === "unreadable") detail = "the retained lease could not be read; its custody is unverified";
	} catch {
		detail = "the retained lease or its process identities could not be verified";
	}
	return `Update blocked by managed handoff ${owner || "(owner unavailable)"}: ${detail}. ${guidance}`;
}
//#endregion
//#region src/infra/update-managed-service-handoff-launcher.ts
const MANAGED_HANDOFF_BOOTSTRAP_SOURCE = String.raw`
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
`;
function resolveSystemdHandoffLauncher(params) {
	const systemdRun = resolveExecutableFromPathEnv("systemd-run", [
		params.serviceEnv.PATH ?? "",
		"/usr/bin",
		"/bin"
	].join(path.delimiter), params.serviceEnv);
	if (!systemdRun) throw new Error("systemd-run is required to launch a transient user unit");
	const suffix = params.handoffId.trim().replace(/[^A-Za-z0-9_.:@-]+/gu, "-").replace(/^-+|-+$/gu, "").slice(0, 80) || `${process.pid}-${Date.now()}`;
	const unit = `openclaw-${params.triage ? "triage" : "update"}-${suffix}.${params.triage ? "scope" : "service"}`;
	return {
		command: systemdRun,
		unit,
		args: [
			"--user",
			...params.triage ? ["--scope"] : [
				"--pipe",
				"--wait",
				"--service-type=exec",
				"--slice=app-openclaw-update.slice",
				"--property=KillMode=control-group",
				"--property=OOMPolicy=stop",
				`--property=EnvironmentFile=${escape(params.environmentPath)}`,
				`--working-directory=${params.directory}`
			],
			"--collect",
			`--unit=${unit}`,
			...params.triage ? [`--property=PartOf=${resolveSystemdServiceName(params.serviceEnv)}.service`] : [],
			params.executable,
			...params.args
		]
	};
}
/** Transfer exact prepared bytes without exposing values in the launcher argv. */
async function writeSystemdHandoffEnvironment(environmentPath, env) {
	const environment = {};
	for (const [key, value] of Object.entries(env)) if (value !== void 0) environment[key] = value;
	await fs$1.writeFile(environmentPath, serializeSystemdEnvironmentFile(environment), {
		mode: 384,
		flag: "wx"
	});
}
//#endregion
//#region src/infra/update-managed-service-handoff-lease-source.ts
const MANAGED_HANDOFF_LEASE_SOURCE = String.raw`
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
`.trim();
//#endregion
//#region src/infra/update-managed-service-handoff-native-scope-source.ts
const MANAGED_HANDOFF_NATIVE_SCOPE_SOURCE = String.raw`
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
`.trim();
//#endregion
//#region src/infra/update-managed-service-handoff-node.ts
const RUNTIME_RECOVERY_ACTION = "Inspect the service with `openclaw gateway status --deep` and refresh its definition under the installation owner (for a standard OpenClaw-managed service: `openclaw gateway install --force`). Then retry the update. The serving Gateway has not been stopped.";
var ManagedHandoffNodeUnavailableError = class extends UpdatePreMutationError {
	constructor() {
		super("managed-service-handoff-failed", `The Gateway's Node executable ${JSON.stringify(process.execPath)} was removed and no compatible replacement was found. Install a supported Node. ${RUNTIME_RECOVERY_ACTION}`);
		this.name = "ManagedHandoffNodeUnavailableError";
	}
};
var ManagedHandoffServiceRuntimeUnavailableError = class extends UpdatePreMutationError {
	constructor(executable) {
		super("managed-service-handoff-failed", `The Gateway's service executable ${JSON.stringify(executable)} is unavailable. ${RUNTIME_RECOVERY_ACTION}`);
		this.name = "ManagedHandoffServiceRuntimeUnavailableError";
	}
};
async function assertManagedHandoffServiceRuntime(supervisor, env) {
	if (!supervisor) return;
	let command;
	try {
		command = supervisor === "launchd" ? await (await import("./launchd-runtime-CtuuDmHV.mjs")).readLaunchAgentProgramArguments(env, { requireEffective: true }) : supervisor === "systemd" ? await (await import("./systemd-service-files-DZAbOu3X.mjs")).readSystemdServiceExecStart(env, { requireEffective: true }) : await (await import("./schtasks-layout--g0T4eah.mjs")).readScheduledTaskCommand(env, { requireEffective: true });
	} catch (error) {
		console.warn(`[update] Could not inspect the managed service: ${String(error)}`);
		command = null;
	}
	const args = command?.programArguments ?? [];
	const executable = args[0];
	const gatewayIndex = args.indexOf("gateway");
	const entrypoint = args[gatewayIndex - 1];
	if (!executable || !isNodeRuntime(executable) || gatewayIndex < 2 || !entrypoint || !path.isAbsolute(entrypoint) || !/\.(?:[cm]?js|ts)$/iu.test(entrypoint)) throw new UpdatePreMutationError("managed-service-handoff-failed", `The Gateway's saved Node executable ${JSON.stringify(process.execPath)} is unavailable. Automatic runtime replacement requires a directly launched Node service; wrapper recovery requires its installation owner to repair the wrapper's runtime first. ${RUNTIME_RECOVERY_ACTION}`);
	const serviceNode = resolveExecutablePath(executable, {
		env,
		useCache: false
	});
	if (serviceNode && (await resolveNodeRuntimeInfo(serviceNode, env)).status !== "supported") throw new ManagedHandoffServiceRuntimeUnavailableError(serviceNode);
	return serviceNode;
}
/** The original Gateway executable may disappear while its process stays alive. */
async function resolveManagedHandoffNodeExecutable(env, supervisor) {
	if (isExecutableFile(process.execPath, { env })) return process.execPath;
	const serviceNode = await assertManagedHandoffServiceRuntime(supervisor, env);
	if (serviceNode) return serviceNode;
	const systemNode = await resolveSystemNodeInfo({ env });
	if (systemNode?.status === "supported" && systemNode.path) return systemNode.path;
	for (const directory of (env.PATH ?? "").split(path.delimiter).filter(path.isAbsolute)) {
		const pathNode = resolveExecutableFromPathEnv("node", directory, env, { useCache: false });
		if (pathNode && (await resolveNodeRuntimeInfo(pathNode, env)).status === "supported") return pathNode;
	}
	throw new ManagedHandoffNodeUnavailableError();
}
/** Keep the update CLI on the selected handoff runtime and preserve startup flags. */
function prepareManagedHandoffCliRuntime(commandArgv, env, handoffNodeExecutable) {
	const nodeCommand = commandArgv[0] === handoffNodeExecutable || /^(?:node|bun)(?:\.exe)?$/iu.test(path.basename(commandArgv[0] ?? ""));
	const cliArgv = nodeCommand ? [commandArgv[0], ...commandArgv.slice(1 + resolveRuntimeArgs(commandArgv[0]).length)] : commandArgv;
	const startup = nodeCommand ? buildCliRespawnPlan({
		argv: cliArgv,
		env,
		execArgv: [],
		execPath: commandArgv[0]
	}) : null;
	const nodeExecArgv = nodeCommand ? startup?.argv.slice(0, startup.argv.length - cliArgv.length + 1) ?? [] : void 0;
	if (startup) commandArgv[0] = startup.command;
	return {
		nodeExecArgv,
		readyEnv: startup?.env ?? env
	};
}
//#endregion
//#region src/infra/update-managed-service-handoff-parent-source.ts
const MANAGED_HANDOFF_PARENT_SOURCE = String.raw`
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
`;
//#endregion
//#region src/infra/update-managed-service-handoff-runtime-assets.ts
const MANAGED_HANDOFF_RUNTIME_ENTRY = "managed-handoff-runtime.mjs";
const managedHandoffRuntimeEntrypoint = {
	currentModuleUrl: import.meta.url,
	sourceWorkerName: "update-managed-service-handoff-sealed",
	distWorkerPath: MANAGED_HANDOFF_RUNTIME_ENTRY
};
//#endregion
//#region src/infra/update-managed-service-handoff-result-source.ts
const MANAGED_HANDOFF_RESULT_SOURCE = String.raw`
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
    const leaseRuntime = path.join(params.cwd, "runtime", ${JSON.stringify(MANAGED_HANDOFF_RUNTIME_ENTRY)});
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
  return path.join(params.cwd, "runtime", ${JSON.stringify(MANAGED_HANDOFF_RUNTIME_ENTRY)});
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

`;
//#endregion
//#region src/infra/update-managed-service-handoff-native.ts
function packageMetadata(root, name) {
	const metadata = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
	if (metadata.name !== name || typeof metadata.version !== "string" || !metadata.version) throw new Error("Managed handoff FreeBSD native runtime has invalid package metadata");
	return {
		version: metadata.version,
		optionalDependencies: metadata.optionalDependencies
	};
}
function loadedNativeFile(require, root) {
	const file = path.join(root, "proc-safe-native.node");
	if (!fs.lstatSync(file).isFile()) throw new Error("Managed handoff FreeBSD native runtime requires regular package files");
	const expected = fs.realpathSync(file);
	const loaded = require.cache[expected];
	if (!loaded?.loaded || loaded.filename !== expected) throw new Error("Managed handoff could not identify the loaded FreeBSD native runtime");
	return expected;
}
function runtimeFiles(root, relative = "dist") {
	const directory = path.join(root, relative);
	if (!fs.lstatSync(directory).isDirectory()) throw new Error("Managed handoff FreeBSD native runtime requires regular package directories");
	return fs.readdirSync(directory).toSorted().flatMap((name) => {
		const child = path.join(relative, name);
		const entry = fs.lstatSync(path.join(root, child));
		if (entry.isDirectory()) return runtimeFiles(root, child);
		if (!entry.isFile()) throw new Error("Managed handoff FreeBSD native runtime requires regular package files");
		return name.endsWith(".js") ? [child] : [];
	});
}
/** Keep the native dependency alive through package replacement and triage re-exec. */
function stageFreeBsdManagedHandoffNativeRuntime(directory) {
	if (process.platform !== "freebsd") return [];
	if (process.arch !== "x64" && process.arch !== "arm64") throw new Error("Managed handoff requires a supported FreeBSD native architecture");
	if (process.resourcesPath !== void 0) throw new Error("Managed handoff cannot use an external FreeBSD native resource path");
	const require = createRequire(import.meta.url);
	const sourceRoot = path.dirname(require.resolve("@openclaw/proc-safe/package.json"));
	const entry = require.resolve("@openclaw/proc-safe/identity");
	if (entry !== path.join(sourceRoot, "dist", "identity.js") || fs.realpathSync(entry) !== entry) throw new Error("Managed handoff FreeBSD identity entry has an unexpected package path");
	const relativeFiles = [
		"package.json",
		"LICENSE",
		...runtimeFiles(sourceRoot)
	];
	for (const relative of relativeFiles) if (!fs.lstatSync(path.join(sourceRoot, relative)).isFile()) throw new Error("Managed handoff FreeBSD native runtime requires regular package files");
	const sourceRequire = createRequire(entry);
	const platformName = `@openclaw/proc-safe-freebsd-${process.arch}`;
	const nativeFile = sourceRequire.resolve(platformName);
	const nativeRoot = path.dirname(sourceRequire.resolve(`${platformName}/package.json`));
	if (nativeFile !== path.join(nativeRoot, "proc-safe-native.node") || !fs.lstatSync(nativeFile).isFile()) throw new Error("Managed handoff FreeBSD native runtime has an unexpected package path");
	const metadata = packageMetadata(sourceRoot, "@openclaw/proc-safe");
	const nativeMetadata = packageMetadata(nativeRoot, platformName);
	if (metadata.optionalDependencies?.[platformName] !== nativeMetadata.version) throw new Error("Managed handoff FreeBSD native runtime version does not match its package");
	const observed = sourceRequire(entry).readProcessIdentity(process.pid);
	if (observed?.startTimeSinceBootMicros === void 0) throw new Error("Managed handoff could not read its FreeBSD process identity");
	loadedNativeFile(sourceRequire, nativeRoot);
	const privateModules = path.resolve(directory, "runtime", "node_modules");
	const staged = [...relativeFiles.map((relative) => ({
		source: path.join(sourceRoot, relative),
		destination: path.join(privateModules, "@openclaw", "proc-safe", relative)
	})), ...["package.json", "proc-safe-native.node"].map((relative) => ({
		source: path.join(nativeRoot, relative),
		destination: path.join(privateModules, platformName, relative)
	}))].map(({ source, destination }) => {
		if (!fs.lstatSync(source).isFile()) throw new Error("Managed handoff FreeBSD native runtime requires regular package files");
		fs.mkdirSync(path.dirname(destination), {
			recursive: true,
			mode: 448
		});
		fs.writeFileSync(destination, fs.readFileSync(source), {
			mode: 384,
			flag: "wx"
		});
		return destination;
	});
	const privateEntry = path.join(privateModules, "@openclaw", "proc-safe", "dist", "identity.js");
	const privateRequire = createRequire(privateEntry);
	if (privateRequire(privateEntry).readProcessIdentity(process.pid)?.startTimeSinceBootMicros !== observed.startTimeSinceBootMicros || loadedNativeFile(privateRequire, path.join(privateModules, platformName)) !== fs.realpathSync(path.join(privateModules, platformName, "proc-safe-native.node"))) throw new Error("Managed handoff did not load its private FreeBSD native runtime");
	return staged;
}
//#endregion
//#region src/infra/update-managed-service-handoff-runtime.ts
/** Prepare the complete lease owner before launch; the caller owns partial-stage cleanup. */
function stageManagedHandoffRuntime(directory) {
	const source = resolveRuntimeWorkerUrl(managedHandoffRuntimeEntrypoint);
	if (!source.pathname.endsWith(".mjs")) throw new Error("Managed handoff requires its sealed runtime; use the repository test runner or the dist-backed pnpm openclaw CLI.");
	const destination = path.join(directory, "runtime", MANAGED_HANDOFF_RUNTIME_ENTRY);
	fs.mkdirSync(path.dirname(destination), {
		recursive: true,
		mode: 448
	});
	fs.writeFileSync(destination, fs.readFileSync(source), {
		mode: 384,
		flag: "wx"
	});
	const staged = [destination];
	if (process.platform === "win32") {
		const helper = path.join(path.dirname(destination), "windows-security-helper.exe");
		fs.writeFileSync(helper, fs.readFileSync(new URL("./windows-security-helper.exe", source)), {
			mode: 448,
			flag: "wx"
		});
		staged.push(helper);
	}
	return [...staged, ...stageFreeBsdManagedHandoffNativeRuntime(directory)];
}
//#endregion
//#region src/infra/update-managed-service-handoff-root.ts
async function assertManagedServiceUpdateHandoffRoot(params) {
	const expectedRoot = resolveUpdateInstallRoot(params.expectedRoot);
	const root = params.executingRoot ? resolveUpdateInstallRoot(params.executingRoot) : null;
	const activeExecution = root !== null && resolveUpdateInstallRoot(params.root) === root;
	if (activeExecution && expectedRoot === root) return;
	if (activeExecution && params.postCore) {
		const [previous, current] = await Promise.all([resolvePnpmGlobalInstallOwner(expectedRoot), resolvePnpmGlobalInstallOwner(root)]);
		if (previous && current && previous.ownerRoot === current.ownerRoot && resolveUpdateInstallRoot(current.packageRoot) === root) return;
	}
	throw new Error(`Managed update handoff root mismatch: expected ${params.expectedRoot}, running from ${params.root}.`);
}
//#endregion
//#region src/infra/update-managed-service-handoff.ts
const PARENT_EXIT_SHUTDOWN_RESERVE_MS = 3e4;
const HANDOFF_READY_MARKER = "OPENCLAW_UPDATE_HANDOFF_READY\n";
const HANDOFF_BUSY_MARKER = "HANDOFF_BUSY ";
const HANDOFF_SCRIPT = String.raw`
const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

${MANAGED_HANDOFF_BOOTSTRAP_SOURCE}

const { OPENCLAW_STATE_SCHEMA_SQL, assertOpenClawStateWriteAllowed, prepareManagedHandoffLeaseStore, extractSqliteTableSchema, readRestartSentinelRowSync, writeRestartSentinelRowIfRevisionSync, resolveImmutableSqliteFileUri, resolveUpdateRestartNoticeMeta, shouldPublishUpdateRestartNotice, procCgroupMembershipMatches, handoffLedger, packageActivationIdentity, recoverInterruptedManagedUpdate, readManagedHandoffGatewayStop, findUpdateGatewayStop, isSqliteSchemaVersionError } =
  require("./runtime/${MANAGED_HANDOFF_RUNTIME_ENTRY}");
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
${MANAGED_HANDOFF_LEASE_SOURCE}

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


${MANAGED_HANDOFF_RESULT_SOURCE}

${MANAGED_HANDOFF_COMMAND_SOURCE}

${MANAGED_HANDOFF_NATIVE_SCOPE_SOURCE}

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
      fs.writeSync(1, ${JSON.stringify(HANDOFF_NOTICE_MARKER)});
    });
    if (requiresRequesterAcknowledgement && notice !== "noticed")
      throw Object.assign(new Error("owner_required: original Gateway did not authorize parking"), { code: "owner_required" });
  }
  if (requiresRequesterAcknowledgement) {
    assertPreparedProfileRequester();
    assertGatewayParkOwner();
    const receipt = ${JSON.stringify(HANDOFF_PARK_ADMITTED_MARKER)};
    if (fs.writeSync(1, receipt) !== Buffer.byteLength(receipt))
      throw new Error("Managed update park acceptance receipt was incomplete");
  } else {
    await assertUpdateRequester();
    assertGatewayParkOwner();
  }
  transferPrepared = true;
}

${MANAGED_HANDOFF_PARENT_SOURCE}

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


${HANDOFF_OWNED_COMMAND_SCRIPT}

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
    fs.writeSync(1, ${JSON.stringify(HANDOFF_BUSY_MARKER)} + (lease.owner || "") + "\n");
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
    if (!params.triageTransition) fs.writeSync(1, ${JSON.stringify(HANDOFF_READY_MARKER)});
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
    if (params.operatorRestartWarning) fs.writeSync(1, ${JSON.stringify(SYSTEM_SERVICE_UPDATE_SETTLED_MARKER)});
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
`;
async function spawnManagedServiceUpdateHandoff(params, rootIdentity, owner) {
	const parentPid = params.parentPid ?? process.pid;
	const serviceEnv = params.env ?? process.env;
	if (params.foregroundOrigin) {
		if (params.action || params.foregroundOrigin.pid !== parentPid || parentPid !== process.pid || params.meta.completionOwner !== "gateway-restart") throw new Error("Foreground update requires the current Gateway's completion owner");
		await assertForegroundUpdateOrigin(params.foregroundOrigin, false, serviceEnv);
	}
	const handoffNodeExecutable = params.execPath ?? await resolveManagedHandoffNodeExecutable(serviceEnv, params.supervisor);
	const runtimeArgs = resolveRuntimeArgs(handoffNodeExecutable);
	const updateLeaseDatabasePath = owner.leaseDatabaseIdentity?.databasePath ?? resolveManagedUpdateLeaseDatabasePath();
	const updateLeaseDatabaseIdentity = owner.leaseDatabaseIdentity ?? await prepareManagedHandoffLeaseDatabaseIdentity(updateLeaseDatabasePath, () => {
		owner.requesterAuthority?.assertCurrent();
		owner.requesterAuthority?.signal?.throwIfAborted();
	});
	owner.leaseDatabaseIdentity = updateLeaseDatabaseIdentity;
	const identityStore = await prepareManagedHandoffLeaseStore({
		databasePath: updateLeaseDatabaseIdentity.databasePath,
		existingIdentity: updateLeaseDatabaseIdentity,
		serviceManagerEnv: resolveServiceManagerEnv(serviceEnv),
		onProcessIdentityWarning: createUpdateRunProcessIdentityWarning(params.runId, serviceEnv)
	});
	owner.leaseStore = identityStore;
	const parentStartIdentity = identityStore.processIdentity(parentPid).startIdentity;
	const dir = await fs$1.mkdtemp(path.join(os.tmpdir(), MANAGED_SERVICE_UPDATE_HANDOFF_TEMP_PREFIX));
	const scriptPath = path.join(dir, "handoff.cjs");
	const paramsPath = path.join(dir, "handoff.json");
	const environmentPath = path.join(dir, "handoff.env");
	const metaPath = path.join(dir, "sentinel-meta.json");
	const triageInputPath = path.join(dir, "update-failure.json");
	const installationTarget = resolveInstallationTarget(serviceEnv);
	const triageContextPath = path.join(installationTarget.stateDir, "logs", "support", `openclaw-update-failure-${randomUUID()}.json`);
	const logPath = path.join(dir, "handoff.log");
	const commandOptions = {
		acceptCapabilities: params.acceptCapabilities,
		admission: params.admission,
		reapplyLocalOverrides: params.reapplyLocalOverrides,
		timeoutMs: params.timeoutMs,
		channel: params.channel,
		tag: params.tag
	};
	const commandRuntime = {
		execPath: handoffNodeExecutable,
		argv1: resolveOpenClawCliEntryPath(params.argv1 ?? process.argv[1])
	};
	const commandArgv = params.action ? [
		params.action.nodeRunner,
		...resolveRuntimeArgs(params.action.nodeRunner),
		params.action.entrypoint,
		"triage"
	] : resolveUpdateCliArgv({
		...commandOptions,
		...commandRuntime
	});
	if (owner.operatorRestartWarning) commandArgv.push("--no-restart");
	const commandLabel = params.action ? "openclaw triage (automatic)" : formatManagedServiceUpdateCommand(commandOptions, params.env) + (owner.operatorRestartWarning ? " --no-restart" : "");
	const metaFile = {
		version: 1,
		meta: {
			...params.meta,
			...params.runId ? { runId: params.runId } : {},
			root: rootIdentity,
			triageContextPath,
			...params.foregroundOrigin ? { foregroundOrigin: params.foregroundOrigin } : {}
		}
	};
	const spawnArgs = [
		...runtimeArgs,
		scriptPath,
		paramsPath
	];
	let systemdScope;
	if (!params.foregroundOrigin && params.supervisor === "systemd" && !owner.operatorRestartWarning) systemdScope = resolveSystemdHandoffLauncher({
		serviceEnv,
		handoffId: params.handoffId,
		triage: Boolean(params.action),
		directory: dir,
		environmentPath,
		executable: handoffNodeExecutable,
		args: spawnArgs
	});
	const stateDatabasePath = resolveOpenClawStateSqlitePath(serviceEnv);
	const { nodeExecArgv, readyEnv } = prepareManagedHandoffCliRuntime(commandArgv, resolveManagedHandoffCommandEnv(serviceEnv, metaPath, metaFile.meta.runId), handoffNodeExecutable);
	const env = params.devTarget ? applyDevUpdateTargetEnv(readyEnv, params.devTarget) : readyEnv;
	const helperParams = {
		...systemdScope && !params.action ? { environmentPath } : {},
		operatorRestartWarning: owner.operatorRestartWarning,
		runId: metaFile.meta.runId,
		beforePark: Boolean(params.beforePark),
		requester: resolveManagedUpdateRequester(params.requester),
		serviceManagerEnv: resolveServiceManagerEnv(serviceEnv),
		nodeExecArgv,
		runtimeArgs,
		action: params.action?.kind ?? "update",
		failure: params.action?.failure,
		scopeUnit: systemdScope?.unit,
		systemdRun: systemdScope?.command,
		parentPid,
		parentStartIdentity,
		parentExitTimeoutMs: owner.parentExitTimeoutMs,
		restartDelayMs: Math.max(0, Math.min(6e4, params.restartDelayMs ?? 0)),
		parentExitDeadlineAt: Date.now() + owner.parentExitTimeoutMs,
		cwd: dir,
		invocationCwd: params.invocationCwd,
		commandArgv,
		recoveryCommandArgv: resolveManagedServiceCliArgv(commandRuntime, [
			"gateway",
			"restart",
			"--preserve-definition",
			"--json"
		]),
		finalizeCommandArgv: resolveManagedServiceCliArgv(commandRuntime, [
			"update",
			"finalize",
			"--yes",
			"--json"
		]),
		recoveryTimeoutMs: owner.recoveryTimeoutMs,
		triageCommandArgv: resolveManagedServiceCliArgv(commandRuntime, [
			"triage",
			"--json",
			"--non-interactive"
		]),
		triageContextPath,
		triageInputPath,
		triageContextCommand: formatInstallationTargetCommand([
			"openclaw",
			"triage",
			"--run",
			"--update-result",
			triageContextPath
		], installationTarget, { env: serviceEnv }),
		triageRecoveryCommand: formatInstallationTargetCommand(["openclaw", "triage"], installationTarget, { env: serviceEnv }),
		triageHint: "Update triage runs after service recovery; see the managed update helper log for the outcome and the installation-specific openclaw triage command.",
		commandLabel,
		handoffId: params.handoffId,
		nonFailureSkippedReasons: Object.keys(SKIPPED_UPDATE_OUTCOMES),
		logPath,
		metaPath,
		stateDatabasePath,
		nodeSqliteLocation: resolveNodeSqliteLocation(stateDatabasePath),
		updateLeaseDatabasePath: updateLeaseDatabaseIdentity.databasePath,
		updateLeaseDatabaseIdentity,
		updateLeaseKey: rootIdentity,
		updateLeaseOwner: params.handoffId,
		sensitivePaths: [
			scriptPath,
			paramsPath,
			environmentPath,
			metaPath,
			triageInputPath,
			path.join(dir, "terminal-result.json")
		],
		foregroundOrigin: params.foregroundOrigin,
		serviceRecovery: params.foregroundOrigin || owner.operatorRestartWarning ? void 0 : resolveGatewayServiceRecovery(params.supervisor, serviceEnv),
		recovery: await (await looksLikeGitCheckout(rootIdentity) ? readCurrentGitUpdateRecovery(rootIdentity, owner.recoveryTimeoutMs) : verifyPackageUpdateRecovery(rootIdentity)),
		recoveryModulePath: path.join(rootIdentity, "dist", "cli", "daemon-cli.js")
	};
	let child;
	let readiness;
	const onExit = () => {
		owner.exited = true;
		owner.releaseRequesterObserver?.();
	};
	try {
		if (helperParams.environmentPath) await writeSystemdHandoffEnvironment(helperParams.environmentPath, env);
		helperParams.sensitivePaths.push(...stageManagedHandoffRuntime(dir));
		await fs$1.writeFile(scriptPath, `${HANDOFF_SCRIPT}\n`, { mode: 448 });
		await fs$1.writeFile(paramsPath, `${JSON.stringify(helperParams, null, 2)}\n`, { mode: 384 });
		await fs$1.writeFile(metaPath, `${JSON.stringify(metaFile, null, 2)}\n`, { mode: 384 });
		assertManagedUpdateLeaseDatabaseIdentity(updateLeaseDatabaseIdentity);
		owner.requesterAuthority?.assertCurrent();
		owner.requesterAuthority?.signal?.throwIfAborted();
		if (params.foregroundOrigin && isGatewayRestartDraining()) throw new GatewayDrainingError();
		const spawnOptions = {
			cwd: dir,
			env,
			detached: true,
			stdio: [
				"pipe",
				"pipe",
				"ignore"
			]
		};
		child = systemdScope ? spawn(systemdScope.command, systemdScope.args, spawnOptions) : spawn(handoffNodeExecutable, spawnArgs, spawnOptions);
		owner.launcher = child;
		owner.closed = observeManagedServiceUpdateHandoffClose(owner, child);
		child.stdin.on("error", () => child.stdin.destroy()).once("close", () => child.stdin.destroy());
		if (!child.pid) await once(child, "spawn");
		try {
			owner.launcherStartIdentity = child.pid ? identityStore.processIdentity(child.pid, child.spawnargs).startIdentity : null;
		} catch (error) {
			forceKillChildProcessTree(child);
			throw error;
		}
		if (owner.launcherStartIdentity == null) {
			forceKillChildProcessTree(child);
			throw new Error("managed update handoff process start identity is unavailable");
		}
		child.once("exit", onExit);
		readiness = await waitForHandoffResponse(child, owner.recoveryTimeoutMs);
		if (`${readiness}\n` !== HANDOFF_READY_MARKER && !readiness.startsWith(HANDOFF_BUSY_MARKER)) throw new Error("managed update handoff returned an invalid readiness response");
		if (`${readiness}\n` === HANDOFF_READY_MARKER) {
			const helper = readManagedServiceUpdateHandoffLease(rootIdentity);
			if (helper?.owner !== params.handoffId || helper.executor.pid !== helper.helper.pid || helper.executor.startIdentity !== helper.helper.startIdentity || helper.action.kind !== (params.action?.kind ?? "update") || helper.action.kind === "triage" && (helper.action.lifetime.kind !== "native" || helper.action.lifetime.placement.kind !== "attached" || helper.action.phase !== "reserved") || !isPidAlive(helper.executor.pid) || !identityStore.isProcessIdentityCurrent(helper.executor, helper.executor.pid === child.pid && child.exitCode === null && child.signalCode === null)) {
				forceKillChildProcessTree(child);
				throw new Error("managed update handoff helper lease identity is unavailable");
			}
			owner.helper = helper;
		}
	} catch (err) {
		child?.removeListener("exit", onExit);
		child?.stdin.destroy();
		child?.stdout.destroy();
		await fs$1.rm(dir, {
			recursive: true,
			force: true
		}).catch(() => {});
		throw err;
	}
	if (params.beforePark) {
		let noticePending = false;
		const requiresAcceptance = params.requester?.authorizationSource?.startsWith("profile:") === true;
		const identity = {
			kind: "managed-update-handoff",
			installRoot: rootIdentity,
			handoffId: owner.handoffId
		};
		const isCurrentOwner = () => {
			try {
				return currentManagedServiceUpdateHandoff(identity) === owner && owner.transferred && !owner.exited;
			} catch {
				return false;
			}
		};
		const isCurrent = () => isCurrentOwner() && !owner.cancelling;
		const onNotice = createHandoffLineReader((line) => {
			if (line === "park-admitted\n" && requiresAcceptance && isCurrentOwner()) {
				owner.parkAdmitted = true;
				owner.releaseRequesterObserver?.();
				owner.parkReady = true;
				owner.closeForStop?.();
				return;
			}
			if (line !== "before-park\n" || noticePending || !isCurrent()) return;
			noticePending = true;
			(async () => {
				owner.requesterAuthority?.assertCurrent();
				await owner.beforePark?.();
				owner.requesterAuthority?.assertCurrent();
				owner.requesterAuthority?.signal?.throwIfAborted();
				if (isCurrent()) {
					if (!requiresAcceptance) {
						owner.parkReady = true;
						owner.closeForStop?.();
					}
					child.stdin.write("noticed\n");
				}
			})().catch(() => {
				if (isCurrent()) child.stdin.write("notice-failed\n");
			});
		});
		child.stdout.on("data", onNotice);
		child.once("exit", () => child.stdout.off("data", onNotice));
	}
	const result = {
		command: commandLabel,
		logPath
	};
	const handoffId = readiness.slice(13).trim();
	return `${readiness}\n` === HANDOFF_READY_MARKER ? {
		...result,
		status: "started",
		...child.pid ? { pid: child.pid } : {},
		handoffId: params.handoffId,
		installRoot: rootIdentity
	} : {
		...result,
		status: "joined",
		message: describeManagedHandoffBlocker(rootIdentity, handoffId, identityStore, serviceEnv),
		...handoffId ? { handoffId } : {}
	};
}
async function startManagedServiceUpdateHandoff(params) {
	if (params.requester?.authorizationSource?.startsWith("profile:") && (!params.requesterAuthority || !params.beforePark)) throw new Error("Profile update requires its original Gateway admission and park owner.");
	params.requesterAuthority?.assertCurrent();
	params.requesterAuthority?.signal?.throwIfAborted();
	if (params.action && params.supervisor !== "systemd") throw new Error("Automatic managed triage requires a Linux user-systemd scope; run openclaw triage manually.");
	if (!Number.isFinite(params.restartDrainTimeoutMs) || !Number.isFinite(params.restartDelayMs ?? 0)) throw new Error("managed update handoff requires a finite restart deadline");
	const operatorRestartWarning = !params.foregroundOrigin && params.supervisor === "systemd" ? await admitSystemdUpdate(params.root, params.env) : void 0;
	if (operatorRestartWarning && params.action) throw new Error("Automatic managed triage requires a Linux user-systemd scope; run openclaw triage manually.");
	const root = resolveUpdateInstallRoot(params.root);
	const active = activeManagedServiceUpdateHandoffs.get(root);
	let unsettledOwner;
	if (active?.exited && active.transferred && !active.cancelling) {
		const store = active.leaseStore;
		const lease = store?.read(root);
		if (!store || !lease || lease.kind === "unreadable") throw new Error("The previous managed update lease is unavailable; check it before retrying.");
		if (lease.kind === "current" && !store.release(lease.lease)) unsettledOwner = lease.lease.owner;
	}
	if (active?.flight && (!active.exited || active.cancelling || active.claimed && !active.transferred || unsettledOwner)) {
		const joined = await active.flight;
		const handoffId = unsettledOwner ?? joined.handoffId;
		return {
			status: "joined",
			message: describeManagedHandoffBlocker(root, handoffId, active.leaseStore, params.env ?? process.env, active.cancelling ? "cancellation settlement is pending" : active.claimed && !active.transferred ? "the Gateway still holds an untransferred handoff claim" : "helper exit or settlement has not been confirmed"),
			command: joined.command,
			logPath: joined.logPath,
			...joined.pid ? { pid: joined.pid } : {},
			...handoffId ? { handoffId } : {}
		};
	}
	if (params.foregroundOrigin && isGatewayRestartDraining()) throw new GatewayDrainingError();
	const owner = {
		handoffId: params.handoffId ?? randomUUID(),
		operatorRestartWarning,
		recoveryTimeoutMs: params.recoveryTimeoutMs ?? params.timeoutMs ?? 18e5,
		parentExitTimeoutMs: Math.min(2147483647, Math.max(0, params.restartDrainTimeoutMs) + PARENT_EXIT_SHUTDOWN_RESERVE_MS),
		...params.beforePark ? { beforePark: params.beforePark } : {},
		...params.requesterAuthority ? { requesterAuthority: params.requesterAuthority } : {},
		...params.foregroundOrigin ? { foregroundOrigin: { ...params.foregroundOrigin } } : {},
		...active?.leaseDatabaseIdentity ? { leaseDatabaseIdentity: active.leaseDatabaseIdentity } : {}
	};
	activeManagedServiceUpdateHandoffs.set(root, owner);
	const requesterSignal = owner.requesterAuthority?.signal;
	if (requesterSignal) {
		const cancelRevokedRequester = () => {
			owner.flight?.then(async () => {
				if (!owner.parkAdmitted && activeManagedServiceUpdateHandoffs.get(root) === owner) await cancelManagedServiceUpdateHandoff({
					kind: "managed-update-handoff",
					handoffId: owner.handoffId,
					installRoot: root
				});
			}, () => {});
		};
		requesterSignal.addEventListener("abort", cancelRevokedRequester, { once: true });
		owner.releaseRequesterObserver = () => requesterSignal.removeEventListener("abort", cancelRevokedRequester);
	}
	const flight = Promise.resolve().then(() => spawnManagedServiceUpdateHandoff({
		...params,
		handoffId: owner.handoffId,
		meta: {
			...params.meta,
			handoffId: params.meta.handoffId ?? owner.handoffId
		}
	}, root, owner));
	owner.flight = flight;
	try {
		return await flight;
	} catch (err) {
		owner.releaseRequesterObserver?.();
		if (activeManagedServiceUpdateHandoffs.get(root) === owner) activeManagedServiceUpdateHandoffs.delete(root);
		throw err;
	}
}
function claimManagedServiceUpdateHandoff(identity) {
	const active = currentManagedServiceUpdateHandoff(identity);
	if (!active || active.cancelling) return false;
	active.claimed = true;
	return true;
}
function currentManagedServiceUpdateHandoff(identity) {
	const root = resolveUpdateInstallRoot(identity.installRoot);
	const active = activeManagedServiceUpdateHandoffs.get(root);
	const launcher = active?.launcher;
	const helper = active?.helper;
	const lease = readManagedServiceUpdateHandoffLease(root);
	if (identity.kind !== "managed-update-handoff" || active?.handoffId !== identity.handoffId || !active.leaseStore || !launcher?.pid || !isPidAlive(launcher.pid) || active.launcherStartIdentity == null || !active.leaseStore.isProcessIdentityCurrent({
		pid: launcher.pid,
		startIdentity: active.launcherStartIdentity
	}, launcher.exitCode === null && launcher.signalCode === null) || launcher.exitCode !== null || launcher.signalCode !== null || lease?.owner !== identity.handoffId || helper?.owner !== identity.handoffId || !(active.transferred && helper.action.kind === "update") && (lease.executor.pid !== helper.executor.pid || lease.executor.startIdentity !== helper.executor.startIdentity) || JSON.stringify(lease.helper) !== JSON.stringify(helper.helper) || JSON.stringify(lease.action) !== JSON.stringify(helper.action) || lease.action.kind === "triage" && lease.action.phase !== "reserved" || !isPidAlive(lease.executor.pid) || !active.leaseStore.isProcessIdentityCurrent(lease.executor, lease.executor.pid === launcher.pid && launcher.exitCode === null && launcher.signalCode === null)) return;
	return active;
}
function hasForegroundUpdatePaths(origin, env) {
	return resolvePathViaExistingAncestorSync(resolveOpenClawStateSqlitePath(env)) === origin.stateDatabasePath && resolvePathViaExistingAncestorSync(resolveConfigPath(env, resolveStateDir(env))) === origin.configPath;
}
/** Called only before activation; later admission consumes the live helper's joined park fact. */
async function assertForegroundUpdateOrigin(origin, closed, env = process.env) {
	const matchesOwner = () => {
		if (!hasForegroundUpdatePaths(origin, env)) return false;
		const owner = readGatewayOwnerLease({
			env,
			current: true
		});
		return closed ? owner === void 0 : owner?.mode === "foreground" && owner.state === "live" && owner.owner === origin.owner && owner.pid === origin.pid && owner.host === origin.host && owner.startedAt === origin.startedAt && owner.port === origin.port;
	};
	if (!matchesOwner()) throw new Error("Foreground Gateway owner or paths changed");
	const lock = await readActiveGatewayLockIdentity({
		env,
		requireInspection: true
	});
	if (closed ? lock !== void 0 : lock?.pid !== origin.pid || lock.startTime !== origin.startedAt || lock.port !== origin.port) throw new Error("Foreground Gateway locks do not match its handoff phase");
	if (closed && await probePortUsage(origin.port) !== "free") throw new Error("Foreground Gateway port is not verified free");
	if (!matchesOwner()) throw new Error("Foreground Gateway owner or paths changed during inspection");
}
async function exchangeForegroundUpdateHandoff(params, operation) {
	const env = params.env ?? process.env;
	const meta = await readControlPlaneUpdateSentinelMeta(env);
	if (meta?.completionOwner !== "gateway-restart" || !meta.foregroundOrigin || !hasForegroundUpdatePaths(meta.foregroundOrigin, env) || !process.connected || !process.send || !await isCurrentManagedServiceUpdateHandoffProcess(params)) return false;
	const lease = readManagedServiceUpdateHandoffLease(resolveUpdateInstallRoot(params.root));
	const requestId = randomUUID();
	const accepted = await new Promise((resolve) => {
		const finish = (ok) => {
			clearTimeout(timer);
			process.off("message", onMessage).off("disconnect", onDisconnect);
			resolve(ok);
		};
		const onDisconnect = () => finish(false);
		const onMessage = (message) => {
			if (typeof message !== "object" || message === null || !("requestId" in message) || message.requestId !== requestId) return;
			finish("type" in message && message.type === operation && "version" in message && message.version === 2 && "ok" in message && message.ok === true);
		};
		const timer = setTimeout(() => finish(false), operation === "foreground-park" ? 18e5 : 3e4);
		process.on("message", onMessage).once("disconnect", onDisconnect);
		process.send({
			type: operation,
			version: 2,
			requestId
		}, (error) => {
			if (error) finish(false);
		});
	});
	const current = readManagedServiceUpdateHandoffLease(resolveUpdateInstallRoot(params.root));
	return accepted && current?.payload === lease?.payload && hasForegroundUpdatePaths(meta.foregroundOrigin, env) && await isCurrentManagedServiceUpdateHandoffProcess(params);
}
async function isCurrentForegroundUpdateHandoffProcess(params) {
	return exchangeForegroundUpdateHandoff(params, "foreground-inspect");
}
async function parkForegroundUpdateHandoff(params) {
	if (!await exchangeForegroundUpdateHandoff({
		root: params.root,
		runId: params.run.runId,
		env: params.run.env
	}, "foreground-park")) throw new Error("Foreground update helper could not verify Gateway closure");
	params.run.gatewayRestartRequired = true;
}
function isForegroundUpdateHandoff(identity) {
	const owner = activeManagedServiceUpdateHandoffs.get(resolveUpdateInstallRoot(identity.installRoot));
	return owner?.handoffId === identity.handoffId && owner.foregroundOrigin !== void 0;
}
/** Retain exact owners so a later Stop can reconcile previously uncertain settlement. */
function captureForegroundUpdateHandoffStop(params) {
	const owners = [...activeManagedServiceUpdateHandoffs].filter(([, owner]) => owner.foregroundOrigin?.pid === process.pid);
	if (!owners.length) return;
	const canPark = (identity) => owners.some(([root, owner]) => owner.parkReady && owner.handoffId === identity.handoffId && root === resolveUpdateInstallRoot(identity.installRoot) && activeManagedServiceUpdateHandoffs.get(root) === owner && claimManagedServiceUpdateHandoff(identity));
	return {
		canPark,
		settle: async () => {
			for (const [root, owner] of owners) {
				const identity = {
					kind: "managed-update-handoff",
					installRoot: root,
					handoffId: owner.handoffId
				};
				owner.closeForStop = () => {
					if (canPark(identity)) params.onPark(identity);
				};
				owner.closeForStop();
			}
			return (await Promise.allSettled(owners.map(async ([root, owner]) => {
				await owner.flight?.catch(() => {});
				await owner.closed;
				const child = owner.launcher;
				if (child && (child.pid && child.exitCode === null && child.signalCode === null || readManagedServiceUpdateHandoffLease(root, owner) !== null)) return false;
				if (!owner.parkReady && activeManagedServiceUpdateHandoffs.get(root) === owner) activeManagedServiceUpdateHandoffs.delete(root);
				delete owner.closeForStop;
				return true;
			}))).every((result) => result.status === "fulfilled" && result.value);
		}
	};
}
async function completeForegroundUpdateHandoffAfterClose(identity) {
	const root = resolveUpdateInstallRoot(identity.installRoot);
	const owner = activeManagedServiceUpdateHandoffs.get(root);
	const child = owner?.launcher;
	if (!isForegroundUpdateHandoff(identity) || !child || !claimManagedServiceUpdateHandoff(identity)) return "pending";
	const response = await sendManagedServiceUpdateHandoffCommand(identity, "closed");
	await owner.closed;
	if (readManagedServiceUpdateHandoffLease(root, owner) !== null) return "pending";
	const respawn = response === "foreground-settled:respawn" && child.exitCode !== null && child.signalCode === null && activeManagedServiceUpdateHandoffs.get(root) === owner;
	if (activeManagedServiceUpdateHandoffs.get(root) === owner) activeManagedServiceUpdateHandoffs.delete(root);
	return { respawn };
}
function sendManagedServiceUpdateHandoffCommand(identity, command) {
	const owner = activeManagedServiceUpdateHandoffs.get(resolveUpdateInstallRoot(identity.installRoot));
	const child = owner?.launcher;
	if (!owner || !child?.stdin || !child.stdout || child.stdin.destroyed) return Promise.resolve(null);
	return waitForHandoffResponse(child, command === "park" ? owner.parentExitTimeoutMs : owner.recoveryTimeoutMs, command).catch(() => null);
}
async function requestManagedServiceUpdateHandoffPark(identity) {
	if (!claimManagedServiceUpdateHandoff(identity)) return false;
	const root = resolveUpdateInstallRoot(identity.installRoot);
	const owner = activeManagedServiceUpdateHandoffs.get(root);
	if (owner?.foregroundOrigin) return true;
	await owner?.beforePark?.();
	if (activeManagedServiceUpdateHandoffs.get(root) !== owner || !claimManagedServiceUpdateHandoff(identity)) return false;
	return await sendManagedServiceUpdateHandoffCommand(identity, "park") === "parked" && claimManagedServiceUpdateHandoff(identity);
}
async function commitManagedServiceUpdateHandoff(identity, outcome = "update") {
	return claimManagedServiceUpdateHandoff(identity) && await sendManagedServiceUpdateHandoffCommand(identity, outcome === "update" ? "commit" : "restore-commit") === "committed";
}
async function transferManagedServiceUpdateHandoff(identity) {
	const active = activeManagedServiceUpdateHandoffs.get(resolveUpdateInstallRoot(identity.installRoot));
	const child = active?.launcher;
	if (active?.foregroundOrigin && isGatewayRestartDraining()) return false;
	if (!active || !child?.stdin || !child.stdout || !claimManagedServiceUpdateHandoff(identity)) return false;
	active.requesterAuthority?.assertCurrent();
	active.requesterAuthority?.signal?.throwIfAborted();
	active.transferred = true;
	if (await sendManagedServiceUpdateHandoffCommand(identity, "transfer") !== "transferred") {
		active.transferred = false;
		return false;
	}
	child.unref();
	unrefHandoffPipe(child.stdin);
	unrefHandoffPipe(child.stdout);
	return true;
}
async function cancelManagedServiceUpdateHandoff(identity) {
	const root = resolveUpdateInstallRoot(identity.installRoot);
	const active = activeManagedServiceUpdateHandoffs.get(root);
	if (identity.kind !== "managed-update-handoff" || active?.handoffId !== identity.handoffId || !active.leaseStore || active.cancelling) return false;
	active.cancelling = true;
	try {
		const current = readManagedServiceUpdateHandoffLease(root);
		if (current?.action.kind === "triage") {
			if (current.owner !== active.handoffId || JSON.stringify(current.helper) !== JSON.stringify(active.helper?.helper) || JSON.stringify({
				...current.action,
				phase: "reserved"
			}) !== JSON.stringify(active.helper?.action) || !active.leaseStore.stopNative(current)) return false;
		}
		const child = active.launcher;
		if (child && !active.exited && child.exitCode === null && child.signalCode === null) {
			const exited = new Promise((resolve) => {
				child.once("exit", () => resolve());
			});
			const response = await sendManagedServiceUpdateHandoffCommand(identity, "cancel");
			if (response === "restore-after-exit") return "restart-after-exit";
			if (response !== "cancelled" && !active.exited && !child.stdin.destroyed) return false;
			await exited;
		}
		if (readManagedServiceUpdateHandoffLease(root, active) !== null || activeManagedServiceUpdateHandoffs.get(root) !== active) return false;
		activeManagedServiceUpdateHandoffs.delete(root);
		return "restored-in-process";
	} catch {
		return false;
	} finally {
		active.cancelling = false;
		if (active.parkAdmitted) active.closeForStop?.();
	}
}
//#endregion
export { commitManagedServiceUpdateHandoff as a, isForegroundUpdateHandoff as c, startManagedServiceUpdateHandoff as d, transferManagedServiceUpdateHandoff as f, admitSystemdUpdate as g, formatManagedServiceUpdateCommand as h, claimManagedServiceUpdateHandoff as i, parkForegroundUpdateHandoff as l, buildManagedServiceHandoffUnavailableMessage as m, cancelManagedServiceUpdateHandoff as n, completeForegroundUpdateHandoffAfterClose as o, assertManagedServiceUpdateHandoffRoot as p, captureForegroundUpdateHandoffStop as r, isCurrentForegroundUpdateHandoffProcess as s, assertForegroundUpdateOrigin as t, requestManagedServiceUpdateHandoffPark as u };
