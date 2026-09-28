import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as getProcessStartTime, r as isPidAlive } from "./pid-alive-CXdZEzr_.mjs";
import { a as findServiceOwnershipRefusal, i as ServiceOwnershipRefusalError, r as ServiceInspectionError } from "./service-inspection-error-axo4k_qi.mjs";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-BXzjx6E8.mjs";
import { i as assertGatewayServiceUpdateCurrent } from "./service-update-authority-DujRnzx9.mjs";
import { t as execFileUtf8 } from "./exec-file-DUc4AFoc.mjs";
import { createRequire } from "node:module";
import * as fs$1 from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/daemon/systemd-busctl-legacy.ts
const MAX_BYTES = 1048576;
const MAX_VALUES = 16384;
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
	if (Buffer.byteLength(stdout) > MAX_BYTES || signatures.length === 0 || signatures.length > MAX_VALUES) return invalid();
	const lines = stdout.replace(/\r?\n$/, "").split(/\r?\n/);
	if (lines.length !== signatures.length) return invalid();
	let remaining = MAX_VALUES;
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
	const { execFileUtf8 } = await import("./exec-file-8vUaSynY.mjs");
	const timeout = Math.floor(deadline - performance.now());
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
function normalizeDetail(detail) {
	return normalizeLowercaseStringOrEmpty(detail);
}
function isSystemctlMissingDetail(detail) {
	const normalized = normalizeDetail(detail);
	return normalized.includes("not found") || normalized.includes("no such file or directory") || normalized.includes("spawn systemctl enoent") || normalized.includes("spawn systemctl eacces") || normalized.includes("systemctl not available");
}
function isSystemdUserBusUnavailableDetail(detail) {
	const normalized = normalizeDetail(detail);
	return normalized.includes("failed to connect to bus") || normalized.includes("failed to connect to user scope bus") || normalized.includes("dbus_session_bus_address") || normalized.includes("xdg_runtime_dir") || normalized === "call failed: process org.freedesktop.systemd1 exited with status 1" || normalized === "call failed: the name org.freedesktop.systemd1 was not provided by any .service files" || normalized.includes("enomedium") || normalized.includes("no medium found");
}
function classifySystemdUnavailableDetail(detail) {
	const normalized = normalizeDetail(detail);
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
		run(deadline, execute) {
			return new Promise((resolve, reject) => {
				let expired = false;
				const expire = () => {
					expired = true;
					reject(new ServiceInspectionError("systemd-inspection-deadline-exceeded"));
				};
				const remaining = deadline - performance.now();
				if (remaining <= 0) {
					expire();
					return;
				}
				const timer = setTimeout(expire, remaining);
				tail = tail.then(async () => {
					clearTimeout(timer);
					if (expired || performance.now() >= deadline) {
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
/** Typed private-peer reads through the platform sd-bus ABI, not a D-Bus codec. */
const require = createRequire(import.meta.url);
const unavailable = () => /* @__PURE__ */ new Error("Original systemd manager peer inspection is unavailable.");
const checked = (result) => {
	if (result < 0) throw unavailable();
	return result;
};
const invoke = (fn, ...args) => new Promise((resolve, reject) => {
	fn.async(...args, (error, result) => {
		if (error) reject(error);
		else try {
			resolve(checked(result));
		} catch (failure) {
			reject(failure instanceof Error ? failure : unavailable());
		}
	});
});
function loadApi() {
	const koffi = require("koffi");
	const library = koffi.load("libsystemd.so.0");
	const bind = (declaration) => library.func(declaration);
	return {
		koffi,
		errorSize: koffi.sizeof(koffi.struct({
			name: "void *",
			message: "void *",
			needFree: "int"
		})),
		errorHasName: bind("int sd_bus_error_has_name(void *error, const char *name)"),
		errorFree: bind("void sd_bus_error_free(void *error)"),
		newBus: bind("int sd_bus_new(_Out_ void **bus)"),
		userMachine: (machine, output) => invoke(bind("int sd_bus_open_user_machine(_Out_ void **bus, const char *machine)"), output, machine),
		address: bind("int sd_bus_set_address(void *bus, const char *address)"),
		client: bind("int sd_bus_set_bus_client(void *bus, int client)"),
		start: bind("int sd_bus_start(void *bus)"),
		ready: bind("int sd_bus_is_ready(void *bus)"),
		process: bind("int sd_bus_process(void *bus, void *message)"),
		wait: bind("int sd_bus_wait(void *bus, uint64_t timeout)"),
		timeout: bind("int sd_bus_set_method_call_timeout(void *bus, uint64_t timeout)"),
		credentials: bind("int sd_bus_get_owner_creds(void *bus, uint64_t mask, _Out_ void **creds)"),
		pid: bind("int sd_bus_creds_get_pid(void *creds, _Out_ int *pid)"),
		uid: bind("int sd_bus_creds_get_euid(void *creds, _Out_ uint32_t *uid)"),
		unrefCredentials: bind("void *sd_bus_creds_unref(void *creds)"),
		property: bind("int sd_bus_get_property(void *bus, const char *destination, const char *path, const char *interface, const char *member, void *error, _Out_ void **reply, const char *type)"),
		newCall: bind("int sd_bus_message_new_method_call(void *bus, _Out_ void **message, const char *destination, const char *path, const char *interface, const char *member)"),
		append: bind("int sd_bus_message_append_basic(void *message, char type, const char *value)"),
		autoStart: bind("int sd_bus_message_set_auto_start(void *message, int auto_start)"),
		call: bind("int sd_bus_call(void *bus, void *message, uint64_t timeout, void *error, _Out_ void **reply)"),
		basic: bind("int sd_bus_message_read_basic(void *message, char type, void *value)"),
		enter: bind("int sd_bus_message_enter_container(void *message, char type, const char *contents)"),
		exit: bind("int sd_bus_message_exit_container(void *message)"),
		end: bind("int sd_bus_message_at_end(void *message, int complete)"),
		unrefMessage: bind("void *sd_bus_message_unref(void *message)"),
		close: bind("void *sd_bus_close_unref(void *bus)")
	};
}
let api;
/** The caller already authenticated this exact manager through its selected broker. */
async function openSystemdPrivatePeer(address, expected, deadline) {
	return await openSystemdConnection(address, deadline, expected);
}
/** One broker connection: unique names never cross a reconnect or route fallback. */
async function openSystemdBroker(address, deadline) {
	return await openSystemdConnection(address, deadline);
}
/** Preserve systemctl's explicit user@ machine route on one broker connection. */
async function openSystemdMachineBroker(machine, deadline) {
	return await openSystemdConnection({ machine }, deadline);
}
/** Ordinary local reads authenticate the connected manager without a session broker. */
async function openSystemdUserManager(address, deadline) {
	const uid = process.geteuid?.();
	if (process.platform !== "linux" || uid === void 0) throw unavailable();
	return await openSystemdConnection(address, deadline, void 0, uid);
}
async function openSystemdConnection(address, deadline, expected, managerUid) {
	assertGatewayServiceUpdateCurrent();
	const privatePeer = expected !== void 0 || managerUid !== void 0;
	let identity = expected;
	const native = api ??= loadApi();
	const output = [null];
	if (typeof address === "string") checked(native.newBus(output));
	else await native.userMachine(address.machine, output);
	const bus = output[0];
	let closed = false;
	const queue = createSystemdPeerQueue();
	let closing;
	const remaining = (until) => {
		assertGatewayServiceUpdateCurrent();
		const value = until - performance.now();
		if (closed) throw unavailable();
		if (value <= 0) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
		return Math.max(1, Math.floor(value * 1e3));
	};
	const close = () => {
		closed = true;
		return closing ??= queue.drain().then(() => {
			native.close(bus);
		});
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
		if (!privatePeer) return;
		const credentials = [null];
		checked(native.credentials(bus, 17, credentials));
		try {
			const pid = [0];
			const uid = [0];
			checked(native.pid(credentials[0], pid));
			checked(native.uid(credentials[0], uid));
			if (pid[0] <= 0 || uid[0] >= 4294967295) throw unavailable();
			if (!identity) {
				if (uid[0] !== managerUid) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
				const startTime = getProcessStartTime(pid[0]);
				if (!isPidAlive(pid[0]) || startTime === null) throw unavailable();
				identity = {
					uid: uid[0],
					pid: pid[0],
					startTime
				};
			}
			if (pid[0] !== identity.pid || uid[0] !== identity.uid) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
			const startTime = getProcessStartTime(identity.pid);
			if (startTime === null) throw unavailable();
			if (startTime !== identity.startTime) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
		} finally {
			native.unrefCredentials(credentials[0]);
		}
	};
	try {
		if (typeof address === "string") {
			checked(native.address(bus, address));
			checked(native.client(bus, privatePeer ? 0 : 1));
			remaining(deadline);
			await invoke(native.start, bus);
		}
		while (!checked(native.ready(bus))) {
			remaining(deadline);
			if (!await invoke(native.process, bus, null)) await invoke(native.wait, bus, remaining(deadline));
		}
		remaining(deadline);
		verifyConnection();
	} catch (error) {
		await close();
		throw error;
	}
	const structs = {
		"(sb)": ["s", "b"],
		"(sus)": [
			"s",
			"u",
			"s"
		],
		"(sasbttttuii)": [
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
		]
	};
	const scalar = {
		s: "str",
		o: "str",
		u: "uint32_t",
		i: "int32_t",
		t: "uint64_t",
		b: "int32_t"
	};
	const read = (message, signature, budget) => {
		if (!message || !signature || --budget.values < 0) throw unavailable();
		if (signature.startsWith("a")) {
			checked(native.enter(message, 97, signature.slice(1)));
			const values = [];
			while (!checked(native.end(message, 0))) values.push(read(message, signature.slice(1), budget));
			checked(native.exit(message));
			return values;
		}
		const fields = structs[signature];
		if (fields) {
			checked(native.enter(message, 114, signature.slice(1, -1)));
			const values = fields.map((field) => read(message, field, budget));
			if (!checked(native.end(message, 0))) throw unavailable();
			checked(native.exit(message));
			return values;
		}
		const type = scalar[signature];
		if (!type) throw unavailable();
		const bytes = Buffer.alloc(8);
		if (checked(native.basic(message, signature.charCodeAt(0), bytes)) !== 1) throw unavailable();
		const value = native.koffi.decode(bytes, type);
		if (typeof value === "string") {
			budget.bytes -= Buffer.byteLength(value);
			if (budget.bytes < 0) throw unavailable();
		}
		if (signature === "b") {
			if (value !== 0 && value !== 1) throw unavailable();
			return value === 1;
		}
		return typeof value === "bigint" ? Number(value) : value;
	};
	const execute = async (args, signatures, until, assertCurrent) => {
		const check = () => {
			remaining(until);
			assertCurrent?.();
			verifyConnection();
		};
		check();
		const member = args[4];
		if (!member) throw unavailable();
		const values = [];
		const budget = {
			values: 16384,
			bytes: 1048576
		};
		if (args[0] === "get-property") {
			if (args.length - 4 !== signatures.length) throw unavailable();
			for (let index = 0; index < signatures.length; index++) {
				check();
				const reply = [null];
				checked(native.timeout(bus, remaining(until)));
				try {
					await invoke(native.property, bus, privatePeer ? null : args[1], args[2], args[3], args[index + 4], null, reply, signatures[index]);
					check();
					values.push(read(reply[0], signatures[index], budget));
					if (!checked(native.end(reply[0], 0))) throw unavailable();
				} finally {
					if (reply[0]) native.unrefMessage(reply[0]);
				}
			}
		} else {
			const message = [null], reply = [null];
			const error = Buffer.alloc(native.errorSize);
			try {
				checked(native.newCall(bus, message, privatePeer ? null : args[1], args[2], args[3], args[4]));
				checked(native.autoStart(message[0], 0));
				if (args[5] === "s" && args.length === 7) checked(native.append(message[0], 115, args[6]));
				else if (args[5] === "ss" && args.length === 8) {
					checked(native.append(message[0], 115, args[6]));
					checked(native.append(message[0], 115, args[7]));
				} else if (args.length !== 5) throw unavailable();
				check();
				try {
					await invoke(native.call, bus, message[0], remaining(until), error, reply);
				} catch (failure) {
					check();
					if (["GetUnit", "LoadUnit"].includes(member) && native.errorHasName(error, "org.freedesktop.systemd1.NoSuchUnit") || args[4] === "GetUnitFileState" && (native.errorHasName(error, "org.freedesktop.systemd1.NoSuchUnit") || native.errorHasName(error, "org.freedesktop.systemd1.NoSuchUnitFile") || native.errorHasName(error, "org.freedesktop.DBus.Error.FileNotFound"))) return null;
					throw failure;
				}
				check();
				if (signatures.length > 1) throw unavailable();
				if (signatures.length === 1) values.push([read(reply[0], signatures[0], budget)]);
				if (!checked(native.end(reply[0], 1))) throw unavailable();
			} finally {
				native.errorFree(error);
				if (message[0]) native.unrefMessage(message[0]);
				if (reply[0]) native.unrefMessage(reply[0]);
			}
		}
		check();
		return values;
	};
	return {
		verify,
		close,
		query(args, signatures, until, assertCurrent) {
			return queue.run(until, () => execute(args, signatures, until, assertCurrent));
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
const SYSTEMD_TRANSPORT_DEADLINE = new ServiceInspectionError("systemd-inspection-deadline-exceeded");
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
async function resolveSystemdUserTransport(env, deadline = performance.now() + 5e3, assertCurrent, purpose = "inspection") {
	const check = () => {
		assertGatewayServiceUpdateCurrent();
		assertCurrent?.();
		if (performance.now() >= deadline) throw SYSTEMD_TRANSPORT_DEADLINE;
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
	let pending = transports.get(key);
	const joined = pending !== void 0;
	if (!pending) {
		pending = select();
		transports.set(key, pending);
		pending.catch(() => {
			if (transports.get(key) === pending) transports.delete(key);
		});
	}
	const discovery = pending;
	let selected;
	try {
		selected = await awaitWithinDeadline(() => discovery, deadline, () => performance.now());
	} catch (error) {
		check();
		const refusal = findServiceOwnershipRefusal(error);
		if (refusal) throw refusal;
		if (joined) return await resolveSystemdUserTransport(env, deadline, assertCurrent, purpose);
		throw error;
	}
	check();
	if (selected === ABSOLUTE_DEADLINE_EXPIRED) throw SYSTEMD_TRANSPORT_DEADLINE;
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
		for (const [index, candidate] of candidates.entries()) {
			check();
			const budget = Math.max(1, Math.floor((deadline - performance.now()) / (candidates.length - index + 1)));
			const until = performance.now() + budget;
			let connection;
			try {
				let version;
				if (candidate.kind === "private") {
					connection = await openSystemdUserManager(candidate.address, until);
					check();
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
					check();
					if (result.termination === "timeout" || result.termination === "no-output-timeout") timedOut = true;
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
				check();
				const refusal = findServiceOwnershipRefusal(error);
				if (refusal) throw refusal;
				if (error === SYSTEMD_TRANSPORT_DEADLINE) throw error;
				timedOut ||= performance.now() >= until;
			} finally {
				await connection?.close();
			}
		}
		check();
		if (!timedOut && reason !== "service-manager-access-denied") {
			reason = await resolveUnavailableSystemdInspectionReason(reason, source, deadline);
			check();
		}
		throw timedOut ? SYSTEMD_TRANSPORT_DEADLINE : new ServiceInspectionError(reason);
	}
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
export { resolveSystemdUserTransport as a, openSystemdPrivatePeer as c, isSystemctlMissingDetail as d, isSystemdUserBusUnavailableDetail as f, resolveSystemdUserServiceAccount as i, openSystemdUserManager as l, decodeLegacyBusctlOutput as m, hasSudoToRootSystemdUserManagerMismatch as n, openSystemdBroker as o, resolveUnavailableSystemdInspectionReason as p, readSystemdUserTransport as r, openSystemdMachineBroker as s, SYSTEMD_TRANSPORT_DEADLINE as t, classifySystemdUnavailableDetail as u };
