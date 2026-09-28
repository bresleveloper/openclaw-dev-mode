import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { p as tryReadJson } from "./json-files-C0HSMh2Z.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as normalizeUpdateFailureFacts } from "./update-failure-facts-DiyYJNo1.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { r as hasCommandProcessCleanupError, t as CommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { l as withGatewayServiceUpdateAuthority } from "./service-update-authority-DujRnzx9.mjs";
import { a as resolveGatewayRestartLogPath } from "./restart-logs-DcfskF2f.mjs";
import { t as GatewayServiceDefinitionBackupReceiptSchema } from "./service-stage-CuqWOVHS.mjs";
import { i as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-Cko-Hb6h.mjs";
import { a as resolveServiceEntrypoint, i as resolveManagedServiceNodeRunner } from "./service-layout-DuzmQnH1.mjs";
import { a as readDaemonRuntimePin, o as readDaemonRuntimePinForInstall } from "./runtime-pin-state-Bz2yXWLQ.mjs";
import { D as resolveUpdateInstallRoot } from "./restart-sentinel-KM6PPxhT.mjs";
import { i as updateRunStepsFromResultStep } from "./update-run-step-ijjXM1mH.mjs";
import { g as recordUpdateRunVerification, h as recordUpdateRunStep, p as recordUpdateRunRepairAttempt } from "./update-run-ledger-DE3m4CLB.mjs";
import { r as getUpdateRun } from "./update-run-reader-B17V1KuC.mjs";
import { t as withGatewayServiceOperationLock } from "./service-operation-lock-D6KudVp5.mjs";
import { a as resolveGatewayService, i as readGatewayServiceState } from "./service-YFvztZiz.mjs";
import { r as fingerprintGatewayServiceDefinition } from "./service-rebind-CZ92-EFp.mjs";
import { t as recoverInstalledLaunchAgent } from "./launchd-recovery-BoPKjXFC.mjs";
import { n as waitForGatewayHealthyRestart, o as renderRestartDiagnostics } from "./restart-health-DJKnlVry.mjs";
import { n as parsePackageOpenClawSchemaVersions } from "./openclaw-schema-versions-PVhojTxP.mjs";
import { o as resolveUpdatedInstallCommandEnv, s as stripGatewayServiceMarkerEnv } from "./update-command-service-env-a79RyIGw.mjs";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-CAxWdF8c.mjs";
import { t as resolveNodeRunner } from "./node-runner-Cua6MUxg.mjs";
import { a as requiresRetainedUpdateCommandOwner, c as withUpdateCommandExecutorChild, d as UpdateCommandRecoveryPendingError, r as captureUpdateCommandExecutorAuthority, t as assertRetainedUpdateCommandRoot } from "./update-command-executor-BQrAUjan.mjs";
import { n as UpdatePreMutationError } from "./shared-OuJSSGTT.mjs";
import { d as createPluginUpdateWarning, i as verifyPreviousGatewayForUpdate, n as gatewayReadinessPending, r as observeUpdateGatewayReadiness, t as captureUpdateGatewayReadinessOwner } from "./update-command-readiness-yZgWiAm5.mjs";
import { t as prepareUpdateCommandNativeGate } from "./update-command-native-gate-CQdMGbmx.mjs";
import { n as PackageIntegrityTimeoutError, r as createPackageIntegrityReader, t as PackageIntegrityLimitError } from "./package-update-integrity-sKwDye2W.mjs";
import { i as assertGatewayServiceManagementAllowedForUpdate, p as resolveUpdatedGatewayRestartPort } from "./update-command-service-plan-LoWdIMX_.mjs";
import { s as revalidateManagedGatewayServiceAfterUpdate } from "./update-command-service-maintenance-DEAFUd_Y.mjs";
import { t as assertUpdateRecoveryAdmission } from "./update-run-recovery-admission-C4Oce1TJ.mjs";
import { i as hasSchemaRefusal, n as checkTargetDatabaseSchemasForContexts, t as captureTargetDatabaseSchemaContext } from "./schema-preflight-CphqsjCw.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import { Writable } from "node:stream";
import { randomUUID } from "node:crypto";
//#region src/cli/update-cli/update-command-retained-service.ts
/** Real retained admission plus native-controller custody, never service health. */
async function withRetainedUpdateServiceAuthority(params, operation) {
	if (process.platform === "win32") throw new UpdateCommandRecoveryPendingError("Retained native recovery requires Windows Job custody.");
	const { run, root, signal } = params;
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
		if (result.termination === "exit" && result.code === 1 && result.stdout === "" && result.cleanup !== "uncertain" && result.cleanup !== "forced" && !result.stdoutTruncatedBytes && !result.stderrTruncatedBytes && result.stderr.startsWith(prefix)) {
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
	const check = await withUpdateCommandExecutorChild(params.executor, params.root, async (_grant, bindChild) => {
		const result = await runCommandWithTimeout(argv, {
			input: "",
			beforeInput: bindChild,
			baseEnv: {},
			cwd: params.root,
			env: {
				...params.env,
				OPENCLAW_NO_RESPAWN: "1"
			},
			timeoutMs: params.timeoutMs,
			killProcessTree: true,
			requireProcessTreeExtinction: true,
			...params.signal ? { signal: params.signal } : {},
			maxOutputBytes: 65536
		});
		if (result.cleanup === "forced" || result.cleanup === "uncertain") throw new CommandProcessCleanupError();
		return result;
	});
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
	const args = ["gateway", action];
	if (installing) {
		args.push("--force");
		if (params.gatewayPort !== void 0) args.push("--port", String(params.gatewayPort));
	} else args.push("--preserve-definition");
	args.push("--json");
	const nodeRunner = params.nodeRunner ?? resolveNodeRunner();
	const commandEnv = stripGatewayServiceMarkerEnv(resolveUpdatedInstallCommandEnv({
		processEnv: installing ? params.serviceInstallEnv ?? params.invocationEnv : params.invocationEnv,
		serviceEnv: installing ? void 0 : params.serviceEnv,
		invocationCwd: params.invocationCwd
	}));
	if (executor) commandEnv.OPENCLAW_NO_RESPAWN = "1";
	params.signal?.throwIfAborted();
	assertCurrent();
	const receiveInstallResult = (stdout) => {
		const response = safeParseJsonRecord(stdout);
		if (!installing || !response) return;
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
	};
	const installTimeoutMs = params.timeoutMs ?? 12e5;
	if (run && !executor) throw new UpdateCommandRecoveryPendingError("Native command requires its original update executor.");
	if (executor) {
		let definitionBackupSupported = false;
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
		const result = await runCommandWithTimeout(argv, {
			baseEnv: {},
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
			timeoutMs: installing ? installTimeoutMs : params.timeoutMs,
			...params.signal ? { signal: params.signal } : {},
			killProcessTree: true,
			requireProcessTreeExtinction: true
		});
		if (result.cleanup === "forced" || result.cleanup === "uncertain") throw new CommandProcessCleanupError();
		return result;
	};
	const res = executor ? await withUpdateCommandExecutorChild(executor, params.result.root, runChild) : await runChild();
	params.signal?.throwIfAborted();
	assertCurrent();
	const exited = res.termination === "exit" && res.signal === null && !res.killed && res.cleanup !== "forced" && res.cleanup !== "uncertain";
	const complete = !res.stdoutTruncatedBytes && !res.outputLimitExceeded && !res.outputErrorStream;
	const response = complete ? safeParseJsonRecord(res.stdout) : void 0;
	if (complete) receiveInstallResult(res.stdout);
	const original = params.originalManagedServiceRuntime;
	if (installing && original && exited && complete) {
		const receipt = response && safeParseJsonRecord(JSON.stringify(response.rebind));
		if (receipt?.before === original.definition.fingerprint && typeof receipt.after === "string" && /^[a-f0-9]{64}$/.test(receipt.after) && receipt.runtimePinBefore === original.definition.runtimePin.revision && typeof receipt.runtimePinAfter === "string" && /^[a-f0-9]{64}$/.test(receipt.runtimePinAfter)) {
			if (receipt.mutated === true || receipt.after !== receipt.before || receipt.runtimePinAfter !== receipt.runtimePinBefore) {
				original.definition.rebound = receipt.after;
				original.definition.reboundRuntimePin = receipt.runtimePinAfter;
			}
		} else throw new Error("Native install did not return its original-definition receipt; compensation must revalidate the unchanged original.");
	}
	if (exited && res.code === 0) return response?.action === action && response.ok === true && action === "restart" && (response.result === "restarted" || response.result === "scheduled") ? "accepted" : "unverified";
	const message = `updated install ${installing ? "refresh" : action} failed (${entrypoint}): ${formatCommandFailure(res.stdout, res.stderr)}`;
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
			assertCurrent: () => {
				assertNative();
				assertCurrent();
			},
			preserveDefinition: true,
			preserveAutoStart: true
		});
	}));
}
//#endregion
//#region src/cli/update-cli/update-command-launch-agent-recovery.ts
async function recoverInstalledLaunchAgentAfterUpdate(params) {
	params.assertCurrent?.();
	if ((params.deps?.platform ?? process.platform) !== "darwin") return {
		attempted: false,
		recovered: false
	};
	const service = params.service ?? resolveGatewayService();
	const readState = params.deps?.readState ?? readGatewayServiceState;
	const recover = params.deps?.recover ?? recoverInstalledLaunchAgent;
	const state = await readState(service, { env: params.env }).catch(() => null);
	params.assertCurrent?.();
	if (!state || state.loadState.status !== "not-loaded" || !state.installed) return {
		attempted: false,
		recovered: false
	};
	let recovered;
	try {
		recovered = await recover({
			result: "restarted",
			env: state.env
		});
		params.assertCurrent?.();
	} catch (error) {
		params.assertCurrent?.();
		return {
			attempted: true,
			recovered: false,
			detail: error instanceof Error ? error.message : String(error)
		};
	}
	if (!recovered) return {
		attempted: true,
		recovered: false,
		detail: "LaunchAgent was installed but not loaded; automatic bootstrap/kickstart recovery failed."
	};
	return {
		attempted: true,
		recovered: true,
		message: recovered.message
	};
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
	assertCurrent();
	const launcherPath = params.command && resolveServiceEntrypoint(params.command);
	if (!packageIdentity || !launcherPath) throw new Error("Original service directory or launcher identity is unavailable.");
	const realPath = await fs.realpath(launcherPath);
	assertCurrent();
	const fingerprint = await reader.launcher(launcherPath);
	assertCurrent();
	const targetFingerprint = await reader.launcher(realPath);
	assertCurrent();
	const node = await nodeIdentity(params.nodeRunner);
	assertCurrent();
	const buildId = await readBuiltGatewayBuildId(root) ?? void 0;
	assertCurrent();
	const schemaVersions = parsePackageOpenClawSchemaVersions(await tryReadJson(path.join(root, "package.json")));
	assertCurrent();
	const finalIdentity = await reader.directoryIdentity(root);
	assertCurrent();
	if (!isDeepStrictEqual(finalIdentity, packageIdentity)) throw new Error("Original service directory changed during mandatory reads.");
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
	const authority = captureUpdateCommandExecutorAuthority(executor);
	return () => {
		if (run.executorFence !== executor || !isDeepStrictEqual(captureUpdateCommandExecutorAuthority(executor), authority)) throw new UpdateCommandRecoveryPendingError("Original service recovery lost its admitted executor.");
		executor.assertCurrent();
	};
}
async function revalidateOriginalManagedServiceRuntime(original, assertCurrent, timeoutMs, allowOwnRebind = false) {
	assertCurrent();
	const state = await readGatewayServiceState(resolveGatewayService(), {
		env: original.service.serviceEnv,
		requireEffective: true,
		requireLoadedCommand: true,
		validateEnvBeforeStatusRead: assertGatewayServiceManagementAllowedForUpdate,
		timeoutMs
	});
	assertCurrent();
	const definition = await fingerprintGatewayServiceDefinition(state.command);
	assertCurrent();
	const ownRebind = allowOwnRebind && original.definition.rebound === definition;
	const runtimePin = readDaemonRuntimePinForInstall({
		kind: "gateway",
		env: original.service.serviceEnv ?? {}
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
	if (original.packageFingerprint) try {
		const fingerprint = await createPackageIntegrityReader(timeoutMs).tree(original.root);
		assertCurrent();
		if (!isDeepStrictEqual(fingerprint, original.packageFingerprint)) throw new Error("Original managed service package changed; compensation was refused.");
	} catch (error) {
		assertCurrent();
		if (!(error instanceof PackageIntegrityTimeoutError || error instanceof PackageIntegrityLimitError)) throw error;
		original.packageFingerprintWarning = error instanceof PackageIntegrityTimeoutError ? `Original service full package fingerprint timed out (scan budget ${error.budgetMs} ms); full package contents are unverified. Mandatory runtime identities still require revalidation.` : `Original service full package fingerprint unavailable (${error.message}); full package contents are unverified. Mandatory runtime identities still require revalidation.`;
		defaultRuntime.error(original.packageFingerprintWarning);
	}
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
		const state = await readGatewayServiceState(resolveGatewayService(), {
			env: before.serviceEnv,
			requireEffective: true,
			requireLoadedCommand: true,
			validateEnvBeforeStatusRead: assertGatewayServiceManagementAllowedForUpdate,
			timeoutMs: params.updateStepTimeoutMs
		});
		assertCurrent();
		const files = await readOriginalServiceFiles({
			root,
			nodeRunner: before.serviceNodeRunner,
			command: state.command,
			assertCurrent,
			timeoutMs: params.updateStepTimeoutMs
		});
		if (!state.command) throw new Error("Original service definition is unavailable.");
		if (state.command.managedOverrides || state.command.managedDefinition || state.command.reloadPending) throw new Error("Original service has overrides that cannot be restored by the canonical writer.");
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
		const startedAt = performance.now();
		try {
			original.packageFingerprint = await createPackageIntegrityReader(params.updateStepTimeoutMs).tree(root);
			assertCurrent();
			if (original.packageFingerprint.identity !== files.packageIdentity.identity || original.packageFingerprint.version !== files.packageIdentity.version) throw new Error("Original managed service package changed during observation.");
		} catch (error) {
			assertCurrent();
			if (!(error instanceof PackageIntegrityTimeoutError || error instanceof PackageIntegrityLimitError)) throw error;
			original.packageFingerprintWarning = error instanceof PackageIntegrityTimeoutError ? `Original service full package fingerprint unavailable after ${Math.round(performance.now() - startedAt)} ms (scan budget ${error.budgetMs} ms). Compensation requires directory, version and launcher revalidation; full package contents are unverified.` : `Original service full package fingerprint unavailable (${error.message}). Compensation requires directory, version and launcher revalidation; full package contents are unverified.`;
			defaultRuntime.error(original.packageFingerprintWarning);
		}
		assertCurrent();
		const context = await captureTargetDatabaseSchemaContext(before.serviceEnv);
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
		await revalidateOriginalManagedServiceRuntime(original, assertCurrent, params.updateStepTimeoutMs);
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
			env
		}, state.command, true);
		assertOwned();
		if (current === original.definition.fingerprint && expectedPin.revision === original.definition.runtimePin.revision) return;
		if (!original.definition.rebound || current !== original.definition.rebound) throw new Error("Service replacement is not this update's own rebind.");
		const command = original.definition.command;
		if (command.managedOverrides || command.managedDefinition || command.reloadPending) throw new Error("Retained service has operator-owned definition overrides; restoration refused.");
		if (expectedPin.revision !== original.definition.reboundRuntimePin) throw new Error("Runtime intent changed after this update rebind; restoration refused.");
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
			},
			programArguments: [...command.programArguments],
			workingDirectory: command.workingDirectory,
			environment: { ...command.environment },
			environmentValueSources: { ...command.environmentValueSources }
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
const QUIET_SERVICE_STDOUT = new Writable({ write(_chunk, _encoding, callback) {
	callback();
} });
async function recoverLaunchAgentAndRecheckGatewayHealth(params) {
	const executor = params.updateRun?.executorFence;
	const assertCurrent = () => {
		executor?.assertCurrent();
		params.assertCurrent?.();
	};
	assertCurrent();
	if (params.health.healthy || params.preserveDefinition) return {
		health: params.health,
		launchAgentRecovery: null
	};
	const recoverLaunchAgent = params.deps?.recoverLaunchAgent ?? recoverInstalledLaunchAgentAfterUpdate;
	const startedAtMs = Date.now();
	const launchAgentRecovery = await withGatewayServiceOperationLock(params.env ?? process.env, async (assertNative) => {
		const assertRecovery = () => {
			assertCurrent();
			assertNative();
		};
		assertRecovery();
		const recovery = await recoverLaunchAgent({
			service: params.service,
			env: params.env,
			assertCurrent: assertRecovery
		});
		assertRecovery();
		return recovery;
	});
	assertCurrent();
	if (launchAgentRecovery.attempted && params.updateRun) {
		const endedAtMs = Date.now();
		const { runId, env } = params.updateRun;
		const repair = getUpdateRun(runId, { env })?.repair ?? [];
		recordUpdateRunRepairAttempt(runId, {
			attempt: Math.max(0, ...repair.map((entry) => entry.attempt)) + 1,
			status: launchAgentRecovery.recovered ? "succeeded" : "failed",
			startedAtMs,
			endedAtMs,
			summary: launchAgentRecovery.recovered ? launchAgentRecovery.message : launchAgentRecovery.detail
		}, { env });
	}
	if (!launchAgentRecovery.recovered) return {
		health: params.health,
		launchAgentRecovery
	};
	const health = await (params.deps?.waitForHealthy ?? waitForGatewayHealthyRestart)({
		service: params.service,
		port: params.port,
		timeoutMs: params.timeoutMs,
		expectedVersion: params.expectedVersion,
		...params.expectedBuildId ? { expectedBuildId: params.expectedBuildId } : {},
		requirePluginHealth: params.requirePluginHealth,
		env: params.env,
		supervisorKeepsAlive: true,
		settle: { probes: 12 }
	});
	assertCurrent();
	return {
		health,
		launchAgentRecovery
	};
}
function formatPostUpdateGatewayRecoveryLine(platform) {
	const restartCommand = formatCliCommand("openclaw gateway restart");
	const installCommand = formatCliCommand("openclaw gateway install --force");
	const statusCommand = formatCliCommand("openclaw gateway status --deep");
	if (platform === "darwin") return `Recovery: run \`${restartCommand}\`; if the LaunchAgent is installed but not loaded, run \`${installCommand}\` from the logged-in macOS user session, then rerun \`${statusCommand}\`.`;
	if (platform === "linux") return `Recovery: run \`${restartCommand}\`; if the systemd user service is missing, stale, or not active, run \`${installCommand}\` from the same user account, then rerun \`${statusCommand}\`.`;
	if (platform === "win32") return `Recovery: run \`${restartCommand}\`; if the gateway Scheduled Task or Windows login item is missing, stale, or not running, run \`${installCommand}\` from the same user account, then rerun \`${statusCommand}\`.`;
	return `Recovery: run \`${restartCommand}\`; if the local service manager reports the gateway service is missing, stale, or not running, run \`${installCommand}\` from the same user account, then rerun \`${statusCommand}\`.`;
}
function formatPostUpdateGatewayRecoveryInstructions(result, platform = process.platform) {
	const lines = [formatPostUpdateGatewayRecoveryLine(platform)];
	const beforeVersion = normalizeOptionalString(result.before?.version);
	if (isPackageManagerUpdateMode(result.mode) && beforeVersion) lines.push(`Rollback: reinstall OpenClaw ${beforeVersion} with the same package manager, then rerun \`${formatCliCommand("openclaw gateway install --force")}\`.`);
	return lines;
}
async function maybeRestartServiceAfterFailedMutableUpdate(params) {
	const run = params.updateRun;
	const executor = run?.executorFence;
	const assertCurrent = () => {
		if (params.updateRun !== run || run?.executorFence !== executor || run && !executor) throw new UpdateCommandRecoveryPendingError("Service recovery lost its original update executor.");
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
			assertCurrent: assertOriginal,
			stdout: params.jsonMode ? QUIET_SERVICE_STDOUT : process.stdout,
			timeoutMs: params.timeoutMs
		});
		await checkOriginal();
		const service = resolveGatewayService();
		let expectedService = original?.service ?? before;
		const readCurrentService = async () => {
			assertCurrent();
			const state = await readGatewayServiceState(service, {
				env: serviceEnv,
				requireEffective: true,
				requireLoadedCommand: true,
				validateEnvBeforeStatusRead: assertGatewayServiceManagementAllowedForUpdate,
				timeoutMs: params.timeoutMs
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
		} else await runUpdatedInstallGatewayCommand({
			result: { root: original?.root ?? verdict.root },
			opts: {
				json: params.jsonMode,
				run
			},
			invocationEnv: serviceEnv,
			serviceEnv: current.env,
			nodeRunner: original?.nodeRunner ?? params.nodeRunner,
			timeoutMs: params.timeoutMs,
			invocationCwd: params.invocationCwd,
			assertCurrent
		}, "restart");
		assertCurrent();
		const health = await waitForGatewayHealthyRestart({
			service,
			port,
			env: current.env,
			timeoutMs: params.timeoutMs,
			expectedVersion: original?.version ?? packageRecovery?.version,
			expectedBuildId: original?.buildId ?? packageRecovery?.buildId,
			requireRunningService: true,
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
		}
		if (original) try {
			await before.windowsTaskAutoStartRecovery?.complete(true);
			assertCurrent();
		} catch (cause) {
			throw new UpdateCommandRecoveryPendingError("Original service autostart settlement failed.", { cause });
		}
		if (!params.jsonMode) defaultRuntime.log(theme.muted("Recovered managed gateway service and verified readiness after failed update."));
		return "healthy";
	} catch (err) {
		if (hasCommandProcessCleanupError(err)) throw err;
		assertCurrent();
		if (err instanceof UpdateCommandRecoveryPendingError) throw err;
		defaultRuntime.error(`Failed to restart managed gateway service after failed update: ${String(err)}. Run \`openclaw gateway status --deep\` before restarting it manually.`);
		return "failed";
	}
}
async function compensateOriginalManagedService(params, assertCurrent) {
	const original = params.originalManagedServiceRuntime;
	if (!original) throw new Error("Original service observation is missing.");
	const { result, opts, preManagedServiceStop: before } = params;
	const run = opts.run;
	const service = params.allowGatewayRestart === false ? void 0 : await maybeRestartServiceAfterFailedMutableUpdate({
		updateRun: run,
		preManagedServiceStop: before,
		originalManagedServiceRuntime: original,
		jsonMode: Boolean(opts.json),
		timeoutMs: params.timeoutMs,
		invocationCwd: params.invocationCwd
	});
	assertCurrent();
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
				exitCode: service === "healthy" ? 0 : 1,
				...service === "healthy" ? { stdoutTail: [`Original managed service ${original.version} is healthy. Requested package activation was not verified; package and state were retained.`, original.packageFingerprintWarning].filter(Boolean).join("\n") } : { stderrTail: ["Original managed service compensation was not verified; package and current state were retained.", original.packageFingerprintWarning].filter(Boolean).join("\n") }
			}]
		},
		rolledBack: false,
		originalServiceRecovery: service === "healthy" ? "healthy" : "failed"
	};
}
//#endregion
//#region src/cli/update-cli/update-command-verification.ts
/** Observe native state when a restart fails before health probes. */
async function readFailedUpdateGatewayState(run, env) {
	if (!run) return;
	const executor = run.executorFence;
	executor?.assertCurrent();
	const runtime = await resolveGatewayService().readRuntime(env).catch((error) => {
		if (hasCommandProcessCleanupError(error)) throw error;
	});
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
		settled: false,
		channelsReady: false
	};
}
async function recordFailedUpdateGatewayState(run, env, assertCurrent) {
	const facts = await readFailedUpdateGatewayState(run, env);
	assertCurrent();
	if (run && facts) recordUpdateRunVerification(run.runId, facts, { env: run.env });
}
async function verifyPreviousManagedGatewayForUpdate(params) {
	const verdict = params.service.serviceUpdateVerdict;
	const installationDrift = verdict?.kind === "owned" && verdict.requiresInstallRootRefresh;
	const identity = installationDrift ? await (await import("./update-command-package-DSafpExY.mjs")).readPackageUpdateIdentity(params.root) : void 0;
	params.assertCurrent?.();
	let verified = false;
	params.onVerification(false);
	if (!installationDrift || identity?.version) {
		verified = await verifyPreviousGatewayForUpdate({
			...params,
			expectedVersion: identity?.version ?? void 0,
			gatewayPort: params.service.servicePort
		});
		params.onVerification(verified);
		if (verified && identity?.version) params.service.serviceIdentity = {
			...identity,
			version: identity.version
		};
	}
	params.assertCurrent?.();
	recordPreviousGatewayVerification(params.opts.run, verified);
}
function recordPreviousGatewayVerification(run, verified) {
	if (!run) return;
	recordUpdateRunStep(run.runId, {
		step: "previous gateway verification",
		status: "completed",
		detail: verified ? "Previous package is running and ready." : "Previous gateway was not verified; automatic rollback cannot restart it.",
		endedAtMs: Date.now()
	}, { env: run.env });
}
function recordUpdateGatewayHealth(run, health, port, readyz = false) {
	if (!run) return;
	recordUpdateRunVerification(run.runId, updateGatewayHealthFacts(health, port, readyz), { env: run.env });
}
function updateGatewayHealthFacts(health, port, readyz) {
	return {
		serviceRunning: health.runtime.status === "running" ? true : health.runtime.status === "stopped" ? false : void 0,
		...typeof health.runtime.pid === "number" ? { pid: health.runtime.pid } : {},
		port,
		runningVersion: health.gatewayVersion ?? void 0,
		runningBuildId: health.gatewayBuildId ?? void 0,
		versionMatch: health.expectedVersion && health.gatewayVersion != null ? health.gatewayVersion === health.expectedVersion && !health.buildIdMismatch : void 0,
		pluginErrors: [...health.activatedPluginErrors?.map((error) => JSON.stringify(error)) ?? [], ...health.unavailablePlugins?.map((error) => JSON.stringify(error)) ?? []],
		channelsReady: health.healthy && !health.channelProbeErrors?.length,
		settled: health.healthy,
		readyz
	};
}
/** Verify core activation while preserving plugin failures as separate notices. */
async function verifyUpdatedGateway(params) {
	const startedAtMs = Date.now();
	const { proofOptions, assertCurrent } = captureUpdateGatewayReadinessOwner(params);
	const { health, readyz, http, launchAgentRecovery } = await observeUpdateGatewayReadiness({
		...params,
		assertCurrent
	});
	if (launchAgentRecovery?.attempted) defaultRuntime.error(launchAgentRecovery.recovered ? launchAgentRecovery.message : launchAgentRecovery.detail);
	const serviceRunning = !params.requireRunningService || health.runtime.status === "running";
	assertCurrent();
	if (params.purpose === "recovery") params.result.verification = updateGatewayHealthFacts(health, params.gatewayPort, readyz);
	else recordUpdateGatewayHealth(proofOptions.run, health, params.gatewayPort, readyz);
	const recordVerificationStep = (failureFacts, detail, warning) => {
		const endedAtMs = Date.now();
		const step = {
			name: params.purpose === "recovery" ? "gateway recovery verification" : params.result.recovery?.packageRollbackVerified ? "rollback gateway verification" : "gateway verification",
			command: "gateway verification",
			cwd: params.result.root ?? process.cwd(),
			durationMs: endedAtMs - startedAtMs,
			exitCode: failureFacts ? 1 : warning && params.purpose === "recovery" ? null : 0,
			...failureFacts ? { failureFacts } : {},
			...warning ? {
				termination: "timeout",
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
	if (health.healthy && serviceRunning && readyz) {
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
			for (const warning of pluginWarnings) defaultRuntime.log(theme.warn(warning.message));
		}
		return {
			ok: true,
			score: 7,
			summary: pluginWarnings.length > 0 ? "Gateway service, version, channels, and readiness verified; plugin failures need a retry." : "Gateway service, version, plugins, channels, and readiness verified.",
			...pluginWarnings.length > 0 ? { pluginWarnings } : {}
		};
	}
	if (gatewayReadinessPending(health)) {
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
	const httpFailed = http !== void 0 && !readyz;
	const diagnosticLines = [
		params.purpose === "recovery" ? "Gateway recovery probe did not verify serving health." : "Gateway did not become healthy after restart.",
		...httpFailed ? ["Gateway /readyz did not return HTTP 200."] : [],
		...health.healthy && params.requireRunningService ? ["Gateway responded, but the managed service did not report running after restart."] : [],
		...renderRestartDiagnostics(health),
		...launchAgentRecovery?.attempted ? [launchAgentRecovery.recovered ? `LaunchAgent recovery: ${launchAgentRecovery.message}` : `LaunchAgent recovery failed: ${launchAgentRecovery.detail}`] : [],
		`Restart log: ${resolveGatewayRestartLogPath(params.serviceEnv)}`,
		`Run \`${formatCliCommand("openclaw gateway status --deep")}\` for details.`,
		...formatPostUpdateGatewayRecoveryInstructions(params.result)
	];
	const reason = health.versionMismatch ? "version-mismatch" : health.buildIdMismatch ? "build-id-mismatch" : health.activatedPluginErrors?.length ? "plugin-errors" : health.channelProbeErrors?.length ? "channel-errors" : httpFailed ? "readyz-unhealthy" : !serviceRunning ? "service-not-running" : health.waitOutcome ?? "restart-unhealthy";
	const facts = [];
	if (health.versionMismatch) facts.push({
		check: "versionMatch",
		code: "version-mismatch",
		message: `Expected Gateway version ${health.versionMismatch.expected}; observed ${health.versionMismatch.actual ?? "unavailable"}.`
	});
	if (health.buildIdMismatch) facts.push({
		check: "versionMatch",
		code: "build-id-mismatch",
		message: `Expected Gateway build ${health.buildIdMismatch.expected}; observed ${health.buildIdMismatch.actual ?? "unavailable"}.`
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
	for (const error of health.activatedPluginErrors ?? []) facts.push({
		check: "pluginErrors",
		code: "plugin-errors",
		pluginId: error.id,
		message: error.error
	});
	for (const error of health.channelProbeErrors ?? []) facts.push({
		check: "channelsReady",
		code: "channel-errors",
		pluginId: error.id,
		message: error.error
	});
	if (!facts.length) facts.push({
		check: "settled",
		code: health.waitOutcome ?? "restart-unhealthy",
		message: health.probeError ?? `Gateway did not settle${health.startupPhase ? `; startup phase: ${health.startupPhase}` : "."}`
	});
	recordVerificationStep(normalizeUpdateFailureFacts(facts, params.serviceEnv), httpFailed ? "Gateway /readyz did not return HTTP 200." : reason);
	if (params.opts.json) defaultRuntime.error(diagnosticLines.join("\n"));
	else {
		defaultRuntime.log(theme.warn(diagnosticLines[0]));
		for (const line of diagnosticLines.slice(1)) defaultRuntime.log(theme.muted(line));
	}
	return {
		ok: false,
		score: [
			serviceRunning,
			!health.versionMismatch,
			!health.buildIdMismatch,
			!health.activatedPluginErrors?.length,
			!health.channelProbeErrors?.length,
			health.healthy,
			readyz
		].filter(Boolean).length,
		summary: reason
	};
}
//#endregion
export { verifyUpdatedGateway as a, recoverLaunchAgentAndRecheckGatewayHealth as c, GatewayRestartHealthError as d, isPackageManagerUpdateMode as f, verifyPreviousManagedGatewayForUpdate as i, observeOriginalManagedServiceRuntime as l, runUpdatedInstallGatewayCommand as m, recordFailedUpdateGatewayState as n, compensateOriginalManagedService as o, isUpdatedInstallGatewayExecutorSupported as p, recordUpdateGatewayHealth as r, maybeRestartServiceAfterFailedMutableUpdate as s, readFailedUpdateGatewayState as t, DEFINITION_DENIAL as u };
