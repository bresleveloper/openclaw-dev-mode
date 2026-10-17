import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveRuntimeScriptPosition } from "./runtime-binary-BAwmhhZ0.mjs";
import { o as getRootOptionAwareCommandPath } from "./cli-root-options-DGcy1qRg.mjs";
import { _ as resolveNodeLaunchAgentLabel, g as resolveGatewayWindowsTaskName, l as normalizeWindowsTaskIdentity, m as resolveGatewaySystemdServiceName, o as LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES, u as resolveGatewayLaunchAgentLabel } from "./constants-BLghGsId.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as findExistingAncestor } from "./fs-safe-BUXBSN-4.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { t as splitArgsPreservingQuotes } from "./arg-split-CR3xkHmb.mjs";
import { a as parseCmdSetAssignment } from "./cmd-argv-jQQXbWaH.mjs";
import { t as resolveDaemonHomeDir } from "./paths-DMJOvLwv.mjs";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-DoGHpXtD.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { f as withServiceInspectionBudget } from "./service-update-authority-CoX8GMUL.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-CDVrpZuO.mjs";
import { t as classifyOpenClawArgv } from "./gateway-process-argv-DMAY-YPv.mjs";
import { r as splitShellArgs } from "./shell-argv-Dy8gqirH.mjs";
import { C as resolveInlineCommandMatch, M as isEnvAssignmentToken, P as resolveCarrierCommandArgv, g as POSIX_INLINE_COMMAND_FLAGS, n as POSIX_SHELL_WRAPPERS } from "./shell-wrapper-resolution-BWMoO7Nh.mjs";
import { t as WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS } from "./windows-powershell-spawn-DDmi3G9M.mjs";
import { _ as listScheduledTasks, a as readScheduledTaskCommand, c as resolveStartupEntryPaths, o as readStartupEntryCommand, s as resolveStartupEntryPath, u as resolveTaskName } from "./schtasks-layout-BWyDzx-H.mjs";
import { n as resolveWindowsServiceCommandProfile } from "./service-env-merge-BU8q8IlG.mjs";
import { c as resolveGeneratedEnvWrapperLayout, i as decodeLaunchdPlistMetadata } from "./launchd-plist-zSdg3_Ip.mjs";
import { F as execSystemctl, I as execSystemctlUser, b as splitSystemdLogicalLines, c as resolveSystemdServiceName, h as parseSystemdInlineEnvironment, m as parseSystemdExecStart } from "./systemd-service-files-D_ieSNFm.mjs";
import { n as resolveSystemdUnitLoadDirectories, t as DEFAULT_SYSTEMD_SYSTEM_UNIT_DIRS } from "./systemd-unit-load-paths-5tqHLXY1.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/daemon/inspect-markers.ts
/** Classify captured service commands without treating display names as execution evidence. */
const EXTRA_MARKERS = ["openclaw", "clawdbot"];
function hasGatewaySubcommandArg(programArguments) {
	let args = resolveCarrierCommandArgv(programArguments, 0, { includeExec: true }) ?? programArguments;
	if (POSIX_SHELL_WRAPPERS.has(path.posix.basename(args[0] ?? "").toLowerCase())) {
		const { command } = resolveInlineCommandMatch(args, POSIX_INLINE_COMMAND_FLAGS, { allowCombinedC: true });
		const inner = command ? splitShellArgs(command) : null;
		if (!inner) return false;
		while (inner.length > 0 && isEnvAssignmentToken(inner[0])) inner.shift();
		args = resolveCarrierCommandArgv(inner, 0, { includeExec: true }) ?? inner;
	}
	args = resolveCarrierCommandArgv(args, 0, { includeExec: true }) ?? args;
	const { position } = resolveRuntimeScriptPosition(args);
	if (typeof position !== "number" && position.kind !== "not-runtime") return false;
	const entryIndex = typeof position === "number" ? position : 0;
	return getRootOptionAwareCommandPath(["node", ...args.slice(entryIndex)], 1)[0] === "gateway";
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
		const command = normalizeLowercaseStringOrEmpty(line.trim());
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
//#region src/daemon/inspect-files.ts
async function readServiceFile(filePath) {
	return fs.readFile(filePath).catch(() => null);
}
function isPotentialGatewayServiceName(name, platform, selected) {
	return name === selected || (platform === "darwin" ? name.startsWith("ai.openclaw.") && name !== resolveNodeLaunchAgentLabel() || /clawdbot.*gateway/.test(name) : /^(?:openclaw|clawdbot)(?:$|@|-gateway(?:$|[-.@]))/.test(name));
}
async function collectServiceFiles(params) {
	const out = [];
	let entries;
	try {
		entries = await fs.readdir(params.dir);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) params.errors?.push({
			source: params.dir,
			message: "Service path could not be inspected."
		});
		return out;
	}
	for (const entry of entries.toSorted()) {
		if (!entry.endsWith(params.extension)) continue;
		const name = entry.slice(0, -params.extension.length);
		const fullPath = path.join(params.dir, entry);
		let contents;
		try {
			contents = await fs.readFile(fullPath);
		} catch {
			if (params.isPotentialName(name)) params.errors?.push({
				source: fullPath,
				message: "Service path could not be inspected."
			});
			continue;
		}
		out.push({
			entry,
			name,
			fullPath,
			contents
		});
	}
	return out;
}
function isLegacyLabel(label) {
	return normalizeLowercaseStringOrEmpty(label).includes("clawdbot");
}
async function scanSystemdDir(params) {
	const results = [];
	const candidates = await collectServiceFiles({
		dir: params.dir,
		extension: ".service",
		isPotentialName: (name) => isPotentialGatewayServiceName(name, "linux", params.selectedName),
		errors: params.errors
	});
	for (const { entry, name, fullPath, contents: bytes } of candidates) {
		const contents = bytes.toString("utf8");
		const serviceMarker = hasGatewayServiceMarker(parseSystemdInlineEnvironment(contents));
		const marker = serviceMarker ? "openclaw" : detectMarkerLineWithGateway(contents);
		if (!marker) continue;
		results.push({
			platform: "linux",
			label: entry,
			detail: `unit: ${fullPath}`,
			sourcePath: fullPath,
			scope: params.scope,
			marker,
			legacy: marker !== "openclaw",
			managedGateway: marker === "openclaw",
			extra: name !== resolveGatewaySystemdServiceName() && !(marker === "openclaw" && !isLegacyLabel(name) && params.scope === "user" && name === params.selectedName) && !serviceMarker && !(marker === "openclaw" && name.startsWith("openclaw-gateway"))
		});
	}
	return results;
}
//#endregion
//#region src/daemon/systemd-loaded-unit-inventory.ts
/** Read loaded service commands without loading units or reading their environment files. */
const INSPECTION_TIMEOUT_MS = 15e3;
async function exists(file) {
	try {
		await fs.lstat(file);
		return true;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return false;
		throw error;
	}
}
async function hasManager(scope, env) {
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
	if (!await hasManager(scope, env)) return [];
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
//#region src/daemon/inspect.ts
/** Inspects installed platform services for extra OpenClaw or legacy gateway jobs. */
function projectService({ extra: _extra, managedGateway: _managed, windowsProfile: _windowsProfile, ...service }) {
	return service;
}
function renderGatewayServiceCleanupHints(services = []) {
	const hints = [];
	for (const service of services) switch (service.platform) {
		case "darwin": {
			const plistPath = service.sourcePath;
			const domain = service.scope === "system" && plistPath?.startsWith("/Library/LaunchDaemons/") ? "system" : "gui/$UID";
			const launchctlCommand = domain === "system" ? "sudo launchctl" : "launchctl";
			hints.push(`${launchctlCommand} bootout ${domain}/${quoteCliArg(service.label)}`);
			if (plistPath) {
				const removeCommand = service.scope === "system" ? "sudo rm" : "rm";
				hints.push(`${removeCommand} ${quoteCliArg(plistPath)}`);
			}
			break;
		}
		case "linux": {
			const systemctlCommand = `systemctl --${service.scope}`;
			const unit = quoteCliArg(service.label);
			hints.push(`${systemctlCommand} status -- ${unit}`, `${systemctlCommand} cat -- ${unit}`);
			break;
		}
		case "win32":
			if (service.windowsStartupEntry) {
				hints.push(`Get-Item -LiteralPath '${service.windowsStartupEntry.replaceAll("'", "''")}'`);
				break;
			}
			if (/^[A-Za-z0-9_. ()\\/-]+$/.test(service.label)) hints.push(`schtasks /Query /TN "${service.label}" /V /FO LIST`);
	}
	return hints;
}
async function scanLaunchdDir(params) {
	const results = [];
	const isPotentialName = (name) => isPotentialGatewayServiceName(name, "darwin", params.selectedName);
	const candidates = await collectServiceFiles({
		dir: params.dir,
		extension: ".plist",
		isPotentialName,
		errors: params.errors
	});
	for (const { name: labelFromName, fullPath, contents } of candidates) {
		const plist = await decodeLaunchdPlistMetadata(contents).catch((error) => {
			if (hasCommandProcessCleanupError(error)) throw error;
			const contentHint = normalizeLowercaseStringOrEmpty(contents.toString("utf8").replaceAll("\0", ""));
			if (isPotentialName(labelFromName) || EXTRA_MARKERS.some((marker) => contentHint.includes(marker))) params.errors?.push({
				source: fullPath,
				message: "Service plist could not be inspected."
			});
		});
		if (!plist) continue;
		const label = typeof plist.Label === "string" && plist.Label ? plist.Label : labelFromName;
		const executionMarker = detectLaunchdGatewayExecutionMarker(plist);
		const serviceMarker = hasGatewayServiceMarker(plist.EnvironmentVariables);
		const legacyLabel = isLegacyLabel(labelFromName) || isLegacyLabel(label);
		const marker = label === params.managedLabel || serviceMarker ? "openclaw" : executionMarker ?? (legacyLabel ? "clawdbot" : null);
		if (!marker) continue;
		results.push({
			platform: "darwin",
			label,
			detail: `plist: ${fullPath}`,
			sourcePath: fullPath,
			scope: params.scope,
			marker,
			legacy: marker !== "openclaw" || isLegacyLabel(label),
			managedGateway: marker === "openclaw" && (serviceMarker || executionMarker === "openclaw"),
			extra: params.scope === "system" || label !== resolveGatewayLaunchAgentLabel() && !(marker === "openclaw" && !legacyLabel && params.scope === "user" && label === params.selectedName) && !(marker === "openclaw" && (serviceMarker || executionMarker === "openclaw" && label.startsWith("ai.openclaw.")))
		});
	}
	return results;
}
async function findSystemGatewayServices() {
	if (process.platform !== "linux") return [];
	const results = [];
	try {
		for (const dir of DEFAULT_SYSTEMD_SYSTEM_UNIT_DIRS) results.push(...(await scanSystemdDir({
			dir,
			scope: "system"
		})).map(projectService));
	} catch {
		return [];
	}
	return results;
}
async function scanWindowsStartupEntries(env, errors, deadline) {
	let directory;
	let selected;
	try {
		directory = path.dirname(resolveStartupEntryPath(env));
		selected = new Set(resolveStartupEntryPaths(env).map((entry) => path.win32.normalize(entry).toLowerCase()));
	} catch {
		errors.push({
			source: "startup",
			message: "Windows Startup folder could not be located."
		});
		return [];
	}
	let entries;
	try {
		const found = await awaitWithinDeadline(async () => {
			try {
				return await fs.readdir(directory);
			} catch (error) {
				if (!hasErrnoCode(error, "ENOENT") || performance.now() >= deadline) throw error;
				const ancestor = await findExistingAncestor(directory);
				if (!ancestor || ancestor === path.resolve(directory) || performance.now() >= deadline || !(await fs.stat(ancestor)).isDirectory()) throw error;
				return [];
			}
		}, deadline, () => performance.now());
		if (found === ABSOLUTE_DEADLINE_EXPIRED) throw new Error("Startup inventory deadline expired.");
		entries = found;
	} catch {
		errors.push({
			source: directory,
			message: "Windows Startup folder could not be inspected."
		});
		return [];
	}
	const selectedStartupEntries = /* @__PURE__ */ new Set();
	if (entries.some((entry) => selected.has(path.win32.normalize(path.join(directory, entry)).toLowerCase()))) try {
		const command = await readScheduledTaskCommand(env, {
			requireLoaded: true,
			deadline
		});
		for (const entry of command?.startupEntryPaths ?? []) selectedStartupEntries.add(path.win32.normalize(entry).toLowerCase());
	} catch {
		errors.push({
			source: resolveTaskName(env),
			message: "Selected Gateway service could not be inspected."
		});
	}
	const services = [];
	for (const entry of entries.toSorted()) {
		if (performance.now() >= deadline) {
			errors.push({
				source: directory,
				message: "Startup inventory deadline expired."
			});
			break;
		}
		if (!/\.(?:cmd|vbs)$/i.test(entry)) continue;
		const name = entry.slice(0, -4);
		const pathname = path.join(directory, entry);
		const pathIdentity = path.win32.normalize(pathname).toLowerCase();
		let gateway = /(?:openclaw|clawdbot).*gateway/i.test(name);
		let marker;
		try {
			const command = await readStartupEntryCommand(pathname, {
				deadline,
				onLauncherContent: (content) => {
					const hint = detectLauncherGatewayMarker(content);
					gateway ||= Boolean(hint);
					marker = hint ?? marker;
				}
			});
			const commandMarker = detectWindowsServiceExecutionMarker(command.programArguments, command.workingDirectory);
			const serviceMarker = hasGatewayServiceMarker(command.environment);
			gateway = hasGatewaySubcommandArg(command.programArguments) || serviceMarker;
			marker = serviceMarker ? "openclaw" : commandMarker ?? void 0;
			const profile = resolveWindowsServiceCommandProfile(command);
			const label = command.environment?.OPENCLAW_WINDOWS_TASK_NAME?.trim() || name;
			if (!marker || !gateway && marker !== "clawdbot") continue;
			services.push({
				platform: "win32",
				label,
				detail: `startup: ${pathname}`,
				scope: "user",
				marker,
				legacy: marker !== "openclaw",
				windowsStartupEntry: pathname,
				extra: marker !== "openclaw" || !selectedStartupEntries.has(pathIdentity),
				managedGateway: marker === "openclaw" && gateway,
				...profile.kind === "resolved" ? { windowsProfile: profile.profile } : {}
			});
		} catch {
			const expired = performance.now() >= deadline;
			if (expired || gateway || selected.has(pathIdentity)) errors.push({
				source: pathname,
				message: "Startup launcher could not be inspected."
			});
			if (expired) break;
		}
	}
	return services;
}
async function scanGatewayServices(env, opts, requireComplete = false) {
	const results = [];
	const errors = [];
	const inventory = {
		services: results,
		errors
	};
	const seen = /* @__PURE__ */ new Set();
	const push = (svc) => {
		const key = `${svc.platform}:${svc.label}:${svc.detail}:${svc.scope}`;
		if (seen.has(key)) return;
		seen.add(key);
		results.push(svc);
	};
	if (process.platform === "darwin") {
		try {
			const home = resolveDaemonHomeDir(env);
			const scan = async (dir, scope, managedLabel) => {
				for (const svc of await scanLaunchdDir({
					dir,
					scope,
					managedLabel,
					selectedName: resolveLaunchAgentLabel(env),
					errors
				})) push(svc);
			};
			await scan(path.join(home, "Library", "LaunchAgents"), "user");
			if (opts.deep) {
				await scan(path.join(path.sep, "Library", "LaunchAgents"), "system");
				await scan(path.join(path.sep, "Library", "LaunchDaemons"), "system", resolveLaunchAgentLabel(env));
			}
		} catch (error) {
			if (hasCommandProcessCleanupError(error)) throw error;
			errors.push({
				source: "launchd",
				message: "Gateway service discovery could not finish."
			});
		}
		return inventory;
	}
	if (process.platform === "linux") {
		try {
			const home = resolveDaemonHomeDir(env);
			const userDir = path.join(home, ".config", "systemd", "user");
			const loadDirs = requireComplete ? resolveSystemdUnitLoadDirectories(env, home, process.geteuid?.()) : void 0;
			if (loadDirs && !loadDirs.complete) errors.push({
				source: "systemd",
				message: "Systemd unit load paths could not be verified."
			});
			const userServices = [];
			for (const dir of loadDirs?.userDirs ?? [userDir]) userServices.push(...await scanSystemdDir({
				dir,
				scope: "user",
				selectedName: resolveSystemdServiceName(env),
				errors
			}));
			for (const svc of userServices) push(svc);
			for (const name of LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES) {
				const label = `${name}.service`;
				if (userServices.some((service) => service.label === label)) continue;
				const backupPath = path.join(userDir, `${name}.service.bak`);
				if (await readServiceFile(backupPath) !== null) push({
					platform: "linux",
					label,
					detail: `unit backup: ${backupPath}`,
					scope: "user",
					marker: "clawdbot",
					legacy: true,
					extra: true,
					managedGateway: false
				});
			}
			if (opts.deep) for (const dir of loadDirs?.systemDirs ?? DEFAULT_SYSTEMD_SYSTEM_UNIT_DIRS) for (const svc of await scanSystemdDir({
				dir,
				scope: "system",
				selectedName: resolveSystemdServiceName(env),
				errors
			})) push(svc);
			if (requireComplete) for (const scope of ["user", "system"]) try {
				for (const unit of await listLoadedSystemdUnits(scope, env)) {
					const name = unit.name.slice(0, -8);
					const command = normalizeLowercaseStringOrEmpty(unit.execStart);
					const marker = /(?:^|[\s;])gateway(?:[\s;]|$)/.test(command) ? EXTRA_MARKERS.find((value) => command.includes(value)) ?? null : null;
					const selected = isPotentialGatewayServiceName(name, "linux", resolveSystemdServiceName(env));
					if (!marker && !selected) continue;
					if (!path.posix.isAbsolute(unit.fragmentPath)) {
						errors.push({
							source: unit.name,
							message: "Loaded systemd Gateway definition could not be inspected."
						});
						continue;
					}
					push({
						platform: "linux",
						label: unit.name,
						detail: `unit: ${unit.fragmentPath}`,
						sourcePath: unit.fragmentPath,
						scope,
						marker: marker ?? "openclaw",
						legacy: marker === "clawdbot",
						extra: true,
						managedGateway: marker !== "clawdbot"
					});
				}
			} catch (error) {
				if (hasCommandProcessCleanupError(error)) throw error;
				errors.push({
					source: scope === "user" ? "systemctl --user" : "systemctl --system",
					message: "Loaded systemd services could not be inspected."
				});
			}
		} catch (error) {
			if (hasCommandProcessCleanupError(error)) throw error;
			errors.push({
				source: "systemd",
				message: "Gateway service discovery could not finish."
			});
		}
		return inventory;
	}
	if (process.platform === "win32") {
		if (!opts.deep) return inventory;
		const deadline = performance.now() + WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS;
		const expired = () => deadline - performance.now() < 1;
		const deadlineError = {
			source: "schtasks",
			message: "Scheduled Task inventory deadline expired; some services could not be inspected."
		};
		const recordDeadline = () => {
			if (!errors.includes(deadlineError)) errors.push(deadlineError);
		};
		let tasks;
		try {
			tasks = listScheduledTasks(deadline - performance.now());
		} catch {
			errors.push({
				source: "schtasks",
				message: "Scheduled tasks could not be queried."
			});
			tasks = [];
		}
		if (expired()) {
			recordDeadline();
			return inventory;
		}
		for (const task of tasks) {
			if (expired()) {
				recordDeadline();
				break;
			}
			const name = task.taskPath?.trim();
			if (!name) {
				if (requireComplete) errors.push({
					source: "schtasks",
					message: "Scheduled Task identity could not be inspected."
				});
				continue;
			}
			const taskToRun = task.actions?.map((action) => `${action.path} ${action.arguments}`.trim()).join("; ") ?? "";
			const actionArgv = task.actions?.map((action) => [action.path, ...splitArgsPreservingQuotes(action.arguments, { escapeMode: "backslash-quote-only" })]) ?? [];
			const selected = normalizeWindowsTaskIdentity(name) === normalizeWindowsTaskIdentity(resolveTaskName(env));
			const knownTask = selected || isOpenClawGatewayTaskName(name) || isLegacyLabel(name);
			const launcherReference = actionArgv.some((argv) => argv.some((arg) => /\.(?:bat|cmd|vbs)$/i.test(arg) && detectLauncherGatewayMarker(arg)));
			if (!task.actions?.length) {
				if (knownTask) errors.push({
					source: name,
					message: "Scheduled Task action could not be inspected."
				});
				continue;
			}
			const actionMarkers = actionArgv.map((argv, index) => detectWindowsServiceExecutionMarker(argv, task.actions?.[index]?.workingDirectory));
			const hasGatewayAction = actionArgv.some((argv, index) => actionMarkers[index] === "openclaw" && hasGatewaySubcommandArg(argv));
			const hasLauncherAction = actionArgv.some((argv) => argv.some((arg) => /\.(?:bat|cmd|vbs)$/i.test(arg)));
			if (requireComplete && task.actions.length > 1 && (hasGatewayAction || hasLauncherAction && (knownTask || launcherReference))) {
				errors.push({
					source: name,
					message: "Multiple Scheduled Task actions could not be inspected as one Gateway."
				});
				continue;
			}
			let marker = hasGatewayAction ? "openclaw" : actionMarkers.find(Boolean) ?? null;
			let gateway = hasGatewayAction;
			let profile = actionArgv.length === 1 ? resolveWindowsServiceCommandProfile({ programArguments: actionArgv[0] }) : void 0;
			let recognizableLauncher = launcherReference;
			if (launcherReference || hasLauncherAction) try {
				const command = await readScheduledTaskCommand({
					...env,
					OPENCLAW_WINDOWS_TASK_NAME: name,
					OPENCLAW_PROFILE: void 0
				}, {
					requireEffective: true,
					requireLoaded: true,
					profileScope: "registered",
					deadline,
					onLauncherContent: (content) => {
						recognizableLauncher ||= Boolean(detectLauncherGatewayMarker(content));
					}
				});
				if (!command && (knownTask || recognizableLauncher)) throw new Error("Registered launcher disappeared during inspection.");
				profile = command ? resolveWindowsServiceCommandProfile(command) : void 0;
				const serviceMarker = command?.environment?.OPENCLAW_SERVICE_MARKER;
				const serviceKind = command?.environment?.OPENCLAW_SERVICE_KIND;
				marker = command ? detectWindowsServiceExecutionMarker(command.programArguments, command.workingDirectory) : null;
				gateway = Boolean(command && hasGatewaySubcommandArg(command.programArguments));
				if (serviceMarker === "openclaw" && (serviceKind === "gateway" || serviceKind === "node")) {
					marker = "openclaw";
					gateway = serviceKind === "gateway";
				}
			} catch {
				if (expired()) {
					recordDeadline();
					break;
				}
				if (knownTask || recognizableLauncher) errors.push({
					source: name,
					message: "Scheduled Task launcher could not be inspected."
				});
				continue;
			}
			if (!marker) continue;
			if (requireComplete && marker === "openclaw" && gateway && profile?.kind !== "resolved") {
				errors.push({
					source: name,
					message: "Scheduled Task profile could not be inspected."
				});
				continue;
			}
			push({
				platform: "win32",
				label: name,
				detail: taskToRun ? `task: ${name}, run: ${taskToRun}` : name,
				scope: "system",
				marker,
				legacy: marker !== "openclaw",
				extra: !(marker === "openclaw" && gateway && !isLegacyLabel(name) && (selected || isOpenClawGatewayTaskName(name))),
				managedGateway: marker === "openclaw" && gateway,
				...profile?.kind === "resolved" ? { windowsProfile: profile.profile } : {}
			});
		}
		if (expired()) {
			recordDeadline();
			return inventory;
		}
		for (const service of await scanWindowsStartupEntries(env, errors, deadline)) push(service);
		return inventory;
	}
	return inventory;
}
async function findExtraGatewayServices(env, opts = {}) {
	const inventory = await scanGatewayServices(env, opts);
	return {
		services: inventory.services.filter((service) => service.extra).map(projectService),
		errors: inventory.errors
	};
}
/** Complete managed selectors are discovery facts, not native lifecycle authority. */
async function listManagedOpenClawGatewayServices(env, options = {}) {
	const inventory = await scanGatewayServices(env, { deep: true }, options.requireComplete);
	return {
		services: inventory.services.filter((service) => service.managedGateway).map(({ extra: _extra, managedGateway: _managed, ...service }) => service),
		errors: inventory.errors
	};
}
//#endregion
export { renderGatewayServiceCleanupHints as i, findSystemGatewayServices as n, listManagedOpenClawGatewayServices as r, findExtraGatewayServices as t };
