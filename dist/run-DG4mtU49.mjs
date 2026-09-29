import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as drainGlobalSingletonLifecycleState } from "./global-singleton-Dc_stLtU.mjs";
import { t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { i as GATEWAY_SERVICE_RUNTIME_PID_ENV } from "./constants-CJCmIHb-.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { a as recordGatewayBootstrapStep } from "./startup-trace-DgSoCXij.mjs";
import { t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { n as isAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as CONFIG_PATH, u as normalizeStateDirEnv, v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { o as hasConfiguredSecretInput } from "./types.secrets-B5xWSzLp.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as setVerbose } from "./global-state-BAD7XgmL.mjs";
import { n as flushLogger } from "./logger--ALOusOG.mjs";
import { o as setConsoleSubsystemFilter, s as setConsoleTimestampPrefix } from "./console-DwqfhE-H.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { g as ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV } from "./config-env-vars-BHI12YH5.mjs";
import { r as flushDiagnosticsTimeline } from "./diagnostics-timeline-uuHa_36_.mjs";
import { r as cleanupSnapshotOperations } from "./sqlite-readonly-location-cleanup-uwwsHidB.mjs";
import { r as findStartupMaintenanceRequiredError } from "./startup-maintenance-required-OfhrhQoQ.mjs";
import { i as formatExternalSupervisorActionRequired } from "./gateway-supervision-dG8swyHC.mjs";
import { n as clearRuntimeConfigSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import "./globals-QODkv80i.mjs";
import { i as isInvalidConfigError, r as isDoctorRecoverableInvalidConfigError } from "./io.invalid-config-Deld-wtR.mjs";
import { i as isGatewayLifecycleContentionError, n as GatewayLockError, r as acquireGatewayLock } from "./gateway-lock-CYjRlApN.mjs";
import { g as execSystemctlUser, h as execSystemctl } from "./systemd-service-files-tGuARbbA.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-i3x9UrUR.mjs";
import { a as GATEWAY_SUPERVISOR_EXIT_MARGIN_MS, i as GATEWAY_SHUTDOWN_TIMEOUT_MS, r as GATEWAY_SHUTDOWN_RESERVE_MS } from "./gateway-shutdown-budget-E5oPIr_h.mjs";
import "./launchd-plist-BNtNmL1p.mjs";
import { i as detectRespawnSupervisor } from "./supervisor-markers-DL2AtFkv.mjs";
import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.mjs";
import { g as resolveGatewayBindHost, s as isLoopbackHost, t as defaultGatewayBindMode } from "./net-DU4aWKLv.mjs";
import { c as isTailscaleRouteOwnershipConflictError } from "./tailscale-BRIsmHIP.mjs";
import { t as parseKeyValueOutput } from "./runtime-parse-jD-7AuMj.mjs";
import { n as parseSystemdTimeSpanMs, t as SYSTEMD_DEFAULT_STOP_TIMEOUT_MS } from "./systemd-time-span-CGH0scKq.mjs";
import { m as resolveLaunchAgentGuiDomain, u as probeLaunchAgentState } from "./launchd-runtime-CWqPktfP.mjs";
import { v as findVerifiedGatewayListenerPidsOnPortSync, y as formatGatewayPidList } from "./schtasks-D2U0K9JA.mjs";
import { n as formatInvalidConfigPort, r as formatInvalidPortOption } from "./error-format-B21fL1a_.mjs";
import { t as parsePort } from "./parse-port-BGoDUr--.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { r as isTerminalInteractive, t as NON_INTERACTIVE_GATEWAY_RUN_FORCE_MESSAGE } from "./terminal-interactivity-DXUXAq5U.mjs";
import { n as normalizeGatewayHttpProbeHost, r as requestGatewayLocalHttpProbe, t as createConfiguredGatewayLocalProbe } from "./local-http-probe-Cv2D06JO.mjs";
import { a as formatGatewayCrashLoopManualChannelStartHint, d as recordGatewayCrashLoopRecovery, i as completeGatewayBootLifecycle, n as GATEWAY_CRASH_LOOP_RECOVERED_REASON, o as formatGatewayRepeatedSignalHint, r as GATEWAY_SIGNAL_REPEAT_WINDOW_MS, s as inspectGatewayCrashLoopBreaker, t as GATEWAY_CRASH_LOOP_BREAKER_REASON, u as recordGatewayBootStart } from "./gateway-boot-lifecycle-DZNz5cof.mjs";
import { y as runOutsideGatewayRootWorkAdmission } from "./gateway-work-admission-CHv_0noy.mjs";
import { a as runWithProcessCleanupBudget } from "./child-WoujtRwa.mjs";
import { _ as SqliteIntegrityWorkerInterruptedError } from "./openclaw-agent-db-maintenance-D--tx1ak.mjs";
import { i as withDiagnosticPhase } from "./diagnostic-phase-Cu8TxcMp.mjs";
import { m as normalizeSystemdUnit } from "./restart-Bb4QxGMO.mjs";
import { n as consumeGatewaySuspendHandoff, r as disarmGatewaySuspendHandoff } from "./gateway-suspend-coordinator-DU88ad_C.mjs";
import { a as markGatewayRestartTrace, f as startGatewayRestartTrace, o as measureGatewayRestartTrace, r as createGatewayRestartTraceHandoffEnv, t as captureGatewayRestartTraceHandoff } from "./restart-trace-CoBpLImx.mjs";
import { t as GatewayStartupCleanupError } from "./server-shutdown-D6UXm04-.mjs";
import { t as printClawBanner } from "./claw-banner-BDiTg1JQ.mjs";
import { r as withProgress } from "./progress-BQygak_O.mjs";
import { a as registerGatewayInstallationReplacementHandler } from "./stale-install-BTpQ40eq.mjs";
import { n as setGatewayWsLogStyle } from "./ws-logging-86BGsxSJ.mjs";
import { d as enforceGatewayRunFutureConfigGuard, r as getGatewayStartGuardErrors } from "./pre-bootstrap-BfQivKLl.mjs";
import { n as isGatewayEffectiveConfigConflictError } from "./server-runtime-config-C3kC9wFW.mjs";
import { n as scheduleSafeGatewayRestart } from "./restart-coordinator-BOXbJ7wv.mjs";
import { n as resolveGatewayStartupMaintenanceReason } from "./startup-maintenance-B7fVw2SZ.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { performance as performance$1 } from "node:perf_hooks";
import { MessageChannel, Worker } from "node:worker_threads";
//#region src/cli/gateway-cli/qa-parent-watchdog.ts
const QA_PARENT_PID_ENV = "OPENCLAW_QA_PARENT_PID";
const QA_TEMP_ROOT_ENV = "OPENCLAW_QA_TEMP_ROOT";
const QA_STAGED_RUNTIME_ROOT_ENV = "OPENCLAW_QA_STAGED_RUNTIME_ROOT";
const DEFAULT_QA_PARENT_WATCHDOG_INTERVAL_MS = 1e3;
const QA_TEMP_ROOT_PREFIX = "openclaw-qa-suite-";
function resolveQaParentPid(env, ownPid) {
	const raw = env[QA_PARENT_PID_ENV]?.trim();
	if (!raw) return null;
	const parentPid = /^\d+$/.test(raw) ? Number(raw) : NaN;
	if (!Number.isSafeInteger(parentPid) || parentPid <= 0 || parentPid === ownPid) return null;
	return parentPid;
}
function resolveQaCleanupRoot(rawValue) {
	const raw = rawValue?.trim();
	if (!raw) return null;
	const cleanupRoot = path.resolve(raw);
	if (!path.basename(cleanupRoot).startsWith(QA_TEMP_ROOT_PREFIX)) return null;
	return cleanupRoot;
}
function resolveQaCleanupRoots(env) {
	return uniqueStrings([resolveQaCleanupRoot(env[QA_TEMP_ROOT_ENV]), resolveQaCleanupRoot(env[QA_STAGED_RUNTIME_ROOT_ENV])].filter((target) => target !== null));
}
function installQaParentWatchdog(deps = {}) {
	const env = deps.env ?? process.env;
	const parentPid = resolveQaParentPid(env, deps.ownPid ?? process.pid);
	if (parentPid === null) return null;
	const clearIntervalFn = deps.clearInterval ?? ((activeTimer) => {
		clearInterval(activeTimer);
	});
	const exit = deps.exit ?? ((code) => process.exit(code));
	const kill = deps.kill ?? ((pid, signal) => process.kill(pid, signal));
	const logger = deps.logger ?? createSubsystemLogger("gateway");
	const qaCleanupRoots = resolveQaCleanupRoots(env);
	const chdir = deps.chdir ?? ((directory) => process.chdir(directory));
	const cwd = deps.cwd ?? (() => process.cwd());
	const rm = deps.rm ?? (async (target) => {
		await fs$1.rm(target, {
			recursive: true,
			force: true
		});
	});
	const setIntervalFn = deps.setInterval ?? ((callback, ms) => setInterval(callback, ms));
	let stopped = false;
	let exiting = false;
	const stop = () => {
		if (stopped) return;
		stopped = true;
		clearIntervalFn(timer);
	};
	const timer = setIntervalFn(() => {
		if (stopped || exiting) return;
		try {
			kill(parentPid, 0);
		} catch (error) {
			if (error.code === "ESRCH") {
				logger.warn(`QA gateway parent pid ${parentPid} exited; shutting down orphaned QA gateway`);
				exiting = true;
				stop();
				(async () => {
					const currentCwd = path.resolve(cwd());
					const activeCwdRoot = qaCleanupRoots.find((cleanupRoot) => isPathInside(cleanupRoot, currentCwd));
					if (activeCwdRoot) {
						const safeCwd = path.dirname(activeCwdRoot);
						try {
							chdir(safeCwd);
						} catch (chdirError) {
							logger.warn(`QA gateway parent pid ${parentPid} exited; failed to leave runtime root ${activeCwdRoot}: ${chdirError instanceof Error ? chdirError.message : String(chdirError)}`);
						}
					}
					for (const cleanupRoot of qaCleanupRoots) await rm(cleanupRoot).catch((cleanupError) => {
						logger.warn(`QA gateway parent pid ${parentPid} exited; failed to clean runtime root ${cleanupRoot}: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`);
					});
					exit(0);
				})();
			}
		}
	}, deps.intervalMs ?? DEFAULT_QA_PARENT_WATCHDOG_INTERVAL_MS);
	if (typeof timer === "object") timer.unref?.();
	return {
		parentPid,
		stop
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
	let resolveReady;
	let rejectReady;
	const readiness = new Promise((resolve, reject) => {
		resolveReady = resolve;
		rejectReady = reject;
	});
	let resolveResult;
	const result = new Promise((resolve) => {
		resolveResult = resolve;
	});
	const closed = result.then(() => {});
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
		if (output.length > 128) {
			rejectReady(/* @__PURE__ */ new Error("Native stop executor returned invalid readiness"));
			cancel();
			return;
		}
		if (output.endsWith("\n")) {
			if (!/^[1-9]\d*\n$/.test(output) || Number(output.trim()) !== child.pid) {
				rejectReady(/* @__PURE__ */ new Error("Native stop executor returned invalid readiness"));
				cancel();
				return;
			}
			ready = true;
			clearTimeout(timeout);
			resolveReady(Number(output.trim()));
		}
	});
	child.once("error", (error) => {
		diagnostic = formatErrorMessage(error);
		rejectReady(/* @__PURE__ */ new Error(`Native stop executor unavailable: ${diagnostic}`));
	});
	child.once("close", (code, signal) => {
		clearTimeout(timeout);
		params.signal.removeEventListener("abort", cancel);
		rejectReady(/* @__PURE__ */ new Error(`Native stop executor unavailable: ${diagnostic || "closed"}`));
		resolveResult({
			disposition: !disposed && committed && code === 0 && !signal ? "accepted" : !disposed && committed && typeof code === "number" && !signal ? "refused" : "uncertain",
			detail: diagnostic
		});
	});
	timeout = setTimeout(() => {
		rejectReady(/* @__PURE__ */ new Error("Native stop executor preparation timed out"));
		cancel();
	}, 5e3);
	try {
		child.stdin.write(script);
		const pid = await readiness;
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
				return result;
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
	const cgroup = (await fs$1.readFile(`/proc/${pid}/cgroup`, "utf8")).split("\n").find((line) => /^(?:0:|\d+:name=systemd):/.test(line));
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
					params.acceptStop();
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
function formatDrainCounts(snapshot) {
	return Object.entries(snapshot.counts).filter(([name, count]) => name !== "totalActive" && count > 0).map(([name, count]) => `${name}=${count}`).join(" ");
}
//#endregion
//#region src/cli/gateway-cli/run-loop-drain.ts
const RESTART_DRAIN_STILL_PENDING_WARN_MS = 3e4;
async function drainGatewayActiveWork({ request, runtime, drainTimeoutMs, restartDrainDeadlineAt, markDraining, recordCounts, recordWarning, logger }) {
	const { restartIntent } = request;
	const reportDrainSnapshot = createGatewayDrainReporter(request.action, drainTimeoutMs, runtime, logger, recordCounts);
	if (request.action !== "stop") {
		let activeWorkAtDrainStart = 0;
		let activeRunsAtDrainStart = 0;
		let drainTimedOut = false;
		await measureGatewayRestartTrace("restart.drain", async () => {
			const { abortEmbeddedAgentRun, createGatewayActiveWorkSnapshot, waitForGatewayActiveWork } = runtime;
			markDraining(formatShutdownReason(request));
			const initialSnapshot = createGatewayActiveWorkSnapshot();
			activeWorkAtDrainStart = initialSnapshot.counts.totalActive;
			activeRunsAtDrainStart = initialSnapshot.counts.embeddedRuns;
			if (activeRunsAtDrainStart > 0) abortEmbeddedAgentRun(void 0, {
				mode: "compacting",
				reason: "restart"
			});
			reportDrainSnapshot(initialSnapshot);
			const drain = await waitForGatewayActiveWork(restartDrainDeadlineAt === void 0 ? void 0 : Math.max(0, restartDrainDeadlineAt - Date.now()), { onSnapshot: reportDrainSnapshot });
			if (drain.drained) {
				if (!initialSnapshot.idle) logger.info("all active work drained");
				return;
			}
			drainTimedOut = true;
			const warning = `restart drain budget ${drainTimeoutMs}ms exhausted; cutting short ${formatDrainCounts(drain.snapshot)}`;
			recordWarning(warning);
			logger.warn(warning);
			runtime.abortActiveCronTaskRuns("Gateway restarting.");
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
				logger.warn(`gateway active-work drain timeout reached; proceeding with shutdown: ${formatDrainCounts(activeWorkDrain.snapshot)}`);
				runtime.abortEmbeddedAgentRun(void 0, { mode: "all" });
				runtime.abortActiveCronTaskRuns("Gateway stopping.");
			}
		} catch (err) {
			logger.warn(`gateway active-work drain failed; proceeding with shutdown: ${formatErrorMessage(err)}`);
		}
		logger.info("active-work drain settled; beginning server close");
	}
}
function createGatewayDrainReporter(action, drainTimeoutMs, runtime, logger, recordCounts) {
	const drainBudget = drainTimeoutMs === void 0 ? "without a timeout" : `with timeout ${drainTimeoutMs}ms`;
	let lastPendingWarningAt;
	return (snapshot) => {
		recordCounts(formatDrainCounts(snapshot) || "no active work");
		const now = Date.now();
		if (lastPendingWarningAt === void 0) {
			lastPendingWarningAt = now;
			if (!snapshot.idle) {
				logger.info(`draining active work before ${action} ${drainBudget}: ${formatDrainCounts(snapshot)}`);
				const requestTimeoutMs = Math.max(0, ...runtime.listActiveEmbeddedRunSessionIds().map((sessionId) => runtime.getDiagnosticSessionActivitySnapshot({ sessionId })?.activeModelCallRequestTimeoutMs ?? 0));
				if (requestTimeoutMs > 0) logger.info(`largest observed model request timeout is ${requestTimeoutMs}ms; shutdown drain budget remains ${drainBudget}`);
			}
		} else if (!snapshot.idle && now - lastPendingWarningAt >= RESTART_DRAIN_STILL_PENDING_WARN_MS) {
			lastPendingWarningAt = now;
			logger.warn(`still draining active work before ${action}: ${formatDrainCounts(snapshot)}`);
		}
	};
}
//#endregion
//#region src/cli/gateway-cli/run-loop-log-flush.ts
async function flushGatewayLogsBeforeExit(logger, timeoutMs = 4e3) {
	flushDiagnosticsTimeline();
	let flushTimer;
	const flushed = await Promise.race([flushLogger().then(() => true), new Promise((resolve) => {
		flushTimer = setTimeout(() => resolve(false), timeoutMs);
	})]);
	clearTimeout(flushTimer);
	if (!flushed) logger.warn(`log flush did not settle within ${timeoutMs}ms; continuing shutdown`);
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
		if ("message" in result) logger.warn(result.message);
	};
}
//#endregion
//#region src/cli/gateway-cli/run-loop-request.ts
function isUpdateProcessRestartReason(reason) {
	return reason === "update.run" || reason === "update.auto";
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
//#region src/infra/systemd-stop-timeout.ts
/** Read only the running unit, never a same-named unit in the other manager. */
async function readSystemdStopTimeout(env = process.env) {
	const memberships = (await fs$1.readFile("/proc/self/cgroup", "utf8").catch(() => "")).split("\n");
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
async function resolveGatewayShutdownBudget(supervisor, logger, refresh) {
	const systemdStop = process.platform === "linux" ? await readSystemdStopTimeout() : null;
	const retained = refresh?.previous.nativeStopBudget && (!systemdStop || systemdStop.warning) ? refresh.previous : void 0;
	if (systemdStop?.warning) logger.warn(systemdStop.warning);
	if (retained) logger.warn(`Retaining the startup shutdown budget of ${retained.timeoutMs}ms because the current systemd stop timeout could not be confirmed.`);
	const stop = systemdStop ?? {
		timeoutMs: supervisor === "launchd" ? 2e4 : 33e4,
		source: supervisor === "launchd" ? "launchd ExitTimeOut" : "Gateway stop policy"
	};
	const nativeStopBudget = systemdStop !== null || supervisor === "launchd" || Boolean(retained);
	const limitMs = retained?.timeoutMs ?? Math.min(325e3, stop.timeoutMs - 5e3);
	const elapsedMs = refresh && nativeStopBudget ? Math.max(0, Math.ceil(performance$1.now() - refresh.acceptedAtMs)) : 0;
	const timeoutMs = Math.max(0, limitMs - elapsedMs);
	const reserveMs = Math.min(GATEWAY_SHUTDOWN_RESERVE_MS, timeoutMs);
	return {
		nativeStopBudget,
		timeoutMs,
		reserveMs,
		cleanupBudget: (deadline, hardExitGraceMs) => deadline === void 0 ? void 0 : {
			deadline: deadline - Math.min(hardExitGraceMs / 2, Math.max(0, deadline - performance$1.now()) / 2),
			warn: (message) => logger.warn(message)
		},
		log: (phase) => {
			logger.info(`shutdown budget at ${phase}: drain=${Math.max(0, timeoutMs - GATEWAY_SHUTDOWN_RESERVE_MS)}ms shutdown=${timeoutMs}ms reserve=${reserveMs}ms exitMargin=${GATEWAY_SUPERVISOR_EXIT_MARGIN_MS}ms; source=${retained ? `startup shutdown budget=${retained.timeoutMs}ms` : `${stop.source}=${stop.timeoutMs}ms`}`);
		}
	};
}
function resolveGatewayShutdownDrainBudget(params) {
	const { budget, isRestart } = params;
	const requested = params.requestedRestartDrainTimeoutMs;
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
		drainTimeoutMs: isRestart ? restartDrainTimeoutMs : Math.max(0, budget.timeoutMs - budget.reserveMs),
		forceExitMs: !isRestart ? budget.timeoutMs : restartDrainTimeoutMs === void 0 ? void 0 : restartTimeoutMs(restartDrainTimeoutMs)
	};
}
//#endregion
//#region src/cli/gateway-cli/run-loop-startup.ts
function createGatewayStartupOperations() {
	const scope = new AsyncWorkScope();
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
async function prepareGatewayRestartIteration(runtime, logger, onAdmissionReset) {
	const { abortActiveCronTaskRuns, advanceCronActiveJobGeneration, reloadTaskRuntimeStateFromStore, retireActiveCronTaskRunTracking, resetCronActiveJobs, resetAllLanes, resetGatewayRestartStateForInProcessRestart, resetGatewaySuspendCoordinatorForLifecycleRestart, rotateAgentEventLifecycleGeneration, waitForActiveCronJobs, waitForActiveCronTaskRuns } = runtime;
	rotateAgentEventLifecycleGeneration();
	advanceCronActiveJobGeneration();
	abortActiveCronTaskRuns("Gateway restarting.");
	const cronTaskDrain = await waitForActiveCronTaskRuns(1e3);
	const cronDrain = await waitForActiveCronJobs(1e3);
	if (!cronTaskDrain.drained || !cronDrain.drained) logger.warn(`cron run drain timed out during restart lifecycle reset after retiring old cron admission; ${cronTaskDrain.active} task handle(s) and ${cronDrain.active} active marker(s) remain after aborting old cron runs`);
	retireActiveCronTaskRunTracking();
	resetCronActiveJobs();
	resetGatewaySuspendCoordinatorForLifecycleRestart();
	resetAllLanes();
	onAdmissionReset();
	clearRuntimeConfigSnapshot();
	resetGatewayRestartStateForInProcessRestart();
	try {
		await drainGlobalSingletonLifecycleState("restart");
	} catch (error) {
		logger.warn(`failed to reset ambient runtime state: ${formatErrorMessage(error)}`);
	}
	await reloadTaskRuntimeStateFromStore();
	markGatewayRestartTrace("restart.next-start");
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
		worker = new Worker(`const { parentPort, workerData } = require("node:worker_threads");
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
	} };
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
		exitProcess(exitCode);
	}
};
//#endregion
//#region src/cli/gateway-cli/run-loop.ts
const gatewayLog$1 = createSubsystemLogger("gateway");
const LAUNCHD_SUPERVISED_RESTART_EXIT_DELAY_MS = 1500;
const HARD_EXIT_WATCHDOG_GRACE_MS = 2e3;
const gatewayLifecycleRuntimeLoader = createLazyImportLoader(() => import("./cli/gateway-lifecycle.runtime.js"));
async function runGatewayLoop(params) {
	if (process.title === "openclaw") process.title = "openclaw-gateway";
	let startupStartedAt;
	const eagerLifecycleRuntime = await gatewayLifecycleRuntimeLoader.load();
	const supervisor = eagerLifecycleRuntime.detectGatewayRespawnSupervisorIdentity(process.env, process.platform, { includeLinuxOpenClawGatewayServiceMarker: true });
	const supervisorMode = supervisor?.kind ?? null;
	const restartDecision = eagerLifecycleRuntime.resolveGatewayRestartDecision();
	let lock = await acquireGatewayLock({
		port: params.lockPort,
		listenerMode: supervisorMode ? "supervised" : "foreground",
		supervisor,
		...params.lifecycleLockDeadlineMs !== void 0 ? { lifecycleDeadlineMs: params.lifecycleLockDeadlineMs } : {}
	});
	const processLifetime = params.ownsProcessLifecycle ? new MessageChannel() : void 0;
	processLifetime?.port1.ref();
	let server = null;
	let hostLifecycle;
	let startupOperations = createGatewayStartupOperations();
	let terminalHostedStop;
	let shuttingDown = false;
	let forcedExitStarted = false;
	let restartResolver = null;
	let pendingStartupRequest = null;
	let activeRestartRequest = null;
	const updateSuccessor = new GatewayUpdateSuccessor(gatewayLog$1, eagerLifecycleRuntime);
	let foregroundUpdateClosed = false;
	let forceActiveRestartExit = null;
	let pendingStartupForceExitTimer = null;
	let installationReplacement;
	let pendingRestartCompletion;
	let restartDrainWarning;
	const completeBoot = (completion) => {
		pendingRestartCompletion = void 0;
		params.completeBoot?.(formatBootCompletionContext(completion, installationReplacement?.reason, restartDrainWarning));
		restartDrainWarning = void 0;
	};
	let restartDrainingMarked = false;
	const observeSignal = createGatewaySignalObserver(gatewayLog$1);
	let startupFailedWithoutServerHandle = false;
	let failureWork;
	const processInstanceId = randomUUID();
	const getManagedUpdateOwner = () => (pendingStartupRequest ?? activeRestartRequest)?.restartIntent?.successorOwner;
	const cleanupSignals = () => {
		releaseInstallationObserver();
		process.removeListener("SIGTERM", onSigterm);
		process.removeListener("SIGINT", onSigint);
		process.removeListener("SIGUSR2", onRestartSignal);
		processLifetime?.port1.close();
		processLifetime?.port2.close();
	};
	const exitProcess = (code) => {
		if (pendingRestartCompletion) completeBoot(pendingRestartCompletion);
		clearPendingStartupForceExitTimer();
		hostLifecycle?.retire();
		cleanupSignals();
		params.runtime.exit(code);
	};
	const exitProcessAfterLogFlush = async (code, initialOwner, initialOutcome = "update", hostStopOwner) => {
		if (hostStopOwner && hostLifecycle !== hostStopOwner) return;
		let ownerToCommit = initialOwner;
		let commitOutcome = initialOutcome;
		if (!foregroundUpdateClosed) await eagerLifecycleRuntime.stopGatewayManagedProviderLocalServices().catch((error) => {
			gatewayLog$1.warn(`managed local service shutdown failed: ${formatErrorMessage(error)}`);
		});
		await cleanupSnapshotOperations();
		await flushGatewayLogsBeforeExit(gatewayLog$1);
		for (;;) {
			if (hostStopOwner && hostLifecycle !== hostStopOwner) return;
			if (foregroundUpdateClosed) {
				await updateSuccessor.exit(code, exitProcess);
				return;
			}
			const owner = getManagedUpdateOwner();
			if (!owner) {
				if (!ownerToCommit) {
					if (updateSuccessor.capturedStop) await updateSuccessor.exit(code, exitProcess);
					else exitProcess(code);
				}
				return;
			}
			if (sameManagedUpdateOwner(owner, ownerToCommit) && eagerLifecycleRuntime.claimManagedServiceUpdateHandoff(owner) && await eagerLifecycleRuntime.commitManagedServiceUpdateHandoff(owner, commitOutcome) && sameManagedUpdateOwner(getManagedUpdateOwner(), owner) && eagerLifecycleRuntime.claimManagedServiceUpdateHandoff(owner)) {
				exitProcess(code);
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
				const currentRequest = pendingStartupRequest ?? activeRestartRequest;
				if (currentRequest && !sameManagedUpdateOwner(currentRequest.restartIntent?.successorOwner, ownerToCancel)) currentRequest.restartIntent = {
					...currentRequest.restartIntent,
					successorOwner: ownerToCancel
				};
				continue;
			}
			if (code === 0 && !forcedExitStarted && !updateSuccessor.committed && initialOwner) return reacquireAndResumeInProcessRestart(getManagedUpdateOwner() ?? owner);
			exitProcess(code);
			return;
		}
	};
	const writeStabilityBundle = createGatewayStabilityReporter(eagerLifecycleRuntime, gatewayLog$1);
	const releaseLockIfHeld = async () => {
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
		await exitProcessAfterLogFlush(1);
	};
	const forceExitAfterStabilityBundle = async (reason, exitCode = 1, failure) => {
		if (foregroundUpdateClosed || updateSuccessor.waitingForStop && !getManagedUpdateOwner() || forcedExitStarted) return;
		forcedExitStarted = true;
		hostLifecycle?.retire();
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
			if (restoration === "restart-after-exit") await exitProcessAfterLogFlush(exitCode, owner, "restore");
			else exitProcess(exitCode);
		} else if (updateSuccessor.capturedStop) await updateSuccessor.exit(exitCode, (code) => {
			completeBoot({
				outcome: "forced_stop",
				reason
			});
			exitProcess(code);
		});
		if (stabilityFailure) throw stabilityFailure.error;
	};
	const reacquireAndResumeInProcessRestart = async (alreadyCancelledOwner) => {
		if (foregroundUpdateClosed) return exitProcessAfterLogFlush(1);
		for (;;) {
			if (forcedExitStarted) return;
			const restartRequest = activeRestartRequest;
			const restartOwner = restartRequest?.restartIntent?.successorOwner;
			const restoration = sameManagedUpdateOwner(restartOwner, alreadyCancelledOwner) ? "restored-in-process" : await updateSuccessor.cancelHandoff(getManagedUpdateOwner, restartOwner);
			if (!restoration || forcedExitStarted) return;
			if (restoration === "restart-after-exit") {
				await releaseLockIfHeld();
				return exitProcessAfterLogFlush(0, restartOwner, "restore");
			}
			if (activeRestartRequest !== restartRequest) continue;
			if (installationReplacement) return exitReplacedInstallation(installationReplacement);
			if (!updateSuccessor.stopRequested) try {
				lock = await acquireGatewayLock({
					port: params.lockPort,
					listenerMode: supervisorMode ? "supervised" : "foreground",
					supervisor
				});
			} catch (err) {
				if (forcedExitStarted) return;
				if (activeRestartRequest !== restartRequest) continue;
				gatewayLog$1.error(`failed to reacquire gateway lock for in-process restart: ${String(err)}`);
				exitProcess(1);
				return;
			}
			if (updateSuccessor.stopRequested) await releaseLockIfHeld();
			if (installationReplacement) return exitReplacedInstallation(installationReplacement);
			if (!forcedExitStarted && activeRestartRequest === restartRequest) {
				activeRestartRequest = null;
				if (updateSuccessor.stopRequested) return restartRequest?.hostedStop ? handleHostedStopAfterServerClose(restartRequest.hostedStop, void 0) : exitProcessAfterLogFlush(0);
				shuttingDown = false;
				restartResolver?.();
				return;
			}
			await releaseLockIfHeld();
		}
	};
	const markRestartHandoffUnavailable = (reason) => updateSuccessor.markHandoffUnavailable(foregroundUpdateClosed, reason);
	const handleRestartAfterServerClose = async (expectedOwner, initiallyCancelled = false, failure) => {
		let cancelled = initiallyCancelled;
		const foregroundHandoff = expectedOwner && !cancelled && eagerLifecycleRuntime.isForegroundUpdateHandoff(expectedOwner);
		if (foregroundHandoff) try {
			await eagerLifecycleRuntime.stopGatewayManagedProviderLocalServices();
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
				return exitProcessAfterLogFlush(1, expectedOwner, "restore");
			}
			cancelled = true;
		}
		await releaseLockIfHeld();
		if (forcedExitStarted) return;
		const restartReason = activeRestartRequest?.restartReason;
		pendingRestartCompletion = failure ? {
			outcome: "forced_stop",
			reason: "gateway.restart_close_failed"
		} : {
			outcome: "planned_restart",
			reason: activeRestartRequest ? formatShutdownReason(activeRestartRequest) : "gateway.restart"
		};
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
					return exitProcessAfterLogFlush(1);
				}
				if (updateSuccessor.stopRequested) return exitProcessAfterLogFlush(0);
			} else {
				gatewayLog$1.info("restart mode: managed update handoff owns successor");
				return exitProcessAfterLogFlush(0, expectedOwner);
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
			if (updateSuccessor.stopRequested) return exitProcessAfterLogFlush(0);
			if (accepted) {
				gatewayLog$1.info(`restart mode: update process respawn (spawned pid ${respawn.pid ?? "unknown"})`);
				return exitProcessAfterLogFlush(0);
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
			const handoff = eagerLifecycleRuntime.writeGatewayRestartHandoffSync({
				restartKind,
				reason: restartReason,
				processInstanceId,
				supervisorMode: supervisorMode ?? "external",
				restartTrace: captureGatewayRestartTraceHandoff()
			});
			if (supervisorMode === "external" && !handoff) {
				gatewayLog$1.warn(`external supervisor restart handoff could not be persisted; ${installationReplacement ? "the replaced runtime cannot resume" : "falling back to in-process restart"}`);
				if (isUpdateRestart) await markRestartHandoffUnavailable();
				return reacquireAndResumeInProcessRestart();
			}
			gatewayLog$1.info("restart mode: full process restart (supervisor restart)");
			if (supervisorMode === "launchd") {
				const delay = new Promise((resolve) => {
					setTimeout(resolve, LAUNCHD_SUPERVISED_RESTART_EXIT_DELAY_MS);
				});
				const spawned = respawn.handoffSpawned ? await Promise.race([respawn.handoffSpawned, delay.then(() => true)]) : false;
				await delay;
				if (!spawned) {
					writeStabilityBundle("gateway.restart_handoff_spawn_failed");
					gatewayLog$1.warn(`launchd restart handoff failed to spawn; ${installationReplacement ? "the replaced runtime cannot resume" : "falling back to in-process restart"}`);
					if (isUpdateRestart) await markRestartHandoffUnavailable();
					return reacquireAndResumeInProcessRestart();
				}
			}
			updateSuccessor.commit(true);
			return exitProcessAfterLogFlush(respawn.exitCode ?? 0);
		}
		if (respawn.mode === "failed") {
			if (!isStandaloneUpdate) writeStabilityBundle("gateway.restart_respawn_failed");
			gatewayLog$1.warn(`${isStandaloneUpdate ? "update respawn" : "full process restart"} failed (${respawn.detail ?? "unknown error"}); ${foregroundUpdateClosed ? "leaving Gateway stopped for recovery" : installationReplacement ? "the replaced runtime cannot resume" : "falling back to in-process restart"}`);
			if (isUpdateRestart) await markRestartHandoffUnavailable("restart-unhealthy");
		} else gatewayLog$1.info(`restart mode: ${foregroundUpdateClosed ? "fresh process unavailable; leaving Gateway stopped" : installationReplacement ? "replaced runtime must exit" : "in-process restart"} (${respawn.detail ?? "OPENCLAW_NO_RESPAWN"})`);
		if (!isUpdateRestart && isUpdateProcessRestartReason(activeRestartRequest?.restartReason)) return handleRestartAfterServerClose();
		return reacquireAndResumeInProcessRestart();
	};
	const startupBudget = await resolveGatewayShutdownBudget(supervisorMode, gatewayLog$1);
	let reportedBudget = startupBudget;
	startupBudget.log("startup");
	const clearPendingStartupForceExitTimer = () => {
		clearTimeout(pendingStartupForceExitTimer ?? void 0);
		pendingStartupForceExitTimer = null;
	};
	const armPendingStartupForceExitTimer = (pendingRequest) => {
		reportedBudget = startupBudget;
		const expire = () => {
			pendingStartupForceExitTimer = null;
			gatewayLog$1.error("startup restart request timed out before gateway returned a close handle; exiting for supervisor recovery");
			forceExitAfterStabilityBundle("gateway.restart_startup_request_timeout");
		};
		const arm = (timeoutMs) => {
			const timer = setTimeout(expire, timeoutMs);
			timer.unref?.();
			pendingStartupForceExitTimer = timer;
			return timer;
		};
		const timer = arm(startupBudget.timeoutMs);
		if (process.platform === "linux") resolveGatewayShutdownBudget(supervisorMode, gatewayLog$1, {
			previous: startupBudget,
			acceptedAtMs: pendingRequest.acceptedAtMs
		}).then((budget) => {
			if (!pendingStartupRequest || pendingStartupForceExitTimer !== timer) return;
			reportedBudget = budget;
			clearTimeout(timer);
			arm(budget.timeoutMs);
		}).catch((error) => gatewayLog$1.warn(`Startup shutdown budget refresh failed: ${formatErrorMessage(error)}`));
	};
	const markRestartDraining = (reason) => {
		if (restartDrainingMarked) return;
		eagerLifecycleRuntime.markGatewayDraining(reason);
		restartDrainingMarked = true;
	};
	const handleHostedStopAfterServerClose = async (owner, shutdownFailure) => {
		await updateSuccessor.waitForStopSettlement();
		if (hostLifecycle !== owner) return;
		terminalHostedStop = owner;
		try {
			if (shutdownFailure) {
				await forceExitAfterStabilityBundle("gateway.stop_close_failed", 1, shutdownFailure);
				return;
			}
			const result = await owner.finishStop();
			if (result.outcome === "retired" || hostLifecycle !== owner) return;
			if (result.outcome !== "accepted" && result.outcome !== "exit") {
				gatewayLog$1.error(`Scheduled Gateway stop failed: ${result.detail}`);
				if (result.outcome === "refused") {
					pendingRestartCompletion = {
						outcome: "planned_restart",
						reason: "gateway.stop_refused"
					};
					await releaseLockIfHeld();
					if (hostLifecycle === owner) await reacquireAndResumeInProcessRestart();
				} else await forceExitAfterStabilityBundle("gateway.stop_native_unconfirmed");
				return;
			}
			gatewayLog$1.info(result.outcome === "accepted" ? "Native service manager accepted Gateway stop" : "Gateway host completed graceful stop");
			completeBoot({
				outcome: "clean_stop",
				reason: "stop (hosted Gateway stop)"
			});
			await releaseLockIfHeld();
			await exitProcessAfterLogFlush(0, void 0, "update", owner);
		} catch (error) {
			gatewayLog$1.error(`Scheduled Gateway stop failed: ${formatErrorMessage(error)}`);
			if (hostLifecycle === owner) await forceExitAfterStabilityBundle("gateway.stop_native_unconfirmed", 1, {
				step: "hosted-gateway-stop",
				error
			});
		} finally {
			if (terminalHostedStop === owner) terminalHostedStop = void 0;
		}
	};
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
				const cleanExit = budget.nativeStopBudget && !restartWithoutSupervisor && !shutdownFailure;
				gatewayLog$1.warn(`shutdown deadline reached; abandoning unfinished cleanup and active work before ${action}; last observed: ${lastDrainCounts}; exiting ${cleanExit ? "cleanly" : "with incomplete cleanup"}`);
				forceExitAfterStabilityBundle(isRestart ? "gateway.restart_shutdown_timeout" : "gateway.stop_shutdown_timeout", cleanExit ? 0 : 1, shutdownFailure);
			}, forceExitMs);
			if (params.ownsProcessLifecycle === true) hardExitWatchdog = armShutdownHardExitWatchdog({
				delayMs: forceExitMs + HARD_EXIT_WATCHDOG_GRACE_MS,
				onError: (error) => {
					gatewayLog$1.warn(`hard-exit watchdog failed; retaining main-thread shutdown timer: ${formatErrorMessage(error)}`);
				}
			});
		};
		const clearForceExitTimer = () => {
			clearTimeout(forceExitTimer ?? void 0);
			forceExitTimer = null;
			shutdownDeadline = void 0;
			hardExitWatchdog?.cancel();
			hardExitWatchdog = null;
		};
		if (action === "restart") forceActiveRestartExit = () => {
			clearForceExitTimer();
			if (!getManagedUpdateOwner() && !updateSuccessor.waitingForStop) armForceExitTimer(budget.timeoutMs);
		};
		const completion = (async () => {
			if (process.platform === "linux") {
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
				isRestart,
				forceRestart: Boolean(restartIntent?.force || restartIntent?.drainBudgetExhausted),
				restartWithoutSupervisor,
				acceptedAtMs: acceptedRequest.acceptedAtMs,
				requestedRestartDrainTimeoutMs: isRestart ? eagerLifecycleRuntime.resolveGatewayRestartDrainTimeoutMs(restartIntent) : 0
			});
			if (drainBudget.forceExitMs !== void 0 && (!isRestart || !getManagedUpdateOwner())) armForceExitTimer(drainBudget.forceExitMs);
			let shutdownStep = "restart-failure-recovery";
			try {
				if (failureWork) await failureWork.settled;
				shutdownStep = "active-work-drain";
				await drainGatewayActiveWork({
					request: acceptedRequest,
					runtime: eagerLifecycleRuntime,
					drainTimeoutMs: drainBudget.drainTimeoutMs,
					restartDrainDeadlineAt: drainBudget.restartDrainDeadlineAt,
					markDraining: markRestartDraining,
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
							await exitProcessAfterLogFlush(0, owner, "restore");
							return;
						}
					}
				}
				if (isRestart && !forceExitTimer) armForceExitTimer(drainBudget.restartTimeoutMs());
				if (acceptedRequest.action === "stop") {
					shutdownStep = "startup-operations";
					await acceptedStartupOperations.drain();
				}
				shutdownStep = "gateway-server-close";
				await runWithProcessCleanupBudget(budget.cleanupBudget(shutdownDeadline, HARD_EXIT_WATCHDOG_GRACE_MS), () => server?.close({
					reason: isRestart ? "gateway restarting" : "gateway stopping",
					restartExpectedMs: isRestart ? 1500 : null,
					...isRestart ? { drainTimeoutMs: drainBudget.closeDrainTimeoutMs() } : {}
				}));
			} catch (err) {
				shutdownFailure = {
					step: shutdownStep,
					error: err
				};
				gatewayLog$1.error(`shutdown step failed (${shutdownStep.replaceAll("-", " ")}): ${formatErrorMessage(err)}`);
			} finally {
				const handoffClosed = managedUpdateCancellation !== false && managedUpdateCancellation !== "restart-after-exit";
				if (handoffClosed) server = null;
				if (action === "restart") {
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
						completeBoot(isRestart ? {
							outcome: "planned_restart",
							reason: formatShutdownReason(acceptedRequest)
						} : {
							outcome: shutdownFailure ? "forced_stop" : "clean_stop",
							reason: shutdownFailure ? "gateway.stop_close_failed" : formatShutdownReason(acceptedRequest)
						});
						await releaseLockIfHeld();
						await exitProcessAfterLogFlush(shutdownFailure ? 1 : 0);
					}
				}
				clearForceExitTimer();
			}
		})().finally(() => {
			if (action === "restart") forceActiveRestartExit = null;
		});
		if (acceptedRequest.action === "stop") acceptedStartupOperations.stopCompletion = completion;
		completion.catch((error) => {
			gatewayLog$1.error(`gateway lifecycle completion failed: ${formatErrorMessage(error)}`);
		});
	};
	const flushPendingStartupRequest = (opts = {}) => {
		if (!pendingStartupRequest || !restartResolver) return;
		if (!server && opts.allowMissingServer !== true) return;
		const request = pendingStartupRequest;
		pendingStartupRequest = null;
		clearPendingStartupForceExitTimer();
		startupFailedWithoutServerHandle = false;
		runAcceptedRequest(request);
	};
	const request = (action, signal, restartReason, restartIntent, hostedStop) => {
		if (updateSuccessor.handleSignal({
			action,
			signal,
			restartIntent
		}, foregroundUpdateClosed || (pendingStartupRequest ?? activeRestartRequest)?.foregroundUpdate, {
			beforeWait: () => {
				markRestartDraining(`stop (${signal})`);
				clearPendingStartupForceExitTimer();
				forceActiveRestartExit?.();
			},
			onPark: (successorOwner) => request("restart", signal, "update.run", { successorOwner }, hostedStop),
			onSettled: () => request("stop", signal, void 0, void 0, hostedStop)
		}) || foregroundUpdateClosed) return;
		const acceptedRequest = {
			acceptedAtMs: performance$1.now(),
			action,
			signal,
			restartReason,
			restartIntent,
			foregroundUpdate: action === "restart" && restartIntent?.successorOwner !== void 0 && eagerLifecycleRuntime.isForegroundUpdateHandoff(restartIntent.successorOwner),
			hostedStop
		};
		failureWork?.controller.abort();
		if (shuttingDown) {
			const upgradedRequest = resolveGatewayRunSignalRequestUpgrade(pendingStartupRequest ?? activeRestartRequest, acceptedRequest);
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
				gatewayLog$1.info(`received ${signal}; overriding pending startup restart with shutdown`);
				pendingStartupRequest = null;
				clearPendingStartupForceExitTimer();
				startupFailedWithoutServerHandle = false;
				runAcceptedRequest(acceptedRequest);
				return;
			}
			gatewayLog$1.info(`received ${signal} during shutdown; ignoring`);
			return;
		}
		if (action === "stop" && signal === "SIGTERM") {
			const handoff = consumeGatewaySuspendHandoff(hostLifecycle?.capability.externalRestart);
			if (!handoff.ok) gatewayLog$1.warn(`external restart handoff refused: ${handoff.error}`);
			else if (handoff.value) {
				acceptedRequest.action = "external-restart";
				acceptedRequest.restartIntent = { force: true };
			}
		}
		const isRestart = acceptedRequest.action !== "stop";
		if (hostLifecycle !== hostedStop) hostLifecycle?.retire();
		markRestartDraining(formatShutdownReason(acceptedRequest));
		shuttingDown = true;
		gatewayLog$1.info(`received ${signal}; ${isRestart ? "restarting" : "shutting down"}`);
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
			armPendingStartupForceExitTimer(acceptedRequest);
			return;
		}
		runAcceptedRequest(acceptedRequest);
	};
	const onSigterm = () => {
		observeSignal("SIGTERM");
		gatewayLog$1.debug("signal SIGTERM received");
		if (terminalHostedStop && terminalHostedStop === hostLifecycle) {
			terminalHostedStop.notifyStopSignal();
			return;
		}
		if (foregroundUpdateClosed) {
			updateSuccessor.stop("SIGTERM");
			return;
		}
		(async () => {
			const { consumeGatewayRestartIntentPayloadSync } = await gatewayLifecycleRuntimeLoader.load();
			if (foregroundUpdateClosed) {
				updateSuccessor.stop("SIGTERM");
				return;
			}
			const restartIntent = consumeGatewayRestartIntentPayloadSync();
			request(restartIntent ? "external-restart" : "stop", "SIGTERM", restartIntent?.reason, restartIntent ?? void 0);
		})().catch((err) => {
			gatewayLog$1.error(`failed to handle SIGTERM: ${String(err)}`);
			request("stop", "SIGTERM");
		});
	};
	const onSigint = () => {
		observeSignal("SIGINT");
		gatewayLog$1.debug("signal SIGINT received");
		request("stop", "SIGINT");
	};
	const onRestartSignal = () => {
		observeSignal("SIGUSR2");
		gatewayLog$1.debug("signal SIGUSR2 received");
		if (foregroundUpdateClosed) return;
		(async () => {
			const { abortPendingChannelReloads, consumeGatewayRestartIntentPayloadSync, consumeGatewayRestartIntent, consumeGatewayRestartAuthorization, isGatewayRestartExternallyAllowed, markGatewayRestartHandled, peekGatewayRestartReason, scheduleGatewayRestart } = await gatewayLifecycleRuntimeLoader.load();
			if (foregroundUpdateClosed) return;
			const restartIntent = consumeGatewayRestartIntentPayloadSync();
			if (restartIntent) {
				abortPendingChannelReloads();
				const authorized = consumeGatewayRestartAuthorization();
				const processLocalIntent = authorized ? consumeGatewayRestartIntent() : null;
				if (processLocalIntent?.successorOwner) Object.assign(restartIntent, processLocalIntent);
				markRestartDraining(formatShutdownReason({
					action: "restart",
					signal: "SIGUSR2",
					restartReason: restartIntent.reason ?? "gateway.restart"
				}));
				if (authorized) markGatewayRestartHandled();
				request("restart", "SIGUSR2", restartIntent.reason ?? "gateway.restart", restartIntent);
				return;
			}
			if (!consumeGatewayRestartAuthorization()) {
				markGatewayRestartHandled();
				if (!isGatewayRestartExternallyAllowed()) {
					gatewayLog$1.warn("SIGUSR2 restart ignored (not authorized; commands.restart=false).");
					gatewayLog$1.warn("An unauthorized SIGUSR2 restart signal was received and ignored. If a pending gateway restart needs to be applied, run `openclaw gateway restart` or restart the gateway through your service manager.");
					return;
				}
				if (shuttingDown) {
					gatewayLog$1.info("received SIGUSR2 during shutdown; ignoring");
					return;
				}
				abortPendingChannelReloads();
				scheduleGatewayRestart({
					delayMs: 0,
					reason: "SIGUSR2"
				});
				return;
			}
			abortPendingChannelReloads();
			const signalRestartIntent = consumeGatewayRestartIntent();
			const restartReason = peekGatewayRestartReason();
			markRestartDraining(formatShutdownReason({
				action: "restart",
				signal: "SIGUSR2",
				restartReason: signalRestartIntent?.reason ?? restartReason
			}));
			markGatewayRestartHandled();
			request("restart", "SIGUSR2", signalRestartIntent?.reason ?? restartReason, signalRestartIntent ?? void 0);
		})().catch((err) => {
			gatewayLog$1.error(`SIGUSR2 handler failed: ${formatErrorMessage(err)}`);
			try {
				eagerLifecycleRuntime.markGatewayRestartHandled();
			} catch {}
			if (updateSuccessor.stopRequested) return;
			try {
				eagerLifecycleRuntime.rollbackGatewayRestartSignalAdmission();
				restartDrainingMarked = false;
			} catch {}
		});
	};
	process.on("SIGTERM", onSigterm);
	process.on("SIGINT", onSigint);
	process.on("SIGUSR2", onRestartSignal);
	const releaseInstallationObserver = registerGatewayInstallationReplacementHandler((fact) => {
		installationReplacement = fact;
		gatewayLog$1.warn(fact.message);
		if (!supervisorMode) gatewayLog$1.error(`The foreground Gateway must stop after its installation was replaced. Restart it with: ${formatCliCommand("openclaw gateway run")}`);
		request("restart", "SIGUSR2", fact.reason);
	});
	try {
		let isFirstIteration = true;
		for (;;) {
			const iterationStartupOperations = isFirstIteration ? startupOperations : createGatewayStartupOperations();
			startupOperations = iterationStartupOperations;
			await hostLifecycle?.retire();
			const iterationHost = createGatewayHostLifecycle({
				processOwner: {
					ownsProcessLifecycle: params.ownsProcessLifecycle === true,
					supervisor: supervisorMode
				},
				isCurrent: () => hostLifecycle === iterationHost,
				isServing: () => server !== null && restartResolver !== null && !shuttingDown,
				getShutdownBudget: () => shuttingDown ? reportedBudget : startupBudget,
				acceptStop: () => runOutsideGatewayRootWorkAdmission(() => request("stop", "hosted Gateway stop", void 0, void 0, iterationHost))
			});
			hostLifecycle = iterationHost;
			let startupFailedBeforeServerHandle = false;
			const isRestartIteration = !isFirstIteration;
			isFirstIteration = false;
			try {
				if (isRestartIteration) await prepareGatewayRestartIteration(await gatewayLifecycleRuntimeLoader.load(), gatewayLog$1, () => {
					restartDrainingMarked = false;
				});
				if (installationReplacement) {
					await exitReplacedInstallation(installationReplacement);
					return;
				}
				if (pendingRestartCompletion) completeBoot(pendingRestartCompletion);
				startupStartedAt = Date.now();
				await params.beginBoot?.(startupStartedAt);
				if (installationReplacement) {
					await exitReplacedInstallation(installationReplacement);
					return;
				}
				const startedServer = await params.start({
					...isRestartIteration ? {} : { processStartedAt: performance$1.timeOrigin },
					startupStartedAt,
					requestHotReloadRecovery: eagerLifecycleRuntime.requestGatewayRestartWithSignalAdmission,
					hostLifecycle: iterationHost.capability,
					startupOperation: iterationStartupOperations.run
				});
				iterationStartupOperations.close();
				server = startedServer;
				startupFailedWithoutServerHandle = false;
				await new Promise((resolve, reject) => {
					restartResolver = () => {
						restartResolver = null;
						resolve();
					};
					startedServer.startupSettled.then(void 0, reject);
					flushPendingStartupRequest();
				});
			} catch (err) {
				iterationStartupOperations.close();
				if (iterationStartupOperations.stopCompletion && (iterationStartupOperations.cancelledWith(err) || iterationStartupOperations.failedWith(err))) {
					await iterationStartupOperations.stopCompletion;
					if (iterationStartupOperations.cancelledWith(err)) return;
					throw err;
				}
				await iterationHost.retire();
				const failedServer = server;
				server = null;
				const maintenanceRequired = findStartupMaintenanceRequiredError(err);
				completeBoot({
					outcome: "startup_failed",
					reason: truncateUtf16Safe(formatErrorMessage(err), 500),
					...maintenanceRequired ? { startupReason: maintenanceRequired.code } : {}
				});
				try {
					await failedServer?.close({ reason: "gateway startup failed" });
				} catch (closeError) {
					throw new GatewayStartupCleanupError(err, closeError);
				}
				if (installationReplacement) {
					await exitReplacedInstallation(installationReplacement);
					return;
				}
				if (maintenanceRequired || !isRestartIteration || err instanceof GatewayStartupCleanupError) throw err;
				startupFailedWithoutServerHandle = true;
				startupFailedBeforeServerHandle = true;
				if (!pendingStartupRequest) await releaseLockIfHeld();
				const errMsg = formatErrorMessage(err);
				const errStack = err instanceof Error && err.stack ? `\n${err.stack}` : "";
				writeStabilityBundle("gateway.restart_startup_failed", err);
				gatewayLog$1.error(`gateway startup failed: ${errMsg}. Process will stay alive; fix the issue and restart.${errStack}`);
				const onRestartStartupFailure = params.onRestartStartupFailure;
				if (!shuttingDown && onRestartStartupFailure) {
					const controller = new AbortController();
					failureWork = {
						controller,
						settled: Promise.resolve().then(() => onRestartStartupFailure(err, controller.signal))
					};
					try {
						await failureWork.settled;
					} finally {
						failureWork = void 0;
					}
				}
			}
			if (startupFailedBeforeServerHandle) await new Promise((resolve) => {
				restartResolver = () => {
					restartResolver = null;
					resolve();
				};
				flushPendingStartupRequest({ allowMissingServer: true });
			});
		}
	} finally {
		await hostLifecycle?.retire();
		await releaseLockIfHeld();
		cleanupSignals();
	}
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
		triage = await import("./triage-failure-DvudUoCV.mjs");
	} catch (importError) {
		runtime.error(`Automatic triage could not load: ${formatErrorMessage(importError)}. Run ${formatCliCommand("openclaw triage")} manually.`);
		return;
	}
	await triage.triageAfterFailure(runtime, {
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
const GATEWAY_SHELL_ENV_CONVERGENCE_MAX_READS = 4;
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
const toOptionString = (value) => {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "bigint") return value.toString();
};
function extractGatewayMiskeys(parsed) {
	if (!parsed || typeof parsed !== "object") return {
		hasGatewayToken: false,
		hasRemoteToken: false
	};
	const gateway = parsed.gateway;
	if (!gateway || typeof gateway !== "object") return {
		hasGatewayToken: false,
		hasRemoteToken: false
	};
	const hasGatewayToken = "token" in gateway;
	const remote = gateway.remote;
	return {
		hasGatewayToken,
		hasRemoteToken: remote && typeof remote === "object" ? "token" in remote : false
	};
}
function warnInlinePasswordFlag() {
	defaultRuntime.error("Warning: --password can be exposed via process listings. Prefer --password-file or OPENCLAW_GATEWAY_PASSWORD.");
}
async function resolveGatewayPasswordOption(opts) {
	const direct = toOptionString(opts.password);
	const file = toOptionString(opts.passwordFile);
	if (direct && file) throw new Error("Use either --password or --password-file.");
	if (file) {
		const { readSecretFromFile } = await import("./secret-file-D0fxcT1r.mjs");
		return readSecretFromFile(file, "Gateway password");
	}
	return direct;
}
function parseEnumOption(raw, allowed) {
	if (!raw) return null;
	return allowed.includes(raw) ? raw : null;
}
function formatModeErrorList(modes) {
	const quoted = modes.map((mode) => `"${mode}"`);
	if (quoted.length === 0) return "";
	if (quoted.length === 1) return expectDefined(quoted[0], "quoted entry at 0");
	if (quoted.length === 2) return `${quoted[0]} or ${quoted[1]}`;
	return `${quoted.slice(0, -1).join(", ")}, or ${quoted[quoted.length - 1]}`;
}
function shouldBlockGatewayBindWithoutExplicitAuth(params) {
	return !isLoopbackHost(params.bindHost) && !params.hasSharedSecret && params.resolvedAuthMode !== "trusted-proxy";
}
async function readGatewayStartupConfig(params) {
	const { readConfigFileSnapshotWithPluginMetadata } = await import("./config/config.js");
	const snapshotRead = await params.startupTrace.measure("cli.config-snapshot", () => readConfigFileSnapshotWithPluginMetadata({
		isolateEnv: true,
		observe: false,
		...Object.keys(params.lowerPrecedenceEnv).length > 0 ? { lowerPrecedenceEnv: params.lowerPrecedenceEnv } : {}
	}).catch(() => null));
	const snapshot = snapshotRead?.snapshot ?? null;
	return {
		cfg: snapshot?.config ?? {},
		snapshot,
		...snapshotRead ? { startupConfigSnapshotRead: snapshotRead } : {}
	};
}
async function resolveGatewayRunShellEnvFallbackPlan(cfg) {
	const { createConfigRuntimeEnv } = await import("./env-vars-Bja6FaH8.mjs");
	const { resolveShellEnvFallbackTimeoutMs, shouldDeferShellEnvFallback, shouldEnableShellEnvFallback } = await import("./shell-env-CH_X490Y.mjs");
	const planEnv = createConfigRuntimeEnv(cfg, process.env);
	if (!((shouldEnableShellEnvFallback(planEnv) || cfg.env?.shellEnv?.enabled === true) && !shouldDeferShellEnvFallback(planEnv))) return { enabled: false };
	const { resolveShellEnvExpectedKeys } = await import("./shell-env-expected-keys-B89IjGWb.mjs");
	return {
		enabled: true,
		expectedKeys: resolveShellEnvExpectedKeys(planEnv, cfg),
		timeoutMs: cfg.env?.shellEnv?.timeoutMs ?? resolveShellEnvFallbackTimeoutMs(planEnv)
	};
}
async function loadGatewayRunShellEnvFallback(plan) {
	const { loadShellEnvFallback } = await import("./shell-env-CH_X490Y.mjs");
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
async function clearGatewayRunShellEnvFallback(values) {
	const keys = Object.keys(values);
	if (keys.length === 0) return;
	for (const [key, value] of Object.entries(values)) if (process.env[key] === value) delete process.env[key];
	const { clearShellEnvAppliedKeys } = await import("./shell-env-CH_X490Y.mjs");
	clearShellEnvAppliedKeys(keys);
}
function gatewayRunShellEnvFallbackPlanSignature(plan) {
	return JSON.stringify(plan);
}
async function readGatewayStartupConfigWithShellEnv(params) {
	let lowerPrecedenceEnv = {};
	let loadedPlanSignature;
	try {
		for (let readCount = 0; readCount < GATEWAY_SHELL_ENV_CONVERGENCE_MAX_READS; readCount += 1) {
			const startupConfig = await readGatewayStartupConfig({
				lowerPrecedenceEnv,
				startupTrace: params.startupTrace
			});
			const plan = await resolveGatewayRunShellEnvFallbackPlan(startupConfig.snapshot?.valid === true ? startupConfig.cfg : {});
			const planSignature = gatewayRunShellEnvFallbackPlanSignature(plan);
			if (!plan.enabled) {
				if (Object.keys(lowerPrecedenceEnv).length === 0) return {
					...startupConfig,
					lowerPrecedenceEnv
				};
				await clearGatewayRunShellEnvFallback(lowerPrecedenceEnv);
				lowerPrecedenceEnv = {};
				loadedPlanSignature = void 0;
				continue;
			}
			if (loadedPlanSignature === planSignature) return {
				...startupConfig,
				lowerPrecedenceEnv
			};
			await clearGatewayRunShellEnvFallback(lowerPrecedenceEnv);
			lowerPrecedenceEnv = await loadGatewayRunShellEnvFallback(plan);
			loadedPlanSignature = planSignature;
		}
	} catch (err) {
		await clearGatewayRunShellEnvFallback(lowerPrecedenceEnv);
		throw err;
	}
	await clearGatewayRunShellEnvFallback(lowerPrecedenceEnv);
	throw new Error("Gateway shell environment fallback settings changed repeatedly during startup. Retry startup.");
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
function resolveGatewayStartupFailureExitCode(err) {
	return isInvalidConfigError(err) || isTailscaleRouteOwnershipConflictError(err) || isGatewayEffectiveConfigConflictError(err) || resolveGatewayStartupMaintenanceReason(err) ? EXIT_CONFIG_ERROR : 1;
}
const normalizeGatewayHealthProbeHost = normalizeGatewayHttpProbeHost;
function isGatewayHealthzResponse(statusCode, body) {
	if (statusCode !== 200) return false;
	try {
		const payload = JSON.parse(body);
		return payload.ok === true && payload.status === "live";
	} catch {
		return false;
	}
}
async function probeGatewayHealthz(params) {
	const timeoutMs = params.timeoutMs ?? SUPERVISED_GATEWAY_HEALTH_PROBE_TIMEOUT_MS;
	const result = await requestGatewayLocalHttpProbe({
		...params,
		pathname: "/healthz",
		timeoutMs
	});
	return isGatewayHealthzResponse(result?.statusCode, result?.body ?? "");
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
	const sleep = params.sleep ?? (async (ms) => await new Promise((resolve) => {
		setTimeout(resolve, ms);
	}));
	const probeHealth = params.probeHealth ?? ((probeParams) => probeGatewayHealthz(probeParams));
	const retryMs = params.retryMs ?? SUPERVISED_GATEWAY_LOCK_RETRY_MS;
	const timeoutMs = params.timeoutMs ?? 3e5;
	const startedAt = now();
	for (;;) try {
		await params.startLoop(startedAt + timeoutMs);
		return;
	} catch (err) {
		if (!isGatewayRetryableLockError(err)) throw err;
		const lifecycleContention = isGatewayLifecycleContentionError(err);
		if (!lifecycleContention && await probeHealth({
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
		await sleep(waitMs);
	}
}
async function maybeWriteGatewayStartupFailureBundle(err, reason = "gateway.startup_failed") {
	const { writeDiagnosticStabilityBundleForFailureSync } = await import("./diagnostic-stability-bundle-CeOlUFO4.mjs");
	const result = writeDiagnosticStabilityBundleForFailureSync(reason, err);
	if ("message" in result) gatewayLog.warn(result.message);
}
async function runGatewayCommandOnce(opts, hooks = {}) {
	const inheritedGatewayServicePid = parseStrictPositiveInteger(process.env[GATEWAY_SERVICE_RUNTIME_PID_ENV]);
	normalizeStateDirEnv(process.env);
	const { clearGatewayRunConfigEnvironment } = await import("./pre-bootstrap-CorugINi.mjs");
	clearGatewayRunConfigEnvironment();
	installQaParentWatchdog();
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
	const serverImportMeasurement = startupTrace.startMeasure("cli.server-import", () => import("./server-BmHZaPST.mjs"));
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
			const { recheckGatewayRunReset } = await import("./pre-bootstrap-CorugINi.mjs");
			if (!await recheckGatewayRunReset({
				opts,
				runtime: defaultRuntime
			})) return;
		}
		const { ensureDevGatewayConfig } = await import("./dev-Jy9Q3Igi.mjs");
		await startupTrace.measure("cli.dev-config", () => ensureDevGatewayConfig({ reset: Boolean(opts.reset) }));
		if (opts.reset) {
			const { reloadTrustedGatewayRunEnvironment } = await import("./pre-bootstrap-CorugINi.mjs");
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
	if (snapshot) {
		const { applyFinalGatewayRunConfigEnv } = await import("./pre-bootstrap-CorugINi.mjs");
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
	}
	if (process.env.OPENCLAW_SERVICE_MARKER?.trim()) {
		process.env[GATEWAY_SERVICE_RUNTIME_PID_ENV] = String(process.pid);
		if (process.platform === "darwin") {
			const { warnAboutGatewayRestartStorm } = await import("./restart-storm-CGosKGG1.mjs");
			await warnAboutGatewayRestartStorm(process.env, (message) => gatewayLog.warn(message));
		}
	}
	await hooks.refreshManagedProxy?.(cfg.proxy);
	const portOverride = parsePort(opts.port);
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
		const { cleanStaleGatewayProcessesSync } = await import("./restart-stale-pids-WRGZN8U_.mjs");
		const stale = cleanStaleGatewayProcessesSync(port, { protectedPid: inheritedGatewayServicePid });
		if (stale.length > 0) {
			gatewayLog.info(`service-mode: cleared ${stale.length} stale gateway pid(s) before bind on port ${port}`);
			if (process.platform === "linux") {
				const { findSystemdGatewayInstallation, formatDuelingScopesWarning } = await import("./systemd-Dwmu25L4.mjs");
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
			const { forceFreePortAndWait, waitForPortBindable } = await import("./ports-D-fTOyZ5.mjs");
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
		defaultRuntime.error(`Invalid --auth. Use ${formatModeErrorList(GATEWAY_AUTH_MODES)}.`);
		defaultRuntime.exit(1);
		return;
	}
	const tailscaleRaw = toOptionString(opts.tailscale);
	const tailscaleMode = parseEnumOption(tailscaleRaw, GATEWAY_TAILSCALE_MODES);
	if (tailscaleRaw && !tailscaleMode) {
		defaultRuntime.error(`Invalid --tailscale. Use ${formatModeErrorList(GATEWAY_TAILSCALE_MODES)}.`);
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
	if (toOptionString(opts.password)) warnInlinePasswordFlag();
	const tokenRaw = toOptionString(opts.token);
	gatewayLog.info("resolving authentication…");
	const configExists = snapshot?.exists ?? fs.existsSync(CONFIG_PATH);
	const mode = (snapshot?.valid ? snapshot.config : cfg).gateway?.mode;
	const guardErrors = getGatewayStartGuardErrors({
		allowUnconfigured: opts.allowUnconfigured,
		configExists,
		mode
	});
	if (guardErrors.length > 0) {
		for (const error of guardErrors) defaultRuntime.error(error);
		defaultRuntime.exit(EXIT_CONFIG_ERROR);
		return;
	}
	const miskeys = extractGatewayMiskeys(snapshot?.parsed);
	const authOverride = authMode || passwordRaw || tokenRaw || authModeRaw ? {
		...authMode ? { mode: authMode } : {},
		...tokenRaw ? { token: tokenRaw } : {},
		...passwordRaw ? { password: passwordRaw } : {}
	} : void 0;
	const { resolveGatewayAuth } = await import("./auth-COOw6jv2.mjs");
	const resolvedAuth = await startupTrace.measure("cli.auth-resolve", () => resolveGatewayAuth({
		authConfig: cfg.gateway?.auth,
		authOverride,
		env: process.env,
		tailscaleMode: tailscaleMode ?? cfg.gateway?.tailscale?.mode ?? "off"
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
		].filter(Boolean).join("\n"));
		defaultRuntime.exit(EXIT_CONFIG_ERROR);
		return;
	}
	if (resolvedAuthMode === "none") gatewayLog.warn("Gateway auth mode=none explicitly configured; all gateway connections are unauthenticated.");
	const healthHost = await resolveGatewayBindHost(bind, cfg.gateway?.customBindHost);
	if (shouldBlockGatewayBindWithoutExplicitAuth({
		bindHost: healthHost,
		hasSharedSecret,
		resolvedAuthMode
	})) {
		defaultRuntime.error([
			`Refusing to bind gateway to ${bind} without auth.`,
			...isContainerEnvironment() ? ["Container environment detected — the gateway defaults to bind=auto (0.0.0.0) for port-forwarding compatibility.", "Set OPENCLAW_GATEWAY_TOKEN or OPENCLAW_GATEWAY_PASSWORD, or pass --token/--password to start with auth."] : ["Set gateway.auth.token/password (or OPENCLAW_GATEWAY_TOKEN/OPENCLAW_GATEWAY_PASSWORD) or pass --token/--password."],
			...authHints
		].filter(Boolean).join("\n"));
		defaultRuntime.exit(EXIT_CONFIG_ERROR);
		return;
	}
	const tailscaleOverride = tailscaleMode ? { mode: tailscaleMode } : void 0;
	gatewayLog.info("starting...");
	startupTrace.mark("cli.gateway-loop");
	let startupConfigSnapshotReadForNextStart = startupConfigSnapshotRead;
	const envSidecarStartupMode = isTruthyEnvValue(process.env.OPENCLAW_SKIP_CHANNELS) || isTruthyEnvValue(process.env.OPENCLAW_SKIP_PROVIDERS) ? "defer" : "start";
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
		await triageGatewayStartupFailure(defaultRuntime, error, signal);
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
		const suppressedBootId = activeBootId;
		tryRecoverChannelAutostartSuppression = () => {
			if (!suppressedBootId || activeBootId !== suppressedBootId) return false;
			const decision = inspectGatewayCrashLoopBreaker(process.env);
			if (!decision.recovered || decision.uncleanBoots !== 0) return false;
			const recoveredBootId = recordGatewayCrashLoopRecovery(suppressedBootId, process.env);
			if (!recoveredBootId || activeBootId !== suppressedBootId) return false;
			activeBootId = recoveredBootId;
			gatewayLog.info("gateway restart-loop breaker recovered; channel auto-start restored");
			return true;
		};
		gatewayLog.error(message);
		if (crashLoopDecision.shouldWriteStabilityBundle) await maybeWriteGatewayStartupFailureBundle(new Error(message), GATEWAY_CRASH_LOOP_BREAKER_REASON);
	};
	const completeBoot = (completion) => {
		completeGatewayBootLifecycle(activeBootId, completion, process.env);
		activeBootId = void 0;
	};
	const startLoop = async (lifecycleLockDeadlineMs) => await runGatewayLoop({
		runtime: defaultRuntime,
		ownsProcessLifecycle: true,
		lockPort: port,
		lifecycleLockDeadlineMs,
		healthHost,
		beginBoot,
		completeBoot,
		onRestartStartupFailure: triageStartupFailure,
		start: async ({ processStartedAt, startupStartedAt, requestHotReloadRecovery, hostLifecycle, startupOperation } = {}) => {
			const snapshotPreparation = await import("./io.snapshot-preparation-FzdN_oRo.mjs");
			const startupConfigSnapshotReadForThisStart = startupConfigSnapshotReadForNextStart;
			startupConfigSnapshotReadForNextStart = void 0;
			return await startGatewayServer(port, {
				bind,
				...opts.updateCanary ? { updateCanary: true } : {},
				...activeBootId ? { bootId: activeBootId } : {},
				auth: authOverride,
				tailscale: tailscaleOverride,
				...processStartedAt !== void 0 ? { processStartedAt } : {},
				startupStartedAt,
				hostLifecycle,
				startupOperation,
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
	const { detectRespawnSupervisor } = await import("./supervisor-markers-CpiqeOMr.mjs");
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
		if (isGatewayLockError(err)) {
			const errMessage = formatErrorMessage(err);
			defaultRuntime.error(`Gateway failed to start: ${errMessage}\nIf the gateway is supervised, stop it with: ${formatCliCommand("openclaw gateway stop")}`);
			try {
				const [{ formatPortDiagnostics }, { inspectPortUsage }] = await Promise.all([import("./ports-format-Kz9qY_Lp.mjs"), import("./ports-inspect-B7qrHyGk.mjs")]);
				const diagnostics = await inspectPortUsage(port);
				if (diagnostics.status === "busy") for (const line of formatPortDiagnostics(diagnostics)) defaultRuntime.error(line);
			} catch {}
			const { maybeExplainGatewayServiceStop } = await import("./shared-U8Jv_WTH.mjs");
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
async function runGatewayCommand(opts, hooks = {}, recoveryDeps) {
	if (opts.taskSupervisor) {
		const { runWindowsGatewayTaskSupervisor } = await import("./task-supervisor-D-3-Solw.mjs");
		await runWindowsGatewayTaskSupervisor();
		return;
	}
	try {
		await runGatewayCommandOnce(opts, hooks);
	} catch (error) {
		if (!isInvalidConfigError(error)) throw error;
		defaultRuntime.error(`Gateway failed to start: ${formatErrorMessage(error)}`);
		if (opts.allowUnconfigured || !isDoctorRecoverableInvalidConfigError(error)) {
			defaultRuntime.exit(EXIT_CONFIG_ERROR);
			return;
		}
		const { offerInvalidConfigRecovery } = await import("./invalid-config-recovery-DHYIrLF-.mjs");
		if ((await offerInvalidConfigRecovery({
			runtime: defaultRuntime,
			deps: recoveryDeps,
			retry: async () => await runGatewayCommandOnce(opts, hooks)
		})).status === "recovered") return;
		defaultRuntime.exit(EXIT_CONFIG_ERROR);
	}
}
const testing = {
	createConfiguredGatewayHealthProbe,
	isGatewayHealthzResponse,
	normalizeGatewayHealthProbeHost,
	probeGatewayHealthz,
	resolveGatewayLockErrorExitCode,
	resolveGatewayStartupFailureExitCode,
	runGatewayLoopWithSupervisedLockRecovery
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.gatewayRunTestApi")] = testing;
//#endregion
export { runGatewayCommand };
