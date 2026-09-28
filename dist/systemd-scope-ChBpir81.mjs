import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { c as isGatewayServiceEnv } from "./constants-CJCmIHb-.mjs";
import { r as isMissingPathError, t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import "./errors-DnjwnOju.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { i as ServiceOwnershipRefusalError } from "./service-inspection-error-axo4k_qi.mjs";
import { T as readSystemctlDetail, b as isSystemdUnitActive, c as resolveSystemdUnitPath, h as execSystemctl, p as execBusctlSystem, s as resolveSystemdServiceName } from "./systemd-service-files-tGuARbbA.mjs";
import { t as resolveDaemonHomeDir } from "./paths-B1MX98Zs.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/daemon/systemd-system.ts
/** Detects system-scope systemd ownership before mutating a user gateway unit. */
function formatUnknownError(error) {
	const raw = error instanceof Error ? error.message : String(error);
	return truncateUtf16Safe(sanitizeForLog(raw), 500);
}
function quotePosixArgument(value) {
	return /^[A-Za-z0-9_@%+=:,./-]+$/.test(value) ? value : `'${value.replaceAll("'", "'\\''")}'`;
}
function unverifiableSystemOwnership(unitName, detail, operation = "systemctl") {
	return {
		status: "unverifiable",
		unitName,
		operation,
		detail
	};
}
async function querySystemManager(unitName, run = execSystemctl) {
	const result = await run([
		"show",
		"--property=LoadState",
		"--value",
		unitName
	]);
	const loadState = result.stdout.trim().toLowerCase();
	if (result.code === 0) {
		if (loadState === "not-found") return {
			status: "absent",
			unitName
		};
		if (loadState) return {
			status: "loaded",
			unitName
		};
		return unverifiableSystemOwnership(unitName, "systemctl returned no LoadState");
	}
	const detail = readSystemctlDetail(result) || `systemctl exited with code ${result.code}`;
	const normalizedDetail = detail.toLowerCase();
	if (result.termination === "exit" && normalizedDetail.includes(unitName.toLowerCase()) && /not[- ]found|could not be found/i.test(normalizedDetail)) return {
		status: "absent",
		unitName
	};
	return unverifiableSystemOwnership(unitName, detail);
}
async function findInstalledSystemUnit(unitName, run = execSystemctl) {
	const result = await run([
		"show",
		"--property=UnitPath",
		"--value"
	]);
	if (result.code !== 0) return unverifiableSystemOwnership(unitName, readSystemctlDetail(result) || `systemctl exited with code ${result.code}`);
	const loadPaths = [...new Set(result.stdout.split(/\s+/).filter(path.posix.isAbsolute))];
	if (loadPaths.length === 0) return unverifiableSystemOwnership(unitName, "systemctl returned no system manager unit load paths");
	return await findInstalledSystemUnitInPaths(unitName, loadPaths);
}
async function findInstalledSystemUnitInPaths(unitName, loadPaths) {
	for (const dir of loadPaths) {
		const unitPath = path.posix.join(dir, unitName);
		try {
			await fs.lstat(unitPath);
			return {
				status: "installed",
				unitName,
				unitPath
			};
		} catch (error) {
			if (isMissingPathError(error)) continue;
			return unverifiableSystemOwnership(unitName, `${unitPath}: ${formatUnknownError(error)}`, "filesystem");
		}
	}
	return {
		status: "absent",
		unitName
	};
}
/** Do not activate a system manager or load a unit during update admission. */
async function inspectLoadedSystemOwnership(unitName, timeoutMs) {
	const manager = "org.freedesktop.systemd1";
	const bus = "org.freedesktop.DBus";
	const missingUnit = Symbol("affirmative native absence");
	const deadline = performance.now() + (timeoutMs && Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 5e3);
	const unavailable = () => /* @__PURE__ */ new Error("Non-loading system manager inspection unavailable.");
	const query = async (args, signature, allowMissing = false) => {
		const remaining = deadline - performance.now();
		if (remaining <= 0) throw unavailable();
		const result = await execBusctlSystem([
			"--auto-start=no",
			"--json=short",
			...args
		], remaining);
		if (result.termination !== "exit" || performance.now() >= deadline) throw unavailable();
		if (result.code !== 0) {
			if (allowMissing && [`Call failed: Unit ${unitName} not loaded.`, `Call failed: Unit ${unitName} not found.`].includes(result.stderr.trim())) return missingUnit;
			throw unavailable();
		}
		const parsed = asOptionalRecord(JSON.parse(result.stdout));
		if (parsed?.type !== signature) throw unavailable();
		return parsed.data;
	};
	const readOwner = async () => {
		const value = await query([
			"call",
			bus,
			"/org/freedesktop/DBus",
			bus,
			"GetNameOwner",
			"s",
			manager
		], "s");
		if (!Array.isArray(value) || value.length !== 1 || typeof value[0] !== "string" || !/^:[0-9]+\.[0-9]+$/.test(value[0])) throw unavailable();
		return value[0];
	};
	try {
		if (path.posix.basename(unitName) !== unitName) throw unavailable();
		const owner = await readOwner();
		const readLoaded = async () => {
			const value = await query([
				"call",
				owner,
				"/org/freedesktop/systemd1",
				`${manager}.Manager`,
				"GetUnit",
				"s",
				unitName
			], "o", true);
			if (value === missingUnit) return false;
			if (!Array.isArray(value) || value.length !== 1 || typeof value[0] !== "string" || !/^\/org\/freedesktop\/systemd1\/unit\/[A-Za-z0-9_]+$/.test(value[0])) throw unavailable();
			return true;
		};
		if (await readLoaded()) return {
			status: "loaded",
			unitName
		};
		const paths = await query([
			"get-property",
			owner,
			"/org/freedesktop/systemd1",
			`${manager}.Manager`,
			"UnitPath"
		], "as");
		if (!Array.isArray(paths) || paths.length === 0 || !paths.every((entry) => typeof entry === "string" && path.posix.isAbsolute(entry) && !entry.includes("\0"))) throw unavailable();
		const installed = await findInstalledSystemUnitInPaths(unitName, [...new Set(paths)]);
		if (installed.status !== "absent") return installed;
		if (await readLoaded()) return {
			status: "loaded",
			unitName
		};
		if (owner !== await readOwner()) throw unavailable();
		return {
			status: "absent",
			unitName
		};
	} catch (error) {
		return unverifiableSystemOwnership(unitName, formatUnknownError(error), "busctl");
	}
}
async function inspectSystemSystemdOwnership(unitName, timeoutMs, options) {
	if (process.platform !== "linux") return {
		status: "absent",
		unitName
	};
	if (options?.requireLoaded) return await inspectLoadedSystemOwnership(unitName, timeoutMs);
	const deadline = timeoutMs && timeoutMs > 0 ? performance.now() + timeoutMs : void 0;
	const remaining = () => deadline ? Math.max(1, deadline - performance.now()) : void 0;
	const run = (args) => execSystemctl(args, void 0, remaining());
	const initialQuery = await querySystemManager(unitName, run);
	if (initialQuery.status !== "absent") return initialQuery;
	const installed = await findInstalledSystemUnit(unitName, run);
	if (installed.status !== "absent") return installed;
	return await querySystemManager(unitName, run);
}
function isRunningAsRoot() {
	if (typeof process.geteuid !== "function") return false;
	try {
		return process.geteuid() === 0;
	} catch {
		return false;
	}
}
function formatSystemSystemdOwnershipError(ownership) {
	const privilegePrefix = isRunningAsRoot() ? "" : "sudo ";
	const unitName = quotePosixArgument(ownership.unitName);
	const summary = ownership.status === "loaded" ? `System systemd unit ${ownership.unitName} already owns this gateway unit name.` : ownership.status === "installed" ? `System systemd unit ${ownership.unitPath} already owns this gateway unit name.` : `System systemd ownership for ${ownership.unitName} could not be verified: ${ownership.detail}`;
	const installedInAdministratorPath = ownership.status === "installed" && (ownership.unitPath.startsWith("/etc/systemd/system/") || ownership.unitPath.startsWith("/etc/systemd/system.control/"));
	return [
		summary,
		"Refusing to create or activate a user systemd unit with the same name because duplicate managers can restart-loop the gateway.",
		"OpenClaw does not manage system-scope units, and --force does not override system ownership.",
		ownership.status === "loaded" ? `Keep it as the sole gateway manager, or inspect it with \`${privilegePrefix}systemctl cat ${unitName}\`, then disable it and uninstall or reconfigure the package, generator, or administrator unit that owns it before retrying.` : installedInAdministratorPath ? `Keep it as the sole gateway manager, or run \`${privilegePrefix}systemctl disable --now ${unitName}\`, \`${privilegePrefix}rm ${quotePosixArgument(ownership.unitPath)}\`, and \`${privilegePrefix}systemctl daemon-reload\` before retrying.` : ownership.status === "installed" ? `Keep it as the sole gateway manager, or inspect it with \`${privilegePrefix}systemctl cat ${unitName}\`, then uninstall or reconfigure the package, generator, or runtime owner of ${quotePosixArgument(ownership.unitPath)} before retrying.` : "Fix the reported systemctl or filesystem access error, then retry."
	].join("\n");
}
var SystemSystemdOwnershipError = class extends ServiceOwnershipRefusalError {
	constructor(ownership) {
		super("systemd-competing-managers", formatSystemSystemdOwnershipError(ownership));
		this.ownership = ownership;
		this.code = "SYSTEM_SYSTEMD_OWNERSHIP";
		this.name = "SystemSystemdOwnershipError";
	}
};
function isSystemSystemdOwnershipError(error) {
	return error instanceof SystemSystemdOwnershipError;
}
async function assertNoSystemSystemdOwnership(unitName, timeoutMs, options) {
	const ownership = await inspectSystemSystemdOwnership(unitName, timeoutMs, options);
	if (ownership.status !== "absent") throw new SystemSystemdOwnershipError(ownership);
}
//#endregion
//#region src/daemon/systemd-scope.ts
/** Installed systemd scope discovery and dueling-manager diagnostics. */
const SYSTEM_SYSTEMD_UNIT_DIRS = [
	"/etc/systemd/system",
	"/usr/lib/systemd/system",
	"/lib/systemd/system"
];
/** Proves service absence without interpreting failed manager commands as absence. */
async function isSystemdServiceAbsent(env, opts) {
	if (opts?.strictCommandAbsent) {
		await assertNoSystemSystemdOwnership(`${resolveSystemdServiceName(env)}.service`, opts.timeoutMs, { requireLoaded: true });
		return await findInstalledSystemdGatewayScope(env) === null;
	}
	if (env.DBUS_SESSION_BUS_ADDRESS || env.DBUS_SYSTEM_BUS_ADDRESS || env.SYSTEMD_UNIT_PATH || env.SUDO_USER || isGatewayServiceEnv(env) || typeof process.geteuid !== "function") return false;
	const home = resolveDaemonHomeDir(env);
	const runtimeDirs = new Set([`/run/user/${process.geteuid()}`, env.XDG_RUNTIME_DIR].filter((value) => Boolean(value)));
	const configHome = env.XDG_CONFIG_HOME || path.posix.join(home, ".config");
	const dataHome = env.XDG_DATA_HOME || path.posix.join(home, ".local/share");
	const userRoots = [
		path.posix.join(home, ".config"),
		configHome,
		dataHome,
		...(env.XDG_CONFIG_DIRS || "/etc/xdg").split(":"),
		...(env.XDG_DATA_DIRS || "/usr/local/share:/usr/share").split(":"),
		"/etc",
		"/usr/local/lib",
		"/usr/lib",
		"/lib"
	];
	const unitName = `${resolveSystemdServiceName(env)}.service`;
	if (![...runtimeDirs, ...userRoots].every((dir) => path.posix.isAbsolute(dir))) return false;
	const absentPaths = [
		"/run/systemd",
		...[...runtimeDirs].map((dir) => path.posix.join(dir, "systemd")),
		...userRoots.flatMap((dir) => [
			"user",
			"user.control",
			"user.attached"
		].map((scope) => path.posix.join(dir, "systemd", scope, unitName))),
		...[
			"/etc",
			"/usr/local/lib",
			"/usr/lib",
			"/lib"
		].flatMap((dir) => [
			"system",
			"system.control",
			"system.attached"
		].map((scope) => path.posix.join(dir, "systemd", scope, unitName)))
	];
	for (const candidate of absentPaths) try {
		await fs.lstat(candidate);
		return false;
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) return false;
	}
	return await findInstalledSystemdGatewayScope(env) === null;
}
async function findSystemSystemdUnitPath(env) {
	const serviceFile = `${resolveSystemdServiceName(env)}.service`;
	for (const dir of SYSTEM_SYSTEMD_UNIT_DIRS) {
		const candidate = path.posix.join(dir, serviceFile);
		try {
			await fs.access(candidate);
			return candidate;
		} catch {
			continue;
		}
	}
	return null;
}
async function assertNoSystemGatewayOwnership(env, timeoutMs) {
	if (env.OPENCLAW_SERVICE_KIND?.trim() === "node") return;
	await assertNoSystemSystemdOwnership(`${resolveSystemdServiceName(env)}.service`, timeoutMs);
}
/**
* Activation admission after the system-scope probe refused. An unverifiable
* probe cannot make a loaded user unit whose artifacts this account owns a
* competing manager; a proven system owner and an unloaded or foreign user unit
* still refuse with the original error.
*/
async function admitUserUnitActivationPastUnverifiableOwnership(env, error, timeoutMs) {
	if (!isSystemSystemdOwnershipError(error) || error.ownership.status !== "unverifiable") throw error;
	const { readSystemdDefinitionMutationCapability } = await import("./systemd-definition-mutation-DQT5ijlT.mjs");
	if ((await readSystemdDefinitionMutationCapability(env, {
		requireLoaded: true,
		...timeoutMs !== void 0 ? { timeoutMs } : {}
	}).catch(() => void 0))?.kind !== "writable") throw error;
}
async function findMarkerOwnedSystemSystemdUnit() {
	const { findSystemGatewayServices } = await import("./inspect-DmwMdwVG.mjs");
	let services;
	try {
		services = await findSystemGatewayServices();
	} catch {
		return null;
	}
	for (const svc of services) {
		if (svc.platform !== "linux" || svc.scope !== "system" || svc.marker !== "openclaw" || !svc.label?.endsWith(".service")) continue;
		const unitPath = /^unit:\s*(.+)$/.exec(svc.detail.trim())?.[1]?.trim();
		if (unitPath) return {
			unitName: svc.label,
			unitPath
		};
	}
	return null;
}
async function findUserSystemdGatewayScope(env) {
	const canonicalUnitName = `${resolveSystemdServiceName(env)}.service`;
	let userPath;
	try {
		userPath = resolveSystemdUnitPath(env);
	} catch {
		userPath = null;
	}
	if (!userPath) return null;
	try {
		await fs.access(userPath);
		return {
			scope: "user",
			unitName: canonicalUnitName,
			unitPath: userPath
		};
	} catch {
		return null;
	}
}
async function findSystemSystemdGatewayScope(env) {
	const canonicalUnitName = `${resolveSystemdServiceName(env)}.service`;
	const systemPath = await findSystemSystemdUnitPath(env);
	if (systemPath) return {
		scope: "system",
		unitName: canonicalUnitName,
		unitPath: systemPath
	};
	if (env.OPENCLAW_SERVICE_KIND?.trim() === "node") return null;
	const owned = await findMarkerOwnedSystemSystemdUnit();
	return owned ? {
		scope: "system",
		unitName: owned.unitName,
		unitPath: owned.unitPath
	} : null;
}
/**
* Canonical detector: reports every installed scope without early-returning,
* so a coexisting user + system unit surfaces as `dueling`.
*/
async function findSystemdGatewayInstallation(env) {
	const [user, system] = await Promise.all([findUserSystemdGatewayScope(env), findSystemSystemdGatewayScope(env)]);
	if (system) system.unitName = system.unitName.replace(/@\.service$/, () => `@${os.userInfo().username}.service`);
	if (user && system) {
		if (user.unitName === system.unitName) return {
			kind: "dueling",
			user,
			system
		};
		return {
			kind: "user",
			user
		};
	}
	if (user) return {
		kind: "user",
		user
	};
	if (system) return {
		kind: "system",
		system
	};
	return { kind: "none" };
}
/**
* The single scope to act on, preserving the long-standing user-first
* preference its four lifecycle callers (stop/restart/is-enabled/runtime)
* rely on. Dueling resolution (removing the redundant user unit) is handled
* separately by doctor via {@link findSystemdGatewayInstallation}; this
* function intentionally does not change lifecycle semantics.
*/
async function findInstalledSystemdGatewayScope(env) {
	const installation = await findSystemdGatewayInstallation(env);
	if (installation.kind === "dueling" || installation.kind === "user") return installation.user;
	if (installation.kind === "system") return installation.system;
	return null;
}
/**
* True only when the system-scope unit is running now AND persistently enabled
* at boot. Doctor's dueling repair deletes the user unit behind this probe, so
* both halves are required: an enabled-but-failed unit would leave no gateway
* until the next boot, and an active-but-unenabled unit would leave none after
* it. Uncheckable (systemctl missing/erroring) reads as false so the repair
* fails closed to hints rather than removing a working user-scope gateway.
*/
async function isSystemUnitActiveAndEnabled(env, unitName) {
	const active = await isSystemdUnitActive(env, unitName, "system");
	if (!active.ok || !active.value) return false;
	const res = await execSystemctl(["is-enabled", unitName], env);
	if (res.code !== 0) return false;
	return normalizeLowercaseStringOrEmpty(res.stdout) === "enabled";
}
/**
* Builds the operator-facing warning for a `dueling` installation, or null for
* any other state. Pure (no I/O) so the startup guard's messaging is unit
* testable without faking the whole service-mode boot path.
*/
function formatDuelingScopesWarning(installation, port) {
	if (installation.kind !== "dueling") return null;
	const { user, system } = installation;
	return `detected BOTH a user-scope (${user.unitPath}) and a system-scope (${system.unitPath}) gateway unit bound to port ${port}; they will SIGTERM each other in a restart loop. Run \`openclaw doctor\` interactively to inspect both scopes and review supported cleanup.`;
}
//#endregion
export { formatDuelingScopesWarning as a, assertNoSystemSystemdOwnership as c, findSystemdGatewayInstallation as i, isSystemSystemdOwnershipError as l, assertNoSystemGatewayOwnership as n, isSystemUnitActiveAndEnabled as o, findInstalledSystemdGatewayScope as r, isSystemdServiceAbsent as s, admitUserUnitActivationPastUnverifiableOwnership as t };
