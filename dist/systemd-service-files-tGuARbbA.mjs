import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { p as resolveGatewaySystemdServiceName } from "./constants-CJCmIHb-.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { i as readRegularFileSync } from "./regular-file-D4i0kJHS.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { a as normalizeEnvVarKey, n as isDangerousHostEnvOverrideVarName, r as isDangerousHostEnvVarName } from "./host-env-security-D7wdDMke.mjs";
import { a as collectConfigServiceEnvVars } from "./config-env-vars-BHI12YH5.mjs";
import { a as findServiceOwnershipRefusal, i as ServiceOwnershipRefusalError, n as ServiceDefinitionInspectionError, r as ServiceInspectionError } from "./service-inspection-error-axo4k_qi.mjs";
import { i as assertGatewayServiceUpdateCurrent } from "./service-update-authority-DujRnzx9.mjs";
import { t as execFileUtf8 } from "./exec-file-DUc4AFoc.mjs";
import { n as normalizeWindowsPathSeparators } from "./output-EUQq_O0z.mjs";
import { t as resolveDaemonHomeDir } from "./paths-B1MX98Zs.mjs";
import { a as resolveSystemdUserTransport, d as isSystemctlMissingDetail, f as isSystemdUserBusUnavailableDetail, l as openSystemdUserManager, m as decodeLegacyBusctlOutput, p as resolveUnavailableSystemdInspectionReason, t as SYSTEMD_TRANSPORT_DEADLINE, u as classifySystemdUnavailableDetail } from "./systemd-user-transport-ZcY1z7CT.mjs";
import { i as parseSystemdExecStart, l as splitSystemdEnvironmentWords, r as parseSystemdEnvAssignments, u as splitSystemdLogicalLines } from "./systemd-unit-CKIkv32Z.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { parse as parse$1 } from "dotenv";
import { Minimatch } from "minimatch";
//#region src/config/state-dir-dotenv.ts
/** Maximum bytes to read from the state-directory .env file. */
const MAX_STATE_DIR_DOTENV_BYTES = 1048576;
const log = createSubsystemLogger("config/dotenv");
function isBlockedServiceEnvVar(key) {
	return key.toUpperCase() === "OPENCLAW_ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS" || isDangerousHostEnvVarName(key) || isDangerousHostEnvOverrideVarName(key);
}
function unwrapMatchingLiteralQuotes(value) {
	if (value.length < 2) return value;
	const first = value[0];
	const last = value.at(-1);
	if ((first === `"` || first === `'`) && first === last) return value.slice(1, -1);
	return value;
}
/** Returns true when a dotenv value is only a shell reference, not an expanded secret. */
function isUnresolvedShellReference(value) {
	const candidate = unwrapMatchingLiteralQuotes(value.trim());
	return /^\$[A-Z_][A-Z0-9_]*$/.test(candidate) || /^\$\{[A-Z_][A-Z0-9_]*[^}]*\}$/.test(candidate) || /^\$\([^)]*\)$/.test(candidate);
}
function parseStateDirDotEnvContent(content) {
	const entries = {};
	const skippedShellReferenceKeys = [];
	for (const [rawKey, value] of Object.entries(parse$1(content))) {
		if (!value?.trim()) continue;
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (!key) continue;
		if (isBlockedServiceEnvVar(key)) continue;
		if (isUnresolvedShellReference(value)) {
			skippedShellReferenceKeys.push(key);
			continue;
		}
		entries[key] = value;
	}
	return {
		entries,
		skippedShellReferenceKeys
	};
}
/**
* Read and parse the state-dir `.env`, returning both the persisted entries and
* the keys that were skipped because they held unresolved shell references. The
* skipped keys are surfaced so generated service env files can remove stale
* literal references for keys OpenClaw previously managed.
*/
function readStateDirDotEnvFromStateDir(stateDir) {
	const dotEnvPath = path.join(stateDir, ".env");
	try {
		const resolved = fs.realpathSync(dotEnvPath);
		const { buffer } = readRegularFileSync({
			filePath: resolved,
			maxBytes: MAX_STATE_DIR_DOTENV_BYTES
		});
		return parseStateDirDotEnvContent(buffer);
	} catch (err) {
		if (err instanceof Error && err.message.startsWith("File exceeds")) log.warn(`skipping oversized state-directory .env file (max ${MAX_STATE_DIR_DOTENV_BYTES} bytes): ${dotEnvPath}`);
		return {
			entries: {},
			skippedShellReferenceKeys: []
		};
	}
}
/**
* Read and parse `~/.openclaw/.env` (or `$OPENCLAW_STATE_DIR/.env`), returning
* a filtered record of key-value pairs suitable for a managed service
* environment source.
*/
function readStateDirDotEnvVars(env) {
	return readStateDirDotEnvFromStateDir(resolveStateDir(env)).entries;
}
/** Collects durable service env vars from state-dir `.env` and config, preserving each source. */
function collectDurableServiceEnvVarSources(params) {
	const stateDirDotEnvEnvironment = readStateDirDotEnvVars(params.env);
	const configEnvironment = collectConfigServiceEnvVars(params.config);
	return {
		stateDirDotEnvEnvironment,
		configEnvironment,
		durableEnvironment: {
			...stateDirDotEnvEnvironment,
			...configEnvironment
		}
	};
}
/**
* Durable service env sources survive beyond the invoking shell and are safe to
* persist into owner-only gateway service environment sources.
*
* Precedence:
* 1. state-dir `.env` file vars
* 2. config service env vars
*/
function collectDurableServiceEnvVars(params) {
	return collectDurableServiceEnvVarSources(params).durableEnvironment;
}
//#endregion
//#region src/daemon/systemd-exec.ts
/** systemctl execution, user-manager routing, and availability probes. */
async function execSystemdCommand(command, args, env, timeoutMs) {
	return await execFileUtf8(command, args, {
		env: env ? {
			...process.env,
			...env
		} : process.env,
		...timeoutMs && timeoutMs > 0 ? {
			timeout: timeoutMs,
			killSignal: "SIGKILL"
		} : {}
	});
}
async function execSystemctl(args, env, timeoutMs) {
	return await execSystemdCommand("systemctl", args, env, timeoutMs);
}
/** System-manager reads never inherit user-bus routing. */
async function execBusctlSystem(args, timeoutMs) {
	return await execSystemdCommand("busctl", ["--system", ...args], void 0, timeoutMs);
}
function readSystemctlDetail(result) {
	return `${result.stderr} ${result.stdout}`.trim();
}
function systemdInspectionError(result, fallback, scope = "user") {
	if (result.inspectionReason) return new ServiceInspectionError(result.inspectionReason);
	if (result.termination === "timeout" || result.termination === "no-output-timeout") return new ServiceInspectionError("systemd-inspection-deadline-exceeded");
	if (result.termination === "error" && ["EACCES", "EPERM"].includes(result.errorCode ?? "")) return new ServiceInspectionError("service-manager-access-denied");
	if (scope === "system" && result.termination === "exit" && readSystemctlDetail(result).includes("System has not been booted with systemd")) return new ServiceInspectionError("service-manager-unavailable");
	if (scope === "user" && result.termination === "exit" && isSystemdUserBusUnavailableDetail(readSystemctlDetail(result))) return new ServiceInspectionError("systemd-user-bus-unavailable");
	return new Error(fallback);
}
function isSystemctlMissing(result) {
	return result.errorCode === "ENOENT" || result.errorCode === "EACCES" || result.termination === "exit" && isSystemctlMissingDetail(readSystemctlDetail(result));
}
function isSystemdUnitNotEnabled(detail) {
	if (!detail) return false;
	const normalized = normalizeLowercaseStringOrEmpty(detail);
	return normalized.includes("disabled") || normalized.includes("static") || normalized.includes("indirect") || normalized.includes("masked") || normalized.includes("not-found") || normalized.includes("could not be found") || normalized.includes("failed to get unit file state");
}
function isSystemdUnitMissingDetail(detail) {
	if (!detail) return false;
	const normalized = normalizeLowercaseStringOrEmpty(detail);
	return normalized.includes("unit file") && normalized.includes("does not exist") || normalized.includes("not-found") || normalized.includes("could not be found");
}
function isSystemdUnitAlreadyMissingOrInactive(detail, unitName) {
	const escapedUnitName = escapeRegExp(normalizeLowercaseStringOrEmpty(unitName));
	return new RegExp(`^(?:failed to (?:disable unit|stop\\s+${escapedUnitName}):\\s*)?(?:unit file\\s+${escapedUnitName}\\s+does not exist|unit\\s+${escapedUnitName}(?:\\s+is)?\\s+(?:inactive|not\\s+active|not\\s+loaded|not-found|could not be found))[.!]?$`, "u").test(normalizeLowercaseStringOrEmpty(detail));
}
const isSystemctlBusUnavailable = isSystemdUserBusUnavailableDetail;
function isSystemdUserScopeUnavailable(detail) {
	return classifySystemdUnavailableDetail(detail) !== null;
}
function isGenericSystemctlIsEnabledFailure(detail) {
	if (!detail) return false;
	const normalized = normalizeLowercaseStringOrEmpty(detail);
	return normalized.startsWith("command failed: systemctl") && normalized.includes(" is-enabled ") && !normalized.includes("permission denied") && !normalized.includes("access denied") && !normalized.includes("no space left") && !normalized.includes("read-only file system") && !normalized.includes("out of memory") && !normalized.includes("cannot allocate memory");
}
function isNonFatalSystemdInstallProbeError(error) {
	const detail = error instanceof Error ? error.message : typeof error === "string" ? error : "";
	if (!detail) return false;
	const normalized = normalizeLowercaseStringOrEmpty(detail);
	return isSystemctlBusUnavailable(normalized) || isGenericSystemctlIsEnabledFailure(normalized);
}
async function execSystemdUserCommand(command, env, args, timeoutMs, assertCurrent) {
	const deadline = timeoutMs && timeoutMs > 0 ? performance.now() + timeoutMs : void 0;
	try {
		const transport = await resolveSystemdUserTransport(env, deadline, assertCurrent);
		if (transport?.kind === "private" && command === "busctl") throw new ServiceInspectionError("systemd-user-bus-unavailable");
		const childEnv = !transport || transport.kind === "machine" ? env : {
			...env,
			XDG_RUNTIME_DIR: transport.kind === "private" || command === "busctl" ? transport.runtimeDir : void 0,
			DBUS_SESSION_BUS_ADDRESS: transport.address
		};
		assertCurrent?.();
		const remaining = deadline === void 0 ? void 0 : Math.ceil(deadline - performance.now());
		if (remaining !== void 0 && remaining <= 0) return {
			code: 1,
			termination: "timeout",
			stdout: "",
			stderr: "systemd user manager command deadline expired"
		};
		return await execSystemdCommand(command, [...transport?.kind === "machine" ? [
			"--machine",
			`${transport.user}@`,
			"--user"
		] : ["--user"], ...args], childEnv, remaining);
	} catch (error) {
		assertCurrent?.();
		if (!(error instanceof ServiceInspectionError)) throw error;
		return {
			code: 1,
			termination: error === SYSTEMD_TRANSPORT_DEADLINE ? "timeout" : "error",
			stdout: "",
			stderr: error.message,
			inspectionReason: error.reason
		};
	}
}
async function execSystemctlUser(env, args, timeoutMs, assertCurrent) {
	return await execSystemdUserCommand("systemctl", env, args, timeoutMs, assertCurrent);
}
async function execBusctlUser(env, args, timeoutMs, assertCurrent) {
	return await execSystemdUserCommand("busctl", env, args, timeoutMs, assertCurrent);
}
async function disableSystemdUserUnitForRemoval(env, unitName) {
	const result = await execSystemctlUser(env, [
		"disable",
		"--now",
		unitName
	]);
	if (result.code === 0) return;
	const detail = readSystemctlDetail(result);
	if (result.termination === "exit" && isSystemdUnitAlreadyMissingOrInactive(detail, unitName)) return;
	throw new Error(`systemctl disable failed: ${detail || "unknown error"}`);
}
async function reloadSystemdUserManager(env, timeoutMs, assertCurrent) {
	const result = await execSystemctlUser(env, ["daemon-reload"], timeoutMs, assertCurrent);
	if (result.code !== 0) throw new Error(`systemctl daemon-reload failed: ${readSystemctlDetail(result) || "unknown error"}`);
}
async function isSystemdUserServiceAvailable(env = process.env) {
	const res = await execSystemctlUser(env, ["status"]);
	const detail = readSystemctlDetail(res);
	return res.termination === "exit" && (res.code === 0 || Boolean(detail) && !isSystemdUserScopeUnavailable(detail));
}
async function isSystemdUnitActive(env, unitName, scope = "user") {
	const normalizedUnit = unitName.trim();
	if (!normalizedUnit) return ok(false);
	const args = [
		"is-active",
		"--quiet",
		normalizedUnit
	];
	const res = scope === "system" ? await execSystemctl(args) : await execSystemctlUser(env, args);
	if (res.termination === "exit" && [
		0,
		3,
		4
	].includes(res.code)) return ok(res.code === 0);
	return err(readSystemctlDetail(res) || `systemctl is-active exited with code ${res.code}`);
}
async function assertSystemdAvailable(env = process.env, timeoutMs) {
	const res = await execSystemctlUser(env, ["status"], timeoutMs);
	if (res.code === 0) return;
	const detail = readSystemctlDetail(res);
	if (isSystemctlMissing(res)) throw systemdInspectionError(res, "systemctl not available; systemd user services are required on Linux.");
	if (res.termination === "exit" && detail && !isSystemdUserScopeUnavailable(detail)) return;
	throw systemdInspectionError(res, `systemctl --user unavailable: ${detail || "unknown error"}`.trim());
}
async function isSystemctlAvailable(env) {
	const res = await execSystemctl(["--version"], env);
	return res.code === 0 || !isSystemctlMissing(res);
}
/** Authenticate the existing unique manager owner before loading a bound unit.
* The caller supplies its deadline- and custody-checked D-Bus query. */
async function bindSystemdManagerOwner(query, managerUid, unavailable) {
	const manager = "org.freedesktop.systemd1";
	const readOwner = async () => {
		const [value] = await query([
			"call",
			"org.freedesktop.DBus",
			"/org/freedesktop/DBus",
			"org.freedesktop.DBus",
			"GetNameOwner",
			"s",
			manager
		], ["s"]) ?? [];
		if (!Array.isArray(value) || value.length !== 1 || typeof value[0] !== "string" || !/^:[0-9]+\.[0-9]+$/.test(value[0])) throw unavailable();
		return value[0];
	};
	const destination = await readOwner();
	const [uid] = await query([
		"call",
		"org.freedesktop.DBus",
		"/org/freedesktop/DBus",
		"org.freedesktop.DBus",
		"GetConnectionUnixUser",
		"s",
		destination
	], ["u"]) ?? [];
	if (!Number.isInteger(managerUid) || managerUid < 0 || managerUid >= 4294967295 || !Array.isArray(uid) || uid.length !== 1 || !Number.isInteger(uid[0])) throw unavailable();
	if (uid[0] !== managerUid) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
	return {
		destination,
		async verify() {
			if (destination !== await readOwner()) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
		}
	};
}
//#endregion
//#region src/daemon/systemd-command-query.ts
/** Deadline- and custody-bound effective command queries for the systemd reader. */
async function createSystemdCommandQuery(env, unitName, opts, unavailable) {
	const manager = "org.freedesktop.systemd1";
	const timeoutMs = opts?.timeoutMs && opts.timeoutMs > 0 ? opts.timeoutMs : 5e3;
	const deadlineAt = performance.now() + timeoutMs;
	const inspection = opts?.requireLoaded ? opts.loadForInspection : void 0;
	const scope = opts?.systemdReadTarget?.scope ?? "user";
	const peer = opts?.systemdReadBinding;
	if (peer && (scope === "system" || peer.unit !== unitName || inspection && peer.managerUid !== inspection.managerUid)) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
	if (scope === "system" && inspection && inspection.managerUid !== 0) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
	const transport = peer || scope === "system" ? void 0 : await resolveSystemdUserTransport(env, deadlineAt, inspection?.assertReadCurrent ?? inspection?.assertCurrent, opts?.requireLoaded ? "admission" : "inspection");
	if (transport?.kind === "private" && opts?.requireLoaded) throw new ServiceInspectionError("systemd-user-bus-unavailable");
	const managerPeer = !opts?.requireLoaded && transport?.kind === "private" ? await openSystemdUserManager(transport.address, deadlineAt).catch((error) => {
		assertGatewayServiceUpdateCurrent();
		const refusal = findServiceOwnershipRefusal(error);
		if (refusal) throw refusal;
		throw new ServiceInspectionError("systemd-user-bus-unavailable");
	}) : void 0;
	const managerUid = scope === "system" ? 0 : inspection?.managerUid;
	let remainingCalls = managerUid !== void 0 ? 6 : 3;
	let legacyOutput = false;
	const query = async (args, signatures) => {
		if (managerPeer) try {
			return await managerPeer.query(args, signatures, deadlineAt);
		} catch (error) {
			assertGatewayServiceUpdateCurrent();
			const refusal = findServiceOwnershipRefusal(error);
			if (refusal) throw refusal;
			if (error instanceof ServiceInspectionError) throw error;
			throw new ServiceInspectionError("systemd-user-bus-unavailable");
		}
		const assertCurrent = (args[0] === "call" && args[4] === "LoadUnit" ? void 0 : inspection?.assertReadCurrent) ?? inspection?.assertCurrent;
		if (performance.now() >= deadlineAt) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
		if (managerUid !== void 0 && remainingCalls <= 0) throw unavailable();
		if (peer) {
			assertCurrent?.();
			const values = await peer.query(args, signatures, deadlineAt, inspection);
			assertCurrent?.();
			if (performance.now() >= deadlineAt) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
			return values;
		}
		const callTimeout = Math.max(1, Math.floor((deadlineAt - performance.now()) / remainingCalls--));
		const callDeadline = Math.min(deadlineAt, performance.now() + callTimeout);
		const exec = async (queryArgs, budget) => {
			if (scope === "system") {
				assertCurrent?.();
				return await execBusctlSystem(queryArgs, budget);
			}
			return await execBusctlUser(env, queryArgs, budget, assertCurrent);
		};
		let result = await exec([
			...legacyOutput ? [] : ["--json=short"],
			...opts?.requireLoaded ? ["--auto-start=no"] : [],
			...args
		], callTimeout);
		assertCurrent?.();
		if (!legacyOutput && result.termination === "exit" && result.code === 1 && result.stdout === "" && result.stderr.trim() === "busctl: unrecognized option '--json=short'") {
			const remaining = Math.floor(callDeadline - performance.now());
			if (remaining <= 0) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
			legacyOutput = true;
			result = await exec([...opts?.requireLoaded ? ["--auto-start=no"] : [], ...args], remaining);
			assertCurrent?.();
		}
		if (result.termination === "error" && result.errorCode === "ENOENT") {
			const reason = scope === "system" ? await resolveUnavailableSystemdInspectionReason("systemd-busctl-unavailable", process.env, callDeadline) : "systemd-busctl-unavailable";
			assertCurrent?.();
			throw new ServiceInspectionError(reason);
		}
		if (performance.now() >= (legacyOutput ? callDeadline : deadlineAt)) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
		if (legacyOutput && result.termination !== "exit") throw systemdInspectionError(result, unavailable().message, scope);
		if (managerUid !== void 0 && result.termination !== "exit") throw systemdInspectionError(result, unavailable().message, scope);
		if (result.code !== 0) {
			const detail = result.stderr.trim();
			if (result.termination === "exit" && (args.includes("LoadUnit") && detail === `Call failed: Unit ${unitName} not found.` || args.includes("GetUnit") && (detail === `Call failed: Unit ${unitName} not loaded.` || detail === `Call failed: Unit ${unitName} not found.`) || args.includes("GetUnitFileState") && (detail === `Call failed: Unit file ${unitName} does not exist.` || detail === "Call failed: No such file or directory"))) return null;
			throw systemdInspectionError(result, unavailable().message, scope);
		}
		if (legacyOutput) return decodeLegacyBusctlOutput(result.stdout, signatures, args[0] === "call");
		const properties = result.stdout.trim().split(/\r?\n/).map((line) => asOptionalRecord(JSON.parse(line)));
		if (properties.length !== signatures.length || !properties.every((property, index) => property?.type === signatures[index])) throw unavailable();
		return properties.map((property) => property?.data);
	};
	const binding = peer ?? (managerUid !== void 0 ? await bindSystemdManagerOwner(query, managerUid, unavailable) : void 0);
	return {
		query,
		binding,
		destination: binding?.destination ?? manager,
		close: async () => {
			await managerPeer?.close();
		}
	};
}
//#endregion
//#region src/daemon/systemd-environment-file-pattern.ts
/** Expand systemd POSIX EnvironmentFile patterns without normalizing literal path bytes. */
async function expandSystemdEnvironmentFilePattern(pattern) {
	const [parts] = new Minimatch(pattern, {
		nobrace: true,
		noext: true,
		noglobstar: true,
		platform: "linux",
		optimizationLevel: 0
	}).set;
	if (!parts) return [];
	if (parts.every((part) => typeof part === "string")) return [parts.join("/")];
	let pathnames = ["/"];
	for (const part of parts.slice(1)) {
		const matches = [];
		for (const parent of pathnames) {
			const prefix = parent.endsWith("/") ? parent : `${parent}/`;
			if (typeof part === "string") {
				matches.push(`${prefix}${part}`);
				continue;
			}
			try {
				for (const entry of await fs$1.readdir(parent)) if (part instanceof RegExp && part.test(entry)) matches.push(`${prefix}${entry}`);
			} catch (error) {
				if (!hasErrnoCode(error, "ENOENT") && !hasErrnoCode(error, "ENOTDIR")) throw error;
			}
		}
		pathnames = matches;
	}
	const existing = [];
	for (const pathname of pathnames) try {
		await fs$1.lstat(pathname);
		existing.push(pathname);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT") && !hasErrnoCode(error, "ENOTDIR")) throw error;
	}
	return existing;
}
//#endregion
//#region src/daemon/systemd-service-files.ts
/** Linux systemd unit paths and environment-file parsing. */
const SYSTEMD_GATEWAY_DOTENV_FILENAME = "gateway.systemd.env";
const SYSTEMD_NODE_DOTENV_FILENAME = "node.systemd.env";
function assertSystemdServiceAccount(user) {
	const account = os.userInfo();
	if (user !== account.username && user !== String(account.uid) && !(user === "" && account.uid === 0)) throw new ServiceOwnershipRefusalError("systemd-account-refused");
	return account;
}
function resolveSystemdUnitPathForName(env, name) {
	const home = normalizeWindowsPathSeparators(resolveDaemonHomeDir(env));
	return path.posix.join(home, ".config", "systemd", "user", `${name}.service`);
}
function resolveSystemdServiceName(env) {
	const override = env.OPENCLAW_SYSTEMD_UNIT?.trim();
	if (override) return override.endsWith(".service") ? override.slice(0, -8) : override;
	return resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE);
}
function resolveSystemdUnitPath(env) {
	return resolveSystemdUnitPathForName(env, resolveSystemdServiceName(env));
}
const UNKNOWN_SYSTEMD_OVERRIDES = {
	launcher: "command",
	environment: true
};
async function buildSystemdCommandSnapshot(params) {
	const fileEnvironment = await resolveSystemdEnvironmentFiles(params);
	const environment = {
		...params.inlineEnvironment,
		...fileEnvironment
	};
	const environmentValueSources = Object.fromEntries(Object.keys(params.inlineEnvironment).map((key) => [key, "inline"]));
	for (const key of Object.keys(fileEnvironment)) environmentValueSources[key] = Object.hasOwn(params.inlineEnvironment, key) ? "inline-and-file" : "file";
	for (const assignment of params.unsetEnvironment) {
		const separator = assignment.indexOf("=");
		const key = separator < 0 ? assignment : assignment.slice(0, separator);
		if (separator < 0 || environment[key] === assignment.slice(separator + 1)) {
			delete environment[key];
			delete environmentValueSources[key];
		}
	}
	return {
		programArguments: params.programArguments,
		...params.workingDirectory ? { workingDirectory: params.workingDirectory } : {},
		...Object.keys(environment).length > 0 ? {
			environment,
			environmentValueSources
		} : {}
	};
}
async function readSystemdManagerCommand(env, localDefinition, managedUnsetEnvironment, opts) {
	const manager = "org.freedesktop.systemd1";
	const target = opts?.systemdReadTarget;
	const unitName = target?.unitName ?? `${resolveSystemdServiceName(env)}.service`;
	const systemScope = target?.scope === "system";
	const unavailable = () => /* @__PURE__ */ new Error("Effective systemd service command could not be inspected.");
	const inspection = opts?.requireLoaded ? opts.loadForInspection : void 0;
	const { query, binding, destination, close } = await createSystemdCommandQuery(env, unitName, opts, unavailable);
	try {
		const assertAbsentWithoutLoading = async () => {
			if (localDefinition) throw unavailable();
			if (await query([
				"call",
				destination,
				"/org/freedesktop/systemd1",
				`${manager}.Manager`,
				"GetUnitFileState",
				"s",
				unitName
			], ["s"]) !== null) throw unavailable();
			return null;
		};
		const loaded = await query([
			"call",
			destination,
			"/org/freedesktop/systemd1",
			`${manager}.Manager`,
			opts?.requireLoaded && !inspection ? "GetUnit" : "LoadUnit",
			"s",
			unitName
		], ["o"]);
		if (!loaded) return opts?.requireLoaded ? await assertAbsentWithoutLoading() : null;
		const loadedUnit = loaded[0];
		const unitPath = Array.isArray(loadedUnit) && loadedUnit.length === 1 ? loadedUnit[0] : null;
		if (typeof unitPath !== "string" || !unitPath) throw unavailable();
		const readProperties = (scope, names, signatures) => query([
			"get-property",
			destination,
			unitPath,
			`${manager}.${scope}`,
			...names
		], signatures);
		const isStringArray = (value) => Array.isArray(value) && value.every((entry) => typeof entry === "string");
		const [sourcePath, dropInPaths, reloadPending, loadState] = await readProperties("Unit", [
			"FragmentPath",
			"DropInPaths",
			"NeedDaemonReload",
			"LoadState"
		], [
			"s",
			"as",
			"b",
			"s"
		]) ?? [];
		if (loadState === "not-found") return opts?.requireLoaded ? await assertAbsentWithoutLoading() : null;
		if (loadState !== "loaded" || typeof sourcePath !== "string" || !sourcePath || !isStringArray(dropInPaths) || dropInPaths.some((pathname) => !pathname) || typeof reloadPending !== "boolean") throw unavailable();
		const [executions, workingDirectory, assignments, fileSpecs, unset, user] = await readProperties("Service", [
			"ExecStart",
			"WorkingDirectory",
			"Environment",
			"EnvironmentFiles",
			"UnsetEnvironment",
			...systemScope ? ["User"] : []
		], [
			"a(sasbttttuii)",
			"s",
			"as",
			"a(sb)",
			"as",
			...systemScope ? ["s"] : []
		]) ?? [];
		const execution = Array.isArray(executions) && executions.length === 1 ? executions[0] : null;
		const programArguments = Array.isArray(execution) ? execution[1] : null;
		if (!Array.isArray(execution) || execution.length !== 10 || typeof execution[0] !== "string" || execution[0].length === 0 || typeof execution[2] !== "boolean" || !execution.slice(3).every(Number.isInteger) || !isStringArray(programArguments) || programArguments.length === 0 || typeof workingDirectory !== "string" || !isStringArray(assignments) || !Array.isArray(fileSpecs) || !fileSpecs.every((spec) => Array.isArray(spec) && spec.length === 2 && typeof spec[0] === "string" && path.posix.isAbsolute(spec[0]) && typeof spec[1] === "boolean") || !isStringArray(unset) || unset.some((assignment) => !assignment || assignment.startsWith("="))) throw unavailable();
		const inlineEnvironment = {};
		for (const assignment of assignments) {
			const separator = assignment.indexOf("=");
			if (separator <= 0) throw unavailable();
			inlineEnvironment[assignment.slice(0, separator)] = assignment.slice(separator + 1);
		}
		if (systemScope && typeof user !== "string") throw unavailable();
		const account = systemScope && typeof user === "string" ? opts?.requireEffective ? assertSystemdServiceAccount(user) : os.userInfo() : void 0;
		const sameAccount = account && (user === account.username || user === String(account.uid) || user === "" && account.uid === 0);
		await binding?.verify();
		const managedDefinition = !systemScope && sourcePath === resolveSystemdUnitPath(env) ? localDefinition : null;
		const managedOverrides = !reloadPending && managedDefinition ? await readSystemdDropInOverrides(dropInPaths, managedUnsetEnvironment, env).catch(() => UNKNOWN_SYSTEMD_OVERRIDES) : UNKNOWN_SYSTEMD_OVERRIDES;
		const snapshot = await buildSystemdCommandSnapshot({
			programArguments,
			workingDirectory: workingDirectory.replace(/^!/, ""),
			inlineEnvironment,
			environmentFileSpecs: fileSpecs,
			unsetEnvironment: unset,
			failOnUnavailable: opts?.requireEffective
		});
		if (sameAccount && !Object.hasOwn(snapshot.environment ?? {}, "HOME") && !unset.some((assignment) => assignment === "HOME" || assignment === `HOME=${account.homedir}`)) snapshot.environment = {
			...snapshot.environment,
			HOME: account.homedir
		};
		return {
			...snapshot,
			...managedDefinition && managedOverrides ? {
				managedDefinition,
				managedOverrides
			} : {},
			sourcePath,
			definitionPaths: [sourcePath, ...dropInPaths],
			...reloadPending ? { reloadPending: true } : {}
		};
	} finally {
		await close();
	}
}
async function readSystemdDropInOverrides(dropInPaths, managedUnsetEnvironment, env) {
	const inlineEnvironmentKeys = /* @__PURE__ */ new Set();
	const fileEnvironmentKeys = /* @__PURE__ */ new Set();
	const unsetEnvironmentKeys = /* @__PURE__ */ new Set();
	const overrides = {};
	let resetInline = false;
	let resetFiles = false;
	for (const pathname of dropInPaths) {
		const content = await fs$1.readFile(pathname, "utf8");
		let inService = false;
		for (const rawLine of splitSystemdLogicalLines(content)) {
			const line = rawLine.trim();
			if (!line || line.startsWith("#") || line.startsWith(";")) continue;
			if (line.startsWith("[")) {
				if (!line.endsWith("]")) throw new Error("Invalid systemd drop-in section");
				inService = line === "[Service]";
				continue;
			}
			if (!inService) continue;
			const separator = line.indexOf("=");
			if (separator < 0) throw new Error("Invalid systemd drop-in directive");
			const directive = line.slice(0, separator).trim();
			if (directive === "ExecStart" || directive === "WorkingDirectory") overrides.launcher = directive === "ExecStart" ? "command" : overrides.launcher ?? "working-directory";
			else if ([
				"Environment",
				"EnvironmentFile",
				"UnsetEnvironment"
			].includes(directive)) {
				const value = line.slice(separator + 1).trim();
				if (!value) {
					if (directive === "Environment") {
						inlineEnvironmentKeys.clear();
						resetInline = true;
					} else if (directive === "EnvironmentFile") {
						fileEnvironmentKeys.clear();
						resetFiles = true;
					} else {
						unsetEnvironmentKeys.clear();
						for (const assignment of managedUnsetEnvironment) unsetEnvironmentKeys.add(assignment.split("=", 1)[0] ?? assignment);
					}
				} else if (directive === "Environment") {
					const assignments = parseSystemdEnvAssignments(value);
					if (assignments.length !== splitSystemdEnvironmentWords(value).length) throw new Error("Invalid systemd drop-in environment");
					for (const { key } of assignments) inlineEnvironmentKeys.add(key);
				} else if (directive === "UnsetEnvironment") for (const assignment of splitSystemdEnvironmentWords(value)) {
					const key = assignment.split("=", 1)[0];
					if (!key) throw new Error("Invalid systemd drop-in environment removal");
					unsetEnvironmentKeys.add(key);
				}
				else if (value.replace(/%%|%h/gu, "").includes("%")) overrides.environment = true;
				else try {
					const spec = parseSystemdEnvironmentFileSpec(value, env);
					const fileEnvironment = await resolveSystemdEnvironmentFiles({
						environmentFileSpecs: spec ? [spec] : [],
						failOnUnavailable: true
					});
					for (const key of Object.keys(fileEnvironment)) fileEnvironmentKeys.add(key);
				} catch {
					overrides.environment = true;
				}
			}
		}
	}
	if (overrides.environment !== true) {
		const ownedKeys = [.../* @__PURE__ */ new Set([
			...inlineEnvironmentKeys,
			...fileEnvironmentKeys,
			...unsetEnvironmentKeys
		])];
		if (ownedKeys.length > 0 || resetInline || resetFiles) overrides.environment = {
			...ownedKeys.length > 0 ? { keys: ownedKeys } : {},
			...resetInline ? { resetInline: true } : {},
			...resetFiles ? { resetFiles: true } : {}
		};
	}
	return overrides;
}
async function readSystemdServiceExecStart(env, options) {
	try {
		const target = options?.systemdReadTarget ?? await (await import("./systemd-scope-5CiaLYTr.mjs")).findInstalledSystemdGatewayScope(env);
		const opts = target ? {
			...options,
			systemdReadTarget: target
		} : options;
		const unitPath = target?.unitPath ?? resolveSystemdUnitPath(env);
		const content = await fs$1.readFile(unitPath, "utf8").catch((error) => {
			if (!hasErrnoCode(error, "ENOENT")) throw new ServiceDefinitionInspectionError(unitPath);
			return null;
		});
		if (target?.scope === "system") {
			const command = await readSystemdManagerCommand(env, content === null ? null : { programArguments: [] }, [], opts);
			opts?.onCommandInspection?.({ kind: command || content !== null ? "present" : "absent" });
			return command;
		}
		let execStart = "";
		let workingDirectory = "";
		let inlineEnvironment = {};
		const environmentFileSpecs = [];
		const unsetEnvironment = [];
		for (const rawLine of splitSystemdLogicalLines(content ?? "")) {
			const line = rawLine.trim();
			const separator = line.indexOf("=");
			if (separator < 0 || line.startsWith("#")) continue;
			const directive = line.slice(0, separator).trim();
			const value = line.slice(separator + 1).trim();
			if (directive === "ExecStart") execStart = value;
			else if (directive === "WorkingDirectory") {
				const expanded = expandSystemdSpecifier(value.replace(/^-/, ""), env);
				workingDirectory = expanded.endsWith("/.") ? expanded.slice(0, -2) || "/" : expanded;
			} else if (directive === "Environment") {
				if (!value) inlineEnvironment = {};
				for (const parsed of parseSystemdEnvAssignments(value)) inlineEnvironment[parsed.key] = expandSystemdSpecifier(parsed.value, env);
			} else if (directive === "EnvironmentFile" || directive === "UnsetEnvironment") {
				const file = directive === "EnvironmentFile";
				const entries = file ? environmentFileSpecs : unsetEnvironment;
				if (!value) entries.length = 0;
				else if (file) {
					const spec = parseSystemdEnvironmentFileSpec(value, env);
					if (spec) environmentFileSpecs.push(spec);
				} else unsetEnvironment.push(...splitSystemdEnvironmentWords(value));
			}
		}
		const managedDefinition = await buildSystemdCommandSnapshot({
			programArguments: parseSystemdExecStart(execStart).map((argument) => expandSystemdSpecifier(argument, env)),
			workingDirectory,
			inlineEnvironment,
			environmentFileSpecs,
			unsetEnvironment
		});
		const localDefinition = content === null ? null : managedDefinition;
		const manager = await readSystemdManagerCommand(env, localDefinition, unsetEnvironment, opts).then((command) => {
			opts?.onCommandInspection?.({ kind: command || localDefinition ? "present" : "absent" });
			return command;
		}).catch((error) => {
			if (opts?.requireEffective || findServiceOwnershipRefusal(error)) throw error;
			opts?.onCommandInspection?.({
				kind: "unavailable",
				error
			});
			return null;
		});
		if (manager || opts?.requireEffective || !managedDefinition.programArguments.length) return manager;
		return {
			...managedDefinition,
			managedDefinition,
			managedOverrides: UNKNOWN_SYSTEMD_OVERRIDES,
			sourcePath: unitPath
		};
	} catch (error) {
		options?.onCommandInspection?.({
			kind: "unavailable",
			error
		});
		if (options?.requireEffective || findServiceOwnershipRefusal(error)) throw error;
		return null;
	}
}
function resolveSystemdEnvironmentFilePath(params) {
	const filename = params.environment?.OPENCLAW_SERVICE_KIND?.trim() === "node" ? SYSTEMD_NODE_DOTENV_FILENAME : SYSTEMD_GATEWAY_DOTENV_FILENAME;
	return path.join(params.stateDir, filename);
}
function resolveLegacyNodeSystemdEnvironmentFilePath(params) {
	if (params.environment?.OPENCLAW_SERVICE_KIND?.trim() !== "node") return null;
	return path.join(params.stateDir, SYSTEMD_GATEWAY_DOTENV_FILENAME);
}
function isNodeSystemdEnvironment(env) {
	return env.OPENCLAW_SERVICE_KIND?.trim() === "node";
}
function expandSystemdSpecifier(input, env) {
	return input.replace(/%%|%h/gu, (specifier) => specifier === "%%" ? "%" : normalizeWindowsPathSeparators(resolveDaemonHomeDir(env)));
}
function parseSystemdEnvironmentFileSpec(value, env) {
	const optional = value.startsWith("-");
	const pathname = expandSystemdSpecifier(optional ? value.slice(1) : value, env);
	return path.posix.isAbsolute(pathname) ? [pathname, optional] : void 0;
}
function decodeSystemdEnvironmentFileValue(rawValue) {
	let state = "pre";
	let decoded = "";
	let literalDollar = false;
	let trailingWhitespaceStart;
	for (const char of rawValue) {
		const whitespace = char === " " || char === "	" || char === "\r";
		if (state === "pre") {
			if (whitespace) continue;
			if (char === "'") {
				state = "single-quoted";
				continue;
			}
			if (char === "\"") {
				state = "double-quoted";
				continue;
			}
			if (char === "\\") {
				state = "unquoted-escape";
				continue;
			}
			state = "unquoted";
			decoded += char;
			continue;
		}
		if (state === "unquoted") {
			if (char === "\\") {
				state = "unquoted-escape";
				trailingWhitespaceStart = void 0;
				continue;
			}
			if (whitespace) trailingWhitespaceStart ??= decoded.length;
			else trailingWhitespaceStart = void 0;
			decoded += char;
			continue;
		}
		if (state === "unquoted-escape") {
			state = "unquoted";
			literalDollar ||= char === "$";
			decoded += char;
			continue;
		}
		if (state === "single-quoted") {
			if (char === "'") state = "pre";
			else {
				literalDollar ||= char === "$";
				decoded += char;
			}
			continue;
		}
		if (state === "double-quoted") {
			if (char === "\"") state = "pre";
			else if (char === "\\") state = "double-quoted-escape";
			else {
				literalDollar ||= char === "$";
				decoded += char;
			}
			continue;
		}
		state = "double-quoted";
		if ([
			"\"",
			"\\",
			"`",
			"$"
		].includes(char)) {
			literalDollar ||= char === "$";
			decoded += char;
		} else decoded += `\\${char}`;
	}
	if (state === "unquoted" && trailingWhitespaceStart !== void 0) decoded = decoded.slice(0, trailingWhitespaceStart);
	return {
		value: decoded,
		literalDollar
	};
}
function parseEnvironmentFileLine(rawLine) {
	const trimmedStart = rawLine.trimStart();
	if (!trimmedStart || trimmedStart.startsWith("#") || trimmedStart.startsWith(";")) return null;
	const eq = trimmedStart.indexOf("=");
	if (eq <= 0) return null;
	const key = trimmedStart.slice(0, eq).trim();
	if (!key) return null;
	const decoded = decodeSystemdEnvironmentFileValue(trimmedStart.slice(eq + 1));
	return {
		key,
		value: decoded.value,
		literalShellReference: decoded.literalDollar && isUnresolvedShellReference(decoded.value)
	};
}
function serializeSystemdEnvironmentFileValue(value) {
	if (!/[\s\\'"`$]/u.test(value)) return value;
	return `"${value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"").replaceAll("`", "\\`").replaceAll("$", "\\$")}"`;
}
function serializeSystemdEnvironmentFile(environment) {
	return Object.entries(environment).map(([key, value]) => `${key}=${serializeSystemdEnvironmentFileValue(value)}`).join("\n");
}
async function readSystemdEnvironmentFile(pathname) {
	const environment = {};
	const literalShellReferenceKeys = /* @__PURE__ */ new Set();
	const content = await fs$1.readFile(pathname, "utf8");
	for (const rawLine of content.split(/\r?\n/)) {
		const parsed = parseEnvironmentFileLine(rawLine);
		if (!parsed) continue;
		environment[parsed.key] = parsed.value;
		if (parsed.literalShellReference) literalShellReferenceKeys.add(parsed.key);
		else literalShellReferenceKeys.delete(parsed.key);
	}
	return {
		environment,
		literalShellReferenceKeys
	};
}
async function resolveSystemdEnvironmentFiles(params) {
	const resolved = {};
	const failIfUnavailable = (error, optional) => {
		if (params.failOnUnavailable && !optional) throw error;
	};
	for (const [pattern, optional] of params.environmentFileSpecs) {
		let pathnames;
		try {
			pathnames = await expandSystemdEnvironmentFilePattern(pattern);
		} catch (error) {
			failIfUnavailable(error, optional);
			continue;
		}
		pathnames.sort();
		if (params.failOnUnavailable && !optional && pathnames.length === 0) throw new Error("Missing systemd environment file");
		for (const filePath of pathnames) try {
			Object.assign(resolved, (await readSystemdEnvironmentFile(filePath)).environment);
		} catch (error) {
			failIfUnavailable(error, optional);
			continue;
		}
	}
	return resolved;
}
//#endregion
export { isUnresolvedShellReference as A, isSystemdUserScopeUnavailable as C, systemdInspectionError as D, reloadSystemdUserManager as E, collectDurableServiceEnvVarSources as O, isSystemdUnitNotEnabled as S, readSystemctlDetail as T, isNonFatalSystemdInstallProbeError as _, resolveLegacyNodeSystemdEnvironmentFilePath as a, isSystemdUnitActive as b, resolveSystemdUnitPath as c, assertSystemdAvailable as d, disableSystemdUserUnitForRemoval as f, execSystemctlUser as g, execSystemctl as h, readSystemdServiceExecStart as i, readStateDirDotEnvFromStateDir as j, collectDurableServiceEnvVars as k, resolveSystemdUnitPathForName as l, execBusctlUser as m, isNodeSystemdEnvironment as n, resolveSystemdEnvironmentFilePath as o, execBusctlSystem as p, readSystemdEnvironmentFile as r, resolveSystemdServiceName as s, assertSystemdServiceAccount as t, serializeSystemdEnvironmentFile as u, isSystemctlAvailable as v, isSystemdUserServiceAvailable as w, isSystemdUnitMissingDetail as x, isSystemctlMissing as y };
