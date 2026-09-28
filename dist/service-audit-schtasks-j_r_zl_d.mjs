import { f as resolveGatewayServiceDescription } from "./constants-CJCmIHb-.mjs";
import { t as parseNodeOptionsEnvVar } from "./node-options-W869vrJq.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { r as getWindowsPowerShellExePath } from "./windows-install-roots-DK9gNoYN.mjs";
import { t as execFileUtf8 } from "./exec-file-DUc4AFoc.mjs";
import { a as resolveManagedGatewayServiceCommand } from "./service-types-d44oynyj.mjs";
import { o as resolveServiceEntrypointIndex } from "./service-layout-DuzmQnH1.mjs";
import { a as resolveGatewayHeapNodeOptions, r as readServiceHeapExecArgv } from "./gateway-heap-9PZ2gCSQ.mjs";
import { d as readManagedServiceEnvKeysFromEnvironment } from "./service-managed-env-BpvQFzJj.mjs";
import { f as normalizeServicePathEntry } from "./runtime-paths-DifTYoyV.mjs";
import { d as resolveTaskScriptPath, f as resolveTaskUser, i as buildTaskScript, l as resolveTaskLauncherScriptPath, n as buildScheduledTaskXml, o as readScheduledTaskCommand, t as buildHiddenLauncherScript, u as resolveTaskName, v as decodeWindowsLauncherScript } from "./schtasks-layout-ZxN1sGLi.mjs";
import { t as execSchtasks } from "./schtasks-exec-AWBr696q.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { DOMParser } from "linkedom";
//#region src/daemon/service-audit-preservation.ts
function serviceDefinitionPreserved(key, sourcePath) {
	return {
		kind: "preserved",
		key,
		sourcePath,
		message: `Custom ${key}; not changed.`
	};
}
function serviceDefinitionUnknown(key, reason, sourcePath) {
	return {
		kind: "unknown-edit",
		key,
		reason,
		sourcePath,
		message: `Gateway service ${key}: ${reason}`
	};
}
function isInstallerServiceDescription(value, env) {
	const current = resolveGatewayServiceDescription({ env });
	if (value === void 0 || value === current) return true;
	const prefix = current.endsWith(")") ? `${current.slice(0, -1)}, v` : `${current} (v`;
	return typeof value === "string" && value.startsWith(prefix) && /^\d{4}\.\d+\.\d+(?:[-+][\w.-]+)?\)$/u.test(value.slice(prefix.length));
}
function preservedArguments(argv) {
	const entrypoint = resolveServiceEntrypointIndex(argv);
	if (entrypoint === void 0) return;
	const native = argv.slice(1, entrypoint);
	const retained = [];
	for (let index = 0; index < native.length; index++) {
		const arg = native[index];
		if (resolveGatewayHeapNodeOptions(arg.includes("=") ? arg : `${arg} ${native[index + 1] ?? ""}`).startsWith(`${arg.split("=")[0].replaceAll("_", "-")}=`)) index += arg.includes("=") ? 0 : 1;
		else retained.push(arg);
	}
	return [
		...retained,
		...argv.slice(entrypoint + 1).filter((arg, index, args) => arg !== "--allow-unconfigured" && arg !== "--port" && !arg.startsWith("--port=") && (args[index - 1] !== "--port" || arg.startsWith("--"))),
		...readServiceHeapExecArgv(argv)
	];
}
function retains(current, expected) {
	if (!current || !expected) return false;
	let index = 0;
	for (const value of expected) if (value === current[index]) index++;
	return index === current.length;
}
/** Compare prepared installer output; reporting-only audit never constructs a rewrite plan. */
function auditGatewayInstallPreservation(command, expected, platform, findings) {
	const current = resolveManagedGatewayServiceCommand(command);
	if (!current) return;
	const unknown = (key) => findings.push(serviceDefinitionUnknown(key, "The installer would discard or change an operator setting.", command?.sourcePath));
	if (!retains(preservedArguments(current.programArguments), preservedArguments(expected.programArguments))) unknown("ProgramArguments");
	if (current.workingDirectory !== void 0 && (expected.workingDirectory === void 0 || normalizeServicePathEntry(current.workingDirectory, platform) !== normalizeServicePathEntry(expected.workingDirectory, platform))) unknown("WorkingDirectory");
	const normalize = (key) => platform === "win32" ? key.toUpperCase() : key;
	const next = new Map(Object.entries(expected.environment ?? {}).map(([key, value]) => [normalize(key), value]));
	const managed = readManagedServiceEnvKeysFromEnvironment(current.environment);
	for (const [key, value] of Object.entries(current.environment ?? {})) {
		const upper = key.toUpperCase();
		const replacement = next.get(normalize(key));
		if (platform === "win32" && upper === "PATH") {
			unknown(`Environment.${key}`);
			continue;
		}
		if (replacement === value || managed.has(upper) || upper === "OPENCLAW_SERVICE_MANAGED_ENV_KEYS" || upper === "OPENCLAW_GATEWAY_PORT" || upper === "OPENCLAW_SERVICE_VERSION" && /^\d{4}\.\d+\.\d+(?:[-+][\w.-]+)?$/u.test(value)) continue;
		if (upper === "PATH" && replacement !== void 0) {
			const paths = (text) => text.split(platform === "win32" ? ";" : ":").map((part) => normalizeServicePathEntry(part, platform));
			if (retains(paths(value), paths(replacement))) continue;
		}
		if (upper === "NODE_OPTIONS" && replacement !== void 0) {
			const args = (text) => {
				const tokens = parseNodeOptionsEnvVar(text);
				return tokens ? preservedArguments([
					"node",
					...tokens,
					"/service/index.js",
					"gateway"
				]) : void 0;
			};
			if (retains(args(value), args(replacement))) continue;
		}
		unknown(`Environment.${key}`);
	}
}
//#endregion
//#region src/daemon/service-audit-schtasks.ts
function elementKey(node) {
	return !node.parentElement || node.parentElement.tagName === "Task" ? node.tagName : `${elementKey(node.parentElement)}.${node.tagName}`;
}
async function auditScheduledTaskDefinition(env, findings, timeoutMs, expectedCommand, expectedXml) {
	const sourcePath = resolveTaskScriptPath(env);
	const hiddenPath = resolveTaskLauncherScriptPath({ OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER: "1" }, sourcePath);
	const query = await execSchtasks([
		"/Query",
		"/TN",
		resolveTaskName(env),
		"/XML"
	]);
	if (query.code !== 0) throw new Error("Scheduled Task definition could not be read.");
	const parser = new DOMParser();
	const xml = query.stdout.replace(/^\uFEFF/u, "").replaceAll(String.fromCharCode(0), "");
	const installed = parser.parseFromString(xml, "text/xml");
	if (installed.documentElement?.tagName !== "Task" || installed.doctype) throw new Error("Scheduled Task definition could not be decoded.");
	const expected = parser.parseFromString(expectedXml ?? buildScheduledTaskXml({
		taskDescription: "",
		taskUser: resolveTaskUser(env),
		launchPath: sourcePath
	}), "text/xml");
	if (expected.documentElement?.tagName !== "Task" || expected.doctype) throw new Error("Expected Scheduled Task definition could not be decoded.");
	const taskUser = expected.querySelector("Principals > Principal > UserId")?.textContent;
	const samePath = (left, right) => path.win32.normalize(left).toLowerCase() === path.win32.normalize(right).toLowerCase();
	const unknown = (key, reason) => findings.push({
		kind: "unknown-edit",
		key,
		reason,
		sourcePath,
		message: `Scheduled Task ${key} contains an unrecognized setting.`
	});
	const outdated = (key, current, value) => findings.push({
		kind: "outdated",
		key,
		current,
		expected: value,
		sourcePath,
		message: `Scheduled Task ${key} differs from the installer value ${value}.`
	});
	let userSid;
	if (taskUser && [...installed.querySelectorAll("Principal > UserId, LogonTrigger > UserId")].some((node) => node.textContent.toLowerCase() !== taskUser.toLowerCase())) {
		const encoded = Buffer.from(taskUser).toString("base64");
		const identity = await execFileUtf8(getWindowsPowerShellExePath(), [
			"-NoProfile",
			"-NonInteractive",
			"-Command",
			`$ErrorActionPreference='Stop'; $name=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${encoded}')); ([Security.Principal.NTAccount]$name).Translate([Security.Principal.SecurityIdentifier]).Value`
		], { timeout: timeoutMs ?? 15e3 });
		if (identity.code === 0 && /^S-1-[\d-]+$/u.test(identity.stdout.trim())) userSid = identity.stdout.trim();
	}
	const nativeDefaults = {
		"Settings.UseUnifiedSchedulingEngine": "false",
		"Settings.DisallowStartOnRemoteAppSession": "false",
		"Settings.Volatile": "false"
	};
	const released = {
		"Settings.DisallowStartIfOnBatteries": "true",
		"Settings.StopIfGoingOnBatteries": "true",
		"Settings.ExecutionTimeLimit": "PT72H",
		"Settings.IdleSettings.StopOnIdleEnd": "true",
		"Principals.Principal.LogonType": "S4U",
		"Settings.RestartOnFailure.Count": "0",
		"Settings.RestartOnFailure.Interval": "PT0S"
	};
	const preserved = /^(?:RegistrationInfo\.(?:Description|Date|Author|URI)|Actions\.Exec\.Command)$/u;
	const seen = /* @__PURE__ */ new Set();
	for (const node of [installed.documentElement, ...installed.querySelectorAll("Task *")]) {
		const key = elementKey(node);
		const canonical = key === "Task" ? expected.documentElement : expected.querySelector(key.replaceAll(".", " > "));
		if (seen.has(key)) unknown(key, "Duplicate native definition field.");
		seen.add(key);
		for (const attribute of /* @__PURE__ */ new Set([...node.getAttributeNames(), ...canonical?.getAttributeNames() ?? []])) if (!(key === "Task" && attribute === "version") && node.getAttribute(attribute) !== canonical?.getAttribute(attribute)) unknown(`${key}.@${attribute}`, "Native definition attribute differs from the installer.");
		const current = node.textContent;
		let nativeRegistration = false;
		if ((expectedCommand || expectedXml) && key.startsWith("RegistrationInfo.") && preserved.test(key)) {
			const recognized = key.endsWith("Description") ? isInstallerServiceDescription(current, env) : key.endsWith("Date") ? /^\d{4}-\d\d-\d\dT[\d:.+-]+Z?$/u.test(current) : key.endsWith("Author") ? current.toLowerCase() === taskUser?.toLowerCase() || current === userSid : current === `\\${resolveTaskName(env)}`;
			nativeRegistration = key !== "RegistrationInfo.Description" && recognized;
			if (!expectedXml && !recognized) unknown(key, "The installer would replace custom service metadata.");
		}
		if (!expectedXml && preserved.test(key) || expectedXml && (nativeRegistration || key === "Settings.Enabled" || key === "Actions.Exec.Command" && canonical && samePath(current, canonical.textContent)) || node.tagName === "UserId" && canonical && taskUser && (current.toLowerCase() === taskUser.toLowerCase() || current === userSid)) continue;
		if (!canonical && nativeDefaults[key] === current || canonical && (node.children.length || current === canonical.textContent)) continue;
		if (canonical && released[key] === current) outdated(key, current, canonical.textContent);
		else if (!expectedXml && canonical && (key.startsWith("Settings.") && key !== "Settings.Enabled" || key === "Triggers.LogonTrigger.Enabled")) findings.push(serviceDefinitionPreserved(key, sourcePath));
		else unknown(key, "The key or value is not a recognized installer setting.");
	}
	for (const node of expected.querySelectorAll("Task *")) {
		const key = elementKey(node);
		if (seen.has(key) || node.children.length || !expectedXml && preserved.test(key) || expectedXml && key === "Settings.Enabled" || key === "Principals.Principal.RunLevel" && node.textContent === "LeastPrivilege") continue;
		if (key.startsWith("Principals.") || key.endsWith("UserId")) unknown(key, "Installer identity field is missing.");
		else outdated(key, null, node.textContent);
	}
	const launcher = installed.querySelector("Actions > Exec > Command")?.textContent;
	if (!expectedXml && (!launcher || ![sourcePath, hiddenPath].some((candidate) => samePath(candidate, launcher)))) unknown("Actions.Exec.Command", "Native task points at an unrecognized launcher.");
	if (expectedCommand) {
		const command = await readScheduledTaskCommand(env, {
			requireEffective: true,
			timeoutMs
		});
		const normalize = (text) => text.split(/\r?\n/u).map((line) => line.trim()).filter((line) => {
			const comment = /^(?:rem |')(.+)$/iu.exec(line)?.[1];
			return line && !(comment && isInstallerServiceDescription(comment.trim(), env)) && line !== "set \"OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER=1\"";
		}).join("\n").replace(/(?: --task-supervisor)?(?:\s*<\s*NUL)?$/iu, "");
		const read = async (file) => decodeWindowsLauncherScript({ buffer: await fs.readFile(file) });
		if (!command || normalize(await read(sourcePath)) !== normalize(buildTaskScript(command))) unknown("TaskScript", "The generated task script contains unrecognized behavior.");
		const hiddenSelected = Boolean(launcher && samePath(launcher, hiddenPath));
		if (hiddenSelected || resolveTaskLauncherScriptPath({
			...env,
			...expectedCommand.environment
		}, sourcePath) !== sourcePath) {
			const legacy = `CreateObject("WScript.Shell").Run """${sourcePath.replaceAll("\"", "\"\"")}""", 0, False`;
			const generated = buildHiddenLauncherScript({
				scriptPath: sourcePath,
				taskSupervisor: command?.environment?.OPENCLAW_SERVICE_KIND === "gateway"
			});
			const installedLauncher = await read(hiddenPath).catch((error) => {
				if (!hiddenSelected && hasErrnoCode(error, "ENOENT")) return;
				throw error;
			});
			if (installedLauncher !== void 0 && ![legacy, generated].some((candidate) => normalize(candidate) === normalize(installedLauncher))) unknown("TaskLauncher", "The generated task launcher contains unrecognized behavior.");
		}
	}
	return xml;
}
//#endregion
export { serviceDefinitionUnknown as a, serviceDefinitionPreserved as i, auditGatewayInstallPreservation as n, isInstallerServiceDescription as r, auditScheduledTaskDefinition as t };
