import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { S as parseStrictInteger, w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { u as resolveGatewayLaunchAgentLabel } from "./constants-BLghGsId.mjs";
import "./utils-gjJ-tD2q.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { a as isPidDefinitelyDead, i as isPidAlive, t as getFileLockProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { r as ServiceInspectionError } from "./service-inspection-error-ozNMOrIE.mjs";
import { t as resolveServiceManagerEnv } from "./service-process-env-BITMm5ft.mjs";
import { t as createManagedHandoffLeaseStore } from "./update-managed-service-handoff-lease-CPNRSilB.mjs";
import { r as readGatewayOwnerLease } from "./gateway-owner-lease-KxvFWleW.mjs";
import { r as getSelfAndAncestorPidsSync, t as cleanStaleGatewayProcessesSync } from "./restart-stale-pids-CHtdUHKp.mjs";
import { c as withGatewayServiceInstallationRecovery, i as assertGatewayServiceUpdateCurrent, o as isUpdateOwnedGatewayServiceCommand } from "./service-update-authority-Ddw1lcTH.mjs";
import { n as normalizeWindowsPathSeparators, r as writeFormattedLines, t as formatLine } from "./output-CvqJn7xh.mjs";
import { t as resolveDaemonHomeDir } from "./paths-CPHiohZf.mjs";
import { l as readLockPayloadSync, u as resolveGatewayLockPaths } from "./gateway-lock-OT1e72lx.mjs";
import { a as writeGatewayServiceRestartIntentSync, r as prepareGatewayRestartIntentLegacyProcess, s as GatewayRestartPreparationError } from "./restart-intent-Boqzox86.mjs";
import { n as probePortUsage } from "./ports-probe-FuJ7VYyD.mjs";
import { t as mergeGatewayServiceEnv } from "./service-env-merge-un685p3z.mjs";
import { r as formatPortDiagnostics } from "./ports-format-Bal9BDTl.mjs";
import { n as inspectPortUsage } from "./ports-inspect-BaO1UeCS.mjs";
import { t as createGatewayLifecycleMutationReporter } from "./service-mutation-BITjAaaK.mjs";
import { n as resolveLaunchAgentLabel, t as assertValidLaunchAgentLabel } from "./launchd-label-DxyNaz_g.mjs";
import { _ as isSystemLaunchDaemonOwnershipError, a as removeBootedOutLaunchAgentPlist, b as formatLaunchctlResultDetail, d as rewriteLaunchAgentPlistForRestart, f as writeLaunchAgentPlist, i as readExistingLaunchAgentPlist, l as resolveLaunchAgentPlistPath, m as assertNoSystemLaunchDaemonOwnership, n as captureLaunchAgentInstallFiles, u as resolveLaunchAgentPlistPathForLabel, x as isLaunchctlNotLoaded, y as execLaunchctl } from "./launchd-service-files-CqGEulnB.mjs";
import { s as readLaunchAgentProgramArgumentsFromFile } from "./launchd-plist-D6ncxWm8.mjs";
import { a as isLaunchctlAlreadyLoaded, f as readLaunchAgentProgramArguments, g as resolveLaunchAgentGuiDomain, h as resolveLaunchAgentGatewayContext, l as parseLaunchctlJob, o as isUnsupportedGuiDomain, p as readLaunchAgentRuntime, r as isLaunchAgentEnabled, t as bootstrapLaunchAgentOrThrow, u as probeLaunchAgentState } from "./launchd-runtime-CuRpYSjr.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-Nv-hNWki.mjs";
import { r as resolveServiceProcessMembershipBlock, t as inspectServiceProcessMembershipSync } from "./service-process-membership-CrMcpy4J.mjs";
import { n as scheduleDetachedLaunchdRestartHandoff, t as scheduleDetachedLaunchdMaintenancePark } from "./launchd-restart-handoff-CDoIPIxg.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { spawnSync } from "node:child_process";
//#region src/daemon/launchd-current-service.ts
/** Detects native launchd membership, including children reparented after ancestor exit. */
/** Environment hints for launchd identity; inherited markers do not prove ancestry. */
function isCurrentProcessLaunchdServiceLabel(label, env = process.env) {
	return [
		env.LAUNCH_JOB_LABEL,
		env.LAUNCH_JOB_NAME,
		env.XPC_SERVICE_NAME
	].some((value) => normalizeOptionalString(value) === label) || normalizeOptionalString(env.OPENCLAW_LAUNCHD_LABEL) === label && normalizeOptionalString(env.OPENCLAW_SERVICE_MARKER) === "openclaw" && Boolean(normalizeOptionalString(env.OPENCLAW_SERVICE_KIND));
}
/** A completed parent walk alone cannot exclude reparented members of a launchd job. */
async function isCurrentProcessInsideLaunchdService(label) {
	const probe = await probeLaunchAgentState(`${resolveLaunchAgentGuiDomain()}/${label}`);
	if (probe.state === "running" && probe.runtime.pid !== void 0) {
		const ancestors = getSelfAndAncestorPidsSync();
		if (ancestors.has(probe.runtime.pid)) return true;
		const block = resolveServiceProcessMembershipBlock(inspectServiceProcessMembershipSync(probe.runtime.pid, "darwin"), ancestors.has(1), "darwin");
		if (block === "inside-gateway-service") return true;
		if (block) throw new ServiceInspectionError(block);
		return false;
	}
	if (probe.state === "unknown" || probe.state === "running") throw new ServiceInspectionError("service-membership-unverified");
	return false;
}
//#endregion
//#region src/daemon/launchd-install.ts
/** Transactional LaunchAgent installation, staging, rollback, and removal. */
async function uninstallLaunchAgent({ env, stdout }) {
	await assertExternalLaunchAgentMutation(env, "uninstall");
	const domain = resolveLaunchAgentGuiDomain();
	const label = resolveLaunchAgentLabel(env);
	const plistPath = resolveLaunchAgentPlistPath(env);
	if ((await probeLaunchAgentState(`${domain}/${label}`)).state !== "not-loaded") await bootoutLaunchAgent(`${domain}/${label}`);
	try {
		await fs.lstat(plistPath);
	} catch (error) {
		if (error.code !== "ENOENT") throw createLaunchAgentRemovalError(error);
		stdout.write(`LaunchAgent not found at ${plistPath}\n`);
		return;
	}
	const home = normalizeWindowsPathSeparators(resolveDaemonHomeDir(env));
	const trashDir = path.posix.join(home, ".Trash");
	const dest = path.join(trashDir, `${label}-${Date.now()}.plist`);
	try {
		const { trashed } = await removeBootedOutLaunchAgentPlist(plistPath, dest);
		stdout.write(`${trashed ? formatLine("Moved LaunchAgent to Trash", dest) : formatLine("Removed LaunchAgent", plistPath)}\n`);
	} catch (error) {
		if (error.code === "ENOENT") try {
			await fs.lstat(plistPath);
		} catch (accessError) {
			if (accessError.code === "ENOENT") {
				stdout.write(`LaunchAgent not found at ${plistPath}\n`);
				return;
			}
			throw createLaunchAgentRemovalError(accessError);
		}
		throw createLaunchAgentRemovalError(error);
	}
}
function createLaunchAgentRemovalError(error) {
	const code = error.code;
	return /* @__PURE__ */ new Error(`LaunchAgent removal failed${code ? ` (${code})` : ""}. Check permissions and retry.`);
}
async function assertExternalLaunchAgentMutation(env, action) {
	const configuredCurrentLabel = process.env.OPENCLAW_LAUNCHD_LABEL?.trim();
	const candidates = /* @__PURE__ */ new Set([resolveLaunchAgentLabel(env), ...configuredCurrentLabel ? [assertValidLaunchAgentLabel(configuredCurrentLabel)] : []]);
	for (const label of candidates) if (await isCurrentProcessInsideLaunchdService(label)) throw new Error(`Refusing to ${action} LaunchAgent ${resolveLaunchAgentLabel(env)} from inside ${label}; run this command from an external shell.`);
}
async function stageLaunchAgent(args) {
	const { plistPath, stdoutPath } = await writeLaunchAgentPlist(args);
	writeFormattedLines(args.stdout, [{
		label: "Staged LaunchAgent",
		value: plistPath
	}, {
		label: "Logs",
		value: stdoutPath
	}]);
	return { plistPath };
}
async function snapshotLaunchAgentLoadedState(serviceTarget) {
	const probe = await probeLaunchAgentState(serviceTarget);
	if (probe.state === "unknown") throw new Error(`launchctl print could not determine whether ${serviceTarget} is loaded: ${probe.detail ?? "unknown error"}`);
	return probe.state !== "not-loaded";
}
async function bootoutLaunchAgent(serviceTarget) {
	assertGatewayServiceUpdateCurrent();
	const result = await execLaunchctl(["bootout", serviceTarget]);
	assertGatewayServiceUpdateCurrent();
	if (result.code !== 0 && !isLaunchctlNotLoaded(result)) throw new Error(`launchctl bootout failed: ${formatLaunchctlResultDetail(result)}`);
}
async function installLaunchAgent(args) {
	const targetPlistPath = resolveLaunchAgentPlistPath(args.env);
	const label = resolveLaunchAgentLabel(args.env);
	const domain = resolveLaunchAgentGuiDomain();
	const serviceTarget = `${domain}/${label}`;
	const { publication, loaded, restoreLoaded, enabled } = await withGatewayServiceInstallationRecovery(async () => {
		await assertExternalLaunchAgentMutation(args.env, "install");
		const captured = args.definitionTransaction ? {
			kind: "transaction",
			hooks: args.definitionTransaction
		} : {
			kind: "local",
			files: await captureLaunchAgentInstallFiles(args.env)
		};
		const previous = captured.kind === "local" ? captured.files.originals.get(targetPlistPath).snapshot : await readExistingLaunchAgentPlist(targetPlistPath);
		const wasEnabled = args.preserveAutoStart ? await isLaunchAgentEnabled({ env: args.env }) : void 0;
		const wasLoaded = await snapshotLaunchAgentLoadedState(serviceTarget);
		const wasRestorable = wasLoaded && previous !== null;
		if (wasLoaded && !wasRestorable) args.warn?.(`LaunchAgent ${serviceTarget} plist is missing; replacing the registration without a previous definition to restore.`);
		return {
			publication: captured,
			loaded: wasLoaded,
			restoreLoaded: wasRestorable,
			enabled: wasEnabled
		};
	}, async () => false);
	const bootstrap = (plistPath, actionHint) => bootstrapLaunchAgentOrThrow({
		domain,
		serviceTarget,
		plistPath,
		actionHint,
		retryPendingTeardown: true,
		assertCurrent: assertGatewayServiceUpdateCurrent,
		preserveAutoStart: args.preserveAutoStart,
		preservedEnabled: enabled
	});
	let activationAttempted = false;
	const install = async () => {
		const published = await writeLaunchAgentPlist(args, publication.kind === "local" ? publication.files : void 0);
		await (publication.kind === "local" ? publication.files.assertCurrent() : publication.hooks.beforeWrite());
		await assertNoSystemLaunchDaemonOwnership(label);
		assertGatewayServiceUpdateCurrent();
		activationAttempted = true;
		if (loaded) await bootoutLaunchAgent(serviceTarget);
		await bootstrap(published.plistPath, "openclaw gateway install --force");
		assertGatewayServiceUpdateCurrent();
		return published;
	};
	const { plistPath, stdoutPath } = publication.kind === "transaction" ? await install() : await withGatewayServiceInstallationRecovery(install, async () => {
		const files = publication.files;
		if (activationAttempted) {
			await files.assertCurrent();
			const current = await probeLaunchAgentState(serviceTarget);
			if (current.state === "unknown") throw new Error(`launchctl print could not determine whether ${serviceTarget} is loaded during LaunchAgent rollback: ${current.detail ?? "unknown error"}`);
			if (current.state !== "not-loaded") {
				await files.assertCurrent();
				await bootoutLaunchAgent(serviceTarget);
			}
		}
		const restored = await files.restore();
		if (activationAttempted && restoreLoaded) {
			await files.assertCurrent();
			await assertNoSystemLaunchDaemonOwnership(label);
			await bootstrap(targetPlistPath, "openclaw gateway start");
		}
		return restored || activationAttempted;
	});
	writeFormattedLines(args.stdout, [{
		label: "Installed LaunchAgent",
		value: plistPath
	}, {
		label: "Logs",
		value: stdoutPath
	}]);
	return { plistPath };
}
//#endregion
//#region src/daemon/launchd-lifecycle.ts
/** LaunchAgent bootstrap recovery plus start and restart lifecycle controls. */
const LAUNCHCTL_PROTECTED_PID_TIMEOUT_MS = 2e3;
function readLaunchAgentPidForCleanupSync(serviceTarget) {
	const probe = spawnSync("launchctl", ["print", serviceTarget], {
		env: resolveServiceManagerEnv(),
		encoding: "utf8",
		timeout: LAUNCHCTL_PROTECTED_PID_TIMEOUT_MS
	});
	const result = {
		stdout: probe.stdout ?? "",
		stderr: probe.error?.message ?? probe.stderr ?? "",
		code: probe.error ? 1 : probe.status ?? 1
	};
	if (result.code !== 0) throw new Error(`launchctl print failed: ${formatLaunchctlResultDetail(result)}`);
	const pid = parseLaunchctlJob(result.stdout || result.stderr || "", serviceTarget).runtime.pid;
	if (pid === void 0) throw new Error("launchctl print did not report a running pid");
	return pid;
}
async function repairLaunchAgentBootstrap(args) {
	const env = args.env ?? process.env;
	const domain = resolveLaunchAgentGuiDomain();
	const label = resolveLaunchAgentLabel(env);
	const plistPath = resolveLaunchAgentPlistPath(env);
	const serviceTarget = `${domain}/${label}`;
	try {
		await assertNoSystemLaunchDaemonOwnership(label);
	} catch (error) {
		if (!isSystemLaunchDaemonOwnershipError(error)) throw error;
		return {
			ok: false,
			status: error.ownership.status === "unverifiable" ? "system-launchdaemon-unverifiable" : "system-launchdaemon-conflict",
			detail: error.message
		};
	}
	const warn = args.warn ?? ((message) => console.warn(formatLine("Warning", message)));
	await rewriteLaunchAgentPlistForRestart({
		env,
		label,
		plistPath,
		warn
	});
	try {
		if (await bootstrapLaunchAgentOrThrow({
			domain,
			serviceTarget,
			plistPath,
			actionHint: "openclaw gateway start",
			deadline: args.deadline
		}) === "bootstrapped") return {
			ok: true,
			status: "repaired"
		};
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
		const boot = error instanceof Error ? error.cause : void 0;
		if (!boot || typeof boot !== "object" || !("stderr" in boot) || typeof boot.stderr !== "string" || !("stdout" in boot) || typeof boot.stdout !== "string" || !("code" in boot) || typeof boot.code !== "number" || !("termination" in boot)) throw error;
		const detail = (boot.stderr || boot.stdout).trim();
		if (isUnsupportedGuiDomain(detail)) return {
			ok: false,
			status: "gui-session-unavailable",
			detail,
			domain
		};
		if (boot.termination !== "exit" || !isLaunchctlAlreadyLoaded({
			code: boot.code,
			termination: "exit",
			stderr: boot.stderr,
			stdout: boot.stdout
		})) return {
			ok: false,
			status: "bootstrap-failed",
			detail: detail || void 0
		};
	}
	if ((await readLaunchAgentRuntime(env, { timeoutMs: args.deadline?.remainingMs() })).status === "running") return {
		ok: true,
		status: "already-loaded"
	};
	const kick = await execLaunchctl(["kickstart", serviceTarget], args.deadline);
	if (kick.code !== 0) return {
		ok: false,
		status: "kickstart-failed",
		detail: (kick.stderr || kick.stdout).trim() || void 0
	};
	return {
		ok: true,
		status: "already-loaded"
	};
}
function writeLaunchAgentActionLine(stdout, label, value) {
	try {
		stdout.write(`${formatLine(label, value)}\n`);
	} catch (err) {
		if (err?.code !== "EPIPE") throw err;
	}
}
async function ensureLaunchAgentLoadedAfterFailure(params) {
	params.assertCurrent?.();
	const probe = await execLaunchctl(["print", params.serviceTarget], params.deadline);
	params.assertCurrent?.();
	if (probe.code === 0) return { loaded: true };
	try {
		await bootstrapLaunchAgentOrThrow({
			...params,
			actionHint: "openclaw gateway start"
		});
		return { loaded: true };
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
		return {
			loaded: false,
			detail: error instanceof Error ? error.message : String(error)
		};
	}
}
async function rethrowLaunchAgentActivationFailure(params, error) {
	if (hasCommandProcessCleanupError(error)) throw error;
	const restored = await ensureLaunchAgentLoadedAfterFailure(params);
	const failure = error instanceof Error ? error.message : String(error);
	throw new Error(restored.loaded ? `${failure}\nLaunchAgent ${params.serviceTarget} is loaded; launchd can retry its KeepAlive job. Run openclaw gateway status --deep to inspect startup.` : [
		failure,
		`LaunchAgent ${params.serviceTarget} is not loaded and could not be restored: ${restored.detail}`,
		"The gateway is down and launchd has no job left to respawn it.",
		`Fix: run \`openclaw gateway start\`, or \`launchctl bootstrap ${params.domain} ${params.plistPath}\`.`
	].join("\n"), { cause: error });
}
async function needsLaunchAgentBootstrap(kickstart, serviceTarget, assertCurrent, deadline) {
	if (kickstart.code === 0 || isLaunchctlNotLoaded(kickstart)) return kickstart.code !== 0;
	assertCurrent?.();
	const observed = await probeLaunchAgentState(serviceTarget, deadline?.remainingMs());
	assertCurrent?.();
	return observed.state === "not-loaded";
}
async function prepareLaunchAgentActivation(args, action) {
	const { assertCurrent, preserveAutoStart, preserveDefinition, onRestartAttempted, deadline } = args;
	const serviceEnv = args.env ?? process.env;
	const domain = resolveLaunchAgentGuiDomain();
	const label = resolveLaunchAgentLabel(serviceEnv);
	const plistPath = resolveLaunchAgentPlistPath(serviceEnv);
	const serviceTarget = `${domain}/${label}`;
	const reportMutation = createGatewayLifecycleMutationReporter(args.onMutation);
	await assertNoSystemLaunchDaemonOwnership(label);
	const bootstrap = {
		domain,
		serviceTarget,
		plistPath,
		onMutation: reportMutation,
		assertCurrent,
		beforeEffect: args.beforeEffect,
		preserveAutoStart,
		retryPendingTeardown: preserveDefinition,
		deadline
	};
	const load = (options = {}) => bootstrapLaunchAgentOrThrow({
		...bootstrap,
		actionHint: `openclaw gateway ${action}`,
		...options
	});
	return {
		serviceEnv,
		label,
		plistPath,
		serviceTarget,
		reportMutation,
		async enable() {
			if (preserveAutoStart) return false;
			assertCurrent?.();
			const result = await execLaunchctl(["enable", serviceTarget], deadline, args.beforeEffect);
			if (result.code === 0) reportMutation("enable");
			return result.code === 0;
		},
		bootstrap: load,
		async kickstart(skipEnable) {
			assertCurrent?.();
			if (action === "restart") onRestartAttempted?.();
			let start = await execLaunchctl([
				"kickstart",
				...action === "restart" ? ["-k"] : [],
				serviceTarget
			], deadline, args.beforeEffect);
			if (action === "restart" && start.code === 0) {
				reportMutation("kickstart");
				return;
			}
			if (await needsLaunchAgentBootstrap(start, serviceTarget, assertCurrent, deadline)) {
				await load({ skipEnable });
				if (action === "restart" && !preserveDefinition) return;
				assertCurrent?.();
				start = await execLaunchctl(["kickstart", serviceTarget], deadline, args.beforeEffect);
			}
			if (start.code !== 0) throw new Error(`launchctl kickstart failed: ${start.stderr || start.stdout}`.trim());
			if (action === "restart") reportMutation("kickstart");
		},
		rethrow: (error, retryPendingTeardown = preserveDefinition) => rethrowLaunchAgentActivationFailure({
			...bootstrap,
			retryPendingTeardown
		}, error)
	};
}
async function startLaunchAgent(params) {
	const { stdout } = params;
	const activation = await prepareLaunchAgentActivation(params, "start");
	const enabled = await activation.enable();
	try {
		await activation.kickstart(enabled);
	} catch (error) {
		await activation.rethrow(error);
	}
	activation.reportMutation("kickstart");
	writeLaunchAgentActionLine(stdout, "Started LaunchAgent", activation.serviceTarget);
}
async function restartLaunchAgent(params) {
	const { preserveDefinition, stdout, warn, assertCurrent } = params;
	const activation = await prepareLaunchAgentActivation(params, "restart");
	const { serviceEnv, label, plistPath, serviceTarget, reportMutation } = activation;
	const detached = await isCurrentProcessInsideLaunchdService(label);
	if (!detached) {
		const { env: cleanupEnv, port: cleanupPort, probeHosts } = await resolveLaunchAgentGatewayContext(serviceEnv);
		if (cleanupPort !== null) {
			assertGatewayServiceUpdateCurrent();
			cleanStaleGatewayProcessesSync(cleanupPort, {
				env: cleanupEnv,
				assertCurrent: assertGatewayServiceUpdateCurrent,
				resolveProtectedPid: () => {
					const pid = readLaunchAgentPidForCleanupSync(serviceTarget);
					assertGatewayServiceUpdateCurrent();
					return pid;
				}
			});
			const diagnostics = await inspectPortUsage(cleanupPort, { probeHosts }).catch(() => null);
			if (diagnostics?.status === "busy") {
				const managedPid = (await readLaunchAgentRuntime(serviceEnv, { timeoutMs: params.deadline?.remainingMs() })).pid;
				if (!(managedPid !== void 0 && diagnostics.listeners.length > 0 && diagnostics.listeners.every((listener) => listener.pid === managedPid))) throw new Error([`gateway port ${cleanupPort} is busy but is not verifiably owned by LaunchAgent ${label}`, ...formatPortDiagnostics(diagnostics)].join("\n"));
			}
		}
	}
	const plistReloadNeeded = !preserveDefinition && await rewriteLaunchAgentPlistForRestart({
		env: serviceEnv,
		label,
		plistPath,
		stdout,
		warn
	});
	if (detached) {
		if (isUpdateOwnedGatewayServiceCommand()) throw new Error("UPDATE_NATIVE_AUTHORITY: update-owned native restart requires an external executor, not a detached service handoff.");
		const handoff = scheduleDetachedLaunchdRestartHandoff({
			env: serviceEnv,
			mode: plistReloadNeeded ? "reload" : "kickstart",
			waitForPid: process.pid
		});
		if (!handoff.ok) throw new Error(`launchd restart handoff failed: ${handoff.error}`);
		if (!await handoff.value) throw new Error("launchd restart handoff failed: helper failed to spawn");
		reportMutation(plistReloadNeeded ? "handoff-reload" : "handoff-kickstart");
		writeLaunchAgentActionLine(stdout, "Scheduled LaunchAgent restart", serviceTarget);
		return { outcome: "scheduled" };
	}
	try {
		await activation.enable();
		if (plistReloadNeeded) {
			assertCurrent?.();
			const bootout = await execLaunchctl(["bootout", serviceTarget], params.deadline);
			if (bootout.code !== 0 && !isLaunchctlNotLoaded(bootout)) throw new Error(`launchctl bootout failed: ${formatLaunchctlResultDetail(bootout)}`);
			if (bootout.code === 0) reportMutation("bootout");
			await activation.bootstrap({ retryPendingTeardown: true });
		} else await activation.kickstart();
	} catch (error) {
		await activation.rethrow(error, preserveDefinition || plistReloadNeeded);
	}
	writeLaunchAgentActionLine(stdout, "Restarted LaunchAgent", serviceTarget);
	return { outcome: "completed" };
}
//#endregion
//#region src/daemon/launchd-stop.ts
const LAUNCH_AGENT_STOP_PORT_RELEASE_TIMEOUT_MS = 33e4;
const LAUNCH_AGENT_STOP_PORT_RELEASE_POLL_MS = 100;
const LAUNCH_AGENT_STOP_TIMEOUT_MS = 34e4;
function launchAgentStopError(serviceTarget, detail) {
	return /* @__PURE__ */ new Error(`${detail}. Run \`launchctl bootout ${serviceTarget}\` from an external terminal in the service owner's logged-in macOS GUI session.`);
}
function verifyLaunchAgentStopProbe(serviceTarget, probe) {
	if (probe.state === "unknown") throw launchAgentStopError(serviceTarget, `launchctl print could not verify LaunchAgent stop: ${probe.detail ?? "unknown error"}`);
	if (probe.state !== "running") return;
	if (probe.runtime.pid === void 0) throw launchAgentStopError(serviceTarget, "launchctl print reported a running job without a PID");
	return probe.runtime.pid;
}
async function waitForLaunchAgentUnloaded(serviceTarget, initialPids, assertCurrent, onWait) {
	const pids = new Set(initialPids);
	let warned = false;
	const deadline = performance.now() + LAUNCH_AGENT_STOP_TIMEOUT_MS;
	for (;;) {
		const probe = await probeLaunchAgentState(serviceTarget, 5e3);
		assertCurrent?.();
		const observedPid = verifyLaunchAgentStopProbe(serviceTarget, probe);
		if (observedPid !== void 0) pids.add(observedPid);
		const alivePids = [...pids].filter((pid) => !isPidDefinitelyDead(pid));
		if (probe.state === "not-loaded" && alivePids.length === 0) return;
		if (probe.state === "not-loaded" && !warned) {
			warned = true;
			onWait?.(alivePids);
		}
		if (performance.now() >= deadline) throw launchAgentStopError(serviceTarget, `LaunchAgent stop did not complete: ${serviceTarget} is ${probe.state === "not-loaded" ? "unloaded" : "still loaded"}${alivePids.length ? `; PID ${alivePids.join(", ")} is still alive` : ""}`);
		await sleep(Math.min(100, Math.max(0, deadline - performance.now())));
	}
}
async function waitForGatewayPortRelease(port, probeHosts) {
	const deadline = performance.now() + LAUNCH_AGENT_STOP_PORT_RELEASE_TIMEOUT_MS;
	while (performance.now() < deadline) {
		await sleep(Math.min(LAUNCH_AGENT_STOP_PORT_RELEASE_POLL_MS, deadline - performance.now()));
		if (await probePortUsage(port, probeHosts) === "free") return true;
	}
	return false;
}
async function assertGatewayPortReleasedAfterStop(env, assertCurrent) {
	const { env: cleanupEnv, port, probeHosts } = await resolveLaunchAgentGatewayContext(env);
	if (port === null) return;
	await assertCurrent();
	assertGatewayServiceUpdateCurrent();
	cleanStaleGatewayProcessesSync(port, {
		env: cleanupEnv,
		assertCurrent: assertGatewayServiceUpdateCurrent
	});
	const diagnostics = await inspectPortUsage(port, { probeHosts }).catch(() => null);
	if (diagnostics?.status !== "busy") return;
	if (await waitForGatewayPortRelease(port, probeHosts)) return;
	throw new Error([`gateway port ${port} is still busy after LaunchAgent stop`, ...formatPortDiagnostics(diagnostics)].join("\n"));
}
async function stopLaunchAgent({ stdout, env, disable: persistDisable, onMutation, assertCurrent, updateHandoff }) {
	const serviceEnv = env ?? process.env;
	const domain = resolveLaunchAgentGuiDomain();
	const label = resolveLaunchAgentLabel(serviceEnv);
	const serviceTarget = `${domain}/${label}`;
	const reportMutation = createGatewayLifecycleMutationReporter(onMutation);
	const updateOwned = isUpdateOwnedGatewayServiceCommand();
	let intentEnv = serviceEnv;
	const assertNativeCurrent = () => {
		assertCurrent?.();
		assertGatewayServiceUpdateCurrent();
	};
	const insideService = await isCurrentProcessInsideLaunchdService(label);
	const assertStopCurrent = async () => {
		assertNativeCurrent();
		const handoff = updateOwned && updateHandoff ? createManagedHandoffLeaseStore().read(resolveUpdateInstallRoot(updateHandoff.root)) : void 0;
		const transferred = handoff?.kind === "current" && (handoff.lease.helper.pid !== handoff.lease.executor.pid || handoff.lease.helper.startIdentity !== handoff.lease.executor.startIdentity);
		if (insideService || transferred || updateOwned && intentEnv.OPENCLAW_UPDATE_RUN_HANDOFF === "1") {
			if (!(updateOwned && updateHandoff && await (await import("./update-managed-service-handoff-current-C4ksw-io.mjs")).isCurrentManagedServiceUpdateHandoffProcess({
				...updateHandoff,
				env: intentEnv
			}))) throw launchAgentStopError(serviceTarget, `Refusing to stop LaunchAgent ${label} from inside the same launchd service`);
		}
		assertNativeCurrent();
	};
	await assertStopCurrent();
	const initialPid = verifyLaunchAgentStopProbe(serviceTarget, await probeLaunchAgentState(serviceTarget, 5e3));
	const stoppingPids = new Set(initialPid === void 0 ? [] : [initialPid]);
	let clearIntent;
	let assertServingCurrent = assertNativeCurrent;
	let warning;
	try {
		if (updateOwned) {
			const command = await readLaunchAgentProgramArguments(serviceEnv, { requireEffective: true });
			assertNativeCurrent();
			if (!command) throw new GatewayRestartPreparationError("service-command");
			intentEnv = mergeGatewayServiceEnv(serviceEnv, command);
			await assertStopCurrent();
			const owner = readGatewayOwnerLease({
				env: intentEnv,
				current: true
			});
			const legacyLockPath = owner ? void 0 : resolveGatewayLockPaths(intentEnv).stateLockPath;
			const legacyLock = legacyLockPath ? readLockPayloadSync(legacyLockPath, true) : void 0;
			const legacyProcess = await prepareGatewayRestartIntentLegacyProcess({
				env: intentEnv,
				command,
				runtimePid: initialPid,
				readRuntime: () => readLaunchAgentRuntime(serviceEnv),
				assertCurrent: assertNativeCurrent
			});
			const currentProbe = await probeLaunchAgentState(serviceTarget, 5e3);
			await assertStopCurrent();
			if (verifyLaunchAgentStopProbe(serviceTarget, currentProbe) !== initialPid) throw new GatewayRestartPreparationError("serving-owner");
			const assertIntentCurrent = () => {
				assertNativeCurrent();
				if (legacyProcess && (!legacyLock || !legacyLockPath || !isPidAlive(legacyProcess.pid) || getFileLockProcessStartTime(legacyProcess.pid, intentEnv) !== legacyProcess.startTime || !isPidAlive(legacyLock.pid) || getFileLockProcessStartTime(legacyLock.pid, intentEnv) !== legacyLock.startTime || !isDeepStrictEqual(legacyLock, readLockPayloadSync(legacyLockPath, true)))) throw new GatewayRestartPreparationError("serving-owner");
				const currentOwner = readGatewayOwnerLease({
					env: intentEnv,
					current: true
				});
				if (currentOwner?.owner !== owner?.owner || currentOwner?.pid !== owner?.pid || currentOwner?.startedAt !== owner?.startedAt || currentOwner?.state !== owner?.state) throw new GatewayRestartPreparationError("serving-owner");
			};
			assertServingCurrent = assertIntentCurrent;
			writeGatewayServiceRestartIntentSync({
				env: intentEnv,
				service: {
					kind: "launchd",
					name: label
				},
				nativePid: initialPid,
				nativeStopped: currentProbe.state !== "running",
				legacyProcess,
				reason: "update.run",
				assertCurrent: assertIntentCurrent,
				onRecorded: (clear) => {
					clearIntent = clear;
				}
			});
			const servingPid = owner?.pid ?? legacyLock?.pid;
			if (servingPid !== void 0) stoppingPids.add(servingPid);
		}
		if (persistDisable) {
			await assertStopCurrent();
			assertServingCurrent();
			const disabled = await execLaunchctl(["disable", serviceTarget]);
			if (disabled.code === 0) reportMutation("disable");
			else warning = `launchctl disable failed; used bootout fallback without persisting disable: ${formatLaunchctlResultDetail(disabled)}`;
		}
		await assertStopCurrent();
		assertServingCurrent();
		const bootout = await execLaunchctl(["bootout", serviceTarget], LAUNCH_AGENT_STOP_TIMEOUT_MS);
		if (bootout.code !== 0 && !isLaunchctlNotLoaded(bootout)) throw launchAgentStopError(serviceTarget, `launchctl bootout failed: ${formatLaunchctlResultDetail(bootout)}`);
	} catch (error) {
		clearIntent?.();
		throw error;
	}
	reportMutation(persistDisable ? "disable-bootout" : "bootout");
	await waitForLaunchAgentUnloaded(serviceTarget, [...stoppingPids], assertCurrent, (pids) => {
		stdout.write(`${formatLine("Warning", `Waiting for Gateway PID ${pids.join(", ")} to exit and release its databases before continuing.`)}\n`);
	});
	if (warning) stdout.write(`${formatLine("Warning", warning)}\n`);
	await assertGatewayPortReleasedAfterStop(serviceEnv, assertStopCurrent);
	assertCurrent?.();
	stdout.write(`${formatLine(warning ? "Stopped LaunchAgent (degraded)" : "Stopped LaunchAgent", serviceTarget)}\n`);
}
async function parkCurrentLaunchAgentForMaintenance(params = {}) {
	const serviceEnv = params.env ?? process.env;
	const domain = resolveLaunchAgentGuiDomain();
	const label = resolveLaunchAgentLabel(serviceEnv);
	if (!await isCurrentProcessInsideLaunchdService(label)) return false;
	const serviceTarget = `${domain}/${label}`;
	const disable = await execLaunchctl(["disable", serviceTarget]);
	if (disable.code !== 0) throw new Error(`launchctl disable failed while parking ${serviceTarget}: ${formatLaunchctlResultDetail(disable)}`);
	const handoff = scheduleDetachedLaunchdMaintenancePark({
		env: serviceEnv,
		waitForPid: process.pid
	});
	const handoffError = !handoff.ok ? handoff.error : await handoff.value ? void 0 : "helper failed to spawn";
	if (handoffError) {
		const rollback = await execLaunchctl(["enable", serviceTarget]);
		const rollbackDetail = rollback.code === 0 ? "restored launchd enable state" : `launchctl enable rollback failed: ${formatLaunchctlResultDetail(rollback)}`;
		throw new Error(`launchd maintenance park handoff failed: ${handoffError}; ${rollbackDetail}`);
	}
	return true;
}
//#endregion
//#region src/daemon/launchd-update-jobs.ts
const OPENCLAW_UPDATE_LAUNCHD_LABEL_PREFIX = "ai.openclaw.update.";
const MANUAL_UPDATE_LAUNCHD_LABEL_PATTERN = /^ai\.openclaw\.manual-update\.\d+$/;
const OPENCLAW_PROFILE_UPDATE_LAUNCHD_LABEL_PATTERN = /^ai\.openclaw\.[A-Za-z0-9._-]+\.update\.[A-Za-z0-9._-]+$/;
const OPENCLAW_DIRECT_CLI_NAMES = /* @__PURE__ */ new Set(["openclaw", "openclaw.mjs"]);
const OPENCLAW_NODE_RUNTIME_NAMES = /* @__PURE__ */ new Set([
	"bun",
	"bun.exe",
	"node",
	"node.exe"
]);
function normalizeOpenClawUpdateLaunchdLabelCandidate(label) {
	if (typeof label !== "string") return null;
	const trimmed = label.trim();
	if (trimmed.startsWith(OPENCLAW_UPDATE_LAUNCHD_LABEL_PREFIX) || MANUAL_UPDATE_LAUNCHD_LABEL_PATTERN.test(trimmed)) return {
		label: trimmed,
		requiresMetadata: false
	};
	return OPENCLAW_PROFILE_UPDATE_LAUNCHD_LABEL_PATTERN.test(trimmed) ? {
		label: trimmed,
		requiresMetadata: true
	} : null;
}
function isCurrentGatewayLaunchdLabel(label, env) {
	if (label === resolveGatewayLaunchAgentLabel(env.OPENCLAW_PROFILE)) return true;
	if (env.OPENCLAW_SERVICE_MARKER?.trim() !== "openclaw" || env.OPENCLAW_SERVICE_KIND?.trim() !== "gateway") return false;
	const configuredLabel = env.OPENCLAW_LAUNCHD_LABEL?.trim();
	return Boolean(configuredLabel && label === configuredLabel);
}
function resolveCurrentOpenClawUpdateLaunchdJobLabel(env = process.env) {
	for (const label of [
		env.LAUNCH_JOB_LABEL,
		env.LAUNCH_JOB_NAME,
		env.XPC_SERVICE_NAME,
		env.OPENCLAW_LAUNCHD_LABEL
	]) {
		const candidate = normalizeOpenClawUpdateLaunchdLabelCandidate(label);
		if (candidate && !isCurrentGatewayLaunchdLabel(candidate.label, env)) return candidate;
	}
	return null;
}
function parseLaunchctlListOpenClawUpdateJobCandidates(output) {
	const jobs = [];
	for (const rawLine of output.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line) continue;
		const [pidRaw, statusRaw, ...labelParts] = line.split(/\s+/);
		const candidate = normalizeOpenClawUpdateLaunchdLabelCandidate(labelParts.join(" "));
		if (!candidate) continue;
		const pid = pidRaw === "-" ? void 0 : parseStrictPositiveInteger(pidRaw ?? "");
		const lastExitStatus = parseStrictInteger(statusRaw ?? "");
		jobs.push({
			label: candidate.label,
			requiresMetadata: candidate.requiresMetadata,
			...pid !== void 0 ? { pid } : {},
			...lastExitStatus !== void 0 ? { lastExitStatus } : {}
		});
	}
	return jobs.toSorted((a, b) => a.label.localeCompare(b.label));
}
function hasOpenClawUpdateLaunchdMarker(env) {
	return env?.OPENCLAW_UPDATE_RUN_HANDOFF?.trim() === "1";
}
function isOpenClawUpdateProgramArguments(programArguments) {
	if (!Array.isArray(programArguments) || programArguments.length === 0) return false;
	const updateIndex = programArguments.findIndex((arg) => arg.trim() === "update");
	if (updateIndex < 0 || !programArguments.slice(updateIndex + 1).includes("--yes")) return false;
	const executable = path.basename(programArguments[0] ?? "").toLowerCase();
	return (updateIndex === 1 ? OPENCLAW_DIRECT_CLI_NAMES.has(executable) : updateIndex === 2 && OPENCLAW_NODE_RUNTIME_NAMES.has(executable) && path.basename(programArguments[1] ?? "").toLowerCase() === "openclaw.mjs") && !programArguments.some((arg) => arg.trim() === "gateway");
}
async function isLaunchdJobConfirmedOpenClawUpdater(params) {
	const plistPath = resolveLaunchAgentPlistPathForLabel(params.env, params.label);
	const command = await readLaunchAgentProgramArgumentsFromFile(plistPath);
	return hasOpenClawUpdateLaunchdMarker(command?.environment) || isOpenClawUpdateProgramArguments(command?.programArguments);
}
async function findStaleOpenClawUpdateLaunchdJobs(env = process.env) {
	if (process.platform !== "darwin") return [];
	const result = await execLaunchctl(["list"]);
	if (result.code !== 0) return [];
	const jobs = [];
	for (const { requiresMetadata, ...job } of parseLaunchctlListOpenClawUpdateJobCandidates(result.stdout)) {
		if (isCurrentGatewayLaunchdLabel(job.label, env)) continue;
		if (requiresMetadata && !await isLaunchdJobConfirmedOpenClawUpdater({
			label: job.label,
			env
		})) continue;
		jobs.push(job);
	}
	return jobs;
}
async function disableCurrentOpenClawUpdateLaunchdJob(env = process.env) {
	const candidate = resolveCurrentOpenClawUpdateLaunchdJobLabel(env);
	if (!candidate || process.platform !== "darwin") return false;
	const trustCurrentEnvMarker = isCurrentProcessLaunchdServiceLabel(candidate.label, env);
	if (candidate.requiresMetadata && !(trustCurrentEnvMarker && hasOpenClawUpdateLaunchdMarker(env) || await isLaunchdJobConfirmedOpenClawUpdater({
		label: candidate.label,
		env
	}))) return false;
	const serviceTarget = `${resolveLaunchAgentGuiDomain()}/${assertValidLaunchAgentLabel(candidate.label)}`;
	return (await execLaunchctl(["disable", serviceTarget])).code === 0;
}
//#endregion
export { repairLaunchAgentBootstrap as a, installLaunchAgent as c, stopLaunchAgent as i, stageLaunchAgent as l, findStaleOpenClawUpdateLaunchdJobs as n, restartLaunchAgent as o, parkCurrentLaunchAgentForMaintenance as r, startLaunchAgent as s, disableCurrentOpenClawUpdateLaunchdJob as t, uninstallLaunchAgent as u };
