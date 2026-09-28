import { S as parseStrictInteger, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import "./constants-CJCmIHb-.mjs";
import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { n as parseTcpPort, r as parseTcpPortFromArgs } from "./tcp-port-BVV_ljmK.mjs";
import { r as ServiceInspectionError } from "./service-inspection-error-axo4k_qi.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-i3x9UrUR.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { s as readLaunchAgentProgramArgumentsFromFile } from "./launchd-plist-BNtNmL1p.mjs";
import { b as isLaunchctlNotLoaded, c as resolveLaunchAgentPlistPath, h as inspectSystemLaunchDaemonOwnership, m as formatSystemLaunchDaemonOwnershipSummary, s as resolveLaunchAgentEnvironmentReadOptions, v as execLaunchctl, x as launchctlInspectionReason, y as formatLaunchctlResultDetail } from "./launchd-service-files-Cv2FPjBf.mjs";
import { t as parseKeyValueOutput } from "./runtime-parse-jD-7AuMj.mjs";
import { n as mergeGatewayServiceEnv, t as resolveGatewayServiceProbeHosts } from "./gateway-service-probe-hosts-D3Br9aVM.mjs";
import fs from "node:fs/promises";
//#region src/daemon/launchd-runtime.ts
/** launchctl state parsing, inspection, and bootstrap primitives. */
async function readLaunchAgentProgramArguments(env, options) {
	const label = resolveLaunchAgentLabel(env);
	const command = await readLaunchAgentProgramArgumentsFromFile(resolveLaunchAgentPlistPath(env), {
		...resolveLaunchAgentEnvironmentReadOptions(env, label),
		...options
	});
	if (!command && options?.requireEffective) {
		const timeoutMs = options.timeoutMs && options.timeoutMs > 0 ? Math.min(options.timeoutMs, 5e3) : 5e3;
		const [probe, system] = await Promise.all([probeLaunchAgentState(`${resolveLaunchAgentGuiDomain()}/${label}`, timeoutMs).catch(() => null), inspectSystemLaunchDaemonOwnership(label, {
			timeoutMs,
			scanInstalledPlists: false
		})]);
		if (probe?.state !== "not-loaded") {
			const reason = system.status === "loaded" || system.status === "installed" ? "launchd-system-owned" : (system.status === "unverifiable" ? system.reason : void 0) ?? (probe?.state === "unknown" ? probe.inspectionReason : void 0);
			if (reason) throw new ServiceInspectionError(reason);
			throw new Error("Effective LaunchAgent service command could not be inspected.");
		}
	}
	return command;
}
const LAUNCH_AGENT_BOOTSTRAP_TEARDOWN_TIMEOUT_MS = 3e4;
const LAUNCH_AGENT_BOOTSTRAP_TEARDOWN_POLL_MS = 500;
async function resolveLaunchAgentGatewayContext(env) {
	const serviceKind = env.OPENCLAW_SERVICE_KIND?.trim();
	if (serviceKind && serviceKind !== "gateway") return {
		env,
		port: null,
		probeHosts: []
	};
	const command = await readLaunchAgentProgramArguments(env).catch(() => null);
	return {
		env: mergeGatewayServiceEnv(env, command),
		port: parseTcpPortFromArgs(command?.programArguments) ?? parseTcpPort(command?.environment?.OPENCLAW_GATEWAY_PORT ?? "") ?? parseTcpPort(env.OPENCLAW_GATEWAY_PORT ?? ""),
		probeHosts: await resolveGatewayServiceProbeHosts({
			env,
			command
		})
	};
}
function resolveLaunchAgentGuiDomain() {
	if (typeof process.getuid !== "function") return "gui/501";
	return `gui/${process.getuid()}`;
}
function formatLaunchAgentGuiSessionError(params) {
	return [
		`launchctl bootstrap failed: ${params.detail}`,
		`LaunchAgent ${params.actionHint} requires a logged-in macOS GUI session for this user (${params.domain}).`,
		"This usually means you are running from SSH/headless context or as the wrong user (including sudo).",
		`Fix: sign in to the macOS desktop as the target user and rerun \`${params.actionHint}\`.`,
		"For headless VM setups, enable auto-login for the target user so macOS creates the GUI session after boot.",
		"Headless deployments should use a dedicated logged-in user session or a custom LaunchDaemon (not shipped): https://docs.openclaw.ai/gateway"
	].join("\n");
}
async function bootstrapLaunchAgentOrThrow(params) {
	if (params.preserveAutoStart) {
		params.assertCurrent?.();
		const label = params.serviceTarget.slice(params.domain.length + 1);
		let enabled = params.preservedEnabled;
		if (enabled === void 0) {
			const state = await execLaunchctl(["print-disabled", params.domain]);
			if (state.code !== 0) throw new Error(`launchctl print-disabled failed: ${formatLaunchctlResultDetail(state)}`);
			enabled = parseLaunchAgentEnabled(state.stdout || state.stderr || "", label);
		}
		params.assertCurrent?.();
		if (!enabled) {
			const enable = await execLaunchctl(["enable", params.serviceTarget]);
			if (enable.code !== 0) throw new Error(`launchctl enable failed: ${formatLaunchctlResultDetail(enable)}`);
		}
		const [boot] = await Promise.allSettled([bootstrapLaunchAgentOrThrow({
			...params,
			preserveAutoStart: false,
			skipEnable: true
		})]);
		if (boot.status === "rejected" && hasCommandProcessCleanupError(boot.reason)) throw boot.reason;
		const failures = boot.status === "rejected" ? [boot.reason] : [];
		if (!enabled) try {
			params.assertCurrent?.();
			const disable = await execLaunchctl(["disable", params.serviceTarget]);
			if (disable.code !== 0) throw new Error(`LaunchAgent disabled policy could not be restored: ${formatLaunchctlResultDetail(disable)}`);
		} catch (error) {
			failures.push(error);
		}
		if (failures.length === 1) throw failures[0];
		if (failures.length > 1) throw new AggregateError(failures, "LaunchAgent bootstrap and disabled-policy restoration failed.");
		return;
	}
	if (!params.skipEnable) {
		params.assertCurrent?.();
		if ((await execLaunchctl(["enable", params.serviceTarget])).code === 0) params.onMutation?.("enable");
	}
	const teardownDeadline = Date.now() + LAUNCH_AGENT_BOOTSTRAP_TEARDOWN_TIMEOUT_MS;
	for (;;) {
		params.assertCurrent?.();
		const boot = await execLaunchctl([
			"bootstrap",
			params.domain,
			params.plistPath
		]);
		if (boot.code === 0) {
			params.onMutation?.("bootstrap");
			return;
		}
		const detail = (boot.stderr || boot.stdout).trim();
		if (isUnsupportedGuiDomain(detail)) throw new Error(formatLaunchAgentGuiSessionError({
			detail,
			domain: params.domain,
			actionHint: params.actionHint
		}));
		if (boot.termination === "exit" && isLaunchctlOperationAlreadyInProgress(detail)) {
			const state = await probeLaunchAgentState(params.serviceTarget);
			if (state.state === "running" || state.state === "stopped") {
				params.onMutation?.("bootstrap");
				return;
			}
		}
		const remainingMs = teardownDeadline - Date.now();
		if (!params.retryPendingTeardown || !isLaunchctlBootstrapPendingTeardown(boot) || remainingMs <= 0) throw new Error(`launchctl bootstrap failed: ${detail}`);
		await sleep(Math.min(LAUNCH_AGENT_BOOTSTRAP_TEARDOWN_POLL_MS, remainingMs));
	}
}
function parseLaunchctlPrint(output) {
	const entries = parseKeyValueOutput(output, "=");
	const info = {};
	const state = entries.state;
	if (state) info.state = state;
	const pidValue = entries.pid;
	if (pidValue) {
		const pid = parseStrictPositiveInteger(pidValue);
		if (pid !== void 0) info.pid = pid;
	}
	const exitStatusValue = entries["last exit status"];
	if (exitStatusValue) {
		const status = parseStrictInteger(exitStatusValue);
		if (status !== void 0) info.lastExitStatus = status;
	}
	const exitReason = entries["last exit reason"];
	if (exitReason) info.lastExitReason = exitReason;
	return info;
}
function parseLaunchAgentEnabled(output, label) {
	const labelPrefix = `"${label}"`;
	for (const line of output.split("\n")) {
		const entry = line.trim();
		if (!entry.startsWith(labelPrefix)) continue;
		const state = entry.slice(labelPrefix.length).trim();
		if (state === "=> enabled" || state === "=> false") return true;
		if (state === "=> disabled" || state === "=> true") return false;
		throw new Error(`launchctl print-disabled returned an unrecognized state for ${label}`);
	}
	return true;
}
async function isLaunchAgentEnabled(args) {
	const domain = resolveLaunchAgentGuiDomain();
	const label = resolveLaunchAgentLabel(args.env);
	const res = await execLaunchctl(["print-disabled", domain], args.timeoutMs);
	if (res.code !== 0) throw new Error(`launchctl print-disabled failed: ${formatLaunchctlResultDetail(res)}`);
	return parseLaunchAgentEnabled(res.stdout || res.stderr || "", label);
}
async function isLaunchAgentLoaded(args) {
	const probe = await probeLaunchAgentState(`${resolveLaunchAgentGuiDomain()}/${resolveLaunchAgentLabel(args.env)}`, args.timeoutMs);
	if (probe.state === "running" || probe.state === "stopped") return true;
	if (probe.state === "not-loaded") return false;
	if (probe.inspectionReason) throw new ServiceInspectionError(probe.inspectionReason);
	throw new Error(`launchctl print failed: ${probe.detail ?? "unknown error"}`);
}
async function launchAgentPlistExists(env) {
	try {
		const plistPath = resolveLaunchAgentPlistPath(env);
		await fs.access(plistPath);
		return true;
	} catch {
		return false;
	}
}
async function readLaunchAgentRuntime(env, opts) {
	const domain = resolveLaunchAgentGuiDomain();
	const label = resolveLaunchAgentLabel(env);
	const [probe, systemOwnership] = await Promise.all([probeLaunchAgentState(`${domain}/${label}`, opts?.timeoutMs), inspectSystemLaunchDaemonOwnership(label, {
		...opts,
		scanInstalledPlists: false
	})]);
	if (systemOwnership.status !== "absent") return {
		status: "unknown",
		detail: formatSystemLaunchDaemonOwnershipSummary(systemOwnership),
		inspectionReason: systemOwnership.status === "unverifiable" ? systemOwnership.reason : "launchd-system-owned",
		systemLaunchDaemon: {
			status: systemOwnership.status,
			serviceTarget: systemOwnership.serviceTarget,
			...systemOwnership.status === "installed" ? { plistPath: systemOwnership.plistPath } : {}
		}
	};
	if (probe.state === "not-loaded") return await launchAgentPlistExists(env) ? { status: "stopped" } : {
		status: "unknown",
		missingUnit: true
	};
	if (probe.state === "unknown") {
		const missingGuiSession = await launchAgentPlistExists(env) && isUnsupportedGuiDomain(probe.detail ?? "");
		return {
			status: "unknown",
			detail: probe.detail,
			inspectionReason: probe.inspectionReason,
			...missingGuiSession ? { missingGuiSession: true } : {}
		};
	}
	const parsed = probe.runtime;
	const plistExists = await launchAgentPlistExists(env);
	return {
		status: probe.state,
		state: parsed.state,
		pid: parsed.pid,
		lastExitStatus: parsed.lastExitStatus,
		lastExitReason: parsed.lastExitReason,
		cachedLabel: !plistExists
	};
}
function isLaunchctlAlreadyLoaded(res) {
	const detail = normalizeLowercaseStringOrEmpty(res.stderr || res.stdout);
	return res.termination === "exit" && (res.code === 130 || detail.includes("already exists in domain"));
}
function isUnsupportedGuiDomain(detail) {
	const normalized = normalizeLowercaseStringOrEmpty(detail);
	return normalized.includes("domain does not support specified action") || normalized.includes("could not find domain for user gui") || normalized.includes("bootstrap failed: 125");
}
function isLaunchctlOperationAlreadyInProgress(detail) {
	const normalized = normalizeLowercaseStringOrEmpty(detail);
	return normalized.includes("operation already in progress") || normalized.includes("bootstrap failed: 37");
}
function isLaunchctlBootstrapPendingTeardown(res) {
	if (res.termination !== "exit" || isLaunchctlAlreadyLoaded(res)) return false;
	const normalized = normalizeLowercaseStringOrEmpty(res.stderr || res.stdout);
	return normalized.includes("bootstrap failed: 5") || normalized.includes("input/output error");
}
async function probeLaunchAgentState(serviceTarget, timeoutMs) {
	const probe = await execLaunchctl(["print", serviceTarget], timeoutMs);
	if (probe.code !== 0) {
		if (isLaunchctlNotLoaded(probe)) return { state: "not-loaded" };
		return {
			state: "unknown",
			detail: formatLaunchctlResultDetail(probe) || void 0,
			inspectionReason: launchctlInspectionReason(probe, serviceTarget)
		};
	}
	const runtime = parseLaunchctlPrint(probe.stdout || probe.stderr || "");
	if (normalizeLowercaseStringOrEmpty(runtime.state) === "running" || typeof runtime.pid === "number" && runtime.pid > 1) return {
		state: "running",
		runtime
	};
	return {
		state: "stopped",
		runtime
	};
}
//#endregion
export { isLaunchctlAlreadyLoaded as a, parseLaunchAgentEnabled as c, readLaunchAgentProgramArguments as d, readLaunchAgentRuntime as f, isLaunchAgentLoaded as i, parseLaunchctlPrint as l, resolveLaunchAgentGuiDomain as m, formatLaunchAgentGuiSessionError as n, isUnsupportedGuiDomain as o, resolveLaunchAgentGatewayContext as p, isLaunchAgentEnabled as r, launchAgentPlistExists as s, bootstrapLaunchAgentOrThrow as t, probeLaunchAgentState as u };
