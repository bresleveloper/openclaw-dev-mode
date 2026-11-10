import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveRuntimeScriptPosition } from "./runtime-binary-GM6c0Hou.mjs";
import { a as getCommandPositionalsWithRootOptions, o as getRootOptionAwareCommandPath } from "./cli-root-options-DGcy1qRg.mjs";
import { g as resolveGatewayWindowsTaskName } from "./constants-BLghGsId.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { n as parseCmdSetAssignment } from "./cmd-set-C2w3lnGi.mjs";
import { n as POSIX_INLINE_COMMAND_FLAGS, p as resolveInlineCommandMatch } from "./shell-inline-command-DKNYBguD.mjs";
import { r as splitShellArgs } from "./shell-argv-Dy8gqirH.mjs";
import { S as isEnvAssignmentToken, n as POSIX_SHELL_WRAPPERS, w as resolveCarrierCommandArgv } from "./shell-wrapper-resolution-kxOrsoTv.mjs";
import { t as classifyOpenClawArgv } from "./gateway-process-argv-BLh8C227.mjs";
import { f as withServiceInspectionBudget } from "./service-update-authority-Ddw1lcTH.mjs";
import { F as execSystemctl, I as execSystemctlUser, b as splitSystemdLogicalLines, m as parseSystemdExecStart, n as readSystemdServiceCommandLocation } from "./systemd-service-files-C3V-PDoO.mjs";
import { c as resolveGeneratedEnvWrapperLayout } from "./launchd-plist-D6ncxWm8.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/daemon/inspect-markers.ts
/** Classify captured service commands without treating display names as execution evidence. */
const EXTRA_MARKERS = ["openclaw", "clawdbot"];
function classifyGatewayCommand(programArguments) {
	let args = resolveCarrierCommandArgv(programArguments, 0, { includeExec: true }) ?? programArguments;
	if (POSIX_SHELL_WRAPPERS.has(path.posix.basename(args[0] ?? "").toLowerCase())) {
		const { command } = resolveInlineCommandMatch(args, POSIX_INLINE_COMMAND_FLAGS, { allowCombinedC: true });
		const inner = command ? splitShellArgs(command) : null;
		if (!inner) return "unknown";
		while (inner.length > 0 && isEnvAssignmentToken(inner[0])) inner.shift();
		args = resolveCarrierCommandArgv(inner, 0, { includeExec: true }) ?? inner;
	}
	args = resolveCarrierCommandArgv(args, 0, { includeExec: true }) ?? args;
	const { position } = resolveRuntimeScriptPosition(args);
	if (typeof position !== "number" && position.kind !== "not-runtime") return "unknown";
	const entryIndex = typeof position === "number" ? position : 0;
	const argv = ["node", ...args.slice(entryIndex)];
	if (getRootOptionAwareCommandPath(argv, 1)[0] !== "gateway") return "unknown";
	const subcommand = getCommandPositionalsWithRootOptions(argv, {
		commandPath: ["gateway"],
		maxPositionals: 1,
		mode: "command-path"
	})?.[0];
	if (subcommand === void 0 || subcommand === "run") return "run";
	const identity = classifyOpenClawArgv(args, { command: "gateway" });
	return identity.kind === "openclaw" && identity.entryIndex === entryIndex ? "maintenance" : "run";
}
function hasGatewaySubcommandArg(programArguments) {
	return classifyGatewayCommand(programArguments) === "run";
}
function detectMarkerLineWithGateway(contents) {
	for (const line of splitSystemdLogicalLines(contents)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith(";")) continue;
		const assignment = trimmed.indexOf("=");
		if (assignment > 0) {
			if (normalizeLowercaseStringOrEmpty(trimmed.slice(0, assignment)) !== "execstart" || !hasGatewaySubcommandArg(parseSystemdExecStart(trimmed.slice(assignment + 1).trim()))) continue;
		}
		const normalized = normalizeLowercaseStringOrEmpty(trimmed);
		if (!normalized.includes("gateway")) continue;
		for (const marker of EXTRA_MARKERS) if (normalized.includes(marker)) return marker;
	}
	return null;
}
function hasGatewayServiceMarker(value) {
	const environment = asOptionalRecord(value);
	return environment?.OPENCLAW_SERVICE_MARKER === "openclaw" && environment.OPENCLAW_SERVICE_KIND === "gateway";
}
function detectLaunchdGatewayExecutionMarker(plist) {
	const args = plist.ProgramArguments;
	if (!Array.isArray(args) || !args.every((arg) => typeof arg === "string")) return null;
	if (plist.Program !== void 0 && typeof plist.Program !== "string") return null;
	const programArguments = typeof plist.Program === "string" ? [plist.Program, ...args.slice(1)] : args;
	const layout = resolveGeneratedEnvWrapperLayout(programArguments);
	const command = layout ? programArguments.slice(layout.commandStartIndex) : programArguments;
	if (!hasGatewaySubcommandArg(command)) return null;
	const launchCommand = normalizeLowercaseStringOrEmpty(command.join("\n"));
	return EXTRA_MARKERS.find((marker) => launchCommand.includes(marker)) ?? null;
}
function isOpenClawGatewayTaskName(name) {
	const stripped = normalizeLowercaseStringOrEmpty(name).replace(/^\\+/, "");
	return stripped === normalizeLowercaseStringOrEmpty(resolveGatewayWindowsTaskName()) || /^openclaw gateway \(.+\)$/.test(stripped);
}
function detectWindowsServiceExecutionMarker(args, cwd) {
	if (classifyOpenClawArgv(args, {
		command: "gateway",
		cwd
	}).kind === "openclaw" || classifyOpenClawArgv(args, {
		command: "node",
		cwd
	}).kind === "openclaw") return "openclaw";
	const command = normalizeLowercaseStringOrEmpty(args.join("\n"));
	if (command.includes("clawdbot")) return "clawdbot";
	return command.includes("openclaw") && args.some((arg) => /^(?:gateway|node)$/.test(normalizeLowercaseStringOrEmpty(arg))) ? "openclaw" : null;
}
function detectLauncherGatewayMarker(contents) {
	const environment = {};
	for (const line of contents.split(/\r?\n/)) {
		const command = normalizeLowercaseStringOrEmpty(line);
		if (command.startsWith("set ")) {
			const assignment = parseCmdSetAssignment(line.trimStart().slice(4), true);
			if (assignment) environment[assignment.key] = assignment.value;
			continue;
		}
		if (/^(?:#|;|'|rem\s)/.test(command) || !command.includes("gateway")) continue;
		const marker = EXTRA_MARKERS.find((candidate) => command.includes(candidate));
		if (marker) return marker;
	}
	return hasGatewayServiceMarker(environment) ? "openclaw" : null;
}
//#endregion
//#region src/daemon/systemd-loaded-unit-inventory.ts
/** Read loaded service commands without loading units or reading their environment files. */
const INSPECTION_TIMEOUT_MS = 15e3;
async function isLoadedSystemdMaintenanceCommand(unit, scope, env) {
	const location = await readSystemdServiceCommandLocation(env, {
		scope,
		unitName: unit.name,
		unitPath: unit.fragmentPath
	});
	return location.kind === "command" && classifyGatewayCommand(location.command.programArguments) === "maintenance";
}
async function exists(file) {
	try {
		await fs.lstat(file);
		return true;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return false;
		throw error;
	}
}
async function hasSystemdManager(scope, env) {
	if (scope === "system") return Boolean(env.DBUS_SYSTEM_BUS_ADDRESS) || await exists("/run/systemd/system");
	if (env.DBUS_SESSION_BUS_ADDRESS || env.SUDO_USER) return true;
	const runtimeDir = env.XDG_RUNTIME_DIR || `/run/user/${process.geteuid?.()}`;
	return path.isAbsolute(runtimeDir) && (await exists(path.join(runtimeDir, "systemd/private")) || await exists(path.join(runtimeDir, "bus")));
}
function parseUnitNames(output) {
	const names = [];
	for (const line of output.split(/\r?\n/)) {
		if (!line.trim()) continue;
		const name = line.trimStart().split(/\s+/, 1)[0];
		if (!name?.endsWith(".service")) throw new Error("Loaded systemd service list could not be inspected.");
		names.push(name);
	}
	return [...new Set(names)];
}
function parseLoadedUnits(output, requested) {
	const units = [];
	const seen = /* @__PURE__ */ new Set();
	for (const block of output.trim().split(/\r?\n\r?\n/)) {
		if (!block) continue;
		const fields = /* @__PURE__ */ new Map();
		for (const line of block.split(/\r?\n/)) {
			const separator = line.indexOf("=");
			if (separator <= 0) throw new Error("Loaded systemd service properties could not be inspected.");
			const key = line.slice(0, separator);
			const value = line.slice(separator + 1);
			if (fields.has(key) && key !== "ExecStart") throw new Error("Loaded systemd service properties could not be inspected.");
			fields.set(key, key === "ExecStart" && fields.has(key) ? `${fields.get(key)}; ${value}` : value);
		}
		const name = fields.get("Id");
		const fragmentPath = fields.get("FragmentPath");
		const execStart = fields.get("ExecStart") ?? "";
		const state = fields.get("ActiveState");
		if (!name || !requested.has(name) || seen.has(name) || fragmentPath === void 0 || !state) throw new Error("Loaded systemd service properties could not be inspected.");
		seen.add(name);
		if ([
			"active",
			"activating",
			"reloading",
			"deactivating",
			"failed"
		].includes(state)) units.push({
			name,
			fragmentPath,
			execStart
		});
	}
	if (seen.size !== requested.size) throw new Error("Loaded systemd service inventory changed during inspection.");
	return units;
}
async function listLoadedSystemdUnits(scope, env) {
	if (!await hasSystemdManager(scope, env)) return [];
	const run = (args) => scope === "user" ? withServiceInspectionBudget(() => execSystemctlUser(env, args, INSPECTION_TIMEOUT_MS)) : execSystemctl(["--system", ...args], void 0, INSPECTION_TIMEOUT_MS);
	const listed = await run([
		"list-units",
		"--all",
		"--type=service",
		"--state=active,activating,reloading,deactivating,failed",
		"--plain",
		"--no-legend",
		"--no-pager",
		"--full"
	]);
	if (listed.termination !== "exit" || listed.code !== 0) throw new Error("Loaded systemd service list could not be inspected.");
	const names = parseUnitNames(listed.stdout);
	if (names.length === 0) return [];
	const shown = await run([
		"show",
		"--property=Id,FragmentPath,ExecStart,ActiveState",
		"--no-pager",
		"--",
		...names
	]);
	if (shown.termination !== "exit" || shown.code !== 0) throw new Error("Loaded systemd service properties could not be inspected.");
	return parseLoadedUnits(shown.stdout, new Set(names));
}
//#endregion
export { detectLaunchdGatewayExecutionMarker as a, detectWindowsServiceExecutionMarker as c, isOpenClawGatewayTaskName as d, EXTRA_MARKERS as i, hasGatewayServiceMarker as l, isLoadedSystemdMaintenanceCommand as n, detectLauncherGatewayMarker as o, listLoadedSystemdUnits as r, detectMarkerLineWithGateway as s, hasSystemdManager as t, hasGatewaySubcommandArg as u };
