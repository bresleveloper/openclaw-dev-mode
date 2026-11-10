import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { l as tryReadJson } from "./json-files-DYmSFHoN.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { t as mergeProcessEnv } from "./process-env-BNjOnVtu.mjs";
import { r as hasCommandProcessCleanupError, t as CommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { n as STARTUP_MIGRATION_LEASE_TTL_MS } from "./startup-migration-checkpoint-C0_lkd8F.mjs";
import { s as redactSupportDiagnosticLine } from "./diagnostic-support-redaction-BP5XqJ7g.mjs";
import { a as normalizeUpdateFailureFacts } from "./update-failure-facts-3t5Fm3wV.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as resolveGatewayStartupTiming } from "./gateway-startup-timing-BxFUj82Q.mjs";
import { i as readPackageVersion } from "./package-json-B0xzRYh1.mjs";
import { n as hasGatewayServiceDefinitionOverrides, o as resolveManagedGatewayServiceCommand } from "./service-types-CPk6CBn6.mjs";
import { a as resolveManagedServiceNodeRunner, o as resolveServiceEntrypoint } from "./service-layout-DcU2-cAg.mjs";
import { l as withGatewayServiceUpdateAuthority } from "./service-update-authority-Ddw1lcTH.mjs";
import { a as resolveGatewayRestartLogPath } from "./restart-logs-BvcN3lrf.mjs";
import { a as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-CiE2knkN.mjs";
import { t as GatewayServiceDefinitionBackupReceiptSchema } from "./service-stage-DFb_R12g.mjs";
import { t as withGatewayServiceOperationLock } from "./service-operation-lock-Bbz3m70g.mjs";
import { r as fingerprintGatewayServiceDefinition } from "./service-rebind-CRFEZUnm.mjs";
import { t as createNullWriter } from "./null-writer-Bd3sgUAj.mjs";
import { n as parsePackageOpenClawSchemaVersions } from "./openclaw-schema-versions-C_DqZ7zz.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-Nv-hNWki.mjs";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-S2Kgafdv.mjs";
import { b as UpdatePreMutationError } from "./update-global-BlXQRfes.mjs";
import { o as updateRunStepsFromResultStep } from "./update-run-step-Db60sdKj.mjs";
import { d as recordUpdateRunDiagnostics } from "./update-run-write-Dd5ORe9V.mjs";
import { f as recordUpdateRunStep, p as recordUpdateRunVerification, u as recordUpdateRunRepairAttempt } from "./update-run-ledger-C3oL-g8r.mjs";
import { i as getUpdateRun } from "./update-run-reader-BOC3s3Sk.mjs";
import { t as resolveNodeRunner } from "./node-runner-DIokVayT.mjs";
import { f as withUpdateCommandExecutorChild, i as assertRetainedUpdateCommandRoot, m as UpdateCommandRecoveryPendingError, o as captureUpdateCommandExecutorAuthority, u as requiresRetainedUpdateCommandOwner } from "./update-command-executor-DUq8yLzH.mjs";
import "./shared-DRiGAorf.mjs";
import { n as resolveGatewayService, s as readGatewayServiceState } from "./service-CCmqtriJ.mjs";
import { a as readDaemonRuntimePin, o as readDaemonRuntimePinForInstall } from "./runtime-pin-state-_Q5AuEC0.mjs";
import { c as stripGatewayServiceMarkerEnv, l as withOwnedManagedUpdateEnv, s as resolveUpdatedInstallCommandEnv } from "./update-command-service-env-Bq_QrqHd.mjs";
import "./update-command-service-maintenance-DvLJF4Bi.mjs";
import { a as gatewayServiceCommandUsesRoot, m as resolveUpdatedGatewayRestartPort, u as readGatewayServiceStateForUpdate } from "./update-command-service-plan-Bdkyi9qw.mjs";
import { i as revalidateManagedGatewayServiceAfterUpdate } from "./update-command-service-publication-Cwq6T0wO.mjs";
import { c as readUpdateStateSchemaVersions, u as resolveUpdateStateContentVersion } from "./update-candidate-state-fXM6fMqw.mjs";
import "./update-command-post-plugin-validation-DVVGd91J.mjs";
import { o as createPluginUpdateWarning } from "./update-command-plugins-internals-DW5z56RP.mjs";
import { n as createGatewayRestartDeadline, t as GatewayRestartDeadlineError } from "./restart-health-deadline-W160VriR.mjs";
import "./restart-health.constants-C-z_CCoa.mjs";
import { a as resolveGatewayRestartProbeContext, o as waitForGatewayHttpReadiness, t as GATEWAY_RESTART_PROBE_TIMEOUT_MS } from "./restart-health-probe-Pjm6LtxI.mjs";
import { a as getGatewayChannelWarnings, c as inspectGatewayRestart, n as waitForGatewayHealthyRestart, s as renderRestartDiagnostics, t as isSameGatewayRestartGeneration } from "./restart-health-D3oE2IOJ.mjs";
import { t as recoverInstalledLaunchAgent } from "./launchd-recovery-CKvcc23Z.mjs";
import { r as createPackageIntegrityReader } from "./package-update-integrity-K9gUqAS0.mjs";
import { t as assertUpdateRecoveryAdmission } from "./update-run-recovery-admission-CPjoG803.mjs";
import { a as hasSchemaRefusal, n as captureTargetDatabaseSchemaContext, r as checkTargetDatabaseSchemasForContexts } from "./schema-preflight-Dfpu1-Iv.mjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/cli/update-cli/update-command-native-gate.ts
/** Keep Node startup hooks behind admission without changing the native payload's environment. */
function prepareUpdateCommandNativeGate(ticket, sources, platform = process.platform) {
	const env = mergeProcessEnv(sources, platform);
	const key = Object.keys(env).find((name) => platform === "win32" ? name.toUpperCase() === "NODE_OPTIONS" : name === "NODE_OPTIONS");
	const input = JSON.stringify([ticket, key === void 0 ? null : [key, env[key]]]);
	if (key !== void 0) delete env[key];
	return {
		source: `
  const { spawn } = await import("node:child_process");
  try {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of process.stdin) {
    bytes += chunk.length;
    if (bytes > ${Buffer.byteLength(input)}) throw new Error("Native command admission rejected");
    chunks.push(chunk);
  }
  if (bytes !== ${Buffer.byteLength(input)}) throw new Error("Native command admission rejected");
  let admission;
  try { admission = JSON.parse(new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(Buffer.concat(chunks))); }
  catch { throw new Error("Native command admission rejected"); }
  if (!Array.isArray(admission) || admission.length !== 2 ||
      typeof admission[0] !== "string" || !/^[0-9a-f-]{36}$/.test(admission[0])) throw new Error("Native command admission rejected");
  const [ticket, nodeOptions] = admission;
  if (nodeOptions !== null && (!Array.isArray(nodeOptions) || nodeOptions.length !== 2 ||
      typeof nodeOptions[0] !== "string" || typeof nodeOptions[1] !== "string" || nodeOptions[1].includes("\\0") ||
      (process.platform === "win32" ? nodeOptions[0].toUpperCase() : nodeOptions[0]) !== "NODE_OPTIONS")) throw new Error("Native command admission rejected");
  const env = { ...process.env };
  if (nodeOptions !== null) env[nodeOptions[0]] = nodeOptions[1];
  const child = spawn(process.argv[1], process.argv.slice(2), {
    env, stdio: ["ignore", "inherit", "inherit"], detached: false, windowsHide: true,
  });
  let spawnFailed = false;
  child.once("error", (error) => {
    spawnFailed = true;
    const code = typeof error.code === "string" && /^[A-Z0-9_]+$/.test(error.code) ? error.code : "_";
    process.stderr.write("native-spawn-error:" + ticket + ":" + code);
    process.exitCode = 1;
  });
  child.once("close", (code, signal) => {
    if (spawnFailed) return;
    if (signal) process.kill(process.pid, signal);
    else process.exitCode = code ?? 1;
  });
  } catch {
    process.stdin.destroy();
    process.exitCode = 1;
  }
`,
		env,
		input
	};
}
//#endregion
//#region src/cli/update-cli/update-command-retained-service.ts
/** Real retained admission plus native-controller custody, never service health. */
async function withRetainedUpdateServiceAuthority(params, operation) {
	if (process.platform === "win32") throw new UpdateCommandRecoveryPendingError("Retained native recovery requires Windows Job custody.");
	const { run, root } = params;
	const signal = run.deadline?.signal ?? params.signal;
	const executor = run.executorFence;
	const assertCaller = params.assertCurrent;
	const assertCurrent = () => {
		signal?.throwIfAborted();
		if (!executor || run.executorFence !== executor) throw new UpdateCommandRecoveryPendingError("Retained service lost its original executor.");
		assertRetainedUpdateCommandRoot(executor, root);
		assertCaller();
	};
	assertCurrent();
	if (!executor) throw new UpdateCommandRecoveryPendingError("Retained service requires its executor.");
	const candidateRoot = captureUpdateCommandExecutorAuthority(executor).installKey;
	const nativeCommand = async (argv, options) => {
		assertCurrent();
		const ticket = randomUUID();
		const command = [...argv];
		const nativeOptions = {
			...options,
			baseEnv: { ...options.baseEnv },
			env: { ...options.env }
		};
		const result = await withUpdateCommandExecutorChild(executor, candidateRoot, async (_grant, bind) => {
			const gate = prepareUpdateCommandNativeGate(ticket, [nativeOptions.baseEnv, nativeOptions.env]);
			const nativeResult = await runCommandWithTimeout([
				process.execPath,
				"--input-type=module",
				"-e",
				gate.source,
				"--",
				...command
			], {
				...nativeOptions,
				baseEnv: {},
				env: gate.env,
				signal: signal && nativeOptions.signal ? AbortSignal.any([signal, nativeOptions.signal]) : signal ?? nativeOptions.signal,
				input: gate.input,
				beforeInput: (pid) => {
					signal?.throwIfAborted();
					bind(pid);
					nativeOptions.beforeInput?.(pid, command);
				},
				killProcessTree: true,
				requireProcessTreeExtinction: true
			});
			if (nativeResult.cleanup === "uncertain" || nativeResult.cleanup === "forced") throw new CommandProcessCleanupError();
			return nativeResult;
		});
		assertCurrent();
		if (result.outputLimitExceeded || result.outputErrorStream) throw new UpdateCommandRecoveryPendingError("Retained native command cleanup is unconfirmed.");
		const prefix = `native-spawn-error:${ticket}:`;
		if (result.termination === "exit" && result.code === 1 && result.stdout === "" && !result.stdoutTruncatedBytes && !result.stderrTruncatedBytes && result.stderr.startsWith(prefix)) {
			const code = result.stderr.slice(prefix.length);
			if (/^[A-Z0-9_]+$/.test(code)) throw Object.assign(/* @__PURE__ */ new Error("Native command failed during launch"), code === "_" ? {} : { code });
		}
		return result;
	};
	return await withGatewayServiceUpdateAuthority(assertCurrent, () => operation(assertCurrent), {
		originalRoot: params.root,
		nativeCommand
	});
}
//#endregion
//#region src/cli/update-cli/update-command-service-command.ts
const DEFINITION_DENIAL = /\bSERVICE_DEFINITION_(?:SEALED|UNKNOWN):[^\n]*/;
/** The installed CLI observed failed health after accepting activation, not a refusal. */
var GatewayRestartHealthError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "GatewayRestartHealthError";
	}
};
function isPackageManagerUpdateMode(mode) {
	return mode === "npm" || mode === "pnpm" || mode === "bun";
}
function formatCommandFailure(stdout, stderr) {
	const error = safeParseJsonRecord(stdout)?.error;
	const diagnostics = `${stderr}\n${typeof error === "string" ? error : stdout}`;
	const detail = diagnostics.match(/\bUPDATE_NATIVE_AUTHORITY:[^\n]*/)?.[0] ?? diagnostics.match(DEFINITION_DENIAL)?.[0] ?? (typeof error === "string" ? error : stderr || stdout).trim();
	return detail ? detail.split("\n").slice(-3).join("\n") : "command returned a non-zero exit code";
}
async function runSettledGatewayCommand(argv, options) {
	const result = await runCommandWithTimeout(argv, {
		...options,
		baseEnv: {},
		killProcessTree: true,
		requireProcessTreeExtinction: true
	});
	if (result.cleanup === "forced" || result.cleanup === "uncertain") throw new CommandProcessCleanupError();
	return result;
}
/** Probe the staged target before activation, retaining the original child owner. */
async function isUpdatedInstallGatewayExecutorSupported(params) {
	params.signal?.throwIfAborted();
	params.executor.assertCurrent();
	const requiresRetainedOwner = requiresRetainedUpdateCommandOwner(params.executor);
	const entrypoint = await resolveGatewayInstallEntrypoint(params.root);
	params.executor.assertCurrent();
	if (!entrypoint) return false;
	const argv = [
		params.nodeRunner ?? resolveNodeRunner(),
		entrypoint,
		"gateway",
		"install",
		"--update-executor",
		"check",
		"--json"
	];
	const check = await withUpdateCommandExecutorChild(params.executor, params.root, (_grant, bindChild) => runSettledGatewayCommand(argv, {
		input: "",
		beforeInput: bindChild,
		cwd: params.root,
		env: {
			...params.env,
			OPENCLAW_NO_RESPAWN: "1"
		},
		timeoutMs: params.timeoutMs,
		...params.signal ? { signal: params.signal } : {},
		maxOutputBytes: 65536
	}));
	params.signal?.throwIfAborted();
	params.executor.assertCurrent();
	const capability = safeParseJsonRecord(check.stdout);
	const supported = check.code === 0 && check.termination === "exit" && check.signal === null && !check.killed && (check.cleanup === "normal" || check.cleanup === "cooperative") && !check.stdoutTruncatedBytes && !check.outputLimitExceeded && !check.outputErrorStream && capability?.updateExecutor === "root-spawner-v1" && capability.targetRootBinding === true && (!params.requireOriginalDefinitionBinding || capability.originalDefinitionBinding === true && capability.originalRuntimePinBinding === true) && (!requiresRetainedOwner || capability.retainedOwnerBinding === true);
	params.onDefinitionBackupCapability?.(supported && capability?.definitionBackup === true);
	return supported;
}
async function runUpdatedInstallGatewayCommand(params, action) {
	const run = params.opts.run;
	const executor = run?.executorFence;
	const assertCurrent = () => {
		run?.deadline?.signal.throwIfAborted();
		params.signal?.throwIfAborted();
		if (params.opts.run !== run || run?.executorFence !== executor) throw new Error("Native command lost its original update executor.");
		executor?.assertCurrent();
		params.assertCurrent?.();
	};
	assertCurrent();
	const installing = action === "install";
	const entrypoint = await resolveGatewayInstallEntrypoint(params.result.root);
	assertCurrent();
	if (!entrypoint) throw new Error(`updated install entrypoint not found under ${params.result.root ?? "unknown"}`);
	const args = [
		"gateway",
		action,
		installing ? "--force" : "--preserve-definition"
	];
	if (installing && params.gatewayPort !== void 0) args.push("--port", String(params.gatewayPort));
	args.push("--json");
	const nodeRunner = params.nodeRunner ?? resolveNodeRunner();
	const commandEnv = stripGatewayServiceMarkerEnv(resolveUpdatedInstallCommandEnv({
		processEnv: installing ? params.serviceInstallEnv ?? params.invocationEnv : params.invocationEnv,
		serviceEnv: installing ? void 0 : params.serviceEnv,
		invocationCwd: params.invocationCwd
	}));
	if (executor) commandEnv.OPENCLAW_NO_RESPAWN = "1";
	assertCurrent();
	const installTimeoutMs = params.timeoutMs ?? 12e5;
	if (run && !executor) throw new UpdateCommandRecoveryPendingError("Native command requires its original update executor.");
	if (executor) {
		let definitionBackupSupported = false;
		const checkStartedAtMs = Date.now();
		if (!params.result.root || !await isUpdatedInstallGatewayExecutorSupported({
			root: params.result.root,
			env: commandEnv,
			executor,
			timeoutMs: installTimeoutMs,
			nodeRunner,
			signal: params.signal,
			onDefinitionBackupCapability: (supported) => {
				definitionBackupSupported = supported;
			},
			requireOriginalDefinitionBinding: installing && Boolean(params.originalManagedServiceRuntime)
		})) {
			if (installing && params.originalManagedServiceRuntime) throw new Error("Target cannot attest the original definition rewrite; original service compensation is required.");
			throw new UpdateCommandRecoveryPendingError("Target runtime cannot fence update-owned native commands.");
		}
		assertCurrent();
		params.onTimedStep?.({
			name: "managed-service-executor-check",
			command: "openclaw gateway install --update-executor check --json",
			cwd: params.result.root,
			durationMs: Math.max(0, Date.now() - checkStartedAtMs),
			exitCode: 0
		});
		if (installing && params.definitionRecovery && !definitionBackupSupported) {
			params.definitionRecovery.preserved = true;
			const message = "The target installer cannot retain a service definition backup; the existing definition was preserved.";
			params.onWarnings?.([message]);
			throw new Error(`SERVICE_DEFINITION_UNKNOWN: ${message}`);
		}
	}
	if (installing && params.definitionRecovery) params.definitionRecovery.unverified = true;
	const runChild = async (grant, bindChild) => {
		const argv = [
			nodeRunner,
			entrypoint,
			...args,
			...grant ? ["--update-executor", "run"] : []
		];
		params.onGatewayStartAttempted?.(action);
		return await runSettledGatewayCommand(argv, {
			...grant ? {
				input: JSON.stringify({
					executor: grant,
					action,
					...installing && params.originalManagedServiceRuntime ? {
						originalDefinition: params.originalManagedServiceRuntime.definition.fingerprint,
						originalRuntimePin: params.originalManagedServiceRuntime.definition.runtimePin.revision
					} : {},
					targetRoot: resolveUpdateInstallRoot(params.result.root)
				}),
				beforeInput: bindChild
			} : {},
			cwd: params.result.root,
			env: commandEnv,
			timeoutMs: run?.deadline?.remainingMs() ?? (installing ? installTimeoutMs : params.timeoutMs),
			...params.signal ? { signal: params.signal } : {}
		});
	};
	const childStartedAtMs = Date.now();
	const res = executor ? await withUpdateCommandExecutorChild(executor, params.result.root, runChild) : await runChild();
	assertCurrent();
	const exited = res.termination === "exit" && res.signal === null && !res.killed;
	const complete = !res.stdoutTruncatedBytes && !res.outputLimitExceeded && !res.outputErrorStream;
	if (exited && res.code === 0) params.onTimedStep?.({
		name: `managed-service-${action}`,
		command: ["openclaw", ...args].join(" "),
		cwd: params.result.root ?? "",
		durationMs: Math.max(0, Date.now() - childStartedAtMs),
		exitCode: 0
	});
	const response = complete ? safeParseJsonRecord(res.stdout) : void 0;
	if (installing && response) {
		const warnings = Array.isArray(response.warnings) ? response.warnings.filter((message) => typeof message === "string") : [];
		if (warnings.length) params.onWarnings?.(warnings);
		if (params.definitionRecovery) {
			const backup = GatewayServiceDefinitionBackupReceiptSchema.safeParse(response.definitionBackup);
			const error = typeof response.error === "string" ? response.error : "";
			const recoveryFailed = error.includes("UPDATE_NATIVE_AUTHORITY:");
			if (backup.success && !recoveryFailed) {
				params.definitionRecovery.backup = backup.data;
				params.definitionRecovery.unverified = false;
			} else if (!recoveryFailed && DEFINITION_DENIAL.test(error)) {
				params.definitionRecovery.preserved = true;
				params.definitionRecovery.unverified = false;
			} else params.onWarnings?.(["Service definition backup receipt could not be verified; retained recovery data must be inspected before rollback."]);
		}
	}
	const original = params.originalManagedServiceRuntime;
	if (installing && original && exited && complete) {
		const receipt = asOptionalRecord(response?.rebind);
		if (receipt?.before === original.definition.fingerprint && typeof receipt.after === "string" && /^[a-f0-9]{64}$/.test(receipt.after) && receipt.runtimePinBefore === original.definition.runtimePin.revision && typeof receipt.runtimePinAfter === "string" && /^[a-f0-9]{64}$/.test(receipt.runtimePinAfter)) {
			if (receipt.mutated === true || receipt.after !== receipt.before || receipt.runtimePinAfter !== receipt.runtimePinBefore) {
				original.definition.rebound = receipt.after;
				original.definition.reboundRuntimePin = receipt.runtimePinAfter;
			}
		} else throw new Error("Native install did not return its original-definition receipt; compensation must revalidate the unchanged original.");
	}
	if (exited && res.code === 0) return response?.action === action && response.ok === true && action === "restart" && (response.result === "restarted" || response.result === "scheduled") ? "accepted" : "unverified";
	const message = `updated install ${installing ? "refresh" : action} failed: ${formatCommandFailure(res.stdout, res.stderr)} (${entrypoint})`;
	if (exited && res.code === 1 && action === "restart" && response?.action === "restart" && response.ok === false && response.result === "restart-health-failed" && typeof response.error === "string") throw new GatewayRestartHealthError(message);
	if (executor && message.includes("UPDATE_NATIVE_AUTHORITY:")) throw new UpdateCommandRecoveryPendingError(message);
	throw new Error(message);
}
/** Await inside the admitted executor. This restarts retained A using candidate code,
* not A's older CLI. The caller owns compatibility/identity checks and later health. */
async function restartRetainedUpdateGatewayService(params) {
	const env = { ...params.env };
	return await withRetainedUpdateServiceAuthority(params, async (assertCurrent) => withGatewayServiceOperationLock(env, async (assertNative) => {
		await params.revalidate();
		assertNative();
		assertCurrent();
		return await resolveGatewayService().restart({
			stdout: params.stdout,
			env,
			beforeMutation: params.revalidate,
			onRestartAttempted: params.onGatewayStartAttempted,
			assertCurrent: () => {
				assertNative();
				assertCurrent();
			},
			preserveDefinition: true,
			preserveAutoStart: true,
			deadline: params.run.deadline
		});
	}));
}
//#endregion
//#region src/cli/update-cli/update-command-launch-agent-recovery.ts
async function recoverInstalledLaunchAgentAfterUpdate(params) {
	params.assertCurrent?.();
	if (process.platform !== "darwin") return { status: "not-needed" };
	const service = params.service ?? resolveGatewayService();
	const state = await readGatewayServiceState(service, {
		env: params.env,
		timeoutMs: params.deadline?.remainingMs()
	}).catch((error) => ({ error }));
	params.assertCurrent?.();
	const inspectionFailed = (error) => ({
		status: "inspection-failed",
		detail: `LaunchAgent state could not be inspected: ${error instanceof Error ? error.message : String(error)}`
	});
	if ("error" in state) return inspectionFailed(state.error);
	if (state.loadState.status === "unknown") return inspectionFailed(state.loadState.detail);
	if (state.loadState.status !== "not-loaded" || !state.installed) return { status: "not-needed" };
	let recovered;
	try {
		params.onGatewayStartAttempted?.();
		recovered = await recoverInstalledLaunchAgent({
			result: "restarted",
			env: state.env,
			deadline: params.deadline
		});
		params.assertCurrent?.();
	} catch (error) {
		params.assertCurrent?.();
		return {
			status: "failed",
			detail: error instanceof Error ? error.message : String(error)
		};
	}
	if (!recovered) return {
		status: "failed",
		detail: "LaunchAgent was installed but not loaded; automatic bootstrap/kickstart recovery failed."
	};
	return {
		status: "recovered",
		message: recovered.message
	};
}
//#endregion
//#region src/cli/update-cli/update-command-supervisor.ts
async function hasLoadedLaunchdKeepAliveSupervisor(params) {
	if (process.platform !== "darwin") return false;
	return await params.service.isLoaded({ env: params.env }).catch(() => false);
}
//#endregion
//#region src/cli/update-cli/update-command-readiness.ts
async function verifyPreviousGatewayForUpdate(params) {
	const { config, env } = params;
	const { assertCurrent, proofOptions } = captureUpdateGatewayReadinessOwner(params);
	const run = proofOptions.run;
	const { deadlineMs: timeoutMs, derivation } = resolveGatewayStartupTiming(process.platform, {
		timeoutMs: params.timeoutMs,
		observedStartupMs: params.observedStartupMs,
		migrationLeaseMs: STARTUP_MIGRATION_LEASE_TTL_MS,
		previousGateway: true
	});
	const startedAtMs = Date.now();
	const sharedDeadline = params.opts.run?.deadline;
	const deadline = sharedDeadline ?? createGatewayRestartDeadline({
		timeoutMs,
		signal: params.signal
	});
	let lastProgress = {
		stage: "",
		at: -Infinity
	};
	let lastReason = "resolving the previous Gateway port and installed version";
	const progress = (stage, reason, warning = false) => {
		if (!warning) deadline.signal.throwIfAborted();
		assertCurrent();
		lastReason = reason;
		const now = performance.now();
		if (!warning && stage === lastProgress.stage && now - lastProgress.at < 3e4) return;
		lastProgress = {
			stage,
			at: now
		};
		const outcome = warning ? `Ended (${stage}); continuing with readiness unverified; automatic rollback cannot restart it. Run openclaw gateway status --deep --require-rpc to inspect it.` : `Remaining ${Math.ceil(deadline.remainingMs())}ms.`;
		const detail = `Previous-Gateway readiness verification: service, listener identity, version/build, health RPC and /readyz. Budget ${timeoutMs}ms (${derivation}). ${outcome} Last observation: ${redactSupportDiagnosticLine(reason, {
			env,
			stateDir: resolveStateDir(env)
		})}`;
		const fact = {
			step: `${warning ? "warning:" : ""}previous gateway verification`,
			status: warning ? "completed" : "in_progress",
			startedAtMs,
			...warning ? { endedAtMs: Date.now() } : {},
			detail
		};
		if (run) recordUpdateRunStep(run.runId, fact, { env: run.env });
		defaultRuntime[params.opts.json ? "error" : "log"](`${fact.step}: ${detail}`);
	};
	try {
		progress("setup", lastReason);
		return await deadline.read("previous Gateway verification", async () => {
			const port = params.gatewayPort ?? await resolveUpdatedGatewayRestartPort({
				config,
				serviceEnv: env
			});
			const [installedVersion, expectedBuildId] = await Promise.all([readPackageVersion(params.root), readBuiltGatewayBuildId(params.root)]);
			if (params.expectedVersion && installedVersion !== params.expectedVersion) return false;
			const expectedVersion = params.expectedVersion ?? installedVersion;
			progress("readiness", `checking service and listener identity on port ${port}`);
			const { health, readyz, http } = await observeUpdateGatewayReadiness({
				serviceEnv: env,
				gatewayPort: port,
				expectedVersion: expectedVersion ?? void 0,
				expectedBuildId: expectedBuildId ?? void 0,
				timeoutMs,
				probeTimeoutMs: 5e3,
				deadline,
				requireRunningService: true,
				waitForStartup: params.waitForStartup,
				settle: { probes: 1 },
				signal: deadline.signal,
				requirePluginHealth: params.requirePluginHealth,
				assertCurrent,
				onProgress: progress
			});
			if (!health.healthy || !(http?.coreReady ?? readyz)) {
				progress(health.waitOutcome ?? "unverified", health.probeError ?? lastReason, true);
				return false;
			}
			progress("installation", "checking service command ownership of the previous installation");
			const servesPreviousPackage = await gatewayServiceCommandUsesRoot({
				root: params.root,
				env
			});
			assertCurrent();
			return Boolean(expectedVersion && servesPreviousPackage === true && health.runtime.status === "running");
		});
	} catch (error) {
		if (!(error instanceof GatewayRestartDeadlineError)) throw error;
		progress("budget exhausted", lastReason, true);
		return false;
	} finally {
		if (!sharedDeadline) deadline.dispose();
	}
}
/** Keep readiness proof and its live authority bound to the original admission. */
function captureUpdateGatewayReadinessOwner(params) {
	const originalRun = params.opts.run;
	const originalExecutor = originalRun?.executorFence;
	const originalRecovery = params.opts.recovery;
	const proofOptions = {
		...params.opts,
		...originalRun ? { run: {
			...originalRun,
			env: { ...originalRun.env }
		} } : {}
	};
	const assertCurrent = () => {
		params.signal?.throwIfAborted();
		originalRun?.deadline?.signal.throwIfAborted();
		if (params.opts.run !== originalRun || originalRun?.executorFence !== originalExecutor || params.opts.recovery !== originalRecovery) throw new UpdateCommandRecoveryPendingError("Readiness observation lost its original executor.");
		originalExecutor?.assertCurrent();
		if (originalRecovery) throw new UpdateCommandRecoveryPendingError("Full-state checkpoint recovery is deferred; retained state was left unchanged.");
		params.assertCurrent?.();
	};
	return {
		proofOptions,
		assertCurrent
	};
}
function gatewayReadinessPending(health) {
	if (health.waitOutcome === "still-starting") return true;
	return health.waitOutcome === "timeout" && health.runtime.status === "running" && (typeof health.runtime.pid === "number" || Boolean(health.gatewayBootId)) && [
		"waiting for Gateway listener",
		"startup migration",
		"settling healthy Gateway"
	].includes(health.startupPhase ?? "") && !health.versionMismatch && !health.buildIdMismatch && !health.activatedPluginErrors?.length && health.staleGatewayPids.length === 0;
}
/** Observe one ready generation before activation or after restart, without recording a verdict. */
async function observeUpdateGatewayReadiness(params) {
	const waitForStartup = params.waitForStartup !== false;
	const { deadlineMs: timeoutMs } = resolveGatewayStartupTiming(process.platform, {
		timeoutMs: params.timeoutMs,
		observedStartupMs: params.observedStartupMs,
		migrationLeaseMs: STARTUP_MIGRATION_LEASE_TTL_MS
	});
	const settle = params.settle ?? { probes: 12 };
	const settleDurationMs = waitForStartup ? (Math.max(1, settle.probes) - 1) * 500 : 0;
	const startedAtMs = performance.now();
	const deadline = params.deadline ?? createGatewayRestartDeadline({
		timeoutMs: Math.max(0, Math.min(timeoutMs + settleDurationMs, (params.deadlineMs ?? Infinity) - startedAtMs)),
		signal: params.signal
	});
	const remainingMs = deadline.remainingMs;
	const probeTimeoutMs = () => waitForStartup && params.probeTimeoutMs === void 0 ? remainingMs() : Math.min(remainingMs(), params.probeTimeoutMs ?? 3e3);
	const assertCurrent = () => {
		deadline.signal.throwIfAborted();
		params.assertCurrent?.();
	};
	const service = resolveGatewayService();
	const probeParams = {
		service,
		port: params.gatewayPort,
		expectedVersion: params.expectedVersion,
		...params.expectedBuildId ? { expectedBuildId: params.expectedBuildId } : {},
		requirePluginHealth: params.requirePluginHealth ?? false,
		requireChannelHealth: false,
		env: params.serviceEnv,
		signal: deadline.signal,
		deadline,
		probeTimeoutMs: params.probeTimeoutMs ?? (waitForStartup ? void 0 : 3e3)
	};
	let health = params.health ?? {
		runtime: { status: "unknown" },
		portUsage: {
			port: params.gatewayPort,
			status: "unknown",
			listeners: [],
			hints: []
		},
		healthy: false,
		staleGatewayPids: []
	};
	let launchAgentRecovery = null;
	let http;
	const channelProbeTimeouts = /* @__PURE__ */ new Map();
	const retainChannelTimeouts = (snapshot) => {
		for (const timeout of snapshot.channelProbeTimeouts ?? []) channelProbeTimeouts.set(timeout.id, timeout);
	};
	const readHealth = async () => {
		assertCurrent();
		if (!waitForStartup) {
			const inspectedHealth = await inspectGatewayRestart({
				...probeParams,
				timeoutMs: Math.max(1, remainingMs())
			});
			assertCurrent();
			return inspectedHealth;
		}
		const supervisorKeepsAlive = await deadline.read("service supervisor", () => hasLoadedLaunchdKeepAliveSupervisor({
			service,
			env: params.serviceEnv
		}));
		assertCurrent();
		const observed = await waitForGatewayHealthyRestart({
			...probeParams,
			deadlineOutcome: "snapshot",
			timeoutMs: Math.max(1, remainingMs() - settleDurationMs),
			onObservation: (snapshot) => {
				health = snapshot;
				retainChannelTimeouts(snapshot);
				params.onProgress?.("readiness", `${snapshot.startupPhase}; service=${snapshot.runtime.status} PID=${snapshot.runtime.pid ?? "unknown"}${snapshot.runtime.inspectionFailure ? `; native inspection=${snapshot.runtime.inspectionFailure.timeoutMs === void 0 ? "unavailable" : `timed out (${snapshot.runtime.inspectionFailure.timeoutMs}ms)`}` : ""}; listener=${snapshot.portUsage.status}; listener PIDs=${snapshot.portUsage.listeners.map(({ pid }) => pid ?? "unknown").join(",") || "none"}; health=${snapshot.healthy ? "ready" : "unverified"}${snapshot.probeError ? `; ${snapshot.probeError}` : ""}`);
			},
			requireRunningService: params.requireRunningService,
			settle,
			supervisorKeepsAlive
		});
		health = observed;
		assertCurrent();
		return observed;
	};
	try {
		const readiness = await deadline.run(async () => {
			assertCurrent();
			health = params.health ?? await readHealth();
			retainChannelTimeouts(health);
			if (params.healthOnly) return {
				health,
				readyz: false,
				http: void 0,
				launchAgentRecovery
			};
			const recoverHealth = params.recoverHealth;
			if (recoverHealth && !gatewayReadinessPending(health)) {
				({health, launchAgentRecovery} = await deadline.read("Gateway recovery", () => recoverHealth(health, readHealth, assertCurrent)));
				assertCurrent();
				retainChannelTimeouts(health);
			}
			if (!health.healthy && (!waitForStartup || health.waitOutcome !== void 0 && health.waitOutcome !== "healthy" || health.versionMismatch || health.buildIdMismatch || health.activatedPluginErrors?.length || health.staleGatewayPids.length > 0)) return {
				health,
				readyz: false,
				http: void 0,
				launchAgentRecovery
			};
			params.onProgress?.("http", "checking Gateway HTTP healthz and readyz endpoints");
			const context = await deadline.read("HTTP check context", () => resolveGatewayRestartProbeContext(params.serviceEnv, void 0, deadline.signal));
			assertCurrent();
			http = await deadline.read("HTTP readiness", () => waitForGatewayHttpReadiness({
				requireChannelHealth: false,
				config: context.config,
				port: params.gatewayPort,
				attempts: waitForStartup ? Math.ceil(remainingMs() / 500) : 1,
				deadlineAt: performance.now() + remainingMs(),
				probeTimeoutMs: probeTimeoutMs(),
				delayMs: 500,
				onObservation: (observation) => params.onProgress?.("http", `HTTP healthz=${observation.healthz ?? "unavailable"}; readyz=${observation.readyz ?? "unavailable"}`),
				signal: deadline.signal
			}));
			assertCurrent();
			const readyz = http.readyz === 200;
			if (health.healthy && (!params.requireRunningService || health.runtime.status === "running")) {
				const settled = health;
				const inspect = () => inspectGatewayRestart({
					...probeParams,
					probeContext: context,
					timeoutMs: Math.max(1, remainingMs())
				});
				const inspected = await deadline.read("final Gateway identity", inspect);
				assertCurrent();
				retainChannelTimeouts(inspected);
				health = inspected.healthy ? await deadline.read("final Gateway health", inspect) : inspected;
				assertCurrent();
				retainChannelTimeouts(health);
				health.startupPhase = settled.startupPhase;
				if (!(isSameGatewayRestartGeneration(settled, inspected) && isSameGatewayRestartGeneration(inspected, health))) {
					health.healthy = false;
					health.waitOutcome = "generation-changed";
					health.probeError = "Gateway process changed during final readiness verification.";
				}
			}
			if (health.waitOutcome !== "generation-changed" && (!(http.coreReady ?? readyz) || remainingMs() === 0)) health = {
				...health,
				healthy: false,
				...waitForStartup ? {
					waitOutcome: "timeout",
					elapsedMs: performance.now() - startedAtMs,
					...!readyz ? { startupPhase: "waiting for Gateway HTTP readiness" } : {}
				} : {}
			};
			return {
				health,
				readyz,
				http,
				launchAgentRecovery
			};
		});
		if (channelProbeTimeouts.size) readiness.health.channelProbeTimeouts = Array.from(channelProbeTimeouts.values());
		return readiness;
	} catch (error) {
		const cleanup = await deadline.cleanup;
		if (hasCommandProcessCleanupError(error)) throw error;
		if (cleanup === "unknown") throw new CommandProcessCleanupError({ cause: error });
		if (!(error instanceof GatewayRestartDeadlineError)) throw error;
		const interval = error.phase === "health-wait:interval";
		const waitOutcome = health.waitOutcome === "generation-changed" ? "generation-changed" : interval && health.waitOutcome === "still-starting" ? "still-starting" : "timeout";
		return {
			health: {
				...health,
				...channelProbeTimeouts.size ? { channelProbeTimeouts: Array.from(channelProbeTimeouts.values()) } : {},
				healthy: false,
				waitOutcome,
				startupPhase: interval ? health.startupPhase : `timed out during ${error.phase}`,
				elapsedMs: performance.now() - startedAtMs,
				probeError: interval ? health.probeError : error.message
			},
			readyz: false,
			http,
			launchAgentRecovery
		};
	} finally {
		if (!params.deadline) deadline.dispose();
	}
}
//#endregion
//#region src/cli/update-cli/update-command-original-service.ts
async function nodeIdentity(nodeRunner) {
	const real = await fs.realpath(nodeRunner);
	const stat = await fs.stat(real, { bigint: true });
	if (!stat.isFile() || stat.ino === 0n) throw new Error("Original service Node identity is unavailable.");
	return [
		real,
		stat.dev,
		stat.ino,
		stat.mode,
		stat.uid,
		stat.gid,
		stat.size,
		stat.mtimeNs,
		stat.ctimeNs
	].join(":");
}
async function readOriginalServiceFiles(params) {
	const { root, assertCurrent } = params;
	assertCurrent();
	const reader = createPackageIntegrityReader(params.timeoutMs);
	const packageIdentity = await reader.directoryIdentity(root);
	const launcherPath = params.command && resolveServiceEntrypoint(params.command);
	if (!packageIdentity || !launcherPath) throw new Error("Original service directory or launcher identity is unavailable.");
	const realPath = await fs.realpath(launcherPath);
	const fingerprint = await reader.launcher(launcherPath);
	const targetFingerprint = await reader.launcher(realPath);
	const node = await nodeIdentity(params.nodeRunner);
	const buildId = await readBuiltGatewayBuildId(root) ?? void 0;
	const schemaVersions = parsePackageOpenClawSchemaVersions(await tryReadJson(path.join(root, "package.json")));
	assertCurrent();
	return {
		packageIdentity,
		launcher: {
			path: launcherPath,
			realPath,
			fingerprint,
			targetFingerprint
		},
		nodeIdentity: node,
		buildId,
		schemaVersions
	};
}
/** The observation is data. Every use requires an independently live admitted executor. */
function originalServiceAuthority(run) {
	const executor = run?.executorFence;
	if (!run || !executor) throw new UpdateCommandRecoveryPendingError("Original service recovery requires its admitted executor.");
	captureUpdateCommandExecutorAuthority(executor);
	return () => executor.assertCurrent();
}
async function revalidateOriginalManagedServiceRuntime(original, assertCurrent, timeoutMs, allowOwnRebind = false) {
	assertCurrent();
	const state = await readGatewayServiceStateForUpdate(resolveGatewayService(), original.service.serviceEnv, timeoutMs, {
		managerUid: original.service.serviceManagerUid,
		assertCurrent
	});
	assertCurrent();
	const definition = await fingerprintGatewayServiceDefinition(state.command);
	assertCurrent();
	const ownRebind = allowOwnRebind && original.definition.rebound === definition;
	const runtimePin = readDaemonRuntimePinForInstall({
		kind: "gateway",
		env: original.service.serviceEnv ?? {},
		allowNativeRead: true
	}, state.command, true);
	const expectedRuntimePin = ownRebind ? original.definition.reboundRuntimePin : original.definition.runtimePin.revision;
	if (runtimePin.revision !== expectedRuntimePin) throw new Error("Original managed service runtime intent changed.");
	if (definition !== original.definition.fingerprint && !ownRebind) throw new Error("Original managed service definition changed.");
	const verifiedState = ownRebind ? {
		...state,
		command: original.definition.command
	} : state;
	const verdict = await revalidateManagedGatewayServiceAfterUpdate({
		state: verifiedState,
		root: original.root,
		preManagedServiceStop: original.service
	});
	assertCurrent();
	if (verdict.kind !== "owned" || resolveManagedServiceNodeRunner(verifiedState.command) !== original.nodeRunner || await fs.realpath(verdict.root) !== original.root || original.version !== original.packageIdentity.version) throw new Error("Original managed service runtime changed; compensation was refused.");
	assertCurrent();
	const files = await readOriginalServiceFiles({
		root: original.root,
		nodeRunner: original.nodeRunner,
		command: verifiedState.command,
		assertCurrent,
		timeoutMs
	});
	if (!isDeepStrictEqual(files, {
		packageIdentity: original.packageIdentity,
		launcher: original.launcher,
		nodeIdentity: original.nodeIdentity,
		buildId: original.buildId,
		schemaVersions: original.schemaVersions
	})) throw new Error("Original managed service runtime changed; compensation was refused.");
	assertCurrent();
	return state;
}
async function observeOriginalManagedServiceRuntime(params, before) {
	const verdict = before?.serviceUpdateVerdict;
	if (!before?.running || before.stopped || verdict?.kind !== "owned") return;
	const assertCurrent = originalServiceAuthority(params.opts.run);
	assertCurrent();
	try {
		const root = await fs.realpath(verdict.root);
		if (root === await fs.realpath(params.root)) return;
		if (process.platform === "win32") throw new Error("Split-root service restoration requires persistent Windows Job custody; preserve the running service until that custody is available.");
		if (!before.serviceNodeRunner || !before.serviceEnv) throw new Error("Original service Node or manager environment is unavailable.");
		assertCurrent();
		const state = await readGatewayServiceStateForUpdate(resolveGatewayService(), before.serviceEnv, params.updateStepTimeoutMs);
		assertCurrent();
		const files = await readOriginalServiceFiles({
			root,
			nodeRunner: before.serviceNodeRunner,
			command: state.command,
			assertCurrent,
			timeoutMs: params.updateStepTimeoutMs
		});
		if (!state.command) throw new Error("Original service definition is unavailable.");
		if (hasGatewayServiceDefinitionOverrides(state.command) || state.command.reloadPending) throw new Error("Original service has overrides that cannot be restored by the service writer.");
		const definition = {
			command: structuredClone(state.command),
			runtimePin: readDaemonRuntimePin({
				kind: "gateway",
				env: before.serviceEnv
			}, state.command),
			fingerprint: await fingerprintGatewayServiceDefinition(state.command)
		};
		assertCurrent();
		const original = {
			root,
			nodeRunner: before.serviceNodeRunner,
			version: files.packageIdentity.version,
			verified: false,
			definition,
			service: {
				serviceEnv: { ...before.serviceEnv },
				serviceManagerUid: before.serviceManagerUid,
				serviceUpdateVerdict: {
					...verdict,
					root,
					refreshDefinition: false
				}
			},
			...files
		};
		assertCurrent();
		const context = await captureTargetDatabaseSchemaContext(before.serviceEnv, { configValidation: params.opts.run?.candidateAdmissionChecks?.includes("config") ? "candidate" : void 0 });
		assertCurrent();
		original.verified = await verifyPreviousGatewayForUpdate({
			root,
			config: context.config,
			env: context.env,
			opts: params.opts,
			timeoutMs: params.updateStepTimeoutMs,
			assertCurrent
		});
		assertCurrent();
		if (!original.verified || !original.schemaVersions) throw new Error("Original service readiness or schema support was not verified.");
		return original;
	} catch (error) {
		assertCurrent();
		throw new UpdatePreMutationError("original-service-unverified", `Cannot safely stop the retained Gateway: original service compensation could not be certified (${String(error)}). The running Gateway was not stopped; inspect its runtime before retrying the update.`, { cause: error });
	}
}
/** Read current config and every registered/configured store, never restore pre-stop state. */
async function assertOriginalServiceStateCompatible(original, assertCurrent) {
	assertCurrent();
	if (!original.verified || !original.version || !original.schemaVersions || !original.service.serviceEnv) throw new Error("Original service runtime or schema support was not verified.");
	assertCurrent();
	await assertUpdateRecoveryAdmission({ env: original.service.serviceEnv });
	assertCurrent();
	const context = await captureTargetDatabaseSchemaContext(original.service.serviceEnv);
	assertCurrent();
	const schemas = await checkTargetDatabaseSchemasForContexts(original.schemaVersions, [context]);
	assertCurrent();
	if (hasSchemaRefusal(schemas)) throw new Error("Original service does not support the current state; candidate and newer data were retained.");
	return context;
}
//#endregion
//#region src/cli/update-cli/update-command-original-service-restore.ts
/** Undo only our proved A->B rewrite. A/B custody, schema and final native lock remain mandatory. */
async function restoreOriginalManagedServiceDefinition(params) {
	const { original } = params;
	const env = { ...original.service.serviceEnv };
	await withRetainedUpdateServiceAuthority({
		...params,
		root: original.root
	}, async (assertCurrent) => withGatewayServiceOperationLock(env, async (assertNative) => {
		const assertOwned = () => {
			assertNative();
			assertCurrent();
		};
		await assertOriginalServiceStateCompatible(original, assertOwned);
		const state = await revalidateOriginalManagedServiceRuntime(original, assertOwned, params.timeoutMs, true);
		assertOwned();
		const current = await fingerprintGatewayServiceDefinition(state.command);
		assertOwned();
		const expectedPin = readDaemonRuntimePinForInstall({
			kind: "gateway",
			env,
			allowNativeRead: true
		}, state.command, true);
		assertOwned();
		if (current === original.definition.fingerprint && expectedPin.revision === original.definition.runtimePin.revision) return;
		if (!original.definition.rebound || current !== original.definition.rebound) throw new Error("Service replacement is not this update's own rebind.");
		const command = original.definition.command;
		if (hasGatewayServiceDefinitionOverrides(command) || command.reloadPending) throw new Error("Retained service has operator-owned definition overrides; restoration refused.");
		if (expectedPin.revision !== original.definition.reboundRuntimePin) throw new Error("Runtime intent changed after this update rebind; restoration refused.");
		const definition = resolveManagedGatewayServiceCommand(command) ?? command;
		await resolveGatewayService().install({
			env,
			stdout: params.stdout,
			preserveAutoStart: true,
			runtimePinUpdate: {
				expected: expectedPin,
				pin: original.definition.runtimePin.pin
			},
			assertCurrent: assertOwned,
			beforeMutation: async () => {
				await assertOriginalServiceStateCompatible(original, assertOwned);
				await revalidateOriginalManagedServiceRuntime(original, assertOwned, params.timeoutMs, true);
				assertOwned();
				params.onGatewayStartAttempted?.();
			},
			programArguments: [...definition.programArguments],
			workingDirectory: definition.workingDirectory,
			environment: { ...definition.environment },
			environmentValueSources: { ...definition.environmentValueSources }
		});
		assertOwned();
		const restored = await resolveGatewayService().readCommand(env, { requireEffective: true });
		assertOwned();
		if (!isDeepStrictEqual(restored, command)) throw new Error("Restored service does not match the captured original command.");
		const fingerprint = await fingerprintGatewayServiceDefinition(restored);
		assertOwned();
		original.definition.fingerprint = fingerprint;
		original.definition.rebound = void 0;
		original.definition.reboundRuntimePin = void 0;
		await revalidateOriginalManagedServiceRuntime(original, assertOwned, params.timeoutMs);
	}));
}
//#endregion
//#region src/cli/update-cli/update-command-service-recovery.ts
const QUIET_SERVICE_STDOUT = createNullWriter();
async function recoverLaunchAgentAndRecheckGatewayHealth(params) {
	const executor = params.updateRun?.executorFence;
	const assertCurrent = () => {
		params.updateRun?.deadline?.signal.throwIfAborted();
		executor?.assertCurrent();
		params.assertCurrent?.();
	};
	assertCurrent();
	if (params.health.healthy || params.preserveDefinition) return {
		health: params.health,
		launchAgentRecovery: null
	};
	const startedAtMs = Date.now();
	const launchAgentRecovery = await withGatewayServiceOperationLock(params.env ?? process.env, async (assertNative) => {
		const assertRecovery = () => {
			assertCurrent();
			assertNative();
		};
		assertRecovery();
		const recovery = await recoverInstalledLaunchAgentAfterUpdate({
			onGatewayStartAttempted: params.onGatewayStartAttempted,
			service: params.service,
			deadline: params.updateRun?.deadline,
			env: params.env,
			assertCurrent: assertRecovery
		});
		assertRecovery();
		return recovery;
	});
	assertCurrent();
	if (launchAgentRecovery.status !== "not-needed" && params.updateRun) {
		const endedAtMs = Date.now();
		const { runId, env } = params.updateRun;
		const repair = getUpdateRun(runId, { env })?.repair ?? [];
		recordUpdateRunRepairAttempt(runId, {
			attempt: Math.max(0, ...repair.map((entry) => entry.attempt)) + 1,
			status: launchAgentRecovery.status === "recovered" ? "succeeded" : "failed",
			startedAtMs,
			endedAtMs,
			summary: launchAgentRecovery.status === "recovered" ? launchAgentRecovery.message : launchAgentRecovery.detail
		}, { env });
	}
	if (launchAgentRecovery.status !== "recovered") return {
		health: params.health,
		launchAgentRecovery
	};
	const health = await waitForGatewayHealthyRestart({
		service: params.service,
		port: params.port,
		timeoutMs: params.updateRun?.deadline?.remainingMs() ?? params.timeoutMs,
		deadline: params.updateRun?.deadline,
		signal: params.updateRun?.deadline?.signal,
		expectedVersion: params.expectedVersion,
		...params.expectedBuildId ? { expectedBuildId: params.expectedBuildId } : {},
		requirePluginHealth: false,
		requireChannelHealth: false,
		env: params.env,
		onObservation: params.onProgress ? (snapshot) => params.onProgress?.("recovery", renderRestartDiagnostics(snapshot).join("; ")) : void 0,
		supervisorKeepsAlive: true,
		settle: { probes: 12 }
	});
	assertCurrent();
	return {
		health,
		launchAgentRecovery
	};
}
function formatPostUpdateGatewayRecoveryInstructions(result, platform = process.platform) {
	const restartCommand = formatCliCommand("openclaw gateway restart");
	const installCommand = formatCliCommand("openclaw gateway install --force");
	const statusCommand = formatCliCommand("openclaw gateway status --deep");
	const lines = [`Recovery: run \`${restartCommand}\`; if the ${platform === "darwin" ? "LaunchAgent is installed but not loaded" : platform === "linux" ? "systemd user service is missing, stale, or not active" : platform === "win32" ? "gateway Scheduled Task or Windows login item is missing, stale, or not running" : "local service manager reports the gateway service is missing, stale, or not running"}, run \`${installCommand}\` from the ${platform === "darwin" ? "logged-in macOS user session" : "same user account"}, then rerun \`${statusCommand}\`.`];
	const beforeVersion = normalizeOptionalString(result.before?.version);
	if (isPackageManagerUpdateMode(result.mode) && beforeVersion) lines.push(`Rollback: reinstall OpenClaw ${beforeVersion} with the same package manager, then rerun \`${installCommand}\`.`);
	return lines;
}
function refuseUnsettledDoctorRecovery(result, root, assertCurrent) {
	const settlement = result.steps.findLast((step) => step.name === "doctor process settlement");
	if (settlement && (settlement.exitCode !== 0 || settlement.command !== "settle doctor process groups" || settlement.cwd !== root)) {
		assertCurrent();
		result.recovery = {
			serviceRestartSafe: false,
			reason: "runtime-verification-failed",
			dataAtRisk: "active-mutation"
		};
		return true;
	}
	return false;
}
async function admitInstalledGatewayRecovery(params, result, assertCurrent) {
	const root = result.root ?? params.root;
	if (refuseUnsettledDoctorRecovery(result, root, assertCurrent)) return false;
	const settlement = result.steps.findLast((step) => step.name === "doctor process settlement");
	const databaseRollback = result.steps.findLast((step) => step.name === "database rollback");
	const plugins = result.postUpdate?.plugins;
	const currentCore = params.coreAlreadyCurrent === true && !params.packageTransaction && result.status === "error" && (settlement !== void 0 || plugins?.status === "error" && plugins.reason === "post-plugin-doctor-execution-failed" && (plugins.failureFacts?.length ?? 0) > 0);
	if (!currentCore && result.reason !== "state-migrated-no-rollback" || result.recovery?.serviceRestartSafe === false && result.recovery.dataAtRisk && result.recovery.dataAtRisk !== "state-migrated-no-rollback" || params.originalManagedServiceRuntime || !params.shouldRestart || !params.preManagedServiceStop?.stopped || databaseRollback?.exitCode === 0 || !currentCore && !settlement && !databaseRollback && !params.candidateSchemaVersions || result.recovery?.serviceRestartSafe === false && result.recovery.reason === "source-rollback-failed") return false;
	assertCurrent();
	await params.packageTransaction?.assertRollbackSafe?.();
	const version = await readPackageVersion(root);
	const buildId = await readBuiltGatewayBuildId(root);
	assertCurrent();
	if (!version) throw new UpdateCommandRecoveryPendingError("Migrated Gateway runtime identity is unavailable.");
	const candidate = params.candidateSchemaVersions;
	if (candidate) {
		const env = params.ownedManagedUpdateEnv ?? params.preManagedServiceStop.serviceEnv ?? params.opts.run?.env ?? process.env;
		const sharedPath = resolveOpenClawStateSqlitePath(env);
		const inspect = async () => {
			const databases = await readUpdateStateSchemaVersions({
				stateDir: resolveStateDir(env),
				config: params.configSnapshot.config,
				env,
				root,
				nodeRunner: params.packageUpdateNodeRunner,
				timeoutMs: params.updateStepTimeoutMs
			});
			assertCurrent();
			return databases.flatMap((database) => {
				const observed = resolveUpdateStateContentVersion(database);
				const expected = database.path === sharedPath ? candidate.state : candidate.agent;
				return observed !== null && observed !== expected ? [{
					...database,
					observed,
					expected
				}] : [];
			});
		};
		const startedAt = Date.now();
		const recordMigrationRecovery = (exitCode, message) => {
			result.steps.push({
				name: "gateway migration recovery",
				command: "openclaw doctor --fix",
				cwd: root,
				durationMs: Date.now() - startedAt,
				exitCode,
				...exitCode === 0 ? { stdoutTail: message } : { stderrTail: message }
			});
		};
		try {
			let pending = await inspect();
			if (pending.length && pending.every((database) => database.observed < database.expected)) {
				const { runUpdateFinalizationDoctorInFreshProcess } = await import("./update-command-fresh-doctor-1021lnXo.mjs");
				assertCurrent();
				await withOwnedManagedUpdateEnv(env, () => runUpdateFinalizationDoctorInFreshProcess({
					phase: "pre-plugin",
					root,
					opts: params.opts,
					yes: params.opts.yes === true,
					json: params.opts.json === true,
					nodeRunner: params.packageUpdateNodeRunner,
					timeoutMs: params.updateStepTimeoutMs,
					assertCurrent,
					onDoctorStep: (step) => result.steps.push(step)
				}));
				assertCurrent();
				pending = await inspect();
				if (!pending.length) recordMigrationRecovery(0, "Required database migrations completed before Gateway recovery.");
			}
			if (pending.length) throw new Error(pending.map((database) => `${database.path}: expected schema ${database.expected}, found ${database.observed}`).join("; "));
		} catch (error) {
			if (hasCommandProcessCleanupError(error)) throw error;
			assertCurrent();
			const message = `Run \`${formatCliCommand("openclaw doctor --fix", env)}\`, then \`${formatCliCommand("openclaw gateway start", env)}\`. Gateway migration recovery did not finish: ${formatErrorMessage(error)}.`;
			result.recovery = {
				serviceRestartSafe: false,
				reason: "runtime-verification-failed",
				dataAtRisk: "incomplete-migration"
			};
			recordMigrationRecovery(1, message);
			defaultRuntime.error(message);
			return false;
		}
	}
	if (result.reason === "state-migrated-no-rollback") result.reason = "post-update-failed";
	result.recovery = {
		serviceRestartSafe: true,
		version,
		...buildId ? { buildId } : {}
	};
	if (params.opts.run) recordUpdateRunDiagnostics(params.opts.run.runId, { recovery: result.recovery }, (message) => defaultRuntime.error(message), { env: params.opts.run.env });
	return true;
}
async function maybeRestartServiceAfterFailedMutableUpdate(params) {
	const run = params.updateRun;
	const executor = run?.executorFence;
	const assertCurrent = () => {
		if (params.updateRun !== run || run?.executorFence !== executor || run && !executor) throw new UpdateCommandRecoveryPendingError("Service recovery lost its original update executor.");
		params.updateRun?.deadline?.signal.throwIfAborted();
		executor?.assertCurrent();
	};
	const before = params.preManagedServiceStop;
	const original = params.originalManagedServiceRuntime;
	if (!before?.serviceEnv || !before.stopped && !original?.definition.rebound) return;
	const serviceEnv = { ...original?.service.serviceEnv ?? before.serviceEnv };
	const packageRecovery = params.recovery?.serviceRestartSafe === true && params.recovery.version ? params.recovery : void 0;
	if (!original && !packageRecovery) {
		defaultRuntime.error("Managed gateway remains stopped: update safety is unverified. Run `openclaw doctor` and inspect the update failure before restarting.");
		return "failed";
	}
	assertCurrent();
	try {
		const verdict = before.serviceUpdateVerdict;
		if (!verdict || !("root" in verdict)) throw new Error("Stopped service ownership is unknown; restart it manually after inspection.");
		const assertOriginal = original ? originalServiceAuthority(run) : assertCurrent;
		const checkOriginal = async () => {
			assertCurrent();
			assertOriginal();
			if (original) {
				await assertOriginalServiceStateCompatible(original, assertOriginal);
				await revalidateOriginalManagedServiceRuntime(original, assertOriginal, params.timeoutMs);
			}
			assertCurrent();
		};
		if (original && run) await restoreOriginalManagedServiceDefinition({
			original,
			run,
			onGatewayStartAttempted: params.onGatewayStartAttempted,
			assertCurrent: assertOriginal,
			stdout: params.jsonMode ? QUIET_SERVICE_STDOUT : process.stdout,
			timeoutMs: params.timeoutMs
		});
		await checkOriginal();
		const service = resolveGatewayService();
		let expectedService = original?.service ?? before;
		const readCurrentService = async () => {
			assertCurrent();
			const state = await readGatewayServiceStateForUpdate(service, serviceEnv, params.timeoutMs, {
				managerUid: expectedService.serviceManagerUid,
				assertCurrent: assertOriginal
			});
			assertCurrent();
			const inspection = await revalidateManagedGatewayServiceAfterUpdate({
				state,
				root: original?.root ?? verdict.root,
				preManagedServiceStop: expectedService
			});
			assertCurrent();
			expectedService = {
				serviceManagerUid: original?.service.serviceManagerUid ?? before.serviceManagerUid,
				serviceEnv: state.env,
				serviceUpdateVerdict: inspection.kind === "owned" ? {
					...inspection,
					refreshDefinition: false
				} : inspection
			};
			return state;
		};
		const state = await readCurrentService();
		const port = await resolveUpdatedGatewayRestartPort({
			serviceEnv: state.env,
			serviceCommand: state.command
		});
		assertCurrent();
		const current = await readCurrentService();
		await checkOriginal();
		if (original && run) {
			const restart = await restartRetainedUpdateGatewayService({
				onGatewayStartAttempted: params.onGatewayStartAttempted,
				run,
				root: original.root,
				env: serviceEnv,
				stdout: params.jsonMode ? QUIET_SERVICE_STDOUT : process.stdout,
				assertCurrent: assertOriginal,
				revalidate: checkOriginal
			});
			await checkOriginal();
			if (restart.outcome !== "completed") throw new UpdateCommandRecoveryPendingError("Original service restart was scheduled; recovery remains unverified.");
			await before.windowsTaskAutoStartRecovery?.restore(true, checkOriginal, assertOriginal);
			await checkOriginal();
		} else {
			await before.windowsTaskAutoStartRecovery?.restore(true, async () => {
				await readCurrentService();
			}, assertCurrent);
			assertCurrent();
			await runUpdatedInstallGatewayCommand({
				onGatewayStartAttempted: params.onGatewayStartAttempted,
				result: { root: original?.root ?? verdict.root },
				opts: { run },
				invocationEnv: serviceEnv,
				serviceEnv: current.env,
				nodeRunner: original?.nodeRunner ?? params.nodeRunner,
				timeoutMs: params.timeoutMs,
				invocationCwd: params.invocationCwd,
				assertCurrent
			}, "restart").catch((error) => {
				if (!params.finalRecovery || !(error instanceof GatewayRestartHealthError)) throw error;
			});
		}
		assertCurrent();
		const { health } = await observeUpdateGatewayReadiness({
			serviceEnv: current.env,
			gatewayPort: port,
			timeoutMs: params.timeoutMs,
			deadline: run?.deadline,
			expectedVersion: original?.version ?? packageRecovery?.version,
			expectedBuildId: original?.buildId ?? packageRecovery?.buildId,
			requireRunningService: true,
			healthOnly: true,
			assertCurrent,
			onProgress: (stage, reason) => defaultRuntime[params.jsonMode ? "error" : "log"](`Gateway recovery (${stage}): ${reason}`),
			settle: { probes: 12 }
		});
		assertCurrent();
		if (!health.healthy || health.runtime.status !== "running") throw new Error(renderRestartDiagnostics(health).join("\n"));
		await readCurrentService();
		await checkOriginal();
		if (original) {
			const context = await assertOriginalServiceStateCompatible(original, assertOriginal);
			const ready = await verifyPreviousGatewayForUpdate({
				root: original.root,
				config: context.config,
				env: context.env,
				opts: { run },
				timeoutMs: params.timeoutMs,
				assertCurrent: assertOriginal
			});
			await checkOriginal();
			if (!ready) throw new Error("Original service independent readiness was not verified.");
			try {
				await before.windowsTaskAutoStartRecovery?.complete(true);
				assertCurrent();
			} catch (cause) {
				throw new UpdateCommandRecoveryPendingError("Original service autostart settlement failed.", { cause });
			}
		}
		if (!params.jsonMode) defaultRuntime.log(theme.muted("Recovered managed gateway service and verified readiness after failed update."));
		return "healthy";
	} catch (err) {
		if (hasCommandProcessCleanupError(err)) throw err;
		assertCurrent();
		if (err instanceof UpdateCommandRecoveryPendingError) throw err;
		const message = `Failed to restart managed gateway service after failed update: ${String(err)}. Run \`openclaw update repair\` and \`openclaw gateway status --deep\`.`;
		if (params.finalRecovery) throw new Error(message, { cause: err });
		defaultRuntime.error(message);
		return "failed";
	}
}
async function compensateOriginalManagedService(params, assertCurrent) {
	const original = params.originalManagedServiceRuntime;
	if (!original) throw new Error("Original service observation is missing.");
	const { result, opts, preManagedServiceStop: before } = params;
	const healthy = params.allowGatewayRestart !== false && await maybeRestartServiceAfterFailedMutableUpdate({
		onGatewayStartAttempted: params.onGatewayStartAttempted,
		updateRun: opts.run,
		preManagedServiceStop: before,
		originalManagedServiceRuntime: original,
		jsonMode: Boolean(opts.json),
		timeoutMs: params.timeoutMs,
		invocationCwd: params.invocationCwd
	}) === "healthy";
	assertCurrent();
	const summary = healthy ? `Original managed service ${original.version} is healthy. Requested package activation was not verified; package and state were retained.` : "Original managed service compensation was not verified; package and current state were retained.";
	return {
		result: {
			...result,
			recovery: {
				...result.recovery,
				serviceRestartSafe: false,
				reason: result.recovery?.serviceRestartSafe === false ? result.recovery.reason : "runtime-verification-failed"
			},
			steps: [...result.steps, {
				name: "original-managed-service-compensation",
				command: "openclaw gateway restart --preserve-definition",
				cwd: original.root,
				durationMs: 0,
				exitCode: healthy ? 0 : 1,
				...healthy ? { stdoutTail: summary } : { stderrTail: summary }
			}]
		},
		rolledBack: false,
		originalServiceRecovery: healthy ? "healthy" : "failed"
	};
}
//#endregion
//#region src/cli/update-cli/update-command-verification.ts
/** Observe native state when a restart fails before health probes. */
async function readFailedUpdateGatewayState(run, env, timeoutMs = GATEWAY_RESTART_PROBE_TIMEOUT_MS) {
	if (!run) return;
	const executor = run.executorFence;
	executor?.assertCurrent();
	const deadline = run.deadline ?? createGatewayRestartDeadline({ timeoutMs: Math.min(timeoutMs, 3e3) });
	let runtime;
	try {
		runtime = await deadline.run(() => deadline.read("failed update service state", () => resolveGatewayService().readRuntime(env, { timeoutMs: deadline.remainingMs() })));
	} catch (error) {
		const cleanup = await deadline.cleanup;
		if (hasCommandProcessCleanupError(error)) throw error;
		if (cleanup === "unknown") throw new CommandProcessCleanupError({ cause: error });
	} finally {
		if (!run.deadline) deadline.dispose();
	}
	executor?.assertCurrent();
	const verified = getUpdateRun(run.runId, { env: run.env })?.verification;
	if (runtime?.status === "running" && typeof runtime.pid === "number" && verified?.serviceRunning === true && verified.pid === runtime.pid) {
		const facts = { ...verified };
		delete facts.recovery;
		delete facts.rollbackOutcome;
		return facts;
	}
	return {
		serviceRunning: runtime?.status === "running" ? true : runtime?.status === "stopped" ? false : void 0,
		pid: typeof runtime?.pid === "number" ? runtime.pid : void 0,
		runningVersion: void 0,
		runningBuildId: void 0,
		versionMatch: void 0,
		readyz: false,
		coreReady: false,
		settled: false,
		channelsReady: false
	};
}
async function recordFailedUpdateGatewayState(run, env, assertCurrent, timeoutMs) {
	const facts = await readFailedUpdateGatewayState(run, env, timeoutMs);
	assertCurrent();
	if (run && facts) recordUpdateRunVerification(run.runId, facts, { env: run.env });
}
async function verifyPreviousManagedGatewayForUpdate(params) {
	const verdict = params.service.serviceUpdateVerdict;
	const installationDrift = verdict?.kind === "owned" && verdict.requiresInstallRootRefresh;
	const identity = installationDrift ? await (await import("./update-command-package-identity-DEJeLKJd.mjs")).readPackageUpdateIdentity(params.root) : void 0;
	params.assertCurrent?.();
	let verified = false;
	params.onVerification(false);
	if (!installationDrift || identity?.version) {
		verified = await verifyPreviousGatewayForUpdate({
			...params,
			expectedVersion: identity?.version ?? void 0,
			gatewayPort: params.service.servicePort,
			waitForStartup: false
		});
		params.onVerification(verified);
		if (verified && identity?.version) params.service.serviceIdentity = {
			...identity,
			version: identity.version
		};
	}
	params.assertCurrent?.();
	const run = params.opts.run;
	if (run) recordUpdateRunStep(run.runId, {
		step: "previous gateway verification",
		status: "completed",
		detail: verified ? "Previous package is running and ready." : "Previous gateway was not verified; automatic rollback cannot restart it.",
		endedAtMs: Date.now()
	}, { env: run.env });
}
function updateGatewayHealthFacts(health, port, readyz, coreReady) {
	return {
		serviceRunning: health.runtime.status === "running" ? true : health.runtime.status === "stopped" ? false : void 0,
		...typeof health.runtime.pid === "number" ? { pid: health.runtime.pid } : {},
		port,
		runningVersion: health.gatewayVersion ?? void 0,
		runningBuildId: health.gatewayBuildId ?? void 0,
		versionMatch: health.expectedVersion && health.gatewayVersion != null ? health.gatewayVersion === health.expectedVersion && !health.buildIdMismatch : void 0,
		pluginErrors: [...health.activatedPluginErrors?.map((error) => JSON.stringify(error)) ?? [], ...health.unavailablePlugins?.map((error) => JSON.stringify(error)) ?? []],
		channelsReady: readyz && getGatewayChannelWarnings(health).length === 0,
		settled: health.healthy,
		readyz,
		...coreReady !== void 0 ? { coreReady } : {}
	};
}
/** Verify core activation while preserving plugin failures as separate notices. */
async function verifyUpdatedGateway(params) {
	const startedAtMs = Date.now();
	const { proofOptions, assertCurrent } = captureUpdateGatewayReadinessOwner(params);
	const { health, readyz, http, launchAgentRecovery } = await observeUpdateGatewayReadiness({
		...params,
		assertCurrent,
		deadline: params.opts.run?.deadline ?? params.deadline
	});
	const coreReady = http?.coreReady ?? readyz;
	const verificationWarnings = getGatewayChannelWarnings(health, http).map(({ id, error }) => redactSupportDiagnosticLine(`Channel health warning (${id}: ${error}). Run openclaw channels status --probe or openclaw health --json to inspect it.`, {
		env: params.serviceEnv,
		stateDir: resolveStateDir(params.serviceEnv)
	}));
	if (health.healthy && health.authenticationError) verificationWarnings.push(redactSupportDiagnosticLine(`Gateway RPC authentication rejected (${health.authenticationError}); verified through local HTTP readiness and runtime identity.`, {
		env: params.serviceEnv,
		stateDir: resolveStateDir(params.serviceEnv)
	}));
	if (launchAgentRecovery && launchAgentRecovery.status !== "not-needed") defaultRuntime.error(launchAgentRecovery.status === "recovered" ? launchAgentRecovery.message : launchAgentRecovery.detail);
	const serviceRunning = !params.requireRunningService || health.runtime.status === "running";
	assertCurrent();
	if (params.purpose === "recovery") params.result.verification = updateGatewayHealthFacts(health, params.gatewayPort, readyz, http?.coreReady);
	else if (proofOptions.run) recordUpdateRunVerification(proofOptions.run.runId, updateGatewayHealthFacts(health, params.gatewayPort, readyz, http?.coreReady), { env: proofOptions.run.env });
	const serviceDefinitionRefusal = health.runtime?.systemd?.startRefusal;
	if (params.purpose !== "package-replacement" && serviceDefinitionRefusal && (!health.healthy || !serviceRunning || !coreReady)) return {
		ok: false,
		score: 0,
		summary: serviceDefinitionRefusal.message,
		serviceDefinitionRefusal
	};
	const recordVerificationStep = (failureFacts, detail, warning) => {
		const endedAtMs = Date.now();
		const step = {
			name: params.purpose === "recovery" ? "gateway recovery verification" : params.result.recovery?.packageRollbackVerified ? "rollback gateway verification" : "gateway verification",
			command: "gateway verification",
			cwd: params.result.root ?? process.cwd(),
			durationMs: endedAtMs - startedAtMs,
			exitCode: failureFacts ? 1 : warning && params.purpose === "recovery" ? null : 0,
			...failureFacts ? { failureFacts } : {},
			...verificationWarnings.length ? { warnings: [...warning ? [warning] : [], ...verificationWarnings] } : {},
			...warning ? {
				...params.purpose === "package-replacement" ? {} : { termination: "timeout" },
				advisory: {
					kind: "recoverable-maintenance",
					message: warning
				}
			} : {}
		};
		const index = params.result.steps.findIndex((entry) => entry.name === step.name);
		if (index === -1) params.result.steps.push(step);
		else params.result.steps[index] = step;
		const run = proofOptions.run;
		if (run && params.purpose !== "recovery") for (const row of updateRunStepsFromResultStep(step)) {
			assertCurrent();
			recordUpdateRunStep(run.runId, {
				failureFacts: void 0,
				...row,
				endedAtMs,
				detail: row.detail ?? detail
			}, { env: run.env });
		}
	};
	if (health.healthy && serviceRunning && coreReady) {
		const pluginFailures = /* @__PURE__ */ new Map();
		for (const failure of health.activatedPluginErrors ?? []) pluginFailures.set(failure.id, failure.error);
		for (const failure of health.unavailablePlugins ?? []) pluginFailures.set(failure.id, `${failure.reason}: ${failure.detail}`);
		const pluginWarnings = Array.from(pluginFailures, ([pluginId, reason]) => createPluginUpdateWarning({
			pluginId,
			reason,
			kind: "load",
			env: params.serviceEnv
		}));
		assertCurrent();
		const verifiedAtMs = Date.now();
		params.onVerified?.(verifiedAtMs);
		assertCurrent();
		recordVerificationStep();
		if (!params.opts.json) {
			defaultRuntime.log(theme.success(params.purpose === "recovery" ? "Gateway: verified serving after update failure." : "Gateway: restarted and verified."));
			for (const warning of [...pluginWarnings.map((entry) => entry.message), ...verificationWarnings]) defaultRuntime.log(theme.warn(warning));
		}
		return {
			ok: true,
			score: 7,
			summary: health.authenticationError ? "Gateway service, version, and readiness verified through local HTTP; RPC authentication needs attention." : verificationWarnings.length > 0 ? "Gateway service, version, and readiness verified; channel warnings need attention." : pluginWarnings.length > 0 ? "Gateway service, version, channels, and readiness verified; plugin failures need a retry." : "Gateway service, version, plugins, channels, and readiness verified.",
			...pluginWarnings.length > 0 ? { pluginWarnings } : {}
		};
	}
	if (params.purpose !== "package-replacement" && gatewayReadinessPending(health)) {
		const detail = [
			"Gateway readiness is pending; leaving the observed running process starting without another recovery restart or rollback.",
			...renderRestartDiagnostics(health),
			...http ? [`Last HTTP readiness response: ${http.readyz ?? "unavailable"}.`] : [],
			`Keep recovery backups and check progress with \`${formatCliCommand("openclaw gateway status --deep")}\`.`
		].join("\n");
		recordVerificationStep(void 0, detail, detail);
		defaultRuntime.error(detail);
		return {
			ok: false,
			score: 0,
			summary: "Gateway is still starting; readiness remains unverified.",
			stopReason: health.waitOutcome === "still-starting" ? "still-starting" : "gateway-readiness-pending"
		};
	}
	const httpFailed = http !== void 0 && !coreReady;
	const diagnosticLines = [
		params.purpose === "package-replacement" ? "Package update installed; Gateway readiness remains unverified with --no-restart. Its replacement restart may still be starting." : params.purpose === "recovery" ? "Gateway recovery check did not verify serving health." : "Gateway did not become healthy after restart.",
		...httpFailed ? ["Gateway /readyz did not return HTTP 200."] : [],
		...health.healthy && params.requireRunningService ? ["Gateway responded, but the managed service did not report running after restart."] : [],
		...renderRestartDiagnostics(health),
		...launchAgentRecovery && launchAgentRecovery.status !== "not-needed" ? [launchAgentRecovery.status === "recovered" ? `LaunchAgent recovery: ${launchAgentRecovery.message}` : `LaunchAgent recovery failed: ${launchAgentRecovery.detail}`] : [],
		`Restart log: ${resolveGatewayRestartLogPath(params.serviceEnv)}`,
		`Run \`${formatCliCommand("openclaw gateway status --deep")}\` for details.`,
		...formatPostUpdateGatewayRecoveryInstructions(params.result)
	];
	const reason = health.versionMismatch ? "version-mismatch" : health.buildIdMismatch ? "build-id-mismatch" : health.activatedPluginErrors?.length ? "plugin-errors" : httpFailed ? "readyz-unhealthy" : !serviceRunning ? "service-not-running" : health.waitOutcome ?? "restart-unhealthy";
	const facts = [];
	for (const [mismatch, label, code] of [[
		health.versionMismatch,
		"version",
		"version-mismatch"
	], [
		health.buildIdMismatch,
		"build",
		"build-id-mismatch"
	]]) if (mismatch) facts.push({
		check: "versionMatch",
		code,
		message: `Expected Gateway ${label} ${mismatch.expected}; observed ${mismatch.actual ?? "unavailable"}.`
	});
	if (httpFailed) facts.push({
		check: "readyz",
		code: "readyz-unhealthy",
		message: `Gateway readiness endpoint returned HTTP ${http.readyz ?? "unavailable"}; expected HTTP 200.`
	});
	if (!serviceRunning) facts.push({
		check: "service",
		code: "service-not-running",
		message: `Managed Gateway service status: ${health.runtime.status ?? "unknown"}.`
	});
	for (const { id: pluginId, error: message } of health.activatedPluginErrors ?? []) facts.push({
		check: "pluginErrors",
		code: "plugin-errors",
		pluginId,
		message
	});
	if (!facts.length || health.waitOutcome === "timeout") facts.push({
		check: "settled",
		code: health.waitOutcome ?? "restart-unhealthy",
		message: health.probeError ?? `Gateway readiness was not verified; service status: ${health.runtime.status ?? "unknown"}${health.startupPhase ? `; startup phase: ${health.startupPhase}` : ""}. Check ${formatCliCommand("openclaw gateway status --deep", params.serviceEnv)}.`
	});
	recordVerificationStep(params.purpose === "package-replacement" ? void 0 : normalizeUpdateFailureFacts(facts, params.serviceEnv), httpFailed ? "Gateway /readyz did not return HTTP 200." : reason, params.purpose === "package-replacement" ? diagnosticLines.join("\n") : void 0);
	if (params.opts.json) defaultRuntime.error(diagnosticLines.join("\n"));
	else {
		defaultRuntime.log(theme.warn(diagnosticLines[0]));
		for (const line of diagnosticLines.slice(1)) defaultRuntime.log(theme.muted(line));
	}
	const score = [
		serviceRunning,
		!health.versionMismatch,
		!health.buildIdMismatch,
		!health.activatedPluginErrors?.length,
		!health.channelProbeErrors?.length,
		health.healthy,
		readyz
	].filter(Boolean).length;
	return {
		ok: params.purpose === "package-replacement",
		score,
		summary: reason
	};
}
//#endregion
export { runUpdatedInstallGatewayCommand as _, admitInstalledGatewayRecovery as a, recoverLaunchAgentAndRecheckGatewayHealth as c, observeUpdateGatewayReadiness as d, verifyPreviousGatewayForUpdate as f, isUpdatedInstallGatewayExecutorSupported as g, isPackageManagerUpdateMode as h, verifyUpdatedGateway as i, refuseUnsettledDoctorRecovery as l, GatewayRestartHealthError as m, recordFailedUpdateGatewayState as n, compensateOriginalManagedService as o, DEFINITION_DENIAL as p, verifyPreviousManagedGatewayForUpdate as r, maybeRestartServiceAfterFailedMutableUpdate as s, readFailedUpdateGatewayState as t, observeOriginalManagedServiceRuntime as u, prepareUpdateCommandNativeGate as v };
