import { S as parseStrictInteger, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { l as resolveGatewayLaunchAgentLabel } from "./constants-CJCmIHb-.mjs";
import { i as isPidDefinitelyDead } from "./pid-alive-CXdZEzr_.mjs";
import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { t as resolveServiceManagerEnv } from "./service-process-env-B2RAsQsF.mjs";
import { r as getSelfAndAncestorPidsSync, t as cleanStaleGatewayProcessesSync } from "./restart-stale-pids-DjtzhbID.mjs";
import { n as resolveLaunchAgentLabel, t as assertValidLaunchAgentLabel } from "./launchd-label-i3x9UrUR.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { s as readLaunchAgentProgramArgumentsFromFile } from "./launchd-plist-BNtNmL1p.mjs";
import { c as withGatewayServiceInstallationRecovery, i as assertGatewayServiceUpdateCurrent, o as isUpdateOwnedGatewayServiceCommand } from "./service-update-authority-DujRnzx9.mjs";
import { b as isLaunchctlNotLoaded, c as resolveLaunchAgentPlistPath, d as writeLaunchAgentPlist, g as isSystemLaunchDaemonOwnershipError, i as readExistingLaunchAgentPlist, l as resolveLaunchAgentPlistPathForLabel, n as captureLaunchAgentInstallFiles, p as assertNoSystemLaunchDaemonOwnership, u as rewriteLaunchAgentPlistForRestart, v as execLaunchctl, y as formatLaunchctlResultDetail } from "./launchd-service-files-Cv2FPjBf.mjs";
import { n as normalizeWindowsPathSeparators, r as writeFormattedLines, t as formatLine } from "./output-EUQq_O0z.mjs";
import { t as resolveDaemonHomeDir } from "./paths-B1MX98Zs.mjs";
import { n as probePortUsage } from "./ports-probe-DxY7uEcU.mjs";
import { a as isLaunchctlAlreadyLoaded, f as readLaunchAgentRuntime, l as parseLaunchctlPrint, m as resolveLaunchAgentGuiDomain, o as isUnsupportedGuiDomain, p as resolveLaunchAgentGatewayContext, r as isLaunchAgentEnabled, t as bootstrapLaunchAgentOrThrow, u as probeLaunchAgentState } from "./launchd-runtime-D_XruxpZ.mjs";
import { r as formatPortDiagnostics } from "./ports-format-CGjX8vQM.mjs";
import { n as inspectPortUsage } from "./ports-inspect-DXXAw_y-.mjs";
import { n as scheduleDetachedLaunchdRestartHandoff, t as scheduleDetachedLaunchdMaintenancePark } from "./launchd-restart-handoff-_boJ24Gr.mjs";
import { t as createGatewayLifecycleMutationReporter } from "./service-mutation-BITjAaaK.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { spawnSync } from "node:child_process";
//#region src/daemon/launchd-current-service.ts
/** Detects launchd service membership from environment markers or process ancestry. */
function hasNativeLaunchdServiceLabel(label, env = process.env) {
	const currentLabels = [
		env.LAUNCH_JOB_LABEL,
		env.LAUNCH_JOB_NAME,
		env.XPC_SERVICE_NAME
	].flatMap((value) => {
		const normalized = normalizeOptionalString(value);
		return normalized ? [normalized] : [];
	});
	for (const currentLabel of currentLabels) if (currentLabel === label) return true;
	return false;
}
/** Environment hints for launchd identity; inherited markers do not prove ancestry. */
function isCurrentProcessLaunchdServiceLabel(label, env = process.env) {
	return hasNativeLaunchdServiceLabel(label, env) || hasOpenClawServiceMarker(label, env);
}
function hasOpenClawServiceMarker(label, env) {
	return normalizeOptionalString(env.OPENCLAW_LAUNCHD_LABEL) === label && normalizeOptionalString(env.OPENCLAW_SERVICE_MARKER) === "openclaw" && Boolean(normalizeOptionalString(env.OPENCLAW_SERVICE_KIND));
}
/**
* Native launchd labels are the fast path. OpenClaw markers can outlive the job
* in an external terminal, so reconcile them with the running job's ancestry.
* The detached update helper's recovery CLI inherits OPENCLAW_LAUNCHD_LABEL but
* descends from no running Gateway, so it stays on the synchronous path.
*/
async function isCurrentProcessInsideLaunchdService(label, env = process.env) {
	if (hasNativeLaunchdServiceLabel(label, env)) return true;
	const probe = await probeLaunchAgentState(`${resolveLaunchAgentGuiDomain()}/${label}`);
	if (probe.state === "running" && probe.runtime.pid !== void 0) {
		const ancestors = getSelfAndAncestorPidsSync();
		return ancestors.has(probe.runtime.pid) || hasOpenClawServiceMarker(label, env) && !ancestors.has(1);
	}
	return (probe.state === "unknown" || probe.state === "running") && hasOpenClawServiceMarker(label, env);
}
//#endregion
//#region src/daemon/launchd-stop.ts
/** LaunchAgent stop semantics and in-service maintenance parking. */
const LAUNCH_AGENT_STOP_PORT_RELEASE_TIMEOUT_MS = 2e4;
const LAUNCH_AGENT_STOP_PORT_RELEASE_POLL_MS = 100;
const LAUNCH_AGENT_STOP_TIMEOUT_MS = 3e4;
function launchAgentStopError(serviceTarget, detail) {
	return /* @__PURE__ */ new Error(`${detail}. Run \`launchctl bootout ${serviceTarget}\` from an external terminal in the service owner's logged-in macOS GUI session.`);
}
function verifyLaunchAgentStopProbe(serviceTarget, probe) {
	if (probe.state === "unknown") throw launchAgentStopError(serviceTarget, `launchctl print could not verify LaunchAgent stop: ${probe.detail ?? "unknown error"}`);
	if (probe.state !== "running") return;
	if (probe.runtime.pid === void 0) throw launchAgentStopError(serviceTarget, "launchctl print reported a running job without a PID");
	return probe.runtime.pid;
}
async function waitForLaunchAgentUnloaded(serviceTarget, initialPid, assertCurrent) {
	const pids = new Set(initialPid === void 0 ? [] : [initialPid]);
	const deadline = Date.now() + LAUNCH_AGENT_STOP_TIMEOUT_MS;
	for (;;) {
		const probe = await probeLaunchAgentState(serviceTarget, 5e3);
		assertCurrent?.();
		const observedPid = verifyLaunchAgentStopProbe(serviceTarget, probe);
		if (observedPid !== void 0) pids.add(observedPid);
		const alivePids = [...pids].filter((pid) => !isPidDefinitelyDead(pid));
		if (probe.state === "not-loaded" && alivePids.length === 0) return;
		if (Date.now() >= deadline) throw launchAgentStopError(serviceTarget, `LaunchAgent stop did not complete: ${serviceTarget} is ${probe.state === "not-loaded" ? "unloaded" : "still loaded"}${alivePids.length ? `; PID ${alivePids.join(", ")} is still alive` : ""}`);
		await sleep(Math.min(100, Math.max(0, deadline - Date.now())));
	}
}
async function waitForGatewayPortRelease(port, probeHosts) {
	const deadline = Date.now() + LAUNCH_AGENT_STOP_PORT_RELEASE_TIMEOUT_MS;
	while (Date.now() < deadline) {
		await sleep(Math.min(LAUNCH_AGENT_STOP_PORT_RELEASE_POLL_MS, deadline - Date.now()));
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
	const insideService = await isCurrentProcessInsideLaunchdService(label, process.env);
	const assertStopCurrent = async () => {
		if (insideService) {
			if (!(updateHandoff && await (await import("./update-managed-service-handoff-B8Mr7hKl.mjs")).isCurrentManagedServiceUpdateHandoffProcess(updateHandoff))) throw launchAgentStopError(serviceTarget, `Refusing to stop LaunchAgent ${label} from inside the same launchd service`);
		}
		assertCurrent?.();
	};
	await assertStopCurrent();
	const initialPid = verifyLaunchAgentStopProbe(serviceTarget, await probeLaunchAgentState(serviceTarget, 5e3));
	let warning;
	if (persistDisable) {
		await assertStopCurrent();
		const disabled = await execLaunchctl(["disable", serviceTarget]);
		if (disabled.code === 0) reportMutation("disable");
		else warning = `launchctl disable failed; used bootout fallback without persisting disable: ${formatLaunchctlResultDetail(disabled)}`;
	}
	await assertStopCurrent();
	const bootout = await execLaunchctl(["bootout", serviceTarget], LAUNCH_AGENT_STOP_TIMEOUT_MS);
	if (bootout.code !== 0 && !isLaunchctlNotLoaded(bootout)) throw launchAgentStopError(serviceTarget, `launchctl bootout failed: ${formatLaunchctlResultDetail(bootout)}`);
	reportMutation(persistDisable ? "disable-bootout" : "bootout");
	await waitForLaunchAgentUnloaded(serviceTarget, initialPid, assertCurrent);
	if (warning) stdout.write(`${formatLine("Warning", warning)}\n`);
	await assertGatewayPortReleasedAfterStop(serviceEnv, assertStopCurrent);
	assertCurrent?.();
	stdout.write(`${formatLine(warning ? "Stopped LaunchAgent (degraded)" : "Stopped LaunchAgent", serviceTarget)}\n`);
}
async function parkCurrentLaunchAgentForMaintenance(params = {}) {
	const serviceEnv = params.env ?? process.env;
	const domain = resolveLaunchAgentGuiDomain();
	const label = resolveLaunchAgentLabel(serviceEnv);
	if (!await isCurrentProcessInsideLaunchdService(label, process.env)) return false;
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
//#region src/daemon/launchd-install.ts
/** Transactional LaunchAgent installation, staging, rollback, and removal. */
async function uninstallLaunchAgent({ env, stdout }) {
	await assertExternalLaunchAgentMutation(env, "uninstall");
	const domain = resolveLaunchAgentGuiDomain();
	const label = resolveLaunchAgentLabel(env);
	const plistPath = resolveLaunchAgentPlistPath(env);
	if ((await probeLaunchAgentState(`${domain}/${label}`)).state !== "not-loaded") {
		const bootout = await execLaunchctl([
			"bootout",
			domain,
			plistPath
		]);
		if (bootout.code !== 0 && !isLaunchctlNotLoaded(bootout)) throw new Error(`launchctl bootout failed: ${formatLaunchctlResultDetail(bootout)}`);
	}
	try {
		await fs.lstat(plistPath);
	} catch (error) {
		if (error.code !== "ENOENT") throw createLaunchAgentRemovalError(error);
		stdout.write(`LaunchAgent not found at ${plistPath}\n`);
		return;
	}
	const home = normalizeWindowsPathSeparators(resolveDaemonHomeDir(env));
	const trashDir = path.posix.join(home, ".Trash");
	const dest = path.join(trashDir, `${label}.plist`);
	try {
		await fs.mkdir(trashDir, { recursive: true });
		await fs.rename(plistPath, dest);
		stdout.write(`${formatLine("Moved LaunchAgent to Trash", dest)}\n`);
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
async function currentGatewayLaunchAgentLabel(targetEnv) {
	const configuredCurrentLabel = process.env.OPENCLAW_LAUNCHD_LABEL?.trim();
	const candidates = /* @__PURE__ */ new Set([resolveLaunchAgentLabel(targetEnv), ...configuredCurrentLabel ? [assertValidLaunchAgentLabel(configuredCurrentLabel)] : []]);
	for (const label of candidates) if (await isCurrentProcessInsideLaunchdService(label, process.env)) return label;
}
async function assertExternalLaunchAgentMutation(env, action) {
	const currentLabel = await currentGatewayLaunchAgentLabel(env);
	if (!currentLabel) return;
	throw new Error(`Refusing to ${action} LaunchAgent ${resolveLaunchAgentLabel(env)} from inside ${currentLabel}; run this command from an external shell.`);
}
async function stageLaunchAgent({ stdout, ...args }) {
	const { plistPath, stdoutPath } = await writeLaunchAgentPlist({
		...args,
		stdout
	});
	writeFormattedLines(stdout, [{
		label: "Staged LaunchAgent",
		value: plistPath
	}, {
		label: "Logs",
		value: stdoutPath
	}], { leadingBlankLine: true });
	return { plistPath };
}
async function snapshotLaunchAgentLoadedState(plistContents, serviceTarget) {
	const probe = await probeLaunchAgentState(serviceTarget);
	if (probe.state === "unknown") throw new Error(`launchctl print could not determine whether ${serviceTarget} is loaded: ${probe.detail ?? "unknown error"}`);
	const loaded = probe.state !== "not-loaded";
	if (loaded && plistContents === null) throw new Error(`LaunchAgent ${serviceTarget} is loaded but its plist is missing; refusing an install that cannot restore the current definition if activation fails.`);
	return loaded;
}
async function deactivateLaunchAgentDefinition(domain, plistPath) {
	for (const args of [[
		"bootout",
		domain,
		plistPath
	], ["unload", plistPath]]) {
		assertGatewayServiceUpdateCurrent();
		const result = await execLaunchctl(args);
		assertGatewayServiceUpdateCurrent();
		if (result.code !== 0 && !isLaunchctlNotLoaded(result)) throw new Error(`launchctl ${args[0]} failed during LaunchAgent install: ${formatLaunchctlResultDetail(result)}`);
	}
}
async function installLaunchAgent(args) {
	const targetPlistPath = resolveLaunchAgentPlistPath(args.env);
	const label = resolveLaunchAgentLabel(args.env);
	const domain = resolveLaunchAgentGuiDomain();
	const serviceTarget = `${domain}/${label}`;
	const { publication, loaded, enabled } = await withGatewayServiceInstallationRecovery(async () => {
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
		return {
			publication: captured,
			loaded: await snapshotLaunchAgentLoadedState(previous?.contents ?? null, serviceTarget),
			enabled: wasEnabled
		};
	}, async () => false);
	let activationAttempted = false;
	const install = async () => {
		const published = await writeLaunchAgentPlist(args, publication.kind === "local" ? publication.files : void 0);
		await (publication.kind === "local" ? publication.files.assertCurrent() : publication.hooks.beforeWrite());
		await assertNoSystemLaunchDaemonOwnership(label);
		assertGatewayServiceUpdateCurrent();
		activationAttempted = true;
		if (loaded) await deactivateLaunchAgentDefinition(domain, published.plistPath);
		await bootstrapLaunchAgentOrThrow({
			domain,
			serviceTarget,
			plistPath: published.plistPath,
			actionHint: "openclaw gateway install --force",
			retryPendingTeardown: true,
			assertCurrent: assertGatewayServiceUpdateCurrent,
			preserveAutoStart: args.preserveAutoStart,
			preservedEnabled: enabled
		});
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
				const bootout = await execLaunchctl(["bootout", serviceTarget]);
				if (bootout.code !== 0 && !isLaunchctlNotLoaded(bootout)) throw new Error(`launchctl bootout failed: ${formatLaunchctlResultDetail(bootout)}`);
			}
		}
		const restored = await files.restore();
		if (activationAttempted && loaded) {
			await files.assertCurrent();
			await assertNoSystemLaunchDaemonOwnership(label);
			await bootstrapLaunchAgentOrThrow({
				domain,
				serviceTarget,
				plistPath: targetPlistPath,
				actionHint: "openclaw gateway start",
				retryPendingTeardown: true,
				assertCurrent: assertGatewayServiceUpdateCurrent,
				preserveAutoStart: args.preserveAutoStart,
				preservedEnabled: enabled
			});
		}
		return restored || activationAttempted;
	});
	writeFormattedLines(args.stdout, [{
		label: "Installed LaunchAgent",
		value: plistPath
	}, {
		label: "Logs",
		value: stdoutPath
	}], { leadingBlankLine: true });
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
	const pid = parseLaunchctlPrint(result.stdout || result.stderr || "").pid;
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
	await execLaunchctl(["enable", serviceTarget]);
	const boot = await execLaunchctl([
		"bootstrap",
		domain,
		plistPath
	]);
	let repairStatus = "repaired";
	if (boot.code !== 0) {
		const detail = (boot.stderr || boot.stdout).trim();
		if (isUnsupportedGuiDomain(detail)) return {
			ok: false,
			status: "gui-session-unavailable",
			detail,
			domain
		};
		if (!isLaunchctlAlreadyLoaded(boot)) return {
			ok: false,
			status: "bootstrap-failed",
			detail: detail || void 0
		};
		repairStatus = "already-loaded";
	}
	if (repairStatus === "repaired") return {
		ok: true,
		status: repairStatus
	};
	if ((await readLaunchAgentRuntime(env)).status === "running") return {
		ok: true,
		status: repairStatus
	};
	const kick = await execLaunchctl(["kickstart", serviceTarget]);
	if (kick.code !== 0) return {
		ok: false,
		status: "kickstart-failed",
		detail: (kick.stderr || kick.stdout).trim() || void 0
	};
	return {
		ok: true,
		status: repairStatus
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
	const probe = await execLaunchctl(["print", params.serviceTarget]);
	params.assertCurrent?.();
	if (probe.code === 0) return { loaded: true };
	try {
		await bootstrapLaunchAgentOrThrow({
			domain: params.domain,
			serviceTarget: params.serviceTarget,
			plistPath: params.plistPath,
			actionHint: "openclaw gateway start",
			onMutation: params.onMutation,
			assertCurrent: params.assertCurrent,
			retryPendingTeardown: params.retryPendingTeardown,
			preserveAutoStart: params.preserveAutoStart
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
function formatLaunchAgentLeftUnloadedError(params) {
	return [
		params.failure,
		`LaunchAgent ${params.serviceTarget} is not loaded and could not be restored: ${params.restoreDetail}`,
		"The gateway is down and launchd has no job left to respawn it.",
		`Fix: run \`openclaw gateway start\`, or \`launchctl bootstrap ${params.domain} ${params.plistPath}\`.`
	].join("\n");
}
async function rethrowLaunchAgentActivationFailure(params, error) {
	if (hasCommandProcessCleanupError(error)) throw error;
	const restored = await ensureLaunchAgentLoadedAfterFailure(params);
	const failure = error instanceof Error ? error.message : String(error);
	throw new Error(restored.loaded ? `${failure}\nLaunchAgent ${params.serviceTarget} is loaded; launchd can retry its KeepAlive job. Run openclaw gateway status --deep to inspect startup.` : formatLaunchAgentLeftUnloadedError({
		...params,
		failure,
		restoreDetail: restored.detail
	}), { cause: error });
}
async function needsLaunchAgentBootstrap(kickstart, serviceTarget, assertCurrent) {
	if (kickstart.code === 0 || isLaunchctlNotLoaded(kickstart)) return kickstart.code !== 0;
	assertCurrent?.();
	const observed = await probeLaunchAgentState(serviceTarget);
	assertCurrent?.();
	return observed.state === "not-loaded";
}
async function startLaunchAgent({ stdout, env, onMutation, assertCurrent, preserveAutoStart, preserveDefinition }) {
	const serviceEnv = env ?? process.env;
	const domain = resolveLaunchAgentGuiDomain();
	const label = resolveLaunchAgentLabel(serviceEnv);
	const plistPath = resolveLaunchAgentPlistPath(serviceEnv);
	const serviceTarget = `${domain}/${label}`;
	const reportMutation = createGatewayLifecycleMutationReporter(onMutation);
	await assertNoSystemLaunchDaemonOwnership(label);
	let enabled = false;
	if (!preserveAutoStart) {
		assertCurrent?.();
		enabled = (await execLaunchctl(["enable", serviceTarget])).code === 0;
		if (enabled) reportMutation("enable");
	}
	try {
		assertCurrent?.();
		let start = await execLaunchctl(["kickstart", serviceTarget]);
		if (await needsLaunchAgentBootstrap(start, serviceTarget, assertCurrent)) {
			await bootstrapLaunchAgentOrThrow({
				domain,
				serviceTarget,
				plistPath,
				actionHint: "openclaw gateway start",
				onMutation: reportMutation,
				skipEnable: enabled,
				preserveAutoStart,
				assertCurrent,
				retryPendingTeardown: preserveDefinition
			});
			assertCurrent?.();
			start = await execLaunchctl(["kickstart", serviceTarget]);
		}
		if (start.code !== 0) throw new Error(`launchctl kickstart failed: ${start.stderr || start.stdout}`.trim());
	} catch (error) {
		await rethrowLaunchAgentActivationFailure({
			domain,
			serviceTarget,
			plistPath,
			onMutation: reportMutation,
			assertCurrent,
			retryPendingTeardown: preserveDefinition,
			preserveAutoStart
		}, error);
	}
	reportMutation("kickstart");
	writeLaunchAgentActionLine(stdout, "Started LaunchAgent", serviceTarget);
}
async function restartLaunchAgent({ preserveDefinition, preserveAutoStart, stdout, env, warn, onMutation, assertCurrent }) {
	const serviceEnv = env ?? process.env;
	const domain = resolveLaunchAgentGuiDomain();
	const label = resolveLaunchAgentLabel(serviceEnv);
	const plistPath = resolveLaunchAgentPlistPath(serviceEnv);
	const serviceTarget = `${domain}/${label}`;
	const reportMutation = createGatewayLifecycleMutationReporter(onMutation);
	await assertNoSystemLaunchDaemonOwnership(label);
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
				const managedPid = (await readLaunchAgentRuntime(serviceEnv)).pid;
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
		reportMutation(plistReloadNeeded ? "handoff-reload" : "handoff-kickstart");
		writeLaunchAgentActionLine(stdout, "Scheduled LaunchAgent restart", serviceTarget);
		return { outcome: "scheduled" };
	}
	try {
		if (!preserveAutoStart) {
			assertCurrent?.();
			if ((await execLaunchctl(["enable", serviceTarget])).code === 0) reportMutation("enable");
		}
		if (plistReloadNeeded) {
			assertCurrent?.();
			const bootout = await execLaunchctl(["bootout", serviceTarget]);
			if (bootout.code !== 0 && !isLaunchctlNotLoaded(bootout)) throw new Error(`launchctl bootout failed: ${formatLaunchctlResultDetail(bootout)}`);
			if (bootout.code === 0) reportMutation("bootout");
			await bootstrapLaunchAgentOrThrow({
				domain,
				serviceTarget,
				plistPath,
				actionHint: "openclaw gateway restart",
				onMutation: reportMutation,
				assertCurrent,
				preserveAutoStart,
				retryPendingTeardown: true
			});
		} else {
			assertCurrent?.();
			const start = await execLaunchctl([
				"kickstart",
				"-k",
				serviceTarget
			]);
			if (start.code === 0) reportMutation("kickstart");
			else {
				if (!await needsLaunchAgentBootstrap(start, serviceTarget, assertCurrent)) throw new Error(`launchctl kickstart failed: ${start.stderr || start.stdout}`.trim());
				await bootstrapLaunchAgentOrThrow({
					domain,
					serviceTarget,
					plistPath,
					actionHint: "openclaw gateway restart",
					onMutation: reportMutation,
					assertCurrent,
					preserveAutoStart,
					retryPendingTeardown: preserveDefinition
				});
				if (preserveDefinition) {
					assertCurrent?.();
					const kick = await execLaunchctl(["kickstart", serviceTarget]);
					if (kick.code !== 0) throw new Error(`launchctl kickstart failed: ${kick.stderr || kick.stdout}`.trim());
					reportMutation("kickstart");
				}
			}
		}
	} catch (error) {
		await rethrowLaunchAgentActivationFailure({
			domain,
			serviceTarget,
			plistPath,
			onMutation: reportMutation,
			assertCurrent,
			preserveAutoStart,
			retryPendingTeardown: preserveDefinition || plistReloadNeeded
		}, error);
	}
	writeLaunchAgentActionLine(stdout, "Restarted LaunchAgent", serviceTarget);
	return { outcome: "completed" };
}
//#endregion
//#region src/daemon/launchd-update-jobs.ts
/** Discovery and shutdown of stale OpenClaw launchd updater jobs. */
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
const OPENCLAW_SCRIPT_NAMES = /* @__PURE__ */ new Set(["openclaw.mjs"]);
function normalizeOpenClawUpdateLaunchdLabel(label) {
	if (typeof label !== "string") return null;
	const trimmed = label.trim();
	if (trimmed.startsWith(OPENCLAW_UPDATE_LAUNCHD_LABEL_PREFIX)) return trimmed;
	return MANUAL_UPDATE_LAUNCHD_LABEL_PATTERN.test(trimmed) ? trimmed : null;
}
function normalizeOpenClawUpdateLaunchdLabelCandidate(label) {
	const normalized = normalizeOpenClawUpdateLaunchdLabel(label);
	if (normalized) return {
		label: normalized,
		requiresMetadata: false
	};
	if (typeof label !== "string") return null;
	const trimmed = label.trim();
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
		if (candidate) {
			if (isCurrentGatewayLaunchdLabel(candidate.label, env)) continue;
			return candidate;
		}
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
function isOpenClawUpdateCommandPrefix(programArguments, updateIndex) {
	if (updateIndex === 1) {
		const cliName = path.basename(programArguments[0] ?? "").toLowerCase();
		return OPENCLAW_DIRECT_CLI_NAMES.has(cliName);
	}
	if (updateIndex !== 2) return false;
	const runtimeName = path.basename(programArguments[0] ?? "").toLowerCase();
	const entryName = path.basename(programArguments[1] ?? "").toLowerCase();
	return OPENCLAW_NODE_RUNTIME_NAMES.has(runtimeName) && OPENCLAW_SCRIPT_NAMES.has(entryName);
}
function isOpenClawUpdateProgramArguments(programArguments) {
	if (!Array.isArray(programArguments) || programArguments.length === 0) return false;
	const updateIndex = programArguments.findIndex((arg) => arg.trim() === "update");
	if (updateIndex < 0 || !programArguments.slice(updateIndex + 1).includes("--yes")) return false;
	return isOpenClawUpdateCommandPrefix(programArguments, updateIndex) && !programArguments.some((arg) => arg.trim() === "gateway");
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
	for (const job of parseLaunchctlListOpenClawUpdateJobCandidates(result.stdout)) {
		if (isCurrentGatewayLaunchdLabel(job.label, env)) continue;
		if (job.requiresMetadata && !await isLaunchdJobConfirmedOpenClawUpdater({
			label: job.label,
			env
		})) continue;
		jobs.push({
			label: job.label,
			...job.pid !== void 0 ? { pid: job.pid } : {},
			...job.lastExitStatus !== void 0 ? { lastExitStatus: job.lastExitStatus } : {}
		});
	}
	return jobs;
}
async function disableOpenClawUpdateLaunchdJobCandidate(params) {
	if (process.platform !== "darwin") return false;
	if (params.candidate.requiresMetadata && !(params.trustCurrentEnvMarker && hasOpenClawUpdateLaunchdMarker(params.env) || await isLaunchdJobConfirmedOpenClawUpdater({
		label: params.candidate.label,
		env: params.env
	}))) return false;
	const serviceTarget = `${resolveLaunchAgentGuiDomain()}/${assertValidLaunchAgentLabel(params.candidate.label)}`;
	return (await execLaunchctl(["disable", serviceTarget])).code === 0;
}
async function disableCurrentOpenClawUpdateLaunchdJob(env = process.env) {
	const candidate = resolveCurrentOpenClawUpdateLaunchdJobLabel(env);
	if (!candidate) return false;
	return await disableOpenClawUpdateLaunchdJobCandidate({
		candidate,
		env,
		trustCurrentEnvMarker: isCurrentProcessLaunchdServiceLabel(candidate.label, env)
	});
}
//#endregion
export { startLaunchAgent as a, uninstallLaunchAgent as c, restartLaunchAgent as i, parkCurrentLaunchAgentForMaintenance as l, findStaleOpenClawUpdateLaunchdJobs as n, installLaunchAgent as o, repairLaunchAgentBootstrap as r, stageLaunchAgent as s, disableCurrentOpenClawUpdateLaunchdJob as t, stopLaunchAgent as u };
