import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { S as parseStrictInteger, w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import "./constants-BLghGsId.mjs";
import { l as isStringRecord } from "./record-coerce-TIsquoVR.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { n as parseTcpPort, r as parseTcpPortFromArgs } from "./tcp-port-8uSpDbMY.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { r as ServiceInspectionError } from "./service-inspection-error-Bsltcpi4.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-CDVrpZuO.mjs";
import { t as mergeGatewayServiceEnv } from "./service-env-merge-BU8q8IlG.mjs";
import { t as resolveGatewayServiceProbeHosts } from "./gateway-service-probe-hosts-Do5e95pf.mjs";
import { b as isLaunchctlNotLoaded, c as resolveLaunchAgentPlistPath, h as inspectSystemLaunchDaemonOwnership, m as formatSystemLaunchDaemonOwnershipSummary, s as resolveLaunchAgentEnvironmentReadOptions, v as execLaunchctl, x as launchctlInspectionReason, y as formatLaunchctlResultDetail } from "./launchd-service-files-BNJoYP-S.mjs";
import { c as resolveGeneratedEnvWrapperLayout, i as decodeLaunchdPlistMetadata, l as resolveLaunchAgentProgramArguments, s as readLaunchAgentProgramArgumentsFromFile } from "./launchd-plist-zSdg3_Ip.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
//#region src/daemon/launchd-runtime.ts
/** launchctl state parsing, inspection, and bootstrap primitives. */
/** Parse only the selected job's root fields; nested jobs and environments are not its identity. */
function parseLaunchctlJob(output, serviceTarget) {
	if (!output.startsWith(`${serviceTarget} = {\n`)) throw new Error(`Cannot parse launchd job ${serviceTarget}`);
	const fields = /* @__PURE__ */ new Map();
	for (const [, name, value] of output.matchAll(/^\t([^\t\n=]+) = (.+)$/gm)) {
		if (fields.has(name)) throw new Error(`Duplicate launchd job field ${name}`);
		fields.set(name, value);
	}
	const block = (name) => output.match(new RegExp(`^\\t${name} = \\{\\n([\\s\\S]*?)^\\t\\}`, "m"))?.[1];
	const runtime = {};
	const state = fields.get("state")?.trim();
	if (state) runtime.state = state;
	const pid = parseStrictPositiveInteger(fields.get("pid"));
	if (pid !== void 0) runtime.pid = pid;
	const status = parseStrictInteger(fields.get("last exit status"));
	if (status !== void 0) runtime.lastExitStatus = status;
	const exitReason = fields.get("last exit reason")?.trim();
	if (exitReason) runtime.lastExitReason = exitReason;
	return {
		fields,
		runtime,
		arguments: block("arguments")?.split("\n").filter((line) => line.startsWith("		")).map((line) => line.slice(2)),
		environment: block("environment") ?? "",
		environmentBlocks: [...output.matchAll(/^\t(?:inherited |default )?environment = \{\n([\s\S]*?)^\t\}/gm)].map((match) => match[1] ?? "").join("\n")
	};
}
/** Observe the discovered job's loaded command and runtime without granting lifecycle authority. */
async function readLoadedLaunchAgentState(env, options = {}) {
	const label = resolveLaunchAgentLabel(env);
	const expectedPath = options.plistPath ?? resolveLaunchAgentPlistPath(env);
	const target = `${path.dirname(expectedPath) === "/Library/LaunchDaemons" ? "system" : resolveLaunchAgentGuiDomain()}/${label}`;
	const result = await execLaunchctl(["print", target], options.timeoutMs ?? 5e3);
	const empty = {
		installed: false,
		loadState: { status: "not-loaded" },
		running: false,
		env,
		command: null,
		runtime: { status: "stopped" }
	};
	if (isLaunchctlNotLoaded(result)) return empty;
	if (result.code !== 0) throw new Error(`Cannot inspect launchd job ${target}: ${formatLaunchctlResultDetail(result)}`);
	const job = parseLaunchctlJob(result.stdout, target);
	const sourcePath = job.fields.get("path");
	if (!sourcePath || !path.isAbsolute(sourcePath)) throw new Error("Loaded LaunchAgent definition path is unavailable.");
	const program = job.fields.get("program");
	if (!program || !path.isAbsolute(program) || !job.arguments?.length) throw new Error("Loaded LaunchAgent command is unavailable.");
	const args = [program, ...job.arguments.slice(1)];
	const layout = resolveGeneratedEnvWrapperLayout(args, resolveLaunchAgentEnvironmentReadOptions(env, label));
	const environment = {};
	for (const line of job.environment.split("\n").filter(Boolean)) {
		const match = /^\t\t([A-Za-z_][A-Za-z0-9_]*) => (.*)$/.exec(line);
		if (!match || Object.hasOwn(environment, match[1])) throw new Error("Loaded LaunchAgent environment is unavailable.");
		environment[match[1]] = match[2];
	}
	const command = {
		programArguments: layout ? args.slice(layout.commandStartIndex) : args,
		...job.fields.get("working directory") ? { workingDirectory: job.fields.get("working directory") } : {},
		...Object.keys(environment).length ? { environment } : {},
		sourcePath
	};
	const parsed = job.runtime;
	const running = parsed.state === "running" || parsed.pid !== void 0 && parsed.pid > 1;
	return {
		installed: true,
		loadState: { status: "loaded" },
		running,
		env: mergeGatewayServiceEnv(env, command),
		command,
		runtime: {
			...parsed,
			status: running ? "running" : "stopped"
		},
		launchAgent: {
			target,
			sourcePath,
			program,
			programArguments: job.arguments,
			workingDirectory: command.workingDirectory,
			environment
		}
	};
}
/** A selected package no-restart exemption still requires its current, unchanged definition. */
async function readCorrespondingLaunchAgentCommand(env, observation, timeoutMs) {
	const label = resolveLaunchAgentLabel(env);
	const plistPath = resolveLaunchAgentPlistPath(env);
	if (observation.target !== `${resolveLaunchAgentGuiDomain()}/${label}` || path.resolve(observation.sourcePath) !== path.resolve(plistPath)) return null;
	const plist = await decodeLaunchdPlistMetadata(await fs.readFile(plistPath), timeoutMs);
	const args = plist?.ProgramArguments;
	const environment = plist?.EnvironmentVariables ?? {};
	if (!Array.isArray(args) || !args.every((arg) => typeof arg === "string") || !isStringRecord(environment) || (plist?.Program ?? args[0]) !== observation.program) return null;
	const loadedEnvironment = { ...observation.environment };
	if (!Object.hasOwn(environment, "XPC_SERVICE_NAME") && loadedEnvironment.XPC_SERVICE_NAME === label) delete loadedEnvironment.XPC_SERVICE_NAME;
	if (!Object.hasOwn(environment, "OSLogRateLimit")) delete loadedEnvironment.OSLogRateLimit;
	if (!isDeepStrictEqual(args, observation.programArguments) || (plist?.WorkingDirectory || void 0) !== observation.workingDirectory || !isDeepStrictEqual(environment, loadedEnvironment)) return null;
	return resolveLaunchAgentProgramArguments(plist, plistPath, {
		...resolveLaunchAgentEnvironmentReadOptions(env, label),
		requireEffective: true,
		timeoutMs
	});
}
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
		if (boot.status === "rejected") throw boot.reason;
		return boot.value;
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
			return "bootstrapped";
		}
		const detail = (boot.stderr || boot.stdout).trim();
		if (isUnsupportedGuiDomain(detail)) throw new Error(formatLaunchAgentGuiSessionError({
			detail,
			domain: params.domain,
			actionHint: params.actionHint
		}), { cause: boot });
		if (boot.termination === "exit" && isLaunchctlOperationAlreadyInProgress(detail)) {
			const state = await probeLaunchAgentState(params.serviceTarget);
			if (state.state === "running" || state.state === "stopped") {
				params.onMutation?.("bootstrap");
				return "already-loaded";
			}
		}
		const remainingMs = teardownDeadline - Date.now();
		if (!params.retryPendingTeardown || !isLaunchctlBootstrapPendingTeardown(boot) || remainingMs <= 0) throw new Error(`launchctl bootstrap failed: ${detail}`, { cause: boot });
		await sleep(Math.min(LAUNCH_AGENT_BOOTSTRAP_TEARDOWN_POLL_MS, remainingMs));
	}
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
	const plistExists = await launchAgentPlistExists(env);
	if (probe.state === "not-loaded") return plistExists ? { status: "stopped" } : {
		status: "unknown",
		missingUnit: true
	};
	if (probe.state === "unknown") {
		const missingGuiSession = plistExists && isUnsupportedGuiDomain(probe.detail ?? "");
		return {
			status: "unknown",
			detail: probe.detail,
			inspectionReason: probe.inspectionReason,
			...missingGuiSession ? { missingGuiSession: true } : {}
		};
	}
	const parsed = probe.runtime;
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
	try {
		const { runtime } = parseLaunchctlJob(probe.stdout || probe.stderr || "", serviceTarget);
		return {
			state: normalizeLowercaseStringOrEmpty(runtime.state) === "running" || typeof runtime.pid === "number" && runtime.pid > 1 ? "running" : "stopped",
			runtime
		};
	} catch (error) {
		return {
			state: "unknown",
			detail: formatErrorMessage(error)
		};
	}
}
//#endregion
export { isLaunchctlAlreadyLoaded as a, parseLaunchAgentEnabled as c, readCorrespondingLaunchAgentCommand as d, readLaunchAgentProgramArguments as f, resolveLaunchAgentGuiDomain as g, resolveLaunchAgentGatewayContext as h, isLaunchAgentLoaded as i, parseLaunchctlJob as l, readLoadedLaunchAgentState as m, formatLaunchAgentGuiSessionError as n, isUnsupportedGuiDomain as o, readLaunchAgentRuntime as p, isLaunchAgentEnabled as r, launchAgentPlistExists as s, bootstrapLaunchAgentOrThrow as t, probeLaunchAgentState as u };
