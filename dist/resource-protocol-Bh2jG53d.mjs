import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { t as SpawnBrokerError } from "./protocol-foRdUdX7.mjs";
import { deserialize, serialize } from "node:v8";
//#region src/process/spawn-broker/ipc.ts
const FRAME_BYTES = 1048576;
const MAX_PENDING_BYTES = 268435456;
const MAX_PENDING_MESSAGES = 1024;
const FRAME_KIND = "openclaw-spawn-broker-frame";
/** Frame large inputs/results while bounding both native writes and retained payloads. */
function createBrokerSender(send) {
	let bytes = 0;
	let messages = 0;
	let sequence = 0;
	let previous = Promise.resolve();
	const write = (message, handle, initiateSpawn) => new Promise((resolve, reject) => {
		try {
			const launch = () => send(message, handle, (error) => error ? reject(error) : resolve());
			if (initiateSpawn) initiateSpawn(launch);
			else launch();
		} catch (error) {
			reject(toErrorObject(error, "Spawn broker IPC write failed"));
		}
	});
	const enqueue = (size, operation) => {
		if (bytes + size > 268435456 || messages >= 1024) return Promise.reject(new SpawnBrokerError("Spawn broker IPC capacity exceeded"));
		bytes += size;
		messages += 1;
		const completion = previous.then(operation);
		previous = completion.then(() => {}, () => {});
		return completion.finally(() => {
			bytes -= size;
			messages -= 1;
		});
	};
	const sender = (message, handle, initiateSpawn) => {
		const payload = serialize(message);
		const size = payload.byteLength;
		if (size > FRAME_BYTES && handle) return Promise.reject(new SpawnBrokerError("Spawn broker handle metadata exceeds one IPC frame"));
		const id = ++sequence;
		const operation = async () => {
			if (size <= FRAME_BYTES) {
				await write(message, handle, initiateSpawn);
				return;
			}
			for (let offset = 0; offset < size; offset += FRAME_BYTES) {
				const frame = {
					kind: FRAME_KIND,
					id,
					total: size,
					offset,
					bytes: payload.subarray(offset, offset + FRAME_BYTES)
				};
				await write(frame, void 0, offset + FRAME_BYTES >= size ? initiateSpawn : void 0);
			}
		};
		return enqueue(size, operation);
	};
	return Object.assign(sender, { reserve(run) {
		return enqueue(FRAME_BYTES, () => run(async (message) => {
			if (serialize(message).byteLength > FRAME_BYTES) throw new SpawnBrokerError("Spawn broker reserved publication exceeds one IPC frame");
			await write(message);
		}));
	} });
}
/** Only the version-matched private peer can supply frames on this channel. */
function createBrokerReceiver() {
	let pending;
	const clear = () => {
		pending = void 0;
	};
	return {
		receive(message) {
			if (!message || typeof message !== "object" || !("kind" in message) || message.kind !== FRAME_KIND) {
				clear();
				return message;
			}
			const frame = message;
			if (!Number.isSafeInteger(frame.id) || !Number.isSafeInteger(frame.total) || frame.total <= FRAME_BYTES || frame.total > 268435456 || !Number.isSafeInteger(frame.offset) || !Buffer.isBuffer(frame.bytes) || frame.bytes.length === 0 || frame.bytes.length > FRAME_BYTES) throw new SpawnBrokerError("Invalid spawn broker IPC frame");
			let assembly = pending?.id === frame.id ? pending : void 0;
			if (!assembly) {
				if (frame.offset !== 0) throw new SpawnBrokerError("Spawn broker receive capacity exceeded");
				pending = assembly = {
					id: frame.id,
					total: frame.total,
					received: 0,
					chunks: []
				};
			}
			if (assembly.total !== frame.total || assembly.received !== frame.offset || assembly.received + frame.bytes.length > assembly.total) throw new SpawnBrokerError("Out-of-order spawn broker IPC frame");
			assembly.chunks.push(frame.bytes);
			assembly.received += frame.bytes.length;
			if (assembly.received < assembly.total) return;
			clear();
			return deserialize(Buffer.concat(assembly.chunks, assembly.total));
		},
		clear
	};
}
//#endregion
//#region src/infra/worker-native-error.ts
const errorConstructors = new Map([
	EvalError,
	RangeError,
	ReferenceError,
	SyntaxError,
	TypeError,
	URIError,
	Error
].map((constructor) => [constructor.name, constructor]));
/** Node's Worker error events use prototype-only Errors that a second clone would erase. */
function encodeNativeWorkerFailure(value) {
	const seen = /* @__PURE__ */ new Map();
	const encode = (current) => {
		if (!(current instanceof Error)) return {
			kind: "value",
			value: current
		};
		const prior = seen.get(current);
		if (prior) return prior;
		const node = {
			kind: "error",
			constructorName: current instanceof AggregateError ? "AggregateError" : current instanceof SuppressedError ? "SuppressedError" : [...errorConstructors].find(([, Constructor]) => current instanceof Constructor)?.[0] ?? "Error",
			name: current.name,
			message: current.message,
			stack: current.stack
		};
		seen.set(current, node);
		const code = Object.getOwnPropertyDescriptor(current, "code")?.value;
		if (typeof code === "string" || typeof code === "number") node.code = code;
		for (const key of ["errcode", "errno"]) {
			const field = Object.getOwnPropertyDescriptor(current, key)?.value;
			if (typeof field === "number") node[key] = field;
		}
		if (Object.hasOwn(current, "cause")) node.cause = encode(current.cause);
		const errors = Object.getOwnPropertyDescriptor(current, "errors")?.value;
		if (Array.isArray(errors)) node.errors = errors.map(encode);
		if (current instanceof SuppressedError || current.name === "SuppressedError") for (const key of ["error", "suppressed"]) {
			const field = Object.getOwnPropertyDescriptor(current, key);
			if (field && "value" in field) node[key] = encode(field.value);
		}
		return node;
	};
	return encode(value);
}
function decodeNativeWorkerFailure(value) {
	const seen = /* @__PURE__ */ new Map();
	const decode = (current) => {
		if (current.kind === "value") return current.value;
		const prior = seen.get(current);
		if (prior) return prior;
		const Constructor = errorConstructors.get(current.constructorName) ?? Error;
		const error = current.constructorName === "AggregateError" ? new AggregateError([], current.message) : current.constructorName === "SuppressedError" ? new SuppressedError(void 0, void 0, current.message) : new Constructor(current.message);
		seen.set(current, error);
		error.name = current.name;
		error.stack = current.stack;
		const defineField = (key, fieldValue, enumerable = false) => {
			Object.defineProperty(error, key, {
				value: fieldValue,
				writable: true,
				configurable: true,
				enumerable
			});
		};
		for (const key of [
			"code",
			"errcode",
			"errno"
		]) if (current[key] !== void 0) defineField(key, current[key], true);
		if (current.cause) defineField("cause", decode(current.cause));
		if (current.errors) defineField("errors", current.errors.map(decode));
		for (const key of ["error", "suppressed"]) {
			const failure = current[key];
			if (failure) defineField(key, decode(failure));
		}
		return error;
	};
	return decode(value);
}
//#endregion
//#region src/process/spawn-broker/resource-protocol.ts
const SPAWN_BROKER_STARTUP_TIMEOUT_MS = 15e3;
const monotonic = process.hrtime.bigint.bind(process.hrtime);
/** Native startup shares the host's monotonic clock across Node contexts. */
function spawnBrokerStartupNowMs() {
	return Number(monotonic() / 1000000n);
}
/** The domain decoder, not a transport adapter, restores this original cleanup payload. */
var BrokerNativeResourceCloseError = class extends Error {
	constructor(payload) {
		super("Native resource cleanup failed");
		this.payload = payload;
		this.name = "BrokerNativeResourceCloseError";
	}
};
//#endregion
export { encodeNativeWorkerFailure as a, createBrokerReceiver as c, decodeNativeWorkerFailure as i, createBrokerSender as l, SPAWN_BROKER_STARTUP_TIMEOUT_MS as n, MAX_PENDING_BYTES as o, spawnBrokerStartupNowMs as r, MAX_PENDING_MESSAGES as s, BrokerNativeResourceCloseError as t };
