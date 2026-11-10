import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { i as isPidAlive, r as getProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as awaitWithinDeadline, r as scheduleAbsoluteDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-DaL1xmcH.mjs";
import { i as ServiceOwnershipRefusalError, o as assertServiceInspectionFallbackAllowed, r as ServiceInspectionError } from "./service-inspection-error-ozNMOrIE.mjs";
import { d as runServiceInspectionGuard, f as withServiceInspectionBudget, i as assertGatewayServiceUpdateCurrent, u as getServiceInspectionClock } from "./service-update-authority-Ddw1lcTH.mjs";
import { t as execFileUtf8 } from "./exec-file-CvWTTVXI.mjs";
import * as fs$1 from "node:fs";
import os from "node:os";
import path from "node:path";
import { ProcSafeError } from "@openclaw/proc-safe/errors";
import { SystemdBus } from "@openclaw/proc-safe/systemd";
//#region src/daemon/systemd-busctl-legacy.ts
const MAX_BYTES = 1048576;
const MAX_VALUES$1 = 16384;
const SIGNATURES = /* @__PURE__ */ new Set([
	"s",
	"o",
	"u",
	"b",
	"as",
	"a(sb)",
	"a(sasbttttuii)"
]);
const ESCAPES = {
	a: 7,
	b: 8,
	f: 12,
	n: 10,
	r: 13,
	t: 9,
	v: 11,
	"\\": 92,
	"\"": 34,
	"'": 39
};
function invalid() {
	throw new Error("Invalid legacy busctl output");
}
function decodeLegacyBusctlOutput(stdout, signatures, methodReply) {
	if (Buffer.byteLength(stdout) > MAX_BYTES || signatures.length === 0 || signatures.length > MAX_VALUES$1) return invalid();
	const lines = stdout.replace(/\r?\n$/, "").split(/\r?\n/);
	if (lines.length !== signatures.length) return invalid();
	let remaining = MAX_VALUES$1;
	const consume = () => {
		if (--remaining < 0) invalid();
	};
	return lines.map((line, index) => {
		const signature = signatures[index];
		if (!signature || !SIGNATURES.has(signature) || !line.startsWith(`${signature} `)) return invalid();
		let offset = signature.length;
		const token = (quoted) => {
			if (line[offset++] !== " ") return invalid();
			if (!quoted) {
				const start = offset;
				while (offset < line.length && line[offset] !== " ") offset++;
				return line.slice(start, offset);
			}
			if (line[offset++] !== "\"") return invalid();
			const bytes = [];
			while (offset < line.length) {
				const char = line.charAt(offset++);
				if (char === "\"") {
					if (bytes.includes(0)) return invalid();
					return new TextDecoder("utf-8", {
						fatal: true,
						ignoreBOM: true
					}).decode(Uint8Array.from(bytes));
				}
				if (char === "\\") {
					const escape = line[offset++];
					if (escape === void 0) return invalid();
					const escapedByte = Object.hasOwn(ESCAPES, escape) ? ESCAPES[escape] : void 0;
					if (escapedByte !== void 0) bytes.push(escapedByte);
					else {
						const octal = line.slice(offset - 1, offset + 2);
						if (!/^[0-3][0-7]{2}$/.test(octal)) return invalid();
						bytes.push(Number.parseInt(octal, 8));
						offset += 2;
					}
				} else {
					const byte = char.charCodeAt(0);
					if (byte < 32 || byte >= 127) return invalid();
					bytes.push(byte);
				}
			}
			return invalid();
		};
		const integer = (type) => {
			const raw = token(false);
			if (!/^(?:0|[1-9][0-9]*|-[1-9][0-9]*)$/.test(raw) || raw.length > 20) return invalid();
			const value = BigInt(raw);
			if (value < (type === "i" ? -2147483648n : 0n) || value > (type === "i" ? 2147483647n : type === "t" ? 18446744073709551615n : 4294967295n)) return invalid();
			return Number(value);
		};
		const read = (type) => {
			consume();
			if (type.startsWith("a")) {
				const count = integer("u");
				if (count > remaining) return invalid();
				return Array.from({ length: count }, () => read(type.slice(1)));
			}
			if (type === "(sb)") return [read("s"), read("b")];
			if (type === "(sasbttttuii)") return [
				"s",
				"as",
				"b",
				"t",
				"t",
				"t",
				"t",
				"u",
				"i",
				"i"
			].map(read);
			if (type === "s" || type === "o") {
				const value = token(true);
				if (type === "o" && !/^(?:\/|(?:\/[A-Za-z0-9_]+)+)$/.test(value)) return invalid();
				return value;
			}
			if (type === "b") {
				const value = token(false);
				if (value !== "true" && value !== "false") return invalid();
				return value === "true";
			}
			if (type === "u" || type === "i" || type === "t") return integer(type);
			return invalid();
		};
		const value = read(signature);
		if (offset !== line.length) return invalid();
		return methodReply ? [value] : value;
	});
}
//#endregion
//#region src/daemon/systemd-unavailable.ts
/** Classifies systemd/systemctl unavailable errors into user-facing categories. */
/** Failed user routes alone cannot distinguish a missing manager from a missing session bus. */
async function resolveUnavailableSystemdInspectionReason(reason, env, deadline) {
	const { execFileUtf8 } = await import("./exec-file-KWR8-PdY.mjs");
	const now = getServiceInspectionClock();
	const timeout = Math.floor(deadline - now());
	if (timeout <= 0) return reason;
	const result = await execFileUtf8("systemctl", ["--system", "is-system-running"], {
		env: {
			...process.env,
			...env
		},
		timeout,
		killSignal: "SIGKILL"
	});
	return reason === "systemd-busctl-unavailable" && result.termination === "error" && result.errorCode === "ENOENT" || result.termination === "exit" && (result.stdout.trim() === "offline" || result.stderr.includes("System has not been booted with systemd")) ? "service-manager-unavailable" : reason;
}
function isSystemctlMissingDetail(detail) {
	const normalized = normalizeLowercaseStringOrEmpty(detail);
	return normalized.includes("not found") || normalized.includes("no such file or directory") || normalized.includes("spawn systemctl enoent") || normalized.includes("spawn systemctl eacces") || normalized.includes("systemctl not available");
}
function isSystemdUserBusUnavailableDetail(detail) {
	const normalized = normalizeLowercaseStringOrEmpty(detail);
	return normalized.includes("failed to connect to bus") || normalized.includes("failed to connect to user scope bus") || normalized.includes("dbus_session_bus_address") || normalized.includes("xdg_runtime_dir") || normalized === "call failed: process org.freedesktop.systemd1 exited with status 1" || normalized === "call failed: the name org.freedesktop.systemd1 was not provided by any .service files" || normalized.includes("enomedium") || normalized.includes("no medium found");
}
function classifySystemdUnavailableDetail(detail) {
	const normalized = normalizeLowercaseStringOrEmpty(detail);
	if (!normalized) return null;
	if (isSystemdUserBusUnavailableDetail(normalized)) return "user_bus_unavailable";
	if (isSystemctlMissingDetail(normalized)) return "missing_systemctl";
	if (normalized.includes("systemctl --user unavailable") || normalized.includes("systemd user services are required") || normalized.includes("not been booted with systemd") || normalized.includes("not supported")) return "generic_unavailable";
	return null;
}
//#endregion
//#region src/daemon/systemd-peer-queue.ts
/** One sd-bus connection; callers may expire while waiting, disposal still joins native work. */
function createSystemdPeerQueue() {
	let tail = Promise.resolve();
	return {
		drain: () => tail,
		run(deadline, execute, now = getServiceInspectionClock()) {
			return new Promise((resolve, reject) => {
				let expired = false;
				const expire = () => {
					expired = true;
					reject(new ServiceInspectionError("systemd-inspection-deadline-exceeded"));
				};
				if (deadline - now() <= 0) {
					expire();
					return;
				}
				const cancelDeadline = scheduleAbsoluteDeadline(deadline, expire, now);
				tail = tail.then(async () => {
					cancelDeadline();
					if (expired || now() >= deadline) {
						expire();
						return;
					}
					try {
						resolve(await execute());
					} catch (error) {
						reject(error instanceof Error ? error : new Error("Original systemd manager peer query failed.", { cause: error }));
					}
				}).then(() => {}, reject);
			});
		}
	};
}
//#endregion
//#region src/daemon/systemd-peer-native.ts
/** OpenClaw admission and budgets around native-owned systemd connections. */
const unavailable = () => /* @__PURE__ */ new Error("Original systemd manager peer inspection is unavailable.");
const MAX_VALUES = 16384;
const MAX_STRING_BYTES = 1048576;
function remaining(deadline, now) {
	assertGatewayServiceUpdateCurrent();
	const timeoutMs = deadline - now();
	if (timeoutMs <= 0) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
	return timeoutMs;
}
function signature(value) {
	switch (value) {
		case "s":
		case "o":
		case "u":
		case "i":
		case "t":
		case "b":
		case "(sb)":
		case "(sus)":
		case "(sasbttttuii)":
		case "as":
		case "ao":
		case "au":
		case "ai":
		case "at":
		case "ab":
		case "a(sb)":
		case "a(sus)":
		case "a(sasbttttuii)": return value;
		default: throw unavailable();
	}
}
/** Methods, unlike properties, carry their own wire signature in the reply. */
function matchesReply(value, expected) {
	if (expected.startsWith("a")) return Array.isArray(value) && value.every((entry) => matchesReply(entry, expected.slice(1)));
	switch (expected) {
		case "s":
		case "o": return typeof value === "string";
		case "u":
		case "i": return typeof value === "number" && Number.isInteger(value);
		case "t": return typeof value === "bigint";
		case "b": return typeof value === "boolean";
		case "(sb)":
		case "(sus)":
		case "(sasbttttuii)": {
			const fields = expected === "(sb)" ? ["s", "b"] : expected === "(sus)" ? [
				"s",
				"u",
				"s"
			] : [
				"s",
				"as",
				"b",
				"t",
				"t",
				"t",
				"t",
				"u",
				"i",
				"i"
			];
			return Array.isArray(value) && value.length === fields.length && fields.every((field, index) => matchesReply(value[index], field));
		}
		default: return false;
	}
}
function translateFailure(error) {
	if (error instanceof ProcSafeError && error.code === "access-denied" && error.details?.reason === "peer-uid-mismatch") throw new ServiceOwnershipRefusalError("systemd-manager-changed");
	if (error instanceof ProcSafeError && error.code === "timeout") throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
	throw error;
}
/** The caller already authenticated this exact manager through its selected broker. */
async function openSystemdPrivatePeer(address, expected, deadline) {
	return openSystemdConnection((timeoutMs) => SystemdBus.connectPrivatePeer(address, { timeoutMs }), deadline, expected);
}
/** One broker connection: unique names never cross a reconnect or route fallback. */
async function openSystemdBroker(address, deadline) {
	return openSystemdConnection((timeoutMs) => SystemdBus.connectBroker(address, { timeoutMs }), deadline);
}
/** Preserve systemctl's explicit user@ machine route on one broker connection. */
async function openSystemdMachineBroker(machine, deadline) {
	return openSystemdConnection((timeoutMs) => SystemdBus.connectMachineBroker(machine, { timeoutMs }), deadline);
}
/** Ordinary local reads authenticate the connected manager without a session broker. */
async function openSystemdUserManager(address, deadline) {
	return openSystemdConnection((timeoutMs) => SystemdBus.connectUserManager(address, { timeoutMs }), deadline);
}
async function openSystemdConnection(connect, deadline, expected) {
	const admissionNow = getServiceInspectionClock();
	let identity = expected;
	const bus = await connect(remaining(deadline, admissionNow)).catch(translateFailure);
	const peer = "peer" in bus ? bus.peer : void 0;
	let closed = false;
	const queue = createSystemdPeerQueue();
	let closing;
	const close = () => {
		closed = true;
		return closing ??= queue.drain().then(() => bus.close());
	};
	const verify = () => {
		assertGatewayServiceUpdateCurrent();
		if (closed) throw unavailable();
		if (identity) {
			const startTime = getProcessStartTime(identity.pid);
			if (startTime !== null && startTime !== identity.startTime) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
			if (startTime === null || !isPidAlive(identity.pid)) throw unavailable();
		}
	};
	const verifyConnection = () => {
		verify();
		if (!peer) return;
		const { pid, uid } = peer;
		if (!identity) {
			const startTime = getProcessStartTime(pid);
			if (!isPidAlive(pid) || startTime === null) throw unavailable();
			identity = {
				uid,
				pid,
				startTime
			};
		}
		if (pid !== identity.pid || uid !== identity.uid) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
		verify();
	};
	try {
		remaining(deadline, admissionNow);
		verifyConnection();
	} catch (error) {
		await close();
		throw error;
	}
	const execute = async (args, signatures, until, assertCurrent, beforeDispatch, now, mutationTimeoutMs) => {
		let mutationDeadline;
		const check = () => {
			remaining(until, now);
			runServiceInspectionGuard(assertCurrent);
			verifyConnection();
			if (mutationDeadline !== void 0 && performance.now() >= mutationDeadline) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
		};
		const [operation, destination, path, iface, member] = args;
		if (!destination || !path || !iface || !member) throw unavailable();
		const target = {
			...peer ? {} : { destination },
			path,
			interface: iface,
			member
		};
		let values = MAX_VALUES;
		let bytes = MAX_STRING_BYTES;
		const account = (value) => {
			if (--values < 0) throw unavailable();
			if (Array.isArray(value)) for (const entry of value) account(entry);
			else if (typeof value === "string") {
				bytes -= Buffer.byteLength(value);
				if (bytes < 0) throw unavailable();
			}
		};
		const options = () => ({
			timeoutMs: remaining(until, now),
			replyBudgetBytes: 1179648
		});
		check();
		if (operation === "get-property") {
			if (args.length - 4 !== signatures.length) throw unavailable();
			const result = [];
			for (let index = 0; index < signatures.length; index++) {
				const property = args[index + 4];
				if (!property) throw unavailable();
				const expectedSignature = signature(signatures[index]);
				check();
				const value = await bus.getProperty({
					...target,
					member: property
				}, expectedSignature, options()).catch(translateFailure);
				check();
				account(value);
				result.push(value);
			}
			return result;
		}
		if (operation !== "call" || signatures.length > 1) throw unavailable();
		const methodArgs = [];
		if (args[5] === "s" && args.length === 7 && args[6] !== void 0) methodArgs.push({
			type: "s",
			value: args[6]
		});
		else if (args[5] === "ss" && args.length === 8 && args[6] !== void 0 && args[7] !== void 0) methodArgs.push({
			type: "s",
			value: args[6]
		}, {
			type: "s",
			value: args[7]
		});
		else if (args.length !== 5) throw unavailable();
		const expectedSignature = signatures.length ? signature(signatures[0]) : void 0;
		check();
		beforeDispatch?.();
		const callOptions = options();
		if (mutationTimeoutMs !== void 0) {
			callOptions.timeoutMs = Math.min(callOptions.timeoutMs, mutationTimeoutMs);
			mutationDeadline = performance.now() + callOptions.timeoutMs;
		}
		let reply;
		try {
			reply = await bus.call(target, methodArgs, callOptions);
		} catch (error) {
			check();
			const name = error instanceof ProcSafeError ? error.details?.dbusErrorName : void 0;
			if ((member === "GetUnit" || member === "LoadUnit") && name === "org.freedesktop.systemd1.NoSuchUnit" || member === "GetUnitFileState" && [
				"org.freedesktop.systemd1.NoSuchUnit",
				"org.freedesktop.systemd1.NoSuchUnitFile",
				"org.freedesktop.DBus.Error.FileNotFound"
			].includes(String(name))) return null;
			translateFailure(error);
		}
		check();
		if (!Array.isArray(reply) || reply.length !== signatures.length || expectedSignature && !matchesReply(reply[0], expectedSignature)) throw unavailable();
		if (expectedSignature) {
			account(reply[0]);
			return [reply];
		}
		return [];
	};
	return {
		verify,
		close,
		query(args, signatures, until, assertCurrent, beforeDispatch, mutationTimeoutMs) {
			const now = getServiceInspectionClock();
			return queue.run(until, () => execute(args, signatures, until, assertCurrent, beforeDispatch, now, mutationTimeoutMs), now);
		}
	};
}
//#endregion
//#region src/daemon/systemd-user-transport.ts
const transports = /* @__PURE__ */ new Map();
const manager = "org.freedesktop.systemd1";
const versionArgs = [
	"get-property",
	manager,
	"/org/freedesktop/systemd1",
	`${manager}.Manager`,
	"Version"
];
var SystemdTransportInspectionTimeout = class extends ServiceInspectionError {
	constructor(check) {
		super("systemd-inspection-deadline-exceeded");
		this.message = `${this.message} Stalled check: ${check}.`;
	}
};
const addressFor = (socket) => `unix:path=${encodeURIComponent(socket).replaceAll("%2F", "/")}`;
const transportKey = (env, uid = process.geteuid?.()) => {
	const source = {
		...process.env,
		...env
	};
	return JSON.stringify([
		uid,
		source.USER,
		source.LOGNAME,
		source.SUDO_USER,
		source.XDG_RUNTIME_DIR?.trim() || `/run/user/${uid}`,
		source.DBUS_SESSION_BUS_ADDRESS?.trim()
	]);
};
/** Presentation consumes the recorded route without creating another probe. */
async function readSystemdUserTransport(env) {
	return (await transports.get(transportKey(env))?.catch(() => void 0))?.transport;
}
async function resolveSystemdUserTransport(env, deadline = getServiceInspectionClock()() + 5e3, assertCurrent, purpose = "inspection") {
	return await withServiceInspectionBudget(async (inspectionBudget) => {
		let checking = "cached user-manager route";
		const check = () => {
			if (inspectionBudget.now() >= deadline) throw new SystemdTransportInspectionTimeout(checking);
			assertGatewayServiceUpdateCurrent();
			runServiceInspectionGuard(assertCurrent);
			if (inspectionBudget.now() >= deadline) throw new SystemdTransportInspectionTimeout("custody/admission guards");
		};
		const uid = process.geteuid?.();
		const { machineUser, preferMachineScope } = resolveSystemctlUserScope(env);
		if (preferMachineScope && machineUser) return {
			kind: "machine",
			user: machineUser
		};
		if (process.platform !== "linux" || uid === void 0) return;
		check();
		const source = {
			...process.env,
			...env
		};
		const runtimeDir = source.XDG_RUNTIME_DIR?.trim() || `/run/user/${uid}`;
		const explicit = source.DBUS_SESSION_BUS_ADDRESS?.trim();
		const key = transportKey(source, uid);
		const joined = transports.has(key);
		const discovery = getOrCreatePromise(transports, key, () => Promise.resolve().then(select), { cacheRejections: false });
		let selected;
		try {
			selected = await awaitWithinDeadline(() => discovery, deadline, () => inspectionBudget.now());
		} catch (error) {
			assertServiceInspectionFallbackAllowed(error);
			check();
			if (joined) return await resolveSystemdUserTransport(env, deadline, assertCurrent, purpose);
			throw error;
		}
		if (selected === ABSOLUTE_DEADLINE_EXPIRED) {
			if (!joined) await discovery.catch(assertServiceInspectionFallbackAllowed);
			check();
			throw new SystemdTransportInspectionTimeout(checking);
		}
		check();
		if (joined && purpose === "admission" && selected.timedOut) {
			if (transports.get(key) === discovery) transports.delete(key);
			return await resolveSystemdUserTransport(env, deadline, assertCurrent, purpose);
		}
		return selected.transport;
		async function select() {
			const runtimeAddress = addressFor(path.posix.join(runtimeDir, "bus"));
			const socket = path.posix.join(runtimeDir, "systemd/private");
			const candidates = [
				...explicit ? [{
					kind: "session-bus",
					address: explicit,
					runtimeDir
				}] : [],
				...explicit !== runtimeAddress && fs$1.existsSync(path.posix.join(runtimeDir, "bus")) ? [{
					kind: "runtime-bus",
					address: runtimeAddress,
					runtimeDir
				}] : [],
				...path.posix.isAbsolute(socket) && fs$1.existsSync(socket) ? [{
					kind: "private",
					address: addressFor(socket),
					runtimeDir
				}] : [],
				...machineUser ? [{
					kind: "machine",
					user: machineUser
				}] : []
			];
			let reason = "systemd-user-bus-unavailable";
			let timedOut = false;
			let timedOutCheck = checking;
			for (const [index, candidate] of candidates.entries()) {
				checking = `${candidate.kind} Manager.Version`;
				check();
				const budget = Math.max(1, Math.floor((deadline - inspectionBudget.now()) / (candidates.length - index + 1)));
				const until = inspectionBudget.now() + budget;
				let connection;
				try {
					let version;
					if (candidate.kind === "private") {
						checking = "private manager connection";
						connection = await openSystemdUserManager(candidate.address, until);
						check();
						checking = "private Manager.Version";
						[version] = await connection.query(versionArgs, ["s"], until) ?? [];
					} else {
						const scope = candidate.kind === "machine" ? [
							"--machine",
							`${candidate.user}@`,
							"--user"
						] : ["--user"];
						const result = await execFileUtf8("busctl", [
							...scope,
							"--auto-start=no",
							...versionArgs
						], {
							env: candidate.kind === "machine" ? source : {
								...source,
								DBUS_SESSION_BUS_ADDRESS: candidate.address
							},
							timeout: budget,
							killSignal: "SIGKILL"
						});
						if (result.termination === "timeout" || result.termination === "no-output-timeout" || result.errorCode === "ETIMEDOUT") {
							timedOut = true;
							timedOutCheck = result.errorCode === "ETIMEDOUT" ? `${checking} native command admission` : checking;
						}
						if (result.termination === "exit" && result.code === 0) [version] = decodeLegacyBusctlOutput(result.stdout, ["s"], false);
						if (result.errorCode === "ENOENT") reason = "systemd-busctl-unavailable";
						else if (["EACCES", "EPERM"].includes(result.errorCode ?? "")) reason = "service-manager-access-denied";
					}
					check();
					if (typeof version === "string" && version.length > 0) return {
						transport: candidate,
						timedOut
					};
				} catch (error) {
					assertServiceInspectionFallbackAllowed(error);
					check();
					if (error instanceof SystemdTransportInspectionTimeout) throw error;
					if (inspectionBudget.now() >= until) {
						timedOut = true;
						timedOutCheck = checking;
					}
				} finally {
					await connection?.close();
				}
			}
			check();
			if (!timedOut && reason !== "service-manager-access-denied") {
				checking = "system manager availability";
				reason = await resolveUnavailableSystemdInspectionReason(reason, source, deadline);
				check();
			}
			throw timedOut ? new SystemdTransportInspectionTimeout(timedOutCheck) : new ServiceInspectionError(reason);
		}
	});
}
function readSystemctlEffectiveUser() {
	try {
		return os.userInfo().username;
	} catch {
		return null;
	}
}
function isNonRootUser(user) {
	return Boolean(user && user !== "root");
}
function resolveSystemctlUserScope(env) {
	const sudoUser = env.SUDO_USER?.trim() || null;
	const envUser = env.USER?.trim() || env.LOGNAME?.trim() || null;
	const effectiveUid = process.geteuid?.();
	const effectiveUser = readSystemctlEffectiveUser();
	const isEffectiveRoot = effectiveUid === void 0 ? effectiveUser === "root" : effectiveUid === 0;
	const hasRootUserManager = isEffectiveRoot && env.HOME?.trim() === "/root" && env.XDG_RUNTIME_DIR?.trim() === "/run/user/0" && Boolean(env.DBUS_SESSION_BUS_ADDRESS?.includes("/run/user/0/bus"));
	const isSudoToRoot = isEffectiveRoot && !hasRootUserManager && isNonRootUser(sudoUser);
	return {
		machineUser: hasRootUserManager ? null : isSudoToRoot ? sudoUser : isNonRootUser(envUser) ? envUser : isNonRootUser(sudoUser) ? sudoUser : effectiveUser || envUser || sudoUser || null,
		preferMachineScope: isSudoToRoot
	};
}
/** True when root-owned paths would be paired with the sudo caller's user manager. */
function hasSudoToRootSystemdUserManagerMismatch(env) {
	return resolveSystemctlUserScope(env).preferMachineScope;
}
/**
* Resolves the account whose user manager owns the service operation.
* Keep linger diagnostics on this identity so sudo never checks root while
* systemctl targets the invoking user's manager.
*/
function resolveSystemdUserServiceAccount(env) {
	const { machineUser } = resolveSystemctlUserScope(env);
	return machineUser ?? readSystemctlEffectiveUser() ?? env.USER?.trim() ?? env.LOGNAME?.trim() ?? null;
}
//#endregion
export { resolveSystemdUserTransport as a, openSystemdPrivatePeer as c, isSystemctlMissingDetail as d, isSystemdUserBusUnavailableDetail as f, resolveSystemdUserServiceAccount as i, openSystemdUserManager as l, decodeLegacyBusctlOutput as m, hasSudoToRootSystemdUserManagerMismatch as n, openSystemdBroker as o, resolveUnavailableSystemdInspectionReason as p, readSystemdUserTransport as r, openSystemdMachineBroker as s, SystemdTransportInspectionTimeout as t, classifySystemdUnavailableDetail as u };
