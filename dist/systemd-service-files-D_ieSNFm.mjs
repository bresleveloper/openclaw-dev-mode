import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { h as resolveGatewaySystemdServiceNameCandidates, m as resolveGatewaySystemdServiceName } from "./constants-BLghGsId.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as splitArgsPreservingQuotes } from "./arg-split-CR3xkHmb.mjs";
import { t as resolveDaemonHomeDir } from "./paths-DMJOvLwv.mjs";
import { d as runServiceInspectionGuard, f as withServiceInspectionBudget, i as assertGatewayServiceUpdateCurrent, u as getServiceInspectionClock } from "./service-update-authority-CoX8GMUL.mjs";
import { t as execFileUtf8 } from "./exec-file-DeUuidUQ.mjs";
import { i as ServiceOwnershipRefusalError, n as ServiceDefinitionInspectionError, o as findServiceOwnershipRefusal, r as ServiceInspectionError } from "./service-inspection-error-Bsltcpi4.mjs";
import { a as resolveSystemdUserTransport, c as isSystemdUserBusUnavailableDetail, d as openSystemdMachineBroker, l as resolveUnavailableSystemdInspectionReason, m as decodeLegacyBusctlOutput, o as classifySystemdUnavailableDetail, p as openSystemdUserManager, s as isSystemctlMissingDetail, t as SYSTEMD_TRANSPORT_DEADLINE, u as openSystemdBroker } from "./systemd-user-transport-vKPIfcG5.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { a as normalizeEnvVarKey, n as isDangerousHostEnvOverrideVarName, r as isDangerousHostEnvVarName } from "./host-env-security-BgpkByrc.mjs";
import { h as collectConfigRuntimeEnvVars } from "./config-env-vars-DjPHKieF.mjs";
import { n as GATEWAY_SERVICE_STOP_TIMEOUT_MS } from "./gateway-shutdown-budget-v-vGFkEN.mjs";
import { n as normalizeWindowsPathSeparators } from "./output-EUQq_O0z.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { readRegularFileSync } from "@openclaw/fs-safe/advanced";
import { parse as parse$1 } from "dotenv";
import { Minimatch, escape } from "minimatch";
//#region src/daemon/systemd-exec.ts
/** systemctl execution, user-manager routing, and availability probes. */
function isRunningAsRoot() {
	try {
		return process.geteuid?.() === 0;
	} catch {
		return false;
	}
}
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
	const normalized = normalizeLowercaseStringOrEmpty(detail);
	return normalized.includes("disabled") || normalized.includes("static") || normalized.includes("indirect") || normalized.includes("masked") || normalized.includes("not-found") || normalized.includes("could not be found") || normalized.includes("failed to get unit file state");
}
function isSystemdUnitMissingDetail(detail) {
	const normalized = normalizeLowercaseStringOrEmpty(detail);
	return normalized.includes("unit file") && normalized.includes("does not exist") || normalized.includes("not-found") || normalized.includes("could not be found");
}
function isSystemdUnitAlreadyMissingOrInactive(detail, unitName) {
	const escapedUnitName = escapeRegExp(normalizeLowercaseStringOrEmpty(unitName));
	return new RegExp(`^(?:failed to (?:disable unit|stop\\s+${escapedUnitName}):\\s*)?(?:unit file\\s+${escapedUnitName}\\s+does not exist|unit\\s+${escapedUnitName}(?:\\s+is)?\\s+(?:inactive|not\\s+active|not\\s+loaded|not-found|could not be found))[.!]?$`, "u").test(normalizeLowercaseStringOrEmpty(detail));
}
function isSystemdUserScopeUnavailable(detail) {
	return classifySystemdUnavailableDetail(detail) !== null;
}
function isGenericSystemctlIsEnabledFailure(detail) {
	const normalized = normalizeLowercaseStringOrEmpty(detail);
	return normalized.startsWith("command failed: systemctl") && normalized.includes(" is-enabled ") && !normalized.includes("permission denied") && !normalized.includes("access denied") && !normalized.includes("no space left") && !normalized.includes("read-only file system") && !normalized.includes("out of memory") && !normalized.includes("cannot allocate memory");
}
function isNonFatalSystemdInstallProbeError(error) {
	const detail = error instanceof Error ? error.message : typeof error === "string" ? error : "";
	const normalized = normalizeLowercaseStringOrEmpty(detail);
	return isSystemdUserBusUnavailableDetail(normalized) || isGenericSystemctlIsEnabledFailure(normalized);
}
async function execSystemdUserCommand(command, env, args, timeoutMs, assertCurrent) {
	const now = getServiceInspectionClock();
	const deadline = timeoutMs && timeoutMs > 0 ? now() + timeoutMs : void 0;
	try {
		const transport = await resolveSystemdUserTransport(env, deadline, assertCurrent);
		if (transport?.kind === "private" && command === "busctl") throw new ServiceInspectionError("systemd-user-bus-unavailable");
		const childEnv = !transport || transport.kind === "machine" ? env : {
			...env,
			XDG_RUNTIME_DIR: transport.kind === "private" || command === "busctl" ? transport.runtimeDir : void 0,
			DBUS_SESSION_BUS_ADDRESS: transport.address
		};
		runServiceInspectionGuard(assertCurrent);
		const remaining = deadline === void 0 ? void 0 : Math.ceil(deadline - now());
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
		runServiceInspectionGuard(assertCurrent);
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
	return await withServiceInspectionBudget(() => execSystemdUserCommand("busctl", env, args, timeoutMs, assertCurrent));
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
	const res = await withServiceInspectionBudget(() => execSystemctlUser(env, ["status"], timeoutMs));
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
	return await withServiceInspectionBudget(async (budget) => {
		const manager = "org.freedesktop.systemd1";
		const timeoutMs = opts?.timeoutMs && opts.timeoutMs > 0 ? opts.timeoutMs : 5e3;
		const deadlineAt = budget.now() + timeoutMs;
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
			if (budget.now() >= deadlineAt) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
			if (managerUid !== void 0 && remainingCalls <= 0) throw unavailable();
			if (peer) {
				runServiceInspectionGuard(assertCurrent);
				const values = await peer.query(args, signatures, deadlineAt, inspection);
				runServiceInspectionGuard(assertCurrent);
				if (budget.now() >= deadlineAt) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
				return values;
			}
			const callTimeout = Math.max(1, Math.floor((deadlineAt - budget.now()) / remainingCalls--));
			const callDeadline = Math.min(deadlineAt, budget.now() + callTimeout);
			const exec = async (queryArgs, callBudget) => {
				if (scope === "system") {
					runServiceInspectionGuard(assertCurrent);
					return await execBusctlSystem(queryArgs, callBudget);
				}
				return await execBusctlUser(env, queryArgs, callBudget, assertCurrent);
			};
			let result = await exec([
				...legacyOutput ? [] : ["--json=short"],
				...opts?.requireLoaded ? ["--auto-start=no"] : [],
				...args
			], callTimeout);
			runServiceInspectionGuard(assertCurrent);
			if (!legacyOutput && result.termination === "exit" && result.code === 1 && result.stdout === "" && result.stderr.trim() === "busctl: unrecognized option '--json=short'") {
				const remaining = Math.floor(callDeadline - budget.now());
				if (remaining <= 0) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
				legacyOutput = true;
				result = await exec([...opts?.requireLoaded ? ["--auto-start=no"] : [], ...args], remaining);
				runServiceInspectionGuard(assertCurrent);
			}
			if (result.termination === "error" && result.errorCode === "ENOENT") {
				const reason = scope === "system" ? await resolveUnavailableSystemdInspectionReason("systemd-busctl-unavailable", process.env, callDeadline) : "systemd-busctl-unavailable";
				runServiceInspectionGuard(assertCurrent);
				throw new ServiceInspectionError(reason);
			}
			if (budget.now() >= (legacyOutput ? callDeadline : deadlineAt)) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
			if ((legacyOutput || managerUid !== void 0) && result.termination !== "exit") throw systemdInspectionError(result, unavailable().message, scope);
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
		const destination = binding?.destination ?? manager;
		return {
			query: (args, signatures) => budget.run(() => query(args, signatures)),
			binding: binding ? {
				...binding,
				verify: () => budget.run(() => binding.verify())
			} : void 0,
			destination,
			close: async () => {
				await managerPeer?.close();
			}
		};
	});
}
//#endregion
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
/** Collects durable service env vars from state-dir `.env` and config, preserving each source. */
function collectDurableServiceEnvVarSources(params) {
	const stateDirDotEnvEnvironment = readStateDirDotEnvFromStateDir(resolveStateDir(params.env)).entries;
	const configEnvironment = collectConfigRuntimeEnvVars(params.config);
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
//#region src/daemon/systemd-environment-file-parser.ts
/** Native systemd EnvironmentFile value decoding; no filesystem or service access. */
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
function parseSystemdEnvironmentFileLine(rawLine) {
	const trimmedStart = rawLine.trimStart();
	if (!trimmedStart || trimmedStart.startsWith("#") || trimmedStart.startsWith(";")) return null;
	const eq = trimmedStart.indexOf("=");
	if (eq <= 0) return null;
	const key = trimmedStart.slice(0, eq).trim();
	const decoded = decodeSystemdEnvironmentFileValue(trimmedStart.slice(eq + 1));
	return {
		key,
		value: decoded.value,
		literalShellReference: decoded.literalDollar && isUnresolvedShellReference(decoded.value)
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
//#region src/daemon/systemd-environment-files.ts
/** Native systemd environment-file serialization, reading, and effective file overlays. */
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
		const parsed = parseSystemdEnvironmentFileLine(rawLine);
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
//#region src/daemon/systemd-time-span.ts
const SYSTEMD_DEFAULT_STOP_TIMEOUT_MS = 9e4;
const UNITS = {
	us: .001,
	usec: .001,
	μs: .001,
	ms: 1,
	msec: 1,
	s: 1e3,
	sec: 1e3,
	second: 1e3,
	seconds: 1e3,
	m: 6e4,
	min: 6e4,
	minute: 6e4,
	minutes: 6e4,
	h: 36e5,
	hr: 36e5,
	hour: 36e5,
	hours: 36e5,
	d: 864e5,
	day: 864e5,
	days: 864e5,
	w: 6048e5,
	week: 6048e5,
	weeks: 6048e5,
	M: 26298e5,
	month: 26298e5,
	months: 26298e5,
	y: 315576e5,
	year: 315576e5,
	years: 315576e5
};
function parseSystemdTimeSpanMs(value) {
	const text = value.trim();
	if (text === "infinity") return Infinity;
	let remaining = text;
	let total = 0;
	if (!remaining) return;
	while (remaining) {
		const match = /^(\d+(?:\.\d+)?|\.\d+)\s*([a-zA-Zμ]+)?\s*/u.exec(remaining);
		if (!match) return;
		const factor = match[2] ? UNITS[match[2]] : 1e3;
		if (factor === void 0) return;
		total += Number(match[1]) * factor;
		remaining = remaining.slice(match[0].length);
	}
	return Number.isFinite(total) ? total : void 0;
}
//#endregion
//#region src/daemon/systemd-service-identity.ts
/** Capture and revalidate the native owner across a stopped-service repair. */
function assertSystemdServiceAccount(user) {
	const account = os.userInfo();
	if (user !== account.username && user !== String(account.uid) && !(user === "" && account.uid === 0)) throw new ServiceOwnershipRefusalError("systemd-account-refused");
	return account;
}
const MANAGER = "org.freedesktop.systemd1";
const MANAGER_PATH = "/org/freedesktop/systemd1";
const BUS = "org.freedesktop.DBus";
const unavailable = () => /* @__PURE__ */ new Error("The systemd service activation identity could not be inspected.");
function openBroker(bus, deadline) {
	return "address" in bus ? openSystemdBroker(bus.address, deadline) : openSystemdMachineBroker(bus.machine, deadline);
}
async function inspectIdentity(broker, target, bus, deadline, expected, rootServiceAccount) {
	const call = async (method, args, signature) => {
		const value = (await broker.query([
			"call",
			BUS,
			"/org/freedesktop/DBus",
			BUS,
			method,
			...args
		], [signature], deadline))?.[0];
		if (!Array.isArray(value) || value.length !== 1) throw unavailable();
		return value[0];
	};
	const busId = await call("GetId", [], "s");
	const managerOwner = await call("GetNameOwner", ["s", MANAGER], "s");
	if (typeof busId !== "string" || !/^[a-f0-9]{32}$/i.test(busId) || typeof managerOwner !== "string" || !/^:[0-9]+\.[0-9]+$/.test(managerOwner)) throw unavailable();
	const managerUid = await call("GetConnectionUnixUser", ["s", managerOwner], "u");
	if (typeof managerUid !== "number" || !Number.isInteger(managerUid) || managerUid < 0 || managerUid >= 4294967295) throw unavailable();
	if (target.scope === "system" && managerUid !== 0 || expected && (busId !== expected.busId || managerOwner !== expected.managerOwner || managerUid !== expected.managerUid)) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
	const unitPath = (await broker.query([
		"call",
		managerOwner,
		MANAGER_PATH,
		`${MANAGER}.Manager`,
		expected ? "LoadUnit" : "GetUnit",
		"s",
		target.unitName
	], ["o"], deadline))?.[0];
	if (!Array.isArray(unitPath) || unitPath.length !== 1 || typeof unitPath[0] !== "string" || !/^\/org\/freedesktop\/systemd1\/unit\/[A-Za-z0-9_]+$/.test(unitPath[0])) throw unavailable();
	const definition = await broker.query([
		"get-property",
		managerOwner,
		unitPath[0],
		`${MANAGER}.Unit`,
		"Id",
		"FragmentPath"
	], ["s", "s"], deadline);
	if (typeof definition?.[0] !== "string" || typeof definition?.[1] !== "string") throw unavailable();
	if (definition?.[0] !== target.unitName || definition?.[1] !== target.unitPath) throw new ServiceOwnershipRefusalError("systemd-unit-changed");
	const serviceUser = (await broker.query([
		"get-property",
		managerOwner,
		unitPath[0],
		`${MANAGER}.Service`,
		"User"
	], ["s"], deadline))?.[0];
	if (typeof serviceUser !== "string") throw unavailable();
	const adoptedAccount = rootServiceAccount ?? expected?.rootServiceAccount;
	if (adoptedAccount !== void 0) {
		if (target.scope !== "system" || process.geteuid?.() !== 0 || !adoptedAccount || adoptedAccount === "root" || adoptedAccount === "0" || serviceUser !== adoptedAccount) throw new ServiceOwnershipRefusalError("systemd-account-refused");
	} else if (target.scope === "system") {
		assertSystemdServiceAccount(serviceUser);
		if (expected) assertSystemdServiceAccount(expected.serviceUser);
	} else if (expected && serviceUser !== expected.serviceUser) throw new ServiceOwnershipRefusalError("systemd-account-refused");
	if (managerOwner !== await call("GetNameOwner", ["s", MANAGER], "s")) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
	return {
		...target,
		bus,
		busId,
		managerOwner,
		managerUid,
		serviceUser,
		...adoptedAccount !== void 0 ? { rootServiceAccount: adoptedAccount } : {}
	};
}
async function captureSystemdServiceIdentity(params) {
	return await withServiceInspectionBudget(async (budget) => {
		const deadline = budget.now() + (params.timeoutMs ?? 9e4);
		const transport = params.target.scope === "user" ? await resolveSystemdUserTransport(params.env, deadline, void 0, "admission") : void 0;
		if (params.target.scope === "user" && (!transport || transport.kind === "private")) throw new ServiceInspectionError("systemd-user-bus-unavailable");
		const bus = transport?.kind === "machine" ? { machine: `${transport.user}@` } : { address: transport?.address ?? process.env.DBUS_SYSTEM_BUS_ADDRESS ?? "unix:path=/run/dbus/system_bus_socket" };
		const broker = await openBroker(bus, deadline);
		try {
			const identity = await inspectIdentity(broker, params.target, bus, deadline, void 0, params.rootServiceAccount);
			if (params.managerUid !== void 0 && identity.managerUid !== params.managerUid) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
			return identity;
		} finally {
			await broker.close();
		}
	});
}
async function activateSystemdServiceIdentity(params) {
	return await withServiceInspectionBudget(async (budget) => {
		let authorityFailure;
		const assertCurrent = () => {
			try {
				assertGatewayServiceUpdateCurrent();
				runServiceInspectionGuard(params.assertCurrent);
			} catch (error) {
				authorityFailure = { error };
				throw error;
			}
		};
		assertCurrent();
		const { identity } = params;
		const deadline = budget.now() + SYSTEMD_DEFAULT_STOP_TIMEOUT_MS;
		const broker = await openBroker(identity.bus, deadline);
		try {
			const methods = params.action === "stop" ? ["StopUnit"] : ["ResetFailedUnit", params.action === "start" ? "StartUnit" : "RestartUnit"];
			for (const method of methods) {
				await params.beforeMutation?.();
				assertCurrent();
				await inspectIdentity(broker, identity, identity.bus, deadline, identity);
				assertCurrent();
				await params.prepareEffect?.();
				assertCurrent();
				const reset = method === "ResetFailedUnit";
				let effectFailure;
				try {
					await broker.query([
						"call",
						identity.managerOwner,
						MANAGER_PATH,
						`${MANAGER}.Manager`,
						method,
						reset ? "s" : "ss",
						identity.unitName,
						...reset ? [] : ["replace"]
					], reset ? [] : ["o"], deadline, assertCurrent, () => {
						try {
							params.beforeEffect?.();
						} catch (error) {
							effectFailure = { error };
							throw error;
						}
					}, SYSTEMD_DEFAULT_STOP_TIMEOUT_MS);
				} catch (error) {
					if (authorityFailure) throw authorityFailure.error;
					if (effectFailure) throw effectFailure.error;
					assertCurrent();
					const refusal = findServiceOwnershipRefusal(error);
					if (refusal || !reset) throw refusal ?? error;
					params.warn("systemd reset-failed did not complete; revalidating ownership and continuing with activation.");
				}
			}
		} finally {
			await broker.close();
		}
	});
}
//#endregion
//#region src/daemon/systemd-unit.ts
/** Renders and parses systemd unit snippets for managed gateway services. */
const SYSTEMD_LINE_BREAKS = /[\r\n]/;
/** Copy only policy fields admitted for preservation by the native audit. */
function preserveSystemdUnitPolicy(generated, previous, keys = []) {
	if (!keys.length) return generated;
	const keyedLines = (content) => {
		let section = "";
		return splitSystemdLogicalLines(content).map((line) => {
			const trimmed = line.trim();
			if (trimmed.startsWith("[") && trimmed.endsWith("]")) section = trimmed.slice(1, -1);
			const separator = trimmed.indexOf("=");
			return {
				line,
				key: separator < 0 ? "" : `${section}.${trimmed.slice(0, separator).trim()}`
			};
		});
	};
	const installed = keyedLines(previous);
	const retained = new Map(keys.map((key) => [key, installed.filter((line) => line.key === key)]));
	const copied = /* @__PURE__ */ new Set();
	return `${keyedLines(generated).flatMap(({ line, key }) => {
		const original = retained.get(key);
		if (!original) return [line];
		if (!original.length) throw new Error(`Custom systemd policy ${key} disappeared before publication.`);
		if (copied.has(key)) return [];
		copied.add(key);
		return original.map((entry) => entry.line);
	}).join("\n").trimEnd()}\n`;
}
const SYSTEMD_FIXED_POLICY = {
	"Unit.After": "network-online.target",
	"Unit.Wants": "network-online.target",
	"Unit.StartLimitBurst": "10",
	"Unit.StartLimitIntervalSec": "300",
	"Service.Restart": "always",
	"Service.RestartSec": "5",
	"Service.RestartPreventExitStatus": "78",
	"Service.TimeoutStopSec": String(GATEWAY_SERVICE_STOP_TIMEOUT_MS / 1e3),
	"Service.TimeoutStartSec": "30",
	"Service.SuccessExitStatus": "0 143",
	"Service.OOMPolicy": "continue",
	"Service.KillMode": "mixed",
	"Install.WantedBy": "default.target"
};
function renderFixedPolicy(section) {
	return Object.entries(SYSTEMD_FIXED_POLICY).filter(([key]) => key.startsWith(`${section}.`)).map(([key, value]) => `${key.slice(section.length + 1)}=${value}`);
}
/** Keep installed launch arguments and environment while migrating installer policy. */
function refreshSystemdUnitPolicy(content) {
	const lines = [];
	const sections = /* @__PURE__ */ new Set();
	let section = "";
	for (const raw of splitSystemdLogicalLines(content)) {
		const line = raw.trim();
		if (line.startsWith("[") && line.endsWith("]")) {
			lines.push(...renderFixedPolicy(section));
			section = line.slice(1, -1);
			sections.add(section);
		}
		const separator = line.indexOf("=");
		if (separator > 0 && Object.hasOwn(SYSTEMD_FIXED_POLICY, `${section}.${line.slice(0, separator).trim()}`)) continue;
		lines.push(raw);
	}
	lines.push(...renderFixedPolicy(section));
	for (const name of new Set(Object.keys(SYSTEMD_FIXED_POLICY).map((key) => key.split(".")[0]))) if (!sections.has(name)) lines.push(`[${name}]`, ...renderFixedPolicy(name));
	return `${lines.join("\n").trimEnd()}\n`;
}
function assertNoSystemdLineBreaks(value, label) {
	if (SYSTEMD_LINE_BREAKS.test(value)) throw new Error(`${label} cannot contain CR or LF characters.`);
}
function systemdEscapeArg(value) {
	assertNoSystemdLineBreaks(value, "Systemd unit values");
	if (!/[\s"'\\]/.test(value)) return value;
	return `"${value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"")}"`;
}
function renderEnvLines(env) {
	if (!env) return [];
	return Object.entries(env).filter(([key, value]) => typeof value === "string" && (value.trim() || key === "NODE_OPTIONS")).map(([key, value]) => {
		const rawValue = value ?? "";
		assertNoSystemdLineBreaks(key, "Systemd environment variable names");
		assertNoSystemdLineBreaks(rawValue, "Systemd environment variable values");
		return `Environment=${systemdEscapeArg(`${key}=${rawValue.trim()}`.replaceAll("%", "%%"))}`;
	});
}
function renderSystemdEnvironmentFile(entry) {
	assertNoSystemdLineBreaks(entry, "Systemd EnvironmentFile values");
	return `-${escape(entry).replaceAll("%", "%%")}`;
}
function buildSystemdUnit({ description, programArguments, workingDirectory, environment, environmentFiles }) {
	const execStart = programArguments.map((argument) => systemdEscapeArg(argument.replaceAll("%", "%%"))).join(" ");
	const descriptionValue = description?.trim() || "OpenClaw Gateway";
	assertNoSystemdLineBreaks(descriptionValue, "Systemd Description");
	const descriptionLine = `Description=${descriptionValue}`;
	if (workingDirectory) {
		assertNoSystemdLineBreaks(workingDirectory, "Systemd WorkingDirectory");
		const lastComponent = workingDirectory.split("/").findLast((part) => part !== "" && part !== ".");
		if (lastComponent && /[ \t]$/u.test(lastComponent)) throw new Error("Systemd WorkingDirectory cannot end in spaces or tabs; choose a directory without trailing whitespace.");
	}
	const workingDirPath = workingDirectory?.replace(/\\$/u, "$&/.");
	const workingDirLine = workingDirPath ? `WorkingDirectory=${workingDirPath.replaceAll("%", "%%")}` : null;
	const envLines = renderEnvLines(environment);
	return [
		"[Unit]",
		descriptionLine,
		...renderFixedPolicy("Unit"),
		"",
		"[Service]",
		`ExecStart=${execStart}`,
		...renderFixedPolicy("Service"),
		workingDirLine,
		...normalizeStringEntries(environmentFiles).map((entry) => `EnvironmentFile=${renderSystemdEnvironmentFile(entry)}`),
		...envLines,
		"",
		"[Install]",
		...renderFixedPolicy("Install"),
		""
	].filter((line) => line !== null).join("\n");
}
function parseSystemdExecStart(value) {
	return splitSystemdEnvironmentWords(value);
}
function splitSystemdEnvironmentWords(value) {
	return splitArgsPreservingQuotes(value, {
		escapeMode: "backslash",
		quoteChars: ["\"", "'"],
		quoteStart: "item-start"
	});
}
function parseSystemdEnvAssignments(raw) {
	return splitSystemdEnvironmentWords(raw).flatMap((entry) => {
		const assignment = entry.trim();
		const separator = assignment.indexOf("=");
		return separator <= 0 ? [] : [{
			key: assignment.slice(0, separator).trim(),
			value: assignment.slice(separator + 1)
		}];
	});
}
/** Read declared inline Service metadata; files and specifier expansion belong to effective inspection. */
function parseSystemdInlineEnvironment(content) {
	let environment = {};
	let section = "";
	for (const rawLine of splitSystemdLogicalLines(content)) {
		const line = rawLine.trim();
		const separator = line.indexOf("=");
		if (line.startsWith("[")) section = line;
		else if (section === "[Service]" && separator > 0 && line.slice(0, separator).trim() === "Environment") {
			const value = line.slice(separator + 1);
			if (!value.trim()) environment = {};
			for (const assignment of parseSystemdEnvAssignments(value)) environment[assignment.key] = assignment.value;
		}
	}
	return environment;
}
function splitSystemdLogicalLines(content) {
	const lines = [];
	let continued = "";
	for (const physicalLine of content.split(/\r?\n/)) {
		if (/^\s*[#;]/u.test(physicalLine)) {
			if (!continued) lines.push(physicalLine);
			continue;
		}
		const line = continued + physicalLine;
		if (/(?:^|[^\\])(?:\\\\)*\\$/u.test(line)) continued = `${line.slice(0, -1)} `;
		else {
			lines.push(line);
			continued = "";
		}
	}
	return continued ? [...lines, continued] : lines;
}
function renderSystemdEnvAssignment(key, value) {
	return systemdEscapeArg(`${key}=${value}`);
}
//#endregion
//#region src/daemon/systemd-service-files.ts
/** Linux systemd unit paths and environment-file parsing. */
const SYSTEMD_GATEWAY_DOTENV_FILENAME = "gateway.systemd.env";
const SYSTEMD_NODE_DOTENV_FILENAME = "node.systemd.env";
function resolveSystemdUnitPathForName(env, name) {
	const home = normalizeWindowsPathSeparators(resolveDaemonHomeDir(env));
	return path.posix.join(home, ".config", "systemd", "user", `${name}.service`);
}
function resolveSystemdServiceName(env) {
	const override = env.OPENCLAW_SYSTEMD_UNIT?.trim();
	if (override) return override.endsWith(".service") ? override.slice(0, -8) : override;
	return resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE);
}
/**
* Unit-base names to probe for an installed gateway (or node/custom) service.
*
* When OPENCLAW_SYSTEMD_UNIT is set, only that explicit identity is used so
* Node (`openclaw-node`) and operator-custom units keep working. Without an
* override, use gateway profile candidates (current + legacy openclaw-<profile>).
*/
function resolveInstalledSystemdServiceNameCandidates(env) {
	const override = env.OPENCLAW_SYSTEMD_UNIT?.trim();
	if (override) return [override.endsWith(".service") ? override.slice(0, -8) : override];
	return resolveGatewaySystemdServiceNameCandidates(env.OPENCLAW_PROFILE);
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
async function readSystemdManagerCommand(env, localDefinition, managedUnsetEnvironment, opts, locationOnly = false, expectedServiceAccount) {
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
		if (!loaded) {
			if (locationOnly && opts?.requireLoaded) {
				await binding?.verify();
				return "not-loaded";
			}
			return opts?.requireLoaded ? await assertAbsentWithoutLoading() : null;
		}
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
		const [executions, workingDirectory, ...details] = await readProperties("Service", [
			"ExecStart",
			"WorkingDirectory",
			...locationOnly ? [] : [
				"Environment",
				"EnvironmentFiles",
				"UnsetEnvironment"
			],
			...systemScope && !locationOnly ? ["User"] : []
		], [
			"a(sasbttttuii)",
			"s",
			...locationOnly ? [] : [
				"as",
				"a(sb)",
				"as"
			],
			...systemScope && !locationOnly ? ["s"] : []
		]) ?? [];
		const [assignments, fileSpecs, unset, user] = locationOnly ? [
			[],
			[],
			[],
			details[0]
		] : details;
		const execution = Array.isArray(executions) && executions.length === 1 ? executions[0] : null;
		const programArguments = Array.isArray(execution) ? execution[1] : null;
		if (!Array.isArray(execution) || execution.length !== 10 || typeof execution[0] !== "string" || execution[0].length === 0 || typeof execution[2] !== "boolean" || !execution.slice(3).every(Number.isInteger) || !isStringArray(programArguments) || programArguments.length === 0 || typeof workingDirectory !== "string" || !isStringArray(assignments) || !Array.isArray(fileSpecs) || !fileSpecs.every((spec) => Array.isArray(spec) && spec.length === 2 && typeof spec[0] === "string" && path.posix.isAbsolute(spec[0]) && typeof spec[1] === "boolean") || !isStringArray(unset) || unset.some((assignment) => !assignment || assignment.startsWith("="))) throw unavailable();
		const inlineEnvironment = {};
		for (const assignment of assignments) {
			const separator = assignment.indexOf("=");
			if (separator <= 0) throw unavailable();
			inlineEnvironment[assignment.slice(0, separator)] = assignment.slice(separator + 1);
		}
		if (systemScope && !locationOnly && typeof user !== "string") throw unavailable();
		if (expectedServiceAccount !== void 0 && user !== expectedServiceAccount) throw new ServiceOwnershipRefusalError("systemd-account-refused");
		const account = systemScope && !locationOnly && typeof user === "string" && expectedServiceAccount === void 0 ? opts?.requireEffective ? assertSystemdServiceAccount(user) : os.userInfo() : void 0;
		const sameAccount = account && (user === account.username || user === String(account.uid) || user === "" && account.uid === 0);
		await binding?.verify();
		if (locationOnly) return {
			programArguments,
			workingDirectory: workingDirectory.replace(/^!/, ""),
			sourcePath
		};
		const managedDefinition = !systemScope && sourcePath === (target?.unitPath ?? resolveSystemdUnitPath(env)) ? localDefinition : null;
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
	const command = await readSystemdServiceCommand(env, options);
	if (command === "not-loaded") throw new Error("Full service inspection cannot use a location-only observation.");
	return command;
}
/** Root may inspect an explicitly selected service account; this grants no lifecycle authority. */
async function readSystemdServiceExecStartAsRoot(env, target, expectedServiceAccount, loadForInspection) {
	if (process.geteuid?.() !== 0 || target.scope !== "system" || !expectedServiceAccount || expectedServiceAccount === "root" || expectedServiceAccount === "0") throw new ServiceOwnershipRefusalError("systemd-account-refused");
	const command = await readSystemdServiceCommand(env, {
		systemdReadTarget: target,
		requireEffective: true,
		requireLoaded: true,
		loadForInspection
	}, false, expectedServiceAccount);
	if (command === "not-loaded") throw new Error("Full service inspection cannot use a location-only observation.");
	return command;
}
/** Loaded artifact location only; never an environment or service-mutation grant. */
async function readSystemdServiceCommandLocation(env, systemdReadTarget) {
	return await withServiceInspectionBudget(async (inspectionBudget) => {
		const deadline = inspectionBudget.now() + 5e3;
		const target = systemdReadTarget ?? await (await import("./systemd-scope-2iHQyLAs.mjs")).findInstalledSystemdGatewayScope(env, {
			requireLoaded: true,
			timeoutMs: 5e3
		}) ?? void 0;
		const read = (systemdReadBinding) => {
			const timeoutMs = deadline - inspectionBudget.now();
			if (timeoutMs <= 0) throw new Error("Service location inspection deadline expired.");
			return readSystemdServiceCommand(env, {
				requireEffective: true,
				requireLoaded: true,
				systemdReadTarget: target,
				systemdReadBinding,
				timeoutMs
			}, true);
		};
		let command;
		if (target?.scope === "system") command = await read();
		else {
			const [{ withSystemdServiceReadBinding }, { admitSystemdServiceReadBinding }] = await Promise.all([import("./service-operation-lock-Bpt5AZmN.mjs"), import("./systemd-peer-C7DhgW_s.mjs")]);
			command = await withSystemdServiceReadBinding(env, () => admitSystemdServiceReadBinding(env, deadline, target?.unitName), read, deadline);
		}
		return command === "not-loaded" || command === null ? { kind: "not-loaded" } : {
			kind: "command",
			command
		};
	});
}
async function readSystemdServiceCommand(env, options, locationOnly = false, expectedServiceAccount) {
	try {
		const target = options?.systemdReadTarget ?? await (await import("./systemd-scope-2iHQyLAs.mjs")).findInstalledSystemdGatewayScope(env, options);
		const opts = target ? {
			...options,
			systemdReadTarget: target
		} : options;
		const unitPath = target?.unitPath ?? resolveSystemdUnitPath(env);
		const content = locationOnly ? null : await fs$1.readFile(unitPath, "utf8").catch((error) => {
			if (!hasErrnoCode(error, "ENOENT")) throw new ServiceDefinitionInspectionError(unitPath);
			return null;
		});
		if (target?.scope === "system") {
			const command = await readSystemdManagerCommand(env, content === null ? null : { programArguments: [] }, [], opts, locationOnly, expectedServiceAccount);
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
		const programArguments = parseSystemdExecStart(execStart).map((argument) => expandSystemdSpecifier(argument, env));
		const managedDefinition = locationOnly ? {
			programArguments,
			workingDirectory
		} : await buildSystemdCommandSnapshot({
			programArguments,
			workingDirectory,
			inlineEnvironment,
			environmentFileSpecs,
			unsetEnvironment
		});
		const localDefinition = content === null ? null : managedDefinition;
		const manager = await readSystemdManagerCommand(env, localDefinition, unsetEnvironment, opts, locationOnly).then((command) => {
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
//#endregion
export { readStateDirDotEnvFromStateDir as A, isSystemctlMissing as B, SYSTEMD_DEFAULT_STOP_TIMEOUT_MS as C, collectDurableServiceEnvVarSources as D, serializeSystemdEnvironmentFile as E, execSystemctl as F, isSystemdUserServiceAvailable as G, isSystemdUnitMissingDetail as H, execSystemctlUser as I, systemdInspectionError as J, readSystemctlDetail as K, isNonFatalSystemdInstallProbeError as L, disableSystemdUserUnitForRemoval as M, execBusctlSystem as N, collectDurableServiceEnvVars as O, execBusctlUser as P, isRunningAsRoot as R, captureSystemdServiceIdentity as S, readSystemdEnvironmentFile as T, isSystemdUnitNotEnabled as U, isSystemdUnitActive as V, isSystemdUserScopeUnavailable as W, refreshSystemdUnitPolicy as _, resolveInstalledSystemdServiceNameCandidates as a, splitSystemdLogicalLines as b, resolveSystemdServiceName as c, SYSTEMD_FIXED_POLICY as d, buildSystemdUnit as f, preserveSystemdUnitPolicy as g, parseSystemdInlineEnvironment as h, readSystemdServiceExecStartAsRoot as i, assertSystemdAvailable as j, isUnresolvedShellReference as k, resolveSystemdUnitPath as l, parseSystemdExecStart as m, readSystemdServiceCommandLocation as n, resolveLegacyNodeSystemdEnvironmentFilePath as o, parseSystemdEnvAssignments as p, reloadSystemdUserManager as q, readSystemdServiceExecStart as r, resolveSystemdEnvironmentFilePath as s, isNodeSystemdEnvironment as t, resolveSystemdUnitPathForName as u, renderSystemdEnvAssignment as v, parseSystemdTimeSpanMs as w, activateSystemdServiceIdentity as x, renderSystemdEnvironmentFile as y, isSystemctlAvailable as z };
