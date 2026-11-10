import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { u as resolveGatewayLaunchAgentLabel } from "./constants-BLghGsId.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { n as parseTcpPort } from "./tcp-port-B-4SirsX.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { p as resolveInlineCommandMatch } from "./shell-inline-command-DKNYBguD.mjs";
import { n as POSIX_SHELL_WRAPPERS } from "./shell-wrapper-resolution-kxOrsoTv.mjs";
import { n as GATEWAY_SERVICE_STOP_TIMEOUT_MS } from "./gateway-shutdown-budget-Drh-C246.mjs";
import "./gateway-shutdown-budget-c8dOC7fR.mjs";
import { o as resolveManagedGatewayServiceCommand } from "./service-types-CPk6CBn6.mjs";
import { f as withServiceInspectionBudget } from "./service-update-authority-Ddw1lcTH.mjs";
import { n as resolveGatewayStateDir } from "./paths-CPHiohZf.mjs";
import { C as SYSTEMD_DEFAULT_STOP_TIMEOUT_MS, I as execSystemctlUser, b as splitSystemdLogicalLines, c as resolveSystemdServiceName, d as SYSTEMD_FIXED_POLICY, l as resolveSystemdUnitPath, p as parseSystemdEnvAssignments, s as resolveSystemdEnvironmentFilePath, w as parseSystemdTimeSpanMs, y as renderSystemdEnvironmentFile } from "./systemd-service-files-C3V-PDoO.mjs";
import { i as resolveGatewayLogPaths, o as resolveGatewaySupervisorLogPaths } from "./restart-logs-BvcN3lrf.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-DxyNaz_g.mjs";
import { i as readExistingLaunchAgentPlist, l as resolveLaunchAgentPlistPath, o as resolveLaunchAgentEnvFilePath, r as isGeneratedLaunchAgentEnvironmentWrapper, s as resolveLaunchAgentEnvWrapperPath, t as buildLaunchAgentEnvironmentWrapper } from "./launchd-service-files-CqGEulnB.mjs";
import { i as decodeLaunchdPlistMetadata, n as LAUNCH_AGENT_POLICY } from "./launchd-plist-D6ncxWm8.mjs";
import { h as normalizeServicePathEntry, p as isNonMinimalServicePathEntry } from "./runtime-paths-v6m7qRRF.mjs";
import { n as collectInlineManagedServiceEnvKeys, o as hasInlineEnvironmentSource, r as collectInlineServiceEnvKeys, s as isEnvironmentFileOnlySource, u as readEnvironmentValueSource } from "./service-managed-env-DYJlKrdm.mjs";
import { t as parseKeyValueOutput } from "./runtime-parse-CUlWcrjY.mjs";
import { a as serviceDefinitionUnknown, i as serviceDefinitionPreserved, n as auditGatewayInstallPreservation, r as isInstallerServiceDescription, t as auditScheduledTaskDefinition } from "./service-audit-schtasks-yEV3f--E.mjs";
import { i as getMinimalServicePathPartsFromEnv, t as SERVICE_PROXY_ENV_KEYS } from "./service-env-DDchOnF1.mjs";
import { n as auditGatewayRuntime, t as SERVICE_RUNTIME_AUDIT_CODES } from "./service-audit-runtime-B2e_j4V7.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/daemon/service-audit-launchd.ts
function isRetiredLaunchAgentCommand(value, env) {
	if (!Array.isArray(value) || !value.every((arg) => typeof arg === "string")) return false;
	const label = resolveLaunchAgentLabel(env);
	const wrapperPath = resolveLaunchAgentEnvWrapperPath(env, label);
	const wrapperIndex = value[0] === "/bin/sh" ? 1 : 0;
	const wrapped = value[wrapperIndex] === wrapperPath;
	if (wrapped && value[wrapperIndex + 1] !== resolveLaunchAgentEnvFilePath(env, label)) return false;
	const args = wrapped ? value.slice(wrapperIndex + 2) : value;
	if (!/\/(node|bun)$/u.test(args[0] ?? "")) return false;
	let entry = 1;
	if (/^--max-old-space-size=\d+$/u.test(args[entry] ?? "") || args[entry] === "--no-install") entry++;
	if (!/^\/.*\/(?:index|entry)\.(?:cjs|mjs|js)$/u.test(args[entry] ?? "")) return false;
	const command = args.slice(entry + 1);
	return command[0] === "gateway" && (command.length === 1 || command[1] === "--port" && /^\d+$/u.test(command[2] ?? "") && (command.length === 3 || command.length === 4 && command[3] === "--allow-unconfigured"));
}
/** Native decoding keeps XML and binary plists on the same read-only audit path. */
async function auditLaunchdDefinition(env, issues, findings, timeoutMs, inspectRewrite = false) {
	const sourcePath = resolveLaunchAgentPlistPath(env);
	const content = (await readExistingLaunchAgentPlist(sourcePath))?.contents ?? null;
	if (content === null) return;
	const text = content.toString("utf8");
	for (const [key, code] of [["RunAtLoad", "launchd-run-at-load"], ["KeepAlive", "launchd-keep-alive"]]) if (!new RegExp(`<key>${key}</key>\\s*<true\\s*/>`, "i").test(text)) issues.push({
		code,
		message: `LaunchAgent is missing ${key}=true`,
		detail: sourcePath,
		level: "recommended"
	});
	const installed = await decodeLaunchdPlistMetadata(content, timeoutMs);
	if (!installed) throw new Error("LaunchAgent definition could not be decoded.");
	const wrapperPath = resolveLaunchAgentEnvWrapperPath(env, resolveLaunchAgentLabel(env));
	const args = installed.ProgramArguments;
	const wrapperIndex = Array.isArray(args) && args[0] === "/bin/sh" ? 1 : 0;
	if (Array.isArray(args) && args[wrapperIndex] === wrapperPath && args[wrapperIndex + 1] !== resolveLaunchAgentEnvFilePath(env, resolveLaunchAgentLabel(env))) issues.push({
		code: "launchd-env-file-argument",
		message: "LaunchAgent environment-file argument is missing or invalid. Run openclaw gateway install --force to repair the service.",
		detail: sourcePath,
		level: "recommended"
	});
	const wrapper = (await readExistingLaunchAgentPlist(wrapperPath))?.contents.toString("utf8");
	if (wrapper !== void 0 && isGeneratedLaunchAgentEnvironmentWrapper(wrapper) && wrapper !== buildLaunchAgentEnvironmentWrapper()) {
		issues.push({
			code: "launchd-env-wrapper-outdated",
			message: "LaunchAgent environment wrapper needs validation; reinstall the Gateway service.",
			level: "recommended"
		});
		findings.push({
			kind: "outdated",
			key: "EnvironmentWrapper",
			current: "legacy",
			expected: "validated",
			sourcePath: wrapperPath,
			message: "LaunchAgent environment wrapper lacks environment-file validation."
		});
	}
	if (inspectRewrite) {
		if (!isInstallerServiceDescription(installed.Comment, env)) findings.push(serviceDefinitionUnknown("Comment", "The installer would replace custom service metadata.", sourcePath));
		if (wrapper !== void 0 && !isGeneratedLaunchAgentEnvironmentWrapper(wrapper)) findings.push(serviceDefinitionUnknown("EnvironmentWrapper", "The generated wrapper contains unrecognized behavior.", wrapperPath));
	}
	const { stdoutPath } = resolveGatewaySupervisorLogPaths(env);
	const expected = {
		...LAUNCH_AGENT_POLICY,
		Label: resolveLaunchAgentLabel(env),
		StandardOutPath: stdoutPath,
		StandardErrorPath: stdoutPath
	};
	const preserved = /* @__PURE__ */ new Set([
		"ProgramArguments",
		"WorkingDirectory",
		"EnvironmentVariables",
		"Comment"
	]);
	const legacyLogs = resolveGatewayLogPaths(env);
	const released = {
		ThrottleInterval: [60, 1],
		StandardOutPath: [legacyLogs.stdoutPath],
		StandardErrorPath: [legacyLogs.stderrPath, "/dev/null"]
	};
	const retiredTemplate = installed.Label === resolveGatewayLaunchAgentLabel(env.OPENCLAW_PROFILE) && isInstallerServiceDescription(installed.Comment, env) && isRetiredLaunchAgentCommand(installed.ProgramArguments, env) && (installed.WorkingDirectory === void 0 || installed.WorkingDirectory === resolveGatewayStateDir(env)) && Object.keys(installed).every((key) => Object.hasOwn(expected, key) || preserved.has(key)) && Object.entries(expected).every(([key, value]) => key === "ExitTimeOut" || installed[key] === value || released[key]?.some((legacy) => installed[key] === legacy));
	if (retiredTemplate) released.ExitTimeOut = [20];
	const customizedTimeout = installed.ExitTimeOut === 20 && !retiredTemplate;
	const timeoutMessage = customizedTimeout ? `Stop timeout 20 s is below the 330 s drain budget; not changed because the definition is customized.` : `ExitTimeOut=330 or longer is required for the Gateway drain and final cleanup; the loaded launchd job may enforce a shorter deadline.`;
	const exitTimeout = installed.ExitTimeOut ?? 20;
	if (typeof exitTimeout === "number" && exitTimeout > 0 && exitTimeout < 330) issues.push({
		code: "launchd-stop-timeout",
		message: timeoutMessage,
		detail: `${sourcePath}: ${exitTimeout}s`,
		level: "recommended"
	});
	for (const key of /* @__PURE__ */ new Set([...Object.keys(installed), ...Object.keys(expected)])) {
		if (preserved.has(key) || installed[key] === expected[key]) continue;
		const current = installed[key];
		const value = expected[key];
		if (value !== void 0 && key !== "Label" && (current === void 0 || (typeof current === "string" || typeof current === "number") && released[key]?.includes(current))) findings.push({
			kind: "outdated",
			key,
			current: current ?? null,
			expected: value,
			sourcePath,
			message: `LaunchAgent ${key} differs from the installer value ${String(value)}.`
		});
		else if (value !== void 0 && key !== "Label") {
			const finding = serviceDefinitionPreserved(key, sourcePath);
			if (key === "ExitTimeOut" && customizedTimeout) finding.message = timeoutMessage;
			findings.push(finding);
		} else findings.push({
			kind: "unknown-edit",
			key,
			sourcePath,
			reason: "The key or value is not a recognized installer setting.",
			message: `LaunchAgent ${key} contains an unrecognized setting.`
		});
	}
}
//#endregion
//#region src/daemon/service-audit-systemd.ts
/** Audits effective systemd service settings and managed unit backups. */
const SYSTEMD_SERVICE_AUDIT_CODES = {
	systemdAfterNetworkOnline: "systemd-after-network-online",
	systemdRestartSec: "systemd-restart-sec",
	systemdWantsNetworkOnline: "systemd-wants-network-online",
	systemdKillModeProcessOrNone: "systemd-kill-mode-process-or-none",
	systemdKillModeControlGroup: "systemd-kill-mode-control-group",
	systemdUnitBackupUnsafe: "systemd-unit-backup-unsafe",
	systemdStopTimeout: "systemd-stop-timeout"
};
const SYSTEMD_AUDIT_TIMEOUT_MS = 1e4;
function readUnitDirectives(content) {
	const directives = [];
	let section = "";
	for (const raw of splitSystemdLogicalLines(content)) {
		const line = raw.trim();
		if (!line || /^[#;]/u.test(line)) continue;
		if (line.startsWith("[")) {
			section = line;
			continue;
		}
		const separator = line.indexOf("=");
		const key = separator > 0 ? line.slice(0, separator).trim() : "unsupported syntax";
		directives.push({
			section,
			key,
			value: line.slice(separator + 1).trim()
		});
	}
	return directives;
}
function parseSystemdUnit(directives) {
	const after = /* @__PURE__ */ new Set();
	const wants = /* @__PURE__ */ new Set();
	let restartSec;
	let killMode;
	let stopTimeoutMs = SYSTEMD_DEFAULT_STOP_TIMEOUT_MS;
	for (const { section, key, value } of directives) {
		if (key === "TimeoutStopSec" && section === "[Service]") {
			const parsed = parseSystemdTimeSpanMs(value);
			if (!value) stopTimeoutMs = SYSTEMD_DEFAULT_STOP_TIMEOUT_MS;
			else if (parsed !== void 0) stopTimeoutMs = parsed === 0 ? Infinity : parsed;
		}
		if (!value) continue;
		if (key === "After" || key === "Wants") {
			const dependencies = key === "After" ? after : wants;
			for (const entry of value.split(/\s+/)) if (entry) dependencies.add(entry);
		} else if (key === "RestartSec") restartSec = value;
		else if (key === "KillMode") killMode = value;
	}
	return {
		after,
		wants,
		restartSec,
		killMode,
		stopTimeoutMs
	};
}
function isRestartSecPreferred(value) {
	if (!value) return false;
	const parsed = parseSystemdTimeSpanMs(value);
	if (parsed === void 0) return false;
	return Math.abs(parsed - 5e3) < 10;
}
async function auditSystemdUnit(env, issues, timeoutMs, command, definitionDrift, inspectRewrite = false) {
	const unitPath = resolveSystemdUnitPath(env);
	let definitionDriftError = definitionDrift && command?.sourcePath && path.resolve(command.sourcePath) !== path.resolve(unitPath) ? "Systemd definition inspection skipped: the selected service is outside the managed user-unit path." : void 0;
	await auditSystemdUnitBackup(unitPath, issues);
	let content;
	try {
		content = await fs.readFile(unitPath, "utf8");
	} catch (error) {
		return definitionDriftError ?? (definitionDrift && (command || !hasErrnoCode(error, "ENOENT")) ? "Systemd definition inspection could not be completed." : void 0);
	}
	const directives = readUnitDirectives(content);
	if (definitionDrift && !definitionDriftError) try {
		await auditSystemdDefinition(env, unitPath, directives, command, definitionDrift, inspectRewrite);
		if (!command?.definitionPaths?.length || command.reloadPending) definitionDriftError = "Systemd drop-in paths could not be fully inspected or a daemon reload is pending; definition audit is incomplete.";
	} catch {
		definitionDriftError = "Systemd definition and drop-in inspection could not be completed.";
	}
	const manager = await withServiceInspectionBudget(() => execSystemctlUser(env, [
		"show",
		`${resolveSystemdServiceName(env)}.service`,
		"--no-page",
		"--property",
		"After,Wants,RestartUSec,KillMode,LoadState,TimeoutStopUSec"
	], timeoutMs && timeoutMs > 0 ? timeoutMs : SYSTEMD_AUDIT_TIMEOUT_MS));
	const entries = manager.code === 0 ? parseKeyValueOutput(manager.stdout, "=") : void 0;
	const loadState = normalizeLowercaseStringOrEmpty(entries?.loadstate);
	if (loadState && loadState !== "loaded") return definitionDriftError;
	const parsed = entries ? {
		after: new Set(entries.after?.split(/\s+/).filter(Boolean)),
		wants: new Set(entries.wants?.split(/\s+/).filter(Boolean)),
		restartSec: entries.restartusec,
		killMode: entries.killmode,
		stopTimeoutMs: parseSystemdTimeSpanMs(entries.timeoutstopusec ?? "") ?? 9e4
	} : parseSystemdUnit(directives);
	const report = (code, message, detail = unitPath) => {
		issues.push({
			code,
			message,
			detail,
			level: "recommended"
		});
	};
	if (parsed.stopTimeoutMs > 0 && parsed.stopTimeoutMs < 33e4) report(SYSTEMD_SERVICE_AUDIT_CODES.systemdStopTimeout, `TimeoutStopSec=${GATEWAY_SERVICE_STOP_TIMEOUT_MS / 1e3} or longer is required for the Gateway drain and final cleanup; inspect unit and drop-in overrides.`, `${unitPath}: ${parsed.stopTimeoutMs / 1e3}s (${entries ? "systemd manager" : "base unit; manager unavailable"})`);
	if (!parsed.after.has("network-online.target")) report(SYSTEMD_SERVICE_AUDIT_CODES.systemdAfterNetworkOnline, "Missing systemd After=network-online.target");
	if (!parsed.wants.has("network-online.target")) report(SYSTEMD_SERVICE_AUDIT_CODES.systemdWantsNetworkOnline, "Missing systemd Wants=network-online.target");
	if (!isRestartSecPreferred(parsed.restartSec)) report(SYSTEMD_SERVICE_AUDIT_CODES.systemdRestartSec, "RestartSec does not match the recommended 5s");
	const killMode = normalizeLowercaseStringOrEmpty(parsed.killMode) || "control-group";
	if (killMode !== "mixed") report(killMode === "process" || killMode === "none" ? SYSTEMD_SERVICE_AUDIT_CODES.systemdKillModeProcessOrNone : SYSTEMD_SERVICE_AUDIT_CODES.systemdKillModeControlGroup, "KillMode=mixed is required to drain active turns before final service child cleanup; inspect unit and drop-in overrides.", `${unitPath}: ${killMode}`);
	return definitionDriftError;
}
async function auditSystemdDefinition(env, unitPath, directives, command, findings, inspectRewrite) {
	const definitions = /* @__PURE__ */ new Map([[unitPath, directives]]);
	for (const file of command?.definitionPaths ?? []) if (file !== unitPath) definitions.set(file, readUnitDirectives(await fs.readFile(file, "utf8")));
	const released = {
		"Unit.StartLimitBurst": ["5"],
		"Unit.StartLimitIntervalSec": ["60"],
		"Service.TimeoutStopSec": ["30"],
		"Service.KillMode": ["control-group", "process"]
	};
	const same = (key, value, expected) => key.endsWith("Sec") ? parseSystemdTimeSpanMs(value) !== void 0 && parseSystemdTimeSpanMs(value) === parseSystemdTimeSpanMs(expected) : value === expected;
	const environment = resolveManagedGatewayServiceCommand(command ?? null)?.environment;
	const environmentFile = renderSystemdEnvironmentFile(resolveSystemdEnvironmentFilePath({
		stateDir: resolveStateDir({
			...env,
			...environment
		}),
		environment
	}));
	const preserved = /* @__PURE__ */ new Set([
		"Unit.Description",
		"Service.ExecStart",
		"Service.WorkingDirectory",
		"Service.Environment"
	]);
	for (const [sourcePath, entries] of definitions) {
		const values = /* @__PURE__ */ new Map();
		for (const { section, key, value } of entries) {
			const name = `${section.slice(1, -1)}.${key}`;
			values.set(name, [...values.get(name) ?? [], value]);
		}
		const keys = sourcePath === unitPath ? /* @__PURE__ */ new Set([...Object.keys(SYSTEMD_FIXED_POLICY), ...values.keys()]) : values.keys();
		for (const key of keys) {
			const expected = SYSTEMD_FIXED_POLICY[key];
			const current = values.get(key);
			if (inspectRewrite && sourcePath === unitPath && key === "Unit.Description" && current?.some((value) => !isInstallerServiceDescription(value, env))) findings.push(serviceDefinitionUnknown(key, "The installer would replace custom service metadata.", sourcePath));
			if (preserved.has(key) || key === "Service.EnvironmentFile" && (current?.every((value) => value === environmentFile) || sourcePath !== unitPath && command?.managedDefinition && command.managedOverrides && command.managedOverrides.environment !== true && !command.reloadPending)) continue;
			if (expected !== void 0 && current?.every((value) => same(key, value, expected))) continue;
			const recognized = expected !== void 0 && (current === void 0 || sourcePath === unitPath && current.every((value) => [expected, ...released[key] ?? []].some((known) => same(key, value, known))));
			findings.push(recognized ? {
				kind: "outdated",
				key,
				current: current?.at(-1) ?? null,
				expected,
				sourcePath,
				message: `Systemd ${key} differs from the installer value ${expected}.`
			} : sourcePath === unitPath && expected !== void 0 ? serviceDefinitionPreserved(key, sourcePath) : {
				kind: "unknown-edit",
				key,
				sourcePath,
				reason: sourcePath === unitPath ? "Unrecognized directive or value in the managed unit." : "Operator drop-in overrides installer policy.",
				message: `Systemd ${key} contains an unrecognized setting.`
			});
		}
	}
}
async function auditSystemdUnitBackup(unitPath, issues) {
	const backupPath = `${unitPath}.bak`;
	let stat;
	try {
		stat = await fs.lstat(backupPath);
	} catch {
		return;
	}
	const mode = stat.mode & 511;
	const embeddedKeys = /* @__PURE__ */ new Set();
	let unreadable = false;
	if (stat.isFile()) {
		const content = await fs.readFile(backupPath, "utf8").catch(() => {
			unreadable = true;
			return "";
		});
		for (const rawLine of splitSystemdLogicalLines(content)) {
			const line = rawLine.trim();
			const separator = line.indexOf("=");
			if (separator < 0 || line.slice(0, separator).trim() !== "Environment") continue;
			for (const { key, value } of parseSystemdEnvAssignments(line.slice(separator + 1).trim())) {
				const normalizedKey = key.toUpperCase();
				if (value && (normalizedKey === "OPENCLAW_GATEWAY_TOKEN" || normalizedKey === "OPENCLAW_GATEWAY_PASSWORD")) embeddedKeys.add(normalizedKey);
			}
		}
	}
	if (stat.isFile() && !unreadable && embeddedKeys.size === 0 && (mode & 63) === 0) return;
	const detail = [
		backupPath,
		!stat.isFile() ? "not a regular file" : void 0,
		unreadable ? "unreadable" : void 0,
		embeddedKeys.size > 0 ? `embedded keys: ${[...embeddedKeys].toSorted().join(", ")}` : void 0,
		(mode & 63) !== 0 ? `mode: ${mode.toString(8).padStart(3, "0")}` : void 0
	].filter(Boolean).join("; ");
	issues.push({
		code: SYSTEMD_SERVICE_AUDIT_CODES.systemdUnitBackupUnsafe,
		message: embeddedKeys.size > 0 ? "Systemd service backup exposes gateway credentials; reinstall the service and rotate the embedded credentials." : "Systemd service backup is unsafe; reinstall the service to replace it.",
		detail,
		level: "recommended"
	});
}
//#endregion
//#region src/daemon/service-audit.ts
const SERVICE_AUDIT_CODES = {
	...SERVICE_RUNTIME_AUDIT_CODES,
	...SYSTEMD_SERVICE_AUDIT_CODES,
	gatewayCommandMissing: "gateway-command-missing",
	gatewayEntrypointMismatch: "gateway-entrypoint-mismatch",
	gatewayPathMissing: "gateway-path-missing",
	gatewayPathMissingDirs: "gateway-path-missing-dirs",
	gatewayPathNonMinimal: "gateway-path-nonminimal",
	gatewayTokenEmbedded: "gateway-token-embedded",
	gatewayPasswordEmbedded: "gateway-password-embedded",
	gatewayManagedEnvEmbedded: "gateway-managed-env-embedded",
	gatewayPortMismatch: "gateway-port-mismatch",
	gatewayProxyEnvEmbedded: "gateway-proxy-env-embedded",
	gatewayTokenMismatch: "gateway-token-mismatch",
	gatewayTokenDrift: "gateway-token-drift",
	launchdKeepAlive: "launchd-keep-alive",
	launchdRunAtLoad: "launchd-run-at-load"
};
/** Returns whether audit issues require migrating a daemon to a stable Node runtime. */
function needsNodeRuntimeMigration(issues) {
	return issues.some((issue) => issue.code === SERVICE_AUDIT_CODES.gatewayRuntimeBun || issue.code === SERVICE_AUDIT_CODES.gatewayRuntimeNode || issue.code === SERVICE_AUDIT_CODES.gatewayRuntimeNodeVersionManager);
}
const POSIX_SERVICE_INLINE_COMMAND_FLAGS = /* @__PURE__ */ new Set(["-c"]);
function isOpaquePosixShellInlineCommand(programArguments) {
	const executable = programArguments[0]?.trim();
	const shellName = executable ? path.posix.basename(executable).toLowerCase() : "";
	if (!POSIX_SHELL_WRAPPERS.has(shellName)) return false;
	return resolveInlineCommandMatch(programArguments, POSIX_SERVICE_INLINE_COMMAND_FLAGS, { allowCombinedC: true }).command !== null;
}
function auditGatewayCommand(programArguments, issues) {
	if (programArguments?.length && !programArguments.includes("gateway") && !isOpaquePosixShellInlineCommand(programArguments)) issues.push({
		code: SERVICE_AUDIT_CODES.gatewayCommandMissing,
		message: "Service command does not include the gateway subcommand",
		level: "aggressive"
	});
}
function readGatewayServiceCommandPort(programArguments = []) {
	let latest;
	for (let index = 0; index < programArguments.length; index += 1) {
		const arg = programArguments[index];
		if (arg === "--port") {
			latest = programArguments[index + 1];
			index += 1;
			continue;
		}
		if (arg?.startsWith("--port=")) latest = arg.slice(7);
	}
	return latest?.trim() ?? "";
}
function auditGatewayServicePort(params) {
	if (typeof params.expectedPort !== "number" || !Number.isSafeInteger(params.expectedPort) || params.expectedPort <= 0 || params.expectedPort > 65535) return;
	const rawPort = readGatewayServiceCommandPort(params.programArguments);
	if (!rawPort) return;
	const servicePort = parseTcpPort(rawPort);
	if (servicePort === params.expectedPort) return;
	params.issues.push({
		code: SERVICE_AUDIT_CODES.gatewayPortMismatch,
		message: "Gateway service port does not match current gateway config.",
		detail: `${servicePort ?? rawPort} -> ${params.expectedPort}`,
		level: "recommended"
	});
}
function auditGatewayToken(command, issues, expectedGatewayToken) {
	const serviceToken = readEmbeddedGatewayToken(command);
	if (!serviceToken) return;
	issues.push({
		code: SERVICE_AUDIT_CODES.gatewayTokenEmbedded,
		message: "Gateway service embeds OPENCLAW_GATEWAY_TOKEN and should be reinstalled.",
		level: "recommended"
	});
	const expectedToken = normalizeOptionalString(expectedGatewayToken);
	if (!expectedToken || serviceToken === expectedToken) return;
	issues.push({
		code: SERVICE_AUDIT_CODES.gatewayTokenMismatch,
		message: "Gateway service OPENCLAW_GATEWAY_TOKEN does not match gateway.auth.token in openclaw.json",
		detail: "service token is stale",
		level: "recommended"
	});
}
function auditGatewayPassword(command, issues) {
	if (!command?.environment?.OPENCLAW_GATEWAY_PASSWORD?.trim() || isEnvironmentFileOnlySource(command.environmentValueSources?.OPENCLAW_GATEWAY_PASSWORD)) return;
	issues.push({
		code: SERVICE_AUDIT_CODES.gatewayPasswordEmbedded,
		message: "Gateway service embeds OPENCLAW_GATEWAY_PASSWORD and should be reinstalled.",
		detail: "Rotate the password after reinstalling because the service definition exposed it.",
		level: "recommended"
	});
}
function auditInlineServiceEnvironment(command, issues, kind, expectedManagedServiceEnvKeys) {
	const managed = kind === "managed";
	const inlineKeys = managed ? collectInlineManagedServiceEnvKeys(resolveManagedGatewayServiceCommand(command), expectedManagedServiceEnvKeys) : collectInlineServiceEnvKeys(command, SERVICE_PROXY_ENV_KEYS);
	if (inlineKeys.length === 0) return;
	issues.push({
		code: managed ? SERVICE_AUDIT_CODES.gatewayManagedEnvEmbedded : SERVICE_AUDIT_CODES.gatewayProxyEnvEmbedded,
		message: managed ? "Gateway service embeds managed environment values that should load at runtime." : "Gateway service embeds proxy environment values that should not be persisted.",
		detail: `inline keys: ${inlineKeys.join(", ")}`,
		environmentKeys: managed ? inlineKeys : Object.entries(command?.environment ?? {}).filter(([key, value]) => value.trim() && SERVICE_PROXY_ENV_KEYS.some((proxyKey) => proxyKey === key) && hasInlineEnvironmentSource(readEnvironmentValueSource(command?.environmentValueSources, key))).map(([key]) => key).toSorted(),
		level: "recommended"
	});
}
function readEmbeddedGatewayToken(command) {
	if (!command) return;
	if (isEnvironmentFileOnlySource(command.environmentValueSources?.OPENCLAW_GATEWAY_TOKEN)) return;
	return normalizeOptionalString(command.environment?.OPENCLAW_GATEWAY_TOKEN);
}
function auditGatewayServicePath(command, issues, env, platform, expectedServicePath) {
	if (!command || platform === "win32") return;
	const servicePath = command.environment?.PATH;
	if (!servicePath) {
		issues.push({
			code: SERVICE_AUDIT_CODES.gatewayPathMissing,
			message: "Gateway service PATH is not set; the daemon should use a minimal PATH.",
			level: "recommended"
		});
		return;
	}
	const expected = expectedServicePath?.trim() ? normalizeStringEntries(expectedServicePath.split(path.posix.delimiter)) : getMinimalServicePathPartsFromEnv({
		platform,
		env,
		includeMissingUserBinDefaults: false
	});
	const parts = normalizeStringEntries(servicePath.split(path.posix.delimiter));
	const normalizedParts = new Set(parts.map((entry) => normalizeServicePathEntry(entry, platform)));
	const normalizedExpected = new Set(expected.map((entry) => normalizeServicePathEntry(entry, platform)));
	const missing = expected.filter((entry) => {
		const normalized = normalizeServicePathEntry(entry, platform);
		if (normalizedParts.has(normalized)) return false;
		if (platform !== "linux") return true;
		const equivalent = entry.endsWith("/aliases/default/bin") ? `${entry.slice(0, -20)}/current/bin` : entry.endsWith("/current/bin") ? `${entry.slice(0, -12)}/aliases/default/bin` : void 0;
		const normalizedEquivalent = equivalent && normalizeServicePathEntry(equivalent, platform);
		return !(normalizedEquivalent && normalizedExpected.has(normalizedEquivalent) && normalizedParts.has(normalizedEquivalent));
	});
	if (missing.length > 0) issues.push({
		code: SERVICE_AUDIT_CODES.gatewayPathMissingDirs,
		message: `Gateway service PATH missing required dirs: ${missing.join(", ")}`,
		level: "recommended"
	});
	const nonMinimal = parts.filter((entry) => {
		const normalized = normalizeServicePathEntry(entry, platform);
		if (normalizedExpected.has(normalized)) return false;
		return isNonMinimalServicePathEntry(normalized, platform);
	});
	if (nonMinimal.length > 0) issues.push({
		code: SERVICE_AUDIT_CODES.gatewayPathNonMinimal,
		message: "Gateway service PATH includes version managers or package managers; recommend a minimal PATH.",
		detail: nonMinimal.join(", "),
		level: "recommended"
	});
}
/** The invoking CLI selects recovery advice for its installation. */
function checkTokenDrift(params) {
	const serviceToken = normalizeOptionalString(params.serviceToken);
	const configToken = normalizeOptionalString(params.configToken);
	if (serviceToken && configToken && serviceToken !== configToken) return {
		code: SERVICE_AUDIT_CODES.gatewayTokenDrift,
		message: "Config token differs from service token. The daemon will use the old token after restart.",
		level: "recommended"
	};
	return null;
}
async function auditGatewayServiceConfig(params) {
	const issues = [];
	const definitionDrift = [];
	let definitionDriftError;
	const platform = params.platform ?? process.platform;
	if (params.expectedCommand) auditGatewayInstallPreservation(params.command, params.expectedCommand, platform, definitionDrift);
	auditGatewayCommand(params.command?.programArguments, issues);
	auditGatewayServicePort({
		programArguments: params.command?.programArguments,
		issues,
		expectedPort: params.expectedPort
	});
	auditInlineServiceEnvironment(params.command, issues, "managed", params.expectedManagedServiceEnvKeys);
	auditInlineServiceEnvironment(params.command, issues, "proxy");
	auditGatewayToken(params.command, issues, params.expectedGatewayToken);
	auditGatewayPassword(params.command, issues);
	auditGatewayServicePath(params.command, issues, params.env, platform, params.expectedServicePath);
	const runtimeNote = await auditGatewayRuntime(params.env, params.command, issues, platform, params.timeoutMs);
	if (platform === "linux") definitionDriftError = await auditSystemdUnit(params.env, issues, params.timeoutMs, params.command, definitionDrift, Boolean(params.expectedCommand));
	try {
		if (platform === "darwin") await auditLaunchdDefinition(params.env, issues, definitionDrift, params.timeoutMs, Boolean(params.expectedCommand));
		else if (platform === "win32" && params.command) await auditScheduledTaskDefinition(params.env, definitionDrift, params.timeoutMs, params.expectedCommand);
	} catch {
		definitionDriftError = "Service definition inspection could not be completed.";
	}
	return {
		ok: issues.length === 0,
		issues,
		...runtimeNote ? { runtimeNote } : {},
		...definitionDrift.length ? { definitionDrift } : {},
		...definitionDriftError ? { definitionDriftError } : {}
	};
}
//#endregion
export { readEmbeddedGatewayToken as a, needsNodeRuntimeMigration as i, auditGatewayServiceConfig as n, checkTokenDrift as r, SERVICE_AUDIT_CODES as t };
