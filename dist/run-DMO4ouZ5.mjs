import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { r as isForegroundGatewayRunArgv } from "./gateway-run-argv-uoU8-Fwk.mjs";
import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { t as drainGlobalSingletonLifecycleState } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { i as GATEWAY_SERVICE_RUNTIME_PID_ENV } from "./constants-BLghGsId.mjs";
import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { a as measureGatewayBootstrapStep, s as recordGatewayBootstrapStep } from "./startup-trace-AW_r3L-l.mjs";
import "./src-Djeo9OvP.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as defaultRuntime, t as ExitError } from "./runtime-BazLsT0s.mjs";
import { o as hasConfiguredSecretInput } from "./types.secrets-Dgbd2kyP.mjs";
import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { t as isAbortError } from "./abort-signal-C9DFO3n5.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { n as parseTcpPort } from "./tcp-port-B-4SirsX.mjs";
import { b as resolveGatewayPort, u as normalizeStateDirEnv } from "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as setVerbose } from "./global-state-BAD7XgmL.mjs";
import { s as registerSignalExitOwner } from "./signal-exit-barrier-DtR3X_NN.mjs";
import { n as flushLogger } from "./logger-DR3u4tgD.mjs";
import { a as setConsoleSubsystemFilter, o as setConsoleTimestampPrefix } from "./console-CML7QnOp.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { _ as ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV } from "./config-env-vars-BHneg24Q.mjs";
import { t as getFileLockProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { n as createCpuTrackedWorker } from "./worker-cpu-c5lFIb1t.mjs";
import { r as cleanupSnapshotOperations } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { r as findStartupMaintenanceRequiredError } from "./startup-maintenance-required-D0mOtveg.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { i as formatExternalSupervisorActionRequired } from "./gateway-supervision-CO5zyEkR.mjs";
import { n as clearRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { r as flushDiagnosticsTimeline } from "./diagnostics-timeline-BgymzmGj.mjs";
import { S as runOutsideGatewayRootWorkAdmission, i as beginGatewayShutdownCleanup, n as beginGatewayRestartSignalAdmission } from "./gateway-work-admission-FWbk4b3p.mjs";
import { r as SqliteIntegrityWorkerInterruptedError } from "./sqlite-integrity-worker-DyRlMgGE.mjs";
import { a as isConfigReadFailure, n as createConfigReadError, o as isDoctorRecoverableInvalidConfigError, s as isInvalidConfigError } from "./io.invalid-config-CsqYoW4w.mjs";
import { t as isContainerEnvironment } from "./container-environment-e2wGNmXf.mjs";
import { g as resolveGatewayBindHost, s as isLoopbackHost, t as defaultGatewayBindMode } from "./net-CjQwRK-V.mjs";
import { n as TailscaleBackendStoppedError } from "./tailscale-backend-stopped-error-OXMrDgXx.mjs";
import { l as isTailscaleRouteOwnershipConflictError } from "./tailscale-DIe8yR1S.mjs";
import "./globals-XVSoVbNQ.mjs";
import { n as runWithProcessCleanupBudget } from "./cleanup-budget-B-yQr9sD.mjs";
import { i as withDiagnosticPhase } from "./diagnostic-phase-Ci2ThI_i.mjs";
import { t as formatGatewayDrainCounts } from "./gateway-drain-B-8TjNxn.mjs";
import { n as consumeGatewaySuspendHandoff, r as disarmGatewaySuspendHandoff } from "./gateway-suspend-coordinator-DPGYs58l.mjs";
import { a as formatGatewayPendingCloseSteps, c as measureGatewayRestartTrace, m as startGatewayRestartTrace, o as markGatewayRestartTrace, r as createGatewayRestartTraceHandoffEnv, t as captureGatewayRestartTraceHandoff } from "./restart-trace-BTv1cWuA.mjs";
import { t as GatewayStartupCleanupError } from "./server-shutdown-DFAyEigO.mjs";
import { r as setGatewayWsLogStyle } from "./ws-logging-C8WMeY6y.mjs";
import { t as isChannelStartupSuppressedByEnvironment } from "./server-sidecar-startup-mode-BZT1Vmld.mjs";
import { m as normalizeSystemdUnit } from "./restart-B5lVkjlo.mjs";
import { c as resolveLauncherStopTimeoutMs, i as GATEWAY_SHUTDOWN_TIMEOUT_MS, l as resolveShutdownReserveMs, s as isRespawnedByLauncher, u as resolveSupervisorExitMarginMs } from "./gateway-shutdown-budget-Drh-C246.mjs";
import "./gateway-shutdown-budget-c8dOC7fR.mjs";
import { C as SYSTEMD_DEFAULT_STOP_TIMEOUT_MS, F as execSystemctl, I as execSystemctlUser, w as parseSystemdTimeSpanMs } from "./systemd-service-files-C3V-PDoO.mjs";
import { i as isGatewayLifecycleContentionError, n as GatewayLockError, r as acquireGatewayLock } from "./gateway-lock-OT1e72lx.mjs";
import { b as formatGatewayPidList, y as findVerifiedGatewayListenerPidsOnPortSync } from "./schtasks-Cm91eO2_.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-DxyNaz_g.mjs";
import { b as formatLaunchctlResultDetail, y as execLaunchctl } from "./launchd-service-files-CqGEulnB.mjs";
import "./launchd-plist-D6ncxWm8.mjs";
import { g as resolveLaunchAgentGuiDomain, u as probeLaunchAgentState } from "./launchd-runtime-CuRpYSjr.mjs";
import { a as getGatewayInstallationReplacement, o as registerGatewayInstallationReplacementHandler } from "./stale-install-CUqZoIvN.mjs";
import { n as isGatewayEffectiveConfigConflictError } from "./server-runtime-config-DMkOSMz0.mjs";
import { n as requestExitAfterOneShotOutput, r as requestSettledExitWatchdog } from "./one-shot-exit-DmuNrGrj.mjs";
import { i as detectRespawnSupervisor } from "./supervisor-markers-D4rfU3wJ.mjs";
import { t as parseKeyValueOutput } from "./runtime-parse-CUlWcrjY.mjs";
import { t as createConfiguredGatewayLocalProbe } from "./local-http-probe-DfgRYt3l.mjs";
import { n as formatInvalidConfigPort, r as formatInvalidPortOption } from "./error-format-Cd0oOG4L.mjs";
import { t as printClawBanner } from "./claw-banner-DF15i1El.mjs";
import { r as isTerminalInteractive, t as NON_INTERACTIVE_GATEWAY_RUN_FORCE_MESSAGE } from "./terminal-interactivity-D92bdO16.mjs";
import { r as withProgress } from "./progress-BIOeyA3T.mjs";
import { n as GATEWAY_CRASH_LOOP_RECOVERED_REASON, r as GATEWAY_SIGNAL_REPEAT_WINDOW_MS, t as GATEWAY_CRASH_LOOP_BREAKER_REASON } from "./gateway-boot-lifecycle.kernel-BKdHuusn.mjs";
import { a as inspectGatewayCrashLoopBreakerAsync, c as recordGatewayBootStart, i as inspectGatewayCrashLoopBreaker, l as recordGatewayCrashLoopRecovery, n as formatGatewayCrashLoopManualChannelStartHint, r as formatGatewayRepeatedSignalHint, t as completeGatewayBootLifecycle } from "./gateway-boot-lifecycle-B_E2PbYI.mjs";
import { l as enforceGatewayRunFutureConfigGuard, r as getGatewayStartGuardErrors } from "./pre-bootstrap-coYG-maI.mjs";
import { r as rethrowStartupConfigFailure } from "./doctor-startup-migration-refusal-DM4p-KXA.mjs";
import { n as scheduleSafeGatewayRestart } from "./restart-coordinator-B06wi524.mjs";
import { n as resolveGatewayStartupFailureExitCode, r as resolveGatewayStartupMaintenanceReason } from "./startup-maintenance-rDuH3OHw.mjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import { MessageChannel } from "node:worker_threads";
import { AsyncLocalStorage } from "node:async_hooks";
import { spawn } from "node:child_process";
import { performance as performance$1 } from "node:perf_hooks";
//#region src/cli/gateway-cli/crash-loop-recovery.ts
function createGatewayCrashLoopRecovery(params) {
	return async (signal) => {
		const suppressedBootId = params.bootId;
		const assertBootCurrent = () => {
			if (!suppressedBootId || params.getActiveBootId() !== suppressedBootId) throw new Error("Gateway crash-loop recovery belongs to a replaced boot");
		};
		const assertCurrent = () => {
			signal?.throwIfAborted();
			assertBootCurrent();
		};
		assertCurrent();
		const decision = await inspectGatewayCrashLoopBreakerAsync(process.env, Date.now(), signal);
		assertCurrent();
		if (decision.recoveryPausedUntilMs !== void 0) return decision.recoveryPausedUntilMs;
		if (!decision.recovered || decision.uncleanBoots !== 0) throw new Error("Gateway crash-loop recovery has no cleared breaker window");
		const recoveredBootId = await recordGatewayCrashLoopRecovery(suppressedBootId, process.env, void 0, assertCurrent);
		assertBootCurrent();
		if (!recoveredBootId) throw new Error("Gateway crash-loop recovery did not commit");
		params.onRecovered(recoveredBootId);
	};
}
//#endregion
//#region src/daemon/hosted-stop-executor.ts
const STOP_EXECUTOR_SCRIPT = "printf \"%s\\n\" \"$$\"; IFS= read -r action && [ \"$action\" = stop ] && exec \"$@\"";
/** A non-exiting executor, optionally placed outside the service's kill cgroup. */
async function prepareHostedStopExecutor(params) {
	params.assertCurrent();
	params.signal.throwIfAborted();
	const script = `set -- ${params.command.map(quoteCliArg).join(" ")}; ${STOP_EXECUTOR_SCRIPT}\n`;
	const command = params.scopeArgs ? "systemd-run" : "/bin/sh";
	const args = params.scopeArgs ? [...params.scopeArgs, "/bin/sh"] : [];
	const child = spawn(command, args, {
		env: params.env,
		detached: true,
		stdio: [
			"pipe",
			"pipe",
			"pipe"
		]
	});
	let output = "";
	let diagnostic = "";
	let committed = false;
	let disposed = false;
	let ready = false;
	const readiness = createDeferredCore();
	const result = createDeferredCore();
	const closed = result.promise.then(() => {});
	let timeout;
	const dispose = () => {
		if (disposed) return closed;
		disposed = true;
		clearTimeout(timeout);
		params.signal.removeEventListener("abort", cancel);
		child.stdin.end();
		if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
		return closed;
	};
	const cancel = () => {
		dispose();
	};
	params.signal.addEventListener("abort", cancel, { once: true });
	child.stdin.on("error", (error) => {
		diagnostic = formatErrorMessage(error);
		cancel();
	});
	child.stderr.on("data", (data) => {
		diagnostic = (diagnostic + data.toString()).slice(-1e3);
	});
	child.stdout.on("data", (data) => {
		if (ready) return;
		output += data.toString();
		if (output.length > 128 || output.endsWith("\n") && (!/^[1-9]\d*\n$/.test(output) || Number(output.trim()) !== child.pid)) {
			readiness.reject(/* @__PURE__ */ new Error("Native stop executor returned invalid readiness"));
			cancel();
			return;
		}
		if (output.endsWith("\n")) {
			ready = true;
			clearTimeout(timeout);
			readiness.resolve(Number(output.trim()));
		}
	});
	child.once("error", (error) => {
		diagnostic = formatErrorMessage(error);
		readiness.reject(/* @__PURE__ */ new Error(`Native stop executor unavailable: ${diagnostic}`));
	});
	child.once("close", (code, signal) => {
		clearTimeout(timeout);
		params.signal.removeEventListener("abort", cancel);
		readiness.reject(/* @__PURE__ */ new Error(`Native stop executor unavailable: ${diagnostic || "closed"}`));
		result.resolve({
			disposition: !disposed && committed && code === 0 && !signal ? "accepted" : !disposed && committed && typeof code === "number" && !signal ? "refused" : "uncertain",
			detail: diagnostic
		});
	});
	timeout = setTimeout(() => {
		readiness.reject(/* @__PURE__ */ new Error("Native stop executor preparation timed out"));
		cancel();
	}, 5e3);
	try {
		child.stdin.write(script);
		const pid = await readiness.promise;
		params.signal.throwIfAborted();
		params.assertCurrent();
		await params.verifyPlacement?.(pid);
		params.signal.throwIfAborted();
		params.assertCurrent();
		return {
			dispose,
			execute(assertCurrent) {
				assertCurrent();
				params.signal.throwIfAborted();
				if (committed) throw new Error("Native stop executor is no longer available");
				if (disposed || child.exitCode !== null || child.signalCode !== null) return Promise.resolve({
					disposition: "refused",
					detail: "Native executor closed before stop was requested"
				});
				committed = true;
				child.stdin.write("stop\n");
				timeout = setTimeout(cancel, 5e3);
				return result.promise;
			}
		};
	} catch (error) {
		await dispose();
		throw error;
	}
}
//#endregion
//#region src/daemon/hosted-stop.ts
async function readProcessCgroup(pid) {
	const cgroup = (await fs.readFile(`/proc/${pid}/cgroup`, "utf8")).split("\n").find((line) => /^(?:0:|\d+:name=systemd):/.test(line));
	if (!cgroup) throw new Error("Cannot verify the Gateway's native systemd cgroup. Stop it from an external shell.");
	return cgroup.slice(cgroup.indexOf(":", cgroup.indexOf(":") + 1) + 1);
}
/** Discovery is request-bound; only the returned executor can cross its planned kernel teardown. */
async function prepareHostedGatewayStop(owner, assertCaller, signal) {
	const env = { ...process.env };
	signal.throwIfAborted();
	assertCaller();
	if (!owner.ownsProcessLifecycle) throw new Error("This Gateway host does not own the process lifecycle.");
	if (owner.supervisor === "external") throw new Error(formatExternalSupervisorActionRequired("stop"));
	if (owner.supervisor === null || process.platform === "win32" && owner.supervisor === "schtasks") return {
		async execute(assertCurrent) {
			signal.throwIfAborted();
			assertCurrent();
			return { outcome: "exit" };
		},
		async dispose() {}
	};
	const pid = process.pid;
	const start = getFileLockProcessStartTime(pid);
	if (start === null) throw new Error("Cannot verify the Gateway process identity. Stop it from an external shell.");
	const assertProcess = (assertCurrent) => {
		signal.throwIfAborted();
		assertCurrent();
		if (getFileLockProcessStartTime(pid) !== start) throw new Error("Gateway process identity changed before native stop.");
	};
	const assertPreparing = () => assertProcess(assertCaller);
	assertPreparing();
	if (process.platform === "darwin") {
		const target = `${resolveLaunchAgentGuiDomain()}/${resolveLaunchAgentLabel(env)}`;
		const inspect = async (assertCurrent) => {
			const current = await probeLaunchAgentState(target, 5e3);
			assertProcess(assertCurrent);
			if (current.state !== "running" || current.runtime.pid !== pid) throw new Error("LaunchAgent no longer owns this exact Gateway process.");
		};
		await inspect(assertPreparing);
		const executor = await prepareHostedStopExecutor({
			command: [
				"/bin/launchctl",
				"bootout",
				target
			],
			env,
			signal,
			assertCurrent: assertPreparing
		});
		try {
			await inspect(assertPreparing);
			assertPreparing();
		} catch (error) {
			await executor.dispose();
			throw error;
		}
		return {
			dispose: executor.dispose,
			async execute(assertCurrent) {
				await inspect(assertCurrent);
				const result = await executor.execute(() => assertProcess(assertCurrent));
				assertProcess(assertCurrent);
				if (result.disposition === "accepted") return { outcome: "accepted" };
				return {
					outcome: "uncertain",
					detail: `launchctl bootout acceptance unconfirmed: ${result.detail}`
				};
			}
		};
	}
	if (process.platform !== "linux") throw new Error("Hosted native Gateway stop is unavailable on this platform. Use the host's service manager.");
	const cgroup = await readProcessCgroup(pid);
	assertPreparing();
	const unit = cgroup.split("/").at(-1);
	if (!unit || !/^[A-Za-z0-9_.:@\\-]+\.service$/.test(unit)) throw new Error("This Gateway is not the main process of a systemd service. Stop it through the host that started it.");
	const uid = process.getuid?.();
	const scope = uid !== void 0 && cgroup.includes(`/user@${uid}.service/`) ? "--user" : "--system";
	const readIdentity = async (assertCurrent) => {
		const current = await execSystemctl([
			scope,
			"show",
			"--all",
			unit,
			"--property=Id,LoadState,ActiveState,SubState,MainPID,ControlGroup,InvocationID,ExecMainStartTimestampMonotonic,Job,CanStop,RefuseManualStop"
		], env, 5e3);
		assertProcess(assertCurrent);
		const fields = parseKeyValueOutput(current.stdout, "=");
		if (current.code !== 0 || fields.id !== unit || fields.loadstate !== "loaded" || fields.activestate !== "active" || fields.substate !== "running" || fields.mainpid !== String(pid) || fields.controlgroup !== cgroup || !/^[a-f0-9]{32}$/i.test(fields.invocationid ?? "") || !/^[1-9]\d*$/.test(fields.execmainstarttimestampmonotonic ?? "") || !/^(?:0|)$/.test(fields.job ?? "missing")) throw new Error("systemd no longer identifies this exact active Gateway without a pending job.");
		return {
			identity: `${fields.invocationid}:${fields.execmainstarttimestampmonotonic}`,
			canStop: fields.canstop === "yes" && fields.refusemanualstop === "no"
		};
	};
	const initial = await readIdentity(assertPreparing);
	assertPreparing();
	if (!initial.canStop) throw new Error("systemd does not permit manual stop of this Gateway service. Use its owning supervisor.");
	const scopeUnit = `openclaw-stop-${randomUUID()}.scope`;
	const executor = await prepareHostedStopExecutor({
		command: [
			"systemctl",
			scope,
			"--no-ask-password",
			"--no-block",
			"stop",
			unit
		],
		scopeArgs: [
			scope,
			"--scope",
			"--quiet",
			"--collect",
			"--no-ask-password",
			`--unit=${scopeUnit}`
		],
		env,
		signal,
		assertCurrent: assertPreparing,
		verifyPlacement: async (executorPid) => {
			const executorCgroup = await readProcessCgroup(executorPid);
			assertPreparing();
			if (!executorCgroup.endsWith(`/${scopeUnit}`) || executorCgroup.startsWith(`${cgroup}/`)) throw new Error("Native stop executor did not leave the Gateway service cgroup.");
		}
	});
	const assertIdentity = async (assertCurrent) => {
		const current = await readIdentity(assertCurrent);
		if (current.identity !== initial.identity) throw new Error("Native Gateway service instance changed before stop.");
		assertProcess(assertCurrent);
		return current.canStop;
	};
	try {
		if (!await assertIdentity(assertPreparing)) throw new Error("systemd no longer permits manual stop of this Gateway service.");
	} catch (error) {
		await executor.dispose();
		throw error;
	}
	return {
		dispose: executor.dispose,
		async execute(assertCurrent) {
			try {
				if (!await assertIdentity(assertCurrent)) return {
					outcome: "refused",
					detail: "systemd no longer permits manual stop of this Gateway service"
				};
				const result = await executor.execute(() => assertProcess(assertCurrent));
				assertProcess(assertCurrent);
				if (result.disposition === "accepted") return { outcome: "accepted" };
				if (result.disposition === "refused") {
					await assertIdentity(assertCurrent);
					return {
						outcome: "refused",
						detail: `systemd refused Gateway stop: ${result.detail}`
					};
				}
				return {
					outcome: "uncertain",
					detail: `systemd stop acceptance unconfirmed: ${result.detail}`
				};
			} catch (error) {
				return {
					outcome: "uncertain",
					detail: error instanceof Error ? error.message : String(error)
				};
			}
		}
	};
}
//#endregion
//#region src/cli/gateway-cli/host-lifecycle.ts
/** The run loop retains this owner; kernels receive only its request capability. */
function createGatewayHostLifecycle(params) {
	const abort = new AbortController();
	const processOwner = { ...params.processOwner };
	const stopSignalReason = /* @__PURE__ */ new Error("Gateway host stop signalled");
	let state = "serving";
	let stop;
	let preparationFinished;
	let execution;
	let retirement;
	const externalRestart = { isCurrent: () => state === "serving" && params.isCurrent() && params.isServing() };
	const commitExternalStop = params.commitExternalStop;
	if (commitExternalStop) externalRestart.commitStop = () => {
		if (!externalRestart.isCurrent()) throw new Error("Gateway host cannot commit stop for a retired or non-serving iteration.");
		runOutsideGatewayRootWorkAdmission(commitExternalStop);
	};
	const assertCurrent = () => {
		if (state === "retired" || !params.isCurrent()) throw new Error("Gateway host lifecycle is unavailable for this iteration. Reconnect and retry.");
	};
	const retire = () => {
		if (retirement) return retirement;
		state = "retired";
		disarmGatewaySuspendHandoff(externalRestart);
		abort.abort();
		retirement = Promise.all([
			stop?.dispose(),
			preparationFinished,
			execution?.catch(() => {})
		]).then(() => {});
		stop = void 0;
		return retirement;
	};
	return {
		capability: {
			...processOwner.ownsProcessLifecycle ? { externalRestart } : {},
			getShutdownBudget() {
				const budget = params.isCurrent() ? params.getShutdownBudget?.() : void 0;
				if (!budget) return;
				const { timeoutMs, reserveMs, nativeStopBudget } = budget;
				return {
					timeoutMs,
					reserveMs,
					nativeStopBudget
				};
			},
			async request(action, assertCaller) {
				const assertRequest = () => {
					assertCurrent();
					if (!params.isServing()) throw new Error("Gateway host is not serving this iteration. Reconnect and retry.");
					if (state === "accepted" || state === "finishing") throw new Error("Gateway stop is already scheduled.");
					assertCaller();
				};
				let prepared;
				let finishPreparation;
				try {
					assertRequest();
					if (action === "start") return ok({ outcome: "already-running" });
					if (!processOwner.ownsProcessLifecycle) throw new Error("This Gateway host does not own the process lifecycle. Use its owning host to stop or restart it.");
					if (action === "restart") {
						scheduleSafeGatewayRestart({
							reason: "gateway.restart.safe",
							delayMs: 0
						});
						return ok({ outcome: "scheduled" });
					}
					if (state !== "serving") throw new Error("Gateway stop preparation is already in progress. Retry when it finishes.");
					state = "preparing";
					preparationFinished = new Promise((resolve) => {
						finishPreparation = resolve;
					});
					prepared = await prepareHostedGatewayStop(processOwner, assertRequest, abort.signal);
					assertRequest();
					stop = prepared;
					state = "accepted";
					runOutsideGatewayRootWorkAdmission(params.acceptStop);
					return ok({ outcome: "scheduled" });
				} catch (error) {
					await prepared?.dispose();
					if (finishPreparation && state === "preparing") state = "serving";
					return err(formatErrorMessage(error));
				} finally {
					finishPreparation?.();
				}
			}
		},
		retire,
		notifyStopSignal() {
			if (state === "finishing" && params.isCurrent()) abort.abort(stopSignalReason);
		},
		async finishStop() {
			if (state !== "accepted" || !params.isCurrent() || !stop) return { outcome: "retired" };
			state = "finishing";
			const ownsStop = () => state === "finishing" && params.isCurrent();
			try {
				execution = stop.execute(assertCurrent);
				const result = await execution;
				if (!ownsStop()) return { outcome: "retired" };
				return abort.signal.reason === stopSignalReason ? { outcome: "exit" } : result;
			} catch (error) {
				if (!ownsStop()) return { outcome: "retired" };
				if (abort.signal.reason === stopSignalReason) return { outcome: "exit" };
				throw error;
			} finally {
				await retire();
			}
		}
	};
}
//#endregion
//#region src/cli/gateway-cli/host-lifeline.ts
/** The launching host retains the write end of stdin for this process's lifetime. */
function installGatewayHostLifeline(onHostExit) {
	const lifeline = process.env.OPENCLAW_GATEWAY_HOST_LIFELINE?.trim();
	if (!lifeline) return;
	const logger = createSubsystemLogger("gateway");
	if (lifeline !== "stdin") {
		logger.warn("Ignoring unsupported OPENCLAW_GATEWAY_HOST_LIFELINE; expected stdin");
		return;
	}
	const input = process.stdin;
	let stopped = false;
	const stopInput = () => {
		stopped = true;
		input.removeListener("end", inputClosed);
		input.removeListener("error", inputClosed);
		input.removeListener("close", inputClosed);
		input.pause();
	};
	const hostExited = (reason) => {
		if (stopped) return;
		stopInput();
		logger.info(`Gateway host exited (${reason}); shutting down`);
		onHostExit();
	};
	const inputClosed = () => hostExited("stdin lifeline closed");
	input.once("end", inputClosed);
	input.once("error", inputClosed);
	input.once("close", inputClosed);
	if (input.readableEnded || input.destroyed) queueMicrotask(inputClosed);
	else input.resume();
	return () => {
		stopInput();
	};
}
//#endregion
//#region src/cli/gateway-cli/run-loop-exit.ts
async function waitForLaunchdRestartHandoff(handoffSpawned) {
	const delay = sleep(1500);
	const spawned = handoffSpawned ? await Promise.race([handoffSpawned, delay.then(() => true)]) : false;
	await delay;
	return spawned;
}
async function flushGatewayLogsBeforeExit(logger, timeoutMs = 4e3) {
	flushDiagnosticsTimeline();
	const completion = flushLogger();
	if (!await raceWithTimeout(completion.then(() => true), timeoutMs, () => false)) {
		logger.warn(`log flush did not settle within ${timeoutMs}ms; waiting for accepted writes`);
		await completion;
	}
}
function createGatewaySignalObserver(logger) {
	const recentSignals = /* @__PURE__ */ new Map();
	return (signal) => {
		const now = Date.now();
		const times = (recentSignals.get(signal) ?? []).filter((time) => now - time <= GATEWAY_SIGNAL_REPEAT_WINDOW_MS);
		times.push(now);
		recentSignals.set(signal, times.slice(-3));
		if (times.length === 3) logger.warn(formatGatewayRepeatedSignalHint(signal, 3));
	};
}
function createGatewayStabilityReporter(runtime, logger) {
	return (reason, error, shutdownStep) => {
		const result = runtime.writeDiagnosticStabilityBundleForFailureSync(reason, error, ...shutdownStep ? [{ shutdownStep }] : []);
		logger.warn(result.message);
	};
}
//#endregion
//#region src/cli/gateway-cli/run-loop-cleanup.ts
/** Retains accepted cleanup, including native watchdog cancellation, until its real settlement. */
function createGatewayRunCleanup(ownsProcessLifecycle, runtime, logger, isForegroundUpdateClosed) {
	const processLifetime = ownsProcessLifecycle ? new MessageChannel() : void 0;
	processLifetime?.port1.ref();
	let cleanupFailed = false;
	let processResourcesDrained = false;
	const pendingCleanup = /* @__PURE__ */ new Set();
	const retainCleanup = (completion) => {
		pendingCleanup.add(completion);
		completion.then(() => pendingCleanup.delete(completion), (error) => {
			pendingCleanup.delete(completion);
			cleanupFailed = true;
			logger.error(`gateway lifecycle completion failed: ${formatErrorMessage(error)}`);
		});
	};
	const retireWatchdog = (watchdog) => {
		if (watchdog) retainCleanup(watchdog.cancel());
	};
	const joinCleanup = async () => {
		while (pendingCleanup.size > 0) await Promise.allSettled(pendingCleanup);
	};
	const drainProcessResources = async () => {
		if (!isForegroundUpdateClosed()) await runtime.stopActiveManagedProviderLocalServices().catch((error) => {
			cleanupFailed = true;
			logger.warn(`managed local service shutdown failed: ${formatErrorMessage(error)}`);
		});
		await cleanupSnapshotOperations();
		await flushGatewayLogsBeforeExit(logger);
		processResourcesDrained = true;
	};
	return {
		retain: retainCleanup,
		retireWatchdog,
		waitForCleanup: joinCleanup,
		async settleFinalResources(operations) {
			const failures = [];
			const finalizers = [
				operations.retireSignals,
				operations.drainSignals,
				joinCleanup,
				operations.closeTerminalServer,
				operations.retireHost,
				joinCleanup,
				operations.closeSharedState,
				operations.releaseLock,
				operations.clearStartupWatchdog,
				operations.clearRequestWatchdogs,
				joinCleanup,
				operations.cleanupSignals
			];
			for (const operation of finalizers) try {
				await operation();
			} catch (error) {
				cleanupFailed = true;
				failures.push(error);
			}
			try {
				operations.onSettled?.(processResourcesDrained && !cleanupFailed ? "drained" : "retained");
			} catch (error) {
				cleanupFailed = true;
				failures.push(error);
			}
			if (ownsProcessLifecycle && processResourcesDrained && !cleanupFailed) requestSettledExitWatchdog(1e4);
			return failures;
		},
		drainProcessResources,
		get failed() {
			return cleanupFailed;
		},
		get drained() {
			return processResourcesDrained;
		},
		markFailed() {
			cleanupFailed = true;
		},
		beginIteration() {
			processResourcesDrained = false;
		},
		releaseProcessLifetime() {
			processLifetime?.port1.close();
			processLifetime?.port2.close();
		}
	};
}
//#endregion
//#region src/cli/gateway-cli/run-loop-shutdown-format.ts
function formatBootCompletionContext(completion, ...reasons) {
	const context = reasons.filter(Boolean).join("; ");
	return context ? {
		...completion,
		reason: truncateUtf16Safe(`${context}; ${completion.reason ?? completion.outcome}`, 500)
	} : completion;
}
function formatShutdownReason(request) {
	const { action, signal, restartReason } = request;
	const trigger = restartReason && restartReason !== signal ? `${signal}: ${truncateUtf16Safe(restartReason.replaceAll(/\s+/g, " "), 200)}` : signal;
	return `${action === "stop" ? "stop" : "restart"} (${trigger})`;
}
function formatShutdownCompletion(request, failed, stopReason) {
	return request.action !== "stop" ? {
		outcome: "planned_restart",
		reason: formatShutdownReason(request)
	} : {
		outcome: failed ? "forced_stop" : "clean_stop",
		reason: failed ? "gateway.stop_close_failed" : stopReason ?? formatShutdownReason(request)
	};
}
function formatRestartCompletion(request, failed) {
	return failed ? {
		outcome: "forced_stop",
		reason: "gateway.restart_close_failed"
	} : {
		outcome: "planned_restart",
		reason: request ? formatShutdownReason(request) : "gateway.restart"
	};
}
function formatStartupFailureCompletion(error, startupReason) {
	const reason = startupReason ?? (error instanceof TailscaleBackendStoppedError ? error.code : void 0);
	return {
		outcome: "startup_failed",
		reason: truncateUtf16Safe(formatErrorMessage(error), 500),
		...reason ? { startupReason: reason } : {}
	};
}
function formatHostExitCompletion(failed, reason) {
	return {
		outcome: failed ? "forced_stop" : "clean_stop",
		reason: failed ? "gateway.restart_close_failed" : reason ?? "stop (process exit)"
	};
}
//#endregion
//#region src/cli/gateway-cli/run-loop-drain.ts
const RESTART_DRAIN_STILL_PENDING_WARN_MS = 3e4;
async function drainGatewayActiveWork({ request, runtime, drainTimeoutMs, restartDrainDeadlineAt, recordCounts, recordWarning, logger }) {
	const { restartIntent } = request;
	let drainTimedOut = false;
	const reportDrainSnapshot = createGatewayDrainReporter(request.action, drainTimeoutMs, runtime, logger, recordCounts);
	if (request.action !== "stop") {
		let activeWorkAtDrainStart = 0;
		let activeRunsAtDrainStart = 0;
		await measureGatewayRestartTrace("restart.drain", async () => {
			const { abortEmbeddedAgentRun, createGatewayActiveWorkSnapshot, waitForGatewayActiveWork } = runtime;
			const drainReason = formatShutdownReason(request);
			runtime.markGatewayDraining(drainReason);
			const initialSnapshot = createGatewayActiveWorkSnapshot();
			activeWorkAtDrainStart = initialSnapshot.counts.totalActive;
			activeRunsAtDrainStart = initialSnapshot.counts.embeddedRuns;
			if (activeRunsAtDrainStart > 0) abortEmbeddedAgentRun(void 0, {
				mode: "compacting",
				reason: "restart"
			});
			reportDrainSnapshot(initialSnapshot);
			if (request.interruptAfterDrain) {
				logger.info("external restart owner already drained; interrupting remaining work");
				runtime.abortActiveCronTaskRuns();
				return;
			}
			const drain = await waitForGatewayActiveWork(restartDrainDeadlineAt === void 0 ? void 0 : Math.max(0, restartDrainDeadlineAt - Date.now()), { onSnapshot: reportDrainSnapshot });
			if (drain.drained) {
				if (!initialSnapshot.idle) logger.info("all active work drained");
				return;
			}
			drainTimedOut = true;
			const warning = `restart drain budget ${drainTimeoutMs}ms exhausted; cutting short ${formatGatewayDrainCounts(drain.snapshot)}`;
			recordWarning(warning);
			logger.warn(warning);
			runtime.abortActiveCronTaskRuns();
		}, () => [
			["activeWork", activeWorkAtDrainStart],
			["activeRuns", activeRunsAtDrainStart],
			["timedOut", drainTimedOut],
			["force", restartIntent?.force === true]
		]);
	} else {
		try {
			markGatewayRestartTrace("stop.drain.begin");
			const activeWorkDrain = await measureGatewayRestartTrace("stop.drain", () => runtime.waitForGatewayActiveWork(drainTimeoutMs, { onSnapshot: reportDrainSnapshot }));
			if (!activeWorkDrain.drained) {
				drainTimedOut = true;
				logger.warn(`gateway active-work drain timeout reached; proceeding with shutdown: ${formatGatewayDrainCounts(activeWorkDrain.snapshot)}`);
				runtime.abortEmbeddedAgentRun(void 0, { mode: "all" });
				runtime.abortActiveCronTaskRuns("Gateway stopping.");
			}
		} catch (err) {
			logger.warn(`gateway active-work drain failed; proceeding with shutdown: ${formatErrorMessage(err)}`);
		}
		logger.info("active-work drain settled; beginning server close");
	}
	beginGatewayShutdownCleanup();
	return drainTimedOut;
}
function createGatewayDrainReporter(action, drainTimeoutMs, runtime, logger, recordCounts) {
	const drainBudget = drainTimeoutMs === void 0 ? "without a timeout" : `with timeout ${drainTimeoutMs}ms`;
	let lastPendingWarningAt;
	return (snapshot) => {
		recordCounts(`${formatGatewayDrainCounts(snapshot) || "no active work"}; pending owners: ${snapshot.blockers.map(({ message }) => message).join("; ") || "none"}`);
		const now = Date.now();
		if (lastPendingWarningAt === void 0) {
			lastPendingWarningAt = now;
			if (!snapshot.idle) {
				logger.info(`draining active work before ${action} ${drainBudget}: ${formatGatewayDrainCounts(snapshot)}`);
				const requestTimeoutMs = Math.max(0, ...runtime.listActiveEmbeddedRunSessionIds().map((sessionId) => runtime.getDiagnosticSessionActivitySnapshot({ sessionId })?.activeModelCallRequestTimeoutMs ?? 0));
				if (requestTimeoutMs > 0) logger.info(`largest observed model request timeout is ${requestTimeoutMs}ms; shutdown drain budget remains ${drainBudget}`);
			}
		} else if (!snapshot.idle && now - lastPendingWarningAt >= RESTART_DRAIN_STILL_PENDING_WARN_MS) {
			lastPendingWarningAt = now;
			logger.warn(`still draining active work before ${action}: ${formatGatewayDrainCounts(snapshot)}`);
		}
	};
}
//#endregion
//#region src/cli/gateway-cli/run-loop-request.ts
function isUpdateProcessRestartReason(reason) {
	return reason === "update.run" || reason === "update.auto";
}
function registerGatewayRunInstallationReplacement(params) {
	let current = true;
	const release = registerGatewayInstallationReplacementHandler((fact) => {
		const accept = () => {
			if (!current || getGatewayInstallationReplacement() !== fact) return;
			const pending = params.waitForUpdates();
			if (pending) {
				pending.then(accept).catch((error) => {
					if (current) params.logger.error(`Installation replacement restart deferred: system-service update settlement failed: ${formatErrorMessage(error)}`);
				});
				return;
			}
			params.logger.warn(fact.message);
			if (!params.supervised) params.logger.error(`The foreground Gateway must stop after its installation was replaced. Restart it with: ${formatCliCommand("openclaw gateway run")}`);
			params.accept(fact);
		};
		accept();
	});
	return () => {
		current = false;
		release();
	};
}
const sameManagedUpdateOwner = (left, right) => Boolean(left && right && left.handoffId === right.handoffId && left.installRoot === right.installRoot);
function resolveGatewayRunSignalRequestUpgrade(current, incoming) {
	const { action, signal, restartReason, restartIntent } = incoming;
	if (action === "restart" && isUpdateProcessRestartReason(restartReason) && current?.action === "restart" && (!isUpdateProcessRestartReason(current.restartReason) || restartIntent?.successorOwner && !sameManagedUpdateOwner(restartIntent.successorOwner, current.restartIntent?.successorOwner))) return {
		...current,
		signal,
		restartReason,
		foregroundUpdate: incoming.foregroundUpdate,
		restartIntent: {
			...current.restartIntent,
			...restartIntent,
			force: true,
			reason: restartReason
		}
	};
}
//#endregion
//#region src/infra/launchd-stop-timeout.ts
const LAUNCHCTL_PRINT_TIMEOUT_MS = 2e3;
const LAUNCHD_DEFAULT_EXIT_TIMEOUT_MS = 2e4;
const LEGACY_LAUNCHD_LAUNCHER_STOP_TIMEOUT_MS = 19e3;
function resolveLaunchdDomains(label) {
	const uid = typeof process.getuid === "function" ? process.getuid() : 501;
	return [
		`system/${label}`,
		`gui/${uid}/${label}`,
		`user/${uid}/${label}`
	];
}
function resolveJobRelation(pid) {
	if (pid === void 0) return null;
	if (pid === process.pid) return "self";
	return pid === process.ppid ? "launcher" : null;
}
function readJobState(printed) {
	return /^\tstate = (?<state>.+)$/mu.exec(printed)?.groups?.state?.trim();
}
function isLaunchdStoppingJob(state) {
	return state !== void 0 && /^SIG[A-Z0-9]+ed$/u.test(state);
}
function resolveParentLauncherStopTimeoutMs(env) {
	if (!isRespawnedByLauncher(env)) return;
	const timeoutMs = resolveLauncherStopTimeoutMs({
		platform: process.platform,
		foreground: isForegroundGatewayRunArgv(process.argv)
	});
	const launchdService = env.OPENCLAW_LAUNCHD_LABEL?.trim();
	return process.platform === "darwin" && launchdService && env.XPC_SERVICE_NAME === launchdService ? Math.min(timeoutMs, LEGACY_LAUNCHD_LAUNCHER_STOP_TIMEOUT_MS) : timeoutMs;
}
function defaultStopDeadline(target, reason) {
	const timeoutMs = LAUNCHD_DEFAULT_EXIT_TIMEOUT_MS;
	return {
		stop: {
			timeoutMs,
			source: `launchd ${target} exit timeout unavailable; default ExitTimeOut`
		},
		warning: `launchd is stopping ${target} but ${reason}; using ${timeoutMs}ms default. Check the running job with launchctl print.`
	};
}
function unresolved(failures) {
	return {
		stop: null,
		warning: `Unable to inspect the launchd job; ${failures.map((failure) => truncateUtf16Safe(failure.replaceAll(/\s+/g, " "), 500)).join("; ")}; keeping the Gateway stop policy. Check the running job with launchctl print.`
	};
}
async function readLaunchdStopTimeout(env = process.env) {
	if (detectRespawnSupervisor(env, "darwin") !== "launchd") return { stop: null };
	const failures = [];
	let label;
	try {
		label = resolveLaunchAgentLabel(env);
	} catch (error) {
		return unresolved([`label could not be resolved: ${formatErrorMessage(error)}`]);
	}
	for (const target of resolveLaunchdDomains(label)) {
		const failed = (reason) => failures.push(`${target}: ${reason}`);
		const result = await execLaunchctl(["print", target], LAUNCHCTL_PRINT_TIMEOUT_MS).catch((error) => {
			failed(`launchctl print threw: ${formatErrorMessage(error)}`);
		});
		if (!result) continue;
		if (result.code !== 0) {
			failed(`launchctl print exited ${result.code}: ${formatLaunchctlResultDetail(result)}`);
			continue;
		}
		const printed = result.stdout || result.stderr || "";
		const entries = parseKeyValueOutput(printed, "=");
		const pid = parseStrictPositiveInteger(entries.pid ?? "");
		const relation = resolveJobRelation(pid);
		if (!relation) {
			failed(`pid ${pid ?? "missing"} is neither this process nor its launcher`);
			continue;
		}
		const launcherMs = relation === "launcher" ? resolveParentLauncherStopTimeoutMs(env) : void 0;
		const state = readJobState(printed);
		if (!isLaunchdStoppingJob(state)) return !state && entries["exit timeout"] !== void 0 ? {
			stop: null,
			warning: `launchd ${target} printed an exit timeout but no job state, so it is treated as not stopping and the Gateway stop policy is kept. Check the running job with launchctl print.`
		} : { stop: null };
		const rawSeconds = entries["exit timeout"]?.trim();
		const unlimited = rawSeconds === "0";
		const seconds = unlimited ? Infinity : parseStrictPositiveInteger(rawSeconds ?? "");
		if (seconds === void 0) return defaultStopDeadline(target, "its exit timeout is missing or invalid");
		const jobMs = seconds * 1e3;
		const source = `launchd ${target}${unlimited ? " unlimited" : ""} exit timeout`;
		return launcherMs !== void 0 && (unlimited || launcherMs < jobMs) ? { stop: {
			timeoutMs: launcherMs,
			source: `${source} capped at the launcher's ${launcherMs}ms stop timer`
		} } : { stop: {
			timeoutMs: jobMs,
			source
		} };
	}
	return unresolved(failures);
}
//#endregion
//#region src/infra/systemd-stop-timeout.ts
/** Read only the running unit, never a same-named unit in the other manager. */
async function readSystemdStopTimeout(env = process.env) {
	const memberships = (await fs.readFile("/proc/self/cgroup", "utf8").catch(() => "")).split("\n");
	const systemdMembership = memberships.find((line) => line.split(":")[1]?.split(",").includes("name=systemd")) ?? memberships.find((line) => line.startsWith("0::"));
	const servicePath = systemdMembership?.slice(systemdMembership.indexOf(":", systemdMembership.indexOf(":") + 1) + 1);
	const leafUnit = servicePath?.split("/").findLast((part) => /\.(service|scope)$/u.test(part));
	const cgroupUnit = leafUnit?.endsWith(".service") ? leafUnit : void 0;
	if (!cgroupUnit && detectRespawnSupervisor(env, "linux", { includeLinuxOpenClawGatewayServiceMarker: true }) !== "systemd") return null;
	const unit = normalizeSystemdUnit(cgroupUnit ?? env.OPENCLAW_SYSTEMD_UNIT, env.OPENCLAW_PROFILE);
	const scope = cgroupUnit && servicePath ? /\/user@\d+\.service\//u.test(servicePath) ? "user" : "system" : void 0;
	const scopes = scope ? [scope] : ["user", "system"];
	const failures = [];
	for (const candidate of scopes) {
		const failed = (reason) => failures.push(`${candidate} manager ${unit}: ${reason}`);
		const args = [
			"show",
			unit,
			"--no-page",
			"--property",
			"TimeoutStopUSec,InvocationID,LoadState"
		];
		const result = await (candidate === "user" ? execSystemctlUser(env, args, 2e3) : execSystemctl(args, env, 2e3)).catch((error) => {
			failed(`systemctl show threw: ${formatErrorMessage(error)}`);
		});
		if (!result) continue;
		if (result.code !== 0) {
			failed(`systemctl show exited ${result.code}: ${formatErrorMessage(result.stderr)}`);
			continue;
		}
		const properties = parseKeyValueOutput(result.stdout, "=");
		if (properties.loadstate !== "loaded") {
			failed(`LoadState=${properties.loadstate || "missing"}`);
			continue;
		}
		if (env.INVOCATION_ID && properties.invocationid !== env.INVOCATION_ID) {
			failed("InvocationID does not match the running process");
			continue;
		}
		const timeoutMs = parseSystemdTimeSpanMs(properties.timeoutstopusec ?? "");
		if (timeoutMs !== void 0) return {
			timeoutMs: timeoutMs === 0 ? Infinity : timeoutMs,
			source: `systemd ${candidate} ${unit} TimeoutStopUSec`
		};
		failed("TimeoutStopUSec is missing or invalid");
	}
	return {
		timeoutMs: SYSTEMD_DEFAULT_STOP_TIMEOUT_MS,
		source: `systemd ${unit} timeout unavailable; default TimeoutStopUSec`,
		warning: `Unable to read systemd stop timeout; ${failures.map((failure) => truncateUtf16Safe(failure.replaceAll(/\s+/g, " "), 500)).join("; ")}; using ${SYSTEMD_DEFAULT_STOP_TIMEOUT_MS}ms default. Check the running unit with systemctl show.`
	};
}
//#endregion
//#region src/cli/gateway-cli/run-loop-shutdown-budget.ts
const STOP_DRAIN_TIMEOUT_MS = 2e4;
async function readNativeStopTimeout(stopping) {
	if (process.platform === "linux") {
		const systemd = await readSystemdStopTimeout();
		return {
			stop: systemd,
			warning: systemd?.warning,
			inconclusive: !systemd || Boolean(systemd.warning)
		};
	}
	if (process.platform === "darwin" && stopping) {
		const read = await readLaunchdStopTimeout();
		return {
			...read,
			inconclusive: read.stop === null && read.warning !== void 0
		};
	}
	return {
		stop: null,
		inconclusive: false
	};
}
async function resolveGatewayShutdownBudget(supervisor, logger, refresh) {
	const native = await readNativeStopTimeout(refresh !== void 0);
	const nativeStop = native.stop;
	const retained = refresh?.previous.nativeStopBudget && native.inconclusive ? refresh.previous : void 0;
	if (native.warning) logger.warn(native.warning);
	if (retained) logger.warn(`Retaining the startup shutdown budget of ${retained.timeoutMs}ms because the current supervisor stop timeout could not be confirmed.`);
	const stop = nativeStop ?? {
		timeoutMs: supervisor === "launchd" ? 33e4 : 33e4,
		source: supervisor === "launchd" ? "launchd ExitTimeOut" : "Gateway stop policy"
	};
	const nativeStopBudget = nativeStop ? Number.isFinite(nativeStop.timeoutMs) : supervisor === "launchd" || Boolean(retained);
	const exitMarginMs = resolveSupervisorExitMarginMs(stop.timeoutMs);
	const limitMs = retained?.timeoutMs ?? Math.min(325e3, stop.timeoutMs - exitMarginMs);
	const elapsedMs = refresh && nativeStopBudget ? Math.max(0, Math.ceil(performance$1.now() - refresh.acceptedAtMs)) : 0;
	const timeoutMs = Math.max(0, limitMs - elapsedMs);
	const reserveMs = resolveShutdownReserveMs(timeoutMs);
	return {
		nativeStopBudget,
		timeoutMs,
		reserveMs,
		cleanupBudget: (deadline, hardExitGraceMs) => deadline === void 0 ? void 0 : {
			deadline: deadline - Math.min(hardExitGraceMs / 2, Math.max(0, deadline - performance$1.now()) / 2),
			warn: (message) => logger.warn(message)
		},
		log: (phase) => {
			logger.info(`shutdown budget at ${phase}: drain=${Math.max(0, timeoutMs - reserveMs)}ms shutdown=${timeoutMs}ms reserve=${reserveMs}ms exitMargin=${exitMarginMs}ms; source=${retained ? `startup shutdown budget=${retained.timeoutMs}ms` : `${stop.source}=${stop.timeoutMs}ms`}`);
		}
	};
}
function resolveGatewayShutdownDrainBudget(params) {
	const { budget, action } = params;
	const isRestart = action !== "stop";
	const requested = params.interruptAfterDrain ? 0 : params.requestedRestartDrainTimeoutMs;
	const elapsedMs = performance$1.now() - params.acceptedAtMs;
	const remaining = requested === void 0 ? void 0 : Math.max(0, requested - elapsedMs);
	const restartDrainTimeoutMs = budget.nativeStopBudget ? Math.min(remaining ?? Infinity, Math.max(0, budget.timeoutMs - budget.reserveMs)) : remaining;
	const restartDrainDeadlineAt = isRestart && restartDrainTimeoutMs !== void 0 ? Date.now() + restartDrainTimeoutMs : void 0;
	const forcedRestartDeadlineAt = params.forceRestart && restartDrainDeadlineAt !== void 0 ? restartDrainDeadlineAt + budget.reserveMs : void 0;
	const restartTimeoutMs = (drainTimeoutMs) => {
		if (forcedRestartDeadlineAt !== void 0) return Math.max(0, forcedRestartDeadlineAt - Date.now());
		return budget.nativeStopBudget && params.restartWithoutSupervisor ? budget.timeoutMs : drainTimeoutMs + (budget.nativeStopBudget ? budget.reserveMs : GATEWAY_SHUTDOWN_TIMEOUT_MS);
	};
	return {
		restartDrainDeadlineAt,
		restartTimeoutMs: () => budget.nativeStopBudget || params.forceRestart ? restartTimeoutMs(Math.max(0, (restartDrainDeadlineAt ?? Date.now()) - Date.now())) : GATEWAY_SHUTDOWN_TIMEOUT_MS,
		closeDrainTimeoutMs: () => restartDrainTimeoutMs === void 0 ? GATEWAY_SHUTDOWN_TIMEOUT_MS - budget.reserveMs : Math.max(0, (restartDrainDeadlineAt ?? Date.now()) - Date.now()),
		drainTimeoutMs: isRestart ? restartDrainTimeoutMs : Math.min(STOP_DRAIN_TIMEOUT_MS, Math.max(0, budget.timeoutMs - budget.reserveMs)),
		forceExitMs: !isRestart || action === "external-restart" && (budget.nativeStopBudget || params.interruptAfterDrain) ? budget.timeoutMs : restartDrainTimeoutMs === void 0 ? void 0 : restartTimeoutMs(restartDrainTimeoutMs)
	};
}
//#endregion
//#region src/cli/gateway-cli/run-loop-signals.ts
/** Owns signal capture, ordered consumption and settlement for one run loop. */
function createGatewayRunSignals(params) {
	const { lifecycle: eagerLifecycleRuntime, logger: gatewayLog, request, updateSuccessor } = params;
	const observeSignal = createGatewaySignalObserver(gatewayLog);
	let signalSettlement;
	let signalAdmission = null;
	let signalStoreOpen = true;
	let signalStoreOpening;
	let reopenSignalStore;
	let signalsActive = true;
	const sealSignalStore = () => {
		signalStoreOpen = false;
		signalStoreOpening ??= new Promise((resolve) => {
			reopenSignalStore = resolve;
		});
	};
	const openSignalStore = () => {
		signalStoreOpen = true;
		reopenSignalStore?.();
		reopenSignalStore = void 0;
		signalStoreOpening = void 0;
	};
	const drainRestartSignals = async () => {
		for (;;) {
			if (!signalSettlement) break;
			await signalSettlement;
		}
	};
	const settleRestartSignals = async () => {
		for (;;) {
			if (!signalSettlement) break;
			await signalSettlement;
		}
		sealSignalStore();
	};
	const enqueueSignal = (readIntent, handle, failed) => {
		const iteration = params.getIteration();
		const acceptedAtMs = performance$1.now();
		signalAdmission = beginGatewayRestartSignalAdmission() ?? signalAdmission;
		const isCurrent = () => signalsActive && !params.isTerminal() && !params.isForcedExitStarted() && params.getIteration() === iteration;
		const assertCurrent = () => {
			if (!isCurrent()) throw new Error("Gateway signal belongs to a retired lifecycle iteration");
		};
		let consumeIntent;
		let preparationFailure;
		try {
			consumeIntent = readIntent ? eagerLifecycleRuntime.prepareGatewayRestartIntentConsumption(void 0, void 0, assertCurrent) : void 0;
		} catch (error) {
			preparationFailure = { error };
		}
		const deadline = consumeIntent ? setTimeout(() => {
			params.forceExit("gateway.restart_signal_settlement_timeout");
		}, Math.max(0, params.timeoutMs - (performance$1.now() - acceptedAtMs))) : void 0;
		deadline?.unref?.();
		const processSignal = async () => {
			try {
				if (!isCurrent()) return;
				if (preparationFailure) throw preparationFailure.error;
				for (;;) {
					if (!consumeIntent || signalStoreOpen) break;
					await signalStoreOpening;
					if (!isCurrent()) return;
				}
				const restartIntent = consumeIntent ? await consumeIntent() : null;
				if (isCurrent()) handle(restartIntent, acceptedAtMs);
			} catch (error) {
				if (isCurrent()) failed(error, acceptedAtMs);
			} finally {
				clearTimeout(deadline);
			}
		};
		const settled = signalSettlement ? signalSettlement.then(processSignal) : processSignal();
		signalSettlement = settled;
		settled.then(() => {
			if (signalSettlement === settled) {
				signalSettlement = void 0;
				signalAdmission?.rollback();
				signalAdmission = null;
			}
		});
	};
	const onSigterm = AsyncLocalStorage.bind(() => {
		if (!signalsActive || params.isTerminal()) return;
		observeSignal("SIGTERM");
		gatewayLog.debug("signal SIGTERM received");
		const terminalHostedStop = params.getTerminalHostedStop();
		if (terminalHostedStop) {
			terminalHostedStop.notifyStopSignal();
			return;
		}
		if (params.isForegroundUpdateClosed()) {
			updateSuccessor.stop("SIGTERM");
			return;
		}
		if (params.isForcedExitStarted()) {
			request("stop", "SIGTERM");
			return;
		}
		let suspendHandoff;
		if (!params.isShuttingDown()) try {
			suspendHandoff = consumeGatewaySuspendHandoff(params.getExternalRestartOwner());
		} catch (error) {
			suspendHandoff = {
				ok: false,
				error: formatErrorMessage(error)
			};
		}
		enqueueSignal(true, (restartIntent, acceptedAtMs) => {
			request(restartIntent ? "external-restart" : "stop", "SIGTERM", restartIntent?.reason, restartIntent ?? void 0, void 0, {
				acceptedAtMs,
				suspendHandoff
			});
		}, (err, acceptedAtMs) => {
			gatewayLog.error(`failed to handle SIGTERM: ${String(err)}`);
			request("stop", "SIGTERM", void 0, void 0, void 0, {
				acceptedAtMs,
				suspendHandoff
			});
		});
	});
	const onSigint = AsyncLocalStorage.bind(() => {
		if (!signalsActive || params.isTerminal()) return;
		observeSignal("SIGINT");
		gatewayLog.debug("signal SIGINT received");
		if (params.isForcedExitStarted()) {
			request("stop", "SIGINT");
			return;
		}
		enqueueSignal(false, (_intent, acceptedAtMs) => request("stop", "SIGINT", void 0, void 0, void 0, { acceptedAtMs }), (error) => gatewayLog.error(`failed to handle SIGINT: ${formatErrorMessage(error)}`));
	});
	const restartSignalFailed = (err, releaseToken = true) => {
		gatewayLog.error(`SIGUSR2 handler failed: ${formatErrorMessage(err)}`);
		if (!releaseToken) return;
		try {
			eagerLifecycleRuntime.markGatewayRestartHandled();
		} catch {}
		if (!updateSuccessor.stopRequested) try {
			eagerLifecycleRuntime.rollbackGatewayRestartSignalAdmission();
		} catch {}
	};
	const onRestartSignal = AsyncLocalStorage.bind(() => {
		if (!signalsActive || params.isTerminal()) return;
		observeSignal("SIGUSR2");
		gatewayLog.debug("signal SIGUSR2 received");
		if (params.isForegroundUpdateClosed()) return;
		try {
			const authorized = eagerLifecycleRuntime.consumeGatewayRestartAuthorization();
			const localIntent = authorized ? eagerLifecycleRuntime.consumeGatewayRestartIntent() : null;
			const reason = eagerLifecycleRuntime.peekGatewayRestartReason();
			const deferRestartDrain = params.isRuntimeResetPending();
			eagerLifecycleRuntime.markGatewayRestartHandled();
			const handleRestart = (durableIntent, acceptedAtMs) => {
				const restartIntent = durableIntent ? {
					...durableIntent,
					...localIntent?.successorOwner ? localIntent : {}
				} : localIntent;
				if (!durableIntent && !authorized) {
					if (!eagerLifecycleRuntime.isGatewayRestartExternallyAllowed()) {
						gatewayLog.warn("SIGUSR2 restart ignored (not authorized; commands.restart=false).");
						gatewayLog.warn("An unauthorized SIGUSR2 restart signal was received and ignored. If a pending gateway restart needs to be applied, run `openclaw gateway restart` or restart the gateway through your service manager.");
						return;
					}
					if (params.isShuttingDown()) {
						gatewayLog.info("received SIGUSR2 during shutdown; ignoring");
						return;
					}
					eagerLifecycleRuntime.abortPendingChannelReloads();
					eagerLifecycleRuntime.scheduleGatewayRestart({
						delayMs: 0,
						reason: "SIGUSR2"
					});
					return;
				}
				eagerLifecycleRuntime.abortPendingChannelReloads();
				request("restart", "SIGUSR2", restartIntent?.reason ?? (durableIntent ? "gateway.restart" : reason), restartIntent ?? void 0, void 0, {
					acceptedAtMs,
					deferRestartDrain
				});
			};
			enqueueSignal(true, handleRestart, (error, acceptedAtMs) => {
				if (!authorized) {
					restartSignalFailed(error, false);
					return;
				}
				gatewayLog.warn(`Restart intent could not be read; continuing the authorized local restart: ${formatErrorMessage(error)}`);
				handleRestart(null, acceptedAtMs);
			});
		} catch (err) {
			restartSignalFailed(err);
		}
	});
	process.on("SIGTERM", onSigterm);
	process.on("SIGINT", onSigint);
	process.on("SIGUSR2", onRestartSignal);
	const retire = () => {
		signalsActive = false;
		openSignalStore();
	};
	return {
		get pending() {
			return signalSettlement;
		},
		get active() {
			return signalsActive;
		},
		sealStore: sealSignalStore,
		openStore: openSignalStore,
		drain: drainRestartSignals,
		settle: settleRestartSignals,
		retire,
		close() {
			retire();
			process.removeListener("SIGTERM", onSigterm);
			process.removeListener("SIGINT", onSigint);
			process.removeListener("SIGUSR2", onRestartSignal);
		}
	};
}
//#endregion
//#region src/cli/gateway-cli/shutdown-hard-exit.ts
function armShutdownHardExitWatchdog(params) {
	const reportError = (error) => {
		try {
			params.onError(error);
		} catch {}
	};
	let worker;
	try {
		worker = createCpuTrackedWorker(`const { parentPort, workerData } = require("node:worker_threads");
       const timer = setTimeout(() => process.kill(process.pid, "SIGKILL"), workerData.delayMs);
       parentPort.once("message", () => {
         clearTimeout(timer);
         parentPort.close();
       });`, {
			eval: true,
			execArgv: [],
			workerData: { delayMs: Math.max(0, Math.floor(params.delayMs)) }
		});
	} catch (error) {
		reportError(error);
		return null;
	}
	const exited = new Promise((resolve) => {
		worker.once("exit", () => resolve());
	});
	worker.unref();
	let active = true;
	worker.once("error", (error) => {
		if (active) {
			active = false;
			reportError(error);
		}
	});
	return { cancel: () => {
		active = false;
		try {
			worker.postMessage("cancel", []);
		} catch (error) {
			reportError(error);
		}
		return exited;
	} };
}
//#endregion
//#region src/cli/gateway-cli/run-loop-startup-watchdog.ts
/** One queued startup request owns both deadlines, including async budget refreshes. */
function createGatewayStartupWatchdog({ startupBudget, supervisorMode, gatewayLog, ownsProcessLifecycle, hardExitGraceMs, retireWatchdog, retainCleanup, hasPendingRequest, reportBudget, onTimeout }) {
	let pendingStartupForceExitTimer = null;
	let pendingStartupWatchdog = null;
	const clearPendingStartupForceExitTimer = () => {
		clearTimeout(pendingStartupForceExitTimer ?? void 0);
		pendingStartupForceExitTimer = null;
		retireWatchdog(pendingStartupWatchdog);
		pendingStartupWatchdog = null;
	};
	const armPendingStartupForceExitTimer = (pendingRequest) => {
		reportBudget(startupBudget);
		const expire = () => {
			pendingStartupForceExitTimer = null;
			gatewayLog.error("startup restart request timed out before gateway returned a close handle; exiting for supervisor recovery");
			onTimeout();
		};
		const arm = (timeoutMs) => {
			const timer = setTimeout(expire, timeoutMs);
			timer.unref?.();
			pendingStartupForceExitTimer = timer;
			if (ownsProcessLifecycle) {
				retireWatchdog(pendingStartupWatchdog);
				pendingStartupWatchdog = armShutdownHardExitWatchdog({
					delayMs: timeoutMs + hardExitGraceMs,
					onError: (error) => gatewayLog.warn(`startup hard-exit watchdog failed: ${formatErrorMessage(error)}`)
				});
			}
			return timer;
		};
		const timer = arm(startupBudget.timeoutMs);
		if (process.platform === "linux" || process.platform === "darwin") retainCleanup(resolveGatewayShutdownBudget(supervisorMode, gatewayLog, {
			previous: startupBudget,
			acceptedAtMs: pendingRequest.acceptedAtMs
		}).then((budget) => {
			if (!hasPendingRequest() || pendingStartupForceExitTimer !== timer) return;
			reportBudget(budget);
			clearTimeout(timer);
			arm(budget.timeoutMs);
		}).catch((error) => gatewayLog.warn(`Startup shutdown budget refresh failed: ${formatErrorMessage(error)}`)));
	};
	return {
		arm: armPendingStartupForceExitTimer,
		clear: clearPendingStartupForceExitTimer
	};
}
//#endregion
//#region src/cli/gateway-cli/run-loop-startup.ts
const lifecycleRuntimeLoader = createLazyImportLoader(() => import("./cli/gateway-lifecycle.runtime.js"));
/** Prime lifecycle code and acquire initial custody before installing signal handlers. */
async function prepareGatewayRunLoop(params, logger) {
	const lifecycleRuntime = await measureGatewayBootstrapStep("cli.bootstrap.lifecycle-runtime", () => lifecycleRuntimeLoader.load());
	const supervisor = lifecycleRuntime.detectGatewayRespawnSupervisorIdentity(process.env, process.platform, { includeLinuxOpenClawGatewayServiceMarker: true });
	const supervisorMode = supervisor?.kind ?? null;
	return {
		lifecycleRuntime,
		supervisor,
		supervisorMode,
		restartDecision: lifecycleRuntime.resolveGatewayRestartDecision(),
		startupBudget: await resolveGatewayShutdownBudget(supervisorMode, logger),
		lock: await measureGatewayBootstrapStep("cli.bootstrap.gateway-lock", () => acquireGatewayLock({
			port: params.lockPort,
			listenerMode: supervisorMode ? "supervised" : "foreground",
			supervisor,
			...params.lifecycleLockDeadlineMs !== void 0 ? { lifecycleDeadlineMs: params.lifecycleLockDeadlineMs } : {}
		}))
	};
}
function createGatewayRestartRecovery({ onRestartStartupFailure: onFailure }, logger, supervisor) {
	let work;
	return {
		reportStartupFailure(error, retryFailed) {
			const stack = error instanceof Error && error.stack ? `\n${error.stack}` : "";
			logger.error(`gateway startup failed: ${formatErrorMessage(error)}. ${onFailure && !retryFailed ? "Attempting automatic triage before recovery." : "Automatic recovery is unavailable."}${stack}`);
		},
		reportManualRecovery() {
			const resume = supervisor?.kind === "external" ? "use your external supervisor to restart the Gateway" : process.platform === "win32" ? supervisor ? `restart with: ${formatCliCommand("openclaw gateway restart")}` : "press Ctrl+C, then rerun your original Gateway command" : `reload with: kill -USR2 ${process.pid}`;
			logger.error(`Process will stay alive for manual recovery. Fix the startup refusal above, run ${formatCliCommand("openclaw doctor --fix")}, then ${resume}`);
		},
		abort() {
			work?.controller.abort();
		},
		async waitForCleanup() {
			await work?.settled;
		},
		async attempt(error) {
			if (!onFailure) return false;
			const controller = new AbortController();
			work = {
				controller,
				settled: Promise.resolve().then(() => onFailure(error, controller.signal))
			};
			try {
				const completion = await work.settled;
				if (controller.signal.aborted) return false;
				if (completion === "failed") throw error;
				if (completion !== "completed") {
					logger.info("Automatic triage did not complete a repair; awaiting manual recovery.");
					return false;
				}
				logger.info("Automatic triage completed; retrying Gateway startup once.");
				return true;
			} catch (triageError) {
				if (controller.signal.aborted) return false;
				logger.error(`Automatic triage failed: ${formatErrorMessage(triageError)}`);
				if (supervisor) throw triageError;
				return false;
			} finally {
				work = void 0;
			}
		}
	};
}
function createGatewayStartupOperations() {
	const scope = new AsyncWorkScope();
	let stopCompletion;
	let failure;
	const cancelledWith = (error) => scope.signal.aborted && (error === scope.signal.reason || error instanceof SqliteIntegrityWorkerInterruptedError && (error.signal === "SIGTERM" || error.signal === "SIGINT"));
	const run = async (operation) => {
		if (scope.isClosing) throw scope.signal.reason;
		return await scope.track(async () => {
			try {
				return await operation(scope.signal);
			} catch (error) {
				if (!cancelledWith(error)) failure ??= { error };
				throw error;
			}
		});
	};
	return {
		run,
		getStopCompletion: () => stopCompletion,
		retainStopCompletion: (completion) => {
			stopCompletion = completion;
		},
		close: () => scope.beginClose(),
		cancelledWith,
		failedWith: (error) => failure !== void 0 && failure.error === error,
		async drain() {
			await scope.drain();
			if (failure) throw failure.error;
		}
	};
}
/** Join the retired generation and reset its admission before the next Gateway boot. */
async function prepareGatewayRestartIteration(runtime, logger, isCurrent) {
	const { abortActiveCronTaskRuns, advanceCronActiveJobGeneration, retireActiveCronTaskRunTracking, resetCronActiveJobs, resetAllLanes, resetGatewayRestartStateForInProcessRestart, resetGatewaySuspendCoordinatorForLifecycleRestart, rotateAgentEventLifecycleGeneration, waitForActiveCronJobs, waitForActiveCronTaskRuns } = runtime;
	rotateAgentEventLifecycleGeneration();
	advanceCronActiveJobGeneration();
	abortActiveCronTaskRuns();
	const cronTaskDrain = await waitForActiveCronTaskRuns(1e3);
	const cronDrain = await waitForActiveCronJobs(1e3);
	if (!isCurrent()) return;
	if (!cronTaskDrain.drained || !cronDrain.drained) logger.warn(`cron run drain timed out during restart lifecycle reset after retiring old cron admission; ${cronTaskDrain.active} task handle(s) and ${cronDrain.active} active marker(s) remain after aborting old cron runs`);
	retireActiveCronTaskRunTracking();
	resetCronActiveJobs();
	resetGatewaySuspendCoordinatorForLifecycleRestart();
	resetAllLanes();
	clearRuntimeConfigSnapshot();
	resetGatewayRestartStateForInProcessRestart();
	try {
		await drainGlobalSingletonLifecycleState("restart");
	} catch (error) {
		logger.warn(`failed to reset ambient runtime state: ${formatErrorMessage(error)}`);
	}
	if (isCurrent()) markGatewayRestartTrace("restart.next-start");
}
//#endregion
//#region src/cli/gateway-cli/run-loop-terminal.ts
/** Terminal continuation shares the loop's live authority; it owns no copied request state. */
function createGatewayRunTerminal(params) {
	const { runtime: eagerLifecycleRuntime, logger: gatewayLog, updateSuccessor, finishLoop, completeBoot, releaseLockIfHeld, markRestartHandoffUnavailable, reacquireAndResumeInProcessRestart, forceExitAfterStabilityBundle } = params;
	const getManagedUpdateOwner = () => params.getRequest()?.restartIntent?.successorOwner;
	const finishLoopAfterSignals = async (code) => {
		for (;;) {
			if (params.isForcedExitStarted() || !params.getSignals().pending) break;
			await params.getSignals().pending;
		}
		finishLoop(code);
	};
	const finishLoopAfterCleanup = async (code, initialOwner, initialOutcome = "update", hostStopOwner) => {
		if (hostStopOwner && params.getHost() !== hostStopOwner) return;
		if (!params.isForcedExitStarted()) await params.getSignals().drain();
		let ownerToCommit = initialOwner;
		let commitOutcome = initialOutcome;
		await params.drainProcessResources();
		for (;;) {
			for (;;) {
				if (params.isForcedExitStarted() || !params.getSignals().pending) break;
				await params.getSignals().pending;
			}
			if (hostStopOwner && params.getHost() !== hostStopOwner) return;
			if (params.isForegroundUpdateClosed()) {
				await updateSuccessor.exit(code, finishLoopAfterSignals);
				return;
			}
			const owner = getManagedUpdateOwner();
			if (!owner) {
				if (!ownerToCommit) {
					if (updateSuccessor.capturedStop) await updateSuccessor.exit(code, finishLoopAfterSignals);
					else finishLoop(code);
				}
				return;
			}
			const committed = sameManagedUpdateOwner(owner, ownerToCommit) && eagerLifecycleRuntime.claimManagedServiceUpdateHandoff(owner) && await eagerLifecycleRuntime.commitManagedServiceUpdateHandoff(owner, commitOutcome);
			for (;;) {
				if (params.isForcedExitStarted() || !params.getSignals().pending) break;
				await params.getSignals().pending;
			}
			if (committed && sameManagedUpdateOwner(getManagedUpdateOwner(), owner) && eagerLifecycleRuntime.claimManagedServiceUpdateHandoff(owner)) {
				finishLoop(code);
				return;
			}
			await markRestartHandoffUnavailable();
			const ownerToCancel = ownerToCommit ?? owner;
			const restoration = await updateSuccessor.cancelHandoff(getManagedUpdateOwner, ownerToCancel);
			if (!restoration) {
				await updateSuccessor.cancel();
				return;
			}
			if (restoration === "restart-after-exit") {
				ownerToCommit = ownerToCancel;
				commitOutcome = "restore";
				const currentRequest = params.getRequest();
				if (currentRequest && !sameManagedUpdateOwner(currentRequest.restartIntent?.successorOwner, ownerToCancel)) currentRequest.restartIntent = {
					...currentRequest.restartIntent,
					successorOwner: ownerToCancel
				};
				continue;
			}
			if (code === 0 && !params.isForcedExitStarted() && !updateSuccessor.committed && initialOwner) return reacquireAndResumeInProcessRestart(getManagedUpdateOwner() ?? owner);
			finishLoop(code);
			return;
		}
	};
	const handleHostedStopAfterServerClose = async (owner, shutdownFailure) => {
		await updateSuccessor.waitForStopSettlement();
		if (params.getHost() !== owner) return;
		params.setTerminalHostedStop(owner);
		try {
			if (shutdownFailure) {
				await forceExitAfterStabilityBundle("gateway.stop_close_failed", 1, shutdownFailure);
				return;
			}
			const result = await owner.finishStop();
			if (result.outcome === "retired" || params.getHost() !== owner) return;
			if (result.outcome !== "accepted" && result.outcome !== "exit") {
				gatewayLog.error(`Scheduled Gateway stop failed: ${result.detail}`);
				if (result.outcome === "refused") {
					params.setPendingRestartCompletion({
						outcome: "planned_restart",
						reason: "gateway.stop_refused"
					});
					await releaseLockIfHeld();
					if (params.getHost() === owner) await reacquireAndResumeInProcessRestart();
				} else await forceExitAfterStabilityBundle("gateway.stop_native_unconfirmed");
				return;
			}
			gatewayLog.info(result.outcome === "accepted" ? "Native service manager accepted Gateway stop" : "Gateway host completed graceful stop");
			completeBoot({
				outcome: "clean_stop",
				reason: "stop (hosted Gateway stop)"
			});
			await releaseLockIfHeld();
			await finishLoopAfterCleanup(0, void 0, "update", owner);
		} catch (error) {
			gatewayLog.error(`Scheduled Gateway stop failed: ${formatErrorMessage(error)}`);
			if (params.getHost() === owner) await forceExitAfterStabilityBundle("gateway.stop_native_unconfirmed", 1, {
				step: "hosted-gateway-stop",
				error
			});
		} finally {
			if (params.getTerminalHostedStop() === owner) params.setTerminalHostedStop(void 0);
		}
	};
	return {
		finishLoopAfterCleanup,
		handleHostedStopAfterServerClose
	};
}
//#endregion
//#region src/cli/gateway-cli/update-successor.ts
var GatewayUpdateSuccessor = class {
	constructor(logger, lifecycle) {
		this.logger = logger;
		this.lifecycle = lifecycle;
		this.child = null;
		this.stopRequested = false;
	}
	get committed() {
		return this.child !== null;
	}
	get waitingForStop() {
		return this.foregroundStop !== void 0 && this.foregroundStop.state !== "settled";
	}
	get capturedStop() {
		return this.foregroundStop !== void 0;
	}
	get running() {
		const child = this.child;
		return Boolean(child && child !== true && child.pid && child.exitCode === null && child.signalCode === null);
	}
	commit(child) {
		if (this.child === child) return;
		this.child = child;
		if (child !== true) this.closed = new Promise((resolve) => {
			child.once("close", () => resolve());
		});
	}
	async observeReadiness(child, params) {
		const updateSentinel = params.foreground ? null : await this.lifecycle.readRestartSentinelReadOnly();
		params.beforeWait();
		const health = typeof params.port === "number" ? await this.lifecycle.waitForGatewayHealthyRestart({
			port: params.port,
			child,
			probeHosts: [params.host ?? "127.0.0.1"],
			requireRunningService: true,
			requirePluginHealth: false
		}) : void 0;
		if (this.stopRequested || health?.waitOutcome !== "healthy" && health?.waitOutcome !== "still-starting") return false;
		this.commit(child);
		if (health.waitOutcome === "still-starting") {
			this.logger.warn("update respawn is still starting; leaving the replacement process running");
			if (params.isCurrent() && updateSentinel?.payload.kind === "update" && updateSentinel.payload.status !== "error") await this.lifecycle.writeRestartSentinelIfUnchanged({
				payload: {
					...updateSentinel.payload,
					status: "skipped",
					continuation: null,
					stats: {
						...updateSentinel.payload.stats,
						reason: "still-starting"
					}
				},
				expectedRevision: updateSentinel.revision,
				isCurrent: params.isCurrent
			}).catch((error) => this.logger.warn(`failed to record pending update readiness: ${formatErrorMessage(error)}`));
		}
		return true;
	}
	stop(signal) {
		if (!this.stopRequested) {
			this.stopRequested = true;
			this.logger.info(`received ${signal}; stopping after foreground update settlement`);
			if (this.child && this.child !== true && this.running) try {
				this.child.kill(signal);
			} catch (error) {
				this.logger.warn(`fresh Gateway stop signal failed: ${formatErrorMessage(error)}`);
			}
		}
		this.joinForegroundStop();
	}
	joinForegroundStop() {
		const pending = this.foregroundStop;
		if (!pending || pending.state !== "waiting") return;
		pending.state = "joining";
		pending.owner.settle().then((joined) => {
			if (!joined) {
				pending.state = "waiting";
				this.logger.error("foreground update settlement unconfirmed; remaining draining; retry Stop after checking the updater");
				return;
			}
			pending.state = "settled";
			pending.confirmed.resolve();
			pending.onSettled();
		}).catch((error) => {
			pending.state = "waiting";
			this.logger.error(`foreground update settlement failed: ${formatErrorMessage(error)}`);
		});
	}
	retainForegroundStop(owner, onSettled) {
		this.foregroundStop ??= {
			owner,
			confirmed: createDeferredCore(),
			onSettled,
			state: "waiting"
		};
	}
	async completeForegroundHandoffAfterClose(identity) {
		const owner = this.lifecycle.captureForegroundUpdateHandoffStop({ onPark: () => {} });
		const completed = await this.lifecycle.completeForegroundUpdateHandoffAfterClose(identity);
		if (completed !== "pending") return completed;
		if (owner) this.retainForegroundStop(owner, () => {});
		const pending = this.foregroundStop;
		if (!pending) throw new Error("foreground update settlement owner is unavailable; remaining draining");
		await this.cancelHandoff(() => identity);
		this.joinForegroundStop();
		await pending.confirmed.promise;
		return { respawn: false };
	}
	async markHandoffUnavailable(foregroundClosed, reason = "restart-handoff-unavailable") {
		if (foregroundClosed) return;
		await this.lifecycle.markUpdateRestartSentinelFailure(reason).catch((error) => {
			this.logger.warn(`failed to mark update restart ${reason}: ${String(error)}`);
		});
	}
	handleSignal(request, foregroundActive, params) {
		const { action, signal, restartIntent } = request;
		const successorOwner = restartIntent?.successorOwner;
		if (this.waitingForStop && action !== "stop" && (action !== "restart" || !successorOwner || !this.foregroundStop?.owner.canPark(successorOwner))) {
			this.logger.info(`received ${signal}; ignoring restart while foreground update Stop is pending`);
			return true;
		}
		if (action !== "stop" || signal === "SIGUSR2") return false;
		if (!foregroundActive && !this.waitingForStop) {
			if (this.foregroundStop) return false;
			const owner = this.lifecycle.captureForegroundUpdateHandoffStop({ onPark: params.onPark });
			if (!owner) return false;
			this.retainForegroundStop(owner, params.onSettled);
			params.beforeWait();
		}
		this.stop(signal === "SIGINT" ? "SIGINT" : "SIGTERM");
		return true;
	}
	async cancelHandoff(getOwner, initialOwner = getOwner()) {
		let owner = initialOwner;
		let requiresParentExit = false;
		try {
			for (;;) {
				if (!owner) return requiresParentExit ? "restart-after-exit" : "restored-in-process";
				const restoration = await this.lifecycle.cancelManagedServiceUpdateHandoff(owner);
				if (!restoration) {
					this.logger.error("managed update handoff cancellation unconfirmed; remaining draining");
					return false;
				}
				requiresParentExit ||= restoration === "restart-after-exit";
				const replacement = getOwner();
				if (!replacement || sameManagedUpdateOwner(owner, replacement)) return requiresParentExit ? "restart-after-exit" : "restored-in-process";
				owner = replacement;
			}
		} catch (err) {
			this.logger.error(`managed update handoff cancellation failed: ${formatErrorMessage(err)}`);
			return false;
		}
	}
	async cancel() {
		const child = this.child;
		if (child && child !== true && child.exitCode === null && child.signalCode === null) try {
			child.kill("SIGTERM");
		} catch (error) {
			this.logger.warn(`fresh Gateway cancellation failed: ${formatErrorMessage(error)}`);
		}
		await this.closed;
	}
	async waitForStopSettlement() {
		if (this.stopRequested) await this.foregroundStop?.confirmed.promise;
	}
	async exit(code, exitProcess) {
		await this.waitForStopSettlement();
		const exitCode = code === 0 && !this.stopRequested && !this.running ? 1 : code;
		if (exitCode !== code) this.logger.error("fresh Gateway stopped before handoff completed; check its startup logs");
		if (this.stopRequested || exitCode !== 0) await this.closed;
		await exitProcess(exitCode);
	}
};
//#endregion
//#region src/cli/gateway-cli/run-loop.ts
const gatewayLog$1 = createSubsystemLogger("gateway");
const HARD_EXIT_WATCHDOG_GRACE_MS = 2e3;
async function runGatewayLoop(params) {
	if (process.title === "openclaw") process.title = "openclaw-gateway";
	let startupStartedAt;
	const initial = await prepareGatewayRunLoop(params, gatewayLog$1);
	const { lifecycleRuntime: eagerLifecycleRuntime, supervisor, supervisorMode, restartDecision, startupBudget } = initial;
	let lock = initial.lock;
	const cleanup = createGatewayRunCleanup(params.ownsProcessLifecycle, eagerLifecycleRuntime, gatewayLog$1, () => foregroundUpdateClosed);
	let server = null;
	let startupWork;
	let terminalExitCode;
	let hostLifecycle;
	let startupOperations = createGatewayStartupOperations();
	let runtimeResetPending = false;
	let terminalHostedStop;
	let shuttingDown = false;
	let hostExitRequested = false;
	let hostExitCode = 0;
	let hostExitReason;
	let releaseHostLifeline;
	let releaseOutputOwner;
	const requestWatchdogs = /* @__PURE__ */ new Set();
	let forcedExitStarted = false;
	let restartResolver = null;
	let pendingStartupRequest = null;
	let activeRestartRequest = null;
	const updateSuccessor = new GatewayUpdateSuccessor(gatewayLog$1, eagerLifecycleRuntime);
	let foregroundUpdateClosed = false;
	let forceActiveRestartExit = null;
	let installationReplacement;
	let pendingRestartCompletion;
	let restartDrainWarning;
	let bootCompletion;
	const completeBoot = (completion) => {
		pendingRestartCompletion = void 0;
		bootCompletion = Promise.resolve(params.completeBoot?.(formatBootCompletionContext(completion, installationReplacement?.reason, restartDrainWarning)));
		cleanup.retain(bootCompletion);
		restartDrainWarning = void 0;
	};
	let startupFailedWithoutServerHandle = false;
	const restartRecovery = createGatewayRestartRecovery(params, gatewayLog$1, supervisor);
	const processInstanceId = randomUUID();
	const getManagedUpdateOwner = () => (pendingStartupRequest ?? activeRestartRequest)?.restartIntent?.successorOwner;
	const cleanupSignals = () => {
		signals.retire();
		releaseHostLifeline?.();
		releaseHostLifeline = void 0;
		releaseOutputOwner?.();
		releaseOutputOwner = void 0;
		releaseInstallationObserver();
		signals.close();
		cleanup.releaseProcessLifetime();
	};
	const finishLoop = (code) => {
		if (pendingRestartCompletion) completeBoot(hostExitRequested && hostExitReason && pendingRestartCompletion.outcome === "planned_restart" ? formatHostExitCompletion(false, hostExitReason) : pendingRestartCompletion);
		terminalExitCode ??= hostExitRequested && code === 0 ? hostExitCode : code;
		restartResolver?.();
	};
	const { finishLoopAfterCleanup, handleHostedStopAfterServerClose } = createGatewayRunTerminal({
		runtime: eagerLifecycleRuntime,
		logger: gatewayLog$1,
		updateSuccessor,
		getSignals: () => signals,
		getHost: () => hostLifecycle,
		getRequest: () => pendingStartupRequest ?? activeRestartRequest,
		isForcedExitStarted: () => forcedExitStarted,
		isForegroundUpdateClosed: () => foregroundUpdateClosed,
		getTerminalHostedStop: () => terminalHostedStop,
		setTerminalHostedStop: (owner) => {
			terminalHostedStop = owner;
		},
		setPendingRestartCompletion: (completion) => {
			pendingRestartCompletion = completion;
		},
		drainProcessResources: cleanup.drainProcessResources,
		finishLoop,
		completeBoot,
		releaseLockIfHeld: () => releaseLockIfHeld(),
		markRestartHandoffUnavailable: () => markRestartHandoffUnavailable(),
		reacquireAndResumeInProcessRestart: (owner) => reacquireAndResumeInProcessRestart(owner),
		forceExitAfterStabilityBundle: (...args) => forceExitAfterStabilityBundle(...args)
	});
	const writeStabilityBundle = createGatewayStabilityReporter(eagerLifecycleRuntime, gatewayLog$1);
	const releaseLockIfHeld = async () => {
		await bootCompletion;
		await lock?.release();
		lock = null;
	};
	const exitReplacedInstallation = async (replacement) => {
		shuttingDown = true;
		gatewayLog$1.error(`${replacement.message} Cannot continue in this process. Run: ${formatCliCommand(supervisorMode ? "openclaw gateway restart" : "openclaw gateway run")}`);
		pendingRestartCompletion ??= {
			outcome: "planned_restart",
			reason: "gateway.installation_replaced"
		};
		await releaseLockIfHeld();
		await finishLoopAfterCleanup(1);
	};
	const forceExitAfterStabilityBundle = async (reason, exitCode = 1, failure) => {
		if (foregroundUpdateClosed || updateSuccessor.waitingForStop && !getManagedUpdateOwner() || forcedExitStarted) return;
		forcedExitStarted = true;
		const retirement = hostLifecycle?.retire();
		if (retirement) cleanup.retain(retirement);
		let stabilityFailure;
		try {
			writeStabilityBundle(reason, failure?.error, failure?.step);
		} catch (error) {
			stabilityFailure = { error };
		}
		await flushGatewayLogsBeforeExit(gatewayLog$1, HARD_EXIT_WATCHDOG_GRACE_MS / 2);
		if (foregroundUpdateClosed) return;
		const owner = getManagedUpdateOwner();
		if (owner) forceActiveRestartExit?.();
		const restoration = await updateSuccessor.cancelHandoff(getManagedUpdateOwner, owner);
		if (restoration) {
			completeBoot({
				outcome: "forced_stop",
				reason
			});
			if (restoration === "restart-after-exit") await finishLoopAfterCleanup(exitCode, owner, "restore");
			else finishLoop(exitCode);
		} else if (updateSuccessor.capturedStop) await updateSuccessor.exit(exitCode, (code) => {
			completeBoot({
				outcome: "forced_stop",
				reason
			});
			finishLoop(code);
		});
		if (stabilityFailure) throw stabilityFailure.error;
	};
	const reacquireAndResumeInProcessRestart = async (alreadyCancelledOwner) => {
		await signals.drain();
		if (foregroundUpdateClosed) return finishLoopAfterCleanup(1);
		for (;;) {
			if (forcedExitStarted) return;
			const restartRequest = activeRestartRequest;
			const restartOwner = restartRequest?.restartIntent?.successorOwner;
			const restoration = sameManagedUpdateOwner(restartOwner, alreadyCancelledOwner) ? "restored-in-process" : await updateSuccessor.cancelHandoff(getManagedUpdateOwner, restartOwner);
			if (!restoration || forcedExitStarted) return;
			if (restoration === "restart-after-exit") {
				await releaseLockIfHeld();
				return finishLoopAfterCleanup(0, restartOwner, "restore");
			}
			if (activeRestartRequest !== restartRequest) continue;
			if (installationReplacement) return exitReplacedInstallation(installationReplacement);
			if (!updateSuccessor.stopRequested && !hostExitRequested) try {
				lock = await acquireGatewayLock({
					port: params.lockPort,
					listenerMode: supervisorMode ? "supervised" : "foreground",
					supervisor
				});
			} catch (err) {
				if (forcedExitStarted) return;
				if (activeRestartRequest !== restartRequest) continue;
				gatewayLog$1.error(`failed to reacquire gateway lock for in-process restart: ${formatErrorMessage(err)}`);
				finishLoop(1);
				return;
			}
			if (updateSuccessor.stopRequested || hostExitRequested) await releaseLockIfHeld();
			if (installationReplacement) return exitReplacedInstallation(installationReplacement);
			if (!forcedExitStarted && activeRestartRequest === restartRequest) {
				while (signals.pending) await signals.pending;
				if (forcedExitStarted || activeRestartRequest !== restartRequest) {
					await releaseLockIfHeld();
					continue;
				}
				activeRestartRequest = null;
				if (updateSuccessor.stopRequested || hostExitRequested) return restartRequest?.hostedStop ? handleHostedStopAfterServerClose(restartRequest.hostedStop, void 0) : finishLoopAfterCleanup(0);
				shuttingDown = false;
				signals.sealStore();
				restartResolver?.();
				return;
			}
			await releaseLockIfHeld();
		}
	};
	const markRestartHandoffUnavailable = (reason) => updateSuccessor.markHandoffUnavailable(foregroundUpdateClosed, reason);
	const handleRestartAfterServerClose = async (expectedOwner, initiallyCancelled = false, failure) => {
		await signals.drain();
		let cancelled = initiallyCancelled;
		const foregroundHandoff = expectedOwner && !cancelled && eagerLifecycleRuntime.isForegroundUpdateHandoff(expectedOwner);
		if (foregroundHandoff) try {
			await eagerLifecycleRuntime.stopActiveManagedProviderLocalServices();
		} catch (error) {
			gatewayLog$1.error(`foreground update cancelled after provider cleanup failed: ${formatErrorMessage(error)}`);
			await markRestartHandoffUnavailable("restart-local-service-stop-failed");
			const restoration = await eagerLifecycleRuntime.cancelManagedServiceUpdateHandoff(expectedOwner).catch(() => false);
			if (!restoration) {
				gatewayLog$1.error("foreground update cancellation unconfirmed; remaining draining");
				return;
			}
			if (restoration === "restart-after-exit") {
				await releaseLockIfHeld();
				return finishLoopAfterCleanup(1, expectedOwner, "restore");
			}
			cancelled = true;
		}
		await releaseLockIfHeld();
		if (forcedExitStarted) return;
		if (hostExitRequested) {
			completeBoot(formatHostExitCompletion(Boolean(failure), hostExitReason));
			return finishLoopAfterCleanup(failure ? 1 : 0);
		}
		const restartReason = activeRestartRequest?.restartReason;
		pendingRestartCompletion = formatRestartCompletion(activeRestartRequest, Boolean(failure));
		const isUpdateRestart = isUpdateProcessRestartReason(restartReason);
		if (cancelled) return reacquireAndResumeInProcessRestart(expectedOwner);
		if (activeRestartRequest?.restartIntent?.successorOwner) {
			if (!expectedOwner) {
				gatewayLog$1.error("managed update handoff arrived after successor parking closed");
				await markRestartHandoffUnavailable();
				return reacquireAndResumeInProcessRestart();
			}
			if (foregroundHandoff) {
				if (!sameManagedUpdateOwner(getManagedUpdateOwner(), expectedOwner)) {
					if (await updateSuccessor.cancelHandoff(getManagedUpdateOwner, expectedOwner) === "restored-in-process") return reacquireAndResumeInProcessRestart(getManagedUpdateOwner());
					return;
				}
				foregroundUpdateClosed = true;
				forceActiveRestartExit?.();
				const completed = await updateSuccessor.completeForegroundHandoffAfterClose(expectedOwner);
				if (updateSuccessor.stopRequested && activeRestartRequest.hostedStop) return handleHostedStopAfterServerClose(activeRestartRequest.hostedStop, void 0);
				if (!completed.respawn) {
					gatewayLog$1.error("foreground update did not authorize a fresh Gateway; leaving it stopped for recovery");
					return finishLoopAfterCleanup(1);
				}
				if (updateSuccessor.stopRequested) return finishLoopAfterCleanup(0);
			} else {
				gatewayLog$1.info("restart mode: managed update handoff owns successor");
				return finishLoopAfterCleanup(0, expectedOwner);
			}
		}
		const respawnOptions = {
			decision: restartDecision,
			env: createGatewayRestartTraceHandoffEnv(captureGatewayRestartTraceHandoff())
		};
		const isStandaloneUpdate = Boolean(foregroundHandoff) || isUpdateRestart && !supervisorMode;
		const respawn = isStandaloneUpdate ? eagerLifecycleRuntime.respawnGatewayProcessForUpdate(respawnOptions) : eagerLifecycleRuntime.restartGatewayProcessWithFreshPid(respawnOptions);
		if (respawn.mode === "spawned") {
			const child = respawn.child;
			if (foregroundUpdateClosed) updateSuccessor.commit(child);
			const observedRestartRequest = activeRestartRequest;
			const accepted = await updateSuccessor.observeReadiness(child, {
				port: params.lockPort,
				host: params.healthHost,
				foreground: foregroundUpdateClosed,
				beforeWait: () => forceActiveRestartExit?.(),
				isCurrent: () => !foregroundUpdateClosed && activeRestartRequest === observedRestartRequest
			});
			if (updateSuccessor.stopRequested) return finishLoopAfterCleanup(0);
			if (accepted) {
				gatewayLog$1.info(`restart mode: update process respawn (spawned pid ${respawn.pid ?? "unknown"})`);
				return finishLoopAfterCleanup(0);
			}
			gatewayLog$1.warn(`update respawn child did not become healthy (${respawn.pid ?? "unknown"}); ${foregroundUpdateClosed ? "shutdown pending; retaining the replacement until it closes; inspect its startup logs" : installationReplacement ? "the replaced runtime cannot resume" : "falling back to in-process restart"}`);
			try {
				await (foregroundUpdateClosed ? updateSuccessor.cancel() : child.kill());
			} catch (error) {
				gatewayLog$1.warn(`update respawn child did not settle: ${formatErrorMessage(error)}`);
			}
			await markRestartHandoffUnavailable("restart-unhealthy");
			return reacquireAndResumeInProcessRestart();
		}
		if (respawn.mode === "supervised") {
			const restartKind = isUpdateRestart ? "update-process" : "full-process";
			markGatewayRestartTrace("restart.full-process-handoff", [
				["kind", restartKind],
				["mode", respawn.mode],
				["pid", "none"],
				["supervisorMode", supervisorMode ?? "none"]
			]);
			const handoffRequest = activeRestartRequest;
			const handoffIsCurrent = () => signals.active && !forcedExitStarted && activeRestartRequest === handoffRequest;
			let handoff = null;
			try {
				handoff = await eagerLifecycleRuntime.writeGatewayRestartHandoff({
					restartKind,
					reason: restartReason,
					processInstanceId,
					supervisorMode: supervisorMode ?? "external",
					restartTrace: captureGatewayRestartTraceHandoff()
				}, () => {
					if (!handoffIsCurrent()) throw new Error("Gateway restart handoff no longer owns the shutdown request");
				});
			} catch (error) {
				if (handoffIsCurrent()) throw error;
			}
			if (forcedExitStarted || !signals.active) return;
			if (activeRestartRequest !== handoffRequest) return handleRestartAfterServerClose();
			if (supervisorMode === "external" && !handoff) {
				gatewayLog$1.warn(`external supervisor restart handoff could not be persisted; ${installationReplacement ? "the replaced runtime cannot resume" : "falling back to in-process restart"}`);
				if (isUpdateRestart) await markRestartHandoffUnavailable();
				return reacquireAndResumeInProcessRestart();
			}
			gatewayLog$1.info("restart mode: full process restart (supervisor restart)");
			if (supervisorMode === "launchd") {
				if (!await waitForLaunchdRestartHandoff(respawn.handoffSpawned)) {
					writeStabilityBundle("gateway.restart_handoff_spawn_failed");
					gatewayLog$1.warn(`launchd restart handoff failed to spawn; ${installationReplacement ? "the replaced runtime cannot resume" : "falling back to in-process restart"}`);
					if (isUpdateRestart) await markRestartHandoffUnavailable();
					return reacquireAndResumeInProcessRestart();
				}
			}
			updateSuccessor.commit(true);
			return finishLoopAfterCleanup(respawn.exitCode ?? 0);
		}
		if (respawn.mode === "failed") {
			if (!isStandaloneUpdate) writeStabilityBundle("gateway.restart_respawn_failed");
			gatewayLog$1.warn(`${isStandaloneUpdate ? "update respawn" : "full process restart"} failed (${respawn.detail ?? "unknown error"}); ${foregroundUpdateClosed ? "leaving Gateway stopped for recovery" : installationReplacement ? "the replaced runtime cannot resume" : "falling back to in-process restart"}`);
			if (isUpdateRestart) await markRestartHandoffUnavailable("restart-unhealthy");
		} else gatewayLog$1.info(`restart mode: ${foregroundUpdateClosed ? "fresh process unavailable; leaving Gateway stopped" : installationReplacement ? "replaced runtime must exit" : "in-process restart"} (${respawn.detail ?? "OPENCLAW_NO_RESPAWN"})`);
		if (!isUpdateRestart && isUpdateProcessRestartReason(activeRestartRequest?.restartReason)) return handleRestartAfterServerClose();
		return reacquireAndResumeInProcessRestart();
	};
	let reportedBudget = startupBudget;
	startupBudget.log("startup");
	const startupWatchdog = createGatewayStartupWatchdog({
		startupBudget,
		supervisorMode,
		gatewayLog: gatewayLog$1,
		ownsProcessLifecycle: params.ownsProcessLifecycle,
		hardExitGraceMs: HARD_EXIT_WATCHDOG_GRACE_MS,
		retireWatchdog: cleanup.retireWatchdog,
		retainCleanup: cleanup.retain,
		hasPendingRequest: () => pendingStartupRequest !== null,
		reportBudget: (budget) => {
			reportedBudget = budget;
		},
		onTimeout: () => {
			cleanup.retain(forceExitAfterStabilityBundle("gateway.restart_startup_request_timeout"));
		}
	});
	const runAcceptedRequest = (acceptedRequest) => {
		const { action, restartIntent } = acceptedRequest;
		let budget = startupBudget;
		reportedBudget = budget;
		const isRestart = action !== "stop";
		const restartWithoutSupervisor = action === "restart" && restartDecision.mode === "disabled";
		const acceptedStartupOperations = startupOperations;
		if (acceptedRequest.action === "stop") acceptedStartupOperations.close();
		if (action === "restart") activeRestartRequest = acceptedRequest;
		else if (!isRestart) startGatewayRestartTrace("stop.signal.received", [["signal", acceptedRequest.signal]]);
		let forceExitTimer = null;
		let shutdownDeadline;
		let hardExitWatchdog = null;
		let lastDrainCounts = "not observed";
		let shutdownFailure;
		const armForceExitTimer = (forceExitMs) => {
			if (forceExitTimer || updateSuccessor.waitingForStop && !getManagedUpdateOwner()) return;
			shutdownDeadline = performance$1.now() + forceExitMs;
			forceExitTimer = setTimeout(() => {
				const exitOk = budget.nativeStopBudget && !restartWithoutSupervisor && !shutdownFailure;
				gatewayLog$1.warn(`shutdown deadline reached; waiting for unfinished cleanup and active work before ${action}; last observed: ${lastDrainCounts}; pending close steps: ${formatGatewayPendingCloseSteps()}; cleanup incomplete; exitCode=${exitOk ? 0 : 1}`);
				cleanup.retain(forceExitAfterStabilityBundle(isRestart ? "gateway.restart_shutdown_timeout" : "gateway.stop_shutdown_timeout", exitOk ? 0 : 1, shutdownFailure));
			}, forceExitMs);
			if (params.ownsProcessLifecycle === true) {
				forceExitTimer.unref();
				hardExitWatchdog = armShutdownHardExitWatchdog({
					delayMs: forceExitMs + HARD_EXIT_WATCHDOG_GRACE_MS,
					onError: (error) => {
						gatewayLog$1.warn(`hard-exit watchdog failed; retaining main-thread shutdown timer: ${formatErrorMessage(error)}`);
					}
				});
			}
		};
		const clearForceExitTimer = () => {
			clearTimeout(forceExitTimer ?? void 0);
			forceExitTimer = null;
			shutdownDeadline = void 0;
			cleanup.retireWatchdog(hardExitWatchdog);
			hardExitWatchdog = null;
		};
		requestWatchdogs.add(clearForceExitTimer);
		if (action === "restart") forceActiveRestartExit = () => {
			clearForceExitTimer();
			if (!getManagedUpdateOwner() && !updateSuccessor.waitingForStop) armForceExitTimer(budget.timeoutMs);
		};
		const shutdownOperation = (async () => {
			if (process.platform === "linux" || process.platform === "darwin") {
				if (budget.nativeStopBudget && !getManagedUpdateOwner()) armForceExitTimer(budget.timeoutMs);
				budget = await resolveGatewayShutdownBudget(supervisorMode, gatewayLog$1, {
					previous: startupBudget,
					acceptedAtMs: acceptedRequest.acceptedAtMs
				});
				if (forcedExitStarted) return;
				reportedBudget = budget;
				clearForceExitTimer();
			}
			budget.log("shutdown");
			let managedUpdateOwner;
			let managedUpdateCancellation;
			const drainBudget = resolveGatewayShutdownDrainBudget({
				budget,
				action,
				forceRestart: restartIntent?.force === true,
				interruptAfterDrain: acceptedRequest.interruptAfterDrain,
				restartWithoutSupervisor,
				acceptedAtMs: acceptedRequest.acceptedAtMs,
				requestedRestartDrainTimeoutMs: isRestart ? eagerLifecycleRuntime.resolveGatewayRestartDrainTimeoutMs(restartIntent) : 0
			});
			if (drainBudget.forceExitMs !== void 0 && (!isRestart || !getManagedUpdateOwner())) armForceExitTimer(drainBudget.forceExitMs);
			let shutdownStep = "restart-failure-recovery";
			let startupFailure;
			try {
				await restartRecovery.waitForCleanup();
				shutdownStep = "active-work-drain";
				await drainGatewayActiveWork({
					request: acceptedRequest,
					runtime: eagerLifecycleRuntime,
					drainTimeoutMs: drainBudget.drainTimeoutMs,
					restartDrainDeadlineAt: drainBudget.restartDrainDeadlineAt,
					recordCounts: (counts) => {
						lastDrainCounts = counts;
					},
					recordWarning: (warning) => {
						restartDrainWarning = warning;
					},
					logger: gatewayLog$1
				});
				if (isRestart && activeRestartRequest?.restartIntent?.successorOwner) {
					const owner = activeRestartRequest.restartIntent.successorOwner;
					managedUpdateOwner = owner;
					try {
						if (!sameManagedUpdateOwner(getManagedUpdateOwner(), owner) || !await eagerLifecycleRuntime.requestManagedServiceUpdateHandoffPark(owner) || !sameManagedUpdateOwner(getManagedUpdateOwner(), owner) || !eagerLifecycleRuntime.claimManagedServiceUpdateHandoff(owner)) throw new Error("managed update helper lost exact ownership during service parking");
					} catch (err) {
						clearForceExitTimer();
						gatewayLog$1.error(`managed update handoff could not park ${supervisorMode}: ${String(err)}`);
						await markRestartHandoffUnavailable();
						managedUpdateCancellation = await updateSuccessor.cancelHandoff(getManagedUpdateOwner, owner);
						if (!managedUpdateCancellation) return;
						if (managedUpdateCancellation === "restart-after-exit") {
							await releaseLockIfHeld();
							await finishLoopAfterCleanup(0, owner, "restore");
							return;
						}
					}
				}
				if (isRestart && !forceExitTimer) armForceExitTimer(drainBudget.restartTimeoutMs());
				if (acceptedRequest.action === "stop") {
					shutdownStep = "startup-operations";
					try {
						await acceptedStartupOperations.drain();
					} catch (error) {
						startupFailure = { error };
					}
					await startupWork?.catch(() => {});
				}
				shutdownStep = "restart-signal-settlement";
				await signals.settle();
				shutdownStep = "gateway-server-close";
				await runWithProcessCleanupBudget(budget.cleanupBudget(shutdownDeadline, HARD_EXIT_WATCHDOG_GRACE_MS), () => server?.close({
					retainSharedState: true,
					reason: isRestart ? "gateway restarting" : "gateway stopping",
					restartExpectedMs: isRestart ? 1500 : null,
					...isRestart ? { drainTimeoutMs: drainBudget.closeDrainTimeoutMs() } : {}
				}));
				if (startupFailure) {
					shutdownStep = "startup-operations";
					throw startupFailure.error;
				}
			} catch (err) {
				const error = startupFailure && startupFailure.error !== err ? new AggregateError([startupFailure.error, err], "Gateway startup and close cleanup failed") : err;
				shutdownFailure = {
					step: shutdownStep,
					error
				};
				cleanup.markFailed();
				gatewayLog$1.error(`shutdown step failed (${shutdownStep.replaceAll("-", " ")}): ${formatErrorMessage(error)}`);
			} finally {
				signals.openStore();
				const handoffClosed = managedUpdateCancellation !== false && managedUpdateCancellation !== "restart-after-exit";
				if (handoffClosed) server = null;
				if (forcedExitStarted) await cleanup.drainProcessResources();
				else if (action === "restart") {
					if (!acceptedRequest.hostedStop) await hostLifecycle?.retire();
					if (shutdownFailure) {
						if (installationReplacement && supervisorMode && !getManagedUpdateOwner()) {
							writeStabilityBundle("gateway.restart_close_failed", shutdownFailure.error, shutdownFailure.step);
							await handleRestartAfterServerClose(void 0, false, shutdownFailure);
						} else await forceExitAfterStabilityBundle("gateway.restart_close_failed", 1, shutdownFailure);
					} else if (handoffClosed) await handleRestartAfterServerClose(managedUpdateOwner, managedUpdateCancellation === "restored-in-process");
				} else if (acceptedRequest.hostedStop) await handleHostedStopAfterServerClose(acceptedRequest.hostedStop, shutdownFailure);
				else {
					await hostLifecycle?.retire();
					if (isRestart && shutdownFailure) await forceExitAfterStabilityBundle("gateway.restart_close_failed", 1, shutdownFailure);
					else {
						if (shutdownFailure) writeStabilityBundle("gateway.stop_close_failed", shutdownFailure.error, shutdownFailure.step);
						completeBoot(formatShutdownCompletion(acceptedRequest, Boolean(shutdownFailure), hostExitReason));
						await releaseLockIfHeld();
						await finishLoopAfterCleanup(shutdownFailure ? 1 : 0);
					}
				}
				if (!forcedExitStarted) {
					clearForceExitTimer();
					requestWatchdogs.delete(clearForceExitTimer);
				}
			}
		})().finally(() => {
			if (action === "restart") forceActiveRestartExit = null;
		});
		cleanup.retain(shutdownOperation);
		if (acceptedRequest.action === "stop") acceptedStartupOperations.retainStopCompletion(shutdownOperation);
	};
	const flushPendingStartupRequest = (opts = {}) => {
		if (!pendingStartupRequest || !restartResolver) return;
		if (!server && opts.allowMissingServer !== true) return;
		const request = pendingStartupRequest;
		pendingStartupRequest = null;
		startupWatchdog.clear();
		startupFailedWithoutServerHandle = false;
		runAcceptedRequest(request);
	};
	const request = (action, signal, restartReason, restartIntent, hostedStop, signalContext) => {
		if (terminalExitCode !== void 0 || hostExitRequested && action !== "stop") return;
		if (hostExitRequested && action === "stop") hostExitReason ??= formatShutdownReason({
			action,
			signal,
			restartReason
		});
		if (updateSuccessor.handleSignal({
			action,
			signal,
			restartIntent
		}, foregroundUpdateClosed || (pendingStartupRequest ?? activeRestartRequest)?.foregroundUpdate, {
			beforeWait: () => {
				const drainReason = formatShutdownReason({
					action: "stop",
					signal,
					restartReason
				});
				eagerLifecycleRuntime.markGatewayDraining(drainReason);
				startupWatchdog.clear();
				forceActiveRestartExit?.();
			},
			onPark: (successorOwner) => request("restart", signal, "update.run", { successorOwner }, hostedStop),
			onSettled: () => request("stop", signal, restartReason, void 0, hostedStop)
		}) || foregroundUpdateClosed) return;
		const acceptedRequest = {
			acceptedAtMs: signalContext?.acceptedAtMs ?? performance$1.now(),
			action,
			signal,
			restartReason,
			restartIntent,
			foregroundUpdate: action === "restart" && restartIntent?.successorOwner !== void 0 && eagerLifecycleRuntime.isForegroundUpdateHandoff(restartIntent.successorOwner),
			hostedStop
		};
		const trigger = action === "stop" ? restartReason ?? signal : signal;
		restartRecovery.abort();
		if (shuttingDown) {
			const currentRestartRequest = pendingStartupRequest ?? activeRestartRequest;
			const upgradedRequest = resolveGatewayRunSignalRequestUpgrade(currentRestartRequest, acceptedRequest);
			if (upgradedRequest) {
				if (pendingStartupRequest) pendingStartupRequest = upgradedRequest;
				else {
					activeRestartRequest = upgradedRequest;
					forceActiveRestartExit?.();
				}
				gatewayLog$1.info(`received ${signal} during shutdown; upgrading to ${restartReason}`);
				return;
			}
			if (action === "stop" && pendingStartupRequest && !server) {
				gatewayLog$1.info(`received ${trigger}; overriding pending startup restart with shutdown`);
				pendingStartupRequest = null;
				startupWatchdog.clear();
				startupFailedWithoutServerHandle = false;
				const drainReason = formatShutdownReason(acceptedRequest);
				eagerLifecycleRuntime.markGatewayDraining(drainReason);
				runAcceptedRequest(acceptedRequest);
				return;
			}
			if (action === "stop" && !hostExitRequested && currentRestartRequest?.action === "restart" && !currentRestartRequest.restartIntent?.successorOwner) {
				hostExitRequested = true;
				hostExitReason ??= formatShutdownReason(acceptedRequest);
			}
			gatewayLog$1.info(`received ${trigger} during shutdown; ${hostExitRequested ? "finishing shutdown without restart" : "ignoring"}`);
			return;
		}
		if (action !== "restart" && signal === "SIGTERM") {
			const handoff = signalContext?.suspendHandoff ?? consumeGatewaySuspendHandoff(hostLifecycle?.capability.externalRestart);
			if (!handoff.ok) gatewayLog$1.warn(`external restart handoff refused: ${handoff.error}`);
			else if (handoff.value) {
				acceptedRequest.action = "external-restart";
				acceptedRequest.restartIntent = {
					...acceptedRequest.restartIntent,
					force: true
				};
				acceptedRequest.interruptAfterDrain = true;
			}
		}
		const isRestart = acceptedRequest.action !== "stop";
		if (hostLifecycle !== hostedStop) {
			const retirement = hostLifecycle?.retire();
			if (retirement) cleanup.retain(retirement);
		}
		const drainReason = formatShutdownReason(acceptedRequest);
		if (action !== "restart" || !signalContext?.deferRestartDrain || server && restartResolver) eagerLifecycleRuntime.markGatewayDraining(drainReason);
		shuttingDown = true;
		gatewayLog$1.info(`received ${trigger}; ${isRestart ? "restarting" : "shutting down"}`);
		if (isRestart) startGatewayRestartTrace("restart.signal.received", [
			["signal", signal],
			["reason", restartReason ?? signal],
			["force", acceptedRequest.restartIntent?.force === true],
			["waitMs", restartIntent?.waitMs ?? "default"]
		]);
		if (action === "stop") {
			runAcceptedRequest(acceptedRequest);
			return;
		}
		if (!server && restartResolver && startupFailedWithoutServerHandle) {
			startupFailedWithoutServerHandle = false;
			runAcceptedRequest(acceptedRequest);
			return;
		}
		if (!server || !restartResolver) {
			pendingStartupRequest = acceptedRequest;
			startupWatchdog.arm(acceptedRequest);
			return;
		}
		runAcceptedRequest(acceptedRequest);
	};
	const signals = createGatewayRunSignals({
		lifecycle: eagerLifecycleRuntime,
		logger: gatewayLog$1,
		timeoutMs: startupBudget.timeoutMs,
		getIteration: () => startupOperations,
		isTerminal: () => terminalExitCode !== void 0,
		isForcedExitStarted: () => forcedExitStarted,
		isForegroundUpdateClosed: () => foregroundUpdateClosed,
		isRuntimeResetPending: () => runtimeResetPending,
		isShuttingDown: () => shuttingDown,
		getExternalRestartOwner: () => hostLifecycle?.capability.externalRestart,
		getTerminalHostedStop: () => terminalHostedStop === hostLifecycle ? terminalHostedStop : void 0,
		updateSuccessor,
		forceExit: (reason) => cleanup.retain(forceExitAfterStabilityBundle(reason)),
		request
	});
	const releaseInstallationObserver = registerGatewayRunInstallationReplacement({
		waitForUpdates: eagerLifecycleRuntime.waitForSystemServiceUpdateHandoffs,
		logger: gatewayLog$1,
		supervised: Boolean(supervisorMode),
		accept: (fact) => {
			installationReplacement = fact;
			request("restart", "SIGUSR2", fact.reason);
		}
	});
	let loopFailure;
	try {
		if (params.ownsProcessLifecycle) releaseOutputOwner = registerSignalExitOwner((code, reason) => {
			if (Number(code) !== 0 && hostExitCode === 0) hostExitCode = Number(code);
			hostExitRequested = true;
			request("stop", "process exit", reason);
		});
		releaseHostLifeline = installGatewayHostLifeline(() => {
			hostExitRequested = true;
			request("stop", "host lifeline closed");
		});
		let isFirstIteration = true;
		let retryAfterTriage = false;
		for (;;) {
			if (terminalExitCode !== void 0) break;
			const isTriageRetry = retryAfterTriage;
			retryAfterTriage = false;
			const iterationStartupOperations = isFirstIteration ? startupOperations : createGatewayStartupOperations();
			startupOperations = iterationStartupOperations;
			runtimeResetPending = !isFirstIteration;
			await hostLifecycle?.retire();
			if (terminalExitCode !== void 0) break;
			const iterationHost = createGatewayHostLifecycle({
				processOwner: {
					ownsProcessLifecycle: params.ownsProcessLifecycle === true,
					supervisor: supervisorMode
				},
				isCurrent: () => hostLifecycle === iterationHost,
				isServing: () => server !== null && restartResolver !== null && !shuttingDown,
				getShutdownBudget: () => shuttingDown ? reportedBudget : startupBudget,
				acceptStop: () => request("stop", "hosted Gateway stop", void 0, void 0, iterationHost),
				commitExternalStop: () => request("stop", "SIGTERM")
			});
			hostLifecycle = iterationHost;
			let startupFailedBeforeServerHandle = false;
			const isRestartIteration = !isFirstIteration;
			isFirstIteration = false;
			try {
				cleanup.beginIteration();
				if (pendingRestartCompletion) completeBoot(pendingRestartCompletion);
				await bootCompletion;
				if (isRestartIteration) {
					startupWork = prepareGatewayRestartIteration(eagerLifecycleRuntime, gatewayLog$1, () => terminalExitCode === void 0);
					await startupWork;
					startupWork = void 0;
					if (terminalExitCode !== void 0) break;
				}
				runtimeResetPending = false;
				signals.openStore();
				if (installationReplacement) {
					await exitReplacedInstallation(installationReplacement);
					break;
				}
				if (iterationStartupOperations.getStopCompletion()) {
					await iterationStartupOperations.getStopCompletion();
					break;
				}
				startupStartedAt = Date.now();
				startupWork = measureGatewayBootstrapStep("cli.bootstrap.boot-lifecycle", () => params.beginBoot?.(startupStartedAt));
				await startupWork;
				startupWork = void 0;
				if (terminalExitCode !== void 0) break;
				if (installationReplacement) {
					await exitReplacedInstallation(installationReplacement);
					break;
				}
				if (iterationStartupOperations.getStopCompletion()) {
					await iterationStartupOperations.getStopCompletion();
					break;
				}
				const starting = params.start({
					...isRestartIteration ? {} : { processStartedAt: performance$1.timeOrigin },
					startupStartedAt,
					requestHotReloadRecovery: eagerLifecycleRuntime.requestGatewayRestartWithSignalAdmission,
					hostLifecycle: iterationHost.capability,
					startupOperation: iterationStartupOperations.run,
					gatewayStateOwner: lock ?? void 0
				}).then((startedServer) => {
					server = startedServer;
					return startedServer;
				});
				startupWork = starting;
				const startedServer = await starting;
				server = startedServer;
				startupWork = void 0;
				iterationStartupOperations.close();
				startupFailedWithoutServerHandle = false;
				if (terminalExitCode !== void 0) break;
				await new Promise((resolve, reject) => {
					restartResolver = () => {
						restartResolver = null;
						resolve();
					};
					startedServer.startupSettled.then(void 0, reject);
					flushPendingStartupRequest();
				});
			} catch (err) {
				runtimeResetPending = false;
				startupWork = void 0;
				iterationStartupOperations.close();
				signals.openStore();
				if (iterationStartupOperations.getStopCompletion() && (iterationStartupOperations.cancelledWith(err) || iterationStartupOperations.failedWith(err))) {
					await iterationStartupOperations.getStopCompletion();
					if (iterationStartupOperations.cancelledWith(err)) break;
					throw err;
				}
				await iterationHost.retire();
				const failedServer = server;
				server = null;
				const maintenanceRequired = findStartupMaintenanceRequiredError(err);
				completeBoot(formatStartupFailureCompletion(err, maintenanceRequired?.code));
				try {
					await signals.settle();
					await failedServer?.close({
						reason: "gateway startup failed",
						retainSharedState: true
					});
				} catch (closeError) {
					throw new GatewayStartupCleanupError(err, closeError);
				} finally {
					signals.openStore();
				}
				if (collectNestedErrorCandidates(err).some((error) => error instanceof GatewayStartupCleanupError)) throw err;
				if (installationReplacement) {
					await exitReplacedInstallation(installationReplacement);
					break;
				}
				if (terminalExitCode !== void 0 || maintenanceRequired || !isRestartIteration || isTriageRetry && supervisorMode) {
					await cleanup.waitForCleanup();
					if (!cleanup.failed && !cleanup.drained) try {
						try {
							await iterationStartupOperations.drain();
						} catch (startupError) {
							if (startupError !== err) throw startupError;
						}
						await cleanup.drainProcessResources();
					} catch (cleanupError) {
						throw new GatewayStartupCleanupError(err, cleanupError);
					}
					throw err;
				}
				startupFailedWithoutServerHandle = true;
				startupFailedBeforeServerHandle = true;
				if (!pendingStartupRequest) await releaseLockIfHeld();
				writeStabilityBundle("gateway.restart_startup_failed", err);
				restartRecovery.reportStartupFailure(err, isTriageRetry);
				if (!shuttingDown && !isTriageRetry) retryAfterTriage = await restartRecovery.attempt(err) && !shuttingDown;
				if (!retryAfterTriage && !shuttingDown) restartRecovery.reportManualRecovery();
			}
			if (startupFailedBeforeServerHandle && terminalExitCode === void 0) await new Promise((resolve) => {
				restartResolver = () => {
					restartResolver = null;
					resolve();
				};
				flushPendingStartupRequest({ allowMissingServer: true });
				if (retryAfterTriage && !shuttingDown) request("restart", "SIGUSR2", "gateway.triage_completed");
			});
			await cleanup.waitForCleanup();
			if (cleanup.failed) finishLoop(1);
		}
	} catch (error) {
		loopFailure = { error };
	}
	const failures = await cleanup.settleFinalResources({
		retireSignals: () => signals.retire(),
		drainSignals: () => signals.drain(),
		closeTerminalServer: async () => {
			if (server) {
				await server.close({
					reason: "gateway stopping",
					retainSharedState: true
				});
				server = null;
				await cleanup.drainProcessResources();
			}
		},
		retireHost: () => hostLifecycle?.retire(),
		closeSharedState: () => drainGlobalSingletonLifecycleState("shared-state"),
		releaseLock: releaseLockIfHeld,
		clearStartupWatchdog: startupWatchdog.clear,
		clearRequestWatchdogs: () => {
			for (const clear of requestWatchdogs) clear();
			requestWatchdogs.clear();
		},
		cleanupSignals,
		onSettled: params.onProcessResourcesSettled
	});
	if (loopFailure) failures.unshift(loopFailure.error);
	if (failures.length === 1) throw failures[0];
	if (failures.length > 1) throw new AggregateError(failures, "Gateway loop and final resource cleanup failed", { cause: failures[0] });
	const code = hostExitRequested && terminalExitCode === 0 ? hostExitCode : terminalExitCode ?? 0;
	return cleanup.failed && code === 0 ? 1 : code;
}
//#endregion
//#region src/cli/gateway-cli/run-option-values.ts
const toOptionString = (value) => {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "bigint") return value.toString();
};
async function resolveGatewayPasswordOption(opts) {
	const direct = toOptionString(opts.password);
	const file = toOptionString(opts.passwordFile);
	if (direct && file) throw new Error("Use either --password or --password-file.");
	if (file) {
		const { readSecretFromFile } = await import("./secret-file-B8lXCGFk.mjs");
		return readSecretFromFile(file, "Gateway password");
	}
	return direct;
}
//#endregion
//#region src/cli/gateway-cli/startup-trace.ts
function createGatewayCliStartupTrace(log) {
	const enabled = isTruthyEnvValue(process.env.OPENCLAW_GATEWAY_STARTUP_TRACE);
	let last = performance.now();
	const emit = (name, durationMs, completedAt) => {
		if (enabled) {
			const startedAt = completedAt - durationMs;
			recordGatewayBootstrapStep(name, startedAt, completedAt);
			log.info(`startup trace: ${name} ${durationMs.toFixed(1)}ms total=${completedAt.toFixed(1)}ms start=${startedAt.toFixed(1)}ms`);
		}
	};
	const startMeasure = (name, run) => {
		const before = performance.now();
		let completedAt = before;
		let emitted = false;
		const result = withDiagnosticPhase(name, run).finally(() => {
			completedAt = performance.now();
		});
		return {
			result,
			settled: result.then(() => {}, () => {}),
			emit() {
				if (emitted) return;
				emitted = true;
				emit(name, completedAt - before, completedAt);
				last = completedAt;
			}
		};
	};
	return {
		mark(name) {
			const now = performance.now();
			emit(name, now - last, now);
			last = now;
		},
		startMeasure,
		async measure(name, run) {
			const measurement = startMeasure(name, run);
			try {
				return await measurement.result;
			} finally {
				await measurement.settled;
				measurement.emit();
			}
		}
	};
}
//#endregion
//#region src/cli/gateway-cli/startup-triage.ts
async function triageGatewayStartupFailure(runtime, error, signal) {
	let triage;
	try {
		triage = await import("./triage-failure-BkbH6d3X.mjs");
	} catch (importError) {
		runtime.error(`Triage diagnostics could not load: ${formatErrorMessage(importError)}. Run ${formatCliCommand("openclaw triage")} manually.`);
		return;
	}
	return await triage.triageAfterFailure(runtime, {
		kind: "gateway-startup",
		phase: "startup",
		error: formatErrorMessage(error),
		gateway: "verify-running"
	}, signal);
}
//#endregion
//#region src/cli/gateway-cli/run.ts
const gatewayLog = createSubsystemLogger("gateway");
const SUPERVISED_GATEWAY_LOCK_RETRY_MS = 5e3;
const SUPERVISED_GATEWAY_HEALTH_PROBE_TIMEOUT_MS = 1e3;
/**
* EX_CONFIG (78) from sysexits.h — used for configuration errors so systemd
* (via RestartPreventExitStatus=78) stops restarting instead of entering a
* restart storm that can render low-resource hosts unresponsive.
*/
const EXIT_CONFIG_ERROR = 78;
const GATEWAY_AUTH_MODES = [
	"none",
	"token",
	"password",
	"trusted-proxy"
];
const GATEWAY_TAILSCALE_MODES = [
	"off",
	"serve",
	"funnel"
];
function extractGatewayMiskeys(parsed) {
	const gateway = asOptionalObjectRecord(asOptionalObjectRecord(parsed)?.gateway);
	const remote = asOptionalObjectRecord(gateway?.remote);
	return {
		hasGatewayToken: gateway ? "token" in gateway : false,
		hasRemoteToken: remote ? "token" in remote : false
	};
}
function parseEnumOption(raw, allowed) {
	return raw ? allowed.find((value) => value === raw) ?? null : null;
}
async function readGatewayStartupConfig(startupTrace, readOptions = {}) {
	const { readConfigFileSnapshotWithPluginMetadata } = await import("./config/config.js");
	const snapshotRead = await startupTrace.measure("cli.config-snapshot", () => readConfigFileSnapshotWithPluginMetadata({
		isolateEnv: true,
		observe: false,
		...readOptions
	}));
	const { snapshot } = snapshotRead;
	if (!snapshot.valid && isConfigReadFailure(snapshot)) throw createConfigReadError(snapshot);
	return {
		cfg: snapshot.config,
		snapshot,
		startupConfigSnapshotRead: snapshotRead
	};
}
async function resolveGatewayRunShellEnvFallbackPlan(cfg) {
	const { createConfigRuntimeEnv } = await import("./env-vars-eYBJC_XP.mjs");
	const { resolveShellEnvFallbackTimeoutMs, shouldDeferShellEnvFallback, shouldEnableShellEnvFallback } = await import("./shell-env-BaTwpTbf.mjs");
	const planEnv = createConfigRuntimeEnv(cfg, process.env);
	if (!((shouldEnableShellEnvFallback(planEnv) || cfg.env?.shellEnv?.enabled === true) && !shouldDeferShellEnvFallback(planEnv))) return { enabled: false };
	const { resolveShellEnvExpectedKeys } = await import("./shell-env-expected-keys-CXMekA9q.mjs");
	return {
		enabled: true,
		expectedKeys: resolveShellEnvExpectedKeys(planEnv, cfg),
		timeoutMs: cfg.env?.shellEnv?.timeoutMs ?? resolveShellEnvFallbackTimeoutMs(planEnv)
	};
}
async function loadGatewayRunShellEnvFallback(plan) {
	const { loadShellEnvFallback } = await import("./shell-env-BaTwpTbf.mjs");
	const valuesBeforeLoad = new Map(plan.expectedKeys.map((key) => [key, process.env[key]]));
	loadShellEnvFallback({
		enabled: true,
		env: process.env,
		expectedKeys: plan.expectedKeys,
		logger: gatewayLog,
		timeoutMs: plan.timeoutMs
	});
	return Object.fromEntries(plan.expectedKeys.flatMap((key) => {
		const value = process.env[key];
		return value !== void 0 && value !== valuesBeforeLoad.get(key) ? [[key, value]] : [];
	}));
}
async function readGatewayStartupConfigWithShellEnv(params) {
	const startupConfig = await readGatewayStartupConfig(params.startupTrace);
	const plan = await resolveGatewayRunShellEnvFallbackPlan(startupConfig.snapshot.valid ? startupConfig.cfg : {});
	if (!plan.enabled) return {
		...startupConfig,
		lowerPrecedenceEnv: {}
	};
	const lowerPrecedenceEnv = await loadGatewayRunShellEnvFallback(plan);
	return {
		...await readGatewayStartupConfig(params.startupTrace, { lowerPrecedenceEnv }),
		lowerPrecedenceEnv
	};
}
function isGatewayLockError(err) {
	return err instanceof GatewayLockError || Boolean(err) && typeof err === "object" && err.name === "GatewayLockError";
}
function isGatewayRetryableLockError(err) {
	if (!isGatewayLockError(err) || typeof err.message !== "string") return false;
	return isGatewayLifecycleContentionError(err) || err.message.includes("gateway already running") || err.message.includes("another gateway instance is already listening");
}
var SupervisedGatewayLockError = class extends GatewayLockError {
	constructor(message, cause, exitCode) {
		super(message, cause);
		this.exitCode = exitCode;
	}
};
function resolveGatewayLockErrorExitCode(err) {
	return err instanceof SupervisedGatewayLockError ? err.exitCode : 1;
}
function isGatewayHealthzResponse(statusCode, body) {
	if (statusCode !== 200) return false;
	try {
		const payload = JSON.parse(body);
		return payload.ok === true && payload.status === "live";
	} catch {
		return false;
	}
}
function createConfiguredGatewayHealthProbe(cfg) {
	const probe = createConfiguredGatewayLocalProbe(cfg);
	return async (params) => {
		const result = await probe.requestHttp({
			...params,
			pathname: "/healthz",
			timeoutMs: SUPERVISED_GATEWAY_HEALTH_PROBE_TIMEOUT_MS
		});
		return isGatewayHealthzResponse(result?.statusCode, result?.body ?? "");
	};
}
async function runGatewayLoopWithSupervisedLockRecovery(params) {
	const supervisor = params.supervisor;
	if (!supervisor) {
		await params.startLoop();
		return;
	}
	const now = params.now ?? performance.now.bind(performance);
	const sleep$1 = params.sleep ?? sleep;
	const retryMs = params.retryMs ?? SUPERVISED_GATEWAY_LOCK_RETRY_MS;
	const timeoutMs = params.timeoutMs ?? 3e5;
	const startedAt = now();
	for (;;) try {
		await params.startLoop(startedAt + timeoutMs);
		return;
	} catch (err) {
		if (!isGatewayRetryableLockError(err)) throw err;
		const lifecycleContention = isGatewayLifecycleContentionError(err);
		if (!lifecycleContention && await params.probeHealth({
			host: params.healthHost,
			port: params.port
		})) {
			if (supervisor === "systemd") throw new SupervisedGatewayLockError("gateway already running under systemd; existing gateway is healthy, exiting with code 78 to prevent a systemd Restart=always loop", err, EXIT_CONFIG_ERROR);
			params.log.info(`gateway already running under ${supervisor}; existing gateway is healthy, leaving it in control`);
			return;
		}
		const elapsedMs = now() - startedAt;
		if (elapsedMs >= timeoutMs) {
			if (lifecycleContention) throw err;
			throw new SupervisedGatewayLockError(`gateway already running under ${supervisor}; existing gateway did not become healthy after ${timeoutMs}ms`, err, 1);
		}
		const waitMs = Math.min(retryMs, Math.max(0, timeoutMs - elapsedMs));
		params.log.warn(`${lifecycleContention ? "gateway-lifecycle ownership held by another OpenClaw process" : "gateway already running"} under ${supervisor}; waiting ${waitMs}ms before retrying startup`);
		await sleep$1(waitMs);
	}
}
async function maybeWriteGatewayStartupFailureBundle(err, reason = "gateway.startup_failed") {
	const { writeDiagnosticStabilityBundleForFailureSync } = await import("./diagnostic-stability-bundle-HNuPoPRF.mjs");
	const result = writeDiagnosticStabilityBundleForFailureSync(reason, err);
	gatewayLog.warn(result.message);
}
async function runGatewayCommandOnce(opts, hooks = {}) {
	const inheritedGatewayServicePid = parseStrictPositiveInteger(process.env[GATEWAY_SERVICE_RUNTIME_PID_ENV]);
	normalizeStateDirEnv(process.env);
	const { clearGatewayRunConfigEnvironment } = await import("./pre-bootstrap-B-l2TRKm.mjs");
	clearGatewayRunConfigEnvironment();
	const isDevProfile = normalizeOptionalLowercaseString(process.env.OPENCLAW_PROFILE) === "dev";
	const devMode = Boolean(opts.dev) || isDevProfile;
	const ambientEnvTriggers = opts.ambientChannels || opts.devAmbientChannels ? "allow" : "suppress";
	if (opts.reset && !devMode) {
		defaultRuntime.error("Use --reset with --dev.");
		defaultRuntime.exit(1);
		return;
	}
	setVerbose(Boolean(opts.verbose));
	if (opts.cliBackendLogs || opts.claudeCliLogs) {
		setConsoleSubsystemFilter(["agent/cli-backend"]);
		process.env.OPENCLAW_CLI_BACKEND_LOG_OUTPUT = "1";
	}
	const wsLogRaw = opts.compact ? "compact" : opts.wsLog;
	const wsLogStyle = wsLogRaw === "compact" ? "compact" : wsLogRaw === "full" ? "full" : "auto";
	if (wsLogRaw !== void 0 && wsLogRaw !== "auto" && wsLogRaw !== "compact" && wsLogRaw !== "full") {
		defaultRuntime.error("Invalid --ws-log. Use \"auto\", \"full\", or \"compact\".");
		defaultRuntime.exit(1);
	}
	setGatewayWsLogStyle(wsLogStyle);
	if (opts.rawStream) process.env.OPENCLAW_RAW_STREAM = "1";
	const rawStreamPath = toOptionString(opts.rawStreamPath);
	if (rawStreamPath) process.env.OPENCLAW_RAW_STREAM_PATH = rawStreamPath;
	const startupTrace = createGatewayCliStartupTrace(gatewayLog);
	const serverImportMeasurement = startupTrace.startMeasure("cli.server-import", () => import("./server-BWu4IcN3.mjs"));
	const rawServerImport = serverImportMeasurement.result;
	const bannerDone = process.stdout.isTTY ? printClawBanner(defaultRuntime, { settleWhen: rawServerImport }) : Promise.resolve("static");
	const loadServerModule = async () => {
		try {
			return await bannerDone === "settled" ? await rawServerImport : await withProgress({
				label: "Loading gateway modules…",
				indeterminate: true
			}, async () => rawServerImport);
		} finally {
			await serverImportMeasurement.settled;
			serverImportMeasurement.emit();
		}
	};
	const { startGatewayServer } = await loadServerModule();
	setConsoleTimestampPrefix(true);
	if (devMode) {
		if (opts.reset) {
			const { recheckGatewayRunReset } = await import("./pre-bootstrap-B-l2TRKm.mjs");
			if (!await recheckGatewayRunReset({
				opts,
				runtime: defaultRuntime
			})) return;
		}
		const { ensureDevGatewayConfig } = await import("./dev-BsbW9E0D.mjs");
		await startupTrace.measure("cli.dev-config", () => ensureDevGatewayConfig({ reset: Boolean(opts.reset) }));
		if (opts.reset) {
			const { reloadTrustedGatewayRunEnvironment } = await import("./pre-bootstrap-B-l2TRKm.mjs");
			if (!await reloadTrustedGatewayRunEnvironment({ runtime: defaultRuntime })) return;
		}
	}
	gatewayLog.info("loading configuration…");
	const { cfg, lowerPrecedenceEnv, snapshot, startupConfigSnapshotRead } = await readGatewayStartupConfigWithShellEnv({ startupTrace });
	if (!enforceGatewayRunFutureConfigGuard({
		opts,
		runtime: defaultRuntime,
		snapshot
	})) return;
	const { applyFinalGatewayRunConfigEnv } = await import("./pre-bootstrap-B-l2TRKm.mjs");
	if (!await applyFinalGatewayRunConfigEnv({
		lowerPrecedenceEnv,
		runtime: defaultRuntime,
		snapshot
	})) return;
	const finalConfigEnteredServiceMode = Boolean(process.env.OPENCLAW_SERVICE_MARKER?.trim());
	const clearRejectedFinalConfigEnv = () => {
		clearGatewayRunConfigEnvironment();
		if (finalConfigEnteredServiceMode) delete process.env[ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV];
	};
	let finalConfigAllowed;
	try {
		finalConfigAllowed = enforceGatewayRunFutureConfigGuard({
			opts,
			runtime: defaultRuntime,
			snapshot
		});
	} catch (err) {
		clearRejectedFinalConfigEnv();
		throw err;
	}
	if (!finalConfigAllowed) {
		clearRejectedFinalConfigEnv();
		return;
	}
	if (process.env.OPENCLAW_SERVICE_MARKER?.trim()) {
		process.env[GATEWAY_SERVICE_RUNTIME_PID_ENV] = String(process.pid);
		if (process.platform === "darwin") {
			const { warnAboutGatewayRestartStorm } = await import("./restart-storm-BMWX4qvl.mjs");
			await warnAboutGatewayRestartStorm(process.env, (message) => gatewayLog.warn(message));
		}
	}
	await hooks.refreshManagedProxy?.(cfg.proxy);
	const portOverride = parseTcpPort(opts.port);
	if (opts.port !== void 0 && portOverride === null) {
		defaultRuntime.error(formatInvalidPortOption("--port"));
		defaultRuntime.exit(1);
		return;
	}
	const port = portOverride ?? resolveGatewayPort(cfg);
	if (!Number.isFinite(port) || port <= 0 || port > 65535) {
		defaultRuntime.error(formatInvalidConfigPort("gateway.port"));
		defaultRuntime.exit(EXIT_CONFIG_ERROR);
		return;
	}
	const VALID_BIND_MODES = /* @__PURE__ */ new Set([
		"loopback",
		"lan",
		"auto",
		"custom",
		"tailnet"
	]);
	const bindExplicitRawStr = normalizeOptionalString(toOptionString(opts.bind) ?? cfg.gateway?.bind);
	if (bindExplicitRawStr !== void 0 && !VALID_BIND_MODES.has(bindExplicitRawStr)) {
		defaultRuntime.error("Invalid --bind. Use \"loopback\", \"lan\", \"tailnet\", \"auto\", or \"custom\".");
		defaultRuntime.exit(1);
		return;
	}
	const bindExplicitRaw = bindExplicitRawStr;
	if (process.env.OPENCLAW_SERVICE_MARKER?.trim()) {
		const { cleanStaleGatewayProcessesSync } = await import("./restart-stale-pids-DMtGCjEe.mjs");
		const stale = cleanStaleGatewayProcessesSync(port, { protectedPid: inheritedGatewayServicePid });
		if (stale.length > 0) {
			gatewayLog.info(`service-mode: cleared ${stale.length} stale gateway pid(s) before bind on port ${port}`);
			if (process.platform === "linux") {
				const { findSystemdGatewayInstallation, formatDuelingScopesWarning } = await import("./systemd-CgbtuC9F.mjs");
				const installation = await findSystemdGatewayInstallation(process.env).catch(() => null);
				const warning = installation ? formatDuelingScopesWarning(installation, port) : null;
				if (warning) gatewayLog.warn(`service-mode: ${warning}`);
			}
		}
	}
	if (opts.force) {
		const interactive = isTerminalInteractive();
		const describeNonInteractiveGatewayOwner = () => {
			const gatewayPids = findVerifiedGatewayListenerPidsOnPortSync(port);
			if (gatewayPids.length === 0) return;
			return `${NON_INTERACTIVE_GATEWAY_RUN_FORCE_MESSAGE} Existing gateway listener pid${gatewayPids.length === 1 ? "" : "s"}: ${formatGatewayPidList(gatewayPids)}.`;
		};
		if (!interactive) {
			const refusal = describeNonInteractiveGatewayOwner();
			if (refusal) {
				defaultRuntime.error(refusal);
				defaultRuntime.exit(1);
				return;
			}
		}
		try {
			const { forceFreePortAndWait, waitForPortBindable } = await import("./ports-CCY8wNEB.mjs");
			const { killed, waitedMs, escalatedToSigkill } = await forceFreePortAndWait(port, {
				timeoutMs: 2e3,
				intervalMs: 100,
				sigtermTimeoutMs: 700,
				...interactive ? {} : { beforeSignal: () => {
					const refusal = describeNonInteractiveGatewayOwner();
					if (refusal) throw new Error(refusal);
				} }
			});
			if (killed.length === 0) gatewayLog.debug(`force: no listeners on port ${port}`);
			else {
				for (const proc of killed) gatewayLog.info(`force: killed pid ${proc.pid}${proc.command ? ` (${proc.command})` : ""} on port ${port}`);
				if (escalatedToSigkill) gatewayLog.info(`force: escalated to SIGKILL while freeing port ${port}`);
				if (waitedMs > 0) gatewayLog.info(`force: waited ${waitedMs}ms for port ${port} to free`);
			}
			const bindWaitMs = await waitForPortBindable(port, {
				timeoutMs: 3e3,
				intervalMs: 150,
				host: bindExplicitRaw === "loopback" ? "127.0.0.1" : bindExplicitRaw === "lan" ? "0.0.0.0" : bindExplicitRaw === "custom" ? toOptionString(cfg.gateway?.customBindHost) : void 0
			});
			if (bindWaitMs > 0) gatewayLog.info(`force: waited ${bindWaitMs}ms for port ${port} to become bindable`);
		} catch (err) {
			defaultRuntime.error(`Could not free port ${port}: ${formatErrorMessage(err)}. Run ${formatCliCommand("openclaw gateway status --deep")} to inspect the listener.`);
			defaultRuntime.exit(1);
			return;
		}
	}
	if (opts.token) {
		const token = toOptionString(opts.token);
		if (token) process.env.OPENCLAW_GATEWAY_TOKEN = token;
	}
	const authModeRaw = toOptionString(opts.auth);
	const authMode = parseEnumOption(authModeRaw, GATEWAY_AUTH_MODES);
	if (authModeRaw && !authMode) {
		defaultRuntime.error("Invalid --auth. Use \"none\", \"token\", \"password\", or \"trusted-proxy\".");
		defaultRuntime.exit(1);
		return;
	}
	const tailscaleRaw = toOptionString(opts.tailscale);
	const tailscaleMode = parseEnumOption(tailscaleRaw, GATEWAY_TAILSCALE_MODES);
	if (tailscaleRaw && !tailscaleMode) {
		defaultRuntime.error("Invalid --tailscale. Use \"off\", \"serve\", or \"funnel\".");
		defaultRuntime.exit(1);
		return;
	}
	const effectiveTailscaleMode = tailscaleMode ?? cfg.gateway?.tailscale?.mode ?? "off";
	const bind = bindExplicitRaw ?? defaultGatewayBindMode(effectiveTailscaleMode);
	let passwordRaw;
	try {
		passwordRaw = await resolveGatewayPasswordOption(opts);
	} catch (err) {
		defaultRuntime.error(formatErrorMessage(err));
		defaultRuntime.exit(1);
		return;
	}
	if (toOptionString(opts.password)) defaultRuntime.error("Warning: --password can be exposed via process listings. Prefer --password-file or OPENCLAW_GATEWAY_PASSWORD.");
	const tokenRaw = toOptionString(opts.token);
	gatewayLog.info("resolving authentication…");
	const guardErrors = getGatewayStartGuardErrors({
		allowUnconfigured: opts.allowUnconfigured,
		configExists: snapshot.exists,
		mode: cfg.gateway?.mode
	});
	if (guardErrors.length > 0) {
		for (const error of guardErrors) defaultRuntime.error(error);
		defaultRuntime.exit(EXIT_CONFIG_ERROR);
		return;
	}
	const miskeys = extractGatewayMiskeys(snapshot.parsed);
	const authOverride = authMode || passwordRaw || tokenRaw || authModeRaw ? {
		...authMode ? { mode: authMode } : {},
		...tokenRaw ? { token: tokenRaw } : {},
		...passwordRaw ? { password: passwordRaw } : {}
	} : void 0;
	const { resolveGatewayAuth } = await import("./auth-D9fA9O2-.mjs");
	const resolvedAuth = await startupTrace.measure("cli.auth-resolve", () => resolveGatewayAuth({
		authConfig: cfg.gateway?.auth,
		authOverride,
		env: process.env,
		tailscaleMode: effectiveTailscaleMode
	}));
	const resolvedAuthMode = resolvedAuth.mode;
	const tokenValue = resolvedAuth.token;
	const passwordValue = resolvedAuth.password;
	const hasToken = typeof tokenValue === "string" && tokenValue.trim().length > 0;
	const hasPassword = typeof passwordValue === "string" && passwordValue.trim().length > 0;
	const tokenConfigured = hasToken || hasConfiguredSecretInput(authOverride?.token ?? cfg.gateway?.auth?.token, cfg.secrets?.defaults);
	const passwordConfigured = hasPassword || hasConfiguredSecretInput(authOverride?.password ?? cfg.gateway?.auth?.password, cfg.secrets?.defaults);
	const hasSharedSecret = resolvedAuthMode === "token" && tokenConfigured || resolvedAuthMode === "password" && passwordConfigured;
	const authHints = [];
	if (miskeys.hasGatewayToken) authHints.push("Found \"gateway.token\" in config. Use \"gateway.auth.token\" instead.");
	if (miskeys.hasRemoteToken) authHints.push("\"gateway.remote.token\" is for remote CLI calls; it does not enable local gateway auth.");
	if (resolvedAuthMode === "password" && !passwordConfigured) {
		defaultRuntime.error([
			"Gateway auth is set to password, but no password is configured.",
			"Set gateway.auth.password (or OPENCLAW_GATEWAY_PASSWORD), or pass --password.",
			...authHints
		].join("\n"));
		defaultRuntime.exit(EXIT_CONFIG_ERROR);
		return;
	}
	if (resolvedAuthMode === "none") gatewayLog.warn("Gateway auth mode=none explicitly configured; all gateway connections are unauthenticated.");
	const healthHost = await resolveGatewayBindHost(bind, cfg.gateway?.customBindHost);
	if (!isLoopbackHost(healthHost) && !hasSharedSecret && resolvedAuthMode !== "trusted-proxy") {
		defaultRuntime.error([
			`Refusing to bind gateway to ${bind} without auth.`,
			...isContainerEnvironment() ? ["Container environment detected — the gateway defaults to bind=auto (0.0.0.0) for port-forwarding compatibility.", "Set OPENCLAW_GATEWAY_TOKEN or OPENCLAW_GATEWAY_PASSWORD, or pass --token/--password to start with auth."] : ["Set gateway.auth.token/password (or OPENCLAW_GATEWAY_TOKEN/OPENCLAW_GATEWAY_PASSWORD) or pass --token/--password."],
			...authHints
		].join("\n"));
		defaultRuntime.exit(EXIT_CONFIG_ERROR);
		return;
	}
	const tailscaleOverride = tailscaleMode ? { mode: tailscaleMode } : void 0;
	gatewayLog.info("starting...");
	startupTrace.mark("cli.gateway-loop");
	let startupConfigSnapshotReadForNextStart = startupConfigSnapshotRead;
	const envSidecarStartupMode = isChannelStartupSuppressedByEnvironment() ? "defer" : "start";
	let crashLoopDecision;
	let channelAutostartSuppression;
	let tryRecoverChannelAutostartSuppression;
	let activeBootId;
	let bootRecorded = false;
	let triageAttempted = false;
	const triageStartupFailure = async (error, signal) => {
		if (triageAttempted || !bootRecorded || signal?.aborted || isAbortError(error) || isGatewayLockError(error) || isInvalidConfigError(error) || isTailscaleRouteOwnershipConflictError(error) || isGatewayEffectiveConfigConflictError(error) || collectNestedErrorCandidates(error).some((candidate) => candidate instanceof GatewayStartupCleanupError) || resolveGatewayStartupMaintenanceReason(error)) return;
		if ((supervisor || process.env.OPENCLAW_SERVICE_MARKER) && !crashLoopDecision?.shouldWriteStabilityBundle) return;
		triageAttempted = true;
		return await triageGatewayStartupFailure(defaultRuntime, error, signal);
	};
	const beginBoot = async (startedAtMs) => {
		crashLoopDecision = inspectGatewayCrashLoopBreaker(process.env, startedAtMs);
		const bootStartReason = crashLoopDecision.tripped ? crashLoopDecision.shouldWriteStabilityBundle ? GATEWAY_CRASH_LOOP_BREAKER_REASON : void 0 : crashLoopDecision.recovered ? GATEWAY_CRASH_LOOP_RECOVERED_REASON : void 0;
		activeBootId = recordGatewayBootStart(process.env, startedAtMs, bootStartReason);
		bootRecorded = activeBootId !== void 0;
		channelAutostartSuppression = void 0;
		tryRecoverChannelAutostartSuppression = void 0;
		if (crashLoopDecision.recovered) gatewayLog.info("gateway restart-loop breaker recovered; channel auto-start restored");
		if (!crashLoopDecision.tripped) return;
		const message = `gateway restart-loop breaker tripped: ${crashLoopDecision.uncleanBoots} unclean boot(s) within ${crashLoopDecision.windowMs}ms; suppressing channel/provider account auto-start. Inspect the stability bundle and fix the startup crash before restarting the service. ${formatGatewayCrashLoopManualChannelStartHint()}`;
		channelAutostartSuppression = {
			reason: "crash-loop-breaker",
			message
		};
		tryRecoverChannelAutostartSuppression = createGatewayCrashLoopRecovery({
			bootId: activeBootId,
			getActiveBootId: () => activeBootId,
			onRecovered: (bootId) => {
				activeBootId = bootId;
				gatewayLog.info("gateway restart-loop breaker recovered; channel auto-start restored");
			}
		});
		gatewayLog.error(message);
		if (crashLoopDecision.shouldWriteStabilityBundle) await maybeWriteGatewayStartupFailureBundle(new Error(message), GATEWAY_CRASH_LOOP_BREAKER_REASON);
	};
	const completeBoot = (completion) => {
		const bootId = activeBootId;
		activeBootId = void 0;
		return completeGatewayBootLifecycle(bootId, completion, process.env);
	};
	const startLoop = async (lifecycleLockDeadlineMs) => {
		const code = await runGatewayLoop({
			ownsProcessLifecycle: true,
			lockPort: port,
			lifecycleLockDeadlineMs,
			healthHost,
			beginBoot,
			completeBoot,
			onProcessResourcesSettled: hooks.onProcessResourcesSettled,
			onRestartStartupFailure: triageStartupFailure,
			start: async ({ requestHotReloadRecovery, ...startupOptions } = {}) => {
				const snapshotPreparation = await import("./io.snapshot-preparation-DlJ1-rKA.mjs");
				const startupConfigSnapshotReadForThisStart = startupConfigSnapshotReadForNextStart;
				startupConfigSnapshotReadForNextStart = void 0;
				return await startGatewayServer(port, {
					bind,
					...opts.updateCanary ? { updateCanary: true } : {},
					...activeBootId ? { bootId: activeBootId } : {},
					auth: authOverride,
					tailscale: tailscaleOverride,
					...startupOptions,
					prepareConfigSnapshot: snapshotPreparation.prepareHostConfigSnapshot,
					...requestHotReloadRecovery ? { hotReloadRecovery: requestHotReloadRecovery } : {},
					startupConfigSnapshotRead: startupConfigSnapshotReadForThisStart,
					...envSidecarStartupMode !== "start" ? { sidecarStartup: envSidecarStartupMode } : {},
					...channelAutostartSuppression ? { channelAutostartSuppression } : {},
					...channelAutostartSuppression ? { tryRecoverChannelAutostartSuppression } : {},
					ambientEnvTriggers
				});
			}
		});
		requestExitAfterOneShotOutput(defaultRuntime, code);
	};
	const { detectRespawnSupervisor } = await import("./supervisor-markers-o3rerKD9.mjs");
	const supervisor = detectRespawnSupervisor(process.env);
	try {
		await runGatewayLoopWithSupervisedLockRecovery({
			startLoop,
			supervisor,
			port,
			healthHost,
			log: gatewayLog,
			probeHealth: createConfiguredGatewayHealthProbe(cfg)
		});
	} catch (err) {
		if (err instanceof ExitError) throw err;
		if (isGatewayLockError(err)) {
			const errMessage = formatErrorMessage(err);
			defaultRuntime.error(`Gateway failed to start: ${errMessage}\nIf the gateway is supervised, stop it with: ${formatCliCommand("openclaw gateway stop")}`);
			try {
				const [{ formatPortDiagnostics }, { inspectPortUsage }] = await Promise.all([import("./ports-format-BITHSM3u.mjs"), import("./ports-inspect-Jh_A88rx.mjs")]);
				const diagnostics = await inspectPortUsage(port);
				if (diagnostics.status === "busy") for (const line of formatPortDiagnostics(diagnostics)) defaultRuntime.error(line);
			} catch {}
			const { maybeExplainGatewayServiceStop } = await import("./shared-BhcY0LSm.mjs");
			await maybeExplainGatewayServiceStop();
			defaultRuntime.exit(resolveGatewayLockErrorExitCode(err));
			return;
		}
		if (isInvalidConfigError(err)) throw err;
		await maybeWriteGatewayStartupFailureBundle(err);
		if (resolveGatewayStartupMaintenanceReason(err)) throw err;
		defaultRuntime.error(`Gateway failed to start: ${formatErrorMessage(err)}. Run ${formatCliCommand("openclaw gateway status --deep")} for diagnostics.`);
		await triageStartupFailure(err);
		defaultRuntime.exit(resolveGatewayStartupFailureExitCode(err));
	}
}
/** Run foreground Gateway startup with one consent-gated invalid-config repair attempt. */
async function runGatewayCommand(opts, hooks = {}) {
	if (opts.taskSupervisor) {
		const { runWindowsGatewayTaskSupervisor } = await import("./task-supervisor-rlHr1R29.mjs");
		await runWindowsGatewayTaskSupervisor();
		return;
	}
	try {
		await runGatewayCommandOnce(opts, hooks);
	} catch (error) {
		if (error instanceof ExitError) throw error;
		if (!isInvalidConfigError(error)) rethrowStartupConfigFailure(error);
		defaultRuntime.error(`Gateway failed to start: ${formatErrorMessage(error)}`);
		if (opts.allowUnconfigured || !isDoctorRecoverableInvalidConfigError(error)) {
			defaultRuntime.exit(EXIT_CONFIG_ERROR);
			return;
		}
		const { offerInvalidConfigRecovery } = await import("./invalid-config-recovery-Ck-_QfuW.mjs");
		if ((await offerInvalidConfigRecovery({
			runtime: defaultRuntime,
			retry: async () => await runGatewayCommandOnce(opts, hooks)
		})).status === "recovered") return;
		defaultRuntime.exit(EXIT_CONFIG_ERROR);
	}
}
const testing = {
	createConfiguredGatewayHealthProbe,
	isGatewayHealthzResponse,
	resolveGatewayLockErrorExitCode,
	runGatewayLoopWithSupervisedLockRecovery
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.gatewayRunTestApi")] = testing;
//#endregion
export { runGatewayCommand };
