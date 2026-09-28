import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { l as resolveGatewayLaunchAgentLabel, m as resolveGatewayWindowsTaskName, o as LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES, p as resolveGatewaySystemdServiceName, r as GATEWAY_SERVICE_MARKER } from "./constants-CJCmIHb-.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-i3x9UrUR.mjs";
import { i as decodeLaunchdPlistMetadata } from "./launchd-plist-BNtNmL1p.mjs";
import { t as resolveDaemonHomeDir } from "./paths-B1MX98Zs.mjs";
import { i as parseSystemdExecStart, u as splitSystemdLogicalLines } from "./systemd-unit-CKIkv32Z.mjs";
import { t as execSchtasks } from "./schtasks-exec-AWBr696q.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/daemon/inspect.ts
/** Inspects installed platform services for extra OpenClaw or legacy gateway jobs. */
const EXTRA_MARKERS = ["openclaw", "clawdbot"];
function quotePosixCleanupArgument(value) {
	return /^[A-Za-z0-9_@%+=:,./-]+$/.test(value) ? value : `'${value.replaceAll("'", "'\\''")}'`;
}
function renderGatewayServiceCleanupHints(services = []) {
	const hints = [];
	for (const service of services) switch (service.platform) {
		case "darwin": {
			const plistPath = service.detail.startsWith("plist:") ? service.detail.slice(6).trim() : void 0;
			const domain = service.scope === "system" && plistPath?.startsWith("/Library/LaunchDaemons/") ? "system" : "gui/$UID";
			const launchctlCommand = domain === "system" ? "sudo launchctl" : "launchctl";
			hints.push(`${launchctlCommand} bootout ${domain}/${quotePosixCleanupArgument(service.label)}`);
			if (plistPath) {
				const removeCommand = service.scope === "system" ? "sudo rm" : "rm";
				hints.push(`${removeCommand} ${quotePosixCleanupArgument(plistPath)}`);
			}
			break;
		}
		case "linux": {
			const systemctlCommand = `systemctl --${service.scope}`;
			const unit = quotePosixCleanupArgument(service.label);
			hints.push(`${systemctlCommand} status -- ${unit}`, `${systemctlCommand} cat -- ${unit}`);
			break;
		}
		case "win32": if (/^[A-Za-z0-9_. ()\\/-]+$/.test(service.label)) hints.push(`schtasks /Delete /TN "${service.label}" /F`);
	}
	return hints;
}
function hasGatewaySubcommandArg(args) {
	return args.some((arg) => {
		const normalized = normalizeLowercaseStringOrEmpty(arg);
		return normalized === "gateway" || /(^|\s)gateway(\s|$)/.test(normalized);
	});
}
function detectMarkerLineWithGateway(contents) {
	for (const line of splitSystemdLogicalLines(contents)) {
		const trimmed = normalizeLowercaseStringOrEmpty(line);
		if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith(";")) continue;
		const assignment = trimmed.indexOf("=");
		if (assignment > 0) {
			if (trimmed.slice(0, assignment).trim() !== "execstart" || !hasGatewaySubcommandArg(parseSystemdExecStart(trimmed.slice(assignment + 1).trim()))) continue;
		}
		if (!trimmed.includes("gateway")) continue;
		for (const marker of EXTRA_MARKERS) if (trimmed.includes(marker)) return marker;
	}
	return null;
}
function hasGatewayServiceMarker(content) {
	const lower = normalizeLowercaseStringOrEmpty(content);
	const markerKeys = ["openclaw_service_marker"];
	const kindKeys = ["openclaw_service_kind"];
	const markerValues = [normalizeLowercaseStringOrEmpty(GATEWAY_SERVICE_MARKER)];
	const hasMarkerKey = markerKeys.some((key) => lower.includes(key));
	const hasKindKey = kindKeys.some((key) => lower.includes(key));
	const hasMarkerValue = markerValues.some((value) => lower.includes(value));
	return hasMarkerKey && hasKindKey && hasMarkerValue && lower.includes(normalizeLowercaseStringOrEmpty("gateway"));
}
function detectLaunchdGatewayExecutionMarker(plist) {
	const programArguments = Array.isArray(plist.ProgramArguments) ? plist.ProgramArguments.filter((arg) => typeof arg === "string") : [];
	if (!hasGatewaySubcommandArg(programArguments)) return null;
	const launchCommand = normalizeLowercaseStringOrEmpty([typeof plist.Program === "string" ? plist.Program : "", ...programArguments].join("\n"));
	return EXTRA_MARKERS.find((marker) => launchCommand.includes(marker)) ?? null;
}
function isOpenClawGatewaySystemdService(name, contents) {
	if (hasGatewayServiceMarker(contents)) return true;
	if (!name.startsWith("openclaw-gateway")) return false;
	return normalizeLowercaseStringOrEmpty(contents).includes("gateway");
}
function isOpenClawGatewayTaskName(name) {
	const normalized = normalizeLowercaseStringOrEmpty(name);
	if (!normalized) return false;
	const stripped = normalized.replace(/^\\+/, "");
	return stripped === normalizeLowercaseStringOrEmpty(resolveGatewayWindowsTaskName()) || /^openclaw gateway \(.+\)$/.test(stripped);
}
function isIgnoredLaunchdLabel(label) {
	return label === resolveGatewayLaunchAgentLabel();
}
function isIgnoredSystemdName(name) {
	return name === resolveGatewaySystemdServiceName();
}
function isLegacyLabel(label) {
	return normalizeLowercaseStringOrEmpty(label).includes("clawdbot");
}
async function readDirEntries(dir) {
	try {
		return await fs.readdir(dir);
	} catch {
		return [];
	}
}
async function readServiceFile(filePath) {
	try {
		return await fs.readFile(filePath);
	} catch {
		return null;
	}
}
async function collectServiceFiles(params) {
	const out = [];
	const entries = await readDirEntries(params.dir);
	for (const entry of entries) {
		if (!entry.endsWith(params.extension)) continue;
		const name = entry.slice(0, -params.extension.length);
		if (params.isIgnoredName(name)) continue;
		const fullPath = path.join(params.dir, entry);
		const contents = await readServiceFile(fullPath);
		if (contents === null) continue;
		out.push({
			entry,
			name,
			fullPath,
			contents
		});
	}
	return out;
}
async function scanLaunchdDir(params) {
	const results = [];
	const candidates = await collectServiceFiles({
		dir: params.dir,
		extension: ".plist",
		isIgnoredName: params.includeManagedOpenClaw ? () => false : isIgnoredLaunchdLabel
	});
	for (const { name: labelFromName, fullPath, contents } of candidates) {
		const plist = await decodeLaunchdPlistMetadata(contents).catch(() => void 0);
		if (!plist) continue;
		const label = typeof plist.Label === "string" && plist.Label ? plist.Label : labelFromName;
		const executionMarker = detectLaunchdGatewayExecutionMarker(plist);
		const serviceMarker = hasGatewayServiceMarker(JSON.stringify(plist.EnvironmentVariables) ?? "");
		const legacyLabel = isLegacyLabel(labelFromName) || isLegacyLabel(label);
		const marker = label === params.managedLabel || serviceMarker ? "openclaw" : executionMarker ?? (legacyLabel ? "clawdbot" : null);
		if (!marker) continue;
		if (!params.includeManagedOpenClaw && isIgnoredLaunchdLabel(label)) continue;
		if (!params.includeManagedOpenClaw && marker === "openclaw" && (serviceMarker || executionMarker === "openclaw" && label.startsWith("ai.openclaw."))) continue;
		results.push({
			platform: "darwin",
			label,
			detail: `plist: ${fullPath}`,
			scope: params.scope,
			marker,
			legacy: marker !== "openclaw" || isLegacyLabel(label)
		});
	}
	return results;
}
async function scanSystemdDir(params) {
	const results = [];
	const candidates = await collectServiceFiles({
		dir: params.dir,
		extension: ".service",
		isIgnoredName: params.includeManagedOpenClaw ? () => false : isIgnoredSystemdName
	});
	for (const { entry, name, fullPath, contents: bytes } of candidates) {
		const contents = bytes.toString("utf8");
		const marker = hasGatewayServiceMarker(contents) ? "openclaw" : detectMarkerLineWithGateway(contents);
		if (!marker) continue;
		if (!params.includeManagedOpenClaw && marker === "openclaw" && isOpenClawGatewaySystemdService(name, contents)) continue;
		results.push({
			platform: "linux",
			label: entry,
			detail: `unit: ${fullPath}`,
			scope: params.scope,
			marker,
			legacy: marker !== "openclaw"
		});
	}
	return results;
}
async function findSystemGatewayServices() {
	if (process.platform !== "linux") return [];
	const results = [];
	try {
		for (const dir of [
			"/etc/systemd/system",
			"/usr/lib/systemd/system",
			"/lib/systemd/system"
		]) results.push(...await scanSystemdDir({
			dir,
			scope: "system",
			includeManagedOpenClaw: true
		}));
	} catch {
		return [];
	}
	return results;
}
function parseSchtasksList(output) {
	const tasks = [];
	let current = null;
	for (const rawLine of output.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line) {
			if (current) {
				tasks.push(current);
				current = null;
			}
			continue;
		}
		const idx = line.indexOf(":");
		if (idx <= 0) continue;
		const key = normalizeLowercaseStringOrEmpty(line.slice(0, idx));
		const value = line.slice(idx + 1).trim();
		if (!value) continue;
		if (key === "taskname") {
			if (current) tasks.push(current);
			current = { name: value };
			continue;
		}
		if (!current) continue;
		if (key === "task to run") current.taskToRun = value;
	}
	if (current) tasks.push(current);
	return tasks;
}
async function findExtraGatewayServices(env, opts = {}) {
	const results = [];
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
			const userDir = path.join(home, "Library", "LaunchAgents");
			for (const svc of await scanLaunchdDir({
				dir: userDir,
				scope: "user"
			})) push(svc);
			if (opts.deep) {
				for (const svc of await scanLaunchdDir({
					dir: path.join(path.sep, "Library", "LaunchAgents"),
					scope: "system"
				})) push(svc);
				for (const svc of await scanLaunchdDir({
					dir: path.join(path.sep, "Library", "LaunchDaemons"),
					scope: "system",
					includeManagedOpenClaw: true,
					managedLabel: resolveLaunchAgentLabel(env)
				})) push(svc);
			}
		} catch {
			return results;
		}
		return results;
	}
	if (process.platform === "linux") {
		try {
			const home = resolveDaemonHomeDir(env);
			const userDir = path.join(home, ".config", "systemd", "user");
			const userServices = await scanSystemdDir({
				dir: userDir,
				scope: "user"
			});
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
					legacy: true
				});
			}
			if (opts.deep) for (const dir of [
				"/etc/systemd/system",
				"/usr/lib/systemd/system",
				"/lib/systemd/system"
			]) for (const svc of await scanSystemdDir({
				dir,
				scope: "system"
			})) push(svc);
		} catch {
			return results;
		}
		return results;
	}
	if (process.platform === "win32") {
		if (!opts.deep) return results;
		const res = await execSchtasks([
			"/Query",
			"/FO",
			"LIST",
			"/V"
		]);
		if (res.code !== 0) return results;
		const tasks = parseSchtasksList(res.stdout);
		for (const task of tasks) {
			const name = task.name.trim();
			if (!name) continue;
			if (isOpenClawGatewayTaskName(name)) continue;
			const lowerName = normalizeLowercaseStringOrEmpty(name);
			const lowerCommand = normalizeLowercaseStringOrEmpty(task.taskToRun ?? "");
			let marker = null;
			for (const candidate of EXTRA_MARKERS) if (lowerName.includes(candidate) || lowerCommand.includes(candidate)) {
				marker = candidate;
				break;
			}
			if (!marker) continue;
			push({
				platform: "win32",
				label: name,
				detail: task.taskToRun ? `task: ${name}, run: ${task.taskToRun}` : name,
				scope: "system",
				marker,
				legacy: marker !== "openclaw"
			});
		}
		return results;
	}
	return results;
}
//#endregion
export { renderGatewayServiceCleanupHints as i, findExtraGatewayServices as n, findSystemGatewayServices as r, detectMarkerLineWithGateway as t };
